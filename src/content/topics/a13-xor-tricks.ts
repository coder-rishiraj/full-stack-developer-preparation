import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'XOR tricks exploit properties: a^a=0, a^0=a, commutative/associative XOR. Find single unique number in pairs, missing number, swap without temp, detect duplicate with xor, and partition by bit for "single number II" variants.',
  whyExists:
    'Many array problems hide linear-time O(1)-space solutions via XOR cancellation—interviews test whether you know bitwise algebra instead of HashMap counting.',
  mentalModel:
    'Duplicate pairs cancel to zero in XOR pile; what remains is the odd-occurring or missing element. Each bit position independent—process bit-by-bit for mod-3 counts.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Single Number I: xor all nums—pairs cancel, lone remains.',
        'Missing Number: xor index i with a[i] for all i—or xor 0..n with all array.',
        'Swap a,b: a^=b; b^=a; a^=b (works on distinct references/values).',
        'Find two singles: xor all → any set bit separates groups; xor each half.',
        'Single Number II (3x each except one): count bits mod 3 per position.',
        'a^b^c = 0 iff a^b = c—parity reasoning.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: '[4,1,2,1,2] xor: 4^1^2^1^2 = 4^(1^1)^(2^2) = 4. Missing in [0,3,1]: i^a[i] for i=0..3 → 0^0^1^3^1^2 = 2.',
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Single Number I',
      code: `int singleNumber(int[] nums) {
    int x = 0;
    for (int n : nums) x ^= n;
    return x;
}`,
    },
    {
      language: 'java',
      caption: 'Missing Number (0..n)',
      code: `int missingNumber(int[] nums) {
    int x = nums.length;
    for (int i = 0; i < nums.length; i++)
        x ^= i ^ nums[i];
    return x;
}`,
    },
    {
      language: 'java',
      caption: 'Swap without temp',
      code: `void swap(int[] a, int i, int j) {
    if (i == j) return;
    a[i] ^= a[j];
    a[j] ^= a[i];
    a[i] ^= a[j];
}`,
    },
    {
      language: 'java',
      caption: 'Two single numbers (rest paired)',
      code: `int[] singleNumbers(int[] nums) {
    int xor = 0;
    for (int n : nums) xor ^= n;
    int lowbit = xor & -xor;
    int a = 0, b = 0;
    for (int n : nums)
        if ((n & lowbit) != 0) a ^= n;
        else b ^= n;
    return new int[]{a, b};
}`,
    },
  ],
  complexity: {
    average: 'O(n) single pass; O(1) extra space for xor tricks',
    space: 'O(1)',
  },
  patternRecognition: [
    'Single Number I/II/III.',
    'Missing Number.',
    'Find duplicate without extra space (xor cycle different—Floyd).',
    'Maximum XOR of two numbers in array (trie on bits).',
  ],
  commonMistakes: [
    'Xor swap on same index aliasing—no-op or wrong.',
    'Single Number II using xor only—need bit count mod 3.',
    'Signed shift confusion with >> vs >>>.',
    'lowbit = xor & -xor only works for nonzero xor.',
  ],
  tradeoffs: {
    advantages: [
      'O(n) time O(1) space',
      'Elegant cancel pairs',
      'Fast bitwise ops',
    ],
    disadvantages: [
      'Only works for specific algebraic structures',
      'Not general counting (need hash or sort)',
      'Swap xor obscure vs temp variable',
    ],
    alternatives: ['HashMap frequency', 'Sort for duplicates', 'Sum formula for missing if no overflow concern'],
    whenToUse: ['Exactly one odd frequency', 'Pairs cancel rest unique', 'Missing one in 0..n set'],
    whenNotToUse: ['Three+ distinct odd counts without bit mod', 'Need stable order'],
  },
  failureModes: [
    'Overflow not issue for xor; sum formula missing number overflows int.',
    'Xor swap if a[i]==a[j] zeros element.',
    'Two singles: xor=0 if misread problem.',
  ],
  interview: {
    expectations: [
      'a^a=0, xor all cancels pairs',
      'Missing: xor indices and values',
      'Two singles: split by lowbit',
    ],
    commonQuestions: ['Single Number', 'Missing Number', 'Two single numbers'],
    followUps: ['Single Number II mod 3?', 'Maximum XOR pair?', 'Why xor swap works?'],
    misconceptions: ['HashMap always required', 'Xor works for three duplicates each', 'Swap xor production style'],
    traps: ['Same index xor swap', 'Forget lowbit split for two uniques'],
    strongSignals: ['States xor properties', 'Derives missing xor loop', 'Knows mod-3 bit counting for II'],
  },
  keyTakeaways: [
    'Xor cancels equal pairs: xor all → unique.',
    'Missing: xor i ^ a[i] or xor 0..n ^ all elements.',
    'Two uniques: xor split by any set bit (lowbit).',
    'Single Number II: count each bit mod 3.',
    'Swap via xor only distinct indices.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why xor finds single number among pairs?', answerHint: 'a^a=0, xor commutative—duplicates cancel; lone value remains.' },
    { level: 'intermediate', question: 'Two numbers appear once, rest twice?', answerHint: 'Xor all → x^y; pick lowbit of xor to partition array into two groups; xor each group separately.' },
    { level: 'advanced', question: 'Every number appears 3 times except one?', answerHint: 'Count ones per bit position mod 3; reconstruct answer bit by bit—not plain xor.' },
  ],
  flashcards: [
    { front: 'Xor pair cancel', back: 'a ^ a = 0.' },
    { front: 'Missing number xor trick', back: 'Xor all indices 0..n with all array values.' },
    { front: 'Split two singles', back: 'lowbit = xor & -xor; xor nums with/without bit set separately.' },
  ],
  quickRevision: [
    'a^a=0, a^0=a',
    'Xor all → single',
    'Missing: xor i^a[i]',
    'Two singles: lowbit split',
    'II: bit count mod 3',
    'Swap xor distinct i,j',
    'O(n) O(1) space',
  ],
}
