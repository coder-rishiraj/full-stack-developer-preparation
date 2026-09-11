import type { ReactNode } from 'react'
import type { ContentBlock, TopicContent } from '@/domain/types'
import { HighlightedCode } from '@/components/topic/HighlightedCode'

export type SolutionLanguage = 'java' | 'cpp'

function normalizeLang(language: string | undefined): SolutionLanguage {
  const l = (language ?? 'java').toLowerCase()
  if (l === 'cpp' || l === 'c++' || l === 'cplusplus') return 'cpp'
  return 'java'
}

const LANG_LABEL: Record<SolutionLanguage, string> = {
  java: 'Java',
  cpp: 'C++',
}

const BLOCK_TONE: Record<string, string> = {
  Problem: 'problem',
  Intuition: 'intuition',
  Steps: 'steps',
  Complexity: 'complexity',
  Note: 'note',
  Notes: 'note',
}

/**
 * Lean reference card: Problem → Intuition → Steps → Solution → Complexity.
 * Solutions can be filtered by language (Java / C++).
 */
export function GraphAlgorithmReferenceCard({
  number,
  title,
  content,
  showCode = true,
  languages = ['java'],
}: {
  number: string
  title: string
  content: TopicContent
  showCode?: boolean
  languages?: SolutionLanguage[]
}) {
  const stepLists = (content.howItWorks ?? []).filter(
    (b): b is Extract<ContentBlock, { type: 'list' }> => b.type === 'list',
  )
  const analysisCallouts = (content.howItWorks ?? []).filter(
    (b): b is Extract<ContentBlock, { type: 'callout' }> =>
      b.type === 'callout' && /complexity|analysis/i.test(b.title ?? ''),
  )
  const noteCallouts = (content.howItWorks ?? []).filter(
    (b): b is Extract<ContentBlock, { type: 'callout' }> =>
      b.type === 'callout' &&
      /^notes?$/i.test(b.title ?? '') &&
      !/complexity|analysis/i.test(b.title ?? ''),
  )

  const templates = (content.templates ?? []).filter((t) =>
    languages.includes(normalizeLang(t.language)),
  )

  return (
    <article className="ga-card" id={`algo-${number.replace('.', '-')}`}>
      <header className="ga-card-header">
        <span className="ga-number">{number}</span>
        <h2 className="ga-title">{title}</h2>
      </header>

      {content.whatIsIt && (
        <GaBlock label="Problem" tone="problem">
          <p className="ga-prose">{content.whatIsIt}</p>
        </GaBlock>
      )}

      {(content.whyExists || content.mentalModel) && (
        <GaBlock label="Intuition" tone="intuition">
          {content.whyExists && <p className="ga-prose">{content.whyExists}</p>}
          {content.mentalModel && content.mentalModel !== content.whyExists && (
            <p className="ga-prose ga-muted">{content.mentalModel}</p>
          )}
        </GaBlock>
      )}

      {stepLists.length > 0 && (
        <GaBlock label="Steps" tone="steps">
          {stepLists.map((list, i) =>
            list.ordered ? (
              <ol key={i} className="ga-steps">
                {list.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={i} className="ga-bullets">
                {list.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ),
          )}
        </GaBlock>
      )}

      {showCode &&
        templates.map((t) => {
          const lang = normalizeLang(t.language)
          return (
            <GaBlock
              key={`${lang}-${t.caption ?? t.code.slice(0, 24)}`}
              label={`Solution (${LANG_LABEL[lang]})`}
              tone="solution"
            >
              <figure className="ga-code-figure">
                {t.caption && <figcaption className="ga-code-caption">{t.caption}</figcaption>}
                <HighlightedCode code={t.code} language={lang} />
              </figure>
            </GaBlock>
          )
        })}

      {content.complexity && (
        <GaBlock label="Complexity" tone="complexity">
          <table className="ga-table">
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
            <p key={i} className="ga-prose ga-muted">
              <strong>Analysis: </strong>
              {c.text}
            </p>
          ))}
        </GaBlock>
      )}

      {noteCallouts.map((c, i) => (
        <GaBlock key={i} label={c.title || 'Note'} tone={BLOCK_TONE[c.title || 'Note'] ?? 'note'}>
          <p className="ga-prose">{c.text}</p>
        </GaBlock>
      ))}
    </article>
  )
}

function GaBlock({
  label,
  tone,
  children,
}: {
  label: string
  tone?: string
  children: ReactNode
}) {
  return (
    <section className={`ga-block${tone ? ` ga-tone-${tone}` : ''}`}>
      <h3 className="ga-label">{label}</h3>
      <div>{children}</div>
    </section>
  )
}
