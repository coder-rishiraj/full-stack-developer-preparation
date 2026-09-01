import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'API idempotency ensures repeated identical requests (usually POST) produce the same outcome without duplicate side effects — via Idempotency-Key header, natural idempotent methods (PUT/DELETE), or business unique constraints exposed through HTTP semantics.',
  whyExists:
    'Mobile networks and gateways retry failed requests. Without idempotency, duplicate POST /payments creates double charges. REST POST is not idempotent by default — clients and servers must cooperate with explicit keys and stored responses.',
  mentalModel:
    'Client generates UUID per intent (one checkout click). Server stores key → result mapping for 24h. Retry with same key returns original HTTP status/body without re-executing charge logic.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Method', 'Idempotent?', 'Notes'],
      rows: [
        ['GET', 'Yes', 'Safe + idempotent'],
        ['PUT', 'Yes', 'Replace same resource id'],
        ['DELETE', 'Yes', 'Second delete 404 OK'],
        ['POST', 'No default', 'Needs Idempotency-Key'],
        ['PATCH', 'Often no', 'Use key or If-Match versioning'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Idempotency-Key server flow',
      diagram: `sequenceDiagram
  participant C as Client
  participant API
  participant Store
  C->>API: POST /orders Idempotency-Key: k1
  API->>Store: lookup k1
  Store-->>API: miss
  API->>API: create order 991
  API->>Store: save k1→991
  API-->>C: 201 {id:991}
  C->>API: POST retry Key k1
  API->>Store: lookup k1
  Store-->>API: hit 991
  API-->>C: 201 {id:991} no duplicate`,
    },
    {
      type: 'list',
      items: [
        'Return same status code on replay (201 not 200 if original 201)',
        '409 if same key different body hash',
        'Scope key to authenticated user/tenant',
        'TTL 24-72h typical; document in API docs',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Stripe-style idempotent POST',
      code: `POST /v1/transfers
Authorization: Bearer ...
Idempotency-Key: 7c9e6679-7425-40de-944b-e07fc1f90ae7
Content-Type: application/json

{"amount": 100, "to": "acct_123"}`,
    },
  ],
  tradeoffs: {
    advantages: ['Safe retries', 'Better UX on flaky networks', 'Partner integration confidence'],
    disadvantages: ['Storage for keys', 'In-flight duplicate parallel requests complexity', 'Key misuse by client'],
    alternatives: ['Client-generated resource id PUT', 'Deterministic id from business key in URL'],
    whenToUse: ['All money/order creating POST', 'Webhook processing dedup'],
    whenNotToUse: ['Read-only GET without side effects'],
  },
  failureModes: [
    'Side effect before recording key',
    'Different payload same key',
    'Key scoped globally not per user collision',
    'Returning 200 on replay when original 201 breaks clients',
    'Store loss → duplicate processing',
  ],
  production: {
    reliability: ['Atomic claim key in transaction with business write', 'Redis SET NX + DB authoritative'],
    security: ['Bind key to auth principal', 'Hash request body for mismatch detect'],
    observability: ['Replay rate, 409 conflict rate', 'In-flight lock duration'],
    scalability: ['Shard idempotency store', 'TTL eviction'],
    maintainability: ['Document in OpenAPI required header on POST endpoints'],
  },
  interview: {
    expectations: ['POST vs PUT idempotency', 'Idempotency-Key design', 'Parallel duplicate handling'],
    commonQuestions: ['Prevent duplicate order on retry?', 'Which methods idempotent?'],
    followUps: ['Same key different user?', 'TTL choice?'],
    misconceptions: ['UUID in body enough without server store'],
    traps: ['Non-atomic record after charge'],
    strongSignals: ['Request hash 409', 'Same response replay', 'Outbox + consumer dedup'],
  },
  keyTakeaways: [
    'POST needs Idempotency-Key for safe retries.',
    'Store maps key → response; replay exact response.',
    'PUT/DELETE idempotent by resource id design.',
    '409 on payload mismatch same key.',
    'Atomic record with side effect transaction.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Is POST idempotent?', answerHint: 'No — retries may duplicate unless Idempotency-Key dedup.' },
    { level: 'intermediate', question: 'Design idempotency store fields?', answerHint: 'key, user_id, request_hash, status_code, response_body, created_at, TTL.' },
    { level: 'advanced', question: 'Two parallel POSTs same key?', answerHint: 'First wins DB unique constraint; second waits or returns in-flight; optional 409 if body differs.' },
  ],
  flashcards: [
    { front: 'Idempotency-Key header', back: 'Client UUID per intent; server dedupes POST retries' },
    { front: 'PUT idempotent', back: 'Same URL replace — repeated PUT same end state' },
    { front: '409 on idempotency', back: 'Same key different request body rejected' },
    { front: 'Replay response rule', back: 'Return original status+body including errors if stored' },
  ],
  quickRevision: [
    'POST needs key',
    'Store response',
    'Atomic with txn',
    '409 body mismatch',
    'PUT/DELETE safe retry',
  ],
  systemDesign: {
    problem: 'Add idempotency to public partner API POST endpoints (create invoice, send payment) with 72h retry window.',
    requirements: {
      functional: ['Idempotent POST', 'Conflict on body mismatch', 'Status query separate'],
      nonFunctional: ['72h key retention', '10k POST/s', 'Partner docs in OpenAPI'],
    },
    scaleAssumptions: ['10k POST/s', '1% retries'],
    capacityEstimates: ['Redis hot + Postgres authoritative idempotency table'],
    api: [{ type: 'code', language: 'http', code: `POST /v1/invoices\nIdempotency-Key: required\nIdempotency-Key-Scope: optional tenant hint` }],
    dataModel: [{ type: 'list', items: ['idempotency(api_key, key) PK', 'request_hash, response_code, response_body, expires_at'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'Middleware claims key before handler; handler runs in txn; middleware caches response.' }],
    diagram: {
      mermaid: `flowchart TB
  POST --> MW[Idempotency middleware]
  MW --> Hit{exists?}
  Hit -->|yes| Replay[Return stored]
  Hit -->|no| Handler[Business handler + txn]
  Handler --> Store[Persist key+response]`,
      caption: 'Middleware wraps all mutating POSTs',
    },
    dataFlow: ['Claim → execute → store → respond; replay skips handler'],
    storage: ['Postgres + Redis cache'],
    caching: ['Redis GET key first'],
    asyncProcessing: ['TTL job purge expired keys'],
    scaling: ['Shard by api_key hash'],
    consistency: ['Serializable claim insert'],
    reliability: ['Crash mid-handler — key incomplete → retry runs or returns 409 in-flight policy'],
    failureScenarios: ['Redis down → Postgres only slower OK'],
    security: ['Key scoped to api_key + partner cred'],
    observability: ['Replay %, conflict %, latency overhead'],
    bottlenecks: ['Large response bodies in store — store pointer ids only'],
    alternatives: ['Deterministic id PUT /invoices/{client_supplied_id}'],
    tradeoffs: ['Store full body vs id reference on replay'],
    interviewFollowUps: ['Idempotent 500 errors replay?', 'Webhook idempotency event id?'],
    evolution: [
      { stage: '1. Simple design', description: 'No idempotency.', bottleneck: 'Duplicate invoices.' },
      { stage: '2. Improve', description: 'Optional key.', bottleneck: 'Partners skip key.' },
      { stage: '3. Improve', description: 'Required key + OpenAPI.', bottleneck: 'Storage size.' },
      { stage: '4. Scale further', description: 'Redis front + body hash 409.', bottleneck: 'Parallel in-flight UX.' },
    ],
  },
}
