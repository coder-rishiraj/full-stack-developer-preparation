import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'TreeMap implements NavigableMap with a red-black tree keyed by natural ordering (Comparable) or Comparator. Keys sorted; O(log n) get, put, remove; supports range views subMap, headMap, tailMap, ceilingKey, floorKey.',
  whyExists:
    'HashMap offers speed but no ordering. When you need sorted keys, range queries, or nearest-key lookups, TreeMap provides sorted iteration and navigable operations at logarithmic cost.',
  mentalModel:
    'Balanced BST over keys. In-order traversal yields sorted keys. Compare keys via compareTo or Comparator — never null keys allowed.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Construct with default natural order or Comparator<? super K>.',
        'put replaces value for equal key per compare (not equals necessarily).',
        'subMap(from, to) returns live view bounded by key range.',
        'ceilingEntry(k) — smallest key ≥ k; floorEntry(k) — largest ≤ k.',
        'DescendingMap view for reverse order iteration.',
      ],
    },
    {
      type: 'table',
      headers: ['Operation', 'Time', 'HashMap contrast'],
      rows: [
        ['get/put/remove', 'O(log n)', 'O(1) avg'],
        ['firstKey/lastKey', 'O(log n)', 'N/A unordered'],
        ['subMap range', 'O(log n) to locate', 'Not supported'],
        ['iteration order', 'Sorted by key', 'Undefined'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Sorted map and range query',
      code: `NavigableMap<LocalDate, Integer> dailySales = new TreeMap<>();
dailySales.put(LocalDate.of(2024, 1, 5), 100);
dailySales.put(LocalDate.of(2024, 1, 1), 50);

// Sorted iteration
dailySales.forEach((date, sales) -> System.out.println(date + ": " + sales));

// All sales in January after the 3rd
NavigableMap<LocalDate, Integer> tail =
    dailySales.tailMap(LocalDate.of(2024, 1, 3), false);`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Custom Comparator — case-insensitive keys',
      code: `Map<String, Integer> counts = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
counts.put("Java", 1);
counts.put("java", 2); // same key per comparator → value replaced`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Red-black tree: self-balancing BST; maintains O(log n) height.',
        'Entry nodes: key, value, left, right, parent, color.',
        'Comparator stored; compare(key, key2) drives placement — inconsistent compareTo breaks tree.',
        'No null keys — NullPointerException on insert; null values allowed (Java 7+).',
        'ConcurrentModification fail-fast like HashMap.',
      ],
    },
  ],
  complexity: {
    average: 'O(log n) get, put, remove, navigable ops',
    worst: 'O(log n) — balanced tree guarantee',
    space: 'O(n) nodes with pointer overhead vs HashMap',
    notes: 'Slower than HashMap but provides ordering and range API.',
  },
  tradeoffs: {
    advantages: [
      'Sorted keys and range operations',
      'NavigableMap ceiling/floor/pollFirst',
      'Deterministic iteration order',
      'No hashCode dependency on keys',
    ],
    disadvantages: [
      'O(log n) vs HashMap O(1) average',
      'Keys must be mutually comparable — ClassCastException otherwise',
      'No null keys',
      'Not thread-safe',
    ],
    alternatives: [
      'HashMap when order irrelevant',
      'LinkedHashMap for insertion/access order',
      'ConcurrentSkipListMap for concurrent sorted map',
    ],
    whenToUse: [
      'Sorted key iteration',
      'Range queries on comparable keys',
      'Schedule/timeline keyed by date or score',
    ],
    whenNotToUse: [
      'Keys not Comparable and no Comparator',
      'Need null keys',
      'Pure speed — HashMap',
    ],
  },
  failureModes: [
    'Mutating key field used in compareTo after insert — tree corrupt / lookup fails.',
    'Comparator inconsistent with equals — duplicate "distinct" keys per compare.',
    'ClassCastException inserting incomparable types.',
    'Holding subMap after key range invalidated by outer map changes — CME.',
    'Using TreeMap with poor compare performance in hot path.',
  ],
  interview: {
    expectations: [
      'Red-black tree backing; O(log n) ops',
      'Comparable vs Comparator requirement',
      'NavigableMap range methods',
    ],
    commonQuestions: [
      'TreeMap vs HashMap?',
      'Internal structure of TreeMap?',
      'Can TreeMap have null keys?',
      'What is ceilingKey?',
    ],
    followUps: [
      'What happens if compareTo inconsistent with equals?',
      'ConcurrentSkipListMap vs TreeMap?',
    ],
    misconceptions: [
      'TreeMap uses hashCode (it uses comparison only)',
      'TreeMap allows null keys like HashMap',
    ],
    traps: ['Mutable key fields affecting compare order'],
    strongSignals: [
      'Red-black tree mention',
      'subMap/tailMap live view behavior',
      'Comparator vs Comparable decision',
    ],
  },
  keyTakeaways: [
    'Red-black tree; sorted keys O(log n).',
    'NavigableMap: subMap, ceiling, floor.',
    'No null keys; Comparable or Comparator required.',
    'Use when sorted iteration or range queries needed.',
    'HashMap when order not needed — faster average.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the time complexity of TreeMap get?',
      answerHint: 'O(log n) — red-black tree height.',
    },
    {
      level: 'intermediate',
      question: 'When would you choose TreeMap over HashMap?',
      answerHint: 'Sorted keys, range views, nearest-key queries; accept O(log n).',
    },
    {
      level: 'advanced',
      question: 'Why are null keys not allowed in TreeMap?',
      answerHint: 'Comparison with null undefined for natural ordering; NPE on compare.',
    },
  ],
  flashcards: [
    { front: 'TreeMap internal structure', back: 'Red-black tree (balanced BST)' },
    { front: 'TreeMap null keys', back: 'Not allowed — NullPointerException' },
    { front: 'ceilingKey(k)', back: 'Least key >= k, or null' },
  ],
  quickRevision: [
    'Sorted map O(log n)',
    'Red-black tree backing',
    'Comparable or Comparator',
    'No null keys',
    'subMap headMap tailMap',
    'NavigableMap API',
    'HashMap when no sort needed',
  ],
}
