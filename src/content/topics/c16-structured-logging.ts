import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Structured logging emits logs as machine-parseable records (JSON) with stable fields: timestamp, level, message, service, traceId, userId, error stack. Contrast with printf strings — enables log aggregation, search, metrics extraction, and correlation with traces.',
  whyExists:
    'Unstructured logs require regex hell to query at scale. JSON logs ingest into ELK, CloudWatch Logs Insights, Loki with field filters. Same schema across services enables cross-service incident queries and EMF metric extraction.',
  mentalModel:
    'Log line is a row in a database table. Columns are fields; free-text message is one column. Query WHERE level=ERROR AND service=checkout AND traceId=X.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Standard fields: @timestamp, level, logger, message, trace_id, span_id, correlation_id.',
        'Logback LogstashEncoder or Log4j2 JsonTemplateLayout for JSON.',
        'Never log passwords, tokens, full PAN — redact PII.',
        'One event per line (newline delimited JSON) for shippers.',
        'Map exceptions to structured error.type, error.message, stack_trace.',
      ],
    },
    {
      type: 'code',
      language: 'json',
      caption: 'Example structured log record',
      code: `{
  "timestamp": "2026-08-17T10:15:30.123Z",
  "level": "ERROR",
  "service": "checkout-api",
  "traceId": "abc123",
  "message": "Payment declined",
  "orderId": "ord-99",
  "error.type": "PaymentException",
  "duration_ms": 245
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Incident: filter CloudWatch Logs Insights level=ERROR AND traceId=abc123 returns checkout + payment + fraud logs in one query — same traceId injected from incoming X-Request-Id header.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'MDC (Mapped Diagnostic Context) stores traceId per thread in SLF4J.',
        'Async appenders batch writes — watch flush on crash.',
        'Sampling debug logs in prod — volume/cost control.',
        'Embedded Metric Format embeds metrics inside log JSON for CloudWatch.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Queryable fields', 'Trace correlation', 'Automated parsing', 'Metrics from logs'],
    disadvantages: ['Larger bytes than plain text', 'Schema drift across teams', 'PII leakage if careless'],
    alternatives: ['Unstructured + grok parsers — fragile', 'Traces only — miss business context'],
    whenToUse: ['All production microservices', 'Centralized log aggregation'],
    whenNotToUse: ['Local dev optional pretty console pattern'],
  },
  failureModes: [
    'Logging secrets and PII — compliance breach',
    'Dynamic field names — cannot index',
    'Huge stack traces flood storage',
    'Missing correlation ID — cannot tie requests',
    'Log level DEBUG in prod — cost explosion',
  ],
  production: {
    observability: ['Standard schema across services', 'Logs Insights saved queries'],
    security: ['PII redaction filter', 'Retention policy per log class'],
    cost: ['INFO default prod; sample debug', 'Exclude health check access logs'],
    maintainability: ['Document required fields in platform guide'],
  },
  interview: {
    expectations: ['JSON vs plain logs', 'MDC traceId', 'PII never logged'],
    commonQuestions: ['Structured logging benefits?', 'Correlate logs across services?'],
    followUps: ['MDC in async threads?', 'Log vs metric for errors?'],
    misconceptions: ['More text in message field replaces structure', 'Logs free at scale'],
    traps: ['log full credit card for debugging'],
    strongSignals: ['JSON encoder config', 'traceId in MDC', 'Redaction policy'],
  },
  keyTakeaways: [
    'JSON logs with stable field names — machine queryable.',
    'Include traceId/correlationId on every log line.',
    'Never log secrets or raw PII.',
    'MDC propagates context in SLF4J.',
    'One JSON object per line for shippers.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Structured vs unstructured logs?', answerHint: 'Structured: fixed fields JSON; queryable. Unstructured: free text needs regex.' },
    { level: 'intermediate', question: 'Pass traceId to all log lines?', answerHint: 'MDC put at request entry; Logback pattern includes %X{traceId}.' },
    { level: 'advanced', question: 'MDC lost in @Async?', answerHint: 'Copy MDC to child thread via TaskDecorator or reactive context propagation.' },
  ],
  flashcards: [
    { front: 'MDC', back: 'Thread-local map for log context like traceId' },
    { front: 'NDJSON', back: 'Newline-delimited JSON — one log event per line' },
    { front: 'LogstashEncoder', back: 'Logback JSON structured output encoder' },
  ],
  quickRevision: [
    'JSON stable fields',
    'traceId in MDC',
    'No secrets PII',
    'One line per event',
    'Level INFO prod',
  ],
}
