import type { TopicContent } from '@/domain/types'

export const profilesContent: TopicContent = {
  whatIsIt:
    'Spring Profiles activate environment-specific bean definitions and configuration — beans annotated @Profile("dev") register only when that profile is active. Set via spring.profiles.active (property, env var, CLI) or programmatically.',
  whyExists:
    'Dev needs H2 and debug logging; prod needs PostgreSQL and real SMTP. Profiles avoid if/else in code and duplicate JARs — one artifact, different behavior controlled by activation at deploy time.',
  mentalModel:
    'Profiles are labels on beans and @Configuration classes. At context refresh, Spring evaluates which profiles are active and skips beans whose @Profile expression is false. Default profile applies when none specified. Expressions: dev, !prod, dev | staging, dev & cloud.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Define beans with @Profile("name") on class or @Bean method.',
        'Activate: spring.profiles.active=dev,local or SPRING_PROFILES_ACTIVE env.',
        'Multiple profiles active simultaneously — union of matching beans.',
        '@Profile on @Configuration imports whole config module conditionally.',
        'spring.profiles.default sets fallback when none active (Spring Boot).',
      ],
    },
    {
      type: 'table',
      headers: ['Mechanism', 'Example', 'Use'],
      rows: [
        ['Property file', 'application-dev.yml', 'Profile-specific properties'],
        ['@Profile on bean', '@Profile("prod")', 'Conditional bean registration'],
        ['@ActiveProfiles test', '@ActiveProfiles("test")', 'Integration test context'],
        ['Group (Boot 2.4+)', 'spring.profiles.group.local', 'Activate bundle of profiles'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Env[SPRING_PROFILES_ACTIVE=prod] --> Ctx[Context refresh]
  Ctx --> Eval{Evaluate @Profile}
  Eval -->|match| Register[Register bean]
  Eval -->|no match| Skip[Skip bean definition]`,
    caption: 'Inactive profile beans never enter the container',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Profile-specific implementations',
      code: `@Service
@Profile("prod")
public class SmtpEmailSender implements EmailSender {
  // real SMTP
}

@Service
@Profile("!prod")
public class LoggingEmailSender implements EmailSender {
  private static final Logger log = LoggerFactory.getLogger(...);
  @Override public void send(String to, String body) {
    log.info("Would send to {}: {}", to, body);
  }
}`,
    },
    {
      type: 'code',
      language: 'yaml',
      caption: 'application-dev.yml vs application-prod.yml',
      code: `# application-dev.yml
spring:
  datasource:
    url: jdbc:h2:mem:devdb
logging:
  level:
    com.example: DEBUG

# application-prod.yml
spring:
  datasource:
    url: \${DATABASE_URL}
logging:
  level:
    root: WARN`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Test with @ActiveProfiles',
      code: `@SpringBootTest
@ActiveProfiles("test")
class OrderServiceIT {
  @Autowired EmailSender emailSender;
  // gets test stub, not prod SMTP
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Environment accepts active profiles; ProfileCondition evaluates @Profile metadata.',
        'Negation !prod, OR |, AND & supported in profile expressions.',
        'DefaultProfileUtil / spring.profiles.default for unnamed fallback.',
        'Profile-specific property files: application-{profile}.properties/yml merged by PropertySource order.',
        'spring.config.activate.on-profile in YAML (Boot 2.4+) replaces legacy document separators.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Single deployable artifact across environments',
      'Clear separation of env-specific beans',
      'Test profiles isolate integration tests',
    ],
    disadvantages: [
      'Profile explosion if overused for feature flags',
      'Easy to forget activating prod profile in deployment',
      'Implicit behavior — hard to see all active beans without actuator/env',
    ],
    alternatives: [
      'Externalized config only (same beans, different properties)',
      '@ConditionalOnProperty for feature toggles',
      'Separate modules or Spring Cloud Config',
    ],
    whenToUse: [
      'Different infrastructure beans per environment (DB, cache, email)',
      'Dev-only controllers or debug tooling',
    ],
    whenNotToUse: [
      'Feature flags for A/B — use config service or toggles',
      'Secrets — use env/vault, not profile-named files in repo',
    ],
  },
  failureModes: [
    'No profile active → missing bean (e.g. no EmailSender if all are profile-scoped).',
    'Both prod and dev beans active accidentally — NoUniqueBeanDefinitionException.',
    'application-prod.yml not loaded — typo in profile name.',
    'Committing secrets in application-prod.yml to git.',
    '@Profile on @SpringBootApplication main class limits entire app incorrectly.',
  ],
  production: {
    reliability: [
      'Set SPRING_PROFILES_ACTIVE explicitly in prod deployment manifest',
      'Smoke test with prod profile in CI staging',
    ],
    security: ['Never commit prod credentials; use env vars and secret managers'],
    observability: ['Log active profiles at startup (Boot logs them by default)'],
  },
  interview: {
    expectations: [
      'Activate profiles via spring.profiles.active',
      '@Profile on beans and property files naming',
      'Test with @ActiveProfiles',
    ],
    commonQuestions: [
      'How do Spring profiles work?',
      'application-dev.yml loading?',
      'Profile vs @ConditionalOnProperty?',
    ],
    followUps: [
      'Profile groups in Boot 2.4+?',
      'What if no bean matches active profile?',
    ],
    misconceptions: [
      'Profiles replace all external configuration',
      'Only one profile can be active',
      'Profiles are compile-time separation',
    ],
    traps: ['Hardcoding prod profile in application.properties committed to repo'],
    strongSignals: [
      'Mentions SPRING_PROFILES_ACTIVE and profile-specific YAML',
      'Uses @Profile("!prod") for dev defaults',
      'Warns about secret management',
    ],
  },
  keyTakeaways: [
    'Profiles = conditional bean registration by environment label.',
    'spring.profiles.active activates; application-{profile}.yml loads.',
    'One JAR, many environments — configure at deploy.',
    '@ActiveProfiles for tests.',
    'Do not store prod secrets in profile files in git.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'How activate a profile?',
      answerHint: 'spring.profiles.active property, env SPRING_PROFILES_ACTIVE, or CLI --spring.profiles.active.',
    },
    {
      level: 'intermediate',
      question: '@Profile("!prod") meaning?',
      answerHint: 'Bean registers when prod profile is NOT active.',
    },
    {
      level: 'advanced',
      question: 'Profile vs @ConditionalOnProperty?',
      answerHint: 'Profile = env bundle; ConditionalOnProperty = single property guard, finer feature flags.',
    },
  ],
  flashcards: [
    { front: 'Activate profiles', back: 'spring.profiles.active or SPRING_PROFILES_ACTIVE' },
    { front: 'Profile property file', back: 'application-{profile}.yml' },
    { front: '@ActiveProfiles', back: 'Sets profiles for test/application context' },
  ],
  quickRevision: [
    '@Profile on bean/config',
    'spring.profiles.active',
    'application-dev.yml pattern',
    'Multiple profiles OK',
    '!prod negation',
    '@ActiveProfiles in tests',
    'Secrets via env not YAML in git',
  ],
}

export const content = profilesContent
