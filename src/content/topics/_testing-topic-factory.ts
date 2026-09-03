import type { TopicContent } from '@/domain/types'

type TestingTopicInput = {
  title: string
  sectionTitle: string
  parentTitle?: string
}

const SECTION_FOCUS: Record<string, string> = {
  'Testing Strategy & the Pyramid':
    'pyramid vs ice-cream cone, risk-based selection, and optimizing for fast trustworthy feedback',
  'Unit Testing':
    'AAA, behavior-focused assertions, pure logic tests, and avoiding implementation-coupled tests',
  'JUnit 5':
    'lifecycle, assertions, nested tests, extensions, and modern JUnit 5 idioms',
  'Mockito & Test Doubles':
    'stubs vs mocks vs fakes, verification, strict stubbing, and when not to mock',
  'Integration Testing':
    'narrow vs broad scope, hermetic data, real collaborators, and fixture pollution control',
  'API & Web-Layer Testing':
    'MockMvc/WebTestClient, status/payload/auth assertions, and HTTP contract behavior',
  'Database Testing':
    '@DataJpaTest, transactional rollback, migrations, SQL side effects, and H2 vs Postgres gaps',
  Testcontainers:
    'real dependencies in Docker, reuse/cost in CI, and avoiding container anti-patterns',
  'Contract Testing':
    'consumer-driven contracts, Pact/Spring Cloud Contract, and schema breaking-change detection',
  'Spring Boot Test Slices & Context':
    '@SpringBootTest vs slices, @MockBean pitfalls, and ApplicationContext caching',
  'Async, Messaging & Time':
    'Awaitility, Kafka tests, clock abstraction, flaky quarantine, and concurrency tests',
  'Load, Performance & Resilience Tests':
    'latency SLOs, soak/spike profiles, regression gates, and controlled fault injection',
  'Coverage, Mutation & Quality Gates':
    'coverage limits, mutation testing, and meaningful assertions over vanity metrics',
  'CI Strategy & Production Confidence':
    'PR vs nightly suites, sharding, ownership, shift-left/right, and release confidence',
}

export function createTestingTopicContent({
  title,
  sectionTitle,
  parentTitle,
}: TestingTopicInput): TopicContent {
  const focus =
    SECTION_FOCUS[sectionTitle] ??
    'test strategy, isolation boundaries, and production-confidence trade-offs'
  const parent = parentTitle ? ` It is an atomic part of ${parentTitle}.` : ''

  return {
    whatIsIt:
      `${title} is a backend-testing topic in ${sectionTitle}.${parent} ` +
      'At five years of experience, explain which risk the test catches, how fast/stable it is, and where it sits on the pyramid — not only the annotation name.',
    whyExists:
      `${title} exists because shipping without feedback is gambling, and the wrong test type is expensive noise. ` +
      `A strong answer covers ${focus}.`,
    mentalModel:
      'Choose the cheapest test that would have caught the bug. Unit for logic, slice/integration for wiring, Testcontainers for real infra gaps, contracts for service boundaries, load for capacity — then keep CI green and flaky-free.',
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: [
          `Place ${title} on the pyramid: unit, slice, integration, contract, e2e/load.`,
          'Name the system under test and what is real vs doubled.',
          'State arrange/act/assert and the failure signal you expect.',
          'State determinism needs: data cleanup, time, async waits, isolation.',
          'State CI cost: runtime, flakiness, ownership, and gate strength.',
        ],
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Track boundary',
        text:
          'C13 owns testing strategy and Spring/Java test mechanics. C8 owns deep JPA persistence behavior; ' +
          'C12 owns reliability/chaos intent; C14 owns CI/CD pipeline tooling depth.',
      },
    ],
    internals: [
      {
        type: 'list',
        items: [
          'Unit tests isolate one unit with doubles; they should not boot Spring or touch a network.',
          'Spring test slices load a narrow ApplicationContext; full @SpringBootTest is slower and broader.',
          'True integration confidence often needs PostgreSQL/Kafka/Redis via Testcontainers, not H2-only approximations.',
          'Contract tests protect producer/consumer agreements without full end-to-end environments.',
          'Flaky tests destroy trust; quarantine, fix root causes (time, order, shared state), and keep PR suites strict.',
        ],
      },
    ],
    failureModes: [
      `Treating ${title} as coverage theater — many tests, little risk reduction.`,
      'Mocking everything including the class under test, or testing private implementation details.',
      'Relying on H2 for Postgres-specific SQL, locking, or JSONB behavior.',
      'Shared mutable fixtures causing order-dependent failures in CI.',
      'Putting slow/flaky suites on every PR with no ownership or quarantine policy.',
    ],
    production: {
      reliability: [
        'Prefer hermetic tests with explicit data setup/teardown and deterministic clocks.',
        'Gate merges on fast trustworthy suites; run heavy load/chaos on a cadence.',
      ],
      performance: [
        'Cache Spring contexts; parallelize carefully; use Testcontainers reuse where safe.',
        'Keep unit tests millisecond-fast so developers actually run them locally.',
      ],
      maintainability: [
        'Name tests by behavior; share builders/fixtures, not mysterious global state.',
        'Delete or rewrite tests that only mirror implementation and break on every refactor.',
      ],
      observability: [
        'Track flaky rate, suite duration, and failure ownership in CI.',
        'On failure, preserve logs/container output enough to diagnose without re-running blindly.',
      ],
    },
    interview: {
      expectations: [
        `Define ${title} in ${sectionTitle} and the risk it mitigates.`,
        'Distinguish unit vs integration vs contract vs load clearly.',
        'Call out one Spring Boot or Testcontainers production pitfall.',
      ],
      commonQuestions: [
        `How do you approach ${title} in a Spring Boot service?`,
        'Where does this sit on the test pyramid?',
        'How do you keep CI fast and non-flaky?',
      ],
      followUps: [
        'When would you choose Testcontainers over mocks?',
        'How do you test auth, migrations, or async listeners?',
      ],
      misconceptions: [
        '100% coverage means the system is correct.',
        '@SpringBootTest is always better than unit tests.',
        'Contract tests replace integration tests entirely.',
      ],
      traps: [
        'Reciting annotations without discussing isolation, data, or flakiness.',
        'Ignoring the difference between H2 and production Postgres.',
      ],
      strongSignals: [
        'Talks risk, feedback speed, and ownership — not only tooling names.',
        'Composes pyramid layers intentionally for a microservice codebase.',
      ],
    },
    keyTakeaways: [
      `${title} belongs to ${sectionTitle}.`,
      `Focus: ${focus}.`,
      'Right layer → deterministic setup → meaningful assert → CI-stable gate.',
    ],
    interviewQuestions: [
      {
        level: 'basic',
        question: `What is ${title}, and when would you use it?`,
        answerHint: `Place it in ${sectionTitle}; contrast with a neighboring test type.`,
      },
      {
        level: 'intermediate',
        question: `How would you design ${title} for a Spring Boot API with Postgres and Kafka?`,
        answerHint: 'Discuss slices, Testcontainers, doubles, and determinism.',
      },
      {
        level: 'advanced',
        question: `How would you operationalize ${title} as a quality gate without slowing delivery?`,
        answerHint: `Use ${focus} plus PR/nightly split, flake control, and ownership.`,
      },
    ],
    flashcards: [
      { front: title, back: `${sectionTitle}: ${focus}.` },
      {
        front: `${title} review loop`,
        back: 'Risk → cheapest test → isolation → assert → CI stability.',
      },
    ],
    quickRevision: [
      `${title} — ${sectionTitle}`,
      `Focus: ${focus}`,
      'Pyramid over ice-cream cone',
      'Deterministic, owned, CI-fast tests',
    ],
  }
}
