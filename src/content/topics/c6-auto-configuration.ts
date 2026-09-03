import type { TopicContent } from '@/domain/types'

export const autoConfigurationContent: TopicContent = {
  whatIsIt:
    'Spring Boot auto-configuration conditionally registers beans based on classpath, existing beans, and properties — enabled by @EnableAutoConfiguration (included in @SpringBootApplication). Starters bundle dependencies + auto-config classes listed in META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports.',
  whyExists:
    'Manual @Bean DataSource, Jackson, Tomcat for every project is repetitive and error-prone. Auto-config applies sensible defaults, backs off when you define your own bean (@ConditionalOnMissingBean), and activates features only when relevant libraries are present.',
  mentalModel:
    'On startup Boot reads auto-config import files, evaluates @Conditional* annotations (OnClass, OnProperty, OnBean, OnWebApplication), and registers matching @Configuration classes. Your explicit @Bean wins over auto-config defaults. Think "convention with escape hatches."',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Boot 3+ discovers auto-configuration class names from META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports; spring.factories is Boot 2 migration knowledge, not the modern registration path.',
        'AutoConfigurationImportSelector loads candidates; AutoConfigurationSorter orders them (e.g. DataSource before JdbcTemplate).',
        'Each @AutoConfiguration class has @Conditional* — skip if condition false.',
        'Properties from application.yml bind via @EnableConfigurationProperties.',
        'spring.autoconfigure.exclude disables specific auto-config classes.',
      ],
    },
    {
      type: 'table',
      headers: ['Condition', 'Checks', 'Example'],
      rows: [
        ['@ConditionalOnClass', 'Class on classpath', 'JdbcTemplate if spring-jdbc present'],
        ['@ConditionalOnMissingBean', 'No user bean of type', 'Default ObjectMapper'],
        ['@ConditionalOnProperty', 'Property value', 'spring.cache.type=redis'],
        ['@ConditionalOnWebApplication', 'Servlet vs reactive', 'DispatcherServlet auto-config'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Start[Application start] --> Load[Load AutoConfiguration.imports]
  Load --> Cond{Evaluate @Conditional}
  Cond -->|pass| Reg[Register beans]
  Cond -->|fail| Skip[Skip config]
  User[@Bean user DataSource] --> Override[Auto-config backs off]`,
    caption: 'Conditional registration with user override',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Custom auto-config sketch',
      code: `@AutoConfiguration
@ConditionalOnClass(MetricsExporter.class)
@EnableConfigurationProperties(MetricsProperties.class)
public class MetricsAutoConfiguration {

  @Bean
  @ConditionalOnMissingBean
  public MetricsExporter metricsExporter(MetricsProperties props) {
    return new MetricsExporter(props.getEndpoint());
  }
}`,
    },
    {
      type: 'code',
      language: 'yaml',
      caption: 'Exclude unwanted auto-config',
      code: `spring:
  autoconfigure:
    exclude:
      - org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'User bean overrides default',
      code: `@Configuration
public class JacksonConfig {
  @Bean
  @Primary
  public ObjectMapper objectMapper() {
    return JsonMapper.builder()
        .serializationInclusion(JsonInclude.Include.NON_NULL)
        .build();
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'AutoConfigurationReport logs positive/negative matches (debug logging).',
        'DeferredImportSelector — auto-config processed after user @Configuration.',
        '@AutoConfigureBefore / @AutoConfigureAfter control ordering between auto-configs.',
        'spring-boot-autoconfigure module contains ~100+ configuration classes.',
        'Native image: reachability metadata for conditional classes in AOT processing.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Fast project bootstrap with working defaults',
      'Starters encode tested dependency sets',
      'Conditional activation avoids unused beans',
    ],
    disadvantages: [
      'Magic until you read conditions — debugging "why no bean?"',
      'Version skew between starters breaks silently',
      'Over-exclusion fights framework',
    ],
    alternatives: [
      'Plain Spring Framework manual @Configuration',
      'Micronaut/Quarkus compile-time DI (no runtime auto-config scan)',
    ],
    whenToUse: [
      'Every Spring Boot application',
      'Custom starters for internal platform libraries',
    ],
    whenNotToUse: [
      'When you need full control — exclude and wire manually',
    ],
  },
  failureModes: [
    'Missing starter — feature silently absent (no DataSource without jdbc starter).',
    'Two auto-configs create duplicate beans — missing @ConditionalOnMissingBean.',
    'Wrong spring.main.web-application-type breaks reactive vs servlet auto-config.',
    'Property typo — condition false, expected bean missing at runtime.',
    'Excluding too much — broken partial context.',
  ],
  production: {
    observability: [
      'Enable debug logging org.springframework.boot.autoconfigure for condition report',
      'Actuator /conditions endpoint (if exposed) shows match results',
    ],
    maintainability: [
      'Document custom @AutoConfiguration in internal starters',
      'Pin Boot BOM version across services',
    ],
  },
  interview: {
    expectations: [
      'Explain @ConditionalOnMissingBean override behavior',
      'How starters relate to auto-configuration',
      'Debugging missing bean from failed condition',
    ],
    commonQuestions: [
      'How does Spring Boot auto-configuration work?',
      'How to disable an auto-config?',
      '@ConditionalOnClass purpose?',
    ],
    followUps: [
      'Order of auto-configuration loading?',
      'Write custom starter steps?',
    ],
    misconceptions: [
      'Auto-config always runs regardless of classpath',
      'User @Bean and auto-config bean both register (duplicate)',
      '@SpringBootApplication only enables component scan',
    ],
    traps: ['Cannot explain why custom DataSource disables Boot defaults'],
    strongSignals: [
      'Mentions AutoConfiguration.imports and @ConditionalOn*',
      'Knows @Primary and @ConditionalOnMissingBean interaction',
      'Uses spring.autoconfigure.exclude appropriately',
    ],
  },
  keyTakeaways: [
    'Auto-config = conditional @Configuration from starters.',
    '@ConditionalOnMissingBean — your @Bean wins.',
    'META-INF/spring/AutoConfiguration.imports lists classes.',
    'Exclude via spring.autoconfigure.exclude.',
    'Debug with condition report logging.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What enables auto-configuration?',
      answerHint: '@EnableAutoConfiguration / @SpringBootApplication.',
    },
    {
      level: 'intermediate',
      question: 'How override auto-configured ObjectMapper?',
      answerHint: 'Define own @Bean ObjectMapper; @ConditionalOnMissingBean backs off.',
    },
    {
      level: 'advanced',
      question: 'Steps to create custom starter?',
      answerHint: 'Autoconfigure module + META-INF imports + @AutoConfiguration + properties + starter POM dependency.',
    },
  ],
  flashcards: [
    { front: '@ConditionalOnMissingBean', back: 'Skip auto-config bean if user defined one' },
    { front: 'Auto-config registration file', back: 'META-INF/spring/...AutoConfiguration.imports' },
    { front: 'Disable auto-config', back: 'spring.autoconfigure.exclude' },
  ],
  quickRevision: [
    '@EnableAutoConfiguration in @SpringBootApplication',
    'Starters → auto-config classes',
    '@ConditionalOnClass/Property/Bean',
    'User @Bean overrides',
    'exclude property',
    'Debug condition report',
    '@AutoConfigureBefore/After order',
  ],
}

export const content = autoConfigurationContent
