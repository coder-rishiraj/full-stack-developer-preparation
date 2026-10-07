import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Comparable defines natural ordering via compareTo(T); Comparator defines external ordering via compare(a,b). Both drive Collections.sort, TreeMap/TreeSet, and PriorityQueue ordering in Java DSA.',
  whyExists:
    'Sorting and ordered structures need a total order contract. compareTo/compare must be consistent with equals enough for sorting: transitive, antisymmetric, reflexive on equality branch—wrong order breaks TreeSet and sort correctness.',
  mentalModel:
    'compare(a,b) < 0 means a comes before b. Min-heap PQ uses smallest per compare. TreeSet uses compare == 0 to mean “duplicate.” Natural order = class’s compareTo; custom = lambda at call site.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Step 1 — Why ordering APIs exist. Sorting, TreeMap, TreeSet, and PriorityQueue all need a rule: given two elements, which comes first? That rule returns negative (a before b), zero (tie), or positive (a after b).',
    },
    {
      type: 'paragraph',
      text: 'Step 2 — Two ways to supply the rule. Comparable lives on the class itself (“I know my natural order”). Comparator lives outside (“sort these intervals by end time”) so one type can have many orders without editing the class.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Comparable<T>: int compareTo(T o) — one natural order per class.',
        'Comparator<T>: int compare(T a, T b) — many orders, no class change.',
        'Return negative/zero/positive; never (a-b) on ints—use Integer.compare.',
        'Arrays.sort(arr) for primitives; Collections.sort(list) or list.sort(comparator).',
        'Comparator.comparingInt(f).thenComparingInt(g) for lexicographic sort.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Safe comparators for interviews',
      code: `// Sort intervals by start, then end
intervals.sort(Comparator
    .comparingInt((int[] a) -> a[0])
    .thenComparingInt(a -> a[1]));

// Sort points by x descending, y ascending
points.sort((p, q) -> {
    if (p[0] != q[0]) return Integer.compare(q[0], p[0]);
    return Integer.compare(p[1], q[1]);
});

// PQ: farthest point first (max-heap on distance)
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) ->
    Integer.compare(dist(b), dist(a)));`,
    },
    {
      type: 'table',
      headers: ['API', 'When'],
      rows: [
        ['Comparable', 'Single canonical order (Integer, String)'],
        ['Comparator', 'Custom sort, TreeMap/TreeSet, PQ'],
        ['Integer.compare', 'Always for int keys'],
        ['Long.compare', 'long differences safely'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'TreeSet duplicates',
      text: 'compare(a,b)==0 ⇒ same element in TreeSet. Two distinct objects with compare 0 collapse—ensure tie-breaker field (e.g. index) if both must exist.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Merge intervals: sort by start ascending. Scan: if current.start > prev.end merge fails overlap check; else extend prev.end = max(prev.end, cur.end). Sort correctness depends on compareTo by start.',
    },
  ],
  complexity: {
    notes: 'TimSort: O(n log n) comparisons; each compare O(1) unless expensive key extract.',
  },
  patternRecognition: [
    'Custom sort order in problem statement.',
    'Greedy after sorting by deadline, end, or ratio.',
    'PQ needs inverted order → reverse Comparator.',
    'Lexicographic order on tuples → chaining comparators.',
  ],
  commonMistakes: [
    'a - b overflow in int compare.',
    'compare not antisymmetric → TreeSet corruption.',
    'Sorting wrong key (end vs start) breaking greedy proof.',
    'Forgetting tie-breaker → unstable greedy or lost elements in TreeSet.',
  ],
  tradeoffs: {
    advantages: ['Flexible ordering without subclassing', 'Composable comparators', 'Works across collections'],
    disadvantages: ['Easy to get contract wrong', 'compare==0 duplicate semantics in TreeSet'],
    alternatives: ['Index array sort (sort indices by arr[i])', 'Bucket sort when keys bounded'],
    whenToUse: ['Any sort/PQ/Tree* with non-default order'],
    whenNotToUse: ['Single key integer sort → counting sort maybe'],
  },
  failureModes: [
    'Wrong greedy from wrong sort key.',
    'TreeSet size wrong due to compare returning 0 for unequal objects.',
  ],
  interview: {
    expectations: ['Write Comparator lambda', 'Explain compare contract', 'Integer.compare habit'],
    commonQuestions: ['Sort intervals/meetings', 'Custom object ordering in PQ'],
    followUps: ['Stable sort in Java?', 'compareTo vs equals consistency'],
    misconceptions: ['a - b is fine for all ints'],
    traps: ['TreeSet treats compare 0 as duplicate'],
    strongSignals: ['Uses thenComparing for ties', 'Never subtracts ints for compare'],
  },
  keyTakeaways: [
    'Integer.compare / Long.compare always.',
    'Comparator at PQ/TreeMap construction.',
    'compare==0 ⇒ equal in TreeSet.',
    'Chain comparators for lex order.',
    'Sort key must match greedy proof.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Comparable vs Comparator?',
      answerHint: 'compareTo natural order in class; Comparator external, multiple orders.',
    },
    {
      level: 'intermediate',
      question: 'Why not return a - b for Comparator?',
      answerHint: 'Overflow when difference exceeds int range; use Integer.compare.',
    },
    {
      level: 'advanced',
      question: 'compareTo consistent with equals requirement?',
      answerHint: 'Strong recommendation: equal objects ⇒ compare 0; reverse not required; TreeSet uses compare not equals.',
    },
  ],
  flashcards: [
    {
      front: 'Safe int comparison',
      back: 'Integer.compare(a, b) — not a - b.',
    },
    {
      front: 'TreeSet compare returns 0',
      back: 'Elements treated as duplicates; second add ignored.',
    },
  ],
  quickRevision: [
    'compareTo = natural order',
    'Comparator = custom order',
    'Integer.compare for ints',
    'thenComparing for ties',
    'TreeSet: compare 0 = dup',
    'PQ max-heap: reverse compare',
  ],
}
