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

function ContentBlockView({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <p className="prose-content text-[var(--text)]">{block.text}</p>
    case 'list':
      return block.ordered ? (
        <ol className="prose-content list-decimal space-y-1 pl-5">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul className="prose-content list-disc space-y-1 pl-5">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
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
            <div className="mb-1 font-semibold text-[var(--text)]">{block.title}</div>
          )}
          <p className="whitespace-pre-wrap text-[var(--text-muted)]">{block.text}</p>
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
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="border border-[var(--border)] px-2 py-1.5 align-top">
                      {cell}
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
              {block.caption}
            </figcaption>
          )}
          <pre className="overflow-x-auto rounded-md border border-[var(--border)] bg-[var(--bg-muted)] p-3 text-[12px] leading-relaxed">
            <code>{block.code}</code>
          </pre>
        </figure>
      )
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
