import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Failure modes in distributed systems are the ways components break under real-world conditions: node crashes, network partitions, slow nodes, clock skew, cascading overload, and partial failures. Designing for failure means assuming any of these can happen simultaneously — not if, but when.',
  whyExists:
    'Distributed systems multiply failure domains. A single slow replica can block sync replication; a partition causes split brain; retry storms amplify outages. Explicit failure modeling drives redundancy, timeouts, bulkheads, and graceful degradation instead of surprise total outages.',
  mentalModel:
    'Murphy\'s law at scale: everything fails all the time (Dr. Vogels). Classify failures — crash-stop, omission (lost messages), timing (slow), Byzantine (malicious) — and design detection, containment, recovery for each layer.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Failure', 'Symptom', 'Mitigation'],
      rows: [
        ['Node crash', 'Instance unreachable', 'Health checks, failover, replication'],
        ['Network partition', 'Split clusters', 'Quorum, fencing, CAP choice'],
        ['Slow node (straggler)', 'Tail latency spikes', 'Timeouts, hedged requests (careful), outlier detection'],
        ['Partial failure', 'Some requests fail randomly', 'Retries with backoff, circuit breakers'],
        ['Cascading failure', 'Overload spreads', 'Bulkheads, rate limits, load shedding'],
        ['Clock skew', 'LWW wrong order', 'Logical clocks, NTP monitoring, avoid clock trust'],
        ['Split brain', 'Dual leaders', 'Fencing tokens, epoch, STONITH'],
        ['Data corruption', 'Silent bit rot', 'Checksums, scrubbing, backups'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Cascading failure chain',
      diagram: `flowchart TB
  SlowDB[Slow DB] --> Pool[Connection pool exhausted]
  Pool --> API[API threads blocked]
  API --> Retry[Client retries amplify]
  Retry --> Down[Total outage]`,
    },
    {
      type: 'list',
      items: [
        'Fail fast: timeouts on every external call',
        'Bulkheads: separate pools for critical vs batch paths',
        'Circuit breaker: stop calling failing dependency',
        'Chaos engineering: inject failures in staging/prod carefully',
        'Graceful degradation: serve cached/stale vs hard fail',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Payment service calls fraud API with 200ms timeout. Fraud slow → without timeout, threads pile up → payment API 503 for everyone. Fix: timeout + circuit breaker + fallback "review later" path for non-blocking fraud score.',
    },
    {
      type: 'code',
      language: 'text',
      caption: 'Retry discipline',
      code: `Exponential backoff + jitter
Cap max retries
Only retry idempotent ops
Avoid retry storm on 503 — respect Retry-After
Kill switch to disable retries globally during incident`,
    },
  ],
  tradeoffs: {
    advantages: ['Proactive design reduces MTTR', 'Clear playbooks for on-call', 'Resilience testing validates assumptions'],
    disadvantages: ['Complexity and cost of redundancy', 'Fallback paths may violate strict correctness', 'Chaos tests risk if poorly scoped'],
    alternatives: ['Single-region simplicity accepting outage', 'Active-passive DR only'],
    whenToUse: ['Any multi-node production system', 'SLO-driven services'],
    whenNotToUse: ['Prototype where failure handling deferred consciously'],
  },
  failureModes: [
    'Missing timeouts → thread exhaustion',
    'Retry without jitter → synchronized retry spike',
    'Health check too weak → LB sends traffic to zombie node',
    'Failover without fencing → split brain data loss',
    'Ignoring partial write on crash',
    'Thundering herd after recovery',
  ],
  production: {
    reliability: ['Multi-AZ, replication, automated failover', 'Regular game days and restore drills'],
    scalability: ['Load shedding under pressure', 'Autoscale with cooldown to prevent flapping'],
    observability: ['RED/USE metrics, distributed tracing, SLO burn alerts', 'Partition and lag detectors'],
    security: ['Fail closed on auth outages for sensitive ops', 'Rate limit abuse during degradation'],
    maintainability: ['Runbooks per failure class', 'Blameless postmortems'],
    cost: ['DR standby vs active-active tradeoff'],
  },
  interview: {
    expectations: ['Name common distributed failures', 'Mitigations: CB, bulkhead, timeout', 'Split brain and partition'],
    commonQuestions: ['What happens when DB slow?', 'Design for AZ failure?'],
    followUps: ['Byzantine vs crash failure?', 'Chaos engineering value?'],
    misconceptions: ['More redundancy eliminates all failures', 'Retries always help'],
    traps: ['No timeout on internal RPC chain'],
    strongSignals: ['Cascading failure story', 'Fencing + quorum', 'Graceful degradation tiers'],
  },
  keyTakeaways: [
    'Partial and correlated failures are normal at scale.',
    'Timeouts, bulkheads, circuit breakers contain blast radius.',
    'Retries need backoff, jitter, and idempotency.',
    'Split brain and partitions need quorum + fencing.',
    'Test failures with chaos and game days.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Network partition example?', answerHint: 'AZs cannot talk; split cluster; CAP tradeoff.' },
    { level: 'intermediate', question: 'Prevent cascading failure?', answerHint: 'Timeouts, bulkheads, circuit breakers, load shed, limit retries.' },
    { level: 'advanced', question: 'Split brain after failover — prevention?', answerHint: 'Fencing token, STONITH, consensus epoch, only quorum can lead.' },
  ],
  flashcards: [
    { front: 'Partial failure', back: 'Some requests fail while system appears up' },
    { front: 'Circuit breaker', back: 'Stop calls to failing dependency after threshold' },
    { front: 'Bulkhead', back: 'Isolate resource pools so one failure does not drain all' },
    { front: 'Straggler', back: 'Slow replica/request inflates tail latency' },
  ],
  quickRevision: [
    'Everything fails',
    'Timeout everything',
    'CB + bulkhead + shed',
    'Retry idempotent + jitter',
    'Quorum + fence split brain',
  ],
  systemDesign: {
    problem: 'Harden a microservices e-commerce platform against AZ failure, slow dependencies, and retry storms without data loss on orders.',
    requirements: {
      functional: ['Browse, checkout, pay', 'Degraded browse if search down'],
      nonFunctional: ['Survive single AZ loss', 'Contain dependency slowness', 'No duplicate orders on retry'],
    },
    scaleAssumptions: ['20 services', '100k RPS browse', '2k checkout/s'],
    capacityEstimates: ['Multi-AZ K8s; each service own thread pool limits'],
    api: [{ type: 'paragraph', text: 'Existing REST; add Retry-After on 503; Idempotency-Key on checkout POST' }],
    dataModel: [{ type: 'list', items: ['Orders on HA Postgres', 'Idempotency store', 'Outbox events'] }],
    highLevelArchitecture: [
      { type: 'paragraph', text: 'Service mesh with timeouts/retries policy; bulkheads per dependency; circuit breakers; AZ-aware routing; order path CP on HA DB.' },
    ],
    diagram: {
      mermaid: `flowchart TB
  subgraph az_a [AZ-a]
    API1[Checkout]
  end
  subgraph az_b [AZ-b]
    API2[Checkout]
  end
  API1 --> PG[(Multi-AZ Postgres)]
  API2 --> PG
  API1 -->|timeout+CB| Fraud[Fraud svc]
  Search[Search] -.degraded.-> Browse[Browse fallback cache]`,
      caption: 'Multi-AZ with dependency isolation',
    },
    dataFlow: ['Happy path with strict timeouts', 'Degraded: cache browse if search CB open'],
    storage: ['HA DB + replicas'],
    caching: ['Stale-while-revalidate product cache on degradation'],
    asyncProcessing: ['Queue absorbs spike when sync path sheds load'],
    scaling: ['HPA with max cap to protect DB'],
    consistency: ['Strong order create; eventual search index'],
    reliability: ['AZ failover; idempotent checkout; chaos tests monthly'],
    failureScenarios: ['AZ loss', 'Fraud slow', 'Retry storm on recovery'],
    security: ['Fail closed payment if auth down'],
    observability: ['Golden signals per service; SLO dashboards; trace slow path'],
    bottlenecks: ['Shared DB connection pool'],
    alternatives: ['Monolith simpler failure surface'],
    tradeoffs: ['Degraded UX vs hard errors', 'Retry policy aggressiveness'],
    interviewFollowUps: ['Which paths degrade first?', 'Game day scenarios?'],
    evolution: [
      { stage: '1. Simple design', description: 'Monolith single AZ.', bottleneck: 'Any failure total.' },
      { stage: '2. Improve', description: 'Multi-AZ + replicas.', bottleneck: 'Slow dependency cascades.' },
      { stage: '3. Improve', description: 'CB, bulkhead, idempotency.', bottleneck: 'Complex tuning.' },
      { stage: '4. Scale further', description: 'Chaos program, tiered degradation, cell architecture.', bottleneck: 'Org coordination.' },
    ],
  },
}
