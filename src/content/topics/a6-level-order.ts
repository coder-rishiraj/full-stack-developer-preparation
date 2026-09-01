import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Level-order traversal (BFS on trees) returns nodes row by row from top to bottom—each level left-to-right. Variants include zigzag, bottom-up, averages, and views filtered by level index.',
  whyExists:
    'Many interview questions ask "what happens at each depth?" rather than along a single path. Level-order gives a canonical serialization order for complete trees and powers UI-style tree printing.',
  mentalModel:
    'Read the tree like lines in a book: finish the entire line before moving to the next. The queue holds the current line; children form the next line appended to the rear.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Standard: BFS with level-size loop; collect vals into List<List<Integer>>.',
        'Zigzag: alternate addFirst/addLast or reverse every other row.',
        'Bottom-up: add each level to front of result list.',
        'N-ary: same template, loop all children instead of left/right.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Template reuse',
      text: 'Level-order is identical to a6-bfs tree template—this topic focuses on output shaping (2D list, zigzag, views) not the mechanics of queue BFS.',
    },
  ],
  architecture: {
    mermaid: `flowchart TD
  L0[Level 0 queue root] --> L1[Level 1 children]
  L1 --> L2[Level 2 grandchildren]
  L2 --> Ln[Until empty]`,
    caption: 'Level-by-level expansion',
  },
  example: [
    {
      type: 'paragraph',
      text: '[3,9,20,null,null,15,7] → [[3],[9,20],[15,7]]. Zigzag: [[3],[20,9],[15,7]]. Bottom-up: [[15,7],[9,20],[3]].',
    },
    {
      type: 'table',
      headers: ['variant', 'output tweak'],
      rows: [
        ['standard', 'row list per level'],
        ['zigzag', 'reverse odd levels'],
        ['bottom-up', 'addRow(0, row)'],
        ['right view', 'last val in each row'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Standard level order',
      code: `List<List<Integer>> res = new ArrayList<>();
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
    res.add(row);
}
return res;`,
    },
    {
      language: 'java',
      caption: 'Zigzag level order',
      code: `boolean leftToRight = true;
List<Integer> row = new LinkedList<>();
for (int i = 0; i < sz; i++) {
    TreeNode cur = q.poll();
    if (leftToRight) ((LinkedList<Integer>) row).addLast(cur.val);
    else ((LinkedList<Integer>) row).addFirst(cur.val);
    // enqueue children...
}
leftToRight = !leftToRight;`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Average of levels',
      code: `public List<Double> averageOfLevels(TreeNode root) {
    List<Double> ans = new ArrayList<>();
    Deque<TreeNode> q = new ArrayDeque<>();
    if (root != null) q.offer(root);
    while (!q.isEmpty()) {
        int sz = q.size();
        double sum = 0;
        for (int i = 0; i < sz; i++) {
            TreeNode cur = q.poll();
            sum += cur.val;
            if (cur.left != null) q.offer(cur.left);
            if (cur.right != null) q.offer(cur.right);
        }
        ans.add(sum / sz);
    }
    return ans;
}`,
    },
  ],
  complexity: {
    best: 'O(n) visit every node once',
    average: 'O(n) time',
    worst: 'O(n) time; O(w) queue for widest level',
    space: 'O(n) output + O(w) queue',
  },
  patternRecognition: [
    'Return List<List<Integer>> rows.',
    'Zigzag / alternate direction levels.',
    'Bottom-up level order.',
    'Largest value / average per row.',
    'Cousins in same depth (BFS with parent tracking).',
  ],
  commonMistakes: [
    'Reversing entire result instead of per-row direction.',
    'Using DFS with depth index when BFS level loop is clearer.',
    'LinkedList vs ArrayList confusion in zigzag addFirst.',
    'Forgetting to handle empty tree → [].',
  ],
  tradeoffs: {
    advantages: [
      'Clear per-level aggregation',
      'Same O(n) BFS template for many variants',
      'Matches human tree visualization',
    ],
    disadvantages: [
      'O(w) queue on wide trees',
      'DFS with depth map uses O(h) stack but messier grouping',
    ],
    alternatives: ['DFS with HashMap depth → lists', 'Preorder with nulls for complete tree indexing'],
    whenToUse: ['Explicit row output', 'Per-level max/avg/view', 'Zigzag printing'],
    whenNotToUse: ['Single path sum → DFS', 'BST inorder sorted → DFS inorder'],
  },
  failureModes: [
    'Integer overflow on sum of large level values for averages—use long.',
    'Null root returning null instead of empty list.',
  ],
  interview: {
    expectations: [
      'Level-size inner loop',
      'O(n) time',
      'Handle null root',
    ],
    commonQuestions: [
      'Binary Tree Level Order Traversal',
      'Binary Tree Zigzag Level Order Traversal',
      'Average of Levels in Binary Tree',
      'Find Largest Value in Each Tree Row',
    ],
    followUps: ['DFS alternative with depth map?', 'Print tree visually?'],
    misconceptions: ['Level-order requires recursion'],
    traps: ['Cousins: same depth but different parents—track parent in BFS'],
    strongSignals: ['Uses sz snapshot; explains zigzag without full result reverse'],
  },
  keyTakeaways: [
    'BFS + sz loop produces 2D level lists.',
    'Zigzag: deque addFirst/addLast per row.',
    'Bottom-up: insert row at index 0.',
    'O(n) time, O(w) queue space.',
    'N-ary: enqueue all children in loop.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Level-order traversal steps?',
      answerHint: 'Queue root; while non-empty, poll sz nodes as one row, enqueue children.',
    },
    {
      level: 'intermediate',
      question: 'Zigzag without reversing whole list?',
      answerHint: 'LinkedList addFirst on alternate levels or boolean flip with deque.',
    },
    {
      level: 'advanced',
      question: 'Cousins in binary tree?',
      answerHint: 'BFS by level; same depth different parent—track parent when enqueueing.',
    },
  ],
  flashcards: [
    {
      front: 'Level-order core loop',
      back: 'sz = q.size(); poll sz times; enqueue children.',
    },
    {
      front: 'Zigzag trick',
      back: 'Alternate addFirst vs addLast on row list.',
    },
  ],
  quickRevision: [
    'Queue BFS + sz per level',
    'Output List<List<Integer>>',
    'Zigzag: flip row insert',
    'Bottom-up: add(0, row)',
    'O(n) time O(w) space',
    'Right view: last in sz loop',
    'Empty root → empty list',
  ],
}
