import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TOPICS } from '@/content/taxonomy'
import { parseLesson, type MdBlock, type ParsedLesson } from '@/lib/lesson-markdown'
import { LessonBlocks, TaskContext } from '@/components/lesson/LessonBlocks'
import { TableOfContents } from '@/components/lesson/LessonRail'
import { ProgressBar } from '@/components/ui/Progress'
import { useUserStore } from '@/stores/user-store'

const PROJECT = 'ticket-booking'
const guides = import.meta.glob<string>('../content/capstone/*.md', { query: '?raw', import: 'default' })
const CAPSTONE_TOPICS = TOPICS.filter((t) => t.usedInCapstone)
const AI_CAPSTONES = TOPICS.filter((t) => t.track === 'E' && t.curriculumLevel === 'classified-item' && /capstone|project/i.test(t.sectionTitle))

type Milestone = { id: string; title: string; tasks: string[] }

/** Each `## Milestone N — Title {#mN}` section with the task items inside it. */
function milestonesOf(blocks: MdBlock[]): Milestone[] {
  const out: Milestone[] = []
  let current: Milestone | null = null
  const collect = (bs: MdBlock[]) => {
    for (const b of bs) {
      if (b.type === 'list') {
        for (const it of b.items) {
          if (it.task && current) current.tasks.push(it.text ?? '')
          collect(it.children)
        }
      } else if (b.type === 'callout' || b.type === 'quote') collect(b.blocks)
    }
  }
  for (const b of blocks) {
    if (b.type === 'heading' && b.level === 2) {
      current = /^m\d+$/.test(b.id) ? { id: b.id, title: b.text.replace(/\s*\{#.*\}$/, ''), tasks: [] } : null
      if (current) out.push(current)
      continue
    }
    collect([b])
  }
  return out
}

export function CapstonePage() {
  const [guide, setGuide] = useState<ParsedLesson | null | undefined>(undefined)
  const done = useUserStore((s) => s.capstoneTasks)
  const toggle = useUserStore((s) => s.toggleCapstoneTask)

  useEffect(() => {
    const loader = guides[`../content/capstone/${PROJECT}.md`]
    if (!loader) {
      setGuide(null)
      return
    }
    void loader().then((src) => setGuide(parseLesson(src)))
  }, [])

  const milestones = useMemo(() => (guide ? milestonesOf(guide.blocks) : []), [guide])
  const key = (text: string) => `${PROJECT}:${text}`
  const totalTasks = milestones.reduce((n, m) => n + m.tasks.length, 0)
  const doneTasks = milestones.reduce((n, m) => n + m.tasks.filter((t) => done[key(t)]).length, 0)
  const taskCtx = useMemo(() => ({ isDone: (t: string) => Boolean(done[key(t)]), toggle: (t: string) => toggle(key(t)) }), [done, toggle])

  return (
    <div className="mx-auto flex max-w-[82rem] gap-12 px-4 py-8 md:px-8">
      <div className="min-w-0 flex-1 space-y-8">
        <header className="space-y-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--text-faint)]">Capstone project</p>
          <h1 className="text-[1.9rem] font-semibold leading-tight tracking-tight text-[var(--heading)]">Ticket Booking &amp; Flash Sale</h1>
          <p className="max-w-[var(--measure)] text-[15px] leading-relaxed text-[var(--text-muted)]">
            {guide?.frontmatter.summary ??
              'One realistic system, built in stages, that pulls the whole curriculum together: React and TypeScript, Java and Spring Boot, PostgreSQL, Redis, Kafka, Docker and AWS.'}
          </p>
          {totalTasks > 0 && (
            <div className="max-w-md">
              <ProgressBar label={`${doneTasks} of ${totalTasks} tasks complete`} value={Math.round((doneTasks / totalTasks) * 100)} />
            </div>
          )}
        </header>

        {milestones.length > 0 && (
          <section aria-labelledby="milestones-title" className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
            <h2 id="milestones-title" className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-faint)]">
              Milestones
            </h2>
            <ol className="grid gap-2 md:grid-cols-2">
              {milestones.map((m) => {
                const d = m.tasks.filter((t) => done[key(t)]).length
                const complete = m.tasks.length > 0 && d === m.tasks.length
                return (
                  <li key={m.id}>
                    <a href={`#${m.id}`} className="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-[var(--bg-muted)]">
                      <span
                        className="grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] font-semibold"
                        style={{
                          borderColor: complete ? 'var(--accent)' : 'var(--border-strong)',
                          background: complete ? 'var(--accent)' : 'transparent',
                          color: complete ? 'var(--accent-contrast)' : 'var(--text-muted)',
                        }}
                      >
                        {complete ? '✓' : m.id.slice(1)}
                      </span>
                      <span className="min-w-0 flex-1 text-sm text-[var(--heading)]">{m.title.replace(/^Milestone \d+\s*[—-]\s*/, '')}</span>
                      <span className="text-xs tabular-nums text-[var(--text-faint)]">
                        {d}/{m.tasks.length}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ol>
          </section>
        )}

        {guide === undefined && <p className="text-sm text-[var(--text-muted)]">Loading the project guide…</p>}

        {guide && (
          <TaskContext.Provider value={taskCtx}>
            <article className="cd-article">
              <LessonBlocks blocks={guide.blocks} />
            </article>
          </TaskContext.Provider>
        )}

        {guide === null && (
          <p className="rounded-md border border-dashed border-[var(--border-strong)] p-4 text-sm text-[var(--text-muted)]">
            The step-by-step project guide is being written. The curriculum topics it uses are listed below.
          </p>
        )}

        <section className="space-y-3 border-t border-[var(--border)] pt-8">
          <h2 className="text-lg font-semibold text-[var(--heading)]">Curriculum used in this project</h2>
          {CAPSTONE_TOPICS.length === 0 ? (
            <p className="text-sm text-[var(--text-faint)]">No linked topics yet.</p>
          ) : (
            <ul className="grid gap-2 md:grid-cols-2">
              {CAPSTONE_TOPICS.map((t) => (
                <li key={t.id} className="rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-sm">
                  <Link className="font-medium text-[var(--heading)] hover:text-[var(--accent)]" to={`/topics/${t.id}`}>
                    {t.title}
                  </Link>
                  <p className="mt-1 text-[var(--text-muted)]">{t.usedInCapstone}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {AI_CAPSTONES.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[var(--heading)]">Applied AI capstones</h2>
            <p className="text-sm text-[var(--text-muted)]">
              Track E ends with its own projects, taught as lessons with architecture and staged implementation.
            </p>
            <ul className="grid gap-2 md:grid-cols-2">
              {AI_CAPSTONES.map((t) => (
                <li key={t.id}>
                  <Link className="block rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-sm font-medium text-[var(--heading)] hover:border-[var(--border-strong)]" to={`/topics/${t.id}`}>
                    {t.title}
                    <span className="block text-xs font-normal text-[var(--text-faint)]">{t.sectionTitle}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      {guide && (
        <aside className="print-hidden hidden w-[var(--rail-width)] shrink-0 xl:block" data-screen-only>
          <div className="cd-scroll sticky top-8 max-h-[calc(100vh-7rem)] overflow-y-auto pb-8">
            <TableOfContents outline={guide.outline.filter((o) => o.level === 2)} title="Project guide" />
          </div>
        </aside>
      )}
    </div>
  )
}
