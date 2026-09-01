import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Retry strategies define when and how clients re-attempt failed operations — exponential backoff, jitter, capped attempts, idempotency keys, and respect for Retry-After — to recover from transient failures without amplifying outages into retry storms.',
  whyExists:
    'Networks blip, pods restart, and dependencies briefly 503. Immediate tight retries synchronize across clients and overwhelm recovering services. Disciplined retries improve success rate for idempotent reads and safe writes while containing blast radius.',
  mentalModel:
    'Polite knocking: first knock fails, wait a bit (backoff), knock again with random spread (jitter) so neighbors do not all knock together. Stop after N tries; only retry if duplicate action is safe (idempotent).',
  howItWorks: [
    {
      type: 'table',
      headers: ['Policy', 'Formula / rule', 'Risk if wrong'],
      rows: [
        ['Exponential backoff', 'delay = base × 2^attempt', 'Too aggressive without cap'],
        ['Full jitter', 'delay = random(0, calculated)', 'Reduces synchronized retry spikes'],
        ['Max attempts', 'Stop after 3–5 tries', 'Infinite retry hangs client'],
        ['Retry-After respect', 'Honor server header seconds', 'Ignore → retry storm'],
        ['Idempotency only', 'Retry POST with Idempotency-Key', 'Duplicate charges/orders'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Retry storm amplification',
      diagram: `flowchart TB
  Fail[Service 503] --> C1[1000 clients retry immediately]
  C1 --> Spike[Traffic 10× normal]
  Spike --> Down[Service never recovers]
  Fail --> Backoff[Clients backoff + jitter]
  Backoff --> Recover[Service recovers]`,
    },
    {
      type: 'list',
      items: [
        'Retry only idempotent methods or idempotent keys on writes',
        'Do not retry non-transient errors (400, 401, 404) blindly',
        'Circuit breaker stops retries to known-bad dependency',
        'Global kill switch to disable retries during incident',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'text',
      caption: 'Retry policy sketch',
      code: `maxAttempts: 3
baseDelayMs: 100
maxDelayMs: 5000
jitter: full
retryOn: [408, 429, 500, 502, 503, 504]
noRetryOn: [400, 401, 403, 404, 422]
idempotencyKey: required for POST /payments`,
    },
  ],
  tradeoffs: {
    advantages: ['Higher success on transient blips', 'Better UX without user manual retry', 'Standardized client libraries'],
    disadvantages: ['Retry storms if undisciplined', 'Duplicate side effects without idempotency', 'Increased tail latency'],
    alternatives: ['Fail fast — user retries manually', 'Async queue with at-least-once consumer idempotency'],
    whenToUse: ['Transient network/RPC failures', 'Idempotent reads', 'Safe writes with idempotency store'],
    whenNotToUse: ['Non-idempotent POST without dedup', 'Permanent errors'],
  },
  failureModes: [
    'Retry storm after partial recovery',
    'Duplicate payment without idempotency key',
    'Retry on 429 ignoring Retry-After',
    'Nested retries multiply attempts (3×3×3)',
    'Infinite retry loop on bad config',
  ],
  production: {
    reliability: ['Idempotency store for writes', 'Circuit breaker + retry combo', 'Retry budget per request chain'],
    scalability: ['Jitter mandatory at scale', 'Respect Retry-After and 429'],
    observability: ['Retry count metrics per dependency', 'Alert on retry ratio spike'],
    security: ['Do not retry auth failures aggressively — lockout risk'],
    maintainability: ['Shared retry policy in SDK/service mesh', 'Document per-endpoint idempotency'],
  },
  interview: {
    expectations: ['Exponential backoff + jitter', 'Idempotency', 'Retry vs circuit breaker'],
    commonQuestions: ['Prevent retry storm?', 'Retry POST payment?'],
    followUps: ['Service mesh retry policy?', 'Hedged requests difference?'],
    misconceptions: ['Always retry improves reliability', 'Same policy for all HTTP status codes'],
    traps: ['Retry non-idempotent POST without key'],
    strongSignals: ['Full jitter', 'Idempotency-Key', 'Retry budget + CB'],
  },
  keyTakeaways: [
    'Exponential backoff + full jitter prevents synchronized storms.',
    'Cap max attempts; honor Retry-After on 429/503.',
    'Retry idempotent ops only — Idempotency-Key on writes.',
    'Circuit breaker pauses retries to failing dependency.',
    'Nested calls need retry budget to avoid multiplication.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why add jitter to backoff?', answerHint: 'Desynchronize client retries that would spike load together.' },
    { level: 'intermediate', question: 'Safe to retry HTTP POST?', answerHint: 'Only with idempotency key and server-side dedup store.' },
    { level: 'advanced', question: 'Retry storm during incident — mitigation?', answerHint: 'Global retry disable, aggressive backoff, circuit breakers, load shed, fix root cause before re-enabling.' },
  ],
  flashcards: [
    { front: 'Exponential backoff', back: 'Increase wait between retries — base × 2^attempt capped' },
    { front: 'Full jitter', back: 'Random delay in [0, backoff] to desynchronize clients' },
    { front: 'Idempotency-Key', back: 'Header ensuring duplicate retries produce single effect' },
    { front: 'Retry budget', back: 'Max total retries across nested RPC chain' },
  ],
  quickRevision: [
    'Backoff + jitter',
    'Cap attempts',
    'Idempotent only',
    'Honor Retry-After',
    'CB stops retries',
  ],
}
