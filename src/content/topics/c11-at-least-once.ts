import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'At-least-once delivery means every message is delivered one or more times — never lost, but duplicates possible. Kafka default with auto-commit or commit-after-processing: consumer may crash after processing but before commit, or commit before finish then crash — redelivery occurs. Requires idempotent consumers.',
  whyExists:
    'Network and process failures make exactly-once expensive. At-least-once with idempotent handlers is the pragmatic default — simpler than distributed transactions while guaranteeing no silent message loss when commits align with processing carefully.',
  mentalModel:
    'Message may arrive again — design handlers to tolerate duplicates via idempotency keys, upserts, or processed-event table. Prefer commit offset after successful side effects (or transactional outbox). Duplicates are expected, not bugs.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Duplicate on crash after process before commit',
      diagram: `sequenceDiagram
  participant K as Kafka
  participant C as Consumer
  K->>C: poll record offset 100
  C->>C: process payment (success)
  Note over C: crash before commit
  K->>C: redeliver offset 100
  C->>C: duplicate unless idempotent`,
    },
    {
      type: 'list',
      items: [
        'enable.auto.commit=false — manual commit after handler success',
        'Store offset with side effect in same DB transaction (outbox) when possible',
        'Idempotency: business key UNIQUE constraint or processed(offset, partition) table',
        'Logging duplicate detection metrics — not zero duplicates goal',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Commit sync after successful processing',
      code: `@KafkaListener(topics = "orders")
void onOrder(ConsumerRecord<String, OrderEvent> rec, Acknowledgment ack) {
  orderService.processIdempotent(rec.value()); // upsert by orderId
  ack.acknowledge(); // commit offset after success
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Producer acks=all + min.insync.replicas reduces loss on broker failure — still at-least-once consumer side',
        'Rebalance may duplicate if commit after revoke delayed',
        'Retry loops in consumer re-process same record',
        'Contrast at-most-once: commit before process — may lose on crash after commit',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['No silent message loss', 'Standard Kafka consumer pattern', 'Works with idempotent design'],
    disadvantages: ['Duplicate processing burden', 'Offset commit ordering complexity', 'Harder exactly-once illusion'],
    alternatives: ['At-most-once for metrics where loss OK', 'Kafka EOS transactions for narrow cases'],
    whenToUse: ['Payments, orders, inventory — cannot lose events'],
    whenNotToUse: ['When duplicates unacceptable without idempotency infrastructure'],
  },
  failureModes: [
    'Non-idempotent handler — double charge on redelivery',
    'Auto-commit before processing completes',
    'Long processing + max.poll.interval exceeded — rebalance duplicates',
    'Commit failure after DB write — double apply on retry',
  ],
  production: {
    reliability: ['Idempotent consumers mandatory', 'Manual ack after side effects'],
    observability: ['Duplicate detection counter', 'Consumer lag alerts'],
    maintainability: ['Document idempotency key per event type'],
  },
  interview: {
    expectations: ['Define at-least-once', 'Why duplicates happen', 'Idempotent consumer pattern'],
    commonQuestions: ['At-least-once vs at-most-once?', 'Prevent double processing?'],
    followUps: ['Commit before or after process?', 'Exactly-once possible?'],
    misconceptions: ['At-least-once means no duplicates', 'Kafka guarantees exactly-once end-to-end easily'],
    traps: ['Auto-commit with financial side effects'],
    strongSignals: ['Manual ack, idempotency store, upsert keys, metrics on dupes'],
  },
  keyTakeaways: [
    'At-least-once: message never lost, duplicates possible.',
    'Commit offset after successful processing.',
    'Idempotent handlers are mandatory.',
    'Default pragmatic choice for critical events.',
    'Pair with dedup table or natural unique keys.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is at-least-once delivery?', answerHint: 'Every message delivered one or more times; no loss but duplicates possible.' },
    { level: 'intermediate', question: 'When duplicate happens in Kafka consumer?', answerHint: 'Process succeeds then crash before offset commit — redelivery on restart.' },
    { level: 'advanced', question: 'Make payment consumer at-least-once safe?', answerHint: 'Idempotency key in DB unique constraint; commit offset after txn commits; track processed event ids.' },
  ],
  flashcards: [
    { front: 'At-least-once', back: 'Deliver ≥1 times — may duplicate, should not lose' },
    { front: 'Manual ack', back: 'Commit offset after handler success — reduces premature commit' },
    { front: 'Idempotent consumer', back: 'Duplicate delivery has same effect as once' },
    { front: 'Auto-commit risk', back: 'May commit before processing finishes — loss on crash after commit' },
  ],
  quickRevision: ['May duplicate never lose', 'Ack after process', 'Idempotent handler', 'Disable auto-commit', 'Dedup keys'],
}
