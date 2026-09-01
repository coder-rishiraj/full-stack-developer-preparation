import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Event-Driven Architecture (EDA) uses events as primary integration — services publish facts (OrderPlaced) to broker; others subscribe asynchronously. Decouples producers from consumers, enables replay, fan-out, and temporal autonomy. Kafka is common log-backed implementation; contrasts with synchronous REST choreography.',
  whyExists:
    'Tight REST chains fail cascading and require all services up. EDA lets fulfillment, email, analytics react independently. New consumers subscribe without changing producer. Audit trail from immutable log.',
  mentalModel:
    'Producers announce what happened, not commands to specific service. Events are past tense facts with schema. Consumers idempotent and independent. Saga/orchestration coordinates long workflows via events.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'EDA fan-out',
      diagram: `flowchart LR
  OS[Order Service] -->|OrderPlaced| K[(Kafka)]
  K --> FS[Fulfillment]
  K --> ES[Email]
  K --> AS[Analytics]
  K --> IS[Inventory]`,
    },
    {
      type: 'table',
      headers: ['Pattern', 'Description'],
      rows: [
        ['Event notification', 'Minimal id — consumer calls API for details'],
        ['Event-carried state transfer', 'Full payload in event — fewer calls'],
        ['Event sourcing', 'State rebuilt from event log'],
        ['CQRS', 'Write model emits events; read models subscribe'],
        ['Outbox', 'Atomic DB write + event publish'],
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'OrderPlaced event {orderId, userId, lines, total}. Inventory reserves stock; Payment captures funds; Email sends receipt — each consumer group independent lag. New fraud service joins group without order API change.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'At-least-once + idempotency standard',
        'Schema registry for Avro/Protobuf evolution',
        'Ordering per aggregate id via partition key',
        'Choreography vs orchestration saga trade-offs',
        'Observability: trace id in event headers',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Loose coupling', 'Scale consumers independently', 'Replay and audit'],
    disadvantages: ['Distributed debugging harder', 'Eventual consistency UX', 'Schema governance needed'],
    alternatives: ['Sync REST', 'Batch ETL', 'Shared DB anti-pattern'],
    whenToUse: ['Multi-subscriber workflows', 'High throughput async', 'Audit/replay requirements'],
    whenNotToUse: ['Simple CRUD needing immediate read-your-writes across aggregates'],
  },
  failureModes: [
    'Dual write — DB commit without event',
    'Chatty events causing coupling',
    'Missing version on schema break consumers',
    'Circular event dependencies',
    'No DLQ — poison pill stops pipeline',
  ],
  production: {
    reliability: ['Transactional outbox pattern', 'Idempotent consumers', 'DLQ and replay'],
    observability: ['End-to-end lag, distributed tracing correlation id'],
    maintainability: ['Event catalog documented', 'Backward compatible schema changes'],
    scalability: ['Partition by business key', 'Independent consumer scale'],
  },
  interview: {
    expectations: ['EDA benefits', 'Outbox', 'Choreography vs orchestration', 'Delivery semantics'],
    commonQuestions: ['Design order flow with Kafka?', 'EDA vs REST?', 'Ensure event published if DB commits?'],
    followUps: ['Event sourcing vs notification?', 'Saga pattern?'],
    misconceptions: ['EDA removes need for sync APIs entirely', 'Events are commands'],
    traps: ['Updating DB and publishing event without outbox — can lose either'],
    strongSignals: ['Outbox, idempotent consumers, schema evolution, partition key design'],
  },
  keyTakeaways: [
    'Events are immutable facts — past tense.',
    'Producers decoupled from consumer count.',
    'Use outbox for DB + publish atomicity.',
    'Idempotent consumers + at-least-once default.',
    'Schema registry and compatibility rules essential.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is EDA?', answerHint: 'Services integrate by publishing/subscribing events asynchronously via broker.' },
    { level: 'intermediate', question: 'Outbox pattern why?', answerHint: 'Avoid dual write — atomically write business row and outbox row; relay publishes to Kafka.' },
    { level: 'advanced', question: 'Choreography vs orchestration saga?', answerHint: 'Choreography: services react to events decentralized; orchestration: central coordinator sends commands — trade coupling vs visibility.' },
  ],
  flashcards: [
    { front: 'EDA', back: 'Integration via async events — loose coupling fan-out' },
    { front: 'Event vs command', back: 'Event: fact happened; command: request action' },
    { front: 'Outbox', back: 'Same txn writes row + event row; relay to broker' },
    { front: 'Fan-out', back: 'Multiple consumer groups read same topic independently' },
  ],
  quickRevision: ['Facts not commands', 'Outbox pattern', 'Idempotent consumers', 'Schema evolution', 'Partition by key'],
}
