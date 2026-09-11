import type { Priority } from '@/domain/types'
import type { SectionSeed, TopicSeed } from './build'

const G = ['graphs'] as const
const M34 = [3, 4]
const M45 = [4, 5]
const M56 = [5, 6]
const M67 = [6, 7]
const M78 = [7, 8]

function item(
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  const { tags, executionPriority, months, ...rest } = extra
  return {
    id,
    title,
    priority,
    months:
      months ??
      (priority === 'tier1' ? M34 : priority === 'tier2' ? M45 : M56),
    tags: [...G, ...(tags ?? [])],
    executionPriority:
      executionPriority ??
      (priority === 'tier1' ? 'p0' : priority === 'tier2' ? 'p1' : 'later'),
    ...rest,
  }
}

function nest(
  parent: string,
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  return item(id, title, priority, {
    ...extra,
    curriculumLevel: 'nested-concept',
    parentTopicId: parent,
  })
}

function section(
  id: string,
  title: string,
  order: number,
  topics: TopicSeed[],
): SectionSeed {
  return {
    id,
    track: 'A',
    title,
    order,
    defaultKind: 'dsa-pattern',
    defaultDepth: 'deep',
    topics,
  }
}

/**
 * A8.1–A8.17 — Graph algorithms for interview + CP prep.
 * Shape follows standard graph interview maps (BFS/DFS → cycles/topo →
 * shortest paths → MST/DSU → SCC/bridges/AP → flow) and must-do problem
 * families. Existing a8-* topic IDs remain stable.
 */
export const TRACK_A_GRAPH_SECTIONS: SectionSeed[] = [
  section('A8.1', 'Graph Foundations & Representations', 8, [
    item('a8-graph-representation', 'Graph Representation', 'tier1', {
      tags: ['representation'],
    }),
    nest('a8-graph-representation', 'a8-graph-types', 'Directed, Undirected, Weighted & Unweighted'),
    nest('a8-graph-representation', 'a8-graph-terminology', 'Degree, Path, Cycle & Connectivity Terms'),
    nest(
      'a8-graph-representation',
      'a8-adjacency-list',
      'Adjacency List (Default CP Choice)',
    ),
    nest(
      'a8-graph-representation',
      'a8-adjacency-matrix',
      'Adjacency Matrix',
      'tier2',
    ),
    nest('a8-graph-representation', 'a8-edge-list', 'Edge List', 'tier2'),
    nest(
      'a8-graph-representation',
      'a8-when-to-use-representation',
      'Choosing Matrix vs List vs Edge List',
    ),
    nest(
      'a8-graph-representation',
      'a8-transitive-closure',
      'Transitive Closure',
      'tier2',
      { months: M56 },
    ),
    nest(
      'a8-graph-representation',
      'a8-graph-from-degrees',
      'Graph from Given Degrees of Vertices',
      'tier3',
      { months: M67 },
    ),
  ]),

  section('A8.2', 'BFS & DFS Traversal', 9, [
    item('a8-bfs', 'BFS (Breadth-First Search)', 'tier1', {
      tags: ['bfs'],
      prereqs: ['a8-graph-representation'],
    }),
    nest('a8-bfs', 'a8-dfs', 'DFS (Depth-First Search)', 'tier1', {
      tags: ['dfs'],
      prereqs: ['a8-graph-representation'],
    }),
    nest('a8-bfs', 'a8-bfs-vs-dfs', 'BFS vs DFS — When to Use Which'),
    nest('a8-bfs', 'a8-bfs-shortest-unweighted', 'BFS Shortest Path (Unweighted)'),
    nest('a8-bfs', 'a8-iterative-dfs', 'Iterative DFS with Explicit Stack', 'tier2'),
    nest('a8-bfs', 'a8-clone-graph', 'Clone Graph (BFS / DFS)', 'tier2', {
      tags: ['bfs', 'dfs'],
    }),
    nest('a8-bfs', 'a8-clone-dag', 'Clone a Directed Acyclic Graph', 'tier2', {
      months: M45,
    }),
  ]),

  section('A8.3', 'Grid Graphs & Pattern BFS', 10, [
    item('a8-multi-source-bfs', 'Multi-source BFS', 'tier1', {
      tags: ['bfs', 'grid'],
      prereqs: ['a8-bfs'],
    }),
    nest('a8-multi-source-bfs', 'a8-grid-as-graph', 'Grid as a Graph'),
    nest('a8-multi-source-bfs', 'a8-0-1-bfs', '0-1 BFS (Deque)', 'tier1', {
      tags: ['bfs'],
      months: M45,
    }),
    nest('a8-multi-source-bfs', 'a8-flood-fill', 'Flood Fill'),
    nest('a8-multi-source-bfs', 'a8-number-of-islands', 'Number of Islands'),
    nest('a8-multi-source-bfs', 'a8-rotten-oranges', 'Rotten Oranges / Multi-source Spread'),
    nest('a8-multi-source-bfs', 'a8-word-ladder', 'Word Ladder', 'tier2'),
    nest('a8-multi-source-bfs', 'a8-snakes-and-ladders', 'Snakes and Ladders', 'tier2'),
    nest(
      'a8-multi-source-bfs',
      'a8-shortest-path-binary-matrix',
      'Shortest Path in Binary Matrix',
      'tier2',
    ),
    nest(
      'a8-multi-source-bfs',
      'a8-pacific-atlantic',
      'Pacific Atlantic Water Flow',
      'tier2',
    ),
    nest('a8-multi-source-bfs', 'a8-steps-by-knight', 'Steps by Knight (BFS on Grid)', 'tier2'),
    nest('a8-multi-source-bfs', 'a8-water-jug', 'Water Jug Problem', 'tier2', {
      tags: ['bfs'],
      months: M45,
    }),
    nest('a8-multi-source-bfs', 'a8-boggle', 'Boggle (All Words in a Board)', 'tier2', {
      tags: ['dfs'],
      months: M56,
    }),
  ]),

  section('A8.4', 'Cycle Detection — Undirected Graphs', 11, [
    item('a8-cycle-undirected', 'Cycle Detection in Undirected Graphs', 'tier1', {
      tags: ['cycles'],
      prereqs: ['a8-bfs', 'a8-dfs'],
      related: ['a8-cycle-detection'],
    }),
    nest(
      'a8-cycle-undirected',
      'a8-cycle-undirected-dfs',
      'Undirected Cycle via DFS + Parent',
    ),
    nest(
      'a8-cycle-undirected',
      'a8-cycle-undirected-bfs',
      'Undirected Cycle via BFS + Parent',
    ),
    nest(
      'a8-cycle-undirected',
      'a8-print-shortest-cycle',
      'Print Shortest Cycle / Minimum Weight Cycle',
      'tier2',
    ),
    nest(
      'a8-cycle-undirected',
      'a8-cycles-of-length-n',
      'Cycles of Length N',
      'tier2',
      { months: M56 },
    ),
    nest('a8-cycle-undirected', 'a8-print-all-cycles', 'Print All Cycles', 'tier3', {
      months: M67,
    }),
  ]),

  section('A8.5', 'Cycle Detection — Directed Graphs', 12, [
    item('a8-cycle-detection', 'Graph Cycle Detection (Directed)', 'tier1', {
      tags: ['cycles'],
      prereqs: ['a8-dfs'],
    }),
    nest(
      'a8-cycle-detection',
      'a8-cycle-directed-dfs',
      'Directed Cycle via DFS Colors / Recursion Stack',
    ),
    nest(
      'a8-cycle-detection',
      'a8-cycle-directed-bfs-kahn',
      'Directed Cycle via BFS (Kahn / Toposort)',
    ),
    nest(
      'a8-cycle-detection',
      'a8-cycle-using-colors',
      'Cycle Detection Using Colors (White / Gray / Black)',
    ),
    nest(
      'a8-cycle-detection',
      'a8-negative-cycle-detection',
      'Negative Weight Cycle Detection',
      'tier2',
      { tags: ['shortest-path'], related: ['a8-bellman-ford'] },
    ),
  ]),

  section('A8.6', 'Topological Sort & DAG Algorithms', 13, [
    item('a8-topological-sorting', 'Topological Sorting', 'tier1', {
      tags: ['topo'],
      prereqs: ['a8-cycle-detection'],
    }),
    nest(
      'a8-topological-sorting',
      'a8-topo-kahn',
      "Kahn's Algorithm (BFS + Indegree)",
    ),
    nest(
      'a8-topological-sorting',
      'a8-topo-dfs',
      'Topological Sort via DFS + Stack',
    ),
    nest(
      'a8-topological-sorting',
      'a8-shortest-path-dag',
      'Shortest Path in a DAG',
      'tier1',
      { tags: ['shortest-path', 'topo'], months: M45 },
    ),
    nest('a8-topological-sorting', 'a8-dag-dp', 'DAG Dynamic Programming', 'tier2', {
      tags: ['dp', 'topo'],
      months: M56,
    }),
    nest(
      'a8-topological-sorting',
      'a8-topo-departure-time',
      'Topological Sort Using Departure Time of Vertex',
      'tier2',
    ),
    nest(
      'a8-topological-sorting',
      'a8-all-topological-sorts',
      'All Topological Sorts of a DAG',
      'tier2',
      { months: M56 },
    ),
    nest(
      'a8-topological-sorting',
      'a8-max-edges-keep-dag',
      'Maximum Edges That Can Be Added to a DAG',
      'tier2',
      { months: M56 },
    ),
    nest(
      'a8-topological-sorting',
      'a8-longest-path-dag',
      'Longest Path in a DAG',
      'tier2',
      { tags: ['dp', 'topo'], months: M56 },
    ),
    nest(
      'a8-topological-sorting',
      'a8-find-itinerary',
      'Find Itinerary from a List of Tickets',
      'tier2',
      { months: M56 },
    ),
    nest(
      'a8-topological-sorting',
      'a8-course-schedule',
      'Course Schedule / Dependency Ordering',
      'tier2',
    ),
  ]),

  section('A8.7', 'Bipartite Graphs', 14, [
    item('a8-bipartite', 'Bipartite Graphs', 'tier1', {
      tags: ['bipartite'],
      prereqs: ['a8-bfs'],
      months: M34,
    }),
    nest('a8-bipartite', 'a8-bipartite-bfs', 'Bipartite Check via BFS 2-Coloring'),
    nest('a8-bipartite', 'a8-bipartite-dfs', 'Bipartite Check via DFS 2-Coloring'),
    nest(
      'a8-bipartite',
      'a8-odd-cycle-bipartite',
      'Odd Cycle ⇔ Not Bipartite',
    ),
    nest('a8-bipartite', 'a8-two-clique-problem', 'Two Clique Problem', 'tier3', {
      months: M67,
    }),
  ]),

  section('A8.8', 'Connected Components', 15, [
    item('a8-connected-components', 'Connected Components', 'tier1', {
      tags: ['components'],
      prereqs: ['a8-bfs', 'a8-dfs'],
    }),
    nest(
      'a8-connected-components',
      'a8-components-bfs',
      'Components via BFS (Graph & Grid)',
    ),
    nest(
      'a8-connected-components',
      'a8-components-dfs',
      'Components via DFS (Graph & Grid)',
    ),
    nest(
      'a8-connected-components',
      'a8-largest-region',
      'Largest Region in a Boolean Matrix',
      'tier2',
    ),
    nest(
      'a8-connected-components',
      'a8-count-trees-in-forest',
      'Count Trees in a Forest',
      'tier2',
    ),
    nest(
      'a8-connected-components',
      'a8-universal-sink',
      'Universal Sink',
      'tier2',
      { months: M56 },
    ),
    nest(
      'a8-connected-components',
      'a8-number-of-sinks',
      'Number of Sinks in a Graph',
      'tier2',
      { months: M56 },
    ),
  ]),

  section('A8.9', 'Disjoint Set Union (Union-Find)', 16, [
    item('a8-union-find', 'Union-Find / DSU', 'tier1', {
      tags: ['dsu'],
      months: M34,
    }),
    nest('a8-union-find', 'a8-dsu-path-compression', 'Path Compression'),
    nest('a8-union-find', 'a8-dsu-union-by-rank', 'Union by Rank'),
    nest('a8-union-find', 'a8-dsu-union-by-size', 'Union by Size'),
    nest('a8-union-find', 'a8-dsu-on-grids', 'DSU on Grids', 'tier2'),
    nest(
      'a8-union-find',
      'a8-dynamic-connectivity',
      'Dynamic Connectivity Patterns',
      'tier2',
    ),
  ]),

  section('A8.10', 'Shortest Paths — Non-negative Weights', 17, [
    item('a8-dijkstra', 'Dijkstra', 'tier1', {
      tags: ['shortest-path', 'dijkstra'],
      prereqs: ['a8-bfs'],
      months: M34,
    }),
    nest(
      'a8-dijkstra',
      'a8-dijkstra-priority-queue',
      "Dijkstra with Priority Queue (Standard)",
    ),
    nest('a8-dijkstra', 'a8-dijkstra-set', 'Dijkstra with Set', 'tier2'),
    nest(
      'a8-dijkstra',
      'a8-dijkstra-print-path',
      "Print Shortest Path (Dijkstra)",
      'tier2',
    ),
    nest(
      'a8-dijkstra',
      'a8-dijkstra-limitations',
      'Why Dijkstra Fails on Negative Edges',
    ),
    nest(
      'a8-dijkstra',
      'a8-shortest-path-decision',
      'Shortest-Path Algorithm Decision Tree',
      'tier1',
      { tags: ['shortest-path'] },
    ),
    nest('a8-dijkstra', 'a8-dials-algorithm', "Dial's Algorithm", 'tier3', {
      months: M67,
    }),
    nest('a8-dijkstra', 'a8-desopo-pape', "D'Esopo-Pape Algorithm", 'tier3', {
      months: M78,
    }),
  ]),

  section('A8.11', 'Shortest Paths — Negative Weights & All-Pairs', 18, [
    item('a8-bellman-ford', 'Bellman-Ford', 'tier2', {
      tags: ['shortest-path'],
      prereqs: ['a8-dijkstra'],
      months: M45,
    }),
    nest(
      'a8-bellman-ford',
      'a8-bellman-ford-relaxation',
      'Edge Relaxation & V−1 Iterations',
      'tier2',
    ),
    nest(
      'a8-bellman-ford',
      'a8-bellman-ford-negative-cycle',
      'Negative Cycle Detection (Nth Iteration)',
      'tier2',
    ),
    item('a8-floyd-warshall', 'Floyd-Warshall', 'tier2', {
      tags: ['shortest-path'],
      prereqs: ['a8-dijkstra'],
      months: M45,
    }),
    nest(
      'a8-floyd-warshall',
      'a8-floyd-warshall-all-pairs',
      'All-Pairs Shortest Paths via Intermediates',
      'tier2',
    ),
    nest(
      'a8-floyd-warshall',
      'a8-johnsons-algorithm',
      "Johnson's Algorithm",
      'tier3',
      { months: M67 },
    ),
    nest(
      'a8-floyd-warshall',
      'a8-multistage-graph',
      'Multistage Graph (Shortest Path)',
      'tier3',
      { months: M67 },
    ),
    nest(
      'a8-floyd-warshall',
      'a8-shortest-path-binary-graph',
      'Shortest Path in a Binary Graph',
      'tier2',
      { months: M56 },
    ),
    nest(
      'a8-floyd-warshall',
      'a8-minimum-mean-weight-cycle',
      'Minimum Mean Weight Cycle',
      'tier3',
      { months: M78 },
    ),
  ]),

  section('A8.12', 'Minimum Spanning Trees', 19, [
    item('a8-mst-kruskal', 'Minimum Spanning Tree (Kruskal)', 'tier2', {
      tags: ['mst'],
      related: ['a8-union-find'],
      prereqs: ['a8-union-find'],
      months: M45,
    }),
    nest('a8-mst-kruskal', 'a8-mst-prim', 'MST — Prim', 'tier2', {
      tags: ['mst'],
      months: M45,
    }),
    nest('a8-mst-kruskal', 'a8-prim-vs-kruskal', 'Prim vs Kruskal', 'tier2'),
    nest(
      'a8-mst-kruskal',
      'a8-spanning-tree-basics',
      'Spanning Tree vs MST',
      'tier2',
    ),
    nest(
      'a8-mst-kruskal',
      'a8-connect-all-cities',
      'Minimum Cost to Connect All Cities',
      'tier2',
    ),
    nest(
      'a8-mst-kruskal',
      'a8-mst-applications',
      'Applications of Minimum Spanning Tree',
      'tier2',
    ),
    nest(
      'a8-mst-kruskal',
      'a8-total-spanning-trees',
      'Total Spanning Trees',
      'tier3',
      { months: M67 },
    ),
    nest(
      'a8-mst-kruskal',
      'a8-minimum-product-spanning-tree',
      'Minimum Product Spanning Tree',
      'tier3',
      { months: M67 },
    ),
    nest(
      'a8-mst-kruskal',
      'a8-reverse-delete-mst',
      'Reverse Delete Algorithm for MST',
      'tier3',
      { months: M67 },
    ),
    nest(
      'a8-mst-kruskal',
      'a8-boruvka-mst',
      "Borůvka's Algorithm for MST",
      'tier3',
      { months: M78 },
    ),
  ]),

  section('A8.13', 'Strongly Connected Components', 20, [
    item('a8-scc', 'Strongly Connected Components', 'tier2', {
      tags: ['scc'],
      prereqs: ['a8-dfs'],
      months: M56,
    }),
    nest('a8-scc', 'a8-kosaraju', "Kosaraju's Algorithm (2× DFS)", 'tier2'),
    nest('a8-scc', 'a8-tarjan-scc', "Tarjan's Algorithm for SCC (1× DFS)", 'tier2'),
    nest('a8-scc', 'a8-condensation-dag', 'Condensation Graph (SCC → DAG)', 'tier2'),
    nest('a8-scc', 'a8-kosaraju-vs-tarjan', 'Kosaraju vs Tarjan', 'tier2'),
    nest(
      'a8-scc',
      'a8-count-walks-k-edges',
      'Count Walks with Exactly K Edges',
      'tier3',
      { months: M67 },
    ),
    nest(
      'a8-scc',
      'a8-string-chain-circle',
      'Array of Strings Chained to Form a Circle',
      'tier2',
      { months: M56 },
    ),
  ]),

  section('A8.14', 'Bridges & Articulation Points', 21, [
    item('a8-bridges', 'Bridges in a Graph', 'tier2', {
      tags: ['bridges'],
      prereqs: ['a8-dfs'],
      months: M56,
    }),
    nest(
      'a8-bridges',
      'a8-bridges-tarjan',
      'Finding Bridges (disc / low)',
      'tier2',
    ),
    nest(
      'a8-bridges',
      'a8-critical-connections',
      'Critical Connections in a Network',
      'tier2',
    ),
    item('a8-articulation-points', 'Articulation Points (Cut Vertices)', 'tier2', {
      tags: ['articulation'],
      prereqs: ['a8-dfs'],
      months: M56,
    }),
    nest(
      'a8-articulation-points',
      'a8-articulation-tarjan',
      'Finding Articulation Points (disc / low)',
      'tier2',
    ),
    nest(
      'a8-articulation-points',
      'a8-bridges-vs-articulation',
      'Bridges vs Articulation Points',
      'tier2',
    ),
    nest(
      'a8-articulation-points',
      'a8-biconnected-components',
      'Biconnected Components',
      'tier3',
      { months: M67 },
    ),
  ]),

  section('A8.15', 'Flow, Matching & Eulerian Paths', 22, [
    item('a8-max-flow', 'Maximum Flow', 'tier3', {
      tags: ['flow'],
      months: M67,
    }),
    nest('a8-max-flow', 'a8-ford-fulkerson', 'Ford-Fulkerson / Edmonds-Karp', 'tier3'),
    nest('a8-max-flow', 'a8-dinic', "Dinic's Algorithm", 'tier3'),
    nest(
      'a8-max-flow',
      'a8-bipartite-matching-flow',
      'Bipartite Matching via Flow',
      'tier3',
    ),
    nest('a8-max-flow', 'a8-push-relabel', 'Push-Relabel Algorithm', 'tier3', {
      months: M78,
    }),
    nest(
      'a8-max-flow',
      'a8-max-edge-disjoint-paths',
      'Maximum Edge-Disjoint Paths',
      'tier3',
    ),
    nest('a8-max-flow', 'a8-min-st-cut', 'Minimum s–t Cut in a Flow Network', 'tier3'),
    nest(
      'a8-max-flow',
      'a8-hopcroft-karp',
      'Hopcroft–Karp Maximum Matching',
      'tier3',
      { months: M78 },
    ),
    nest(
      'a8-max-flow',
      'a8-channel-assignment',
      'Channel Assignment Problem',
      'tier3',
      { months: M78 },
    ),
    nest(
      'a8-max-flow',
      'a8-kargers-algorithm',
      "Karger's Algorithm (Min Cut)",
      'tier3',
      { months: M78 },
    ),
    item('a8-euler-path', 'Euler Path & Circuit', 'tier3', {
      tags: ['euler'],
      months: M67,
    }),
    nest(
      'a8-euler-path',
      'a8-euler-vs-hamiltonian',
      'Euler vs Hamiltonian',
      'tier3',
    ),
    nest(
      'a8-euler-path',
      'a8-euler-circuit-directed',
      'Euler Circuit in a Directed Graph',
      'tier3',
    ),
    nest(
      'a8-euler-path',
      'a8-fleury-algorithm',
      "Fleury's Algorithm for Euler Path / Circuit",
      'tier3',
      { months: M78 },
    ),
    nest(
      'a8-euler-path',
      'a8-hierholzer-algorithm',
      "Hierholzer's Algorithm (Directed / Undirected)",
      'tier3',
      { months: M78 },
    ),
    nest(
      'a8-euler-path',
      'a8-seven-bridges-konigsberg',
      'Seven Bridges of Königsberg',
      'tier3',
    ),
    nest(
      'a8-euler-path',
      'a8-chinese-postman',
      'Chinese Postman / Route Inspection',
      'tier3',
      { months: M78 },
    ),
  ]),

  section('A8.16', 'Interview Decision Framework & Must-Do Patterns', 23, [
    item('a8-graph-interview-framework', 'Graph Interview Decision Framework', 'tier1', {
      tags: ['interviews'],
      months: M45,
    }),
    nest(
      'a8-graph-interview-framework',
      'a8-identify-vertices-edges',
      'Identify Vertices & Edges First',
    ),
    nest(
      'a8-graph-interview-framework',
      'a8-constraint-driven-choice',
      'Choose Algorithm from Constraints',
    ),
    nest(
      'a8-graph-interview-framework',
      'a8-common-graph-mistakes',
      'Common Graph Mistakes',
    ),
    nest(
      'a8-graph-interview-framework',
      'a8-must-do-graph-patterns',
      'Must-Do Graph Patterns Cheat Sheet',
      'tier1',
    ),
    nest(
      'a8-graph-interview-framework',
      'a8-complexity-cheat-sheet',
      'Graph Complexity Cheat Sheet',
      'tier2',
    ),
  ]),

  section('A8.17', 'Classic & Advanced Graph Problems (GFG)', 24, [
    item('a8-graph-coloring', 'Graph Coloring', 'tier3', {
      months: M67,
    }),
    nest('a8-graph-coloring', 'a8-traveling-salesman', 'Traveling Salesman (TSP)', 'tier3', {
      months: M78,
    }),
    nest('a8-graph-coloring', 'a8-erdos-renyi', 'Erdős–Rényi Model', 'tier3', {
      months: M78,
    }),
    nest('a8-graph-coloring', 'a8-peterson-graph', 'Petersen Graph', 'tier3', {
      months: M78,
    }),
    item('a8-gfg-must-do-extras', 'GFG Must-Do Graph Extras', 'tier2', {
      months: M56,
    }),
    nest(
      'a8-gfg-must-do-extras',
      'a8-shortest-chain-target-word',
      'Shortest Chain to Reach the Target Word',
      'tier2',
      { related: ['a8-word-ladder'] },
    ),
  ]),
]
