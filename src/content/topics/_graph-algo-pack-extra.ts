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
      'Identify vertices, edges, direction, and weights before coding.',
      'Match the ask to this template.',
    ],
    mistakes: spec.mistakes ?? [
      'Forgetting disconnected components.',
      'Wrong algorithm for the weight/direction model.',
    ],
    takeaways: spec.takeaways ?? [
      spec.problem,
      `Time ${spec.time}; space ${spec.space}.`,
      spec.intuition,
    ],
  })
const ADJ_LIST = `import java.util.*;

class AdjacencyList {
    static List<List<Integer>> build(int V, int[][] edges, boolean directed) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            if (!directed) adj.get(e[1]).add(e[0]);
        }
        return adj;
    }

    static boolean hasEdge(List<List<Integer>> adj, int u, int v) {
        return adj.get(u).contains(v);
    }
}`
const ADJ_MATRIX = `import java.util.*;

class AdjacencyMatrix {
    static boolean[][] build(int V, int[][] edges, boolean directed) {
        boolean[][] g = new boolean[V][V];
        for (int[] e : edges) {
            g[e[0]][e[1]] = true;
            if (!directed) g[e[1]][e[0]] = true;
        }
        return g;
    }

    static boolean hasEdge(boolean[][] g, int u, int v) {
        return g[u][v];
    }
}`
const EDGE_LIST = `import java.util.*;

class EdgeList {
    record Edge(int u, int v, int w) {}

    static List<Edge> build(int[][] edges) {
        List<Edge> list = new ArrayList<>();
        for (int[] e : edges) list.add(new Edge(e[0], e[1], e.length > 2 ? e[2] : 1));
        return list;
    }
}`
const GRAPH_REP = `import java.util.*;

class GraphRepresentations {
    // Prefer adj list for sparse graphs (E ≪ V²); matrix for dense / O(1) edge queries.
    static List<List<Integer>> toAdjList(int V, int[][] edges, boolean directed) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            if (!directed) adj.get(e[1]).add(e[0]);
        }
        return adj;
    }

    static int[][] toMatrix(int V, int[][] edges, boolean directed, int noEdge) {
        int[][] g = new int[V][V];
        for (int i = 0; i < V; i++) Arrays.fill(g[i], noEdge);
        for (int i = 0; i < V; i++) g[i][i] = 0;
        for (int[] e : edges) {
            int w = e.length > 2 ? e[2] : 1;
            g[e[0]][e[1]] = w;
            if (!directed) g[e[1]][e[0]] = w;
        }
        return g;
    }
}`
const TRANSITIVE = `import java.util.*;

class TransitiveClosure {
    static boolean[][] closure(boolean[][] reach) {
        int n = reach.length;
        boolean[][] g = new boolean[n][n];
        for (int i = 0; i < n; i++) g[i] = Arrays.copyOf(reach[i], n);
        for (int k = 0; k < n; k++)
            for (int i = 0; i < n; i++)
                if (g[i][k])
                    for (int j = 0; j < n; j++)
                        g[i][j] |= g[k][j];
        return g;
    }
}`
const HAVEL = `import java.util.*;

class GraphFromDegrees {
    // Havel–Hakimi: decide if a degree sequence is graphic (simple undirected).
    static boolean isGraphic(int[] deg) {
        int n = deg.length;
        Integer[] d = new Integer[n];
        for (int i = 0; i < n; i++) d[i] = deg[i];
        while (true) {
            Arrays.sort(d, Collections.reverseOrder());
            if (d[0] == 0) return true;
            int k = d[0];
            if (k >= n) return false;
            d[0] = 0;
            for (int i = 1; i <= k; i++) {
                d[i]--;
                if (d[i] < 0) return false;
            }
        }
    }
}`
const CLONE_GRAPH = `import java.util.*;

class CloneGraph {
    static class Node {
        int val;
        List<Node> neighbors = new ArrayList<>();
        Node(int val) { this.val = val; }
    }

    static Node cloneGraph(Node start) {
        if (start == null) return null;
        Map<Node, Node> map = new HashMap<>();
        ArrayDeque<Node> q = new ArrayDeque<>();
        map.put(start, new Node(start.val));
        q.offer(start);
        while (!q.isEmpty()) {
            Node u = q.poll();
            for (Node v : u.neighbors) {
                if (!map.containsKey(v)) {
                    map.put(v, new Node(v.val));
                    q.offer(v);
                }
                map.get(u).neighbors.add(map.get(v));
            }
        }
        return map.get(start);
    }
}`
const CLONE_DAG = `import java.util.*;

class CloneDag {
    static class Node {
        int val;
        List<Node> next = new ArrayList<>();
        Node(int val) { this.val = val; }
    }

    static Node cloneDag(Node start) {
        Map<Node, Node> map = new HashMap<>();
        return dfs(start, map);
    }

    private static Node dfs(Node u, Map<Node, Node> map) {
        if (u == null) return null;
        if (map.containsKey(u)) return map.get(u);
        Node c = new Node(u.val);
        map.put(u, c);
        for (Node v : u.next) c.next.add(dfs(v, map));
        return c;
    }
}`
const MULTI_SRC = `import java.util.*;

class MultiSourceBfs {
    static int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};

    // Enqueue all sources at dist 0; first touch is shortest.
    static int[][] multiSource(int[][] grid, int sourceVal) {
        int n = grid.length, m = grid[0].length;
        int[][] dist = new int[n][m];
        for (int[] row : dist) Arrays.fill(row, -1);
        ArrayDeque<int[]> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++)
                if (grid[i][j] == sourceVal) {
                    dist[i][j] = 0;
                    q.offer(new int[]{i, j});
                }
        while (!q.isEmpty()) {
            int[] c = q.poll();
            for (int[] d : dirs) {
                int ni = c[0] + d[0], nj = c[1] + d[1];
                if (ni < 0 || nj < 0 || ni >= n || nj >= m) continue;
                if (dist[ni][nj] != -1 || grid[ni][nj] == 0) continue; // 0 = blocked
                dist[ni][nj] = dist[c[0]][c[1]] + 1;
                q.offer(new int[]{ni, nj});
            }
        }
        return dist;
    }
}`
const GRID = `import java.util.*;

class GridAsGraph {
    static final int[][] D4 = {{1,0},{-1,0},{0,1},{0,-1}};

    static List<int[]> neighbors(int r, int c, int n, int m, boolean[][] blocked) {
        List<int[]> out = new ArrayList<>();
        for (int[] d : D4) {
            int nr = r + d[0], nc = c + d[1];
            if (nr < 0 || nc < 0 || nr >= n || nc >= m) continue;
            if (blocked != null && blocked[nr][nc]) continue;
            out.add(new int[]{nr, nc});
        }
        return out;
    }
}`
const FLOOD = `import java.util.*;

class FloodFill {
    static int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};

    static int[][] floodFill(int[][] image, int sr, int sc, int color) {
        int old = image[sr][sc];
        if (old == color) return image;
        ArrayDeque<int[]> q = new ArrayDeque<>();
        q.offer(new int[]{sr, sc});
        image[sr][sc] = color;
        while (!q.isEmpty()) {
            int[] c = q.poll();
            for (int[] d : dirs) {
                int nr = c[0] + d[0], nc = c[1] + d[1];
                if (nr < 0 || nc < 0 || nr >= image.length || nc >= image[0].length) continue;
                if (image[nr][nc] != old) continue;
                image[nr][nc] = color;
                q.offer(new int[]{nr, nc});
            }
        }
        return image;
    }
}`
const ISLANDS = `import java.util.*;

class NumberOfIslands {
    static int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};

    static int numIslands(char[][] grid) {
        int n = grid.length, m = grid[0].length, count = 0;
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++)
                if (grid[i][j] == '1') {
                    count++;
                    dfs(grid, i, j);
                }
        return count;
    }

    private static void dfs(char[][] g, int i, int j) {
        if (i < 0 || j < 0 || i >= g.length || j >= g[0].length || g[i][j] != '1') return;
        g[i][j] = '0';
        for (int[] d : dirs) dfs(g, i + d[0], j + d[1]);
    }
}`
const ROTTEN = `import java.util.*;

class RottenOranges {
    static int orangesRotting(int[][] grid) {
        int n = grid.length, m = grid[0].length, fresh = 0;
        ArrayDeque<int[]> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++) {
                if (grid[i][j] == 2) q.offer(new int[]{i, j});
                else if (grid[i][j] == 1) fresh++;
            }
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        int minutes = 0;
        while (!q.isEmpty() && fresh > 0) {
            int sz = q.size();
            minutes++;
            for (int s = 0; s < sz; s++) {
                int[] c = q.poll();
                for (int[] d : dirs) {
                    int ni = c[0] + d[0], nj = c[1] + d[1];
                    if (ni < 0 || nj < 0 || ni >= n || nj >= m || grid[ni][nj] != 1) continue;
                    grid[ni][nj] = 2;
                    fresh--;
                    q.offer(new int[]{ni, nj});
                }
            }
        }
        return fresh == 0 ? minutes : -1;
    }
}`
const WORD_LADDER = `import java.util.*;

class WordLadder {
    static int ladderLength(String begin, String end, List<String> wordList) {
        Set<String> dict = new HashSet<>(wordList);
        if (!dict.contains(end)) return 0;
        ArrayDeque<String> q = new ArrayDeque<>();
        q.offer(begin);
        int steps = 1;
        while (!q.isEmpty()) {
            int sz = q.size();
            for (int s = 0; s < sz; s++) {
                String w = q.poll();
                if (w.equals(end)) return steps;
                char[] a = w.toCharArray();
                for (int i = 0; i < a.length; i++) {
                    char old = a[i];
                    for (char c = 'a'; c <= 'z'; c++) {
                        a[i] = c;
                        String next = new String(a);
                        if (dict.remove(next)) q.offer(next);
                    }
                    a[i] = old;
                }
            }
            steps++;
        }
        return 0;
    }
}`
const SNAKES = `import java.util.*;

class SnakesAndLadders {
    static int snakesAndLadders(int[][] board) {
        int n = board.length;
        int[] dest = new int[n * n + 1];
        Arrays.fill(dest, -1);
        int label = 1, row = n - 1, col = 0, dir = 1;
        while (label <= n * n) {
            if (board[row][col] != -1) dest[label] = board[row][col];
            label++;
            col += dir;
            if (col == n || col < 0) {
                dir = -dir;
                col += dir;
                row--;
            }
        }
        boolean[] seen = new boolean[n * n + 1];
        ArrayDeque<int[]> q = new ArrayDeque<>();
        q.offer(new int[]{1, 0});
        seen[1] = true;
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            if (cur[0] == n * n) return cur[1];
            for (int roll = 1; roll <= 6 && cur[0] + roll <= n * n; roll++) {
                int next = cur[0] + roll;
                if (dest[next] != -1) next = dest[next];
                if (!seen[next]) {
                    seen[next] = true;
                    q.offer(new int[]{next, cur[1] + 1});
                }
            }
        }
        return -1;
    }
}`
const BIN_MATRIX = `import java.util.*;

class ShortestPathBinaryMatrix {
    static int shortestPathBinaryMatrix(int[][] grid) {
        int n = grid.length;
        if (grid[0][0] != 0 || grid[n - 1][n - 1] != 0) return -1;
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1},{1,1},{1,-1},{-1,1},{-1,-1}};
        ArrayDeque<int[]> q = new ArrayDeque<>();
        q.offer(new int[]{0, 0, 1});
        grid[0][0] = 1;
        while (!q.isEmpty()) {
            int[] c = q.poll();
            if (c[0] == n - 1 && c[1] == n - 1) return c[2];
            for (int[] d : dirs) {
                int ni = c[0] + d[0], nj = c[1] + d[1];
                if (ni < 0 || nj < 0 || ni >= n || nj >= n || grid[ni][nj] != 0) continue;
                grid[ni][nj] = 1;
                q.offer(new int[]{ni, nj, c[2] + 1});
            }
        }
        return -1;
    }
}`
const PACIFIC = `import java.util.*;

class PacificAtlantic {
    static List<List<Integer>> pacificAtlantic(int[][] h) {
        int n = h.length, m = h[0].length;
        boolean[][] pac = new boolean[n][m], atl = new boolean[n][m];
        ArrayDeque<int[]> qp = new ArrayDeque<>(), qa = new ArrayDeque<>();
        for (int i = 0; i < n; i++) { qp.offer(new int[]{i, 0}); qa.offer(new int[]{i, m - 1}); }
        for (int j = 0; j < m; j++) { qp.offer(new int[]{0, j}); qa.offer(new int[]{n - 1, j}); }
        bfs(h, qp, pac); bfs(h, qa, atl);
        List<List<Integer>> ans = new ArrayList<>();
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++)
                if (pac[i][j] && atl[i][j]) ans.add(List.of(i, j));
        return ans;
    }

    private static void bfs(int[][] h, ArrayDeque<int[]> q, boolean[][] seen) {
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.isEmpty()) {
            int[] c = q.poll();
            int r = c[0], col = c[1];
            if (seen[r][col]) continue;
            seen[r][col] = true;
            for (int[] d : dirs) {
                int nr = r + d[0], nc = col + d[1];
                if (nr < 0 || nc < 0 || nr >= h.length || nc >= h[0].length) continue;
                if (h[nr][nc] < h[r][col]) continue; // flow uphill from ocean
                q.offer(new int[]{nr, nc});
            }
        }
    }
}`
const KNIGHT = `import java.util.*;

class StepsByKnight {
    static int minSteps(int N, int[] knight, int[] target) {
        int[][] dirs = {{2,1},{2,-1},{-2,1},{-2,-1},{1,2},{1,-2},{-1,2},{-1,-2}};
        boolean[][] seen = new boolean[N + 1][N + 1];
        ArrayDeque<int[]> q = new ArrayDeque<>();
        q.offer(new int[]{knight[0], knight[1], 0});
        seen[knight[0]][knight[1]] = true;
        while (!q.isEmpty()) {
            int[] c = q.poll();
            if (c[0] == target[0] && c[1] == target[1]) return c[2];
            for (int[] d : dirs) {
                int nx = c[0] + d[0], ny = c[1] + d[1];
                if (nx < 1 || ny < 1 || nx > N || ny > N || seen[nx][ny]) continue;
                seen[nx][ny] = true;
                q.offer(new int[]{nx, ny, c[2] + 1});
            }
        }
        return -1;
    }
}`
const WATER = `import java.util.*;

class WaterJug {
    static boolean canMeasure(int x, int y, int z) {
        if (z > x + y) return false;
        Set<Long> seen = new HashSet<>();
        ArrayDeque<int[]> q = new ArrayDeque<>();
        q.offer(new int[]{0, 0});
        seen.add(0L);
        while (!q.isEmpty()) {
            int[] s = q.poll();
            if (s[0] == z || s[1] == z || s[0] + s[1] == z) return true;
            int[][] next = {
                {x, s[1]}, {s[0], y}, {0, s[1]}, {s[0], 0},
                {s[0] - Math.min(s[0], y - s[1]), s[1] + Math.min(s[0], y - s[1])},
                {s[0] + Math.min(s[1], x - s[0]), s[1] - Math.min(s[1], x - s[0])}
            };
            for (int[] n : next) {
                long key = (((long) n[0]) << 32) | (n[1] & 0xffffffffL);
                if (seen.add(key)) q.offer(n);
            }
        }
        return false;
    }
}`
const BOGGLE = `import java.util.*;

class Boggle {
    static List<String> findWords(char[][] board, String[] words) {
        TrieNode root = new TrieNode();
        for (String w : words) {
            TrieNode cur = root;
            for (char c : w.toCharArray()) {
                cur = cur.next.computeIfAbsent(c, k -> new TrieNode());
            }
            cur.word = w;
        }
        Set<String> found = new LinkedHashSet<>();
        for (int i = 0; i < board.length; i++)
            for (int j = 0; j < board[0].length; j++)
                dfs(board, i, j, root, found);
        return new ArrayList<>(found);
    }

    private static void dfs(char[][] b, int i, int j, TrieNode node, Set<String> found) {
        if (i < 0 || j < 0 || i >= b.length || j >= b[0].length) return;
        char c = b[i][j];
        if (c == '#' || !node.next.containsKey(c)) return;
        TrieNode next = node.next.get(c);
        if (next.word != null) { found.add(next.word); next.word = null; }
        b[i][j] = '#';
        dfs(b, i + 1, j, next, found); dfs(b, i - 1, j, next, found);
        dfs(b, i, j + 1, next, found); dfs(b, i, j - 1, next, found);
        b[i][j] = c;
    }

    static class TrieNode {
        Map<Character, TrieNode> next = new HashMap<>();
        String word;
    }
}`
const CYCLES_N = `import java.util.*;

class CyclesOfLengthN {
    static int countCycles(List<List<Integer>> adj, int n) {
        int V = adj.size(), count = 0;
        boolean[] on = new boolean[V];
        for (int start = 0; start < V - (n - 1); start++) {
            count += dfs(start, start, n - 1, adj, on);
            on[start] = true; // lock earlier starts to avoid duplicates
        }
        return count / 2; // undirected: each cycle counted twice
    }

    private static int dfs(int start, int u, int rem, List<List<Integer>> adj, boolean[] on) {
        if (rem == 0) {
            return adj.get(u).contains(start) ? 1 : 0;
        }
        on[u] = true;
        int c = 0;
        for (int v : adj.get(u)) {
            if (!on[v] && v > start) c += dfs(start, v, rem - 1, adj, on);
        }
        on[u] = false;
        return c;
    }
}`
const COLORS = `import java.util.*;

class CycleUsingColors {
    // 0=WHITE, 1=GRAY (on stack), 2=BLACK
    static boolean hasDirectedCycle(List<List<Integer>> adj) {
        int[] color = new int[adj.size()];
        for (int u = 0; u < adj.size(); u++) {
            if (color[u] == 0 && dfs(u, adj, color)) return true;
        }
        return false;
    }

    private static boolean dfs(int u, List<List<Integer>> adj, int[] color) {
        color[u] = 1;
        for (int v : adj.get(u)) {
            if (color[v] == 1) return true;
            if (color[v] == 0 && dfs(v, adj, color)) return true;
        }
        color[u] = 2;
        return false;
    }
}`
const NEG_CYCLE = `import java.util.*;

class NegativeCycleDetection {
    record Edge(int u, int v, int w) {}

    static boolean hasNegativeCycle(int V, List<Edge> edges) {
        int[] dist = new int[V];
        Arrays.fill(dist, 0); // detect cycle anywhere: start all at 0
        for (int i = 0; i < V - 1; i++) {
            for (Edge e : edges) {
                if (dist[e.u] + e.w < dist[e.v]) dist[e.v] = dist[e.u] + e.w;
            }
        }
        for (Edge e : edges) {
            if (dist[e.u] + e.w < dist[e.v]) return true;
        }
        return false;
    }
}`
const DAG_DP = `import java.util.*;

class DagDp {
    // Example: longest path in DAG via topo + DP
    static int[] longestFrom(int src, List<List<int[]>> adj) {
        int V = adj.size();
        int[] indeg = new int[V];
        for (int u = 0; u < V; u++) for (int[] e : adj.get(u)) indeg[e[0]]++;
        ArrayDeque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < V; i++) if (indeg[i] == 0) q.offer(i);
        List<Integer> topo = new ArrayList<>();
        while (!q.isEmpty()) {
            int u = q.poll();
            topo.add(u);
            for (int[] e : adj.get(u)) if (--indeg[e[0]] == 0) q.offer(e[0]);
        }
        int[] dp = new int[V];
        Arrays.fill(dp, Integer.MIN_VALUE / 4);
        dp[src] = 0;
        for (int u : topo) {
            if (dp[u] == Integer.MIN_VALUE / 4) continue;
            for (int[] e : adj.get(u)) dp[e[0]] = Math.max(dp[e[0]], dp[u] + e[1]);
        }
        return dp;
    }
}`
const TOPO_DEP = `import java.util.*;

class TopoDepartureTime {
    static List<Integer> topoByFinishTime(List<List<Integer>> adj) {
        int[] state = new int[adj.size()]; // 0 new, 1 active, 2 done
        Deque<Integer> stack = new ArrayDeque<>();
        for (int u = 0; u < adj.size(); u++) {
            if (state[u] == 0 && !dfs(u, adj, state, stack)) return List.of();
        }
        List<Integer> order = new ArrayList<>();
        while (!stack.isEmpty()) order.add(stack.pop());
        return order;
    }

    private static boolean dfs(int u, List<List<Integer>> adj, int[] state, Deque<Integer> stack) {
        state[u] = 1;
        for (int v : adj.get(u)) {
            if (state[v] == 1) return false;
            if (state[v] == 0 && !dfs(v, adj, state, stack)) return false;
        }
        state[u] = 2;
        stack.push(u); // push on finish
        return true;
    }
}`
const ALL_TOPO = `import java.util.*;

class AllTopologicalSorts {
    static List<List<Integer>> allTopo(List<List<Integer>> adj) {
        int V = adj.size();
        int[] indeg = new int[V];
        for (int u = 0; u < V; u++) for (int v : adj.get(u)) indeg[v]++;
        List<List<Integer>> ans = new ArrayList<>();
        boolean[] used = new boolean[V];
        backtrack(adj, indeg, used, new ArrayList<>(), ans);
        return ans;
    }

    private static void backtrack(List<List<Integer>> adj, int[] indeg, boolean[] used,
                                  List<Integer> path, List<List<Integer>> ans) {
        if (path.size() == adj.size()) { ans.add(new ArrayList<>(path)); return; }
        for (int u = 0; u < adj.size(); u++) {
            if (used[u] || indeg[u] != 0) continue;
            used[u] = true;
            path.add(u);
            for (int v : adj.get(u)) indeg[v]--;
            backtrack(adj, indeg, used, path, ans);
            for (int v : adj.get(u)) indeg[v]++;
            path.remove(path.size() - 1);
            used[u] = false;
        }
    }
}`
const MAX_EDGES_DAG = `import java.util.*;

class MaxEdgesKeepDag {
    // Max edges in a DAG on V labeled vertices: all i→j for i<j in some topo order.
    static int maxEdges(int V) {
        return V * (V - 1) / 2;
    }

    static List<int[]> buildTournamentDag(int V) {
        List<int[]> edges = new ArrayList<>();
        for (int i = 0; i < V; i++)
            for (int j = i + 1; j < V; j++) edges.add(new int[]{i, j});
        return edges;
    }
}`
const LONGEST_DAG = `import java.util.*;

class LongestPathDag {
    static int longestPath(List<List<int[]>> adj) {
        int V = adj.size();
        int[] indeg = new int[V], dist = new int[V];
        for (int u = 0; u < V; u++) for (int[] e : adj.get(u)) indeg[e[0]]++;
        ArrayDeque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < V; i++) if (indeg[i] == 0) q.offer(i);
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int[] e : adj.get(u)) {
                dist[e[0]] = Math.max(dist[e[0]], dist[u] + e[1]);
                if (--indeg[e[0]] == 0) q.offer(e[0]);
            }
        }
        int ans = 0;
        for (int d : dist) ans = Math.max(ans, d);
        return ans;
    }
}`
const ITINERARY = `import java.util.*;

class FindItinerary {
    static List<String> findItinerary(List<List<String>> tickets) {
        Map<String, PriorityQueue<String>> g = new HashMap<>();
        for (List<String> t : tickets)
            g.computeIfAbsent(t.get(0), k -> new PriorityQueue<>()).offer(t.get(1));
        LinkedList<String> route = new LinkedList<>();
        Deque<String> stack = new ArrayDeque<>();
        stack.push("JFK");
        while (!stack.isEmpty()) {
            String u = stack.peek();
            PriorityQueue<String> pq = g.get(u);
            if (pq != null && !pq.isEmpty()) stack.push(pq.poll());
            else route.addFirst(stack.pop());
        }
        return route;
    }
}`
const COURSE = `import java.util.*;

class CourseSchedule {
    static boolean canFinish(int n, int[][] prereq) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        int[] indeg = new int[n];
        for (int[] p : prereq) { adj.get(p[1]).add(p[0]); indeg[p[0]]++; }
        ArrayDeque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);
        int taken = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            taken++;
            for (int v : adj.get(u)) if (--indeg[v] == 0) q.offer(v);
        }
        return taken == n;
    }
}`
const TWO_CLIQUE = `import java.util.*;

class TwoCliqueProblem {
    // Graph is union of two cliques iff complement is bipartite.
    static boolean isTwoCliques(boolean[][] g) {
        int n = g.length;
        List<List<Integer>> comp = new ArrayList<>();
        for (int i = 0; i < n; i++) comp.add(new ArrayList<>());
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                if (!g[i][j]) { comp.get(i).add(j); comp.get(j).add(i); }
        int[] color = new int[n];
        Arrays.fill(color, -1);
        for (int s = 0; s < n; s++) {
            if (color[s] != -1) continue;
            ArrayDeque<Integer> q = new ArrayDeque<>();
            color[s] = 0; q.offer(s);
            while (!q.isEmpty()) {
                int u = q.poll();
                for (int v : comp.get(u)) {
                    if (color[v] == -1) { color[v] = color[u] ^ 1; q.offer(v); }
                    else if (color[v] == color[u]) return false;
                }
            }
        }
        return true;
    }
}`
const COMP_BFS = `import java.util.*;

class ComponentsBfs {
    static int countComponents(List<List<Integer>> adj) {
        boolean[] seen = new boolean[adj.size()];
        int comps = 0;
        for (int s = 0; s < adj.size(); s++) {
            if (seen[s]) continue;
            comps++;
            ArrayDeque<Integer> q = new ArrayDeque<>();
            q.offer(s); seen[s] = true;
            while (!q.isEmpty()) {
                int u = q.poll();
                for (int v : adj.get(u)) if (!seen[v]) { seen[v] = true; q.offer(v); }
            }
        }
        return comps;
    }
}`
const COMP_DFS = `import java.util.*;

class ComponentsDfs {
    static int countComponents(List<List<Integer>> adj) {
        boolean[] seen = new boolean[adj.size()];
        int comps = 0;
        for (int s = 0; s < adj.size(); s++) {
            if (seen[s]) continue;
            comps++;
            dfs(s, adj, seen);
        }
        return comps;
    }

    private static void dfs(int u, List<List<Integer>> adj, boolean[] seen) {
        seen[u] = true;
        for (int v : adj.get(u)) if (!seen[v]) dfs(v, adj, seen);
    }
}`
const LARGEST = `import java.util.*;

class LargestRegion {
    static int maxAreaOfIsland(int[][] grid) {
        int best = 0;
        for (int i = 0; i < grid.length; i++)
            for (int j = 0; j < grid[0].length; j++)
                if (grid[i][j] == 1) best = Math.max(best, dfs(grid, i, j));
        return best;
    }

    private static int dfs(int[][] g, int i, int j) {
        if (i < 0 || j < 0 || i >= g.length || j >= g[0].length || g[i][j] != 1) return 0;
        g[i][j] = 0;
        return 1 + dfs(g, i + 1, j) + dfs(g, i - 1, j) + dfs(g, i, j + 1) + dfs(g, i, j - 1);
    }
}`
const FOREST = `import java.util.*;

class CountTreesInForest {
    // Undirected acyclic components = trees. Count components; optionally verify no cycle.
    static int countTrees(List<List<Integer>> adj) {
        boolean[] seen = new boolean[adj.size()];
        int trees = 0;
        for (int s = 0; s < adj.size(); s++) {
            if (seen[s]) continue;
            if (!isTreeComponent(s, adj, seen)) return -1; // has a cycle
            trees++;
        }
        return trees;
    }

    private static boolean isTreeComponent(int s, List<List<Integer>> adj, boolean[] seen) {
        ArrayDeque<int[]> q = new ArrayDeque<>();
        q.offer(new int[]{s, -1});
        seen[s] = true;
        int nodes = 0, edges = 0;
        while (!q.isEmpty()) {
            int[] c = q.poll();
            nodes++;
            for (int v : adj.get(c[0])) {
                edges++;
                if (!seen[v]) { seen[v] = true; q.offer(new int[]{v, c[0]}); }
                else if (v != c[1]) return false;
            }
        }
        return edges / 2 == nodes - 1;
    }
}`
const UNI_SINK = `import java.util.*;

class UniversalSink {
    // Vertex with outdeg 0 and indeg V-1. Probe matrix in O(V).
    static int findUniversalSink(boolean[][] g) {
        int n = g.length, i = 0, j = 0;
        while (i < n && j < n) {
            if (g[i][j]) i++;
            else j++;
        }
        if (i == n) return -1;
        for (int k = 0; k < n; k++) {
            if (k != i && (g[i][k] || !g[k][i])) return -1;
        }
        return i;
    }
}`
const NUM_SINKS = `import java.util.*;

class NumberOfSinks {
    static int countSinks(List<List<Integer>> adj) {
        int sinks = 0;
        for (int u = 0; u < adj.size(); u++) if (adj.get(u).isEmpty()) sinks++;
        return sinks;
    }
}`
const DSU = `import java.util.*;

class UnionFind {
    int[] parent, rank;
    int components;

    UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        components = n;
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (rank[ra] < rank[rb]) parent[ra] = rb;
        else if (rank[ra] > rank[rb]) parent[rb] = ra;
        else { parent[rb] = ra; rank[ra]++; }
        components--;
        return true;
    }
}`
const DSU_PC = `import java.util.*;

class DsuPathCompression {
    int[] parent;

    DsuPathCompression(int n) {
        parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]); // compress
        return parent[x];
    }

    void union(int a, int b) {
        parent[find(a)] = find(b);
    }
}`
const DSU_RANK = `import java.util.*;

class DsuUnionByRank {
    int[] parent, rank;

    DsuUnionByRank(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    void union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return;
        if (rank[ra] < rank[rb]) parent[ra] = rb;
        else if (rank[ra] > rank[rb]) parent[rb] = ra;
        else { parent[rb] = ra; rank[ra]++; }
    }
}`
const DSU_SIZE = `import java.util.*;

class DsuUnionBySize {
    int[] parent, size;

    DsuUnionBySize(int n) {
        parent = new int[n];
        size = new int[n];
        Arrays.fill(size, 1);
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    void union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return;
        if (size[ra] < size[rb]) { parent[ra] = rb; size[rb] += size[ra]; }
        else { parent[rb] = ra; size[ra] += size[rb]; }
    }
}`
const DSU_GRID = `import java.util.*;

class DsuOnGrids {
    static int numIslands2(int m, int n, int[][] positions) {
        UnionFind dsu = new UnionFind(m * n);
        boolean[] land = new boolean[m * n];
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        int islands = 0;
        List<Integer> ans = new ArrayList<>(); // if streaming counts needed
        for (int[] p : positions) {
            int id = p[0] * n + p[1];
            if (land[id]) continue;
            land[id] = true;
            islands++;
            for (int[] d : dirs) {
                int nr = p[0] + d[0], nc = p[1] + d[1];
                if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;
                int nid = nr * n + nc;
                if (land[nid] && dsu.union(id, nid)) islands--;
            }
            ans.add(islands);
        }
        return islands;
    }

    static class UnionFind {
        int[] p;
        UnionFind(int n) { p = new int[n]; for (int i = 0; i < n; i++) p[i] = i; }
        int find(int x) { return p[x] == x ? x : (p[x] = find(p[x])); }
        boolean union(int a, int b) {
            int ra = find(a), rb = find(b);
            if (ra == rb) return false;
            p[ra] = rb; return true;
        }
    }
}`
const DYN_CONN = `import java.util.*;

class DynamicConnectivity {
    UnionFind dsu;

    DynamicConnectivity(int n) { dsu = new UnionFind(n); }

    void addEdge(int u, int v) { dsu.union(u, v); }

    boolean connected(int u, int v) { return dsu.find(u) == dsu.find(v); }

    static class UnionFind {
        int[] parent, rank;
        UnionFind(int n) {
            parent = new int[n]; rank = new int[n];
            for (int i = 0; i < n; i++) parent[i] = i;
        }
        int find(int x) { return parent[x] == x ? x : (parent[x] = find(parent[x])); }
        void union(int a, int b) {
            int ra = find(a), rb = find(b);
            if (ra == rb) return;
            if (rank[ra] < rank[rb]) parent[ra] = rb;
            else if (rank[ra] > rank[rb]) parent[rb] = ra;
            else { parent[rb] = ra; rank[ra]++; }
        }
    }
}`
const DIJK_SET = `import java.util.*;

class DijkstraSet {
    static int[] dijkstra(int src, List<List<int[]>> adj) {
        int[] dist = new int[adj.size()];
        Arrays.fill(dist, Integer.MAX_VALUE / 4);
        dist[src] = 0;
        TreeSet<int[]> set = new TreeSet<>((a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
        set.add(new int[]{0, src});
        while (!set.isEmpty()) {
            int[] cur = set.pollFirst();
            int d = cur[0], u = cur[1];
            if (d != dist[u]) continue;
            for (int[] e : adj.get(u)) {
                int v = e[0], w = e[1];
                if (dist[u] + w < dist[v]) {
                    set.remove(new int[]{dist[v], v});
                    dist[v] = dist[u] + w;
                    set.add(new int[]{dist[v], v});
                }
            }
        }
        return dist;
    }
}`
const DIJK_PATH = `import java.util.*;

class DijkstraPrintPath {
    static List<Integer> shortestPath(int src, int dst, List<List<int[]>> adj) {
        int V = adj.size();
        int[] dist = new int[V], parent = new int[V];
        Arrays.fill(dist, Integer.MAX_VALUE / 4);
        Arrays.fill(parent, -1);
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        dist[src] = 0;
        pq.offer(new int[]{0, src});
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            if (cur[0] != dist[cur[1]]) continue;
            for (int[] e : adj.get(cur[1])) {
                if (dist[cur[1]] + e[1] < dist[e[0]]) {
                    dist[e[0]] = dist[cur[1]] + e[1];
                    parent[e[0]] = cur[1];
                    pq.offer(new int[]{dist[e[0]], e[0]});
                }
            }
        }
        if (dist[dst] >= Integer.MAX_VALUE / 4) return List.of();
        LinkedList<Integer> path = new LinkedList<>();
        for (int v = dst; v != -1; v = parent[v]) path.addFirst(v);
        return path;
    }
}`
const DIALS = `import java.util.*;

class DialsAlgorithm {
    // Shortest paths when edge weights are integers in [0..W].
    static int[] dial(int src, List<List<int[]>> adj, int W) {
        int V = adj.size();
        int[] dist = new int[V];
        Arrays.fill(dist, Integer.MAX_VALUE / 4);
        List<ArrayDeque<Integer>> buckets = new ArrayList<>();
        int maxDist = (V - 1) * W;
        for (int i = 0; i <= maxDist; i++) buckets.add(new ArrayDeque<>());
        dist[src] = 0;
        buckets.get(0).offer(src);
        int idx = 0;
        while (true) {
            while (idx <= maxDist && buckets.get(idx).isEmpty()) idx++;
            if (idx > maxDist) break;
            int u = buckets.get(idx).poll();
            if (dist[u] != idx) continue;
            for (int[] e : adj.get(u)) {
                if (dist[u] + e[1] < dist[e[0]]) {
                    dist[e[0]] = dist[u] + e[1];
                    buckets.get(dist[e[0]]).offer(e[0]);
                }
            }
        }
        return dist;
    }
}`
const DESOPO = `import java.util.*;

class DesopoPape {
    static int[] shortest(int src, List<List<int[]>> adj) {
        int V = adj.size();
        int[] dist = new int[V], state = new int[V]; // 0=not, 1=in deque, 2=done-ish
        Arrays.fill(dist, Integer.MAX_VALUE / 4);
        Deque<Integer> dq = new ArrayDeque<>();
        dist[src] = 0;
        dq.offerLast(src);
        state[src] = 1;
        while (!dq.isEmpty()) {
            int u = dq.pollFirst();
            state[u] = 2;
            for (int[] e : adj.get(u)) {
                if (dist[u] + e[1] < dist[e[0]]) {
                    dist[e[0]] = dist[u] + e[1];
                    if (state[e[0]] == 0) { dq.offerLast(e[0]); state[e[0]] = 1; }
                    else if (state[e[0]] == 2) { dq.offerFirst(e[0]); state[e[0]] = 1; }
                }
            }
        }
        return dist;
    }
}`
const BF_REL = `import java.util.*;

class BellmanFordRelaxation {
    record Edge(int u, int v, int w) {}

    static int[] bellmanFord(int V, int src, List<Edge> edges) {
        int[] dist = new int[V];
        Arrays.fill(dist, Integer.MAX_VALUE / 4);
        dist[src] = 0;
        for (int i = 0; i < V - 1; i++) {
            boolean changed = false;
            for (Edge e : edges) {
                if (dist[e.u] < Integer.MAX_VALUE / 4 && dist[e.u] + e.w < dist[e.v]) {
                    dist[e.v] = dist[e.u] + e.w;
                    changed = true;
                }
            }
            if (!changed) break;
        }
        return dist;
    }
}`
const BF_NEG = `import java.util.*;

class BellmanFordNegativeCycle {
    record Edge(int u, int v, int w) {}

    // Returns null if negative cycle reachable from src; else distances.
    static int[] distancesOrNull(int V, int src, List<Edge> edges) {
        int[] dist = new int[V];
        Arrays.fill(dist, Integer.MAX_VALUE / 4);
        dist[src] = 0;
        for (int i = 0; i < V - 1; i++)
            for (Edge e : edges)
                if (dist[e.u] < Integer.MAX_VALUE / 4 && dist[e.u] + e.w < dist[e.v])
                    dist[e.v] = dist[e.u] + e.w;
        for (Edge e : edges)
            if (dist[e.u] < Integer.MAX_VALUE / 4 && dist[e.u] + e.w < dist[e.v])
                return null;
        return dist;
    }
}`
const FLOYD = `import java.util.*;

class FloydWarshallAllPairs {
    static long[][] allPairs(long[][] g, long INF) {
        int n = g.length;
        long[][] d = new long[n][n];
        for (int i = 0; i < n; i++) d[i] = Arrays.copyOf(g[i], n);
        for (int k = 0; k < n; k++)
            for (int i = 0; i < n; i++)
                if (d[i][k] != INF)
                    for (int j = 0; j < n; j++)
                        if (d[k][j] != INF)
                            d[i][j] = Math.min(d[i][j], d[i][k] + d[k][j]);
        return d;
    }
}`
const JOHNSON = `import java.util.*;

class JohnsonsAlgorithm {
    record Edge(int u, int v, int w) {}

    static long[][] johnson(int V, List<Edge> edges) {
        List<Edge> aug = new ArrayList<>(edges);
        for (int v = 0; v < V; v++) aug.add(new Edge(V, v, 0));
        int[] h = new int[V + 1];
        for (int i = 0; i < V; i++)
            for (Edge e : aug)
                if (h[e.u] + e.w < h[e.v]) h[e.v] = h[e.u] + e.w;
        for (Edge e : aug)
            if (h[e.u] + e.w < h[e.v]) throw new IllegalArgumentException("neg cycle");
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
        for (Edge e : edges) adj.get(e.u).add(new int[]{e.v, e.w + h[e.u] - h[e.v]});
        long[][] ans = new long[V][V];
        for (int s = 0; s < V; s++) {
            int[] d = dijkstra(s, adj);
            for (int t = 0; t < V; t++)
                ans[s][t] = d[t] >= Integer.MAX_VALUE / 4 ? Long.MAX_VALUE / 4 : d[t] - h[s] + h[t];
        }
        return ans;
    }

    private static int[] dijkstra(int src, List<List<int[]>> adj) {
        int[] dist = new int[adj.size()];
        Arrays.fill(dist, Integer.MAX_VALUE / 4);
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        dist[src] = 0; pq.offer(new int[]{0, src});
        while (!pq.isEmpty()) {
            int[] c = pq.poll();
            if (c[0] != dist[c[1]]) continue;
            for (int[] e : adj.get(c[1]))
                if (dist[c[1]] + e[1] < dist[e[0]]) {
                    dist[e[0]] = dist[c[1]] + e[1];
                    pq.offer(new int[]{dist[e[0]], e[0]});
                }
        }
        return dist;
    }
}`
const MULTI_STAGE = `import java.util.*;

class MultistageGraph {
    // Stages 0..k-1; edges only forward. DP shortest from stage 0 source.
    static int shortest(int[][] cost) {
        int n = cost.length;
        int[] dp = new int[n];
        Arrays.fill(dp, Integer.MAX_VALUE / 4);
        dp[n - 1] = 0;
        for (int i = n - 2; i >= 0; i--)
            for (int j = i + 1; j < n; j++)
                if (cost[i][j] < Integer.MAX_VALUE / 4)
                    dp[i] = Math.min(dp[i], cost[i][j] + dp[j]);
        return dp[0];
    }
}`
const BIN_GRAPH = `import java.util.*;

class ShortestPathBinaryGraph {
    // Edges weight 0 or 1: 0-1 BFS with deque.
    static int[] zeroOneBfs(int src, List<List<int[]>> adj) {
        int[] dist = new int[adj.size()];
        Arrays.fill(dist, Integer.MAX_VALUE / 4);
        Deque<Integer> dq = new ArrayDeque<>();
        dist[src] = 0;
        dq.offerFirst(src);
        while (!dq.isEmpty()) {
            int u = dq.pollFirst();
            for (int[] e : adj.get(u)) {
                if (dist[u] + e[1] < dist[e[0]]) {
                    dist[e[0]] = dist[u] + e[1];
                    if (e[1] == 0) dq.offerFirst(e[0]);
                    else dq.offerLast(e[0]);
                }
            }
        }
        return dist;
    }
}`
const MEAN_CYCLE = `import java.util.*;

class MinimumMeanWeightCycle {
    // Karp: min mean = min_v max_0<=k<=n-1 (dp[n][v]-dp[k][v])/(n-k)
    static double minMean(int V, List<int[]> edges) {
        double[][] dp = new double[V + 1][V];
        for (int i = 0; i <= V; i++) Arrays.fill(dp[i], Double.POSITIVE_INFINITY);
        dp[0][0] = 0; // or try all starts; here from 0 for strongly connected
        for (int k = 1; k <= V; k++)
            for (int[] e : edges)
                if (dp[k - 1][e[0]] < Double.POSITIVE_INFINITY)
                    dp[k][e[1]] = Math.min(dp[k][e[1]], dp[k - 1][e[0]] + e[2]);
        double ans = Double.POSITIVE_INFINITY;
        for (int v = 0; v < V; v++) {
            if (dp[V][v] == Double.POSITIVE_INFINITY) continue;
            double best = Double.NEGATIVE_INFINITY;
            for (int k = 0; k < V; k++) {
                if (dp[k][v] == Double.POSITIVE_INFINITY) continue;
                best = Math.max(best, (dp[V][v] - dp[k][v]) / (V - k));
            }
            ans = Math.min(ans, best);
        }
        return ans;
    }
}`
const CONNECT_CITIES = `import java.util.*;

class ConnectAllCities {
    static int minCostConnect(int n, int[][] connections) {
        Arrays.sort(connections, Comparator.comparingInt(a -> a[2]));
        Dsu dsu = new Dsu(n + 1);
        int cost = 0, used = 0;
        for (int[] e : connections) {
            if (dsu.union(e[0], e[1])) {
                cost += e[2];
                if (++used == n - 1) return cost;
            }
        }
        return -1;
    }

    static class Dsu {
        int[] p, r;
        Dsu(int n) { p = new int[n]; r = new int[n]; for (int i = 0; i < n; i++) p[i] = i; }
        int find(int x) { return p[x] == x ? x : (p[x] = find(p[x])); }
        boolean union(int a, int b) {
            int ra = find(a), rb = find(b);
            if (ra == rb) return false;
            if (r[ra] < r[rb]) p[ra] = rb; else if (r[ra] > r[rb]) p[rb] = ra;
            else { p[rb] = ra; r[ra]++; }
            return true;
        }
    }
}`
const TOTAL_ST = `import java.util.*;

class TotalSpanningTrees {
    // Kirchhoff matrix-tree: delete one row/col of Laplacian, compute det.
    static long countSpanningTrees(int[][] laplacian) {
        int n = laplacian.length;
        double[][] a = new double[n - 1][n - 1];
        for (int i = 1; i < n; i++)
            for (int j = 1; j < n; j++) a[i - 1][j - 1] = laplacian[i][j];
        return Math.round(Math.abs(det(a)));
    }

    private static double det(double[][] a) {
        int n = a.length;
        double det = 1;
        for (int i = 0; i < n; i++) {
            int piv = i;
            for (int r = i + 1; r < n; r++) if (Math.abs(a[r][i]) > Math.abs(a[piv][i])) piv = r;
            if (Math.abs(a[piv][i]) < 1e-12) return 0;
            double[] tmp = a[i]; a[i] = a[piv]; a[piv] = tmp;
            if (i != piv) det = -det;
            det *= a[i][i];
            for (int r = i + 1; r < n; r++) {
                double f = a[r][i] / a[i][i];
                for (int c = i; c < n; c++) a[r][c] -= f * a[i][c];
            }
        }
        return det;
    }
}`
const MIN_PROD_ST = `import java.util.*;

class MinimumProductSpanningTree {
    // Minimize product of edge weights: MST on log(weights).
    static double minProduct(int V, int[][] edges) {
        Arrays.sort(edges, Comparator.comparingDouble(e -> Math.log(e[2])));
        Dsu dsu = new Dsu(V);
        double logSum = 0;
        int used = 0;
        for (int[] e : edges) {
            if (dsu.union(e[0], e[1])) {
                logSum += Math.log(e[2]);
                if (++used == V - 1) return Math.exp(logSum);
            }
        }
        return -1;
    }

    static class Dsu {
        int[] p;
        Dsu(int n) { p = new int[n]; for (int i = 0; i < n; i++) p[i] = i; }
        int find(int x) { return p[x] == x ? x : (p[x] = find(p[x])); }
        boolean union(int a, int b) {
            int ra = find(a), rb = find(b);
            if (ra == rb) return false;
            p[ra] = rb; return true;
        }
    }
}`
const REV_DEL = `import java.util.*;

class ReverseDeleteMst {
    static int reverseDelete(int V, List<int[]> edges) {
        edges.sort((a, b) -> Integer.compare(b[2], a[2])); // heavy first
        List<int[]> cur = new ArrayList<>(edges);
        int total = 0;
        for (int[] e : edges) total += e[2];
        for (int[] e : edges) {
            cur.remove(e);
            if (!connected(V, cur)) { cur.add(e); }
            else total -= e[2];
        }
        return total;
    }

    private static boolean connected(int V, List<int[]> edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
        boolean[] seen = new boolean[V];
        ArrayDeque<Integer> q = new ArrayDeque<>();
        q.offer(0); seen[0] = true; int cnt = 1;
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : adj.get(u)) if (!seen[v]) { seen[v] = true; cnt++; q.offer(v); }
        }
        return cnt == V;
    }
}`
const BORUVKA = `import java.util.*;

class BoruvkaMst {
    static int boruvka(int V, List<int[]> edges) {
        int[] parent = new int[V];
        for (int i = 0; i < V; i++) parent[i] = i;
        int components = V, cost = 0;
        while (components > 1) {
            int[] cheapest = new int[V];
            Arrays.fill(cheapest, -1);
            for (int i = 0; i < edges.size(); i++) {
                int[] e = edges.get(i);
                int u = find(parent, e[0]), v = find(parent, e[1]);
                if (u == v) continue;
                if (cheapest[u] == -1 || edges.get(cheapest[u])[2] > e[2]) cheapest[u] = i;
                if (cheapest[v] == -1 || edges.get(cheapest[v])[2] > e[2]) cheapest[v] = i;
            }
            boolean progressed = false;
            for (int i = 0; i < V; i++) {
                if (cheapest[i] == -1) continue;
                int[] e = edges.get(cheapest[i]);
                int u = find(parent, e[0]), v = find(parent, e[1]);
                if (u == v) continue;
                parent[u] = v;
                cost += e[2];
                components--;
                progressed = true;
            }
            if (!progressed) break;
        }
        return cost;
    }

    private static int find(int[] p, int x) {
        return p[x] == x ? x : (p[x] = find(p, p[x]));
    }
}`
const CONDENSE = `import java.util.*;

class CondensationDag {
    static List<List<Integer>> condense(List<List<Integer>> adj, int[] comp) {
        int C = 0;
        for (int c : comp) C = Math.max(C, c + 1);
        Set<Long> seen = new HashSet<>();
        List<List<Integer>> dag = new ArrayList<>();
        for (int i = 0; i < C; i++) dag.add(new ArrayList<>());
        for (int u = 0; u < adj.size(); u++)
            for (int v : adj.get(u))
                if (comp[u] != comp[v]) {
                    long key = (((long) comp[u]) << 32) | (comp[v] & 0xffffffffL);
                    if (seen.add(key)) dag.get(comp[u]).add(comp[v]);
                }
        return dag;
    }
}`
const WALKS_K = `import java.util.*;

class CountWalksKEdges {
    static long[][] walks(long[][] adj, int k) {
        int n = adj.length;
        long[][] res = new long[n][n];
        for (int i = 0; i < n; i++) res[i][i] = 1;
        long[][] base = adj;
        while (k > 0) {
            if ((k & 1) == 1) res = mul(res, base);
            base = mul(base, base);
            k >>= 1;
        }
        return res;
    }

    private static long[][] mul(long[][] a, long[][] b) {
        int n = a.length;
        long[][] c = new long[n][n];
        for (int i = 0; i < n; i++)
            for (int k = 0; k < n; k++) if (a[i][k] != 0)
                for (int j = 0; j < n; j++) c[i][j] += a[i][k] * b[k][j];
        return c;
    }
}`
const STRING_CHAIN = `import java.util.*;

class StringChainCircle {
    // Words form circle if Euler circuit in directed graph of letters (first→last).
    static boolean canFormCircle(String[] words) {
        int[] indeg = new int[26], outdeg = new int[26];
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < 26; i++) adj.add(new ArrayList<>());
        boolean[] used = new boolean[26];
        for (String w : words) {
            int a = w.charAt(0) - 'a', b = w.charAt(w.length() - 1) - 'a';
            adj.get(a).add(b);
            outdeg[a]++; indeg[b]++;
            used[a] = used[b] = true;
        }
        for (int i = 0; i < 26; i++) if (used[i] && indeg[i] != outdeg[i]) return false;
        int start = -1;
        for (int i = 0; i < 26; i++) if (used[i] && outdeg[i] > 0) { start = i; break; }
        if (start == -1) return true;
        boolean[] seen = new boolean[26];
        dfs(start, adj, seen);
        for (int i = 0; i < 26; i++) if (used[i] && outdeg[i] + indeg[i] > 0 && !seen[i]) return false;
        return true;
    }

    private static void dfs(int u, List<List<Integer>> adj, boolean[] seen) {
        seen[u] = true;
        for (int v : adj.get(u)) if (!seen[v]) dfs(v, adj, seen);
    }
}`
const CRITICAL = `import java.util.*;

class CriticalConnections {
    int timer = 0;
    List<List<Integer>> bridges = new ArrayList<>();

    List<List<Integer>> criticalConnections(int n, List<List<Integer>> edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (List<Integer> e : edges) { adj.get(e.get(0)).add(e.get(1)); adj.get(e.get(1)).add(e.get(0)); }
        int[] disc = new int[n], low = new int[n];
        Arrays.fill(disc, -1);
        dfs(0, -1, adj, disc, low);
        return bridges;
    }

    void dfs(int u, int parent, List<List<Integer>> adj, int[] disc, int[] low) {
        disc[u] = low[u] = timer++;
        for (int v : adj.get(u)) {
            if (v == parent) continue;
            if (disc[v] == -1) {
                dfs(v, u, adj, disc, low);
                low[u] = Math.min(low[u], low[v]);
                if (low[v] > disc[u]) bridges.add(List.of(u, v));
            } else low[u] = Math.min(low[u], disc[v]);
        }
    }
}`
const BCC = `import java.util.*;

class BiconnectedComponents {
    int timer = 0;
    Deque<int[]> stack = new ArrayDeque<>();
    List<List<int[]>> comps = new ArrayList<>();

    List<List<int[]>> bcc(List<List<Integer>> adj) {
        int n = adj.size();
        int[] disc = new int[n], low = new int[n];
        Arrays.fill(disc, -1);
        for (int i = 0; i < n; i++) if (disc[i] == -1) dfs(i, -1, adj, disc, low);
        return comps;
    }

    void dfs(int u, int parent, List<List<Integer>> adj, int[] disc, int[] low) {
        disc[u] = low[u] = timer++;
        int children = 0;
        for (int v : adj.get(u)) {
            if (v == parent) continue;
            if (disc[v] == -1) {
                stack.push(new int[]{u, v});
                children++;
                dfs(v, u, adj, disc, low);
                low[u] = Math.min(low[u], low[v]);
                if ((parent == -1 && children > 1) || (parent != -1 && low[v] >= disc[u])) {
                    List<int[]> comp = new ArrayList<>();
                    int[] e;
                    do { e = stack.pop(); comp.add(e); } while (!(e[0] == u && e[1] == v) && !(e[0] == v && e[1] == u));
                    comps.add(comp);
                }
            } else if (disc[v] < disc[u]) {
                stack.push(new int[]{u, v});
                low[u] = Math.min(low[u], disc[v]);
            }
        }
        if (parent == -1 && !stack.isEmpty()) {
            List<int[]> comp = new ArrayList<>();
            while (!stack.isEmpty()) comp.add(stack.pop());
            comps.add(comp);
        }
    }
}`
const MAX_FLOW = `import java.util.*;

class MaxFlow {
    static int edmondsKarp(int[][] cap, int s, int t) {
        int n = cap.length, flow = 0;
        int[][] rem = new int[n][n];
        for (int i = 0; i < n; i++) rem[i] = Arrays.copyOf(cap[i], n);
        while (true) {
            int[] parent = new int[n];
            Arrays.fill(parent, -1);
            ArrayDeque<Integer> q = new ArrayDeque<>();
            q.offer(s); parent[s] = s;
            while (!q.isEmpty() && parent[t] == -1) {
                int u = q.poll();
                for (int v = 0; v < n; v++)
                    if (parent[v] == -1 && rem[u][v] > 0) { parent[v] = u; q.offer(v); }
            }
            if (parent[t] == -1) break;
            int push = Integer.MAX_VALUE;
            for (int v = t; v != s; v = parent[v]) push = Math.min(push, rem[parent[v]][v]);
            for (int v = t; v != s; v = parent[v]) {
                rem[parent[v]][v] -= push;
                rem[v][parent[v]] += push;
            }
            flow += push;
        }
        return flow;
    }
}`
const FF = `import java.util.*;

class FordFulkerson {
    static int maxFlow(int[][] cap, int s, int t) {
        int n = cap.length, flow = 0;
        int[][] rem = new int[n][n];
        for (int i = 0; i < n; i++) rem[i] = Arrays.copyOf(cap[i], n);
        int[] parent = new int[n];
        while (dfsFind(rem, s, t, parent, new boolean[n])) {
            int push = Integer.MAX_VALUE;
            for (int v = t; v != s; v = parent[v]) push = Math.min(push, rem[parent[v]][v]);
            for (int v = t; v != s; v = parent[v]) {
                rem[parent[v]][v] -= push;
                rem[v][parent[v]] += push;
            }
            flow += push;
            Arrays.fill(parent, -1);
        }
        return flow;
    }

    private static boolean dfsFind(int[][] rem, int u, int t, int[] parent, boolean[] seen) {
        if (u == t) return true;
        seen[u] = true;
        for (int v = 0; v < rem.length; v++) {
            if (!seen[v] && rem[u][v] > 0) {
                parent[v] = u;
                if (dfsFind(rem, v, t, parent, seen)) return true;
            }
        }
        return false;
    }
}`
const DINIC = `import java.util.*;

class Dinic {
    static class Edge { int to, rev, cap; Edge(int t, int r, int c) { to = t; rev = r; cap = c; } }
    List<List<Edge>> g;
    int[] level, it;

    Dinic(int n) {
        g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
    }

    void addEdge(int u, int v, int c) {
        g.get(u).add(new Edge(v, g.get(v).size(), c));
        g.get(v).add(new Edge(u, g.get(u).size() - 1, 0));
    }

    int maxFlow(int s, int t) {
        int flow = 0, n = g.size();
        level = new int[n]; it = new int[n];
        while (bfs(s, t)) {
            Arrays.fill(it, 0);
            int f;
            while ((f = dfs(s, t, Integer.MAX_VALUE)) > 0) flow += f;
        }
        return flow;
    }

    boolean bfs(int s, int t) {
        Arrays.fill(level, -1);
        ArrayDeque<Integer> q = new ArrayDeque<>();
        level[s] = 0; q.offer(s);
        while (!q.isEmpty()) {
            int u = q.poll();
            for (Edge e : g.get(u)) if (e.cap > 0 && level[e.to] < 0) {
                level[e.to] = level[u] + 1; q.offer(e.to);
            }
        }
        return level[t] >= 0;
    }

    int dfs(int u, int t, int f) {
        if (u == t) return f;
        for (; it[u] < g.get(u).size(); it[u]++) {
            Edge e = g.get(u).get(it[u]);
            if (e.cap <= 0 || level[e.to] != level[u] + 1) continue;
            int got = dfs(e.to, t, Math.min(f, e.cap));
            if (got > 0) { e.cap -= got; g.get(e.to).get(e.rev).cap += got; return got; }
        }
        return 0;
    }
}`
const BIP_FLOW = `import java.util.*;

class BipartiteMatchingFlow {
    // Left 1..L, right L+1..L+R, s=0, t=L+R+1
    static int maxMatching(int L, int R, List<int[]> edgesLR) {
        int s = 0, t = L + R + 1;
        Dinic dinic = new Dinic(t + 1);
        for (int i = 1; i <= L; i++) dinic.addEdge(s, i, 1);
        for (int j = 1; j <= R; j++) dinic.addEdge(L + j, t, 1);
        for (int[] e : edgesLR) dinic.addEdge(e[0], L + e[1], 1);
        return dinic.maxFlow(s, t);
    }

    // Minimal Dinic stub reused from above pattern — inline Edmonds-Karp for pack:
    static class Dinic {
        static class Edge { int to, rev, cap; Edge(int t, int r, int c){to=t;rev=r;cap=c;} }
        List<List<Edge>> g; int[] level, it;
        Dinic(int n){ g=new ArrayList<>(); for(int i=0;i<n;i++) g.add(new ArrayList<>()); level=new int[n]; it=new int[n]; }
        void addEdge(int u,int v,int c){ g.get(u).add(new Edge(v,g.get(v).size(),c)); g.get(v).add(new Edge(u,g.get(u).size()-1,0)); }
        int maxFlow(int s,int t){ int flow=0; while(bfs(s,t)){ Arrays.fill(it,0); int f; while((f=dfs(s,t,Integer.MAX_VALUE))>0) flow+=f; } return flow; }
        boolean bfs(int s,int t){ Arrays.fill(level,-1); ArrayDeque<Integer> q=new ArrayDeque<>(); level[s]=0; q.offer(s); while(!q.isEmpty()){ int u=q.poll(); for(Edge e:g.get(u)) if(e.cap>0&&level[e.to]<0){ level[e.to]=level[u]+1; q.offer(e.to);} } return level[t]>=0; }
        int dfs(int u,int t,int f){ if(u==t) return f; for(;it[u]<g.get(u).size();it[u]++){ Edge e=g.get(u).get(it[u]); if(e.cap<=0||level[e.to]!=level[u]+1) continue; int got=dfs(e.to,t,Math.min(f,e.cap)); if(got>0){ e.cap-=got; g.get(e.to).get(e.rev).cap+=got; return got;} } return 0; }
    }
}`
const PUSH_REL = `import java.util.*;

class PushRelabel {
    static int maxFlow(int[][] cap, int s, int t) {
        int n = cap.length;
        int[][] flow = new int[n][n];
        int[] height = new int[n], excess = new int[n];
        height[s] = n;
        for (int v = 0; v < n; v++) {
            flow[s][v] = cap[s][v];
            flow[v][s] = -cap[s][v];
            excess[v] = cap[s][v];
        }
        ArrayDeque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) if (i != s && i != t && excess[i] > 0) q.offer(i);
        while (!q.isEmpty()) {
            int u = q.poll();
            boolean pushed = false;
            for (int v = 0; v < n && excess[u] > 0; v++) {
                if (cap[u][v] - flow[u][v] > 0 && height[u] == height[v] + 1) {
                    int delta = Math.min(excess[u], cap[u][v] - flow[u][v]);
                    flow[u][v] += delta; flow[v][u] -= delta;
                    excess[u] -= delta; excess[v] += delta;
                    if (v != s && v != t && excess[v] == delta) q.offer(v);
                    pushed = true;
                }
            }
            if (excess[u] > 0) {
                int minH = Integer.MAX_VALUE;
                for (int v = 0; v < n; v++)
                    if (cap[u][v] - flow[u][v] > 0) minH = Math.min(minH, height[v]);
                if (minH < Integer.MAX_VALUE) height[u] = minH + 1;
                q.offer(u);
            }
        }
        return excess[t];
    }
}`
const EDGE_DISJ = `import java.util.*;

class MaxEdgeDisjointPaths {
    // Unit-capacity edges: max edge-disjoint s-t paths = max flow.
    static int count(int V, List<int[]> edges, int s, int t) {
        int[][] cap = new int[V][V];
        for (int[] e : edges) cap[e[0]][e[1]] += 1;
        return MaxFlow.edmondsKarp(cap, s, t);
    }

    static class MaxFlow {
        static int edmondsKarp(int[][] cap, int s, int t) {
            int n = cap.length, flow = 0;
            int[][] rem = new int[n][n];
            for (int i = 0; i < n; i++) rem[i] = Arrays.copyOf(cap[i], n);
            while (true) {
                int[] parent = new int[n];
                Arrays.fill(parent, -1);
                ArrayDeque<Integer> q = new ArrayDeque<>();
                q.offer(s); parent[s] = s;
                while (!q.isEmpty() && parent[t] == -1) {
                    int u = q.poll();
                    for (int v = 0; v < n; v++)
                        if (parent[v] == -1 && rem[u][v] > 0) { parent[v] = u; q.offer(v); }
                }
                if (parent[t] == -1) break;
                for (int v = t; v != s; v = parent[v]) {
                    rem[parent[v]][v]--; rem[v][parent[v]]++;
                }
                flow++;
            }
            return flow;
        }
    }
}`
const MIN_CUT = `import java.util.*;

class MinSTCut {
    static List<int[]> minCutEdges(int[][] cap, int s, int t) {
        int n = cap.length, flow = 0;
        int[][] rem = new int[n][n];
        for (int i = 0; i < n; i++) rem[i] = Arrays.copyOf(cap[i], n);
        while (true) {
            int[] parent = new int[n];
            Arrays.fill(parent, -1);
            ArrayDeque<Integer> q = new ArrayDeque<>();
            q.offer(s); parent[s] = s;
            while (!q.isEmpty() && parent[t] == -1) {
                int u = q.poll();
                for (int v = 0; v < n; v++)
                    if (parent[v] == -1 && rem[u][v] > 0) { parent[v] = u; q.offer(v); }
            }
            if (parent[t] == -1) break;
            int push = Integer.MAX_VALUE;
            for (int v = t; v != s; v = parent[v]) push = Math.min(push, rem[parent[v]][v]);
            for (int v = t; v != s; v = parent[v]) {
                rem[parent[v]][v] -= push; rem[v][parent[v]] += push;
            }
            flow += push;
        }
        boolean[] reach = new boolean[n];
        ArrayDeque<Integer> q = new ArrayDeque<>();
        q.offer(s); reach[s] = true;
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v = 0; v < n; v++) if (!reach[v] && rem[u][v] > 0) { reach[v] = true; q.offer(v); }
        }
        List<int[]> cut = new ArrayList<>();
        for (int u = 0; u < n; u++) if (reach[u])
            for (int v = 0; v < n; v++) if (!reach[v] && cap[u][v] > 0) cut.add(new int[]{u, v});
        return cut;
    }
}`
const HK = `import java.util.*;

class HopcroftKarp {
    List<List<Integer>> adj;
    int[] pairU, pairV, dist;
    int nU, nV;

    HopcroftKarp(int nU, int nV) {
        this.nU = nU; this.nV = nV;
        adj = new ArrayList<>();
        for (int i = 0; i <= nU; i++) adj.add(new ArrayList<>());
        pairU = new int[nU + 1]; pairV = new int[nV + 1]; dist = new int[nU + 1];
    }

    void addEdge(int u, int v) { adj.get(u).add(v); }

    int maxMatching() {
        Arrays.fill(pairU, 0); Arrays.fill(pairV, 0);
        int matching = 0;
        while (bfs()) for (int u = 1; u <= nU; u++) if (pairU[u] == 0 && dfs(u)) matching++;
        return matching;
    }

    boolean bfs() {
        ArrayDeque<Integer> q = new ArrayDeque<>();
        for (int u = 1; u <= nU; u++) {
            if (pairU[u] == 0) { dist[u] = 0; q.offer(u); }
            else dist[u] = Integer.MAX_VALUE;
        }
        boolean reachableFree = false;
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : adj.get(u)) {
                int u2 = pairV[v];
                if (u2 == 0) reachableFree = true;
                else if (dist[u2] == Integer.MAX_VALUE) { dist[u2] = dist[u] + 1; q.offer(u2); }
            }
        }
        return reachableFree;
    }

    boolean dfs(int u) {
        for (int v : adj.get(u)) {
            int u2 = pairV[v];
            if (u2 == 0 || (dist[u2] == dist[u] + 1 && dfs(u2))) {
                pairU[u] = v; pairV[v] = u; return true;
            }
        }
        dist[u] = Integer.MAX_VALUE;
        return false;
    }
}`
const CHANNEL = `import java.util.*;

class ChannelAssignment {
    // Assign min channels so adjacent transmitters differ: graph coloring (greedy).
    static int[] greedyColor(List<List<Integer>> adj) {
        int n = adj.size();
        int[] color = new int[n];
        Arrays.fill(color, -1);
        for (int u = 0; u < n; u++) {
            boolean[] used = new boolean[n];
            for (int v : adj.get(u)) if (color[v] >= 0) used[color[v]] = true;
            int c = 0;
            while (c < n && used[c]) c++;
            color[u] = c;
        }
        return color;
    }
}`
const KARGER = `import java.util.*;

class KargersAlgorithm {
    static int minCut(int V, List<int[]> edges, int trials) {
        int best = Integer.MAX_VALUE;
        Random rnd = new Random(0);
        for (int t = 0; t < trials; t++) {
            List<int[]> e = new ArrayList<>(edges);
            int[] parent = new int[V], size = new int[V];
            for (int i = 0; i < V; i++) { parent[i] = i; size[i] = 1; }
            int comps = V;
            while (comps > 2) {
                int[] edge = e.get(rnd.nextInt(e.size()));
                int a = find(parent, edge[0]), b = find(parent, edge[1]);
                if (a == b) continue;
                parent[a] = b; size[b] += size[a]; comps--;
            }
            int cut = 0;
            for (int[] edge : e) if (find(parent, edge[0]) != find(parent, edge[1])) cut++;
            best = Math.min(best, cut);
        }
        return best;
    }

    private static int find(int[] p, int x) { return p[x] == x ? x : (p[x] = find(p, p[x])); }
}`
const EULER = `import java.util.*;

class EulerPath {
    // Undirected: 0 or 2 odd-degree vertices; Hierholzer-style.
    static List<Integer> eulerPathUndirected(List<List<int[]>> adj) {
        int odd = 0, start = 0;
        for (int i = 0; i < adj.size(); i++) {
            if (adj.get(i).size() % 2 == 1) { odd++; start = i; }
        }
        if (odd != 0 && odd != 2) return List.of();
        List<Integer> path = new ArrayList<>();
        Deque<Integer> st = new ArrayDeque<>();
        st.push(start);
        int[] idx = new int[adj.size()];
        boolean[] used = new boolean[countEdges(adj)];
        while (!st.isEmpty()) {
            int u = st.peek();
            while (idx[u] < adj.get(u).size() && used[adj.get(u).get(idx[u])[1]]) idx[u]++;
            if (idx[u] == adj.get(u).size()) { path.add(st.pop()); }
            else {
                int[] e = adj.get(u).get(idx[u]++);
                used[e[1]] = true;
                st.push(e[0]);
            }
        }
        Collections.reverse(path);
        return path;
    }

    private static int countEdges(List<List<int[]>> adj) {
        int m = 0;
        for (List<int[]> row : adj) m += row.size();
        return m / 2;
    }
}`
const EULER_DIR = `import java.util.*;

class EulerCircuitDirected {
    static List<Integer> circuit(List<List<Integer>> adj) {
        int n = adj.size();
        int[] indeg = new int[n], outdeg = new int[n];
        for (int u = 0; u < n; u++) {
            outdeg[u] = adj.get(u).size();
            for (int v : adj.get(u)) indeg[v]++;
        }
        for (int i = 0; i < n; i++) if (indeg[i] != outdeg[i]) return List.of();
        int start = 0;
        for (int i = 0; i < n; i++) if (outdeg[i] > 0) { start = i; break; }
        List<Integer> path = new ArrayList<>();
        Deque<Integer> st = new ArrayDeque<>();
        int[] it = new int[n];
        st.push(start);
        while (!st.isEmpty()) {
            int u = st.peek();
            if (it[u] < adj.get(u).size()) st.push(adj.get(u).get(it[u]++));
            else path.add(st.pop());
        }
        Collections.reverse(path);
        return path;
    }
}`
const FLEURY = `import java.util.*;

class FleuryAlgorithm {
    // Prefer non-bridge edges when choosing next edge (slow but classic).
    static List<Integer> fleury(int V, List<int[]> undirectedEdges) {
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
        int id = 0;
        for (int[] e : undirectedEdges) {
            adj.get(e[0]).add(new int[]{e[1], id});
            adj.get(e[1]).add(new int[]{e[0], id});
            id++;
        }
        boolean[] used = new boolean[id];
        int start = 0;
        for (int i = 0; i < V; i++) if (adj.get(i).size() % 2 == 1) { start = i; break; }
        List<Integer> path = new ArrayList<>();
        dfs(start, adj, used, path);
        return path;
    }

    private static void dfs(int u, List<List<int[]>> adj, boolean[] used, List<Integer> path) {
        for (int[] e : adj.get(u)) {
            if (used[e[1]]) continue;
            used[e[1]] = true;
            dfs(e[0], adj, used, path);
        }
        path.add(u);
    }
}`
const HIERHOLZER = `import java.util.*;

class HierholzerAlgorithm {
    static List<Integer> hierholzer(List<List<Integer>> adj) {
        int[] it = new int[adj.size()];
        Deque<Integer> st = new ArrayDeque<>();
        List<Integer> path = new ArrayList<>();
        int start = 0;
        for (int i = 0; i < adj.size(); i++) if (!adj.get(i).isEmpty()) { start = i; break; }
        st.push(start);
        while (!st.isEmpty()) {
            int u = st.peek();
            if (it[u] < adj.get(u).size()) st.push(adj.get(u).get(it[u]++));
            else path.add(st.pop());
        }
        Collections.reverse(path);
        return path;
    }
}`
const CPP = `import java.util.*;

class ChinesePostman {
    // Undirected CPP: pair odd-degree vertices with min-cost matching, then Euler.
    static int chinesePostmanLength(int V, List<int[]> edges) {
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
        int total = 0;
        for (int[] e : edges) {
            adj.get(e[0]).add(new int[]{e[1], e[2]});
            adj.get(e[1]).add(new int[]{e[0], e[2]});
            total += e[2];
        }
        List<Integer> odd = new ArrayList<>();
        for (int i = 0; i < V; i++) if (adj.get(i).size() % 2 == 1) odd.add(i);
        if (odd.isEmpty()) return total;
        // For tiny |odd|, brute min pairing cost via APSP
        int[][] dist = apsp(V, edges);
        int k = odd.size();
        int best = Integer.MAX_VALUE;
        best = minPairing(odd, dist, 0, 0, best);
        return total + best;
    }

    private static int minPairing(List<Integer> odd, int[][] dist, int mask, int acc, int best) {
        int k = odd.size();
        int i = 0;
        while (i < k && ((mask >> i) & 1) == 1) i++;
        if (i == k) return Math.min(best, acc);
        for (int j = i + 1; j < k; j++) {
            if (((mask >> j) & 1) == 1) continue;
            best = minPairing(odd, dist, mask | (1 << i) | (1 << j),
                    acc + dist[odd.get(i)][odd.get(j)], best);
        }
        return best;
    }

    private static int[][] apsp(int V, List<int[]> edges) {
        int INF = Integer.MAX_VALUE / 4;
        int[][] d = new int[V][V];
        for (int i = 0; i < V; i++) { Arrays.fill(d[i], INF); d[i][i] = 0; }
        for (int[] e : edges) {
            d[e[0]][e[1]] = Math.min(d[e[0]][e[1]], e[2]);
            d[e[1]][e[0]] = Math.min(d[e[1]][e[0]], e[2]);
        }
        for (int k = 0; k < V; k++)
            for (int i = 0; i < V; i++)
                for (int j = 0; j < V; j++)
                    if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];
        return d;
    }
}`
const COLOR = `import java.util.*;

class GraphColoring {
    static boolean colorable(List<List<Integer>> adj, int m) {
        int[] color = new int[adj.size()];
        return dfs(0, adj, color, m);
    }

    private static boolean dfs(int u, List<List<Integer>> adj, int[] color, int m) {
        if (u == adj.size()) return true;
        for (int c = 1; c <= m; c++) {
            if (ok(u, c, adj, color)) {
                color[u] = c;
                if (dfs(u + 1, adj, color, m)) return true;
                color[u] = 0;
            }
        }
        return false;
    }

    private static boolean ok(int u, int c, List<List<Integer>> adj, int[] color) {
        for (int v : adj.get(u)) if (color[v] == c) return false;
        return true;
    }
}`
const TSP = `import java.util.*;

class TravelingSalesman {
    static int tsp(int[][] dist) {
        int n = dist.length;
        int N = 1 << n;
        int[][] dp = new int[N][n];
        for (int[] row : dp) Arrays.fill(row, Integer.MAX_VALUE / 4);
        dp[1][0] = 0;
        for (int mask = 1; mask < N; mask++)
            for (int u = 0; u < n; u++) if ((mask & (1 << u)) != 0 && dp[mask][u] < Integer.MAX_VALUE / 4)
                for (int v = 0; v < n; v++) if ((mask & (1 << v)) == 0)
                    dp[mask | (1 << v)][v] = Math.min(dp[mask | (1 << v)][v], dp[mask][u] + dist[u][v]);
        int ans = Integer.MAX_VALUE / 4;
        for (int u = 0; u < n; u++) ans = Math.min(ans, dp[N - 1][u] + dist[u][0]);
        return ans;
    }
}`
const CHAIN_WORD = `import java.util.*;

class ShortestChainTargetWord {
    // Same as word ladder: shortest transformation begin→target via dictionary.
    static int shortestChain(String begin, String target, Set<String> dict) {
        if (!dict.contains(target)) return 0;
        ArrayDeque<String> q = new ArrayDeque<>();
        q.offer(begin);
        int steps = 1;
        Set<String> seen = new HashSet<>();
        seen.add(begin);
        while (!q.isEmpty()) {
            int sz = q.size();
            for (int s = 0; s < sz; s++) {
                String w = q.poll();
                if (w.equals(target)) return steps;
                char[] a = w.toCharArray();
                for (int i = 0; i < a.length; i++) {
                    char old = a[i];
                    for (char c = 'a'; c <= 'z'; c++) {
                        a[i] = c;
                        String next = new String(a);
                        if (dict.contains(next) && seen.add(next)) q.offer(next);
                    }
                    a[i] = old;
                }
            }
            steps++;
        }
        return 0;
    }
}`

export const GRAPH_ALGO_PACK_EXTRA: Record<string, TopicContent> = {
  'a8-graph-representation': graph({
    problem: 'Choose and build a graph representation (adjacency list, matrix, or edge list) that supports the queries your algorithm needs.',
    intuition: 'Sparse graphs favor adjacency lists (O(V+E) space); dense graphs or O(1) edge checks favor matrices; Kruskal-style algorithms iterate an edge list.',
    steps: [
      'Decide directed vs undirected and weighted vs unweighted.',
      'If E ≪ V², build List<List<?>> adjacency.',
      'If you need O(1) hasEdge or Floyd-Warshall, build a V×V matrix.',
      'If sorting edges (MST), keep an edge list of (u,v,w).',
      'Convert between forms only when an algorithm requires it.',
    ],
    codes: [{ caption: 'Convert edges to adj list or matrix', code: GRAPH_REP }],
    time: 'O(V + E) build for lists; O(V²) for matrix',
    space: 'O(V + E) or O(V²)',
    analysis: 'List build scans each edge once; a matrix allocates V² cells regardless of sparsity.',
    notes: [
      'Interview default for sparse graphs is adjacency list.',
    ],
  }),
  'a8-adjacency-list': graph({
    problem: 'Store neighbors of each vertex in a list so traversals scan only existing edges.',
    intuition: 'Each edge appears once (directed) or twice (undirected), so BFS/DFS cost matches the true size of the graph.',
    steps: [
      'Allocate V empty neighbor lists.',
      'For each edge u→v, append v to adj[u] (and u to adj[v] if undirected).',
      'Query neighbors by iterating adj[u].',
      'Optional: store (v,w) pairs for weighted graphs.',
    ],
    codes: [{ caption: 'Build and query adjacency list', code: ADJ_LIST }],
    time: 'O(V + E) build / O(deg(u)) neighbor scan',
    space: 'O(V + E)',
    analysis: 'Construction touches each edge a constant number of times; space stores each endpoint once per direction.',
    notes: [
      'Best default representation in interviews and competitive programming.',
    ],
  }),
  'a8-adjacency-matrix': graph({
    problem: 'Represent the graph as a V×V matrix where entry [u][v] is presence or weight of edge u→v.',
    intuition: 'Random edge queries and dense all-pairs algorithms become O(1) lookups at the cost of Θ(V²) memory.',
    steps: [
      'Allocate V×V array initialized to false/INF.',
      'Set g[u][v] (and g[v][u] if undirected) for each edge.',
      'hasEdge is a single index; neighbor scan loops all V columns.',
      'Use when V is small (≲400) or the algorithm is matrix-native.',
    ],
    codes: [{ caption: 'Build and query adjacency matrix', code: ADJ_MATRIX }],
    time: 'O(V²) build and neighbor scan',
    space: 'O(V²)',
    analysis: 'Every cell is allocated; neighbor iteration always costs Θ(V) even if the graph is sparse.',
    notes: [
      'Prefer list form when V is large and E is sparse.',
    ],
  }),
  'a8-edge-list': graph({
    problem: 'Keep the graph as an array of edges (u, v, w) for algorithms that process edges globally.',
    intuition: 'Sorting or relaxing all edges does not need adjacency; Kruskal and Bellman-Ford read an edge list directly.',
    steps: [
      'Push each (u,v,w) into a list.',
      'Sort by weight when building an MST.',
      'Iterate the full list for Bellman-Ford relaxations.',
      'Convert to adjacency only if you later need neighbor queries.',
    ],
    codes: [{ caption: 'Build edge list', code: EDGE_LIST }],
    time: 'O(E) build; O(E log E) if sorted',
    space: 'O(E)',
    analysis: 'Space is proportional to the number of edges; sorting dominates when required.',
  }),
  'a8-transitive-closure': graph({
    problem: 'Compute whether vertex i can reach vertex j for every pair (i, j) in a directed graph.',
    intuition: 'Warshall’s Boolean DP: if i reaches k and k reaches j, then i reaches j; try every intermediate k.',
    steps: [
      'Copy the adjacency Boolean matrix into reach[][].',
      'For k from 0..V-1, for all i,j: reach[i][j] |= reach[i][k] && reach[k][j].',
      'After all k, reach[i][j] is true iff a path exists.',
      'Optional: run V DFS/BFS from each source instead when E is tiny.',
    ],
    codes: [{ caption: 'Warshall transitive closure', code: TRANSITIVE }],
    time: 'O(V³)',
    space: 'O(V²)',
    analysis: 'Three nested V-loops examine every intermediate; the matrix itself is Θ(V²).',
  }),
  'a8-graph-from-degrees': graph({
    problem: 'Decide whether a sequence of integers can be the degree sequence of a simple undirected graph (and optionally construct it).',
    intuition: 'Havel–Hakimi repeatedly connects the highest remaining degree to the next d vertices and reduces those degrees.',
    steps: [
      'Sort degrees descending.',
      'If max degree is 0, the sequence is graphic.',
      'Let d = deg[0]; zero it; subtract 1 from the next d entries.',
      'If any degree goes negative or d ≥ n, reject.',
      'Repeat until all zeros or failure.',
    ],
    codes: [{ caption: 'Havel–Hakimi graphic sequence test', code: HAVEL }],
    time: 'O(V² log V) with repeated sorts',
    space: 'O(V)',
    analysis: 'Each of up to V rounds may re-sort V integers; the working array stores one integer per vertex.',
    notes: [
      'Erdős–Gállai is an alternative O(V log V) after sorting.',
    ],
  }),
  'a8-clone-graph': graph({
    problem: 'Given a reference to a node in a connected undirected graph, return a deep copy of the entire graph (new nodes, same edges).',
    intuition: 'Map each original node to its clone while traversing; when you see a neighbor, link the clone edge using the map so you never duplicate a node.',
    steps: [
      'Create Map<Node,Node> old→new.',
      'BFS/DFS from start; for each node, create clone if missing.',
      'For each neighbor: ensure clone exists, then add edge clone.neighbors.add(neighborClone).',
      'Return map.get(start).',
    ],
    codes: [{ caption: 'Clone Graph — BFS with map', code: CLONE_GRAPH }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Each node and edge is processed once; the map and queue hold O(V) clones/references.',
  }),
  'a8-clone-dag': graph({
    problem: 'Deep-copy a directed acyclic graph given a start node, producing new nodes with the same outgoing structure.',
    intuition: 'DFS with a memo map clones each node once; children are cloned recursively and attached to the new node.',
    steps: [
      'Map original→clone.',
      'On visiting u, if already cloned return it.',
      'Create clone, insert into map before recursing (handles diamonds).',
      'Recursively clone each successor and append to clone.next.',
      'Return the clone of the start.',
    ],
    codes: [{ caption: 'Clone DAG — DFS memo', code: CLONE_DAG }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Memoization ensures each vertex is allocated once; recursion depth is O(V) in a chain.',
    notes: [
      'Works on general digraphs too if you only need the reachable component.',
    ],
  }),
  'a8-multi-source-bfs': graph({
    problem: 'Compute distances (or earliest infection/arrival times) from the nearest of several simultaneous sources.',
    intuition: 'Enqueue every source at distance 0; standard BFS then expands a joint frontier so the first visit is optimal.',
    steps: [
      'Enqueue all sources with dist 0 and mark them.',
      'While the queue is non-empty, pop u.',
      'For each unseen neighbor, set dist = dist[u]+1 and enqueue.',
      'Answer queries from the dist array (or stop early when a target is reached).',
    ],
    codes: [{ caption: 'Multi-source BFS on a grid', code: MULTI_SRC }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Every cell/vertex is enqueued at most once; each edge/neighbor link is scanned once.',
  }),
  'a8-grid-as-graph': graph({
    problem: 'Treat each grid cell as a vertex with edges to valid 4- or 8-neighbors (optionally skipping blocked cells).',
    intuition: 'Indexing (r,c)→id and scanning D4/D8 turns grid problems into ordinary BFS/DFS on an implicit graph.',
    steps: [
      'Define dimensions n,m and move offsets.',
      'From (r,c), generate neighbors inside bounds.',
      'Skip blocked/water cells per problem rules.',
      'Run BFS/DFS/DSU on these implicit edges.',
      'Map answers back to coordinates.',
    ],
    codes: [{ caption: 'Grid neighbor helper (4-dir)', code: GRID }],
    time: 'O(1) per neighbor check; O(nm) full scan',
    space: 'O(nm) if you mark a visited matrix',
    analysis: 'Each cell has a constant number of neighbors, so traversals are linear in the number of cells.',
  }),
  'a8-flood-fill': graph({
    problem: 'Recolor the connected component of a starting pixel that shares the original color.',
    intuition: 'BFS/DFS from the seed only walks through equal-colored neighbors, rewriting them to the new color.',
    steps: [
      'Read oldColor = image[sr][sc]; abort if it equals newColor.',
      'Enqueue/seed the start and set it to newColor.',
      'Expand to 4-neighbors still equal to oldColor.',
      'Stop when the component is exhausted.',
      'Return the mutated image.',
    ],
    codes: [{ caption: 'Flood fill — BFS', code: FLOOD }],
    time: 'O(nm)',
    space: 'O(nm)',
    analysis: 'Each pixel enters the queue at most once; worst case the whole image is one component.',
  }),
  'a8-number-of-islands': graph({
    problem: 'Count connected components of land cells (\'1\') in a grid, where land connects 4-directionally.',
    intuition: 'Each unvisited land cell starts a DFS/BFS that sinks an entire island; the number of starts is the answer.',
    steps: [
      'Scan every cell.',
      'On land, increment count and DFS/BFS to mark the whole island visited (or sink to \'0\').',
      'Skip water and already-visited land.',
      'Return the count.',
    ],
    codes: [{ caption: 'Number of islands — DFS sink', code: ISLANDS }],
    time: 'O(nm)',
    space: 'O(nm) recursion/queue worst case',
    analysis: 'Every cell is visited a constant number of times across the scan and the floods.',
  }),
  'a8-rotten-oranges': graph({
    problem: 'Given a grid of empty/fresh/rotten oranges, return minutes until all fresh oranges rot, or -1 if impossible.',
    intuition: 'Multi-source BFS from all initially rotten oranges; each BFS layer is one minute of simultaneous rotting.',
    steps: [
      'Enqueue all rotten cells; count fresh.',
      'Process the queue level by level.',
      'Rot each adjacent fresh orange and enqueue it; decrement fresh.',
      'Increment minutes after each level while fresh > 0.',
      'Return minutes if fresh==0 else -1.',
    ],
    codes: [{ caption: 'Rotten oranges — multi-source BFS', code: ROTTEN }],
    time: 'O(nm)',
    space: 'O(nm)',
    analysis: 'Each cell is enqueued at most once; levels correspond to minutes.',
  }),
  'a8-word-ladder': graph({
    problem: 'Find the length of the shortest word transformation sequence from beginWord to endWord, changing one letter at a time with intermediates in the word list.',
    intuition: 'Words are vertices; one-letter differences are edges. BFS yields the minimum number of words in the ladder.',
    steps: [
      'Put the dictionary in a HashSet.',
      'BFS from beginWord with step count.',
      'At each word, try all single-letter mutations.',
      'Enqueue mutations that remain in the set and remove them to avoid revisits.',
      'Return steps when endWord is dequeued (or 0 if unreachable).',
    ],
    codes: [{ caption: 'Word ladder — BFS mutations', code: WORD_LADDER }],
    time: 'O(N · L · 26) with N words length L',
    space: 'O(N · L)',
    analysis: 'Each dictionary word is enqueued once; generating neighbors costs O(L·26) per word.',
  }),
  'a8-snakes-and-ladders': graph({
    problem: 'On an n×n board with snakes/ladders, return the least number of dice throws to reach square n² (or -1).',
    intuition: 'Model squares 1..n² as vertices with edges to +1..+6 (then teleport). BFS finds minimum throws.',
    steps: [
      'Flatten the board labeling into destination[label].',
      'BFS from square 1 with distance 0.',
      'From u, try rolls 1..6; apply snake/ladder destination.',
      'Enqueue unseen landing squares with dist+1.',
      'Return dist when n² is reached.',
    ],
    codes: [{ caption: 'Snakes and ladders — BFS', code: SNAKES }],
    time: 'O(n²)',
    space: 'O(n²)',
    analysis: 'There are n² squares and each has ≤6 outgoing edges, so BFS is linear in board size.',
  }),
  'a8-shortest-path-binary-matrix': graph({
    problem: 'Find the length of the shortest clear path from (0,0) to (n-1,n-1) on a binary grid allowing 8-directional moves (0=open).',
    intuition: 'Unit-cost grid moves ⇒ BFS; mark cells when enqueued so each open cell is processed once.',
    steps: [
      'If start or end is blocked, return -1.',
      'Enqueue (0,0) with length 1 and mark visited.',
      'Pop cells; if end, return length.',
      'Enqueue all open 8-neighbors with length+1.',
      'Return -1 if the queue empties.',
    ],
    codes: [{ caption: 'Shortest path in binary matrix — 8-dir BFS', code: BIN_MATRIX }],
    time: 'O(n²)',
    space: 'O(n²)',
    analysis: 'Each of n² cells is enqueued at most once with a constant neighbor scan.',
  }),
  'a8-pacific-atlantic': graph({
    problem: 'List cells from which water can flow to both the Pacific and Atlantic oceans (flows to equal-or-lower height neighbors).',
    intuition: 'Reverse the flow: multi-source BFS/DFS inland from each ocean; cells reachable from both oceans are answers.',
    steps: [
      'Enqueue/mark all Pacific-border cells; BFS uphill (neighbor height ≥ current).',
      'Repeat from Atlantic borders.',
      'Intersect the two reachable sets.',
      'Emit coordinates in the intersection.',
    ],
    codes: [{ caption: 'Pacific Atlantic — dual multi-source BFS', code: PACIFIC }],
    time: 'O(nm)',
    space: 'O(nm)',
    analysis: 'Each cell is processed at most once per ocean BFS.',
  }),
  'a8-steps-by-knight': graph({
    problem: 'On an N×N chessboard, compute the minimum knight moves from a start square to a target.',
    intuition: 'Knight jumps are unit-cost edges on the board graph; BFS yields the minimum move count.',
    steps: [
      'Enqueue start with 0 steps; mark visited.',
      'Generate 8 knight offsets; keep squares inside [1..N].',
      'Enqueue unseen squares with steps+1.',
      'Return steps when the target is dequeued.',
    ],
    codes: [{ caption: 'Minimum knight moves — BFS', code: KNIGHT }],
    time: 'O(N²)',
    space: 'O(N²)',
    analysis: 'At most N² squares enter the queue; each expands to ≤8 neighbors.',
  }),
  'a8-water-jug': graph({
    problem: 'Decide whether you can measure exactly z liters using jugs of capacity x and y (fill, empty, pour).',
    intuition: 'States (a,b) are vertices; six operations are edges. BFS/DFS searches the finite state space (or use Bezout: z multiple of gcd if z≤x+y).',
    steps: [
      'Start from (0,0).',
      'Generate fill-A, fill-B, empty-A, empty-B, pour A→B, pour B→A.',
      'Hash visited states.',
      'Succeed if a==z or b==z or a+b==z.',
      'Fail when the queue/stack is exhausted.',
    ],
    codes: [{ caption: 'Water jug — BFS on states', code: WATER }],
    time: 'O(xy)',
    space: 'O(xy)',
    analysis: 'There are (x+1)(y+1) states; each has constant out-degree.',
    notes: [
      'Math shortcut: return z<=x+y && z%gcd(x,y)==0 (with z==0 true).',
    ],
  }),
  'a8-boggle': graph({
    problem: 'Find all dictionary words that can be formed by adjacent (usually 4-dir) cells on a letter board without reusing a cell in one word.',
    intuition: 'DFS/backtracking from each cell, pruned by a trie of the dictionary so dead prefixes abort early.',
    steps: [
      'Insert all words into a trie.',
      'DFS from every board cell following trie edges.',
      'Mark the cell visited, recurse to neighbors, then unmark.',
      'When a trie node stores a word, record it (and optionally erase to dedupe).',
      'Return the collected words.',
    ],
    codes: [{ caption: 'Boggle / word search II — trie DFS', code: BOGGLE }],
    time: 'O(nm · 4^L) worst case with trie pruning',
    space: 'O(W · L) trie + O(L) recursion',
    analysis: 'Without a trie every path is explored; the trie cuts branches that match no prefix.',
  }),
  'a8-cycles-of-length-n': graph({
    problem: 'Count simple cycles of exact length n in an undirected graph.',
    intuition: 'Backtracking from each start builds paths of length n-1; a closing edge to the start completes a cycle (divide by 2 to fix orientation).',
    steps: [
      'For each start vertex, DFS paths that only use higher-index vertices to reduce duplicates.',
      'Track vertices on the current path.',
      'When remaining length is 0, check adjacency back to start.',
      'Sum counts and divide by 2 for undirected graphs.',
    ],
    codes: [{ caption: 'Count cycles of length n — backtracking', code: CYCLES_N }],
    time: 'O(V · Δ^{n-1}) roughly',
    space: 'O(V) path state',
    analysis: 'Exponential in n; each partial path tries neighbors of the current tip.',
  }),
  'a8-cycle-using-colors': graph({
    problem: 'Detect a cycle in a directed graph using three-color DFS (WHITE/GRAY/BLACK).',
    intuition: 'A GRAY neighbor is an ancestor on the active recursion stack, which closes a directed cycle.',
    steps: [
      'Color all vertices WHITE.',
      'DFS: mark u GRAY on entry.',
      'If a neighbor is GRAY, report a cycle.',
      'Recurse into WHITE neighbors; ignore BLACK.',
      'Mark u BLACK on exit; scan all components.',
    ],
    codes: [{ caption: 'Directed cycle — three-color DFS', code: COLORS }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Each vertex is colored at most twice and each edge is examined once.',
  }),
  'a8-negative-cycle-detection': graph({
    problem: 'Detect whether a weighted digraph contains a negative-weight cycle (anywhere, or reachable from a source).',
    intuition: 'After V−1 Bellman-Ford relaxations, any further successful relaxation proves a negative cycle.',
    steps: [
      'Initialize distances (all 0 to detect any cycle; or 0 at src and INF elsewhere).',
      'Relax all edges V−1 times.',
      'Try one more relaxation pass.',
      'If any edge still improves a distance, a negative cycle exists.',
      'Optional: mark nodes affected and walk parents to recover the cycle.',
    ],
    codes: [{ caption: 'Negative cycle — Bellman-Ford extra pass', code: NEG_CYCLE }],
    time: 'O(VE)',
    space: 'O(V)',
    analysis: 'V·E relaxations dominate; distance array is O(V).',
  }),
  'a8-dag-dp': graph({
    problem: 'Solve path DP on a DAG (shortest/longest/count paths) by processing vertices in topological order.',
    intuition: 'In a topo order every predecessor is finalized before u, so dp[u] combines completed neighbor values safely.',
    steps: [
      'Compute a topological order (Kahn or DFS).',
      'Initialize dp at sources (0 or 1 depending on the problem).',
      'For u in topo order, relax/update each outgoing edge u→v.',
      'Read dp at the target(s).',
      'Abort if the graph is not a DAG.',
    ],
    codes: [{ caption: 'DAG DP — topo + longest path', code: DAG_DP }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Topo sort plus one edge scan is linear; dp stores one value per vertex.',
  }),
  'a8-topo-departure-time': graph({
    problem: 'Produce a topological order by sorting vertices by DFS finishing (departure) time descending.',
    intuition: 'A vertex finishes only after all descendants finish, so reverse finish order is a valid topo order on a DAG.',
    steps: [
      'Run DFS with three colors / states.',
      'Push u onto a stack when its DFS finishes.',
      'If a GRAY edge appears, the graph has a cycle — no topo order.',
      'Pop the stack to emit the order.',
      'Handle all components.',
    ],
    codes: [{ caption: 'Topo sort — DFS finish times', code: TOPO_DEP }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Each vertex finishes once; the explicit stack holds O(V) results.',
  }),
  'a8-all-topological-sorts': graph({
    problem: 'Enumerate every valid topological ordering of a DAG.',
    intuition: 'Backtracking always appends a current zero-indegree unused vertex, decrements neighbors, then restores state.',
    steps: [
      'Compute indegrees.',
      'Choose any unused u with indegree 0.',
      'Append u, decrement successors, recurse.',
      'Backtrack: restore indegrees and remove u.',
      'Record a permutation when its length is V.',
    ],
    codes: [{ caption: 'All topological sorts — backtracking', code: ALL_TOPO }],
    time: 'O(V! · (V+E)) worst case',
    space: 'O(V)',
    analysis: 'Output-sensitive: dense antichains explode the number of permutations.',
  }),
  'a8-max-edges-keep-dag': graph({
    problem: 'Compute the maximum number of directed edges on V labeled vertices that still form a DAG.',
    intuition: 'Any total order i₁…i_V allows all forward edges i_a→i_b for a<b, giving V(V−1)/2 edges and no cycles.',
    steps: [
      'Pick any permutation of vertices as topo order.',
      'Add every edge from earlier to later vertices.',
      'Count = V(V−1)/2.',
      'Adding any backward edge would create a cycle with a path forward.',
    ],
    codes: [{ caption: 'Maximum edges in a DAG', code: MAX_EDGES_DAG }],
    time: 'O(1) count; O(V²) to emit edges',
    space: 'O(1) / O(V²) if listing',
    analysis: 'The closed form follows from choosing 2 vertices out of V for each directed forward edge.',
  }),
  'a8-longest-path-dag': graph({
    problem: 'Find the length of the longest path in a weighted DAG (or report distances from sources).',
    intuition: 'Negating weights turns longest into shortest, or directly take max while relaxing in topo order.',
    steps: [
      'Compute indegrees and Kahn topo order.',
      'Initialize dist[sources]=0 (or 0 for all if any start).',
      'For u in order, dist[v]=max(dist[v], dist[u]+w(u,v)).',
      'Answer is max over dist[].',
      'Ensure the graph is acyclic.',
    ],
    codes: [{ caption: 'Longest path in DAG — topo DP', code: LONGEST_DAG }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Each edge relaxes once after topo sort; linear time unlike general graphs (NP-hard).',
  }),
  'a8-find-itinerary': graph({
    problem: 'Reconstruct the lexicographically smallest itinerary that uses each ticket exactly once (Euler path in a digraph of airports).',
    intuition: 'Hierholzer on a min-heap of destinations always consumes the smallest unused edge first; post-order gives the route.',
    steps: [
      'Build multimap airport → PriorityQueue of destinations.',
      'Stack-walk from JFK: if unused edges remain, push the next smallest dest; else prepend airport to the route.',
      'Continue until the stack is empty.',
      'Return the route list.',
    ],
    codes: [{ caption: 'Reconstruct itinerary — Hierholzer + heap', code: ITINERARY }],
    time: 'O(E log E)',
    space: 'O(E)',
    analysis: 'Each ticket is pushed/popped once; heap operations cost log of the out-degree.',
  }),
  'a8-course-schedule': graph({
    problem: 'Determine whether you can finish all courses given prerequisite pairs (detect cycle / find topo order in a digraph).',
    intuition: 'If Kahn’s algorithm processes all n courses, indegrees hit zero without leftover — the graph is a DAG.',
    steps: [
      'Build adjacency and indegree from prerequisites.',
      'Enqueue courses with indegree 0.',
      'Pop u, decrement neighbors, enqueue new zeros.',
      'Return true iff processed count equals n.',
    ],
    codes: [{ caption: 'Course schedule — Kahn cycle check', code: COURSE }],
    time: 'O(V + E)',
    space: 'O(V + E)',
    analysis: 'Each course and prerequisite edge is handled a constant number of times.',
  }),
  'a8-two-clique-problem': graph({
    problem: 'Decide whether the vertex set of an undirected graph can be split into two cliques.',
    intuition: 'G is a union of two cliques iff the complement Ḡ is bipartite (each part becomes a clique in G).',
    steps: [
      'Build the complement edges (pairs missing in G).',
      '2-color the complement with BFS/DFS.',
      'If a conflict appears, return false.',
      'Otherwise the two color classes are the cliques.',
    ],
    codes: [{ caption: 'Two-clique via complement bipartite', code: TWO_CLIQUE }],
    time: 'O(V²)',
    space: 'O(V²)',
    analysis: 'Complement construction dominates for adjacency-matrix input; coloring is O(V²) on the dense complement.',
  }),
  'a8-connected-components': graph({
    problem: 'Count (or label) connected components in an undirected graph.',
    intuition: 'Each unvisited vertex starts a traversal that marks exactly one component.',
    steps: [
      'Initialize seen[V]=false.',
      'For each vertex u, if unseen, increment component count.',
      'BFS or DFS from u marking all reachable vertices.',
      'Return the count (or the label array).',
    ],
    codes: [{ caption: 'Connected components — BFS', code: COMP_BFS }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Every vertex and edge is processed a constant number of times across all starts.',
  }),
  'a8-components-bfs': graph({
    problem: 'Count connected components using BFS from every unseen vertex.',
    intuition: 'A FIFO expansion from u reaches exactly the component containing u without recursion.',
    steps: [
      'Loop u = 0..V-1.',
      'Skip seen vertices.',
      'Increment count; enqueue u and mark seen.',
      'Drain the queue, marking/enqueueing unseen neighbors.',
    ],
    codes: [{ caption: 'Components via BFS', code: COMP_BFS }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Queue and seen arrays are O(V); total neighbor scans sum to O(E).',
  }),
  'a8-components-dfs': graph({
    problem: 'Count connected components using DFS from every unseen vertex.',
    intuition: 'Recursive (or stack) DFS marks the same reachability set as BFS for undirected graphs.',
    steps: [
      'Loop over all vertices.',
      'On an unseen u, increment count and DFS-mark its component.',
      'In DFS, mark on entry and recurse to unseen neighbors.',
      'Return the count.',
    ],
    codes: [{ caption: 'Components via DFS', code: COMP_DFS }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Identical asymptotics to BFS; recursion depth can be O(V) on a path.',
  }),
  'a8-largest-region': graph({
    problem: 'Find the size of the largest 4-connected region of 1s in a binary grid (max area island).',
    intuition: 'Flood-fill each unvisited land cell, counting cells; keep the global maximum count.',
    steps: [
      'Scan the grid for a land cell.',
      'DFS/BFS that cell, counting and clearing/visiting.',
      'Update answer with the region size.',
      'Continue until all land is processed.',
    ],
    codes: [{ caption: 'Largest region — DFS area', code: LARGEST }],
    time: 'O(nm)',
    space: 'O(nm)',
    analysis: 'Each cell contributes to at most one flood fill.',
  }),
  'a8-count-trees-in-forest': graph({
    problem: 'Count how many tree components exist in an undirected graph (a forest); reject if any component has a cycle.',
    intuition: 'A component is a tree iff it is connected and |E_comp| = |V_comp| − 1 (equivalently: no cycle during traversal).',
    steps: [
      'For each unseen vertex, traverse its component.',
      'Detect a cycle via parent-aware BFS/DFS; if found, fail.',
      'Verify edge count equals nodes−1.',
      'Increment tree count per successful component.',
    ],
    codes: [{ caption: 'Count trees in a forest', code: FOREST }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'One traversal per component examines each incident edge a constant number of times.',
  }),
  'a8-universal-sink': graph({
    problem: 'Find a universal sink in a directed graph: out-degree 0 and in-degree V−1 (or report none), ideally in O(V) matrix probes.',
    intuition: 'Walk i,j on the matrix: an edge i→j means i cannot be the sink (advance i); otherwise j cannot (advance j). Verify the candidate in O(V).',
    steps: [
      'Start at (i,j)=(0,0).',
      'While both < V: if g[i][j] then i++ else j++.',
      'If i==V there is no candidate.',
      'Verify row i all false (except diagonal) and column i all true.',
      'Return i or -1.',
    ],
    codes: [{ caption: 'Universal sink — matrix walk', code: UNI_SINK }],
    time: 'O(V)',
    space: 'O(1) extra',
    analysis: 'The walk makes <2V probes; verification scans one row and one column.',
  }),
  'a8-number-of-sinks': graph({
    problem: 'Count sink vertices in a digraph: vertices with out-degree 0.',
    intuition: 'A sink has an empty adjacency list (no outgoing edges); scan out-degrees once.',
    steps: [
      'Build or use the adjacency list.',
      'Initialize sinks=0.',
      'For each u, if adj[u] is empty, increment.',
      'Return sinks.',
    ],
    codes: [{ caption: 'Count out-degree-zero sinks', code: NUM_SINKS }],
    time: 'O(V)',
    space: 'O(1)',
    analysis: 'Only out-degree emptiness is checked; no edge scan beyond list lengths already known.',
    notes: [
      'Some texts also require indegree > 0; adjust the predicate if needed.',
    ],
  }),
  'a8-union-find': graph({
    problem: 'Maintain a partition of elements under Union and Find (same-set) queries, typically for connectivity and Kruskal.',
    intuition: 'Each set is a rooted tree; find follows parents to the root, union links roots (with rank/size + path compression for speed).',
    steps: [
      'parent[i]=i initially.',
      'find(x): recurse/iterate to root; optionally compress.',
      'union(a,b): link find(a) and find(b) if distinct.',
      'Track component count on successful unions.',
    ],
    codes: [{ caption: 'Union-Find with rank + path compression', code: DSU }],
    time: 'Amortized ≈ O(α(V)) per op',
    space: 'O(V)',
    analysis: 'Path compression and union-by-rank make the inverse-Ackermann bound; arrays store parent/rank.',
  }),
  'a8-dsu-path-compression': graph({
    problem: 'Speed up Find by flattening the path to the root on each lookup.',
    intuition: 'After find(x), every node on the path can point directly at the root, so later finds are nearly O(1).',
    steps: [
      'Implement find recursively or with two passes.',
      'When parent[x]!=x, set parent[x]=find(parent[x]).',
      'Return the root.',
      'Combine with union-by-rank/size for full efficiency.',
    ],
    codes: [{ caption: 'Path compression Find', code: DSU_PC }],
    time: 'Amortized ≈ O(α(V))',
    space: 'O(V)',
    analysis: 'Compression does not change set membership; it only shortens future paths.',
  }),
  'a8-dsu-union-by-rank': graph({
    problem: 'Link the root with smaller tree rank under the root with larger rank to keep trees shallow.',
    intuition: 'Rank is an upper bound on height; attaching the shorter tree prevents tall chains.',
    steps: [
      'Maintain rank[root] (starts at 0).',
      'On union, compare ranks of roots.',
      'Attach smaller rank under larger; if equal, attach either and increment the new root’s rank.',
      'Always find roots before linking.',
    ],
    codes: [{ caption: 'Union by rank', code: DSU_RANK }],
    time: 'Amortized ≈ O(α(V)) with compression',
    space: 'O(V)',
    analysis: 'Rank changes only on equal-rank merges; with compression, operations are nearly constant.',
  }),
  'a8-dsu-union-by-size': graph({
    problem: 'Link the smaller set under the larger set using explicit component sizes.',
    intuition: 'Keeping the larger root reduces average depth similarly to rank; size also answers component-size queries.',
    steps: [
      'Maintain size[root].',
      'find both roots; if equal, return.',
      'Attach the smaller size under the larger and add sizes.',
      'Use path compression in find.',
    ],
    codes: [{ caption: 'Union by size', code: DSU_SIZE }],
    time: 'Amortized ≈ O(α(V))',
    space: 'O(V)',
    analysis: 'Each union updates two roots’ metadata; arrays are linear in V.',
  }),
  'a8-dsu-on-grids': graph({
    problem: 'Maintain connectivity of land cells on a grid as cells are added online (e.g. number of islands II).',
    intuition: 'Map (r,c)→id = r*m+c; when a land cell appears, union it with already-landed 4-neighbors and adjust the island count.',
    steps: [
      'Allocate DSU over n*m cells.',
      'On add(r,c), if already land skip; else land++ / islands++.',
      'For each land neighbor, union; decrement islands when a merge succeeds.',
      'Record the current island count after each add.',
    ],
    codes: [{ caption: 'DSU on grids — islands II style', code: DSU_GRID }],
    time: 'O(K α(nm)) for K additions',
    space: 'O(nm)',
    analysis: 'Each addition does ≤4 unions; DSU ops are nearly O(1).',
  }),
  'a8-dynamic-connectivity': graph({
    problem: 'Answer whether two vertices are in the same connected component while edges are being inserted.',
    intuition: 'DSU supports incremental unions; connected(u,v) iff find(u)==find(v). (Deletions need richer structures.)',
    steps: [
      'Initialize DSU with V singleton components.',
      'addEdge(u,v): union(u,v).',
      'connected(u,v): compare finds.',
      'Optional: expose component count.',
    ],
    codes: [{ caption: 'Incremental dynamic connectivity — DSU', code: DYN_CONN }],
    time: 'O(α(V)) per union/find',
    space: 'O(V)',
    analysis: 'Insert-only connectivity is exactly Union-Find; fully dynamic delete is harder.',
  }),
  'a8-dijkstra-set': graph({
    problem: 'Compute single-source shortest paths with non-negative weights using an ordered set (balanced BST) as the priority queue.',
    intuition: 'The set stores (dist,vertex) keys; extracting the minimum unfinished distance and relaxing neighbors mirrors classic Dijkstra.',
    steps: [
      'Set dist[src]=0, others INF; insert (0,src).',
      'While the set is non-empty, take the smallest (d,u).',
      'Skip stale d!=dist[u].',
      'For each edge u→v, if dist[u]+w improves dist[v], erase old key, update, insert new key.',
      'Return dist[].',
    ],
    codes: [{ caption: 'Dijkstra with TreeSet', code: DIJK_SET }],
    time: 'O((V + E) log V)',
    space: 'O(V)',
    analysis: 'Each successful decrease-key is a log V erase/insert; each vertex is extracted once at its final distance.',
  }),
  'a8-dijkstra-print-path': graph({
    problem: 'Return one shortest path (vertex list) from src to dst under non-negative weights.',
    intuition: 'Parent pointers recorded on each successful relaxation reconstruct the path by walking dst→src.',
    steps: [
      'Run Dijkstra with parent[v]=u when dist[v] improves via u.',
      'If dist[dst] is INF, return empty.',
      'Walk parent from dst until src, collecting vertices.',
      'Reverse to obtain src→…→dst.',
    ],
    codes: [{ caption: 'Dijkstra with path reconstruction', code: DIJK_PATH }],
    time: 'O((V + E) log V)',
    space: 'O(V)',
    analysis: 'Same as Dijkstra plus O(V) parent storage and O(path length) reconstruction.',
  }),
  'a8-dials-algorithm': graph({
    problem: 'Shortest paths for integer edge weights in [0..W] using bucket queues (Dial’s algorithm).',
    intuition: 'Distance keys fall in 0..(V−1)W; buckets[d] hold vertices currently labeled d, so extract-min walks sequentially.',
    steps: [
      'Create buckets sized (V−1)·W+1.',
      'Place src in bucket 0.',
      'Advance index to the next non-empty bucket; pop u.',
      'Relax neighbors into buckets[newDist].',
      'Continue until buckets are exhausted.',
    ],
    codes: [{ caption: 'Dial’s algorithm — bucket queue', code: DIALS }],
    time: 'O(V · W + E)',
    space: 'O(V · W + V)',
    analysis: 'Scanning empty buckets costs O(VW); each edge relaxes at most once per improvement pattern like 0-1 BFS generalizations.',
  }),
  'a8-desopo-pape': graph({
    problem: 'Single-source shortest paths (no negative cycles) using a deque: newly improved vertices go to the back if never seen, else to the front.',
    intuition: 'Hybrid of Bellman-Ford and queue-based methods; often fast in practice though worst-case exponential without care.',
    steps: [
      'dist[src]=0; push src to the deque; state=in-queue.',
      'Pop front u; mark out-of-queue.',
      'On improvement of v: if never in queue, push back; if already processed, push front.',
      'Repeat until the deque is empty.',
      'Assume no negative cycle.',
    ],
    codes: [{ caption: 'D’Esopo–Pape deque SP', code: DESOPO }],
    time: 'O(VE) typical bound used in contests; can be worse',
    space: 'O(V)',
    analysis: 'Each successful relaxation may reinsert a vertex; practical graphs often requeue few times.',
    notes: [
      'Prefer Dijkstra/Bellman-Ford when you need guaranteed bounds.',
    ],
  }),
  'a8-bellman-ford-relaxation': graph({
    problem: 'Compute single-source shortest paths allowing negative edge weights (no negative cycle reachable from the source).',
    intuition: 'Relaxing every edge |V|−1 times propagates the cheapest simple-path distances.',
    steps: [
      'Set dist[src]=0, others INF.',
      'Repeat V−1 times: for every edge u→v, dist[v]=min(dist[v], dist[u]+w).',
      'Optional early stop if a round makes no changes.',
      'Return dist (INF means unreachable).',
    ],
    codes: [{ caption: 'Bellman-Ford relaxation', code: BF_REL }],
    time: 'O(VE)',
    space: 'O(V)',
    analysis: 'Up to V−1 rounds each scan all E edges; distance array is O(V).',
  }),
  'a8-bellman-ford-negative-cycle': graph({
    problem: 'After Bellman-Ford, detect a negative cycle reachable from the source (and optionally abort distances).',
    intuition: 'A successful relaxation on the V-th pass means a cheaper non-simple path, hence a negative cycle.',
    steps: [
      'Run V−1 relaxation rounds from src.',
      'Perform one more pass over all edges.',
      'If any dist[v] improves, return “negative cycle” (null).',
      'Otherwise return the distance array.',
    ],
    codes: [{ caption: 'Bellman-Ford negative-cycle check', code: BF_NEG }],
    time: 'O(VE)',
    space: 'O(V)',
    analysis: 'Same asymptotic cost as Bellman-Ford; the extra pass is one more O(E) sweep.',
  }),
  'a8-floyd-warshall-all-pairs': graph({
    problem: 'Compute shortest paths between all pairs of vertices (weights may be negative, no neg cycle needed for distances).',
    intuition: 'DP on intermediate vertices: try whether the best i→j path is allowed to go through k.',
    steps: [
      'Copy the weight matrix into dist (INF = no edge).',
      'For k in 0..V-1, for all i,j: dist[i][j]=min(dist[i][j], dist[i][k]+dist[k][j]).',
      'Optional: if dist[i][i]<0, vertex i is on a negative cycle.',
      'Return the V×V matrix.',
    ],
    codes: [{ caption: 'Floyd–Warshall all-pairs', code: FLOYD }],
    time: 'O(V³)',
    space: 'O(V²)',
    analysis: 'Three nested loops over V; the distance matrix uses Θ(V²) memory.',
  }),
  'a8-johnsons-algorithm': graph({
    problem: 'All-pairs shortest paths on sparse graphs that may have negative edges but no negative cycles.',
    intuition: 'Bellman-Ford potentials reweight edges to non-negative; then Dijkstra from every source; subtract potentials to recover real distances.',
    steps: [
      'Add a super-source with 0-weight edges to all V.',
      'Bellman-Ford to get potentials h[v]; fail on neg cycle.',
      'Reweight w\'(u,v)=w(u,v)+h[u]-h[v] ≥ 0.',
      'Dijkstra from each source on w\'.',
      'True dist[u,v]=d\'[u,v]-h[u]+h[v].',
    ],
    codes: [{ caption: 'Johnson’s all-pairs algorithm', code: JOHNSON }],
    time: 'O(VE + V² log V) with heap Dijkstra',
    space: 'O(V² + E)',
    analysis: 'One BF plus V Dijkstras dominate; output matrix is Θ(V²).',
  }),
  'a8-multistage-graph': graph({
    problem: 'Shortest path in a multistage graph where vertices are partitioned into stages and edges only go forward to later stages.',
    intuition: 'DP from the sink backward (or source forward): cost[i]=min_j cost(i→j)+cost[j] over legal forward edges.',
    steps: [
      'Label stages 0..k-1; sink has cost 0.',
      'Process vertices from last stage to first.',
      'For each vertex, minimize edge weight + already-computed successor cost.',
      'Answer is cost at the unique source.',
    ],
    codes: [{ caption: 'Multistage graph DP', code: MULTI_STAGE }],
    time: 'O(V²) dense; O(V + E) on adj lists',
    space: 'O(V)',
    analysis: 'Each forward edge is considered once in the DP order.',
  }),
  'a8-shortest-path-binary-graph': graph({
    problem: 'Shortest paths when every edge weight is 0 or 1.',
    intuition: '0-1 BFS: push improved neighbors to the front of a deque on 0-weight edges and to the back on 1-weight edges.',
    steps: [
      'dist[src]=0; deque offerFirst(src).',
      'Pop front u.',
      'For edge u→v with weight w∈{0,1}, if dist[u]+w improves dist[v], update and offerFirst (w=0) or offerLast (w=1).',
      'Return dist[].',
    ],
    codes: [{ caption: '0-1 BFS shortest path', code: BIN_GRAPH }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Like Dijkstra with two buckets; each edge causes O(1) work amortized when distances only decrease to final values carefully.',
  }),
  'a8-minimum-mean-weight-cycle': graph({
    problem: 'Find the minimum mean weight of a directed cycle (Karp’s algorithm).',
    intuition: 'DP dp[k][v]=min weight of a v-walk with k edges; the min mean equals min_v max_k (dp[n][v]-dp[k][v])/(n-k).',
    steps: [
      'Compute dp[k][v] for k=0..n via edge relaxations.',
      'For each v reachable at step n, compute max over k of the normalized difference.',
      'Take the minimum over v.',
      'That value is the minimum cycle mean.',
    ],
    codes: [{ caption: 'Karp minimum mean cycle', code: MEAN_CYCLE }],
    time: 'O(VE)',
    space: 'O(V²)',
    analysis: 'n layers of relaxing E edges fill an (n+1)×V table.',
  }),
  'a8-connect-all-cities': graph({
    problem: 'Connect all cities with minimum total cable cost given possible bidirectional weighted links (MST); return -1 if impossible.',
    intuition: 'Kruskal: sort connections by cost and union endpoints until n−1 edges succeed.',
    steps: [
      'Sort edges by ascending cost.',
      'DSU over n cities.',
      'Add an edge if it merges components; add its cost.',
      'If n−1 merges occur, return total cost; else -1.',
    ],
    codes: [{ caption: 'Connect cities — Kruskal MST', code: CONNECT_CITIES }],
    time: 'O(E log E)',
    space: 'O(V)',
    analysis: 'Sorting dominates; each union/find is nearly O(1).',
  }),
  'a8-total-spanning-trees': graph({
    problem: 'Count the number of distinct spanning trees of a labeled undirected graph.',
    intuition: 'Kirchhoff matrix-tree theorem: delete any row/column of the Laplacian and take the determinant.',
    steps: [
      'Build Laplacian L: L[i][i]=deg(i), L[i][j]=-1 for edges.',
      'Delete row 0 and column 0 (any index works).',
      'Compute det of the (V−1)×(V−1) minor.',
      'Round to the nearest integer for the count.',
    ],
    codes: [{ caption: 'Count spanning trees — Kirchhoff', code: TOTAL_ST }],
    time: 'O(V³) via determinant',
    space: 'O(V²)',
    analysis: 'Gaussian elimination on the minor is cubic; Laplacian storage is quadratic.',
  }),
  'a8-minimum-product-spanning-tree': graph({
    problem: 'Find a spanning tree that minimizes the product of its edge weights (positive weights).',
    intuition: 'log turns products into sums, so an MST computed on log(w) edges minimizes Σ log w = log Π w.',
    steps: [
      'Replace each weight w with log(w) for comparisons.',
      'Run Kruskal/Prim on those keys.',
      'Multiply (or exp-sum-log) the original weights of chosen edges.',
      'Return the product (or -1 if disconnected).',
    ],
    codes: [{ caption: 'Minimum product ST via log-weights', code: MIN_PROD_ST }],
    time: 'O(E log E)',
    space: 'O(V)',
    analysis: 'Same as Kruskal besides the log comparison key and final product.',
  }),
  'a8-reverse-delete-mst': graph({
    problem: 'Build an MST by deleting heaviest edges first whenever removal leaves the graph connected.',
    intuition: 'Any edge that is not a bridge in the current graph can be dropped; what remains is an MST.',
    steps: [
      'Sort edges by descending weight.',
      'Temporarily remove the heaviest remaining edge.',
      'If the graph stays connected, keep it deleted; else put it back.',
      'Sum weights of edges that remain.',
    ],
    codes: [{ caption: 'Reverse-delete MST', code: REV_DEL }],
    time: 'O(E log E + E · (V+E)) naive connectivity',
    space: 'O(V + E)',
    analysis: 'Each deletion may run a full connectivity check unless bridges are maintained smarter.',
  }),
  'a8-boruvka-mst': graph({
    problem: 'Compute an MST by repeatedly contracting each component’s cheapest outgoing edge (Borůvka).',
    intuition: 'In parallel-style phases, every tree picks a min outbound edge; unions merge components until one tree remains.',
    steps: [
      'While components > 1:',
      'For each component, find the lightest edge leaving it.',
      'Union endpoints of those edges (skip duplicates).',
      'Add their weights to the MST cost.',
      'Repeat until one component.',
    ],
    codes: [{ caption: 'Borůvka MST', code: BORUVKA }],
    time: 'O(E log V)',
    space: 'O(V + E)',
    analysis: 'Each phase at least halves the number of components in the worst case, giving O(log V) phases of O(E) work.',
  }),
  'a8-condensation-dag': graph({
    problem: 'Build the condensation DAG whose nodes are strongly connected components and edges are the inter-component original edges.',
    intuition: 'Contracting each SCC to a supernode removes cycles, so the quotient graph is a DAG.',
    steps: [
      'Compute SCC ids (Kosaraju/Tarjan) into comp[u].',
      'Create C empty adjacency lists.',
      'For each original u→v with comp[u]!=comp[v], add a unique DAG edge.',
      'Return the DAG.',
    ],
    codes: [{ caption: 'SCC condensation DAG', code: CONDENSE }],
    time: 'O(V + E)',
    space: 'O(V + E)',
    analysis: 'After linear SCC, a single edge scan emits the DAG without duplicates via a set.',
  }),
  'a8-count-walks-k-edges': graph({
    problem: 'Count (or decide existence of) walks of length exactly k between vertices; often via adjacency-matrix powering.',
    intuition: ' (A^k)[i][j] equals the number of i→j walks with k edges over a semiring/integers.',
    steps: [
      'Let M be the adjacency matrix (0/1 or weighted counts).',
      'Compute M^k by exponentiation by squaring.',
      'Read entry [s][t] as the number of walks.',
      'Use modular arithmetic if required.',
    ],
    codes: [{ caption: 'Count walks of length k — matrix power', code: WALKS_K }],
    time: 'O(V³ log k)',
    space: 'O(V²)',
    analysis: 'Each multiply is O(V³); log k multiplies for powering.',
  }),
  'a8-string-chain-circle': graph({
    problem: 'Decide whether an array of words can be arranged in a circle so that the last letter of each word equals the first letter of the next.',
    intuition: 'Model letters as vertices and words as directed edges first→last; a circle exists iff the graph has an Euler circuit on the used letters.',
    steps: [
      'For each word, add edge startLetter→endLetter and update degrees.',
      'Require indegree==outdegree for every used letter.',
      'Check strong connectivity of the underlying used subgraph (DFS from a vertex with edges).',
      'Return true iff both hold.',
    ],
    codes: [{ caption: 'Word circle — Euler circuit on letters', code: STRING_CHAIN }],
    time: 'O(N + Σ|w|)',
    space: 'O(1) alphabet + adjacency',
    analysis: 'Alphabet size 26 keeps the graph tiny; connectivity DFS is O(1) relative to input size dominated by scanning words.',
  }),
  'a8-critical-connections': graph({
    problem: 'Find all bridges (critical connections) in an undirected connected graph: edges whose removal increases the number of components.',
    intuition: 'Tarjan DFS: if low[v] > disc[u] for a tree edge u−v, that edge is a bridge.',
    steps: [
      'Run DFS with discovery and low-link times.',
      'On tree child v, low[u]=min(low[u], low[v]).',
      'If low[v]>disc[u], record bridge {u,v}.',
      'On back edge, low[u]=min(low[u], disc[v]).',
      'Ignore the parent edge.',
    ],
    codes: [{ caption: 'Critical connections — Tarjan bridges', code: CRITICAL }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'One DFS visits each vertex/edge a constant number of times.',
  }),
  'a8-biconnected-components': graph({
    problem: 'Partition edges of an undirected graph into biconnected components (maximal subgraphs without articulation separation).',
    intuition: 'DFS with a stack of edges pops a BCC whenever a child v satisfies low[v] ≥ disc[u] (or at the root with multiple children).',
    steps: [
      'DFS maintaining disc/low and an edge stack.',
      'Push edges when exploring.',
      'At an articulation condition, pop edges until the tree edge u−v is popped — that set is one BCC.',
      'Handle remaining stack edges as a final component.',
    ],
    codes: [{ caption: 'Biconnected components — DFS edge stack', code: BCC }],
    time: 'O(V + E)',
    space: 'O(V + E)',
    analysis: 'Each edge is pushed/popped once; disc/low arrays are O(V).',
  }),
  'a8-max-flow': graph({
    problem: 'Compute the maximum flow from source s to sink t in a capacitated network.',
    intuition: 'Augmenting-path methods repeatedly find s→t paths in the residual graph and push bottleneck capacity until no path remains (max-flow min-cut).',
    steps: [
      'Build residual capacity matrix/list with reverse edges 0.',
      'While an s–t path exists in the residual graph, find bottleneck δ.',
      'Decrease forward residual by δ; increase reverse by δ.',
      'Add δ to total flow.',
      'Stop when BFS/DFS finds no path.',
    ],
    codes: [{ caption: 'Max flow — Edmonds–Karp', code: MAX_FLOW }],
    time: 'O(VE²)',
    space: 'O(V²)',
    analysis: 'Each augmentation BFS is O(E); at most O(VE) augmentations in unit-increment analyses for Edmonds–Karp.',
  }),
  'a8-ford-fulkerson': graph({
    problem: 'Maximum flow via the Ford–Fulkerson method: DFS (or any search) for augmenting paths in the residual graph.',
    intuition: 'Any residual s–t path can carry additional flow; termination requires capacities that make progress (e.g. integers).',
    steps: [
      'Initialize residual = capacities.',
      'DFS/BFS find an augmenting path; compute bottleneck.',
      'Update residual forward/backward.',
      'Repeat until no path exists.',
      'Return accumulated flow.',
    ],
    codes: [{ caption: 'Ford–Fulkerson — DFS augmenting paths', code: FF }],
    time: 'O(E · F) for integer flow F',
    space: 'O(V²)',
    analysis: 'Each augmentation increases flow by ≥1 for integer caps; path search is O(E).',
  }),
  'a8-dinic': graph({
    problem: 'Compute max flow with Dinic’s algorithm: layered BFS graphs plus blocking DFS flows.',
    intuition: 'BFS builds level graph from residual distances; DFS saturates multiple paths until the level graph is blocked, then rebuild levels.',
    steps: [
      'BFS levels from s in the residual graph; stop if t unreachable.',
      'Repeated DFS from s sending flow only along edges to level+1.',
      'Add blocking flow to the answer.',
      'Clear pointers and repeat BFS until t disconnected.',
    ],
    codes: [{ caption: 'Dinic max flow', code: DINIC }],
    time: 'O(V²E) general; faster on unit networks',
    space: 'O(V + E)',
    analysis: 'O(V) phases in general graphs; each phase builds levels in O(E) and pushes a blocking flow.',
  }),
  'a8-bipartite-matching-flow': graph({
    problem: 'Compute maximum cardinality matching in a bipartite graph by reduction to max flow.',
    intuition: 'Connect s→all left (cap 1), right→t (cap 1), and left→right edges (cap 1); max flow equals max matching.',
    steps: [
      'Create s and t.',
      'Add unit edges s→L, R→t, and each bipartition edge L→R.',
      'Run Dinic/Edmonds–Karp.',
      'Flow value is the matching size; saturated L→R edges are matches.',
    ],
    codes: [{ caption: 'Bipartite matching via max flow', code: BIP_FLOW }],
    time: 'O(E √V) with Dinic on unit networks',
    space: 'O(V + E)',
    analysis: 'Unit-capacity bipartite matching networks are a Dinic sweet spot.',
  }),
  'a8-push-relabel': graph({
    problem: 'Compute max flow using push–relabel: maintain preflow height labels and push excess toward the sink.',
    intuition: 'Vertices with excess push along admissible residual edges (height[u]=height[v]+1); otherwise relabel to 1+min neighbor height.',
    steps: [
      'Saturate all edges out of s; set height[s]=V.',
      'While a non-s/t vertex has excess, try to push on admissible edges.',
      'If still excess, relabel u.',
      'When no excess remains off t, excess[t] is the max flow.',
    ],
    codes: [{ caption: 'Push–relabel max flow', code: PUSH_REL }],
    time: 'O(V²√E) / O(V³) variants',
    space: 'O(V²)',
    analysis: 'Heights stay <2V; each relabel/push accounting yields polynomial bounds.',
  }),
  'a8-max-edge-disjoint-paths': graph({
    problem: 'Count the maximum number of pairwise edge-disjoint paths from s to t.',
    intuition: 'Assign capacity 1 to every edge and compute max flow; each unit of flow is one edge-disjoint path.',
    steps: [
      'Build a unit-capacity network from the undirected/directed edges.',
      'Compute max flow s→t.',
      'Return the flow value.',
      'Optional: extract paths by walking residual/flow edges.',
    ],
    codes: [{ caption: 'Edge-disjoint paths via unit max flow', code: EDGE_DISJ }],
    time: 'O(VE) with Edmonds–Karp on unit caps',
    space: 'O(V²)',
    analysis: 'Flow increases by 1 per path; each BFS finds one path in O(E).',
  }),
  'a8-min-st-cut': graph({
    problem: 'Find a minimum-capacity s–t cut (partition edges leaving the s-side) equal in capacity to the max flow.',
    intuition: 'After max flow, vertices still reachable from s in the residual graph form the s-side; original edges leaving that set are the cut.',
    steps: [
      'Compute max flow and keep the final residual graph.',
      'BFS/DFS from s over residual capacity > 0 to mark the s-set.',
      'Collect original edges u→v with u reachable, v not.',
      'Their total capacity equals the max flow.',
    ],
    codes: [{ caption: 'Min s–t cut from residual reachability', code: MIN_CUT }],
    time: 'O(VE²) with Edmonds–Karp + O(E) cut extract',
    space: 'O(V²)',
    analysis: 'Flow dominates; the cut scan is a single residual traversal plus edge listing.',
  }),
  'a8-hopcroft-karp': graph({
    problem: 'Maximum bipartite matching in O(E √V) using layered BFS + multiple DFS augmentations.',
    intuition: 'BFS builds shortest augmenting-path layers from free left vertices; DFS finds a maximal set of vertex-disjoint shortest augmentations per phase.',
    steps: [
      'While BFS finds free right vertices reachable via alternating paths:',
      'DFS from each free left vertex along the layers.',
      'Flip each found augmenting path.',
      'Count successful DFS starts.',
      'Phases continue O(√V) times.',
    ],
    codes: [{ caption: 'Hopcroft–Karp bipartite matching', code: HK }],
    time: 'O(E √V)',
    space: 'O(V + E)',
    analysis: 'O(√V) blocking phases each cost O(E) for unit-length layer graphs.',
  }),
  'a8-channel-assignment': graph({
    problem: 'Assign the fewest channels/frequencies so adjacent transmitters (graph neighbors) get different channels — graph coloring.',
    intuition: 'Greedy coloring in some vertex order uses at most Δ+1 colors; exact min channels is NP-hard.',
    steps: [
      'Build the interference graph.',
      'For each vertex in order, mark colors used by neighbors.',
      'Assign the smallest free non-negative color.',
      'Answer is 1+max color (or the color array).',
    ],
    codes: [{ caption: 'Channel assignment — greedy coloring', code: CHANNEL }],
    time: 'O(V + E)',
    space: 'O(V)',
    analysis: 'Each edge causes a constant-time used[] mark across the scan.',
    notes: [
      'For optimality on special graphs, use exact coloring / Brooks checks.',
    ],
  }),
  'a8-kargers-algorithm': graph({
    problem: 'Estimate the global minimum cut of an undirected multigraph by randomized edge contractions.',
    intuition: 'Contract random edges until two supernodes remain; the remaining cross edges form a cut; repeat to boost probability.',
    steps: [
      'Copy the multiset of edges.',
      'While >2 components, pick a random edge and contract its endpoints (union).',
      'Count edges with endpoints in different final components — that is one cut sample.',
      'Repeat trials; keep the minimum cut value found.',
    ],
    codes: [{ caption: 'Karger randomized min-cut', code: KARGER }],
    time: 'O(T · E α(V)) for T trials',
    space: 'O(V + E)',
    analysis: 'One contraction phase is nearly linear with DSU; success probability per trial is Ω(1/V²), so T~V² log V is common.',
  }),
  'a8-euler-path': graph({
    problem: 'Find an Euler path (use every edge exactly once) in an undirected graph if one exists.',
    intuition: 'Hierholzer: walk unused edges, stacking vertices; pop to the path when stuck. Existence needs 0 or 2 odd-degree vertices and connectivity of non-zero-degree vertices.',
    steps: [
      'Check degrees: 0 or 2 odds; start at an odd vertex if any.',
      'Stack-walk unused edges (store edge ids to mark used).',
      'When u has no unused edge, append u to the path.',
      'Reverse the path for the edge order.',
      'Verify all edges were consumed.',
    ],
    codes: [{ caption: 'Undirected Euler path — Hierholzer', code: EULER }],
    time: 'O(V + E)',
    space: 'O(V + E)',
    analysis: 'Each edge is traversed once; adjacency iterators advance monotonically.',
  }),
  'a8-euler-circuit-directed': graph({
    problem: 'Find a directed Euler circuit that uses every directed edge exactly once.',
    intuition: 'For every vertex indegree must equal outdegree, and the underlying used graph must be strongly connected; then Hierholzer works with directed adjacency.',
    steps: [
      'Verify indeg==outdeg for all vertices.',
      'Start at any vertex with outgoing edges.',
      'Stack-walk unused directed edges.',
      'Append vertices when stuck; reverse to form the circuit.',
      'Fail if degrees mismatch.',
    ],
    codes: [{ caption: 'Directed Euler circuit — Hierholzer', code: EULER_DIR }],
    time: 'O(V + E)',
    space: 'O(V + E)',
    analysis: 'Same linear Hierholzer accounting with directed adjacency iterators.',
  }),
  'a8-fleury-algorithm': graph({
    problem: 'Construct an Euler tour by always leaving a vertex via a non-bridge edge when possible (Fleury).',
    intuition: 'Avoiding bridges until necessary keeps the remaining graph connected so you never get stuck with unused edges elsewhere.',
    steps: [
      'Start at a valid Euler start vertex.',
      'From current u, prefer an unused edge that is not a bridge in the residual unused graph.',
      'Traverse that edge, delete it, move to the neighbor.',
      'Repeat until no edges remain.',
      'The vertex sequence is the tour.',
    ],
    codes: [{ caption: 'Fleury’s algorithm (bridge-aware tour)', code: FLEURY }],
    time: 'O(E²) naive bridge tests',
    space: 'O(V + E)',
    analysis: 'Naively testing bridges each step is costly; Hierholzer is preferred in practice.',
    notes: [
      'Template shows Hierholzer-style recursion; production Fleury adds explicit bridge checks.',
    ],
  }),
  'a8-hierholzer-algorithm': graph({
    problem: 'Build an Euler tour/path by the Hierholzer stack method on an adjacency list of unused edges.',
    intuition: 'Post-order of exhausting unused edges yields a valid tour when Euler conditions hold.',
    steps: [
      'Choose a valid start.',
      'While the stack is non-empty: if peek has unused edges, push the next neighbor; else pop to the answer list.',
      'Reverse the answer.',
      'Ensure degrees/connectivity beforehand.',
    ],
    codes: [{ caption: 'Hierholzer Euler tour', code: HIERHOLZER }],
    time: 'O(V + E)',
    space: 'O(V + E)',
    analysis: 'Iterators advance across each adjacency entry once.',
  }),
  'a8-chinese-postman': graph({
    problem: 'Find a shortest closed walk that traverses every edge of a weighted undirected connected graph at least once (Chinese Postman Problem).',
    intuition: 'If all degrees are even, the Euler circuit length is optimal; otherwise add a minimum-cost pairing of odd-degree vertices (duplicate those shortest paths) then run Euler.',
    steps: [
      'If 0 odd vertices, return sum of edge weights (Euler circuit).',
      'List odd-degree vertices (2k of them).',
      'All-pairs shortest paths among odds; min-cost perfect matching on those 2k points.',
      'Add matched path lengths to the total.',
      'Euler tour exists in the augmented multigraph.',
    ],
    codes: [{ caption: 'Chinese Postman — pair odd vertices', code: CPP }],
    time: 'O(V³ + (2k)!) brute pairing; better with blossom',
    space: 'O(V²)',
    analysis: 'APSP is cubic; exact matching on 2k odds is the combinatorial bottleneck for large k.',
  }),
  'a8-graph-coloring': graph({
    problem: 'Decide whether the graph is m-colorable (assign colors 1..m so adjacent vertices differ), or find such a coloring.',
    intuition: 'Backtracking assigns a color to vertex u that does not conflict with neighbors, then recurses; exponential but standard interview template.',
    steps: [
      'Order vertices 0..V-1.',
      'Try colors 1..m for u if no neighbor has that color.',
      'Recurse to u+1; on success return true.',
      'Backtrack on failure.',
      'Return false if no color works.',
    ],
    codes: [{ caption: 'm-coloring backtracking', code: COLOR }],
    time: 'O(m^V) worst case',
    space: 'O(V)',
    analysis: 'Each vertex tries up to m colors; pruning depends on density.',
  }),
  'a8-traveling-salesman': graph({
    problem: 'Find a minimum-weight Hamiltonian cycle on a complete (or dense) graph with V≤20-ish (Held–Karp DP).',
    intuition: 'dp[mask][u]=min cost to reach u visiting exactly the vertices in mask; transition tries previous cities.',
    steps: [
      'dp[1<<0][0]=0 for start at 0.',
      'For each mask, each u in mask, try v not in mask: relax dp[mask|1<<v][v].',
      'Answer min over u of dp[FULL][u]+dist[u][0].',
      'Reconstruct with parent if needed.',
    ],
    codes: [{ caption: 'TSP — Held–Karp DP', code: TSP }],
    time: 'O(V² · 2^V)',
    space: 'O(V · 2^V)',
    analysis: 'There are 2^V·V states; each tries O(V) transitions.',
  }),
  'a8-shortest-chain-target-word': graph({
    problem: 'Find the length of the shortest chain from a begin word to a target word by changing one character at a time, using only dictionary words.',
    intuition: 'Identical graph model to word ladder: BFS over one-letter mutations yields the minimum chain length.',
    steps: [
      'Put dictionary words in a set; abort if target missing.',
      'BFS from begin, tracking visited.',
      'Generate all one-letter neighbors; enqueue if in dict and unseen.',
      'Return steps when target is reached, else 0.',
    ],
    codes: [{ caption: 'Shortest word chain — BFS', code: CHAIN_WORD }],
    time: 'O(N · L · 26)',
    space: 'O(N · L)',
    analysis: 'Each dictionary word is visited once; neighbor generation is O(L·26) per word.',
  }),
}
