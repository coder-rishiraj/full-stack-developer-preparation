import type { TopicContent } from '@/domain/types'

export const raceConditionsContent: TopicContent = {
  whatIsIt:
    'A race condition occurs when program correctness depends on the relative timing or interleaving of threads accessing shared mutable state without proper coordination. The bug may be rare — one lost update among millions — making races insidious in production.',
  whyExists:
    'Threads interleave at arbitrary points. Non-atomic read-modify-write (check-then-act, lazy init, counter++) spans multiple bytecode instructions; another thread can interpose, violating assumed invariants.',
  mentalModel:
    'Two threads racing to the finish line where the outcome changes the prize. If the prize is “correct balance” or “singleton instance,” wrong interleaving corrupts state. Fix by establishing happens-before or atomicity over the whole operation.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Classic patterns: lost update (both read 5, both write 6), check-then-act (if empty add — two add), lazy init without sync (two instances), iterating while another thread mutates collection.',
    },
    {
      type: 'table',
      headers: ['Pattern', 'Broken code idea', 'Fix'],
      rows: [
        ['Lost update', 'count++', 'AtomicLong, synchronized, LongAdder'],
        ['Check-then-act', 'if (!map.contains) put', 'putIfAbsent, computeIfAbsent'],
        ['Compound invariant', 'transfer between fields', 'Single lock or atomic snapshot'],
        ['Iteration', 'for (x : list) while other removes', 'Concurrent collection or copy'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Visibility ≠ atomicity',
      text: 'volatile ensures visibility of writes, not read-modify-write atomicity. count++ on volatile int is still racy.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Lost update',
      code: `class Counter {
  int count;
  void inc() { count++; } // read, add, write — not atomic
}
// Two threads both read 10 → write 11 instead of 12`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Check-then-act race',
      code: `if (!cache.containsKey(k)) {
  cache.put(k, load(k)); // two threads may double-load
}
// Fix:
cache.computeIfAbsent(k, this::load);`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Bytecode for i++: iload, iconst_1, iadd, istore — gap between load and store.',
        'JIT may optimize but cannot fix unsynchronized shared mutation semantics.',
        'Data race (JMM): undefined behavior for plain fields — not merely “stale read.”',
        'Tools: thread sanitizers limited in Java; stress tests, JCStress for concurrency tests.',
        'ConcurrentHashMap atomic methods map to CAS/bin locking internally.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Identifying races leads to clearer ownership models',
      'Fixes often simplify with immutability or concurrent structures',
    ],
    disadvantages: [
      'Heisenbugs — hard to reproduce',
      'Over-locking after scare hurts performance',
    ],
    alternatives: [
      'Immutable objects and message passing',
      'Single-threaded event loop per shard',
      'Software transactional memory (rare in Java app code)',
    ],
    whenToUse: [
      'Always audit shared mutable fields in multi-threaded code',
    ],
    whenNotToUse: [
      'Do not sprinkle synchronized everywhere without identifying shared state',
    ],
  },
  failureModes: [
    'Rare production corruption under load only.',
    'Double initialization of expensive resources.',
    'ConcurrentModificationException (fail-fast iterator detects structural change).',
    'Tests pass on dev laptop, fail under CI parallelism.',
  ],
  interview: {
    expectations: [
      'Give concrete lost update / check-then-act example',
      'Propose correct fix matching problem size',
      'Distinguish race from deadlock',
    ],
    commonQuestions: [
      'What is a race condition?',
      'Is count++ thread-safe?',
      'How fix lazy singleton?',
    ],
    followUps: [
      'Difference race vs data race (JMM)?',
      'How test for races?',
    ],
    misconceptions: [
      'synchronized on getter only makes class safe (writers must sync too)',
      'ConcurrentModificationException means thread-safe collection (it does not)',
    ],
    traps: ['Fixing visibility only with volatile when atomicity needed'],
    strongSignals: [
      'Names interleaving explicitly',
      'Uses computeIfAbsent / atomics appropriately',
      'Mentions happens-before',
    ],
  },
  keyTakeaways: [
    'Race = correctness depends on thread interleaving.',
    'Read-modify-write and check-then-act are classic bugs.',
    'volatile does not fix count++.',
    'Use atomics, locks, or concurrent APIs for whole operation.',
    'Prefer immutability to eliminate shared mutation.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why is count++ not thread-safe?',
      answerHint: 'Non-atomic read-add-write; two threads can overwrite each other.',
    },
    {
      level: 'intermediate',
      question: 'Example of check-then-act race?',
      answerHint: 'if (!contains) put — two threads pass check; duplicate work or corruption.',
    },
    {
      level: 'advanced',
      question: 'Difference between race condition and data race in JMM?',
      answerHint: 'Race condition is general timing bug; data race is unsynchronized conflicting accesses with undefined semantics.',
    },
  ],
  flashcards: [
    { front: 'Lost update', back: 'Two threads read same value, both increment, one update lost' },
    { front: 'volatile ++ safe?', back: 'No — visibility only, not atomic RMW' },
    { front: 'putIfAbsent fixes', back: 'Check-then-act on maps atomically' },
  ],
  quickRevision: [
    'Timing-dependent bugs',
    'count++ is three steps',
    'check-then-act unsafe',
    'volatile ≠ atomic',
    'atomics / locks / CHM helpers',
    'immutability avoids races',
    'stress + JCStress for tests',
  ],
}

export const content = raceConditionsContent
