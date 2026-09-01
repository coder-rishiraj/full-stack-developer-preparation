import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Kafka consumers read records from subscribed topics/partitions via poll loop. They track offset position, deserialize key/value, and invoke handlers. Configuration: bootstrap.servers, group.id, auto.offset.reset (earliest/latest), enable.auto.commit, isolation.level for transactions. Spring Kafka wraps with @KafkaListener and container factories.',
  whyExists:
    'Producers write to log; consumers tail log for reactions — fulfill orders, update search index, send emails. Consumer API abstracts broker fetch, partition assignment (via group), and offset management so apps focus on event handling.',
  mentalModel:
    'Consumer poll() returns batch of records. Process batch, commit offsets. Long processing blocks poll — triggers rebalance if max.poll.interval exceeded. One thread per partition typical for ordering.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Subscribe topics or pattern',
        'Join consumer group — coordinator assigns partitions',
        'Loop: poll(duration) → records → handler → commit',
        'Heartbeats in background thread (Kafka 2.x+) during processing',
        'On shutdown: wakeup, finish in-flight, commit, leave group',
      ],
    },
    {
      type: 'table',
      headers: ['Config', 'Effect'],
      rows: [
        ['auto.offset.reset=earliest', 'No offset → read from beginning'],
        ['auto.offset.reset=latest', 'No offset → only new messages'],
        ['max.poll.records', 'Batch size per poll'],
        ['max.poll.interval.ms', 'Max time between polls before considered dead'],
        ['fetch.min.bytes', 'Batching efficiency vs latency'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Manual commit consumer factory',
      code: `@Bean
ConcurrentKafkaListenerContainerFactory<String, OrderEvent> factory(
    ConsumerFactory<String, OrderEvent> cf) {
  var f = new ConcurrentKafkaListenerContainerFactory<String, OrderEvent>();
  f.setConsumerFactory(cf);
  f.getContainerProperties().setAckMode(AckMode.MANUAL_IMMEDIATE);
  return f;
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Consumer reads from leader partition replica',
        'Deserialization errors — configure ErrorHandlingDeserializer or DLQ',
        'Pause/resume partition for backpressure',
        'Assign() manual assignment bypasses group for advanced tools',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Decoupled event processing', 'Replay by resetting offset', 'Scale via consumer groups'],
    disadvantages: ['Operational complexity offsets/lag', 'Handler must be fast or async carefully', 'Rebalance disruptions'],
    alternatives: ['Kafka Connect sinks', 'Kafka Streams', 'Kinesis/other brokers'],
    whenToUse: ['React to domain events', 'Async integration between services'],
    whenNotToUse: ['Synchronous request-response — use HTTP/gRPC'],
  },
  failureModes: [
    'Blocking handler exceeds max.poll.interval',
    'Deserialization failure poison pill infinite retry',
    'Wrong auto.offset.reset replays entire topic in prod',
    'Unbounded concurrency breaks per-partition ordering',
  ],
  production: {
    reliability: ['Manual ack, idempotent handlers', 'Graceful shutdown hook'],
    observability: ['Lag, poll time, handler latency metrics'],
    performance: ['Right-size max.poll.records', 'Async processing with ordering care'],
  },
  interview: {
    expectations: ['Poll loop', 'Offset commit modes', 'Key configs'],
    commonQuestions: ['How Kafka consumer works?', 'earliest vs latest?', 'Slow handler fix?'],
    followUps: ['Manual vs auto commit?', 'Error handling deserialization?'],
    misconceptions: ['Consumer pushes from broker', 'Unlimited threads per consumer safe for ordering'],
    traps: ['auto.offset.reset earliest on new prod consumer group'],
    strongSignals: ['MANUAL ack, max.poll.interval tuning, DLQ, graceful shutdown'],
  },
  keyTakeaways: [
    'Consumers poll batches and commit offsets.',
    'group.id enables partition sharing across instances.',
    'Tune max.poll.interval for handler duration.',
    'Manual commit after success for critical data.',
    'auto.offset.reset matters on new consumer groups.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Kafka consumer poll loop?', answerHint: 'Repeatedly poll broker for records, process, commit offset, heartbeat.' },
    { level: 'intermediate', question: 'earliest vs latest offset reset?', answerHint: 'No committed offset: earliest reads from start; latest only new messages after join.' },
    { level: 'advanced', question: 'Handler takes 2 minutes — what breaks?', answerHint: 'Exceeds max.poll.interval.ms — consumer kicked, rebalance; fix async processing, increase interval, or pause consumption.' },
  ],
  flashcards: [
    { front: 'poll()', back: 'Fetch next batch of records from assigned partitions' },
    { front: 'max.poll.interval.ms', back: 'Max gap between polls before consumer considered failed' },
    { front: 'auto.offset.reset', back: 'Behavior when no committed offset exists' },
    { front: 'MANUAL ack mode', back: 'Commit only after handler succeeds — at-least-once safe' },
  ],
  quickRevision: ['Poll process commit', 'Tune poll interval', 'Manual ack', 'earliest vs latest', 'Idempotent handler'],
}
