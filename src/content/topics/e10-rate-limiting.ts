import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Rate limiting caps LLM API usage per user, tenant, IP, or API key — requests per minute and tokens per minute — protecting budget, fairness, and upstream provider quotas.',
  whyExists: 'One tenant or script can exhaust TPM limits or bankrupt spend. Limits enforce fairness and prevent abuse.',
  mentalModel: 'Token bucket at amusement park ride — N tickets per window; wait or upgrade tier when empty.',
  howItWorks: [
    { type: 'list', items: [
      'Token bucket or sliding window at gateway.',
      'Separate RPM and TPM limits.',
      '429 with Retry-After header.',
      'Tiered limits by plan; burst allowance.',
      'Global limiter before provider to avoid 429 cascade.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Free tier: 20 req/min, 40K TPM. Pro: 200 req/min. Gateway Redis INCR with TTL; reject with upgrade CTA before hitting OpenAI 429.' },
  ],
  tradeoffs: {
    advantages: [
      'Cost control',
      'Fair multi-tenant',
    ],
    disadvantages: [
      'Legitimate burst blocked',
      'Client retry storms if misconfigured',
    ],
    alternatives: [
      'Provider-only limits — reactive',
    ],
    whenToUse: [
      'Public or multi-tenant LLM API',
    ],
    whenNotToUse: [
      'Single internal service with trusted callers only',
    ],
  },
  failureModes: [
    'Retry storm on 429',
    'Per-IP limit blocks NAT office',
    'No TPM limit — cost blowup',
  ],
  production: {
    reliability: [
      'Jittered client backoff docs',
    ],
    cost: [
      'TPM caps per tenant',
    ],
    observability: [
      'rate_limit_hits metric',
    ],
  },
  interview: {
    expectations: [
      'Token bucket',
      'RPM vs TPM',
    ],
    commonQuestions: [
      'Rate limit LLM API?',
    ],
    followUps: [
      '429 client behavior?',
    ],
    misconceptions: [
      'Provider limit enough',
    ],
    traps: [
      'No global TPM guard',
    ],
    strongSignals: [
      'Gateway bucket + Retry-After + tier plans',
    ],
  },
  keyTakeaways: [
    'Gateway before provider',
    'RPM and TPM limits',
    '429 + Retry-After',
    'Per-tenant tiers',
    'Prevent retry storms',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why rate limit LLM apps?', answerHint: 'Fairness, cost control, avoid provider 429.' },
    { level: 'intermediate', question: 'Token bucket vs sliding window?', answerHint: 'Bucket allows burst refill; sliding window smoother over time.' },
    { level: 'advanced', question: 'Coordinate with provider TPM?', answerHint: 'Global bucket below provider cap; queue excess async.' },
  ],
  flashcards: [
    { front: 'TPM limit', back: 'Tokens per minute cap per tenant or global' },
    { front: 'Token bucket', back: 'Allows burst up to bucket size refilling at rate' },
    { front: 'Retry-After', back: 'Header telling client when to retry after 429' },
  ],
  quickRevision: [
    'Gateway limit',
    'RPM+TPM',
    '429 Retry-After',
    'Tier plans',
    'Global provider cap',
  ],
}
