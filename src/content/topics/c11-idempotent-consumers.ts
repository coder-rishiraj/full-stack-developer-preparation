import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Idempotent consumers process duplicate message deliveries without duplicate side effects. Techniques: business idempotency key UNIQUE in DB, processed_events table (event_id PK), upsert ON CONFLICT, compare-and-set version, or naturally idempotent operations. Required companion to at-least-once Kafka delivery.',
  whyExists:
    'Kafka redelivers on crash, rebalance, and retry. Without idempotency, duplicate OrderPaid events double-ship or double-charge. Makes at-least-once reliable in practice — preferred pattern over chasing impossible global exactly-once.',
  mentalModel:
    'First time seeing event_id X → run side effects and record X. Duplicate X → skip or return previous result. Key must capture business intent — same payment idempotency key, not just offset (offsets differ on replay).',
  howItWorks: [
    {
      type: 'table',
      headers: ['Strategy', 'Implementation'],
      rows: [
        ['Natural idempotency', 'SET status=SHIPPED WHERE id AND status=PENDING'],
        ['Dedup table', 'INSERT processed(event_id) — unique violation skip'],
        ['Business key', 'payment_id UNIQUE on payments table'],
        ['Outbox relay idempotency', 'Mark outbox row SENT once'],
        ['Store result', 'Return cached outcome for same idempotency key'],
      ],
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Processed events dedup',
      code: `INSERT INTO processed_events (event_id, processed_at)
VALUES ('order-123-paid-v1', NOW())
ON CONFLICT (event_id) DO NOTHING;

-- If 0 rows inserted → already processed → skip handler`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Inventory consumer on StockReserved: UPDATE inventory SET qty = qty - :n WHERE sku = :s AND qty >= :n — row count 0 on duplicate same reservationId already applied via idempotent reservation record.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Event id should be stable — UUID from producer or hash of business facts',
        'Transactional: dedup insert + business update same DB transaction',
        'Race: two threads same event — unique constraint serializes',
        'TTL on dedup table if storage concern — must exceed max redelivery window',
        'Spring @Transactional on listener with dedup repo',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Safe at-least-once', 'Simple mental model', 'Works across DB and external APIs with keys'],
    disadvantages: ['Storage for dedup keys', 'Key design errors cause collision or missed dedup', 'Replay requires new event ids or reset dedup carefully'],
    alternatives: ['Kafka transactions for internal-only pipelines', 'At-most-once accept loss'],
    whenToUse: ['All payment, order, inventory consumers'],
    whenNotToUse: ['Pure metrics where duplicates inflate counts slightly — sometimes acceptable'],
  },
  failureModes: [
    'Dedup on offset only — replay topic reprocesses all',
    'Partial side effect before dedup record — inconsistent',
    'Different payload same key — must reject or version',
    'Dedup table not in same txn as business write',
  ],
  production: {
    reliability: ['Same transaction dedup + effect', 'Monitor duplicate skip rate'],
    observability: ['Metric: idempotent_skips_total', 'Alert abnormal drop suggesting dedup bug'],
    maintainability: ['Event id format documented per topic'],
  },
  interview: {
    expectations: ['Why needed with Kafka', 'Dedup strategies', 'Transactional boundaries'],
    commonQuestions: ['Implement idempotent consumer?', 'Key choice event id vs business id?'],
    followUps: ['Replay after bug fix?', 'Idempotency vs Kafka EOS?'],
    misconceptions: ['Manual ack alone prevents duplicates', 'Offset dedup enough for replay'],
    traps: ['Non-transactional dedup + update'],
    strongSignals: ['UNIQUE business key, same txn, stable event id, metrics on skips'],
  },
  keyTakeaways: [
    'At-least-once requires idempotent consumers.',
    'Dedup via UNIQUE keys or processed event table.',
    'Side effect and dedup record in one transaction.',
    'Use stable business/event identifiers not consumer offset.',
    'Monitor skipped duplicates as health signal.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why idempotent consumer?', answerHint: 'Kafka may redeliver; handler must not duplicate side effects.' },
    { level: 'intermediate', question: 'Dedup table pattern?', answerHint: 'INSERT event_id PK before processing; conflict means skip; same txn as business update.' },
    { level: 'advanced', question: 'Replay topic from beginning safely?', answerHint: 'Business keys idempotent regardless of offset; or truncate dedup with understanding; never offset-only dedup.' },
  ],
  flashcards: [
    { front: 'Idempotent consumer', back: 'Duplicate message → same net effect as once' },
    { front: 'processed_events table', back: 'PK event_id — insert before handle, skip on conflict' },
    { front: 'Same transaction', back: 'Dedup record + business update atomic' },
    { front: 'Business idempotency key', back: 'Stable across retries — paymentId not consumer offset' },
  ],
  quickRevision: ['Dedup keys', 'Same DB txn', 'At-least-once pair', 'Stable event id', 'Skip metrics'],
}
