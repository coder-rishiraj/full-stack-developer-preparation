import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Spring creates proxy objects that stand in for target beans, intercepting calls to apply AOP advice (@Transactional, @Cacheable, security). Two mechanisms: JDK dynamic proxies (interface-based) and CGLIB subclass proxies (concrete classes). Understanding proxies explains why self-invocation and final methods break aspects.',
  whyExists:
    'Java has no built-in runtime method interception without bytecode manipulation. Proxies let Spring add behavior transparently — callers inject OrderService but receive a proxy implementing the same interface or extending the class.',
  mentalModel:
    'Wrapper object with same API as inner bean. Client → Proxy → (advice) → Real bean. If you hold reference to real bean inside itself and call this.save(), you skip the wrapper entirely.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Type', 'When', 'Limitation'],
      rows: [
        ['JDK dynamic proxy', 'Target implements interface(s)', 'Only interface methods proxied'],
        ['CGLIB proxy', 'Concrete class, no interface', 'Cannot proxy final class/method'],
        ['Bean is proxy?', 'Injected dependency', 'instanceof may be com.sun.proxy.$Proxy or subclass'],
        ['spring.aop.proxy-target-class', 'true forces CGLIB', 'Default true in Boot 2+ for class-based beans'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'JDK proxy vs direct target call',
      diagram: `flowchart LR
  Client -->|inject| Proxy
  Proxy --> Advice[TransactionAspect]
  Advice --> Target[OrderServiceImpl]
  Target -->|this.internal()| Target
  Note[Self-call skips Proxy]`,
    },
    {
      type: 'list',
      items: [
        'ProxyFactoryBean / AutoProxyCreator builds proxies at context refresh.',
        'Lazy-init beans still proxied when first accessed.',
        '@Scope(proxyMode=TARGET_CLASS) creates scoped proxy for singleton injecting prototype.',
        'Debugging: log bean class name — CGLIB shows EnhancerBySpringCGLIB suffix.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Detect proxy type at runtime',
      code: `@Autowired
private ApplicationContext ctx;

void inspect() {
  OrderService bean = ctx.getBean(OrderService.class);
  System.out.println(bean.getClass().getName());
  // jdk: com.sun.proxy.$Proxy42
  // cglib: com.app.OrderService$$EnhancerBySpringCGLIB$$abc123
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Self-invocation fix via injected self',
      code: `@Service
public class OrderService {
  private final OrderService self;

  public OrderService(@Lazy OrderService self) { this.self = self; }

  public void place(Order o) { self.saveInTx(o); }

  @Transactional
  public void saveInTx(Order o) { repo.save(o); }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'MethodInterceptor chain in CGLIB CallbackFilter routes to correct advice.',
        'JDK Proxy.newProxyInstance uses InvocationHandler dispatch.',
        'ExposeProxyInterceptor optionally puts proxy on ThreadLocal (expose-proxy=true).',
        'Native images / GraalVM need hints for proxy classes generated at runtime.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Transparent interception', 'No change to caller code', 'Enables declarative cross-cutting'],
    disadvantages: ['Debugging stack traces harder', 'Self-invocation footgun', 'CGLIB startup cost and metaspace'],
    alternatives: ['Compile-time AspectJ LTW', 'Manual decorator wrapping', 'Functional middleware in WebFlux'],
    whenToUse: ['Default Spring AOP model', 'Scoped bean injection into singletons'],
    whenNotToUse: ['Need to intercept private/final methods — use AspectJ weaving'],
  },
  failureModes: [
    'Final @Transactional method — silently not transactional on CGLIB edge cases',
    'Two interfaces same method — ambiguous proxy dispatch',
    'Serialization of proxied bean fails without Serializable handling',
    'Testing with @MockBean replaces proxy — different behavior than prod',
    'prototype injected into singleton without scoped proxy — stale instance',
  ],
  production: {
    reliability: ['Avoid self-invocation for transactional boundaries', 'Use @Lazy self injection pattern documented in team guide'],
    performance: ['Limit excessive proxy layers — don\'t wrap every bean unnecessarily'],
    maintainability: ['Prefer interface-based services for clearer JDK proxies and testing'],
    observability: ['Include target class in structured logs, not only proxy class name'],
  },
  interview: {
    expectations: ['JDK vs CGLIB', 'Self-invocation', 'How @Autowired bean can be proxy'],
    commonQuestions: ['How does Spring AOP work internally?', 'Why transactional on private method fails?'],
    followUps: ['Scoped proxy for prototype?', 'expose-proxy use case?'],
    misconceptions: ['Spring replaces class bytecode in place', 'All beans are always proxied'],
    traps: ['Explaining AOP without mentioning proxy'],
    strongSignals: ['InvocationHandler / MethodInterceptor', 'Self-injection @Lazy fix', 'proxy-target-class property'],
  },
  keyTakeaways: [
    'Spring AOP uses runtime proxies, not modified source classes.',
    'JDK proxy needs interface; CGLIB subclasses concrete class.',
    'Injected bean is usually the proxy, not raw target.',
    'Self-invocation bypasses proxy — use injected self or refactor.',
    'Final classes/methods cannot be CGLIB-proxied.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is a Spring proxy?', answerHint: 'Wrapper object intercepting method calls to apply aspects before delegating to target bean.' },
    { level: 'intermediate', question: 'JDK vs CGLIB proxy?', answerHint: 'JDK: interface-based dynamic proxy; CGLIB: subclass concrete class — no final methods.' },
    { level: 'advanced', question: 'Prototype bean in singleton — what breaks?', answerHint: 'Singleton holds one prototype instance unless scoped proxy creates new proxy per call.' },
  ],
  flashcards: [
    { front: 'JDK proxy requirement', back: 'Target must implement at least one interface' },
    { front: 'CGLIB limitation', back: 'Cannot subclass final class or intercept final methods' },
    { front: 'Self-invocation', back: 'this.method() on target skips proxy advice' },
    { front: 'EnhancerBySpringCGLIB', back: 'Class name suffix indicating CGLIB proxy' },
  ],
  quickRevision: ['Proxy wraps target', 'JDK = interface', 'CGLIB = subclass', 'Self-call skips proxy', '@Lazy self fix'],
}
