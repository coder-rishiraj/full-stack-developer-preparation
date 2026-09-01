import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Longest Common Subsequence (LCS) finds the longest sequence appearing in both strings in order (not necessarily contiguous). Classic 2D DP: match extends diagonal; mismatch takes max of left/top. Basis for diff tools, bioinformatics, and many string DP variants.',
  whyExists:
    'Measuring similarity between sequences without requiring contiguous match is fundamental. LCS template extends to edit distance, shortest common supersequence, and DP on two strings.',
  mentalModel:
    'Two fingers scanning strings: if chars match, both advance and length +1; else best of advancing one finger only.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'dp[i][j] = LCS length of A[0..i-1] and B[0..j-1].',
        'If A[i-1]==B[j-1]: dp[i][j]=1+dp[i-1][j-1].',
        'Else: dp[i][j]=max(dp[i-1][j], dp[i][j-1]).',
        'Answer dp[m][n]; reconstruct by tracing back preferring diagonal on match.',
        'Space O(min(m,n)) with rolling row.',
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'LCS length',
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
      text: 'LCS of "abcde" and "ace" is "ace" length 3—characters in order with gaps allowed.',
    },
  ],
  complexity: {
    average: 'O(m·n) time',
    space: 'O(m·n) or O(min(m,n))',
  },
  tradeoffs: {
    advantages: ['Standard 2D string template', 'Reconstructable', 'Foundation for edit distance'],
    disadvantages: ['Quadratic time', 'Not same as longest common substring (contiguous)'],
    alternatives: ['Hunt-Szymanski advanced for sparse matches', 'Hash for single LCS query small alphabet'],
    whenToUse: ['Two sequence similarity', 'SCS length m+n-LCS', 'Delete ops min to match'],
    whenNotToUse: ['Contiguous match → different DP or rolling hash', 'Very long strings need approximation'],
  },
  failureModes: [
    'Confuse subsequence with substring recurrence.',
    'Off-by-one charAt(i-1) vs dp index i.',
    'Reconstruction wrong tie-break on max(left,top).',
  ],
  interview: {
    expectations: ['2D recurrence', 'O(m·n)', 'Optional reconstruct'],
    commonQuestions: ['LCS', 'Delete Operation for Two Strings', 'Shortest Common Supersequence'],
    followUps: ['Print LCS?', 'Space optimize?'],
    misconceptions: ['Same as longest common substring', 'Greedy matching works'],
    traps: ['Empty string base row/col 0', 'SCS length formula'],
    strongSignals: ['Derives edit distance from LCS', 'Traces reconstruction correctly'],
  },
  patternRecognition: [
    'Two sequences must retain relative order while matching as many elements as possible.',
    'The task asks for minimum insertions, deletions, or edits that map to common subsequences.',
    'A match consumes one character from both prefixes; a mismatch leaves a choice of which prefix to shorten.',
  ],
  commonMistakes: [
    'Using longest common substring transitions when gaps are allowed.',
    'Incrementing from dp[i - 1][j - 1] when the current characters do not match.',
    'Returning the table length without reconstructing when the actual sequence is requested.',
    'Failing to initialize empty-prefix rows and columns to zero.',
  ],
  keyTakeaways: [
    'Match → diagonal +1; else max(left, top).',
    'Subsequence allows gaps; not contiguous.',
    'SCS length = m + n - LCS length.',
    'Base dp[0][*]=dp[*][0]=0.',
    'O(m·n) time standard.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'LCS vs longest common substring?', answerHint: 'Subsequence allows skips; substring must be contiguous block.' },
    { level: 'intermediate', question: 'LCS recurrence on match?', answerHint: 'dp[i][j] = 1 + dp[i-1][j-1].' },
    { level: 'advanced', question: 'Shortest common supersequence length?', answerHint: 'm + n - LCS; build by backtracking LCS table.' },
  ],
  flashcards: [
    { front: 'LCS match transition', back: '1 + dp[i-1][j-1].' },
    { front: 'SCS length from LCS', back: 'm + n - LCS length.' },
  ],
  quickRevision: [
    '2D on two strings',
    'Match diagonal +1',
    'Mismatch max up/left',
    'Not contiguous substring',
    'Base row/col zero',
    'O(m·n) time',
    'SCS m+n-LCS',
  ],
}
