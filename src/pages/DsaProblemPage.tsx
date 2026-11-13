import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getProblem } from '@/content/problems'
import { getTopicMeta } from '@/content/taxonomy'
import { practiceGateIndex, type ProblemPage } from '@/content/problem-pages'
import { DsaStatusBadge, PriorityBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { LessonBlocks } from '@/components/lesson/LessonBlocks'
import { TableOfContents, scrollToHeading, useReadingProgress } from '@/components/lesson/LessonRail'
import { useProblemPage } from '@/hooks/useProblemPage'
import type { DsaProblem, DsaStatus } from '@/domain/types'
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
  const location = useLocation()
  const problem = getProblem(problemId ?? '')
  const { page, loading } = useProblemPage(problem?.id)
  const [revealedFor, setRevealedFor] = useState<string | null>(null)
  const setProblemStatus = useUserStore((s) => s.setProblemStatus)
  const setNote = useUserStore((s) => s.setNote)
  const toggleBookmark = useUserStore((s) => s.toggleBookmark)
  const progress = useUserStore((s) => (problemId ? s.problems[problemId] : undefined))
  const note = useUserStore((s) => (problemId ? s.notes[problemId] ?? '' : ''))
  const bookmarked = useUserStore((s) =>
    problemId ? s.bookmarks.includes(problemId) : false,
  )

  // Start each problem at the top, or at the #anchor in the URL once the walkthrough renders.
  useEffect(() => {
    if (loading) return
    const hash = decodeURIComponent(location.hash.slice(1))
    if (hash) {
      requestAnimationFrame(() => scrollToHeading(hash, false))
    } else {
      document.getElementById('main-scroll')?.scrollTo({ top: 0 })
    }
  }, [loading, problemId, location.hash])

  if (!problem) {
    return (
      <div className="p-6">
        <p>Problem not found.</p>
        <Link to="/dsa">Back to explorer</Link>
      </div>
    )
  }

  const topic = getTopicMeta(problem.primaryTopic)

  // Practice mode: everything after the "Practice first" section stays hidden until the
  // reader asks for it. A link to a specific section (#anchor) opens it straight away.
  const gate = page ? practiceGateIndex(page.doc.blocks) : -1
  const revealed = gate === -1 || revealedFor === problem.id || location.hash.length > 1
  const hidden = Boolean(page) && !revealed

  const header = (
    <div>
      <div className="flex flex-wrap gap-2">
        <PriorityBadge priority={problem.priority} />
        <DsaStatusBadge status={progress?.status ?? 'not_attempted'} />
        <span className="text-xs text-[var(--text-faint)]">{problem.source}</span>
      </div>
      <h1 className="mt-2 text-2xl font-semibold">{problem.name}</h1>
      <p className="text-sm text-[var(--text-muted)]">
        #{problem.listOrder}
        {!hidden && (
          <>
            {' '}· {problem.category.replace(/-/g, ' ')} · Pattern: {problem.primaryPattern}
            {problem.secondaryPatterns.length > 0 && ` · ${problem.secondaryPatterns.join(', ')}`}
          </>
        )}
      </p>
    </div>
  )

  const sourceLink = (
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
  )

  const status = (
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
  )

  const notes = (
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
  )

  const history = progress?.attemptHistory && progress.attemptHistory.length > 0 && (
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
  )

  // Full interview walkthrough available
  if (page) {
    const blocks = hidden ? page.doc.blocks.slice(0, gate) : page.doc.blocks
    const shownIds = new Set(blocks.flatMap((b) => (b.type === 'heading' ? [b.id] : [])))
    const outline = page.doc.outline.filter((o) => shownIds.has(o.id))
    return (
      <div className="mx-auto flex max-w-[82rem] gap-12 px-4 py-8 md:px-8">
        <div className="min-w-0 flex-1 space-y-8">
          {header}
          <WalkthroughFacts problem={problem} page={page} hidden={hidden} />
          {status}
          <details className="print-hidden rounded-md border border-[var(--border)] px-3 py-2 xl:hidden" data-screen-only>
            <summary className="cursor-pointer text-sm font-medium text-[var(--text-muted)]">On this page</summary>
            <div className="mt-2">
              <TableOfContents outline={outline} title="" />
            </div>
          </details>
          <article className="cd-article">
            <LessonBlocks blocks={blocks} />
          </article>
          {hidden && (
            <section className="rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-5 py-4" aria-labelledby="practice-gate-title">
              <h2 id="practice-gate-title" className="text-sm font-semibold text-[var(--heading)]">
                The walkthrough is hidden while you practise
              </h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                The approaches, code, pattern name and interview script stay out of sight until you ask for them.
              </p>
              <div className="mt-3">
                <Button size="sm" onClick={() => setRevealedFor(problem.id)}>
                  Show the full walkthrough
                </Button>
              </div>
            </section>
          )}
          {notes}
          {history}
        </div>
        <aside className="print-hidden hidden w-[var(--rail-width)] shrink-0 xl:block" data-screen-only aria-label="Walkthrough navigation">
          <div className="cd-scroll sticky top-8 max-h-[calc(100vh-7rem)] space-y-6 overflow-y-auto pb-8 pr-1">
            <ReadingProgress />
            <TableOfContents outline={outline} title="Interview walkthrough" />
          </div>
        </aside>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 md:px-6">
      {header}
      {sourceLink}
      {status}

      <section className="space-y-2 text-sm">
        <h2 className="font-semibold">Recognition Clues</h2>
        <p className="text-[var(--text-muted)]">
          {loading
            ? 'Loading interview walkthrough…'
            : 'Contiguous segment + constraint or fixed window size → start from the Sliding Window template. See topic notes for pattern depth.'}
        </p>
        {topic && (
          <Link className="text-[var(--accent)] underline" to={`/topics/${topic.id}`}>
            Open topic: {topic.title}
          </Link>
        )}
      </section>

      {notes}
      {history}
    </div>
  )
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-faint)]">{label}</dt>
      <dd className="mt-1 text-sm text-[var(--text)]">{children}</dd>
    </div>
  )
}

/** The page's frontmatter, shown as a compact fact strip above the walkthrough. */
function WalkthroughFacts({ problem, page, hidden }: { problem: DsaProblem; page: ProblemPage; hidden: boolean }) {
  const fm = page.frontmatter
  // Pattern names and lesson titles give the approach away, so they wait for the reveal.
  const lessons = hidden ? [] : fm.relatedLessons.map((id) => getTopicMeta(id)).filter((m) => m !== undefined)
  return (
    <dl className="grid gap-x-8 gap-y-4 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-5 py-4 sm:grid-cols-2 lg:grid-cols-4">
      <Fact label="Difficulty">
        <span className="capitalize">{fm.difficulty ?? problem.difficulty}</span>
      </Fact>
      <Fact label="Interview target">{fm.timeToSolve ? `${fm.timeToSolve} minutes` : '—'}</Fact>
      <Fact label="Patterns">{hidden ? 'Hidden while you practise' : fm.patterns.map((p) => p.replace(/-/g, ' ')).join(', ') || '—'}</Fact>
      <Fact label="Statement">
        <a className="cd-link" href={problem.sourceUrl} target="_blank" rel="noreferrer">
          Open on {problem.source === 'cses' ? 'CSES' : 'LeetCode'}
        </a>
      </Fact>
      {lessons.length > 0 && (
        <div className="sm:col-span-2 lg:col-span-4">
          <Fact label="Related lessons">
            <span className="flex flex-wrap gap-x-4 gap-y-1">
              {lessons.map((m) => (
                <Link key={m.id} className="cd-link" to={`/topics/${m.id}`}>
                  {m.title}
                </Link>
              ))}
            </span>
          </Fact>
        </div>
      )}
      {fm.companies.length > 0 && (
        <div className="sm:col-span-2 lg:col-span-4">
          <Fact label="Asked at">{fm.companies.join(', ')}</Fact>
        </div>
      )}
    </dl>
  )
}

function ReadingProgress() {
  const pct = useReadingProgress()
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-[11px] text-[var(--text-faint)]">
        <span className="font-semibold uppercase tracking-[0.1em]">Progress</span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-[var(--bg-muted)]" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Reading progress">
        <div className="h-full rounded-full bg-[var(--accent)] transition-[width]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
