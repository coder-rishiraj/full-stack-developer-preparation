import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Rate limits cap API requests and tokens per minute/org/key to protect provider infrastructure and enforce tier quotas. Exceeding returns 429 with retry-after headers.',
  whyExists: 'Uncapped traffic could overload GPUs or one customer could starve others. Apps must backoff, queue, and shard keys responsibly.',
  mentalModel: 'Speed limit on highway. Too many requests/min → temporary stop; wait and retry.',
  howItWorks: [
    { type: 'list', items: [
      'Limits on RPM, TPM (tokens per minute), concurrent requests.',
      '429 Too Many Requests + Retry-After.',
      'Tier upgrades raise caps; enterprise deals custom.',
      'Client-side token buckets and queues smooth bursts.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Batch embed 1M docs: throttle to TPM cap, exponential backoff on 429, parallel workers respect global bucket.' },
  ],
  tradeoffs: {
    advantages: [
      'Fair sharing',
      'Predictable provider stability',
    ],
    disadvantages: [
      'App complexity for backoff',
      'Burst jobs need queue',
    ],
    alternatives: [
      'Multiple keys (policy permitting)',
      'Self-host for control',
    ],
    whenToUse: [
      'Always in prod integrations',
    ],
    whenNotToUse: [
      'Ignore 429 — guaranteed failures',
    ],
  },
  failureModes: [
    'Retry storm without jitter',
    'Unbounded parallel workers',
    'No queue for batch jobs',
  ],
  production: {
    reliability: [
      'Exponential backoff + jitter on 429',
      'Central rate limiter service',
    ],
    scalability: [
      'Job queue for bulk workloads',
    ],
    observability: [
      'Alert on sustained 429 rate',
    ],
  },
  interview: {
    expectations: [
      '429 handling',
      'TPM vs RPM',
    ],
    commonQuestions: [
      'Hit rate limit what do?',
    ],
    followUps: [
      'Design embed pipeline?',
    ],
    misconceptions: [
      'Unlimited with paid tier',
    ],
    traps: [
      'Immediate tight retry loop',
    ],
    strongSignals: [
      'Backoff+jitter+queue',
    ],
  },
  keyTakeaways: [
    '429 = slow down',
    'RPM and TPM caps',
    'Retry-After respected',
    'Queue bulk work',
    'Jitter prevents thundering herd',
  ],
  interviewQuestions: [
    { level: 'basic', question: '429 meaning?', answerHint: 'Rate limited — backoff and retry per Retry-After.' },
    { level: 'intermediate', question: 'TPM vs RPM?', answerHint: 'Tokens per minute vs requests per minute — both may apply.' },
    { level: 'advanced', question: 'Bulk embed design?', answerHint: 'Worker pool + token bucket + DLQ + progress checkpoint.' },
  ],
  flashcards: [
    { front: '429', back: 'Rate limit exceeded — backoff required' },
    { front: 'TPM', back: 'Tokens per minute quota' },
    { front: 'Jitter', back: 'Randomize retry delay to spread load' },
  ],
  quickRevision: [
    '429 backoff',
    'RPM+TPM',
    'Queue bursts',
    'Jitter retries',
    'Monitor 429s',
  ],
}
