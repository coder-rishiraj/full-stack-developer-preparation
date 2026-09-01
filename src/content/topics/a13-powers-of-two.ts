import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Powers of two are integers with exactly one bit set: 1, 2, 4, 8, ... Formulas: 1 << k, n & (n-1)==0 for n>0, (n & -n)==n for n>0. Used in sizing buffers, heap indices, and bit trick problems.',
  whyExists:
    'Recognizing power-of-two structure enables O(1) checks, log2 via bit operations, and explains why heap/array doubling uses 2^k sizes. Common interview gotcha combined with overflow.',
  mentalModel:
    'Only one light on in the binary display—subtract 1 flips that bit and all lower bits, so AND with original yields zero.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Is power of two: n > 0 && (n & (n - 1)) == 0.',
        'Next power of two (cap): 1 << (32 - Integer.numberOfLeadingZeros(n - 1)).',
        'log2 of power of two k: count trailing zeros or 31 - clz(n).',
        '1 << k doubles each step; overflow at k=31 for int.',
        'Negative numbers never powers of two in usual definition.',
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Power of two check',
      code: `boolean isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'n=16 (10000): n>0 and n&(n-1)==0 confirms power of two; n=12 fails.',
    },
  ],
  complexity: {
    average: 'O(1) check',
    space: 'O(1)',
  },
  tradeoffs: {
    advantages: ['O(1) elegant test', 'Links to bit clear trick', 'Useful for sizing'],
    disadvantages: ['Not all positive ints are powers of two', 'Next pow2 math easy to get wrong', 'int overflow on shift'],
    alternatives: ['Loop divide by 2', 'Lookup table small range'],
    whenToUse: ['Validate n is 2^k', 'Heap/array capacity', 'Bitmask universe size'],
    whenNotToUse: ['Nearest power without bit math care', 'Floating point log'],
  },
  failureModes: [
    'Forget n > 0 (0 passes n & n-1 incorrectly as power?). Actually 0: (0 & -1)==0 but not power—need n>0.',
    '1 << 31 overflow when computing next power.',
    'Confuse power of two with even number.',
  ],
  interview: {
    expectations: ['n & (n-1)==0 with n>0', 'Explain why', '1<<k generation'],
    commonQuestions: ['Power of Two', 'Counting Bits link', 'Single Number bit partition'],
    followUps: ['Next power of two?', 'Largest power <= n?'],
    misconceptions: ['All even numbers are powers of two', '0 is power of two'],
    traps: ['Integer.MIN_VALUE edge cases', 'Long for 1<<31'],
    strongSignals: ['Derives n&(n-1) proof', 'Handles n<=0 early'],
  },
  patternRecognition: [
    'A number must have exactly one set bit or be rounded to a power-of-two boundary.',
    'The prompt asks for logarithmic-size buckets, capacities, or alignment.',
    'Repeated doubling or halving is central to the condition.',
  ],
  commonMistakes: [
    'Applying n & (n - 1) == 0 to zero and calling zero a power of two.',
    'Overflowing when doubling an int near its maximum value.',
    'Confusing the nearest power of two with the next strictly greater power of two.',
    'Using floating-point logarithms and introducing precision edge cases.',
  ],
  keyTakeaways: [
    'Power of two: exactly one bit set.',
    'Test: n > 0 && (n & (n - 1)) == 0.',
    'Generate 2^k with 1 << k.',
    'n & (n-1) clears sole set bit → zero.',
    'Watch shift overflow at k=31 int.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Is n a power of two?', answerHint: 'n > 0 && (n & (n - 1)) == 0.' },
    { level: 'intermediate', question: 'Why does n & (n-1) work?', answerHint: 'Powers of two binary 1000; n-1 is 0111; AND zero. Non-power has multiple bits survive.' },
    { level: 'advanced', question: 'Round up to next power of two?', answerHint: 'Decrement, smear bits right with n|=n>>1 etc., increment; or bit hacks with clz.' },
  ],
  flashcards: [
    { front: 'Power of two test', back: 'n > 0 && (n & (n - 1)) == 0.' },
    { front: '2^k in Java int', back: '1 << k (mind k=31 overflow).' },
  ],
  quickRevision: [
    'One bit set only',
    'n & (n-1) == 0',
    'Require n > 0',
    '1 << k generate',
    'Linked to unset lowest bit',
    'Overflow at 1<<31',
    'Not same as even',
  ],
}
