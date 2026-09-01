import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Circuit breaker protects callers from failing dependencies: CLOSED (normal), OPEN (fail fast no calls), HALF_OPEN (trial calls). After failure threshold, opens circuit; after cooldown allows probe requests. Libraries: Resilience4j, Hystrix (legacy), Istio outlier detection.',
  whyExists:
    'Retrying dead payment service wastes threads and amplifies outage. Circuit breaker fails fast, gives dependency time to recover, and prevents cascading resource exhaustion across the fleet.',
  mentalModel:
    'Electrical breaker trips when current overloads. Stop sending traffic to burning house; periodically test if power restored. Half-open: one careful request through — success closes, failure reopens.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Circuit breaker states',
      diagram: `stateDiagram-v2
  [*] --> Closed
  Closed --> Open: failures >= threshold
  Open --> HalfOpen: wait duration
  HalfOpen --> Closed: probe success
  HalfOpen --> Open: probe fail
  Closed --> Closed: success reset count`,
    },
    {
      type: 'list',
      items: [
        'Configure failureRateThreshold, waitDurationInOpenState, permittedCallsInHalfOpenState.',
        'Count slow calls as failures if exceeds timeout threshold.',
        'Fallback: return cached/default when OPEN — degrade gracefully.',
        'Combine with timeout and bulkhead — CB alone insufficient.',
        'Monitor state transitions metric.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Resilience4j circuit breaker',
      code: `CircuitBreaker cb = CircuitBreaker.of("fraud", CircuitBreakerConfig.custom()
    .failureRateThreshold(50)
    .waitDurationInOpenState(Duration.ofSeconds(30))
    .slidingWindowSize(20)
    .build());

Supplier<FraudResult> decorated = CircuitBreaker.decorateSupplier(cb,
    () -> fraudClient.score(order));

try {
  return decorated.get();
} catch (CallNotPermittedException e) {
  return FraudResult.deferredReview(); // fallback when OPEN
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Sliding window: count-based or time-based failure rate.',
        'Half-open limits concurrent probes — one success insufficient if rate bad.',
        'Distributed CB hard — each instance local state; consider coordination or outlier detection at mesh.',
        'OPEN throws CallNotPermittedException immediately — no thread blocked.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Fail fast', 'Recovery time for dependency', 'Prevent cascade', 'Fallback path'],
    disadvantages: ['False open on brief spike', 'Stale fallback data', 'Per-instance state diverges'],
    alternatives: ['Retry only — amplifies load', 'Bulkhead without CB — still calls failing dep'],
    whenToUse: ['Every external dependency call', 'Known flaky third-party APIs'],
    whenNotToUse: ['Local in-memory call — overhead pointless'],
  },
  failureModes: [
    'Threshold too sensitive — flapping open/closed',
    'No fallback — user sees hard error when OPEN',
    'Half-open flood — all instances probe simultaneously',
    'Slow calls not counted — threads still exhaust',
    'OPEN circuit hides dependency recovery from metrics',
  ],
  production: {
    reliability: ['CB + timeout + bulkhead stack', 'Fallback degraded mode documented'],
    observability: ['Metric cb_state, failure rate, slow call rate', 'Alert prolonged OPEN'],
    maintainability: ['Central config per dependency SLA', 'Runbook when fraud CB open'],
  },
  interview: {
    expectations: ['Three states', 'Fail fast purpose', 'Combine with timeout/retry'],
    commonQuestions: ['What is circuit breaker?', 'Payment API down — design?'],
    followUps: ['Half-open purpose?', 'Distributed CB challenge?'],
    misconceptions: ['CB replaces retries entirely', 'Open forever until manual reset'],
    traps: ['Retry into open circuit aggressively'],
    strongSignals: ['State machine clear', 'Fallback tier', 'Resilience4j config', 'With bulkhead'],
  },
  keyTakeaways: [
    'CLOSED → OPEN on failure threshold; fail fast when OPEN.',
    'HALF_OPEN probes recovery after cooldown.',
    'Pair with timeout, bulkhead, limited retry.',
    'Fallback degrades gracefully when circuit open.',
    'Monitor state and failure rate per dependency.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Circuit breaker three states?', answerHint: 'Closed normal; Open fail fast; Half-open trial probes.' },
    { level: 'intermediate', question: 'Why not retry forever?', answerHint: 'Amplifies load on failing dep; exhausts threads; CB stops calls to recover.' },
    { level: 'advanced', question: 'Half-open synchronized probe storm?', answerHint: 'Limit permittedCallsInHalfOpen; jitter wait duration; mesh outlier detection.' },
  ],
  flashcards: [
    { front: 'Circuit OPEN', back: 'Fail fast — reject calls without invoking dependency' },
    { front: 'Half-open', back: 'Test if dependency recovered with limited probe calls' },
    { front: 'CallNotPermittedException', back: 'Resilience4j thrown when circuit is OPEN' },
  ],
  quickRevision: [
    'Closed Open HalfOpen',
    'Fail fast',
    'Timeout + bulkhead',
    'Fallback degrade',
    'Monitor state',
  ],
}
