import { createContext, useContext, useEffect, useId, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { getTopicMeta } from '@/content/taxonomy'
import type { CalloutVariant, Inline, MdBlock } from '@/lib/lesson-markdown'
import { useUserStore } from '@/stores/user-store'
import { isDarkTheme } from '@/lib/appearance'
import { CodeBlock } from './CodeBlock'
import { QuizBlock } from '@/components/topic/ContentBlocks'

/** Lets a page make `- [ ]` task items interactive and persistent. */
export const TaskContext = createContext<{ isDone: (text: string) => boolean; toggle: (text: string) => void } | null>(null)

function TaskItem({ text, initial, children }: { text: string; initial: boolean; children: ReactNode }) {
  const ctx = useContext(TaskContext)
  const [local, setLocal] = useState(initial)
  const done = ctx ? ctx.isDone(text) : local
  return (
    <li className="cd-task" data-done={done || undefined}>
      <label className="flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          className="mt-[0.4em] shrink-0 accent-[var(--accent)]"
          checked={done}
          onChange={() => (ctx ? ctx.toggle(text) : setLocal(!local))}
        />
        <span className={done ? 'text-[var(--text-muted)] line-through decoration-[var(--border-strong)]' : ''}>{children}</span>
      </label>
    </li>
  )
}

export function InlineView({ nodes }: { nodes: Inline[] }) {
  return (
    <>
      {nodes.map((n, i) => (
        <InlineNode key={i} node={n} />
      ))}
    </>
  )
}

function InlineNode({ node }: { node: Inline }): ReactNode {
  switch (node.t) {
    case 'text':
      return node.v
    case 'strong':
      return (
        <strong>
          <InlineView nodes={node.c} />
        </strong>
      )
    case 'em':
      return (
        <em>
          <InlineView nodes={node.c} />
        </em>
      )
    case 'code':
      return <code>{node.v}</code>
    case 'br':
      return <br />
    case 'link': {
      const external = /^https?:\/\//.test(node.href)
      if (!external && node.href.startsWith('/')) {
        return (
          <Link to={node.href}>
            <InlineView nodes={node.c} />
          </Link>
        )
      }
      return (
        <a href={node.href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
          <InlineView nodes={node.c} />
        </a>
      )
    }
    case 'topic': {
      const meta = getTopicMeta(node.id)
      const label = node.label ?? meta?.title ?? node.id
      if (!meta) {
        return (
          <span className="cd-topic-missing" title={`Unknown topic: ${node.id}`}>
            {label}
          </span>
        )
      }
      return (
        <Link to={`/topics/${node.id}${node.anchor ? `#${node.anchor}` : ''}`} title={meta.title}>
          {label}
        </Link>
      )
    }
  }
}

const CALLOUT_LABEL: Record<CalloutVariant, string> = {
  note: 'Note',
  tip: 'Tip',
  important: 'Important',
  warning: 'Warning',
  mistake: 'Common mistake',
  interview: 'Interview insight',
}

const CALLOUT_ICON: Record<CalloutVariant, string> = {
  note: 'ℹ',
  tip: '✦',
  important: '!',
  warning: '⚠',
  mistake: '✕',
  interview: '◆',
}

export function LessonBlocks({ blocks }: { blocks: MdBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </>
  )
}

function BlockView({ block }: { block: MdBlock }): ReactNode {
  switch (block.type) {
    case 'heading': {
      const Tag = `h${block.level}` as 'h2' | 'h3' | 'h4'
      return (
        <Tag id={block.id}>
          <InlineView nodes={block.inline} />
          <a className="cd-heading-anchor" href={`#${block.id}`} aria-label={`Link to ${block.text}`}>
            #
          </a>
        </Tag>
      )
    }
    case 'paragraph':
      return (
        <p>
          <InlineView nodes={block.inline} />
        </p>
      )
    case 'list': {
      const items = block.items.map((it, i) =>
        it.task ? (
          <TaskItem key={i} text={it.text ?? ''} initial={it.task === 'done'}>
            <InlineView nodes={it.content} />
          </TaskItem>
        ) : (
        <li key={i}>
          {it.children.length ? (
            <>
              <div>
                <InlineView nodes={it.content} />
              </div>
              <LessonBlocks blocks={it.children} />
            </>
          ) : (
            <InlineView nodes={it.content} />
          )}
        </li>
        ),
      )
      const isTaskList = block.items.every((it) => it.task)
      if (isTaskList) return <ul className="cd-task-list">{items}</ul>
      return block.ordered ? (
        <ol start={block.start !== 1 ? block.start : undefined}>{items}</ol>
      ) : (
        <ul>{items}</ul>
      )
    }
    case 'code':
      return <CodeBlock code={block.code} language={block.language} title={block.title} output={block.output} />
    case 'mermaid':
      return <ThemedMermaid diagram={block.diagram} caption={block.caption} />
    case 'callout':
      return (
        <aside className="cd-callout" data-variant={block.variant} role="note">
          <div className="cd-callout-label">
            <span aria-hidden>{CALLOUT_ICON[block.variant]}</span>
            <span>{CALLOUT_LABEL[block.variant]}</span>
            {block.title && (
              <>
                <span aria-hidden>·</span>
                <span className="cd-callout-title">
                  <InlineView nodes={block.title} />
                </span>
              </>
            )}
          </div>
          <LessonBlocks blocks={block.blocks} />
        </aside>
      )
    case 'quote':
      return (
        <blockquote>
          <LessonBlocks blocks={block.blocks} />
        </blockquote>
      )
    case 'table':
      return (
        <div className="cd-table-wrap">
          <table className="cd-table">
            <thead>
              <tr>
                {block.header.map((h, i) => (
                  <th key={i} style={block.align[i] ? { textAlign: block.align[i]! } : undefined}>
                    <InlineView nodes={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={block.align[ci] ? { textAlign: block.align[ci]! } : undefined}>
                      <InlineView nodes={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'quiz':
      return <QuizBlock title={block.title} questions={block.questions} />
    case 'image':
      return (
        <figure className="cd-figure">
          <img src={block.src} alt={block.alt} loading="lazy" />
          {block.alt && <figcaption>{block.alt}</figcaption>}
        </figure>
      )
    case 'hr':
      return <hr />
  }
}

/** Mermaid diagram that re-renders with the light or dark palette. */
export function ThemedMermaid({ diagram, caption }: { diagram: string; caption?: string }) {
  const id = useId().replace(/:/g, '')
  const theme = useUserStore((s) => s.theme)
  const dark = isDarkTheme(theme)
  const [svg, setSvg] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          theme: dark ? 'dark' : 'neutral',
          securityLevel: 'strict',
          fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
        })
        const { svg: rendered } = await mermaid.render(`mmd-${id}-${dark ? 'd' : 'l'}`, diagram)
        if (!cancelled) {
          setSvg(rendered)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Diagram failed to render')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [diagram, id, dark])

  return (
    <figure className="cd-figure">
      {error && (
        <pre className="text-xs text-[var(--danger)]" role="alert">
          {error}
        </pre>
      )}
      {!error && !svg && <p className="text-sm text-[var(--text-faint)]">Rendering diagram…</p>}
      {svg && <div dangerouslySetInnerHTML={{ __html: svg }} />}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
