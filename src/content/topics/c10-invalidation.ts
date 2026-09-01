import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Cache invalidation removes or updates stale cache entries when underlying data changes. Strategies: delete key on write (cache-aside), TTL expiry, event-driven purge (Kafka message → DEL keys), versioned keys (product:42:v7), and write-through updating cache synchronously. Famous hard problem — combine tactics.',
  whyExists:
    'Cached data becomes wrong after DB updates unless invalidated. Wrong prices, permissions, or inventory cause revenue loss and security bugs. TTL alone means stale window; invalidation alone fails if message lost — need both.',
  mentalModel:
    'Every write path needs a cache story: which keys die? Broadcast invalidation events to all regions. Version bump avoids DEL race — readers with old version miss and reload. TTL is backup when invalidation fails.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Strategy', 'Mechanism', 'Pros/cons'],
      rows: [
        ['Delete on write', 'DB commit then Redis DEL', 'Simple; miss storm if hot key'],
        ['TTL only', 'Expire after N seconds', 'Easy; guaranteed staleness window'],
        ['Event-driven', 'Domain event → invalidation worker', 'Decoupled; at-least-once duplicates OK'],
        ['Versioned keys', 'Cache key includes version column', 'No DEL race; need version on entity'],
        ['Write-through', 'Update cache in same transaction path', 'Fresher; write latency + coupling'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Event-driven invalidation',
      diagram: `sequenceDiagram
  participant S as Order service
  participant DB
  participant K as Kafka
  participant W as Cache invalidator
  participant R as Redis
  S->>DB: UPDATE product stock
  S->>K: ProductUpdated{id}
  K->>W: consume event
  W->>R: DEL product:42`,
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Versioned cache key avoids stale read after concurrent write',
      code: `// Entity has version field incremented on update
String key = "product:" + id + ":v" + product.getVersion();
redis.set(key, product, ttl);

// After update version 8→9, old key v8 orphaned until TTL; new reads use v9`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Cache aside race: read miss loads old DB before write commits — use versioning or short lock',
        'Pattern delete product:* expensive — maintain reverse index set of keys per entity',
        'CDN invalidation separate API — purge by URL/tag on product update',
        'Spring @CacheEvict on service update method',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Fresh data when correct', 'Event decoupling scales teams', 'Version keys reduce races'],
    disadvantages: ['Complexity on every write path', 'Fan-out invalidation storms', 'Miss latency after mass DEL'],
    alternatives: ['Short TTL only for low-stakes data', 'Materialized view refreshed periodically'],
    whenToUse: ['Mutable data in cache', 'Price/inventory/permissions'],
    whenNotToUse: ['Immutable content — TTL or infinite OK'],
  },
  failureModes: [
    'Invalidation event lost — stale until TTL',
    'DEL wrong key pattern — cache empty + DB overload',
    'Forgot invalidation on one code path',
    'Multi-region: invalidate only local Redis',
    'Update cache partial fields — inconsistent object graph',
  ],
  production: {
    reliability: ['TTL as safety net always', 'Idempotent invalidation consumer', 'Retry DLQ for failed purge'],
    observability: ['Staleness detection via version mismatch metrics', 'Track invalidation lag'],
    performance: ['Batch DEL pipeline', 'Avoid KEYS * in prod — use SCAN or key registry'],
    maintainability: ['Document key catalog per entity type'],
  },
  interview: {
    expectations: ['Delete vs TTL vs events', 'Thundering herd after purge', 'Versioned keys'],
    commonQuestions: ['Hardest part of caching?', 'Invalidate across microservices?', 'CDN + Redis together?'],
    followUps: ['Race on cache-aside?', 'Write-through vs invalidate?'],
    misconceptions: ['TTL alone sufficient for inventory', 'One global flush acceptable'],
    traps: ['No invalidation on secondary update APIs'],
    strongSignals: ['Event-driven + TTL backup, version keys, key naming doc, herd mitigation'],
  },
  keyTakeaways: [
    'Every write path must invalidate or version cache keys.',
    'TTL backs up when invalidation fails.',
    'Event-driven purge scales across services.',
    'Versioned keys reduce stale read races.',
    'Combine Redis + CDN invalidation for full stack.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why cache invalidation hard?', answerHint: 'Many keys/paths/regions; missed invalidation serves stale; races on read during write.' },
    { level: 'intermediate', question: 'Delete key vs update cache on write?', answerHint: 'Delete simpler — next read reloads full fresh object; update risks partial stale fields.' },
    { level: 'advanced', question: 'Cross-service invalidation design?', answerHint: 'Domain events (ProductUpdated) consumed by cache worker; idempotent DEL; TTL safety; version in key optional.' },
  ],
  flashcards: [
    { front: 'Cache invalidation', back: 'Remove/update stale entries when source data changes' },
    { front: 'TTL as safety net', back: 'Bounds staleness if invalidation event lost' },
    { front: 'Versioned cache key', back: 'Include entity version — old keys naturally miss' },
    { front: 'Thundering herd after purge', back: 'Many concurrent misses — singleflight refresh' },
  ],
  quickRevision: ['Invalidate every write', 'TTL backup', 'Domain events', 'Version keys', 'Avoid KEYS *'],
}
