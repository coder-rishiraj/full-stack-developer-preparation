import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Comparator-based sorting orders objects by custom rules—lexicographic tuples, descending keys, or problem-specific logic like “largest number” string order—using Java’s Comparator or Comparable with O(n log n) sort.',
  whyExists:
    'Real data isn’t always integers. Interviews test whether you can encode the correct ordering (meetings by end, points by x then y, strings by concatenation comparison) without breaking transitivity.',
  mentalModel:
    'Sort playing cards by suit first, then rank—or by a weird rule: “which two-card concatenation is bigger?” The comparator is the referee between two items.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Identify sort keys and priority (primary, secondary tie-break).',
        'Implement compare(a,b): negative if a before b, zero if equal, positive if after.',
        'Use Arrays.sort(arr, comparator) or list.sort(comparator).',
        'For objects, ensure comparator is transitive and consistent with equals policy.',
        'Stable sorts preserve order among equals—tie-break with original index if needed.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Chained comparators',
      text: 'Comparator.comparingInt(Point::x).thenComparingInt(Point::y). Or manual: if x differs return x diff else y diff.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  A[item a] --> Cmp{compare a,b}
  B[item b] --> Cmp
  Cmp --> Neg[a before b]
  Cmp --> Zero[equal keys]
  Cmp --> Pos[a after b]`,
    caption: 'Comparator decision outcomes',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Largest Number: sort strings so s1+s2 > s2+s1 means s1 comes first. [3,30,34] → compare "330" vs "303" → [34,3,30].',
    },
    {
      type: 'table',
      headers: ['problem', 'sort key'],
      rows: [
        ['Merge intervals', 'start ascending'],
        ['Non-overlap max', 'end ascending'],
        ['Largest number', 'concat order descending'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Lambda comparator',
      code: `Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
// descending
Arrays.sort(a, (x, y) -> Integer.compare(y, x));`,
    },
    {
      language: 'java',
      caption: 'Largest number custom order',
      code: `Arrays.sort(strs, (a, b) -> {
    String ab = a + b, ba = b + a;
    return ba.compareTo(ab); // descending concat
});`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Sort by distance to origin',
      code: `Arrays.sort(points, (p, q) -> {
    int d1 = p[0]*p[0] + p[1]*p[1];
    int d2 = q[0]*q[0] + q[1]*q[1];
    if (d1 != d2) return Integer.compare(d1, d2);
    return Integer.compare(p[0], q[0]);
});`,
    },
  ],
  complexity: {
    best: 'O(n log n) comparison sort',
    average: 'O(n log n)',
    worst: 'O(n log n) comparisons; each compare O(k) if key length k',
    space: 'O(log n) sort stack; TimSort may O(n) temp',
  },
  patternRecognition: [
    'Sort objects/intervals/events by non-default key.',
    'Lexicographic order on multiple fields.',
    'Custom string order (largest number, special alphabet).',
    'Need descending or alternating priority.',
    'Rebuild order from sorted indices (sort index array).',
  ],
  commonMistakes: [
    'Non-transitive comparator (especially “largest number” style)—causes wrong sort.',
    'Subtracting ints for compare (overflow: use Integer.compare).',
    'Wrong tie-break loses stability requirement.',
    'Sorting copy vs mutating when original indices needed.',
    'Comparator returns wrong sign (asc vs desc confusion).',
  ],
  variations: [
    'Comparable on class vs external Comparator',
    'Sort indices: Integer[] idx sorted by nums[i]',
    'PriorityQueue with same comparator',
    'Custom char order map for alien dictionary (topological sort, not sort())',
  ],
  tradeoffs: {
    advantages: [
      'Expressive multi-key ordering',
      'Reuses library sort O(n log n)',
      'Clean interview narration',
    ],
    disadvantages: [
      'Bad comparator hard to debug',
      'Compare cost multiplied by n log n',
    ],
    alternatives: ['Bucket sort if keys bounded', 'Manual linear scan if only min/max needed'],
    whenToUse: ['Intervals, events, 2D points', 'Custom string ordering', 'Multi-field ranking'],
    whenNotToUse: ['Order defined by DAG ( alien dictionary ) → topo sort'],
  },
  failureModes: [
    'Integer overflow in (a[0]-b[0]) compare.',
    'Non-transitive compare → Arrays.sort throws or wrong order.',
  ],
  interview: {
    expectations: [
      'Use Integer.compare / Long.compare',
      'State primary and tie-break keys',
      'Verify comparator on small examples including ties',
    ],
    commonQuestions: [
      'Largest Number',
      'Merge Intervals (sort key)',
      'Relative Sort Array',
      'Custom Sort String',
    ],
    followUps: ['Is your comparator transitive?', 'What if need original indices?'],
    misconceptions: ['(a-b) is safe for compare'],
    traps: ['Largest number: leading zeros after sort', 'Events: same time start vs end ordering'],
    strongSignals: ['Uses Integer.compare explicitly', 'Tests tie cases aloud'],
  },
  keyTakeaways: [
    'Never subtract for compare—Integer.compare.',
    'Define primary key then tie-breakers.',
    'Custom string order: compare a+b vs b+a.',
    'Sort indices if need stable original positions.',
    'O(n log n) × cost(compare).',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Comparator contract in Java?',
      answerHint: 'antisymmetric, transitive, consistent; return <0, 0, >0.',
    },
    {
      level: 'intermediate',
      question: 'Sort largest concatenated number?',
      answerHint: 'Sort strings so s1+s2 > s2+s1; join; strip leading zeros edge.',
    },
    {
      level: 'advanced',
      question: 'Sort by key f(x) without computing f twice?',
      answerHint: 'Sort pairs (f(x), x) or cache in wrapper; or sort indices array.',
    },
  ],
  flashcards: [
    { front: 'Safe int compare', back: 'Integer.compare(a, b), not a - b.' },
    { front: 'Largest number sort rule', back: 'Compare a+b vs b+a descending.' },
  ],
  quickRevision: [
    'Integer.compare not subtract',
    'Primary key then tie-break',
    'Arrays.sort(arr, cmp)',
    'Largest # → concat compare',
    'Sort indices for original pos',
    'O(n log n) comparisons',
  ],
}
