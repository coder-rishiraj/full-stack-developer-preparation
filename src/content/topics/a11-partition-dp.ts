import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Partition DP splits arrays or strings into segments where each part satisfies a condition—palindrome partitioning min cuts, equal sum partitions, or max sum of K subarrays. Often combines prefix preprocessing with dp[i] = best over last segment ending at i.',
  whyExists:
    'Many problems ask "split into k parts optimally"—cuts, pages, days. Prefix sums or palindrome tables reduce segment cost checks to O(1), enabling O(n²) or O(n²·k) DP.',
  mentalModel:
    'Try every last cut position j before i: if segment (j..i) valid, dp[i] = min/max over dp[j-1] + cost(j,i).',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Palindrome partition: precompute isPalin[l][r]; dp[i]=min cuts for s[0..i].',
        'Equal subset partition: knapsack boolean dp[target=sum/2].',
        'Split array largest sum K: dp[k][i] min largest sum first k parts ending i (harder).',
        'Prefix sum for O(1) range sum in segment cost.',
        'Base dp[0]=0 or dp[-1]=0 sentinel.',
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Palindrome partitioning min cuts',
      code: `int minCut(String s) {
    int n = s.length();
    boolean[][] pal = new boolean[n][n];
    for (int len = 1; len <= n; len++)
        for (int l = 0; l + len <= n; l++) {
            int r = l + len - 1;
            pal[l][r] = s.charAt(l) == s.charAt(r) && (len <= 2 || pal[l + 1][r - 1]);
        }
    int[] dp = new int[n];
    for (int i = 0; i < n; i++) {
        dp[i] = i; // worst all single chars
        for (int j = 0; j <= i; j++)
            if (pal[j][i]) dp[i] = j == 0 ? 0 : Math.min(dp[i], dp[j - 1] + 1);
    }
    return dp[n - 1];
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Palindrome partition "aab": cuts 1 splitting as "aa"|"b" after precomputing palindrome substrings.',
    },
  ],
  complexity: {
    average: 'O(n²) for palindrome partition with O(n²) preprocess',
    space: 'O(n²) pal table or O(n) dp only',
  },
  tradeoffs: {
    advantages: ['Unified "last split" template', 'Prefix/pal preprocess speeds checks', 'Covers many interview splits'],
    disadvantages: ['O(n²) or higher with k parts', 'Palindrome table memory', 'Tricky indexing on j=0'],
    alternatives: ['Backtrack all partitions (generate not optimize)', 'Meet-in-middle for subset partition'],
    whenToUse: ['Min/max cuts or splits', 'Valid segment predicate checkable fast'],
    whenNotToUse: ['Only need existence → knapsack boolean', 'k=2 equal sum simple subset sum'],
  },
  failureModes: [
    'Off-by-one on dp[j-1] when j=0.',
    'Not precomputing palindrome leading to O(n³).',
    'Confuse partition count with min cuts.',
  ],
  interview: {
    expectations: ['Last split loop j..i', 'Precompute palindrome or prefix', 'O(n²) typical'],
    commonQuestions: ['Palindrome Partitioning II', 'Partition Equal Subset Sum', 'Burst Balloons (different interval DP)'],
    followUps: ['Return all partitions?', 'Split array largest sum K?'],
    misconceptions: ['Greedy cuts optimal for palindrome', 'Same as knapsack always'],
    traps: ['Single char base cuts', 'Empty prefix dp[0]=0'],
    strongSignals: ['Palindrome O(n²) preprocess', 'Clear last-segment transition'],
  },
  patternRecognition: [
    'The problem asks to split an array or string into segments with an additive or max/min segment cost.',
    'A decision at index i chooses the endpoint of the next partition.',
    'A prefix DP can combine the best answer before a cut with the cost of the last segment.',
  ],
  commonMistakes: [
    'Allowing empty segments when every partition must contain at least one element.',
    'Computing a segment cost repeatedly instead of maintaining it while extending the endpoint.',
    'Using the wrong min/max identity for an unreachable prefix state.',
    'Returning dp[n] without enforcing the required number of partitions.',
  ],
  keyTakeaways: [
    'dp[i] = optimal for prefix ending at i.',
    'Try all last segment start j; combine dp[j-1] + cost.',
    'Precompute palindrome or prefix sums.',
    'Equal partition → subset sum sum/2.',
    'Watch j=0 base case for cuts.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Partition equal subset sum approach?', answerHint: 'Boolean knapsack dp[target] with target total/2 if total even.' },
    { level: 'intermediate', question: 'Palindrome min cuts transition?', answerHint: 'If s[j..i] palindrome: dp[i]=min(dp[i], (j==0?0:dp[j-1]+1)).' },
    { level: 'advanced', question: 'Split array largest sum K idea?', answerHint: 'dp[k][i]=min max segment sum splitting first i into k parts; try last segment start j.' },
  ],
  flashcards: [
    { front: 'Partition DP transition pattern', back: 'dp[i] from dp[j-1] + cost of segment j..i.' },
    { front: 'Equal subset partition target', back: 'sum/2 if sum even via boolean knapsack.' },
  ],
  quickRevision: [
    'Last split position j',
    'dp[i] on prefix',
    'Precompute pal/prefix',
    'j=0 base careful',
    'O(n²) typical',
    'Equal sum → knapsack',
    'Min cuts vs generate all',
  ],
}
