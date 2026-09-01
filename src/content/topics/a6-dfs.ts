import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Tree DFS (depth-first search) visits nodes by going deep along one branch before backtracking—implemented recursively (pre/in/postorder) or iteratively with an explicit stack. It is the default for path, subtree, and structural tree problems.',
  whyExists:
    'Most tree properties are local combinations of left and right subtree answers. DFS naturally expresses divide-and-conquer on binary trees; recursion mirrors the tree structure and keeps code short in interviews.',
  mentalModel:
    'Walk down a path until you hit null, then unwind back up passing answers to the parent. Preorder processes node before children; postorder after; inorder between left and right (sorted for BST).',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Base case: if node == null return sentinel (0, true, empty list).',
        'Recurse left and right; combine at current node.',
        'Preorder: process node, then left, then right (copy/serialize).',
        'Iterative: push node; pop, process, push right then left (stack LIFO).',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Return vs side effect',
      text: 'Return height to parent but update global max diameter in the same function—separate what bubbles up from what you track globally.',
    },
  ],
  architecture: {
    mermaid: `flowchart TD
  N[Visit node] --> L[DFS left]
  L --> R[DFS right]
  R --> Comb[Combine results]
  Comb --> Ret[Return to parent]`,
    caption: 'Recursive DFS on binary tree',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Preorder on [1,null,2,3]: visit 1, skip null left, visit 2, visit 3 → [1,2,3]. Max depth: return 1+max(dfs(L),dfs(R)); null returns 0.',
    },
    {
      type: 'table',
      headers: ['order', 'sequence', 'typical use'],
      rows: [
        ['preorder', 'N L R', 'serialize, copy tree'],
        ['inorder', 'L N R', 'BST sorted output'],
        ['postorder', 'L R N', 'delete, bottom-up height'],
        ['iterative pre', 'stack N→R→L', 'avoid recursion limit'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Recursive DFS template',
      code: `int dfs(TreeNode node) {
    if (node == null) return 0;
    int left = dfs(node.left);
    int right = dfs(node.right);
    // optional: update global from left/right
    return combine(node.val, left, right);
}`,
    },
    {
      language: 'java',
      caption: 'Iterative preorder',
      code: `List<Integer> ans = new ArrayList<>();
Deque<TreeNode> st = new ArrayDeque<>();
if (root != null) st.push(root);
while (!st.isEmpty()) {
    TreeNode cur = st.pop();
    ans.add(cur.val);
    if (cur.right != null) st.push(cur.right);
    if (cur.left != null) st.push(cur.left);
}
return ans;`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Path sum II (DFS + backtrack)',
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
    average: 'O(n) time for full traversal',
    worst: 'O(n) time; O(h) recursion stack h=height',
    space: 'O(h) call stack; O(n) output if collecting all paths',
  },
  patternRecognition: [
    'Subtree aggregate: max depth, sum, count nodes.',
    'Path from root to leaf with backtracking.',
    'Validate BST with min/max bounds passed down.',
    'Same tree / invert / mirror symmetry.',
    'Serialize preorder with null markers.',
  ],
  commonMistakes: [
    'Confusing global side-effect update with return value.',
    'Inorder iterative without proper stack state (harder than preorder).',
    'Not backtracking path list after recursive calls.',
    'Stack overflow on skewed tree—mention iterative alternative.',
  ],
  tradeoffs: {
    advantages: [
      'Natural recursive structure matches tree',
      'O(n) single visit solutions',
      'Flexible traversal orders',
    ],
    disadvantages: [
      'Deep skew O(n) stack overflow risk',
      'Global mutable state harder to reason about',
    ],
    alternatives: ['BFS for level problems', 'Morris O(1) space inorder', 'Parent pointers + hash for some queries'],
    whenToUse: ['Path/subtree properties', 'Pre/post/inorder needs', 'Backtracking on tree'],
    whenNotToUse: ['Minimum depth by levels → BFS', 'Level-by-level output → BFS'],
  },
  failureModes: [
    'Integer overflow on path product sums.',
    'Forgetting to clone path when storing in result list.',
  ],
  interview: {
    expectations: [
      'Null base case first',
      'State O(n) time O(h) space',
      'Name traversal order used',
    ],
    commonQuestions: [
      'Binary Tree Preorder Traversal',
      'Maximum Depth of Binary Tree',
      'Path Sum II',
      'Validate Binary Search Tree',
    ],
    followUps: ['Iterative inorder?', 'Morris traversal O(1) space?'],
    misconceptions: ['DFS always preorder—clarify order needed'],
    traps: ['Path sum: leaf-only vs any node start', 'BST validate: use long bounds not int'],
    strongSignals: ['Backtrack path.remove after recursion', 'Separates return height vs global diameter'],
  },
  keyTakeaways: [
    'Null base; recurse L/R; combine at node.',
    'Preorder NLR, inorder LNR, postorder LRN.',
    'O(n) time, O(h) stack space.',
    'Backtrack path lists for all root-to-leaf paths.',
    'Iterative preorder: stack, push right before left.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Three DFS orders and one use each?',
      answerHint: 'Pre: copy; In: BST sort; Post: bottom-up height/delete.',
    },
    {
      level: 'intermediate',
      question: 'Validate BST during DFS?',
      answerHint: 'Pass (min,max) bounds; node must be in (min,max); recurse with updated bounds.',
    },
    {
      level: 'advanced',
      question: 'Iterative inorder without recursion?',
      answerHint: 'Stack: go left pushing nodes; pop, visit, cur=cur.right.',
    },
  ],
  flashcards: [
    {
      front: 'Tree DFS time/space',
      back: 'O(n) time; O(h) recursion stack.',
    },
    {
      front: 'Iterative preorder push order',
      back: 'Push right then left so left processed first.',
    },
  ],
  quickRevision: [
    'Base null; dfs(L); dfs(R); combine',
    'O(n) visit once',
    'O(h) stack skew risk',
    'Pre/In/Post order names',
    'Backtrack for path lists',
    'Global vs return value split',
    'Iterative pre: stack R then L',
  ],
}
