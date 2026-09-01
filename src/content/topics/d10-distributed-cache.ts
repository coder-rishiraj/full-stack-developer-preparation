import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A distributed cache is a horizontally scaled in-memory (or fast) data store shared across application instances — reducing database load and latency via replication, sharding, and eviction policies.',
  whyExists:
    'Single-host caches do not share state across pods; database becomes the bottleneck for hot keys. Distributed caches (Redis Cluster, Memcached pool) provide shared, low-latency reads/writes with TTL and optional persistence.',
  mentalModel:
    'Clients hash keys to shards (consistent hashing). Each shard is a primary with replicas. Cache-aside: app reads cache → on miss load DB → populate. Writes invalidate or update cache. Expect stale reads unless coordinated.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Partition key space across nodes via hash slot (Redis 16384 slots). Replication for HA. Eviction: LRU/LFU when memory full. Optional persistence (RDB/AOF) trades durability for speed. Client libraries handle MOVED/ASK redirects in cluster mode.',
    },
    {
      type: 'mermaid',
      caption: 'Cache-aside pattern',
      diagram: `sequenceDiagram
  participant App
  participant Cache
  participant DB
  App->>Cache: GET key
  alt hit
    Cache-->>App: value
  else miss
    Cache-->>App: null
    App->>DB: SELECT
    DB-->>App: row
    App->>Cache: SET key TTL
  end`,
    },
  ],
  example: [
    {
      type: 'code',
      language: 'text',
      caption: 'Redis cluster slot routing',
      code: `key "user:42" → CRC16 mod 16384 → slot 9842 → node B
Client receives MOVED 9842 node-b:6379 if topology changed`,
    },
  ],
  keyTakeaways: [
    'Consistent hashing minimizes remapping on node add/remove.',
    'Cache-aside is default; write-through for stronger consistency needs.',
    'Hot keys need replication reads or local L1 + shared L2.',
    'TTL prevents unbounded growth; define eviction under memory pressure.',
    'Evolve: local Guava → Redis single → Redis Cluster + hot-key fixes.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Cache-aside vs read-through?',
      answerHint: 'Cache-aside: app manages load; read-through: cache loads on miss automatically.',
    },
    {
      level: 'intermediate',
      question: 'What happens when a cache node dies?',
      answerHint: 'Replica promote; brief unavailability; thundering herd on cold cache — use singleflight.',
    },
    {
      level: 'advanced',
      question: 'Design cache for 1M QPS on one hot key?',
      answerHint: 'Local replica cache, key splitting (hot_key_1..N), or read replicas of cache shard.',
    },
  ],
  flashcards: [
    { front: 'Thundering herd fix', back: 'Singleflight / lock per key on miss; stale-while-revalidate' },
    { front: 'Redis Cluster slots', back: '16384 hash slots mapped to masters' },
    { front: 'Cache stampede', back: 'Many misses simultaneously — probabilistic early expiry, mutex' },
  ],
  quickRevision: [
    'Consistent hashing + replicas',
    'Cache-aside + TTL',
    'Hot key: local L1 or split keys',
    'Eviction LRU/LFU',
    'Invalidate on write or short TTL',
    'Monitor hit ratio and latency',
  ],
  systemDesign: {
    problem:
      'Design a distributed cache layer for a social feed service: 1M RPS reads, 100 GB working set, sub-ms p99 in-region, survive node failures.',
    requirements: {
      functional: [
        'GET/SET/DEL with TTL',
        'Atomic INCR for counters',
        'Optional pub/sub for invalidation fan-out',
      ],
      nonFunctional: [
        'p99 < 1ms in-region for hits',
        '99.99% availability',
        'Linear scale-out by adding nodes',
        'Graceful degradation on partition',
      ],
    },
    scaleAssumptions: [
      '1M RPS peak, 80% hit ratio target',
      '100 GB active set; 200M keys avg 500 B',
      '20k write/s (invalidations + updates)',
    ],
    capacityEstimates: [
      '1M RPS × 500 B ≈ 500 MB/s network per region (mitigated by local L1)',
      '100 GB / 32 GB RAM nodes ≈ 4+ masters with replicas (2× for HA)',
      'Miss path 200k/s → DB must absorb or singleflight reduces spike',
    ],
    api: [
      {
        type: 'code',
        language: 'text',
        code: `GET key → value | MISS
SET key value EX ttl
DEL key
INCR key`,
      },
    ],
    dataModel: [
      {
        type: 'list',
        items: [
          'Key-value with TTL metadata',
          'Cluster topology: slot → node map',
          'Optional: version stamp for optimistic coherence',
        ],
      },
    ],
    highLevelArchitecture: [
      {
        type: 'paragraph',
        text: 'Redis Cluster with N masters and replicas per AZ. App servers use cluster-aware client. Optional local Caffeine L1 (100ms TTL) for ultra-hot keys. Invalidation via Kafka topic consumed by all app pods.',
      },
    ],
    diagram: {
      mermaid: `flowchart TB
  App1[App Pod] --> L1[Local L1 Cache]
  L1 --> RC[Redis Cluster]
  RC --> M1[(Master 1)]
  RC --> M2[(Master 2)]
  M1 --> R1[(Replica)]
  Inv[Invalidation Bus] --> App1
  Inv --> App2[App Pod]`,
      caption: 'L1 + Redis Cluster + invalidation fan-out',
    },
    dataFlow: [
      'Read: L1 → Redis GET → on miss DB + SET with jitter TTL',
      'Write: DB commit → DEL cache key or publish invalidation',
      'Hot key: read from local replica or randomized sub-keys',
    ],
    storage: [
      'In-memory Redis with optional AOF everysec',
      'No disk as source of truth — DB remains canonical',
    ],
    caching: [
      'This IS the cache layer; L1 is optional second tier',
      'Stale-while-revalidate for non-critical reads',
    ],
    asyncProcessing: [
      'Warm cache jobs after deploy',
      'Async invalidation via message bus for multi-datacenter',
    ],
    scaling: [
      'Add shards; reshard with slot migration',
      'Read scaling via replicas ( eventual replica lag OK for many use cases)',
    ],
    consistency: [
      'Cache-aside: eventual; stale reads until TTL/invalidation',
      'Write-through or transactional outbox for stricter needs',
    ],
    reliability: [
      'Replica failover automatic (Redis Sentinel or K8s operator)',
      'Circuit breaker to DB when cache cluster unhealthy',
    ],
    failureScenarios: [
      'Node loss → replica promote; partial slot unavailable briefly',
      'Hot key overloads one shard → split key or local cache',
      'Mass expiry → thundering herd → stagger TTL with jitter',
    ],
    security: [
      'TLS in transit; ACL per service',
      'Do not cache secrets without encryption',
      'Network isolate cache VPC',
    ],
    observability: [
      'Hit/miss ratio, evicted keys/sec',
      'Latency per command type',
      'Memory usage and fragmentation',
    ],
    bottlenecks: [
      'Single hot key on one slot',
      'CROSSSLOT multi-key ops in cluster',
      'Large values (> 1 MB) block network',
    ],
    alternatives: [
      'Memcached (simpler, no persistence)',
      'Hazelcast embedded grid',
      'CDN for static cacheable HTTP',
    ],
    tradeoffs: [
      'Redis persistence vs pure speed',
      'L1 staleness vs Redis load reduction',
      'Strong invalidation vs TTL simplicity',
    ],
    interviewFollowUps: [
      'How reshard without downtime?',
      'Cache penetration / negative caching?',
      'Multi-region cache coherence?',
    ],
    evolution: [
      {
        stage: '1. Simple design',
        description: 'Per-app in-memory HashMap cache.',
        bottleneck: 'No sharing; inconsistent across pods.',
      },
      {
        stage: '2. Improve',
        description: 'Single Redis with cache-aside + TTL.',
        bottleneck: 'Single node memory and CPU ceiling.',
      },
      {
        stage: '3. Improve',
        description: 'Redis Cluster sharded; replicas; invalidation bus.',
        bottleneck: 'Hot keys; cross-slot transactions.',
      },
      {
        stage: '4. Scale further',
        description: 'L1 + hot-key splitting + multi-region read replicas with async invalidation.',
        bottleneck: 'Coherence complexity across regions.',
      },
    ],
  },
  tradeoffs: {
    advantages: ['Massive read offload', 'Sub-ms latency', 'Simple TTL semantics'],
    disadvantages: ['Stale data', 'Hot key pain', 'Another failure domain'],
    alternatives: ['DB read replicas only', 'Application-local cache'],
    whenToUse: ['Read-heavy hot keys', 'Session store', 'Rate limit counters'],
    whenNotToUse: ['Strong consistency required without careful design'],
  },
  failureModes: [
    'Cache stampede after expiry',
    'Forgotten invalidation → long stale reads',
    'Hot key melting one shard',
  ],
  production: {
    performance: ['Pipeline commands; avoid huge values'],
    scalability: ['Consistent hashing; replica reads'],
    reliability: ['Sentinel/operator failover; jitter TTL'],
    security: ['ACLs, TLS, no PII without policy'],
    observability: ['Hit ratio SLO, slowlog'],
    cost: ['RAM-heavy; right-size eviction policy'],
  },
  interview: {
    expectations: [
      'Cache-aside flow with TTL and invalidation',
      'Consistent hashing and cluster scaling',
      'Hot key and thundering herd mitigations',
    ],
    commonQuestions: ['Design distributed cache', 'Redis vs Memcached'],
    followUps: ['Cache avalanche?', 'Multi-region?'],
    misconceptions: ['Cache replaces need for DB capacity planning'],
    traps: ['No TTL on unbounded keys'],
    strongSignals: ['Singleflight, jitter TTL, hot-key split, MOVED redirects'],
  },
}
