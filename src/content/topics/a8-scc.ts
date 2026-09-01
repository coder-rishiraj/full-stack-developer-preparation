import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Strongly connected components (SCCs) partition a directed graph into maximal subsets where every vertex reaches every other. Kosaraju uses two DFS passes (transpose graph); Tarjan uses one DFS with low-link values and stack—both O(V+E).',
  whyExists:
    'Directed graphs model dependencies, web links, state machines. SCCs collapse cycles into components for topological order on condensation graph, 2-SAT, and reachability analysis.',
  mentalModel:
    'Kosaraju: finish-order DFS pinpoints sources in reverse graph—second DFS on reversed finish order finds each SCC. Tarjan: DFS stack; when low[v]==disc[v], pop stack equals one SCC.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Kosaraju step 1: DFS original, push nodes to order stack on finish.',
        'Step 2: DFS reverse graph in pop order—each DFS tree is one SCC.',
        'Tarjan: disc[v], low[v]; push v on stack; for neighbors update low; if low[v]==disc[v], pop until v → SCC.',
        'Condensation graph: shrink each SCC to super-node; DAG of components.',
        '2-SAT: implication graph SCC—assign vars if xi and ¬xi in different SCCs and order by reverse topological sort.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Graph 0→1→2→0 (cycle) and 2→3: SCCs {0,1,2} and {3}. Reverse DFS from finish order 3,2,1,0 finds them.',
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Kosaraju SCC',
      code: `List<List<Integer>> kosaraju(int n, List<List<Integer>> adj) {
    Deque<Integer> order = new ArrayDeque<>();
    boolean[] seen = new boolean[n];
    for (int i = 0; i < n; i++)
        if (!seen[i]) dfs1(i, adj, seen, order);
    List<List<Integer>> rev = reverseGraph(n, adj);
    Arrays.fill(seen, false);
    List<List<Integer>> sccs = new ArrayList<>();
    while (!order.isEmpty()) {
        int v = order.pop();
        if (!seen[v]) {
            List<Integer> comp = new ArrayList<>();
            dfs2(v, rev, seen, comp);
            sccs.add(comp);
        }
    }
    return sccs;
}
void dfs1(int u, List<List<Integer>> adj, boolean[] seen, Deque<Integer> order) {
    seen[u] = true;
    for (int v : adj.get(u)) if (!seen[v]) dfs1(v, adj, seen, order);
    order.push(u);
}`,
    },
    {
      language: 'java',
      caption: 'Tarjan SCC (low-link)',
      code: `List<List<Integer>> tarjan(int n, List<List<Integer>> adj) {
    int[] disc = new int[n], low = new int[n], time = {0};
    Arrays.fill(disc, -1);
    Deque<Integer> stack = new ArrayDeque<>();
    boolean[] onStack = new boolean[n];
    List<List<Integer>> sccs = new ArrayList<>();
    for (int i = 0; i < n; i++)
        if (disc[i] == -1) tarjanDfs(i, adj, disc, low, time, stack, onStack, sccs);
    return sccs;
}
void tarjanDfs(int u, List<List<Integer>> adj, int[] disc, int[] low, int[] time,
               Deque<Integer> stack, boolean[] onStack, List<List<Integer>> sccs) {
    disc[u] = low[u] = time[0]++;
    stack.push(u); onStack[u] = true;
    for (int v : adj.get(u)) {
        if (disc[v] == -1) {
            tarjanDfs(v, adj, disc, low, time, stack, onStack, sccs);
            low[u] = Math.min(low[u], low[v]);
        } else if (onStack[v]) {
            low[u] = Math.min(low[u], disc[v]);
        }
    }
    if (low[u] == disc[u]) {
        List<Integer> comp = new ArrayList<>();
        while (true) {
            int x = stack.pop(); onStack[x] = false;
            comp.add(x);
            if (x == u) break;
        }
        sccs.add(comp);
    }
}`,
    },
  ],
  complexity: {
    average: 'O(V + E) Kosaraju or Tarjan',
    space: 'O(V) stack + recursion + reverse graph O(V+E)',
  },
  patternRecognition: [
    'Critical Connections / bridges different (undirected).',
    '2-SAT satisfiability via SCC.',
    'Course schedule IV on condensation DAG.',
    'Count SCCs, largest SCC size.',
  ],
  commonMistakes: [
    'Using Kosaraju on undirected graph without adapting.',
    'Tarjan: update low with disc[v] only if onStack[v].',
    'Second Kosaraju pass wrong order (must pop finish stack).',
    'Confusing SCC with weakly connected components.',
  ],
  tradeoffs: {
    advantages: [
      'O(V+E) linear',
      'Kosaraju two simple DFS passes',
      'Tarjan one pass, no reverse graph build',
    ],
    disadvantages: [
      'Tarjan harder to implement correctly',
      'Kosaraju needs reverse adjacency extra space',
      'Recursive DFS stack depth on large V',
    ],
    alternatives: ['Gabow algorithm', 'Path-based strong components'],
    whenToUse: ['Directed cycle structure', '2-SAT', 'Condensation DAG'],
    whenNotToUse: ['Undirected connected components (union-find/BFS)', 'Single path reachability only'],
  },
  failureModes: [
    'Tarjan forgetting onStack check → wrong low link.',
    'Kosaraju DFS order not finish time.',
    'Stack overflow on deep graphs—use iterative DFS.',
  ],
  interview: {
    expectations: [
      'Know Kosaraju or Tarjan at O(V+E)',
      'Directed graph only',
      'Condensation to DAG intuition',
    ],
    commonQuestions: ['Find all SCCs', '2-SAT via SCC', 'Kosaraju vs Tarjan?'],
    followUps: ['Build condensation graph?', '2-SAT assignment rule?', 'Why reverse graph in Kosaraju?'],
    misconceptions: ['BFS finds SCCs', 'Same as undirected components', 'Need to sort vertices first'],
    traps: ['Tarjan low update from finished off-stack node', 'Kosaraju pass order reversed'],
    strongSignals: ['Explains finish-time / root of SCC', 'States O(V+E)', 'Mentions 2-SAT application'],
  },
  keyTakeaways: [
    'SCC: mutual reachability in directed graph.',
    'Kosaraju: DFS order + DFS on reverse graph.',
    'Tarjan: low-link, pop stack when low==disc.',
    'O(V+E) both algorithms.',
    'Condensation DAG for topo on components.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is an SCC?', answerHint: 'Maximal set where every vertex can reach every other along directed paths.' },
    { level: 'intermediate', question: 'Kosaraju two passes?', answerHint: 'DFS finish order on G; DFS on reverse graph in reverse finish order—each tree one SCC.' },
    { level: 'advanced', question: 'Tarjan low-link meaning?', answerHint: 'Earliest disc reachable from u via tree edges and back edges to nodes on stack; low[u]==disc[u] means u is SCC root.' },
  ],
  flashcards: [
    { front: 'Kosaraju passes', back: 'DFS finish stack on G; DFS on G^T in pop order.' },
    { front: 'Tarjan SCC root condition', back: 'low[v] == disc[v] → pop stack until v.' },
    { front: 'SCC complexity', back: 'O(V + E).' },
  ],
  quickRevision: [
    'Directed maximal mutual reach',
    'Kosaraju: order + reverse DFS',
    'Tarjan: low-link + stack',
    'O(V+E)',
    'Condensation → DAG',
    '2-SAT implication graph',
    'onStack for back edges',
  ],
}
