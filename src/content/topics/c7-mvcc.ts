import type { TopicContent } from '@/domain/types'

export const mvccContent: TopicContent = {
  whatIsIt:
    'Multi-Version Concurrency Control (MVCC) keeps multiple row versions so readers do not block writers and writers do not block readers for ordinary SELECT. PostgreSQL implements MVCC via heap tuple versions tagged with transaction IDs (xmin, xmax).',
  whyExists:
    'Lock-based concurrency serializes reads and writes — poor throughput for OLTP. MVCC gives each transaction a consistent snapshot of committed data while concurrent updates create new versions, trading storage and vacuum work for read/write concurrency.',
  mentalModel:
    'UPDATE does not overwrite in place — it inserts a new row version and marks the old one dead. SELECT picks visible versions per snapshot rules. Old versions linger until VACUUM reclaims space. Writers still take row locks on update/delete.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'INSERT sets xmin to creating transaction id.',
        'DELETE/UPDATE sets xmax on old version; UPDATE also inserts new version with new xmin.',
        'Snapshot taken at statement or transaction start lists visible xids.',
        'Tuple visible if xmin committed before snapshot, xmax null or aborted/future.',
        'VACUUM (and autovacuum) marks dead space reusable; FREEZE prevents xid wraparound.',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'MVCC ≠ no locks',
      text: 'SELECT FOR UPDATE, DDL, and conflicting writes still use locks. MVCC mainly avoids read/write blocking for normal reads.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  subgraph heap [Heap table]
    V1[Version 1 xmin=100 xmax=105]
    V2[Version 2 xmin=105 xmax=null]
  end
  T100[Txn 100 UPDATE] --> V1
  T100 --> V2
  Reader[Txn 110 SELECT snapshot] -->|sees| V2
  Old[Txn 105 aborted] --> V1
  Vacuum[VACUUM] --> Reclaim[Reclaim dead V1 space]`,
    caption: 'Update creates new version; vacuum reclaims dead tuples',
  },
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'Concurrent read during write — no read lock',
      code: `-- Session A
BEGIN;
UPDATE products SET price = 20 WHERE id = 1; -- not committed

-- Session B (Read Committed)
SELECT price FROM products WHERE id = 1;
-- sees old committed price until A commits`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Repeatable Read — stable snapshot',
      code: `BEGIN ISOLATION LEVEL REPEATABLE READ;
SELECT price FROM products WHERE id = 1; -- 15
-- another session commits price = 20
SELECT price FROM products WHERE id = 1; -- still 15 in this txn
COMMIT;`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Visibility intuition (simplified)',
      code: `-- Tuple visible when:
-- xmin committed and xmin < snapshot.xmax
-- AND (xmax is null OR xmax not committed in snapshot OR xmax txn aborted)`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'clog (commit log) / pg_xact status tracks transaction commit state.',
        'Hint bits on tuples cache commit knowledge to avoid repeated clog lookups.',
        'HOT (Heap-Only Tuple): update without indexed column change on same page — avoids new index entries.',
        'Snapshot exports: pg_export_snapshot() for logical replication consistent reads.',
        'Xid wraparound: freeze old tuples to mark committed forever; autovacuum anti-wraparound critical.',
        'Long-running transactions hold back xmin horizon — blocks vacuum, causes bloat.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Readers rarely block writers; high read concurrency',
      'Snapshot isolation for consistent reads',
      'Foundation for PostgreSQL isolation levels',
    ],
    disadvantages: [
      'Dead tuple bloat until vacuum',
      'UPDATE-heavy tables grow faster; index churn',
      'Serialization anomalies need SSI or explicit locks beyond RR',
    ],
    alternatives: [
      'Two-phase locking databases (readers block writers)',
      'Optimistic concurrency (version column in app)',
      'Append-only / event sourcing with async compaction',
    ],
    whenToUse: [
      'Default for PostgreSQL OLTP — rely on MVCC + proper isolation',
      'Read-heavy workloads with concurrent writes',
    ],
    whenNotToUse: [
      'When immediate physical row reuse required without vacuum (not PostgreSQL model)',
      'Cross-row invariants without Serializable or locking',
    ],
  },
  failureModes: [
    'Long idle-in-transaction → bloat, disk fill, slower scans.',
    'Assuming MVCC prevents lost updates without locking/isolation (Read Committed allows them).',
    'Table bloat mistaken for “PostgreSQL slow” — need VACUUM/REINDEX.',
    'Xid wraparound emergency if autovacuum disabled — cluster shutdown risk.',
    'Monitoring only live rows ignores dead_tup explosion.',
  ],
  production: {
    performance: [
      'Keep transactions short; set idle_in_transaction_session_timeout',
      'Tune autovacuum for update-heavy tables',
    ],
    scalability: [
      'Partition very hot tables to localize bloat',
      'HOT-friendly schemas: avoid updating indexed columns unnecessarily',
    ],
    reliability: ['Monitor age(datfrozenxid) for wraparound risk'],
    observability: [
      'pg_stat_user_tables.n_dead_tup, last_autovacuum',
      'pg_stat_activity.xact_start for long txns',
    ],
    cost: ['Bloat increases storage and I/O until vacuumed'],
  },
  interview: {
    expectations: [
      'Explain xmin/xmax and snapshot visibility',
      'Contrast MVCC with locking readers',
      'Connect to isolation levels and vacuum bloat',
    ],
    commonQuestions: [
      'How does PostgreSQL MVCC work?',
      'What is xmin/xmax?',
      'Why do we need VACUUM?',
      'Do readers block writers in PostgreSQL?',
    ],
    followUps: [
      'What is HOT update?',
      'How does Serializable Snapshot Isolation relate to MVCC?',
    ],
    misconceptions: [
      'MVCC means no locks ever',
      'UPDATE modifies row in place',
      'VACUUM is optional maintenance luxury',
    ],
    traps: ['Explaining MVCC without mentioning write skew / lost update still possible'],
    strongSignals: [
      'Mentions dead tuples and autovacuum',
      'Long transaction bloat story',
      'Links to Read Committed vs Repeatable Read snapshots',
    ],
  },
  keyTakeaways: [
    'Updates create new versions; old ones marked dead.',
    'Snapshots decide which version each txn sees.',
    'Readers don’t block writers for normal SELECT; writers still lock rows.',
    'VACUUM reclaims dead space; long txns delay it → bloat.',
    'MVCC enables isolation levels; does not alone prevent all anomalies.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What problem does MVCC solve?',
      answerHint: 'Read/write concurrency without readers blocking writers on SELECT.',
    },
    {
      level: 'intermediate',
      question: 'What are xmin and xmax?',
      answerHint: 'Creating txn id and deleting/updating txn id on heap tuple version.',
    },
    {
      level: 'advanced',
      question: 'Why can long transactions hurt MVCC performance?',
      answerHint: 'Delay vacuum; dead tuples accumulate → bloat and slower scans.',
    },
  ],
  flashcards: [
    { front: 'PostgreSQL UPDATE', back: 'New row version; old marked dead (xmax)' },
    { front: 'VACUUM purpose', back: 'Reclaim dead tuple space; freeze xids' },
    { front: 'MVCC read blocking', back: 'Normal SELECT does not block writers' },
  ],
  quickRevision: [
    'Versions not in-place overwrite',
    'xmin create, xmax delete/update',
    'Snapshot visibility rules',
    'VACUUM / autovacuum essential',
    'Long txn = bloat',
    'HOT reduces index updates',
    'Writers still row-lock',
  ],
}

export const content = mvccContent
