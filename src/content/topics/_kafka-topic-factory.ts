import type { TopicContent } from '@/domain/types'

type KafkaTopicInput = {
  title: string
  sectionTitle: string
  parentTitle?: string
}

const SECTION_FOCUS: Record<string, string> = {
  'Kafka Foundations & Messaging Models':
    'distributed commit log, pub/sub vs queues, retention after consume, and when Kafka beats traditional brokers',
  'Event-Driven Architecture':
    'events, producers/consumers, brokers, loose coupling, replay, and CQRS-friendly designs',
  'Cluster Architecture & Brokers':
    'brokers, leaders/replicas, ISR, produce-consume workflow, and KRaft vs ZooKeeper metadata',
  'Topics & Log Anatomy':
    'topics as append-only logs, segments, retention, compaction, and topic administration',
  'Partitions & Parallelism':
    'partition keys, leaders, parallelism limits, and hot-partition skew',
  Producers:
    'Producer API, acks, batching/linger, idempotent producer, retries, and serialization',
  Consumers:
    'poll loop, subscribe vs assign, lag, deserialization, and session/max-poll timeouts',
  'Consumer Groups & Rebalancing':
    'group load balancing, one consumer per partition, and rebalance storms',
  'Offsets & Retention Semantics':
    'auto vs manual commit, earliest/latest, and offset storage',
  'Ordering Guarantees':
    'per-partition order, no global order, key affinity, and max.in.flight effects',
  'Delivery Semantics':
    'at-most, at-least, exactly-once concepts, transactions, and effectively-once consumers',
  'Idempotency, Retries & Dead-Letter Queues':
    'idempotent consumers, retry topics, DLQ, and safe replay for duplicate events',
  'Schemas, Serialization & Evolution':
    'Avro/JSON/Protobuf, Schema Registry, and compatibility modes',
  'Kafka Internals & Storage':
    'segments, indexes, page cache, controller metadata, and MirrorMaker',
  'Connect, Streams & Ecosystem':
    'Kafka Connect, Streams, kSQL/Flink boundaries, and Java clients',
  'Outbox, Saga & Production Operations':
    'transactional outbox, saga styles, lag alerting, TLS/SASL/ACLs, and production checklists',
}

export function createKafkaTopicContent({
  title,
  sectionTitle,
  parentTitle,
}: KafkaTopicInput): TopicContent {
  const focus =
    SECTION_FOCUS[sectionTitle] ??
    'Kafka streaming semantics, consumer correctness, and production trade-offs'
  const parent = parentTitle ? ` It is an atomic part of ${parentTitle}.` : ''

  return {
    whatIsIt:
      `${title} is a Kafka / event-driven topic in ${sectionTitle}.${parent} ` +
      'Explain the commit-log model, who produces and consumes, and what still fails under retries, rebalances, or duplicate delivery.',
    whyExists:
      `${title} exists because microservices and data pipelines need durable, high-throughput, replayable event streams — not fire-and-forget queues that delete on consume. ` +
      `A strong answer covers ${focus}.`,
    mentalModel:
      'Producer → topic/partition (append-only log) → consumer group (offset cursor). ' +
      'Order holds per partition; scale with partitions; correctness needs idempotency, careful commits, schemas, and explicit failure handling (retries/DLQ).',
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: [
          `Place ${title} on the Kafka path: producer, broker/log, partition, consumer group, offset.`,
          'Name the guarantee you actually get: per-partition order, retention, at-least-once by default.',
          'State keying, acks, batching, and commit strategy that affect durability and duplicates.',
          'State failure handling: retries, idempotent consumer, DLQ, and rebalance behavior.',
          'State ops signals: lag, ISR, throughput, and schema compatibility.',
        ],
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Track boundary',
        text:
          'C11 owns Kafka mechanics and application EDA patterns (outbox, saga at the messaging layer). ' +
          'Track D owns broader distributed-systems theory; C12 owns generic reliability patterns like timeouts and circuit breakers.',
      },
    ],
    internals: [
      {
        type: 'list',
        items: [
          'Kafka persists events in partitioned, replicated commit logs; consumers pull and track offsets rather than removing messages on read.',
          'A consumer group assigns each partition to at most one member; adding/removing members triggers rebalance.',
          'Producers choose partitions by key (or round-robin); related keys stay ordered only within that partition.',
          'Replication and ISR protect durability; unclean leader election and under-replicated partitions are production risks.',
          'Connect moves data in/out; Streams processes topic-to-topic; Schema Registry governs evolving contracts.',
        ],
      },
    ],
    failureModes: [
      `Treating ${title} as RabbitMQ-style delete-on-consume messaging and losing replay/auditability.`,
      'Assuming global ordering or exactly-once processing without idempotent consumers / transactions.',
      'Committing offsets before side effects succeed — or never committing and reprocessing forever.',
      'Ignoring consumer lag, rebalance storms, hot partitions, or poison messages without a DLQ path.',
      'Breaking schemas without compatibility checks, or dual-writing DB and Kafka without an outbox.',
    ],
    production: {
      performance: [
        'Tune producer batching/linger and compression; size partitions for parallelism without creating tiny hot partitions.',
        'Watch consumer lag and processing time vs max.poll.interval to avoid unnecessary rebalances.',
      ],
      reliability: [
        'Design for at-least-once: make consumers idempotent; use outbox for DB+event atomicity.',
        'Define retry/DLQ policy and retention so failures are inspectable and replayable.',
      ],
      maintainability: [
        'Version event schemas via Schema Registry; keep payloads explicit and backward compatible.',
        'Isolate producers/consumers behind clear topic contracts per bounded context.',
      ],
      observability: [
        'Alert on consumer lag, under-replicated partitions, ISR shrink, produce errors, and DLQ depth.',
        'Correlate business traces with topic, partition, offset, and consumer group id.',
      ],
    },
    interview: {
      expectations: [
        `Define ${title} in ${sectionTitle} and place it on the produce → log → consume path.`,
        'State ordering and delivery guarantees precisely (partition-level, at-least-once default).',
        'Name one production control: lag, ISR, idempotency, schema compatibility, or DLQ.',
      ],
      commonQuestions: [
        `How does ${title} work in Kafka?`,
        'How is Kafka different from a traditional message queue?',
        'How do you handle duplicates, retries, and consumer lag?',
      ],
      followUps: [
        'What happens during a consumer rebalance?',
        'When would you use outbox, saga, Connect, or Streams?',
      ],
      misconceptions: [
        'Kafka deletes messages when a consumer reads them.',
        'Exactly-once means the business side effect runs once with no extra design.',
        'More partitions always make everything faster and safer.',
      ],
      traps: [
        'Reciting APIs without discussing offsets, rebalances, or idempotency.',
        'Claiming global order or confusing broker replication with application exactly-once.',
      ],
      strongSignals: [
        'Separates log durability from consumer processing correctness.',
        'Connects partition keys, ordering, lag, and failure handling into one coherent design.',
      ],
    },
    keyTakeaways: [
      `${title} belongs to ${sectionTitle}.`,
      `Focus: ${focus}.`,
      'Append-only log → partition parallelism → offset cursor → idempotent side effects.',
    ],
    interviewQuestions: [
      {
        level: 'basic',
        question: `What is ${title}, and where does it sit in the Kafka architecture?`,
        answerHint: `Place it in ${sectionTitle}; mention topic/partition/offset or EDA role as applicable.`,
      },
      {
        level: 'intermediate',
        question: `Which delivery, ordering, or failure trade-offs matter for ${title}?`,
        answerHint: 'Discuss acks, commits, rebalances, duplicates, schemas, or lag as applicable.',
      },
      {
        level: 'advanced',
        question: `How would you operate and debug ${title} in production?`,
        answerHint: `Use ${focus} plus lag, ISR, DLQ, schema compatibility, and replay strategy.`,
      },
    ],
    flashcards: [
      { front: title, back: `${sectionTitle}: ${focus}.` },
      {
        front: `${title} review loop`,
        back: 'Produce → partition log → consume/offset → idempotency → lag/ops.',
      },
    ],
    quickRevision: [
      `${title} — ${sectionTitle}`,
      `Focus: ${focus}`,
      'Commit log with retention, not delete-on-consume',
      'Order per partition; design for at-least-once',
    ],
  }
}
