import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'An N-ary tree is a rooted tree where each node has at most N children, stored typically as List<Node> children rather than left/right pointers. Traversals extend binary tree DFS/BFS; serialization uses level-order with null markers or child-count encoding.',
  whyExists:
    'File systems, org charts, DOM trees, and trie-like structures are naturally N-ary. Interviews test BFS level order, max depth, encode/decode, and post-order aggregation on arbitrary fan-out.',
  mentalModel:
    'Binary tree with a list of kids instead of two slots—same recursion patterns but loop over children. BFS with queue is often cleaner than DFS for level-by-level work.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Node: val + List<Node> children (or array size N for fixed arity).',
        'Preorder: visit node, recurse each child left-to-right.',
        'Postorder: recurse all children, then visit node (subtree sums, delete tree).',
        'BFS level order: queue of nodes, process size = current level width.',
        'Max depth: 1 + max depth of children (empty tree depth 0).',
        'Encode: "val,childCount" DFS or LeetCode level-order with null after each node children list.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Root 1 with children [3,2,4], node 3 has children [5,6]: level order BFS → [1,3,2,4,5,6]. Max depth = 3.',
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'N-ary node and max depth',
      code: `class Node {
    int val;
    List<Node> children;
    Node(int v) { val = v; children = new ArrayList<>(); }
}
int maxDepth(Node root) {
    if (root == null) return 0;
    int best = 0;
    for (Node c : root.children)
        best = Math.max(best, maxDepth(c));
    return 1 + best;
}`,
    },
    {
      language: 'java',
      caption: 'Level-order traversal (BFS)',
      code: `List<List<Integer>> levelOrder(Node root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    Queue<Node> q = new ArrayDeque<>();
    q.offer(root);
    while (!q.isEmpty()) {
        int sz = q.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < sz; i++) {
            Node cur = q.poll();
            level.add(cur.val);
            for (Node c : cur.children) q.offer(c);
        }
        res.add(level);
    }
    return res;
}`,
    },
    {
      language: 'java',
      caption: 'Encode / decode (child count DFS)',
      code: `String encode(Node root) {
    if (root == null) return "";
    StringBuilder sb = new StringBuilder();
    dfsEnc(root, sb);
    return sb.toString();
}
void dfsEnc(Node node, StringBuilder sb) {
    sb.append(node.val).append(",");
    sb.append(node.children.size()).append(",");
    for (Node c : node.children) dfsEnc(c, sb);
}
Node decode(String data) {
    String[] tok = data.split(",");
    int[] i = {0};
    return dfsDec(tok, i);
}
Node dfsDec(String[] tok, int[] i) {
    int val = Integer.parseInt(tok[i[0]++]);
    int cnt = Integer.parseInt(tok[i[0]++]);
    Node node = new Node(val);
    for (int k = 0; k < cnt; k++)
        node.children.add(dfsDec(tok, i));
    return node;
}`,
    },
  ],
  complexity: {
    average: 'O(n) visit each node once for traversals',
    space: 'O(n) queue BFS worst skew; O(h) DFS stack',
  },
  patternRecognition: [
    'N-ary Tree Level Order Traversal.',
    'Serialize and Deserialize N-ary Tree.',
    'Max Depth of N-ary Tree.',
    'Replace Node with Sum of children (postorder).',
  ],
  commonMistakes: [
    'Treating as binary—only left/right misses children.',
    'BFS without fixed level size processes next level in same batch.',
    'Encode/decode off-by-one on child count tokens.',
    'Null root vs empty children list confusion.',
  ],
  tradeoffs: {
    advantages: [
      'Models real hierarchical data naturally',
      'BFS level order straightforward with queue',
      'Same DFS patterns as binary with child loop',
    ],
    disadvantages: [
      'More pointer overhead than binary for same nodes',
      'No inorder analogue for sorted property',
      'Serialization less standardized than binary',
    ],
    alternatives: ['First-child/next-sibling binary representation', 'Adjacency list in graph form'],
    whenToUse: ['Variable fan-out hierarchies', 'Level-order processing', 'Org/file tree problems'],
    whenNotToUse: ['Strict binary BST property needed', 'When left/right semantics matter (inorder)'],
  },
  failureModes: [
    'Stack overflow on deep skewed N-ary tree in recursive DFS.',
    'Decode token stream misaligned → wrong tree shape.',
    'Forgetting null root guard.',
  ],
  interview: {
    expectations: [
      'Node with List<Node> children',
      'BFS level order with queue size snapshot',
      'Encode/decode with child count or level nulls',
    ],
    commonQuestions: ['N-ary Tree Level Order', 'Max Depth', 'Serialize N-ary Tree'],
    followUps: ['Convert to binary tree?', 'Iterative postorder?', 'Diameter on N-ary?'],
    misconceptions: ['Must use ternary or fixed N only', 'Same inorder as binary', 'DFS always preferred over BFS for levels'],
    traps: ['Level BFS without sz = q.size()', 'Child count encoding vs null sentinel encoding mixed up'],
    strongSignals: ['Clean child loop abstraction', 'Both DFS encode and BFS level templates', 'Mentions first-child/next-sibling trick'],
  },
  keyTakeaways: [
    'children list instead of left/right.',
    'BFS: queue + process level size at a time.',
    'Postorder: aggregate from all children first.',
    'Encode: val + childCount + recursive children.',
    'O(n) time for all standard traversals.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'How store N-ary tree node in Java?', answerHint: 'int val + List<Node> children (or fixed array).' },
    { level: 'intermediate', question: 'Level-order without size variable?', answerHint: 'Snapshot q.size() each outer loop iteration—that is current level width.' },
    { level: 'advanced', question: 'Represent N-ary as binary?', answerHint: 'First-child/next-sibling: left = first child, right = next sibling.' },
  ],
  flashcards: [
    { front: 'N-ary node structure', back: 'val + List<Node> children.' },
    { front: 'Level-order BFS key', back: 'Process q.size() nodes per level batch.' },
    { front: 'Max depth recurrence', back: '1 + max(depth(child)) over all children.' },
  ],
  quickRevision: [
    'List<Node> children',
    'BFS level: snapshot queue size',
    'Postorder: children then node',
    'Encode val,childCount,subtrees',
    'O(n) all traversals',
    'First-child/next-sibling binary trick',
    'Null root guard',
  ],
}
