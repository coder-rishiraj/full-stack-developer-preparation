import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Relational databases (RDBMS) store data in tables with rows and columns, enforcing schemas, relationships via foreign keys, and ACID transactions through SQL. Examples: PostgreSQL, MySQL, Oracle. Strong fit for structured data, joins, and integrity constraints.',
  whyExists:
    'Business data is relational: orders have line items, users have roles. SQL and relational model provide declarative queries, normalization to reduce duplication, and transactional guarantees decades of tooling rely on.',
  mentalModel:
    'Spreadsheets with strict types and links between sheets. Query with JOIN; database enforces rules (unique email, order total matches lines). One primary node often handles writes; indexes speed lookups like book indexes.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Feature', 'Benefit', 'Watch out'],
      rows: [
        ['Schema', 'Data validation at rest', 'Migrations needed for change'],
        ['ACID transactions', 'Atomic multi-row updates', 'Lock contention hotspots'],
        ['JOINs', 'Flexible ad-hoc queries', 'N+1 ORM queries, missing indexes'],
        ['Indexes (B-tree)', 'Fast point/range lookups', 'Write amplification, wrong index choice'],
        ['Normalization', 'Less redundancy', 'Many joins → denormalize selectively'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Simple relational schema',
      diagram: `erDiagram
  USERS ||--o{ ORDERS : places
  ORDERS ||--|{ ORDER_ITEMS : contains
  PRODUCTS ||--o{ ORDER_ITEMS : referenced
  USERS { uuid id PK; string email UK }
  ORDERS { uuid id PK; uuid user_id FK; timestamp created_at }
  ORDER_ITEMS { uuid order_id FK; uuid product_id FK; int qty }`,
    },
  ],
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'Transactional inventory decrement',
      code: `BEGIN;
UPDATE products SET stock = stock - 1
WHERE id = 'p-99' AND stock > 0;
INSERT INTO order_items (order_id, product_id, qty) VALUES ('o-1', 'p-99', 1);
COMMIT;`,
    },
  ],
  tradeoffs: {
    advantages: ['Strong consistency and constraints', 'Mature ecosystem', 'Complex queries with SQL'],
    disadvantages: ['Vertical scale limits on single write primary', 'Schema rigidity', 'Sharding complexity'],
    alternatives: ['Document DB for flexible schema', 'Warehouse for analytics'],
    whenToUse: ['OLTP with relationships', 'Financial records', 'Need transactions + joins'],
    whenNotToUse: ['Unstructured blob-heavy with no relations', 'Extreme write scale single key without shard plan'],
  },
  failureModes: [
    'Missing index → full table scan at scale',
    'Long transactions blocking others',
    'Migration lock on large table',
    'Connection pool exhaustion',
    'Replication lag on read replica used for critical read',
  ],
  production: {
    performance: ['Index for WHERE/JOIN columns', 'EXPLAIN plans', 'Connection pooling (PgBouncer)'],
    scalability: ['Read replicas, then sharding (Citus), vertical first'],
    reliability: ['Backups + PITR', 'HA primary-standby'],
    security: ['Least privilege roles', 'Parameterized queries'],
    observability: ['Slow query log, lock waits, replication lag'],
    maintainability: ['Versioned migrations (Flyway/Liquibase)'],
  },
  interview: {
    expectations: ['ACID', 'Normalization vs denormalization', 'When SQL vs NoSQL'],
    commonQuestions: ['Design schema for X?', 'Index choice?'],
    followUps: ['Scale Postgres writes?', 'Isolation levels?'],
    misconceptions: ['SQL cannot scale ever', 'NoSQL always faster'],
    traps: ['Storing JSON blob instead of modeling relations when queries need joins'],
    strongSignals: ['Schema design', 'Transaction boundaries', 'Index + EXPLAIN'],
  },
  keyTakeaways: [
    'Tables, schema, FKs, SQL, ACID — default for structured OLTP.',
    'Indexes critical; watch join and lock patterns.',
    'Scale: optimize → vertical → read replicas → shard.',
    'Normalize first; denormalize for proven hot paths.',
    'Postgres/MySQL power most production OLTP.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'ACID meaning?', answerHint: 'Atomicity, Consistency, Isolation, Durability.' },
    { level: 'intermediate', question: 'When denormalize?', answerHint: 'Read-heavy hot paths where join cost proven; accept update anomaly risk.' },
    { level: 'advanced', question: 'Scale relational writes beyond one node?', answerHint: 'Shard by tenant/key, Citus, separate write domains, avoid cross-shard txs.' },
  ],
  flashcards: [
    { front: 'Foreign key', back: 'Enforces referential integrity between tables' },
    { front: 'B-tree index', back: 'Default index for equality and range queries' },
    { front: 'Normalization', back: 'Reduce redundancy; separate entities into tables' },
    { front: 'OLTP relational strength', back: 'Transactions + joins + constraints' },
  ],
  quickRevision: [
    'Schema + SQL + ACID',
    'Index WHERE/JOIN cols',
    'Replicas then shard',
    'Migrations versioned',
    'Pool connections',
  ],
  systemDesign: {
    problem: 'Design relational schema and DB strategy for a B2B invoicing SaaS (customers, invoices, line items, payments).',
    requirements: {
      functional: ['CRUD invoices', 'Multi-tenant', 'Reporting by customer/month'],
      nonFunctional: ['Tenant isolation', 'ACID on payment application', '10k tenants'],
    },
    scaleAssumptions: ['500 writes/s', '5k reads/s', '10M invoices/year'],
    capacityEstimates: ['Postgres r6g.xlarge + 2 read replicas initially'],
    api: [{ type: 'paragraph', text: 'REST CRUD; reports hit read replica' }],
    dataModel: [
      {
        type: 'list',
        items: [
          'tenants(id), customers(tenant_id FK), invoices(tenant_id, customer_id, status, total)',
          'invoice_lines(invoice_id FK, amount), payments(invoice_id, amount)',
          'Index (tenant_id, customer_id), (tenant_id, created_at)',
        ],
      },
    ],
    highLevelArchitecture: [{ type: 'paragraph', text: 'Postgres with tenant_id on all rows; RLS optional; read replica for dashboards.' }],
    diagram: {
      mermaid: `flowchart LR
  API --> Primary[(Postgres primary)]
  API --> Replica[(Read replica)]
  Reports[Reports] --> Replica`,
      caption: 'Writes primary; analytics replica',
    },
    dataFlow: ['Transactional invoice create on primary', 'Reports async on replica'],
    storage: ['Postgres with PITR backups'],
    caching: ['Redis for session not invoice source'],
    asyncProcessing: ['Export jobs from replica'],
    scaling: ['Read replicas; shard large tenants later'],
    consistency: ['Strong on primary for payments'],
    reliability: ['HA failover Patroni'],
    failureScenarios: ['Long report on replica — OK; never on primary unindexed scan'],
    security: ['tenant_id in every query', 'RLS policies'],
    observability: ['Slow queries, lock time'],
    bottlenecks: ['Hot tenant row growth'],
    alternatives: ['Per-tenant DB for enterprise tier'],
    tradeoffs: ['Shared DB vs isolated DB cost'],
    interviewFollowUps: ['Cross-tenant reporting?', 'Invoice numbering uniqueness?'],
    evolution: [
      { stage: '1. Simple design', description: 'Single Postgres schema.', bottleneck: 'Large tenants.' },
      { stage: '2. Improve', description: 'Indexes + read replica.', bottleneck: 'Write on hot tenant.' },
      { stage: '3. Improve', description: 'Tenant shard or dedicated DB for whales.', bottleneck: 'Cross-shard analytics.' },
      { stage: '4. Scale further', description: 'Citus by tenant_id hash.', bottleneck: 'Distributed joins.' },
    ],
  },
}
