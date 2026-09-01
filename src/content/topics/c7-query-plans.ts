import type { TopicContent } from '@/domain/types'

export const queryPlansContent: TopicContent = {
  whatIsIt:
    'A query plan is PostgreSQL\'s chosen execution strategy for a SQL statement — a tree of nodes (scan, join, sort, aggregate) with estimated and actual costs, produced by the cost-based optimizer from statistics and indexes.',
  whyExists:
    'Many equivalent SQL forms exist; brute-force execution would be slow. The planner picks among seq scan, index scan, join algorithms, and parallel workers to minimize estimated I/O and CPU for the expected data distribution.',
  mentalModel:
    'SQL → parse → rewrite (rules, views) → plan search → best-cost plan tree. Each node has startup and total cost in arbitrary units (seq_page_cost, cpu_tuple_cost). Actual runtime may differ if statistics lie.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Node type', 'Role', 'When chosen'],
      rows: [
        ['Seq Scan', 'Read all heap pages', 'Small table or low selectivity'],
        ['Index Scan / Index Only Scan', 'B-tree seek + heap fetch', 'Selective WHERE on indexed cols'],
        ['Bitmap Index Scan + Heap Scan', 'Index TID bitmap then heap', 'Medium selectivity'],
        ['Nested Loop', 'For each outer row, probe inner', 'Small outer + indexed inner'],
        ['Hash Join', 'Build hash on inner, probe outer', 'Equality join, large sets'],
        ['Merge Join', 'Sort both sides, merge', 'Pre-sorted or large sorted joins'],
        ['Sort / HashAggregate', 'ORDER BY or GROUP BY', 'No index path for sort/group'],
      ],
    },
    {
      type: 'list',
      items: [
        'cost = startup_cost + run_cost; planner minimizes total cost for whole query.',
        'Selectivity from pg_stats (histograms, ndistinct, correlation).',
        'Join order: for N tables, exhaustive search capped — genetic optimizer if too many.',
        'Parallel Gather merges partial results from parallel workers.',
        'Prepared statements may use generic vs custom plan based on parameter values.',
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  SQL[SQL query] --> Parser[Parser]
  Parser --> Rewriter[Rewriter]
  Rewriter --> Planner[Planner / Optimizer]
  Stats[pg_stats] --> Planner
  Indexes[Index definitions] --> Planner
  Planner --> Plan[Plan tree]
  Plan --> Exec[Executor]
  Exec --> Result[Rows]`,
    caption: 'Planner uses stats and schema to build execution tree',
  },
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'Simple plan tree',
      code: `EXPLAIN
SELECT o.id, u.email
FROM orders o
JOIN users u ON u.id = o.user_id
WHERE o.created_at >= '2026-01-01'
  AND u.country = 'IN';

-- Typical output shape:
-- Hash Join
--   -> Seq Scan on orders (filter: created_at >= ...)
--   -> Hash
--        -> Index Scan on users (country = 'IN')`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Plan changes with selectivity',
      code: `-- Selective: index scan
EXPLAIN SELECT * FROM orders WHERE id = 12345;

-- Low selectivity: seq scan often wins
EXPLAIN SELECT * FROM orders WHERE status = 'pending';
-- if 40% of rows pending, Seq Scan may beat Index Scan`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Join algorithm choice',
      code: `-- Nested loop good when outer is tiny:
EXPLAIN SELECT * FROM users u
JOIN orders o ON o.user_id = u.id
WHERE u.id = 42;

-- Hash join when both sides large equality join:
EXPLAIN SELECT * FROM orders o1
JOIN orders o2 ON o1.user_id = o2.user_id;`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'GUC knobs: enable_seqscan, enable_hashjoin, random_page_cost, effective_cache_size.',
        'Extended statistics (dependencies, multivariate) improve correlated column estimates.',
        'InitPlan / SubPlan for subqueries; Materialize node caches CTE results.',
        'Plan cache in prepared statements; invalidation on schema/stats change.',
        'Generic plan may ignore parameter-specific selectivity until custom plan threshold.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Automatic optimization without manual hints in most cases',
      'Adapts to data size via statistics',
      'Multiple join strategies for different shapes',
    ],
    disadvantages: [
      'Wrong estimates → catastrophic nested loop on huge sets',
      'Opaque without EXPLAIN skill',
      'Plan instability after ANALYZE or version upgrade',
    ],
    alternatives: [
      'pg_hint_plan extension for emergency hints',
      'Rewrite SQL (subquery to join) to guide planner',
      'Materialized views precompute expensive plans',
    ],
    whenToUse: [
      'Always understand plans for production hot queries',
      'After schema/index changes on critical paths',
      'When latency regresses without code change',
    ],
    whenNotToUse: [
      'Over-tuning trivial dev queries',
      'Disabling seqscan globally — hurts many queries',
    ],
  },
  failureModes: [
    'Stale stats → wrong row estimates → bad join order.',
    'Missing index → seq scan on million-row filter.',
    'Nested loop with unindexed inner → O(n×m).',
    'Function on column prevents index → seq scan surprise.',
    'Assuming same plan forever — data growth changes selectivity.',
  ],
  production: {
    performance: ['ANALYZE after bulk load; autovacuum analyze on schedule'],
    observability: [
      'pg_stat_statements: mean_time, plans, calls',
      'auto_explain.log_min_duration for slow plans',
    ],
  },
  interview: {
    expectations: [
      'Read EXPLAIN nodes at high level',
      'Seq vs index scan tradeoff',
      'Hash vs nested loop join intuition',
    ],
    commonQuestions: [
      'How does PostgreSQL choose a query plan?',
      'When seq scan beats index scan?',
      'What is a nested loop join?',
    ],
    followUps: ['Bitmap scan role', 'Why bad statistics hurt'],
    misconceptions: [
      'Index always used when exists',
      'Cost units are milliseconds',
      'Planner sees actual row counts before executing (only estimates unless ANALYZE)',
    ],
    traps: ['Recommending hint before checking stats and indexes'],
    strongSignals: [
      'Selectivity and random_page_cost story',
      'Hash join build/probe sides',
      'Plan regression after data skew',
    ],
  },
  keyTakeaways: [
    'Planner picks lowest estimated-cost plan tree from stats and indexes.',
    'Scan types: seq, index, bitmap — driven by selectivity.',
    'Joins: nested loop (small outer), hash (equality, large), merge (sorted).',
    'Bad plans usually mean stale stats, missing index, or unselective predicate.',
    'EXPLAIN shows plan; EXPLAIN ANALYZE validates with actuals.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is a query execution plan?',
      answerHint: 'Tree of operations (scan, join, sort) chosen by optimizer to run SQL.',
    },
    {
      level: 'intermediate',
      question: 'When might sequential scan beat index scan?',
      answerHint: 'Large fraction of table matches; sequential I/O cheaper than random heap fetches.',
    },
    {
      level: 'advanced',
      question: 'Hash join vs nested loop — planner choice?',
      answerHint: 'Nested loop when outer small and inner indexed; hash join for large equality joins.',
    },
  ],
  flashcards: [
    { front: 'Seq Scan', back: 'Read all pages — small table or low selectivity' },
    { front: 'Hash Join', back: 'Build hash table on inner; probe with outer' },
    { front: 'Planner inputs', back: 'pg_stats, indexes, GUC costs, query structure' },
  ],
  quickRevision: [
    'Cost-based plan tree',
    'Seq / Index / Bitmap scan',
    'Nested Loop / Hash / Merge join',
    'Selectivity from pg_stats',
    'Stale stats = bad plan',
    'EXPLAIN vs ANALYZE',
    'Parallel Gather workers',
  ],
}

export const content = queryPlansContent
