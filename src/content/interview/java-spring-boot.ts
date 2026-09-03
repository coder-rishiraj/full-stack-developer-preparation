import type { ReactInterviewItem } from './types'

export const JAVA_INTERVIEW_SPRING_BOOT: ReactInterviewItem[] = [
  {
    id: 'boot-vs-spring',
    question: 'Spring Framework vs Spring Boot?',
    relatedTopicIds: ['c6-spring-vs-boot', 'c6-project-structure', 'c6-starters'],
    answer: [{
      type: 'paragraph',
      text: 'Spring Framework provides the container, DI, AOP, MVC, transactions, and integration APIs. Spring Boot assembles those modules with dependency management, starters, conditional auto-configuration, embedded runtimes, executable packaging, and production tooling. Boot does not replace Spring; it applies conventions and remains overridable.',
    }],
  },
  {
    id: 'boot-application-annotation',
    question: 'What does @SpringBootApplication combine?',
    relatedTopicIds: ['c6-springbootapplication', 'c6-spring-application'],
    answer: [{
      type: 'paragraph',
      text: 'It combines @SpringBootConfiguration, @EnableAutoConfiguration, and @ComponentScan. Put the application class in a deliberate root package because component scanning starts there. It is a convenience annotation, not the entire startup mechanism.',
    }],
  },
  {
    id: 'boot-auto-configuration',
    question: 'How does Spring Boot auto-configuration work?',
    relatedTopicIds: ['c6-auto-configuration', 'c6-auto-configuration-imports', 'c6-conditional-annotations'],
    answer: [{
      type: 'paragraph',
      text: 'Boot discovers auto-configuration classes from AutoConfiguration.imports and evaluates @ConditionalOnClass, @ConditionalOnMissingBean, @ConditionalOnProperty, web-application, and related conditions. Matching configurations contribute beans; user-defined beans usually make defaults back off. The condition evaluation report explains matches and exclusions.',
    }],
  },
  {
    id: 'boot-property-precedence',
    question: 'How does externalized configuration precedence work?',
    relatedTopicIds: ['c6-properties', 'c6-property-source-order', 'c6-config-data'],
    answer: [{
      type: 'paragraph',
      text: 'Boot combines ordered property sources so a higher-priority source overrides a lower one. Typical sources include packaged config, external config, environment variables, system properties, SPRING_APPLICATION_JSON, and command-line arguments. Exact ordering matters, so diagnose the origin rather than assuming application.yml won.',
    }],
  },
  {
    id: 'boot-configuration-properties',
    question: '@ConfigurationProperties vs @Value?',
    relatedTopicIds: ['c6-configuration-properties', 'c6-value-vs-properties', 'c6-config-validation'],
    answer: [{
      type: 'paragraph',
      text: '@ConfigurationProperties binds a cohesive, type-safe object with relaxed names, conversion, metadata, and validation; it is preferred for application configuration. @Value is useful for an isolated expression but scatters string keys and is harder to validate or refactor.',
    }],
  },
  {
    id: 'boot-mvc-flow',
    question: 'Walk a Spring Boot MVC request from socket to JSON response.',
    relatedTopicIds: ['c6-request-lifecycle', 'c6-dispatcherservlet', 'c6-message-converters'],
    answer: [{
      type: 'paragraph',
      text: 'The embedded servlet container accepts the request and runs servlet filters. DispatcherServlet asks HandlerMapping for a controller method, HandlerAdapter invokes it using argument resolvers and validation, then a return-value handler and HttpMessageConverter serialize the body. Interceptors surround controller execution; exception resolvers map failures.',
    }],
  },
  {
    id: 'boot-filter-interceptor-aop',
    question: 'Filter vs interceptor vs AOP?',
    relatedTopicIds: ['c6-filter-vs-interceptor', 'c6-filters', 'c6-interceptors'],
    answer: [{
      type: 'paragraph',
      text: 'A servlet Filter surrounds the entire servlet pipeline and can wrap raw requests/responses. HandlerInterceptor runs inside Spring MVC around the selected handler. AOP surrounds Spring bean method calls through proxies. Use the narrowest layer that actually owns the concern.',
    }],
  },
  {
    id: 'boot-error-contract',
    question: 'How should a modern Boot REST API implement global errors?',
    relatedTopicIds: ['c6-exception-handling', 'c6-controlleradvice', 'c6-problemdetail'],
    answer: [{
      type: 'paragraph',
      text: 'Use @RestControllerAdvice with focused @ExceptionHandler methods and return a stable ProblemDetail-based contract. Map domain failures to intentional status codes, normalize validation errors, include a correlation identifier, and never expose stack traces, SQL, paths, or secrets to clients.',
    }],
  },
  {
    id: 'boot-restclient-webclient',
    question: 'RestClient vs WebClient vs RestTemplate?',
    relatedTopicIds: ['c6-restclient', 'c6-webclient', 'c6-resttemplate-legacy'],
    answer: [{
      type: 'paragraph',
      text: 'RestClient is the modern synchronous fluent client. WebClient is the reactive/non-blocking client and also supports streaming. RestTemplate is legacy maintenance knowledge. Whichever client you choose, configure connection/read/request timeouts, bounded resources, error mapping, observations, and safe retries at the reliability layer.',
    }],
  },
  {
    id: 'boot-actuator-probes',
    question: 'What is the difference between liveness and readiness?',
    relatedTopicIds: ['c6-liveness-readiness', 'c6-actuator', 'c6-health-groups'],
    answer: [{
      type: 'paragraph',
      text: 'Liveness asks whether the process is irrecoverably stuck and should be restarted; it should not usually depend on shared downstream systems. Readiness asks whether this instance should receive traffic and may reflect startup or critical dependency state. Mixing them causes restart storms or traffic sent too early.',
    }],
  },
  {
    id: 'boot-test-slices',
    question: '@WebMvcTest vs @SpringBootTest?',
    relatedTopicIds: ['c6-webmvctest', 'c6-springboottest', 'c6-test-slices'],
    answer: [{
      type: 'paragraph',
      text: '@WebMvcTest loads a focused MVC slice for controller mapping, conversion, validation, advice, and MockMvc; override collaborators with @MockitoBean. @SpringBootTest loads the application context and is appropriate for wiring or full integration paths. Use plain JUnit for business logic and avoid paying full-context cost everywhere.',
    }],
  },
  {
    id: 'boot-testcontainers',
    question: 'Why use Testcontainers and @ServiceConnection?',
    relatedTopicIds: ['c6-testcontainers-serviceconnection', 'c6-dynamic-property-source', 'c6-testing'],
    answer: [{
      type: 'paragraph',
      text: 'Testcontainers runs the real database or broker implementation, catching dialect, type, constraint, and protocol differences hidden by substitutes. @ServiceConnection lets Boot derive connection details from a supported container; @DynamicPropertySource remains useful for custom properties and unsupported integrations.',
    }],
  },
  {
    id: 'boot-async-scheduling',
    question: 'What are the main @Async and @Scheduled production traps?',
    relatedTopicIds: ['c6-async-proxy-boundary', 'c6-scheduling-cluster-trap', 'c6-task-context-propagation'],
    answer: [{
      type: 'paragraph',
      text: '@Async is proxy-based, so self-invocation skips it; execution also loses thread-local context unless propagated deliberately. @Scheduled runs on every replica unless coordinated, so jobs must be idempotent or use a distributed lock/leader. Configure bounded executors, rejection behavior, error handling, and observability.',
    }],
  },
  {
    id: 'boot-virtual-threads',
    question: 'What changes when Boot enables virtual threads?',
    relatedTopicIds: ['c6-virtual-threads-boot', 'c6-keep-alive', 'c3-virtual-threads'],
    answer: [{
      type: 'paragraph',
      text: 'With spring.threads.virtual.enabled, Boot configures supported task execution and scheduling around virtual threads. They improve throughput for many blocking I/O tasks, not CPU speed; downstream pools still need limits. Watch pinning and ThreadLocal assumptions, and enable keep-alive when only daemon-like virtual-thread workers remain.',
    }],
  },
  {
    id: 'boot-native-image',
    question: 'What trade-offs come with Spring AOT and native images?',
    relatedTopicIds: ['c6-aot-native', 'c6-runtime-hints', 'c6-native-tradeoffs'],
    answer: [{
      type: 'paragraph',
      text: 'AOT analyzes a closed-world application and generates initialization and reflection metadata for native compilation. Native images can start faster and use less steady memory, but builds are slower and dynamic reflection, resources, proxies, serialization, or classpath behavior may need RuntimeHints and native tests.',
    }],
  },
]
