import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A monotonic queue (deque) maintains elements in strictly increasing or decreasing order while sliding a window—enabling O(n) sliding window min/max by evicting dominated entries from the rear and expired indices from the front.',
  whyExists:
    'Naive sliding window max scans k elements per step → O(nk). Monotonic deque keeps only useful candidates: smaller/larger elements that could still be the answer before a bigger/smaller newcomer arrives.',
  mentalModel:
    'A line of candidates for "window champion" ranked by value. New arrivals knock out shorter weaker candidates from the back; when the champion’s index leaves the window, the next in line steps up from the front.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Choose decreasing deque for window maximum (increasing for minimum).',
        'For each index i: pollFront while front index < i - k + 1 (out of window).',
        'While rear value dominated by nums[i], pollLast.',
        'offerLast(i); if i >= k-1, answer is nums[peekFirst].',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Stack vs monotonic queue',
      text: 'Monotonic stack solves static "next greater" in one pass. Monotonic queue adds front eviction for moving window—same pop-from-rear logic plus pollFront for expired indices.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  I[i] --> Exp{front index in window?}
  Exp -->|no| PF[pollFront]
  Exp --> Dom{rear dominated?}
  Dom -->|yes| PL[pollLast]
  Dom --> Push[offerLast i]
  Push --> Ans[peekFirst if i>=k-1]`,
    caption: 'Monotonic deque per window step',
  },
  example: [
    {
      type: 'paragraph',
      text: 'nums=[1,3,-1,-3,5,3,6,7], k=3: at i=2 window [1,3,-1], deque indices [1] (value 3). At i=5 window [5,3,6], pop rear while ≤6 → deque [4,5] values [5,6]... actually after i=5: front=4 val 5, add 6 at i=5 → [4,5] max=6.',
    },
    {
      type: 'table',
      headers: ['goal', 'deque order', 'rear pop when'],
      rows: [
        ['window max', 'decreasing values', 'nums[rear] <= nums[i]'],
        ['window min', 'increasing values', 'nums[rear] >= nums[i]'],
        ['front evict', '—', 'index <= i - k'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Sliding window maximum template',
      code: `Deque<Integer> dq = new ArrayDeque<>();
for (int i = 0; i < n; i++) {
    while (!dq.isEmpty() && dq.peekFirst() < i - k + 1) dq.pollFirst();
    while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();
    dq.offerLast(i);
    if (i >= k - 1) ans[i - k + 1] = nums[dq.peekFirst()];
}`,
    },
    {
      language: 'java',
      caption: 'Sliding window minimum',
      code: `while (!dq.isEmpty() && dq.peekFirst() < i - k + 1) dq.pollFirst();
while (!dq.isEmpty() && nums[dq.peekLast()] >= nums[i]) dq.pollLast();
dq.offerLast(i);`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Shortest Subarray with Sum at Least K (hard variant)',
      code: `public int shortestSubarray(int[] nums, int k) {
    int n = nums.length;
    long[] pre = new long[n + 1];
    for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + nums[i];
    Deque<Integer> dq = new ArrayDeque<>();
    int best = n + 1;
    for (int i = 0; i <= n; i++) {
        while (!dq.isEmpty() && pre[i] - pre[dq.peekFirst()] >= k) {
            best = Math.min(best, i - dq.pollFirst());
        }
        while (!dq.isEmpty() && pre[dq.peekLast()] >= pre[i]) dq.pollLast();
        dq.offerLast(i);
    }
    return best <= n ? best : -1;
}`,
    },
  ],
  complexity: {
    best: 'O(n) each index offered/polled once per end',
    average: 'O(n) for fixed window min/max',
    worst: 'O(n) time, O(k) deque size bounded by window',
    space: 'O(k) deque; O(n) for prefix variant',
  },
  patternRecognition: [
    'Sliding window maximum/minimum fixed size k.',
    'Jump game / constrained reach with deque BFS on indices.',
    'Shortest subarray sum ≥ K (prefix + increasing monotonic deque).',
    'Maximum in all subarrays of size k (classic template).',
    '0-1 BFS uses deque but not monotonic—don’t conflate.',
  ],
  commonMistakes: [
    'Wrong comparison (<= vs <) changing tie-breaking for duplicates.',
    'Evicting front with < i-k instead of < i-k+1 (off-by-one window).',
    'Storing values instead of indices—cannot evict by position.',
    'Using monotonic stack instead of deque for sliding window.',
  ],
  tradeoffs: {
    advantages: [
      'O(n) sliding extrema vs O(nk) brute force',
      'Same template for min and max (flip comparison)',
      'Extends to prefix-sum problems',
    ],
    disadvantages: [
      'Two eviction rules (front + rear) easy to forget',
      'Harder than monotonic stack for beginners',
    ],
    alternatives: ['Sparse table O(n log n) preprocess', 'Multiset for window max O(n log k)', 'Heap per window O(n log k)'],
    whenToUse: ['Fixed sliding window min/max', 'Prefix deque for subarray sum bounds'],
    whenNotToUse: ['Static NGE without window → monotonic stack', 'Arbitrary range query offline → segment tree'],
  },
  failureModes: [
    'Duplicate values: wrong strictness drops valid future maxima.',
    'Subarray sum K variant: must use long prefix sums for negative numbers.',
  ],
  interview: {
    expectations: [
      'O(n) amortized argument',
      'Front eviction formula i - k + 1',
      'Store indices not values',
    ],
    commonQuestions: [
      'Sliding Window Maximum',
      'Shortest Subarray with Sum at Least K',
      'Max Value of Equation (heap + deque hybrid)',
    ],
    followUps: ['Why not heap for window max?', 'Extension to variable window?'],
    misconceptions: ['Monotonic queue and monotonic stack are unrelated—they share rear-pop logic'],
    traps: ['Sum at least K needs prefix sums + increasing deque, not sliding max template'],
    strongSignals: ['Explains each index enters deque at most once per end'],
  },
  keyTakeaways: [
    'Window max → decreasing deque of indices.',
    'pollFront when index leaves window; pollLast when dominated.',
    'O(n)—each index in/out at most once per end.',
    'Min variant: flip comparison to >= on rear.',
    'Distinct from monotonic stack: moving window needs front eviction.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Monotonic queue vs stack difference?',
      answerHint: 'Queue evicts expired front indices for sliding window; stack is static one-pass NGE.',
    },
    {
      level: 'intermediate',
      question: 'Sliding window max O(n) proof sketch?',
      answerHint: 'Each index offered once; polled from rear at most once; polled from front at most once.',
    },
    {
      level: 'advanced',
      question: 'Shortest subarray sum ≥ K approach?',
      answerHint: 'Prefix sums; increasing monotonic deque of prefix indices; answer when pre[i]-pre[front]≥k.',
    },
  ],
  flashcards: [
    {
      front: 'Window max deque order',
      back: 'Decreasing values (indices); pop rear while <= current.',
    },
    {
      front: 'Front eviction condition for window size k at index i',
      back: 'pollFirst while peekFirst < i - k + 1.',
    },
  ],
  quickRevision: [
    'Mono queue = mono stack + front eviction',
    'Store indices for window bounds',
    'Max: decreasing deque; min: increasing',
    'O(n) each index once per end',
    'Front: leave window; rear: dominated',
    'Sum≥K: prefix + increasing deque',
    'Not the same as 0-1 BFS deque',
  ],
}
