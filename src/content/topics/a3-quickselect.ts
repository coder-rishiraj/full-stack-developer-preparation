import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Quickselect finds the k-th smallest element (or order statistic) in O(n) average time by partitioning like quicksort but recursing only into the half containing the target index—Hoare or Lomuto partition with randomized pivot.',
  whyExists:
    'Full sort is O(n log n) when you only need one order statistic (median, k-th largest). Quickselect averages linear time with in-place partitioning; heap-based selection is O(n log k) alternative.',
  mentalModel:
    'Quicksort that stops early: partition around pivot; if pivot index equals k you are done; otherwise recurse left or right only—like binary search on partition rank.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Pick pivot (randomized to avoid O(n²) on sorted input).',
        'Partition: elements ≤ pivot left, > pivot right (Lomuto) or two-pointer swap (Hoare).',
        'Let p = final pivot index; if p == k return a[p]; if k < p recurse left; else recurse right.',
        'k-th largest: target index n - k in ascending order.',
        'Median: quickselect at index n/2.',
        'Average O(n): n + n/2 + n/4 + ... = O(n); worst O(n²) bad pivots.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Lomuto vs Hoare',
      text: 'Lomuto simpler but does extra swaps; Hoare fewer swaps, pivot not at final index—adjust k comparison accordingly. Interviews often accept Lomuto.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Array [3,2,1,5,6,4], k=2 (3rd smallest): partition pivot 4 → [3,2,1,4,6,5], p=3; k<p recurse left on [3,2,1]; pivot 2 → [1,2,3], p=1; k>p recurse right; pivot 3 at p=2 = k, answer 3.',
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Quickselect k-th smallest (0-indexed) with Lomuto',
      code: `int quickselect(int[] a, int k) {
    return select(a, 0, a.length - 1, k);
}
int select(int[] a, int lo, int hi, int k) {
    if (lo == hi) return a[lo];
    int p = partition(a, lo, hi);
    if (k == p) return a[p];
    if (k < p) return select(a, lo, p - 1, k);
    return select(a, p + 1, hi, k);
}
int partition(int[] a, int lo, int hi) {
    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; j++)
        if (a[j] <= pivot) { int t = a[i]; a[i] = a[j]; a[j] = t; i++; }
    int t = a[i]; a[i] = a[hi]; a[hi] = t;
    return i;
}`,
    },
    {
      language: 'java',
      caption: 'Randomized pivot + k-th largest',
      code: `int kthLargest(int[] a, int k) {
    Random rnd = new Random();
    return select(a, 0, a.length - 1, a.length - k, rnd);
}
int select(int[] a, int lo, int hi, int k, Random rnd) {
    if (lo >= hi) return a[lo];
    int pIdx = lo + rnd.nextInt(hi - lo + 1);
    swap(a, pIdx, hi);
    int p = partition(a, lo, hi);
    if (p == k) return a[p];
    return p < k ? select(a, p + 1, hi, k, rnd) : select(a, lo, p - 1, k, rnd);
}`,
    },
  ],
  complexity: {
    best: 'O(n) single lucky partition',
    average: 'O(n) with randomized pivot',
    worst: 'O(n²) sorted array + always first/last pivot',
    space: 'O(1) iterative; O(log n) recursion stack average',
  },
  patternRecognition: [
    'Kth Largest Element in Array.',
    'Find Median from Data Stream (heap variant, not quickselect).',
    'Top K frequent (heap or quickselect on frequencies).',
    'Partition-based problems (Wiggle Sort, Sort Colors partial).',
  ],
  commonMistakes: [
    'Off-by-one: k-th smallest 1-indexed vs 0-indexed.',
    'No randomization → TLE on sorted input.',
    'Hoare partition but compare k to wrong pivot index.',
    'Modifying array when copy required.',
  ],
  tradeoffs: {
    advantages: [
      'O(n) average in-place',
      'Simple partition reuse from quicksort',
      'No extra heap space',
    ],
    disadvantages: [
      'O(n²) worst case without random pivot',
      'Not stable; mutates array',
      'Worst case pathological without introselect',
    ],
    alternatives: ['Min-heap of size k: O(n log k)', 'PriorityQueue for streaming median', 'Introselect guaranteed O(n) worst'],
    whenToUse: ['Single order statistic on array', 'In-place acceptable', 'Average-case linear OK'],
    whenNotToUse: ['Need stable selection', 'Streaming data', 'Guaranteed worst-case O(n) without introselect'],
  },
  failureModes: [
    'Infinite recursion if partition returns wrong bounds.',
    'k out of range [0, n-1].',
    'Duplicate-heavy arrays: Lomuto still works but many equal swaps.',
  ],
  interview: {
    expectations: [
      'Partition like quicksort, recurse one side',
      'O(n) average, O(n²) worst',
      'Randomized pivot for expected linear',
    ],
    commonQuestions: ['Kth Largest Element', 'Wiggle Sort pivot ideas', 'Median of unsorted array'],
    followUps: ['Heap alternative O(n log k)?', 'Worst-case guarantee?', 'K-th largest index?'],
    misconceptions: ['Must sort entire array', 'Always O(n log n)', 'Same as binary search on sorted array'],
    traps: ['k-th largest = index n-k not k', 'Forgetting random pivot'],
    strongSignals: ['Derives average O(n) geometric series', 'Knows Lomuto partition cold', 'Contrasts with min-heap of size k'],
  },
  keyTakeaways: [
    'Partition + recurse into one half only.',
    'O(n) average; randomize pivot against O(n²).',
    'k-th largest → index n - k (0-indexed ascending).',
    'Lomuto: pivot at hi, i/j scan, swap ≤ pivot left.',
    'Heap alternative O(n log k) for small k or streaming.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Quickselect average time?', answerHint: 'O(n)—each level processes shrinking partition; n + n/2 + n/4 + ...' },
    { level: 'intermediate', question: 'Difference from quicksort?', answerHint: 'Only recurse into partition containing k; stop when pivot index equals k.' },
    { level: 'advanced', question: 'Guaranteed O(n) worst case?', answerHint: 'Introselect: fall back to median-of-medians if recursion depth too deep.' },
  ],
  flashcards: [
    { front: 'Quickselect average time', back: 'O(n) with randomized pivot.' },
    { front: 'k-th largest index', back: 'n - k in 0-indexed ascending order (or n - k + 1 if 1-indexed).' },
    { front: 'Worst case', back: 'O(n²) without randomization on sorted input.' },
  ],
  quickRevision: [
    'Quicksort one-sided recursion',
    'Lomuto partition template',
    'Random pivot → O(n) avg',
    'k-th largest: index n-k',
    'O(n²) worst sorted input',
    'Heap alt O(n log k)',
    'Mutates array in-place',
  ],
}
