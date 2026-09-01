import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Horizontal scaling (scale out) adds more machines to handle load; vertical scaling (scale up) increases CPU, RAM, or disk on a single machine. Most large systems combine both — bigger nodes until diminishing returns, then shard or replicate horizontally.',
  whyExists:
    'Traffic and data grow beyond one server\'s ceiling. Vertical scaling is simpler but hits hardware limits and creates single points of failure. Horizontal scaling enables redundancy and elastic capacity but demands stateless design, load balancing, and data partitioning.',
  mentalModel:
    'Vertical = bigger box. Horizontal = more boxes sharing work. If your app stores session state on one machine, adding boxes does not help until you externalize state. Database is often the first vertical wall; then you shard or add read replicas.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Dimension', 'Vertical', 'Horizontal'],
      rows: [
        ['Capacity', 'Upgrade CPU/RAM/SSD on one node', 'Add nodes; partition or replicate workload'],
        ['Complexity', 'Low — same deployment', 'Higher — routing, consistency, ops'],
        ['Failure domain', 'Single node outage = total loss', 'Partial failure if designed well'],
        ['Cost curve', 'Premium hardware; diminishing returns', 'Commodity hardware; linear at scale'],
        ['State', 'Easier for stateful monolith', 'Requires externalized session/storage'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Scale-up vs scale-out',
      diagram: `flowchart TB
  subgraph vertical [Vertical scale-up]
    S1[Server 4 CPU] --> S2[Server 32 CPU]
  end
  subgraph horizontal [Horizontal scale-out]
    LB[Load Balancer] --> A1[App 1]
    LB --> A2[App 2]
    LB --> A3[App 3]
  end`,
    },
    {
      type: 'list',
      items: [
        'App tier: scale horizontally behind LB once stateless',
        'DB tier: vertical first, then read replicas, then sharding',
        'Auto-scaling groups add/remove instances on CPU/RPS/lag metrics',
        'Elasticity: horizontal enables pay-for-what-you-use in cloud',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'E-commerce API at 2k RPS runs on 2× 8 vCPU instances behind ALB (horizontal). PostgreSQL primary starts at db.r6g.xlarge; at 80% CPU you add read replicas for reports, then consider Citus/sharding when write QPS exceeds single-node IOPS (vertical exhausted).',
    },
    {
      type: 'code',
      language: 'text',
      caption: 'Decision heuristic',
      code: `Stateless web/API     → horizontal first
Single-node Redis     → vertical until memory cap → cluster
OLTP primary DB       → vertical + tuning → replicas → shard
Batch analytics       → horizontal workers + partitioned input`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Vertical: fast win, no architecture change',
      'Horizontal: fault isolation, elastic growth, no single ceiling',
    ],
    disadvantages: [
      'Vertical: hard ceiling, downtime during resize, SPOF',
      'Horizontal: distributed complexity, data locality, coordination cost',
    ],
    alternatives: ['Serverless auto-scale', 'Edge/CDN offload for static reads', 'Queue-backed async workers'],
    whenToUse: [
      'Vertical: early stage, DB tuning, cache node sizing',
      'Horizontal: web tier, workers, multi-AZ resilience',
    ],
    whenNotToUse: [
      'Horizontal without fixing stateful sessions on app nodes',
      'Vertical-only when SLA requires multi-AZ and growth is predictable',
    ],
  },
  failureModes: [
    'Scaling app horizontally while DB remains single bottleneck',
    'Uneven shard load after horizontal partition (hot keys)',
    'Vertical DB resize causing long failover window',
    'Over-provisioning horizontal pods without connection pool limits → DB meltdown',
  ],
  production: {
    performance: ['Right-size before scale; profile before buying bigger boxes'],
    scalability: ['HPA on CPU/RPS/custom lag; pre-warm for traffic spikes'],
    reliability: ['Multi-AZ horizontal app; avoid single giant DB without HA'],
    cost: ['Horizontal spot/preemptible for batch; reserved for baseline vertical DB'],
    observability: ['Per-node CPU, saturation, queue depth, DB connections'],
    maintainability: ['Infrastructure as code for repeatable scale-out'],
  },
  interview: {
    expectations: [
      'Contrast scale-up vs scale-out with examples',
      'Identify bottleneck layer (app vs DB vs cache)',
      'Mention stateless requirement for horizontal app tier',
    ],
    commonQuestions: ['When stop vertical and start horizontal?', 'How scale a monolithic DB?'],
    followUps: ['Auto-scaling signals?', 'Stateful vs stateless impact?'],
    misconceptions: ['Horizontal always cheaper', 'Cloud removes need to think about limits'],
    traps: ['Adding 50 app servers without DB connection pooling plan'],
    strongSignals: ['Bottleneck analysis', 'Read replica vs shard path', 'Elasticity + cost tradeoff'],
  },
  keyTakeaways: [
    'Vertical = bigger machine; horizontal = more machines.',
    'App tier scales out when stateless; DB scales up then out (replicas/shards).',
    'Horizontal improves resilience; vertical is simpler early on.',
    'Find the bottleneck before scaling the wrong layer.',
    'Combine both: reasonably sized nodes × N replicas.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Difference between horizontal and vertical scaling?', answerHint: 'More machines vs bigger machine.' },
    { level: 'intermediate', question: 'Why must app servers be stateless to scale horizontally?', answerHint: 'Any instance must serve any request; sticky sessions need shared store.' },
    { level: 'advanced', question: 'Your DB is at 95% CPU — vertical vs horizontal options?', answerHint: 'Tune queries/indexes, bigger instance, read replicas for reads, shard/partition for writes.' },
  ],
  flashcards: [
    { front: 'Scale out', back: 'Add nodes; requires load balancing and often partitioned/shared state' },
    { front: 'Scale up', back: 'Increase resources on one node; simpler but limited ceiling' },
    { front: 'First DB scaling step', back: 'Often vertical + optimization, then read replicas' },
    { front: 'App tier default', back: 'Horizontal stateless instances behind LB' },
  ],
  quickRevision: [
    'Vertical: bigger box, SPOF risk',
    'Horizontal: more boxes, LB, stateless',
    'DB: up → replicas → shard',
    'Profile bottleneck first',
    'Auto-scale on meaningful metrics',
  ],
  systemDesign: {
    problem: 'Design scaling strategy for a video streaming API growing from 1k to 100k concurrent viewers.',
    requirements: {
      functional: ['Stream metadata', 'Playback URLs', 'Live chat optional'],
      nonFunctional: ['99.9% availability', 'Elastic during live events', 'Cost-aware'],
    },
    scaleAssumptions: ['100k concurrent', '10:1 read/write ratio', 'Global users'],
    capacityEstimates: ['Metadata API ~5k RPS peak', 'CDN carries 95%+ bytes'],
    api: [{ type: 'paragraph', text: 'GET /streams/{id}; POST /streams (creators)' }],
    dataModel: [{ type: 'list', items: ['Stream metadata in Postgres/Cassandra', 'Playback via CDN signed URLs'] }],
    highLevelArchitecture: [
      { type: 'paragraph', text: 'Horizontal stateless API pods + CDN (horizontal edge) + vertical-then-sharded metadata store. Transcode workers scale horizontally on queue depth.' },
    ],
    diagram: {
      mermaid: `flowchart LR
  Users --> CDN[CDN horizontal edge]
  Users --> LB[LB]
  LB --> API1[API]
  LB --> API2[API]
  API1 --> DB[(Metadata DB)]
  API2 --> DB
  Upload --> Q[Queue] --> Workers[Transcode workers scale out]`,
      caption: 'Edge scales horizontally; DB scales up then partitions',
    },
    dataFlow: ['Reads hit CDN/API cache', 'Writes to primary DB or partitioned by stream_id'],
    storage: ['Object storage for video; DB for metadata'],
    caching: ['CDN + Redis for hot stream metadata'],
    asyncProcessing: ['Transcode farm scales horizontally'],
    scaling: ['HPA on API; CDN automatic; DB read replicas then shard by creator_id'],
    consistency: ['Metadata strong on primary; CDN eventual for segments'],
    reliability: ['Multi-AZ API; no single giant node without HA pair'],
    failureScenarios: ['Live spike overwhelms DB connections — pool + cache + scale API first'],
    security: ['Signed URLs; rate limit metadata API'],
    observability: ['RPS, p99, CDN hit ratio, DB CPU, queue lag'],
    bottlenecks: ['Origin if CDN misconfigured; DB on write-heavy chat'],
    alternatives: ['Fully serverless API + DynamoDB on-demand'],
    tradeoffs: ['Over-horizontal API before CDN → wasted cost', 'Premature sharding → ops burden'],
    interviewFollowUps: ['When shard metadata DB?', 'Cold start on scale-out?'],
    evolution: [
      { stage: '1. Simple design', description: 'Single large app + DB instance.', bottleneck: 'Event spikes.' },
      { stage: '2. Improve', description: 'Horizontal API + CDN + bigger DB.', bottleneck: 'DB writes on chat.' },
      { stage: '3. Improve', description: 'Read replicas, Redis, worker pool.', bottleneck: 'Hot creators.' },
      { stage: '4. Scale further', description: 'Shard metadata; regional stacks.', bottleneck: 'Cross-shard queries.' },
    ],
  },
}
