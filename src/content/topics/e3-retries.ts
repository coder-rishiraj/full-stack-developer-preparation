import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Retries re-issue failed LLM API calls for transient errors — 429, 502, timeouts — with exponential backoff, jitter, and max attempts. Idempotency matters for side-effecting tool calls.',
  whyExists: 'Network blips and provider overload are common. Naive fail loses user requests; naive infinite retry amplifies outages.',
  mentalModel: 'Polite knock again after waiting — not hammering door. Give up after N tries and surface error.',
  howItWorks: [
    { type: 'list', items: [
      'Retry: 429, 502/503, connect timeout.',
      'Do not retry: 400 bad request, 401 auth, invalid schema.',
      'Exponential backoff: 1s, 2s, 4s + random jitter.',
      'Idempotency keys for paid calls with side effects.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: '3 retries with backoff on 503; on final fail return cached fallback message and alert on-call.' },
  ],
  tradeoffs: {
    advantages: [
      'Higher success rate',
      'Smooths transient issues',
    ],
    disadvantages: [
      'Increased latency tail',
      'Duplicate cost if non-idempotent',
    ],
    alternatives: [
      'Circuit breaker after failures',
    ],
    whenToUse: [
      'All prod LLM clients',
    ],
    whenNotToUse: [
      'Retry 400 validation errors',
    ],
  },
  failureModes: [
    'Retry invalid prompt forever',
    'No max attempts — hung requests',
    'Duplicate tool side effects',
  ],
  production: {
    reliability: [
      'Cap attempts; circuit breaker',
      'Idempotency for writes',
    ],
    observability: [
      'Log retry count per request',
    ],
  },
  interview: {
    expectations: [
      'Which status retry',
      'Backoff+jitter',
    ],
    commonQuestions: [
      'Retry strategy for LLM API?',
    ],
    followUps: [
      'Idempotent tool calls?',
    ],
    misconceptions: [
      'Retry all errors',
    ],
    traps: [
      'Immediate retry storm on 429',
    ],
    strongSignals: [
      'Classify errors',
      'Jitter',
      'Max attempts',
    ],
  },
  keyTakeaways: [
    'Retry transient only',
    'Exponential backoff + jitter',
    'Max attempts cap',
    'No retry 4xx logic errors',
    'Idempotency for side effects',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Which errors retry?', answerHint: '429, 5xx, timeouts — not 400/401.' },
    { level: 'intermediate', question: 'Why jitter?', answerHint: 'Desynchronize clients to avoid retry storms.' },
    { level: 'advanced', question: 'Retry with tool side effects?', answerHint: 'Idempotency keys; dedupe; human confirm on ambiguous.' },
  ],
  flashcards: [
    { front: 'Exponential backoff', back: 'Increasing wait between retry attempts' },
    { front: 'Non-retryable 400', back: 'Fix request not retry blindly' },
    { front: 'Circuit breaker', back: 'Stop calling failing dependency temporarily' },
  ],
  quickRevision: [
    'Transient only',
    'Backoff+jitter',
    'Max attempts',
    'No 400 retry',
    'Idempotent tools',
  ],
}
