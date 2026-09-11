import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SECTIONS, TOPICS } from '@/content/taxonomy'
import { loadTopicContent } from '@/content/topics'
import { GRAPH_ALGORITHMS_SUMMARY } from '@/content/topics/_graph-algorithms-summary'
import { GraphHandbookArticle } from '@/components/topic/GraphHandbookArticle'
import { Button } from '@/components/ui/Button'
import type { TopicContent, TopicMeta } from '@/domain/types'

function isGraphSectionId(id: string) {
  return /^A8\.\d+$/.test(id)
}

const HANDBOOK_CSS = `
.graph-handbook {
  --ink: #152033;
  --muted: #5a6578;
  --line: #d8dde6;
  --soft: #f4f6f9;
  --code-bg: #f7f5f0;
  --label: #1f2a3d;
  max-width: 920px;
  margin: 0 auto;
  padding: 28px 36px 64px;
  color: var(--ink);
  background: #fff;
  font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif;
  font-size: 11.5pt;
  line-height: 1.55;
}
.graph-handbook .gh-sans {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
.gh-cover {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px 0 56px;
  border-top: 7px solid var(--ink);
  border-bottom: 1px solid var(--line);
  break-after: page;
  page-break-after: always;
}
.gh-cover-kicker {
  margin: 0 0 18px;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
}
.gh-cover h1 {
  margin: 0;
  max-width: 16ch;
  font-size: 42px;
  line-height: 1.05;
  letter-spacing: -.02em;
}
.gh-cover-sub {
  max-width: 42rem;
  margin: 22px 0 0;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.55;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}
.gh-cover-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 44px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}
.gh-cover-meta strong {
  display: block;
  font-size: 22px;
  font-weight: 700;
}
.gh-cover-meta span {
  color: var(--muted);
  font-size: 10px;
  font-weight: 650;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.gh-toc {
  padding: 8px 0 40px;
  break-after: page;
  page-break-after: always;
}
.gh-toc h2,
.gh-section-title,
.gh-summary h2 {
  margin: 0 0 18px;
  font-size: 26px;
  letter-spacing: -.01em;
}
.gh-toc ol {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--ink);
}
.gh-toc li {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 12px;
  align-items: baseline;
  padding: 11px 0;
  border-bottom: 1px solid var(--line);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 13px;
}
.gh-toc .gh-toc-id {
  font-weight: 700;
  letter-spacing: .02em;
}
.gh-toc .gh-toc-count {
  color: var(--muted);
  font-size: 11px;
}
.gh-section {
  padding-top: 8px;
}
.gh-section + .gh-section {
  break-before: page;
  page-break-before: always;
}
.gh-section-banner {
  margin: 0 0 28px;
  padding-bottom: 14px;
  border-bottom: 2px solid var(--ink);
}
.gh-section-banner .gh-kicker {
  margin: 0 0 6px;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
}
.gh-section-title {
  margin: 0;
}
.gh-article {
  padding: 8px 0 28px;
}
.gh-article + .gh-article {
  margin-top: 18px;
  padding-top: 28px;
  border-top: 1px solid var(--line);
  break-before: page;
  page-break-before: always;
}
.gh-article-header {
  margin-bottom: 18px;
}
.gh-kicker {
  margin: 0 0 6px;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  font-weight: 650;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.gh-title {
  margin: 0;
  font-size: 22px;
  line-height: 1.2;
  letter-spacing: -.015em;
}
.gh-block {
  margin: 0 0 18px;
}
.gh-label {
  margin: 0 0 8px;
  color: var(--label);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.gh-block-body {
  padding-left: 0;
}
.gh-prose {
  margin: 0 0 10px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--ink);
}
.gh-prose-secondary,
.gh-analysis {
  color: var(--muted);
}
.gh-steps,
.gh-bullets {
  margin: 0;
  padding-left: 1.25rem;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 12.5px;
  line-height: 1.55;
}
.gh-steps li,
.gh-bullets li {
  margin: 0 0 7px;
}
.gh-code-figure {
  margin: 0 0 14px;
}
.gh-code-caption {
  margin: 0 0 6px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 11px;
  font-weight: 650;
  color: var(--muted);
}
.gh-code {
  margin: 0;
  padding: 14px 16px;
  overflow: visible;
  border: 1px solid #e2ddd3;
  border-radius: 8px;
  background: var(--code-bg);
  color: #1c2433;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 9.4pt;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;
}
.gh-code code {
  font: inherit;
  background: transparent;
  border: none;
  padding: 0;
  color: inherit;
  white-space: inherit;
}
.gh-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 0 12px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 11.5px;
}
.gh-table th,
.gh-table td {
  border: 1px solid var(--line);
  padding: 8px 10px;
  text-align: left;
  vertical-align: top;
}
.gh-table th {
  background: var(--soft);
  font-weight: 700;
}
.gh-table-compact {
  max-width: 320px;
}
.gh-flashcards {
  margin: 0;
}
.gh-flashcard {
  margin: 0 0 10px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  break-inside: avoid;
  page-break-inside: avoid;
}
.gh-flashcard dt {
  margin: 0 0 4px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 12.5px;
  font-weight: 700;
}
.gh-flashcard dd {
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 12px;
  line-height: 1.5;
  color: var(--muted);
}
.gh-muted {
  color: var(--muted);
}
.gh-summary {
  break-before: page;
  page-break-before: always;
  padding-top: 12px;
}
.gh-summary-intro {
  margin: 0 0 22px;
  max-width: 46rem;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 13px;
}
.gh-summary h3 {
  margin: 28px 0 12px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: .04em;
  text-transform: uppercase;
}
.gh-summary .gh-table {
  font-size: 10.5px;
}
.gh-decision ol {
  margin: 0;
  padding-left: 1.2rem;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 12.5px;
}
.gh-decision li {
  margin: 0 0 8px;
}
.gh-end {
  margin-top: 28px;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 11px;
}
@media print {
  .graph-handbook {
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  .gh-code {
    background: #f7f5f0 !important;
    border-color: #ccc !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .gh-table th {
    background: #eee !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .gh-article,
  .gh-block,
  .gh-code-figure,
  .gh-flashcard,
  .gh-table {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
`

export function PrintGraphsHandbookPage() {
  const sections = useMemo(
    () => SECTIONS.filter((s) => isGraphSectionId(s.id)).sort((a, b) => a.order - b.order),
    [],
  )

  const topics = useMemo(
    () => TOPICS.filter((t) => isGraphSectionId(t.sectionId)),
    [],
  )

  const topicsBySection = useMemo(() => {
    const map = new Map<string, TopicMeta[]>()
    for (const section of sections) map.set(section.id, [])
    for (const topic of topics) {
      map.get(topic.sectionId)?.push(topic)
    }
    return map
  }, [sections, topics])

  const [mode, setMode] = useState<'full' | 'quick'>('full')
  const [code, setCode] = useState(true)
  const [examples, setExamples] = useState(true)
  const [interview, setInterview] = useState(false)
  const [flashcards, setFlashcards] = useState(false)
  const [dsaProblems, setDsaProblems] = useState(false)

  const [byId, setById] = useState<Record<string, TopicContent>>({})
  const [loading, setLoading] = useState(true)
  const [loadedCount, setLoadedCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setLoadedCount(0)

    void (async () => {
      const next: Record<string, TopicContent> = {}
      let done = 0
      const batchSize = 12
      for (let i = 0; i < topics.length; i += batchSize) {
        const slice = topics.slice(i, i + batchSize)
        const pairs = await Promise.all(
          slice.map(async (t) => {
            const c = await loadTopicContent(t.id)
            return [t.id, c] as const
          }),
        )
        if (cancelled) return
        for (const [id, c] of pairs) {
          if (c) next[id] = c
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
  }, [topics])

  const generatedOn = new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date())
  const include = { diagrams: false, code, examples, interview, flashcards, dsaProblems }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div
        className="print-hidden mb-6 space-y-3 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4"
        data-screen-only
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold">Graphs Handbook (A8)</h1>
            <p className="text-sm text-[var(--text-muted)]">
              Reference-style print layout — Problem, Intuition, Steps, Code, Complexity.
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/print" className="text-sm text-[var(--accent)] underline">
              Back
            </Link>
            <Button variant="primary" onClick={() => window.print()} disabled={loading}>
              Print / Save as PDF
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-1">
            Content
            <select
              className="rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1"
              value={mode}
              onChange={(e) => setMode(e.target.value as 'full' | 'quick')}
            >
              <option value="full">Full reference</option>
              <option value="quick">Quick revision only</option>
            </select>
          </label>
          {(
            [
              ['Code', code, setCode],
              ['Examples', examples, setExamples],
              ['Interview Qs', interview, setInterview],
              ['Flashcards', flashcards, setFlashcards],
              ['DSA Problems', dsaProblems, setDsaProblems],
            ] as const
          ).map(([label, value, set]) => (
            <label key={label} className="flex items-center gap-1">
              <input type="checkbox" checked={value} onChange={(e) => set(e.target.checked)} />
              {label}
            </label>
          ))}
        </div>

        <p className="text-xs text-[var(--text-faint)]">
          {loading
            ? `Loading notes… ${loadedCount}/${topics.length}`
            : `Ready · A4 reference layout · ${generatedOn}`}
        </p>
      </div>

      <main className="graph-handbook print-surface">
        <style>{HANDBOOK_CSS}</style>

        <header className="gh-cover">
          <p className="gh-cover-kicker">SE Prep · Track A · DSA</p>
          <h1>Graph Algorithms Handbook</h1>
          <p className="gh-cover-sub">
            A structured reference for graph algorithms: problem, intuition, steps, commented Java
            code, and complexity — designed for A4 study printouts.
          </p>
          <p className="gh-cover-sub" style={{ marginTop: 12 }}>
            Assumptions: 0-indexed vertices, V = number of vertices, adjacency-list representation
            unless noted.
          </p>
          <div className="gh-cover-meta">
            <div>
              <strong>{sections.length}</strong>
              <span>Sections</span>
            </div>
            <div>
              <strong>{topics.length}</strong>
              <span>Topics</span>
            </div>
            <div>
              <strong>{mode === 'full' ? 'Full' : 'Quick'}</strong>
              <span>Mode</span>
            </div>
          </div>
        </header>

        <nav className="gh-toc">
          <h2>Table of contents</h2>
          <ol>
            {sections.map((section) => {
              const count = topicsBySection.get(section.id)?.length ?? 0
              return (
                <li key={section.id}>
                  <span className="gh-toc-id">{section.id}</span>
                  <span>{section.title}</span>
                  <span className="gh-toc-count">{count}</span>
                </li>
              )
            })}
            <li>
              <span className="gh-toc-id">End</span>
              <span>{GRAPH_ALGORITHMS_SUMMARY.title}</span>
              <span className="gh-toc-count">cheat sheet</span>
            </li>
          </ol>
        </nav>

        {sections.map((section) => {
          const sectionTopics = topicsBySection.get(section.id) ?? []
          return (
            <section key={section.id} className="gh-section">
              <div className="gh-section-banner">
                <p className="gh-kicker">Section {section.id}</p>
                <h2 className="gh-section-title">
                  {section.id} — {section.title}
                </h2>
              </div>

              {sectionTopics.map((topic) => {
                const content = byId[topic.id]
                return content ? (
                  <GraphHandbookArticle
                    key={topic.id}
                    meta={topic}
                    content={content}
                    mode={mode}
                    include={include}
                  />
                ) : (
                  <article key={topic.id} className="gh-article">
                    <header className="gh-article-header">
                      <p className="gh-kicker">{topic.sectionId}</p>
                      <h3 className="gh-title">{topic.title}</h3>
                    </header>
                    <p className="gh-prose gh-muted">
                      {loading ? 'Loading deep notes…' : 'Deep notes pending for this topic.'}
                    </p>
                  </article>
                )
              })}
            </section>
          )
        })}

        <section className="gh-summary">
          <h2>{GRAPH_ALGORITHMS_SUMMARY.title}</h2>
          <p className="gh-summary-intro">{GRAPH_ALGORITHMS_SUMMARY.intro}</p>

          <h3>Algorithm cheat sheet</h3>
          <table className="gh-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Topic</th>
                <th>Problem</th>
                <th>Main idea</th>
                <th>Time</th>
                <th>Space</th>
              </tr>
            </thead>
            <tbody>
              {GRAPH_ALGORITHMS_SUMMARY.algorithms.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Shortest path comparison</h3>
          <table className="gh-table">
            <thead>
              <tr>
                <th>Algorithm</th>
                <th>Graph</th>
                <th>Weights</th>
                <th>Neg. cycle</th>
              </tr>
            </thead>
            <tbody>
              {GRAPH_ALGORITHMS_SUMMARY.shortestPath.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <h3>MST comparison</h3>
          <table className="gh-table">
            <thead>
              <tr>
                <th>Algorithm</th>
                <th>Approach</th>
                <th>Time</th>
                <th>Best when</th>
              </tr>
            </thead>
            <tbody>
              {GRAPH_ALGORITHMS_SUMMARY.mst.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <h3>SCC</h3>
          <table className="gh-table">
            <thead>
              <tr>
                <th>Algorithm</th>
                <th>Passes</th>
                <th>Idea</th>
              </tr>
            </thead>
            <tbody>
              {GRAPH_ALGORITHMS_SUMMARY.scc.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="gh-decision">
            <h3>Decision rules</h3>
            <ol>
              {GRAPH_ALGORITHMS_SUMMARY.decisionRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ol>
          </div>

          <p className="gh-end">End of Graph Algorithms Handbook · Track A · SE Prep · {generatedOn}</p>
        </section>
      </main>
    </div>
  )
}
