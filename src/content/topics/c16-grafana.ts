import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Grafana is open-source visualization and dashboard platform — queries metrics (Prometheus, CloudWatch, InfluxDB), logs (Loki), and traces (Tempo) to build panels, alerts, and unified observability views. Supports variables, annotations, and on-call alerting via contact points.',
  whyExists:
    'Raw Prometheus PromQL output is not operational. Grafana turns time-series into SLO dashboards, incident graphs, and alert rules engineers act on. Single pane for RED metrics, JVM heap, Kafka lag, and business KPIs.',
  mentalModel:
    'Canvas wired to data sources. Each panel is a query + visualization type (graph, stat, heatmap). Dashboard variables switch environment or service. Alert rule fires when threshold breached → PagerDuty/Slack notification.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Concept', 'Purpose'],
      rows: [
        ['Data source', 'Prometheus, CloudWatch, Loki, Elasticsearch plugin'],
        ['Panel', 'Single visualization with query A, B, transforms'],
        ['Dashboard', 'Collection of panels + variables + links'],
        ['Alert rule', 'Grafana-managed or Prometheus recording rule'],
        ['Annotation', 'Mark deploy events on graphs'],
        ['Explore', 'Ad-hoc query UI for incidents'],
      ],
    },
    {
      type: 'list',
      items: [
        'Prometheus data source URL http://prometheus:9090; queries PromQL.',
        'Variables: $service label_values(up, job) dropdown filters all panels.',
        'Stat panel with thresholds colors green/yellow/red for SLO at glance.',
        'Grafana Alerting unified scheduler replaces legacy dashboard-only alerts.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'text',
      caption: 'PromQL panel — API error rate',
      code: `sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m]))
/
sum(rate(http_server_requests_seconds_count[5m]))`,
    },
    {
      type: 'paragraph',
      text: 'Spring Boot dashboard: panels for JVM memory, HTTP p99 latency histogram_quantile, HikariCP active connections, Kafka consumer lag imported from Prometheus. Variable selects namespace prod/staging. Annotation stream from CI deploy webhook marks version changes.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Grafana Mimir/Cortex for long-term Prometheus metrics storage at scale.',
        'Dashboard JSON export/import — GitOps versioning dashboards.',
        'RBAC organizations folders restrict prod dashboard edit access.',
        'Recording rules in Prometheus pre-aggregate heavy queries Grafana polls.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Rich visualizations', 'Many data source plugins', 'Alerting + on-call integration', 'Open source'],
    disadvantages: ['Dashboard sprawl without governance', 'Heavy queries can load Prometheus', 'Another system to secure'],
    alternatives: ['CloudWatch dashboards AWS-only', 'Datadog unified SaaS', 'Prometheus UI basic graphs only'],
    whenToUse: ['Prometheus metrics visualization', 'Unified ops dashboards', 'SLO tracking'],
    whenNotToUse: ['Log search primary — use Loki Explore or Kibana instead'],
  },
  failureModes: [
    'Dashboard queries full resolution 1s over 30d — Prometheus OOM',
    'Alert flapping without for: 5m duration',
    'Stale dashboard after metric rename',
    'Public Grafana without auth — data leak',
    'Too many duplicate dashboards per team',
  ],
  production: {
    reliability: ['Alert for: duration and noData handling', 'Recording rules for expensive queries'],
    security: ['OAuth SSO', 'Read-only viewer role for most users'],
    maintainability: ['Dashboard as code in Git', 'Naming convention per service'],
    observability: ['Monitor Grafana itself and alert delivery failures'],
  },
  interview: {
    expectations: ['Grafana vs Prometheus roles', 'PromQL in panels', 'Alert routing', 'SLO dashboard design'],
    commonQuestions: ['Visualize microservice metrics?', 'Alert on p99 latency?'],
    followUps: ['Recording rules why?', 'Dashboard variables?'],
    misconceptions: ['Grafana stores metrics', 'Grafana replaces Prometheus'],
    traps: ['Alert on average latency hiding tail issues'],
    strongSignals: ['histogram_quantile p99', 'RED dashboard', 'Deploy annotations', 'GitOps dashboards'],
  },
  keyTakeaways: [
    'Grafana visualizes metrics from Prometheus and other sources.',
    'Panels use PromQL queries with thresholds and variables.',
    'Alerts route to Slack/PagerDuty with for-duration anti-flap.',
    'Use recording rules for heavy aggregations.',
    'Version dashboards in Git as JSON.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Grafana vs Prometheus?', answerHint: 'Prometheus collects/stores metrics; Grafana queries and visualizes dashboards/alerts.' },
    { level: 'intermediate', question: 'Panel for HTTP p99 latency?', answerHint: 'histogram_quantile(0.99, sum(rate(http_latency_bucket[5m])) by (le)) from histogram metrics.' },
    { level: 'advanced', question: 'Prevent alert flapping?', answerHint: 'for: 5m duration, hysteresis thresholds, aggregate not single pod spikes.' },
  ],
  flashcards: [
    { front: 'Data source', back: 'Backend Grafana queries — Prometheus, Loki, CloudWatch' },
    { front: 'Dashboard variable', back: 'Templating dropdown filtering all panel queries' },
    { front: 'histogram_quantile', back: 'PromQL function computing percentile from histogram buckets' },
    { front: 'Annotation', back: 'Vertical marker on timeline e.g. deploy time' },
  ],
  quickRevision: ['Viz layer on Prometheus', 'PromQL panels', 'Alert rules + routes', 'Variables filter', 'Dashboard GitOps'],
}
