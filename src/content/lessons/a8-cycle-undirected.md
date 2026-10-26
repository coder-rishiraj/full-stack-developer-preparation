---
summary: An undirected graph has a cycle exactly when some traversal meets an already-visited vertex by an edge other than the one it arrived on. You will learn why the parent check is needed, how to detect cycles with DFS, BFS and Union-Find, and how the same ideas extend to finding the shortest or minimum-weight cycle, counting cycles of a given length and listing every cycle.
difficulty: intermediate
minutes: 70
objectives:
  - Explain why "visited" alone reports false cycles in undirected graphs and how the parent check fixes it
  - Implement cycle detection with DFS + parent and with BFS + parent, covering every connected component, and recover the cycle's vertices
  - Prove why a visited non-parent neighbour always means a cycle, and derive the O(V + E) running time
  - Find the shortest cycle in an unweighted graph and the minimum-weight cycle in a weighted one, and print it
  - Count cycles of a fixed length and enumerate all simple cycles without duplicates, explaining why enumeration is exponential
---

## Introduction

A **cycle** in an undirected graph is a path that starts and ends at the same vertex, uses at least one edge, and never repeats an edge or an intermediate vertex. In a simple graph (no self-loops, no parallel edges) the shortest possible cycle is a triangle of three vertices.

Knowing whether a graph has a cycle answers practical questions. A network of `n` computers joined by cables is a **tree** — every pair connected by exactly one route — precisely when it is connected and has no cycle. Kruskal's minimum spanning tree algorithm adds the cheapest edges one by one but must skip any edge that would close a cycle. Ethernet switches run the Spanning Tree Protocol precisely because a loop in the physical wiring would make broadcast frames circulate forever. And a large class of interview problems — "Graph Valid Tree", "Redundant Connection", "detect a cycle in an undirected graph" — are this question with different wrapping.

The algorithm is short: run DFS or BFS, and if you ever reach a vertex you have already visited by an edge other than the one you came in on, there is a cycle. The subtle part is "other than the one you came in on". This lesson explains why that condition is needed and why it is enough, then builds the standard extensions:

- [[a8-cycle-undirected-dfs]] — detection with recursive DFS and a parent parameter.
- [[a8-cycle-undirected-bfs]] — the same idea with BFS.
- [[a8-print-shortest-cycle]] — the shortest cycle (the graph's **girth**) and the minimum-weight cycle, with the cycle printed.
- [[a8-cycles-of-length-n]] — counting cycles of exactly `n` vertices.
- [[a8-print-all-cycles]] — listing every simple cycle exactly once.

Directed graphs need a different test — a visited vertex on the *current* path, not merely a visited vertex — and are covered in [[a8-cycle-detection]].

## Before you start

- **DFS and BFS** on an adjacency list, including the outer loop that starts a traversal from every unvisited vertex. See [[a8-dfs]] and [[a8-bfs]].
- **Adjacency lists** — in particular that an undirected edge `u–v` is stored twice, once in `u`'s list and once in `v`'s. See [[a8-adjacency-list]].
- **Connected components** — a graph can be in several pieces, and each must be checked. See [[a8-connected-components]].
- **Dijkstra's algorithm**, only for the minimum-weight cycle section. See [[a8-dijkstra]].
- **Backtracking**, for enumerating cycles. See [[a1-recursion]].

## The intuition

Imagine exploring a cave system with a ball of string, tying it off at the entrance and unrolling it as you walk. The string records the way back. Every chamber you enter, you chalk an X on the wall.

Now you walk into a chamber that already has an X. There are two possibilities. Either you have just walked back along the passage you came in by — you followed your own string one step backwards — which tells you nothing. Or you came in through a *different* passage, and then you have found two different routes between the same chambers: one along your string and one through the passage you just used. Two different routes between the same pair of places form a loop.

That is the whole algorithm. The string is the DFS (or BFS) tree; the chalk marks are the `visited` array; and "the passage you came in by" is the edge to your **parent** in that tree. A chalked chamber reached through any other passage proves a cycle.

The analogy also shows why directed graphs differ: in a one-way cave you can reach a chalked chamber by a different passage without being able to get back, so a chalk mark alone proves nothing there.

## What counts as a cycle

Some facts make the problem concrete and give quick checks.

**Trees and forests.** A connected graph with no cycle is a **tree**, and a tree with `V` vertices has exactly `V − 1` edges. A graph with no cycle that may be disconnected is a **forest**; if it has `C` components it has exactly `V − C` edges, one tree per component. It follows that a simple undirected graph with `E ≥ V` edges *must* contain a cycle — a forest can never have that many. This is a useful O(1) pre-check, though the converse fails: a graph with fewer edges can still have a cycle in one component while another component is disconnected.

**Self-loops and parallel edges.** In a **multigraph**, an edge from a vertex to itself is a cycle of length 1, and two edges joining the same pair of vertices form a cycle of length 2. Problems usually promise a simple graph; if they do not, decide how these should be treated before coding.

**Every component.** A graph can be acyclic in the component containing vertex 0 and cyclic elsewhere. Every detection method below needs an outer loop that starts a fresh traversal from each unvisited vertex.

## Why "visited" alone is not enough

For directed graphs, beginners sometimes try "if DFS meets a visited vertex, there is a cycle". For undirected graphs that rule fails even on the simplest tree.

Take the graph with one edge `0–1`. The adjacency list stores it twice: `adj[0] = [1]` and `adj[1] = [0]`. DFS starts at 0, marks it, sees neighbour 1, marks 1 and recurses. At 1 it scans `adj[1]` and finds 0 — already visited. The naive rule reports a cycle in a graph that is a single edge.

The "cycle" is an artefact of storage: it is the same edge, seen from the other end. So the rule must exclude exactly that edge, and the simplest way to name it is by the vertex it leads to — the **parent**, the vertex from which we discovered the current one. Every other visited neighbour is a genuine second route.

## Undirected Cycle via DFS + Parent {#a8-cycle-undirected-dfs}

**Undirected cycle detection with DFS and a parent** runs a depth-first search that remembers, for each vertex, which vertex it was reached from. When the search at vertex `u` finds a neighbour `v` that is already visited and is not `u`'s parent, the graph has a cycle. If the search finishes every component without that happening, the graph is a forest.

### The procedure

1. Create `visited`, all false.
2. For every vertex `s` that is not visited, call `dfs(s, parent = -1)`. The `-1` means "no parent" — the root of a DFS tree.
3. In `dfs(u, parent)`: mark `u` visited. For each neighbour `v` of `u`:
   - if `v == parent`, skip it (it is the edge we arrived on);
   - else if `v` is visited, return "cycle";
   - else recurse into `dfs(v, u)` and return "cycle" if it does.
4. If no call reports a cycle, there is none.

### Why a visited non-parent neighbour proves a cycle

In an undirected graph, DFS classifies every edge as either a **tree edge** (it discovered a new vertex) or a **back edge** (it joins a vertex to one of its ancestors in the DFS tree). There are no "cross edges" between unrelated branches. The reason: suppose `u` and `v` are adjacent and DFS visits `u` first. While `u` is still on the recursion stack, DFS scans all of `u`'s neighbours, including `v`; if `v` is still unvisited at that moment, DFS visits it from `u` (tree edge), or it has already been visited by some deeper call started from `u` — making `v` a descendant of `u`. Either way, `u` and `v` are in an ancestor–descendant relationship.

So when `u` sees a visited `v` that is not its parent, `v` is an ancestor of `u` (or a descendant already explored through another branch of `u`, which is the same edge seen from the ancestor's side). The tree path from `v` down to `u` plus the edge `u–v` is a closed route that repeats no vertex: a cycle of at least three vertices, since `v` is not `u`'s immediate parent.

Conversely, if a cycle exists, DFS will find a back edge on it: consider the first vertex `w` of the cycle that DFS visits. All other cycle vertices are reachable from `w` while `w` is on the stack, so they become descendants of `w`; the cycle's last edge back to `w` then joins a descendant to its ancestor, and when DFS scans that edge from the descendant, `w` is visited and is not the descendant's parent (the cycle reaches `w` through a different neighbour than the one the tree used). So the check never misses a cycle.

### Implementation

```java title="UndirectedCycleDfs.java"
import java.util.*;

public class UndirectedCycleDfs {
    static List<List<Integer>> build(int n, int[][] edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {           // undirected: store the edge in both lists
            adj.get(e[0]).add(e[1]);
            adj.get(e[1]).add(e[0]);
        }
        return adj;
    }

    static boolean hasCycle(List<List<Integer>> adj) {
        boolean[] visited = new boolean[adj.size()];
        for (int s = 0; s < adj.size(); s++) {          // every component, not just 0's
            if (!visited[s] && dfs(s, -1, adj, visited)) return true;
        }
        return false;
    }

    private static boolean dfs(int u, int parent, List<List<Integer>> adj, boolean[] visited) {
        visited[u] = true;
        for (int v : adj.get(u)) {
            if (v == parent) continue;            // the edge we arrived on, seen from below
            if (visited[v]) return true;          // any other visited neighbour closes a loop
            if (dfs(v, u, adj, visited)) return true;
        }
        return false;
    }

    public static void main(String[] args) {
        // Two components: a tree 0-1-2 and a square 3-4-5-6-3.
        List<List<Integer>> square = build(7, new int[][]{
            {0, 1}, {1, 2}, {3, 4}, {4, 5}, {5, 6}, {6, 3}});
        List<List<Integer>> forest = build(7, new int[][]{
            {0, 1}, {1, 2}, {3, 4}, {4, 5}, {5, 6}});
        System.out.println(hasCycle(square));
        System.out.println(hasCycle(forest));
    }
}
```

```output
true
false
```

The first graph's cycle is in the second component. A version without the outer loop — calling `dfs(0, -1)` once — would explore only `0, 1, 2`, find nothing, and wrongly return `false`. The second graph is the same with the closing edge `6–3` removed, which leaves two paths: a forest.

### Dry run on the square

The search reaches the second component when the outer loop gets to `s = 3`. Adjacency lists: `adj[3] = [4, 6]`, `adj[4] = [3, 5]`, `adj[5] = [4, 6]`, `adj[6] = [5, 3]`.

| Call | `u` | `parent` | Neighbour | Situation | Action |
|---|---|---|---|---|---|
| 1 | 3 | -1 | 4 | unvisited | recurse `dfs(4, 3)` |
| 2 | 4 | 3 | 3 | is parent | skip |
| 2 | 4 | 3 | 5 | unvisited | recurse `dfs(5, 4)` |
| 3 | 5 | 4 | 4 | is parent | skip |
| 3 | 5 | 4 | 6 | unvisited | recurse `dfs(6, 5)` |
| 4 | 6 | 5 | 5 | is parent | skip |
| 4 | 6 | 5 | 3 | visited, not parent | **cycle** |

At the last step, vertex 6 sees vertex 3. Vertex 3 is visited, and 6 was reached from 5, not from 3. The tree path `3 → 4 → 5 → 6` plus the edge `6–3` is the cycle.

### Recovering the cycle itself

If you store each vertex's parent in an array, the moment you find the back edge `u–v` you can walk parent pointers from `u` up to `v` to list the cycle's vertices.

```java title="FindCycleDfs.java"
import java.util.*;

public class FindCycleDfs {
    static int[] parentOf;
    static boolean[] visited;
    static List<Integer> cycle;

    static List<Integer> findCycle(List<List<Integer>> adj) {
        int n = adj.size();
        parentOf = new int[n];
        visited = new boolean[n];
        cycle = null;
        for (int s = 0; s < n && cycle == null; s++) {
            if (!visited[s]) dfs(s, -1, adj);
        }
        return cycle == null ? List.of() : cycle;
    }

    private static boolean dfs(int u, int parent, List<List<Integer>> adj) {
        visited[u] = true;
        parentOf[u] = parent;
        for (int v : adj.get(u)) {
            if (v == parent) continue;
            if (visited[v]) {
                // v is an ancestor of u. The tree path v -> ... -> u plus the edge u-v
                // is the cycle; collect it by walking parent pointers up from u.
                cycle = new ArrayList<>();
                for (int x = u; x != v; x = parentOf[x]) cycle.add(x);
                cycle.add(v);
                Collections.reverse(cycle);
                return true;
            }
            if (dfs(v, u, adj)) return true;
        }
        return false;
    }

    public static void main(String[] args) {
        int n = 6;
        int[][] edges = {{0, 1}, {1, 2}, {2, 3}, {3, 4}, {4, 1}, {2, 5}};
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
        System.out.println(findCycle(adj));
    }
}
```

```output
[1, 2, 3, 4]
```

The search goes `0 → 1 → 2 → 3 → 4`, and at 4 it sees 1 — visited and not 4's parent (3). Walking parents from 4 gives `4, 3, 2`, then `1`; reversed, `[1, 2, 3, 4]`. The walk is guaranteed to reach `v` because the first time a back edge is found in this DFS, `v` is an ancestor of `u` still on the stack.

### Complexity

**Time.** Each vertex is marked once, and each `dfs(u)` scans `u`'s adjacency list once. An undirected edge appears in two lists, so the total scanning is `2E`. Time is **O(V + E)**, and the algorithm may stop earlier when it finds a cycle. A useful consequence: before the first back edge, every adjacency entry DFS scans is either a tree edge or the reverse copy of one, and there are at most `V − 1` tree edges, so when a cycle exists it is found after O(V) work even on a dense graph.

**Space.** `visited` is O(V), and the recursion can be V frames deep on a long path. Total **O(V)**. For graphs with hundreds of thousands of vertices, the recursion depth can overflow Java's default stack; use the iterative form below.

### Iterative DFS

Replace the recursion with an explicit `ArrayDeque` stack of `{vertex, parent}` pairs. Mark a vertex when you push it, and apply the same check: a visited neighbour other than the parent means a cycle. This changes the visiting order compared with recursive DFS — it is closer to "DFS-like" than an exact simulation (see [[a8-iterative-dfs]]) — but the parent check stays correct because, as the BFS section shows, it works for *any* traversal that marks vertices when they are first discovered and records the edge that discovered them.

### Self-loops and parallel edges

With the `build` method above, a self-loop `u–u` puts `u` into its own list; when `dfs(u)` scans it, `u` is visited and is not its own parent, so a cycle is reported — correct for a multigraph. Parallel edges `u–v` twice are also reported: `u` discovers `v` through the first copy, and after returning, meets visited `v` again through the second copy; `v` is not `u`'s parent, so it reports a cycle. (From `v`'s side both copies look like the parent and are skipped — the detection happens from `u`'s side.) If a problem instead says duplicate edges should be ignored, deduplicate the input first. The cleaner general fix, needed in algorithms such as bridge finding ([[a8-bridges]]), is to skip the parent *edge id* rather than the parent vertex.

## Undirected Cycle via BFS + Parent {#a8-cycle-undirected-bfs}

**Undirected cycle detection with BFS and a parent** explores the graph level by level, recording for each vertex the vertex that discovered it. If, while scanning the neighbours of `u`, BFS finds a neighbour `v` that is already visited and is not `u`'s parent, the graph has a cycle. It is the BFS counterpart of the DFS method, with the same O(V + E) cost.

### Why the same check works for BFS

BFS does not have DFS's "only tree edges and back edges" property — in BFS a non-tree edge can join two vertices on the same level or on adjacent levels. So the DFS proof does not carry over word for word. A different argument works and is in fact more general.

When BFS marks vertices on discovery and records parents, the parent pointers form a tree: every visited vertex has a unique path of parent pointers back to the root `s`. Now suppose `u` sees a visited neighbour `v` with `v ≠ parent[u]`. Is the edge `u–v` a tree edge? It is a tree edge only if `v` is `u`'s parent or `u` is `v`'s parent. The first is ruled out by the check. The second is impossible at this moment in a simple graph: if `u` were `v`'s parent, `u` would have discovered `v` earlier in this same scan of `u`'s list — but each neighbour appears only once in that list. So `u–v` is a non-tree edge joining two vertices of the same tree. The tree path from `u` to `v` plus the edge `u–v` is a cycle.

Conversely, if the component has a cycle, it has more edges than a tree (at least `V_c` edges for its `V_c` vertices), so at least one edge is not a tree edge, and BFS scans it from both ends; from at least one end, the other endpoint is visited and not the parent. So the check never misses a cycle either.

This argument never used the order in which vertices were visited. That is why the parent check is correct for DFS, BFS and iterative DFS alike: **any traversal that marks on discovery and remembers the discovering edge can detect undirected cycles.**

### Implementation

```java title="UndirectedCycleBfs.java"
import java.util.*;

public class UndirectedCycleBfs {
    static boolean hasCycle(List<List<Integer>> adj) {
        int n = adj.size();
        boolean[] visited = new boolean[n];
        int[] parent = new int[n];
        for (int s = 0; s < n; s++) {
            if (visited[s]) continue;
            ArrayDeque<Integer> queue = new ArrayDeque<>();
            visited[s] = true;                 // mark on enqueue
            parent[s] = -1;
            queue.add(s);
            while (!queue.isEmpty()) {
                int u = queue.poll();
                for (int v : adj.get(u)) {
                    if (!visited[v]) {
                        visited[v] = true;
                        parent[v] = u;         // the BFS tree edge u-v
                        queue.add(v);
                    } else if (v != parent[u]) {
                        // v was discovered by some other route: two different paths
                        // from s meet across the edge u-v, so a cycle exists.
                        return true;
                    }
                }
            }
        }
        return false;
    }

    static List<List<Integer>> build(int n, int[][] edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
        return adj;
    }

    public static void main(String[] args) {
        System.out.println(hasCycle(build(5, new int[][]{{0, 1}, {0, 2}, {1, 3}, {2, 3}, {3, 4}})));
        System.out.println(hasCycle(build(5, new int[][]{{0, 1}, {0, 2}, {1, 3}, {3, 4}})));
        System.out.println(hasCycle(build(4, new int[][]{{0, 1}, {2, 3}, {3, 2}})));
    }
}
```

```output
true
false
true
```

The third graph has two parallel edges between 2 and 3. As with DFS, they are reported as a cycle of length 2; deduplicate the input if the problem says to ignore duplicates.

### Dry run on the first graph

Edges `0–1, 0–2, 1–3, 2–3, 3–4` form a square `0–1–3–2–0` with a tail `3–4`. Adjacency lists: `adj[0] = [1, 2]`, `adj[1] = [0, 3]`, `adj[2] = [0, 3]`, `adj[3] = [1, 2, 4]`.

| Poll `u` | `parent[u]` | Neighbour `v` | State of `v` | Action | Queue after |
|---|---|---|---|---|---|
| 0 | -1 | 1 | unvisited | visit, `parent[1] = 0` | 1 |
| 0 | -1 | 2 | unvisited | visit, `parent[2] = 0` | 1, 2 |
| 1 | 0 | 0 | visited, is parent | skip | 2 |
| 1 | 0 | 3 | unvisited | visit, `parent[3] = 1` | 2, 3 |
| 2 | 0 | 0 | visited, is parent | skip | 3 |
| 2 | 0 | 3 | visited, parent of 2 is 0 | **cycle** | — |

Vertex 3 was discovered from 1. When 2 reaches it, there are two different routes from 0 to 3: `0 → 1 → 3` and `0 → 2 → 3`. Together they form the square.

Note the detection happened while 3 was still *in the queue*, not yet processed. In BFS, a visited non-parent neighbour can be a vertex on the same level, the next level, or (as here) one discovered but not yet polled. All of them prove a cycle, by the tree argument above.

### Mark on enqueue, not on dequeue

The check relies on `visited` meaning "discovered, with a parent recorded". If you marked vertices only when polling them, vertex 3 above would be added to the queue twice (once from 1, once from 2) with no cycle reported at that moment, and the parent of 3 would be overwritten. Marking on discovery keeps one parent per vertex and makes the first non-tree edge visible immediately.

### Complexity

Each vertex is enqueued once and its list scanned once: **O(V + E)** time, **O(V)** space for `visited`, `parent` and the queue. Unlike recursive DFS there is no recursion-depth risk.

### DFS or BFS?

For a yes/no answer they are interchangeable. Choose DFS when you want the cycle's vertices with the simple parent walk (the back edge's endpoints are ancestor and descendant, so one walk up suffices). Choose BFS when the graph is deep enough to threaten the recursion stack, or when the surrounding problem already runs BFS. If you recover a cycle from BFS, the two endpoints of the non-tree edge are generally in different branches, so you walk up from both until the paths meet at their lowest common ancestor.

### The Union-Find alternative

A third method needs no traversal at all. **Union-Find** (disjoint set union, see [[a8-union-find]]) keeps the vertices in sets of "already connected". Process the edges one at a time: for edge `a–b`, if `a` and `b` are already in the same set, a path between them exists, so this edge closes a cycle; otherwise merge their sets.

```java title="RedundantConnection.java"
import java.util.Arrays;

public class RedundantConnection {
    static int[] parent;

    static int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];    // path halving keeps trees shallow
            x = parent[x];
        }
        return x;
    }

    /** Returns the first edge whose endpoints are already connected, or null. */
    static int[] firstCycleEdge(int n, int[][] edges) {
        parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        for (int[] e : edges) {
            int ra = find(e[0]), rb = find(e[1]);
            if (ra == rb) return e;           // a path a ~> b already exists: edge closes a cycle
            parent[ra] = rb;
        }
        return null;
    }

    public static void main(String[] args) {
        int[][] edges = {{0, 1}, {1, 2}, {3, 4}, {2, 0}, {2, 3}};
        System.out.println(Arrays.toString(firstCycleEdge(5, edges)));
        System.out.println(Arrays.toString(firstCycleEdge(3, new int[][]{{0, 1}, {1, 2}})));
    }
}
```

```output
[2, 0]
null
```

Union-Find is the natural choice when edges arrive one at a time (an online stream), when you need *which* edge first creates a cycle ("Redundant Connection"), or inside Kruskal's algorithm. With path compression and union by rank or size it runs in O(E · α(V)), where α is the inverse Ackermann function — at most 4 for any practical input. This simple version uses only path halving, which is fast in practice but lacks the formal α bound. Union-Find works only for undirected graphs: it tracks connectivity, which has no direction.

```quiz
Q: DFS on an undirected graph is at vertex u, which was reached from vertex p. It sees neighbour p, which is visited. What should it conclude?
- [ ] There is a cycle, because p is visited
- [x] Nothing — this is the edge u-p it arrived on, stored a second time in u's list
- [ ] The graph is a tree
- [ ] u should be marked unvisited and explored again
> Each undirected edge appears in both endpoints' lists. Seeing the parent again is the same edge viewed from the other end, so it must be skipped. Only a visited neighbour other than the parent proves a second route and therefore a cycle.

Q: A graph has 10 vertices and 12 edges and no self-loops or parallel edges. What can you say without running any traversal?
- [ ] Nothing, a traversal is required
- [ ] It is connected
- [x] It contains at least one cycle
- [ ] It contains exactly 3 cycles
> A forest with V vertices and C components has V - C edges, which is at most V - 1 = 9 here. Twelve edges exceed every forest's count, so the graph cannot be acyclic. It does not tell you whether the graph is connected or how many cycles there are.

Q: Why must cycle detection loop over all vertices instead of starting one traversal from vertex 0?
- [ ] Because DFS from vertex 0 can miss vertices in its own component
- [x] Because the graph can be disconnected, and a cycle may lie in a component that vertex 0 cannot reach
- [ ] Because the parent check only works from vertex 0
- [ ] To make the algorithm O(V + E) instead of O(V²)
> A traversal visits exactly one connected component. If the cycle lives in another component, a single traversal never sees it. The outer loop starts a new traversal from each still-unvisited vertex, which keeps the total cost O(V + E).
```

## Print Shortest Cycle / Minimum Weight Cycle {#a8-print-shortest-cycle}

The **shortest cycle** of an unweighted undirected graph is the cycle with the fewest edges; its length is called the graph's **girth** (and is defined as infinite, or reported as `-1`, for a forest). In a weighted graph the analogous question is the **minimum weight cycle**: the cycle whose edge weights have the smallest sum. Detection tells you *whether* a cycle exists; these questions ask for the best one, and usually for its vertices.

The detection algorithms above do not answer this. The first cycle DFS finds depends on the order of the adjacency lists and can be arbitrarily long, even when a triangle exists elsewhere.

### Girth by BFS from every vertex

BFS from a vertex `s` computes shortest distances from `s`. Suppose BFS from `s` meets a non-tree edge `u–v` (both endpoints visited, `v` not `u`'s parent). Then the route `s → … → u`, the edge `u–v`, and `v → … → s` back along tree paths is a closed walk of length `dist[u] + dist[v] + 1`.

That closed walk may not be a simple cycle — the two tree paths can share their first few edges — but it always *contains* a cycle of at most that length (drop the shared prefix). So every candidate is at least the girth. And if `s` lies on a shortest cycle, the BFS from `s` reaches the two "halves" of that cycle along shortest routes, and the edge where they meet gives a candidate exactly equal to the cycle's length. Taking the minimum candidate over all sources therefore gives the girth exactly.

Each BFS is O(V + E), and there are V of them: **O(V · (V + E))** time, O(V) space reused between runs.

### Printing a shortest cycle by removing edges

To print the cycle itself, a cleaner method uses a different observation: **every cycle through the edge `a–b` is that edge plus a path from `a` to `b` that does not use it.** So for each edge `a–b`: temporarily forbid it, BFS from `a` to find the shortest path to `b`, and if one exists, that path plus the edge is the shortest cycle through `a–b`. The best over all edges is a shortest cycle, and since the path is a BFS shortest path, it repeats no vertex, so the cycle is simple and can be printed directly from parent pointers. An edge with no alternative path is a bridge and lies on no cycle.

This costs E BFS runs: **O(E · (V + E))**.

```java title="ShortestCycle.java"
import java.util.*;

public class ShortestCycle {
    /** Girth: length of the shortest cycle in an unweighted simple graph, or -1. */
    static int girth(List<List<Integer>> adj) {
        int n = adj.size(), best = Integer.MAX_VALUE;
        int[] dist = new int[n], parent = new int[n];
        for (int s = 0; s < n; s++) {
            Arrays.fill(dist, -1);
            dist[s] = 0;
            parent[s] = -1;
            ArrayDeque<Integer> queue = new ArrayDeque<>();
            queue.add(s);
            while (!queue.isEmpty()) {
                int u = queue.poll();
                for (int v : adj.get(u)) {
                    if (dist[v] == -1) {
                        dist[v] = dist[u] + 1;
                        parent[v] = u;
                        queue.add(v);
                    } else if (parent[u] != v) {
                        // Non-tree edge: s ~> u, the edge u-v, and v ~> s form a closed walk.
                        best = Math.min(best, dist[u] + dist[v] + 1);
                    }
                }
            }
        }
        return best == Integer.MAX_VALUE ? -1 : best;
    }

    /** One shortest cycle, found by deleting each edge and asking for a path around it. */
    static List<Integer> printShortestCycle(int n, int[][] edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }

        List<Integer> best = List.of();
        for (int[] e : edges) {
            int a = e[0], b = e[1];
            // BFS from a to b that refuses to use the edge a-b itself.
            int[] parent = new int[n];
            Arrays.fill(parent, -2);              // -2 = not visited
            parent[a] = -1;
            ArrayDeque<Integer> queue = new ArrayDeque<>();
            queue.add(a);
            while (!queue.isEmpty() && parent[b] == -2) {
                int u = queue.poll();
                for (int v : adj.get(u)) {
                    if ((u == a && v == b) || (u == b && v == a)) continue;
                    if (parent[v] != -2) continue;
                    parent[v] = u;
                    queue.add(v);
                }
            }
            if (parent[b] == -2) continue;        // e is not on any cycle (it is a bridge)
            List<Integer> cycle = new ArrayList<>();
            for (int x = b; x != -1; x = parent[x]) cycle.add(x);
            if (best.isEmpty() || cycle.size() < best.size()) best = cycle;
        }
        return best;
    }

    public static void main(String[] args) {
        // A 6-cycle 0-1-2-3-4-5-0 with a chord 1-4 that creates two 4-cycles.
        int n = 7;
        int[][] edges = {{0, 1}, {1, 2}, {2, 3}, {3, 4}, {4, 5}, {5, 0}, {1, 4}, {3, 6}};
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
        System.out.println("girth = " + girth(adj));
        System.out.println("cycle = " + printShortestCycle(n, edges));
    }
}
```

```output
girth = 4
cycle = [1, 4, 5, 0]
```

The graph is a hexagon `0–1–2–3–4–5–0` with a chord `1–4` and a pendant vertex 6. It has three cycles: the hexagon (length 6) and the two squares `0–1–4–5` and `1–2–3–4`. For the first edge, `0–1`, the BFS from 0 that avoids that edge finds `0 → 5 → 4 → 1`; read back from 1 that is `[1, 4, 5, 0]`, and with the removed edge `0–1` it closes into a square. The edge `3–6` is a bridge: no alternative path, so it is skipped.

In the girth method, the check `parent[u] != v` is what stops the tree edge from being counted as a "cycle of length 2" — the same false positive the detection algorithms avoid.

### Minimum weight cycle

With non-negative weights, the edge-removal idea carries over directly: for each edge `(a, b, w)`, forbid it, run **Dijkstra** from `a` to `b`, and the cycle weight is `dist(a, b) + w`. The minimum over all edges is the minimum weight cycle. The girth trick can be adapted by running Dijkstra from every vertex, but its correctness argument needs extra care with ties and shared path prefixes; the edge-removal method is simpler to prove correct and is the standard answer.

```java title="MinWeightCycle.java"
import java.util.*;

public class MinWeightCycle {
    /** edges[i] = {u, v, w} with w >= 0. Returns the minimum total weight of a cycle, or -1. */
    static long minWeightCycle(int n, int[][] edges) {
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < edges.length; i++) {
            int[] e = edges[i];
            adj.get(e[0]).add(new int[]{e[1], e[2], i});   // {to, weight, edge id}
            adj.get(e[1]).add(new int[]{e[0], e[2], i});
        }
        long best = Long.MAX_VALUE;
        for (int skip = 0; skip < edges.length; skip++) {
            int a = edges[skip][0], b = edges[skip][1], w = edges[skip][2];
            long d = dijkstra(n, adj, a, b, skip);
            // Any cycle through edge (a, b) is that edge plus some a ~> b path avoiding it.
            if (d != Long.MAX_VALUE) best = Math.min(best, d + w);
        }
        return best == Long.MAX_VALUE ? -1 : best;
    }

    private static long dijkstra(int n, List<List<int[]>> adj, int src, int dst, int banned) {
        long[] dist = new long[n];
        Arrays.fill(dist, Long.MAX_VALUE);
        dist[src] = 0;
        PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingLong(x -> x[0]));
        pq.add(new long[]{0, src});
        while (!pq.isEmpty()) {
            long[] top = pq.poll();
            int u = (int) top[1];
            if (top[0] > dist[u]) continue;            // stale entry
            if (u == dst) return dist[u];
            for (int[] e : adj.get(u)) {
                if (e[2] == banned) continue;          // compare edge ids, not endpoints
                long nd = dist[u] + e[1];
                if (nd < dist[e[0]]) {
                    dist[e[0]] = nd;
                    pq.add(new long[]{nd, e[0]});
                }
            }
        }
        return Long.MAX_VALUE;
    }

    public static void main(String[] args) {
        int[][] edges = {
            {0, 1, 4}, {1, 2, 1}, {2, 0, 6},   // triangle of weight 11
            {1, 3, 2}, {3, 4, 2}, {4, 2, 1},   // with 1-2 gives 1-3-4-2-1 weight 6
            {4, 5, 9},
        };
        System.out.println(minWeightCycle(6, edges));
        System.out.println(minWeightCycle(3, new int[][]{{0, 1, 5}, {1, 2, 5}}));
    }
}
```

```output
6
-1
```

The triangle `0–1–2` has only three edges, but weight 11. The four-edge cycle `1–3–4–2–1` weighs `2 + 2 + 1 + 1 = 6` and wins — fewest edges and least weight are different questions. The second graph is a path, so there is no cycle.

This version bans the edge by its **id** rather than by its endpoints. That matters if the graph has parallel edges: banning "any edge between `a` and `b`" would also ban the parallel copy, and miss the 2-edge cycle they form.

Time is E runs of Dijkstra: **O(E · (E log V))** with a binary heap. To print the cycle, keep Dijkstra's parent array and walk back from `b`, exactly as in the unweighted version. For dense graphs an alternative computes all-pairs distances with Floyd–Warshall in O(V³) and then checks cycles through each vertex; for directed graphs the minimum weight cycle is `min over edges (u, v, w)` of `w + dist(v, u)`, which only needs all-pairs distances because direction already forbids reusing the edge backwards. A related problem with a different objective, the cycle with the smallest *average* edge weight, is covered in [[a8-minimum-mean-weight-cycle]].

## Cycles of Length N {#a8-cycles-of-length-n}

**Counting cycles of length N** asks how many distinct simple cycles in an undirected graph have exactly `n` vertices (equivalently, `n` edges). For `n = 3` this counts triangles, a standard measure of clustering in social networks; for general `n` it is a classic backtracking exercise in avoiding double counting.

### The search

A cycle of length `n` is a path of `n` distinct vertices whose last vertex is adjacent to its first. So from each start vertex, run a depth-limited DFS that extends a path of distinct vertices; when the path has `n` vertices, check whether its end is adjacent to the start.

Done naively, this counts each cycle many times: a cycle of `n` vertices can be started at any of its `n` vertices and walked in either of 2 directions, giving `2n` copies. Two rules remove the duplicates:

1. **Start at the cycle's smallest vertex.** Only allow the path to visit vertices larger than `start`. Every cycle is then found only from its minimum vertex, which removes the factor `n`.
2. **Divide by 2.** From its minimum vertex, each cycle is still walked once in each direction. Every cycle is counted exactly twice, so halve the total.

A small extra prune: since the other `n − 1` vertices must all be larger than `start`, there is no point starting from any of the last `n − 1` vertices.

```java title="CyclesOfLengthN.java"
public class CyclesOfLengthN {
    /** Counts simple cycles with exactly len vertices (len >= 3) in an undirected graph. */
    static int countCycles(boolean[][] g, int len) {
        int n = g.length, count = 0;
        boolean[] onPath = new boolean[n];
        // Make each cycle's smallest vertex its start; later vertices must be larger.
        for (int start = 0; start <= n - len; start++) {
            onPath[start] = true;
            count += extend(g, start, start, len - 1, onPath);
            onPath[start] = false;
        }
        return count / 2;   // each cycle is walked once in each direction
    }

    // We are at u and still need `remaining` more vertices before closing back to start.
    private static int extend(boolean[][] g, int start, int u, int remaining, boolean[] onPath) {
        if (remaining == 0) return g[u][start] ? 1 : 0;
        int found = 0;
        for (int v = start + 1; v < g.length; v++) {
            if (!g[u][v] || onPath[v]) continue;
            onPath[v] = true;
            found += extend(g, start, v, remaining - 1, onPath);
            onPath[v] = false;
        }
        return found;
    }

    static boolean[][] fromMatrix(int[][] m) {
        boolean[][] g = new boolean[m.length][m.length];
        for (int i = 0; i < m.length; i++)
            for (int j = 0; j < m.length; j++) g[i][j] = m[i][j] == 1;
        return g;
    }

    public static void main(String[] args) {
        int[][] m = {
            {0, 1, 0, 1, 0},
            {1, 0, 1, 0, 1},
            {0, 1, 0, 1, 0},
            {1, 0, 1, 0, 1},
            {0, 1, 0, 1, 0},
        };
        boolean[][] g = fromMatrix(m);
        System.out.println("length 3: " + countCycles(g, 3));
        System.out.println("length 4: " + countCycles(g, 4));
        System.out.println("length 5: " + countCycles(g, 5));

        // Complete graph K4: 4 triangles and 3 four-cycles.
        boolean[][] k4 = new boolean[4][4];
        for (int i = 0; i < 4; i++) for (int j = 0; j < 4; j++) k4[i][j] = i != j;
        System.out.println("K4 length 3: " + countCycles(k4, 3) + ", length 4: " + countCycles(k4, 4));
    }
}
```

```output
length 3: 0
length 4: 3
length 5: 0
K4 length 3: 4, length 4: 3
```

The 5-vertex graph is the classic example: vertices 1 and 3 are each joined to 0, 2 and 4, and nothing else is joined. Its 4-cycles are `0–1–2–3`, `0–1–4–3` and `1–2–3–4`. It has no triangles and no 5-cycles because it is **bipartite** — every edge joins `{1, 3}` to `{0, 2, 4}` — and bipartite graphs have no odd cycles at all (see [[a8-bipartite]] and [[a8-odd-cycle-bipartite]]). The complete graph on four vertices has `C(4,3) = 4` triangles and 3 four-cycles (the 4 vertices arranged in a ring can be ordered in `3!/2 = 3` distinct ways).

### Trace from start 0, length 4

Paths must use vertices greater than 0. From 0 the neighbours are 1 and 3.

| Path so far | Next options (> 0, adjacent, not on path) | Result at length 4 |
|---|---|---|
| `0, 1` | 2, 4 | — |
| `0, 1, 2` | 3 | `0,1,2,3`: 3 is adjacent to 0, count |
| `0, 1, 4` | 3 | `0,1,4,3`: count |
| `0, 3` | 2, 4 | — |
| `0, 3, 2` | 1 | `0,3,2,1`: count (reverse of `0,1,2,3`) |
| `0, 3, 4` | 1 | `0,3,4,1`: count (reverse of `0,1,4,3`) |

Start 0 contributes 4 — two cycles, each in both directions. Start 1 contributes 2 (the cycle `1–2–3–4` both ways), start 2 cannot begin any length-4 path through larger vertices, and 4 is excluded by the `n − len` bound. Total 6, halved: 3.

### Complexity

In the worst case each start explores every path of `n − 1` further vertices, each step choosing among up to `V` candidates (with an adjacency matrix) — O(V^n) overall, or O(V · d^(n−1)) with adjacency lists and maximum degree `d`. This is fine for small `n`, which is the usual setting. Counting cycles of *arbitrary* length is computationally hard in general, so do not expect a polynomial algorithm for large `n`.

### Why matrix powers are not the answer (except for triangles)

If `A` is the adjacency matrix, the entry `(A^k)[i][j]` counts **walks** of length `k` from `i` to `j` ([[a8-count-walks-k-edges]]). For triangles this gives a neat formula: the trace of `A³` counts closed walks of length 3, every one of which is a triangle traversed from one of its 3 vertices in one of 2 directions, so the number of triangles is `trace(A³) / 6`. For length 4 and above, closed walks include degenerate ones that revisit vertices (such as `0 → 1 → 0 → 1 → 0`), so `trace(A^k)` overcounts and is not the number of cycles without correction terms.

## Print All Cycles {#a8-print-all-cycles}

**Printing all cycles** of an undirected graph means listing every simple cycle, each exactly once — not twice in opposite directions, and not once per starting vertex. It is the most expensive question in this lesson, because the answer itself can be enormous: the complete graph on `V` vertices has more simple cycles than `(V − 1)! / 2` (that many Hamiltonian cycles alone).

### Two different questions with the same name

Before coding, decide which of two things is being asked.

- **Every simple cycle.** All of them, however they overlap. This is what "print all cycles" means mathematically, and what this section implements.
- **One cycle per back edge.** A popular textbook approach runs DFS and, each time it meets a back edge, prints the tree path it closes. That prints exactly `E − V + C` cycles (one per non-tree edge), called a **fundamental cycle basis**. Every cycle in the graph can be built by combining these, but the list is *not* every cycle: in the example below it would print 2 cycles while the graph has 3. If a problem's expected output matches this count, it wants the basis.

### Backtracking with canonical ordering

To list every simple cycle, extend paths of distinct vertices by backtracking, and record a cycle when the path can step back to its start. Two rules make each cycle appear once:

1. **The start is the cycle's smallest vertex**: only extend to vertices larger than `start`. This fixes the rotation.
2. **Fix the direction**: a cycle `start, x, …, y` is walked twice from its start, once as `start, x, …, y` and once as `start, y, …, x`. Keep only the walk whose second vertex is smaller than its last.

A cycle needs at least three vertices in a simple graph; requiring `path.size() >= 3` before closing prevents the edge to `start`'s first neighbour from being mistaken for a 2-cycle.

```java title="AllCycles.java"
import java.util.*;

public class AllCycles {
    /** Every simple cycle of a simple undirected graph, each listed exactly once. */
    static List<List<Integer>> allCycles(List<List<Integer>> adj) {
        List<List<Integer>> out = new ArrayList<>();
        boolean[] onPath = new boolean[adj.size()];
        Deque<Integer> path = new ArrayDeque<>();
        for (int start = 0; start < adj.size(); start++) {
            onPath[start] = true;
            path.addLast(start);
            walk(start, start, adj, onPath, path, out);
            path.removeLast();
            onPath[start] = false;
        }
        return out;
    }

    private static void walk(int start, int u, List<List<Integer>> adj, boolean[] onPath,
                             Deque<Integer> path, List<List<Integer>> out) {
        for (int v : adj.get(u)) {
            if (v == start && path.size() >= 3) {
                List<Integer> cycle = new ArrayList<>(path);   // copy: path keeps changing
                // The same cycle is walked in both directions; keep the one whose
                // second vertex is smaller than its last.
                if (cycle.get(1) < cycle.get(cycle.size() - 1)) out.add(cycle);
            } else if (v > start && !onPath[v]) {          // start stays the minimum vertex
                onPath[v] = true;
                path.addLast(v);
                walk(start, v, adj, onPath, path, out);
                path.removeLast();                         // backtrack
                onPath[v] = false;
            }
        }
    }

    public static void main(String[] args) {
        int n = 5;
        int[][] edges = {{0, 1}, {1, 2}, {2, 0}, {1, 3}, {3, 2}, {3, 4}};
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
        for (List<Integer> c : allCycles(adj)) System.out.println(c);
    }
}
```

```output
[0, 1, 2]
[0, 1, 3, 2]
[1, 2, 3]
```

The graph is two triangles `0–1–2` and `1–2–3` sharing the edge `1–2`, plus a pendant edge `3–4`. It has exactly three simple cycles: the two triangles and the outer square `0–1–3–2`. A fundamental basis would contain only `E − V + C = 6 − 5 + 1 = 2` of them; the square is the combination of the two triangles with their shared edge cancelled.

### How the duplicates are removed

From start 0, the search finds `0, 1, 2` and `0, 2, 1` (the same triangle in both directions) and keeps only the first, since its second vertex 1 is smaller than its last vertex 2. It finds `0, 1, 3, 2` and `0, 2, 3, 1` and keeps the first. From start 1, it may only use vertices above 1, so the triangle containing 0 cannot be found again; it finds `1, 2, 3` and `1, 3, 2` and keeps one. Vertex 4 has degree 1 and lies on no cycle.

The copy `new ArrayList<>(path)` matters: `path` is mutated as the search backtracks, so storing the live object would leave the output full of emptied or changed lists.

> [!WARNING] Normalising in only one direction
> A tempting deduplication compares the path with its plain reversal and stores the smaller in a `Set`. But the reversal of `[0, 1, 2]` is `[2, 1, 0]`, which no longer starts at 0, so the comparison always picks the forward list and both directions survive as different keys. Compare second and last vertices instead, or rotate the reversed list to start at the minimum before comparing.

### Complexity

The output can be exponential, so no algorithm can be polynomial in `V` and `E` alone. Complexity is therefore discussed as **output-sensitive**. This simple backtracking can also waste time exploring paths that never close into a cycle, so in the worst case it is slower than the output size suggests. **Johnson's algorithm** (1975) lists all simple cycles of a *directed* graph in O((V + E)(C + 1)) time for C cycles by avoiding those dead ends; for undirected graphs the same guarantee can be achieved by more involved methods, but for interview-sized inputs the backtracking above is the expected answer. Space is O(V) for the path and markers, plus whatever the output takes.

In practice, "list all cycles" is rarely what a real system needs. Circuit analysis uses the fundamental cycle basis (it gives the independent loop equations of Kirchhoff's voltage law), and dependency checkers usually need only one cycle to report as an error.

## How the methods compare

| Method | Answers | Time | Space | Notes |
|---|---|---|---|---|
| DFS + parent | Is there a cycle? Which one? | O(V + E) | O(V) | Recursion depth up to V |
| BFS + parent | Is there a cycle? | O(V + E) | O(V) | No recursion; cycle recovery needs two walks |
| Union-Find | Which edge first closes a cycle? | O(E · α(V)) | O(V) | Works on an edge stream; undirected only |
| Edge count `E ≥ V` | A cycle must exist | O(1) | O(1) | Sufficient, not necessary |
| BFS from every vertex | Girth | O(V · (V + E)) | O(V) | Unweighted |
| Remove edge + BFS/Dijkstra | Shortest / minimum-weight cycle, printed | O(E · (V + E)) or O(E · E log V) | O(V + E) | Ban edges by id |
| Depth-limited backtracking | Count cycles of length n | O(V · d^(n−1)) | O(n) | Smallest-vertex start, divide by 2 |
| Backtracking with canonical form | Every simple cycle | exponential (output-sensitive) | O(V) + output | Fix rotation and direction |

## In real systems

**Network topology.** Ethernet switches forward broadcast frames out of every port. If the physical wiring contains a loop, a broadcast circulates forever and multiplies — a "broadcast storm" that can take down a network in seconds. The Spanning Tree Protocol (IEEE 802.1D) solves this by having switches agree on a spanning tree of the topology and blocking the links not in it, which is cycle elimination done by a distributed algorithm.

**Validating trees.** Many systems store data that must form a tree: an organisation chart, a file-system hierarchy, a category taxonomy. Validating an update ("move this folder under that one") is a cycle check — in practice usually done on the directed parent pointers, but the "Graph Valid Tree" form (connected, with `V − 1` edges and no cycle) appears whenever the relationship is stored as undirected links.

**Minimum spanning trees.** Kruskal's algorithm ([[a8-mst-kruskal]]) sorts edges by weight and adds each unless it closes a cycle — Union-Find cycle detection in its inner loop. MSTs in turn underlie network design and clustering.

**Chemistry and circuits.** Ring detection in molecules (finding the rings in a molecular graph) is a shortest-cycle problem; cheminformatics toolkits compute a "smallest set of smallest rings". Electrical circuit analysis writes one Kirchhoff loop equation per fundamental cycle.

**Social networks.** The number of triangles — cycles of length 3 — measures how clustered a network is ("friends of friends are friends") and is a standard graph statistic computed at scale with specialised triangle-counting algorithms.

## Trade-offs and alternatives

**DFS versus BFS versus Union-Find for detection.** All three are effectively linear. DFS gives the simplest cycle recovery. BFS avoids recursion. Union-Find needs no adjacency list at all, processes edges in any order, and identifies the first offending edge — but cannot tell you the cycle's vertices without extra bookkeeping, and does not work for directed graphs.

**Undirected versus directed.** Everything in this lesson relies on edges being two-way. In a directed graph, reaching a visited vertex proves nothing unless that vertex is on the current DFS path; use three-colour DFS or Kahn's algorithm instead ([[a8-cycle-detection]], [[a8-cycle-directed-dfs]]). Applying the undirected parent check to a directed graph is a classic bug in both directions: it reports cycles that do not exist (two paths converging on one vertex) and its parent skip can hide real 2-cycles `u → v → u`.

**Cost of richer answers.** Detection is O(V + E); the shortest cycle needs roughly V or E traversals; counting length-`n` cycles is exponential in `n`; listing all cycles is exponential in the worst case. Ask for exactly what you need: if the requirement is "reject input that has a loop", detection is enough.

**Recursion.** Recursive DFS is the shortest code but can overflow the stack on long paths (a graph that is a single chain of 100,000 vertices). Production code on large graphs should use BFS, iterative DFS or Union-Find.

## Common mistakes

> [!MISTAKE] Treating the parent edge as a cycle
> Without the parent check, every undirected edge is reported as a cycle the moment DFS returns along it, because the edge appears in both endpoints' lists. Skip the parent — and only the parent; skipping all visited vertices instead would miss every real cycle.

**Checking only one component.** Calling `dfs(0, -1)` once explores only vertex 0's component. Loop over all vertices and start a traversal from each unvisited one.

**Marking on dequeue in BFS.** A vertex reachable from two queued vertices is enqueued twice and its parent overwritten, which can hide the cycle or report a wrong one. Mark when enqueuing.

**Returning too early from DFS.** Writing `return dfs(v, u, …)` inside the loop returns after the *first* child, even when it found no cycle, skipping the remaining neighbours. Only return early when the recursive call reports `true`.

**Using the undirected algorithm on a directed graph** (or the reverse). Directed graphs need recursion-stack or in-degree based detection.

**Counting a tree edge as a 2-cycle in girth computations.** In the BFS-from-every-vertex method, the `parent[u] != v` check is what prevents the answer from always being 2.

**Banning an edge by endpoints in multigraphs.** In the minimum-weight-cycle method, banning "any edge between `a` and `b`" also bans a parallel copy. Ban by edge id.

**Forgetting the factor of 2 (or 2n) when counting cycles.** Each undirected cycle has `n` starting points and 2 directions. Fix the start as the minimum vertex and divide by 2, or fix the direction explicitly.

**Storing a mutable path.** When collecting cycles, add a copy of the current path, not the path object itself.

## Interview perspective

Undirected cycle detection is usually asked directly ("detect a cycle in an undirected graph") or hidden inside "Graph Valid Tree", "Redundant Connection", or as a sub-step in an MST question. Interviewers look for three things: the parent check with a clear reason, the loop over all components, and awareness that directed graphs need a different method.

> [!INTERVIEW] What a strong answer sounds like
> "I'll run DFS from every unvisited vertex, passing the parent. Each undirected edge appears in both adjacency lists, so seeing the parent again is just the edge I came in on — I skip it. Any other visited neighbour means there are two different routes between the same vertices, which is a cycle. It's O(V + E) time and O(V) space. If the graph were directed, I'd need to track the recursion stack instead, because reaching a visited vertex there doesn't imply a cycle."

Questions you should be able to answer:

- **Why does the parent check work for BFS too?** Any traversal that marks on discovery builds a tree of parent pointers; a visited neighbour that is not the parent is a non-tree edge, and a non-tree edge plus the tree path between its endpoints is a cycle.
- **Graph Valid Tree: what is the fastest check?** The graph must have exactly `V − 1` edges *and* be connected (or, equivalently, be acyclic). With exactly `V − 1` edges, connected and acyclic imply each other, so one traversal or one Union-Find pass suffices.
- **Redundant Connection: which edge closes the cycle?** Union-Find over the edges in order; the first edge whose endpoints already share a root.
- **How do you print the cycle?** Keep a parent array; at the back edge `u–v`, walk parents from `u` up to `v`.
- **How do you handle parallel edges or self-loops?** Clarify whether they count as cycles. The parent-vertex check happens to report them (from the parent's side, or immediately for a self-loop); tracking the parent edge id is the robust general approach.
- **Find the shortest cycle.** BFS from every vertex, candidate `dist[u] + dist[v] + 1` on non-tree edges, O(V · (V + E)). Weighted: ban each edge and run Dijkstra between its endpoints.
- **List all cycles: what is the complexity?** Exponential in the worst case because the output itself can be exponential; explain the minimum-start and direction rules for deduplication.

## Practice

1. **Detect a cycle in an undirected graph** with recursive DFS, then with BFS, then with Union-Find. Test with a forest, a single cycle, and a graph whose only cycle is in the last component.
2. **Graph Valid Tree.** Given `n` and an edge list, decide whether the edges form a single tree.
3. **Redundant Connection.** Return the edge that, if removed, leaves a tree; among several, the last in the input.
4. **Print the cycle.** Extend your DFS to return the vertices of the first cycle found.
5. **Shortest cycle.** Return the length of the shortest cycle of an unweighted graph, then print one.
6. **Minimum weight cycle.** Same for a weighted graph with non-negative weights.
7. **Count triangles** with the backtracking method and verify with `trace(A³) / 6` on a small graph.
8. **Count cycles of length 4** in a 6-vertex graph of your choice, and check your count by hand.
9. **All cycles.** List every simple cycle of the "two triangles sharing an edge" graph, then add an edge and predict the new count before running.
10. **Count trees in a forest** ([[a8-count-trees-in-forest]]): a direct use of the `V − C` edge identity and component counting.

The DSA explorer lists matching problems under this topic and under [[a8-union-find]].

## Quick revision {#quick-revision}

- A cycle: closed path with no repeated edge or intermediate vertex; at least 3 vertices in a simple graph.
- Forest with `V` vertices and `C` components has `V − C` edges; `E ≥ V` in a simple graph forces a cycle.
- Each undirected edge is stored twice, so plain "visited" gives false positives; skip the parent.
- DFS + parent: visited neighbour ≠ parent → cycle. Undirected DFS has only tree and back edges.
- BFS + parent: same check; mark on enqueue; the non-tree edge can be same-level or next-level.
- The parent check works for any traversal that marks on discovery and remembers the discovering vertex.
- Always loop over all vertices to cover every component.
- Detection is O(V + E) time, O(V) space; recursive DFS can overflow on deep graphs.
- Recover the cycle: at back edge `u–v`, walk parent pointers from `u` to `v`.
- Union-Find: an edge whose endpoints share a root closes a cycle; O(E · α(V)); undirected only.
- Girth: BFS from every vertex, candidate `dist[u] + dist[v] + 1` on non-tree edges; O(V · (V + E)).
- Print shortest cycle / minimum weight cycle: for each edge, ban it (by id) and find the shortest path between its endpoints (BFS or Dijkstra); add the edge back.
- Cycles of length n: depth-limited DFS from each start through larger vertices only, close back to start, divide by 2. Triangles = `trace(A³) / 6`; higher powers count walks, not cycles.
- All cycles: backtracking; start = minimum vertex; keep the direction with second vertex < last; copy the path. Exponential output.
- "One cycle per back edge" gives `E − V + C` fundamental cycles, not all cycles.
- Directed graphs need recursion-stack (three-colour) DFS or Kahn's algorithm instead.

## Key takeaways {#key-takeaways}

- In an undirected graph, a cycle exists exactly when a traversal reaches an already-discovered vertex through an edge other than the one that discovered the current vertex.
- The parent check exists because every undirected edge appears in both adjacency lists; it removes that one false positive and nothing else.
- DFS, BFS and Union-Find all detect undirected cycles in effectively linear time; choose by whether you need the cycle's vertices, want to avoid recursion, or process edges as a stream.
- Always cover every connected component, and mark vertices when they are discovered.
- Finding the best cycle costs more: the shortest cycle needs one search per vertex or per edge, and the minimum weight cycle combines edge removal with Dijkstra.
- Counting cycles of a fixed length and listing all cycles are backtracking problems whose cost grows exponentially; deduplicate by fixing the start vertex and the direction.
- None of this applies unchanged to directed graphs, where the test is a visited vertex on the current DFS path.
