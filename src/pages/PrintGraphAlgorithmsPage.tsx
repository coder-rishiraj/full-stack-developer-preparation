import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  GRAPH_ALGORITHMS,
  toMemorizeContent,
} from '@/content/topics/_graph-core-algorithms'
import { CORE_GRAPH_DECISION_RULES } from '@/content/topics/_graph-core-pack'
import { withGraphCppSolutions } from '@/content/topics/_graph-cpp'
import { loadTopicContent } from '@/content/topics'
import {
  GraphAlgorithmReferenceCard,
  type SolutionLanguage,
} from '@/components/topic/GraphAlgorithmReferenceCard'
import { Button } from '@/components/ui/Button'
import { GRAPH_ALGO_PAGE_CSS } from '@/styles/graph-algo-page.css'
import type { TopicContent } from '@/domain/types'

function shortIdea(text: string | undefined, max = 90): string {
  if (!text) return '—'
  const first = text.split(/(?<=\.)\s/)[0] ?? text
  return first.length > max ? first.slice(0, max - 1) + '…' : first
}

/**
 * Full Track A Graphs curriculum topics (algorithmic) — same study layout as core:
 * Problem / Intuition / Steps / Solution (Java+C++) / Complexity, colorful + print-friendly.
 */
export function PrintGraphAlgorithmsPage() {
  const [showJava, setShowJava] = useState(true)
  const [showCpp, setShowCpp] = useState(false)
  const [byId, setById] = useState<Record<string, TopicContent>>({})
  const [loading, setLoading] = useState(true)
  const [loadedCount, setLoadedCount] = useState(0)

  const generatedOn = useMemo(
    () => new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date()),
    [],
  )

  const languages = useMemo((): SolutionLanguage[] => {
    const langs: SolutionLanguage[] = []
    if (showJava) langs.push('java')
    if (showCpp) langs.push('cpp')
    return langs
  }, [showJava, showCpp])

  const showCode = languages.length > 0

  const sectionGroups = useMemo(() => {
    const groups: {
      sectionId: string
      sectionTitle: string
      algos: typeof GRAPH_ALGORITHMS
    }[] = []
    for (const algo of GRAPH_ALGORITHMS) {
      const last = groups[groups.length - 1]
      if (!last || last.sectionId !== algo.sectionId) {
        groups.push({
          sectionId: algo.sectionId,
          sectionTitle: algo.sectionTitle,
          algos: [algo],
        })
      } else {
        last.algos.push(algo)
      }
    }
    return groups
  }, [])

  const cheatSheet = useMemo(() => {
    return GRAPH_ALGORITHMS.map((algo) => {
      const c = byId[algo.topicId]
      return {
        number: algo.number,
        title: algo.title,
        section: algo.sectionId,
        idea: shortIdea(c?.whyExists || c?.whatIsIt),
        time: c?.complexity?.average || c?.complexity?.best || '—',
        space: c?.complexity?.space || '—',
      }
    })
  }, [byId])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const next: Record<string, TopicContent> = {}
      const batchSize = 16
      let done = 0
      for (let i = 0; i < GRAPH_ALGORITHMS.length; i += batchSize) {
        const slice = GRAPH_ALGORITHMS.slice(i, i + batchSize)
        const pairs = await Promise.all(
          slice.map(async (a) => {
            const c = await loadTopicContent(a.topicId)
            return [a.topicId, c] as const
          }),
        )
        if (cancelled) return
        for (const [id, c] of pairs) {
          if (c) next[id] = toMemorizeContent(withGraphCppSolutions(id, c))
        }
        done += slice.length
        setById({ ...next })
        setLoadedCount(done)
      }
      if (!cancelled) setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="ga-page">
      <style>{GRAPH_ALGO_PAGE_CSS}</style>

      <div
        className="print-hidden mx-auto max-w-[1100px] space-y-3 px-5 pb-2 pt-5"
        data-screen-only
      >
        <div className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
          <div>
            <h1 className="text-lg font-semibold">All Graph Algorithm Topics</h1>
            <p className="text-sm text-[var(--text-muted)]">
              {GRAPH_ALGORITHMS.length} curriculum topics in Track A order — real study notes +
              Java/C++ solutions (no factory filler).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/print" className="text-sm text-[var(--accent)] underline">
              Print Center
            </Link>
            <Link to="/print/graph-core" className="text-sm text-[var(--accent)] underline">
              Core 25 only
            </Link>
            <Link to="/print/graphs" className="text-sm text-[var(--accent)] underline">
              Full handbook
            </Link>
            <Button variant="primary" onClick={() => window.print()} disabled={loading}>
              Print / Save as PDF
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={showJava}
              onChange={(e) => setShowJava(e.target.checked)}
            />
            Show solutions (Java)
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={showCpp}
              onChange={(e) => setShowCpp(e.target.checked)}
            />
            Show solutions (C++)
          </label>
        </div>
        <p className="text-xs text-[var(--text-faint)]">
          {loading
            ? `Loading… ${loadedCount}/${GRAPH_ALGORITHMS.length}`
            : `${GRAPH_ALGORITHMS.length} topics · ${generatedOn}`}
        </p>
      </div>

      <div className="ga-shell print-surface">
        <aside className="ga-nav print-hidden" data-screen-only>
          <h2>Topics</h2>
          <ol>
            {sectionGroups.map((g) => (
              <li key={g.sectionId} style={{ listStyle: 'none' }}>
                <span className="sec">
                  {g.sectionId} · {g.sectionTitle}
                </span>
                <ol>
                  {g.algos.map((algo) => (
                    <li key={algo.topicId}>
                      <a href={`#algo-${algo.number}`}>
                        <span className="n">{algo.number}</span>
                        <span>{algo.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
            <li>
              <a href="#algo-summary">
                <span className="n">Σ</span>
                <span>Full cheat sheet</span>
              </a>
            </li>
          </ol>
        </aside>

        <div className="ga-main">
          <header className="ga-cover">
            <p className="kicker">SE Prep · Track A · All topics</p>
            <h1>Graph Algorithms — Full Topic Reference</h1>
            <p>
              Every algorithmic Graphs topic in curriculum order: Problem → Intuition → Steps →
              Solution (Java / C++, syntax-highlighted) → Complexity. Use Core 25 for a tighter
              memorize set.
            </p>
            <div className="ga-cover-meta">
              <span>
                <strong>{GRAPH_ALGORITHMS.length}</strong> topics
              </span>
              <span>
                <strong>{sectionGroups.length}</strong> sections
              </span>
              <span>{generatedOn}</span>
            </div>
          </header>

          {loading && Object.keys(byId).length === 0 ? (
            <p className="ga-loading">Loading algorithm notes…</p>
          ) : (
            sectionGroups.map((g) => (
              <div key={g.sectionId}>
                <div className="ga-section-banner" id={`sec-${g.sectionId.replace('.', '-')}`}>
                  <p className="kicker">
                    {g.sectionId} — {g.sectionTitle}
                  </p>
                </div>
                {g.algos.map((algo) => {
                  const content = byId[algo.topicId]
                  if (!content) {
                    return (
                      <article
                        key={algo.topicId}
                        className="ga-card"
                        id={`algo-${algo.number}`}
                      >
                        <header className="ga-card-header">
                          <span className="ga-number">{algo.number}</span>
                          <h2 className="ga-title">{algo.title}</h2>
                        </header>
                        <p className="ga-prose ga-muted">Loading…</p>
                      </article>
                    )
                  }
                  return (
                    <GraphAlgorithmReferenceCard
                      key={algo.topicId}
                      number={algo.number}
                      title={algo.title}
                      content={content}
                      showCode={showCode}
                      languages={languages}
                    />
                  )
                })}
              </div>
            ))
          )}

          <section className="ga-summary" id="algo-summary">
            <p className="kicker" style={{ marginBottom: 8 }}>
              Appendix
            </p>
            <h2>Summary of All Graph Algorithm Topics</h2>
            <p className="ga-prose ga-muted">
              Cheat sheet for all {GRAPH_ALGORITHMS.length} topics on this page.
            </p>

            <h3>All {GRAPH_ALGORITHMS.length} topics</h3>
            <table className="ga-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Topic</th>
                  <th>Section</th>
                  <th>Main idea</th>
                  <th>Time</th>
                  <th>Space</th>
                </tr>
              </thead>
              <tbody>
                {cheatSheet.map((row) => (
                  <tr key={row.number}>
                    <td>{row.number}</td>
                    <td>{row.title}</td>
                    <td>{row.section}</td>
                    <td>{row.idea}</td>
                    <td>{row.time}</td>
                    <td>{row.space}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Decision rules</h3>
            <ol>
              {CORE_GRAPH_DECISION_RULES.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ol>

            <p className="ga-end">
              End of Graph Algorithms Full Topic Reference · {GRAPH_ALGORITHMS.length} topics ·{' '}
              {generatedOn}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
