import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'JUnit 5 (Jupiter) is the standard Java test framework. Provides @Test, lifecycle annotations, assertions, parameterized tests, dynamic tests, extensions (Mockito, Spring), and test discovery via IDE and Maven/Gradle.',
  whyExists:
    'Consistent test structure across Java projects. Integrates with build tools (fail build on test failure), CI pipelines, and reporting. Extensions replace brittle inheritance-based setup from JUnit 4.',
  mentalModel:
    'Each @Test method is a small program that throws AssertionError on failure. Extensions wrap tests like middleware: setup, teardown, dependency injection, timeout enforcement.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Annotation', 'Purpose'],
      rows: [
        ['@Test', 'Mark test method'],
        ['@BeforeEach / @AfterEach', 'Run before/after each test'],
        ['@BeforeAll / @AfterAll', 'Once per class — must be static unless @TestInstance(PER_CLASS)'],
        ['@ParameterizedTest', 'Run same test with multiple inputs'],
        ['@Disabled', 'Skip test with reason'],
        ['@DisplayName', 'Human-readable test name'],
        ['@ExtendWith', 'Register extension (MockitoExtension, SpringExtension)'],
      ],
    },
    {
      type: 'list',
      items: [
        'Assertions: assertEquals, assertThrows, assertTimeout, AssertJ fluent assertions preferred.',
        '@Nested inner classes group related tests with shared @BeforeEach.',
        'Tag tests (@Tag("slow")) to exclude from fast CI job.',
        'Maven Surefire / Gradle test task discovers *Test.java by convention.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'JUnit 5 parameterized and assertThrows',
      code: `@ParameterizedTest
@ValueSource(strings = {"", "  ", "bad-email"})
void rejectsInvalidEmail(String email) {
  assertThatThrownBy(() -> validator.validate(email))
      .isInstanceOf(ValidationException.class);
}

@Test
void completesWithinTimeout() {
  assertTimeout(Duration.ofMillis(500), () -> service.heavyCompute());
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Test engine discovers methods via reflection; order not guaranteed unless @Order.',
        'Extensions implement BeforeEachCallback, ParameterResolver, etc. — composable.',
        'JUnit Platform runs multiple engines (Jupiter, Vintage for JUnit 4).',
        'Parallel execution (junit.jupiter.execution.parallel.enabled) needs thread-safe tests.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Industry standard', 'Rich extension model', 'IDE green/red feedback', 'CI integration'],
    disadvantages: ['Learning curve vs JUnit 4 migration', 'Parallel tests need discipline', 'Slow tests in same module block feedback'],
    alternatives: ['TestNG', 'Spock (Groovy)', 'Plain main() — not for production codebases'],
    whenToUse: ['All Java/Spring projects', 'TDD and regression suites'],
    whenNotToUse: ['N/A for Java backend — default choice'],
  },
  failureModes: [
    '@BeforeAll not static — test class fails to load',
    'Test order dependency — flaky when parallelized',
    'assertEquals on floats without delta',
    'Swallowed exceptions in test — false pass',
    '@Disabled without ticket — forgotten coverage gap',
  ],
  production: {
    maintainability: ['Consistent naming *Test suffix', '@DisplayName for readable CI reports'],
    reliability: ['Separate @Tag("integration") from unit in CI stages', 'Fail build on test failure — no skip without policy'],
    performance: ['Parallel unit tests where safe', 'Profile slow tests in Surefire report'],
  },
  interview: {
    expectations: ['@BeforeEach vs @BeforeAll', 'Parameterized tests', 'assertThrows usage'],
    commonQuestions: ['JUnit 4 vs 5?', 'How run subset of tests?', 'Test lifecycle?'],
    followUps: ['JUnit extensions?', 'Parallel test execution?'],
    misconceptions: ['Tests run in source order', '@Test on private method works without config'],
    traps: ['Shared mutable static in @BeforeAll'],
    strongSignals: ['Extension model explanation', 'AssertJ over raw assertions', 'Tag-based CI split'],
  },
  keyTakeaways: [
    'JUnit 5 uses annotations and extensions, not inheritance.',
    '@BeforeEach for per-test setup; @BeforeAll once per class.',
    'Parameterized tests reduce duplication for input matrices.',
    'assertThrows and assertTimeout for exception and SLA checks.',
    'Tag slow/integration tests for CI pipeline stages.',
  ],
  interviewQuestions: [
    { level: 'basic', question: '@BeforeEach vs @BeforeAll?', answerHint: 'Each test vs once per class; @BeforeAll static by default.' },
    { level: 'intermediate', question: 'How test exception thrown?', answerHint: 'assertThrows or AssertJ assertThatThrownBy.' },
    { level: 'advanced', question: 'JUnit 5 extension model?', answerHint: 'Composable callbacks (BeforeEachCallback, ParameterResolver) via @ExtendWith.' },
  ],
  flashcards: [
    { front: '@ExtendWith(MockitoExtension.class)', back: 'Injects @Mock and @InjectMocks fields' },
    { front: '@ParameterizedTest', back: 'Runs test multiple times with different arguments' },
    { front: 'Jupiter', back: 'JUnit 5 programming model engine name' },
  ],
  quickRevision: [
    'JUnit 5 Jupiter',
    '@BeforeEach setup',
    'ParameterizedTest',
    'assertThrows',
    '@Tag for CI split',
  ],
}
