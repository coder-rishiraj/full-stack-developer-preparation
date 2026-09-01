import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Tree height is the number of edges (or nodes, clarify!) on the longest root-to-leaf path; depth of a node is its distance from the root. Both are computed in O(n) via DFS postorder (height) or BFS level count (depth).',
  whyExists:
    'Height bounds recursion stack O(h), determines balance, and feeds diameter/LCA/balance checks. Depth identifies level-based problems and whether a node is a leaf at minimum depth.',
  mentalModel:
    'Height grows upward from leaves: null is 0, each parent is 1 + max(child heights). Depth grows downward from root: root depth 0, child depth = parent + 1. Clarify edge vs node count in interviews.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Max height DFS: return 0 if null else 1 + max(height(L), height(R)).',
        'Min depth BFS: first leaf dequeued gives minimum depth in edges+1.',
        'Node depth: pass depth parameter in DFS preorder or derive from BFS level index.',
        'Balanced tree: |height(L)−height(R)| ≤ 1 at every node—postorder with early exit.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Edges vs nodes',
      text: 'LeetCode max depth counts nodes along path (null → 0, single node → 1). Some textbooks count edges (single node height 0). State your definition upfront.',
    },
  ],
  architecture: {
    mermaid: `flowchart BT
  Null[null h=0] --> L[Left h]
  Null --> R[Right h]
  L --> N[node h=1+max]
  R --> N`,
    caption: 'Bottom-up height aggregation',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Tree [3,9,20,null,null,15,7]: max depth = 3 nodes (root→20→15). Depth of 15 = 2 (0-indexed from root). Height of leaf 9 = 1.',
    },
    {
      type: 'table',
      headers: ['metric', 'definition', 'compute'],
      rows: [
        ['height(node)', 'longest down path', 'postorder DFS'],
        ['depth(node)', 'distance from root', 'BFS level or DFS param'],
        ['min depth', 'shortest to leaf', 'BFS first leaf'],
        ['balanced', '|hL-hR|≤1 all nodes', 'postorder + prune'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Maximum depth (height in nodes)',
      code: `int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    },
    {
      language: 'java',
      caption: 'Balanced binary tree check',
      code: `int height(TreeNode node) {
    if (node == null) return 0;
    int L = height(node.left);
    if (L == -1) return -1;
    int R = height(node.right);
    if (R == -1) return -1;
    if (Math.abs(L - R) > 1) return -1;
    return 1 + Math.max(L, R);
}
// balanced if height(root) != -1`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Minimum depth (BFS)',
      code: `public int minDepth(TreeNode root) {
    if (root == null) return 0;
    Deque<TreeNode> q = new ArrayDeque<>();
    q.offer(root);
    int depth = 1;
    while (!q.isEmpty()) {
        int sz = q.size();
        for (int i = 0; i < sz; i++) {
            TreeNode cur = q.poll();
            if (cur.left == null && cur.right == null) return depth;
            if (cur.left != null) q.offer(cur.left);
            if (cur.right != null) q.offer(cur.right);
        }
        depth++;
    }
    return depth;
}`,
    },
  ],
  complexity: {
    best: 'O(n) visit each node once',
    average: 'O(n) for height/depth/balance',
    worst: 'O(n) time; O(h) recursion stack',
    space: 'O(h) DFS stack; O(w) BFS for min depth',
  },
  patternRecognition: [
    'Maximum/minimum depth of binary tree.',
    'Check balanced binary tree.',
    'Depth of node queries after preprocessing.',
    'Height used inside diameter/AVL logic.',
    'Path length vs node count in definition.',
  ],
  commonMistakes: [
    'Min depth DFS: returning 1 + min(L,R) when one child null (must go through existing child).',
    'Confusing height and depth direction.',
    'Edge vs node counting off-by-one.',
    'O(n²) balance check recomputing height per node naively.',
  ],
  tradeoffs: {
    advantages: [
      'Simple recursive height in 3 lines',
      'BFS gives min depth without deep-first trap',
      'Balance check O(n) with sentinel -1 prune',
    ],
    disadvantages: [
      'Skewed tree O(n) stack depth',
      'Definition ambiguity causes wrong answers',
    ],
    alternatives: ['Iterative DFS with stack frame depth', 'Parent map BFS for all depths'],
    whenToUse: ['Depth/height as subroutine', 'Balance validation', 'Stack space estimation O(h)'],
    whenNotToUse: ['Need only level list → level-order topic'],
  },
  failureModes: [
    'Min depth DFS wrong on skewed tree with one child chain.',
    'Integer height overflow on theoretical huge trees (rare).',
  ],
  interview: {
    expectations: [
      'Clarify edge vs node definition',
      'O(n) single pass for balance',
      'Min depth prefers BFS or careful DFS',
    ],
    commonQuestions: [
      'Maximum Depth of Binary Tree',
      'Minimum Depth of Binary Tree',
      'Balanced Binary Tree',
    ],
    followUps: ['Iterative max depth?', 'Store depth for all nodes?'],
    misconceptions: ['Min depth = 1 + min(left,right) always—wrong if child missing'],
    traps: ['Single node tree depth/height = 1 in LeetCode node counting'],
    strongSignals: ['Min depth BFS or DFS checks leaf before combining children'],
  },
  keyTakeaways: [
    'Height postorder: 1+max(L,R); null→0.',
    'Depth preorder/BFS: root=0, child=parent+1.',
    'Min depth: BFS first leaf or DFS leaf check.',
    'Balance: |hL-hR|≤1; return -1 sentinel to prune.',
    'Clarify nodes vs edges in interview.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Max depth recursive relation?',
      answerHint: '0 if null; else 1 + max(depth left, depth right).',
    },
    {
      level: 'intermediate',
      question: 'Why DFS min depth can fail?',
      answerHint: 'min(null, deep) ignores missing child—must recurse into non-null or use BFS.',
    },
    {
      level: 'advanced',
      question: 'O(n) balanced check without recomputing height?',
      answerHint: 'Postorder return -1 if unbalanced subtree; propagate failure up.',
    },
  ],
  flashcards: [
    {
      front: 'LeetCode max depth base case',
      back: 'null → 0; single node tree depth 1.',
    },
    {
      front: 'Min depth safe approach',
      back: 'BFS until first leaf, or DFS only recurse non-null child before min.',
    },
  ],
  quickRevision: [
    'Height: bottom-up postorder',
    'Depth: top-down or BFS level',
    'Min depth: BFS first leaf',
    'Balance: |hL-hR|≤1, -1 prune',
    'O(n) time O(h) space',
    'Clarify edges vs nodes',
    'DFS min depth child-null trap',
  ],
}
