import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Transactional Outbox pattern writes domain events to an outbox table in the same database transaction as business data, then a separate relay process publishes rows to Kafka/message broker and marks them sent — guaranteeing at-least-once delivery without dual-write inconsistency between DB and broker.',
  whyExists:
    'Dual write anti-pattern: save order to Postgres AND publish to Kafka — one can succeed while other fails. Outbox makes event insert atomic with order row; relay retries publish until success. Debezium CDC or polling publisher reads outbox table.',
  mentalModel:
    'Same envelope as business letter. Transaction stuffs letter in outbox tray (DB table) with package (order). Mail clerk (relay) picks up tray, sends to Kafka, stamps sent. If clerk crashes, next pass retries unsent rows.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Transactional outbox flow',
      diagram: `sequenceDiagram
  participant S as OrderService
  participant DB as PostgreSQL
  participant R as Outbox Relay
  participant K as Kafka
  S->>DB: BEGIN; INSERT order; INSERT outbox
  DB-->>S: COMMIT
  R->>DB: SELECT unsent outbox
  R->>K: publish event
  R->>DB: UPDATE sent_at`,
    },
    {
      type: 'list',
      items: [
        'Outbox row: id, aggregate_id, event_type, payload JSON, created_at, sent_at NULL.',
        'Relay: polling (@Scheduled) or Debezium WAL CDC stream.',
        'Consumers must be idempotent — relay may duplicate on crash after publish before mark sent.',
        'Spring: @TransactionalEventListener AFTER_COMMIT or explicit outbox insert in same @Transactional method.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Atomic order + outbox insert',
      code: `@Transactional
public void placeOrder(PlaceOrder cmd) {
  Order order = orderRepo.save(new Order(cmd));
  outboxRepo.save(new OutboxEvent(
      UUID.randomUUID(),
      order.getId(),
      "OrderPlaced",
      json.writeValueAsString(new OrderPlacedEvent(order.getId())),
      Instant.now()
  ));
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Polling relay with idempotent publish',
      code: `@Scheduled(fixedDelay = 1000)
@SchedulerLock(name = "outboxRelay")
public void relay() {
  List<OutboxEvent> batch = outboxRepo.findTop100BySentAtIsNull();
  for (OutboxEvent e : batch) {
    kafka.send(e.getTopic(), e.getAggregateId(), e.getPayload());
    e.setSentAt(Instant.now());
    outboxRepo.save(e);
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Debezium outbox event router transforms table row to Kafka message envelope.',
        'Ordering: relay publishes in created_at order per aggregate if needed.',
        'Cleanup job deletes sent rows older than retention window.',
        'Saga orchestration often starts from outbox-published events.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Atomic DB + event intent', 'Reliable at-least-once to broker', 'No distributed transaction across DB and Kafka'],
    disadvantages: ['Eventual publish latency (poll interval)', 'Outbox table growth', 'Idempotent consumers required'],
    alternatives: ['Change Data Capture without explicit outbox table', 'Kafka transactions (limited)', 'Event sourcing store as source'],
    whenToUse: ['Microservices emitting domain events after DB commit', 'Need reliable integration events'],
    whenNotToUse: ['Fire-and-forget analytics', 'When CDC on main table sufficient without outbox schema'],
  },
  failureModes: [
    'Relay marks sent before Kafka ack — lost event',
    'Duplicate publish if crash after Kafka success before DB update — need idempotent consumer',
    'Outbox poll too slow — downstream lag',
    'Large payload in outbox bloats DB — store reference to S3',
    'Missing index on sent_at NULL — slow relay queries',
  ],
  production: {
    reliability: ['Single-flight relay with ShedLock', 'Monitor unsent outbox age', 'Idempotency keys on consumers'],
    performance: ['Batch relay; index (sent_at) WHERE sent_at IS NULL partial', 'Debezium for lower latency than poll'],
    observability: ['Metric: outbox_lag_seconds, relay failures', 'Alert backlog > threshold'],
    maintainability: ['Standard event envelope schema versioning'],
  },
  interview: {
    expectations: ['Dual write problem', 'Same transaction insert', 'Relay + idempotent consumer'],
    commonQuestions: ['Publish Kafka event after DB save reliably?', 'Outbox vs CDC?'],
    followUps: ['Exactly-once possible?', 'Ordering per aggregate?'],
    misconceptions: ['Outbox gives exactly-once end-to-end', 'Direct Kafka publish in @Transactional enough'],
    traps: ['kafka.send before transaction commit'],
    strongSignals: ['AFTER_COMMIT relay', 'Debezium option', 'Idempotent consumer design'],
  },
  keyTakeaways: [
    'Insert outbox row in same DB transaction as business write.',
    'Separate relay publishes to Kafka asynchronously.',
    'At-least-once delivery — consumers must be idempotent.',
    'Debezium CDC or polling relay both valid.',
    'Avoids dual-write inconsistency between DB and broker.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why transactional outbox?', answerHint: 'Atomically record event intent with DB change; relay publishes later — no dual-write failure.' },
    { level: 'intermediate', question: 'Duplicate events from outbox?', answerHint: 'Relay retry after publish before mark sent — consumer dedupe via event id.' },
    { level: 'advanced', question: 'Outbox vs Debezium CDC on orders table?', answerHint: 'Outbox explicit event schema and filtering; CDC captures all row changes — may leak internals.' },
  ],
  flashcards: [
    { front: 'Dual write problem', back: 'DB commit succeeds but Kafka publish fails — inconsistent state' },
    { front: 'Outbox table', back: 'Events stored in same transaction as domain data' },
    { front: 'Relay', back: 'Process reading unsent outbox rows and publishing to broker' },
    { front: 'Idempotent consumer', back: 'Handles duplicate event delivery safely' },
  ],
  quickRevision: ['Same TX insert outbox', 'Relay publishes async', 'At-least-once', 'Idempotent consumers', 'Debezium or poll'],
}
