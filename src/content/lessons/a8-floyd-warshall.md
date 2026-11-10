---
summary: Floyd-Warshall computes the shortest distance between every pair of vertices with three nested loops, by letting paths use one more allowed "via" vertex at a time. You will learn why its loop order is fixed, how it handles negative edges and cycles, and the related techniques for all-pairs and special-structure shortest paths — Johnson's algorithm, multistage graphs, 0-1 weighted graphs and the minimum mean cycle.
difficulty: intermediate
minutes: 85
objectives:
  - Derive the Floyd-Warshall recurrence from the "intermediate vertices from {0..k}" state and explain why k must be the outermost loop
  - Implement Floyd-Warshall in Java with infinity guards, path reconstruction and negative-cycle detection, and derive its O(V³) time and O(V²) space
  - Explain how Johnson's algorithm reweights edges with Bellman-Ford potentials so that Dijkstra can run from every vertex
  - Solve shortest paths on multistage graphs with DP and on 0/1-weighted graphs with a deque in linear time
  - Compute the minimum mean weight of a cycle with Karp's algorithm and choose the right all-pairs method for given constraints
---

## Introduction

Single-source algorithms answer "how far is everything from *here*?". Many problems instead ask about every pair at once. A logistics planner wants a table of travel times between every two depots. A game needs the distance between any two rooms to drive enemy AI. A network tool wants to know, for each server, how many others are within 5 milliseconds. These are **all-pairs shortest path** problems: compute `dist(i, j)` for every ordered pair of vertices.

You could run a single-source algorithm from every vertex. **Floyd-Warshall** does something different and surprisingly compact: it fills a `V × V` table with three nested loops and one line of arithmetic, works with negative edge weights, and detects negative cycles for free. It runs in O(V³) time regardless of how many edges there are, which makes it the standard choice when `V` is at most a few hundred.

The algorithm is named after Robert Floyd and Stephen Warshall, who published closely related versions in 1962 (Warshall's computed reachability rather than distances; Bernard Roy had described the same idea in 1959). It is also one of the cleanest examples of **dynamic programming** on graphs, so understanding it well teaches you how to design a DP state.

This lesson builds Floyd-Warshall from first principles, then covers the other members of the shortest-path family that this module groups with it: **Johnson's algorithm** for all pairs on large sparse graphs with negative edges, **multistage graphs** where a simple DP suffices, **binary (0/1) weighted graphs** where a deque beats a heap, and the **minimum mean weight cycle**, which reuses the same layered-DP thinking.

## Before you start

- **Dijkstra's algorithm** — single-source shortest paths with non-negative weights, priority queues and stale entries. See [[a8-dijkstra]].
- **Bellman-Ford** — relaxation, negative edges and negative-cycle detection; Johnson's algorithm and the mean-cycle section build directly on it. See [[a8-bellman-ford]].
- **Adjacency matrices** — storing a graph as a `V × V` array. See [[a8-adjacency-matrix]].
- **Dynamic programming basics** — defining a state and a recurrence, filling a table. See [[a11-tabulation]].

## The intuition

Imagine a table of flight prices between eight cities, but only for direct flights. Many pairs have no direct flight, so their cell is blank (infinity). Now someone says: "you may change planes in Amsterdam." Go through every pair `(i, j)` and ask whether flying `i → Amsterdam → j` beats the current price. Some blanks get filled; some prices drop. The table now holds the best prices **using Amsterdam as the only possible stopover**.

Next: "you may also change planes in Berlin." Repeat the check through Berlin, but use the *updated* table, so `i → Berlin` might already be a route through Amsterdam. Now the table holds the best prices using any stopovers from {Amsterdam, Berlin}, in any combination. Add the cities one at a time. After the last one, every possible combination of stopovers has been allowed, and the table holds the true cheapest price for every pair.

That is Floyd-Warshall. The outer loop grants permission to use one more city as a stopover; the inner two loops update every pair. The order in which cities are granted permission does not matter, but the granting must happen one city at a time across the whole table, which is why the "permission" loop has to be the outermost one.

## The problem and the naive approaches

Given a directed weighted graph with `V` vertices and `E` edges, compute `dist(i, j)` for every ordered pair, where weights may be negative but we must detect negative cycles.

**Run a single-source algorithm from every vertex.** With Dijkstra (non-negative weights only), that is V runs of O((V + E) log V), or O(V · E · log V) for a connected graph. On a sparse graph that is good. On a dense graph with E ≈ V², it is O(V³ log V) — worse than Floyd-Warshall — and the code needs a heap and an adjacency list. With negative weights, Dijkstra is invalid; V runs of Bellman-Ford cost O(V² · E), which is O(V⁴) on dense graphs.

**Enumerate paths.** Exponential, and with negative cycles not even finite.

Floyd-Warshall gives O(V³) for any density and any weights, with almost no code. The trade-off is that it is O(V³) even when the graph is very sparse, and it always uses O(V²) memory.

## All-Pairs Shortest Paths via Intermediates {#a8-floyd-warshall-all-pairs}

Floyd-Warshall computes **all-pairs shortest paths** by dynamic programming over the set of vertices a path is allowed to pass *through*. An **intermediate vertex** of a path is any vertex on it other than its two endpoints. The algorithm grows the set of allowed intermediates one vertex at a time and keeps, for every pair, the best path that uses only allowed intermediates.

### The state and the recurrence

Number the vertices `0` to `V − 1`. Define:

> `D_k[i][j]` = length of the shortest path from `i` to `j` whose intermediate vertices all come from `{0, 1, …, k}`.

Before any vertex is allowed (call it `k = −1`), the only paths with no intermediates are direct edges, so `D_{−1}[i][j]` is the edge weight, `0` when `i = j`, and infinity when there is no edge.

Now suppose we know `D_{k−1}` and allow vertex `k` as well. Look at the best `i → j` path whose intermediates are in `{0..k}`. Either it does not pass through `k` — then it only uses `{0..k−1}`, and its length is `D_{k−1}[i][j]` — or it passes through `k`. In the second case, assuming no negative cycles, it visits `k` once, so it splits into an `i → k` part and a `k → j` part, each using intermediates only from `{0..k−1}`. Their best lengths are `D_{k−1}[i][k]` and `D_{k−1}[k][j]`. So:

```text
D_k[i][j] = min( D_{k-1}[i][j],  D_{k-1}[i][k] + D_{k-1}[k][j] )
```

After `k = V − 1`, every vertex is allowed and `D_{V−1}[i][j]` is the true shortest distance. That one line is the entire algorithm.

### Why one matrix is enough

Storing `V` matrices would cost O(V³) memory. Floyd-Warshall updates a single matrix in place, and this is safe for a precise reason: during phase `k`, the two values the recurrence reads, `dist[i][k]` and `dist[k][j]`, never change. Updating `dist[i][k]` would mean `dist[i][k] + dist[k][k] < dist[i][k]`, which needs `dist[k][k] < 0` — a negative cycle. With no negative cycle, row `k` and column `k` are fixed during phase `k`, so it does not matter whether a cell is read before or after it is updated.

### Why k must be the outermost loop

The DP only works if **all** pairs are updated for `k` before any pair is updated for `k + 1`, because phase `k + 1` reads values that must already allow `{0..k}`. With `k` as the innermost loop, `dist[i][j]` gets one final chance to improve — at the moment the `(i, j)` iteration runs — using whatever `dist[i][k]` and `dist[k][j]` happen to hold then. Many of those entries have not been improved yet, so paths with two or more intermediates are missed.

```java title="LoopOrder.java"
import java.util.*;

public class LoopOrder {
    static final long INF = Long.MAX_VALUE / 4;

    static long[][] matrix() {
        long[][] d = new long[4][4];
        for (int i = 0; i < 4; i++) { Arrays.fill(d[i], INF); d[i][i] = 0; }
        d[0][3] = 1; d[3][2] = 1; d[2][1] = 1;      // the only route 0 -> 1 is 0 -> 3 -> 2 -> 1
        return d;
    }

    static void relax(long[][] d, int i, int k, int j) {
        if (d[i][k] != INF && d[k][j] != INF && d[i][k] + d[k][j] < d[i][j]) {
            d[i][j] = d[i][k] + d[k][j];
        }
    }

    public static void main(String[] args) {
        long[][] right = matrix(), wrong = matrix();
        for (int k = 0; k < 4; k++)
            for (int i = 0; i < 4; i++)
                for (int j = 0; j < 4; j++) relax(right, i, k, j);
        for (int i = 0; i < 4; i++)
            for (int j = 0; j < 4; j++)
                for (int k = 0; k < 4; k++) relax(wrong, i, k, j);   // k innermost
        System.out.println("k outermost: 0 -> 1 = " + right[0][1]);
        System.out.println("k innermost: 0 -> 1 = " + (wrong[0][1] == INF ? "INF" : wrong[0][1]));
    }
}
```

```output
k outermost: 0 -> 1 = 3
k innermost: 0 -> 1 = INF
```

With `k` innermost, the pair `(0, 1)` is finalised first, while `dist[0][2]` and `dist[3][1]` are still infinity — they are only improved later, when their own `(i, j)` turns come. The route needs two intermediates (3 and 2) and is never found. Some references say the wrong order lets paths "use an intermediate vertex twice"; that is not the failure. The failure is that valid paths are *missed*, and the error is silent: on a random test of 100,000 small graphs, the wrong order produced a different matrix in about 14% of cases, so a handful of passing examples proves nothing.

### A complete implementation with path reconstruction

To print paths, keep a second matrix `next[i][j]`: the first vertex after `i` on the best known `i → j` path. Initially `next[i][j] = j` for every edge. When the path through `k` wins, the route to `j` now starts by heading towards `k`, so `next[i][j] = next[i][k]`.

```java title="FloydWarshall.java"
import java.util.*;

public class FloydWarshall {
    static final long INF = Long.MAX_VALUE / 4;

    // dist starts as the weight matrix; next[i][j] is the first hop on a best i -> j path.
    static void run(long[][] dist, int[][] next, boolean trace) {
        int n = dist.length;
        for (int k = 0; k < n; k++) {                   // k MUST be the outermost loop
            for (int i = 0; i < n; i++) {
                if (dist[i][k] == INF) continue;        // no i -> k path: k cannot help row i
                for (int j = 0; j < n; j++) {
                    if (dist[k][j] == INF) continue;
                    if (dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                        next[i][j] = next[i][k];        // go towards k first
                    }
                }
            }
            if (trace) { System.out.println("after k = " + k + ":"); print(dist); }
        }
    }

    static List<Integer> path(int[][] next, int i, int j) {
        if (next[i][j] == -1) return List.of();         // no path
        List<Integer> p = new ArrayList<>(List.of(i));
        while (i != j) { i = next[i][j]; p.add(i); }
        return p;
    }

    static void print(long[][] d) {
        for (long[] row : d) {
            StringBuilder sb = new StringBuilder();
            for (long x : row) sb.append(String.format("%5s", x == INF ? "INF" : Long.toString(x)));
            System.out.println(sb);
        }
    }

    public static void main(String[] args) {
        int n = 4;
        int[][] edges = {{0, 1, 5}, {0, 3, 10}, {1, 2, 3}, {2, 3, 1}, {3, 1, -2}, {2, 0, 2}};
        long[][] dist = new long[n][n];
        int[][] next = new int[n][n];
        for (int i = 0; i < n; i++) {
            Arrays.fill(dist[i], INF);
            Arrays.fill(next[i], -1);
            dist[i][i] = 0;
            next[i][i] = i;
        }
        for (int[] e : edges) {
            dist[e[0]][e[1]] = Math.min(dist[e[0]][e[1]], e[2]);   // keep the cheapest parallel edge
            next[e[0]][e[1]] = e[1];
        }
        run(dist, next, true);
        System.out.println("path 0 -> 3: " + path(next, 0, 3));
        System.out.println("path 3 -> 0: " + path(next, 3, 0));
        boolean negativeCycle = false;
        for (int i = 0; i < n; i++) if (dist[i][i] < 0) negativeCycle = true;
        System.out.println("negative cycle: " + negativeCycle);
    }
}
```

```output
after k = 0:
    0    5  INF   10
  INF    0    3  INF
    2    7    0    1
  INF   -2  INF    0
after k = 1:
    0    5    8   10
  INF    0    3  INF
    2    7    0    1
  INF   -2    1    0
after k = 2:
    0    5    8    9
    5    0    3    4
    2    7    0    1
    3   -2    1    0
after k = 3:
    0    5    8    9
    5    0    3    4
    2   -1    0    1
    3   -2    1    0
path 0 -> 3: [0, 1, 2, 3]
path 3 -> 0: [3, 1, 2, 0]
negative cycle: false
```

The setup puts 0 on the diagonal (the empty path) and infinity elsewhere, then copies edges in, keeping the cheaper of any parallel edges. The two `continue` guards serve two purposes: they prevent `INF + something` from being treated as a real distance, and the row-level guard skips a whole row of `n` iterations when `i` cannot reach `k`, a cheap speed-up on sparse inputs.

### Dry run

The starting matrix (row = from, column = to) is the direct edges:

| from \ to | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| 0 | 0 | 5 | INF | 10 |
| 1 | INF | 0 | 3 | INF |
| 2 | 2 | INF | 0 | 1 |
| 3 | INF | −2 | INF | 0 |

Follow the phases in the output:

| Phase | Allowed intermediates | Changes |
|---|---|---|
| `k = 0` | {0} | `2 → 1` becomes `2 → 0 → 1` = 2 + 5 = 7 |
| `k = 1` | {0, 1} | `0 → 2` = 5 + 3 = 8; `3 → 2` = −2 + 3 = 1 |
| `k = 2` | {0, 1, 2} | `0 → 3` = 8 + 1 = 9 beats 10; row 1 fills in: `1 → 0` = 3 + 2 = 5, `1 → 3` = 3 + 1 = 4; `3 → 0` = 1 + 2 = 3 |
| `k = 3` | all | `2 → 1` = 1 + (−2) = −1 beats 7 |

Notice that `0 → 3` dropped to 9 at `k = 2` through the path `0 → 1 → 2 → 3`, even though that path has two intermediates: `dist[0][2] = 8` already stood for `0 → 1 → 2`, built at `k = 1`. That is the DP reusing earlier work. Reconstructing `0 → 3` with `next` gives `0 → 1 → 2 → 3` (5 + 3 + 1 = 9). The diagonal stays at 0, so there is no negative cycle — the only cycle through the negative edge, `1 → 2 → 3 → 1`, weighs 3 + 1 − 2 = 2.

### Complexity derivation

**Time.** The three loops each run `V` times, and the body is constant work: exactly V³ iterations, so Θ(V³) whatever the number of edges. For `V = 400` that is 64 million simple operations, well under a second in Java; for `V = 2,000` it is 8 billion, which is too slow for most purposes. The usual rule of thumb is that Floyd-Warshall fits when `V` is at most about 400–500.

**Space.** One `V × V` distance matrix, plus another for `next` if you need paths: Θ(V²). A `long[2000][2000]` is 32 MB, which is a second practical limit.

### Negative cycles

Floyd-Warshall allows negative edges, and detects negative cycles through the diagonal. `dist[i][i]` starts at 0. If `i` lies on a negative cycle, the cycle through `i` is a cheaper `i → i` path, so after the algorithm **`dist[i][i] < 0` exactly for the vertices that lie on some negative cycle**.

When a negative cycle exists, the matrix values are no longer meaningful distances, for two reasons. First, any pair `(i, j)` with a path `i → k → j` where `dist[k][k] < 0` has no shortest path at all — its true distance is minus infinity. Second, the numbers themselves can explode: once a negative value is on the diagonal, phases keep adding negative entries together, and magnitudes grow exponentially. On a complete graph of 10 vertices with every edge weighing −1, entries reach about −6.7 million after a single run; at 30 vertices they overflow even a `long`. If you must run on graphs that may contain negative cycles, clamp every value at a minus-infinity floor, then mark the affected pairs:

```java title="FwNegInf.java"
import java.util.*;

public class FwNegInf {
    static final long INF = Long.MAX_VALUE / 4;
    static final long NEG_INF = Long.MIN_VALUE / 4;

    public static void main(String[] args) {
        int n = 4;
        long[][] d = new long[n][n];
        for (int i = 0; i < n; i++) { Arrays.fill(d[i], INF); d[i][i] = 0; }
        d[0][1] = 1; d[1][2] = -1; d[2][1] = -1; d[2][3] = 2;   // 1 <-> 2 is a cycle of weight -2
        for (int k = 0; k < n; k++)
            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++)
                    if (d[i][k] != INF && d[k][j] != INF)
                        d[i][j] = Math.max(NEG_INF, Math.min(d[i][j], d[i][k] + d[k][j]));
        // i -> j has no shortest path if some k on a negative cycle sits between them.
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                for (int k = 0; k < n; k++)
                    if (d[i][k] != INF && d[k][k] < 0 && d[k][j] != INF) d[i][j] = NEG_INF;
        for (long[] row : d) {
            StringBuilder sb = new StringBuilder();
            for (long x : row) sb.append(String.format("%6s", x == INF ? "INF" : x == NEG_INF ? "-INF" : x));
            System.out.println(sb);
        }
    }
}
```

```output
     0  -INF  -INF  -INF
   INF  -INF  -INF  -INF
   INF  -INF  -INF  -INF
   INF   INF   INF     0
```

Vertex 0 reaches the cycle `1 ↔ 2`, so everything it reaches through the cycle is minus infinity, while `0 → 0` stays 0 because no path leads back to 0. Vertex 3 has no outgoing edges and is untouched. The `Math.max(NEG_INF, …)` clamp keeps every value within a quarter of the `long` range, so even adding two clamped values cannot overflow.

### Variations

**Transitive closure.** Replace numbers with booleans, `min` with OR and `+` with AND: `reach[i][j] |= reach[i][k] && reach[k][j]`. After the loops, `reach[i][j]` says whether `j` is reachable from `i`. This is Warshall's original algorithm, taught in [[a8-transitive-closure]].

**Minimax and maximin paths.** Replace `+` with `max` and you get, for every pair, the path whose largest edge is smallest ("what is the lowest bridge height I must cross?"). The same three loops work because `max` and `min` combine the way the DP needs.

**Undirected graphs.** Fill both `dist[u][v]` and `dist[v][u]` for each edge; the algorithm itself does not change. Negative undirected edges create negative cycles, as with Bellman-Ford.

### Worked problem: the city with the fewest reachable neighbours

"Find the City With the Smallest Number of Neighbors at a Threshold Distance" gives `n ≤ 100` cities, weighted undirected roads and a threshold. Return the city that can reach the fewest other cities within the threshold, preferring the largest index on ties. The constraint `n ≤ 100` and the need to compare *every* city's reach make this a textbook Floyd-Warshall problem.

```java title="CityThreshold.java"
import java.util.*;

public class CityThreshold {
    static int findTheCity(int n, int[][] edges, int distanceThreshold) {
        final int INF = 1_000_000_000;                  // INF + INF still fits in int
        int[][] d = new int[n][n];
        for (int i = 0; i < n; i++) { Arrays.fill(d[i], INF); d[i][i] = 0; }
        for (int[] e : edges) {                         // undirected: fill both directions
            d[e[0]][e[1]] = Math.min(d[e[0]][e[1]], e[2]);
            d[e[1]][e[0]] = Math.min(d[e[1]][e[0]], e[2]);
        }
        for (int k = 0; k < n; k++)
            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++)
                    if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];

        int best = -1, bestCount = Integer.MAX_VALUE;
        for (int i = 0; i < n; i++) {
            int count = 0;
            for (int j = 0; j < n; j++) if (j != i && d[i][j] <= distanceThreshold) count++;
            if (count <= bestCount) { bestCount = count; best = i; }   // <= keeps the larger id
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(findTheCity(4, new int[][]{{0, 1, 3}, {1, 2, 1}, {1, 3, 4}, {2, 3, 1}}, 4));
        System.out.println(findTheCity(5, new int[][]{{0, 1, 2}, {0, 4, 8}, {1, 2, 3}, {1, 4, 2},
                                                     {2, 3, 1}, {3, 4, 1}}, 2));
    }
}
```

```output
3
0
```

This version uses a different infinity strategy from the earlier code: `INF = 10⁹` is small enough that `INF + INF` fits in an `int` (2 × 10⁹ < 2³¹ − 1 ≈ 2.147 × 10⁹), so no guard is needed — a sum involving `INF` is at least `INF` and never wins the comparison. This trick is safe here because weights are non-negative and real distances stay far below 10⁹. With negative weights, `INF + (−5)` would be smaller than `INF` and look like a real path, so keep the explicit guards in that case.

```quiz
Q: In Floyd-Warshall, what does dist[i][j] hold right after the iteration for k = 2 finishes?
- [ ] The shortest i -> j path with at most 3 edges
- [x] The shortest i -> j path whose intermediate vertices all come from {0, 1, 2}
- [ ] The shortest i -> j path that passes through vertex 2
- [ ] The final shortest distance, if the graph has at most 3 vertices on the path
> The DP state is about which vertices may appear in the middle of a path, not about the number of edges (that is Bellman-Ford's state). A path with intermediates {0, 1, 2} can have up to four edges. Passing through 2 is allowed but not required.

Q: Why is it safe to update the single dist matrix in place during phase k?
- [ ] Because Java arrays are copied when passed to a method
- [ ] Because each cell is written only once per phase
- [x] Because dist[i][k] and dist[k][j] cannot change during phase k unless dist[k][k] < 0, which means a negative cycle
- [ ] It is not safe; a correct implementation needs two matrices
> Updating dist[i][k] in phase k would need dist[i][k] + dist[k][k] < dist[i][k], i.e. dist[k][k] < 0. Without negative cycles, row k and column k are fixed during phase k, so reading a cell before or after its update gives the same result. Each cell can in fact be written at most once per phase, but that alone would not make the reads safe.

Q: After running Floyd-Warshall, dist[5][5] = -3. What does that tell you?
- [ ] Vertex 5 has a self-loop of weight -3
- [x] Vertex 5 lies on a negative cycle, so shortest paths through it are undefined
- [ ] The algorithm overflowed and the matrix must be recomputed with long
- [ ] Nothing; diagonal entries are not used
> The diagonal starts at 0 (the empty path). It can only drop below 0 if some cycle through vertex 5 has negative total weight. A negative self-loop is one possibility, but any longer negative cycle through 5 has the same effect, so the first option is too narrow.
```

## Johnson's Algorithm {#a8-johnsons-algorithm}

**Johnson's algorithm** computes all-pairs shortest paths on graphs that may have negative edge weights (but no negative cycles), and it is designed for **sparse** graphs, where Floyd-Warshall's O(V³) wastes most of its work on pairs that have no edge. The idea is to run Bellman-Ford once to compute a number for each vertex, use those numbers to change every edge weight into a non-negative one without changing which paths are shortest, and then run Dijkstra from every vertex. Donald Johnson published it in 1977.

### Why naive reweighting fails

The obvious way to remove negative weights is to add the same constant to every edge. That changes which path is shortest, because the constant is added once *per edge*: paths with more edges are penalised more. Edges `0 → 1 (2)`, `1 → 2 (−2)` and `0 → 2 (1)`: the two-edge path costs 0 and is shortest. Add 2 to every edge and it costs 4, while the direct edge costs 3 — the answer flips. The lesson [[a8-dijkstra-limitations]] walks through the same trap.

### Potentials: a reweighting that preserves shortest paths

Give each vertex `v` a number `h(v)`, called a **potential**, and define the new weight

```text
w'(u, v) = w(u, v) + h(u) - h(v)
```

Take any path `v₀ → v₁ → … → v_k`. Summing the new weights along it, every intermediate potential appears once with `+` and once with `−`, so they cancel (the sum **telescopes**):

```text
w'(path) = w(path) + h(v₀) - h(v_k)
```

The correction depends only on the two endpoints, not on the route. So among all paths from `v₀` to `v_k`, every one is shifted by the same amount, and the shortest path under `w'` is the shortest path under `w`. Cycles are unchanged in weight (start and end are the same vertex), so negative cycles stay negative.

Any `h` preserves shortest paths; the trick is choosing one that makes every `w'` non-negative. Add a new vertex `q` with a zero-weight edge to every vertex, and let `h(v)` be the shortest distance from `q` to `v`, computed with Bellman-Ford. Shortest distances satisfy the triangle inequality `h(v) ≤ h(u) + w(u, v)` for every edge — otherwise relaxing `u → v` would improve `h(v)`. Rearranged, that is exactly `w(u, v) + h(u) − h(v) ≥ 0`. If Bellman-Ford finds a negative cycle, there is no valid `h` and no shortest paths either, and the algorithm stops.

### The algorithm

1. Add a virtual vertex `q` with zero-weight edges to all vertices; run Bellman-Ford from `q` to get `h`. Report a negative cycle if one is found.
2. Reweight every edge: `w'(u, v) = w(u, v) + h(u) − h(v)`.
3. Run Dijkstra from every vertex `s` on the reweighted graph, getting `d'(s, t)`.
4. Convert back: `dist(s, t) = d'(s, t) − h(s) + h(t)`.

```java title="Johnson.java"
import java.util.*;

public class Johnson {
    record Edge(int from, int to, long w) {}
    static final long INF = Long.MAX_VALUE / 4;

    static long[][] allPairs(int n, List<Edge> edges) {
        // 1. Potentials: Bellman-Ford from a virtual source q with a 0-weight edge to every
        //    vertex. Starting every h[v] at 0 is exactly the state after relaxing q's edges,
        //    so n - 1 more passes settle h, and a change on pass n means a negative cycle.
        long[] h = new long[n];
        for (int pass = 1; pass <= n; pass++) {
            boolean changed = false;
            for (Edge e : edges) {
                if (h[e.from()] + e.w() < h[e.to()]) { h[e.to()] = h[e.from()] + e.w(); changed = true; }
            }
            if (!changed) break;
            if (pass == n) throw new IllegalArgumentException("negative cycle");
        }
        System.out.println("h = " + Arrays.toString(h));

        // 2. Reweight: w'(u, v) = w(u, v) + h[u] - h[v] is never negative.
        List<List<long[]>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (Edge e : edges) {
            long w2 = e.w() + h[e.from()] - h[e.to()];
            System.out.println("  " + e.from() + " -> " + e.to() + ": " + e.w() + " becomes " + w2);
            adj.get(e.from()).add(new long[]{e.to(), w2});
        }

        // 3. Dijkstra from every vertex on w', then undo the reweighting.
        long[][] result = new long[n][];
        for (int s = 0; s < n; s++) {
            long[] d = dijkstra(adj, s);
            for (int t = 0; t < n; t++) if (d[t] != INF) d[t] = d[t] - h[s] + h[t];
            result[s] = d;
        }
        return result;
    }

    static long[] dijkstra(List<List<long[]>> adj, int src) {
        long[] dist = new long[adj.size()];
        Arrays.fill(dist, INF);
        dist[src] = 0;
        PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingLong(a -> a[0]));
        pq.add(new long[]{0, src});
        while (!pq.isEmpty()) {
            long[] top = pq.poll();
            int u = (int) top[1];
            if (top[0] != dist[u]) continue;            // stale entry
            for (long[] e : adj.get(u)) {
                int v = (int) e[0];
                if (dist[u] + e[1] < dist[v]) { dist[v] = dist[u] + e[1]; pq.add(new long[]{dist[v], v}); }
            }
        }
        return dist;
    }

    public static void main(String[] args) {
        List<Edge> edges = List.of(
            new Edge(0, 1, 5), new Edge(0, 3, 10), new Edge(1, 2, 3),
            new Edge(2, 3, 1), new Edge(3, 1, -2), new Edge(2, 0, 2));
        for (long[] row : allPairs(4, edges)) System.out.println(Arrays.toString(row));
    }
}
```

```output
h = [0, -2, 0, 0]
  0 -> 1: 5 becomes 7
  0 -> 3: 10 becomes 10
  1 -> 2: 3 becomes 1
  2 -> 3: 1 becomes 1
  3 -> 1: -2 becomes 0
  2 -> 0: 2 becomes 2
[0, 5, 8, 9]
[5, 0, 3, 4]
[2, -1, 0, 1]
[3, -2, 1, 0]
```

This is the same graph as the Floyd-Warshall example, and the final matrix is identical. The potentials say that from the virtual source, vertex 1 can be reached at cost −2 (via `q → 3 → 1`); everything else at 0. The negative edge `3 → 1` becomes exactly 0 — an edge on a shortest path from `q` always gets reweighted to 0 — and no new weight is negative. The code never builds `q` explicitly: starting all potentials at 0 is the state right after relaxing `q`'s zero-weight edges.

### Complexity

Bellman-Ford costs O(V · E). Each Dijkstra with a binary heap costs O((V + E) log V), and there are V of them, so the total is **O(V · E · log V)** for a connected graph. With a Fibonacci heap the Dijkstra runs drop to O(E + V log V) each, for O(V · E + V² log V) overall — the bound usually quoted for Johnson's algorithm, though Java's `PriorityQueue` is a binary heap. Space is O(V + E) for the graph plus O(V²) if you store the whole answer matrix.

Compare with Floyd-Warshall's O(V³): on a sparse graph with E ≈ V, Johnson is about O(V² log V), much faster for large V. On a dense graph with E ≈ V², Johnson is O(V³ log V) and Floyd-Warshall wins. Johnson is also the natural choice when you only need answers from some sources: run the Bellman-Ford step once, then Dijkstra from only those sources.

## Multistage Graph (Shortest Path) {#a8-multistage-graph}

A **multistage graph** is a directed graph whose vertices are split into ordered groups called **stages**, with every edge going from one stage to the next one; the first stage holds a single source and the last a single sink. The task is the cheapest source-to-sink path. Multistage graphs model decisions made in steps: choose a supplier, then a factory, then a warehouse; or choose an investment level for year 1, then year 2. Because edges only go forward, the graph has no cycles, and a simple dynamic program solves it in time linear in the size of the graph.

### Why greedy fails

The tempting approach is to take the cheapest edge out of the current vertex at each stage. Here is a four-stage graph (vertices numbered stage by stage) where that goes wrong:

| Stage | Vertices | Edges to next stage (weight) |
|---|---|---|
| 0 | 0 | `0→1 (2)`, `0→2 (1)`, `0→3 (5)` |
| 1 | 1, 2, 3 | `1→4 (4)`, `1→5 (11)`, `2→4 (9)`, `2→5 (5)`, `2→6 (16)`, `3→6 (2)` |
| 2 | 4, 5, 6 | `4→7 (18)`, `5→7 (13)`, `6→7 (2)` |
| 3 | 7 | sink |

Greedy takes `0 → 2` (1), then `2 → 5` (5), then `5 → 7` (13), total 19. The best route starts with the most expensive first edge: `0 → 3 → 6 → 7` costs 5 + 2 + 2 = 9. A cheap first step led into a region where everything later was expensive.

### The DP

Define `cost[u]` = cheapest path from `u` to the sink. Then `cost[sink] = 0`, and for every other vertex

```text
cost[u] = min over edges u → v of ( w(u, v) + cost[v] )
```

Every successor `v` of `u` is in a later stage, so if vertices are processed from the last stage backwards, `cost[v]` is always known when `u` needs it. Recording which `v` achieved the minimum lets you walk the optimal path forwards.

```java title="Multistage.java"
import java.util.*;

public class Multistage {
    // Vertices are numbered stage by stage: 0 is the source, n - 1 the sink, and every
    // edge goes from a lower number to a higher one. adj.get(u) holds {v, weight}.
    static void solve(List<List<int[]>> adj) {
        int n = adj.size();
        final long INF = Long.MAX_VALUE / 4;
        long[] cost = new long[n];          // cost[u] = cheapest u -> sink
        int[] choice = new int[n];          // next vertex on that cheapest route
        Arrays.fill(cost, INF);
        Arrays.fill(choice, -1);
        cost[n - 1] = 0;
        for (int u = n - 2; u >= 0; u--) {  // every successor of u has a larger number
            for (int[] e : adj.get(u)) {
                int v = e[0];
                if (cost[v] != INF && e[1] + cost[v] < cost[u]) {
                    cost[u] = e[1] + cost[v];
                    choice[u] = v;
                }
            }
        }
        System.out.println("cost = " + Arrays.toString(cost));
        List<Integer> path = new ArrayList<>();
        for (int v = 0; v != -1; v = choice[v]) path.add(v);
        System.out.println("best = " + cost[0] + " via " + path);
    }

    public static void main(String[] args) {
        int[][] edges = {
            {0, 1, 2}, {0, 2, 1}, {0, 3, 5},                  // stage 0 -> stage 1
            {1, 4, 4}, {1, 5, 11}, {2, 4, 9}, {2, 5, 5}, {2, 6, 16},
            {3, 6, 2},                                        // stage 1 -> stage 2
            {4, 7, 18}, {5, 7, 13}, {6, 7, 2}};               // stage 2 -> stage 3
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < 8; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) adj.get(e[0]).add(new int[]{e[1], e[2]});
        solve(adj);
    }
}
```

```output
cost = [9, 22, 18, 4, 18, 13, 2, 0]
best = 9 via [0, 3, 6, 7]
```

Read `cost` from the right. Stage 2: `cost[6] = 2`, `cost[5] = 13`, `cost[4] = 18`, each its single edge to the sink. Stage 1: vertex 3 has one option, `2 + 2 = 4`; vertex 2 compares `9 + 18`, `5 + 13` and `16 + 2` and gets 18; vertex 1 compares `4 + 18` and `11 + 13` and gets 22. Stage 0: `min(2 + 22, 1 + 18, 5 + 4) = 9`. Each edge is examined exactly once, so the running time is **O(V + E)** with O(V) extra space.

### Connections

The backward DP is the "shortest path in a DAG" algorithm ([[a8-shortest-path-dag]]) for the special case where the topological order is given for free by the stage numbering. You can equally run it forwards, computing `best[v]` = cheapest source-to-`v` path in stage order. Negative weights are fine, since there are no cycles. When the stages are implicit — "day 1, day 2, …" in a scheduling problem — the same idea is usually written as an ordinary DP table, as in [[a11-2d-dp]], and recognising the stage structure is what tells you a DP will work.

## Shortest Path in a Binary Graph {#a8-shortest-path-binary-graph}

A **binary graph**, in the shortest-path sense, is a weighted graph whose edge weights are only **0 or 1**. These graphs come up whenever some moves are free and others cost one unit: walking through empty cells versus breaking a wall, following an arrow versus changing it, or travelling along a one-way street versus driving it the wrong way. Dijkstra solves them in O((V + E) log V), but a double-ended queue does it in **O(V + E)**. The technique is called **0-1 BFS**, and its grid applications are covered in [[a8-0-1-bfs]]; this section explains why it works on general graphs and applies it to a classic modelling problem.

### Why a deque is enough

Dijkstra needs a priority queue because tentative distances can be any value. With 0/1 weights, at any moment all vertices waiting to be processed have distance `d` or `d + 1`, where `d` is the distance of the vertex being processed. A deque can keep those two groups in order: put a vertex reached by a **0-edge** at the **front** (it has the same distance `d` as the current vertex), and a vertex reached by a **1-edge** at the **back** (distance `d + 1`). The front of the deque is then always a minimum-distance vertex, which is exactly what Dijkstra's priority queue would have returned — without the O(log V) cost per operation.

Like the lazy version of Dijkstra, a vertex can be added more than once if its distance improves (for example, first via a 1-edge, then via a 0-edge). The relaxation check `dist[u] + w < dist[v]` filters out useless work, and each edge can cause at most a constant number of insertions in total, so the running time is linear.

### Worked example: minimum edge reversals

Given a directed graph, what is the minimum number of edges you must reverse so that a path exists from `src` to `dst`? Model it as a binary graph: for each directed edge `u → v`, travelling `u → v` costs 0 (use it as given) and travelling `v → u` costs 1 (reverse it). The shortest-path distance from `src` to `dst` is the minimum number of reversals.

```java title="MinReversals.java"
import java.util.*;

public class MinReversals {
    // Minimum number of directed edges to reverse so that dst becomes reachable from src.
    static int minReversals(int n, int[][] edges, int src, int dst) {
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(new int[]{e[1], 0});   // use the edge as given: free
            adj.get(e[1]).add(new int[]{e[0], 1});   // use it backwards: one reversal
        }
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;
        Deque<Integer> deque = new ArrayDeque<>();
        deque.addFirst(src);
        while (!deque.isEmpty()) {
            int u = deque.pollFirst();
            for (int[] e : adj.get(u)) {
                int v = e[0], w = e[1];
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    if (w == 0) deque.addFirst(v);   // same distance layer as u
                    else deque.addLast(v);           // next layer
                }
            }
        }
        return dist[dst] == Integer.MAX_VALUE ? -1 : dist[dst];
    }

    public static void main(String[] args) {
        int[][] edges = {{0, 1}, {2, 1}, {2, 3}, {5, 1}, {4, 5}, {6, 4}, {6, 3}};
        System.out.println(minReversals(7, edges, 0, 6));
        System.out.println(minReversals(7, edges, 6, 1));
    }
}
```

```output
2
0
```

From 0 to 6, the cheapest route is `0 → 1` (free), `1 → 2` (reverse `2 → 1`), `2 → 3` (free), `3 → 6` (reverse `6 → 3`): two reversals. The alternative through `1 → 5 → 4 → 6` needs three. From 6 to 1, the path `6 → 4 → 5 → 1` already exists, so the answer is 0. `dist[u] + w` cannot overflow because `dist[u]` is only read for vertices taken from the deque, which always have finite distances.

### Recognising the pattern

The signal is a cost function that counts something — reversals, walls broken, direction changes, toll roads used — while other moves are free. If the weights are small integers larger than 1, generalise to Dial's bucket queue ([[a8-dials-algorithm]]). If all weights are equal, plain BFS is enough. If weights are arbitrary and non-negative, use Dijkstra.

## Minimum Mean Weight Cycle {#a8-minimum-mean-weight-cycle}

The **mean weight** of a directed cycle is its total weight divided by its number of edges. The **minimum mean weight cycle** problem asks for the smallest mean over all cycles in the graph. It appears whenever a process repeats forever and you care about the long-run average cost per step: the throughput of a periodic schedule, the worst steady-state delay of a clocked circuit, or the best average cost of a looping strategy in a game. Minimising the *total* weight of a cycle is the wrong question in those settings — a long cycle can have a large total but a small per-step cost.

### Karp's theorem

Richard Karp gave an O(V · E) algorithm in 1978 built on a layered DP, the same structure as Bellman-Ford's table. Add an imaginary source with a zero-weight edge to every vertex, and define

> `D_k[v]` = minimum weight of a walk with **exactly** `k` edges that ends at `v` (starting anywhere), or infinity if none exists.

So `D_0[v] = 0` for every `v`, and `D_k[v] = min over edges u → v of D_{k−1}[u] + w(u, v)`. Karp proved that the minimum cycle mean is

```text
μ* = min over v with D_n[v] finite of  max over 0 ≤ k ≤ n−1 of  (D_n[v] − D_k[v]) / (n − k)
```

where `n` is the number of vertices and terms with infinite `D_k[v]` are skipped. The intuition: a walk with `n` edges visits `n + 1` vertices, so it must contain a cycle. Comparing the best `n`-edge walk with the best shorter walk to the same vertex measures how much the extra `n − k` edges, which must include cycling, cost per edge. The full proof is in Karp's paper and in textbooks such as Cormen et al.; the part you need to remember is the formula and the meaning of `D_k`.

```java title="MinMeanCycle.java"
import java.util.*;

public class MinMeanCycle {
    static final long INF = Long.MAX_VALUE / 4;

    // Karp's algorithm. edges[i] = {u, v, w}. Returns +Infinity if the graph is acyclic.
    static double karp(int n, int[][] edges) {
        // d[k][v] = minimum weight of a walk with exactly k edges ending at v, starting
        // anywhere (d[0][v] = 0 for every v, as if from a virtual source).
        long[][] d = new long[n + 1][n];
        for (int k = 1; k <= n; k++) Arrays.fill(d[k], INF);
        for (int k = 1; k <= n; k++) {
            for (int[] e : edges) {
                if (d[k - 1][e[0]] != INF && d[k - 1][e[0]] + e[2] < d[k][e[1]]) {
                    d[k][e[1]] = d[k - 1][e[0]] + e[2];
                }
            }
        }
        double best = Double.POSITIVE_INFINITY;
        for (int v = 0; v < n; v++) {
            if (d[n][v] == INF) continue;              // no n-edge walk ends here: no cycle
            double worst = Double.NEGATIVE_INFINITY;
            for (int k = 0; k < n; k++) {
                if (d[k][v] == INF) continue;
                worst = Math.max(worst, (double) (d[n][v] - d[k][v]) / (n - k));
            }
            best = Math.min(best, worst);
        }
        return best;
    }

    // The version in some references: walks start only at vertex 0.
    static double karpFromZero(int n, int[][] edges) {
        long[][] d = new long[n + 1][n];
        for (long[] row : d) Arrays.fill(row, INF);
        d[0][0] = 0;
        for (int k = 1; k <= n; k++)
            for (int[] e : edges)
                if (d[k - 1][e[0]] != INF && d[k - 1][e[0]] + e[2] < d[k][e[1]])
                    d[k][e[1]] = d[k - 1][e[0]] + e[2];
        double best = Double.POSITIVE_INFINITY;
        for (int v = 0; v < n; v++) {
            if (d[n][v] == INF) continue;
            double worst = Double.NEGATIVE_INFINITY;
            for (int k = 0; k < n; k++)
                if (d[k][v] != INF) worst = Math.max(worst, (double) (d[n][v] - d[k][v]) / (n - k));
            best = Math.min(best, worst);
        }
        return best;
    }

    public static void main(String[] args) {
        int[][] edges = {
            {0, 1, 2}, {1, 2, 4}, {2, 1, 6},          // cycle 1 -> 2 -> 1: mean (4 + 6) / 2 = 5
            {3, 4, 1}, {4, 5, 3}, {5, 3, -1},         // cycle 3 -> 4 -> 5 -> 3: mean 3 / 3 = 1
            {4, 0, 7}};                               // 3, 4, 5 can reach 0, but not back
        System.out.println("Karp:            " + karp(6, edges));
        System.out.println("Karp from 0:     " + karpFromZero(6, edges));
        System.out.println("acyclic graph:   " + karp(3, new int[][]{{0, 1, 5}, {1, 2, -3}}));
    }
}
```

```output
Karp:            1.0
Karp from 0:     5.0
acyclic graph:   Infinity
```

The graph has two cycles: `1 → 2 → 1` with mean 5 and `3 → 4 → 5 → 3` with mean 1. Karp's algorithm with walks starting anywhere returns 1. The second method starts walks only at vertex 0, as some reference implementations do, and misses the cheaper cycle because it is not reachable from 0. **Starting at a single vertex is only correct when every vertex is reachable from it** (for example, in a strongly connected graph); initialising `D_0[v] = 0` for all `v` removes that assumption. For the acyclic graph, no walk has `n` edges, so the answer is infinity — a natural "no cycle" result. The implementation was cross-checked against brute-force enumeration of all simple cycles on 20,000 random small graphs.

### Complexity and an alternative

Filling the table is `n` rounds of relaxing all `E` edges: **O(V · E)** time. The table has `(V + 1) × V` entries: **O(V²)** space. The final min-max scan is O(V²).

A second approach connects back to Bellman-Ford. A cycle with mean less than `μ` exists exactly when, after subtracting `μ` from every edge weight, some cycle has negative total weight — because a cycle of `L` edges and total `W` has `W − μL < 0` exactly when `W / L < μ`. So binary search on `μ`, running a negative-cycle check ([[a8-bellman-ford-negative-cycle]]) at each step. This costs O(V · E · log(range / precision)), which is slower than Karp in theory but easy to adapt — for example to the **minimum ratio cycle** (total cost divided by total time, with arbitrary positive times per edge), where Karp's formula no longer applies.

```quiz
Q: Johnson's algorithm reweights each edge as w'(u, v) = w(u, v) + h(u) - h(v). Why does this not change which path is shortest?
- [ ] Because h(u) - h(v) is always zero on a shortest path
- [x] Because along any path the potentials telescope, so every path from s to t changes by the same amount h(s) - h(t)
- [ ] Because Dijkstra ignores negative weights
- [ ] Because the potentials are chosen so that w' equals w on every edge
> Summing w' along s -> ... -> t, each intermediate potential is added once and subtracted once, leaving w(path) + h(s) - h(t). All s-to-t paths shift by the same constant, so their order is preserved. Edges on shortest paths from the virtual source do get w' = 0, but other edges generally do not.

Q: In a binary-weighted graph, 0-1 BFS pushes a vertex reached by a 0-weight edge to the front of the deque. Why the front?
- [ ] Because 0-weight edges should be processed last
- [ ] Because the deque must stay sorted by vertex id
- [x] Because that vertex has the same distance as the vertex being processed, which is the smallest distance waiting
- [ ] Because pushing to the back would cause an infinite loop
> All waiting vertices have distance d or d + 1. A 0-edge gives distance d, so the vertex belongs with the current minimum at the front; a 1-edge gives d + 1, so it goes to the back. This keeps the front of the deque a minimum, which is the property Dijkstra's priority queue provides.

Q: A graph has two cycles: one with 2 edges and total weight 10, and one with 5 edges and total weight 15. What is the minimum cycle mean?
- [ ] 10, the smaller total
- [x] 3, from the 5-edge cycle
- [ ] 5, from the 2-edge cycle
- [ ] 12.5, the average of the totals
> The mean is total weight divided by number of edges: 10 / 2 = 5 and 15 / 5 = 3. The longer cycle has the larger total but the smaller per-edge cost, which is exactly why minimising the total is the wrong question for repeating processes.
```

## How it works internally

Floyd-Warshall's speed in practice comes from its memory pattern as much as its operation count. In the `i`–`j` loops with `k` fixed, `dist[i][j]` and `dist[k][j]` are both scanned row-wise with `j` increasing, which is sequential memory access in a Java `long[][]` (each row is a contiguous array). The value `dist[i][k]` is constant across the innermost loop, so it can be held in a local variable. The row-skip guard `if (dist[i][k] == INF) continue` removes whole rows of work in sparse graphs.

The DP view also explains the family relationships in this lesson:

| Algorithm | DP state | Layer added each round |
|---|---|---|
| Bellman-Ford | best path to `v` using at most `k` edges | one more edge |
| Floyd-Warshall | best `i → j` path using intermediates `{0..k}` | one more allowed vertex |
| Karp | best walk to `v` with exactly `k` edges | one more edge |
| Multistage DP | best path from `u` to the sink | one more stage |

Each one picks a quantity that grows by one per round and proves that the answer for round `k` follows from round `k − 1`. That is the skill to transfer to new problems.

## In real systems

**Precomputed distance tables.** Games and simulations with a few hundred locations (rooms, waypoints, ports) often precompute an all-pairs matrix once with Floyd-Warshall and answer every "how far?" query in O(1). The `next` matrix doubles as a routing table: "from here, to get there, go to this neighbour next".

**Network analysis.** Graph libraries such as NetworkX in Python provide `floyd_warshall` for dense graphs and Johnson's algorithm for sparse ones; measures like closeness centrality and graph diameter need distances between all pairs.

**Routing tables.** In a small network with full knowledge of the topology, the `next` matrix is exactly a forwarding table for every router at once. Large networks instead run Dijkstra per router (OSPF) because each router only needs its own row.

**Scheduling and circuits.** Minimum and maximum mean cycles give the throughput of periodic systems — the iteration bound of a dataflow graph in digital signal processing and the cycle time of a synchronous circuit are maximum mean cycles, computed with Karp-style algorithms on negated weights.

**Staged decisions.** Multistage graphs model resource allocation, production planning and Viterbi-style decoding, where each stage is a time step and the DP over stages is the standard solution.

## Trade-offs and alternatives

| Method | Weights | Time | Space | Best when |
|---|---|---|---|---|
| Floyd-Warshall | Any, detects negative cycles | Θ(V³) | Θ(V²) | Dense graphs, V up to ~400–500, simple code wanted |
| V × Dijkstra | Non-negative | O(V · E log V) | O(V + E) per run | Sparse graphs, no negative edges |
| Johnson | Any, detects negative cycles | O(V · E log V) with a binary heap | O(V + E) plus output | Sparse graphs with negative edges |
| V × BFS | Unweighted | O(V · (V + E)) | O(V + E) per run | All pairs on unweighted graphs |
| Multistage / DAG DP | Any (no cycles) | O(V + E) per source | O(V) | Edges only go forward |
| 0-1 BFS | 0 or 1 | O(V + E) per source | O(V) | Binary weights |

The main question is density. Floyd-Warshall's cost does not depend on E, so it is unbeatable on dense graphs and wasteful on sparse ones. A second question is how many queries you need: if only a handful of sources matter, single-source runs from those sources beat any all-pairs method. A third is whether paths are needed or only distances: paths cost a second V × V matrix in Floyd-Warshall, or a parent array per source otherwise.

## Common mistakes

> [!MISTAKE] Putting k inside the i and j loops
> The DP needs every pair updated for `k` before any pair is updated for `k + 1`. Any order other than `k`, `i`, `j` silently misses paths with several intermediates. Write the `k` loop first, every time, and do not "optimise" the order for cache reasons.

**Overflowing on infinity.** With `Integer.MAX_VALUE` as infinity, `dist[i][k] + dist[k][j]` overflows to a negative number and looks like a great path. Use guards, or an infinity like 10⁹ in `int` (non-negative weights only) or `Long.MAX_VALUE / 4` in `long`.

**Forgetting the diagonal.** `dist[i][i]` must start at 0. Leaving it at infinity breaks the in-place argument and the negative-cycle check.

**Overwriting parallel edges.** If the input lists two edges `u → v`, keep the smaller weight; assigning the second one blindly may keep the more expensive edge.

**Trusting the matrix when a negative cycle exists.** Values become meaningless and can overflow. Check the diagonal, clamp values, and mark pairs that pass through a negative-cycle vertex as minus infinity.

**Using Floyd-Warshall on large sparse graphs.** At `V = 10⁴`, V³ = 10¹² operations and the matrix needs 800 MB in `long`. Use Dijkstra or Johnson from the sources you need.

**Using a single start vertex in Karp's algorithm.** Initialise `D_0[v] = 0` for every `v`, or cycles unreachable from the chosen vertex are missed.

## Interview perspective

Floyd-Warshall itself is short enough that interviewers rarely ask you to write it in isolation. They ask *when* to use it, *why* the loop order matters, and how to adapt it — and constraint reading is half the answer: `n ≤ 100` with "between every pair" is a strong hint.

> [!INTERVIEW] Explaining the loop order
> "The state is the best i-to-j path using only vertices 0 through k as stopovers. Allowing vertex k adds one option: go i to k and then k to j, each using 0 through k − 1. That only works if every pair has finished phase k − 1 before phase k starts, so k must be the outer loop. In-place updates are safe because row k and column k do not change during phase k without a negative cycle."

Questions you should be able to answer:

- **Floyd-Warshall or Dijkstra from every vertex?** Dense or small graphs, or negative edges: Floyd-Warshall. Large sparse graphs with non-negative weights: repeated Dijkstra.
- **How do you detect a negative cycle?** A negative diagonal entry after the run.
- **How do you print a path?** Maintain `next[i][j]` and set `next[i][j] = next[i][k]` on improvement.
- **What does Johnson's algorithm do, and why not add a constant to every edge?** Potentials telescope along paths; a constant penalises paths with more edges.
- **Why does 0-1 BFS run in linear time?** The deque holds only two distance values, in order, so it acts as a priority queue with O(1) operations.
- **Why is greedy wrong on a multistage graph?** A cheap early step can lead to expensive later stages; give the 19-versus-9 example.

A typical follow-up: *"The graph has 10⁵ vertices and you get 10⁵ queries of the form dist(a, b). What now?"* All-pairs is impossible (10¹⁰ entries). Discuss per-query Dijkstra, bidirectional search, caching frequent sources, or — for road networks — preprocessing such as contraction hierarchies.

## Practice

1. **Find the City With the Smallest Number of Neighbors at a Threshold Distance.** Solve it as above, then rewrite it with Dijkstra from each city and compare running times for `n = 100`.
2. **Path printing.** Extend `FloydWarshall.java` to print every pair's path and verify one by hand.
3. **Transitive closure.** Given a prerequisite list, answer "is course `a` a prerequisite of course `b`?" for many queries (*Course Schedule IV*).
4. **Minimum reversals and minimum obstacles.** Solve the reversal problem above, then *Minimum Obstacle Removal to Reach Corner* with 0-1 BFS.
5. **Johnson by hand.** For a five-vertex graph with two negative edges, compute the potentials, the reweighted edges, and one Dijkstra run on paper.
6. **Minimum mean cycle.** Implement the binary-search-on-μ method with Bellman-Ford and confirm it matches Karp's algorithm on random graphs.

The DSA explorer lists matching problems under this topic; CSES *Shortest Routes II* is a direct Floyd-Warshall exercise.

## Quick revision {#quick-revision}

- Floyd-Warshall state: best `i → j` path with intermediates from `{0..k}`; recurrence `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`.
- Loop order `k`, `i`, `j` — `k` outermost, always. Wrong order misses paths silently.
- In-place is safe: row and column `k` do not change during phase `k` (unless `dist[k][k] < 0`).
- Θ(V³) time, Θ(V²) space; practical up to V ≈ 400–500.
- Init: 0 on the diagonal, edge weight (min over parallel edges), INF elsewhere. Guard INF additions.
- Paths: `next[i][j] = j` initially; on improvement `next[i][j] = next[i][k]`.
- Negative cycle: `dist[i][i] < 0`. Values blow up exponentially; clamp and mark pairs through such `k` as minus infinity.
- Transitive closure: OR/AND instead of min/plus.
- Johnson: Bellman-Ford potentials `h` from a virtual source; `w' = w + h(u) − h(v) ≥ 0`; V × Dijkstra; `dist = d' − h(s) + h(t)`. O(V · E log V) with a binary heap.
- Multistage graph: DP from the last stage back, `cost[u] = min(w + cost[v])`; O(V + E); greedy fails.
- Binary (0/1) graph: 0-1 BFS, 0-edge to front, 1-edge to back; O(V + E).
- Minimum mean cycle (Karp): `D_k[v]` = best walk with exactly `k` edges, `D_0 = 0` for all `v`; `μ* = min_v max_k (D_n[v] − D_k[v]) / (n − k)`; O(V · E) time, O(V²) space.

## Key takeaways {#key-takeaways}

- Floyd-Warshall is dynamic programming over which vertices a path may pass through, and that state forces `k` to be the outermost loop.
- Its cost, Θ(V³) time and Θ(V²) space, ignores the number of edges: excellent for small or dense graphs, wasteful for large sparse ones.
- Negative edges are fine; a negative diagonal entry reveals a negative cycle, after which the matrix cannot be trusted.
- Johnson's algorithm makes Dijkstra usable with negative edges by reweighting with potentials, which shift every path between the same endpoints by the same amount.
- Special structure buys speed: forward-only stages give a linear DP, 0/1 weights give a linear deque BFS.
- Karp's algorithm finds the minimum mean cycle with the same layered relaxation as Bellman-Ford, counting walks of exactly `k` edges.
