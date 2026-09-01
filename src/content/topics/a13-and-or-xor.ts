import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Bitwise AND (&), OR (|), and XOR (^) operate on corresponding bits of integers. AND: both 1 → 1. OR: any 1 → 1. XOR: bits differ → 1, same → 0. XOR properties: a^a=0, a^0=a, commutative/associative—foundation for single-number and swap tricks.',
  whyExists:
    'Compact set representation, parity checks, toggling flags, and O(1) space algorithms rely on bitwise ops. Interview bit problems almost always reduce to XOR cancellation or AND/OR masking.',
  mentalModel:
    'XOR is toggle/cancel: duplicate values XOR to zero. AND is filter/mask: keep only bits where mask is 1. OR is combine/turn on bits.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'a ^ a = 0; a ^ 0 = a (find single unique element).',
        'a & 1 → check least significant bit (odd/even).',
        'a | (1 << k) → set bit k; a & ~(1 << k) → clear bit k.',
        'a ^ b ^ b = a (swap-less exchange in pairs).',
        'Count bits: n &= n-1 removes lowest set bit until zero.',
      ],
    },
    {
      type: 'table',
      headers: ['Op', 'Truth', 'Common use'],
      rows: [
        ['AND &', '1 if both 1', 'Mask, check bit, clear low bits'],
        ['OR |', '1 if any 1', 'Set bits, combine flags'],
        ['XOR ^', '1 if different', 'Cancel duplicates, toggle, swap'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Single Number I (XOR all)',
      code: `int singleNumber(int[] nums) {
    int x = 0;
    for (int n : nums) x ^= n;
    return x;
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'nums [2,1,4,2,1,2] XOR all → 4 (Single Number I); pairs cancel via a^a=0.',
    },
  ],
  complexity: {
    average: 'O(n) per array pass for most bit tricks',
    space: 'O(1) extra',
  },
  tradeoffs: {
    advantages: ['O(1) space for parity/unique', 'Fast machine-level ops', 'Elegant XOR math'],
    disadvantages: ['Readability lower', 'Sign extension in Java >> vs >>>', 'Overflow if treating as infinite bits'],
    alternatives: ['HashMap count for duplicates', 'Sort for missing number'],
    whenToUse: ['Find unique', 'Subset XOR enumeration', 'Flag sets small universe'],
    whenNotToUse: ['Need frequency >2 without extra structure', 'Large sparse sets → HashSet'],
  },
  failureModes: [
    'Using & instead of && (bitwise vs logical).',
    'Signed right shift >> vs unsigned >>> confusion.',
    'XOR swap without checking distinct references (same var bug).',
  ],
  interview: {
    expectations: ['XOR cancel property', 'Mask with AND/OR', 'O(n) single pass'],
    commonQuestions: ['Single Number', 'Missing Number', 'Reverse Bits'],
    followUps: ['Two missing numbers?', 'General k occurrences?'],
    misconceptions: ['XOR encrypts data', 'OR and addition same'],
    traps: ['Integer.MIN_VALUE edge in abs', '32-bit vs 64-bit'],
    strongSignals: ['States XOR identities', 'Uses n & (n-1) for bit count'],
  },
  patternRecognition: [
    'The task combines flags, masks, permissions, or parity using bitwise operators.',
    'Each integer represents a set of enabled binary features.',
    'XOR cancellation or AND/OR aggregation is more direct than per-bit loops.',
  ],
  commonMistakes: [
    'Using logical && or || instead of bitwise & or | on integer masks.',
    'Expecting XOR to behave like addition when duplicate values are present.',
    'Ignoring Java operator precedence when mixing shifts and bitwise operations.',
    'Using signed right shift when a zero-filled unsigned shift is required.',
  ],
  keyTakeaways: [
    'XOR cancels duplicates: a^a=0.',
    'AND masks; OR sets; XOR toggles/differs.',
    'n & (n-1) drops lowest set bit.',
    'Use >>> for logical right shift in Java.',
    'Single Number I: XOR entire array.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'XOR all numbers where one unique?', answerHint: 'XOR every element; pairs cancel to 0; result is unique.' },
    { level: 'intermediate', question: 'Difference AND vs &&?', answerHint: 'Bitwise & on ints bit-by-bit; && short-circuit logical on booleans.' },
    { level: 'advanced', question: 'Two numbers appear once, rest twice?', answerHint: 'XOR all → xor=a^b; pick any set bit in xor; partition nums by that bit, XOR each group.' },
  ],
  flashcards: [
    { front: 'a ^ a', back: '0.' },
    { front: 'Remove lowest set bit', back: 'n & (n - 1).' },
  ],
  quickRevision: [
    'XOR cancel duplicates',
    'AND mask check bit',
    'OR set bits',
    'n & (n-1) bit trick',
    '>>> logical shift Java',
    'a^0=a',
    'O(n) XOR scan',
  ],
}
