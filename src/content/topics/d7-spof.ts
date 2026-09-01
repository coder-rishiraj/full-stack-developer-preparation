import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A Single Point of Failure (SPOF) is any component whose failure halts the entire system or critical path — one database without replica, lone load balancer, single DNS provider, one cron leader with no failover, or shared secret store with no backup.',
  whyExists:
    'Early systems optimize for simplicity: one server, one DB. At production scale, every unduplicated component becomes a lottery ticket for total outage. SPOF analysis systematically finds and eliminates these bottlenecks through redundancy, failover, and decomposition.',
  mentalModel:
    'Chain with one weak link: strong everywhere else still fails when the link snaps. Map the request path end-to-end — client, DNS, CDN, LB, app, cache, queue, DB, third-party — and ask "if this dies alone, does everything stop?"',
  howItWorks: [
    {
      type: 'table',
      headers: ['Common SPOF', 'Why hidden', 'Fix'],
      rows: [
        ['Single DB instance', 'App scaled but DB not', 'Replicas, multi-AZ, failover'],
        ['One Redis node', 'Cache assumed optional until stampede', 'Redis Cluster / Sentinel'],
        ['Lone load balancer', 'Forgotten below app tier', 'Active-active LBs or managed LB'],
        ['Single region', 'Multi-AZ feels enough', 'Multi-region DR for regional disasters'],
        ['Central cron / scheduler', 'Only one runs jobs', 'Leader election, partitioned workers'],
        ['Third-party auth', 'Hard dependency', 'Cached JWKS, graceful degradation policy'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'SPOF in request path',
      diagram: `flowchart TB
  User --> DNS[DNS SPOF?]
  DNS --> CDN[CDN]
  CDN --> LB[Single LB SPOF]
  LB --> App[Multi instance OK]
  App --> Redis[(Single Redis SPOF)]
  App --> DB[(Single DB SPOF)]`,
    },
    {
      type: 'list',
      items: [
        'Architecture review: trace critical user journey for serial dependencies',
        'Chaos testing: kill each component in staging — observe blast radius',
        'Operational SPOFs: one person, one runbook, one deployment pipeline',
        'Accept SPOF consciously for low tiers with documented risk',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Outage postmortem: API had 20 pods across 2 AZs but single Redis for sessions. Redis host failure → all users logged out, rate limiter down, cache stampede collapsed DB. Fix: Redis Cluster 3 masters + replicas, session fallback to stateless JWT for read paths, rate limit degrade policy documented.',
    },
  ],
  tradeoffs: {
    advantages: ['Eliminating SPOF improves availability', 'Clear prioritization for infra investment'],
    disadvantages: ['Redundancy cost and complexity', 'Not every component worth duplicating', 'False confidence if correlated failures remain'],
    alternatives: ['Accept downtime for internal tools', 'Active-passive only on revenue path'],
    whenToUse: ['Production architecture review', 'Pre-launch checklist', 'Post-incident analysis'],
    whenNotToUse: ['Local dev environment'],
  },
  failureModes: [
    'Redundant apps but single DB — classic SPOF',
    'Multi-AZ app but single-AZ database',
    'Failover exists but untested — effective SPOF',
    'Shared config/deployment pipeline kills all replicas',
    'Monitoring itself is SPOF — blind during outage',
  ],
  production: {
    reliability: ['SPOF audit per critical journey', 'Chaos kills single components regularly'],
    scalability: ['Eliminate serial bottlenecks not just crash SPOFs'],
    observability: ['Dependency graph with redundancy status', 'Game day results tracked'],
    maintainability: ['Architecture diagrams updated when SPOF removed'],
    cost: ['Prioritize SPOF removal by revenue and SLA tier'],
  },
  interview: {
    expectations: ['Identify SPOF in diagram', 'Fix with redundancy/failover', 'Hidden SPOF examples'],
    commonQuestions: ['SPOF in this design?', 'Redis single node risk?'],
    followUps: ['Operational SPOFs?', 'Third-party dependency?'],
    misconceptions: ['Multi-instance app means no SPOF', 'Cloud managed equals no SPOF'],
    traps: ['Miss DB while scaling stateless tier'],
    strongSignals: ['End-to-end path trace', 'Chaos validation', 'Tiered acceptance of risk'],
  },
  keyTakeaways: [
    'SPOF = one failure stops the system or critical path.',
    'Trace full path: DNS → CDN → LB → app → cache → DB → vendor.',
    'Scaled app tier with single DB/Redis is the classic miss.',
    'Redundancy + tested failover removes SPOF.',
    'Some SPOFs accepted for low tiers — document explicitly.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Example SPOF?', answerHint: 'Single database instance with no replica — its failure stops all writes.' },
    { level: 'intermediate', question: 'App highly available but outages continue — why?', answerHint: 'Hidden SPOF: Redis, LB, DNS, queue, or deployment pipeline; trace serial dependencies.' },
    { level: 'advanced', question: 'Third-party payment provider as SPOF?', answerHint: 'Queue async payments, multiple providers, circuit breaker, clear degraded mode, SLA with vendor, reconcile on recovery.' },
  ],
  flashcards: [
    { front: 'SPOF', back: 'Component whose failure halts system or critical path' },
    { front: 'Hidden SPOF', back: 'Redis, cron, DNS, LB overlooked while app scales' },
    { front: 'SPOF audit', back: 'Trace user journey listing serial single components' },
    { front: 'Effective SPOF', back: 'Redundancy exists but failover untested or broken' },
  ],
  quickRevision: [
    'Trace full path',
    'DB Redis DNS LB',
    'Redundancy + test',
    'Chaos validate',
    'Tier risk accept',
  ],
}
