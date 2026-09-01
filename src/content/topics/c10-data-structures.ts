import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Redis provides in-memory data structures: Strings (cache, counters), Hashes (objects), Lists (queues), Sets/Sorted Sets (leaderboards, rate limit windows), HyperLogLog (cardinality), Streams (Kafka-lite), Bitmap, GEO. Choosing the right structure affects memory, latency, and atomic operations (INCR, ZADD, HSET).',
  whyExists:
    'Plain key-value strings force JSON serialize everything. Native structures enable atomic increments, range queries, and bounded memory patterns without round-trips. Backend interviews expect knowing when ZSET beats STRING for leaderboards or HASH for field updates.',
  mentalModel:
    'Pick structure matching access pattern. Need atomic counter? STRING INCR. Object with partial updates? HASH. Top-N scores? ZSET. Message fan-out? Streams or external Kafka — not Lists for durable event log.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Structure', 'Use case', 'Key commands'],
      rows: [
        ['String', 'Cache blob, session, lock value', 'GET SET SETEX INCR'],
        ['Hash', 'User profile fields, cart lines', 'HGET HSET HINCRBY'],
        ['List', 'Recent items stack (bounded)', 'LPUSH LTRIM RPOP'],
        ['Set', 'Unique tags, online users', 'SADD SISMEMBER'],
        ['Sorted Set (ZSET)', 'Leaderboard, delayed queue by score', 'ZADD ZRANGE ZRANGEBYSCORE'],
        ['Stream', 'Consumer groups, event log', 'XADD XREADGROUP'],
        ['HyperLogLog', 'Unique visitors estimate', 'PFADD PFCOUNT'],
      ],
    },
    {
      type: 'list',
      items: [
        'All ops single-threaded per shard — design keys to spread hot spots',
        'Memory: ziplist/listpack encodings for small collections — know overhead cliffs',
        'TTL applies to key — whole hash expires together',
        'JSON module (RedisJSON) optional — still understand core types',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'redis',
      caption: 'Rate limit sliding window with ZSET',
      code: `# key: ratelimit:{userId}
ZADD ratelimit:42 NOW requestId
ZREMRANGEBYSCORE ratelimit:42 0 (NOW-windowMs)
ZCARD ratelimit:42
EXPIRE ratelimit:42 windowSeconds`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Spring RedisTemplate hash for cart',
      code: `redis.opsForHash().put("cart:" + userId, sku, qty);
redis.opsForHash().increment("cart:" + userId, sku, 1);`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'SDS (Simple Dynamic String) backs string values',
        'Skip list + hash table dual structure for ZSET',
        'Streams: radix tree of listpacks — persistent consumer group offsets',
        'Eviction policies (allkeys-lru) apply when maxmemory hit',
        'Single key hot spot limits one CPU core on shard',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Rich atomic ops in-memory', 'Sub-ms latency', 'Versatile patterns without extra services'],
    disadvantages: ['Memory bound — not primary DB', 'Hot key on single structure', 'Persistence trade-offs separate topic'],
    alternatives: ['Memcached strings only', 'Dedicated Kafka for streams', 'DB for durable source of truth'],
    whenToUse: ['Cache, sessions, rate limits, leaderboards, pub/sub light'],
    whenNotToUse: ['Primary transactional store', 'Large analytics scans'],
  },
  failureModes: [
    'Giant STRING values block memory and slow network',
    'UNLINK vs DEL on huge keys still latency spike',
    'Wrong type command on key — WRONGTYPE error',
    'ZSET unbounded growth without TTL/trim',
    'Using List as durable queue without persistence plan',
  ],
  production: {
    performance: ['Shard hot keys', 'Pipeline batch commands', 'Prefer HASH field updates over full JSON rewrite'],
    scalability: ['Redis Cluster hash tags {user}:cart:42 co-locate related keys'],
    observability: ['Memory per key pattern via --bigkeys', 'Slowlog monitoring'],
    cost: ['Right structure avoids wasted memory'],
  },
  interview: {
    expectations: ['Match structure to problem', 'ZSET for leaderboards/rate limits', 'Atomic INCR'],
    commonQuestions: ['Redis data structures?', 'Implement leaderboard?', 'Hash vs String JSON?'],
    followUps: ['Streams vs Kafka?', 'Hot key mitigation?'],
    misconceptions: ['Redis is only string cache', 'Lists are durable queues by default'],
    traps: ['Storing everything as serialized JSON string'],
    strongSignals: ['ZSET sliding window, HASH partial update, memory awareness, cluster hash tags'],
  },
  keyTakeaways: [
    'Strings for cache/counters; Hashes for object fields; ZSET for ranked/time windows.',
    'Operations atomic per key — design for access pattern.',
    'Spread hot keys across cluster slots/hash tags thoughtfully.',
    'Streams for lightweight logs; Kafka for heavy event platform.',
    'Monitor memory encoding and big keys.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Common Redis structures?', answerHint: 'String, Hash, List, Set, Sorted Set, Stream, HyperLogLog.' },
    { level: 'intermediate', question: 'Leaderboard with Redis?', answerHint: 'ZADD score member; ZREVRANGE top N; O(log N) updates.' },
    { level: 'advanced', question: 'Hash vs JSON string for user profile?', answerHint: 'Hash allows field-level HSET/HGET without parse/rewrite whole blob — less bandwidth if partial reads/writes.' },
  ],
  flashcards: [
    { front: 'Redis ZSET', back: 'Sorted set — score + member; leaderboards, time windows' },
    { front: 'Redis Hash', back: 'Field map under one key — partial object updates' },
    { front: 'INCR', back: 'Atomic increment on string — counters without race' },
    { front: 'Hash tag {user}', back: 'Forces related keys to same cluster slot' },
  ],
  quickRevision: ['String cache/counter', 'Hash object fields', 'ZSET rank/time', 'Atomic per key', 'Avoid hot spots'],
}
