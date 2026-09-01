import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Tree construction rebuilds a binary tree from traversal orders—classically inorder + preorder or inorder + postorder—or from a level-order array with parent indexing. Unique structure requires knowing which traversal pair is given.',
  whyExists:
    'Serialization round-trips, parsing expressions into trees, and verifying reconstruction from API payloads all need deterministic build rules. Inorder locates roots in sorted BST segments; preorder/postorder supply root ordering.',
  mentalModel:
    'First element of preorder (or last of postorder) is the root. Find that value in inorder to split left/right subtrees; recurse on index ranges without copying arrays when using pointers.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Preorder+inorder: root=pre[preStart]; find root in inorder → left size = idx-inStart; recurse ranges.',
        'Postorder+inorder: root=post[postEnd]; same inorder split; recurse post ranges from end.',
        'Heap array: node i has children 2i+1, 2i+2 (0-indexed complete tree).',
        'Duplicate values break uniqueness—assume distinct keys in interviews.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Hash map inorder index',
      text: 'Build val→index map for inorder once O(n)—avoid O(n) linear search per recursion level.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Pre[Preorder root] --> Split[Find in inorder]
  Split --> L[Left subarrays]
  Split --> R[Right subarrays]
  L --> Rec[Recurse build]
  R --> Rec`,
    caption: 'Construct from pre + in',
  },
  example: [
    {
      type: 'paragraph',
      text: 'preorder [3,9,20,15,7], inorder [9,3,15,20,7]: root 3 splits inorder → left [9], right [15,20,7]; pre left [9], pre right [20,15,7]... build 9 leaf and subtree 20.',
    },
    {
      type: 'table',
      headers: ['input pair', 'root pick', 'split by'],
      rows: [
        ['pre + in', 'pre leftmost unused', 'inorder root index'],
        ['post + in', 'post rightmost unused', 'inorder root index'],
        ['level array', 'implicit parent index', '2i+1, 2i+2'],
        ['BST from preorder', 'first > bound stops left', 'BST bounds'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Build from preorder + inorder',
      code: `Map<Integer, Integer> idx = new HashMap<>();
int[] pre, in;
int preIdx = 0;

TreeNode build(int inLo, int inHi) {
    if (inLo > inHi) return null;
    int rootVal = pre[preIdx++];
    TreeNode root = new TreeNode(rootVal);
    int mid = idx.get(rootVal);
    root.left = build(inLo, mid - 1);
    root.right = build(mid + 1, inHi);
    return root;
}
// init: for i map in[i]; build(0, n-1);`,
    },
    {
      language: 'java',
      caption: 'Construct BST from preorder',
      code: `int i = 0;
TreeNode bst(int[] pre, int bound) {
    if (i == pre.length || pre[i] > bound) return null;
    TreeNode root = new TreeNode(pre[i++]);
    root.left = bst(pre, root.val);
    root.right = bst(pre, bound);
    return root;
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Build from postorder + inorder',
      code: `int postIdx = n - 1;
TreeNode buildPost(int inLo, int inHi) {
    if (inLo > inHi) return null;
    int rootVal = post[postIdx--];
    TreeNode root = new TreeNode(rootVal);
    int mid = idx.get(rootVal);
    root.right = buildPost(mid + 1, inHi);
    root.left = buildPost(inLo, mid - 1);
    return root;
}`,
    },
  ],
  complexity: {
    best: 'O(n) each node built once with hash map',
    average: 'O(n) time',
    worst: 'O(n²) if linear search inorder each step without map',
    space: 'O(n) map + O(h) recursion stack',
  },
  patternRecognition: [
    'Construct Binary Tree from Preorder and Inorder Traversal.',
    'Construct from Postorder and Inorder.',
    'Construct BST from Preorder.',
    'Convert sorted array to balanced BST (mid as root).',
    'Recover BST from inorder with two swapped nodes (not construction but related).',
  ],
  commonMistakes: [
    'Off-by-one in inorder subarray bounds (mid-1, mid+1).',
    'Preorder index global increment order wrong when building right before left in postorder variant.',
    'Assuming unique tree when duplicates exist in inorder.',
    'Copying subarrays each call instead of index ranges (TLE).',
  ],
  tradeoffs: {
    advantages: [
      'Index ranges O(n) total with hash map',
      'Clear recursive structure',
      'BST preorder construction O(n) with bound',
    ],
    disadvantages: [
      'Requires two traversals or special form',
      'Not unique without inorder or BST property',
    ],
    alternatives: ['Serialize preorder with nulls then deserialize', 'Union of traversals insufficient alone'],
    whenToUse: ['Given pre+in or post+in', 'Sorted array → balanced BST', 'BST from preorder'],
    whenNotToUse: ['Only preorder without null markers on general tree'],
  },
  failureModes: [
    'Skewed recursion depth O(n) on sorted input if building unbalanced from sorted array without mid pivot.',
    'Wrong subtree sizes if inorder root not found (duplicate keys).',
  ],
  interview: {
    expectations: [
      'Hash map for inorder indices',
      'O(n) index ranges not subarray copies',
      'State uniqueness assumption',
    ],
    commonQuestions: [
      'Construct Binary Tree from Preorder and Inorder Traversal',
      'Construct Binary Tree from Inorder and Postorder Traversal',
      'Construct Binary Search Tree from Preorder Traversal',
    ],
    followUps: ['Serialize then deserialize instead?', 'Balanced from sorted array?'],
    misconceptions: ['Any two traversals always sufficient—need inorder or null markers'],
    traps: ['Postorder: build right subtree before left when using decreasing postIdx'],
    strongSignals: ['Uses global preIdx/postIdx pointer correctly'],
  },
  keyTakeaways: [
    'Pre root first; post root last; split inorder at root.',
    'Hash map val→inorder index for O(n).',
    'Recurse on index ranges, never copy arrays.',
    'BST preorder: recurse with upper bound.',
    'Sorted array BST: mid element as root for balance.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why need inorder with preorder?',
      answerHint: 'Preorder gives root order; inorder splits left/right segments.',
    },
    {
      level: 'intermediate',
      question: 'Construct from pre+in complexity?',
      answerHint: 'O(n) with hash map; each node visited once.',
    },
    {
      level: 'advanced',
      question: 'Balanced BST from sorted array?',
      answerHint: 'Recursive mid index as root; left half left subtree, right half right.',
    },
  ],
  flashcards: [
    {
      front: 'Preorder + inorder root',
      back: 'Next value in preorder; find index in inorder to split.',
    },
    {
      front: 'BST from preorder bound trick',
      back: 'Stop left when pre[i] > parent.val; right uses ancestor bound.',
    },
  ],
  quickRevision: [
    'Pre: root at preIdx++',
    'Post: root at postIdx--',
    'Inorder map for split',
    'Ranges not subarray copies',
    'Postorder: right before left',
    'BST pre: bound parameter',
    'Sorted→BST: pick mid',
  ],
}
