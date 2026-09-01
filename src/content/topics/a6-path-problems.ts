import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Tree path problems ask for sums, counts, or lists along root-to-leaf or any downward paths—solved with DFS backtracking, prefix sums on paths, or the "path through node" global-max pattern from diameter.',
  whyExists:
    'Many tree metrics are path-shaped (file paths, decision chains, gain flows). Separating root-to-leaf backtracking from any-direction max-gain clarifies two dominant templates that share postorder structure.',
  mentalModel:
    'Root-to-leaf: carry running sum/path list down, commit at leaves, undo on backtrack. Any path through node: combine best left + best right gains like diameter but with values and optional non-root start.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Root-to-leaf sum: DFS with remain = target - node.val; check leaf + remain==0.',
        'Path sum II: maintain ArrayList path; add on enter, remove on backtrack; copy list into result at leaf.',
        'Path sum III (any start): prefix map on current path from root; count prefix sums matching needed delta.',
        'Max path sum: postorder gain with max(0, child) and global best at node.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Two path templates',
      text: 'Template A: backtracking list for all paths. Template B: numeric gain return + global best (diameter family). Pick based on whether path must start at root.',
    },
  ],
  architecture: {
    mermaid: `flowchart TD
  Root[Root DFS] --> Down[Push node to path]
  Down --> Leaf{leaf?}
  Leaf -->|match| Save[Save path copy]
  Leaf --> Back[Pop backtrack]
  Down --> Child[Recurse children]
  Child --> Back`,
    caption: 'Root-to-leaf backtracking',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Path Sum target 22 on tree with root 5: 5→4→11→2 sums to 22 at leaf. Path Sum III counts paths with sum 8 including downward paths not from root only—prefix map {0:1} along DFS.',
    },
    {
      type: 'table',
      headers: ['problem', 'path rule', 'technique'],
      rows: [
        ['path sum I', 'root to leaf', 'DFS remain'],
        ['path sum II', 'root to leaf all', 'backtrack list'],
        ['path sum III', 'any downward', 'prefix hashmap'],
        ['max path sum', 'any node start/end', 'gain + global best'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Path Sum (root to leaf)',
      code: `boolean hasPathSum(TreeNode root, int sum) {
    if (root == null) return false;
    if (root.left == null && root.right == null) return sum == root.val;
    return hasPathSum(root.left, sum - root.val)
        || hasPathSum(root.right, sum - root.val);
}`,
    },
    {
      language: 'java',
      caption: 'Path Sum III (prefix map)',
      code: `int dfs(TreeNode node, long cur, int target, Map<Long,Integer> cnt) {
    if (node == null) return 0;
    cur += node.val;
    int ans = cnt.getOrDefault(cur - target, 0);
    cnt.put(cur, cnt.getOrDefault(cur, 0) + 1);
    ans += dfs(node.left, cur, target, cnt);
    ans += dfs(node.right, cur, target, cnt);
    cnt.put(cur, cnt.get(cur) - 1);
    return ans;
}
// start: cnt.put(0L, 1);`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Path Sum II (collect paths)',
      code: `void dfs(TreeNode node, int remain, List<Integer> path, List<List<Integer>> res) {
    if (node == null) return;
    path.add(node.val);
    if (node.left == null && node.right == null && remain == node.val) {
        res.add(new ArrayList<>(path));
    } else {
        dfs(node.left, remain - node.val, path, res);
        dfs(node.right, remain - node.val, path, res);
    }
    path.remove(path.size() - 1);
}`,
    },
  ],
  complexity: {
    best: 'O(n) visit each node once',
    average: 'O(n) for path sum I/III; O(n²) worst paths stored if all root-to-leaf listed',
    worst: 'O(n²) output size for printing all paths on bushy tree',
    space: 'O(h) recursion + path list; O(n) prefix map',
  },
  patternRecognition: [
    'Has path sum / path sum II / III.',
    'Binary tree maximum path sum.',
    'Longest univalue path.',
    'Sum root to leaf numbers (path as digits).',
    'Count good nodes (max on path from root).',
  ],
  commonMistakes: [
    'Path Sum: checking sum at non-leaf nodes when problem requires leaf.',
    'Path Sum III: forgetting prefix 0 count or not backtracking map counts.',
    'Storing path reference instead of new ArrayList copy.',
    'Max path sum: not using max(0, child gain).',
  ],
  tradeoffs: {
    advantages: [
      'Backtracking cleanly enumerates all paths',
      'Prefix map O(n) for any-start downward paths',
      'Gain template unified with diameter',
    ],
    disadvantages: [
      'Path enumeration exponential output',
      'Long paths risk integer overflow—use long',
    ],
    alternatives: ['Iterative DFS with explicit stack frames', 'Morris for inorder path problems rare'],
    whenToUse: ['Root-to-leaf constraints', 'Count paths with target sum anywhere downward', 'Max gain path'],
    whenNotToUse: ['Undirected graph path → not a tree path problem'],
  },
  failureModes: [
    'Negative values in Path Sum III need long prefix sums.',
    'Forgetting backtrack on prefix map causes wrong sibling counts.',
  ],
  interview: {
    expectations: [
      'Leaf vs any node distinction',
      'Backtrack path.remove',
      'Prefix map with put/decrement undo',
    ],
    commonQuestions: [
      'Path Sum',
      'Path Sum II',
      'Path Sum III',
      'Binary Tree Maximum Path Sum',
    ],
    followUps: ['Path from any node to any node allowed?', 'Sum of all root-to-leaf numbers?'],
    misconceptions: ['All path problems start at root'],
    traps: ['Path Sum III: target can be only node value—prefix handles'],
    strongSignals: ['Uses long for prefix sums with negatives'],
  },
  keyTakeaways: [
    'Root-to-leaf: DFS remain + leaf check.',
    'Collect paths: backtrack with list copy at leaf.',
    'Any downward start: prefix map on current root-to-node sum.',
    'Max path sum: diameter-style gain + global best.',
    'Backtrack map counts when unwinding DFS.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Path Sum base case at leaf?',
      answerHint: 'No children and remain equals node.val.',
    },
    {
      level: 'intermediate',
      question: 'Path Sum III prefix map idea?',
      answerHint: 'Count cur-target in map of prefix sums on path from root; add/remove on DFS enter/exit.',
    },
    {
      level: 'advanced',
      question: 'Max path sum vs diameter difference?',
      answerHint: 'Weighted nodes; max(0, child gain); best may be negative single node.',
    },
  ],
  flashcards: [
    {
      front: 'Path Sum II backtrack step',
      back: 'path.remove(path.size()-1) after recursing children.',
    },
    {
      front: 'Path Sum III map init',
      back: 'cnt.put(0L, 1) before DFS for empty prefix.',
    },
  ],
  quickRevision: [
    'Root-to-leaf: remain at leaf',
    'Path II: backtrack + copy list',
    'Path III: prefix map on path',
    'Max sum: gain + global best',
    'Use long for negatives',
    'Backtrack map counts',
    'Leaf-only vs any node clarify',
  ],
}
