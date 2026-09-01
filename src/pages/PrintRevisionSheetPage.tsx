import { useEffect, useMemo, useState } from 'react'
import { TOPICS } from '@/content/taxonomy'
import { loadTopicContent } from '@/content/topics'
import { getTopicProgress } from '@/domain/progress-selectors'
import { Button } from '@/components/ui/Button'
import { useUserStore } from '@/stores/user-store'
import type { TopicContent } from '@/domain/types'

export function PrintRevisionSheetPage() {
  const state = useUserStore()
  const topics = useMemo(
    () =>
      TOPICS.filter((t) => {
        if (t.priority !== 'tier1') return false
        const p = getTopicProgress(state, t.id)
        return (
          p.status === 'needs_revision' ||
          p.status === 'learning' ||
          p.status === 'first_pass' ||
          p.status === 'not_started'
        )
      }),
    [state],
  )

  const [byId, setById] = useState<Record<string, TopicContent>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    void Promise.all(
      topics.map(async (t) => {
        const c = await loadTopicContent(t.id)
        return [t.id, c] as const
      }),
    ).then((pairs) => {
      if (cancelled) return
      const next: Record<string, TopicContent> = {}
      for (const [id, c] of pairs) {
        if (c) next[id] = c
      }
      setById(next)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [topics])

  return (
    <div className="print-surface mx-auto max-w-3xl px-6 py-8">
      <div className="print-hidden mb-4" data-screen-only>
        <Button variant="primary" onClick={() => window.print()} disabled={loading}>
          Print
        </Button>
      </div>
      <div className="print-header">SE Prep · Tier 1 Revision Sheet</div>
      <h1 className="print-topic-title">Revision Sheet</h1>
      {loading && <p className="text-sm">Loading revision bullets…</p>}
      {topics.map((t) => {
        const c = byId[t.id]
        const p = getTopicProgress(state, t.id)
        return (
          <section key={t.id} className="print-avoid-break mb-6 border-b border-neutral-300 pb-4">
            <h2 className="text-lg font-semibold">
              {t.sectionId} — {t.title}
            </h2>
            <p className="text-xs text-neutral-600">
              Status: {p.status} · Confidence: {p.confidence}
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm">
              {(c?.quickRevision ?? []).map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
