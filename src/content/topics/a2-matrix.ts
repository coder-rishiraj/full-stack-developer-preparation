import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Matrix problems treat a 2D grid as rows × columns of cells, using nested loops, direction vectors, BFS/DFS, or in-place markers to traverse, transform, or search in O(m·n) time.',
  whyExists:
    'Images, boards, maps, and DP tables are grids. Efficient traversal avoids revisiting cells, respects boundaries, and reuses linear techniques (prefix sums, two pointers on a row).',
  mentalModel:
    'Chessboard with m rows and n columns: always check (r,c) is in bounds before reading. Four or eight neighbors are compass steps from a direction array.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Define dimensions m = matrix.length, n = matrix[0].length; guard empty matrix.',
        'Choose traversal: row-major nested loops, spiral boundaries, BFS queue, or DFS stack.',
        'Use int[][] dirs = {{0,1},{1,0},{0,-1},{-1,0}} for 4-direction; add diagonals if needed.',
        'Mark visited (boolean[][], mutate to \'#\', or offset char) to prevent cycles.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Layer peeling',
      text: 'Spiral order: top/bottom/left/right borders, shrink rectangle each round. O(m·n) without extra structure.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Cell[r,c] --> B{in bounds?}
  B -->|no| Skip
  B -->|yes| Vis{visited?}
  Vis -->|no| Process[process cell]
  Process --> N[neighbors via dirs]`,
    caption: 'Grid DFS/BFS cell expansion',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Number of islands: scan each cell; on \'1\', DFS/BFS flood-fill marking \'0\'. Each new unvisited land starts count++. O(m·n) visits each cell once.',
    },
    {
      type: 'table',
      headers: ['technique', 'time', 'space'],
      rows: [
        ['row-major scan', 'O(mn)', 'O(1)'],
        ['BFS islands', 'O(mn)', 'O(mn) queue worst'],
        ['spiral layers', 'O(mn)', 'O(1)'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: '4-direction grid DFS',
      code: `int[][] dirs = {{0,1},{1,0},{0,-1},{-1,0}};
void dfs(int[][] g, int r, int c) {
    if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] == 0)
        return;
    g[r][c] = 0; // mark visited
    for (int[] d : dirs) dfs(g, r + d[0], c + d[1]);
}`,
    },
    {
      language: 'java',
      caption: 'Transpose + reverse row (rotate 90°',
      code: `public void rotate(int[][] matrix) {
    int n = matrix.length;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++) {
            int t = matrix[i][j]; matrix[i][j] = matrix[j][i]; matrix[j][i] = t;
        }
    for (int[] row : matrix) reverse(row);
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Set matrix zeroes (O(1) space markers',
      code: `public void setZeroes(int[][] m) {
    boolean row0 = false, col0 = false;
    // use first row/col as markers, then propagate
    // see full pattern: mark, then zero except marker row/col
}`,
    },
  ],
  complexity: {
    best: 'O(m·n) full grid visit',
    average: 'O(m·n)',
    worst: 'O(m·n) each cell once; BFS queue O(m·n)',
    space: 'O(1) in-place markers; O(m·n) visited array or queue',
  },
  patternRecognition: [
    'Input is grid/board/matrix wording or 2D array.',
    'Move in 4/8 directions, shortest path on unweighted grid → BFS.',
    'Connected components of same value → flood fill.',
    'Rotate/reflection can be transpose + reverse, not naive copy.',
    'Search sorted matrix: start corner where row/col monotonic.',
  ],
  commonMistakes: [
    'Off-by-one on bounds (use r < m not r <= m).',
    'Assuming square matrix when rectangular (n = mat[0].length).',
    'Not marking visited → infinite DFS on cycles.',
    'Modifying matrix while iterating without clear two-phase plan.',
    'Confusing (row,col) order in matrix[row][col].',
  ],
  variations: [
    'Diagonal traversal with (r+c) buckets',
    'Prefix sum 2D for rectangle queries',
    'Search row-wise sorted matrix (staircase)',
    'Union-find for dynamic connectivity on grid',
  ],
  tradeoffs: {
    advantages: [
      'Uniform O(m·n) baseline easy to state',
      'Direction array reduces bug-prone neighbor code',
      'In-place marking saves space',
    ],
    disadvantages: [
      'Must visit many cells—hard to sublinear',
      'In-place tricks can be tricky to explain',
    ],
    alternatives: ['Flatten to 1D index i*n+j', 'BFS vs DFS trade stack vs queue'],
    whenToUse: ['Grid path', 'Island/region count', 'Matrix transform'],
    whenNotToUse: ['Graph is sparse non-grid—use adjacency list'],
  },
  failureModes: [
    'Stack overflow on large grid DFS (prefer BFS or iterative DFS).',
    'Empty matrix: matrix[0] access without length check.',
  ],
  interview: {
    expectations: [
      'State m, n, bounds check helper',
      'Choose BFS vs DFS with reason',
      'Discuss O(m·n) time upfront',
    ],
    commonQuestions: [
      'Number of Islands',
      'Rotate Image',
      'Set Matrix Zeroes',
      'Search a 2D Matrix',
    ],
    followUps: ['What if diagonal moves allowed?', 'O(1) space for zeroes?'],
    misconceptions: ['Spiral needs extra matrix'],
    traps: ['Sorted matrix: binary search row-only misses staircase', 'Zeroes: overwrite markers too early'],
    strongSignals: ['Writes inBounds(r,c) helper', 'Explains flood-fill vs multi-source BFS'],
  },
  keyTakeaways: [
    'Always bounds-check (r,c) before access.',
    'm × n → expect O(m·n) time.',
    'dirs array for neighbors; mark visited.',
    'Rotate 90° = transpose + reverse rows.',
    'BFS for shortest steps on unweighted grid.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'How do you traverse 4 neighbors without repeated code?',
      answerHint: 'int[][] dirs; loop d, call dfs(r+d[0], c+d[1]) with bounds check.',
    },
    {
      level: 'intermediate',
      question: 'Rotate n×n matrix 90° clockwise in-place?',
      answerHint: 'Transpose then reverse each row.',
    },
    {
      level: 'advanced',
      question: 'Search fully sorted matrix (row and column sorted)?',
      answerHint: 'Start top-right or bottom-left; eliminate row or col each step O(m+n).',
    },
  ],
  flashcards: [
    { front: 'Grid full scan time', back: 'O(m·n).' },
    { front: 'Rotate 90° clockwise in-place', back: 'Transpose + reverse each row.' },
  ],
  quickRevision: [
    'matrix[r][c], check bounds',
    'dirs = 4 or 8 neighbors',
    'Flood fill / BFS for regions',
    'O(m·n) standard',
    'Transpose + reverse = rotate',
    'Mark visited to avoid cycles',
  ],
}
