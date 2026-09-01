import type { TopicContent } from '@/domain/types'

export const locksContent: TopicContent = {
  whatIsIt:
    'java.util.concurrent locks (ReentrantLock, ReadWriteLock, StampedLock) are explicit mutual-exclusion APIs built on AQS. They offer tryLock, timed/interruptible acquisition, fairness policies, and multiple Condition queues — beyond intrinsic synchronized monitors.',
  whyExists:
    'Production code needs timed waits, lock ordering diagnostics, read/write sharing, and non-reentrant-adjacent features. Explicit locks integrate with executors and avoid some virtual-thread pinning patterns when used instead of synchronized.',
  mentalModel:
    'ReentrantLock = synchronized with knobs. ReadWriteLock: many readers OR one writer. StampedLock: optimistic reads with validation stamp. Always unlock in finally; prefer tryLock with timeout to avoid indefinite deadlock.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'ReentrantLock delegates to AQS state (hold count, wait queue). fair=true reduces starvation but lowers throughput. ReadWriteLock splits read vs write locks; upgrades/downgrades have rules. StampedLock not reentrant — expert API.',
    },
    {
      type: 'table',
      headers: ['Lock type', 'Feature', 'Caution'],
      rows: [
        ['ReentrantLock', 'tryLock, lockInterruptibly, Conditions', 'Must unlock in finally'],
        ['ReentrantReadWriteLock', 'Concurrent reads', 'Writers starve if readers constant'],
        ['StampedLock', 'Optimistic read', 'Not reentrant; validate after optimistic read'],
        ['synchronized', 'Simple, auto-release', 'No try/timeout/fairness'],
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Condition vs wait/notify',
      text: 'One lock can have multiple Condition objects (notFull, notEmpty) — cleaner than single wait set with while checks for every predicate.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'ReentrantLock with tryLock',
      code: `ReentrantLock lock = new ReentrantLock();
if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
  try {
    // critical section
  } finally {
    lock.unlock();
  }
} else {
  // fallback or fail fast
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'ReadWriteLock cache',
      code: `ReadWriteLock rw = new ReentrantReadWriteLock();
V get(K k) {
  rw.readLock().lock();
  try { return map.get(k); }
  finally { rw.readLock().unlock(); }
}
void put(K k, V v) {
  rw.writeLock().lock();
  try { map.put(k, v); }
  finally { rw.writeLock().unlock(); }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'AbstractQueuedSynchronizer (AQS): CLH queue of waiting threads; compareAndSet state.',
        'Fair locks grant in FIFO order; non-fair barging allowed for throughput.',
        'ReadWriteLock: shared mode for readers, exclusive for writer; hold count tracks reentrancy.',
        'StampedLock: bits encode mode; optimistic tryOptimisticRead + validate after read set.',
        'LockSupport.park/unpark underpins blocking without spinning forever.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'tryLock / timeouts prevent indefinite block',
      'Fairness option; multiple conditions',
      'Read sharing scales read-heavy caches',
    ],
    disadvantages: [
      'Verbose; forgot unlock → deadlock',
      'RW lock writer starvation possible',
      'StampedLock complexity and non-reentrancy foot-guns',
    ],
    alternatives: [
      'synchronized for simple cases',
      'ConcurrentHashMap instead of RW lock + HashMap',
      'Atomics for single-variable updates',
    ],
    whenToUse: [
      'Need timed or interruptible lock',
      'Bounded buffer with two Conditions',
      'Read-mostly structure with occasional writes',
    ],
    whenNotToUse: [
      'Simple counter — use LongAdder/AtomicLong',
      'StampedLock without measured need',
    ],
  },
  failureModes: [
    'Missing unlock in finally after exception.',
    'Lock upgrade deadlock with ReadWriteLock (not supported mid-read).',
    'Optimistic read without validate → torn reads.',
    'Global fair lock under high contention — throughput collapse.',
  ],
  interview: {
    expectations: [
      'Compare ReentrantLock vs synchronized',
      'Explain read/write lock use case',
      'Always mention finally unlock',
    ],
    commonQuestions: [
      'Why use ReentrantLock over synchronized?',
      'ReadWriteLock vs synchronized?',
      'What is AQS?',
    ],
    followUps: [
      'Fair vs non-fair lock?',
      'StampedLock optimistic read flow?',
    ],
    misconceptions: [
      'ReadWriteLock always faster (small maps: single lock simpler)',
      'tryLock eliminates deadlock (still need lock ordering)',
    ],
    traps: ['Using StampedLock as drop-in ReentrantLock'],
    strongSignals: [
      'Multiple Condition queues for producer-consumer',
      'Prefers CHM over RWLock+HashMap when map is the shared state',
      'Mentions lock ordering for deadlock prevention',
    ],
  },
  keyTakeaways: [
    'ReentrantLock: tryLock, interruptible, fair, Conditions.',
    'Always unlock in finally.',
    'ReadWriteLock: many readers or one writer.',
    'StampedLock: optimistic reads — validate stamp.',
    'AQS backs most j.u.c locks.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'One advantage of ReentrantLock over synchronized?',
      answerHint: 'tryLock with timeout, lockInterruptibly, or multiple Conditions.',
    },
    {
      level: 'intermediate',
      question: 'When is ReadWriteLock appropriate?',
      answerHint: 'Read-heavy, write-rare shared structure; reads dominate contention.',
    },
    {
      level: 'advanced',
      question: 'What is AQS role in java.util.concurrent?',
      answerHint: 'Framework for exclusive/shared sync: state CAS + FIFO wait queue.',
    },
  ],
  flashcards: [
    { front: 'ReentrantLock must', back: 'unlock() in finally after lock()' },
    { front: 'ReadWriteLock rule', back: 'Multiple read locks OR one write lock' },
    { front: 'StampedLock optimistic read', back: 'tryOptimisticRead then validate(stamp) after reading' },
  ],
  quickRevision: [
    'ReentrantLock > synchronized features',
    'tryLock / timed / interruptible',
    'Conditions: notFull, notEmpty',
    'RW lock for read-heavy',
    'StampedLock: validate stamp',
    'AQS queue + CAS state',
    'finally unlock',
  ],
}

export const content = locksContent
