import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Aspect-Oriented Programming (AOP) in Spring separates cross-cutting concerns — logging, security, transactions, metrics — from business logic via aspects that intercept method calls at join points. Spring AOP uses proxies (JDK or CGLIB) to weave advice (before, after, around) around beans at runtime.',
  whyExists:
    'Without AOP, every service method repeats @Transactional boilerplate, logging, and auth checks — violating DRY and mixing infrastructure with domain code. AOP centralizes policies: one @Transactional aspect applies to all repository methods matching a pointcut.',
  mentalModel:
    'Invisible middleware around your methods. Pointcut says "which methods"; advice says "what to do before/after/around". Spring wraps the bean in a proxy; callers hit the proxy, not the raw object. @Aspect + @Around is the workhorse for custom cross-cutting logic.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Spring AOP proxy intercepts call',
      diagram: `sequenceDiagram
  participant Client
  participant Proxy
  participant Target
  Client->>Proxy: service.save(order)
  Proxy->>Proxy: @Before log
  Proxy->>Proxy: begin transaction
  Proxy->>Target: save(order)
  Target-->>Proxy: result
  Proxy->>Proxy: commit / @AfterReturning
  Proxy-->>Client: result`,
    },
    {
      type: 'table',
      headers: ['Concept', 'Meaning'],
      rows: [
        ['Join point', 'Method execution on Spring bean'],
        ['Pointcut', 'Expression selecting join points (execution(* com.app.service.*.*(..)))'],
        ['Advice', 'Action at join point: @Before, @After, @Around, @AfterThrowing'],
        ['Aspect', 'Module combining pointcuts + advice (@Aspect bean)'],
        ['Weaving', 'Spring weaves at runtime via proxy — not compile-time AspectJ by default'],
      ],
    },
    {
      type: 'list',
      items: [
        '@EnableAspectJAutoProxy (auto in Boot) creates proxies for @Aspect beans.',
        'Self-invocation (this.method()) bypasses proxy — call via injected self or refactor.',
        'Order matters: @Order on aspects for transaction before security.',
        'Only public methods on Spring-managed beans are intercepted by default proxy AOP.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Custom logging aspect with @Around',
      code: `@Aspect
@Component
@Order(1)
public class LoggingAspect {
  private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);

  @Around("@annotation(Timed)")
  public Object timed(ProceedingJoinPoint pjp) throws Throwable {
    long start = System.nanoTime();
    try {
      return pjp.proceed();
    } finally {
      log.info("{} took {}ms", pjp.getSignature(), (System.nanoTime() - start) / 1_000_000);
    }
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Declarative transactions are AOP',
      code: `@Service
public class OrderService {
  @Transactional  // TransactionInterceptor aspect
  public void placeOrder(Order order) {
    orderRepo.save(order);
    inventoryRepo.decrement(order.getSku());
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'JDK dynamic proxy: interface-based beans; CGLIB subclass proxy for concrete classes.',
        'AnnotationMatchingPointcut matches @Transactional, @Cacheable, @Secured.',
        'AspectJ weaver optional for load-time weaving outside proxy limits.',
        'exposeProxy=true allows AopContext.currentProxy() for self-invocation fix.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['DRY cross-cutting logic', 'Declarative @Transactional/@Cacheable', 'Central policy changes'],
    disadvantages: ['Hidden behavior — harder debugging', 'Proxy pitfalls and self-invocation', 'Only Spring bean public methods'],
    alternatives: ['Manual interceptor chain', 'Decorators per service', 'Middleware in WebFlux filter chain'],
    whenToUse: ['Transactions, caching, security, metrics, audit logging'],
    whenNotToUse: ['Core business rules — keep in domain layer', 'When full AspectJ compile-time needed on private methods'],
  },
  failureModes: [
    'Self-invocation skips @Transactional — partial commit',
    'Missing @EnableAspectJAutoProxy in non-Boot setup',
    'Pointcut too broad — accidental advice on hot paths',
    'Wrong @Order — security after transaction commits',
    'CGLIB fails on final classes/methods',
  ],
  production: {
    reliability: ['Test transactional boundaries with integration tests', 'Document aspect order explicitly'],
    observability: ['Aspect timing metrics without logging every call in prod'],
    maintainability: ['Named pointcut constants; avoid copy-paste execution expressions'],
    performance: ['Keep @Around advice lightweight; avoid reflection in hot loops'],
  },
  interview: {
    expectations: ['Proxy vs target', 'Self-invocation problem', '@Around vs @Before', 'How @Transactional works'],
    commonQuestions: ['Explain Spring AOP', 'Why @Transactional fails on private method?', 'JDK vs CGLIB proxy?'],
    followUps: ['Fix self-invocation?', 'Aspect order for tx + security?'],
    misconceptions: ['AOP replaces OOP', 'All methods always proxied including private'],
    traps: ['Calling this.save() inside same class expecting transaction'],
    strongSignals: ['ProceedingJoinPoint.proceed()', 'Pointcut design', 'Order annotation', 'Self-invocation workaround'],
  },
  keyTakeaways: [
    'AOP weaves cross-cutting advice via runtime proxies.',
    'Pointcut selects methods; advice defines before/after/around behavior.',
    '@Transactional and @Cacheable are built-in AOP aspects.',
    'Self-invocation bypasses proxy — inject self or use AopContext.',
    'JDK proxy for interfaces; CGLIB for concrete classes.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What problem does AOP solve?', answerHint: 'Cross-cutting concerns (logging, tx) without duplicating code in every method.' },
    { level: 'intermediate', question: 'Why does @Transactional not work on self-invocation?', answerHint: 'Call is this.method() on target, not through Spring proxy wrapper.' },
    { level: 'advanced', question: 'Design audit aspect for all mutating repository methods?', answerHint: '@Around pointcut on *Repo.save/update/delete; log user + entity after proceed().' },
  ],
  flashcards: [
    { front: 'Join point', back: 'Point in execution where aspect applies — method call on Spring bean' },
    { front: 'Pointcut', back: 'Predicate selecting which join points receive advice' },
    { front: '@Around', back: 'Wraps method — controls if/when proceed() runs' },
    { front: 'Self-invocation trap', back: 'Internal call skips proxy — no transactional aspect' },
  ],
  quickRevision: ['Proxy wraps bean', 'Pointcut + advice', '@Transactional = AOP', 'Self-invocation bypass', 'JDK vs CGLIB'],
}
