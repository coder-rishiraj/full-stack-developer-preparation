import manifest from '../generated/js-lessons-manifest.json'
import type { Runnable } from '../context'
import { codeHash } from '../hash'
import { sourceLang } from './compile'

type Entry = { hash: string; lang: string; env?: 'node' | 'page' }
type Excluded = Entry & { reason: string }
const LESSONS = (manifest as unknown as { lessons: Record<string, Entry[]> }).lessons
const EXCLUDED = (manifest as unknown as { excluded: Record<string, Excluded[]> }).excluded

/** A short reader-facing reason from the build's note. */
function readerNote(reason: string): string {
  if (/is not defined|Cannot read properties of undefined|Cannot read properties of null|fails in the preview/.test(reason)) {
    return 'This snippet is part of a larger example (it uses names defined elsewhere in the lesson), so running it on its own may fail. Edit it to make it complete.'
  }
  if (/needs a file or package|Cannot find module/.test(reason)) return 'This example imports files or packages that are not available here, so running it as is may fail.'
  if (/does not finish/.test(reason)) return 'This example keeps running (a server or an endless timer); here it is stopped after 10 seconds.'
  if (/prints different|ends differently|throws a different/.test(reason)) {
    return 'Here this example may print something slightly different from the lesson (for example, timings or environment details).'
  }
  return 'Running this example here may not match the lesson exactly.'
}

/**
 * The editable Run panel for a lesson's JavaScript/TypeScript block, if the build found that
 * this exact block runs in the browser as it does in Node. Loaded lazily by lesson pages.
 */
export function findJsLessonRunnable(lessonId: string, code: string, language: string): Runnable | null {
  const lang = sourceLang(language)
  if (!lang) return null
  const hash = codeHash(code)
  const entry = LESSONS[lessonId]?.find((e) => e.hash === hash)
  const base = { key: `${lessonId}:${hash}`, chunk: '', problemId: lessonId, format: 'js' as const, lang, hint: '', check: 'exact' as const, samples: [] }
  if (entry) return { ...base, env: entry.env ?? 'node', verified: true }
  // Every other block is editable too; the note explains why the original may not run here.
  const excluded = EXCLUDED[lessonId]?.find((e) => e.hash === hash)
  return { ...base, env: excluded?.env ?? 'node', verified: false, note: readerNote(excluded?.reason ?? '') }
}
