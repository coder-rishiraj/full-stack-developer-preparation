import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Kafka consumer and producer retries handle transient failures — broker unavailable, not leader for partition, deserialization recoverable errors. Consumer: Spring DefaultErrorHandler with FixedBackOff; producer: retries with idempotence. Distinguish retryable vs permanent errors — permanent goes to DLQ.',
  whyExists:
    'Distributed systems have momentary faults. Retries improve success rate without operator intervention. Unbounded retry on poison pill blocks progress — cap retries then DLQ. Exponential backoff reduces thundering herd on recovering cluster.',
  mentalModel:
    'Fail → wait → retry N times → DLQ or skip. Producer retries safe with idempotence. Consumer retry must not commit offset until success or DLQ routing. Idempotent handler makes consumer retries safe at-least-once.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Layer', 'Retry config', 'Notes'],
      rows: [
        ['Producer', 'retries=MAX + idempotence', 'Broker/network errors'],
        ['Consumer Spring', 'DefaultErrorHandler FixedBackOff', 'Per record failure in listener'],
        ['Consumer poll', 'Implicit redelivery if no commit', 'At-least-once'],
        ['Connect / Streams', 'Framework-specific retry', 'Streams rebalance on failure'],
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Consumer retry then DLQ',
      code: `var recoverer = new DeadLetterPublishingRecoverer(template);
var handler = new DefaultErrorHandler(recoverer,
    new ExponentialBackOffWithMaxRetries(1000, 3));
factory.setCommonErrorHandler(handler);`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Payment gateway timeout in consumer — retry 3 times exponential 1s/2s/4s. Still failing — publish to payments.DLT, commit offset. Ops replays after gateway fix.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Producer delivery.timeout.ms bounds total retry window',
        'Non-retriable errors: SerializationException → DLQ immediately',
        'Retry may reorder if max.in.flight > 1 without idempotence',
        'Blocking retry in listener extends processing time — watch max.poll.interval',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Resilience to transient faults', 'Automatic recovery from brief outages'],
    disadvantages: ['Increased lag during retry storms', 'Duplicate if non-idempotent', 'Poison pill without cap blocks partition'],
    alternatives: ['No retry — at-most-once skip', 'Human intervention only'],
    whenToUse: ['Transient infra errors', 'Producer network blips'],
    whenNotToUse: ['Permanent schema mismatch — fix forward, DLQ fast'],
  },
  failureModes: [
    'Infinite retry on bad JSON',
    'Retry without idempotency double-charges',
    'Retry blocks poll → rebalance',
    'Producer retries without idempotence duplicates',
  ],
  production: {
    reliability: ['Cap retries + DLQ', 'Idempotent handlers', 'Classify errors retriable'],
    observability: ['Retry count metrics', 'DLQ rate alerts'],
  },
  interview: {
    expectations: ['Consumer vs producer retry', 'Backoff + DLQ', 'Idempotency with retry'],
    commonQuestions: ['Retry failed Kafka message?', 'Producer retries safe?', 'Infinite retry risk?'],
    followUps: ['Exponential backoff?', 'max.poll.interval interaction?'],
    misconceptions: ['Kafka broker auto-retries consumer business logic', 'Retry replaces idempotency'],
    traps: ['Infinite listener retry on parse error'],
    strongSignals: ['Bounded backoff, DLQ, idempotence, error classification'],
  },
  keyTakeaways: [
    'Producer retries need idempotence to avoid duplicates.',
    'Consumer retry with backoff then DLQ for poison pills.',
    'Do not retry forever — cap and alert.',
    'Idempotent handlers make consumer retries safe.',
    'Watch max.poll.interval during long retry loops.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why producer retries?', answerHint: 'Transient leader election/network failures — idempotence prevents duplicate records.' },
    { level: 'intermediate', question: 'Consumer retry without committing offset?', answerHint: 'Record redelivered — at-least-once; must be idempotent; or retry in handler before ack.' },
    { level: 'advanced', question: 'Retry vs DLQ decision?', answerHint: 'Retry transient (timeout); DLQ permanent (schema) after N attempts; commit after DLQ publish.' },
  ],
  flashcards: [
    { front: 'Producer retries + idempotence', back: 'Safe network retry without duplicate broker records' },
    { front: 'DefaultErrorHandler', back: 'Spring Kafka listener retry/recover abstraction' },
    { front: 'Poison pill', back: 'Permanent failure — stop retrying to DLQ' },
    { front: 'max.poll.interval', back: 'Long retries in listener may trigger rebalance' },
  ],
  quickRevision: ['Idempotent producer retry', 'Bounded consumer retry', 'DLQ after cap', 'Classify errors', 'Idempotent handler'],
}
