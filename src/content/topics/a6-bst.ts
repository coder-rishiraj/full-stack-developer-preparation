import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A binary search tree (BST) orders keys so for every node: left subtree keys < node < right subtree keys—enabling O(h) search, insert, and delete where h is height (O(log n) when balanced).',
  whyExists:
    'Sorted array gives O(log n) search but O(n) insert. BST keeps dynamic ordering with local comparisons. Inorder traversal visits keys in sorted order—foundation for successor, floor/ceil, and validation problems.',
  mentalModel:
    'At each node ask: is target smaller (go left) or larger (go right)? Like a decision tree for guessing a number. Invalid if any descendant violates the parent’s open interval (min, max) bound.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Search: compare target to node.val; recurse left/right or return node.',
        'Insert: find null leaf position preserving order; attach new node.',
        'Delete: 0 child remove; 1 child splice; 2 children replace with inorder successor (min of right subtree).',
        'Validate: pass (min, max) bounds down; node must lie strictly inside.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Strict vs duplicate policy',
      text: 'Interview BST usually strict: left < node < right. Duplicates often go right or are disallowed—state your rule.',
    },
  ],
  architecture: {
    mermaid: `flowchart TD
  Root[Node val] --> L[Left < val]
  Root --> R[Right > val]
  L --> LS[Search left if target smaller]
  R --> RS[Search right if target larger]`,
    caption: 'BST search decision',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Search 5 in BST rooted at 8: 5<8 go left to 3; 5>3 go right to 6; 5<6 go left to 5 found.',
    },
    {
      type: 'table',
      headers: ['operation', 'avg balanced', 'skewed worst'],
      rows: [
        ['search', 'O(log n)', 'O(n)'],
        ['insert', 'O(log n)', 'O(n)'],
        ['delete', 'O(log n)', 'O(n)'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'BST search',
      code: `TreeNode search(TreeNode root, int target) {
    TreeNode cur = root;
    while (cur != null) {
        if (target == cur.val) return cur;
        cur = target < cur.val ? cur.left : cur.right;
    }
    return null;
}`,
    },
    {
      language: 'java',
      caption: 'Validate BST with bounds',
      code: `boolean valid(TreeNode node, long min, long max) {
    if (node == null) return true;
    if (node.val <= min || node.val >= max) return false;
    return valid(node.left, min, node.val)
        && valid(node.right, node.val, max);
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Kth smallest (inorder)',
      code: `int kthSmallest(TreeNode root, int k) {
    Deque<TreeNode> st = new ArrayDeque<>();
    TreeNode cur = root;
    while (cur != null || !st.isEmpty()) {
        while (cur != null) { st.push(cur); cur = cur.left; }
        cur = st.pop();
        if (--k == 0) return cur.val;
        cur = cur.right;
    }
    return -1;
}`,
    },
  ],
  complexity: {
    best: 'O(log n) when balanced',
    average: 'O(log n) for random insert order',
    worst: 'O(n) height for sorted insert into naive BST',
    space: 'O(h) recursion/stack; O(1) iterative search',
  },
  patternRecognition: [
    'Inorder = sorted sequence.',
    'Range queries with BST property pruning.',
    'Validate BST with min/max—not just compare to parent.',
    'Successor/predecessor via inorder or rightmost-left chains.',
    'Convert sorted array to balanced BST (mid as root).',
  ],
  commonMistakes: [
    'Validate BST comparing only to parent (misses cross-branch violations).',
    'Using int min/max without long → Integer.MIN_VALUE edge failure.',
    'Delete two-child node: wrong successor (must be min of right subtree).',
    'Assuming O(log n) without balance (sorted input → linked list).',
  ],
  variations: [
    'Self-balancing AVL/Red-Black (conceptual in system design)',
    'BST iterator with controlled inorder',
    'Merge two BSTs to sorted list/doubly linked list',
    'Floor/ceil in BST',
  ],
  tradeoffs: {
    advantages: [
      'Dynamic sorted structure',
      'Simple search/insert code',
      'Inorder yields sorted order',
    ],
    disadvantages: [
      'Unbalanced degrades to O(n)',
      'No O(1) min/max without extra pointers',
    ],
    alternatives: ['Hash map O(1) key lookup unsorted', 'Sorted array + BS for static', 'TreeMap (Red-Black) in Java'],
    whenToUse: ['Dynamic ordering', 'Inorder successor', 'Range BST prune'],
    whenNotToUse: ['Need guaranteed O(log n) without balance', 'Only static sorted data'],
  },
  failureModes: [
    'Integer bounds bug in validation with node.val = Integer.MIN_VALUE.',
    'Mutating BST during traversal invalidates iterators.',
  ],
  interview: {
    expectations: [
      'Iterative or recursive search',
      'Bound-based validation',
      'Inorder for kth smallest',
    ],
    commonQuestions: [
      'Validate Binary Search Tree',
      'Kth Smallest Element in a BST',
      'Lowest Common Ancestor of BST',
      'Convert Sorted Array to Binary Search Tree',
    ],
    followUps: ['Delete node with two children?', 'Why long bounds?'],
    misconceptions: ['Parent comparison alone validates BST'],
    traps: ['Duplicate values placement', 'LCA in BST uses BST property not generic LCA'],
    strongSignals: ['Uses (min,max) with long; mentions balance for O(log n)'],
  },
  keyTakeaways: [
    'Left < node < right at every node.',
    'Validate with open interval bounds, not parent only.',
    'Inorder traversal = ascending keys.',
    'O(h) ops; h=log n if balanced, n if skewed.',
    'Kth smallest = inorder stop at k.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'BST search procedure?',
      answerHint: 'Compare target; go left if smaller else right; null if missing.',
    },
    {
      level: 'intermediate',
      question: 'Why validate with min/max instead of parent check?',
      answerHint: 'Child must be less than all ancestors on right path—not only parent.',
    },
    {
      level: 'advanced',
      question: 'LCA in BST vs general binary tree?',
      answerHint: 'BST: if both smaller go left, both larger go right, else split at current node.',
    },
  ],
  flashcards: [
    {
      front: 'BST validation bounds init',
      back: 'valid(root, Long.MIN_VALUE, Long.MAX_VALUE).',
    },
    {
      front: 'Kth smallest BST',
      back: 'Inorder; decrement k; return when k==0.',
    },
  ],
  quickRevision: [
    'Left < root < right everywhere',
    'Validate with (min,max) long bounds',
    'Inorder = sorted order',
    'O(h) search insert delete',
    'Skewed BST → O(n) height',
    'Kth smallest = inorder k',
    'LCA BST uses ordering prune',
  ],
}
