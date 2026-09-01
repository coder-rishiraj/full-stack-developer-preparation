import type { TopicContent } from '@/domain/types'

export const garbageCollectionContent: TopicContent = {
  whatIsIt:
    'Garbage collection (GC) is the JVM’s automatic reclamation of heap objects that are no longer reachable from GC roots (thread stacks, static fields, JNI globals, synchronized monitors, etc.). Live objects are retained; unreachable objects are freed and memory compacted or reused.',
  whyExists:
    'Manual free/delete in concurrent programs causes use-after-free and leaks. GC trades predictable developer ergonomics for runtime work: tracing reachability, moving objects, and occasional stop-the-world (STW) pauses while mutator threads are halted.',
  mentalModel:
    'Mark: walk from roots, paint reachable objects. Sweep/compact: reclaim unmarked space. Generational: assume young objects die fast — minor GC on Eden often; major/full GC on Old when full. Mutator runs between GC cycles; STW pauses when collectors need consistent heap snapshot.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Reachability is strong reachability via references (no reference counting for cycles). GC roots include Java stacks, statics, active JNI handles. Collectors copy or mark live objects; dead regions become free lists or empty regions (G1).',
    },
    {
      type: 'table',
      headers: ['Term', 'Meaning'],
      rows: [
        ['Minor / Young GC', 'Collects Eden + Survivors; often copying'],
        ['Major / Old GC', 'Collects old generation'],
        ['Full GC', 'Whole heap + often metaspace/class unloading context'],
        ['STW', 'All application threads paused for safepoint work'],
        ['Concurrent phase', 'GC threads work while app runs (with barriers)'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'GC cannot fix retention bugs',
      text: 'If your code holds references (maps, caches, ThreadLocal, listeners), objects stay reachable — GC never runs on them. “Memory leak” in Java usually means unintended reachability.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Roots[GC Roots] --> Mark[Mark / Trace reachable]
  Mark --> Live[Live objects]
  Mark --> Dead[Unreachable]
  Dead --> Reclaim[Reclaim / compact regions]
  subgraph Generational [Typical layout]
    Eden[Eden]
    S0[Survivor]
    S1[Survivor]
    Old[Old Gen]
  end
  Eden -->|minor GC| S0
  S0 -->|promote| Old`,
    caption: 'Roots → mark live → reclaim dead; generational flow',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Unreachable vs leaked',
      code: `Map<String, byte[]> cache = new HashMap<>();
void handle(Request r) {
  byte[] buf = new byte[1_000_000];
  cache.put(r.id(), buf); // reachable forever → not GC-eligible
}
void ok() {
  byte[] tmp = new byte[1000]; // unreachable after ok returns → collected
}`,
    },
    {
      type: 'code',
      language: 'bash',
      caption: 'Observe GC in logs',
      code: `java -Xlog:gc*:file=gc.log:time,uptime,level \
     -XX:+UseG1GC -jar app.jar`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Safepoints: JVM stops threads at well-defined points for STW work (not every bytecode instruction).',
        'Write barriers: remembered sets track cross-generation references so minor GC finds all roots into young gen.',
        'Finalization/Cleaner/PhantomReference run after object unreachable — do not rely for prompt cleanup.',
        'System.gc() is a hint; -XX:+DisableExplicitGC may ignore it (important for DirectByteBuffer unless using Cleaner).',
        'GC ergonomics: -Xms/-Xmx, -XX:MaxGCPauseMillis (G1) influence collector behavior.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'No manual free; fewer dangling pointer bugs',
      'Moving collectors compact heap, reduce fragmentation',
      'Generational design amortizes cost for typical apps',
    ],
    disadvantages: [
      'Pause times affect latency-sensitive services',
      'GC CPU overhead proportional to live set and allocation rate',
      'Tuning required at scale',
    ],
    alternatives: [
      'Off-heap memory with manual lifecycle',
      'Rust/ C++ manual management',
      'ZGC/Shenandoah for low pause (see gc-algorithms topic)',
    ],
    whenToUse: [
      'Default Java heap model — trust GC until metrics prove pain',
    ],
    whenNotToUse: [
      'Hard sub-millisecond latency without low-pause collector tuning',
    ],
  },
  failureModes: [
    'OutOfMemoryError: Java heap space — live set exceeds -Xmx or leak.',
    'GC overhead limit exceeded — spending >98% time in GC with little reclaim.',
    'Long full GC pauses — old gen full, promotion failure, metaspace pressure.',
    'Finalizer resurrection delaying cleanup.',
  ],
  interview: {
    expectations: [
      'Define reachability and GC roots',
      'Minor vs major vs full GC',
      'Explain Java “memory leak” as strong reference retention',
    ],
    commonQuestions: [
      'How does GC know what to collect?',
      'What are GC roots?',
      'Can Java have memory leaks?',
    ],
    followUps: [
      'What triggers a Full GC?',
      'Safepoint vs saferegion?',
    ],
    misconceptions: [
      'Reference counting is primary (tracing GC)',
      'GC runs whenever memory is low only (also allocation thresholds, System.gc hint)',
    ],
    traps: ['Proposing System.gc() as production fix'],
    strongSignals: [
      'Distinguishes unreachable from leaked (reachable)',
      'Mentions generational hypothesis',
      'Uses GC logs / JFR for diagnosis',
    ],
  },
  keyTakeaways: [
    'GC collects unreachable objects from roots — not “unused” heuristics.',
    'Generational: young collections frequent/cheap; old collections costly.',
    'STW pauses at safepoints; concurrent phases reduce but don’t eliminate pauses.',
    'Leaks = lingering references (maps, ThreadLocal, static caches).',
    'Tune with logs: pause times, promotion rate, heap after GC.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What makes an object eligible for GC?',
      answerHint: 'No path of strong references from any GC root.',
    },
    {
      level: 'intermediate',
      question: 'Difference between minor and full GC?',
      answerHint: 'Minor: young gen copy/collect; Full: typically whole heap (+ class unloading context).',
    },
    {
      level: 'advanced',
      question: 'Why do write barriers exist in generational GC?',
      answerHint: 'Track old→young refs so minor GC roots include all references into young gen.',
    },
  ],
  flashcards: [
    { front: 'GC root examples', back: 'Thread stacks, statics, JNI handles, active sync monitors' },
    { front: 'Java memory leak', back: 'Unintended strong references keeping objects reachable' },
    { front: 'STW', back: 'Stop-the-world: app threads paused at safepoint for GC work' },
  ],
  quickRevision: [
    'Reachability from GC roots',
    'Young GC: Eden + Survivors',
    'Promotion → Old gen',
    'Leaks = reachable, not unreachable',
    'Safepoints for STW',
    'Write barriers for cross-gen refs',
    'Log with -Xlog:gc*',
  ],
}

export const content = garbageCollectionContent
