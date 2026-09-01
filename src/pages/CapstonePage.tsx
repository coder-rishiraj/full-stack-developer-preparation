import { Link } from 'react-router-dom'
import { TOPICS } from '@/content/taxonomy'

const EVOLUTION = [
  'Simple Monolith',
  'Modular Monolith',
  'Identify Bottlenecks',
  'Caching',
  'Async Processing',
  'Horizontal Scaling',
  'Selective Service Separation',
]

const CAPSTONE_TOPICS = TOPICS.filter((t) => t.usedInCapstone)

export function CapstonePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 md:px-6">
      <div>
        <h1 className="text-2xl font-semibold">Capstone — Ticket Booking / Flash Sale</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Recurring practical system: React, TypeScript, Java, Spring Boot, PostgreSQL, Redis,
          Kafka, Docker, AWS. Start simple; evolve deliberately.
        </p>
      </div>

      <section>
        <h2 className="mb-2 font-semibold">Architecture evolution</h2>
        <ol className="space-y-2">
          {EVOLUTION.map((step, i) => (
            <li
              key={step}
              className="flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
            >
              <span className="font-mono text-xs text-[var(--text-faint)]">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Demonstrates</h2>
        <ul className="columns-2 gap-4 text-sm text-[var(--text-muted)]">
          {[
            'AuthN / AuthZ',
            'Inventory & seats',
            'Concurrent purchases',
            'Reservation expiry',
            'Transactions / oversell prevention',
            'Idempotency',
            'Payments workflow',
            'Kafka async',
            'Redis caching / rate limits',
            'Horizontal scaling',
            'Retries / DLQ',
            'Observability',
            'Load testing',
            'Deployment',
          ].map((x) => (
            <li key={x} className="mb-1">
              {x}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Linked curriculum (Used in Capstone)</h2>
        {CAPSTONE_TOPICS.length === 0 ? (
          <p className="text-sm text-[var(--text-faint)]">No linked topics yet.</p>
        ) : (
          <ul className="space-y-2">
            {CAPSTONE_TOPICS.map((t) => (
              <li key={t.id} className="rounded-md border border-[var(--border)] p-3 text-sm">
                <Link className="font-medium text-[var(--accent)] hover:underline" to={`/topics/${t.id}`}>
                  {t.title}
                </Link>
                <p className="mt-1 text-[var(--text-muted)]">{t.usedInCapstone}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
