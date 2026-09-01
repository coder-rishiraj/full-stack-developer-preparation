import { useParams } from 'react-router-dom'
import { getTopicMeta } from '@/content/taxonomy'
import { TopicBody } from '@/components/topic/TopicBody'
import { Button } from '@/components/ui/Button'
import { useTopicContent } from '@/hooks/useTopicContent'

export function PrintTopicRoutePage() {
  const { topicId } = useParams()
  const meta = getTopicMeta(topicId ?? '')
  const { content, loading } = useTopicContent(topicId)

  if (!meta) {
    return <p className="p-6">Topic not found.</p>
  }

  return (
    <div className="print-surface mx-auto max-w-4xl px-6 py-8">
      <div className="print-hidden mb-4" data-screen-only>
        <Button variant="primary" onClick={() => window.print()} disabled={loading}>
          Print
        </Button>
      </div>
      <div className="print-header">
        Track {meta.track} · {meta.sectionId} {meta.sectionTitle} · {meta.priority}
      </div>
      <h1 className="print-topic-title">{meta.title}</h1>
      {loading ? (
        <p className="text-sm">Loading deep notes…</p>
      ) : content ? (
        <TopicBody meta={meta} content={content} mode="full" />
      ) : (
        <p className="text-sm">
          Deep notes pending. This printout is metadata-only for curriculum navigation.
        </p>
      )}
    </div>
  )
}
