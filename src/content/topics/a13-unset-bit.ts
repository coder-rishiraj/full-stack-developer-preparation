import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Unsetting (clearing) a bit forces position k to 0: n & ~(1 << k). Clearing the lowest set bit uses n & (n - 1)—key for counting set bits or iterating set bits efficiently.',
  whyExists:
    'Removing bits appears in Brian Kernighan bit count, subset enumeration, and isolating lowest set bit (n & -n). Pair with set-bit for full flag manipulation toolkit.',
  mentalModel:
    'AND with a mask that has 0 only where you want off—everywhere else 1 preserves existing bits.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Clear bit k: n &= ~(1 << k).',
        'Clear lowest set bit: n &= (n - 1).',
        'Isolate lowest set bit: low = n & -n.',
        'Clear all bits below k: n & (~0 << k) or n & -(1<<k) variants.',
        'Repeat n &= n-1 until zero to count bits.',
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Count set bits (Kernighan)',
      code: `int hammingWeight(int n) {
    int count = 0;
    while (n != 0) {
        n &= (n - 1);
        count++;
    }
    return count;
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'n=7 (111), clear lowest set bit: 7 & 6 = 6 (110); Kernighan loop counts three set bits.',
    },
  ],
  complexity: {
    average: 'O(number of set bits) for Kernighan loop',
    space: 'O(1)',
  },
  tradeoffs: {
    advantages: ['Kernighan O(bits set) not O(32)', 'Standard interview trick', 'Pairs with isolate lowest'],
    disadvantages: ['Still loop for popcount', 'Integer.bitCount hardware faster'],
    alternatives: ['Integer.bitCount(n)', 'Lookup table for bytes'],
    whenToUse: ['Count bits', 'Iterate set bits', 'Clear bits in algorithms'],
    whenNotToUse: ['Only need parity → XOR fold', 'Huge bitsets → BitSet API'],
  },
  failureModes: [
    'Using n - 1 without assign: n & (n-1) not n - 1 alone.',
    'Wrong mask ~ (1<<k) missing parens.',
    'Infinite loop if n negative without >>> normalization.',
  ],
  interview: {
    expectations: ['n & (n-1) clears lowest', 'Clear specific bit with &~', 'Hamming weight'],
    commonQuestions: ['Number of 1 Bits', 'Power of Two (n & n-1)', 'Single Number II'],
    followUps: ['Why n & -n isolates lowest?', 'Count in O(1) with lookup?'],
    misconceptions: ['Must loop 32 times always', 'n-1 clears highest bit'],
    traps: ['Negative n in Java two complement', 'Unsigned treatment'],
    strongSignals: ['Explains n & (n-1) visually', 'Uses Kernighan count'],
  },
  patternRecognition: [
    'The operation must clear one flag while leaving every other bit unchanged.',
    'A bitmask represents permissions or selected items and one member must be removed.',
    'The expected result always has a zero at a known bit position.',
  ],
  commonMistakes: [
    'Using XOR to clear a bit and turning it on when it was previously zero.',
    'Negating the value rather than negating the single-bit mask.',
    'Mixing one-based and zero-based bit positions.',
    'Using a narrow integer type when the mask needs a higher bit.',
  ],
  keyTakeaways: [
    'Clear bit k: n & ~(1 << k).',
    'Clear lowest set: n & (n - 1).',
    'Isolate lowest: n & -n.',
    'Kernighan counts set bits efficiently.',
    'Power of two: n>0 && (n & n-1)==0.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Clear lowest set bit?', answerHint: 'n & (n - 1).' },
    { level: 'intermediate', question: 'Power of two test?', answerHint: 'n > 0 && (n & (n - 1)) == 0.' },
    { level: 'advanced', question: 'Why n & -n gives lowest set bit?', answerHint: '-n is two complement invert+1; AND isolates rightmost 1.' },
  ],
  flashcards: [
    { front: 'Clear lowest set bit', back: 'n & (n - 1).' },
    { front: 'Isolate lowest set bit', back: 'n & (-n).' },
  ],
  quickRevision: [
    'Clear k: n & ~(1<<k)',
    'Lowest clear: n & (n-1)',
    'Isolate: n & -n',
    'Kernighan popcount',
    'Power of two test',
    'Watch negative n',
    'O(set bits) loop',
  ],
}
