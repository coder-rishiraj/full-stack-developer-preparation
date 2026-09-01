import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Partitioning (sharding) splits data across multiple storage nodes by a partition key so each node holds a subset. Goals: scale storage and write/read throughput beyond single-machine limits while keeping queries routable to the right shard(s).',
  whyExists:
    'A single PostgreSQL instance caps out on disk, memory, and connection count. Vertical scale hits a ceiling. Sharding spreads load but introduces cross-shard queries, rebalancing, and hotspot keys.',
  mentalModel:
    'Imagine a hash ring or range map: user_id 0–1M → shard A, 1M–2M → shard B. Most requests include the partition key so the router hits one shard. Joins across shards are expensive — design aggregates to co-locate related data.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Strategy', 'How keys map', 'Pros / cons'],
      rows: [
        ['Hash (mod/consistent)', 'hash(key) % N or ring', 'Even spread; range scans hard; resharding needs consistent hash'],
        ['Range', 'key ranges per shard', 'Range queries easy; hotspot on latest range'],
        ['Directory / lookup', 'Lookup table key→shard', 'Flexible; lookup service is SPOF/cache'],
        ['Geographic', 'region/user locale', 'Latency; cross-region queries hard'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Application-level sharding router',
      diagram: `flowchart LR
  App[API Service] --> R[Shard Router]
  R -->|hash user_id| S1[(Shard 1)]
  R -->|hash user_id| S2[(Shard 2)]
  R -->|hash user_id| S3[(Shard 3)]
  R --> Meta[(Shard map / ZooKeeper)]`,
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Choose partition key carefully',
      text: 'Co-locate entities queried together (orders + order_items by user_id or order_id). Avoid monotonic keys (timestamp) on hash shards without salting — creates hot shard.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Multi-tenant SaaS: partition by tenant_id. All tenant orders, users, invoices live on same shard → local joins. Global admin analytics fan-out to all shards (map-reduce or OLAP replica).',
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Simple hash router',
      code: `function shardForUser(userId: string, shardCount: number): number {
  const h = hash(userId) // stable hash
  return h % shardCount
}

async function getOrders(userId: string) {
  const shard = shardForUser(userId, SHARDS.length)
  return SHARDS[shard].query('SELECT * FROM orders WHERE user_id = $1', [userId])
}`,
    },
  ],
  tradeoffs: {
    advantages: ['Horizontal storage and QPS', 'Blast radius isolation per shard', 'Regional placement possible'],
    disadvantages: [
      'Cross-shard transactions rare and costly',
      'Rebalancing data when adding shards',
      'Operational complexity (migrations, backups per shard)',
    ],
    alternatives: [
      'PostgreSQL native partitioning (single node, simpler)',
      'Vitess/Citus managed sharding',
      'Separate DB per tenant (simple sharding)',
      'NoSQL built-in partitioning (Dynamo, Cassandra)',
    ],
    whenToUse: ['Write QPS or data size exceeds single node', 'Clear dominant access path by key'],
    whenNotToUse: ['Heavy cross-shard joins as primary workload', 'Data still fits comfortably on one node'],
  },
  failureModes: [
    'Hot shard (celebrity user, sequential IDs)',
    'Wrong partition key → scatter-gather on every query',
    'Reshard without dual-write → lost or duplicate data',
    'Shard map stale → writes to wrong node',
  ],
  production: {
    scalability: ['Consistent hashing to minimize data move on N change', 'Split hot shard by sub-key'],
    reliability: ['Per-shard replicas; backup/restore runbooks', 'Fencing during failover'],
    performance: ['Avoid scatter-gather in hot paths', 'Cache shard map locally with watch'],
    observability: ['Per-shard QPS, disk, replication lag', 'Hot key detection'],
    maintainability: ['Automated rebalance tooling; versioned schema migrations per shard'],
  },
  interview: {
    expectations: [
      'Compare hash vs range vs directory',
      'Explain rebalancing and consistent hashing',
      'Design partition key for Twitter/URL shortener/orders',
    ],
    commonQuestions: ['How add a shard without downtime?', 'How handle cross-shard transaction?'],
    followUps: ['Vitess vs app-level sharding?', 'Secondary indexes across shards?'],
    misconceptions: ['Sharding is free scalability', 'Any key works if you hash it'],
    traps: ['Picking auto-increment id as shard key without salting'],
    strongSignals: ['Mentions dual-write, backfill, cutover', 'Co-location for joins'],
  },
  keyTakeaways: [
    'Partition key drives query locality — design first.',
    'Hash for even load; range for range scans; directory for flexibility.',
    'Resharding: consistent hash + gradual migration.',
    'Cross-shard ACID is hard — sagas or avoid.',
    'Watch hot keys; split or cache.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is sharding?',
      answerHint: 'Split data across nodes by key; each holds subset.',
    },
    {
      level: 'intermediate',
      question: 'Hash vs range partitioning?',
      answerHint: 'Hash spreads load; range helps ordered scans but hotspots tail.',
    },
    {
      level: 'advanced',
      question: 'Migrate from 4 to 8 shards live?',
      answerHint: 'Consistent hash; dual-write; backfill; verify; cutover; retire old mapping.',
    },
  ],
  flashcards: [
    { front: 'Partition key', back: 'Field used to route row to shard; should match query access pattern' },
    { front: 'Consistent hashing', back: 'Add/remove nodes with minimal key remapping' },
    { front: 'Hot shard', back: 'Uneven load on one partition; fix split/salt/cache' },
    { front: 'Scatter-gather', back: 'Query all shards and merge — expensive' },
  ],
  quickRevision: [
    'Key choice > algorithm choice',
    'Hash / range / directory',
    'Co-locate related rows',
    'Reshard: dual-write + backfill',
    'Cross-shard TX avoid or saga',
  ],
  systemDesign: {
    problem: 'Design sharding for an orders database at 50k orders/sec and 10 TB data with mostly per-user order history queries.',
    requirements: {
      functional: ['Create order', 'List orders by user', 'Get order by id'],
      nonFunctional: ['p99 read < 50ms single-shard', 'Add shards online', 'No cross-user joins in hot path'],
    },
    scaleAssumptions: ['500M users', '50k writes/s peak', '10 TB orders + items'],
    capacityEstimates: [
      '50k writes/s ÷ 8 shards ≈ 6.25k/s each (within tuned Postgres/Citus)',
      '~20 GB per shard if evenly split (idealized)',
    ],
    api: [
      {
        type: 'code',
        language: 'http',
        code: `POST /orders  { userId, items }
GET  /users/{userId}/orders
GET  /orders/{orderId}  // requires orderId→shard lookup or embed shard in id`,
      },
    ],
    dataModel: [
      {
        type: 'list',
        items: [
          'orders(order_id, user_id PK partition, ...) — partition by user_id',
          'order_items co-located via user_id or order_id on same shard',
          'Optional global order_index(order_id, shard_id) for id-only lookup',
        ],
      },
    ],
    highLevelArchitecture: [
      {
        type: 'paragraph',
        text: 'API embeds shard router. order_id = ULID with embedded shard hint OR lookup table. Vitess or app router sends SQL to correct shard. Analytics via CDC to warehouse.',
      },
    ],
    diagram: {
      mermaid: `flowchart TB
  API --> Router[Shard Router]
  Router --> S1[(Shard US-1)]
  Router --> S2[(Shard US-2)]
  Router --> S3[(Shard EU-1)]
  S1 & S2 & S3 --> CDC[CDC] --> WH[(Snowflake)]`,
      caption: 'User-scoped OLTP shards + async analytics',
    },
    dataFlow: [
      'Create: hash(user_id) → shard insert order + items in txn',
      'List by user: single shard query',
      'Get by order_id: parse shard from id or index lookup then single shard',
    ],
    storage: ['8–32 Postgres shards initially; consistent hash ring in config service'],
    caching: ['Cache hot user order lists in Redis keyed user_id'],
    asyncProcessing: ['CDC per shard to unified warehouse for reporting'],
    scaling: ['Add shard; rebalance via dual-write migration tool'],
    consistency: ['Single-shard ACID; cross-shard saga for rare multi-user cart split'],
    reliability: ['Per-shard HA replica; backup per shard'],
    failureScenarios: ['Shard down → users on that shard 503; others OK', 'Hot merchant → dedicated shard or sub-partition'],
    security: ['Router enforces tenant isolation; no cross-shard arbitrary SQL'],
    observability: ['Per-shard write lag, disk, slow queries'],
    bottlenecks: ['Global order_id lookup without hint', 'Celebrity user hot shard'],
    alternatives: ['Citus colocated tables', 'Separate DB per large tenant'],
    tradeoffs: ['Global order id lookup table vs embedded shard in id', 'Vitess ops vs custom router'],
    interviewFollowUps: ['Secondary index on status across shards?', 'Refund spanning inventory shard?'],
    evolution: [
      { stage: '1. Simple design', description: 'Single Postgres + read replicas.', bottleneck: 'Write ceiling and disk.' },
      { stage: '2. Improve', description: 'Partition by user_id hash into 4 DBs.', bottleneck: 'Reshard pain; order_id lookup.' },
      { stage: '3. Improve', description: 'Consistent hash + global index service + dual-write migrations.', bottleneck: 'Ops overhead.' },
      { stage: '4. Scale further', description: 'Vitess/Citus; tenant-tier dedicated shards; automated rebalance.', bottleneck: 'Cost and team skill.' },
    ],
  },
}
