import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Saga pattern coordinates long-running distributed transactions as sequence of local transactions with compensating actions on failure — no global 2PC lock. Orchestration (central coordinator) vs choreography (events chain reactions). Common in microservices order → payment → inventory → shipping flows.',
  whyExists:
    'Cross-service ACID transactions impractical at scale. Saga accepts eventual consistency: each step commits locally; if later step fails, prior steps run compensating transactions (cancel payment, release inventory) rather than rolling back remote DBs atomically.',
  mentalModel:
    'Travel booking: reserve flight, then hotel, then car. Hotel fails — cancel flight (compensate), not undo database magically. Each step is irreversible forward action + defined undo. Orchestrator script or event chain drives state machine.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Orchestrated saga with compensation',
      diagram: `stateDiagram-v2
  [*] --> ReserveInventory
  ReserveInventory --> ChargePayment: OK
  ReserveInventory --> [*]: fail
  ChargePayment --> CreateShipment: OK
  ChargePayment --> CompensateInventory: fail
  CreateShipment --> [*]: OK
  CreateShipment --> CompensatePayment: fail
  CompensatePayment --> CompensateInventory
  CompensateInventory --> [*]`,
    },
    {
      type: 'table',
      headers: ['Style', 'Pros', 'Cons'],
      rows: [
        ['Orchestration', 'Clear flow visibility; central error handling', 'Orchestrator SPOF; coupling to coordinator'],
        ['Choreography', 'Decoupled services react to events', 'Hard to trace; cyclic dependencies risk'],
        ['Outbox + events', 'Reliable step triggering', 'Requires idempotent handlers'],
      ],
    },
    {
      type: 'list',
      items: [
        'Each step: execute + publish event; compensating action must be idempotent.',
        'Saga log table tracks state: PENDING, COMPLETED, COMPENSATING per step.',
        'Temporal/Camunda orchestrate; Kafka choreography via domain events.',
        'Semantic lock: mark order PAYMENT_PENDING preventing duplicate charge.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Saga step with compensation sketch',
      code: `public void executeOrderSaga(UUID orderId) {
  SagaState state = sagaRepo.start(orderId);
  try {
    inventoryService.reserve(orderId);
    state.completeStep("RESERVE");
    paymentService.charge(orderId);
    state.completeStep("PAY");
    shippingService.schedule(orderId);
    state.completeStep("SHIP");
  } catch (PaymentFailedException e) {
    inventoryService.release(orderId); // compensate
    state.compensate("RESERVE");
    orderService.markFailed(orderId);
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Compensation is business undo not DB ROLLBACK — may be partial (refund fee).',
        'Parallel saga steps possible when independent — join before next.',
        'Poison step: compensation also fails — manual intervention queue.',
        'Event-carried state transfer reduces chatty orchestrator calls.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['No distributed locks across services', 'Each service owns its data', 'Scales with microservices'],
    disadvantages: ['Complex compensation logic', 'Temporary inconsistent visible states', 'Harder debugging than monolith transaction'],
    alternatives: ['2PC/XA (avoid)', 'Monolith transaction', 'Event sourcing single aggregate'],
    whenToUse: ['Multi-service business workflows', 'Long-running processes with human steps'],
    whenNotToUse: ['Single database can use local @Transactional', 'Strong immediate consistency required everywhere'],
  },
  failureModes: [
    'Missing compensating action — orphaned reservation',
    'Duplicate event triggers double payment — need idempotency',
    'Compensation fails — inconsistent stuck state',
    'User sees intermediate state without UI handling',
    'Cyclic choreography — infinite event loop',
  ],
  production: {
    reliability: ['Saga state persistence', 'Idempotent steps and compensations', 'DLQ for failed compensations'],
    observability: ['Saga instance tracing with correlation id', 'Dashboard stuck sagas'],
    maintainability: ['Document compensation matrix per step', 'Orchestrator versioned workflow definitions'],
    security: ['Authorize each step with order ownership context'],
  },
  interview: {
    expectations: ['Orchestration vs choreography', 'Compensation vs rollback', 'Idempotency', 'Visible inconsistency'],
    commonQuestions: ['Order flow across 3 services?', 'Payment fails after inventory reserved?'],
    followUps: ['Saga vs 2PC?', 'Exactly-once steps?'],
    misconceptions: ['Saga is ACID across services', 'Compensation equals automatic DB undo'],
    traps: ['No compensation defined for early steps'],
    strongSignals: ['Saga log table', 'Idempotent compensate', 'Outbox events', 'Temporal mention'],
  },
  keyTakeaways: [
    'Saga = local transactions + compensating actions.',
    'Orchestration central; choreography event-driven.',
    'Compensations must be idempotent business undo.',
    'Temporary inconsistency visible between steps.',
    'Pair with outbox for reliable event triggering.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is saga pattern?', answerHint: 'Distributed workflow as local TX steps with compensating actions on failure — no global 2PC.' },
    { level: 'intermediate', question: 'Orchestration vs choreography saga?', answerHint: 'Orchestrator directs steps; choreography services react to each others events.' },
    { level: 'advanced', question: 'Payment succeeds but shipping fails?', answerHint: 'Compensate payment (refund) and release inventory; mark saga failed; alert if compensate fails.' },
  ],
  flashcards: [
    { front: 'Compensating transaction', back: 'Business undo for completed saga step' },
    { front: 'Orchestration', back: 'Central coordinator invokes each step and handles failure' },
    { front: 'Choreography', back: 'Services publish/subscribe events to advance saga' },
    { front: 'Semantic lock', back: 'Business state preventing invalid concurrent saga actions' },
  ],
  quickRevision: ['Local TX + compensate', 'Orchestrate vs choreograph', 'Idempotent steps', 'Saga state log', 'Outbox events'],
}
