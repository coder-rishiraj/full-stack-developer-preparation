import type { TopicContent } from '@/domain/types'

export const aggregationsContent: TopicContent = {
  whatIsIt:
    'SQL aggregations compute summary values over groups of rows — aggregate functions (COUNT, SUM, AVG, MIN, MAX) with GROUP BY partition keys, HAVING filters groups after aggregation, DISTINCT removes duplicates before aggregating.',
  whyExists:
    'Reports, dashboards, and analytics need totals and averages without fetching every row to the app. Database-side aggregation leverages indexes, parallelism, and reduces network transfer.',
  mentalModel:
    'WHERE filters rows first → GROUP BY buckets remaining rows → aggregate function runs per bucket → HAVING filters buckets (not rows). SELECT non-aggregated columns must appear in GROUP BY (PostgreSQL functional dependency rules excepted).',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Scalar aggregate: SELECT COUNT(*) FROM orders — one row result.',
        'GROUP BY category: one output row per distinct category value.',
        'HAVING SUM(amount) > 1000 — predicate on aggregate, not WHERE.',
        'FILTER clause: COUNT(*) FILTER (WHERE status = \'paid\').',
        'GROUPING SETS / ROLLUP / CUBE for subtotals (advanced).',
      ],
    },
    {
      type: 'table',
      headers: ['Function', 'Purpose', 'NULL behavior'],
      rows: [
        ['COUNT(*)', 'Row count per group', 'Counts all rows'],
        ['COUNT(col)', 'Non-null values', 'Ignores NULL'],
        ['SUM / AVG', 'Numeric totals/mean', 'Ignores NULL; AVG div non-null count'],
        ['MIN / MAX', 'Extremes', 'Ignores NULL'],
        ['BOOL_AND/OR', 'Boolean aggregate (PG)', 'Logical combine'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Rows[Filtered rows] --> Group[GROUP BY hash/sort]
  Group --> Agg[Aggregate functions]
  Agg --> Having[HAVING filter]
  Having --> Result[Result set]`,
    caption: 'Aggregation pipeline after WHERE',
  },
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'GROUP BY with HAVING',
      code: `SELECT user_id,
       COUNT(*) AS order_count,
       SUM(total_cents) AS revenue_cents,
       AVG(total_cents)::INT AS avg_order_cents
FROM orders
WHERE created_at >= '2026-01-01'
  AND status = 'completed'
GROUP BY user_id
HAVING SUM(total_cents) > 10000
ORDER BY revenue_cents DESC
LIMIT 50;`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'FILTER and conditional counts',
      code: `SELECT date_trunc('day', created_at) AS day,
       COUNT(*) AS total,
       COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled
FROM orders
GROUP BY 1
ORDER BY 1;`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Common mistake — non-grouped column',
      code: `-- INVALID in standard SQL:
-- SELECT user_id, email, COUNT(*) FROM orders GROUP BY user_id;
-- email must be in GROUP BY or inside aggregate

SELECT user_id, MAX(email) AS any_email, COUNT(*)
FROM orders o
JOIN users u ON u.id = o.user_id
GROUP BY user_id;`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'HashAggregate vs GroupAggregate — planner picks by memory and stats.',
        'Partial aggregation possible with parallel workers on large scans.',
        'Index-only scan if covering index on (group_col, agg_col) sometimes.',
        'COUNT(DISTINCT x) expensive — often HyperLogLog or pre-aggregate tables at scale.',
        'Empty input: COUNT=0, SUM/AVG=NULL except COUNT(*)=0.',
      ],
    },
  ],
  complexity: {
    average: 'O(n) scan + O(g) groups for hash aggregate',
    worst: 'Sort-based group on huge dataset spilling to disk',
    notes: 'High cardinality GROUP BY — many groups, large memory',
  },
  tradeoffs: {
    advantages: [
      'Single query vs app-side loops',
      'Correct NULL semantics centralized',
      'Composable with JOINs and subqueries',
    ],
    disadvantages: [
      'Heavy GROUP BY on unindexed columns — full scan',
      'Real-time dashboards may need materialized views',
    ],
    alternatives: [
      'Materialized view refreshed periodically',
      'OLAP column store / pre-aggregated cubes',
      'Stream aggregation (Flink) for real-time',
    ],
    whenToUse: [
      'Reporting queries, admin stats, HAVING thresholds',
      'Batch analytics on relational data',
    ],
    whenNotToUse: [
      'Need every detail row — plain SELECT',
      'Billions of groups — pre-aggregate or approximate',
    ],
  },
  failureModes: [
    'SELECT col not in GROUP BY — SQL error or ambiguous results.',
    'Using WHERE on aggregate alias instead of HAVING.',
    'COUNT(*) vs COUNT(column) confusion with NULLs.',
    'AVG skewed by outliers — need PERCENTILE_CONT.',
    'Duplicate rows from JOIN inflate SUM/COUNT — wrong join grain.',
  ],
  production: {
    performance: [
      'Index columns in WHERE and GROUP BY',
      'Materialized views for heavy recurring aggregates',
    ],
    observability: ['EXPLAIN ANALYZE hash aggregate spill to disk'],
  },
  interview: {
    expectations: [
      'GROUP BY + HAVING difference from WHERE',
      'Common aggregate functions',
      'JOIN grain and double-counting',
    ],
    commonQuestions: [
      'WHERE vs HAVING?',
      'COUNT(*) vs COUNT(col)?',
      'Find top N customers by revenue?',
    ],
    followUps: [
      'ROLLUP for subtotals?',
      'Optimize high-cardinality GROUP BY?',
    ],
    misconceptions: [
      'HAVING filters rows before grouping',
      'AVG includes NULL rows in denominator',
    ],
    traps: ['JOIN causing duplicated revenue sums'],
    strongSignals: [
      'FILTER clause for conditional aggregates',
      'Correct GROUP BY columns',
      'HAVING on SUM not WHERE',
    ],
  },
  keyTakeaways: [
    'WHERE before group; HAVING after aggregate.',
    'Every SELECT column must be grouped or aggregated.',
    'COUNT(*) vs COUNT(col) — NULL difference.',
    'JOIN grain affects COUNT/SUM correctness.',
    'FILTER for conditional counts inside one query.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'WHERE vs HAVING?',
      answerHint: 'WHERE filters rows before aggregation; HAVING filters groups after GROUP BY.',
    },
    {
      level: 'intermediate',
      question: 'Why SUM after bad JOIN wrong?',
      answerHint: 'Join duplicates rows — each order line repeated inflates SUM(order.total).',
    },
    {
      level: 'advanced',
      question: 'COUNT(DISTINCT) performance issue?',
      answerHint: 'High memory/hash; approximate HLL or pre-aggregate at scale.',
    },
  ],
  flashcards: [
    { front: 'HAVING applies', back: 'After GROUP BY on aggregate expressions' },
    { front: 'COUNT(*)', back: 'Counts rows including NULL columns' },
    { front: 'FILTER clause', back: 'Conditional aggregate: COUNT(*) FILTER (WHERE ...)' },
  ],
  quickRevision: [
    'WHERE → GROUP BY → HAVING',
    'Non-aggregated cols in GROUP BY',
    'COUNT(*) vs COUNT(col)',
    'JOIN grain matters',
    'FILTER conditional agg',
    'Index WHERE/GROUP cols',
    'Materialized views heavy reports',
  ],
}

export const content = aggregationsContent
