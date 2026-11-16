import manifest from './generated/lessons-manifest.json'
import type { Runnable } from './context'
import { codeHash } from './hash'

type LessonEntry = { chunk: string; programs: { key: string; title: string; hash: string; stdin: boolean }[] }
const LESSONS = (manifest as unknown as { lessons: Record<string, LessonEntry> }).lessons

/**
 * The runnable lesson program whose source is exactly `code` in lesson `lessonId`, or null
 * (not a whole program, kept with its written output, or changed since the last
 * `npm run lessons:runner`). Loaded lazily by lesson pages.
 */
export function findLessonRunnable(lessonId: string, code: string): Runnable | null {
  const lesson = LESSONS[lessonId]
  if (!lesson) return null
  const hash = codeHash(code)
  const program = lesson.programs.find((p) => p.hash === hash)
  if (!program) return null
  return {
    key: program.key,
    chunk: lesson.chunk,
    problemId: lessonId,
    format: 'lesson',
    hint: '',
    stdin: program.stdin,
    check: 'exact',
    samples: [],
  }
}

export function hasRunnablePrograms(lessonId: string): boolean {
  return Boolean(LESSONS[lessonId])
}
