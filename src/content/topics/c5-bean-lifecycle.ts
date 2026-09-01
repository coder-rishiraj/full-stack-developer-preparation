import type { TopicContent } from '@/domain/types'

export const beanLifecycleContent: TopicContent = {
  whatIsIt:
    'Spring bean lifecycle spans: definition loading → instantiation → dependency injection → BeanPostProcessor before/after → initialization (@PostConstruct, InitializingBean, custom init) → ready → @PreDestroy/destroy on shutdown. Hooks allow cross-cutting setup and teardown.',
  whyExists:
    'Resources (connections, caches, threads) need ordered setup and cleanup. Lifecycle callbacks let beans validate config after injection, warm caches, and release resources when context closes — without scattering logic in constructors.',
  mentalModel:
    'Assembly line: container builds object → fills dependencies → runs processors (AOP proxies here) → calls your init hook → bean ready for use → on shutdown, destroy hook runs. Constructor should only assign dependencies; init for work needing them.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Bean lifecycle order',
      diagram: `flowchart TD
  A[Instantiate bean] --> B[Populate properties / DI]
  B --> C[BeanPostProcessor postProcessBeforeInitialization]
  C --> D[@PostConstruct / afterPropertiesSet]
  D --> E[custom init-method]
  E --> F[BeanPostProcessor postProcessAfterInitialization]
  F --> G[Bean ready]
  G --> H[@PreDestroy / destroy on shutdown]`,
    },
    {
      type: 'table',
      headers: ['Callback', 'Mechanism'],
      rows: [
        ['@PostConstruct', 'JSR-250 after injection'],
        ['InitializingBean.afterPropertiesSet', 'Spring interface (legacy style)'],
        ['@Bean(initMethod = "start")', 'Custom method name'],
        ['@PreDestroy', 'JSR-250 before destroy'],
        ['DisposableBean.destroy', 'Spring interface'],
        ['@Bean(destroyMethod = "stop")', 'Custom teardown'],
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'BeanPostProcessor',
      text: 'AOP proxies, @Autowired processing, @Scheduled setup happen in BeanPostProcessors — especially postProcessAfterInitialization wraps bean with proxy.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Init and destroy hooks',
      code: `@Component
public class CacheWarmer {
  private final DataSource dataSource;

  public CacheWarmer(DataSource dataSource) {
    this.dataSource = dataSource;
  }

  @PostConstruct
  void warmCache() {
    // safe: dependencies injected
    loadReferenceData();
  }

  @PreDestroy
  void shutdown() {
    flushPendingWrites();
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: '@Bean with init/destroy',
      code: `@Bean(initMethod = "connect", destroyMethod = "disconnect")
public MessageQueueClient queueClient() {
  return new MessageQueueClient(url);
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Instantiation via constructor or factory method.',
        'AutowiredAnnotationBeanPostProcessor handles @Autowired/@Value.',
        'CommonAnnotationBeanPostProcessor handles @PostConstruct/@PreDestroy.',
        'AnnotationAwareAspectJAutoProxyCreator may wrap bean in JDK/CGLIB proxy after init.',
        'Lazy-init beans: creation deferred until first getBean/access.',
        'Prototype beans: full lifecycle per instance; destroy not called by container (caller owns cleanup).',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Clear separation ctor vs initialization logic',
      'Graceful resource cleanup on context shutdown',
      'Extension points via custom BeanPostProcessor',
    ],
    disadvantages: [
      'Many callback options confuse teams (@PostConstruct vs InitializingBean)',
      'Init order between beans undefined unless @DependsOn',
      'Prototype destroy not managed automatically',
    ],
    alternatives: [
      'Constructor initialization only (limited for circular/async)',
      'SmartLifecycle / Lifecycle for start/stop phases in Boot',
    ],
    whenToUse: [
      '@PostConstruct for validation and warmup after DI',
      '@PreDestroy for closing connections and flushing',
    ],
    whenNotToUse: [
      'Heavy work in constructor before deps ready',
      'Business logic in BeanPostProcessor without clear need',
    ],
  },
  failureModes: [
    'Exception in @PostConstruct fails context startup.',
    'Missing @PreDestroy → connection leak on redeploy.',
    'Init order dependency without @DependsOn → NPE.',
    'Calling proxied self method from @PostConstruct bypasses AOP.',
    'Assuming destroy called for prototype beans.',
  ],
  interview: {
    expectations: [
      'Order: instantiate → inject → PostConstruct → ready → PreDestroy',
      'Role of BeanPostProcessor',
      '@PostConstruct vs constructor',
    ],
    commonQuestions: [
      'Spring bean lifecycle steps?',
      '@PostConstruct vs InitializingBean?',
      'When is AOP proxy created?',
    ],
    followUps: [
      '@DependsOn purpose?',
      'Prototype bean destroy behavior?',
    ],
    misconceptions: [
      'Constructor runs after @PostConstruct (opposite)',
      'All beans destroyed on every request (singleton lives until context close)',
      'BeanPostProcessor same as bean lifecycle callback',
    ],
    traps: ['Heavy I/O in constructor instead of @PostConstruct'],
    strongSignals: [
      'Correct lifecycle order diagram',
      'Mentions proxy in postProcessAfterInitialization',
      '@DependsOn for ordering',
    ],
  },
  keyTakeaways: [
    'Instantiate → inject → before init BPP → @PostConstruct → after init BPP.',
    'AOP proxy typically after initialization callbacks.',
    '@PreDestroy on context shutdown for cleanup.',
    'Use @DependsOn for explicit init order.',
    'Prototype: container doesn’t call destroy.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'When does @PostConstruct run?',
      answerHint: 'After dependency injection completes, before bean is fully ready for use.',
    },
    {
      level: 'intermediate',
      question: 'BeanPostProcessor role in lifecycle?',
      answerHint: 'Modify/wrap beans before and after initialization — AOP proxies applied here.',
    },
    {
      level: 'advanced',
      question: 'How ensure bean A initializes before bean B?',
      answerHint: '@DependsOn("beanA") on bean B or explicit dependency via constructor.',
    },
  ],
  flashcards: [
    { front: '@PostConstruct timing', back: 'After DI, before bean in use' },
    { front: 'BeanPostProcessor after init', back: 'Often wraps bean with AOP proxy' },
    { front: 'Prototype destroy', back: 'Container does not call @PreDestroy — caller manages' },
  ],
  quickRevision: [
    'Instantiate inject init destroy',
    '@PostConstruct @PreDestroy',
    'BPP before/after init',
    'Proxy after initialization',
    '@DependsOn ordering',
    'Lazy-init on first use',
    'Prototype no auto destroy',
  ],
}

export const content = beanLifecycleContent
