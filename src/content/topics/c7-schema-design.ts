import type { TopicContent } from '@/domain/types'

export const schemaDesignContent: TopicContent = {
  whatIsIt:
    'Schema design defines tables, columns, types, constraints, keys, and relationships in PostgreSQL — balancing normalization, query patterns, integrity, and evolution constraints for OLTP and reporting workloads.',
  whyExists:
    'Poor schema forces expensive joins, prevents constraints, complicates migrations, and blocks indexing strategies. Good design encodes business invariants (FK, UNIQUE, CHECK) and aligns physical layout with how the application reads and writes data.',
  mentalModel:
    'Entities → tables; relationships → FK + join tables. Choose types deliberately (timestamptz, numeric for money, text vs varchar). Primary keys: bigint identity or UUID (gen_random_uuid()). Design for access patterns: what filters, sorts, and joins dominate?',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Surrogate PK (bigserial/bigint) vs natural key (email) — unique index on natural either way.',
        'Foreign keys enforce referential integrity; ON DELETE CASCADE/SET NULL explicit.',
        'NOT NULL + DEFAULT reduce null handling bugs; CHECK for domain rules.',
        'timestamptz for all instants; store UTC; display in app timezone.',
        'Money: numeric(19,4) or bigint cents — never float.',
        'Soft delete: deleted_at timestamptz + partial indexes WHERE deleted_at IS NULL.',
        'Audit columns: created_at, updated_at with trigger or app-managed.',
      ],
    },
    {
      type: 'table',
      headers: ['Decision', 'Guidance'],
      rows: [
        ['UUID PK', 'Distributed IDs; larger indexes vs bigint'],
        ['JSONB column', 'Flexible attrs; GIN index if queried; not replacement for relations'],
        ['Enum vs lookup table', 'PG enum hard to alter; lookup table + FK more flexible'],
        ['Partition key', 'Time or tenant id when table > tens/hundreds GB'],
        ['Naming', 'snake_case tables plural; _id suffix for FK columns'],
      ],
    },
  ],
  architecture: {
    mermaid: `erDiagram
  USERS ||--o{ ORDERS : places
  ORDERS ||--|{ ORDER_ITEMS : contains
  PRODUCTS ||--o{ ORDER_ITEMS : referenced
  USERS {
    bigint id PK
    text email UK
    timestamptz created_at
  }
  ORDERS {
    bigint id PK
    bigint user_id FK
    text status
    bigint total_cents
  }`,
    caption: 'Relational schema with clear FK graph',
  },
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'Solid OLTP table definitions',
      code: `CREATE TABLE users (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ,
  CONSTRAINT users_email_lower_unique UNIQUE (lower(email))
);

CREATE TABLE orders (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id      BIGINT NOT NULL REFERENCES users(id),
  status       TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending','paid','shipped','cancelled')),
  total_cents  BIGINT NOT NULL CHECK (total_cents >= 0),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);
CREATE INDEX idx_orders_active ON orders (user_id) WHERE status NOT IN ('cancelled');`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Many-to-many join table',
      code: `CREATE TABLE product_tags (
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag_id     BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);
CREATE INDEX idx_product_tags_tag ON product_tags (tag_id);`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'JSONB for optional extensibility',
      code: `CREATE TABLE events (
  id         BIGINT PRIMARY KEY,
  type       TEXT NOT NULL,
  payload    JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_events_payload_gin ON events USING GIN (payload);
-- Query: WHERE payload @> '{"userId": 42}'`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Heap storage unordered; CLUSTER one-time physical reorder by index.',
        'TOAST for large text/json — out-of-line storage affects wide row performance.',
        'Fillfactor < 100 on update-heavy tables leaves page space for HOT updates.',
        'Identity columns preferred over serial in PG 10+ for standard compliance.',
        'Deferred constraints rare; immediate FK check on each statement row.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'FK and CHECK catch bugs at DB boundary',
      'Clear model for ORM mapping and team communication',
      'Index-friendly column types and naming',
    ],
    disadvantages: [
      'Over-normalized schema → many joins for dashboards',
      'Rigid schema slows rapid prototype iteration',
      'Wrong partition key costly to change',
    ],
    alternatives: [
      'Event sourcing separate write model from read projections',
      'Document store for truly schemaless blobs',
      'CQRS read models denormalized for queries',
    ],
    whenToUse: [
      'Greenfield service with known entities',
      'When integrity matters (payments, inventory)',
      'Before writing ORM entities — schema first or together',
    ],
    whenNotToUse: [
      'Throwaway prototype with zero persistence guarantees',
      'When every field queried differently per tenant — consider JSONB hybrid',
    ],
  },
  failureModes: [
    'No FK — orphan rows and inconsistent reports.',
    'float for money — rounding errors in totals.',
    'timestamp without time zone — DST bugs.',
    'UUID v4 random PK — index fragmentation; consider UUIDv7 or bigint.',
    'God table with 80 nullable columns — unclear lifecycle and index bloat.',
    'Missing index on FK child column — slow JOIN and CASCADE deletes.',
  ],
  production: {
    maintainability: ['Flyway/Liquibase migrations versioned in repo'],
    performance: ['Index FK columns and common filters at design time'],
    reliability: ['Constraints over app-only validation for invariants'],
  },
  interview: {
    expectations: [
      'PK/FK/UNIQUE/CHECK roles',
      'Money and timestamp types',
      'Soft delete pattern',
    ],
    commonQuestions: [
      'UUID vs bigint primary key?',
      'When use JSONB vs separate table?',
      'How model many-to-many?',
    ],
    followUps: ['Partitioning criteria', 'Enum vs lookup table'],
    misconceptions: [
      'FK hurts performance always (usually helps planner and integrity)',
      'varchar(n) faster than text in PostgreSQL',
      'Schema design is only normalization exercise',
    ],
    traps: ['Natural key PK that business later wants to change'],
    strongSignals: [
      'timestamptz + cents/bigint money',
      'Partial index on soft delete',
      'FK index on child side',
    ],
  },
  keyTakeaways: [
    'Schema encodes invariants: FK, UNIQUE, NOT NULL, CHECK.',
    'Align indexes with query access patterns early.',
    'Use timestamptz, numeric/bigint for money — not float.',
    'Soft delete + partial indexes preserve query speed.',
    'JSONB for extension points; relations for queryable associations.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why foreign keys?',
      answerHint: 'Referential integrity; prevent orphans; document relationships; help optimizer.',
    },
    {
      level: 'intermediate',
      question: 'How store monetary amounts?',
      answerHint: 'numeric fixed scale or bigint smallest unit (cents); never float.',
    },
    {
      level: 'advanced',
      question: 'Soft delete schema impact?',
      answerHint: 'deleted_at column; partial indexes excluding deleted; unique constraints often partial.',
    },
  ],
  flashcards: [
    { front: 'timestamptz', back: 'Store UTC instants; avoids timezone bugs' },
    { front: 'FK child column', back: 'Index it — joins and ON DELETE performance' },
    { front: 'Partial unique index', back: 'UNIQUE WHERE deleted_at IS NULL for soft delete email' },
  ],
  quickRevision: [
    'FK + index child cols',
    'timestamptz UTC',
    'Money: numeric/cents',
    'Soft delete partial index',
    'JSONB + GIN if queried',
    'Identity/bigint PK common',
    'CHECK + NOT NULL invariants',
  ],
}

export const content = schemaDesignContent
