import type { Priority } from '@/domain/types'
import type { SectionSeed, TopicSeed } from './build'

const OBS = ['observability'] as const
const M78 = [7, 8]
const M89 = [8, 9]

function item(
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  const { tags, executionPriority, ...rest } = extra
  return {
    id,
    title,
    priority,
    months: extra.months ?? (priority === 'tier1' ? M78 : M89),
    tags: [...OBS, ...(tags ?? [])],
    executionPriority:
      executionPriority ?? (priority === 'tier1' ? 'p0' : priority === 'tier2' ? 'p1' : 'later'),
    ...rest,
  }
}

function nest(
  parent: string,
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  return item(id, title, priority, {
    ...extra,
    curriculumLevel: 'nested-concept',
    parentTopicId: parent,
  })
}

function section(id: string, title: string, order: number, topics: TopicSeed[]): SectionSeed {
  return {
    id,
    track: 'C',
    title,
    order,
    defaultKind: 'theory',
    defaultDepth: 'deep',
    topics,
  }
}

/**
 * C16.1–C16.14 — observability for experienced full-stack engineers.
 * Focus: three pillars, golden signals, OTel, Prometheus/Grafana, frontend RUM,
 * cardinality/cost, alerting, and incident debugging — interview-ready for 5–6 YOE.
 * Reliability SLOs overlap C12; CloudWatch product depth overlaps C15; CI depth in C14.
 * Existing C16 topic IDs remain stable.
 */
export const TRACK_C_OBSERVABILITY_SECTIONS: SectionSeed[] = [
  section('C16.1', 'Observability Foundations', 242, [
    item('c16-observability-foundations', 'Observability Foundations'),
    nest('c16-observability-foundations', 'c16-three-pillars', 'Logs, Metrics & Traces'),
    nest('c16-observability-foundations', 'c16-monitoring-vs-observability', 'Monitoring vs Observability'),
    nest('c16-observability-foundations', 'c16-use-red-golden', 'USE, RED & Golden Signals'),
    nest('c16-observability-foundations', 'c16-telemetry-pipeline', 'Emit → Collect → Store → Query → Act'),
    nest('c16-observability-foundations', 'c16-unknown-unknowns', 'Unknown-Unknowns & High-Cardinality Context'),
  ]),

  section('C16.2', 'Structured Logging', 243, [
    item('c16-structured-logging', 'Structured Logging'),
    nest('c16-structured-logging', 'c16-json-log-schema', 'JSON Log Schema & Stable Fields'),
    nest('c16-structured-logging', 'c16-mdc-context', 'MDC / Request Context'),
    nest('c16-structured-logging', 'c16-log-levels-sampling', 'Levels, Sampling & Volume Control'),
    nest('c16-structured-logging', 'c16-pii-redaction', 'PII Redaction & Secrets in Logs'),
    nest('c16-structured-logging', 'c16-log-aggregation', 'Aggregation: Loki / ELK / CloudWatch Logs', 'tier2'),
  ]),

  section('C16.3', 'Metrics Fundamentals', 244, [
    item('c16-metrics', 'Metrics'),
    nest('c16-metrics', 'c16-counters-gauges', 'Counters & Gauges'),
    nest('c16-metrics', 'c16-histograms-summaries', 'Histograms, Summaries & Buckets'),
    nest('c16-metrics', 'c16-metric-labels', 'Labels / Dimensions'),
    nest('c16-metrics', 'c16-pull-vs-push', 'Pull vs Push Metrics'),
    nest('c16-metrics', 'c16-micrometer', 'Micrometer / Spring Metrics', 'tier2'),
  ]),

  section('C16.4', 'Golden Signals & SLIs', 245, [
    item('c16-latency-percentiles', 'Latency Percentiles'),
    nest('c16-latency-percentiles', 'c16-p50-p95-p99', 'p50 / p95 / p99 Tail Latency'),
    nest('c16-latency-percentiles', 'c16-avg-lies', 'Why Averages Lie'),
    item('c16-error-rates', 'Error Rates'),
    nest('c16-error-rates', 'c16-availability-sli', 'Availability as an SLI'),
    item('c16-throughput', 'Throughput'),
    nest('c16-throughput', 'c16-rps-concurrency', 'RPS, Concurrency & Saturation Link'),
    item('c16-health-metrics', 'Health Metrics'),
    nest('c16-health-metrics', 'c16-saturation-signals', 'CPU, Memory, Queue & Pool Saturation'),
  ]),

  section('C16.5', 'Distributed Tracing', 246, [
    item('c16-tracing', 'Distributed Tracing'),
    nest('c16-tracing', 'c16-spans-traces', 'Traces, Spans & Parent-Child Links'),
    nest('c16-tracing', 'c16-span-attributes', 'Attributes, Events & Status'),
    nest('c16-tracing', 'c16-trace-sampling', 'Head vs Tail Sampling'),
    nest('c16-tracing', 'c16-trace-backends', 'Jaeger / Zipkin / Tempo / X-Ray', 'tier2'),
    nest('c16-tracing', 'c16-trace-driven-debug', 'Trace-Driven Debugging Across Services'),
  ]),

  section('C16.6', 'Correlation & Context Propagation', 247, [
    item('c16-correlation-ids', 'Correlation IDs'),
    nest('c16-correlation-ids', 'c16-traceparent-baggage', 'traceparent, W3C Trace Context & Baggage'),
    nest('c16-correlation-ids', 'c16-header-propagation', 'HTTP / Messaging Header Propagation'),
    nest('c16-correlation-ids', 'c16-log-metric-trace-join', 'Joining Logs ↔ Metrics ↔ Traces'),
    nest('c16-correlation-ids', 'c16-async-context', 'Async / Thread-Pool Context Loss'),
  ]),

  section('C16.7', 'OpenTelemetry', 248, [
    item('c16-otel', 'OpenTelemetry Concepts'),
    nest('c16-otel', 'c16-otel-signals', 'OTel Signals: Logs, Metrics, Traces'),
    nest('c16-otel', 'c16-otel-sdk-auto', 'SDK vs Auto-Instrumentation'),
    nest('c16-otel', 'c16-otel-collector', 'OpenTelemetry Collector'),
    nest('c16-otel', 'c16-otel-exporters', 'Exporters & Vendors'),
    nest('c16-otel', 'c16-otel-semantic-conventions', 'Semantic Conventions', 'tier2'),
  ]),

  section('C16.8', 'Prometheus', 249, [
    item('c16-prometheus', 'Prometheus', 'tier2'),
    nest('c16-prometheus', 'c16-promql-basics', 'PromQL Basics', 'tier2'),
    nest('c16-prometheus', 'c16-scrape-service-discovery', 'Scraping & Service Discovery', 'tier2'),
    nest('c16-prometheus', 'c16-recording-rules', 'Recording Rules', 'tier2'),
    nest('c16-prometheus', 'c16-prom-cardinality', 'Prometheus Cardinality Explosions', 'tier2'),
    nest('c16-prometheus', 'c16-prom-ha', 'HA, Federation & Long-Term Storage', 'tier2'),
  ]),

  section('C16.9', 'Grafana, Dashboards & Visualization', 250, [
    item('c16-grafana', 'Grafana', 'tier2'),
    nest('c16-grafana', 'c16-dashboard-design', 'Dashboard Design for Incidents', 'tier2'),
    nest('c16-grafana', 'c16-red-use-boards', 'RED/USE Dashboard Patterns', 'tier2'),
    nest('c16-grafana', 'c16-variables-templating', 'Variables & Multi-Service Boards', 'tier2'),
    nest('c16-grafana', 'c16-dashboard-as-code', 'Dashboards as Code', 'tier2'),
  ]),

  section('C16.10', 'Alerting & On-Call', 251, [
    item('c16-alerting', 'Alerting & On-Call', 'tier2'),
    nest('c16-alerting', 'c16-symptom-vs-cause', 'Alert on Symptoms, Not Causes', 'tier2'),
    nest('c16-alerting', 'c16-alert-noise', 'Alert Noise, Fatigue & Routing', 'tier2'),
    nest('c16-alerting', 'c16-burn-rate-alerts', 'Multi-Window Burn-Rate Alerts', 'tier2', {
      related: ['c12-slos'],
    }),
    nest('c16-alerting', 'c16-runbook-links', 'Runbooks Linked from Alerts', 'tier2'),
    nest('c16-alerting', 'c16-pager-hygiene', 'Pager Hygiene & Escalation', 'tier2'),
  ]),

  section('C16.11', 'Frontend, RUM & Full-Stack Telemetry', 252, [
    item('c16-frontend-observability', 'Frontend & RUM Observability'),
    nest('c16-frontend-observability', 'c16-web-vitals', 'Core Web Vitals (LCP, INP, CLS)'),
    nest('c16-frontend-observability', 'c16-rum', 'Real User Monitoring'),
    nest('c16-frontend-observability', 'c16-fe-error-tracking', 'Frontend Error Tracking'),
    nest('c16-frontend-observability', 'c16-fe-be-trace-link', 'Linking Browser Spans to Backend Traces'),
    nest('c16-frontend-observability', 'c16-client-metrics', 'API Latency from the Client Perspective', 'tier2'),
  ]),

  section('C16.12', 'Cardinality, Cost & Sampling', 253, [
    item('c16-cardinality-cost', 'Cardinality, Cost & Sampling', 'tier2'),
    nest('c16-cardinality-cost', 'c16-high-cardinality-labels', 'Dangerous High-Cardinality Labels', 'tier2'),
    nest('c16-cardinality-cost', 'c16-log-volume-cost', 'Log Volume & Retention Cost', 'tier2'),
    nest('c16-cardinality-cost', 'c16-adaptive-sampling', 'Adaptive / Tail-Based Sampling', 'tier2'),
    nest('c16-cardinality-cost', 'c16-telemetry-budgets', 'Telemetry Budgets per Service', 'tier2'),
  ]),

  section('C16.13', 'Profiling & Continuous Diagnostics', 254, [
    item('c16-profiling', 'Profiling & Continuous Diagnostics', 'tier2'),
    nest('c16-profiling', 'c16-cpu-heap-profiles', 'CPU & Heap Profiles', 'tier2'),
    nest('c16-profiling', 'c16-continuous-profiling', 'Continuous Profiling', 'tier2'),
    nest('c16-profiling', 'c16-jvm-runtime-signals', 'JVM Runtime Signals (GC, Threads)', 'tier2'),
    nest('c16-profiling', 'c16-perf-regression-signals', 'Catching Perf Regressions in Prod', 'tier2'),
  ]),

  section('C16.14', 'Incident Debugging Playbooks', 255, [
    item('c16-incident-debugging', 'Incident Debugging Playbooks', 'tier2'),
    nest('c16-incident-debugging', 'c16-debug-loop', 'Symptom → Signal → Hypothesis → Prove', 'tier2'),
    nest('c16-incident-debugging', 'c16-cross-service-investigation', 'Cross-Service Investigation', 'tier2'),
    nest('c16-incident-debugging', 'c16-customer-impact-first', 'Customer-Impact-First Triage', 'tier2'),
    nest('c16-incident-debugging', 'c16-post-incident-telemetry', 'Post-Incident Telemetry Gaps', 'tier2'),
    nest('c16-incident-debugging', 'c16-observability-checklist', 'Observability Interview Checklist', 'tier2'),
  ]),
]
