import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Combinations generate all ways to choose k elements from n where order does not matter—C(n,k) results. Backtracking fixes increasing index so [1,2] and [2,1] are not duplicated. Classic template: choose at start, recurse from start+1.',
  whyExists:
    'Interview staples (Combine, Combination Sum variants, Pascal triangle rows) need ordered selection without permutations. Start-index discipline reduces search from n! to C(n,k) and prevents duplicate combinations.',
  mentalModel:
    'Pick k items from a sorted line left-to-right without looking back. Once you skip index i at this level, never pick a smaller index later in the same path.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Parameters: n, k, start index, current path.',
        'Base: path.size() == k → record copy, return.',
        'Prune: if remaining elements < k - path.size(), return.',
        'Loop j from start to n: path.add(j), backtrack(j+1), path.remove.',
      ],
    },
    {
      type: 'table',
      headers: ['Pattern', 'Start rule', 'Output size'],
      rows: [
        ['Combinations C(n,k)', 'j+1 after pick', 'C(n,k)'],
        ['Subsets', 'i+1 include/exclude', '2^n'],
        ['Permutations', 'swap or used[]', 'n!'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Combine n choose k',
      code: `void combine(int n, int k, int start, List<Integer> path, List<List<Integer>> ans) {
    if (path.size() == k) {
        ans.add(new ArrayList<>(path));
        return;
    }
    int need = k - path.size();
    for (int j = start; j <= n - need + 1; j++) {
        path.add(j);
        combine(n, k, j + 1, path, ans);
        path.remove(path.size() - 1);
    }
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'combine(4,2) from 1..4 → [1,2], [1,3], [1,4], [2,3], [2,4], [3,4]. Six results = C(4,2).',
    },
  ],
  complexity: {
    average: 'O(k · C(n,k)) time',
    worst: 'O(k · C(n,k)) output proportional',
    space: 'O(k) recursion depth',
  },
  tradeoffs: {
    advantages: ['Smaller than permutations', 'Start index prevents duplicates', 'Easy pruning on remaining slots'],
    disadvantages: ['Still exponential for large k', 'Off-by-one on loop bound common'],
    alternatives: ['Iterative next-combination lex order', 'DP Pascal row for counts only'],
    whenToUse: ['Choose k from n unordered', 'Building blocks for sum/partition variants'],
    whenNotToUse: ['Order matters → permutations', 'Only need count → math/DP'],
  },
  failureModes: [
    'Loop to n instead of n - need + 1 → extra branches.',
    'Using i instead of j+1 start → duplicate combos.',
    'Forgetting prune when k - path.size() > n - j + 1.',
  ],
  interview: {
    expectations: ['Explain C(n,k) size', 'Start index monotonicity', 'Prune remaining elements'],
    commonQuestions: ['Combinations', 'Combination Sum I/II', 'Letter Combinations of Phone Number'],
    followUps: ['Difference vs subsets?', 'Generate one combination at a time iteratively?'],
    misconceptions: ['Same as permutations with sort', 'Must try all orders'],
    traps: ['1-indexed vs 0-indexed in Combine problem', 'Pruning bound arithmetic'],
    strongSignals: ['States why j+1 prevents duplicates', 'Prunes early with need count'],
  },
  patternRecognition: [
    'You need unordered groups of size k chosen from a range or array.',
    'The output treats [1, 2] and [2, 1] as the same answer.',
    'A start index can enforce increasing choices and prevent duplicates.',
  ],
  commonMistakes: [
    'Restarting recursion at index zero and generating permutation duplicates.',
    'Adding the mutable path directly instead of a copy.',
    'Exploring when too few elements remain to fill the required slots.',
    'Using the wrong loop upper bound and omitting valid final combinations.',
  ],
  keyTakeaways: [
    'Combinations: pick k items, order irrelevant.',
    'Always recurse from j+1 after choosing j.',
    'Prune when not enough elements remain.',
    'Output size C(n,k); time O(k·C(n,k)).',
    'Differs from subsets: fixed size k at leaf.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Combinations vs permutations?', answerHint: 'Combinations: order ignored, C(n,k); permutations: order matters, n!.' },
    { level: 'intermediate', question: 'Why start index in backtrack?', answerHint: 'Ensures increasing picks; avoids [2,1] duplicate of [1,2].' },
    { level: 'advanced', question: 'Pruning condition for combine?', answerHint: 'Stop loop when j > n - (k - path.size()) + 1; not enough left.' },
  ],
  flashcards: [
    { front: 'Combination count C(n,k)', back: 'n! / (k!(n-k)!).' },
    { front: 'Prevent duplicate combos in backtrack', back: 'Recurse from j+1 after choosing j.' },
  ],
  quickRevision: [
    'Fixed size k at base case',
    'Monotonic start index j+1',
    'Prune: need vs remaining',
    'C(n,k) output count',
    'Copy path at leaf',
    'Not same as subsets (2^n)',
    'Loop upper bound n - need + 1',
  ],
}
