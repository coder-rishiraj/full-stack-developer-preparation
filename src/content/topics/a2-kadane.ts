import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    "Kadane's algorithm finds the maximum sum of any contiguous subarray in linear time by tracking the best suffix ending at each index and the global best so far.",
  whyExists:
    "Brute force checks every subarray in O(n^2). Many interview and production analytics problems (max profit stretch, densest traffic window with signed scores) need the contiguous maximum without quadratic cost.",
  mentalModel:
    "At each position i, either extend the previous best-ending-here sum by a[i], or start fresh at a[i]. Keep a running max of those choices. Empty subarray is usually disallowed unless the problem allows 0.",
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Initialize best = cur = a[0] (or handle empty array per problem).',
        'For i = 1..n-1: cur = max(a[i], cur + a[i]).',
        'best = max(best, cur).',
        'Return best (and optionally reconstruct bounds with start indices).',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'All-negative arrays',
      text: "If every element is negative, Kadane still returns the largest (least negative) element when cur resets with max(a[i], cur+a[i]). Do not force cur to 0 unless empty subarrays are allowed.",
    },
    {
      type: 'mermaid',
      caption: 'Kadane decision at each index',
      diagram: `flowchart LR
  A[a i] --> C{cur + a i vs a i}
  C -->|extend| E[cur = cur + a i]
  C -->|restart| R[cur = a i]
  E --> B[best = max best cur]
  R --> B`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Array [-2,1,-3,4,-1,2,1,-5,4]: the window [4,-1,2,1] sums to 6 — Kadane finds it as cur climbs through that segment.',
    },
    {
      language: 'java',
      type: 'code',
      caption: 'Classic Kadane (Java)',
      code: `public int maxSubArray(int[] a) {
  int best = a[0], cur = a[0];
  for (int i = 1; i < a.length; i++) {
    cur = Math.max(a[i], cur + a[i]);
    best = Math.max(best, cur);
  }
  return best;
}`,
    },
  ],
  complexity: {
    best: 'O(n) time, O(1) extra space',
    average: 'O(n)',
    worst: 'O(n)',
    space: 'O(1) (O(n) if reconstructing path with DP arrays)',
  },
  patternRecognition: [
    'Maximum / minimum sum of a contiguous segment',
    'Signed scores where empty answer is not allowed',
    'Often follows after clarifying non-contiguous subsequence (different problem)',
  ],
  commonMistakes: [
    'Resetting cur to 0 when empty subarrays are forbidden and all values are negative',
    'Confusing with longest increasing subsequence (not contiguous)',
    'Forgetting to update best after updating cur',
  ],
  variations: [
    'Return start/end indices',
    'Circular array max subarray (Kadane + total - min subarray)',
    'At most K length (use deque / sliding window variants)',
    '2D matrix max rectangle sum (Kadane on compressed columns)',
  ],
  tradeoffs: {
    advantages: ['Optimal O(n)', 'Tiny code surface', 'Easy to narrate in interviews'],
    disadvantages: ['Only contiguous sums', 'Needs care on empty/all-negative rules'],
    alternatives: ['Prefix sums + nested loops', 'Divide and conquer O(n log n) teaching variant'],
    whenToUse: ['Contiguous max/min sum', 'Signed array analytics'],
    whenNotToUse: ['Non-contiguous subsequences', 'Need top-k distinct windows with extra constraints'],
  },
  failureModes: [
    'Wrong answer on all-negative input due to empty-window assumption',
    'Integer overflow on large sums — use long when needed',
  ],
  interview: {
    expectations: [
      'State O(n^2) brute force then Kadane',
      'Clarify empty subarray allowed or not',
      'Optionally recover indices',
    ],
    commonQuestions: ['Maximum Subarray (LeetCode 53)', 'Maximum Sum Circular Subarray'],
    followUps: ['How do you return the bounds?', 'What if the array is circular?'],
    misconceptions: ['Kadane always resets negative prefixes to zero'],
    traps: ['All-negative arrays', 'Empty array edge case'],
    strongSignals: ['Mentions local vs global optimum and why the recurrence is correct'],
  },
  keyTakeaways: [
    "Kadane = best ending here + global best.",
    'cur = max(a[i], cur + a[i]); best = max(best, cur).',
    'O(n) time, O(1) space for the sum only.',
    'Clarify empty subarray and all-negative behavior.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: "What does Kadane's algorithm compute?",
      answerHint: 'Maximum sum of a contiguous subarray in O(n).',
    },
    {
      level: 'intermediate',
      question: 'How do you handle an array of all negative numbers?',
      answerHint: 'Do not clamp cur to 0; return the largest element.',
    },
    {
      level: 'advanced',
      question: 'How does circular max subarray reuse Kadane?',
      answerHint: 'max(normal Kadane, totalSum - minSubarraySum) with care when all negative.',
    },
  ],
  flashcards: [
    {
      front: 'Kadane recurrence',
      back: 'cur = max(a[i], cur + a[i]); best = max(best, cur).',
    },
    {
      front: 'Kadane complexity',
      back: 'O(n) time, O(1) extra space for the sum.',
    },
  ],
  quickRevision: [
    'Contiguous max sum → Kadane',
    'Extend or restart at each index',
    'Track local cur and global best',
    'All-negative: largest element',
    'Circular: total - min subarray',
    'Not for non-contiguous subsequences',
  ],
  templates: [
    {
      language: 'java',
      caption: 'Kadane with indices',
      code: `int best = a[0], cur = a[0], L = 0, R = 0, start = 0;
for (int i = 1; i < a.length; i++) {
  if (a[i] > cur + a[i]) { cur = a[i]; start = i; }
  else cur += a[i];
  if (cur > best) { best = cur; L = start; R = i; }
}`,
    },
  ],
}
