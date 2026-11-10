---
summary: Graph colouring assigns colours to vertices so that no edge joins two vertices of the same colour — the model behind timetables, register allocation and frequency assignment. You will learn why two colours are easy but three are NP-complete, how to decide m-colourability by backtracking, how greedy and DSatur heuristics behave, and three classic companions — the Traveling Salesman Problem, the Erdős–Rényi random graph and the Petersen graph.
difficulty: advanced
minutes: 85
objectives:
  - Explain proper colouring and chromatic number, and bound the chromatic number with cliques, maximum degree and Brooks' theorem
  - Implement backtracking m-colouring, trace it on a small graph and derive its worst-case cost
  - Compare greedy, Welsh-Powell and DSatur colouring, and show with an example why vertex order matters
  - Solve the Traveling Salesman Problem exactly with Held-Karp bitmask DP, recover the tour, and explain when heuristics or approximations are used instead
  - Describe the Erdős–Rényi G(n, p) model, its giant-component and connectivity thresholds, and use it to generate test graphs
  - Verify the Petersen graph's key properties and explain why it is the standard counterexample in graph theory
---

## Introduction

A university must schedule final exams. Some pairs of exams cannot happen at the same time because a student is enrolled in both. How few time slots are needed? Draw each exam as a vertex and join two exams with an edge when they share a student. A schedule is then an assignment of a time slot — call it a **colour** — to each vertex, such that the two ends of every edge get different colours. The fewest slots is the fewest colours.

That is **graph colouring**, and the same model appears wherever things that conflict must be kept apart. A compiler assigns program variables to a limited number of CPU registers; two variables that are alive at the same time conflict, so register allocation colours an *interference graph*. Radio transmitters close enough to interfere need different frequencies ([[a8-channel-assignment]]). Sudoku is a 9-colouring of an 81-vertex graph in which some vertices are already coloured. Maps get coloured so that neighbouring countries differ.

What makes colouring a fascinating topic is the gap between two and three. Deciding whether a graph can be coloured with **two** colours is easy — it is the bipartite check from [[a8-bipartite]], linear time. Deciding whether **three** colours suffice is NP-complete: no polynomial-time algorithm is known, and finding one would resolve the P versus NP question. So for colouring you need two kinds of tools — exact exponential algorithms for small graphs, and fast heuristics with known limitations for large ones.

This lesson teaches both, then covers three classic topics that sit next to colouring in most graph courses:

- [[a8-traveling-salesman]] — the cheapest tour through every city, another NP-hard problem, solved exactly for small inputs by bitmask dynamic programming.
- [[a8-erdos-renyi]] — the standard model of a *random* graph, how its structure changes suddenly as edges are added, and how to use it to generate test inputs.
- [[a8-peterson-graph]] — the ten-vertex graph that serves as the counterexample to a remarkable number of plausible-sounding claims.

## Before you start

- **Graph basics and adjacency lists** — degree, cliques, cycles: [[a8-graph-terminology]] and [[a8-adjacency-list]].
- **Bipartite checking** — 2-colouring by BFS and the odd-cycle theorem: [[a8-bipartite]] and [[a8-odd-cycle-bipartite]].
- **Backtracking** — try a choice, recurse, undo on failure: [[a9-constraint-backtracking]] and [[a9-pruning]].
- **Bitmasks** — representing a set of up to ~20 items as an integer, needed for TSP: [[a13-bitmasking]] and [[a11-bitmask-dp]].
- **Union-Find** — used to measure components in the random-graph experiment: [[a8-union-find]].

## The intuition

Colour the exam graph by hand and you discover two things. First, some choices are **forced**: if three exams all conflict with each other (a triangle), they need three different slots, whatever you do. Second, other choices are **free but consequential**: giving exam A slot 1 rather than slot 2 might look harmless now and only cause a dead end ten exams later, when some exam finds all its slots blocked by neighbours.

In a 2-colouring every choice after the first is forced — a vertex's colour is "the other one" — which is why a single traversal decides it. With three or more colours, free choices appear, and a wrong early choice can only be detected much later. Exact algorithms therefore explore choices and undo them (backtracking); heuristics commit to one choice per vertex and accept that they may use more colours than necessary.

## What a colouring is

A **proper k-colouring** of a graph assigns each vertex one of `k` colours so that **no edge joins two vertices of the same colour**. A graph is **k-colourable** if a proper k-colouring exists. The **chromatic number**, written **χ(G)** (Greek *chi*), is the smallest such `k`.

It helps to know the chromatic number of a few families, because they bound everything else:

| Graph | χ | Why |
|---|---|---|
| No edges | 1 | Nothing conflicts |
| Any graph with at least one edge | ≥ 2 | The two ends of an edge differ |
| Tree with at least one edge, even cycle, grid, any bipartite graph | 2 | Bipartite exactly when 2-colourable |
| Odd cycle `C₅`, `C₇`, … | 3 | Going round, colours must alternate, and an odd cycle cannot alternate back |
| Complete graph `Kₙ` | n | Every pair conflicts |
| Planar graph (drawable without crossings) | ≤ 4 | The Four Colour Theorem |
| Petersen graph | 3 | See [[a8-peterson-graph]] |

The **Four Colour Theorem** — every planar graph is 4-colourable, so every map can be coloured with four colours — was proved by Appel and Haken in 1976 with a computer-checked case analysis, the first major theorem whose proof relied on a computer.

Colouring vertices is not the only kind. An **edge colouring** colours edges so that edges sharing an endpoint differ; its minimum is the **chromatic index** χ′(G). Vizing's theorem says a simple graph's chromatic index is either Δ or Δ + 1, where **Δ** is the maximum degree. Edge colouring models scheduling of pairwise meetings, such as games in a round-robin tournament — each vertex is a team and each colour a round. You can always reduce edge colouring to vertex colouring of the *line graph*, which has one vertex per edge; the Petersen section uses exactly that trick.

## Bounds: how many colours could it need?

Computing χ exactly is hard, but it is easy to sandwich it.

**Lower bound: cliques.** A **clique** is a set of vertices that are all pairwise adjacent. If a graph contains a clique of size ω (*omega*), those ω vertices need ω different colours, so **χ ≥ ω**. A triangle forces at least 3. The bound can be far from tight, though: there are triangle-free graphs (ω = 2) with any chromatic number you like — the Grötzsch graph, with 11 vertices and no triangle, needs 4 colours.

**Upper bound: Δ + 1.** Process vertices in any order and give each one the smallest colour not used by an already-coloured neighbour. A vertex has at most Δ neighbours, so at most Δ colours are blocked and one of the colours `0..Δ` is always free. Therefore **χ ≤ Δ + 1** for every graph, and the greedy method below proves it constructively.

**Brooks' theorem** sharpens that: a connected graph that is neither a complete graph nor an odd cycle has **χ ≤ Δ**. The exceptions are exactly the graphs where Δ + 1 is needed: `Kₙ` has Δ = n − 1 and needs n colours, and an odd cycle has Δ = 2 and needs 3.

So for any graph, ω ≤ χ ≤ Δ + 1. When the two bounds meet, you are done. When they do not, you need search.

## Deciding m-colourability by backtracking

**Problem.** Given an undirected graph and an integer `m`, decide whether it can be coloured with at most `m` colours, and return such a colouring if it can. This is the GeeksforGeeks "m-Coloring Problem" and the core of every exact colouring method.

**Naive approach.** Try every assignment: each of V vertices gets one of `m` colours, giving `m^V` assignments, each checked in O(V + E). With V = 20 and m = 3 that is 3.5 · 10⁹ assignments — too many, and most of them fail on their very first edges.

**Deriving the better idea.** Most of those assignments share a doomed prefix. If vertices 0 and 1 are adjacent and both get colour 1, *every* completion of that prefix is invalid — there are `m^(V−2)` of them, and the naive method checks each one. Instead, build the assignment one vertex at a time and **check each new colour against the already-coloured neighbours immediately**. If no colour works for the current vertex, return to the previous vertex and change *its* colour. That is backtracking: the search tree is the same, but whole subtrees are cut off as soon as a conflict appears.

The invariant is: **when the search is about to colour vertex `u`, vertices `0..u−1` form a proper colouring of the subgraph they induce.** Each step extends that partial colouring by one vertex without breaking it, so reaching `u = V` means the whole graph is properly coloured.

```java title="MColoring.java"
import java.util.*;

public class MColoring {
    /** Fills color[] with 1..m so no edge joins equal colours; false if impossible. */
    static boolean colour(List<List<Integer>> adj, int m, int[] color) {
        return place(0, adj, m, color);
    }

    private static boolean place(int u, List<List<Integer>> adj, int m, int[] color) {
        if (u == adj.size()) return true;                 // every vertex has a colour
        for (int c = 1; c <= m; c++) {
            if (!safe(u, c, adj, color)) continue;
            color[u] = c;
            if (place(u + 1, adj, m, color)) return true;
            color[u] = 0;                                 // undo before the next choice
        }
        return false;                                     // the caller must change
    }

    private static boolean safe(int u, int c, List<List<Integer>> adj, int[] color) {
        for (int v : adj.get(u)) if (color[v] == c) return false;
        return true;
    }

    /** Smallest m that works. Greedy proves maxDegree + 1 always suffices. */
    static int chromaticNumber(List<List<Integer>> adj) {
        int maxDegree = 0;
        for (List<Integer> nbrs : adj) maxDegree = Math.max(maxDegree, nbrs.size());
        for (int m = 1; ; m++) {
            if (colour(adj, m, new int[adj.size()])) return m;
            if (m > maxDegree) throw new IllegalStateException("unreachable");
        }
    }

    static List<List<Integer>> graph(int n, int[][] edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            adj.get(e[1]).add(e[0]);
        }
        return adj;
    }

    public static void main(String[] args) {
        // Square 0-1-2-3 with diagonal 0-2.
        int[][] squareEdges = {{0, 1}, {1, 2}, {2, 3}, {3, 0}, {0, 2}};
        List<List<Integer>> g = graph(4, squareEdges);
        for (int m = 2; m <= 3; m++) {
            int[] color = new int[4];
            boolean ok = colour(g, m, color);
            String shown = ok ? " " + Arrays.toString(color) : "";
            System.out.println("m=" + m + " " + ok + shown);
        }
        int[][] cycleEdges = {{0, 1}, {1, 2}, {2, 3}, {3, 4}, {4, 0}};
        List<List<Integer>> c5 = graph(5, cycleEdges);
        List<List<Integer>> k4 = graph(4, new int[][] {{0, 1}, {0, 2}, {0, 3}, {1, 2},
                                                        {1, 3}, {2, 3}});
        System.out.println("chi(square+diagonal)=" + chromaticNumber(g)
                + " chi(C5)=" + chromaticNumber(c5) + " chi(K4)=" + chromaticNumber(k4));
    }
}
```

```output
m=2 false
m=3 true [1, 2, 3, 2]
chi(square+diagonal)=3 chi(C5)=3 chi(K4)=4
```

Walk through the parts. `place(u, …)` handles one vertex: it tries colours `1..m` in order, keeps the first one that no already-coloured neighbour uses, and recurses. The `safe` check looks at *all* neighbours, but uncoloured ones hold `0`, which never equals a real colour, so only coloured neighbours can block. The line `color[u] = 0` matters: without it, a failed attempt leaves a stale colour on `u`, and a later sibling branch could be wrongly rejected by `safe` checks of other vertices. `chromaticNumber` tries `m = 1, 2, 3, …`; the loop is guaranteed to stop by `m = Δ + 1` because of the greedy bound.

### Dry run: why two colours fail on the square with a diagonal

The graph has edges 0–1, 1–2, 2–3, 3–0 and the diagonal 0–2, so vertices 0, 1, 2 form a triangle. Trace `m = 2`:

| Step | Vertex | Colours of neighbours already set | Tried | Result |
|---|---|---|---|---|
| 1 | 0 | none | 1 | `color[0] = 1` |
| 2 | 1 | 0→1 | 1 ✗, 2 | `color[1] = 2` |
| 3 | 2 | 1→2, 0→1 | 1 ✗, 2 ✗ | no colour: return false |
| 4 | 1 | — | (2 was the last colour) | return false |
| 5 | 0 | none | 2 | `color[0] = 2` |
| 6 | 1 | 0→2 | 1 | `color[1] = 1` |
| 7 | 2 | 1→1, 0→2 | 1 ✗, 2 ✗ | return false |
| 8 | 1, then 0 | — | colours exhausted | `m = 2` impossible |

Vertex 3 was never reached: the triangle 0–1–2 makes the search fail at depth 3 every time, so the subtrees below it were never explored. That is the pruning at work. With `m = 3`, vertex 2 takes colour 3 and vertex 3 (adjacent to 2 and 0) takes 2, giving `[1, 2, 3, 2]` with no backtracking at all.

### Complexity

The search tree has at most `m` children per node and depth V, so it has at most `m + m² + … + m^V` nodes, which is O(m^V) for m ≥ 2. Each node runs one `safe` check costing O(deg u) ≤ O(V). The worst case is therefore **O(V · m^V)** time, usually quoted as O(m^V). Space is **O(V)** for the colour array and the recursion depth. Pruning makes typical inputs far faster than the worst case, but it cannot change the worst case: unless P = NP, no algorithm decides 3-colourability in polynomial time.

Practical improvements, all of which keep correctness:

- **Order vertices by decreasing degree.** High-degree vertices are the most constrained; colouring them first makes conflicts appear near the root, where pruning removes more.
- **Break colour symmetry.** Renaming colours never changes feasibility, so vertex 0 can be fixed to colour 1, and in general a vertex never needs a colour more than one higher than the largest colour used so far. This divides the search by up to `m!`.
- **Check the bounds first.** If a clique of size `m + 1` exists, answer "no" without searching; if `m ≥ Δ + 1`, answer "yes" and colour greedily.

Exact algorithms with better worst-case bounds exist — inclusion–exclusion over independent sets computes χ in O(2ⁿ · poly(n)) time (Björklund, Husfeldt and Koivisto, 2009) — but backtracking with good ordering is what you write in an interview or for small instances.

## Greedy colouring and heuristics

For large graphs, exact search is out of reach, and engineers use **heuristics**: fast methods that always produce a valid colouring but may use more colours than χ.

**Greedy colouring** processes vertices in a chosen order and gives each the smallest colour not used by an already-coloured neighbour. It runs in O(V + E) and never uses more than Δ + 1 colours — the argument from the bounds section. Its weakness is **order dependence**. There is always *some* order for which greedy is optimal (list the vertices of an optimal colouring class by class), but a bad order can be terrible, as the next program shows.

**Welsh–Powell** is greedy with vertices in decreasing order of degree. It guarantees at most `max over i of min(dᵢ + 1, i)` colours, where `d₁ ≥ d₂ ≥ …` are the sorted degrees, which is never worse than Δ + 1 and often better. **DSatur** (Brélaz, 1979) chooses the next vertex dynamically: the uncoloured vertex whose neighbours already use the most *distinct* colours (its **saturation**), breaking ties by degree. Because it always works on the most constrained vertex, it behaves much better in practice, and it colours every bipartite graph with 2 colours.

```java title="GreedyColoring.java"
import java.util.*;

public class GreedyColoring {
    /** Gives each vertex, in the given order, the smallest colour no neighbour has. */
    static int[] greedy(List<List<Integer>> adj, int[] order) {
        int n = adj.size();
        int[] color = new int[n];
        Arrays.fill(color, -1);
        boolean[] used = new boolean[n + 1];
        for (int u : order) {
            for (int v : adj.get(u)) if (color[v] >= 0) used[color[v]] = true;
            int c = 0;
            while (used[c]) c++;                  // at most deg(u) colours blocked
            color[u] = c;
            for (int v : adj.get(u)) if (color[v] >= 0) used[color[v]] = false;
        }
        return color;
    }

    /** DSatur: always colour the vertex whose neighbours already use the most colours. */
    static int[] dsatur(List<List<Integer>> adj) {
        int n = adj.size();
        int[] color = new int[n];
        Arrays.fill(color, -1);
        List<Set<Integer>> seenColours = new ArrayList<>();
        for (int i = 0; i < n; i++) seenColours.add(new HashSet<>());
        for (int step = 0; step < n; step++) {
            int pick = -1;
            for (int u = 0; u < n; u++) {
                if (color[u] >= 0) continue;
                if (pick == -1
                        || seenColours.get(u).size() > seenColours.get(pick).size()
                        || (seenColours.get(u).size() == seenColours.get(pick).size()
                            && adj.get(u).size() > adj.get(pick).size())) {
                    pick = u;                             // ties: higher degree first
                }
            }
            int c = 0;
            while (seenColours.get(pick).contains(c)) c++;
            color[pick] = c;
            for (int v : adj.get(pick)) seenColours.get(v).add(c);
        }
        return color;
    }

    static int count(int[] color) {
        return Arrays.stream(color).max().getAsInt() + 1;
    }

    public static void main(String[] args) {
        // Crown graph: a_i (vertex i) joined to b_j (vertex 4 + j) whenever i != j.
        int k = 4, n = 2 * k;
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < k; i++) {
            for (int j = 0; j < k; j++) {
                if (i == j) continue;
                adj.get(i).add(k + j);
                adj.get(k + j).add(i);
            }
        }
        int[] sidesFirst = {0, 1, 2, 3, 4, 5, 6, 7};
        int[] interleaved = {0, 4, 1, 5, 2, 6, 3, 7};
        int[] bad = greedy(adj, interleaved);
        int good = count(greedy(adj, sidesFirst));
        System.out.println("a's then b's: " + good + " colours");
        System.out.println("interleaved:  " + count(bad) + " colours "
                + Arrays.toString(bad));
        System.out.println("DSatur:       " + count(dsatur(adj)) + " colours");
    }
}
```

```output
a's then b's: 2 colours
interleaved:  4 colours [0, 1, 2, 3, 0, 1, 2, 3]
DSatur:       2 colours
```

The **crown graph** used here has two sides `a₀..a₃` and `b₀..b₃`, with `aᵢ` joined to every `bⱼ` except its partner `bᵢ`. It is bipartite, so χ = 2. Coloured side by side, greedy finds that. Coloured in the interleaved order `a₀, b₀, a₁, b₁, …`, each partner pair `aᵢ, bᵢ` is not adjacent and so shares a colour, but each new pair is adjacent to every earlier pair and needs a fresh colour — 4 colours, and `k` colours for a crown graph with `k` pairs. The gap between greedy and optimal can grow linearly with the graph's size. DSatur avoids the trap because after colouring `a₀` it prefers vertices whose saturation rose, which are all on the `b` side.

The `greedy` method is O(V + E): the `used` array is set and cleared through each vertex's list, and the `while` loop runs at most deg(u) + 1 times. The simple DSatur here is O(V² + E) because it scans all vertices to pick the next one; a priority queue keyed by saturation brings it to O((V + E) log V).

## How hard is colouring, exactly?

The complexity of colouring depends sharply on `k`:

| Question | Complexity |
|---|---|
| Is the graph 1-colourable? | Trivial: only if it has no edges |
| Is it 2-colourable? | O(V + E) — the bipartite check |
| Is it 3-colourable? | NP-complete, even for planar graphs of maximum degree 4 |
| Is it 4-colourable, if planar? | Always yes (Four Colour Theorem); finding the colouring takes O(V²) |
| What is χ(G)? | NP-hard; even approximating it within a factor n^(1−ε) is NP-hard |

Two practical consequences follow. First, in an interview, "colour this graph with as few colours as possible" on large input is a signal that a heuristic answer or a special structure (bipartite, interval graph, tree) is intended. Interval graphs — conflicts between time intervals — are coloured optimally by sorting intervals by start time and reusing the earliest-freed colour, which is the "minimum meeting rooms" problem ([[a10-interval-scheduling]]). Second, when exact answers are required for small inputs, backtracking with good ordering is the tool.

## Traveling Salesman (TSP) {#a8-traveling-salesman}

The **Traveling Salesman Problem** (TSP) asks: given `n` cities and the cost of travelling between every pair, what is the cheapest route that starts at one city, visits every other city exactly once, and returns to the start? In graph terms, find a minimum-weight **Hamiltonian cycle** — a cycle through every vertex exactly once ([[a8-euler-vs-hamiltonian]] contrasts it with Euler circuits, which use every *edge* once). It models delivery routes, drilling holes in circuit boards, and ordering tasks with changeover costs.

TSP is NP-hard, like colouring. Even deciding whether *any* Hamiltonian cycle exists is NP-complete. So the exact algorithm you need to know is exponential, and the interesting question is *how* exponential.

### From n! to 2ⁿ

The **naive approach** fixes city 0 as the start and tries every ordering of the other `n − 1` cities: (n − 1)! tours, each costed in O(n). At n = 15 that is 14! ≈ 8.7 · 10¹⁰ tours — hopeless.

To derive something better, look at what a partial tour needs to remember. Suppose the tour so far started at 0, visited the set `{0, 3, 5, 7}` and now stands at city 7. To finish optimally, it does not matter whether it went `0 → 3 → 5 → 7` or `0 → 5 → 3 → 7`; only **which cities are already visited** and **where we are now** affect the rest. So among all orderings that reach the same `(set, current city)`, only the cheapest is worth keeping. That collapses the (n − 1)! orderings into at most `2ⁿ · n` states. This is the **Held–Karp** algorithm (Held and Karp, and independently Bellman, 1962).

Define `dp[mask][u]` = the minimum cost of a path that starts at city 0, visits exactly the cities in the bitmask `mask`, and ends at city `u` (which must be in `mask`). Then:

- **Base**: `dp[{0}][0] = 0`.
- **Transition**: from state `(mask, u)`, move to any unvisited `v`: `dp[mask ∪ {v}][v] = min(…, dp[mask][u] + dist[u][v])`.
- **Answer**: `min over u of dp[all][u] + dist[u][0]` — close the cycle.

Every transition goes from a mask to a strictly larger number (a bit is added), so processing masks in increasing numeric order guarantees that a state is final before it is extended — the masks are already in topological order, as in [[a8-dag-dp]].

```java title="HeldKarp.java"
import java.util.*;

public class HeldKarp {
    static final int INF = Integer.MAX_VALUE / 4;

    /** Cheapest tour that starts and ends at city 0 and visits every city once. */
    static List<Integer> optimalTour(int[][] dist) {
        int n = dist.length, full = 1 << n;
        if (n == 1) return List.of(0, 0);
        // dp[mask][u]: cheapest path from 0 that visits exactly mask and ends at u.
        int[][] dp = new int[full][n];
        int[][] parent = new int[full][n];
        for (int[] row : dp) Arrays.fill(row, INF);
        dp[1][0] = 0;
        for (int mask = 1; mask < full; mask += 2) {      // odd masks: 0 is visited
            for (int u = 0; u < n; u++) {
                if ((mask >> u & 1) == 0 || dp[mask][u] >= INF) continue;
                for (int v = 0; v < n; v++) {
                    if ((mask >> v & 1) != 0) continue;   // no city twice
                    int next = mask | 1 << v, cost = dp[mask][u] + dist[u][v];
                    if (cost < dp[next][v]) {
                        dp[next][v] = cost;
                        parent[next][v] = u;
                    }
                }
            }
        }
        int last = 1;
        for (int u = 2; u < n; u++) {
            int viaU = dp[full - 1][u] + dist[u][0];
            if (viaU < dp[full - 1][last] + dist[last][0]) last = u;
        }
        LinkedList<Integer> tour = new LinkedList<>(List.of(0));
        for (int mask = full - 1, u = last; u != 0; ) {   // walk the parents back to 0
            tour.addFirst(u);
            int prev = parent[mask][u];
            mask ^= 1 << u;
            u = prev;
        }
        tour.addFirst(0);
        return tour;
    }

    /** Greedy heuristic: always go to the closest unvisited city. */
    static List<Integer> nearestNeighbourTour(int[][] dist) {
        int n = dist.length;
        boolean[] seen = new boolean[n];
        List<Integer> tour = new ArrayList<>(List.of(0));
        seen[0] = true;
        for (int step = 1, cur = 0; step < n; step++) {
            int best = -1;
            for (int v = 0; v < n; v++) {
                if (!seen[v] && (best == -1 || dist[cur][v] < dist[cur][best])) best = v;
            }
            seen[best] = true;
            tour.add(best);
            cur = best;
        }
        tour.add(0);
        return tour;
    }

    static int cost(int[][] dist, List<Integer> tour) {
        int total = 0;
        for (int i = 0; i + 1 < tour.size(); i++) {
            total += dist[tour.get(i)][tour.get(i + 1)];
        }
        return total;
    }

    public static void main(String[] args) {
        int[][] four = {
            {0, 10, 15, 20}, {10, 0, 35, 25}, {15, 35, 0, 30}, {20, 25, 30, 0},
        };
        List<Integer> t = optimalTour(four);
        System.out.println("4 cities, optimal: " + t + " cost " + cost(four, t));

        int[][] five = {
            {0, 8, 5, 9, 4}, {8, 0, 9, 9, 5}, {5, 9, 0, 5, 7},
            {9, 9, 5, 0, 8}, {4, 5, 7, 8, 0},
        };
        List<Integer> best = optimalTour(five), greedy = nearestNeighbourTour(five);
        System.out.println("5 cities, optimal: " + best + " cost " + cost(five, best));
        int greedyCost = cost(five, greedy);
        System.out.println("5 cities, nearest: " + greedy + " cost " + greedyCost);
    }
}
```

```output
4 cities, optimal: [0, 2, 3, 1, 0] cost 80
5 cities, optimal: [0, 4, 1, 3, 2, 0] cost 28
5 cities, nearest: [0, 4, 1, 2, 3, 0] cost 32
```

The 4-city instance is the classic textbook example: the optimal tour costs 80 (`0 → 2 → 3 → 1 → 0`, which is `0 → 1 → 3 → 2 → 0` traversed backwards — in a symmetric instance every tour has the same cost in both directions). The Held–Karp implementation was also checked against brute force over all permutations on 2,000 random instances of up to 8 cities, including asymmetric ones.

Three implementation details deserve attention. The outer loop steps `mask += 2` because every reachable mask contains city 0 (bit 0 set, so the mask is odd); even masks are unreachable and skipping them halves the work. The `parent` table records which city preceded `v` in the best path to `(next, v)`; to recover the tour, start from the best final city, and repeatedly step to its parent while **removing the current city from the mask** (`mask ^= 1 << u`) — forgetting that step reads parents from the wrong state. And `INF = Integer.MAX_VALUE / 4` leaves room to add a distance without overflow; if the graph has missing edges, store them as `INF` too and treat a final answer ≥ `INF` as "no Hamiltonian cycle".

### Complexity

There are `2ⁿ · n` states (half of them reachable) and each tries `n` next cities, so time is **O(n² · 2ⁿ)** and space **O(n · 2ⁿ)**. At n = 20 that is 20² · 2²⁰ ≈ 4 · 10⁸ basic steps and 2 · 10⁷ table entries per array — about 80 MB for `dp` alone as `int`s, another 80 MB for `parent`. That is why "n ≤ 20" (often "n ≤ 16") in a problem statement is the signature of bitmask DP. Compare 20! ≈ 2.4 · 10¹⁸: the exponential is still there, but its base has dropped from n to 2.

### When n is large: heuristics and approximations

The 5-city run shows the classic heuristic failing. **Nearest neighbour** — always go to the closest unvisited city — takes 0 → 4 → 1 cheaply, then gets stuck paying for long edges at the end, and finishes at 32 against the optimal 28. Greedy choices look good early and pay for it late, the same failure mode as greedy colouring.

What practitioners use depends on whether the distances obey the **triangle inequality** (`dist[a][c] ≤ dist[a][b] + dist[b][c]`, true for road and straight-line distances). For such **metric TSP**:

- **The MST double-tree method** builds a minimum spanning tree ([[a8-mst-kruskal]]), walks around it (every tree edge twice), and skips already-visited cities. The tree costs no more than the optimal tour (deleting one edge from the tour leaves a spanning tree), the walk costs twice the tree, and skipping never increases cost under the triangle inequality — so the result is at most **2 × optimal**.
- **Christofides' algorithm** (1976) adds a minimum-weight perfect matching on the tree's odd-degree vertices and guarantees **1.5 × optimal**; a 2020 result improved that factor by a tiny constant.
- **Local search** such as **2-opt** (remove two edges, reconnect the other way if it is shorter) and Lin–Kernighan has no worst-case guarantee but usually lands within a few per cent of optimal.

Without the triangle inequality, no polynomial algorithm can guarantee any constant factor unless P = NP. Real routing systems combine heuristics, local search and integer-programming solvers; exact solvers based on cutting planes, such as Concorde, have solved instances with tens of thousands of cities.

### Recognising TSP-shaped problems

The signal is "visit **all** of a set exactly once (or at least once) in the best order", with a small set. Shortest Path Visiting All Nodes, Find the Shortest Superstring (cities are strings, cost is the non-overlapping suffix) and "collect all items in a grid" (BFS between items, then Held–Karp over items) are all TSP with a different `dist` matrix. If you may revisit cities, first replace `dist` by all-pairs shortest paths ([[a8-floyd-warshall]]); the tour on the completed graph is then valid.

## Erdős–Rényi Model {#a8-erdos-renyi}

The **Erdős–Rényi model** is the simplest and most studied way to generate a **random graph**. In the version used most today, written **G(n, p)**, you take `n` vertices and include each of the `n(n − 1)/2` possible edges independently with probability `p`. (Erdős and Rényi's original 1959 paper studied the closely related **G(n, M)**, which picks uniformly among all graphs with exactly `M` edges; Gilbert introduced G(n, p) the same year. For large `n` the two behave alike when `M ≈ p · n(n − 1)/2`.)

Why does a course on graph algorithms care about random graphs? Three reasons. **Testing**: random graphs are the easiest source of large, varied inputs for stress-testing an algorithm against a slow brute-force version. **Average-case analysis**: statements like "this heuristic usually uses few colours" are made precise on random graphs. **Baselines**: when analysing a real network, you compare it with a random graph of the same size to see what is surprising — for example, real social networks have far more triangles than G(n, p) predicts.

### What a G(n, p) graph looks like

Some quantities follow directly from the definition:

- **Expected number of edges**: `p · n(n − 1)/2`, because each of the `n(n − 1)/2` pairs contributes `p` on average.
- **Degree of a vertex**: each of the other `n − 1` vertices is a neighbour with probability `p`, independently, so the degree has a binomial distribution with mean `p(n − 1)`. When `p = c / n` for a constant `c`, the degree is approximately Poisson with mean `c` — most vertices have degree close to `c`, and very high degrees are extremely rare.
- **Clustering**: two neighbours of a vertex are adjacent with probability just `p`, independent of anything else. For sparse graphs that is close to 0.

### Sudden changes: thresholds

The most celebrated discovery about G(n, p) is that its structure does not change gradually as `p` grows. It changes **abruptly** around specific values, called thresholds. Write `p = c / n`, so `c` is the expected degree.

- **c < 1**: all components are small, the largest having O(log n) vertices. The graph is a dust of little trees.
- **c = 1**: the critical point; the largest component has on the order of n^(2/3) vertices, with large random fluctuations.
- **c > 1**: a single **giant component** containing a constant fraction `s` of all vertices appears, where `s` solves `s = 1 − e^(−c·s)`; every other component is still small. For c = 2, s ≈ 0.80; for c = 3, s ≈ 0.94.

A second threshold governs **connectivity**. The graph becomes connected around `p = ln n / n`. More precisely, if `p = (ln n + x) / n`, the probability that the graph is connected tends to `e^(−e^(−x))`: close to 0 for very negative `x`, about 0.37 at `x = 0`, and close to 1 for large `x`. Just below the threshold, the last thing preventing connectivity is almost always a few **isolated vertices**.

You can watch both thresholds happen. The program below samples G(n, p) with a fixed seed, uses Union-Find ([[a8-union-find]]) to track components as edges are added, and reports the largest component and how often the graph is connected.

```java title="ErdosRenyi.java"
import java.util.*;

public class ErdosRenyi {
    static int[] parent, size;

    static int find(int x) {
        while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
    }

    static void union(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return;
        if (size[a] < size[b]) { int t = a; a = b; b = t; }
        parent[b] = a;
        size[a] += size[b];
    }

    /** Samples G(n, p): each of the n(n-1)/2 pairs is an edge with probability p. */
    static long sample(int n, double p, Random rng) {
        parent = new int[n];
        size = new int[n];
        for (int i = 0; i < n; i++) { parent[i] = i; size[i] = 1; }
        long edges = 0;
        for (int u = 0; u < n; u++) {
            for (int v = u + 1; v < n; v++) {
                if (rng.nextDouble() < p) { union(u, v); edges++; }
            }
        }
        return edges;
    }

    static int largestComponent(int n) {
        int best = 0;
        for (int i = 0; i < n; i++) if (find(i) == i) best = Math.max(best, size[i]);
        return best;
    }

    static int components(int n) {
        int count = 0;
        for (int i = 0; i < n; i++) if (find(i) == i) count++;
        return count;
    }

    public static void main(String[] args) {
        int n = 4000;
        Random rng = new Random(42);               // fixed seed: repeatable output
        System.out.println("n = " + n + ", expected degree c = n * p");
        for (double c : new double[] {0.5, 0.9, 1.0, 1.1, 1.5, 2.0, 3.0}) {
            long edges = sample(n, c / n, rng);
            System.out.printf("c=%.1f edges=%5d largest=%4d (%.1f%% of n)%n",
                    c, edges, largestComponent(n), 100.0 * largestComponent(n) / n);
        }
        double threshold = Math.log(n) / n;                // about 0.00207 for n = 4000
        for (double factor : new double[] {0.5, 1.0, 1.5}) {
            int connected = 0;
            for (int trial = 0; trial < 20; trial++) {
                sample(n, factor * threshold, rng);
                if (components(n) == 1) connected++;
            }
            System.out.printf("p=%.1f*ln(n)/n connected in %2d of 20 samples%n",
                    factor, connected);
        }
    }
}
```

```output
n = 4000, expected degree c = n * p
c=0.5 edges=  979 largest=  15 (0.4% of n)
c=0.9 edges= 1779 largest= 117 (2.9% of n)
c=1.0 edges= 1927 largest=  68 (1.7% of n)
c=1.1 edges= 2185 largest= 807 (20.2% of n)
c=1.5 edges= 3026 largest=2316 (57.9% of n)
c=2.0 edges= 4023 largest=3164 (79.1% of n)
c=3.0 edges= 5903 largest=3745 (93.6% of n)
p=0.5*ln(n)/n connected in  0 of 20 samples
p=1.0*ln(n)/n connected in  6 of 20 samples
p=1.5*ln(n)/n connected in 20 of 20 samples
```

The output is reproducible because `java.util.Random` uses a fixed, documented algorithm, so seed 42 gives the same graphs on any JVM; with a different seed the numbers change but the pattern does not. Read it against the theory. Edge counts match `c(n − 1)/2` — about 1,000 for c = 0.5. Below c = 1 the largest component is a tiny fraction of the graph. Near c = 1 the sizes are erratic — here c = 0.9 happened to produce a larger component than c = 1.0, which is exactly the large fluctuation expected at the critical point. Above it, the giant component appears and its share — 58%, 79%, 94% — tracks the predicted 58%, 80%, 94% closely. For connectivity, half the threshold never connects, 1.5 times the threshold always connects, and exactly at the threshold 6 of 20 samples (30%) connected, close to the limiting value of about 37%.

### Generating random graphs efficiently

The double loop above flips a coin for every pair, which is O(n²) even when the graph is sparse — fine for 4,000 vertices (about 8 million coin flips per sample), wasteful for a million. For sparse graphs, the gap between consecutive chosen pairs follows a geometric distribution, so you can jump directly from one edge to the next and generate G(n, p) in O(n + m) expected time for `m` edges (Batagelj and Brandes, 2005). For G(n, M), draw `M` random pairs and reject duplicates with a hash set.

> [!TIP] Random graphs as test inputs
> When stress-testing a graph algorithm, generate G(n, p) inputs at several densities: `p` well below `1/n` (many tiny components and isolated vertices), around `ln n / n` (barely connected, long paths) and close to 1 (dense, many cycles). Each regime triggers different bugs — missing outer loops, recursion depth, and quadratic blow-ups respectively. Always fix the seed so a failure can be reproduced.

### Where the model stops matching reality

G(n, p) is a model of *pure randomness*, and real networks are not purely random. Real social, web and citation networks have **heavy-tailed degree distributions** — a few hubs with enormous degree — whereas G(n, p) degrees cluster tightly around the mean. They also have **high clustering**: your friends tend to know each other. The Watts–Strogatz model (1998) was introduced to combine high clustering with short paths, and the Barabási–Albert model (1999) generates hubs through "preferential attachment". Use G(n, p) for tests and baselines, not as a claim about how a real network looks.

One result connects back to colouring: the chromatic number of G(n, 1/2) is, with high probability, about n / (2 log₂ n) (Bollobás, 1988). Random dense graphs need many colours, yet their largest cliques are only about 2 log₂ n — a vivid example of the gap between the clique lower bound and the true chromatic number.

## Petersen Graph {#a8-peterson-graph}

The **Petersen graph** is a specific undirected graph with 10 vertices and 15 edges, named after Julius Petersen, who used it in 1898. It is small enough to draw by hand and has so many unusual properties at once that it is the first thing graph theorists try when testing a conjecture — and it disproves a surprising number of them. For an engineer, it is a compact, well-understood test input that breaks algorithms built on false assumptions about "typical" graphs.

### Two ways to build it

**The drawing.** Draw an outer 5-cycle `0–1–2–3–4–0` and an inner five-pointed star on vertices `5..9`, where inner vertex `5 + i` is joined to `5 + (i + 2) mod 5`. Then add five **spokes** joining `i` to `5 + i`. Each vertex has exactly three neighbours.

**The Kneser construction.** Take all 2-element subsets of `{1, 2, 3, 4, 5}` — there are C(5, 2) = 10 of them — and join two subsets when they are **disjoint**. So `{1, 2}` is adjacent to `{3, 4}`, `{3, 5}` and `{4, 5}`: exactly three neighbours each. This definition (it is the Kneser graph KG(5, 2)) makes many properties easy to prove by counting, and it is what the program below uses.

### Its properties, verified

```java title="Petersen.java"
import java.util.*;

public class Petersen {
    public static void main(String[] args) {
        // Kneser construction: vertices are the 2-element subsets of {1..5};
        // two vertices are adjacent exactly when their subsets are disjoint.
        List<int[]> pairs = new ArrayList<>();
        for (int a = 1; a <= 5; a++) {
            for (int b = a + 1; b <= 5; b++) pairs.add(new int[] {a, b});
        }
        int n = pairs.size();
        boolean[][] adj = new boolean[n][n];
        List<int[]> edges = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int[] p = pairs.get(i), q = pairs.get(j);
                if (p[0] != q[0] && p[0] != q[1] && p[1] != q[0] && p[1] != q[1]) {
                    adj[i][j] = adj[j][i] = true;
                    edges.add(new int[] {i, j});
                }
            }
        }
        int[] degree = new int[n];
        for (int[] e : edges) { degree[e[0]]++; degree[e[1]]++; }
        System.out.println("vertices " + n + ", edges " + edges.size()
                + ", degrees " + Arrays.stream(degree).boxed().distinct().toList());

        int girth = Integer.MAX_VALUE, diameter = 0;
        for (int s = 0; s < n; s++) {                     // BFS from every vertex
            int[] dist = new int[n], par = new int[n];
            Arrays.fill(dist, -1);
            dist[s] = 0;
            par[s] = -1;
            ArrayDeque<Integer> queue = new ArrayDeque<>(List.of(s));
            while (!queue.isEmpty()) {
                int u = queue.poll();
                for (int v = 0; v < n; v++) {
                    if (!adj[u][v]) continue;
                    if (dist[v] == -1) {
                        dist[v] = dist[u] + 1;
                        par[v] = u;
                        queue.add(v);
                    } else if (par[u] != v) {             // non-tree edge closes a cycle
                        girth = Math.min(girth, dist[u] + dist[v] + 1);
                    }
                }
            }
            for (int d : dist) diameter = Math.max(diameter, d);
        }
        System.out.println("girth " + girth + ", diameter " + diameter);

        System.out.println("chromatic number " + minColours(adj));
        // Edge colouring = vertex colouring of the line graph (edges sharing an end).
        int m = edges.size();
        boolean[][] line = new boolean[m][m];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < m; j++) {
                int[] e = edges.get(i), f = edges.get(j);
                line[i][j] = i != j && (e[0] == f[0] || e[0] == f[1]
                                        || e[1] == f[0] || e[1] == f[1]);
            }
        }
        System.out.println("chromatic index " + minColours(line));
        System.out.println("Hamiltonian cycle " + hamiltonian(adj, true)
                + ", Hamiltonian path " + hamiltonian(adj, false));
    }

    static int minColours(boolean[][] adj) {
        for (int k = 1; ; k++) if (colour(0, adj, new int[adj.length], k)) return k;
    }

    static boolean colour(int u, boolean[][] adj, int[] c, int k) {
        if (u == adj.length) return true;
        for (int col = 1; col <= k; col++) {
            boolean ok = true;
            for (int v = 0; v < u; v++) if (adj[u][v] && c[v] == col) ok = false;
            if (!ok) continue;
            c[u] = col;
            if (colour(u + 1, adj, c, k)) return true;
        }
        c[u] = 0;
        return false;
    }

    /** Bitmask DP: reach[mask][v] = some path visits exactly mask and ends at v. */
    static boolean hamiltonian(boolean[][] adj, boolean needCycle) {
        int n = adj.length, full = (1 << n) - 1;
        boolean[][] reach = new boolean[1 << n][n];
        for (int v = 0; v < n; v++) {
            if (needCycle && v != 0) continue;            // a cycle may start at 0
            reach[1 << v][v] = true;
        }
        for (int mask = 1; mask <= full; mask++) {
            for (int u = 0; u < n; u++) {
                if (!reach[mask][u]) continue;
                for (int v = 0; v < n; v++) {
                    if (adj[u][v] && (mask >> v & 1) == 0) reach[mask | 1 << v][v] = true;
                }
            }
        }
        for (int v = 0; v < n; v++) {
            if (reach[full][v] && (!needCycle || adj[v][0])) return true;
        }
        return false;
    }
}
```

```output
vertices 10, edges 15, degrees [3]
girth 5, diameter 2
chromatic number 3
chromatic index 4
Hamiltonian cycle false, Hamiltonian path true
```

The program reuses three techniques from this track. **Girth** — the length of the shortest cycle — comes from a BFS from every vertex: a non-tree edge `u–v` closes a cycle of length at most `dist[u] + dist[v] + 1`, and from a vertex on a shortest cycle the bound is exact ([[a8-print-shortest-cycle]]). The **chromatic number** comes from the backtracking colouring of this lesson, and the **chromatic index** from the same backtracking on the *line graph*. **Hamiltonicity** uses the Held–Karp state space with booleans instead of costs: `reach[mask][v]` says whether some path visits exactly `mask` and ends at `v`. With 10 vertices there are only 1,024 masks, so every check is instant.

Here is what the numbers mean, and why each one matters:

- **3-regular with 15 edges.** Every vertex has degree 3, and by the handshake lemma 10 · 3 / 2 = 15. All ten degrees are odd, so it has **no Euler path** — an Euler path allows at most two odd vertices ([[a8-euler-path]]).
- **Girth 5, diameter 2.** There are no triangles and no 4-cycles, yet every vertex reaches every other in at most two steps. In the Kneser picture: two disjoint pairs leave one element of `{1..5}` unused, so they cannot share a neighbour (no triangle); two overlapping pairs like `{1, 2}` and `{1, 3}` have exactly one common neighbour, `{4, 5}` (distance 2, and no 4-cycle). A degree-3 graph with diameter 2 can have at most 1 + 3 + 6 = 10 vertices, and Petersen achieves the maximum — it is a **Moore graph**.
- **Chromatic number 3.** It contains 5-cycles, so it needs 3 colours; Brooks' theorem (Δ = 3, not complete, not an odd cycle) says 3 suffice. Its largest independent set has 4 vertices, which also forces χ ≥ 10 / 4, that is, at least 3.
- **Chromatic index 4.** By Vizing's theorem, a 3-regular graph needs 3 or 4 edge colours; Petersen needs 4. A bridgeless 3-regular graph that cannot be 3-edge-coloured is called a **snark**, and Petersen is the smallest one. This matters historically: Tait showed in 1880 that the Four Colour Theorem is equivalent to every bridgeless *planar* 3-regular graph being 3-edge-colourable, so once the theorem was proved, every snark had to be non-planar.
- **No Hamiltonian cycle, but a Hamiltonian path.** It is the standard example of a highly symmetric, well-connected graph that still has no Hamiltonian cycle. Moreover, deleting *any* single vertex leaves a graph that does have one — Petersen is **hypohamiltonian**, the smallest such graph.

It has more: it is **non-planar** (it contains a subdivision of K₃,₃, and it can be contracted to K₅); it is **vertex-transitive** and **edge-transitive** — every vertex looks like every other, every edge like every other — with 120 symmetries (the permutations of `{1..5}` act on the pairs).

### Why engineers should know it

When you write an algorithm that "should" work on nice graphs — a heuristic for Hamiltonian cycles, a 3-edge-colouring routine, a cycle-based shortcut that assumes small cycles exist — the Petersen graph is a ten-vertex input that tests the assumption. A Hamiltonian-cycle heuristic that "always succeeds on 3-regular, 3-connected graphs" fails here; an algorithm that assumes every cubic graph is 3-edge-colourable fails here; a shortest-cycle routine that only looks for triangles and 4-cycles reports none. Petersen is also on the short list of graphs, with complete graphs, cycles and grids, that you can hard-code into a unit test because its correct answers are known.

## In real systems

**Register allocation** in compilers is the best-known industrial use of colouring. Chaitin's allocator (early 1980s) builds an interference graph of live variables and colours it with `k` = number of registers using a simplification heuristic; vertices it cannot colour are "spilled" to memory. Production compilers use refinements of this or faster linear-scan allocators, trading colouring quality for compile time. **Timetabling** software for exams and courses colours conflict graphs with DSatur-like heuristics plus local search, then layers on soft constraints (no student with three exams in a day). **Wireless frequency planning** colours interference graphs where colours are channels. **TSP** solvers sit inside logistics and vehicle-routing systems, usually as heuristics with local improvement, because instances have thousands of stops and time windows. **Random graphs** are used throughout testing and benchmarking, and as null models in network science.

## Trade-offs and alternatives

| Need | Use | Cost | Limitation |
|---|---|---|---|
| Exact χ or yes/no for m colours, small graph | Backtracking with degree ordering and symmetry breaking | Exponential worst case | Practical to tens of vertices for hard instances |
| Any valid colouring, large graph | Greedy / Welsh–Powell | O(V + E) or O(V log V + E) | Can be far from optimal |
| Good colouring, large graph | DSatur, then local search | O((V + E) log V) | No optimality guarantee except on bipartite graphs |
| 2 colours | BFS/DFS bipartite check | O(V + E) | Only for k = 2 |
| Exact TSP, n ≤ ~20 | Held–Karp | O(n² 2ⁿ) time, O(n 2ⁿ) memory | Memory grows fastest |
| Approximate metric TSP | MST double tree, Christofides, 2-opt | Polynomial | 2× / 1.5× bounds, or none for local search |

The common thread: for NP-hard problems you choose between **exactness on small inputs** and **speed with bounded or unbounded error** on large ones. In an interview, say which side the constraints put you on.

## Common mistakes

**Forgetting to undo a colour on backtrack.** Leaving `color[u]` set after a failed branch makes later `safe` checks reject valid colours; reset to 0 before trying the next value or returning.

**Treating greedy as optimal.** Greedy uses at most Δ + 1 colours, not χ colours; the crown graph shows it can use `V/2` colours on a 2-colourable graph. Only present greedy as an exact answer when the structure guarantees it (for example, intervals sorted by start time).

**Confusing colouring with bipartite checking.** A BFS 2-colouring that hits a conflict proves "not 2-colourable"; it says nothing about whether 3 colours suffice. The forced-choice argument works only for two colours.

**Reconstructing the TSP tour without updating the mask.** Each step back must remove the current city from the mask before reading the next parent; otherwise the walk reads parents from a state that never produced it.

**Ignoring memory in Held–Karp.** At n = 20 the `int` tables reach tens of megabytes each, and `long` doubles that. Check memory along with time, and drop the parent table if only the cost is needed.

**Applying approximation guarantees to non-metric inputs.** The 2× and 1.5× bounds rely on the triangle inequality. Asymmetric or arbitrary costs void them.

**Over-reading random-graph results.** Thresholds such as `ln n / n` describe behaviour as `n` grows; a single small sample can deviate, as the critical-point row in the experiment did. Average several samples and fix seeds.

## Interview perspective

Colouring and TSP appear in interviews in three forms. **Directly, with small inputs** — "m-colouring", "can these 15 people be split into 3 rooms with no enemies together?" — where backtracking is expected. **Disguised as bitmask DP** — "visit all nodes", "shortest superstring", "minimum cost to collect all keys" — where Held–Karp is the intended solution and n ≤ 20 is the hint. **As a complexity conversation** — "how would you schedule exams for 10,000 courses?" — where the strong answer says the exact problem is NP-hard, proposes DSatur or greedy with a good order plus local improvement, and explains the guarantee (at most Δ + 1 slots).

> [!INTERVIEW] Explaining why TSP needs 2ⁿ, not n!
> "The cost of finishing the tour depends only on which cities I have visited and where I am now, not on the order I visited them in. So I keep the best cost for each (visited set, current city) pair. There are 2ⁿ · n such states and each tries n next cities, which gives O(n² · 2ⁿ) — about 4 · 10⁸ for n = 20, against 20! for brute force."

```quiz
Q: Why can a single BFS decide 2-colourability, while 3-colourability is NP-complete?
- [ ] BFS only works on graphs with at most two components
- [x] With two colours every vertex's colour is forced by its neighbour's, so no choices are ever made; with three, choices appear whose consequences show up only later
- [ ] Three colours need an adjacency matrix, which makes the check O(V²)
- [ ] 3-colourability is NP-complete only for directed graphs
> In a 2-colouring, once one vertex is coloured, each neighbour must take the other colour, so a traversal either succeeds or finds an odd cycle — no guessing. With three colours a neighbour has two options, and a wrong early option can cause a conflict far away, which is why exact algorithms must search. The representation and the number of components are irrelevant to that difference.
```

```quiz
Q: Greedy colouring of a bipartite crown graph with 2k vertices used k colours. What does that show?
- [ ] The crown graph is not actually bipartite
- [ ] Greedy colouring is incorrect and can produce invalid colourings
- [x] Greedy always produces a valid colouring, but its number of colours depends on the vertex order and can be far above χ
- [ ] Greedy colouring needs Δ + 2 colours in the worst case
> Greedy never creates a conflict — it always picks a colour no coloured neighbour has — so the colouring is valid. Its guarantee is only χ ≤ colours used ≤ Δ + 1. The interleaved order pairs each a_i with its non-neighbour b_i and forces a new colour for every pair, while colouring one side first uses 2.
```

```quiz
Q: In Held–Karp, dp[mask][u] stores the cheapest cost of a path from city 0 through exactly the cities in mask, ending at u. Why is iterating mask from 1 upwards in numeric order correct?
- [ ] Because dp is filled by memoised recursion, so order does not matter
- [x] Every transition adds a bit, so the new mask is numerically larger and all states that feed into a mask are processed before it
- [ ] Because masks with more bits are always processed first
- [ ] Because city 0 is bit 0, which makes every mask odd
> Transitions go from mask to mask | (1 << v) with v not in mask, which is strictly larger as an integer. So by the time the loop reaches a mask, every smaller mask — including all its predecessors — is final. The odd-mask observation is a separate optimisation (only masks containing city 0 are reachable), not the reason the order is valid.
```

```quiz
Q: A G(n, p) graph has n = 10⁶ and p = 2 / n. What should you expect?
- [ ] The graph is almost surely connected
- [ ] All components have O(log n) vertices
- [x] One giant component holds about 80% of the vertices, and the rest are in small components
- [ ] About n² / 2 edges
> The expected degree is c = np = 2 > 1, so a giant component appears with fraction s solving s = 1 − e^(−2s), about 0.80. Connectivity needs p around ln n / n ≈ 13.8 / n, far above 2 / n, so many small components and isolated vertices remain. The expected number of edges is p · n(n − 1)/2 ≈ n = 10⁶, not n²/2.
```

## Practice

1. Implement m-colouring with degree ordering and colour-symmetry breaking, and measure how many recursive calls it saves on random G(30, 0.3) graphs compared with the plain version.
2. Colour the conflict graph of 6 exams by hand, then check your answer with the backtracking program; find a clique that proves your colour count is optimal.
3. Implement Welsh–Powell and DSatur with a priority queue, and compare the colours used with plain greedy on G(1000, 0.05).
4. Solve **Shortest Path Visiting All Nodes** and **Find the Shortest Superstring** with Held–Karp-style bitmask DP.
5. Implement the MST double-tree TSP approximation for random points in the plane and compare it with Held–Karp for n ≤ 15.
6. Reproduce the giant-component experiment with n = 20,000 using geometric skipping, and plot the largest component fraction against c.
7. Build the Petersen graph from its drawing (outer cycle, inner star, spokes) instead of the Kneser definition, and confirm it gives the same properties.

The DSA explorer lists colouring and bitmask problems under these topics. For the remaining classic practice problems, continue with [[a8-gfg-must-do-extras]].

## Quick revision {#quick-revision}

- **Proper colouring**: no edge joins equal colours. **χ(G)**: fewest colours. **Chromatic index χ′**: fewest edge colours (Vizing: Δ or Δ + 1).
- **Families**: no edges 1; bipartite 2; odd cycle 3; Kₙ n; planar ≤ 4 (Four Colour Theorem); Petersen 3.
- **Bounds**: clique ω ≤ χ ≤ Δ + 1 (greedy). **Brooks**: connected, not complete, not odd cycle ⇒ χ ≤ Δ.
- **Complexity**: 2-colouring O(V + E); 3-colouring NP-complete (even planar, Δ ≤ 4); χ hard to approximate.
- **m-colouring backtracking**: colour vertices in order, try 1..m, check coloured neighbours, recurse, reset on failure. O(V · m^V) worst, O(V) space. Order by degree; break symmetry; check clique / Δ + 1 bounds first.
- **Greedy**: smallest free colour, O(V + E), ≤ Δ + 1 colours, order-dependent (crown graph: k colours vs 2). **Welsh–Powell**: by decreasing degree. **DSatur**: highest saturation first; optimal on bipartite graphs.
- **TSP**: min-weight Hamiltonian cycle, NP-hard. Brute force (n − 1)!. **Held–Karp** `dp[mask][u]`, base `dp[1][0] = 0`, add one city per step, close with `dist[u][0]`; O(n² 2ⁿ) time, O(n 2ⁿ) space; n ≤ ~20. Iterate odd masks; recover tour with parents, removing the current city from the mask.
- **Metric TSP approximations**: MST double tree 2×; Christofides 1.5×; 2-opt/Lin–Kernighan in practice. No constant factor without the triangle inequality (unless P = NP). Nearest neighbour can be clearly suboptimal.
- **G(n, p)**: each pair independently with probability p; E[edges] = p·n(n − 1)/2; degree ≈ Poisson(np). **c = np < 1** small components O(log n); **c > 1** giant component with s = 1 − e^(−cs); **connected** around p = ln n / n (P → e^(−e^(−x)) at (ln n + x)/n). Low clustering, no hubs — unlike real networks. Use fixed seeds for tests; O(n + m) generation by geometric skipping.
- **Petersen**: Kneser KG(5, 2), 10 vertices, 15 edges, 3-regular, girth 5, diameter 2 (Moore graph), χ = 3, χ′ = 4 (smallest snark), independence number 4, no Hamiltonian cycle but Hamiltonian path, hypohamiltonian, non-planar, 120 symmetries, no Euler path.

## Key takeaways {#key-takeaways}

- Colouring models conflicts: vertices that must differ get different colours, and the chromatic number is the minimum number of slots, registers or frequencies.
- Two colours are easy because every choice is forced; from three colours on, the problem is NP-complete, so you choose between exact backtracking on small graphs and heuristics on large ones.
- Greedy colouring is fast and always valid, guarantees at most Δ + 1 colours, and depends heavily on vertex order; DSatur's "most constrained first" rule is the strongest simple heuristic.
- Held–Karp beats brute-force TSP by remembering only the visited set and the current city, turning n! into n² · 2ⁿ — the pattern behind every "visit all of a small set" problem.
- Random G(n, p) graphs change abruptly at thresholds — a giant component at np = 1, connectivity at p = ln n / n — and make excellent, reproducible test inputs at different densities.
- The Petersen graph packs girth 5, diameter 2, chromatic index 4 and no Hamiltonian cycle into ten vertices, which makes it the standard counterexample and a ready-made test case.
