import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Exactly-once semantics means effect as if each message processed once — no loss, no duplicate side effects. Kafka provides idempotent producer + transactions (read-process-write atomic) for narrow pipeline scope. End-to-end exactly-once across DB + Kafka requires transactional outbox or idempotent consumer — true global EOS is hard.',
  whyExists:
    'Finance and inventory want to avoid both lost events and duplicate charges. Kafka transactions tie consumer offset commit with producer send in same txn. Interviews test understanding limits — marketing "exactly-once" vs engineering reality.',
  mentalModel:
    'Three layers: idempotent producer (dedupe broker writes), transactional consume-transform-produce (Kafka Streams), application idempotency (DB unique keys). Compose layers — do not assume one Kafka flag fixes payment double charge across PostgreSQL.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Mechanism', 'Scope', 'Limit'],
      rows: [
        ['Idempotent producer', 'Duplicate producer retries collapse to one broker record', 'Per producer session + PID'],
        ['Transactions (transactional.id)', 'Atomic multi-partition produce + consumer offset commit', 'Same cluster; timeout; performance cost'],
        ['read_committed isolation', 'Consumers skip aborted txn messages', 'Only sees committed txn data'],
        ['App idempotency', 'DB dedup keys', 'True end-to-end with external systems'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Transactional consume-process-produce',
      diagram: `sequenceDiagram
  participant C as Consumer txn
  participant K as Kafka
  participant P as Producer txn
  C->>K: beginTransaction
  C->>K: poll records
  C->>C: process
  C->>P: send output records
  C->>K: sendOffsetsToTransaction + commitTransaction`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Payment service: prefer idempotency_key UNIQUE in DB + at-least-once consumer over Kafka EOS alone — external card gateway not in Kafka txn. Use transactions when Kafka Streams joins two topics without external side effects.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Producer idempotence: sequence numbers per partition',
        'Transaction coordinator marks control batches commit/abort',
        'transaction.timeout.ms — abort if not committed',
        'EOS in Flink/Streams vs hand-rolled consumer complexity',
        'Zombie fencing via transactional.id per instance',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['No duplicate records within Kafka pipeline', 'Cleaner stream processing joins'],
    disadvantages: ['Performance overhead', 'Not cross-database', 'Operational complexity fencing zombies'],
    alternatives: ['At-least-once + idempotent consumers (most common)', 'At-most-once telemetry'],
    whenToUse: ['Kafka Streams processing', 'Internal topic to topic transforms'],
    whenNotToUse: ['Side effect to PostgreSQL without idempotency keys'],
  },
  failureModes: [
    'Believing EOS covers DB write + Kafka publish',
    'Transactional producer without unique transactional.id — zombie duplicates',
    'Long processing exceeds transaction timeout',
    'Mixing transactional and non-transactional producers to same topic confusing consumers',
  ],
  production: {
    reliability: ['Idempotent producer enable.idempotence=true', 'App-level dedup for external IO'],
    performance: ['Transactions add latency — benchmark'],
    observability: ['Monitor aborted transactions', 'Dup detection at business layer anyway'],
  },
  interview: {
    expectations: ['Kafka EOS components', 'Limits with external DB', 'Idempotent producer vs transactions'],
    commonQuestions: ['Exactly-once in Kafka possible?', 'End-to-end exactly-once payment?', 'read_committed?'],
    followUps: ['Outbox vs Kafka txn?', 'Zombie consumer?'],
    misconceptions: ['enable.idempotence alone gives end-to-end EOS', 'EOS free performance-wise'],
    traps: ['EOS for payment without DB idempotency'],
    strongSignals: ['Layered approach, outbox, idempotency keys, txn scope limits'],
  },
  keyTakeaways: [
    'Kafka EOS = idempotent producer + transactions within cluster pipeline.',
    'External systems need application idempotency.',
    'read_committed consumers see only committed txn messages.',
    'At-least-once + idempotent consumer is practical default.',
    'Understand transaction timeout and zombie fencing.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What idempotent producer does?', answerHint: 'Retries do not create duplicate records on broker — sequence dedup per partition.' },
    { level: 'intermediate', question: 'Kafka transaction includes what?', answerHint: 'Atomic produce to multiple partitions + consumer offset commit in same transaction.' },
    { level: 'advanced', question: 'Exactly-once payment with DB and Kafka?', answerHint: 'Kafka txn does not cover DB — use outbox or idempotency_key in DB with at-least-once consumer.' },
  ],
  flashcards: [
    { front: 'Idempotent producer', back: 'enable.idempotence — broker dedupes producer retries' },
    { front: 'Kafka transaction', back: 'Atomic multi-partition writes + offset commit' },
    { front: 'read_committed', back: 'Consumer isolation skipping aborted txn messages' },
    { front: 'End-to-end EOS', back: 'Needs app idempotency for external side effects' },
  ],
  quickRevision: ['Producer idempotence', 'Transactions in broker', 'Not DB EOS', 'Outbox + dedup', 'read_committed'],
}
