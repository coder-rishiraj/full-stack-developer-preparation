import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Message queues decouple LLM workload producers from consumers — ingestion, embed, eval, notification — providing buffering, retry, and horizontal scale via SQS, Kafka, RabbitMQ, or Redis streams.',
  whyExists: 'Spiky embed traffic and agent fan-out overwhelm synchronous APIs. Queues absorb bursts and isolate failure domains.',
  mentalModel: 'Conveyor belt between stations — upstream drops jobs; workers pull at sustainable rate.',
  howItWorks: [
    { type: 'list', items: [
      'Producer sends JSON job with type, payload, idempotency key.',
      'Consumer ack after success; visibility timeout for retry.',
      'FIFO or partition key for ordering per tenant/doc.',
      'DLQ after N failures; poison pill isolation.',
      'Metrics: age of oldest message, processing rate.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Doc upload → SQS ingest queue → workers chunk/embed → upsert pgvector → publish index_ready event to fan-out search cache invalidation.' },
  ],
  tradeoffs: {
    advantages: [
      'Burst handling',
      'Independent scaling',
    ],
    disadvantages: [
      'At-least-once semantics',
      'Operational complexity',
    ],
    alternatives: [
      'Direct sync for tiny volume',
      'Workflow engine for DAG',
    ],
    whenToUse: [
      'Ingestion pipelines',
      'Bulk eval',
      'Webhook delivery',
    ],
    whenNotToUse: [
      'Sub-second interactive chat path',
    ],
  },
  failureModes: [
    'Unbounded backlog',
    'Duplicate processing',
    'Visibility timeout too short — double process',
  ],
  production: {
    scalability: [
      'Scale consumers on queue depth',
    ],
    reliability: [
      'Idempotent handlers',
      'DLQ alarms',
    ],
    observability: [
      'Queue age CloudWatch alarm',
    ],
  },
  interview: {
    expectations: [
      'At-least-once + idempotency',
      'DLQ',
    ],
    commonQuestions: [
      'Queue LLM ingest how?',
    ],
    followUps: [
      'Kafka vs SQS?',
    ],
    misconceptions: [
      'Exactly-once free',
    ],
    traps: [
      'No idempotency on embed upsert',
    ],
    strongSignals: [
      'Idempotent upsert + DLQ + depth scaling',
    ],
  },
  keyTakeaways: [
    'Buffer async LLM work',
    'Idempotent consumers',
    'DLQ poison messages',
    'Scale on depth',
    'Ordering via partition key',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Queues in LLM stack?', answerHint: 'Decouple ingest, embed, eval from API; retry and scale workers.' },
    { level: 'intermediate', question: 'At-least-once handling?', answerHint: 'Idempotency keys; upsert by doc version; dedupe table.' },
    { level: 'advanced', question: 'Priority for interactive vs batch?', answerHint: 'Separate queues and worker pools; weighted polling.' },
  ],
  flashcards: [
    { front: 'Visibility timeout', back: 'Time before unacked message redelivered' },
    { front: 'Partition key', back: 'Orders jobs per doc/tenant in Kafka' },
    { front: 'Queue age', back: 'Oldest message wait time — backlog SLO signal' },
  ],
  quickRevision: [
    'SQS/Kafka',
    'Idempotent worker',
    'DLQ',
    'Scale depth',
    'Partition order',
  ],
}
