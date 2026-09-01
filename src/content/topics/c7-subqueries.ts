import type { TopicContent } from '@/domain/types'

export const subqueriesContent: TopicContent = {
  whatIsIt:
    'A subquery is a SELECT nested inside another SQL statement — in WHERE, FROM, SELECT list, or INSERT/UPDATE/DELETE — producing a scalar value, row, or table used by the outer query.',
  whyExists:
    'Some filters and computations are easier to express as a nested query than a single flat JOIN (e.g. “users who spent more than average”). Subqueries decouple intermediate logic before CTEs and window functions became ubiquitous.',
  mentalModel:
    'Inner query runs conceptually first (or is merged/inlined by planner), outer query uses its result as a filter, column source, or existence check. Correlated subqueries re-run per outer row — expensive unless rewritten to JOIN or semi-join.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Form', 'Returns', 'Typical use'],
      rows: [
        ['Scalar subquery', 'Single value', 'WHERE price > (SELECT AVG(price) FROM products)'],
        ['Row subquery', 'One row', 'WHERE (a,b) = (SELECT a,b FROM ... LIMIT 1)'],
        ['Table subquery', 'Result set', 'FROM (SELECT ...) AS t or IN (SELECT ...)'],
        ['EXISTS / NOT EXISTS', 'Boolean per row', 'Semi-join: “has related rows” without duplicating outer rows'],
        ['Correlated', 'Depends on outer row', 'WHERE o.user_id = u.id inside subquery referencing u'],
      ],
    },
    {
      type: 'list',
      items: [
        'IN (subquery) — semi-join; NULL in subquery makes IN behave unexpectedly (use NOT EXISTS instead).',
        'ANY / ALL — compare scalar to set: col > ANY (SELECT ...) equivalent to col > min(set) for >.',
        'Scalar subquery in SELECT list must return exactly one row/column or runtime error.',
        'PostgreSQL planner often converts IN/EXISTS to Hash Semi Join or Hash Anti Join.',
        'Lateral subquery: FROM LATERAL (SELECT ... WHERE s.order_id = o.id) — correlated in FROM.',
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Outer[Outer SELECT] --> Filter[WHERE / HAVING]
  Filter --> Sub[Subquery SELECT]
  Sub --> Result[Scalar / Row / Set]
  Result --> Outer
  Planner[Query planner] -->|rewrite| Join[Semi Join / Hash Join]
  Sub --> Planner`,
    caption: 'Subqueries may execute nested or be rewritten as joins',
  },
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'Scalar and IN subqueries',
      code: `-- Users who spent above average
SELECT id, email
FROM users u
WHERE (
  SELECT COALESCE(SUM(total_cents), 0)
  FROM orders o
  WHERE o.user_id = u.id
) > (SELECT AVG(user_total) FROM (
  SELECT SUM(total_cents) AS user_total FROM orders GROUP BY user_id
) t);

-- Products never ordered
SELECT id, name FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM order_items oi WHERE oi.product_id = p.id
);`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Derived table in FROM',
      code: `SELECT u.email, stats.order_count, stats.total_spend
FROM users u
JOIN (
  SELECT user_id, COUNT(*) AS order_count, SUM(total_cents) AS total_spend
  FROM orders
  GROUP BY user_id
) stats ON stats.user_id = u.id
WHERE stats.order_count >= 5;`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'LATERAL — correlated subquery in FROM',
      code: `SELECT o.id, o.total_cents, recent.item_count
FROM orders o
CROSS JOIN LATERAL (
  SELECT COUNT(*) AS item_count
  FROM order_items oi
  WHERE oi.order_id = o.id
) recent
WHERE o.created_at >= NOW() - INTERVAL '7 days';`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'InitPlan nodes in EXPLAIN — scalar subquery evaluated once per statement.',
        'SubPlan nodes — correlated subquery re-evaluated per outer row (InitPlan vs SubPlan cost).',
        'Semi-join (EXISTS, IN) stops at first match; anti-join (NOT EXISTS) for absence checks.',
        'NULL semantics: WHERE col NOT IN (SELECT ...) returns UNKNOWN if subquery has NULL → row filtered out.',
        'PostgreSQL 12+ may inline simple subqueries; complex ones materialize to work_mem temp structures.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Expressive filters without extra JOIN duplication',
      'EXISTS idiomatic for “has child rows” checks',
      'Scalar subqueries readable for one-off aggregates in WHERE',
    ],
    disadvantages: [
      'Correlated subqueries can be O(n×m) without rewrite',
      'Deep nesting hurts readability vs CTEs or window functions',
      'NOT IN + NULL trap',
    ],
    alternatives: [
      'JOIN instead of IN when you need columns from subquery',
      'CTEs (WITH) for multi-step readability',
      'Window functions instead of correlated scalar subqueries in SELECT',
    ],
    whenToUse: [
      'EXISTS / NOT EXISTS for existence checks',
      'One-off scalar comparisons (avg, max) in WHERE',
      'Derived tables when CTE not needed',
    ],
    whenNotToUse: [
      'Per-row correlated aggregate — prefer JOIN + GROUP BY or window fn',
      'Same subquery referenced twice — use CTE MATERIALIZED',
      'NOT IN when subquery column nullable — use NOT EXISTS',
    ],
  },
  failureModes: [
    'Correlated subquery in SELECT list → N executions, slow on large outer sets.',
    'NOT IN (SELECT nullable_col) silently excludes rows — use NOT EXISTS.',
    'Scalar subquery returns 0 or 2+ rows → error or wrong result.',
    'Assuming subquery always materializes — planner may inline differently after stats change.',
    'Using IN with huge subquery result — hash semi join memory spike in work_mem.',
  ],
  production: {
    performance: [
      'EXPLAIN ANALYZE; look for SubPlan loops = outer rows',
      'Rewrite correlated subqueries to JOIN where possible',
    ],
    observability: ['pg_stat_statements for repeated slow subquery patterns'],
  },
  interview: {
    expectations: [
      'Difference IN vs EXISTS vs JOIN',
      'Correlated vs uncorrelated subquery cost',
      'NOT IN NULL trap',
    ],
    commonQuestions: [
      'When prefer EXISTS over IN?',
      'What is a correlated subquery?',
      'How does PostgreSQL execute subqueries?',
    ],
    followUps: ['Rewrite correlated subquery to JOIN', 'Subquery vs CTE performance PG12+'],
    misconceptions: [
      'Subquery always runs before outer query physically',
      'IN and EXISTS always equivalent',
      'NOT IN safe with NULLs',
    ],
    traps: ['Suggesting NOT IN without mentioning NULL handling'],
    strongSignals: [
      'Mentions semi-join / anti-join rewrite',
      'EXISTS over IN for large sets',
      'LATERAL for correlated FROM clause',
    ],
  },
  keyTakeaways: [
    'Subqueries return scalar, row, or table for outer query.',
    'EXISTS/NOT EXISTS avoid duplicate rows and NULL IN pitfalls.',
    'Correlated subqueries re-run per outer row — costly; prefer JOIN/window.',
    'Planner rewrites many subqueries to joins — verify with EXPLAIN.',
    'CTEs often clearer for multi-step logic; subqueries still essential for EXISTS.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is a subquery?',
      answerHint: 'SELECT nested inside another statement producing a value or set for the outer query.',
    },
    {
      level: 'intermediate',
      question: 'EXISTS vs IN — when choose which?',
      answerHint: 'EXISTS for existence/semi-join; stops early; IN compares values; NULL issues with NOT IN.',
    },
    {
      level: 'advanced',
      question: 'Why is NOT IN (subquery) dangerous?',
      answerHint: 'If subquery returns NULL, NOT IN yields UNKNOWN — rows incorrectly filtered; use NOT EXISTS.',
    },
  ],
  flashcards: [
    { front: 'EXISTS returns', back: 'True if subquery has ≥1 row; semi-join pattern' },
    { front: 'Correlated subquery', back: 'References outer query row; runs per outer row' },
    { front: 'NOT IN NULL trap', back: 'Use NOT EXISTS when subquery column nullable' },
  ],
  quickRevision: [
    'Scalar / row / table subqueries',
    'EXISTS semi-join; NOT EXISTS anti-join',
    'Correlated = per-row cost',
    'NOT IN + NULL = bug',
    'LATERAL for correlated FROM',
    'Planner → Hash Semi Join',
    'Prefer JOIN/CTE when clearer',
  ],
}

export const content = subqueriesContent
