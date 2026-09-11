/** Shared print/study styles for Core + All graph algorithm pages. */
export const GRAPH_ALGO_PAGE_CSS = `
.ga-page {
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
  --accent-violet: #7c3aed;
  --accent-line: #0d9488;
  --page-bg: linear-gradient(165deg, #f0f9f8 0%, #fff8f3 42%, #f5f8ff 100%);
  color: var(--ink);
  background: var(--page-bg);
  min-height: 100vh;
  font-family: "Iowan Old Style", Palatino, Georgia, "Times New Roman", serif;
}
.ga-shell {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 28px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 20px 64px;
}
.ga-nav {
  position: sticky;
  top: 16px;
  align-self: start;
  max-height: calc(100vh - 32px);
  overflow: auto;
  padding: 14px;
  border: 1px solid #c5e4df;
  border-radius: 12px;
  background: rgba(255,255,255,.88);
  box-shadow: 0 8px 24px rgba(13, 148, 136, .06);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}
.ga-nav h2 {
  margin: 0 0 10px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--accent-deep);
}
.ga-nav ol { margin: 0; padding: 0; list-style: none; }
.ga-nav a {
  display: grid;
  grid-template-columns: 36px 1fr;
  gap: 8px;
  padding: 7px 4px;
  border-bottom: 1px solid #e4eef0;
  color: var(--ink);
  text-decoration: none;
  font-size: 12px;
  line-height: 1.35;
}
.ga-nav a:hover { color: var(--accent-deep); }
.ga-nav .n { font-weight: 800; color: var(--accent); }
.ga-nav .sec {
  display: block;
  margin: 12px 0 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: #0f766e;
  background: #dcf5f1;
}
.ga-main { min-width: 0; }
.ga-cover {
  padding: 28px 0 32px;
  border-top: 7px solid var(--accent);
  border-bottom: 1px solid var(--line);
  margin-bottom: 28px;
  background:
    radial-gradient(ellipse 60% 80% at 100% 0%, rgba(234, 88, 12, .08), transparent 55%),
    radial-gradient(ellipse 50% 70% at 0% 100%, rgba(13, 148, 136, .1), transparent 50%);
  border-radius: 0 0 16px 16px;
}
.ga-cover .kicker {
  margin: 0 0 10px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--accent-warm);
}
.ga-cover h1 {
  margin: 0;
  font-size: 34px;
  line-height: 1.1;
  letter-spacing: -.02em;
  font-weight: 800;
  color: #0f3d3a;
}
.ga-cover p {
  margin: 14px 0 0;
  max-width: 42rem;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}
.ga-cover-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 22px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 13px;
  color: var(--muted);
}
.ga-cover-meta strong { color: var(--accent-deep); font-size: 18px; }
.ga-section-banner {
  margin: 28px 0 12px;
  padding: 10px 14px;
  border-radius: 10px;
  border-left: 4px solid var(--accent);
  background: linear-gradient(90deg, #dcf5f1, rgba(255,255,255,.55));
}
.ga-section-banner .kicker {
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--accent-deep);
}
.ga-card {
  padding: 22px 0 28px;
  border-bottom: 1px solid var(--line);
}
.ga-card-header {
  display: flex;
  gap: 12px;
  align-items: baseline;
  margin-bottom: 16px;
}
.ga-number {
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 22px;
  font-weight: 800;
  line-height: 1.15;
  color: var(--accent-deep);
  min-width: 1.6ch;
}
.ga-title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -.01em;
  line-height: 1.15;
  color: #12263a;
}
.ga-block { margin: 0 0 16px; }
.ga-label {
  margin: 0 0 6px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .1em;
  text-transform: uppercase;
}
.ga-tone-problem .ga-label { color: #0f766e; }
.ga-tone-intuition .ga-label { color: #c2410c; }
.ga-tone-steps .ga-label { color: #1d4ed8; }
.ga-tone-solution .ga-label { color: #6d28d9; }
.ga-tone-complexity .ga-label { color: #b45309; }
.ga-tone-note .ga-label { color: #475569; }
.ga-tone-problem { border-left: 3px solid #14b8a6; padding-left: 12px; }
.ga-tone-intuition { border-left: 3px solid #fb923c; padding-left: 12px; }
.ga-tone-steps { border-left: 3px solid #60a5fa; padding-left: 12px; }
.ga-tone-solution { border-left: 3px solid #a78bfa; padding-left: 12px; }
.ga-tone-complexity { border-left: 3px solid #fbbf24; padding-left: 12px; }
.ga-tone-note { border-left: 3px solid #94a3b8; padding-left: 12px; }
.ga-prose { margin: 0 0 8px; font-size: 15px; line-height: 1.55; }
.ga-muted { color: var(--muted); font-size: 14px; }
.ga-steps, .ga-bullets {
  margin: 0;
  padding-left: 1.25rem;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 13.5px;
  line-height: 1.5;
}
.ga-steps li, .ga-bullets li { margin: 0 0 6px; }
.ga-steps li::marker { color: var(--accent-blue); font-weight: 700; }
.ga-code-figure { margin: 0 0 12px; }
.ga-code-caption {
  margin: 0 0 6px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 12px;
  font-weight: 650;
  color: #6d28d9;
}
.ga-code {
  margin: 0;
  padding: 14px 16px;
  overflow: auto;
  background: var(--code-bg);
  color: var(--code-fg);
  border: 1px solid #d7dee8;
  border-radius: 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre;
  box-shadow: none;
}
.ga-code code,
.ga-code span {
  background: transparent;
  border: none;
  box-shadow: none;
}
.ga-code code { color: inherit; font: inherit; padding: 0; }
.ga-code.hljs .hljs-keyword,
.ga-code.hljs .hljs-selector-tag,
.ga-code.hljs .hljs-literal,
.ga-code.hljs .hljs-section,
.ga-code.hljs .hljs-link { color: #7c3aed; font-weight: 700; }
.ga-code.hljs .hljs-built_in,
.ga-code.hljs .hljs-type { color: #2563eb; }
.ga-code.hljs .hljs-string,
.ga-code.hljs .hljs-attr,
.ga-code.hljs .hljs-attribute { color: #15803d; }
.ga-code.hljs .hljs-number,
.ga-code.hljs .hljs-symbol,
.ga-code.hljs .hljs-bullet { color: #c2410c; }
.ga-code.hljs .hljs-comment,
.ga-code.hljs .hljs-quote,
.ga-code.hljs .hljs-meta { color: #64748b; font-style: italic; }
.ga-code.hljs .hljs-function .hljs-title,
.ga-code.hljs .hljs-title.function_ { color: #1d4ed8; }
.ga-code.hljs .hljs-title,
.ga-code.hljs .hljs-name { color: #0f766e; }
.ga-code.hljs .hljs-params { color: #334155; }
.ga-code.hljs .hljs-variable,
.ga-code.hljs .hljs-template-variable { color: #b91c1c; }
.ga-code.hljs .hljs-class .hljs-title,
.ga-code.hljs .hljs-title.class_ { color: #a16207; font-weight: 700; }
.ga-code.hljs .hljs-doctag,
.ga-code.hljs .hljs-strong { color: #7c3aed; font-weight: 700; }
.ga-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 13px;
  overflow: hidden;
  border-radius: 8px;
}
.ga-table th, .ga-table td {
  border: 1px solid var(--line);
  padding: 8px 10px;
  text-align: left;
}
.ga-table th {
  background: linear-gradient(180deg, #dcf5f1, #c8ebe6);
  font-weight: 700;
  color: #0f766e;
}
.ga-table tbody tr:nth-child(even) { background: rgba(13, 148, 136, .04); }
.ga-summary {
  margin-top: 36px;
  padding: 28px 18px 8px;
  border-top: 3px solid var(--accent);
  border-radius: 12px;
  background: rgba(255,255,255,.65);
}
.ga-summary h2 {
  margin: 0 0 12px;
  font-size: 26px;
  font-weight: 800;
  color: #0f3d3a;
}
.ga-summary h3 {
  margin: 22px 0 10px;
  font-size: 16px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-weight: 800;
  color: var(--accent-deep);
}
.ga-summary .kicker {
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--accent-warm);
}
.ga-summary ol {
  margin: 0;
  padding-left: 1.2rem;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 13px;
}
.ga-summary li { margin: 0 0 7px; }
.ga-summary li::marker { color: var(--accent); font-weight: 700; }
.ga-end {
  margin-top: 24px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 11px;
  color: var(--muted);
}
.ga-loading {
  padding: 24px 0;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  color: var(--muted);
  font-size: 14px;
}
@media (max-width: 900px) {
  .ga-shell { grid-template-columns: 1fr; }
  .ga-nav { position: static; max-height: none; }
}
@media print {
  .ga-page { background: white !important; }
  .ga-shell { display: block; max-width: none; margin: 0; padding: 0; }
  .ga-nav { display: none !important; }
  .ga-code {
    background: #f7f8fb !important;
    color: #1f2937 !important;
    border: 1px solid #d7dee8 !important;
    box-shadow: none !important;
    overflow: visible !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .ga-code code,
  .ga-code span {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }
  .ga-table th {
    background: #dcf5f1 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .ga-tone-problem, .ga-tone-intuition, .ga-tone-steps,
  .ga-tone-solution, .ga-tone-complexity, .ga-tone-note,
  .ga-section-banner, .ga-cover, .ga-summary {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .ga-card, .ga-block, .ga-table {
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .ga-code-figure,
  .ga-code {
    break-inside: auto !important;
    page-break-inside: auto !important;
  }
}
`
