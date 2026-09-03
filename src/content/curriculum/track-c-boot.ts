import type { Priority } from '@/domain/types'
import type { SectionSeed, TopicSeed } from './build'

const BOOT = ['spring-boot'] as const
const M34 = [3, 4]
const M45 = [4, 5]

function item(
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  const { tags, executionPriority, ...rest } = extra
  return {
    id,
    title,
    priority,
    months: extra.months ?? (priority === 'tier1' ? M34 : M45),
    tags: [...BOOT, ...(tags ?? [])],
    executionPriority:
      executionPriority ?? (priority === 'tier1' ? 'p0' : priority === 'tier2' ? 'p1' : 'later'),
    ...rest,
  }
}

function nest(
  parent: string,
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  return item(id, title, priority, {
    ...extra,
    curriculumLevel: 'nested-concept',
    parentTopicId: parent,
  })
}

function section(id: string, title: string, order: number, topics: TopicSeed[]): SectionSeed {
  return {
    id,
    track: 'C',
    title,
    order,
    defaultKind: 'theory',
    defaultDepth: 'deep',
    topics,
  }
}

/**
 * C6.1–C6.20 — Spring Boot application and HTTP adapter engineering.
 * Spring container/AOP stay in C5; SQL/JPA in C7/C8; Security in C9;
 * Redis/Kafka in C10/C11; generic resilience/testing/deployment/observability
 * stay in C12–C16. C6 covers the Boot-specific integration points.
 */
export const TRACK_C_BOOT_SECTIONS: SectionSeed[] = [
  section('C6.1', 'Boot Foundations & Project Structure', 79, [
    item('c6-project-structure', 'Spring Boot Foundations & Project Structure'),
    nest('c6-project-structure', 'c6-spring-vs-boot', 'Spring Framework vs Spring Boot'),
    nest('c6-project-structure', 'c6-spring-initializr', 'Spring Initializr'),
    nest('c6-project-structure', 'c6-package-by-feature', 'Package by Layer vs Package by Feature'),
    nest('c6-project-structure', 'c6-maven-gradle-plugins', 'Maven & Gradle Boot Plugins'),
    nest('c6-project-structure', 'c6-starters', 'Starter Dependencies'),
    nest('c6-project-structure', 'c6-dependency-management', 'BOM & Dependency Management'),
    nest('c6-project-structure', 'c6-executable-jar', 'Executable & Layered JARs'),
    nest('c6-project-structure', 'c6-devtools', 'DevTools & Restart Classloader', 'tier2'),
  ]),

  section('C6.2', 'SpringApplication & Startup', 80, [
    item('c6-spring-application', 'SpringApplication & Startup Lifecycle'),
    nest('c6-spring-application', 'c6-springbootapplication', '@SpringBootApplication Composition'),
    nest('c6-spring-application', 'c6-springapplication-run', 'SpringApplication.run()'),
    nest('c6-spring-application', 'c6-web-application-type', 'Servlet, Reactive & Non-Web Application Types'),
    nest('c6-spring-application', 'c6-startup-events', 'Startup Events & Listeners'),
    nest('c6-spring-application', 'c6-runners', 'CommandLineRunner & ApplicationRunner'),
    nest('c6-spring-application', 'c6-exit-codes', 'Application Exit Codes', 'tier2'),
    nest('c6-spring-application', 'c6-startup-failure-analysis', 'FailureAnalyzers & Startup Diagnostics'),
  ]),

  section('C6.3', 'Auto-configuration & Starters', 81, [
    item('c6-auto-configuration', 'Auto-configuration'),
    nest('c6-auto-configuration', 'c6-enable-auto-configuration', '@EnableAutoConfiguration'),
    nest('c6-auto-configuration', 'c6-auto-configuration-imports', 'AutoConfiguration.imports'),
    nest('c6-auto-configuration', 'c6-conditional-annotations', '@ConditionalOn* Annotations'),
    nest('c6-auto-configuration', 'c6-auto-config-backoff', 'Back-off & User Overrides'),
    nest('c6-auto-configuration', 'c6-auto-config-ordering', 'Auto-configuration Ordering'),
    nest('c6-auto-configuration', 'c6-condition-report', 'Condition Evaluation Report'),
    nest('c6-auto-configuration', 'c6-excluding-auto-config', 'Excluding Auto-configuration'),
    nest('c6-auto-configuration', 'c6-custom-auto-config', 'Custom Auto-configuration & Starters', 'tier2'),
    nest('c6-auto-configuration', 'c6-boot4-modularization', 'Boot 4 Modular Auto-configuration', 'tier2'),
  ]),

  section('C6.4', 'Externalized Configuration', 82, [
    item('c6-properties', 'Externalized Configuration & Properties'),
    nest('c6-properties', 'c6-property-source-order', 'Property Source Precedence'),
    nest('c6-properties', 'c6-config-data', 'Config Data API & Imports'),
    nest('c6-properties', 'c6-properties-vs-yaml', 'application.properties vs YAML'),
    nest('c6-properties', 'c6-env-cli-json', 'Environment, CLI & SPRING_APPLICATION_JSON'),
    nest('c6-properties', 'c6-profiles-groups', 'Profiles, Groups & Activation'),
    nest('c6-properties', 'c6-configuration-properties', '@ConfigurationProperties'),
    nest('c6-properties', 'c6-value-vs-properties', '@Value vs @ConfigurationProperties'),
    nest('c6-properties', 'c6-relaxed-binding', 'Relaxed Binding'),
    nest('c6-properties', 'c6-duration-datasize', 'Duration, DataSize & Custom Conversion'),
    nest('c6-properties', 'c6-config-validation', 'Configuration Validation'),
    nest('c6-properties', 'c6-configtree-secrets', 'configtree: & Mounted Secrets', 'tier2', {
      related: ['c9-secrets'],
    }),
  ]),

  section('C6.5', 'Embedded Web Runtime', 83, [
    item('c6-embedded-server', 'Embedded Web Server & Runtime'),
    nest('c6-embedded-server', 'c6-embedded-tomcat', 'Embedded Tomcat'),
    nest('c6-embedded-server', 'c6-jetty-undertow', 'Jetty & Undertow Alternatives', 'tier2'),
    nest('c6-embedded-server', 'c6-server-customization', 'Server Port, Context Path & Compression'),
    nest('c6-embedded-server', 'c6-http2-ssl-bundles', 'HTTP/2, TLS & SSL Bundles', 'tier2', {
      related: ['c4-http2', 'c4-tls'],
    }),
    nest('c6-embedded-server', 'c6-thread-per-request', 'Servlet Thread-per-Request Model'),
    nest('c6-embedded-server', 'c6-virtual-threads-boot', 'Boot Virtual Thread Integration', 'tier2', {
      related: ['c3-virtual-threads'],
    }),
    nest('c6-embedded-server', 'c6-war-deployment', 'Executable JAR vs Traditional WAR', 'tier2'),
  ]),

  section('C6.6', 'Spring MVC Request Lifecycle', 84, [
    item('c6-request-lifecycle', 'Request/Response Lifecycle'),
    nest('c6-request-lifecycle', 'c6-servlet-foundations', 'Servlet API & Container Bridge'),
    nest('c6-request-lifecycle', 'c6-dispatcherservlet', 'DispatcherServlet Front Controller'),
    nest('c6-request-lifecycle', 'c6-handler-mapping-adapter', 'HandlerMapping & HandlerAdapter'),
    nest('c6-request-lifecycle', 'c6-argument-resolvers', 'HandlerMethodArgumentResolver'),
    nest('c6-request-lifecycle', 'c6-return-value-handlers', 'Return Value Handlers'),
    nest('c6-request-lifecycle', 'c6-message-converters', 'HttpMessageConverters'),
    nest('c6-request-lifecycle', 'c6-content-negotiation', 'Content Negotiation'),
    nest('c6-request-lifecycle', 'c6-mvc-async', 'MVC Async: Callable, DeferredResult & Streaming', 'tier2'),
    nest('c6-request-lifecycle', 'c6-webmvc-vs-webflux', 'Spring MVC vs WebFlux', 'tier2'),
  ]),

  section('C6.7', 'REST Controllers & HTTP Semantics', 85, [
    item('c6-rest-controllers', 'REST Controllers'),
    nest('c6-rest-controllers', 'c6-controller-vs-restcontroller', '@Controller vs @RestController'),
    nest('c6-rest-controllers', 'c6-request-mappings', '@RequestMapping & HTTP Method Mappings'),
    nest('c6-rest-controllers', 'c6-path-query-header-binding', 'Path, Query & Header Binding'),
    nest('c6-rest-controllers', 'c6-requestbody-responseentity', '@RequestBody, @ResponseStatus & ResponseEntity'),
    nest('c6-rest-controllers', 'c6-http-status-semantics', 'HTTP Status & Method Semantics', 'tier1', {
      related: ['c4-http-methods'],
    }),
    nest('c6-rest-controllers', 'c6-cors-mvc', 'MVC CORS Configuration', 'tier2', {
      related: ['c4-cors', 'c9-cors-security'],
    }),
    nest('c6-rest-controllers', 'c6-file-upload-download', 'Multipart Uploads & Downloads', 'tier2'),
    nest('c6-rest-controllers', 'c6-openapi-springdoc', 'OpenAPI with springdoc', 'tier2'),
  ]),

  section('C6.8', 'DTOs, JSON & API Boundaries', 86, [
    item('c6-dtos', 'DTOs & API Boundaries'),
    nest('c6-dtos', 'c6-request-response-dtos', 'Request vs Response DTOs'),
    nest('c6-dtos', 'c6-record-dtos', 'Java Records as DTOs'),
    nest('c6-dtos', 'c6-entity-exposure', 'Why APIs Must Not Expose Entities', 'tier1', {
      related: ['c8-entities', 'c8-lazy-loading'],
    }),
    nest('c6-dtos', 'c6-jackson-binding', 'Jackson Serialization & Deserialization'),
    nest('c6-dtos', 'c6-json-naming-inclusion', 'Naming, Inclusion & Unknown Fields'),
    nest('c6-dtos', 'c6-objectmapper-customization', 'ObjectMapper & JsonMapper Customization'),
    nest('c6-dtos', 'c6-jackson3-migration', 'Jackson 2 to Jackson 3 Migration', 'tier2'),
    nest('c6-dtos', 'c6-dto-mapping', 'Manual Mapping vs MapStruct', 'tier2'),
  ]),

  section('C6.9', 'Validation & Data Binding', 87, [
    item('c6-validation', 'Validation & Data Binding'),
    nest('c6-validation', 'c6-jakarta-validation', 'Jakarta Bean Validation'),
    nest('c6-validation', 'c6-valid-vs-validated', '@Valid vs @Validated'),
    nest('c6-validation', 'c6-constraint-annotations', 'Built-in Constraint Annotations'),
    nest('c6-validation', 'c6-custom-constraints', 'Custom Constraints'),
    nest('c6-validation', 'c6-validation-groups', 'Validation Groups', 'tier2'),
    nest('c6-validation', 'c6-method-validation', 'Method Validation'),
    nest('c6-validation', 'c6-bindingresult', 'BindingResult & Field Errors'),
    nest('c6-validation', 'c6-type-conversion', 'Converter, Formatter & DataBinder', 'tier2'),
  ]),

  section('C6.10', 'Exception Handling & Error Contracts', 88, [
    item('c6-exception-handling', 'Global Exception Handling'),
    nest('c6-exception-handling', 'c6-exceptionhandler', '@ExceptionHandler'),
    nest('c6-exception-handling', 'c6-controlleradvice', '@ControllerAdvice & @RestControllerAdvice'),
    nest('c6-exception-handling', 'c6-handler-exception-resolvers', 'HandlerExceptionResolver Chain'),
    nest('c6-exception-handling', 'c6-problemdetail', 'ProblemDetail & RFC 9457'),
    nest('c6-exception-handling', 'c6-validation-error-contract', 'Stable Validation Error Responses'),
    nest('c6-exception-handling', 'c6-error-correlation', 'Correlation IDs in Error Responses'),
    nest('c6-exception-handling', 'c6-error-information-leaks', 'Preventing Error Information Leaks', 'tier1', {
      related: ['c9-owasp'],
    }),
  ]),

  section('C6.11', 'Filters, Interceptors & Web Hooks', 89, [
    item('c6-filters', 'Servlet Filters & MVC Interceptors'),
    nest('c6-filters', 'c6-interceptors', 'HandlerInterceptor'),
    nest('c6-filters', 'c6-filter-vs-interceptor', 'Filter vs Interceptor vs AOP'),
    nest('c6-filters', 'c6-once-per-request-filter', 'OncePerRequestFilter'),
    nest('c6-filters', 'c6-filter-registration', 'FilterRegistrationBean & Ordering'),
    nest('c6-filters', 'c6-request-wrappers', 'Request/Response Wrappers & Body Caching', 'tier2'),
    nest('c6-filters', 'c6-webmvcconfigurer', 'WebMvcConfigurer'),
    nest('c6-filters', 'c6-controller-advice-hooks', 'Controller Advice Binding Hooks', 'tier2'),
  ]),

  section('C6.12', 'API Versioning & Evolution', 90, [
    item('c6-api-versioning', 'API Versioning & Evolution', 'tier2'),
    nest('c6-api-versioning', 'c6-uri-header-media-versioning', 'URI, Header & Media-Type Versioning', 'tier2'),
    nest('c6-api-versioning', 'c6-framework7-api-versioning', 'Spring Framework 7 API Versioning', 'tier2'),
    nest('c6-api-versioning', 'c6-breaking-vs-additive', 'Breaking vs Additive Changes', 'tier2'),
    nest('c6-api-versioning', 'c6-deprecation-sunset', 'Deprecation, Sunset & Migration Windows', 'tier2'),
    nest('c6-api-versioning', 'c6-versioned-dtos', 'Versioned Controllers & DTOs', 'tier2'),
    nest('c6-api-versioning', 'c6-api-contract-tests', 'Compatibility & Contract Tests', 'tier2', {
      related: ['c13-contract-testing'],
    }),
  ]),

  section('C6.13', 'Pagination, Sorting & Collection APIs', 91, [
    item('c6-pagination', 'Pagination, Sorting & Collection APIs'),
    nest('c6-pagination', 'c6-pageable-sort', 'Pageable, Page & Sort'),
    nest('c6-pagination', 'c6-page-vs-slice', 'Page vs Slice'),
    nest('c6-pagination', 'c6-offset-pagination', 'Offset Pagination'),
    nest('c6-pagination', 'c6-keyset-pagination', 'Keyset/Cursor Pagination', 'tier2', {
      related: ['c7-composite-indexes'],
    }),
    nest('c6-pagination', 'c6-pagination-validation', 'Bounds, Maximum Page Size & Stable Ordering'),
    nest('c6-pagination', 'c6-pagination-metadata-links', 'Metadata, Links & HATEOAS', 'tier2'),
    nest('c6-pagination', 'c6-filtering-search', 'Filtering & Search Parameters'),
  ]),

  section('C6.14', 'HTTP Clients & Service Integration', 92, [
    item('c6-http-clients', 'HTTP Clients & Service Integration'),
    nest('c6-http-clients', 'c6-restclient', 'RestClient'),
    nest('c6-http-clients', 'c6-webclient', 'WebClient'),
    nest('c6-http-clients', 'c6-http-service-clients', 'HTTP Service Clients & @HttpExchange'),
    nest('c6-http-clients', 'c6-resttemplate-legacy', 'RestTemplate (Legacy)', 'tier2'),
    nest('c6-http-clients', 'c6-client-configuration', 'Base URL, Headers & Message Conversion'),
    nest('c6-http-clients', 'c6-client-timeouts', 'Connect, Read & Request Timeouts', 'tier1', {
      related: ['c12-timeouts'],
    }),
    nest('c6-http-clients', 'c6-client-errors', 'Status Handling & Error Mapping'),
    nest('c6-http-clients', 'c6-client-observation', 'Client Observations & Context Propagation', 'tier2', {
      related: ['c16-tracing'],
    }),
  ]),

  section('C6.15', 'Task Execution & Scheduling', 93, [
    item('c6-task-execution', 'Task Execution & Scheduling', 'tier2'),
    nest('c6-task-execution', 'c6-enable-async', '@EnableAsync & @Async', 'tier2'),
    nest('c6-task-execution', 'c6-async-proxy-boundary', '@Async Proxy & Self-Invocation', 'tier2', {
      related: ['c5-self-invocation'],
    }),
    nest('c6-task-execution', 'c6-enable-scheduling', '@EnableScheduling & @Scheduled', 'tier2'),
    nest('c6-task-execution', 'c6-cron-fixed-delay-rate', 'Cron, fixedDelay & fixedRate', 'tier2'),
    nest('c6-task-execution', 'c6-task-executor-auto-config', 'TaskExecutor Auto-configuration', 'tier2'),
    nest('c6-task-execution', 'c6-task-scheduler-auto-config', 'TaskScheduler Auto-configuration', 'tier2'),
    nest('c6-task-execution', 'c6-task-context-propagation', 'TaskDecorator & Context Propagation', 'tier2'),
    nest('c6-task-execution', 'c6-scheduling-cluster-trap', 'Duplicate Scheduling in a Cluster', 'tier2'),
  ]),

  section('C6.16', 'Logging & Diagnostics', 94, [
    item('c6-logging', 'Logging & Diagnostics'),
    nest('c6-logging', 'c6-logging-facade-backend', 'SLF4J, Logback & LoggingSystem'),
    nest('c6-logging', 'c6-log-levels-groups', 'Levels, Groups & Package Configuration'),
    nest('c6-logging', 'c6-log-patterns-files', 'Console Patterns, Files & Rotation'),
    nest('c6-logging', 'c6-structured-logging-boot', 'Built-in Structured Logging', 'tier2', {
      related: ['c16-structured-logging'],
    }),
    nest('c6-logging', 'c6-mdc-correlation', 'MDC & Correlation IDs'),
    nest('c6-logging', 'c6-runtime-loggers', 'Runtime Log-Level Changes'),
    nest('c6-logging', 'c6-startup-debug', '--debug & Startup Reports'),
  ]),

  section('C6.17', 'Actuator & Application Availability', 95, [
    item('c6-actuator', 'Actuator & Application Availability'),
    nest('c6-actuator', 'c6-actuator-endpoints', 'Actuator Endpoint Model'),
    nest('c6-actuator', 'c6-endpoint-exposure', 'Exposure, Access & Management Port'),
    nest('c6-actuator', 'c6-health-contributors', 'HealthContributor & HealthIndicator'),
    nest('c6-actuator', 'c6-liveness-readiness', 'Liveness, Readiness & Availability States', 'tier1', {
      related: ['c12-health-checks'],
    }),
    nest('c6-actuator', 'c6-health-groups', 'Health Groups'),
    nest('c6-actuator', 'c6-micrometer-bridge', 'Micrometer Metrics Bridge', 'tier2', {
      related: ['c16-metrics'],
    }),
    nest('c6-actuator', 'c6-actuator-security', 'Securing Sensitive Endpoints', 'tier1', {
      related: ['c9-spring-security'],
    }),
    nest('c6-actuator', 'c6-custom-actuator-endpoint', 'Custom Actuator Endpoints', 'tier2'),
  ]),

  section('C6.18', 'Spring Boot Testing', 96, [
    item('c6-testing', 'Spring Boot Testing'),
    nest('c6-testing', 'c6-springboottest', '@SpringBootTest'),
    nest('c6-testing', 'c6-webmvctest', '@WebMvcTest & MockMvc'),
    nest('c6-testing', 'c6-webfluxtest', '@WebFluxTest & WebTestClient', 'tier2'),
    nest('c6-testing', 'c6-json-rest-client-tests', '@JsonTest & REST Client Tests', 'tier2'),
    nest('c6-testing', 'c6-test-slices', 'Test Slices & Restricted Contexts'),
    nest('c6-testing', 'c6-mockito-bean', '@MockitoBean & @MockitoSpyBean'),
    nest('c6-testing', 'c6-context-caching', 'Context Caching & @DirtiesContext'),
    nest('c6-testing', 'c6-testcontainers-serviceconnection', 'Testcontainers & @ServiceConnection', 'tier2', {
      related: ['c13-testcontainers'],
    }),
    nest('c6-testing', 'c6-dynamic-property-source', '@DynamicPropertySource', 'tier2'),
    nest('c6-testing', 'c6-random-port-tests', 'RANDOM_PORT & Real HTTP Tests'),
  ]),

  section('C6.19', 'AOT, Native Images & Runtime Efficiency', 97, [
    item('c6-aot-native', 'AOT Processing & Native Images', 'tier2'),
    nest('c6-aot-native', 'c6-spring-aot', 'Spring AOT Processing', 'tier2'),
    nest('c6-aot-native', 'c6-graalvm-native', 'GraalVM Native Images', 'tier2'),
    nest('c6-aot-native', 'c6-runtime-hints', 'RuntimeHints & Reflection Metadata', 'tier2'),
    nest('c6-aot-native', 'c6-aot-generated-code', 'Generated Initializers & Proxies', 'tier2'),
    nest('c6-aot-native', 'c6-native-testing', 'Native Build & Test Lifecycle', 'tier2'),
    nest('c6-aot-native', 'c6-native-tradeoffs', 'Startup/Memory vs Build/Compatibility Trade-offs', 'tier2'),
    nest('c6-aot-native', 'c6-crac', 'CRaC Checkpoint/Restore', 'tier3'),
  ]),

  section('C6.20', 'Production Lifecycle & Packaging', 98, [
    item('c6-production-lifecycle', 'Production Lifecycle & Packaging'),
    nest('c6-production-lifecycle', 'c6-graceful-shutdown', 'Graceful Shutdown & Timeout'),
    nest('c6-production-lifecycle', 'c6-keep-alive', 'spring.main.keep-alive & Daemon Threads', 'tier2'),
    nest('c6-production-lifecycle', 'c6-buildpacks', 'OCI Images with Cloud Native Buildpacks', 'tier2', {
      related: ['c14-docker-images'],
    }),
    nest('c6-production-lifecycle', 'c6-docker-compose-support', 'Development-time Docker Compose Support', 'tier2', {
      related: ['c14-compose'],
    }),
    nest('c6-production-lifecycle', 'c6-layered-container-images', 'Layered Container Images', 'tier2'),
    nest('c6-production-lifecycle', 'c6-admin-enabled-trap', 'Remote Admin & Unsafe Endpoint Traps', 'tier2'),
    nest('c6-production-lifecycle', 'c6-deployment-checklist', 'Production Configuration Checklist'),
  ]),
]
