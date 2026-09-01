import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'SQL (relational) databases store structured data in tables with schemas, ACID transactions, and powerful joins (PostgreSQL, MySQL). NoSQL databases relax some relational guarantees for horizontal scale and flexible models — document (MongoDB), key-value (Redis, DynamoDB), wide-column (Cassandra), graph (Neo4j).',
  whyExists:
    'One size does not fit all workloads. Ledgers need transactions and constraints; session stores need millisecond key lookups at huge scale; feeds need flexible nested documents. Choosing wrong storage drives rewrites, outages, and interview failures.',
  mentalModel:
    'Start from access patterns and invariants, not hype. If you need multi-row ACID invariants → SQL. If you need partition-tolerant massive key-value writes with tunable consistency → wide-column/kv. Often polyglot persistence: Postgres + Redis + Elasticsearch.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Dimension', 'SQL (RDBMS)', 'NoSQL (typical)'],
      rows: [
        ['Schema', 'Fixed schema, migrations', 'Flexible / schemaless documents'],
        ['Transactions', 'Multi-row ACID', 'Often single-row or eventual; tunable in some'],
        ['Scaling', 'Vertical + read replicas; sharding harder', 'Built for partition/shard horizontal scale'],
        ['Queries', 'Rich SQL joins', 'Key-based; secondary indexes limited/costly'],
        ['Consistency', 'Strong by default on primary', 'Often eventual; tunable (Cassandra QUORUM)'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Polyglot persistence in one product',
      diagram: `flowchart TB
  API --> PG[(PostgreSQL orders)]
  API --> Redis[(Redis sessions)]
  API --> ES[(Elasticsearch search)]
  API --> S3[(S3 media)]
  PG -->|CDC| ES`,
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Decision order',
      text: '1) Access patterns 2) Consistency needs 3) Query shape 4) Scale 5) Ops maturity. Default OLTP → Postgres until proven otherwise.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'E-commerce: orders + payments in Postgres (ACID, foreign keys). Product search in Elasticsearch (inverted index). Shopping cart in Redis (TTL, fast). Product images in S3. Not one MongoDB for everything.',
    },
    {
      type: 'code',
      language: 'text',
      caption: 'Quick mapping',
      code: `Financial ledger, bookings with constraints  → SQL
Session / rate limit counters               → Redis (KV)
High-write telemetry / time-series          → Cassandra / TSDB
Flexible content CMS documents              → Document DB
Full-text search                            → Elasticsearch / OpenSearch
Social graph recommendations                → Graph DB (niche)`,
    },
  ],
  tradeoffs: {
    advantages: [
      'SQL: integrity, joins, mature tooling',
      'NoSQL: horizontal scale, flexible schema, low-latency KV',
      'Polyglot: right tool per bounded context',
    ],
    disadvantages: [
      'Multiple stores → sync, ops, consistency complexity',
      'NoSQL joins and ad-hoc analytics harder',
      'Schema-less can become schema-anyway without discipline',
    ],
    alternatives: [
      'NewSQL (CockroachDB, Spanner) — SQL + distributed',
      'SQLite at edge; Postgres at core',
      'Event sourcing + projections',
    ],
    whenToUse: [
      'SQL: money, inventory, relational reporting',
      'Document: nested JSON profiles, catalogs with variant shapes',
      'KV: cache, sessions, feature flags',
      'Wide-column: high write throughput time-series at scale',
    ],
    whenNotToUse: [
      'NoSQL because “web scale” on 10k users',
      'SQL for every blob — use object storage',
    ],
  },
  failureModes: [
    'Using Mongo for transactions needing cross-document ACID without design',
    'Dual-write SQL + search index without outbox — drift',
    'Hot partition in Dynamo on poorly chosen key',
    'Migration pain when schema-less becomes entangled',
  ],
  production: {
    scalability: ['Shard NoSQL by access key; Citus/Vitess for SQL scale'],
    reliability: ['Backups, PITR for SQL; replication lag monitoring for NoSQL'],
    maintainability: ['Bounded contexts per store; CDC for derived indexes'],
    cost: ['Managed services vs ops headcount'],
    observability: ['Per-store latency, replication lag, disk'],
  },
  interview: {
    expectations: [
      'Compare on access patterns not religion',
      'Give polyglot example',
      'When Postgres is enough vs need Cassandra',
    ],
    commonQuestions: ['SQL vs NoSQL for Twitter timeline?', 'When Mongo vs Postgres?'],
    followUps: ['NewSQL?', 'How keep search index in sync?'],
    misconceptions: ['NoSQL always faster', 'SQL cannot scale ever'],
    traps: ['Single DB for all microservices without justification'],
    strongSignals: ['CAP/consistency tie-in', 'Outbox/CDC for secondary indexes'],
  },
  keyTakeaways: [
    'Choose by access pattern + invariants, not labels.',
    'SQL default for OLTP with relations and ACID.',
    'NoSQL for massive KV/wide-column/document needs.',
    'Polyglot persistence is normal at scale.',
    'Sync derived stores via CDC/outbox, not dual-write.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Main SQL vs NoSQL difference?',
      answerHint: 'Schema/joins/ACID vs flexible scale-oriented models.',
    },
    {
      level: 'intermediate',
      question: 'Design storage for Uber trips.',
      answerHint: 'SQL or Cassandra for trips metadata; Redis driver location; warehouse analytics.',
    },
    {
      level: 'advanced',
      question: 'Keep Elasticsearch aligned with Postgres?',
      answerHint: 'Transactional outbox + consumer or Debezium CDC; idempotent indexing.',
    },
  ],
  flashcards: [
    { front: 'When SQL first?', back: 'ACID multi-row invariants, joins, complex queries' },
    { front: 'Document DB sweet spot', back: 'Nested flexible records, catalog CMS' },
    { front: 'Wide-column example', back: 'Cassandra — high write, partition key access' },
    { front: 'Polyglot persistence', back: 'Multiple DB types per bounded context' },
  ],
  quickRevision: [
    'Access patterns first',
    'Postgres default OLTP',
    'Redis sessions/cache',
    'ES search via CDC',
    'NoSQL ≠ no schema discipline',
  ],
  systemDesign: {
    problem: 'Pick and justify storage for a new social app: user profiles, follower graph, timeline feed, and direct messages.',
    requirements: {
      functional: ['CRUD profile', 'Follow/unfollow', 'Home timeline', 'DM threads'],
      nonFunctional: ['Timeline p99 < 200ms', 'Strong delivery for DMs', '10M DAU scale path'],
    },
    scaleAssumptions: ['10M DAU', '500 reads/s per popular user fan-out', '1B posts total'],
    capacityEstimates: [
      'Fan-out on write vs read tradeoff drives store choice',
      'Hot celebrities require hybrid fan-out strategies',
    ],
    api: [{ type: 'paragraph', text: 'REST/GraphQL for profiles, timeline, messages' }],
    dataModel: [
      {
        type: 'list',
        items: [
          'Profiles: Postgres or document store (user_id, bio, settings)',
          'Graph edges: Postgres adjacency or graph DB / Redis sets for followers',
          'Timeline: Cassandra wide rows per user_id OR Redis sorted sets for cache',
          'DMs: Postgres threads + messages with ACID per thread',
        ],
      },
    ],
    highLevelArchitecture: [
      {
        type: 'paragraph',
        text: 'Hybrid: Postgres for users + DMs (integrity). Cassandra/Redis for timeline materialization. Elasticsearch optional for search. Avoid one DB forcing square peg.',
      },
    ],
    diagram: {
      mermaid: `flowchart TB
  API --> PG[(PostgreSQL users/DMs)]
  API --> Cass[(Cassandra timelines)]
  API --> Redis[(Redis hot timeline cache)]
  Post[Post Service] --> Cass
  Post --> Fanout[Fanout workers]
  Fanout --> Cass`,
      caption: 'SQL for authoritative user/DM; wide-column for feed shards',
    },
    dataFlow: [
      'Post created → store canonical post → fan-out to follower timeline rows async',
      'Read timeline → Cassandra by user_id partition; cache hot users in Redis',
      'DM send → Postgres txn in thread',
    ],
    storage: ['Postgres + Cassandra + Redis typical split'],
    caching: ['Redis front hot timelines'],
    asyncProcessing: ['Fan-out workers on post create', 'CDC to search index'],
    scaling: ['Partition timelines by user_id', 'Separate read path for celebrities (merge on read)'],
    consistency: ['DMs strong in SQL', 'Timeline eventual fan-out OK'],
    reliability: ['Idempotent fan-out with post_id dedupe'],
    failureScenarios: ['Fan-out lag → stale feed briefly', 'Cassandra hot partition on celebrity'],
    security: ['DM encryption at rest', 'Row-level auth on threads'],
    observability: ['Fan-out queue lag', 'Per-store latency'],
    bottlenecks: ['Celebrity fan-out — hybrid push/pull'],
    alternatives: ['Mongo for everything — simpler early, pain on DM consistency'],
    tradeoffs: ['Ops complexity vs tailored performance', 'Fan-out on write vs read'],
    interviewFollowUps: ['When merge-on-read for celebrities?', 'Migrate SQL-only MVP to Cassandra feed?'],
    evolution: [
      { stage: '1. Simple design', description: 'Single Postgres — fine for MVP.', bottleneck: 'Timeline fan-out write load.' },
      { stage: '2. Improve', description: 'Add Redis cache for timelines.', bottleneck: 'Still SQL write ceiling.' },
      { stage: '3. Improve', description: 'Cassandra timeline + Postgres core.', bottleneck: 'Multi-store sync.' },
      { stage: '4. Scale further', description: 'Hybrid fan-out; search index; graph service if needed.', bottleneck: 'Operational maturity.' },
    ],
  },
}
