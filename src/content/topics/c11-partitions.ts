import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Kafka topic partition is ordered append-only log shard. Topics split into N partitions for parallelism and scale. Each partition has leader replica on broker; followers replicate. Producers write to leader; consumers read assigned partitions. Partition count chosen at creation — increasing later is possible but rebalances keys.',
  whyExists:
    'Single log cannot scale write throughput on one broker. Partitions spread load across cluster. Consumer parallelism upper bound equals partition count. Retention and compaction apply per partition.',
  mentalModel:
    'Topic = collection of parallel logs. Pick partition count from peak throughput / consumer SLA. Keys map to partitions. More partitions = more parallelism, more files, more overhead, harder global order.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Decision', 'Guidance'],
      rows: [
        ['Partition count', 'Target throughput / single partition MB/s; ≥ max consumer instances'],
        ['Replication factor', '3 typical — tolerates 2 broker loss with min.insync.replicas=2'],
        ['Leader election', 'Controller promotes ISR follower on leader failure'],
        ['Retention', 'time (7d) or size per partition log segments'],
        ['Increase partitions', 'New keys only benefit — existing key mapping unchanged'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Topic with replication',
      diagram: `flowchart TB
  subgraph T [topic orders]
    P0[Partition 0 leader B1]
    P1[Partition 1 leader B2]
  end
  P0 --> F0[Follower B2]
  P1 --> F1[Follower B3]`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'orders topic: 24 partitions, replication 3, retention 7 days. Peak 50 MB/s → ~2 MB/s per partition within broker limits. fulfillment-service runs 12 consumers — 12 partitions actively consumed, 12 idle until scale consumers to 24.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Log segments on disk — active + immutable sealed segments',
        'Partition 0..N-1 naming topic-partition directory',
        'ISR (in-sync replicas) set for acks=all durability',
        'Alter partition count does not redistribute existing keys',
        'Rack awareness assigns replicas across failure domains',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Horizontal write/read scale', 'Fault isolation per leader', 'Configurable retention per topic'],
    disadvantages: ['Over-partitioning hurts broker metadata', 'Under-partitioning hot spots', 'Hard to reduce partition count'],
    alternatives: ['More topics vs more partitions', 'Tiered storage for old data'],
    whenToUse: ['All high-volume Kafka topics — plan upfront'],
    whenNotToUse: ['Tiny low-QPS topic — 1 partition may suffice'],
  },
  failureModes: [
    '1 partition on high traffic topic — bottleneck',
    '1000 partitions per topic on small cluster — overhead',
    'min.insync.replicas=1 with acks=all still loses data on single broker',
    'Uneven key distribution — hot partition',
  ],
  production: {
    scalability: ['Plan partition count with growth', 'Monitor per-partition disk and throughput'],
    reliability: ['replication.factor=3, min.insync.replicas=2', 'Rack awareness'],
    observability: ['Under-replicated partitions alert', 'Leader election rate'],
  },
  interview: {
    expectations: ['Partition role', 'Choose count', 'Replication', 'Key mapping'],
    commonQuestions: ['How many partitions?', 'What is ISR?', 'Increase partitions effect?'],
    followUps: ['Hot partition?', 'Leader failure?'],
    misconceptions: ['Partitions are queues with competing consumers globally', 'Can shrink partitions easily'],
    traps: ['Single partition for 1M msg/s topic'],
    strongSignals: ['Throughput math, RF=3, min ISR, partition key skew awareness'],
  },
  keyTakeaways: [
    'Partitions enable parallel writes and consumer scale.',
    'Count partitions from throughput and consumer targets.',
    'Replication factor 3 + min.insync.replicas 2 common prod default.',
    'Partition key determines which log shard.',
    'Adding partitions does not rebalance existing keys.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why Kafka partitions?', answerHint: 'Scale throughput and parallelism — ordered log per partition.' },
    { level: 'intermediate', question: 'How choose partition count?', answerHint: 'Peak producer rate / partition capacity; max consumer instances; avoid over-metadata overhead.' },
    { level: 'advanced', question: 'Leader broker dies?', answerHint: 'Controller elects new leader from ISR follower; brief unavailability; producers/consumers metadata refresh.' },
  ],
  flashcards: [
    { front: 'Partition', back: 'Ordered immutable log shard of topic' },
    { front: 'ISR', back: 'In-sync replicas eligible for leader election' },
    { front: 'Replication factor', back: 'Copy count of each partition across brokers' },
    { front: 'Add partitions', back: 'Only new key assignments — existing keys stay' },
  ],
  quickRevision: ['Parallel logs', 'Plan count upfront', 'RF3 minISR2', 'Key→partition', 'Leader per partition'],
}
