import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Unit tests verify a single unit of code — one class or function — in isolation. Dependencies are replaced with test doubles (mocks, stubs, fakes). Fast, deterministic, no network, no database. Foundation of the test pyramid.',
  whyExists:
    'Integration tests are slow and brittle; E2E tests are expensive. Unit tests give instant feedback on logic, edge cases, and regressions during refactors. They document expected behavior and enable TDD.',
  mentalModel:
    'Test the unit, fake the world. Arrange inputs and mocks, Act on the unit under test, Assert outcomes and interactions. If you need Spring context or real DB, it is not a unit test.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'AAA pattern: Arrange (setup), Act (invoke), Assert (verify).',
        'One logical assertion focus per test — name describes scenario.',
        'Mock external collaborators; do not mock the class under test.',
        'Test behavior (outputs, state changes) not implementation (private method calls).',
        'Parameterized tests (@ParameterizedTest) for input matrices.',
      ],
    },
    {
      type: 'table',
      headers: ['Double type', 'Purpose'],
      rows: [
        ['Stub', 'Returns canned data'],
        ['Mock', 'Verifies interactions (times called, arguments)'],
        ['Fake', 'Working lightweight impl (in-memory repo)'],
        ['Spy', 'Partial real object with stubbed methods'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Pure unit test with Mockito',
      code: `@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
  @Mock PaymentGateway gateway;
  @InjectMocks OrderService service;

  @Test
  void chargesCustomerWhenOrderValid() {
    var order = new Order(100L, Money.of(50, "USD"));
    when(gateway.charge(order.total())).thenReturn(ChargeResult.ok("ch_1"));

    var result = service.placeOrder(order);

    assertThat(result.status()).isEqualTo(OrderStatus.PAID);
    verify(gateway).charge(order.total());
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'JUnit 5 lifecycle: @BeforeEach, @AfterEach, @Test, @DisplayName.',
        'Mockito uses bytecode or subclassing to create mocks at runtime.',
        'Static mocking (mockito-inline) for legacy static calls — use sparingly.',
        'Test isolation: no shared mutable static state between tests.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Milliseconds per test', 'Pinpoint failure location', 'Safe refactor guard', 'Documents contracts'],
    disadvantages: ['Mocks can drift from real behavior', 'Over-mocking couples tests to implementation', 'No wiring/integration coverage'],
    alternatives: ['Integration tests', 'Characterization tests', 'Property-based testing'],
    whenToUse: ['Business logic, validators, mappers, pure functions', 'Every bug fix gets a regression unit test'],
    whenNotToUse: ['ORM mapping correctness — use @DataJpaTest', 'HTTP contract — use MockMvc slice'],
  },
  failureModes: [
    'Testing private methods — brittle on refactor',
    'Overspecified verify() on every call — implementation coupling',
    'Shared test data mutated across tests — order-dependent flakiness',
    'Mock returns unrealistic data — passes unit, fails integration',
    'No tests for null/empty/boundary inputs',
  ],
  production: {
    maintainability: ['Fast suite runs on every commit', 'Naming: methodUnderTest_condition_expected'],
    reliability: ['Deterministic — no Thread.sleep without Awaitility', 'Parallel-safe test data'],
    performance: ['Keep unit suite under few minutes total', 'Avoid loading Spring in unit tests'],
  },
  interview: {
    expectations: ['AAA pattern', 'Mock vs stub', 'What to unit test vs integration test'],
    commonQuestions: ['Unit vs integration test?', 'What is mock?', 'How test void method?'],
    followUps: ['Test private method?', 'Too many mocks smell?'],
    misconceptions: ['100% coverage equals quality', 'Unit tests need database'],
    traps: ['verify every internal call — over-specification'],
    strongSignals: ['Test pyramid', 'Behavior over implementation', 'Parameterized edge cases'],
  },
  keyTakeaways: [
    'Unit test one class in isolation with doubles for deps.',
    'Fast, deterministic, no I/O — run on every save.',
    'Assert behavior and outputs, not private internals.',
    'Mocks verify interactions; stubs return canned data.',
    'Complement with slice/integration tests for wiring.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Unit vs integration test?', answerHint: 'Unit: isolated, mocked deps, fast; integration: real wiring/DB.' },
    { level: 'intermediate', question: 'Mock vs stub?', answerHint: 'Stub returns data; mock also verifies call count/args.' },
    { level: 'advanced', question: 'When is mocking harmful?', answerHint: 'When mock diverges from real API; over-specified tests; testing framework not domain.' },
  ],
  flashcards: [
    { front: 'AAA pattern', back: 'Arrange, Act, Assert' },
    { front: 'Test double', back: 'Generic term: mock, stub, fake, spy' },
    { front: 'Unit test scope', back: 'Single class/function, dependencies faked' },
  ],
  quickRevision: [
    'Isolate unit',
    'Mock deps',
    'AAA pattern',
    'Behavior not internals',
    'Fast no I/O',
  ],
}
