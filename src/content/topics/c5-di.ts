import type { TopicContent } from '@/domain/types'

export const diContent: TopicContent = {
  whatIsIt:
    'Dependency Injection (DI) is a pattern where objects receive collaborators from outside rather than creating them (new) or looking them up (Service Locator). Spring supports constructor, setter, and field injection via @Autowired, with constructor injection recommended.',
  whyExists:
    'Classes focus on business logic; dependencies are explicit, swappable, and mockable in tests. Configuration decides which implementation is injected — Open/Closed principle in practice.',
  mentalModel:
    'OrderService needs OrderRepository — don’t build repo inside; declare need in constructor. Spring reads constructor, finds OrderRepository bean, passes it. Changing Jdbc to Jpa = change @Primary or @Qualifier config, not OrderService code.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Injection type', 'Mechanism', 'Recommendation'],
      rows: [
        ['Constructor', 'Final fields via ctor params', 'Preferred — required deps, immutable'],
        ['Setter', '@Autowired on setters', 'Optional dependencies'],
        ['Field', '@Autowired on fields', 'Avoid — hard to test'],
      ],
    },
    {
      type: 'list',
      items: [
        '@Autowired on constructor optional since Spring 4.3 if single constructor.',
        '@Qualifier("beanName") disambiguates multiple implementations.',
        '@Primary marks default when multiple candidates.',
        '@Nullable or Optional<T> for optional dependencies.',
        'JavaConfig: @Bean method parameters auto-wired.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Constructor DI flow',
      diagram: `sequenceDiagram
  participant C as Spring Container
  participant R as OrderRepository bean
  participant S as OrderService
  C->>R: create repository
  C->>S: new OrderService(repository)
  Note over S: ready to use`,
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Constructor injection (preferred)',
      code: `@Service
public class OrderService {
  private final OrderRepository orderRepository;
  private final PaymentClient paymentClient;

  public OrderService(OrderRepository orderRepository,
                      PaymentClient paymentClient) {
    this.orderRepository = orderRepository;
    this.paymentClient = paymentClient;
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: '@Qualifier for multiple implementations',
      code: `@Service
public class NotificationService {
  public NotificationService(@Qualifier("emailSender") MessageSender sender) {
    this.sender = sender;
  }
}

@Bean @Qualifier("emailSender")
MessageSender emailSender() { return new EmailSender(); }`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'AutowiredAnnotationBeanPostProcessor resolves @Autowired injection points.',
        'Constructor resolution uses parameter types + qualifiers.',
        'Circular deps: setter/field may use proxies; constructor cycles fail.',
        'JSR-330 @Inject interchangeable with @Autowired (mostly).',
        'Spring Boot test slices (@WebMvcTest) inject mocks via @MockBean.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Explicit dependencies in constructor signature',
      'Easy unit tests with manual mocks',
      'Swap implementations via config',
    ],
    disadvantages: [
      'Large constructors if class does too much (design smell)',
      'Runtime wiring errors at startup (better than NPE later)',
      'Framework knowledge required',
    ],
    alternatives: [
      'Service Locator anti-pattern (hidden deps)',
      'Manual wiring in main() for small apps',
      'Compile-time DI (Dagger)',
    ],
    whenToUse: [
      'All Spring-managed services and repositories',
      'When testing with mocked collaborators',
    ],
    whenNotToUse: [
      'Value objects / entities not managed as beans',
      'Static utility classes without state',
    ],
  },
  failureModes: [
    'Multiple beans same type — NoUniqueBeanDefinitionException without @Qualifier.',
    'Missing bean — NoSuchBeanDefinitionException at startup.',
    'Field injection in tests — NPE without Spring context.',
    'Injecting request-scoped into singleton — scope proxy needed.',
    'Circular constructor dependency — context fails to start.',
  ],
  interview: {
    expectations: [
      'Three injection types and preference',
      '@Qualifier and @Primary usage',
      'Benefits for testing',
    ],
    commonQuestions: [
      'What is Dependency Injection?',
      'Constructor vs field injection?',
      'How resolve multiple beans same type?',
    ],
    followUps: [
      'Circular dependency solutions?',
      'Optional dependencies in Spring?',
    ],
    misconceptions: [
      '@Autowired always required on constructor (single ctor auto-wired)',
      'DI only works with interfaces (concrete classes fine)',
      'Field injection same as constructor for testing',
    ],
    traps: ['Recommending @Autowired on fields in interview without caveat'],
    strongSignals: [
      'Constructor injection + final fields',
      'Qualifiers for strategy pattern implementations',
      'Mentions test doubles without Spring context',
    ],
  },
  keyTakeaways: [
    'DI: dependencies supplied externally.',
    'Constructor injection preferred — immutable, testable.',
    '@Qualifier/@Primary resolve ambiguity.',
    'Avoid field injection in production code.',
    'Startup fails fast if dependency graph invalid.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is Dependency Injection?',
      answerHint: 'Providing object’s dependencies from outside rather than creating internally.',
    },
    {
      level: 'intermediate',
      question: 'Why prefer constructor over field injection?',
      answerHint: 'Required deps explicit, immutable, unit test without Spring, no reflection.',
    },
    {
      level: 'advanced',
      question: 'How handle two implementations of same interface?',
      answerHint: '@Qualifier on injection point or @Primary on preferred @Bean.',
    },
  ],
  flashcards: [
    { front: 'Constructor injection', back: 'Dependencies via constructor — Spring recommended' },
    { front: '@Qualifier', back: 'Selects specific bean when multiple candidates' },
    { front: '@Primary', back: 'Default bean when multiple types match' },
  ],
  quickRevision: [
    'Constructor > setter > field',
    '@Autowired optional single ctor',
    '@Qualifier disambiguate',
    '@Primary default bean',
    'NoSuchBean at startup',
    'Mock in unit tests',
    'Avoid Service Locator',
  ],
}

export const content = diContent
