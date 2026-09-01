import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getTopicMeta, TOPICS } from '@/content/taxonomy'
import { loadTopicContent } from '@/content/topics'
import { TopicBody } from '@/components/topic/TopicBody'
import { Button } from '@/components/ui/Button'
import { useUserStore } from '@/stores/user-store'
import { useTopicContent } from '@/hooks/useTopicContent'
import type { TopicContent } from '@/domain/types'

export function PrintPreviewPage() {
  const [params] = useSearchParams()
  const topicId = params.get('topic') ?? ''
  const sheet = params.get('sheet')
  const round = params.get('round')
  const initialMode = params.get('mode') === 'quick' ? 'quick' : 'full'

  const [mode, setMode] = useState<'full' | 'quick'>(initialMode)
  const [diagrams, setDiagrams] = useState(true)
  const [code, setCode] = useState(true)
  const [examples, setExamples] = useState(true)
  const [interview, setInterview] = useState(true)
  const [flashcards, setFlashcards] = useState(true)
  const [myNotes, setMyNotes] = useState(false)
  const [dsaProblems, setDsaProblems] = useState(true)

  const note = useUserStore((s) => s.notes[topicId] ?? '')
  const meta = getTopicMeta(topicId)
  const { content, loading } = useTopicContent(sheet === 'interview' ? undefined : topicId)

  const interviewTopics = useMemo(() => {
    if (sheet !== 'interview') return []
    let list = TOPICS.filter((t) => t.priority === 'tier1')
    if (round === 'backend') list = list.filter((t) => t.track === 'C')
    else if (round === 'frontend') list = list.filter((t) => t.track === 'B')
    else if (round === 'dsa') list = list.filter((t) => t.track === 'A')
    else if (round === 'hld')
      list = list.filter((t) => t.track === 'D' && !['D1', 'D2', 'D3'].includes(t.sectionId))
    else if (round === 'lld')
      list = list.filter((t) => t.track === 'D' && ['D1', 'D2', 'D3'].includes(t.sectionId))
    else if (round === 'java')
      list = list.filter((t) => t.track === 'C' && ['C1', 'C2', 'C3'].includes(t.sectionId))
    return list.slice(0, 40)
  }, [sheet, round])

  const [sheetContent, setSheetContent] = useState<Record<string, TopicContent>>({})
  const [sheetLoading, setSheetLoading] = useState(false)

  useEffect(() => {
    if (sheet !== 'interview' || interviewTopics.length === 0) return
    let cancelled = false
    setSheetLoading(true)
    void Promise.all(
      interviewTopics.map(async (t) => {
        const c = await loadTopicContent(t.id)
        return [t.id, c] as const
      }),
    ).then((pairs) => {
      if (cancelled) return
      const next: Record<string, TopicContent> = {}
      for (const [id, c] of pairs) {
        if (c) next[id] = c
      }
      setSheetContent(next)
      setSheetLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [sheet, interviewTopics])

  const busy = sheet === 'interview' ? sheetLoading : loading

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div
        className="print-hidden mb-6 space-y-3 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4"
        data-screen-only
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg font-semibold">Print Preview</h1>
          <div className="flex gap-2">
            <Link to="/print" className="text-sm text-[var(--accent)] underline">
              Back
            </Link>
            <Button variant="primary" onClick={() => window.print()} disabled={busy}>
              Print / Save as PDF
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-1">
            Content
            <select
              className="rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1"
              value={mode}
              onChange={(e) => setMode(e.target.value as 'full' | 'quick')}
            >
              <option value="full">Full Notes</option>
              <option value="quick">Quick Revision</option>
            </select>
          </label>
          {(
            [
              ['Diagrams', diagrams, setDiagrams],
              ['Code', code, setCode],
              ['Examples', examples, setExamples],
              ['Interview Qs', interview, setInterview],
              ['Flashcards', flashcards, setFlashcards],
              ['My Notes', myNotes, setMyNotes],
              ['DSA Problems', dsaProblems, setDsaProblems],
            ] as const
          ).map(([label, value, set]) => (
            <label key={label} className="flex items-center gap-1">
              <input type="checkbox" checked={value} onChange={(e) => set(e.target.checked)} />
              {label}
            </label>
          ))}
        </div>
        <p className="text-xs text-[var(--text-faint)]">Optimized for A4 · print theme is always light</p>
      </div>

      <div className="print-surface">
        {sheet === 'interview' ? (
          <div>
            <div className="print-header">Interview Sheet · {round ?? 'general'} · SE Prep</div>
            <h1 className="print-topic-title">Quick Revision Checklist</h1>
            {sheetLoading && <p className="text-sm">Loading revision bullets…</p>}
            {interviewTopics.map((t) => {
              const c = sheetContent[t.id]
              return (
                <section key={t.id} className="print-avoid-break mb-6">
                  <h2 className="text-lg font-semibold">
                    {t.sectionId} — {t.title}
                  </h2>
                  <ul className="list-disc pl-5 text-sm">
                    {(c?.quickRevision ?? ['(content pending)']).map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </section>
              )
            })}
          </div>
        ) : meta && content ? (
          <div>
            <div className="print-header">
              Track {meta.track} · {meta.sectionId} {meta.sectionTitle} · {meta.priority}
            </div>
            <h1 className="print-topic-title">{meta.title}</h1>
            <TopicBody
              meta={meta}
              content={content}
              mode={mode}
              include={{ diagrams, code, examples, interview, flashcards, dsaProblems }}
            />
            {myNotes && note && (
              <section className="mt-6 border-t border-neutral-300 pt-4">
                <h2 className="mb-2 font-semibold">My Notes</h2>
                <pre className="whitespace-pre-wrap text-sm">{note}</pre>
              </section>
            )}
          </div>
        ) : meta ? (
          <div>
            <div className="print-header">
              Track {meta.track} · {meta.sectionId} {meta.sectionTitle} · {meta.priority}
            </div>
            <h1 className="print-topic-title">{meta.title}</h1>
            <p className="text-sm">
              {loading
                ? 'Loading deep notes…'
                : `Deep notes pending. Metadata only — months ${meta.targetMonths.join(', ')}.`}
            </p>
            {myNotes && note && (
              <section className="mt-6 border-t border-neutral-300 pt-4">
                <h2 className="mb-2 font-semibold">My Notes</h2>
                <pre className="whitespace-pre-wrap text-sm">{note}</pre>
              </section>
            )}
          </div>
        ) : (
          <p>Select a topic from the Print Center.</p>
        )}
      </div>
    </div>
  )
}
