import type { TopicContent } from '@/domain/types'

export const normalizationContent: TopicContent = {
  whatIsIt:
    'Normalization is the process of organizing relational schema to reduce redundancy and update anomalies by decomposing tables according to normal forms (1NF through 5NF/BCNF) — each fact stored once, dependencies reflected in keys and constraints.',
  whyExists:
    'Duplicate data causes inconsistent updates (change address in one place not another), insert/delete anomalies, and wasted storage. Normalization enforces that non-key attributes depend on the whole primary key and nothing but the key.',
  mentalModel:
    'Split tables until every column depends on the key, the whole key, and nothing but the key (3NF intuition). Functional dependency A → B means A determines B. Decompose when partial or transitive dependencies bloat a wide table.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Normal form', 'Rule (simplified)', 'Fixes'],
      rows: [
        ['1NF', 'Atomic values; no repeating groups', 'Unnest arrays into rows/tables'],
        ['2NF', 'No partial dependency on composite PK', 'Split attributes depending on part of PK'],
        ['3NF', 'No transitive dependency: non-key → non-key', 'Move determined attrs to own table'],
        ['BCNF', 'Every determinant is a candidate key', 'Stricter 3NF edge cases'],
      ],
    },
    {
      type: 'list',
      items: [
        'Functional dependency: email → user_name means email determines user_name.',
        'Partial dependency (2NF violation): (order_id, product_id) PK but product_name depends only on product_id.',
        'Transitive dependency (3NF violation): user_id → city_id → city_name — city_name belongs in cities table.',
        'Join back via FK to reconstruct views; ORM maps normalized model naturally.',
        'Denormalization is conscious reversal for read performance — not skip normalization by default.',
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Denorm[Denormalized wide table] --> Split[Decompose by dependencies]
  Split --> T1[orders]
  Split --> T2[products]
  Split --> T3[order_items FK]
  T1 --> Join[JOIN reconstructs view]
  T2 --> Join
  T3 --> Join`,
    caption: 'Normalize storage; join for queries',
  },
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: '2NF violation → fix',
      code: `-- BAD: product_name repeats per order line
CREATE TABLE order_items_bad (
  order_id     BIGINT,
  product_id   BIGINT,
  product_name TEXT,  -- depends only on product_id
  quantity     INT,
  PRIMARY KEY (order_id, product_id)
);

-- GOOD: product_name in products
CREATE TABLE products (
  id   BIGINT PRIMARY KEY,
  name TEXT NOT NULL
);
CREATE TABLE order_items (
  order_id   BIGINT REFERENCES orders(id),
  product_id BIGINT REFERENCES products(id),
  quantity   INT NOT NULL,
  PRIMARY KEY (order_id, product_id)
);`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: '3NF transitive dependency',
      code: `-- BAD: city_name depends on city_id depends on user
CREATE TABLE users_bad (
  id        BIGINT PRIMARY KEY,
  city_id   INT,
  city_name TEXT,
  country   TEXT
);

CREATE TABLE cities (
  id      INT PRIMARY KEY,
  name    TEXT NOT NULL,
  country TEXT NOT NULL
);
CREATE TABLE users (
  id      BIGINT PRIMARY KEY,
  city_id INT REFERENCES cities(id)
);`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: '1NF — repeating groups',
      code: `-- BAD: tag1, tag2, tag3 columns
-- GOOD:
CREATE TABLE product_tags (
  product_id BIGINT REFERENCES products(id),
  tag        TEXT NOT NULL,
  PRIMARY KEY (product_id, tag)
);`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'BCNF decomposition may lose dependency preservation — rare in practice OLTP.',
        '4NF/5NF address multi-valued and join dependencies — textbook; seldom manual in apps.',
        'Surrogate keys simplify 3NF when natural keys composite or unstable.',
        'ORM @ManyToOne/@OneToMany mirror normalized FK relationships.',
        'Views can present denormalized shape without storing redundancy.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Single source of truth per fact',
      'Smaller UPDATE scope — change product name once',
      'Fewer insert/delete anomalies',
    ],
    disadvantages: [
      'More JOINs for wide reports',
      'Schema more tables to migrate and understand',
      'Over-normalization for read-heavy dashboards',
    ],
    alternatives: [
      'Materialized views for read denormalization',
      'CQRS separate write normalized / read denormalized',
      'Cache assembled DTOs in application',
    ],
    whenToUse: [
      'Default for OLTP transactional schema',
      'When same attribute updated independently in many rows today',
      'Shared dimensions (products, users, locations)',
    ],
    whenNotToUse: [
      'Append-only event log (already normalized by event)',
      'Read-only analytics warehouse — star schema denormalized intentionally',
    ],
  },
  failureModes: [
    'Duplicate user profile fields on every order row — update drift.',
    'Storing computed totals without trigger — inconsistent with line items.',
    'Splitting too far — 10-table join for simple screen.',
    'Ignoring normalization then patching in app logic — bugs persist.',
    'Enum-like strings duplicated instead of FK to lookup table.',
  ],
  production: {
    maintainability: ['Normalized schema easier to evolve lookup tables'],
    performance: ['JOIN cost offset by indexes on FK columns'],
  },
  interview: {
    expectations: [
      'Explain 1NF, 2NF, 3NF with example',
      'Functional dependency language',
      'When denormalize is OK',
    ],
    commonQuestions: [
      'What is third normal form?',
      'Partial vs transitive dependency?',
      'Normalization vs performance?',
    ],
    followUps: ['BCNF vs 3NF', 'Star schema in warehouse'],
    misconceptions: [
      'Normalize to 5NF always in OLTP',
      'Normalization eliminates all JOINs',
      'Denormalization means bad design',
    ],
    traps: ['Cannot give concrete anomaly example for 2NF/3NF'],
    strongSignals: [
      'Product name on order line 2NF story',
      'Denormalize reads not skip normalize writes',
      'FK graph clarity',
    ],
  },
  keyTakeaways: [
    '1NF atomic; 2NF no partial PK dependency; 3NF no transitive non-key deps.',
    'Decompose to eliminate update/insert/delete anomalies.',
    'JOINs reconstruct data; indexes on FKs keep joins fast.',
    'OLTP normalize writes; denormalize reads selectively.',
    'Surrogate PKs simplify decomposition.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why normalize databases?',
      answerHint: 'Reduce redundancy; avoid update anomalies; one copy of each fact.',
    },
    {
      level: 'intermediate',
      question: 'Third normal form violation example?',
      answerHint: 'Non-key column depends on another non-key column; move to separate table with FK.',
    },
    {
      level: 'advanced',
      question: 'Normalize everything for analytics?',
      answerHint: 'OLTP normalize; warehouses often star/snowflake denormalized dimensions for scan performance.',
    },
  ],
  flashcards: [
    { front: '2NF violation', back: 'Non-key attribute depends on part of composite PK' },
    { front: '3NF violation', back: 'Transitive: non-key → non-key' },
    { front: '1NF', back: 'Atomic columns; no repeating groups' },
  ],
  quickRevision: [
    '1NF atomic values',
    '2NF whole PK dependency',
    '3NF no transitive deps',
    'Anomalies: update/insert/delete',
    'FK join back together',
    'OLTP normalize default',
    'Denorm reads selectively',
  ],
}

export const content = normalizationContent
