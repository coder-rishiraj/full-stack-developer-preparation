import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  curriculumStats,
  getTopicMeta,
  SECTIONS,
  TRACKS,
} from '@/content/taxonomy'
import {
  groupSectionsForDisplay,
  topicsInDisplaySection,
} from '@/content/section-display'
import { filterTopics, getTopicProgress } from '@/domain/progress-selectors'
import {
  ROADMAP_PHASES,
  phaseForMonth,
  topicsForPhase,
  type RoadmapPhase,
} from '@/domain/roadmap'
import {
  ExecutionPriorityBadge,
  PriorityBadge,
  StatusBadge,
} from '@/components/ui/Badge'
import type {
  ExecutionPriority,
  Priority,
  StudyStatus,
  TopicMeta,
  TrackId,
} from '@/domain/types'
import { useUserStore } from '@/stores/user-store'

const COMPLETED: StudyStatus[] = ['first_pass', 'interview_ready']

export function RoadmapExplorer() {
  const state = useUserStore()
  const [month, setMonth] = useState<number | ''>('')
  const [track, setTrack] = useState<TrackId | ''>('')
  const [knowledgeTier, setKnowledgeTier] = useState<Priority | ''>('')
  const [executionPriority, setExecutionPriority] =
    useState<ExecutionPriority | ''>('')
  const [status, setStatus] = useState<StudyStatus | ''>('')

  const topics = useMemo(
    () =>
      filterTopics({
        track: track === '' ? undefined : track,
        priority: knowledgeTier === '' ? undefined : knowledgeTier,
        executionPriority:
          executionPriority === '' ? undefined : executionPriority,
        status: status === '' ? undefined : status,
        state,
      }),
    [track, knowledgeTier, executionPriority, status, state],
  )

  const phases = useMemo<RoadmapPhase[]>(() => {
    if (month === '') return ROADMAP_PHASES
    const parent = phaseForMonth(month)
    return [
      {
        ...parent,
        startMonth: month,
        endMonth: month,
        title: `Month ${month} · ${parent.title}`,
      },
    ]
  }, [month])

  const filtersActive =
    month !== '' ||
    track !== '' ||
    knowledgeTier !== '' ||
    executionPriority !== '' ||
    status !== ''

  const classifiedCount = topics.filter(
    (topic) => topic.curriculumLevel === 'classified-item',
  ).length
  const nestedCount = topics.length - classifiedCount
  const completedCount = topics.filter((topic) =>
    COMPLETED.includes(getTopicProgress(state, topic.id).status),
  ).length
  const catalog = curriculumStats()
  const p0Remaining = topics.filter(
    (topic) =>
      topic.curriculumLevel === 'classified-item' &&
      topic.executionPriority === 'p0' &&
      !COMPLETED.includes(getTopicProgress(state, topic.id).status),
  ).length

  function resetFilters() {
    setMonth('')
    setTrack('')
    setKnowledgeTier('')
    setExecutionPriority('')
    setStatus('')
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">12-month plan</h2>
        <p className="text-sm text-[var(--text-muted)]">
          {catalog.sections} sections · {catalog.total} classified ·{' '}
          {catalog.nestedConcepts} nested. Filter by month, track, knowledge
          tier, execution priority, or status — then open a phase to browse the
          full syllabus.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PlanStat label="Classified (filtered)" value={classifiedCount} />
        <PlanStat label="Nested (filtered)" value={nestedCount} />
        <PlanStat
          label="Completed (filtered)"
          value={`${completedCount}/${topics.length}`}
        />
        <PlanStat label="P0 remaining" value={p0Remaining} />
      </div>

      <div
        className="print-hidden flex flex-wrap items-center gap-2"
        data-screen-only
      >
        <select
          className="rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-sm"
          value={month}
          onChange={(event) =>
            setMonth(event.target.value === '' ? '' : Number(event.target.value))
          }
          aria-label="Roadmap month"
        >
          <option value="">All months</option>
          {Array.from({ length: 12 }, (_, index) => index + 1).map((value) => (
            <option key={value} value={value}>
              Month {value}
            </option>
          ))}
        </select>
        <select
          className="rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-sm"
          value={track}
          onChange={(event) => setTrack(event.target.value as TrackId | '')}
          aria-label="Roadmap track"
        >
          <option value="">All tracks</option>
          {TRACKS.map((item) => (
            <option key={item.id} value={item.id}>
              Track {item.id} — {item.shortName}
            </option>
          ))}
        </select>
        <select
          className="rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-sm"
          value={knowledgeTier}
          onChange={(event) =>
            setKnowledgeTier(event.target.value as Priority | '')
          }
          aria-label="Knowledge importance"
        >
          <option value="">All knowledge tiers</option>
          <option value="tier1">🔴 Tier 1 · Must know deeply</option>
          <option value="tier2">🟠 Tier 2 · Working knowledge</option>
          <option value="tier3">🟡 Tier 3 · Learn later</option>
        </select>
        <select
          className="rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-sm"
          value={executionPriority}
          onChange={(event) =>
            setExecutionPriority(
              event.target.value as ExecutionPriority | '',
            )
          }
          aria-label="Job-switch execution priority"
        >
          <option value="">All execution priorities</option>
          <option value="p0">P0 · Do now</option>
          <option value="p1">P1 · Do next</option>
          <option value="p2">P2 · Depth / polish</option>
          <option value="later">Later · Defer</option>
        </select>
        <select
          className="rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-sm"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as StudyStatus | '')
          }
          aria-label="Study status"
        >
          <option value="">All statuses</option>
          <option value="not_started">Not Started</option>
          <option value="learning">Learning</option>
          <option value="first_pass">First Pass</option>
          <option value="interview_ready">Interview Ready</option>
          <option value="needs_revision">Needs Revision</option>
        </select>
        {filtersActive && (
          <button
            type="button"
            className="rounded border border-[var(--border)] px-2 py-1.5 text-sm text-[var(--accent)]"
            onClick={resetFilters}
          >
            Reset filters
          </button>
        )}
      </div>

      <div className="space-y-4">
        {phases.map((phase) => {
          const phaseTopics = topicsForPhase(topics, phase)
          return (
            <PhaseTree
              key={`${phase.id}-${phase.startMonth}-${phase.endMonth}`}
              phase={phase}
              topics={phaseTopics}
              state={state}
              defaultOpen={phase.id === 1 || filtersActive}
              filtersActive={filtersActive}
            />
          )
        })}
      </div>
    </section>
  )
}

function PlanStat({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-xs text-[var(--text-muted)]">{label}</div>
    </div>
  )
}

function SectionCountStrip({
  done,
  total,
  byTier,
  nested,
}: {
  done: number
  total: number
  byTier: { tier1: number; tier2: number; tier3: number }
  nested: number
}) {
  return (
    <div className="grid shrink-0 grid-cols-[5.75rem_3.25rem_3.25rem_3.25rem_4.75rem] items-center gap-x-2 text-right text-[11px] tabular-nums text-[var(--text-faint)]">
      <span className="whitespace-nowrap">
        {done}/{total} done
      </span>
      <span className="whitespace-nowrap">🔴 {byTier.tier1}</span>
      <span className="whitespace-nowrap">🟠 {byTier.tier2}</span>
      <span className="whitespace-nowrap">🟡 {byTier.tier3}</span>
      <span className="whitespace-nowrap">{nested > 0 ? `${nested} nested` : ''}</span>
    </div>
  )
}

function PhaseTree({
  phase,
  topics,
  state,
  defaultOpen,
  filtersActive,
}: {
  phase: RoadmapPhase
  topics: TopicMeta[]
  state: ReturnType<typeof useUserStore.getState>
  defaultOpen: boolean
  filtersActive: boolean
}) {
  const classified = topics.filter(
    (topic) => topic.curriculumLevel === 'classified-item',
  ).length
  const completed = topics.filter((topic) =>
    COMPLETED.includes(getTopicProgress(state, topic.id).status),
  ).length
  const monthLabel =
    phase.startMonth === phase.endMonth
      ? `Month ${phase.startMonth}`
      : `Months ${phase.startMonth}–${phase.endMonth}`
  const activeTracks = TRACKS.filter((track) =>
    topics.some((topic) => topic.track === track.id),
  )

  return (
    <details
      open={defaultOpen}
      className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]"
    >
      <summary className="cursor-pointer list-none p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)]">
              Phase {phase.id} · {monthLabel}
            </p>
            <h3 className="font-semibold">{phase.title}</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {phase.focus}
            </p>
          </div>
          <div className="text-right text-xs text-[var(--text-muted)]">
            <div>{classified} classified items</div>
            <div>
              {completed}/{topics.length} concepts completed
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          <strong className="text-[var(--text)]">Outcome:</strong>{' '}
          {phase.outcome}
        </p>
      </summary>

      <div className="space-y-3 border-t border-[var(--border)] p-4">
        {topics.length === 0 ? (
          <p className="text-sm text-[var(--text-faint)]">
            No items match the active filters.
          </p>
        ) : (
          activeTracks.map((track) => {
            const trackTopics = topics.filter(
              (topic) => topic.track === track.id,
            )
            return (
              <details
                key={track.id}
                open={filtersActive}
                className="rounded-md border border-[var(--border)]"
              >
                <summary className="cursor-pointer list-none px-3 py-2.5">
                  <span className="flex flex-wrap items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: track.accent }}
                      aria-hidden
                    />
                    <strong className="text-sm">
                      Track {track.id} — {track.shortName}
                    </strong>
                    <span className="text-xs text-[var(--text-faint)]">
                      {
                        trackTopics.filter(
                          (topic) =>
                            topic.curriculumLevel === 'classified-item',
                        ).length
                      }{' '}
                      items · {trackTopics.length} concepts
                    </span>
                  </span>
                </summary>
                <div className="space-y-2 border-t border-[var(--border)] p-3">
                  {groupSectionsForDisplay(sectionsForTopics(trackTopics)).map(
                    (group) => {
                      const sectionTopics = topicsInDisplaySection(
                        trackTopics,
                        group,
                      )
                      return (
                        <SectionTree
                          key={group.id}
                          sectionId={group.id}
                          sectionTitle={group.title}
                          topics={sectionTopics}
                          subsections={
                            group.sections.length > 1
                              ? group.sections
                              : undefined
                          }
                          state={state}
                          defaultOpen={filtersActive}
                        />
                      )
                    },
                  )}
                </div>
              </details>
            )
          })
        )}
      </div>
    </details>
  )
}

function sectionsForTopics(topics: TopicMeta[]) {
  const ids = new Set(topics.map((topic) => topic.sectionId))
  const canonical = SECTIONS.filter((section) => ids.has(section.id))
  const known = new Set(canonical.map((section) => section.id))
  const custom = topics
    .filter((topic) => !known.has(topic.sectionId))
    .map((topic) => ({
      id: topic.sectionId,
      title: topic.sectionTitle,
      order: Number.MAX_SAFE_INTEGER,
      track: topic.track,
    }))
    .filter(
      (section, index, all) =>
        all.findIndex((candidate) => candidate.id === section.id) === index,
    )
  return [...canonical, ...custom]
}

function SectionTree({
  sectionId,
  sectionTitle,
  topics,
  subsections,
  state,
  defaultOpen,
}: {
  sectionId: string
  sectionTitle: string
  topics: TopicMeta[]
  subsections?: { id: string; title: string }[]
  state: ReturnType<typeof useUserStore.getState>
  defaultOpen: boolean
}) {
  const classified = topics.filter(
    (topic) => topic.curriculumLevel === 'classified-item',
  )
  const nested = topics.length - classified.length
  const done = topics.filter((topic) =>
    COMPLETED.includes(getTopicProgress(state, topic.id).status),
  ).length
  const byTier = {
    tier1: classified.filter((topic) => topic.priority === 'tier1').length,
    tier2: classified.filter((topic) => topic.priority === 'tier2').length,
    tier3: classified.filter((topic) => topic.priority === 'tier3').length,
  }

  const rows = subsections?.length
    ? subsections.flatMap((subsection) => {
        const slice = topics.filter(
          (topic) => topic.sectionId === subsection.id,
        )
        if (slice.length === 0) return []
        return [
          { kind: 'label' as const, subsection },
          ...slice.map((topic) => ({ kind: 'topic' as const, topic })),
        ]
      })
    : topics.map((topic) => ({ kind: 'topic' as const, topic }))

  return (
    <details open={defaultOpen} className="rounded-md bg-[var(--bg-muted)]">
      <summary className="cursor-pointer list-none px-3 py-2">
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 truncate text-sm font-semibold">
            {sectionId} — {sectionTitle}
          </span>
          <SectionCountStrip
            done={done}
            total={topics.length}
            byTier={byTier}
            nested={nested}
          />
        </div>
      </summary>

      <ul className="space-y-2 border-t border-[var(--border)] bg-[var(--bg-elevated)] p-3">
        {rows.map((row) => {
          if (row.kind === 'label') {
            return (
              <li
                key={`${row.subsection.id}-label`}
                className="px-1 pt-2 first:pt-0"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-faint)]">
                  {row.subsection.id} — {row.subsection.title}
                </p>
              </li>
            )
          }
          const topic = row.topic
          const progress = getTopicProgress(state, topic.id)
          const parent = topic.parentTopicId
            ? getTopicMeta(topic.parentTopicId)
            : undefined
          return (
            <li
              key={topic.id}
              className="rounded border border-[var(--border)] px-3 py-2"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_5.75rem_6.5rem_8.25rem_7.5rem] items-center gap-x-2">
                <div
                  className={`min-w-0 ${
                    topic.curriculumLevel === 'nested-concept' ? 'pl-4' : ''
                  }`}
                >
                  <Link
                    className="block truncate font-medium text-[var(--accent)] hover:underline"
                    to={`/topics/${topic.id}`}
                  >
                    {topic.title}
                  </Link>
                  <div className="truncate text-[11px] text-[var(--text-faint)]">
                    Study window: M{topic.targetMonths.join(', M')}
                    {parent ? (
                      <>
                        {' '}
                        · Under{' '}
                        <Link
                          className="text-[var(--accent)] hover:underline"
                          to={`/topics/${parent.id}`}
                        >
                          {parent.title}
                        </Link>
                      </>
                    ) : null}
                  </div>
                </div>
                <span className="justify-self-start">
                  <PriorityBadge priority={topic.priority} />
                </span>
                <span className="justify-self-start">
                  <ExecutionPriorityBadge priority={topic.executionPriority} />
                </span>
                <span className="justify-self-start">
                  <StatusBadge status={progress.status} />
                </span>
                <span className="justify-self-start">
                  {topic.curriculumLevel === 'nested-concept' && (
                    <span className="rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--text-faint)]">
                      Nested
                    </span>
                  )}
                  {topic.id.startsWith('custom-') && (
                    <span className="rounded bg-[var(--accent-soft)] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[var(--accent)]">
                      Custom
                    </span>
                  )}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </details>
  )
}
