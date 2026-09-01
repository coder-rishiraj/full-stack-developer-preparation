import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    '1D DP stores answers in a single array dp[i] where i indexes position, capacity, amount, or day. Transitions combine prior entries dp[i-1], dp[i-2], or prefix ranges. Space often reducible to O(1) or O(k) rolling variables.',
  whyExists:
    'Many problems have one natural dimension—stairs, robber houses, coin change amount, LIS length at i. 1D tables are simpler to code and optimize than 2D when a second dimension collapses.',
  mentalModel:
    'Number line of states: each point i computed from neighbors to the left (or right) already solved.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'House Robber: dp[i] = max(dp[i-1], nums[i] + dp[i-2]).',
        'Coin Change: dp[a] = min(dp[a], dp[a-coin]+1) for each coin, amount a.',
        'Climbing Stairs: dp[i] = dp[i-1] + dp[i-2].',
        'Decode Ways: dp[i] from dp[i-1] and dp[i-2] if valid splits.',
        'LIS O(n^2): dp[i] = 1 + max dp[j] for j<i if nums[j]<nums[i].',
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'House Robber 1D',
      code: `int rob(int[] nums) {
    int prev2 = 0, prev1 = 0;
    for (int x : nums) {
        int cur = Math.max(prev1, prev2 + x);
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'House Robber [2,7,9,3]: dp tracks max excluding adjacent; best 2+9=11 skipping neighbors of chosen houses.',
    },
  ],
  complexity: {
    average: 'O(n) or O(n·k) depending on inner loop',
    space: 'O(n) table or O(1) rolled',
  },
  tradeoffs: {
    advantages: ['Simple indexing', 'Easy O(1) space roll', 'Fast to implement'],
    disadvantages: ['Hidden second dimension may need 2D', 'Order matters in inner loops (knapsack)'],
    alternatives: ['2D when two constraints', 'Greedy when proven'],
    whenToUse: ['Single parameter state', 'Linear recurrence', 'Amount/capacity DP'],
    whenNotToUse: ['Two independent constraints without reduction'],
  },
  failureModes: [
    'Wrong recurrence (rob: forget skip vs take).',
    'Coin change: iterate coins outer vs amount outer changes unbounded vs 0/1.',
    'Off-by-one on dp[0] base.',
  ],
  interview: {
    expectations: ['Write recurrence', 'Base cases', 'Optional O(1) space'],
    commonQuestions: ['House Robber', 'Coin Change', 'Climbing Stairs', 'Maximum Subarray (Kadane)'],
    followUps: ['House Robber II circular?', 'Space optimize?'],
    misconceptions: ['Kadane not always called DP but same idea', 'Always dp array length n+1'],
    traps: ['Integer.MAX_VALUE + 1 overflow in min DP', 'Circular robber needs split'],
    strongSignals: ['States recurrence verbally first', 'Rolls to two variables'],
  },
  patternRecognition: [
    'The answer at position i depends on one or a few earlier positions.',
    'The input is a line, staircase, or sequence with a natural left-to-right order.',
    'A recurrence can be written with dp[i - 1] and dp[i - 2] or a small rolling window.',
  ],
  commonMistakes: [
    'Writing a recurrence before defining exactly what dp[i] represents.',
    'Forgetting base cases for an empty or one-element input.',
    'Keeping a full DP array when rolling variables are sufficient.',
    'Using a greedy step when future choices change the optimal accumulated value.',
  ],
  keyTakeaways: [
    'dp[i] depends on earlier indices per recurrence.',
    'Initialize dp[0] and small bases carefully.',
    'Coin change: outer coin loop for unbounded.',
    'Many 1D DPs roll to O(1) space.',
    'Name state meaning of index i explicitly.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'House Robber recurrence?', answerHint: 'dp[i] = max(dp[i-1], nums[i] + dp[i-2]).' },
    { level: 'intermediate', question: 'Coin change min coins transition?', answerHint: 'dp[amount] = min(dp[amount], dp[amount-coin]+1); init dp[0]=0, rest INF.' },
    { level: 'advanced', question: 'House Robber II (circle)?', answerHint: 'Max of rob(nums[0..n-2]) and rob(nums[1..n-1]).' },
  ],
  flashcards: [
    { front: 'House Robber at index i', back: 'max(skip prev, take + dp[i-2]).' },
    { front: '1D DP space trick', back: 'Rolling two/previous values.' },
  ],
  quickRevision: [
    'Single index state',
    'Recurrence from left neighbors',
    'Base dp[0] careful',
    'Coin change min INF init',
    'Roll to O(1) often',
    'Circular → split range',
    'State meaning explicit',
  ],
}
