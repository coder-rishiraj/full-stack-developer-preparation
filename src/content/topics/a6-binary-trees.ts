import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A binary tree is a hierarchical structure where each node has at most two children (left/right). Traversals (pre/in/post/level-order), recursion, and parent pointers underpin most tree interview problems.',
  whyExists:
    'Trees model hierarchical data (DOM, file systems, expressions). Binary restriction simplifies to two-subproblem divide-and-conquer—height, path sums, LCA, and serialization all reduce to local node + left/right answers.',
  mentalModel:
    'Each node is a small decision fork: answer for the subtree rooted here combines my value with whatever the left and right children report. Recursion walks down; results bubble up (or traverse collects globally).',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Define base case: null node returns sentinel (0, true, empty list).',
        'Recursively compute left and right subtree results.',
        'Combine at current node (max path, height, validate BST bounds, etc.).',
        'Choose traversal order: preorder (copy), inorder (BST sorted), postorder (delete/bottom-up).',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Iterative vs recursive',
      text: 'BFS uses queue for level order. DFS uses stack or recursion. Morris traversal gives O(1) space inorder with threaded links (advanced).',
    },
  ],
  architecture: {
    mermaid: `flowchart TD
  N[Node] --> L[Left subtree]
  N --> R[Right subtree]
  L --> BL[Base null]
  R --> BR[Base null]
  L --> Comb[Combine at N]
  R --> Comb
  Comb --> Up[Return to parent]`,
    caption: 'Divide-and-conquer on binary tree',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Max depth of tree [3,9,20,null,null,15,7]: depth(3)=1+max(depth(9),depth(20))=1+max(1,2)=3.',
    },
    {
      type: 'table',
      headers: ['traversal', 'order', 'use'],
      rows: [
        ['preorder', 'N L R', 'copy/serialize prefix'],
        ['inorder', 'L N R', 'BST sorted order'],
        ['postorder', 'L R N', 'delete, height bottom-up'],
        ['level', 'BFS layers', 'zigzag, width'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Recursive DFS template',
      code: `int dfs(TreeNode node) {
    if (node == null) return 0; // base
    int left = dfs(node.left);
    int right = dfs(node.right);
    return combine(node.val, left, right);
}`,
    },
    {
      language: 'java',
      caption: 'Level-order BFS',
      code: `List<List<Integer>> levels = new ArrayList<>();
Deque<TreeNode> q = new ArrayDeque<>();
if (root != null) q.offer(root);
while (!q.isEmpty()) {
    int sz = q.size();
    List<Integer> row = new ArrayList<>();
    for (int i = 0; i < sz; i++) {
        TreeNode cur = q.poll();
        row.add(cur.val);
        if (cur.left != null) q.offer(cur.left);
        if (cur.right != null) q.offer(cur.right);
    }
    levels.add(row);
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Diameter of binary tree',
      code: `int best = 0;
int height(TreeNode node) {
    if (node == null) return 0;
    int L = height(node.left);
    int R = height(node.right);
    best = Math.max(best, L + R);
    return 1 + Math.max(L, R);
}`,
    },
  ],
  complexity: {
    best: 'O(n) visit each node once',
    average: 'O(n) time for traversals',
    worst: 'O(n) time; O(h) recursion stack h=height',
    space: 'O(h) call stack; O(w) BFS queue w=max width',
  },
  patternRecognition: [
    'Subtree property: height, balance, same structure, invert.',
    'Path problems: root-to-leaf, any path sum, diameter.',
    'Level-order / right side view / zigzag.',
    'Serialize/deserialize, construct from traversals.',
    'LCA with parent pointers or postorder state.',
  ],
  commonMistakes: [
    'Confusing global update (diameter) with return value (height).',
    'Not handling null children in path sum / LCA.',
    'O(n²) skewed tree if recomputing height per node naively.',
    'Modifying tree during inorder without clarifying side effects.',
  ],
  variations: [
    'N-ary tree (generalize to children list)',
    'Threaded / Morris O(1) space inorder',
    'Iterative preorder with explicit stack',
    'Two-pointer on tree (flatten to linked list)',
  ],
  tradeoffs: {
    advantages: [
      'Clean recursive structure',
      'O(n) solutions with single pass',
      'Multiple traversal orders for different needs',
    ],
    disadvantages: [
      'Deep skew → O(n) stack overflow risk',
      'Global state in recursion harder to test',
    ],
    alternatives: ['Parent map + hash for LCA with O(1) queries after preprocess', 'Euler tour for subtree queries'],
    whenToUse: ['Hierarchical two-child structure', 'Divide subtree answers', 'Level-by-level processing'],
    whenNotToUse: ['Arbitrary graph cycles without visited set', 'Order-statistics without BST property'],
  },
  failureModes: [
    'Integer overflow on path product sums.',
    'Shared mutable global best not reset between test cases.',
  ],
  interview: {
    expectations: [
      'Draw base case and return semantics',
      'State O(n) time O(h) space',
      'Clarify leaf vs null definition',
    ],
    commonQuestions: [
      'Maximum Depth of Binary Tree',
      'Binary Tree Level Order Traversal',
      'Diameter of Binary Tree',
      'Serialize and Deserialize Binary Tree',
    ],
    followUps: ['Iterative inorder?', 'Morris traversal?'],
    misconceptions: ['Inorder always sorted (only true for BST)'],
    traps: ['Path must go through root vs any path', 'Single-node tree edge cases'],
    strongSignals: ['Separates return value from side-effect global max'],
  },
  keyTakeaways: [
    'Null base case first; combine left/right at node.',
    'O(n) time, O(h) recursion depth.',
    'Inorder sorted only for valid BST.',
    'BFS for levels; DFS for paths/subtrees.',
    'Diameter: track max L+R at each node while returning height.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Three DFS traversal orders?',
      answerHint: 'Preorder NLR, inorder LNR, postorder LRN.',
    },
    {
      level: 'intermediate',
      question: 'Diameter of tree in one pass?',
      answerHint: 'Postorder height; at each node update best with leftHeight+rightHeight.',
    },
    {
      level: 'advanced',
      question: 'Serialize binary tree with null markers?',
      answerHint: 'Preorder with "#" for null; rebuild with queue consuming preorder.',
    },
  ],
  flashcards: [
    {
      front: 'Binary tree traversal complexity',
      back: 'O(n) time, O(h) DFS stack or O(w) BFS queue.',
    },
    {
      front: 'Inorder sorted when?',
      back: 'Valid BST only—not arbitrary binary tree.',
    },
  ],
  quickRevision: [
    'Base null; recurse left/right; combine',
    'O(n) visit each node once',
    'O(h) stack depth skew risk',
    'BFS = level order with queue',
    'Diameter: global max of L+R heights',
    'Inorder sorted ⇒ BST check',
    'Separate return vs side-effect update',
  ],
}
