import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Mockito is a Java mocking framework for unit tests. Creates mock objects, stubs method returns (when/thenReturn), verifies interactions (verify), captures arguments (ArgumentCaptor), and supports @Mock, @InjectMocks with JUnit 5 extension.',
  whyExists:
    'Real dependencies (DB, HTTP, message queues) make unit tests slow and flaky. Mockito lets you isolate the class under test and define expected collaborator behavior without implementing full fakes.',
  mentalModel:
    'Replace real dependency with a programmable puppet. Tell the puppet what to say when asked (stubbing). After acting on your code, check the puppet was asked correctly (verify). Never stub the system under test.',
  howItWorks: [
    {
      type: 'table',
      headers: ['API', 'Use'],
      rows: [
        ['when(x.foo()).thenReturn(y)', 'Stub return value'],
        ['when(x.foo()).thenThrow(ex)', 'Stub exception path'],
        ['verify(x).foo()', 'Assert method was called'],
        ['verify(x, never()).foo()', 'Assert not called'],
        ['@Mock / @InjectMocks', 'JUnit 5 field injection'],
        ['ArgumentCaptor', 'Inspect arguments passed to mock'],
      ],
    },
    {
      type: 'list',
      items: [
        'Strict stubs (Mockito 2+): unused stubs fail test — catches dead setup.',
        'lenient() for shared @BeforeEach stubs used by subset of tests.',
        'doReturn().when() for spies to avoid calling real method during stubbing.',
        'mockito-inline enables static and final class mocking — last resort.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Stub, verify, and ArgumentCaptor',
      code: `@Test
void publishesEventAfterSave() {
  var repo = mock(Repository.class);
  var bus = mock(EventBus.class);
  var service = new ItemService(repo, bus);

  when(repo.save(any())).thenAnswer(inv -> inv.getArgument(0));

  service.create(new Item("book"));

  var captor = ArgumentCaptor.forClass(ItemCreated.class);
  verify(bus).publish(captor.capture());
  assertThat(captor.getValue().name()).isEqualTo("book");
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Default mock: returns null/0/false/empty for unstubbed calls — can hide bugs.',
        'Mockito uses subclass or inline bytecode manipulation (mockito-inline).',
        'verify without stub still records invocations on mock.',
        '@InjectMocks tries constructor then setter injection of @Mock fields.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Readable when/verify syntax', 'JUnit integration', 'ArgumentCaptor for complex args'],
    disadvantages: ['Mocks diverge from production behavior', 'Over-verification couples to implementation', 'Cannot mock what you do not own easily without wrapper'],
    alternatives: ['Manual test doubles', 'WireMock for HTTP', 'Testcontainers for real deps'],
    whenToUse: ['Unit tests isolating one class', 'Verify side effects on collaborators'],
    whenNotToUse: ['Testing Spring wiring — use @MockBean in slice tests', 'When fake in-memory impl is simpler and reusable'],
  },
  failureModes: [
    'Stubbing void method with when() — use doNothing().when()',
    'Partial mock of class under test — tests wrong thing',
    'any() null matching surprises with nullable types',
    'UnnecessaryStubbingException — remove unused when()',
    'verify in wrong order when testing async — use timeout or Awaitility',
  ],
  production: {
    maintainability: ['Prefer stubbing returns over verify when output assertion suffices', 'Extract interfaces for mockable boundaries'],
    reliability: ['Strict stubs in CI', 'Avoid static mocks except legacy seams'],
  },
  interview: {
    expectations: ['when/thenReturn and verify', '@Mock vs manual mock()', 'Mock vs @MockBean in Spring'],
    commonQuestions: ['What is Mockito?', 'verify vs assert on return?', 'Mock static method?'],
    followUps: ['ArgumentCaptor use case?', 'Spy vs mock?'],
    misconceptions: ['Mockito replaces integration tests', 'verify everything called'],
    traps: ['Mock the class under test'],
    strongSignals: ['Behavior verification vs interaction over-spec', 'doReturn for spies', 'Strict stub awareness'],
  },
  keyTakeaways: [
    'Mockito stubs collaborator behavior and verifies calls.',
    'when().thenReturn() for returns; doThrow/doNothing for void methods.',
    'verify() checks interactions — use sparingly vs output assertions.',
    '@Mock + @InjectMocks with MockitoExtension for JUnit 5.',
    'Do not mock the system under test; avoid over-verification.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Stub vs verify in Mockito?', answerHint: 'Stub: define mock response; verify: assert method was called.' },
    { level: 'intermediate', question: '@Mock vs @MockBean?', answerHint: '@Mock pure Mockito; @MockBean replaces Spring context bean in slice tests.' },
    { level: 'advanced', question: 'Spy vs mock?', answerHint: 'Spy wraps real object — partial stubbing; mock is fully fake.' },
  ],
  flashcards: [
    { front: 'when().thenReturn()', back: 'Stub method return on mock' },
    { front: 'verify(mock, times(2))', back: 'Assert call count on mock' },
    { front: 'ArgumentCaptor', back: 'Capture arguments passed to mock for assertion' },
  ],
  quickRevision: [
    'when/thenReturn',
    'verify sparingly',
    '@Mock @InjectMocks',
    'doReturn for spies',
    'Never mock SUT',
  ],
}
