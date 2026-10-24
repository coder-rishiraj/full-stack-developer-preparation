import { useMemo, useState } from 'react'
import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import cpp from 'highlight.js/lib/languages/cpp'
import css from 'highlight.js/lib/languages/css'
import diff from 'highlight.js/lib/languages/diff'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import go from 'highlight.js/lib/languages/go'
import graphql from 'highlight.js/lib/languages/graphql'
import http from 'highlight.js/lib/languages/http'
import ini from 'highlight.js/lib/languages/ini'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import kotlin from 'highlight.js/lib/languages/kotlin'
import plaintext from 'highlight.js/lib/languages/plaintext'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'

const LANGS = {
  bash,
  cpp,
  css,
  diff,
  dockerfile,
  go,
  graphql,
  http,
  ini,
  java,
  javascript,
  json,
  kotlin,
  plaintext,
  python,
  sql,
  typescript,
  xml,
  yaml,
}
for (const [name, def] of Object.entries(LANGS)) {
  if (!hljs.getLanguage(name)) hljs.registerLanguage(name, def)
}

const ALIASES: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  html: 'xml',
  svg: 'xml',
  vue: 'xml',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  console: 'bash',
  yml: 'yaml',
  py: 'python',
  'c++': 'cpp',
  c: 'cpp',
  properties: 'ini',
  toml: 'ini',
  text: 'plaintext',
  txt: 'plaintext',
  output: 'plaintext',
  scss: 'css',
  docker: 'dockerfile',
  kt: 'kotlin',
  gql: 'graphql',
  psql: 'sql',
  postgresql: 'sql',
}

/** Human label for the code bar. */
const LABELS: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  tsx: 'TSX',
  jsx: 'JSX',
  java: 'Java',
  python: 'Python',
  sql: 'SQL',
  bash: 'Shell',
  json: 'JSON',
  yaml: 'YAML',
  xml: 'HTML',
  html: 'HTML',
  css: 'CSS',
  cpp: 'C++',
  go: 'Go',
  http: 'HTTP',
  dockerfile: 'Dockerfile',
  plaintext: 'Text',
  output: 'Output',
  kotlin: 'Kotlin',
  graphql: 'GraphQL',
  ini: 'Config',
  properties: 'Properties',
  diff: 'Diff',
}

function escapeHtml(s: string) {
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

export function highlight(code: string, language: string): string {
  const lang = ALIASES[language] ?? language
  if (!hljs.getLanguage(lang) || lang === 'plaintext') return escapeHtml(code)
  try {
    return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
  } catch {
    return escapeHtml(code)
  }
}

export function CodeBlock({
  code,
  language,
  title,
  output,
}: {
  code: string
  language: string
  title?: string
  output?: string
}) {
  const trimmed = code.replace(/\s+$/, '')
  const html = useMemo(() => highlight(trimmed, language), [trimmed, language])
  const [copied, setCopied] = useState(false)
  const label = LABELS[language] ?? LABELS[ALIASES[language] ?? ''] ?? language

  async function copy() {
    try {
      await navigator.clipboard.writeText(trimmed)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard blocked — the text is still selectable */
    }
  }

  return (
    <figure className="cd-code not-prose">
      <div className="cd-code-bar">
        <span className="cd-code-lang">{label}</span>
        {title && <span className="cd-code-title">{title}</span>}
        <button type="button" className="cd-code-copy" onClick={copy} aria-label="Copy code">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre tabIndex={0}>
        <code className={`hljs language-${language}`} dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
      {output !== undefined && (
        <div className="cd-code-output">
          <div className="cd-code-output-label">Output</div>
          <pre tabIndex={0}>
            <code>{output.replace(/\s+$/, '')}</code>
          </pre>
        </div>
      )}
    </figure>
  )
}
