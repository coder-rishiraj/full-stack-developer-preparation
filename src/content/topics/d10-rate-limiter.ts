import type { TopicContent } from '@/domain/types'

export const rateLimiterContent: TopicContent = {
  whatIsIt:
    'A rate limiter controls how many requests a client (user, IP, API key, tenant) may make in a time window, protecting services from abuse, overload, and noisy neighbors.',
  whyExists:
    'Without limits, a single client can exhaust CPU, DB connections, or inventory flash-sale capacity. Limits also enforce product tiers and reduce brute-force auth attacks.',
  mentalModel:
    'Each identity has a budget of tokens or slots that refill over time. A request consumes budget; if empty, reject (429) or queue/delay. Algorithms differ in burst behavior and fairness.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Common algorithms: fixed window counter, sliding window log/counter, token bucket, leaky bucket. Distributed limiters store counters in Redis (or similar) so all app instances share state.',
    },
  ],
  keyTakeaways: [
    'Pick algorithm based on burst vs smooth traffic needs.',
    'Distributed limiters need shared atomic state (Redis).',
    'Fail-open vs fail-closed is an explicit reliability choice.',
    'Return 429 + Retry-After; make clients idempotent.',
    'Evolve: in-memory → Redis token bucket → per-route policies + observability.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why rate limit?',
      answerHint: 'Protect capacity, fairness, security, monetization.',
    },
    {
      level: 'intermediate',
      question: 'Token bucket vs fixed window?',
      answerHint: 'Bucket allows controlled bursts; fixed window has boundary spikes.',
    },
    {
      level: 'advanced',
      question: 'How do you rate limit consistently across regions?',
      answerHint: 'Central store vs regional limits + global async reconciliation; accept approximate.',
    },
  ],
  flashcards: [
    {
      front: 'HTTP status for rate limit',
      back: '429 Too Many Requests; often Retry-After header',
    },
    {
      front: 'Redis rate limit primitive',
      back: 'INCR+EXPIRE, or Lua/token-bucket script for atomicity',
    },
  ],
  quickRevision: [
    'Algorithms: fixed window, sliding window, token/leaky bucket',
    'Identity: IP / user / API key / tenant',
    'Redis for multi-instance atomic counters',
    '429 + Retry-After; idempotent clients',
    'Fail-open vs fail-closed under Redis outage',
    'Observe: limited QPS, top offenders, false positives',
  ],
  systemDesign: {
    problem:
      'Design a rate limiting service that enforces per-client quotas for a large HTTP API (e.g., booking and payment endpoints) with low latency and predictable behavior under flash-sale load.',
    requirements: {
      functional: [
        'Limit requests per identity per policy (e.g., 100/min)',
        'Support multiple policies per route',
        'Return allow/deny with remaining quota metadata',
        'Admin can configure limits',
      ],
      nonFunctional: [
        'p99 decision latency < 5–10ms in-region',
        'Correct enough under failure (define fail-open/closed)',
        'Horizontally scalable with app fleet',
        'Observable (metrics, logs, traces)',
      ],
    },
    scaleAssumptions: [
      '50k peak RPS globally',
      '10M unique API keys / day',
      'Policies mostly 1-minute windows',
    ],
    capacityEstimates: [
      '50k RPS × 200 bytes Redis op ≈ ~10 MB/s network to Redis cluster (order-of-magnitude)',
      'Counters: millions of keys with TTL ≈ memory dominated by key overhead; shard Redis',
      'Local decision path must avoid remote call fan-out per middleware hop if possible',
    ],
    api: [
      {
        type: 'code',
        language: 'http',
        caption: 'Middleware-facing check (conceptual)',
        code: `POST /v1/check
{ "key": "user:42", "policy": "booking_write", "cost": 1 }
→ 200 { "allowed": true, "remaining": 17, "resetMs": 420 }
→ 429 { "allowed": false, "retryAfterMs": 420 }`,
      },
    ],
    dataModel: [
      {
        type: 'list',
        items: [
          'Policy: id, algorithm, limit, window, burst',
          'Redis key: rl:{policy}:{identity} → counter or bucket state',
          'Optional audit stream for blocked requests',
        ],
      },
    ],
    highLevelArchitecture: [
      {
        type: 'paragraph',
        text: 'API gateway or service middleware calls a RateLimiter component. The component uses Redis for shared counters. Config lives in DB/cache. Metrics exported to Prometheus.',
      },
    ],
    diagram: {
      mermaid: `flowchart LR
  Client --> GW[API Gateway / Service]
  GW --> RL[Rate Limiter Lib]
  RL --> Redis[(Redis Cluster)]
  RL -->|deny 429| Client
  RL -->|allow| App[Business Logic]
  App --> PG[(PostgreSQL)]`,
      caption: 'Inline limiter with shared Redis',
    },
    dataFlow: [
      'Request arrives with auth identity',
      'Resolve policy for route + tenant',
      'Atomic Redis script: consume tokens / incr window',
      'Allow → proceed; Deny → 429 with Retry-After',
    ],
    storage: [
      'Redis: hot counters with TTL',
      'Postgres/config service: policy definitions',
    ],
    caching: [
      'Cache policy configs in-process with short TTL',
      'Optional local token bucket that syncs to Redis periodically (approximate)',
    ],
    asyncProcessing: [
      'Emit rate-limit events to Kafka for analytics / abuse detection (not on critical path)',
    ],
    scaling: [
      'Redis Cluster sharding by key',
      'Avoid single global lock',
      'Regional Redis with regional limits if multi-region',
    ],
    consistency: [
      'Strong consistency within a Redis key via atomic Lua/INCR',
      'Cross-region: usually eventual / partitioned budgets',
    ],
    reliability: [
      'Circuit-break Redis: choose fail-open (availability) or fail-closed (safety)',
      'Timeouts on Redis calls; never hang the request thread indefinitely',
    ],
    failureScenarios: [
      'Redis down → degrade per policy',
      'Hot key (celebrity user) → isolate or hierarchical limits',
      'Clock skew affects window boundaries — prefer token bucket with monotonic Redis TIME',
    ],
    security: [
      'Do not trust client-supplied identity; bind to auth',
      'Protect admin config APIs',
      'Rate limit auth endpoints aggressively',
    ],
    observability: [
      'allowed/denied counters by policy',
      'Redis latency histograms',
      'Top limited keys (careful with cardinality)',
    ],
    bottlenecks: [
      'Redis RTT on every request',
      'Hot keys',
      'Overly fine-grained identities exploding key count',
    ],
    alternatives: [
      'Envoy/API gateway native rate limits',
      'Leaky bucket at load balancer',
      'Quota service sidecar',
    ],
    tradeoffs: [
      'Accuracy vs latency (local approx vs Redis exact)',
      'Fail-open (abuse risk) vs fail-closed (outage amplification)',
      'Fixed window simplicity vs boundary burst spikes',
    ],
    interviewFollowUps: [
      'How to limit based on request cost weights?',
      'How to support sliding window without huge memory?',
      'Design for multi-tenant fairness?',
    ],
    evolution: [
      {
        stage: '1. Simple design',
        description: 'In-process fixed window counter per instance.',
        bottleneck: 'Limits not shared across instances → effective limit × N pods.',
      },
      {
        stage: '2. Improve',
        description: 'Move counters to Redis INCR + EXPIRE.',
        bottleneck: 'Fixed window burst at boundaries; hot keys.',
      },
      {
        stage: '3. Improve',
        description: 'Token bucket via Redis Lua; per-route policies; Retry-After.',
        bottleneck: 'Redis latency; regional drift.',
      },
      {
        stage: '4. Scale further',
        description:
          'Local burst allowance + async reconciliation; gateway enforcement; abuse analytics pipeline.',
        bottleneck: 'Operational complexity; approximate global fairness.',
      },
    ],
  },
  tradeoffs: {
    advantages: ['Protects downstream', 'Enables fair multi-tenant APIs', 'Cheap vs scaling DB'],
    disadvantages: ['False positives hurt UX', 'Distributed accuracy is hard', 'Extra dependency (Redis)'],
    alternatives: ['Admission control / load shedding', 'Auto-scaling alone (insufficient vs abuse)'],
    whenToUse: ['Public APIs', 'Auth endpoints', 'Flash-sale writes'],
    whenNotToUse: ['Internal trusted health checks without separate budget'],
  },
  failureModes: [
    'Misconfigured limits locking out all users',
    'Fail-closed during Redis blip causing total outage',
    'NAT shared IPs punished together',
  ],
  production: {
    performance: ['Keep Redis in same AZ; pipeline where safe'],
    scalability: ['Shard by identity hash'],
    reliability: ['Explicit degraded mode'],
    security: ['Authenticate before trusting user-id buckets'],
    observability: ['SLO on limiter error rate and latency'],
    cost: ['Redis memory for high-cardinality keys'],
  },
  interview: {
    expectations: [
      'Walk evolution, not only final diagram',
      'Compare algorithms with burst behavior',
      'Discuss Redis atomicity and failure modes',
    ],
    commonQuestions: ['Design a rate limiter', 'Token bucket explanation'],
    followUps: ['Distributed exactness?', 'How to rate limit streaming connections?'],
    misconceptions: ['Load balancer QPS limits replace app quotas'],
    traps: ['Ignoring multi-instance inconsistency'],
    strongSignals: ['Mentions 429, Retry-After, fail-open/closed, hot keys'],
  },
}

/** Phase 4 registry export */
export const content = rateLimiterContent
