import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Grid search backtracking treats a 2D matrix as a graph: from each cell, explore 4 (or 8) directions to find paths, words, or regions matching constraints. Typical pattern: mark visited in-place or with boolean[][], recurse neighbors, unmark on return.',
  whyExists:
    'Word Search, Sudoku, unique paths with obstacles, and island-style problems share "move on grid with constraints" structure. DFS backtracking on grids is the default when path order or full exploration matters and BFS is for shortest steps.',
  mentalModel:
    'Walk the maze: at (r,c) mark visited, try each direction that stays in bounds and satisfies constraint, recurse, then restore cell (backtrack) so other paths can reuse the cell.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Define dirs = {{1,0},{-1,0},{0,1},{0,-1}}.',
        'Base: matched full word / filled all cells / reached target.',
        'Mark: grid[r][c] = "#" or visited[r][c] = true before recurse.',
        'Loop dirs: if valid neighbor, dfs(nr, nc).',
        'Unmark after loop for multi-path search (Word Search).',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Word Search vs unique paths',
      text: 'Word Search must unmark after exploring—same cell can appear in different branches at different times. Unique paths count often marks permanently or uses DP when no reuse.',
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Word Search pattern',
      code: `boolean dfs(char[][] grid, int r, int c, String word, int idx) {
    if (idx == word.length()) return true;
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) return false;
    if (grid[r][c] != word.charAt(idx)) return false;
    char tmp = grid[r][c];
    grid[r][c] = '#';
    for (int[] d : DIRS) {
        if (dfs(grid, r + d[0], c + d[1], word, idx + 1)) return true;
    }
    grid[r][c] = tmp;
    return false;
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Word "cab" in board: start at c, mark visited, dfs to a, then b; backtrack unmarks so other paths can reuse cells.',
    },
  ],
  complexity: {
    average: 'O(m·n·4^L) word length L branches',
    worst: 'Exponential in path length with branching factor 4',
    space: 'O(L) recursion depth',
  },
  tradeoffs: {
    advantages: ['In-place visited marking saves memory', 'Natural for path existence', 'Extends to sudoku with box constraints'],
    disadvantages: ['Exponential without memo/trie', 'Easy to forget unmark', '8-direction vs 4-direction confusion'],
    alternatives: ['BFS for shortest grid path', 'DP when counting paths without revisiting'],
    whenToUse: ['Find word/path on grid', 'Sudoku fill', 'Explore all routes with constraints'],
    whenNotToUse: ['Unweighted shortest path → BFS', 'Only component size → flood fill without unmark'],
  },
  failureModes: [
    'No unmark → Word Search false negatives.',
    'Bounds check after accessing grid → NPE/index error.',
    'Using same visited for simultaneous paths incorrectly.',
  ],
  interview: {
    expectations: ['Mark/unmark template', '4-direction loops', 'Early return on found'],
    commonQuestions: ['Word Search', 'Word Search II (Trie + prune)', 'Sudoku Solver'],
    followUps: ['Optimize Word Search II?', 'Why not BFS for Word Search?'],
    misconceptions: ['Always permanent mark like flood fill', '8 dirs default'],
    traps: ['Forget restore char after dfs', 'Word Search II needs Trie to prune prefix failures'],
    strongSignals: ['Distinguishes reuse vs no-reuse', 'Trie pruning for multiple words'],
  },
  patternRecognition: [
    'The search state is a cell in a board and moves go to neighboring cells.',
    'You must find paths, words, islands, or placements subject to grid boundaries.',
    'Cells may be visited at most once on the current path.',
  ],
  commonMistakes: [
    'Accessing neighbors before checking row and column bounds.',
    'Marking a cell visited globally when it should be reusable on a different path.',
    'Forgetting to restore the visited marker during backtracking.',
    'Using four directions when diagonal movement is required or vice versa.',
  ],
  keyTakeaways: [
    'Grid DFS: bounds + constraint + mark + 4 dirs + unmark.',
    'Word Search restores cell after exploring branch.',
    'Sudoku adds row/col/box validity checks each placement.',
    'Branching ~4^pathLength; prune early on mismatch.',
    'Word Search II: Trie + DFS from each cell.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why mark and unmark in Word Search?', answerHint: 'Cell can be reused in different paths; restore after backtrack.' },
    { level: 'intermediate', question: 'Grid DFS template steps?', answerHint: 'Check bounds/match, mark, recurse dirs, unmark, return.' },
    { level: 'advanced', question: 'Word Search II approach?', answerHint: 'Build Trie of words; DFS each cell with Trie node pruning; collect words at end nodes.' },
  ],
  flashcards: [
    { front: 'Word Search visited strategy', back: 'Temporarily mark cell (#), restore after dfs.' },
    { front: 'Grid backtrack directions', back: 'Usually 4-neighbor; 8 for diagonal variants.' },
  ],
  quickRevision: [
    'Bounds check first',
    'Mark in-place or visited[][]',
    '4 directional dfs',
    'Unmark on return (Word Search)',
    'Early true return on find',
    'Trie for multi-word grid',
    'BFS if shortest path needed',
  ],
}
