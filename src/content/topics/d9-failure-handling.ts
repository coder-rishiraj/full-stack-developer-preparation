import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Failure handling in system design interviews covers how the architecture survives dependency outages, partial failures, overload, and data corruption — timeouts, retries, circuit breakers, bulkheads, degradation tiers, idempotency, and DR — tied to specific components in your diagram.',
  whyExists:
    'Happy-path diagrams fail real interviews. Interviewers explicitly ask "what if Redis dies?" Failure section shows operational maturity — not bolt-on afterthought but woven into API, data, and async paths from the start.',
  mentalModel:
    'Fire drills for each room in the building. Every arrow in your diagram gets a "what if this breaks?" answer: detect, contain, recover, degrade. Critical paths get stronger medicine than analytics.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Failure', 'Interview response', 'Component'],
      rows: [
        ['DB slow', 'Timeout, CB, cache stale read', 'API → DB'],
        ['Redis down', 'Fallback to DB + rate limit; shed non-critical', 'Session/cache'],
        ['Queue backlog', 'Scale consumers, DLQ, alert lag SLO', 'Async workers'],
        ['AZ loss', 'Multi-AZ failover, health checks', 'Infra'],
        ['Duplicate delivery', 'Idempotency keys', 'Payment consumer'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Degradation tiers',
      diagram: `flowchart TB
  Full[Full features] --> Degraded[Degraded cached/stale]
  Degraded --> Core[Core only checkout]
  Core --> Outage[Graceful 503 + status page]`,
    },
    {
      type: 'list',
      items: [
        'Spend 5 min after HLD — walk 3–4 failure scenarios interviewer picks',
        'Never infinite retry — backoff + cap + circuit breaker',
        'Define degradation: feed stale OK, payment not',
        'Multi-AZ minimum mention for tier-1 services',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Search dependency down: browse uses cached catalog + "search unavailable" banner; checkout unaffected via separate path. Payment gateway timeout 2s → retry idempotent 2× → circuit open → queue order for async capture with user notified. Redis loss: reconstruct session from JWT; rate limit fail-closed on auth endpoints.',
    },
  ],
  tradeoffs: {
    advantages: ['Shows production readiness', 'Prioritizes reliability investment'],
    disadvantages: ['Time away from feature design', 'Over-engineering failure paths'],
    alternatives: ['Single paragraph — weak signal'],
    whenToUse: ['Every HLD interview closing section', 'When interviewer probes "what if"'],
    whenNotToUse: ['Never skip entirely'],
  },
  failureModes: [
    'No timeout on any external call in design',
    'Retry storm on recovery',
    'Same degradation for payment and analytics',
    'No idempotency on async payment',
    'Single AZ with no mention of AZ failure',
  ],
  production: {
    reliability: ['CB, bulkhead, multi-AZ in narrative', 'Game days'],
    observability: ['Alert on dependency error budget burn'],
    scalability: ['Load shed before total collapse'],
  },
  interview: {
    expectations: ['3+ scenarios', 'Timeout/retry/CB', 'Tiered degradation'],
    commonQuestions: ['Redis dies?', 'AZ failure?', 'Payment duplicate?'],
    followUps: ['Metastable failure?', 'Split brain?'],
    misconceptions: ['More redundancy eliminates need for failure logic'],
    traps: ['Hang without timeout'],
    strongSignals: ['Feature-tier degradation matrix', 'Idempotency + DLQ', 'Multi-AZ + failover'],
  },
  keyTakeaways: [
    'Every dependency: timeout, retry policy, circuit breaker.',
    'Tiered degradation — protect revenue path first.',
    'Idempotency for async and payment retries.',
    'Multi-AZ + replication for infra failures.',
    '5 min failure walkthrough before interview ends.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'DB slow — API response?', answerHint: 'Timeout, circuit breaker, serve cache if acceptable, 503 with Retry-After if not.' },
    { level: 'intermediate', question: 'Prevent retry storm?', answerHint: 'Exponential backoff + jitter, cap retries, circuit breaker, Retry-After respect.' },
    { level: 'advanced', question: 'Design failure handling for flash sale?', answerHint: 'Queue checkout, shed browse, rate limit, idempotent orders, multi-AZ DB, preload cache, status page.' },
  ],
  flashcards: [
    { front: 'Circuit breaker', back: 'Stop calling failing dependency after threshold' },
    { front: 'Bulkhead', back: 'Isolate pools so one failure does not drain all' },
    { front: 'Graceful degradation', back: 'Reduced features vs total outage' },
    { front: 'Idempotency in failures', back: 'Safe retries without duplicate side effects' },
  ],
  quickRevision: [
    'Timeout all deps',
    'CB + bulkhead',
    'Tier degrade',
    'Idempotent writes',
    'Multi-AZ',
  ],
}
