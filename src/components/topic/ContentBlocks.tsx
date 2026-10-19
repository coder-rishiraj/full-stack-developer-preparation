import { useEffect, useId, useState, type ReactNode } from 'react'
import type { ContentBlock } from '@/domain/types'

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => (
        <ContentBlockView key={i} block={b} />
      ))}
    </div>
  )
}

/** Renders **bold** markers. A single * inside a phrase, such as a * b, stays literal. */
export function RichText({ text }: { text: string }) {
  const parts: { bold: boolean; text: string }[] = []
  let i = 0
  let buf = ''
  while (i < text.length) {
    if (text.startsWith('**', i)) {
      const end = text.indexOf('**', i + 2)
      if (end !== -1) {
        if (buf) parts.push({ bold: false, text: buf })
        buf = ''
        parts.push({ bold: true, text: text.slice(i + 2, end) })
        i = end + 2
        continue
      }
    }
    buf += text[i]
    i++
  }
  if (buf) parts.push({ bold: false, text: buf })
  return (
    <>
      {parts.map((part, index) =>
        part.bold ? (
          <strong key={index} className="font-bold text-[var(--text)]">
            {part.text}
          </strong>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </>
  )
}

function ContentBlockView({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'heading':
      return (
        <h3 className="prose-content mt-8 scroll-mt-4 border-b border-[var(--border)] pb-1 text-[1.2rem] font-bold leading-snug text-[var(--text)]">
          <RichText text={block.text} />
        </h3>
      )
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
        <div
          role="note"
          className="print-avoid-break rounded-md border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2 text-sm"
        >
          {block.title && (
            <div className="mb-1 font-semibold text-[var(--text)]">
              <RichText text={block.title} />
            </div>
          )}
          <p className="whitespace-pre-wrap text-[var(--text-muted)]">
            <RichText text={block.text} />
          </p>
        </div>
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
        <figure className="print-avoid-break">
          {block.caption && (
            <figcaption className="mb-1 text-xs font-medium text-[var(--text-muted)]">
              <RichText text={block.caption} />
            </figcaption>
          )}
          <pre className="overflow-x-auto rounded-md border border-[var(--border)] bg-[var(--bg-muted)] p-3 text-[12px] leading-relaxed">
            <code>{block.code}</code>
          </pre>
        </figure>
      )
    case 'quiz':
      return <QuizBlock title={block.title} questions={block.questions} />
    case 'mermaid':
      return <MermaidBlock diagram={block.diagram} caption={block.caption} />
    default:
      return null
  }
}

export function MermaidBlock({
  diagram,
  caption,
}: {
  diagram: string
  caption?: string
}) {
  const id = useId().replace(/:/g, '')
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          securityLevel: 'strict',
        })
        const { svg: rendered } = await mermaid.render(`mmd-${id}`, diagram)
        if (!cancelled) setSvg(rendered)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Diagram failed')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [diagram, id])

  return (
    <figure className="print-avoid-break mermaid rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
      {caption && (
        <figcaption className="mb-2 text-xs font-medium text-[var(--text-muted)]">
          {caption}
        </figcaption>
      )}
      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
      {!error && !svg && (
        <p className="text-sm text-[var(--text-faint)]">Rendering diagram…</p>
      )}
      {svg && <div dangerouslySetInnerHTML={{ __html: svg }} />}
    </figure>
  )
}

function QuizBlock({
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
    <section id={id} className="scroll-mt-4 border-t border-[var(--border)] pt-6">
      <h2 className="mb-3 font-[family-name:var(--font-ui)] text-lg font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  )
}
