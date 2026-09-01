import { Link } from 'react-router-dom'
import { TRACKS, TOPICS, getTopicMeta, getContentReadyTopics, curriculumStats } from '@/content/taxonomy'
import {
  currentFocusItems,
  dsaSummary,
  interviewReadiness,
  overallPrep,
  revisionSummary,
  trackProgress,
} from '@/domain/progress-selectors'
import { ProgressBar, StatCard } from '@/components/ui/Progress'
import { useUserStore } from '@/stores/user-store'

export function DashboardPage() {
  const state = useUserStore()
  const overall = overallPrep(state)
  const tracks = trackProgress(state)
  const dsa = dsaSummary(state)
  const revision = revisionSummary(state)
  const interview = interviewReadiness(state)
  const focus = currentFocusItems(state)
  const stats = curriculumStats()
  const exemplars = getContentReadyTopics()

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 md:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          What to study today, what is done, and what needs revision — from your real progress data.
        </p>
        <p className="mt-1 text-xs text-[var(--text-faint)]">
          Curriculum: {stats.total} topics · {stats.sections} sections · {stats.contentReady} deep
          notes ready
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-faint)]">
          Overall Preparation
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Overall" value={`${overall.overall}%`} />
          <StatCard label="Tier 1" value={`${overall.tier1}%`} />
          <StatCard label="Tier 2" value={`${overall.tier2}%`} />
          <StatCard label="Tier 3" value={`${overall.tier3}%`} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-faint)]">
          Track Progress
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {TRACKS.map((t) => (
            <Link
              key={t.id}
              to={`/tracks/${t.id}`}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3 hover:border-[var(--border-strong)]"
            >
              <ProgressBar
                label={`Track ${t.id} — ${t.shortName}`}
                value={tracks[t.id]}
                accent={t.accent}
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-faint)]">
            Current Focus
          </h2>
          <FocusList title="Currently learning" items={focus.learning} />
          <FocusList title="Up next" items={focus.upNext} />
          <FocusList title="Needs revision" items={focus.needsRevision} />
          <FocusList title="Recently completed" items={focus.recentlyCompleted} />
          {TOPICS.every((t) => !state.topics[t.id] || state.topics[t.id]?.status === 'not_started') && (
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Start with{' '}
              <Link className="text-[var(--accent)] underline" to="/topics/a2-sliding-window">
                Sliding Window
              </Link>{' '}
              or{' '}
              <Link className="text-[var(--accent)] underline" to="/topics/c7-isolation-levels">
                Isolation Levels
              </Link>
              .
            </p>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-faint)]">
            DSA
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <StatCard label="Total" value={dsa.total} />
            <StatCard label="Attempted" value={dsa.attempted} />
            <StatCard label="Independent" value={dsa.solvedIndependently} />
            <StatCard label="With hints" value={dsa.solvedWithHints} />
            <StatCard label="Could not solve" value={dsa.couldNotSolve} />
            <StatCard label="Needs revision" value={dsa.needsRevision} />
            <StatCard label="CSES %" value={`${dsa.csesProgress}%`} />
            <StatCard label="NeetCode %" value={`${dsa.neetcodeProgress}%`} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-faint)]">
            Revision
          </h2>
          <div className="grid grid-cols-3 gap-2">
            <StatCard label="Due today" value={revision.dueToday} />
            <StatCard label="Overdue" value={revision.overdue} />
            <StatCard label="This week" value={revision.thisWeek} />
          </div>
          <Link to="/revision" className="mt-2 inline-block text-sm text-[var(--accent)] underline">
            Open revision queue
          </Link>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-faint)]">
            Interview Readiness
          </h2>
          <p className="mb-2 text-xs text-[var(--text-faint)]">
            Based only on topics marked Interview Ready (not estimated scores).
          </p>
          <div className="space-y-2">
            {Object.entries(interview).map(([name, v]) => (
              <ProgressBar
                key={name}
                label={`${name} (${v.ready}/${v.total})`}
                value={v.percent}
              />
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-faint)]">
          Deep notes ready ({exemplars.length})
        </h2>
        <p className="mb-2 text-xs text-[var(--text-faint)]">
          All curriculum topics have deep notes. Open any track — every topic should show “Notes
          ready”.
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {exemplars.slice(0, 12).map((t) => (
            <li key={t.id}>
              <Link
                to={`/topics/${t.id}`}
                className="block rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm hover:border-[var(--border-strong)]"
              >
                <span className="font-medium">{t.title}</span>
                <span className="mt-0.5 block text-xs text-[var(--text-faint)]">
                  Track {t.track} · {t.sectionId}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {exemplars.length > 12 && (
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            +{exemplars.length - 12} more — browse tracks A–D or Search.
          </p>
        )}
      </section>
    </div>
  )
}

function FocusList({
  title,
  items,
}: {
  title: string
  items: { id: string; title: string }[]
}) {
  return (
    <div className="mb-3">
      <h3 className="text-xs font-semibold text-[var(--text-muted)]">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-[var(--text-faint)]">—</p>
      ) : (
        <ul className="text-sm">
          {items.map((t) => (
            <li key={t.id}>
              <Link className="text-[var(--accent)] hover:underline" to={`/topics/${t.id}`}>
                {getTopicMeta(t.id)?.title ?? t.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
