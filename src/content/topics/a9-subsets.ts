import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Subsets (power set) generates all 2^n combinations of elements from an array, typically via backtracking: at each index, choose to include or exclude the current element. Order of elements within a subset usually does not matter; duplicate handling requires sorting + skip rules.',
  whyExists:
    'Many problems reduce to exploring all subsets: partition problems, bitmask DP seeds, feature selection, and "pick any combination" search. Backtracking builds subsets incrementally without storing all 2^n upfront until needed.',
  mentalModel:
    'Binary decision tree at each index: left branch exclude nums[i], right branch include nums[i]. Leaf at index n yields one complete subset. Copy path into answer at each leaf.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Start empty path, index i = 0.',
        'Base: i == n → add copy of path to answer.',
        'Exclude: backtrack(i + 1) without adding.',
        'Include: path.add(nums[i]), backtrack(i + 1), path.remove last.',
        'Duplicates: sort array; skip nums[i] when i > start && nums[i] == nums[i-1].',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Copy vs reference',
      text: 'Always ans.add(new ArrayList<>(path)) at leaf. Adding path directly shares one mutable list across all answers.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'nums = [1,2,3] → [], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]. Eight subsets = 2^3.',
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Subsets backtracking template',
      code: `void backtrack(int[] nums, int i, List<Integer> path, List<List<Integer>> ans) {
    if (i == nums.length) {
        ans.add(new ArrayList<>(path));
        return;
    }
    backtrack(nums, i + 1, path, ans);           // exclude
    path.add(nums[i]);
    backtrack(nums, i + 1, path, ans);           // include
    path.remove(path.size() - 1);
}`,
    },
  ],
  complexity: {
    average: 'O(n · 2^n) time to build all subsets',
    worst: 'O(n · 2^n) each subset copied in O(n)',
    space: 'O(n) recursion depth + output size',
  },
  tradeoffs: {
    advantages: ['Clear recursive structure', 'Easy to extend to duplicates/constraints', 'Natural for interview explanation'],
    disadvantages: ['Exponential output', 'Stack depth O(n)', 'Iterative bitmask less intuitive to explain'],
    alternatives: ['Bitmask loop 0..2^n-1', 'BFS level-by-level subset growth'],
    whenToUse: ['Generate all subsets', 'Subset sum search with pruning', 'Warm-up backtracking pattern'],
    whenNotToUse: ['Only need count → DP/bitmask math', 'n > 20 without pruning'],
  },
  failureModes: [
    'Forgetting to copy path → all answers reference same list.',
    'Not removing after include → path polluted for exclude branch.',
    'Duplicate subsets when input has repeats without skip logic.',
  ],
  interview: {
    expectations: ['Include/exclude at each index', 'O(n·2^n) complexity', 'Handle duplicates with sort + skip'],
    commonQuestions: ['Subsets', 'Subsets II (duplicates)', 'Partition to Equal Sum (subset variant)'],
    followUps: ['Iterative bitmask approach?', 'Subsets of size k only?'],
    misconceptions: ['Must use bitmask', 'Order of building matters for correctness'],
    traps: ['Mutable list reference bug', 'Skip duplicate logic off-by-one on index'],
    strongSignals: ['Clean undo after include', 'States copy explicitly at base case'],
  },
  patternRecognition: [
    'The prompt asks for every subset, selection, or power-set possibility.',
    'Each input element has an independent include/exclude decision.',
    'The expected output count is 2^n and n is small enough to enumerate it.',
  ],
  commonMistakes: [
    'Adding the same mutable path reference to every result.',
    'Forgetting to remove an included element before exploring a sibling branch.',
    'Treating subsets as permutations and producing duplicate orders.',
    'Skipping duplicate values without sorting or without checking the current recursion level.',
  ],
  keyTakeaways: [
    'Subsets = include/exclude decision at every index.',
    'Base case i == n: snapshot path into answer.',
    'Always clone path when storing: new ArrayList<>(path).',
    '2^n subsets; time O(n·2^n) with output.',
    'Duplicates: sort + skip same value at same recursion level.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'How many subsets of n distinct elements?', answerHint: '2^n including empty set.' },
    { level: 'intermediate', question: 'Backtracking template for subsets?', answerHint: 'At index i: recurse exclude, then include with add/recurse/remove.' },
    { level: 'advanced', question: 'Subsets II with duplicates?', answerHint: 'Sort; skip nums[i] if i > start && nums[i] == nums[i-1] on same level.' },
  ],
  flashcards: [
    { front: 'Subsets count for n elements', back: '2^n.' },
    { front: 'Critical bug when storing path', back: 'Must copy list; never store mutable path reference.' },
  ],
  quickRevision: [
    'Include/exclude at each index',
    'Base: i == n → copy path',
    'Undo: path.remove after include branch',
    'Time O(n·2^n)',
    'Duplicates: sort + skip same level',
    'Bitmask alternative: 0..2^n-1',
    'Stack depth O(n)',
  ],
}
