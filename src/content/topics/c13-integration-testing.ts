import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Integration tests verify multiple components wired together: Spring context, real database, message broker, HTTP server. @SpringBootTest loads full or partial application; Testcontainers provide real infra; tests exercise paths unit tests cannot.',
  whyExists:
    'Unit tests with mocks prove class logic; they do not prove beans connect, transactions commit, security filters apply, or SQL runs on real DB. Integration tests fill the gap between slices and production — fewer, slower, higher confidence.',
  mentalModel:
    'Middle of pyramid: real wiring, real Postgres in Docker, maybe mock only external SaaS. One test per critical user journey (signup, checkout). Failures mean "system does not work together" not "one method wrong".',
  howItWorks: [
    {
      type: 'table',
      headers: ['Scope', 'Annotation', 'Loads'],
      rows: [
        ['Full IT', '@SpringBootTest(RANDOM_PORT)', 'Entire app + embedded/random port'],
        ['Slice IT', '@WebMvcTest + real service @Import', 'Hybrid — rare'],
        ['Repo IT', '@DataJpaTest + Testcontainers', 'Persistence only'],
        ['Kafka IT', '@SpringBootTest + Testcontainers Kafka', 'Producer/consumer wiring'],
      ],
    },
    {
      type: 'list',
      items: [
        'TestRestTemplate or WebTestClient hit localhost:RANDOM_PORT.',
        'WireMock stubs external HTTP APIs (payment, email).',
        'Awaitility waits for async message processing in tests.',
        'Separate @Tag("integration") — run nightly or post-merge, not every keystroke.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Full stack order flow integration test',
      code: `@SpringBootTest(webEnvironment = RANDOM_PORT)
@Testcontainers
class CheckoutFlowIT {
  @Container static PostgreSQLContainer<?> pg = new PostgreSQLContainer<>("postgres:16");

  @DynamicPropertySource
  static void props(DynamicPropertyRegistry r) {
    r.add("spring.datasource.url", pg::getJdbcUrl);
  }

  @Autowired TestRestTemplate rest;

  @Test
  void createsOrderAndReturns201() {
    var body = Map.of("productId", 1, "quantity", 2);
    var resp = rest.postForEntity("/api/v1/orders", body, OrderResponse.class);
    assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(resp.getBody().id()).isNotNull();
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        '@SpringBootTest context cache: first test slow, subsequent faster — @DirtiesContext resets expensive.',
        'spring.main.allow-bean-definition-overriding for test @MockBean replacements.',
        'Test profile (application-test.yml) points to Testcontainers endpoints.',
        'Random port avoids collisions in parallel CI workers.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['End-to-end wiring confidence', 'Catches config and bean errors', 'Validates real SQL and HTTP'],
    disadvantages: ['Slow — minutes for large suites', 'Flaky if timing/async not handled', 'Hard to debug failures'],
    alternatives: ['More slice tests + few IT', 'Staging smoke tests', 'Contract tests at boundaries'],
    whenToUse: ['Critical business flows', 'New service bootstrap', 'Regression after major refactor'],
    whenNotToUse: ['Every edge case — use unit tests', 'Load testing — use k6/Gatling'],
  },
  failureModes: [
    'Port already in use in parallel CI',
    'Race: assert before async consumer finishes',
    'Shared test data between IT classes',
    'Too many @SpringBootTest — 30min CI',
    'Mocking everything — IT becomes expensive unit test',
  ],
  production: {
    reliability: ['Dedicated integration CI stage with Docker', 'Awaitility for async assertions'],
    maintainability: ['Minimal IT count — pyramid discipline', 'Test data builders not copy-paste JSON'],
    performance: ['Context cache reuse', 'Container reuse with Testcontainers'],
  },
  interview: {
    expectations: ['Test pyramid placement', '@SpringBootTest vs slices', 'Testcontainers role'],
    commonQuestions: ['Integration vs unit test?', 'How test full checkout flow?'],
    followUps: ['Speed up integration suite?', 'WireMock for external API?'],
    misconceptions: ['All tests should be integration', 'IT replaces unit tests'],
    traps: ['@SpringBootTest for every controller method'],
    strongSignals: ['Tagged slow IT pipeline', 'WireMock + Testcontainers combo', 'Critical path only'],
  },
  keyTakeaways: [
    'Integration tests verify real component wiring and infra.',
    '@SpringBootTest + Testcontainers for critical flows.',
    'Fewer IT than unit — middle of test pyramid.',
    'WireMock external SaaS; real DB in Docker.',
    'Tag and run IT in separate CI stage.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Integration vs unit test?', answerHint: 'Integration: multiple real components wired; unit: one class, mocked deps.' },
    { level: 'intermediate', question: 'Why not only @SpringBootTest?', answerHint: 'Slow, flaky, hard to localize failures; pyramid favors many fast unit tests.' },
    { level: 'advanced', question: 'Test async Kafka consumer in IT?', answerHint: 'Publish message, Awaitility until DB row appears or consumer lag zero.' },
  ],
  flashcards: [
    { front: '@SpringBootTest RANDOM_PORT', back: 'Starts full app on random port for HTTP IT' },
    { front: 'Test pyramid', back: 'Many unit, fewer integration, few E2E' },
    { front: 'WireMock', back: 'Stub external HTTP services in integration tests' },
  ],
  quickRevision: [
    'Real wiring',
    'Testcontainers',
    'Few critical ITs',
    'Separate CI stage',
    'WireMock externals',
  ],
}
