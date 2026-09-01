import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Amazon SQS (Simple Queue Service) is managed message queue — producers send messages; consumers poll and process with visibility timeout, at-least-once delivery, dead-letter queues, and long polling. Standard queues maximize throughput; FIFO queues guarantee order and exactly-once processing semantics.',
  whyExists:
    'Decouple services in time — order API enqueues job; worker processes when capacity available. Buffer traffic spikes, retry failures, and scale consumers independently. Foundation pattern with SNS fan-out and Lambda event source mapping.',
  mentalModel:
    'Post office box. Sender drops letter; receiver checks box, takes letter invisible to others while processing (visibility timeout). Done → delete message. Crash mid-process → letter reappears after timeout for retry.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Feature', 'Behavior'],
      rows: [
        ['Visibility timeout', 'Hidden from others while consumer processes — extend if long work'],
        ['Long polling', 'WaitTimeSeconds 20 reduces empty receive costs'],
        ['DLQ', 'After maxReceiveCount move poison message'],
        ['FIFO', 'MessageGroupId ordering; deduplication ID'],
        ['Delay queue', 'Defer delivery up to 15 minutes'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'SQS consume with DLQ',
      diagram: `sequenceDiagram
  participant P as Producer
  participant Q as SQS Queue
  participant C as Consumer
  participant D as DLQ
  P->>Q: SendMessage
  C->>Q: ReceiveMessage (visibility starts)
  alt success
    C->>Q: DeleteMessage
  else fail max retries
    Q->>D: redrive policy
  end`,
    },
    {
      type: 'list',
      items: [
        'At-least-once: always idempotent consumer or dedupe table.',
        'Batch receive up to 10 messages — partial batch failure reporting with Lambda.',
        'Standard queue best-effort ordering — not guaranteed.',
        'Queue policy + SSE for encryption; VPC endpoint for private access.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Spring @SqsListener with manual ack pattern',
      code: `@SqsListener(value = "order-processing", deletionPolicy = ON_SUCCESS)
public void handle(OrderMessage msg) {
  orderProcessor.process(msg); // throws -> message returns after visibility timeout
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Message retention default 4 days max 14 days.',
        'ApproximateNumberOfMessagesVisible CloudWatch metric for autoscale.',
        'FIFO throughput 300 TPS default 3000 with batching high throughput mode.',
        'SQS extended client library offloads large payloads to S3.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Fully managed', 'Scale consumers independently', 'DLQ for poison pills', 'Buffers spike load'],
    disadvantages: ['Poll latency vs push', 'At-least-once duplicates', 'FIFO lower throughput', 'No replay by offset like Kafka'],
    alternatives: ['Kafka for log replay', 'Redis list simpler lighter', 'EventBridge for routing'],
    whenToUse: ['Task queues', 'Async job processing', 'Microservice decoupling'],
    whenNotToUse: ['Strict global ordering at massive scale — Kafka', 'Request-response sync'],
  },
  failureModes: [
    'Visibility timeout too short — duplicate parallel processing',
    'No idempotency — duplicate charges',
    'Poison message without DLQ — infinite retry loop',
    'Consumer too slow — queue backlog grows unbounded',
    'Delete before commit — message lost forever',
  ],
  production: {
    reliability: ['DLQ + alarm on depth', 'Idempotency keys', 'Right-size visibility timeout to p99 processing'],
    scalability: ['Autoscale workers on ApproximateNumberOfMessagesVisible', 'Batch receive for throughput'],
    observability: ['Age of oldest message alarm', 'DLQ depth dashboard'],
    cost: ['Long polling reduces empty receives', 'Right retention not max 14d always'],
  },
  interview: {
    expectations: ['Visibility timeout', 'At-least-once + idempotency', 'DLQ', 'Standard vs FIFO'],
    commonQuestions: ['Design async order processing?', 'Prevent duplicate processing?'],
    followUps: ['Long polling benefit?', 'SQS vs Kafka?'],
    misconceptions: ['Exactly-once standard SQS', 'Message deleted automatically after read'],
    traps: ['Delete message before DB commit succeeds'],
    strongSignals: ['Visibility = processing time', 'DLQ redrive', 'Idempotent handler', 'Long polling'],
  },
  keyTakeaways: [
    'SQS decouples producers and consumers with durable queue.',
    'Visibility timeout prevents concurrent duplicate processing window.',
    'Consumers must be idempotent — at-least-once delivery.',
    'DLQ isolates poison messages after max receives.',
    'FIFO for ordering per message group; standard for max throughput.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'SQS visibility timeout purpose?', answerHint: 'Hide message from other consumers while one processes — reappears if not deleted in time.' },
    { level: 'intermediate', question: 'Duplicate message processing?', answerHint: 'At-least-once delivery — idempotency key or dedupe store in consumer.' },
    { level: 'advanced', question: 'Standard vs FIFO queue choice?', answerHint: 'FIFO: strict order + dedup lower throughput; standard: higher throughput best-effort order.' },
  ],
  flashcards: [
    { front: 'Visibility timeout', back: 'Processing lease — message hidden then redelivered if not deleted' },
    { front: 'DLQ', back: 'Queue for messages failing maxReceiveCount processing attempts' },
    { front: 'Long polling', back: 'ReceiveMessage waits up to 20s for messages — fewer empty polls' },
    { front: 'MessageGroupId', back: 'FIFO ordering scope — order preserved within group' },
  ],
  quickRevision: ['Poll + delete', 'Visibility timeout', 'At-least-once idempotent', 'DLQ poison', 'FIFO vs standard'],
}
