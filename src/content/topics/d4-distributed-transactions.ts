import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Distributed transactions coordinate commits across multiple services or databases so all participants succeed or all abort — spanning 2PC (two-phase commit), 3PC, Saga (choreography/orchestration), and TCC (try-confirm-cancel). True global ACID across arbitrary microservices is rare; patterns trade atomicity for availability.',
  whyExists:
    'Business operations span systems: debit wallet + credit merchant + update inventory. Partial failure without coordination leaves inconsistent state (money taken, order not created). Distributed transactions attempt cross-boundary atomicity or compensating workflows.',
  mentalModel:
    '2PC: coordinator asks all to prepare, then commit or abort — blocking if coordinator dies. Saga: sequence of local transactions with compensating steps on failure — eventual consistency. Pick saga for microservices; reserve 2PC for colocated or XA-capable databases.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Pattern', 'Atomicity', 'Availability', 'Typical use'],
      rows: [
        ['2PC', 'All-or-nothing', 'Blocked on coordinator/participant failure', 'Single cluster XA, some MQ'],
        ['Saga orchestration', 'Eventual via compensations', 'Higher — no global lock', 'Microservices order flow'],
        ['Saga choreography', 'Eventual', 'Decentralized', 'Event-driven domains'],
        ['TCC', 'Business-level try/confirm/cancel', 'Manual reserve/release logic', 'Payment holds, inventory reserve'],
        ['Outbox + inbox', 'At-least-once with idempotency', 'Good for async boundaries', 'Reliable cross-service publish'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Saga orchestration with compensations',
      diagram: `sequenceDiagram
  participant O as Orchestrator
  participant P as Payment
  participant I as Inventory
  participant S as Shipping
  O->>P: charge
  P-->>O: ok
  O->>I: reserve
  I-->>O: fail
  O->>P: refund (compensate)
  Note over O: Order aborted; payment reversed`,
    },
    {
      type: 'callout',
      variant: 'warning',
      title: '2PC pitfalls',
      text: 'Coordinator crash after prepare leaves participants holding locks — heuristic commit risk. Avoid 2PC across WAN microservices; use saga/outbox.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'E-commerce checkout saga: (1) create pending order, (2) authorize payment, (3) reserve inventory, (4) confirm payment, (5) mark order confirmed. Failure at (3) runs compensate: void payment, cancel order.',
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Outbox pattern sketch',
      code: `await db.transaction(async (tx) => {
  await tx.orders.insert({ id, status: 'pending' })
  await tx.outbox.insert({ topic: 'OrderCreated', payload: { id } })
})
// Separate poller publishes to Kafka — at-least-once; consumers idempotent`,
    },
  ],
  tradeoffs: {
    advantages: ['Cross-service business integrity', 'Saga fits long-running flows', 'Outbox reliable messaging'],
    disadvantages: ['2PC slow and fragile', 'Saga compensations complex and visible to users', 'No isolation equivalent to single DB serializable'],
    alternatives: ['Single monolith DB transaction', 'Event sourcing + projections', 'CRDT where merge OK'],
    whenToUse: ['Multi-step business processes', 'Payment + inventory coupling', 'Reliable event publish after DB write'],
    whenNotToUse: ['Simple single-service CRUD', 'When async eventual OK without compensations'],
  },
  failureModes: [
    'Lost compensating transaction → orphaned charge',
    'Duplicate saga step without idempotency → double charge',
    '2PC blocking locks on participant crash',
    'Outbox publisher lag → downstream stale',
    'Ordering violations in choreography sagas',
  ],
  production: {
    reliability: ['Idempotent saga steps with business keys', 'Durable orchestrator state machine', 'Outbox with exactly-once publish semantics via dedup'],
    observability: ['Saga state traces, stuck compensations, outbox lag'],
    maintainability: ['Explicit compensation matrix documented', 'Version saga definitions'],
    performance: ['Async saga steps; avoid 2PC across regions'],
    security: ['Auth between saga participants', 'Audit compensations'],
  },
  interview: {
    expectations: ['2PC vs Saga', 'Compensating transactions', 'Outbox pattern'],
    commonQuestions: ['Checkout without 2PC?', 'Handle payment success inventory fail?'],
    followUps: ['Saga vs event sourcing?', 'Exactly-once across services?'],
    misconceptions: ['Microservices can use global 2PC easily', 'Saga equals ACID'],
    traps: ['No idempotency on saga retries'],
    strongSignals: ['State machine diagram', 'Outbox/inbox', 'TCC reserve pattern'],
  },
  keyTakeaways: [
    'True distributed ACID (2PC) is fragile across services — prefer saga/outbox.',
    'Saga: forward steps + compensations; eventual consistency.',
    'Outbox ties DB commit to message publish reliably.',
    'Every step must be idempotent for retries.',
    'TCC models business-level reserve/confirm/cancel.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is a compensating transaction?', answerHint: 'Semantic undo of completed step (refund, release inventory).' },
    { level: 'intermediate', question: '2PC phases?', answerHint: 'Prepare (vote yes/no) then commit or abort; blocks if coordinator fails after prepare.' },
    { level: 'advanced', question: 'Design checkout saga failure at shipping.', answerHint: 'Compensate inventory release, payment void, order cancel; idempotent steps; durable orchestrator state.' },
  ],
  flashcards: [
    { front: '2PC weakness', back: 'Blocking, coordinator SPOF, poor across WAN services' },
    { front: 'Saga', back: 'Local txs + compensations; eventual not atomic globally' },
    { front: 'Outbox', back: 'Write event in same DB txn as business row; async publisher' },
    { front: 'TCC Try', back: 'Reserve resources; Confirm or Cancel later' },
  ],
  quickRevision: [
    'Avoid 2PC microservices',
    'Saga + compensate',
    'Outbox for publish',
    'Idempotent steps',
    'Orchestrator state machine',
  ],
  systemDesign: {
    problem: 'Design distributed order placement across payment, inventory, and notification services without double charge or oversell.',
    requirements: {
      functional: ['Place order', 'Cancel', 'Status tracking'],
      nonFunctional: ['No double charge', 'Compensate within minutes', 'Audit trail'],
    },
    scaleAssumptions: ['5k orders/s peak', '3 microservices + orchestrator'],
    capacityEstimates: ['Orchestrator state in Postgres; outbox poller 1k/s'],
    api: [{ type: 'code', language: 'http', code: `POST /orders {items, payment_method}\nGET /orders/{id}/status` }],
    dataModel: [{ type: 'list', items: ['saga_instances(id, state, step)', 'outbox events', 'idempotency_keys'] }],
    highLevelArchitecture: [
      { type: 'paragraph', text: 'Orchestrated saga in Order service; each step REST call with idempotency-key; state persisted; compensations on failure path.' },
    ],
    diagram: {
      mermaid: `stateDiagram-v2
  [*] --> Pending
  Pending --> PaymentAuthorized: charge ok
  PaymentAuthorized --> InventoryReserved: reserve ok
  InventoryReserved --> Confirmed: confirm payment
  PaymentAuthorized --> Compensating: reserve fail
  Compensating --> Failed: refund done`,
      caption: 'Order saga state machine',
    },
    dataFlow: ['Client POST → orchestrator → steps → terminal state', 'Outbox emits OrderConfirmed'],
    storage: ['Order DB for saga + outbox', 'Each service local DB'],
    caching: ['None on money path'],
    asyncProcessing: ['Outbox → Kafka → notifications'],
    scaling: ['Horizontal orchestrator workers partition by order_id'],
    consistency: ['Per-service ACID; global eventual via saga'],
    reliability: ['Retry idempotent steps', 'Timeout triggers compensate'],
    failureScenarios: ['Payment ok inventory fail → refund saga', 'Duplicate POST → same idempotency key returns original order'],
    security: ['Service mTLS', 'PII in payment isolated'],
    observability: ['Saga step metrics, DLQ for stuck flows'],
    bottlenecks: ['Orchestrator DB write rate'],
    alternatives: ['Choreography via events only'],
    tradeoffs: ['Orchestrator centralization vs choreography debug difficulty'],
    interviewFollowUps: ['Exactly-once charge?', 'Saga timeout while payment pending?'],
    evolution: [
      { stage: '1. Simple design', description: 'Monolith transaction.', bottleneck: 'Service split breaks atomicity.' },
      { stage: '2. Improve', description: '2PC attempt across services.', bottleneck: 'Locks and outages.' },
      { stage: '3. Improve', description: 'Orchestrated saga + outbox.', bottleneck: 'Compensation UX.' },
      { stage: '4. Scale further', description: 'Partition orchestrator; event audit log.', bottleneck: 'Cross-partition queries.' },
    ],
  },
}
