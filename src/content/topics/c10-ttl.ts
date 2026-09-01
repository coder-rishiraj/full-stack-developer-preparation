import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'TTL (Time To Live) on Redis keys sets automatic expiration via EXPIRE, SETEX, or PX option. After TTL elapses, key is deleted (lazy + active expiration). Used to bound cache staleness, session lifetime, rate limit window cleanup, and prevent unbounded memory growth.',
  whyExists:
    'Without TTL, cache grows until maxmemory eviction evicts unpredictable keys. TTL gives predictable staleness SLA and reclaims memory for time-bound data (OTP codes, session tokens, short-lived locks).',
  mentalModel:
    'Every cache key should answer: how stale is acceptable? Set TTL accordingly. TTL is safety net not primary invalidation for mutable critical data — still DELETE on write. Jitter TTL to prevent synchronized expiry stampedes.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Command', 'Effect', 'Note'],
      rows: [
        ['SET key value EX 300', 'Value + 300s TTL atomically', 'Prefer over SET + EXPIRE race'],
        ['EXPIRE key 60', 'TTL on existing key', 'Returns 0 if key missing'],
        ['TTL key', 'Remaining seconds', '-1 no expiry; -2 missing'],
        ['PERSIST key', 'Remove TTL', 'Rare; audit when used'],
      ],
    },
    {
      type: 'list',
      items: [
        'Passive expiration: key deleted on access after expiry',
        'Active expiration: Redis samples keys periodically — slight delay after TTL',
        'TTL jitter: base ± random percent spreads herd',
        'Refresh TTL on access (session sliding) vs fixed from creation',
        'No TTL + maxmemory → eviction policy (allkeys-lru) may drop hot keys',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'SET with TTL and jitter',
      code: `int baseTtl = 300;
int jitter = ThreadLocalRandom.current().nextInt(30);
redis.opsForValue().set(key, value, Duration.ofSeconds(baseTtl + jitter));`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Redis expires dict tracks keys with TTL separately',
        'Active expire cycle frequency depends on CPU — keys may live slightly past TTL',
        'Redisson and Spring Cache translate cacheNames TTL to Redis EX',
        'KEYS with TTL on large datasets — prefer SCAN + TTL audit scripts',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Automatic cleanup', 'Bounded staleness', 'Memory reclamation without manual DEL'],
    disadvantages: ['Not instant delete at exact second', 'Wrong TTL → long stale or excess churn', 'Synchronized expiry without jitter'],
    alternatives: ['Manual invalidation only — risky for memory', 'Version keys without time expiry'],
    whenToUse: ['All cache entries', 'Sessions, OTP, locks, rate limit buckets'],
    whenNotToUse: ['Immutable reference data you want until explicit change — still set long TTL or invalidation'],
  },
  failureModes: [
    'Forgot EXPIRE — memory leak until eviction',
    'Same TTL on millions of keys — thundering herd',
    'TTL too long for price data',
    'TTL too short — low hit rate and DB load',
    'Assuming exact-time deletion for correctness',
  ],
  production: {
    performance: ['Jittered TTL', 'SETEX atomic', 'Monitor expire cycle CPU'],
    reliability: ['TTL + invalidation together for mutable data'],
    observability: ['Track keys without TTL in prod audits', 'Memory usage vs TTL distribution'],
    cost: ['Shorter TTL reduces memory footprint'],
  },
  interview: {
    expectations: ['SETEX vs EXPIRE', 'Active vs passive expiry', 'Jitter purpose', 'TTL vs invalidation'],
    commonQuestions: ['Choose cache TTL?', 'Thundering herd on expiry?', 'Redis delete timing exact?'],
    followUps: ['Sliding session TTL?', 'maxmemory interaction?'],
    misconceptions: ['TTL replaces write invalidation', 'Key gone exactly at TTL second always'],
    traps: ['Infinite TTL on user-specific cache'],
    strongSignals: ['Jitter, SETEX atomic, TTL as safety net, audit keys without TTL'],
  },
  keyTakeaways: [
    'Set TTL on virtually every cache key.',
    'Use SET with EX/PX atomically.',
    'Jitter expiry times to reduce stampedes.',
    'TTL bounds staleness; invalidation gives correctness.',
    'Active expiration may delay deletion slightly past TTL.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What Redis TTL does?', answerHint: 'Auto-delete key after N seconds — bounds staleness and memory.' },
    { level: 'intermediate', question: 'Why jitter TTL?', answerHint: 'Prevent many hot keys expiring same second causing synchronized miss storm.' },
    { level: 'advanced', question: 'TTL alone for product prices enough?', answerHint: 'No — invalidate on price change; TTL only safety net if invalidation fails.' },
  ],
  flashcards: [
    { front: 'SETEX', back: 'Set value with TTL in one atomic command' },
    { front: 'TTL jitter', back: 'Randomize expiry — spreads thundering herd' },
    { front: 'Passive expiration', back: 'Key removed when accessed after expiry time' },
    { front: 'TTL vs invalidation', back: 'TTL bounds staleness; invalidation ensures freshness on change' },
  ],
  quickRevision: ['EX on every key', 'SETEX atomic', 'Add jitter', 'Pair with invalidation', 'Not exact delete time'],
}
