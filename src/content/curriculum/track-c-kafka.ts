import type { Priority } from '@/domain/types'
import type { SectionSeed, TopicSeed } from './build'

const KAFKA = ['kafka'] as const
const M56 = [5, 6]
const M67 = [6, 7]

function item(
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  const { tags, executionPriority, ...rest } = extra
  return {
    id,
    title,
    priority,
    months: extra.months ?? (priority === 'tier1' ? M56 : M67),
    tags: [...KAFKA, ...(tags ?? [])],
    executionPriority:
      executionPriority ?? (priority === 'tier1' ? 'p0' : priority === 'tier2' ? 'p1' : 'later'),
    ...rest,
  }
}

function nest(
  parent: string,
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  return item(id, title, priority, {
    ...extra,
    curriculumLevel: 'nested-concept',
    parentTopicId: parent,
  })
}

function section(id: string, title: string, order: number, topics: TopicSeed[]): SectionSeed {
  return {
    id,
    track: 'C',
    title,
    order,
    defaultKind: 'theory',
    defaultDepth: 'deep',
    topics,
  }
}

/**
 * C11.1–C11.16 — Kafka & event-driven systems for backend interviews.
 * Shape follows TutorialsPoint Kafka map, GeeksforGeeks Kafka archives,
 * Instaclustr get-started concepts, and EDA/producer-consumer tutorials
 * (shape only, not copied prose). Deep distributed-systems theory stays in
 * Track D. Existing C11 topic IDs remain stable.
 */
export const TRACK_C_KAFKA_SECTIONS: SectionSeed[] = [
  section('C11.1', 'Kafka Foundations & Messaging Models', 166, [
    item('c11-kafka-foundations', 'Kafka Foundations'),
    nest('c11-kafka-foundations', 'c11-what-is-kafka', 'What Kafka Is'),
    nest('c11-kafka-foundations', 'c11-distributed-commit-log', 'Distributed Commit Log'),
    nest('c11-kafka-foundations', 'c11-vs-traditional-messaging', 'Kafka vs Traditional Messaging'),
    nest('c11-kafka-foundations', 'c11-point-to-point-vs-pubsub', 'Point-to-Point vs Pub/Sub'),
    nest('c11-kafka-foundations', 'c11-use-cases', 'Analytics, Logs, Integration & Messaging Use Cases'),
    nest('c11-kafka-foundations', 'c11-events-as-records', 'Events as Key-Value Records with Timestamps'),
  ]),

  section('C11.2', 'Event-Driven Architecture', 167, [
    item('c11-eda', 'Event-Driven Architecture'),
    nest('c11-eda', 'c11-events-producers-consumers', 'Events, Producers & Consumers'),
    nest('c11-eda', 'c11-event-brokers', 'Event Brokers & Loose Coupling'),
    nest('c11-eda', 'c11-event-store', 'Event Store & Replay'),
    nest('c11-eda', 'c11-cqrs', 'CQRS with Event Streams', 'tier2'),
    nest('c11-eda', 'c11-event-granularity', 'Event Granularity & Best Practices'),
  ]),

  section('C11.3', 'Cluster Architecture & Brokers', 168, [
    item('c11-cluster-architecture', 'Cluster Architecture'),
    nest('c11-cluster-architecture', 'c11-brokers', 'Brokers & Clusters'),
    nest('c11-cluster-architecture', 'c11-workflow', 'Produce → Broker → Consume Workflow'),
    nest('c11-cluster-architecture', 'c11-kraft-vs-zookeeper', 'KRaft vs ZooKeeper Metadata', 'tier2'),
    nest('c11-cluster-architecture', 'c11-replication-factor', 'Replication Factor & Leaders'),
    nest('c11-cluster-architecture', 'c11-isr', 'In-Sync Replicas (ISR)'),
  ]),

  section('C11.4', 'Topics & Log Anatomy', 169, [
    item('c11-topics', 'Topics'),
    nest('c11-topics', 'c11-topic-naming', 'Topic Naming & Organization'),
    nest('c11-topics', 'c11-log-anatomy', 'Log Anatomy: Append-Only Segments'),
    nest('c11-topics', 'c11-retention', 'Time/Size Retention & Compaction'),
    nest('c11-topics', 'c11-create-describe-topics', 'Create & Describe Topics'),
    nest('c11-topics', 'c11-compaction', 'Log Compaction', 'tier2'),
  ]),

  section('C11.5', 'Partitions & Parallelism', 170, [
    item('c11-partitions', 'Partitions'),
    nest('c11-partitions', 'c11-partition-keys', 'Key-Based Partitioning'),
    nest('c11-partitions', 'c11-partition-leaders', 'Leaders, Followers & Failover'),
    nest('c11-partitions', 'c11-partition-count', 'Choosing Partition Count'),
    nest('c11-partitions', 'c11-hot-partitions', 'Hot Partitions & Skew'),
  ]),

  section('C11.6', 'Producers', 171, [
    item('c11-producers', 'Producers'),
    nest('c11-producers', 'c11-producer-api', 'Producer API & Records'),
    nest('c11-producers', 'c11-acks', 'acks=0 / 1 / all'),
    nest('c11-producers', 'c11-batching-linger', 'Batch Size & linger.ms'),
    nest('c11-producers', 'c11-idempotent-producer', 'Idempotent Producer'),
    nest('c11-producers', 'c11-producer-retries', 'Producer Retries & Delivery Timeout'),
    nest('c11-producers', 'c11-serialization', 'Key/Value Serialization'),
  ]),

  section('C11.7', 'Consumers', 172, [
    item('c11-consumers', 'Consumers'),
    nest('c11-consumers', 'c11-consumer-api', 'Consumer API & poll()'),
    nest('c11-consumers', 'c11-subscribe-assign', 'Subscribe vs Assign'),
    nest('c11-consumers', 'c11-consumer-lag', 'Consumer Lag'),
    nest('c11-consumers', 'c11-deserialization', 'Deserialization & Poison Messages'),
    nest('c11-consumers', 'c11-max-poll', 'max.poll.interval & Session Timeout', 'tier2'),
  ]),

  section('C11.8', 'Consumer Groups & Rebalancing', 173, [
    item('c11-consumer-groups', 'Consumer Groups'),
    nest('c11-consumer-groups', 'c11-group-load-balancing', 'Group Load Balancing'),
    nest('c11-consumer-groups', 'c11-one-partition-one-consumer', 'One Consumer per Partition per Group'),
    item('c11-rebalancing', 'Consumer Rebalancing', 'tier2'),
    nest('c11-rebalancing', 'c11-cooperative-rebalance', 'Eager vs Cooperative Rebalancing', 'tier2'),
    nest('c11-rebalancing', 'c11-rebalance-storms', 'Rebalance Storms & Sticky Assignment', 'tier2'),
  ]),

  section('C11.9', 'Offsets & Retention Semantics', 174, [
    item('c11-offsets', 'Offsets'),
    nest('c11-offsets', 'c11-auto-vs-manual-commit', 'Auto vs Manual Commit'),
    nest('c11-offsets', 'c11-commit-sync-async', 'commitSync vs commitAsync'),
    nest('c11-offsets', 'c11-from-beginning', 'earliest / latest / specific Offset'),
    nest('c11-offsets', 'c11-offset-storage', '__consumer_offsets', 'tier2'),
  ]),

  section('C11.10', 'Ordering Guarantees', 175, [
    item('c11-ordering', 'Ordering Guarantees'),
    nest('c11-ordering', 'c11-partition-order', 'Order Within a Partition'),
    nest('c11-ordering', 'c11-no-global-order', 'No Global Topic Order'),
    nest('c11-ordering', 'c11-key-affinity', 'Key Affinity for Related Events'),
    nest('c11-ordering', 'c11-max-in-flight', 'max.in.flight.requests & Ordering', 'tier2'),
  ]),

  section('C11.11', 'Delivery Semantics', 176, [
    item('c11-at-most-once', 'At-Most/At-Least/Exactly-Once Concepts'),
    nest('c11-at-most-once', 'c11-at-least-once', 'At-Least-Once'),
    nest('c11-at-most-once', 'c11-exactly-once', 'Exactly-Once Concepts'),
    nest('c11-at-most-once', 'c11-eos-transactions', 'Kafka Transactions / EOS', 'tier2'),
    nest('c11-at-most-once', 'c11-effectively-once', 'Effectively-Once via Idempotent Consumers'),
  ]),

  section('C11.12', 'Idempotency, Retries & Dead-Letter Queues', 177, [
    item('c11-idempotent-consumers', 'Idempotent Consumers', 'tier1', {
      related: ['c12-idempotency'],
      capstone: 'Relevant to duplicate payment/order events.',
    }),
    nest('c11-idempotent-consumers', 'c11-dedupe-keys', 'Deduplication Keys & Outbox Markers'),
    item('c11-retries', 'Retries'),
    nest('c11-retries', 'c11-retry-topics', 'Retry Topics & Backoff'),
    item('c11-dlq', 'Dead-Letter Queues'),
    nest('c11-dlq', 'c11-dlq-replay', 'DLQ Inspection & Replay'),
  ]),

  section('C11.13', 'Schemas, Serialization & Evolution', 178, [
    item('c11-schema-evolution', 'Schema Evolution'),
    nest('c11-schema-evolution', 'c11-avro-json-protobuf', 'Avro, JSON & Protobuf'),
    nest('c11-schema-evolution', 'c11-schema-registry', 'Schema Registry'),
    nest('c11-schema-evolution', 'c11-compatibility-modes', 'Backward / Forward Compatibility'),
    nest('c11-schema-evolution', 'c11-breaking-changes', 'Avoiding Breaking Schema Changes'),
  ]),

  section('C11.14', 'Kafka Internals & Storage', 179, [
    item('c11-internals', 'Kafka Internals', 'tier2'),
    nest('c11-internals', 'c11-segments-rolling', 'Segments, Rolling & Indexes', 'tier2'),
    nest('c11-internals', 'c11-pagecache', 'OS Page Cache & Zero-Copy', 'tier2'),
    nest('c11-internals', 'c11-controller', 'Controller & Metadata', 'tier2'),
    nest('c11-internals', 'c11-mirrormaker', 'MirrorMaker / Cross-Cluster Replication', 'tier2'),
  ]),

  section('C11.15', 'Connect, Streams & Ecosystem', 180, [
    item('c11-ecosystem', 'Connect, Streams & Ecosystem', 'tier2'),
    nest('c11-ecosystem', 'c11-kafka-connect', 'Kafka Connect Source & Sink', 'tier2'),
    nest('c11-ecosystem', 'c11-kafka-streams', 'Kafka Streams Basics', 'tier2'),
    nest('c11-ecosystem', 'c11-ksql', 'kSQL / Flink SQL Overview', 'tier2'),
    nest('c11-ecosystem', 'c11-vs-flink-pulsar', 'Kafka vs Flink / Pulsar Boundaries', 'tier2'),
    nest('c11-ecosystem', 'c11-java-clients', 'Java Client Libraries', 'tier2'),
  ]),

  section('C11.16', 'Outbox, Saga & Production Operations', 181, [
    item('c11-outbox', 'Outbox Pattern', 'tier2', {
      related: ['d4-distributed-transactions'],
    }),
    nest('c11-outbox', 'c11-transactional-outbox', 'Transactional Outbox with DB', 'tier2'),
    item('c11-saga', 'Saga Pattern', 'tier2', { related: ['d4-saga'] }),
    nest('c11-saga', 'c11-choreography-orchestration', 'Choreography vs Orchestration', 'tier2'),
    nest('c11-saga', 'c11-consumer-lag-alerting', 'Lag, Throughput & Alerting', 'tier2'),
    nest('c11-saga', 'c11-kafka-security', 'TLS, SASL & ACLs', 'tier2'),
    nest('c11-saga', 'c11-production-checklist', 'Production Checklist', 'tier2'),
  ]),
]
