import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Prometheus is pull-based metrics monitoring system — scrapes HTTP /metrics endpoints on interval, stores time-series in TSDB, evaluates alerting rules, and queries via PromQL. De facto standard for Kubernetes and Spring Boot Micrometer export.',
  whyExists:
    'Push-based proprietary agents do not scale uniformly. Prometheus pull model discovers targets, labels metrics multidimensionally (service, instance, endpoint), and enables powerful aggregations for SLOs and capacity planning.',
  mentalModel:
    'Scheduled collector visiting each service /metrics page every 15s, appending samples to local database. Metric name + labels uniquely identify series. PromQL aggregates rates, histograms, and alerts when error ratio exceeds threshold.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Concept', 'Example'],
      rows: [
        ['Counter', 'http_requests_total only increases — use rate()'],
        ['Gauge', 'jvm_memory_used_bytes up/down'],
        ['Histogram', '_bucket _sum _count for quantiles'],
        ['Summary', 'Client-side quantiles less common now'],
        ['Labels', 'method="GET", status="500", job="api"'],
        ['Scrape', 'GET /actuator/prometheus every 15s'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Pull scrape architecture',
      diagram: `flowchart LR
  P[Prometheus server] -->|scrape| A[App :8080/metrics]
  P -->|scrape| B[App :8080/metrics]
  P -->|scrape| N[node_exporter]
  P --> R[Alertmanager]
  R --> Slack
  G[Grafana] -->|PromQL| P`,
    },
    {
      type: 'list',
      items: [
        'Micrometer registry exports Spring Boot metrics to Prometheus format.',
        'rate(counter[5m]) per-second increase over window.',
        'histogram_quantile(0.99, ...) for p99 latency from buckets.',
        'Alertmanager groups silences routes alerts dedupe.',
        'Service discovery kubernetes_sd_configs auto-finds pod targets.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'text',
      caption: 'Alert rule — high 5xx rate',
      code: `groups:
- name: api
  rules:
  - alert: HighErrorRate
    expr: |
      sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m]))
      / sum(rate(http_server_requests_seconds_count[5m])) > 0.05
    for: 5m
    labels:
      severity: page`,
    },
    {
      type: 'code',
      language: 'yaml',
      caption: 'prometheus.yml scrape job',
      code: `scrape_configs:
  - job_name: spring-api
    metrics_path: /actuator/prometheus
    static_configs:
      - targets: ['api:8080']`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'TSDB block compaction local storage — remote write to Mimir for long retention.',
        'High cardinality labels (user_id) explode memory — avoid.',
        'Recording rules precompute expensive expressions.',
        'Pushgateway exception for batch job metrics only not services.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Pull model health check implicit', 'Powerful PromQL', 'Ecosystem exporters', 'Cloud-native standard'],
    disadvantages: ['Not long-term store alone', 'Cardinality discipline required', 'Pull needs network reach to targets'],
    alternatives: ['CloudWatch metrics AWS-native', 'Datadog agent push', 'OpenTelemetry collector pipeline'],
    whenToUse: ['K8s and Spring metrics', 'SLO error budget alerts', 'Custom business counters'],
    whenNotToUse: ['High-cardinality per-user series', 'Log storage — use Loki'],
  },
  failureModes: [
    'Label cardinality explosion OOM Prometheus',
    'Missing rate() on counter — meaningless graph',
    'Scrape timeout during GC pause — gaps',
    'Alert without for: — page on blip',
    'Pushgateway misuse for service metrics — single point wrong semantics',
  ],
  production: {
    reliability: ['Alertmanager HA', 'Remote write for durability', 'Recording rules'],
    performance: ['Scrape interval vs resolution tradeoff', 'Limit labels cardinality'],
    observability: ['meta-monitoring prometheus itself', 'up{job="api"}==0 target down alert'],
    maintainability: ['Naming convention metric prefixes', 'Document RED metrics per service'],
  },
  interview: {
    expectations: ['Counter vs gauge', 'rate() and histogram_quantile', 'Pull vs push', 'Cardinality'],
    commonQuestions: ['Monitor Spring Boot?', 'p99 from Prometheus?'],
    followUps: ['Alertmanager role?', 'High cardinality problem?'],
    misconceptions: ['Prometheus stores logs', 'Counters can decrease'],
    traps: ['Alert on raw counter not rate'],
    strongSignals: ['RED/USE methods', 'Micrometer export', 'for: duration', 'Avoid high-card labels'],
  },
  keyTakeaways: [
    'Prometheus pulls /metrics on scrape interval.',
    'Counter use rate(); gauge direct value.',
    'Histogram buckets enable histogram_quantile p99.',
    'Control label cardinality — no unbounded user_id label.',
    'Alertmanager routes grouped alerts; Grafana visualizes.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Counter vs gauge?', answerHint: 'Counter monotonic increasing — use rate(); gauge can go up/down directly.' },
    { level: 'intermediate', question: 'Compute request rate from counter?', answerHint: 'rate(http_requests_total[5m]) — per-second average increase over 5m window.' },
    { level: 'advanced', question: 'Why avoid user_id label?', answerHint: 'Unbounded cardinality — each user new time series exhausts Prometheus memory.' },
  ],
  flashcards: [
    { front: 'rate()', back: 'Per-second increase of counter over time window' },
    { front: 'Scrape', back: 'Prometheus HTTP pull of /metrics endpoint' },
    { front: 'Alertmanager', back: 'Routes groups silences dedupes firing alerts' },
    { front: 'Cardinality', back: 'Number of unique label combinations — memory driver' },
  ],
  quickRevision: ['Pull /metrics', 'Counter rate()', 'Histogram quantile', 'Low cardinality labels', 'Alertmanager routes'],
}
