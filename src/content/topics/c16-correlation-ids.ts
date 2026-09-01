import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A correlation ID (request ID, trace ID) is a unique identifier propagated across services for one logical request. Passed via HTTP header (X-Request-Id, traceparent), logging MDC, and message metadata — ties logs, metrics, and traces to one user action.',
  whyExists:
    'Microservices scatter one checkout across five services. Without correlation ID you grep blindly. With shared ID you filter all logs for order failure, follow causality, and support asks "what happened to request X?"',
  mentalModel:
    'Package tracking number. Customer order gets TRACK-123 at edge; every warehouse scan logs TRACK-123; support searches one number sees full journey.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Gateway generates ID if client did not send X-Request-Id.',
        'Filter/interceptor puts ID in MDC; RestTemplate/WebClient adds header outbound.',
        'Return ID in response header for client support tickets.',
        'W3C traceparent links to distributed tracing trace ID.',
        'Kafka messages carry correlation_id header for async flows.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Correlation ID propagation',
      diagram: `sequenceDiagram
  participant Client
  participant Gateway
  participant Order
  participant Payment
  Client->>Gateway: X-Request-Id: abc
  Gateway->>Order: X-Request-Id: abc
  Order->>Payment: X-Request-Id: abc
  Note over Order,Payment: All logs include abc`,
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Spring filter sets MDC and forwards header',
      code: `@Component
class CorrelationIdFilter extends OncePerRequestFilter {
  static final String HEADER = "X-Request-Id";

  @Override
  protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
      throws ServletException, IOException {
    String id = Optional.ofNullable(req.getHeader(HEADER))
        .filter(s -> !s.isBlank())
        .orElse(UUID.randomUUID().toString());
    MDC.put("correlationId", id);
    res.setHeader(HEADER, id);
    try { chain.doFilter(req, res); } finally { MDC.clear(); }
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'OpenTelemetry trace_id spans correlation superset.',
        'Reactive WebFlux: Reactor Context not thread MDC — use hooks.',
        'Thread pool workers need MDC copy on submit.',
        'Batch jobs inherit parent request ID or new job ID.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Fast incident triage', 'Support debugging', 'Links logs and traces'],
    disadvantages: ['Propagation bugs lose chain', 'Header trust — validate format length', 'Async context complexity'],
    alternatives: ['Trace ID only via OTel', 'Session ID — coarser grain'],
    whenToUse: ['Every microservice HTTP and messaging', 'Public API support'],
    whenNotToUse: ['Internal batch with no user request — use job ID instead'],
  },
  failureModes: [
    'New UUID per internal hop — broken chain',
    'MDC leak between requests on pooled thread',
    'Missing on async/message path',
    'Client-supplied ID injection — sanitize length/chars',
    'Not returned to client — support cannot help',
  ],
  production: {
    observability: ['Mandatory header in platform ingress', 'Log pattern includes correlationId'],
    reliability: ['RestTemplate interceptor auto-forward', 'Message headers on publish'],
    security: ['Validate ID format; no PII in ID'],
    maintainability: ['Shared library for propagation', 'Document header name standard'],
  },
  interview: {
    expectations: ['Generate at edge', 'MDC logging', 'Forward on outbound calls'],
    commonQuestions: ['Debug request across microservices?', 'Correlation vs trace ID?'],
    followUps: ['Async MDC propagation?', 'Kafka correlation?'],
    misconceptions: ['Each service generates new ID', 'Only needed in logs not headers'],
    traps: ['Forget MDC.clear() — wrong ID on next request'],
    strongSignals: ['Gateway generates/forwards', 'Filter + MDC + client interceptor', 'Response header echo'],
  },
  keyTakeaways: [
    'One ID per logical request from edge through all services.',
    'X-Request-Id header + MDC in logs.',
    'Generate if missing; forward on every outbound call.',
    'Return to client for support correlation.',
    'Clear MDC after request; copy to async threads.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Purpose of correlation ID?', answerHint: 'Tie all logs/events for one request across services.' },
    { level: 'intermediate', question: 'Where generate ID?', answerHint: 'API gateway or first service if client omitted; forward downstream.' },
    { level: 'advanced', question: 'Correlation ID vs distributed trace?', answerHint: 'Correlation often one ID per request; trace has trace_id + span tree for timing.' },
  ],
  flashcards: [
    { front: 'X-Request-Id', back: 'Common HTTP header carrying correlation ID' },
    { front: 'MDC.clear()', back: 'Remove thread log context after request to prevent leak' },
    { front: 'traceparent', back: 'W3C header linking HTTP to trace context' },
  ],
  quickRevision: [
    'One ID per request',
    'Edge generates',
    'MDC + header forward',
    'Echo to client',
    'Clear MDC after',
  ],
}
