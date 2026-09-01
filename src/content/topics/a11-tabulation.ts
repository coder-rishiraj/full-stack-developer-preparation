import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Tabulation (bottom-up DP) fills a table iteratively from smallest subproblems to the target, using previously computed cells—no recursion stack. Typically loops over indices with base row/column initialized first.',
  whyExists:
    'Avoids recursion overhead and stack limits; often enables space optimization (rolling arrays). Interviewers expect you to convert top-down memo to bottom-up for follow-ups.',
  mentalModel:
    'Fill a spreadsheet row by row: cell (i,j) only depends on cells already filled above/left; never look ahead.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Define dp array/table dimensions from state.',
        'Initialize base cases (dp[0], first row/col).',
        'Nested loops in increasing order of subproblem size.',
        'Transition: dp[i] = f(dp[i-1], dp[i-2], ...).',
        'Answer at dp[n] or dp[n][m] per problem.',
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Bottom-up climbing stairs',
      code: `int climbStairs(int n) {
    if (n <= 2) return n;
    int[] dp = new int[n + 1];
    dp[1] = 1; dp[2] = 2;
    for (int i = 3; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Climbing stairs n=5: dp array fills 1,2,3,5,8 bottom-up matching fibonacci-style recurrence.',
    },
  ],
  complexity: {
    notes: 'Time O(states × transition); space O(states) or O(1) with rolling variables.',
  },
  tradeoffs: {
    advantages: ['No stack overflow', 'Cache-friendly iteration', 'Easy space roll to O(1) or O(k)'],
    disadvantages: ['Computes all states even if unused', 'Loop order bugs', 'Less intuitive than recursion for some'],
    alternatives: ['Top-down memoization', 'Matrix exponentiation for linear recurrences'],
    whenToUse: ['Known state ordering', 'Need max performance', 'Space optimization with rolling array'],
    whenNotToUse: ['Sparse unreachable states only', 'Very deep natural recursion with small reachable set'],
  },
  failureModes: [
    'Wrong iteration order uses uninitialized dp.',
    'Off-by-one in base initialization.',
    'Forgetting modulo on competitive constraints.',
  ],
  interview: {
    expectations: ['Bottom-up loops', 'Base case init', 'Convert from memo'],
    commonQuestions: ['Climbing Stairs', 'Coin Change', 'Unique Paths tabulation'],
    followUps: ['Reduce space to O(1)?', 'Which loop order?'],
    misconceptions: ['Tabulation always faster than memo in big-O', 'Must use 2D table always'],
    traps: ['Knapsack inner loop direction for 1D', 'Integer overflow'],
    strongSignals: ['Derives loop invariants', 'Rolls 2D to 1D correctly'],
  },
  patternRecognition: [
    'A recurrence has dependencies that can be ordered from smaller states to larger states.',
    'The problem asks for a value for every prefix, capacity, or grid cell.',
    'Recursion overhead or stack depth makes iterative state filling preferable.',
  ],
  commonMistakes: [
    'Filling states before the cells they depend on.',
    'Leaving base rows, columns, or empty states uninitialized.',
    'Overwriting a current-row dependency during one-dimensional compression.',
    'Tabulating every state when memoization would avoid mostly unreachable states.',
  ],
  keyTakeaways: [
    'Bottom-up: iterate subproblems smallest to largest.',
    'Initialize bases before loops.',
    'Same transitions as memo, no recursion.',
    'Rolling array often cuts space.',
    'Loop order must respect dependencies.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Tabulation vs memoization?', answerHint: 'Bottom-up iterative table vs top-down recursive cache; same states often.' },
    { level: 'intermediate', question: 'Climbing stairs O(1) space?', answerHint: 'Keep only prev two values instead of full dp array.' },
    { level: 'advanced', question: '1D knapsack loop order?', answerHint: 'Iterate capacity w descending when using single array to avoid reuse same item.' },
  ],
  flashcards: [
    { front: 'Tabulation direction', back: 'Bottom-up: fill table from bases upward.' },
    { front: 'Common space trick in tabulation', back: 'Rolling array / two variables.' },
  ],
  quickRevision: [
    'Bottom-up iterative',
    'Init base cases first',
    'Respect dependency order',
    'No recursion stack',
    'Roll 2D → 1D often',
    'Knapsack 1D: w descending',
    'Answer at dp[n] or dp[n][m]',
  ],
}
