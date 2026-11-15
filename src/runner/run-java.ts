import manifest from './generated/manifest.json'
import samplesConfig from '@/content/problem-pages/run-samples.json'
import type { CheckKind, Runnable, Sample } from './context'

export type RunResult =
  | { kind: 'done'; status: string; stdout: string; stderr: string; ms: number }
  | { kind: 'timeout'; ms: number }
  | { kind: 'failed'; message: string }
/** Wall-clock limit for one run in the browser. */
export const RUN_TIME_LIMIT_MS = 5000

type ManifestEntry = { key: string; title: string; hash: string }
type PageSamples = { check: CheckKind; samples: Sample[] }

/** Same normalisation and FNV-1a hash as scripts/build-java-runner.mjs. */
export function codeHash(code: string): string {
  const text = code
    .split('\n')
    .map((l) => l.trimEnd())
    .join('\n')
    .trim()
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(16).padStart(8, '0')
}

/**
 * The runnable program whose source is exactly `code` on page `problemId`, or null. The
 * hash comparison means an edited page never runs a stale build: it shows no Run panel
 * until `npm run problems:runner` is run again (a test fails meanwhile).
 */
export function findRunnable(problemId: string, code: string): Runnable | null {
  const entries = (manifest as Record<string, ManifestEntry[]>)[problemId]
  const page = (samplesConfig as Record<string, PageSamples>)[problemId]
  if (!entries || !page) return null
  const hash = codeHash(code)
  const entry = entries.find((e) => e.hash === hash)
  return entry ? { key: entry.key, problemId, check: page.check, samples: page.samples } : null
}

export function runnableProblemIds(): string[] {
  return Object.keys(manifest)
}

/** Runs a compiled program in a fresh worker; stops it after RUN_TIME_LIMIT_MS. */
export function runJava(key: string, input: string): Promise<RunResult> {
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
    worker.postMessage({ key, input })
  })
}
