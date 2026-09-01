import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Error rate is the fraction of requests that fail — typically HTTP 5xx, timeouts, or business failures marked as errors. SLI for availability: error rate = failed requests / total requests. Alert on burn rate against SLO budget, not single blips.',
  whyExists:
    'Success average latency looks fine while 1% errors destroy trust for affected users. Error rate quantifies reliability. SRE SLOs often target 99.9% availability — error budget is 0.1% failures per month.',
  mentalModel:
    'Defect rate on assembly line. Out of 1000 packages, 3 damaged = 0.3% error rate. Track trend; spike triggers incident. Separate client errors (4xx) from server faults (5xx) for SLI.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Counter http_server_requests with label status=500 increment errors.',
        'SLI: 1 - (5xx + timeout) / total valid requests.',
        'Exclude deliberate 404 from availability SLI if not user-facing miss.',
        'Multi-window burn alerts: fast burn pages, slow burn ticket.',
        'Error budget policy: freeze features when budget exhausted.',
      ],
    },
    {
      type: 'table',
      headers: ['Availability', 'Max error rate/month', 'Downtime/month approx'],
      rows: [
        ['99%', '1%', '~7.2 hours'],
        ['99.9%', '0.1%', '~43 minutes'],
        ['99.99%', '0.01%', '~4.3 minutes'],
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'SLO 99.9% monthly. Error rate jumps from 0.05% to 2% for 15 minutes — fast burn alert pages on-call. Dashboard shows payment dependency 503 driving spike; circuit breaker opens and error rate falls.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Prometheus: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(...)).',
        'Spring Actuator /actuator/metrics http.server.requests by outcome.',
        'Synthetic probes complement real traffic error rate.',
        'Partial failures: batch API 207 — define SLI explicitly.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Clear reliability KPI', 'SLO-driven prioritization', 'User-impact focused'],
    disadvantages: ['Definition debates (4xx? timeouts?)', 'Low traffic noisy rates', 'Regional aggregation hides locale outage'],
    alternatives: ['Uptime ping only — misses functional errors', 'Log error count — lagging'],
    whenToUse: ['Every user-facing service SLO', 'Dependency health dashboards'],
    whenNotToUse: ['Batch jobs — use success/failure job count instead'],
  },
  failureModes: [
    'Include 401 in SLI — false availability hit',
    'Denominator includes health checks inflating success',
    'Single global rate hides one tenant 100% fail',
    'Alert on absolute count not rate — noisy at low traffic',
    'Ignore client timeout as error — missing user pain',
  ],
  production: {
    observability: ['SLO dashboard with error budget remaining', 'Burn rate alerts multi-window'],
    reliability: ['Error budget policy in team agreement', 'Exclude synthetic canary from SLI or separate'],
    maintainability: ['Document SLI definition in runbook'],
  },
  interview: {
    expectations: ['Error rate formula', 'SLO 99.9 meaning', '5xx vs 4xx in SLI'],
    commonQuestions: ['Define availability SLI?', 'Alert on errors how?'],
    followUps: ['Error budget?', 'Multi-window burn?'],
    misconceptions: ['Zero errors achievable at scale', 'All 4xx are errors for SLI'],
    traps: ['Availability = ping only'],
    strongSignals: ['SLO math', 'Burn rate alert', 'Exclude client errors from SLI'],
  },
  keyTakeaways: [
    'Error rate = failed / total requests — core availability SLI.',
    'SLO 99.9% allows 0.1% errors — finite error budget.',
    'Alert on budget burn rate not single error.',
    '5xx and timeouts in SLI; usually exclude expected 4xx.',
    'Dashboard error rate by dependency and route.',
  ],
  interviewQuestions: [
    { level: 'basic', question: '99.9% availability meaning?', answerHint: '0.1% requests can fail monthly — ~43 min equivalent downtime.' },
    { level: 'intermediate', question: 'Include 404 in error rate SLI?', answerHint: 'Usually no for resource miss; define SLI for valid user operations only.' },
    { level: 'advanced', question: 'Multi-window burn alert?', answerHint: 'Fast window catches sudden spike; slow window catches gradual leak — both consume budget.' },
  ],
  flashcards: [
    { front: 'Error budget', back: 'Allowed unreliability before SLO breach — 1 - SLO target' },
    { front: 'Burn rate', back: 'Speed of error budget consumption vs sustainable rate' },
    { front: 'SLI', back: 'Service Level Indicator — measured metric like success rate' },
  ],
  quickRevision: [
    'Errors / total',
    'SLO error budget',
    '5xx in SLI',
    'Burn rate alerts',
    'Not all 4xx',
  ],
}
