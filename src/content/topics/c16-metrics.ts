import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Metrics are numeric time-series measurements of system behavior: request rate, error count, latency histograms, CPU, queue depth. RED (Rate, Errors, Duration) for services; USE (Utilization, Saturation, Errors) for resources. Foundation of SLOs and alerting.',
  whyExists:
    'Logs tell stories; metrics show trends and fire alarms cheaply at scale. Aggregating millions of requests into counters and histograms enables dashboards and automated scaling. Without metrics you react to user tweets instead of graphs.',
  mentalModel:
    'Vital signs chart at hospital. Heart rate (RPS), fever (error rate), blood pressure (latency). Watch trends and thresholds — not every heartbeat stored, but rolling aggregates.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Type', 'Example', 'Use'],
      rows: [
        ['Counter', 'http_requests_total', 'Monotonically increasing — rate() gives RPS'],
        ['Gauge', 'jvm_memory_used_bytes', 'Point-in-time value up/down'],
        ['Histogram', 'http_request_duration_seconds', 'Buckets for p50/p99'],
        ['Summary', 'Similar to histogram client-side quantiles', 'Less common in Prometheus'],
      ],
    },
    {
      type: 'list',
      items: [
        'Label dimensions: method, status, route — avoid high cardinality (user_id).',
        'Micrometer exports to Prometheus, CloudWatch, Datadog.',
        'Golden signals: latency, traffic, errors, saturation (Google SRE).',
        'SLI metrics feed SLO error budget burn alerts.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Micrometer counter and timer',
      code: `@RestController
class OrdersController {
  private final Counter ordersCreated;
  private final Timer checkoutLatency;

  OrdersController(MeterRegistry registry) {
    ordersCreated = registry.counter("orders.created", "region", "us-east");
    checkoutLatency = registry.timer("checkout.latency");
  }

  @PostMapping("/orders")
  Order create() {
    return checkoutLatency.record(() -> service.create());
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Pull model (Prometheus scrapes /actuator/prometheus) vs push (CloudWatch PutMetricData).',
        'Histogram buckets cumulative; quantile from histogram or separate summary.',
        'Cardinality explosion: unique path per user ID label kills TSDB.',
        'Recording rules pre-aggregate expensive queries.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Cheap at scale', 'Alerting and SLOs', 'Trend analysis', 'Auto scaling input'],
    disadvantages: ['Lose individual request detail', 'Cardinality mistakes costly', 'Wrong aggregation misleads'],
    alternatives: ['Logs only — expensive query', 'Traces only — incomplete aggregate view'],
    whenToUse: ['Every production service', 'SLO dashboards', 'Capacity planning'],
    whenNotToUse: ['Debugging single request — use traces/logs'],
  },
  failureModes: [
    'High cardinality labels — TSDB OOM',
    'Counter reset mishandled in rate()',
    'Average latency hides p99 regression',
    'Missing error metric — only success path instrumented',
    'Metric name chaos — no naming convention',
  ],
  production: {
    observability: ['RED/USE dashboards per service', 'SLO burn alerts', 'Actuator/prometheus scrape'],
    reliability: ['Alert on error rate and saturation not just CPU'],
    cost: ['Cardinality review', 'Drop debug labels in prod'],
    maintainability: ['Naming convention: namespace_subsystem_unit', 'Document SLI metrics'],
  },
  interview: {
    expectations: ['Counter vs gauge', 'RED method', 'p99 vs average', 'Cardinality'],
    commonQuestions: ['What metrics for microservice?', 'High cardinality problem?'],
    followUps: ['Histogram vs summary?', 'SLO from metrics?'],
    misconceptions: ['More labels always better', 'Metrics replace logs entirely'],
    traps: ['Alert on average latency only'],
    strongSignals: ['RED golden signals', 'Micrometer/Prometheus', 'Cardinality guardrails'],
  },
  keyTakeaways: [
    'Counters, gauges, histograms — pick right instrument type.',
    'RED: rate, errors, duration per service.',
    'Avoid high-cardinality labels (user IDs).',
    'Use histograms for percentile latency SLOs.',
    'Micrometer bridges Spring Boot to backends.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Counter vs gauge?', answerHint: 'Counter only increases; gauge current value up/down.' },
    { level: 'intermediate', question: 'RED metrics?', answerHint: 'Rate, Errors, Duration — service golden signals.' },
    { level: 'advanced', question: 'Cardinality explosion?', answerHint: 'Too many unique label combos; TSDB memory blowup — limit labels.' },
  ],
  flashcards: [
    { front: 'Counter', back: 'Monotonic metric — use rate() for per-second' },
    { front: 'Histogram', back: 'Observations in buckets for percentile calculation' },
    { front: 'RED method', back: 'Rate Errors Duration for request-driven services' },
  ],
  quickRevision: [
    'Counter gauge histogram',
    'RED golden signals',
    'Low cardinality labels',
    'p99 not average',
    'Micrometer export',
  ],
}
