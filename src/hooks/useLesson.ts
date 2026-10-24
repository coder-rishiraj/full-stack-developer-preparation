import { useEffect, useState } from 'react'
import { loadLesson, type ResolvedLesson } from '@/content/lessons'

/** Loads the Markdown lesson (or the parent lesson section) for a topic. */
export function useLesson(topicId: string | undefined): {
  lesson: ResolvedLesson | undefined
  loading: boolean
} {
  const [state, setState] = useState<{ id?: string; lesson?: ResolvedLesson; loading: boolean }>({
    loading: Boolean(topicId),
  })

  useEffect(() => {
    let cancelled = false
    if (!topicId) {
      setState({ loading: false })
      return
    }
    setState({ id: topicId, loading: true })
    loadLesson(topicId)
      .then((lesson) => {
        if (!cancelled) setState({ id: topicId, lesson, loading: false })
      })
      .catch(() => {
        if (!cancelled) setState({ id: topicId, loading: false })
      })
    return () => {
      cancelled = true
    }
  }, [topicId])

  // Never show the previous topic's lesson while the next one loads.
  if (state.id !== topicId) return { lesson: undefined, loading: Boolean(topicId) }
  return { lesson: state.lesson, loading: state.loading }
}
