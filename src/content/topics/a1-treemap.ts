import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'TreeMap<K,V> is a Red-Black tree implementation of SortedMap: keys ordered by natural order or Comparator. get/put/remove and navigation (floor, ceiling, higher, lower) in O(log n).',
  whyExists:
    'HashMap is unordered. Problems needing “next larger key,” running median by key, interval scheduling by end time, or sweep line by coordinate require sorted key order without sorting every query.',
  mentalModel:
    'Balanced BST keyed by K. In-order traversal = sorted keys. Think sorted array with O(log n) insert/delete instead of O(n) shift.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Natural order: keys implement Comparable (Integer, String).',
        'Custom: new TreeMap<>((a,b) -> a[0]-b[0]) — avoid overflow in subtract comparator.',
        'floorKey(k) / ceilingKey(k): largest ≤ k / smallest ≥ k.',
        'pollFirstEntry / pollLastEntry: extract min/max key.',
        'subMap, headMap, tailMap for range views.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Sweep line / meeting rooms variant',
      code: `TreeMap<Integer, Integer> timeline = new TreeMap<>();
timeline.merge(start, 1, Integer::sum);
timeline.merge(end, -1, Integer::sum);
int active = 0;
for (var e : timeline.entrySet()) {
    active += e.getValue();
    // track max concurrent
}`,
    },
    {
      type: 'table',
      headers: ['Operation', 'Time'],
      rows: [
        ['get / put / remove', 'O(log n)'],
        ['firstKey / lastKey', 'O(log n)'],
        ['floor / ceiling', 'O(log n)'],
        ['iterate all', 'O(n) sorted'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Null keys',
      text: 'TreeMap does not allow null keys (NullPointerException). HashMap allows one null key.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Root[RBT root] --> L[left subtree smaller keys]
  Root --> R[right subtree larger keys]
  Nav[floor/ceiling] --> Root`,
    caption: 'Red-Black tree ordered by key',
  },
  example: [
    {
      type: 'paragraph',
      text: 'My Calendar I: TreeMap<Integer,Integer> booked by start → end. For new [s,e), use floorEntry(s) to check overlap with previous interval and check if s < prev.end.',
    },
  ],
  complexity: {
    average: 'O(log n) per map op',
    worst: 'O(log n) — tree stays balanced',
    space: 'O(n)',
  },
  patternRecognition: [
    'Need sorted keys or predecessor/successor queries.',
    'Sweep line: coordinate → delta count.',
    'Sliding window median with two TreeMaps or TreeMultiset pattern.',
    'Schedule by time; interval overlap with ordered starts.',
  ],
  commonMistakes: [
    'Comparator subtract overflow: use Integer.compare(a,b).',
    'Assuming HashMap speed O(1)—TreeMap is O(log n).',
    'Inserting null key.',
    'Mutating key after insert (same as HashMap—breaks order).',
  ],
  tradeoffs: {
    advantages: ['Sorted iteration', 'Floor/ceiling navigation', 'Deterministic O(log n)'],
    disadvantages: ['Slower than HashMap', 'No null keys', 'Comparator must be consistent with equals'],
    alternatives: ['Sort keys once + binary search', 'PriorityQueue if only min/max needed', 'HashMap + sort on output'],
    whenToUse: ['Order statistics on keys', 'Sweep lines', 'Range queries on static keys'],
    whenNotToUse: ['Pure O(1) lookup only', 'Keys not comparable'],
  },
  failureModes: [
    'TLE using TreeMap where HashMap suffices.',
    'Inconsistent comparator → undefined behavior / wrong order.',
  ],
  interview: {
    expectations: ['Know O(log n) ops and floor/ceiling API', 'Compare to HashMap and PQ'],
    commonQuestions: ['My Calendar', 'Count smaller after self (with TreeMap or merge sort)'],
    followUps: ['RB tree vs AVL?', 'Concurrent NavigableMap?'],
    misconceptions: ['TreeMap sorts values—it sorts keys'],
    traps: ['Natural order on int[] — arrays not Comparable'],
    strongSignals: ['Uses floorEntry/ceilingKey correctly in interval problem'],
  },
  keyTakeaways: [
    'O(log n) get/put; keys always sorted.',
    'floor/ceiling for predecessor/successor.',
    'Integer.compare in comparators; no null keys.',
    'Sweep line: map coordinate → delta.',
    'Use HashMap when order irrelevant.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'TreeMap vs HashMap time complexity?',
      answerHint: 'TreeMap O(log n); HashMap O(1) average.',
    },
    {
      level: 'intermediate',
      question: 'What does floorEntry(k) return?',
      answerHint: 'Entry with greatest key ≤ k, or null if none.',
    },
    {
      level: 'advanced',
      question: 'Design interval insertion with overlap check using TreeMap.',
      answerHint: 'floorEntry(start) checks prior interval end; check start < prev.end; check next interval start < end.',
    },
  ],
  flashcards: [
    {
      front: 'TreeMap null keys?',
      back: 'Not allowed; NPE on insert.',
    },
    {
      front: 'Safe int comparator',
      back: 'Integer.compare(a, b) — not a - b.',
    },
  ],
  quickRevision: [
    'Red-Black tree, sorted keys',
    'O(log n) all main ops',
    'floor / ceiling navigation',
    'No null keys',
    'Integer.compare in Comparator',
    'Sweep line timeline pattern',
  ],
}
