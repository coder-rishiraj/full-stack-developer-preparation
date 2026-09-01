import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Tree DP computes optimal values on trees by post-order aggregation: each node returns a summary of its subtree (max path, rob/not-rob profit, diameter contribution) while combining results from all children before processing the parent.',
  whyExists:
    'Linear DP fails on hierarchical dependencies. Tree structure guarantees no cycles—post-order DFS gives O(n) solutions for House Robber III, binary tree diameter, max path sum, and prune/serialize decisions.',
  mentalModel:
    'Ask each subtree root: "What can you report to your parent?" Return a small tuple (e.g. rob this node vs skip, best path through node). Parent merges child reports—never double-count across branches incorrectly.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Post-order DFS: process all children, then compute node value from child returns.',
        'House Robber III: return [rob, notRob]; rob = val + sum(child notRob); notRob = sum(max(rob, notRob) per child).',
        'Diameter: for each node, best path down = 1 + max(leftDepth, rightDepth); update global ans with leftDepth+rightDepth.',
        'Max path sum: return max(0, bestDown) to parent; ans max of left+right+val at node.',
        'General: O(n) one visit; state size constant per node.',
        'N-ary: loop all children same as binary extension.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Rob tree [3,2,3,null,3,null,1]: node 3 leaf rob=3/skip=0; node 2 with child 3 rob=3 skip=3; root rob=3+3+1=7 vs skip max per child → answer 7.',
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'House Robber III',
      code: `int rob(TreeNode root) {
    int[] res = dfs(root);
    return Math.max(res[0], res[1]);
}
int[] dfs(TreeNode node) {
    if (node == null) return new int[]{0, 0};
    int[] L = dfs(node.left), R = dfs(node.right);
    int rob = node.val + L[1] + R[1];
    int notRob = Math.max(L[0], L[1]) + Math.max(R[0], R[1]);
    return new int[]{rob, notRob};
}`,
    },
    {
      language: 'java',
      caption: 'Binary tree diameter (longest path edges)',
      code: `int diameter = 0;
int depth(TreeNode node) {
    if (node == null) return 0;
    int L = depth(node.left), R = depth(node.right);
    diameter = Math.max(diameter, L + R);
    return 1 + Math.max(L, R);
}
// call depth(root); return diameter;`,
    },
    {
      language: 'java',
      caption: 'Max path sum (any node start/end)',
      code: `int best = Integer.MIN_VALUE;
int gain(TreeNode node) {
    if (node == null) return 0;
    int L = Math.max(0, gain(node.left));
    int R = Math.max(0, gain(node.right));
    best = Math.max(best, node.val + L + R);
    return node.val + Math.max(L, R);
}`,
    },
  ],
  complexity: {
    average: 'O(n) visit each node once',
    space: 'O(h) recursion stack height',
  },
  patternRecognition: [
    'House Robber III.',
    'Binary Tree Maximum Path Sum.',
    'Diameter of Binary Tree.',
    'Any subtree aggregate with parent-child constraint.',
  ],
  commonMistakes: [
    'Pre-order before child results known.',
    'Diameter counts edges vs nodes—off by one.',
    'Max path sum: return negative gain clamped to 0 for parent.',
    'Double-counting node in rob and child rob paths.',
  ],
  tradeoffs: {
    advantages: [
      'O(n) natural on trees',
      'Small per-node state (2-3 ints)',
      'Unified post-order template',
    ],
    disadvantages: [
      'Recursion depth on skewed tree',
      'State design varies per problem',
      'Harder to iterate without explicit stack',
    ],
    alternatives: ['BFS rarely for tree DP', 'Memo on graph if shared subtrees (DAG)'],
    whenToUse: ['Tree optimization with local-global split', 'Path through node problems', 'Include/exclude child subtree'],
    whenNotToUse: ['General graph cycles', 'Grid DP without tree structure'],
  },
  failureModes: [
    'Null root not base-cased.',
    'Global ans not updated at every node (diameter, max path).',
    'Stack overflow deep skew—iterative post-order.',
  ],
  interview: {
    expectations: [
      'Post-order return tuple to parent',
      'House Robber III [rob, notRob]',
      'Diameter update at each node',
    ],
    commonQuestions: ['House Robber III', 'Binary Tree Maximum Path Sum', 'Diameter of Binary Tree'],
    followUps: ['N-ary version?', 'Iterative?', 'Why post-order?'],
    misconceptions: ['Greedy on tree levels', 'Return global max from recursive gain directly for path sum', 'Diameter = height'],
    traps: ['Max path sum negative nodes—still pick max single node', 'Confuse path sum with root-to-leaf only'],
    strongSignals: ['Clear child→parent contract', 'O(n) argument', 'Separates return-to-parent vs global ans'],
  },
  keyTakeaways: [
    'Post-order: children first, then combine at node.',
    'Return compact summary; parent never re-walks subtree.',
    'House Robber: rob includes notRob from all children.',
    'Diameter: L+R through node vs global max.',
    'Max path sum: gain clamped 0 upward to parent.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why post-order for tree DP?', answerHint: 'Need optimal answers from entire subtrees before deciding at parent.' },
    { level: 'intermediate', question: 'House Robber III recurrence?', answerHint: 'rob=val+sum(child notRob); notRob=sum(max(rob,notRob) each child).' },
    { level: 'advanced', question: 'Max path sum return value meaning?', answerHint: 'Max gain of downward path from node to some descendant (or 0 if negative)—used by parent; global ans checks through-node path.' },
  ],
  flashcards: [
    { front: 'Tree DP traversal order', back: 'Post-order DFS (children before parent).' },
    { front: 'House Robber III return', back: '[rob subtree root, not rob subtree root].' },
    { front: 'Diameter update at node', back: 'ans = max(ans, leftDepth + rightDepth).' },
  ],
  quickRevision: [
    'Post-order child reports',
    'Rob: val + child notRob',
    'Diameter: L+R at node',
    'Path sum: gain max(0,...)',
    'O(n) one visit',
    'Global ans separate',
    'N-ary: loop children',
  ],
}
