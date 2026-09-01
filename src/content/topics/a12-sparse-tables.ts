import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Sparse table precomputes static range queries (RMQ min/max, GCD) in O(n log n) build and O(1) query — immutable array only, no updates.',
  whyExists: 'Segment tree O(log n) query is fine but RMQ on static data can be O(1). ST uses overlapping power-of-two intervals.',
  mentalModel: 'Cheat sheet of best answers for every length-2^k window starting at i — query merges two overlapping blocks covering [l,r].',
  howItWorks: [
    { type: 'list', items: [
      'st[k][i] = query on [i, i+2^k-1].',
      'Build: st[0][i]=a[i]; st[k][i]=combine(st[k-1][i], st[k-1][i+2^(k-1)]).',
      'Query [l,r]: k=floor(log2(r-l+1)); combine(st[k][l], st[k][r-2^k+1]).',
      'Works for idempotent ops: min, max, gcd, AND, OR.',
      'Not for sum — overlapping double-counts.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Static array RMQ: build ST in O(n log n); 1M queries O(1) each beats segtree for read-heavy contest.' },
  ],
  tradeoffs: {
    advantages: [
      'O(1) query',
      'Simple for RMQ',
    ],
    disadvantages: [
      'No updates',
      'O(n log n) memory',
      'Not for non-idempotent sum',
    ],
    alternatives: [
      'Segment tree if updates needed',
      'Sqrt decomposition',
    ],
    whenToUse: [
      'Static RMQ/GCD heavy queries',
    ],
    whenNotToUse: [
      'Dynamic array with point updates',
    ],
  },
  failureModes: [
    'Use ST for range sum',
    'Wrong k in query',
    'Off-by-one on r-2^k+1',
  ],
  production: {
    performance: [
      'Precompute log table for O(1) k lookup',
    ],
    maintainability: [
      'Only static datasets',
    ],
  },
  interview: {
    expectations: [
      'Idempotent ops only',
      'O(1) query',
    ],
    commonQuestions: [
      'Sparse table vs segtree?',
    ],
    followUps: [
      'Why not sum?',
    ],
    misconceptions: [
      'ST handles updates',
    ],
    traps: [
      'Range sum with ST',
    ],
    strongSignals: [
      'Overlapping blocks + idempotent + log table',
    ],
  },
  complexity: {
    average: 'O(n log n) preprocessing and O(1) idempotent range queries.',
    worst: 'O(n log n) preprocessing and O(1) queries.',
    space: 'O(n log n)',
    notes: 'Updates require rebuilding; overlapping query blocks are valid only for idempotent operations.',
  },
  implementation: [
    {
      language: 'java',
      caption: 'Static range-minimum sparse table query',
      code: `int k = 31 - Integer.numberOfLeadingZeros(r - l + 1);
int answer = Math.min(st[k][l], st[k][r - (1 << k) + 1]);`,
    },
  ],
  patternRecognition: [
    'The array is immutable after preprocessing and receives many range min, max, GCD, AND, or OR queries.',
    'A range answer can combine overlapping power-of-two blocks without double-counting.',
    'The query operation is idempotent, meaning combine(x, x) equals x.',
    'The workload favors heavy read queries over any point or range updates.',
  ],
  commonMistakes: [
    'Using the two-overlapping-block query formula for sums or other non-idempotent operations.',
    'Selecting k from the endpoints instead of floor(log2(r - l + 1)).',
    'Computing the right block start without the +1 in r - (1 << k) + 1.',
    'Choosing a sparse table when updates require a segment tree or Fenwick tree.',
  ],
  keyTakeaways: [
    'Static RMQ O(1) query',
    'Idempotent combine only',
    'Not for range sum',
    'O(n log n) build and space',
    'Use segtree if updates',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Sparse table?', answerHint: 'Precomputed static range queries O(1) after O(n log n) build.' },
    { level: 'intermediate', question: 'Why idempotent?', answerHint: 'Overlapping intervals counted once in min/max; sum double-counts.' },
    { level: 'advanced', question: 'Compute k fast?', answerHint: 'Precompute log2 table or use 31-__builtin_clz(r-l+1).' },
  ],
  flashcards: [
    { front: 'Idempotent', back: 'combine(x,x)=x — min,max,gcd OK; sum not' },
    { front: 'st[k][i]', back: 'Answer on interval length 2^k starting at i' },
    { front: 'Static only', back: 'No point updates — rebuild required' },
  ],
  quickRevision: [
    'Static RMQ',
    'O(1) query',
    'Idempotent ops',
    'No sum',
    'n log n build',
  ],
}
