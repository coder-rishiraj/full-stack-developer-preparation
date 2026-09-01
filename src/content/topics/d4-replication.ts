import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Replication copies data across multiple nodes for durability, read scalability, and fault tolerance. Modes include leader-follower (single writer), multi-leader (conflicts possible), and leaderless (quorum reads/writes). Sync vs async replication trades consistency and latency.',
  whyExists:
    'Single disks and single regions fail. Replication keeps service alive when a node dies and places data closer to users. It is the foundation of HA databases, object storage erasure coding, and CDN origin redundancy.',
  mentalModel:
    'One write fans out to copies. Followers may lag. On leader death, promote a follower (failover). Reads from followers are faster but may be stale unless you wait for sync or use quorum.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Topology', 'Writes', 'Read scaling', 'Conflict risk'],
      rows: [
        ['Single-leader', 'Leader only', 'Followers serve reads', 'Low if single writer'],
        ['Multi-leader', 'Multiple leaders', 'Regional writes', 'Higher — need merge'],
        ['Leaderless', 'Quorum to any nodes', 'Any replica', 'Tunable via R/W/N'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Async leader-follower replication',
      diagram: `sequenceDiagram
  participant C as Client
  participant L as Leader
  participant F1 as Follower1
  participant F2 as Follower2
  C->>L: WRITE x=5
  L->>L: commit local
  L-->>C: ack (async mode)
  L->>F1: replicate log entry
  L->>F2: replicate log entry
  F1-->>L: ack
  Note over F1,F2: replication lag possible`,
    },
    {
      type: 'list',
      items: [
        'Replication log: WAL/binlog/raft log — ordered entries applied on followers',
        'Sync replication: wait for follower ack before client ack — higher latency, less data loss',
        'Async: leader acks immediately — RPO > 0 on leader crash',
        'Chain replication: leader → A → B reduces fan-out write load on leader',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'PostgreSQL streaming replication: primary accepts writes, ships WAL to standbys. App reads analytics from standby; checkout reads from primary for freshness. On primary failure, Patroni promotes synchronous standby if configured.',
    },
    {
      type: 'code',
      language: 'text',
      caption: 'Replication lag impact',
      code: `User updates avatar on leader (t=0)
Follower serves GET at t=50ms with lag 200ms → old avatar
Fix: read-your-writes route to leader OR wait for lag < threshold OR version check`,
    },
  ],
  tradeoffs: {
    advantages: ['HA and failover', 'Geographic distribution', 'Read offload to replicas'],
    disadvantages: ['Lag and consistency complexity', 'Failover brain-split risk', 'Storage multiplied by replica count'],
    alternatives: ['Backup/restore only (no hot replica)', 'Erasure-coded object storage', 'Single multi-AZ managed DB'],
    whenToUse: ['Any production DB', 'Critical blob storage', 'Cross-region DR'],
    whenNotToUse: ['Dev-only ephemeral data', 'When strong sync cross-region latency unacceptable without tiering'],
  },
  failureModes: [
    'Replication lag causing stale reads or lost read-your-writes',
    'Split brain: two nodes think they are leader',
    'Cascade failure: slow follower blocks sync replication',
    'Promotion of lagging replica → data loss (RPO violation)',
    'Circular replication in misconfigured multi-master',
  ],
  production: {
    reliability: ['Automated failover with fencing', 'Monitor replication lag and last replay LSN'],
    scalability: ['Read replicas for read-heavy; cap count vs write amplification'],
    observability: ['Lag seconds, bytes behind, replay errors', 'Alert on sync replica disconnect'],
    security: ['Encrypt replication stream TLS', 'Restrict replica network access'],
    maintainability: ['Runbook: promote, rejoin old primary as replica'],
  },
  interview: {
    expectations: ['Leader-follower vs multi-leader', 'Sync vs async RPO/RTO', 'Replication lag handling'],
    commonQuestions: ['How failover works?', 'Read from replica safe when?'],
    followUps: ['Split brain prevention?', 'Chain vs star replication?'],
    misconceptions: ['Replication equals backup without PITR', 'More replicas always better for writes'],
    traps: ['Promoting async replica without acknowledging lost transactions'],
    strongSignals: ['RPO/RTO definitions', 'Quorum/fencing', 'Read routing policy per query type'],
  },
  keyTakeaways: [
    'Replication copies data for HA and read scale; not a substitute for backups.',
    'Single-leader is simplest; multi-leader needs conflict handling.',
    'Async = fast writes, possible loss on crash; sync = safer, slower.',
    'Monitor lag; route critical reads to leader or use quorum.',
    'Failover requires fencing to prevent split brain.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why replicate data?', answerHint: 'Durability, availability, read scaling, geographic proximity.' },
    { level: 'intermediate', question: 'Sync vs async replication?', answerHint: 'Sync waits for replica ack before commit ack; async may lose recent writes on primary failure.' },
    { level: 'advanced', question: 'Design read path with 5 replicas and lag?', answerHint: 'Route by consistency tier; monotonic reads via session stickiness to caught-up replica or leader.' },
  ],
  flashcards: [
    { front: 'Replication lag', back: 'Follower behind leader; stale reads possible' },
    { front: 'Sync replication RPO', back: 'Near zero if sync replica promoted' },
    { front: 'Split brain', back: 'Two leaders accept conflicting writes' },
    { front: 'Read replica use', back: 'Offload read-heavy; not all reads if strong consistency needed' },
  ],
  quickRevision: [
    'Leader-follower default',
    'Async fast, sync safe',
    'Monitor lag',
    'Failover + fencing',
    'Replication ≠ backup',
  ],
  systemDesign: {
    problem: 'Design a globally available document store with single-leader replication per shard and read scaling in each region.',
    requirements: {
      functional: ['CRUD documents', 'List by user', 'Cross-region read'],
      nonFunctional: ['RPO < 1 min', 'RTO < 5 min', 'Eventual reads OK for lists'],
    },
    scaleAssumptions: ['1B documents', '100k write/s aggregate', '3 regions'],
    capacityEstimates: ['Shard by doc_id; 3 replicas per shard per region optional'],
    api: [{ type: 'paragraph', text: 'PUT/GET /docs/{id}; GET /users/{id}/docs' }],
    dataModel: [{ type: 'list', items: ['Document: id, user_id, body, version, updated_at', 'Replication log per shard leader'] }],
    highLevelArchitecture: [
      { type: 'paragraph', text: 'Per-shard Raft leader in home region; async cross-region replicas for DR; local read replicas for GET by id.' },
    ],
    diagram: {
      mermaid: `flowchart TB
  W[Write] --> L[Shard leader US]
  L --> F1[Follower US]
  L --> F2[Follower US]
  L -.async.-> R1[Replica EU]
  R[Read EU] --> R1`,
      caption: 'Sync in-region; async cross-region',
    },
    dataFlow: ['Writes to leader; reads local replica with lag bound for lists'],
    storage: ['Per-shard replicated log + SSTables'],
    caching: ['CDN not for private docs; edge cache with auth'],
    asyncProcessing: ['Cross-region replication stream'],
    scaling: ['More shards; more in-region read replicas'],
    consistency: ['Strong on leader write; eventual on distant replica reads'],
    reliability: ['Automated leader election; backup snapshots'],
    failureScenarios: ['Leader loss → elect in-region follower', 'Region loss → promote DR replica with RPO tradeoff'],
    security: ['TLS on replication links', 'Encrypt at rest'],
    observability: ['Per-shard lag, election events, write availability'],
    bottlenecks: ['Cross-region bandwidth', 'Hot shard leader'],
    alternatives: ['Multi-leader per region with CRDT merge'],
    tradeoffs: ['Async cross-region vs latency of sync global writes'],
    interviewFollowUps: ['Read-your-writes across regions?', 'Rejoin old leader after partition?'],
    evolution: [
      { stage: '1. Simple design', description: 'Single DB primary.', bottleneck: 'Region failure.' },
      { stage: '2. Improve', description: 'In-region sync replicas.', bottleneck: 'Cross-region latency.' },
      { stage: '3. Improve', description: 'Async DR replicas + read routing.', bottleneck: 'Stale cross-region reads.' },
      { stage: '4. Scale further', description: 'Many shards; per-tenant replication policy.', bottleneck: 'Ops complexity.' },
    ],
  },
}
