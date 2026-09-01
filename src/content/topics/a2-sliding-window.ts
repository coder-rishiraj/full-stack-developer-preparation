import type { TopicContent } from '@/domain/types'

export const slidingWindowContent: TopicContent = {
  whatIsIt:
    'A sliding window maintains a contiguous subarray or substring [left, right] that expands and shrinks as you scan the input, so each element enters and leaves the window at most a constant number of times.',
  whyExists:
    'Many problems ask for the best contiguous segment under a constraint (sum, distinct count, character budget). Brute force checks O(n²) subarrays. A window reuses work from neighboring subarrays and often reaches O(n).',
  mentalModel:
    'Think of two pointers on a rope: the right hand explores new territory; the left hand discards the oldest elements when the window becomes invalid. The invariant is always “the current window is the candidate set we care about.”',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Initialize left = 0 and an empty window state (sum, counts, deque, …).',
        'Advance right from 0..n-1, adding a[right] into the window state.',
        'While the window violates the constraint, remove a[left] and increment left.',
        'Update the answer from the valid window (length, sum, max, …).',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Fixed vs variable',
      text: 'Fixed-size windows move left in lockstep with right (or use a deque). Variable-size windows grow with right and shrink with left based on a predicate.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  subgraph window [Current Window]
    L[left]
    M[elements]
    R[right]
  end
  In[a right] --> Add[Add to state]
  Add --> Check{Valid?}
  Check -->|no| Shrink[Remove a left / left++]
  Shrink --> Check
  Check -->|yes| Ans[Update answer]
  Ans --> Next[right++]`,
    caption: 'Variable sliding window control flow',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Longest substring without repeating characters on "abcabcbb": expand until duplicate, shrink past the previous occurrence, track max length 3 ("abc").',
    },
    {
      type: 'table',
      headers: ['right', 'char', 'window', 'action'],
      rows: [
        ['0', 'a', 'a', 'expand'],
        ['1', 'b', 'ab', 'expand'],
        ['2', 'c', 'abc', 'expand, ans=3'],
        ['3', 'a', 'bca', 'shrink past first a'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Variable window template (Java)',
      code: `int left = 0;
int best = 0;
// Map/count/sum as needed
for (int right = 0; right < n; right++) {
    // add a[right] into window state
    while (/* window invalid */) {
        // remove a[left] from window state
        left++;
    }
    best = Math.max(best, right - left + 1);
}
return best;`,
    },
    {
      language: 'java',
      caption: 'Fixed window + monotonic deque (max)',
      code: `Deque<Integer> dq = new ArrayDeque<>(); // indices, decreasing values
int[] ans = new int[n - k + 1];
for (int i = 0; i < n; i++) {
    while (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();
    while (!dq.isEmpty() && a[dq.peekLast()] <= a[i]) dq.pollLast();
    dq.offerLast(i);
    if (i >= k - 1) ans[i - k + 1] = a[dq.peekFirst()];
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Minimum size subarray sum ≥ target',
      code: `public int minSubArrayLen(int target, int[] nums) {
    int left = 0, sum = 0, best = Integer.MAX_VALUE;
    for (int right = 0; right < nums.length; right++) {
        sum += nums[right];
        while (sum >= target) {
            best = Math.min(best, right - left + 1);
            sum -= nums[left++];
        }
    }
    return best == Integer.MAX_VALUE ? 0 : best;
}`,
    },
  ],
  complexity: {
    best: 'O(n) time when each index enters/leaves once',
    average: 'O(n)',
    worst: 'O(n) for classic two-pointer; O(n log n) if window uses ordered structures',
    space: 'O(1) to O(k) or O(Σ) for frequency maps / deques',
  },
  patternRecognition: [
    'Ask for longest/shortest contiguous subarray/substring under a constraint.',
    'Constraint is monotonic: adding elements only makes the window “worse” or “heavier,” so you can safely shrink from the left.',
    'Need running aggregate of a range that slides (sum, distinct count, max/min).',
    'Fixed length k appears in the statement (often deque / prefix).',
  ],
  commonMistakes: [
    'Updating the answer before the window is valid.',
    'Forgetting to remove the left element from the frequency map when shrinking.',
    'Using a window when the optimal segment is not contiguous (then DP/other patterns apply).',
    'Off-by-one on inclusive bounds: length = right - left + 1.',
  ],
  variations: [
    'At most K distinct characters',
    'Exactly K distinct (often atMost(K) − atMost(K−1))',
    'Minimum window covering all required characters',
    'Sliding window maximum/minimum via monotonic deque',
    'Median / cost in window via two heaps',
  ],
  tradeoffs: {
    advantages: [
      'Linear scan with reusable state',
      'Simple to code once the invariant is clear',
      'Maps cleanly to interview narration',
    ],
    disadvantages: [
      'Only works for contiguous segments',
      'Requires a monotonic validity predicate for the classic shrink pattern',
    ],
    alternatives: ['Prefix sums + binary search', 'Kadane (max subarray sum)', 'Sparse table for range queries'],
    whenToUse: ['Contiguous + constraint + reusable aggregate'],
    whenNotToUse: ['Non-contiguous subsequences', 'Arbitrary range queries with updates (segment tree)'],
  },
  failureModes: [
    'Wrong complexity if you rebuild window state from scratch each time.',
    'Hash map keys never deleted → memory grows and “distinct” logic breaks.',
  ],
  interview: {
    expectations: [
      'State the brute force, then the O(n) window',
      'Name the invariant clearly',
      'Handle empty / impossible cases',
    ],
    commonQuestions: [
      'Longest substring without repeating characters',
      'Minimum window substring',
      'Sliding window maximum',
    ],
    followUps: ['What if characters are Unicode?', 'What if the window must be exactly size k?'],
    misconceptions: ['Sliding window always uses two pointers (deque variants differ)'],
    traps: ['Shrinking too far and skipping a valid window'],
    strongSignals: ['Mentions amortized O(n) because each index moves at most once'],
  },
  keyTakeaways: [
    'Contiguous + constraint ⇒ consider sliding window.',
    'Maintain window state; move left only when invalid.',
    'Amortized O(n) when pointers only move forward.',
    'Deque for range max/min in O(n).',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'When is a sliding window applicable?',
      answerHint: 'Contiguous segment + monotonic constraint / fixed length.',
    },
    {
      level: 'intermediate',
      question: 'How do you get exactly K distinct from at-most helpers?',
      answerHint: 'atMost(K) − atMost(K−1).',
    },
    {
      level: 'advanced',
      question: 'How does a monotonic deque give sliding window maximum in O(n)?',
      answerHint: 'Indices increasing; values decreasing; drop out-of-window fronts.',
    },
  ],
  flashcards: [
    {
      front: 'Variable window complexity (typical)',
      back: 'O(n) time amortized; each index enters/leaves ≤ once.',
    },
    {
      front: 'Fixed window maximum structure',
      back: 'Monotonic decreasing deque of indices.',
    },
  ],
  quickRevision: [
    'Contiguous segment + constraint → sliding window',
    'Expand right; shrink left while invalid',
    'Amortized O(n) if pointers only advance',
    'Frequency map / sum / deque = window state',
    'Fixed k max/min → monotonic deque',
    'Not for non-contiguous subsequences',
  ],
}

/** Phase 4 registry export */
export const content = slidingWindowContent
