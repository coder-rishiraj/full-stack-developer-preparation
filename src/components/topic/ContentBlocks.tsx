import { useState, type ReactNode } from 'react'
import type { ContentBlock } from '@/domain/types'
import { parseInline, slugify } from '@/lib/lesson-markdown'
import { CodeBlock } from '@/components/lesson/CodeBlock'
import { InlineView, ThemedMermaid } from '@/components/lesson/LessonBlocks'

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => (
        <ContentBlockView key={i} block={b} />
      ))}
    </div>
  )
}

/** Renders inline lesson Markdown: **bold**, *italic*, `code`, links and [[topic]] links. */
export function RichText({ text }: { text: string }) {
  return <InlineView nodes={parseInline(text)} />
}

function ContentBlockView({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'heading': {
      const Tag = block.level === 4 ? 'h4' : 'h3'
      return (
        <Tag className="mt-8 scroll-mt-4 font-[family-name:var(--font-ui)] text-[1.15rem] font-semibold leading-snug text-[var(--heading)]">
          <RichText text={block.text} />
        </Tag>
      )
    }
    case 'paragraph':
      return (
        <p className="prose-content text-[var(--text)]">
          <RichText text={block.text} />
        </p>
      )
    case 'list':
      return block.ordered ? (
        <ol className="prose-content list-decimal space-y-2 pl-5">
          {block.items.map((item) => (
            <li key={item}>
              <RichText text={item} />
            </li>
          ))}
        </ol>
      ) : (
        <ul className="prose-content list-disc space-y-2 pl-5">
          {block.items.map((item) => (
            <li key={item}>
              <RichText text={item} />
            </li>
          ))}
        </ul>
      )
    case 'callout':
      return (
        <aside role="note" className="cd-callout print-avoid-break" data-variant={block.variant ?? 'note'}>
          {block.title && (
            <div className="cd-callout-label">
              <span className="cd-callout-title">
                <RichText text={block.title} />
              </span>
            </div>
          )}
          <p className="whitespace-pre-wrap">
            <RichText text={block.text} />
          </p>
        </aside>
      )
    case 'table':
      return (
        <div className="print-avoid-break overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {block.headers.map((h) => (
                  <th
                    key={h}
                    className="border border-[var(--border)] bg-[var(--bg-muted)] px-2 py-1.5 text-left font-semibold"
                  >
                    <RichText text={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="border border-[var(--border)] px-2 py-1.5 align-top">
                      <RichText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'code':
      return (
        <CodeBlock code={block.code} language={block.language} title={block.caption} output={block.output} />
      )
    case 'quiz':
      return <QuizBlock title={block.title} questions={block.questions} />
    case 'mermaid':
      return <ThemedMermaid diagram={block.diagram} caption={block.caption} />
    default:
      return null
  }
}

export function MermaidBlock({ diagram, caption }: { diagram: string; caption?: string }) {
  return <ThemedMermaid diagram={diagram} caption={caption} />
}

export function QuizBlock({
  title,
  questions,
}: {
  title?: string
  questions: { prompt: string; options: string[]; answer: number; explanation: string }[]
}) {
  const [picked, setPicked] = useState<Record<number, number>>({})
  const answered = Object.keys(picked).length

  return (
    <div className="print-avoid-break space-y-4 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-bold text-[var(--text)]">
          {title ?? 'Check your understanding'}
        </h3>
        <p className="text-sm text-[var(--text-muted)]">
          {answered}/{questions.length} answered
        </p>
      </div>
      <ol className="space-y-5">
        {questions.map((q, qi) => {
          const choice = picked[qi]
          const revealed = choice !== undefined
          const correct = revealed && choice === q.answer
          return (
            <li key={q.prompt} className="space-y-2">
              <p className="prose-content font-semibold text-[var(--text)]">
                {qi + 1}. <RichText text={q.prompt} />
              </p>
              <div className="space-y-1.5">
                {q.options.map((opt, oi) => {
                  const selected = choice === oi
                  const isAnswer = oi === q.answer
                  let tone = 'border-[var(--border)] bg-[var(--bg)] hover:border-[var(--border-strong)]'
                  if (revealed && isAnswer) {
                    tone = 'border-[var(--success)] bg-[var(--accent-soft)]'
                  } else if (revealed && selected) {
                    tone = 'border-[var(--danger)] bg-[var(--bg-muted)]'
                  }
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={revealed}
                      onClick={() => setPicked((prev) => ({ ...prev, [qi]: oi }))}
                      className={`block w-full rounded-md border px-3 py-2 text-left text-sm text-[var(--text)] disabled:cursor-default ${tone}`}
                    >
                      <RichText text={opt} />
                    </button>
                  )
                })}
              </div>
              {revealed && (
                <p className="prose-content text-sm text-[var(--text-muted)]">
                  <strong className="font-bold text-[var(--text)]">
                    {correct ? 'Correct.' : 'Not quite.'}
                  </strong>{' '}
                  <RichText text={q.explanation} />
                </p>
              )}
              <p className="hidden text-sm text-[var(--text-muted)] print:block">
                Answer: <RichText text={q.options[q.answer] ?? ''} />
              </p>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export function Section({
  title,
  children,
  id,
}: {
  title: string
  children: ReactNode
  id?: string
}) {
  return (
    <section className="scroll-mt-4 border-t border-[var(--border)] pt-6">
      <h2
        id={id ?? slugify(title)}
        className="mb-3 scroll-mt-5 font-[family-name:var(--font-ui)] text-lg font-semibold tracking-tight text-[var(--heading)]"
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
