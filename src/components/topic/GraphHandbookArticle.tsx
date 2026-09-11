import type { ReactNode } from 'react'
import type { ContentBlock, TopicContent, TopicMeta } from '@/domain/types'
import { getProblemsForTopic } from '@/content/problems'

/**
 * Print-oriented article for the Graphs handbook.
 * Matches the Graph Algorithms Reference structure:
 * Problem → Intuition → Steps → Code → Complexity (stacked, A4-friendly).
 */
export function GraphHandbookArticle({
  meta,
  content,
  mode,
  include,
}: {
  meta: TopicMeta
  content: TopicContent
  mode: 'full' | 'quick'
  include: {
    diagrams?: boolean
    code?: boolean
    examples?: boolean
    interview?: boolean
    flashcards?: boolean
    dsaProblems?: boolean
  }
}) {
  const nested = meta.curriculumLevel === 'nested-concept'
  const problems = include.dsaProblems ? getProblemsForTopic(meta.id) : []

  if (mode === 'quick') {
    return (
      <article className="gh-article">
        <header className="gh-article-header">
          <p className="gh-kicker">
            {meta.sectionId} · {meta.priority}
            {nested ? ' · nested' : ''}
          </p>
          <h3 className="gh-title">{nested ? `↳ ${meta.title}` : meta.title}</h3>
        </header>
        <GhBlock label="Quick revision">
          <ol className="gh-steps">
            {content.quickRevision.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </GhBlock>
        {content.keyTakeaways.length > 0 && (
          <GhBlock label="Key takeaways">
            <ul className="gh-bullets">
              {content.keyTakeaways.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </GhBlock>
        )}
      </article>
    )
  }

  const stepLists = (content.howItWorks ?? []).filter(
    (b): b is Extract<ContentBlock, { type: 'list' }> => b.type === 'list',
  )
  const analysisCallouts = (content.howItWorks ?? []).filter(
    (b): b is Extract<ContentBlock, { type: 'callout' }> =>
      b.type === 'callout' && /complexity|analysis|note|tip/i.test(b.title ?? ''),
  )
  const otherCallouts = (content.howItWorks ?? []).filter(
    (b): b is Extract<ContentBlock, { type: 'callout' }> =>
      b.type === 'callout' && !/complexity|analysis/i.test(b.title ?? ''),
  )

  return (
    <article className="gh-article">
      <header className="gh-article-header">
        <p className="gh-kicker">
          {meta.sectionId} · {meta.sectionTitle} · {meta.priority}
          {nested ? ' · nested' : ''}
        </p>
        <h3 className="gh-title">{nested ? `↳ ${meta.title}` : meta.title}</h3>
      </header>

      {content.whatIsIt && (
        <GhBlock label="Problem">
          <p className="gh-prose">{content.whatIsIt}</p>
        </GhBlock>
      )}

      {(content.whyExists || content.mentalModel) && (
        <GhBlock label="Intuition">
          {content.whyExists && <p className="gh-prose">{content.whyExists}</p>}
          {content.mentalModel && (
            <p className="gh-prose gh-prose-secondary">{content.mentalModel}</p>
          )}
        </GhBlock>
      )}

      {stepLists.length > 0 && (
        <GhBlock label="Steps">
          {stepLists.map((list, i) =>
            list.ordered ? (
              <ol key={i} className="gh-steps">
                {list.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={i} className="gh-bullets">
                {list.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ),
          )}
        </GhBlock>
      )}

      {otherCallouts.map((c, i) => (
        <GhBlock key={`callout-${i}`} label={c.title || 'Note'}>
          {looksLikeCode(c.text) ? (
            <pre className="gh-code">
              <code>{formatInlineCode(c.text)}</code>
            </pre>
          ) : (
            <p className="gh-prose">{c.text}</p>
          )}
        </GhBlock>
      ))}

      {include.code && content.templates && content.templates.length > 0 && (
        <GhBlock label="Code (Java)">
          {content.templates.map((t) => (
            <figure key={t.caption ?? t.code.slice(0, 24)} className="gh-code-figure">
              {t.caption && <figcaption className="gh-code-caption">{t.caption}</figcaption>}
              <pre className="gh-code">
                <code>{t.code.trimEnd()}</code>
              </pre>
            </figure>
          ))}
        </GhBlock>
      )}

      {include.code && content.implementation && content.implementation.length > 0 && (
        <GhBlock label="Implementation">
          {content.implementation.map((t) => (
            <figure key={t.caption ?? t.code.slice(0, 24)} className="gh-code-figure">
              {t.caption && <figcaption className="gh-code-caption">{t.caption}</figcaption>}
              <pre className="gh-code">
                <code>{t.code.trimEnd()}</code>
              </pre>
            </figure>
          ))}
        </GhBlock>
      )}

      {content.complexity && (
        <GhBlock label="Complexity">
          <table className="gh-table gh-table-compact">
            <thead>
              <tr>
                <th>Type</th>
                <th>Complexity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Time</td>
                <td>{content.complexity.average || content.complexity.best}</td>
              </tr>
              <tr>
                <td>Space</td>
                <td>{content.complexity.space}</td>
              </tr>
            </tbody>
          </table>
          {analysisCallouts.map((c, i) => (
            <p key={i} className="gh-prose gh-analysis">
              <strong>{c.title || 'Analysis'}: </strong>
              {c.text}
            </p>
          ))}
        </GhBlock>
      )}

      {include.examples && content.example && content.example.length > 0 && (
        <GhBlock label="Example">
          {content.example.map((block, i) => (
            <ExampleBlock key={i} block={block} />
          ))}
        </GhBlock>
      )}

      {content.patternRecognition && content.patternRecognition.length > 0 && (
        <GhBlock label="Pattern recognition">
          <ul className="gh-bullets">
            {content.patternRecognition.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </GhBlock>
      )}

      {content.commonMistakes && content.commonMistakes.length > 0 && (
        <GhBlock label="Common mistakes">
          <ul className="gh-bullets">
            {content.commonMistakes.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </GhBlock>
      )}

      {include.interview && content.interviewQuestions.length > 0 && (
        <GhBlock label="Interview questions">
          <ol className="gh-steps">
            {content.interviewQuestions.map((q) => (
              <li key={q.question}>
                <strong>{q.question}</strong>
                {q.answerHint && <div className="gh-prose-secondary">{q.answerHint}</div>}
              </li>
            ))}
          </ol>
        </GhBlock>
      )}

      {include.flashcards && content.flashcards.length > 0 && (
        <GhBlock label="Flashcards">
          <dl className="gh-flashcards">
            {content.flashcards.map((fc) => (
              <div key={fc.front} className="gh-flashcard">
                <dt>{fc.front}</dt>
                <dd>{fc.back}</dd>
              </div>
            ))}
          </dl>
        </GhBlock>
      )}

      {content.quickRevision.length > 0 && (
        <GhBlock label="Quick revision">
          <ul className="gh-bullets">
            {content.quickRevision.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </GhBlock>
      )}

      {problems.length > 0 && (
        <GhBlock label="Related DSA problems">
          <ul className="gh-bullets">
            {problems.map((p) => (
              <li key={p.id}>
                {p.name}{' '}
                <span className="gh-muted">
                  ({p.source} · {p.difficulty})
                </span>
              </li>
            ))}
          </ul>
        </GhBlock>
      )}
    </article>
  )
}

function GhBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="gh-block">
      <h4 className="gh-label">{label}</h4>
      <div className="gh-block-body">{children}</div>
    </section>
  )
}

function ExampleBlock({ block }: { block: ContentBlock }) {
  if (block.type === 'paragraph') {
    return <p className="gh-prose">{block.text}</p>
  }
  if (block.type === 'table') {
    return (
      <table className="gh-table">
        <thead>
          <tr>
            {block.headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  if (block.type === 'list') {
    return block.ordered ? (
      <ol className="gh-steps">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    ) : (
      <ul className="gh-bullets">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }
  if (block.type === 'code') {
    return (
      <pre className="gh-code">
        <code>{block.code.trimEnd()}</code>
      </pre>
    )
  }
  return null
}

function looksLikeCode(text: string) {
  return (
    /;\s*(for|while|if|return|List|int|void|boolean|class)\b/.test(text) ||
    /[{}]\s*$/.test(text.trim()) ||
    text.includes('new ArrayList') ||
    text.includes('adj.get(')
  )
}

/** Expand common single-line Java snippets into readable multiline form. */
function formatInlineCode(text: string) {
  if (text.includes('\n')) return text
  return text
    .replace(/;\s*/g, ';\n')
    .replace(/\{\s*/g, '{\n  ')
    .replace(/\s*\}/g, '\n}')
    .replace(/\n\s*\n/g, '\n')
    .trim()
}
