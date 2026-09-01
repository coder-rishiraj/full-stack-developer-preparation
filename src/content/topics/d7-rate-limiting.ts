import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Rate limiting at the systems level controls request throughput across distributed services — at API gateways, service meshes, CDNs, and shared Redis counters — to protect backends, enforce quotas, and prevent abuse at platform scale. Complements per-service limits with global and tiered policies.',
  whyExists:
    'A single microservice limiter is insufficient when 50 pods each allow 1000 RPS — aggregate exceeds DB capacity. Platform-level limiting coordinates edge WAF, gateway, and dependency budgets so one tenant or bug cannot exhaust shared resources.',
  mentalModel:
    'Water main pressure regulator plus per-apartment valves. Global limit protects the pipe (origin DB); per-tenant limit ensures fairness; per-endpoint weights reflect cost (search costs 5× health check).',
  howItWorks: [
    {
      type: 'table',
      headers: ['Layer', 'Scope', 'Example'],
      rows: [
        ['CDN/WAF', 'IP, geo, bot score', 'Block DDoS before origin'],
        ['API gateway', 'API key, tenant, route', 'Envoy/Kong global limit'],
        ['Service mesh', 'Per-service budget', 'Istio local rate limit'],
        ['App middleware', 'User/session', 'Redis sliding window'],
        ['Dependency guard', 'Downstream protection', 'Max concurrent DB queries'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Layered rate limiting',
      diagram: `flowchart TB
  Client --> WAF[WAF IP limit]
  WAF --> GW[Gateway tenant limit]
  GW --> Mesh[Service mesh budget]
  Mesh --> App[App Redis per-user]
  App --> DB[DB connection cap]`,
    },
    {
      type: 'list',
      items: [
        'Distributed counters: Redis INCR + TTL or Lua sliding window',
        'Token bucket at gateway for burst-friendly SaaS tiers',
        'Cost-based weights: expensive endpoints consume more tokens',
        'Fail-open vs fail-closed policy documented per tier',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Layered limit response',
      code: `HTTP/1.1 429 Too Many Requests
Retry-After: 30
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1692259320
X-RateLimit-Policy: tenant-pro-tier

{"error":"rate_limit_exceeded","tier":"pro"}`,
    },
  ],
  tradeoffs: {
    advantages: ['Platform-wide protection', 'Revenue tier enforcement', 'Absorbs flash crowds at edge'],
    disadvantages: ['Distributed consistency — slight over-allow', 'Complex multi-layer tuning', 'Shared NAT false positives'],
    alternatives: ['Queue heavy work async', 'Capacity planning only — risky at scale'],
    whenToUse: ['All public multi-tenant APIs', 'Shared DB or expensive dependencies'],
    whenNotToUse: ['Fully isolated single-tenant dedicated stacks — still useful at edge'],
  },
  failureModes: [
    'Limiter store outage — wrong fail-open floods DB',
    'Per-pod local limits — uneven and bypassable',
    'No Retry-After — client retry storm',
    'Global limit hides abusive single tenant',
    'Fixed window edge doubling burst at boundary',
  ],
  production: {
    reliability: ['Redis cluster for counter HA', 'Documented fail-open/closed per tier'],
    scalability: ['Edge pre-limit reduces origin load', 'Shard counters by tenant hash'],
    observability: ['429 rate by tier, route, tenant top-N', 'Limiter latency metrics'],
    security: ['Stricter anonymous IP limits', 'Combine with auth for tier identity'],
    cost: ['Tier limits map to pricing; metering pipeline for billing'],
  },
  interview: {
    expectations: ['Layered limits', 'Distributed Redis algorithm', '429 headers'],
    commonQuestions: ['Design distributed rate limiter?', 'Gateway vs app limit?'],
    followUps: ['Fail open if Redis down?', 'Weighted endpoint costs?'],
    misconceptions: ['One global number suffices for SaaS', 'Rate limit replaces auth'],
    traps: ['In-memory limiter on 50 pods'],
    strongSignals: ['Sliding window Lua', 'Tier + cost weights', 'Edge + origin coordination'],
  },
  keyTakeaways: [
    'Layer limits: WAF → gateway → mesh → app → dependency.',
    'Distributed Redis sliding window or token bucket for accuracy.',
    '429 + Retry-After + standard rate limit headers.',
    'Weight expensive endpoints higher in token cost.',
    'Fail-open vs fail-closed is a product/security decision.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why not in-memory limiter per pod?', answerHint: 'Each pod allows full quota — aggregate N× limit exceeds backend capacity.' },
    { level: 'intermediate', question: 'Sliding window in Redis?', answerHint: 'Lua script atomic INCR with window key or weighted previous+current window counters.' },
    { level: 'advanced', question: 'Rate limit during flash sale?', answerHint: 'Edge queue/waiting room, strict checkout path budget, shed non-critical, token bucket burst for paid tier.' },
  ],
  flashcards: [
    { front: 'Layered rate limiting', back: 'WAF, gateway, mesh, app — each protects different scope' },
    { front: 'Cost-weighted tokens', back: 'Expensive endpoints consume more of tenant quota' },
    { front: 'Fail open vs closed', back: 'Open preserves uptime; closed protects abuse — tier dependent' },
    { front: 'Sliding window advantage', back: 'Avoids 2× burst at fixed window boundary' },
  ],
  quickRevision: [
    'Edge + gateway + Redis',
    '429 Retry-After',
    'Per-tenant tiers',
    'Weighted routes',
    'No per-pod alone',
  ],
}
