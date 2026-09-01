import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Circuit breaker wraps calls to failing dependency — CLOSED normal, OPEN fail fast without calling, HALF_OPEN probe recovery. After failure threshold, opens circuit saving threads and cascading failure. Resilience4j / Spring Cloud CircuitBreaker. Pair with timeout and bulkhead.',
  whyExists:
    'Retry storm to dead payment service ties up all threads — users see timeouts everywhere. Open circuit returns immediate fallback error — system stays responsive for healthy paths and gives dependency time to recover.',
  mentalModel:
    'Like electrical breaker — flip open when too much fault current. Half-open lets one test call through — success closes, failure reopens. Monitor state transitions — chronic open means dependency outage.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Circuit breaker states',
      diagram: `stateDiagram-v2
  [*] --> Closed
  Closed --> Open: failure rate > threshold
  Open --> HalfOpen: wait duration elapsed
  HalfOpen --> Closed: probe success
  HalfOpen --> Open: probe fail
  Closed --> Closed: success`,
    },
    {
      type: 'table',
      headers: ['State', 'Behavior'],
      rows: [
        ['CLOSED', 'Calls pass; count failures in sliding window'],
        ['OPEN', 'Immediate CallNotPermittedException / fallback'],
        ['HALF_OPEN', 'Limited trial calls test recovery'],
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Resilience4j circuit breaker',
      code: `CircuitBreaker cb = CircuitBreaker.of("inventory",
    CircuitBreakerConfig.custom()
        .failureRateThreshold(50)
        .waitDurationInOpenState(Duration.ofSeconds(30))
        .slidingWindowSize(10)
        .build());

Supplier<Stock> guarded = CircuitBreaker.decorateSupplier(cb,
    () -> inventoryClient.getStock(sku));`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Recommendations service down — breaker opens after 50% failures in 10 calls. Product page skips recommendations section (fallback empty) — core product details still load from healthy catalog service.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Sliding window vs count-based failure recording',
        'Slow call rate threshold optional — latency trips breaker',
        'Recorded exceptions — ignore 404 if business not failure',
        'Distributed systems: each instance own breaker — aggregate alerts still needed',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Fail fast under dependency outage', 'Prevents retry/thread exhaustion', 'Automatic recovery probe'],
    disadvantages: ['False open on transient spike', 'Fallback logic required', 'Per-instance state in cluster'],
    alternatives: ['Bulkhead only', 'Manual feature flag kill switch'],
    whenToUse: ['All external HTTP/RPC dependencies', 'Optional enrichment paths'],
    whenNotToUse: ['Critical path without fallback — still need timeout + fix dependency'],
  },
  failureModes: [
    'Breaker open on critical path with no fallback — hard fail',
    'Threshold too sensitive — flapping',
    'Too lenient — never opens during outage',
    'Fallback calls same broken dependency',
    'Ignoring half-open probe storms',
  ],
  production: {
    reliability: ['Fallback defaults: cache stale, degraded UI', 'Combine timeout < breaker window'],
    observability: ['Breaker state metrics and events', 'Alert chronic OPEN'],
    maintainability: ['Document fallback behavior per dependency'],
  },
  interview: {
    expectations: ['Three states', 'When opens', 'Half-open purpose', 'Fallback design'],
    commonQuestions: ['Circuit breaker pattern?', 'vs retry alone?', 'Design fallback?'],
    followUps: ['Bulkhead combination?', 'Distributed breaker?'],
    misconceptions: ['Breaker fixes downstream', 'Retry unlimited with breaker closed is fine'],
    traps: ['No fallback for user-critical call when open'],
    strongSignals: ['State machine, sliding window, half-open probe, meaningful fallback, metrics'],
  },
  keyTakeaways: [
    'CLOSED → OPEN on failure threshold; fail fast when OPEN.',
    'HALF_OPEN probes recovery before fully closing.',
    'Requires fallback or graceful error for user experience.',
    'Combine with timeouts and bulkheads.',
    'Monitor OPEN state as dependency health signal.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Circuit breaker three states?', answerHint: 'Closed normal; open fail fast; half-open test recovery.' },
    { level: 'intermediate', question: 'Why not retry forever?', answerHint: 'Exhausts threads amplifying outage — breaker stops calls giving system air.' },
    { level: 'advanced', question: 'Fallback design for product recommendations?', answerHint: 'Return empty/cached popular items; core page loads; log degradation; do not block checkout.' },
  ],
  flashcards: [
    { front: 'Circuit OPEN', back: 'Fail fast without calling failing dependency' },
    { front: 'HALF_OPEN', back: 'Trial calls to test if dependency recovered' },
    { front: 'Sliding window', back: 'Recent call outcomes determine failure rate' },
    { front: 'Fallback', back: 'Degraded response when breaker open' },
  ],
  quickRevision: ['Closed Open HalfOpen', 'Fail fast when open', 'Fallback required', 'With timeout bulkhead', 'Alert chronic open'],
}
