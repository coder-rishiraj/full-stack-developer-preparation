import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Bitmask DP represents subsets as integers where bit i is 1 if element i is included. State dp[mask] stores best value for that subset; transitions flip one bit or iterate submasks—classic for TSP small n, assignment, and "visit all" problems with n ≤ 20.',
  whyExists:
    'Exponential 2^n subsets are feasible for n≈20 (≈1M states). Encoding subset as int enables O(1) add/remove/test with bitwise ops—compact state for DP over all subsets or traveling salesman.',
  mentalModel:
    'Each mask is a fingerprint of which items you picked. Transition: from mask without j, add j → mask | (1<<j). Iterate all masks and all bits to fill DP table.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Test bit j: (mask >> j) & 1. Set: mask | (1<<j). Clear: mask & ~(1<<j). Toggle: mask ^ (1<<j).',
        'Iterate submasks: for (sub = mask; sub > 0; sub = (sub-1) & mask).',
        'TSP: dp[mask][i] = min cost to visit cities in mask ending at i; start mask=1<<0.',
        'Assignment: try matching workers to jobs with mask of used jobs.',
        'Count subsets with property: dp[mask] += dp[mask without last bit].',
        'n ≤ 20 constraint in problem usually signals bitmask DP.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: '3 cities TSP: mask 111 (7) means all visited; from dp[011][1] add edge 1→2 → dp[111][2]. Answer min over dp[fullMask][i].',
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'TSP bitmask DP (n cities, n ≤ 15-20)',
      code: `int tsp(int[][] dist) {
    int n = dist.length;
    int full = (1 << n) - 1;
    int[][] dp = new int[1 << n][n];
    for (int[] row : dp) Arrays.fill(row, Integer.MAX_VALUE / 2);
    dp[1][0] = 0;
    for (int mask = 0; mask <= full; mask++)
        for (int u = 0; u < n; u++)
            if ((mask & (1 << u)) != 0 && dp[mask][u] < Integer.MAX_VALUE / 2)
                for (int v = 0; v < n; v++)
                    if ((mask & (1 << v)) == 0) {
                        int nmask = mask | (1 << v);
                        dp[nmask][v] = Math.min(dp[nmask][v], dp[mask][u] + dist[u][v]);
                    }
    int ans = Integer.MAX_VALUE;
    for (int u = 1; u < n; u++)
        ans = Math.min(ans, dp[full][u] + dist[u][0]);
    return ans;
}`,
    },
    {
      language: 'java',
      caption: 'Iterate all submasks of mask',
      code: `for (int sub = mask; sub > 0; sub = (sub - 1) & mask) {
    // sub is subset of mask
}`,
    },
  ],
  complexity: {
    average: 'O(2^n · n) or O(2^n · n²) for TSP',
    space: 'O(2^n · n) or O(2^n)',
  },
  patternRecognition: [
    'Traveling Salesman (small n).',
    'Assign workers to jobs (n,m ≤ 20).',
    'Count ways to partition with bitmask.',
    'Maximum students taking exam (hard mask constraints).',
  ],
  commonMistakes: [
    'n=25 → 2^25 states TLE/MLE.',
    'Forgot start mask 1<<0 not 0 for TSP from city 0.',
    'Not checking bit set before using u in mask.',
    'Integer overflow on INF + edge weight.',
  ],
  tradeoffs: {
    advantages: [
      'Compact subset representation',
      'Fast bit operations',
      'Exact DP for small n exponential problems',
    ],
    disadvantages: [
      'Only n ≲ 20 practical',
      '2^n memory explodes quickly',
      'Harder to debug than explicit sets',
    ],
    alternatives: ['Meet-in-middle for subset sum n≈40', 'Heuristic TSP for large n', 'Branch and bound'],
    whenToUse: ['n ≤ 20 visit-all subsets', 'Assignment matching', 'State = which items used'],
    whenNotToUse: ['Large n', 'Independent items (use knapsack not full mask)'],
  },
  failureModes: [
    'Wrong full mask: (1<<n)-1 not 1<<n.',
    'Shift 1<<31 negative in Java—use 1L<<n for n=31.',
    'DP order: process masks increasing popcount.',
  ],
  interview: {
    expectations: [
      'mask | (1<<j) transition',
      'O(2^n n) complexity awareness',
      'Bit test (mask>>j)&1',
    ],
    commonQuestions: ['TSP small n', 'Assignment problem bitmask', 'Submask iteration'],
    followUps: ['Why n≤20?', 'Space optimize?', 'Meet-in-middle when?'],
    misconceptions: ['Use bitmask for n=100', 'Arrays.asList for subsets faster', 'Greedy works for TSP'],
    traps: ['Start mask 0 vs 1<<0', 'Return without closing tour to start'],
    strongSignals: ['States 2^n bound', 'Submask loop trick', 'Checks bit before transition'],
  },
  keyTakeaways: [
    'Mask bit i = element i chosen.',
    'TSP dp[mask][lastCity]; full = (1<<n)-1.',
    'Submask: for (s=mask; s; s=(s-1)&mask).',
    'O(2^n · n²) TSP; feasible n ≤ 20.',
    'Use long shift if n near 31.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Set bit j in mask?', answerHint: 'mask | (1 << j).' },
    { level: 'intermediate', question: 'TSP bitmask state meaning?', answerHint: 'dp[mask][i] = min cost visiting cities in mask, ending at city i.' },
    { level: 'advanced', question: 'Iterate all subsets of mask?', answerHint: 'for (int sub=mask; sub>0; sub=(sub-1)&mask) — standard submask enumeration.' },
  ],
  flashcards: [
    { front: 'Test bit j in mask', back: '(mask >> j) & 1 == 1.' },
    { front: 'Full mask n elements', back: '(1 << n) - 1.' },
    { front: 'TSP typical complexity', back: 'O(2^n · n²).' },
  ],
  quickRevision: [
    'Bit i = include i',
    'mask | (1<<j) add',
    'dp[mask][last]',
    'full = (1<<n)-1',
    'n ≤ 20 limit',
    'submask loop trick',
    'Check bit before use',
  ],
}
