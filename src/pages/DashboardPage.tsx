import { Link } from 'react-router-dom'
import { TRACKS, TOPICS, getTopicMeta, getTrack, curriculumStats } from '@/content/taxonomy'
import { hasLesson, lessonIds, lessonInfo } from '@/content/lessons'
import type { TopicMeta, UserState } from '@/domain/types'
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
  const lessonCount = lessonIds().length
  const freshStart = TOPICS.every(
    (t) => !state.topics[t.id] || state.topics[t.id]?.status === 'not_started',
  )

  const recent = state.recentTopics.map((id) => getTopicMeta(id)).filter((t): t is TopicMeta => Boolean(t))
  const resume = recent[0]
  const recommended = recommendNext(state, resume)

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--text-faint)]">Career Duo</p>
          <h1 className="mt-1 text-[1.9rem] font-semibold leading-tight tracking-tight text-[var(--heading)]">
            {resume ? 'Welcome back' : 'Learn software engineering, properly'}
          </h1>
          <p className="mt-1 max-w-2xl text-[15px] text-[var(--text-muted)]">
            Five tracks — from problem solving to production AI — taught as complete lessons with
            examples, diagrams, practice and revision.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[1.9rem] font-semibold tabular-nums text-[var(--heading)]">{overall.overall}%</div>
          <div className="text-xs text-[var(--text-muted)]">
            of {stats.total} topics complete · {lessonCount} full lessons
          </div>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-faint)]">
            {resume ? 'Continue learning' : 'Start here'}
          </h2>
          {(() => {
            const t = resume ?? getTopicMeta('a1-java-syntax-competitive') ?? TOPICS[0]
            const info = lessonInfo(t.id)
            const status = state.topics[t.id]?.status ?? 'not_started'
            return (
              <div className="mt-2">
                <div className="text-[12px] text-[var(--text-faint)]">
                  {getTrack(t.track)?.name} · {t.sectionId} {t.sectionTitle}
                </div>
                <Link to={`/topics/${t.id}`} className="mt-1 block text-xl font-semibold text-[var(--heading)] hover:text-[var(--accent)]">
                  {t.title}
                </Link>
                {info?.summary && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--text-muted)]">{info.summary}</p>}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link
                    to={`/topics/${t.id}`}
                    className="rounded-md bg-[var(--accent)] px-3.5 py-1.5 text-sm font-medium text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)]"
                  >
                    {resume ? 'Resume lesson' : 'Begin'}
                  </Link>
                  <span className="text-xs text-[var(--text-faint)]">
                    {info?.minutes ? `~${info.minutes} min · ` : ''}
                    {status === 'not_started' ? 'Not started' : status === 'learning' ? 'In progress' : 'Completed'}
                  </span>
                </div>
              </div>
            )
          })()}
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-faint)]">Recommended next</h2>
          <ul className="mt-2 space-y-2.5">
            {recommended.map((t) => (
              <li key={t.id}>
                <Link to={`/topics/${t.id}`} className="group block">
                  <span className="text-sm font-medium text-[var(--heading)] group-hover:text-[var(--accent)]">{t.title}</span>
                  <span className="block text-xs text-[var(--text-faint)]">
                    {getTrack(t.track)?.shortName} · {t.sectionTitle}
                    {hasLesson(t.id) ? ' · full lesson' : ''}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="tracks-title">
        <h2 id="tracks-title" className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-faint)]">
          Learning tracks
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {TRACKS.map((t) => {
            const classified = TOPICS.filter((x) => x.track === t.id && x.curriculumLevel === 'classified-item')
            const ready = classified.filter((x) => hasLesson(x.id)).length
            return (
              <Link
                key={t.id}
                to={`/tracks/${t.id}`}
                className="flex flex-col rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4 hover:border-[var(--border-strong)]"
              >
                <span className="h-1 w-8 rounded-full" style={{ background: t.accent }} aria-hidden />
                <span className="mt-3 text-sm font-semibold leading-snug text-[var(--heading)]">{t.name}</span>
                <span className="mt-1 line-clamp-3 flex-1 text-xs leading-relaxed text-[var(--text-muted)]">{t.description}</span>
                <div className="mt-3">
                  <ProgressBar label={`${classified.length} topics`} value={tracks[t.id]} accent={t.accent} />
                  <span className="mt-1 block text-[11px] text-[var(--text-faint)]">{ready} full lessons</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {recent.length > 1 && (
        <section aria-labelledby="recent-title">
          <h2 id="recent-title" className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-faint)]">
            Recently visited
          </h2>
          <div className="flex flex-wrap gap-2">
            {recent.slice(1, 9).map((t) => (
              <Link
                key={t.id}
                to={`/topics/${t.id}`}
                className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1 text-sm text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]"
              >
                {t.title}
              </Link>
            ))}
          </div>
        </section>
      )}

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

      <a
        href="/nidhi/index.html"
        className="block rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 hover:border-[var(--border-strong)]"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">Europe plan</span>
        <span className="mt-0.5 block text-sm font-medium text-[var(--heading)]">Open the plan and course →</span>
        <span className="block text-xs text-[var(--text-muted)]">
          16-week talent acquisition plan, Excel course, and interview practice.
        </span>
      </a>

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

const DONE = new Set(['first_pass', 'interview_ready'])

/** Next topics after the one being studied, then the first unstarted core lesson of each track. */
function recommendNext(state: UserState, current?: TopicMeta): TopicMeta[] {
  const out: TopicMeta[] = []
  const seen = new Set<string>()
  const push = (t?: TopicMeta) => {
    if (!t || seen.has(t.id) || DONE.has(state.topics[t.id]?.status ?? '')) return
    seen.add(t.id)
    out.push(t)
  }
  if (current) {
    seen.add(current.id)
    const trackTopics = TOPICS.filter((t) => t.track === current.track && t.curriculumLevel === 'classified-item')
    const idx = trackTopics.findIndex((t) => t.id === (current.parentTopicId ?? current.id))
    for (const t of trackTopics.slice(idx + 1, idx + 3)) push(t)
  }
  for (const track of TRACKS) {
    if (out.length >= 5) break
    push(
      TOPICS.find(
        (t) =>
          t.track === track.id &&
          t.curriculumLevel === 'classified-item' &&
          hasLesson(t.id) &&
          (state.topics[t.id]?.status ?? 'not_started') === 'not_started',
      ),
    )
  }
  return out.slice(0, 5)
}
