import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Observability in system design interviews covers how you detect, debug, and measure the system — metrics (RED/USE), structured logs, distributed tracing, SLO dashboards, alerting on symptoms not causes, and runbooks — mapped to components in your architecture.',
  whyExists:
    'Design without observability is unoperable. Interviewers want proof you will know when feed lag spikes or payment errors burn SLO before customers do. Observability section closes the loop on reliability and capacity assumptions.',
  mentalModel:
    'Cockpit instruments for the plane you designed. Metrics = speed/altitude; logs = black box events; traces = flight path across services. Alerts when passengers feel turbulence (SLO burn) not when single bolt turns (noisy infra alert).',
  howItWorks: [
    {
      type: 'table',
      headers: ['Pillar', 'Interview mention', 'Example'],
      rows: [
        ['Metrics', 'RED: rate errors duration', 'API p99, 5xx rate'],
        ['Logs', 'Structured JSON correlation id', 'request_id across services'],
        ['Traces', 'OpenTelemetry spans', 'Checkout slow — which dependency'],
        ['SLO dashboards', 'Error budget burn', '99.9% checkout SLO'],
        ['Alerting', 'Page on symptom', 'SLO burn not CPU > 80% alone'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Observability data flow',
      diagram: `flowchart LR
  Svc[Services] --> Metrics[Prometheus/Datadog]
  Svc --> Logs[Central logs]
  Svc --> Traces[Jaeger/Tempo]
  Metrics --> SLO[SLO dashboard]
  SLO --> Alert[Pager on burn rate]`,
    },
    {
      type: 'list',
      items: [
        '2–3 minutes at end of interview or woven into deep dives',
        'Per critical path: checkout, feed, upload pipeline metrics',
        'Synthetic probes for user journeys',
        'Avoid alert fatigue — SLO-based paging',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Payment path: metrics on success rate, p99 latency, fraud timeout rate; trace id from gateway through order svc to DB; log structured with order_id; SLO dashboard 99.95% success; alert multi-window burn rate; queue depth metric for async capture; runbook linked on payment CB open alert.',
    },
  ],
  tradeoffs: {
    advantages: ['Operable production design', 'SLO accountability', 'Faster incident response'],
    disadvantages: ['Cardinality cost if over-instrumented', 'Time in short interview'],
    alternatives: ['"We add monitoring" hand-wave — weak'],
    whenToUse: ['Closing section every HLD', 'After failure handling'],
    whenNotToUse: ['Never skip entirely at senior level'],
  },
  failureModes: [
    'CPU alerts only — miss user-facing outage',
    'No correlation id across microservices',
    'High-cardinality per-user metrics',
    'Logs without sampling at high QPS',
    'No SLO tied to stated NFRs',
  ],
  production: {
    observability: ['RED/USE golden signals', 'Trace propagation mandatory', 'SLO burn alerts'],
    reliability: ['Observability supports error budget decisions'],
    cost: ['Metric cardinality controls', 'Log sampling and retention tiers'],
  },
  interview: {
    expectations: ['Metrics logs traces mention', 'SLO dashboard', 'Alert on user impact'],
    commonQuestions: ['How debug slow checkout?', 'What alert on?'],
    followUps: ['Cardinality problem?', 'Sampling strategy?'],
    misconceptions: ['Monitoring equals observability — need traces/logs correlation'],
    traps: ['Alert on every infra metric'],
    strongSignals: ['RED metrics', 'request_id propagation', 'SLO burn paging'],
  },
  keyTakeaways: [
    'Metrics (RED), logs (structured), traces (distributed) — three pillars.',
    'Alert on SLO symptom burn not raw CPU alone.',
    'Correlation id across all services on critical paths.',
    'Dashboard per user journey matching functional reqs.',
    '2–3 min — tie to components already drawn.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'RED metrics?', answerHint: 'Rate, Errors, Duration — per service request handling.' },
    { level: 'intermediate', question: 'Debug p99 latency regression?', answerHint: 'Compare trace spans find slow dependency; check deploy correlation; metrics by endpoint.' },
    { level: 'advanced', question: 'Observability at 100k RPS without cost explosion?', answerHint: 'Sample traces 1%; aggregate metrics low cardinality; tail sampling on errors; log info level sampling.' },
  ],
  flashcards: [
    { front: 'RED metrics', back: 'Rate Errors Duration for request services' },
    { front: 'Distributed trace', back: 'Spans across services showing latency breakdown' },
    { front: 'SLO burn alert', back: 'Page when error budget consumed too fast' },
    { front: 'Correlation id', back: 'request_id linking logs traces across services' },
  ],
  quickRevision: [
    'RED metrics',
    'Structured logs',
    'Traces spans',
    'SLO burn alerts',
    'request_id',
  ],
}
