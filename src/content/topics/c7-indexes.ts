import type { TopicContent } from '@/domain/types'

export const indexesContent: TopicContent = {
  whatIsIt:
    'A database index is an auxiliary data structure (commonly B-tree in PostgreSQL) that maps indexed column values to heap row locations (TIDs), enabling fast seeks and range scans instead of full sequential table scans.',
  whyExists:
    'Tables grow large; linear scans are O(n). Indexes reduce read latency for selective queries, enforce uniqueness, and accelerate JOINs and ORDER BY on indexed columns — at the cost of extra storage and write overhead.',
  mentalModel:
    'Think sorted phone book vs reading every page. Query planner chooses index scan when selectivity is high enough to beat sequential scan + filter. Every index slows INSERT/UPDATE/DELETE on covered columns because index entries must stay consistent.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Index type', 'Best for', 'Notes'],
      rows: [
        ['B-tree (default)', 'Equality, range, ORDER BY, LIKE prefix', 'Most OLTP indexes'],
        ['Hash', 'Equality only (=)', 'Per-column; no range'],
        ['GIN', 'JSONB, arrays, full-text', 'Inverted index'],
        ['GiST / SP-GiST', 'Geometry, ltree, ranges', 'Custom opclasses'],
        ['BRIN', 'Very large naturally ordered tables', 'Block range summaries'],
      ],
    },
    {
      type: 'list',
      items: [
        'CREATE INDEX creates structure; planner uses statistics (pg_stats) for cost estimates.',
        'Composite index (a, b) supports queries on a and (a, b), not generally b alone.',
        'Covering index (INCLUDE columns) enables index-only scans when visibility map says heap all-visible.',
        'Partial index: WHERE clause limits rows indexed — smaller, targeted.',
        'UNIQUE index enforces uniqueness; PRIMARY KEY creates unique index automatically.',
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Query[SELECT with WHERE] --> Planner[Query planner]
  Planner -->|selective| IdxScan[Index Scan]
  Planner -->|large fraction| SeqScan[Seq Scan]
  IdxScan --> BTree[B-tree index]
  BTree --> TID[Heap TID fetch]`,
    caption: 'Planner picks index vs sequential scan by cost',
  },
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'Common B-tree indexes',
      code: `CREATE INDEX idx_orders_user_created
  ON orders (user_id, created_at DESC);

CREATE UNIQUE INDEX idx_users_email ON users (lower(email));

CREATE INDEX idx_active_users ON users (id) WHERE deleted_at IS NULL;`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'EXPLAIN — index vs seq scan',
      code: `EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders WHERE user_id = 42 AND created_at > '2026-01-01';
-- Index Scan using idx_orders_user_created if selective`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Online index build (PostgreSQL)',
      code: `CREATE INDEX CONCURRENTLY idx_orders_status ON orders (status);
-- No long write-blocking lock; safe in production`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'B-tree pages store keys sorted; leaf pages point to heap TIDs or index-only payload.',
        'Index-only scan skips heap if all columns in index + visibility map bit set for page.',
        'Write path: heap insert/update → insert/update index entries; HOT updates avoid index churn if indexed columns unchanged and same page.',
        'Bloat: dead index tuples until VACUUM; REINDEX CONCURRENTLY rebuilds corrupted/bloated index.',
        'Selectivity: if WHERE matches > ~5–30% of rows (rule of thumb), seq scan often wins due to sequential I/O.',
      ],
    },
  ],
  complexity: {
    average: 'B-tree seek O(log n) page traversals',
    worst: 'Low selectivity → index scan + random heap fetches slower than seq scan',
    space: 'Extra disk proportional to indexed columns + row count',
    notes: 'Composite index column order matters for left-prefix usage.',
  },
  tradeoffs: {
    advantages: [
      'Fast point lookups and bounded range queries',
      'Uniqueness enforcement',
      'Can satisfy ORDER BY without sort',
    ],
    disadvantages: [
      'Slower writes and more storage',
      'Wrong or unused indexes hurt without helping reads',
      'Planner may ignore index if stats stale',
    ],
    alternatives: [
      'Denormalization / materialized views for read-heavy aggregates',
      'Partitioning to prune partitions instead of wide index',
      'Cache hot keys in application (Redis) with TTL',
    ],
    whenToUse: [
      'High-cardinality filter columns in frequent queries',
      'Foreign keys used in JOINs',
      'Unique business keys (email, external_id)',
    ],
    whenNotToUse: [
      'Tiny tables where seq scan is cheaper',
      'Low-cardinality boolean alone (partial index may help)',
      'Columns rarely in WHERE/JOIN/ORDER BY',
    ],
  },
  failureModes: [
    'Index on (b) only when queries filter b without a in composite (a,b).',
    'Function in WHERE without expression index: WHERE lower(email)= — seq scan.',
    'Implicit type cast prevents index use on column.',
    'Too many indexes → write amplification and autovacuum pressure.',
    'CREATE INDEX (non-concurrent) locks writes on large table in production.',
    'Stale statistics → bad plan (nested loop on huge set).',
  ],
  production: {
    performance: [
      'EXPLAIN ANALYZE hot queries; verify index usage',
      'ANALYZE after large data changes',
    ],
    scalability: [
      'CONCURRENTLY for index creation in prod',
      'Monitor idx_scan vs seq_scan in pg_stat_user_indexes',
    ],
    reliability: ['UNIQUE indexes back idempotent upserts ON CONFLICT'],
    observability: [
      'pg_stat_user_indexes.idx_scan = 0 → candidate to drop',
      'Track index bloat and autovacuum',
    ],
    cost: ['Indexes increase storage and backup size'],
  },
  interview: {
    expectations: [
      'Explain B-tree role and composite index left-prefix rule',
      'Read EXPLAIN plan at high level',
      'Balance read speed vs write cost',
    ],
    commonQuestions: [
      'When does an index not help?',
      'Difference between clustered (SQL Server) vs PostgreSQL heap?',
      'What is a covering index?',
      'CREATE INDEX CONCURRENTLY?',
    ],
    followUps: [
      'GIN vs B-tree for JSONB?',
      'How to find unused indexes?',
    ],
    misconceptions: [
      'Index every column',
      'PostgreSQL clustered index moves rows (heap stays unordered; CLUSTER is one-time rewrite)',
      'UNIQUE constraint without index (PostgreSQL implements via unique index)',
    ],
    traps: ['Suggesting hash index for range queries'],
    strongSignals: [
      'Mentions selectivity and EXPLAIN',
      'Composite column order and partial indexes',
      'Write amplification and CONCURRENTLY',
    ],
  },
  keyTakeaways: [
    'B-tree default: equality + range + sort.',
    'Composite index: left-prefix columns matter.',
    'Indexes cost writes and space — index selectively.',
    'Planner chooses by cost; stale stats mislead.',
    'CONCURRENTLY for prod; partial indexes for targeted queries.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What problem does an index solve?',
      answerHint: 'Avoid full table scan; fast lookup/range on indexed columns.',
    },
    {
      level: 'intermediate',
      question: 'Why column order in (a, b) composite index matters?',
      answerHint: 'Efficient for a and (a,b) predicates; not b alone.',
    },
    {
      level: 'advanced',
      question: 'When can an index scan be slower than sequential scan?',
      answerHint: 'Low selectivity; many random heap fetches vs sequential read.',
    },
  ],
  flashcards: [
    { front: 'PostgreSQL default index', back: 'B-tree — =, <, >, ORDER BY' },
    { front: 'Composite (a,b) supports', back: 'Queries on a and (a,b); not b alone' },
    { front: 'Prod index creation', back: 'CREATE INDEX CONCURRENTLY' },
  ],
  quickRevision: [
    'B-tree for most OLTP',
    'Left-prefix composite rule',
    'Selectivity drives planner',
    'EXPLAIN ANALYZE',
    'Partial / unique / INCLUDE',
    'Writes slower with more indexes',
    'CONCURRENTLY in production',
  ],
}

export const content = indexesContent
