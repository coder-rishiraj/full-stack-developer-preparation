import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Breadth-first search (BFS) explores a graph layer by layer using a queue—visiting all nodes at distance d before distance d+1. On unweighted graphs it yields shortest path in edge count.',
  whyExists:
    'DFS dives deep and may find a long path first. BFS guarantees minimum hops in unweighted graphs and natural level-order processing for grids and social networks “degrees of separation.”',
  mentalModel:
    'Ripples in water from a stone: the queue holds the current wavefront. Dequeue a node, enqueue unseen neighbors—each dequeue increments distance when you process level-by-level.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Mark start visited; enqueue start with distance 0.',
        'While queue not empty: dequeue u; for each neighbor v, if unvisited mark and enqueue.',
        'For shortest path: stop when target dequeued or record dist[v]=dist[u]+1 on enqueue.',
        'Grid BFS: 4/8 directions; treat cells as nodes; walls blocked.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Level-size loop',
      text: 'Process queue size snapshots for “minimum moves”, “shortest path length”, or level-by-level answers without extra distance array.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Q[Queue] --> Deq[Dequeue u]
  Deq --> Nbrs[For each neighbor v]
  Nbrs --> Vis{visited?}
  Vis -->|no| Enq[Mark + enqueue v]
  Vis -->|yes| Skip[Skip]
  Enq --> Q`,
    caption: 'BFS wavefront expansion',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Grid shortest path from (0,0) to (2,2) in 3×3 open grid: BFS expands rings—distance 0, then 1, then 2—first time target dequeued gives length 4 steps (or 2 if diagonal disallowed uses 4 edges).',
    },
    {
      type: 'table',
      headers: ['structure', 'frontier', 'shortest path'],
      rows: [
        ['queue', 'FIFO', 'yes on unweighted'],
        ['DFS stack', 'LIFO', 'no guarantee'],
        ['priority queue', 'Dijkstra', 'weighted non-negative'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Graph BFS (adjacency list)',
      code: `int[] dist = new int[n];
Arrays.fill(dist, -1);
Deque<Integer> q = new ArrayDeque<>();
dist[start] = 0;
q.offer(start);
while (!q.isEmpty()) {
    int u = q.poll();
    for (int v : adj.get(u)) {
        if (dist[v] == -1) {
            dist[v] = dist[u] + 1;
            q.offer(v);
        }
    }
}`,
    },
    {
      language: 'java',
      caption: 'Grid BFS',
      code: `int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
Deque<int[]> q = new ArrayDeque<>();
q.offer(new int[]{sr, sc});
vis[sr][sc] = true;
while (!q.isEmpty()) {
    int[] cell = q.poll();
    for (int[] d : dirs) {
        int nr = cell[0] + d[0], nc = cell[1] + d[1];
        if (inBounds(nr,nc) && !vis[nr][nc] && grid[nr][nc] != '#') {
            vis[nr][nc] = true;
            q.offer(new int[]{nr, nc});
        }
    }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Word Ladder (shortest transformation sequence)',
      code: `public int ladderLength(String begin, String end, List<String> wordList) {
    Set<String> dict = new HashSet<>(wordList);
    if (!dict.contains(end)) return 0;
    Deque<String> q = new ArrayDeque<>();
    q.offer(begin);
    Set<String> seen = new HashSet<>();
    seen.add(begin);
    int steps = 1;
    while (!q.isEmpty()) {
        int sz = q.size();
        for (int i = 0; i < sz; i++) {
            char[] w = q.poll().toCharArray();
            for (int j = 0; j < w.length; j++) {
                char old = w[j];
                for (char c = 'a'; c <= 'z'; c++) {
                    w[j] = c;
                    String next = new String(w);
                    if (next.equals(end)) return steps + 1;
                    if (dict.contains(next) && seen.add(next)) q.offer(next);
                }
                w[j] = old;
            }
        }
        steps++;
    }
    return 0;
}`,
    },
  ],
  complexity: {
    best: 'O(V+E) each vertex/edge once',
    average: 'O(V+E) for adjacency list',
    worst: 'O(V×E) dense implicit graphs if neighbor scan costly',
    space: 'O(V) queue + visited',
  },
  patternRecognition: [
    'Shortest path in unweighted graph or grid.',
    'Minimum steps / minimum swaps to target.',
    'Level-order on implicit graphs (word ladder, lock puzzle).',
    'Multi-source BFS: enqueue all sources at distance 0.',
    '0-1 BFS with deque for weights 0/1 edges.',
  ],
  commonMistakes: [
    'Not marking visited on enqueue (duplicate queue entries, TLE).',
    'Using BFS for weighted graphs without 0-1 or Dijkstra.',
    'Forgetting to check bounds / blocked cells in grids.',
    'Distance updated on dequeue vs enqueue inconsistently.',
  ],
  variations: [
    'Bidirectional BFS from start and goal',
    'Multi-source BFS (rotting oranges)',
    'BFS on state space (x,y,keys bitmask)',
    '0-1 BFS with deque front/back push',
  ],
  tradeoffs: {
    advantages: [
      'Shortest hop count on unweighted graphs',
      'Simple queue logic',
      'Natural level processing',
    ],
    disadvantages: [
      'O(V) memory for visited',
      'Not for general weighted shortest path',
    ],
    alternatives: ['DFS when any path suffices', 'Dijkstra weighted', 'A* with heuristic'],
    whenToUse: ['Unweighted shortest path', 'Minimum steps', 'Layer expansion'],
    whenNotToUse: ['Negative edges', 'Only connectivity without distance'],
  },
  failureModes: [
    'Queue explosion if visited late on high branching factor.',
    'State-space BFS without pruning bitmask too large.',
  ],
  interview: {
    expectations: [
      'Visited on enqueue',
      'State O(V+E) complexity',
      'Grid vs graph adjacency representation',
    ],
    commonQuestions: [
      'Number of Islands (can use BFS)',
      'Word Ladder',
      'Rotting Oranges',
      'Shortest Path in Binary Matrix',
    ],
    followUps: ['Bidirectional BFS benefit?', 'Reconstruct path with parent map?'],
    misconceptions: ['BFS always faster than DFS'],
    traps: ['Word ladder: mark seen when generating neighbor', 'Diagonal moves in grid'],
    strongSignals: ['Level-size loop for step count', 'Multi-source initialization explained'],
  },
  keyTakeaways: [
    'Queue FIFO = expand by increasing distance.',
    'Mark visited on enqueue to avoid duplicates.',
    'O(V+E) on explicit graphs.',
    'Unweighted shortest path ⇒ BFS not DFS.',
    'Multi-source: seed all sources at dist 0.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why BFS for unweighted shortest path?',
      answerHint: 'First time node dequeued is minimum edge count; layers increase uniformly.',
    },
    {
      level: 'intermediate',
      question: 'When mark visited in BFS?',
      answerHint: 'On enqueue (or when generating neighbor), not on dequeue.',
    },
    {
      level: 'advanced',
      question: 'Bidirectional BFS when helpful?',
      answerHint: 'Sparse graphs with known goal; search meets in middle cuts branching.',
    },
  ],
  flashcards: [
    {
      front: 'BFS shortest path condition',
      back: 'Unweighted graph; first dequeue of target is optimal.',
    },
    {
      front: 'BFS time on adjacency list',
      back: 'O(V + E).',
    },
  ],
  quickRevision: [
    'Queue + visited on enqueue',
    'Unweighted shortest path → BFS',
    'O(V+E) time O(V) space',
    'Grid: dirs + bounds check',
    'Level-size loop for steps',
    'Multi-source seed queue together',
    'Weighted → Dijkstra not plain BFS',
  ],
}
