import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Tree view problems collect nodes visible from a direction: right side view (rightmost per level), top view (first node per horizontal column), vertical order (sort by column, tie-break by level). BFS with level tracking or DFS with (row, col) coordinates solves them.',
  whyExists:
    'These problems test whether you can augment standard traversals with metadata—depth, column index, direction—rather than memorizing three separate algorithms. Same BFS/DFS machinery, different aggregation rule.',
  mentalModel:
    'Imagine standing outside the tree: right view = last node you see per horizontal shelf (level); top view = topmost node per vertical slice (column); vertical order = sort all nodes by x-coordinate column.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Right side view: BFS level order, keep last node of each level; or DFS visit right child first, record first time each depth seen.',
        'Left side view: mirror—first node per level or DFS left-first.',
        'Top view: BFS/DFS with horizontal column col; root col=0, left col-1, right col+1; map col→node, last write wins for BFS bottom-up or first for top-down DFS.',
        'Vertical order: TreeMap col→list of (level,val); BFS assign col; sort cols, within col sort by level.',
        'Bottom view: like top view but last node per column wins (BFS overwrites).',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Coordinate convention',
      text: 'Root at (level=0, col=0). Left child col-1, right col+1. Vertical order tie-break: smaller level first (top to bottom within column).',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Tree root 1, left 2, right 3, node 2 left 4 right 5: right view [1,3,5]; top view left-to-right columns [-1]=4, [0]=2, [1]=1, [2]=3, [3]=5 (depends traversal overwrite rule); vertical order [[4],[2],[1,3],[5]].',
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Right side view (BFS)',
      code: `List<Integer> rightSideView(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    if (root == null) return res;
    Queue<TreeNode> q = new ArrayDeque<>();
    q.offer(root);
    while (!q.isEmpty()) {
        int sz = q.size();
        for (int i = 0; i < sz; i++) {
            TreeNode cur = q.poll();
            if (cur.left != null) q.offer(cur.left);
            if (cur.right != null) q.offer(cur.right);
            if (i == sz - 1) res.add(cur.val);
        }
    }
    return res;
}`,
    },
    {
      language: 'java',
      caption: 'Vertical order traversal',
      code: `List<List<Integer>> verticalOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    TreeMap<Integer, List<int[]>> map = new TreeMap<>();
    Queue<TreeNode> q = new ArrayDeque<>();
    Queue<int[]> meta = new ArrayDeque<>();
    q.offer(root); meta.offer(new int[]{0, 0});
    while (!q.isEmpty()) {
        TreeNode cur = q.poll();
        int col = meta.poll()[0], row = meta.poll()[1];
        map.computeIfAbsent(col, k -> new ArrayList<>())
           .add(new int[]{row, cur.val});
        if (cur.left != null) {
            q.offer(cur.left); meta.offer(new int[]{col - 1, row + 1});
        }
        if (cur.right != null) {
            q.offer(cur.right); meta.offer(new int[]{col + 1, row + 1});
        }
    }
    for (List<int[]> col : map.values()) {
        col.sort(Comparator.comparingInt(a -> a[0]));
        List<Integer> level = new ArrayList<>();
        for (int[] p : col) level.add(p[1]);
        res.add(level);
    }
    return res;
}`,
    },
    {
      language: 'java',
      caption: 'Top view (DFS with TreeMap, first at col wins)',
      code: `List<Integer> topView(TreeNode root) {
    if (root == null) return List.of();
    TreeMap<Integer, Integer> colToVal = new TreeMap<>();
    dfsTop(root, 0, colToVal);
    return new ArrayList<>(colToVal.values());
}
void dfsTop(TreeNode node, int col, TreeMap<Integer, Integer> map) {
    if (node == null) return;
    map.putIfAbsent(col, node.val);
    dfsTop(node.left, col - 1, map);
    dfsTop(node.right, col + 1, map);
}`,
    },
  ],
  complexity: {
    average: 'O(n) visit each node once',
    worst: 'O(n log n) if TreeMap/sort on columns with many nodes',
    space: 'O(n) queue + map of columns',
  },
  patternRecognition: [
    'Binary Tree Right Side View.',
    'Vertical Order Traversal.',
    'Top View / Bottom View variants.',
    'Any problem: aggregate by level, column, or depth first-seen.',
  ],
  commonMistakes: [
    'Right view DFS left-first without depth tracking.',
    'Top vs bottom view: wrong overwrite rule (first vs last per column).',
    'Vertical order: forget sort by row within column.',
    'Using global max depth instead of per-level last node.',
  ],
  tradeoffs: {
    advantages: [
      'Reuses BFS/DFS with small metadata',
      'TreeMap handles column ordering cleanly',
      'DFS right-first elegant for right view',
    ],
    disadvantages: [
      'Multiple coordinate conventions—state clearly in interview',
      'TreeMap adds log factor on column count',
      'Top/bottom view definitions vary slightly by source',
    ],
    alternatives: ['HashMap + manual min/max col sort', 'Single DFS with List[] indexed by offset + shift'],
    whenToUse: ['View problems with column/level aggregation', 'Need ordered columns left-to-right'],
    whenNotToUse: ['Simple inorder/preorder without spatial metadata'],
  },
  failureModes: [
    'Null root not handled.',
    'Queue metadata (col,row) desync from node queue.',
    'Integer overflow on col in extreme skew (rare).',
  ],
  interview: {
    expectations: [
      'Right view: last per BFS level',
      'Column coordinate for vertical/top view',
      'TreeMap or sort for column order',
    ],
    commonQuestions: ['Binary Tree Right Side View', 'Vertical Order Traversal', 'Top View of Binary Tree'],
    followUps: ['Left view?', 'Bottom view difference?', 'N-ary tree views?'],
    misconceptions: ['Right view = rightmost leaf only', 'Top and bottom view same algorithm', 'Inorder gives vertical order'],
    traps: ['BFS top view must use first-seen per col (or clarify overwrite)', 'Vertical order tie-break by level not value'],
    strongSignals: ['Unified (col, level) coordinate model', 'Knows DFS right-first for right view', 'Clarifies top vs bottom overwrite'],
  },
  keyTakeaways: [
    'Right view: last node each BFS level.',
    'Column: left -1, right +1 from parent.',
    'Vertical order: TreeMap col → list sorted by level.',
    'Top view: first node per column (DFS putIfAbsent).',
    'Bottom view: last node per column (BFS overwrite).',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Right side view approach?', answerHint: 'BFS record last node per level, or DFS right child first record first visit per depth.' },
    { level: 'intermediate', question: 'Vertical order traversal?', answerHint: 'BFS with col index; group by col in TreeMap; sort each column by row/level.' },
    { level: 'advanced', question: 'Top vs bottom view?', answerHint: 'Both use column index; top keeps first node per col (DFS putIfAbsent or BFS before overwrite); bottom keeps last (BFS overwrites).' },
  ],
  flashcards: [
    { front: 'Right side view BFS', back: 'Add node when i == sz - 1 each level.' },
    { front: 'Column assignment', back: 'Left child col-1, right child col+1.' },
    { front: 'Top view rule', back: 'First node encountered per column wins.' },
  ],
  quickRevision: [
    'Right: last per level BFS',
    'col: left -1, right +1',
    'Vertical: TreeMap + sort by level',
    'Top: putIfAbsent on col',
    'Bottom: BFS overwrite col',
    'DFS right-first for right view',
    'O(n) visits',
  ],
}
