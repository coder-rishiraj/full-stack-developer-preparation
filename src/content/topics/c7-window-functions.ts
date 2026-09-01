import type { TopicContent } from '@/domain/types'

export const windowFunctionsContent: TopicContent = {
  whatIsIt:
    'Window functions compute aggregates or rankings over a partition of rows while retaining each input row — using OVER (PARTITION BY ... ORDER BY ... frame). Unlike GROUP BY, they do not collapse rows.',
  whyExists:
    'Many analytics need per-row context: running totals, rank within department, previous/next value. Subqueries and self-joins for these patterns are verbose and slow; window functions express them in one pass.',
  mentalModel:
    'Define a window (partition + ordered frame) for each row. Function sees sibling rows in that window — SUM() OVER adds running total; ROW_NUMBER() assigns 1,2,3 within partition. Frame clause controls which rows count (ROWS/RANGE/GROUPS BETWEEN).',
  howItWorks: [
    {
      type: 'table',
      headers: ['Category', 'Functions', 'Use'],
      rows: [
        ['Ranking', 'ROW_NUMBER, RANK, DENSE_RANK', 'Top-N per group, dedupe ties'],
        ['Aggregate', 'SUM, AVG, COUNT OVER', 'Running totals, moving averages'],
        ['Value', 'LAG, LEAD, FIRST_VALUE, LAST_VALUE', 'Previous/next row, session gaps'],
        ['Distribution', 'NTILE, PERCENT_RANK, CUME_DIST', 'Quartiles, percentiles within partition'],
      ],
    },
    {
      type: 'list',
      items: [
        'OVER () — whole result set as one window.',
        'PARTITION BY — separate windows per group (like GROUP BY keys but keep rows).',
        'ORDER BY in OVER — required for ranking and frame semantics.',
        'Frame: ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW — running sum.',
        'DISTINCT in window aggregate (PG): COUNT(DISTINCT x) OVER — expensive, distinct sort per partition.',
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Rows[Input rows] --> Part[PARTITION BY dept]
  Part --> Sort[ORDER BY salary]
  Sort --> Frame[Frame clause]
  Frame --> Fn[Window function]
  Fn --> Out[Same row count output]`,
    caption: 'Each row gets a window; output preserves row granularity',
  },
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'Rank and top-N per group',
      code: `SELECT id, user_id, total_cents,
  ROW_NUMBER() OVER (
    PARTITION BY user_id ORDER BY created_at DESC
  ) AS rn
FROM orders;

-- Top 3 orders per user
SELECT * FROM (
  SELECT o.*, ROW_NUMBER() OVER (
    PARTITION BY user_id ORDER BY total_cents DESC
  ) AS rn FROM orders o
) t WHERE rn <= 3;`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Running total and LAG/LEAD',
      code: `SELECT created_at::date AS day,
  SUM(total_cents) AS daily,
  SUM(SUM(total_cents)) OVER (
    ORDER BY created_at::date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_total
FROM orders
GROUP BY created_at::date
ORDER BY day;

SELECT id, status,
  LAG(status) OVER (PARTITION BY user_id ORDER BY created_at) AS prev_status,
  LEAD(created_at) OVER (PARTITION BY user_id ORDER BY created_at) AS next_order_at
FROM orders;`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Replace correlated subquery with window',
      code: `-- Before: scalar subquery per row
-- After:
SELECT id, user_id, total_cents,
  total_cents - AVG(total_cents) OVER (PARTITION BY user_id) AS diff_from_avg
FROM orders;`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Execution: WindowAgg node in EXPLAIN — often sort + scan or hash partition.',
        'Default frame for RANGE: peer rows tied on ORDER BY included in frame.',
        'ROWS vs RANGE: ROWS counts physical rows; RANGE logical peers on sort key.',
        'Parallel query: partial window agg on workers, finalize on leader for some functions.',
        'Named windows: WINDOW w AS (PARTITION BY ...) reuse in SELECT.',
      ],
    },
  ],
  complexity: {
    average: 'O(n log n) sort per partition typical',
    worst: 'Large partitions + complex frames → memory in work_mem',
    notes: 'Often faster than correlated subqueries or self-joins for same logic.',
  },
  tradeoffs: {
    advantages: [
      'Per-row analytics without GROUP BY collapse',
      'Readable running totals, ranks, gaps',
      'Single query vs multiple subqueries',
    ],
    disadvantages: [
      'Cannot filter on window result in same SELECT WHERE — need subquery/CTE',
      'Sort cost on large partitions',
      'Frame semantics confuse (ROWS vs RANGE)',
    ],
    alternatives: [
      'GROUP BY + JOIN back for simple per-group aggregates only',
      'Correlated subqueries (usually slower)',
      'Application-side aggregation for tiny datasets',
    ],
    whenToUse: [
      'Top-N per group, running totals, moving averages',
      'Compare row to partition average or prior row',
      'Dedupe keeping one row per key (ROW_NUMBER = 1)',
    ],
    whenNotToUse: [
      'Simple whole-table aggregate — GROUP BY enough',
      'When filter needs window column in WHERE — wrap in outer query',
    ],
  },
  failureModes: [
    'WHERE rn = 1 without subquery — invalid (window not in WHERE).',
    'Non-deterministic ORDER BY in OVER → unstable ROW_NUMBER.',
    'Missing PARTITION BY — unintended global window.',
    'RANGE frame with non-numeric ORDER BY surprises with ties.',
    'Duplicate rows from JOIN before window — wrong partition counts.',
  ],
  production: {
    performance: [
      'Index on (partition_cols, order_cols) helps sort step',
      'Filter rows before window to shrink partitions',
    ],
    observability: ['WindowAgg in EXPLAIN; sort Method external → work_mem tune'],
  },
  interview: {
    expectations: [
      'OVER (PARTITION BY ORDER BY) syntax',
      'Difference GROUP BY vs window function',
      'Top-N per group pattern',
    ],
    commonQuestions: [
      'How get rank within each department?',
      'ROW_NUMBER vs RANK vs DENSE_RANK?',
      'Why can’t I WHERE on window column?',
    ],
    followUps: ['Frame clause ROWS BETWEEN', 'LAG for sessionization'],
    misconceptions: [
      'Window functions reduce row count like GROUP BY',
      'PARTITION BY optional always',
      'RANK and ROW_NUMBER same with ties',
    ],
    traps: ['Top-N without handling ties when business needs all tied rows'],
    strongSignals: [
      'Subquery wrapper for WHERE on rn',
      'Replaces correlated subquery example',
      'Frame clause precision',
    ],
  },
  keyTakeaways: [
    'Window functions keep all rows; add computed columns per partition.',
    'PARTITION BY groups windows; ORDER BY defines rank/frame order.',
    'Filter window results in outer query — not same-level WHERE.',
    'ROW_NUMBER/RANK/DENSE_RANK differ on ties.',
    'LAG/LEAD avoid self-joins for prev/next row.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Window function vs GROUP BY?',
      answerHint: 'GROUP BY collapses rows; window keeps each row with aggregate over partition.',
    },
    {
      level: 'intermediate',
      question: 'How to get top 1 order per user?',
      answerHint: 'ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY ...) in subquery WHERE rn=1.',
    },
    {
      level: 'advanced',
      question: 'ROWS vs RANGE frame difference?',
      answerHint: 'ROWS physical offset; RANGE logical peers sharing ORDER BY value in frame.',
    },
  ],
  flashcards: [
    { front: 'PARTITION BY', back: 'Separate window per group; rows not collapsed' },
    { front: 'Filter window column', back: 'Subquery/CTE — not WHERE in same SELECT' },
    { front: 'RANK vs ROW_NUMBER ties', back: 'RANK skips numbers; ROW_NUMBER unique per row' },
  ],
  quickRevision: [
    'OVER (PARTITION ORDER frame)',
    'Keep all rows vs GROUP BY',
    'Top-N: ROW_NUMBER + outer filter',
    'LAG/LEAD prev/next',
    'Running sum: UNBOUNDED PRECEDING',
    'WHERE cannot use window alias',
    'WindowAgg + sort cost',
  ],
}

export const content = windowFunctionsContent
