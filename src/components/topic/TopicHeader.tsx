import { Link } from 'react-router-dom'
import { getTopicMeta, getTrack } from '@/content/taxonomy'
import type { Confidence, StudyStatus, TopicMeta, TopicProgress } from '@/domain/types'

function PrintIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  )
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

const DIFFICULTY_LABEL = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' } as const

export const STATUS_OPTIONS: { value: StudyStatus; label: string }[] = [
  { value: 'not_started', label: 'Not started' },
  { value: 'learning', label: 'Learning' },
  { value: 'first_pass', label: 'Completed' },
  { value: 'interview_ready', label: 'Interview ready' },
  { value: 'needs_revision', label: 'Needs revision' },
]

export function TopicHeader({
  meta,
  progress,
  onStatus,
  onConfidence,
  onRevise,
  bookmarked,
  onToggleBookmark,
  mode = 'full',
  summary,
  difficulty,
  minutes,
}: {
  meta: TopicMeta
  progress: TopicProgress
  onStatus: (s: StudyStatus) => void
  onConfidence: (c: Confidence) => void
  onRevise: () => void
  bookmarked: boolean
  onToggleBookmark: () => void
  mode?: 'full' | 'study' | 'revision'
  summary?: string
  difficulty?: keyof typeof DIFFICULTY_LABEL
  minutes?: number
}) {
  const track = getTrack(meta.track)
  const parent = meta.parentTopicId ? getTopicMeta(meta.parentTopicId) : undefined
  const trackListTo = `/tracks/${meta.track}?section=${encodeURIComponent(meta.sectionId)}`
  const topicBase = `/topics/${meta.id}`
  const studied = progress.status !== 'not_started'
  const tab = (active: boolean) =>
    `rounded px-2.5 py-1 text-xs font-medium transition-colors ${
      active ? 'bg-[var(--bg-elevated)] text-[var(--heading)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
    }`
  const iconBtn =
    'inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]'

  return (
    <header className="print-avoid-break space-y-3">
      <nav aria-label="Breadcrumb" className="print-hidden flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12.5px] text-[var(--text-faint)]" data-screen-only>
        <Link to={`/tracks/${meta.track}`} className="hover:text-[var(--accent)]" style={{ color: track?.accent }}>
          {track?.name ?? `Track ${meta.track}`}
        </Link>
        <span aria-hidden>/</span>
        <Link to={trackListTo} className="hover:text-[var(--accent)]">
          {meta.sectionId} · {meta.sectionTitle}
        </Link>
        {parent && (
          <>
            <span aria-hidden>/</span>
            <Link to={`/topics/${parent.id}`} className="hover:text-[var(--accent)]">
              {parent.title}
            </Link>
          </>
        )}
      </nav>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="min-w-0 flex-1 font-[family-name:var(--font-ui)] text-[1.75rem] font-semibold leading-tight tracking-[-0.015em] text-[var(--heading)] md:text-[2rem]">
          {meta.title}
        </h1>
        <div className="print-hidden flex shrink-0 items-center gap-1.5 self-start" data-screen-only>
          <div className="inline-flex rounded-md bg-[var(--bg-muted)] p-0.5" role="group" aria-label="View mode">
            <Link to={topicBase} state={{ explicit: true }} className={tab(mode === 'full')} aria-current={mode === 'full' ? 'page' : undefined}>
              Lesson
            </Link>
            <Link to={`${topicBase}/study`} className={tab(mode === 'study')} aria-current={mode === 'study' ? 'page' : undefined}>
              Study
            </Link>
            <Link to={`${topicBase}/revision`} className={tab(mode === 'revision')} aria-current={mode === 'revision' ? 'page' : undefined}>
              Revision
            </Link>
          </div>
          <button
            type="button"
            className={`${iconBtn} ${bookmarked ? 'text-[var(--accent)]' : ''}`}
            onClick={onToggleBookmark}
            aria-pressed={bookmarked}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
            title={bookmarked ? 'Bookmarked' : 'Bookmark'}
          >
            <BookmarkIcon filled={bookmarked} />
          </button>
          <Link
            to={`/print/preview?topic=${meta.id}${mode === 'revision' ? '&mode=quick' : ''}`}
            className={iconBtn}
            aria-label="Print topic"
            title="Print topic"
          >
            <PrintIcon />
          </Link>
        </div>
      </div>

      {summary && (
        <p className="max-w-[var(--measure)] font-[family-name:var(--font-content)] text-[1rem] leading-relaxed text-[var(--text-muted)] sm:text-[1.08rem]">
          {summary}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-[var(--text-faint)]">
        {difficulty && <span>{DIFFICULTY_LABEL[difficulty]}</span>}
        {minutes ? <span>~{minutes} min</span> : null}
        <span>{meta.priority === 'tier1' ? 'Core' : meta.priority === 'tier2' ? 'Important' : 'Extended'}</span>
        {progress.lastStudied && <span>Studied {new Date(progress.lastStudied).toLocaleDateString()}</span>}
        {progress.lastRevised && <span>Revised {new Date(progress.lastRevised).toLocaleDateString()}</span>}
      </div>

      {meta.usedInCapstone && (
        <p className="rounded-md border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1.5 text-sm">
          <strong>Capstone:</strong> {meta.usedInCapstone}
        </p>
      )}

      {mode !== 'study' && (
        <div
          className="print-hidden flex flex-wrap items-center gap-2 border-y border-[var(--border)] py-2 text-xs text-[var(--text-muted)]"
          data-screen-only
        >
          <label className="flex items-center gap-1.5">
            <span>Status</span>
            <select
              className="rounded border border-[var(--border)] bg-[var(--bg)] px-1.5 py-0.5 text-[var(--text)]"
              value={progress.status}
              onChange={(e) => onStatus(e.target.value as StudyStatus)}
              aria-label="Study status"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1.5">
            <span>Confidence</span>
            <select
              className="rounded border border-[var(--border)] bg-[var(--bg)] px-1.5 py-0.5 text-[var(--text)]"
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
          <button
            type="button"
            className="rounded px-2 py-0.5 hover:bg-[var(--bg-muted)] hover:text-[var(--text)] disabled:opacity-40"
            disabled={!studied}
            onClick={onRevise}
          >
            Mark revised
          </button>
        </div>
      )}
    </header>
  )
}
