import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Lower and upper bounds are binary-search variants on a sorted array: lower bound finds the first index where a[i] ≥ target; upper bound finds the first where a[i] > target—defining equal-range and insert position.',
  whyExists:
    'Standard binary search finds any match in O(log n). Bounds locate boundaries of equal elements—needed for frequency, insertion index, and “first/last occurrence” without linear scan.',
  mentalModel:
    'Sorted bookshelf: lower bound = first book with title ≥ X; upper bound = first book with title > X. Equal elements sit in [lower, upper).',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Maintain half-open search space [lo, hi) or inclusive [lo, hi]—pick one style and stay consistent.',
        'Mid comparison decides which half still satisfies the bound predicate.',
        'Lower bound: if a[mid] < target, lo = mid+1; else hi = mid (answer in left half).',
        'Upper bound: if a[mid] <= target, lo = mid+1; else hi = mid.',
        'Result index may equal n (insert at end) if target greater than all elements.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Java APIs',
      text: 'Arrays.binarySearch returns insertion point via -(idx+1) on miss. Collections: floor/ceiling in TreeSet. Implement bounds manually in interviews for clarity.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  LB[lower bound] --> First[first i: a i >= target]
  UB[upper bound] --> FirstGT[first i: a i > target]
  First --> Range[count = UB - LB]`,
    caption: 'Equal-range from two bounds',
  },
  example: [
    {
      type: 'paragraph',
      text: 'a = [1,2,2,2,3], target 2: lower=1, upper=4, count=3. target 5: lower=upper=5 (insert index).',
    },
    {
      type: 'table',
      headers: ['target', 'lower', 'upper', 'count'],
      rows: [
        ['2', '1', '4', '3'],
        ['0', '0', '0', '0'],
        ['5', '5', '5', '0'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Lower bound (first >= target)',
      code: `int lowerBound(int[] a, int target) {
    int lo = 0, hi = a.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
    },
    {
      language: 'java',
      caption: 'Upper bound (first > target)',
      code: `int upperBound(int[] a, int target) {
    int lo = 0, hi = a.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] <= target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'First and last position of target',
      code: `public int[] searchRange(int[] nums, int target) {
    int lo = lowerBound(nums, target);
    if (lo == nums.length || nums[lo] != target) return new int[]{-1, -1};
    return new int[]{lo, upperBound(nums, target) - 1};
}`,
    },
  ],
  complexity: {
    best: 'O(log n)',
    average: 'O(log n)',
    worst: 'O(log n)',
    space: 'O(1)',
  },
  patternRecognition: [
    'Sorted array + first/last occurrence.',
    'Count of target = upper − lower.',
    'Search insert position (LeetCode 35).',
    'Find smallest element ≥ x or largest ≤ x.',
    'Binary search on answer with monotonic predicate (related pattern).',
  ],
  commonMistakes: [
    'Infinite loop: not moving lo or hi (use lo < hi with hi = mid).',
    'Off-by-one between inclusive and half-open conventions.',
    'Forgetting to verify nums[lo] == target after lower bound.',
    'Using mid = (lo+hi)/2 without guarding overflow (use lo+(hi-lo)/2).',
    'Assuming array has no duplicates when returning any index suffices.',
  ],
  variations: [
    'Search in rotated sorted array (modified predicate)',
    'Lower bound on answer space (min feasible value)',
    'bisect_left / bisect_right naming (Python style)',
    'Bounds on TreeMap: floorKey, ceilingKey',
  ],
  tradeoffs: {
    advantages: [
      'O(log n) on sorted data',
      'Unified template for insert and range queries',
      'No extra space',
    ],
    disadvantages: [
      'Requires sorted order or monotonic predicate',
      'Duplicate-heavy arrays need two searches for range',
    ],
    alternatives: ['Linear scan O(n) if tiny n', 'Hash map for unsorted frequency'],
    whenToUse: ['Sorted array queries', 'Insert position', 'First/last index'],
    whenNotToUse: ['Unsorted data without preprocessing'],
  },
  failureModes: [
    'Wrong predicate → wrong half discarded.',
    'Empty array: return 0 for insert position correctly.',
  ],
  interview: {
    expectations: [
      'Write lower or upper bound from scratch',
      'Explain half-open [lo, hi) invariant',
      'Handle not-found and insert position',
    ],
    commonQuestions: [
      'Search Insert Position',
      'Find First and Last Position of Element',
      'Search in Rotated Sorted Array',
    ],
    followUps: ['How to count occurrences in O(log n)?', 'Difference vs standard binary search?'],
    misconceptions: ['binarySearch always returns leftmost match in Java (it doesn’t guarantee)'],
    traps: ['Rotated array: wrong pivot side', 'Last position: use upper−1 not separate ad-hoc loop'],
    strongSignals: ['Derives count as upper−lower', 'Consistent loop invariant narration'],
  },
  keyTakeaways: [
    'Lower: first index with a[i] ≥ target.',
    'Upper: first index with a[i] > target.',
    'Count = upper − lower; last = upper − 1.',
    'Half-open [lo, hi) avoids infinite loops.',
    'Verify element exists after lower bound.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Difference between lower and upper bound?',
      answerHint: 'Lower first ≥ target; upper first > target; equal range is [lower, upper).',
    },
    {
      level: 'intermediate',
      question: 'Find last occurrence of target in O(log n)?',
      answerHint: 'upperBound(target) - 1 if in range and equals target.',
    },
    {
      level: 'advanced',
      question: 'Why hi = mid not hi = mid - 1 in lower bound?',
      answerHint: 'Half-open interval; mid may be answer; shrinking hi to mid preserves candidate.',
    },
  ],
  flashcards: [
    { front: 'Count of target in sorted array', back: 'upperBound(t) - lowerBound(t).' },
    { front: 'Lower bound loop condition', back: 'while (lo < hi), hi = mid when a[mid] >= target side.' },
  ],
  quickRevision: [
    'Sorted → bounds O(log n)',
    'Lower: first >= target',
    'Upper: first > target',
    'Insert pos = lower bound',
    'Last idx = upper - 1',
    'Half-open [lo, hi) template',
  ],
}
