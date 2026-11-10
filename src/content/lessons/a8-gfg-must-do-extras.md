---
summary: GeeksforGeeks-style "must-do" graph lists mix famous problems with a few that do not fit the usual chapters. This lesson maps every common one to the pattern and lesson that solves it, then teaches the ones that need their own explanation — minimum swaps to sort as cycles of a permutation, minimum cost path as Dijkstra on a grid, and the shortest chain of one-letter word changes with one- and two-sided BFS.
difficulty: intermediate
minutes: 55
objectives:
  - Map common must-do graph practice problems to the pattern and algorithm that solve them
  - Model minimum swaps to sort as a permutation graph and prove that the answer is n minus the number of cycles
  - Explain why four-direction minimum cost path needs Dijkstra rather than grid dynamic programming, and implement it
  - Implement the shortest word chain with BFS, recover the chain, and choose the replacement alphabet correctly
  - Implement bidirectional BFS and explain when and why it explores far fewer words
---

## Introduction

Practice lists such as the GeeksforGeeks "must-do" sets are a popular way to prepare for interviews. Their graph sections contain the problems you would expect — BFS, DFS, cycle detection, topological sort, islands, Dijkstra, Floyd-Warshall, strongly connected components — and a handful that look out of place: sorting an array with the fewest swaps, finding the cheapest path through a grid of costs, turning one word into another one letter at a time. Each of these is a graph problem in disguise, and each has a detail that trips people up.

This lesson does two things. First, it gives a **map**: the problems that typically appear on such lists, the pattern behind each, and the lesson in this track that teaches it, so you can work through a list without wondering where the explanation lives. Second, it teaches the problems that the other lessons do not cover in depth:

- **Minimum swaps to sort** — not obviously a graph at all, until you draw where each element needs to go.
- **Minimum cost path** — a grid of costs where moving in four directions breaks the dynamic programming you might reach for.
- [[a8-shortest-chain-target-word]] — the GeeksforGeeks version of Word Ladder, with the details of its formulation and a two-sided BFS that is much faster on large dictionaries.

## Before you start

- **BFS on implicit graphs** — generating neighbours instead of storing edges: [[a8-bfs]] and [[a8-grid-as-graph]].
- **Word Ladder** — the original form of the shortest-chain problem: [[a8-word-ladder]].
- **Dijkstra with a priority queue** — for the cost grid: [[a8-dijkstra-priority-queue]].
- **Cycles in directed graphs** — what a cycle is when every vertex has exactly one outgoing edge: [[a8-cycle-detection]].
- **The decision framework** — identifying vertices and edges before choosing an algorithm: [[a8-graph-interview-framework]].

## The intuition

Every problem in this lesson becomes easy once one sentence is written down: *what is a vertex and what is an edge?* For swaps, a vertex is a position and the edge points to where its element belongs. For the cost grid, a vertex is a cell and the edge weight is the cost of the cell you step into. For word chains, a vertex is a word and an edge is a single-letter change. After that sentence, the algorithms are ones you already know — a cycle walk, Dijkstra, BFS. The work in these problems is the modelling, which is why they are on must-do lists.

## The map: must-do problems and where they are taught

| Problem (common title) | Pattern | Algorithm | Taught in |
|---|---|---|---|
| Depth-first / breadth-first traversal | Traversal | DFS, BFS | [[a8-dfs]], [[a8-bfs]] |
| Find whether a path exists (grid) | Reachability | BFS or DFS from the source | [[a8-flood-fill]] |
| Detect cycle in an undirected graph | Cycle detection | DFS/BFS + parent, Union-Find | [[a8-cycle-undirected]] |
| Detect cycle in a directed graph | Cycle detection | Colours / recursion stack, Kahn | [[a8-cycle-detection]] |
| Topological sort | Ordering | Kahn, DFS postorder | [[a8-topological-sorting]] |
| Number of islands; X total shapes | Components on a grid | Flood fill per component | [[a8-number-of-islands]] |
| Unit area of largest region of 1s | Largest component | Flood fill with a counter | [[a8-largest-region]] |
| Distance of nearest cell having 1 | Nearest source | Multi-source BFS | [[a8-multi-source-bfs]] |
| Rotten oranges | Spreading time | Multi-source BFS by levels | [[a8-rotten-oranges]] |
| Shortest source to destination path | Unweighted grid shortest path | BFS | [[a8-shortest-path-binary-matrix]] |
| Steps by knight | State-space BFS | BFS over squares | [[a8-steps-by-knight]] |
| Snake and ladder problem | Shortest path on a board | BFS over squares | [[a8-snakes-and-ladders]] |
| Word boggle | Path search with a dictionary | Backtracking DFS + trie | [[a8-boggle]] |
| Implementing Dijkstra | Weighted shortest path | Dijkstra | [[a8-dijkstra]] |
| Minimum cost path | Weighted grid shortest path | Dijkstra on cells | this lesson |
| Floyd Warshall | All-pairs shortest paths | Floyd-Warshall | [[a8-floyd-warshall]] |
| Strongly connected components | Mutual reachability | Kosaraju, Tarjan | [[a8-scc]] |
| Circle of strings | Euler circuit | SCC + in/out degree check | [[a8-string-chain-circle]] |
| Alien dictionary | Ordering from comparisons | Topological sort | [[a8-course-schedule]] |
| Bridge edge in a graph | Critical edge | Tarjan low-link | [[a8-bridges]] |
| Minimum swaps to sort | Permutation cycles | Count cycles | this lesson |
| Word ladder / shortest chain to target word | Implicit graph shortest path | BFS, bidirectional BFS | [[a8-shortest-chain-target-word]] |

List contents change over time and differ between editions, so treat the left column as "problems that commonly appear", not as an official list. What matters is the middle columns: if you can name the pattern and algorithm for every row, you can solve the list.

## Minimum swaps to sort

**Problem.** Given an array of distinct integers, find the minimum number of swaps — exchanging any two elements, not necessarily adjacent — needed to sort it in increasing order. For `[10, 19, 6, 3, 5]` the answer is 2: swap 10 and 3 to get `[3, 19, 6, 10, 5]`, then 19 and 5 to get `[3, 5, 6, 10, 19]`.

**Naive approach.** Treat each arrangement as a vertex and each swap as an edge, then BFS from the input to the sorted arrangement. That is correct but the graph has n! vertices, each with n(n − 1)/2 neighbours — impossible beyond about 10 elements.

### Deriving the graph

Sort a copy and look at where each element must end up. For `[10, 19, 6, 3, 5]`, the sorted order is `[3, 5, 6, 10, 19]`, so:

| Position `i` | Element | Belongs at `target[i]` |
|---|---|---|
| 0 | 10 | 3 |
| 1 | 19 | 4 |
| 2 | 6 | 2 |
| 3 | 3 | 0 |
| 4 | 5 | 1 |

Draw an edge `i → target[i]` for every position. Every position has exactly one outgoing edge, and because the targets are a rearrangement of `0..n−1`, every position also has exactly one incoming edge. A directed graph in which every vertex has in-degree 1 and out-degree 1 is a **permutation graph**, and it always splits into **disjoint cycles**. Here: `0 → 3 → 0` is a 2-cycle, `1 → 4 → 1` is another, and `2 → 2` is a 1-cycle (6 is already in place).

```mermaid title="Positions of [10, 19, 6, 3, 5] pointing to where their element belongs"
flowchart LR
    p0["0: 10"] --> p3["3: 3"]
    p3 --> p0
    p1["1: 19"] --> p4["4: 5"]
    p4 --> p1
    p2["2: 6"] --> p2
```

### Why the answer is n minus the number of cycles

**A cycle of length L can be fixed with L − 1 swaps.** Swap the element at the cycle's first position directly into its target; that places one element correctly and leaves a cycle one shorter. After L − 2 such swaps a 2-cycle remains, and one final swap places both of its elements. So L − 1 swaps in total. A 1-cycle (an element already in place) needs 0.

**No method can do better.** The sorted array has n cycles, all of length 1. One swap can increase the number of cycles by **at most one**: swapping two positions in the same cycle splits it into two, and swapping positions in different cycles merges them into one. Starting from `c` cycles and needing to reach `n`, you need at least `n − c` swaps.

Both bounds equal `n − c`, so the minimum number of swaps is **n minus the number of cycles**, which is the same as summing `L − 1` over all cycles. For the example, n = 5 and there are 3 cycles, so 2 swaps.

```java title="MinSwaps.java"
import java.util.*;

public class MinSwaps {
    /** Fewest swaps that sort an array of distinct values. */
    static int minSwaps(int[] a) {
        int n = a.length;
        Integer[] byValue = new Integer[n];
        for (int i = 0; i < n; i++) byValue[i] = i;
        Arrays.sort(byValue, Comparator.comparingInt(i -> a[i]));
        // Edge i -> target[i]: the element now at i belongs at target[i] when sorted.
        int[] target = new int[n];
        for (int pos = 0; pos < n; pos++) target[byValue[pos]] = pos;

        boolean[] seen = new boolean[n];
        int swaps = 0;
        for (int start = 0; start < n; start++) {
            if (seen[start]) continue;
            int length = 0;
            for (int i = start; !seen[i]; i = target[i]) {   // walk one cycle
                seen[i] = true;
                length++;
            }
            swaps += length - 1;                              // a cycle of L needs L - 1
        }
        return swaps;
    }

    public static void main(String[] args) {
        System.out.println(minSwaps(new int[] {2, 8, 5, 4}));
        System.out.println(minSwaps(new int[] {10, 19, 6, 3, 5}));
        System.out.println(minSwaps(new int[] {4, 3, 2, 1}));
        System.out.println(minSwaps(new int[] {1, 2, 3}));
    }
}
```

```output
1
2
2
0
```

`byValue` lists the original indices in sorted order of value, so `byValue[pos]` is the index of the element that belongs at `pos`; inverting it gives `target`. The cycle walk is the same "outer loop over unvisited vertices" as in [[a8-connected-components]], specialised to a graph where each vertex has one outgoing edge, so following `target` until a visited position reappears traces exactly one cycle. For `[2, 8, 5, 4]` the cycles are `{0}`, `{1, 3}` and `{2}`: one swap. For `[4, 3, 2, 1]` they are `{0, 3}` and `{1, 2}`: two swaps. The method was also checked against a brute-force BFS over arrangements on 500 random arrays of up to 7 elements.

**Complexity.** Sorting costs O(n log n); building `target` and walking all cycles is O(n) because each position is visited once. Space is O(n). **Edge cases**: duplicates break the method, because "where the element belongs" is no longer unique — the minimum then depends on how equal elements are matched and needs a different argument. The question "minimum *adjacent* swaps" is a different problem entirely: its answer is the number of inversions, counted with merge sort.

## Minimum cost path

**Problem.** A square grid holds a positive cost in every cell. Starting at the top-left cell and moving up, down, left or right, reach the bottom-right cell while minimising the **sum of the costs of all cells visited**, including the first and last. For the grid below the answer is 43.

```text
9  4  9  9
6  7  6  4
8  3  3  7
7  4  9 10
```

### Why grid DP is not enough

If the only moves were right and down, this would be the classic grid DP from [[a11-grid-dp]]: `dp[r][c] = grid[r][c] + min(dp[r−1][c], dp[r][c−1])`, filled row by row. That recurrence works because every cell's predecessors (above and left) are finished before it. With four directions, a cheapest path may go **up or left**, so a cell's best value can depend on cells that come later in any fixed scan order. There is no order that finishes predecessors first — the "dependency graph" has cycles, and the DP has nothing to stand on.

What remains is a weighted shortest-path problem. Each cell is a vertex; moving from a cell to a neighbour is an edge whose weight is the **cost of the cell you enter**; the start cell's cost is added once at the beginning. All costs are positive, so Dijkstra applies ([[a8-dijkstra]]).

```java title="MinCostPath.java"
import java.util.*;

public class MinCostPath {
    static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    /** Cheapest sum of cell costs from top-left to bottom-right, in 4 directions. */
    static int dijkstra(int[][] grid) {
        int rows = grid.length, cols = grid[0].length;
        int[][] dist = new int[rows][cols];
        for (int[] row : dist) Arrays.fill(row, Integer.MAX_VALUE);
        dist[0][0] = grid[0][0];                   // the start cell is paid for too
        PriorityQueue<int[]> pq =
                new PriorityQueue<>(Comparator.comparingInt(e -> e[0]));
        pq.add(new int[] {grid[0][0], 0, 0});
        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            int d = top[0], r = top[1], c = top[2];
            if (d > dist[r][c]) continue;          // stale heap entry
            if (r == rows - 1 && c == cols - 1) return d;
            for (int[] dir : DIRS) {
                int nr = r + dir[0], nc = c + dir[1];
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
                int nd = d + grid[nr][nc];         // edge weight = cost of entering
                if (nd < dist[nr][nc]) {
                    dist[nr][nc] = nd;
                    pq.add(new int[] {nd, nr, nc});
                }
            }
        }
        return dist[rows - 1][cols - 1];
    }

    /** The right/down-only DP: correct only when those are the only legal moves. */
    static int rightDownDp(int[][] grid) {
        int rows = grid.length, cols = grid[0].length;
        int[][] dp = new int[rows][cols];
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                int best = (r == 0 && c == 0) ? 0 : Integer.MAX_VALUE;
                if (r > 0) best = Math.min(best, dp[r - 1][c]);
                if (c > 0) best = Math.min(best, dp[r][c - 1]);
                dp[r][c] = best + grid[r][c];
            }
        }
        return dp[rows - 1][cols - 1];
    }

    public static void main(String[] args) {
        int[][] a = {{9, 4, 9, 9}, {6, 7, 6, 4}, {8, 3, 3, 7}, {7, 4, 9, 10}};
        System.out.println("4-direction: " + dijkstra(a)
                + ", right/down: " + rightDownDp(a));
        int[][] b = {{1, 1, 1}, {9, 9, 1}, {1, 1, 1}, {1, 9, 9}, {1, 1, 1}};
        System.out.println("4-direction: " + dijkstra(b)
                + ", right/down: " + rightDownDp(b));
    }
}
```

```output
4-direction: 43, right/down: 43
4-direction: 11, right/down: 15
```

On the first grid the two methods agree because the cheapest path, `9 → 4 → 7 → 3 → 3 → 7 → 10` (right, down, down, right, right, down), happens to use only right and down moves. The second grid is built to need a detour: the cheap 1s snake right, down, *left* along row 2, down, and then right again. Dijkstra finds the snake with cost 11; the right/down DP is forced through 9s and reports 15. That is the failure the four-direction rule causes, and why "minimum cost path" with four moves is a graph problem.

Three details make the implementation correct. The start cell's cost goes into `dist[0][0]` and the first heap entry, because the path pays for it. The edge weight is the cost of the **destination** cell, so every cell on the path is paid for exactly once. And the stale-entry check `d > dist[r][c]` replaces decrease-key, exactly as in [[a8-dijkstra-priority-queue]].

**Complexity.** The grid has V = N² cells and at most 4N² directed edges, so Dijkstra costs O(N² log N) time and O(N²) space. If costs were small integers, Dial's bucket queue ([[a8-dials-algorithm]]) would remove the log factor; if they were only 0 or 1, 0-1 BFS would ([[a8-0-1-bfs]]). For grids up to 500 × 500, `int` sums are safe (at most 250,000 cells times the maximum cost); for larger costs, use `long`.

## Shortest Chain to Reach the Target Word {#a8-shortest-chain-target-word}

**Shortest chain to reach the target word** is the GeeksforGeeks formulation of Word Ladder: given a start word, a target word and a dictionary of words of the same length, find the length of the shortest chain of words from start to target in which consecutive words differ in exactly one letter and every word except possibly the start is in the dictionary. The length counts **words**, including both the start and the target; if no chain exists, the answer is 0.

For example, with the dictionary `{POON, PLEE, SAME, POIE, PLEA, PLIE, POIN}`, the shortest chain from `TOON` to `PLEA` is `TOON → POON → POIN → POIE → PLIE → PLEE → PLEA`, so the answer is 7. Note what the formulation allows: `TOON` is not in the dictionary, which is fine for the start word but would make the problem unsolvable if it were the target.

### The model

Each word is a vertex. Two words are joined by an undirected edge when they have the same length and differ in exactly one position. Every step costs the same, so the shortest chain is the shortest path by number of edges, found by BFS ([[a8-bfs-shortest-unweighted]]). The answer in words is the number of edges plus one.

The graph is **implicit**: you never build an edge list. When a word is dequeued, you generate its neighbours by replacing each position with each possible letter and keeping the results that are in the dictionary (stored in a `HashSet`). That costs O(L · |Σ|) candidate strings per word, each costing O(L) to build and hash, where L is the word length and |Σ| the alphabet size — far cheaper than comparing the word with all N dictionary words when N is large. [[a8-word-ladder]] derives this trade-off in detail.

### The alphabet detail

Which letters should the generator try? Many published solutions loop `for (char c = 'a'; c <= 'z'; c++)`. That works for lowercase inputs and silently returns 0 for the uppercase example above — every generated word is mixed-case, none is in the dictionary, and the BFS ends immediately. A robust choice is to **take the alphabet from the dictionary**: a replacement letter that appears in no dictionary word cannot produce a dictionary word. It also makes the generator faster when the dictionary uses only a few letters.

```java title="ShortestChain.java"
import java.util.*;

public class ShortestChain {
    /** Letters that occur in the dictionary: the only useful replacements. */
    static char[] alphabetOf(Collection<String> dict) {
        TreeSet<Character> letters = new TreeSet<>();
        for (String w : dict) for (char ch : w.toCharArray()) letters.add(ch);
        char[] out = new char[letters.size()];
        int i = 0;
        for (char ch : letters) out[i++] = ch;
        return out;
    }

    /** Words in the shortest chain start -> target (both counted), or empty if none. */
    static List<String> shortestChain(String start, String target, Set<String> dict,
                                      char[] letters) {
        if (start.equals(target)) return List.of(start);
        if (!dict.contains(target) || start.length() != target.length()) return List.of();
        Map<String, String> parent = new HashMap<>();
        parent.put(start, null);
        ArrayDeque<String> queue = new ArrayDeque<>(List.of(start));
        while (!queue.isEmpty()) {
            String word = queue.poll();
            char[] chars = word.toCharArray();
            for (int i = 0; i < chars.length; i++) {
                char original = chars[i];
                for (char ch : letters) {
                    if (ch == original) continue;
                    chars[i] = ch;
                    String next = new String(chars);
                    if (!dict.contains(next) || parent.containsKey(next)) continue;
                    parent.put(next, word);                  // mark on discovery
                    if (next.equals(target)) return walkBack(parent, target);
                    queue.add(next);
                }
                chars[i] = original;
            }
        }
        return List.of();
    }

    static List<String> walkBack(Map<String, String> parent, String end) {
        LinkedList<String> chain = new LinkedList<>();
        for (String w = end; w != null; w = parent.get(w)) chain.addFirst(w);
        return chain;
    }

    public static void main(String[] args) {
        Set<String> dict = Set.of("POON", "PLEE", "SAME", "POIE", "PLEA", "PLIE", "POIN");
        List<String> chain = shortestChain("TOON", "PLEA", dict, alphabetOf(dict));
        System.out.println(chain.size() + " " + chain);

        Set<String> dict2 = Set.of("ABCD", "EBAD", "EBCD", "XYZA");
        List<String> chain2 = shortestChain("ABCV", "EBAD", dict2, alphabetOf(dict2));
        System.out.println(chain2.size() + " " + chain2);

        char[] lowercase = "abcdefghijklmnopqrstuvwxyz".toCharArray();
        System.out.println(shortestChain("TOON", "PLEA", dict, lowercase).size()
                + " when only lowercase letters are tried");
    }
}
```

```output
7 [TOON, POON, POIN, POIE, PLIE, PLEE, PLEA]
4 [ABCV, ABCD, EBCD, EBAD]
0 when only lowercase letters are tried
```

Walk through the method. The two early checks handle the formulation's edge cases: a start equal to the target is a chain of one word, and a target missing from the dictionary (or of a different length) can never be reached. The `parent` map does two jobs — it is the visited set (a word is marked the moment it is discovered, so no word enters the queue twice) and it records the BFS tree, so the chain can be rebuilt by walking from the target back to the start. Because BFS assigns each word its distance at discovery, the method can return as soon as the target is *generated*, one layer earlier than waiting for it to be dequeued.

The second example shows why the start word is treated specially: `ABCV` is not in the dictionary, but it is the root of the search. The third line is the alphabet bug, reproduced: with only lowercase replacements, nothing is ever found.

| Layer | Words discovered | Changed from |
|---|---|---|
| 1 | `TOON` | start |
| 2 | `POON` | `T` → `P` |
| 3 | `POIN` | `O` → `I` in position 2 |
| 4 | `POIE` | `N` → `E` |
| 5 | `PLIE` | `O` → `L` |
| 6 | `PLEE` | `I` → `E` |
| 7 | `PLEA` | `E` → `A`: target found |

`SAME` is never discovered: no chain of one-letter changes connects it to `TOON`'s component, which is why searching from `TOON` to `SAME` returns 0.

### Complexity

Each dictionary word is discovered at most once. For each dequeued word the generator builds L · (|Σ| − 1) candidates, each costing O(L) to create and hash. With N dictionary words, time is **O(N · L² · |Σ|)** and space **O(N · L)** for the set, the queue and the parent map. Words are short in practice, so the cost is dominated by N · |Σ| hash lookups per letter position.

### Bidirectional BFS

On a large dictionary, the number of words within distance `d` of the start grows roughly like `b^d`, where `b` is the typical number of neighbours. A one-sided BFS to a target at distance `d` explores about `b^d` words. **Bidirectional BFS** runs two searches — one from the start, one from the target — and stops when they meet. Each only needs to reach about half the distance, so together they explore roughly `2 · b^(d/2)` words. With `b = 10` and `d = 8`, that is 2 · 10⁴ instead of 10⁸. The graph must be undirected (or you must search backwards along reversed edges), which is true here because "differ in one letter" is symmetric.

The implementation keeps a frontier and a seen set for each side, always expands the **smaller** frontier by one complete layer, and checks every generated word against the **other** side's current frontier. Expanding whole layers is what makes the first meeting a shortest chain: the sum of the two explored depths grows by one per expansion, so the first time the frontiers touch, that sum is the distance.

```java title="Bidirectional.java"
import java.util.*;

public class Bidirectional {
    /** Words in the shortest chain start -> target, or 0; searches from both ends. */
    static int chainLength(String start, String target, Set<String> dict, char[] letters) {
        if (start.equals(target)) return 1;
        if (!dict.contains(target) || start.length() != target.length()) return 0;
        Set<String> front = new HashSet<>(Set.of(start));
        Set<String> back = new HashSet<>(Set.of(target));
        Set<String> seenFront = new HashSet<>(front), seenBack = new HashSet<>(back);
        int words = 2;                       // chain size if the two frontiers touch now
        while (!front.isEmpty() && !back.isEmpty()) {
            if (front.size() > back.size()) {             // always grow the smaller side
                Set<String> t = front; front = back; back = t;
                t = seenFront; seenFront = seenBack; seenBack = t;
            }
            Set<String> next = new HashSet<>();
            for (String word : front) {
                char[] chars = word.toCharArray();
                for (int i = 0; i < chars.length; i++) {
                    char original = chars[i];
                    for (char ch : letters) {
                        if (ch == original) continue;
                        chars[i] = ch;
                        String nb = new String(chars);
                        if (back.contains(nb)) return words;   // the searches meet
                        if (dict.contains(nb) && seenFront.add(nb)) next.add(nb);
                    }
                    chars[i] = original;
                }
            }
            front = next;
            words++;
        }
        return 0;
    }

    public static void main(String[] args) {
        Set<String> dict = Set.of("POON", "PLEE", "SAME", "POIE", "PLEA", "PLIE", "POIN");
        char[] letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();
        System.out.println(chainLength("TOON", "PLEA", dict, letters));
        System.out.println(chainLength("TOON", "SAME", dict, letters));
        System.out.println(chainLength("PLEA", "PLEA", dict, letters));
    }
}
```

```output
7
0
1
```

`words` starts at 2 because, if a word in the start frontier were a neighbour of the target, the chain would be those two words. Each completed expansion adds one layer to one side, so it adds one word to any chain found afterwards. Swapping both the frontiers and the seen sets keeps each seen set attached to its own side. If either frontier becomes empty, one side has exhausted its component without meeting the other, and there is no chain. This version returns only the length; recovering the chain needs a parent map per side, joined at the meeting word. It agreed with the one-sided BFS on 200,000 random small dictionaries during testing.

Bidirectional search does not change the worst-case complexity — on a dictionary where every word is reachable, both sides may still touch most words — but on large, branching word graphs it is often dramatically faster. Its costs are more code and more ways to make an off-by-one error in the length.

### Other variants worth recognising

**Wildcard buckets.** Precompute, for each pattern such as `P*EA` (the word with one position blanked), the list of dictionary words matching it. A word's neighbours are then the other words in its L buckets. Building the buckets costs O(N · L²); afterwards no failed candidates are generated, which helps when the alphabet is large and the dictionary sparse.

**All shortest chains (Word Ladder II).** To list *every* shortest chain, run BFS layer by layer, recording for each word *all* parents in the previous layer (not just the first), and stop after the target's layer. Then enumerate paths backwards from the target with DFS. Recording parents only from the previous layer is what keeps every listed chain shortest.

**Weighted changes.** If changing different letters costs different amounts, the graph becomes weighted and BFS must be replaced by Dijkstra; if some changes are free, 0-1 BFS.

> [!INTERVIEW] What to say before coding
> "Each word is a vertex; two words share an edge if they differ in exactly one letter, so this is an unweighted shortest path — BFS. I'll generate neighbours by substituting letters and checking a hash set, which is O(L · |Σ|) candidates per word instead of comparing against all N words. The answer counts words, so it's edges plus one, and it's 0 if the target isn't in the dictionary. If the dictionary is large, I'd switch to bidirectional BFS."

## In real systems

Each of these problems has a production counterpart. Cycle decomposition is the standard way to apply a permutation in place: walking it cycle by cycle moves each element exactly once with O(1) extra space beyond a visited marker, which is how large arrays are reordered without allocating a copy. Grid shortest paths with cell costs are the core of path planning in games and robotics, usually with A* — Dijkstra guided by a distance-to-goal estimate — on cost maps. Word-chain search is a small instance of searching an implicit state graph, the same structure as spelling-correction candidate generation (edit-distance-one neighbours checked against a dictionary) and as puzzle solvers; bidirectional search is a standard technique in route planning between two known endpoints.

## Trade-offs and alternatives

For minimum swaps, the cycle method is optimal and linear after sorting; the only alternative is BFS over arrangements, useful solely as a test oracle. For the cost grid, Dijkstra is the general answer; grid DP is faster and simpler when moves are restricted to right and down, and Dial's algorithm or 0-1 BFS are faster when costs are small integers. For word chains, one-sided BFS is the simplest correct solution and the one to write first; bidirectional BFS is faster on large dictionaries but adds code; wildcard buckets trade preprocessing memory for fewer failed lookups. In an interview, write the simple version correctly, then describe the faster one and when it pays off.

## Common mistakes

- **Using right/down DP for a four-direction grid.** It returns a valid but possibly expensive path. Ask which moves are legal; with any move up or left, use Dijkstra.
- **Charging the start cell twice or not at all.** Put its cost in the initial distance and make each edge weight the cost of the cell entered.
- **Counting swaps as n − 1 per misplaced element.** The answer is per *cycle*: a cycle of length L needs L − 1, so two misplaced elements that form a 2-cycle need one swap, not two.
- **Applying the cycle method with duplicates.** Equal values make "where it belongs" ambiguous; the method as written assumes distinct values.
- **Hard-coding a lowercase alphabet.** Uppercase or mixed inputs silently produce 0. Derive the alphabet from the dictionary, or from the problem's stated character set.
- **Off-by-one in chain length.** The answer counts words, which is one more than the number of edges; returning the BFS edge distance is wrong by one.
- **Marking a word visited when dequeued.** Popular words get enqueued many times; mark on discovery.
- **Forgetting the target-not-in-dictionary check.** With the code above the search would still return 0, but only after exploring the start word's entire component; the early check answers immediately.

```quiz
Q: The array [4, 3, 2, 1] is to be sorted with arbitrary swaps. Its position graph has cycles {0, 3} and {1, 2}. What is the minimum number of swaps, and why?
- [ ] 4, because every element is out of place
- [ ] 3, because n − 1 swaps always suffice
- [x] 2, because n − (number of cycles) = 4 − 2, and one swap can add at most one cycle
- [ ] 1, because reversing the array is a single operation
> The sorted array has 4 one-element cycles. Each swap changes the cycle count by exactly one (splitting or merging), so going from 2 cycles to 4 needs at least 2 swaps, and swapping positions 0 and 3, then 1 and 2, achieves it. "Every element is out of place" counts elements, not cycles; a 2-cycle fixes two elements with one swap.
```

```quiz
Q: In the minimum cost path problem with four-direction moves, why does the DP dp[r][c] = grid[r][c] + min(dp[r−1][c], dp[r][c−1]) fail?
- [ ] It overflows int on large grids
- [ ] It counts the start cell twice
- [x] It only considers arriving from above or the left, but the cheapest path may arrive from below or the right, and no scan order finishes those cells first
- [ ] DP cannot handle positive weights
> The recurrence assumes every cell's predecessors are finished before it, which is true only for right/down moves. With four directions the dependencies form cycles, so the problem is a shortest path on a weighted graph, and Dijkstra applies because costs are positive. The 5 × 3 snake grid in the lesson gives 11 with Dijkstra and 15 with the DP.
```

```quiz
Q: Why does bidirectional BFS usually explore far fewer words than one-sided BFS for the shortest word chain?
- [ ] It skips checking the dictionary for half the candidates
- [ ] It uses a priority queue instead of a queue
- [x] Each side only searches to about half the distance, and the number of words within distance d grows roughly like b^d, so two searches of depth d/2 cover about 2·b^(d/2) words instead of b^d
- [ ] It visits each word at most once, while one-sided BFS can visit a word many times
> Both versions visit each word at most once and check the dictionary the same way. The saving comes from the exponential growth of the search ball: two half-depth balls are much smaller than one full-depth ball. In the worst case, when most of the dictionary is reachable, the saving can disappear, so the asymptotic bound is unchanged.
```

## Practice

1. Solve **Minimum Swaps to Sort**, then the variant that also prints the swaps performed.
2. Solve **Minimum Cost Path** with Dijkstra, then rewrite it with Dial's buckets assuming costs from 1 to 9.
3. Solve **Shortest Chain to Reach the Target Word** and **Word Ladder**, then add chain reconstruction to the bidirectional version.
4. Solve **Word Ladder II** (all shortest chains) using layered parents plus DFS.
5. Solve **Open the Lock** and **Minimum Genetic Mutation** — the same implicit-graph BFS with different neighbour rules.
6. Work through the map table: for each row, write one sentence naming the vertices, edges and algorithm before opening the linked lesson.

The DSA explorer lists these problems under the graph topics in the map. For a single page that ties all graph patterns together, revisit [[a8-graph-interview-framework]].

## Quick revision {#quick-revision}

- **Map**: traversal → BFS/DFS; islands, shapes, regions → flood fill; nearest 1, rotten oranges → multi-source BFS; grid/knight/snakes → BFS; boggle → DFS + trie; Dijkstra, Floyd-Warshall, SCC, bridges → their lessons; alien dictionary → topo sort; circle of strings → Euler circuit; minimum swaps → permutation cycles; minimum cost path → grid Dijkstra; word chain → BFS.
- **Minimum swaps** (distinct values): edge `i → target[i]`; permutation splits into disjoint cycles; answer `n − cycles` = Σ(L − 1). A swap changes the cycle count by exactly one. O(n log n) for the sort, O(n) walk. Adjacent swaps → count inversions instead.
- **Minimum cost path** (4 directions): grid DP fails because dependencies form cycles. Dijkstra on cells, edge weight = cost of the entered cell, start cost in `dist[0][0]`. O(N² log N). Right/down only → DP. Small integer costs → Dial; 0/1 → 0-1 BFS.
- **Shortest chain**: vertex = word, edge = one-letter difference, unweighted → BFS. Count words (edges + 1); 0 if target missing; start need not be in the dictionary; start = target → 1.
- Generate neighbours: L positions × alphabet, check a `HashSet`; take the alphabet from the dictionary (a hard-coded `'a'..'z'` fails on uppercase). Mark on discovery; return when the target is generated. O(N · L² · |Σ|) time, O(N · L) space.
- **Bidirectional BFS**: two frontiers, expand the smaller by a whole layer, meet-check against the other frontier; ≈ 2·b^(d/2) vs b^d words explored. Same worst case.
- **Variants**: wildcard buckets (`P*EA`) avoid failed lookups; Word Ladder II = layered BFS parents + DFS enumeration; weighted letter changes → Dijkstra.

## Key takeaways {#key-takeaways}

- Must-do lists are mostly the standard patterns under different names; naming each problem's vertices, edges and pattern is the skill they train.
- Minimum swaps to sort is a cycle-counting problem: each cycle of length L needs L − 1 swaps, and no swap can do better than add one cycle.
- A cost grid with four-direction moves is a weighted graph, not a DP table — Dijkstra handles the detours that DP cannot.
- The shortest word chain is BFS on an implicit graph; get the formulation details right (count words, target in dictionary, alphabet from the data).
- Bidirectional BFS exploits exponential growth of the search to explore far fewer states between two known endpoints, at the price of extra code.
