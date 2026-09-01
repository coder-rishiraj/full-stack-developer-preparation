import type { TopicContent } from '@/domain/types'

export const locksContent: TopicContent = {
  whatIsIt:
    'PostgreSQL locks coordinate concurrent access to rows, pages, tables, and metadata — complementing MVCC so writers serialize conflicting changes and DDL maintains structural integrity.',
  whyExists:
    'MVCC alone does not prevent lost updates or enforce cross-row invariants. Locks block or queue incompatible operations: two UPDATEs on same row, TRUNCATE vs SELECT, schema migration vs queries.',
  mentalModel:
    'Readers use snapshots (MVCC); writers take row-level exclusive locks on UPDATE/DELETE. DDL takes stronger table locks. lock_modes form a matrix — some combinations block, others proceed. pg_locks shows who waits on whom.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Lock mode', 'Typical operation', 'Blocks'],
      rows: [
        ['ACCESS SHARE', 'SELECT', 'ACCESS EXCLUSIVE only'],
        ['ROW EXCLUSIVE', 'INSERT/UPDATE/DELETE', 'SHARE, SHARE ROW EXCLUSIVE, EXCLUSIVE, ACCESS EXCLUSIVE'],
        ['SHARE', 'CREATE INDEX (non-concurrent)', 'ROW EXCLUSIVE and above'],
        ['ACCESS EXCLUSIVE', 'DROP TABLE, ALTER, VACUUM FULL', 'Almost everything'],
        ['FOR UPDATE / FOR NO KEY UPDATE', 'SELECT ... FOR UPDATE', 'Other row locks on same rows'],
      ],
    },
    {
      type: 'list',
      items: [
        'Row locks: automatic on UPDATE/DELETE target rows; explicit via SELECT FOR UPDATE.',
        'Predicate locks (Serializable): phantom prevention via SSI.',
        'Advisory locks: application-defined bigint keys — mutex across sessions.',
        'lock_timeout / deadlock_timeout session settings cap wait behavior.',
        'pg_cancel_backend vs pg_terminate_backend for stuck waiters.',
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  TxnA[Txn A UPDATE row] --> RowLock[Row Exclusive Lock]
  TxnB[Txn B UPDATE same row] --> Wait[Wait queue]
  RowLock --> Wait
  MVCC[MVCC snapshot read] -->|no row lock| SelectB[Txn C SELECT]
  DDL[ALTER TABLE] --> AccessEx[ACCESS EXCLUSIVE]
  AccessEx --> BlockAll[Blocks all table access]`,
    caption: 'MVCC for reads; locks for conflicting writes and DDL',
  },
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'Explicit row locking',
      code: `BEGIN;
SELECT id, balance FROM accounts WHERE id = 42 FOR UPDATE;
-- other txns block on UPDATE/DELETE/ FOR UPDATE this row
UPDATE accounts SET balance = balance - 100 WHERE id = 42;
COMMIT;

-- Skip locked rows (PG 9.5+)
SELECT * FROM jobs
WHERE status = 'pending'
ORDER BY created_at
FOR UPDATE SKIP LOCKED
LIMIT 1;`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Advisory lock — app-level mutex',
      code: `SELECT pg_advisory_lock(12345); -- blocks until acquired
-- critical section: e.g. idempotent job processing
SELECT pg_advisory_unlock(12345);

-- try lock, no wait
SELECT pg_try_advisory_lock(12345);`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Inspect locks',
      code: `SELECT blocked.pid AS blocked_pid,
       blocking.pid AS blocking_pid,
       blocked.query AS blocked_query
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked ON blocked.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks
  ON blocking_locks.locktype = blocked_locks.locktype
  AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database
  AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
  AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
  AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
  AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
  AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
  AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
  AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
  AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
  AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking ON blocking.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Heavyweight locks in shared memory lock manager; lightweight locks for buffers.',
        'Row locks stored in tuple headers or multixact for shared row locks.',
        'Deadlock detector runs when lock wait exceeds deadlock_timeout.',
        'CREATE INDEX CONCURRENTLY uses weaker locks in phases vs blocking SHARE lock.',
        'Foreign key checks may take SHARE ROW EXCLUSIVE on referenced table.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Serializable updates on hot rows',
      'FOR UPDATE SKIP LOCKED for work queues',
      'Advisory locks for cross-table app coordination',
    ],
    disadvantages: [
      'Lock waits → latency spikes and connection pool exhaustion',
      'Long transactions hold locks → blocks others',
      'ACCESS EXCLUSIVE DDL downtime if not CONCURRENTLY',
    ],
    alternatives: [
      'Optimistic locking (@Version) — retry on conflict',
      'Serializable isolation + SSI instead of explicit FOR UPDATE',
      'Queue table with SKIP LOCKED instead of advisory locks',
    ],
    whenToUse: [
      'Read-modify-write on same row in app logic',
      'Job queue claiming with SKIP LOCKED',
      'Preventing double-spend / inventory oversell',
    ],
    whenNotToUse: [
      'Long-held locks across HTTP requests',
      'Whole-table lock when row lock suffices',
      'Advisory locks without unlock on crash (session end releases)',
    ],
  },
  failureModes: [
    'Idle in transaction with FOR UPDATE → blocks all updaters on those rows.',
    'Migration without CONCURRENTLY → ACCESS EXCLUSIVE production outage.',
    'Lock ordering inconsistency → deadlocks (retry needed).',
    'Assuming MVCC means no blocking on UPDATE — writers block writers.',
    'pg_advisory_lock forgotten unlock → held until disconnect.',
  ],
  production: {
    performance: ['Set lock_timeout on migrations and batch jobs'],
    reliability: ['Retry deadlocks with exponential backoff in app'],
    observability: [
      'pg_stat_activity.wait_event_type = Lock',
      'blocked_pid queries; log lock waits > threshold',
    ],
  },
  interview: {
    expectations: [
      'MVCC vs locks division of labor',
      'SELECT FOR UPDATE use case',
      'Table lock levels for DDL impact',
    ],
    commonQuestions: [
      'Do SELECTs block UPDATEs in PostgreSQL?',
      'What is SELECT FOR UPDATE SKIP LOCKED?',
      'Difference row lock vs table lock?',
    ],
    followUps: ['Advisory locks vs row locks', 'How find blocking query?'],
    misconceptions: [
      'MVCC eliminates all locking',
      'FOR UPDATE locks entire table',
      'Deadlocks only happen with DDL',
    ],
    traps: ['Holding FOR UPDATE across network call to user'],
    strongSignals: [
      'SKIP LOCKED queue pattern',
      'pg_locks blocked query join',
      'CREATE INDEX CONCURRENTLY lock story',
    ],
  },
  keyTakeaways: [
    'MVCC for snapshot reads; locks for write/write and DDL conflicts.',
    'UPDATE/DELETE take row exclusive locks automatically.',
    'FOR UPDATE explicit row lock; SKIP LOCKED for worker queues.',
    'DDL ACCESS EXCLUSIVE is most disruptive — use CONCURRENTLY variants.',
    'Monitor lock waits; keep transactions short.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why locks if PostgreSQL has MVCC?',
      answerHint: 'MVCC avoids read/write blocking on SELECT; locks serialize conflicting writes and DDL.',
    },
    {
      level: 'intermediate',
      question: 'Use case for FOR UPDATE SKIP LOCKED?',
      answerHint: 'Work queue: workers claim next available row without blocking each other.',
    },
    {
      level: 'advanced',
      question: 'What lock does CREATE INDEX take vs CREATE INDEX CONCURRENTLY?',
      answerHint: 'Non-concurrent SHARE blocks writes; CONCURRENTLY multi-phase weaker locks, longer build.',
    },
  ],
  flashcards: [
    { front: 'SELECT blocks UPDATE?', back: 'No (MVCC); UPDATE blocks UPDATE on same row' },
    { front: 'FOR UPDATE SKIP LOCKED', back: 'Claim row or skip if locked — job queues' },
    { front: 'ACCESS EXCLUSIVE', back: 'Strongest table lock — DDL like DROP/ALTER' },
  ],
  quickRevision: [
    'MVCC reads; locks writes/DDL',
    'Row EXCLUSIVE on DML',
    'FOR UPDATE explicit lock',
    'SKIP LOCKED queues',
    'Advisory app mutex',
    'lock_timeout / deadlocks',
    'pg_locks blocked query',
  ],
}

export const content = locksContent
