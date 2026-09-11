import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CORE_GRAPH_ALGO_DEFS,
  CORE_GRAPH_CHEAT_SHEET,
  CORE_GRAPH_DECISION_RULES,
  CORE_GRAPH_MST_COMPARE,
  CORE_GRAPH_SCC_COMPARE,
  CORE_GRAPH_SHORTEST_PATH_COMPARE,
  GRAPH_CORE_PACK,
} from '@/content/topics/_graph-core-pack'
import { withGraphCppSolutions } from '@/content/topics/_graph-cpp'
import {
  GraphAlgorithmReferenceCard,
  type SolutionLanguage,
} from '@/components/topic/GraphAlgorithmReferenceCard'
import { Button } from '@/components/ui/Button'
import { toMemorizeContent } from '@/content/topics/_graph-core-algorithms'
import { GRAPH_ALGO_PAGE_CSS } from '@/styles/graph-algo-page.css'

/**
 * Deduped core graph algorithms only — Problem / Intuition / Steps / Solution / Complexity
 * with standard, efficient, commented Java / C++.
 */
export function PrintGraphCorePage() {
  const [showJava, setShowJava] = useState(true)
  const [showCpp, setShowCpp] = useState(false)
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

  const families = useMemo(() => {
    const groups: { family: string; algos: typeof CORE_GRAPH_ALGO_DEFS }[] = []
    for (const algo of CORE_GRAPH_ALGO_DEFS) {
      const last = groups[groups.length - 1]
      if (!last || last.family !== algo.family) {
        groups.push({ family: algo.family, algos: [algo] })
      } else {
        last.algos.push(algo)
      }
    }
    return groups
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
            <h1 className="text-lg font-semibold">Core Graph Algorithms</h1>
            <p className="text-sm text-[var(--text-muted)]">
              {CORE_GRAPH_ALGO_DEFS.length} distinct algorithms — Problem, Intuition, Steps,
              commented Java / C++ solutions, Complexity. No duplicates or problem variants.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/print" className="text-sm text-[var(--accent)] underline">
              Print Center
            </Link>
            <Link to="/print/graph-algorithms" className="text-sm text-[var(--accent)] underline">
              All graph topics
            </Link>
            <Button variant="primary" onClick={() => window.print()}>
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
      </div>

      <div className="ga-shell print-surface">
        <aside className="ga-nav print-hidden" data-screen-only>
          <h2>Core algorithms</h2>
          <ol>
            {families.map((g) => (
              <li key={g.family} style={{ listStyle: 'none' }}>
                <span className="sec">{g.family}</span>
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
                <span>Cheat sheet</span>
              </a>
            </li>
          </ol>
        </aside>

        <div className="ga-main">
          <header className="ga-cover">
            <p className="kicker">SE Prep · Track A · Core only</p>
            <h1>Core Graph Algorithms</h1>
            <p>
              The distinct algorithms you should be able to write from memory. Each entry is
              Problem → Intuition → Steps → Solution (standard efficient Java / C++, commented) →
              Complexity. Assumptions: 0-indexed vertices, adjacency list unless noted.
            </p>
            <div className="ga-cover-meta">
              <span>
                <strong>{CORE_GRAPH_ALGO_DEFS.length}</strong> algorithms
              </span>
              <span>
                <strong>{families.length}</strong> families
              </span>
              <span>{generatedOn}</span>
            </div>
          </header>

          {families.map((g) => (
              <div key={g.family}>
                <div className="ga-section-banner">
                  <p className="kicker">{g.family}</p>
                </div>
                {g.algos.map((algo) => {
                  const raw = GRAPH_CORE_PACK[algo.topicId]
                  if (!raw) {
                    return (
                      <article key={algo.topicId} className="ga-card" id={`algo-${algo.number}`}>
                        <header className="ga-card-header">
                          <span className="ga-number">{algo.number}</span>
                          <h2 className="ga-title">{algo.title}</h2>
                        </header>
                        <p className="ga-prose ga-muted">Core notes missing for this id.</p>
                      </article>
                    )
                  }
                  return (
                    <GraphAlgorithmReferenceCard
                      key={algo.topicId}
                      number={algo.number}
                      title={algo.title}
                      content={toMemorizeContent(withGraphCppSolutions(algo.topicId, raw))}
                      showCode={showCode}
                      languages={languages}
                    />
                  )
                })}
              </div>
            ))}

          <section className="ga-summary" id="algo-summary">
            <p className="kicker" style={{ marginBottom: 8 }}>
              Appendix
            </p>
            <h2>Summary of All Core Graph Algorithms</h2>
            <p className="ga-prose ga-muted">
              Cheat sheet for all {CORE_GRAPH_CHEAT_SHEET.length} core algorithms. Assumptions:
              0-indexed vertices, adjacency list unless noted.
            </p>

            <h3>All {CORE_GRAPH_CHEAT_SHEET.length} algorithms</h3>
            <table className="ga-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Algorithm</th>
                  <th>Family</th>
                  <th>Main idea</th>
                  <th>Time</th>
                  <th>Space</th>
                </tr>
              </thead>
              <tbody>
                {CORE_GRAPH_CHEAT_SHEET.map((row) => (
                  <tr key={row.number}>
                    <td>{row.number}</td>
                    <td>{row.title}</td>
                    <td>{row.family}</td>
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

            <h3>Shortest path comparison</h3>
            <table className="ga-table">
              <thead>
                <tr>
                  <th>Algorithm</th>
                  <th>Graph</th>
                  <th>Weights</th>
                  <th>Neg. cycle</th>
                </tr>
              </thead>
              <tbody>
                {CORE_GRAPH_SHORTEST_PATH_COMPARE.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td key={i}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>MST · SCC</h3>
            <table className="ga-table">
              <thead>
                <tr>
                  <th>Algorithm</th>
                  <th>Approach</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                {CORE_GRAPH_MST_COMPARE.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>
                      {row[2]} · {row[3]}
                    </td>
                  </tr>
                ))}
                {CORE_GRAPH_SCC_COMPARE.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="ga-end">
              End of Core Graph Algorithms · {CORE_GRAPH_ALGO_DEFS.length} algos · {generatedOn}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
