import type { TopicContent } from '@/domain/types'

export const jmmContent: TopicContent = {
  whatIsIt:
    'The Java Memory Model (JMM) is the specification (JLS Chapter 17) defining when writes by one thread are visible to reads by another and which instruction reorderings compilers and CPUs may perform. It is formalized via happens-before relationships — not “main memory” folklore alone.',
  whyExists:
    'Without rules, optimized hardware and JIT would break naive single-thread reasoning. The JMM gives portable guarantees for synchronized, volatile, thread start/join, and concurrent APIs so correctly synchronized programs behave consistently on all JVMs.',
  mentalModel:
    'If action A happens-before B, B is guaranteed to observe A’s memory effects. Without a happens-before edge, conflicting accesses form a data race: the JMM still constrains executions, but counterintuitive non-sequentially-consistent results can occur.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Happens-before is partial order: intra-thread program order, monitor unlock→lock, volatile write→read, Thread.start, Thread.join, concurrent utilities documented HB edges, safe publication of final fields after ctor completes.',
    },
    {
      type: 'table',
      headers: ['Edge', 'Rule'],
      rows: [
        ['Program order', 'Within same thread, earlier stmt HB later (with exceptions around pipes)'],
        ['Monitor', 'unlock(m) HB subsequent lock(m)'],
        ['volatile', 'write HB subsequent read of same var'],
        ['Thread lifecycle', 'start() HB run; actions in thread HB join() returns'],
        ['final fields', 'Ctor completion HB first read of final by other thread (safe publication)'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Data race definition',
      text: 'Two conflicting accesses to the same variable, at least one write, not ordered by happens-before → data race. Java does not call this C/C++-style undefined behavior, but correctly synchronized reasoning no longer applies and surprising legal results can occur.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  T1[Thread 1] -->|write x| W[Working memory / caches]
  T2[Thread 2] -->|read x| R[Working memory / caches]
  W -->|volatile / unlock| Main[Shared memory coherence]
  Main --> R
  HB[happens-before edge] -.->|orders visibility| Main`,
    caption: 'Sync/volatile creates HB → visibility across threads',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Broken without HB (DO NOT USE)',
      code: `class Broken {
  int x;
  boolean ready;
  void writer() { x = 42; ready = true; } // reorder possible
  int reader() {
    if (ready) return x; // may see ready true but x 0
    return -1;
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Fixed with volatile',
      code: `volatile boolean ready;
void writer() { x = 42; ready = true; }
// ready write HB ready read → sees x=42 if ready true`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Compiler reordering: as-if-serial within thread unless HB constraints.',
        'CPU store buffers and cache coherence (MESI) cause visibility delay without fences.',
        'volatile inserts memory barriers on many platforms; JIT may elide redundant fences.',
        'final field safe publication: freeze semantics after constructor for finals.',
        'VarHandle/Atomic* operations carry volatile/acquire/release semantics explicitly.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Portable reasoning across hardware',
      'Enables optimizations while preserving correct programs',
      'Documents concurrent library guarantees',
    ],
    disadvantages: [
      'Subtle; easy to miss HB path',
      'Performance cost of fences on hot volatile paths',
      'Misleading “main memory” teaching oversimplifies',
    ],
    alternatives: [
      'Immutable messages (no shared mutation)',
      'Software transactional memory (not in core Java)',
    ],
    whenToUse: [
      'Design any cross-thread shared state',
      'Review double-checked locking, lazy singletons',
    ],
    whenNotToUse: [
      'Single-threaded code — JMM overhead irrelevant',
    ],
  },
  failureModes: [
    'Partially constructed object escape from ctor without final/immutable discipline.',
    'Double-checked locking without volatile on instance ref.',
    'Non-volatile 64-bit long/double torn reads on 32-bit JVM (historical; know spec).',
    'Incorrectly assuming flush on every field write.',
  ],
  interview: {
    expectations: [
      'Define happens-before clearly',
      'Explain volatile and synchronized visibility',
      'Fix broken flag pattern',
    ],
    commonQuestions: [
      'What is the Java Memory Model?',
      'volatile vs synchronized visibility?',
      'Why DCL singleton needs volatile?',
    ],
    followUps: [
      'What is a data race?',
      'final field safe publication?',
    ],
    misconceptions: [
      'Every write instantly visible to all threads',
      'volatile makes all fields atomic',
    ],
    traps: ['Drawing “main memory” without mentioning HB rules'],
    strongSignals: [
      'Uses happens-before vocabulary correctly',
      'Explains reordering + visibility separately from atomicity',
      'Cites monitor and volatile rules',
    ],
  },
  keyTakeaways: [
    'JMM = visibility and ordering rules via happens-before.',
    'Data races permit counterintuitive outcomes; Java still imposes causality and safety constraints.',
    'synchronized/volatile/thread start/join create HB edges.',
    'volatile fixes flag publication; lock for compound state.',
    'final fields + safe publication after ctor complete.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does happens-before mean?',
      answerHint: 'Prior action’s memory effects visible to subsequent action; partial order.',
    },
    {
      level: 'intermediate',
      question: 'Why can reader see ready=true but x=0 without volatile?',
      answerHint: 'Reordering and lack of HB between writer fields and reader.',
    },
    {
      level: 'advanced',
      question: 'How do final fields help safe publication?',
      answerHint: 'JMM guarantees other threads see correct final values after fully constructed object visible.',
    },
  ],
  flashcards: [
    { front: 'Data race', back: 'Unordered concurrent access, ≥1 write, same location' },
    { front: 'volatile HB', back: 'Write to volatile HB subsequent read of that volatile' },
    { front: 'unlock HB', back: 'unlock HB next lock on same monitor' },
  ],
  quickRevision: [
    'HB not “main memory”',
    'Program order within thread',
    'Monitor unlock→lock',
    'volatile write→read',
    'start/join HB edges',
    'Data race = no sequential-consistency guarantee',
    'DCL needs volatile ref',
  ],
}

export const content = jmmContent
