import { Link } from 'react-router-dom'
import { ContentBlocks, MermaidBlock, Section } from '@/components/topic/ContentBlocks'
import { UserPointsList } from '@/components/topic/ExtraPointsEditor'
import type { TopicContent, TopicMeta, TopicOverlay } from '@/domain/types'
import { getProblemsForTopic } from '@/content/problems'
import { getTopicMeta } from '@/content/taxonomy'

export function TopicBody({
  meta,
  content,
  mode = 'full',
  include,
  overlay,
}: {
  meta: TopicMeta
  content: TopicContent
  mode?: 'full' | 'quick'
  include?: {
    diagrams?: boolean
    code?: boolean
    examples?: boolean
    interview?: boolean
    flashcards?: boolean
    dsaProblems?: boolean
  }
  overlay?: TopicOverlay
}) {
  const opts = {
    diagrams: true,
    code: true,
    examples: true,
    interview: true,
    flashcards: true,
    dsaProblems: true,
    ...include,
  }

  const yours = {
    keyTakeaways: overlay?.keyTakeaways ?? [],
    quickRevision: overlay?.quickRevision ?? [],
    patternRecognition: overlay?.patternRecognition ?? [],
    commonMistakes: overlay?.commonMistakes ?? [],
    failureModes: overlay?.failureModes ?? [],
    variations: overlay?.variations ?? [],
    extraPoints: overlay?.extraPoints ?? [],
  }

  if (mode === 'quick') {
    return (
      <div className="space-y-4">
        <Section title="Quick Revision">
          <ul className="list-disc space-y-1 pl-5 prose-content">
            {content.quickRevision.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <UserPointsList items={yours.quickRevision} />
        </Section>
        {opts.diagrams && content.architecture?.mermaid && (
          <Section title="Diagram">
            <MermaidBlock
              diagram={content.architecture.mermaid}
              caption={content.architecture.caption}
            />
          </Section>
        )}
        {content.complexity && (
          <Section title="Complexity">
            <ComplexityView c={content.complexity} />
          </Section>
        )}
        {content.tradeoffs && (
          <Section title="Trade-offs (short)">
            <ul className="list-disc pl-5 text-sm">
              {content.tradeoffs.whenToUse.map((x) => (
                <li key={x}>Use: {x}</li>
              ))}
              {content.tradeoffs.whenNotToUse.map((x) => (
                <li key={x}>Avoid: {x}</li>
              ))}
            </ul>
          </Section>
        )}
        <Section title="Key Takeaways">
          <ul className="list-disc pl-5">
            {content.keyTakeaways.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
          <UserPointsList items={yours.keyTakeaways} />
        </Section>
        {yours.extraPoints.length > 0 && (
          <Section title="Your additions">
            <UserPointsList items={yours.extraPoints} label="Note" />
          </Section>
        )}
        {opts.interview && (
          <Section title="Interview Questions">
            <ul className="space-y-2">
              {content.interviewQuestions.map((q) => (
                <li key={q.question} className="text-sm">
                  <span className="font-mono text-xs uppercase text-[var(--text-faint)]">
                    {q.level}
                  </span>{' '}
                  {q.question}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    )
  }

  const problems = getProblemsForTopic(meta.id)

  return (
    <div className="space-y-2">
      {content.whatIsIt && (
        <Section title="What Is It?">
          <p className="prose-content">{content.whatIsIt}</p>
        </Section>
      )}
      {content.whyExists && (
        <Section title="Why Does It Exist?">
          <p className="prose-content">{content.whyExists}</p>
        </Section>
      )}
      {content.mentalModel && (
        <Section title="Mental Model">
          <p className="prose-content">{content.mentalModel}</p>
        </Section>
      )}
      {content.howItWorks && (
        <Section title="How It Works">
          <ContentBlocks blocks={content.howItWorks} />
        </Section>
      )}
      {opts.diagrams && content.architecture?.mermaid && (
        <Section title="Architecture / Diagram">
          <MermaidBlock
            diagram={content.architecture.mermaid}
            caption={content.architecture.caption}
          />
        </Section>
      )}
      {opts.examples && content.example && (
        <Section title="Example">
          <ContentBlocks blocks={content.example} />
        </Section>
      )}
      {(content.patternRecognition || yours.patternRecognition.length > 0) && (
        <Section title="Pattern Recognition">
          <ul className="list-disc space-y-1 pl-5 prose-content">
            {(content.patternRecognition ?? []).map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <UserPointsList items={yours.patternRecognition} />
        </Section>
      )}
      {opts.code && content.templates && (
        <Section title="Templates">
          <ContentBlocks
            blocks={content.templates.map((t) => ({
              type: 'code' as const,
              language: t.language,
              code: t.code,
              caption: t.caption,
            }))}
          />
        </Section>
      )}
      {opts.code && content.implementation && (
        <Section title="Implementation">
          <ContentBlocks
            blocks={content.implementation.map((t) => ({
              type: 'code' as const,
              language: t.language,
              code: t.code,
              caption: t.caption,
            }))}
          />
        </Section>
      )}
      {content.internals && (
        <Section title="Internals">
          <ContentBlocks blocks={content.internals} />
        </Section>
      )}
      {(content.commonMistakes || yours.commonMistakes.length > 0) && (
        <Section title="Common Mistakes">
          <ul className="list-disc pl-5">
            {(content.commonMistakes ?? []).map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <UserPointsList items={yours.commonMistakes} />
        </Section>
      )}
      {(content.variations || yours.variations.length > 0) && (
        <Section title="Variations">
          <ul className="list-disc pl-5">
            {(content.variations ?? []).map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <UserPointsList items={yours.variations} />
        </Section>
      )}
      {content.complexity && (
        <Section title="Complexity">
          <ComplexityView c={content.complexity} />
        </Section>
      )}
      {content.tradeoffs && (
        <Section title="Trade-offs">
          <TradeoffsView t={content.tradeoffs} />
        </Section>
      )}
      {(content.failureModes || yours.failureModes.length > 0) && (
        <Section title="Failure Modes">
          <ul className="list-disc pl-5">
            {(content.failureModes ?? []).map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <UserPointsList items={yours.failureModes} />
        </Section>
      )}
      {content.production && (
        <Section title="Production Considerations">
          <ProductionView p={content.production} />
        </Section>
      )}
      {content.systemDesign && <SystemDesignView sd={content.systemDesign} opts={opts} />}
      {opts.interview && content.interview && (
        <Section title="Interview Perspective">
          <InterviewView i={content.interview} />
        </Section>
      )}
      <Section title="Key Takeaways">
        <ul className="list-disc pl-5">
          {content.keyTakeaways.map((k) => (
            <li key={k}>{k}</li>
          ))}
        </ul>
        <UserPointsList items={yours.keyTakeaways} />
      </Section>
      {opts.interview && (
        <Section title="Interview Questions">
          <ul className="space-y-3">
            {content.interviewQuestions.map((q) => (
              <li key={q.question}>
                <div className="text-xs font-semibold uppercase text-[var(--text-faint)]">
                  {q.level}
                </div>
                <div className="font-medium">{q.question}</div>
                {q.answerHint && (
                  <div className="text-sm text-[var(--text-muted)]">{q.answerHint}</div>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}
      {opts.flashcards && content.flashcards.length > 0 && (
        <Section title="Flashcards">
          <div className="grid gap-2 sm:grid-cols-2">
            {content.flashcards.map((fc) => (
              <div
                key={fc.front}
                className="print-avoid-break rounded-md border border-[var(--border)] p-3 text-sm"
              >
                <div className="font-semibold">{fc.front}</div>
                <div className="mt-1 text-[var(--text-muted)]">{fc.back}</div>
              </div>
            ))}
          </div>
        </Section>
      )}
      {yours.extraPoints.length > 0 && (
        <Section title="Your additions">
          <UserPointsList items={yours.extraPoints} label="Note" />
        </Section>
      )}
      <Section title="Quick Revision">
        <ul className="list-disc space-y-1 pl-5 prose-content">
          {content.quickRevision.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <UserPointsList items={yours.quickRevision} />
      </Section>
      {opts.dsaProblems && problems.length > 0 && (
        <Section title="Related DSA Problems">
          <ul className="space-y-1 text-sm">
            {problems.map((p) => (
              <li key={p.id}>
                <Link className="text-[var(--accent)] hover:underline" to={`/dsa/${p.id}`}>
                  {p.name}
                </Link>{' '}
                <span className="text-[var(--text-faint)]">
                  ({p.source} · {p.difficulty})
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}
      <Section title="Related Topics">
        <RelatedLinks meta={meta} />
      </Section>
    </div>
  )
}

function ComplexityView({
  c,
}: {
  c: NonNullable<TopicContent['complexity']>
}) {
  return (
    <dl className="grid gap-2 text-sm sm:grid-cols-2">
      {c.best && (
        <>
          <dt className="text-[var(--text-faint)]">Best</dt>
          <dd>{c.best}</dd>
        </>
      )}
      {c.average && (
        <>
          <dt className="text-[var(--text-faint)]">Average</dt>
          <dd>{c.average}</dd>
        </>
      )}
      {c.worst && (
        <>
          <dt className="text-[var(--text-faint)]">Worst</dt>
          <dd>{c.worst}</dd>
        </>
      )}
      {c.space && (
        <>
          <dt className="text-[var(--text-faint)]">Space</dt>
          <dd>{c.space}</dd>
        </>
      )}
      {c.notes && (
        <>
          <dt className="text-[var(--text-faint)]">Notes</dt>
          <dd>{c.notes}</dd>
        </>
      )}
    </dl>
  )
}

function TradeoffsView({ t }: { t: NonNullable<TopicContent['tradeoffs']> }) {
  const groups = [
    ['Advantages', t.advantages],
    ['Disadvantages', t.disadvantages],
    ['Alternatives', t.alternatives],
    ['When to use', t.whenToUse],
    ['When not to use', t.whenNotToUse],
  ] as const
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {groups.map(([title, items]) => (
        <div key={title}>
          <h3 className="mb-1 text-sm font-semibold">{title}</h3>
          <ul className="list-disc pl-5 text-sm">
            {items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function ProductionView({ p }: { p: NonNullable<TopicContent['production']> }) {
  return (
    <div className="space-y-3 text-sm">
      {Object.entries(p).map(([k, items]) =>
        items ? (
          <div key={k}>
            <h3 className="font-semibold capitalize">{k}</h3>
            <ul className="list-disc pl-5">
              {items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ) : null,
      )}
    </div>
  )
}

function InterviewView({ i }: { i: NonNullable<TopicContent['interview']> }) {
  const groups = [
    ['Expectations', i.expectations],
    ['Common questions', i.commonQuestions],
    ['Follow-ups', i.followUps],
    ['Misconceptions', i.misconceptions],
    ['Traps', i.traps],
    ['Strong-answer signals', i.strongSignals],
  ] as const
  return (
    <div className="space-y-3 text-sm">
      {groups.map(([title, items]) => (
        <div key={title}>
          <h3 className="font-semibold">{title}</h3>
          <ul className="list-disc pl-5">
            {items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function SystemDesignView({
  sd,
  opts,
}: {
  sd: NonNullable<TopicContent['systemDesign']>
  opts: { diagrams: boolean; code: boolean; examples: boolean }
}) {
  return (
    <>
      <Section title="1. Problem">
        <p className="prose-content">{sd.problem}</p>
      </Section>
      <Section title="2. Requirements">
        <h3 className="text-sm font-semibold">Functional</h3>
        <ul className="mb-2 list-disc pl-5 text-sm">
          {sd.requirements.functional.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <h3 className="text-sm font-semibold">Non-functional</h3>
        <ul className="list-disc pl-5 text-sm">
          {sd.requirements.nonFunctional.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Section>
      <Section title="3. Scale Assumptions">
        <ul className="list-disc pl-5 text-sm">
          {sd.scaleAssumptions.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Section>
      <Section title="4. Capacity Estimates">
        <ul className="list-disc pl-5 text-sm">
          {sd.capacityEstimates.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Section>
      {opts.code && (
        <Section title="5. API">
          <ContentBlocks blocks={sd.api} />
        </Section>
      )}
      <Section title="6. Data Model">
        <ContentBlocks blocks={sd.dataModel} />
      </Section>
      <Section title="7. High-level Architecture">
        <ContentBlocks blocks={sd.highLevelArchitecture} />
      </Section>
      {opts.diagrams && sd.diagram && (
        <Section title="8. Diagram">
          <MermaidBlock diagram={sd.diagram.mermaid} caption={sd.diagram.caption} />
        </Section>
      )}
      <Section title="9. Data Flow">
        <ol className="list-decimal pl-5 text-sm">
          {sd.dataFlow.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
      </Section>
      {[
        ['10. Storage', sd.storage],
        ['11. Caching', sd.caching],
        ['12. Async Processing', sd.asyncProcessing],
        ['13. Scaling', sd.scaling],
        ['14. Consistency', sd.consistency],
        ['15. Reliability', sd.reliability],
        ['16. Failure Scenarios', sd.failureScenarios],
        ['17. Security', sd.security],
        ['18. Observability', sd.observability],
        ['19. Bottlenecks', sd.bottlenecks],
        ['20. Alternatives', sd.alternatives],
        ['21. Trade-offs', sd.tradeoffs],
        ['22. Interview Follow-ups', sd.interviewFollowUps],
      ].map(([title, items]) => (
        <Section key={title as string} title={title as string}>
          <ul className="list-disc pl-5 text-sm">
            {(items as string[]).map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </Section>
      ))}
      <Section title="Architecture Evolution">
        <ol className="space-y-3">
          {sd.evolution.map((e) => (
            <li key={e.stage} className="rounded-md border border-[var(--border)] p-3 text-sm">
              <div className="font-semibold">{e.stage}</div>
              <p>{e.description}</p>
              {e.bottleneck && (
                <p className="mt-1 text-[var(--warning)]">Bottleneck: {e.bottleneck}</p>
              )}
            </li>
          ))}
        </ol>
      </Section>
    </>
  )
}

function RelatedLinks({ meta }: { meta: TopicMeta }) {
  const groups = [
    ['Prerequisites', meta.prerequisites],
    ['Related', meta.relatedTopics],
    ['What to learn next', meta.nextTopics],
  ] as const
  return (
    <div className="space-y-2 text-sm">
      {groups.map(([title, ids]) => (
        <div key={title}>
          <h3 className="font-semibold">{title}</h3>
          {ids.length === 0 ? (
            <p className="text-[var(--text-faint)]">None mapped to this topic yet.</p>
          ) : (
            <ul className="list-disc pl-5">
              {ids.map((id) => {
                const t = getTopicMeta(id)
                return (
                  <li key={id}>
                    {t ? (
                      <Link className="text-[var(--accent)] hover:underline" to={`/topics/${id}`}>
                        {t.title}
                      </Link>
                    ) : (
                      id
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
