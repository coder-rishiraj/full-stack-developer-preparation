import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    "Bellman-Ford computes single-source shortest paths in graphs that may have negative edge weights by relaxing every edge V-1 times. A V-th relaxation pass that still improves any distance detects a negative-weight cycle reachable from the source.",
  whyExists:
    "Dijkstra fails on negative edges. Bellman-Ford handles negatives in O(VE) and detects negative cycles—needed for currency arbitrage, difference constraints, and when edge weights can be negative but no negative cycles.",
  mentalModel:
    "Repeat V-1 rounds of 'try to improve every edge u→v with dist[u]+w'. Each round allows paths one edge longer. If round V still improves, a negative cycle exists—distances undefined.",
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Initialize dist[src]=0, others ∞.',
        'Repeat V-1 times: for each edge (u,v,w), if dist[u]+w < dist[v], dist[v]=dist[u]+w.',
        'V-th pass: any improvement → negative cycle reachable from src.',
        'Path reconstruction via parent[] on relax.',
        'SPFA optimization: queue nodes when dist improves; average faster but worst O(VE).',
        'Difference constraints Ax≤b: edge i→j weight b_i; negative cycle means infeasible.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Negative cycle vs negative edge',
      text: 'Negative edges OK if no negative cycle. Cycle makes shortest path -∞ (keep relaxing forever).',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Graph 0→1 weight 1, 1→2 weight -2, 0→2 weight 4: after relaxations dist[2]=min(4, 1+(-2))=-1. If 2→0 weight -5 added, total cycle weight negative → Bellman-Ford detects on V-th pass.',
    },
    {
      type: 'table',
      headers: ['algorithm', 'weights', 'time'],
      rows: [
        ['Dijkstra', 'non-negative', 'O((V+E) log V)'],
        ['Bellman-Ford', 'any, detect neg cycle', 'O(VE)'],
        ['SPFA', 'same, queue heuristic', 'O(VE) worst'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Bellman-Ford with negative cycle detection',
      code: `int[] bellmanFord(int n, int src, int[][] edges) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    for (int i = 0; i < n - 1; i++)
        for (int[] e : edges)
            if (dist[e[0]] != Integer.MAX_VALUE && dist[e[0]] + e[2] < dist[e[1]])
                dist[e[1]] = dist[e[0]] + e[2];
    for (int[] e : edges)
        if (dist[e[0]] != Integer.MAX_VALUE && dist[e[0]] + e[2] < dist[e[1]])
            throw new IllegalStateException("negative cycle");
    return dist;
}`,
    },
    {
      language: 'java',
      caption: 'SPFA (queue-based Bellman-Ford)',
      code: `int[] spfa(int n, int src, List<List<int[]>> adj) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    boolean[] inQ = new boolean[n];
    int[] cnt = new int[n];
    Deque<Integer> q = new ArrayDeque<>();
    q.offer(src); inQ[src] = true;
    while (!q.isEmpty()) {
        int u = q.poll(); inQ[u] = false;
        if (dist[u] == Integer.MAX_VALUE) continue;
        for (int[] e : adj.get(u)) {
            int v = e[0], w = e[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                if (!inQ[v]) {
                    q.offer(v); inQ[v] = true;
                    if (++cnt[v] >= n) throw new IllegalStateException("neg cycle");
                }
            }
        }
    }
    return dist;
}`,
    },
  ],
  complexity: {
    best: 'O(E) SPFA on some sparse graphs',
    average: 'O(VE) Bellman-Ford standard',
    worst: 'O(VE) every round relaxes all edges',
    space: 'O(V) dist + parent',
  },
  patternRecognition: [
    'Network Delay with negative weights (rare)—Bellman-Ford.',
    'Cheapest Flights with negative? usually non-neg.',
    'Currency arbitrage / negative cycle detection.',
    'Difference constraints system feasibility.',
  ],
  commonMistakes: [
    'Using Dijkstra with negative edges.',
    'Only V-2 relaxations instead of V-1.',
    'dist[u]+w overflow when dist[u]==INF—guard check.',
    'Detecting cycle on unreachable component—must be reachable from src.',
  ],
  tradeoffs: {
    advantages: [
      'Handles negative edge weights',
      'Detects negative cycles',
      'Works on edge list without adjacency build',
      'Models difference constraints',
    ],
    disadvantages: [
      'O(VE) slower than Dijkstra on sparse non-neg graphs',
      'SPFA worst case still O(VE), can TLE adversarially',
      'Not for all-pairs (use Floyd-Warshall small V)',
    ],
    alternatives: ['Dijkstra if non-negative', 'Floyd-Warshall all-pairs V≤400', '0-1 BFS special weights'],
    whenToUse: ['Negative edges possible', 'Negative cycle detection', 'Difference constraints'],
    whenNotToUse: ['All weights non-negative', 'All-pairs on medium V', 'Unweighted BFS enough'],
  },
  failureModes: [
    'INF + negative weight still INF without guard → bogus relax.',
    'Missing V-th pass cycle check.',
    'Negative self-loop at src immediately detectable.',
  ],
  interview: {
    expectations: [
      'V-1 relaxation rounds over all edges',
      'V-th pass detects negative cycle',
      'O(VE) time',
    ],
    commonQuestions: ['Why not Dijkstra with negatives?', 'Detect arbitrage cycle', 'SPFA vs standard?'],
    followUps: ['Difference constraints encoding?', 'Path reconstruction?', 'Why V-1 enough?'],
    misconceptions: ['Any negative edge invalidates shortest path', 'Bellman-Ford finds all-pairs', 'SPFA always faster'],
    traps: ['Forget INF guard on relax', 'Cycle detection without reachability from source'],
    strongSignals: ['Explains V-1 longest simple path argument', 'Mentions SPFA queue heuristic', 'Maps constraints to graph'],
  },
  keyTakeaways: [
    'Relax all edges V-1 times; O(VE).',
    'V-th improvement → negative cycle reachable.',
    'Guard dist[u]!=INF before relax.',
    'SPFA: queue nodes on improve; cnt[v]>=n → cycle.',
    'Use Dijkstra when weights non-negative.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Bellman-Ford time complexity?', answerHint: 'O(VE)—V-1 passes each scanning E edges.' },
    { level: 'intermediate', question: 'Why V-1 iterations suffice?', answerHint: 'Simple shortest path has at most V-1 edges; each pass extends max path length by one.' },
    { level: 'advanced', question: 'Difference constraints to graph?', answerHint: 'x_j - x_i <= w becomes edge i→j weight w; feasible iff no negative cycle.' },
  ],
  flashcards: [
    { front: 'Bellman-Ford passes', back: 'V-1 relax all edges; V-th pass detects negative cycle.' },
    { front: 'Time complexity', back: 'O(VE).' },
    { front: 'When vs Dijkstra', back: 'Bellman-Ford for negative edges; Dijkstra requires non-negative.' },
  ],
  quickRevision: [
    'V-1 relax every edge',
    'V-th improve = neg cycle',
    'O(VE) time',
    'INF guard before relax',
    'SPFA queue heuristic',
    'Difference constraints edges',
    'Not for all-pairs large V',
  ],
}
