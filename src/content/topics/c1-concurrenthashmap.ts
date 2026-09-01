import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'ConcurrentHashMap is a thread-safe Map designed for high concurrency: fine-grained locking (Java 7 bins) or CAS + synchronized bin heads (Java 8+), allowing concurrent reads and scoped writes without locking the entire table like Hashtable.',
  whyExists:
    'HashMap corrupts under concurrent mutation. Hashtable synchronizes every operation — serializes all threads. ConcurrentHashMap scales reads and independent writes for caches, counters, and shared registries in multi-threaded servers.',
  mentalModel:
    'Hash table where most reads need no lock. Writes lock only one bucket/bin (or use CAS). size is approximate under contention; atomic per-key ops like computeIfAbsent simplify safe lazy init.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'get is usually lock-free — volatile reads of table nodes.',
        'put CAS-es into empty bin or locks bin head for chain/tree update.',
        'No null keys or values — NPE on null (unlike HashMap).',
        'computeIfAbsent atomically inserts if key missing — preferred for lazy init.',
        'Iteration is weakly consistent — reflects state at some point, no CME.',
      ],
    },
    {
      type: 'table',
      headers: ['Feature', 'ConcurrentHashMap', 'HashMap', 'Hashtable'],
      rows: [
        ['Thread-safe', 'Yes', 'No', 'Yes'],
        ['Null key/value', 'No', 'Yes key', 'No'],
        ['Lock granularity', 'Bin-level', 'N/A', 'Whole table'],
        ['Iterator', 'Weakly consistent', 'Fail-fast', 'Fail-fast'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Thread-safe counter and lazy cache',
      code: `ConcurrentHashMap<String, AtomicInteger> counters = new ConcurrentHashMap<>();

void recordHit(String page) {
  counters.computeIfAbsent(page, k -> new AtomicInteger()).incrementAndGet();
}

ConcurrentHashMap<String, ExpensiveObject> cache = new ConcurrentHashMap<>();

ExpensiveObject load(String key) {
  return cache.computeIfAbsent(key, k -> computeExpensive(k));
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Concurrent set from keySet view',
      code: `Set<String> uniqueIds = ConcurrentHashMap.newKeySet();
uniqueIds.add("a");
uniqueIds.add("a"); // false — duplicate`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Java 8+: Node array like HashMap; synchronized on first node of bin during write; tree bins like HashMap.',
        'sizeCtl control field coordinates initialization and resize — helping threads participate in transfer.',
        'get uses volatile reads — no lock on uncontended read path.',
        'MappingCount/size may be approximate during heavy concurrent updates.',
        'Bulk parallel operations: forEach parallelStream-like over segments/bins (forEachKey, search).',
      ],
    },
  ],
  complexity: {
    average: 'O(1) get/put under low contention',
    worst: 'O(log n) tree bin; contention serializes per bin',
    notes: 'Throughput scales better than synchronized HashMap; not unlimited linear scaling.',
  },
  tradeoffs: {
    advantages: [
      'Concurrent reads without global lock',
      'Rich atomic compute/merge API',
      'Weakly consistent iterators safe under concurrent updates',
      'newKeySet for concurrent Set',
    ],
    disadvantages: [
      'No null keys/values',
      'Higher memory and complexity than HashMap',
      'size() approximate under contention',
      'Not a drop-in for all HashMap semantics in single-thread',
    ],
    alternatives: [
      'Collections.synchronizedMap(new HashMap<>()) — simpler, coarse lock',
      'Immutable map + copy-on-write for read-heavy rare writes',
      'Caffeine/Guava cache for eviction and stats',
    ],
    whenToUse: [
      'Shared mutable maps in concurrent services',
      'Per-key lazy initialization caches',
      'Concurrent dedup sets via newKeySet()',
    ],
    whenNotToUse: [
      'Single-threaded — HashMap simpler and allows null',
      'Need transactional all-or-nothing multi-key atomicity — use DB or lock',
      'When entire map snapshot needed atomically — copy or lock externally',
    ],
  },
  failureModes: [
    'Passing null key/value — NullPointerException.',
    'Compound actions check-then-put without compute — race duplicates work.',
    'Assuming size() exact under heavy writes.',
    'Using CHM iterator expecting snapshot at single instant.',
    'Long-running computeIfAbsent blocking other ops on same key/bin.',
  ],
  interview: {
    expectations: [
      'Contrast HashMap, Hashtable, ConcurrentHashMap',
      'Segment/bin locking vs full table lock',
      'computeIfAbsent for atomic lazy init',
    ],
    commonQuestions: [
      'How does ConcurrentHashMap achieve thread safety?',
      'Why no null keys in CHM?',
      'CHM vs synchronized HashMap?',
      'What is weakly consistent iterator?',
    ],
    followUps: [
      'Java 7 segments vs Java 8 bin synchronization?',
      'Is get lock-free?',
    ],
    misconceptions: [
      'ConcurrentHashMap locks on every operation (reads mostly lock-free)',
      'It replaces need for all synchronization (multi-key atomicity still needs design)',
    ],
    traps: ['if (!map.containsKey(k)) map.put(k, v) — race; use putIfAbsent/compute'],
    strongSignals: [
      'computeIfAbsent lazy init pattern',
      'No null policy explained (ambiguity in concurrent get.contains)',
      'Weakly consistent iteration vs fail-fast',
    ],
  },
  keyTakeaways: [
    'Thread-safe HashMap alternative for concurrent apps.',
    'Fine-grained bin locks / CAS — not whole-table lock.',
    'No null keys or values.',
    'Use computeIfAbsent, merge, compute for atomic per-key ops.',
    'Iterators weakly consistent — no ConcurrentModificationException.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Is ConcurrentHashMap thread-safe?',
      answerHint: 'Yes — safe concurrent get/put without external synchronization.',
    },
    {
      level: 'intermediate',
      question: 'Why does ConcurrentHashMap not allow null keys?',
      answerHint: 'Ambiguity in concurrent code — is missing key or null value? Doug Lea design choice.',
    },
    {
      level: 'advanced',
      question: 'How does computeIfAbsent help with lazy initialization?',
      answerHint: 'Atomically computes and inserts if absent — one winner per key; others wait or get result.',
    },
  ],
  flashcards: [
    { front: 'CHM null policy', back: 'Null keys and values forbidden' },
    { front: 'vs Hashtable', back: 'CHM bin-level locking; Hashtable synchronizes every method' },
    { front: 'Weakly consistent iterator', back: 'No CME; may not reflect all concurrent updates' },
  ],
  quickRevision: [
    'Concurrent thread-safe map',
    'Bin-level lock / CAS',
    'get usually lock-free',
    'No null key/value',
    'computeIfAbsent atomic',
    'Weakly consistent iterate',
    'newKeySet() for concurrent Set',
  ],
}
