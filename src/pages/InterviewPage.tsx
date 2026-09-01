import { Link } from 'react-router-dom'
import { TOPICS } from '@/content/taxonomy'
import { PROBLEMS } from '@/content/problems'
import { interviewReadiness } from '@/domain/progress-selectors'
import { ProgressBar } from '@/components/ui/Progress'
import { useUserStore } from '@/stores/user-store'

const ROUNDS = [
  {
    id: 'dsa',
    title: 'DSA Round',
    hint: 'Patterns, weak topics, revision problems, timed sets',
    topicFilter: (t: { track: string; sectionId: string; priority: string }) =>
      t.track === 'A' && t.priority === 'tier1',
  },
  {
    id: 'java',
    title: 'Java Round',
    hint: 'Core Java, JVM, concurrency',
    topicFilter: (t: { track: string; sectionId: string }) =>
      t.track === 'C' && ['C1', 'C2', 'C3'].includes(t.sectionId),
  },
  {
    id: 'backend',
    title: 'Backend Round',
    hint: 'Spring, PostgreSQL, Redis, Kafka, reliability, security',
    topicFilter: (t: { track: string; priority: string }) =>
      t.track === 'C' && t.priority === 'tier1',
  },
  {
    id: 'frontend',
    title: 'Frontend Round',
    hint: 'JavaScript, TypeScript, React, browser, FE system design',
    topicFilter: (t: { track: string; priority: string }) =>
      t.track === 'B' && t.priority === 'tier1',
  },
  {
    id: 'lld',
    title: 'LLD Round',
    hint: 'OOD, patterns, LLD problems',
    topicFilter: (t: { track: string; sectionId: string }) =>
      t.track === 'D' && ['D1', 'D2', 'D3'].includes(t.sectionId),
  },
  {
    id: 'hld',
    title: 'HLD Round',
    hint: 'Distributed systems, caching, messaging, system designs',
    topicFilter: (t: { track: string; sectionId: string; priority: string }) =>
      t.track === 'D' && !['D1', 'D2', 'D3'].includes(t.sectionId) && t.priority === 'tier1',
  },
]

export function InterviewPage() {
  const state = useUserStore()
  const readiness = interviewReadiness(state)
  const weak = TOPICS.filter((t) => {
    if (t.priority !== 'tier1') return false
    const p = state.topics[t.id]
    return (
      !p ||
      p.status === 'not_started' ||
      p.status === 'needs_revision' ||
      (p.confidence ?? 1) <= 2
    )
  }).slice(0, 20)
  const revisionProblems = PROBLEMS.filter(
    (p) => state.problems[p.id]?.status === 'revision_due',
  )

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 md:px-6">
      <div>
        <h1 className="text-2xl font-semibold">Interview Prep</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Focused checklists generated from existing progress — not fake readiness scores.
        </p>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--text-faint)]">
          Readiness by area
        </h2>
        <div className="space-y-2">
          {Object.entries(readiness).map(([name, v]) => (
            <ProgressBar key={name} label={`${name} (${v.ready}/${v.total} interview-ready)`} value={v.percent} />
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {ROUNDS.map((r) => {
          const topics = TOPICS.filter((t) => r.topicFilter(t)).slice(0, 8)
          const total = TOPICS.filter((t) => r.topicFilter(t)).length
          return (
            <div key={r.id} className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
              <h3 className="font-semibold">{r.title}</h3>
              <p className="text-xs text-[var(--text-muted)]">{r.hint}</p>
              <p className="mt-1 text-[10px] text-[var(--text-faint)]">
                Showing {topics.length} of {total} matching topics
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {topics.length === 0 ? (
                  <li className="text-[var(--text-faint)]">No matching topics.</li>
                ) : (
                  topics.map((t) => (
                    <li key={t.id}>
                      <Link className="text-[var(--accent)] hover:underline" to={`/topics/${t.id}/revision`}>
                        {t.title}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
              <Link
                className="mt-2 inline-block text-xs text-[var(--accent)] underline"
                to={`/print/preview?sheet=interview&round=${r.id}`}
              >
                Print interview sheet
              </Link>
            </div>
          )
        })}
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Prepare for interview — checklist</h2>
        <div className="rounded-lg border border-[var(--border)] p-3 text-sm">
          <h3 className="font-medium">Weak / unfinished topics</h3>
          <ul className="mt-1 list-disc pl-5">
            {weak.map((t) => (
              <li key={t.id}>
                <Link to={`/topics/${t.id}`} className="text-[var(--accent)] hover:underline">
                  {t.title}
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="mt-3 font-medium">DSA revision due</h3>
          {revisionProblems.length === 0 ? (
            <p className="text-[var(--text-faint)]">None marked revision due.</p>
          ) : (
            <ul className="list-disc pl-5">
              {revisionProblems.map((p) => (
                <li key={p.id}>
                  <Link to={`/dsa/${p.id}`} className="text-[var(--accent)] hover:underline">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
