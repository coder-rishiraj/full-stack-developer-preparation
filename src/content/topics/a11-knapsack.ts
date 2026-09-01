import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Knapsack patterns cover 0/1 knapsack (each item once), unbounded (unlimited copies), and subset-sum variants. State is (item index, remaining capacity) or 1D dp[w] with careful loop order. Maximize value or check feasibility of target sum.',
  whyExists:
    'Resource allocation with capacity constraints appears everywhere. Knapsack DP is the template for bounded/unbounded selection, partition equal subset, and target sum problems.',
  mentalModel:
    'Backpack with weight limit: for each item, decide take or skip; dp[w] = best value achievable at weight w using processed items.',
  howItWorks: [
    {
      type: 'list',
      items: [
        '0/1: dp[i][w] = max(skip dp[i-1][w], take dp[i-1][w-wt]+val).',
        '1D 0/1: iterate w from W down to wt[i] to prevent reuse.',
        'Unbounded: iterate w from wt[i] to W ascending (reuse allowed).',
        'Subset sum: dp[s] boolean if sum s achievable; same 0/1 loop order.',
        'Partition equal subset: target = sum/2 if even.',
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: '0/1 knapsack 1D',
      code: `int knapsack01(int[] wt, int[] val, int W) {
    int[] dp = new int[W + 1];
    for (int i = 0; i < wt.length; i++)
        for (int w = W; w >= wt[i]; w--)
            dp[w] = Math.max(dp[w], dp[w - wt[i]] + val[i]);
    return dp[W];
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Items (wt 1,2), (wt 2,3), capacity 3: best value 4 taking both items once in 0/1 knapsack.',
    },
  ],
  complexity: {
    average: 'O(n·W) pseudo-polynomial',
    space: 'O(W) with 1D array',
  },
  tradeoffs: {
    advantages: ['Unified template for many problems', '1D space optimization', 'Clear take/skip semantics'],
    disadvantages: ['Pseudo-polynomial not true poly in W', 'Greedy fails on 0/1', 'Large W impractical'],
    alternatives: ['Meet-in-middle for subset sum large n', 'Greedy for fractional knapsack only'],
    whenToUse: ['Capacity + discrete items', 'Target sum feasibility', 'Max value under weight'],
    whenNotToUse: ['Fractional items → greedy ratio', 'Huge W values'],
  },
  failureModes: [
    'Ascending w loop on 0/1 → reuse item multiple times.',
    'Forget check w >= wt[i].',
    'Partition odd sum returns true incorrectly.',
  ],
  interview: {
    expectations: ['0/1 vs unbounded loop direction', 'O(n·W)', 'Subset sum as boolean knapsack'],
    commonQuestions: ['0/1 Knapsack', 'Partition Equal Subset Sum', 'Coin Change II (unbounded count)'],
    followUps: ['Why descending w?', 'Space optimize?'],
    misconceptions: ['Greedy by value/weight for 0/1', 'Same loop for bounded count without extra dimension'],
    traps: ['Zero weight items', 'Integer overflow on value sum'],
    strongSignals: ['Explains descending w prevents reuse', 'Maps partition to subset sum'],
  },
  patternRecognition: [
    'Each item has a weight or cost and a value, with a limited capacity or target.',
    'The task asks to choose a subset that maximizes value or reaches a sum.',
    'The wording distinguishes using an item once from using it unlimited times.',
  ],
  commonMistakes: [
    'Iterating capacity upward for a 0/1 knapsack and reusing the same item.',
    'Iterating capacity downward for an unbounded knapsack and blocking valid reuse.',
    'Using value/weight greedy for indivisible 0/1 items.',
    'Forgetting whether exact fill or at-most capacity is the desired base condition.',
  ],
  keyTakeaways: [
    '0/1 knapsack: w loops descending on 1D dp.',
    'Unbounded: w loops ascending.',
    'Subset sum: boolean dp[target].',
    'Partition equal subset: target sum/2.',
    'O(n·W) pseudo-polynomial time.',
  ],
  interviewQuestions: [
    { level: 'basic', question: '0/1 knapsack 1D loop direction?', answerHint: 'w from W down to wt[i] so each item used at most once.' },
    { level: 'intermediate', question: 'Unbounded knapsack difference?', answerHint: 'w ascending from wt[i] to W allows reuse within same item round.' },
    { level: 'advanced', question: 'Partition to K equal subsets?', answerHint: 'Backtracking with used[] or DP with bitmask state for small n; target sum/k each.' },
  ],
  flashcards: [
    { front: '0/1 knapsack 1D w iteration', back: 'Descending from W to wt[i].' },
    { front: 'Partition equal subset reduction', back: 'Subset sum to total/2 if total even.' },
  ],
  quickRevision: [
    'Take or skip each item',
    '0/1: w descending',
    'Unbounded: w ascending',
    'Subset sum boolean dp',
    'O(n·W) time',
    'Greedy only fractional',
    'Check odd total early',
  ],
}
