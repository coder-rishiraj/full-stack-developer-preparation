import { Link, useParams } from 'react-router-dom'
import { getProblem } from '@/content/problems'
import { getTopicMeta } from '@/content/taxonomy'
import { DsaStatusBadge, PriorityBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { DsaStatus } from '@/domain/types'
import { useUserStore } from '@/stores/user-store'

const STATUSES: DsaStatus[] = [
  'attempted',
  'could_not_solve',
  'solved_with_hint',
  'solved_independently',
  'revision_due',
  'mastered',
]

export function DsaProblemPage() {
  const { problemId } = useParams()
  const problem = getProblem(problemId ?? '')
  const setProblemStatus = useUserStore((s) => s.setProblemStatus)
  const setNote = useUserStore((s) => s.setNote)
  const toggleBookmark = useUserStore((s) => s.toggleBookmark)
  const progress = useUserStore((s) => (problemId ? s.problems[problemId] : undefined))
  const note = useUserStore((s) => (problemId ? s.notes[problemId] ?? '' : ''))
  const bookmarked = useUserStore((s) =>
    problemId ? s.bookmarks.includes(problemId) : false,
  )

  if (!problem) {
    return (
      <div className="p-6">
        <p>Problem not found.</p>
        <Link to="/dsa">Back to explorer</Link>
      </div>
    )
  }

  const topic = getTopicMeta(problem.primaryTopic)

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 md:px-6">
      <div>
        <div className="flex flex-wrap gap-2">
          <PriorityBadge priority={problem.priority} />
          <DsaStatusBadge status={progress?.status ?? 'not_attempted'} />
          <span className="text-xs text-[var(--text-faint)]">{problem.source}</span>
        </div>
        <h1 className="mt-2 text-2xl font-semibold">{problem.name}</h1>
        <p className="text-sm text-[var(--text-muted)]">
          #{problem.listOrder} · {problem.category.replace(/-/g, ' ')} · Pattern:{' '}
          {problem.primaryPattern}
          {problem.secondaryPatterns.length > 0 &&
            ` · ${problem.secondaryPatterns.join(', ')}`}
        </p>
      </div>

      <section className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-sm">
        <h2 className="font-semibold">Problem Link</h2>
        <p className="mt-1 text-[var(--text-muted)]">
          Canonical statement lives at the source. Do not rely on copied problem text.
        </p>
        <a
          className="mt-2 inline-block text-[var(--accent)] underline"
          href={problem.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          Open on {problem.source === 'cses' ? 'CSES' : 'LeetCode / NeetCode'}
        </a>
        {!problem.urlVerified && (
          <p className="mt-2 text-xs text-[var(--warning)]">
            URL flagged unverified — confirm against the official problem set before relying on it.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold">Status</h2>
        <div className="print-hidden flex flex-wrap gap-2" data-screen-only>
          {STATUSES.map((s) => (
            <Button key={s} size="sm" onClick={() => setProblemStatus(problem.id, s)}>
              {s.replace(/_/g, ' ')}
            </Button>
          ))}
          <Button size="sm" onClick={() => toggleBookmark(problem.id)}>
            {bookmarked ? 'Unbookmark' : 'Bookmark'}
          </Button>
        </div>
        <p className="mt-2 text-xs text-[var(--text-muted)]">
          Attempts: {progress?.attempts ?? 0}
          {progress?.lastAttempted &&
            ` · Last: ${new Date(progress.lastAttempted).toLocaleString()}`}
        </p>
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="font-semibold">Recognition Clues</h2>
        <p className="text-[var(--text-muted)]">
          Contiguous segment + constraint or fixed window size → start from the Sliding Window
          template. See topic notes for pattern depth.
        </p>
        {topic && (
          <Link className="text-[var(--accent)] underline" to={`/topics/${topic.id}`}>
            Open topic: {topic.title}
          </Link>
        )}
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="font-semibold">My Attempts / Approach Notes</h2>
        <p className="text-xs text-[var(--text-faint)]">
          Brute force, key insight, optimal approach, complexity, edge cases — keep these in My
          Notes (copyright-safe).
        </p>
        <textarea
          className="min-h-40 w-full rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] p-2"
          value={note}
          onChange={(e) => setNote(problem.id, e.target.value)}
          placeholder="Brute force → insight → optimal Java approach → mistakes → pattern takeaway"
        />
      </section>

      {progress?.attemptHistory && progress.attemptHistory.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold">Revision / Attempt History</h2>
          <ul className="space-y-1 text-xs text-[var(--text-muted)]">
            {progress.attemptHistory.map((a, i) => (
              <li key={`${a.at}-${i}`}>
                {new Date(a.at).toLocaleString()} — {a.outcome}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
