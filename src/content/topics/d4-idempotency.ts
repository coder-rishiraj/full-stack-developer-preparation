import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Idempotency means performing the same operation multiple times produces the same effect as performing it once. In distributed systems, retries, duplicate messages, and at-least-once delivery make idempotent handlers essential — use deterministic keys, upserts, and deduplication stores.',
  whyExists:
    'Networks fail after server processed request but before client got ack — clients retry. Kafka consumers redeliver. Load balancers replay. Without idempotency, retries create duplicate orders, double charges, or extra side effects.',
  mentalModel:
    'Every mutating operation needs a stable idempotency key (client-generated UUID) mapped to outcome. First execution runs business logic and records result; duplicates return cached result without re-running side effects.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Layer', 'Technique', 'Example'],
      rows: [
        ['API', 'Idempotency-Key header + store', 'Stripe-style POST dedup 24h'],
        ['Database', 'UPSERT / unique constraint', 'INSERT ... ON CONFLICT DO NOTHING'],
        ['Messaging', 'Consumer dedup table', 'processed_message_id PK'],
        ['Distributed lock', 'Fencing token with storage', 'Prevent stale leader write'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Idempotent retry flow',
      diagram: `sequenceDiagram
  participant C as Client
  participant API
  participant Store as Idempotency store
  C->>API: POST /pay Idempotency-Key: abc
  API->>Store: GET abc
  Store-->>API: miss
  API->>API: process payment
  API->>Store: SET abc → result
  API-->>C: 200 {charge_id: 9}
  C->>API: POST /pay Idempotency-Key: abc (retry)
  API->>Store: GET abc
  Store-->>API: hit
  API-->>C: 200 {charge_id: 9} (no double charge)`,
    },
    {
      type: 'list',
      items: [
        'Keys scoped to tenant + operation + client intent',
        'Store response status + body for exact replay',
        'TTL on keys balances memory vs retry window',
        'Natural idempotency: PUT replace, DELETE by id',
        'Non-idempotent POST needs explicit key',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'Natural idempotency via unique business key',
      code: `INSERT INTO payments (idempotency_key, amount, user_id)
VALUES ('abc-123', 50.00, 42)
ON CONFLICT (idempotency_key) DO NOTHING
RETURNING id;
-- Second insert returns nothing → app fetches existing row`,
    },
    {
      type: 'paragraph',
      text: 'Kafka consumer: before side effect, INSERT INTO processed(event_id) — duplicate delivery hits unique violation and skips handler body.',
    },
  ],
  tradeoffs: {
    advantages: ['Safe retries improve reliability', 'Simplifies at-least-once messaging', 'Clear client contract'],
    disadvantages: ['Storage for keys/responses', 'Key collision if client reuses key for different intent', 'TTL edge cases on very late retries'],
    alternatives: ['Exactly-once Kafka transactions (limited scope)', 'Dedup via version CAS only'],
    whenToUse: ['All payment/order POST', 'Webhook handlers', 'Saga step endpoints'],
    whenNotToUse: ['Pure reads', 'Intentionally cumulative counters without dedup design'],
  },
  failureModes: [
    'Same key different payload → must reject 409',
    'Idempotency store lost → double processing',
    'Race: two parallel requests same key → need transactional claim',
    'Partial side effect before recording key → inconsistent',
    'Client generates new key every retry → duplicates',
  ],
  production: {
    reliability: ['Atomic: claim key in same txn as business write', 'Return same HTTP status on replay'],
    scalability: ['Shard idempotency store by key hash', 'Redis SET NX with TTL for hot path'],
    observability: ['Duplicate request rate', 'Key collision 409 count'],
    security: ['Bind key to authenticated principal', 'Prevent cross-user key reuse'],
    maintainability: ['Document retry policy and key TTL'],
  },
  interview: {
    expectations: ['Define idempotency', 'Design Idempotency-Key store', 'At-least-once + idempotent consumer'],
    commonQuestions: ['POST retry without duplicate order?', 'Kafka exactly-once vs idempotent?'],
    followUps: ['Parallel duplicate requests?', 'Key TTL vs chargeback window?'],
    misconceptions: ['GET POST always safe to retry', 'UUID in body equals idempotency without server store'],
    traps: ['Side effect before dedup record'],
    strongSignals: ['Transactional outbox + idempotent consumer', '409 on payload mismatch'],
  },
  keyTakeaways: [
    'Retries are inevitable — design for at-least-once execution.',
    'Idempotency-Key + durable store returns same outcome.',
    'UPSERT/unique constraints give natural DB idempotency.',
    'Record result atomically with effect.',
    'PUT/DELETE idempotent by HTTP semantics; POST is not.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why idempotency in distributed systems?', answerHint: 'Retries and duplicate delivery must not duplicate side effects.' },
    { level: 'intermediate', question: 'Design idempotent payment API.', answerHint: 'Idempotency-Key header, store mapping to charge_id, return cached response on replay.' },
    { level: 'advanced', question: 'Two parallel requests same key?', answerHint: 'First wins via DB unique or Redis SETNX; second waits or returns in-flight/409.' },
  ],
  flashcards: [
    { front: 'Idempotent operation', back: 'Multiple identical invocations same effect as one' },
    { front: 'At-least-once + ?', back: 'Idempotent handlers → effective exactly-once behavior' },
    { front: 'POST retry fix', back: 'Client Idempotency-Key + server dedup store' },
    { front: 'ON CONFLICT DO NOTHING', back: 'DB-level dedup for natural keys' },
  ],
  quickRevision: [
    'Retries happen',
    'Key + store result',
    'Atomic with side effect',
    '409 payload mismatch',
    'Consumer dedup table',
  ],
  systemDesign: {
    problem: 'Build idempotent wire transfer API across unreliable mobile networks with 24h retry window.',
    requirements: {
      functional: ['Transfer between accounts', 'Status query', 'Duplicate-safe retries'],
      nonFunctional: ['Exactly-once money movement effect', '24h idempotency retention'],
    },
    scaleAssumptions: ['2k transfers/s', '1% retry rate'],
    capacityEstimates: ['Idempotency rows ~2k/s × 86400 TTL — partition + archive'],
    api: [{ type: 'code', language: 'http', code: `POST /transfers\nIdempotency-Key: uuid\n{from, to, amount}` }],
    dataModel: [{ type: 'list', items: ['idempotency_keys(key, user_id, request_hash, response, created_at)', 'transfers with unique idempotency_key FK'] }],
    highLevelArchitecture: [
      { type: 'paragraph', text: 'API validates key; BEGIN txn: insert idempotency claim; debit/credit; store response; COMMIT.' },
    ],
    diagram: {
      mermaid: `flowchart TB
  POST --> Check{Key exists?}
  Check -->|yes same hash| Return[Return stored response]
  Check -->|yes diff hash| Reject409[409 Conflict]
  Check -->|no| Txn[DB txn transfer + record key]`,
      caption: 'Idempotency decision tree',
    },
    dataFlow: ['Claim key → ledger txn → persist response JSON'],
    storage: ['Postgres idempotency + ledger tables'],
    caching: ['Redis cache hot keys for read path of replays'],
    asyncProcessing: ['Expire old keys to cold storage'],
    scaling: ['Shard by user_id'],
    consistency: ['Serializable txn on accounts'],
    reliability: ['Same response on replay including errors if recorded'],
    failureScenarios: ['Crash after transfer before key record → use outbox or pending state + reconciliation'],
    security: ['Key bound to auth user', 'Hash request body'],
    observability: ['Replay rate, 409 rate, stuck in-flight keys'],
    bottlenecks: ['Hot account row locks'],
    alternatives: ['Deterministic transfer id from client UUID as PK'],
    tradeoffs: ['Long TTL storage cost vs support retries'],
    interviewFollowUps: ['In-flight duplicate handling?', 'Failed transfer idempotent replay?'],
    evolution: [
      { stage: '1. Simple design', description: 'No dedup — duplicates on retry.', bottleneck: 'Money errors.' },
      { stage: '2. Improve', description: 'Idempotency table.', bottleneck: 'Race duplicates.' },
      { stage: '3. Improve', description: 'Transactional claim + request hash.', bottleneck: 'Storage growth.' },
      { stage: '4. Scale further', description: 'Redis front + Postgres authoritative.', bottleneck: 'Redis/DB consistency on claim.' },
    ],
  },
}
