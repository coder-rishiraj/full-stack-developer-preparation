import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Consistency in system design interviews means choosing how synchronized reads and writes are across replicas, caches, and services — strong, eventual, causal, read-your-writes — and articulating tradeoffs for the specific feature (feed vs payment) not generic CAP lectures.',
  whyExists:
    'Wrong consistency choice causes duplicate charges, stale feeds, or over-built expensive sync replication. Interviewers want feature-level reasoning: "likes can be eventual; ledger must be strong" with concrete mechanisms (quorum, versioning, idempotency).',
  mentalModel:
    'Newspaper editions vs wire transfer. Feed can show yesterday sports scores briefly (eventual). Bank balance must be exact now (strong/linearizable). Pick per operation, not one label for whole system.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Level', 'Guarantee', 'Typical use in interview'],
      rows: [
        ['Strong/linearizable', 'Read sees latest write', 'Inventory, payments, leader election'],
        ['Sequential', 'Total order of ops visible', 'Distributed log, Kafka partition'],
        ['Causal', 'Related ops ordered', 'Comments thread, messaging'],
        ['Eventual', 'Converges if no new writes', 'Social counts, search index'],
        ['Read-your-writes', 'User sees own update', 'Profile edit — session sticky or write to primary'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Per-feature consistency map',
      diagram: `flowchart TB
  Pay[Payment] --> Strong[Strong DB transaction]
  Feed[Feed timeline] --> Eventual[Async fan-out eventual]
  Profile[Profile edit] --> RYW[Read-your-writes primary read]`,
    },
    {
      type: 'list',
      items: [
        'State CAP only when partition scenario asked — otherwise feature-specific',
        'Cache: TTL + invalidation defines staleness budget',
        'Cross-region: async replication → eventual unless sync CRDB/Spanner',
        'Idempotency + outbox for at-least-once delivery consistency',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Ticket booking: seat hold strong consistency on shard with row lock or optimistic versioning. Order confirmation read-your-writes from primary. Event feed of "sold out" eventual 1–2s OK. Search index of events eventual via CDC queue.',
    },
  ],
  tradeoffs: {
    advantages: ['Right cost/latency per feature', 'Avoids over-engineering global strong'],
    disadvantages: ['Mixed models increase cognitive load', 'Bugs at consistency boundaries'],
    alternatives: ['Global strong — simple semantics, hard scale'],
    whenToUse: ['Any multi-replica/cache design', 'Interview deep dive section'],
    whenNotToUse: ['Single-node prototype — trivially strong'],
  },
  failureModes: [
    'Eventual for inventory — oversell',
    'Cache stale price checkout',
    'Read replica lag breaks read-your-wwrites on profile',
    'No version field on optimistic concurrency',
    'CAP buzzword without feature mapping',
  ],
  production: {
    reliability: ['Quorum writes where strong needed', 'Version columns for optimistic locking'],
    scalability: ['Eventual replicas for read scale', 'CQRS separate read models'],
    observability: ['Replica lag metrics', 'Stale read detection'],
  },
  interview: {
    expectations: ['Per-feature consistency table', 'Read-your-writes technique', 'Not one-size CAP speech'],
    commonQuestions: ['Consistency for news feed vs payment?', 'Cache staleness OK?'],
    followUps: ['Cross-region consistency?', 'Fix oversell?'],
    misconceptions: ['Must pick CP or AP for entire system', 'Eventual means broken'],
    traps: ['Eventual inventory on flash sale'],
    strongSignals: ['Feature matrix', 'Primary read after write', 'Version/lock on hot row'],
  },
  keyTakeaways: [
    'Choose consistency per feature/operation not globally.',
    'Payments/inventory → strong; feeds/counts → eventual often OK.',
    'Read-your-writes: sticky session or read primary after write.',
    'Cache TTL is a consistency/staleness decision.',
    'Idempotency handles at-least-once delivery semantics.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Eventual consistency meaning?', answerHint: 'Replicas converge over time if writes stop; reads may be stale temporarily.' },
    { level: 'intermediate', question: 'Read-your-writes without strong global?', answerHint: 'Route user reads to primary after write, session affinity, or version token in cookie.' },
    { level: 'advanced', question: 'Cross-region social like count?', answerHint: 'Eventual CRDT or periodic merge acceptable; show approximate count; strong not worth latency.' },
  ],
  flashcards: [
    { front: 'Read-your-writes', back: 'User always sees their own latest update' },
    { front: 'Linearizable', back: 'Strongest — reads reflect latest completed write globally' },
    { front: 'Eventual consistency', back: 'Replicas converge without new writes' },
    { front: 'Optimistic concurrency', back: 'Version check on update — fail if stale' },
  ],
  quickRevision: [
    'Per-feature pick',
    'Pay strong',
    'Feed eventual',
    'RYW profile',
    'Cache = staleness',
  ],
}
