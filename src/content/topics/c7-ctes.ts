import type { TopicContent } from '@/domain/types'

export const ctesContent: TopicContent = {
  whatIsIt:
    'Common Table Expressions (CTEs) are named temporary result sets in a WITH clause preceding SELECT/INSERT/UPDATE/DELETE — improving readability, enabling recursion, and allowing reference of subquery results multiple times in one statement.',
  whyExists:
    'Deeply nested subqueries are hard to read and maintain. CTEs name intermediate steps (active_users, monthly_totals) like variables in SQL. Recursive CTEs express hierarchies (org charts, graph paths) declaratively.',
  mentalModel:
    'WITH step1 AS (...), step2 AS (SELECT * FROM step1 WHERE ...) SELECT * FROM step2. Each CTE is evaluated and materialized (PostgreSQL ≤11 always materialized; PG12+ inlines small CTEs unless NOT MATERIALIZED hint). Recursive: anchor UNION ALL recursive part referencing CTE name.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Non-recursive: WITH cte AS (subquery) SELECT ... FROM cte.',
        'Multiple CTEs comma-separated; later CTEs reference earlier ones.',
        'Recursive: WITH RECURSIVE tree AS (base UNION ALL SELECT ... FROM tree JOIN ...).',
        'DML WITH: WITH deleted AS (DELETE ... RETURNING *) SELECT * FROM deleted.',
        'PostgreSQL 12+: AS MATERIALIZED / AS NOT MATERIALIZED control optimization.',
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  WITH[WITH clause] --> CTE1[CTE step1]
  CTE1 --> CTE2[CTE step2]
  CTE2 --> Main[Main query]
  Main --> Out[Result]`,
    caption: 'CTEs chain before main statement body',
  },
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'Readable multi-step report',
      code: `WITH active_users AS (
  SELECT id, email FROM users WHERE deleted_at IS NULL
),
recent_orders AS (
  SELECT user_id, SUM(total_cents) AS spend
  FROM orders
  WHERE created_at >= NOW() - INTERVAL '30 days'
  GROUP BY user_id
)
SELECT u.email, COALESCE(r.spend, 0) AS spend_30d
FROM active_users u
LEFT JOIN recent_orders r ON r.user_id = u.id
ORDER BY spend_30d DESC
LIMIT 100;`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Recursive CTE — org hierarchy',
      code: `WITH RECURSIVE subordinates AS (
  SELECT id, manager_id, name, 1 AS depth
  FROM employees
  WHERE id = 42
  UNION ALL
  SELECT e.id, e.manager_id, e.name, s.depth + 1
  FROM employees e
  INNER JOIN subordinates s ON e.manager_id = s.id
)
SELECT * FROM subordinates ORDER BY depth;`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'DML with CTE — delete and audit',
      code: `WITH expired AS (
  DELETE FROM sessions
  WHERE expires_at < NOW()
  RETURNING id, user_id
)
INSERT INTO session_audit (session_id, user_id, action)
SELECT id, user_id, 'expired' FROM expired;`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'PostgreSQL 12+ CTE inlining — optimizer may merge into main query (faster) or materialize (once).',
        'RECURSIVE requires UNION (not UNION ALL only at top — actually UNION ALL typical) with non-recursive anchor.',
        'Worktable for recursion — cycle detection via path array or LIMIT depth.',
        'CTE scope limited to single statement — not session-persistent like temp table.',
        'MATERIALIZED CTE forces storage when referenced multiple times beneficial.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Clear step-by-step SQL',
      'Recursive hierarchies in pure SQL',
      'RETURNING + DML chaining',
    ],
    disadvantages: [
      'Old PG always materialized CTEs — perf surprise pre-12',
      'Over-CTEing simple queries adds noise',
    ],
    alternatives: [
      'Subquery in FROM — equivalent, less readable',
      'Temp tables for multi-statement reuse in session',
      'Views for reusable named queries',
    ],
    whenToUse: [
      'Multi-step analytics in one query',
      'Recursive trees/graphs depth-limited',
      'DELETE/UPDATE … RETURNING pipeline',
    ],
    whenNotToUse: [
      'Reuse across transactions — temp table or view',
      'Simple single subquery — inline fine',
    ],
  },
  failureModes: [
    'Infinite recursion — missing termination in recursive part.',
    'Cycle in graph recursion — infinite loop without cycle guard.',
    'Assuming CTE always materialized (PG12+ inlines — perf change).',
    'Recursive depth explosion — no LIMIT on breadth-first.',
    'Mutually referencing CTEs incorrectly ordered.',
  ],
  production: {
    performance: [
      'EXPLAIN ANALYZE CTE — check materialize vs inline',
      'Use MATERIALIZED when referenced twice and expensive',
    ],
    maintainability: ['Name CTEs by business meaning not step1/step2'],
  },
  interview: {
    expectations: [
      'WITH syntax and readability benefit',
      'Recursive CTE structure anchor + recursive member',
      'CTE vs subquery vs temp table',
    ],
    commonQuestions: [
      'What is a CTE?',
      'Write recursive employee hierarchy?',
      'CTE vs subquery performance PostgreSQL?',
    ],
    followUps: [
      'Detect cycle in recursive CTE?',
      'MATERIALIZED hint when?',
    ],
    misconceptions: [
      'CTE is always optimization fence in modern PostgreSQL',
      'Recursive CTE only for trees — works for graphs with care',
    ],
    traps: ['Recursive CTE without base case termination'],
    strongSignals: [
      'Anchor UNION ALL recursive join pattern',
      'DML WITH RETURNING chain',
      'PG12 inlining awareness',
    ],
  },
  keyTakeaways: [
    'WITH names intermediate result sets.',
    'Recursive CTE: anchor + UNION ALL recursive part.',
    'PG12+ may inline CTE — check EXPLAIN.',
    'Use for readability and single-statement DML pipelines.',
    'Temp tables for cross-statement reuse.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'CTE syntax?',
      answerHint: 'WITH name AS (query) SELECT ... FROM name;',
    },
    {
      level: 'intermediate',
      question: 'Recursive CTE components?',
      answerHint: 'WITH RECURSIVE: anchor query UNION ALL recursive query referencing CTE.',
    },
    {
      level: 'advanced',
      question: 'CTE vs temp table?',
      answerHint: 'CTE single statement scope; temp table persists session, stats, indexes possible.',
    },
  ],
  flashcards: [
    { front: 'CTE keyword', back: 'WITH ... AS (subquery)' },
    { front: 'Recursive structure', back: 'Anchor UNION ALL recursive member' },
    { front: 'PG12 CTE change', back: 'Optimizer may inline instead of always materialize' },
  ],
  quickRevision: [
    'WITH step AS (...)',
    'Multiple CTEs chained',
    'RECURSIVE anchor + union',
    'DML WITH RETURNING',
    'MATERIALIZED hint PG',
    'Inline vs materialize EXPLAIN',
    'Temp table cross-statement',
  ],
}

export const content = ctesContent
