import { Link } from 'react-router-dom'
import { getRevisionBucket } from '@/domain/revision'
import { nextPendingSlot } from '@/domain/revision-schedule'
import { getTopicProgress } from '@/domain/progress-selectors'
import { allVisibleTopics } from '@/domain/user-content'
import { PriorityBadge, StatusBadge, TrackBadge } from '@/components/ui/Badge'
import { useUserStore } from '@/stores/user-store'
import { useMemo, useState } from 'react'
import type { Confidence, TrackId } from '@/domain/types'

export function RevisionPage() {
  const state = useUserStore()
  const [track, setTrack] = useState<TrackId | ''>('')
  const [bucket, setBucket] = useState<'all' | 'due_today' | 'overdue' | 'this_week'>('all')
  const [minConfidence, setMinConfidence] = useState<Confidence | 0>(0)

  const items = useMemo(() => {
    return allVisibleTopics(state)
      .map((t) => {
        const p = getTopicProgress(state, t.id)
        const pending = nextPendingSlot(p.revisionSchedule)
        const b = getRevisionBucket(p.nextRevision)
        return { topic: t, progress: p, pending, bucket: b }
      })
      .filter((row) => {
        if (track && row.topic.track !== track) return false
        if (minConfidence && row.progress.confidence > minConfidence) return false
        if (bucket !== 'all' && row.bucket !== bucket) return false
        if (bucket === 'all') {
          return (
            row.progress.status === 'needs_revision' ||
            row.bucket === 'due_today' ||
            row.bucket === 'overdue' ||
            row.bucket === 'this_week' ||
            row.progress.status === 'learning' ||
            row.progress.status === 'first_pass'
          )
        }
        return true
      })
  }, [state, track, bucket, minConfidence])

  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-6 md:px-6">
      <div>
        <h1 className="text-2xl font-semibold">Revision</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Marking a topic studied fills the Memora default calendar: same night,
          day 2, day 3, next Sunday, second Sunday, month-end Sunday, and quarter
          end. The queue uses the next pending slot.
        </p>
      </div>

      <div className="print-hidden flex flex-wrap gap-2" data-screen-only>
        <select
          className="rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-sm"
          value={bucket}
          onChange={(e) => setBucket(e.target.value as typeof bucket)}
        >
          <option value="all">Relevant queue</option>
          <option value="due_today">Due today</option>
          <option value="overdue">Overdue</option>
          <option value="this_week">This week</option>
        </select>
        <select
          className="rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-sm"
          value={track}
          onChange={(e) => setTrack(e.target.value as TrackId | '')}
        >
          <option value="">All tracks</option>
          {(['A', 'B', 'C', 'D', 'E'] as TrackId[]).map((t) => (
            <option key={t} value={t}>
              Track {t}
            </option>
          ))}
        </select>
        <select
          className="rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-sm"
          value={minConfidence}
          onChange={(e) => setMinConfidence(Number(e.target.value) as Confidence | 0)}
        >
          <option value={0}>Any confidence</option>
          <option value={2}>Confidence ≤ 2</option>
          <option value={3}>Confidence ≤ 3</option>
        </select>
        <Link to="/print/revision" className="text-sm text-[var(--accent)] underline">
          Print revision sheet
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">
          Nothing in the revision queue yet. Mark a topic as Learning or First Pass
          to populate its future revisions.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map(({ topic, progress, pending, bucket: b }) => (
            <li
              key={topic.id}
              className="grid grid-cols-[auto_auto_auto_minmax(0,1fr)_12rem] items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
            >
              <TrackBadge track={topic.track} />
              <PriorityBadge priority={topic.priority} />
              <StatusBadge status={progress.status} />
              <Link
                className="min-w-0 truncate font-medium text-[var(--accent)] hover:underline"
                to={`/topics/${topic.id}/revision`}
              >
                {topic.title}
              </Link>
              <span className="justify-self-end text-xs tabular-nums text-[var(--text-faint)]">
                {pending
                  ? `${pending.name} · ${new Date(`${pending.date}T12:00:00`).toLocaleDateString()}`
                  : b.replace('_', ' ')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
