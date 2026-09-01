import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    '2D DP uses dp[i][j] with two indices—two strings, two sequences, matrix paths, or item index plus capacity. Transitions read from neighboring cells (i-1,j), (i,j-1), (i-1,j-1). Base cases fill first row/column.',
  whyExists:
    'Problems coupling two sequences (LCS, edit distance) or grid positions naturally need two dimensions. 2D tables make dependencies explicit; sometimes space-optimized to 1D row rolling.',
  mentalModel:
    'Spreadsheet over i and j: each cell best answer for prefix A[0..i] and B[0..j] or path to (i,j).',
  howItWorks: [
    {
      type: 'list',
      items: [
        'LCS: match → 1+dp[i-1][j-1]; else max(dp[i-1][j], dp[i][j-1]).',
        'Edit distance: insert/delete/replace min of neighbors + cost.',
        'Unique paths: dp[i][j] = dp[i-1][j] + dp[i][j-1].',
        '0/1 Knapsack: dp[i][w] from skip dp[i-1][w] or take dp[i-1][w-wt]+val.',
        'Init row/col for empty prefix bases.',
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'LCS length 2D',
      code: `int lcs(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (a.charAt(i - 1) == b.charAt(j - 1))
                dp[i][j] = 1 + dp[i - 1][j - 1];
            else
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    return dp[m][n];
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'LCS of "ace" and "abcde": table builds length 3 matching ace in order without requiring contiguity in the second string.',
    },
  ],
  complexity: {
    average: 'O(m·n) for m×n table problems',
    space: 'O(m·n) or O(min(m,n)) rolled row',
  },
  tradeoffs: {
    advantages: ['Clear for two-sequence problems', 'Standard templates', 'Rollable to 1D often'],
    disadvantages: ['Memory O(m·n)', 'More index off-by-one bugs', 'Slower than specialized algorithms (LIS O(n log n))'],
    alternatives: ['1D rolling when only previous row needed', 'Space-optimized LCS Hirschberg advanced'],
    whenToUse: ['Two strings/sequences', 'Grid with obstacles', 'Knapsack with explicit item index'],
    whenNotToUse: ['Single sequence unless reduced', 'LIS prefer patience sorting'],
  },
  failureModes: [
    'String index i vs dp index i off-by-one.',
    'Not initializing dp[0][*] and dp[*][0].',
    'Knapsack 1D roll wrong loop direction.',
  ],
  interview: {
    expectations: ['Fill bases', 'Correct neighbor transitions', 'Optional 1D space roll'],
    commonQuestions: ['LCS', 'Edit Distance', 'Unique Paths II', '0/1 Knapsack'],
    followUps: ['Reconstruct path?', 'Space optimize?'],
    misconceptions: ['Must always store 2D', 'LCS and edit distance same recurrence'],
    traps: ['Obstacle cells set dp=0', 'Empty string bases'],
    strongSignals: ['Draws small table example', 'Explains i-1,j-1 diagonal meaning'],
  },
  patternRecognition: [
    'A state needs two independent indices, capacities, or prefixes.',
    'The problem compares two sequences or moves through a grid.',
    'The recurrence naturally refers to neighboring table cells such as dp[i - 1][j] and dp[i][j - 1].',
  ],
  commonMistakes: [
    'Mixing zero-based input indices with one-based DP table indices.',
    'Initializing the first row or column incorrectly for empty prefixes.',
    'Compressing rows in an order that overwrites a dependency.',
    'Allocating a quadratic table when constraints require a space-optimized formulation.',
  ],
  keyTakeaways: [
    'dp[i][j] = best for prefixes or position (i,j).',
    'Initialize first row/column bases.',
    'Match uses diagonal dp[i-1][j-1].',
    'Many 2D tables roll to 1D row.',
    'O(m·n) time typical for string DP.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'LCS when chars match?', answerHint: 'dp[i][j] = 1 + dp[i-1][j-1].' },
    { level: 'intermediate', question: 'Edit distance three operations?', answerHint: 'Replace dp[i-1][j-1], delete dp[i-1][j], insert dp[i][j-1]; +1 cost each.' },
    { level: 'advanced', question: 'Roll 2D knapsack to 1D?', answerHint: 'Single array size W+1; iterate w from W down to wt[i] for 0/1 item.' },
  ],
  flashcards: [
    { front: 'LCS mismatch transition', back: 'max(dp[i-1][j], dp[i][j-1]).' },
    { front: '2D DP base initialization', back: 'First row and column for empty prefixes.' },
  ],
  quickRevision: [
    'Two indices i, j',
    'Init row0 col0',
    'Match → diagonal +1',
    'Else max left/top',
    'O(m·n) time',
    'Roll row for space',
    'Knapsack 1D w descending',
  ],
}
