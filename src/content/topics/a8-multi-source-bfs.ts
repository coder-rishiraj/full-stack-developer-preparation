import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Multi-source BFS seeds the queue with all source nodes at distance 0 simultaneously, then runs standard BFS—computing shortest distances from the nearest source to every node. Equivalent to a virtual super-source connected to all sources with zero-weight edges.',
  whyExists:
    'Problems like rotting oranges, walls and gates, and nearest exit from multiple fires need min distance to any of several starts. Running BFS from each source separately is O(k·(V+E)); one multi-source pass is O(V+E) with the same correctness on unweighted graphs.',
  mentalModel:
    'All sources start spreading rot/smoke/fire at time 0 in parallel. The queue holds the current wavefront from every active frontier merged—first time a cell is reached, that’s its minimum steps from the closest source.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Initialize dist[] = ∞ (or -1); enqueue all sources with dist=0; mark visited on enqueue.',
        'Standard BFS: dequeue u, for each neighbor v if unvisited set dist[v]=dist[u]+1, enqueue.',
        'Grid: enqueue all cells matching source condition (0, gate, rotten orange).',
        'Track max dist for “minutes to rot all” or fill -1 where unreachable.',
        'Virtual super-source: add node S with edges S→each source weight 0—same result.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Visited on enqueue',
      text: 'Mark cells visited when adding to queue, not on dequeue—prevents duplicate entries and TLE on large grids.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Sources[All sources dist=0] --> Q[Single BFS queue]
  Q --> Wave[Expand layer by layer]
  Wave --> Min[First hit = nearest source dist]
  Min --> Q`,
    caption: 'Multi-source wavefront merge',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Grid gates (INF) and rooms: enqueue all gates at dist 0. BFS fills rooms with dist+1 from nearest gate. Room equidistant from two gates gets first dequeued path length—BFS guarantees minimum.',
    },
    {
      type: 'table',
      headers: ['problem', 'sources', 'answer'],
      rows: [
        ['Rotting Oranges', 'all rotten cells', 'max dist or -1 if fresh left'],
        ['Walls and Gates', 'all gates', 'dist to nearest gate per cell'],
        ['01 Matrix', 'all 0 cells', 'Manhattan dist to nearest 0'],
        ['Nearest exit', 'border empty cells', 'steps to exit'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Multi-source BFS grid template',
      code: `int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
Deque<int[]> q = new ArrayDeque<>();
int[][] dist = new int[m][n];
for (int r = 0; r < m; r++)
    for (int c = 0; c < n; c++)
        if (isSource(grid[r][c])) {
            dist[r][c] = 0;
            q.offer(new int[]{r, c});
        }
while (!q.isEmpty()) {
    int[] cur = q.poll();
    for (int[] d : dirs) {
        int nr = cur[0] + d[0], nc = cur[1] + d[1];
        if (inBounds(nr, nc) && dist[nr][nc] == UNVISITED) {
            dist[nr][nc] = dist[cur[0]][cur[1]] + 1;
            q.offer(new int[]{nr, nc});
        }
    }
}`,
    },
    {
      language: 'java',
      caption: 'Graph multi-source BFS',
      code: `int[] dist = new int[n];
Arrays.fill(dist, -1);
Deque<Integer> q = new ArrayDeque<>();
for (int s : sources) { dist[s] = 0; q.offer(s); }
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
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Rotting Oranges',
      code: `public int orangesRotting(int[][] grid) {
    int m = grid.length, n = grid[0].length, fresh = 0, steps = 0;
    Deque<int[]> q = new ArrayDeque<>();
    for (int r = 0; r < m; r++)
        for (int c = 0; c < n; c++) {
            if (grid[r][c] == 2) q.offer(new int[]{r, c});
            else if (grid[r][c] == 1) fresh++;
        }
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    while (!q.isEmpty() && fresh > 0) {
        int sz = q.size();
        for (int i = 0; i < sz; i++) {
            int[] cur = q.poll();
            for (int[] d : dirs) {
                int nr = cur[0] + d[0], nc = cur[1] + d[1];
                if (nr >= 0 && nc >= 0 && nr < m && nc < n && grid[nr][nc] == 1) {
                    grid[nr][nc] = 2;
                    fresh--;
                    q.offer(new int[]{nr, nc});
                }
            }
        }
        steps++;
    }
    return fresh == 0 ? steps : -1;
}`,
    },
  ],
  complexity: {
    best: 'O(V+E) or O(m·n) single grid pass',
    average: 'O(V+E) each cell/edge once',
    worst: 'O(V+E) same as single-source BFS',
    space: 'O(V) queue + dist array',
  },
  patternRecognition: [
    'Multiple starting points, min steps to nearest.',
    '“Spread from all X simultaneously” on grid.',
    'Fill distance field from obstacles/boundaries.',
    'Level-size loop for discrete time steps (oranges).',
    '01 BFS variant when edge weights 0/1—not plain multi-source but related.',
  ],
  commonMistakes: [
    'Running BFS k times from each source—TLE.',
    'Not marking visited on enqueue in grid.',
    'Level counter off-by-one in rotting oranges (empty queue initial).',
    'Using multi-source BFS on weighted graphs without 0-1 or Dijkstra.',
    'Forgetting to count remaining unreachable targets (fresh oranges).',
  ],
  variations: [
    'Multi-source Dijkstra with super-source (weighted)',
    'Bidirectional multi-target BFS',
    'Fire spread with different speeds per source (weighted)',
    'Multi-source on implicit state graph',
  ],
  tradeoffs: {
    advantages: [
      'O(V+E) vs k separate BFS runs',
      'Same code as BFS with richer initialization',
      'Natural for grid simulation problems',
    ],
    disadvantages: [
      'Only unweighted (or 0-1 with deque) shortest path',
      'All sources same “cost to start”—not weighted sources',
    ],
    alternatives: ['k BFS if k=1', 'Dijkstra from super-source if weighted', 'Floyd only tiny graphs'],
    whenToUse: ['Nearest gate/0/rotten', 'Min steps from any of several starts'],
    whenNotToUse: ['Edge weights vary', 'Single source only—plain BFS simpler'],
  },
  failureModes: [
    'Queue duplicates if visited on dequeue only.',
    'Modify grid in place without restoring if needed.',
    'INF sentinel confusion—use -1 or Integer.MAX_VALUE consistently.',
  ],
  interview: {
    expectations: [
      'Enqueue all sources before BFS loop',
      'O(m·n) or O(V+E) complexity',
      'Visited on enqueue',
    ],
    commonQuestions: [
      'Rotting Oranges',
      'Walls and Gates',
      '01 Matrix',
      'Shortest Distance from All Buildings (weighted—Dijkstra per building or multi-source trick)',
    ],
    followUps: ['Why not BFS from each orange?', 'Weighted version?'],
    misconceptions: ['Need separate BFS per source', 'Multi-source changes BFS correctness'],
    traps: ['Steps count when queue empty initially', 'Buildings problem needs weighted multi-source Dijkstra'],
    strongSignals: ['Mentions virtual super-source', 'Level-size for time ticks'],
  },
  keyTakeaways: [
    'Seed queue with all sources at dist 0.',
    'Then standard BFS—O(V+E) total.',
    'First visit = shortest from nearest source.',
    'Grid: mark on enqueue; dirs + bounds.',
    'Weighted → Dijkstra from super-source, not plain BFS.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is multi-source BFS?',
      answerHint: 'Enqueue all sources at distance 0; BFS fills min distance to nearest source for all nodes.',
    },
    {
      level: 'intermediate',
      question: 'Why better than BFS from each source?',
      answerHint: 'Single O(V+E) pass vs k·O(V+E); wavefronts merge correctly by BFS layer order.',
    },
    {
      level: 'advanced',
      question: 'Multi-source on weighted graph?',
      answerHint: 'Add virtual source with zero-weight edges to all sources; run Dijkstra (non-negative weights).',
    },
  ],
  flashcards: [
    {
      front: 'Multi-source BFS init',
      back: 'Enqueue all sources with dist=0; visited on enqueue.',
    },
    {
      front: 'Multi-source BFS time',
      back: 'O(V+E) same as single-source BFS.',
    },
  ],
  quickRevision: [
    'All sources in queue dist=0',
    'Then normal BFS',
    'O(V+E) not k times BFS',
    'Visited on enqueue',
    'Grid rotting: level-size = minutes',
    'Virtual super-source equivalent',
    'Weighted → Dijkstra super-source',
  ],
}
