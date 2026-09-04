import { Link } from 'react-router-dom'
import {
  ExecutionPriorityBadge,
  PriorityBadge,
  StatusBadge,
  TrackBadge,
} from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Confidence, StudyStatus, TopicMeta, TopicProgress } from '@/domain/types'

const STATUSES: StudyStatus[] = [
  'not_started',
  'learning',
  'first_pass',
  'interview_ready',
  'needs_revision',
]

export function TopicHeader({
  meta,
  progress,
  onStatus,
  onConfidence,
  onRevise,
  bookmarked,
  onToggleBookmark,
  compact,
}: {
  meta: TopicMeta
  progress: TopicProgress
  onStatus: (s: StudyStatus) => void
  onConfidence: (c: Confidence) => void
  onRevise: () => void
  bookmarked: boolean
  onToggleBookmark: () => void
  compact?: boolean
}) {
  const trackListTo = `/tracks/${meta.track}?section=${encodeURIComponent(meta.sectionId)}`

  return (
    <header className="print-avoid-break space-y-3">
      <div className="print-hidden" data-screen-only>
        <Link
          to={trackListTo}
          className="inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:underline"
        >
          ← Back to Track {meta.track} list
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Link to={trackListTo} className="hover:opacity-90">
          <TrackBadge track={meta.track} />
        </Link>
        <Link
          to={trackListTo}
          className="rounded border border-[var(--border)] bg-[var(--bg-muted)] px-1.5 py-0.5 text-xs text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]"
        >
          {meta.sectionId} · {meta.sectionTitle}
        </Link>
        <PriorityBadge priority={meta.priority} />
        <ExecutionPriorityBadge priority={meta.executionPriority} />
        <StatusBadge status={progress.status} />
      </div>
      <h1 className="font-[family-name:var(--font-ui)] text-2xl font-semibold tracking-tight md:text-3xl">
        {meta.title}
      </h1>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-muted)]">
        <span>Depth: {meta.estimatedDepth}</span>
        <span>Months: {meta.targetMonths.join(', ')}</span>
        {progress.lastStudied && (
          <span>Last studied: {new Date(progress.lastStudied).toLocaleDateString()}</span>
        )}
        {progress.lastRevised && (
          <span>Last revised: {new Date(progress.lastRevised).toLocaleDateString()}</span>
        )}
      </div>
      {meta.usedInCapstone && (
        <p className="rounded-md border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-2 text-sm">
          <strong>Used in Capstone:</strong> {meta.usedInCapstone}
        </p>
      )}

      {!compact && (
        <div className="print-hidden flex flex-wrap gap-2" data-screen-only>
          {STATUSES.filter((s) => s !== 'not_started').map((s) => (
            <Button
              key={s}
              size="sm"
              variant={progress.status === s ? 'primary' : 'secondary'}
              onClick={() => onStatus(s)}
            >
              {s === 'learning' && 'Mark Learning'}
              {s === 'first_pass' && 'First Pass Complete'}
              {s === 'interview_ready' && 'Interview Ready'}
              {s === 'needs_revision' && 'Needs Revision'}
            </Button>
          ))}
          <Button size="sm" onClick={onRevise}>
            Add / Mark Revised
          </Button>
          <Button size="sm" onClick={onToggleBookmark}>
            {bookmarked ? 'Unbookmark' : 'Bookmark'}
          </Button>
          <Link to={`/topics/${meta.id}/study`}>
            <Button size="sm">Study Mode</Button>
          </Link>
          <Link to={`/topics/${meta.id}/revision`}>
            <Button size="sm">Revision Mode</Button>
          </Link>
          <Link to={`/print/preview?topic=${meta.id}`}>
            <Button size="sm" variant="primary">
              Print Topic
            </Button>
          </Link>
          <label className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
            Confidence
            <select
              className="rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-1 py-1"
              value={progress.confidence}
              onChange={(e) => onConfidence(Number(e.target.value) as Confidence)}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </header>
  )
}
