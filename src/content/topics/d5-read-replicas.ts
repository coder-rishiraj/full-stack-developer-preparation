import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Read replicas are read-only copies of a primary database fed by replication log — serving SELECT queries to offload read traffic without handling writes. Lag between primary and replica means reads may be stale unless routed carefully.',
  whyExists:
    'OLTP primaries saturate CPU with mixed read/write. Analytics dashboards, search indexing, and API read endpoints can use replicas preserving primary for writes. Cheaper scale than sharding for read-heavy workloads.',
  mentalModel:
    'Primary is source of truth for writes; replicas are eventually consistent mirrors for reads. Connection string or proxy chooses target. Strong consistency reads still need primary or lag-zero check.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Read/write split routing',
      diagram: `flowchart TB
  W[Write API] --> Primary[(Primary)]
  R[Read API] --> Router{consistency?}
  Router -->|strong| Primary
  Router -->|eventual OK| Replica[(Read replica)]
  Primary -.replication.-> Replica`,
    },
    {
      type: 'table',
      headers: ['Routing rule', 'Use case', 'Risk'],
      rows: [
        ['All reads to replica', 'Reporting', 'Stale data'],
        ['Read-after-write to primary', 'User profile edit', 'Higher primary load'],
        ['Lag threshold gate', 'Replica if lag < 5s', 'Edge cases near threshold'],
        ['Session stickiness', 'Monotonic reads', 'Uneven replica load'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Spring routing datasource sketch',
      code: `@Transactional(readOnly = true)
public List<Order> listOrders() {
  // routes to replica if lag OK
}
@Transactional
public Order createOrder(...) {
  // routes to primary
}`,
    },
  ],
  tradeoffs: {
    advantages: ['Scale reads horizontally', 'Isolate heavy analytics from OLTP', 'Cheap vs sharding'],
    disadvantages: ['Replication lag', 'Does not scale writes', 'More connections to manage'],
    alternatives: ['Caching layer', 'Materialized views on primary', 'Read scaling via Elasticsearch'],
    whenToUse: ['Read/write ratio high', 'Tolerable staleness on many reads'],
    whenNotToUse: ['Every read needs linearizable freshness'],
  },
  failureModes: [
    'Replica lag minutes during bulk load on primary',
    'Reading replica for balance after transfer',
    'Replica promotion without catching up',
    'Connection pool opens too many replica connections overwhelming it',
  ],
  production: {
    performance: ['Connection pooling per replica', 'Cancel long reports killing replica'],
    reliability: ['Multiple replicas for HA reads', 'Fallback to primary if replica down'],
    observability: ['Lag per replica, read routing ratio', 'Slow query on replica isolated'],
    maintainability: ['Document which endpoints allow stale reads'],
  },
  interview: {
    expectations: ['Lag awareness', 'Read/write split', 'When not use replica'],
    commonQuestions: ['Read replica vs cache?', 'Implement read-your-writes?'],
    followUps: ['Aurora reader endpoints?', 'Cascade replica topology?'],
    misconceptions: ['Replicas handle writes in failover without promotion process', 'Infinite replicas no primary impact'],
    traps: ['POST redirect GET hits replica stale'],
    strongSignals: ['Lag-gated routing', 'Primary pin after write cookie/session'],
  },
  keyTakeaways: [
    'Replicas scale reads, not writes.',
    'Always assume lag — route strong reads to primary.',
    'Read-after-write: primary or verified caught-up replica.',
    'Analytics belongs on replica, not primary.',
    'Monitor lag and replica health.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Read replica purpose?', answerHint: 'Offload read queries; primary handles writes.' },
    { level: 'intermediate', question: 'User updates name then reads profile — which node?', answerHint: 'Primary or replica caught up; read-your-writes routing.' },
    { level: 'advanced', question: 'Replica lag spike during migration — mitigation?', answerHint: 'Pause replica reads, route to primary, throttle migration, use delayed replica for batch only.' },
  ],
  flashcards: [
    { front: 'Read replica writes', back: 'Read-only until promoted to primary' },
    { front: 'Replication lag', back: 'Delay before replica reflects primary changes' },
    { front: 'Read-your-writes fix', back: 'Route to primary or track session write LSN' },
    { front: 'Replica vs cache', back: 'Replica full DB copy consistent eventually; cache partial fast TTL' },
  ],
  quickRevision: [
    'Reads scale out',
    'Writes stay primary',
    'Lag always possible',
    'Strong read → primary',
    'BI on replica',
  ],
  systemDesign: {
    problem: 'Scale read-heavy product catalog API (50k read/s, 500 write/s) on Postgres without stale price reads after admin update.',
    requirements: {
      functional: ['GET product', 'Admin PUT price'],
      nonFunctional: ['50k read/s', 'Price visible within 1s of update', 'Primary write safe'],
    },
    scaleAssumptions: ['50k read/s', '500 write/s', '3 read replicas'],
    capacityEstimates: ['Each replica handles ~20k simple SELECT/s with indexes'],
    api: [{ type: 'code', language: 'http', code: `GET /products/{id}\nPUT /admin/products/{id} price` }],
    dataModel: [{ type: 'list', items: ['products table replicated', 'version column on price updates'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'PgBouncer read pool to replicas; write pool primary; after admin PUT clients get version bump; GET accepts replica if version >= or route admin preview to primary.' }],
    diagram: {
      mermaid: `flowchart LR
  GET --> RP[Read pool]
  RP --> R1[Replica1]
  RP --> R2[Replica2]
  PUT --> Primary[(Primary)]
  Primary --> R1
  Primary --> R2`,
      caption: 'Split pools with lag monitoring',
    },
    dataFlow: ['Writes primary only', 'Reads replicas with lag check + Redis version cache invalidation on write'],
    storage: ['Primary + 3 replicas'],
    caching: ['Redis product cache invalidated on write bridges staleness gap'],
    asyncProcessing: ['None required'],
    scaling: ['Add replicas until primary replication bandwidth limit'],
    consistency: ['Eventual reads OK with cache invalidation for price'],
    reliability: ['Replica failure remove from pool'],
    failureScenarios: ['All replicas lagging — fall back reads to primary throttled'],
    security: ['Admin writes primary only'],
    observability: ['Replica lag, read pool latency'],
    bottlenecks: ['Primary replication fan-out limit ~5-10 replicas typical'],
    alternatives: ['Elasticsearch for catalog reads'],
    tradeoffs: ['More replicas vs replication load on primary'],
    interviewFollowUps: ['When add cache vs more replicas?'],
    evolution: [
      { stage: '1. Simple design', description: 'Single DB all traffic.', bottleneck: 'Read CPU.' },
      { stage: '2. Improve', description: 'One replica.', bottleneck: 'Lag on price.' },
      { stage: '3. Improve', description: '3 replicas + cache invalidation.', bottleneck: 'Primary repl fan-out.' },
      { stage: '4. Scale further', description: 'Search index for list; replicas for get-by-id.', bottleneck: 'Index sync.' },
    ],
  },
}
