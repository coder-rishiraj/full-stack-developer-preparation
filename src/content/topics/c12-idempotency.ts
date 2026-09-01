import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Idempotency ensures repeating an operation has same effect as once. Critical for retries, duplicate HTTP requests, and Kafka redelivery. Implement via Idempotency-Key header + store, DB UNIQUE constraints, upsert ON CONFLICT, processed-event table, or naturally idempotent verbs (PUT replace by id).',
  whyExists:
    'Networks fail after server processed but before client ack — clients retry. Mobile double-tap submits twice. At-least-once messaging redelivers. Without idempotency: double charges, duplicate orders, inflated inventory deductions.',
  mentalModel:
    'Every mutating API needs stable idempotency key from client intent. First execution runs logic and records outcome; duplicates return same result without re-running side effects. Scope key to tenant + operation.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Layer', 'Pattern', 'Example'],
      rows: [
        ['REST API', 'Idempotency-Key header + Redis/DB store', 'Stripe-style POST 24h TTL'],
        ['Database', 'UNIQUE business key', 'payment_id ON CONFLICT DO NOTHING'],
        ['Kafka consumer', 'processed_events PK', 'event_id insert before handle'],
        ['HTTP verbs', 'PUT/DELETE by id naturally idempotent', 'POST needs explicit key'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Idempotent API retry',
      diagram: `sequenceDiagram
  participant C as Client
  participant API
  participant S as Idempotency store
  C->>API: POST /pay Idempotency-Key abc
  API->>S: GET abc miss
  API->>API: charge
  API->>S: SET abc result
  API-->>C: 200 chargeId=9
  C->>API: retry same key abc
  API->>S: GET abc hit
  API-->>C: 200 chargeId=9`,
    },
  ],
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'Natural idempotency via unique key',
      code: `INSERT INTO payments (idempotency_key, amount, user_id)
VALUES ('abc-123', 50.00, 42)
ON CONFLICT (idempotency_key) DO NOTHING
RETURNING id;`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Same key different body → return 409 Conflict',
        'Store response status + body for exact replay',
        'TTL on keys balances memory vs retry window',
        'Transactional claim: insert key row locks before external call',
        'Fencing tokens for distributed lock stale holder prevention',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Safe retries improve reliability', 'Enables at-least-once messaging', 'Clear API contract'],
    disadvantages: ['Storage for keys/responses', 'Key reuse collision if client bugs', 'Late retry after TTL edge case'],
    alternatives: ['Exactly-once Kafka txn — limited to broker pipeline'],
    whenToUse: ['All payment/order POST', 'Webhook handlers', 'Booking/reservation APIs'],
    whenNotToUse: ['Pure reads', 'Intentionally cumulative metrics without dedup design'],
  },
  failureModes: [
    'Partial side effect before recording key',
    'Parallel same key race without UNIQUE constraint',
    'Client new key every retry — duplicates',
    'Idempotency store lost on Redis flush',
    'Key scoped too narrowly — collision across users',
  ],
  production: {
    reliability: ['DB-backed idempotency for money paths', 'Same transaction key + business update'],
    observability: ['Duplicate request metric', '409 conflict rate'],
    security: ['Bind key to authenticated user/tenant'],
    maintainability: ['Document key format and TTL per endpoint'],
  },
  interview: {
    expectations: ['Idempotency-Key pattern', 'DB upsert dedup', 'Kafka consumer dedup', 'POST vs PUT'],
    commonQuestions: ['Design idempotent payment API?', 'Retry safe POST?', 'Kafka duplicate handling?'],
    followUps: ['Same key different payload?', 'TTL choice?'],
    misconceptions: ['GET needs idempotency key', 'Retry without key is fine for POST'],
    traps: ['Charge then save key non-atomically'],
    strongSignals: ['UNIQUE key, store response, 409 on mismatch, txn boundaries, consumer dedup table'],
  },
  keyTakeaways: [
    'Retries and redelivery require idempotent handlers.',
    'Idempotency-Key header for POST mutations.',
    'DB UNIQUE constraints and processed event tables.',
    'Record outcome before acknowledging external retry.',
    'Same key + different body must reject with 409.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is idempotency?', answerHint: 'Multiple identical requests same effect as one — safe to retry.' },
    { level: 'intermediate', question: 'Idempotency-Key flow?', answerHint: 'Client sends key; server stores result on first success; replays return cached response.' },
    { level: 'advanced', question: 'Parallel duplicate requests same key?', answerHint: 'UNIQUE constraint serializes; one wins processing; other waits or gets stored result; transactional insert claim.' },
  ],
  flashcards: [
    { front: 'Idempotency', back: 'Repeat operation → same net effect' },
    { front: 'Idempotency-Key', back: 'Client UUID scoped to intent — dedup POST' },
    { front: 'ON CONFLICT DO NOTHING', back: 'DB-level dedup insert pattern' },
    { front: '409 on key mismatch', back: 'Same key different body — reject conflict' },
  ],
  quickRevision: ['Key per POST intent', 'Store response', 'UNIQUE constraint', 'Same txn', 'Kafka dedup table'],
}
