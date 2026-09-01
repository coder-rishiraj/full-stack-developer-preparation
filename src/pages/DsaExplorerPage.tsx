import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PROBLEMS, filterProblems, getProblemCategories } from '@/content/problems'
import { DsaStatusBadge, PriorityBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/Progress'
import type { DsaStatus } from '@/domain/types'
import { useUserStore } from '@/stores/user-store'

function formatCategory(slug: string) {
  return slug.replace(/-/g, ' ')
}

export function DsaExplorerPage() {
  const problemsState = useUserStore((s) => s.problems)
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
      ),
    [
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
        <h1 className="text-2xl font-semibold">DSA Problem Explorer</h1>
        <p className="text-sm text-[var(--text-muted)]">
          NeetCode 250 ({ncTotal}) + CSES ({csesTotal}) — open the official link for each statement.
        </p>
      </div>

      <ProgressBar label={`Progress ${solved}/${PROBLEMS.length}`} value={Math.round((solved / PROBLEMS.length) * 100)} />

      <div className="print-hidden flex flex-wrap gap-2" data-screen-only>
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
              {s}
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

      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--bg-muted)] text-xs uppercase text-[var(--text-faint)]">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Problem</th>
              <th className="px-3 py-2">Source</th>
              <th className="px-3 py-2">Category</th>
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
                  <td className="px-3 py-2 capitalize text-[var(--text-muted)]">{formatCategory(p.category)}</td>
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
      <p className="text-xs text-[var(--text-faint)]">{filtered.length} problems shown</p>
    </div>
  )
}
