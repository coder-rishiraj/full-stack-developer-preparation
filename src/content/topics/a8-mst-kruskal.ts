import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    "Kruskal's algorithm builds a minimum spanning tree (MST) by sorting edges ascending by weight and greedily adding each edge if it connects two different components—detected with Union-Find (Disjoint Set Union). Result: V-1 edges, minimum total weight, connected undirected graph.",
  whyExists:
    'MST connects all vertices at minimum cable/road cost. Kruskal excels on sparse graphs stored as edge lists—sort once, union-find rejects cycle-forming edges in near O(α(V)).',
  mentalModel:
    'Lay cables cheapest first: sort all edges by price, add if endpoints not already connected; skip edges that would create a loop.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Sort edges (u, v, w) by w ascending.',
        'Initialize DSU with V components.',
        'For each edge: if find(u) != find(v), union(u,v), add w to total, store edge.',
        'Stop when V-1 edges chosen (connected graph).',
        'If fewer than V-1 edges, graph disconnected—forest not single MST.',
        'Path compression + rank union for amortized α(V) per op.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Triangle edges (0,1,1), (1,2,2), (0,2,3): Kruskal picks weight 1 then 2, skips 3 (would cycle)—MST weight 3.',
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Union-Find with path compression',
      code: `class DSU {
    int[] p, r;
    DSU(int n) { p = new int[n]; r = new int[n]; for (int i = 0; i < n; i++) p[i] = i; }
    int find(int x) { return p[x] == x ? x : (p[x] = find(p[x])); }
    boolean union(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (r[a] < r[b]) { int t = a; a = b; b = t; }
        p[b] = a;
        if (r[a] == r[b]) r[a]++;
        return true;
    }
}`,
    },
    {
      language: 'java',
      caption: "Kruskal MST total weight",
      code: `int kruskal(int n, int[][] edges) {
    Arrays.sort(edges, Comparator.comparingInt(e -> e[2]));
    DSU dsu = new DSU(n);
    int total = 0, count = 0;
    for (int[] e : edges) {
        if (dsu.union(e[0], e[1])) {
            total += e[2];
            if (++count == n - 1) break;
        }
    }
    return count == n - 1 ? total : -1;
}`,
    },
  ],
  complexity: {
    best: 'O(E log E) sort dominates',
    average: 'O(E log E + E α(V))',
    worst: 'O(E log E)',
    space: 'O(V) DSU + O(E) edges',
  },
  patternRecognition: [
    'Min Cost to Connect All Points (complete graph MST).',
    'Connecting Cities With Minimum Cost.',
    'Kruskal when graph given as edge list.',
    'Detect cycle in undirected graph (union fails).',
  ],
  commonMistakes: [
    'Forgetting to sort edges first.',
    'Not checking connected (count < V-1).',
    'Using BFS instead of union-find for cycle check.',
    '0-indexed vs 1-indexed vertex labels.',
  ],
  tradeoffs: {
    advantages: [
      'Natural on edge list input',
      'Union-find cycle detection O(α(V))',
      'Produces MST globally minimum weight',
    ],
    disadvantages: [
      'Sort all edges O(E log E)',
      'Less natural on adjacency matrix without extracting edges',
      'Prim can be better on dense graphs with heap',
    ],
    alternatives: ["Prim's with min-heap on dense adjacency", 'Borůvka parallel MST'],
    whenToUse: ['Sparse graph edge list', 'Need MST total weight or edge set', 'Cycle detection via DSU'],
    whenNotToUse: ['Dense complete graph sometimes Prim simpler', 'Directed graph (MST undirected)'],
  },
  failureModes: [
    'Disconnected graph: cannot pick V-1 edges.',
    'Duplicate edges: union-find still correct, may add redundant check.',
    'Integer overflow on total weight—use long.',
  ],
  interview: {
    expectations: [
      'Sort edges + union-find',
      'Skip edge if same component',
      'O(E log E) time',
    ],
    commonQuestions: ['Min Cost Connect Points', 'MST vs shortest path?', 'Prove Kruskal greedy?'],
    followUps: ["Compare Prim?", 'What if graph disconnected?', 'DSU path compression?'],
    misconceptions: ['MST same as shortest path tree', 'Any greedy edge order works', 'Kruskal needs adjacency list'],
    traps: ['Not breaking when count==n-1', 'Union without sorting first'],
    strongSignals: ['Clean DSU template', 'States cut property / cycle avoidance', 'Knows when disconnected'],
  },
  keyTakeaways: [
    'Sort edges by weight; add if union succeeds.',
    'Union-find detects cycles in O(α(V)).',
    'O(E log E) from sort.',
    'Exactly V-1 edges if connected.',
    'Edge list friendly; Prim for dense adjacency.',
  ],
  interviewQuestions: [
    { level: 'basic', question: "Kruskal's algorithm steps?", answerHint: 'Sort edges ascending; union-find add edge if connects different components until V-1 edges.' },
    { level: 'intermediate', question: 'Why skip edge when find(u)==find(v)?', answerHint: 'Same component—adding edge creates cycle; MST must be acyclic.' },
    { level: 'advanced', question: 'Kruskal vs Prim when?', answerHint: 'Kruskal on sparse edge lists; Prim on dense graphs with adjacency matrix/heap grows from seed vertex.' },
  ],
  flashcards: [
    { front: 'Kruskal first step', back: 'Sort all edges by weight ascending.' },
    { front: 'Cycle check', back: 'Union-find: skip if find(u) == find(v).' },
    { front: 'Kruskal time', back: 'O(E log E) dominated by sort.' },
  ],
  quickRevision: [
    'Sort edges by weight',
    'DSU union if different set',
    'Stop at V-1 edges',
    'O(E log E)',
    'Disconnected → fail',
    'Path compression DSU',
    'Edge list input',
  ],
}
