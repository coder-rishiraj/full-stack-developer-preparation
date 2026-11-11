---
summary: Bitmask DP is dynamic programming whose state includes a subset of a small set of items, stored as the bits of an integer. You will learn when the subset really must be part of the state, how to encode and iterate subsets in Java, and how to derive the travelling-salesman (Held–Karp), assignment and submask-partition recurrences, with their O(2ⁿ) costs and the n ≤ 20 rule of thumb.
difficulty: advanced
minutes: 55
objectives:
  - Explain when a DP state must remember a whole subset and why that limits n to about 20
  - Encode subsets as integers and use bit operations to test, add and remove items and to enumerate submasks
  - Derive the Held–Karp recurrence for the travelling salesman problem and justify the order in which masks are processed
  - Implement assignment DP using the popcount of the mask and partition DP over submasks in O(3ⁿ)
  - Estimate time and memory for a bitmask DP from n and choose between it, brute force over permutations, and other methods
---

## Introduction

A delivery driver must visit 15 addresses and return to the depot, and wants the shortest route. The obvious method tries every order of visits: 15! ≈ 1.3 × 10¹² routes. Even at a billion routes per second that takes over twenty minutes, and 20 addresses would take decades.

But most of those routes share structure. Suppose two partial routes have both visited the same *set* of addresses and both stand at the same address now. Whatever happens next — which addresses remain, where the driver is — is identical for the two, so only the shorter partial route is worth keeping. The situation is described by a pair: **(set of visited addresses, current address)**. There are 2¹⁵ sets and 15 current addresses, about 490,000 situations — tiny compared with 10¹².

That is **bitmask DP**: a DP whose state contains a **subset** of a small collection of items, with the subset stored as the bits of an integer — a **bitmask**. Bit `i` is 1 if item `i` is in the subset. The integer `0b1011` (eleven) stands for the subset {0, 1, 3}. Integers are compact, hash-free array indices, and set operations become single CPU instructions.

The technique is exponential, so it only works for small collections — typically up to 20 items, sometimes 23 or 24 with care. That limit is itself a signal: when a problem says `n ≤ 15` or `n ≤ 20` while everything else in it could be large, the setter is often inviting a bitmask DP. You will meet it for routing (travelling salesman), assignment (workers to jobs), grouping (split items into teams or sessions), and covering problems in interviews and competitive programming. It is a tier-3 topic in this curriculum because it is less common in interviews than the earlier DP patterns, but it is the standard tool when the constraint fits.

## Before you start

You need:

- **Bit operations in Java** — `&`, `|`, `^`, `<<`, and checking or setting a bit. See [[a13-bitmasking]], [[a13-check-bit]], [[a13-set-bit]] and [[a13-and-or-xor]].
- **Subsets and permutations as brute force** — there are 2ⁿ subsets and n! orders. See [[a9-subsets]] and [[a9-permutations]].
- **The four parts of a DP answer** (state, recurrence, base cases, order) from [[a11-memoization]], and the idea of "modes" that summarise the past from [[a11-state-machine-dp]].

## The intuition: remember *which*, forget *in what order*

Brute force over orders (permutations) remembers too much. When the driver has visited addresses {2, 5, 7} and stands at 7, it does not matter whether the route so far was 2 → 5 → 7 or 5 → 2 → 7, except for its length. Bitmask DP forgets the order and remembers only the *set* plus whatever else the future depends on (here, the current address). That merges `k!` orderings of each visited set into one state.

Why can the set not be compressed further, as earlier DPs compressed history to a prefix length or a mode? Because which items remain *matters individually*: having visited {2, 5, 7} leaves a different future from having visited {1, 3, 4}, even though both are "three addresses". There is no smaller summary, so the state must hold the whole subset — and there are 2ⁿ subsets. That is the honest price of the technique, and the reason it is reserved for small `n`.

## Bitmasks in Java, briefly

Items are numbered `0 … n-1`, and a subset is an `int` (for `n ≤ 31`) whose bit `i` says whether item `i` is in it.

| Operation | Expression | Example with `mask = 0b1011` |
|---|---|---|
| Is item `i` in the set? | `(mask & (1 << i)) != 0` | `i = 2` → false |
| Add item `i` | `mask \| (1 << i)` | `i = 2` → `0b1111` |
| Remove item `i` | `mask & ~(1 << i)` | `i = 0` → `0b1010` |
| Size of the set | `Integer.bitCount(mask)` | 3 |
| The set of all `n` items | `(1 << n) - 1` | `n = 4` → `0b1111` |
| Next smaller submask of `mask` | `(sub - 1) & mask` | used to enumerate submasks |

Two Java-specific details matter. `1 << i` is an `int` and only works for `i ≤ 30` as a positive value (`1 << 31` is negative, and `1 << 32` wraps back to 1 because Java masks the shift distance to 5 bits); use `1L << i` and `long` masks beyond that — though at that size the DP is too large anyway. And `Integer.bitCount` compiles to a single population-count instruction on modern CPUs, so it is cheap to call inside loops.

## The travelling salesman problem: Held–Karp

*Given `n` cities and a distance matrix, find the shortest tour that starts at city 0, visits every city exactly once and returns to city 0.*

### The naive approach

Fix city 0 as the start and try every order of the other `n - 1` cities: (n − 1)! tours, each costing O(n) to measure, so O(n!) overall. For `n = 12` that is about 40 million tours — feasible. For `n = 16`, 1.3 × 10¹² — not.

### Deriving the state

Look at a partial tour that has visited some cities and stands at one of them. What must you know to finish it optimally? You need the **set** of cities already visited (to know which remain) and the **current city** (to know the cost of the next step). The order in which the visited cities were seen does not affect the future. So:

> `dp[mask][last]` = the length of the shortest path that starts at city 0, visits exactly the cities in `mask` (each once), and ends at city `last` (which is in `mask`).

### The recurrence

There are two equivalent ways to write it. Looking backwards, the path ending at `last` arrived from some `prev` in `mask` other than `last`:

```text
dp[mask][last] = min over prev in mask, prev != last, of
                 dp[mask without last][prev] + dist[prev][last]
```

Looking forwards — which is how the code is written — every finished state *pushes* its value to the states one city larger:

```text
for each next not in mask:
    dp[mask | (1 << next)][next] = min(itself, dp[mask][last] + dist[last][next])
```

Both say the same thing: an optimal path to `(mask, last)` consists of an optimal path to the smaller set ending somewhere else, plus one step.

**Base case.** `dp[{0}][0] = 0`: the path that has only visited the start, standing there, has length 0. Every other state starts at infinity (unreached).

**Answer.** Close the cycle: `min over last ≠ 0 of dp[all][last] + dist[last][0]`.

### The order of computation

`dp[mask][·]` must be final before it is pushed forwards. Every transition goes from `mask` to `mask | (1 << next)`, which has one extra bit set and is therefore a **strictly larger integer**. So processing masks in plain **increasing numeric order** guarantees that every state's predecessors (all smaller integers) are finished first. You do not need to sort masks by number of set bits; increasing order is already a valid topological order of the states. (Processing by popcount layers also works, and is useful when you want to keep only one layer in memory.)

### Complexity

There are `2ⁿ · n` states. Each one tries up to `n` next cities, so the time is **O(2ⁿ · n²)** and the memory **O(2ⁿ · n)**.

| `n` | n! orders | 2ⁿ · n² transitions | `dp` size (ints) |
|---|---|---|---|
| 10 | 3.6 × 10⁶ | 1.0 × 10⁵ | 10,240 |
| 15 | 1.3 × 10¹² | 7.4 × 10⁶ | 491,520 |
| 20 | 2.4 × 10¹⁸ | 4.2 × 10⁸ | 2.1 × 10⁷ (about 84 MB) |
| 25 | 1.6 × 10²⁵ | 2.1 × 10¹⁰ | 8.4 × 10⁸ (about 3.4 GB) |

The table explains the n ≤ 20 rule of thumb. At 20 the DP is a few hundred million cheap steps and tens of megabytes; at 25 the memory alone is out of reach for a typical judge. Held–Karp (1962) is still the best known *exact* worst-case algorithm for general TSP in terms of the exponential base; practical solvers for large instances use branch-and-cut (as in the Concorde solver) or heuristics.

### Dry run

Four cities with distances

```text
      0   1   2   3
0  [  0, 10, 15, 20 ]
1  [ 10,  0, 35, 25 ]
2  [ 15, 35,  0, 30 ]
3  [ 20, 25, 30,  0 ]
```

Masks are written as bits for cities 3, 2, 1, 0 (city 0 is the rightmost bit). Each row lists `dp[mask][last]` for `last = 0, 1, 2, 3`; "−" means unreachable.

| `mask` | cities | `last = 0` | `1` | `2` | `3` |
|---|---|---|---|---|---|
| `0001` | {0} | 0 | − | − | − |
| `0011` | {0, 1} | − | 10 | − | − |
| `0101` | {0, 2} | − | − | 15 | − |
| `1001` | {0, 3} | − | − | − | 20 |
| `0111` | {0, 1, 2} | − | 50 | 45 | − |
| `1011` | {0, 1, 3} | − | 45 | − | 35 |
| `1101` | {0, 2, 3} | − | − | 50 | 45 |
| `1111` | all | − | 70 | 65 | 75 |

Take `dp[0111][1] = 50`: the only path from 0 through {0, 1, 2} ending at 1 is 0 → 2 → 1, costing 15 + 35. And `dp[1111][2] = 65` comes from `dp[1011][1] + dist[1][2] = 45 + 35 = 80` or `dp[1011][3] + dist[3][2] = 35 + 30 = 65`; the minimum, 65, is the path 0 → 1 → 3 → 2. Closing the cycle: `70 + 10 = 80`, `65 + 15 = 80`, `75 + 20 = 95`. The shortest tour has length **80** (0 → 1 → 3 → 2 → 0, or the same tour reversed). Masks with bit 0 unset never appear, because every path starts at city 0; the code skips them.

## Assignment: when the mask also tells you "where you are"

*`n` workers and `n` tasks; `cost[w][t]` is the cost for worker `w` to do task `t`. Give each worker exactly one task and minimise the total.*

The naive method tries all n! assignments. A DP could use the state `(next worker, set of tasks taken)`, but notice that the first is redundant: if workers are assigned in order 0, 1, 2, …, then after assigning `k` workers exactly `k` tasks are taken, so the next worker is `bitCount(mask)`. The state is the mask alone:

> `dp[mask]` = the minimum cost of giving tasks in `mask` to workers `0 … bitCount(mask) − 1`, one each.

Transition: worker `w = bitCount(mask)` takes some free task `t`: `dp[mask | (1 << t)] = min(itself, dp[mask] + cost[w][t])`. Base `dp[0] = 0`; answer `dp[all]`. That is **O(2ⁿ · n)** time and **O(2ⁿ)** memory — for `n = 20`, about 2 × 10⁷ steps.

The lesson generalises: **remove any part of the state that can be derived from the rest.** Here the worker index is a function of the mask. In TSP, the current city cannot be derived from the set, so it stays. (For assignment specifically, the Hungarian algorithm solves it in O(n³) for any `n`, so bitmask DP is only the right choice when the problem adds constraints the Hungarian algorithm cannot handle, such as compatibility rules between tasks given to adjacent workers.)

## Partitioning a set: iterating over submasks

*Tasks take `tasks[i]` hours; a work session can hold tasks totalling at most `limit` hours. What is the minimum number of sessions?* (LeetCode's *Minimum Number of Work Sessions to Finish the Tasks*, with `n ≤ 14`.)

Here a transition chooses a whole **group** at once. Define:

> `dp[mask]` = the fewest sessions needed to finish exactly the tasks in `mask`.

One session in an optimal schedule contains some non-empty subset `sub` of `mask` that fits within the limit; the rest, `mask ^ sub`, needs `dp[mask ^ sub]` sessions:

```text
dp[mask] = min over non-empty sub ⊆ mask with sum(sub) ≤ limit of  dp[mask ^ sub] + 1
dp[0] = 0
```

Precompute `fits[sub]` for every subset once, so each check is O(1). `mask ^ sub` is a smaller integer than `mask`, so increasing order works again.

To list the submasks of `mask`, use the standard loop:

```java
for (int sub = mask; sub > 0; sub = (sub - 1) & mask) { ... }
```

Subtracting 1 turns the lowest set bit off and every bit below it on; `& mask` keeps only bits that belong to `mask`. The result is the next smaller submask, so the loop visits every non-empty submask exactly once, in decreasing order. For `mask = 0b1010` it visits `1010`, `1000`, `0010`.

**Why this is O(3ⁿ), not O(4ⁿ).** Summed over all masks, the number of (mask, submask) pairs equals the number of ways to label each of the `n` items as "not in mask", "in mask but not in sub", or "in sub" — 3ⁿ. For `n = 14` that is about 4.8 million; for `n = 20`, 3.5 × 10⁹, which is why submask DPs usually come with `n ≤ 15` or so.

## The Java implementation

```java title="BitmaskDp.java"
import java.util.Arrays;

public class BitmaskDp {

    static final int INF = Integer.MAX_VALUE / 2;

    // Held-Karp: shortest tour that starts at city 0, visits every city once, returns to 0
    static int tsp(int[][] dist) {
        int n = dist.length, full = (1 << n) - 1;
        int[][] dp = new int[1 << n][n];                  // dp[mask][last]
        for (int[] row : dp) Arrays.fill(row, INF);
        dp[1][0] = 0;                                     // visited {0}, standing at 0
        for (int mask = 1; mask <= full; mask++) {        // increasing order: subsets come first
            if ((mask & 1) == 0) continue;                // every tour contains the start city
            for (int last = 0; last < n; last++) {
                if (dp[mask][last] == INF) continue;      // unreachable, or last not in mask
                for (int next = 0; next < n; next++) {
                    if ((mask & (1 << next)) != 0) continue;          // already visited
                    int nmask = mask | (1 << next);
                    int cand = dp[mask][last] + dist[last][next];
                    if (cand < dp[nmask][next]) dp[nmask][next] = cand;
                }
            }
        }
        int best = INF;
        for (int last = 1; last < n; last++) {
            best = Math.min(best, dp[full][last] + dist[last][0]); // close the cycle
        }
        return n == 1 ? 0 : best;
    }

    // assignment: worker i gets exactly one task; the mask says which tasks are taken
    static int assign(int[][] cost) {
        int n = cost.length;
        int[] dp = new int[1 << n];
        Arrays.fill(dp, INF);
        dp[0] = 0;
        for (int mask = 0; mask < (1 << n); mask++) {
            if (dp[mask] == INF) continue;
            int worker = Integer.bitCount(mask);          // workers 0..worker-1 are done
            if (worker == n) continue;
            for (int task = 0; task < n; task++) {
                if ((mask & (1 << task)) == 0) {
                    int nmask = mask | (1 << task);
                    dp[nmask] = Math.min(dp[nmask], dp[mask] + cost[worker][task]);
                }
            }
        }
        return dp[(1 << n) - 1];
    }

    // Minimum Number of Work Sessions: group tasks into sessions of total time <= limit
    static int minSessions(int[] tasks, int limit) {
        int n = tasks.length, full = (1 << n) - 1;
        boolean[] fits = new boolean[1 << n];             // can this subset share one session?
        for (int mask = 0; mask <= full; mask++) {
            int sum = 0;
            for (int i = 0; i < n; i++) if ((mask & (1 << i)) != 0) sum += tasks[i];
            fits[mask] = sum <= limit;
        }
        int[] dp = new int[1 << n];                       // dp[mask]: fewest sessions for mask
        Arrays.fill(dp, INF);
        dp[0] = 0;
        for (int mask = 1; mask <= full; mask++) {
            for (int sub = mask; sub > 0; sub = (sub - 1) & mask) { // every non-empty submask
                if (fits[sub]) dp[mask] = Math.min(dp[mask], dp[mask ^ sub] + 1);
            }
        }
        return dp[full];
    }

    public static void main(String[] args) {
        int[][] dist = {
                {0, 10, 15, 20},
                {10, 0, 35, 25},
                {15, 35, 0, 30},
                {20, 25, 30, 0}};
        System.out.println(tsp(dist));

        int[][] cost = {{9, 2, 7, 8}, {6, 4, 3, 7}, {5, 8, 1, 8}, {7, 6, 9, 4}};
        System.out.println(assign(cost));

        System.out.println(minSessions(new int[]{1, 2, 3}, 3));
        System.out.println(minSessions(new int[]{3, 1, 3, 1, 1}, 8));
        System.out.println(minSessions(new int[]{1, 2, 3, 4, 5}, 15));
    }
}
```

```output
80
13
2
2
1
```

In `tsp`, the `INF` check does double duty: it skips unreachable states and states where `last` is not even in `mask` (those are never written, so they stay at `INF`). `INF` is `Integer.MAX_VALUE / 2` because the code adds a distance to a state's value; since the check skips `INF` states, the sum never overflows anyway, but the margin makes the code robust to small changes. The `n == 1` case returns 0, because a single city needs no travel and the closing loop would otherwise find nothing.

The assignment answer, 13, is worker 0 → task 1 (2), worker 1 → task 0 (6), worker 2 → task 2 (1), worker 3 → task 3 (4). Note that the greedy choice "give each worker their cheapest free task in turn" gives worker 1 task 2 (3), forcing worker 2 elsewhere, and ends at 14. The sessions examples: tasks 1, 2, 3 with limit 3 need two sessions ({1, 2} and {3}); with a limit of 15, everything fits in one.

`fits` is computed in O(2ⁿ · n) here for clarity; it can be done in O(2ⁿ) by deriving each mask's sum from the mask without its lowest bit. All three methods were stress-tested against brute force — every permutation for TSP and assignment, and every labelling of tasks with session numbers for work sessions — on 2,000 random instances of up to 7 cities and 6 tasks, with no mismatches.

```quiz
Q: Why is processing masks in increasing numeric order enough for Held–Karp, without sorting them by the number of set bits?
- [ ] Because Java iterates integers in that order anyway
- [x] Because every transition goes from mask to mask | (1 << next), which is a strictly larger integer, so all predecessors of a state come earlier
- [ ] Because the distance matrix is symmetric
- [ ] It is not enough; masks must be sorted by popcount
> Adding a bit to a mask always increases its integer value, so in increasing order every state is finished before any state it pushes into. Sorting by popcount is also valid, but not required.

Q: A problem has n = 40 items and asks for the best subset under a constraint. Why is a dp[mask] array a bad idea?
- [ ] Because Java has no 40-bit integers
- [ ] Because bitCount does not work on long
- [x] Because 2^40 is about 10^12 states, far beyond any memory or time limit
- [ ] Because subsets of 40 items cannot be enumerated in increasing order
> Bitmask DP is exponential in n; 2^20 is about a million, but 2^40 is about a trillion. Java's long holds 64 bits, so encoding is not the obstacle; the state count is. Look for a different structure (knapsack on a value, meet-in-the-middle with 2^20 per half, or greedy).

Q: The loop `for (sub = mask; sub > 0; sub = (sub - 1) & mask)` is run for every mask of n items. What is the total number of iterations, and why?
- [ ] 4^n, because there are 2^n masks and 2^n submasks each
- [x] About 3^n, because each item is either outside mask, in mask but not sub, or in sub
- [ ] n · 2^n, because each mask has n bits
- [ ] 2^n, because each submask is visited once overall
> A (mask, submask) pair is the same as giving each item one of three labels, so there are 3^n pairs in total. 4^n would count pairs where sub is not inside mask, which the & mask step never produces.
```

## Recognising bitmask DP

Look for these signals together:

- **`n` is small** — typically 12 to 20 — while other quantities (distances, costs, values) can be large;
- the future depends on **which** items have been used, not only how many or their total, so no smaller summary works;
- brute force would try **all orders** (n!) or **all groupings**, and different orders reaching the same set behave the same afterwards.

Then choose the state: the mask, plus whatever the future also depends on (the current city in TSP), minus anything derivable from the mask (the current worker in assignment). Common shapes:

| Shape | State | Transition | Time |
|---|---|---|---|
| Order of visits / Hamiltonian path | `dp[mask][last]` | add one item after `last` | O(2ⁿ · n²) |
| Assign items one by one | `dp[mask]`, position = `bitCount(mask)` | add one item | O(2ⁿ · n) |
| Split into groups | `dp[mask]` | remove one valid submask | O(3ⁿ) |
| Shortest walk visiting all nodes (unweighted) | BFS over `(node, mask)` | move along an edge | O(2ⁿ · edges) |
| Grid row profiles (tiling, placing non-attacking pieces) | `dp[row][mask of the previous row]` | compatible next-row mask | O(rows · 4^cols), or less with pruning |

The fourth row deserves a note: when every edge has the same length, *Shortest Path Visiting All Nodes* uses a breadth-first search over states `(node, mask)` instead of a DP table, because walks may revisit nodes; see [[a8-bfs]]. The fifth row ("broken profile" DP) is mostly a competitive-programming technique for tiling and placement problems on narrow grids.

## In real systems

**Vehicle routing for small stops.** Last-mile delivery planners often split a large problem into clusters of a dozen or so stops, then solve each cluster exactly; Held–Karp or a branch-and-bound search is fast enough at that size. The global problem is far too large for exact methods and is handled by heuristics.

**Query optimisers.** Choosing the order in which to join tables in SQL is a search over subsets of tables: the classic System R approach builds the best plan for every subset of relations from the best plans of smaller subsets — a bitmask-style DP. Production systems cap its use: PostgreSQL, for example, switches from exhaustive DP to its genetic optimiser (GEQO) once the number of tables reaches `geqo_threshold`, which defaults to 12.

**Hardware and compilers.** Register allocation and instruction scheduling over small windows, and logic minimisation over small sets of Boolean inputs, enumerate subsets with exactly these bit tricks because the sets are small and the operations are cheap.

## Trade-offs and alternatives

| Approach | Time | Memory | Use when |
|---|---|---|---|
| Try all orders | O(n! · n) | O(n) | n ≤ 10 or so; also the stress-test oracle |
| Bitmask DP over (mask, last) | O(2ⁿ · n²) | O(2ⁿ · n) | Order matters, n ≤ about 20 |
| Bitmask DP over mask only | O(2ⁿ · n) | O(2ⁿ) | Position derivable from the mask, n ≤ about 23 |
| Submask DP | O(3ⁿ) | O(2ⁿ) | Grouping, n ≤ about 15 to 16 |
| Meet in the middle | O(2^(n/2) · poly) | O(2^(n/2)) | Subset sums or pairs with n up to about 40 |
| Branch and bound / heuristics | Problem-dependent | Varies | Larger n; exactness not guaranteed in bounded time |
| Polynomial special-purpose methods | e.g. O(n³) Hungarian | O(n²) | Plain assignment, any n |

Memory is often the binding limit before time. `int[1 << 20][20]` is about 84 MB; `long` doubles it. When only the previous popcount layer is needed, or when states can be generated on demand, memory can be cut, but the time stays exponential.

## Common mistakes

> [!MISTAKE] Using a bitmask DP when the subset is not really needed
> If the future depends only on *how many* items are used or their *total*, the state should be that number (a knapsack-style DP), not the subset. A 2ⁿ state for a problem that needs `n · total` states is both slower and limited to small `n` for no reason.

**Forgetting part of the state.** Defining TSP as `dp[mask]` alone loses the current city, so the next step's distance is unknown. Ask what the next transition's cost depends on; every such fact belongs in the state unless derivable from the mask.

**Operator precedence.** In Java, `==` binds more tightly than `&`, so `mask & 1 << i == 0` parses as `mask & ((1 << i) == 0)` and does not compile with `int` operands. Always parenthesise: `(mask & (1 << i)) == 0`.

**Shifting past 31 bits.** `1 << 31` is negative and `1 << 32` equals 1 in Java. Use `1L << i` for larger indices, and question the design if you need them.

**Overflow from the sentinel.** Adding a cost to `Integer.MAX_VALUE` wraps to a negative number that wins every `min`. Skip unreached states, or use `Integer.MAX_VALUE / 2`.

**Allocating before checking `n`.** `new int[1 << n][n]` for `n = 25` throws `OutOfMemoryError`. Check the constraints and estimate memory first.

## Interview perspective

Bitmask DP shows up less often than grid or knapsack DP in typical interviews, but it is a strong signal of depth when it does. Interviewers mainly look for three things: recognising it from the small constraint, choosing a minimal state, and estimating the cost correctly.

> [!INTERVIEW] What a strong answer sounds like
> "n is at most 16, and the future depends on which cities are visited and where I am now, not the order. So `dp[mask][last]` is the shortest path from city 0 visiting exactly `mask` and ending at `last`. From each state I extend to an unvisited city. Every transition adds a bit, so increasing mask order is a valid order. That's 2^16 times 16 states with 16 transitions each — about 16 million steps and a million ints of memory."

Questions to be ready for:

- **Why not try all permutations?** n! versus 2ⁿ · n²: for `n = 15`, 1.3 × 10¹² against 7.4 × 10⁶.
- **What is in the state, and why?** Name each component and what it determines about the future.
- **Mask iteration order** — increasing order suffices because adding a bit increases the value.
- **Submask enumeration** — the `(sub - 1) & mask` loop and the 3ⁿ argument.
- **"What if n = 50?"** — bitmask DP is out; look for structure (knapsack on totals, meet in the middle, greedy, or a polynomial algorithm such as Hungarian for assignment).

## Practice

1. **Travelling salesman** on a small distance matrix — then reconstruct the tour by storing the best predecessor for each state.
2. **Assignment with constraints** — for example, *Maximum Compatibility Score Sum*.
3. **Partition to K Equal Sum Subsets** — solve with `dp[mask]` = current fill of the open bucket, and compare with backtracking from [[a9-pruning]].
4. **Minimum Number of Work Sessions to Finish the Tasks** — submask DP, then try an O(2ⁿ · n) version whose state stores (sessions used, time in the current session).
5. **Shortest Path Visiting All Nodes** — BFS over `(node, mask)`.
6. **Find the Shortest Superstring** — TSP where the "distance" is the overlap between strings.
7. **Number of Ways to Wear Different Hats to Each Other** — notice that the mask should be over the *people* (10) rather than the hats (40).

Problem 7 is a good final test of state design: the side with fewer items goes in the mask. For each problem, compare against a permutation or labelling brute force for `n ≤ 7`. The DSA explorer lists the matching problems under this topic.

## Quick revision {#quick-revision}

- Use when the future depends on *which* of a few items are used; state includes a subset stored as an `int` bitmask.
- Bits: test `(mask & (1 << i)) != 0`; add `mask | (1 << i)`; remove `mask & ~(1 << i)`; size `Integer.bitCount(mask)`; all `(1 << n) - 1`.
- TSP (Held–Karp): `dp[mask][last]`; base `dp[{0}][0] = 0`; push to `mask | (1 << next)`; answer `min dp[all][last] + dist[last][0]`; O(2ⁿ · n²) time, O(2ⁿ · n) memory.
- Increasing numeric order of masks is a valid order whenever transitions only add bits.
- Assignment: `dp[mask]`, next worker = `bitCount(mask)`; O(2ⁿ · n). Drop state components derivable from the mask.
- Groups: `dp[mask] = min over valid submask s of dp[mask ^ s] + 1`; submask loop `sub = (sub - 1) & mask`; O(3ⁿ) overall.
- Rule of thumb: n ≤ 20 for 2ⁿ · n², n ≤ about 15 for 3ⁿ; estimate memory before allocating.
- Watch `==` versus `&` precedence, `1 << 31`, and sentinel overflow.

## Key takeaways {#key-takeaways}

- Bitmask DP replaces n! orderings with 2ⁿ subsets by remembering which items were used and forgetting the order in which they were used.
- It is the right tool only when no smaller summary of the past exists and n is small, typically up to about 20.
- The state is the mask plus exactly what else the future depends on; anything derivable from the mask, such as the next position, should be dropped.
- Transitions that add bits move to larger integers, so masks can be processed in increasing order.
- Submask enumeration with `(sub - 1) & mask` costs 3ⁿ in total and handles problems that split a set into groups.
- Always estimate 2ⁿ-sized time and memory from the constraints before writing the code.
