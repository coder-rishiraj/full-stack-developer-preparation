import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Binary search repeatedly halves a sorted search space by comparing the middle element to the target, achieving O(log n) lookup on sorted arrays or monotonic predicate spaces.',
  whyExists:
    'Linear scan is O(n). Sorted data (or a yes/no predicate that flips once) allows eliminating half the candidates each step—fundamental for search, bounds, and optimization on answer.',
  mentalModel:
    'Guess the middle of a phone book: if the name you want is earlier, discard the second half. Each guess cuts the remaining pages in half until one page remains.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Maintain search interval [lo, hi] (inclusive or half-open—pick one and stay consistent).',
        'Compute mid = lo + (hi - lo) / 2 to avoid overflow.',
        'Compare a[mid] to target or evaluate predicate(mid).',
        'Shrink lo or hi; stop when lo > hi or when lo == hi for lower bound variants.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Lower vs upper bound',
      text: 'lower_bound: first index where a[i] >= x. upper_bound: first where a[i] > x. Use bisect templates with hi = n (exclusive) to avoid off-by-one.',
    },
  ],
  architecture: {
    mermaid: `flowchart TD
  Start[lo, hi] --> Mid[mid]
  Mid --> Cmp{a mid vs target}
  Cmp -->|too small| Lo[lo = mid + 1]
  Cmp -->|too big| Hi[hi = mid - 1]
  Cmp -->|found| Done[Return mid]
  Lo --> Check{lo <= hi?}
  Hi --> Check
  Check -->|yes| Mid
  Check -->|no| Fail[Not found / bound]`,
    caption: 'Classic inclusive binary search',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Find 7 in [1,3,5,7,9,11]: lo=0 hi=5 mid=2 (5)<7 → lo=3; mid=4 (9)>7 → hi=3; mid=3 (7) found.',
    },
    {
      type: 'table',
      headers: ['lo', 'hi', 'mid', 'a[mid]', 'action'],
      rows: [
        ['0', '5', '2', '5', 'lo=3'],
        ['3', '5', '4', '9', 'hi=3'],
        ['3', '3', '3', '7', 'found'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Classic search (inclusive bounds)',
      code: `int lo = 0, hi = n - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] == target) return mid;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid - 1;
}
return -1;`,
    },
    {
      language: 'java',
      caption: 'Lower bound (first >= target)',
      code: `int lo = 0, hi = n; // half-open [0, n)
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid;
}
return lo; // insertion point`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Search in rotated sorted array',
      code: `public int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) {
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}`,
    },
  ],
  complexity: {
    best: 'O(1) if middle hit immediately',
    average: 'O(log n)',
    worst: 'O(log n) comparisons',
    space: 'O(1) iterative; O(log n) recursive call stack',
  },
  patternRecognition: [
    'Sorted array or “first true in monotonic false…true” predicate.',
    'Find boundary: first/last occurrence, insertion position.',
    'Peak finding, rotated array, matrix search (2D BS).',
    'Minimize/maximize with monotonic feasibility (see BS on answer).',
  ],
  commonMistakes: [
    'Infinite loop: hi = mid instead of mid−1 in inclusive form when a[mid] < target.',
    'Overflow: (lo+hi)/2 → use lo + (hi-lo)/2.',
    'Mixing inclusive [lo,hi] with half-open [lo,hi) termination conditions.',
    'Applying BS without proving monotonicity of predicate.',
  ],
  variations: [
    'Binary search on answer (parametric search)',
    'Ternary search on unimodal functions',
    'Fractional cascading / offline queries',
    'BS on implicit graph (minimum maximum edge on path)',
  ],
  tradeoffs: {
    advantages: [
      'O(log n) on large sorted spaces',
      'Simple loop, no extra structure',
      'Extends to predicates beyond arrays',
    ],
    disadvantages: [
      'Requires sorted order or monotonic predicate proof',
      'Not for dynamic unsorted inserts without sorting cost',
    ],
    alternatives: ['Hash map O(1) exact key lookup', 'Interpolation search for uniform data', 'Exponential search then BS on unbounded'],
    whenToUse: ['Sorted lookup', 'Boundary search', 'Monotonic decision problem'],
    whenNotToUse: ['Unsorted with no predicate', 'Need all neighbors / graph traversal'],
  },
  failureModes: [
    'Off-by-one returns wrong bound (duplicate handling).',
    'Predicate not monotonic → wrong half discarded.',
  ],
  interview: {
    expectations: [
      'Write loop with correct bounds',
      'Derive lower bound variant',
      'Prove O(log n) and monotonicity',
    ],
    commonQuestions: [
      'Binary Search',
      'Search Insert Position',
      'Find Minimum in Rotated Sorted Array',
      'Search a 2D Matrix',
    ],
    followUps: ['Duplicates: first and last position', 'Why lo + (hi-lo)/2?'],
    misconceptions: ['Binary search only works on arrays'],
    traps: ['Rotated array: wrong half chosen', '2D matrix treated as unsorted'],
    strongSignals: ['Uses half-open template consistently', 'States invariant on search interval'],
  },
  keyTakeaways: [
    'Halve search space each step → O(log n).',
    'Pick inclusive or half-open; never mix.',
    'mid = lo + (hi − lo) / 2 prevents overflow.',
    'Lower bound = first index with a[i] ≥ target.',
    'Monotonic predicate enables BS beyond sorted arrays.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Binary search loop invariant on [lo, hi]?',
      answerHint: 'Target always in interval until empty; shrink by comparison at mid.',
    },
    {
      level: 'intermediate',
      question: 'Find first and last position of target in sorted array with duplicates?',
      answerHint: 'Two lower bounds: first >= target; first > target; last = second−1.',
    },
    {
      level: 'advanced',
      question: 'Search 2D matrix where each row sorted and first of row > last of previous?',
      answerHint: 'Treat as 1D sorted of size m*n; index i → row i/m, col i%m.',
    },
  ],
  flashcards: [
    {
      front: 'Half-open lower bound termination',
      back: 'while (lo < hi); hi = mid when a[mid] >= target.',
    },
    {
      front: 'Binary search time/space',
      back: 'O(log n) time, O(1) space iterative.',
    },
  ],
  quickRevision: [
    'Sorted or monotonic predicate → BS',
    'lo + (hi−lo)/2 for mid',
    'Inclusive: lo<=hi; half-open: lo<hi',
    'Lower bound = first >= x',
    'O(log n) comparisons',
    'Prove predicate monotonic before coding',
    'Rotated array: identify sorted half',
  ],
}
