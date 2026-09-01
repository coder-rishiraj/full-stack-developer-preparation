import type { TopicContent } from '@/domain/types'

export const constructorInjectionContent: TopicContent = {
  whatIsIt:
    'Constructor injection is a Spring DI pattern where required dependencies are supplied through the class constructor — typically a single constructor annotated with @Autowired (optional since Spring 4.3 if only one constructor exists).',
  whyExists:
    'Fields and setter injection hide missing dependencies until runtime and make immutability impossible. Constructor injection makes dependencies explicit, enables final fields, fails fast at startup if a bean is missing, and simplifies unit testing without Spring context.',
  mentalModel:
    'Spring builds the object graph bottom-up: when creating Bean A, it resolves all constructor parameters from the container first, then calls `new A(deps...)`. One constructor = one clear contract. Optional dependencies belong in setters or @Autowired(required=false), not required constructor args.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Component scan or @Bean method registers class as bean definition.',
        'Spring inspects constructor(s); picks the one to use (single constructor auto-wired).',
        'For each parameter type/name, resolves matching bean (by type, @Qualifier if ambiguous).',
        'Invokes constructor; returned instance is fully initialized singleton (by default).',
        'Circular dependencies between constructor-only beans fail at startup — design or use @Lazy.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Spring Boot default',
      text: 'Lombok @RequiredArgsConstructor on a @Service with final fields is idiomatic — no @Autowired needed on constructor.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Container[ApplicationContext] --> Resolve[Resolve UserService deps]
  Resolve --> Repo[UserRepository bean]
  Resolve --> Mail[EmailClient bean]
  Repo --> Construct["new UserService(repo, mail)"]
  Mail --> Construct
  Construct --> Bean[UserService singleton]`,
    caption: 'Constructor injection resolves dependencies before instantiation',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Idiomatic constructor injection with final fields',
      code: `@Service
public class UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserService(UserRepository userRepository,
                     PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public User create(CreateUserRequest req) {
    var user = new User(req.email(), passwordEncoder.encode(req.password()));
    return userRepository.save(user);
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Unit test without Spring — pass mocks via constructor',
      code: `@Test
void createsUser() {
  var repo = mock(UserRepository.class);
  var encoder = mock(PasswordEncoder.class);
  when(encoder.encode("secret")).thenReturn("hash");
  var service = new UserService(repo, encoder);

  service.create(new CreateUserRequest("a@b.com", "secret"));
  verify(repo).save(any(User.class));
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: '@Qualifier when multiple beans of same type',
      code: `@Service
public class NotificationService {
  public NotificationService(@Qualifier("smtpEmailSender") EmailSender sender) {
    this.sender = sender;
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'AutowiredAnnotationBeanPostProcessor resolves @Autowired on constructor parameters.',
        'DefaultListableBeanFactory uses ConstructorResolver to pick constructor and satisfy args.',
        'Kotlin coroutines / Java records work — single canonical constructor is wired.',
        'Circular dependency: A( B ) and B( A ) → BeanCurrentlyInCreationException unless @Lazy on one side.',
        'Prototype bean injected into singleton: singleton holds reference to one prototype instance created at startup — usually wrong; use ObjectProvider or scope proxy.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Immutable dependencies (final fields)',
      'Fail-fast at context refresh if bean missing',
      'Clear required vs optional dependencies',
      'Easy plain-JUnit tests with manual construction',
    ],
    disadvantages: [
      'Many dependencies → large constructor (smell to split class)',
      'Constructor cycles require @Lazy or redesign',
      'Framework must instantiate — no no-arg + manual wiring for Spring-managed beans',
    ],
    alternatives: [
      'Setter injection for optional dependencies',
      'Field injection (discouraged — hard to test, hides deps)',
      'Method injection for factory-style dependencies',
    ],
    whenToUse: [
      'All required service/repository dependencies',
      'Production Spring beans (@Service, @Component, @Configuration)',
    ],
    whenNotToUse: [
      'Optional plugins that may be absent — use ObjectProvider<T> or setter',
      'Breaking circular graphs without @Lazy redesign',
    ],
  },
  failureModes: [
    'NoSuchBeanDefinitionException at startup — missing @Component or wrong package scan.',
    'NoUniqueBeanDefinitionException — two EmailSender beans, no @Qualifier.',
    'Circular dependency between two constructor-injected singletons.',
    'Injecting concrete class instead of interface — tight coupling, harder mocking.',
    'Prototype scope misunderstanding when injected into singleton.',
  ],
  production: {
    performance: ['Constructor called once per singleton bean at startup — negligible'],
    maintainability: [
      'Keep constructors ≤ 5–7 dependencies; extract facades if larger',
      'Prefer interfaces in constructor signatures',
    ],
    reliability: ['Startup failure on misconfiguration beats runtime NPE from unset field injection'],
  },
  interview: {
    expectations: [
      'Explain why constructor injection is preferred over field injection',
      'Describe how Spring resolves constructor parameters',
      'Know circular dependency failure and @Lazy mitigation',
    ],
    commonQuestions: [
      'Why constructor injection over @Autowired field?',
      'What happens with two constructors?',
      'How do you test a constructor-injected service?',
    ],
    followUps: [
      'How does @Lazy break a cycle?',
      'ObjectProvider vs direct injection?',
    ],
    misconceptions: [
      'You must write @Autowired on every constructor (not since 4.3 with single constructor)',
      'Field injection is fine because Spring docs show it',
      'All dependencies must be interfaces',
    ],
    traps: ['Recommending field injection for "simplicity"'],
    strongSignals: [
      'Mentions final fields and fail-fast startup',
      'Uses mocks in constructor for unit tests',
      'Knows @Qualifier for ambiguity',
    ],
  },
  keyTakeaways: [
    'Constructor injection = explicit, immutable, testable dependencies.',
    'Single constructor auto-wired without @Autowired (Spring 4.3+).',
    'Startup fails if required bean missing — good.',
    'Avoid field injection in production code.',
    'Break constructor cycles with @Lazy or redesign.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why prefer constructor over field injection?',
      answerHint: 'Explicit deps, final fields, testable without Spring, fail at startup.',
    },
    {
      level: 'intermediate',
      question: 'What happens with circular constructor dependencies?',
      answerHint: 'BeanCurrentlyInCreationException; fix with @Lazy or refactor.',
    },
    {
      level: 'advanced',
      question: 'Prototype bean injected into singleton — issue?',
      answerHint: 'One prototype instance shared for life of singleton; use ObjectProvider.',
    },
  ],
  flashcards: [
    { front: 'Constructor injection benefit', back: 'Immutable final deps; fail-fast at startup' },
    { front: '@Autowired on constructor', back: 'Optional if exactly one constructor' },
    { front: 'Circular constructor DI', back: 'Fails unless @Lazy breaks cycle' },
  ],
  quickRevision: [
    'Final fields + single constructor',
    'No field @Autowired in prod',
    'Mock via constructor in tests',
    '@Qualifier for ambiguity',
    'Cycles → @Lazy or redesign',
    'ObjectProvider for optional/prototype',
    'Lombok @RequiredArgsConstructor',
  ],
}

export const content = constructorInjectionContent
