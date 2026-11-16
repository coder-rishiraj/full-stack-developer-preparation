import type { RunResult } from '../worker-run'

/**
 * Runs Java on a real JVM in the browser: CheerpJ (OpenJDK 21), in a hidden same-origin frame
 * (public/cheerpj/frame.html), which compiles with the JDK's own javac and runs the program
 * (public/cheerpj/runner.jar, from tools/cheerpj-runner/Runner.java). The JVM starts once and
 * stays warm between runs; a program that runs too long is stopped by replacing the frame.
 */

/** How long a program may run once the JVM is up. */
export const JVM_TIME_LIMIT_MS = 15_000
/** How long the first start of the JVM may take (it downloads the Java runtime). */
const JVM_START_LIMIT_MS = 180_000

export type JvmRun = { compileErrors: string[]; run: RunResult | null; message?: string }

type Result = { id: number; status: string; compileErrors: string; stdout: string; stderr: string; ms: number }

let frame: HTMLIFrameElement | null = null
let frameReady: Promise<void> | null = null
let jvmReady: Promise<void> | null = null
let markJvmReady: (() => void) | null = null
let warm = false
let nextId = 1
const pending = new Map<number, (r: Result) => void>()

window.addEventListener('message', (event: MessageEvent) => {
  if (!frame || event.source !== frame.contentWindow || event.origin !== window.location.origin) return
  const data = event.data as { type: string } & Partial<Result>
  if (data.type === 'jvm-ready') {
    warm = true
    markJvmReady?.()
  }
  else if (data.type === 'result' && typeof data.id === 'number') {
    pending.get(data.id)?.(data as Result)
    pending.delete(data.id)
  }
})

function ensureFrame(): Promise<void> {
  if (frame && frameReady) return frameReady
  const el = document.createElement('iframe')
  el.src = `${import.meta.env.BASE_URL}cheerpj/frame.html`
  el.title = 'Java runtime'
  el.setAttribute('aria-hidden', 'true')
  el.tabIndex = -1
  el.style.cssText = 'position:fixed;width:1px;height:1px;left:-10px;top:-10px;border:0;opacity:0;pointer-events:none'
  frame = el
  jvmReady = new Promise<void>((resolve) => (markJvmReady = resolve))
  frameReady = new Promise<void>((resolve) => {
    const onMessage = (event: MessageEvent) => {
      if (event.source === el.contentWindow && event.data?.type === 'ready') {
        window.removeEventListener('message', onMessage)
        resolve()
      }
    }
    window.addEventListener('message', onMessage)
  })
  document.body.appendChild(el)
  return frameReady
}

/** Stops everything running in the JVM by removing its frame; the next run starts a new one. */
function resetFrame() {
  frame?.remove()
  frame = null
  frameReady = null
  jvmReady = null
  warm = false
  for (const [id, resolve] of pending) resolve({ id, status: 'timeout', compileErrors: '', stdout: '', stderr: '', ms: 0 })
  pending.clear()
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
    frame!.contentWindow!.postMessage({ type: 'run', id, files, mainClass, input }, window.location.origin)
  })
  if (result.status === 'timeout') return { compileErrors: [], run: { kind: 'timeout', ms: result.ms } }
  if (result.status === 'failed') return { compileErrors: [], run: { kind: 'failed', message: result.stderr } }
  const compileErrors = result.compileErrors.split('\n').filter((l) => l.trim())
  if (result.status === 'compile-error') return { compileErrors, run: null }
  return { compileErrors, run: { kind: 'done', status: result.status, stdout: result.stdout, stderr: result.stderr, ms: result.ms } }
}
