import type { TopicContent } from '@/domain/types'

export const queryOptimizationContent: TopicContent = {
  whatIsIt:
    'Query optimization is the systematic process of reducing database query latency and resource use — through correct indexes, accurate statistics, SQL rewrites, schema design, connection pooling, and configuration tuned to workload and hardware.',
  whyExists:
    'ORM-generated and ad-hoc SQL often degrade as data grows. Optimization turns unacceptable p99 latency into sustainable throughput without blindly scaling hardware — fixing root causes in access paths and query shape.',
  mentalModel:
    'Measure → EXPLAIN ANALYZE hot path → fix biggest cost node → verify. Loop: index for selective filters, rewrite to reduce rows early, refresh stats, tune memory for sorts/hashes. Avoid premature micro-optimizations on cold queries.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Identify hot queries: pg_stat_statements, APM traces, slow query log.',
        'EXPLAIN (ANALYZE, BUFFERS) with production-like parameters and volume.',
        'Fix access path: indexes matching WHERE + JOIN + ORDER BY left-prefix.',
        'Reduce rows early: filter in subquery/CTE, avoid SELECT *, limit JOIN width.',
        'Update statistics: ANALYZE; extended stats for correlated columns.',
        'Configuration: work_mem, shared_buffers, effective_cache_size, random_page_cost.',
        'Re-test; watch plan regression; drop unused indexes.',
      ],
    },
    {
      type: 'table',
      headers: ['Symptom', 'Common fix'],
      rows: [
        ['Seq scan on large filtered table', 'B-tree index on filter columns; partial index'],
        ['Nested loop millions loops', 'Index on inner join key; hash join via stats fix'],
        ['External sort/hash', 'Increase work_mem; index for ORDER BY; fewer rows'],
        ['Slow aggregation', 'Pre-aggregate materialized view; BRIN on time series'],
        ['Lock waits', 'Shorter transactions; SKIP LOCKED; index reduce scan time'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Observe[pg_stat_statements / APM] --> Explain[EXPLAIN ANALYZE]
  Explain --> Index[Index / partial / covering]
  Explain --> Rewrite[SQL rewrite]
  Explain --> Stats[ANALYZE / extended stats]
  Explain --> Config[work_mem / costs]
  Index --> Verify[Re-measure p95/p99]
  Rewrite --> Verify
  Stats --> Verify
  Config --> Verify`,
    caption: 'Measure-driven optimization loop',
  },
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'Index for filter + sort',
      code: `-- Query:
SELECT id, total_cents FROM orders
WHERE user_id = 42 AND status = 'open'
ORDER BY created_at DESC LIMIT 20;

-- Supporting index (left-prefix matches filter + sort):
CREATE INDEX CONCURRENTLY idx_orders_user_status_created
  ON orders (user_id, status, created_at DESC)
  WHERE status = 'open';  -- partial if mostly closed orders`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Rewrite — filter before join',
      code: `-- Slow: join then filter
SELECT u.email, o.total_cents
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE o.created_at >= '2026-01-01';

-- Better: reduce orders first
SELECT u.email, recent.total_cents
FROM (
  SELECT user_id, total_cents FROM orders
  WHERE created_at >= '2026-01-01'
) recent
JOIN users u ON u.id = recent.user_id;`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Find missing index candidates',
      code: `SELECT schemaname, relname, seq_scan, seq_tup_read,
       idx_scan, n_live_tup
FROM pg_stat_user_tables
WHERE seq_scan > 1000 AND n_live_tup > 10000
ORDER BY seq_tup_read DESC;

SELECT indexrelname, idx_scan, pg_size_pretty(pg_relation_size(indexrelid))
FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND schemaname = 'public';`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Covering index (INCLUDE) enables index-only scans — avoids heap fetches.',
        'Join order determined by table sizes and selectivity — multi-column stats matter.',
        'Partition pruning skips child tables when WHERE matches partition key.',
        'Prepared statement plan caching — spike when parameter crosses selectivity threshold.',
        'Parallel query speedup limited by gather and serial portions.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Order-of-magnitude gains vs hardware scale-up',
      'Lower CPU and I/O cost at same QPS',
      'Predictable p99 under load',
    ],
    disadvantages: [
      'Indexes trade write amplification and storage',
      'Over-indexing confuses planner and slows migrations',
      'Optimization without measurement wastes effort',
    ],
    alternatives: [
      'Read replicas for read-heavy offload',
      'Caching layer (Redis) for hot keys',
      'Denormalization / materialized views for reports',
    ],
    whenToUse: [
      'Top queries by total_time in pg_stat_statements',
      'User-facing latency SLO breaches',
      'Before scaling DB instance tier',
    ],
    whenNotToUse: [
      'One-off admin query run monthly',
      'When problem is network or N+1 in app layer',
    ],
  },
  failureModes: [
    'Index every column — writes crawl, planner confused.',
    'Optimize on 1000-row dev dataset — prod still seq scans millions.',
    'Increase work_mem globally — OOM under concurrency.',
    'Hint or disable seqscan masking missing ANALYZE.',
    'Fix SQL without fixing ORM N+1 generating 1000 queries.',
  ],
  production: {
    performance: [
      'pg_stat_statements: total_time = calls * mean_time priority',
      'CREATE INDEX CONCURRENTLY in prod',
    ],
    scalability: ['Connection pool sized to CPU; not unbounded connections'],
    observability: [
      'Track plan changes after deploy',
      'Index usage and bloat monitoring',
    ],
    cost: ['Right-size instance after query fix — often downgrade possible'],
  },
  interview: {
    expectations: [
      'Structured approach: measure, EXPLAIN, fix, verify',
      'Index design for query pattern',
      'Stats and selectivity role',
    ],
    commonQuestions: [
      'How optimize slow PostgreSQL query?',
      'When add composite vs partial index?',
      'pg_stat_statements usage?',
    ],
    followUps: ['Covering index', 'Materialized view refresh strategy'],
    misconceptions: [
      'More RAM always fixes slow queries',
      'EXPLAIN cost equals milliseconds',
      'One index fits all queries on table',
    ],
    traps: ['Suggesting sharding before index and EXPLAIN'],
    strongSignals: [
      'pg_stat_statements driven prioritization',
      'Partial index for skewed status columns',
      'Distinguish DB vs app N+1',
    ],
  },
  keyTakeaways: [
    'Optimize measured hot queries, not random SQL.',
    'EXPLAIN ANALYZE + BUFFERS finds bottleneck node.',
    'Indexes match WHERE, JOIN, ORDER BY patterns.',
    'ANALYZE and extended stats fix bad estimates.',
    'Balance read indexes vs write cost; drop unused.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'First steps for slow query?',
      answerHint: 'Identify query in pg_stat_statements; EXPLAIN ANALYZE; check scans and row estimates.',
    },
    {
      level: 'intermediate',
      question: 'Partial index use case?',
      answerHint: 'Query always filters subset (active=true); smaller index, targeted, faster writes than full.',
    },
    {
      level: 'advanced',
      question: 'Query fast on dev, slow on prod — why?',
      answerHint: 'Data volume/selectivity differ; stats; cold cache; different parameters; missing prod indexes.',
    },
  ],
  flashcards: [
    { front: 'pg_stat_statements priority', back: 'total_time = calls × mean_time' },
    { front: 'Covering index', back: 'INCLUDE columns → index-only scan possible' },
    { front: 'Filter early', back: 'Reduce rows before join to shrink hash/sort' },
  ],
  quickRevision: [
    'Measure hot queries first',
    'EXPLAIN ANALYZE BUFFERS',
    'Index matches predicates + sort',
    'ANALYZE stale stats',
    'Partial / covering indexes',
    'work_mem for sorts',
    'Drop idx_scan=0 indexes',
  ],
}

export const content = queryOptimizationContent
