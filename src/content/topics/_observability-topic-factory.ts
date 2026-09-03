import type { TopicContent } from '@/domain/types'

type ObservabilityTopicInput = {
  title: string
  sectionTitle: string
  parentTitle?: string
}

const SECTION_FOCUS: Record<string, string> = {
  'Observability Foundations':
    'three pillars, monitoring vs observability, USE/RED/golden signals, and the telemetry pipeline',
  'Structured Logging':
    'JSON schemas, MDC context, levels/sampling, PII redaction, and log aggregation',
  'Metrics Fundamentals':
    'counters/gauges/histograms, labels, pull vs push, and Micrometer-style instrumentation',
  'Golden Signals & SLIs':
    'latency percentiles, error/availability SLIs, throughput, and saturation health metrics',
  'Distributed Tracing':
    'spans/traces, attributes, sampling strategies, backends, and cross-service debug',
  'Correlation & Context Propagation':
    'correlation IDs, W3C trace context, header propagation, and joining signals',
  OpenTelemetry:
    'OTel signals, auto-instrumentation, collector, exporters, and semantic conventions',
  Prometheus:
    'PromQL, scraping/discovery, recording rules, cardinality, and long-term storage',
  'Grafana, Dashboards & Visualization':
    'incident-ready dashboards, RED/USE boards, templating, and dashboards-as-code',
  'Alerting & On-Call':
    'symptom-based alerts, noise control, burn-rate alerts, runbooks, and pager hygiene',
  'Frontend, RUM & Full-Stack Telemetry':
    'Web Vitals, RUM, FE errors, and linking browser spans to backend traces',
  'Cardinality, Cost & Sampling':
    'dangerous labels, log cost, adaptive sampling, and telemetry budgets',
  'Profiling & Continuous Diagnostics':
    'CPU/heap profiles, continuous profiling, JVM signals, and prod perf regressions',
  'Incident Debugging Playbooks':
    'symptom-driven debug loops, cross-service triage, and closing telemetry gaps',
}

export function createObservabilityTopicContent({
  title,
  sectionTitle,
  parentTitle,
}: ObservabilityTopicInput): TopicContent {
  const focus =
    SECTION_FOCUS[sectionTitle] ??
    'telemetry signals, correlation, and production debugging trade-offs'
  const parent = parentTitle ? ` It is an atomic part of ${parentTitle}.` : ''

  return {
    whatIsIt:
      `${title} is an observability topic in ${sectionTitle}.${parent} ` +
      'At 5–6 years of experience, explain which question the signal answers, how you correlate it across FE/BE, and what you would alert on — not only the tool name.',
    whyExists:
      `${title} exists because production systems fail in ways you did not anticipate; you need to ask new questions of live systems. ` +
      `A strong answer covers ${focus}.`,
    mentalModel:
      'Instrument once, correlate everywhere: logs for events, metrics for aggregates, traces for causality, profiles for why it’s slow. ' +
      'Propagate context across browser → API → DB/queue, then alert on user symptoms and debug with evidence.',
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: [
          `Place ${title} in the pipeline: emit → collect → store → query → alert/act.`,
          'Name the signal type: log, metric, trace, profile, or RUM event.',
          'State the dimensions/context you need (service, route, tenant, traceId) and cardinality cost.',
          'State how you join signals (traceId, exemplar, dashboard links).',
          'State the on-call action: symptom alert, runbook, and proof of fix.',
        ],
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Track boundary',
        text:
          'C16 owns observability design and tooling concepts. C12 owns reliability/SLO policy; ' +
          'C15 owns CloudWatch as an AWS product surface; frontend performance depth also lives in Track B where UI-specific.',
      },
    ],
    internals: [
      {
        type: 'list',
        items: [
          'Metrics are cheap aggregates; traces explain a single request path; logs hold sparse high-context events.',
          'Histograms/percentiles matter more than averages for user-visible latency.',
          'Context propagation (W3C traceparent / baggage) is what makes multi-service and FE↔BE correlation possible.',
          'OpenTelemetry standardizes instrumentation so backends (Prometheus, Jaeger, vendors) become swappable.',
          'Cardinality and sampling decide whether your observability stack stays affordable and queryable.',
        ],
      },
    ],
    failureModes: [
      `Treating ${title} as “install a dashboard” without defining the questions and alerts.`,
      'High-cardinality labels (userId on every metric) exploding Prometheus/cost.',
      'Logging secrets/PII, or unstructured printf logs that cannot be queried in an incident.',
      'Alerting on CPU only while users burn on p99 latency and error rate.',
      'Missing FE↔BE correlation so browser failures look disconnected from API traces.',
    ],
    production: {
      reliability: [
        'Alert on golden-signal symptoms and SLO burn; attach runbooks to every page.',
        'Propagate trace context through HTTP, queues, and async executors.',
      ],
      performance: [
        'Track p95/p99 and saturation; use exemplars/traces to find the slow span.',
        'Budget telemetry: sample traces, rate-limit debug logs, avoid unbounded label sets.',
      ],
      maintainability: [
        'Standardize field names/semantic conventions across services and the frontend.',
        'Keep dashboards as code; review alert quality like production code.',
      ],
      observability: [
        'Verify you can answer: is it broken, who is impacted, where, since when, and why?',
        'After incidents, add the missing signal that would have shortened MTTD/MTTR.',
      ],
    },
    interview: {
      expectations: [
        `Define ${title} in ${sectionTitle} and the production question it answers.`,
        'Distinguish logs vs metrics vs traces and when you use each.',
        'Mention correlation, cardinality/cost, or FE↔BE linkage for fullstack roles.',
      ],
      commonQuestions: [
        `How would you use ${title} to debug a production incident?`,
        'How do you design golden-signal dashboards and alerts?',
        'How do you correlate a slow UI with backend traces?',
      ],
      followUps: [
        'What breaks if sampling is too aggressive?',
        'How do you keep Prometheus cardinality under control?',
      ],
      misconceptions: [
        'Observability means installing Grafana.',
        'Average latency is enough.',
        'Frontend monitoring is separate from backend tracing forever.',
      ],
      traps: [
        'Naming tools without explaining signals, correlation, or alert philosophy.',
        'Ignoring cost/cardinality until the observability bill or query times explode.',
      ],
      strongSignals: [
        'Talks evidence-driven debugging across FE and BE with shared context.',
        'Connects SLIs/alerts to user impact and clear runbooks.',
      ],
    },
    keyTakeaways: [
      `${title} belongs to ${sectionTitle}.`,
      `Focus: ${focus}.`,
      'Signal → correlate → symptom alert → prove with traces/logs/profiles.',
    ],
    interviewQuestions: [
      {
        level: 'basic',
        question: `What is ${title}, and which pillar or signal does it belong to?`,
        answerHint: `Place it in ${sectionTitle}; contrast with a neighboring signal type.`,
      },
      {
        level: 'intermediate',
        question: `How would you apply ${title} in a Spring Boot API plus React client?`,
        answerHint: 'Discuss instrumentation, context propagation, and dashboards/alerts.',
      },
      {
        level: 'advanced',
        question: `How would you keep ${title} useful and affordable at scale during incidents?`,
        answerHint: `Use ${focus} plus sampling, cardinality control, and symptom-based alerting.`,
      },
    ],
    flashcards: [
      { front: title, back: `${sectionTitle}: ${focus}.` },
      {
        front: `${title} review loop`,
        back: 'Question → signal → correlate → alert/runbook → prove fix.',
      },
    ],
    quickRevision: [
      `${title} — ${sectionTitle}`,
      `Focus: ${focus}`,
      'Logs / metrics / traces / profiles / RUM',
      'Correlate with context; alert on symptoms',
    ],
  }
}
