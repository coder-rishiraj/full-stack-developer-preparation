import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { TOPICS, getTopicMeta } from '@/content/taxonomy'
import { hasLesson } from '@/content/lessons'
import { PROBLEMS, filterProblems, getProblemCategories } from '@/content/problems'
import { DsaStatusBadge, PriorityBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/Progress'
import type { DsaProblem, DsaStatus } from '@/domain/types'

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
const TOPIC_ORDER = new Map(TOPICS.map((t, i) => [t.id, i]))
import { useUserStore } from '@/stores/user-store'

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
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [status, setStatus] = useState('')
  const [query, setQuery] = useState('')
  const [unsolved, setUnsolved] = useState(false)
  const [needsRevision, setNeedsRevision] = useState(false)
  const [solvedIndependently, setSolvedIndependently] = useState(false)
  const [solvedWithHints, setSolvedWithHints] = useState(false)

  const categories = useMemo(
    () => getProblemCategories(source || undefined),
    [source],
  )

  const filtered = useMemo(
    () =>
      filterProblems(
        PROBLEMS,
        {
          source: source || undefined,
          category: category || undefined,
          difficulty: (difficulty || undefined) as 'easy' | 'medium' | 'hard' | 'unknown' | undefined,
          status: status || undefined,
          query,
          unsolved: unsolved || undefined,
          needsRevision: needsRevision || undefined,
          solvedIndependently: solvedIndependently || undefined,
          solvedWithHints: solvedWithHints || undefined,
        },
        problemsState,
      ).filter((p) => !topic || p.primaryTopic === topic),
    [
      topic,
      source,
      category,
      difficulty,
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
          NeetCode 250 ({ncTotal}) and CSES ({csesTotal}), organised by the curriculum topic that teaches the
          pattern. Read the lesson first, then practise; each problem links to its official statement.
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
            By topic
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
          onChange={(e) => {
            setSource(e.target.value as typeof source)
            setCategory('')
          }}
        >
          <option value="">All sources</option>
          <option value="cses">CSES</option>
          <option value="neetcode250">NeetCode 250</option>
        </select>
        <select
          className="rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {formatCategory(c)}
            </option>
          ))}
        </select>
        <select className="rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-sm" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">All difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="unknown">Unknown (CSES)</option>
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
              <th className="px-3 py-2">Learn</th>
              <th className="px-3 py-2">Difficulty</th>
              <th className="px-3 py-2">Priority</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const st = (problemsState[p.id]?.status ?? 'not_attempted') as DsaStatus
              return (
                <tr key={p.id} className="border-t border-[var(--border)]">
                  <td className="px-3 py-2 text-[var(--text-faint)]">{p.listOrder}</td>
                  <td className="px-3 py-2">
                    <Link className="font-medium text-[var(--accent)] hover:underline" to={`/dsa/${p.id}`}>
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-[var(--text-muted)]">{p.source === 'cses' ? 'CSES' : 'NeetCode'}</td>
                  <td className="px-3 py-2 text-[var(--text-muted)]">
                    <LearnLink topicId={p.primaryTopic} fallback={formatCategory(p.category)} />
                  </td>
                  <td className="px-3 py-2 capitalize">{p.difficulty}</td>
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

function GroupedProblems({
  problems,
  problemsState,
}: {
  problems: DsaProblem[]
  problemsState: Record<string, { status: DsaStatus } | undefined>
}) {
  const groups = useMemo(() => {
    const map = new Map<string, DsaProblem[]>()
    for (const p of problems) {
      const list = map.get(p.primaryTopic) ?? []
      list.push(p)
      map.set(p.primaryTopic, list)
    }
    return [...map.entries()].sort(
      (a, b) => (TOPIC_ORDER.get(a[0]) ?? 1e9) - (TOPIC_ORDER.get(b[0]) ?? 1e9),
    )
  }, [problems])

  if (groups.length === 0) return <p className="text-sm text-[var(--text-muted)]">No problems match these filters.</p>

  return (
    <div className="space-y-4">
      {groups.map(([topicId, list]) => {
        const meta = getTopicMeta(topicId)
        const solved = list.filter((p) => SOLVED.has(problemsState[p.id]?.status ?? 'not_attempted')).length
        return (
          <section key={topicId} className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]">
            <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-[var(--border)] px-4 py-2.5">
              <h2 className="text-sm font-semibold text-[var(--heading)]">
                {meta ? (
                  <Link to={`/topics/${meta.id}`} className="hover:text-[var(--accent)]">
                    {meta.title}
                  </Link>
                ) : (
                  topicId
                )}
              </h2>
              {meta && <span className="text-xs text-[var(--text-faint)]">{meta.sectionId} · {meta.sectionTitle}</span>}
              {meta && hasLesson(meta.id) && (
                <Link to={`/topics/${meta.id}`} className="text-xs font-medium text-[var(--accent)]">
                  Read the lesson →
                </Link>
              )}
              <span className="ml-auto text-xs tabular-nums text-[var(--text-faint)]">
                {solved}/{list.length} solved
              </span>
            </header>
            <ul className="divide-y divide-[var(--border)]">
              {list.map((p) => {
                const st = (problemsState[p.id]?.status ?? 'not_attempted') as DsaStatus
                return (
                  <li key={p.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 text-sm">
                    <Link className="min-w-0 flex-1 font-medium text-[var(--text)] hover:text-[var(--accent)]" to={`/dsa/${p.id}`}>
                      {p.name}
                    </Link>
                    <span className="text-xs text-[var(--text-faint)]">{p.source === 'cses' ? 'CSES' : 'NeetCode'}</span>
                    <span className={`w-16 text-xs capitalize ${p.difficulty === 'hard' ? 'text-[var(--danger)]' : p.difficulty === 'medium' ? 'text-[var(--warning)]' : p.difficulty === 'easy' ? 'text-[var(--success)]' : 'text-[var(--text-faint)]'}`}>
                      {p.difficulty === 'unknown' ? '—' : p.difficulty}
                    </span>
                    <DsaStatusBadge status={st} />
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
