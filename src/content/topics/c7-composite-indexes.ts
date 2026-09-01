import type { TopicContent } from '@/domain/types'

export const compositeIndexesContent: TopicContent = {
  whatIsIt:
    'A composite (multicolumn) index is a single B-tree index on multiple columns in defined order — (user_id, created_at DESC) — enabling queries that filter or sort on a left-prefix of those columns efficiently.',
  whyExists:
    'Single-column indexes cannot optimize queries filtering user_id AND ordering by created_at together as well as one composite index. Composite indexes consolidate access paths and can cover queries with INCLUDE columns for index-only scans.',
  mentalModel:
    'Keys sorted lexicographically: compare column a first, then b within equal a, then c. Index (a,b) helps WHERE a=? , WHERE a=? AND b=? , ORDER BY a,b — not WHERE b=? alone. Column order is not commutative — put equality filters left, range/sort columns right.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'CREATE INDEX idx ON t (a, b, c) — keys stored as tuple (a,b,c).',
        'Left-prefix rule: usable for (a), (a,b), (a,b,c) predicates; not (b) or (c) alone.',
        'Range column should be last in index — (status, created_at) where status= eq and created_at range.',
        'DESC column order in index matches ORDER BY ... DESC avoiding sort.',
        'INCLUDE (col) adds payload columns in leaf only — covering index without sort key bloat.',
      ],
    },
    {
      type: 'table',
      headers: ['Query predicate', 'Index (a,b) used?', 'Notes'],
      rows: [
        ['WHERE a = 1', 'Yes', 'Full prefix'],
        ['WHERE a = 1 AND b = 2', 'Yes', 'Full composite'],
        ['WHERE b = 2', 'No', 'Skips leading column'],
        ['WHERE a = 1 ORDER BY b', 'Yes', 'Avoids sort'],
        ['WHERE a > 1 AND b = 2', 'Partial', 'Range on a limits b use'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Query["WHERE user_id=? ORDER BY created_at"]
  Query --> Idx["Index (user_id, created_at)"]
  Idx --> Leaf[Leaf scan ordered]
  Leaf --> Heap[Optional heap fetch]`,
    caption: 'Composite index matches filter + sort column order',
  },
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'Common composite indexes',
      code: `-- User's orders by date — very common pattern
CREATE INDEX idx_orders_user_created
  ON orders (user_id, created_at DESC);

-- Partial composite — smaller index
CREATE INDEX idx_open_orders_user
  ON orders (user_id, created_at)
  WHERE status = 'open';

-- Covering index — index-only scan possible
CREATE INDEX idx_users_email_cover
  ON users (email)
  INCLUDE (display_name, created_at);`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'EXPLAIN verifies composite usage',
      code: `EXPLAIN (ANALYZE, BUFFERS)
SELECT id, total FROM orders
WHERE user_id = 42
  AND created_at >= '2026-01-01'
ORDER BY created_at DESC
LIMIT 20;
-- Index Scan using idx_orders_user_created`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Wrong column order — index not used for filter on b alone',
      code: `-- Index (last_name, first_name)
-- Query: WHERE first_name = 'Ann'  →  likely Seq Scan
-- Fix: separate index on first_name OR (first_name, last_name) depending on queries`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'btree comparison uses type-specific operators; NULL sort order configurable NULLS FIRST/LAST.',
        'Multicolumn statistics (extended stats) help planner correlate a,b when independent assumption wrong.',
        'Index-only scan needs visibility map all-visible + INCLUDE/all SELECT columns in index.',
        'Write cost: every indexed column change updates composite entry.',
        'Duplicate indexes (a) and (a,b) — (a) often redundant if (a,b) exists for prefix queries on a only — actually (a,b) supports a alone, so (a) alone may be redundant.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'One index serves filter + sort',
      'Smaller than two indexes if queries always combine columns',
      'INCLUDE enables covering scans',
    ],
    disadvantages: [
      'Wrong column order useless for some queries',
      'Wider keys — fewer entries per page, more I/O',
      'Over-indexing slows writes',
    ],
    alternatives: [
      'Separate single-column indexes — bitmap AND (PG) or planner pick one',
      'Denormalized column combining keys (rare)',
    ],
    whenToUse: [
      'Queries always filter equality cols then range/sort',
      'Foreign key + common sort (user_id, created_at)',
    ],
    whenNotToUse: [
      'Queries only filter trailing column',
      'Low selectivity leading column alone',
    ],
  },
  failureModes: [
    'Index (b, a) created but queries filter a only — seq scan.',
    'Range on middle column breaks use of later columns.',
    'Redundant index (a) when (a,b) already exists — extra write cost.',
    'Implicit cast on indexed column prevents use.',
    'OR across columns — planner may not combine composite index efficiently.',
  ],
  production: {
    performance: [
      'Design index column order from query patterns',
      'DROP redundant single-column index when composite prefix covers',
    ],
    observability: ['pg_stat_user_indexes idx_scan; EXPLAIN hot queries'],
  },
  interview: {
    expectations: [
      'Left-prefix rule',
      'Column order: equality before range',
      'INCLUDE covering indexes',
    ],
    commonQuestions: [
      'Composite index (a,b) — queries it supports?',
      'How choose column order?',
      'When separate indexes vs composite?',
    ],
    followUps: [
      'Index-only scan requirements?',
      'Partial composite index benefit?',
    ],
    misconceptions: [
      'Column order does not matter',
      'More columns in index always better',
      '(b,a) same as (a,b)',
    ],
    traps: ['Index on (created_at, user_id) for WHERE user_id=?'],
    strongSignals: [
      'Equality columns left, range right',
      'Mentions redundant (a) with (a,b)',
      'Partial index for subset rows',
    ],
  },
  keyTakeaways: [
    'Composite index order matters — left-prefix rule.',
    'Equality filters first; range/sort column last.',
    '(a,b) helps a and (a,b) not b alone.',
    'INCLUDE for covering without widening sort key.',
    'Avoid redundant indexes sharing prefix.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Index (a,b) supports which WHERE clauses?',
      answerHint: 'a alone and a+b; not b alone.',
    },
    {
      level: 'intermediate',
      question: 'Design index for WHERE user_id=? ORDER BY created_at DESC?',
      answerHint: '(user_id, created_at DESC) composite.',
    },
    {
      level: 'advanced',
      question: 'When index-only scan on composite?',
      answerHint: 'All selected cols in index/INCLUDE + visibility map all-visible on heap pages.',
    },
  ],
  flashcards: [
    { front: 'Left-prefix rule', back: '(a,b) usable for a and (a,b); not b alone' },
    { front: 'Column order tip', back: 'Equality columns left; range/sort right' },
    { front: 'INCLUDE columns', back: 'Payload in leaf only — covering index' },
  ],
  quickRevision: [
    'Order matters (a,b)≠(b,a)',
    'Left-prefix rule',
    'Eq cols before range',
    'DESC in index matches sort',
    'INCLUDE covering',
    'Partial composite smaller',
    'Drop redundant (a) if (a,b)',
  ],
}

export const content = compositeIndexesContent
