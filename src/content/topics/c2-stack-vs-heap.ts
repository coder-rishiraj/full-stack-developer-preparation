import type { TopicContent } from '@/domain/types'

export const stackVsHeapContent: TopicContent = {
  whatIsIt:
    'In the JVM, each thread has a private stack holding stack frames (local variables, operand stack for bytecode). The heap is shared memory where all object instances and arrays live. References (often in stack locals or other objects) point into the heap.',
  whyExists:
    'Stacks give fast LIFO allocation for method calls with automatic unwind on return. Heap enables shared, dynamically sized objects with lifetimes decoupled from any single call frame — required for OOP, collections, and cross-thread sharing.',
  mentalModel:
    'Stack = scratch paper per thread, torn off when method returns (unless references escape). Heap = warehouse of objects; GC reclaims when no reachable references. Primitives in locals live on stack; new Object() lives on heap.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'A stack frame stores local variable slots (primitives and reference values), operand stack for bytecode execution, and metadata (return address). Heap subdivides into young (Eden + Survivors) and old generations in generational collectors.',
    },
    {
      type: 'table',
      headers: ['Aspect', 'Stack', 'Heap'],
      rows: [
        ['Scope', 'Per thread', 'All threads (shared)'],
        ['Size', 'Fixed per thread (-Xss)', 'Configurable (-Xmx)'],
        ['Allocation', 'Push/pop frame — O(1)', 'TLAB bump pointer / shared alloc'],
        ['Reclamation', 'Automatic on return', 'Garbage collector'],
        ['Stores', 'Primitives, references', 'Objects, arrays'],
        ['Typical failure', 'StackOverflowError', 'OutOfMemoryError: Java heap space'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'References vs objects',
      text: 'A reference variable may sit on stack or inside another heap object. The object itself is always on the heap (except scalarized by escape analysis — optimization, not language guarantee).',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  subgraph Thread1 [Thread 1 Stack]
    F1[frame: main]
    F2[frame: foo]
    F2 --> Ref1[local ref]
  end
  subgraph Thread2 [Thread 2 Stack]
    F3[frame: bar]
  end
  subgraph Heap [Shared Heap]
    Obj1[Object instance]
    Arr[Array]
  end
  Ref1 --> Obj1
  F3 --> Obj1
  Obj1 --> Arr`,
    caption: 'Stacks hold frames; heap holds shared objects',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'What lives where',
      code: `void foo() {
  int x = 42;           // primitive local → stack frame
  String s = "hi";      // ref on stack → String object on heap (pool/intern)
  int[] a = new int[10]; // ref stack, array object heap
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Stack overflow vs heap OOM',
      code: `void recurse() { recurse(); }           // StackOverflowError
List<byte[]> leak = new ArrayList<>();
while (true) leak.add(new byte[1_000_000]); // OutOfMemoryError heap`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Default stack size platform-dependent (~1 MB/thread); deep recursion or huge local frames exhaust stack.',
        'Object header (mark word + klass pointer) precedes fields; arrays add length; alignment padding applies.',
        'Escape analysis may stack-allocate or scalar-replace short-lived objects never published — JIT optimization.',
        'Native method stacks (JNI) may use separate native stack space.',
        'Metaspace (not heap) stores class metadata; do not conflate with object heap in OOM triage.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Stack allocation/deallocation is extremely cheap',
      'Heap enables flexible object graphs and sharing',
      'Generational GC exploits most objects dying young',
    ],
    disadvantages: [
      'Heap allocation + GC pauses vs manual memory',
      'Many threads × stack size consumes virtual memory',
      'False sharing and cache effects when threads mutate shared heap objects',
    ],
    alternatives: [
      'Off-heap DirectByteBuffer / Unsafe (manual lifecycle)',
      'Value types / Project Valhalla (future — inline in arrays)',
    ],
    whenToUse: [
      'Default Java object model on heap',
      'Stack for call depth and local primitives automatically',
    ],
    whenNotToUse: [
      'Huge fixed buffers — consider direct memory with explicit free',
    ],
  },
  failureModes: [
    'StackOverflowError — unbounded recursion or extremely deep call chains.',
    'OutOfMemoryError: Java heap space — retained object graphs, missing pool bounds.',
    'OutOfMemoryError: unable to create native thread — too many threads × stack size.',
    'Assuming local object references survive after method return (they do not unless escaped).',
  ],
  interview: {
    expectations: [
      'Clear stack-per-thread vs shared heap',
      'Primitives in locals vs objects on heap',
      'Name SOE vs heap OOM causes',
    ],
    commonQuestions: [
      'Stack vs heap in Java?',
      'Where are static variables stored?',
      'Can stack store objects?',
    ],
    followUps: [
      'What is escape analysis?',
      'How does -Xss affect the JVM?',
    ],
    misconceptions: [
      'Entire object stored on stack in Java (only refs; objects on heap)',
      'Static fields on stack (they live in metaspace-linked class static storage)',
    ],
    traps: ['Saying String literals are always on stack (interned heap / pool)'],
    strongSignals: [
      'Mentions TLAB and generational heap',
      'Distinguishes reference location from object location',
      'Notes metaspace separate from heap',
    ],
  },
  keyTakeaways: [
    'Each thread: own stack of frames; all threads: shared heap.',
    'Locals hold primitives and references; objects/arrays on heap.',
    'StackOverflowError = depth; heap OOM = retention.',
    'GC reclaims unreachable heap objects, not stack.',
    'Escape analysis may optimize but heap model is the mental default.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Where are local primitive variables stored?',
      answerHint: 'In the current thread stack frame local variable array.',
    },
    {
      level: 'intermediate',
      question: 'Why is the heap shared across threads?',
      answerHint: 'Objects must be visible and mutable by multiple threads via references.',
    },
    {
      level: 'advanced',
      question: 'What is escape analysis and how does it affect allocation?',
      answerHint: 'JIT proves object does not escape method → stack allocate or scalar replace, skip heap/GC.',
    },
  ],
  flashcards: [
    { front: 'Stack scope', back: 'One per thread; frames for active method calls' },
    { front: 'Heap reclaimed by', back: 'Garbage collector when unreachable' },
    { front: 'StackOverflowError cause', back: 'Too deep recursion / insufficient -Xss' },
  ],
  quickRevision: [
    'Thread stack: frames, locals, operand stack',
    'Heap: all objects and arrays, shared',
    'Refs may be stack/local; objects always heap',
    'SOE vs OOM: depth vs retention',
    '-Xss stack, -Xmx heap',
    'Metaspace ≠ heap (class metadata)',
    'Escape analysis = JIT optimization',
  ],
}

export const content = stackVsHeapContent
