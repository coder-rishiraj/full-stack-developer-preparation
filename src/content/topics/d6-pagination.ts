import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'API pagination splits large collections into pages returned across multiple requests using offset/limit, page numbers, or cursor (keyset) tokens. Cursor pagination uses opaque pointer to last seen item — stable under concurrent inserts unlike offset.',
  whyExists:
    'Returning 10M rows in one JSON response crashes clients and servers. Pagination bounds payload, memory, and DB cost. Public APIs require predictable list endpoints with navigation metadata.',
  mentalModel:
    'Bookmark where you stopped. Offset: "skip 1000 take 20" — slow at deep pages. Cursor: "give 20 after (created_at, id) > last" — index-friendly and consistent when data shifts.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Style', 'Params', 'Pros/cons'],
      rows: [
        ['Offset', '?offset=100&limit=20', 'Simple; bad deep offset cost; duplicates/skips on churn'],
        ['Page', '?page=6&size=20', 'UX friendly; same offset issues'],
        ['Cursor/keyset', '?cursor=eyJ...&limit=20', 'Stable, fast; no random jump to page 500'],
        ['Link header', 'Link: rel=next', 'RFC 5988 navigation without parsing body'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Cursor vs offset under insert',
      diagram: `sequenceDiagram
  participant C as Client
  participant API
  Note over API: New row inserted at top during paging
  C->>API: offset=20 limit=10
  C->>API: offset=30 limit=10
  Note over C: Offset may skip or duplicate rows
  C->>API: cursor=last_seen_token
  Note over C: Keyset stable relative to sort key`,
    },
    {
      type: 'list',
      items: [
        'Always cap limit max (e.g. 100) server-side',
        'Sort tie-breaker: ORDER BY created_at, id DESC',
        'Encode cursor as opaque base64 of sort keys — not guessable offsets',
        'Return has_next / next_cursor in response envelope',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Cursor pagination response',
      code: `GET /v1/orders?limit=20&cursor=eyJjcmVhdGVkX2F0IjoiLi4uIiwiaWQiOi4uLiJ9

200 OK
{
  "data": [ ...20 orders... ],
  "pagination": {
    "next_cursor": "eyJ...",
    "has_next": true
  }
}`,
    },
  ],
  tradeoffs: {
    advantages: ['Cursor: performance + consistency', 'Offset: jump to page number for admin UI'],
    disadvantages: ['Cursor: no arbitrary page N without walking', 'Offset: DB OFFSET cost O(n)'],
    alternatives: ['GraphQL connections spec (edges/cursors)', 'Export job for full dump'],
    whenToUse: ['Cursor: infinite scroll, feeds, public APIs', 'Offset: small tables admin tools'],
    whenNotToUse: ['Offset on billion-row table deep pages'],
  },
  failureModes: [
    'Unbounded limit=999999 DoS',
    'Cursor tampering exposing other data if not auth-filtered',
    'Missing tie-breaker id → unstable order',
    'Offset pagination in UI with live data duplicates',
  ],
  production: {
    performance: ['Index matches ORDER BY columns', 'Avoid COUNT(*) on huge tables for total — approximate or omit'],
    security: ['Cursor scoped to authenticated tenant filter embedded'],
    observability: ['Track p99 list query latency', 'Deep offset abuse alerts'],
    maintainability: ['Consistent pagination envelope across endpoints'],
  },
  interview: {
    expectations: ['Cursor vs offset tradeoffs', 'Keyset implementation', 'Max limit cap'],
    commonQuestions: ['Paginate 100M row table?', 'Return total count?'],
    followUps: ['Bidirectional cursor?', 'Pagination + filter combined?'],
    misconceptions: ['Offset free on large tables', 'Cursor needs OFFSET internally'],
    traps: ['ORDER BY non-indexed column at scale'],
    strongSignals: ['Composite sort key cursor', 'Link rel=next headers', 'No deep offset in public API'],
  },
  keyTakeaways: [
    'Prefer cursor/keyset for large or live collections.',
    'Offset OK for small/admin with stable data.',
    'Cap limit; index sort columns + tie-breaker id.',
    'Opaque cursor encodes last position.',
    'Total count optional and expensive — document omission.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why pagination?', answerHint: 'Bound response size, memory, DB load.' },
    { level: 'intermediate', question: 'Cursor vs offset?', answerHint: 'Cursor stable/fast via keyset; offset slow deep and inconsistent under inserts.' },
    { level: 'advanced', question: 'Implement cursor for ORDER BY created_at DESC?', answerHint: 'WHERE (created_at, id) < (last_created, last_id) LIMIT n; encode last keys in cursor.' },
  ],
  flashcards: [
    { front: 'Keyset pagination', back: 'Fetch rows after cursor sort keys — no OFFSET scan' },
    { front: 'Offset problem', back: 'O(offset) scan cost; rows shift between pages' },
    { front: 'Tie-breaker id', back: 'Stable ordering when sort column duplicates' },
    { front: 'Max limit cap', back: 'Server rejects limit>100 preventing DoS' },
  ],
  quickRevision: [
    'Cursor > offset at scale',
    'Index sort keys',
    'Opaque cursor token',
    'Cap limit',
    'has_next metadata',
  ],
  systemDesign: {
    problem: 'Design pagination for activity feed API (100M events/user history) with infinite scroll mobile client.',
    requirements: {
      functional: ['List user activities newest first', 'Infinite scroll', 'Filter by type optional'],
      nonFunctional: ['p99 < 100ms', 'No duplicate/skip on new posts during scroll'],
    },
    scaleAssumptions: ['10k events/user avg', '5k list RPS'],
    capacityEstimates: ['Index (user_id, created_at DESC, id DESC)'],
    api: [{ type: 'code', language: 'http', code: `GET /v1/users/me/activities?limit=30&cursor=...\n&types=comment,like optional` }],
    dataModel: [{ type: 'list', items: ['activities(user_id, created_at, id, type, payload)', 'Composite index for keyset'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'Cursor keyset only; no offset; optional Redis cache first page.' }],
    diagram: {
      mermaid: `flowchart LR
  Client --> API
  API --> Idx[(Index seek keyset)]
  Idx --> Page[30 rows + next_cursor]`,
      caption: 'Index seek without OFFSET',
    },
    dataFlow: ['Decode cursor → keyset query → encode next from last row'],
    storage: ['Postgres or Cassandra partition by user_id'],
    caching: ['Cache page1 per user short TTL'],
    asyncProcessing: ['None on read path'],
    scaling: ['Shard by user_id if needed'],
    consistency: ['Eventual new items appear on refresh top — acceptable'],
    reliability: ['Invalid cursor → 400 Bad Request'],
    failureScenarios: ['Hot celebrity user — dedicated cache + rate limit'],
    security: ['Cursor cannot escape user_id scope'],
    observability: ['List latency, cursor error rate'],
    bottlenecks: ['Very active user index size — archive old activities'],
    alternatives: ['Feed fan-out on write for celebrities'],
    tradeoffs: ['Archive old vs unlimited history cost'],
    interviewFollowUps: ['Jump to date?', 'Total count badge?'],
    evolution: [
      { stage: '1. Simple design', description: 'offset/limit.', bottleneck: 'Slow + skips.' },
      { stage: '2. Improve', description: 'Keyset cursor.', bottleneck: 'Hot users.' },
      { stage: '3. Improve', description: 'Archive + cache page1.', bottleneck: 'Filter+pagination index design.' },
      { stage: '4. Scale further', description: 'Fan-out feed for whales.', bottleneck: 'Write amplification fan-out.' },
    ],
  },
}
