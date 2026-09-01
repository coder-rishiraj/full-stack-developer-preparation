import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Database growth estimation projects storage needs over time — row count × row size × growth rate, plus indexes (often 20–50% overhead), logs, backups, and archival. Drives shard timing, disk provisioning, retention policies, and cost forecasts.',
  whyExists:
    'Running out of disk causes write outages. Unplanned sharding under fire is painful. Growth math from DAU, objects per user, and retention tells you when to partition, archive cold data, or change schema before crisis.',
  mentalModel:
    'Filling a bathtub: inflow = new rows/day, outflow = deletes/archival, volume = cumulative water. Indexes and WAL are hidden overflow pipes adding 30%+ volume. Plan when tub hits 70% capacity, not 99%.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Factor', 'Estimate', 'Example'],
      rows: [
        ['Rows/year', 'DAU × objects/user/day × 365', '10M DAU × 5 posts × 365'],
        ['Row size', 'Field types + JSON overhead', '500 B average post row'],
        ['Raw data/year', 'rows × row_size', 'TB/year'],
        ['Indexes', '+30–50% of table size', 'Secondary indexes on user_id, created_at'],
        ['Retention', 'Delete/archive after N years', 'Halves effective growth'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Growth and sharding trigger',
      diagram: `flowchart LR
  Growth[Data growth over time] --> Threshold[70% disk capacity]
  Threshold --> Archive[Archive cold tier]
  Threshold --> Shard[Horizontal shard]
  Archive --> S3[(Object storage)]
  Shard --> DB2[(Shard 2)]`,
    },
    {
      type: 'list',
      items: [
        'Compound growth: year N = base × (1 + rate)^N',
        'Separate hot (90-day) vs cold storage economics',
        'Write amplification: updates create new row versions in some DBs',
        'Backup storage often 2–3× primary if incremental not optimized',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Chat messages: 5M DAU, 50 messages/user/day avg, 200 B/message → 5M × 50 × 200 B = 50 GB/day raw ≈ 18 TB/year. Indexes +30% → 23 TB/year. Retain 1 year hot in Postgres, archive older to S3 Parquet → steady-state ~25 TB DB + cheap cold storage.',
    },
  ],
  tradeoffs: {
    advantages: ['Proactive sharding and budget', 'Informs retention and archival design'],
    disadvantages: ['Growth assumptions wrong — viral skew', 'Schema changes alter row size'],
    alternatives: ['Elastic cloud disk — delays but does not remove shard need'],
    whenToUse: ['Social, logging, IoT, event stores', 'Interview capacity section'],
    whenNotToUse: ['Static catalog with bounded rows'],
  },
  failureModes: [
    'Forgot index overhead — disk full early',
    'Unbounded log/event table without TTL',
    'Underestimated JSON blob growth',
    'No archival — linear growth forever on expensive SSD',
    'Shard too late — migration downtime',
  ],
  production: {
    scalability: ['Shard plan at 70% capacity', 'Partition by time for append-only'],
    cost: ['Tiered storage hot SSD vs cold S3/Glacier', 'Compression on archive'],
    observability: ['Disk usage forecast alerts', 'Table size dashboards'],
    maintainability: ['Retention jobs automated', 'Schema review for blob bloat'],
    reliability: ['Auto-expand disk with upper bound alert'],
  },
  interview: {
    expectations: ['DAU × objects × size × time', 'Index overhead', 'Archival tier'],
    commonQuestions: ['Estimate Twitter storage 5 years?', 'When shard?'],
    followUps: ['Cold vs hot storage?', 'Delete vs soft-delete growth?'],
    misconceptions: ['Row count alone without bytes', 'Infinite cloud disk solves sharding'],
    traps: ['Ignore message/media attachment size'],
    strongSignals: ['Retention policy', 'Archive to object store', '70% shard trigger'],
  },
  keyTakeaways: [
    'Annual storage ≈ rows/year × row_size × (1 + index overhead).',
    'Derive rows from DAU × actions per user × time.',
    'Plan sharding/archival before 70–80% disk.',
    'Tier hot DB vs cold object storage for cost.',
    'Backups and replicas multiply storage cost.',
  ],
  interviewQuestions: [
    { level: 'basic', question: '1M users, 1 KB profile row — total?', answerHint: '1M × 1 KB ≈ 1 GB raw plus index overhead.' },
    { level: 'intermediate', question: '10M DAU 10 posts/day 500 B — yearly?', answerHint: '10M × 10 × 500 B × 365 ≈ 18 TB/year raw.' },
    { level: 'advanced', question: 'DB 80% full — options?', answerHint: 'Archive cold data, vertical disk, horizontal shard, partition drops, compress, retention policy — plan before emergency.' },
  ],
  flashcards: [
    { front: 'DB growth formula', back: 'users × objects/user × row_size × time' },
    { front: 'Index overhead rule', back: 'Often add 30–50% to raw table size' },
    { front: 'Shard timing', back: 'Plan near 70% capacity not 99%' },
    { front: 'Tiered storage', back: 'Hot rows in DB, cold archive to object store' },
  ],
  quickRevision: [
    'DAU × actions × size',
    'Index +30%',
    'Retention/archival',
    'Shard at 70%',
    'Backup multiplier',
  ],
}
