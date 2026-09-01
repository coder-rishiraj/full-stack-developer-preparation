import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'API design in system design interviews defines resource-oriented endpoints, HTTP methods, request/response shapes, pagination, versioning, and error contracts — balancing RESTful clarity, client ergonomics, and backend implementation cost within the 45-minute interview window.',
  whyExists:
    'Interviewers assess whether you can translate features into clean interfaces before diving into databases. Poor API design (chatty endpoints, ambiguous IDs, no pagination) exposes scaling and consistency problems downstream. A crisp API section signals senior engineering judgment.',
  mentalModel:
    'Menu at a restaurant: dishes (resources), actions (verbs via HTTP methods), portions (pagination), specials rules (rate limits, idempotency). Design for the client journey — signup, create post, feed — not internal microservice guts.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Decision', 'Interview choice', 'Avoid'],
      rows: [
        ['Resources', 'POST /v1/orders, GET /v1/orders/{id}', 'RPC /createOrder everywhere'],
        ['Pagination', 'cursor-based for feeds', 'offset on huge tables'],
        ['Ids', 'opaque UUID or snowflake', 'auto-increment leaked'],
        ['Errors', 'consistent JSON + HTTP status', '200 with error body'],
        ['Writes', 'Idempotency-Key header', 'Duplicate POST charges'],
        ['Bulk', 'batch endpoints when hot path', '1000 sequential GETs'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'REST resource sketch',
      diagram: `flowchart LR
  Client --> POST[POST /v1/short-links]
  Client --> GET[GET /v1/short-links/{code}]
  Client --> LIST[GET /v1/users/{id}/links?cursor=]`,
    },
    {
      type: 'list',
      items: [
        'Spend 3–5 minutes listing 5–8 core endpoints only',
        'State auth: Bearer JWT, API key, session cookie',
        'Version prefix /v1/ for breaking changes later',
        'Webhooks or polling for async job completion',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'URL shortener API sketch',
      code: `POST /v1/links
  Body: { "url": "https://...", "custom_code": "optional" }
  Response 201: { "code": "abc12", "short_url": "..." }

GET /v1/links/{code}
  Response 302 Location or 200 { "url": "..." }

GET /v1/users/{userId}/links?cursor=xyz&limit=20
  Response 200: { "items": [...], "next_cursor": "..." }`,
    },
  ],
  tradeoffs: {
    advantages: ['Clear contract for clients', 'Maps to scalable resources', 'Interview time well spent'],
    disadvantages: ['REST not ideal for all (real-time, GraphQL)', 'Over-design in short interview'],
    alternatives: ['GraphQL for flexible reads', 'gRPC internal, REST external'],
    whenToUse: ['Most HLD interviews', 'Public platform APIs'],
    whenNotToUse: ['Pure streaming/video — add protocol layer'],
  },
  failureModes: [
    'Chatty API — N+1 calls for feed',
    'No pagination on list endpoints',
    'Missing idempotency on payments',
    'Inconsistent error schema',
    'Leaking internal DB ids',
  ],
  production: {
    scalability: ['Cursor pagination, field filtering', 'Rate limit expensive endpoints'],
    reliability: ['Idempotency keys, Retry-After on 503'],
    security: ['AuthZ per resource owner', 'Input validation, rate limits'],
    observability: ['Per-endpoint RED metrics', 'OpenAPI spec as contract'],
    maintainability: ['Versioning policy documented'],
  },
  interview: {
    expectations: ['5–8 endpoints', 'REST verbs', 'Pagination + auth mention'],
    commonQuestions: ['Design API for X?', 'Cursor vs offset?'],
    followUps: ['Idempotency on POST?', 'Versioning strategy?'],
    misconceptions: ['List every CRUD field', 'GraphQL required for senior'],
    traps: ['No pagination on timeline API'],
    strongSignals: ['Idempotency-Key', 'cursor pagination', 'async webhook for long jobs'],
  },
  keyTakeaways: [
    'List core resources and 5–8 endpoints — not every field.',
    'REST: nouns + HTTP methods; consistent error JSON.',
    'Cursor pagination for large feeds; idempotency on writes.',
    'Version /v1/; auth model stated upfront.',
    'Match API granularity to client use cases.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'POST vs PUT vs PATCH interview use?', answerHint: 'POST create; PUT replace; PATCH partial update — pick one pattern and stay consistent.' },
    { level: 'intermediate', question: 'Cursor vs offset pagination?', answerHint: 'Cursor stable for feeds/deep pages; offset simple but slow and inconsistent under writes.' },
    { level: 'advanced', question: 'API for long video transcode job?', answerHint: 'POST job returns 202 + job_id; GET /jobs/{id} status; webhook on complete; do not block POST until done.' },
  ],
  flashcards: [
    { front: 'Idempotency-Key', back: 'Header ensuring retry POST produces single side effect' },
    { front: 'Cursor pagination', back: 'Opaque token pointing to next page — stable under inserts' },
    { front: 'REST resource naming', back: 'Plural nouns /v1/orders not verb URLs' },
    { front: '202 Accepted', back: 'Async work started — client polls or webhook' },
  ],
  quickRevision: [
    '5–8 endpoints',
    'REST nouns',
    'Cursor pages',
    'Idempotency writes',
    '/v1/ version',
  ],
}
