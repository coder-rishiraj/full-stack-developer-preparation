import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Prefix and suffix arrays precompute aggregates over [0..i] and [i..n-1] so any “everything except index i” or range query becomes O(1) after O(n) preprocessing.',
  whyExists:
    'Problems like “product of array except self” or “max to the right of each index” need repeated left/right context. Re-scanning each time is O(n²). One forward and one backward pass materialize that context.',
  mentalModel:
    'Walk left to right building “what I have seen so far” (prefix). Walk right to left building “what remains ahead” (suffix). At index i, combine prefix[i-1] with suffix[i+1] without touching i.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Define the aggregate: sum, product, min, max, count, XOR, etc.',
        'Build prefix[i] = agg(a[0..i]) in one left-to-right pass.',
        'Build suffix[i] = agg(a[i..n-1]) in one right-to-left pass.',
        'Answer at i uses prefix[i-1] and suffix[i+1] (or inclusive variants as defined).',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Space optimization',
      text: 'Often suffix can be a rolling variable during a second pass—output[i] = prefix[i-1] * runningSuffix, then update runningSuffix *= a[i] from the right.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  A[Array] --> P[Prefix pass L→R]
  A --> S[Suffix pass R→L]
  P --> C[Combine at i]
  S --> C
  C --> Out[Answer per index]`,
    caption: 'Prefix + suffix decomposition',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Product Except Self on [1,2,3,4]: prefix products [1,1,2,6]; suffix [24,12,4,1]; result[i] = prefix[i-1]*suffix[i+1] → [24,12,8,6].',
    },
    {
      type: 'table',
      headers: ['i', 'prefix left', 'suffix right', 'result'],
      rows: [
        ['0', '1', '24', '24'],
        ['1', '1', '12', '12'],
        ['2', '2', '4', '8'],
        ['3', '6', '1', '6'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Prefix + suffix arrays',
      code: `int n = a.length;
int[] pre = new int[n], suf = new int[n];
pre[0] = a[0];
for (int i = 1; i < n; i++) pre[i] = pre[i - 1] + a[i]; // example: sum
suf[n - 1] = a[n - 1];
for (int i = n - 2; i >= 0; i--) suf[i] = suf[i + 1] + a[i];
// query sum(l,r): pre[r] - (l > 0 ? pre[l-1] : 0)`,
    },
    {
      language: 'java',
      caption: 'O(1) space product except self',
      code: `int n = nums.length;
int[] out = new int[n];
out[0] = 1;
for (int i = 1; i < n; i++) out[i] = out[i - 1] * nums[i - 1];
int suffix = 1;
for (int i = n - 1; i >= 0; i--) {
    out[i] *= suffix;
    suffix *= nums[i];
}
return out;`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Trapping Rain Water (prefix max + suffix max)',
      code: `public int trap(int[] h) {
    int n = h.length;
    int[] leftMax = new int[n], rightMax = new int[n];
    leftMax[0] = h[0];
    for (int i = 1; i < n; i++) leftMax[i] = Math.max(leftMax[i - 1], h[i]);
    rightMax[n - 1] = h[n - 1];
    for (int i = n - 2; i >= 0; i--) rightMax[i] = Math.max(rightMax[i + 1], h[i]);
    int water = 0;
    for (int i = 0; i < n; i++)
        water += Math.min(leftMax[i], rightMax[i]) - h[i];
    return water;
}`,
    },
  ],
  complexity: {
    best: 'O(n) preprocess, O(1) per query',
    average: 'O(n) time, O(n) space for full tables',
    worst: 'O(n) time; O(1) extra space with rolling suffix/prefix tricks',
    space: 'O(n) arrays or O(1) with output reuse',
  },
  patternRecognition: [
    '“Except self”, “all elements to the left/right of i”.',
    'Range sum/product queries on static array (prefix sum).',
    'Compare max/min from both sides (rain water, stock span variants).',
    'Balance or split array at index with equal left/right property.',
  ],
  commonMistakes: [
    'Off-by-one on inclusive vs exclusive ranges in prefix sum queries.',
    'Division by zero in product-prefix problems (use separate zero counts).',
    'Forgetting empty boundary: prefix[-1] treated as identity (0 for sum, 1 for product).',
    'Building only one direction when answer needs both sides.',
  ],
  variations: [
    '2D prefix sums for submatrix sum queries',
    'Difference array (prefix of deltas) for range updates',
    'Prefix XOR for parity / toggle queries',
    'Suffix minimum for “next greater” style preprocessing',
  ],
  tradeoffs: {
    advantages: [
      'Simple, cache-friendly linear passes',
      'Reduces O(n²) naive scans to O(n)',
      'Composable with other patterns (two pointers on prefix array)',
    ],
    disadvantages: [
      'Static array assumption; updates need segment tree/Fenwick',
      'O(n) space unless optimized to rolling variables',
    ],
    alternatives: ['Segment tree / Fenwick for dynamic ranges', 'Monotonic stack for next greater', 'Two pointers for some max problems'],
    whenToUse: ['Static array', 'Per-index left/right context', 'Many range queries on fixed data'],
    whenNotToUse: ['Frequent point/range updates', 'Only need single global aggregate'],
  },
  failureModes: [
    'Integer overflow in prefix products (use long or log-space).',
    'Wrong identity at boundaries breaks first/last index.',
  ],
  interview: {
    expectations: [
      'Propose brute O(n²), then two-pass O(n)',
      'Optimize space to O(1) excluding output when asked',
      'Handle zeros in multiplication problems',
    ],
    commonQuestions: [
      'Product of Array Except Self',
      'Trapping Rain Water',
      'Range Sum Query (prefix sum)',
    ],
    followUps: ['2D version?', 'What if array updates? → Fenwick tree'],
    misconceptions: ['Prefix sum always needs O(n) space for all problems'],
    traps: ['Using division in product except self when zeros present'],
    strongSignals: ['Separates prefix build, suffix build, combine cleanly'],
  },
  keyTakeaways: [
    'Left context + right context at i = prefix + suffix.',
    'Two O(n) passes, O(1) query per index after build.',
    'Rolling variable often replaces full suffix array.',
    'Prefix sum: sum(l,r) = pre[r] − pre[l−1].',
    'Identity at empty range: 0 sum, 1 product, −∞ max (careful).',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'How do you answer range sum [l,r] with a prefix array?',
      answerHint: 'pre[r] − (l > 0 ? pre[l−1] : 0).',
    },
    {
      level: 'intermediate',
      question: 'Product Except Self without division?',
      answerHint: 'Output prefix products left-to-right, multiply rolling suffix right-to-left.',
    },
    {
      level: 'advanced',
      question: 'How does prefix sum extend to 2D submatrix sums?',
      answerHint: 'pre[x][y] = cell + left + top − overlap; rectangle via inclusion-exclusion on four corners.',
    },
  ],
  flashcards: [
    {
      front: 'Prefix sum query [l,r]',
      back: 'pre[r] − pre[l−1] (0 if l=0).',
    },
    {
      front: 'Product except self space trick',
      back: 'Store left products in output, multiply suffix on second pass.',
    },
  ],
  quickRevision: [
    'Prefix = aggregate [0..i], suffix = [i..n−1]',
    'Two passes → O(n) preprocess',
    'Combine at i without using a[i] in both factors',
    'Range sum = pre[r] − pre[l−1]',
    'Rolling suffix saves O(n) space',
    'Zeros break product-with-division approach',
    'Updates need Fenwick/segment tree',
  ],
}
