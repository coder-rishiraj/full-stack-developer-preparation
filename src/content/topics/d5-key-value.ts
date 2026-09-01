import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Key-value stores map opaque keys to values (strings, blobs, JSON) with O(1) get/put/delete semantics. No joins or rich queries on value contents by default. Examples: Redis, DynamoDB (key-partitioned), Riak, etcd. Optimized for speed, scale, and simple access patterns.',
  whyExists:
    'Many workloads need fast lookup by known key: sessions, feature flags, rate limit counters, user profiles by id. Relational overhead (parsing SQL, joins) unnecessary when access is always key → value.',
  mentalModel:
    'Distributed HashMap. Pick key design carefully — it determines partition and hot spots. Values can be JSON but query model is still get/put by key (Dynamo adds secondary indexes as extra cost).',
  howItWorks: [
    {
      type: 'table',
      headers: ['System', 'Persistence', 'Typical use'],
      rows: [
        ['Redis', 'In-memory (+ optional AOF/RDB)', 'Cache, sessions, pub/sub, rate limits'],
        ['DynamoDB', 'Durable replicated', 'Serverless app state, gaming profiles'],
        ['etcd', 'Strongly consistent KV', 'Config, leader election, locks'],
        ['Memcached', 'Ephemeral cache', 'Pure cache layer'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Partition by key hash',
      diagram: `flowchart LR
  K[user:42:session] --> Hash[Consistent hash]
  Hash --> N1[Node A]
  Hash --> N2[Node B]
  Get[GET key] --> Hash`,
    },
    {
      type: 'list',
      items: [
        'Key design: include tenant, entity type, id — avoid hot single key',
        'TTL common for cache/session keys',
        'Redis: rich data structures (hash, zset, stream)',
        'DynamoDB: partition key + optional sort key for range within partition',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'redis',
      caption: 'Session and rate limit',
      code: `SET session:abc123 "{user_id:42}" EX 3600
INCR ratelimit:42:2026081710
EXPIRE ratelimit:42:2026081710 3600`,
    },
  ],
  tradeoffs: {
    advantages: ['Extremely low latency', 'Horizontal scale by partitioning keys', 'Simple API'],
    disadvantages: ['No ad-hoc queries without secondary indexes', 'Hot key problem', 'Memory cost for Redis'],
    alternatives: ['Relational for complex queries', 'Document DB for nested docs with query'],
    whenToUse: ['Cache, sessions, locks, counters, feature flags', 'Known access by key'],
    whenNotToUse: ['Reporting across arbitrary attributes without index design'],
  },
  failureModes: [
    'Hot key overloads single partition/node',
    'Large values block network/memory',
    'Cache stampede on expiry',
    'Redis persistence misconfig → data loss on restart',
    'KEYS * in production Redis',
  ],
  production: {
    performance: ['Pipeline commands', 'Right-size values', 'Locality in same AZ'],
    scalability: ['Redis Cluster; Dynamo on-demand/auto scale', 'Split hot keys with suffix sharding'],
    reliability: ['Redis replication + persistence policy', 'Dynamo multi-AZ'],
    security: ['AUTH/ACL Redis', 'Encrypt sensitive values', 'No global keys for user data'],
    observability: ['Memory usage, evictions, command latency, hot key alerts'],
    cost: ['Redis memory vs Dynamo per-request pricing'],
  },
  interview: {
    expectations: ['Key design', 'Redis vs Dynamo', 'Hot key mitigation'],
    commonQuestions: ['Design session store?', 'Redis persistence modes?'],
    followUps: ['Dynamo partition/sort key?', 'Cache aside with Redis?'],
    misconceptions: ['Redis is always a database replacement', 'Any JSON blob belongs in KV'],
    traps: ['Single key for global counter at billions RPS'],
    strongSignals: ['Key sharding for hot keys', 'TTL strategy', 'Cluster topology'],
  },
  keyTakeaways: [
    'Get/put by key — fastest simple pattern.',
    'Key design = partition + hot spot behavior.',
    'Redis: memory cache + structures; Dynamo: durable scaled KV.',
    'Hot keys need sharding or local aggregation.',
    'Use relational/document when queries drive access.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Redis vs Postgres?', answerHint: 'Redis in-memory KV/cache; Postgres relational durable OLTP.' },
    { level: 'intermediate', question: 'DynamoDB partition key vs sort key?', answerHint: 'Partition distributes; sort key orders items within partition for range queries.' },
    { level: 'advanced', question: 'Mitigate hot key on viral post like counter?', answerHint: 'Shard counter key (likes:post:1:shard{n}), aggregate on read, or write-behind batch.' },
  ],
  flashcards: [
    { front: 'KV access model', back: 'Lookup by key only unless secondary index added' },
    { front: 'Hot key', back: 'Single key overloads one partition/node' },
    { front: 'Redis AOF vs RDB', back: 'AOF log every write; RDB periodic snapshots' },
    { front: 'etcd use', back: 'Strongly consistent config and coordination' },
  ],
  quickRevision: [
    'HashMap at scale',
    'Key design critical',
    'Redis cache/session',
    'Dynamo durable partition',
    'Hot key sharding',
  ],
  systemDesign: {
    problem: 'Design session and rate limiting layer for 200k RPS API using key-value store.',
    requirements: {
      functional: ['Session CRUD', 'Per-user rate limit 1000/min'],
      nonFunctional: ['p99 < 5ms', 'Survive node loss', 'Tenant isolation in keys'],
    },
    scaleAssumptions: ['200k RPS', '5M concurrent sessions'],
    capacityEstimates: ['~2KB/session × 5M ≈ 10GB+ → Redis Cluster'],
    api: [{ type: 'paragraph', text: 'Internal: GET/SET session keys; INCR rate keys' }],
    dataModel: [{ type: 'list', items: ['session:{tenant}:{session_id}', 'ratelimit:{tenant}:{user}:{minute_bucket}'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'Redis Cluster hash-tagged keys per tenant optional; replica for HA.' }],
    diagram: {
      mermaid: `flowchart TB
  API --> RC[Redis Cluster]
  RC --> S1[Shard 1]
  RC --> S2[Shard 2]
  RC --> S3[Shard N]`,
      caption: 'Horizontally sharded Redis',
    },
    dataFlow: ['Every request: GET session, INCR ratelimit with TTL'],
    storage: ['Redis with AOF everysec compromise'],
    caching: ['Is the cache layer'],
    asyncProcessing: ['None on hot path'],
    scaling: ['Add shards; split hot tenants'],
    consistency: ['Session eventual across replicas briefly — prefer primary read for session'],
    reliability: ['Cluster failover; persistence tradeoff documented'],
    failureScenarios: ['Shard down → redirect; rate limit fail-open vs closed policy'],
    security: ['Random session ids', 'TLS in transit'],
    observability: ['Latency, memory, evictions, hot key'],
    bottlenecks: ['Celebrity user rate key — shard buckets'],
    alternatives: ['DynamoDB for serverless ops'],
    tradeoffs: ['Fail-open rate limit vs availability'],
    interviewFollowUps: ['Session fixation?', 'Redis down?'],
    evolution: [
      { stage: '1. Simple design', description: 'Single Redis.', bottleneck: 'Memory + HA.' },
      { stage: '2. Improve', description: 'Cluster + replicas.', bottleneck: 'Hot keys.' },
      { stage: '3. Improve', description: 'Key sharding for limits.', bottleneck: 'Cross-shard session rare if keyed by session id.' },
      { stage: '4. Scale further', description: 'Local in-process rate limit + Redis sync.', bottleneck: 'Complexity.' },
    ],
  },
}
