import type { TopicContent } from '@/domain/types'

export const hashmapInternalsContent: TopicContent = {
  whatIsIt:
    'HashMap is Java’s primary hash-table implementation of Map: average O(1) get/put/remove by hashing the key, indexing a bucket array, and resolving collisions with linked lists or balanced trees (Java 8+).',
  whyExists:
    'Associative lookup by key is foundational — caches, indexes, deduplication, frequency counts. Array indexing needs contiguous integer keys; HashMap generalizes to arbitrary keys via hashCode + equals.',
  mentalModel:
    'Compute bucket index = hash(key) mod table.length. Walk that bucket’s chain until equals() matches. On resize (load factor exceeded), double capacity and rehash every entry — expensive but amortized.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Default initial capacity 16, load factor 0.75 → resize at ~12 entries. Keys must obey the contract: equal keys ⇒ same hashCode; unequal keys may collide.',
    },
    {
      type: 'table',
      headers: ['Operation', 'Average', 'Worst (pre-J8 chain)', 'Worst (J8+ tree bucket)'],
      rows: [
        ['get', 'O(1)', 'O(n) all collide', 'O(log n) per bucket tree'],
        ['put', 'O(1)', 'O(n)', 'O(log n)'],
        ['remove', 'O(1)', 'O(n)', 'O(log n)'],
        ['resize', 'O(n) entries', '—', '—'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'HashMap is not thread-safe',
      text: 'Concurrent updates without synchronization corrupt the table. Use ConcurrentHashMap, Collections.synchronizedMap, or external locking.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Key[key] --> Hash[hash spread]
  Hash --> Index[bucket index]
  Index --> Bucket[bucket array]
  Bucket --> Node[Node chain or TreeNode]
  Node --> Val[value]`,
    caption: 'Key → hash → bucket → chain/tree → value',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Correct key type for HashMap',
      code: `public record UserId(long id) {}

Map<UserId, String> names = new HashMap<>();
names.put(new UserId(1L), "Ada");
// get works only if equals/hashCode defined on UserId`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Mutable key bug — never do this',
      code: `class BadKey {
  int x;
  BadKey(int x) { this.x = x; }
  // equals/hashCode on x only
}
BadKey k = new BadKey(1);
map.put(k, "v");
k.x = 2; // key moved buckets — get(k) returns null, "v" orphaned`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Node: hash, key, value, next. TreeNode extends Node when bucket chain length ≥ TREEIFY_THRESHOLD (8) and table length ≥ MIN_TREEIFY_CAPACITY (64).',
        'hash(key): spreads high bits of hashCode to reduce clustering when capacity is power of 2.',
        'resize: new table 2× size; recompute index for each node; may untreeify if chain shrinks below UNTREEIFY_THRESHOLD (6).',
        'null key allowed once — stored in bucket 0.',
        'Iteration order is undefined; LinkedHashMap preserves insertion or access order; TreeMap sorts by key.',
      ],
    },
  ],
  complexity: {
    average: 'O(1) get/put/remove',
    worst: 'O(n) if all keys hash to same bucket (mitigated by treeification)',
    space: 'O(n) entries + bucket array overhead',
    notes: 'Resize is O(n) but amortized O(1) per insert under uniform hashing.',
  },
  implementation: [
    {
      language: 'java',
      caption: 'Sizing for known cardinality',
      code: `int n = 10_000;
int cap = (int) (n / 0.75f) + 1;
Map<String, Integer> m = new HashMap<>(cap);`,
    },
    {
      language: 'java',
      caption: 'Java 8+ computeIfAbsent (atomic per key in HashMap — still not thread-safe across keys)',
      code: `map.computeIfAbsent(key, k -> expensiveLoad(k));`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Fast average lookup and mutation',
      'Flexible key types when contract honored',
      'Rich API: merge, compute, forEach',
    ],
    disadvantages: [
      'Not ordered; not thread-safe',
      'Resize pauses and rehash cost',
      'Poor hashCode ⇒ treeify or long chains',
    ],
    alternatives: [
      'ConcurrentHashMap for concurrent reads/writes',
      'LinkedHashMap for LRU-like ordering',
      'TreeMap for sorted keys O(log n)',
      'EnumMap when keys are enum constants',
    ],
    whenToUse: [
      'General-purpose in-memory key-value maps',
      'Single-threaded or externally synchronized access',
    ],
    whenNotToUse: [
      'Shared mutable map across threads without CHM',
      'Keys without stable equals/hashCode',
      'Need sorted iteration by key',
    ],
  },
  failureModes: [
    'Mutable keys change hash bucket after insert — “lost” entries and memory leaks.',
    'Broken equals/hashCode contract → duplicates or failed lookups.',
    'Using identity hash on arrays (default) as keys — use Arrays.hashCode or wrap.',
    'Concurrent put/get without synchronization → infinite loops or lost data (pre-J8) / corruption.',
    'Assuming iteration order is stable across resizes.',
  ],
  production: {
    performance: [
      'Pre-size map when entry count known',
      'Use good hash functions on custom keys (Objects.hash, record auto-generation)',
    ],
    scalability: [
      'For high concurrency, ConcurrentHashMap segments/buckets with CAS',
    ],
    reliability: ['Immutable keys (records, Strings, Long) reduce foot-guns'],
    observability: ['Profile resize frequency and bucket chain depth in hot paths'],
  },
  interview: {
    expectations: [
      'Explain bucket array, hash spread, collision resolution',
      'State load factor, resize, Java 8 treeification thresholds',
      'Recite equals/hashCode contract and mutable-key trap',
    ],
    commonQuestions: [
      'How does HashMap work internally?',
      'What happens on resize?',
      'HashMap vs ConcurrentHashMap?',
      'Why must equal objects have equal hash codes?',
    ],
    followUps: [
      'What if two unequal keys have the same hashCode?',
      'Why power-of-two capacity?',
    ],
    misconceptions: [
      'HashMap is thread-safe (it is not)',
      'hashCode uniqueness is required (collisions are expected)',
      'Treeification makes all operations O(log n) globally (only per heavy bucket)',
    ],
    traps: ['Suggesting Hashtable without noting legacy synchronized overhead'],
    strongSignals: [
      'Mentions TREEIFY_THRESHOLD 8, MIN_TREEIFY_CAPACITY 64',
      'Explains mutable key failure with concrete example',
      'Distinguishes HashMap, LinkedHashMap, TreeMap, ConcurrentHashMap',
    ],
  },
  keyTakeaways: [
    'Index = spread(hashCode) mod capacity; resolve collisions with chain/tree.',
    'Load factor 0.75 triggers 2× resize and full rehash.',
    'Equal keys must share hashCode; use immutable keys.',
    'Average O(1); worst O(n) or O(log n) per bucket with trees.',
    'Not thread-safe — use ConcurrentHashMap concurrently.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the default initial capacity and load factor of HashMap?',
      answerHint: '16 and 0.75; resize when size > capacity × load factor.',
    },
    {
      level: 'intermediate',
      question: 'When does Java 8 convert a bucket chain to a red-black tree?',
      answerHint: 'Chain length ≥ 8 and table length ≥ 64; untreeify when ≤ 6.',
    },
    {
      level: 'advanced',
      question: 'Why can mutating a key after put break HashMap?',
      answerHint: 'hash index changes; entry stays in old bucket; get misses.',
    },
  ],
  flashcards: [
    { front: 'HashMap load factor', back: '0.75 — resize when size exceeds capacity × 0.75' },
    { front: 'Treeify thresholds', back: 'Chain ≥ 8 and table ≥ 64 → TreeNode; ≤ 6 → list' },
    { front: 'equals/hashCode rule', back: 'a.equals(b) ⇒ a.hashCode() == b.hashCode()' },
  ],
  quickRevision: [
    'Array of buckets; hash → index',
    'Collisions: linked list, tree if chain long',
    'Resize doubles capacity, rehash all',
    'null key → bucket 0',
    'Immutable keys; contract for equals/hashCode',
    'ConcurrentHashMap for threads',
    'Avg O(1), bad hash → long chains',
  ],
}

export const content = hashmapInternalsContent
