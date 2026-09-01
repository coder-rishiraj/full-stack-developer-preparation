import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Availability is the proportion of time a system correctly responds to requests within SLA — often expressed as “nines” (99.9%, 99.99%). In distributed systems, availability trades off with consistency during failures and requires redundancy, failover, and graceful degradation.',
  whyExists:
    'Downtime costs revenue, trust, and safety (payments, healthcare). Availability engineering makes uptime explicit: measure it (SLI/SLO), design for component failure, and avoid single points of failure instead of hoping nothing breaks.',
  mentalModel:
    'Availability = uptime / (uptime + downtime). Serial components multiply failure; parallel redundancy adds availability (with caveats). During partition or dependency outage, choose degrade features vs full outage. Error budget drives release velocity vs reliability work.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Nine', 'Downtime/year (approx)', 'Typical target'],
      rows: [
        ['99% (2 nines)', '3.65 days', 'Internal tools'],
        ['99.9% (3 nines)', '8.76 hours', 'B2B SaaS'],
        ['99.99% (4 nines)', '52.6 minutes', 'Payments, core API'],
        ['99.999% (5 nines)', '5.26 minutes', 'Telco, critical infra'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Parallel redundancy improves availability',
      diagram: `flowchart TB
  LB[Load Balancer]
  LB --> A[App AZ-a]
  LB --> B[App AZ-b]
  A --> DBp[(Primary)]
  B --> DBp
  DBp --> DBs[(Sync replica)]`,
    },
    {
      type: 'list',
      items: [
        'Eliminate SPOF: multi-AZ, replicas, health checks',
        'Failover: automatic (leader election) vs manual runbook',
        'Graceful degradation: read-only mode, cached responses, feature flags',
        'Measure: SLI = successful requests / total; SLO = target over window',
        'Blast radius: isolate failures (bulkheads, circuit breakers)',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Checkout API target 99.95% monthly. SLI: ratio of non-5xx responses under 500ms. If error budget burns on bad deploy, freeze releases and fix reliability. Payment provider down → circuit breaker returns “pay later” banner instead of 500 for entire site.',
    },
    {
      type: 'code',
      language: 'text',
      caption: 'Serial vs parallel availability math',
      code: `Two serial components each 99.9% → 0.999 × 0.999 ≈ 99.8% combined
Two parallel identical paths each 99.9% → 1 - (0.001)² ≈ 99.9999% (if truly independent)`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Clear SLO language aligns product and engineering',
      'Redundancy survives AZ/ node loss',
      'Degradation preserves core user journeys',
    ],
    disadvantages: [
      'Higher cost (2× infra, cross-AZ traffic)',
      'Complex failover can cause split-brain if wrong',
      'Chasing nines beyond business need wastes effort',
    ],
    alternatives: [
      'Active-passive vs active-active multi-region',
      'Scheduled maintenance vs always-on (lower nines OK)',
    ],
    whenToUse: [
      'Defining SLAs for customer-facing APIs',
      'Architecture reviews for SPOF',
      'Incident response and error budget policy',
    ],
    whenNotToUse: [
      'Batch analytics where delay OK — optimize cost not nines',
    ],
  },
  failureModes: [
    'Health check passes but app broken (superficial probe)',
    'Failover slower than client timeout → perceived outage',
    'Cascade failure when retries overwhelm recovering service',
    'Shared dependency (DNS, identity) becomes hidden SPOF',
  ],
  production: {
    reliability: ['Multi-AZ deployment', 'Automated failover with fencing', 'Chaos/game days'],
    scalability: ['Load spread avoids single node overload masking as “up”'],
    observability: ['SLI dashboards, burn-rate alerts', 'Synthetic probes from multiple regions'],
    cost: ['Right-size nines to revenue impact'],
  },
  interview: {
    expectations: [
      'Define availability and nines',
      'Serial/parallel math sketch',
      'SPOF elimination + degradation story',
    ],
    commonQuestions: [
      'How achieve 99.99%?',
      'Difference SLA vs SLO?',
      'What happens when DB primary dies?',
    ],
    followUps: [
      'Active-active vs active-passive?',
      'Error budget concept?',
    ],
    misconceptions: [
      'Uptime = availability without latency/correctness',
      'More replicas always linearly increase availability',
    ],
    traps: [
      'Ignoring dependency availability in calculation',
    ],
    strongSignals: [
      'Circuit breaker + graceful degradation',
      'Multi-AZ with health-checked LB',
    ],
  },
  keyTakeaways: [
    'Availability = fraction of time system usable per SLA definition.',
    'Nines table: 3 nines ≈ 8.76 h/year downtime.',
    'Serial components reduce combined availability.',
    'Redundancy + failover + degradation raise availability.',
    'Measure with SLI/SLO and manage error budget.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is 99.9% availability?', answerHint: '~8.76 hours downtime per year.' },
    { level: 'intermediate', question: 'SLI vs SLO vs SLA?', answerHint: 'SLI=metric; SLO=internal target; SLA=contract with customer penalties.' },
    { level: 'advanced', question: 'Design for AZ failure?', answerHint: 'Multi-AZ LB, stateless apps, replicated DB with auto failover, rehearsed runbooks.' },
  ],
  flashcards: [
    { front: '3 nines', back: '99.9% ≈ 8.76 h downtime/year' },
    { front: 'SLI', back: 'Measured indicator e.g. success rate/latency' },
    { front: 'Error budget', back: 'Allowed unreliability before slowing feature ship' },
    { front: 'Graceful degradation', back: 'Partial features vs full outage' },
  ],
  quickRevision: [
    'Nines downtime math',
    'Remove SPOF',
    'Multi-AZ + LB',
    'Circuit breakers',
    'SLI/SLO/error budget',
  ],
  systemDesign: {
    problem: 'Design a highly available public REST API (e-commerce catalog + cart) targeting 99.95% availability monthly.',
    requirements: {
      functional: ['Browse products', 'Add to cart', 'View cart'],
      nonFunctional: ['99.95% availability', 'p99 read < 200ms', 'Survive single AZ loss', 'Graceful degradation if recommendations down'],
    },
    scaleAssumptions: ['10k RPS peak reads', '500 RPS writes', '2 AZs minimum'],
    capacityEstimates: ['Stateless app: 20 pods per AZ', 'Cart in Redis cluster multi-AZ'],
    api: [{ type: 'code', language: 'http', code: `GET /products\nGET /cart\nPOST /cart/items` }],
    dataModel: [{ type: 'list', items: ['Product catalog (read-heavy, cacheable)', 'Cart session in Redis with TTL'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'Global LB → app pods in 2 AZs → Redis for cart → Postgres primary+sync replica. CDN for static catalog.' }],
    diagram: {
      mermaid: `flowchart TB
  CDN --> LB
  LB --> App1[App AZ-a]
  LB --> App2[App AZ-b]
  App1 --> Redis[(Redis MS)]
  App2 --> Redis
  App1 --> PG[(PG primary/replica)]`,
      caption: 'Multi-AZ stateless tier + replicated state',
    },
    dataFlow: ['Read: CDN cache hit or app → replica OK', 'Cart write: Redis primary with replica', 'AZ loss: LB drains unhealthy targets'],
    storage: ['Postgres sync replica; promote on primary failure', 'Redis sentinel/cluster failover'],
    caching: ['CDN + app cache for catalog; cart not cached publicly'],
    asyncProcessing: ['Optional recommendation service — failure non-blocking'],
    scaling: ['HPA on CPU/RPS', 'Read replicas for catalog DB'],
    consistency: ['Cart strong per user session in Redis', 'Catalog eventual on replica OK for browse'],
    reliability: ['Health checks: deep probe on /health/db', 'Circuit breaker to recommendations'],
    failureScenarios: ['AZ outage: survive on half capacity', 'Redis failover: brief cart errors → retry', 'DB primary down: promote replica ~minutes'],
    security: ['TLS termination at LB', 'Rate limit auth endpoints'],
    observability: ['SLI: availability + latency burn alerts', 'Synthetic checks per AZ'],
    bottlenecks: ['Redis hot key sessions', 'Thundering herd on cold cache'],
    alternatives: ['Active-active multi-region (complex)'],
    tradeoffs: ['99.95% vs cost of triple AZ + multi-region', 'Sync replica lag vs RPO'],
    interviewFollowUps: ['Calculate allowed downtime for 99.95%/month', 'What if entire region lost?'],
    evolution: [
      { stage: '1. Simple design', description: 'Single AZ monolith.', bottleneck: 'AZ outage = total downtime.' },
      { stage: '2. Improve', description: 'Multi-AZ LB + DB replica.', bottleneck: 'Manual failover slow.' },
      { stage: '3. Improve', description: 'Auto failover, Redis HA, CDN, circuit breakers.', bottleneck: 'Regional disaster.' },
      { stage: '4. Scale further', description: 'Multi-region active-passive, global DNS, error budget process.', bottleneck: 'Cost and complexity.' },
    ],
  },
}
