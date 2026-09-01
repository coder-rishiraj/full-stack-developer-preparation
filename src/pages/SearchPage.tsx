import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchAll } from '@/lib/search'
import {
  ExecutionPriorityBadge,
  PriorityBadge,
  TrackBadge,
} from '@/components/ui/Badge'
import type { ExecutionPriority, Priority, TrackId } from '@/domain/types'
import { listCustomTopicsFromMap } from '@/domain/user-content'
import { useUserStore } from '@/stores/user-store'

export function SearchPage() {
  const [query, setQuery] = useState('')
  const customTopicsMap = useUserStore((s) => s.customTopics)
  const customTopics = useMemo(
    () => listCustomTopicsFromMap(customTopicsMap),
    [customTopicsMap],
  )
  const results = useMemo(() => searchAll(query, 30, customTopics), [query, customTopics])

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 md:px-6">
      <div>
        <h1 className="text-2xl font-semibold">Search</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Curriculum topics, custom topics, and DSA problems.
        </p>
      </div>
      <input
        autoFocus
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
        placeholder="Search curriculum…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search"
      />
      <ul className="space-y-2">
        {results.map((r) => {
          const href =
            r.type === 'problem'
              ? `/dsa/${r.id.replace('problem:', '')}`
              : `/topics/${r.topic}`
          return (
            <li key={r.id} className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] uppercase text-[var(--text-faint)]">
                  {r.type}
                  {r.topic?.startsWith('custom-') ? ' · custom' : ''}
                </span>
                {r.track && <TrackBadge track={r.track as TrackId} />}
                {r.tier && <PriorityBadge priority={r.tier as Priority} />}
                {r.executionPriority && (
                  <ExecutionPriorityBadge
                    priority={r.executionPriority as ExecutionPriority}
                  />
                )}
              </div>
              <Link className="mt-1 block font-medium text-[var(--accent)] hover:underline" to={href}>
                {r.title}
              </Link>
              <p className="mt-1 text-xs text-[var(--text-muted)]">…{r.context}…</p>
            </li>
          )
        })}
      </ul>
      {query && results.length === 0 && (
        <p className="text-sm text-[var(--text-faint)]">No matches.</p>
      )}
    </div>
  )
}
