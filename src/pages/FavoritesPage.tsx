import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getProblem } from '@/content/problems'
import { TRACKS } from '@/content/taxonomy'
import { lessonInfo } from '@/content/lessons'
import { resolveTopicMeta } from '@/domain/user-content'
import { getTopicProgress } from '@/domain/progress-selectors'
import { StatusBadge, DsaStatusBadge } from '@/components/ui/Badge'
import { useUserStore } from '@/stores/user-store'
import type { DsaProblem, TopicMeta } from '@/domain/types'

export function FavoritesPage() {
  const bookmarks = useUserStore((s) => s.bookmarks)
  const toggleBookmark = useUserStore((s) => s.toggleBookmark)
  const state = useUserStore()
  const [query, setQuery] = useState('')

  const topics: TopicMeta[] = []
  const problems: DsaProblem[] = []
  const unknown: string[] = []
  for (const id of bookmarks) {
    const t = resolveTopicMeta(state, id)
    const p = getProblem(id)
    if (t) topics.push(t)
    else if (p) problems.push(p)
    else unknown.push(id)
  }
  const q = query.trim().toLowerCase()
  const matches = (s: string) => !q || s.toLowerCase().includes(q)

  const remove = (id: string) => (
    <button
      type="button"
      onClick={() => toggleBookmark(id)}
      className="shrink-0 rounded px-1.5 py-0.5 text-xs text-[var(--text-faint)] hover:bg-[var(--bg-muted)] hover:text-[var(--danger)]"
      aria-label="Remove bookmark"
    >
      Remove
    </button>
  )

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 md:px-6">
      <div>
        <h1 className="text-[1.9rem] font-semibold tracking-tight text-[var(--heading)]">Favorites</h1>
        <p className="mt-1 text-[15px] text-[var(--text-muted)]">
          Lessons and problems you bookmarked, grouped by track. Use the bookmark icon at the top of any
          lesson or problem to add it here.
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--border-strong)] p-6 text-center text-sm text-[var(--text-muted)]">
          No bookmarks yet. Open a lesson and select the bookmark icon next to the view tabs.
        </div>
      ) : (
        <>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Filter ${bookmarks.length} bookmarks…`}
            className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
          />

          {TRACKS.map((track) => {
            const list = topics.filter((t) => t.track === track.id && matches(t.title))
            if (list.length === 0) return null
            return (
              <section key={track.id}>
                <h2 className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-faint)]">
                  <span className="h-2 w-2 rounded-full" style={{ background: track.accent }} aria-hidden />
                  {track.name}
                </h2>
                <ul className="space-y-2">
                  {list.map((t) => {
                    const info = lessonInfo(t.id)
                    return (
                      <li key={t.id} className="flex items-start gap-3 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3">
                        <div className="min-w-0 flex-1">
                          <Link to={`/topics/${t.id}`} className="font-medium text-[var(--heading)] hover:text-[var(--accent)]">
                            {t.title}
                          </Link>
                          <div className="text-xs text-[var(--text-faint)]">
                            {t.sectionId} · {t.sectionTitle}
                            {t.id.startsWith('custom-') ? ' · custom topic' : ''}
                            {info?.minutes ? ` · ~${info.minutes} min` : ''}
                          </div>
                          {info?.summary && !t.parentTopicId && (
                            <p className="mt-1 line-clamp-2 text-[13px] text-[var(--text-muted)]">{info.summary}</p>
                          )}
                        </div>
                        <StatusBadge status={getTopicProgress(state, t.id).status} />
                        {remove(t.id)}
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          })}

          {problems.filter((p) => matches(p.name)).length > 0 && (
            <section>
              <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-faint)]">Problems</h2>
              <ul className="space-y-2">
                {problems
                  .filter((p) => matches(p.name))
                  .map((p) => (
                    <li key={p.id} className="flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2.5">
                      <Link to={`/dsa/${p.id}`} className="min-w-0 flex-1 font-medium text-[var(--heading)] hover:text-[var(--accent)]">
                        {p.name}
                      </Link>
                      <span className="text-xs text-[var(--text-faint)]">{p.source === 'cses' ? 'CSES' : 'NeetCode'}</span>
                      <DsaStatusBadge status={state.problems[p.id]?.status ?? 'not_attempted'} />
                      {remove(p.id)}
                    </li>
                  ))}
              </ul>
            </section>
          )}

          {unknown.length > 0 && (
            <p className="text-xs text-[var(--text-faint)]">
              {unknown.length} bookmark(s) point to items that no longer exist: {unknown.join(', ')}
            </p>
          )}
        </>
      )}
    </div>
  )
}
