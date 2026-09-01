import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Garbage collection (GC) is the automatic process of reclaiming heap memory occupied by objects that are no longer reachable from the engine root set. Modern engines (V8, SpiderMonkey, JavaScriptCore) use generational, incremental, and concurrent marking strategies.',
  whyExists:
    'Application developers cannot safely manual-free JS objects shared across closures, DOM, and async callbacks. GC provides correctness while engines optimize for short-lived allocations (typical in JS) and bounded pause times for interactive apps.',
  mentalModel:
    'Stop thinking “free this object” — think “break all paths from roots.” GC periodically traces the object graph from globals, stacks, and registers; anything not marked reachable becomes candidate for reclaim. Young objects die fast; survivors promote to older generations.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Root set: global object, current stack frames, CPU registers, closed-over environments still live.',
        'Mark phase: traverse references, mark reachable objects.',
        'Sweep/compact: reclaim unmarked space; optionally compact to reduce fragmentation.',
        'Generational hypothesis: most objects die young — nursery (Scavenge) vs old generation (mark-sweep-compact).',
        'Incremental/concurrent GC interleaves work to reduce main-thread pause (Orinoco in V8).',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'FinalizationRegistry',
      text: 'Cleanup callbacks may run after object is collected — nondeterministic timing; do not rely for critical resource release (use explicit dispose).',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  New[Young gen / Nursery]
  Old[Old gen]
  Scavenge[Scavenge copy]
  Mark[Mark-sweep-compact]
  New -->|survivors| Old
  New --> Scavenge
  Old --> Mark
  Roots[Roots] --> Mark
  Roots --> Scavenge`,
    caption: 'Short-lived objects collected in nursery; long-lived promoted to old gen',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Reachability determines collection',
      code: `let user = { name: 'Ada', posts: [] };
const posts = user.posts; // second reference to array
user = null;              // object shell maybe collectible...
// posts still holds array — inner data alive

posts.length = 0;
posts = null;             // now array unreachable if no other refs`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'WeakRef does not prevent collection',
      code: `let target = { data: 'big' };
const weak = new WeakRef(target);
target = null;
// Later — may return undefined after GC
weak.deref()?.data;`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'V8: Young generation Eden + Survivors; Scavenge copies live objects (Cheney).',
        'Mark-and-sweep old gen; concurrent marking reduces stop-the-world.',
        'Write barriers record cross-generational pointers during incremental mark.',
        'Conservative stack scanning in some embed scenarios — rare edge false retention.',
        'Node: same V8 GC; --max-old-space-size caps heap.',
      ],
    },
  ],
  complexity: {
    notes:
      'GC pause time matters more than Big-O of one collection. Amortized allocation O(1); full mark proportional to live objects, not dead.',
  },
  tradeoffs: {
    advantages: [
      'Developer productivity and safety',
      'Generational optimization matches JS allocation patterns',
      'Incremental GC improves UX latency',
    ],
    disadvantages: [
      'Pause times under heap pressure',
      'Nondeterministic collection timing',
      'False sense that delete/null always helps immediately',
    ],
    alternatives: ['Manual arenas in WASM', 'Object pooling', 'Rust sidecar for tight memory control'],
    whenToUse: ['Default — tune when profiling shows GC pressure'],
    whenNotToUse: ['Demanding hard real-time without profiling — measure pauses first'],
  },
  failureModes: [
    'Memory leak mistaken for GC bug — actually strong references remain.',
    'Allocation churn causing frequent Scavenge — perf hit.',
    'Relying FinalizationRegistry for closing files/sockets.',
    'Huge old-gen heap → long mark pauses.',
  ],
  production: {
    performance: ['Reduce allocation churn; reuse buffers; profile with chrome://tracing / clinic heapprofiler'],
    scalability: ['Per-process heap limits; scale out before single heap explodes'],
    reliability: ['OOM killer on Node — handle graceful shutdown'],
    observability: ['GC metrics in Node diagnostic reports; GCEvents in performance timeline'],
    cost: ['Right-size containers; leaks inflate cloud RAM bills'],
  },
  interview: {
    expectations: [
      'Mark-and-sweep reachability',
      'Generational GC intuition',
      'Leak vs GC failure distinction',
    ],
    commonQuestions: ['How does JS GC work?', 'Mark-and-sweep steps?', 'Generational GC why?'],
    followUps: ['Incremental GC?', 'WeakRef use case?'],
    misconceptions: ['Reference counting alone (cycles broke pure RC)', 'null assigns instant free'],
    traps: ['Circular refs always leak — mark-sweep handles cycles if unreachable from roots'],
    strongSignals: ['Root set, generational, incremental, retention not delete timing'],
  },
  keyTakeaways: [
    'GC reclaims unreachable objects from roots — not unreferenced in app logic sense alone.',
    'Mark-and-sweep handles cycles unreachable from outside.',
    'Generational: young collected often; survivors promoted.',
    'Modern engines incrementally/concurrently mark to cut pauses.',
    'Leaks are strong references; WeakMap/WeakRef do not count as strong.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What triggers garbage collection in JavaScript?',
      answerHint: 'Engine heuristics when heap pressure — not deterministic from user code.',
    },
    {
      level: 'intermediate',
      question: 'Explain mark-and-sweep.',
      answerHint: 'Mark all reachable from roots; sweep unmarked memory.',
    },
    {
      level: 'advanced',
      question: 'Why generational garbage collection?',
      answerHint: 'Most objects die young — cheap frequent nursery collection; rare full old-gen.',
    },
  ],
  flashcards: [
    { front: 'GC root set', back: 'Global, stack, registers, live envs' },
    { front: 'Generational hypothesis', back: 'Most objects die young' },
    { front: 'Circular unreachable graph', back: 'Collected — not reachable from roots' },
  ],
  quickRevision: [
    'Reachability from roots',
    'Mark → sweep/compact',
    'Young Scavenge; old mark-sweep',
    'Incremental reduces pauses',
    'Cycles OK if unreachable',
    'Leaks = strong refs remain',
  ],
}
