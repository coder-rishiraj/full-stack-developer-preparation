import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'N-Queens places n queens on an n×n board so no two share a row, column, or diagonal. Backtracking places one queen per row, trying each column and checking conflicts with prior queens using column and diagonal sets or O(1) arrays.',
  whyExists:
    'Classic constraint satisfaction problem teaching row-by-row placement, O(n) conflict checks, and bitmask optimizations. Same pattern applies to sudoku, graph coloring, and resource allocation with mutual exclusion.',
  mentalModel:
    'Fill rows top to bottom: row r tries columns 0..n-1; if (r,c) safe, mark occupied diagonals/columns, recurse row r+1, then unmark. Success when r == n.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'One queen per row eliminates row conflicts.',
        'Track used columns and two diagonal directions: r-c and r+c (constant per cell).',
        'Try col in [0,n): if free, place, backtrack row+1, remove.',
        'Collect all boards or count only based on problem variant.',
        'Bitmask variant: cols, diag1, diag2 as bitsets for speed.',
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'N-Queens backtracking',
      code: `void solve(int row, char[][] board, boolean[] col, boolean[] d1, boolean[] d2, List<List<String>> ans) {
    int n = board.length;
    if (row == n) { ans.add(serialize(board)); return; }
    for (int c = 0; c < n; c++) {
        if (col[c] || d1[row - c + n - 1] || d2[row + c]) continue;
        board[row][c] = 'Q';
        col[c] = d1[row - c + n - 1] = d2[row + c] = true;
        solve(row + 1, board, col, d1, d2, ans);
        board[row][c] = '.';
        col[c] = d1[row - c + n - 1] = d2[row + c] = false;
    }
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'n=4 solution places queens at (0,1), (1,3), (2,0), (3,2)—no shared row, column, or diagonal.',
    },
  ],
  complexity: {
    average: 'Much less than n^n due to pruning',
    worst: 'O(n!) upper bound with strong pruning',
    space: 'O(n) recursion + constraint arrays',
  },
  tradeoffs: {
    advantages: ['Clear CSP template', 'O(n) check per placement', 'Bitmask speeds constant factors'],
    disadvantages: ['Still exponential', 'Board serialization overhead for output'],
    alternatives: ['Bitmask DFS', 'Dancing links (advanced)'],
    whenToUse: ['Constraint placement row/column/diag', 'Interview classic'],
    whenNotToUse: ['Huge n needs math not brute force'],
  },
  failureModes: [
    'Wrong diagonal index (off-by-one on r-c offset).',
    'Not clearing board cell on backtrack.',
    'Checking all prior queens O(n) per cell when sets suffice.',
  ],
  interview: {
    expectations: ['One queen per row', 'Diagonal indexing', 'Backtrack undo marks'],
    commonQuestions: ['N-Queens', 'N-Queens II (count only)'],
    followUps: ['Bitmask optimization?', 'Time complexity?'],
    misconceptions: ['Must check full board each time', 'BFS needed'],
    traps: ['d1 index: row - col + n - 1', 'Serialize board correctly'],
    strongSignals: ['O(1) conflict check via arrays', 'Clean undo on backtrack'],
  },
  patternRecognition: [
    'You must place one item per row while preventing column and diagonal conflicts.',
    'The board size is small enough for exponential search with aggressive conflict checks.',
    'A valid placement can be represented by sets of used columns and diagonals.',
  ],
  commonMistakes: [
    'Checking only columns and forgetting both diagonal directions.',
    'Using row - col directly as an array index without offsetting negative values.',
    'Not removing column and diagonal markers after returning from recursion.',
    'Placing multiple queens in one row instead of recursing row by row.',
  ],
  keyTakeaways: [
    'Place one queen per row; try all columns.',
    'Track columns and both diagonal directions.',
    'Undo marks and board cell on backtrack.',
    'Pruning cuts search dramatically vs naive n^n.',
    'Count-only variant skips board serialization.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why one queen per row?', answerHint: 'No two queens same row; fixes row dimension reduces search.' },
    { level: 'intermediate', question: 'Diagonal tracking keys?', answerHint: 'r-c constant for \\ diagonal; r+c for / diagonal.' },
    { level: 'advanced', question: 'N-Queens II optimization?', answerHint: 'Same backtrack but increment count only; optional bitmasks for cols/diags.' },
  ],
  flashcards: [
    { front: 'N-Queens diagonal check', back: 'Use r-c and r+c as keys; O(1) with boolean arrays.' },
    { front: 'Queens per row in standard solution', back: 'Exactly one per row.' },
  ],
  quickRevision: [
    'Row-by-row placement',
    'col, d1, d2 arrays',
    'Undo on backtrack',
    'Base row == n',
    'Pruned exponential search',
    'Count vs list output',
    'Bitmask optional speedup',
  ],
}
