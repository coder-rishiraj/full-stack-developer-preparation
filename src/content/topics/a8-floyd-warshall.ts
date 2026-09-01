import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Floyd-Warshall computes all-pairs shortest paths in O(V³) by dynamic programming: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]) for each intermediate k. Handles negative edges; negative cycle if any dist[i][i] < 0 after completion.',
  whyExists:
    'Running Bellman-Ford or Dijkstra from every vertex costs O(V²E) or O(V E log V). For dense graphs or small V (≤400 in contests), Floyd-Warshall’s cubic DP with simple triple loop is easier to code and sufficient.',
  mentalModel:
    'Allow paths to use intermediate nodes 1..k only: for each k, try routing every pair (i,j) through k as a shortcut. After k=V, all paths considered.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Initialize dist[i][j] = edge weight or ∞; dist[i][i]=0.',
        'For k from 0 to V-1: for all i,j: dist[i][j] = min(dist[i][j], dist[i][k]+dist[k][j]).',
        'k outermost loop critical—allows building paths through 0..k.',
        'Negative cycle: any dist[i][i] < 0 after algorithm.',
        'Path reconstruction: next[i][j] matrix or parent on relax.',
        'Transitive closure variant: reach[i][j] boolean OR instead of min sum.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'k must be outermost loop',
      text: 'Putting k inner breaks DP invariant—paths may use same intermediate node multiple times incorrectly.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: '3 nodes: edges 0→1=3, 1→2=1, 0→2=8. After k=1: dist[0][2]=min(8, 3+1)=4. All pairs known in one V³ pass.',
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Floyd-Warshall all-pairs shortest path',
      code: `long[][] floydWarshall(int n, long[][] dist) {
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (dist[i][k] != Long.MAX_VALUE && dist[k][j] != Long.MAX_VALUE)
                    dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
    for (int i = 0; i < n; i++)
        if (dist[i][i] < 0) throw new IllegalStateException("negative cycle");
    return dist;
}`,
    },
    {
      language: 'java',
      caption: 'Build initial dist from edge list',
      code: `long[][] initDist(int n, int[][] edges) {
    long[][] dist = new long[n][n];
    for (long[] row : dist) Arrays.fill(row, Long.MAX_VALUE);
    for (int i = 0; i < n; i++) dist[i][i] = 0;
    for (int[] e : edges) dist[e[0]][e[1]] = e[2];
    return dist;
}`,
    },
  ],
  complexity: {
    best: 'O(V³) always—same triple loop',
    average: 'O(V³)',
    worst: 'O(V³)',
    space: 'O(V²) dist matrix',
  },
  patternRecognition: [
    'Find the City With the Smallest Number of Neighbors at Threshold Distance.',
    'Count paths with given length small V.',
    'Detect negative cycle in all-pairs context.',
    'V ≤ 400 constraint in problem statement.',
  ],
  commonMistakes: [
    'k loop not outermost.',
    'INF + weight overflow without guards.',
    'Using int when paths exceed 2³¹.',
    'Forgetting dist[i][i]=0 initialization.',
  ],
  tradeoffs: {
    advantages: [
      'Simple triple loop, easy to implement',
      'All-pairs in one shot',
      'Handles negative edges (not negative cycles)',
      'Transitive closure variant trivial',
    ],
    disadvantages: [
      'O(V³) too slow for V > ~500',
      'O(V²) memory',
      'Slower than V×Dijkstra on sparse large graphs',
    ],
    alternatives: ['V × Dijkstra for sparse large V', 'V × Bellman-Ford if negatives sparse', 'Johnson reweighting'],
    whenToUse: ['Small V (≤400)', 'Dense graph all-pairs', 'Need dist matrix for further DP'],
    whenNotToUse: ['Large sparse graph', 'Single-source only', 'V thousands+'],
  },
  failureModes: [
    'Negative cycle: dist[i][i]<0—shortest paths undefined.',
    'Overflow on dist[i][k]+dist[k][j] with long paths.',
    'Wrong k loop order produces incorrect distances.',
  ],
  interview: {
    expectations: [
      'Triple loop k,i,j with k outer',
      'O(V³) time O(V²) space',
      'Negative cycle on diagonal',
    ],
    commonQuestions: ['When Floyd vs Dijkstra?', 'Detect negative cycle?', 'Transitive closure?'],
    followUps: ['Reconstruct path?', 'Johnson algorithm?', 'Why k outermost?'],
    misconceptions: ['Works for large V in production', 'Same as running Dijkstra once', 'Cannot handle any negative edges'],
    traps: ['k not outermost', 'Integer overflow on dist sums'],
    strongSignals: ['Explains DP state paths through {0..k}', 'Checks dist[i][i]<0', 'Knows V≤400 rule of thumb'],
  },
  keyTakeaways: [
    'dist[i][j] = min through intermediate k; k outer loop.',
    'O(V³) time, O(V²) space.',
    'dist[i][i] < 0 → negative cycle.',
    'Guard INF before addition.',
    'Use when V small or need full matrix.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Floyd-Warshall time complexity?', answerHint: 'O(V³) three nested loops over k, i, j.' },
    { level: 'intermediate', question: 'Why k must be outermost loop?', answerHint: 'DP builds paths using intermediates {0..k}; inner k breaks optimal substructure.' },
    { level: 'advanced', question: 'Negative cycle detection?', answerHint: 'After completion, any dist[i][i] < 0 indicates negative-weight cycle involving i.' },
  ],
  flashcards: [
    { front: 'Floyd-Warshall recurrence', back: 'dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]); k outer.' },
    { front: 'Time complexity', back: 'O(V³).' },
    { front: 'Negative cycle check', back: 'dist[i][i] < 0 for any i after algorithm.' },
  ],
  quickRevision: [
    'k outer, i, j inner',
    'O(V³) all-pairs',
    'dist[i][i]=0 init',
    'INF guard on add',
    'diag < 0 = neg cycle',
    'V ≤ ~400 practical',
    'Transitive closure OR variant',
  ],
}
