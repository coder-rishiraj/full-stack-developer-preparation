import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Grid DP computes optimal paths, min cost, or counts on an m×n matrix. dp[r][c] typically depends on dp[r-1][c] and dp[r][c-1] (or max/min variants). Obstacles set unreachable cells to sentinel; in-place optimization possible.',
  whyExists:
    'Unique paths, min path sum, dungeon game, and cherry pickup are interview staples teaching 2D transitions, boundary handling, and space rolling on grids.',
  mentalModel:
    'Robot at top-left walks only right/down; each cell stores best way to reach it from start using best from above and left.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Unique paths: dp[r][c] = dp[r-1][c] + dp[r][c-1]; base row/col = 1 if no obstacle.',
        'Min path sum: dp[r][c] = grid[r][c] + min(top, left).',
        'Obstacle: if grid[r][c]==1, dp=0 or skip.',
        'Space: keep previous row only O(n).',
        'Max cherry pickup may need 3D (two agents) advanced.',
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Min path sum',
      code: `int minPathSum(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    for (int r = 0; r < m; r++)
        for (int c = 0; c < n; c++) {
            if (r == 0 && c == 0) continue;
            int top = r == 0 ? Integer.MAX_VALUE : grid[r - 1][c];
            int left = c == 0 ? Integer.MAX_VALUE : grid[r][c - 1];
            grid[r][c] += Math.min(top, left);
        }
    return grid[m - 1][n - 1];
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: '3×3 grid min path sum: dp accumulates grid[r][c] plus min from top or left; corner reached with minimal total cost.',
    },
  ],
  complexity: {
    average: 'O(m·n) time',
    space: 'O(m·n) or O(n) rolling row',
  },
  tradeoffs: {
    advantages: ['Visual intuitive', 'In-place mutation OK if input disposable', 'Standard template'],
    disadvantages: ['Only right/down limits variants', '3D for two robots harder'],
    alternatives: ['Math combinatorics unique paths without obstacles', 'BFS if step costs uniform unweighted'],
    whenToUse: ['Matrix path count/min/max sum', 'DAG implicit grid'],
    whenNotToUse: ['Arbitrary moves (8-dir) without DAG structure', 'Shortest with obstacles weights 0/1 → BFS'],
  },
  failureModes: [
    'First row/col init wrong with obstacles.',
    'Integer.MAX_VALUE + grid overflow in min path.',
    'Modifying input when not allowed.',
  ],
  interview: {
    expectations: ['Right/down transitions', 'Obstacle handling', 'O(m·n) time'],
    commonQuestions: ['Unique Paths I/II', 'Minimum Path Sum', 'Dungeon Game'],
    followUps: ['Space O(n)?', 'With obstacles formula?'],
    misconceptions: ['BFS needed for min sum', 'Can move diagonal by default'],
    traps: ['Start/end obstacle', 'Modulo on path count'],
    strongSignals: ['In-place or rolling row', 'Handles blocked first row/col'],
  },
  patternRecognition: [
    'The input is a matrix and each state is identified by a row and column.',
    'Moves are restricted to directions such as right/down or four adjacent cells.',
    'The question asks for path counts, minimum cost, or maximum reward through a grid.',
  ],
  commonMistakes: [
    'Accessing a blocked or out-of-bounds neighbor as if it were a valid state.',
    'Using zero as the sentinel for an unreachable minimum-cost cell.',
    'Double-counting the starting cell cost during initialization.',
    'Applying right/down tabulation when movement introduces cycles or reverse dependencies.',
  ],
  keyTakeaways: [
    'Grid DP: from top and left neighbors.',
    'Init first row/column with obstacle awareness.',
    'Unique paths = sum of paths; min sum = min + cell.',
    'O(m·n) time; O(n) space with one row.',
    'Obstacle cells contribute 0 paths or INF cost.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Unique paths recurrence?', answerHint: 'dp[r][c] = dp[r-1][c] + dp[r][c-1]; no obstacles.' },
    { level: 'intermediate', question: 'Min path sum with obstacles?', answerHint: 'Skip obstacle cells; dp=INF unreachable; else grid val + min(top,left).' },
    { level: 'advanced', question: 'Cherry pickup two robots?', answerHint: '3D DP on (r1,c1,r2,c2) synchronized steps or reduced state same row r.' },
  ],
  flashcards: [
    { front: 'Grid path DP neighbors', back: 'Usually top dp[r-1][c] and left dp[r][c-1].' },
    { front: 'Unique paths without obstacles closed form', back: 'C(m+n-2, m-1) but DP generalizes obstacles.' },
  ],
  quickRevision: [
    'Right/down only typical',
    'dp from top + left',
    'Obstacle → 0 or INF',
    'Init first row/col',
    'O(m·n) time',
    'Rolling row O(n) space',
    'In-place min sum variant',
  ],
}
