import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'API rate limiting caps request frequency per identity (API key, user, IP, tenant) to protect availability, ensure fair use, and enforce billing tiers. Returns 429 Too Many Requests with Retry-After header; algorithms include token bucket, sliding window, and fixed window counters.',
  whyExists:
    'One abusive or buggy client can exhaust DB connections, CPU, or partner quotas. Rate limits enforce SLA tiers (100 req/min free, 10k pro) and absorb flash crowds while keeping platform stable for others.',
  mentalModel:
    'Bouncer with clicker counting entries per minute. Token bucket allows smooth burst (capacity 100, refill 10/s). Distributed limiters use Redis INCR with TTL or dedicated services (Envoy, Kong, AWS WAF).',
  howItWorks: [
    {
      type: 'table',
      headers: ['Algorithm', 'Behavior', 'Use'],
      rows: [
        ['Fixed window', 'Count per clock minute', 'Simple; burst at window edges'],
        ['Sliding window log', 'Timestamp log per request', 'Accurate; memory heavy'],
        ['Sliding window counter', 'Weighted previous+current window', 'Good balance Redis'],
        ['Token bucket', 'Tokens refill at rate; burst up to capacity', 'Allows controlled bursts'],
        ['Leaky bucket', 'Smooth constant outflow', 'Strict smoothing'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Token bucket concept',
      diagram: `flowchart LR
  Refill[Refill 10 tokens/s] --> Bucket[Capacity 100 tokens]
  Req[Each request -1 token] --> Bucket
  Bucket -->|tokens>=1| Allow[200 OK]
  Bucket -->|tokens=0| Deny[429 Retry-After]`,
    },
    {
      type: 'list',
      items: [
        'Identify limit key: api_key > user > IP (careful shared NAT)',
        'Return headers: X-RateLimit-Limit, Remaining, Reset',
        '429 + Retry-After seconds',
        'Separate limits per endpoint cost (search vs health)',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Rate limit response',
      code: `HTTP/1.1 429 Too Many Requests
Retry-After: 12
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1692259320

{"error":"rate_limit_exceeded","message":"Try again in 12 seconds"}`,
    },
  ],
  tradeoffs: {
    advantages: ['Protects platform', 'Enforces commercial tiers', 'Mitigates abuse'],
    disadvantages: ['False positives shared IPs', 'Distributed counter consistency', 'Client backoff needed'],
    alternatives: ['Quota daily without per-second', 'Queue async for heavy ops only'],
    whenToUse: ['All public APIs', 'Expensive endpoints extra strict'],
    whenNotToUse: ['Internal mesh with mutual trust only — still often useful'],
  },
  failureModes: [
    'Limiter store down — fail open vs closed policy wrong choice for domain',
    'Clock skew breaks window reset',
    'Key per IP punishes corporate NAT',
    'No Retry-After → client retry storm',
    'Global limit hides per-tenant abuser',
  ],
  production: {
    reliability: ['Fail closed for auth; fail open vs closed for product decision documented'],
    scalability: ['Redis cluster counters', 'Edge rate limit at CDN/WAF'],
    observability: ['429 rate by client tier', 'Top offenders dashboard'],
    security: ['Combine with auth — anonymous IP limits stricter'],
    cost: ['Tier-based limits map to revenue'],
  },
  interview: {
    expectations: ['Token bucket vs fixed window', '429 headers', 'Distributed Redis limiter'],
    commonQuestions: ['Design rate limiter?', 'Token bucket vs leaky?'],
    followUps: ['Per-user vs global?', 'Fail open if Redis down?'],
    misconceptions: ['Rate limit equals auth', 'Single global limit enough for SaaS'],
    traps: ['No backoff header causing retry amplification'],
    strongSignals: ['Sliding window Redis Lua', 'Tiered limits', 'Cost-based endpoint weights'],
  },
  keyTakeaways: [
    '429 with Retry-After; document limit headers.',
    'Token bucket allows burst; sliding window fairer than fixed.',
    'Key by authenticated identity when possible.',
    'Redis common for distributed counts.',
    'Stricter limits on expensive endpoints.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'HTTP status for rate limit?', answerHint: '429 Too Many Requests with Retry-After.' },
    { level: 'intermediate', question: 'Token bucket parameters?', answerHint: 'Capacity max burst; refill rate sustained throughput.' },
    { level: 'advanced', question: 'Distributed rate limit without race?', answerHint: 'Redis INCR+EXPIRE, Lua atomic sliding window, or centralized envoy global limit.' },
  ],
  flashcards: [
    { front: '429 status', back: 'Too Many Requests — client should backoff Retry-After' },
    { front: 'Token bucket burst', back: 'Accumulated tokens allow short burst above steady rate' },
    { front: 'Fixed window edge burst', back: '2× traffic at window boundary — use sliding window' },
    { front: 'Rate limit key priority', back: 'API key / user id preferred over shared IP' },
  ],
  quickRevision: [
    '429 + Retry-After',
    'Token bucket bursts',
    'Redis distributed',
    'Per-tenant tiers',
    'Weighted expensive routes',
  ],
  systemDesign: {
    problem: 'Rate limit public API with free (100/min), pro (10k/min), enterprise (custom) tiers plus strict limit on POST /search.',
    requirements: {
      functional: ['Enforce tier limits', 'Burst allowance', 'Different search cost weight'],
      nonFunctional: ['Distributed 50 API pods', 'Accurate within 1%'],
    },
    scaleAssumptions: ['100k RPS aggregate', '50 pods'],
    capacityEstimates: ['Redis cluster sliding window per api_key'],
    api: [{ type: 'paragraph', text: 'Gateway middleware before routing; search endpoint 5× token cost' }],
    dataModel: [{ type: 'list', items: ['Redis key ratelimit:{api_key}:{window}', 'Tier config in DB cached'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'Envoy/Kong global limit + Redis fine-grained per key; WAF IP limit for unauthenticated.' }],
    diagram: {
      mermaid: `flowchart TB
  Req --> WAF[WAF IP limit]
  WAF --> GW[Gateway]
  GW --> RL[Redis sliding window]
  RL -->|allow| API[API pods]
  RL -->|deny| R429[429]`,
      caption: 'Layered rate limiting',
    },
    dataFlow: ['Extract api_key → lookup tier → consume weighted tokens → pass or 429'],
    storage: ['Redis counters'],
    caching: ['Tier config local cache 60s'],
    asyncProcessing: ['Usage metering to billing pipeline'],
    scaling: ['Redis cluster; edge pre-limit'],
    consistency: ['Eventual counter — slight over-allow OK'],
    reliability: ['Redis down: fail closed pro tier fail open free product decision documented'],
    failureScenarios: ['Client ignores Retry-After — ban repeat offender api_key'],
    security: ['Auth required for tier limits; stricter anonymous'],
    observability: ['429 by tier, Redis latency, top keys'],
    bottlenecks: ['Hot redis key — shard by api_key hash already'],
    alternatives: ['Token bucket per pod local approximate — uneven'],
    tradeoffs: ['Fail open availability vs fail closed abuse protection'],
    interviewFollowUps: ['Burst vs sustained pro tier?', 'Metering for billing accuracy?'],
    evolution: [
      { stage: '1. Simple design', description: 'Fixed window in-memory per pod.', bottleneck: 'Uneven + bypass multi-pod.' },
      { stage: '2. Improve', description: 'Central Redis sliding window.', bottleneck: 'Redis SPOF.' },
      { stage: '3. Improve', description: 'Redis cluster + gateway edge.', bottleneck: 'Weighted endpoint complexity.' },
      { stage: '4. Scale further', description: 'Billing-integrated dynamic limits.', bottleneck: 'Real-time tier upgrade propagation.' },
    ],
  },
}
