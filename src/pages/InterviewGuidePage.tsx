import { useEffect, useId, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ContentBlocks } from '@/components/topic/ContentBlocks'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { ReactInterviewItem, ReactInterviewSection } from '@/content/interview/types'
import { getTopicMeta } from '@/content/taxonomy'

function itemAnchor(sectionId: string, itemId: string) {
  return `${sectionId}--${itemId}`
}

function McqBlock({ item }: { item: ReactInterviewItem }) {
  const mcq = item.mcq
  const groupId = useId()
  const [picked, setPicked] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  if (!mcq) return null

  const isRight = picked === mcq.correctIndex

  return (
    <div className="space-y-3">
      <fieldset className="space-y-2">
        <legend className="sr-only">Choices</legend>
        {mcq.options.map((option, index) => {
          const showMark = revealed && (index === mcq.correctIndex || index === picked)
          return (
            <label
              key={option}
              className={`flex cursor-pointer gap-2 rounded-md border px-3 py-2 text-sm ${
                revealed && index === mcq.correctIndex
                  ? 'border-[var(--success)] bg-green-50 dark:bg-green-950/30'
                  : revealed && index === picked
                    ? 'border-[var(--danger)] bg-red-50 dark:bg-red-950/30'
                    : 'border-[var(--border)] hover:bg-[var(--bg-muted)]'
              }`}
            >
              <input
                type="radio"
                name={groupId}
                className="mt-0.5"
                checked={picked === index}
                onChange={() => {
                  setPicked(index)
                  setRevealed(false)
                }}
              />
              <span>
                {option}
                {showMark && index === mcq.correctIndex ? ' ✓' : ''}
                {showMark && index === picked && !isRight ? ' ✗' : ''}
              </span>
            </label>
          )
        })}
      </fieldset>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="primary"
          disabled={picked === null}
          onClick={() => setRevealed(true)}
        >
          Check answer
        </Button>
        {revealed && (
          <Badge tone={isRight ? 'success' : 'danger'}>
            {isRight ? 'Correct' : 'Not quite'}
          </Badge>
        )}
      </div>
      {revealed && (
        <p className="text-sm text-[var(--text-muted)]">{mcq.explanation}</p>
      )}
    </div>
  )
}

function RelatedTopics({ ids }: { ids?: string[] }) {
  if (!ids?.length) return null
  const topics = ids
    .map((id) => getTopicMeta(id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
  if (topics.length === 0) return null
  return (
    <p className="text-xs text-[var(--text-faint)]">
      Deep notes:{' '}
      {topics.map((t, i) => (
        <span key={t.id}>
          {i > 0 ? ' · ' : ''}
          <Link className="text-[var(--accent)] hover:underline" to={`/topics/${t.id}`}>
            {t.title}
          </Link>
        </span>
      ))}
    </p>
  )
}

function QuestionCard({
  section,
  item,
  index,
}: {
  section: ReactInterviewSection
  item: ReactInterviewItem
  index: number
}) {
  const id = itemAnchor(section.id, item.id)
  return (
    <details
      id={id}
      className="group rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] open:border-[var(--border-strong)]"
    >
      <summary className="cursor-pointer list-none px-4 py-3 marker:content-none [&::-webkit-details-marker]:hidden">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 w-8 shrink-0 font-mono text-xs text-[var(--text-faint)]">
            {index + 1}.
          </span>
          <span className="flex-1 text-sm font-medium text-[var(--text)]">{item.question}</span>
          <span className="shrink-0 text-xs text-[var(--text-faint)] group-open:hidden">Show</span>
          <span className="hidden shrink-0 text-xs text-[var(--text-faint)] group-open:inline">
            Hide
          </span>
        </div>
      </summary>
      <div className="space-y-4 border-t border-[var(--border)] px-4 py-3 pl-[3.25rem]">
        {item.mcq ? <McqBlock item={item} /> : <ContentBlocks blocks={item.answer} />}
        <RelatedTopics ids={item.relatedTopicIds} />
      </div>
    </details>
  )
}

export function InterviewGuidePage({
  crumb,
  title,
  intro,
  sections,
}: {
  crumb: string
  title: string
  intro: string
  sections: ReactInterviewSection[]
}) {
  const location = useLocation()
  const total = sections.reduce((n, s) => n + s.items.length, 0)

  useEffect(() => {
    const hash = location.hash.replace(/^#/, '')
    if (!hash) return
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    const details = document.getElementById(hash)
    if (details instanceof HTMLDetailsElement) details.open = true
  }, [location.hash])

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
      <div className="mb-6">
        <p className="text-xs text-[var(--text-faint)]">
          <Link to="/interview" className="text-[var(--accent)] hover:underline">
            Interview Prep
          </Link>
          <span aria-hidden> / </span>
          {crumb}
        </p>
        <h1 className="mt-1 text-2xl font-semibold">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-[var(--text-muted)]">
          {total} questions. {intro}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <nav
          aria-label="Question sections"
          className="lg:sticky lg:top-4 lg:h-fit lg:w-56 lg:shrink-0"
        >
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)]">
            On this page
          </p>
          <ul className="space-y-3 text-sm">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="font-medium text-[var(--text)] hover:text-[var(--accent)]"
                >
                  {section.title}
                </a>
                <ul className="mt-1 max-h-40 space-y-0.5 overflow-y-auto text-xs text-[var(--text-muted)] lg:max-h-none">
                  {section.items.map((item, i) => (
                    <li key={item.id}>
                      <a
                        href={`#${itemAnchor(section.id, item.id)}`}
                        className="block truncate hover:text-[var(--accent)]"
                      >
                        {i + 1}. {item.question}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 flex-1 space-y-10">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-4">
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <p className="mb-3 text-sm text-[var(--text-muted)]">{section.blurb}</p>
              <div className="space-y-2">
                {section.items.map((item, index) => (
                  <QuestionCard key={item.id} section={section} item={item} index={index} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
