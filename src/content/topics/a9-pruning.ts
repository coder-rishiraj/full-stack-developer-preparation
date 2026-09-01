import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Pruning in backtracking cuts branches that cannot lead to a valid or optimal solution before fully exploring them. Techniques include sorted early break, remaining-count bounds, partial sum limits, and constraint checks that fail fast.',
  whyExists:
    'Raw backtracking is often exponential; pruning is what makes problems like Combination Sum, N-Queens, and subset sum tractable. Interview performance depends on identifying and stating prune conditions clearly.',
  mentalModel:
    'Stop exploring a path the moment you know it is doomed—like closing a maze corridor marked "dead end" instead of walking to the wall.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Sorted array: if cand[i] > remain, break (later also too large).',
        'Combinations: if elements left < slots needed, return.',
        'Subset sum: if partial sum > target, return (non-negative nums).',
        'N-Queens: skip column/diagonal conflicts before recurse.',
        'Branch and bound: track best so far; abandon worse partial costs.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'State prune in interview',
      text: 'Say prune condition aloud while coding: "If remaining elements cannot fill k slots, return." Interviewers reward this as much as correct code.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Combination Sum with candidates [2,3,5], target 8, sorted: pick 2, remain 6; pick 2, remain 4; pick 2, remain 2; pick 2, success. When remain=3 and next cand=5, break loop—no need to try 5.',
    },
  ],
  complexity: {
    notes: 'Pruning improves average case dramatically; worst case often unchanged without strong bounds.',
  },
  tradeoffs: {
    advantages: ['Huge average-case speedup', 'Simple conditions often suffice', 'Shows optimization thinking'],
    disadvantages: ['Wrong prune can skip valid solutions', 'Extra preprocessing (sort) cost', 'Hard to prove worst-case improvement'],
    alternatives: ['Memoization/DP when overlapping subproblems', 'Meet-in-middle for subset problems'],
    whenToUse: ['Any backtrack with monotonic bounds', 'Sorted input enables break', 'Fixed target/size limits'],
    whenNotToUse: ['When prune condition is wrong or incomplete', 'Problem needs full enumeration without bounds'],
  },
  failureModes: [
    'Breaking instead of continue on duplicate skip (different rules).',
    'Prune remain < 0 but nums can be negative without extra logic.',
    'Over-aggressive bound eliminates valid optimal paths.',
  ],
  interview: {
    expectations: ['Name at least one prune per backtrack', 'Sort when enables break', 'Correct remaining-count math'],
    commonQuestions: ['Combination Sum', 'Subsets with target', 'Partition to K Equal Sum Subsets'],
    followUps: ['Does sorting hurt correctness?', 'Branch and bound vs simple prune?'],
    misconceptions: ['Prune optional for passing', 'Any sort always helps'],
    traps: ['Off-by-one on need = k - path.size()', 'Duplicate skip uses continue not break'],
    strongSignals: ['Multiple prune rules stated upfront', 'Correctness argument for sort+break'],
  },
  implementation: [
    {
      language: 'java',
      caption: 'Prune impossible fixed-size combinations',
      code: `void dfs(int start, int need, List<Integer> path) {
    if (need == 0) { answer.add(new ArrayList<>(path)); return; }
    if (n - start + 1 < need) return;
    for (int value = start; value <= n; value++) {
        path.add(value);
        dfs(value + 1, need - 1, path);
        path.remove(path.size() - 1);
    }
}`,
    },
  ],
  patternRecognition: [
    'A partial candidate has a monotonic condition proving it can never become valid.',
    'Sorting makes every later candidate at least as large as the current failing candidate.',
    'A fixed number of slots remains but too few values remain to fill them.',
    'An optimization search has a lower bound already worse than the best answer found.',
  ],
  commonMistakes: [
    'Pruning a negative remaining sum when candidates can also be negative.',
    'Using break where duplicate handling requires continue at the same recursion depth.',
    'Applying a bound that is not admissible and silently discarding valid solutions.',
    'Sorting for pruning but forgetting that it changes index or duplicate semantics.',
  ],
  keyTakeaways: [
    'Prune = abandon branches that cannot succeed.',
    'Sort + break when partial exceed target/limit.',
    'Remaining count prune for fixed-size combos.',
    'Constraint check before recurse is pruning too.',
    'Wrong prune loses valid answers—prove carefully.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why sort before Combination Sum prune?', answerHint: 'Ascending order lets us break when cand[i] > remain; all later larger.' },
    { level: 'intermediate', question: 'Combine pruning for k slots?', answerHint: 'If n - j + 1 < k - path.size(), not enough elements left; stop loop at j.' },
    { level: 'advanced', question: 'Branch and bound vs backtrack prune?', answerHint: 'B&B tracks incumbent best cost; prune partial paths worse than best found.' },
  ],
  flashcards: [
    { front: 'Sorted combination sum prune', back: 'Break loop when cand[i] > remain.' },
    { front: 'Remaining elements prune', back: 'Return if slots needed > elements left.' },
  ],
  quickRevision: [
    'Fail fast on invalid partial',
    'Sort enables early break',
    'need vs remaining count',
    'Constraint check = prune',
    'continue vs break carefully',
    'Prove prune preserves correctness',
    'State prune aloud in interview',
  ],
}
