import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Caching strategies define how data enters and leaves cache relative to origin: cache-aside (lazy load), read-through, write-through, write-behind, and refresh-ahead. Cache invalidation removes or updates stale entries when source data changes — the hard part of caching.',
  whyExists:
    'Wrong strategy serves stale prices, loses writes on crash, or doubles database load. Strategy choice depends on read/write ratio, consistency tolerance, and who owns populate logic (app vs cache library).',
  mentalModel:
    'Library rules: when to check shelf (cache), when to fetch warehouse (DB), when to toss old copies (invalidate). Cache-aside: app manages both; write-through: cache and DB update together.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Strategy', 'Read', 'Write', 'Consistency'],
      rows: [
        ['Cache-aside', 'App reads cache; miss loads DB and sets', 'App writes DB; deletes cache key', 'Eventual — TTL + invalidation'],
        ['Read-through', 'Cache loads on miss automatically', 'App writes DB; cache evicts', 'Eventual'],
        ['Write-through', 'Always from cache after write', 'Write cache + DB sync', 'Stronger read-after-write'],
        ['Write-behind', 'From cache', 'Write cache; async flush DB', 'Risk on crash — fast writes'],
        ['Refresh-ahead', 'Serve stale while async refresh near TTL', 'Invalidate on admin write', 'Bounded staleness'],
      ],
    },
    {
      type: 'list',
      items: [
        'TTL bounds worst-case staleness.',
        'Event invalidation: publish ProductUpdated → consumers DEL key.',
        'Versioned keys: product:42:v7 — compare version not full invalidation.',
        'Cache-aside most common in app code with Redis.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Product catalog cache-aside: GET checks Redis; miss queries Postgres and SET ex 300. Admin PUT updates DB, commits, publishes invalidation event; all API pods DEL product:42. TTL 5m catches missed invalidation.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Thundering herd on expiry — singleflight lock on miss.',
        'Negative cache: cache "not found" briefly against penetration.',
        'Two-tier L1 in-process + L2 Redis — invalidation both layers.',
        'ORM second-level cache — know invalidation semantics.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Lower latency and DB load', 'Flexible per use case strategy'],
    disadvantages: ['Invalidation complexity', 'Stale reads if wrong strategy', 'Write-behind durability risk'],
    alternatives: ['Read replicas without cache', 'CDN for static only'],
    whenToUse: ['Read-heavy with tolerable staleness', 'Expensive aggregations'],
    whenNotToUse: ['Strong consistency financial balance without versioning'],
  },
  failureModes: [
    'Invalidate before DB commit — reader repopulates stale',
    'Lost invalidation event — stale until TTL',
    'Write-behind crash before flush — data loss',
    'Cache only without DB write — lost source of truth',
    'Hot key no TTL jitter — synchronized expiry stampede',
  ],
  production: {
    performance: ['Singleflight on miss', 'Jittered TTL'],
    reliability: ['Invalidate after commit; transactional outbox for events'],
    observability: ['Hit rate, miss latency, invalidation lag'],
    cost: ['Right-size Redis; TTL prevents unbounded growth'],
  },
  interview: {
    expectations: ['Cache-aside vs write-through', 'Invalidation on update', 'TTL role'],
    commonQuestions: ['Design product page cache?', 'Cache aside vs read through?'],
    followUps: ['Stampede on expiry?', 'Multi-level cache?'],
    misconceptions: ['Infinite TTL OK', 'Cache replaces DB writes in aside pattern'],
    traps: ['Delete cache before DB transaction commits'],
    strongSignals: ['Invalidate after commit', 'TTL safety net', 'Version keys'],
  },
  keyTakeaways: [
    'Cache-aside: app loads and invalidates — most common.',
    'Write-through: synchronous cache+DB on write.',
    'Invalidate or version on every mutating write.',
    'TTL caps staleness when invalidation lost.',
    'Singleflight prevents miss stampede.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Cache-aside flow?', answerHint: 'Read cache; miss read DB set cache; write DB delete cache.' },
    { level: 'intermediate', question: 'Cache-aside vs write-through?', answerHint: 'Aside lazy populate; write-through sync writes cache and DB together.' },
    { level: 'advanced', question: 'Race: invalidate then reader stale repopulate?', answerHint: 'Delete after commit; version in cache; brief lock; transactional ordering.' },
  ],
  flashcards: [
    { front: 'Cache-aside', back: 'Application manages cache populate and invalidation' },
    { front: 'Write-through', back: 'Write updates cache and DB synchronously' },
    { front: 'Refresh-ahead', back: 'Proactively refresh before TTL expiry' },
  ],
  quickRevision: [
    'Aside lazy load',
    'Invalidate on write',
    'TTL safety net',
    'Singleflight miss',
    'Commit before DEL',
  ],
}
