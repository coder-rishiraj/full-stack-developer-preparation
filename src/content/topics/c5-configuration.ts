import type { TopicContent } from '@/domain/types'

export const configurationContent: TopicContent = {
  whatIsIt:
    '@Configuration classes are Spring-managed sources of @Bean definitions — Java-based alternative to XML. They declare factory methods whose return values become beans in the ApplicationContext, with full Java type safety and IDE support.',
  whyExists:
    'Third-party libraries (DataSource, RestTemplate, ObjectMapper) cannot be annotated @Component. @Configuration centralizes wiring of infrastructure beans, conditional creation, and explicit dependency graphs without scattering @Bean methods across the codebase.',
  mentalModel:
    'Think of @Configuration as a recipe book: each @Bean method produces one ingredient the container stores by name/type. @ComponentScan finds @Service/@Repository; @Configuration fills gaps for beans you must construct manually. CGLIB enhances @Configuration so @Bean method calls return the same singleton instance within the class.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        '@Configuration class is itself a bean (often picked up by component scan).',
        '@Bean methods register BeanDefinition with return type and factory method.',
        'Inter-bean calls within same @Configuration class go through CGLIB proxy → same singleton.',
        'Dependencies injected into @Bean method parameters from container.',
        '@Import, @ImportResource, @ComponentScan compose multiple configuration sources.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: '@Configuration vs @Component + @Bean',
      text: 'Plain @Component with @Bean methods: inter-method calls are NOT proxied — each call creates a new instance. Use @Configuration for singleton semantics across methods.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  App[@SpringBootApplication] --> Scan[Component scan]
  Scan --> Config[@Configuration AppConfig]
  Config --> Bean1["@Bean DataSource"]
  Config --> Bean2["@Bean JdbcTemplate(ds)"]
  Bean1 --> Ctx[ApplicationContext]
  Bean2 --> Ctx`,
    caption: '@Configuration registers factory-produced beans',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Typical infrastructure beans',
      code: `@Configuration
public class AppConfig {

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);
  }

  @Bean
  public RestTemplate restTemplate(RestTemplateBuilder builder) {
    return builder
        .setConnectTimeout(Duration.ofSeconds(5))
        .setReadTimeout(Duration.ofSeconds(10))
        .build();
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Conditional bean with @Profile',
      code: `@Configuration
public class CacheConfig {

  @Bean
  @Profile("prod")
  public CacheManager redisCacheManager(RedisConnectionFactory cf) {
    return RedisCacheManager.create(cf);
  }

  @Bean
  @Profile("!prod")
  public CacheManager simpleCacheManager() {
    return new ConcurrentMapCacheManager("users");
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Split configuration with @Import',
      code: `@Configuration
@Import({ DatabaseConfig.class, SecurityConfig.class })
public class RootConfig { }`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'ConfigurationClassPostProcessor parses @Configuration, @Bean, @Import at refresh.',
        'Full @Configuration uses ConfigurationClassEnhancer (CGLIB subclass) for @Bean method interception.',
        'Bean names default to method name; override with @Bean("customName").',
        '@Primary resolves ambiguity when multiple beans of same type.',
        'Spring Boot auto-configurations are @Configuration classes in META-INF/spring/*.imports.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Type-safe bean wiring in Java',
      'Conditional and profile-specific beans',
      'Centralized third-party integration',
      'Test slices can @Import only needed configs',
    ],
    disadvantages: [
      'CGLIB proxy overhead negligible but surprises developers on inter-calls',
      'Large @Configuration classes become god-objects',
      'Mixing business logic in @Bean factories is an anti-pattern',
    ],
    alternatives: [
      '@Component on own classes when library supports it',
      'application.properties + auto-configuration for Boot starters',
      'Programmatic BeanDefinitionRegistryPostProcessor (rare)',
    ],
    whenToUse: [
      'DataSource, security, HTTP clients, serializers',
      'Beans needing explicit construction logic',
      'Profile-specific infrastructure',
    ],
    whenNotToUse: [
      'Your own @Service — use stereotype annotations',
      'Every class as @Bean — defeats component scanning purpose',
    ],
  },
  failureModes: [
    'Calling @Bean method from another class directly — bypasses container, new instance each time.',
    '@Component + @Bean inter-calls create multiple singletons unintentionally.',
    'Missing @Configuration on class with only @Bean methods — beans not processed correctly.',
    'Bean name collision — two @Bean methods same name in different configs.',
    'Circular @Bean dependency without @Lazy.',
  ],
  production: {
    maintainability: [
      'Split configs: DatabaseConfig, SecurityConfig, WebConfig',
      'Keep @Bean methods thin — delegate to builder/factory classes',
    ],
    reliability: ['Validate required properties in @Bean method with clear IllegalStateException'],
    security: ['Never @Bean hardcoded secrets — use @ConfigurationProperties + env vars'],
  },
  interview: {
    expectations: [
      'Difference @Configuration vs @Component for @Bean',
      'How @Bean singleton works across method calls',
      'When to use @Import and @Primary',
    ],
    commonQuestions: [
      'What does @Configuration do?',
      'Why CGLIB proxy on @Configuration?',
      '@Bean vs @Component?',
    ],
    followUps: [
      'How does Spring Boot auto-configuration relate?',
      '@ConditionalOnMissingBean behavior?',
    ],
    misconceptions: [
      '@Bean methods must be static',
      'Every bean needs @Configuration class',
      'Inter @Bean calls always return singleton without @Configuration',
    ],
    traps: ['Using @Component for config that calls other @Bean methods internally'],
    strongSignals: [
      'Explains CGLIB proxy for singleton @Bean methods',
      'Separates infrastructure @Configuration from @Service components',
      'Mentions @Primary and @Qualifier',
    ],
  },
  keyTakeaways: [
    '@Configuration = Java config for @Bean factory methods.',
    'CGLIB ensures @Bean method inter-calls share singleton.',
    'Use for third-party wiring, not your @Services.',
    '@Import composes config modules.',
    '@Primary / @Qualifier resolve type ambiguity.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is @Bean?',
      answerHint: 'Method producing object registered as Spring-managed bean.',
    },
    {
      level: 'intermediate',
      question: '@Configuration vs @Component with @Bean?',
      answerHint: 'Configuration proxied — inter-method calls return same singleton.',
    },
    {
      level: 'advanced',
      question: 'How does Boot auto-configuration work at high level?',
      answerHint: '@Configuration classes in spring.factories/imports, @ConditionalOn* guards.',
    },
  ],
  flashcards: [
    { front: '@Configuration purpose', back: 'Register @Bean factory methods in Java' },
    { front: 'CGLIB on @Configuration', back: 'Inter-@Bean calls return same singleton' },
    { front: 'Default @Bean name', back: 'Method name' },
  ],
  quickRevision: [
    '@Configuration + @Bean for wiring',
    'Not for own @Services',
    'CGLIB singleton proxy',
    '@Import split modules',
    '@Primary / @Qualifier',
    '@Profile conditional beans',
    'Boot auto-config = @Configuration',
  ],
}

export const content = configurationContent
