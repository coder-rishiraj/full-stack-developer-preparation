import type { TopicContent } from '@/domain/types'

export const applicationContextContent: TopicContent = {
  whatIsIt:
    'ApplicationContext is Spring\'s central IoC container interface extending BeanFactory with enterprise features: event publication, internationalization, resource loading, and AOP integration. ClassPathXmlApplicationContext, AnnotationConfigApplicationContext, and Spring Boot\'s SpringApplication create it at startup.',
  whyExists:
    'BeanFactory alone is minimal. ApplicationContext provides the full application runtime: publish ApplicationEvents, resolve messages, load classpath files, and integrate @Transactional AOP — the foundation Spring Boot builds on.',
  mentalModel:
    'ApplicationContext is the running app’s object registry + infrastructure hub. @SpringBootApplication triggers scan, registers beans, runs CommandLineRunners, and exposes context. You getBean() for dynamic lookup; prefer injection normally.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'SpringApplication.run() creates ApplicationContext (ServletWebServerApplicationContext for web).',
        'Refresh: load definitions, instantiate singletons, invoke BeanPostProcessors.',
        'Publish ContextRefreshedEvent when ready.',
        'Serve requests (web) or run batch/cli.',
        'Close context on shutdown — destroy beans, publish ContextClosedEvent.',
      ],
    },
    {
      type: 'table',
      headers: ['Feature', 'BeanFactory', 'ApplicationContext'],
      rows: [
        ['Lazy vs eager singletons', 'Lazy default', 'Eager init default'],
        ['Events', 'No', 'ApplicationEventPublisher'],
        ['i18n MessageSource', 'No', 'Yes'],
        ['AOP auto-apply', 'Manual', 'Automatic for beans'],
        ['Web integration', 'No', 'WebApplicationContext variants'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Context refresh',
      diagram: `flowchart TD
  Start[SpringApplication.run] --> Refresh[context.refresh]
  Refresh --> Load[Load BeanDefinitions]
  Load --> Instantiate[Instantiate singletons]
  Instantiate --> BPP[BeanPostProcessors]
  BPP --> Ready[ContextRefreshedEvent]
  Ready --> Run[App running]`,
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Boot entry and context access',
      code: `@SpringBootApplication
public class Application {
  public static void main(String[] args) {
    ConfigurableApplicationContext ctx =
        SpringApplication.run(Application.class, args);
    // prefer injection over getBean in app code
    MyService svc = ctx.getBean(MyService.class);
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'ApplicationEvent',
      code: `@Component
class OrderCreatedListener {
  @EventListener
  void onOrderCreated(OrderCreatedEvent e) {
    // reacts after context publishes event
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'GenericApplicationContext + AnnotatedBeanDefinitionReader for Java config.',
        'ServletWebServerApplicationContext creates embedded Tomcat/Jetty.',
        'Environment abstraction: profiles, property sources, @Value resolution.',
        'Parent-child contexts: web context child of root (legacy WAR).',
        'Actuator exposes /actuator/beans listing all bean definitions.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Single hub for beans, config, events',
      'Eager validation catches wiring errors at startup',
      'Rich ecosystem integration (MVC, Data, Security)',
    ],
    disadvantages: [
      'Large context slow to start (Spring Boot 3 native/AOT helps)',
      'getBean() overuse hides dependencies',
      'Testing full context heavy — use @SpringBootTest sparingly',
    ],
    alternatives: [
      'BeanFactory for lightweight embedded use (rare)',
      'Test slices (@WebMvcTest) smaller contexts',
    ],
    whenToUse: [
      'All Spring/Spring Boot applications',
      'Event-driven decoupling within app',
    ],
    whenNotToUse: [
      'getBean in business logic instead of DI',
      'Multiple unrelated monolith contexts without need',
    ],
  },
  failureModes: [
    'Context refresh failure — app won’t start (bean error).',
    'Memory leak holding context reference in static field.',
    'Listening to wrong event phase (before beans ready).',
    'Profile not active — expected beans missing.',
    'DevTools restart classloader issues with beans.',
  ],
  interview: {
    expectations: [
      'ApplicationContext vs BeanFactory',
      'What happens on Spring Boot startup',
      'When to use events vs direct calls',
    ],
    commonQuestions: [
      'What is ApplicationContext?',
      'BeanFactory vs ApplicationContext?',
      'Spring Boot startup process?',
    ],
    followUps: [
      'ContextRefreshedEvent use case?',
      'How access beans programmatically?',
    ],
    misconceptions: [
      'ApplicationContext and Spring container different things (context implements container)',
      'getBean preferred over injection',
      'Context created per request (singleton context per app)',
    ],
    traps: ['Using ClassPathXmlApplicationContext as primary Boot answer'],
    strongSignals: [
      'SpringApplication.run refresh lifecycle',
      'Event-driven @EventListener',
      'Test slices for smaller contexts',
    ],
  },
  keyTakeaways: [
    'ApplicationContext = IoC container + enterprise features.',
    'Boot creates and refreshes context at startup.',
    'Prefer DI over getBean().',
    'Publishes lifecycle and application events.',
    'Eager singleton init catches errors early.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is ApplicationContext?',
      answerHint: 'Spring IoC container managing beans, config, events, resources.',
    },
    {
      level: 'intermediate',
      question: 'ApplicationContext vs BeanFactory?',
      answerHint: 'ApplicationContext adds events, i18n, eager init, AOP auto-application.',
    },
    {
      level: 'advanced',
      question: 'What happens during context refresh?',
      answerHint: 'Load definitions, instantiate singletons, apply BeanPostProcessors, publish ContextRefreshedEvent.',
    },
  ],
  flashcards: [
    { front: 'Spring Boot starts', back: 'SpringApplication.run creates and refreshes ApplicationContext' },
    { front: 'ContextRefreshedEvent', back: 'Fired when context initialized and ready' },
    { front: 'getBean vs injection', back: 'Prefer constructor injection; getBean for dynamic lookup only' },
  ],
  quickRevision: [
    'Central IoC container',
    'Extends BeanFactory',
    'Events MessageSource AOP',
    'SpringApplication.run',
    'refresh() lifecycle',
    '@EventListener',
    'Avoid getBean in services',
  ],
}

export const content = applicationContextContent
