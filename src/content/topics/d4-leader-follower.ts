import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Leader-follower (primary-replica) replication designates one node as the leader (accepts all writes) and followers apply an ordered replication log. Clients write to leader; reads may hit leader or lagging followers. Failover promotes a follower to leader via election or operator action.',
  whyExists:
    'Single writer avoids write conflicts and simplifies consistency compared to multi-leader. Ordered log (WAL, binlog, Raft) gives followers a deterministic apply sequence. This pattern powers PostgreSQL, MySQL, MongoDB replica sets, and Kafka partition leaders.',
  mentalModel:
    'Leader is the source of truth for writes. Followers are read-only copies catching up via log tail. If leader dies, pick the most caught-up follower, fence the old leader, resume writes. Reads from followers trade freshness for capacity.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Write path and replication log',
      diagram: `sequenceDiagram
  participant C as Client
  participant L as Leader
  participant F as Follower
  C->>L: INSERT / UPDATE
  L->>L: append WAL entry
  L->>F: stream replication
  F->>F: apply entry
  alt sync replica
    F-->>L: ack
    L-->>C: commit ack
  else async
    L-->>C: commit ack
    F-->>L: ack later
  end`,
    },
    {
      type: 'table',
      headers: ['Concern', 'Leader role', 'Follower role'],
      rows: [
        ['Writes', 'Exclusive (or coordinated)', 'Reject or redirect writes'],
        ['Reads', 'Strong, up-to-date', 'Possibly stale — lag dependent'],
        ['Failover', 'Candidate source if healthy', 'Promoted if most up-to-date'],
        ['Split brain', 'Must be fenced when demoted', 'Becomes new leader after quorum vote'],
      ],
    },
    {
      type: 'list',
      items: [
        'Semi-sync: wait for at least one follower ack — middle ground',
        'Cascading replicas: follower of follower reduces leader fan-out',
        'Synchronous standby: zero data loss on sync pair promotion',
        'Consensus (Raft/Paxos): automated leader election with term numbers',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'MongoDB replica set: primary accepts writes, secondaries oplog tail. readPreference=primary for financial balances; secondaryPreferred for dashboards. rs.stepDown() for maintenance; election picks new primary in ~seconds.',
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Postgres read routing sketch',
      code: `-- App connection pool
-- writes + strong reads → primary DSN
-- reports → standby DSN with max_replication_lag_ms check
SELECT pg_last_wal_replay_lsn(); -- monitor lag`,
    },
  ],
  tradeoffs: {
    advantages: ['Simple write serialization', 'Mature tooling', 'Read scale via followers'],
    disadvantages: ['Leader write bottleneck', 'Failover complexity', 'Follower lag surprises'],
    alternatives: ['Leaderless quorum (Dynamo)', 'Multi-leader active-active'],
    whenToUse: ['OLTP RDBMS', 'Kafka partitions', 'Most transactional workloads'],
    whenNotToUse: ['Multi-region write latency without async acceptance', 'Write-heavy when leader CPU saturated — shard instead'],
  },
  failureModes: [
    'Promoting lagging follower loses committed writes',
    'Split brain dual primaries',
    'Clients still writing to old leader after failover',
    'Sync follower slowdown blocks all commits',
    'Large replication lag after network partition heal',
  ],
  production: {
    reliability: ['Fencing tokens (STONITH, epoch)', 'Automated failover with health checks', 'Avoid manual split-brain promotion'],
    scalability: ['Read replicas with connection pool routing', 'Shard when leader write bound'],
    observability: ['Replication lag, election events, primary location', 'Alert dual-primary'],
    security: ['Replication auth; private network for replication port'],
    maintainability: ['Document promotion runbook; test failover quarterly'],
  },
  interview: {
    expectations: ['Draw leader-follower', 'Failover steps', 'Sync vs async follower'],
    commonQuestions: ['How prevent split brain?', 'Safe to read replica when?'],
    followUps: ['Raft vs primary-standby?', 'Cascading replica tradeoff?'],
    misconceptions: ['Follower always safe for reads', 'Failover is instant with zero loss always'],
    traps: ['No fencing after failover'],
    strongSignals: ['Epoch/term fencing', 'Lag-aware read routing', 'Quorum for election (Raft)'],
  },
  keyTakeaways: [
    'One leader for writes; followers replay ordered log.',
    'Async replication: fast, possible loss; sync: safer, slower.',
    'Failover: elect most caught-up replica; fence old leader.',
    'Route strong reads to leader; replicas for lag-tolerant reads.',
    'Raft automates leader election with majority quorum.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Role of leader vs follower?', answerHint: 'Leader accepts writes and replicates; followers apply log, may serve reads.' },
    { level: 'intermediate', question: 'What is split brain?', answerHint: 'Two nodes both believe they are leader and accept writes.' },
    { level: 'advanced', question: 'Design failover for Postgres with RPO≈0.', answerHint: 'Sync replica, Patroni/etcd quorum, fencing old primary, connection proxy to new primary.' },
  ],
  flashcards: [
    { front: 'Leader-follower writes', back: 'All writes go to leader; followers read-only for writes' },
    { front: 'Failover pick', back: 'Most up-to-date log / highest term in Raft' },
    { front: 'Fencing', back: 'Prevent old leader from accepting writes after demotion' },
    { front: 'Read from follower', back: 'OK if staleness bounded; not for read-your-writes without routing' },
  ],
  quickRevision: [
    'Single writer leader',
    'WAL/binlog replication',
    'Sync vs async',
    'Failover + fence',
    'Raft = leader election',
  ],
  systemDesign: {
    problem: 'Design HA order service with leader-follower Postgres and zero lost confirmed orders on AZ failure.',
    requirements: {
      functional: ['Create order', 'Get order status', 'Idempotent create'],
      nonFunctional: ['RPO 0 for confirmed orders', 'RTO < 2 min', '10k orders/s peak'],
    },
    scaleAssumptions: ['10k write/s peak', '50k read/s', 'Single region multi-AZ'],
    capacityEstimates: ['Primary handles writes; 2 sync standbys in other AZs'],
    api: [{ type: 'code', language: 'http', code: `POST /orders Idempotency-Key\nGET /orders/{id}` }],
    dataModel: [{ type: 'list', items: ['orders table on primary', 'Streaming replication to 2 sync standbys'] }],
    highLevelArchitecture: [
      { type: 'paragraph', text: 'Patroni-managed Postgres: synchronous_commit=remote_apply on 2 standbys; PgBouncer routes writes to primary; reads to primary or lag-checked replica.' },
    ],
    diagram: {
      mermaid: `flowchart TB
  App --> PgB[PgBouncer]
  PgB --> Primary[(Primary AZ-a)]
  Primary -->|sync repl| S1[(Standby AZ-b)]
  Primary -->|sync repl| S2[(Standby AZ-c)]
  etcd[etcd quorum] --> Patroni[Patroni failover]`,
      caption: 'Sync standbys + automated failover',
    },
    dataFlow: ['Write to primary waits sync ack', 'Read status from primary or replica if lag=0'],
    storage: ['Postgres HA cluster'],
    caching: ['Redis for idempotency keys only — not order source of truth'],
    asyncProcessing: ['Outbox to Kafka after commit'],
    scaling: ['Vertical primary + read replicas; shard when write bound'],
    consistency: ['Strong on primary reads after write'],
    reliability: ['Sync replication + fencing'],
    failureScenarios: ['AZ loss → promote sync standby', 'Old primary isolated → fence'],
    security: ['TLS replication', 'Private subnets'],
    observability: ['Lag, sync state, failover events'],
    bottlenecks: ['Primary write CPU', 'Sync replica slowdown blocks commits'],
    alternatives: ['Citus sharded Postgres'],
    tradeoffs: ['Sync latency vs RPO', 'Read replica staleness vs load'],
    interviewFollowUps: ['Why etcd?', 'Partial sync failure behavior?'],
    evolution: [
      { stage: '1. Simple design', description: 'Single Postgres.', bottleneck: 'No HA.' },
      { stage: '2. Improve', description: 'Async standby.', bottleneck: 'Data loss on crash.' },
      { stage: '3. Improve', description: 'Sync standbys + Patroni.', bottleneck: 'Write latency.' },
      { stage: '4. Scale further', description: 'Sharding + per-shard leader-follower.', bottleneck: 'Cross-shard transactions.' },
    ],
  },
}
