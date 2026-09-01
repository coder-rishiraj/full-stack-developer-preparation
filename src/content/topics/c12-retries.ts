import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Retries re-invoke a failed operation when failure may be transient: network blips, 503 from overloaded upstream, throttling (429), or leader election. Policy defines max attempts, backoff (fixed, exponential, full jitter), which errors qualify, and idempotency requirements.',
  whyExists:
    'Distributed calls fail often for reasons unrelated to bad input. Without retries, users see flaky errors; with naive retries, you amplify outages (retry storms) or duplicate side effects (double charge). Retries are a reliability tool only when combined with timeouts, idempotency keys, and circuit breakers.',
  mentalModel:
    'Ask once, wait, ask again with increasing patience — but stop before you become the problem. Only retry when another attempt might succeed and cannot corrupt state. Jitter spreads retries so thousands of clients do not hit the server at the same millisecond.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Strategy', 'Behavior', 'Risk'],
      rows: [
        ['Fixed delay', 'Wait 500ms between attempts', 'Synchronized retry spikes'],
        ['Exponential backoff', '1s, 2s, 4s, 8s', 'Better but still aligned without jitter'],
        ['Full jitter', 'Random(0, base × 2^attempt)', 'Desynchronizes clients — AWS recommended'],
        ['Retry-After header', 'Respect server hint on 429/503', 'Polite; reduces overload'],
      ],
    },
    {
      type: 'list',
      items: [
        'Retry only idempotent operations (GET, PUT with same body, POST with Idempotency-Key).',
        'Do not retry 4xx except 408, 429 (with backoff) and sometimes 409 on conflict resolution.',
        'Retry 5xx, connect timeouts, and reset errors — cap total attempts and deadline.',
        'Combine with circuit breaker: when open, fail fast instead of retrying into a wall.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Exponential backoff with full jitter',
      code: `int attempt = 0;
while (attempt < MAX_RETRIES) {
  try {
    return paymentClient.charge(request);
  } catch (RetryableException e) {
    attempt++;
    if (attempt >= MAX_RETRIES) throw e;
    long cap = (long) (BASE_MS * Math.pow(2, attempt));
    long sleep = ThreadLocalRandom.current().nextLong(0, cap);
    Thread.sleep(sleep);
  }
}`,
    },
    {
      type: 'paragraph',
      text: 'Checkout POST includes Idempotency-Key: uuid. First attempt times out; client retries with same key. Server returns original 201 instead of creating a second order.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'gRPC/HTTP client libraries often ship retry policies (Envoy, AWS SDK, resilience4j).',
        'Hedged requests are a special case: send duplicate after delay — only for safe read paths.',
        'At-least-once delivery (Kafka, SQS) implies consumers must be idempotent.',
        'Retry budget: limit retries as fraction of total requests to protect the fleet.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Mask transient failures', 'Improve success rate without user action', 'Standard pattern in SDKs and service mesh'],
    disadvantages: ['Increases load during incidents', 'Duplicates without idempotency', 'Extends tail latency if max attempts high'],
    alternatives: ['Fail fast + user retry', 'Async queue with worker retries', 'Fallback/degraded response'],
    whenToUse: ['Idempotent reads', 'Safe writes with idempotency keys', 'Known transient error classes'],
    whenNotToUse: ['Non-idempotent POST without dedup', 'Dependency already overloaded (CB open)', 'Errors that will never succeed on retry (400)'],
  },
  failureModes: [
    'Retry storm during outage — all clients hammer recovering service',
    'Double payment without idempotency key',
    'Unbounded retries exceed user-facing deadline',
    'Retrying non-idempotent side effects in loop',
    'Ignoring Retry-After and violating rate limits',
  ],
  production: {
    reliability: ['Idempotency store with TTL', 'Global retry kill switch during incidents', 'Retry metrics per dependency'],
    observability: ['Count retries, retry success rate, retry latency added', 'Alert on retry ratio spike'],
    performance: ['Cap max backoff below client timeout', 'Use jitter always at scale'],
    maintainability: ['Centralize retry policy in SDK/mesh config', 'Document which endpoints are safe to retry'],
  },
  interview: {
    expectations: ['Exponential backoff + jitter', 'Idempotency for writes', 'Which HTTP codes to retry'],
    commonQuestions: ['Design retry for payment API?', 'Retry storm during outage?'],
    followUps: ['Difference hedged request vs retry?', 'At-least-once semantics?'],
    misconceptions: ['Retry everything on 5xx forever', 'Retries fix slow dependencies'],
    traps: ['POST checkout retry without idempotency key'],
    strongSignals: ['Full jitter formula', 'Retry budget + circuit breaker', 'Idempotency-Key header story'],
  },
  keyTakeaways: [
    'Retry transient failures with capped attempts and total deadline.',
    'Exponential backoff + full jitter prevents synchronized storms.',
    'Only retry idempotent ops; POST needs Idempotency-Key.',
    'Stop retrying when circuit breaker open or dependency overloaded.',
    'Measure retry rate — spike often precedes incident.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why add jitter to backoff?', answerHint: 'Desynchronize clients; avoid thundering herd on recovery.' },
    { level: 'intermediate', question: 'Which HTTP status codes to retry?', answerHint: '5xx, timeouts; 429 with backoff; not most 4xx.' },
    { level: 'advanced', question: 'Prevent duplicate charge on timeout retry?', answerHint: 'Idempotency-Key stored server-side; return same result on replay.' },
  ],
  flashcards: [
    { front: 'Full jitter', back: 'Sleep random(0, cap) where cap = base × 2^attempt' },
    { front: 'Retry storm', back: 'Many clients retry simultaneously and overload recovering service' },
    { front: 'Idempotency-Key', back: 'Client token so duplicate POST replays same effect once' },
  ],
  quickRevision: [
    'Backoff + jitter',
    'Cap attempts + deadline',
    'Idempotent only',
    'No retry on CB open',
    'Retry-After on 429',
  ],
}
