import type { Priority } from '@/domain/types'
import type { SectionSeed, TopicSeed } from './build'

const TESTING = ['testing'] as const
const M34 = [3, 4]
const M56 = [5, 6]
const M78 = [7, 8]

function item(
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  const { tags, executionPriority, ...rest } = extra
  const months =
    extra.months ??
    (priority === 'tier1' ? M34 : priority === 'tier2' ? M56 : M78)
  return {
    id,
    title,
    priority,
    months,
    tags: [...TESTING, ...(tags ?? [])],
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
 * C13.1–C13.14 — backend testing for experienced Java/Spring engineers.
 * Focus: test strategy, isolation boundaries, Spring slices, Testcontainers,
 * contracts, flaky-test control, and CI quality gates — not only “write a unit test”.
 * JPA persistence testing depth overlaps C8; reliability chaos drills overlap C12;
 * CI tooling depth overlaps C14. Existing C13 topic IDs remain stable.
 */
export const TRACK_C_TESTING_SECTIONS: SectionSeed[] = [
  section('C13.1', 'Testing Strategy & the Pyramid', 196, [
    item('c13-testing-strategy', 'Testing Strategy'),
    nest('c13-testing-strategy', 'c13-test-pyramid', 'Test Pyramid vs Ice-Cream Cone'),
    nest('c13-testing-strategy', 'c13-what-to-test', 'What to Test vs What Not to Test'),
    nest('c13-testing-strategy', 'c13-risk-based-testing', 'Risk-Based Test Selection'),
    nest('c13-testing-strategy', 'c13-fast-feedback', 'Fast Feedback Loops'),
    nest('c13-testing-strategy', 'c13-testing-trophy', 'Testing Trophy / Honeycomb Variants', 'tier2'),
  ]),

  section('C13.2', 'Unit Testing', 197, [
    item('c13-unit-testing', 'Unit Testing'),
    nest('c13-unit-testing', 'c13-aaa-pattern', 'Arrange–Act–Assert'),
    nest('c13-unit-testing', 'c13-behavior-vs-implementation', 'Behavior vs Implementation Coupling'),
    nest('c13-unit-testing', 'c13-pure-logic-tests', 'Pure Domain / Pure Function Tests'),
    nest('c13-unit-testing', 'c13-parameterized-tests', 'Parameterized & Property-Style Inputs'),
    nest('c13-unit-testing', 'c13-unit-anti-patterns', 'Unit-Test Anti-Patterns'),
  ]),

  section('C13.3', 'JUnit 5', 198, [
    item('c13-junit', 'JUnit'),
    nest('c13-junit', 'c13-junit5-lifecycle', 'Lifecycle: @BeforeEach / @AfterEach / Extensions'),
    nest('c13-junit', 'c13-assertions-assumptions', 'Assertions & Assumptions'),
    nest('c13-junit', 'c13-nested-display-name', '@Nested & Display Names'),
    nest('c13-junit', 'c13-junit-extensions', 'Extension Model'),
    nest('c13-junit', 'c13-junit4-migration', 'JUnit 4 → 5 Migration Notes', 'tier2'),
  ]),

  section('C13.4', 'Mockito & Test Doubles', 199, [
    item('c13-mockito', 'Mockito'),
    nest('c13-mockito', 'c13-stubs-mocks-fakes', 'Stubs, Mocks, Fakes & Spies'),
    nest('c13-mockito', 'c13-verify-interactions', 'verify() & Argument Captors'),
    nest('c13-mockito', 'c13-when-not-to-mock', 'When Not to Mock'),
    nest('c13-mockito', 'c13-lenient-strictness', 'Strict Stubbing & Unnecessary Stubbing'),
    nest('c13-mockito', 'c13-bddmockito', 'BDDMockito Style', 'tier2'),
  ]),

  section('C13.5', 'Integration Testing', 200, [
    item('c13-integration-testing', 'Integration Testing'),
    nest('c13-integration-testing', 'c13-narrow-vs-broad', 'Narrow vs Broad Integration Tests'),
    nest('c13-integration-testing', 'c13-real-collaborators', 'Real Collaborators vs Doubles'),
    nest('c13-integration-testing', 'c13-test-data-management', 'Test Data Setup & Cleanup'),
    nest('c13-integration-testing', 'c13-hermetic-tests', 'Hermetic / Deterministic Integration'),
    nest('c13-integration-testing', 'c13-shared-fixtures', 'Shared Fixtures & Pollution', 'tier2'),
  ]),

  section('C13.6', 'API & Web-Layer Testing', 201, [
    item('c13-api-testing', 'API Testing'),
    nest('c13-api-testing', 'c13-mockmvc', 'MockMvc'),
    nest('c13-api-testing', 'c13-webtestclient', 'WebTestClient', 'tier2'),
    nest('c13-api-testing', 'c13-rest-assured', 'REST Assured / HTTP Client Tests', 'tier2'),
    nest('c13-api-testing', 'c13-status-payload-headers', 'Status, Payload, Headers & Errors'),
    nest('c13-api-testing', 'c13-auth-in-api-tests', 'AuthN/AuthZ in API Tests'),
  ]),

  section('C13.7', 'Database Testing', 202, [
    item('c13-database-testing', 'Database Testing', 'tier1', {
      related: ['c8-troubleshooting'],
    }),
    nest('c13-database-testing', 'c13-datajpatest', '@DataJpaTest'),
    nest('c13-database-testing', 'c13-transactional-rollback', '@Transactional Rollback Semantics'),
    nest('c13-database-testing', 'c13-schema-migration-tests', 'Migration / Flyway Compatibility Checks'),
    nest('c13-database-testing', 'c13-sql-assertion', 'Asserting SQL Side Effects'),
    nest('c13-database-testing', 'c13-h2-vs-postgres', 'H2 vs Real PostgreSQL Gaps'),
  ]),

  section('C13.8', 'Testcontainers', 203, [
    item('c13-testcontainers', 'Testcontainers', 'tier2', { months: M56 }),
    nest('c13-testcontainers', 'c13-generic-container', 'GenericContainer & Modules', 'tier2'),
    nest('c13-testcontainers', 'c13-postgres-container', 'PostgreSQL Container', 'tier2', {
      related: ['c8-testcontainers-postgres'],
    }),
    nest('c13-testcontainers', 'c13-reuse-ryuk', 'Reuse, Ryuk & CI Resource Cost', 'tier2'),
    nest('c13-testcontainers', 'c13-kafka-redis-containers', 'Kafka / Redis Containers', 'tier2'),
    nest('c13-testcontainers', 'c13-testcontainers-anti-patterns', 'Testcontainers Anti-Patterns', 'tier2'),
  ]),

  section('C13.9', 'Contract Testing', 204, [
    item('c13-contract-testing', 'Contract Testing', 'tier2', { months: M56 }),
    nest('c13-contract-testing', 'c13-consumer-driven-contracts', 'Consumer-Driven Contracts', 'tier2'),
    nest('c13-contract-testing', 'c13-pact-spring-cloud', 'Pact / Spring Cloud Contract', 'tier2'),
    nest('c13-contract-testing', 'c13-schema-contracts', 'Schema Contracts (OpenAPI / AsyncAPI)', 'tier2'),
    nest('c13-contract-testing', 'c13-breaking-contract-detection', 'Breaking Change Detection', 'tier2'),
  ]),

  section('C13.10', 'Spring Boot Test Slices & Context', 205, [
    item('c13-spring-boot-testing', 'Spring Boot Testing'),
    nest('c13-spring-boot-testing', 'c13-springboottest', '@SpringBootTest'),
    nest('c13-spring-boot-testing', 'c13-webmvc-test', '@WebMvcTest'),
    nest('c13-spring-boot-testing', 'c13-json-test', '@JsonTest', 'tier2'),
    nest('c13-spring-boot-testing', 'c13-mockbean-spybean', '@MockBean / @SpyBean Pitfalls'),
    nest('c13-spring-boot-testing', 'c13-context-caching', 'ApplicationContext Caching & DirtiesContext'),
  ]),

  section('C13.11', 'Async, Messaging & Time', 206, [
    item('c13-async-messaging-testing', 'Async & Messaging Tests', 'tier2', { months: M56 }),
    nest('c13-async-messaging-testing', 'c13-awaitility', 'Awaitility for Async Assertions', 'tier2'),
    nest('c13-async-messaging-testing', 'c13-kafka-test', 'Kafka Listener / Producer Tests', 'tier2'),
    nest('c13-async-messaging-testing', 'c13-clock-time', 'Clock / Time Abstraction', 'tier2'),
    nest('c13-async-messaging-testing', 'c13-flaky-tests', 'Flaky Test Diagnosis & Quarantine', 'tier2'),
    nest('c13-async-messaging-testing', 'c13-concurrency-tests', 'Concurrency & Race Tests', 'tier2'),
  ]),

  section('C13.12', 'Load, Performance & Resilience Tests', 207, [
    item('c13-load-testing', 'Load Testing', 'tier2', { months: M78 }),
    nest('c13-load-testing', 'c13-latency-slos-in-tests', 'Latency SLOs in Load Tests', 'tier2'),
    nest('c13-load-testing', 'c13-k6-jmeter-gatling', 'k6 / JMeter / Gatling Overview', 'tier2'),
    nest('c13-load-testing', 'c13-soak-spike', 'Soak, Spike & Stress Profiles', 'tier2'),
    nest('c13-load-testing', 'c13-perf-regressions', 'Performance Regression Gates', 'tier2'),
    nest('c13-load-testing', 'c13-chaos-in-test', 'Fault Injection in Test Envs', 'tier2', {
      related: ['c12-chaos-testing'],
    }),
  ]),

  section('C13.13', 'Coverage, Mutation & Quality Gates', 208, [
    item('c13-coverage-quality', 'Coverage & Quality Gates', 'tier2', { months: M56 }),
    nest('c13-coverage-quality', 'c13-line-branch-coverage', 'Line vs Branch Coverage Limits', 'tier2'),
    nest('c13-coverage-quality', 'c13-mutation-testing', 'Mutation Testing (PIT)', 'tier2'),
    nest('c13-coverage-quality', 'c13-static-analysis-tests', 'Static Analysis Alongside Tests', 'tier2'),
    nest('c13-coverage-quality', 'c13-meaningful-assertions', 'Meaningful Assertions over Coverage Chasing', 'tier2'),
  ]),

  section('C13.14', 'CI Strategy & Production Confidence', 209, [
    item('c13-ci-testing-strategy', 'CI Testing Strategy', 'tier2', { months: M56 }),
    nest('c13-ci-testing-strategy', 'c13-test-sharding', 'Parallelization & Sharding', 'tier2'),
    nest('c13-ci-testing-strategy', 'c13-pr-vs-nightly', 'PR Checks vs Nightly Suites', 'tier2'),
    nest('c13-ci-testing-strategy', 'c13-test-ownership', 'Test Ownership & Failure Triage', 'tier2'),
    nest('c13-ci-testing-strategy', 'c13-shift-left-right', 'Shift-Left and Shift-Right Testing', 'tier2'),
    nest('c13-ci-testing-strategy', 'c13-testing-checklist', 'Production-Confidence Checklist', 'tier2'),
  ]),
]
