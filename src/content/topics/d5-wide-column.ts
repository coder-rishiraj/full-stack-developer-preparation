import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Wide-column (column-family) stores organize data by partition key with sorted columns within each row — optimized for massive scale reads/writes over known partition keys and range scans within partition. Examples: Apache Cassandra, HBase, Google Bigtable. Schema thinks in query patterns first.',
  whyExists:
    'Relational and document DBs struggle at billions of rows with high write throughput and geo distribution. Wide-column trades flexible ad-hoc queries for predictable partition-local access and tunable consistency — built for time-series, messaging metadata, and large-scale event storage.',
  mentalModel:
    'Nested map: partition key → row key → column → value. Design table per query; denormalize aggressively. Writes go to partition owner nodes via consistent hashing.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Concept', 'Cassandra example', 'Meaning'],
      rows: [
        ['Partition key', 'user_id in PRIMARY KEY', 'Which nodes store row'],
        ['Clustering columns', 'timestamp in PK', 'Sort order within partition'],
        ['Column families', 'Table per query pattern', 'messages_by_user vs users_by_id'],
        ['Consistency', 'ONE / QUORUM / LOCAL_QUORUM', 'Per-query tunable'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Partition-local range scan',
      diagram: `flowchart TB
  PK["Partition key user_id=42"]
  PK --> R1["ts=10 msg=A"]
  PK --> R2["ts=11 msg=B"]
  PK --> R3["ts=12 msg=C"]
  Scan[Range scan ts DESC LIMIT 50] --> PK`,
    },
    {
      type: 'list',
      items: [
        'Denormalize: duplicate data into multiple tables for different queries',
        'Avoid cross-partition transactions — rare and expensive',
        'Compaction merges SSTables — tune for read vs write amplification',
        'TTL on columns/rows for automatic expiry',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'Cassandra messaging schema',
      code: `CREATE TABLE messages_by_user (
  user_id uuid,
  bucket int,        -- e.g. hash(user_id) % 100 for size control
  msg_id timeuuid,
  body text,
  PRIMARY KEY ((user_id, bucket), msg_id)
) WITH CLUSTERING ORDER BY (msg_id DESC);

-- Query: latest messages for user in one partition scan`,
    },
  ],
  tradeoffs: {
    advantages: ['Linear scale-out', 'Multi-region active', 'High write throughput', 'TTL built-in'],
    disadvantages: ['Query rigidity — must design upfront', 'Limited joins', 'Operational complexity'],
    alternatives: ['DynamoDB (managed wide-column-ish)', 'Timescale for SQL time-series'],
    whenToUse: ['Time-series, IoT, messaging inbox, metrics at scale'],
    whenNotToUse: ['Ad-hoc analytics joins', 'Frequent schema changes without new tables'],
  },
  failureModes: [
    'Bad partition key → single hot partition',
    'Large partition (>100MB guidance) slow repairs',
    'QUORUM misconfig cross-DC latency',
    'Delete tombstones without compaction → read slowdown',
    'Lightweight transactions overused',
  ],
  production: {
    performance: ['Right-size partitions with bucketing', 'LOCAL_QUORUM in single DC reads'],
    scalability: ['Add nodes; vnode rebalance', 'Separate clusters per workload'],
    reliability: ['RF=3 minimum production', 'Repair after node loss'],
    observability: ['Compaction lag, pending compactions, latencies per CL', 'Hot partition metrics'],
    maintainability: ['Document one table per query pattern', 'Migration via dual-write new table'],
  },
  interview: {
    expectations: ['Partition vs clustering key', 'Denormalize for queries', 'Tunable consistency'],
    commonQuestions: ['Cassandra vs Mongo?', 'Design time-series schema?'],
    followUps: ['Hot partition fix?', 'Repair vs anti-entropy?'],
    misconceptions: ['Cassandra is always eventually consistent — QUORUM can be strong-ish', 'Unlimited partition size'],
    traps: ['Low-cardinality partition key only'],
    strongSignals: ['Multiple tables same data different keys', 'Bucket pattern', 'RF and CL math'],
  },
  keyTakeaways: [
    'Query-first schema: partition key drives distribution.',
    'Clustering columns sort within partition for range scans.',
    'Denormalize tables per access pattern.',
    'Tunable consistency ONE/QUORUM per operation.',
    'Watch partition size and hot keys — bucket if needed.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Partition key role?', answerHint: 'Determines which nodes hold data; all range scan within partition.' },
    { level: 'intermediate', question: 'Why multiple tables for same data in Cassandra?', answerHint: 'Different partition keys for different query paths — denormalization.' },
    { level: 'advanced', question: 'Hot partition on celebrity user timeline?', answerHint: 'Bucket by time or fan-out write to followers\' own partitions.' },
  ],
  flashcards: [
    { front: 'Wide-column model', back: 'Partition key → sorted columns; scale by partition' },
    { front: 'Clustering column', back: 'Sorts rows within partition for range queries' },
    { front: 'LOCAL_QUORUM', back: 'Quorum within local DC — avoids cross-DC latency' },
    { front: 'Tombstone', back: 'Delete marker until compaction — too many slow reads' },
  ],
  quickRevision: [
    'Query-first schema',
    'Partition + clustering keys',
    'Denormalize tables',
    'RF=3, CL tunable',
    'Bucket hot partitions',
  ],
  systemDesign: {
    problem: 'Store and query 500B IoT sensor events/day with per-device recent readings and hourly rollups.',
    requirements: {
      functional: ['Ingest event', 'Latest N per device', 'Hourly aggregates'],
      nonFunctional: ['500k writes/s peak', '30-day raw TTL', 'Multi-region write'],
    },
    scaleAssumptions: ['10M devices', '500k events/s', '3 DCs'],
    capacityEstimates: ['Partition (device_id, day_bucket) with clustering ts', 'Separate rollup table'],
    api: [{ type: 'paragraph', text: 'Kafka ingest → Cassandra writers; query API reads Cassandra' }],
    dataModel: [
      {
        type: 'list',
        items: [
          'events_by_device: PK (device_id, day), clustering ts, values',
          'rollups_hourly: PK (device_id, hour), avg/max',
          'TTL 30d on raw events table',
        ],
      },
    ],
    highLevelArchitecture: [{ type: 'paragraph', text: 'Kafka → stream writers → Cassandra; Spark/Flink for rollups async.' }],
    diagram: {
      mermaid: `flowchart LR
  Devices --> Kafka
  Kafka --> Writers[Cassandra writers]
  Writers --> C[(Cassandra cluster)]
  Flink[Flink rollups] --> C
  API --> C`,
      caption: 'Write-heavy ingest with query-optimized tables',
    },
    dataFlow: ['Ingest to events table', 'Flink writes rollups', 'API reads latest from partition head'],
    storage: ['Cassandra RF=3 LOCAL_QUORUM writes'],
    caching: ['Optional Redis latest value cache per device'],
    asyncProcessing: ['Flink hourly aggregation'],
    scaling: ['Add Cassandra nodes; Kafka partitions by device_id'],
    consistency: ['ONE for ingest speed; QUORUM for rollup reads if needed'],
    reliability: ['RF + repair jobs'],
    failureScenarios: ['Hot device flood → partition bucket by hour sub-key'],
    security: ['Device auth on ingest gateway'],
    observability: ['Write latency, compaction, ingest lag'],
    bottlenecks: ['Single device partition size — day bucket'],
    alternatives: ['TimescaleDB if SQL needed'],
    tradeoffs: ['Raw + rollup storage cost vs query speed'],
    interviewFollowUps: ['Cross-device analytics?', 'Backfill historical?'],
    evolution: [
      { stage: '1. Simple design', description: 'Postgres time-series.', bottleneck: 'Write scale.' },
      { stage: '2. Improve', description: 'Cassandra ingest table.', bottleneck: 'Analytics queries.' },
      { stage: '3. Improve', description: 'Rollup table + TTL.', bottleneck: 'Hot device.' },
      { stage: '4. Scale further', description: 'Separate analytics to warehouse.', bottleneck: 'Ops tuning compactions.' },
    ],
  },
}
