import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Production retries for LLM calls re-issue transient failures — 429, 502, timeouts — with exponential backoff, jitter, max attempts, and idempotency for tool side effects.',
  whyExists: 'Provider blips are common. Naive fail loses revenue; naive infinite retry amplifies outages and duplicates actions.',
  mentalModel: 'Polite redial — wait longer each time, stop after N tries, do not redial wrong number (400).',
  howItWorks: [
    { type: 'list', items: [
      'Retry: 429, 503, connect timeout, read timeout.',
      'No retry: 400 validation, 401 auth, policy block.',
      'Backoff: base × 2^attempt + random jitter.',
      'Respect Retry-After on 429.',
      'Idempotency-Key for paid calls with writes.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'SDK wrapper: max 3 attempts, 1s/2s/4s + jitter; on 429 read Retry-After; tool refund uses idempotency key stored 24h.' },
  ],
  tradeoffs: {
    advantages: [
      'Higher success rate',
      'Smooths transient errors',
    ],
    disadvantages: [
      'Tail latency',
      'Duplicate cost if not idempotent',
    ],
    alternatives: [
      'Fail fast + fallback model',
    ],
    whenToUse: [
      'All prod LLM clients',
    ],
    whenNotToUse: [
      'Retry 400 bad schema',
    ],
  },
  failureModes: [
    'Retry storm without jitter',
    'Duplicate tool charge',
    'Infinite retry on auth error',
  ],
  production: {
    reliability: [
      'Circuit breaker after sustained failures',
    ],
    observability: [
      'retry_count histogram',
    ],
    cost: [
      'Cap attempts to limit duplicate tokens',
    ],
  },
  interview: {
    expectations: [
      'Transient vs permanent',
      'Jitter',
    ],
    commonQuestions: [
      'LLM retry strategy?',
    ],
    followUps: [
      'Idempotent tools?',
    ],
    misconceptions: [
      'Retry all errors',
    ],
    traps: [
      'Immediate 429 retry loop',
    ],
    strongSignals: [
      'Classify errors + jitter + idempotency',
    ],
  },
  keyTakeaways: [
    'Retry transient only',
    'Exponential backoff + jitter',
    'Respect Retry-After',
    'Idempotency for writes',
    'Circuit breaker',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Which LLM errors retry?', answerHint: '429, 5xx, timeouts — not 400/401.' },
    { level: 'intermediate', question: 'Why jitter?', answerHint: 'Desynchronize clients; prevent thundering herd on recovery.' },
    { level: 'advanced', question: 'Retry with streaming?', answerHint: 'Restart stream or resume if provider supports; bill partial tokens.' },
  ],
  flashcards: [
    { front: 'Exponential backoff', back: 'Increasing delay between retry attempts' },
    { front: 'Idempotency-Key', back: 'Header preventing duplicate side effects' },
    { front: 'Non-retryable 400', back: 'Fix request content do not retry blindly' },
  ],
  quickRevision: [
    'Transient only',
    'Backoff+jitter',
    'Retry-After',
    'Idempotent tools',
    'Max attempts',
  ],
}
