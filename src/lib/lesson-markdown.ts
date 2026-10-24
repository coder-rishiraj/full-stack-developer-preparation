/**
 * Lesson Markdown → typed document tree.
 *
 * Lessons are authored as Markdown files (`src/content/lessons/<topic-id>.md`)
 * so prose stays readable for authors and presentation stays in React.
 * The dialect is deliberately small and strict — see docs/LESSON_GUIDE.md.
 *
 *   Frontmatter       --- key: value / key: + "  - item" lists ---
 *   Headings          ## H2, ### H3, #### H4 (H1 is the page title)
 *                     optional explicit anchor: `## HashMap {#a1-hashmap}`
 *   Code              ```java title="Main.java"   (language required)
 *   Output            ```output  — attaches to the code block right above
 *   Diagrams          ```mermaid
 *   Quiz              ```quiz  (Q: / - [ ] / - [x] / > explanation)
 *   Callouts          > [!NOTE] Title   (NOTE TIP IMPORTANT WARNING MISTAKE INTERVIEW)
 *   Tables            GFM pipe tables
 *   Lists             -, *, 1. with nesting by indentation
 *   Inline            **bold** *italic* `code` [text](url) [[topic-id]] [[topic-id|label]]
 */

export type CalloutVariant = 'note' | 'tip' | 'important' | 'warning' | 'mistake' | 'interview'

export const CALLOUT_VARIANTS: CalloutVariant[] = [
  'note',
  'tip',
  'important',
  'warning',
  'mistake',
  'interview',
]

export type Inline =
  | { t: 'text'; v: string }
  | { t: 'strong'; c: Inline[] }
  | { t: 'em'; c: Inline[] }
  | { t: 'code'; v: string }
  | { t: 'link'; href: string; c: Inline[] }
  | { t: 'topic'; id: string; anchor?: string; label?: string }
  | { t: 'br' }

export type ListItem = { content: Inline[]; children: MdBlock[]; /** GFM task item: `- [ ]` / `- [x]`. */ task?: 'open' | 'done'; text?: string }

export type QuizItem = {
  prompt: string
  options: string[]
  answer: number
  explanation: string
}

export type MdBlock =
  | { type: 'heading'; level: 2 | 3 | 4; id: string; text: string; inline: Inline[]; explicitId: boolean }
  | { type: 'paragraph'; inline: Inline[] }
  | { type: 'list'; ordered: boolean; start: number; items: ListItem[] }
  | { type: 'code'; language: string; code: string; title?: string; output?: string }
  | { type: 'mermaid'; diagram: string; caption?: string }
  | { type: 'callout'; variant: CalloutVariant; title?: Inline[]; blocks: MdBlock[] }
  | { type: 'quote'; blocks: MdBlock[] }
  | { type: 'table'; header: Inline[][]; align: ('left' | 'center' | 'right' | null)[]; rows: Inline[][][] }
  | { type: 'quiz'; title?: string; questions: QuizItem[] }
  | { type: 'image'; src: string; alt: string }
  | { type: 'hr' }

export type LessonFrontmatter = {
  title?: string
  summary?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  minutes?: number
  objectives?: string[]
  [key: string]: unknown
}

export type ParsedLesson = {
  frontmatter: LessonFrontmatter
  blocks: MdBlock[]
  /** Flat heading outline for the table of contents. */
  outline: { id: string; level: 2 | 3 | 4; text: string }[]
  /** Problems found while parsing (empty for a valid lesson). */
  issues: string[]
  wordCount: number
}

/* ------------------------------------------------------------------ */
/* Frontmatter                                                         */
/* ------------------------------------------------------------------ */

function unquote(v: string): string {
  const s = v.trim()
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1)
  }
  return s
}

function parseFrontmatter(lines: string[], issues: string[]): { fm: LessonFrontmatter; rest: number } {
  if (lines[0]?.trim() !== '---') return { fm: {}, rest: 0 }
  const fm: Record<string, unknown> = {}
  let i = 1
  let currentListKey: string | null = null
  for (; i < lines.length; i++) {
    const line = lines[i]
    if (line.trim() === '---') {
      i++
      break
    }
    if (!line.trim()) continue
    const item = line.match(/^\s+-\s+(.*)$/)
    if (item && currentListKey) {
      ;(fm[currentListKey] as string[]).push(unquote(item[1]))
      continue
    }
    const kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/)
    if (!kv) {
      issues.push(`frontmatter: cannot parse line "${line}"`)
      continue
    }
    const [, key, raw] = kv
    if (raw === '') {
      fm[key] = []
      currentListKey = key
    } else {
      currentListKey = null
      const v = unquote(raw)
      fm[key] = /^\d+$/.test(v) ? Number(v) : v
    }
  }
  return { fm: fm as LessonFrontmatter, rest: i }
}

/* ------------------------------------------------------------------ */
/* Inline                                                              */
/* ------------------------------------------------------------------ */

export function parseInline(src: string): Inline[] {
  const out: Inline[] = []
  let buf = ''
  const flush = () => {
    if (buf) out.push({ t: 'text', v: buf })
    buf = ''
  }
  let i = 0
  while (i < src.length) {
    const ch = src[i]

    if (ch === '\\' && i + 1 < src.length && /[\\`*_[\]()#|!<>{}-]/.test(src[i + 1])) {
      buf += src[i + 1]
      i += 2
      continue
    }

    if (ch === '`') {
      // Support ``code with ` inside``.
      let ticks = 1
      while (src[i + ticks] === '`') ticks++
      const fence = '`'.repeat(ticks)
      const end = src.indexOf(fence, i + ticks)
      if (end !== -1) {
        flush()
        let code = src.slice(i + ticks, end)
        if (ticks > 1 && code.startsWith(' ') && code.endsWith(' ')) code = code.slice(1, -1)
        out.push({ t: 'code', v: code })
        i = end + ticks
        continue
      }
    }

    if (ch === '[' && src[i + 1] === '[') {
      const end = src.indexOf(']]', i + 2)
      if (end !== -1) {
        const inner = src.slice(i + 2, end)
        const [target, label] = inner.split('|')
        const [id, anchor] = target.trim().split('#')
        if (/^[a-z0-9][a-z0-9-]*$/.test(id)) {
          flush()
          out.push({ t: 'topic', id, anchor: anchor || undefined, label: label?.trim() || undefined })
          i = end + 2
          continue
        }
      }
    }

    if (ch === '[') {
      const close = findClosing(src, i, '[', ']')
      if (close !== -1 && src[close + 1] === '(') {
        const parenEnd = src.indexOf(')', close + 2)
        if (parenEnd !== -1) {
          flush()
          out.push({
            t: 'link',
            href: src.slice(close + 2, parenEnd).trim(),
            c: parseInline(src.slice(i + 1, close)),
          })
          i = parenEnd + 1
          continue
        }
      }
    }

    if (ch === '*' && src[i + 1] === '*') {
      const end = src.indexOf('**', i + 2)
      if (end > i + 2) {
        flush()
        out.push({ t: 'strong', c: parseInline(src.slice(i + 2, end)) })
        i = end + 2
        continue
      }
    }

    if ((ch === '*' || ch === '_') && src[i + 1] !== ch && src[i + 1] !== ' ' && src[i + 1] !== undefined) {
      // Italic only at a word boundary so `a*b*c` and snake_case stay literal.
      const prev = src[i - 1]
      if (prev === undefined || /[\s([{"'—–-]/.test(prev)) {
        let j = i + 1
        while (j < src.length) {
          if (src[j] === ch && src[j - 1] !== ' ' && !/[A-Za-z0-9]/.test(src[j + 1] ?? '')) break
          if (src[j] === '`') {
            const e = src.indexOf('`', j + 1)
            j = e === -1 ? j + 1 : e + 1
            continue
          }
          j++
        }
        if (j < src.length && j > i + 1) {
          flush()
          out.push({ t: 'em', c: parseInline(src.slice(i + 1, j)) })
          i = j + 1
          continue
        }
      }
    }

    if (ch === '<' && src.startsWith('<br>', i)) {
      flush()
      out.push({ t: 'br' })
      i += 4
      continue
    }

    buf += ch
    i++
  }
  flush()
  return out
}

function findClosing(src: string, start: number, open: string, close: string): number {
  let depth = 0
  for (let i = start; i < src.length; i++) {
    if (src[i] === '\\') {
      i++
      continue
    }
    if (src[i] === open) depth++
    else if (src[i] === close) {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}

export function inlineToText(nodes: Inline[]): string {
  return nodes
    .map((n) => {
      switch (n.t) {
        case 'text':
        case 'code':
          return n.v
        case 'strong':
        case 'em':
        case 'link':
          return inlineToText(n.c)
        case 'topic':
          return n.label ?? n.id
        case 'br':
          return ' '
      }
    })
    .join('')
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/* ------------------------------------------------------------------ */
/* Blocks                                                              */
/* ------------------------------------------------------------------ */

const FENCE = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]*)\s*(.*)$/
const HEADING = /^(#{1,6})\s+(.*?)\s*(?:\{#([a-z0-9][a-z0-9-]*)\})?\s*$/
const LIST_ITEM = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/
const TABLE_SEP = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/
const CALLOUT_HEAD = /^\[!(\w+)\]\s*(.*)$/

type Ctx = { issues: string[]; usedIds: Map<string, number> }

function parseBlocks(lines: string[], ctx: Ctx): MdBlock[] {
  const blocks: MdBlock[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (!line.trim()) {
      i++
      continue
    }

    // Fenced code / mermaid / output / quiz
    const fence = line.match(FENCE)
    if (fence) {
      const [, indent, marker, langRaw, rest] = fence
      const lang = langRaw.toLowerCase()
      const body: string[] = []
      i++
      let closed = false
      while (i < lines.length) {
        const l = lines[i]
        if (l.trim().startsWith(marker[0].repeat(marker.length)) && l.trim().replace(/[`~]/g, '') === '') {
          closed = true
          i++
          break
        }
        body.push(indent && l.startsWith(indent) ? l.slice(indent.length) : l)
        i++
      }
      if (!closed) ctx.issues.push(`unclosed code fence (${lang || 'no language'})`)
      const code = body.join('\n')
      const title = rest.match(/title="([^"]*)"/)?.[1]

      if (lang === 'mermaid') {
        blocks.push({ type: 'mermaid', diagram: code, caption: title })
      } else if (lang === 'output') {
        const prev = blocks[blocks.length - 1]
        if (prev?.type === 'code' && prev.output === undefined) prev.output = code
        else blocks.push({ type: 'code', language: 'output', code })
      } else if (lang === 'quiz') {
        blocks.push(parseQuiz(code, title, ctx))
      } else {
        if (!lang) ctx.issues.push('code fence without a language')
        blocks.push({ type: 'code', language: lang || 'text', code, title })
      }
      continue
    }

    // Heading
    const heading = line.match(HEADING)
    if (heading && !line.startsWith(' ')) {
      const hashes = heading[1].length
      const text = heading[2]
      if (hashes === 1) ctx.issues.push(`H1 "${text}" — the page title is the only H1; use ##`)
      if (hashes > 4) ctx.issues.push(`H${hashes} "${text}" — use H2–H4 only`)
      const level = Math.min(4, Math.max(2, hashes)) as 2 | 3 | 4
      const base = heading[3] ?? (slugify(text) || 'section')
      const n = ctx.usedIds.get(base) ?? 0
      ctx.usedIds.set(base, n + 1)
      if (n > 0 && heading[3]) ctx.issues.push(`duplicate anchor {#${base}}`)
      blocks.push({
        type: 'heading',
        level,
        id: n === 0 ? base : `${base}-${n + 1}`,
        text,
        inline: parseInline(text),
        explicitId: Boolean(heading[3]),
      })
      i++
      continue
    }

    // Horizontal rule
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push({ type: 'hr' })
      i++
      continue
    }

    // Blockquote / callout
    if (/^\s*>/.test(line)) {
      const inner: string[] = []
      while (i < lines.length && /^\s*>/.test(lines[i])) {
        inner.push(lines[i].replace(/^\s*>\s?/, ''))
        i++
      }
      const head = inner[0]?.match(CALLOUT_HEAD)
      if (head) {
        const variant = head[1].toLowerCase() as CalloutVariant
        if (!CALLOUT_VARIANTS.includes(variant)) {
          ctx.issues.push(`unknown callout [!${head[1]}] — use ${CALLOUT_VARIANTS.join(', ')}`)
        }
        blocks.push({
          type: 'callout',
          variant: CALLOUT_VARIANTS.includes(variant) ? variant : 'note',
          title: head[2] ? parseInline(head[2]) : undefined,
          blocks: parseBlocks(inner.slice(1), ctx),
        })
      } else {
        blocks.push({ type: 'quote', blocks: parseBlocks(inner, ctx) })
      }
      continue
    }

    // Table
    if (line.includes('|') && i + 1 < lines.length && TABLE_SEP.test(lines[i + 1])) {
      const header = splitRow(line)
      const align = splitRow(lines[i + 1]).map((c) => {
        const l = c.startsWith(':')
        const r = c.endsWith(':')
        return l && r ? 'center' : r ? 'right' : l ? 'left' : null
      }) as ('left' | 'center' | 'right' | null)[]
      i += 2
      const rows: Inline[][][] = []
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
        const cells = splitRow(lines[i])
        if (cells.length !== header.length) {
          ctx.issues.push(`table row has ${cells.length} cells, header has ${header.length}: "${lines[i].slice(0, 60)}"`)
        }
        rows.push(cells.map(parseInline))
        i++
      }
      blocks.push({ type: 'table', header: header.map(parseInline), align, rows })
      continue
    }

    // List
    const li = line.match(LIST_ITEM)
    if (li) {
      const { block, next } = parseList(lines, i, ctx)
      blocks.push(block)
      i = next
      continue
    }

    // Image on its own line
    const img = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (img) {
      blocks.push({ type: 'image', alt: img[1], src: img[2] })
      i++
      continue
    }

    // Paragraph: gather until blank line or another block start.
    const para: string[] = []
    while (i < lines.length) {
      const l = lines[i]
      if (!l.trim()) break
      if (para.length && (FENCE.test(l) || HEADING.test(l) || /^\s*>/.test(l) || LIST_ITEM.test(l))) break
      if (para.length && l.includes('|') && i + 1 < lines.length && TABLE_SEP.test(lines[i + 1])) break
      para.push(l.trim())
      i++
    }
    blocks.push({ type: 'paragraph', inline: parseInline(para.join(' ')) })
  }

  return blocks
}

function splitRow(line: string): string[] {
  let s = line.trim()
  if (s.startsWith('|')) s = s.slice(1)
  if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1)
  const cells: string[] = []
  let buf = ''
  let inCode = false
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c === '\\' && s[i + 1] === '|') {
      buf += '|'
      i++
      continue
    }
    if (c === '`') inCode = !inCode
    if (c === '|' && !inCode) {
      cells.push(buf.trim())
      buf = ''
      continue
    }
    buf += c
  }
  cells.push(buf.trim())
  return cells
}

function indentOf(line: string): number {
  const m = line.match(/^(\s*)/)
  return m ? m[1].replace(/\t/g, '    ').length : 0
}

function parseList(lines: string[], start: number, ctx: Ctx): { block: MdBlock; next: number } {
  const first = lines[start].match(LIST_ITEM)!
  const baseIndent = indentOf(lines[start])
  const ordered = /\d/.test(first[2])
  const items: ListItem[] = []
  let i = start

  while (i < lines.length) {
    const m = lines[i].match(LIST_ITEM)
    if (!m || indentOf(lines[i]) !== baseIndent || /\d/.test(m[2]) !== ordered) break
    const contentIndent = baseIndent + m[2].length + 1
    const textLines: string[] = [m[3]]
    const childLines: string[] = []
    i++
    let sawBlank = false
    while (i < lines.length) {
      const l = lines[i]
      if (!l.trim()) {
        // A blank line ends the item unless the next line is indented under it.
        const nextLine = lines[i + 1]
        if (nextLine !== undefined && nextLine.trim() && indentOf(nextLine) > baseIndent) {
          sawBlank = true
          childLines.push('')
          i++
          continue
        }
        break
      }
      const ind = indentOf(l)
      if (ind <= baseIndent) break
      if (!sawBlank && childLines.length === 0 && !LIST_ITEM.test(l) && !FENCE.test(l)) {
        textLines.push(l.trim())
      } else {
        childLines.push(l.slice(Math.min(ind, contentIndent)))
      }
      i++
    }
    let text = textLines.join(' ')
    const taskMatch = text.match(/^\[( |x|X)\]\s+/)
    const task = taskMatch ? (taskMatch[1] === ' ' ? 'open' : 'done') : undefined
    if (taskMatch) text = text.slice(taskMatch[0].length)
    items.push({
      content: parseInline(text),
      children: childLines.length ? parseBlocks(childLines, ctx) : [],
      ...(task ? { task, text } : {}),
    })
    // Allow a single blank line between sibling items (loose list).
    if (i < lines.length && !lines[i].trim()) {
      const nextLine = lines[i + 1]
      const nm = nextLine?.match(LIST_ITEM)
      if (nm && indentOf(nextLine) === baseIndent && /\d/.test(nm[2]) === ordered) i++
    }
  }

  return {
    block: { type: 'list', ordered, start: ordered ? parseInt(first[2], 10) || 1 : 1, items },
    next: i,
  }
}

function parseQuiz(src: string, title: string | undefined, ctx: Ctx): MdBlock {
  const questions: QuizItem[] = []
  let cur: QuizItem | null = null
  const expl: string[] = []
  const push = () => {
    if (!cur) return
    cur.explanation = expl.join(' ').trim()
    expl.length = 0
    if (cur.options.length < 2) ctx.issues.push(`quiz question "${cur.prompt.slice(0, 40)}" needs 2+ options`)
    if (cur.answer < 0) ctx.issues.push(`quiz question "${cur.prompt.slice(0, 40)}" has no [x] answer`)
    if (!cur.explanation) ctx.issues.push(`quiz question "${cur.prompt.slice(0, 40)}" needs a > explanation`)
    questions.push(cur)
  }
  for (const raw of src.split('\n')) {
    const line = raw.trim()
    if (!line) continue
    const q = line.match(/^Q:\s*(.*)$/)
    if (q) {
      push()
      cur = { prompt: q[1], options: [], answer: -1, explanation: '' }
      continue
    }
    const opt = line.match(/^-\s*\[( |x|X)\]\s*(.*)$/)
    if (opt && cur) {
      if (opt[1].toLowerCase() === 'x') {
        if (cur.answer >= 0) ctx.issues.push(`quiz question "${cur.prompt.slice(0, 40)}" has more than one [x]`)
        cur.answer = cur.options.length
      }
      cur.options.push(opt[2])
      continue
    }
    const ex = line.match(/^>\s?(.*)$/)
    if (ex && cur) {
      expl.push(ex[1])
      continue
    }
    if (cur && cur.options.length === 0) cur.prompt += ' ' + line
    else ctx.issues.push(`quiz: unexpected line "${line.slice(0, 50)}"`)
  }
  push()
  if (questions.length === 0) ctx.issues.push('empty quiz block')
  return { type: 'quiz', title, questions }
}

/* ------------------------------------------------------------------ */
/* Document                                                            */
/* ------------------------------------------------------------------ */

function countWords(blocks: MdBlock[]): number {
  let n = 0
  const words = (s: string) => (s.match(/\S+/g) ?? []).length
  for (const b of blocks) {
    switch (b.type) {
      case 'heading':
        n += words(b.text)
        break
      case 'paragraph':
        n += words(inlineToText(b.inline))
        break
      case 'list':
        for (const it of b.items) n += words(inlineToText(it.content)) + countWords(it.children)
        break
      case 'callout':
      case 'quote':
        n += countWords(b.blocks)
        break
      case 'table':
        for (const r of b.rows) for (const c of r) n += words(inlineToText(c))
        break
      case 'code':
        // Code is read more slowly than prose; count it at a third.
        n += Math.round(words(b.code) / 3)
        break
      default:
        break
    }
  }
  return n
}

export function parseLesson(source: string): ParsedLesson {
  const issues: string[] = []
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  const { fm, rest } = parseFrontmatter(lines, issues)
  const ctx: Ctx = { issues, usedIds: new Map() }
  const blocks = parseBlocks(lines.slice(rest), ctx)

  const outline: ParsedLesson['outline'] = []
  let prevLevel = 1
  for (const b of blocks) {
    if (b.type !== 'heading') continue
    if (b.level > prevLevel + 1) {
      issues.push(`heading "${b.text}" skips from H${prevLevel} to H${b.level}`)
    }
    prevLevel = b.level
    outline.push({ id: b.id, level: b.level, text: inlineToText(b.inline) })
  }

  return { frontmatter: fm, blocks, outline, issues, wordCount: countWords(blocks) }
}

/**
 * Blocks from the heading with `id` up to the next heading of the same or a
 * higher level. Used to show a nested concept's section on its own page.
 */
export function extractSection(blocks: MdBlock[], id: string): MdBlock[] | null {
  const start = blocks.findIndex((b) => b.type === 'heading' && b.id === id)
  if (start === -1) return null
  const head = blocks[start] as Extract<MdBlock, { type: 'heading' }>
  let end = blocks.length
  for (let i = start + 1; i < blocks.length; i++) {
    const b = blocks[i]
    if (b.type === 'heading' && b.level <= head.level) {
      end = i
      break
    }
  }
  return blocks.slice(start, end)
}

/** Every `[[topic-id]]` reference in the document. */
export function collectTopicLinks(blocks: MdBlock[]): string[] {
  const ids: string[] = []
  const walkInline = (nodes: Inline[]) => {
    for (const n of nodes) {
      if (n.t === 'topic') ids.push(n.id)
      else if (n.t === 'strong' || n.t === 'em' || n.t === 'link') walkInline(n.c)
    }
  }
  const walk = (bs: MdBlock[]) => {
    for (const b of bs) {
      switch (b.type) {
        case 'heading':
        case 'paragraph':
          walkInline(b.inline)
          break
        case 'list':
          for (const it of b.items) {
            walkInline(it.content)
            walk(it.children)
          }
          break
        case 'callout':
          if (b.title) walkInline(b.title)
          walk(b.blocks)
          break
        case 'quote':
          walk(b.blocks)
          break
        case 'table':
          b.header.forEach(walkInline)
          b.rows.forEach((r) => r.forEach(walkInline))
          break
        default:
          break
      }
    }
  }
  walk(blocks)
  return ids
}
