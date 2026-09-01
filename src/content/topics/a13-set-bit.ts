import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Setting bit k turns position k to 1 without changing other bits: n | (1 << k). Clearing uses AND with inverted mask. Toggling uses XOR with (1 << k). Building masks combines shifts for multiple bits.',
  whyExists:
    'Flag fields, permission bits, and bitmask DP require reliable set/clear/toggle. Interview problems (single number II, maximum XOR) combine set bit iteration with these primitives.',
  mentalModel:
    'OR turns on a light; AND with NOT turns off; XOR flips the switch.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Set bit k: n |= (1 << k).',
        'Clear bit k: n &= ~(1 << k).',
        'Toggle bit k: n ^= (1 << k).',
        'Set lower k bits: (1 << k) - 1.',
        'Combine: mask = (1<<a) | (1<<b).',
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Set, clear, toggle',
      code: `int setBit(int n, int k) { return n | (1 << k); }
int clearBit(int n, int k) { return n & ~(1 << k); }
int toggleBit(int n, int k) { return n ^ (1 << k); }`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'n=8 (1000), set bit 1 → 1010 (10) via n | (1<<1).',
    },
  ],
  complexity: {
    average: 'O(1) per operation',
    space: 'O(1)',
  },
  tradeoffs: {
    advantages: ['In-place style updates', 'Fast', 'Composable masks'],
    disadvantages: ['Must not mutate if immutability needed—return new int', 'Overflow on shift'],
    alternatives: ['BitSet class for dynamic bitsets', 'boolean[] for clarity small n'],
    whenToUse: ['Permission flags', 'Bitmask DP state updates', 'Low-level encoding'],
    whenNotToUse: ['Sparse huge indices', 'Readability-critical without comments'],
  },
  failureModes: [
    'Forget ~ on clear mask.',
    'Use XOR to set (toggles instead).',
    '1 << 31 overflow in Java int.',
  ],
  interview: {
    expectations: ['| set, &~ clear, ^ toggle', 'Build masks', 'Overflow awareness'],
    commonQuestions: ['Set Mismatch', 'Bitmask subset DP', 'Maximum Product of Word Lengths'],
    followUps: ['Set all bits in range?', 'Union two bitmasks?'],
    misconceptions: ['~1 is all zeros', 'Setting twice changes other bits'],
    traps: ['Parentheses in ~(1<<k) vs ~1<<k', 'long masks for 32+ bits'],
    strongSignals: ['Correct clear with &~', 'Uses (1<<k)-1 for prefix mask'],
  },
  patternRecognition: [
    'The operation must turn on one specific flag while preserving all other bits.',
    'A mask represents selected permissions, features, or subset membership.',
    'The result should contain every original set bit plus bit k.',
  ],
  commonMistakes: [
    'Using XOR to set a bit and accidentally toggling an already-set bit off.',
    'Using an incorrect one-based versus zero-based bit index.',
    'Building the mask with a signed shift that overflows the intended integer width.',
    'Overwriting the number with the mask instead of OR-ing it into the number.',
  ],
  keyTakeaways: [
    'Set: n | (1 << k).',
    'Clear: n & ~(1 << k).',
    'Toggle: n ^ (1 << k).',
    'Lower k ones: (1 << k) - 1.',
    'Parentheses matter on inverted masks.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Set bit k in n?', answerHint: 'n | (1 << k).' },
    { level: 'intermediate', question: 'Clear bit k?', answerHint: 'n & ~(1 << k).' },
    { level: 'advanced', question: 'Set bits from i to j inclusive?', answerHint: '((1 << (j-i+1)) - 1) << i applied with OR; watch overflow use long.' },
  ],
  flashcards: [
    { front: 'Set bit k', back: 'n | (1 << k).' },
    { front: 'Clear bit k', back: 'n & ~(1 << k).' },
  ],
  quickRevision: [
    'Set OR mask',
    'Clear AND NOT mask',
    'Toggle XOR mask',
    '(1<<k)-1 lower bits',
    'Use 1L for high shifts',
    'Parentheses on ~',
    'O(1) ops',
  ],
}
