import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'The diameter of a binary tree is the length of the longest path between any two nodes (path may or may not pass through the root)—computed in O(n) by tracking max leftHeight + rightHeight at each node during a postorder height DFS.',
  whyExists:
    'Longest path in a tree is not necessarily root-to-leaf—it may bend through an internal node. Diameter appears directly in interviews and as a subroutine pattern for "best path through node" optimizations.',
  mentalModel:
    'At each node, the longest path that uses this node as the highest point is left_depth + right_depth (in edges). Walk the tree computing height upward while updating a global best with L+R at every node.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Maintain global int best (or max diameter in edges/nodes—clarify).',
        'height(node): null→0; L=height(left); R=height(right); best=max(best,L+R); return 1+max(L,R).',
        'Answer is best (or best+1 if counting nodes on path—watch problem statement).',
        'Do not return L+R from height—that is local diameter, not subtree height.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Return vs update',
      text: 'Function returns height for parent; side effect updates global diameter. Mixing them causes wrong parent height calculations.',
    },
  ],
  architecture: {
    mermaid: `flowchart TD
  N[Node] --> HL[height L]
  N --> HR[height R]
  HL --> Upd[best = max best, HL+HR]
  HR --> Upd
  Upd --> Ret[return 1+max HL,HR]`,
    caption: 'Diameter update at each node',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Tree [1,2,3,4,5]: longest path 4-2-1-3 or 5-2-1-3 has length 3 edges (4 nodes). At node 1: L=2, R=1 → candidate 3; at node 2: L=1,R=1 → candidate 2.',
    },
    {
      type: 'table',
      headers: ['at node', 'L height', 'R height', 'local L+R'],
      rows: [
        ['2', '1', '1', '2'],
        ['1', '2', '1', '3 ← global max'],
        ['4', '0', '0', '0'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Diameter of binary tree (edges)',
      code: `int best = 0;
int height(TreeNode node) {
    if (node == null) return 0;
    int L = height(node.left);
    int R = height(node.right);
    best = Math.max(best, L + R);
    return 1 + Math.max(L, R);
}
// after height(root): return best;`,
    },
    {
      language: 'java',
      caption: 'Longest path sum variant',
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
  implementation: [
    {
      language: 'java',
      caption: 'Binary Tree Maximum Path Sum',
      code: `class Solution {
    int best = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        gain(root);
        return best;
    }

    int gain(TreeNode node) {
        if (node == null) return 0;
        int L = Math.max(0, gain(node.left));
        int R = Math.max(0, gain(node.right));
        best = Math.max(best, node.val + L + R);
        return node.val + Math.max(L, R);
    }
}`,
    },
  ],
  complexity: {
    best: 'O(n) single postorder pass',
    average: 'O(n) time',
    worst: 'O(n) time; O(h) recursion stack',
    space: 'O(h) call stack',
  },
  patternRecognition: [
    'Diameter of binary tree.',
    'Maximum path sum (any direction through node).',
    'Longest univalue path.',
    'Any "best path through this node = left + right" pattern.',
    'Height subroutine with global max side effect.',
  ],
  commonMistakes: [
    'Returning L+R as height breaks parent computation.',
    'Counting nodes vs edges on diameter (+1 confusion).',
    'Negative path sum: use max(0, gain) before combining.',
    'Assuming path must include root.',
  ],
  tradeoffs: {
    advantages: [
      'O(n) one pass vs O(n²) per-node height recompute',
      'Template extends to path sum variants',
      'Elegant postorder divide-and-conquer',
    ],
    disadvantages: [
      'Global mutable state in recursion',
      'Easy to confuse return semantics',
    ],
    alternatives: ['Two DFS passes (farther leaf from arbitrary node—2× height)', 'Rerooting DP for tree DP problems'],
    whenToUse: ['Longest path in tree', 'Max path sum through node', 'Height + global best pattern'],
    whenNotToUse: ['Path must be root-to-leaf only → simpler DFS', 'Graph diameter → different algorithms'],
  },
  failureModes: [
    'All negative values: max path sum needs node-alone consideration via best update.',
    'Global best not reset between test cases in class-based solution.',
  ],
  interview: {
    expectations: [
      'Separate height return from diameter update',
      'O(n) time O(h) space',
      'Path may not pass root',
    ],
    commonQuestions: [
      'Diameter of Binary Tree',
      'Binary Tree Maximum Path Sum',
      'Longest Univalue Path',
    ],
    followUps: ['Graph diameter difference?', 'Path must be downward only?'],
    misconceptions: ['Diameter equals height of root'],
    traps: ['Max path sum: gain can be 0 if negative child contribution'],
    strongSignals: ['Explains L+R at node before returning 1+max(L,R)'],
  },
  keyTakeaways: [
    'Diameter = max over nodes of height(L)+height(R).',
    'Postorder height DFS; update global best at each node.',
    'Return 1+max(L,R) to parent—not L+R.',
    'Max path sum: max(0, child gain) before combine.',
    'O(n) single traversal.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Diameter at a node formula?',
      answerHint: 'leftHeight + rightHeight (edges); update global max.',
    },
    {
      level: 'intermediate',
      question: 'Why not return L+R from height function?',
      answerHint: 'Parent needs subtree height 1+max(L,R), not path through node.',
    },
    {
      level: 'advanced',
      question: 'Max path sum with negative nodes?',
      answerHint: 'Child contribution max(0, gain); still update best with node+L+R.',
    },
  ],
  flashcards: [
    {
      front: 'Diameter update at node',
      back: 'best = max(best, height(L) + height(R)).',
    },
    {
      front: 'Height return to parent',
      back: '1 + max(height(L), height(R)).',
    },
  ],
  quickRevision: [
    'Global best + postorder height',
    'At node: L+R vs return 1+max(L,R)',
    'Path may skip root',
    'Max path sum: max(0, child)',
    'O(n) one pass',
    'Edges vs nodes clarify',
    'Same template as path sum',
  ],
}
