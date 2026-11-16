import { useCallback, useEffect, useState } from 'react'
import type { Runnable } from '@/runner/context'

type Finders = {
  java: ((lessonId: string, code: string) => Runnable | null) | null
  js: (lessonId: string, code: string, language: string) => Runnable | null
}

/**
 * For a lesson page: a function telling a code block whether it can be run. The tables of
 * runnable programs are loaded on demand: Java for Track A lessons ("a<N>-..."), and
 * JavaScript/TypeScript for every lesson.
 */
export function useLessonRunnables(lessonId: string): ((code: string, language: string) => Runnable | null) | null {
  const [finders, setFinders] = useState<{ id: string; f: Finders } | null>(null)

  useEffect(() => {
    if (!lessonId) return
    let cancelled = false
    const wantsJava = /^a\d+-/.test(lessonId)
    void Promise.all([
      wantsJava ? import('@/runner/lesson-runnables').then((m) => m.findLessonRunnable) : Promise.resolve(null),
      import('@/runner/js/js-lesson-runnables').then((m) => m.findJsLessonRunnable),
    ]).then(([java, js]) => {
      if (!cancelled) setFinders({ id: lessonId, f: { java, js } })
    })
    return () => {
      cancelled = true
    }
  }, [lessonId])

  const ready = finders !== null && finders.id === lessonId
  const find = useCallback(
    (code: string, language: string) => {
      if (!finders) return null
      if (language === 'java') return finders.f.java ? finders.f.java(lessonId, code) : null
      return finders.f.js(lessonId, code, language)
    },
    [finders, lessonId],
  )
  return ready ? find : null
}
