import type { TopicContent } from '@/domain/types'

type GraphTopicInput = {
  title: string
  sectionTitle: string
  parentTitle?: string
}

const SECTION_FOCUS: Record<string, string> = {
  'Graph Foundations & Representations':
    'vertices/edges, directed vs undirected, weighted vs unweighted, and when to use adjacency list, matrix, or edge list',
  'BFS & DFS Traversal':
    'queue vs stack/recursion, level-order vs deep exploration, unweighted shortest path, and clone-graph style state copying',
  'Grid Graphs & Pattern BFS':
    'cells as nodes, multi-source BFS, 0-1 BFS with a deque, flood fill / islands, and classic grid shortest-path patterns',
  'Cycle Detection — Undirected Graphs':
    'visited + parent for DFS/BFS cycle checks, and extensions that print the shortest cycle or enumerate cycles',
  'Cycle Detection — Directed Graphs':
    'three-color / recursion-stack DFS, Kahn indegree BFS for cycle detection, and negative-cycle awareness via Bellman-Ford',
  'Topological Sort & DAG Algorithms':
    "Kahn's BFS, DFS finish-time order, DAG shortest/longest paths, and course-schedule style dependency graphs",
  'Bipartite Graphs':
    '2-coloring with BFS or DFS, and the odd-cycle characterization of non-bipartite undirected graphs',
  'Connected Components':
    'counting components with BFS/DFS on graphs and grids, and largest-region style flood-fill variants',
  'Disjoint Set Union (Union-Find)':
    'find/union, path compression, union by rank/size, and dynamic connectivity including grid DSU',
  'Shortest Paths — Non-negative Weights':
    'Dijkstra with a priority queue or set, path reconstruction, and the shortest-path algorithm decision tree',
  'Shortest Paths — Negative Weights & All-Pairs':
    'Bellman-Ford relaxation and negative-cycle detection, plus Floyd-Warshall all-pairs via intermediates',
  'Minimum Spanning Trees':
    "Kruskal + DSU, Prim with a priority queue, Prim vs Kruskal trade-offs, and connect-all-cities style MST problems",
  'Strongly Connected Components':
    "Kosaraju's two-pass DFS, Tarjan's one-pass SCC, condensation DAGs, and Kosaraju vs Tarjan trade-offs",
  'Bridges & Articulation Points':
    'discovery/low-link DFS, critical edges (bridges), cut vertices, and LeetCode-style critical connections',
  'Flow, Matching & Eulerian Paths':
    'max-flow (Ford-Fulkerson / Dinic), bipartite matching via flow, and Euler path/circuit vs Hamiltonian',
  'Interview Decision Framework & Must-Do Patterns':
    'identify vertices/edges first, choose algorithms from constraints, avoid common mistakes, and memorize pattern → algorithm maps',
  'Classic & Advanced Graph Problems (GFG)':
    'graph coloring, TSP, random-graph models, and remaining GFG must-do specialty problems',
}

const SECTION_TEMPLATES: Record<string, { caption: string; code: string }[]> = {
  'Graph Foundations & Representations': [
    {
      caption: 'Build undirected adjacency list',
      code: `List<List<Integer>> buildAdj(int V, int[][] edges) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) {
        adj.get(e[0]).add(e[1]);
        adj.get(e[1]).add(e[0]); // omit for directed
    }
    return adj;
}`,
    },
  ],
  'Grid Graphs & Pattern BFS': [
    {
      caption: 'Multi-source BFS on a grid',
      code: `int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
void multiSource(int[][] grid) {
    int n = grid.length, m = grid[0].length;
    ArrayDeque<int[]> q = new ArrayDeque<>();
    boolean[][] seen = new boolean[n][m];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            if (grid[i][j] == 1) { // sources
                q.offer(new int[]{i, j, 0});
                seen[i][j] = true;
            }
    while (!q.isEmpty()) {
        int[] c = q.poll();
        for (int[] d : dirs) {
            int ni = c[0] + d[0], nj = c[1] + d[1];
            if (ni < 0 || nj < 0 || ni >= n || nj >= m || seen[ni][nj]) continue;
            seen[ni][nj] = true;
            q.offer(new int[]{ni, nj, c[2] + 1});
        }
    }
}`,
    },
  ],
  'Connected Components': [
    {
      caption: 'Count connected components (DFS)',
      code: `int countComponents(int V, List<List<Integer>> adj) {
    boolean[] seen = new boolean[V];
    int comps = 0;
    for (int i = 0; i < V; i++) {
        if (seen[i]) continue;
        comps++;
        ArrayDeque<Integer> st = new ArrayDeque<>();
        st.push(i);
        seen[i] = true;
        while (!st.isEmpty()) {
            int u = st.pop();
            for (int v : adj.get(u)) if (!seen[v]) {
                seen[v] = true;
                st.push(v);
            }
        }
    }
    return comps;
}`,
    },
  ],
  'Disjoint Set Union (Union-Find)': [
    {
      caption: 'DSU with path compression + union by rank',
      code: `class DSU {
    int[] parent, rank;
    DSU(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    boolean union(int a, int b) {
        int pa = find(a), pb = find(b);
        if (pa == pb) return false;
        if (rank[pa] < rank[pb]) { int t = pa; pa = pb; pb = t; }
        parent[pb] = pa;
        if (rank[pa] == rank[pb]) rank[pa]++;
        return true;
    }
}`,
    },
  ],
  'Flow, Matching & Eulerian Paths': [
    {
      caption: 'Edmonds-Karp (BFS max flow) skeleton',
      code: `int maxFlow(int n, int[][] cap, int s, int t) {
    int flow = 0;
    int[] parent = new int[n];
    while (true) {
        Arrays.fill(parent, -1);
        ArrayDeque<Integer> q = new ArrayDeque<>();
        q.offer(s);
        parent[s] = s;
        while (!q.isEmpty() && parent[t] == -1) {
            int u = q.poll();
            for (int v = 0; v < n; v++)
                if (parent[v] == -1 && cap[u][v] > 0) {
                    parent[v] = u;
                    q.offer(v);
                }
        }
        if (parent[t] == -1) break;
        int push = Integer.MAX_VALUE;
        for (int v = t; v != s; v = parent[v])
            push = Math.min(push, cap[parent[v]][v]);
        for (int v = t; v != s; v = parent[v]) {
            cap[parent[v]][v] -= push;
            cap[v][parent[v]] += push;
        }
        flow += push;
    }
    return flow;
}`,
    },
  ],
  'Interview Decision Framework & Must-Do Patterns': [
    {
      caption: 'Shortest-path decision (comment map)',
      code: `// Unweighted            -> BFS
// Weights 0/1           -> 0-1 BFS (deque)
// Non-negative weights  -> Dijkstra
// Negative weights      -> Bellman-Ford
// All-pairs, small V    -> Floyd-Warshall
// Weighted DAG          -> Topo + relax`,
    },
  ],
}

export function createGraphTopicContent({
  title,
  sectionTitle,
  parentTitle,
}: GraphTopicInput): TopicContent {
  const focus =
    SECTION_FOCUS[sectionTitle] ??
    'graph modeling, traversal/connectivity, and constraint-driven algorithm choice'
  const parent = parentTitle ? ` (under ${parentTitle})` : ''
  const sectionCodes = SECTION_TEMPLATES[sectionTitle]

  return {
    whatIsIt:
      `${title}${parent} — a graph algorithm/technique in ${sectionTitle}. ` +
      `Use it when the problem involves ${focus}.`,
    whyExists:
      `${title} exists to solve that family of graph problems efficiently and correctly under interview/CP constraints. ` +
      `The key ideas to internalize: ${focus}.`,
    mentalModel: `For ${title}: model G=(V,E), confirm direction/weights/connectivity, then apply the ${sectionTitle} approach (${focus}).`,
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: [
          `Identify how ${title} maps onto vertices, edges, direction, and weights.`,
          `Apply the core ${sectionTitle} invariant (${focus}).`,
          'Handle disconnected components (loop all unvisited starts) when the graph may not be connected.',
          'Record the answer (order, path, boolean, components, distances, etc.) as you traverse or relax.',
          'State time/space from the chosen method (typically O(V+E), O(E log V), O(VE), or O(V³)).',
        ],
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Complexity analysis',
        text:
          `For ${title}, expect O(V+E) for traversal-style work, O((V+E) log V) with a heap, O(VE) for full edge-relaxation passes, or O(V³) for dense all-pairs DP — match the algorithm to constraints. ` +
          `Section focus: ${focus}.`,
      },
    ],
    internals: [
      {
        type: 'list',
        items: [
          'Adjacency list is the default CP/interview representation: O(V+E) space, neighbor iteration O(deg(v)).',
          'BFS uses a queue (level order); DFS uses recursion or an explicit stack (structure / components / back edges).',
          'Shortest-path family: BFS (unweighted), 0-1 BFS (weights 0/1), Dijkstra (non-negative), Bellman-Ford (negatives), Floyd-Warshall (all-pairs, small V).',
          'Connectivity family: components (BFS/DFS), DSU (dynamic merges), SCC (Kosaraju/Tarjan), bridges/articulation points (disc/low).',
          'Ordering family: topological sort on DAGs (Kahn or DFS); condensation of SCCs is always a DAG.',
        ],
      },
    ],
    templates: [
      ...(sectionCodes ?? []).map((c) => ({
        language: 'java' as const,
        caption: `${title} — ${c.caption}`,
        code: c.code,
      })),
      {
        language: 'java',
        caption: `${title} — adjacency-list BFS skeleton (adapt per topic)`,
        code: `void bfs(int src, List<List<Integer>> adj, boolean[] vis) {
    Deque<Integer> q = new ArrayDeque<>();
    vis[src] = true;
    q.offer(src);
    while (!q.isEmpty()) {
        int u = q.poll();
        for (int v : adj.get(u)) {
            if (!vis[v]) {
                vis[v] = true;
                q.offer(v);
            }
        }
    }
}`,
      },
      {
        language: 'java',
        caption: `${title} — DFS skeleton (adapt for parent / colors / disc-low)`,
        code: `void dfs(int u, List<List<Integer>> adj, boolean[] vis) {
    vis[u] = true;
    for (int v : adj.get(u)) {
        if (!vis[v]) dfs(v, adj, vis);
    }
}`,
      },
    ],
    complexity: {
      best: 'Often O(V+E) for traversal / topo / SCC / bridges',
      average: 'Match the chosen algorithm: O(V+E), O(E log V), O(VE), or O(V³)',
      worst: 'Wrong algorithm under constraints (e.g. O(V²) or O(VE) at V=1e5)',
      space: 'Typically O(V+E) for adj list + O(V) auxiliaries',
    },
    failureModes: [
      `Implementing ${title} without stating graph direction, weights, or disconnected-component handling.`,
      'Using DFS for unweighted shortest path, or Dijkstra when negative edges (or cycles) are present.',
      'Forgetting parent checks in undirected cycle detection, or treating “visited” as enough for directed cycles.',
      'Assuming the graph is connected / starting only from node 0 without scanning all vertices.',
      'Ignoring constraints: O(V²) or O(VE) when V,E are 1e5+.',
    ],
    production: {
      performance: [
        'Prefer O(V+E) or O(E log V) templates for large sparse graphs; reserve Floyd-Warshall for small V (often ≤400–500).',
        'Use iterative DFS / BFS when recursion depth may hit V≈1e5 chains.',
      ],
      reliability: [
        'Use 64-bit distances when path sums can overflow 32-bit ints.',
        'Detect cycles explicitly when the problem requires a DAG (build systems, course schedules, topo + DP).',
      ],
      maintainability: [
        'Keep a standard template library: BFS, DFS, Dijkstra, DSU, Kahn, Kosaraju/Tarjan bridges/AP.',
        'Separate graph building from algorithm so the same BFS works on adj lists and grids.',
      ],
      observability: [
        'Log |V|, |E|, and chosen algorithm when debugging contest TLE/WA.',
        'For path problems, keep a parent[] array so you can reconstruct and print the path for verification.',
      ],
    },
    interview: {
      expectations: [
        `Define ${title} in ${sectionTitle} and name the graph model (V, E, direction, weights).`,
        'State the matching algorithm family and why alternatives fail.',
        'Give complexity and one classic practice problem.',
      ],
      commonQuestions: [
        `How does ${title} show up in coding interviews?`,
        'BFS vs DFS vs Dijkstra — when do you pick each?',
        'How do you detect a cycle in directed vs undirected graphs?',
      ],
      followUps: [
        'What if the graph is disconnected?',
        'Can you reconstruct / print the path or the cycle?',
        'What breaks if edge weights can be negative?',
      ],
      misconceptions: [
        'DFS always finds the shortest path.',
        'Dijkstra works with negative edges if you are careful.',
        'Visited alone detects directed cycles.',
      ],
      traps: [
        'Jumping to code before identifying vertices, edges, and constraints.',
        'Confusing Euler (edges) with Hamiltonian (vertices), or SCC with weakly connected components.',
      ],
      strongSignals: [
        'Uses a clear pattern → algorithm decision tree under constraints.',
        'Mentions parent/GRAY/indegree invariants and disconnected-component loops.',
      ],
    },
    keyTakeaways: [
      `${title} belongs to ${sectionTitle}.`,
      `Focus: ${focus}.`,
      'Model the graph first; then pick the algorithm from structure + constraints.',
    ],
    interviewQuestions: [
      {
        level: 'basic',
        question: `What is ${title}, and which graph pattern does it solve?`,
        answerHint: `Place it in ${sectionTitle}; name vertices/edges and the core algorithm idea.`,
      },
      {
        level: 'intermediate',
        question: `When would you choose ${title} over nearby graph algorithms?`,
        answerHint:
          'Compare with BFS/DFS/Dijkstra/Bellman-Ford/DSU/topo/SCC as applicable; cite weights, direction, and complexity.',
      },
      {
        level: 'advanced',
        question: `How would you implement and verify ${title} under tight constraints?`,
        answerHint: `Use ${focus}; discuss templates, edge cases (disconnect, overflow, cycles), and a practice problem.`,
      },
    ],
    flashcards: [
      { front: title, back: `${sectionTitle}: ${focus}.` },
      {
        front: `${title} review loop`,
        back: 'Model V/E → classify graph → pick algorithm → prove complexity → handle disconnect/cycles.',
      },
    ],
    quickRevision: [
      `${title} — ${sectionTitle}`,
      `Focus: ${focus}`,
      'Graph model before code',
      'Constraints pick the algorithm',
    ],
    patternRecognition: [
      'Unweighted shortest / levels → BFS or multi-source BFS.',
      'Non-negative weighted shortest → Dijkstra; negatives → Bellman-Ford.',
      'Dependencies / ordering → topological sort; mutual reachability → SCC.',
    ],
    commonMistakes: [
      'Wrong algorithm for the weight/direction model.',
      'Missing the all-components loop.',
      'Integer overflow on path distances.',
    ],
  }
}
