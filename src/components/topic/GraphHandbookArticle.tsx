import type { ReactNode } from 'react'
import type { ContentBlock, TopicContent, TopicMeta } from '@/domain/types'
import { getProblemsForTopic } from '@/content/problems'
import { HighlightedCode } from '@/components/topic/HighlightedCode'
import type { SolutionLanguage } from '@/components/topic/GraphAlgorithmReferenceCard'

function normalizeLang(language: string | undefined): SolutionLanguage {
  const l = (language ?? 'java').toLowerCase()
  if (l === 'cpp' || l === 'c++' || l === 'cplusplus') return 'cpp'
  return 'java'
}

const LANG_LABEL: Record<SolutionLanguage, string> = {
  java: 'Java',
  cpp: 'C++',
}

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
    languages?: SolutionLanguage[]
  }
}) {
  const nested = meta.curriculumLevel === 'nested-concept'
  const problems = include.dsaProblems ? getProblemsForTopic(meta.id) : []
  const languages = include.languages ?? ['java']

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
        <GhBlock label="Quick revision" tone="revision">
          <ol className="gh-steps">
            {content.quickRevision.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </GhBlock>
        {content.keyTakeaways.length > 0 && (
          <GhBlock label="Key takeaways" tone="note">
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
      b.type === 'callout' && /complexity|analysis/i.test(b.title ?? ''),
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
        <GhBlock label="Problem" tone="problem">
          <p className="gh-prose">{content.whatIsIt}</p>
        </GhBlock>
      )}

      {(content.whyExists || content.mentalModel) && (
        <GhBlock label="Intuition" tone="intuition">
          {content.whyExists && <p className="gh-prose">{content.whyExists}</p>}
          {content.mentalModel && content.mentalModel !== content.whyExists && (
            <p className="gh-prose gh-prose-secondary">{content.mentalModel}</p>
          )}
        </GhBlock>
      )}

      {stepLists.length > 0 && (
        <GhBlock label="Steps" tone="steps">
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
        <GhBlock key={`callout-${i}`} label={c.title || 'Note'} tone="note">
          {looksLikeCode(c.text) ? (
            <HighlightedCode
              code={formatInlineCode(c.text)}
              language="java"
              className="gh-code"
            />
          ) : (
            <p className="gh-prose">{c.text}</p>
          )}
        </GhBlock>
      ))}

      {include.code &&
        (content.templates ?? [])
          .filter((t) => languages.includes(normalizeLang(t.language)))
          .map((t) => {
            const lang = normalizeLang(t.language)
            return (
              <GhBlock
                key={`${lang}-${t.caption ?? t.code.slice(0, 24)}`}
                label={`Solution (${LANG_LABEL[lang]})`}
                tone="solution"
              >
                <figure className="gh-code-figure">
                  {t.caption && <figcaption className="gh-code-caption">{t.caption}</figcaption>}
                  <HighlightedCode code={t.code} language={lang} className="gh-code" />
                </figure>
              </GhBlock>
            )
          })}

      {include.code &&
        (content.implementation ?? [])
          .filter((t) => languages.includes(normalizeLang(t.language)))
          .map((t) => {
            const lang = normalizeLang(t.language)
            return (
              <GhBlock
                key={`impl-${lang}-${t.caption ?? t.code.slice(0, 24)}`}
                label={`Implementation (${LANG_LABEL[lang]})`}
                tone="solution"
              >
                <figure className="gh-code-figure">
                  {t.caption && <figcaption className="gh-code-caption">{t.caption}</figcaption>}
                  <HighlightedCode code={t.code} language={lang} className="gh-code" />
                </figure>
              </GhBlock>
            )
          })}

      {content.complexity && (
        <GhBlock label="Complexity" tone="complexity">
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
        <GhBlock label="Example" tone="example">
          {content.example.map((block, i) => (
            <ExampleBlock key={i} block={block} />
          ))}
        </GhBlock>
      )}

      {content.patternRecognition && content.patternRecognition.length > 0 && (
        <GhBlock label="Pattern recognition" tone="patterns">
          <ul className="gh-bullets">
            {content.patternRecognition.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </GhBlock>
      )}

      {content.commonMistakes && content.commonMistakes.length > 0 && (
        <GhBlock label="Common mistakes" tone="mistakes">
          <ul className="gh-bullets">
            {content.commonMistakes.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </GhBlock>
      )}

      {include.interview && content.interviewQuestions.length > 0 && (
        <GhBlock label="Interview questions" tone="interview">
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
        <GhBlock label="Flashcards" tone="flashcards">
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
        <GhBlock label="Quick revision" tone="revision">
          <ul className="gh-bullets">
            {content.quickRevision.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </GhBlock>
      )}

      {problems.length > 0 && (
        <GhBlock label="Related DSA problems" tone="problems">
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

function GhBlock({
  label,
  tone,
  children,
}: {
  label: string
  tone?: string
  children: ReactNode
}) {
  return (
    <section className={`gh-block${tone ? ` gh-tone-${tone}` : ''}`}>
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
      <HighlightedCode
        code={block.code}
        language={normalizeLang(block.language)}
        className="gh-code"
      />
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
