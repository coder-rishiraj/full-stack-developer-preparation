import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Table partitioning splits one logical PostgreSQL table into physical partitions by range, list, or hash key — improving query pruning, maintenance windows, and archival. PostgreSQL declarative partitioning (10+) uses PARTITION BY with attached child tables inheriting constraints and indexes.',
  whyExists:
    'Single billion-row tables slow vacuum, index rebuilds, and queries scanning full history. Partitioning lets queries touch only relevant months (partition pruning), drop old data via DROP TABLE partition instead of DELETE millions of rows, and parallelize maintenance per partition.',
  mentalModel:
    'Filing cabinet with monthly drawers. Query for March 2025 opens only that drawer (partition pruning). Old drawer detaches and archives to cold storage. Parent table is routing facade; rows live in child partitions.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Strategy', 'Key', 'Use case'],
      rows: [
        ['RANGE', 'created_at, id ranges', 'Time-series events, logs, orders by month'],
        ['LIST', 'region, tenant_id discrete values', 'Multi-tenant by region code'],
        ['HASH', 'hash(user_id) mod N', 'Even spread when no natural range'],
        ['Sub-partition', 'RANGE then HASH', 'Large time partitions further split'],
      ],
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Declarative range partition by month',
      code: `CREATE TABLE orders (
  id BIGSERIAL,
  created_at TIMESTAMPTZ NOT NULL,
  customer_id BIGINT,
  amount NUMERIC
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2025_01 PARTITION OF orders
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE INDEX ON orders (customer_id, created_at);`,
    },
    {
      type: 'list',
      items: [
        'Planner partition pruning: WHERE created_at >= ... eliminates irrelevant partitions.',
        'Unique constraints must include partition key columns.',
        'CREATE TABLE ... PARTITION OF attaches child; DETACH CONCURRENTLY for zero-downtime archival.',
        'pg_partman extension automates partition creation and retention.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Audit log 500M rows: partition by month. Queries last 7 days hit 1–2 partitions. Retention policy drops partitions older than 13 months via scheduled job — instant vs DELETE timeout. BRIN index on created_at within each partition for append-only scans.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Constraint exclusion pre-10 evolved into declarative partition bounds on child tables.',
        'Default partition catches rows not matching any bound — watch for catch-all bloat.',
        'Foreign keys referencing partitioned table supported PG11+ with limitations.',
        'Parallel query can scan multiple partitions concurrently.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Partition pruning faster queries', 'Fast archival DROP partition', 'Smaller indexes per partition', 'Targeted vacuum/maintenance'],
    disadvantages: ['Partition key must appear in queries for pruning', 'Unique index complexity', 'Operational overhead creating future partitions'],
    alternatives: ['Sharding across DB instances', 'Archive table + hot table split', 'TimescaleDB hypertables'],
    whenToUse: ['Time-series with retention', 'Very large table with predictable access patterns'],
    whenNotToUse: ['Small tables', 'Queries without partition key in WHERE — full scan all partitions'],
  },
  failureModes: [
    'Missing partition for incoming row — insert fails',
    'Query without partition key — scans every partition',
    'Unique on id only without partition key — not allowed',
    'Default partition absorbs everything — becomes new monolith',
    'Forgot to create next month partition before rollover',
  ],
  production: {
    performance: ['Always filter on partition key in hot queries', 'BRIN on append-only time columns'],
    maintainability: ['pg_partman or cron CREATE PARTITION ahead of time', 'Document retention DROP schedule'],
    reliability: ['Monitor default partition row count', 'DETACH CONCURRENTLY before archive'],
    cost: ['Move cold partitions to cheaper tablespaces or export to S3'],
  },
  interview: {
    expectations: ['RANGE vs HASH', 'Partition pruning', 'Retention via DROP', 'Unique constraint rules'],
    commonQuestions: ['When partition PostgreSQL table?', 'Archive old data strategy?'],
    followUps: ['Partition vs sharding?', 'Cross-partition query cost?'],
    misconceptions: ['Partitioning always speeds queries', 'Any column works as partition key'],
    traps: ['Partitioning without query pattern alignment'],
    strongSignals: ['Monthly range + pg_partman', 'Pruning in EXPLAIN', 'DETACH for archival'],
  },
  keyTakeaways: [
    'Partition splits logical table into physical child tables by key.',
    'Query must include partition key for pruning benefit.',
    'DROP partition for retention beats mass DELETE.',
    'Unique indexes must include partition key.',
    'Automate future partition creation in production.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why partition a table?', answerHint: 'Prune scans, faster maintenance, easy archival of old data chunks.' },
    { level: 'intermediate', question: 'RANGE vs HASH partitioning?', answerHint: 'RANGE for time/ordered data and retention; HASH for even spread without natural range.' },
    { level: 'advanced', question: 'Delete 1 year of audit logs efficiently?', answerHint: 'DETACH or DROP monthly partitions; avoid DELETE WHERE date < ... on monolithic table.' },
  ],
  flashcards: [
    { front: 'Partition pruning', back: 'Planner skips partitions not matching WHERE on partition key' },
    { front: 'Unique constraint rule', back: 'Must include all partition key columns' },
    { front: 'Default partition', back: 'Catches unmatched rows — monitor for bloat' },
    { front: 'pg_partman', back: 'Extension automating partition create/drop lifecycle' },
  ],
  quickRevision: ['PARTITION BY RANGE/LIST/HASH', 'Pruning needs key in WHERE', 'DROP > DELETE for retention', 'Automate future partitions', 'Unique includes partition key'],
}
