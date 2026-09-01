import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Distributed caching places shared cache nodes (Redis Cluster, ElastiCache, Hazelcast) between many app instances and databases. Provides consistent key namespace, replication, sharding across memory, and optional multi-AZ durability. Contrasts with local in-process caches (Caffeine) that are faster but inconsistent across nodes.',
  whyExists:
    'Single JVM cache duplicates data and diverges after writes. At scale, centralized Redis gives one invalidation target, shared rate limit counters, and session store. Multi-region adds replication lag and consistency trade-offs.',
  mentalModel:
    'L1 local optional for microsecond hits; L2 Redis for cross-node consistency. All writers invalidate same Redis keys. Cluster partitions keys by hash slot — design keys and hash tags for locality. Treat cache as disposable — DB remains source of truth.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Two-tier cache topology',
      diagram: `flowchart TB
  APP1[App instance 1] --> L1A[Local Caffeine]
  APP2[App instance 2] --> L1B[Local Caffeine]
  APP1 --> REDIS[(Redis Cluster)]
  APP2 --> REDIS
  REDIS --> DB[(Primary DB)]
  L1A -.short TTL.-> REDIS
  L1B -.short TTL.-> REDIS`,
    },
    {
      type: 'table',
      headers: ['Topology', 'Behavior', 'When'],
      rows: [
        ['Single Redis primary + replicas', 'Reads from replica OK for cache', 'Most apps; accept replication lag'],
        ['Redis Cluster', '16384 slots sharded', 'Large memory / throughput'],
        ['Multi-region active-passive', 'Write primary region; read local replica', 'Global apps; stale reads possible'],
        ['Client-side caching (Redis 6+)', 'Invalidation messages', 'Reduce network for hot keys'],
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Three API pods share product:{id} in Redis Cluster. Pod A updates price in DB and DEL key. Pod B local L1 may still serve old value until L1 TTL (30s) — use short L1 TTL or pub/sub local invalidation for price-sensitive data.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Redis Cluster: CRC16 slot; MOVED/ASK redirects from clients',
        'Hash tag {tenant}:user:1 and {tenant}:cart:1 same slot for multi-key transactions',
        'Replica read-your-writes not guaranteed — primary for critical reads after write',
        'Connection pooling (Lettuce) — one cluster-aware client per app',
        'Failover: replica promoted — brief unavailability window',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Shared state across instances', 'Horizontal memory scale via cluster', 'Central invalidation point'],
    disadvantages: ['Network hop vs local cache', 'Split brain / failover complexity', 'Multi-level staleness windows'],
    alternatives: ['DB read replicas only', 'CDN for static', 'Embedded Hazelcast data grid'],
    whenToUse: ['Horizontal app scale', 'Shared sessions/rate limits', 'Hot read offload'],
    whenNotToUse: ['Single small instance — local cache enough', 'Strong cross-field consistency without design'],
  },
  failureModes: [
    'Redis outage — all pods hammer DB',
    'Hot slot overloads one cluster node',
    'L1 + L2 inconsistency after write',
    'Cross-slot multi-key transaction failure',
    'Forgotten TTL — cluster memory full evicts hot keys randomly',
  ],
  production: {
    reliability: ['Fallback to DB with circuit breaker', 'Multi-AZ Redis with automatic failover'],
    performance: ['Connection pool tuning', 'Replica reads for cache-only tolerance'],
    observability: ['Cluster slot balance', 'Replication lag', 'Hit rate per service'],
    scalability: ['Reshard plan before 80% memory', 'Hash tag co-location for multi-key ops'],
  },
  interview: {
    expectations: ['L1 vs L2', 'Redis Cluster basics', 'Invalidation across nodes'],
    commonQuestions: ['Design distributed cache layer?', 'Redis Cluster vs single node?', 'Multi-region cache?'],
    followUps: ['Local cache staleness?', 'Session store pattern?'],
    misconceptions: ['Distributed cache is source of truth', 'Every pod can have independent cache forever'],
    traps: ['No plan when Redis down'],
    strongSignals: ['L1 short TTL, central invalidation, cluster hash tags, DB fallback'],
  },
  keyTakeaways: [
    'Distributed cache = shared Redis across app instances.',
    'Optional local L1 — watch staleness after writes.',
    'Redis Cluster shards by slot; use hash tags wisely.',
    'DB is source of truth; cache disposable.',
    'Plan Redis failure fallback and memory/eviction policy.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why Redis vs in-process cache at scale?', answerHint: 'Shared invalidation, sessions, rate counters consistent across all app nodes.' },
    { level: 'intermediate', question: 'Two-level cache inconsistency?', answerHint: 'Local L1 may lag after Redis invalidation — short L1 TTL or pub/sub local eviction.' },
    { level: 'advanced', question: 'Redis Cluster hash tags why?', answerHint: 'Multi-key ops must same slot; {userId} prefix co-locates related keys.' },
  ],
  flashcards: [
    { front: 'L1 vs L2 cache', back: 'Local in-process vs shared Redis — speed vs consistency' },
    { front: 'Redis Cluster slot', back: 'Key hashed to 1 of 16384 slots on nodes' },
    { front: 'Cache disposable', back: 'DB is source of truth — rebuild cache on loss' },
    { front: 'MOVED redirect', back: 'Cluster client follows slot migration to correct node' },
  ],
  quickRevision: ['Shared Redis layer', 'L1 short TTL', 'Cluster slots', 'Invalidate centrally', 'DB fallback'],
}
