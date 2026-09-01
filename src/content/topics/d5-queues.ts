import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Message queues decouple producers and consumers with asynchronous buffered delivery — point-to-point (one consumer per message typically) with at-least-once semantics and visibility timeouts. Examples: AWS SQS, RabbitMQ, Azure Queue Storage. Work is pulled or pushed to workers for async processing.',
  whyExists:
    'Synchronous API calls fail when downstream is slow or down. Queues absorb spikes, enable retries, and let services evolve independently. Order service publishes OrderCreated; email, inventory, analytics consume at their pace.',
  mentalModel:
    'Mailbox between services. Producer drops letter; consumer picks up, processes, deletes (acks). If consumer crashes mid-work, message becomes visible again after timeout — design idempotent handlers.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Pattern', 'Semantics', 'Use'],
      rows: [
        ['Standard queue', 'At-least-once, order not guaranteed', 'Parallel workers'],
        ['FIFO queue', 'Ordering + dedup id', 'Sequential workflows per key'],
        ['Dead letter queue (DLQ)', 'Failed messages after N tries', 'Debug poison pills'],
        ['Visibility timeout', 'Hide message while processing', 'Must extend if job long'],
        ['Pub/sub (SNS→SQS)', 'Fan-out to multiple queues', 'Multi-consumer events'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Queue with DLQ retry path',
      diagram: `flowchart LR
  P[Producer] --> Q[Main queue]
  Q --> W[Worker]
  W -->|success delete| Done[Done]
  W -->|fail retry| Q
  Q -->|max receives| DLQ[Dead letter queue]
  Ops[Ops replay] --> DLQ`,
    },
    {
      type: 'list',
      items: [
        'Back-pressure: queue depth signals consumer lag',
        'Poison message: fails always → DLQ + alert',
        'Outbox pattern: DB txn + enqueue reliably',
        'Not for log replay streaming — use Kafka streams topic',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'json',
      caption: 'Order event message',
      code: `{
  "event": "OrderCreated",
  "order_id": "o-991",
  "user_id": 42,
  "items": [{"sku": "A1", "qty": 2}],
  "idempotency_key": "evt-o-991"
}
// Email worker: if processed(evt-o-991) skip`,
    },
  ],
  tradeoffs: {
    advantages: ['Decoupling', 'Burst absorption', 'Retry built-in', 'Scale workers independently'],
    disadvantages: ['Eventual processing delay', 'At-least-once duplicates', 'Ordering limited unless FIFO'],
    alternatives: ['Kafka for log/stream', 'Sync RPC', 'DB polling outbox'],
    whenToUse: ['Async jobs: email, thumbnails, webhooks', 'Peak smoothing'],
    whenNotToUse: ['Real-time sub-10ms coordination', 'Broadcast replay to many consumers with retention log'],
  },
  failureModes: [
    'Visibility timeout too short → duplicate processing',
    'No DLQ → infinite retry loop',
    'Unbounded queue growth if consumers dead',
    'Non-idempotent handler → duplicate side effects',
    'Message too large — use pointer to S3',
  ],
  production: {
    performance: ['Batch receive', 'Right-size workers to queue depth', 'Separate queues by priority'],
    scalability: ['Horizontal workers; SQS scales automatically', 'Shard multiple queues by tenant'],
    reliability: ['DLQ + alarms on depth', 'Outbox for publish after DB commit'],
    observability: ['Age of oldest message, receive/delete rates, DLQ count'],
    maintainability: ['Schema version in message envelope', 'Contract tests for payloads'],
    cost: ['SQS cheap; watch DLQ accumulation storage'],
  },
  interview: {
    expectations: ['At-least-once + idempotency', 'DLQ', 'Queue vs Kafka'],
    commonQuestions: ['Reliable email after order?', 'Visibility timeout?'],
    followUps: ['Outbox pattern?', 'FIFO when?'],
    misconceptions: ['Exactly-once without dedup', 'Queue guarantees global order in standard queue'],
    traps: ['Long job without heartbeat/visibility extension'],
    strongSignals: ['Idempotent consumer table', 'DLQ replay tooling', 'Separate priority queues'],
  },
  keyTakeaways: [
    'Async buffer between producer and consumer.',
    'At-least-once — idempotent handlers mandatory.',
    'DLQ for poison messages; alert on queue depth.',
    'Visibility timeout must exceed p99 job time.',
    'Use streams (Kafka) when need log replay and ordering fan-out.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why message queue?', answerHint: 'Decouple, absorb spikes, async processing, retries.' },
    { level: 'intermediate', question: 'At-least-once handling?', answerHint: 'Idempotency keys, dedup store, safe retries.' },
    { level: 'advanced', question: 'Queue vs Kafka for order events?', answerHint: 'Queue: task work distribution; Kafka: durable log, multiple consumer groups, replay.' },
  ],
  flashcards: [
    { front: 'Visibility timeout', back: 'Message hidden while consumer processes; reappears if not deleted' },
    { front: 'DLQ', back: 'Queue for messages failed max receive count' },
    { front: 'At-least-once', back: 'Message may deliver more than once — handler must dedup' },
    { front: 'Outbox pattern', back: 'Write message to outbox table in same DB txn as business data' },
  ],
  quickRevision: [
    'Decouple async',
    'Idempotent consumers',
    'DLQ poison pills',
    'Visibility timeout',
    'Queue vs Kafka log',
  ],
  systemDesign: {
    problem: 'Process order fulfillment asynchronously (inventory, shipping label, email) with retries and failure isolation.',
    requirements: {
      functional: ['On order paid enqueue work', 'Retry failures', 'Ops inspect failures'],
      nonFunctional: ['Process within 5 min p99', 'No duplicate shipments', 'Isolate email failures from inventory'],
    },
    scaleAssumptions: ['2k orders/s peak', '3 downstream tasks each'],
    capacityEstimates: ['Separate SQS queues per task; workers auto-scale on depth'],
    api: [{ type: 'paragraph', text: 'POST /orders completes → outbox publisher → SQS messages' }],
    dataModel: [{ type: 'list', items: ['outbox table', 'processed_events dedup table per worker', 'DLQ per queue'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'Transactional outbox → fan-out SNS → inventory/shipping/email queues → worker pools + DLQ.' }],
    diagram: {
      mermaid: `flowchart TB
  OrderAPI --> PG[(Postgres + outbox)]
  Poller[Outbox poller] --> SNS
  SNS --> Q1[Inventory Q]
  SNS --> Q2[Shipping Q]
  SNS --> Q3[Email Q]
  Q1 --> W1[Workers]
  Q1 --> DLQ1[DLQ]`,
      caption: 'Fan-out queues isolate failure domains',
    },
    dataFlow: ['Commit order + outbox → poller publishes → workers idempotent process → delete msg'],
    storage: ['Postgres SoT; SQS transient'],
    caching: ['None on queue path'],
    asyncProcessing: ['Core pattern'],
    scaling: ['Worker HPA on ApproximateNumberOfMessagesVisible'],
    consistency: ['Outbox ensures publish after commit'],
    reliability: ['DLQ alarms; replay tooling'],
    failureScenarios: ['Inventory down — queue backs up; email DLQ does not block inventory separate queue'],
    security: ['Encrypt messages; no PAN in plaintext'],
    observability: ['Queue age, DLQ rate, worker success'],
    bottlenecks: ['Slow inventory API — scale workers not always fix; rate limit upstream'],
    alternatives: ['Single Kafka topic multiple consumer groups'],
    tradeoffs: ['Multiple queues ops vs single queue failure blast radius'],
    interviewFollowUps: ['Exactly-once illusion?', 'Priority orders?'],
    evolution: [
      { stage: '1. Simple design', description: 'Sync call all services.', bottleneck: 'Cascading failures.' },
      { stage: '2. Improve', description: 'Single SQS queue.', bottleneck: 'Head-of-line blocking.' },
      { stage: '3. Improve', description: 'Separate queues + DLQ + outbox.', bottleneck: 'Ordering needs.' },
      { stage: '4. Scale further', description: 'FIFO per order_id where needed; Kafka for audit log.', bottleneck: 'Dual system complexity.' },
    ],
  },
}
