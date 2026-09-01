import type { TopicContent } from '@/domain/types'

export const restContent: TopicContent = {
  whatIsIt:
    'REST (Representational State Transfer) is an architectural style for networked APIs: resources identified by URLs, manipulated via HTTP methods, representations (JSON/XML) transferred statelessly, uniform interface, cacheable responses, layered system (proxies, gateways).',
  whyExists:
    'RPC-over-HTTP with opaque endpoints scales poorly for caching, tooling, and interoperability. REST leverages HTTP semantics so browsers, CDNs, and API gateways optimize reads; teams share predictable CRUD patterns.',
  mentalModel:
    'Nouns not verbs in URLs (/orders/42 not /getOrder). HTTP method expresses action. Server holds resource state; client holds application state. Each request carries auth and context — no server session required for REST purity.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Constraint', 'Meaning'],
      rows: [
        ['Client-server', 'Separation of UI and data API'],
        ['Stateless', 'No server session between requests'],
        ['Cacheable', 'Responses label cacheability'],
        ['Uniform interface', 'URLs + methods + representations'],
        ['Layered system', 'Client unaware of intermediaries'],
        ['Code on demand (optional)', 'Scripts to client — rare in APIs'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Resource CRUD flow',
      diagram: `sequenceDiagram
  participant C as Client
  participant API as REST API
  C->>API: POST /v1/orders {items}
  API-->>C: 201 Location: /v1/orders/991
  C->>API: GET /v1/orders/991
  API-->>C: 200 ETag: "v1"
  C->>API: PATCH /v1/orders/991 If-Match: "v1"
  API-->>C: 200 updated order`,
    },
    {
      type: 'list',
      items: [
        'Version: /v1/ prefix or Accept header — be consistent.',
        'Pagination: ?cursor= or limit/offset; prefer cursor at scale.',
        'Errors: problem+json (RFC 7807) with type, title, detail.',
        'HATEOAS optional: links for discoverability.',
        'Pragmatic RPC actions: POST /orders/991/cancel when clearer.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Booking API',
      code: `POST /v1/events/7/bookings
Authorization: Bearer ...
Idempotency-Key: uuid-123
{"seats":["A1","A2"]}
→ 201 Created Location: /v1/bookings/991

GET /v1/bookings/991
→ 200 OK ETag: "v3" Cache-Control: private

DELETE /v1/bookings/991
→ 204 No Content`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Spring REST controller',
      code: `@RestController
@RequestMapping("/v1/users")
class UserApi {
  @GetMapping("/{id}") User get(@PathVariable Long id) { ... }
  @PostMapping @ResponseStatus(CREATED) User create(@RequestBody User u) { ... }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Richardson maturity model: Level 0 (single URL) → Level 3 (HATEOAS).',
        'OpenAPI documents resources, schemas, security schemes.',
        'Hypermedia as the Engine of Application State — links drive client navigation.',
        'Content negotiation: Accept header selects JSON vs XML.',
        'ETag/If-Match for optimistic concurrency on updates.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'HTTP caching and CDN friendly GETs',
      'Broad tooling and developer familiarity',
      'Stateless horizontal scaling',
    ],
    disadvantages: [
      'Over/under-fetching vs GraphQL',
      'Many endpoints for complex graphs',
      'Strict REST vs pragmatic action URLs tension',
    ],
    alternatives: [
      'GraphQL single endpoint flexible queries',
      'gRPC for internal binary RPC',
      'JSON-RPC style POST everything',
    ],
    whenToUse: [
      'Public HTTP APIs, CRUD domains',
      'Cacheable read-heavy workloads',
    ],
    whenNotToUse: [
      'Internal microservice mesh needing streaming/binary (gRPC)',
      'Clients need arbitrary field selection only',
    ],
  },
  failureModes: [
    'POST for all operations — breaks caching semantics.',
    'Retry POST without idempotency → duplicates.',
    '500 for validation instead of 400/422.',
    'Leaking internal DB schema in URLs without authZ.',
    'Chatty N+1 client calls instead of composite resources.',
  ],
  interview: {
    expectations: [
      'Map HTTP methods to CRUD',
      'Explain statelessness',
      'REST constraints at high level',
    ],
    commonQuestions: [
      'What is REST?',
      'REST vs SOAP vs RPC?',
      'How version REST APIs?',
      'PUT vs PATCH in REST?',
    ],
    followUps: [
      'REST vs GraphQL trade-offs?',
      'What is HATEOAS?',
    ],
    misconceptions: [
      'REST requires JSON (any representation)',
      'REST means no server-side data storage',
      'Every API with HTTP is RESTful',
    ],
    traps: ['Using verbs in URLs (/createUser) as primary design'],
    strongSignals: [
      'Resource URLs + correct status codes',
      'Idempotency-Key on POST',
      'ETag concurrency control',
    ],
  },
  keyTakeaways: [
    'Resources + HTTP methods + representations.',
    'Stateless server; auth each request.',
    'Use status codes and cache headers correctly.',
    'Version and paginate consistently.',
    'Pragmatic when pure CRUD awkward.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What makes an API RESTful?',
      answerHint: 'Resources, uniform HTTP interface, stateless, cacheable representations.',
    },
    {
      level: 'intermediate',
      question: 'How handle API versioning?',
      answerHint: 'URL /v1/, header Accept, or custom header — pick one consistently.',
    },
    {
      level: 'advanced',
      question: 'REST vs GraphQL when?',
      answerHint: 'REST: cacheable resources, simple CRUD; GraphQL: flexible client queries, reduce round trips.',
    },
  ],
  flashcards: [
    { front: 'REST stateless', back: 'Server doesn’t store client session between requests' },
    { front: '201 Created', back: 'POST create success + Location header' },
    { front: 'Richardson Level 3', back: 'HATEOAS hypermedia controls' },
  ],
  quickRevision: [
    'Nouns in URLs',
    'HTTP verbs for CRUD',
    'Stateless + cacheable',
    'JSON representations',
    'Proper status codes',
    'Idempotency-Key POST',
    'ETag optimistic lock',
  ],
}

export const content = restContent
