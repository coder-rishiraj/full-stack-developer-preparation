import type { TopicContent } from '@/domain/types'

export const testingContent: TopicContent = {
  whatIsIt:
    'Spring Boot testing layers: @WebMvcTest (controller slice), @DataJpaTest (repository), @SpringBootTest (full context), MockMvc for HTTP assertions, @MockitoBean to override context beans, and Testcontainers for real PostgreSQL integration.',
  whyExists:
    'Full context tests are slow and flaky; slices load minimal beans for fast feedback. MockMvc tests HTTP contract without starting browser; Testcontainers validates SQL against real DB behavior MVCC/constraints.',
  mentalModel:
    'Unit test: plain JUnit + mocks, no Spring. Slice test: load only MVC or JPA layer. Integration test: @SpringBootTest + Testcontainers. Test pyramid — many fast unit/slice, fewer full IT. @Transactional tests roll back DB changes.',
  howItWorks: [
    {
      type: 'list',
      items: [
        '@WebMvcTest(UserController.class) + @MockitoBean UserService — MockMvc perform get/post.',
        '@DataJpaTest — in-memory or Testcontainers PostgreSQL; @Autowired TestEntityManager.',
        '@SpringBootTest(webEnvironment = RANDOM_PORT) + TestRestTemplate or WebTestClient.',
        '@MockitoBean overrides a bean in the test context; @MockitoSpyBean wraps a real bean.',
        '@Testcontainers + @Container static PostgreSQLContainer for shared DB.',
      ],
    },
    {
      type: 'table',
      headers: ['Annotation', 'Loads', 'Use'],
      rows: [
        ['@WebMvcTest', 'Web layer only', 'Controller JSON/status'],
        ['@DataJpaTest', 'JPA + repos', 'Query methods, mappings'],
        ['@JsonTest', 'Jackson', 'Serialization'],
        ['@SpringBootTest', 'Full application', 'End-to-end wiring'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Unit[Unit tests — mocks] --> Fast[Fast feedback]
  Slice[@WebMvcTest / @DataJpaTest] --> Med[Medium]
  IT[@SpringBootTest + Testcontainers] --> Slow[Slower confidence]`,
    caption: 'Test pyramid — prefer slices over full context',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: '@WebMvcTest with MockMvc',
      code: `@WebMvcTest(UserController.class)
class UserControllerTest {
  @Autowired MockMvc mockMvc;
  @MockitoBean UserService userService;

  @Test
  void returnsUser() throws Exception {
    when(userService.findById(1L)).thenReturn(new UserResponse(1L, "a@b.com", Instant.now()));

    mockMvc.perform(get("/api/v1/users/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value("a@b.com"));
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: '@DataJpaTest with Testcontainers',
      code: `@DataJpaTest
@Testcontainers
class UserRepositoryTest {
  @Container
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

  @DynamicPropertySource
  static void props(DynamicPropertyRegistry r) {
    r.add("spring.datasource.url", postgres::getJdbcUrl);
    r.add("spring.datasource.username", postgres::getUsername);
    r.add("spring.datasource.password", postgres::getPassword);
  }

  @Autowired UserRepository repo;

  @Test
  void findsByEmail() {
    repo.save(new User("test@example.com"));
    assertThat(repo.findByEmail("test@example.com")).isPresent();
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: '@SpringBootTest integration',
      code: `@SpringBootTest(webEnvironment = RANDOM_PORT)
class OrderFlowIT {
  @Autowired TestRestTemplate rest;

  @Test
  void createOrder() {
    var response = rest.postForEntity("/api/v1/orders", request, OrderResponse.class);
    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        '@MockitoBean uses a Mockito mock in the ApplicationContext — slower than a pure unit test.',
        'Test slice excludes @Service unless @Import — controller test mocks service.',
        '@DirtiesContext resets context if test mutates beans — expensive.',
        'spring-boot-testcontainers auto-starts containers (Boot 3.1+).',
        '@Transactional on test rolls back JPA after each test method (default Spring test).',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Slices fast and focused',
      'MockMvc tests full HTTP layer including validation',
      'Testcontainers catches Postgres-specific behavior',
    ],
    disadvantages: [
      '@SpringBootTest slow for large context',
      '@MockitoBean can hide integration bugs',
      'Testcontainers needs Docker in CI',
    ],
    alternatives: [
      'H2 for JPA tests — fast but dialect differences',
      'Contract tests (Pact) for API consumers',
    ],
    whenToUse: [
      '@WebMvcTest for every controller',
      'Testcontainers for repository SQL',
      '@SpringBootTest for critical paths only',
    ],
    whenNotToUse: [
      '@SpringBootTest for every unit scenario',
      'H2 when using PostgreSQL-specific SQL',
    ],
  },
  failureModes: [
    '@WebMvcTest loads security — 401 unless @AutoConfigureMockMvc(addFilters = false) or @WithMockUser.',
    'MockitoBean type or name mismatch — context fails to start.',
    'Shared mutable state between tests without @Transactional rollback.',
    'H2 passes but PostgreSQL JSON/constraint fails in prod.',
    'Testing implementation details not behavior.',
  ],
  production: {
    maintainability: ['Test naming: method_condition_expected; AAA pattern'],
    reliability: ['CI runs Testcontainers; parallel test isolation'],
  },
  interview: {
    expectations: [
      '@WebMvcTest vs @SpringBootTest',
      'MockMvc and @MockitoBean',
      'Testcontainers purpose',
    ],
    commonQuestions: [
      'How test REST controller in Spring Boot?',
      'Difference @MockitoBean and @Mock?',
      'Why Testcontainers over H2?',
    ],
    followUps: [
      '@Transactional test rollback?',
      'Test security with @WithMockUser?',
    ],
    misconceptions: [
      '@SpringBootTest required for all tests',
      '@Mock replaces a Spring context bean',
    ],
    traps: ['Only MockMvc with mocked service — zero integration coverage'],
    strongSignals: [
      'Test pyramid awareness',
      'Testcontainers for Postgres',
      '@WithMockUser for secured endpoints',
    ],
  },
  keyTakeaways: [
    '@WebMvcTest + MockMvc for controllers.',
    '@MockitoBean replaces context beans in slice tests.',
    '@DataJpaTest + Testcontainers for real SQL.',
    '@SpringBootTest sparingly for E2E.',
    '@Transactional rolls back DB in tests.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Test controller without starting full app?',
      answerHint: '@WebMvcTest + MockMvc + @MockitoBean dependencies.',
    },
    {
      level: 'intermediate',
      question: '@MockitoBean vs @Mock?',
      answerHint: '@MockitoBean overrides a bean in the Spring context; @Mock is a pure Mockito field.',
    },
    {
      level: 'advanced',
      question: 'Why Testcontainers for JPA tests?',
      answerHint: 'Real PostgreSQL behavior — constraints, types, MVCC — H2 diverges.',
    },
  ],
  flashcards: [
    { front: '@WebMvcTest loads', back: 'Web layer slice — controllers, MockMvc' },
    { front: '@MockitoBean', back: 'Mockito mock as Spring bean override' },
    { front: 'MockMvc perform', back: 'Simulate HTTP and assert status/jsonPath' },
  ],
  quickRevision: [
    'Test pyramid',
    '@WebMvcTest + MockMvc',
    '@MockitoBean not @Mock',
    'Testcontainers Postgres',
    '@DataJpaTest repos',
    '@SpringBootTest E2E sparse',
    '@WithMockUser security',
  ],
}

export const content = testingContent
