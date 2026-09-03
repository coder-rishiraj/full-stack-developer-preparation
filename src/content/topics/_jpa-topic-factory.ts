import type { TopicContent } from '@/domain/types'

type JpaTopicInput = {
  title: string
  sectionTitle: string
  parentTitle?: string
}

const SECTION_FOCUS: Record<string, string> = {
  'ORM Foundations & Technology Boundaries':
    'JPA as the standard API, Hibernate as the provider, Spring Data JPA as repository automation, and when ORM is the wrong tool',
  'Entities, Identity & Mapping Basics':
    'entity requirements, table/column mapping, access strategy, equality, Lombok traps, and domain-friendly entity design',
  'Identifiers, Generated Values & Value Types':
    'identifier strategies, sequence allocation, UUIDs, composite keys, embeddables, enums, and converters',
  'Relationships, Ownership & Cascades':
    'association ownership, mappedBy, join columns, cascades, orphan removal, and bidirectional consistency',
  'Persistence Context, Lifecycle & Flush':
    'EntityManager scope, first-level cache, managed/detached states, flush timing, and OSIV trade-offs',
  'Dirty Checking, Write-behind & SQL Generation':
    'snapshots, automatic updates, flush ordering, bulk-operation bypasses, batching, and generated SQL evidence',
  'Fetching, Lazy Loading & N+1 Control':
    'lazy proxies, eager defaults, fetch joins, entity graphs, batch fetching, and query-count regression control',
  'Repositories, Queries & Projections':
    'JpaRepository behavior, derived queries, JPQL/native queries, parameter binding, pagination, specifications, and projections',
  'Transactions, Locking & Concurrency':
    '@Transactional boundaries, isolation, rollback rules, optimistic versioning, pessimistic locks, and retry design',
  'Schema, Validation & Migrations':
    'ddl-auto discipline, migrations, constraints, validation, auditing, and schema/application contract drift',
  'Caching, Performance & Observability':
    'second-level cache trade-offs, SQL logging, Hibernate statistics, batching, streaming, read-only hints, and production diagnosis',
  'Inheritance, Polymorphism & Advanced Mapping':
    'inheritance strategies, mapped superclass, secondary tables, filters, and advanced mapping trade-offs',
  'Spring Data JPA Internals & Extension Points':
    'repository proxies, query lookup, custom implementations, transaction defaults, entity callbacks, and domain events',
  'Testing Persistence':
    '@DataJpaTest, TestEntityManager, PostgreSQL Testcontainers, H2 dialect gaps, query tests, and N+1 regression tests',
  'API Boundaries, DTOs & Production Patterns':
    'DTO boundaries, aggregate scope, JSON serialization traps, OSIV decisions, and when to drop to SQL/JDBC',
  'Interview Scenarios & Troubleshooting':
    'generated SQL debugging, common Hibernate exceptions, connection leaks, stale writes, and production query spikes',
}

export function createJpaTopicContent({
  title,
  sectionTitle,
  parentTitle,
}: JpaTopicInput): TopicContent {
  const focus =
    SECTION_FOCUS[sectionTitle] ??
    'JPA/Hibernate behavior, Spring Data integration, SQL evidence, and production trade-offs'
  const parent = parentTitle ? ` It is an atomic part of ${parentTitle}.` : ''

  return {
    whatIsIt:
      `${title} is a JPA/Hibernate/Spring Data JPA topic in ${sectionTitle}.${parent} ` +
      'For a 5-year backend interview, explain both the Java abstraction and the SQL/database behavior it produces.',
    whyExists:
      `${title} helps map domain objects to relational data without losing control of correctness, performance, and transaction boundaries. ` +
      `A strong answer covers ${focus}.`,
    mentalModel:
      'JPA is the contract, Hibernate is the runtime engine, Spring Data JPA generates repository adapters, and the database is still the source of truth. ' +
      'Every ORM decision should be traceable to entity state, flush timing, SQL shape, transaction scope, and measured production evidence.',
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: [
          `Define ${title} at the JPA API level and note any Hibernate-specific behavior.`,
          'Identify the entity state, association, query, transaction, or repository boundary involved.',
          'Predict the SQL, flush timing, locks, lazy loads, and number of round-trips.',
          'Verify with tests, generated SQL, Hibernate statistics, database plans, and realistic PostgreSQL data.',
          'Choose DTOs, projections, native SQL, JDBC, or query redesign when the ORM abstraction hides too much.',
        ],
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Track boundary',
        text:
          'C8 owns JPA, Hibernate, Spring Data JPA, mappings, fetching, persistence context, and ORM performance. ' +
          'C7 owns SQL/PostgreSQL semantics; C5 owns Spring proxy mechanics; C6 owns Boot wiring and web boundaries; C9 owns security.',
      },
    ],
    internals: [
      {
        type: 'list',
        items: [
          'EntityManager delegates to a provider such as Hibernate, which keeps a persistence context with identity map entries and loaded-state snapshots.',
          'Managed entity changes are detected during flush; Hibernate orders SQL actions and sends JDBC statements inside the active transaction.',
          'Lazy associations use proxies or persistent collection wrappers and require an open persistence context when initialized.',
          'Spring Data repositories are Spring proxies that parse method names or execute declared queries against EntityManager.',
          'The database enforces constraints, isolation, indexes, and locks; ORM annotations must match the real schema and workload.',
        ],
      },
    ],
    failureModes: [
      `Explaining ${title} as magic repository CRUD without entity state, flush, SQL, and transaction details.`,
      'Returning entities from REST APIs and triggering lazy-loading, recursion, over-fetching, or accidental writes.',
      'Using EAGER mappings or broad cascades that create N+1 queries, large object graphs, or unsafe deletes.',
      'Testing against H2 only and missing PostgreSQL dialect, constraint, locking, and query-plan behavior.',
      'Ignoring generated SQL, connection usage, and query counts until production latency spikes.',
    ],
    production: {
      performance: [
        'Measure SQL count, row count, plan shape, connection hold time, flush frequency, cache hit rate, and heap growth before tuning.',
        'Prefer bounded fetch plans, DTO projections, batch fetching, keyset pagination, and explicit native SQL for report-style queries.',
      ],
      reliability: [
        'Keep transactions short, model concurrency with @Version or database locks, and retry only idempotent units of work.',
        'Use migrations instead of runtime schema generation outside local development.',
      ],
      maintainability: [
        'Keep entity graphs close to aggregate boundaries and map API contracts through DTOs or projections.',
        'Separate portable JPA knowledge from Hibernate and Spring Data conveniences when designing abstractions.',
      ],
      observability: [
        'Enable SQL visibility in development and targeted production diagnostics with Hibernate statistics or datasource-proxy-style tooling.',
        'Correlate slow requests with generated SQL, bind patterns, plans, locks, and transaction spans.',
      ],
    },
    interview: {
      expectations: [
        `Define ${title} precisely in ${sectionTitle}.`,
        'Distinguish JPA specification, Hibernate implementation, Spring Data JPA repository layer, and actual SQL/database behavior.',
        'Name one correctness risk, one performance risk, and one testing or observability technique.',
      ],
      commonQuestions: [
        `How does ${title} work in JPA/Hibernate?`,
        'What SQL or transaction behavior would Hibernate produce?',
        'How would you prevent N+1, stale writes, lazy-loading failures, or unsafe cascades?',
      ],
      followUps: [
        'What changes in PostgreSQL under concurrent requests?',
        'When would you use a projection, native query, JDBC, or jOOQ instead?',
      ],
      misconceptions: [
        'Spring Data JPA replaces Hibernate.',
        'Calling save() is always required after changing a managed entity.',
        'Lazy loading is always faster and eager loading is always safer.',
      ],
      traps: [
        'Reciting annotations without explaining ownership, flush timing, generated SQL, or transaction boundaries.',
        'Claiming an ORM solution is production ready without query-count tests and database-backed integration tests.',
      ],
      strongSignals: [
        'Answers move fluently from entity state to SQL, indexes, locks, transactions, and API boundaries.',
        'Uses modern Jakarta/Spring Boot terminology while clearly labeling Hibernate-specific features.',
      ],
    },
    keyTakeaways: [
      `${title} belongs to ${sectionTitle}.`,
      `Focus: ${focus}.`,
      'JPA contract -> Hibernate behavior -> Spring Data adapter -> SQL/database evidence.',
    ],
    interviewQuestions: [
      {
        level: 'basic',
        question: `What is ${title}, and where does it fit among JPA, Hibernate, and Spring Data JPA?`,
        answerHint: `Place it in ${sectionTitle}; identify whether it is API, provider behavior, repository abstraction, or database effect.`,
      },
      {
        level: 'intermediate',
        question: `Which mapping, transaction, fetching, or query trade-offs matter for ${title}?`,
        answerHint: 'Discuss entity state, flush timing, generated SQL, lazy/eager behavior, cascades, locks, or projections as applicable.',
      },
      {
        level: 'advanced',
        question: `How would you debug ${title} during a production performance or correctness incident?`,
        answerHint: `Use ${focus} plus SQL logs, Hibernate statistics, database plans, transactions, locks, and focused regression tests.`,
      },
    ],
    flashcards: [
      { front: title, back: `${sectionTitle}: ${focus}.` },
      {
        front: `${title} interview loop`,
        back: 'API/spec -> provider behavior -> generated SQL -> transaction/fetch plan -> production evidence.',
      },
    ],
    quickRevision: [
      `${title} - ${sectionTitle}`,
      `Focus: ${focus}`,
      'Separate JPA, Hibernate, Spring Data JPA, and database behavior',
      'Always reason about SQL, transactions, fetch plan, and tests',
    ],
  }
}
