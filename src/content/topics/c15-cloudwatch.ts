import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Amazon CloudWatch collects metrics, logs, and alarms for AWS resources and applications: EC2 CPU, ALB request count, custom app metrics, log groups from Lambda/ECS, dashboards, and alarms triggering SNS/Auto Scaling. Central observability hub in AWS.',
  whyExists:
    'You cannot fix what you cannot see. CloudWatch provides default AWS metrics and ingestion for application logs and custom counters. Alarms automate response — scale out, page on-call, trigger Lambda remediation.',
  mentalModel:
    'AWS system dashboard and smoke alarm. Metrics are time-series numbers; logs are searchable text streams; alarms watch metrics thresholds and notify when breached for N periods.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Feature', 'Use'],
      rows: [
        ['Metrics', 'Namespace.MetricName dimensions — AWS/EC2 CPUUtilization'],
        ['Custom metric', 'PutMetricData from app — orders_per_minute'],
        ['Log groups/streams', 'Centralized logs — filter Insights queries'],
        ['Alarms', 'Threshold → SNS, ASG policy, EventBridge'],
        ['Dashboards', 'Visualize metrics across services'],
        ['Container Insights', 'ECS/EKS enhanced metrics'],
      ],
    },
    {
      type: 'list',
      items: [
        'Standard resolution 5 min; detailed 1 min; high-res 1 second extra cost.',
        'Metric math: m1+m2, anomaly detection band.',
        'Logs Insights: parse JSON logs stats count by level.',
        'Composite alarms combine multiple alarms.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'text',
      caption: 'Alarm and log query concepts',
      code: `Alarm: AWS/ECS Service CPUUtilization > 80% for 3 periods of 5 min
  → SNS topic → PagerDuty

Logs Insights:
fields @timestamp, level, message
| filter level = "ERROR"
| stats count() by bin(5m)`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Metric retention: 15 months at varying granularity.',
        'Embedded Metric Format (EMF) from structured logs creates metrics.',
        'Cross-account observability with OAM sink.',
        'X-Ray integrates for traces; not same as CloudWatch Logs.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Native AWS integration', 'Alarms drive automation', 'Logs Insights ad-hoc queries'],
    disadvantages: ['Cost at high log volume', 'Not full APM — pair with OTel/Grafana', 'Dashboard sprawl'],
    alternatives: ['Datadog', 'Prometheus/Grafana on EKS', 'OpenSearch for logs'],
    whenToUse: ['Every AWS deployment baseline', 'ASG scaling signals', 'Audit logs'],
    whenNotToUse: ['Complex distributed tracing alone — add X-Ray/OTel'],
  },
  failureModes: [
    'Alarm too sensitive — alert fatigue',
    'Missing custom metrics — flying blind on business KPIs',
    'Log group no retention — unbounded cost or lost history',
    'Wrong statistic — Average hides p99 spike',
    'Alarm action misconfigured — silent failure',
  ],
  production: {
    observability: ['Golden signals dashboards', 'SLO burn rate alarms', 'Log retention policy'],
    reliability: ['Alarm on unhealthy ASG targets', 'Composite alarm for incident severity'],
    cost: ['Log retention tiers', 'Metric filters vs shipping all debug logs'],
    security: ['Encrypt log groups KMS', 'Restrict PutMetricData IAM'],
  },
  interview: {
    expectations: ['Metrics vs logs', 'CloudWatch alarm to ASG', 'Custom metrics'],
    commonQuestions: ['Monitor Spring Boot on AWS?', 'CloudWatch vs third-party APM?'],
    followUps: ['Logs Insights?', 'Anomaly detection alarm?'],
    misconceptions: ['CloudWatch includes full distributed tracing', 'All metrics free'],
    traps: ['Average CPU alarm only for latency SLO'],
    strongSignals: ['Custom business metrics', 'EMF', 'Alarm → runbook link in SNS'],
  },
  keyTakeaways: [
    'CloudWatch: metrics, logs, alarms, dashboards for AWS.',
    'Default AWS metrics free tier; custom PutMetricData for app KPIs.',
    'Alarms trigger SNS, Auto Scaling, EventBridge.',
    'Logs Insights query structured logs.',
    'Pair with OTel/X-Ray for traces; CW for infra baseline.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'CloudWatch metrics vs logs?', answerHint: 'Metrics numeric time series; logs text events in log groups.' },
    { level: 'intermediate', question: 'Auto scale from custom metric?', answerHint: 'App PutMetricData; ASG target tracking on that metric.' },
    { level: 'advanced', question: 'Alert on p99 latency not average?', answerHint: 'Publish p99 custom metric or use metric math on published percentiles; avoid average-only alarms.' },
  ],
  flashcards: [
    { front: 'CloudWatch alarm', back: 'Metric threshold breach triggers action' },
    { front: 'Logs Insights', back: 'Query language for CloudWatch log analysis' },
    { front: 'PutMetricData', back: 'Publish custom application metrics' },
  ],
  quickRevision: [
    'Metrics logs alarms',
    'Custom PutMetricData',
    'Logs Insights',
    'Alarm → SNS ASG',
    'Retention cost control',
  ],
}
