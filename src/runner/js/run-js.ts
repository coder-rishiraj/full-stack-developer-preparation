import { isTypeScript, needsCompiler, packagesUsed, programMode, type SourceLang } from './compile'
import type { OutputEvent, RunStatus } from './runtime'

export type JsRunResult = {
  /** TypeScript errors in tsc's format (TypeScript only; empty when there are none). */
  diagnostics: string[] | null
  events: OutputEvent[]
  status: RunStatus | 'timeout' | 'failed'
  ms: number
  message?: string
}

/** Wall-clock limit for one run. */
export const JS_TIME_LIMIT_MS = 10_000

let tsWorker: Worker | null = null
let nextId = 1
const pending = new Map<number, (r: { js?: string; diagnostics?: string[] | null; error?: string }) => void>()

function compile(code: string, lang: SourceLang, mode: 'script' | 'module') {
  if (!tsWorker) {
    tsWorker = new Worker(new URL('./ts-worker.ts', import.meta.url), { type: 'module' })
    tsWorker.onmessage = (e: MessageEvent<{ id: number; js?: string; diagnostics?: string[] | null; error?: string }>) => {
      pending.get(e.data.id)?.(e.data)
      pending.delete(e.data.id)
    }
  }
  const id = nextId++
  return new Promise<{ js?: string; diagnostics?: string[] | null; error?: string }>((resolve) => {
    pending.set(id, resolve)
    tsWorker!.postMessage({ id, code, lang, mode, check: isTypeScript(lang) })
  })
}

/** Compiles code for running (types removed, JSX and import/export converted), with type errors for TypeScript. */
export async function prepareJs(code: string, lang: SourceLang): Promise<{ js: string; diagnostics: string[] | null; error?: string }> {
  const mode = programMode(code)
  if (!needsCompiler(lang, mode)) return { js: code, diagnostics: null }
  const compiled = await compile(code, lang, mode)
  if (compiled.error !== undefined || compiled.js === undefined) return { js: '', diagnostics: null, error: compiled.error ?? 'compile failed' }
  return { js: compiled.js, diagnostics: compiled.diagnostics ?? null }
}

/**
 * Runs lesson code the way `node main.js` would (TypeScript: `tsc --strict`, then node).
 * `onPhase` reports when the TypeScript compiler is being loaded and when the program runs.
 */
export async function runJs(code: string, lang: SourceLang, onPhase?: (phase: 'compiling' | 'running') => void): Promise<JsRunResult> {
  const mode = programMode(code)
  let js = code
  let diagnostics: string[] | null = null
  if (needsCompiler(lang, mode)) {
    onPhase?.('compiling')
    const compiled = await compile(code, lang, mode)
    if (compiled.error !== undefined || compiled.js === undefined) {
      return { diagnostics: null, events: [], status: 'failed', ms: 0, message: compiled.error ?? 'compile failed' }
    }
    js = compiled.js
    diagnostics = compiled.diagnostics ?? null
  }
  onPhase?.('running')
  return new Promise((resolve) => {
    const events: OutputEvent[] = []
    let worker: Worker
    try {
      worker = new Worker(new URL('./run-worker.ts', import.meta.url), { type: 'module' })
    } catch (e) {
      resolve({ diagnostics, events, status: 'failed', ms: 0, message: e instanceof Error ? e.message : String(e) })
      return
    }
    const start = performance.now()
    const timer = setTimeout(() => {
      worker.terminate()
      resolve({ diagnostics, events, status: 'timeout', ms: performance.now() - start })
    }, JS_TIME_LIMIT_MS)
    worker.onmessage = (e: MessageEvent<{ type: 'output'; events: OutputEvent[] } | { type: 'done'; status: RunStatus; ms: number }>) => {
      if (e.data.type === 'output') {
        events.push(...e.data.events)
        return
      }
      clearTimeout(timer)
      worker.terminate()
      resolve({ diagnostics, events, status: e.data.status, ms: e.data.ms })
    }
    worker.onerror = (e) => {
      clearTimeout(timer)
      worker.terminate()
      resolve({ diagnostics, events, status: 'failed', ms: 0, message: e.message || 'The program could not be started.' })
    }
    worker.postMessage({ code: js, mode, packages: packagesUsed(code, lang) })
  })
}
