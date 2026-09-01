import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A graph is bipartite if vertices split into two sets with every edge crossing sets—equivalently, 2-colorable with no monochromatic edge, or no odd-length cycle. Detect via BFS/DFS coloring: assign 0/1 alternating; conflict on same-color neighbor means not bipartite.',
  whyExists:
    'Bipartite structure models matching problems, conflict-free scheduling (two groups), and grid chessboard parity. Interviews use bipartite check on graphs and implicit grids (Possible Bipartition, Is Graph Bipartite?).',
  mentalModel:
    'Paint nodes red/black like a chessboard: every edge must connect red to black. If you reach a neighbor already same color, an odd cycle exists—graph fails bipartite.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'color[v] in {-1 unvisited, 0, 1}.',
        'For each unvisited component, BFS/DFS assign root color 0.',
        'On edge u-v: if color[v]==-1 set color[v]=1-color[u]; else if color[v]==color[u] return false.',
        'Disconnected graph: run on all components.',
        'Undirected edge check both directions or iterate adj once with u<v.',
        'Odd cycle detection equivalent to not bipartite (undirected).',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Square 0-1-2-3-0: colors 0→0, 1→1, 2→0, 3→1—bipartite. Triangle 0-1-2-0: 0→0, 1→1, 2→0 but edge 2-0 same color—odd cycle, not bipartite.',
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'BFS 2-coloring bipartite check',
      code: `boolean isBipartite(int[][] graph) {
    int n = graph.length;
    int[] color = new int[n];
    Arrays.fill(color, -1);
    for (int i = 0; i < n; i++) {
        if (color[i] != -1) continue;
        Queue<Integer> q = new ArrayDeque<>();
        q.offer(i); color[i] = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : graph[u]) {
                if (color[v] == -1) {
                    color[v] = color[u] ^ 1;
                    q.offer(v);
                } else if (color[v] == color[u]) {
                    return false;
                }
            }
        }
    }
    return true;
}`,
    },
    {
      language: 'java',
      caption: 'DFS coloring',
      code: `boolean dfs(int u, int c, int[][] g, int[] color) {
    color[u] = c;
    for (int v : g[u]) {
        if (color[v] == -1) {
            if (!dfs(v, c ^ 1, g, color)) return false;
        } else if (color[v] == c) return false;
    }
    return true;
}`,
    },
  ],
  complexity: {
    average: 'O(V + E) BFS/DFS visit all nodes and edges',
    space: 'O(V) color array + queue/stack',
  },
  patternRecognition: [
    'Is Graph Bipartite?',
    'Possible Bipartition (dislike pairs → graph edge).',
    'Grid as bipartite: (i+j)%2 coloring.',
    'Matching problems often on bipartite graphs (Hungarian separate topic).',
  ],
  commonMistakes: [
    'Only check one component in disconnected graph.',
    'Directed graph without clarifying—bipartite usually undirected.',
    'Self-loop or duplicate edges: same color conflict.',
    'Using three colors when two suffice.',
  ],
  tradeoffs: {
    advantages: [
      'O(V+E) simple BFS/DFS',
      'XOR flip 1-color[u] elegant',
      'Extends to partition validation problems',
    ],
    disadvantages: [
      'Only answers yes/no coloring—not max cut',
      'Implicit graph must build adjacency first',
    ],
    alternatives: ['Union-find for Possible Bipartition with conflict groups', 'Bitset for small n brute'],
    whenToUse: ['Two-group partition feasibility', 'Odd cycle detection', 'Grid parity checks'],
    whenNotToUse: ['Need actual maximum matching (Hopcroft-Karp)', 'Directed acyclic scheduling without 2-partition'],
  },
  failureModes: [
    'Isolated node: trivially bipartite (color 0).',
    'Multi-edge same pair: still check color conflict.',
    'Large n recursion DFS stack overflow—prefer BFS.',
  ],
  interview: {
    expectations: [
      '2-color BFS/DFS',
      'Same color neighbor → false',
      'O(V+E)',
    ],
    commonQuestions: ['Is Graph Bipartite?', 'Possible Bipartition', 'Grid bipartite?'],
    followUps: ['Odd cycle equivalent?', 'Build the two sets?', 'Hypergraph 2-color?'],
    misconceptions: ['Any tree not bipartite (trees are bipartite)', 'Need to try all colorings', 'Bipartite implies connected'],
    traps: ['Forget disconnected components', 'Directed edges treated wrong'],
    strongSignals: ['States odd cycle ↔ not bipartite', 'Handles all components', 'Maps dislike pairs to graph'],
  },
  keyTakeaways: [
    '2-color with BFS/DFS; neighbor color = 1 - my color.',
    'Same color on edge → odd cycle → not bipartite.',
    'Check every disconnected component.',
    'O(V+E) time and O(V) space.',
    'Grid (i+j)%2 is natural bipartition.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'How detect bipartite graph?', answerHint: 'BFS/DFS 2-coloring; conflict if adjacent nodes same color.' },
    { level: 'intermediate', question: 'Why odd cycle breaks bipartite?', answerHint: 'Walking odd cycle returns to start requiring flip from same color—contradiction.' },
    { level: 'advanced', question: 'Possible Bipartition reduction?', answerHint: 'Each person node; edge between disliked pair; bipartite iff valid two groups.' },
  ],
  flashcards: [
    { front: 'Bipartite test', back: '2-color BFS/DFS; adjacent must differ.' },
    { front: 'Odd cycle meaning', back: 'Graph is not bipartite.' },
    { front: 'Complexity', back: 'O(V + E).' },
  ],
  quickRevision: [
    'color 0/1 alternate',
    'neighbor color ^ 1',
    'same color edge = fail',
    'all components',
    'odd cycle ↔ not bipartite',
    'O(V+E)',
    'Grid (i+j)%2',
  ],
}
