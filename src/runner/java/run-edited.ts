import type { RunResult } from '../worker-run'
import type { CompileUnit } from './prepare'

/** Wall-clock limit for one run of compiled Java. */
export const EDITED_JAVA_TIME_LIMIT_MS = 10_000

export type CompileOutcome = { ok: true; wasm: Uint8Array; errors: string[] } | { ok: false; errors: string[]; message?: string }

type Diagnostic = { kind: string; severity: string; file: string; line: number; message: string }

let compilerWorker: Worker | null = null
let nextId = 1
const pending = new Map<number, (r: { ok: boolean; diagnostics: Diagnostic[]; wasm: Uint8Array | null; error?: string }) => void>()
const cache = new Map<string, Promise<CompileOutcome>>()

/** Compiler messages in javac's format, for the reader's file (support files are ours). */
function formatDiagnostics(diagnostics: Diagnostic[], userFile: string): string[] {
  return diagnostics
    .filter((d) => d.severity === 'error' || (d.severity === 'warning' && d.file === userFile))
    .map((d) => {
      if (d.kind === 'teavm') return `${d.severity}: ${d.message}`
      const where = d.file ? `${d.file}${d.line > 0 ? `:${d.line}` : ''}: ` : ''
      return `${where}${d.severity}: ${d.message}`
    })
}

/**
 * Compiles Java in the browser (javac, then TeaVM to WebAssembly). The first call loads the
 * compiler, about 7 MB; results are cached per source and input.
 */
export function compileJava(unit: CompileUnit): Promise<CompileOutcome> {
  const key = JSON.stringify([unit.mainClass, unit.files])
  const hit = cache.get(key)
  if (hit) return hit
  if (!compilerWorker) {
    compilerWorker = new Worker(new URL('./compiler-worker.ts', import.meta.url), { type: 'module' })
    compilerWorker.onmessage = (e) => {
      pending.get(e.data.id)?.(e.data)
      pending.delete(e.data.id)
    }
  }
  const id = nextId++
  const result = new Promise<CompileOutcome>((resolve) => {
    pending.set(id, (r) => {
      const errors = formatDiagnostics(r.diagnostics, unit.userFile)
      if (r.ok && r.wasm) resolve({ ok: true, wasm: r.wasm, errors })
      else resolve({ ok: false, errors, message: r.error })
    })
    compilerWorker!.postMessage({ id, files: unit.files, mainClass: 'RunnerMain' })
  })
  cache.set(key, result)
  if (cache.size > 20) cache.delete(cache.keys().next().value!)
  return result
}

/** Runs compiled Java in a fresh worker; stops it after EDITED_JAVA_TIME_LIMIT_MS. */
export function runCompiledJava(wasm: Uint8Array): Promise<RunResult> {
  return new Promise((resolve) => {
    const worker = new Worker(new URL('./wasm-run-worker.ts', import.meta.url), { type: 'module' })
    const start = performance.now()
    const timer = setTimeout(() => {
      worker.terminate()
      resolve({ kind: 'timeout', ms: performance.now() - start })
    }, EDITED_JAVA_TIME_LIMIT_MS)
    worker.onmessage = (e: MessageEvent<{ status: string; stdout: string; stderr: string; ms: number }>) => {
      clearTimeout(timer)
      worker.terminate()
      resolve({ kind: 'done', ...e.data })
    }
    worker.onerror = (e) => {
      clearTimeout(timer)
      worker.terminate()
      resolve({ kind: 'failed', message: e.message || 'The program could not be started.' })
    }
    // The cached bytes stay with the cache; the worker gets a copy.
    worker.postMessage({ wasm: wasm.slice() })
  })
}
