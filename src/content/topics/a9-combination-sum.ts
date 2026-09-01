import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Combination Sum finds all unique combinations of candidates (with or without reuse) that sum to target. Backtracking sorts candidates, picks from start index, subtracts from remaining target, and stops when target hits 0 (success) or goes negative / runs out of elements (prune).',
  whyExists:
    'Unbounded knapsack-style selection and partition problems share this "pick numbers, reuse allowed, sum to target" shape. Start-index combinations avoid duplicate orderings like [2,3] vs [3,2].',
  mentalModel:
    'Vending machine with coin reuse: at each step pick a coin >= last picked index, subtract value, recurse until target 0 (record) or overshoot (backtrack).',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Sort candidates (helps pruning and Combination Sum II).',
        'Combination Sum I: reuse allowed → recurse same index i after pick.',
        'Combination Sum II: each number once → recurse i+1; skip duplicate values at level.',
        'Prune: if candidates[i] > remain, break loop (sorted ascending).',
        'Base: remain == 0 → add path copy; remain < 0 → return.',
      ],
    },
    {
      type: 'table',
      headers: ['Variant', 'Reuse', 'Duplicate nums'],
      rows: [
        ['Combination Sum I', 'Yes', 'Distinct candidates'],
        ['Combination Sum II', 'No', 'Skip dup at same level'],
        ['Combination Sum III', 'No', '1-9 choose k sum n'],
        ['Combination Sum IV', 'Yes', 'Count orderings → DP not backtrack'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Combination Sum I (reuse)',
      code: `void dfs(int[] cand, int start, int remain, List<Integer> path, List<List<Integer>> ans) {
    if (remain == 0) { ans.add(new ArrayList<>(path)); return; }
    if (remain < 0) return;
    for (int i = start; i < cand.length; i++) {
        if (cand[i] > remain) break;
        path.add(cand[i]);
        dfs(cand, i, remain - cand[i], path, ans); // reuse: same i
        path.remove(path.size() - 1);
    }
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'candidates [2,3,5], target 8 → [2,2,2], [2,3,3], [3,5]. Sorted array enables break when candidate exceeds remaining target.',
    },
  ],
  complexity: {
    notes: 'Worst exponential in target/min(cand); pruning and sorting reduce branches significantly.',
    space: 'O(target/min) depth worst case',
  },
  tradeoffs: {
    advantages: ['Natural extension of combinations', 'Sorting enables early break prune', 'Separates reuse vs no-reuse variants cleanly'],
    disadvantages: ['Exponential worst case', 'Confusion between backtrack vs DP (Sum IV)', 'Duplicate skip easy to get wrong'],
    alternatives: ['DP for count/order matters (Sum IV)', 'Meet-in-middle for large n'],
    whenToUse: ['Find all combos summing to target', 'Unbounded coin change listing'],
    whenNotToUse: ['Count ways with order → DP', 'Very large target without prune'],
  },
  failureModes: [
    'Recurse i+1 when reuse allowed → misses valid combos.',
    'Recurse i when reuse disallowed → duplicate use of element.',
    'Not breaking on cand[i] > remain after sort.',
    'Combination Sum IV solved with backtrack → TLE; need DP.',
  ],
  interview: {
    expectations: ['Reuse vs no-reuse recurse index', 'Sort + prune', 'Distinguish Sum IV (ordered count) as DP'],
    commonQuestions: ['Combination Sum', 'Combination Sum II', 'Combination Sum III'],
    followUps: ['Why sort?', 'Minimum coins vs all combos?'],
    misconceptions: ['Same template for Sum IV', 'Must use bitmask'],
    traps: ['Integer overflow on remain with large values', 'Duplicate skip in II'],
    strongSignals: ['States i vs i+1 rule', 'Identifies DP variant for ordered counting'],
  },
  patternRecognition: [
    'You must list combinations that sum to a target, not merely count them.',
    'Candidates are chosen in nondecreasing order to avoid permutation duplicates.',
    'The prompt explicitly says candidates can be reused or can be used only once.',
  ],
  commonMistakes: [
    'Recursing with i + 1 when a candidate may be reused.',
    'Recursing with i when each input occurrence may be used only once.',
    'Skipping duplicate values across recursion levels instead of only within the same level.',
    'Failing to copy the current path before adding a successful combination.',
  ],
  keyTakeaways: [
    'Target sum backtrack: pick, subtract, recurse, undo.',
    'Reuse allowed → recurse same index i.',
    'No reuse → recurse i+1; skip duplicate values at level.',
    'Sort + break when cand[i] > remain.',
    'Combination Sum IV (order counts) → DP not backtrack.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Reuse allowed: recurse i or i+1?', answerHint: 'Same index i to allow re-picking same candidate.' },
    { level: 'intermediate', question: 'Prune after sorting?', answerHint: 'If cand[i] > remain, break; later elements also too large.' },
    { level: 'advanced', question: 'Combination Sum IV difference?', answerHint: 'Order of picks matters; count permutations with DP, not combination backtrack.' },
  ],
  flashcards: [
    { front: 'Combination Sum I recurse index after pick', back: 'Stay at i (reuse allowed).' },
    { front: 'When is Combination Sum a DP problem?', back: 'Sum IV: ordered ways to target → 1D DP.' },
  ],
  quickRevision: [
    'remain == 0 success',
    'Reuse → dfs(i)',
    'No reuse → dfs(i+1)',
    'Sort ascending prune',
    'II: skip dup same level',
    'IV is DP not backtrack',
    'Copy path at success',
  ],
}
