import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'REST (Representational State Transfer) is an architectural style for networked APIs using resources (nouns), standard HTTP methods (verbs), stateless requests, representations (JSON/XML), and hypermedia optionally. It leverages HTTP caching, status codes, and uniform interfaces.',
  whyExists:
    'Before REST, integrations used opaque RPC over HTTP POST for everything. REST standardizes how clients discover and manipulate resources, enabling caches, intermediaries, and tooling (OpenAPI, browsers) to work predictably.',
  mentalModel:
    'URLs identify resources (/orders/42), HTTP methods express intent (GET read, POST create, PUT replace, PATCH partial update, DELETE remove). Server does not store client session state between requests — auth via tokens each call. Responses carry status + representation + cache headers.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Method', 'Idempotent', 'Safe', 'Typical use'],
      rows: [
        ['GET', 'Yes', 'Yes', 'Read resource or collection'],
        ['POST', 'No', 'No', 'Create; non-idempotent actions'],
        ['PUT', 'Yes', 'No', 'Replace entire resource'],
        ['PATCH', 'No*', 'No', 'Partial update'],
        ['DELETE', 'Yes', 'No', 'Remove resource'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Resource-oriented API flow',
      diagram: `sequenceDiagram
  participant C as Client
  participant API as REST API
  participant DB as Database
  C->>API: POST /v1/orders {items}
  API->>DB: INSERT
  DB-->>API: order id=42
  API-->>C: 201 Created Location: /v1/orders/42
  C->>API: GET /v1/orders/42
  API-->>C: 200 {id:42,...}`,
    },
    {
      type: 'list',
      items: [
        'Version in path (/v1/) or header — be consistent',
        'Pagination: ?cursor= or ?page=&limit=; prefer cursor for large sets',
        'Errors: problem+json with code, message, details (RFC 7807 style)',
        'HATEOAS optional: links next/prev/related in response',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Booking API sketch',
      code: `POST /v1/events/7/bookings
Authorization: Bearer ...
{ "seats": ["A1","A2"], "idempotency-key": "uuid" }
→ 201 Created
  Location: /v1/bookings/991
  { "id": 991, "status": "confirmed" }

GET /v1/bookings/991
→ 200 OK
  ETag: "v3"
  Cache-Control: private, no-cache

PATCH /v1/bookings/991
If-Match: "v3"
{ "status": "cancelled" }
→ 200 OK | 409 Conflict if stale`,
    },
  ],
  tradeoffs: {
    advantages: [
      'HTTP-native caching and status semantics',
      'Broad tooling and developer familiarity',
      'Stateless servers scale horizontally',
    ],
    disadvantages: [
      'Over-fetch/under-fetch vs GraphQL',
      'Many endpoints for complex graphs',
      'Strict REST purism vs pragmatic RPC actions (/bookings/991/cancel)',
    ],
    alternatives: ['GraphQL', 'gRPC for internal', 'JSON-RPC'],
    whenToUse: ['Public HTTP APIs', 'CRUD-heavy domains', 'CDN/cache-friendly reads'],
    whenNotToUse: ['High-performance internal microservice mesh (often gRPC)', 'Clients need flexible field selection only'],
  },
  failureModes: [
    'POST for everything — breaks caching and semantics',
    'Ignoring idempotency on retries → duplicate orders',
    '500 for validation errors instead of 400/422',
    'Leaking DB ids without authZ check on every resource',
  ],
  production: {
    performance: ['Cache-Control on GET; ETag conditional requests', 'Compression gzip/br'],
    scalability: ['Stateless JWT/API keys', 'Rate limit per tenant'],
    reliability: ['Idempotency-Key header on POST', 'Retry-safe GET/PUT/DELETE'],
    security: ['HTTPS only', 'OAuth2/OIDC', 'Scope checks per resource'],
    observability: ['Structured logs with request id', 'OpenAPI contract tests'],
    maintainability: ['Version deprecation policy', 'Consistent error envelope'],
  },
  interview: {
    expectations: [
      'Map HTTP methods to CRUD correctly',
      'Discuss idempotency, status codes, versioning',
      'Design resource URLs for nested entities',
    ],
    commonQuestions: ['REST vs GraphQL?', 'PUT vs PATCH?', 'Design URL for cancel booking'],
    followUps: ['How paginate millions of orders?', 'Long-running POST → 202 Accepted pattern'],
    misconceptions: ['REST requires JSON', 'REST forbids RPC-style actions ever'],
    traps: ['Using GET with side effects', '200 OK with error body'],
    strongSignals: ['Idempotency keys', 'ETags', '201 + Location', 'Problem details'],
  },
  keyTakeaways: [
    'Resources as nouns; HTTP verbs carry meaning.',
    'Stateless: auth every request.',
    'Correct status codes: 201, 204, 400, 401, 403, 404, 409, 429, 503.',
    'Idempotency-Key for safe POST retries.',
    'Version API; document with OpenAPI.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Is GET idempotent and safe?',
      answerHint: 'Yes both — no server state change expected.',
    },
    {
      level: 'intermediate',
      question: 'PUT vs PATCH?',
      answerHint: 'PUT replaces whole resource; PATCH partial fields.',
    },
    {
      level: 'advanced',
      question: 'Design REST for nested comments on posts.',
      answerHint: '/posts/{id}/comments or /comments?postId=; pick one style; link in response.',
    },
  ],
  flashcards: [
    { front: 'POST idempotent?', back: 'No — retries may duplicate unless idempotency key' },
    { front: '201 Created', back: 'Resource created; include Location header' },
    { front: '409 Conflict', back: 'Version mismatch / concurrent update (If-Match)' },
    { front: 'Stateless REST', back: 'Server stores no client session; token per request' },
  ],
  quickRevision: [
    'Nouns in URLs; verbs in HTTP methods',
    'Status codes matter',
    'Idempotency-Key on POST',
    'ETag / If-Match optimistic concurrency',
    'Version /v1/ + OpenAPI',
  ],
  systemDesign: {
    problem: 'Design a versioned REST API for an event ticketing platform (events, bookings, payments webhooks) suitable for public partners and mobile apps.',
    requirements: {
      functional: [
        'List/search events',
        'Create/cancel booking',
        'Get booking status',
        'Partner webhook on payment',
      ],
      nonFunctional: [
        'Backward compatible v1 for 12 months',
        'Idempotent booking creation',
        'Rate limits per API key',
        'OpenAPI documentation',
      ],
    },
    scaleAssumptions: ['50k RPS peak reads', '2k booking writes/s', '500 partners'],
    capacityEstimates: ['Read-heavy — CDN/cache GET events', 'Write path through API + DB'],
    api: [
      {
        type: 'code',
        language: 'http',
        code: `GET  /v1/events?city=nyc&cursor=abc
GET  /v1/events/{eventId}
POST /v1/bookings          Idempotency-Key: ...
GET  /v1/bookings/{id}
DELETE /v1/bookings/{id}   → 204
POST /v1/webhooks/payment  (provider → us, signed)`,
      },
    ],
    dataModel: [
      {
        type: 'list',
        items: [
          'Event, Booking, Payment resources with stable ids',
          'Idempotency record: key → booking_id response cache 24h',
        ],
      },
    ],
    highLevelArchitecture: [
      {
        type: 'paragraph',
        text: 'API Gateway (auth, rate limit) → Booking Service → Postgres. Async payment webhook updates booking status. OpenAPI published; JSON representations; HATEOAS links optional (_links.cancel).',
      },
    ],
    diagram: {
      mermaid: `flowchart LR
  Mobile --> GW[API Gateway]
  Partner --> GW
  GW --> API[REST Booking API]
  API --> DB[(PostgreSQL)]
  Pay[Payment Provider] -->|webhook POST| API`,
      caption: 'Public REST surface with gateway policies',
    },
    dataFlow: [
      'POST booking with Idempotency-Key → dedupe table → create or replay response',
      'GET booking — private cache headers',
      'Webhook signature verify → PATCH booking status internal',
    ],
    storage: ['Postgres source of truth', 'Redis for idempotency keys'],
    caching: ['Cache GET events; invalidate on admin update'],
    asyncProcessing: ['Webhook processing queue for reliability'],
    scaling: ['Stateless API pods', 'Read replicas for GET events'],
    consistency: ['Strong booking create; eventual webhook status update with polling fallback GET'],
    reliability: ['Retry webhooks idempotent by event id', '503 + Retry-After under overload'],
    failureScenarios: ['Duplicate POST without key → double booking', 'Stale GET after cancel — use Cache-Control: no-store on booking'],
    security: ['OAuth2 client credentials for partners', 'Scope: bookings:write', 'Webhook HMAC'],
    observability: ['Per-route latency, 4xx/5xx, idempotency replay rate'],
    bottlenecks: ['Hot event list — cache + cursor pagination'],
    alternatives: ['GraphQL for mobile flexible queries — REST still for partners'],
    tradeoffs: ['RPC POST /bookings/{id}/cancel vs DELETE resource', 'Path vs query nesting'],
    interviewFollowUps: ['Long-running hold seat → 202 + poll URL?', 'How deprecate v1 field?'],
    evolution: [
      { stage: '1. Simple design', description: 'CRUD endpoints, minimal versioning.', bottleneck: 'Breaking changes hurt clients.' },
      { stage: '2. Improve', description: '/v1/ prefix, OpenAPI, standard errors.', bottleneck: 'Duplicate POST on retry.' },
      { stage: '3. Improve', description: 'Idempotency-Key, ETags, rate limits.', bottleneck: 'Partner integration variance.' },
      { stage: '4. Scale further', description: 'Gateway policies, webhook queue, v2 parallel run.', bottleneck: 'Documentation drift — contract tests.' },
    ],
  },
}
