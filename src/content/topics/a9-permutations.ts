import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Permutations enumerate all n! orderings of elements. Backtracking uses a used[] boolean array or swap-in-place on indices: at each depth, try every unused element, recurse, then undo. Duplicates require sorting plus skip-same-at-level rules.',
  whyExists:
    'Order matters for scheduling, anagram generation, brute-force TSP small n, and constraint puzzles. Permutation backtracking is the template for "try all orderings" before pruning or DP replaces brute force.',
  mentalModel:
    'Fill slots left to right: at position pos, try each unused element, mark used, fill pos+1, unmark on return. Swap variant: fix position i, swap i with j for j >= i, recurse i+1, swap back.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'used[] approach: if used[i] skip; used[i]=true; path.add; dfs(pos+1); undo.',
        'Swap approach: for j in [i, n): swap(i,j); permute(i+1); swap(i,j).',
        'Base: pos == n → store copy of path or current array.',
        'Permutations II: sort; skip i if used[i-1] && nums[i]==nums[i-1] && !used[i-1].',
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Permutations with used array',
      code: `void permute(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> ans) {
    if (path.size() == nums.length) {
        ans.add(new ArrayList<>(path));
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true;
        path.add(nums[i]);
        permute(nums, used, path, ans);
        path.remove(path.size() - 1);
        used[i] = false;
    }
}`,
    },
    {
      language: 'java',
      caption: 'Swap-based in-place',
      code: `void permuteSwap(int[] nums, int i, List<List<Integer>> ans) {
    if (i == nums.length) {
        ans.add(Arrays.stream(nums).boxed().toList());
        return;
    }
    for (int j = i; j < nums.length; j++) {
        swap(nums, i, j);
        permuteSwap(nums, i + 1, ans);
        swap(nums, i, j);
    }
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: '[1,2,3] permutations include [2,1,3] and [3,1,2]; used[] ensures each index picked once per path.',
    },
  ],
  complexity: {
    average: 'O(n · n!) time',
    worst: 'O(n · n!) all permutations',
    space: 'O(n) recursion + used array',
  },
  tradeoffs: {
    advantages: ['Complete ordering exploration', 'Swap method O(1) extra per level', 'Foundation for constraint permutations'],
    disadvantages: ['Factorial blowup', 'Duplicate handling tricky', 'Swap mutates input temporarily'],
    alternatives: ['Next permutation iterative (lexicographic)', 'Heap algorithm for streaming'],
    whenToUse: ['All orderings', 'Small n ≤ 10', 'Anagram / scheduling brute force'],
    whenNotToUse: ['Large n', 'Only need existence → math/constraints'],
  },
  failureModes: [
    'Not resetting used[i] after backtrack.',
    'Duplicate permutations when duplicates in array without skip rule.',
    'Swap method forgetting to swap back.',
  ],
  interview: {
    expectations: ['n! count', 'used[] or swap template', 'Handle duplicates in Permutations II'],
    commonQuestions: ['Permutations', 'Permutations II', 'Next Permutation'],
    followUps: ['k-th permutation without generating all?', 'Iterative next permutation?'],
    misconceptions: ['Same as combinations', 'Sort alone removes duplicate permutations'],
    traps: ['Permutations II skip condition uses !used[i-1]', 'Off-by-one on path size base'],
    strongSignals: ['Explains both used and swap approaches', 'Correct duplicate skip at same tree level'],
  },
  patternRecognition: [
    'Every ordering of selected elements is distinct and must be generated.',
    'Each recursive depth chooses one unused element for the next position.',
    'The output size is factorial, typically with n small.',
  ],
  commonMistakes: [
    'Using a start index combination template and missing alternative orders.',
    'Failing to mark an element unused again after the recursive call.',
    'Adding the mutable current path instead of a copied permutation.',
    'Generating duplicates from repeated input values without a per-level skip rule.',
  ],
  keyTakeaways: [
    'n! permutations; backtrack with used[] or swap.',
    'Always undo: unmark used or swap back.',
    'Duplicates: sort + skip same value at same depth.',
    'Time O(n·n!); space O(n) stack.',
    'Next permutation: find pivot, swap, reverse suffix.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'How many permutations of n distinct elements?', answerHint: 'n!.' },
    { level: 'intermediate', question: 'Permutations II duplicate skip rule?', answerHint: 'Skip nums[i] if i>0 && nums[i]==nums[i-1] && !used[i-1].' },
    { level: 'advanced', question: 'Generate k-th permutation efficiently?', answerHint: 'Factorial number system or repeated selection with shrinking counts O(n^2) or Fenwick O(n log n).' },
  ],
  flashcards: [
    { front: 'Permutation count', back: 'n! for distinct elements.' },
    { front: 'Undo step in used[] permutations', back: 'used[i]=false and path.remove after recurse.' },
  ],
  quickRevision: [
    'n! orderings',
    'used[] or swap backtrack',
    'Undo every choice',
    'Permutations II: sort + skip',
    'O(n·n!) time',
    'Next perm: pivot + reverse',
    'Not for large n',
  ],
}
