import type { ReactInterviewItem } from './types'

export const JAVA_INTERVIEW_SPRING: ReactInterviewItem[] = [
  {
    id: 'spring-ioc-di',
    question: 'IoC vs dependency injection?',
    relatedTopicIds: ['c5-ioc', 'c5-ioc-vs-di', 'c5-di'],
    answer: [
      {
        type: 'paragraph',
        text: 'IoC is the principle that a component does not create or look up its collaborators. Dependency injection is how Spring implements that: the ApplicationContext constructs beans and supplies constructor, setter, or field dependencies from metadata.',
      },
    ],
  },
  {
    id: 'spring-beanfactory-context',
    question: 'BeanFactory vs ApplicationContext?',
    relatedTopicIds: ['c5-beanfactory-vs-context', 'c5-applicationcontext'],
    answer: [
      {
        type: 'paragraph',
        text: 'BeanFactory is the basic IoC contract: get beans by name/type. ApplicationContext extends it with environment, internationalization, resource loading, event publication, and AOP/enterprise integration. Production apps use an ApplicationContext; BeanFactory is the internal core.',
      },
    ],
  },
  {
    id: 'spring-constructor-injection',
    question: 'Why is constructor injection preferred?',
    relatedTopicIds: ['c5-constructor-injection', 'c5-field-injection', 'c5-di'],
    answer: [
      {
        type: 'paragraph',
        text: 'Required collaborators become final, the class is usable in a plain unit test with `new`, and missing beans fail at context startup. Field injection hides dependencies, blocks immutability, and often NPEs in tests that never start Spring. Setter injection is for optional collaborators.',
      },
    ],
  },
  {
    id: 'spring-bean-scopes',
    question: 'What are the default bean scopes, and why must singletons be thread-safe?',
    relatedTopicIds: ['c5-singleton-scope', 'c5-prototype-scope', 'c5-web-scopes', 'c5-beans'],
    answer: [
      {
        type: 'paragraph',
        text: 'Default is singleton: one instance per container, shared across threads, so mutable per-request state is a race. Prototype creates a new instance per retrieval/injection. Request/session/application exist only on a web-aware context. Injecting a shorter-lived bean into a singleton needs a scoped proxy or ObjectProvider.',
      },
    ],
  },
  {
    id: 'spring-bean-lifecycle',
    question: 'Walk the Spring bean lifecycle.',
    relatedTopicIds: ['c5-bean-lifecycle', 'c5-postconstruct-predestroy', 'c5-bpp-in-lifecycle'],
    answer: [
      {
        type: 'paragraph',
        text: 'Load BeanDefinitions, instantiate, populate/inject, BeanPostProcessor.before, init callbacks (@PostConstruct / afterPropertiesSet / init-method), BeanPostProcessor.after (AOP proxy wrapping happens here), then the bean is in service. On close: @PreDestroy / destroy. Prototype destroy is not owned by the container.',
      },
    ],
  },
  {
    id: 'spring-configuration-lite',
    question: '@Configuration vs @Bean on a @Component?',
    relatedTopicIds: ['c5-full-vs-lite-config', 'c5-configuration', 'c5-bean-methods'],
    answer: [
      {
        type: 'paragraph',
        text: 'Full @Configuration classes are enhanced so calls between @Bean methods return the singleton from the container. Lite mode (@Bean on a plain @Component) runs the method as a normal Java call, so inter-method calls can create extra instances. Use @Configuration for infrastructure recipes.',
      },
    ],
  },
  {
    id: 'spring-circular',
    question: 'How do circular dependencies fail in modern Spring Boot?',
    relatedTopicIds: ['c5-circular-dependencies', 'c5-allow-circular-references', 'c5-constructor-injection'],
    answer: [
      {
        type: 'paragraph',
        text: 'Constructor cycles cannot be created: each bean needs the other first. Since Boot 2.6, circular references are prohibited by default even when setters might previously have broken the cycle. Refactor (extract a third type, events, or a mediator). @Lazy injects a proxy as a last-resort break. allow-circular-references=true is a migration flag, not a design.',
      },
    ],
  },
  {
    id: 'spring-qualifier-primary',
    question: 'How does Spring choose among multiple beans of the same type?',
    relatedTopicIds: ['c5-autowired-qualifier-primary', 'c5-multiple-candidates'],
    answer: [
      {
        type: 'paragraph',
        text: 'By type first. If several match, @Primary marks the default. @Qualifier or the parameter/bean name disambiguates. Otherwise startup fails with NoUniqueBeanDefinitionException. Prefer marking a single primary implementation over scattering qualifiers.',
      },
    ],
  },
  {
    id: 'spring-aop-proxy',
    question: 'Why can @Transactional (or a custom @Aspect) silently not run?',
    relatedTopicIds: ['c5-self-invocation', 'c5-proxies', 'c5-aop', 'c5-jdk-vs-cglib'],
    answer: [
      {
        type: 'paragraph',
        text: 'Spring AOP is proxy-based. Callers must go through the proxy. this.otherMethod() on the target skips advice. Private/final methods and final classes are not advised depending on JDK vs CGLIB. Only Spring-managed beans are proxied. Check the runtime class name and call via an injected self or split types.',
      },
    ],
  },
  {
    id: 'spring-jdk-cglib',
    question: 'JDK dynamic proxy vs CGLIB?',
    relatedTopicIds: ['c5-jdk-vs-cglib', 'c5-proxy-target-class', 'c5-final-methods-aop'],
    answer: [
      {
        type: 'paragraph',
        text: 'JDK proxies implement the target’s interfaces and only intercept interface methods. CGLIB subclasses the concrete class and cannot advise final methods/classes. Spring Boot typically prefers class-based proxies (proxy-target-class). Casting to a non-interface implementation type fails on a JDK proxy.',
      },
    ],
  },
  {
    id: 'spring-component-scan',
    question: 'What is the default-package component-scan trap?',
    relatedTopicIds: ['c5-base-packages', 'c5-component-scanning'],
    answer: [
      {
        type: 'paragraph',
        text: 'Putting the configuration class (or @SpringBootApplication) in the default package makes the scan root unspecified in a dangerous way and can pull in huge swaths of the classpath. Keep the application type in a root package such as com.example.app and scan downward.',
      },
    ],
  },
  {
    id: 'spring-profiles',
    question: 'How do profiles change the bean graph?',
    relatedTopicIds: ['c5-profiles', 'c5-active-profiles', 'c5-environment-abstraction'],
    answer: [
      {
        type: 'paragraph',
        text: '@Profile on a @Component or @Configuration registers those beans only when the profile is active. Activation is an Environment concern (spring.profiles.active, tests, command line). Default profiles apply when none are set. Do not use profiles as a substitute for feature flags on every tiny bean.',
      },
    ],
  },
  {
    id: 'spring-test-without-boot',
    question: 'How do you unit-test a Spring service without starting Boot?',
    relatedTopicIds: ['c5-plain-unit-constructor', 'c5-spring-core-testing', 'c5-constructor-injection'],
    answer: [
      {
        type: 'paragraph',
        text: 'If the service uses constructor injection, construct it with mocks in a plain JUnit test. Start a Spring context (@ContextConfiguration or a Boot slice) only when you need real wiring, AOP, or conversion. @DirtiesContext is expensive; prefer immutable singletons and constructor tests.',
      },
    ],
  },
]
