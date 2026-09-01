import { useEffect, useState } from 'react'
import type { TopicContent } from '@/domain/types'
import { loadTopicContent } from '@/content/topics'

/** Loads deep notes for a topic id (lazy module + cache). */
export function useTopicContent(topicId: string | undefined): {
  content: TopicContent | undefined
  loading: boolean
} {
  const [content, setContent] = useState<TopicContent | undefined>(undefined)
  const [loading, setLoading] = useState(Boolean(topicId))

  useEffect(() => {
    let cancelled = false
    if (!topicId) {
      setContent(undefined)
      setLoading(false)
      return
    }
    setLoading(true)
    setContent(undefined)
    void loadTopicContent(topicId).then((c) => {
      if (!cancelled) {
        setContent(c)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [topicId])

  return { content, loading }
}
