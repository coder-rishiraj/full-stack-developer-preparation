import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Merge sort divides an array into halves recursively, sorts each half, and merges two sorted halves in O(n) per level—guaranteeing O(n log n) worst-case time and stable ordering.',
  whyExists:
    'Unlike quicksort, merge sort’s worst case matches average case—important for predictable performance, external sorting, and inversion counting. The merge step is the reusable skill for “merge two sorted lists.”',
  mentalModel:
    'Split a deck in half until piles of one card, then merge piles pairwise always picking the smaller front card—like merging two sorted lines at a ticket counter.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Base case: subarray length ≤ 1 is sorted.',
        'Divide: mid = (lo+hi)/2; sort left and right recursively.',
        'Merge: two pointers i, j on left/right copy; write smaller to temp; copy back.',
        'Tree depth log n; each level processes all n elements → O(n log n).',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Stable merge',
      text: 'On equal keys, take from left half first—stability preserved. Useful when sorting by multiple keys sequentially.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  A[array] --> D[divide mid]
  D --> L[left sort]
  D --> R[right sort]
  L --> M[merge L+R]
  R --> M
  M --> S[sorted segment]`,
    caption: 'Merge sort divide and conquer',
  },
  example: [
    {
      type: 'paragraph',
      text: '[38,27,43,3] → [38|27] [43|3] → [27,38] [3,43] → merge → [3,27,38,43].',
    },
    {
      type: 'table',
      headers: ['level', 'work', 'total per level'],
      rows: [
        ['log n depth', 'merge size n', 'O(n)'],
        ['product', 'log n levels', 'O(n log n)'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Top-down merge sort',
      code: `void mergeSort(int[] a, int lo, int hi, int[] tmp) {
    if (lo >= hi) return;
    int mid = lo + (hi - lo) / 2;
    mergeSort(a, lo, mid, tmp);
    mergeSort(a, mid + 1, hi, tmp);
    merge(a, lo, mid, hi, tmp);
}
void merge(int[] a, int lo, int mid, int hi, int[] tmp) {
    int i = lo, j = mid + 1, k = lo;
    while (i <= mid && j <= hi)
        tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];
    while (i <= mid) tmp[k++] = a[i++];
    while (j <= hi) tmp[k++] = a[j++];
    for (int p = lo; p <= hi; p++) a[p] = tmp[p];
}`,
    },
    {
      language: 'java',
      caption: 'Merge two sorted subarrays (in-place helper',
      code: `// Same merge loop; used in merge intervals, merge lists logic`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Count inversions (merge sort variant',
      code: `long inv = 0;
// during merge, if take from right when a[i] > a[j], inv += (mid - i + 1)`,
    },
  ],
  complexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n) auxiliary for temp array; O(log n) recursion stack',
    notes: 'Stable if merge takes left on ties. Not in-place for array version.',
  },
  patternRecognition: [
    'Need guaranteed O(n log n) worst case.',
    'Count inversions or reverse pairs.',
    'External sort / linked list sort (O(1) extra space on list).',
    'Merge step appears in combine phase of divide-and-conquer.',
    'Stable sort requirement on equal elements.',
  ],
  commonMistakes: [
    'Forgetting to copy temp back to original array.',
    'Off-by-one on mid boundaries (left lo..mid, right mid+1..hi).',
    'Using extra space O(n) but claiming O(1) space.',
    'Unstable merge: always take right on equal keys.',
    'Integer overflow in mid = (lo+hi)/2 without lo+(hi-lo)/2.',
  ],
  variations: [
    'Bottom-up iterative merge sort (no recursion)',
    'Merge sort on linked lists (slow/fast split)',
    'In-place merge rare; practical uses O(n) buffer',
    'Multi-way merge with heap (k sorted lists)',
  ],
  tradeoffs: {
    advantages: [
      'Stable, predictable O(n log n) worst case',
      'Great for linked lists and external memory',
      'Merge primitive reusable in interviews',
    ],
    disadvantages: [
      'O(n) extra space for arrays',
      'Not cache-friendly vs quicksort in practice',
    ],
    alternatives: ['Quicksort: faster average, bad worst', 'Heap sort: O(1) space, not stable', 'Arrays.sort (Timsort) in production'],
    whenToUse: ['Inversion count', 'Stable sort needed', 'Linked list sort'],
    whenNotToUse: ['Memory extremely tight on arrays (use heap sort)', 'Small n where insertion sort wins'],
  },
  failureModes: [
    'Deep recursion stack overflow on very large n (use iterative).',
    'Incorrect inversion count when duplicates present (adjust condition).',
  ],
  interview: {
    expectations: [
      'Recite recurrence T(n)=2T(n/2)+O(n)',
      'Implement merge of two sorted halves',
      'State stability and space',
    ],
    commonQuestions: [
      'Implement merge sort',
      'Count of inversions',
      'Sort linked list',
      'Merge k sorted lists (uses merge pattern)',
    ],
    followUps: ['Can you do O(1) space on linked list?', 'Bottom-up vs top-down?'],
    misconceptions: ['Merge sort is in-place for arrays'],
    traps: ['Inversion: use > not >= when counting', 'Linked list: merge without random access'],
    strongSignals: ['Explains log n levels × O(n) merge', 'Writes stable merge tie-break'],
  },
  keyTakeaways: [
    'Divide halves; merge in O(n); depth log n.',
    'Worst-case O(n log n), stable with ≤ tie-break.',
    'O(n) auxiliary space on arrays.',
    'Merge loop = two pointers—core interview skill.',
    'Inversion count during merge when left > right.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Merge sort time and space complexity?',
      answerHint: 'Time O(n log n) all cases; space O(n) temp + O(log n) stack.',
    },
    {
      level: 'intermediate',
      question: 'Why is merge sort stable?',
      answerHint: 'Equal elements taken from left subarray first during merge.',
    },
    {
      level: 'advanced',
      question: 'Count inversions during merge—what adds to count?',
      answerHint: 'When picking from right and a[i] > a[j], add (mid - i + 1) remaining left elements.',
    },
  ],
  flashcards: [
    { front: 'Merge sort recurrence', back: 'T(n)=2T(n/2)+O(n) → O(n log n).' },
    { front: 'Merge sort stability', back: 'Stable if left wins on equal keys.' },
  ],
  quickRevision: [
    'Split → sort halves → merge',
    'O(n log n) always, stable',
    'O(n) extra array',
    'Merge = two pointers',
    'Inversions on left>right pick',
    'Linked list: O(1) space possible',
  ],
}
