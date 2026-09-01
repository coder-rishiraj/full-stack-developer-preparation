import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Kafka internals: brokers store partitioned commit logs on disk; producers append records; consumers track offset per partition; ZooKeeper/KRaft manages cluster metadata. Each partition is ordered immutable sequence identified by offset — replication copies segments to ISR (in-sync replicas) for durability.',
  whyExists:
    'Understanding internals explains throughput limits, ordering guarantees, consumer lag, and failure behavior. Architects choose partition count, replication factor, and acks policy based on log segment layout, leader election, and fetch mechanics — not just API surface.',
  mentalModel:
    'Partition = append-only log file on disk split into segments. One leader broker serves reads/writes per partition; followers replicate. Consumer is a pointer (offset) into log. Producer batch + compress + send to leader; acks=all waits ISR acknowledgment.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Partition log and replication',
      diagram: `flowchart LR
  P[Producer] -->|append batch| L[Leader partition log]
  L --> F1[Follower ISR]
  L --> F2[Follower ISR]
  C[Consumer group] -->|fetch offset N| L
  L -->|commit offset| __consumer_offsets`,
    },
    {
      type: 'table',
      headers: ['Component', 'Role'],
      rows: [
        ['Broker', 'Server hosting topic partitions; leader/follower roles'],
        ['Log segment', '.log + .index files; rolled by size/time'],
        ['Leader', 'Handles all reads/writes for partition'],
        ['ISR', 'Replicas caught up within replica.lag.time.max.ms'],
        ['Controller', 'Elects partition leaders on broker failure'],
        ['__consumer_offsets', 'Internal compacted topic storing committed offsets'],
      ],
    },
    {
      type: 'list',
      items: [
        'Record format: offset, timestamp, key, value, headers.',
        'Producer: partitioner (key hash or sticky) picks partition; linger.ms batches.',
        'Consumer: poll loop fetches; commitSync/Async advances offset.',
        'Zero-copy sendfile speeds broker → consumer transfer.',
        'KRaft mode replaces ZooKeeper with Raft metadata quorum (Kafka 3+).',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'bash',
      caption: 'Inspect partition leader and ISR',
      code: `kafka-topics.sh --describe --topic orders --bootstrap-server localhost:9092
# Topic: orders Partition: 0 Leader: 2 Replicas: 2,1,0 Isr: 2,1,0`,
    },
    {
      type: 'paragraph',
      text: 'Order events keyed by orderId hash to same partition — per-order ordering preserved. 24 partitions × 3 RF across 6 brokers — each broker leads ~4 partitions. Producer acks=all, min.insync.replicas=2 — survive one broker loss without write loss.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'High watermark: offset of last committed record visible to consumers.',
        'Leader epoch prevents stale leader serving inconsistent data after split.',
        'Log compaction: retain latest per key in segment — changelog topics.',
        'Fetch from follower (Kafka 2.7+) reduces leader read load.',
        'Transaction coordinator + __transaction_state for exactly-once producer.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Durable ordered logs at scale', 'Horizontal partition parallelism', 'Replay by resetting offset'],
    disadvantages: ['Partition count fixed hard to change', 'Cross-partition ordering undefined', 'Operational complexity ISR/leader election'],
    alternatives: ['RabbitMQ queues', 'Redis Streams smaller scale', 'Pulsar tiered storage'],
    whenToUse: ['Event streaming', 'CDC pipelines', 'High-throughput ordered per-key logs'],
    whenNotToUse: ['Simple task queue low volume', 'Per-message TTL priority queues'],
  },
  failureModes: [
    'Under-replicated partitions when follower lag exceeds threshold',
    'Leader election during broker bounce — brief unavailability',
    'Hot partition — one key dominates partition skew',
    'Consumer lag unbounded — slow processing or too few consumers',
    'Disk full on broker — cannot append segments',
  ],
  production: {
    reliability: ['RF=3 min.insync.replicas=2 acks=all for critical topics', 'Monitor under-replicated partitions'],
    scalability: ['Partition count planned at topic creation', 'Separate clusters for analytics vs critical path'],
    observability: ['Consumer lag, ISR shrink, offline partitions alerts', 'Broker disk and network metrics'],
    cost: ['Retention.ms tuning; tiered storage for old segments'],
  },
  interview: {
    expectations: ['Partition log model', 'Leader/ISR', 'Offset semantics', 'Why key determines partition'],
    commonQuestions: ['How Kafka stores messages?', 'Ordering guarantee scope?', 'Consumer lag meaning?'],
    followUps: ['KRaft vs ZooKeeper?', 'Exactly-once internals?'],
    misconceptions: ['Kafka is a message queue consumed once globally', 'Unlimited partitions free'],
    traps: ['Expecting global order across partitions'],
    strongSignals: ['ISR + acks=all', 'Segment files', 'Consumer group rebalance', 'Key-based partitioning'],
  },
  keyTakeaways: [
    'Partition = ordered append-only log with offsets.',
    'Leader serves reads/writes; ISR replicas replicate.',
    'Ordering guaranteed per partition only.',
    'Consumer offset tracks read progress in group.',
    'Producer batching + compression drive throughput.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is Kafka partition?', answerHint: 'Ordered immutable log shard; records have sequential offsets; one leader broker.' },
    { level: 'intermediate', question: 'acks=all meaning?', answerHint: 'Producer waits until all ISR replicas acknowledge record before success.' },
    { level: 'advanced', question: 'Broker dies — what happens to its leader partitions?', answerHint: 'Controller triggers leader election among ISR; clients metadata refresh to new leader.' },
  ],
  flashcards: [
    { front: 'ISR', back: 'In-sync replicas caught up with leader within lag threshold' },
    { front: 'Offset', back: 'Monotonic position of record within partition log' },
    { front: 'High watermark', back: 'Last offset safe for consumers to read' },
    { front: 'Log segment', back: 'On-disk chunk of partition log rolled by size/time' },
  ],
  quickRevision: ['Partition = ordered log', 'Leader + ISR', 'Per-partition order', 'Consumer offset', 'acks=all + min ISR'],
}
