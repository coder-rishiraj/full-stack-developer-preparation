import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Contract testing verifies API compatibility between consumer and provider without full integrated environment — consumer defines expected request/response; provider verifies it satisfies contract. Pact and Spring Cloud Contract generate tests from shared contract — catch breaking changes before deploy.',
  whyExists:
    'Microservices break when provider changes field types or removes endpoints — integration tests in monolithic staging miss combinatorial pairs. Contract tests run fast in CI per service, shifting integration left and enabling independent deploys with confidence.',
  mentalModel:
    'Written agreement between teams. Consumer says "I call GET /users/1 and expect {id, name}". Provider CI runs test proving it still returns that shape. Break contract — provider build fails before consumer discovers in prod.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Role', 'Action'],
      rows: [
        ['Consumer', 'Writes pact/contract expectations; tests against mock provider'],
        ['Provider', 'Verifies incoming requests match and responses satisfy pact'],
        ['Broker', 'Pact Broker stores versions; can-i-deploy gate'],
        ['Spring Cloud Contract', 'Groovy/YAML contracts generate stub + verifier tests'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Pact consumer-driven flow',
      diagram: `flowchart LR
  C[Consumer test] -->|generates pact JSON| Broker[Pact Broker]
  Broker --> P[Provider verify job]
  P -->|pass/fail| CI[Deploy gate]`,
    },
    {
      type: 'list',
      items: [
        'Consumer-driven: consumer defines needs; provider must not break without negotiation.',
        'Provider states: given user exists when GET /users/1 then return 200 body.',
        'Version contracts with consumer name + version in broker.',
        'can-i-deploy checks consumer-producer compatibility matrix before prod promote.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Pact consumer test (JUnit 5)',
      code: `@ExtendWith(PactConsumerTestExt.class)
@PactTestFor(providerName = "user-service")
class UserClientPactTest {
  @Pact(consumer = "order-service")
  public RequestResponsePact getUser(PactDslWithProvider builder) {
    return builder
        .given("user 1 exists")
        .uponReceiving("get user by id")
        .path("/users/1")
        .method("GET")
        .willRespondWith()
        .status(200)
        .body(new PactDslJsonBody().numberType("id").stringType("name"))
        .toPact();
  }

  @Test
  void fetchUser(MockServer mockServer) {
    UserClient client = new UserClient(mockServer.getUrl());
    assertThat(client.getUser(1).name()).isNotBlank();
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Matching rules: type vs exact value — flexible evolution (add optional field OK).',
        'Message pact for Kafka async contracts — consumer expects event schema.',
        'Provider states setup test data preconditions in provider verify.',
        'Bi-directional contracts emerging — both sides contribute.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Fast CI feedback', 'Independent deploys', 'Documents API expectations as code'],
    disadvantages: ['Contract maintenance overhead', 'Does not test full wiring or infra', 'False confidence if contracts stale'],
    alternatives: ['Full integration test suite', 'OpenAPI diff breaking change detection', 'Consumer-driven schema registry (Avro)'],
    whenToUse: ['Many microservice pairs', 'Frequent independent releases', 'API-first teams'],
    whenNotToUse: ['Two-service monolith split — integration tests enough', 'Unstable API still in flux daily'],
  },
  failureModes: [
    'Overly strict exact body match — brittle on harmless changes',
    'Contracts not published to broker — verify skipped',
    'Provider passes stub but real DB returns different shape',
    'Message contracts ignore ordering/partition semantics',
    'can-i-deploy bypassed — broken combo reaches prod',
  ],
  production: {
    reliability: ['can-i-deploy gate in CD pipeline', 'Broker retention of contract versions'],
    maintainability: ['Matching rules for optional fields', 'Consumer team owns pact generation'],
    observability: ['Track contract verification failures in CI dashboards'],
    performance: ['Contract tests milliseconds vs minutes integration'],
  },
  interview: {
    expectations: ['Consumer vs provider role', 'Pact broker purpose', 'vs integration test scope'],
    commonQuestions: ['Test microservice API compatibility?', 'Consumer-driven contracts?'],
    followUps: ['Breaking change policy?', 'Async Kafka contracts?'],
    misconceptions: ['Contract tests replace all integration tests', 'OpenAPI alone enforces compatibility'],
    traps: ['Exact JSON snapshot matching every field'],
    strongSignals: ['can-i-deploy', 'Matching rules', 'Provider states', 'Message pact'],
  },
  keyTakeaways: [
    'Contract tests verify consumer-provider API agreement in isolation.',
    'Consumer-driven: consumer defines expectations; provider verifies.',
    'Pact Broker coordinates versions and deploy gates.',
    'Complement not replace integration/E2E tests.',
    'Use flexible matching rules for evolvable schemas.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Contract testing vs integration testing?', answerHint: 'Contract: isolated consumer-provider API shape; integration: full wired system with real infra.' },
    { level: 'intermediate', question: 'Consumer-driven contracts meaning?', answerHint: 'Consumer writes expected interactions; provider must satisfy without breaking consumer builds.' },
    { level: 'advanced', question: 'Provider adds optional field — break contract?', answerHint: 'No if matching rules allow unknown fields; strict exact match would fail unnecessarily.' },
  ],
  flashcards: [
    { front: 'Pact Broker', back: 'Stores contract versions; supports can-i-deploy checks' },
    { front: 'Provider verify', back: 'Provider CI replays consumer pacts against real controller' },
    { front: 'Provider state', back: 'Given clause setting up test preconditions' },
    { front: 'Message pact', back: 'Contract for async event payload between services' },
  ],
  quickRevision: ['Consumer writes pact', 'Provider verifies', 'Broker + can-i-deploy', 'Not full integration', 'Flexible matching'],
}
