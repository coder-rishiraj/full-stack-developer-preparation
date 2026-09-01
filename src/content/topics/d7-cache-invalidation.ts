import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Cache invalidation is removing or updating cached entries when source data changes so clients do not read stale values. Methods: explicit DELETE on write, TTL expiry, event-driven pub/sub invalidation, version bumps, and cache tags for group purge.',
  whyExists:
    "Phil Hardy's joke: only two hard things in CS — cache invalidation and naming. Without invalidation, users see old prices, revoked permissions cached, and inconsistent reads across pods. TTL alone means stale window up to TTL duration.",
  mentalModel:
    'Remove expired milk from fridge when warehouse recalls batch. Every write to truth (DB) triggers toss or relabel cached copies. TTL is backup when recall message lost.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Write path: UPDATE db → COMMIT → DEL redis key (or publish invalidation).',
        'Pub/sub: admin update → Kafka/Redis channel → all pods DEL local + Redis.',
        'Version key: cache stores {data, v:5}; write bumps v in DB; read compares.',
        'Tag invalidation: tag product:42 category:shoes — purge all shoes on category change.',
        'CDN purge API on static asset update.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Invalidate after commit',
      diagram: `sequenceDiagram
  participant App
  participant DB
  participant Cache
  App->>DB: UPDATE price COMMIT
  App->>Cache: DEL product:42
  Note over App,Cache: Never DEL before commit`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Price update transaction commits at T1. Invalidation DEL at T2. Reader between T0-T2 without TTL might see old price — TTL 60s plus immediate DEL minimizes window. Lost DEL caught when TTL expires.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Transactional outbox: invalidation event in same DB txn as update — reliable publish.',
        'Race: read repopulates stale after DEL before write visible — use version or short lock.',
        'L1 local cache needs broadcast invalidation across JVMs.',
        'Probabilistic early expiration reduces synchronized TTL expiry.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Fresh reads after writes', 'Bounded staleness with TTL backup'],
    disadvantages: ['Complex distributed invalidation', 'Event loss requires TTL', 'Thundering herd after mass purge'],
    alternatives: ['TTL only — simple stale window', 'No cache — always fresh slow'],
    whenToUse: ['Mutable data in cache-aside', 'CDN static with updates'],
    whenNotToUse: ['Immutable content — long TTL enough'],
  },
  failureModes: [
    'DEL before commit — cache miss loads old value then stuck until TTL',
    'Lost pub/sub message — stale until TTL',
    'Invalidate wrong key pattern — partial stale set',
    'Forgot L1 local cache on one pod',
    'Mass purge causes miss storm on DB',
  ],
  production: {
    reliability: ['Invalidate after commit; outbox pattern', 'TTL as safety net always'],
    observability: ['Invalidation lag metric', 'Stale read detection via version audit'],
    performance: ['Singleflight after mass invalidation', 'Jittered TTL'],
    scalability: ['Fan-out invalidation via message bus at scale'],
  },
  interview: {
    expectations: ['Delete on write', 'TTL backup', 'Race on read repopulate'],
    commonQuestions: ['Hardest caching problem?', 'Invalidate on product update?'],
    followUps: ['Multi-region invalidation?', 'Outbox pattern?'],
    misconceptions: ['TTL alone sufficient for price data', 'Invalidate before DB write'],
    traps: ['No invalidation on write path'],
    strongSignals: ['After commit DEL', 'Outbox event', 'Version compare', 'TTL backup'],
  },
  keyTakeaways: [
    'Invalidate cache on every successful write to source of truth.',
    'DEL after DB commit — never before.',
    'Pub/sub or outbox for multi-instance cache coherence.',
    'TTL bounds staleness when invalidation fails.',
    'Version keys detect stale cache entries.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why cache invalidation hard?', answerHint: 'Distributed copies; timing races; missed events; consistency vs performance.' },
    { level: 'intermediate', question: 'Product price update invalidation flow?', answerHint: 'Update DB commit; DEL cache key; optional pub/sub; TTL backup.' },
    { level: 'advanced', question: 'Read repopulates stale after DEL race?', answerHint: 'Version in cache; lock during write; read-through after commit only; short TTL.' },
  ],
  flashcards: [
    { front: 'Invalidate after commit', back: 'Delete cache only after DB transaction commits' },
    { front: 'Cache tag', back: 'Group keys purged together on related update' },
    { front: 'Transactional outbox', back: 'Invalidation event written in same DB txn as update' },
  ],
  quickRevision: [
    'DEL after commit',
    'Pub/sub fan-out',
    'TTL backup',
    'Version keys',
    'Outbox reliable',
  ],
}
