import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Frequency counting tracks how many times each key (character, number, value) appears using a hash map or fixed-size array, enabling anagram checks, majority elements, and constraint validation in O(n) time.',
  whyExists:
    'Many problems ask “does multiset A match B?” or “which value appears most?” without requiring order. Counting collapses order and gives O(1) lookups per update after O(n) aggregation.',
  mentalModel:
    'Tally marks on a scoreboard: each element increments its bucket. Compare boards, or find the bucket above half the total votes.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Pick container: int[26] for lowercase letters, int[128] for ASCII, HashMap for sparse/general keys.',
        'Single pass: increment count for each element (or decrement for second stream).',
        'Query: compare maps, check all counts zero, or track running max/majority.',
        'Optional second pass: build result from counts (anagram grouping, top-k).',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Array vs HashMap',
      text: 'Fixed alphabet → array is faster and O(Σ) space. Sparse or unbounded keys → HashMap. Anagram cancel: increment s, decrement t, all zeros.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  E[element] --> Inc[count key++]
  Inc --> Map[(freq map)]
  Map --> Q{query}
  Q --> Anagram[all counts 0?]
  Q --> Majority[any count > n/2?]`,
    caption: 'Frequency map update and query paths',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Valid anagram "anagram" vs "nagaram": 26-length array; +1 per char in s, −1 per char in t; all entries 0 → valid.',
    },
    {
      type: 'table',
      headers: ['key', 'after s', 'after t', 'valid?'],
      rows: [
        ['a', '3', '3', 'yes'],
        ['n', '1', '1', 'yes'],
        ['z', '0', '0', 'yes'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Fixed alphabet frequency (26 letters)',
      code: `int[] freq = new int[26];
for (char c : s.toCharArray()) freq[c - 'a']++;
for (char c : t.toCharArray()) {
    if (--freq[c - 'a'] < 0) return false;
}
return true;`,
    },
    {
      language: 'java',
      caption: 'HashMap frequency',
      code: `Map<Integer, Integer> freq = new HashMap<>();
for (int x : nums) {
    freq.merge(x, 1, Integer::sum);
}
// freq.getOrDefault(x, 0)`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Majority element (Boyer-Moore vote',
      code: `public int majorityElement(int[] nums) {
    int cand = 0, votes = 0;
    for (int x : nums) {
        if (votes == 0) cand = x;
        votes += (x == cand) ? 1 : -1;
    }
    return cand; // verify if not guaranteed
}`,
    },
  ],
  complexity: {
    best: 'O(n) one pass',
    average: 'O(n)',
    worst: 'O(n) + O(k) for k distinct keys',
    space: 'O(1) for fixed alphabet; O(k) for HashMap',
  },
  patternRecognition: [
    'Anagram, permutation, or same-multiset questions.',
    'Find duplicate, missing number, or element appearing > n/2.',
    'Window/substring with “at most K distinct” → frequency map state.',
    'Group by canonical key (sorted string, count signature).',
    'Two strings/arrays compared without caring about order.',
  ],
  commonMistakes: [
    'Using HashMap when int[26] suffices (slower, more allocation).',
    'Forgetting to handle negative counts in anagram cancel logic.',
    'Off-by-one on majority threshold (strictly > n/2 vs ≥).',
    'Not clearing map entries when sliding window shrinks (distinct count wrong).',
    'Assuming Boyer-Moore answer without verification when not guaranteed.',
  ],
  variations: [
    'Count array as anagram signature key',
    'Multiset with TreeMap for sorted keys',
    'Frequency + heap for top K frequent',
    'Prefix of counts for rolling hash / substring match',
  ],
  tradeoffs: {
    advantages: [
      'O(n) aggregation, simple code',
      'Order-independent comparisons',
      'Natural window state for distinct constraints',
    ],
    disadvantages: [
      'O(k) space for k distinct keys',
      'Does not preserve positional information',
    ],
    alternatives: ['Sort both strings O(n log n)', 'Bit XOR for single duplicate/missing in limited sets', 'Sliding window without full recount'],
    whenToUse: ['Multiset equality', 'Majority/top-k', 'Character budget constraints'],
    whenNotToUse: ['Order matters', 'Need subsequence not substring'],
  },
  failureModes: [
    'Integer keys boxed in HashMap with bad hash → TLE on adversarial input (use arrays when possible).',
    'Window shrink without decrement → inflated counts.',
  ],
  interview: {
    expectations: [
      'Choose array vs map with justification',
      'State time/space in terms of n and alphabet size',
      'Handle empty strings and Unicode if asked',
    ],
    commonQuestions: [
      'Valid Anagram',
      'Group Anagrams',
      'Top K Frequent Elements',
      'Majority Element',
    ],
    followUps: ['Follow-up: O(1) space majority?', 'Group anagrams key design?'],
    misconceptions: ['Always need HashMap for frequency'],
    traps: ['Ransom note: decrement without checking availability first', 'Top K: sort all O(n log n) when heap is O(n log k)'],
    strongSignals: ['Picks int[26] for lowercase', 'Mentions cancel pattern for two-stream compare'],
  },
  keyTakeaways: [
    'Fixed alphabet → array beats HashMap.',
    'Anagram = increment one stream, decrement other, all zero.',
    'Frequency map = common sliding-window state.',
    'Boyer-Moore for majority in O(1) space.',
    'Signature key (sorted/count array) for grouping.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'How do you check two strings are anagrams in O(n)?',
      answerHint: 'Count array size 26; +1 s, −1 t; any negative → false.',
    },
    {
      level: 'intermediate',
      question: 'What key groups anagrams efficiently?',
      answerHint: 'Sorted string O(k log k) or count signature int[26] as string/key.',
    },
    {
      level: 'advanced',
      question: 'Explain Boyer-Moore majority voting.',
      answerHint: 'Cancel different pairs; surviving candidate is majority if one exists; verify with second pass if needed.',
    },
  ],
  flashcards: [
    { front: 'Anagram check space (a-z)', back: 'O(1) — int[26].' },
    { front: 'Sliding window distinct count mistake', back: 'Forget to decrement/remove key when count hits 0.' },
  ],
  quickRevision: [
    'Multiset → frequency map/array',
    'a-z → int[26], not HashMap',
    'Anagram cancel: +s −t all zero',
    'Window state = char counts',
    'Boyer-Moore O(1) space majority',
    'Group anagrams: count signature key',
  ],
}
