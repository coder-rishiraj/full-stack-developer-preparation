import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Space complexity measures extra memory beyond input storage as a function of n—auxiliary structures (maps, queues, recursion stack, output)—often expressed in Big-O alongside time.',
  whyExists:
    'Problems cap memory (256 MB). Recursion depth, storing all subsets, or n×n matrices can MLE. Interviewers ask “space?” to check you track HashMap, stack frames, and in-place optimizations.',
  mentalModel:
    'Count bytes/ objects you allocate beyond input: HashMap of size n → O(n); recursion depth d → O(d) stack; in-place pointer swap on array → O(1) auxiliary if output not counted.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Step 1 — Time asks “how long?” Space asks “how much extra memory?” Both use Big-O in n. Input already occupies memory; interviewers usually care about auxiliary space—maps, queues, recursion stack, DP tables—unless they say otherwise.',
    },
    {
      type: 'paragraph',
      text: 'Step 2 — Say it clearly. “O(n) time, O(1) auxiliary space” means you may reuse the input array with a few pointers. “O(n) space” often means a HashSet or copy of size n. Always clarify whether output is counted.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Auxiliary space: working memory excluding input (unless the problem says otherwise).',
        'Output space often excluded in analysis but clarify in interview.',
        'In-place: O(1) extra if only pointers/indices on the input array.',
        'Recursion: O(depth) stack frames; each frame O(1) or O(local array).',
        'Copying input (toCharArray, clone) counts O(n) extra.',
      ],
    },
    {
      type: 'table',
      headers: ['Structure', 'Space'],
      rows: [
        ['HashMap/HashSet n entries', 'O(n)'],
        ['Adjacency list V,E', 'O(V + E)'],
        ['Recursion depth d', 'O(d) stack'],
        ['n×n DP table', 'O(n²)'],
        ['Two pointers on array', 'O(1) aux'],
        ['Sort in place', 'O(log n) stack for TimSort or O(1) if allowed'],
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Space tradeoffs',
      code: `// O(1) aux: reverse array in place
void reverse(int[] a) {
    for (int l = 0, r = a.length - 1; l < r; l++, r--) {
        int t = a[l]; a[l] = a[r]; a[r] = t;
    }
}

// O(n) aux: frequency map
Map<Integer, Integer> freq = new HashMap<>();

// O(h) stack: tree DFS recursion height h`,
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Interview convention',
      text: 'Say “O(n) auxiliary for the HashMap” vs “O(1) auxiliary, O(n) output if returning all subsets.” Clarity beats ambiguity.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Merge intervals after sort: sort may O(n) or O(log n) stack; result list up to n intervals → O(n) output. Auxiliary beyond output: O(1) if sort space not counted.',
    },
  ],
  complexity: {
    space: 'Report auxiliary separately from output when possible',
    notes: 'Java object overhead: Integer boxed in HashMap larger than int[] freq[range].',
  },
  patternRecognition: [
    'Memo/DP table size = state count.',
    'BFS queue worst case last level O(n) nodes in tree.',
    'Backtracking path list depth O(n) plus result storage exponential.',
    'Rolling DP: reduce O(n) array to O(1) when only prior row needed.',
  ],
  commonMistakes: [
    'Claiming O(1) while building size-n HashMap.',
    'Ignoring recursion stack in DFS depth n.',
    'Forgetting output list size (all subsets 2^n strings).',
    'Counting input array in auxiliary space without problem saying so.',
  ],
  tradeoffs: {
    advantages: ['Space-time trade common: map for O(n) time', 'Rolling array saves memory'],
    disadvantages: ['In-place often harder to code'],
    alternatives: ['HashMap vs sorted array if memory tight', 'Iterative vs recursive stack'],
    whenToUse: ['Always state with time analysis'],
    whenNotToUse: ['—'],
  },
  failureModes: [
    'MLE from storing all O(2^n) subsets as lists.',
    'StackOverflow from O(n) recursion depth plus large local arrays per frame.',
  ],
  interview: {
    expectations: ['Auxiliary vs total space', 'Recursion stack included'],
    commonQuestions: ['Space of your Two Sum?', 'Can you reduce DP space?'],
    followUps: ['In-place possible?', 'Why rolling array?'],
    misconceptions: ['Only count heap objects—not stack'],
    traps: ['Subsets problem: output exponential'],
    strongSignals: ['Separates aux O(n) map from O(k) output'],
  },
  keyTakeaways: [
    'Auxiliary vs output—state both clearly.',
    'HashMap/Set of n → O(n) space.',
    'Recursion adds O(depth) stack.',
    'In-place two pointers → O(1) aux.',
    'Rolling DP can drop dimension.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Space of HashMap Two Sum?',
      answerHint: 'O(n) auxiliary for map storing up to n entries.',
    },
    {
      level: 'intermediate',
      question: 'DFS binary tree space?',
      answerHint: 'O(h) recursion stack; h=log n balanced, n skewed.',
    },
    {
      level: 'advanced',
      question: 'Reduce 2D DP O(nm) to O(n)?',
      answerHint: 'Keep only previous row if transition uses row i-1 only; rolling array size m.',
    },
  ],
  flashcards: [
    {
      front: 'Recursion space cost',
      back: 'O(call depth) stack frames; not free.',
    },
    {
      front: 'In-place array algo aux space',
      back: 'O(1) extra if only indices/swaps on input.',
    },
  ],
  quickRevision: [
    'Auxiliary vs output',
    'Map/Set n → O(n)',
    'Stack depth = recursion space',
    'In-place O(1) aux',
    'Subsets output exponential',
    'Rolling DP saves space',
  ],
}
