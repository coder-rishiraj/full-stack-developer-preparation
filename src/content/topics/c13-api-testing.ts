import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'API testing validates HTTP endpoints: status codes, headers, JSON body shape, validation errors, auth, and contract stability. Spring uses MockMvc (@WebMvcTest) or WebTestClient for slice tests; RestAssured or TestRestTemplate for integration tests against running server.',
  whyExists:
    'Controllers are the public contract. Bugs in routing, serialization, validation, or status mapping ship to clients. API tests catch contract breaks before mobile/web consumers do — cheaper than production incidents.',
  mentalModel:
    'Simulate HTTP client without browser. Send request, assert response contract. Test happy path, validation failures, auth denied, and edge payloads. Keep tests independent of HTML — JSON and status are truth.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Tool', 'Context', 'Strength'],
      rows: [
        ['MockMvc', '@WebMvcTest slice', 'Fast, no server port, mocks services'],
        ['WebTestClient', 'WebFlux or MVC reactive', 'Fluent assertions, async'],
        ['TestRestTemplate', '@SpringBootTest RANDOM_PORT', 'Full stack HTTP'],
        ['RestAssured', 'Any JVM HTTP API', 'BDD-style given/when/then'],
      ],
    },
    {
      type: 'list',
      items: [
        'Assert status, Content-Type, jsonPath on body fields.',
        '@WithMockUser or JWT test token for secured endpoints.',
        'Test 400 on invalid DTO, 404 on missing resource, 409 on conflict.',
        'Contract tests (Pact) for consumer-driven API compatibility.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'MockMvc POST validation test',
      code: `@WebMvcTest(OrderController.class)
class OrderApiTest {
  @Autowired MockMvc mvc;
  @MockBean OrderService orders;

  @Test
  @WithMockUser(roles = "CUSTOMER")
  void returns400WhenQuantityZero() throws Exception {
    mvc.perform(post("/api/v1/orders")
            .contentType(APPLICATION_JSON)
            .content("""
              {"productId":1,"quantity":0}
              """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.errors[0].field").value("quantity"));
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        '@WebMvcTest loads @Controller, @ControllerAdvice, Jackson — not full @Service unless @Import.',
        'Security filters active by default — 401 without @WithMockUser.',
        'MockMvc does not hit real network — tests MVC layer only.',
        'OpenAPI schema can generate contract tests or docs drift checks.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Fast controller feedback', 'Catches serialization and validation bugs', 'Documents API behavior'],
    disadvantages: ['@MockBean hides service integration bugs', 'Brittle jsonPath on large responses', 'Not full E2E without @SpringBootTest'],
    alternatives: ['Postman/Newman in CI', 'Pact consumer-driven contracts', 'Playwright for true E2E'],
    whenToUse: ['Every REST controller', 'Auth and validation paths', 'Breaking change detection'],
    whenNotToUse: ['Pure business logic — unit test service instead'],
  },
  failureModes: [
    'Only 200 tests — miss 4xx/5xx paths',
    'Hard-coded IDs break when seed data changes in IT',
    'Security disabled globally in tests — false confidence',
    'Assert entire JSON blob — brittle on additive fields',
    'No test for pagination, sorting, content negotiation',
  ],
  production: {
    maintainability: ['One test class per controller', 'Use jsonPath on critical fields not full body'],
    reliability: ['Run API slice in fast CI stage', 'Pact publish on API change'],
    observability: ['Track contract test failures in PR checks'],
  },
  interview: {
    expectations: ['MockMvc vs @SpringBootTest', 'Test secured endpoint', 'Assert JSON and status'],
    commonQuestions: ['How test REST API in Spring?', 'MockMvc vs TestRestTemplate?'],
    followUps: ['Contract testing with Pact?', 'Test file upload endpoint?'],
    misconceptions: ['Postman replaces automated API tests', 'MockMvc tests full stack'],
    traps: ['@AutoConfigureMockMvc(addFilters = false) everywhere — skips auth testing'],
    strongSignals: ['Happy + error paths', '@WithMockUser', 'jsonPath selective assertions'],
  },
  keyTakeaways: [
    'API tests assert HTTP contract: status, headers, JSON.',
    'MockMvc + @WebMvcTest for fast controller slice tests.',
    'Test validation, auth, 404, and error body shape.',
    '@WithMockUser for secured endpoints in slice tests.',
    'Complement with integration test for critical flows.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'How test controller without full app?', answerHint: '@WebMvcTest + MockMvc + @MockBean services.' },
    { level: 'intermediate', question: 'Test 401 on protected endpoint?', answerHint: 'Perform request without auth; expect unauthorized. Or @WithMockUser for authorized case.' },
    { level: 'advanced', question: 'Consumer-driven contract testing?', answerHint: 'Pact: consumer defines expected interaction; provider verifies against pact file in CI.' },
  ],
  flashcards: [
    { front: 'MockMvc', back: 'Spring test DSL to simulate HTTP without starting server' },
    { front: 'jsonPath', back: 'Assert JSON field in MockMvc response' },
    { front: '@WebMvcTest', back: 'Loads web layer slice only' },
  ],
  quickRevision: [
    'MockMvc slice',
    'Status + jsonPath',
    '@WithMockUser',
    'Test 4xx paths',
    'Pact for contracts',
  ],
}
