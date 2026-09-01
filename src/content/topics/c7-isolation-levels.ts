import type { TopicContent } from '@/domain/types'

export const isolationLevelsContent: TopicContent = {
  whatIsIt:
    'Transaction isolation levels define which concurrent effects (dirty reads, non-repeatable reads, phantoms) a session is allowed to observe. In PostgreSQL they are implemented primarily via MVCC (Multi-Version Concurrency Control), not via heavy shared locks for ordinary reads.',
  whyExists:
    'Databases must trade consistency for concurrency. Full serial execution is correct but slow. Isolation levels let applications choose how much anomaly risk they accept in exchange for throughput — critical for inventory, payments, and ticket booking.',
  mentalModel:
    'Each transaction sees a snapshot of committed data as of some moment. Writers create new row versions; readers never block writers for ordinary SELECT. Isolation level controls whether your snapshot can change mid-transaction and whether you must wait for locks on writes.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'PostgreSQL supports Read Committed (default), Repeatable Read, and Serializable. Read Uncommitted is treated like Read Committed — dirty reads do not occur.',
    },
    {
      type: 'table',
      headers: ['Level', 'Dirty read', 'Non-repeatable read', 'Phantom', 'PostgreSQL notes'],
      rows: [
        ['Read Committed', 'No', 'Possible', 'Possible', 'Default; each statement sees latest committed rows'],
        ['Repeatable Read', 'No', 'No', 'No*', 'Snapshot for whole txn; *phantoms blocked via snapshot; serialization anomalies still possible'],
        ['Serializable', 'No', 'No', 'No', 'SSI — aborts txns that would violate serial order'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'SQL standard vs PostgreSQL',
      text: 'In the SQL standard, Repeatable Read still allows phantoms. PostgreSQL’s Repeatable Read prevents phantoms via snapshots, but write skew and other serialization anomalies can remain — use Serializable (or explicit locking) when true serial order matters.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  subgraph mvcc [MVCC]
    Heap[Heap tuple versions]
    Xmin[xmin / xmax]
    Snap[Snapshot xmin/xmax]
  end
  Reader[SELECT] --> Snap
  Snap --> Heap
  Writer[UPDATE] --> NewVer[New tuple version]
  NewVer --> Heap
  SSI[Serializable SSI] -.->|detect rw conflicts| Abort[40001 serialization_failure]`,
    caption: 'Readers use snapshots; Serializable may abort',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Lost update under Read Committed: T1 and T2 both read seats_left=1, both decide to book, both UPDATE to 0 — oversell. Fix with row lock (SELECT … FOR UPDATE), atomic UPDATE … WHERE seats_left > 0, or Serializable with retry.',
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Atomic conditional update (preferred for inventory)',
      code: `BEGIN;
UPDATE seats
SET seats_left = seats_left - 1
WHERE event_id = $1 AND seats_left > 0
RETURNING id;
-- 0 rows ⇒ sold out
COMMIT;`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Explicit lock when business logic spans multiple reads',
      code: `BEGIN;
SELECT seats_left FROM seats WHERE event_id = $1 FOR UPDATE;
-- application checks, then
UPDATE seats SET seats_left = seats_left - 1 WHERE event_id = $1;
COMMIT;`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Every row version carries xmin (creating txn) and xmax (deleting/updating txn).',
        'A snapshot decides which versions are visible: committed before snapshot, not deleted, etc.',
        'Read Committed takes a new snapshot per statement; Repeatable Read / Serializable take one at first query.',
        'Serializable Snapshot Isolation (SSI) tracks read-write dependencies and aborts with SQLSTATE 40001 when a cycle would occur.',
        'VACUUM / HOT updates reclaim dead versions; long transactions delay cleanup (bloat risk).',
      ],
    },
  ],
  implementation: [
    {
      language: 'sql',
      caption: 'Set isolation for a transaction',
      code: `BEGIN ISOLATION LEVEL REPEATABLE READ;
-- queries
COMMIT;`,
    },
    {
      language: 'java',
      caption: 'Spring / JDBC (conceptual)',
      code: `@Transactional(isolation = Isolation.REPEATABLE_READ)
public void reserve(Long eventId) { /* ... */ }
// Always retry on serialization failures (SQLState 40001)`,
    },
  ],
  tradeoffs: {
    advantages: [
      'MVCC: readers do not block writers for normal SELECTs',
      'Tune consistency per use case',
      'Serializable gives true serializability with retries',
    ],
    disadvantages: [
      'Higher isolation ⇒ more aborts / retries or more locking',
      'Long transactions hold snapshots → bloat and conflict risk',
      'App must handle 40001 retries correctly (idempotent operations)',
    ],
    alternatives: [
      'SELECT FOR UPDATE / FOR SHARE',
      'Advisory locks',
      'Optimistic locking (version column)',
      'Application-level idempotency keys',
    ],
    whenToUse: [
      'Read Committed: most web request/response OLTP',
      'Repeatable Read: stable read set for reports inside one txn',
      'Serializable: multi-row invariants (no write skew)',
    ],
    whenNotToUse: [
      'Serializable for every tiny read-only query (unnecessary abort risk)',
      'Leaving default isolation while implementing multi-step inventory logic without locks/constraints',
    ],
  },
  failureModes: [
    'Lost updates / overselling under Read Committed without conditional UPDATE or locks.',
    'Write skew: two txns each uphold a constraint based on a read the other is changing (classic on-call doctors example).',
    'Retry loops without backoff or idempotency → duplicate side effects (charges, emails).',
    'Idle-in-transaction sessions freeze snapshots and inflate tables.',
  ],
  production: {
    performance: [
      'Prefer short transactions',
      'Conditional UPDATE often beats Serializable for simple counters',
    ],
    scalability: [
      'Hot rows (same event_id) serialize on row locks — shard inventory or hold seats with TTL',
    ],
    reliability: [
      'Catch serialization_failure and deadlock_detected; retry finite times',
    ],
    security: ['Authorization checks must be inside the same transactional boundary as the write'],
    observability: [
      'Log SQLSTATE on abort',
      'Monitor deadlocks, serialization failures, and n_dead_tup growth',
    ],
    maintainability: ['Document isolation + locking strategy per aggregate'],
    cost: ['Table bloat from long txns increases storage and I/O'],
  },
  interview: {
    expectations: [
      'Name anomalies and how PostgreSQL maps levels',
      'Explain MVCC visibility without claiming “no locks ever” (writes still lock)',
      'Design a booking flow that cannot oversell',
    ],
    commonQuestions: [
      'Difference between Repeatable Read in standard SQL vs PostgreSQL?',
      'How does Serializable work in PostgreSQL?',
      'How would you prevent double booking?',
    ],
    followUps: [
      'What happens under replication lag?',
      'Optimistic vs pessimistic locking trade-offs?',
    ],
    misconceptions: [
      'Read Uncommitted enables dirty reads in PostgreSQL (it does not)',
      'Repeatable Read is fully serializable in PostgreSQL (SSI still needed for some anomalies)',
    ],
    traps: ['Proposing only “use Serializable” without a retry story'],
    strongSignals: [
      'Mentions SQLSTATE 40001',
      'Prefers constraints + atomic UPDATE for inventory',
      'Connects to capstone flash-sale booking',
    ],
  },
  keyTakeaways: [
    'PostgreSQL default = Read Committed; no dirty reads.',
    'MVCC snapshots power reads; writers create versions.',
    'RR ≈ snapshot isolation; Serializable = SSI + aborts.',
    'Prevent oversell with atomic UPDATE or locks + retries.',
    'Long transactions are an operational hazard.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What anomalies do isolation levels address?',
      answerHint: 'Dirty, non-repeatable, phantom (+ serialization anomalies).',
    },
    {
      level: 'intermediate',
      question: 'How does Read Committed differ from Repeatable Read in PostgreSQL?',
      answerHint: 'Per-statement vs per-transaction snapshot.',
    },
    {
      level: 'advanced',
      question: 'Describe write skew and how Serializable or constraints fix it.',
      answerHint: 'Two txns each OK alone, together violate invariant; SSI aborts or use locks/constraints.',
    },
  ],
  flashcards: [
    {
      front: 'PostgreSQL default isolation',
      back: 'Read Committed',
    },
    {
      front: 'Serializable failure SQLSTATE',
      back: '40001 serialization_failure — retry the transaction',
    },
    {
      front: 'Oversell-safe pattern',
      back: 'UPDATE … WHERE seats_left > 0 RETURNING, or SELECT FOR UPDATE',
    },
  ],
  quickRevision: [
    'Default: Read Committed (statement snapshot)',
    'No dirty reads in PostgreSQL',
    'RR: transaction snapshot; still not full serializable',
    'Serializable: SSI, may abort 40001',
    'Inventory: atomic conditional UPDATE or FOR UPDATE',
    'Always design retries as idempotent',
    'Short txns; avoid idle-in-transaction',
  ],
}

/** Phase 4 registry export */
export const content = isolationLevelsContent
