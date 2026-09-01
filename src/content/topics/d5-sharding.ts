import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Sharding (horizontal partitioning) splits data across multiple independent database instances by a shard key so each shard holds a subset of rows. Queries targeting one key hit one shard; cross-shard queries require scatter-gather or denormalization. Used when single-node write/read capacity exhausted.',
  whyExists:
    'Vertical scaling and read replicas eventually fail for write-heavy or massive datasets (billions of rows). Sharding distributes load and storage but pushes complexity to routing, schema, and transactions.',
  mentalModel:
    'Cut the table into N horizontal slices by hash(user_id) % N or range (A-M, N-Z). Router sends query to correct shard(s). No free cross-shard JOIN — design around shard key.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Strategy', 'Routing', 'Pros/cons'],
      rows: [
        ['Hash sharding', 'hash(key) mod N', 'Even spread; resharding hard'],
        ['Range sharding', 'key ranges per shard', 'Range queries easy; hot ranges'],
        ['Directory lookup', 'Lookup service maps key→shard', 'Flexible; lookup SPOF/cache'],
        ['Geo sharding', 'Region per shard', 'Data residency; cross-region queries hard'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Application-level shard routing',
      diagram: `flowchart TB
  App[Application] --> Router{shard(user_id)}
  Router -->|hash % 3 = 0| S0[(Shard 0)]
  Router -->|hash % 3 = 1| S1[(Shard 1)]
  Router -->|hash % 3 = 2| S2[(Shard 2)]`,
    },
    {
      type: 'list',
      items: [
        'Choose high-cardinality shard key aligned with queries (usually user_id, tenant_id)',
        'Avoid cross-shard transactions — saga or per-shard ACID',
        'Resharding: consistent hashing, dual-write migration, or Vitess/Citus',
        'Global unique IDs: UUID, Snowflake — not auto-increment per shard',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Instagram-style user data sharded by user_id: posts, followers colocated on same shard for local queries. Global search denormalized to Elasticsearch — not cross-shard SQL JOIN.',
    },
  ],
  tradeoffs: {
    advantages: ['Write scale beyond one node', 'Storage scale', 'Fault isolation per shard'],
    disadvantages: ['Cross-shard query pain', 'Ops complexity', 'Resharding migrations', 'Uneven hotspots'],
    alternatives: ['Citus/ Vitess managed sharding', 'NoSQL built-in partition', 'Single larger instance longer'],
    whenToUse: ['Proven single DB limit', 'Access patterns shard-local'],
    whenNotToUse: ['Heavy cross-entity transactions', 'Premature before optimization'],
  },
  failureModes: [
    'Hot shard from poor key (celebrity tenant)',
    'Scatter-gather timeout on admin reports',
    'Dual-write migration inconsistency',
    'Auto-increment ID collision across shards',
    'Wrong shard routing bug → data invisible',
  ],
  production: {
    scalability: ['Monitor per-shard CPU/storage', 'Plan resharding at 70% capacity'],
    reliability: ['Each shard HA replica set', 'Avoid single shard without backup'],
    observability: ['Per-shard QPS, lag, disk', 'Skew alerts'],
    maintainability: ['Shard map in config service', 'Automated routing tests'],
    performance: ['Colocate related tables same shard'],
  },
  interview: {
    expectations: ['Shard key selection', 'Cross-shard problem', 'Resharding approach'],
    commonQuestions: ['When shard?', 'Shard key for multi-tenant SaaS?'],
    followUps: ['Vitess vs app routing?', 'Cross-shard pagination?'],
    misconceptions: ['Shard early by default', 'Sharding fixes all scale issues'],
    traps: ['Low-cardinality shard key'],
    strongSignals: ['user_id/tenant_id colocation', 'Snowflake IDs', 'Denormalize for global queries'],
  },
  keyTakeaways: [
    'Split DB by shard key for horizontal scale.',
    'Queries should be shard-local when possible.',
    'Cross-shard TX avoided; use async patterns.',
    'Plan IDs and resharding before launch if possible.',
    'Monitor skew; hot shards need split or salting.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Sharding vs replication?', answerHint: 'Sharding splits data across nodes; replication copies same data for HA/reads.' },
    { level: 'intermediate', question: 'Good shard key properties?', answerHint: 'High cardinality, aligns with queries, even distribution.' },
    { level: 'advanced', question: 'Reshard from 4 to 8 shards live?', answerHint: 'Consistent hash migration, dual-write, backfill, cutover, verify counts.' },
  ],
  flashcards: [
    { front: 'Shard key', back: 'Determines which DB node holds row' },
    { front: 'Cross-shard join', back: 'Expensive scatter-gather — avoid in hot path' },
    { front: 'Directory sharding', back: 'Lookup table maps key to shard — flexible' },
    { front: 'Snowflake ID', back: 'Globally unique IDs without central DB sequence' },
  ],
  quickRevision: [
    'Horizontal DB split',
    'Key = query pattern',
    'No cross-shard TX',
    'Reshard planning',
    'Watch hot shards',
  ],
  systemDesign: {
    problem: 'Shard a messaging platform storing 10B messages when single Postgres exceeds 8TB and 15k write/s.',
    requirements: {
      functional: ['Send/read messages by conversation', 'List user conversations'],
      nonFunctional: ['10k msg write/s', 'Shard-local queries p99 < 50ms'],
    },
    scaleAssumptions: ['100M users', '10k write/s', '50k read/s'],
    capacityEstimates: ['Shard by conversation_id hash → 32 shards ~500GB each'],
    api: [{ type: 'paragraph', text: 'API includes conversation_id on all message ops' }],
    dataModel: [{ type: 'list', items: ['messages(conversation_id, msg_id, body) on shard hash(conversation_id)', 'conversations index table per user shard by user_id separately if needed'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'App router hash(conversation_id) % 32; each shard Postgres HA pair.' }],
    diagram: {
      mermaid: `flowchart LR
  API --> R[Shard router]
  R --> Sh0[Shard 0-7]
  R --> Sh1[Shard 8-15]
  R --> Sh2[Shard 16-31]`,
      caption: '32 independent database shards',
    },
    dataFlow: ['All message ops include conversation_id → single shard'],
    storage: ['32 sharded Postgres clusters'],
    caching: ['Redis recent messages optional per conversation'],
    asyncProcessing: ['Search index via CDC per shard'],
    scaling: ['Add shards with consistent hash migration'],
    consistency: ['Per-shard ACID'],
    reliability: ['HA per shard'],
    failureScenarios: ['Hot group chat on one shard — split conversation salt key rare tradeoff'],
    security: ['Tenant in shard routing validation'],
    observability: ['Per-shard metrics skew'],
    bottlenecks: ['Cross-user inbox query — denormalized inbox table sharded by user_id'],
    alternatives: ['Cassandra partition by conversation_id native'],
    tradeoffs: ['Dual inbox/message shard models complexity'],
    interviewFollowUps: ['Global search messages?', 'Delete user all shards?'],
    evolution: [
      { stage: '1. Simple design', description: 'Single Postgres.', bottleneck: 'Size and writes.' },
      { stage: '2. Improve', description: 'Read replicas.', bottleneck: 'Write ceiling.' },
      { stage: '3. Improve', description: '32-way shard by conversation_id.', bottleneck: 'Inbox cross-shard.' },
      { stage: '4. Scale further', description: 'Separate inbox shard by user_id + message shard.', bottleneck: 'Dual write sync.' },
    ],
  },
}
