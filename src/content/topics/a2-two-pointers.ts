import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Two pointers maintain two indices into a sequence (array, string, linked list) and move them according to a rule—often toward each other or in the same direction—to avoid nested loops.',
  whyExists:
    'Many problems compare or merge elements from two ends or two sorted streams. Brute force uses O(n²) pairs. Two pointers exploit order, symmetry, or monotonicity to reach O(n) or O(n log n).',
  mentalModel:
    'Imagine two fingers on a sorted line: one at the start, one at the end. If the sum is too small, advance the left finger; if too big, retreat the right. They never cross unnecessarily because each move discards impossible pairs.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Choose pointer placement: opposite ends (converging), same direction (chasing), or two arrays.',
        'Define a move rule: shrink when invalid, expand when valid, or always advance the “weaker” side.',
        'Maintain an invariant (sorted order, sum target, non-decreasing property).',
        'Stop when pointers meet or one exhausts; update answer at each valid state.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Converging vs chasing',
      text: 'Converging (left/right on sorted array) finds pairs with a sum/order constraint. Chasing (slow/fast on same direction) often partitions or removes duplicates in O(n).',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  L[left] --> Check{Predicate?}
  R[right] --> Check
  Check -->|too small| Linc[left++]
  Check -->|too big| Rdec[right--]
  Check -->|valid| Ans[Record / advance both]`,
    caption: 'Classic converging two-pointer on sorted array',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Two Sum II on sorted [1,2,3,4,6], target 7: left=0 (1), right=4 (6). Sum 7 → answer. If target were 5: 1+6=7 too big → right--; 1+4=5 → answer.',
    },
    {
      type: 'table',
      headers: ['left', 'right', 'sum', 'action'],
      rows: [
        ['0', '4', '7', 'found'],
        ['0', '3', '4', 'left++'],
        ['1', '3', '7', 'found'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Converging pointers (sorted pair sum)',
      code: `int left = 0, right = n - 1;
while (left < right) {
    int sum = a[left] + a[right];
    if (sum == target) return new int[]{left, right};
    if (sum < target) left++;
    else right--;
}
return new int[]{-1, -1};`,
    },
    {
      language: 'java',
      caption: 'Same-direction (remove duplicates / partition)',
      code: `int write = 0;
for (int read = 0; read < n; read++) {
    if (read == 0 || a[read] != a[read - 1]) {
        a[write++] = a[read];
    }
}
return write;`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Container With Most Water',
      code: `public int maxArea(int[] h) {
    int l = 0, r = h.length - 1, best = 0;
    while (l < r) {
        best = Math.max(best, Math.min(h[l], h[r]) * (r - l));
        if (h[l] < h[r]) l++;
        else r--;
    }
    return best;
}`,
    },
  ],
  complexity: {
    best: 'O(n) when each pointer moves at most n steps',
    average: 'O(n)',
    worst: 'O(n) for converging/chasing; O(n log n) if sort first',
    space: 'O(1) extra (excluding sort)',
  },
  patternRecognition: [
    'Sorted array + pair/triplet with sum or order constraint.',
    'Palindrome check, reverse, or compare from both ends.',
    'Merge two sorted arrays/lists without extra structure.',
    'In-place removal of duplicates or partition by predicate.',
    'Maximize/minimize a function of two indices with monotonic move rule.',
  ],
  commonMistakes: [
    'Using converging pointers on unsorted data without sorting first (wrong pairs skipped).',
    'Advancing both pointers when only one side should move (loses valid answers).',
    'Off-by-one: loop condition left < right vs left <= right changes pair inclusion.',
    'Confusing two pointers with sliding window (window maintains contiguous segment).',
  ],
  variations: [
    'Three pointers / three sum (fix one, two-pointer on rest)',
    'Two arrays with independent indices (merge intervals, merge lists)',
    'Dutch national flag (three-way partition with low/mid/high)',
    'Trapping rain water (two pointers from ends with prefix max)',
  ],
  tradeoffs: {
    advantages: [
      'Often O(n) after sort or on already sorted input',
      'O(1) space for in-place variants',
      'Clear interview narrative',
    ],
    disadvantages: [
      'Requires monotonicity or sorted order for converging pattern',
      'Not applicable when you need all pairs or arbitrary subsets',
    ],
    alternatives: ['Hash map for unsorted Two Sum', 'Binary search for one fixed element', 'Sliding window for contiguous segments'],
    whenToUse: ['Sorted input', 'Pair from two ends', 'In-place compaction', 'Merge sorted streams'],
    whenNotToUse: ['Need frequency counts across whole array', 'Non-contiguous subsequence without order', 'Dynamic updates to structure'],
  },
  failureModes: [
    'Wrong move rule breaks invariant → missed optimal answer.',
    'Integer overflow on sum products in container/water problems.',
  ],
  interview: {
    expectations: [
      'Identify sorted or sortable structure',
      'State invariant before coding',
      'Handle empty, single element, no solution',
    ],
    commonQuestions: [
      'Two Sum II',
      '3Sum',
      'Container With Most Water',
      'Valid Palindrome',
    ],
    followUps: ['Why move the shorter height in container?', '3Sum duplicate avoidance'],
    misconceptions: ['Two pointers always means left at 0 and right at n-1'],
    traps: ['Forgetting to skip duplicate triplets in 3Sum', 'Moving wrong pointer in water problem'],
    strongSignals: ['Explains why each pointer move is safe (pruning argument)'],
  },
  keyTakeaways: [
    'Sorted + pair constraint → converging pointers.',
    'Each pointer moves O(n) times → O(n) total.',
    'Move the pointer that improves the predicate monotonically.',
    'Distinct from sliding window: not always contiguous maintenance.',
    'Sort first costs O(n log n) but unlocks the pattern.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'When do converging two pointers work on a sorted array?',
      answerHint: 'Monotonic sum/order: moving one pointer only helps or hurts in one direction.',
    },
    {
      level: 'intermediate',
      question: 'Why move the shorter line in Container With Most Water?',
      answerHint: 'Width shrinks; only increasing min height can improve area—advance shorter side.',
    },
    {
      level: 'advanced',
      question: 'How do you extend two pointers to 3Sum without O(n³)?',
      answerHint: 'Sort, fix i, two-pointer on i+1..n-1, skip duplicate i and duplicate pairs.',
    },
  ],
  flashcards: [
    {
      front: 'Two Sum II pointer move when sum < target',
      back: 'left++ (need larger sum).',
    },
    {
      front: 'Typical two-pointer time after sort',
      back: 'O(n log n) sort + O(n) scan = O(n log n).',
    },
  ],
  quickRevision: [
    'Sorted pair sum → left/right converge',
    'Move pointer that monotonically fixes predicate',
    'O(n) pointer moves, O(1) space',
    '3Sum: fix one + two-pointer on rest',
    'Not the same as sliding window',
    'Merge sorted lists = two indices',
    'Palindrome = two ends inward',
  ],
}
