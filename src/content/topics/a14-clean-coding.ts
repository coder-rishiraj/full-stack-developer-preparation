import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Clean coding without IDE assistance means writing compilable, readable code on a whiteboard or shared editor—meaningful names, consistent structure, helper methods when needed, balanced braces, and avoiding reliance on autocomplete or quick fixes.',
  whyExists:
    'Interviews simulate constrained environments. Messy code hides logic errors and signals weak fundamentals. Clean structure helps you debug manually and helps interviewers follow.',
  mentalModel:
    'Write code someone else will review tomorrow: small functions, clear names, no magic indices without comment.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Use descriptive names: lo, hi, mid not l, h, m ambiguously.',
        'Extract helper dfs/backtrack when main grows long.',
        'Define class/function signature before body.',
        'Leave balanced braces; indent consistently.',
        'Avoid unused imports/variables; pick one language confidently.',
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Clean interview function structure',
      code: `public int solve(int[] nums, int target) {
    if (nums == null || nums.length == 0) return -1;
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];
        if (seen.containsKey(need)) return seen.get(need);
        seen.put(nums[i], i);
    }
    return -1;
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Extract dfs helper with clear parameters (index, path, target) instead of 80-line nested loops in main.',
    },
  ],
  tradeoffs: {
    advantages: ['Easier manual trace', 'Better impression', 'Fewer syntax derailments'],
    disadvantages: ['Slightly slower than sloppy rush', 'Perfectionism can delay start'],
    alternatives: ['Pseudocode first then code', 'Skeleton then fill'],
    whenToUse: ['All live coding', 'When nervous—structure calms'],
    whenNotToUse: ['Do not refactor working code endlessly at end'],
  },
  failureModes: [
    'Single-letter variables everywhere.',
    '200-line main without helpers.',
    'Language switching mid-problem.',
  ],
  interview: {
    expectations: ['Readable without IDE', 'Consistent style', 'Reasonable decomposition'],
    commonQuestions: ['Evaluate code quality rubric', 'Refactor messy snippet'],
    followUps: ['Extract helper?', 'Naming improvement?'],
    misconceptions: ['Only algorithm graded', 'Comments replace clarity'],
    traps: ['Off-by-one hidden in messy loops', 'Missing return path'],
    strongSignals: ['Guard clauses upfront', 'Helpers for backtrack/dfs'],
  },
  keyTakeaways: [
    'Clear names and small functions beat clever one-liners.',
    'Write signature and outline before details.',
    'Stick to one language you know cold.',
    'Helpers for recursion/backtracking templates.',
    'Readable code helps you debug manually.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Clean coding without IDE tips?', answerHint: 'Descriptive names, guard clauses, consistent braces, one language.' },
    { level: 'intermediate', question: 'When extract helper in interview?', answerHint: 'Recursive/backtrack core, repeated logic, or main exceeds ~30 lines.' },
    { level: 'advanced', question: 'Balance speed vs cleanliness?', answerHint: 'Skeleton and correct structure first; polish names if time; never skip guards on edges.' },
  ],
  flashcards: [
    { front: 'Interview naming', back: 'Descriptive lo/hi/target not single letters.' },
    { front: 'Before coding body', back: 'Function signature and brief outline.' },
  ],
  quickRevision: [
    'Meaningful names',
    'Guard clauses first',
    'Helper for dfs/backtrack',
    'One language stick',
    'Balanced braces indent',
    'Outline before fill',
    'Readable = debuggable',
  ],
}
