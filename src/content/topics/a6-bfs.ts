import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Tree BFS explores a binary tree level by level using a queue—visiting all nodes at depth d before depth d+1. Unlike graph BFS, no visited set is needed because trees have no cycles.',
  whyExists:
    'DFS goes deep first and is awkward for "minimum depth to leaf" or "nodes at distance k." Tree BFS naturally processes layers—right side view, zigzag levels, and width computations all use queue-based level expansion.',
  mentalModel:
    'Ripples from the root: enqueue root, repeatedly dequeue a node and enqueue its children. Each full pass through the current queue size processes one horizontal layer of the tree.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'If root null return; offer root to queue.',
        'While queue not empty: snapshot size = q.size() for one level.',
        'Poll size times: process node, offer non-null left and right.',
        'No visited array—each node enqueued once via tree structure.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Level-size loop',
      text: 'for (int i = 0; i < sz; i++) { poll ... } separates levels without storing depth explicitly—critical for zigzag and minimum depth.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Q[Queue layer] --> Poll[Poll node]
  Poll --> Child[Offer L and R]
  Child --> Q
  Poll --> Next{level done?}
  Next -->|size loop| Q`,
    caption: 'Tree BFS layer expansion',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Tree [3,9,20,null,null,15,7]: level 0 [3], level 1 [9,20], level 2 [15,7]. Minimum depth: first time a dequeued node is leaf, return current level count.',
    },
    {
      type: 'table',
      headers: ['problem', 'BFS why', 'DFS alternative'],
      rows: [
        ['level order', 'natural layers', 'DFS with depth param'],
        ['min depth', 'first leaf is shallowest', 'DFS works but BFS clearer'],
        ['right side view', 'last node per level', 'DFS right-first'],
        ['width max', 'count per level', 'postorder width harder'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Tree BFS level loop',
      code: `Deque<TreeNode> q = new ArrayDeque<>();
if (root != null) q.offer(root);
while (!q.isEmpty()) {
    int sz = q.size();
    for (int i = 0; i < sz; i++) {
        TreeNode cur = q.poll();
        // process cur at this level
        if (cur.left != null) q.offer(cur.left);
        if (cur.right != null) q.offer(cur.right);
    }
}`,
    },
    {
      language: 'java',
      caption: 'Minimum depth (first leaf wins)',
      code: `if (root == null) return 0;
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
return depth;`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Binary Tree Right Side View',
      code: `public List<Integer> rightSideView(TreeNode root) {
    List<Integer> ans = new ArrayList<>();
    if (root == null) return ans;
    Deque<TreeNode> q = new ArrayDeque<>();
    q.offer(root);
    while (!q.isEmpty()) {
        int sz = q.size();
        for (int i = 0; i < sz; i++) {
            TreeNode cur = q.poll();
            if (i == sz - 1) ans.add(cur.val);
            if (cur.left != null) q.offer(cur.left);
            if (cur.right != null) q.offer(cur.right);
        }
    }
    return ans;
}`,
    },
  ],
  complexity: {
    best: 'O(n) each node enqueued once',
    average: 'O(n) time for full traversal',
    worst: 'O(n) time; O(w) queue space w=max width',
    space: 'O(w) queue; no visited set on trees',
  },
  patternRecognition: [
    'Level-order traversal and variants.',
    'Minimum depth to any leaf.',
    'Right/left side view (last/first per level).',
    'Zigzag level order (reverse alternate rows).',
    'Connect nodes at same level (next pointers).',
  ],
  commonMistakes: [
    'Using visited set unnecessarily on trees.',
    'Forgetting null check before enqueue.',
    'Not using level-size loop when problem asks per-level logic.',
    'Minimum depth: returning depth at any node instead of leaf.',
  ],
  tradeoffs: {
    advantages: [
      'Natural layer-by-layer processing',
      'Minimum depth found at first leaf dequeue',
      'No cycle handling needed',
    ],
    disadvantages: [
      'O(w) extra memory on wide trees',
      'Less natural for root-to-leaf path enumeration',
    ],
    alternatives: ['DFS with depth parameter', 'DFS right-first for side view'],
    whenToUse: ['Level properties', 'Shallowest leaf distance', 'Per-level aggregation'],
    whenNotToUse: ['All root-to-leaf paths → DFS backtrack', 'Inorder sorted walk → DFS'],
  },
  failureModes: [
    'Queue grows to O(n) on complete last level—expected.',
    'Zigzag: mutating list vs deque insert direction confusion.',
  ],
  interview: {
    expectations: [
      'ArrayDeque queue',
      'Level-size inner loop',
      'O(n) time O(w) space',
    ],
    commonQuestions: [
      'Binary Tree Level Order Traversal',
      'Minimum Depth of Binary Tree',
      'Binary Tree Right Side View',
      'Average of Levels in Binary Tree',
    ],
    followUps: ['Zigzag without reverse whole list?', 'N-ary tree same template?'],
    misconceptions: ['Tree BFS needs visited array like graph BFS'],
    traps: ['Min depth: single-child node is not a leaf'],
    strongSignals: ['Explains why no visited set on tree', 'Uses sz = q.size() before inner loop'],
  },
  keyTakeaways: [
    'Queue + level-size loop = tree BFS.',
    'No visited set—tree has unique paths.',
    'O(n) time, O(w) max width space.',
    'Min depth: return when leaf dequeued.',
    'Right view: last node in each level iteration.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Tree BFS vs graph BFS difference?',
      answerHint: 'Tree: no visited set, each node once; graph: mark visited on enqueue.',
    },
    {
      level: 'intermediate',
      question: 'Why BFS for minimum depth?',
      answerHint: 'First leaf reached is at minimum depth; DFS may find deep leaf first.',
    },
    {
      level: 'advanced',
      question: 'Connect same-level nodes in O(n) O(1) extra?',
      answerHint: 'BFS with prev pointer per level or iterative linking children before next level.',
    },
  ],
  flashcards: [
    {
      front: 'Tree BFS space complexity',
      back: 'O(w) queue where w is max level width.',
    },
    {
      front: 'Level separation trick',
      back: 'Snapshot int sz = q.size() before polling level.',
    },
  ],
  quickRevision: [
    'Queue FIFO for tree layers',
    'No visited on trees',
    'sz loop per level',
    'O(n) time O(w) space',
    'Min depth: first leaf wins',
    'Right view: last in level loop',
    'Offer only non-null children',
  ],
}
