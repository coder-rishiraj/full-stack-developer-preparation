import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Bitmask DP represents subsets as integers (bits) and uses state dp[mask][i] — often TSP, assignment, or counting subsets with constraints — iterating masks from 0 to 2^n-1.',
  whyExists: 'Many problems need all subsets of n items (n≤20). Bitmask encodes subset in O(1) space; transitions flip bits or add cities.',
  mentalModel: 'Light switch panel — each switch on/off is a subset; DP builds best answer for each panel configuration.',
  howItWorks: [
    { type: 'list', items: [
      'State: (visited_mask, last_node) for TSP.',
      'Transition: add unvisited city j: new_mask = mask | (1<<j).',
      'Iterate masks increasing popcount (subset DP order).',
      'Precompute popcount or use __builtin_popcount.',
      'Complexity O(n²·2^n) — n≤20 typical.',
    ] },
  ],
  example: [
    { type: 'code', language: 'java', code: 'int ALL = (1 << n) - 1;\ndp[1][0] = 0;\nfor (int mask = 1; mask <= ALL; mask++)\n  for (int u = 0; u < n; u++)\n    if ((mask & (1<<u)) != 0)\n      for (int v = 0; v < n; v++)\n        if ((mask & (1<<v)) == 0)\n          dp[mask|(1<<v)][v] = min(dp[mask|(1<<v)][v], dp[mask][u] + dist[u][v]);', caption: 'TSP bitmask DP core' },
  ],
  tradeoffs: {
    advantages: [
      'Exact for small n',
      'Unified subset template',
    ],
    disadvantages: [
      'Exponential — n>22 impractical',
    ],
    alternatives: [
      'Held-Karp same complexity',
      'Heuristic for large n',
    ],
    whenToUse: [
      'n≤20 subset/TSP/assignment',
    ],
    whenNotToUse: [
      'Large n — use approximation',
    ],
  },
  failureModes: [
    'Wrong mask iteration order',
    'Off-by-one bit index',
    'Integer overflow on dp values',
  ],
  production: {
    performance: [
      'Use int[] not HashMap for dp table',
    ],
    maintainability: [
      'Template for mask loops',
    ],
  },
  interview: {
    expectations: [
      'O(n²2^n) TSP',
      'Mask iteration',
    ],
    commonQuestions: [
      'Bitmask DP when?',
    ],
    followUps: [
      'State definition TSP?',
    ],
    misconceptions: [
      'Greedy works for TSP',
    ],
    traps: [
      'n=25 in interview',
    ],
    strongSignals: [
      'mask|(1<<j) transition + popcount order',
    ],
  },
  complexity: {
    average: 'O(n² · 2^n) for Held-Karp-style transitions over mask and endpoint.',
    worst: 'O(n² · 2^n)',
    space: 'O(n · 2^n) for dp[mask][last].',
    notes: 'Subset states grow exponentially, so this is generally practical only around n ≤ 20.',
  },
  implementation: [
    {
      language: 'java',
      caption: 'Subset DP over assigned tasks',
      code: `int limit = 1 << n;
int[] dp = new int[limit];
Arrays.fill(dp, Integer.MAX_VALUE / 2);
dp[0] = 0;
for (int mask = 0; mask < limit; mask++) {
    int task = Integer.bitCount(mask);
    for (int worker = 0; worker < n; worker++) {
        if ((mask & (1 << worker)) == 0)
            dp[mask | (1 << worker)] = Math.min(dp[mask | (1 << worker)],
                dp[mask] + cost[task][worker]);
    }
}`,
    },
  ],
  patternRecognition: [
    'n is roughly 15–20 and the state is a chosen, visited, or assigned subset.',
    'Each element has a binary used/un-used decision and transitions add one element.',
    'The answer depends on both a subset and a final item, such as visited cities and last city.',
    'The next task or position is determined by the number of set bits in the mask.',
  ],
  commonMistakes: [
    'Allocating 1 << n states when n is too large for exponential memory or time.',
    'Using int shifts or masks without guarding against a bit index outside their range.',
    'Updating a state from an unreachable sentinel value and overflowing the transition cost.',
    'Defining a mask state without recording the endpoint when the transition cost depends on it.',
  ],
  keyTakeaways: [
    'Subset as bitmask int',
    'TSP: dp[mask][last]',
    'Iterate masks by popcount',
    'O(n²·2^n)',
    'n≤20 constraint',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Bitmask DP?', answerHint: 'DP over subsets encoded as integers 0..2^n-1.' },
    { level: 'intermediate', question: 'TSP state?', answerHint: 'dp[mask][i] = min cost visiting mask ending at city i.' },
    { level: 'advanced', question: 'Assign tasks to workers bitmask?', answerHint: 'dp[mask] = min cost assigning first popcount(mask) tasks; try worker per task.' },
  ],
  flashcards: [
    { front: 'mask | (1<<j)', back: 'Add element j to subset mask' },
    { front: 'Held-Karp', back: 'Classic TSP bitmask DP O(n²2^n)' },
    { front: 'popcount order', back: 'Process masks with increasing number of set bits' },
  ],
  quickRevision: [
    '2^n subsets',
    'dp[mask][i]',
    'Popcount order',
    'O(n²2^n)',
    'n≤20',
  ],
}
