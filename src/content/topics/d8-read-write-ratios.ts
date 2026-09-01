import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Read/write ratio describes the proportion of database or API operations that read versus mutate data — e.g. 100:1 for social feeds, 1:1 for banking ledger, 10:1 for e-commerce catalog. The ratio drives caching strategy, replication topology, and storage engine choice.',
  whyExists:
    'Read-heavy workloads scale with replicas and caches; write-heavy workloads hit leader bottlenecks and consistency costs. Wrong assumption (treating Twitter as write-heavy) leads to wrong architecture — sharding writes vs adding read replicas.',
  mentalModel:
    'Library vs suggestion box. Mostly reading books (read-heavy) → many copies on shelves (replicas, CDN). Mostly submitting forms (write-heavy) → single intake queue with careful ordering (strong consistency, partition writes).',
  howItWorks: [
    {
      type: 'table',
      headers: ['Profile', 'Typical ratio', 'Architecture bias'],
      rows: [
        ['Social feed', '100:1 read:write', 'Read replicas, heavy cache, CQRS'],
        ['Analytics ingest', '1:100 read:write', 'Append-only log, column store, batch read'],
        ['E-commerce catalog', '10:1', 'CDN + Redis read cache, write-through admin'],
        ['Banking ledger', '1:1 to 2:1', 'Strong consistency, few replicas, careful sharding'],
        ['URL shortener', '100:1', 'Cache redirect lookup, rare create'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Read-heavy path',
      diagram: `flowchart LR
  W[Write 1%] --> Primary[(Primary DB)]
  R[Read 99%] --> Cache[Redis/CDN]
  Cache -->|miss| Replica[(Read replicas)]`,
    },
    {
      type: 'list',
      items: [
        'Measure ratio at DB layer not API — API cache hides true DB ratio',
        'Write-heavy: shard by key, async indexing for reads',
        'Read-heavy: eventual consistency on replicas often acceptable',
        'Ratio shifts during events — flash sale writes spike temporarily',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'News feed: user posts once/day (write) but scrolls 200 feed loads (read) → ~200:1. Architecture: write path to primary + fan-out to feed cache; read from Redis precomputed timelines. DB sees mostly write + cache miss, not 200× read on primary.',
    },
  ],
  tradeoffs: {
    advantages: ['Right architecture for access pattern', 'Cost optimization (replicas vs shards)'],
    disadvantages: ['Ratio changes over product lifecycle', 'Aggregates hide hot write keys'],
    alternatives: ['Measure in prod rather than assume'],
    whenToUse: ['Capacity planning', 'SQL vs NoSQL choice', 'Cache/replica sizing'],
    whenNotToUse: ['Uniform CRUD admin tool — measure first'],
  },
  failureModes: [
    'Added read replicas for write-heavy workload — no help',
    'Cached reads hide write bottleneck until black Friday',
    'Assumed 10:1 but viral create-heavy feature launches',
    'Read-your-writes violated on async replica for profile update',
    'Single hot write key — ratio irrelevant shard skew',
  ],
  production: {
    scalability: ['Read-heavy: replicas + cache', 'Write-heavy: partition + queue'],
    performance: ['Separate read and write connection pools'],
    reliability: ['Write path HA; read degrade to stale OK if documented'],
    observability: ['Read/write QPS metrics separately', 'Replica lag on read path'],
    cost: ['Do not over-provision replicas if write-bound'],
  },
  interview: {
    expectations: ['Typical ratios by domain', 'Implication for cache vs shard', 'CQRS for skew'],
    commonQuestions: ['Twitter read/write ratio?', 'Design for 1000:1 reads?'],
    followUps: ['When read replicas not enough?', 'Feed fan-out write amplification?'],
    misconceptions: ['Always add replicas for scale', 'API read count equals DB read count'],
    traps: ['Ignore fan-out writes on read-heavy feed'],
    strongSignals: ['CQRS', 'Cache layer', 'Write shard when ratio flips'],
  },
  keyTakeaways: [
    'Read/write ratio drives replica vs shard vs cache decisions.',
    'Social/feed often 100:1; ingest often write-heavy.',
    'Measure at persistence layer after cache effects.',
    'Write spikes can temporarily invert assumptions.',
    'Read-heavy tolerates eventual consistency on replicas often.',
  ],
  interviewQuestions: [
    { level: 'basic', question: '100:1 read:write — first scaling knob?', answerHint: 'Read cache (Redis/CDN) and read replicas before sharding writes.' },
    { level: 'intermediate', question: 'Write-heavy metrics pipeline architecture?', answerHint: 'Append-only log/Kafka, batch column store for reads, partition ingest writers.' },
    { level: 'advanced', question: 'Feed fan-out — read-heavy but write problem?', answerHint: 'Celebrity post fans out millions of writes to follower feeds — hybrid push/pull, batch fan-out.' },
  ],
  flashcards: [
    { front: 'Read-heavy ratio example', back: 'Social feed ~100:1 — favor cache and replicas' },
    { front: 'Write-heavy ratio example', back: 'Metrics ingest — partition writes, batch reads' },
    { front: 'Measure ratio where', back: 'At DB/persistence layer not cached API edge' },
    { front: 'CQRS motivation', back: 'Separate read and write models when ratios and shapes differ' },
  ],
  quickRevision: [
    'Ratio by domain',
    'Read → cache/replica',
    'Write → shard/queue',
    'Measure at DB',
    'Fan-out caveat',
  ],
}
