import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Java Collections Framework organizes List (ordered, duplicates), Set (unique elements), and Map (unique keys to values) under Collection and Map hierarchies. Core interfaces live in java.util; implementations differ in ordering, null policy, and complexity.',
  whyExists:
    'Raw arrays are fixed-size and lack rich operations. Collections provide growable structures, standard algorithms (sort, search), iterators, and interoperability with Streams — the backbone of everyday Java data handling.',
  mentalModel:
    'Pick by access pattern: indexed sequence → List; uniqueness bag → Set; key lookup → Map. Interface type for API; concrete impl for behavior (ArrayList vs LinkedList, HashMap vs TreeMap).',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Collection<E>: add, remove, contains, size, iterator.',
        'List<E>: positional access get(i), indexOf, subList.',
        'Set<E>: no duplicates (equals/hashCode contract).',
        'Map<K,V>: put, get, keySet, values, entrySet — not a Collection.',
        'Choose impl: ArrayList, LinkedList, HashSet, TreeSet, HashMap, TreeMap, etc.',
      ],
    },
    {
      type: 'table',
      headers: ['Interface', 'Impl', 'Order', 'Null key/value', 'Get contains'],
      rows: [
        ['List', 'ArrayList', 'Insertion', 'Allowed', 'O(1) get, O(n) contains'],
        ['List', 'LinkedList', 'Insertion', 'Allowed', 'O(n) both'],
        ['Set', 'HashSet', 'None', 'One null', 'O(1) avg'],
        ['Set', 'TreeSet', 'Sorted', 'No null', 'O(log n)'],
        ['Map', 'HashMap', 'None', 'One null key', 'O(1) avg get'],
        ['Map', 'TreeMap', 'Key sorted', 'No null key', 'O(log n) get'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Program to interfaces',
      code: `List<String> names = new ArrayList<>();
Set<Integer> seen = new HashSet<>();
Map<String, Integer> counts = new HashMap<>();

names.add("Ada");
seen.add(42);
counts.merge("click", 1, Integer::sum);

// API accepts interfaces
void process(List<String> items) { /* ... */ }`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Immutable factory methods (J9+)',
      code: `List<String> fixed = List.of("a", "b", "c");
Set<String> tags = Set.of("java", "collections");
Map<String, Integer> map = Map.of("x", 1, "y", 2);
// Null elements forbidden; fixed size`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Iterable → iterator(); enhanced for-loop desugars to iterator.',
        'AbstractCollection, AbstractList, AbstractMap provide partial implementations.',
        'fail-fast iterators: ConcurrentModificationException if structurally modified during iteration (except iterator remove).',
        'Collections utility: unmodifiable wrappers, synchronized wrappers, sort, binarySearch.',
        'Generics: List<String> compile-time type safety; erasure at runtime.',
      ],
    },
  ],
  complexity: {
    notes: 'Always state average vs worst; Tree* is O(log n); Hash* O(1) average with good hash.',
  },
  tradeoffs: {
    advantages: [
      'Rich standard library — no reinventing dynamic arrays',
      'Polymorphic APIs via interfaces',
      'Stream integration',
      'Multiple impls for same contract',
    ],
    disadvantages: [
      'Choice overload for beginners',
      'Boxing overhead for primitives — use java.util primitive streams or Troj/other libs',
      'Not thread-safe by default',
    ],
    alternatives: [
      'Arrays for fixed small primitive buffers',
      'Guava multimaps, bimaps for extended semantics',
      'Concurrent collections for shared mutation',
    ],
    whenToUse: [
      'Default: ArrayList, HashSet, HashMap for general in-memory use',
      'Sorted keys/unique sorted set: TreeMap/TreeSet',
      'Insertion-order cache: LinkedHashMap',
    ],
    whenNotToUse: [
      'Concurrent writes without ConcurrentHashMap or sync',
      'Primitive-heavy numeric arrays without boxing — use int[] or specialized libs',
    ],
  },
  failureModes: [
    'Using raw types List without generics — ClassCastException at runtime.',
    'Modifying list during enhanced for-loop — ConcurrentModificationException.',
    'Using HashSet with mutable keys without equals/hashCode.',
    'Assuming HashMap iteration order is stable.',
    'List.of/modifiable list confusion — fixed-size factory lists throw on add.',
  ],
  interview: {
    expectations: [
      'List vs Set vs Map semantics',
      'Common implementations and complexity',
      'fail-fast iteration',
    ],
    commonQuestions: [
      'Difference between List, Set, and Map?',
      'ArrayList vs LinkedList?',
      'HashMap vs TreeMap?',
      'What is fail-fast iterator?',
    ],
    followUps: [
      'When LinkedHashMap vs HashMap?',
      'ConcurrentModificationException cause?',
    ],
    misconceptions: [
      'Map extends Collection (it does not)',
      'Set allows duplicates with different hash codes (equals defines uniqueness)',
    ],
    traps: ['Choosing Vector/Hashtable without noting legacy synchronization overhead'],
    strongSignals: [
      'Decision table for impl selection',
      'Mentions equals/hashCode for Set and Map keys',
      'List.of/Map.of immutability caveats',
    ],
  },
  keyTakeaways: [
    'List: ordered, duplicates; Set: unique; Map: key-value.',
    'Program to Collection/List/Set/Map interfaces.',
    'ArrayList + HashMap + HashSet are default choices.',
    'Tree* for sorted; LinkedHash* for order memory.',
    'fail-fast: no structural mod during iteration except via Iterator.remove.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the difference between List and Set?',
      answerHint: 'List ordered with duplicates and index access; Set unique elements no duplicates.',
    },
    {
      level: 'intermediate',
      question: 'When would you choose TreeMap over HashMap?',
      answerHint: 'Need sorted keys or range queries (subMap, headMap); accept O(log n).',
    },
    {
      level: 'advanced',
      question: 'What causes ConcurrentModificationException?',
      answerHint: 'Structural modification during iteration not via iterator remove; modCount mismatch.',
    },
  ],
  flashcards: [
    { front: 'Map extends Collection?', back: 'No — separate hierarchy' },
    { front: 'Default general-purpose trio', back: 'ArrayList, HashSet, HashMap' },
    { front: 'Set uniqueness defined by', back: 'equals() — hashCode must be consistent' },
  ],
  quickRevision: [
    'List Set Map — three pillars',
    'Collection vs Map separate',
    'ArrayList HashSet HashMap defaults',
    'Tree* sorted O(log n)',
    'Program to interface',
    'fail-fast iterators',
    'List.of immutable fixed size',
  ],
}
