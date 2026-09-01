import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A segment tree is a binary tree over array indices supporting range query (sum, min, max, gcd) and point/range update in O(log n). Each internal node stores aggregate of its segment; query walks O(log n) nodes; update propagates to root.',
  whyExists:
    'Prefix sums give O(1) range sum but O(n) updates. Segment tree balances both at O(log n)—needed for dynamic range queries in contests and problems like Range Sum Query Mutable, count in range.',
  mentalModel:
    'Divide array into halves recursively; root holds whole range; children hold left/right halves. To query [L,R], combine nodes whose segments fully lie inside—at most 2 log n nodes.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Build: leaf i stores a[i]; internal node = merge(left, right) e.g. sum.',
        'Point update: walk root to leaf, update, recompute ancestors.',
        'Range query [ql,qr]: if node segment inside query return node val; if disjoint return identity (0 for sum, INF for min); else recurse both children and merge.',
        'Lazy propagation: defer range updates with lazy tag on node until visited.',
        'Size: array tree 4*n sufficient for 1-indexed or 0-indexed implementation.',
        'Iterative segment tree alternative for sum/min only.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Array [1,3,5,7] sum segtree: leaves 1,3,5,7; parent sums 4,12; root 20. Query [1,2] (0-indexed values 3,5) merges nodes covering indices 1-2 → 8.',
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Sum segment tree (recursive build/query/update)',
      code: `class SegTree {
    int n;
    int[] tree;
    SegTree(int[] a) {
        n = a.length;
        tree = new int[4 * n];
        build(a, 1, 0, n - 1);
    }
    void build(int[] a, int node, int l, int r) {
        if (l == r) { tree[node] = a[l]; return; }
        int m = (l + r) >>> 1;
        build(a, node * 2, l, m);
        build(a, node * 2 + 1, m + 1, r);
        tree[node] = tree[node * 2] + tree[node * 2 + 1];
    }
    int query(int ql, int qr) { return query(1, 0, n - 1, ql, qr); }
    int query(int node, int l, int r, int ql, int qr) {
        if (qr < l || r < ql) return 0;
        if (ql <= l && r <= qr) return tree[node];
        int m = (l + r) >>> 1;
        return query(node * 2, l, m, ql, qr) + query(node * 2 + 1, m + 1, r, ql, qr);
    }
    void update(int idx, int val) { update(1, 0, n - 1, idx, val); }
    void update(int node, int l, int r, int idx, int val) {
        if (l == r) { tree[node] = val; return; }
        int m = (l + r) >>> 1;
        if (idx <= m) update(node * 2, l, m, idx, val);
        else update(node * 2 + 1, m + 1, r, idx, val);
        tree[node] = tree[node * 2] + tree[node * 2 + 1];
    }
}`,
    },
  ],
  complexity: {
    best: 'O(log n) query and point update',
    average: 'O(log n)',
    worst: 'O(log n); build O(n)',
    space: 'O(n) tree array (4n nodes)',
  },
  patternRecognition: [
    'Range Sum Query - Mutable.',
    'Count of Smaller Numbers After Self (merge sort or segtree).',
    'Range minimum/maximum with updates.',
    'Lazy propagation for range add/range set.',
  ],
  commonMistakes: [
    'Tree size too small—use 4*n.',
    'Off-by-one on inclusive [ql,qr] bounds.',
    'Wrong identity for disjoint (0 sum, INF min).',
    'Forget to recompute parent after child update.',
  ],
  tradeoffs: {
    advantages: [
      'O(log n) query and update flexible aggregates',
      'Generalizes to min, max, gcd, xor',
      'Lazy propagation for range updates',
    ],
    disadvantages: [
      'More code than prefix sum or sparse table',
      'O(n) space constant factor ~4n',
      'Fenwick tree simpler for prefix-style sums only',
    ],
    alternatives: ['Fenwick tree (BIT) for sum/freq', 'Sparse table O(1) RMQ static', 'Sqrt decomposition'],
    whenToUse: ['Dynamic range queries with updates', 'Custom merge (gcd, max subarray)', 'Order statistics with coord compress'],
    whenNotToUse: ['Static array only—prefix or sparse table', 'Single point queries only'],
  },
  failureModes: [
    'Stack overflow deep recursion—iterative or increase stack.',
    'Integer overflow on sum range—use long.',
    'Lazy tags not pushed before query corrupts result.',
  ],
  interview: {
    expectations: [
      'O(log n) query/update',
      'Merge function for aggregate',
      'Recursive node [l,r] template',
    ],
    commonQuestions: ['Range Sum Query Mutable', 'Why not prefix sum?', 'Lazy propagation idea?'],
    followUps: ['Fenwick vs segment tree?', 'Range min instead of sum?', '2D segment tree?'],
    misconceptions: ['Build is O(n log n) always (O(n) possible)', 'Must store entire array in each node', 'Same as binary indexed tree always'],
    traps: ['Inclusive vs exclusive bounds', 'Update index bounds'],
    strongSignals: ['Clean three-case query logic', 'Mentions Fenwick when sum-only', 'Knows 4n sizing'],
  },
  keyTakeaways: [
    'Binary partition of index range; node stores segment aggregate.',
    'Query: full cover return node; disjoint identity; else split.',
    'Point update: leaf then recompute up O(log n).',
    '4*n tree size; build O(n).',
    'Lazy tags for range update efficiency.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Segment tree query time?', answerHint: 'O(log n)—visit O(log n) nodes covering range.' },
    { level: 'intermediate', question: 'When prefer Fenwick tree?', answerHint: 'Prefix sum / frequency with point update only—simpler code, less space, same O(log n).' },
    { level: 'advanced', question: 'Lazy propagation purpose?', answerHint: 'Defer range updates on large segments; push tag to children only when node visited—avoids O(n) per range update.' },
  ],
  flashcards: [
    { front: 'Segment tree query/update', back: 'O(log n) each.' },
    { front: 'Tree array size', back: 'Typically 4 * n nodes.' },
    { front: 'Query three cases', back: 'Full overlap return; disjoint identity; partial recurse both.' },
  ],
  quickRevision: [
    'Node = segment aggregate',
    'Query 3 cases',
    'Update leaf → root',
    'O(log n) ops',
    '4n array size',
    'Lazy for range upd',
    'Fenwick if sum-only',
  ],
}
