import type { TopicContent } from '@/domain/types'

export const acidContent: TopicContent = {
  whatIsIt:
    'ACID is the classic transaction property bundle: Atomicity (all or nothing), Consistency (valid state before/after), Isolation (concurrent txns don’t interfere improperly), Durability (committed survives crash).',
  whyExists:
    'Applications assume reliable storage semantics. ACID gives a precise vocabulary for what the database guarantees so engineers can reason about money, inventory, and audit trails without reimplementing recovery in app code.',
  mentalModel:
    'Atomicity = undo button on failure. Consistency = constraints + app rules hold. Isolation = each txn gets predictable visibility despite concurrency. Durability = once COMMIT returns, power loss won’t lose data (within sync settings).',
  howItWorks: [
    {
      type: 'table',
      headers: ['Property', 'Meaning', 'PostgreSQL mechanism (typical)'],
      rows: [
        ['Atomicity', 'Txn succeeds fully or not at all', 'ROLLBACK, WAL abort, single xact boundary'],
        ['Consistency', 'Invariants preserved', 'CHECK, FK, UNIQUE, triggers + app logic'],
        ['Isolation', 'Controlled concurrent visibility', 'MVCC snapshots + locks + SSI'],
        ['Durability', 'Committed data survives crash', 'WAL fsync on commit (synchronous_commit)'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Consistency is shared responsibility',
      text: 'The DB enforces declared constraints; business rules like “total debits = credits” need application logic or triggers. ACID Consistency is not “any imaginable rule automatically.”',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  A[Atomicity] --> WAL[WAL + rollback]
  C[Consistency] --> Constraints[FK CHECK UNIQUE]
  I[Isolation] --> MVCC[MVCC + locks]
  D[Durability] --> Fsync[WAL flush to disk]`,
    caption: 'ACID pillars map to concrete DB mechanisms',
  },
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'Atomicity — transfer fails mid-way',
      code: `BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
-- crash or ROLLBACK here ⇒ first update undone
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Consistency — constraint rejects invalid state',
      code: `CREATE TABLE accounts (
  id bigint PRIMARY KEY,
  balance numeric NOT NULL CHECK (balance >= 0)
);
-- UPDATE driving balance negative fails entire statement/txn`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Durability vs performance knob',
      code: `// PostgreSQL session (trade durability for speed — rare in prod)
// SET synchronous_commit = off;  // commits may lose last seconds on crash
// Default on: COMMIT waits for WAL durable write`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'WAL: changes logged before heap pages; crash recovery replays WAL to REDO committed, UNDO aborted.',
        'Isolation levels tune which anomalies are possible (dirty, non-repeatable, phantom, serialization).',
        'Foreign keys enforce referential consistency at commit time of statement/txn.',
        'Durability scope: single primary in sync replication; async replicas may lag (eventual durability on standby).',
        'BASE (Basically Available, Soft state, Eventual consistency) is the NoSQL trade-off opposite for scale.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Predictable correctness for OLTP',
      'Standard recovery after failure',
      'Clear contract for application design',
    ],
    disadvantages: [
      'Strong ACID on one node limits horizontal write scaling',
      'Strict isolation reduces throughput',
      'Full durability (fsync) adds latency',
    ],
    alternatives: [
      'Eventual consistency + idempotency (CQRS, Dynamo-style)',
      'Saga orchestration across services',
      'Relaxed durability settings for non-critical data',
    ],
    whenToUse: [
      'Financial ledger, inventory, bookings',
      'Any invariant that must not be partially applied',
    ],
    whenNotToUse: [
      'Analytics aggregates tolerating stale reads',
      'Globally distributed writes needing multi-master without conflict resolution',
    ],
  },
  failureModes: [
    'Assuming ACID across microservice DBs without distributed txn design.',
    'Disabling synchronous_commit for “speed” on payment data.',
    'Relying only on app checks without DB constraints — race windows remain.',
    'Confusing isolation with serializability of entire system.',
    'Replication lag mistaken for durability on read replicas.',
  ],
  production: {
    performance: ['Tune synchronous_commit and group commit carefully — know data loss window'],
    scalability: ['Shard by aggregate; avoid cross-shard ACID without careful design'],
    reliability: ['PITR backups rely on WAL durability chain'],
    observability: ['Monitor replication lag and constraint violation rates'],
  },
  interview: {
    expectations: [
      'Define each ACID letter with example',
      'Map to PostgreSQL WAL, MVCC, constraints',
      'Contrast ACID vs BASE / eventual consistency',
    ],
    commonQuestions: [
      'Explain ACID properties.',
      'Who enforces Consistency?',
      'ACID vs BASE?',
      'Does COMMIT guarantee data on disk?',
    ],
    followUps: [
      'What if primary dies after commit on async replica?',
      'How does isolation relate to ACID I?',
    ],
    misconceptions: [
      'Consistency means any business rule magically holds',
      'ACID applies to entire distributed system by default',
      'Durability means zero data loss in all disaster scenarios',
    ],
    traps: ['Claiming NoSQL never has transactions (many offer tunable ACID)'],
    strongSignals: [
      'Links Atomicity to WAL rollback',
      'Mentions constraints + app for Consistency',
      'Notes synchronous_commit and replication caveats',
    ],
  },
  keyTakeaways: [
    'A: all-or-nothing; C: valid state (constraints + logic); I: isolation level; D: WAL survives crash.',
    'PostgreSQL: WAL, MVCC, FK/CHECK, fsync on commit.',
    'Consistency is not only the database’s job.',
    'ACID trades scale for correctness — BASE/eventual for other cases.',
    'Replication ≠ same durability on all nodes.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does Atomicity guarantee?',
      answerHint: 'Transaction completes entirely or rolls back with no partial effect.',
    },
    {
      level: 'intermediate',
      question: 'How does PostgreSQL provide Durability?',
      answerHint: 'WAL written and fsynced (with synchronous_commit) before commit success.',
    },
    {
      level: 'advanced',
      question: 'ACID vs BASE — when choose which?',
      answerHint: 'ACID for strong invariants/OLTP; BASE for availability/partition tolerance at scale with app reconciliation.',
    },
  ],
  flashcards: [
    { front: 'ACID A', back: 'Atomicity — all or nothing' },
    { front: 'ACID D mechanism', back: 'WAL persisted on COMMIT (fsync)' },
    { front: 'Consistency in ACID', back: 'DB constraints + application invariants' },
  ],
  quickRevision: [
    'A: rollback/WAL',
    'C: FK, CHECK, triggers, app',
    'I: isolation levels, MVCC',
    'D: WAL fsync',
    'Not automatic across services',
    'BASE vs ACID trade-off',
    'sync_commit matters',
  ],
}

export const content = acidContent
