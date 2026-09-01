import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'HashSet implements Set using a HashMap internally: elements stored as keys with a dummy PRESENT object as value. Provides average O(1) add, remove, and contains with no iteration order guarantee.',
  whyExists:
    'When you need uniqueness checks and membership tests at scale, linear scans of List are O(n). HashSet deduplicates and tests membership in average constant time using hashing.',
  mentalModel:
    'HashMap where you only care about keys. add(e) is map.put(e, PRESENT); contains(e) is map.containsKey(e). Uniqueness defined by equals — two equal elements cannot coexist.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Backed by HashMap<E, Object> — only keySet used.',
        'add returns false if element already present (equals match).',
        'Allows one null element (HashMap null key).',
        'Iteration order undefined — changes with resize.',
        'LinkedHashSet preserves insertion order; same O(1) avg ops.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'equals/hashCode contract',
      text: 'Elements must implement consistent equals and hashCode. Mutable elements that change hash break Set contract — element becomes "lost".',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Deduplication and membership',
      code: `Set<String> unique = new HashSet<>();
for (String line : lines) {
  unique.add(line.trim());
}

if (unique.contains("ERROR")) {
  alert("Errors present");
}

// Set algebra
Set<Integer> a = Set.of(1, 2, 3);
Set<Integer> b = Set.of(2, 3, 4);
Set<Integer> intersection = new HashSet<>(a);
intersection.retainAll(b); // {2, 3}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Record elements — auto equals/hashCode',
      code: `record Tag(String name) {}

Set<Tag> tags = new HashSet<>();
tags.add(new Tag("java"));
tags.add(new Tag("java")); // duplicate rejected — equals match`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Dummy value: private static final Object PRESENT = new Object().',
        'Inherits HashMap bucket array, treeification, load factor 0.75 behavior.',
        'iterator returns keySet iterator — fail-fast on concurrent mod.',
        'Initial capacity 16; like HashMap, pre-size with expected element count.',
        'EnumSet is specialized bit-set when elements are enum — prefer over HashSet for enums.',
      ],
    },
  ],
  complexity: {
    average: 'O(1) add, remove, contains',
    worst: 'O(n) if all elements collide; O(log n) per bucket with treeification',
    space: 'O(n) plus HashMap overhead',
    notes: 'Same as HashMap key operations.',
  },
  tradeoffs: {
    advantages: [
      'Fast uniqueness and lookup',
      'Simple API; Set semantics enforced',
      'Works with any type honoring equals/hashCode',
    ],
    disadvantages: [
      'No ordering',
      'Not thread-safe',
      'Depends on quality of hashCode',
      'Higher memory than list due to map overhead',
    ],
    alternatives: [
      'TreeSet for sorted unique elements O(log n)',
      'LinkedHashSet for insertion-order iteration',
      'EnumSet for enum elements',
      'ConcurrentHashMap.newKeySet() for concurrent set',
    ],
    whenToUse: [
      'Deduplicate collection',
      'Fast contains checks',
      'Graph visited set, permission membership',
    ],
    whenNotToUse: [
      'Need sorted traversal — TreeSet',
      'Concurrent mutation — ConcurrentHashMap.newKeySet()',
      'Mutable elements with changing hashCode',
    ],
  },
  failureModes: [
    'Mutable object added then mutated — contains fails, duplicate "distinct" objects possible.',
    'Missing hashCode when equals overridden — broken contract, duplicates in set.',
    'Assuming iteration order stable across runs.',
    'Using HashSet where List order matters for output.',
    'Not overriding equals for custom types — identity-based uniqueness only.',
  ],
  interview: {
    expectations: [
      'HashSet backed by HashMap',
      'equals/hashCode contract',
      'HashSet vs TreeSet vs LinkedHashSet',
    ],
    commonQuestions: [
      'How is HashSet implemented internally?',
      'How does HashSet ensure uniqueness?',
      'Can HashSet contain null?',
      'HashSet vs TreeSet?',
    ],
    followUps: [
      'What if hashCode changes after insert?',
      'EnumSet vs HashSet?',
    ],
    misconceptions: [
      'HashSet uses equals only (uses hashCode first to find bucket, then equals)',
      'HashSet maintains insertion order (only LinkedHashSet does)',
    ],
    traps: ['Custom class without hashCode in HashSet'],
    strongSignals: [
      'PRESENT dummy value detail',
      'Mutable key/set element trap example',
      'Pre-sizing and load factor mention',
    ],
  },
  keyTakeaways: [
    'HashSet = HashMap keys only; PRESENT values.',
    'Uniqueness by equals; hashCode locates bucket.',
    'Avg O(1) ops; no order.',
    'One null allowed; not thread-safe.',
    'Use records/immutable types as elements.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What data structure backs HashSet?',
      answerHint: 'HashMap — elements are keys mapped to constant dummy object.',
    },
    {
      level: 'intermediate',
      question: 'Why must equal objects have the same hashCode for HashSet?',
      answerHint: 'Set uses hash to find bucket first; unequal hash skips equals check — duplicates possible.',
    },
    {
      level: 'advanced',
      question: 'What happens if an element\'s hashCode changes while in HashSet?',
      answerHint: 'Wrong bucket; contains returns false; cannot remove normally — memory leak.',
    },
  ],
  flashcards: [
    { front: 'HashSet internal map value', back: 'Static PRESENT sentinel object' },
    { front: 'Uniqueness criterion', back: 'equals() — at most one equal element' },
    { front: 'Null in HashSet', back: 'One null element allowed' },
  ],
  quickRevision: [
    'HashMap-backed Set',
    'O(1) avg add/contains/remove',
    'No iteration order',
    'equals + hashCode required',
    'Immutable elements safest',
    'LinkedHashSet for order',
    'TreeSet for sorted',
  ],
}
