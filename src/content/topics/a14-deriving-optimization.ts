import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Deriving optimized solutions means identifying the bottleneck in a slow approach and applying a pattern—hash map, two pointers, sorting+greedy, DP, heap—to eliminate redundant work. The derivation should be explainable, not memorized.',
  whyExists:
    'Interviewers test problem decomposition, not catalog recall. Showing how you get from O(n²) to O(n log n) demonstrates engineering judgment reusable on unseen problems.',
  mentalModel:
    'Profiler for your algorithm: find the hot loop doing duplicate work, then insert the right index (map, sort order, memo table) so that work happens once.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Profile brute: nested loops → often map or sort removes inner scan.',
        'Overlapping subproblems → memo/tabulation.',
        'Greedy choice safe → sort + scan.',
        'Monotonic structure → two pointers or heap.',
        'Verify with counterexample hunt before coding.',
      ],
    },
    {
      type: 'table',
      headers: ['Bottleneck', 'Common fix'],
      rows: [
        ['Repeated lookup', 'HashMap/Set'],
        ['Sorted order need', 'Sort O(n log n)'],
        ['Optimal substructure', 'DP'],
        ['Best current candidate', 'Heap'],
        ['Pair with sorted array', 'Two pointers'],
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Two Sum brute O(n²) inner scan for complement → HashMap stores seen values for O(1) lookup → O(n) total.',
    },
  ],
  tradeoffs: {
    advantages: ['Transferable skill', 'Stronger than pattern name-dropping', 'Catches wrong pattern early'],
    disadvantages: ['Slower than instant recall on known problems', 'Requires practice articulating'],
    alternatives: ['Pattern recognition after many problems', 'Draw small example table'],
    whenToUse: ['After stating brute', 'When stuck mid-problem'],
    whenNotToUse: ['Do not fake derivation if you only memorized—still trace example'],
  },
  failureModes: [
    'Name pattern without linking to bottleneck.',
    'Wrong optimization breaks correctness.',
    'Skip proof on greedy—fail weighted variant.',
  ],
  interview: {
    expectations: ['Explicit bottleneck', 'Pattern justified', 'Complexity before and after'],
    commonQuestions: ['Optimize brute subarray sum', 'From recursion to DP'],
    followUps: ['Prove greedy?', 'Trade space for time?'],
    misconceptions: ['Must know optimal instantly', 'Memorizing 100 patterns enough'],
    traps: ['Optimize wrong dimension', 'Miss need for sort first'],
    strongSignals: ['Small example drives insight', 'States before/after complexity'],
  },
  keyTakeaways: [
    'Optimization = remove redundant work identified in brute.',
    'Map removes re-scan; sort enables two-pointer/greedy.',
    'Memo removes overlapping recursion.',
    'Say before/after Big-O when deriving.',
    'Validate with example and counterexample.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'How derive HashMap optimization?', answerHint: 'Brute rescans for complement; store seen values for O(1) lookup.' },
    { level: 'intermediate', question: 'When sort unlocks greedy?', answerHint: 'When local choice after ordering is provably safe e.g. interval end times.' },
    { level: 'advanced', question: 'Recursion to DP steps?', answerHint: 'Write recurrence, note repeated states, add memo or bottom-up table.' },
  ],
  flashcards: [
    { front: 'Derive optimization first step', back: 'Find bottleneck in brute force.' },
    { front: 'Overlapping subproblems fix', back: 'Memoization or tabulation.' },
  ],
  quickRevision: [
    'Profile brute loops',
    'Map kills inner scan',
    'Sort enables greedy/2ptr',
    'Memo for overlap',
    'State complexity delta',
    'Counterexample greedy',
    'Example drives insight',
  ],
}
