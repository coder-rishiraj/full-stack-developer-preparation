import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    "Prim's algorithm grows a minimum spanning tree from a seed vertex by repeatedly adding the cheapest edge connecting the tree to a vertex outside it—implemented with a min-heap of (weight, vertex) for the cut frontier. O(E log V) with binary heap.",
  whyExists:
    'On dense graphs or adjacency-list representations, Prim avoids sorting all edges upfront like Kruskal. Greedy cut property: minimum edge crossing any cut belongs to some MST—Prim always picks min crossing edge from growing tree.',
  mentalModel:
    'Start with one city on the network; always connect the nearest unconnected city with the cheapest cable from any city already wired.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Pick start vertex s; inMST[s]=true; push all edges from s to PQ (w, v).',
        'While PQ not empty and MST has < V-1 edges: poll (w,u); if u in MST skip stale; else add u, total+=w.',
        'For each neighbor v of u not in MST: offer (w(u,v), v) to PQ.',
        'Stale entries: skip when polled vertex already in MST.',
        'Adjacency matrix variant: scan all V vertices each step O(V²) no heap.',
        'Same MST weight as Kruskal on connected undirected graph.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'From node 0 with edges (0,1,1), (0,2,4), (1,2,2): start 0, add 1 via weight 1, from {0,1} cheapest to outside is (1,2,2)—MST weight 3.',
    },
  ],
  templates: [
    {
      language: 'java',
      caption: "Prim's MST with min-heap (adjacency list)",
      code: `int prim(int n, List<List<int[]>> adj) {
    boolean[] inMst = new boolean[n];
    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
    pq.offer(new int[]{0, 0});
    int total = 0, added = 0;
    while (!pq.isEmpty() && added < n) {
        int[] cur = pq.poll();
        int w = cur[0], u = cur[1];
        if (inMst[u]) continue;
        inMst[u] = true;
        total += w;
        added++;
        for (int[] e : adj.get(u)) {
            int v = e[0], weight = e[1];
            if (!inMst[v]) pq.offer(new int[]{weight, v});
        }
    }
    return added == n ? total : -1;
}`,
    },
    {
      language: 'java',
      caption: 'O(V²) Prim for dense matrix',
      code: `int primMatrix(int[][] g) {
    int n = g.length;
    int[] minW = new int[n];
    boolean[] used = new boolean[n];
    Arrays.fill(minW, Integer.MAX_VALUE);
    minW[0] = 0;
    int total = 0;
    for (int i = 0; i < n; i++) {
        int u = -1;
        for (int v = 0; v < n; v++)
            if (!used[v] && (u == -1 || minW[v] < minW[u])) u = v;
        used[u] = true;
        total += minW[u];
        for (int v = 0; v < n; v++)
            if (!used[v] && g[u][v] < minW[v]) minW[v] = g[u][v];
    }
    return total;
}`,
    },
  ],
  complexity: {
    best: 'O(E log V) binary heap sparse',
    average: 'O(E log V)',
    worst: 'O(V²) matrix scan without heap',
    space: 'O(V + E) inMST + PQ',
  },
  patternRecognition: [
    'Min Cost to Connect All Points (Prim on implicit complete graph).',
    'Dense adjacency matrix MST.',
    'Similar PQ pattern to Dijkstra—different meaning (inMST vs dist finalized).',
  ],
  commonMistakes: [
    'Confusing with Dijkstra—Prim adds to tree not shortest path from source.',
    'No stale skip when vertex already in MST.',
    'Start node weight 0 counted twice.',
    'Undirected edges must appear both directions in adj list.',
  ],
  tradeoffs: {
    advantages: [
      'Efficient on dense graphs with matrix O(V²)',
      'No edge sort; grows locally',
      'Same greedy cut property as Kruskal',
    ],
    disadvantages: [
      'Needs good start vertex; disconnected needs outer loop',
      'Heap Prim O(E log V) with many PQ duplicates',
      'Less natural on edge-list-only input',
    ],
    alternatives: ['Kruskal with union-find on edge list', 'Borůvka for parallel'],
    whenToUse: ['Dense graph / adjacency matrix', 'Graph as adjacency list with heap', 'Complete graph implicit edges'],
    whenNotToUse: ['Sparse edge list only—Kruskal simpler', 'Need cycle detection in dynamic graph'],
  },
  failureModes: [
    'Disconnected graph: added < n, return failure.',
    'Self-loops ignored if weight 0.',
    'Multiple components: run Prim per component or use Kruskal globally.',
  ],
  interview: {
    expectations: [
      'Min-heap frontier of crossing edges',
      'Skip inMST vertices on poll',
      'O(E log V) with heap',
    ],
    commonQuestions: ['Min Cost Connect Points with Prim', 'Prim vs Kruskal?', 'Prim vs Dijkstra?'],
    followUps: ['Dense O(V²) variant?', 'Disconnected graph?', 'Cut property proof sketch?'],
    misconceptions: ['Prim finds shortest paths from source', 'Must sort edges', 'Different MST weight than Kruskal'],
    traps: ['Offer start with weight 0 but count weight in total only once correctly', 'Directed graph MST'],
    strongSignals: ['Explains cut property', 'Knows matrix O(V²) Prim', 'Distinguishes from Dijkstra clearly'],
  },
  keyTakeaways: [
    'Grow MST; PQ stores cheapest edge to outside vertex.',
    'Skip poll if vertex already in MST.',
    'O(E log V) heap; O(V²) dense matrix.',
    'Same total weight as Kruskal.',
    'Not shortest path—only min spanning tree.',
  ],
  interviewQuestions: [
    { level: 'basic', question: "Prim's greedy choice?", answerHint: 'Minimum weight edge from tree to non-tree vertex (minimum crossing cut edge).' },
    { level: 'intermediate', question: 'Prim vs Dijkstra difference?', answerHint: 'Prim tracks min edge to join MST; Dijkstra tracks min distance from single source—different optimality.' },
    { level: 'advanced', question: 'When O(V²) Prim beats heap Prim?', answerHint: 'Dense graph E≈V²—matrix scan avoids log factor and heap overhead.' },
  ],
  flashcards: [
    { front: "Prim's PQ stores", back: '(weight, vertex) min-heap of edges from MST to outside.' },
    { front: 'Stale entry handling', back: 'Skip if vertex already in MST when polled.' },
    { front: "Prim heap complexity", back: 'O(E log V).' },
  ],
  quickRevision: [
    'Grow tree from seed',
    'PQ min crossing edge',
    'Skip if inMST on poll',
    'O(E log V) heap',
    'O(V²) dense matrix',
    'Same MST as Kruskal',
    'Not shortest path',
  ],
}
