import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'TreeSet<E> implements NavigableSet with a Red-Black tree: unique elements in sorted order. add/contains/remove O(log n); supports first, last, floor, ceiling, pollFirst for ordered set operations.',
  whyExists:
    'When you need sorted unique elements with dynamic insert and predecessor/successor queries—sliding window median helpers, “smallest unseen,” range counts—TreeSet beats sorting a list on every step.',
  mentalModel:
    'TreeMap with keys only (dummy PRESENT value). In-order iteration = ascending sort. Dual of HashSet with ordering tax O(log n).',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Elements must be Comparable or pass Comparator at construction.',
        'add(e): false if duplicate (set semantics).',
        'floor(e) / ceiling(e): largest ≤ e / smallest ≥ e in set.',
        'headSet(e), tailSet(e), subSet for range views.',
        'pollFirst() / pollLast(): pop min/max—useful for simulation.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Maintain sorted unique stream',
      code: `TreeSet<Integer> active = new TreeSet<>();
active.add(3);
active.add(1);
active.add(3); // false, duplicate
System.out.println(active.first()); // 1
Integer floor = active.floor(2);    // 1
Integer ceil = active.ceiling(2);   // 3`,
    },
    {
      type: 'table',
      headers: ['Operation', 'Time', 'HashSet compare'],
      rows: [
        ['add / contains / remove', 'O(log n)', 'HashSet O(1) avg'],
        ['first / last', 'O(log n)', 'N/A unordered'],
        ['floor / ceiling', 'O(log n)', 'N/A'],
        ['iterate', 'O(n) sorted', 'O(n) arbitrary order'],
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Contains Duplicate III: sliding window of size k; TreeSet (or TreeMap) stores window values; for each new val check if floor(val) or ceiling(val) within t of val using floor/ceiling in O(log k).',
    },
  ],
  complexity: {
    average: 'O(log n) per op',
    worst: 'O(log n)',
    space: 'O(n)',
  },
  patternRecognition: [
    'Sorted unique elements with online inserts/deletes.',
    'Need predecessor/successor among dynamic set.',
    'Two TreeSets balancing sizes for median (with lazy delete).',
    'Range count when coordinates discrete and sorted.',
  ],
  commonMistakes: [
    'Using TreeSet for pure membership when HashSet O(1) enough.',
    'Comparator inconsistency or overflow in a - b.',
    'Expecting duplicates—TreeSet rejects them.',
    'Using TreeSet with mutable elements that change order fields.',
  ],
  tradeoffs: {
    advantages: ['Sorted order', 'Navigable queries', 'No separate sort step'],
    disadvantages: ['O(log n) not O(1)', 'No null elements', 'Heavier than HashSet'],
    alternatives: ['HashSet + sort at end', 'PriorityQueue for only min or max', 'TreeMap if need counts per key'],
    whenToUse: ['Dynamic sorted set', 'Floor/ceiling on values'],
    whenNotToUse: ['Only duplicate check', 'Only min extraction (use PQ)'],
  },
  failureModes: [
    'ClassCastException if elements not mutually comparable.',
    'TLE when O(log n) per op × n² iterations—rethink approach.',
  ],
  interview: {
    expectations: ['Know navigable API', 'Compare TreeSet vs HashSet vs PQ'],
    commonQuestions: ['Contains Duplicate III', 'Count of smaller numbers after self'],
    followUps: ['How to get median from two TreeSets?'],
    misconceptions: ['TreeSet allows duplicates'],
    traps: ['Natural order on custom class without Comparable'],
    strongSignals: ['Names floor/ceiling for neighbor search in window'],
  },
  keyTakeaways: [
    'Sorted unique set; O(log n) ops.',
    'floor/ceiling for nearest neighbor in set.',
    'No nulls; need Comparable or Comparator.',
    'HashSet when order irrelevant.',
    'pollFirst/last for extracting extremes in order.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'TreeSet vs HashSet?',
      answerHint: 'TreeSet sorted O(log n); HashSet unordered O(1) avg.',
    },
    {
      level: 'intermediate',
      question: 'How to find largest element ≤ x in TreeSet?',
      answerHint: 'set.floor(x).',
    },
    {
      level: 'advanced',
      question: 'Two TreeSets median maintenance idea?',
      answerHint: 'Lower half max-heap or TreeSet tail; upper half; balance sizes; median from tops.',
    },
  ],
  flashcards: [
    {
      front: 'TreeSet duplicate add',
      back: 'Returns false; set unchanged.',
    },
    {
      front: 'TreeSet floor(x)',
      back: 'Greatest element in set ≤ x, or null.',
    },
  ],
  quickRevision: [
    'RB-tree sorted unique set',
    'O(log n) add/contains/remove',
    'floor, ceiling, first, last',
    'No null elements',
    'HashSet if no order needed',
    'NavigableSet API',
  ],
}
