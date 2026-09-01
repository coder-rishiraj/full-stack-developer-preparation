import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Caching stores copies of data closer to consumers (in-process, Redis, CDN) to reduce latency, load on origin databases, and cost. Patterns include cache-aside, read-through, write-through, write-behind, and TTL-based expiration with explicit invalidation.',
  whyExists:
    'Databases and remote services are slow and expensive at scale. Many reads are repetitive (product pages, session data, config). Caching trades freshness for speed — when done wrong you serve stale prices or leak private data across users.',
  mentalModel:
    'Check fast layer first. On miss, load from origin, populate cache, return. On write, update origin and invalidate or update cache. Every cache entry needs a TTL, invalidation story, and key namespace so tenants don’t collide.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Pattern', 'Read path', 'Write path'],
      rows: [
        ['Cache-aside (lazy)', 'App checks cache; on miss loads DB and sets cache', 'App writes DB; deletes cache key'],
        ['Read-through', 'Cache library loads from DB on miss', 'App writes DB; cache evicts/updates via policy'],
        ['Write-through', 'Cache always has latest after write', 'Write goes to cache + DB synchronously'],
        ['Write-behind', 'Reads from cache', 'Write to cache; async flush to DB — risk on crash'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Cache-aside read miss flow',
      diagram: `sequenceDiagram
  participant App
  participant Cache as Redis
  participant DB
  App->>Cache: GET product:42
  Cache-->>App: miss
  App->>DB: SELECT ...
  DB-->>App: row
  App->>Cache: SET product:42 TTL=300
  App-->>App: return`,
    },
    {
      type: 'list',
      items: [
        'TTL: bound staleness; combine with event invalidation for correctness',
        'Key design: tenant:user:resource:id — avoid giant values',
        'Stampede protection: singleflight / lock on miss',
        'Local L1 + distributed L2: watch consistency window',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Product detail page: CDN caches static assets; Redis caches JSON for product:42 with 5m TTL; on admin price update, publish invalidation event to purge CDN and DEL redis key.',
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Cache-aside with stampede guard',
      code: `async function getProduct(id: string): Promise<Product> {
  const key = \`product:\${id}\`
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached)

  return singleflight(key, async () => {
    const row = await db.products.findById(id)
    await redis.set(key, JSON.stringify(row), 'EX', 300)
    return row
  })
}`,
    },
  ],
  tradeoffs: {
    advantages: ['Lower p99 latency', 'Protects DB from read storms', 'CDN reduces bandwidth cost'],
    disadvantages: ['Stale data bugs', 'Cache invalidation is hard', 'Memory cost and hot keys'],
    alternatives: ['Read replicas instead of cache', 'Materialized views', 'Edge compute'],
    whenToUse: ['Read-heavy, tolerable staleness', 'Expensive aggregation queries', 'Static/semi-static content'],
    whenNotToUse: ['Strong consistency required without version checks', 'Highly personalized secret data without careful keys'],
  },
  failureModes: [
    'Thundering herd on expiry — many DB hits at once',
    'Cache penetration — queries for non-existent keys bypass cache forever',
    'Wrong TTL on auth/session data',
    'Cross-tenant key collision',
    'Redis outage without fallback plan',
  ],
  production: {
    performance: ['Size values; compress large blobs', 'Pipeline Redis commands'],
    scalability: ['Redis Cluster; consistent hash for sharding', 'CDN for global edge'],
    reliability: ['Circuit breaker to DB if cache down', 'Negative caching for missing keys'],
    security: ['Never cache per-user PII under shared key', 'Encrypt sensitive cache at rest if required'],
    observability: ['Hit rate, miss latency, evictions, memory', 'Stale-serving alerts on critical keys'],
    cost: ['Right-size Redis; TTL prevents unbounded growth'],
  },
  interview: {
    expectations: [
      'Explain cache-aside vs write-through',
      'Discuss invalidation and TTL tradeoffs',
      'Handle stampede and hot keys',
    ],
    commonQuestions: ['Design cache for news feed', 'Cache aside vs read through?'],
    followUps: ['Multi-level cache consistency?', 'Cache coherency across regions?'],
    misconceptions: ['Infinite TTL is fine', 'Cache replaces DB'],
    traps: ['Caching mutable inventory without invalidation on write'],
    strongSignals: ['Singleflight, negative cache, versioned keys', 'Explicit failure if Redis down for auth'],
  },
  keyTakeaways: [
    'Cache-aside most common: app manages populate + invalidate.',
    'Always define TTL + invalidation on writes.',
    'Protect miss storms: singleflight, jittered TTL, prewarm.',
    'Key namespace includes tenant/user scope.',
    'Measure hit rate; cache the right layer (CDN vs Redis vs local).',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why cache?',
      answerHint: 'Latency, throughput, reduce DB load, cost.',
    },
    {
      level: 'intermediate',
      question: 'Cache-aside vs write-through?',
      answerHint: 'Aside: lazy load; write-through: sync write cache+DB on every write.',
    },
    {
      level: 'advanced',
      question: 'Prevent cache stampede on hot key expiry?',
      answerHint: 'Singleflight, probabilistic early refresh, lock, stale-while-revalidate.',
    },
  ],
  flashcards: [
    { front: 'Cache-aside', back: 'App reads cache; on miss loads DB and sets cache; invalidates on write' },
    { front: 'Thundering herd', back: 'Many requests miss expired key simultaneously and hit DB' },
    { front: 'Negative caching', back: 'Cache “not found” briefly to stop repeated DB lookups' },
    { front: 'Stale-while-revalidate', back: 'Serve stale while async refresh — smoother latency' },
  ],
  quickRevision: [
    'Patterns: aside, read/write-through, behind',
    'TTL + explicit invalidation',
    'Singleflight / lock on miss',
    'Key: tenant:entity:id',
    'CDN edge + Redis + local L1',
  ],
  systemDesign: {
    problem: 'Add caching to a read-heavy API (100k RPS product reads, 500 writes/s) backed by PostgreSQL without serving stale prices after updates.',
    requirements: {
      functional: ['GET product by id', 'Admin updates price/stock metadata', 'Search unchanged'],
      nonFunctional: ['p99 read < 20ms', 'Price stale window < 5s after update', 'Survive Redis blip'],
    },
    scaleAssumptions: ['100k read RPS', '500 write RPS', '1M products'],
    capacityEstimates: [
      'Avg product JSON 2KB × 200k hot keys ≈ 400 MB Redis working set',
      '100k RPS to Redis cluster ~ few ms p99 in-region',
    ],
    api: [{ type: 'paragraph', text: 'Existing REST GET /products/{id}; POST admin update triggers invalidation' }],
    dataModel: [{ type: 'list', items: ['Redis: product:{id} → JSON + version field', 'Optional: product:version:{id} for cheap checks'] }],
    highLevelArchitecture: [
      {
        type: 'paragraph',
        text: 'API → Redis cache-aside → Postgres. On admin PUT, transaction commit then publish invalidation (DEL key or bump version). CDN for immutable assets only.',
      },
    ],
    diagram: {
      mermaid: `flowchart LR
  Client --> API
  API --> Redis[(Redis Cluster)]
  API --> PG[(PostgreSQL)]
  Admin --> API
  API -->|after commit| Bus[Invalidation pub/sub]
  Bus --> Redis`,
      caption: 'Write DB first, then invalidate cache',
    },
    dataFlow: [
      'Read: GET redis → miss → SELECT → SET ex 300',
      'Write: UPDATE postgres → COMMIT → DEL redis key / publish',
      'Optional: read version in cache; compare with DB on sensitive fields',
    ],
    storage: ['Redis Cluster 3+ nodes', 'Postgres remains source of truth'],
    caching: ['Primary topic — cache-aside + pub/sub invalidation + singleflight'],
    asyncProcessing: ['Invalidation fan-out via Redis pub/sub or Kafka consumer'],
    scaling: ['Shard Redis; horizontal API pods; all share Redis'],
    consistency: ['Cache aside = eventual; bound with TTL 300s + immediate invalidation on write'],
    reliability: ['Redis down → fall through to DB with rate limit', 'Do not write-only-cache'],
    failureScenarios: [
      'Invalidation lost → TTL bounds staleness',
      'Race: read repopulates old value after write — use version in SET or transactional outbox order',
    ],
    security: ['Public product data only in shared cache keys'],
    observability: ['Hit ratio, miss latency, invalidation lag'],
    bottlenecks: ['Hot product key — replicate read or local L1 with short TTL'],
    alternatives: ['Read-through proxy (Varnish, ORM second-level cache)'],
    tradeoffs: ['TTL-only simpler but stale up to TTL', 'Write-through higher write latency'],
    interviewFollowUps: ['Fix cache DB race on update?', 'Multi-region cache invalidation?'],
    evolution: [
      { stage: '1. Simple design', description: 'No cache — Postgres only.', bottleneck: 'DB CPU and p99 latency.' },
      { stage: '2. Improve', description: 'Redis cache-aside with TTL.', bottleneck: 'Stale price until TTL.' },
      { stage: '3. Improve', description: 'Invalidate on write + singleflight.', bottleneck: 'Hot keys.' },
      { stage: '4. Scale further', description: 'CDN static; L1 in-process; versioned keys; regional Redis.', bottleneck: 'Cross-region coherence.' },
    ],
  },
}
