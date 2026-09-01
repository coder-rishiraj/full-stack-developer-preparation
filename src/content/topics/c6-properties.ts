import type { TopicContent } from '@/domain/types'

export const propertiesContent: TopicContent = {
  whatIsIt:
    'Spring Boot externalized configuration binds properties from application.yml, environment variables, command-line args, and cloud config into @ConfigurationProperties beans and @Value fields — with relaxed binding (kebab-case, env var UPPER_SNAKE) and type-safe POJOs.',
  whyExists:
    'Hardcoded URLs, pool sizes, and feature flags require rebuilds to change. Externalized config separates deployment concerns from code, supports 12-factor apps, and lets ops tune without developer involvement.',
  mentalModel:
    'Property sources stack with precedence: command line > env vars > application-{profile}.yml > application.yml > defaults. @ConfigurationProperties(prefix="app") maps app.database.url → field. Env var APP_DATABASE_URL maps to same key via relaxed binding.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'PropertySourcePlaceholderConfigurer resolves ${...} placeholders.',
        '@ConfigurationPropertiesScan or @EnableConfigurationProperties registers binding beans.',
        'Relaxed binding: app.max-retries = app.maxRetries = APP_MAX_RETRIES env.',
        '@Validated + JSR-303 on properties class for startup validation.',
        'Spring Cloud Config / Kubernetes secrets add higher-precedence sources.',
      ],
    },
    {
      type: 'table',
      headers: ['Source', 'Precedence (high→low)', 'Example'],
      rows: [
        ['Command line', 'Highest', '--server.port=9090'],
        ['SPRING_APPLICATION_JSON', 'High', 'Inline JSON env'],
        ['OS environment', 'High', 'DATABASE_URL'],
        ['application-{profile}.yml', 'Medium', 'application-prod.yml'],
        ['application.yml', 'Lower', 'Defaults'],
        ['@PropertySource', 'Custom', 'classpath:extra.properties'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  CLI[Command line args] --> Merge[Environment merge]
  Env[OS env vars] --> Merge
  Yml[application.yml] --> Merge
  Merge --> Bind[@ConfigurationProperties bind]
  Bind --> Beans[App beans use config]`,
    caption: 'Later/higher-precedence sources override earlier',
  },
  example: [
    {
      type: 'code',
      language: 'yaml',
      caption: 'application.yml',
      code: `app:
  name: orders-service
  pagination:
    default-size: 20
    max-size: 100
spring:
  datasource:
    url: \${DATABASE_URL:jdbc:postgresql://localhost/orders}
    hikari:
      maximum-pool-size: \${DB_POOL_SIZE:10}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Type-safe @ConfigurationProperties',
      code: `@ConfigurationProperties(prefix = "app.pagination")
@Validated
public record PaginationProperties(
    @Min(1) @Max(100) int defaultSize,
    @Min(1) @Max(500) int maxSize
) {}

@Configuration
@EnableConfigurationProperties(PaginationProperties.class)
public class AppConfig { }

@Service
public class UserController {
  private final PaginationProperties pagination;

  public UserController(PaginationProperties pagination) {
    this.pagination = pagination;
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: '@Value for single keys (sparingly)',
      code: `@Service
public class FeatureService {
  public FeatureService(@Value("\${app.feature.enabled:false}") boolean enabled) {
    this.enabled = enabled;
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Binder API (Spring Boot 2+) binds properties with conversion (Duration, DataSize enums).',
        'ConfigurationPropertiesBindingPostProcessor binds after bean creation.',
        '@ConfigurationProperties ignoreUnknownFields default true — typos silently ignored (set false in dev).',
        'Secrets in env: Kubernetes secret → env var → property without file on disk.',
        'Actuator /env and /configprops expose bound values (secure endpoints in prod).',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Type-safe grouped configuration',
      'Environment-specific without code change',
      'Validation at startup',
    ],
    disadvantages: [
      '@Value scattered strings harder to test and document',
      'Relaxed binding typos with ignoreUnknownFields',
      'Large flat property files become unwieldy',
    ],
    alternatives: [
      '@Value for one-off injection',
      'Spring Cloud Config server for central management',
      'Vault / AWS Parameter Store integrations',
    ],
    whenToUse: [
      'Grouped related settings → @ConfigurationProperties',
      'Secrets and URLs from environment',
    ],
    whenNotToUse: [
      'Business logic constants — belong in code',
      'Highly dynamic per-request config — use database/feature service',
    ],
  },
  failureModes: [
    'Typo in property key — silent default used (ignoreUnknownFields=true).',
    'Missing required property without default — startup failure or null.',
    'Wrong type binding — Duration format invalid.',
    'Committing secrets in application.yml to git.',
    '@ConfigurationProperties class not registered — empty/default values.',
  ],
  production: {
    security: [
      'Secrets only via env/K8s secrets/Vault — never in repo',
      'Restrict actuator /env exposure',
    ],
    reliability: ['Use defaults with ${VAR:default} for local dev only'],
    maintainability: ['Document required env vars in README / deployment chart'],
  },
  interview: {
    expectations: [
      'Property source precedence order',
      '@ConfigurationProperties vs @Value',
      'Relaxed binding and env var mapping',
    ],
    commonQuestions: [
      'How does Spring Boot read configuration?',
      'DATABASE_URL to spring.datasource.url mapping?',
      'Validate properties at startup?',
    ],
    followUps: [
      'Spring Cloud Config vs local yml?',
      'How bind List/Map in properties?',
    ],
    misconceptions: [
      'application.properties overrides env vars',
      '@Value and @ConfigurationProperties are interchangeable always',
      'YAML profiles replace base file entirely (they merge)',
    ],
    traps: ['Storing production DB password in application-prod.yml in git'],
    strongSignals: [
      'Uses @ConfigurationProperties records with @Validated',
      'Knows env var relaxed binding rules',
      'Mentions ${VAR:default} pattern',
    ],
  },
  keyTakeaways: [
    'Externalize config — yml + env + CLI precedence.',
    '@ConfigurationProperties for grouped type-safe config.',
    'Relaxed binding: kebab-case ↔ camelCase ↔ ENV_SNAKE.',
    'Validate at startup with @Validated.',
    'Never commit secrets; use env vars.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Where put default server port?',
      answerHint: 'server.port in application.yml or SERVER_PORT env.',
    },
    {
      level: 'intermediate',
      question: '@ConfigurationProperties vs @Value?',
      answerHint: 'Properties class for grouped validated config; @Value for single keys.',
    },
    {
      level: 'advanced',
      question: 'Property source order in Boot?',
      answerHint: 'CLI > env > profile-specific yml > application.yml > defaults.',
    },
  ],
  flashcards: [
    { front: 'Relaxed binding example', back: 'app.max-size = app.maxSize = APP_MAX_SIZE' },
    { front: 'Enable properties class', back: '@EnableConfigurationProperties or @ConfigurationPropertiesScan' },
    { front: 'Placeholder syntax', back: '${property.name:defaultValue}' },
  ],
  quickRevision: [
    'application.yml + profiles',
    '@ConfigurationProperties prefix',
    'Env overrides file',
    '@Validated startup checks',
    'No secrets in git',
    '${VAR:default}',
    'ignoreUnknownFields trap',
  ],
}

export const content = propertiesContent
