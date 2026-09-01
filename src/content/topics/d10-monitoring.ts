import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A metrics and monitoring platform ingests time-series data (counters, gauges, histograms) and logs from services, stores them efficiently, evaluates alerts, and powers dashboards — the observability backbone for production systems.',
  whyExists:
    'Without centralized telemetry, debugging outages across thousands of microservices is impossible. SRE needs SLO tracking, anomaly alerts, and historical analysis without crushing application performance or storage budgets.',
  mentalModel:
    'Apps push or expose metrics via pull (Prometheus scrape). Agents batch and forward to ingestion. Time-series DB compresses and downsamples by retention tier. Alert engine evaluates rules on streams; dashboards query aggregated views.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Metric identity: name + labels (cardinality danger). Scraped every 15s into TSDB blocks. Recording rules pre-aggregate hot queries. Long-term storage (Thanos/Cortex) on object store. Logs often separate pipeline (ELK/Loki) but unified query UX is the goal.',
    },
    {
      type: 'mermaid',
      caption: 'Metrics pipeline',
      diagram: `flowchart LR
  App[Services] -->|/metrics| Prom[Prometheus]
  Prom --> TSDB[(Local TSDB)]
  Prom --> Remote[Remote Write]
  Remote --> Cortex[Cortex/Mimir]
  Cortex --> S3[(Object Store)]
  Cortex --> AM[Alertmanager]
  Grafana[Grafana] --> Cortex`,
    },
  ],
  example: [
    {
      type: 'code',
      language: 'text',
      caption: 'Prometheus metric exposition',
      code: `# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",status="200"} 1027`,
    },
  ],
  keyTakeaways: [
    'Control label cardinality — high cardinality kills TSDB.',
    'Pull vs push: pull simpler for K8s; push for short-lived jobs.',
    'Retention tiers: raw 15d, 5m agg 90d, 1h agg 2y.',
    'Alerts on SLI burn rates, not every blip.',
    'Evolve: statsd → Prometheus → federated long-term store.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Counter vs gauge vs histogram?',
      answerHint: 'Counter monotonic; gauge current value; histogram buckets for latency percentiles.',
    },
    {
      level: 'intermediate',
      question: 'What is cardinality problem?',
      answerHint: 'Too many unique label combos explode memory — avoid user_id as label.',
    },
    {
      level: 'advanced',
      question: 'Design multi-tenant metrics SaaS?',
      answerHint: 'Tenant_id label with isolation quotas; separate ingester shards; rate limits.',
    },
  ],
  flashcards: [
    { front: 'High cardinality example', back: 'http_requests{user_id="123"} — unbounded labels' },
    { front: 'Remote write', back: 'Prometheus forwards samples to central TSDB' },
    { front: 'SLI burn alert', back: 'Alert when error budget consumption rate exceeds threshold' },
  ],
  quickRevision: [
    'Prometheus pull /metrics',
    'Labels: low cardinality only',
    'TSDB blocks + compaction',
    'Recording rules for heavy queries',
    'Alertmanager routing',
    'Grafana dashboards',
  ],
  systemDesign: {
    problem:
      'Design a metrics platform for 50k services, 10M active series, 1M samples/s ingestion, 1-year retention with downsampling, and sub-second dashboard queries.',
    requirements: {
      functional: [
        'Ingest counters/gauges/histograms with labels',
        'Query language (PromQL-style) with aggregations',
        'Alert rules and notification routing',
        'Dashboards and ad-hoc exploration',
      ],
      nonFunctional: [
        'Ingestion loss < 0.01% under normal load',
        'Query p99 < 2s for dashboard panels',
        'Multi-tenant isolation and quotas',
        '15-month retention with tiered resolution',
      ],
    },
    scaleAssumptions: [
      '50k services × ~200 series each ≈ 10M active series',
      'Scrape 15s → ~667k samples/s; spikes to 1M/s',
      'Avg sample 16 bytes compressed',
    ],
    capacityEstimates: [
      '1M samples/s × 16 B ≈ 16 MB/s raw → ~1.4 TB/day uncompressed; compression ~10×',
      '10M series metadata in ingester memory — shard ingesters',
      '1 year downsampled ≈ petabyte tier on object storage',
    ],
    api: [
      {
        type: 'code',
        language: 'http',
        code: `POST /api/v1/push  (remote write protobuf)
GET  /api/v1/query?query=rate(http_requests[5m])
POST /api/v1/rules`,
      },
    ],
    dataModel: [
      {
        type: 'list',
        items: [
          'TimeSeries: metric_name, labels map, samples [(ts, value)]',
          'AlertRule: expr, for_duration, labels, annotations',
          'TenantQuota: max_series, ingestion_rate',
        ],
      },
    ],
    highLevelArchitecture: [
      {
        type: 'paragraph',
        text: 'Prometheus agents per cluster scrape and remote-write to Cortex/Mimir ingesters. Ingester batches into blocks flushed to S3. Querier fans out to ingesters + store-gateway for historical blocks. Alertmanager handles dedupe and routes.',
      },
    ],
    diagram: {
      mermaid: `flowchart TB
  Svc[50k Services] --> Agent[Prometheus Agent]
  Agent --> Ing[Cortex Ingester]
  Ing --> S3[(S3 Blocks)]
  Q[Cortex Querier] --> Ing
  Q --> S3
  Q --> Grafana[Grafana]
  Ruler[Ruler] --> Q
  Ruler --> AM[Alertmanager]`,
      caption: 'Horizontally scaled TSDB with object storage backend',
    },
    dataFlow: [
      'Scrape /metrics every 15s',
      'Remote write batch to ingester hash ring by series',
      'Ingester WAL → block flush hourly to S3',
      'Query: querier merges ingester head + S3 blocks',
      'Ruler evaluates alert expr → Alertmanager → PagerDuty',
    ],
    storage: [
      'Ingester local WAL + memory head',
      'S3 immutable TSDB blocks',
      'Index cache for series lookup',
    ],
    caching: [
      'Querier results cache (Memcached)',
      'Store-gateway index cache',
    ],
    asyncProcessing: [
      'Compaction of blocks in background',
      'Downsampling jobs for long retention',
      'Outlier detection ML optional async',
    ],
    scaling: [
      'Hash ring shard ingesters by series labels',
      'Separate read path (queriers) from write',
      'Rate limit per tenant ingestion',
    ],
    consistency: [
      'Metrics eventually visible within scrape interval',
      'Alert evaluation eventual (30s–1m lag typical)',
    ],
    reliability: [
      'Ingester replication factor 3',
      'WAL replay on crash',
      'Backpressure when ingestion exceeds capacity',
    ],
    failureScenarios: [
      'Cardinality explosion from bad deploy → drop labels / quota block tenant',
      'Ingester loss → replicated on other replicas',
      'Query storm → query frontend queue and timeout',
    ],
    security: [
      'Auth tenant header on remote write',
      'RBAC on Grafana',
      'No PII in metric labels',
    ],
    observability: [
      'Meta-metrics: ingestion rate, compactions, query latency',
      'Track dropped samples and out-of-order rejects',
    ],
    bottlenecks: [
      'High-cardinality labels',
      'Expensive PromQL without recording rules',
      'Ingester memory for hot series',
    ],
    alternatives: [
      'Datadog / New Relic SaaS',
      'InfluxDB single cluster',
      'VictoriaMetrics for cost-efficient storage',
    ],
    tradeoffs: [
      'Pull vs push instrumentation model',
      'Long raw retention vs storage cost',
      'Self-host vs SaaS ops burden',
    ],
    interviewFollowUps: [
      'How trace (Jaeger) fits with metrics?',
      'Log correlation with trace_id?',
      'Design custom agent for mobile apps?',
    ],
    evolution: [
      {
        stage: '1. Simple design',
        description: 'Single Prometheus server scraping all targets.',
        bottleneck: 'Memory cap; no HA; retention days.',
      },
      {
        stage: '2. Improve',
        description: 'Per-cluster Prometheus + federation + Alertmanager.',
        bottleneck: 'Federation does not scale queries; long retention expensive.',
      },
      {
        stage: '3. Improve',
        description: 'Cortex/Mimir remote write + S3 + Grafana.',
        bottleneck: 'Cardinality incidents; query latency on huge ranges.',
      },
      {
        stage: '4. Scale further',
        description: 'Tenant quotas, recording rules, downsample tiers, multi-region mirrors.',
        bottleneck: 'Cost at petabyte scale; noisy neighbor tenants.',
      },
    ],
  },
  tradeoffs: {
    advantages: ['Unified SLO view', 'Historical debugging', 'Proactive alerts'],
    disadvantages: ['Cardinality discipline required', 'Storage cost', 'Instrumentatio overhead'],
    alternatives: ['SaaS APM', 'Log-only debugging'],
    whenToUse: ['Any production distributed system'],
    whenNotToUse: ['Prototype with zero users — basic logs enough'],
  },
  failureModes: [
    'Cardinality blow-up OOMs ingesters',
    'Alert fatigue from non-SLO rules',
    'Clock skew causes out-of-order sample drops',
  ],
  production: {
    performance: ['Recording rules; query caching'],
    scalability: ['Shard ingesters; object storage backend'],
    reliability: ['Replication factor 3; WAL'],
    security: ['Tenant isolation; no secrets in labels'],
    observability: ['Monitor the monitors meta-dashboard'],
    cost: ['Downsampling; aggressive retention policies'],
  },
  interview: {
    expectations: [
      'Scrape → TSDB → query → alert pipeline',
      'Cardinality and label hygiene',
      'Retention and downsampling tiers',
    ],
    commonQuestions: ['Design monitoring system', 'Prometheus scaling'],
    followUps: ['Logs vs metrics?', 'Multi-tenant quotas?'],
    misconceptions: ['Unlimited labels are fine'],
    traps: ['user_id as metric label'],
    strongSignals: ['Remote write, hash ring, blocks on S3, recording rules, burn-rate alerts'],
  },
}
