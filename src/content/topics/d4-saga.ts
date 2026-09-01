import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Distributed saga (system design sense) coordinates multi-service business transactions as sequence of local commits with compensating transactions — achieving eventual consistency without two-phase commit locks across microservices.',
  whyExists:
    'Order placement touches inventory, payment, shipping services each with own database. Global ACID impractical. Saga accepts temporary inconsistency between steps; failure triggers compensating actions (release stock, refund) rather than blocking locks.',
  mentalModel:
    'Multi-step trip booking with cancellation policy per step. Forward steps commit locally; backward compensations undo business effect if later step fails. Orchestrator script or choreographed events advance saga state machine.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Choreographed saga via events',
      diagram: `sequenceDiagram
  participant O as Order Svc
  participant I as Inventory
  participant P as Payment
  participant S as Shipping
  O->>I: ReserveStock
  I-->>O: StockReserved event
  O->>P: Charge
  P-->>O: PaymentFailed event
  O->>I: ReleaseStock compensate`,
    },
    {
      type: 'table',
      headers: ['Style', 'Characteristics'],
      rows: [
        ['Orchestration', 'Central saga manager invokes steps, handles failure'],
        ['Choreography', 'Services react to domain events — decoupled'],
        ['Outbox', 'Reliable event publish after local commit'],
        ['Saga log', 'Persist step status for recovery and audit'],
      ],
    },
    {
      type: 'list',
      items: [
        'Each step idempotent — retries safe on at-least-once messaging.',
        'Compensation is business undo not DB rollback — may be partial refund.',
        'Visible intermediate states: RESERVED unpaid order — UI must handle.',
        'Temporal/Camunda for durable orchestration with timers and human tasks.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'E-commerce checkout saga: (1) create order PENDING, (2) reserve inventory, (3) charge payment, (4) create shipment. Payment fails at step 3 → compensate release inventory, mark order FAILED. Each step publishes event via outbox; consumers idempotent on orderId.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Semantic lock: order status prevents duplicate payment while saga runs.',
        'Parallel steps when independent — join gateway in BPMN terms.',
        'Poison compensation → manual intervention queue and alert.',
        'Contrast c11-saga messaging patterns — same concept different layer emphasis.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['No distributed locks', 'Service autonomy', 'Scales with microservices', 'Recoverable via saga log'],
    disadvantages: ['Complex compensation matrix', 'Temporary inconsistency', 'Debugging harder than monolith TX'],
    alternatives: ['2PC/XA — avoid', 'Monolith single DB transaction', 'Event sourcing single aggregate'],
    whenToUse: ['Cross-service workflows', 'Long-running business processes'],
    whenNotToUse: ['Single service single database', 'Immediate global consistency required'],
  },
  failureModes: [
    'Missing compensation — orphaned inventory hold',
    'Duplicate event double charge without idempotency',
    'Compensation fails — stuck saga requires ops',
    'Cyclic event dependencies infinite loop',
    'User sees inconsistent intermediate UI state',
  ],
  production: {
    reliability: ['Saga state table + DLQ', 'Idempotent handlers', 'Outbox pattern'],
    observability: ['Distributed trace correlationId per saga', 'Dashboard stuck sagas age'],
    maintainability: ['Compensation matrix documented per step'],
    security: ['Authorize each step with order ownership'],
  },
  interview: {
    expectations: ['Orchestration vs choreography', 'Compensation vs 2PC', 'Idempotency', 'Outbox'],
    commonQuestions: ['Checkout across 3 microservices?', 'Payment fails after inventory reserved?'],
    followUps: ['Saga vs 2PC?', 'Exactly-once steps?'],
    misconceptions: ['Saga is globally ACID', 'Automatic DB rollback on compensate'],
    traps: ['No compensation for step 1'],
    strongSignals: ['Saga log', 'Compensating transactions', 'Outbox events', 'Temporal mention'],
  },
  keyTakeaways: [
    'Saga = local transactions + compensating actions across services.',
    'Orchestration central; choreography event-driven.',
    'Idempotent steps essential for at-least-once delivery.',
    'Temporary inconsistency visible between steps.',
    'Prefer over 2PC for microservices.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Distributed saga vs 2PC?', answerHint: 'Saga local commits + compensate; 2PC global atomic lock — saga better availability in microservices.' },
    { level: 'intermediate', question: 'Orchestrated vs choreographed saga?', answerHint: 'Orchestrator directs; choreography services react to events — latter decoupled harder to trace.' },
    { level: 'advanced', question: 'Ensure reliable saga step publish?', answerHint: 'Transactional outbox in same DB commit as business write; relay to Kafka.' },
  ],
  flashcards: [
    { front: 'Compensating transaction', back: 'Business undo when later saga step fails' },
    { front: 'Orchestration', back: 'Central coordinator invokes services in sequence' },
    { front: 'Choreography', back: 'Event chain — each service subscribes and reacts' },
    { front: 'Saga log', back: 'Persistent record of step completion for recovery' },
  ],
  quickRevision: ['Local TX + compensate', 'Not 2PC', 'Idempotent steps', 'Outbox events', 'Orchestrate vs choreograph'],
}
