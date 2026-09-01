import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    "Dijkstra's algorithm computes shortest paths from a single source in a graph with non-negative edge weights—using a min-heap priority queue to always relax the closest un finalized vertex first, guaranteeing optimal distances when weights ≥ 0.",
  whyExists:
    'BFS only handles unit weights; Bellman-Ford is O(VE) and allows negatives. Dijkstra fills the gap for non-negative weights in O((V+E) log V) with a binary heap—standard for network routing, maps, and weighted grid paths in interviews.',
  mentalModel:
    'Greedy expansion from source: always settle the closest unknown node next—like flood filling by increasing cost rings. Once a node is popped with minimum heap key, its distance is final; relax all outgoing edges to improve neighbors.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Initialize dist[src]=0, others ∞; PQ min-heap of (dist, node).',
        'While PQ not empty: poll (d,u); if d > dist[u] skip stale entry; for (v,w) in adj[u], if dist[u]+w < dist[v], update and offer (dist[v], v).',
        'Non-negative weights ensure first finalization is optimal.',
        'Path reconstruction: parent[v]=u when relaxing.',
        'Grid with costs: each cell neighbor edge weight from matrix.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Stale heap entries',
      text: 'Do not decrease-key in Java PQ—offer new pair and skip on poll when d > dist[u]. Multiple entries per node is OK.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  PQ[Min-heap by dist] --> Pop[Pop smallest d,u]
  Pop --> Stale{d > dist u?}
  Stale -->|yes| PQ
  Stale -->|no| Relax[Relax edges u to v]
  Relax --> Improve{better dist?}
  Improve -->|yes| Push[Push dist v,v to PQ]
  Improve -->|no| PQ
  Push --> PQ`,
    caption: "Dijkstra's greedy settlement",
  },
  example: [
    {
      type: 'paragraph',
      text: 'Source 0, edges 0—(1,w1), 0—(2,w4), 1—(2,w2): dist[0]=0; pop 0 relax → dist[1]=1, dist[2]=4; pop 1 relax 2 → dist[2]=3; pop 2 done. Negative edge breaks algorithm—use Bellman-Ford.',
    },
    {
      type: 'table',
      headers: ['algorithm', 'weights', 'time with binary heap'],
      rows: [
        ['BFS', 'unweighted', 'O(V+E)'],
        ['Dijkstra', 'non-negative', 'O((V+E) log V)'],
        ['Bellman-Ford', 'any, no neg cycle', 'O(VE)'],
        ['0-1 BFS', '0 or 1 only', 'O(V+E) deque'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Dijkstra with PriorityQueue',
      code: `int[] dijkstra(int src, List<List<int[]>> adj) {
    int n = adj.size();
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
    pq.offer(new int[]{0, src});
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int d = cur[0], u = cur[1];
        if (d > dist[u]) continue;
        for (int[] e : adj.get(u)) {
            int v = e[0], w = e[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.offer(new int[]{dist[v], v});
            }
        }
    }
    return dist;
}`,
    },
    {
      language: 'java',
      caption: 'With path reconstruction',
      code: `int[] parent = new int[n];
Arrays.fill(parent, -1);
// on relax:
if (dist[u] + w < dist[v]) {
    dist[v] = dist[u] + w;
    parent[v] = u;
    pq.offer(new int[]{dist[v], v});
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Network Delay Time',
      code: `public int networkDelayTime(int[][] times, int n, int k) {
    List<List<int[]>> adj = new ArrayList<>();
    for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
    for (int[] t : times) adj.get(t[0]).add(new int[]{t[1], t[2]});
    int[] dist = new int[n + 1];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[k] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
    pq.offer(new int[]{0, k});
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int d = cur[0], u = cur[1];
        if (d > dist[u]) continue;
        for (int[] e : adj.get(u)) {
            int v = e[0], w = e[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.offer(new int[]{dist[v], v});
            }
        }
    }
    int ans = 0;
    for (int i = 1; i <= n; i++) {
        if (dist[i] == Integer.MAX_VALUE) return -1;
        ans = Math.max(ans, dist[i]);
    }
    return ans;
}`,
    },
  ],
  complexity: {
    best: 'O(E log V) sparse when each edge relaxed once',
    average: 'O((V+E) log V) binary heap',
    worst: 'O(V² log V) if many stale PQ entries; Fibonacci heap O(E+V log V) theoretical',
    space: 'O(V) dist + parent + PQ entries',
  },
  patternRecognition: [
    'Weighted shortest path non-negative edges.',
    'Network delay / cheapest flight with k stops (modified Dijkstra).',
    'Path in grid with varying cell costs.',
    'Multi-source: super-source zero edges or initialize all sources in PQ.',
    'Count paths with given distance (count relaxations when dist equal—careful).',
  ],
  commonMistakes: [
    'Using Dijkstra with negative edges—wrong distances.',
    'No stale check after poll → extra work but usually still correct with non-neg.',
    'Integer overflow dist[u]+w—use long or INF guard if dist[u]==INF skip.',
    'Confusing with BFS on unweighted graph.',
    'Trying decrease-key without Java PQ support—re-offer instead.',
  ],
  variations: [
    '0-1 BFS with deque for weights 0 and 1 only',
    'A* with heuristic for grids',
    'Dijkstra on implicit graph (state = node + mask)',
    'K stops: dist[node][stops] state in PQ',
  ],
  tradeoffs: {
    advantages: [
      'Optimal non-negative shortest paths',
      'Simple PQ template in Java',
      'Works on sparse graphs efficiently',
    ],
    disadvantages: [
      'Fails with negative weights',
      'O(log V) factor per edge with binary heap',
      'Many PQ duplicates without decrease-key',
    ],
    alternatives: ['BFS unweighted', 'Bellman-Ford negatives', 'Floyd V≤400 all-pairs'],
    whenToUse: ['Non-negative edge weights', 'Single-source shortest path'],
    whenNotToUse: ['Negative edges', 'Unweighted (use BFS)', 'All-pairs tiny V only Floyd'],
  },
  failureModes: [
    'Negative edge causes wrong answer silently.',
    'dist[u]+w overflow when dist[u] still INF—check before add.',
    'Disconnected nodes stay INF—handle -1 or unreachable in answer.',
  ],
  interview: {
    expectations: [
      'PQ min-heap (dist, node)',
      'Stale entry skip after poll',
      'O((V+E) log V) with binary heap',
    ],
    commonQuestions: [
      'Network Delay Time',
      'Path with Minimum Effort',
      'Cheapest Flights Within K Stops',
      'Swim in Rising Water (Dijkstra on grid)',
    ],
    followUps: ['Negative edges?', 'Reconstruct path?', 'Why greedy works?'],
    misconceptions: ['Dijkstra works with negatives', 'BFS enough for weighted'],
    traps: ['INF + weight overflow', 'K stops needs state dimension not plain dist[]'],
    strongSignals: ['Explains non-negative requirement proof sketch', 'Mentions 0-1 BFS alternative'],
  },
  keyTakeaways: [
    'Non-negative weights required.',
    'Min-heap always expand smallest dist node.',
    'Stale skip: if d > dist[u] continue after poll.',
    'O((V+E) log V) with PriorityQueue.',
    'BFS for unweighted; Bellman-Ford for negatives.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'When use Dijkstra vs BFS?',
      answerHint: 'BFS unweighted unit edges; Dijkstra non-negative weights.',
    },
    {
      level: 'intermediate',
      question: 'Why skip stale PQ entries?',
      answerHint: 'Java PQ lacks decrease-key; older larger dist pairs remain; ignore if d > dist[u].',
    },
    {
      level: 'advanced',
      question: 'Why Dijkstra fails on negative edges?',
      answerHint: 'Settled node assumed final; negative edge from settled node could improve unreached node—greedy invalid.',
    },
  ],
  flashcards: [
    {
      front: 'Dijkstra weight constraint',
      back: 'All edge weights must be non-negative.',
    },
    {
      front: 'Dijkstra time with binary heap',
      back: 'O((V + E) log V).',
    },
  ],
  quickRevision: [
    'Non-negative weights only',
    'Min PQ (dist, node)',
    'Stale: d > dist[u] continue',
    'Relax: dist[u]+w < dist[v]',
    'O((V+E) log V)',
    'INF overflow guard',
    'Unweighted → BFS; negative → Bellman-Ford',
  ],
}
