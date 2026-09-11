import { buildGraphAlgo, type GraphAlgoSpec } from './_graph-reference-builder'
import type { TopicContent } from '@/domain/types'

type Entry = Omit<GraphAlgoSpec, 'patterns' | 'mistakes' | 'takeaways'> & {
  patterns?: string[]
  mistakes?: string[]
  takeaways?: string[]
}

const graph = (spec: Entry): TopicContent =>
  buildGraphAlgo({
    ...spec,
    patterns: spec.patterns ?? [],
    mistakes: spec.mistakes ?? [],
    takeaways: spec.takeaways ?? [spec.problem, `Time ${spec.time}; space ${spec.space}.`, spec.intuition],
  })

export type CoreAlgoDef = {
  number: string
  title: string
  topicId: string
  family: string
}

/** Deduped core algorithms only (not problem variants / duplicate write-ups). */
export const CORE_GRAPH_ALGO_DEFS: CoreAlgoDef[] = [
  // Traversal
  { number: '1', title: 'BFS (Breadth-First Search)', topicId: 'a8-bfs', family: 'Traversal' },
  { number: '2', title: 'DFS — Recursive', topicId: 'a8-dfs', family: 'Traversal' },
  { number: '3', title: 'DFS — Iterative', topicId: 'a8-iterative-dfs', family: 'Traversal' },
  { number: '4', title: 'Multi-source BFS', topicId: 'a8-multi-source-bfs', family: 'Traversal' },
  // Cycles
  { number: '5', title: 'Cycle Detection (Undirected)', topicId: 'a8-cycle-undirected', family: 'Cycles' },
  { number: '6', title: 'Cycle Detection (Directed)', topicId: 'a8-cycle-directed-dfs', family: 'Cycles' },
  // Ordering
  { number: '7', title: "Topological Sort — Kahn's", topicId: 'a8-topo-kahn', family: 'Ordering' },
  { number: '8', title: 'Topological Sort — DFS', topicId: 'a8-topo-dfs', family: 'Ordering' },
  // Shortest Path
  {
    number: '9',
    title: 'Shortest Path (Unweighted / BFS)',
    topicId: 'a8-bfs-shortest-unweighted',
    family: 'Shortest Path',
  },
  { number: '10', title: 'Shortest Path in a DAG', topicId: 'a8-shortest-path-dag', family: 'Shortest Path' },
  { number: '11', title: 'Dijkstra (Priority Queue)', topicId: 'a8-dijkstra', family: 'Shortest Path' },
  { number: '12', title: 'Bellman-Ford', topicId: 'a8-bellman-ford', family: 'Shortest Path' },
  { number: '13', title: 'Floyd-Warshall', topicId: 'a8-floyd-warshall', family: 'Shortest Path' },
  { number: '14', title: '0-1 BFS', topicId: 'a8-0-1-bfs', family: 'Shortest Path' },
  // MST
  { number: '15', title: "Prim's MST", topicId: 'a8-mst-prim', family: 'MST' },
  { number: '16', title: "Kruskal's MST", topicId: 'a8-mst-kruskal', family: 'MST' },
  // Connectivity
  { number: '17', title: 'Union-Find (DSU)', topicId: 'a8-union-find', family: 'Connectivity' },
  { number: '18', title: 'Connected Components', topicId: 'a8-connected-components', family: 'Connectivity' },
  { number: '19', title: 'Bridges (Cut Edges)', topicId: 'a8-bridges', family: 'Connectivity' },
  { number: '20', title: 'Articulation Points', topicId: 'a8-articulation-points', family: 'Connectivity' },
  // SCC
  { number: '21', title: 'Kosaraju SCC', topicId: 'a8-kosaraju', family: 'SCC' },
  { number: '22', title: 'Tarjan SCC', topicId: 'a8-tarjan-scc', family: 'SCC' },
  // Coloring / Flow / Euler
  { number: '23', title: 'Bipartite Check', topicId: 'a8-bipartite', family: 'Coloring' },
  { number: '24', title: 'Edmonds-Karp (Max Flow)', topicId: 'a8-ford-fulkerson', family: 'Flow' },
  {
    number: '25',
    title: 'Hierholzer (Euler Path/Circuit)',
    topicId: 'a8-hierholzer-algorithm',
    family: 'Euler',
  },
]

const BFS = `import java.util.*;

class BreadthFirstSearch {
    /**
     * Level-order traversal. The outer loop restarts BFS at every unvisited
     * vertex so disconnected graphs are covered completely.
     */
    static List<Integer> bfsOrder(int n, List<List<Integer>> adj) {
        boolean[] visited = new boolean[n];
        List<Integer> order = new ArrayList<>();

        for (int s = 0; s < n; s++) {
            if (visited[s]) continue;

            ArrayDeque<Integer> queue = new ArrayDeque<>();
            // Mark on ENQUEUE, never on dequeue. If we marked on dequeue, a vertex
            // reachable from two frontier vertices would be pushed (and expanded) twice,
            // degrading BFS to exponential work on dense graphs.
            visited[s] = true;
            queue.add(s);

            while (!queue.isEmpty()) {
                int u = queue.poll();   // FIFO order => vertices leave in non-decreasing depth
                order.add(u);
                for (int v : adj.get(u)) {
                    if (!visited[v]) {
                        visited[v] = true;
                        queue.add(v);
                    }
                }
            }
        }
        return order;
    }
}`

const DFS_RECURSIVE = `import java.util.*;

class DepthFirstSearch {
    static List<Integer> dfsOrder(int n, List<List<Integer>> adj) {
        boolean[] visited = new boolean[n];
        List<Integer> order = new ArrayList<>();
        // One top-level call per component; without this loop we only see
        // the component containing vertex 0.
        for (int s = 0; s < n; s++) {
            if (!visited[s]) dfs(s, adj, visited, order);
        }
        return order;
    }

    private static void dfs(int u, List<List<Integer>> adj, boolean[] visited, List<Integer> order) {
        visited[u] = true;   // mark BEFORE recursing, otherwise a cycle re-enters u forever
        order.add(u);        // preorder position of u

        for (int v : adj.get(u)) {
            if (!visited[v]) dfs(v, adj, visited, order);
        }
        // Postorder point: everything reachable from u is finished here. Topological
        // sort, SCC and low-link algorithms all hang their work off this line.
    }
}`

const DFS_ITERATIVE = `import java.util.*;

class IterativeDepthFirstSearch {
    /** Explicit stack version: same order as recursion, but immune to stack overflow. */
    static List<Integer> dfsOrder(int n, List<List<Integer>> adj) {
        boolean[] visited = new boolean[n];
        List<Integer> order = new ArrayList<>();
        ArrayDeque<Integer> stack = new ArrayDeque<>();

        for (int s = 0; s < n; s++) {
            if (visited[s]) continue;
            stack.push(s);

            while (!stack.isEmpty()) {
                int u = stack.pop();
                // Mark on POP, not on push. The same vertex can legitimately sit on the
                // stack several times; only the first pop should expand it, so we filter
                // the stale copies here.
                if (visited[u]) continue;
                visited[u] = true;
                order.add(u);

                List<Integer> nbrs = adj.get(u);
                // Push neighbours in reverse so they pop in adjacency-list order,
                // reproducing recursive DFS exactly.
                for (int i = nbrs.size() - 1; i >= 0; i--) {
                    int v = nbrs.get(i);
                    if (!visited[v]) stack.push(v);
                }
            }
        }
        return order;
    }
}`

const CYCLE_UNDIRECTED = `import java.util.*;

class UndirectedCycleDetection {
    static boolean hasCycle(int n, List<List<Integer>> adj) {
        boolean[] visited = new boolean[n];
        for (int s = 0; s < n; s++) {
            if (!visited[s] && dfs(s, -1, adj, visited)) return true;
        }
        return false;
    }

    private static boolean dfs(int u, int parent, List<List<Integer>> adj, boolean[] visited) {
        visited[u] = true;
        for (int v : adj.get(u)) {
            // Every undirected edge appears twice, so the edge we arrived on would look
            // like a cycle. Skipping the parent is what removes that false positive.
            if (v == parent) continue;

            // A visited, non-parent neighbour is a back edge to an ancestor => cycle.
            if (visited[v]) return true;

            if (dfs(v, u, adj, visited)) return true;
        }
        return false;
    }
}`

const BFS_SHORTEST_UNWEIGHTED = `import java.util.*;

class BfsShortestPath {
    /** Returns the vertex list of a shortest src->dst path, or an empty list if unreachable. */
    static List<Integer> shortestPath(int n, List<List<Integer>> adj, int src, int dst) {
        int[] dist = new int[n];
        int[] parent = new int[n];
        Arrays.fill(dist, -1);      // -1 doubles as "not visited yet"
        Arrays.fill(parent, -1);

        ArrayDeque<Integer> queue = new ArrayDeque<>();
        dist[src] = 0;
        queue.add(src);

        while (!queue.isEmpty()) {
            int u = queue.poll();
            if (u == dst) break;    // BFS finalises a vertex on its first dequeue

            for (int v : adj.get(u)) {
                if (dist[v] != -1) continue;
                // Unit weights: the first time BFS reaches v it is via a shortest path,
                // so the distance and the parent pointer can be fixed immediately.
                dist[v] = dist[u] + 1;
                parent[v] = u;
                queue.add(v);
            }
        }

        if (dist[dst] == -1) return new ArrayList<>();

        // Walk parents backwards, pushing to the front to get src -> dst order.
        LinkedList<Integer> path = new LinkedList<>();
        for (int cur = dst; cur != -1; cur = parent[cur]) path.addFirst(cur);
        return path;
    }
}`

const CYCLE_DIRECTED = `import java.util.*;

class DirectedCycleDetection {
    private static final int WHITE = 0;   // untouched
    private static final int GRAY = 1;    // on the current recursion stack
    private static final int BLACK = 2;   // fully explored

    static boolean hasCycle(int n, List<List<Integer>> adj) {
        int[] color = new int[n];         // all WHITE
        for (int s = 0; s < n; s++) {
            if (color[s] == WHITE && dfs(s, adj, color)) return true;
        }
        return false;
    }

    private static boolean dfs(int u, List<List<Integer>> adj, int[] color) {
        color[u] = GRAY;   // u enters the active path
        for (int v : adj.get(u)) {
            // GRAY neighbour = edge back into the active path = directed cycle.
            if (color[v] == GRAY) return true;

            if (color[v] == WHITE && dfs(v, adj, color)) return true;

            // A BLACK neighbour is already finished and cannot reach u, so it is safe.
            // This is exactly why a plain "visited" flag is not enough for digraphs.
        }
        color[u] = BLACK;  // u leaves the active path
        return false;
    }
}`

const TOPO_KAHN = `import java.util.*;

class TopologicalSortKahn {
    /** Returns a topological order, or an empty array if the graph has a cycle. */
    static int[] topoSort(int n, List<List<Integer>> adj) {
        int[] indeg = new int[n];
        for (int u = 0; u < n; u++) {
            for (int v : adj.get(u)) indeg[v]++;
        }

        ArrayDeque<Integer> queue = new ArrayDeque<>();
        // Indegree 0 means "no unmet prerequisite", so these are safe to output now.
        for (int u = 0; u < n; u++) {
            if (indeg[u] == 0) queue.add(u);
        }

        int[] order = new int[n];
        int k = 0;
        while (!queue.isEmpty()) {
            int u = queue.poll();
            order[k++] = u;
            for (int v : adj.get(u)) {
                // u is now placed, so one prerequisite of v is satisfied. Enqueue v only
                // when the last one drops away; that keeps every vertex enqueued once.
                if (--indeg[v] == 0) queue.add(v);
            }
        }

        // Emitted fewer than n vertices => some indegrees never reached 0 => cycle.
        return k == n ? order : new int[0];
    }
}`

const TOPO_DFS = `import java.util.*;

class TopologicalSortDfs {
    private static final int UNVISITED = 0, IN_STACK = 1, DONE = 2;

    /** Reverse postorder DFS. Returns an empty array when a cycle exists. */
    static int[] topoSort(int n, List<List<Integer>> adj) {
        int[] state = new int[n];
        ArrayDeque<Integer> finished = new ArrayDeque<>();   // used as a stack

        for (int s = 0; s < n; s++) {
            if (state[s] == UNVISITED && !dfs(s, adj, state, finished)) return new int[0];
        }

        int[] order = new int[n];
        // Popping the finish stack yields reverse postorder = a valid topological order.
        for (int i = 0; i < n; i++) order[i] = finished.pop();
        return order;
    }

    /** Returns false as soon as a back edge (cycle) is found. */
    private static boolean dfs(int u, List<List<Integer>> adj, int[] state, ArrayDeque<Integer> finished) {
        state[u] = IN_STACK;
        for (int v : adj.get(u)) {
            if (state[v] == IN_STACK) return false;   // back edge => not a DAG => no order
            if (state[v] == UNVISITED && !dfs(v, adj, state, finished)) return false;
        }
        state[u] = DONE;
        // u is pushed only after every descendant is pushed, so u ends up above
        // all of them on the stack, i.e. before them in the output order.
        finished.push(u);
        return true;
    }
}`

const SHORTEST_PATH_DAG = `import java.util.*;

class DagShortestPath {
    static final long INF = Long.MAX_VALUE / 4;   // /4 leaves headroom so INF + w cannot overflow

    /** adj.get(u) holds {v, w} pairs. Weights may be negative: a DAG has no cycles. */
    static long[] shortestPaths(int n, List<List<int[]>> adj, int src) {
        // Step 1: topological order (Kahn).
        int[] indeg = new int[n];
        for (int u = 0; u < n; u++) {
            for (int[] e : adj.get(u)) indeg[e[0]]++;
        }
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        for (int u = 0; u < n; u++) if (indeg[u] == 0) queue.add(u);

        int[] order = new int[n];
        int k = 0;
        while (!queue.isEmpty()) {
            int u = queue.poll();
            order[k++] = u;
            for (int[] e : adj.get(u)) {
                if (--indeg[e[0]] == 0) queue.add(e[0]);
            }
        }

        // Step 2: single relaxation sweep in that order.
        long[] dist = new long[n];
        Arrays.fill(dist, INF);
        dist[src] = 0;
        for (int i = 0; i < k; i++) {
            int u = order[i];
            // When u is reached in topological order, every path into u has already been
            // relaxed, so dist[u] is final. One pass per edge is therefore enough.
            if (dist[u] == INF) continue;   // never relax out of an unreachable vertex
            for (int[] e : adj.get(u)) {
                if (dist[u] + e[1] < dist[e[0]]) dist[e[0]] = dist[u] + e[1];
            }
        }
        return dist;
    }
}`

const DIJKSTRA = `import java.util.*;

class Dijkstra {
    static final long INF = Long.MAX_VALUE / 4;

    /** adj.get(u) holds {v, w} pairs with w >= 0. */
    static long[] dijkstra(int n, List<List<int[]>> adj, int src) {
        long[] dist = new long[n];
        Arrays.fill(dist, INF);
        dist[src] = 0;

        // Lazy Dijkstra: entries are {distance, vertex}. Java's PriorityQueue has no
        // decrease-key, so we push an improved copy and discard stale ones on poll.
        // The heap holds O(E) entries, which is still O(E log V) overall.
        PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingLong(a -> a[0]));
        pq.add(new long[]{0L, src});

        while (!pq.isEmpty()) {
            long[] top = pq.poll();
            long d = top[0];
            int u = (int) top[1];

            // Stale entry: u was already settled with a smaller key. Skipping here is
            // what keeps each vertex expanded exactly once.
            if (d > dist[u]) continue;

            for (int[] e : adj.get(u)) {
                int v = e[0];
                long nd = d + e[1];   // long: 1e5 edges of weight 1e9 overflows int
                if (nd < dist[v]) {
                    dist[v] = nd;     // relax, then publish the new key to the heap
                    pq.add(new long[]{nd, v});
                }
            }
        }
        return dist;
    }
}`

const BELLMAN_FORD = `import java.util.*;

class BellmanFord {
    static final long INF = Long.MAX_VALUE / 4;

    /** edges[i] = {u, v, w}. Returns null if a negative cycle is reachable from src. */
    static long[] bellmanFord(int n, int[][] edges, int src) {
        long[] dist = new long[n];
        Arrays.fill(dist, INF);
        dist[src] = 0;

        // After round i, every shortest path that uses at most i edges is correct.
        // A simple shortest path uses at most n-1 edges, hence n-1 rounds.
        for (int round = 0; round < n - 1; round++) {
            boolean changed = false;
            for (int[] e : edges) {
                // Relaxing from INF would create bogus finite distances (INF + w).
                if (dist[e[0]] == INF) continue;
                if (dist[e[0]] + e[2] < dist[e[1]]) {
                    dist[e[1]] = dist[e[0]] + e[2];
                    changed = true;
                }
            }
            if (!changed) break;   // fixed point reached early; common on real inputs
        }

        // One extra pass: any edge that still relaxes proves a negative cycle,
        // because no simple path can improve after n-1 rounds.
        for (int[] e : edges) {
            if (dist[e[0]] != INF && dist[e[0]] + e[2] < dist[e[1]]) return null;
        }
        return dist;
    }
}`

const FLOYD_WARSHALL = `import java.util.*;

class FloydWarshall {
    static final int INF = 1_000_000_000;   // large but safe: INF + INF stays inside int

    /**
     * dist[i][j] starts as the direct edge weight (INF if absent, 0 on the diagonal)
     * and is rewritten in place into all-pairs shortest distances.
     */
    static void floydWarshall(int n, int[][] dist) {
        // k must be the OUTERMOST loop: it is the DP layer "paths whose intermediate
        // vertices all come from {0..k}". Any other loop order is simply wrong.
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                if (dist[i][k] >= INF) continue;   // no i->k leg, whole row unaffected by k
                for (int j = 0; j < n; j++) {
                    if (dist[k][j] >= INF) continue;
                    int through = dist[i][k] + dist[k][j];
                    if (through < dist[i][j]) dist[i][j] = through;
                }
            }
        }
    }

    /** Negative cycle through i iff its distance to itself became negative. */
    static boolean hasNegativeCycle(int n, int[][] dist) {
        for (int i = 0; i < n; i++) {
            if (dist[i][i] < 0) return true;
        }
        return false;
    }
}`

const ZERO_ONE_BFS = `import java.util.*;

class ZeroOneBfs {
    /** adj.get(u) holds {v, w} pairs where w is 0 or 1. */
    static int[] zeroOneBfs(int n, List<List<int[]>> adj, int src) {
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;

        ArrayDeque<Integer> deque = new ArrayDeque<>();
        deque.addFirst(src);

        while (!deque.isEmpty()) {
            int u = deque.pollFirst();
            for (int[] e : adj.get(u)) {
                int v = e[0], w = e[1];
                // The relax check also filters stale deque entries, so no visited[] needed.
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    // A 0-edge keeps v in the CURRENT layer, so it goes to the front; a
                    // 1-edge moves it to the next layer, so it goes to the back. That
                    // ordering makes the deque behave like a 2-bucket priority queue.
                    if (w == 0) deque.addFirst(v);
                    else deque.addLast(v);
                }
            }
        }
        return dist;
    }
}`

const PRIM = `import java.util.*;

class PrimMst {
    /** adj.get(u) holds {v, w} pairs. Returns total MST weight, or -1 if disconnected. */
    static long primMst(int n, List<List<int[]>> adj) {
        boolean[] inMst = new boolean[n];
        // {weight, vertex} keyed by the cheapest known edge crossing the cut.
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.add(new int[]{0, 0});   // any start vertex works for an MST

        long total = 0;
        int taken = 0;
        while (!pq.isEmpty() && taken < n) {
            int[] top = pq.poll();
            int w = top[0], u = top[1];

            // Lazy heap: u may already be attached by a cheaper crossing edge.
            if (inMst[u]) continue;

            // Cut property: the lightest edge crossing the (tree, rest) cut is always
            // in some MST, and the heap minimum is exactly that edge.
            inMst[u] = true;
            total += w;
            taken++;

            for (int[] e : adj.get(u)) {
                if (!inMst[e[0]]) pq.add(new int[]{e[1], e[0]});
            }
        }
        return taken == n ? total : -1;
    }
}`

const KRUSKAL = `import java.util.*;

class KruskalMst {
    private int[] parent, rnk;

    private int find(int x) {
        // Path compression: re-point every node on the path straight at the root.
        return parent[x] == x ? x : (parent[x] = find(parent[x]));
    }

    private boolean union(int a, int b) {
        a = find(a);
        b = find(b);
        if (a == b) return false;   // same component already => this edge would close a cycle
        if (rnk[a] < rnk[b]) { int t = a; a = b; b = t; }   // union by rank: small under large
        parent[b] = a;
        if (rnk[a] == rnk[b]) rnk[a]++;
        return true;
    }

    /** edges[i] = {u, v, w}. Returns {totalWeight, edgesUsed}; used == n-1 means spanning. */
    long[] kruskal(int n, int[][] edges) {
        parent = new int[n];
        rnk = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;

        // Greedy: consider edges lightest first. Sorting dominates the runtime.
        Arrays.sort(edges, Comparator.comparingInt(e -> e[2]));

        long total = 0;
        int used = 0;
        for (int[] e : edges) {
            // DSU is the cycle test: accept the edge only if it joins two components.
            if (union(e[0], e[1])) {
                total += e[2];
                if (++used == n - 1) break;   // tree is complete, remaining edges are redundant
            }
        }
        return new long[]{total, used};
    }
}`

const UNION_FIND = `class DisjointSetUnion {
    private final int[] parent;
    private final int[] rnk;      // upper bound on tree height
    private final int[] compSize;
    private int components;

    DisjointSetUnion(int n) {
        parent = new int[n];
        rnk = new int[n];
        compSize = new int[n];
        components = n;
        for (int i = 0; i < n; i++) {
            parent[i] = i;        // every element starts as its own root
            compSize[i] = 1;
        }
    }

    /**
     * Path compression: after the recursion unwinds, every node on the query path
     * points directly at the root, so repeated queries are effectively O(1).
     */
    int find(int x) {
        return parent[x] == x ? x : (parent[x] = find(parent[x]));
    }

    /** Union by rank keeps the tree shallow. Returns false if a and b were already joined. */
    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;

        // Hang the shorter tree under the taller one so the height does not grow.
        if (rnk[ra] < rnk[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        compSize[ra] += compSize[rb];

        // Height increases only when both trees were equally tall.
        if (rnk[ra] == rnk[rb]) rnk[ra]++;

        components--;
        return true;
    }

    boolean connected(int a, int b) { return find(a) == find(b); }

    int sizeOf(int x) { return compSize[find(x)]; }

    int componentCount() { return components; }
}`

const KOSARAJU = `import java.util.*;

class KosarajuScc {
    /** Returns comp[v] = SCC id. Ids follow a topological order of the condensation. */
    static int[] scc(int n, List<List<Integer>> adj) {
        List<List<Integer>> rev = new ArrayList<>();
        for (int i = 0; i < n; i++) rev.add(new ArrayList<>());
        for (int u = 0; u < n; u++) {
            for (int v : adj.get(u)) rev.get(v).add(u);
        }

        // Pass 1: order vertices by DFS finish time on the original graph.
        boolean[] visited = new boolean[n];
        ArrayDeque<Integer> finishOrder = new ArrayDeque<>();
        for (int s = 0; s < n; s++) {
            if (!visited[s]) dfsOrder(s, adj, visited, finishOrder);
        }

        // Pass 2: DFS the REVERSED graph, taking roots in decreasing finish time.
        // Reversing kills every edge that left the component, so a DFS started at the
        // "latest finished" vertex can reach exactly its own SCC and nothing more.
        int[] comp = new int[n];
        Arrays.fill(comp, -1);
        int id = 0;
        while (!finishOrder.isEmpty()) {
            int s = finishOrder.pop();
            if (comp[s] != -1) continue;
            collect(s, rev, comp, id++);
        }
        return comp;
    }

    private static void dfsOrder(int u, List<List<Integer>> adj, boolean[] visited, ArrayDeque<Integer> out) {
        visited[u] = true;
        for (int v : adj.get(u)) {
            if (!visited[v]) dfsOrder(v, adj, visited, out);
        }
        out.push(u);   // pushed on finish, so the stack top finished last
    }

    private static void collect(int u, List<List<Integer>> rev, int[] comp, int id) {
        comp[u] = id;
        for (int v : rev.get(u)) {
            if (comp[v] == -1) collect(v, rev, comp, id);
        }
    }
}`

const TARJAN_SCC = `import java.util.*;

class TarjanScc {
    private int timer, sccCount;
    private int[] disc, low, comp;
    private boolean[] onStack;
    private ArrayDeque<Integer> stack;

    /** Single-pass SCC. Returns comp[v] = SCC id in reverse topological order. */
    int[] scc(int n, List<List<Integer>> adj) {
        disc = new int[n];
        low = new int[n];
        comp = new int[n];
        onStack = new boolean[n];
        stack = new ArrayDeque<>();
        Arrays.fill(disc, -1);
        Arrays.fill(comp, -1);
        timer = 0;
        sccCount = 0;

        for (int s = 0; s < n; s++) {
            if (disc[s] == -1) dfs(s, adj);
        }
        return comp;
    }

    private void dfs(int u, List<List<Integer>> adj) {
        // disc = discovery time; low = smallest disc reachable from u's subtree
        // using tree edges plus at most one edge back into the current stack.
        disc[u] = low[u] = timer++;
        stack.push(u);
        onStack[u] = true;

        for (int v : adj.get(u)) {
            if (disc[v] == -1) {
                dfs(v, adj);
                low[u] = Math.min(low[u], low[v]);    // tree edge: inherit the child's reach
            } else if (onStack[v]) {
                low[u] = Math.min(low[u], disc[v]);   // back edge inside the current SCC
                // Use disc[v], not low[v]: low[v] may belong to a different subtree.
            }
            // Visited but not on the stack => v sits in an already-closed SCC. Pulling its
            // low value in would wrongly merge two components, so we ignore it.
        }

        // Nothing in u's subtree reaches above u => u is the root of an SCC, and the
        // stack above u is exactly that component.
        if (low[u] == disc[u]) {
            int v;
            do {
                v = stack.pop();
                onStack[v] = false;
                comp[v] = sccCount;
            } while (v != u);
            sccCount++;
        }
    }
}`

const BRIDGES = `import java.util.*;

class BridgeFinder {
    private int timer;
    private int[] disc, low;
    private List<int[]> bridges;

    /**
     * adj.get(u) holds {v, edgeId} pairs, with the same edgeId on both directions.
     * Tracking the edge id (instead of the parent vertex) keeps parallel edges correct.
     */
    List<int[]> findBridges(int n, List<List<int[]>> adj) {
        disc = new int[n];
        low = new int[n];
        Arrays.fill(disc, -1);
        bridges = new ArrayList<>();
        timer = 0;

        for (int s = 0; s < n; s++) {
            if (disc[s] == -1) dfs(s, -1, adj);
        }
        return bridges;
    }

    private void dfs(int u, int inEdgeId, List<List<int[]>> adj) {
        disc[u] = low[u] = timer++;
        for (int[] e : adj.get(u)) {
            int v = e[0], id = e[1];

            // Skip only the exact edge we entered on. A second, parallel u-v edge must
            // still be explored: it makes both copies non-bridges.
            if (id == inEdgeId) continue;

            if (disc[v] == -1) {
                dfs(v, id, adj);
                low[u] = Math.min(low[u], low[v]);

                // Strict >: v's subtree has no back edge to u or above, so removing (u,v)
                // disconnects it. Equality would mean a back edge reaches u itself.
                if (low[v] > disc[u]) bridges.add(new int[]{u, v});
            } else {
                low[u] = Math.min(low[u], disc[v]);   // back edge climbs to an ancestor
            }
        }
    }
}`

const ARTICULATION_POINTS = `import java.util.*;

class ArticulationPointFinder {
    private int timer;
    private int[] disc, low;
    private boolean[] isCut;

    List<Integer> findArticulationPoints(int n, List<List<Integer>> adj) {
        disc = new int[n];
        low = new int[n];
        isCut = new boolean[n];
        Arrays.fill(disc, -1);
        timer = 0;

        for (int s = 0; s < n; s++) {
            if (disc[s] == -1) dfs(s, -1, adj);
        }
        List<Integer> result = new ArrayList<>();
        for (int v = 0; v < n; v++) {
            if (isCut[v]) result.add(v);
        }
        return result;
    }

    private void dfs(int u, int parent, List<List<Integer>> adj) {
        disc[u] = low[u] = timer++;
        int children = 0;   // DFS-tree children, needed for the root rule below

        for (int v : adj.get(u)) {
            if (v == parent) continue;   // do not treat the incoming edge as a back edge

            if (disc[v] == -1) {
                children++;
                dfs(v, u, adj);
                low[u] = Math.min(low[u], low[v]);

                // low[v] >= disc[u] means v's subtree cannot bypass u, so deleting u
                // detaches it. Note >= here (bridges use >) because u itself counts.
                if (parent != -1 && low[v] >= disc[u]) isCut[u] = true;
            } else {
                low[u] = Math.min(low[u], disc[v]);
            }
        }

        // The root has no parent to fall back on, so it is a cut vertex exactly when
        // it stitches together two or more independent subtrees.
        if (parent == -1 && children > 1) isCut[u] = true;
    }
}`

const BIPARTITE = `import java.util.*;

class BipartiteCheck {
    static boolean isBipartite(int n, List<List<Integer>> adj) {
        int[] color = new int[n];
        Arrays.fill(color, -1);   // -1 = uncoloured / unvisited

        for (int s = 0; s < n; s++) {
            if (color[s] != -1) continue;   // one BFS per component; each is coloured freely
            color[s] = 0;
            ArrayDeque<Integer> queue = new ArrayDeque<>();
            queue.add(s);

            while (!queue.isEmpty()) {
                int u = queue.poll();
                for (int v : adj.get(u)) {
                    if (color[v] == -1) {
                        color[v] = color[u] ^ 1;   // XOR flips 0<->1: neighbours change side
                        queue.add(v);
                    } else if (color[v] == color[u]) {
                        // Same colour on both endpoints => an odd-length cycle => not bipartite.
                        return false;
                    }
                }
            }
        }
        return true;
    }
}`

const CONNECTED_COMPONENTS = `import java.util.*;

class ConnectedComponents {
    /** Returns comp[v] = component id in 0..count-1; count = number of components. */
    static int[] components(int n, List<List<Integer>> adj) {
        int[] comp = new int[n];
        Arrays.fill(comp, -1);
        int count = 0;
        ArrayDeque<Integer> queue = new ArrayDeque<>();

        for (int s = 0; s < n; s++) {
            // Every unlabelled vertex is unreachable from all previous ones,
            // so it necessarily opens a brand-new component.
            if (comp[s] != -1) continue;

            comp[s] = count;
            queue.add(s);
            while (!queue.isEmpty()) {
                int u = queue.poll();
                for (int v : adj.get(u)) {
                    if (comp[v] == -1) {
                        comp[v] = count;   // label acts as the visited marker
                        queue.add(v);
                    }
                }
            }
            count++;
        }
        return comp;
    }

    static int countComponents(int n, List<List<Integer>> adj) {
        int[] comp = components(n, adj);
        int max = -1;
        for (int c : comp) max = Math.max(max, c);
        return max + 1;
    }
}`

const MULTI_SOURCE_BFS = `import java.util.*;

class MultiSourceBfs {
    /** dist[v] = number of edges to the NEAREST source, or -1 if unreachable. */
    static int[] multiSourceBfs(int n, List<List<Integer>> adj, int[] sources) {
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        ArrayDeque<Integer> queue = new ArrayDeque<>();

        // Seed EVERY source at distance 0 before the loop starts. This is equivalent to
        // adding a virtual super-source with zero-cost edges, so the usual BFS layer
        // argument still applies and each vertex is settled by its closest source.
        for (int s : sources) {
            if (dist[s] != -1) continue;   // guard duplicated sources
            dist[s] = 0;
            queue.add(s);
        }

        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int v : adj.get(u)) {
                if (dist[v] == -1) {
                    dist[v] = dist[u] + 1;
                    queue.add(v);
                }
            }
        }
        return dist;
    }
}`

const EDMONDS_KARP = `import java.util.*;

class EdmondsKarp {
    /**
     * cap[u][v] = remaining capacity of u->v. The matrix is mutated into the
     * residual graph, so pass a copy if the original is needed afterwards.
     */
    static int maxFlow(int n, int[][] cap, int s, int t) {
        int[] parent = new int[n];
        int flow = 0;

        while (true) {
            Arrays.fill(parent, -1);
            parent[s] = s;   // marks the source as visited without a real predecessor
            ArrayDeque<Integer> queue = new ArrayDeque<>();
            queue.add(s);

            // BFS, not DFS: choosing the augmenting path with the fewest edges bounds the
            // number of augmentations by O(V*E) independently of the capacity values.
            while (!queue.isEmpty() && parent[t] == -1) {
                int u = queue.poll();
                for (int v = 0; v < n; v++) {
                    if (parent[v] == -1 && cap[u][v] > 0) {
                        parent[v] = u;
                        queue.add(v);
                    }
                }
            }

            // No s-t path left in the residual graph => max-flow min-cut says we are done.
            if (parent[t] == -1) break;

            // Bottleneck = smallest residual capacity along the path.
            int bottleneck = Integer.MAX_VALUE;
            for (int v = t; v != s; v = parent[v]) {
                bottleneck = Math.min(bottleneck, cap[parent[v]][v]);
            }

            for (int v = t; v != s; v = parent[v]) {
                cap[parent[v]][v] -= bottleneck;   // consume forward capacity
                cap[v][parent[v]] += bottleneck;   // reverse capacity lets later paths undo this
            }
            flow += bottleneck;
        }
        return flow;
    }
}`

const HIERHOLZER = `import java.util.*;

class Hierholzer {
    /**
     * Euler path/circuit in a DIRECTED graph. out.get(u) lists u's out-neighbours.
     * Returns the vertex sequence (length = edges + 1), or an empty list if none exists.
     */
    static List<Integer> eulerPath(int n, List<List<Integer>> out) {
        // Adjacency as deques of UNUSED edges: polling deletes an edge in O(1), which is
        // what keeps the total work linear instead of rescanning used edges.
        List<ArrayDeque<Integer>> unused = new ArrayList<>();
        for (int u = 0; u < n; u++) unused.add(new ArrayDeque<>());

        int[] outDeg = new int[n], inDeg = new int[n];
        int edgeCount = 0;
        for (int u = 0; u < n; u++) {
            for (int v : out.get(u)) {
                unused.get(u).add(v);
                outDeg[u]++;
                inDeg[v]++;
                edgeCount++;
            }
        }

        // Degree test: a circuit needs out == in everywhere; a path allows exactly one
        // vertex with out-in = +1 (the start) and one with -1 (the end).
        int start = -1, plusOne = 0, minusOne = 0;
        for (int u = 0; u < n; u++) {
            int diff = outDeg[u] - inDeg[u];
            if (diff == 1) { plusOne++; start = u; }
            else if (diff == -1) minusOne++;
            else if (diff != 0) return new ArrayList<>();
        }
        if (plusOne > 1 || minusOne > 1) return new ArrayList<>();
        if (start == -1) {
            for (int u = 0; u < n; u++) {
                if (outDeg[u] > 0) { start = u; break; }
            }
        }
        if (start == -1) return new ArrayList<>();   // no edges at all

        ArrayDeque<Integer> stack = new ArrayDeque<>();
        List<Integer> route = new ArrayList<>();
        stack.push(start);
        while (!stack.isEmpty()) {
            int u = stack.peek();
            if (unused.get(u).isEmpty()) {
                // Stuck at u: every edge out of u is spent, so u's position in the final
                // walk is fixed. Recording it here builds the route back-to-front.
                route.add(u);
                stack.pop();
            } else {
                // Walk any unused edge and consume it; correctness does not depend on
                // which one, because detours get spliced in when we later revisit u.
                stack.push(unused.get(u).poll());
            }
        }
        Collections.reverse(route);

        // Connectivity check: a genuine Euler path uses every edge exactly once.
        return route.size() == edgeCount + 1 ? route : new ArrayList<>();
    }
}`

export const GRAPH_CORE_PACK: Record<string, TopicContent> = {
  'a8-bfs': graph({
    problem:
      'Visit every vertex reachable from a start vertex in order of increasing edge count, producing a level-by-level traversal order. Repeating from each unvisited vertex covers a disconnected graph.',
    intuition:
      'A FIFO queue holds the current frontier, so vertices leave the queue sorted by depth. Marking a vertex the moment it is enqueued guarantees each vertex enters the queue exactly once.',
    steps: [
      'Create visited[] of size V and an ArrayDeque queue.',
      'Mark the start visited and enqueue it.',
      'Poll a vertex u and record it in the traversal order.',
      "Scan u's neighbours; for each unvisited v, mark it visited and enqueue it.",
      'Repeat until the queue drains.',
      'Wrap the whole thing in a loop over all vertices to reach other components.',
    ],
    codes: [{ caption: 'BFS traversal (all components)', code: BFS }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis:
      'Each vertex is enqueued once and each adjacency entry is scanned once, giving O(V + E) time with O(V) for the queue and visited array.',
    notes: [
      'Mark on enqueue, not on dequeue — marking late lets a vertex enter the queue multiple times.',
      'BFS gives shortest paths only when every edge has the same weight.',
    ],
  }),

  'a8-dfs': graph({
    problem:
      'Explore a graph by going as deep as possible along each branch before backtracking, producing preorder and postorder positions for every vertex. Restarting at each unvisited vertex covers all components.',
    intuition:
      'Recursion is the stack: entering a vertex marks it and immediately dives into its first unexplored neighbour. The postorder moment — after all descendants finish — is the hook that topological sort, SCC and low-link algorithms reuse.',
    steps: [
      'Allocate visited[] of size V.',
      'For every vertex not yet visited, call dfs on it.',
      'Inside dfs, mark u visited before touching any neighbour.',
      'Record u for preorder, then recurse into every unvisited neighbour.',
      'After the neighbour loop, u is finished — this is the postorder hook.',
    ],
    codes: [{ caption: 'Recursive DFS (all components)', code: DFS_RECURSIVE }],
    time: 'O(V + E)',
    space: 'O(V) for visited plus O(V) recursion depth',
    analysis:
      'Every vertex is entered once and every edge inspected once, so O(V + E); the recursion stack can reach depth V on a path graph.',
    notes: [
      'On V ≈ 1e5+ chains, deep recursion can overflow the JVM stack — switch to the iterative version or raise the thread stack size.',
      'Preorder is when you push, postorder is when you return: pick the one your problem needs.',
    ],
  }),

  'a8-iterative-dfs': graph({
    problem:
      'Perform the same depth-first traversal without recursion, using an explicit stack so that very deep graphs cannot blow the call stack.',
    intuition:
      'Push a vertex, pop it, mark it, then push its neighbours in reverse order. Because a vertex can be pushed several times before it is popped, the visited check must happen on pop rather than on push.',
    steps: [
      'Create visited[] and an ArrayDeque used as a stack.',
      'Push the start vertex.',
      'Pop u; if it is already visited, skip it.',
      'Mark u visited and record it in the order.',
      "Push u's unvisited neighbours in reverse adjacency order.",
      'Repeat until the stack empties, then restart at the next unvisited vertex.',
    ],
    codes: [{ caption: 'Iterative DFS with explicit stack', code: DFS_ITERATIVE }],
    time: 'O(V + E)',
    space: 'O(V + E) worst case for the stack',
    analysis:
      'Each edge can push at most one stack entry, so the stack holds O(E) entries in the worst case while total work stays O(V + E).',
    notes: [
      'Pushing neighbours in reverse reproduces the exact order of the recursive version.',
      'This shape gives no natural postorder; for postorder work, push (vertex, state) pairs or use the recursive form.',
    ],
  }),

  'a8-cycle-undirected': graph({
    problem:
      'Decide whether an undirected graph contains a cycle, i.e. whether it is a forest. Used for validating trees and for detecting redundant connections.',
    intuition:
      'Run DFS carrying the parent vertex. Because each undirected edge is stored twice, the edge you arrived on always looks like a back edge, so it must be skipped; any other visited neighbour is a genuine back edge to an ancestor.',
    steps: [
      'Allocate visited[] and loop over all vertices to handle multiple components.',
      'Call dfs(start, parent = -1).',
      'Mark u visited on entry.',
      'For each neighbour v: skip v if it equals the parent.',
      'If v is already visited, report a cycle immediately.',
      'Otherwise recurse with parent = u and propagate the result.',
    ],
    codes: [{ caption: 'DFS + parent check', code: CYCLE_UNDIRECTED }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis:
      'One DFS over the graph touches each vertex and edge a constant number of times, so O(V + E) time and O(V) for visited plus recursion.',
    notes: [
      'With parallel edges, comparing the parent vertex hides the second copy — track the incoming edge id instead.',
      'A self-loop is a cycle; handle it explicitly if your input allows one.',
      'DSU is the usual alternative: a union that finds both endpoints already joined means a cycle.',
    ],
  }),

  'a8-bfs-shortest-unweighted': graph({
    problem:
      'Find the minimum number of edges between a source and every other vertex in an unweighted graph, and reconstruct one shortest path to a target.',
    intuition:
      'With unit weights, BFS settles vertices in non-decreasing distance order, so the first time a vertex is reached the distance is already optimal. Storing a parent pointer at that moment is enough to rebuild the path.',
    steps: [
      'Fill dist[] with -1 (serving as both distance and visited flag) and parent[] with -1.',
      'Set dist[src] = 0 and enqueue src.',
      'Poll u; stop early if u is the target.',
      'For each neighbour v with dist[v] == -1, set dist[v] = dist[u] + 1 and parent[v] = u, then enqueue v.',
      'If dist[dst] is still -1, the target is unreachable.',
      'Otherwise walk parent[] back from dst, pushing vertices to the front of a list.',
    ],
    codes: [{ caption: 'BFS shortest path with reconstruction', code: BFS_SHORTEST_UNWEIGHTED }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis:
      'A single BFS sweep costs O(V + E), and reconstruction walks a path of at most V vertices, using O(V) space for dist and parent.',
    notes: [
      'Any non-uniform positive weight breaks this — use Dijkstra (or 0-1 BFS for weights in {0,1}).',
      'Grid problems are the same algorithm with neighbours generated from direction arrays.',
    ],
  }),

  'a8-cycle-directed-dfs': graph({
    problem:
      'Decide whether a directed graph contains a cycle, which is the same as asking whether it fails to be a DAG. This is the validity check behind course-schedule and build-order problems.',
    intuition:
      'A plain visited flag is not enough because a directed edge into a finished vertex is harmless. Three colours fix this: GRAY marks vertices on the current recursion stack, and an edge into a GRAY vertex is exactly a back edge.',
    steps: [
      'Allocate color[] initialised to WHITE.',
      'For each WHITE vertex, start a DFS.',
      'On entry, set color[u] = GRAY.',
      'For each neighbour v: if color[v] == GRAY, report a cycle.',
      'If color[v] == WHITE, recurse; a BLACK neighbour is already finished and safe.',
      'After the loop, set color[u] = BLACK to pop u off the active path.',
    ],
    codes: [{ caption: 'DFS with WHITE/GRAY/BLACK colours', code: CYCLE_DIRECTED }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis:
      'Each vertex changes colour twice and each edge is examined once, so O(V + E) time with O(V) for colours and recursion depth.',
    notes: [
      "Kahn's algorithm is an equivalent cycle test: fewer than V vertices emitted means a cycle.",
      'To print the cycle, keep a parent array and walk back from the GRAY vertex you hit.',
    ],
  }),

  'a8-topo-kahn': graph({
    problem:
      'Order the vertices of a directed graph so every edge points forward, and simultaneously detect whether the graph is not a DAG. This is the standard dependency/course-order routine.',
    intuition:
      'Indegree counts unmet prerequisites. Any vertex at indegree 0 can be emitted now; removing it decrements its successors, releasing them in turn. If the queue empties early, the leftovers sit in a cycle.',
    steps: [
      'Compute indeg[] by scanning every adjacency list.',
      'Enqueue every vertex with indegree 0.',
      'Poll u and append it to the order.',
      'For each successor v, decrement indeg[v] and enqueue v when it hits 0.',
      'Repeat until the queue is empty.',
      'If fewer than V vertices were emitted, the graph has a cycle.',
    ],
    codes: [{ caption: "Kahn's algorithm (BFS topological sort)", code: TOPO_KAHN }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis:
      'Building indegrees costs O(V + E), and each vertex is enqueued once while each edge is decremented once, so the total is O(V + E) with O(V) extra space.',
    notes: [
      'Swap the ArrayDeque for a PriorityQueue to get the lexicographically smallest order.',
      'The count check is the cheapest cycle detector you get for free here.',
    ],
  }),

  'a8-topo-dfs': graph({
    problem:
      'Produce a topological order of a DAG using depth-first search, reporting failure if a cycle exists. Useful when you already need DFS timings for other purposes.',
    intuition:
      'A vertex is pushed onto a stack only after every descendant has finished, so it always lands above them; popping the stack therefore yields reverse postorder, a valid topological order. Tracking in-stack state doubles as cycle detection.',
    steps: [
      'Keep state[] with UNVISITED / IN_STACK / DONE and an empty finish stack.',
      'Run DFS from each UNVISITED vertex.',
      'Mark u IN_STACK on entry.',
      'If a neighbour is IN_STACK, abort — the graph has a cycle.',
      'Recurse into UNVISITED neighbours.',
      'Mark u DONE and push u onto the finish stack.',
      'Pop the whole stack to read off the topological order.',
    ],
    codes: [{ caption: 'DFS topological sort (reverse postorder)', code: TOPO_DFS }],
    time: 'O(V + E)',
    space: 'O(V) for state, stack, and recursion',
    analysis:
      'One DFS pass visits each vertex and edge once for O(V + E), with O(V) space split between the state array, the finish stack, and recursion depth.',
    notes: [
      "Kahn's version is easier to reason about and needs no recursion; prefer it under deep-graph constraints.",
      'The same reverse-postorder stack is exactly what Kosaraju reuses in pass one.',
    ],
  }),

  'a8-shortest-path-dag': graph({
    problem:
      'Compute shortest (or longest) path distances from a source in a weighted DAG, where weights may be negative. Typical of project-scheduling and layered-DP problems.',
    intuition:
      'In topological order, every path into a vertex comes from earlier vertices, so once you reach u its distance is already final. A single relaxation sweep in that order therefore suffices — no priority queue and no repeated rounds.',
    steps: [
      'Topologically sort the DAG (Kahn is convenient).',
      'Set dist[] to INF and dist[src] = 0.',
      'Walk vertices in topological order.',
      'Skip any vertex still at INF — it is unreachable.',
      'Relax each outgoing edge: dist[v] = min(dist[v], dist[u] + w).',
      'Return dist[]; flip the comparison (or negate weights) for longest paths.',
    ],
    codes: [{ caption: 'Topological order + single relaxation sweep', code: SHORTEST_PATH_DAG }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis:
      'Sorting is O(V + E) and each edge is relaxed exactly once afterwards, so the whole routine is linear — strictly faster than Dijkstra on a DAG.',
    notes: [
      'Negative weights are fine here; only cycles break the argument, and a DAG has none.',
      'Longest path in a DAG is polynomial for this reason, unlike in general graphs.',
    ],
  }),

  'a8-dijkstra': graph({
    problem:
      'Find shortest path distances from a single source in a graph with non-negative edge weights. The workhorse for weighted routing, network latency, and minimum-cost grid problems.',
    intuition:
      'Always expand the unsettled vertex with the smallest tentative distance: with non-negative weights no later path can improve it. A binary heap supplies that minimum, and stale duplicate entries are skipped on poll instead of being decrease-keyed.',
    steps: [
      'Fill dist[] with INF (use long) and set dist[src] = 0.',
      'Push {0, src} into a PriorityQueue ordered by distance.',
      'Poll the smallest {d, u}.',
      'If d > dist[u], discard the entry — u is already settled more cheaply.',
      'Otherwise relax every edge (u, v, w): if d + w < dist[v], update dist[v] and push {dist[v], v}.',
      'Continue until the heap is empty; unreached vertices stay at INF.',
    ],
    codes: [{ caption: 'Lazy Dijkstra with binary heap', code: DIJKSTRA }],
    time: 'O((V + E) log V)',
    space: 'O(V + E)',
    analysis:
      'Each edge can insert at most one heap entry, so the heap holds O(E) items and every push/poll costs O(log E) = O(log V), giving O(E log V) overall.',
    notes: [
      'Never use Dijkstra with negative edges — a settled vertex could still be improved. Use Bellman-Ford instead.',
      'Use long for distances: 1e5 edges of weight 1e9 overflows int.',
      'Add a parent[] update alongside each relaxation to reconstruct the path.',
    ],
  }),

  'a8-bellman-ford': graph({
    problem:
      'Compute single-source shortest paths when edges may have negative weights, and detect whether a negative cycle is reachable from the source.',
    intuition:
      'After i full passes over the edge list, every shortest path using at most i edges is correct. A simple shortest path has at most V-1 edges, so V-1 passes finish the job and any further improvement proves a negative cycle.',
    steps: [
      'Set dist[] to INF and dist[src] = 0.',
      'Repeat V-1 times: relax every edge (u, v, w).',
      'Skip edges whose source is still INF so INF + w cannot leak in.',
      'Break early if a pass changes nothing — the fixed point is reached.',
      'Run one extra pass over all edges.',
      'If any edge still relaxes, report a negative cycle.',
    ],
    codes: [{ caption: 'Bellman-Ford with negative-cycle check', code: BELLMAN_FORD }],
    time: 'O(V · E)',
    space: 'O(V)',
    analysis:
      'V-1 relaxation rounds over E edges give O(V·E) time with only O(V) space for the distance array, since the edge list can be streamed.',
    notes: [
      'To find vertices with distance -infinity, mark everything reachable from a vertex that relaxes in the extra pass.',
      'SPFA (queue-based Bellman-Ford) is much faster in practice but has the same worst case.',
      'Use long distances: repeated negative relaxations overflow int quickly.',
    ],
  }),

  'a8-floyd-warshall': graph({
    problem:
      'Compute shortest distances between every pair of vertices in a dense weighted graph, allowing negative edges, and detect negative cycles from the diagonal.',
    intuition:
      'Think of k as permission: after processing k, dist[i][j] is the best path whose intermediate vertices all come from {0..k}. Adding one more allowed intermediate vertex per outer iteration builds up the full answer.',
    steps: [
      'Build an adjacency matrix: 0 on the diagonal, edge weight where present, INF otherwise.',
      'Loop k from 0 to V-1 in the OUTERMOST loop.',
      'For each i, skip the row when dist[i][k] is INF.',
      'For each j, skip when dist[k][j] is INF.',
      'Set dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]).',
      'After the loops, dist[i][i] < 0 for any i means a negative cycle exists.',
    ],
    codes: [{ caption: 'Floyd-Warshall all-pairs shortest paths', code: FLOYD_WARSHALL }],
    time: 'O(V³)',
    space: 'O(V²)',
    analysis:
      'Three nested loops over V give exactly V³ constant-time relaxations on an O(V²) matrix, which is practical up to roughly V ≈ 400-500.',
    notes: [
      'The k loop must be outermost; swapping loop order silently produces wrong answers.',
      'Use a moderate INF like 1e9 so INF + INF stays inside int.',
      'For sparse graphs with many queries, V runs of Dijkstra (or Johnson) beats V³.',
    ],
  }),

  'a8-0-1-bfs': graph({
    problem:
      'Find shortest distances when every edge weight is 0 or 1 — for example, counting the minimum number of "expensive" moves or wall breaks in a grid.',
    intuition:
      'A deque acts as a two-bucket priority queue: a 0-weight edge keeps the neighbour in the current distance layer, so push it to the front, while a 1-weight edge moves it to the next layer, so push it to the back. Distances then still come out in sorted order.',
    steps: [
      'Fill dist[] with a large value and set dist[src] = 0.',
      'Add the source to the front of an ArrayDeque.',
      'Poll from the front to get u.',
      'For each edge (u, v, w), check whether dist[u] + w improves dist[v].',
      'On improvement, update dist[v] and push v to the front if w == 0, else to the back.',
      'Continue until the deque is empty; the relax check filters stale entries.',
    ],
    codes: [{ caption: '0-1 BFS with a deque', code: ZERO_ONE_BFS }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis:
      'Each edge triggers at most one deque insertion and all deque operations are O(1), so the routine runs in linear time — a log factor faster than Dijkstra.',
    notes: [
      'Only weights 0 and 1 qualify; for a small weight range {0..k}, use dial/bucket Dijkstra instead.',
      'A vertex may be pushed more than once; the strict improvement test keeps the work linear.',
    ],
  }),

  'a8-mst-prim': graph({
    problem:
      'Build a minimum spanning tree of a connected weighted undirected graph by growing a single tree from an arbitrary start vertex, reporting the total weight.',
    intuition:
      'The cut property says the lightest edge crossing the boundary between the current tree and the rest is always in some MST. A priority queue keyed by edge weight hands you exactly that edge on every poll.',
    steps: [
      'Allocate inMst[] and push {0, startVertex} into a min-heap keyed by weight.',
      'Poll the lightest {w, u} entry.',
      'Skip u if it is already in the tree — that entry is stale.',
      'Add u to the tree and accumulate w.',
      'Push {weight, neighbour} for every edge from u to a vertex outside the tree.',
      'Stop when V vertices are taken; fewer means the graph is disconnected.',
    ],
    codes: [{ caption: "Prim's MST with a lazy priority queue", code: PRIM }],
    time: 'O(E log V)',
    space: 'O(V + E)',
    analysis:
      'Every edge is pushed at most once into a heap of O(E) entries, and each poll costs O(log E) = O(log V), so the total is O(E log V).',
    notes: [
      'Prim is the better choice on dense graphs; Kruskal wins when edges are already sorted or the graph is sparse.',
      'To output the actual edges, store {weight, to, from} in the heap and record from-to on acceptance.',
    ],
  }),

  'a8-mst-kruskal': graph({
    problem:
      'Build a minimum spanning tree (or forest) by taking edges in increasing weight order and keeping only those that connect two different components.',
    intuition:
      'Sort the edges globally and be greedy: the lightest edge that does not close a cycle is always safe. Union-Find answers "same component?" in near-constant time, which is the only test the greedy needs.',
    steps: [
      'Initialise DSU with each vertex as its own parent.',
      'Sort all edges by weight ascending.',
      'Iterate edges in that order.',
      'Call union(u, v); if it returns false the endpoints already share a component, so skip the edge.',
      'Otherwise accept the edge and add its weight to the total.',
      'Stop once V-1 edges are accepted; fewer at the end means the graph is disconnected.',
    ],
    codes: [{ caption: "Kruskal's MST with sorting + DSU", code: KRUSKAL }],
    time: 'O(E log E)',
    space: 'O(V + E)',
    analysis:
      'Sorting the edge list dominates at O(E log E); the E union-find operations add only O(E · α(V)), which is effectively linear.',
    notes: [
      'On a disconnected graph this naturally produces a minimum spanning forest.',
      'For a maximum spanning tree, sort descending and keep everything else identical.',
    ],
  }),

  'a8-union-find': graph({
    problem:
      'Maintain a partition of V elements under two operations — merge two sets and test whether two elements share a set — with near-constant amortised cost. The backbone of Kruskal, connectivity queries, and offline grouping problems.',
    intuition:
      'Each set is a tree identified by its root. Path compression flattens the tree during find, and union by rank always hangs the shorter tree under the taller one, so trees never get deep.',
    steps: [
      'Initialise parent[i] = i, rank[i] = 0, size[i] = 1.',
      'find(x): follow parents to the root, rewriting parent[x] to the root on the way back.',
      'union(a, b): find both roots and return false if they match.',
      'Attach the lower-rank root beneath the higher-rank root.',
      'Increment the rank only when both roots had equal rank.',
      'Update component count and subtree sizes on every successful union.',
    ],
    codes: [{ caption: 'DSU with path compression + union by rank', code: UNION_FIND }],
    time: 'O(α(V)) amortised per operation (effectively O(1))',
    space: 'O(V)',
    analysis:
      'With both path compression and union by rank, m operations on V elements cost O(m · α(V)), where α is the inverse Ackermann function and never exceeds 5 in practice.',
    notes: [
      'Using only one of the two optimisations degrades to O(log V) per operation.',
      'Always compare roots, never raw indices — parent[x] is not the set id.',
      'DSU cannot undo a union; for that you need a rollback DSU without path compression.',
    ],
  }),

  'a8-kosaraju': graph({
    problem:
      'Decompose a directed graph into strongly connected components, where every pair of vertices inside a component is mutually reachable. Two DFS passes give both the components and a topological order of the condensation.',
    intuition:
      'Finish times on the original graph rank components topologically. Reversing all edges destroys every link leaving a component, so a DFS started at the latest-finishing vertex can reach exactly its own component and nothing beyond it.',
    steps: [
      'Build the reversed adjacency list.',
      'Run DFS on the original graph, pushing each vertex onto a stack when it finishes.',
      'Reset the visited state and prepare comp[] filled with -1.',
      'Pop vertices off the finish stack in order.',
      'For each unassigned popped vertex, DFS the reversed graph and label everything reached with the next component id.',
      'Return comp[]; component ids follow a topological order of the condensation.',
    ],
    codes: [{ caption: 'Kosaraju two-pass SCC', code: KOSARAJU }],
    time: 'O(V + E)',
    space: 'O(V + E)',
    analysis:
      'Two DFS traversals plus building the reversed graph each cost O(V + E), and the reversed adjacency list plus the finish stack account for the O(V + E) space.',
    notes: [
      'Tarjan does the same work in one pass and without the reversed graph, but Kosaraju is easier to recall under pressure.',
      'Contracting each SCC yields a DAG — the usual setup for DP over components.',
    ],
  }),

  'a8-tarjan-scc': graph({
    problem:
      'Find all strongly connected components of a directed graph in a single DFS pass, without building the reversed graph.',
    intuition:
      'Keep disc[u] (discovery time) and low[u] (the smallest discovery time reachable from u using tree edges plus at most one back edge into the current stack). When low[u] equals disc[u], nothing in u\u2019s subtree escapes above u, so u roots an SCC and the stack above u is that component.',
    steps: [
      'Initialise disc[] to -1, an explicit stack, and onStack[].',
      'On entering u, set disc[u] = low[u] = timer++ and push u with onStack[u] = true.',
      'For an unvisited neighbour v: recurse, then low[u] = min(low[u], low[v]).',
      'For a visited neighbour still on the stack: low[u] = min(low[u], disc[v]).',
      'Ignore visited neighbours that are off the stack — they belong to a closed SCC.',
      'If low[u] == disc[u], pop the stack down to u and label those vertices as one SCC.',
    ],
    codes: [{ caption: 'Tarjan single-pass SCC with disc/low', code: TARJAN_SCC }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis:
      'A single DFS touches each vertex and edge once, and each vertex is pushed and popped exactly once, so time is O(V + E) with O(V) auxiliary arrays.',
    notes: [
      'Use disc[v] (not low[v]) for back edges; taking low[v] can merge two distinct components.',
      'The onStack test is essential — without it, edges into finished components corrupt low values.',
      'Component ids come out in reverse topological order of the condensation.',
    ],
  }),

  'a8-bridges': graph({
    problem:
      'Find every edge of a connected undirected graph whose removal increases the number of components. These critical edges are the single points of failure in a network.',
    intuition:
      'During DFS, an edge (u, v) to a child v is a bridge exactly when v\u2019s subtree has no back edge reaching u or any ancestor of u, i.e. low[v] > disc[u]. Skipping the incoming edge by id rather than by parent vertex keeps parallel edges correct.',
    steps: [
      'Store adjacency as {neighbour, edgeId} so both directions share an id.',
      'Initialise disc[] to -1 and a global timer.',
      'On entering u, set disc[u] = low[u] = timer++.',
      'Skip only the edge whose id matches the one used to enter u.',
      'For a tree edge to v: recurse, take low[u] = min(low[u], low[v]), and record (u, v) as a bridge when low[v] > disc[u].',
      'For a back edge: low[u] = min(low[u], disc[v]).',
      'Restart from every undiscovered vertex to cover all components.',
    ],
    codes: [{ caption: 'Bridge finding with disc/low and edge ids', code: BRIDGES }],
    time: 'O(V + E)',
    space: 'O(V + E)',
    analysis:
      'One DFS pass computes all low values in O(V + E), with O(V) arrays plus the O(E) adjacency structure carrying edge ids.',
    notes: [
      'Skipping by parent vertex wrongly hides parallel edges; skipping by edge id fixes it.',
      'Bridges use a strict low[v] > disc[u]; articulation points use >=.',
      'Contracting all non-bridge edges yields the bridge tree, handy for path queries.',
    ],
  }),

  'a8-articulation-points': graph({
    problem:
      'Find every vertex of an undirected graph whose removal disconnects the graph. These cut vertices are the critical routers or hubs of a network.',
    intuition:
      'For a non-root vertex u with DFS child v, if low[v] >= disc[u] then v\u2019s subtree cannot bypass u, so deleting u detaches it. The DFS root is special: it has no ancestor to route through, so it is a cut vertex precisely when it has more than one DFS child.',
    steps: [
      'Initialise disc[] to -1, low[], isCut[], and a timer.',
      'On entering u, set disc[u] = low[u] = timer++ and reset a child counter.',
      'Skip the parent vertex so the incoming edge is not mistaken for a back edge.',
      'For an unvisited neighbour v: increment children, recurse, and update low[u] = min(low[u], low[v]).',
      'Mark u as a cut vertex when u is not the root and low[v] >= disc[u].',
      'For a visited neighbour: low[u] = min(low[u], disc[v]).',
      'After the loop, mark the root as a cut vertex if it has two or more children.',
    ],
    codes: [{ caption: 'Articulation points with disc/low', code: ARTICULATION_POINTS }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis:
      'A single DFS computes disc and low for every vertex in O(V + E) time, using O(V) space for the arrays and recursion stack.',
    notes: [
      'The condition is >= for cut vertices but > for bridges — mixing them up is the classic bug.',
      'Do not forget the separate root rule; the general test never fires for the root.',
      'Grouping edges by the same low-link logic gives biconnected components.',
    ],
  }),

  'a8-bipartite': graph({
    problem:
      'Decide whether a graph can be 2-coloured so that no edge joins two vertices of the same colour, which is equivalent to having no odd-length cycle. Used to validate two-team, matching, and conflict-graph setups.',
    intuition:
      'BFS from each component and flip the colour on every step. Every vertex is forced by its predecessor, so the colouring is unique per component; hitting an edge between two same-coloured vertices means an odd cycle exists.',
    steps: [
      'Fill color[] with -1 to mark uncoloured vertices.',
      'For each uncoloured vertex, colour it 0 and start a BFS.',
      'Poll u and iterate its neighbours.',
      'Colour an uncoloured neighbour with color[u] ^ 1 and enqueue it.',
      'If a neighbour already has color[u], return false immediately.',
      'Return true once every component is coloured without conflict.',
    ],
    codes: [{ caption: 'BFS 2-colouring bipartite check', code: BIPARTITE }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis:
      'One BFS per component visits each vertex and edge once, giving O(V + E) time and O(V) space for the colour array and queue.',
    notes: [
      'Each component is independent — always loop over all vertices.',
      'DFS works equally well; only the traversal order changes.',
      'A self-loop makes the graph non-bipartite immediately.',
    ],
  }),

  'a8-connected-components': graph({
    problem:
      'Label every vertex of an undirected graph with a component id and count how many components exist. The base routine behind island counting, friend circles, and connectivity checks.',
    intuition:
      'Any vertex that is still unlabelled cannot be reachable from anything processed so far, so it opens a fresh component. One traversal from it labels the entire component, and the component label doubles as the visited marker.',
    steps: [
      'Fill comp[] with -1 and set count = 0.',
      'Scan vertices in order, skipping labelled ones.',
      'Label the new start with count and enqueue it.',
      'Poll u and label every unlabelled neighbour with count, enqueueing each.',
      'When the queue drains, increment count.',
      'Return comp[]; count is the number of components.',
    ],
    codes: [{ caption: 'BFS component labelling', code: CONNECTED_COMPONENTS }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis:
      'Across all components each vertex is enqueued once and each edge scanned twice, so the total remains O(V + E) with O(V) auxiliary space.',
    notes: [
      'Union-Find is the better tool when edges arrive online or components must be merged incrementally.',
      'For directed graphs, "connected components" means SCCs — use Tarjan or Kosaraju instead.',
    ],
  }),

  'a8-multi-source-bfs': graph({
    problem:
      'Compute, for every vertex, the distance to the nearest of several sources in one traversal — the rotting-oranges and nearest-gate family of problems.',
    intuition:
      'Seed the queue with all sources at distance 0 before the loop begins. That is exactly a BFS from a virtual super-source with zero-cost edges into every source, so layers still expand in distance order and each vertex is settled by its closest source.',
    steps: [
      'Fill dist[] with -1 as the unvisited marker.',
      'Push every source with dist = 0, guarding against duplicates.',
      'Only after all sources are seeded, start the BFS loop.',
      'Poll u and relax each unvisited neighbour to dist[u] + 1.',
      'Enqueue each newly labelled neighbour.',
      'Vertices left at -1 are unreachable from any source.',
    ],
    codes: [{ caption: 'Multi-source BFS with a pre-seeded queue', code: MULTI_SOURCE_BFS }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis:
      'The pre-seeding is O(S) and the traversal is a single BFS, so the total stays O(V + E) — far better than running one BFS per source.',
    notes: [
      'Seed all sources before polling; adding them inside the loop breaks the layer invariant.',
      'The final BFS level equals the answer for "time until everything is covered" problems.',
      'With non-uniform weights, use Dijkstra seeded with all sources instead.',
    ],
  }),

  'a8-ford-fulkerson': graph({
    problem:
      'Compute the maximum flow from a source to a sink in a capacitated directed graph. By max-flow min-cut this also gives the minimum cut and solves bipartite matching and vertex-disjoint path problems.',
    intuition:
      'Repeatedly find any source-to-sink path with spare capacity and push its bottleneck along it, adding reverse capacity so earlier decisions can be undone. Edmonds-Karp chooses the shortest such path via BFS, which makes the iteration count independent of the capacity values.',
    steps: [
      'Store capacities in cap[u][v]; this matrix becomes the residual graph.',
      'BFS from the source using only edges with cap > 0, recording parents.',
      'Stop when the sink is unreachable — the current flow is maximum.',
      'Walk the parent chain to find the bottleneck (minimum residual capacity).',
      'Subtract the bottleneck from each forward edge and add it to each reverse edge.',
      'Add the bottleneck to the total flow and repeat.',
    ],
    codes: [{ caption: 'Edmonds-Karp (BFS augmenting paths on a capacity matrix)', code: EDMONDS_KARP }],
    time: 'O(V · E²)',
    space: 'O(V²) for the capacity matrix',
    analysis:
      'BFS augmentation guarantees O(V·E) augmenting paths and each BFS on a matrix costs O(V²), so the practical bound is O(V·E²) and independent of capacity magnitudes.',
    notes: [
      'The reverse-capacity update is what makes the algorithm correct; without it, a greedy first path can lock in a suboptimal flow.',
      'Plain Ford-Fulkerson with DFS can loop proportionally to the capacities — always use BFS.',
      'Vertices reachable from the source in the final residual graph form one side of the minimum cut.',
      'For larger graphs, switch to Dinic with an edge-list residual graph.',
    ],
  }),

  'a8-hierholzer-algorithm': graph({
    problem:
      'Find an Eulerian circuit or path — a walk that uses every edge exactly once — in a directed graph, or report that none exists. The basis of de Bruijn sequence and reconstruct-itinerary problems.',
    intuition:
      'Walk greedily, deleting each edge as you use it. When you get stuck you are at the end of the final route, so record the vertex and back off; the detours you skipped get spliced in automatically. Reversing the record yields the Euler walk.',
    steps: [
      'Store out-edges in a deque per vertex so consuming an edge is O(1).',
      'Check degrees: every vertex needs out == in, except one +1 start and one -1 end for a path.',
      'Choose the +1 vertex as the start, or any vertex with an out-edge for a circuit.',
      'Push the start on a stack; look at the top vertex u.',
      'If u still has an unused edge, consume it and push the neighbour.',
      'If u has none, append u to the route and pop it.',
      'Reverse the route and verify it has edgeCount + 1 vertices, which also confirms connectivity.',
    ],
    codes: [{ caption: 'Hierholzer with per-vertex edge deques', code: HIERHOLZER }],
    time: 'O(V + E)',
    space: 'O(V + E)',
    analysis:
      'Each edge is consumed exactly once from its deque and each vertex is pushed once per incident edge, so the whole construction is linear in V + E.',
    notes: [
      'Deleting edges as you walk is essential — rescanning used edges makes it quadratic.',
      'The length check catches disconnected edge sets that pass the degree test.',
      'For undirected graphs, require even degree everywhere (or exactly two odd vertices) and mark both copies of an edge as used.',
    ],
  }),
}

/** Short one-liners for the appendix cheat sheet (all 25 core algos). */
const CORE_IDEAS: Record<string, string> = {
  'a8-bfs': 'FIFO queue; mark on enqueue; level order',
  'a8-dfs': 'Recurse deep; preorder on entry, postorder on return',
  'a8-iterative-dfs': 'Explicit LIFO stack; mark on pop',
  'a8-multi-source-bfs': 'Enqueue all sources at dist 0; joint BFS frontier',
  'a8-cycle-undirected': 'Seen neighbor ≠ parent ⇒ cycle',
  'a8-cycle-directed-dfs': 'Back edge to IN_STACK / GRAY vertex ⇒ cycle',
  'a8-topo-kahn': 'Repeatedly take indegree-0; leftover ⇒ cycle',
  'a8-topo-dfs': 'Reverse postorder; IN_STACK back edge ⇒ cycle',
  'a8-bfs-shortest-unweighted': 'First BFS discovery = min edge count',
  'a8-shortest-path-dag': 'Topo order, then one-pass edge relax',
  'a8-dijkstra': 'Lazy min-heap; skip stale dist entries',
  'a8-bellman-ford': 'Relax all edges V−1 times; Nth pass ⇒ neg cycle',
  'a8-floyd-warshall': 'DP via each intermediate k (k outer)',
  'a8-0-1-bfs': 'Deque: weight 0 → front, 1 → back',
  'a8-mst-prim': 'Grow tree by cheapest edge to new vertex (PQ)',
  'a8-mst-kruskal': 'Sort edges + DSU; skip same-component edges',
  'a8-union-find': 'Path compression + union by rank',
  'a8-connected-components': 'BFS/DFS from each unseen start; label comps',
  'a8-bridges': 'low[v] > disc[u] on tree edge u→v',
  'a8-articulation-points': 'Root ≥2 children, or low[v] ≥ disc[u]',
  'a8-kosaraju': 'Finish-order DFS, then DFS on reversed graph',
  'a8-tarjan-scc': 'One DFS; stack + low[u]==disc[u] pops SCC',
  'a8-bipartite': 'BFS/DFS 2-color; same-color edge ⇒ no',
  'a8-ford-fulkerson': 'BFS augmenting paths on residual (Edmonds–Karp)',
  'a8-hierholzer-algorithm': 'Consume unused edges; reverse post-walk',
}

export type CoreCheatRow = {
  number: string
  title: string
  family: string
  problem: string
  idea: string
  time: string
  space: string
}

function firstSentence(text: string | undefined, max = 110): string {
  if (!text) return '—'
  const cut = text.split(/(?<=\.)\s/)[0] ?? text
  return cut.length > max ? cut.slice(0, max - 1) + '…' : cut
}

/** Full appendix table — one row per core algorithm. */
export const CORE_GRAPH_CHEAT_SHEET: CoreCheatRow[] = CORE_GRAPH_ALGO_DEFS.map((def) => {
  const c = GRAPH_CORE_PACK[def.topicId]
  return {
    number: def.number,
    title: def.title,
    family: def.family,
    problem: firstSentence(c?.whatIsIt),
    idea: CORE_IDEAS[def.topicId] ?? firstSentence(c?.whyExists, 80),
    time: c?.complexity?.average || c?.complexity?.best || '—',
    space: c?.complexity?.space || '—',
  }
})

/** Decision rules covering every core family (not only shortest paths). */
export const CORE_GRAPH_DECISION_RULES: string[] = [
  'Level-order / unweighted layers → BFS; many simultaneous starts → multi-source BFS.',
  'Deep exploration / recursion structure → DFS (iterative if stack depth is a risk).',
  'Undirected cycle? → DFS/BFS + parent. Directed cycle? → 3-color / recursion-stack DFS (or Kahn leftover).',
  'DAG ordering / dependencies → Kahn or DFS topological sort.',
  'Unweighted shortest path → BFS. Weights only 0/1 → 0-1 BFS (deque).',
  'Weighted DAG shortest → topo + one-pass relax. Non-negative weights → Dijkstra.',
  'Negative weights / detect neg cycle → Bellman-Ford. All-pairs, small V → Floyd-Warshall.',
  'Dynamic connectivity / “same set?” merges → Union-Find (DSU).',
  'Count / label components → BFS or DFS from every unseen vertex.',
  'Connect all with min cost → MST (Kruskal if edge list; Prim if adj list / dense).',
  'Critical edge → Bridge (low > disc). Critical vertex → Articulation point (low ≥ disc / root rule).',
  'Directed mutual reachability → SCC (Kosaraju 2×DFS or Tarjan 1×DFS).',
  'Odd cycle / 2-colorable? → Bipartite check.',
  'Max s–t flow / min cut → Edmonds–Karp (BFS augmenting paths).',
  'Traverse every edge exactly once → Hierholzer (Euler path / circuit).',
]

export const CORE_GRAPH_SHORTEST_PATH_COMPARE = [
  ['BFS', 'Any', 'Unit (unweighted)', 'N/A'],
  ['Multi-source BFS', 'Any', 'Unit', 'N/A'],
  ['0-1 BFS', 'Any', '0 or 1', 'N/A'],
  ['DAG shortest', 'DAG', 'Any', 'No (acyclic)'],
  ['Dijkstra', 'Any', 'Non-negative', 'No'],
  ['Bellman-Ford', 'Any', 'Any', 'Detects'],
  ['Floyd-Warshall', 'Any', 'Any', 'Detects (dist[i][i]<0)'],
] as const

export const CORE_GRAPH_MST_COMPARE = [
  ['Prim', 'Grow from a node; PQ', 'O(E log V)', 'Adj-list / denser graphs'],
  ['Kruskal', 'Sort edges + DSU', 'O(E log E)', 'Sparse / edge-list graphs'],
] as const

export const CORE_GRAPH_SCC_COMPARE = [
  ['Kosaraju', '2 DFS', 'Finish order + reversed graph'],
  ['Tarjan', '1 DFS', 'Stack + low/disc; pops when low[u]==disc[u]'],
] as const

export function getCoreGraphAlgoContent(topicId: string): TopicContent | undefined {
  return GRAPH_CORE_PACK[topicId]
}
