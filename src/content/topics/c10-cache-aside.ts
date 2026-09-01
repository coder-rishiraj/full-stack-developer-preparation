import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Cache-aside (lazy loading) is the most common caching pattern: application checks cache first; on miss loads from database, populates cache, returns data. On write, update database then invalidate or update cache key. App owns cache logic — unlike read-through/write-through where cache library wraps store.',
  whyExists:
    'DB reads dominate many workloads. Cache-aside lets teams add Redis incrementally without changing DB drivers. Only hot keys get cached. Simple mental model for Spring services: @Cacheable optional wrapper or explicit Redis GET/SET in repository layer.',
  mentalModel:
    'App is the conductor: read cache → miss → read DB → set cache. Write DB → delete cache key (or update if safe). Stale data happens if invalidation missed — always pair with TTL as safety net.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Cache-aside read and write',
      diagram: `sequenceDiagram
  participant App
  participant Cache as Redis
  participant DB
  App->>Cache: GET key
  alt hit
    Cache-->>App: value
  else miss
    Cache-->>App: null
    App->>DB: SELECT
    DB-->>App: row
    App->>Cache: SET key EX ttl
  end
  App->>DB: UPDATE row
  App->>Cache: DEL key`,
    },
    {
      type: 'list',
      items: [
        'Invalidate (DEL) safer than update-on-write for complex objects',
        'TTL bounds staleness if invalidation event lost',
        'Singleflight / lock on miss prevents thundering herd',
        'Cache key namespace: tenant:entity:id',
        'Negative cache short TTL for known-miss keys (prevent DB hammer)',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Explicit cache-aside in service',
      code: `public Product getProduct(long id) {
  String key = "product:" + id;
  Product cached = redisTemplate.opsForValue().get(key);
  if (cached != null) return cached;

  Product p = productRepo.findById(id).orElseThrow();
  redisTemplate.opsForValue().set(key, p, Duration.ofMinutes(5));
  return p;
}

public void updateProduct(Product p) {
  productRepo.save(p);
  redisTemplate.delete("product:" + p.getId());
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Race: thread A miss loads stale DB while B updates — use version in value or transactional outbox invalidation',
        'Spring @Cacheable is cache-aside AOP — cache manager backs Redis',
        'Serialization format: JSON vs JDK serialization — prefer JSON for evolution',
        'Large values: compress or cache derived DTO not full entity graph',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Simple, explicit control', 'Cache only what you need', 'Works with any DB'],
    disadvantages: ['App must implement invalidation correctly', 'Stale window on miss+slow write race', 'Two code paths hit/miss'],
    alternatives: ['Read-through cache library', 'Write-through for strong consistency needs', 'CDN for static'],
    whenToUse: ['Read-heavy hot keys', 'Tolerable staleness with TTL', 'Gradual Redis adoption'],
    whenNotToUse: ['Strong consistency without version checks', 'Write-heavy with poor invalidation story'],
  },
  failureModes: [
    'Forgot DEL on write — stale forever until TTL',
    'Thundering herd on hot key expiry',
    'Caching null without negative cache — DB overload',
    'Cross-tenant key collision',
    'Redis down — need fallback to DB without cascading failure',
  ],
  production: {
    performance: ['Pipeline GET/SET', 'Right-size values', 'Jitter TTL to spread expiry'],
    reliability: ['Circuit breaker to DB', 'Singleflight on miss'],
    observability: ['Hit rate, miss latency, invalidation lag metrics'],
    security: ['Never cache secrets under shared keys', 'Tenant prefix on all keys'],
  },
  interview: {
    expectations: ['Read/write paths', 'Invalidation vs update', 'Stampede mitigation'],
    commonQuestions: ['Cache-aside flow?', 'Invalidate vs update cache?', 'Thundering herd?'],
    followUps: ['Compare read-through?', 'Event-driven invalidation?'],
    misconceptions: ['Cache replaces DB', 'Infinite TTL OK'],
    traps: ['No invalidation on write path'],
    strongSignals: ['DEL on write, TTL safety, singleflight, metrics, tenant keys'],
  },
  keyTakeaways: [
    'App checks cache; on miss loads DB and sets cache.',
    'On write: update DB then invalidate cache key.',
    'TTL is safety net — not sole consistency mechanism.',
    'Protect hot key expiry with singleflight/jitter.',
    'Most common pattern for Redis + RDBMS.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Describe cache-aside read path.', answerHint: 'GET cache; miss → query DB; SET cache; return.' },
    { level: 'intermediate', question: 'Update cache or delete on write?', answerHint: 'Usually DELETE (invalidate) — simpler; repopulate on next read avoids stale partial updates.' },
    { level: 'advanced', question: 'Thundering herd on expiry?', answerHint: 'Singleflight lock per key; probabilistic early refresh; jittered TTL.' },
  ],
  flashcards: [
    { front: 'Cache-aside', back: 'App manages cache lookup, populate on miss, invalidate on write' },
    { front: 'Invalidate vs update', back: 'DEL on write is simpler; update risks stale fields' },
    { front: 'Thundering herd', back: 'Many requests miss expired hot key simultaneously — use lock/singleflight' },
    { front: 'Negative cache', back: 'Cache short-lived null for known misses — stops repeat DB hits' },
  ],
  quickRevision: ['Check cache first', 'Miss→DB→SET', 'Write→DEL key', 'TTL + invalidation', 'Singleflight herd'],
}
