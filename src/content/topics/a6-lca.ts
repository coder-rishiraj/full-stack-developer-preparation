import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Lowest Common Ancestor (LCA) of two nodes p and q in a binary tree is the deepest node that has both p and q in its subtrees. Classic O(n) solutions use postorder DFS state propagation or parent-map + set walk.',
  whyExists:
    'LCA models "nearest shared folder" in hierarchies, versioning forks, and DOM bubbling. It underpins distance queries, path compression ideas, and BST variants with ordering exploitation.',
  mentalModel:
    'Walk up from leaves: the first node where left and right searches both report "found" (or one side finds target and other side already did) is the LCA. In BST, split point where p and q fall on different sides is LCA.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Binary tree DFS: if node null or node==p or node==q return node; L=lca(left); R=lca(right).',
        'If both L and R non-null, current is LCA; else return non-null side.',
        'Parent map: BFS/DFS record parent; walk p upward in set until q ancestor hit.',
        'BST: while p.val < root.val < q.val not split—move toward p or q.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'p is ancestor of q',
      text: 'If p is ancestor of q, returning p when node==p is correct—the other side may be null but this node is still LCA.',
    },
  ],
  architecture: {
    mermaid: `flowchart TD
  DFS[Postorder LCA] --> L[LCA left]
  DFS --> R[LCA right]
  L --> Both{both non-null?}
  R --> Both
  Both -->|yes| Here[current node]
  Both -->|no| One[return non-null child]`,
    caption: 'Postorder LCA decision',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Tree [3,5,1,6,2,0,8,null,null,7,4], p=5, q=1 → LCA=3. p=5, q=4 → LCA=5 (5 is ancestor of 4).',
    },
    {
      type: 'table',
      headers: ['tree type', 'method', 'time'],
      rows: [
        ['binary tree', 'postorder DFS', 'O(n)'],
        ['with parent ptr', 'hash set walk', 'O(h) space'],
        ['BST', 'compare values', 'O(h)'],
        ['many queries', 'binary lifting preprocess', 'O(log n) query'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'LCA binary tree (postorder)',
      code: `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    TreeNode L = lowestCommonAncestor(root.left, p, q);
    TreeNode R = lowestCommonAncestor(root.right, p, q);
    if (L != null && R != null) return root;
    return L != null ? L : R;
}`,
    },
    {
      language: 'java',
      caption: 'LCA in BST',
      code: `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    while (root != null) {
        if (p.val < root.val && q.val < root.val) root = root.left;
        else if (p.val > root.val && q.val > root.val) root = root.right;
        else return root;
    }
    return null;
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'LCA with parent map',
      code: `Map<TreeNode, TreeNode> parent = new HashMap<>();
void buildParent(TreeNode node, TreeNode par) {
    if (node == null) return;
    parent.put(node, par);
    buildParent(node.left, node);
    buildParent(node.right, node);
}
public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    buildParent(root, null);
    Set<TreeNode> seen = new HashSet<>();
    for (TreeNode cur = p; cur != null; cur = parent.get(cur)) seen.add(cur);
    for (TreeNode cur = q; cur != null; cur = parent.get(cur))
        if (seen.contains(cur)) return cur;
    return null;
}`,
    },
  ],
  complexity: {
    best: 'O(h) for BST walk',
    average: 'O(n) DFS binary tree',
    worst: 'O(n) visit until LCA found; O(n) parent map build',
    space: 'O(h) recursion; O(n) parent map + set',
  },
  patternRecognition: [
    'Lowest Common Ancestor of Binary Tree/BST.',
    'Distance between two nodes: depth(p)+depth(q)-2*depth(lca).',
    'Smallest subtree containing all nodes in set.',
    'Postorder boolean "found in subtree" variant.',
    'Euler tour + RMQ for offline queries (advanced).',
  ],
  commonMistakes: [
    'Requiring both subtrees non-null when one target is ancestor of other.',
    'BST LCA using node references instead of values when only values given.',
    'Parent map forgetting root has null parent.',
    'Returning null when only one side finds target incorrectly.',
  ],
  tradeoffs: {
    advantages: [
      'Postorder DFS concise 5-line solution',
      'BST O(h) without extra space',
      'Parent map intuitive for follow-up distance',
    ],
    disadvantages: [
      'DFS visits whole subtree in worst case',
      'Parent map O(n) space',
    ],
    alternatives: ['Binary lifting O(log n) query after O(n log n) prep', 'Tarjan offline LCA'],
    whenToUse: ['Two nodes in binary/BST tree', 'Distance via depths', 'Ancestor queries'],
    whenNotToUse: ['General graph without tree root—need different setup'],
  },
  failureModes: [
    'Nodes not in tree—assume valid per LeetCode.',
    'Reference equality vs value equality for TreeNode p,q.',
  ],
  interview: {
    expectations: [
      'Handle ancestor case',
      'BST vs general tree approach',
      'O(n) time state clearly',
    ],
    commonQuestions: [
      'Lowest Common Ancestor of a Binary Tree',
      'Lowest Common Ancestor of a BST',
    ],
    followUps: ['Distance between nodes?', 'LCA of multiple nodes?'],
    misconceptions: ['LCA must be proper ancestor—can be p or q itself'],
    traps: ['Return root when both sides return non-null— that node is LCA'],
    strongSignals: ['Explains p ancestor of q case without extra code'],
  },
  keyTakeaways: [
    'Postorder: if both sides return node, current is LCA.',
    'If root==p or root==q, return root immediately.',
    'BST: first split where p,q on different sides.',
    'Parent map + upward set walk alternative O(h).',
    'Distance = depth(p)+depth(q)-2*depth(lca).',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'When is current node LCA in postorder DFS?',
      answerHint: 'Non-null from both left and right searches.',
    },
    {
      level: 'intermediate',
      question: 'BST LCA without parent pointers?',
      answerHint: 'Walk from root: if both smaller go left, both larger go right, else split at root.',
    },
    {
      level: 'advanced',
      question: 'Distance between p and q?',
      answerHint: 'Find LCA; dist = depth(p)+depth(q)-2*depth(lca) with depth DFS.',
    },
  ],
  flashcards: [
    {
      front: 'LCA postorder base returns',
      back: 'null, or node if node==p or node==q.',
    },
    {
      front: 'BST LCA stop condition',
      back: 'p and q not both on same side of root.val.',
    },
  ],
  quickRevision: [
    'Postorder: L and R non-null → root',
    'p or q hit → return that node',
    'BST: walk toward split',
    'Parent map + hash set up-walk',
    'Ancestor case handled naturally',
    'O(n) binary tree O(h) BST',
    'Dist via depths and LCA',
  ],
}
