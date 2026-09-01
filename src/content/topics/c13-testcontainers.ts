import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Testcontainers spins up real Docker containers (PostgreSQL, Kafka, Redis, LocalStack) during JUnit tests — ephemeral infrastructure matching production behavior better than mocks. @Container static fields start once per class; @DynamicPropertySource wires Spring to random ports.',
  whyExists:
    'H2 in-memory DB misses Postgres-specific SQL, JSON operators, and constraint behavior. Mocked Kafka misses serialization and consumer group semantics. Testcontainers give integration confidence with throwaway real services without shared staging dependency.',
  mentalModel:
    'Mini production in a box per test class. JUnit starts postgres:16 container on random port; Spring datasource URL points there; tests run; container destroyed after class. Reuse mode keeps container warm between test classes for speed.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Pattern', 'Usage'],
      rows: [
        ['@Container static', 'One container per test class lifecycle'],
        ['@ServiceConnection', 'Spring Boot 3.1+ auto-configures datasource/Kafka'],
        ['@DynamicPropertySource', 'Manual property injection for older Boot'],
        ['GenericContainer', 'Custom images — LocalStack, WireMock in Docker'],
        ['Network', 'Multiple containers on shared Docker network'],
      ],
    },
    {
      type: 'list',
      items: [
        'Requires Docker daemon — CI must support Docker-in-Docker or socket mount.',
        'Ryuk sidecar reaps containers on JVM exit — disable only if understood.',
        'Singleton containers + reuse=true speed up suites — trade isolation.',
        'Wait strategies: Wait.forListeningPort(), log message, health check.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'PostgreSQL + Kafka Testcontainers with Spring Boot 3',
      code: `@SpringBootTest
@Testcontainers
class OrderIntegrationTest {
  @Container
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

  @Container
  static KafkaContainer kafka = new KafkaContainer(
      DockerImageName.parse("confluentinc/cp-kafka:7.5.0"));

  @DynamicPropertySource
  static void registerProps(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", postgres::getJdbcUrl);
    registry.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);
  }

  @Test
  void publishesOrderEvent() { /* ... */ }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Testcontainers pulls images on first run — cache in CI for speed.',
        'LocalStack emulates AWS S3/SQS/DynamoDB for cloud integration tests.',
        'JdbcDatabaseContainer runs init SQL scripts from classpath.',
        'Parallel test classes need unique containers or strict port randomization.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Real DB/broker behavior', 'Self-contained tests', 'No shared staging contention'],
    disadvantages: ['Slower than mocks', 'Requires Docker', 'Flaky if resource constrained CI'],
    alternatives: ['H2 for pure unit SQL', 'Embedded Kafka (less realistic)', 'Shared test DB — coupling'],
    whenToUse: ['Repository integration tests', 'Kafka consumer/producer wiring', 'Migration validation'],
    whenNotToUse: ['Pure unit logic', 'Every controller method — too slow'],
  },
  failureModes: [
    'Docker not available in CI — all IT skip or fail',
    'Image pull timeout on cold CI agent',
    'Port conflicts without random mapping',
    'Container start slower than @Timeout',
    'Shared reuse container dirty state between tests',
  ],
  production: {
    reliability: ['Ryuk enabled for cleanup', 'Health wait strategies not just port open'],
    performance: ['Reuse containers in dev/CI with testcontainers.reuse.enable', 'Pin image digests for reproducibility'],
    maintainability: ['Abstract base IT class with common containers', 'Tag @Tag("integration") slow tests'],
    cost: ['CI workers with enough RAM for Postgres+Kafka parallel'],
  },
  interview: {
    expectations: ['Why real container vs H2', '@DynamicPropertySource', 'Docker requirement in CI'],
    commonQuestions: ['Integration test with real Postgres?', 'Testcontainers vs embedded DB?'],
    followUps: ['Speed up Testcontainers suite?', 'Test AWS S3 integration?'],
    misconceptions: ['Testcontainers replaces unit tests', 'Same speed as mocks'],
    traps: ['Starting new container per test method'],
    strongSignals: ['@ServiceConnection', 'LocalStack for AWS', 'Reuse mode tradeoff', 'Wait strategies'],
  },
  keyTakeaways: [
    'Testcontainers run real services in Docker during tests.',
    'Better fidelity than H2/mocks for integration scenarios.',
    'Wire Spring via @DynamicPropertySource or @ServiceConnection.',
    'Requires Docker — configure CI accordingly.',
    'Reuse containers to balance speed vs isolation.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is Testcontainers?', answerHint: 'Java library starting throwaway Docker containers for integration tests with real Postgres/Kafka etc.' },
    { level: 'intermediate', question: 'Testcontainers vs H2?', answerHint: 'Testcontainers uses real Postgres — catches dialect/features H2 misses; slower but higher fidelity.' },
    { level: 'advanced', question: 'Speed up large Testcontainers suite?', answerHint: 'Reuse containers, singleton pattern, shared base class, parallel CI workers, pin cached images.' },
  ],
  flashcards: [
    { front: '@Container', back: 'JUnit 5 field declaring managed Docker container lifecycle' },
    { front: '@DynamicPropertySource', back: 'Injects container host/port into Spring test properties' },
    { front: 'LocalStack', back: 'Emulates AWS services in Docker for integration tests' },
    { front: 'Reuse mode', back: 'Keep container running between test classes — faster, less isolation' },
  ],
  quickRevision: ['Docker in tests', 'Real Postgres/Kafka', 'DynamicPropertySource', 'CI needs Docker', 'Reuse for speed'],
}
