import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Kafka consumer groups partition work among members — each partition assigned to at most one consumer in group at a time. Enables horizontal scale: add consumers up to partition count. Group coordinator tracks membership; rebalance reassigns partitions on join/leave. Spring: @KafkaListener groupId.',
  whyExists:
    'Single consumer cannot read all partitions of high-throughput topic. Consumer groups divide partitions for parallel processing while preserving per-partition ordering. Different groups independently read same topic (pub/sub fan-out).',
  mentalModel:
    'Partitions are slices of topic. Group members each own subset of slices. Max parallelism = partition count per group. Rebalance pauses consumption briefly — minimize churn. Same group = load balance; different group = duplicate read for new service.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Consumer group partition assignment',
      diagram: `flowchart TB
  T[Topic orders 6 partitions]
  T --> P0[P0]
  T --> P1[P1]
  T --> P2[P2]
  T --> P3[P3]
  T --> P4[P4]
  T --> P5[P5]
  subgraph G1 [group billing-service]
    C1[Consumer A] --> P0
    C1 --> P1
    C2[Consumer B] --> P2
    C2 --> P3
    C3[Consumer C] --> P4
    C3 --> P5
  end`,
    },
    {
      type: 'table',
      headers: ['Concept', 'Detail'],
      rows: [
        ['group.id', 'Logical consumer app name — same id shares work'],
        ['max consumers', '≤ partition count for useful scale'],
        ['Rebalance', 'Trigger on member join/leave, subscription change'],
        ['Static membership', 'group.instance.id reduces unnecessary rebalance on restart'],
        ['Multiple groups', 'Each reads all messages independently'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Spring Kafka listener with group',
      code: `@KafkaListener(topics = "orders", groupId = "fulfillment-service")
void fulfill(ConsumerRecord<String, OrderCreated> record) {
  fulfillmentService.process(record.value());
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        '__consumer_offsets topic stores committed offsets per group-partition',
        'Group coordinator broker handles join/sync heartbeat',
        'session.timeout.ms and max.poll.interval.ms — consumer liveness',
        'Cooperative sticky assignor reduces partition movement during rebalance',
        'Consumer lag = end offset - committed offset per partition',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Horizontal scale processing', 'Fault tolerance via reassignment', 'Independent consumer groups per microservice'],
    disadvantages: ['Rebalance stops the world briefly', 'Over-sharding consumers idle', 'Ordering only per partition'],
    alternatives: ['Single consumer — no scale', 'Kafka Streams / Flink for stateful processing'],
    whenToUse: ['All multi-instance event consumers'],
    whenNotToUse: ['Need global ordering across all messages — single partition bottleneck'],
  },
  failureModes: [
    'More consumers than partitions — some idle',
    'Slow processing exceeds max.poll.interval — false dead, rebalance storm',
    'Rebalance during processing duplicates with at-least-once',
    'Same groupId on unrelated apps — steal partitions',
  ],
  production: {
    reliability: ['Tune max.poll.interval for long handlers', 'Static member ids for rolling deploys'],
    observability: ['Consumer lag per partition', 'Rebalance rate alerts'],
    scalability: ['Partition count planned at topic creation — hard to change later'],
    performance: ['Cooperative rebalance protocol', 'Concurrent processing per partition only one thread typically'],
  },
  interview: {
    expectations: ['Partition assignment', 'Max consumers = partitions', 'Rebalance impact', 'Multiple groups'],
    commonQuestions: ['How scale Kafka consumers?', 'What triggers rebalance?', 'Two services same topic?'],
    followUps: ['Cooperative rebalance?', 'Static membership?'],
    misconceptions: ['More consumers always faster', 'Same topic one consumer group only'],
    traps: ['10 consumers on 3 partitions — 7 idle'],
    strongSignals: ['Partition planning, lag monitoring, groupId naming, rebalance tuning'],
  },
  keyTakeaways: [
    'Consumer group divides partitions among members.',
    'Max useful consumers equals partition count.',
    'Rebalance on membership change — tune intervals.',
    'Different groups each read full topic independently.',
    'Ordering preserved only within one partition.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is Kafka consumer group?', answerHint: 'Set of consumers sharing group.id that jointly consume topic partitions — each partition one consumer.' },
    { level: 'intermediate', question: 'Why not 20 consumers on 6 partitions?', answerHint: 'Only 6 can work in parallel — extras idle; need more partitions to scale.' },
    { level: 'advanced', question: 'Rebalance problem during deploy?', answerHint: 'Static group.instance.id, cooperative assignor, incremental rebalance; processing pauses cause lag spike.' },
  ],
  flashcards: [
    { front: 'Consumer group', back: 'Consumers with same group.id share partition assignment' },
    { front: 'Max parallelism', back: 'Number of partitions in topic for that group' },
    { front: 'Rebalance', back: 'Reassign partitions when members join/leave' },
    { front: 'Multiple groups', back: 'Independent offset progress — fan-out to services' },
  ],
  quickRevision: ['group.id shares work', 'Consumers ≤ partitions', 'Rebalance pauses', 'Lag per partition', 'Order per partition'],
}
