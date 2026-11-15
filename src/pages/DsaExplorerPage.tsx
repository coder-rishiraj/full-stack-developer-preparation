import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getTopicMeta } from '@/content/taxonomy'
import { hasLesson } from '@/content/lessons'
import { hasProblemPage } from '@/content/problem-pages'
import {
  PROBLEMS,
  PROBLEMS_IN_ROADMAP_ORDER,
  ROADMAP,
  ROADMAP_LEVELS,
  ROADMAP_TOPICS,
  filterProblems,
  getRoadmapTopic,
  type RoadmapLevel,
  type RoadmapTier,
} from '@/content/problems'
import { DsaStatusBadge, PriorityBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/Progress'
import type { DsaProblem, DsaStatus } from '@/domain/types'
import { useUserStore } from '@/stores/user-store'

const STATUS_LABEL: Record<DsaStatus, string> = {
  not_attempted: 'Not attempted',
  attempted: 'Attempted',
  could_not_solve: 'Could not solve',
  solved_with_hint: 'Solved with hint',
  solved_independently: 'Solved independently',
  revision_due: 'Revision due',
  mastered: 'Mastered',
}

const SOLVED = new Set<DsaStatus>(['solved_independently', 'solved_with_hint', 'mastered'])

const LEVEL_LABEL = Object.fromEntries(ROADMAP_LEVELS.map((l) => [l.id, l.label])) as Record<RoadmapLevel, string>
const LEVEL_COLOR: Record<RoadmapLevel, string> = {
  beginner: 'text-[var(--success)]',
  easy: 'text-[var(--success)]',
  medium: 'text-[var(--warning)]',
  hard: 'text-[var(--danger)]',
  'very-hard': 'text-[var(--danger)]',
}
const TIER_LABEL: Record<RoadmapTier, string> = { core: 'Core', challenge: 'Challenge' }

/** Roadmap level with the score; the source's own difficulty goes in the tooltip. */
function LevelTag({ problem }: { problem: DsaProblem }) {
  const entry = ROADMAP[problem.id]
  if (!entry) return <span className="text-xs text-[var(--text-faint)]">—</span>
  const source = problem.difficulty === 'unknown' ? '' : `LeetCode ${problem.difficulty}; `
  return (
    <span className={`whitespace-nowrap text-xs ${LEVEL_COLOR[entry.level]}`} title={`${source}${entry.basis}`}>
      {LEVEL_LABEL[entry.level]} <span className="tabular-nums text-[var(--text-faint)]">{entry.score.toFixed(1)}</span>
    </span>
  )
}

/** Marks problems that have a written interview walkthrough on their page. */
function WalkthroughMark() {
  return (
    <span className="ml-1.5 text-[10.5px] font-semibold uppercase text-[var(--accent)]">walkthrough</span>
  )
}

function formatCategory(slug: string) {
  return slug.replace(/-/g, ' ')
}

export function DsaExplorerPage() {
  const problemsState = useUserStore((s) => s.problems)
  const [params, setParams] = useSearchParams()
  const topic = params.get('topic') ?? ''
  const topicMeta = topic ? getTopicMeta(topic) : undefined
  const [grouped, setGrouped] = useState(true)
  const [source, setSource] = useState<'' | 'cses' | 'neetcode250'>('')
  const [roadmapTopic, setRoadmapTopic] = useState('')
  const [level, setLevel] = useState<'' | RoadmapLevel>('')
  const [coreOnly, setCoreOnly] = useState(false)
  const [status, setStatus] = useState('')
  const [query, setQuery] = useState('')
  const [unsolved, setUnsolved] = useState(false)
  const [needsRevision, setNeedsRevision] = useState(false)
  const [solvedIndependently, setSolvedIndependently] = useState(false)
  const [solvedWithHints, setSolvedWithHints] = useState(false)

  const filtered = useMemo(
    () =>
      filterProblems(
        PROBLEMS_IN_ROADMAP_ORDER,
        {
          source: source || undefined,
          status: status || undefined,
          query,
          unsolved: unsolved || undefined,
          needsRevision: needsRevision || undefined,
          solvedIndependently: solvedIndependently || undefined,
          solvedWithHints: solvedWithHints || undefined,
        },
        problemsState,
      ).filter((p) => {
        if (topic && p.primaryTopic !== topic) return false
        const entry = ROADMAP[p.id]
        if (roadmapTopic && entry?.topicId !== roadmapTopic) return false
        if (level && entry?.level !== level) return false
        if (coreOnly && entry?.tier !== 'core') return false
        return true
      }),
    [
      topic,
      source,
      roadmapTopic,
      level,
      coreOnly,
      status,
      query,
      unsolved,
      needsRevision,
      solvedIndependently,
      solvedWithHints,
      problemsState,
    ],
  )

  const solved = PROBLEMS.filter((p) => {
    const s = problemsState[p.id]?.status
    return s === 'solved_independently' || s === 'solved_with_hint' || s === 'mastered'
  }).length

  const ncTotal = PROBLEMS.filter((p) => p.source === 'neetcode250').length
  const csesTotal = PROBLEMS.filter((p) => p.source === 'cses').length

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 md:px-6">
      <div>
        <h1 className="text-[1.9rem] font-semibold tracking-tight text-[var(--heading)]">DSA Problems</h1>
        <p className="mt-1 max-w-3xl text-[15px] text-[var(--text-muted)]">
          NeetCode 250 ({ncTotal}) and CSES ({csesTotal}) in one roadmap of {ROADMAP_TOPICS.length} topics. Each
          topic starts with its Core problems and ends with a Challenge tier; problems that use the same technique are
          grouped, easiest first. Each problem links to its official statement.
        </p>
      </div>

      <ProgressBar label={`Progress ${solved}/${PROBLEMS.length}`} value={Math.round((solved / PROBLEMS.length) * 100)} />

      {topic && (
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm">
          <span className="text-[var(--text-muted)]">Problems for</span>
          <Link className="cd-link font-medium" to={`/topics/${topic}`}>
            {topicMeta?.title ?? topic}
          </Link>
          <button type="button" className="ml-auto text-xs text-[var(--text-muted)] hover:text-[var(--text)]" onClick={() => setParams({})}>
            Show all problems ×
          </button>
        </div>
      )}

      <div className="print-hidden flex flex-wrap gap-2" data-screen-only>
        <div className="inline-flex rounded-md bg-[var(--bg-muted)] p-0.5 text-xs" role="group" aria-label="Layout">
          <button type="button" aria-pressed={grouped} onClick={() => setGrouped(true)} className={`rounded px-2.5 py-1 ${grouped ? 'bg-[var(--bg-elevated)] font-medium text-[var(--heading)] shadow-sm' : 'text-[var(--text-muted)]'}`}>
            Roadmap
          </button>
          <button type="button" aria-pressed={!grouped} onClick={() => setGrouped(false)} className={`rounded px-2.5 py-1 ${!grouped ? 'bg-[var(--bg-elevated)] font-medium text-[var(--heading)] shadow-sm' : 'text-[var(--text-muted)]'}`}>
            List
          </button>
        </div>
        <input
          className="min-w-[12rem] flex-1 rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-sm"
          placeholder="Search problems…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-sm"
          value={source}
          onChange={(e) => setSource(e.target.value as typeof source)}
        >
          <option value="">All sources</option>
          <option value="cses">CSES</option>
          <option value="neetcode250">NeetCode 250</option>
        </select>
        <select
          className="max-w-[16rem] rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-sm"
          value={roadmapTopic}
          onChange={(e) => setRoadmapTopic(e.target.value)}
          aria-label="Roadmap topic"
        >
          <option value="">All topics</option>
          {ROADMAP_TOPICS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.order}. {t.title}
            </option>
          ))}
        </select>
        <select
          className="rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-sm"
          value={level}
          onChange={(e) => setLevel(e.target.value as typeof level)}
          aria-label="Level"
        >
          <option value="">All levels</option>
          {ROADMAP_LEVELS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
        <select className="rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {(
            [
              'not_attempted',
              'attempted',
              'could_not_solve',
              'solved_with_hint',
              'solved_independently',
              'revision_due',
              'mastered',
            ] as DsaStatus[]
          ).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1 text-xs">
          <input type="checkbox" checked={coreOnly} onChange={(e) => setCoreOnly(e.target.checked)} />
          Core only
        </label>
        <label className="flex items-center gap-1 text-xs">
          <input type="checkbox" checked={unsolved} onChange={(e) => setUnsolved(e.target.checked)} />
          Unsolved
        </label>
        <label className="flex items-center gap-1 text-xs">
          <input type="checkbox" checked={needsRevision} onChange={(e) => setNeedsRevision(e.target.checked)} />
          Needs revision
        </label>
        <label className="flex items-center gap-1 text-xs">
          <input type="checkbox" checked={solvedIndependently} onChange={(e) => setSolvedIndependently(e.target.checked)} />
          Independent
        </label>
        <label className="flex items-center gap-1 text-xs">
          <input type="checkbox" checked={solvedWithHints} onChange={(e) => setSolvedWithHints(e.target.checked)} />
          With hints
        </label>
      </div>

      {grouped ? (
        <GroupedProblems problems={filtered} problemsState={problemsState} />
      ) : (
      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--bg-muted)] text-xs uppercase text-[var(--text-faint)]">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Problem</th>
              <th className="px-3 py-2">Source</th>
              <th className="px-3 py-2">Roadmap topic</th>
              <th className="px-3 py-2">Level</th>
              <th className="px-3 py-2">Learn</th>
              <th className="px-3 py-2">Priority</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const st = (problemsState[p.id]?.status ?? 'not_attempted') as DsaStatus
              return (
                <tr key={p.id} className="border-t border-[var(--border)]">
                  <td className="px-3 py-2 tabular-nums text-[var(--text-faint)]">{ROADMAP[p.id]?.order ?? '—'}</td>
                  <td className="px-3 py-2">
                    <Link className="font-medium text-[var(--accent)] hover:underline" to={`/dsa/${p.id}`}>
                      {p.name}
                    </Link>
                    {hasProblemPage(p.id) && <WalkthroughMark />}
                  </td>
                  <td className="px-3 py-2 text-[var(--text-muted)]">{p.source === 'cses' ? 'CSES' : 'NeetCode'}</td>
                  <td className="px-3 py-2 text-[var(--text-muted)]">
                    {getRoadmapTopic(ROADMAP[p.id]?.topicId ?? '')?.title ?? '—'}
                    {ROADMAP[p.id] && (
                      <span className="block text-xs text-[var(--text-faint)]">
                        {TIER_LABEL[ROADMAP[p.id].tier]} · {ROADMAP[p.id].group}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <LevelTag problem={p} />
                  </td>
                  <td className="px-3 py-2 text-[var(--text-muted)]">
                    <LearnLink topicId={p.primaryTopic} fallback={formatCategory(p.category)} />
                  </td>
                  <td className="px-3 py-2">
                    <PriorityBadge priority={p.priority} />
                  </td>
                  <td className="px-3 py-2">
                    <DsaStatusBadge status={st} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      )}
      <p className="text-xs text-[var(--text-faint)]">{filtered.length} problems shown</p>
    </div>
  )
}

function LearnLink({ topicId, fallback }: { topicId: string; fallback: string }) {
  const meta = getTopicMeta(topicId)
  if (!meta) return <span className="capitalize">{fallback}</span>
  return (
    <Link to={`/topics/${meta.id}`} className="hover:text-[var(--accent)]">
      {meta.title}
      {hasLesson(meta.id) && <span className="ml-1.5 text-[10.5px] font-semibold uppercase text-[var(--accent)]">lesson</span>}
    </Link>
  )
}

type TopicBlock = {
  topicId: string
  tiers: { tier: RoadmapTier; groups: { name: string; problems: DsaProblem[] }[] }[]
  problems: DsaProblem[]
}

/** Problems arrive in roadmap order, so consecutive runs share a topic, tier and group. */
function toBlocks(problems: DsaProblem[]): TopicBlock[] {
  const blocks: TopicBlock[] = []
  for (const p of problems) {
    const entry = ROADMAP[p.id]
    if (!entry) continue
    let block = blocks[blocks.length - 1]
    if (!block || block.topicId !== entry.topicId) {
      block = { topicId: entry.topicId, tiers: [], problems: [] }
      blocks.push(block)
    }
    block.problems.push(p)
    let tier = block.tiers[block.tiers.length - 1]
    if (!tier || tier.tier !== entry.tier) {
      tier = { tier: entry.tier, groups: [] }
      block.tiers.push(tier)
    }
    let group = tier.groups[tier.groups.length - 1]
    if (!group || group.name !== entry.group) {
      group = { name: entry.group, problems: [] }
      tier.groups.push(group)
    }
    group.problems.push(p)
  }
  return blocks
}

/**
 * The curriculum lesson behind a roadmap topic: the lesson that at least 60% of the topic's
 * problems point to, if it is written. Mixed topics get no link rather than a misleading one.
 */
function mainLesson(problems: DsaProblem[]) {
  const counts = new Map<string, number>()
  for (const p of problems) counts.set(p.primaryTopic, (counts.get(p.primaryTopic) ?? 0) + 1)
  const [best] = [...counts.entries()].sort((a, b) => b[1] - a[1])
  if (!best || best[1] < problems.length * 0.6) return undefined
  const meta = getTopicMeta(best[0])
  return meta && hasLesson(meta.id) ? meta : undefined
}

function GroupedProblems({
  problems,
  problemsState,
}: {
  problems: DsaProblem[]
  problemsState: Record<string, { status: DsaStatus } | undefined>
}) {
  const blocks = useMemo(() => toBlocks(problems), [problems])

  if (blocks.length === 0) return <p className="text-sm text-[var(--text-muted)]">No problems match these filters.</p>

  return (
    <div className="space-y-4">
      {blocks.map((block) => {
        const topic = getRoadmapTopic(block.topicId)
        const lesson = mainLesson(block.problems)
        const solved = block.problems.filter((p) => SOLVED.has(problemsState[p.id]?.status ?? 'not_attempted')).length
        return (
          <section key={block.topicId} className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]">
            <header className="border-b border-[var(--border)] px-4 py-2.5">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="text-sm font-semibold text-[var(--heading)]">
                  <span className="tabular-nums text-[var(--text-faint)]">{topic?.order}.</span> {topic?.title ?? block.topicId}
                </h2>
                {lesson && (
                  <Link to={`/topics/${lesson.id}`} className="text-xs font-medium text-[var(--accent)]">
                    Lesson: {lesson.title} →
                  </Link>
                )}
                <span className="ml-auto text-xs tabular-nums text-[var(--text-faint)]">
                  {solved}/{block.problems.length} solved
                </span>
              </div>
              {topic?.focus && <p className="mt-0.5 text-xs text-[var(--text-muted)]">{topic.focus}</p>}
            </header>
            {block.tiers.map((tier) => (
              <div key={tier.tier}>
                <div className="border-b border-[var(--border)] bg-[var(--bg-muted)] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-faint)]">
                  {TIER_LABEL[tier.tier]}
                  {tier.tier === 'challenge' && <span className="ml-2 font-normal normal-case tracking-normal">harder problems for a second pass</span>}
                </div>
                {tier.groups.map((group) => (
                  <div key={group.name}>
                    <h3 className="px-4 pt-2.5 text-xs font-medium text-[var(--text-muted)]">{group.name}</h3>
                    <ul className="divide-y divide-[var(--border)]">
                      {group.problems.map((p) => {
                        const st = (problemsState[p.id]?.status ?? 'not_attempted') as DsaStatus
                        return (
                          <li key={p.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 text-sm">
                            <Link className="min-w-0 flex-1 font-medium text-[var(--text)] hover:text-[var(--accent)]" to={`/dsa/${p.id}`}>
                              {p.name}
                              {hasProblemPage(p.id) && <WalkthroughMark />}
                            </Link>
                            <span className="text-xs text-[var(--text-faint)]">{p.source === 'cses' ? 'CSES' : 'NeetCode'}</span>
                            <span className="w-24">
                              <LevelTag problem={p} />
                            </span>
                            <DsaStatusBadge status={st} />
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </section>
        )
      })}
    </div>
  )
}
