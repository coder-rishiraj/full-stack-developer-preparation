import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Complexity analysis in interviews means stating time and space Big-O for your solution, explaining dominant terms, and accounting for sorting, nested loops, recursion depth, and auxiliary structures. Brief justification beats memorized formula.',
  whyExists:
    'Correct asymptotic analysis proves scalability awareness. Wrong analysis (calling nested loops O(n)) is a common rejection signal even when code works on small tests.',
  mentalModel:
    'Count the most expensive repeated operation and multiply by how often it runs—that is your Big-O story.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Single loop O(n); nested O(n²); halving O(log n).',
        'Sort dominates O(n log n); mention if present.',
        'HashMap ops amortized O(1); heap ops O(log n).',
        'Space: output excluded sometimes; mention aux arrays.',
        'Recursion: depth × work per call; memo states count.',
      ],
    },
    {
      type: 'table',
      headers: ['Pattern', 'Time', 'Space'],
      rows: [
        ['Two pointers on sorted', 'O(n)', 'O(1)'],
        ['Sort + scan', 'O(n log n)', 'O(1)'],
        ['DFS tree n nodes', 'O(n)', 'O(h) stack'],
        ['DP m×n table', 'O(mn)', 'O(mn) or rolled'],
        ['Backtrack subsets', 'O(n·2^n)', 'O(n) stack'],
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Nested loop over n with HashMap lookups inside → O(n) not O(n²) because inner map ops are O(1).',
    },
  ],
  tradeoffs: {
    advantages: ['Shows maturity', 'Guides optimization conversation', 'Catches hidden sort cost'],
    disadvantages: ['Over-analysis delays coding', 'Amortized vs worst confusion'],
    alternatives: ['State best and worst if differs', 'Use tiny n numeric example'],
    whenToUse: ['After outlining approach', 'Before and after optimization'],
    whenNotToUse: ['Do not debate constants for 5 minutes unless asked'],
  },
  failureModes: [
    'Ignore sort in complexity.',
    'Claim O(n) with HashMap inside nested loop.',
    'Forget recursion stack space.',
  ],
  interview: {
    expectations: ['Correct dominant term', 'Mention space aux structures', 'Recursion depth'],
    commonQuestions: ['Analyze your solution', 'Can you do better?'],
    followUps: ['Amortized analysis?', 'Space optimize?'],
    misconceptions: ['Two loops always O(n²)—can be O(n) two pointers', 'Output size not counted same way always'],
    traps: ['Subsets output size exponential', 'Bitmask loops 2^n'],
    strongSignals: ['Separates time vs space', 'Notes when sort dominates'],
  },
  keyTakeaways: [
    'State time and space after approach.',
    'Include sort O(n log n) when used.',
    'Nested loops usually multiply; verify pointer loops.',
    'Recursion space = call stack depth.',
    'DP space often optimizable—mention if asked.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Complexity of single HashMap pass?', answerHint: 'O(n) time, O(n) space for map.' },
    { level: 'intermediate', question: 'Merge k sorted lists heap solution?', answerHint: 'O(n log k) time, O(k) heap space.' },
    { level: 'advanced', question: 'Space-optimized LCS?', answerHint: 'O(min(m,n)) rolling row vs O(mn) table.' },
  ],
  flashcards: [
    { front: 'Sort + one pass total time', back: 'O(n log n).' },
    { front: 'DFS tree space besides output', back: 'O(height) recursion stack.' },
  ],
  quickRevision: [
    'Dominant term wins',
    'Multiply nested loops',
    'Sort = n log n',
    'HashMap O(1) amortized',
    'Stack depth space',
    'Memo states for DP',
    'Say time and space',
  ],
}
