import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Graph representation chooses how to store vertices and edges—adjacency list (List<List<Integer>> or Map) for sparse graphs, adjacency matrix int[n][n] for dense or O(1) edge lookup, and edge list int[][] for Kruskal or simple I/O parsing.',
  whyExists:
    'Algorithm efficiency depends on representation: BFS/DFS need fast neighbor iteration (adjacency list O(degree)); Floyd-Warshall needs matrix; Union-Find often starts from edge list. Wrong choice causes TLE on sparse graphs or wasted memory on dense ones.',
  mentalModel:
    'Adjacency list = each person’s contact list (only actual friends). Matrix = full seating chart with checkboxes for every pair (wasteful if few connections). Edge list = raw roster of friendships to process later. Pick the shape that matches how you’ll traverse.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Adjacency list: for each u, list of neighbors v (and weights int[] or Edge objects). Space O(V+E).',
        'Adjacency matrix: adj[u][v]=1 or weight; O(1) edge query; space O(V²).',
        'Edge list: array of [u,v,w]; build list/matrix from it; natural for Kruskal.',
        'Directed vs undirected: undirected add v to u and u to v; directed one way only.',
        'Grid as graph: cells are nodes; 4/8 neighbors implicit—no explicit adj list needed.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Build adjacency list in Java',
      text: `List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
for (int[] e : edges) {
    adj.get(e[0]).add(e[1]);
    adj.get(e[1]).add(e[0]);
}`,
    },
  ],
  architecture: {
    mermaid: `flowchart TD
  Edges[Edge input] --> List[Adjacency List O V+E]
  Edges --> Matrix[Adj Matrix O V²]
  Edges --> EList[Edge List O E]
  List --> BFS[BFS/DFS/Dijkstra]
  Matrix --> FW[Floyd-Warshall]
  EList --> Kruskal[Kruskal MST]`,
    caption: 'Representation → algorithm fit',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Graph 0—1—2 (undirected): list adj[0]=[1], adj[1]=[0,2], adj[2]=[1]. Matrix 3×3: adj[0][1]=adj[1][0]=1, etc. Edge list [[0,1],[1,2]]. BFS from 0 visits via list neighbors in O(V+E).',
    },
    {
      type: 'table',
      headers: ['representation', 'space', 'edge query', 'iterate neighbors'],
      rows: [
        ['adjacency list', 'O(V+E)', 'O(degree)', 'O(degree)'],
        ['adjacency matrix', 'O(V²)', 'O(1)', 'O(V)'],
        ['edge list', 'O(E)', 'O(E) scan', 'O(E) scan'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Undirected adjacency list',
      code: `List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
for (int[] e : edges) {
    adj.get(e[0]).add(e[1]);
    adj.get(e[1]).add(e[0]);
}`,
    },
    {
      language: 'java',
      caption: 'Weighted directed adjacency list',
      code: `List<List<int[]>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
for (int[] e : edges) { // u, v, w
    adj.get(e[0]).add(new int[]{e[1], e[2]});
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Build from prerequisites (directed)',
      code: `public List<List<Integer>> buildDigraph(int n, int[][] edges) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) adj.get(e[0]).add(e[1]); // u -> v only
    return adj;
}`,
    },
  ],
  complexity: {
    best: 'O(V+E) to build list from edge list',
    average: 'List traversal O(V+E) for full graph scan',
    worst: 'Matrix O(V²) memory even if E ≪ V²',
    space: 'List O(V+E); matrix O(V²); edge list O(E)',
  },
  patternRecognition: [
    'Sparse graph / interview default → adjacency list.',
    'Need all-pairs shortest paths small V → matrix + Floyd-Warshall.',
    'Kruskal MST → sort edge list + Union-Find.',
    'Grid problems → implicit graph, dirs array.',
    'Multi-graph or self-loops → allow duplicate edges or dedupe per problem.',
  ],
  commonMistakes: [
    'Directed edge added both ways when should be one-way.',
    '0-indexed vs 1-indexed nodes off-by-one.',
    'Forgetting to initialize n empty lists before adding edges.',
    'Using matrix for n=10⁵ → memory blowup.',
    'Weighted graph stored as list<Integer> losing weights.',
  ],
  variations: [
    'HashMap graph for sparse non-contiguous node ids',
    'Compressed sparse row (CSR) for competitive programming',
    'Reverse adjacency list for indegree / backward BFS',
    'Implicit graphs: states as nodes (x,y,mask)',
  ],
  tradeoffs: {
    advantages: [
      'List: optimal for BFS/DFS/Dijkstra on sparse graphs',
      'Matrix: O(1) edge existence',
      'Edge list: simple input, good for Kruskal',
    ],
    disadvantages: [
      'Matrix wastes space when E ≪ V²',
      'List slow edge existence without HashSet per node',
      'Edge list poor neighbor iteration',
    ],
    alternatives: ['Hybrid: list + HashSet for fast contains', 'Matrix for V ≤ 500'],
    whenToUse: ['List: most graph traversals', 'Matrix: dense or Floyd', 'Edge list: Kruskal'],
    whenNotToUse: ['Matrix when V > ~5000 and sparse', 'Edge list alone for repeated neighbor BFS'],
  },
  failureModes: [
    'n nodes but edges reference node n (0-indexed trap).',
    'Disconnected nodes never appear in edges—still allocate n lists.',
    'Integer overflow storing dist in matrix path problems.',
  ],
  interview: {
    expectations: [
      'Build adjacency list from edges in Java',
      'State space and time for list vs matrix',
      'Directed vs undirected edge insertion',
    ],
    commonQuestions: [
      'Number of Islands (grid implicit graph)',
      'Clone Graph (adj list + HashMap old→new)',
      'Course Schedule (directed list)',
      'Network Delay Time (weighted list)',
    ],
    followUps: ['When matrix over list?', 'How represent weighted edges?'],
    misconceptions: ['Always use matrix', 'Grid needs explicit adj list'],
    traps: ['1-indexed nodes in input', 'Self-loop and duplicate edges'],
    strongSignals: ['Chooses list by default with E reasoning', 'Mentions grid as implicit graph'],
  },
  keyTakeaways: [
    'Default sparse graphs: adjacency list O(V+E) space.',
    'Undirected: add both directions; directed: one way.',
    'Weighted: list of int[] {neighbor, weight}.',
    'Grid: neighbors via dirs, no explicit graph build.',
    'Matrix O(V²) only when dense or all-pairs small V.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Adjacency list vs matrix tradeoff?',
      answerHint: 'List O(V+E) space, fast neighbor scan; matrix O(V²), O(1) edge lookup.',
    },
    {
      level: 'intermediate',
      question: 'How build undirected adjacency list from edges[][]?',
      answerHint: 'n empty ArrayLists; for each [u,v] add v to u and u to v.',
    },
    {
      level: 'advanced',
      question: 'When use edge list as primary representation?',
      answerHint: 'Kruskal MST (sort edges), or when only sequential edge processing; rebuild list if need traversals.',
    },
  ],
  flashcards: [
    {
      front: 'Adjacency list space',
      back: 'O(V + E).',
    },
    {
      front: 'Default graph rep for BFS/DFS',
      back: 'Adjacency list.',
    },
  ],
  quickRevision: [
    'Sparse → adjacency list O(V+E)',
    'Dense/small V → matrix O(V²)',
    'Kruskal → edge list + sort',
    'Undirected: both directions',
    'Weighted: int[] {v, w}',
    'Grid = implicit graph + dirs',
    '0-index vs 1-index nodes',
  ],
}
