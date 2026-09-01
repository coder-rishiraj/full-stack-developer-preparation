import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Constraint-based backtracking assigns values to variables one at a time, checking constraints (all-different, sums, adjacency) before recursing deeper. Fail early when partial assignment violates rules—most branches never explored. N-Queens, Sudoku, and graph coloring are canonical examples.',
  whyExists:
    'Many combinatorial problems have strict feasibility rules; trying every assignment is infeasible. Checking constraints at each step prunes invalid subtrees and is the standard CSP (constraint satisfaction problem) approach in interviews.',
  mentalModel:
    'Fill slots left to right; before going deeper, ask "does this choice break any rule with prior choices?" If yes, skip without recursing. Undo assignment when returning.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Identify variables (cells, rows, nodes) and domain (1-9, colors).',
        'Order variables (MRV heuristic in production; fixed order in interviews).',
        'Try each domain value; if satisfies all constraints, assign and recurse.',
        'On return, unassign (backtrack).',
        'Optional forward checking: update remaining domains when assigning.',
      ],
    },
    {
      type: 'table',
      headers: ['Problem', 'Variables', 'Constraints'],
      rows: [
        ['N-Queens', 'Row → column', 'No shared col/diagonal'],
        ['Sudoku', 'Empty cells', 'Row/col/box unique 1-9'],
        ['Graph coloring', 'Vertices', 'Adjacent different color'],
        ['Partition equal subset', 'Include/exclude', 'Sum balance (prune)'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Generic constraint backtrack skeleton',
      code: `boolean backtrack(State state) {
    if (state.isComplete()) return state.isValidSolution();
    Variable v = state.nextVariable();
    for (Value val : v.domain()) {
        if (!state.satisfiesConstraints(v, val)) continue;
        state.assign(v, val);
        if (backtrack(state)) return true;
        state.unassign(v);
    }
    return false;
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Sudoku empty cell tries digits 1-9; recurse only if row, column, and 3×3 box remain valid—invalid digits pruned before deeper search.',
    },
  ],
  complexity: {
    notes: 'Worst exponential in variables; constraint checks reduce effective branching dramatically.',
    space: 'O(variables) recursion depth',
  },
  tradeoffs: {
    advantages: ['Early prune saves time', 'Matches problem structure', 'Extensible with heuristics'],
    disadvantages: ['Worst case still exponential', 'Constraint check cost per node', 'Heuristic choice affects performance'],
    alternatives: ['SAT solvers', 'Integer programming', 'DP when overlapping structure'],
    whenToUse: ['Assignment with local/global constraints', 'Small-medium search space with strong rules'],
    whenNotToUse: ['Optimal substructure without constraints → DP/greedy', 'Huge domains without prune'],
  },
  failureModes: [
    'Checking constraints only at leaf → wasted search.',
    'Incomplete constraint propagation (Sudoku missing box check).',
    'Forgetting to unassign on backtrack.',
  ],
  interview: {
    expectations: ['Validate before recurse', 'Identify variables and constraints', 'Undo assignments'],
    commonQuestions: ['Sudoku Solver', 'N-Queens', 'Palindrome Partitioning with constraints'],
    followUps: ['MRV heuristic?', 'Forward checking?'],
    misconceptions: ['Generate all then filter', 'Constraints only at end'],
    traps: ['Sudoku: validate entire board each time vs incremental', 'Missing prune on partial sum'],
    strongSignals: ['Incremental validity check O(1) or O(n)', 'Names constraints explicitly'],
  },
  patternRecognition: [
    'A partial assignment becomes invalid as soon as it violates a local constraint.',
    'The task asks for arrangements subject to row, column, adjacency, or uniqueness rules.',
    'A valid answer is built one decision at a time and invalid branches can stop early.',
  ],
  commonMistakes: [
    'Checking constraints only at a completed assignment instead of before recursing.',
    'Failing to undo every mutation when returning from a recursive call.',
    'Using shared mutable state without restoring it for sibling branches.',
    'Treating a constraint as symmetric when its direction matters.',
  ],
  keyTakeaways: [
    'Assign variables; check constraints before deeper recursion.',
    'Undo assignment on backtrack.',
    'Strong constraints early = massive prune.',
    'Sudoku/N-Queens are CSP backtracking classics.',
    'Heuristics (MRV, least constraining value) help beyond interviews.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is constraint backtracking?', answerHint: 'Try assignments; recurse only if partial state satisfies all constraints; undo on failure.' },
    { level: 'intermediate', question: 'Sudoku incremental check?', answerHint: 'Track row/col/box used sets; O(1) check if digit already in any set for cell.' },
    { level: 'advanced', question: 'MRV heuristic?', answerHint: 'Pick variable with fewest remaining legal values first to fail fast.' },
  ],
  flashcards: [
    { front: 'When to check constraints in backtrack', back: 'Before recursing deeper, not only at complete assignment.' },
    { front: 'CSP backtrack undo step', back: 'Unassign variable after exploring branch.' },
  ],
  quickRevision: [
    'Variables + domains + constraints',
    'Check before recurse',
    'Unassign on backtrack',
    'Sudoku: row/col/box sets',
    'N-Queens: col/diag sets',
    'Prune invalid partial states',
    'Exponential worst case',
  ],
}
