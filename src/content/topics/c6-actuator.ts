import type { TopicContent } from '@/domain/types'

export const actuatorContent: TopicContent = {
  whatIsIt:
    'Spring Boot Actuator exposes production-ready endpoints for health, metrics, environment, loggers, and thread dumps — via spring-boot-starter-actuator, secured and often network-isolated in production.',
  whyExists:
    'Ops and orchestrators (Kubernetes) need liveness/readiness probes, metric scraping, and runtime introspection without SSH or custom admin servlets. Actuator standardizes endpoints across Boot services.',
  mentalModel:
    'Add starter → /actuator/health, /metrics, etc. (base path configurable). HealthIndicator beans aggregate status (DB, disk, custom). Micrometer exports Prometheus metrics. Expose only needed endpoints; secure with Spring Security or management port.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Dependency: spring-boot-starter-actuator.',
        'management.endpoints.web.exposure.include=health,info,prometheus.',
        'management.server.port=8081 — separate management port on K8s internal network.',
        'HealthContributor: RedisHealthIndicator, DataSourceHealthIndicator auto-configured.',
        'Custom @Component implements HealthIndicator for downstream dependency checks.',
      ],
    },
    {
      type: 'table',
      headers: ['Endpoint', 'Purpose', 'Prod expose?'],
      rows: [
        ['/actuator/health', 'Liveness/readiness', 'Yes — limited detail'],
        ['/actuator/metrics', 'Micrometer metrics', 'Often via Prometheus scrape'],
        ['/actuator/prometheus', 'Prometheus format', 'Yes — internal network'],
        ['/actuator/env', 'All properties', 'No — secrets risk'],
        ['/actuator/loggers', 'Change log levels', 'Restricted admin only'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  K8s[K8s probe] --> Health["/actuator/health"]
  Prom[Prometheus] --> PromEp["/actuator/prometheus"]
  Actuator[Actuator endpoints] --> HC[HealthIndicators]
  Actuator --> MM[Micrometer registry]
  HC --> DB[(Database ping)]
  MM --> JVM[JVM / HTTP metrics]`,
    caption: 'Actuator bridges app internals to ops tooling',
  },
  example: [
    {
      type: 'code',
      language: 'yaml',
      caption: 'Typical production actuator config',
      code: `management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus
  endpoint:
    health:
      show-details: when_authorized
      probes:
        enabled: true
  server:
    port: 8081
  metrics:
    tags:
      application: \${spring.application.name}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Custom health indicator',
      code: `@Component
public class PaymentGatewayHealth implements HealthIndicator {
  private final PaymentClient client;

  @Override
  public Health health() {
    try {
      client.ping();
      return Health.up().withDetail("gateway", "reachable").build();
    } catch (Exception ex) {
      return Health.down(ex).withDetail("gateway", "unreachable").build();
    }
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Custom business metric',
      code: `@Service
public class OrderService {
  private final Counter ordersCreated;

  public OrderService(MeterRegistry registry) {
    this.ordersCreated = registry.counter("orders.created");
  }

  public Order create(...) {
    ordersCreated.increment();
    ...
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'EndpointDiscoverer maps @Endpoint beans to web exposure.',
        'Liveness/readiness: /actuator/health/liveness and /readiness with K8s probes enabled.',
        'Micrometer Timer on http.server.requests auto-configured.',
        'JMX exposure parallel to web — often disabled.',
        'Spring Boot Admin UI aggregates actuator from fleet (optional).',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Standard probes and metrics out of box',
      'Extensible HealthIndicator and metrics',
      'Separate management port isolation',
    ],
    disadvantages: [
      'Misconfigured exposure leaks env/secrets',
      'Health checks calling slow deps mark pod not ready',
    ],
    alternatives: [
      'Custom /health controller (reinventing actuator)',
      'Service mesh health without app endpoint',
    ],
    whenToUse: [
      'Every production Boot service',
      'K8s deployments with Prometheus',
    ],
    whenNotToUse: [
      'Public internet exposure of all endpoints',
    ],
  },
  failureModes: [
    'management.endpoints.web.exposure.include=* in prod — env, beans exposed.',
    'Health check hits external API — flaky readiness.',
    'show-details: always leaks DB connection info.',
    'Same port as app without security — actuator scraped by attackers.',
    'Heavy /actuator/heapdump OOM on request.',
  ],
  production: {
    security: [
      'Separate management port; network policy internal only',
      'Spring Security on actuator; never expose env/beans publicly',
    ],
    reliability: ['Lightweight health checks; timeout external pings'],
    observability: ['Prometheus scrape + Grafana dashboards from Micrometer'],
  },
  interview: {
    expectations: [
      'Enable actuator and expose health/prometheus',
      'Liveness vs readiness',
      'Custom HealthIndicator',
    ],
    commonQuestions: [
      'What is Spring Boot Actuator?',
      'K8s health probes with Boot?',
      'Secure actuator endpoints?',
    ],
    followUps: [
      'Micrometer vs Actuator?',
      'Custom metrics registration?',
    ],
    misconceptions: [
      'Actuator enabled by default exposes all endpoints publicly',
      'Health UP means all business logic healthy',
    ],
    traps: ['Exposing /actuator/env on public port'],
    strongSignals: [
      'management.server.port separation',
      'include=health,prometheus only',
      'Custom HealthIndicator with timeout',
    ],
  },
  keyTakeaways: [
    'starter-actuator for health + metrics.',
    'Expose minimal endpoints in prod.',
    'Separate management port + security.',
    'Liveness/readiness for K8s.',
    'Micrometer counters/timers for business metrics.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Actuator health endpoint purpose?',
      answerHint: 'Aggregate HealthIndicators — UP/DOWN for orchestrator probes.',
    },
    {
      level: 'intermediate',
      question: 'Liveness vs readiness?',
      answerHint: 'Liveness: restart if deadlocked; readiness: stop traffic if cannot serve (DB down).',
    },
    {
      level: 'advanced',
      question: 'Prevent actuator secret leak?',
      answerHint: 'Limit exposure, separate port, auth, show-details when_authorized, never expose env publicly.',
    },
  ],
  flashcards: [
    { front: 'Actuator dependency', back: 'spring-boot-starter-actuator' },
    { front: 'Prometheus endpoint', back: '/actuator/prometheus' },
    { front: 'K8s probe paths', back: '/actuator/health/liveness and /readiness' },
  ],
  quickRevision: [
    'starter-actuator',
    'health + prometheus expose',
    'management.server.port',
    'Custom HealthIndicator',
    'Micrometer metrics',
    'No env/beans public',
    'Lightweight health checks',
  ],
}

export const content = actuatorContent
