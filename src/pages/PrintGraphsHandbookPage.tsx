import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SECTIONS, TOPICS } from '@/content/taxonomy'
import { loadTopicContent } from '@/content/topics'
import { GRAPH_ALGORITHMS_SUMMARY } from '@/content/topics/_graph-algorithms-summary'
import { withGraphCppSolutions } from '@/content/topics/_graph-cpp'
import { GraphHandbookArticle } from '@/components/topic/GraphHandbookArticle'
import { Button } from '@/components/ui/Button'
import type { TopicContent, TopicMeta } from '@/domain/types'
import type { SolutionLanguage } from '@/components/topic/GraphAlgorithmReferenceCard'

function isGraphSectionId(id: string) {
  return /^A8\.\d+$/.test(id)
}

const HANDBOOK_CSS = `
.graph-handbook {
  --ink: #12263a;
  --muted: #5a6b7d;
  --line: #d5e0ea;
  --soft: #eef6f8;
  --code-bg: #f7f8fb;
  --code-fg: #1f2937;
  --accent: #0d9488;
  --accent-deep: #0f766e;
  --accent-warm: #ea580c;
  --accent-blue: #2563eb;
  --label: #0f766e;
  max-width: 920px;
  margin: 0 auto;
  padding: 28px 36px 64px;
  color: var(--ink);
  background:
    radial-gradient(ellipse 55% 40% at 100% 0%, rgba(234, 88, 12, .07), transparent 55%),
    radial-gradient(ellipse 50% 45% at 0% 20%, rgba(13, 148, 136, .08), transparent 50%),
    linear-gradient(180deg, #f7fbfa 0%, #ffffff 28%, #fffaf6 100%);
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
  border-top: 7px solid var(--accent);
  border-bottom: 1px solid var(--line);
  border-radius: 0 0 18px 18px;
  background:
    radial-gradient(ellipse 60% 80% at 100% 0%, rgba(234, 88, 12, .1), transparent 55%),
    radial-gradient(ellipse 50% 70% at 0% 100%, rgba(13, 148, 136, .12), transparent 50%);
  break-after: page;
  page-break-after: always;
}
.gh-cover-kicker {
  margin: 0 0 18px;
  color: var(--accent-warm);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .16em;
  text-transform: uppercase;
}
.gh-cover h1 {
  margin: 0;
  max-width: 16ch;
  font-size: 42px;
  line-height: 1.05;
  letter-spacing: -.02em;
  font-weight: 800;
  color: #0f3d3a;
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
  font-weight: 800;
  color: var(--accent-deep);
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
  font-weight: 800;
  color: #0f3d3a;
}
.gh-toc ol {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 2px solid var(--accent);
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
.gh-toc li:nth-child(even) {
  background: rgba(13, 148, 136, .04);
}
.gh-toc .gh-toc-id {
  font-weight: 800;
  letter-spacing: .02em;
  color: var(--accent-deep);
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
  padding: 12px 14px;
  border-radius: 10px;
  border-left: 4px solid var(--accent);
  background: linear-gradient(90deg, #dcf5f1, rgba(255,255,255,.55));
}
.gh-section-banner .gh-kicker {
  margin: 0 0 6px;
  color: var(--accent-deep);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .14em;
  text-transform: uppercase;
}
.gh-section-title {
  margin: 0;
  font-weight: 800;
  color: #0f3d3a;
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
  color: var(--accent-warm);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.gh-title {
  margin: 0;
  font-size: 22px;
  line-height: 1.2;
  letter-spacing: -.015em;
  font-weight: 800;
  color: #12263a;
}
.gh-block {
  margin: 0 0 18px;
}
.gh-label {
  margin: 0 0 8px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.gh-tone-problem .gh-label { color: #0f766e; }
.gh-tone-intuition .gh-label { color: #c2410c; }
.gh-tone-steps .gh-label { color: #1d4ed8; }
.gh-tone-solution .gh-label { color: #6d28d9; }
.gh-tone-complexity .gh-label { color: #b45309; }
.gh-tone-note .gh-label,
.gh-tone-example .gh-label,
.gh-tone-patterns .gh-label,
.gh-tone-mistakes .gh-label,
.gh-tone-interview .gh-label,
.gh-tone-flashcards .gh-label,
.gh-tone-revision .gh-label,
.gh-tone-problems .gh-label { color: #475569; }
.gh-tone-problem { border-left: 3px solid #14b8a6; padding-left: 12px; }
.gh-tone-intuition { border-left: 3px solid #fb923c; padding-left: 12px; }
.gh-tone-steps { border-left: 3px solid #60a5fa; padding-left: 12px; }
.gh-tone-solution { border-left: 3px solid #a78bfa; padding-left: 12px; }
.gh-tone-complexity { border-left: 3px solid #fbbf24; padding-left: 12px; }
.gh-tone-note,
.gh-tone-example,
.gh-tone-patterns,
.gh-tone-mistakes,
.gh-tone-interview,
.gh-tone-flashcards,
.gh-tone-revision,
.gh-tone-problems { border-left: 3px solid #94a3b8; padding-left: 12px; }
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
.gh-steps li::marker {
  color: var(--accent-blue);
  font-weight: 700;
}
.gh-code-figure {
  margin: 0 0 14px;
}
.gh-code-caption {
  margin: 0 0 6px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 11px;
  font-weight: 650;
  color: #6d28d9;
}
.gh-code {
  margin: 0;
  padding: 14px 16px;
  overflow: visible;
  border: 1px solid #d7dee8;
  border-radius: 10px;
  background: var(--code-bg);
  color: var(--code-fg);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 9.4pt;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  box-shadow: none;
}
.gh-code code,
.gh-code span {
  font: inherit;
  background: transparent;
  border: none;
  padding: 0;
  color: inherit;
  white-space: inherit;
  box-shadow: none;
}
/* Light syntax highlighting (print-friendly) */
.gh-code.hljs .hljs-keyword,
.gh-code.hljs .hljs-selector-tag,
.gh-code.hljs .hljs-literal,
.gh-code.hljs .hljs-section,
.gh-code.hljs .hljs-link { color: #7c3aed; font-weight: 700; }
.gh-code.hljs .hljs-built_in,
.gh-code.hljs .hljs-type { color: #2563eb; }
.gh-code.hljs .hljs-string,
.gh-code.hljs .hljs-attr,
.gh-code.hljs .hljs-attribute { color: #15803d; }
.gh-code.hljs .hljs-number,
.gh-code.hljs .hljs-symbol,
.gh-code.hljs .hljs-bullet { color: #c2410c; }
.gh-code.hljs .hljs-comment,
.gh-code.hljs .hljs-quote,
.gh-code.hljs .hljs-meta { color: #64748b; font-style: italic; }
.gh-code.hljs .hljs-function .hljs-title,
.gh-code.hljs .hljs-title.function_ { color: #1d4ed8; }
.gh-code.hljs .hljs-title,
.gh-code.hljs .hljs-name { color: #0f766e; }
.gh-code.hljs .hljs-params { color: #334155; }
.gh-code.hljs .hljs-variable,
.gh-code.hljs .hljs-template-variable { color: #b91c1c; }
.gh-code.hljs .hljs-class .hljs-title,
.gh-code.hljs .hljs-title.class_ { color: #a16207; font-weight: 700; }
.gh-code.hljs .hljs-doctag,
.gh-code.hljs .hljs-strong { color: #7c3aed; font-weight: 700; }
.gh-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 0 12px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 11.5px;
  overflow: hidden;
  border-radius: 8px;
}
.gh-table th,
.gh-table td {
  border: 1px solid var(--line);
  padding: 8px 10px;
  text-align: left;
  vertical-align: top;
}
.gh-table th {
  background: linear-gradient(180deg, #dcf5f1, #c8ebe6);
  font-weight: 700;
  color: #0f766e;
}
.gh-table tbody tr:nth-child(even) {
  background: rgba(13, 148, 136, .04);
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
  border: 1px solid #c5e4df;
  border-radius: 8px;
  background: rgba(255,255,255,.9);
  break-inside: avoid;
  page-break-inside: avoid;
}
.gh-flashcard dt {
  margin: 0 0 4px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--accent-deep);
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
  padding: 18px 16px 8px;
  border-radius: 12px;
  border-top: 3px solid var(--accent);
  background: rgba(255,255,255,.7);
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
  color: var(--accent-deep);
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
.gh-decision li::marker {
  color: var(--accent);
  font-weight: 700;
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
    background: white !important;
  }
  .gh-code {
    background: #f7f8fb !important;
    color: #1f2937 !important;
    border-color: #d7dee8 !important;
    box-shadow: none !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .gh-code code,
  .gh-code span {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }
  .gh-table th {
    background: #dcf5f1 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .gh-section-banner,
  .gh-cover,
  .gh-summary,
  .gh-tone-problem,
  .gh-tone-intuition,
  .gh-tone-steps,
  .gh-tone-solution,
  .gh-tone-complexity {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .gh-article,
  .gh-block,
  .gh-flashcard,
  .gh-table {
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .gh-code-figure,
  .gh-code {
    break-inside: auto !important;
    page-break-inside: auto !important;
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
  const [showJava, setShowJava] = useState(true)
  const [showCpp, setShowCpp] = useState(false)
  const [examples, setExamples] = useState(true)
  const [interview, setInterview] = useState(false)
  const [flashcards, setFlashcards] = useState(false)
  const [dsaProblems, setDsaProblems] = useState(false)

  const [byId, setById] = useState<Record<string, TopicContent>>({})
  const [loading, setLoading] = useState(true)
  const [loadedCount, setLoadedCount] = useState(0)

  const languages = useMemo((): SolutionLanguage[] => {
    const langs: SolutionLanguage[] = []
    if (showJava) langs.push('java')
    if (showCpp) langs.push('cpp')
    return langs
  }, [showJava, showCpp])

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
          if (c) next[id] = withGraphCppSolutions(id, c)
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
  const include = {
    diagrams: false,
    code: languages.length > 0,
    examples,
    interview,
    flashcards,
    dsaProblems,
    languages,
  }

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
              Colorful A4 reference — Problem, Intuition, Steps, Java/C++ solutions, Complexity.
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
          {(
            [
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
            A structured reference for graph algorithms: problem, intuition, steps, Java / C++
            solutions, and complexity — designed for A4 study printouts.
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
