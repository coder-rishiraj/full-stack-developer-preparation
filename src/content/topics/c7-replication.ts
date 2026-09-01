import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'PostgreSQL streaming replication copies WAL (Write-Ahead Log) from primary to one or more standby replicas — physical byte-for-byte copies for read scaling and failover. Logical replication publishes row-level changes for selective tables or cross-version upgrades. Synchronous vs asynchronous trade latency for durability.',
  whyExists:
    'Single DB is SPOF. Replicas serve read traffic (reports, analytics) offloading primary, and provide hot standby for failover when primary fails. WAL shipping is foundation of Postgres HA with tools like Patroni, RDS Multi-AZ.',
  mentalModel:
    'Primary writes journal (WAL); standbys replay journal in order staying seconds behind. Read-only queries on replica may see slightly stale data. Sync replica waits for ACK before commit confirmed to client — zero data loss possible at cost of latency.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Streaming replication flow',
      diagram: `flowchart LR
  AppW[App writes] --> Primary
  Primary -->|WAL stream| Standby1[Hot standby]
  Primary -->|WAL stream| Standby2[Read replica]
  AppR[App reads] --> Standby2
  Primary -.->|sync rep| Standby1`,
    },
    {
      type: 'table',
      headers: ['Mode', 'Behavior', 'Tradeoff'],
      rows: [
        ['Async replication', 'Commit after local WAL; replicate later', 'Fast; small RPO window on crash'],
        ['Sync replication', 'Commit after replica ACK (quorum)', 'Higher latency; lower RPO'],
        ['Hot standby', 'Replica accepts read queries', 'May cancel queries on conflict with apply'],
        ['Logical replication', 'Publication/subscription per table', 'Selective, upgrades, CDC to external'],
      ],
    },
    {
      type: 'list',
      items: [
        'synchronous_commit=on + synchronous_standby_names for sync tier.',
        'Replication lag: pg_stat_replication.replay_lag — alert if growing.',
        'Hot standby conflicts: long replica query vs vacuum on primary cancels query.',
        'RDS/Aurora: Multi-AZ sync standby; Aurora replicas share storage layer.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'Check replication lag on primary',
      code: `SELECT client_addr, state, sent_lsn, write_lsn, flush_lsn, replay_lsn,
       pg_wal_lsn_diff(sent_lsn, replay_lsn) AS lag_bytes
FROM pg_stat_replication;`,
    },
    {
      type: 'paragraph',
      text: 'E-commerce: primary handles checkout writes; 2 async read replicas serve product catalog and order history. Reporting replica with 30s lag acceptable. Patroni promotes sync standby on primary failure — RTO under 60s with connection pooler redirect.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'WAL sender process on primary streams to walsender; standby walreceiver pulls.',
        'Recovery on standby replays WAL via startup process — read-only until promoted.',
        'Replication slots prevent WAL removal until consumer catches up — monitor disk.',
        'Logical decoding outputs row changes for Debezium/Kafka pipelines.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Read scale-out', 'HA failover target', 'Offload analytics queries'],
    disadvantages: ['Replication lag — stale reads', 'Sync rep adds write latency', 'Conflict cancellation on hot standby'],
    alternatives: ['Connection pooler + single primary only', 'Read replicas via caching layer', 'Citus sharding'],
    whenToUse: ['Read-heavy workloads', 'HA requirements', 'CDC via logical replication'],
    whenNotToUse: ['Need strongly consistent reads immediately after write — read from primary'],
  },
  failureModes: [
    'Replica lag minutes — reads show old inventory counts',
    'Replication slot bloat fills primary disk',
    'Failover without pooler — apps still point at dead primary',
    'Split-brain if two nodes think they are primary',
    'Long transaction on replica blocks WAL cleanup',
  ],
  production: {
    reliability: ['Patroni/etcd or RDS Multi-AZ automated failover', 'Monitor replay_lag alerts'],
    scalability: ['Route read-only traffic via separate datasource URL', 'Limit heavy reports to dedicated replica'],
    observability: ['Lag bytes, state, last replay timestamp dashboards'],
    security: ['Replication uses dedicated replication role with minimal privileges'],
  },
  interview: {
    expectations: ['WAL streaming', 'Sync vs async', 'Replication lag', 'Read your writes problem'],
    commonQuestions: ['Scale Postgres reads?', 'Explain replication lag?', 'Failover approach?'],
    followUps: ['Logical vs physical replication?', 'Replication slot purpose?'],
    misconceptions: ['Replicas are writable by default', 'Zero lag always'],
    traps: ['Reading replica right after write expecting consistency'],
    strongSignals: ['RPO/RTO framing', 'Patroni failover', 'Lag monitoring', 'Read/write split in app'],
  },
  keyTakeaways: [
    'Streaming replication ships WAL from primary to standbys.',
    'Async replicas lag — reads may be stale.',
    'Sync replication reduces RPO at latency cost.',
    'Monitor replay_lag and replication slot disk usage.',
    'Route consistent reads to primary; analytics to replica.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why PostgreSQL read replica?', answerHint: 'Offload read queries and provide standby for failover — replays primary WAL.' },
    { level: 'intermediate', question: 'Sync vs async replication?', answerHint: 'Sync waits for replica ACK before commit — durable but slower; async commits first.' },
    { level: 'advanced', question: 'User updates profile then sees old name?', answerHint: 'Read-after-write on async replica — route session reads to primary or use sticky routing.' },
  ],
  flashcards: [
    { front: 'WAL', back: 'Write-Ahead Log — ordered changes replicated to standbys' },
    { front: 'Hot standby', back: 'Replica accepting read queries while applying WAL' },
    { front: 'replay_lag', back: 'How far behind replica is vs primary LSN' },
    { front: 'Replication slot', back: 'Retains WAL until consumer catches up — prevents premature delete' },
  ],
  quickRevision: ['WAL streaming', 'Async = stale reads', 'Sync = lower RPO', 'Monitor lag', 'Failover tooling'],
}
