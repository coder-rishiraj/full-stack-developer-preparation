import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Kafka ordering guarantee: total order within single partition only. Messages with same key route to same partition via hash(key) % partitionCount — related events stay ordered. Cross-partition and cross-topic ordering not guaranteed. Increase partitions trades parallelism vs global order.',
  whyExists:
    'Distributed log cannot globally order all messages at high throughput. Partition-bound ordering matches aggregate lifecycle — all events for orderId 42 on one partition process sequentially. Design partition key accordingly.',
  mentalModel:
    'Partition is single-writer ordered queue. Key chooses queue. Wrong key (always null) round-robins — loses order for related events. Need global order → single partition bottleneck or external sequencing.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Requirement', 'Design'],
      rows: [
        ['Order events per orderId ordered', 'key=orderId'],
        ['User activity ordered per user', 'key=userId'],
        ['Global total order', '1 partition only — limits throughput'],
        ['Parallel unrelated orders', 'Many partitions different keys'],
        ['Key skew', 'Hot key overloads one partition'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Key to partition mapping',
      diagram: `flowchart LR
  P[Producer key=order-42] --> H[hash % 6]
  H --> PART2[Partition 2]
  P2[Producer key=order-99] --> H2[hash % 6]
  H2 --> PART5[Partition 5]`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'OrderCreated, PaymentCaptured, OrderShipped all use key orderId — single consumer thread per partition processes in publish order. Inventory for different orders parallel across partitions.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Default partitioner: murmur2 hash of key',
        'Custom partitioner for rack awareness or manual routing',
        'Increasing partition count does not reorder existing keys predictably without re-key',
        'Compacted topics still ordered per key within partition',
        'Kafka Streams repartition topic for key change mid-topology',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['High throughput with partial order', 'Natural aggregate boundary'],
    disadvantages: ['No cross-partition order', 'Hot partition from bad key', 'Single partition scale ceiling'],
    alternatives: ['Sequence number in payload + idempotent reorder buffer', 'Synchronization service — usually avoid'],
    whenToUse: ['Domain events per entity id'],
    whenNotToUse: ['When strict cross-entity order required without design'],
  },
  failureModes: [
    'Null key round-robin breaks orderCreated before orderPaid sequence',
    'Repartition without thinking loses order during migration',
    'Multiple consumers same partition via over-threading breaks order if not careful',
    'Assuming topic-level order with 12 partitions',
  ],
  production: {
    performance: ['Monitor partition skew — hot keys', 'Custom partitioner if needed'],
    scalability: ['Enough partitions for throughput — not only consumer count'],
    observability: ['Bytes in rate per partition imbalance alert'],
  },
  interview: {
    expectations: ['Order within partition', 'Partition key choice', 'No global order'],
    commonQuestions: ['Guarantee order for order events?', 'Partition key selection?', 'One partition enough?'],
    followUps: ['Hot key problem?', 'Repartition in Streams?'],
    misconceptions: ['Kafka orders entire topic', 'More consumers increase ordering scope'],
    traps: ['Random key for related lifecycle events'],
    strongSignals: ['Entity id as key, partition count planning, skew monitoring'],
  },
  keyTakeaways: [
    'Ordering only within one partition.',
    'Partition key = aggregate id for lifecycle events.',
    'Null key → round-robin → no related order.',
    'Global order requires single partition — scale limit.',
    'Watch hot key partition skew.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Kafka ordering scope?', answerHint: 'Strict order only within single partition, not across partitions or topic.' },
    { level: 'intermediate', question: 'Partition key for order workflow?', answerHint: 'orderId — all order events land same partition sequential.' },
    { level: 'advanced', question: 'Hot partition from celebrity user?', answerHint: 'Salting key with hash buckets, dedicated topic, or async fan-out — accept partial order trade-offs.' },
  ],
  flashcards: [
    { front: 'Partition ordering', back: 'Total order within partition only' },
    { front: 'Partition key', back: 'Determines partition — same key same order' },
    { front: 'Null key', back: 'Round-robin — no ordering guarantee related messages' },
    { front: 'Hot partition', back: 'Skewed key overloads one broker/partition' },
  ],
  quickRevision: ['Order per partition', 'Key = entity id', 'No global order', 'Avoid null key', 'Watch skew'],
}
