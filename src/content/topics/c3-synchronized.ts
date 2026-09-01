import type { TopicContent } from '@/domain/types'

export const synchronizedContent: TopicContent = {
  whatIsIt:
    '`synchronized` is Java’s built-in monitor lock: synchronize methods or blocks on an object’s intrinsic lock. At most one thread holds the lock; unlock happens-before the next lock acquisition on the same monitor — providing mutual exclusion and visibility for guarded fields.',
  whyExists:
    'Every object already has a lock — no extra types needed for simple thread-safe methods. The JVM optimizes fast-path biased/thin locks and integrates with wait/notify for condition coordination inside the same monitor.',
  mentalModel:
    'Enter synchronized → acquire monitor → run alone → exit releases and flushes writes to main memory (JMM). Reentrant: same thread can enter again (count held). Static synchronized locks the Class object, not instance.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Instance method synchronized uses `this`; static uses Class object. Block form `synchronized(lockObj) { }` allows finer granularity and different lock objects than this.',
    },
    {
      type: 'table',
      headers: ['Form', 'Lock object', 'Notes'],
      rows: [
        ['synchronized instance method', 'this', 'Whole method body critical'],
        ['synchronized static method', 'Class<?>', 'Class-level mutex'],
        ['synchronized(obj) block', 'obj', 'Prefer for partial methods'],
        ['wait/notify/notifyAll', 'same monitor', 'Must hold lock; releases on wait'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Do not lock on mutable or String literals',
      text: 'Integer.valueOf caching means locking on boxed values can accidentally share monitors — use private final Object lock = new Object().',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Reentrant synchronized',
      code: `class Service {
  synchronized void outer() {
    inner(); // same thread re-enters — OK
  }
  synchronized void inner() { /* ... */ }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'wait/notify pattern',
      code: `synchronized (queue) {
  while (queue.isEmpty()) queue.wait();
  Item item = queue.remove();
}
// producer:
synchronized (queue) {
  queue.add(item);
  queue.notifyAll();
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Object header mark word encodes lock state: unlocked, lightweight, inflated monitor.',
        'Inflation: contention promotes to ObjectMonitor with wait set and entry list.',
        'JVM may eliminate locks via escape analysis (coarse-grained optimization).',
        'synchronized compiles to monitorenter/monitorexit bytecode (or optimized inline).',
        'Virtual threads: synchronized on hot path may pin carrier — consider ReentrantLock.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Simple syntax; automatic release on exception',
      'Integrated wait/notify',
      'Reentrant by default',
    ],
    disadvantages: [
      'No tryLock, timeout, or fairness policy',
      'Coarse instance lock serializes all synchronized methods on object',
      'Can pin virtual thread carriers',
    ],
    alternatives: [
      'ReentrantLock with Conditions',
      'ReadWriteLock for read-heavy',
      'Concurrent data structures avoiding client-side lock',
    ],
    whenToUse: [
      'Small critical sections with simple mutex needs',
      'wait/notify on same object',
    ],
    whenNotToUse: [
      'Need timed/ interruptible lock acquisition',
      'High concurrency read-mostly (use RW lock or CHM)',
    ],
  },
  failureModes: [
    'Synchronizing on public `this` — external code can deadlock you.',
    'wait() without while loop → spurious wakeup bugs.',
    'notify instead of notifyAll missing wakeups with multiple wait conditions.',
    'Deadlock: thread A locks X then Y, B locks Y then X.',
  ],
  interview: {
    expectations: [
      'Explain monitor, reentrancy, static vs instance lock',
      'Correct wait/notify in while loop',
      'Know limitations vs ReentrantLock',
    ],
    commonQuestions: [
      'What does synchronized do?',
      'Difference static vs instance synchronized?',
      'Why wait in a while loop?',
    ],
    followUps: [
      'Is synchronized reentrant?',
      'Virtual thread pinning?',
    ],
    misconceptions: [
      'synchronized prevents all concurrency on object (only synchronized methods/blocks)',
      'wait() releases all locks everywhere (only current monitor)',
    ],
    traps: ['Using if instead of while with wait'],
    strongSignals: [
      'Private final lock object pattern',
      'notifyAll when multiple conditions',
      'Mentions happens-before on unlock',
    ],
  },
  keyTakeaways: [
    'synchronized = intrinsic monitor mutex + JMM visibility.',
    'Static locks Class; instance locks this unless block specifies other.',
    'Reentrant; auto-release on throw.',
    'wait/notify require holding lock; always while-loop check.',
    'ReentrantLock when tryLock, fairness, or multiple Conditions needed.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What lock does a static synchronized method use?',
      answerHint: 'The Class object associated with the class.',
    },
    {
      level: 'intermediate',
      question: 'Why must wait() be called in a loop?',
      answerHint: 'Spurious wakeups and state changes before re-acquiring lock.',
    },
    {
      level: 'advanced',
      question: 'How does synchronized relate to happens-before?',
      answerHint: 'Unlock on monitor happens-before subsequent lock on same monitor.',
    },
  ],
  flashcards: [
    { front: 'Instance synchronized locks', back: 'this (unless block uses other object)' },
    { front: 'Reentrant meaning', back: 'Same thread can acquire same monitor again' },
    { front: 'wait requires', back: 'Hold monitor; releases it until notified/interrupted' },
  ],
  quickRevision: [
    'Monitor per object',
    'Method or block form',
    'Static → Class lock',
    'Reentrant, auto unlock',
    'wait/notify while loop',
    'Private final lock object',
    'vs ReentrantLock: no tryLock',
  ],
}

export const content = synchronizedContent
