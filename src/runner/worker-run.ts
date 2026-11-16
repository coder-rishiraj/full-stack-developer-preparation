import type { Runnable } from './context'

export type RunResult =
  | { kind: 'done'; status: string; stdout: string; stderr: string; ms: number }
  | { kind: 'timeout'; ms: number }
  | { kind: 'failed'; message: string }

/** Wall-clock limit for one run in the browser. */
export const RUN_TIME_LIMIT_MS = 10_000

/** Runs a compiled program in a fresh worker; stops it after RUN_TIME_LIMIT_MS. */
export function runJava(runnable: Runnable, input: string): Promise<RunResult> {
  return new Promise((resolve) => {
    let worker: Worker
    try {
      worker = new Worker(new URL('./java-worker.ts', import.meta.url), { type: 'module' })
    } catch (e) {
      resolve({ kind: 'failed', message: e instanceof Error ? e.message : String(e) })
      return
    }
    const start = performance.now()
    const timer = setTimeout(() => {
      worker.terminate()
      resolve({ kind: 'timeout', ms: performance.now() - start })
    }, RUN_TIME_LIMIT_MS)
    worker.onmessage = (event: MessageEvent<{ status: string; stdout: string; stderr: string; ms: number }>) => {
      clearTimeout(timer)
      worker.terminate()
      resolve({ kind: 'done', ...event.data })
    }
    worker.onerror = (event) => {
      clearTimeout(timer)
      worker.terminate()
      resolve({ kind: 'failed', message: event.message || 'The program could not be started.' })
    }
    worker.postMessage({ chunk: runnable.chunk, key: runnable.key, input })
  })
}
