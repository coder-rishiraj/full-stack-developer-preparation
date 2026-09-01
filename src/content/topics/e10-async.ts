import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Async processing offloads long LLM work — batch embed, doc ingestion, eval runs, report generation — to queues and workers so API requests stay fast and resilient.',
  whyExists: 'Embedding 10K docs or running multi-step agents exceeds HTTP timeouts. Async decouples accept from complete and enables retry and scale.',
  mentalModel: 'Restaurant ticket: waiter takes order (202 Accepted), kitchen cooks async, customer polls or gets webhook when ready.',
  howItWorks: [
    { type: 'list', items: [
      'API enqueues job with idempotency key → returns job_id.',
      'Workers pull from SQS/Kafka/Redis queue.',
      'Store status: pending, running, succeeded, failed.',
      'Webhook or SSE notifies client on completion.',
      'DLQ for poison messages after max retries.',
    ] },
  ],
  example: [
    { type: 'code', language: 'typescript', code: 'const job = await queue.send({ type: "embed", docId, tenantId });\nreturn { jobId: job.id, status: "pending" };\n// Worker: chunk → embed → upsert pgvector → mark succeeded', caption: 'Enqueue embed job' },
  ],
  tradeoffs: {
    advantages: [
      'No long HTTP hold',
      'Burst absorption',
      'Retryable',
    ],
    disadvantages: [
      'Eventual completion',
      'Status polling complexity',
    ],
    alternatives: [
      'Sync for small jobs only',
      'Step Functions for orchestration',
    ],
    whenToUse: [
      'Ingestion, batch eval, long agents',
    ],
    whenNotToUse: [
      'Interactive chat under 30s SLO',
    ],
  },
  failureModes: [
    'Lost job status',
    'Duplicate processing without idempotency',
    'Unbounded queue backlog',
  ],
  production: {
    scalability: [
      'Autoscale workers on queue depth',
    ],
    reliability: [
      'Idempotency keys',
      'DLQ + alert',
    ],
    observability: [
      'Job latency histogram, backlog gauge',
    ],
  },
  interview: {
    expectations: [
      'Queue + worker pattern',
      'Idempotency',
    ],
    commonQuestions: [
      'Long LLM job design?',
    ],
    followUps: [
      'At-least-once handling?',
    ],
    misconceptions: [
      'Always sync LLM calls',
    ],
    traps: [
      'No job status store',
    ],
    strongSignals: [
      '202 + job id + DLQ + idempotent workers',
    ],
  },
  keyTakeaways: [
    'Queue long LLM work',
    'Return job id immediately',
    'Idempotent workers',
    'DLQ poison messages',
    'Scale workers on depth',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why async for LLM?', answerHint: 'Long embed/agent jobs exceed HTTP timeouts; decouple accept from complete.' },
    { level: 'intermediate', question: 'Idempotency in workers?', answerHint: 'Same job_id/doc version processed once; upsert with version check.' },
    { level: 'advanced', question: 'Priority queues?', answerHint: 'Separate queues for interactive vs batch; weighted consumers.' },
  ],
  flashcards: [
    { front: 'DLQ', back: 'Dead letter queue for failed jobs after max retries' },
    { front: 'Idempotency key', back: 'Prevents duplicate side effects on retry' },
    { front: '202 Accepted', back: 'Ack enqueue; client polls or webhook for result' },
  ],
  quickRevision: [
    'Queue workers',
    'Job status store',
    'Idempotent',
    'DLQ',
    'Autoscale depth',
  ],
}
