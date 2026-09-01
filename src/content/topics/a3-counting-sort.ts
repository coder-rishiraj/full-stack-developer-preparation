import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Counting sort is a non-comparison integer sort that builds a frequency array cnt[v] for each key v, prefix-sums cnt to get positions, then writes elements to output in stable reverse pass. Time O(n + k) where k is the value range (max - min + 1).',
  whyExists:
    'When keys lie in a small bounded range relative to n—ages 0-120, scores 0-100, characters in ASCII—counting sort beats O(n log n) comparison sorts with linear time and predictable memory.',
  mentalModel:
    'Tally marks per value: count how many of each number exist, convert counts to starting positions via prefix sum, then place each element at its slot walking backwards to preserve stability.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Find min and max (or given k) to size frequency array.',
        'Count: for each a[i], cnt[a[i] - min]++.',
        'Prefix sum: cnt[i] += cnt[i-1] so cnt[v] = last position of value v.',
        'Stable output: iterate a from end; out[--cnt[a[i]-min]] = a[i].',
        'For negative numbers: offset by min so index ≥ 0.',
        'In-place variant possible when writing back to array if range small.',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'k vs n tradeoff',
      text: 'If k >> n (e.g. sorting 100 numbers in range 0 to 10⁹), counting sort wastes space—use comparison sort or coordinate compress first.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Array [4, 2, 2, 8] with min=2, max=8: cnt after tally [0,2,0,0,0,0,1] for values 2,3,...,8; prefix [0,2,2,2,2,2,3]; stable reverse pass yields [2,2,4,8].',
    },
    {
      type: 'table',
      headers: ['step', 'operation', 'result'],
      rows: [
        ['Count', 'cnt[v]++ for each element', 'frequency per value'],
        ['Prefix', 'cnt[i] += cnt[i-1]', 'end positions per value'],
        ['Place', 'walk a backwards, out[--cnt[v]]=v', 'stable sorted output'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Stable counting sort with offset for negatives',
      code: `int[] countingSort(int[] a) {
    int min = a[0], max = a[0];
    for (int v : a) { min = Math.min(min, v); max = Math.max(max, v); }
    int k = max - min + 1;
    int[] cnt = new int[k];
    for (int v : a) cnt[v - min]++;
    for (int i = 1; i < k; i++) cnt[i] += cnt[i - 1];
    int[] out = new int[a.length];
    for (int i = a.length - 1; i >= 0; i--) {
        int v = a[i];
        out[--cnt[v - min]] = v;
    }
    return out;
}`,
    },
    {
      language: 'java',
      caption: 'Sort in-place when range equals max value (non-negative)',
      code: `void countingSortInPlace(int[] a, int k) {
    int[] cnt = new int[k + 1];
    for (int v : a) cnt[v]++;
    int idx = 0;
    for (int v = 0; v <= k; v++)
        for (int c = 0; c < cnt[v]; c++)
            a[idx++] = v;
}`,
    },
  ],
  complexity: {
    best: 'O(n + k) always',
    average: 'O(n + k)',
    worst: 'O(n + k) — not comparison-dependent',
    space: 'O(n + k) for cnt and output',
  },
  patternRecognition: [
    'Sort integers in small range [0, k].',
    'Sort characters in string (26 or 256 alphabet).',
    'Building block for radix sort (count by digit).',
    'Find missing number / duplicate when range bounded.',
  ],
  commonMistakes: [
    'Using counting sort when k >> n — memory blowup.',
    'Forward pass on output — breaks stability.',
    'Forgetting offset for negative min.',
    'Off-by-one on array size (k = max - min + 1).',
  ],
  tradeoffs: {
    advantages: [
      'O(n + k) linear when k small',
      'Stable with reverse placement pass',
      'Simple array operations, cache-friendly for small k',
      'Subroutine for radix sort',
    ],
    disadvantages: [
      'Only integer-like keys in bounded range',
      'O(k) space even if few distinct values when range large',
      'Not in-place in stable form',
    ],
    alternatives: ['Bucket sort for uniform continuous range', 'Radix sort for large range multi-digit', 'Merge sort when k >> n'],
    whenToUse: ['k = O(n) or k small constant', 'Stable sort on bounded integers', 'Radix sort digit pass'],
    whenNotToUse: ['Huge key range sparse values', 'Non-integer keys', 'Memory limited and k large'],
  },
  failureModes: [
    'ArrayIndexOutOfBounds when value outside [min, max] assumed range.',
    'Integer overflow if k computed from huge max-min.',
    'Unstable forward placement scrambles equal elements.',
  ],
  interview: {
    expectations: [
      'O(n + k) time and space',
      'Stable reverse iteration for output',
      'Handle negatives via min offset',
    ],
    commonQuestions: ['Sort Colors (0,1,2)', 'Counting sort vs bucket sort', 'Why walk backwards?'],
    followUps: ['When k >> n?', 'Use in radix sort?', 'Sort negative integers?'],
    misconceptions: ['Works for any integers regardless of range', 'Same as bucket sort', 'Always better than O(n log n)'],
    traps: ['Forgetting +1 in range size', 'Not stable if skip reverse pass'],
    strongSignals: ['Explains prefix sum as end positions', 'States k vs n precondition', 'Mentions radix sort extension'],
  },
  keyTakeaways: [
    'Frequency array + prefix sum + stable reverse placement.',
    'O(n + k) time; k must be reasonable vs n.',
    'Offset by min for negative keys.',
    'Stable: iterate input from right, decrement cnt slot.',
    'Radix sort uses counting sort per digit.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Counting sort time complexity?', answerHint: 'O(n + k) where k is value range width.' },
    { level: 'intermediate', question: 'Why iterate backwards for stable output?', answerHint: 'Decrementing position counter places later equal elements after earlier ones.' },
    { level: 'advanced', question: 'When does counting sort lose to merge sort?', answerHint: 'When k >> n — O(k) space/time dominates; sparse huge range needs comparison or compression.' },
  ],
  flashcards: [
    { front: 'Counting sort time', back: 'O(n + k) where k = max - min + 1.' },
    { front: 'Stability trick', back: 'Place elements walking input array backwards.' },
    { front: 'Negative numbers', back: 'Offset indices by subtracting min from each value.' },
  ],
  quickRevision: [
    'cnt[v] frequency array',
    'Prefix sum → positions',
    'Reverse pass for stability',
    'O(n + k) time and space',
    'Offset by min for negatives',
    'k must be O(n) or small',
    'Digit pass in radix sort',
  ],
}
