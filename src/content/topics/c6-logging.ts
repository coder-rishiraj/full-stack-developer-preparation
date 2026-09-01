import type { TopicContent } from '@/domain/types'

export const loggingContent: TopicContent = {
  whatIsIt:
    'Spring Boot logging uses SLF4J as facade with Logback default — configured via application.yml (logging.level.*), logback-spring.xml for appenders, and structured logging (JSON) for production aggregation in ELK/Datadog.',
  whyExists:
    'Production debugging requires correlated, leveled logs without System.out.println. SLF4J abstracts implementation; Boot sets sensible defaults; MDC attaches requestId/userId to every line in a request.',
  mentalModel:
    'Logger per class (LoggerFactory.getLogger). Levels ERROR > WARN > INFO > DEBUG > TRACE. Root logger + package overrides. Appenders write console/file/JSON. MDC map copied per thread (requestId in filter). Never log secrets or full PII.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'private static final Logger log = LoggerFactory.getLogger(MyClass.class).',
        'application.yml: logging.level.com.example=DEBUG, logging.level.org.hibernate.SQL=WARN.',
        'logback-spring.xml: console + rolling file + JSON encoder (logstash-logback-encoder).',
        'MDC.put/remove in filter/interceptor for correlation.',
        'Spring Boot Actuator loggers endpoint for runtime level change (secure in prod).',
      ],
    },
    {
      type: 'table',
      headers: ['Level', 'Use', 'Production default'],
      rows: [
        ['ERROR', 'Failures needing attention', 'Always on'],
        ['WARN', 'Recoverable issues', 'On'],
        ['INFO', 'Business events, startup', 'On (selective)'],
        ['DEBUG', 'Diagnostic detail', 'Off except troubleshooting'],
        ['TRACE', 'Very verbose', 'Rarely'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  App[Application code] --> SLF4J[SLF4J API]
  SLF4J --> Logback[Logback impl]
  Logback --> Console[Console appender]
  Logback --> File[Rolling file]
  File --> Agg[Log aggregator]`,
    caption: 'SLF4J facade → Logback appenders',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Structured logging with placeholders',
      code: `@Service
public class PaymentService {
  private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

  public PaymentResult charge(Order order) {
    log.info("Processing payment orderId={} amount={}", order.getId(), order.getAmount());
    try {
      var result = gateway.charge(order);
      log.info("Payment succeeded orderId={} txnId={}", order.getId(), result.txnId());
      return result;
    } catch (PaymentException ex) {
      log.warn("Payment failed orderId={} reason={}", order.getId(), ex.getMessage());
      throw ex;
    }
  }
}`,
    },
    {
      type: 'code',
      language: 'yaml',
      caption: 'application.yml logging levels',
      code: `logging:
  level:
    root: INFO
    com.example.orders: DEBUG
    org.springframework.web: WARN
    org.hibernate.SQL: DEBUG
  pattern:
    console: "%d{ISO8601} [%thread] %-5level %logger{36} [%X{requestId}] - %msg%n"`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'MDC in filter (ties to filters topic)',
      code: `MDC.put("requestId", requestId);
MDC.put("userId", authenticatedUserId);
try {
  chain.doFilter(req, res);
} finally {
  MDC.clear();
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'LoggingApplicationListener sets LOG_LEVEL_PATTERN and file path early in Boot startup.',
        'logback-spring.xml supports <springProfile> for env-specific appenders.',
        'Parameterized logging avoids string concat if level disabled — log.debug("x={}", expensive()).',
        'AsyncAppender wraps file appender — lower latency, possible loss on crash.',
        'Micrometer tracing bridges traceId into MDC (Brave/OpenTelemetry).',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Standard SLF4J — swap Logback if needed',
      'Package-level tuning without recompile',
      'MDC correlation across async with TaskDecorator',
    ],
    disadvantages: [
      'DEBUG SQL logs leak schema and PII in prod',
      'Verbose logging I/O cost',
    ],
    alternatives: [
      'Structured metrics over logs for counts',
      'Distributed tracing for request flow',
    ],
    whenToUse: [
      'ERROR/WARN/INFO for ops and audit',
      'DEBUG temporarily during incident',
    ],
    whenNotToUse: [
      'High-cardinality debug in hot loop',
      'Logging passwords, tokens, full credit cards',
    ],
  },
  failureModes: [
    'String concat in log.debug("id=" + id) — evaluates even when DEBUG off.',
    'Logging entire request body with password field.',
    'Missing MDC.clear() — wrong requestId on thread.',
    'logback.xml vs logback-spring.xml — latter needed for springProfile.',
    'Disk full from unbounded file appender without rotation.',
  ],
  production: {
    observability: ['JSON logs with timestamp, level, logger, MDC fields'],
    security: ['Redact sensitive fields; sample DEBUG not enable globally'],
    performance: ['AsyncAppender; avoid logging in tight loops at INFO'],
  },
  interview: {
    expectations: [
      'SLF4J vs Logback vs Log4j2',
      'Log levels and configuration in Boot',
      'MDC for correlation',
    ],
    commonQuestions: [
      'Configure log levels in Spring Boot?',
      'Why parameterized logging?',
      'MDC purpose?',
    ],
    followUps: [
      'Structured JSON logging setup?',
      'TraceId in logs with Micrometer?',
    ],
    misconceptions: [
      'System.out acceptable in Spring apps',
      'logging.level.root=DEBUG fine in prod always',
    ],
    traps: ['Logging sensitive data for debugging'],
    strongSignals: [
      'Parameterized {} placeholders',
      'MDC requestId + finally clear',
      'Package-specific levels',
    ],
  },
  keyTakeaways: [
    'SLF4J API + Logback default in Boot.',
    'logging.level.package in yml.',
    'Parameterized logging — no string concat.',
    'MDC for requestId; clear in finally.',
    'Never log secrets; JSON in prod.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Default logging implementation in Boot?',
      answerHint: 'Logback via spring-boot-starter-logging.',
    },
    {
      level: 'intermediate',
      question: 'MDC use case?',
      answerHint: 'Thread-local map — attach requestId/userId to all log lines in request.',
    },
    {
      level: 'advanced',
      question: 'Async logging tradeoff?',
      answerHint: 'Lower app thread latency; possible log loss on JVM kill before flush.',
    },
  ],
  flashcards: [
    { front: 'Boot logging facade', back: 'SLF4J' },
    { front: 'Set package DEBUG', back: 'logging.level.com.example=DEBUG' },
    { front: 'Parameterized log', back: 'log.info("id={}", id) — no concat' },
  ],
  quickRevision: [
    'SLF4J + Logback',
    'logging.level.* yml',
    'logback-spring.xml',
    'MDC correlation',
    'No secrets in logs',
    'Parameterized messages',
    'JSON for aggregation',
  ],
}

export const content = loggingContent
