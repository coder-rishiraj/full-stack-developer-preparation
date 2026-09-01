import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'HashSet<E> implements Set using a HashMap backing store: add, remove, contains in average O(1). Models unique membership—deduplication, visited nodes, cycle detection in graphs.',
  whyExists:
    'Many problems ask “have we seen this before?” without associating a value. HashSet is simpler and slightly leaner than HashMap<E, Boolean> for pure existence checks.',
  mentalModel:
    'HashMap with dummy values. Only keys matter; set semantics: no duplicates, one null element allowed, iteration order undefined.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'add(e): returns false if already present.',
        'contains(e): O(1) average membership.',
        'remove(e): O(1) average.',
        'addAll / retainAll / removeAll for set algebra.',
        'toArray or stream to list when order needed for output.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Deduplication and cycle in linked list',
      code: `Set<Integer> seen = new HashSet<>();
for (int x : nums) {
    if (!seen.add(x)) { /* duplicate */ }
}

Set<ListNode> visited = new HashSet<>();
while (head != null) {
    if (!visited.add(head)) return true; // cycle
    head = head.next;
}`,
    },
    {
      type: 'table',
      headers: ['Pattern', 'Set usage'],
      rows: [
        ['Duplicate detection', 'add returns false on repeat'],
        ['DFS visited', 'add(node) before recurse'],
        ['Union of arrays', 'addAll both into set'],
        ['Intersection', 'retainAll'],
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Longest consecutive sequence: add all nums to set; for each x where x-1 not in set, walk x, x+1, x+2… counting streak. Set gives O(1) “is x+k present?”',
    },
  ],
  complexity: {
    average: 'O(1) add/contains/remove',
    worst: 'O(n) under pathological collisions',
    space: 'O(n) unique elements',
  },
  patternRecognition: [
    'Detect duplicate in array or stream.',
    'Track visited states in BFS/DFS (coordinates, indices).',
    'Need unique elements before sort or count.',
    'Sliding window “at most K distinct” sometimes uses map not set.',
  ],
  commonMistakes: [
    'Expecting iteration order (use LinkedHashSet).',
    'Using List.contains O(n) inside loop instead of HashSet O(1).',
    'Storing mutable object in set then mutating—breaks invariant.',
    'Confusing add return value (false = already there).',
  ],
  tradeoffs: {
    advantages: ['O(1) membership', 'Clear intent vs map with dummy value'],
    disadvantages: ['No order', 'No frequency—use map for counts'],
    alternatives: ['HashMap<E,Integer> for counts', 'TreeSet for sorted unique', 'boolean[] if range small'],
    whenToUse: ['Visited / seen', 'Unique collection', 'Duplicate check'],
    whenNotToUse: ['Need counts or associated data', 'Need sorted min/max'],
  },
  failureModes: [
    'TLE from List.contains in nested loop.',
    'Wrong equals/hashCode on custom visit key (e.g. int[] without deep hash).',
  ],
  interview: {
    expectations: ['O(n) set scan vs O(n²) nested loops', 'Explain add/contains cost'],
    commonQuestions: ['Contains Duplicate', 'Longest Consecutive Sequence', 'Graph cycle detection'],
    followUps: ['LinkedHashSet vs HashSet?', 'TreeSet when?'],
    misconceptions: ['Set allows duplicates'],
    traps: ['Using reference equality on arrays as keys without Arrays.hashCode'],
    strongSignals: ['Chooses set specifically for membership not counting'],
  },
  keyTakeaways: [
    'Average O(1) add/contains/remove.',
    'add(e) false ⇒ duplicate already in set.',
    'Visited set for graph/grid DFS/BFS.',
    'No ordering; use TreeSet if sorted needed.',
    'For frequencies use HashMap not HashSet.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'HashSet vs HashMap for tracking seen elements?',
      answerHint: 'Set when no value needed; cleaner API; same underlying hash performance.',
    },
    {
      level: 'intermediate',
      question: 'How does Longest Consecutive Sequence achieve O(n)?',
      answerHint: 'Set + only start streak when x-1 absent; each element visited constant times.',
    },
    {
      level: 'advanced',
      question: 'Can you use int[] as HashSet key?',
      answerHint: 'Arrays use reference equality by default—wrap (Arrays.toString, content) or use custom key class with deep equals/hash.',
    },
  ],
  flashcards: [
    {
      front: 'HashSet add return value',
      back: 'true if newly added; false if element already present.',
    },
    {
      front: 'When HashSet over HashMap',
      back: 'Pure membership / dedup; no associated value or count.',
    },
  ],
  quickRevision: [
    'Unique elements only',
    'O(1) avg contains',
    'Visited in graph search',
    'add false = duplicate',
    'No order, no counts',
    'LinkedHashSet for insertion order',
  ],
}
