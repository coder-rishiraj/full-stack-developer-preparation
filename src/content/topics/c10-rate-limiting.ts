import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Rate limiting caps requests per client, user, IP, or API key over a time window. Redis implementations: fixed window counter (INCR + EXPIRE), sliding window log (ZSET timestamps), token bucket, leaky bucket. Returns 429 Too Many Requests with Retry-After. Protects DB, prevents abuse, fair usage tiers.',
  whyExists:
    'Flash sales, scrapers, and buggy clients can overwhelm services. Rate limits protect downstream dependencies, enforce SLA tiers (100 req/min free vs 10k pro), and complement auth — authenticated users still need limits.',
  mentalModel:
    'Count events in window per key ratelimit:{dimension}. Atomic Redis ops decide allow/deny before expensive handler. Distributed: all nodes share Redis counter. Fail-open vs fail-closed policy when Redis unavailable — product decision.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Algorithm', 'Redis pattern', 'Behavior'],
      rows: [
        ['Fixed window', 'INCR key; EXPIRE at window start', 'Simple; burst at window edges'],
        ['Sliding window log', 'ZSET of timestamps; ZREMRANGEBYSCORE', 'Smoother; more memory'],
        ['Sliding window counter', 'Weighted previous + current window', 'Approximate; efficient'],
        ['Token bucket', 'Tokens refill at rate; LUA script atomic', 'Allows controlled bursts'],
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Fixed window with Redis INCR',
      code: `String key = "rl:" + userId + ":" + (epochSecond / 60);
Long count = redis.opsForValue().increment(key);
if (count == 1) redis.expire(key, Duration.ofMinutes(1));
if (count > 100) throw new RateLimitExceededException();`,
    },
    {
      type: 'list',
      items: [
        'Layer limits: edge CDN/WAF → API gateway → service → DB',
        'Return 429 + Retry-After header',
        'Identify client: API key > user id > IP (NAT issues)',
        'Separate limits for login (anti brute-force) vs read APIs',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Ticket sale: 5 requests/min per userId in Redis sliding ZSET at gateway; 429 when exceeded. Backend inventory service has separate 1k/s global limit protecting DB.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'LUA scripts or Redis Cell module for atomic multi-step limit check',
        'Clock skew across nodes — use Redis TIME or centralized counter',
        'Hot key ratelimit:global — shard by suffix or local token bucket + sync',
        'Bucket4j + Redis proxy for JVM apps',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Protects capacity', 'Enforces commercial tiers', 'Reduces brute-force success'],
    disadvantages: ['False positives behind NAT', 'Redis dependency for global limit', 'Edge vs app limit duplication confusion'],
    alternatives: ['Gateway-only limits', 'Adaptive congestion control', 'Queue admission'],
    whenToUse: ['Public APIs', 'Login endpoints', 'Flash sales', 'Expensive operations'],
    whenNotToUse: ['Internal service mesh with mutual auth only — still optional fairness'],
  },
  failureModes: [
    'Redis down — unlimited traffic or total outage if fail-closed',
    'Fixed window double burst at boundary',
    'Key per IP blocks corporate NAT',
    'Race without atomic INCR/LUA',
    'Limit after auth but before auth on login — credential stuffing',
  ],
  production: {
    reliability: ['Document fail-open vs fail-closed', 'Local fallback limit if Redis slow'],
    performance: ['Pipeline limit check', 'Avoid ZSET log for very high QPS unless needed'],
    observability: ['429 rate by route and client dimension', 'Top offenders dashboard'],
    security: ['Stricter limits on auth and password reset'],
  },
  interview: {
    expectations: ['Fixed vs sliding window', 'Redis INCR/ZSET patterns', '429 response', 'Layered limits'],
    commonQuestions: ['Design rate limiter with Redis?', 'Token bucket vs fixed window?', 'Distributed rate limit?'],
    followUps: ['Hot key global limit?', 'Fail-open if Redis down?'],
    misconceptions: ['Rate limit replaces authentication', 'In-memory limit works across pods'],
    traps: ['Per-IP only for mobile carrier NAT users'],
    strongSignals: ['Redis atomic ops, sliding window trade-offs, gateway + service layers, Retry-After'],
  },
  keyTakeaways: [
    'Redis enables shared counters across app instances.',
    'Fixed window simple; sliding smoother; token bucket allows bursts.',
    'Apply at edge and service for defense in depth.',
    'Return 429 with Retry-After; log abuse patterns.',
    'Choose fail-open vs fail-closed when Redis unavailable.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Purpose of rate limiting?', answerHint: 'Protect resources, fair usage, prevent abuse/brute-force, enforce tiers.' },
    { level: 'intermediate', question: 'Fixed window burst problem?', answerHint: '2x traffic possible at window boundary — use sliding window or token bucket.' },
    { level: 'advanced', question: 'Global 10k rps limit with Redis?', answerHint: 'Sharded counters or centralized LUA; watch hot key; approximate sliding counter algorithm.' },
  ],
  flashcards: [
    { front: 'Fixed window rate limit', back: 'INCR per window bucket — simple edge burst issue' },
    { front: 'Sliding window ZSET', back: 'Store request timestamps; trim old; ZCARD vs limit' },
    { front: '429 Too Many Requests', back: 'Standard response when rate limit exceeded' },
    { front: 'Token bucket', back: 'Refill tokens at rate — allows controlled bursts' },
  ],
  quickRevision: ['Redis shared counter', 'Fixed vs sliding', 'Layer at gateway', '429 Retry-After', 'Fail-open policy'],
}
