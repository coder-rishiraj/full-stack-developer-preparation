import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Event streams (log-based messaging) append immutable ordered records to partitions consumed by multiple independent consumer groups with retention — enabling replay, real-time pipelines, and high throughput. Examples: Apache Kafka, Pulsar, Kinesis, Redpanda. Contrast with transient queues.',
  whyExists:
    'Queues delete after ack; analytics, audit, and multiple teams need the same events at different speeds with history. Kafka\'s durable log + consumer offsets decouple producers from many subscribers and allow reprocessing.',
  mentalModel:
    'Append-only commit log per partition. Producers append; consumers track offset cursor. Partition key routes related events to same partition for order. Retention time/size keeps disk bounded.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Concept', 'Role', 'Implication'],
      rows: [
        ['Topic', 'Named stream', 'Logical channel e.g. orders'],
        ['Partition', 'Ordered shard of topic', 'Parallelism unit; key hash → partition'],
        ['Consumer group', 'Cooperative consumers', 'Each partition consumed by one member in group'],
        ['Offset', 'Position in log', 'Commit after process — at-least-once if after side effect care'],
        ['Retention', 'Keep N days/GB', 'Replay window; compaction for changelog topics'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Multiple consumer groups same topic',
      diagram: `flowchart TB
  P[Producers] --> T[Topic orders]
  T --> P0[Partition 0]
  T --> P1[Partition 1]
  P0 --> G1[Group: fulfillment]
  P0 --> G2[Group: analytics]
  P1 --> G1
  P1 --> G2`,
    },
    {
      type: 'list',
      items: [
        'Key=user_id keeps user events ordered per partition',
        'Exactly-once Kafka transactions limited scope — often idempotent producer + consumer',
        'Compacted topics keep latest key record — good for config/changelog',
        'Stream processing (Flink/kstreams) transforms topics in real time',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Order service produces to orders topic (key=order_id). Fulfillment group processes for shipping; analytics group loads warehouse hours later; both read same events independently. Replay analytics after bug fix by resetting offsets.',
    },
    {
      type: 'code',
      language: 'text',
      caption: 'Partition key choice',
      code: `key=order_id     → all events for order ordered in one partition
key=null round-robin → max parallelism, no per-entity order
Too few partitions → throughput ceiling
Too many partitions → broker overhead`,
    },
  ],
  tradeoffs: {
    advantages: ['High throughput', 'Replay', 'Multiple consumers', 'Retention audit trail'],
    disadvantages: ['Operational complexity', 'Ordering only per partition', 'Not ideal for RPC task queue semantics alone'],
    alternatives: ['SQS for simple task queues', 'Redis streams for lighter weight'],
    whenToUse: ['Event sourcing feed', 'CDC pipelines', 'Metrics/logs', 'Microservice choreography'],
    whenNotToUse: ['Single consumer job queue with delete-on-ack simplicity only'],
  },
  failureModes: [
    'Consumer lag unbounded — disk retention expires before catch-up',
    'Hot partition from bad key choice',
    'Offset commit before process → lost message on crash',
    'Offset commit after process → duplicate on crash',
    'Rebalance storm during deploy',
  ],
  production: {
    performance: ['Batch produce/consume', 'Compression lz4/zstd', 'Right partition count'],
    scalability: ['Add brokers/partitions; consumer group scale ≤ partitions'],
    reliability: ['Replication factor 3', 'min.insync.replicas=2', 'Monitor under-replicated partitions'],
    observability: ['Consumer lag per group/partition', 'Broker disk', 'Rebalance metrics'],
    maintainability: ['Schema registry (Avro/Protobuf)', 'Topic naming conventions'],
    cost: ['Retention disk; tiered storage for old data'],
  },
  interview: {
    expectations: ['Partition vs consumer group', 'At-least-once offset commit', 'Stream vs queue'],
    commonQuestions: ['Kafka vs SQS?', 'Ordering guarantees?'],
    followUps: ['Exactly-once?', 'Hot partition fix?'],
    misconceptions: ['Kafka deletes after read like queue', 'Unlimited consumers per partition in one group'],
    traps: ['Commit offset before side effect without idempotency'],
    strongSignals: ['Key design', 'Lag monitoring', 'Schema evolution', 'Compacted changelog topics'],
  },
  keyTakeaways: [
    'Durable append log; retention enables replay.',
    'Partition = ordering + parallelism unit.',
    'Consumer groups scale independently per use case.',
    'At-least-once default — idempotent processing.',
    'Choose keys to avoid hot partitions.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Kafka vs message queue?', answerHint: 'Kafka durable log multiple consumers replay; queue task buffer delete on ack.' },
    { level: 'intermediate', question: 'How achieve ordering?', answerHint: 'Same partition via key; single consumer per partition in group.' },
    { level: 'advanced', question: 'Consumer lag growing — actions?', answerHint: 'Scale consumers up to partition count, optimize handler, add partitions cautiously, extend retention, fix slow downstream.' },
  ],
  flashcards: [
    { front: 'Consumer group', back: 'Each partition assigned to one consumer in group for parallel read' },
    { front: 'Offset commit after process', back: 'At-least-once; duplicates if crash after effect before commit' },
    { front: 'Log compaction', back: 'Keep latest record per key; changelog topics' },
    { front: 'Partitions vs throughput', back: 'More partitions increase parallel write/read ceiling' },
  ],
  quickRevision: [
    'Append-only log',
    'Partition key ordering',
    'Consumer groups independent',
    'Lag + retention',
    'Idempotent handlers',
  ],
  systemDesign: {
    problem: 'Build real-time analytics pipeline from user clickstream (1M events/s) with replay for batch correction.',
    requirements: {
      functional: ['Ingest clicks', 'Real-time aggregates', 'Replay last 7 days'],
      nonFunctional: ['1M events/s', '7-day retention', 'Schema evolution'],
    },
    scaleAssumptions: ['1M/s ingest', '10 analytics consumer instances', '100 partitions'],
    capacityEstimates: ['~500B/event × rate → TB/day; RF=3 cluster sizing'],
    api: [{ type: 'paragraph', text: 'HTTP/gRPC ingest gateway → Kafka producer batch' }],
    dataModel: [{ type: 'list', items: ['Topic clicks keyed by user_id', 'Avro schema in registry', 'Flink job → aggregates topic'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'Kafka cluster RF=3; Flink real-time; S3 sink for warehouse; consumer groups isolated.' }],
    diagram: {
      mermaid: `flowchart LR
  Apps --> GW[Ingest gateway]
  GW --> Kafka[(Kafka)]
  Kafka --> Flink[Flink]
  Flink --> Agg[aggregates topic]
  Kafka --> S3[S3 sink]
  Agg --> Redis[(Dashboard cache)]`,
      caption: 'Stream hub with multiple derived consumers',
    },
    dataFlow: ['Produce batched → Kafka → stream jobs + batch sink', 'Replay reset offsets to S3 reload'],
    storage: ['Kafka retention 7d; S3 long-term'],
    caching: ['Redis for dashboard rollups'],
    asyncProcessing: ['Flink stream processing core'],
    scaling: ['Partitions 100+; brokers horizontal; Flink parallelism match'],
    consistency: ['Eventual aggregates; watermark for late events'],
    reliability: ['RF=3 min ISR=2', 'Mirror to DR cluster optional'],
    failureScenarios: ['Hot celebrity user partition — salt key optional trade order'],
    security: ['ACLs per topic; scrub PII at ingest'],
    observability: ['Lag, broker disk, Flink checkpoint success'],
    bottlenecks: ['Partition count ceiling — plan growth', 'Schema incompatible change'],
    alternatives: ['Kinesis fully managed smaller ops'],
    tradeoffs: ['Kafka ops vs managed cost'],
    interviewFollowUps: ['Late arriving events?', 'GDPR delete in log?'],
    evolution: [
      { stage: '1. Simple design', description: 'Batch logs to S3 hourly.', bottleneck: 'Not real-time.' },
      { stage: '2. Improve', description: 'Kafka ingest + single consumer.', bottleneck: 'Throughput.' },
      { stage: '3. Improve', description: 'Partition scale + Flink.', bottleneck: 'Ops complexity.' },
      { stage: '4. Scale further', description: 'Tiered storage; schema registry governance.', bottleneck: 'Cost at PB retention.' },
    ],
  },
}
