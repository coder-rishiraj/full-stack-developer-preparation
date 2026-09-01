import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Fenwick tree (Binary Indexed Tree) supports point update and prefix/range sum query in O(log n) with O(n) space — simpler code than segment tree for prefix aggregates.',
  whyExists: 'Prefix sum array gives O(1) prefix but O(n) update. Fenwick balances both with tiny constant factor — ideal for dynamic frequency and inversion count.',
  mentalModel: 'Array with hidden shortcuts — each index stores sum of a responsibly-sized block; update ripples O(log n) cells.',
  howItWorks: [
    { type: 'list', items: [
      'tree[i] stores sum of range (i - lowbit(i) + 1 .. i).',
      'lowbit(i) = i & -i.',
      'Update: add delta at i, then i += lowbit(i) while i<=n.',
      'Query prefix [1..i]: sum tree[i], i -= lowbit(i).',
      'Range [l,r] = prefix(r) - prefix(l-1). 1-indexed typical.',
    ] },
  ],
  example: [
    { type: 'code', language: 'java', code: 'void update(int i, int delta) { for (; i <= n; i += i & -i) tree[i] += delta; }\nint query(int i) { int s = 0; for (; i > 0; i -= i & -i) s += tree[i]; return s; }', caption: 'Fenwick update and query' },
  ],
  tradeoffs: {
    advantages: [
      'Short code',
      'Fast in practice',
      'O(log n) update/query',
    ],
    disadvantages: [
      'Sum/min variants only easy',
      'Range update needs lazy or BIT of BIT',
    ],
    alternatives: [
      'Segment tree for general range ops',
    ],
    whenToUse: [
      'Dynamic prefix sum',
      'Inversion count',
      'Freq tables',
    ],
    whenNotToUse: [
      'Range min when segtree clearer',
    ],
  },
  failureModes: [
    '0-index vs 1-index confusion',
    'Forget range query l-1',
    'Overflow on large sums',
  ],
  production: {
    performance: [
      'Prefer Fenwick over segtree for sum-only',
    ],
    maintainability: [
      'Document 1-index convention',
    ],
  },
  interview: {
    expectations: [
      'lowbit formula',
      'O(log n)',
    ],
    commonQuestions: [
      'Fenwick vs segment tree?',
    ],
    followUps: [
      'Range update?',
    ],
    misconceptions: [
      'Same as prefix array',
    ],
    traps: [
      'Off-by-one 0-index',
    ],
    strongSignals: [
      'i & -i explained + update/query loops',
    ],
  },
  complexity: {
    average: 'O(log n) per point update or prefix query.',
    worst: 'O(log n) per operation.',
    space: 'O(n)',
    notes: 'Build can be O(n log n) via repeated updates or O(n) with direct construction.',
  },
  implementation: [
    {
      language: 'java',
      caption: 'One-indexed Fenwick tree',
      code: `class Fenwick {
    final long[] tree;
    Fenwick(int n) { tree = new long[n + 1]; }
    void add(int i, long delta) {
        for (; i < tree.length; i += i & -i) tree[i] += delta;
    }
    long sum(int i) {
        long total = 0;
        for (; i > 0; i -= i & -i) total += tree[i];
        return total;
    }
}`,
    },
  ],
  patternRecognition: [
    'The array changes between queries and the query is a prefix sum, frequency, or count.',
    'A range sum can be expressed as prefix(r) minus prefix(l - 1).',
    'The task asks for inversion counts or order statistics over a bounded coordinate range.',
    'You need faster updates than a prefix-sum array but simpler operations than a segment tree.',
  ],
  commonMistakes: [
    'Passing zero-based indices into a one-indexed Fenwick update or query loop.',
    'Computing range sum(l, r) without subtracting prefix(l - 1).',
    'Using int storage when cumulative sums can exceed the integer range.',
    'Trying to use the standard sum Fenwick tree for arbitrary range minimum queries.',
  ],
  keyTakeaways: [
    'BIT for prefix sums',
    'lowbit = i & -i',
    'O(log n) update/query',
    '1-indexed typical',
    'Shorter than segtree for sums',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Fenwick tree ops?', answerHint: 'Point update and prefix sum in O(log n).' },
    { level: 'intermediate', question: 'lowbit?', answerHint: 'i & -i — isolates lowest set bit; defines responsibility range.' },
    { level: 'advanced', question: '2D Fenwick?', answerHint: 'Nested BIT for matrix point update and prefix sum O(log²n).' },
  ],
  flashcards: [
    { front: 'lowbit(i)', back: 'i & -i — lowest set bit value' },
    { front: 'Fenwick update', back: 'Add delta climbing i += lowbit(i)' },
    { front: 'Prefix query', back: 'Sum descending i -= lowbit(i)' },
  ],
  quickRevision: [
    'i & -i',
    '1-indexed',
    'O(log n)',
    'Prefix+point',
    'Sum-only sweet spot',
  ],
}
