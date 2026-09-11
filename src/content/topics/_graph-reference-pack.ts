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
    patterns: spec.patterns ?? [
      'Write down whether the graph is directed, weighted, and possibly disconnected.',
      'Choose the traversal state and invariant before writing the neighbor loop.',
    ],
    mistakes: spec.mistakes ?? [
      'Assuming vertex 0 reaches every vertex.',
      'Marking a vertex too late and consequently processing it more than once.',
    ],
    takeaways: spec.takeaways ?? [
      spec.problem,
      `Target complexity: ${spec.time} time and ${spec.space} auxiliary space.`,
      spec.intuition,
    ],
  })

const BFS = `import java.util.*;

class GraphBfs {
    static List<Integer> bfs(int start, List<List<Integer>> adj) {
        boolean[] seen = new boolean[adj.size()];
        List<Integer> order = new ArrayList<>();
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        seen[start] = true;
        queue.offer(start);

        while (!queue.isEmpty()) {
            int u = queue.poll();
            order.add(u);
            for (int v : adj.get(u)) {
                if (!seen[v]) {
                    seen[v] = true; // Mark when enqueued, not when removed.
                    queue.offer(v);
                }
            }
        }
        return order;
    }

    static List<Integer> bfsAll(List<List<Integer>> adj) {
        boolean[] seen = new boolean[adj.size()];
        List<Integer> order = new ArrayList<>();
        for (int start = 0; start < adj.size(); start++) {
            if (seen[start]) continue;
            ArrayDeque<Integer> queue = new ArrayDeque<>();
            seen[start] = true;
            queue.offer(start);
            while (!queue.isEmpty()) {
                int u = queue.poll();
                order.add(u);
                for (int v : adj.get(u)) {
                    if (!seen[v]) {
                        seen[v] = true;
                        queue.offer(v);
                    }
                }
            }
        }
        return order;
    }
}`

const DFS = `import java.util.*;

class GraphDfs {
    static List<Integer> dfs(int start, List<List<Integer>> adj) {
        boolean[] seen = new boolean[adj.size()];
        List<Integer> order = new ArrayList<>();
        visit(start, adj, seen, order);
        return order;
    }

    private static void visit(int u, List<List<Integer>> adj,
                              boolean[] seen, List<Integer> order) {
        seen[u] = true;
        order.add(u);
        for (int v : adj.get(u)) {
            if (!seen[v]) visit(v, adj, seen, order);
        }
    }

    static List<Integer> dfsAll(List<List<Integer>> adj) {
        boolean[] seen = new boolean[adj.size()];
        List<Integer> order = new ArrayList<>();
        for (int u = 0; u < adj.size(); u++) {
            if (!seen[u]) visit(u, adj, seen, order);
        }
        return order;
    }
}`

const ITERATIVE_DFS = `import java.util.*;

class IterativeDfs {
    static List<Integer> dfsAll(List<List<Integer>> adj) {
        boolean[] seen = new boolean[adj.size()];
        List<Integer> order = new ArrayList<>();
        for (int start = 0; start < adj.size(); start++) {
            if (seen[start]) continue;
            Deque<Integer> stack = new ArrayDeque<>();
            stack.push(start);
            while (!stack.isEmpty()) {
                int u = stack.pop();
                if (seen[u]) continue;
                seen[u] = true;
                order.add(u);
                // Reverse push preserves recursive order for a conventional adjacency list.
                List<Integer> next = adj.get(u);
                for (int i = next.size() - 1; i >= 0; i--) {
                    int v = next.get(i);
                    if (!seen[v]) stack.push(v);
                }
            }
        }
        return order;
    }
}`

const UNDIRECTED_DFS = `import java.util.*;

class UndirectedCycleDfs {
    static boolean hasCycle(List<List<Integer>> adj) {
        boolean[] seen = new boolean[adj.size()];
        for (int u = 0; u < adj.size(); u++) {
            if (!seen[u] && dfs(u, -1, adj, seen)) return true;
        }
        return false;
    }

    private static boolean dfs(int u, int parent, List<List<Integer>> adj,
                               boolean[] seen) {
        seen[u] = true;
        for (int v : adj.get(u)) {
            if (!seen[v]) {
                if (dfs(v, u, adj, seen)) return true;
            } else if (v != parent) {
                return true;
            }
        }
        return false;
    }
}`

const UNDIRECTED_ITERATIVE = `import java.util.*;

class UndirectedCycleIterative {
    static boolean hasCycle(List<List<Integer>> adj) {
        boolean[] seen = new boolean[adj.size()];
        for (int start = 0; start < adj.size(); start++) {
            if (seen[start]) continue;
            Deque<int[]> stack = new ArrayDeque<>();
            stack.push(new int[]{start, -1});
            seen[start] = true;
            while (!stack.isEmpty()) {
                int[] state = stack.pop();
                int u = state[0], parent = state[1];
                for (int v : adj.get(u)) {
                    if (!seen[v]) {
                        seen[v] = true;
                        stack.push(new int[]{v, u});
                    } else if (v != parent) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}`

const UNDIRECTED_BFS = `import java.util.*;

class UndirectedCycleBfs {
    static boolean hasCycle(List<List<Integer>> adj) {
        boolean[] seen = new boolean[adj.size()];
        for (int start = 0; start < adj.size(); start++) {
            if (seen[start]) continue;
            ArrayDeque<int[]> queue = new ArrayDeque<>();
            queue.offer(new int[]{start, -1});
            seen[start] = true;
            while (!queue.isEmpty()) {
                int[] state = queue.poll();
                int u = state[0], parent = state[1];
                for (int v : adj.get(u)) {
                    if (!seen[v]) {
                        seen[v] = true;
                        queue.offer(new int[]{v, u});
                    } else if (v != parent) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}`

const UNWEIGHTED_SHORTEST = `import java.util.*;

class UnweightedShortestPath {
    static int[] shortestPathUnweighted(int source, List<List<Integer>> adj) {
        int[] dist = new int[adj.size()];
        Arrays.fill(dist, -1); // -1 means unreachable.
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        dist[source] = 0;
        queue.offer(source);
        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int v : adj.get(u)) {
                if (dist[v] == -1) {
                    dist[v] = dist[u] + 1;
                    queue.offer(v);
                }
            }
        }
        return dist;
    }
}`

const SHORTEST_CYCLE = `import java.util.*;

class ShortestUndirectedCycle {
    static int shortestCycleLength(List<List<Integer>> adj) {
        int answer = Integer.MAX_VALUE;
        for (int source = 0; source < adj.size(); source++) {
            int[] dist = new int[adj.size()];
            int[] parent = new int[adj.size()];
            Arrays.fill(dist, -1);
            Arrays.fill(parent, -1);
            ArrayDeque<Integer> queue = new ArrayDeque<>();
            dist[source] = 0;
            queue.offer(source);
            while (!queue.isEmpty()) {
                int u = queue.poll();
                for (int v : adj.get(u)) {
                    if (dist[v] == -1) {
                        dist[v] = dist[u] + 1;
                        parent[v] = u;
                        queue.offer(v);
                    } else if (parent[u] != v) {
                        answer = Math.min(answer, dist[u] + dist[v] + 1);
                    }
                }
            }
        }
        return answer == Integer.MAX_VALUE ? -1 : answer;
    }
}`

const ALL_CYCLES = `import java.util.*;

class AllSimpleCycles {
    static Set<List<Integer>> allCycles(List<List<Integer>> adj) {
        Set<List<Integer>> cycles = new LinkedHashSet<>();
        for (int start = 0; start < adj.size(); start++) {
            boolean[] onPath = new boolean[adj.size()];
            List<Integer> path = new ArrayList<>();
            enumerate(start, start, adj, onPath, path, cycles);
        }
        return cycles;
    }

    private static void enumerate(int start, int u, List<List<Integer>> adj,
                                  boolean[] onPath, List<Integer> path,
                                  Set<List<Integer>> cycles) {
        onPath[u] = true;
        path.add(u);
        for (int v : adj.get(u)) {
            if (v == start && path.size() >= 3) {
                cycles.add(normalize(path));
            } else if (!onPath[v] && v >= start) {
                enumerate(start, v, adj, onPath, path, cycles);
            }
        }
        path.remove(path.size() - 1);
        onPath[u] = false;
    }

    private static List<Integer> normalize(List<Integer> cycle) {
        List<Integer> forward = new ArrayList<>(cycle);
        List<Integer> reverse = new ArrayList<>(cycle);
        Collections.reverse(reverse);
        return lexicographicallyLess(forward, reverse) ? forward : reverse;
    }

    private static boolean lexicographicallyLess(List<Integer> a, List<Integer> b) {
        for (int i = 0; i < a.size(); i++) {
            if (!a.get(i).equals(b.get(i))) return a.get(i) < b.get(i);
        }
        return false;
    }
}`

const KAHN = `import java.util.*;

class KahnTopologicalSort {
    static List<Integer> topologicalSort(List<List<Integer>> adj) {
        int[] indegree = new int[adj.size()];
        for (int u = 0; u < adj.size(); u++) {
            for (int v : adj.get(u)) indegree[v]++;
        }
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        for (int u = 0; u < adj.size(); u++) {
            if (indegree[u] == 0) queue.offer(u);
        }
        List<Integer> order = new ArrayList<>();
        while (!queue.isEmpty()) {
            int u = queue.poll();
            order.add(u);
            for (int v : adj.get(u)) {
                if (--indegree[v] == 0) queue.offer(v);
            }
        }
        if (order.size() != adj.size()) return Collections.emptyList();
        return order; // Empty for a cyclic directed graph.
    }
}`

const TOPO_DFS = `import java.util.*;

class DfsTopologicalSort {
    static List<Integer> topologicalSort(List<List<Integer>> adj) {
        int[] state = new int[adj.size()]; // 0=new, 1=active, 2=done
        Deque<Integer> stack = new ArrayDeque<>();
        for (int u = 0; u < adj.size(); u++) {
            if (state[u] == 0 && !dfs(u, adj, state, stack)) {
                return Collections.emptyList();
            }
        }
        List<Integer> order = new ArrayList<>();
        while (!stack.isEmpty()) order.add(stack.pop());
        return order;
    }

    private static boolean dfs(int u, List<List<Integer>> adj, int[] state,
                               Deque<Integer> stack) {
        state[u] = 1;
        for (int v : adj.get(u)) {
            if (state[v] == 1) return false;
            if (state[v] == 0 && !dfs(v, adj, state, stack)) return false;
        }
        state[u] = 2;
        stack.push(u); // Post-order: dependencies are pushed first.
        return true;
    }
}`

const DIRECTED_DFS = `import java.util.*;

class DirectedCycleDfs {
    static boolean hasCycle(List<List<Integer>> adj) {
        int[] state = new int[adj.size()]; // 0=new, 1=active, 2=done
        for (int u = 0; u < adj.size(); u++) {
            if (state[u] == 0 && dfs(u, adj, state)) return true;
        }
        return false;
    }

    private static boolean dfs(int u, List<List<Integer>> adj, int[] state) {
        state[u] = 1;
        for (int v : adj.get(u)) {
            if (state[v] == 1) return true; // Back edge to the active path.
            if (state[v] == 0 && dfs(v, adj, state)) return true;
        }
        state[u] = 2;
        return false;
    }
}`

const DIRECTED_KAHN_CYCLE = `import java.util.*;

class DirectedCycleKahn {
    static boolean hasCycle(List<List<Integer>> adj) {
        int[] indegree = new int[adj.size()];
        for (List<Integer> edges : adj) {
            for (int v : edges) indegree[v]++;
        }
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        for (int u = 0; u < adj.size(); u++) {
            if (indegree[u] == 0) queue.offer(u);
        }
        int removed = 0;
        while (!queue.isEmpty()) {
            int u = queue.poll();
            removed++;
            for (int v : adj.get(u)) {
                if (--indegree[v] == 0) queue.offer(v);
            }
        }
        return removed != adj.size();
    }
}`

const DAG_SHORTEST = `import java.util.*;

class DagShortestPath {
    static long[] shortestPath(int source, List<List<int[]>> adj) {
        boolean[] seen = new boolean[adj.size()];
        Deque<Integer> topo = new ArrayDeque<>();
        for (int u = 0; u < adj.size(); u++) {
            if (!seen[u]) topo(u, adj, seen, topo);
        }
        long inf = Long.MAX_VALUE / 4;
        long[] dist = new long[adj.size()];
        Arrays.fill(dist, inf);
        dist[source] = 0;
        while (!topo.isEmpty()) {
            int u = topo.pop();
            if (dist[u] == inf) continue;
            for (int[] edge : adj.get(u)) {
                int v = edge[0], weight = edge[1];
                dist[v] = Math.min(dist[v], dist[u] + weight);
            }
        }
        return dist;
    }

    private static void topo(int u, List<List<int[]>> adj, boolean[] seen,
                             Deque<Integer> order) {
        seen[u] = true;
        for (int[] edge : adj.get(u)) {
            if (!seen[edge[0]]) topo(edge[0], adj, seen, order);
        }
        order.push(u);
    }
}`

const DIJKSTRA = `import java.util.*;

class Dijkstra {
    static long[] shortestPath(int source, List<List<int[]>> adj) {
        long inf = Long.MAX_VALUE / 4;
        long[] dist = new long[adj.size()];
        Arrays.fill(dist, inf);
        dist[source] = 0;
        PriorityQueue<long[]> pq =
            new PriorityQueue<>((a, b) -> Long.compare(a[0], b[0]));
        pq.offer(new long[]{0, source});

        while (!pq.isEmpty()) {
            long[] current = pq.poll();
            long distance = current[0];
            int u = (int) current[1];
            if (distance != dist[u]) continue; // Stale heap entry.
            for (int[] edge : adj.get(u)) {
                int v = edge[0], weight = edge[1];
                if (weight < 0) throw new IllegalArgumentException("negative edge");
                long candidate = distance + weight;
                if (candidate < dist[v]) {
                    dist[v] = candidate;
                    pq.offer(new long[]{candidate, v});
                }
            }
        }
        return dist;
    }
}`

const PRIM = `import java.util.*;

class PrimMst {
    static long minimumSpanningTree(List<List<int[]>> adj) {
        if (adj.isEmpty()) return 0;
        boolean[] used = new boolean[adj.size()];
        PriorityQueue<int[]> pq =
            new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        pq.offer(new int[]{0, 0}); // {edge weight, destination}
        long total = 0;
        int vertices = 0;
        while (!pq.isEmpty()) {
            int[] item = pq.poll();
            int weight = item[0], u = item[1];
            if (used[u]) continue;
            used[u] = true;
            vertices++;
            total += weight;
            for (int[] edge : adj.get(u)) {
                int v = edge[0], w = edge[1];
                if (!used[v]) pq.offer(new int[]{w, v});
            }
        }
        if (vertices != adj.size()) throw new IllegalArgumentException("disconnected graph");
        return total;
    }
}`

const KOSARAJU = `import java.util.*;

class KosarajuScc {
    static List<List<Integer>> components(List<List<Integer>> adj) {
        int n = adj.size();
        boolean[] seen = new boolean[n];
        Deque<Integer> finish = new ArrayDeque<>();
        for (int u = 0; u < n; u++) {
            if (!seen[u]) finishDfs(u, adj, seen, finish);
        }
        List<List<Integer>> reverse = new ArrayList<>();
        for (int u = 0; u < n; u++) reverse.add(new ArrayList<>());
        for (int u = 0; u < n; u++) {
            for (int v : adj.get(u)) reverse.get(v).add(u);
        }
        Arrays.fill(seen, false);
        List<List<Integer>> result = new ArrayList<>();
        while (!finish.isEmpty()) {
            int u = finish.pop();
            if (seen[u]) continue;
            List<Integer> component = new ArrayList<>();
            collect(u, reverse, seen, component);
            result.add(component);
        }
        return result;
    }

    private static void finishDfs(int u, List<List<Integer>> adj,
                                  boolean[] seen, Deque<Integer> finish) {
        seen[u] = true;
        for (int v : adj.get(u)) {
            if (!seen[v]) finishDfs(v, adj, seen, finish);
        }
        finish.push(u);
    }

    private static void collect(int u, List<List<Integer>> reverse,
                                boolean[] seen, List<Integer> component) {
        seen[u] = true;
        component.add(u);
        for (int v : reverse.get(u)) {
            if (!seen[v]) collect(v, reverse, seen, component);
        }
    }
}`

const BELLMAN_FORD = `import java.util.*;

class BellmanFord {
    record Edge(int from, int to, int weight) {}

    static Optional<long[]> shortestPath(int vertices, int source,
                                         List<Edge> edges) {
        long inf = Long.MAX_VALUE / 4;
        long[] dist = new long[vertices];
        Arrays.fill(dist, inf);
        dist[source] = 0;
        for (int pass = 1; pass < vertices; pass++) {
            boolean changed = false;
            for (Edge edge : edges) {
                if (dist[edge.from()] == inf) continue;
                long candidate = dist[edge.from()] + edge.weight();
                if (candidate < dist[edge.to()]) {
                    dist[edge.to()] = candidate;
                    changed = true;
                }
            }
            if (!changed) break;
        }
        for (Edge edge : edges) {
            if (dist[edge.from()] != inf
                    && dist[edge.from()] + edge.weight() < dist[edge.to()]) {
                return Optional.empty(); // Reachable negative cycle.
            }
        }
        return Optional.of(dist);
    }
}`

const ARTICULATION = `import java.util.*;

class ArticulationPoints {
    private int timer;

    Set<Integer> find(List<List<Integer>> adj) {
        int n = adj.size();
        int[] disc = new int[n], low = new int[n];
        boolean[] isArticulation = new boolean[n];
        Arrays.fill(disc, -1);
        for (int u = 0; u < n; u++) {
            if (disc[u] == -1) dfs(u, -1, adj, disc, low, isArticulation);
        }
        Set<Integer> result = new LinkedHashSet<>();
        for (int u = 0; u < n; u++) {
            if (isArticulation[u]) result.add(u);
        }
        return result;
    }

    private void dfs(int u, int parent, List<List<Integer>> adj, int[] disc,
                     int[] low, boolean[] isArticulation) {
        disc[u] = low[u] = timer++;
        int children = 0;
        for (int v : adj.get(u)) {
            if (v == parent) continue;
            if (disc[v] == -1) {
                children++;
                dfs(v, u, adj, disc, low, isArticulation);
                low[u] = Math.min(low[u], low[v]);
                if (parent != -1 && low[v] >= disc[u]) isArticulation[u] = true;
            } else {
                low[u] = Math.min(low[u], disc[v]);
            }
        }
        if (parent == -1 && children > 1) isArticulation[u] = true;
    }
}`

const BRIDGES = `import java.util.*;

class Bridges {
    private int timer;

    List<int[]> find(List<List<Integer>> adj) {
        int[] disc = new int[adj.size()], low = new int[adj.size()];
        Arrays.fill(disc, -1);
        List<int[]> bridges = new ArrayList<>();
        for (int u = 0; u < adj.size(); u++) {
            if (disc[u] == -1) dfs(u, -1, adj, disc, low, bridges);
        }
        return bridges;
    }

    private void dfs(int u, int parent, List<List<Integer>> adj, int[] disc,
                     int[] low, List<int[]> bridges) {
        disc[u] = low[u] = timer++;
        for (int v : adj.get(u)) {
            if (v == parent) continue;
            if (disc[v] == -1) {
                dfs(v, u, adj, disc, low, bridges);
                low[u] = Math.min(low[u], low[v]);
                if (low[v] > disc[u]) bridges.add(new int[]{u, v});
            } else {
                low[u] = Math.min(low[u], disc[v]);
            }
        }
    }
}`

const TARJAN_SCC = `import java.util.*;

class TarjanScc {
    private int timer;
    private final Deque<Integer> stack = new ArrayDeque<>();

    List<List<Integer>> components(List<List<Integer>> adj) {
        int n = adj.size();
        int[] disc = new int[n], low = new int[n];
        boolean[] onStack = new boolean[n];
        Arrays.fill(disc, -1);
        List<List<Integer>> result = new ArrayList<>();
        for (int u = 0; u < n; u++) {
            if (disc[u] == -1) dfs(u, adj, disc, low, onStack, result);
        }
        return result;
    }

    private void dfs(int u, List<List<Integer>> adj, int[] disc, int[] low,
                     boolean[] onStack, List<List<Integer>> result) {
        disc[u] = low[u] = timer++;
        stack.push(u);
        onStack[u] = true;
        for (int v : adj.get(u)) {
            if (disc[v] == -1) {
                dfs(v, adj, disc, low, onStack, result);
                low[u] = Math.min(low[u], low[v]);
            } else if (onStack[v]) {
                low[u] = Math.min(low[u], disc[v]);
            }
        }
        if (low[u] == disc[u]) {
            List<Integer> component = new ArrayList<>();
            int v;
            do {
                v = stack.pop();
                onStack[v] = false;
                component.add(v);
            } while (v != u);
            result.add(component);
        }
    }
}`

const KRUSKAL = `import java.util.*;

class KruskalMst {
    record Edge(int u, int v, int weight) {}

    static long minimumSpanningTree(int vertices, List<Edge> edges) {
        edges.sort((a, b) -> Integer.compare(a.weight(), b.weight()));
        Dsu dsu = new Dsu(vertices);
        long total = 0;
        int chosen = 0;
        for (Edge edge : edges) {
            if (dsu.union(edge.u(), edge.v())) {
                total += edge.weight();
                if (++chosen == vertices - 1) break;
            }
        }
        if (chosen != vertices - 1) throw new IllegalArgumentException("disconnected graph");
        return total;
    }

    static class Dsu {
        private final int[] parent;
        private final int[] rank;

        Dsu(int n) {
            parent = new int[n];
            rank = new int[n];
            for (int i = 0; i < n; i++) parent[i] = i;
        }

        int find(int x) {
            if (parent[x] != x) parent[x] = find(parent[x]);
            return parent[x];
        }

        boolean union(int a, int b) {
            int rootA = find(a), rootB = find(b);
            if (rootA == rootB) return false;
            if (rank[rootA] < rank[rootB]) parent[rootA] = rootB;
            else if (rank[rootA] > rank[rootB]) parent[rootB] = rootA;
            else {
                parent[rootB] = rootA;
                rank[rootA]++;
            }
            return true;
        }
    }
}`

const FLOYD_WARSHALL = `import java.util.*;

class FloydWarshall {
    static long[][] allPairs(long[][] input, long inf) {
        int n = input.length;
        long[][] dist = new long[n][n];
        for (int i = 0; i < n; i++) dist[i] = Arrays.copyOf(input[i], n);
        for (int i = 0; i < n; i++) dist[i][i] = Math.min(dist[i][i], 0);
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                if (dist[i][k] == inf) continue;
                for (int j = 0; j < n; j++) {
                    if (dist[k][j] == inf) continue;
                    dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
        // A negative dist[i][i] means a negative cycle is reachable through i.
        return dist;
    }
}`

const BIPARTITE_BFS = `import java.util.*;

class BipartiteBfs {
    static boolean isBipartite(List<List<Integer>> adj) {
        int[] color = new int[adj.size()];
        Arrays.fill(color, -1);
        for (int start = 0; start < adj.size(); start++) {
            if (color[start] != -1) continue;
            ArrayDeque<Integer> queue = new ArrayDeque<>();
            color[start] = 0;
            queue.offer(start);
            while (!queue.isEmpty()) {
                int u = queue.poll();
                for (int v : adj.get(u)) {
                    if (color[v] == -1) {
                        color[v] = color[u] ^ 1;
                        queue.offer(v);
                    } else if (color[v] == color[u]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}`

const BIPARTITE_DFS = `import java.util.*;

class BipartiteDfs {
    static boolean isBipartite(List<List<Integer>> adj) {
        int[] color = new int[adj.size()];
        Arrays.fill(color, -1);
        for (int u = 0; u < adj.size(); u++) {
            if (color[u] == -1 && !color(u, 0, adj, color)) return false;
        }
        return true;
    }

    private static boolean color(int u, int value, List<List<Integer>> adj,
                                 int[] colors) {
        colors[u] = value;
        for (int v : adj.get(u)) {
            if (colors[v] == -1) {
                if (!color(v, value ^ 1, adj, colors)) return false;
            } else if (colors[v] == value) {
                return false;
            }
        }
        return true;
    }
}`

const ZERO_ONE_BFS = `import java.util.*;

class ZeroOneBfs {
    static int[] shortestPath(int source, List<List<int[]>> adj) {
        int[] dist = new int[adj.size()];
        Arrays.fill(dist, Integer.MAX_VALUE);
        Deque<Integer> deque = new ArrayDeque<>();
        dist[source] = 0;
        deque.offerFirst(source);
        while (!deque.isEmpty()) {
            int u = deque.pollFirst();
            for (int[] edge : adj.get(u)) {
                int v = edge[0], weight = edge[1];
                if (weight != 0 && weight != 1) {
                    throw new IllegalArgumentException("weights must be 0 or 1");
                }
                if (dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                    if (weight == 0) deque.offerFirst(v);
                    else deque.offerLast(v);
                }
            }
        }
        return dist;
    }
}`

const traversalNotes = [
  'The adjacency list is 0-indexed.',
  'For an undirected graph, store every edge in both directions.',
]

const topoSteps = [
  'Compute every vertex indegree by scanning all directed edges.',
  'Enqueue every zero-indegree vertex.',
  'Remove a vertex, append it to the order, and decrement its outgoing neighbors.',
  'Enqueue a neighbor exactly when its indegree becomes zero.',
  'If fewer than V vertices were removed, report a directed cycle.',
]

const kahnEntry = (): TopicContent =>
  graph({
    problem: 'Produce a topological ordering of a directed acyclic graph and detect when no such ordering exists.',
    intuition: 'A zero-indegree vertex has no unmet prerequisite, so repeatedly removing one simulates completing available work.',
    steps: topoSteps,
    codes: [{ caption: 'Kahn topological sort', code: KAHN }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Indegrees inspect each edge once, and each vertex enters and leaves the queue once. The indegree array, queue, and result hold O(V) values.',
    notes: ['Multiple valid orders may exist; a priority queue can choose the lexicographically smallest one.'],
    patterns: ['Prerequisite scheduling with directed edges.', 'Need both a valid order and cycle detection.'],
    mistakes: ['Reversing the prerequisite edge direction.', 'Returning a partial order when its size is less than V.'],
    takeaways: ['Kahn repeatedly removes zero-indegree vertices.', 'A processed count below V proves a directed cycle.', 'Time O(V + E); space O(V).'],
  })

const articulationEntry = (): TopicContent =>
  graph({
    problem: 'Find every vertex whose removal increases the number of connected components in an undirected graph.',
    intuition: 'A DFS child subtree is trapped below u when it has no back edge above u: low[child] >= disc[u]. The DFS root is special and needs at least two children.',
    steps: ['Initialize discovery times to -1.', 'DFS every component while assigning disc and low times.', 'Propagate child low values after recursion.', 'Mark a non-root u when low[v] >= disc[u].', 'Mark a root only when it has more than one DFS child.'],
    codes: [{ caption: 'Tarjan articulation points', code: ARTICULATION }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'DFS visits every vertex and examines each undirected edge twice. Discovery, low, result flags, and recursion use O(V) auxiliary space.',
    notes: ['Parallel edges require edge IDs rather than blindly skipping every edge to the parent vertex.'],
    patterns: ['Removal/connectivity questions in undirected graphs.', 'DFS discovery time plus low-link value.'],
    mistakes: ['Using low[v] > disc[u] instead of >= for articulation points.', 'Applying the non-root rule to the DFS root.'],
    takeaways: ['Non-root AP condition: low[child] >= disc[u].', 'Root AP condition: more than one DFS child.', 'Run DFS from every component.'],
  })

const bridgeEntry = (): TopicContent =>
  graph({
    problem: 'Find every undirected edge whose removal disconnects its component.',
    intuition: 'A DFS tree edge u-v is a bridge exactly when v’s subtree cannot reach u or an ancestor of u, expressed by low[v] > disc[u].',
    steps: ['Assign discovery and low times during DFS.', 'Ignore the one tree edge back to the parent.', 'Use visited-neighbor discovery times as back edges.', 'After child v returns, merge low[v] into low[u].', 'Record u-v when low[v] > disc[u].'],
    codes: [{ caption: 'Tarjan bridge finder', code: BRIDGES }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'A single DFS scans each adjacency entry once. Arrays, recursion, and at most V-1 reported DFS-tree bridges use O(V) auxiliary space.',
    notes: ['Use edge IDs for multigraphs so a parallel parent edge remains a valid back edge.'],
    patterns: ['Critical network links.', 'Low-link condition stricter than articulation-point condition.'],
    mistakes: ['Using >= instead of >.', 'Updating low[u] with low[v] for a back edge instead of disc[v].'],
    takeaways: ['Bridge condition: low[child] > disc[parent].', 'Only DFS tree edges can be bridges.', 'Time O(V + E).'],
  })

export const GRAPH_REFERENCE_CONTENT: Record<string, TopicContent> = {
  'a8-bfs': graph({
    problem: 'Traverse all vertices reachable from a start in level order, with bfsAll covering disconnected graphs.',
    intuition: 'A FIFO queue expands the current frontier before the next frontier, so vertices are discovered by increasing edge count.',
    steps: ['Mark the start before enqueueing it.', 'Remove the queue front and process it.', 'Enqueue each unseen neighbor and mark it immediately.', 'Repeat until the queue is empty.', 'For bfsAll, start another BFS from every still-unseen vertex.'],
    codes: [{ caption: 'BFS and disconnected BFS', code: BFS }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Each vertex is enqueued at most once and every adjacency entry is inspected once. Seen, queue, and output each require at most O(V) space.',
    notes: traversalNotes,
    patterns: ['Minimum edge-count layers.', 'Connected components and level-order exploration.'],
    mistakes: ['Marking on dequeue, which permits duplicate enqueues.', 'Running only from vertex 0 on a disconnected graph.'],
    takeaways: ['FIFO order creates graph layers.', 'Mark vertices when enqueued.', 'BFS over all components is O(V + E).'],
  }),
  'a8-dfs': graph({
    problem: 'Traverse deeply along each branch using recursive DFS, including every disconnected component with dfsAll.',
    intuition: 'Recursion stores the unfinished path; finishing a call means its reachable unseen subgraph has been explored.',
    steps: ['Mark and process u on entry.', 'Recurse into every unseen neighbor.', 'Return after all neighbors are handled.', 'Loop over all vertices to start DFS in unseen components.'],
    codes: [{ caption: 'Recursive DFS and dfsAll', code: DFS }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Each vertex is entered once and all adjacency entries are scanned once. Seen, output, and a worst-case depth-V call stack use O(V).',
    notes: [...traversalNotes, 'Use iterative DFS when recursion depth can exceed the JVM stack.'],
    patterns: ['Reachability, components, backtracking, and post-order.', 'Problems needing entry/exit events.'],
    mistakes: ['Marking after recursing.', 'Ignoring stack-overflow risk on a long chain.'],
    takeaways: ['DFS explores one branch before siblings.', 'Entry and exit timing enable many graph algorithms.', 'Time O(V + E).'],
  }),
  'a8-iterative-dfs': graph({
    problem: 'Perform depth-first traversal without recursion, including disconnected components.',
    intuition: 'An explicit LIFO stack replaces the JVM call stack and gives direct control over push order.',
    steps: ['Push an unseen component start.', 'Pop a vertex and skip it if already processed.', 'Mark and process it.', 'Push unseen neighbors in reverse order when recursive-like output order matters.'],
    codes: [{ caption: 'Iterative DFS with Deque stack', code: ITERATIVE_DFS }],
    time: 'O(V + E)',
    space: 'O(V + E)',
    analysis: 'Vertices are processed once. With mark-on-pop, the same vertex can be pushed through several edges, so the explicit stack may hold O(E); marking on push can reduce duplicates.',
    notes: ['Use Deque as the preferred modern stack API; java.util.Stack also works but is legacy synchronized code.'],
    patterns: ['Deep graphs where recursion is unsafe.', 'Traversal requiring explicit stack states.'],
    mistakes: ['Expecting recursive order without reversing neighbor pushes.', 'Processing a popped duplicate twice.'],
    takeaways: ['A LIFO stack emulates DFS.', 'Push order controls traversal order.', 'Guard against duplicate stack entries.'],
  }),
  'a8-cycle-undirected': graph({
    problem: 'Detect a cycle in any component of an undirected graph using recursive DFS, iterative DFS, or BFS.',
    intuition: 'The edge back to the traversal parent is expected; an edge to any other already-seen vertex closes a cycle.',
    steps: ['Start a traversal from every unseen vertex.', 'Carry the parent with each traversal state.', 'Mark a vertex before scheduling its neighbors.', 'For each seen neighbor, return true only when it differs from the parent.', 'Return false after all components finish.'],
    codes: [
      { caption: 'Recursive DFS plus parent', code: UNDIRECTED_DFS },
      { caption: 'Iterative DFS plus parent', code: UNDIRECTED_ITERATIVE },
      { caption: 'BFS plus parent', code: UNDIRECTED_BFS },
    ],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'All three methods visit each vertex once and scan both stored directions of each edge once. Seen plus recursion, stack, or queue is O(V).',
    notes: ['For multigraphs, identify the parent edge by edge ID so parallel edges are handled correctly.'],
    patterns: ['Undirected cycle detection always needs parent context.', 'Any traversal order works when the invariant is preserved.'],
    mistakes: ['Treating the parent edge as a cycle.', 'Checking only the component containing vertex 0.'],
    takeaways: ['Seen neighbor other than parent means a cycle.', 'DFS and BFS have the same asymptotic cost.', 'Scan every component.'],
  }),
  'a8-cycle-undirected-dfs': graph({
    problem: 'Detect an undirected cycle with recursive DFS and a parent parameter.',
    intuition: 'During DFS, a visited neighbor that is not the edge we arrived on reconnects the current tree to an earlier vertex.',
    steps: ['DFS from each unseen component root with parent -1.', 'Mark u on entry.', 'Recurse into unseen neighbors with parent u.', 'Return true for a seen neighbor v when v != parent.'],
    codes: [{ caption: 'Recursive DFS parent method', code: UNDIRECTED_DFS }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Each vertex is marked once and every adjacency entry is examined once; seen and recursion can each grow to V.',
    notes: ['This is for undirected graphs; directed graphs need active-path state.'],
    patterns: ['Undirected graph plus recursive traversal.', 'Need only a boolean cycle answer.'],
    mistakes: ['Omitting the parent argument.', 'Returning false after one acyclic component without checking others.'],
    takeaways: ['Carry parent through DFS.', 'Ignore only the arrival edge.', 'Time O(V + E).'],
  }),
  'a8-cycle-undirected-bfs': graph({
    problem: 'Detect an undirected cycle with BFS states containing vertex and parent.',
    intuition: 'The BFS tree explains one already-seen adjacency—the parent edge. Any different seen neighbor proves an alternate route and therefore a cycle.',
    steps: ['Enqueue each unseen component root with parent -1.', 'Mark vertices when enqueued.', 'For unseen neighbors, enqueue {neighbor, u}.', 'For a seen neighbor unequal to parent, return true.'],
    codes: [{ caption: 'BFS parent method', code: UNDIRECTED_BFS }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Each vertex enters the queue once and every edge is scanned from both ends. The queue and seen array hold O(V) state.',
    notes: ['The pair is represented as int[]{vertex, parent}.'],
    patterns: ['Prefer BFS when the surrounding problem already uses layers.', 'Undirected cycle requires parent state.'],
    mistakes: ['Marking only when dequeued.', 'Confusing the parent with an arbitrary previously visited neighbor.'],
    takeaways: ['Queue entries carry parent.', 'Mark on enqueue.', 'A non-parent seen neighbor closes a cycle.'],
  }),
  'a8-bfs-shortest-unweighted': graph({
    problem: 'Return the shortest number of edges from a source to every vertex, using -1 for unreachable vertices.',
    intuition: 'BFS first discovers each vertex through the smallest possible layer, so its first assigned distance is optimal.',
    steps: ['Fill dist with -1 and set dist[source] to 0.', 'Enqueue the source.', 'For each dequeued u, discover every neighbor whose distance is -1.', 'Assign dist[v] = dist[u] + 1 and enqueue v.', 'Return dist after the queue empties.'],
    codes: [{ caption: 'Unweighted shortest distances', code: UNWEIGHTED_SHORTEST }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'A distance changes from -1 once, so each vertex is queued once; adjacency scanning costs O(E), and dist plus queue costs O(V).',
    notes: ['For path reconstruction, also store parent[v] = u at first discovery.'],
    patterns: ['Unit-weight shortest path.', 'Grid moves where every move has equal cost.'],
    mistakes: ['Using DFS for shortest edge count.', 'Reassigning a distance after first BFS discovery.'],
    takeaways: ['BFS is shortest path for unit weights.', '-1 cleanly represents unreachable.', 'First discovery is final.'],
  }),
  'a8-print-shortest-cycle': graph({
    problem: 'Find the length of the shortest cycle in an undirected unweighted graph, or -1 if no cycle exists.',
    intuition: 'Run BFS from every source; when an edge joins two discovered vertices that are not parent-child, their BFS-tree paths plus that edge form a cycle.',
    steps: ['For every source, reset distance and parent arrays.', 'Run BFS and assign shortest source distances.', 'On a non-parent edge u-v, form candidate dist[u] + dist[v] + 1.', 'Keep the global minimum.', 'Return -1 if no candidate was found.'],
    codes: [{ caption: 'Shortest undirected cycle', code: SHORTEST_CYCLE }],
    time: 'O(V(V + E))',
    space: 'O(V)',
    analysis: 'Each of V BFS runs costs O(V + E). Distances, parents, and the queue are reused per run and occupy O(V).',
    notes: ['A girth algorithm can be pruned, but this baseline is simple and reliable for moderate graphs.'],
    patterns: ['Shortest cycle in an unweighted undirected graph.', 'Repeated-source BFS.'],
    mistakes: ['Counting the immediate parent edge as a 2-cycle.', 'Returning only the first cycle found.'],
    takeaways: ['BFS from every source finds graph girth.', 'Candidate length is dist[u] + dist[v] + 1.', 'Baseline time is O(V(V + E)).'],
  }),
  'a8-print-all-cycles': graph({
    problem: 'Enumerate all simple cycles in an undirected graph and deduplicate rotations and reverse directions.',
    intuition: 'Backtracking maintains a simple current path; returning to its chosen minimum start closes a cycle, and canonical orientation makes equal cycles share one Set key.',
    steps: ['Choose each vertex as a potential minimum cycle vertex.', 'DFS with an onPath array and mutable path.', 'Only continue to vertices at least as large as start to remove rotations.', 'On returning to start with at least three vertices, normalize direction.', 'Backtrack by removing u and clearing onPath[u].'],
    codes: [{ caption: 'Backtracking with normalized Set keys', code: ALL_CYCLES }],
    time: 'O((V + E) + C · V)',
    space: 'O(V + C · V)',
    analysis: 'Enumeration is output-sensitive: C simple cycles may itself be exponential. Normalizing and storing each cycle can cost O(V), while path state costs O(V).',
    notes: ['This template assumes a simple undirected graph. Listing all cycles is inherently exponential in dense graphs.'],
    patterns: ['Explicitly list every simple cycle.', 'Backtracking plus canonical representation.'],
    mistakes: ['Claiming polynomial time despite exponentially many outputs.', 'Mutating a List after inserting it into a Set.'],
    takeaways: ['Cycle enumeration is output-sensitive.', 'Canonicalize rotation and direction.', 'Copy cycles before storing them.'],
  }),
  'a8-topological-sorting': kahnEntry(),
  'a8-topo-kahn': kahnEntry(),
  'a8-topo-dfs': graph({
    problem: 'Topologically sort a directed acyclic graph using DFS post-order, returning empty when a cycle exists.',
    intuition: 'A vertex is finished only after all outgoing dependencies are finished, so reversing finish order places each vertex before its outgoing neighbors.',
    steps: ['Maintain states new, active, and done.', 'DFS from every new vertex.', 'Reject an edge to an active vertex as a directed cycle.', 'Push u only after all neighbors finish.', 'Pop the stack to obtain topological order.'],
    codes: [{ caption: 'DFS post-order topological sort', code: TOPO_DFS }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Three-state DFS enters each vertex once and scans each edge once. State, recursion, and the order stack use O(V).',
    notes: ['Without the active state, post-order alone would silently produce an invalid order on cyclic input.'],
    patterns: ['Need post-order for later DAG dynamic programming.', 'Cycle check and ordering in one DFS.'],
    mistakes: ['Forgetting to reverse finish order.', 'Using only a boolean visited array and missing cycles.'],
    takeaways: ['Reverse DFS finish order gives topo order.', 'An active-to-active edge is a cycle.', 'Valid only for DAGs.'],
  }),
  'a8-cycle-detection': graph({
    problem: 'Detect a cycle in a directed graph using either three-state DFS or Kahn’s processed count.',
    intuition: 'DFS detects an edge into the active recursion path; Kahn detects vertices trapped with positive indegree after every removable vertex is processed.',
    steps: ['DFS option: mark a vertex active on entry.', 'An edge to active state is a back edge and cycle.', 'Mark the vertex done on exit.', 'Kahn option: repeatedly remove zero-indegree vertices.', 'A processed count different from V means a cycle remains.'],
    codes: [
      { caption: 'Directed cycle: three-state DFS', code: DIRECTED_DFS },
      { caption: 'Directed cycle: Kahn count', code: DIRECTED_KAHN_CYCLE },
    ],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Either approach processes each vertex and edge a constant number of times. State plus recursion, or indegree plus queue, is O(V).',
    notes: ['The undirected parent rule does not work for directed graphs.'],
    patterns: ['Dependency cycles.', 'Choose DFS for an active-path witness or Kahn alongside topological sorting.'],
    mistakes: ['Treating every edge to a visited directed vertex as a cycle.', 'Checking Kahn queue emptiness instead of final processed count.'],
    takeaways: ['Directed DFS needs three states.', 'Kahn detects cycles when removed != V.', 'Both run in O(V + E).'],
  }),
  'a8-cycle-directed-dfs': graph({
    problem: 'Detect a directed cycle with new, active, and done DFS states.',
    intuition: 'Only an edge to an active vertex returns to the current DFS path; an edge to a done vertex is a harmless cross or forward edge.',
    steps: ['Start DFS from each new vertex.', 'Set state[u] to active.', 'Return true on an active neighbor.', 'Recurse into new neighbors.', 'Set state[u] to done when all edges finish.'],
    codes: [{ caption: 'Three-state directed DFS', code: DIRECTED_DFS }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Every vertex changes state twice and every outgoing edge is checked once. State and a depth-V recursion stack cost O(V).',
    notes: ['Colors are often named white, gray, and black.'],
    patterns: ['Directed cycle and recursion-stack reasoning.', 'Course prerequisite loops.'],
    mistakes: ['Using a single visited boolean.', 'Forgetting to change active to done on exit.'],
    takeaways: ['Active means on the current path.', 'Done neighbors do not imply cycles.', 'Scan disconnected components.'],
  }),
  'a8-cycle-directed-bfs-kahn': graph({
    problem: 'Detect a directed cycle by attempting Kahn’s topological elimination.',
    intuition: 'Every DAG has a zero-indegree vertex. A cycle prevents its remaining vertices from ever reaching indegree zero.',
    steps: topoSteps,
    codes: [{ caption: 'Kahn cycle detection', code: DIRECTED_KAHN_CYCLE }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Indegree construction and decrements scan each edge once; each vertex is queued at most once. Arrays and queue are O(V).',
    notes: ['This naturally detects a cycle but does not identify the exact cycle.'],
    patterns: ['Cycle detection already coupled to prerequisite ordering.', 'Avoid recursion depth.'],
    mistakes: ['Returning false just because the initial queue is nonempty.', 'Not counting removed vertices.'],
    takeaways: ['A DAG lets Kahn remove all V vertices.', 'removed != V means cycle.', 'No recursion is needed.'],
  }),
  'a8-shortest-path-dag': graph({
    problem: 'Find single-source shortest paths in a weighted DAG, including negative edge weights.',
    intuition: 'Topological order guarantees all incoming paths to u are settled before u relaxes its outgoing edges.',
    steps: ['Build a topological order of every vertex.', 'Initialize distances to INF and source to 0.', 'Process vertices in topological order.', 'Skip unreachable vertices.', 'Relax each weighted edge u-v once.'],
    codes: [{ caption: 'Topological relaxation in a weighted DAG', code: DAG_SHORTEST }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Topological DFS and the relaxation pass each scan all vertices and edges once. Seen, order, distances, and recursion cost O(V).',
    notes: ['Negative edges are safe because a DAG has no cycle; validate acyclicity if input is not guaranteed to be a DAG.'],
    patterns: ['Weighted graph known to be acyclic.', 'Need faster shortest paths than a heap-based method.'],
    mistakes: ['Relaxing from INF and overflowing.', 'Using adjacency entries in the wrong {vertex, weight} order.'],
    takeaways: ['Topo order replaces repeated relaxation.', 'Negative DAG edges are allowed.', 'Time O(V + E).'],
  }),
  'a8-dijkstra': graph({
    problem: 'Find shortest distances from one source in a graph whose edge weights are nonnegative.',
    intuition: 'The smallest tentative distance can be finalized because no later path made of nonnegative edges can improve it.',
    steps: ['Initialize source distance to 0 and push it.', 'Pop the minimum-distance heap entry.', 'Skip it when it is stale.', 'Relax each outgoing edge.', 'Push a fresh pair whenever a distance improves.'],
    codes: [{ caption: 'PriorityQueue Dijkstra', code: DIJKSTRA }],
    time: 'O((V + E) log V)',
    space: 'O(V + E)',
    analysis: 'Each successful relaxation can add a heap entry, giving O(E) pushes/pops at logarithmic cost. Distances are O(V), and lazy heap entries can occupy O(E).',
    notes: ['For path reconstruction, store parent on every successful relaxation.'],
    patterns: ['Nonnegative weighted shortest path.', 'Sparse graph where a binary heap is appropriate.'],
    mistakes: ['Using Dijkstra with a negative edge.', 'Omitting the stale-entry check.'],
    takeaways: ['Nonnegative weights are mandatory.', 'Lazy decrease-key uses stale skipping.', 'Use long distances to reduce overflow risk.'],
  }),
  'a8-dijkstra-priority-queue': graph({
    problem: 'Implement Dijkstra efficiently with Java PriorityQueue and lazy duplicate entries.',
    intuition: 'Java PriorityQueue has no simple decrease-key, so push the improved pair and discard older pairs when popped.',
    steps: ['Push {0, source}.', 'Pop the globally smallest distance.', 'Continue when popped distance differs from dist[u].', 'Relax nonnegative outgoing edges.', 'Push every improved {distance, vertex}.'],
    codes: [{ caption: 'Dijkstra with stale-entry skip', code: DIJKSTRA }],
    time: 'O((V + E) log V)',
    space: 'O(V + E)',
    analysis: 'At most one new heap entry is created per successful edge relaxation. Heap operations are logarithmic; lazy duplicates account for O(E) possible heap space.',
    notes: ['The comparator orders by distance, stored in pair index 0.'],
    patterns: ['Java heap shortest-path template.', 'No native decrease-key operation.'],
    mistakes: ['Marking a vertex final when inserted instead of when its minimum is popped.', 'Using int when path sums can overflow.'],
    takeaways: ['Push duplicates instead of decrease-key.', 'Skip stale entries.', 'Never accept negative weights.'],
  }),
  'a8-mst-prim': graph({
    problem: 'Find the total weight of a minimum spanning tree of a connected weighted undirected graph.',
    intuition: 'Grow one tree by repeatedly choosing the lightest edge crossing from selected vertices to an unselected vertex.',
    steps: ['Seed the heap with {0, start}.', 'Pop the lightest candidate edge.', 'Skip its destination if already selected.', 'Add its weight and mark the vertex selected.', 'Push outgoing edges to unselected neighbors; verify V vertices were chosen.'],
    codes: [{ caption: 'Lazy PriorityQueue Prim', code: PRIM }],
    time: 'O(E log E)',
    space: 'O(V + E)',
    analysis: 'Each undirected adjacency entry may be pushed into the heap and each heap operation costs O(log E). Used state is O(V), while lazy candidate edges can occupy O(E).',
    notes: ['For a minimum spanning forest, restart Prim from every unselected vertex instead of throwing.'],
    patterns: ['Need MST and graph is already an adjacency list.', 'Grow one connected cut frontier.'],
    mistakes: ['Adding an edge weight before checking used[u].', 'Applying Prim to a directed graph.'],
    takeaways: ['Prim chooses the cheapest crossing edge.', 'Skip stale destinations.', 'Disconnected input has no single spanning tree.'],
  }),
  'a8-kosaraju': graph({
    problem: 'Partition a directed graph into strongly connected components using two DFS passes.',
    intuition: 'Reverse finish order selects a source SCC in the transpose condensation graph, so the second DFS cannot leak into an unassigned SCC.',
    steps: ['DFS the original graph and push vertices on finish.', 'Construct the transpose graph.', 'Clear visited state.', 'Pop vertices by decreasing finish time.', 'DFS the transpose from each unseen popped vertex to collect one SCC.'],
    codes: [{ caption: 'Full Kosaraju two-pass SCC', code: KOSARAJU }],
    time: 'O(V + E)',
    space: 'O(V + E)',
    analysis: 'Two DFS passes and transpose construction each cost O(V + E). Transpose adjacency dominates auxiliary storage at O(V + E).',
    notes: ['Component order is not generally sorted; the SCC partition is the meaningful result.'],
    patterns: ['Mutual reachability groups.', 'Transpose graph is easy to build.'],
    mistakes: ['Using discovery order instead of finish order.', 'Forgetting to reset seen before pass two.'],
    takeaways: ['First pass computes finish order.', 'Second pass runs on reversed edges.', 'Each second-pass DFS is exactly one SCC.'],
  }),
  'a8-scc': graph({
    problem: 'Find maximal directed vertex sets in which every pair is mutually reachable.',
    intuition: 'Contracting each SCC produces a DAG. Kosaraju exposes components with finish order and transpose traversal; Tarjan obtains the same partition with low links in one pass.',
    steps: ['Use finish-order DFS on the original graph.', 'Reverse every edge.', 'Process vertices by decreasing finish time.', 'Collect each transpose DFS as one SCC.', 'Alternatively use Tarjan when one-pass processing is preferable.'],
    codes: [{ caption: 'Kosaraju SCC reference implementation', code: KOSARAJU }],
    time: 'O(V + E)',
    space: 'O(V + E)',
    analysis: 'Kosaraju scans the graph twice and explicitly stores the transpose. Tarjan also runs in O(V + E) but needs only arrays, recursion, and an active stack beyond the input.',
    notes: ['Tarjan SCC is included as its own reference topic.', 'After labeling components, build the condensation DAG by mapping cross-component edges.'],
    patterns: ['Mutual dependency groups.', 'Compress directed cycles before DAG processing.'],
    mistakes: ['Confusing weakly connected components with SCCs.', 'Assuming one ordinary DFS tree is one SCC.'],
    takeaways: ['SCC means mutual directed reachability.', 'The condensation graph is always a DAG.', 'Kosaraju and Tarjan are both linear.'],
  }),
  'a8-bellman-ford': graph({
    problem: 'Find single-source shortest paths with negative edges and report a reachable negative cycle.',
    intuition: 'Any simple shortest path uses at most V-1 edges, so V-1 global relaxation passes suffice; a further improvement proves an endlessly improvable reachable cycle.',
    steps: ['Store all directed edges explicitly.', 'Set source to 0 and other distances to INF.', 'Relax every edge for up to V-1 passes.', 'Stop early if a pass changes nothing.', 'Scan once more; return Optional.empty for a reachable negative cycle.'],
    codes: [{ caption: 'Bellman-Ford with Optional result', code: BELLMAN_FORD }],
    time: 'O(VE)',
    space: 'O(V)',
    analysis: 'At most V-1 passes scan E edges, followed by one detection scan. The distance array uses O(V); the supplied edge list is input storage.',
    notes: ['Only negative cycles reachable from the source invalidate source distances.'],
    patterns: ['Negative edge weights.', 'Need reachable negative-cycle detection.'],
    mistakes: ['Relaxing from INF and overflowing.', 'Calling any negative edge a negative cycle.'],
    takeaways: ['V-1 passes cover every simple path.', 'An nth improvement proves a reachable negative cycle.', 'Early stopping helps easy instances.'],
  }),
  'a8-articulation-points': articulationEntry(),
  'a8-articulation-tarjan': articulationEntry(),
  'a8-bridges': bridgeEntry(),
  'a8-bridges-tarjan': bridgeEntry(),
  'a8-tarjan-scc': graph({
    problem: 'Find all strongly connected components in one DFS pass using Tarjan low-link values.',
    intuition: 'The active stack contains unfinished SCC candidates. When low[u] equals disc[u], u is the root of one SCC and vertices are popped through u.',
    steps: ['Assign disc[u] = low[u] and push u on the active stack.', 'DFS unseen outgoing neighbors and merge their low values.', 'For an edge to an on-stack vertex, merge its discovery time.', 'When low[u] == disc[u], pop through u.', 'Start DFS from every undiscovered vertex.'],
    codes: [{ caption: 'One-pass Tarjan SCC', code: TARJAN_SCC }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Every vertex is pushed and popped once, and every directed edge is examined once. Arrays, recursion, and active stack use O(V) beyond the graph.',
    notes: ['Only edges to vertices currently on the stack affect low[u]; edges to completed SCCs do not.'],
    patterns: ['Need SCCs without constructing a transpose.', 'Streaming-style one-pass SCC decomposition.'],
    mistakes: ['Updating low from a visited vertex that is no longer on stack.', 'Popping before low[u] == disc[u].'],
    takeaways: ['SCC root condition is low[u] == disc[u].', 'The active stack differs from the recursion stack conceptually.', 'Tarjan is linear.'],
  }),
  'a8-mst-kruskal': graph({
    problem: 'Find a minimum spanning tree by sorting edges and joining different components with DSU.',
    intuition: 'In increasing weight order, the lightest edge connecting two current components is safe by the cut property.',
    steps: ['Sort all undirected edges by weight.', 'Initialize each vertex as its own DSU set.', 'For each edge, compare endpoint roots.', 'Union different roots and add the edge weight.', 'Stop after V-1 edges and reject disconnected input.'],
    codes: [{ caption: 'Kruskal plus optimized DSU', code: KRUSKAL }],
    time: 'O(E log E)',
    space: 'O(V)',
    analysis: 'Edge sorting dominates at O(E log E). Path compression and union by rank make DSU operations nearly constant amortized; DSU arrays use O(V), excluding the input edge list.',
    notes: ['Keep one copy of each undirected edge in the sorted edge list.'],
    patterns: ['MST input naturally arrives as an edge list.', 'Need DSU for incremental connectivity.'],
    mistakes: ['Adding an edge whose endpoints already share a root.', 'Forgetting the disconnected-graph check.'],
    takeaways: ['Sort, test roots, then union.', 'DSU prevents cycles.', 'Exactly V-1 selected edges form a spanning tree.'],
  }),
  'a8-floyd-warshall': graph({
    problem: 'Compute shortest distances between every ordered pair of vertices from an INF-initialized matrix.',
    intuition: 'After phase k, dist[i][j] is optimal among paths whose internal vertices are drawn only from 0 through k.',
    steps: ['Copy the matrix and ensure each diagonal is at most zero.', 'Use k as the outermost loop.', 'For every i and j, skip unreachable halves.', 'Relax dist[i][j] through k.', 'Afterward, a negative diagonal identifies a negative cycle.'],
    codes: [{ caption: 'INF-safe Floyd-Warshall', code: FLOYD_WARSHALL }],
    time: 'O(V³)',
    space: 'O(V²)',
    analysis: 'The three nested vertex loops perform V³ constant-time relaxations. The copied all-pairs distance matrix occupies V² space.',
    notes: ['Use a finite INF such as Long.MAX_VALUE / 4 and guard additions.', 'Negative edges are allowed, but negative cycles make affected shortest distances undefined.'],
    patterns: ['Dense graph or many source-target queries.', 'Need transitive all-pairs dynamic programming.'],
    mistakes: ['Putting k inside i or j loops.', 'Adding INF values and overflowing.'],
    takeaways: ['k must be the outer loop.', 'Matrix space is O(V²).', 'Negative diagonal signals a negative cycle.'],
  }),
  'a8-bipartite': graph({
    problem: 'Determine whether every component of an undirected graph can be colored with two colors so adjacent vertices differ.',
    intuition: 'Parity alternates across every edge. A same-color edge creates an odd cycle; absence of conflict gives a valid bipartition.',
    steps: ['Fill colors with -1.', 'Start BFS in each uncolored component.', 'Assign the start color 0.', 'Give each uncolored neighbor the opposite color.', 'Reject an edge joining equal colors.'],
    codes: [{ caption: 'BFS two-color test', code: BIPARTITE_BFS }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Each vertex is colored and queued once and every adjacency entry is checked. Color and queue arrays use O(V).',
    notes: ['An undirected graph is bipartite exactly when it contains no odd-length cycle.'],
    patterns: ['Two-group constraints.', 'Odd-cycle detection.'],
    mistakes: ['Coloring only one connected component.', 'Treating disconnected isolated vertices as failure.'],
    takeaways: ['Opposite colors across every edge.', 'Same-color edge proves an odd cycle.', 'Check every component.'],
  }),
  'a8-bipartite-bfs': graph({
    problem: 'Check bipartiteness with breadth-first two-coloring.',
    intuition: 'BFS propagates alternating parity level by level; any edge whose endpoints have equal parity contradicts two-colorability.',
    steps: ['Initialize every color to -1.', 'BFS from each uncolored vertex.', 'Assign neighbor color with color[u] XOR 1.', 'Reject equal endpoint colors.', 'Accept after all components finish.'],
    codes: [{ caption: 'BFS bipartite check', code: BIPARTITE_BFS }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Vertices enter the queue once and edges are tested in each stored direction. The color array and queue use O(V).',
    notes: ['The numeric colors 0 and 1 can directly represent the two output partitions.'],
    patterns: ['Layer parity.', 'Queue-based graph constraint propagation.'],
    mistakes: ['Overwriting an existing neighbor color.', 'Skipping disconnected components.'],
    takeaways: ['Use -1 for uncolored.', 'XOR 1 flips colors.', 'A conflict means not bipartite.'],
  }),
  'a8-bipartite-dfs': graph({
    problem: 'Check bipartiteness using recursive DFS two-coloring.',
    intuition: 'DFS carries the required color down each path; a previously colored neighbor must agree with the opposite-color constraint.',
    steps: ['Initialize colors to -1.', 'For every uncolored root, call DFS with color 0.', 'Assign u its requested color.', 'Recurse on uncolored neighbors with value XOR 1.', 'Return false on a same-color edge.'],
    codes: [{ caption: 'DFS bipartite check', code: BIPARTITE_DFS }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Each vertex is colored once and each edge is checked from its endpoints. Colors and worst-case recursion depth use O(V).',
    notes: ['Use BFS instead if a depth-V recursion stack is unsafe.'],
    patterns: ['Recursive constraint propagation.', 'Need an odd-cycle yes/no result.'],
    mistakes: ['Passing the same color into the recursive call.', 'Ignoring a false result from a child.'],
    takeaways: ['DFS and BFS enforce the same invariant.', 'Flip color with XOR 1.', 'Same-color adjacency is the only conflict.'],
  }),
  'a8-0-1-bfs': graph({
    problem: 'Find single-source shortest paths when every edge weight is exactly 0 or 1.',
    intuition: 'A deque maintains distance order without a heap: a zero-cost improvement belongs at the front and a one-cost improvement at the back.',
    steps: ['Initialize distances to infinity and source to zero.', 'Remove a vertex from the deque front.', 'Relax each outgoing 0/1 edge.', 'Push improved zero edges to the front.', 'Push improved one edges to the back.'],
    codes: [{ caption: 'Deque-based 0-1 BFS', code: ZERO_ONE_BFS }],
    time: 'O(V + E)',
    space: 'O(V + E)',
    analysis: 'Under 0/1 relaxations, deque ordering gives linear total processing across vertices and edges. Distances are O(V); duplicate deque entries can make stored state O(E) in this lazy template.',
    notes: ['For arbitrary nonnegative weights, switch to Dijkstra.'],
    patterns: ['Binary edge costs.', 'Minimum number of costly transitions.'],
    mistakes: ['Using it when a weight exceeds 1.', 'Putting weight-0 relaxations at the back.'],
    takeaways: ['0 goes front; 1 goes back.', 'It is a specialized Dijkstra.', 'Binary weights permit linear time.'],
  }),
  'a8-dijkstra-limitations': graph({
    problem: 'Understand why Dijkstra is invalid with negative edges and identify the correct replacement.',
    intuition: 'Dijkstra relies on a popped minimum being final. A later route containing a negative edge can reduce that supposedly final distance, breaking the greedy proof.',
    steps: ['Inspect the complete weight model before choosing the algorithm.', 'Use Dijkstra only when every reachable edge weight is nonnegative.', 'Use Bellman-Ford for general negative edges.', 'Use topological relaxation for a weighted DAG, even with negative edges.', 'Use 0-1 BFS when weights are only 0 and 1.'],
    codes: [{ caption: 'Dijkstra shown as a nonnegative-only contrast', code: DIJKSTRA }],
    time: 'O((V + E) log V)',
    space: 'O(V + E)',
    analysis: 'The shown heap implementation has standard Dijkstra complexity, but that complexity says nothing about correctness under negative weights. Bellman-Ford trades speed for a valid negative-edge invariant.',
    notes: ['A negative edge does not necessarily mean a negative cycle, but it is enough to invalidate ordinary Dijkstra’s finalization argument.'],
    patterns: ['Algorithm-selection questions.', 'Shortest path where edge constraints are easy to overlook.'],
    mistakes: ['Assuming stale-entry handling makes negative edges safe.', 'Confusing a negative edge with a negative cycle.'],
    takeaways: ['Dijkstra correctness requires nonnegative edges.', 'Negative DAG edges use topological relaxation.', 'General negative edges use Bellman-Ford.'],
  }),
  'a8-shortest-path-decision': {
    ...graph({
      problem: 'Choose the simplest correct shortest-path algorithm from graph structure, edge weights, and query volume.',
      intuition: 'The weight model determines which distance-order invariant is valid; special structure often gives a faster algorithm than general-purpose Dijkstra.',
      steps: ['If the graph is unweighted or all weights are equal, choose BFS.', 'If weights are only 0 and 1, choose 0-1 BFS.', 'If the weighted graph is a DAG, choose topological relaxation.', 'If all weights are nonnegative, choose Dijkstra.', 'If negative edges exist, choose Bellman-Ford; for all pairs consider Floyd-Warshall when V is moderate.'],
      codes: [{ caption: 'BFS baseline for unit weights', code: UNWEIGHTED_SHORTEST }],
      time: 'Depends on selected algorithm',
      space: 'O(V) to O(V²)',
      analysis: 'BFS, 0-1 BFS, and DAG relaxation are O(V + E); Dijkstra is O((V + E) log V); Bellman-Ford is O(VE); Floyd-Warshall is O(V³) time and O(V²) space.',
      notes: ['Also account for single-source versus all-pairs queries and whether negative-cycle detection is required.'],
      patterns: ['Classify weights before coding.', 'Exploit DAG, binary-weight, or dense all-pairs structure.'],
      mistakes: ['Choosing by familiarity rather than preconditions.', 'Using BFS merely because the graph is stored as an adjacency list.'],
      takeaways: ['Unit: BFS; binary: 0-1 BFS.', 'DAG: topo relaxation; nonnegative: Dijkstra.', 'Negative: Bellman-Ford; moderate all-pairs: Floyd-Warshall.'],
    }),
    example: [
      {
        type: 'table',
        headers: ['Graph / weights', 'Choose', 'Time'],
        rows: [
          ['Unweighted or equal weight', 'BFS', 'O(V + E)'],
          ['Weights only 0 or 1', '0-1 BFS', 'O(V + E)'],
          ['Weighted DAG', 'Topological relaxation', 'O(V + E)'],
          ['Nonnegative weights', 'Dijkstra', 'O((V + E) log V)'],
          ['Negative edges', 'Bellman-Ford', 'O(VE)'],
          ['Moderate V, all pairs', 'Floyd-Warshall', 'O(V³)'],
        ],
      },
      {
        type: 'table',
        headers: ['Question', 'Decision'],
        rows: [
          ['Need all pairs?', 'Prefer Floyd-Warshall for moderate dense graphs; otherwise run a suitable single-source algorithm per source.'],
          ['Can a negative cycle be reachable?', 'Use Bellman-Ford to detect it.'],
          ['Is the graph acyclic?', 'Topological relaxation permits negative weights in linear time.'],
        ],
      },
    ],
  },
}

export function getGraphReferenceContent(id: string): TopicContent | undefined {
  return GRAPH_REFERENCE_CONTENT[id]
}
