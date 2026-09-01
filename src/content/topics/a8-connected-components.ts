import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Connected components partition a graph into maximal groups where every pair of nodes has a path within the group. Count or label them with DFS/BFS from each unvisited node, or use Union-Find to merge edges incrementally—undirected graphs use either; directed graphs need strongly connected components (SCC).',
  whyExists:
    'Many problems reduce to “how many separate pieces?”—islands, friend circles, provinces, network reliability. Component ID enables per-component processing, counting, and checking connectivity queries without repeating full traversals.',
  mentalModel:
    'Drop paint from each unvisited node; DFS/BFS spreads through all reachable nodes—that’s one component. Repeat until every node painted. Union-Find instead merges pairs of nodes with edges until each set is one component.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'DFS/BFS: for i in 0..n-1, if !vis[i], run search, increment component count, assign comp[i]=id.',
        'Union-Find: for each edge union(u,v); number of distinct roots after all unions = components (if no isolated handling).',
        'Grid: each ‘1’ cell starts DFS if unvisited; each DFS = one island.',
        'Build compId[] to aggregate stats per component (size, min node, etc.).',
        'Check if graph connected: one DFS visits all n nodes.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Count vs label',
      text: 'Counting components only needs a counter++. Labeling comp[u] supports “same component?” queries and per-component DP later.',
    },
  ],
  architecture: {
    mermaid: `flowchart TD
  Start[For each node i] --> Vis{visited i?}
  Vis -->|no| Search[DFS/BFS from i]
  Search --> Inc[count++ comp id]
  Inc --> Start
  Vis -->|yes| Start
  Inc --> Done[All nodes processed]`,
    caption: 'Component counting via traversal',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Edges 0-1, 2-3, no cross edges: DFS from 0 marks {0,1}, count=1; skip 1 visited; from 2 marks {2,3}, count=2. Three isolated nodes with no edges → three components. Union-Find: union(0,1), union(2,3) → two roots.',
    },
    {
      type: 'table',
      headers: ['method', 'time', 'online edges?', 'best for'],
      rows: [
        ['DFS/BFS', 'O(V+E)', 'rebuild', 'grid, explicit graph'],
        ['Union-Find', 'O(E α(V))', 'yes', 'dynamic connectivity, Kruskal'],
        ['SCC (directed)', 'O(V+E)', '—', 'directed components'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Count components (adjacency list)',
      code: `int countComponents(int n, List<List<Integer>> adj) {
    boolean[] vis = new boolean[n];
    int comps = 0;
    for (int i = 0; i < n; i++) {
        if (!vis[i]) {
            dfs(i, adj, vis);
            comps++;
        }
    }
    return comps;
}`,
    },
    {
      language: 'java',
      caption: 'Union-Find component count',
      code: `int count = n;
for (int[] e : edges) {
    if (uf.union(e[0], e[1])) count--;
}
return count; // after unioning all edges`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Friend Circles / provinces (matrix)',
      code: `public int findCircleNum(int[][] isConnected) {
    int n = isConnected.length, comps = 0;
    boolean[] vis = new boolean[n];
    for (int i = 0; i < n; i++) {
        if (!vis[i]) {
            dfsMatrix(i, isConnected, vis);
            comps++;
        }
    }
    return comps;
}
void dfsMatrix(int u, int[][] m, boolean[] vis) {
    vis[u] = true;
    for (int v = 0; v < m.length; v++)
        if (m[u][v] == 1 && !vis[v]) dfsMatrix(v, m, vis);
}`,
    },
  ],
  complexity: {
    best: 'O(V+E) single traversal covers all',
    average: 'O(V+E) DFS/BFS; O(E α(V)) Union-Find',
    worst: 'O(V+E) or O(V²) matrix neighbor scan',
    space: 'O(V) visited + recursion/stack',
  },
  patternRecognition: [
    'Number of islands / provinces / friend circles.',
    'Graph valid tree: connected + E=V-1.',
    'Count components before/after adding bridge edge.',
    'Per-component aggregation (largest island size).',
    'Union-Find when edges arrive online or Kruskal context.',
  ],
  commonMistakes: [
    'Counting nodes instead of components (forget outer loop).',
    'Directed graph treated as undirected components.',
    'Matrix graph: only scan upper triangle wrong—check all v.',
    'Union-Find initial count n not decremented on successful union.',
    'Grid: 8-connect vs 4-connect changes component count.',
  ],
  variations: [
    'Largest component size during DFS',
    'Component labeling comp[] for later queries',
    'Tarjan/Kosaraju for strongly connected components (directed)',
    'Bipartite check per component',
  ],
  tradeoffs: {
    advantages: [
      'DFS/BFS simple and O(V+E)',
      'Union-Find handles incremental connectivity',
      'Component IDs enable divide-and-conquer on graph',
    ],
    disadvantages: [
      'Full recomputation if graph changes (without DSU)',
      'Directed needs SCC not plain CC',
      'Matrix scan O(V²) per node expensive',
    ],
    alternatives: ['Union-Find for edge streams', 'BFS same as DFS for counting'],
    whenToUse: ['Island count', 'Connectivity check', 'Friend networks'],
    whenNotToUse: ['Directed mutual reachability without SCC', 'Shortest path length'],
  },
  failureModes: [
    'Isolated nodes with no edges still one component each.',
    'Self-loops don’t merge components incorrectly if handled.',
    'Large grid recursion depth—use iterative BFS/DFS.',
  ],
  interview: {
    expectations: [
      'Outer loop over all nodes for CC count',
      'O(V+E) complexity',
      'Know Union-Find alternative',
    ],
    commonQuestions: [
      'Number of Islands',
      'Number of Connected Components in Undirected Graph',
      'Friend Circles',
      'Graph Valid Tree',
    ],
    followUps: ['Largest component size?', 'Directed graph?'],
    misconceptions: ['One DFS enough without outer loop', 'Components same as cycles'],
    traps: ['Matrix adjacency DFS bounds', 'Tree has one component but V-1 edges'],
    strongSignals: ['Mentions outer loop', 'Compares DSU vs DFS use cases'],
  },
  keyTakeaways: [
    'CC: maximal reachable sets in undirected graph.',
    'Count: outer loop + DFS/BFS from each unvisited node.',
    'O(V+E) time; O(V) space.',
    'Union-Find: start n, decrement on successful union.',
    'Directed → SCC (Tarjan), not plain CC.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'How count connected components?',
      answerHint: 'Loop all nodes; DFS/BFS from each unvisited; increment count per search.',
    },
    {
      level: 'intermediate',
      question: 'Graph valid tree conditions?',
      answerHint: 'Undirected, connected (one component), exactly V-1 edges, no cycle.',
    },
    {
      level: 'advanced',
      question: 'Union-Find vs DFS for components?',
      answerHint: 'DFS O(V+E) static graph; DSU O(α) per union, good dynamic edges and Kruskal.',
    },
  ],
  flashcards: [
    {
      front: 'CC counting template',
      back: 'For each unvisited node, DFS/BFS, count++.',
    },
    {
      front: 'Union-Find component count init',
      back: 'Start count = n; successful union decrements count.',
    },
  ],
  quickRevision: [
    'Outer loop + DFS from unvisited',
    'O(V+E) count components',
    'Grid island = one DFS per land cell',
    'Valid tree: connected + V-1 edges',
    'DSU: count starts at n',
    'Directed → SCC not CC',
    'Label comp[] for same-component queries',
  ],
}
