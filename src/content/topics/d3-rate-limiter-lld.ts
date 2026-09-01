import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Rate Limiter LLD designs an in-process or library component that tracks per-key request counts using algorithms (fixed window, sliding window, token bucket) and exposes allow/deny — the object-oriented layer before Redis-backed HLD (d10-rate-limiter).',
  whyExists:
    'Interviewers want algorithm + clean API + thread safety in one session. LLD scope: RateLimiter interface, algorithm strategies, and optional decorator for middleware — without full distributed Redis cluster design.',
  mentalModel:
    'Client calls `limiter.tryAcquire(key, cost)` → algorithm checks quota for key → returns Result(allowed, remaining, resetAt). Algorithms are Strategy implementations. Store is in-memory ConcurrentHashMap of counter state. Factory picks algorithm from config.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Clarify: per user/IP/API key, limits per window, burst allowed?, thread safety?',
        'Classes: RateLimiter (interface), FixedWindowLimiter, TokenBucketLimiter, SlidingWindowCounter, RateLimitConfig, LimitStore, AcquireResult',
        'tryAcquire(key): load/create state → algorithm decision → update atomically',
        'Middleware decorator wraps handler: deny → 429 exception',
        'Mention HLD: shared Redis store for multi-instance — reference d10',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Interview walkthrough',
      text: 'Compare fixed window vs token bucket verbally. Implement TokenBucketLimiter with refill. Show synchronized or AtomicLong per key. 2 min on distributed gap (per-node limit × N).',
    },
  ],
  architecture: {
    mermaid: `classDiagram
  class RateLimiter {
    <<interface>>
    +tryAcquire(String key, int cost): AcquireResult
  }
  class TokenBucketLimiter {
    -buckets: ConcurrentHashMap
    -capacity: int
    -refillRate: double
  }
  class FixedWindowLimiter {
    -windows: ConcurrentHashMap
  }
  class RateLimitMiddleware {
    -limiter: RateLimiter
    +handle(Request)
  }
  RateLimiter <|.. TokenBucketLimiter
  RateLimiter <|.. FixedWindowLimiter
  RateLimitMiddleware --> RateLimiter`,
    caption: 'Strategy algorithms behind common interface',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Token bucket tryAcquire',
      code: `public AcquireResult tryAcquire(String key, int cost) {
  BucketState state = buckets.computeIfAbsent(key, k -> new BucketState(capacity));
  synchronized (state) {
    refill(state);
    if (state.tokens >= cost) {
      state.tokens -= cost;
      return AcquireResult.allowed(state.tokens, state.nextRefillAt());
    }
    return AcquireResult.denied(state.nextRefillAt());
  }
}

private void refill(BucketState s) {
  long now = System.nanoTime();
  double added = (now - s.lastRefill) * refillRate / 1e9;
  s.tokens = Math.min(capacity, s.tokens + added);
  s.lastRefill = now;
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Fixed window counter',
      code: `public AcquireResult tryAcquire(String key, int cost) {
  long window = clock.millis() / windowMs;
  WindowCounter wc = windows.computeIfAbsent(key, k -> new WindowCounter(window));
  synchronized (wc) {
    if (wc.windowId != window) { wc.windowId = window; wc.count = 0; }
    if (wc.count + cost <= limit) {
      wc.count += cost;
      return AcquireResult.allowed(limit - wc.count, (window + 1) * windowMs);
    }
    return AcquireResult.denied((window + 1) * windowMs);
  }
}`,
    },
  ],
  tradeoffs: {
    advantages: ['Strategy swap algorithms', 'Testable with fake clock', 'Clear middleware integration'],
    disadvantages: ['In-memory not shared across pods', 'Per-key maps grow — need TTL eviction'],
    alternatives: ['Guava RateLimiter single-key', 'Redis Lua at scale (HLD)'],
    whenToUse: ['LLD interviews', 'Single-node protection'],
    whenNotToUse: ['Global API quota across fleet without shared store'],
  },
  failureModes: [
    'Clock jump breaks window boundaries',
    'Memory leak — keys never evicted',
    'Race without sync on bucket update',
    'Boundary burst in fixed window double allowance',
  ],
  interview: {
    expectations: ['Two algorithms explained', 'Thread safety approach', 'Distributed limitation acknowledged'],
    commonQuestions: ['Design rate limiter LLD', 'Token bucket vs sliding window?'],
    followUps: ['Weighted cost per route?', 'Fail open if store down? — HLD'],
    misconceptions: ['In-memory map enough for production cluster'],
    traps: ['No mention of 429 / Retry-After in API layer'],
    strongSignals: ['Inject Clock for tests', 'Reference d10 for Redis'],
  },
  keyTakeaways: [
    'RateLimiter interface + algorithm strategies.',
    'Token bucket allows controlled burst.',
    'Fixed window simple but boundary spike.',
    'Thread-safe per-key state (sync or locks).',
    'LLD in-memory; HLD needs Redis — see d10-rate-limiter.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Rate limiter LLD classes?', answerHint: 'RateLimiter, algorithm impls, AcquireResult, optional middleware.' },
    { level: 'intermediate', question: 'Token bucket fields?', answerHint: 'capacity, tokens, refill rate, last refill time.' },
    { level: 'advanced', question: 'Multi-instance problem?', answerHint: 'Each node own map → effective N× limit; central Redis with atomic ops.' },
  ],
  flashcards: [
    { front: 'Token bucket', back: 'Refill tokens over time; burst up to capacity' },
    { front: 'Fixed window spike', back: '2× traffic at window boundaries possible' },
    { front: 'AcquireResult', back: 'allowed, remaining, reset/retry time' },
    { front: 'LLD vs d10 HLD', back: 'LLD library/in-memory; HLD Redis cluster + policies' },
  ],
  quickRevision: [
    'Strategy algorithms',
    'tryAcquire(key, cost)',
    'Sync per-key state',
    'Fake clock tests',
    'Distributed → Redis',
  ],
}
