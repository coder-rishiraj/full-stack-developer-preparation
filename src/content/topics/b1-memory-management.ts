import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Memory management in JavaScript is automatic: the runtime allocates objects on the heap and reclaims unreachable memory via garbage collection. Developers control lifetime indirectly through references — retain what you need, null out or remove references when done.',
  whyExists:
    'Manual malloc/free is error-prone in application code. GC trades predictable manual control for safety and productivity, but requires understanding reference retention, leaks in long-lived apps, and heap growth patterns.',
  mentalModel:
    'Memory is a graph: objects are nodes, references are edges. GC asks “can the root set (global, stack locals, registers) reach this node?” If not, reclaim. Keeping any path alive keeps the whole reachable subgraph.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Stack holds primitives and reference pointers; heap holds objects.',
        'Allocation on object creation, closure env, arrays, etc.',
        'Mark-and-sweep (and generational refinements): mark reachable from roots, sweep unmarked.',
        'Removing last reference does not instantly free — GC runs heuristically.',
        'WeakRef/WeakMap/FinalizationRegistry for advanced non-retaining patterns.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Leaks are retained references',
      text: 'Leaks are not GC failure — something still references the object (global cache, closure, DOM listener, timer).',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Roots[Root set: global + stack]
  Reach[Reachable objects]
  Unreach[Unreachable → GC]
  Heap[Heap graph]
  Roots --> Reach
  Reach --> Heap
  Heap --> Unreach`,
    caption: 'GC keeps objects reachable from roots; sweeps the rest',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Reference retention via closure',
      code: `function leak() {
  const huge = new Array(1e6).fill('x');
  const cache = [];
  return function keep() {
    cache.push(huge); // huge stays alive while keep exists
  };
}
const fn = leak();
// huge array retained — detach: fn = null;`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'WeakMap for metadata without retention',
      code: `const meta = new WeakMap();
let obj = { id: 1 };
meta.set(obj, { visits: 0 });
obj = null; // object collectible if no other refs — WeakMap entry goes too`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Generational GC: young generation (Scavenge) vs old (mark-compact).',
        'V8: Orinoco parallel/concurrent/incremental marking.',
        'Detaching DOM nodes but keeping JS reference prevents browser reclaim of layout.',
        'SharedArrayBuffer and WASM linear memory separate from JS object heap.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'No manual free; fewer use-after-free bugs',
      'Generational GC optimizes short-lived objects',
      'Weak collections for caches tied to object lifetime',
    ],
    disadvantages: [
      'GC pauses (mitigated but present)',
      'Harder to reason about exact free timing',
      'Accidental retention causes heap growth',
    ],
    alternatives: ['Object pools for hot allocations', 'Struct-like TypedArrays for numeric data', 'Workers isolate heaps'],
    whenToUse: ['Default — understand retention for SPAs and Node servers'],
    whenNotToUse: ['Assuming immediate free on null assign — timing is GC-dependent'],
  },
  failureModes: [
    'Global arrays/maps growing unbounded (cache without eviction).',
    'Event listeners not removed — closures hold DOM/component graphs.',
    'Timers/intervals holding callbacks alive.',
    'console.log global history retaining objects (DevTools).',
  ],
  production: {
    performance: ['Heap snapshots in Chrome; Node --expose-gc only in diagnostics', 'Bound cache size / LRU'],
    scalability: ['Horizontal scale duplicates heaps — watch per-process memory'],
    reliability: ['OOM crashes Node — set memory limits in k8s'],
    observability: ['performance.memory (Chrome); clinic.js / heapdump in Node'],
    cost: ['Larger heaps need bigger instances — right-size and fix leaks'],
  },
  interview: {
    expectations: [
      'Reachability model',
      'Common leak patterns in browsers/Node',
      'WeakMap purpose',
    ],
    commonQuestions: ['How does JS free memory?', 'What causes memory leaks?', 'WeakMap vs Map?'],
    followUps: ['Generational GC?', 'DOM detach vs JS ref?'],
    misconceptions: ['delete obj.prop frees memory immediately', 'GC runs every assignment'],
    traps: ['Closures always leak — only if retaining large graphs'],
    strongSignals: ['Root set, mark-sweep, reference retention, WeakMap non-owning'],
  },
  keyTakeaways: [
    'JS memory is managed by GC — reachability from roots.',
    'Leaks = forgotten references, not broken GC.',
    'Closures, globals, listeners, timers common leak sources.',
    'WeakMap/WeakRef avoid owning object lifetime.',
    'GC timing is nondeterministic — do not depend on immediate reclaim.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Who frees memory in JavaScript?',
      answerHint: 'Garbage collector when objects unreachable from roots.',
    },
    {
      level: 'intermediate',
      question: 'Name three common memory leak sources in SPAs.',
      answerHint: 'Detached DOM+JS ref, uncleared timers/listeners, unbounded caches.',
    },
    {
      level: 'advanced',
      question: 'When would you use WeakMap?',
      answerHint: 'Associate metadata with objects without preventing GC when object otherwise dead.',
    },
  ],
  flashcards: [
    { front: 'GC reachability', back: 'Roots → mark reachable → sweep rest' },
    { front: 'Memory leak in JS', back: 'Still referenced though “unused”' },
    { front: 'WeakMap keys', back: 'Weak refs — don’t prevent key GC' },
  ],
  quickRevision: [
    'Heap objects; stack refs/primitives',
    'Mark-and-sweep from roots',
    'Leak = retained reference',
    'WeakMap for side metadata',
    'Remove listeners/timers',
    'Bound caches; heap profilers',
  ],
}
