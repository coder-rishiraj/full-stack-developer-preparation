import type { TopicContent } from '@/domain/types'

export const transactionsContent: TopicContent = {
  whatIsIt:
    'A database transaction is a unit of work treated atomically: either all statements commit together or none do (ROLLBACK). It groups reads and writes under ACID guarantees and a chosen isolation level.',
  whyExists:
    'Business operations span multiple rows and tables — transfer money, place order + decrement inventory. Without transactions, partial failure corrupts invariants. Transactions let the DB enforce “all or nothing” and consistent views.',
  mentalModel:
    'BEGIN opens a scope; statements see a consistent snapshot or latest committed data per isolation level; COMMIT makes changes durable and visible; ROLLBACK or abort discards uncommitted work. Keep transactions short.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'BEGIN (or implicit single-statement txn in autocommit mode).',
        'Execute SQL — locks and MVCC visibility apply per isolation level.',
        'On success: COMMIT — WAL flush, release locks, visible to others.',
        'On error or explicit ROLLBACK: undo uncommitted changes in this txn.',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'PostgreSQL autocommit',
      text: 'Each statement is its own transaction unless wrapped in BEGIN…COMMIT. ORMs (@Transactional) typically open/close boundaries for you.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  App[Application] --> Begin[BEGIN]
  Begin --> SQL[SQL statements]
  SQL -->|success| Commit[COMMIT]
  SQL -->|error| Rollback[ROLLBACK]
  Commit --> Durable[WAL + visible]
  Rollback --> Discard[No effect]`,
    caption: 'Explicit transaction lifecycle',
  },
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'Classic transfer — debit and credit atomic',
      code: `BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1 AND balance >= 100;
-- check ROW_COUNT = 1 or ROLLBACK
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Savepoint for partial rollback',
      code: `BEGIN;
INSERT INTO orders (id) VALUES (1);
SAVEPOINT sp1;
INSERT INTO order_lines (order_id, sku) VALUES (1, 'BAD');
-- validation fails
ROLLBACK TO SAVEPOINT sp1;
COMMIT; -- order header kept, bad line dropped`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Spring declarative transaction',
      code: `@Transactional
public void transfer(long from, long to, BigDecimal amount) {
  accountRepo.debit(from, amount);  // same txn
  accountRepo.credit(to, amount);   // rolls back together on exception
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Transaction ID (xid) assigned at start in PostgreSQL; row versions tagged xmin/xmax.',
        'Lock manager: row-level locks on UPDATE/DELETE; SELECT FOR UPDATE for explicit pessimistic read.',
        'WAL (write-ahead log) records changes before heap; COMMIT waits for WAL durability (synchronous_commit).',
        'Idle in transaction holds locks and prevents vacuum cleanup — operational anti-pattern.',
        'DDL in PostgreSQL is transactional for many objects but has caveats (some lock escalations, CONCURRENTLY ops outside txn).',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Atomic multi-statement operations',
      'Consistent failure recovery',
      'Composable with isolation levels and constraints',
    ],
    disadvantages: [
      'Long transactions block vacuum, increase bloat, raise deadlock risk',
      'Distributed transactions (2PC) are slow and fragile — avoid when possible',
      'Holding DB txn open during HTTP calls is catastrophic',
    ],
    alternatives: [
      'Saga pattern with compensating transactions (microservices)',
      'Outbox + idempotent consumers',
      'Single-statement atomic UPDATE with WHERE guards',
    ],
    whenToUse: [
      'Multi-row invariants in one database',
      'Read-modify-write that must be consistent',
    ],
    whenNotToUse: [
      'Spanning external API calls inside @Transactional',
      'Cross-service consistency without saga/outbox design',
    ],
  },
  failureModes: [
    'Forgot COMMIT — locks held until idle timeout.',
    'Exception after partial work without rollback in manual JDBC.',
    'Long @Transactional including slow external I/O — connection pool exhaustion.',
    'Nested transactions misunderstood — JDBC savepoints vs Spring PROPAGATION_REQUIRES_NEW new connection.',
    'Assuming rollback rolls back already-committed side effects (email sent).',
  ],
  production: {
    performance: ['Keep transactions seconds or less; batch writes inside one txn when safe'],
    scalability: ['Hot row updates serialize — design for partition or queue'],
    reliability: ['Retry deadlocks and serialization failures with backoff'],
    observability: [
      'Monitor idle_in_transaction_session_timeout',
      'Track txn duration and lock waits',
    ],
    maintainability: ['One service method = one transactional boundary; document isolation'],
  },
  interview: {
    expectations: [
      'Explain BEGIN/COMMIT/ROLLBACK and atomicity',
      'Contrast autocommit vs explicit transactions',
      'Warn against long transactions and external calls inside txn',
    ],
    commonQuestions: [
      'What happens on COMMIT vs ROLLBACK?',
      'How does @Transactional work (proxy, rollback rules)?',
      'Can you call external HTTP inside a transaction?',
    ],
    followUps: [
      'Savepoints vs nested transactions?',
      'How to handle distributed transactions?',
    ],
    misconceptions: [
      'Every SELECT needs a transaction wrapper for correctness',
      'Rollback undoes side effects outside DB',
      'Read-only transactions never take locks (they can for FOR UPDATE)',
    ],
    traps: ['Proposing 2PC across microservices without mentioning sagas'],
    strongSignals: [
      'Mentions short transactions and idle-in-transaction hazard',
      'Uses conditional UPDATE for atomic checks',
      'Knows Spring rolls back on unchecked exceptions by default',
    ],
  },
  keyTakeaways: [
    'Transaction = all-or-nothing unit of work.',
    'BEGIN…COMMIT/ROLLBACK; autocommit per statement by default.',
    'Keep txns short; no external I/O inside.',
    'WAL makes commits durable; MVCC + locks enforce isolation.',
    'Use sagas/outbox for cross-service consistency.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does COMMIT do?',
      answerHint: 'Makes txn changes durable and visible; releases locks.',
    },
    {
      level: 'intermediate',
      question: 'Why avoid long-running transactions?',
      answerHint: 'Lock contention, bloat, vacuum blocked, pool exhaustion.',
    },
    {
      level: 'advanced',
      question: 'Spring @Transactional rollback behavior?',
      answerHint: 'Default rollback on RuntimeException/Error; checked exceptions commit unless rollbackFor.',
    },
  ],
  flashcards: [
    { front: 'Transaction atomicity', back: 'All statements commit or none (ROLLBACK)' },
    { front: 'PostgreSQL autocommit', back: 'Each statement is own txn unless BEGIN' },
    { front: 'Anti-pattern', back: 'External HTTP inside open DB transaction' },
  ],
  quickRevision: [
    'BEGIN → SQL → COMMIT or ROLLBACK',
    'Short transactions only',
    'WAL on commit',
    'Savepoints for partial undo',
    '@Transactional = one boundary',
    'No external I/O in txn',
    'Saga for cross-service',
  ],
}

export const content = transactionsContent
