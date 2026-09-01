import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Subsequence problems pick elements in order without requiring contiguity—LCS, LIS, increasing/decreasing subseq count, delete to make sorted. Often O(n²) DP comparing pairs (i,j) or dp[i] from prior indices; distinct from substring/contiguous subarray.',
  whyExists:
    'Subsequence flexibility models many "keep order, skip some" tasks. Recognizing subsequence vs substring vs subarray picks the correct DP or two-pointer approach.',
  mentalModel:
    'Subsequence keeps relative order but may skip elements—like editing a film by cutting scenes without reordering.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'LIS/LCS: classic subsequence DP templates.',
        'Longest bitonic: LIS from left + LDS from right.',
        'Delete min to sorted: n - LIS length.',
        'Distinct subsequences count: dp on two strings.',
        'Contiguous subarray problems use Kadane not subsequence DP.',
      ],
    },
    {
      type: 'table',
      headers: ['Term', 'Contiguous?', 'Example'],
      rows: [
        ['Subsequence', 'No', 'LIS, LCS'],
        ['Substring', 'Yes', 'Longest palindromic substring'],
        ['Subarray', 'Yes', 'Max subarray sum'],
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Subsequence "ace" from "abcde" skips b and d while preserving order—distinct from substring "bcd".',
    },
  ],
  tradeoffs: {
    advantages: ['Rich DP family', 'Often O(n²) or O(n log n) solutions', 'Clear distinction teaches problem typing'],
    disadvantages: ['Quadratic cost', 'Easy to confuse with substring', 'Reconstruction harder in O(n log n) LIS'],
    alternatives: ['Two pointers when contiguous', 'Greedy when increasing chain special'],
    whenToUse: ['Order preserved, skips allowed', 'Two sequences comparison'],
    whenNotToUse: ['Must be contiguous block', 'Only need sum not order'],
  },
  failureModes: [
    'Apply substring DP to subsequence problem.',
    'Forget strict vs non-decreasing in LIS.',
    'Count subsequences overflow without modulo.',
  ],
  interview: {
    expectations: ['Define subsequence clearly', 'Pick LIS/LCS template', 'Distinguish substring'],
    commonQuestions: ['LIS', 'LCS', 'Distinct Subsequences', 'Delete Operation for Two Strings'],
    followUps: ['Contiguous variant?', 'Count vs length?'],
    misconceptions: ['Subsequence = substring', 'Sorting helps LIS'],
    traps: ['Modulo 1e9+7 on count', 'Empty subsequence in counting'],
    strongSignals: ['States subsequence definition upfront', 'Maps delete ops to LCS'],
  },
  complexity: {
    average: 'O(n²) for classic LIS/LCS DP; O(n log n) for LIS length with tails.',
    worst: 'O(mn) for two-string subsequence DP.',
    space: 'O(n) for optimized one-dimensional DP or O(mn) when reconstructing a table.',
    notes: 'Output-counting variants can require arbitrary precision or modulo arithmetic.',
  },
  implementation: [
    {
      language: 'java',
      caption: 'Quadratic LIS dynamic programming',
      code: `int[] dp = new int[nums.length];
Arrays.fill(dp, 1);
int best = 0;
for (int i = 0; i < nums.length; i++) {
    for (int j = 0; j < i; j++)
        if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    best = Math.max(best, dp[i]);
}`,
    },
  ],
  patternRecognition: [
    'Elements must remain in relative order but may be skipped between selections.',
    'The prompt compares two strings or arrays for a longest common ordered sequence.',
    'Removing the fewest items is equivalent to keeping a longest increasing sequence.',
    'The wording contrasts an ordered selection with a contiguous substring or subarray.',
  ],
  commonMistakes: [
    'Solving a subsequence problem as if selected elements must be contiguous.',
    'Using non-decreasing comparisons when the problem requires strictly increasing LIS.',
    'Sorting an array before LIS and destroying the original order constraint.',
    'Failing to apply modulo or a wide numeric type when counting subsequences.',
  ],
  keyTakeaways: [
    'Subsequence: order kept, gaps allowed.',
    'Not contiguous unlike substring/subarray.',
    'LIS and LCS are core templates.',
    'Min deletions to sorted = n - LIS.',
    'Count problems need modulo and careful empty case.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Subsequence vs substring?', answerHint: 'Subsequence skips allowed non-contiguous; substring must be contiguous slice.' },
    { level: 'intermediate', question: 'Min deletions to make array sorted?', answerHint: 'n - LIS length (keep longest increasing subsequence).' },
    { level: 'advanced', question: 'Distinct subsequences of s matching t?', answerHint: '2D DP: if s[i]==t[j] add dp[i-1][j-1] to dp[i-1][j]; else dp[i-1][j].' },
  ],
  flashcards: [
    { front: 'Subsequence contiguous?', back: 'No; maintain order only.' },
    { front: 'Min removals for sorted array', back: 'n minus LIS length.' },
  ],
  quickRevision: [
    'Order yes, contiguous no',
    'LIS/LCS templates',
    'Not same as substring',
    'Delete ops → LCS link',
    'Count → modulo',
    'n - LIS for sorted',
    'State definition early',
  ],
}
