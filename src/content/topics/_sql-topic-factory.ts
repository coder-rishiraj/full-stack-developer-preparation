import type { TopicContent } from '@/domain/types'

type SqlTopicInput = {
  title: string
  sectionTitle: string
  parentTitle?: string
}

const SECTION_FOCUS: Record<string, string> = {
  'Relational & PostgreSQL Foundations':
    'the relational model, SQL language families, PostgreSQL architecture, schemas, and practical tooling',
  'SQL Syntax, Types & Expressions':
    'portable syntax, precise types, NULL three-valued logic, expressions, casts, and time-zone-safe data',
  'Databases, Schemas & Table DDL':
    'transactional schema changes, table lifecycle, bulk loading, and safe destructive operations',
  'Keys, Constraints & Generated Values':
    'database-enforced invariants, referential integrity, key selection, identity, and sequence behavior',
  'CRUD & Data Modification':
    'set-based reads and writes, conflict handling, RETURNING, and bounded data changes',
  'Filtering, Ordering & Conditional Logic':
    'predicates, NULL-safe comparisons, deterministic ordering, conditional expressions, and result limits',
  'Functions, Aggregation & Grouping':
    'scalar functions, aggregate semantics, grouping, HAVING, FILTER, and multidimensional summaries',
  'Joins & Set Operations':
    'join semantics, cardinality, outer-join predicate placement, duplicates, and compatible set results',
  'Subqueries & CTEs':
    'scalar and correlated subqueries, semi/anti joins, recursion, and CTE materialization choices',
  'Window Functions & Advanced Querying':
    'partitions, ordering, frames, ranking, navigation, running aggregates, and analytical query patterns',
  'Data Modeling & Normalization':
    'ER modeling, cardinality, functional dependencies, normal forms, anomalies, and deliberate denormalization',
  'Transactions, ACID & Isolation':
    'transaction boundaries, ACID, PostgreSQL isolation semantics, concurrency anomalies, and safe retries',
  'MVCC, Locks & Deadlocks':
    'snapshot visibility, tuple versions, lock scopes, blocking evidence, deadlock prevention, and bloat',
  'Indexes & Access Methods':
    'selectivity, B-tree and specialized access methods, composite order, partial/covering indexes, and write cost',
  'Query Planning & Performance':
    'EXPLAIN evidence, scan/join nodes, estimates, statistics, sargability, memory spill, and slow-query diagnosis',
  'PostgreSQL Types & Document Features':
    'PostgreSQL-native types, JSONB, arrays, ranges, indexing, and full-text search trade-offs',
  'Views, Functions, Procedures & Triggers':
    'database encapsulation, materialization, server-side routines, trigger timing, and hidden coupling',
  'Connectivity, Security & Data Safety':
    'connection budgets, pooling modes, prepared statements, least privilege, TLS, backup, recovery, and migrations',
  'Partitioning & Large Tables':
    'partition strategy, pruning, constraints, lifecycle maintenance, and when partitioning adds complexity',
  'Replication, Vacuum & Operations':
    'WAL, physical/logical replication, lag, vacuum, wraparound prevention, monitoring, and capacity management',
}

export function createSqlTopicContent({
  title,
  sectionTitle,
  parentTitle,
}: SqlTopicInput): TopicContent {
  const focus = SECTION_FOCUS[sectionTitle] ?? 'correct SQL semantics and PostgreSQL production behavior'
  const parent = parentTitle ? ` It is an atomic part of ${parentTitle}.` : ''

  return {
    whatIsIt:
      `${title} is a SQL/PostgreSQL topic in ${sectionTitle}.${parent} ` +
      'Learn the logical SQL meaning first, then connect it to PostgreSQL execution and operations.',
    whyExists:
      `${title} helps keep relational data correct, queryable, and operable. ` +
      `A strong explanation covers ${focus}.`,
    mentalModel:
      'SQL declares the result and invariants; PostgreSQL parses, rewrites, plans, and executes that request ' +
      'against MVCC snapshots, pages, indexes, WAL, locks, statistics, and constrained runtime resources.',
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: [
          `State the relational or SQL semantics of ${title}, especially NULL and duplicate behavior.`,
          'Write a minimal example and identify the expected rows or invariant.',
          'Use constraints or a transaction when correctness belongs in the database.',
          'Inspect EXPLAIN (ANALYZE, BUFFERS) and runtime statistics before optimizing.',
          'Test realistic cardinality, skew, concurrency, failure, and rollback behavior.',
        ],
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Track boundary',
        text:
          'C7 owns relational SQL and PostgreSQL behavior. C8 owns JPA/Hibernate mapping and persistence-context behavior; ' +
          'C9 owns application security; Track D owns distributed-database architecture.',
      },
    ],
    internals: [
      {
        type: 'list',
        items: [
          'PostgreSQL parses SQL into a query tree, applies rewrite rules, chooses a costed plan, and executes plan nodes.',
          'MVCC uses tuple versions and snapshots so readers usually do not block writers; VACUUM reclaims dead tuples.',
          'Indexes are access paths, not free acceleration: each consumes storage and adds write, WAL, cache, and maintenance cost.',
          'WAL records changes before data pages are persisted and supports crash recovery, backup, and replication.',
          'Planner estimates depend on statistics and distributions; EXPLAIN ANALYZE reports actual work but executes the statement.',
        ],
      },
    ],
    failureModes: [
      `Using ${title} without checking NULL, duplicate, ordering, or transaction semantics.`,
      'Adding indexes by intuition without measuring selectivity, plan shape, write cost, and cache behavior.',
      'Keeping transactions open across remote calls or user interaction, retaining snapshots and locks.',
      'Treating replication as backup or assuming a replica is current and eligible for every read.',
      'Building SQL with string concatenation instead of parameters and least-privilege roles.',
    ],
    production: {
      reliability: [
        'Enforce durable invariants with constraints and keep transactions small, explicit, idempotent, and retry-aware.',
        'Test restore and point-in-time recovery; monitor replication lag, autovacuum progress, blocking, bloat, and disk growth.',
      ],
      observability: [
        'Capture normalized query statistics and inspect plans, buffers, rows, loops, temporary files, locks, and wait events.',
        'Correlate database evidence with application traces while redacting parameters and sensitive data.',
      ],
      maintainability: [
        'Use versioned, backward-compatible migrations and make destructive changes in expand/contract phases.',
        'Prefer clear set-based SQL and database constraints over duplicated application-side invariants.',
      ],
    },
    interview: {
      expectations: [
        `Define ${title} precisely in the context of ${sectionTitle}.`,
        'Show a compact SQL example and explain rows, NULLs, duplicates, ordering, and concurrency where relevant.',
        'Name one PostgreSQL plan, MVCC, indexing, or operations implication.',
      ],
      commonQuestions: [
        `How does ${title} work?`,
        `When would you use or avoid ${title}?`,
        'How would you verify correctness and performance in PostgreSQL?',
      ],
      followUps: [
        'What changes under concurrent transactions?',
        'Which EXPLAIN or catalog evidence would you inspect?',
      ],
      misconceptions: [
        'SQL result order is stable without ORDER BY.',
        'NULL behaves like an ordinary value.',
        'Every additional index makes the workload faster.',
      ],
      traps: [
        'Memorizing syntax without explaining relational semantics.',
        'Optimizing a query without actual plans, row counts, buffers, or workload context.',
      ],
      strongSignals: [
        'Separates logical SQL semantics from PostgreSQL physical execution.',
        'Balances correctness, latency, throughput, write amplification, storage, and operability.',
      ],
    },
    keyTakeaways: [
      `${title} belongs to ${sectionTitle}.`,
      `Focus: ${focus}.`,
      'Correct semantics → enforced invariant → measured plan → production operations.',
    ],
    interviewQuestions: [
      {
        level: 'basic',
        question: `What is ${title}, and what problem does it solve?`,
        answerHint: `Place it in ${sectionTitle} and give a minimal SQL example.`,
      },
      {
        level: 'intermediate',
        question: `Which edge cases and trade-offs matter for ${title}?`,
        answerHint: 'Discuss NULLs, duplicates, cardinality, transactions, indexes, or portability as applicable.',
      },
      {
        level: 'advanced',
        question: `How would you diagnose ${title} in production PostgreSQL?`,
        answerHint: `Use ${focus} plus plans, statistics, locks, WAL, or maintenance evidence.`,
      },
    ],
    flashcards: [
      { front: title, back: `${sectionTitle}: ${focus}.` },
      {
        front: `${title} review loop`,
        back: 'Semantics → example → invariant → plan/runtime evidence → operational trade-off.',
      },
    ],
    quickRevision: [
      `${title} — ${sectionTitle}`,
      `Focus: ${focus}`,
      'Portable SQL semantics first',
      'PostgreSQL execution and operations second',
    ],
  }
}
