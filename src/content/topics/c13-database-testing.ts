import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Database testing verifies persistence layer: SQL correctness, constraints, transactions, migrations, and ORM mappings. Uses @DataJpaTest for repository slice, Testcontainers for real PostgreSQL, Flyway/Liquibase migration tests, and optionally DBUnit for fixture comparison.',
  whyExists:
    'H2 and mocks miss dialect-specific behavior: JSON columns, partial indexes, MVCC isolation, foreign keys, and check constraints. A query that passes in memory fails in production. Database tests catch schema drift and broken queries before deploy.',
  mentalModel:
    'Spin up real Postgres (Testcontainers), apply migrations, run repository/integration tests, tear down. Each test gets clean state via @Transactional rollback, @Sql scripts, or truncate between tests.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Approach', 'Pros', 'Cons'],
      rows: [
        ['@DataJpaTest + Testcontainers', 'Real SQL, fast slice', 'Needs Docker in CI'],
        ['@Sql scripts', 'Explicit fixture data', 'Maintenance overhead'],
        ['@Transactional rollback', 'Auto cleanup per test', 'Hides commit behavior bugs'],
        ['Flyway test migrate', 'Validates migrations apply', 'Slower startup'],
        ['Testcontainers reuse', 'Shared container across class', 'Watch isolation'],
      ],
    },
    {
      type: 'list',
      items: [
        'Test custom @Query JPQL/native SQL against real planner behavior.',
        'Verify unique constraint throws DataIntegrityViolationException.',
        'Test optimistic locking @Version increment on concurrent update.',
        'Migration test: empty DB → flyway migrate → smoke query.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: '@DataJpaTest with Testcontainers PostgreSQL',
      code: `@DataJpaTest
@Testcontainers
class OrderRepositoryTest {
  @Container
  static PostgreSQLContainer<?> pg = new PostgreSQLContainer<>("postgres:16-alpine");

  @DynamicPropertySource
  static void datasource(DynamicPropertyRegistry r) {
    r.add("spring.datasource.url", pg::getJdbcUrl);
  }

  @Autowired OrderRepository repo;

  @Test
  void enforcesUniqueOrderNumber() {
    repo.save(order("ORD-1"));
    assertThatThrownBy(() -> repo.save(order("ORD-1")))
        .isInstanceOf(DataIntegrityViolationException.class);
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        '@DataJpaTest auto-configures JPA, repos, TestEntityManager — rolls back by default.',
        'Testcontainers Ryuk reaps containers; reuse mode speeds CI with care.',
        'spring.jpa.hibernate.ddl-auto=validate in prod-like tests catches entity/schema mismatch.',
        'Explain analyze in test can assert index usage for critical queries.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Catches Postgres-specific bugs', 'Validates migrations', 'Confidence in custom SQL'],
    disadvantages: ['Slower than H2', 'Docker required in CI', 'Flaky if tests share dirty state'],
    alternatives: ['H2 for simple CRUD only', 'In-memory fake repository in unit tests'],
    whenToUse: ['Custom queries', 'Constraints and transactions', 'Migration pipelines'],
    whenNotToUse: ['Pure domain logic with mocked repo'],
  },
  failureModes: [
    'H2 passes, Postgres fails on JSONB or ILIKE',
    '@Transactional test never commits — misses trigger/on-commit logic',
    'Shared container dirty data between parallel tests',
    'Tests against prod-like schema but seed uses wrong dialect',
    'No test for migration rollback/idempotency',
  ],
  production: {
    reliability: ['Testcontainers in CI mandatory for JPA projects', 'Migration test on every schema PR'],
    maintainability: ['Factory methods for test entities', 'Minimal @Sql — prefer builders'],
    performance: ['Reuse container per JVM', 'Tag slow DB tests separately'],
  },
  interview: {
    expectations: ['Testcontainers over H2 why', '@DataJpaTest scope', 'Test constraint violation'],
    commonQuestions: ['How test JPA repository?', 'H2 vs Testcontainers?'],
    followUps: ['Test migration with Flyway?', '@Transactional rollback caveat?'],
    misconceptions: ['Mock repository enough for DB layer', 'H2 identical to Postgres'],
    traps: ['Only test save/find — skip custom queries'],
    strongSignals: ['Testcontainers + DynamicPropertySource', 'Constraint exception test', 'Migration smoke test'],
  },
  keyTakeaways: [
    'Use real PostgreSQL (Testcontainers) for repository tests.',
    '@DataJpaTest loads JPA slice; rolls back by default.',
    'Test constraints, custom SQL, locking, and migrations.',
    'H2 diverges — do not trust for Postgres-specific features.',
    'Watch @Transactional hiding commit-time behavior.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why Testcontainers for DB tests?', answerHint: 'Real Postgres behavior: constraints, types, MVCC, indexes.' },
    { level: 'intermediate', question: '@DataJpaTest vs @SpringBootTest for repo?', answerHint: 'DataJpaTest: JPA slice only, faster; BootTest: full context, slower.' },
    { level: 'advanced', question: 'Risk of @Transactional test rollback?', answerHint: 'Never commits — misses after-commit listeners, triggers needing commit.' },
  ],
  flashcards: [
    { front: 'Testcontainers', back: 'Docker containers in tests for real Postgres/Redis/etc.' },
    { front: '@DynamicPropertySource', back: 'Wire Testcontainer JDBC URL into Spring test context' },
    { front: 'DataIntegrityViolationException', back: 'Thrown on unique/FK constraint violation in Spring Data' },
  ],
  quickRevision: [
    'Testcontainers Postgres',
    '@DataJpaTest slice',
    'Test constraints',
    'H2 not enough',
    'Migration smoke test',
  ],
}
