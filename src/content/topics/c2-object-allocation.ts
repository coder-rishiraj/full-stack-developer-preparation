import type { TopicContent } from '@/domain/types'

export const objectAllocationContent: TopicContent = {
  whatIsIt:
    'Object allocation is the JVM path from `new` (or factory methods) to a live instance on the heap: bump-pointer in Eden (often via TLAB), possible promotion to Survivor/Old gen, with optional stack/scalar optimization when escape analysis proves the object never escapes.',
  whyExists:
    'Most Java code creates short-lived temporaries. Fast allocation in thread-local buffers (TLAB) avoids synchronization on every `new`. Generational layout matches the “most objects die young” hypothesis for cheap minor GC.',
  mentalModel:
    'Thread asks TLAB for N bytes in Eden → if fits, bump pointer forward (fast). TLAB full → refill from Eden (may trigger minor GC). Object survives collections → copy to Survivor, age, eventually promote to Old. Long-lived caches land in Old directly if humongous or after aging.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'HotSpot default: generational heap. New objects allocate in Eden unless too large (G1 humongous regions) or TLAB disabled. Minor GC copies live objects to Survivor spaces; objects crossing age threshold (MaxTenuringThreshold, default 15) promote to Old.',
    },
    {
      type: 'table',
      headers: ['Path', 'When', 'Cost'],
      rows: [
        ['TLAB bump', 'Default small/medium object in Eden', 'Very low — no global lock'],
        ['Shared Eden alloc', 'TLAB exhausted', 'Synchronized slow path'],
        ['Humongous (G1)', 'Object > 50% region size', 'Direct old/humongous region'],
        ['Scalar replacement', 'JIT escape analysis', 'No heap alloc at all (optimized away)'],
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Object header cost',
      text: '64-bit HotSpot: mark word (8) + klass pointer (8, compressed oops → 4) + alignment. A lone boolean field still costs ~16–24 bytes — interviewers care about allocation rate and padding.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  New[new / factory] --> TLAB{TLAB space?}
  TLAB -->|yes| Bump[bump pointer Eden]
  TLAB -->|no| Refill[refill TLAB / slow path]
  Refill --> MinorGC{Minor GC?}
  MinorGC --> Survivor[Survivor copy]
  Survivor -->|age threshold| Old[Old generation]
  Bump --> Live[Object live]
  EA[Escape analysis] -.->|scalarize| NoHeap[no heap alloc]`,
    caption: 'Fast path: TLAB in Eden; survivors promote',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Allocation hotspots',
      code: `for (int i = 0; i < n; i++) {
  String s = "item" + i;        // new StringBuilder + char[] churn
  list.add(new Event(id++));    // many short-lived Event objects
}
// Fix: reuse StringBuilder, pool events, or primitive arrays`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Escape analysis candidate',
      code: `int sum(int[] a) {
  Point p = new Point(0, 0); // may never hit heap if not stored/returned
  for (int v : a) p.x += v;
  return p.x;
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'TLAB (Thread-Local Allocation Buffer): per-thread chunk of Eden; -XX:+UseTLAB (default on).',
        'Card table / remembered set: tracks old→young references for minor GC roots.',
        'Prefetching and alignment: objects aligned to 8 bytes; arrays need header + length.',
        'Large arrays may allocate directly in old gen on some collectors.',
        'Allocation profiling: JFR event ObjectAllocationInNewTLAB / OutsideTLAB.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'TLAB makes allocation mostly lock-free',
      'Generational GC matches typical allocation patterns',
      'Escape analysis removes alloc/GC pressure in hot loops',
    ],
    disadvantages: [
      'High allocation rate → frequent minor GC, CPU overhead',
      'Object overhead vs packed primitives in arrays',
      'Promotion floods old gen → full GC pressure',
    ],
    alternatives: [
      'Object pools (use carefully — often worse than GC)',
      'Primitive arrays or off-heap buffers for bulk data',
      'Records/immutable value semantics with fewer mutations',
    ],
    whenToUse: [
      'Normal OOP modeling — let TLAB + minor GC work',
      'Profile before micro-optimizing allocation',
    ],
    whenNotToUse: [
      'Millions of tiny throwaway objects in hot path without profiling',
      'Manual pooling without measured gain (complexity + leaks)',
    ],
  },
  failureModes: [
    'Premature promotion — long-lived objects mixed with churn fill Old gen quickly.',
    'Allocation stall during GC (especially if heap nearly full).',
    'Humongous object fragmentation in G1.',
    'Assuming escape analysis always removes allocation (not guaranteed across deopts).',
  ],
  interview: {
    expectations: [
      'Explain TLAB and Eden allocation',
      'Generational promotion and aging',
      'Object header / compressed oops awareness',
    ],
    commonQuestions: [
      'What happens when you execute new Foo()?',
      'What is TLAB?',
      'How does escape analysis help?',
    ],
    followUps: [
      'Eden vs Survivor vs Old?',
      'Impact of allocation rate on GC?',
    ],
    misconceptions: [
      'Every new synchronizes globally (TLAB avoids that)',
      'GC runs on every allocation (only when heap pressure triggers)',
    ],
    traps: ['Recommending object pools as default optimization'],
    strongSignals: [
      'Mentions bump pointer and TLAB refill',
      'Knows G1 humongous threshold (~half region)',
      'Ties allocation rate to minor GC frequency',
    ],
  },
  keyTakeaways: [
    'Default alloc: TLAB bump in Eden — fast, thread-local.',
    'Minor GC copies survivors; aged objects promote to Old.',
    'High alloc rate drives GC CPU — profile JFR allocation events.',
    'Object headers add overhead; prefer arrays of primitives when bulk.',
    'Escape analysis can eliminate heap alloc — optimization, not spec.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Where are new objects typically allocated?',
      answerHint: 'Eden (young gen), often via TLAB per thread.',
    },
    {
      level: 'intermediate',
      question: 'What is TLAB and why does it exist?',
      answerHint: 'Thread-local Eden slice; bump allocate without locking on every new.',
    },
    {
      level: 'advanced',
      question: 'When does an object get promoted to the old generation?',
      answerHint: 'Survives enough minor GCs (aging ≥ MaxTenuringThreshold) or humongous/large alloc rules.',
    },
  ],
  flashcards: [
    { front: 'TLAB purpose', back: 'Lock-free fast allocation in Eden per thread' },
    { front: 'Generational hypothesis', back: 'Most objects die young → cheap minor GC' },
    { front: 'Promotion', back: 'Survivor → Old after surviving configured GC cycles' },
  ],
  quickRevision: [
    'new → TLAB bump in Eden',
    'TLAB full → slow path / minor GC',
    'Survivor spaces + aging counter',
    'Promote to Old after threshold',
    'G1 humongous if > half region',
    'Escape analysis → scalarize',
    'Watch allocation rate in JFR',
  ],
}

export const content = objectAllocationContent
