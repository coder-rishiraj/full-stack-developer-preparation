import { Link } from 'react-router-dom'
import {
  ExecutionPriorityBadge,
  PriorityBadge,
  StatusBadge,
  TrackBadge,
} from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Confidence, StudyStatus, TopicMeta, TopicProgress } from '@/domain/types'

function isStudied(status: StudyStatus): boolean {
  return status !== 'not_started'
}

function PrintIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  )
}

function Divider() {
  return (
    <span
      className="mx-0.5 hidden h-4 w-px bg-[var(--border-strong)] sm:inline-block"
      aria-hidden
    />
  )
}

export function TopicHeader({
  meta,
  progress,
  onStatus,
  onConfidence,
  onRevise,
  bookmarked,
  onToggleBookmark,
  mode = 'full',
}: {
  meta: TopicMeta
  progress: TopicProgress
  onStatus: (s: StudyStatus) => void
  onConfidence: (c: Confidence) => void
  onRevise: () => void
  bookmarked: boolean
  onToggleBookmark: () => void
  mode?: 'full' | 'study' | 'revision'
}) {
  const trackListTo = `/tracks/${meta.track}?section=${encodeURIComponent(meta.sectionId)}`
  const studied = isStudied(progress.status)
  const topicBase = `/topics/${meta.id}`
  const chip = (active: boolean) =>
    `rounded-full px-2 py-0.5 text-xs ${
      active
        ? 'bg-[var(--accent-soft)] font-medium text-[var(--accent)]'
        : 'text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text)]'
    } disabled:opacity-40`

  return (
    <header className="print-avoid-break space-y-2">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div
            className="print-hidden flex flex-wrap items-center gap-2"
            data-screen-only
          >
            <Link
              to={trackListTo}
              className="text-sm text-[var(--accent)] hover:underline"
            >
              ← Track {meta.track}
            </Link>
            <Link to={trackListTo} className="hover:opacity-90">
              <TrackBadge track={meta.track} />
            </Link>
            <Link
              to={trackListTo}
              className="rounded border border-[var(--border)] bg-[var(--bg-muted)] px-1.5 py-0.5 text-xs text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]"
            >
              {meta.sectionId}
            </Link>
            <PriorityBadge priority={meta.priority} />
            <ExecutionPriorityBadge priority={meta.executionPriority} />
            <StatusBadge status={progress.status} />
          </div>

          <h1 className="font-[family-name:var(--font-ui)] text-xl font-semibold tracking-tight md:text-2xl">
            {meta.title}
          </h1>

          <p className="text-xs text-[var(--text-muted)]">
            {meta.sectionTitle}
            {' · '}
            {meta.estimatedDepth}
            {' · M'}
            {meta.targetMonths.join(', M')}
            {progress.lastStudied
              ? ` · Studied ${new Date(progress.lastStudied).toLocaleDateString()}`
              : ''}
            {progress.lastRevised
              ? ` · Revised ${new Date(progress.lastRevised).toLocaleDateString()}`
              : ''}
          </p>
        </div>

        <div
          className="print-hidden flex shrink-0 items-center gap-1.5"
          data-screen-only
        >
          <div
            className="inline-flex rounded-md border border-[var(--border)] p-0.5"
            role="group"
            aria-label="View mode"
          >
            <Link
              to={topicBase}
              className={`rounded px-2 py-1 text-xs font-medium ${
                mode === 'full'
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              Overview
            </Link>
            <Link
              to={`${topicBase}/study`}
              className={`rounded px-2 py-1 text-xs font-medium ${
                mode === 'study'
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              Study
            </Link>
            <Link
              to={`${topicBase}/revision`}
              className={`rounded px-2 py-1 text-xs font-medium ${
                mode === 'revision'
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              Revision
            </Link>
          </div>
          <Link
            to={`/print/preview?topic=${meta.id}${mode === 'revision' ? '&mode=quick' : ''}`}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]"
            aria-label="Print topic"
            title="Print topic"
          >
            <PrintIcon />
          </Link>
        </div>
      </div>

      {meta.usedInCapstone && (
        <p className="rounded-md border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1.5 text-sm">
          <strong>Capstone:</strong> {meta.usedInCapstone}
        </p>
      )}

      <div
        className="print-hidden flex flex-wrap items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5"
        data-screen-only
      >
        <Button
          size="sm"
          variant={studied ? 'primary' : 'secondary'}
          onClick={() => onStatus(studied ? 'not_started' : 'first_pass')}
        >
          {studied ? 'Studied' : 'Mark studied'}
        </Button>
        <label className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
          Conf
          <select
            className="rounded border border-[var(--border)] bg-[var(--bg)] px-1 py-0.5"
            value={progress.confidence}
            onChange={(e) => onConfidence(Number(e.target.value) as Confidence)}
            aria-label="Confidence"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <Divider />

        <button
          type="button"
          className={chip(progress.status === 'interview_ready')}
          disabled={!studied}
          onClick={() =>
            onStatus(
              progress.status === 'interview_ready'
                ? 'first_pass'
                : 'interview_ready',
            )
          }
        >
          Interview ready
        </button>
        <button
          type="button"
          className={chip(progress.status === 'needs_revision')}
          disabled={!studied}
          onClick={() =>
            onStatus(
              progress.status === 'needs_revision'
                ? 'first_pass'
                : 'needs_revision',
            )
          }
        >
          Needs revision
        </button>
        <button
          type="button"
          className={chip(false)}
          disabled={!studied}
          onClick={onRevise}
        >
          Mark revised
        </button>
        <button
          type="button"
          className={chip(bookmarked)}
          onClick={onToggleBookmark}
        >
          {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
      </div>
    </header>
  )
}
