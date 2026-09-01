import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Memoization (top-down DP) caches recursive subproblem results in a HashMap or array so each distinct state is computed once. Start from the original problem, recurse to smaller states, store return values before returning up the call stack.',
  whyExists:
    'Naive recursion on overlapping subproblems (Fibonacci, grid paths, knapsack) is exponential. Memoization preserves natural recursive structure while dropping repeated work to polynomial time.',
  mentalModel:
    'Recursive explorer with a notebook: before solving a subproblem, check the notebook; after solving, write the answer. Same state always gets same cached result.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Define state variables (index, remaining capacity, etc.).',
        'Base cases return constants without memo.',
        'If memo contains state, return cached value.',
        'Compute recursively, store in memo, return.',
        'State key: primitive array for multiple ints or string encoding.',
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Memoization skeleton',
      code: `int dp(int i, int j, int[][] memo) {
    if (i == 0 && j == 0) return 1; // base
    if (i < 0 || j < 0) return 0;
    if (memo[i][j] != -1) return memo[i][j];
    int ans = dp(i - 1, j, memo) + dp(i, j - 1, memo);
    memo[i][j] = ans;
    return ans;
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Fibonacci naive recomputes fib(3) many times; memo on n computes each n once → O(n) time.',
    },
  ],
  complexity: {
    notes: 'Time O(states × work per state); space O(states) memo + O(depth) stack.',
  },
  tradeoffs: {
    advantages: ['Natural recursive formulation', 'Only computes reachable states', 'Easy to add from brute recursion'],
    disadvantages: ['Stack overflow on deep recursion', 'HashMap overhead vs array', 'Harder to optimize space'],
    alternatives: ['Bottom-up tabulation', 'Iterative with explicit stack'],
    whenToUse: ['Overlapping subproblems', 'Top-down natural definition', 'Sparse state space'],
    whenNotToUse: ['No overlap → plain recursion OK', 'Need tight space O(1) rolling array'],
  },
  failureModes: [
    'Wrong state definition → incorrect memo keys.',
    'Forgetting to save before return.',
    'Stack overflow on n=10^5 linear recursion.',
  ],
  interview: {
    expectations: ['Identify state', 'O(states) time after memo', 'Convert from brute recursion'],
    commonQuestions: ['Climbing Stairs', 'House Robber', '0/1 Knapsack memo'],
    followUps: ['Convert to tabulation?', 'Space optimize?'],
    misconceptions: ['Memo always faster than tabulation asymptotically', 'Any recursion needs memo'],
    traps: ['Mutable state in memo key', 'Integer overflow in return'],
    strongSignals: ['Defines state clearly', 'Shows before/after complexity'],
  },
  patternRecognition: [
    'A recursive solution revisits the same state defined by a few changing parameters.',
    'The recurrence is easier to express top-down than to order in a table.',
    'Only a sparse subset of all theoretical states is reached.',
  ],
  commonMistakes: [
    'Caching with an incomplete key that merges distinct states.',
    'Using zero as an uncomputed sentinel when zero is a valid answer.',
    'Forgetting to cache base cases or recursive return values.',
    'Causing stack overflow on deep input where bottom-up iteration is safer.',
  ],
  keyTakeaways: [
    'Memo = cache recursive subproblem results.',
    'Each distinct state computed once.',
    'Time proportional to number of states.',
    'Start from brute recursion + HashMap/array.',
    'Watch recursion depth limits.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What problem does memoization fix?', answerHint: 'Overlapping subproblems in recursion causing exponential recomputation.' },
    { level: 'intermediate', question: 'Memo vs tabulation?', answerHint: 'Top-down lazy vs bottom-up iterative; same states often, memo may skip unreachable.' },
    { level: 'advanced', question: 'Knapsack memo state?', answerHint: 'dp(i, w) = max value using items i..n-1 with capacity w; cache 2D or 1D rolled.' },
  ],
  flashcards: [
    { front: 'Memoization direction', back: 'Top-down: recurse then cache.' },
    { front: 'When memo helps', back: 'Overlapping subproblems in recursion.' },
  ],
  quickRevision: [
    'Top-down DP',
    'Check memo before compute',
    'Store after compute',
    'State = subproblem params',
    'O(states) time',
    'Stack depth risk',
    'Convert from naive recursion',
  ],
}
