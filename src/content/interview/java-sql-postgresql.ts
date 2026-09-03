import type { ReactInterviewItem } from './types'

export const JAVA_INTERVIEW_SQL_POSTGRESQL: ReactInterviewItem[] = [
  {
    id: 'sql-where-having',
    question: 'WHERE vs HAVING?',
    relatedTopicIds: ['c7-where', 'c7-having', 'c7-group-by'],
    answer: [{
      type: 'paragraph',
      text: 'WHERE filters input rows before grouping and aggregation. HAVING filters groups after GROUP BY and can refer to aggregate results. Prefer WHERE for predicates that can run earlier; moving an outer-join predicate between ON and WHERE can also change semantics, not merely performance.',
    }],
  },
  {
    id: 'sql-null-logic',
    question: 'Why does col = NULL fail, and why can NOT IN return no rows?',
    relatedTopicIds: ['c7-null-three-valued-logic', 'c7-is-null', 'c7-in-not-in'],
    answer: [{
      type: 'paragraph',
      text: 'NULL means unknown, so ordinary comparisons yield UNKNOWN rather than TRUE. Use IS NULL or IS DISTINCT FROM. If a NOT IN subquery contains NULL, the predicate can become UNKNOWN for every candidate; NOT EXISTS is usually the safer anti-join when nullability is possible.',
    }],
  },
  {
    id: 'sql-join-types',
    question: 'INNER JOIN vs LEFT JOIN, and what is the ON-vs-WHERE trap?',
    relatedTopicIds: ['c7-inner-join', 'c7-left-join', 'c7-on-vs-where'],
    answer: [{
      type: 'paragraph',
      text: 'INNER JOIN keeps matching combinations only. LEFT JOIN preserves every left row and null-extends unmatched right columns. A predicate on the right table in WHERE can remove those null-extended rows and accidentally turn the result into inner-join behavior; put match conditions in ON when preservation is intended.',
    }],
  },
  {
    id: 'sql-union',
    question: 'UNION vs UNION ALL?',
    relatedTopicIds: ['c7-union', 'c7-set-compatibility'],
    answer: [{
      type: 'paragraph',
      text: 'UNION ALL concatenates compatible results and preserves duplicates. UNION additionally removes duplicates, requiring extra sort or hash work. Use UNION ALL unless duplicate elimination is part of the required semantics.',
    }],
  },
  {
    id: 'sql-window-group',
    question: 'Window function vs GROUP BY?',
    relatedTopicIds: ['c7-window-functions', 'c7-over-partition-order', 'c7-group-by'],
    answer: [{
      type: 'paragraph',
      text: 'GROUP BY collapses input rows into one row per group. A window function computes across a partition while preserving each input row. The window ORDER BY and frame determine ranking, navigation, and running aggregates; LAST_VALUE surprises often come from the default frame.',
    }],
  },
  {
    id: 'sql-index-not-used',
    question: 'Why might PostgreSQL ignore an index?',
    relatedTopicIds: ['c7-indexes', 'c7-index-selectivity', 'c7-sargability', 'c7-explain'],
    answer: [{
      type: 'paragraph',
      text: 'A sequential scan may be cheaper when many rows qualify, the table is small, statistics predict low selectivity, a cast or function makes the predicate non-sargable, the composite prefix does not match, or heap fetches dominate. Inspect EXPLAIN ANALYZE with buffers and estimation error before forcing a plan.',
    }],
  },
  {
    id: 'sql-composite-index',
    question: 'How do you choose column order in a composite B-tree index?',
    relatedTopicIds: ['c7-composite-indexes', 'c7-leftmost-prefix', 'c7-covering-indexes'],
    answer: [{
      type: 'paragraph',
      text: 'Start from actual predicates, joins, and ordering. Equality conditions generally precede the first range condition; useful ordering and selectivity also matter. A B-tree can efficiently use leading columns, so an index on (tenant_id, created_at) does not generally replace one needed for created_at-only access.',
    }],
  },
  {
    id: 'sql-explain-analyze',
    question: 'How do you read EXPLAIN ANALYZE?',
    relatedTopicIds: ['c7-explain', 'c7-explain-buffers', 'c7-query-plans'],
    answer: [{
      type: 'paragraph',
      text: 'Compare estimated and actual rows at each node, multiply per-loop values by loops, identify scan and join algorithms, and inspect filters, rows removed, sort/hash memory, disk spill, buffers, I/O timing, and total execution time. EXPLAIN ANALYZE executes the statement, so wrap mutating statements in a rollback-safe transaction.',
    }],
  },
  {
    id: 'postgres-mvcc',
    question: 'How does PostgreSQL MVCC work?',
    relatedTopicIds: ['c7-mvcc', 'c7-tuple-versions', 'c7-vacuum'],
    answer: [{
      type: 'paragraph',
      text: 'Updates create new tuple versions rather than overwriting a row in place. A transaction snapshot uses visibility metadata such as xmin/xmax to choose versions, allowing readers and writers to coexist. Dead versions remain until VACUUM can reclaim them; long-lived snapshots delay cleanup and cause bloat.',
    }],
  },
  {
    id: 'postgres-isolation',
    question: 'What do PostgreSQL isolation levels actually guarantee?',
    relatedTopicIds: ['c7-isolation-levels', 'c7-read-committed', 'c7-repeatable-read', 'c7-serializable-ssi'],
    answer: [{
      type: 'paragraph',
      text: 'Read Committed takes a new statement snapshot. Repeatable Read uses a transaction snapshot and in PostgreSQL prevents phantom reads, though serialization anomalies remain possible. Serializable adds SSI conflict detection and can abort a transaction, so the complete transaction must be safely retried.',
    }],
  },
  {
    id: 'postgres-deadlock',
    question: 'How do PostgreSQL deadlocks happen and how do you prevent them?',
    relatedTopicIds: ['c7-deadlocks', 'c7-lock-ordering', 'c7-lock-monitoring'],
    answer: [{
      type: 'paragraph',
      text: 'A deadlock is a wait cycle: each transaction holds something another needs. PostgreSQL detects the cycle and aborts a victim. Keep transactions short, lock resources in a consistent order, index foreign-key/update paths, avoid remote work inside transactions, inspect pg_locks and wait events, and retry aborted units safely.',
    }],
  },
  {
    id: 'postgres-jsonb',
    question: 'JSON vs JSONB, and when should you not use JSONB?',
    relatedTopicIds: ['c7-json-jsonb', 'c7-jsonb-indexing', 'c7-normalization'],
    answer: [{
      type: 'paragraph',
      text: 'json preserves input text and key order; jsonb stores a parsed binary representation that supports efficient operators and GIN indexing. JSONB is useful for genuinely variable attributes, but core relationships and frequently constrained fields usually belong in typed normalized columns. Large frequently updated documents also amplify writes.',
    }],
  },
  {
    id: 'postgres-vacuum',
    question: 'VACUUM vs VACUUM FULL vs ANALYZE?',
    relatedTopicIds: ['c7-vacuum', 'c7-autovacuum', 'c7-statistics-analyze'],
    answer: [{
      type: 'paragraph',
      text: 'Regular VACUUM marks reusable space, advances visibility information, and freezes old transaction IDs without normally shrinking the file. ANALYZE refreshes planner statistics. VACUUM FULL rewrites and shrinks a table but takes an intrusive lock; healthy autovacuum should make it exceptional.',
    }],
  },
  {
    id: 'postgres-pooling',
    question: 'Why does PostgreSQL need connection pooling, and what can transaction pooling break?',
    relatedTopicIds: ['c7-connection-pooling', 'c7-hikari-pgbouncer', 'c7-session-transaction-pooling'],
    answer: [{
      type: 'paragraph',
      text: 'Each PostgreSQL connection is a server backend with memory and scheduling cost, so application pools bound concurrency and reuse sessions. PgBouncer can multiplex more clients. In transaction-pooling mode, session state such as temporary tables, LISTEN, some prepared-statement assumptions, and session-level settings may not survive across transactions.',
    }],
  },
  {
    id: 'postgres-backup-replication',
    question: 'Why is replication not a backup?',
    relatedTopicIds: ['c7-replication', 'c7-backup-restore', 'c7-pitr'],
    answer: [{
      type: 'paragraph',
      text: 'Replication copies current changes, including accidental deletes and corruption, and a lagging replica may still lack the required recovery point. Backups provide independent retention and, with archived WAL, point-in-time recovery. The real guarantee comes from routinely tested restores with measured RPO and RTO.',
    }],
  },
]
