import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Data partitioning divides a dataset into segments (partitions) by key, range, time, or hash for manageability, performance, and parallelism. Sharding is partitioning across databases; within one DB, table partitioning splits rows by range/list/hash. Same concept, different scope.',
  whyExists:
    'Monolithic tables slow maintenance (vacuum, index rebuild), exceed memory for indexes, and create hotspots. Partitioning enables partition pruning (query touches subset), TTL drops by dropping old partitions, and parallel ops.',
  mentalModel:
    'Organize warehouse aisles by category so you visit one aisle not whole warehouse. Query with partition key in WHERE skips irrelevant partitions. Align partition key with access pattern.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Type', 'Split by', 'Example'],
      rows: [
        ['Range', 'Time, ID ranges', 'orders_2026_08 monthly table'],
        ['Hash', 'hash(key) mod N', 'Even spread in Postgres HASH partition'],
        ['List', 'Explicit values', 'region IN (US, EU) partitions'],
        ['Horizontal shard', 'Application router', 'user_id → DB node'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Time-based partition pruning',
      diagram: `flowchart TB
  Q["Query WHERE created_at >= Aug 1"]
  Q --> P08[Partition Aug]
  Q -.skip.-> P07[Partition Jul]
  Q -.skip.-> P06[Partition Jun]`,
    },
    {
      type: 'list',
      items: [
        'Postgres declarative partitioning: PARENT → child tables',
        'Drop partition faster than DELETE millions rows',
        'Cross-partition queries still work but slower — avoid hot path',
        'Shard = partition at infrastructure level across servers',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'Postgres monthly range partition',
      code: `CREATE TABLE events (
  id bigserial,
  created_at timestamptz NOT NULL,
  payload jsonb
) PARTITION BY RANGE (created_at);

CREATE TABLE events_2026_08 PARTITION OF events
  FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');`,
    },
  ],
  tradeoffs: {
    advantages: ['Pruning speed', 'Easy archival drop', 'Parallel maintenance', 'Shard scale-out path'],
    disadvantages: ['Wrong key → full scan all partitions', 'Cross-partition constraints tricky', 'Rebalance effort for hash shards'],
    alternatives: ['Single table + indexes until proven slow', 'Archive cold data to warehouse'],
    whenToUse: ['Time-series events', 'Multi-tenant by tenant_id', 'Tables >100M rows'],
    whenNotToUse: ['Small tables', 'Queries without partition key in filter'],
  },
  failureModes: [
    'Queries missing partition key scan all children',
    'Uneven range partitions (all traffic this month)',
    'Too many small partitions metadata overhead',
    'Global unique constraint across shards hard',
  ],
  production: {
    performance: ['Always filter on partition key in hot queries', 'Auto-create future time partitions'],
    scalability: ['Combine time partition + hash sub-partition for huge scale'],
    maintainability: ['Cron attach new monthly partition', 'Archive old to S3 then DETACH DROP'],
    observability: ['Per-partition size and scan counts'],
    cost: ['Drop old partitions vs paying storage for DELETE churn'],
  },
  interview: {
    expectations: ['Partition pruning', 'Range vs hash', 'Shard vs table partition'],
    commonQuestions: ['Partition logs table?', 'When shard vs partition?'],
    followUps: ['Multi-level partitioning?', 'Rebalance hash shards?'],
    misconceptions: ['Partitioning always speeds queries without key in WHERE'],
    traps: ['Partition by low-cardinality status alone'],
    strongSignals: ['Time + tenant composite key', 'Detach/drop archival playbook'],
  },
  keyTakeaways: [
    'Partition key must match query filters for pruning.',
    'Range/time partitions excel for TTL and archival.',
    'Hash spreads load; range helps time queries.',
    'Sharding = partitioning across DB servers.',
    'Avoid cross-partition hot paths in OLTP.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Partition pruning?', answerHint: 'Optimizer skips partitions not matching WHERE on partition key.' },
    { level: 'intermediate', question: 'Delete 1 year of logs efficiently?', answerHint: 'Monthly partitions DROP TABLE vs DELETE millions rows.' },
    { level: 'advanced', question: 'tenant_id + created_at partitioning strategy?', answerHint: 'LIST/HASH tenant sub-partitions or composite; prune time within tenant shards.' },
  ],
  flashcards: [
    { front: 'Partition pruning', back: 'Query reads only relevant partitions when WHERE matches key' },
    { front: 'Range partition', back: 'Split by intervals e.g. monthly timestamps' },
    { front: 'Shard vs partition', back: 'Shard cross machines; partition can be within one DB' },
    { front: 'DROP partition', back: 'Fast archival vs row-by-row DELETE' },
  ],
  quickRevision: [
    'Key aligns with queries',
    'Time partitions for TTL',
    'Hash for even spread',
    'Pruning needs WHERE key',
    'Shard = distributed partition',
  ],
  systemDesign: {
    problem: 'Store 5 years of audit events (500B rows) queryable by tenant and last 90 days hot in Postgres.',
    requirements: {
      functional: ['Insert events', 'Query tenant last 90 days', 'Archive older'],
      nonFunctional: ['Insert 50k/s', 'Query p99 < 200ms tenant scope', 'Drop >1yr partitions'],
    },
    scaleAssumptions: ['10k tenants', '50k insert/s', '90 day hot window'],
    capacityEstimates: ['Monthly range partitions; optional HASH tenant subpartition top N tenants'],
    api: [{ type: 'paragraph', text: 'INSERT events; SELECT WHERE tenant_id AND created_at range' }],
    dataModel: [{ type: 'list', items: ['events PARTITION BY RANGE (created_at)', 'INDEX (tenant_id, created_at DESC) per child'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'Monthly partitions auto-created; cron detach >12mo to S3 Parquet then DROP; queries always include created_at window.' }],
    diagram: {
      mermaid: `flowchart TB
  Inserts --> P_cur[Current month partition]
  Query --> P_cur
  Query --> P_prev[Previous months in 90d window]
  Archive --> S3[(S3 cold)]
  Old[Partitions >12mo] --> DROP[DROP after archive]`,
      caption: 'Rolling time partitions with cold archive',
    },
    dataFlow: ['Insert to current partition', 'Query prunes to 90d partitions', 'Archive job cold storage'],
    storage: ['Postgres hot partitions + S3 cold'],
    caching: ['None for audit integrity'],
    asyncProcessing: ['Archive ETL nightly'],
    scaling: ['When single partition insert bound → split month to daily or hash subpartition'],
    consistency: ['Strong per insert on primary'],
    reliability: ['Replicated primary; partitions inherit'],
    failureScenarios: ['Missing future partition insert fail — automation creates ahead'],
    security: ['tenant_id mandatory filter enforced in API'],
    observability: ['Partition sizes, insert rate per partition'],
    bottlenecks: ['Mega-tenant fills partition — dedicated tenant partition LIST'],
    alternatives: ['ClickHouse for analytics audit'],
    tradeoffs: ['Postgres vs specialized column store for old data'],
    interviewFollowUps: ['Cross-tenant admin query?', 'Legal hold on partition drop?'],
    evolution: [
      { stage: '1. Simple design', description: 'Single events table.', bottleneck: 'Size and vacuum.' },
      { stage: '2. Improve', description: 'Monthly partitions.', bottleneck: 'Hot month write IOPS.' },
      { stage: '3. Improve', description: 'Archive to S3 + DROP.', bottleneck: 'Mega-tenant skew.' },
      { stage: '4. Scale further', description: 'Tenant-specific partitions + ClickHouse analytics.', bottleneck: 'Dual query paths.' },
    ],
  },
}
