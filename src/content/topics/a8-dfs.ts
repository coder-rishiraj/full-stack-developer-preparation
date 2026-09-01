import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Graph DFS (depth-first search) explores by going as deep as possible along one path before backtracking—using recursion or an explicit stack. It marks visited nodes, detects cycles, finds connected structure, and supports backtracking for paths and combinations on graphs.',
  whyExists:
    'Many graph properties need full exploration of a component or exhaustive path search. DFS uses O(V) stack/recursion depth vs BFS’s queue; it naturally handles cycle detection (back edges), topological order (postorder), and “try all paths” with undo on backtrack.',
  mentalModel:
    'Maze explorer with chalk: enter a room, mark it, try each unmarked door recursively, backtrack when dead ends. The recursion stack is your trail of breadcrumbs; popping returns to the previous junction.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Mark start visited; dfs(u): for each neighbor v, if unvisited dfs(v).',
        'Iterative: stack push start; pop u, push unvisited neighbors (order affects traversal).',
        'Cycle undirected: if neighbor visited and not parent → cycle.',
        'Cycle directed: three colors WHITE/GRAY/BLACK; GRAY neighbor = back edge.',
        'Backtracking: add u to path, recurse, remove u on return.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Graph vs tree DFS',
      text: 'Graphs need visited[] to avoid infinite loops; trees skip visited. Grid DFS: mark cell visited when entering, 4/8 dirs like graph neighbors.',
    },
  ],
  architecture: {
    mermaid: `flowchart TD
  U[Visit u mark] --> N[For neighbor v]
  N --> V{visited?}
  V -->|no| Rec[dfs v]
  V -->|yes| Back[Backtrack / cycle check]
  Rec --> N
  Back --> Done[Return from u]`,
    caption: 'Recursive graph DFS',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Graph 0—1—2, 0—2: DFS from 0 visits 0→1→2 (or 0→2→1 depending order). All nodes visited in one call = one connected component. If edge 1—2 exists and we start at 0, path 0-1-2 explores depth before revisiting via 0-2.',
    },
    {
      type: 'table',
      headers: ['use case', 'DFS variant', 'key check'],
      rows: [
        ['Explore component', 'visited array', 'count nodes visited'],
        ['Path exists', 'DFS to target', 'return on found'],
        ['All paths', 'backtrack path list', 'undo on return'],
        ['Cycle undirected', 'parent skip', 'visited neighbor ≠ parent'],
        ['Cycle directed', 'GRAY node', 'back edge to ancestor'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Recursive DFS on adjacency list',
      code: `void dfs(int u, List<List<Integer>> adj, boolean[] vis) {
    vis[u] = true;
    for (int v : adj.get(u)) {
        if (!vis[v]) dfs(v, adj, vis);
    }
}`,
    },
    {
      language: 'java',
      caption: 'Iterative DFS with stack',
      code: `void dfsIter(int start, List<List<Integer>> adj, boolean[] vis) {
    Deque<Integer> st = new ArrayDeque<>();
    st.push(start);
    while (!st.isEmpty()) {
        int u = st.pop();
        if (vis[u]) continue;
        vis[u] = true;
        for (int v : adj.get(u)) if (!vis[v]) st.push(v);
    }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Number of Islands (grid DFS)',
      code: `void dfs(char[][] grid, int r, int c) {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] == '0')
        return;
    grid[r][c] = '0'; // mark visited
    dfs(grid, r + 1, c);
    dfs(grid, r - 1, c);
    dfs(grid, r, c + 1);
    dfs(grid, r, c - 1);
}

int numIslands(char[][] grid) {
    int count = 0;
    for (int r = 0; r < grid.length; r++)
        for (int c = 0; c < grid[0].length; c++)
            if (grid[r][c] == '1') { dfs(grid, r, c); count++; }
    return count;
}`,
    },
  ],
  complexity: {
    best: 'O(V+E) each vertex/edge once',
    average: 'O(V+E) adjacency list traversal',
    worst: 'O(V+E); recursion depth O(V) path graph',
    space: 'O(V) visited + O(V) recursion/stack worst case',
  },
  patternRecognition: [
    'Count connected components (islands, regions).',
    'Detect cycle in undirected/directed graph.',
    'Path finding when any path OK (not necessarily shortest).',
    'Enumerate all paths with backtracking.',
    'Topological sort via DFS postorder + cycle colors.',
    'Flood fill / connected area size on grid.',
  ],
  commonMistakes: [
    'No visited array on general graph → infinite loop.',
    'Undirected cycle: treating parent as cycle incorrectly or forgetting parent skip.',
    'Stack overflow on deep graph—switch to iterative or increase stack.',
    'Grid DFS without bounds check or mark-on-enter.',
    'Confusing DFS shortest path (wrong) with BFS on unweighted.',
  ],
  variations: [
    'DFS with timestamp discovery/finish (directed edge classification)',
    'Iterative with explicit path stack for backtracking',
    'Multi-threaded DFS (not interview focus)',
    'DFS on implicit state graph (keys, masks)',
  ],
  tradeoffs: {
    advantages: [
      'O(V+E) simple code with recursion',
      'Natural backtracking and cycle detection',
      'Less memory than BFS queue on deep narrow graphs',
    ],
    disadvantages: [
      'Not for unweighted shortest path',
      'Recursion depth limit on long paths',
      'Order-dependent without sorting neighbors',
    ],
    alternatives: ['BFS for shortest hops', 'Union-Find for connectivity only', 'Tarjan SCC for directed structure'],
    whenToUse: ['Components', 'Cycles', 'Path enumerate', 'Grid flood fill'],
    whenNotToUse: ['Unweighted shortest path', 'Level-by-level expansion'],
  },
  failureModes: [
    'Recursion stack overflow V=10⁵ line graph.',
    'Visited not reset between components if reusing array wrong.',
    'Directed cycle missed using only boolean visited.',
  ],
  interview: {
    expectations: [
      'visited[] on graphs',
      'O(V+E) time and space reasoning',
      'Parent skip for undirected cycle',
    ],
    commonQuestions: [
      'Number of Islands',
      'Clone Graph',
      'Pacific Atlantic Water Flow',
      'Graph Valid Tree (cycle + connected)',
    ],
    followUps: ['Iterative vs recursive?', 'Detect cycle directed?'],
    misconceptions: ['DFS finds shortest path', 'Trees need visited array'],
    traps: ['Modify grid in place for visited', 'Clone graph needs HashMap node copy'],
    strongSignals: ['Gray/black for directed cycle', 'Backtrack template clean'],
  },
  keyTakeaways: [
    'DFS: go deep, backtrack; O(V+E) with visited.',
    'Graph always needs visited; tree does not.',
    'Undirected cycle: visited neighbor ≠ parent.',
    'Directed cycle: GRAY back-edge or three-color DFS.',
    'Grid DFS = flood fill with bounds + mark.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'DFS vs BFS when to use?',
      answerHint: 'BFS unweighted shortest path; DFS components, cycles, backtracking paths.',
    },
    {
      level: 'intermediate',
      question: 'Detect cycle in undirected graph during DFS?',
      answerHint: 'If neighbor visited and neighbor != parent, cycle exists.',
    },
    {
      level: 'advanced',
      question: 'Directed cycle detection with DFS colors?',
      answerHint: 'WHITE unvisited, GRAY on stack, BLACK done; edge to GRAY = back edge = cycle.',
    },
  ],
  flashcards: [
    {
      front: 'Graph DFS time on adj list',
      back: 'O(V + E).',
    },
    {
      front: 'Undirected DFS cycle condition',
      back: 'Visited neighbor that is not parent.',
    },
  ],
  quickRevision: [
    'visited[] always on graphs',
    'O(V+E) time space O(V)',
    'Undirected cycle: neighbor ≠ parent',
    'Directed: GRAY = on stack',
    'Grid: mark cell + 4 dirs',
    'Backtrack: add/remove path',
    'Shortest unweighted → BFS not DFS',
  ],
}
