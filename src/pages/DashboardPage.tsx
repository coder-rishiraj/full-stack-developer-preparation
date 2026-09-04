import { Link } from 'react-router-dom'
import { TRACKS, TOPICS, getTopicMeta, curriculumStats } from '@/content/taxonomy'
import { RoadmapExplorer } from '@/components/roadmap/RoadmapExplorer'
import {
  currentFocusItems,
  dsaSummary,
  overallPrep,
  revisionSummary,
  trackProgress,
} from '@/domain/progress-selectors'
import { ProgressBar } from '@/components/ui/Progress'
import { useUserStore } from '@/stores/user-store'

export function DashboardPage() {
  const state = useUserStore()
  const overall = overallPrep(state)
  const tracks = trackProgress(state)
  const dsa = dsaSummary(state)
  const revision = revisionSummary(state)
  const focus = currentFocusItems(state)
  const stats = curriculumStats()
  const freshStart = TOPICS.every(
    (t) => !state.topics[t.id] || state.topics[t.id]?.status === 'not_started',
  )

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Home</h1>
          <p className="mt-1 text-xs text-[var(--text-faint)]">
            {stats.total} classified · {stats.nestedConcepts} nested ·{' '}
            {stats.sections} sections
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold tabular-nums">
            {overall.overall}%
          </div>
          <div className="text-xs text-[var(--text-muted)]">Overall progress</div>
        </div>
      </div>

      <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {TRACKS.map((t) => (
          <Link
            key={t.id}
            to={`/tracks/${t.id}`}
            className="rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 hover:border-[var(--border-strong)]"
          >
            <ProgressBar
              label={`${t.id} · ${t.shortName}`}
              value={tracks[t.id]}
              accent={t.accent}
            />
          </Link>
        ))}
      </section>

      <section className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--text-muted)]">
          <Link to="/revision" className="hover:text-[var(--accent)]">
            Revision:{' '}
            <span className="tabular-nums text-[var(--text)]">
              {revision.overdue} overdue
            </span>
            {' · '}
            <span className="tabular-nums text-[var(--text)]">
              {revision.dueToday} today
            </span>
            {' · '}
            <span className="tabular-nums text-[var(--text)]">
              {revision.thisWeek} this week
            </span>
          </Link>
          <span className="text-[var(--border-strong)]" aria-hidden>
            |
          </span>
          <Link to="/dsa" className="hover:text-[var(--accent)]">
            DSA:{' '}
            <span className="tabular-nums text-[var(--text)]">
              {dsa.attempted} attempted
            </span>
            {' · '}
            <span className="tabular-nums text-[var(--text)]">
              {dsa.solvedIndependently} independent
            </span>
            {' · '}
            CSES {dsa.csesProgress}% · NeetCode {dsa.neetcodeProgress}%
          </Link>
          <span className="text-[var(--border-strong)]" aria-hidden>
            |
          </span>
          <Link to="/interview" className="hover:text-[var(--accent)]">
            Interview prep →
          </Link>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <FocusColumn
            title="Currently learning"
            items={focus.learning}
            empty={freshStart ? undefined : 'Nothing in progress'}
          />
          <FocusColumn
            title="Up next"
            items={focus.upNext}
            empty={freshStart ? undefined : 'Nothing queued'}
          />
        </div>

        {(focus.needsRevision.length > 0 ||
          focus.recentlyCompleted.length > 0) && (
          <div className="mt-4 grid gap-4 border-t border-[var(--border)] pt-4 md:grid-cols-2">
            {focus.needsRevision.length > 0 && (
              <FocusColumn title="Needs revision" items={focus.needsRevision} />
            )}
            {focus.recentlyCompleted.length > 0 && (
              <FocusColumn
                title="Recently completed"
                items={focus.recentlyCompleted.slice(0, 5)}
              />
            )}
          </div>
        )}

        {freshStart && (
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            Start with{' '}
            <Link
              className="text-[var(--accent)] underline"
              to="/topics/a2-sliding-window"
            >
              Sliding Window
            </Link>{' '}
            or{' '}
            <Link
              className="text-[var(--accent)] underline"
              to="/topics/c7-isolation-levels"
            >
              Isolation Levels
            </Link>
            .
          </p>
        )}
      </section>

      <RoadmapExplorer />
    </div>
  )
}

function FocusColumn({
  title,
  items,
  empty,
}: {
  title: string
  items: { id: string; title: string }[]
  empty?: string
}) {
  return (
    <div>
      <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--text-faint)]">
        {title}
      </h2>
      {items.length === 0 ? (
        empty ? (
          <p className="text-sm text-[var(--text-faint)]">{empty}</p>
        ) : null
      ) : (
        <ul className="space-y-0.5 text-sm">
          {items.slice(0, 6).map((t) => (
            <li key={t.id}>
              <Link
                className="text-[var(--accent)] hover:underline"
                to={`/topics/${t.id}`}
              >
                {getTopicMeta(t.id)?.title ?? t.title}
              </Link>
            </li>
          ))}
          {items.length > 6 && (
            <li className="text-xs text-[var(--text-faint)]">
              +{items.length - 6} more
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
