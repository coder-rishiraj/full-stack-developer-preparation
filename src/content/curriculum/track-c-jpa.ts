import type { Priority } from '@/domain/types'
import type { SectionSeed, TopicSeed } from './build'

const JPA = ['jpa', 'hibernate', 'spring-data-jpa'] as const
const M34 = [3, 4]
const M56 = [5, 6]

function item(
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  const { tags, executionPriority, ...rest } = extra
  return {
    id,
    title,
    priority,
    months: extra.months ?? (priority === 'tier1' ? M34 : M56),
    tags: [...JPA, ...(tags ?? [])],
    executionPriority:
      executionPriority ?? (priority === 'tier1' ? 'p0' : priority === 'tier2' ? 'p1' : 'later'),
    ...rest,
  }
}

function nest(
  parent: string,
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  return item(id, title, priority, {
    ...extra,
    curriculumLevel: 'nested-concept',
    parentTopicId: parent,
  })
}

function section(id: string, title: string, order: number, topics: TopicSeed[]): SectionSeed {
  return {
    id,
    track: 'C',
    title,
    order,
    defaultKind: 'theory',
    defaultDepth: 'deep',
    topics,
  }
}

/**
 * C8.1-C8.16 — JPA, Hibernate, and Spring Data JPA for experienced backend interviews.
 * SQL/PostgreSQL semantics stay in C7, transaction proxy mechanics in C5, Boot test slices
 * in C6, and application security in C9. Existing C8 topic IDs remain stable.
 */
export const TRACK_C_JPA_SECTIONS: SectionSeed[] = [
  section('C8.1', 'ORM Foundations & Technology Boundaries', 119, [
    item('c8-orm-foundations', 'JPA, Hibernate & Spring Data JPA'),
    nest('c8-orm-foundations', 'c8-jpa-specification', 'JPA as a Specification'),
    nest('c8-orm-foundations', 'c8-hibernate-provider', 'Hibernate as JPA Provider'),
    nest('c8-orm-foundations', 'c8-spring-data-jpa-module', 'Spring Data JPA Module'),
    nest('c8-orm-foundations', 'c8-orm-vs-jdbc', 'ORM vs JDBC / jOOQ / MyBatis'),
    nest('c8-orm-foundations', 'c8-entitymanager-vs-session', 'EntityManager vs Hibernate Session'),
    nest('c8-orm-foundations', 'c8-jpql-vs-hql', 'JPQL vs HQL'),
    nest('c8-orm-foundations', 'c8-jakarta-persistence', 'javax.persistence vs jakarta.persistence'),
  ]),

  section('C8.2', 'Entities, Identity & Mapping Basics', 120, [
    item('c8-entities', 'Entities'),
    nest('c8-entities', 'c8-entity-requirements', 'Entity Requirements & No-arg Constructor'),
    nest('c8-entities', 'c8-table-column-mapping', '@Table, @Column & Naming Strategies'),
    nest('c8-entities', 'c8-field-vs-property-access', 'Field Access vs Property Access'),
    nest('c8-entities', 'c8-entity-constructors', 'Constructors, Setters & Domain Methods'),
    nest('c8-entities', 'c8-equals-hashcode', 'equals/hashCode for Entities'),
    nest('c8-entities', 'c8-to-string-lazy-trap', 'toString(), Lombok & Lazy Loading Traps'),
    nest('c8-entities', 'c8-entity-immutability', 'Mutable Entities vs Immutable Domain Models', 'tier2'),
  ]),

  section('C8.3', 'Identifiers, Generated Values & Value Types', 121, [
    item('c8-identifiers', 'Identifiers & Generated Values'),
    nest('c8-identifiers', 'c8-id-generatedvalue', '@Id & @GeneratedValue'),
    nest('c8-identifiers', 'c8-identity-vs-sequence', 'IDENTITY vs SEQUENCE Strategies'),
    nest('c8-identifiers', 'c8-sequence-allocation-size', 'Sequence allocationSize & Insert Throughput'),
    nest('c8-identifiers', 'c8-uuid-identifiers', 'UUID Identifiers'),
    nest('c8-identifiers', 'c8-composite-ids', 'Composite IDs with @EmbeddedId / @IdClass'),
    nest('c8-identifiers', 'c8-embeddables', '@Embeddable Value Objects'),
    nest('c8-identifiers', 'c8-enum-mapping', 'Enum Mapping: ORDINAL vs STRING'),
    nest('c8-identifiers', 'c8-converters', 'AttributeConverter'),
  ]),

  section('C8.4', 'Relationships, Ownership & Cascades', 122, [
    item('c8-relationships', 'Relationships'),
    nest('c8-relationships', 'c8-many-to-one', '@ManyToOne'),
    nest('c8-relationships', 'c8-one-to-many', '@OneToMany'),
    nest('c8-relationships', 'c8-one-to-one', '@OneToOne'),
    nest('c8-relationships', 'c8-many-to-many', '@ManyToMany and Join Tables'),
    nest('c8-relationships', 'c8-owning-side-mappedby', 'Owning Side, mappedBy & Foreign Keys'),
    nest('c8-relationships', 'c8-cascade-types', 'Cascade Types'),
    nest('c8-relationships', 'c8-orphan-removal', 'orphanRemoval'),
    nest('c8-relationships', 'c8-bidirectional-sync', 'Bidirectional Association Synchronization'),
  ]),

  section('C8.5', 'Persistence Context, Lifecycle & Flush', 123, [
    item('c8-persistence-context', 'Persistence Context'),
    item('c8-entity-lifecycle', 'Entity Lifecycle'),
    nest('c8-persistence-context', 'c8-first-level-cache', 'First-level Cache / Identity Map'),
    nest('c8-persistence-context', 'c8-managed-detached-removed', 'Transient, Managed, Detached & Removed'),
    nest('c8-persistence-context', 'c8-persist-merge-remove', 'persist(), merge(), remove()'),
    nest('c8-persistence-context', 'c8-flush-modes', 'Flush Modes and Query-time Flush'),
    nest('c8-persistence-context', 'c8-clear-detach-refresh', 'clear(), detach() & refresh()'),
    nest('c8-persistence-context', 'c8-open-session-in-view', 'Open Session in View', 'tier2'),
  ]),

  section('C8.6', 'Dirty Checking, Write-behind & SQL Generation', 124, [
    item('c8-dirty-checking', 'Dirty Checking'),
    nest('c8-dirty-checking', 'c8-snapshots', 'Loaded State Snapshots'),
    nest('c8-dirty-checking', 'c8-write-behind', 'Transactional Write-behind'),
    nest('c8-dirty-checking', 'c8-save-vs-managed-change', 'save() vs Managed Entity Changes'),
    nest('c8-dirty-checking', 'c8-dynamic-update', '@DynamicUpdate Trade-offs', 'tier2'),
    nest('c8-dirty-checking', 'c8-bulk-update-bypass', 'Bulk Updates Bypass Persistence Context'),
    nest('c8-dirty-checking', 'c8-jdbc-batching', 'JDBC Batching with Hibernate', 'tier2'),
  ]),

  section('C8.7', 'Fetching, Lazy Loading & N+1 Control', 125, [
    item('c8-lazy-loading', 'Lazy/Eager Loading'),
    item('c8-nplus1', 'N+1 Problem'),
    item('c8-fetch-joins', 'Fetch Joins'),
    nest('c8-lazy-loading', 'c8-eager-loading', 'Eager Loading'),
    nest('c8-lazy-loading', 'c8-lazy-proxies', 'Hibernate Proxies and Persistent Collections'),
    nest('c8-lazy-loading', 'c8-lazy-initialization-exception', 'LazyInitializationException'),
    nest('c8-fetch-joins', 'c8-entity-graph', '@EntityGraph'),
    nest('c8-fetch-joins', 'c8-batch-fetch-size', 'Batch Fetching and default_batch_fetch_size'),
    nest('c8-fetch-joins', 'c8-subselect-fetch', 'SUBSELECT Fetching', 'tier2'),
    nest('c8-fetch-joins', 'c8-multiple-bag-fetch', 'MultipleBagFetchException'),
  ]),

  section('C8.8', 'Repositories, Queries & Projections', 126, [
    item('c8-repositories', 'Repositories'),
    nest('c8-repositories', 'c8-jparepository-crudrepository', 'CrudRepository vs JpaRepository'),
    nest('c8-repositories', 'c8-derived-query-methods', 'Derived Query Methods'),
    nest('c8-repositories', 'c8-query-annotation', '@Query with JPQL and Native SQL'),
    nest('c8-repositories', 'c8-query-parameters', 'Named and Positional Query Parameters'),
    nest('c8-repositories', 'c8-specifications', 'JpaSpecificationExecutor / Criteria API', 'tier2'),
    nest('c8-repositories', 'c8-query-by-example', 'Query by Example', 'tier2'),
    nest('c8-repositories', 'c8-projections', 'Interface, DTO and Record Projections'),
    nest('c8-repositories', 'c8-pagination-sorting', 'Page, Slice, Pageable and Sort'),
  ]),

  section('C8.9', 'Transactions, Locking & Concurrency', 127, [
    item('c8-transactions', 'JPA Transactions', 'tier1', { related: ['c7-transactions'] }),
    item('c8-optimistic-locking', 'Optimistic/Pessimistic Locking', 'tier1', {
      related: ['c7-isolation-levels'],
      capstone: 'Versioned seat/inventory updates under concurrent booking attempts.',
    }),
    nest('c8-transactions', 'c8-transactional-boundaries', '@Transactional Boundaries'),
    nest('c8-transactions', 'c8-propagation-isolation', 'Propagation and Isolation with JPA'),
    nest('c8-transactions', 'c8-readonly-transactions', 'readOnly Transactions'),
    nest('c8-transactions', 'c8-rollback-rules', 'Rollback Rules and Checked Exceptions'),
    nest('c8-optimistic-locking', 'c8-version-column', '@Version Column'),
    nest('c8-optimistic-locking', 'c8-optimistic-retry', 'OptimisticLockException and Retry Design'),
    nest('c8-optimistic-locking', 'c8-pessimistic-locking', 'Pessimistic Locking', 'tier1', {
      related: ['c7-locks'],
    }),
  ]),

  section('C8.10', 'Schema, Validation & Migrations', 128, [
    item('c8-schema-management', 'Schema Management with JPA and Migrations'),
    nest('c8-schema-management', 'c8-ddl-auto', 'hibernate.hbm2ddl.auto / ddl-auto'),
    nest('c8-schema-management', 'c8-flyway-liquibase', 'Flyway / Liquibase with JPA'),
    nest('c8-schema-management', 'c8-column-nullable-length', '@Column nullable, unique and length'),
    nest('c8-schema-management', 'c8-bean-validation', 'Bean Validation on Entities'),
    nest('c8-schema-management', 'c8-unique-constraints', 'Unique Constraints and Index Metadata'),
    nest('c8-schema-management', 'c8-auditing', 'CreatedDate, LastModifiedDate and Auditing'),
    nest('c8-schema-management', 'c8-soft-delete', 'Soft Delete Patterns', 'tier2'),
  ]),

  section('C8.11', 'Caching, Performance & Observability', 129, [
    item('c8-performance', 'Hibernate Performance and Observability'),
    nest('c8-performance', 'c8-second-level-cache', 'Second-level Cache', 'tier2'),
    nest('c8-performance', 'c8-query-cache', 'Query Cache', 'tier2'),
    nest('c8-performance', 'c8-hibernate-statistics', 'Hibernate Statistics'),
    nest('c8-performance', 'c8-sql-logging-p6spy', 'SQL Logging, p6spy and datasource-proxy'),
    nest('c8-performance', 'c8-fetch-size', 'Fetch Size and Streaming Results', 'tier2'),
    nest('c8-performance', 'c8-batch-inserts-updates', 'Batch Inserts and Updates', 'tier2'),
    nest('c8-performance', 'c8-read-only-queries', 'Read-only Queries and Hints'),
  ]),

  section('C8.12', 'Inheritance, Polymorphism & Advanced Mapping', 130, [
    item('c8-advanced-mapping', 'Advanced Hibernate Mapping'),
    nest('c8-advanced-mapping', 'c8-inheritance-mapping', 'Inheritance Mapping Strategies'),
    nest('c8-advanced-mapping', 'c8-mapped-superclass', '@MappedSuperclass'),
    nest('c8-advanced-mapping', 'c8-single-table-inheritance', 'SINGLE_TABLE Strategy'),
    nest('c8-advanced-mapping', 'c8-joined-inheritance', 'JOINED Strategy'),
    nest('c8-advanced-mapping', 'c8-table-per-class', 'TABLE_PER_CLASS Strategy', 'tier2'),
    nest('c8-advanced-mapping', 'c8-secondary-table', '@SecondaryTable', 'tier2'),
    nest('c8-advanced-mapping', 'c8-filters-where', '@Filter, @Where and Tenant Filters', 'tier2'),
  ]),

  section('C8.13', 'Spring Data JPA Internals & Extension Points', 131, [
    item('c8-spring-data-internals', 'Spring Data JPA Internals'),
    nest('c8-spring-data-internals', 'c8-repository-proxies', 'Repository Proxies'),
    nest('c8-spring-data-internals', 'c8-query-lookup-strategy', 'Query Lookup Strategy'),
    nest('c8-spring-data-internals', 'c8-custom-repository-impl', 'Custom Repository Implementations'),
    nest('c8-spring-data-internals', 'c8-domain-events', 'Domain Events from Aggregates', 'tier2'),
    nest('c8-spring-data-internals', 'c8-repository-transactions', 'Repository Transaction Defaults'),
    nest('c8-spring-data-internals', 'c8-entity-callbacks', 'Entity Callbacks and Listeners', 'tier2'),
  ]),

  section('C8.14', 'Testing Persistence', 132, [
    item('c8-testing', 'Testing JPA and Hibernate'),
    nest('c8-testing', 'c8-datajpatest', '@DataJpaTest'),
    nest('c8-testing', 'c8-testentitymanager', 'TestEntityManager'),
    nest('c8-testing', 'c8-testcontainers-postgres', 'PostgreSQL Testcontainers'),
    nest('c8-testing', 'c8-h2-dialect-traps', 'H2 Dialect Traps'),
    nest('c8-testing', 'c8-repository-query-tests', 'Repository Query Tests'),
    nest('c8-testing', 'c8-nplus1-tests', 'N+1 Regression Tests'),
  ]),

  section('C8.15', 'API Boundaries, DTOs & Production Patterns', 133, [
    item('c8-orm-abuse', 'Avoiding ORM Abuse'),
    nest('c8-orm-abuse', 'c8-dto-boundaries', 'DTO Boundaries and Entity Exposure'),
    nest('c8-orm-abuse', 'c8-aggregate-boundaries', 'Aggregate Boundaries'),
    nest('c8-orm-abuse', 'c8-transaction-script-vs-rich-domain', 'Transaction Script vs Rich Domain'),
    nest('c8-orm-abuse', 'c8-entity-serialization', 'Jackson Serialization of Entities'),
    nest('c8-orm-abuse', 'c8-osiv-production-tradeoff', 'OSIV Production Trade-off', 'tier2'),
    nest('c8-orm-abuse', 'c8-when-to-use-native-sql', 'When to Use Native SQL or JDBC'),
  ]),

  section('C8.16', 'Interview Scenarios & Troubleshooting', 134, [
    item('c8-troubleshooting', 'JPA/Hibernate Troubleshooting'),
    nest('c8-troubleshooting', 'c8-debug-generated-sql', 'Debugging Generated SQL'),
    nest('c8-troubleshooting', 'c8-detached-entity-passed-to-persist', 'detached entity passed to persist'),
    nest('c8-troubleshooting', 'c8-transient-object-exception', 'TransientObjectException'),
    nest('c8-troubleshooting', 'c8-stale-object-state-exception', 'StaleObjectStateException'),
    nest('c8-troubleshooting', 'c8-connection-leak-symptoms', 'Connection Leak Symptoms'),
    nest('c8-troubleshooting', 'c8-production-query-spike', 'Production Query Spike Investigation'),
  ]),
]
