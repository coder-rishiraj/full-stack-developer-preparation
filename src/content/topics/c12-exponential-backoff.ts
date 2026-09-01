import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Exponential backoff increases wait time between retries multiplicatively — delay = base × 2^attempt (+ jitter). Used for HTTP retries, Kafka consumer recoverers, DB deadlock retry, and thundering herd prevention after outages. Jitter randomizes delays so clients do not retry in sync.',
  whyExists:
    'Fixed short retry hammers recovering server — retry storm delays recovery. Linear backoff still synchronizes. Exponential spreads load; jitter desynchronizes millions of clients waking together.',
  mentalModel:
    'First retry soon, later retries patiently. Cap max delay. Add random ± jitter. Stop after max attempts — escalate to DLQ or human. Full jitter: random(0, min(cap, base×2^n)).',
  howItWorks: [
    {
      type: 'table',
      headers: ['Parameter', 'Typical value', 'Role'],
      rows: [
        ['base delay', '100ms–1s', 'Initial retry wait'],
        ['multiplier', '2', 'Exponential growth'],
        ['max delay cap', '30s–60s', 'Prevent infinite wait growth'],
        ['max attempts', '3–5 client; more with DLQ server', 'Stop unbounded retry'],
        ['jitter', 'full or equal', 'Desynchronize retries'],
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Exponential backoff with jitter (concept)',
      code: `int attempt = 0;
while (attempt < MAX) {
  try {
    return callService();
  } catch (TransientException e) {
    long base = 1000L * (1L << attempt);
    long cap = 30000L;
    long delay = Math.min(cap, base);
    long jitter = ThreadLocalRandom.current().nextLong(delay);
    Thread.sleep(jitter);
    attempt++;
  }
}
throw e;`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Payment gateway 503 — client retries at ~1s, ~2s, ~4s with jitter. Gateway recovers without synchronized spike at exactly 1s boundaries from all users.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'AWS SDK standard retry mode uses exponential backoff + jitter',
        'Resilience4j Retry config exponentialBackoffMultiplier',
        'Google exponential backoff spec influential industry pattern',
        'Retry-After HTTP header may override client backoff for 429',
        'Idempotency required for mutating retries',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Protects recovering systems', 'Higher success on transient faults', 'Industry standard client behavior'],
    disadvantages: ['Longer tail latency on failures', 'User waits through backoff unless async', 'Wrong on non-transient errors wastes time'],
    alternatives: ['Fixed delay — simpler but harsher on recovery', 'Immediate DLQ — no retry'],
    whenToUse: ['Transient network/503/timeout errors', 'Consumer retry policies'],
    whenNotToUse: ['400 validation errors — fail immediately', 'Non-idempotent POST without keys'],
  },
  failureModes: [
    'Retry non-idempotent charge without key — duplicates',
    'No cap — client hangs minutes',
    'No jitter — synchronized retry storm',
    'Retry 404 forever — permanent error',
  ],
  production: {
    reliability: ['Classify retriable exceptions', 'Idempotency keys on mutating retries'],
    observability: ['Retry count metrics', 'Alert high retry rates'],
    performance: ['Cap max delay for UX-critical paths', 'Async retry queue for background'],
  },
  interview: {
    expectations: ['Formula intuition', 'Why jitter', 'Cap and max attempts', 'Idempotency'],
    commonQuestions: ['Exponential backoff?', 'Why jitter?', 'Retry payment safely?'],
    followUps: ['Retry-After header?', 'Resilience4j config?'],
    misconceptions: ['More retries always better', 'Backoff without idempotency safe for POST'],
    traps: ['Linear 1s forever on 400 errors'],
    strongSignals: ['2^n cap jitter, idempotency, classify errors, DLQ after max'],
  },
  keyTakeaways: [
    'Delay grows exponentially: base × 2^attempt capped.',
    'Jitter prevents synchronized retry storms.',
    'Cap attempts; non-transient errors fail fast.',
    'Mutating retries require idempotency keys.',
    'Honor Retry-After when present.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Exponential backoff purpose?', answerHint: 'Increase delay between retries to avoid overwhelming recovering service.' },
    { level: 'intermediate', question: 'Why add jitter?', answerHint: 'Randomize retry times so many clients do not retry simultaneously.' },
    { level: 'advanced', question: 'Backoff for idempotent Kafka consumer?', answerHint: 'Exponential backoff in error handler; max retries then DLQ; handler idempotent for redelivery.' },
  ],
  flashcards: [
    { front: 'Exponential backoff', back: 'Retry delay multiplies each attempt — capped' },
    { front: 'Jitter', back: 'Randomize delay — prevents thundering herd on recovery' },
    { front: 'Max attempts', back: 'Stop retrying — DLQ or error to user' },
    { front: 'Idempotent retry', back: 'Safe mutating retry with dedup keys' },
  ],
  quickRevision: ['2^n delay cap', 'Add jitter', 'Max attempts', 'Idempotent POST', 'Fail fast 4xx'],
}
