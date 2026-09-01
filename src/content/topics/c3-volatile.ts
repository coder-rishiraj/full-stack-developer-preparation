import type { TopicContent } from '@/domain/types'

export const volatileContent: TopicContent = {
  whatIsIt:
    'The volatile keyword marks a field whose reads and writes have acquire/release semantics in the Java Memory Model: a volatile write happens-before subsequent volatile read of the same variable. Guarantees visibility and ordering for that field — not compound atomicity.',
  whyExists:
    'Plain fields allow compiler/CPU reordering and stale cache reads across threads. volatile provides a lightweight visibility mechanism without full monitor locking for simple flags and publication patterns.',
  mentalModel:
    'volatile is a “broadcast channel” for one variable. Writer flushes to shared memory; reader always sees latest value. Does not lock — multiple volatile reads/writes are not atomic as a group. For count++, use AtomicInteger or synchronized.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Property', 'volatile', 'synchronized'],
      rows: [
        ['Visibility', 'Yes (HB write→read)', 'Yes (unlock→lock)'],
        ['Atomicity (compound)', 'No', 'Yes (critical section)'],
        ['Ordering', 'Per volatile var', 'Full monitor semantics'],
        ['Blocking', 'No', 'Yes (contention)'],
        ['Null assignment', 'Safe publication of ref', 'Same with lock'],
      ],
    },
    {
      type: 'paragraph',
      text: 'JMM rule: write to volatile v happens-before read of v by another thread. Combined with program order, fixes flag publication (write data, then volatile ready=true). Does not create HB between two plain fields.',
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Not atomic for i++',
      text: 'volatile int count; count++ is read-modify-write — still a data race. Use AtomicInteger.incrementAndGet() or synchronized block.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  W[Thread W: x=42 then volatile ready=true] -->|HB| V[Shared volatile ready]
  V -->|HB| R[Thread R: reads ready then sees x=42]
  Plain[Plain field x] -.->|no HB alone| R`,
    caption: 'volatile write→read establishes happens-before for visibility',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Status flag pattern',
      code: `class Worker {
  private int result;
  private volatile boolean done;

  void compute() {
    result = heavyCalc();
    done = true; // volatile write publishes result
  }

  int awaitResult() {
    while (!done) { Thread.onSpinWait(); }
    return result; // safe: done true HB sees result write
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Double-checked locking requires volatile',
      code: `class Singleton {
  private static volatile Singleton instance;
  static Singleton getInstance() {
    if (instance == null) {
      synchronized (Singleton.class) {
        if (instance == null) instance = new Singleton();
      }
    }
    return instance;
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Compiler inserts memory barriers on many platforms for volatile access.',
        '64-bit volatile long/double always atomic read/write on all JVMs.',
        'Plain long on 32-bit JVM historically could tear — know for interviews.',
        'VarHandle and Atomic* expose volatile/plain/opaque modes explicitly.',
        'JIT may optimize but cannot break volatile JMM guarantees.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Cheaper than synchronized for single-field visibility',
      'No deadlock risk from locking',
      'Fixes publication and DCL singleton correctly',
    ],
    disadvantages: [
      'No compound atomicity — easy to misuse for counters',
      'Frequent volatile writes can inhibit optimizations',
      'Does not synchronize multiple related fields together',
    ],
    alternatives: [
      'synchronized block for multi-field invariants',
      'Atomic* classes for lock-free counters',
      'Immutable message passing (no shared mutable state)',
    ],
    whenToUse: [
      'One-writer status flags (done, shutdown, initialized)',
      'Double-checked locking instance reference',
      'State machine status fields with clear ownership',
    ],
    whenNotToUse: [
      'Incrementing counters or compound updates',
      'Protecting multiple related fields as an invariant',
    ],
  },
  failureModes: [
    'volatile count++ expecting atomicity — lost updates.',
    'Two plain fields without volatile flag — reader sees partial state.',
    'Assuming volatile makes entire object immutable.',
    'DCL without volatile — partially constructed instance visible.',
  ],
  interview: {
    expectations: [
      'Define volatile visibility via happens-before',
      'Contrast with synchronized and atomic classes',
      'Explain DCL singleton fix',
    ],
    commonQuestions: [
      'What does volatile do?',
      'volatile vs synchronized?',
      'Can volatile guarantee atomicity of i++?',
      'Why DCL needs volatile?',
    ],
    followUps: [
      'Acquire/release vs full fence?',
      'When use AtomicInteger instead?',
    ],
    misconceptions: [
      'volatile locks the variable',
      'volatile makes all object fields visible',
      'volatile prevents all reordering globally',
    ],
    traps: ['Saying volatile is “always slower than synchronized” without context'],
    strongSignals: [
      'Uses happens-before vocabulary',
      'Separates visibility from atomicity',
      'Knows DCL and flag publication patterns',
    ],
  },
  keyTakeaways: [
    'volatile = visibility + ordering for one field via HB.',
    'Not atomic for read-modify-write — use Atomic*.',
    'Fixes flag publication and DCL instance ref.',
    'synchronized for multi-field critical sections.',
    'Write data before volatile flag for safe publication.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What guarantee does volatile provide?',
      answerHint: 'Visibility: volatile write HB subsequent read; prevents stale reads.',
    },
    {
      level: 'intermediate',
      question: 'Why is volatile int x; x++ not thread-safe?',
      answerHint: '++ is read-modify-write; not atomic despite volatile visibility.',
    },
    {
      level: 'advanced',
      question: 'Why must singleton reference be volatile in DCL?',
      answerHint: 'Without HB on ref write, another thread may see partially constructed object.',
    },
  ],
  flashcards: [
    { front: 'volatile HB rule', back: 'Write to volatile HB subsequent read of same volatile' },
    { front: 'volatile vs AtomicInteger', back: 'volatile: visibility only; Atomic: CAS atomicity' },
    { front: 'DCL needs volatile', back: 'Instance ref publication ordering across threads' },
  ],
  quickRevision: [
    'Visibility not compound atomicity',
    'HB write→read same var',
    'Flag after data write pattern',
    'DCL volatile ref',
    'Use Atomic* for counters',
    'synchronized for multi-field',
    '64-bit volatile always atomic',
  ],
}

export const content = volatileContent
