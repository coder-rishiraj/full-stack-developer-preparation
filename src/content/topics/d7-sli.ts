import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A Service Level Indicator (SLI) is a quantitative measure of service behavior — availability (success ratio), latency (p99 request duration), throughput, freshness, correctness — computed over a rolling window from logs, metrics, or synthetic probes. SLIs are the raw signal for SLOs and SLAs.',
  whyExists:
    '"The system feels slow" is not actionable. SLIs turn user-perceived quality into numbers you can alert on, budget error against, and compare before/after changes. Good SLIs map closely to user happiness, not just server CPU.',
  mentalModel:
    'Vital signs on a patient monitor. Heart rate (availability), blood pressure (latency), oxygen (freshness). Doctors set targets (SLO) based on normal ranges (SLI history). Wrong vital (measuring disk not user latency) misses the disease.',
  howItWorks: [
    {
      type: 'table',
      headers: ['SLI type', 'Formula sketch', 'User impact'],
      rows: [
        ['Availability', 'good events / total valid events', 'Can users complete action?'],
        ['Latency', 'p99 duration < threshold', 'Feels fast or sluggish'],
        ['Throughput', 'Successful RPS sustained', 'Handles peak load'],
        ['Freshness', 'Age of latest processed data', 'Stale feed or dashboard'],
        ['Correctness', 'Valid responses / total', 'Wrong data worse than slow'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'SLI measurement pipeline',
      diagram: `flowchart LR
  Users[User requests] --> Probe[Synthetic + real traffic]
  Probe --> Logs[Logs / metrics / traces]
  Logs --> SLI[SLI computation window]
  SLI --> SLO[Compare to SLO target]`,
    },
    {
      type: 'list',
      items: [
        'Use request-based SLI for user-facing APIs: good/total over 28-day window common',
        'Exclude client errors (4xx user fault) from availability if appropriate — document choice',
        'Align measurement with user journey: checkout success not just /health 200',
        'Combine synthetic probes (coverage) with real traffic (truth)',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Checkout SLI: proportion of POST /orders returning 2xx within 5s over rolling 30 days, excluding 4xx validation errors. Latency SLI: p99 server-side duration < 800ms for same endpoint. Computed from load balancer access logs + tracing spans.',
    },
  ],
  tradeoffs: {
    advantages: ['Objective reliability signal', 'Enables error budgeting', 'Data-driven prioritization'],
    disadvantages: ['Wrong SLI optimizes wrong thing', 'Measurement cost and cardinality', 'Gaming metrics possible'],
    alternatives: ['Qualitative user surveys only — slow feedback'],
    whenToUse: ['Any production service with SLO program', 'Before defining SLA'],
    whenNotToUse: ['Prototype with no users — premature'],
  },
  failureModes: [
    'SLI on /health only — misses broken checkout',
    'Include 401 in availability — inflates false failures',
    'Too short window — noisy alerts',
    'Server-side latency only — ignores CDN/client delay',
    'High-cardinality labels explode metrics cost',
  ],
  production: {
    observability: ['RED metrics: Rate Errors Duration', 'Synthetic canaries for critical journeys'],
    reliability: ['SLI tied to alerting burn rates', 'Multi-window SLO compliance'],
    scalability: ['Aggregate SLI without per-user labels in hot path'],
    maintainability: ['SLI catalog documented per service', 'Review SLI when API changes'],
    cost: ['Sample traces for tail latency — not 100% always'],
  },
  interview: {
    expectations: ['Define availability SLI', 'p99 latency', 'Good vs total events'],
    commonQuestions: ['SLI for search service?', 'Exclude 404 from availability?'],
    followUps: ['Synthetic vs real traffic SLI?', 'Window length?'],
    misconceptions: ['CPU SLI equals user experience', 'Uptime ping equals availability'],
    traps: ['Measure only happy path lab traffic'],
    strongSignals: ['User-journey SLI', 'Exclude client fault documented', '28-day window + burn alerts'],
  },
  keyTakeaways: [
    'SLI = measured aspect of service quality over a window.',
    'Common SLIs: availability ratio, latency percentile, freshness.',
    'Measure what users experience — checkout not just health check.',
    'Document inclusions/exclusions (4xx handling).',
    'SLIs feed SLO targets and error budget calculations.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Example SLI for API?', answerHint: 'Ratio of successful requests (2xx within latency threshold) to valid total requests.' },
    { level: 'intermediate', question: 'Availability SLI exclude 404?', answerHint: 'Often yes for resource GET — 404 may be valid; document policy; do not exclude server 5xx.' },
    { level: 'advanced', question: 'SLI for async pipeline freshness?', answerHint: 'Time since last successful processing or lag between enqueue and completion p99.' },
  ],
  flashcards: [
    { front: 'SLI', back: 'Quantitative measure of service behavior' },
    { front: 'Availability SLI', back: 'Good events / total valid events in window' },
    { front: 'Latency SLI', back: 'Percentile of request duration vs threshold' },
    { front: 'Request-based SLI', back: 'Computed per user request outcome not time-based uptime ping' },
  ],
  quickRevision: [
    'Good/total ratio',
    'p99 latency',
    'User journey',
    '28-day window',
    'Feeds SLO',
  ],
}
