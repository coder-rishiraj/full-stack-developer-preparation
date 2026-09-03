import type { TopicContent } from '@/domain/types'

export const beansContent: TopicContent = {
  whatIsIt:
    'In Spring, a bean is an object instantiated, assembled, and managed by the IoC container. Beans have names (default lowercase class name), scopes (singleton default, prototype, request, session), and lifecycle callbacks. Registered via @Component stereotypes or @Bean methods.',
  whyExists:
    'Uniform lifecycle management — single place to create, configure, inject, and destroy shared objects (services, repositories, DataSource). Avoids duplicate instances and coordinates dependency graphs across the application.',
  mentalModel:
    'Beans live in a container registry — like a vending machine warehouse. You request by type/name; container hands you the right instance (usually same singleton each time). Prototype = new item every request.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Stereotype', 'Layer'],
      rows: [
        ['@Component', 'Generic bean'],
        ['@Service', 'Business logic'],
        ['@Repository', 'Persistence (+ exception translation)'],
        ['@Controller / @RestController', 'Web MVC'],
        ['@Configuration', 'Config class hosting @Bean methods'],
      ],
    },
    {
      type: 'table',
      headers: ['Scope', 'Behavior'],
      rows: [
        ['singleton (default)', 'One instance per container'],
        ['prototype', 'New instance every injection/getBean'],
        ['request', 'One per HTTP request (web)'],
        ['session', 'One per HTTP session'],
        ['application', 'ServletContext scope'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Singleton + mutable state',
      text: 'Default singleton beans must be thread-safe if they hold request/user state — prefer stateless services.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Component bean',
      code: `@Service
public class UserService {
  private final UserRepository repo;
  public UserService(UserRepository repo) { this.repo = repo; }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: '@Bean factory method',
      code: `@Configuration
public class AppConfig {
  @Bean
  public RestClient restClient(RestClient.Builder builder) {
    return builder
        .requestFactory(new JdkClientHttpRequestFactory())
        .build();
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'BeanDefinition stores class, scope, lazy, init/destroy method names.',
        'Default bean name: @Service UserService → userService.',
        'Alias support via @Bean("customName") or @Qualifier.',
        'Conditional beans: @Conditional, @Profile (Boot adds @ConditionalOnProperty).',
        'FactoryBean<T> produces beans; getObject() is product.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Consistent singleton services across app',
      'Declarative configuration and profiles',
      'Integration with AOP, transactions, validation',
    ],
    disadvantages: [
      'Singleton misuse with mutable state',
      'Prototype injected into singleton — one instance stuck (scope issue)',
      'Over-annotation of non-service classes',
    ],
    alternatives: [
      'new for non-managed objects (DTOs, entities)',
      'Manual registry for non-Spring modules',
    ],
    whenToUse: [
      'Services, repositories, clients, config objects',
      'Shared infrastructure beans (DataSource, ObjectMapper)',
    ],
    whenNotToUse: [
      'Every POJO — only types needing DI/lifecycle',
      'Entities with JPA (usually @Entity not @Component)',
    ],
  },
  failureModes: [
    'Stateful singleton → race conditions across requests.',
    'Prototype bean in singleton without scoped proxy → stale/wrong scope.',
    'Duplicate @Bean definitions → override or conflict.',
    'Component not in scanned package → bean missing.',
    'Eager init failure prevents entire context startup.',
  ],
  interview: {
    expectations: [
      'Define Spring bean',
      'Default scope and stereotypes',
      '@Component vs @Bean difference',
    ],
    commonQuestions: [
      'What is a Spring bean?',
      'Bean scopes in Spring?',
      '@Service vs @Component?',
      'singleton vs prototype?',
    ],
    followUps: [
      'Prototype into singleton problem?',
      'How name beans?',
    ],
    misconceptions: [
      'Every Java object in app is a bean',
      '@Repository required for JPA (stereotype optional but useful)',
      'prototype scope always garbage collected immediately',
    ],
    traps: ['Storing HttpServletRequest fields in singleton service'],
    strongSignals: [
      'Stateless singleton services',
      'Factory @Bean for third-party classes',
      '@Profile for environment-specific beans',
    ],
  },
  keyTakeaways: [
    'Bean = container-managed object.',
    'Default scope singleton — one per context.',
    'Stereotypes: @Service, @Repository, @Controller.',
    '@Bean in @Configuration for third-party setup.',
    'Keep singleton beans stateless/thread-safe.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is a Spring bean?',
      answerHint: 'Object created and managed by Spring IoC container.',
    },
    {
      level: 'intermediate',
      question: 'Default bean scope?',
      answerHint: 'Singleton — one shared instance per ApplicationContext.',
    },
    {
      level: 'advanced',
      question: 'Inject prototype into singleton — what happens?',
      answerHint: 'Singleton gets one prototype instance at creation unless scoped proxy or ObjectFactory.',
    },
  ],
  flashcards: [
    { front: 'Default scope', back: 'singleton' },
    { front: '@Bean vs @Component', back: '@Bean method in @Configuration; @Component on class for component scan' },
    { front: '@Repository', back: 'Persistence layer stereotype + PersistenceExceptionTranslation' },
  ],
  quickRevision: [
    'Container-managed objects',
    'singleton default scope',
    'prototype new each time',
    '@Service @Repository @Controller',
    '@Configuration @Bean',
    'Stateless singletons',
    'Bean names camelCase',
  ],
}

export const content = beansContent
