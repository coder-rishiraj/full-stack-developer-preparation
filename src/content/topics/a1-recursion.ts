import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Recursion solves a problem by calling itself on smaller subproblems with a base case that stops. In Java DSA: tree/graph DFS, backtracking, divide-and-conquer, and memoized recurrence.',
  whyExists:
    'Many structures are recursive by definition (trees). Recursion mirrors problem specification—combinations, permutations, path enumeration—and pairs naturally with memoization for overlapping subproblems.',
  mentalModel:
    'Call stack of frames: each frame has local state + parameters. Base case returns constant; recursive case combines results from child calls. Depth = max stack height—watch StackOverflowError on deep linear chains.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Define base case(s) first—empty input, leaf node, index == n.',
        'Recursive step must progress toward base (smaller n, deeper tree, index+1).',
        'Return type: value (fib), void (backtrack), or boolean (exists path).',
        'Backtracking: choose → recurse → undo (restore state).',
        'Memo: Map state → result to avoid exponential recomputation.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'DFS tree + backtracking subset',
      code: `int dfs(TreeNode root) {
    if (root == null) return 0;
    return 1 + dfs(root.left) + dfs(root.right);
}

void subsets(int[] nums, int i, List<Integer> path, List<List<Integer>> ans) {
    if (i == nums.length) {
        ans.add(new ArrayList<>(path));
        return;
    }
    path.add(nums[i]);
    subsets(nums, i + 1, path, ans);
    path.remove(path.size() - 1);
    subsets(nums, i + 1, path, ans);
}`,
    },
    {
      type: 'mermaid',
      diagram: `flowchart TD
  C[call f n] --> B{n base?}
  B -->|yes| R[return base value]
  B -->|no| S[split into subcalls]
  S --> C1[f smaller 1]
  S --> C2[f smaller 2]
  C1 --> Combine[combine results]
  C2 --> Combine
  Combine --> Ret[return to parent]`,
      caption: 'Recursive call flow',
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Stack depth',
      text: 'Skewed tree or linear recursion depth n≈10⁵ may overflow JVM stack. Convert to iterative with explicit stack or increase stack size rarely—prefer iterative BFS/loop.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Fibonacci naive: O(2^n) calls. Memo on n: O(n). Same recurrence, recursion + cache = top-down DP; loop = bottom-up.',
    },
  ],
  complexity: {
    notes: 'Time often branches^depth without memo; space O(depth) call stack plus O(memo states) if cached.',
  },
  patternRecognition: [
    'Tree/graph traversal → natural DFS recursion.',
    'Generate all combinations/permutations → backtracking.',
    'Problem defined on prefix/suffix → recurse on index i.',
    'Same subproblem repeated → add memo.',
  ],
  commonMistakes: [
    'Missing base case → infinite recursion.',
    'Not undoing backtrack state (forget path.remove).',
    'Copy vs reference: ans.add(path) shares mutable list—clone new ArrayList<>(path) at leaf.',
    'Deep recursion TLE/StackOverflow—need iterative.',
  ],
  tradeoffs: {
    advantages: ['Matches problem structure', 'Short code for trees/backtrack', 'Easy memo wrap'],
    disadvantages: ['Stack overflow risk', 'Function call overhead', 'Harder to debug deep stacks'],
    alternatives: ['Iterative stack for DFS', 'Bottom-up DP loop', 'BFS for shortest path unweighted'],
    whenToUse: ['Trees', 'Backtracking', 'Divide and conquer', 'Top-down DP'],
    whenNotToUse: ['Very deep linear recursion', 'Simple linear scan'],
  },
  failureModes: [
    'StackOverflowError on long chain.',
    'Exponential time without memo/pruning.',
    'Shared mutable list in result collection.',
  ],
  interview: {
    expectations: ['State base case and recurrence', 'Analyze stack depth', 'Convert to iterative if asked'],
    commonQuestions: ['Subsets', 'Permutations', 'Max depth of tree', 'Climbing stairs'],
    followUps: ['Tail recursion in Java?', 'Memo vs tabulation?'],
    misconceptions: ['Recursion always slower—often same Big-O with memo'],
    traps: ['Not cloning path at leaf'],
    strongSignals: ['Draws recursion tree; mentions stack space O(h)'],
  },
  keyTakeaways: [
    'Base case + progress toward base every call.',
    'Backtrack: choose, recurse, undo.',
    'Clone path when saving to result list.',
    'Memo when subproblems overlap.',
    'Watch stack depth on skewed n≈10⁵.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Two parts every recursive function needs?',
      answerHint: 'Base case and recursive case that reduces problem size.',
    },
    {
      level: 'intermediate',
      question: 'Why new ArrayList<>(path) in backtracking?',
      answerHint: 'path is reused; storing reference would mutate all saved results.',
    },
    {
      level: 'advanced',
      question: 'Recursion stack space for balanced BST height h?',
      answerHint: 'O(h) frames; balanced h=O(log n); skewed h=O(n).',
    },
  ],
  flashcards: [
    {
      front: 'Backtracking undo step',
      back: 'Remove last choice from path after recursive call returns.',
    },
    {
      front: 'Recursion space besides heap',
      back: 'O(call depth) activation stack.',
    },
  ],
  quickRevision: [
    'Base case stops recursion',
    'Progress each call',
    'Backtrack choose/recurse/undo',
    'Clone path at leaf',
    'Memo on overlapping subproblems',
    'Depth limit → iterative',
  ],
}
