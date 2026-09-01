import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Redis persistence options — RDB snapshots and AOF (Append Only File) — recover in-memory data after restart. RDB point-in-time binary dumps on schedule; AOF logs every write command for finer durability. Hybrid RDB+AOF common in production. Neither replaces Redis role as cache — persistence is for durability when Redis holds authoritative state.',
  whyExists:
    'Pure in-memory Redis loses all data on crash. Sessions, rate limit counters, job queues, or primary data structures need recovery. Persistence trades disk I/O and restart time for survivability — tuning depends on acceptable RPO.',
  mentalModel:
    'RDB = periodic photo of memory. AOF = journal of every change since last snapshot. On boot, Redis loads RDB base + replays AOF tail. More AOF fsync = safer but slower writes.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Mode', 'Mechanism', 'RPO / tradeoff'],
      rows: [
        ['RDB', 'fork + BGSAVE snapshot', 'Minutes of loss if only RDB; fast restart'],
        ['AOF everysec', 'fsync once per second', 'Up to 1s loss; balanced default'],
        ['AOF always', 'fsync every write', 'Safest; slowest writes'],
        ['AOF no', 'OS buffer flush', 'Fast; high loss risk on crash'],
        ['Hybrid', 'RDB preamble + AOF increment', 'Faster rewrite recovery'],
      ],
    },
    {
      type: 'list',
      items: [
        'save 900 1 — RDB if 1 key changed in 900s (configurable rules).',
        'BGSAVE uses copy-on-write fork — memory spike on large datasets during snapshot.',
        'AOF rewrite compacts log by generating snapshot commands — BGREWRITEAOF.',
        'appendonly yes + appendfsync everysec production sweet spot for many workloads.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'bash',
      caption: 'redis.conf persistence snippet',
      code: `appendonly yes
appendfsync everysec
auto-aof-rewrite-percentage 100
save 900 1
save 300 10
save 60 10000`,
    },
    {
      type: 'paragraph',
      text: 'Rate limiter stored in Redis: AOF everysec acceptable — worst case 1s of counter state lost on crash, limits reset slightly generous. Session store with 24h TTL: RDB hourly + AOF everysec; on restart users re-login if gap — acceptable vs always fsync latency.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'fork() COW: parent serves writes while child writes RDB — watch maxmemory and latency spikes.',
        'AOF rewrite in separate process; brief dual-write buffer during switch.',
        'diskless replication optional — stream RDB to replica without local disk.',
        'Redis Cluster: each master owns persistence for its slots independently.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['RDB compact fast restore', 'AOF granular durability', 'Hybrid balances both'],
    disadvantages: ['fork latency on large memory', 'AOF files grow until rewrite', 'Not backup substitute — need off-site copies'],
    alternatives: ['No persistence — pure cache rebuild from DB', 'Redis Enterprise active-active', 'Replicate to standby for HA not durability alone'],
    whenToUse: ['Redis holds non-rebuildable state', 'Session store', 'Primary queue with acknowledgment'],
    whenNotToUse: ['Pure cache with DB source of truth — disable persistence for speed'],
  },
  failureModes: [
    'BGSAVE fails — disk full — no recent snapshot',
    'AOF corrupted on crash — redis-check-aof repair partial loss',
    'everysec loses last second writes on power failure',
    'Fork fails on huge dataset — persistence stops silently if misconfigured',
    'Treating Redis persistence as sole backup — no off-site RDB',
  ],
  production: {
    reliability: ['AOF everysec + periodic RDB', 'Off-site backup of RDB/AOF to S3', 'Monitor last_bgsave_status'],
    performance: ['Avoid always fsync unless mandatory', 'Schedule rewrites off peak'],
    observability: ['Alerts on rdb_bgsave_in_progress failures', 'Track aof_current_size growth'],
    cost: ['Right-size disk for AOF rewrite temp space'],
  },
  interview: {
    expectations: ['RDB vs AOF', 'appendfsync options', 'fork/COW impact', 'When disable persistence'],
    commonQuestions: ['Redis data survive restart?', 'RDB vs AOF tradeoffs?'],
    followUps: ['BGSAVE memory spike?', 'Redis as primary database?'],
    misconceptions: ['Redis always persistent', 'Replication replaces backup'],
    traps: ['Using Redis as sole durable store without backup strategy'],
    strongSignals: ['everysec default rationale', 'Hybrid mode', 'Cache vs primary data distinction'],
  },
  keyTakeaways: [
    'RDB = periodic snapshots; AOF = write log.',
    'appendfsync everysec balances durability and speed.',
    'BGSAVE fork causes memory/latency spikes on large datasets.',
    'Disable persistence when Redis is pure cache backed by DB.',
    'Back up RDB/AOF off-site — replication is not backup.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'RDB vs AOF?', answerHint: 'RDB point-in-time snapshot; AOF logs every write — finer RPO, larger files.' },
    { level: 'intermediate', question: 'appendfsync always vs everysec?', answerHint: 'always fsync each write — durable but slow; everysec up to 1s loss window.' },
    { level: 'advanced', question: 'Redis only cache — enable persistence?', answerHint: 'Usually no — rebuild from DB on restart; saves fork I/O and latency.' },
  ],
  flashcards: [
    { front: 'RDB', back: 'Binary snapshot at intervals — fast load, coarser RPO' },
    { front: 'AOF rewrite', back: 'Compacts append log by rewriting minimal command set' },
    { front: 'appendfsync everysec', back: 'Fsync at most once per second — common prod default' },
    { front: 'BGSAVE fork', back: 'Copy-on-write snapshot — watch memory during save' },
  ],
  quickRevision: ['RDB snapshot', 'AOF log', 'everysec fsync', 'Hybrid recovery', 'Cache may skip persistence'],
}
