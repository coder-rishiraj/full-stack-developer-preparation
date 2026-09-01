import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'At-most-once delivery delivers each message zero or one times — may lose messages, never duplicates. Achieved by committing offset before processing or fire-and-forget consumer. Suitable for metrics, logs, non-critical telemetry where loss acceptable but duplicates harmful or meaningless.',
  whyExists:
    'Some workloads prefer missing a few datapoints over counting twice (analytics aggregates skew). Simpler consumer — no idempotency store. Trade reliability for simplicity and lower latency when loss rate acceptable.',
  mentalModel:
    'Process may never run if crash after commit. Like dropping mail to avoid sending twice. Never use for money or inventory without understanding loss rate. Often combined with sampling at source.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Loss on crash after commit before process',
      diagram: `sequenceDiagram
  participant K as Kafka
  participant C as Consumer
  K->>C: poll offset 50
  C->>K: commit offset 51
  Note over C: crash before process
  Note over K: offset 50 skipped forever`,
    },
    {
      type: 'list',
      items: [
        'enable.auto.commit=true with fast commit interval — classic at-most-once risk',
        'Explicit: commitSync then process (anti-pattern for critical data)',
        'Async fire-and-forget processing without retry',
        'Producer retries may still duplicate on producer side — separate concern',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Click analytics: consumer commits offset immediately on poll, batches events to warehouse async. Lost batch on crash acceptable within 0.1% SLA. Dashboard shows approximate counts.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Kafka still retains messages — loss is consumer choice not to read again',
        'Auto-commit interval default 5s — messages reprocessed on crash if not committed yet (actually between at-most and at-least depending timing)',
        'True at-most-once requires commit-before-process discipline',
        'Monitoring gaps detect loss via compare source vs sink counts',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['No duplicate processing logic', 'Simpler faster consumer path', 'OK for best-effort telemetry'],
    disadvantages: ['Silent data loss', 'Unacceptable for financial events', 'Hard to detect loss without reconciliation'],
    alternatives: ['At-least-once + idempotency', 'Sample at source to reduce volume'],
    whenToUse: ['Metrics, logs, non-critical analytics', 'High volume where approximate OK'],
    whenNotToUse: ['Orders, payments, inventory reservations'],
  },
  failureModes: [
    'Using at-most-once for order events — lost orders',
    'Assuming auto-commit is at-least-once (timing dependent)',
    'No reconciliation — undetected loss for months',
  ],
  production: {
    reliability: ['Explicit SLA on acceptable loss rate', 'Reconciliation jobs compare counts'],
    observability: ['Gap detection in time-series ingestion', 'Alert if ingest rate drops vs producer'],
  },
  interview: {
    expectations: ['Define at-most-once', 'Commit order', 'When acceptable'],
    commonQuestions: ['At-most vs at-least-once?', 'Kafka default semantics?'],
    followUps: ['Auto-commit behavior?', 'Use case for at-most-once?'],
    misconceptions: ['Kafka deletes messages on at-most-once', 'At-most-once never loses (it can)'],
    traps: ['At-most-once for payment topic'],
    strongSignals: ['Explicit loss tolerance, reconciliation, never for money paths'],
  },
  keyTakeaways: [
    'At-most-once: zero or one delivery — loss possible, no duplicates.',
    'Commit before process causes skip on crash.',
    'Only for best-effort non-critical data.',
    'Monitor and reconcile for silent loss.',
    'Critical paths need at-least-once + idempotency.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is at-most-once?', answerHint: 'Message delivered zero or one time — may lose, avoids duplicate consumer processing.' },
    { level: 'intermediate', question: 'How achieve at-most-once in Kafka?', answerHint: 'Commit offset before processing completes; accept skip if crash after commit.' },
    { level: 'advanced', question: 'Why not at-most-once for orders?', answerHint: 'Lost order events mean missing revenue/fulfillment — business requires at-least-once with idempotent handling.' },
  ],
  flashcards: [
    { front: 'At-most-once', back: '0 or 1 delivery — may lose message' },
    { front: 'Commit before process', back: 'Skips message if crash after commit — at-most-once pattern' },
    { front: 'Use case', back: 'Telemetry/metrics where approximate counts OK' },
    { front: 'Not for', back: 'Payments, orders, inventory — need at-least-once' },
  ],
  quickRevision: ['May lose never dup', 'Commit first = loss risk', 'Telemetry only', 'Reconcile counts', 'Not for money'],
}
