import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Union-Find (Disjoint Set Union, DSU) maintains a partition of elements into dynamic sets with near-constant find and union—using parent pointers, path compression, and union by rank/size. It answers connectivity, detects cycles in undirected graphs, and powers Kruskal’s MST.',
  whyExists:
    'Repeated “are u and v connected?” and “merge sets” operations arise in Kruskal, network connectivity, image labeling, and percolation. DFS recomputes from scratch; DSU updates incrementally in O(α(n)) amortized per operation—effectively constant.',
  mentalModel:
    'Each set is a tree of parent pointers pointing toward a root representative. find(x) walks to root (compressing paths); union attaches smaller tree under larger root. “Same root?” means same component.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'parent[i]=i initially; rank[i]=0 or size[i]=1.',
        'find(x): if parent[x]!=x, parent[x]=find(parent[x]); return parent[x].',
        'union(a,b): ra=find(a), rb=find(b); if ra==rb return false; link by rank/size; return true.',
        'Connected: find(u)==find(v). Component count: starts n, decrement on successful union.',
        'Cycle undirected: before union, if find(u)==find(v), edge (u,v) closes cycle.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Union by size vs rank',
      text: 'Both keep trees shallow. Size tracking also gives component size on find root if you store size at root—useful for “largest component” problems.',
    },
  ],
  architecture: {
    mermaid: `flowchart TD
  Find[find x] --> Root{parent x == x?}
  Root -->|yes| Ret[x]
  Root -->|no| PC[path compress parent x]
  PC --> Find
  Union[union a b] --> F[find a find b]
  F --> Same{same root?}
  Same -->|yes| Skip[false cycle]
  Same -->|no| Link[attach smaller under larger]`,
    caption: 'Union-Find operations',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Edges (0,1), (1,2), (2,3): union merges {0,1,2,3} one set. Edge (0,3) later: find(0)==find(3) already → cycle. Kruskal sorts edges by weight, unions if different sets, skips cycle edges.',
    },
    {
      type: 'table',
      headers: ['operation', 'without optimization', 'with PC + rank'],
      rows: [
        ['find', 'O(n) worst', 'O(α(n)) amortized'],
        ['union', 'O(n) worst', 'O(α(n)) amortized'],
        ['connected', 'O(α(n))', 'O(α(n))'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Union-Find class',
      code: `class UF {
    int[] parent, rank;
    UF(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        if (rank[ra] == rank[rb]) rank[ra]++;
        return true;
    }
}`,
    },
    {
      language: 'java',
      caption: 'Union by size with component count',
      code: `class UF {
    int[] parent, size;
    int components;
    UF(int n) {
        parent = new int[n]; size = new int[n]; components = n;
        for (int i = 0; i < n; i++) { parent[i] = i; size[i] = 1; }
    }
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    void union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return;
        if (size[ra] < size[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        size[ra] += size[rb];
        components--;
    }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Redundant Connection (first cycle edge)',
      code: `public int[] findRedundantConnection(int[][] edges) {
    UF uf = new UF(edges.length);
    for (int[] e : edges) {
        if (!uf.union(e[0] - 1, e[1] - 1)) return e; // 1-indexed
    }
    return new int[0];
}`,
    },
  ],
  complexity: {
    best: 'O(α(n)) per find/union amortized',
    average: 'O(α(n)) ≈ inverse Ackermann, effectively constant',
    worst: 'O(n) without path compression/rank; O(α(n)) with both',
    space: 'O(n) parent + rank/size arrays',
  },
  patternRecognition: [
    'Dynamic connectivity online edges.',
    'Kruskal MST: sort edges, union if different sets.',
    'Detect cycle in undirected graph adding edges.',
    'Number of connected components decrementing on union.',
    'Accounts merge (Smallest String With Swaps), island count with union on grid neighbors.',
  ],
  commonMistakes: [
    'find without path compression → TLE on deep chains.',
    'Union without rank/size → degenerate linked list.',
    'Off-by-one 1-indexed nodes vs 0-indexed UF array.',
    'Using DSU for directed cycle detection (wrong tool).',
    'Forgetting to initialize parent[i]=i for all i including isolated nodes.',
  ],
  variations: [
    'Union by size + track max component size',
    'Rollback DSU (persistent—advanced)',
    'DSU on grid cells with 4-neighbor unions',
    'Weighted DSU with parity (bipartite check variant)',
  ],
  tradeoffs: {
    advantages: [
      'Near O(1) amortized union/find',
      'Simple array implementation',
      'Perfect for edge-stream connectivity and Kruskal',
    ],
    disadvantages: [
      'Undirected connectivity only (standard DSU)',
      'No path listing or shortest path',
      'Offline edge list often paired with sort for Kruskal',
    ],
    alternatives: ['DFS/BFS for one-shot CC', 'Tarjan for directed SCC', 'Floyd for all-pairs tiny graphs'],
    whenToUse: ['Kruskal', 'Redundant connection', 'Dynamic connectivity'],
    whenNotToUse: ['Directed reachability', 'Shortest path', 'Need actual path between nodes'],
  },
  failureModes: [
    'n nodes but edges reference index n—bounds error.',
    'Not unioning both directions conceptually—undirected one union call enough.',
    'Recursion depth in find on huge n without compression—stack overflow rare with PC.',
  ],
  interview: {
    expectations: [
      'Implement find with path compression',
      'Union by rank or size',
      'State O(α(n)) or “nearly O(1)” amortized',
    ],
    commonQuestions: [
      'Redundant Connection',
      'Number of Provinces (can use UF)',
      'Accounts Merge',
      'Most Stones Removed (connected groups)',
    ],
    followUps: ['Kruskal connection?', 'Track component sizes?'],
    misconceptions: ['DSU works for directed graphs', 'find is O(1) worst case always'],
    traps: ['1-indexed problem nodes', 'Return false on union means cycle edge'],
    strongSignals: ['Writes both optimizations unprompted', 'Explains Kruskal + DSU pipeline'],
  },
  keyTakeaways: [
    'parent[i] forest; find root with path compression.',
    'union by rank/size keeps trees shallow.',
    'O(α(n)) amortized per operation.',
    'find(u)==find(v) ⇒ same component; union false ⇒ cycle edge.',
    'Kruskal: sort edges, union if different sets.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does Union-Find solve?',
      answerHint: 'Dynamic connectivity: merge sets, query if two elements same set, detect undirected cycles.',
    },
    {
      level: 'intermediate',
      question: 'Path compression and union by rank purpose?',
      answerHint: 'Keep trees shallow; find amortized inverse Ackermann; without them degenerate to O(n).',
    },
    {
      level: 'advanced',
      question: 'Use DSU in Kruskal MST?',
      answerHint: 'Sort edges by weight; add edge if union(u,v) merges different sets; skip if same set (cycle).',
    },
  ],
  flashcards: [
    {
      front: 'Union-Find amortized complexity',
      back: 'O(α(n)) per find/union with PC + rank.',
    },
    {
      front: 'Cycle edge with DSU',
      back: 'find(u) == find(v) before union on undirected edge.',
    },
  ],
  quickRevision: [
    'parent[i]=i init',
    'find with path compression',
    'union by rank/size',
    'O(α(n)) amortized',
    'Same root = connected',
    'Kruskal: sort + union',
    'Undirected only; not directed reachability',
  ],
}
