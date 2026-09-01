import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Graph cycle detection determines whether a path revisits a node in a way that forms a loop—undirected graphs use DFS with parent tracking; directed graphs use three-color DFS, Kahn’s topological sort (in-degree), or Union-Find only for undirected. A tree is acyclic and connected.',
  whyExists:
    'Cycles break topological ordering, imply redundant dependencies (impossible course schedule), and invalidate “valid tree” claims. Detecting them early prevents infinite DFS and answers feasibility questions in scheduling, deadlock detection, and Union-Find Kruskal (adding cycle edge).',
  mentalModel:
    'Undirected: walking edges, if you meet a visited room that isn’t where you just came from, you’ve looped. Directed: if you reach a room still “in progress” (on the recursion stack), you’ve found a back edge forming a cycle.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Undirected DFS: for neighbor v of u, if v visited and v != parent → cycle.',
        'Directed DFS: WHITE/GRAY/BLACK; edge to GRAY = back edge = cycle.',
        'Directed Kahn: topo order size < V ⇒ cycle.',
        'Union-Find undirected: if union(u,v) and find(u)==find(v) before union → edge creates cycle.',
        'BFS undirected: track parent; same visited-non-parent rule.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Don’t mix models',
      text: 'Parent trick works undirected only. Directed needs GRAY nodes or Kahn—boolean visited alone misses cycles through completed nodes.',
    },
  ],
  architecture: {
    mermaid: `flowchart TD
  Und[Undirected DFS] --> P{neighbor visited and not parent?}
  P -->|yes| Cyc1[Cycle]
  Dir[Directed DFS] --> G{neighbor GRAY?}
  G -->|yes| Cyc2[Back edge cycle]
  Kahn[Kahn topo] --> S{processed < V?}
  S -->|yes| Cyc3[Cycle]`,
    caption: 'Cycle detection paths',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Undirected triangle 0-1-2-0: DFS 0→1→2 sees neighbor 0 visited, parent of 2 is 1 not 0 → cycle. Directed 0→1→2→0: at 2, neighbor 0 is GRAY → cycle. DAG 0→1→2: Kahn processes all 3 nodes.',
    },
    {
      type: 'table',
      headers: ['graph type', 'algorithm', 'cycle signal'],
      rows: [
        ['undirected', 'DFS + parent', 'visited v ≠ parent'],
        ['directed', '3-color DFS', 'edge to GRAY'],
        ['directed', 'Kahn BFS', 'order.size < n'],
        ['undirected', 'Union-Find', 'find(u)==find(v) on edge'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Undirected cycle DFS',
      code: `boolean hasCycleUndirected(int u, int parent, List<List<Integer>> adj, boolean[] vis) {
    vis[u] = true;
    for (int v : adj.get(u)) {
        if (!vis[v]) {
            if (hasCycleUndirected(v, u, adj, vis)) return true;
        } else if (v != parent) return true;
    }
    return false;
}`,
    },
    {
      language: 'java',
      caption: 'Directed cycle (3-color)',
      code: `static final int WHITE = 0, GRAY = 1, BLACK = 2;
boolean dfsDir(int u, List<List<Integer>> adj, int[] color) {
    color[u] = GRAY;
    for (int v : adj.get(u)) {
        if (color[v] == GRAY) return true;
        if (color[v] == WHITE && dfsDir(v, adj, color)) return true;
    }
    color[u] = BLACK;
    return false;
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Course Schedule (directed cycle?)',
      code: `public boolean canFinish(int numCourses, int[][] prerequisites) {
    List<List<Integer>> adj = buildAdj(numCourses, prerequisites);
    int[] indeg = new int[numCourses];
    for (int[] p : prerequisites) indeg[p[0]]++;
    Deque<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < numCourses; i++) if (indeg[i] == 0) q.offer(i);
    int seen = 0;
    while (!q.isEmpty()) {
        int u = q.poll(); seen++;
        for (int v : adj.get(u)) if (--indeg[v] == 0) q.offer(v);
    }
    return seen == numCourses; // false if cycle
}`,
    },
  ],
  complexity: {
    best: 'O(V+E) single DFS or Kahn pass',
    average: 'O(V+E)',
    worst: 'O(V+E) time; O(V) color/visited',
    space: 'O(V) auxiliary',
  },
  patternRecognition: [
    'Course schedule / can finish tasks → directed cycle.',
    'Graph valid tree → no cycle + connected.',
    'Linked list cycle (different—Floyd)—not graph DFS parent.',
    'Kruskal: skip edge if Union-Find same set.',
    'Redundant connection: last edge that closes cycle.',
  ],
  commonMistakes: [
    'Using parent check on directed graph.',
    'Single boolean visited for directed cycle.',
    'Forgetting disconnected graph—DFS all components.',
    'Self-loop: undirected u-u is cycle; handle in adj build.',
    'Confusing linked-list cycle with graph cycle templates.',
  ],
  variations: [
    'Find specific edge that forms cycle (Union-Find last redundant)',
    'Detect cycle length (advanced)',
    'Bipartite check related but distinct (odd cycle)',
    'Course Schedule II return order if acyclic',
  ],
  tradeoffs: {
    advantages: [
      'DFS O(V+E) in one pass',
      'Kahn gives topo order plus cycle check',
      'Union-Find O(α) per edge for undirected stream',
    ],
    disadvantages: [
      'Must pick correct directed vs undirected method',
      'Recursion depth on long paths',
    ],
    alternatives: ['Kahn vs DFS for directed', 'Floyd for functional graphs only'],
    whenToUse: ['Prerequisites', 'Valid tree', 'MST edge rejection'],
    whenNotToUse: ['Linked list only—use fast/slow pointers', 'Need shortest cycle length without extra work'],
  },
  failureModes: [
    'Miss cycle in disconnected component—need loop all nodes.',
    'Multi-edge between same nodes: parent skip still works undirected.',
    'Large n recursion stack overflow—iterative or increase stack.',
  ],
  interview: {
    expectations: [
      'Distinguish directed vs undirected detection',
      'O(V+E) complexity',
      'Course schedule → Kahn or DFS colors',
    ],
    commonQuestions: [
      'Course Schedule I',
      'Graph Valid Tree',
      'Redundant Connection',
      'Find Eventual Safe States (reverse graph)',
    ],
    followUps: ['Return cycle edge?', 'Multiple components?'],
    misconceptions: ['Union-Find works directed cycles', 'Visited enough for directed'],
    traps: ['prerequisites edge direction', 'Tree with n nodes needs n-1 edges'],
    strongSignals: ['GRAY/BLACK explained clearly', 'Kahn count vs n'],
  },
  keyTakeaways: [
    'Undirected: visited neighbor ≠ parent ⇒ cycle.',
    'Directed: back edge to GRAY or Kahn count < V.',
    'Valid tree: connected + |E|=|V|-1.',
    'Union-Find: same root before union ⇒ cycle edge.',
    'Always check all nodes if graph disconnected.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Detect cycle in undirected graph?',
      answerHint: 'DFS; if neighbor visited and not parent, cycle found.',
    },
    {
      level: 'intermediate',
      question: 'Why boolean visited fails for directed cycles?',
      answerHint: 'Need node on current recursion stack (GRAY); edge to finished BLACK node is not cycle.',
    },
    {
      level: 'advanced',
      question: 'Course schedule cycle detection options?',
      answerHint: 'Kahn: indegree 0 queue, processed < n; or DFS three-color on prerequisite graph.',
    },
  ],
  flashcards: [
    {
      front: 'Directed cycle DFS signal',
      back: 'Edge to GRAY node (on recursion stack).',
    },
    {
      front: 'Kahn cycle condition',
      back: 'Fewer than V nodes processed in topological order.',
    },
  ],
  quickRevision: [
    'Undirected: neighbor ≠ parent',
    'Directed: GRAY back edge',
    'Kahn: processed < n',
    'UF: same set before union',
    'Check all components',
    'Valid tree: connected + V-1 edges',
    'O(V+E) all methods',
  ],
}
