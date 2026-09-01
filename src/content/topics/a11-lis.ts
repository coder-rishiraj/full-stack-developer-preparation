import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Longest Increasing Subsequence (LIS) finds the longest strictly increasing subsequence in an array. O(n²) DP: dp[i]=1+max dp[j] for j<i with nums[j]<nums[i]. Optimal O(n log n) uses patience sorting with tails array and binary search.',
  whyExists:
    'LIS models longest chain with ordering constraints—stock days, envelope nesting, Russian dolls. The O(n log n) algorithm is a frequent follow-up testing binary search + greedy maintenance.',
  mentalModel:
    'Patience card piles: each card goes on leftmost pile top greater than it; number of piles = LIS length. tails[k] = smallest ending value of increasing subsequence length k+1.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'O(n²): for each i, scan all j<i smaller, dp[i]=1+max.',
        'O(n log n): List tails; for x, binary search replace lower bound position.',
        'Strict vs non-decreasing: use upper bound for duplicates policy.',
        'Count LIS: track counts per length alongside tails (harder).',
        'Print LIS: parent pointers in O(n²) or reconstruct from patience with indices.',
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'LIS O(n log n)',
      code: `int lengthOfLIS(int[] nums) {
    List<Integer> tails = new ArrayList<>();
    for (int x : nums) {
        int lo = 0, hi = tails.size();
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (tails.get(mid) < x) lo = mid + 1;
            else hi = mid;
        }
        if (lo == tails.size()) tails.add(x);
        else tails.set(lo, x);
    }
    return tails.size();
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: '[10,9,2,5,3,7,101,18] LIS length 4 e.g. 2,3,7,101 using patience sorting or O(n²) dp.',
    },
  ],
  complexity: {
    average: 'O(n log n) optimal; O(n²) DP simpler',
    space: 'O(n) for tails or dp array',
  },
  tradeoffs: {
    advantages: ['O(n log n) optimal length', 'Classic binary search application', 'O(n²) easy to explain first'],
    disadvantages: ['O(n log n) harder to reconstruct sequence', 'Duplicate handling subtle', 'Not same as longest increasing subarray (contiguous)'],
    alternatives: ['O(n²) DP for small n or reconstruction', 'Segment tree for variants'],
    whenToUse: ['Longest increasing subsequence', 'Envelope nesting', 'Patience sorting follow-up'],
    whenNotToUse: ['Contiguous increasing → Kadane variant', '2D LIS grid advanced'],
  },
  failureModes: [
    'Using <= instead of < for strict LIS.',
    'Wrong binary search bound for duplicate policy.',
    'Confuse subsequence with subarray.',
  ],
  interview: {
    expectations: ['O(n²) DP first', 'O(n log n) follow-up', 'Strict increasing definition'],
    commonQuestions: ['LIS', 'Russian Doll Envelopes', 'Maximum Length of Pair Chain'],
    followUps: ['Prove tails invariant?', 'Print LIS?'],
    misconceptions: ['Sort array gives LIS', 'Greedy pick smallest each step on original array'],
    traps: ['Envelopes sort by w then h descending for 2D LIS', 'Duplicate elements'],
    strongSignals: ['Explains patience piles', 'Correct lower_bound binary search'],
  },
  patternRecognition: [
    'You need the longest ordered chain of values that is strictly increasing or non-decreasing.',
    'Removing the fewest items to make a sequence sorted is equivalent to keeping an LIS.',
    'The input size suggests replacing O(n²) pair comparisons with binary-search tails.',
  ],
  commonMistakes: [
    'Using lowerBound when duplicates require upperBound for a non-decreasing subsequence.',
    'Treating the tails array as the actual LIS without predecessor reconstruction.',
    'Allowing equal values in a strictly increasing condition.',
    'Sorting first and losing the original sequence order.',
  ],
  keyTakeaways: [
    'LIS subsequence not contiguous.',
    'O(n²) dp[i] from all smaller j.',
    'O(n log n) tails + binary search.',
    'tails[i] = min end of length i+1 subsequence.',
    'Envelopes: sort then LIS on second dim.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'LIS O(n²) recurrence?', answerHint: 'dp[i]=1+max dp[j] for j<i and nums[j]<nums[i].' },
    { level: 'intermediate', question: 'Patience sorting tails invariant?', answerHint: 'tails[k] smallest possible tail of increasing subseq length k+1; size = LIS length.' },
    { level: 'advanced', question: 'Russian Doll Envelopes approach?', answerHint: 'Sort by width asc, height desc; LIS on heights avoids same width nesting.' },
  ],
  flashcards: [
    { front: 'LIS optimal time', back: 'O(n log n) with tails and binary search.' },
    { front: 'LIS vs longest increasing subarray', back: 'Subsequence allows gaps; subarray must be contiguous.' },
  ],
  quickRevision: [
    'Subsequence not subarray',
    'O(n²) dp scan',
    'O(n log n) tails',
    'Binary search lower bound',
    'Strict increasing default',
    'Envelopes sort trick',
    'tails size = answer',
  ],
}
