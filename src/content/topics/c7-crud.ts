import type { TopicContent } from '@/domain/types'

export const crudContent: TopicContent = {
  whatIsIt:
    'CRUD in SQL is the four fundamental DML operations: SELECT (read rows), INSERT (create), UPDATE (modify), DELETE (remove) — filtered by WHERE, constrained by keys and CHECK, returning rows via RETURNING in PostgreSQL.',
  whyExists:
    'Applications persist and query state relationally. CRUD maps directly to user actions and REST verbs. Correct use of primary keys, transactions, and RETURNING avoids race conditions and unnecessary round trips.',
  mentalModel:
    'Tables are sets of rows. SELECT projects/filter/joins subsets. INSERT adds rows obeying constraints. UPDATE replaces column values for matching rows. DELETE removes rows. Always scope mutations with WHERE — bare UPDATE/DELETE affects entire table.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'SELECT columns FROM table WHERE predicate ORDER BY limit;',
        'INSERT INTO table (cols) VALUES (...); or INSERT…SELECT.',
        'UPDATE table SET col = val WHERE id = ?;',
        'DELETE FROM table WHERE condition;',
        'PostgreSQL RETURNING * returns inserted/updated/deleted rows in one statement.',
      ],
    },
    {
      type: 'table',
      headers: ['Operation', 'REST-ish', 'Idempotent?'],
      rows: [
        ['SELECT', 'GET', 'Yes (read)'],
        ['INSERT', 'POST', 'No without unique key'],
        ['UPDATE', 'PUT/PATCH', 'Yes if same final state'],
        ['DELETE', 'DELETE', 'Yes (second delete 0 rows)'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  App[Application] --> SELECT[SELECT read]
  App --> INSERT[INSERT create]
  App --> UPDATE[UPDATE modify]
  App --> DELETE[DELETE remove]
  INSERT --> PG[(PostgreSQL)]
  UPDATE --> PG
  DELETE --> PG
  SELECT --> PG`,
    caption: 'DML operations against heap tables via planner/executor',
  },
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'SELECT with filter and pagination',
      code: `SELECT id, email, created_at
FROM users
WHERE status = 'active'
  AND created_at >= '2026-01-01'
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'INSERT with RETURNING',
      code: `INSERT INTO users (email, password_hash, status)
VALUES ('user@example.com', 'hash', 'active')
RETURNING id, email, created_at;`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Conditional UPDATE and safe DELETE',
      code: `UPDATE accounts
SET balance = balance - 100
WHERE id = 1 AND balance >= 100;
-- check ROW_COUNT = 1

DELETE FROM sessions
WHERE expires_at < NOW();`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Spring Data JPA CRUD',
      code: `public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);
}

// service
userRepository.save(user);           // INSERT or UPDATE
userRepository.findById(id);           // SELECT
userRepository.deleteById(id);         // DELETE`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Heap storage: INSERT creates new row version; UPDATE marks old dead, inserts new tuple (MVCC).',
        'DELETE sets xmax — row invisible to new snapshots until VACUUM.',
        'Sequential scan vs index scan on WHERE — depends on selectivity and indexes.',
        'Foreign keys: DELETE/UPDATE on parent RESTRICT/CASCADE per FK definition.',
        'Triggers fire BEFORE/AFINSTEAD OF row-level on DML.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Declarative set-oriented operations',
      'RETURNING reduces round trips',
      'Constraints enforce invariants at DB',
    ],
    disadvantages: [
      'ORM may generate inefficient N+1 SELECTs',
      'Bulk UPDATE without index — full table scan',
    ],
    alternatives: [
      'Upsert ON CONFLICT for idempotent insert',
      'Soft delete (UPDATE status) vs hard DELETE',
    ],
    whenToUse: [
      'Standard persistence in OLTP',
      'Batch DELETE of expired rows with indexed column',
    ],
    whenNotToUse: [
      'Bulk ETL — COPY or staging tables',
      'DELETE without WHERE in production scripts',
    ],
  },
  failureModes: [
    'UPDATE/DELETE without WHERE — catastrophic full-table mutation.',
    'Unique violation on INSERT — duplicate key.',
    'Foreign key violation on DELETE parent with children.',
    'Lost update without transaction or optimistic locking.',
    'SELECT * in hot paths — unnecessary I/O and coupling.',
  ],
  production: {
    performance: ['Index WHERE/JOIN columns; avoid SELECT *; use LIMIT'],
    reliability: ['Wrap related DML in transactions; use RETURNING for IDs'],
    maintainability: ['Explicit column lists in INSERT/UPDATE'],
  },
  interview: {
    expectations: [
      'Basic SELECT/INSERT/UPDATE/DELETE syntax',
      'WHERE importance on mutations',
      'RETURNING and ROW_COUNT checks',
    ],
    commonQuestions: [
      'Difference DELETE and TRUNCATE?',
      'INSERT vs UPSERT?',
      'How prevent updating all rows by mistake?',
    ],
    followUps: [
      'Soft delete pattern?',
      'ORM save() INSERT or UPDATE?',
    ],
    misconceptions: [
      'DELETE frees disk immediately (needs VACUUM)',
      'UPDATE always modifies in place (MVCC creates new row version)',
    ],
    traps: ['UPDATE without WHERE in interview scenario'],
    strongSignals: [
      'RETURNING clause',
      'Conditional UPDATE with balance check',
      'Transaction for multi-step CRUD',
    ],
  },
  keyTakeaways: [
    'Always WHERE on UPDATE/DELETE.',
    'RETURNING avoids extra SELECT after INSERT.',
    'Index filter columns for SELECT/UPDATE.',
    'MVCC: UPDATE/DELETE create dead tuples.',
    'Use transactions for multi-row invariants.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'INSERT and get generated id in PostgreSQL?',
      answerHint: 'RETURNING id or SERIAL/IDENTITY column in RETURNING clause.',
    },
    {
      level: 'intermediate',
      question: 'DELETE vs TRUNCATE?',
      answerHint: 'DELETE row-by-row, triggers, MVCC, can WHERE; TRUNCATE fast reset, limited triggers, locks table.',
    },
    {
      level: 'advanced',
      question: 'Prevent lost update on balance?',
      answerHint: 'Transaction + UPDATE ... WHERE balance >= amount AND id=? checking ROW_COUNT or optimistic version column.',
    },
  ],
  flashcards: [
    { front: 'Bare UPDATE risk', back: 'Updates all rows if WHERE omitted' },
    { front: 'PostgreSQL RETURNING', back: 'Returns inserted/updated/deleted rows from DML' },
    { front: 'MVCC on UPDATE', back: 'New row version; old marked dead until vacuum' },
  ],
  quickRevision: [
    'SELECT WHERE ORDER LIMIT',
    'INSERT RETURNING',
    'UPDATE SET WHERE',
    'DELETE WHERE',
    'Always WHERE on mutate',
    'Transactions multi-step',
    'Index filter columns',
  ],
}

export const content = crudContent
