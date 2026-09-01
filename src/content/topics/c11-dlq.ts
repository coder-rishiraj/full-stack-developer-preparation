import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Dead Letter Queue (DLQ) is a destination for messages that fail processing after retries — poison pills, bad schema, business rule violations. In Kafka: separate topic (orders.DLT) or manual publish on failure. Enables inspect, fix, replay without blocking main consumer lag.',
  whyExists:
    'One bad message infinite retry stalls partition processing and inflates lag. DLQ isolates failures for ops/engineering while healthy messages continue. Required for production event pipelines with heterogeneous producers.',
  mentalModel:
    'Main topic consumer tries N times with backoff → still fails → publish to DLQ with original headers + error context → commit offset on main partition to advance. Separate replay tool reprocesses DLQ after fix.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Retry then DLQ flow',
      diagram: `flowchart LR
  M[Main topic] --> C[Consumer]
  C -->|success| OK[Commit offset]
  C -->|fail retry 3x| DLT[orders.DLT topic]
  DLT --> OPS[Ops replay tool]
  OPS --> M`,
    },
    {
      type: 'list',
      items: [
        'Spring Kafka: DefaultErrorHandler + DeadLetterPublishingRecoverer',
        'Include original topic, partition, offset, stack trace in headers',
        'Alert on DLQ rate spike — schema drift or upstream bug',
        'Replay with fixed code or corrected payload',
        'Do not DLQ transient infra errors without distinction',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Spring DLQ recoverer',
      code: `var recoverer = new DeadLetterPublishingRecoverer(kafkaTemplate);
var handler = new DefaultErrorHandler(recoverer,
    new FixedBackOff(1000L, 3)); // 3 retries 1s apart
factory.setCommonErrorHandler(handler);`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'DLQ is just another Kafka topic — retention and ACLs apply',
        'Ordering: failed message removed from main partition flow',
        'Idempotent DLQ publish — same failure should not flood duplicates excessively',
        'Alternative: quarantine store (S3) for very large payloads',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Main consumer progress continues', 'Failure visibility', 'Controlled replay'],
    disadvantages: ['Ops overhead replaying DLQ', 'Risk silent data loss if DLQ ignored', 'Extra topic governance'],
    alternatives: ['Infinite retry — bad for poison pills', 'Skip and log only — loses message'],
    whenToUse: ['All production event consumers with external payloads'],
    whenNotToUse: ['When loss acceptable and duplicates worse — rare'],
  },
  failureModes: [
    'DLQ fills unnoticed — business events lost',
    'Retry transient DB outage to DLQ too fast',
    'Replay DLQ without idempotency doubles effects',
    'DLQ same schema as main — bad message fails again infinitely',
  ],
  production: {
    reliability: ['Pager on DLQ growth', 'Runbook for replay', 'Separate retry policy for transient vs permanent errors'],
    observability: ['DLQ rate by exception type', 'Age of oldest DLQ message'],
    maintainability: ['Document permanent vs transient error classification'],
  },
  interview: {
    expectations: ['Why DLQ', 'Retry then route', 'Replay strategy'],
    commonQuestions: ['Handle poison message in Kafka?', 'DLQ design?', 'Replay safely?'],
    followUps: ['Difference retry vs DLQ?', 'Headers to preserve?'],
    misconceptions: ['DLQ automatic in Kafka core', 'DLQ messages auto-retry'],
    traps: ['Commit offset without sending to DLQ — message lost'],
    strongSignals: ['Retry limit, DeadLetterPublishingRecoverer, alerting, idempotent replay'],
  },
  keyTakeaways: [
    'DLQ isolates poison messages after retry exhaustion.',
    'Commit main offset after DLQ publish to unblock partition.',
    'Alert and replay DLQ with ops runbook.',
    'Classify transient vs permanent failures.',
    'Replay must be idempotent.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is DLQ in event processing?', answerHint: 'Queue/topic for messages that failed processing after retries — isolated for inspection.' },
    { level: 'intermediate', question: 'Why not infinite retry on failure?', answerHint: 'Poison pill blocks partition lag forever — DLQ advances main offset and preserves failed message.' },
    { level: 'advanced', question: 'Safe DLQ replay?', answerHint: 'Fix root cause; replay with idempotent handlers; monitor; optionally transform payload before re-publish.' },
  ],
  flashcards: [
    { front: 'DLQ', back: 'Dead letter queue — failed messages after retries' },
    { front: 'Poison pill', back: 'Message always fails processing — blocks without DLQ' },
    { front: 'Commit after DLQ', back: 'Advance main partition so healthy messages continue' },
    { front: 'Replay', back: 'Reprocess DLQ after fix — must be idempotent' },
  ],
  quickRevision: ['Retry then DLQ', 'Alert on DLT', 'Idempotent replay', 'Transient vs permanent', 'Unblock partition'],
}
