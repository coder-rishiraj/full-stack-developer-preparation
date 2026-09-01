import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Distributed locks coordinate exclusive access to a shared resource across multiple JVM/processes using a central store — typically Redis Redlock (SET key NX PX ttl), ZooKeeper ephemeral nodes, or database advisory locks. Prevents duplicate cron execution, double payment, or concurrent inventory oversell.',
  whyExists:
    'In-memory synchronized blocks only work inside one process. Microservices on multiple pods need external mutual exclusion. Distributed lock says "only one worker processes job X at a time" with TTL safety against crashed lock holder.',
  mentalModel:
    'Bathroom stall occupancy sign with auto-expiry. SET lock:order:123 NX EX 30 — first setter wins; others retry or skip. Lock must expire if holder dies (TTL). Holder must finish before TTL or extend carefully — fencing token prevents stale holder writing after expiry.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Redis lock acquire and release',
      diagram: `sequenceDiagram
  participant A as Pod A
  participant R as Redis
  participant B as Pod B
  A->>R: SET lock:job NX EX 30
  R-->>A: OK
  B->>R: SET lock:job NX EX 30
  R-->>B: nil (fail)
  A->>R: DEL lock:job (Lua if token match)
  B->>R: SET lock:job NX EX 30
  R-->>B: OK`,
    },
    {
      type: 'list',
      items: [
        'SET key unique-token NX PX milliseconds — atomic acquire.',
        'Release via Lua: delete only if value matches token — prevents deleting others lock.',
        'Redisson, ShedLock (@SchedulerLock) wrap Redis/DB lock patterns for Spring.',
        'Fencing token: monotonic ID passed to storage — reject writes with stale token.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Redis lock with token-safe release (Spring Data Redis)',
      code: `public boolean tryLock(String key, String token, Duration ttl) {
  Boolean ok = redis.opsForValue()
      .setIfAbsent(key, token, ttl);
  return Boolean.TRUE.equals(ok);
}

public void unlock(String key, String token) {
  String script = """
    if redis.call('get', KEYS[1]) == ARGV[1] then
      return redis.call('del', KEYS[1])
    else return 0 end""";
  redis.execute(new DefaultRedisScript<>(script, Long.class),
      List.of(key), token);
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'ShedLock for scheduled jobs',
      code: `@Scheduled(cron = "0 */5 * * * *")
@SchedulerLock(name = "syncInventory", lockAtMostFor = "4m", lockAtLeastFor = "1m")
public void syncInventory() { /* single runner across cluster */ }`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Redlock algorithm: quorum across N independent Redis masters — debated correctness under clock skew.',
        'Lock renewal (watchdog): background thread extends TTL while work continues — Redisson implementation.',
        'DB lock: SELECT FOR UPDATE SKIP LOCKED or unique constraint on lock row.',
        'ZooKeeper: ephemeral sequential nodes — natural ordering and session expiry.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Simple mutual exclusion across pods', 'TTL prevents deadlocks from crashed nodes', 'ShedLock integrates with Spring @Scheduled'],
    disadvantages: ['Not consensus — edge cases with Redlock debate', 'TTL tuning hard — too short double execution, too long slow recovery', 'Adds dependency on Redis availability'],
    alternatives: ['Kafka partition single consumer', 'DB unique constraint idempotency', 'Leader election single writer'],
    whenToUse: ['Cron job single-flight', 'Short critical sections', 'Inventory decrement serialization'],
    whenNotToUse: ['Long transactions — use DB row lock', 'When idempotency key suffices without lock'],
  },
  failureModes: [
    'Work exceeds TTL — second worker acquires — duplicate processing',
    'DEL without token check — deletes another holders lock',
    'Redis master failover loses lock briefly — split brain',
    'Clock skew breaks expiry assumptions',
    'Lock held during GC pause — false expiry',
  ],
  production: {
    reliability: ['Lua unlock with token', 'lockAtMostFor on ShedLock', 'Prefer idempotency over lock when possible'],
    observability: ['Metrics: lock acquire failures, hold duration, expiry while still running'],
    performance: ['Keep critical section milliseconds not minutes', 'Retry with jitter on acquire fail'],
    security: ['Lock keys namespaced per tenant/service'],
  },
  interview: {
    expectations: ['SET NX EX pattern', 'Why TTL', 'Token-safe release', 'Fencing token concept'],
    commonQuestions: ['Implement distributed lock with Redis?', 'ShedLock purpose?'],
    followUps: ['Redlock controversy?', 'Lock vs idempotency key?'],
    misconceptions: ['Distributed lock equals transaction', 'Infinite TTL safe'],
    traps: ['Simple DEL without ownership check'],
    strongSignals: ['Lua release', 'Fencing token', 'ShedLock lockAtMostFor', 'Idempotency alternative'],
  },
  keyTakeaways: [
    'Use SET NX with TTL for Redis lock acquire.',
    'Release only if token matches — Lua script.',
    'TTL protects against dead holder; tune to job duration.',
    'ShedLock simplifies scheduled job locking in Spring.',
    'Prefer idempotency/fencing over long-held distributed locks.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why distributed lock?', answerHint: 'Mutual exclusion across multiple processes/pods for shared resource or cron job.' },
    { level: 'intermediate', question: 'Safe Redis lock release?', answerHint: 'Lua delete only if value equals unique token holder set on acquire.' },
    { level: 'advanced', question: 'Lock expires but work still running?', answerHint: 'Second acquirer runs — use fencing token on downstream writes or extend TTL watchdog.' },
  ],
  flashcards: [
    { front: 'SET NX EX', back: 'Set if not exists with expiry — atomic lock acquire' },
    { front: 'Fencing token', back: 'Monotonic ID storage rejects stale lock holder writes' },
    { front: 'ShedLock', back: 'Spring annotation ensuring one scheduler instance runs job' },
    { front: 'Lua unlock', back: 'Delete lock only when token matches — safe release' },
  ],
  quickRevision: ['SET key token NX EX ttl', 'Lua token unlock', 'TTL > job time', 'ShedLock cron', 'Idempotency alternative'],
}
