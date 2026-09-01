import type { TopicContent } from '@/domain/types'

export const deadlocksContent: TopicContent = {
  whatIsIt:
    'Deadlock is a state where two or more threads each hold a resource and wait for another held by someone else — circular wait with no progress. The JVM cannot always detect application-level deadlocks; thread dumps reveal "Found one Java-level deadlock".',
  whyExists:
    'Multiple locks taken in inconsistent order, or blocking waits for pool threads holding locks, create cycles. Without prevention strategy, systems hang under specific contention timings.',
  mentalModel:
    'Four-way stop sign where each car waits for the car on its right — nobody moves. Need global lock ordering, tryLock with backoff, or reduce lock granularity so cycles cannot form.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Coffman conditions (all needed for deadlock): mutual exclusion, hold and wait, no preemption, circular wait. Break one: lock ordering (break circular), tryLock (break hold-and-wait), timeouts, or lock-free structures.',
    },
    {
      type: 'table',
      headers: ['Strategy', 'Mechanism'],
      rows: [
        ['Lock ordering', 'Always acquire A then B globally'],
        ['tryLock + backoff', 'Fail fast, retry shuffled order'],
        ['Timeout', 'Detect and abort one participant'],
        ['Reduce locks', 'Single lock, CHM, immutability'],
        ['DB deadlock', 'DB detects cycle, abort victim (40001/deadlock)'],
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Diagnosis',
      text: 'jstack <pid> or jcmd Thread.print — look for "deadlock" section showing monitors and threads waiting.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Classic lock ordering deadlock',
      code: `// Thread 1: lock A then B
// Thread 2: lock B then A  → circular wait

synchronized(a) {
  synchronized(b) { work(); }
}
// Fix: both threads lock in same order (e.g. System.identityHashCode order)`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Thread pool deadlock',
      code: `ExecutorService pool = Executors.newFixedThreadPool(1);
Future<?> f = pool.submit(() -> {
  return pool.submit(() -> "inner").get(); // blocks forever
});
f.get(); // outer waits for inner; pool thread blocked in get`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'JVM periodic deadlock detection for Java monitors (not all j.u.c locks in older versions — check current JDK).',
        'ReentrantLock has no global ordering unless you enforce it.',
        'Database deadlocks: lock rows in index order; retry transaction.',
        'LockSupport park chains visible in thread dump BLOCKED state.',
        'ForkJoinPool common pool starvation can resemble deadlock.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Lock ordering simple and effective for two-resource cases',
      'tryLock enables graceful degradation',
    ],
    disadvantages: [
      'Global ordering hard with many lock types',
      'tryLock retries add complexity',
      'Single big lock avoids deadlock but kills throughput',
    ],
    alternatives: [
      'Lock-free algorithms',
      'Actor mailboxes single-threaded per entity',
      'Database as serializer',
    ],
    whenToUse: [
      'Enforce lock ordering when multiple locks unavoidable',
      'Bounded tryLock in microservices calling each other',
    ],
    whenNotToUse: [
      'Do not nest foreign callbacks holding your locks',
    ],
  },
  failureModes: [
    'Hidden deadlock in thread pool + Future.get on same pool.',
    'GUI / lock + synchronized listener callbacks.',
    'Distributed deadlock across services (no JVM detection).',
    'Live lock: threads active but no progress (not deadlock but similar ops pain).',
  ],
  interview: {
    expectations: [
      'State four Coffman conditions',
      'Give lock ordering fix',
      'Know thread pool nested submit trap',
    ],
    commonQuestions: [
      'What is deadlock?',
      'How prevent deadlock?',
      'How detect in production?',
    ],
    followUps: [
      'Deadlock vs livelock vs starvation?',
      'Bank transfer lock ordering?',
    ],
    misconceptions: [
      'synchronized always prevents deadlock (can cause it)',
      'More threads fix pool deadlock',
    ],
    traps: ['Only mentioning DB deadlocks for Java concurrency question'],
    strongSignals: [
      'Thread dump workflow',
      'Nested pool example unprompted',
      'tryLock with global order tie-breaker',
    ],
  },
  keyTakeaways: [
    'Circular wait + hold locks → deadlock.',
    'Fix: consistent global lock order or tryLock/timeouts.',
    'Thread pool + blocking get on same pool = classic hang.',
    'jstack/jcmd to diagnose Java monitor deadlocks.',
    'Reduce locks via concurrent structures and immutability.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Name conditions for deadlock.',
      answerHint: 'Mutual exclusion, hold-and-wait, no preemption, circular wait.',
    },
    {
      level: 'intermediate',
      question: 'How would you prevent deadlock in transfer between two accounts?',
      answerHint: 'Lock accounts in consistent order (e.g. lower id first) or single global lock.',
    },
    {
      level: 'advanced',
      question: 'Describe thread pool deadlock with single-thread executor.',
      answerHint: 'Task submits inner task and waits get(); pool thread blocked; outer waits forever.',
    },
  ],
  flashcards: [
    { front: 'Deadlock four conditions', back: 'Mutex, hold-wait, no preemption, circular wait' },
    { front: 'Detect Java deadlock', back: 'jstack / jcmd Thread.print' },
    { front: 'Pool deadlock pattern', back: 'Task on pool waits for another task on same pool' },
  ],
  quickRevision: [
    'Circular lock wait',
    'Lock ordering prevention',
    'tryLock + timeout',
    'jstack deadlock section',
    'Pool nested submit trap',
    'DB deadlock retry',
    'Fewer locks best',
  ],
}

export const content = deadlocksContent
