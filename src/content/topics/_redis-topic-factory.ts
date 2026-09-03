import type { TopicContent } from '@/domain/types'

type RedisTopicInput = {
  title: string
  sectionTitle: string
  parentTitle?: string
}

const SECTION_FOCUS: Record<string, string> = {
  'Redis Foundations & Why It Is Fast':
    'in-memory storage, single-threaded command execution, RESP, and when Redis beats a disk database',
  'Environment, Configuration & Clients':
    'install/config, logical databases, client libraries, and connection pooling for Java services',
  'Keys, Commands & Core Operations':
    'key naming, SCAN vs KEYS, introspection commands, and safe operational habits',
  'Data Structures':
    'strings, hashes, lists, sets, sorted sets, HyperLogLog, and matching structure to access pattern',
  'Caching Patterns & Cache-Aside':
    'cache hit/miss path, cache-aside vs write-through, stampede control, and when not to cache',
  'TTL & Expiration':
    'EXPIRE semantics, volatile keys, active/passive expiration, and TTL jitter',
  'Cache Invalidation':
    'invalidate-on-write, versioned keys, stale-while-revalidate, and coherence failure modes',
  'Distributed Caching':
    'local vs remote cache, hot keys, eviction policies, and multi-instance coherence',
  'Sessions, Tokens & Feature State':
    'session stores, auth-token TTL keys, feature flags, and short-lived ephemeral state',
  'Rate Limiting':
    'fixed/sliding windows, token bucket, and atomic INCR/Lua rate-limit implementations',
  'Distributed Locks & Inventory':
    'SET NX EX locks, fencing tokens, Redlock trade-offs, and real-time inventory reservation',
  'Pub/Sub, Queues & Real-Time Messaging':
    'PUBLISH/SUBSCRIBE limits, list/stream queues, leaderboards, and at-most-once messaging caveats',
  'Transactions, Pipelining & Scripting':
    'MULTI/EXEC/WATCH, pipelining round-trip reduction, and Lua for atomic multi-key work',
  'Persistence & Backup':
    'RDB vs AOF durability, restore paths, and what Redis still is not as a system of record',
  'Replication, Partitioning & Clustering':
    'replicas, lag, partitioning, Cluster hash slots, and Sentinel failover basics',
  'Security, Memory & Operations':
    'auth/ACLs, memory limits, SLOWLOG, benchmarks, and production hardening',
}

export function createRedisTopicContent({
  title,
  sectionTitle,
  parentTitle,
}: RedisTopicInput): TopicContent {
  const focus =
    SECTION_FOCUS[sectionTitle] ??
    'Redis data structures, caching semantics, and production trade-offs'
  const parent = parentTitle ? ` It is an atomic part of ${parentTitle}.` : ''

  return {
    whatIsIt:
      `${title} is a Redis topic in ${sectionTitle}.${parent} ` +
      'Treat Redis as an in-memory data-structure server: explain the command path, memory cost, and failure mode — not only the happy-path API call.',
    whyExists:
      `${title} exists because applications need microsecond-scale reads, ephemeral state, and coordination that a primary SQL database should not serve on every request. ` +
      `A strong answer covers ${focus}.`,
    mentalModel:
      'Client → Redis command → in-memory structure → optional persistence/replication. ' +
      'Always ask: what is the key, what structure, what TTL, what happens on miss/eviction/failover, and is Redis the system of record or a cache?',
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: [
          `Place ${title} in the Redis request path: client, command, data structure, memory, and optional disk/replica.`,
          'Name the key design and structure (string, hash, list, set, zset, stream, HyperLogLog).',
          'State TTL, eviction, and invalidation behavior under load.',
          'State atomicity needs: single command, pipeline, MULTI/EXEC, or Lua.',
          'State durability and ops: RDB/AOF, replica lag, Cluster/Sentinel, memory, and SLOWLOG.',
        ],
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Track boundary',
        text:
          'C10 owns Redis mechanics and application caching patterns. Track D owns distributed-cache architecture depth; ' +
          'C7 owns the primary database; C9 owns auth-token security policy even when tokens are stored in Redis.',
      },
    ],
    internals: [
      {
        type: 'list',
        items: [
          'Redis keeps the working set in RAM and executes most commands on a single-threaded event loop, which avoids lock contention but makes slow commands dangerous.',
          'RESP is a simple text protocol; pipelining reduces round trips without making multi-command batches transactional by itself.',
          'Cache-aside: miss → load DB → SET; hit returns Redis value. Invalidation and TTL decide freshness.',
          'Persistence (RDB/AOF) and replication improve recoverability but do not make Redis a full ACID system of record by default.',
          'Cluster partitions keys by hash slot; hot keys and cross-slot multi-key commands are common production traps.',
        ],
      },
    ],
    failureModes: [
      `Using ${title} without a TTL, memory limit, or invalidation story, then paging forever or serving stale data.`,
      'Treating Pub/Sub as durable messaging, or Redis as the only source of truth for money/inventory without a durable store.',
      'Blocking the event loop with KEYS, huge VALUES, or slow Lua under production traffic.',
      'Distributed locks without fencing tokens / correct TTL, causing double processing after lease expiry.',
      'Ignoring hot keys, stampede on mass TTL expiry, or replica lag when reading from replicas.',
    ],
    production: {
      performance: [
        'Measure hit ratio, p99 latency, memory fragmentation, eviction rate, and command mix before adding more Redis capacity.',
        'Prefer pipelining/Lua for multi-step work; avoid N+1 Redis round trips from application loops.',
      ],
      reliability: [
        'Define what happens on Redis outage: fail open, fail closed, or degrade with local/DB fallback.',
        'Use short TTLs, versioned keys, and explicit invalidation for mutable business data.',
      ],
      maintainability: [
        'Standardize key namespaces (service:entity:id) and document structure + TTL per key family.',
        'Keep Redis concerns in a thin client/repository layer — not sprinkled through controllers.',
      ],
      observability: [
        'Watch used_memory, evicted_keys, rejected_connections, instantaneous_ops_per_sec, and SLOWLOG.',
        'Correlate API latency spikes with Redis command latency and hot-key evidence.',
      ],
    },
    interview: {
      expectations: [
        `Define ${title} in ${sectionTitle} and name the Redis structure or pattern involved.`,
        'Explain cache hit/miss, TTL/invalidation, and one production failure mode.',
        'Distinguish Redis as cache/coordinator from the durable primary database.',
      ],
      commonQuestions: [
        `How does ${title} work in Redis?`,
        'When would you use Redis vs the primary database?',
        'How would you prevent stampede, stale reads, or lock loss?',
      ],
      followUps: [
        'What happens if Redis restarts or the primary fails over?',
        'Which data structure and key design would you choose, and why?',
      ],
      misconceptions: [
        'Redis is always durable like PostgreSQL.',
        'Pub/Sub guarantees delivery and replay.',
        'More caching always improves correctness and latency.',
      ],
      traps: [
        'Naming commands without discussing memory, TTL, eviction, or atomicity.',
        'Claiming Redlock/SET NX is perfectly safe without fencing and TTL analysis.',
      ],
      strongSignals: [
        'Connects structure choice to access pattern and memory cost.',
        'Discusses hit/miss path, invalidation, hot keys, and outage behavior explicitly.',
      ],
    },
    keyTakeaways: [
      `${title} belongs to ${sectionTitle}.`,
      `Focus: ${focus}.`,
      'Structure → key/TTL → atomicity → memory/ops → outage behavior.',
    ],
    interviewQuestions: [
      {
        level: 'basic',
        question: `What is ${title}, and which Redis concept does it rely on?`,
        answerHint: `Place it in ${sectionTitle}; name the structure, command, or caching pattern.`,
      },
      {
        level: 'intermediate',
        question: `Which trade-offs matter for ${title} under production load?`,
        answerHint: 'Discuss TTL, invalidation, memory/eviction, atomicity, or messaging durability as applicable.',
      },
      {
        level: 'advanced',
        question: `How would you operate and debug ${title} during a latency or correctness incident?`,
        answerHint: `Use ${focus} plus SLOWLOG, memory metrics, hit ratio, replica lag, and key/structure evidence.`,
      },
    ],
    flashcards: [
      { front: title, back: `${sectionTitle}: ${focus}.` },
      {
        front: `${title} review loop`,
        back: 'Key → structure → TTL/invalidation → atomicity → memory/failover.',
      },
    ],
    quickRevision: [
      `${title} — ${sectionTitle}`,
      `Focus: ${focus}`,
      'In-memory data-structure server',
      'Cache/coordinator — not default system of record',
    ],
  }
}
