import type { TopicContent } from '@/domain/types'

export const atomicsContent: TopicContent = {
  whatIsIt:
    'java.util.concurrent.atomic classes (AtomicInteger, AtomicReference, LongAdder, etc.) provide lock-free thread-safe operations on single variables using CPU compare-and-swap (CAS). They combine volatile visibility with atomic read-modify-write primitives like compareAndSet, getAndIncrement, and accumulate.',
  whyExists:
    'Synchronized locks for a simple counter serialize all updaters. CAS retries on contention without blocking — lower overhead for high-frequency stats, sequence generators, and building lock-free data structures (ConcurrentLinkedQueue, CHM bins).',
  mentalModel:
    'Read current value, compute new value, CAS(expected, new) — succeeds if no one else changed it; else retry. Like optimistic concurrency for one word. LongAdder stripes counters under contention to reduce CAS failures.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Underlying unsafe/CAS maps to CPU instructions (x86 LOCK CMPXCHG). AtomicReference handles reference swaps; field updaters reduce object overhead. LongAdder maintains cells summed on longValue().',
    },
    {
      type: 'table',
      headers: ['Class', 'Use case'],
      rows: [
        ['AtomicInteger/Long', 'Counters, sequence, CAS loops'],
        ['AtomicReference', 'Lock-free stack head, singleton publish'],
        ['LongAdder / DoubleAdder', 'High-contention metrics aggregation'],
        ['AtomicStampedReference', 'ABA problem with version stamp'],
        ['AtomicIntegerFieldUpdater', 'CAS on existing class fields without extra object'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Not for compound invariants',
      text: 'Two atomics do not move together — if balance and version must update atomically, use synchronized or one atomic holding immutable snapshot.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Lock-free counter vs LongAdder',
      code: `AtomicInteger hits = new AtomicInteger();
hits.incrementAndGet();

LongAdder reqCount = new LongAdder();
reqCount.increment();
long total = reqCount.sum(); // many writers`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'CAS retry loop',
      code: `AtomicReference<Node> head = new AtomicReference<>();
void push(Node n) {
  Node old;
  do {
    old = head.get();
    n.next = old;
  } while (!head.compareAndSet(old, n));
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'CAS: atomic if memory location == expected then swap to new else fail.',
        'ABA: value A→B→A fools naive CAS; stamped references add version.',
        'LongAdder: cells array + base; Contention spreads across cells; sum() may not be linearizable point-in-time.',
        'VarHandle (Java 9+) generalizes volatile/CAS on fields.',
        'False sharing: adjacent atomic counters on same cache line — padding/striping mitigates.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'No lock park/unpark for single-variable updates',
      'LongAdder scales metrics under many threads',
      'Building block for non-blocking algorithms',
    ],
    disadvantages: [
      'CAS spin under extreme contention wastes CPU',
      'Only single-variable atomicity',
      'LongAdder sum() is approximate under concurrent updates',
    ],
    alternatives: [
      'synchronized block for multi-field updates',
      'LongAccumulator for custom reduction',
      'Striped locks for heterogeneous keys',
    ],
    whenToUse: [
      'Global counters, IDs, stats',
      'Lock-free node stacks/queues',
      'CHM-style per-bin initialization',
    ],
    whenNotToUse: [
      'Transfer between two accounts (needs lock)',
      'Heavy contention on single AtomicLong — try LongAdder',
    ],
  },
  failureModes: [
    'Live lock: infinite CAS retry under extreme contention.',
    'Using get then compareAndSet with stale read without loop.',
    'ABA in lock-free structures without stamps.',
    'Assuming incrementAndGet makes entire service thread-safe.',
  ],
  interview: {
    expectations: [
      'Explain CAS and retry loop',
      'Atomic vs synchronized for counters',
      'LongAdder vs AtomicLong',
    ],
    commonQuestions: [
      'How do atomics work?',
      'What is CAS?',
      'ABA problem?',
    ],
    followUps: [
      'What is LongAdder?',
      'VarHandle vs AtomicFieldUpdater?',
    ],
    misconceptions: [
      'Atomics never block (they spin; can be worse than lock)',
      'volatile ++ is atomic (it is not)',
    ],
    traps: ['Using AtomicInteger for i++ style compound logic across fields'],
    strongSignals: [
      'Mentions compareAndSet loop',
      'Knows when LongAdder beats AtomicLong',
      'Connects to CHM and CLQ internals',
    ],
  },
  keyTakeaways: [
    'Atomics = volatile visibility + CAS atomic RMW.',
    'Use CAS loops for lock-free updates; retry on failure.',
    'LongAdder stripes for high-write contention metrics.',
    'Single variable only — multi-field needs locks or immutable snapshots.',
    'ABA: use stamped references when recycling nodes.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does compareAndSet do?',
      answerHint: 'Atomically set to new if current == expected; returns success boolean.',
    },
    {
      level: 'intermediate',
      question: 'AtomicLong vs LongAdder?',
      answerHint: 'LongAdder reduces CAS contention via striped cells; sum() for read.',
    },
    {
      level: 'advanced',
      question: 'Explain ABA problem in lock-free stacks.',
      answerHint: 'Head A popped/pushed back looks unchanged; stamp/version detects change.',
    },
  ],
  flashcards: [
    { front: 'CAS', back: 'Compare-And-Swap: atomic conditional update at memory word' },
    { front: 'incrementAndGet vs i++ on volatile', back: 'incrementAndGet atomic; volatile i++ is read-modify-write race' },
    { front: 'LongAdder when', back: 'Many threads incrementing same metric' },
  ],
  quickRevision: [
    'CAS retry loops',
    'Atomic* for single vars',
    'LongAdder high contention',
    'Not for multi-field invariants',
    'ABA → stamped reference',
    'VarHandle modern field CAS',
    'Spin vs lock trade-off',
  ],
}

export const content = atomicsContent
