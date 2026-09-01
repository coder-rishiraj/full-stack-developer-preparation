import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'OpenTelemetry (OTel) is vendor-neutral standard for traces, metrics, and logs: SDKs, auto-instrumentation, OTLP export protocol, and semantic conventions. One instrumentation feeds Jaeger, Prometheus, Datadog, CloudWatch via collectors.',
  whyExists:
    'Proprietary agents lock you in and duplicate instrumentation. OTel CNCF project unifies APIs — instrument once, switch backends. Spring Boot 3 Micrometer Tracing bridges to OTel SDK.',
  mentalModel:
    'USB-C for observability. App speaks OTel; collector adapter plugs into any backend. Signals: traces (spans), metrics (instruments), logs (bridged from logging appender).',
  howItWorks: [
    {
      type: 'table',
      headers: ['Component', 'Role'],
      rows: [
        ['OTel SDK', 'In-process API — create spans, metrics'],
        ['Auto-instrumentation', 'Java agent instruments JDBC, HTTP, Kafka'],
        ['OTLP', 'gRPC/HTTP protocol exporting to collector'],
        ['Collector', 'Receive, process, export to multiple backends'],
        ['Semantic conventions', 'Standard attribute names http.method, db.system'],
      ],
    },
    {
      type: 'list',
      items: [
        'Spring: micrometer-tracing-bridge-otel + opentelemetry-exporter-otlp.',
        'Resource attributes: service.name, deployment.environment.',
        'Collector processors: batch, filter PII, tail sampling.',
        'Logs bridge: append trace_id to log records for correlation.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'yaml',
      caption: 'Spring Boot OTel export',
      code: `management:
  tracing:
    sampling:
      probability: 0.1
  otlp:
    tracing:
      endpoint: http://otel-collector:4318/v1/traces
otel:
  resource:
    attributes:
      service.name: checkout-api`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Context propagation W3C tracecontext + baggage.',
        'Metric SDK exponential histograms for better percentiles.',
        'Java agent bytecode instrumentation vs library manual spans.',
        'Collector contrib receivers: Prometheus scrape, Jaeger, Zipkin.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Vendor neutral', 'Unified signals', 'Rich ecosystem', 'CNCF standard'],
    disadvantages: ['Collector ops overhead', 'Semantic convention adoption still evolving', 'Dual export during migration'],
    alternatives: ['Datadog agent only', 'AWS X-Ray SDK direct', 'Prometheus client without OTel'],
    whenToUse: ['New microservices platform standard', 'Multi-backend or migration'],
    whenNotToUse: ['Tiny app — Actuator metrics enough initially'],
  },
  failureModes: [
    'Collector SPOF — buffer loss on outage',
    'Wrong service.name — merged unrelated apps in UI',
    'Agent + manual double spans',
    'Export blocking app thread — use batch processor',
    'Missing resource attributes in K8s — cannot filter by pod',
  ],
  production: {
    observability: ['Central collector HA', 'Tail sampling processor', 'Standard service.name convention'],
    reliability: ['Batch export with timeout', 'Fallback logging if collector down'],
    cost: ['Sampling + attribute limits', 'Collector right-sizing'],
    maintainability: ['Platform-provided starter dependency', 'Version alignment SDK/collector'],
  },
  interview: {
    expectations: ['OTel three signals', 'OTLP collector role', 'Spring Boot integration'],
    commonQuestions: ['What is OpenTelemetry?', 'OTel vs Prometheus/Jaeger?'],
    followUps: ['Collector pipeline?', 'Auto vs manual instrumentation?'],
    misconceptions: ['OTel is a backend/storage', 'Must run collector on every pod'],
    traps: ['100% export no sampling'],
    strongSignals: ['Vendor-neutral story', 'Collector fan-out', 'Semantic conventions'],
  },
  keyTakeaways: [
    'OTel: open standard for traces, metrics, logs.',
    'Instrument once; export via OTLP to collector → any backend.',
    'Spring Boot 3 Micrometer Tracing uses OTel bridge.',
    'Semantic conventions standardize attribute names.',
    'Collector processes, samples, routes telemetry.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What problem does OTel solve?', answerHint: 'Vendor lock-in; unified API for traces/metrics/logs.' },
    { level: 'intermediate', question: 'Role of OTel collector?', answerHint: 'Receive OTLP, process/sample/filter, export to Jaeger/Prometheus/etc.' },
    { level: 'advanced', question: 'Auto-instrumentation vs manual spans?', answerHint: 'Agent covers standard libs fast; manual for business operations and custom attributes.' },
  ],
  flashcards: [
    { front: 'OTLP', back: 'OpenTelemetry Protocol — export traces/metrics/logs' },
    { front: 'Semantic conventions', back: 'Standard names for span/metric attributes' },
    { front: 'OTel Collector', back: 'Vendor-agnostic telemetry pipeline component' },
  ],
  quickRevision: [
    'Traces metrics logs',
    'OTLP export',
    'Collector pipeline',
    'Spring Micrometer bridge',
    'Semantic conventions',
  ],
}
