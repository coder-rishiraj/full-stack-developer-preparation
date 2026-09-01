import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Database replication copies data from a primary database to one or more replicas for high availability, disaster recovery, and read scaling. Mechanisms include log shipping (WAL/binlog), streaming replication, and storage-level replication. Sync vs async defines RPO on failover.',
  whyExists:
    'Single database instances fail. Replication provides standby promotion, geographic DR, and offload of read-heavy workloads. It differs from application-level caching — replicas hold full (or partial) copy of data with transactional log ordering.',
  mentalModel:
    'Primary is write head; replicas tail the log. Lag measured in seconds or bytes. Failover promotes best replica; apps must reconnect. Replication is not backup — need PITR snapshots too.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Postgres streaming replication',
      diagram: `flowchart LR
  Primary[(Primary)] -->|WAL stream| S1[(Standby 1)]
  Primary -->|WAL stream| S2[(Standby 2)]
  AppW[Writes] --> Primary
  AppR[Reads] --> S1`,
    },
    {
      type: 'table',
      headers: ['Mode', 'RPO', 'Latency impact'],
      rows: [
        ['Async', 'May lose last seconds of writes', 'Minimal on primary'],
        ['Sync (remote_apply)', 'Near zero if sync standby promoted', 'Every commit waits replica ack'],
        ['Logical replication', 'Table-level selective', 'Useful for upgrades/migrations'],
        ['Storage replication (EBS/NetApp)', 'Block-level', 'Vendor-specific failover'],
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'MySQL async replica for reporting: nightly heavy queries run on replica; if replica 2h lag, dashboards show stale but acceptable data. Production checkout always uses primary connection.',
    },
  ],
  tradeoffs: {
    advantages: ['HA failover', 'Read scale', 'DR in second region', 'Online maintenance on primary with replica'],
    disadvantages: ['Lag and consistency complexity', 'Storage multiplied', 'Failover automation needed', 'Sync slows writes'],
    alternatives: ['Backup/restore only (high RTO)', 'Distributed DB with built-in replication'],
    whenToUse: ['All production databases', 'Read-heavy analytics separation'],
    whenNotToUse: ['When misused as cache without lag awareness'],
  },
  failureModes: [
    'Split brain dual primary',
    'Promote out-of-date replica',
    'Replication slot bloat fills disk on primary',
    'Cascade: slow replica blocks sync commits',
    'Logical replication schema drift',
  ],
  production: {
    reliability: ['Automated failover (Patroni, RDS Multi-AZ)', 'Regular failover drills'],
    observability: ['Lag seconds, WAL queue, replication state'],
    performance: ['Hot standby feedback', 'Limit replica count vs write amplification'],
    security: ['TLS for replication connections'],
    maintainability: ['Runbook rejoin former primary as replica'],
  },
  interview: {
    expectations: ['Async vs sync', 'Read replica lag', 'Failover RPO/RTO'],
    commonQuestions: ['Replication vs backup?', 'Safe read from replica?'],
    followUps: ['Logical vs physical replication?'],
    misconceptions: ['Replica replaces backup', 'Unlimited replicas free'],
    traps: ['Financial read from lagging replica'],
    strongSignals: ['Patroni/etcd', 'Lag-aware routing', 'Fencing'],
  },
  keyTakeaways: [
    'Primary writes; replicas apply log.',
    'Async fast; sync safer on failover.',
    'Read replicas scale reads not writes.',
    'Monitor lag; route strong reads to primary.',
    'Replication complements PITR backups.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Purpose of DB replication?', answerHint: 'HA, DR, read scaling.' },
    { level: 'intermediate', question: 'Async replication data loss risk?', answerHint: 'Unreplicated WAL on primary crash may be lost.' },
    { level: 'advanced', question: 'Design zero-downtime major version upgrade Postgres?', answerHint: 'Logical replication to new version cluster, cutover, verify lag zero.' },
  ],
  flashcards: [
    { front: 'RPO with async repl', back: 'Potential loss of unreplicated transactions on primary failure' },
    { front: 'Read replica', back: 'Offloads reads; may lag primary' },
    { front: 'Replication slot', back: 'Prevents WAL deletion until consumer catches up — can fill disk' },
    { front: 'Multi-AZ RDS', back: 'Sync replication failover within region managed service' },
  ],
  quickRevision: [
    'WAL/binlog shipping',
    'Async vs sync RPO',
    'Lag monitoring',
    'Failover + fence',
    'Not a backup substitute',
  ],
  systemDesign: {
    problem: 'Design Postgres HA with read scaling for analytics and RPO≈0 for payment tables in single region.',
    requirements: {
      functional: ['OLTP writes', 'Analytics on replica', 'Automated failover'],
      nonFunctional: ['RPO 0 payments', 'RTO < 2 min', 'Replica lag alert > 10s'],
    },
    scaleAssumptions: ['5k write/s', '20k read/s analytics'],
    capacityEstimates: ['1 primary + 2 sync standbys + 2 async read replicas'],
    api: [{ type: 'paragraph', text: 'Connection pools route by operation type' }],
    dataModel: [{ type: 'list', items: ['Same schema all nodes', 'PgBouncer primary vs replica DSNs'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'Patroni 3-node sync cluster + async replicas for BI; proxy routes queries.' }],
    diagram: {
      mermaid: `flowchart TB
  OLTP --> Primary
  Primary --> Sync1[Sync standby]
  Primary --> Sync2[Sync standby]
  Primary -.async.-> RO1[Read replica BI]
  BI --> RO1`,
      caption: 'Tiered replication topology',
    },
    dataFlow: ['Payments → primary only', 'BI → async replica if lag OK'],
    storage: ['Postgres cluster'],
    caching: ['Separate Redis layer'],
    asyncProcessing: ['CDC from replica to warehouse optional'],
    scaling: ['More async replicas; shard if write bound'],
    consistency: ['Strong OLTP primary; eventual BI'],
    reliability: ['Sync HA cluster'],
    failureScenarios: ['Sync standby slow blocks writes — monitor and replace node'],
    security: ['Replication auth'],
    observability: ['Lag, patroni state'],
    bottlenecks: ['Primary write limit'],
    alternatives: ['Aurora shared storage replication'],
    tradeoffs: ['Sync count vs write latency'],
    interviewFollowUps: ['Cross-region async DR RPO?'],
    evolution: [
      { stage: '1. Simple design', description: 'Single instance.', bottleneck: 'Outages.' },
      { stage: '2. Improve', description: 'Async replica.', bottleneck: 'RPO.' },
      { stage: '3. Improve', description: 'Sync HA + read replicas.', bottleneck: 'Write scale.' },
      { stage: '4. Scale further', description: 'Sharding + per-shard replication.', bottleneck: 'Cross-shard queries.' },
    ],
  },
}
