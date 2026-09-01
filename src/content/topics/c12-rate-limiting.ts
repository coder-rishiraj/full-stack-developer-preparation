import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Rate limiting caps request rate to protect services and enforce fair usage — algorithms: token bucket, leaky bucket, fixed/sliding window. Implement at API gateway, service middleware, or Redis shared counter. Returns 429 Too Many Requests with Retry-After. Distinct from Kafka consumer pacing — same math, different layer.',
  whyExists:
    'Abuse, accidents, and flash crowds overwhelm backends. Rate limits protect DB connection pools, prevent credential stuffing on login, enforce SaaS plan tiers, and complement circuit breakers by stopping work before queue builds.',
  mentalModel:
    'Count tokens per dimension (IP, userId, API key) per window. Reject or queue when exceeded. Distributed systems use Redis INCR/ZSET for shared view. Fail-open vs fail-closed when limiter store down — explicit product choice.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Algorithm', 'Behavior', 'Use'],
      rows: [
        ['Token bucket', 'Refill tokens at rate; burst allowed', 'API with burst tolerance'],
        ['Fixed window', 'Counter per minute bucket', 'Simple Redis INCR'],
        ['Sliding window log', 'Timestamp set in ZSET', 'Smoother limit'],
        ['Leaky bucket', 'Constant outflow rate', 'Smooth output to downstream'],
      ],
    },
    {
      type: 'list',
      items: [
        'Layer: CDN/WAF → gateway → service → DB',
        'Stricter limits on /login and password reset',
        'Global limit protects shared dependency',
        'Per-tenant limits for multi-tenant SaaS',
        'Combine with auth — limits not substitute for authZ',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Free tier 100 req/min per API key via Redis sliding window at gateway. 429 with Retry-After: 12. Paid tier 10k/min separate bucket. Login endpoint 5/min per IP regardless of tier.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Redis LUA atomic check-and-increment',
        'Bucket4j library with Redis proxy',
        'Spring Cloud Gateway RequestRateLimiter filter',
        'Approximate sliding window counter algorithm for memory efficiency',
        'Coordination with idempotency — limit retries amplifying load',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Protects capacity', 'Enforces commercial tiers', 'Reduces brute-force success'],
    disadvantages: ['NAT shared IP false positives', 'Redis SPOF for global limit', 'Complex tier matrix'],
    alternatives: ['Queue admission control', 'Static capacity provision only'],
    whenToUse: ['Public APIs', 'Auth endpoints', 'Expensive operations', 'Flash sale admission'],
    whenNotToUse: ['Internal mesh with mutual TLS only — optional fairness still useful'],
  },
  failureModes: [
    'Limiter Redis down — unlimited or total block',
    'Fixed window boundary burst 2x',
    'Per-IP only blocks corporate NAT',
    'Rate limit after expensive work started',
    'No Retry-After — clients hammer blindly',
  ],
  production: {
    reliability: ['Document fail-open vs fail-closed policy', 'Local token bucket fallback'],
    observability: ['429 rate by route and client', 'Top abusers dashboard'],
    security: ['Tighter auth endpoint limits', 'Pair with WAF bot detection'],
    performance: ['Efficient Redis scripts', 'Limit check before heavy handler'],
  },
  interview: {
    expectations: ['Token bucket vs sliding window', 'Redis distributed limit', '429 response', 'Layered limits'],
    commonQuestions: ['Design API rate limiter?', 'Fixed vs sliding window?', 'Redis down behavior?'],
    followUps: ['Difference from c10 Redis limit?', 'Global vs per-user limit?'],
    misconceptions: ['Rate limit replaces auth', 'In-memory limit works cross-pod'],
    traps: ['Only IP-based limit for mobile carrier users'],
    strongSignals: ['Redis atomic ops, sliding window trade-offs, gateway layer, Retry-After, login strict limits'],
  },
  keyTakeaways: [
    'Rate limiting protects services and enforces tiers.',
    'Token bucket allows bursts; sliding window smoother than fixed.',
    'Redis enables distributed counters across instances.',
    'Return 429 + Retry-After; stricter on auth paths.',
    'Apply at gateway and service for defense in depth.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why rate limit APIs?', answerHint: 'Prevent abuse, protect downstream capacity, enforce plan tiers, reduce brute-force.' },
    { level: 'intermediate', question: 'Token bucket vs fixed window?', answerHint: 'Token bucket allows controlled burst with refill rate; fixed window simpler but double burst at boundary.' },
    { level: 'advanced', question: 'Global 10k rps limit distributed?', answerHint: 'Redis centralized counter or sharded approximate counters; watch hot key; fail-open policy documented.' },
  ],
  flashcards: [
    { front: 'Token bucket', back: 'Refill rate + burst capacity — flexible traffic shaping' },
    { front: '429 Too Many Requests', back: 'Client exceeded rate — include Retry-After' },
    { front: 'Sliding window', back: 'Smoother than fixed window — ZSET timestamps pattern' },
    { front: 'Fail-open vs fail-closed', back: 'Policy when limiter store unavailable' },
  ],
  quickRevision: ['Gateway + service layers', 'Redis shared counter', '429 Retry-After', 'Strict login limits', 'Token bucket bursts'],
}
