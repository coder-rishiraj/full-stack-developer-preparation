import type { TopicContent } from '@/domain/types'

export const synchronizationContent: TopicContent = {
  whatIsIt:
    'Synchronization coordinates access to shared mutable state so threads observe consistent data and invariants hold despite interleaving. In Java it spans language constructs (synchronized, volatile), java.util.concurrent locks and atomics, and the happens-before rules of the JMM.',
  whyExists:
    'Without coordination, read-modify-write races corrupt counters, collections, and double-checked locking. Synchronization defines which thread actions are visible to others and which critical sections execute atomically relative to shared resources.',
  mentalModel:
    'Critical section = one thread at a time (mutual exclusion) plus publication guarantees (writes visible to next acquirer). Think lock as a bathroom key: holder sees latest paint job; others wait. Visibility without mutual exclusion needs volatile/atomics; both together for compound actions.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Mutual exclusion: synchronized, ReentrantLock. Visibility: volatile writes, unlock→lock, concurrent utilities with volatile/CAS internals. Atomicity for single variables: AtomicInteger CAS. Compound check-then-act needs lock or concurrent data structure.',
    },
    {
      type: 'table',
      headers: ['Mechanism', 'Mutex', 'Visibility', 'Typical use'],
      rows: [
        ['synchronized', 'Yes', 'Yes (JMM)', 'Simple guarded methods/blocks'],
        ['ReentrantLock', 'Yes', 'Yes', 'tryLock, fairness, conditions'],
        ['volatile', 'No', 'Yes', 'flags, one writer many readers'],
        ['Atomics', 'Per-var CAS', 'Yes', 'Counters, lock-free structures'],
        ['Concurrent collections', 'Internal', 'Yes', 'Shared maps/queues'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Synchronization ≠ only synchronized keyword',
      text: 'Interview “synchronization” means the whole coordination toolkit — locks, atomics, concurrent packages — not just the synchronized keyword.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Mutex + visibility',
      code: `class BankAccount {
  private int balance;
  synchronized void transfer(BankAccount to, int amt) {
    if (balance < amt) throw new IllegalStateException();
    balance -= amt;
    to.balance += amt; // both under respective locks in real code
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'volatile for status flag',
      code: `volatile boolean shutdown;
void run() { while (!shutdown) { work(); } }
void stop() { shutdown = true; }`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Every object can act as a monitor; synchronized uses object header lock word (thin lock → inflated monitor).',
        'Lock contention: park/unpark threads via JVM/OS; biased locking (removed/simplified in recent JDKs) history.',
        'Happens-before edges compose: program order within thread, monitor rules, volatile, thread start/join.',
        'Lock-free algorithms use CAS retry loops; ABA problem addressed by AtomicStampedReference when needed.',
        'java.util.concurrent built on AbstractQueuedSynchronizer (AQS) framework.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Correctness for shared state',
      'Rich JUC primitives beyond intrinsic locks',
      'Clear happens-before for reasoning',
    ],
    disadvantages: [
      'Contention reduces scalability',
      'Deadlock/livelock risk with multiple locks',
      'Over-synchronization hurts latency',
    ],
    alternatives: [
      'Immutable data + message passing',
      'Thread confinement (ThreadLocal — use carefully)',
      'Actor model / reactive single-threaded event loop per core',
    ],
    whenToUse: [
      'Any shared mutable field touched by multiple threads',
      'Publishing initialized objects to other threads',
    ],
    whenNotToUse: [
      'Read-only data after safe publication',
      'Independent per-thread data',
    ],
  },
  failureModes: [
    'Race on check-then-act outside lock.',
    'Visibility bug: non-volatile flag never seen false→true.',
    'Deadlock with lock ordering inversion.',
    'ThreadLocal leaks in thread pools retaining large graphs.',
  ],
  interview: {
    expectations: [
      'Define race condition and critical section',
      'Choose synchronized vs Lock vs atomics vs concurrent collections',
      'Connect to happens-before (JMM topic)',
    ],
    commonQuestions: [
      'Why synchronize?',
      'synchronized vs volatile?',
      'How to make a class thread-safe?',
    ],
    followUps: [
      'Lock-free vs lock-based?',
      'What is reentrancy?',
    ],
    misconceptions: [
      'volatile makes compound operations atomic',
      'Collections.synchronizedList makes all compound ops safe',
    ],
    traps: ['Synchronizing on boxed Integer literals (distinct objects)'],
    strongSignals: [
      'Prefers higher-level concurrent structures when they fit',
      'Mentions happens-before, not just “locks exist”',
      'Avoids global lock on entire service',
    ],
  },
  keyTakeaways: [
    'Sync = mutual exclusion + visibility via JMM rules.',
    'synchronized/Lock for multi-step invariants; atomics for single variables.',
    'volatile: visibility, not atomic read-modify-write.',
    'Prefer concurrent collections over wrapping with one big lock.',
    'Minimize lock scope and duration; watch lock ordering.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What problem does synchronization solve?',
      answerHint: 'Races on shared mutable state; ensures atomicity and visibility.',
    },
    {
      level: 'intermediate',
      question: 'When is volatile enough without synchronized?',
      answerHint: 'Single variable visibility (flags), no compound invariants depending on other fields.',
    },
    {
      level: 'advanced',
      question: 'Why is check-then-act unsafe without synchronization?',
      answerHint: 'Another thread can change state between check and act — TOCTOU race.',
    },
  ],
  flashcards: [
    { front: 'Critical section', back: 'Code accessing shared state; must be guarded' },
    { front: 'volatile guarantees', back: 'Visibility and ordering for reads/writes; not compound atomicity' },
    { front: 'Happens-before', back: 'Prior writes visible to subsequent synchronized/volatile/thread actions' },
  ],
  quickRevision: [
    'Races without coordination',
    'Mutex: synchronized, Lock',
    'Visibility: volatile, unlock/lock',
    'Atomics for Counters CAS',
    'Concurrent collections over sync wrappers',
    'Minimize critical section',
    'Lock ordering prevents deadlock',
  ],
}

export const content = synchronizationContent
