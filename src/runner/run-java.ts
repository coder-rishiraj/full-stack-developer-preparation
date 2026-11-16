import manifest from './generated/manifest.json'
import samplesConfig from '@/content/problem-pages/run-samples.json'
import type { CheckKind, Runnable, Sample } from './context'
import { codeHash } from './hash'

export { RUN_TIME_LIMIT_MS, runJava, type RunResult } from './worker-run'


type ManifestPage = {
  chunk: string
  format: 'stdin' | 'leetcode'
  hint: string
  programs: { key: string; title: string; hash: string }[]
}
type PageSamples = { check?: CheckKind; samples: Sample[] }
const PAGES = (manifest as { pages: Record<string, ManifestPage> }).pages

export { codeHash }

/**
 * The runnable program whose source is exactly `code` on page `problemId`, or null. The
 * hash comparison means an edited page never runs a stale build: it shows no Run panel
 * until `npm run problems:runner` is run again (a test fails meanwhile).
 */
export function findRunnable(problemId: string, code: string): Runnable | null {
  const built = PAGES[problemId]
  const page = (samplesConfig as Record<string, PageSamples>)[problemId]
  if (!built || !page) return null
  const hash = codeHash(code)
  const entry = built.programs.find((e) => e.hash === hash)
  if (!entry) return null
  return {
    key: entry.key,
    chunk: built.chunk,
    problemId,
    format: built.format,
    hint: built.hint,
    check: page.check ?? 'exact',
    samples: page.samples,
  }
}

export function runnableProblemIds(): string[] {
  return Object.keys(PAGES)
}
