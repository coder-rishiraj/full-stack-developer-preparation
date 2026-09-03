import type { Priority } from '@/domain/types'
import type { SectionSeed, TopicSeed } from './build'

const REDIS = ['redis'] as const
const M56 = [5, 6]
const M67 = [6, 7]

function item(
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  const { tags, executionPriority, ...rest } = extra
  return {
    id,
    title,
    priority,
    months: extra.months ?? (priority === 'tier1' ? M56 : M67),
    tags: [...REDIS, ...(tags ?? [])],
    executionPriority:
      executionPriority ?? (priority === 'tier1' ? 'p0' : priority === 'tier2' ? 'p1' : 'later'),
    ...rest,
  }
}

function nest(
  parent: string,
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  return item(id, title, priority, {
    ...extra,
    curriculumLevel: 'nested-concept',
    parentTopicId: parent,
  })
}

function section(id: string, title: string, order: number, topics: TopicSeed[]): SectionSeed {
  return {
    id,
    track: 'C',
    title,
    order,
    defaultKind: 'theory',
    defaultDepth: 'deep',
    topics,
  }
}

/**
 * C10.1–C10.16 — Redis as a data-structure server for backend interviews.
 * Shape follows GeeksforGeeks Redis intro, TutorialsPoint Redis map, and Redis
 * production use-case tutorials (caching, sessions, queues, locks) — shape only,
 * not copied prose. Distributed-cache architecture depth stays in Track D.
 * Existing C10 topic IDs remain stable.
 */
export const TRACK_C_REDIS_SECTIONS: SectionSeed[] = [
  section('C10.1', 'Redis Foundations & Why It Is Fast', 150, [
    item('c10-redis-foundations', 'Redis Foundations'),
    nest('c10-redis-foundations', 'c10-what-is-redis', 'What Redis Is'),
    nest('c10-redis-foundations', 'c10-in-memory-storage', 'In-Memory Storage'),
    nest('c10-redis-foundations', 'c10-single-threaded-event-loop', 'Single-Threaded Event Loop'),
    nest('c10-redis-foundations', 'c10-resp-protocol', 'RESP Protocol'),
    nest('c10-redis-foundations', 'c10-use-cases', 'Caching, Sessions & Real-Time Use Cases'),
    nest('c10-redis-foundations', 'c10-real-world-apps', 'Real-World Application Patterns', 'tier2'),
  ]),

  section('C10.2', 'Environment, Configuration & Clients', 151, [
    item('c10-environment', 'Environment & Configuration'),
    nest('c10-environment', 'c10-install-setup', 'Install & Local Setup'),
    nest('c10-environment', 'c10-configuration', 'redis.conf Essentials'),
    nest('c10-environment', 'c10-logical-databases', 'Logical Databases (db 0…N)'),
    nest('c10-environment', 'c10-client-connection', 'Client Connection Model'),
    nest('c10-environment', 'c10-java-client', 'Java / Lettuce / Jedis Clients'),
    nest('c10-environment', 'c10-connection-pooling-redis', 'Connection Pooling', 'tier2'),
  ]),

  section('C10.3', 'Keys, Commands & Core Operations', 152, [
    item('c10-keys-commands', 'Keys & Commands'),
    nest('c10-keys-commands', 'c10-key-naming', 'Key Naming Conventions'),
    nest('c10-keys-commands', 'c10-key-commands', 'EXISTS, DEL, TYPE, SCAN'),
    nest('c10-keys-commands', 'c10-keyspace-scan', 'KEYS vs SCAN'),
    nest('c10-keys-commands', 'c10-server-commands', 'INFO, MONITOR & Server Introspection', 'tier2'),
  ]),

  section('C10.4', 'Data Structures', 153, [
    item('c10-data-structures', 'Redis Data Structures'),
    nest('c10-data-structures', 'c10-strings', 'Strings'),
    nest('c10-data-structures', 'c10-hashes', 'Hashes'),
    nest('c10-data-structures', 'c10-lists', 'Lists'),
    nest('c10-data-structures', 'c10-sets', 'Sets'),
    nest('c10-data-structures', 'c10-sorted-sets', 'Sorted Sets'),
    nest('c10-data-structures', 'c10-hyperloglog', 'HyperLogLog', 'tier2'),
    nest('c10-data-structures', 'c10-bitmaps-bitfields', 'Bitmaps & Bitfields', 'tier2'),
    nest('c10-data-structures', 'c10-choosing-structure', 'Choosing the Right Structure'),
  ]),

  section('C10.5', 'Caching Patterns & Cache-Aside', 154, [
    item('c10-cache-aside', 'Cache-Aside', 'tier1', { tags: ['caching'] }),
    nest('c10-cache-aside', 'c10-cache-hit-miss', 'Cache Hit & Cache Miss'),
    nest('c10-cache-aside', 'c10-read-through-write-through', 'Read-Through & Write-Through'),
    nest('c10-cache-aside', 'c10-write-behind', 'Write-Behind / Write-Back', 'tier2'),
    nest('c10-cache-aside', 'c10-when-not-to-cache', 'When Not to Cache'),
    nest('c10-cache-aside', 'c10-stampede', 'Cache Stampede / Thundering Herd'),
  ]),

  section('C10.6', 'TTL & Expiration', 155, [
    item('c10-ttl', 'TTL'),
    nest('c10-ttl', 'c10-expire-commands', 'EXPIRE, PEXPIRE & TTL Commands'),
    nest('c10-ttl', 'c10-volatile-vs-persistent-keys', 'Volatile vs Persistent Keys'),
    nest('c10-ttl', 'c10-expiration-strategies', 'Passive vs Active Expiration'),
    nest('c10-ttl', 'c10-ttl-jitter', 'TTL Jitter to Avoid Synchronized Expiry'),
  ]),

  section('C10.7', 'Cache Invalidation', 156, [
    item('c10-invalidation', 'Cache Invalidation', 'tier1', {
      tags: ['caching'],
      related: ['d7-cache-invalidation'],
    }),
    nest('c10-invalidation', 'c10-invalidate-on-write', 'Invalidate-on-Write'),
    nest('c10-invalidation', 'c10-versioned-keys', 'Versioned / Namespaced Keys'),
    nest('c10-invalidation', 'c10-stale-while-revalidate', 'Stale-While-Revalidate', 'tier2'),
    nest('c10-invalidation', 'c10-invalidation-hardest', 'Why Invalidation Is Hard'),
  ]),

  section('C10.8', 'Distributed Caching', 157, [
    item('c10-distributed-caching', 'Distributed Caching', 'tier1', {
      related: ['d5-caching'],
    }),
    nest('c10-distributed-caching', 'c10-local-vs-remote-cache', 'Local Cache vs Redis'),
    nest('c10-distributed-caching', 'c10-cache-coherence', 'Coherence Across Instances'),
    nest('c10-distributed-caching', 'c10-hot-keys', 'Hot Keys & Skew'),
    nest('c10-distributed-caching', 'c10-memory-eviction', 'Maxmemory & Eviction Policies'),
  ]),

  section('C10.9', 'Sessions, Tokens & Feature State', 158, [
    item('c10-sessions-tokens', 'Sessions & Token Storage'),
    nest('c10-sessions-tokens', 'c10-session-store', 'Session Store Patterns'),
    nest('c10-sessions-tokens', 'c10-auth-token-storage', 'Storing Authentication Tokens'),
    nest('c10-sessions-tokens', 'c10-feature-flags', 'Feature Flags & Remote Config', 'tier2'),
    nest('c10-sessions-tokens', 'c10-deduplication', 'Data Deduplication Keys', 'tier2'),
  ]),

  section('C10.10', 'Rate Limiting', 159, [
    item('c10-rate-limiting', 'Rate Limiting with Redis', 'tier1', {
      related: ['d10-rate-limiter'],
      capstone: 'Relevant to inventory/cache/rate-limiting decisions for flash sales.',
    }),
    nest('c10-rate-limiting', 'c10-fixed-window', 'Fixed Window Counters'),
    nest('c10-rate-limiting', 'c10-sliding-window-redis', 'Sliding Window Patterns'),
    nest('c10-rate-limiting', 'c10-token-bucket-redis', 'Token Bucket / Leaky Bucket'),
    nest('c10-rate-limiting', 'c10-rate-limit-atomicity', 'Atomicity with INCR & Lua'),
  ]),

  section('C10.11', 'Distributed Locks & Inventory', 160, [
    item('c10-distributed-locks', 'Distributed Locks', 'tier2'),
    nest('c10-distributed-locks', 'c10-setnx-lock', 'SET NX EX Lock Pattern', 'tier2'),
    nest('c10-distributed-locks', 'c10-redlock', 'Redlock Trade-offs', 'tier2'),
    nest('c10-distributed-locks', 'c10-lock-safety', 'Lock Safety, Fencing & TTL', 'tier2'),
    nest('c10-distributed-locks', 'c10-inventory-reservation', 'Real-Time Inventory Reservation', 'tier2'),
  ]),

  section('C10.12', 'Pub/Sub, Queues & Real-Time Messaging', 161, [
    item('c10-pubsub', 'Pub/Sub', 'tier2'),
    nest('c10-pubsub', 'c10-publish-subscribe', 'PUBLISH / SUBSCRIBE', 'tier2'),
    nest('c10-pubsub', 'c10-pubsub-limits', 'Pub/Sub Delivery Limits', 'tier2'),
    nest('c10-pubsub', 'c10-job-queues', 'Lists & Streams as Job Queues', 'tier2'),
    nest('c10-pubsub', 'c10-leaderboards', 'Leaderboards with Sorted Sets', 'tier2'),
    nest('c10-pubsub', 'c10-streams', 'Redis Streams Overview', 'tier2'),
  ]),

  section('C10.13', 'Transactions, Pipelining & Scripting', 162, [
    item('c10-transactions-scripting', 'Transactions, Pipelining & Scripting', 'tier2'),
    nest('c10-transactions-scripting', 'c10-multi-exec', 'MULTI / EXEC & WATCH', 'tier2'),
    nest('c10-transactions-scripting', 'c10-pipelining', 'Pipelining', 'tier2'),
    nest('c10-transactions-scripting', 'c10-lua-scripting', 'Lua Scripting', 'tier2'),
    nest('c10-transactions-scripting', 'c10-atomic-multi-key', 'Atomic Multi-Key Updates', 'tier2'),
  ]),

  section('C10.14', 'Persistence & Backup', 163, [
    item('c10-persistence', 'Redis Persistence', 'tier2'),
    nest('c10-persistence', 'c10-rdb', 'RDB Snapshots', 'tier2'),
    nest('c10-persistence', 'c10-aof', 'AOF Append-Only File', 'tier2'),
    nest('c10-persistence', 'c10-rdb-vs-aof', 'RDB vs AOF Trade-offs', 'tier2'),
    nest('c10-persistence', 'c10-backup', 'Backup & Restore', 'tier2'),
  ]),

  section('C10.15', 'Replication, Partitioning & Clustering', 164, [
    item('c10-replication', 'Redis Replication', 'tier2'),
    nest('c10-replication', 'c10-replica-lag', 'Primary/Replica & Lag', 'tier2'),
    nest('c10-replication', 'c10-partitioning', 'Partitioning Strategies', 'tier2'),
    nest('c10-replication', 'c10-cluster', 'Redis Cluster Basics', 'tier2'),
    nest('c10-replication', 'c10-sentinel', 'Sentinel & Failover', 'tier2'),
  ]),

  section('C10.16', 'Security, Memory & Operations', 165, [
    item('c10-operations', 'Security, Memory & Operations', 'tier2'),
    nest('c10-operations', 'c10-redis-security', 'Auth, Network Binding & ACLs', 'tier2'),
    nest('c10-operations', 'c10-benchmarks', 'Benchmarks & Capacity Reality', 'tier2'),
    nest('c10-operations', 'c10-memory-fragmentation', 'Memory & Fragmentation', 'tier2'),
    nest('c10-operations', 'c10-slowlog', 'SLOWLOG & Latency Diagnosis', 'tier2'),
    nest('c10-operations', 'c10-production-checklist', 'Production Checklist', 'tier2'),
  ]),
]
