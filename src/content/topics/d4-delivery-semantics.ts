import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Message-delivery semantics define guarantees between producer, broker, and consumer: at-most-once (may lose), at-least-once (may duplicate), exactly-once (effectively once despite retries — hardest). Choice drives idempotency, ordering, and failure handling in async systems.',
  whyExists:
    'Networks drop, brokers restart, consumers crash mid-processing. Without explicit semantics, teams assume “messages delivered once” and ship double-charges, duplicate emails, or lost orders. Naming semantics forces correct compensating design.',
  mentalModel:
    'At-most-once: fire-and-forget, no retry — fast, lossy. At-least-once: ack after process with retries — duplicates possible, need idempotent handlers. Exactly-once: idempotent consumer + transactional outbox/inbox or broker dedupe — still “effectively once” at business level.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Semantic', 'Loss', 'Duplicate', 'Typical pattern'],
      rows: [
        ['At-most-once', 'Yes', 'No', 'No ack; max retries 0'],
        ['At-least-once', 'No (if persisted)', 'Yes', 'Ack after process; retry on timeout'],
        ['Exactly-once', 'No', 'No (intended)', 'Idempotent consumer + dedupe key / txn outbox'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'At-least-once: consumer crash before ack → redelivery',
      diagram: `sequenceDiagram
  participant P as Producer
  participant B as Broker
  participant C as Consumer
  P->>B: publish msg-1
  B->>C: deliver msg-1
  C->>C: process OK
  Note over C: crash before ack
  B->>C: redeliver msg-1`,
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Exactly-once is end-to-end',
      text: 'Brokers alone rarely give true exactly-once to external side effects (DB, email). Pattern: transactional outbox + idempotent consumer keyed by messageId.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'OrderPlaced event → payment service. At-least-once Kafka consumer charges card; must use idempotencyKey=messageId so retry doesn’t double charge. Email notification can be at-most-once if loss acceptable.',
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Idempotent consumer sketch',
      code: `@KafkaListener
void onMessage(OrderEvent evt) {
  if (processedRepo.exists(evt.getMessageId())) return;
  paymentService.charge(evt);
  processedRepo.mark(evt.getMessageId()); // same txn as charge ideally
}`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Explicit semantics prevent silent data bugs',
      'At-least-once + idempotency is practical default',
      'At-most-once simplifies metrics/logging paths',
    ],
    disadvantages: [
      'Exactly-once adds storage, latency, complexity',
      'Duplicate detection tables grow — need TTL/compaction',
      'Ordering + retries complicate consumer design',
    ],
    alternatives: [
      'Synchronous RPC (different failure model)',
      'CDC change streams with offset tracking',
      'Kafka transactions (limited scope)',
    ],
    whenToUse: [
      'Payment, inventory, billing → at-least-once + idempotency',
      'Metrics, logs → at-most-once often OK',
      'Financial ledger → strongest practical guarantee',
    ],
    whenNotToUse: [
      'Claiming exactly-once without idempotent side effects',
    ],
  },
  failureModes: [
    'Ack before process → message loss on crash',
    'Process twice without idempotency → duplicate side effect',
    'Poison message infinite retry loop',
    'Out-of-order delivery breaks state machine assumptions',
  ],
  production: {
    reliability: ['DLQ after N failures', 'Idempotency store with TTL', 'Transactional outbox pattern'],
    observability: ['Consumer lag, redelivery rate, dedupe hit rate'],
    maintainability: ['Document semantic per topic/queue'],
  },
  interview: {
    expectations: [
      'Define three semantics clearly',
      'Explain duplicate cause in at-least-once',
      'Exactly-once = idempotency + dedupe story',
    ],
    commonQuestions: [
      'At-least-once vs exactly-once?',
      'How prevent double payment on retry?',
      'When at-most-once OK?',
    ],
    followUps: [
      'Transactional outbox?',
      'Kafka EOS limitations?',
    ],
    misconceptions: [
      'Kafka “exactly once” covers DB write without inbox table',
      'Ack after receive equals processed',
    ],
    traps: [
      'Saying exactly-once with no idempotency mechanism',
    ],
    strongSignals: [
      'messageId dedupe table',
      'Outbox + inbox pattern',
      'DLQ for poison pills',
    ],
  },
  keyTakeaways: [
    'At-most-once: may lose, no dup.',
    'At-least-once: no lose if persisted, may dup — default for critical work.',
    'Exactly-once end-to-end needs idempotent handlers + dedupe/outbox.',
    'Ack timing defines loss vs duplicate tradeoff.',
    'Match semantic to business tolerance (email vs payment).',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'At-least-once meaning?', answerHint: 'Message redelivered until ack; duplicates possible.' },
    { level: 'intermediate', question: 'Prevent duplicate charge?', answerHint: 'Idempotency key/messageId store; atomic check-and-set with payment API.' },
    { level: 'advanced', question: 'Transactional outbox?', answerHint: 'Write business row + outbox event same DB txn; relay publishes to broker.' },
  ],
  flashcards: [
    { front: 'At-most-once', back: 'No retry; may lose messages' },
    { front: 'At-least-once', back: 'Retry until ack; may duplicate' },
    { front: 'Exactly-once practical', back: 'Idempotent consumer + dedupe/outbox' },
    { front: 'Ack after process', back: 'At-least-once; crash before ack → redelivery' },
  ],
  quickRevision: [
    'Three semantics table',
    'Dup from retry',
    'Idempotency keys',
    'Outbox pattern',
    'DLQ poison messages',
  ],
  systemDesign: {
    problem: 'Design an order processing pipeline: OrderPlaced → inventory reserve → payment charge → confirmation email, with correct behavior under consumer crashes and broker redelivery.',
    requirements: {
      functional: ['Process order events in stages', 'No double charge', 'Email can be best-effort'],
      nonFunctional: ['At-least-once between stages', 'Payment effectively-once', 'Observable lag and DLQ'],
    },
    scaleAssumptions: ['5k orders/min peak', '3 consumer services'],
    capacityEstimates: ['Idempotency store: messageId × 7 day TTL ~ millions keys'],
    api: [{ type: 'code', language: 'text', code: `Topics: order.placed, payment.completed, order.confirmed\nConsumer groups per service` }],
    dataModel: [{ type: 'list', items: ['processed_messages(message_id PK, processed_at)', 'Outbox table in order DB', 'Order state machine statuses'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'Order service writes Order + outbox row in one txn. Relay publishes to Kafka. Payment consumer idempotent on messageId. Inventory uses conditional update. Email at-most-once or dedupe.' }],
    diagram: {
      mermaid: `flowchart LR
  OS[Order Service] -->|txn| DB[(Orders+Outbox)]
  Relay --> Kafka[(Kafka)]
  Kafka --> Inv[Inventory Consumer]
  Kafka --> Pay[Payment Consumer]
  Kafka --> Mail[Email Consumer]
  Pay --> Idem[(Idempotency DB)]`,
      caption: 'Outbox + idempotent consumers',
    },
    dataFlow: [
      'Place order → outbox event',
      'Relay publishes at-least-once',
      'Payment: if messageId seen skip else charge + record',
      'Email: optional at-most-once',
    ],
    storage: ['Postgres orders + outbox', 'Redis/Postgres idempotency keys'],
    caching: ['Avoid caching payment decisions'],
    asyncProcessing: ['Kafka partitions keyed by orderId for order per key'],
    scaling: ['Scale consumer groups horizontally', 'Partition count ≥ peak parallelism'],
    consistency: ['Inventory conditional decrement strong per SKU row', 'Cross-service eventual'],
    reliability: ['DLQ after 5 failures', 'Manual replay tool with idempotency'],
    failureScenarios: ['Payment crash after charge before mark → retry safe via idempotency', 'Duplicate inventory reserve → idempotent reserve token'],
    security: ['Encrypt PCI scope in payment service only'],
    observability: ['Redelivery rate, idempotency hit %, stage lag'],
    bottlenecks: ['Hot partition celebrity order', 'Idempotency store write QPS'],
    alternatives: ['Saga orchestrator with compensations'],
    tradeoffs: ['Exactly-once cost vs at-least-once + idempotency simplicity'],
    interviewFollowUps: ['Ordering across partitions?', 'Kafka transaction vs outbox?'],
    evolution: [
      { stage: '1. Simple design', description: 'Direct HTTP chain sync.', bottleneck: 'Cascade failures; no buffer.' },
      { stage: '2. Improve', description: 'Kafka at-least-once.', bottleneck: 'Duplicate payments.' },
      { stage: '3. Improve', description: 'Idempotency + outbox.', bottleneck: 'Cross-topic ordering.' },
      { stage: '4. Scale further', description: 'Saga + DLQ tooling + partition tuning.', bottleneck: 'Ops complexity.' },
    ],
  },
}
