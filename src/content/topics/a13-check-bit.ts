import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Checking a bit at position k tests whether that bit is 1 using (n >> k) & 1 or (n & (1 << k)) != 0. k=0 is least significant bit. Used for parity, subset enumeration, and validating flags.',
  whyExists:
    'Many bit problems need O(1) per-bit queries—odd/even, k-th bit set, iterate set bits. Correct shift and mask avoids off-by-one and sign bugs.',
  mentalModel:
    'Slide the bit you care about to the ones place with shift, then AND with 1 to isolate it.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'k-th bit set: (n & (1 << k)) != 0.',
        'k-th bit value: (n >> k) & 1.',
        'LSB odd: (n & 1) == 1.',
        'Iterate bits: while n>0 { check n&1; n>>>=1; }',
        'Use 1L << k if k>=31 to avoid int overflow on shift.',
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Check k-th bit',
      code: `boolean isBitSet(int n, int k) {
    return (n & (1 << k)) != 0;
}

int kthBit(int n, int k) {
    return (n >>> k) & 1;
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'n=12 (1100), bit 2 is set: (12 & (1<<2)) != 0; bit 0 is clear.',
    },
  ],
  complexity: {
    average: 'O(1) per check',
    space: 'O(1)',
  },
  tradeoffs: {
    advantages: ['Constant time bit test', 'No string conversion', 'Works in tight loops'],
    disadvantages: ['Shift overflow if 1<<31 in int', 'Must use >>> for logical shift when needed'],
    alternatives: ['Integer.bitCount for population', 'BigInteger for arbitrary precision'],
    whenToUse: ['Flag checks', 'Building masks', 'Subset bitmask loops'],
    whenNotToUse: ['Need all set bit indices → use bit tricks or Integer.bitCount loop'],
  },
  failureModes: [
    '1 << 31 overflows int (use 1L).',
    'Signed >> propagates sign; use >>> for unsigned shift right.',
    'Off-by-one on bit indexing (0 vs 1 based).',
  ],
  interview: {
    expectations: ['(n>>k)&1 or n&(1<<k)', 'LSB n&1', 'Overflow on 1<<31'],
    commonQuestions: ['Power of Two', 'Counting Bits', 'Hamming Weight'],
    followUps: ['Iterate all set bits efficiently?', 'Check bit without shift?'],
    misconceptions: ['MSB at index 1 in 0-indexed', '>> always fills with zero'],
    traps: ['k negative or k>=32', 'char promoted to int in bitwise'],
    strongSignals: ['Uses >>> appropriately', 'Mentions 1L for high bits'],
  },
  patternRecognition: [
    'The prompt asks whether a particular flag or binary position is enabled.',
    'A condition depends on the kth bit of an integer rather than its numeric magnitude.',
    'You need to filter values by parity, powers-of-two bits, or a permission mask.',
  ],
  commonMistakes: [
    'Using 1 << k when the problem indexes bits from one rather than zero.',
    'Comparing (n & mask) to 1 instead of testing whether it is nonzero.',
    'Shifting an int by 32 or more and expecting a distinct bit.',
    'Forgetting parentheses around n & (1 << k) in larger expressions.',
  ],
  keyTakeaways: [
    'Test bit k: (n & (1 << k)) != 0.',
    'Extract bit: (n >>> k) & 1.',
    'LSB check: n & 1.',
    'Watch int overflow on 1 << 31.',
    'Use >>> for logical right shift.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Is n odd using bits?', answerHint: '(n & 1) == 1.' },
    { level: 'intermediate', question: 'Check bit k set in n?', answerHint: '(n & (1 << k)) != 0; mind shift overflow use long mask.' },
    { level: 'advanced', question: 'Iterate set bits without checking all 32?', answerHint: 'while n!=0 { lowest = n & -n; ...; n &= n-1; }' },
  ],
  flashcards: [
    { front: 'LSB set check', back: 'n & 1.' },
    { front: 'k-th bit set test', back: '(n & (1 << k)) != 0.' },
  ],
  quickRevision: [
    'k-th bit: shift and mask',
    'n & 1 for odd',
    '>>> logical shift',
    '1L << k avoid overflow',
    '0-index from LSB',
    'n & -n lowest set bit',
    'O(1) per check',
  ],
}
