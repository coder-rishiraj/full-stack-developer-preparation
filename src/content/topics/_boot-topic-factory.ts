import type { TopicContent } from '@/domain/types'

type BootTopicInput = {
  title: string
  sectionTitle: string
  parentTitle?: string
}

const SECTION_FOCUS: Record<string, string> = {
  'Boot Foundations & Project Structure':
    'starters, dependency management, executable packaging, and a maintainable package boundary',
  'SpringApplication & Startup':
    'environment preparation, context creation, startup events, runners, and failure analysis',
  'Auto-configuration & Starters':
    'conditional configuration, back-off rules, imports, diagnostics, and custom starters',
  'Externalized Configuration':
    'property precedence, typed binding, profiles, validation, imports, and secret-safe configuration',
  'Embedded Web Runtime':
    'embedded containers, server customization, request threads, TLS, and graceful runtime behavior',
  'Spring MVC Request Lifecycle':
    'DispatcherServlet routing, argument resolution, conversion, response writing, and async MVC',
  'REST Controllers & HTTP Semantics':
    'request mapping, HTTP semantics, status codes, CORS, multipart data, and OpenAPI',
  'DTOs, JSON & API Boundaries':
    'stable transport contracts, Jackson mapping, records, compatibility, and entity isolation',
  'Validation & Data Binding':
    'Jakarta constraints, conversion, binding errors, groups, and method validation',
  'Exception Handling & Error Contracts':
    'resolver ordering, controller advice, ProblemDetail, stable errors, and safe diagnostics',
  'Filters, Interceptors & Web Hooks':
    'where servlet filters, MVC interceptors, controller advice, and AOP execute',
  'API Versioning & Evolution':
    'version selection, backward compatibility, deprecation, and contract verification',
  'Pagination, Sorting & Collection APIs':
    'bounded collections, stable ordering, Page vs Slice, offset vs keyset, and response metadata',
  'HTTP Clients & Service Integration':
    'RestClient, WebClient, HTTP interfaces, timeouts, error mapping, and client observations',
  'Task Execution & Scheduling':
    'Boot executor/scheduler auto-configuration, proxy boundaries, context propagation, and cluster safety',
  'Logging & Diagnostics':
    'logging configuration, structured events, correlation, startup reports, and runtime levels',
  'Actuator & Application Availability':
    'endpoint exposure, health contributors, probes, metrics bridges, and management security',
  'Spring Boot Testing':
    'plain units, test slices, full contexts, MockitoBean, context caching, and Testcontainers',
  'AOT, Native Images & Runtime Efficiency':
    'AOT-generated metadata, native-image constraints, runtime hints, and startup/build trade-offs',
  'Production Lifecycle & Packaging':
    'graceful shutdown, keep-alive, OCI packaging, layered images, and production-safe defaults',
}

export function createBootTopicContent({
  title,
  sectionTitle,
  parentTitle,
}: BootTopicInput): TopicContent {
  const focus = SECTION_FOCUS[sectionTitle] ?? 'Boot conventions, runtime behavior, and production trade-offs'
  const parent = parentTitle ? ` It is an atomic part of ${parentTitle}.` : ''

  return {
    whatIsIt:
      `${title} is a Spring Boot topic in ${sectionTitle}.${parent} ` +
      'Study the Boot integration and convention, then trace it to the underlying Spring or web mechanism.',
    whyExists:
      `${title} reduces application setup while preserving explicit override points. ` +
      `A strong explanation covers ${focus}.`,
    mentalModel:
      'Boot is an opinionated assembler: dependencies and configuration create conditions; matching ' +
      'auto-configurations contribute beans; user beans can make them back off; Actuator exposes runtime evidence.',
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: [
          `Identify the dependency, property, annotation, or runtime condition that activates ${title}.`,
          'Trace the configured bean or MVC hook and state when it runs.',
          'Name the supported user override and the default back-off behavior.',
          'Verify the result with a focused test, startup report, log, health endpoint, or metric.',
        ],
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Track boundary',
        text:
          'C6 owns Boot startup, configuration, MVC adapters, clients, Actuator, and Boot tests. ' +
          'Spring container/AOP is C5; JPA is C8; Security is C9; reliability and observability depth is C12/C16.',
      },
    ],
    internals: [
      {
        type: 'list',
        items: [
          'SpringApplication prepares the Environment, chooses a context type, refreshes it, and publishes lifecycle events.',
          'Auto-configurations are imported metadata and guarded by @ConditionalOn* checks; user beans commonly trigger back-off.',
          'MVC requests pass through the servlet filter chain into DispatcherServlet, then mappings, adapters, resolvers, converters, and exception resolvers.',
          'Spring Boot 3 uses Jakarta APIs; Boot 4 raises the Java baseline, modularizes starters/auto-configuration, and uses Jackson 3 by default.',
          '@MockitoBean is the modern Framework bean-override annotation; older @MockBean material is migration knowledge.',
        ],
      },
    ],
    failureModes: [
      `Assuming ${title} is magic instead of checking its activation conditions and resulting beans.`,
      'Copying old javax.*, RestTemplate-first, or @MockBean-first examples into a modern Boot application.',
      'Loading a full application context when a plain unit test or focused slice is sufficient.',
      'Exposing Actuator details, configuration values, stack traces, or secrets to untrusted clients.',
    ],
    production: {
      reliability: [
        'Set explicit client, server, shutdown, and task-execution bounds instead of relying on environment-dependent defaults.',
        'Fail startup on invalid typed configuration and make readiness represent dependency availability.',
      ],
      observability: [
        'Use the condition evaluation report and startup failures to diagnose configuration.',
        'Correlate structured logs with HTTP observations, health state, and metrics without logging secrets.',
      ],
      maintainability: [
        'Prefer typed @ConfigurationProperties and narrow adapters over scattered string properties.',
        'Keep business logic independent of controllers, Boot runners, filters, schedulers, and client implementations.',
      ],
    },
    interview: {
      expectations: [
        `Define ${title} in the context of ${sectionTitle}.`,
        'Explain the default, activation condition, override point, and one production failure mode.',
        'Separate Boot convenience from the underlying Spring Framework or servlet behavior.',
      ],
      commonQuestions: [
        `How does ${title} work in Spring Boot?`,
        'What does Boot auto-configure, and how can you override it?',
        'How would you test and diagnose this without loading unnecessary infrastructure?',
      ],
      followUps: [
        'What changes between Boot 3 and Boot 4?',
        'Which concern belongs in another curriculum section?',
      ],
      misconceptions: [
        'Spring Boot replaces the Spring Framework.',
        'Auto-configuration cannot be inspected or overridden.',
      ],
      traps: [
        'Reciting annotations without tracing startup or request flow.',
        'Calling an integration “production ready” without bounds, health behavior, and failure handling.',
      ],
      strongSignals: [
        'Uses conditions, back-off, bean graph, request pipeline, and evidence in the answer.',
        'Names current APIs and clearly labels legacy migration knowledge.',
      ],
    },
    keyTakeaways: [
      `${title} belongs to ${sectionTitle}.`,
      `Focus: ${focus}.`,
      'Activation condition → contributed behavior → user override → runtime evidence.',
    ],
    interviewQuestions: [
      {
        level: 'basic',
        question: `What is ${title}, and which Spring Boot problem does it solve?`,
        answerHint: `Place it in ${sectionTitle} and explain its default convention.`,
      },
      {
        level: 'intermediate',
        question: `How is ${title} activated, overridden, and tested?`,
        answerHint: 'Name the condition/property, resulting bean or hook, back-off point, and focused test.',
      },
      {
        level: 'advanced',
        question: `What production failure mode matters most for ${title}?`,
        answerHint: `Discuss ${focus} with observability and safe fallback behavior.`,
      },
    ],
    flashcards: [
      { front: title, back: `${sectionTitle}: ${focus}.` },
      {
        front: `${title} diagnostic loop`,
        back: 'Condition/property → bean/pipeline → override → test/log/Actuator evidence.',
      },
    ],
    quickRevision: [
      `${title} — ${sectionTitle}`,
      `Focus: ${focus}`,
      'Convention with explicit override',
      'Modern Boot APIs; legacy clearly labeled',
    ],
  }
}
