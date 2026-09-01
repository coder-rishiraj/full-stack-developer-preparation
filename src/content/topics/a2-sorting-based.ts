import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Sorting-based problems sort input (or keys) to expose order, enabling greedy choices, two-pointer scans, binary search on neighbors, or linear merges—often turning O(n²) brute force into O(n log n).',
  whyExists:
    'Order unlocks optimal substructure: intervals nest cleanly, duplicates cluster, smallest/largest pairs become adjacent. Many interview problems are “sort then scan” in disguise.',
  mentalModel:
    'Shuffle cards into rank order, then one finger sweep catches conflicts, gaps, or triplets. Sorting is preprocessing that buys a linear second phase.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Identify what to sort: whole array, intervals by start, pairs by first key, strings lexicographically.',
        'Sort with appropriate comparator (see comparator sorting topic).',
        'Linear scan: merge adjacent, detect duplicates, two-pointer on sorted array.',
        'Restore indices if problem requires original positions (index array or pair sorting).',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Sort + scan template',
      text: 'After sort, each element only needs to compare with neighbors—duplicate triplets, merge intervals, minimum arrows—all O(n) post-sort.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  In[unsorted input] --> Sort[O n log n sort]
  Sort --> Scan[O n linear scan]
  Scan --> Out[answer]`,
    caption: 'Classic sort-then-scan pipeline',
  },
  example: [
    {
      type: 'paragraph',
      text: '3Sum: sort nums; for each i, two-pointer on i+1..n-1 for sum 0; skip duplicate i and duplicate pairs. O(n²) after O(n log n) sort.',
    },
    {
      type: 'table',
      headers: ['phase', 'time', 'note'],
      rows: [
        ['sort', 'O(n log n)', 'enables two-pointer'],
        ['fix i + scan', 'O(n²)', 'skip duplicates'],
        ['total', 'O(n²)', 'optimal for general 3Sum'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Sort then adjacent scan',
      code: `Arrays.sort(nums);
for (int i = 1; i < nums.length; i++) {
    if (nums[i] == nums[i - 1]) { /* handle duplicate */ }
}
// or two-pointer after sort`,
    },
    {
      language: 'java',
      caption: 'Sort pairs preserving tie-break',
      code: `Integer[] idx = new Integer[n];
for (int i = 0; i < n; i++) idx[i] = i;
Arrays.sort(idx, (i, j) -> {
    if (nums[i] != nums[j]) return Integer.compare(nums[i], nums[j]);
    return Integer.compare(i, j);
});`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Merge intervals (sort by start',
      code: `public int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> res = new ArrayList<>();
    for (int[] iv : intervals) {
        if (res.isEmpty() || res.get(res.size()-1)[1] < iv[0]) {
            res.add(iv);
        } else {
            res.get(res.size()-1)[1] = Math.max(res.get(res.size()-1)[1], iv[1]);
        }
    }
    return res.toArray(new int[0][]);
}`,
    },
  ],
  complexity: {
    best: 'O(n log n) dominated by sort',
    average: 'O(n log n)',
    worst: 'O(n log n + n) = O(n log n)',
    space: 'O(1) to O(n) depending on sort stability and output',
  },
  patternRecognition: [
    'Need smallest/largest pair or triplet with sum/difference constraint.',
    'Intervals, meetings, or ranges that overlap when ordered by start.',
    'Duplicates matter after sort (skip equal neighbors).',
    'Scheduling: sort by end time or deadline greedy.',
    'Reconstruct sequence from pairs when order unknown until sorted.',
  ],
  commonMistakes: [
    'Sorting wrong key (end vs start for intervals).',
    'Forgetting duplicate skip after sort in k-sum problems.',
    'Mutating original indices when answer needs pre-sort positions.',
    'Assuming O(n) possible when problem requires order (must pay log n).',
    'Integer overflow in comparators or sum checks after sort.',
  ],
  variations: [
    'Custom comparator sort (events, 2D points)',
    'Sort + binary search on sorted array',
    'Count inversions via merge sort',
    'Bucket sort when range is small O(n)',
  ],
  tradeoffs: {
    advantages: [
      'Simple two-phase structure for interviews',
      'Enables two-pointer and greedy proofs',
      'Handles duplicates systematically',
    ],
    disadvantages: [
      'O(n log n) lower bound for comparison sort',
      'Destroys original order unless index tracked',
    ],
    alternatives: ['Hash map for unsorted pair sum O(n)', 'Counting sort for bounded range', 'Heap for streaming top-k'],
    whenToUse: ['Intervals', 'k-sum with k≥3', 'Duplicate detection', 'Greedy by deadline'],
    whenNotToUse: ['Online stream needing dynamic order', 'Already sorted input (don’t re-sort)'],
  },
  failureModes: [
    'Unstable sort loses equal-element order when stability required.',
    'Comparator not transitive → SortException or wrong order.',
  ],
  interview: {
    expectations: [
      'Justify sort key and comparator',
      'Analyze O(n log n) + scan complexity',
      'Handle duplicates explicitly after sort',
    ],
    commonQuestions: [
      'Merge Intervals',
      '3Sum',
      'Non-overlapping Intervals',
      'Largest Number (custom sort)',
    ],
    followUps: ['Can you avoid full sort?', 'What if intervals arrive online?'],
    misconceptions: ['Sorting always gives O(n) total'],
    traps: ['Meeting rooms: sort by start not end for room count', '3Sum: not skipping duplicate i'],
    strongSignals: ['States sort key before coding', 'Explains why scan is linear after sort'],
  },
  keyTakeaways: [
    'Sort is preprocessing; scan is often O(n).',
    'Pick sort key to match greedy invariant.',
    'Skip duplicates on sorted arrays for k-sum.',
    'Track original index when output needs it.',
    'Total time usually O(n log n).',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why sort before merging intervals?',
      answerHint: 'Sorted by start, overlap only with last merged; linear merge.',
    },
    {
      level: 'intermediate',
      question: 'How does sorting enable 3Sum in O(n²)?',
      answerHint: 'Fix i, two-pointer on sorted rest; move pointers by sum vs 0; skip dupes.',
    },
    {
      level: 'advanced',
      question: 'When can you beat O(n log n) with sorting-based approach?',
      answerHint: 'Bounded integer range → counting/radix sort O(n); or hash-based methods for specific problems.',
    },
  ],
  flashcards: [
    { front: 'Sort-then-scan total time', back: 'O(n log n) sort + O(n) scan.' },
    { front: 'Interval merge sort key', back: 'Sort by start time ascending.' },
  ],
  quickRevision: [
    'Sort then linear scan',
    'Intervals → sort by start',
    'k-sum → sort + two pointers',
    'Skip duplicate neighbors',
    'Track index if needed',
    'O(n log n) baseline',
  ],
}
