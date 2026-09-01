import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Topological sorting orders vertices in a directed acyclic graph (DAG) so every edge u→v has u before v—computed via Kahn’s algorithm (BFS on in-degree) or DFS postorder reversal.',
  whyExists:
    'Dependencies (courses, build tasks, package installs) require a linear order respecting all prerequisites. Topological sort detects cycles (no valid order) and enables DP on DAGs for longest path, scheduling, and reachability.',
  mentalModel:
    'Tasks with prerequisites: start with tasks that need nothing (in-degree 0). Complete them, which frees dependents—like peeling layers off a dependency onion. If tasks remain with no zero in-degree, a cycle blocks progress.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Build adjacency list and in-degree count per node.',
        'Kahn: enqueue all in-degree 0 nodes; dequeue u, append to order, decrement in-degree of neighbors; enqueue new zeros.',
        'If order size < V, cycle exists.',
        'DFS: mark visiting/visited; on finish add to stack; reverse postorder = topological sort.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Kahn vs DFS',
      text: 'Kahn gives lexicographic control with priority queue and explicit cycle check via count. DFS compact but recursion needs cycle detection (gray/black nodes).',
    },
  ],
  architecture: {
    mermaid: `flowchart TD
  Z[in-degree 0 nodes] --> Q[Queue]
  Q --> U[Pop u add to order]
  U --> Dec[Decrease in-degree of neighbors]
  Dec --> New{in-degree 0?}
  New -->|yes| Q
  New -->|no| More{More nodes?}
  More -->|order size < V| Cycle[Cycle detected]`,
    caption: "Kahn's algorithm",
  },
  example: [
    {
      type: 'paragraph',
      text: 'Courses 0→1, 0→2, 1→3, 2→3: in-degrees [0,1,1,2]. Queue [0]; process 0 → queue [1,2]; process 1 → queue [2,3]; process 2 → queue [3]; order [0,1,2,3] or [0,2,1,3].',
    },
    {
      type: 'table',
      headers: ['node', 'in-degree after 0 done', 'next ready'],
      rows: [
        ['0', '—', '1,2'],
        ['1', '0', '3 after 1 done'],
        ['2', '0', '3 after 2 done'],
        ['3', '0 when 1&2 done', 'done'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: "Kahn's algorithm",
      code: `int[] indeg = new int[n];
List<List<Integer>> adj = buildAdj(edges);
Deque<Integer> q = new ArrayDeque<>();
for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);
List<Integer> order = new ArrayList<>();
while (!q.isEmpty()) {
    int u = q.poll();
    order.add(u);
    for (int v : adj.get(u)) {
        if (--indeg[v] == 0) q.offer(v);
    }
}
return order.size() == n ? order : emptyCycle();`,
    },
    {
      language: 'java',
      caption: 'DFS topological sort + cycle',
      code: `enum { WHITE, GRAY, BLACK }
boolean dfs(int u, List<List<Integer>> adj, int[] color, Deque<Integer> st) {
    color[u] = GRAY;
    for (int v : adj.get(u)) {
        if (color[v] == GRAY) return false;
        if (color[v] == WHITE && !dfs(v, adj, color, st)) return false;
    }
    color[u] = BLACK;
    st.push(u);
    return true;
}
// reverse st for order`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Course Schedule (can finish?)',
      code: `public boolean canFinish(int numCourses, int[][] prerequisites) {
    List<List<Integer>> adj = new ArrayList<>();
    int[] indeg = new int[numCourses];
    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
    for (int[] p : prerequisites) {
        adj.get(p[1]).add(p[0]);
        indeg[p[0]]++;
    }
    Deque<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < numCourses; i++) if (indeg[i] == 0) q.offer(i);
    int seen = 0;
    while (!q.isEmpty()) {
        int u = q.poll();
        seen++;
        for (int v : adj.get(u)) if (--indeg[v] == 0) q.offer(v);
    }
    return seen == numCourses;
}`,
    },
  ],
  complexity: {
    best: 'O(V+E) linear in graph size',
    average: 'O(V+E)',
    worst: 'O(V+E) time; O(V) queue/stack',
    space: 'O(V+E) adjacency + in-degree',
  },
  patternRecognition: [
    'Prerequisites, task scheduling, dependency resolution.',
    '“Can finish all?” → cycle detection via topo count.',
    'Longest path in DAG: DP in topological order.',
    'Alien dictionary (derive order from pairwise words).',
    'Minimum height trees / reorder with indegree leaves (variants).',
  ],
  commonMistakes: [
    'Building edges reversed (prerequisite direction wrong).',
    'Forgetting cycle check: order.size() != n.',
    'Using topo sort on undirected or cyclic graphs without detection.',
    'DFS cycle: only black/white, missing gray back-edge detection.',
  ],
  variations: [
    'Lexicographically smallest topo order (priority queue)',
    'All topological orders (backtracking, exponential)',
    'Topo on implicit graph (Course Schedule III with time)',
    'Parallel topo levels for critical path length',
  ],
  tradeoffs: {
    advantages: [
      'O(V+E) dependency ordering',
      'Explicit cycle detection with Kahn',
      'Enables DAG DP',
    ],
    disadvantages: [
      'Only defined for DAGs',
      'Not unique order—many valid sorts',
    ],
    alternatives: ['Strongly connected components for general digraphs', 'Union-find if undirected connectivity only'],
    whenToUse: ['Prerequisites', 'DAG processing order', 'Cycle check in directed graph'],
    whenNotToUse: ['Undirected cycle detection alone', 'Weighted shortest path without DAG structure'],
  },
  failureModes: [
    'Off-by-one on node numbering 0..n-1 vs 1..n.',
    'Alien dictionary: invalid constraints from inconsistent word pairs.',
  ],
  interview: {
    expectations: [
      'Draw Kahn or DFS with cycle case',
      'O(V+E) complexity',
      'Correct edge direction for prerequisites',
    ],
    commonQuestions: [
      'Course Schedule I & II',
      'Alien Dictionary',
      'Sequence Reconstruction (variant)',
      'Longest Increasing Path in Matrix (DAG view)',
    ],
    followUps: ['Return one valid order', 'Lex smallest order?'],
    misconceptions: ['Topological sort works on any graph'],
    traps: ['prerequisites[i]=[a,b] means b before a—edge b→a', 'Alien dictionary invalid input'],
    strongSignals: ['Compares processed count to n for cycle', 'Mentions DAG DP after topo'],
  },
  keyTakeaways: [
    'DAG only; cycle ⇒ no topological order.',
    "Kahn: in-degree 0 queue, decrement neighbors.",
    'Processed count < V ⇒ cycle.',
    'DFS: gray node back-edge ⇒ cycle.',
    'O(V+E) time for both standard algorithms.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is a topological ordering?',
      answerHint: 'Linear order where every directed edge u→v has u before v.',
    },
    {
      level: 'intermediate',
      question: "How does Kahn's algorithm detect a cycle?",
      answerHint: 'If fewer than V nodes emitted, some nodes never reach in-degree 0.',
    },
    {
      level: 'advanced',
      question: 'Longest path in DAG approach?',
      answerHint: 'Topo order; dist[v]=max(dist[u]+w) for edges u→v; init -inf, sources 0.',
    },
  ],
  flashcards: [
    {
      front: 'Kahn cycle condition',
      back: 'order.size() < n after processing queue.',
    },
    {
      front: 'DFS topo cycle detection',
      back: 'Gray neighbor on recursion stack = back edge = cycle.',
    },
  ],
  quickRevision: [
    'Prerequisites → topo sort on DAG',
    'Kahn: in-degree 0 queue',
    'Decrement indeg on edge relax',
    'Count processed vs n for cycle',
    'DFS gray = on stack cycle',
    'O(V+E) both methods',
    'Edge direction: prereq → course',
  ],
}
