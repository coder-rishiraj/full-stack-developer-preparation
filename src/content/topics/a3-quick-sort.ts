import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Quick sort picks a pivot, partitions the array so elements ≤ pivot are left and > pivot are right, then recursively sorts partitions—averaging O(n log n) but O(n²) worst case without careful pivot choice.',
  whyExists:
    'In-place partitioning with excellent cache behavior makes quicksort the default in many libraries (with hybrid fallbacks). Understanding partition is essential for “kth largest,” Dutch flag, and quickselect.',
  mentalModel:
    'Pivot is a fence post: shuffle elements so smaller ones sit left, larger right. Recurse on each side. Bad pivot (always min/max) degenerates to a chain.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Choose pivot: last element, random, or median-of-three.',
        'Partition: two pointers or Lomuto/Hoare scheme rearrange in O(n).',
        'Place pivot at final position p; recursively sort [lo, p-1] and [p+1, hi].',
        'Quickselect: recurse only side containing k—O(n) average for kth element.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Worst case',
      text: 'Sorted input + last-element pivot → O(n²). Random pivot or introsort (depth limit + heap sort) fixes production use.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  P[pick pivot] --> Part[partition O n]
  Part --> L[sort left]
  Part --> R[sort right]
  L --> Done[sorted]
  R --> Done`,
    caption: 'Quicksort partition then recurse',
  },
  example: [
    {
      type: 'paragraph',
      text: '[3,6,8,10,1,2,1] pivot=1 (last): partition → [1,1,2,10,8,6,3] pivot index 1; recurse on subarrays.',
    },
    {
      type: 'table',
      headers: ['variant', 'avg time', 'worst time', 'space'],
      rows: [
        ['quicksort', 'O(n log n)', 'O(n²)', 'O(log n) stack'],
        ['quickselect', 'O(n)', 'O(n²)', 'O(1) iterative possible'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Lomuto partition (last pivot)',
      code: `int partition(int[] a, int lo, int hi) {
    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; j++) {
        if (a[j] <= pivot) {
            int t = a[i]; a[i] = a[j]; a[j] = t;
            i++;
        }
    }
    int t = a[i]; a[i] = a[hi]; a[hi] = t;
    return i;
}
void quickSort(int[] a, int lo, int hi) {
    if (lo >= hi) return;
    int p = partition(a, lo, hi);
    quickSort(a, lo, p - 1);
    quickSort(a, p + 1, hi);
}`,
    },
    {
      language: 'java',
      caption: 'Quickselect kth smallest',
      code: `int quickSelect(int[] a, int lo, int hi, int k) {
    if (lo >= hi) return a[lo];
    int p = partition(a, lo, hi);
    if (k == p) return a[p];
    if (k < p) return quickSelect(a, lo, p - 1, k);
    return quickSelect(a, p + 1, hi, k);
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Kth largest element (quickselect',
      code: `public int findKthLargest(int[] nums, int k) {
    return quickSelect(nums, 0, nums.length - 1, nums.length - k);
}`,
    },
  ],
  complexity: {
    best: 'O(n log n) balanced partitions',
    average: 'O(n log n) sort; O(n) quickselect',
    worst: 'O(n²) bad pivot every time',
    space: 'O(log n) recursion stack average; O(n) worst',
    notes: 'Not stable in typical in-place partition.',
  },
  patternRecognition: [
    'Kth smallest/largest in unsorted array (quickselect or heap).',
    'Partition array by pivot (Dutch national flag = 3-way partition).',
    'Sort colors / segregate odds-evens in one pass.',
    'Compare with merge sort when stability or worst-case guarantee needed.',
  ],
  commonMistakes: [
    'Infinite recursion: not excluding pivot index in recursive calls.',
    'Wrong pivot index returned in Lomuto vs Hoare schemes.',
    'Using <= vs < inconsistently with duplicate-heavy arrays.',
    'Claiming O(n log n) worst case without randomized pivot.',
    'Off-by-one on kth largest (convert to kth smallest index n-k).',
  ],
  variations: [
    'Hoare partition (fewer swaps)',
    '3-way partition (Dutch flag) for many duplicates',
    'Randomized pivot',
    'Iterative quicksort with explicit stack',
  ],
  tradeoffs: {
    advantages: [
      'In-place O(log n) stack average',
      'Quickselect average O(n) for order statistics',
      'Partition primitive for many problems',
    ],
    disadvantages: [
      'O(n²) worst case without randomization',
      'Unstable',
      'Poor performance on adversarial input if deterministic pivot',
    ],
    alternatives: ['Heap: O(n log k) for kth, guaranteed O(n log k)', 'Merge sort: stable worst-case O(n log n)'],
    whenToUse: ['In-place sort interview', 'Kth element average O(n)', 'Partition-by-pivot problems'],
    whenNotToUse: ['Need stable sort', 'Hard real-time worst-case guarantee'],
  },
  failureModes: [
    'Stack overflow on skewed recursion (iterate or limit depth).',
    'Duplicate keys with 2-way partition → equal elements all left; 3-way fixes.',
  ],
  interview: {
    expectations: [
      'Implement Lomuto or Hoare partition',
      'State average vs worst complexity',
      'Mention randomized pivot mitigation',
    ],
    commonQuestions: [
      'Sort an Array (quicksort)',
      'Kth Largest Element',
      'Sort Colors (3-way partition)',
    ],
    followUps: ['Why random pivot?', 'Heap vs quickselect for kth?'],
    misconceptions: ['Quicksort is always faster than merge sort'],
    traps: ['Kth largest: wrong index n-k vs k-1', 'Partition loop j < hi not <='],
    strongSignals: ['Knows 3-way partition for duplicates', 'Derives quickselect average O(n)'],
  },
  keyTakeaways: [
    'Partition around pivot O(n); recurse both sides.',
    'Average O(n log n); worst O(n²) bad pivot.',
    'Quickselect: one-side recurse → avg O(n).',
    'Random pivot for expected performance.',
    'Dutch flag = 3-way partition for duplicates.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does Lomuto partition return?',
      answerHint: 'Final index of pivot where left ≤ pivot and right > pivot.',
    },
    {
      level: 'intermediate',
      question: 'Quickselect average time complexity?',
      answerHint: 'O(n): n + n/2 + n/4 + … geometric series.',
    },
    {
      level: 'advanced',
      question: 'Why 3-way partition for duplicate-heavy arrays?',
      answerHint: 'Avoids O(n²) when all equal with 2-way; pivots into <, =, > regions.',
    },
  ],
  flashcards: [
    { front: 'Quicksort worst case', back: 'O(n²) with bad pivot (e.g., sorted + last pivot).' },
    { front: 'Kth largest index trick', back: 'Find (n - k)th smallest index via quickselect.' },
  ],
  quickRevision: [
    'Pick pivot → partition → recurse',
    'Avg O(n log n), worst O(n²)',
    'Quickselect avg O(n)',
    'Random pivot helps',
    '3-way partition for dupes',
    'Unstable in-place',
  ],
}
