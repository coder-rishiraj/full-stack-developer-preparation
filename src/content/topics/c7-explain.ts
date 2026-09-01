import type { TopicContent } from '@/domain/types'

export const explainContent: TopicContent = {
  whatIsIt:
    'EXPLAIN shows PostgreSQL\'s planned execution strategy without running the query (except EXPLAIN ANALYZE). Options like BUFFERS, VERBOSE, and JSON format expose scans, joins, costs, and actual row counts for performance diagnosis.',
  whyExists:
    'Slow queries need evidence, not guesses. EXPLAIN bridges SQL text to planner decisions — revealing missing indexes, bad joins, sort spills, and estimate vs actual row mismatches before changing schema or SQL.',
  mentalModel:
    'EXPLAIN = dry-run blueprint. EXPLAIN ANALYZE = run query + annotate plan with actual times and rows. Compare estimated rows vs actual rows at each node — large gaps mean bad stats or correlated predicates.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Option', 'Purpose'],
      rows: [
        ['EXPLAIN', 'Plan only — no execution'],
        ['EXPLAIN ANALYZE', 'Execute + actual time, rows, loops'],
        ['BUFFERS', 'Shared/local/temp block hits per node'],
        ['VERBOSE', 'Output column lists, schema-qualified names'],
        ['FORMAT JSON', 'Machine-readable for tools (pev, explain.depesz.com)'],
        ['SETTINGS', 'Show modified planner GUCs affecting plan'],
      ],
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Run EXPLAIN (ANALYZE, BUFFERS) on representative query + parameters.',
        'Top node total time ≈ query duration (minus client overhead).',
        'Check highest actual time nodes — seq scan on big table, sort external, hash batch.',
        'Compare rows estimated vs actual — >10× off → ANALYZE or extended stats.',
        'Verify index used on filter/join columns; unexpected seq scan → index or selectivity.',
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Q[SQL + EXPLAIN ANALYZE] --> Exec[Execute query]
  Exec --> Plan[Instrumented plan tree]
  Plan --> Est[Estimated rows/cost]
  Plan --> Act[Actual rows/time/buffers]
  Act --> Diagnose[Find mismatch nodes]`,
    caption: 'ANALYZE executes and records per-node actuals',
  },
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'Standard production diagnosis',
      code: `EXPLAIN (ANALYZE, BUFFERS, VERBOSE, FORMAT TEXT)
SELECT o.id, o.total_cents, u.email
FROM orders o
JOIN users u ON u.id = o.user_id
WHERE o.status = 'shipped'
  AND o.created_at >= NOW() - INTERVAL '90 days'
ORDER BY o.created_at DESC
LIMIT 50;`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Reading output — red flags',
      code: `-- Look for:
-- Seq Scan on orders  (rows=5000000 ...)  -- huge seq scan
--   Filter: (status = 'shipped'::text)
--   Rows Removed by Filter: 4900000       -- bad selectivity estimate
--
-- Sort  (cost=... rows=100000)
--   Sort Method: external merge  Disk: 20480kB  -- work_mem too low
--
-- Nested Loop  (actual time=0.05..85000 rows=100000 loops=1)
--   -> Seq Scan on large_table
--   -> Index Scan ...  (loops=100000)  -- nested loop disaster`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Hypothetical indexes (PG extension)',
      code: `-- With hypopg extension:
SELECT * FROM hypopg_create_index('CREATE INDEX ON orders (status, created_at DESC)');
EXPLAIN SELECT ... ; -- see if plan improves without building index
SELECT hypopg_reset();`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'ANALYZE adds timing overhead — acceptable on staging; careful on destructive DML in prod.',
        'Buffers: shared hit = cache; read = disk; temp read/write = sort/hash spill.',
        'Planning time vs execution time shown separately in PG 13+.',
        'Parallel workers show under Gather; leader vs worker time split.',
        'Generic EXPLAIN on prepared stmt may differ from EXECUTE with literals.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Precise visibility into planner choices',
      'Estimate vs actual mismatch detection',
      'BUFFERS shows cache vs disk I/O',
    ],
    disadvantages: [
      'ANALYZE runs real query — side effects on INSERT/UPDATE/DELETE',
      'Cold cache first run misleading vs warm production',
      'Text output hard to read on deep plans',
    ],
    alternatives: [
      'auto_explain in postgresql.conf for automatic logging',
      'pg_stat_statements for aggregated query stats',
      'Visualizers: explain.dalibo.com, pev2',
    ],
    whenToUse: [
      'Every slow query investigation',
      'Before/after index validation',
      'Load test staging with production-like data volume',
    ],
    whenNotToUse: [
      'EXPLAIN ANALYZE DELETE without transaction rollback on prod',
      'Tiny tables where plan irrelevant',
    ],
  },
  failureModes: [
    'EXPLAIN without ANALYZE — estimates only, may lie.',
    'Testing on empty dev DB — plan unlike production.',
    'Different bind parameters change plan — test with real values.',
    'Ignoring Rows Removed by Filter — hidden seq scan cost.',
    'External sort on disk not noticed without BUFFERS.',
  ],
  production: {
    performance: ['Use read replica or staging clone for ANALYZE on heavy SELECTs'],
    observability: [
      'auto_explain.log_min_duration = 500ms',
      'log_line_prefix with application_name',
    ],
  },
  interview: {
    expectations: [
      'EXPLAIN vs EXPLAIN ANALYZE difference',
      'Identify seq scan, nested loop, hash join in output',
      'Estimated vs actual rows significance',
    ],
    commonQuestions: [
      'How debug slow PostgreSQL query?',
      'What does BUFFERS show?',
      'Sort Method external merge means?',
    ],
    followUps: ['When run ANALYZE on table', 'Index Only Scan conditions'],
    misconceptions: [
      'Low cost in EXPLAIN means fast without ANALYZE',
      'EXPLAIN runs the query',
      'One EXPLAIN enough after data doubles',
    ],
    traps: ['Running EXPLAIN ANALYZE UPDATE on production without WHERE limit'],
    strongSignals: [
      'BUFFERS + external merge → work_mem',
      'Estimate/actual 100× off → stats',
      'loops= outer_rows on inner node',
    ],
  },
  keyTakeaways: [
    'EXPLAIN = plan; EXPLAIN ANALYZE = execute + measure.',
    'Always use ANALYZE, BUFFERS for real diagnosis.',
    'Mismatch estimated vs actual rows → statistics problem.',
    'Highest actual time node is optimization target.',
    'Test EXPLAIN on production-scale data and parameters.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'EXPLAIN vs EXPLAIN ANALYZE?',
      answerHint: 'EXPLAIN plan only; ANALYZE runs query and shows actual times and row counts.',
    },
    {
      level: 'intermediate',
      question: 'Estimated 100 rows, actual 1M — what next?',
      answerHint: 'Run ANALYZE; check stats, correlated columns, extended statistics; review predicate.',
    },
    {
      level: 'advanced',
      question: 'Sort Method external merge Disk — cause and fix?',
      answerHint: 'Sort exceeded work_mem; spilled to disk; increase work_mem or reduce rows sorted via index.',
    },
  ],
  flashcards: [
    { front: 'EXPLAIN ANALYZE', back: 'Executes query; actual time, rows, loops per node' },
    { front: 'BUFFERS shared read', back: 'Blocks read from disk (not in cache)' },
    { front: 'Rows Removed by Filter', back: 'Seq scan read rows then filtered — costly' },
  ],
  quickRevision: [
    'ANALYZE, BUFFERS standard',
    'Est vs actual rows',
    'Seq scan red flag large table',
    'External merge = work_mem',
    'Nested loop high loops',
    'auto_explain prod',
    'Test prod-scale data',
  ],
}

export const content = explainContent
