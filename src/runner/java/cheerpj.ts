import type { RunResult } from '../worker-run'

/**
 * Runs Java on a real JVM in the browser: CheerpJ (OpenJDK 21), in a Web Worker
 * (public/cheerpj/worker.js), which compiles with the JDK's own javac and runs the program
 * (public/cheerpj/runner.jar, from tools/cheerpj-runner/Runner.java). The JVM starts once and
 * stays warm between runs; a program that runs too long is stopped by terminating the worker,
 * and its own thread means it never freezes the page.
 */

/** How long a program may run once the JVM is up. */
export const JVM_TIME_LIMIT_MS = 15_000
/** How long the first start of the JVM may take (it downloads the Java runtime). */
const JVM_START_LIMIT_MS = 180_000

export type JvmRun = { compileErrors: string[]; run: RunResult | null; message?: string }

type Result = { id: number; status: string; compileErrors: string; stdout: string; stderr: string; ms: number }
export type TestRun = { status: string; ms: number; stdout: string; stderr: string }
type TestsResult = { id: number; status: string; compileErrors: string; tests: TestRun[]; ms: number }
const pendingTests = new Map<number, (r: TestsResult) => void>()

let frame: Worker | null = null
let frameReady: Promise<void> | null = null
let jvmReady: Promise<void> | null = null
let markJvmReady: (() => void) | null = null
let warm = false
let nextId = 1
const pending = new Map<number, (r: Result) => void>()

function onMessage(event: MessageEvent) {
  const data = event.data as { type: string } & Partial<Result>
  if (data.type === 'jvm-ready') {
    warm = true
    markJvmReady?.()
  } else if (data.type === 'testsResult' && typeof data.id === 'number') {
    pendingTests.get(data.id)?.(data as unknown as TestsResult)
    pendingTests.delete(data.id)
  } else if (data.type === 'result' && typeof data.id === 'number') {
    pending.get(data.id)?.(data as Result)
    pending.delete(data.id)
  }
}

function ensureFrame(): Promise<void> {
  if (frame && frameReady) return frameReady
  const worker = new Worker(`${import.meta.env.BASE_URL}cheerpj/worker.js`)
  frame = worker
  jvmReady = new Promise<void>((resolve) => (markJvmReady = resolve))
  frameReady = new Promise<void>((resolve) => {
    worker.addEventListener('message', function ready(event: MessageEvent) {
      if (event.data?.type === 'ready') {
        worker.removeEventListener('message', ready)
        resolve()
      }
    })
  })
  worker.addEventListener('message', onMessage)
  return frameReady
}

/** Stops everything running in the JVM by terminating its worker; the next run starts a new one. */
function resetFrame() {
  frame?.terminate()
  frame = null
  frameReady = null
  jvmReady = null
  warm = false
  for (const [id, resolve] of pending) resolve({ id, status: 'timeout', compileErrors: '', stdout: '', stderr: '', ms: 0 })
  pending.clear()
  for (const [id, resolve] of pendingTests) resolve({ id, status: 'timeout', compileErrors: '', tests: [], ms: 0 })
  pendingTests.clear()
}

/** Whether the JVM is already running (later runs are fast). */
export function jvmIsWarm(): boolean {
  return warm
}

/**
 * Compiles `files` with javac and runs `mainClass` with `input` as standard input.
 * `onPhase('starting')` is reported while the JVM starts for the first time.
 */
export async function runOnJvm(
  files: Record<string, string>,
  mainClass: string,
  input: string,
  onPhase?: (phase: 'starting' | 'running') => void,
): Promise<JvmRun> {
  await ensureFrame()
  if (!warm) {
    onPhase?.('starting')
    const ok = await Promise.race([jvmReady!.then(() => true), new Promise<boolean>((r) => setTimeout(() => r(false), JVM_START_LIMIT_MS))])
    if (!ok) {
      resetFrame()
      return { compileErrors: [], run: null, message: 'The Java runtime did not start. Check your connection and run again.' }
    }
  }
  onPhase?.('running')
  const id = nextId++
  const result = await new Promise<Result>((resolve) => {
    const timer = setTimeout(() => {
      if (!pending.has(id)) return
      pending.delete(id)
      resetFrame()
      resolve({ id, status: 'timeout', compileErrors: '', stdout: '', stderr: '', ms: JVM_TIME_LIMIT_MS })
    }, JVM_TIME_LIMIT_MS)
    pending.set(id, (r) => {
      clearTimeout(timer)
      resolve(r)
    })
    frame!.postMessage({ type: 'run', id, files, mainClass, input })
  })
  if (result.status === 'timeout') return { compileErrors: [], run: { kind: 'timeout', ms: result.ms } }
  if (result.status === 'failed') return { compileErrors: [], run: { kind: 'failed', message: result.stderr } }
  const compileErrors = result.compileErrors.split('\n').filter((l) => l.trim())
  if (result.status === 'compile-error') return { compileErrors, run: null }
  return { compileErrors, run: { kind: 'done', status: result.status, stdout: result.stdout, stderr: result.stderr, ms: result.ms } }
}

export type TestsOutcome =
  | { kind: 'compile-error'; errors: string[] }
  | { kind: 'done'; tests: TestRun[]; ms: number; warnings: string[] }
  | { kind: 'timeout' }
  | { kind: 'failed'; message: string }

/**
 * Compiles `files` once and runs `mainClass` on each input. The call may take `limitMs`
 * (default JVM_TIME_LIMIT_MS plus 2 s per test); a program still running then is stopped and
 * the JVM restarts on the next call. Repeated calls with the same files reuse the compiled
 * classes.
 */
export async function runTestsOnJvm(
  files: Record<string, string>,
  mainClass: string,
  inputs: string[],
  onPhase?: (phase: 'starting' | 'running') => void,
  limitMs?: number,
): Promise<TestsOutcome> {
  await ensureFrame()
  if (!warm) {
    onPhase?.('starting')
    const ok = await Promise.race([jvmReady!.then(() => true), new Promise<boolean>((r) => setTimeout(() => r(false), JVM_START_LIMIT_MS))])
    if (!ok) {
      resetFrame()
      return { kind: 'failed', message: 'The Java runtime did not start. Check your connection and run again.' }
    }
  }
  onPhase?.('running')
  const id = nextId++
  const limit = limitMs ?? JVM_TIME_LIMIT_MS + 2000 * inputs.length
  const result = await new Promise<TestsResult>((resolve) => {
    const timer = setTimeout(() => {
      if (!pendingTests.has(id)) return
      pendingTests.delete(id)
      resetFrame()
      resolve({ id, status: 'timeout', compileErrors: '', tests: [], ms: limit })
    }, limit)
    pendingTests.set(id, (r) => {
      clearTimeout(timer)
      resolve(r)
    })
    frame!.postMessage({ type: 'runTests', id, files, mainClass, inputs })
  })
  const errors = result.compileErrors.split('\n').filter((l) => l.trim())
  if (result.status === 'timeout') return { kind: 'timeout' }
  if (result.status === 'failed') return { kind: 'failed', message: result.compileErrors }
  if (result.status === 'compile-error') return { kind: 'compile-error', errors }
  return { kind: 'done', tests: result.tests, ms: result.ms, warnings: errors }
}
