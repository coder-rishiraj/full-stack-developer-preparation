import type { TopicContent } from '@/domain/types'

export const iocContent: TopicContent = {
  whatIsIt:
    'Inversion of Control (IoC) is a design principle where object creation, lifecycle, and dependency wiring are delegated to a container/framework instead of classes constructing their own collaborators with new. Spring IoC container manages beans and injects dependencies.',
  whyExists:
    'Tight coupling via direct instantiation makes testing hard, configuration scattered, and swapping implementations painful. IoC centralizes composition — change wiring in one place (config/XML/annotations) without editing business logic.',
  mentalModel:
    'Hollywood principle: “Don’t call us, we’ll call you.” Your class declares what it needs (constructor params, @Autowired fields); container calls constructor and supplies implementations at runtime. You write behavior; framework writes the object graph.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Define components (@Component, @Service, @Repository) or @Bean methods.',
        'Container scans or loads configuration metadata.',
        'Container instantiates beans, resolves dependency graph.',
        'Injects dependencies (constructor preferred).',
        'Returns fully wired singleton (default) or prototype bean on request.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'IoC vs traditional',
      diagram: `flowchart LR
  subgraph traditional
    A1[Service] -->|new| B1[RepositoryImpl]
  end
  subgraph ioc
    C[Spring Container] -->|creates| S[Service]
    C -->|creates| R[Repository]
    C -->|injects| S
  end`,
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'IoC vs DI',
      text: 'IoC is the broad principle (control inverted to container). Dependency Injection is the pattern IoC container uses to fulfill dependencies.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Without IoC — tight coupling',
      code: `class OrderService {
  private final OrderRepository repo = new JdbcOrderRepository(); // hard-coded
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'With Spring IoC',
      code: `@Service
class OrderService {
  private final OrderRepository repo;
  OrderService(OrderRepository repo) { this.repo = repo; } // container injects
}

@Repository
class JdbcOrderRepository implements OrderRepository { ... }`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'BeanFactory vs ApplicationContext — ApplicationContext superset (events, i18n, AOP).',
        'Metadata sources: annotations, Java @Configuration, XML (legacy).',
        'Dependency graph built at startup; circular deps detected (constructor fails).',
        'Lazy initialization: @Lazy delays creation until first use.',
        'Spring Boot auto-configuration applies IoC via conditional @Bean registration.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Loose coupling and testability (mock injection)',
      'Centralized configuration and environment profiles',
      'Lifecycle hooks (init, destroy, @PostConstruct)',
    ],
    disadvantages: [
      'Magic wiring — harder to trace without IDE',
      'Startup time for large contexts',
      'Overuse of field injection hides dependencies',
    ],
    alternatives: [
      'Manual composition root in main()',
      'Guice, Micronaut DI, Dagger compile-time',
      'Pure functional passing dependencies explicitly',
    ],
    whenToUse: [
      'Enterprise Spring applications',
      'When multiple implementations and profiles',
    ],
    whenNotToUse: [
      'Tiny CLI where container overhead unjustified',
      'When explicit wiring clearer for team',
    ],
  },
  failureModes: [
    'No qualifying bean → NoUniqueBeanDefinitionException / NoSuchBeanDefinitionException.',
    'Circular dependency with constructor injection — startup failure.',
    'Component not scanned — bean missing at runtime.',
    'Singleton holding mutable state shared across requests.',
    'Field injection — hard to test and null before injection.',
  ],
  interview: {
    expectations: [
      'Define IoC and why invert control',
      'Relation to Dependency Injection',
      'Spring container role',
    ],
    commonQuestions: [
      'What is IoC?',
      'IoC vs DI?',
      'Benefits of Spring IoC?',
    ],
    followUps: [
      'BeanFactory vs ApplicationContext?',
      'Constructor vs field injection?',
    ],
    misconceptions: [
      'IoC same as DI only (IoC broader)',
      'Spring creates all objects always (you opt-in @Component/@Bean)',
      'IoC eliminates need for interfaces',
    ],
    traps: ['Recommending field @Autowired as best practice'],
    strongSignals: [
      'Constructor injection preference',
      'Test with @MockBean or manual constructor',
      'Explains composition root concept',
    ],
  },
  keyTakeaways: [
    'IoC: framework controls object creation/wiring.',
    'DI is how Spring fulfills dependencies.',
    'Prefer constructor injection for required deps.',
    'ApplicationContext is Spring IoC container.',
    '@Component scanning + @Configuration register beans.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is Inversion of Control?',
      answerHint: 'Framework/container creates and wires objects instead of classes doing new themselves.',
    },
    {
      level: 'intermediate',
      question: 'IoC vs Dependency Injection?',
      answerHint: 'IoC principle; DI is pattern — injecting deps rather than lookup.',
    },
    {
      level: 'advanced',
      question: 'Why constructor injection over field injection?',
      answerHint: 'Immutable deps, testable without Spring, fails fast if missing, no reflection field set.',
    },
  ],
  flashcards: [
    { front: 'IoC', back: 'Control of object creation delegated to container' },
    { front: 'Hollywood principle', back: 'Don’t call us we’ll call you — framework calls your components' },
    { front: 'Spring IoC container', back: 'ApplicationContext manages bean lifecycle and wiring' },
  ],
  quickRevision: [
    'IoC = inverted creation',
    'DI injects dependencies',
    'ApplicationContext container',
    'Constructor injection preferred',
    '@Component @Service @Repository',
    '@Configuration @Bean',
    'Loose coupling testability',
  ],
}

export const content = iocContent
