import type { TopicContent } from '@/domain/types'

export const denormalizationContent: TopicContent = {
  whatIsIt:
    'Denormalization intentionally duplicates data across tables or adds redundant columns to speed reads, simplify queries, or support reporting — accepting extra storage and synchronization burden in exchange for fewer JOINs and faster access paths.',
  whyExists:
    'Fully normalized schemas require many JOINs for dashboards, search, and hot read paths. At scale, join cost, ORM complexity, and cache miss rates dominate. Controlled denormalization trades write complexity for read latency and throughput.',
  mentalModel:
    'Copy data that would require JOIN into same row or summary table. Keep normalized source of truth; denormalized copy is derived — update via triggers, app events, batch jobs, or materialized view refresh. Document sync ownership.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Pattern', 'Mechanism', 'Example'],
      rows: [
        ['Redundant column', 'Duplicate attr on child', 'order.user_email on orders'],
        ['Summary table', 'Pre-aggregated counts/totals', 'user_stats.order_count'],
        ['Materialized view', 'Stored query result', 'REFRESH MATERIALIZED VIEW daily_sales'],
        ['JSONB snapshot', 'Embed related doc', 'order snapshot of shipping address'],
        ['Wide read model', 'CQRS projection table', 'order_search_document'],
      ],
    },
    {
      type: 'list',
      items: [
        'Trigger AFTER INSERT/UPDATE on source → update denormalized column.',
        'Application dual-write in same transaction when possible.',
        'Event-driven eventual consistency via outbox + consumer.',
        'Periodic batch reconciliation to fix drift.',
        'Partial denormalization: only columns on critical read path.',
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Norm[Normalized orders + users] --> Trigger[Trigger / event]
  Trigger --> Denorm[orders.user_email column]
  Read[Hot read query] --> Denorm
  Norm --> MV[Materialized view]
  MV --> Report[Dashboard]`,
    caption: 'Normalized write path; denormalized read path',
  },
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'Redundant column with trigger sync',
      code: `ALTER TABLE orders ADD COLUMN user_email TEXT;

CREATE OR REPLACE FUNCTION sync_order_user_email()
RETURNS TRIGGER AS $$
BEGIN
  SELECT email INTO NEW.user_email FROM users WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_user_email
  BEFORE INSERT OR UPDATE OF user_id ON orders
  FOR EACH ROW EXECUTE FUNCTION sync_order_user_email();

-- Read without JOIN:
SELECT id, user_email, total_cents FROM orders WHERE user_email LIKE '%@corp.com';`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Summary / counter table',
      code: `CREATE TABLE user_order_stats (
  user_id      BIGINT PRIMARY KEY REFERENCES users(id),
  order_count  INT NOT NULL DEFAULT 0,
  total_cents  BIGINT NOT NULL DEFAULT 0,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Increment on order insert (app or trigger)
UPDATE user_order_stats
SET order_count = order_count + 1,
    total_cents = total_cents + EXCLUDED.total_cents,
    updated_at = NOW()
WHERE user_id = NEW.user_id;`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Materialized view for reporting',
      code: `CREATE MATERIALIZED VIEW mv_daily_revenue AS
SELECT created_at::date AS day,
       SUM(total_cents) AS revenue_cents,
       COUNT(*) AS order_count
FROM orders
WHERE status = 'paid'
GROUP BY 1;

CREATE UNIQUE INDEX ON mv_daily_revenue (day);
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_revenue;`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'HOT updates less likely when denormalized indexed columns change with parent updates.',
        'Materialized view CONCURRENTLY needs unique index on view.',
        'Counter tables hot-spot on single row — shard counters or approximate for high write QPS.',
        'JSONB denormalization avoids schema migration for snapshot fields frozen at order time.',
        'Replication lag: read replica may show stale denormalized data briefly.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Fewer JOINs — faster point reads and simpler SQL',
      'Pre-computed aggregates for dashboards',
      'Search/index friendly wide documents',
    ],
    disadvantages: [
      'Sync logic bugs → inconsistent reads',
      'More write paths to maintain',
      'Storage duplication',
    ],
    alternatives: [
      'Covering indexes instead of column duplication',
      'Read replica + normalized JOIN if latency acceptable',
      'Application cache of assembled DTO',
    ],
    whenToUse: [
      'Proven hot query JOIN bottleneck after indexes',
      'Historical snapshots (price at purchase time)',
      'Read-heavy aggregates updated async',
    ],
    whenNotToUse: [
      'Before measuring — premature denormalization',
      'Frequently changing duplicated fields without sync discipline',
      'Small tables where JOIN is cheap',
    ],
  },
  failureModes: [
    'Denormalized column updated in app path A only — path B stale.',
    'Trigger failure silent — drift until audit.',
    'Counter race without atomic UPDATE or SERIALIZABLE.',
    'REFRESH MATERIALIZED VIEW blocking (non-concurrent) locks reads.',
    'Denormalize everything — write amplification nightmare.',
  ],
  production: {
    reliability: ['Reconciliation job compares sum(line_items) vs order.total'],
    performance: ['Index denormalized filter columns'],
    maintainability: ['Document sync mechanism in schema comments / ADR'],
  },
  interview: {
    expectations: [
      'Why denormalize vs normalize tradeoff',
      'Sync strategies: trigger, event, MV',
      'When duplicate is intentional snapshot',
    ],
    commonQuestions: [
      'Normalization vs denormalization?',
      'How keep denormalized data consistent?',
      'Materialized view use case?',
    ],
    followUps: ['Counter table hot spot', 'CQRS read models'],
    misconceptions: [
      'Denormalization means no FKs',
      'Always faster — writes suffer',
      'Cache replaces need for denormalization always',
    ],
    traps: ['Denormalize without plan for parent update propagation'],
    strongSignals: [
      'Snapshot vs live duplicate distinction',
      'CONCURRENTLY refresh',
      'Measure JOIN cost first',
    ],
  },
  keyTakeaways: [
    'Denormalization duplicates data to speed reads — sync is the hard part.',
    'Patterns: redundant cols, summary tables, materialized views, JSON snapshots.',
    'Keep normalized source of truth; denormalized is derived.',
    'Triggers, events, or batch refresh maintain consistency.',
    'Denormalize measured bottlenecks, not speculatively.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is denormalization?',
      answerHint: 'Intentionally store redundant data to reduce JOINs and speed reads.',
    },
    {
      level: 'intermediate',
      question: 'How sync denormalized user_email on orders?',
      answerHint: 'Trigger on user_id change; app dual-write; or event consumer; snapshot at insert for history.',
    },
    {
      level: 'advanced',
      question: 'Materialized view vs summary table?',
      answerHint: 'MV is defined query refreshed periodically; summary table updated incrementally per event — lower staleness control tradeoffs.',
    },
  ],
  flashcards: [
    { front: 'Denormalization cost', back: 'Sync complexity + storage; faster reads' },
    { front: 'Order address snapshot', back: 'Denormalize intentionally — historical truth' },
    { front: 'REFRESH CONCURRENTLY', back: 'Needs unique index; avoids exclusive lock on read' },
  ],
  quickRevision: [
    'Duplicate for read speed',
    'Sync: trigger/event/MV',
    'Normalized = truth',
    'Snapshot vs live copy',
    'Summary counters hot-spot',
    'Measure JOIN first',
    'MV for reporting',
  ],
}

export const content = denormalizationContent
