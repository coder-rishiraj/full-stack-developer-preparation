import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Load shedding deliberately drops or rejects low-priority work when a system is overloaded — returning 503, serving degraded responses, or skipping optional features — so critical paths stay healthy. It protects the majority by sacrificing the tail under pressure.',
  whyExists:
    'Under overload, queues grow, threads block, and everything fails together (metastable failure). Without shedding, a traffic spike or slow dependency causes total collapse. Shedding caps work in flight and preserves capacity for tier-1 operations like checkout and auth.',
  mentalModel:
    'Lifeboat capacity: when the ship lists, non-essential cargo goes overboard so passengers (critical requests) survive. Admission control at the door beats everyone drowning inside a full queue.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Technique', 'Behavior', 'When'],
      rows: [
        ['Request rejection', '503 + Retry-After on overload', 'Queue depth or CPU threshold'],
        ['Priority tiers', 'Drop batch/analytics; keep checkout', 'Always under stress'],
        ['Concurrency limits', 'Max in-flight per dependency', 'Prevent pool exhaustion'],
        ['Adaptive shedding', 'Shed % rises with latency SLO burn', 'Automated SLO-driven'],
        ['Graceful degradation', 'Cached/stale response vs hard fail', 'Read-heavy paths'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Priority-based shedding',
      diagram: `flowchart TB
  Req[Incoming requests] --> Classify[Classify priority]
  Classify -->|P0 checkout| Admit[Always admit]
  Classify -->|P1 browse| Queue[Limited queue]
  Classify -->|P2 analytics| Shed[Drop or 503]
  Admit --> Serve[Healthy core path]
  Queue -->|full| Shed`,
    },
    {
      type: 'list',
      items: [
        'Shed at edge (API gateway) before inner services saturate',
        'Signal overload clearly: 503 + Retry-After, not slow hang',
        'Combine with bulkheads so one tenant cannot exhaust pools',
        'Monitor shed rate — sustained shedding means need scale or fix root cause',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Flash sale: checkout API never shed. Recommendation and analytics endpoints return 503 when CPU > 85% or p99 latency > 2s. Gateway enforces global concurrency cap of 5k in-flight. Clients backoff on Retry-After. Core payment path stays under 200ms p99 while browse shows cached catalog.',
    },
  ],
  tradeoffs: {
    advantages: ['Prevents total outage', 'Protects critical revenue paths', 'Buys time to scale or fix root cause'],
    disadvantages: ['Degraded UX for shed traffic', 'Tuning thresholds is hard', 'Wrong priority mapping angers users'],
    alternatives: ['Unlimited queue — risks metastable collapse', 'Scale only — may lag spike'],
    whenToUse: ['Any system with tiered SLAs', 'Flash crowds', 'Dependency slowdown'],
    whenNotToUse: ['Safety-critical systems where drop is unacceptable — use queue with SLA instead'],
  },
  failureModes: [
    'Shedding critical path by misconfigured priority',
    '503 without Retry-After → retry storm amplifies load',
    'Shedding too late — already in metastable failure',
    'No visibility into shed rate — silent user impact',
    'Shed at wrong layer — inner service still overloaded',
  ],
  production: {
    performance: ['Fast reject path — no expensive work before shed decision'],
    scalability: ['Autoscale triggered before shed when possible; shed as backstop'],
    reliability: ['Tier definitions documented with product', 'Bulkheads per dependency'],
    observability: ['Shed count by tier and endpoint', 'SLO burn correlation', 'Queue depth metrics'],
    security: ['Do not shed auth for sensitive ops — fail closed instead'],
    cost: ['Cheaper than over-provisioning for rare peaks if shed tier acceptable'],
  },
  interview: {
    expectations: ['503 vs queue', 'Priority tiers', 'Metastable failure'],
    commonQuestions: ['System overloaded — what do you drop?', 'Load shed vs rate limit?'],
    followUps: ['Retry-After behavior?', 'Detect overload signal?'],
    misconceptions: ['Shedding equals failure — it can be graceful degradation', 'Scale always beats shedding'],
    traps: ['Shed checkout to save recommendations'],
    strongSignals: ['Priority matrix with product', 'Gateway admission control', 'SLO-driven adaptive shed'],
  },
  keyTakeaways: [
    'Shed low-priority work to save critical paths under overload.',
    'Reject fast with 503 + Retry-After — do not slow-drown everyone.',
    'Admission control at edge beats deep queue buildup.',
    'Metastable failure: recovery harder than prevention — shed early.',
    'Measure shed rate and tie thresholds to SLO burn.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Load shedding vs rate limiting?', answerHint: 'Rate limit caps steady rate per client; shedding drops work when system overloaded regardless of client fairness.' },
    { level: 'intermediate', question: 'What to shed in e-commerce spike?', answerHint: 'Keep checkout/payment; shed recommendations, analytics, heavy search; serve cached browse.' },
    { level: 'advanced', question: 'Metastable failure and shedding?', answerHint: 'System stays broken after load drops because queues/retries keep it saturated — shed + backoff breaks the loop.' },
  ],
  flashcards: [
    { front: 'Load shedding', back: 'Drop low-priority requests under overload to protect core' },
    { front: 'Metastable failure', back: 'System remains degraded after trigger load removed' },
    { front: 'Admission control', back: 'Limit in-flight work before accepting more requests' },
    { front: '503 + Retry-After', back: 'Signal overload so clients backoff instead of retry storm' },
  ],
  quickRevision: [
    'Priority tiers',
    'Fast 503 reject',
    'Edge admission',
    'Protect checkout',
    'SLO-driven thresholds',
  ],
}
