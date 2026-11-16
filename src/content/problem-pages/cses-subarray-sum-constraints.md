---
problemId: cses-subarray-sum-constraints
title: Subarray Sum Constraints
source: cses
sourceUrl: https://cses.fi/problemset/task/3294
difficulty: hard
patterns: [additional, prefix-sum, graphs, union-find, construction]
relatedLessons: [a2-prefix-suffix, a8-graph-representation, a8-bfs, a8-connected-components, a8-union-find, a8-bellman-ford, a14-brute-force-first, a14-deriving-optimization]
companies: []
timeToSolve: 40
---

## 1. Problem restatement

Build an array x_1, …, x_n of integers that satisfies m constraints. Each constraint (l, r, s) says that the sum x_l + x_{l+1} + … + x_r must equal s. If such an array exists, print `YES` and then the array; every element you print must lie between −10^15 and 10^15. If no array satisfies all the constraints, print `NO`. Any valid array is accepted. This is a whole program: it reads standard input and writes standard output.

**Example 1**

- Input: `5 3`, then the constraints `1 3 3`, `3 5 3`, `4 4 -1`
- Output: `YES` and, for instance, `0 0 3 -1 1`
- Why: x_1 + x_2 + x_3 = 0 + 0 + 3 = 3, x_3 + x_4 + x_5 = 3 − 1 + 1 = 3, and x_4 = −1. The statement prints `0 2 1 -1 3`, which is just as valid: many arrays work.

**Example 2** (an extra example)

- Input: `3 3`, then `1 1 2`, `2 3 4`, `1 3 5`
- Output: `NO`
- Why: the first two constraints force x_1 + x_2 + x_3 = 2 + 4 = 6, but the third asks for 5.

**What the problem statement guarantees**

- 1 ≤ n ≤ 5000 and 0 ≤ m ≤ 2 · 10^5.
- 1 ≤ l ≤ r ≤ n and −10^9 ≤ s ≤ 10^9 in every constraint.
- The printed elements must satisfy −10^15 ≤ x_i ≤ 10^15.
- Any valid array is accepted.
- Time limit: 1 second (memory limit 512 MB).

## 2. Practice first: try it before reading on

If you have not solved this yourself yet, stop here. This is a hard problem whose difficulty is almost entirely in one change of viewpoint; the code afterwards is short. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 40 minutes.
2. Solve tiny cases by hand: one constraint, two overlapping ones, three that contradict. Ask what really determines whether a solution exists.
3. Find a representation in which every constraint involves only two unknowns.
4. Before coding, convince yourself that when your method prints `NO`, *no* array works, not just yours.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> A constraint on x_l + … + x_r involves up to n unknowns. Is there a different set of n + 1 unknowns, from which the x_i can be recovered, in which every constraint involves just two?

> [!HINT] Hint 2: the kind of tool you need
> With prefix sums P_0, …, P_n, a constraint says P_r − P_{l−1} = s: a known difference between two unknowns. Draw the unknowns as nodes and the constraints as weighted edges. Within one connected piece, fixing one value fixes all the others; between pieces, nothing is shared.

> [!HINT] Hint 3: almost the whole plan
> Build the graph on nodes 0..n with an edge l − 1 → r of weight s and the reverse edge of weight −s. From every unvisited node, set its value to 0 and run a BFS that gives each newly reached node "value of parent + edge weight". Then check every constraint; if one fails, print NO. Otherwise print x_i = P_i − P_{i−1}. Check that these values stay within ±10^15.

**Check yourself before revealing the walkthrough**

- [ ] I can rewrite a constraint as a difference of two prefix sums
- [ ] I can explain why a failed check proves that no array exists at all
- [ ] I can bound the size of the numbers my program prints
- [ ] My program prints `NO` for Example 2 and a valid array for Example 1

## 3. Interview script: understand the problem (≈3 min)

I treat it as if an interviewer had posed it. The questions are about the output format, what "any valid answer" allows, and the value bounds.

**Me:** I need an integer array of length n where each of the m given ranges sums to its given value. If it exists, `YES` and the array on the next line, space-separated; otherwise just `NO`. Any valid array is fine?

**Interviewer:** Any array that satisfies all constraints, with every element between −10^15 and 10^15.

**Me:** Constraints can overlap, nest, repeat, or even contradict each other, like the same range with two different sums?

**Interviewer:** Anything with 1 ≤ l ≤ r ≤ n. Contradictions are exactly the NO cases.

**Me:** And m can be 0, in which case any array works, for example all zeros. n is at most 5000 but m up to 2 · 10^5, so I should be close to linear in m.

**Me:** Let me try Example 1 by hand: x_1 + x_2 + x_3 = 3, x_3 + x_4 + x_5 = 3, x_4 = −1. I'm free to pick some values: take x_1 = x_2 = 0, then x_3 = 3; x_4 = −1, then x_5 = 3 − 3 + 1 = 1. So `0 0 3 -1 1` works. The free choices are what make many answers valid.

**Me:** On sizes: s is up to 10^9 in absolute value, and the elements may go up to 10^15, so I'll use `long` for everything and later check how large my numbers can get. Input is up to 6 · 10^5 numbers, so `BufferedReader`, and the output goes into one `StringBuilder`.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 5000 | n + 1 prefix sums as nodes; an O(n²) step would be fine, O(n²·m) would not. |
| 0 ≤ m ≤ 2 · 10^5 | Close to linear in m. m = 0 must still print YES and n numbers. |
| 1 ≤ l ≤ r ≤ n, −10^9 ≤ s ≤ 10^9 | Single elements (l = r) are allowed; s fits in an `int`, but sums of many of them do not: `long`. |
| Output elements in [−10^15, 10^15] | My construction must stay within this range: I prove a bound of 10^13 below. |
| Time limit 1 s | Up to 6 · 10^5 input tokens: fast input; output through one `StringBuilder`. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Any valid array is accepted | I may fix free values however I like (I use 0). Tests must check validity, not compare strings. |
| Contradicting constraints mean NO | The algorithm must detect inconsistency, and a NO must be justified for every array, not just mine. |
| `YES` then the array on the next line, or just `NO` | Two output shapes. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| Each constraint is on its own line | The statement says so; I read three tokens per line. |

### Edge cases I will keep in mind

- m = 0: YES with any array, say all zeros (an official test has n = 5000, m = 0).
- n = 1: constraints can only be (1, 1, s); two different s values mean NO.
- The same constraint repeated (fine) or repeated with a different s (NO).
- Elements never mentioned by any constraint: free.
- Long chains of constraints at |s| = 10^9: the values I print can grow, and must stay within ±10^15.

## 4. Think out loud: from first idea to best solution

### The change of viewpoint that every approach uses

The constraint x_l + … + x_r = s involves r − l + 1 unknowns. Rewrite the array through its prefix sums P_0, P_1, …, P_n, where P_i = x_1 + … + x_i. Then

- x_l + … + x_r = P_r − P_{l−1}, so **each constraint fixes the difference of exactly two unknowns**: P_r − P_{l−1} = s;
- conversely, **any** numbers P_0, …, P_n define an array by x_i = P_i − P_{i−1}, and for that array x_l + … + x_r = P_r − P_{l−1} by telescoping, whatever P_0 is.

So I can choose the n + 1 numbers P_0, …, P_n freely, subject only to m difference constraints, and read the array off at the end. (Choosing P_0 freely is not a problem: adding a constant to every P leaves all differences, and hence the array, unchanged.)

That turns the problem into a graph: nodes 0..n, and for each constraint an edge from l − 1 to r with weight s (and, in the other direction, weight −s). A node's value is called its *potential*, and the question is whether potentials exist that make every edge's weight equal to the difference of its endpoints.

**The textbook route that I set aside:** the problem *is* a system of m linear equations in n unknowns, so Gaussian elimination decides it. But in the x variables each row has up to n non-zero entries, elimination costs on the order of m · n² = 5 · 10^12 operations here, and it needs exact arithmetic. Nobody would code it for these limits; it is worth one sentence to show you recognise the problem, and then the prefix-sum rewrite is the step that makes everything cheap. In prefix-sum variables every row has two non-zeros, and elimination degenerates into following chains of differences, which is exactly what the approaches below do.

### Alternative: propagate by sweeping over the constraints until nothing changes

This rung is correct but too slow for the worst tests (1.6–1.9 s measured on inputs with n = 5000, m = 2 · 10^5), so it is not a numbered approach. It is the most direct way to "solve the equations": fill in whatever is forced, choose freely when nothing is.

#### What I say out loud

> "In prefix-sum form every constraint links two unknowns. So: set P_0 = 0, then repeatedly sweep through all constraints, and whenever one endpoint is known and the other isn't, fill in the other. When a sweep fills in nothing but some P is still unknown, nothing forces it, so I set the lowest unknown P to 0 and continue. At the end, every P is known, and I check every constraint. Each sweep is O(m), and there can be up to about 2(n + 1) sweeps, so O(n · m), 10^9 here."

#### Intuition

It is how you would solve the system by hand: substitute known values until stuck, then make a free choice. Every value filled in is forced by a constraint; every free choice is made only when nothing constrains that value from the known part.

#### Algorithm

1. For each constraint k, store `from[k] = l − 1`, `to[k] = r`, `diff[k] = s`.
2. All P unknown. Repeat while some P is unknown:
   - sweep k = 0..m − 1: if `from[k]` is known and `to[k]` is not, set `P[to] = P[from] + diff`; if `to[k]` is known and `from[k]` is not, set `P[from] = P[to] − diff`;
   - if the sweep set nothing, set the lowest unknown P to 0.
3. For every constraint, if `P[to] − P[from] ≠ diff`, print `NO`.
4. Otherwise print `YES` and x_i = P_i − P_{i−1}.

#### Why it is correct

The argument is the same for all three methods on this page, so I give it in full here.

- **What a sweep produces.** When a sweep sets nothing, every constraint has both endpoints known or both unknown. So the known nodes form a union of whole connected pieces (components) of the constraint graph, and the newly seeded node starts a component that has no known node yet. Hence every component gets exactly one free choice, its *seed*, and every other node of it gets its value from one constraint linking it to an already-known node. Those constraints form a spanning tree of the component, and each holds by construction.
- **If every check passes,** the P values satisfy every constraint, and so does the array x_i = P_i − P_{i−1}.
- **If a check fails, no array exists.** Suppose constraint (u, v, s) fails: P_v − P_u ≠ s. Within the component, the tree gives a path from u to v, and my values satisfy every tree edge on it, so P_v − P_u equals the signed sum of the weights along that path. Any valid assignment Q would have to satisfy those same tree edges, so Q_v − Q_u would equal the same signed sum, which is P_v − P_u ≠ s, so Q violates the failed constraint. No valid assignment exists. The NO is a proof about every array, not a statement about mine.
- **The printed values are in range.** A seed is 0, and a node's value is the signed sum of the weights along its path from the seed, at most n edges of |s| ≤ 10^9 each, so |P_i| ≤ n · 10^9 ≤ 5 · 10^12, and |x_i| = |P_i − P_{i−1}| ≤ 10^13 < 10^15.

#### Dry run

Example 1: constraints become (from, to, diff) = (0, 3, 3), (2, 5, 3), (3, 4, −1). Nodes 0..5.

| Sweep | What happens | Known P afterwards |
|---|---|---|
| 1 | No constraint has a known endpoint; seed P_0 = 0 | P_0 = 0 |
| 2 | (0, 3, 3): P_3 = 3. (2, 5, 3): neither known. (3, 4, −1): P_4 = 2 | P_0, P_3 = 3, P_4 = 2 |
| 3 | Nothing new; seed the lowest unknown, P_1 = 0 | + P_1 = 0 |
| 4 | Nothing new; seed P_2 = 0 | + P_2 = 0 |
| 5 | (2, 5, 3): P_5 = 3 | all known |

P = 0, 0, 0, 3, 2, 3. All three checks pass. Output `YES` / `0 0 3 -1 1`.

Example 2: (0, 1, 2), (1, 3, 4), (0, 3, 5). Sweep 1 seeds P_0 = 0; sweep 2 sets P_1 = 2, then P_3 = 6; sweep 3 seeds P_2 = 0. The check of (0, 3, 5) finds 6 − 0 ≠ 5: `NO`.

#### Java code

```java title="Alternative: sweep until nothing changes (too slow in the worst case)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(st.nextToken());
        int m = Integer.parseInt(st.nextToken());
        int[] from = new int[m];                   // constraint k: P[to] - P[from] = diff
        int[] to = new int[m];
        long[] diff = new long[m];
        for (int k = 0; k < m; k++) {
            st = new StringTokenizer(in.readLine());
            from[k] = Integer.parseInt(st.nextToken()) - 1;
            to[k] = Integer.parseInt(st.nextToken());
            diff[k] = Long.parseLong(st.nextToken());
        }
        long[] prefix = solveBySweeps(n, from, to, diff);
        System.out.print(answer(n, prefix));
    }

    /**
     * Fills in prefix sums P[0..n] by sweeping over the constraints until nothing changes. When a
     * sweep fixes nothing, the lowest unknown P is free: it is set to 0. Returns null on a conflict.
     */
    static long[] solveBySweeps(int n, int[] from, int[] to, long[] diff) {
        long[] prefix = new long[n + 1];
        boolean[] known = new boolean[n + 1];
        int unknown = n + 1;
        int nextFree = 0;
        while (unknown > 0) {
            boolean changed = false;
            for (int k = 0; k < from.length; k++) {
                int u = from[k];
                int v = to[k];
                if (known[u] && !known[v]) {
                    prefix[v] = prefix[u] + diff[k];
                    known[v] = true;
                    unknown--;
                    changed = true;
                } else if (known[v] && !known[u]) {
                    prefix[u] = prefix[v] - diff[k];
                    known[u] = true;
                    unknown--;
                    changed = true;
                }
            }
            if (!changed) {
                while (known[nextFree]) {
                    nextFree++;
                }
                prefix[nextFree] = 0;              // a free choice: nothing constrains it yet
                known[nextFree] = true;
                unknown--;
            }
        }
        for (int k = 0; k < from.length; k++) {   // every P is known: check every constraint
            if (prefix[to[k]] - prefix[from[k]] != diff[k]) {
                return null;
            }
        }
        return prefix;
    }

    static String answer(int n, long[] prefix) {
        if (prefix == null) {
            return "NO\n";
        }
        StringBuilder out = new StringBuilder("YES\n");
        for (int i = 1; i <= n; i++) {
            out.append(prefix[i] - prefix[i - 1]).append(i < n ? ' ' : '\n');
        }
        return out.toString();
    }
}
```

#### Time complexity

**O(n · m)** in the worst case, n + 1 being the number of prefix sums and m the number of constraints. Each sweep costs O(m) and either fills in at least one P or ends in a seed, so there are at most 2(n + 1) sweeps. Two inputs reach that: constraints listed so that each sweep fills in exactly one new P (single elements in decreasing order of position, after 195,000 copies of the last one), and constraints that all cover the whole array, which leave 4999 prefix sums free, each costing a full sweep before it is seeded. Measured on my machine (JDK 26): 1.6 s and 1.9 s at n = 5000, m = 2 · 10^5, against a 1 s limit. On random constraints it finishes in a few sweeps.

#### Space complexity

**O(n + m)**: the constraint arrays and the prefix values.

#### The bridge to the next approach

> "The waste is that each sweep re-reads every constraint just to find the few that touch a newly known node. If I store, for each node, the constraints that touch it, then when a node becomes known I can go straight to its neighbours. That's a graph search: BFS from each seed. Each constraint is then looked at a constant number of times."

### Approach 1: Prefix-sum graph, BFS potentials, then check every constraint (recommended)

#### What I say out loud

> "Nodes 0..n are the prefix sums. Constraint (l, r, s) is an edge l − 1 → r with weight s and r → l − 1 with weight −s. For each node not yet visited, I set its value to 0 and BFS: a node reached through an edge gets its parent's value plus the weight. That satisfies every tree edge. Then I check all m constraints; a failure means a cycle whose weights don't add up to 0, so no array can exist. Otherwise x_i = P_i − P_{i−1}. O(n + m), and the values stay below 10^13."

#### Intuition

In one connected component, choosing one potential determines all the others: walk along edges, adding weights. The only thing that can go wrong is two different paths between the same two nodes disagreeing, and checking every edge after the walk catches exactly that.

#### Algorithm

1. Read the constraints; for each, store `from = l − 1`, `to = r`, `diff = s`, and add both directed edges to adjacency lists (arrays `head`, `next`, `target`, `weight`).
2. For `start` from 0 to n: if not visited, mark it, set `P[start] = 0`, and BFS: for each edge u → v of weight w with v unvisited, set `P[v] = P[u] + w`, mark v, enqueue it.
3. For each constraint: if `P[to] − P[from] ≠ diff`, print `NO` and stop.
4. Print `YES` and x_i = P_i − P_{i−1} for i = 1..n, through one `StringBuilder`.

#### Why it is correct

- **Tree edges hold by construction:** each node other than a start gets `P[v] = P[u] + w` from the edge it was discovered by, and its value never changes afterwards. The discovery edges form a spanning tree of each component (BFS discovers every node of the component exactly once).
- **If every constraint passes,** P satisfies all of them, and x_i = P_i − P_{i−1} satisfies every original constraint by the telescoping identity.
- **If a constraint (u, v, s) fails, there is no solution.** u and v are in the same component (the constraint is an edge). Along the tree path from u to v, my values satisfy every edge, so P_v − P_u is the signed sum of the path's weights. Any valid assignment must satisfy the same tree edges, so it would have the same difference, which is not s. Equivalently: the failed edge plus the tree path form a cycle whose signed weights do not sum to 0, and around a cycle, the differences of any assignment always sum to 0.
- **Separate components are independent.** No constraint connects them, so fixing each start at 0 cannot cause a conflict between them.
- **Range:** a node at BFS depth d has |P| ≤ d · 10^9 ≤ n · 10^9 = 5 · 10^12 (a path among n + 1 nodes has at most n edges). Each printed x_i = P_i − P_{i−1} is therefore at most 10^13 in absolute value, well within 10^15. That bound is also why `long` is needed: 5 · 10^12 does not fit in an `int`.

The 20-second version: "Prefix sums turn each constraint into a difference P_r − P_{l−1} = s, an edge in a graph on 0..n. BFS from each component's first node with potential 0 satisfies the tree edges; then I check every edge. A failed edge closes a cycle with non-zero total weight, which no assignment can satisfy, so NO is correct. Otherwise x_i = P_i − P_{i−1}, bounded by 10^13. O(n + m)."

#### Dry run

Example 1: edges 0 → 3 (3), 2 → 5 (3), 3 → 4 (−1), with their reverses.

| Step | Node | Reached from | P |
|---|---|---|---|
| start 0 | 0 | (start) | 0 |
| | 3 | 0, weight 3 | 3 |
| | 4 | 3, weight −1 | 2 |
| start 1 | 1 | (start) | 0 |
| start 2 | 2 | (start) | 0 |
| | 5 | 2, weight 3 | 3 |

Checks: P_3 − P_0 = 3, P_5 − P_2 = 3, P_4 − P_3 = −1, all pass. Output `YES` / `0 0 3 -1 1` (x = 0 − 0, 0 − 0, 3 − 0, 2 − 3, 3 − 2).

Example 2: edges 0 → 1 (2), 1 → 3 (4), 0 → 3 (5). BFS from 0 reaches 3 with P = 5 (the most recently added edge comes first in the adjacency list) and 1 with P = 2; node 2 is a start of its own. Check (1, 3, 4): P_3 − P_1 = 3 ≠ 4: `NO`. The cycle 0 → 1 → 3 → 0 has weights 2 + 4 − 5 = 1 ≠ 0.

#### Java code

```java title="Approach 1: BFS potentials on the prefix-sum graph (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(st.nextToken());
        int m = Integer.parseInt(st.nextToken());

        // Graph on the prefix sums P[0..n]: constraint (l, r, s) is an edge l-1 -> r of weight s
        // and an edge r -> l-1 of weight -s. Adjacency lists in arrays (head, next).
        int[] head = new int[n + 1];
        Arrays.fill(head, -1);
        int[] next = new int[2 * m];
        int[] target = new int[2 * m];
        long[] weight = new long[2 * m];
        int[] from = new int[m];
        int[] to = new int[m];
        long[] diff = new long[m];
        for (int k = 0; k < m; k++) {
            st = new StringTokenizer(in.readLine());
            from[k] = Integer.parseInt(st.nextToken()) - 1;
            to[k] = Integer.parseInt(st.nextToken());
            diff[k] = Long.parseLong(st.nextToken());
            target[2 * k] = to[k];
            weight[2 * k] = diff[k];
            next[2 * k] = head[from[k]];
            head[from[k]] = 2 * k;
            target[2 * k + 1] = from[k];
            weight[2 * k + 1] = -diff[k];
            next[2 * k + 1] = head[to[k]];
            head[to[k]] = 2 * k + 1;
        }

        // Breadth-first search from each unvisited node: the start gets P = 0, every other node
        // gets P = P[parent] + weight along the edge it was reached by.
        long[] prefix = new long[n + 1];
        boolean[] visited = new boolean[n + 1];
        int[] queue = new int[n + 1];
        for (int start = 0; start <= n; start++) {
            if (visited[start]) {
                continue;
            }
            visited[start] = true;
            prefix[start] = 0;
            int qHead = 0;
            int qTail = 0;
            queue[qTail++] = start;
            while (qHead < qTail) {
                int u = queue[qHead++];
                for (int e = head[u]; e != -1; e = next[e]) {
                    int v = target[e];
                    if (!visited[v]) {
                        visited[v] = true;
                        prefix[v] = prefix[u] + weight[e];
                        queue[qTail++] = v;
                    }
                }
            }
        }

        // The tree edges hold by construction; every constraint must hold too.
        for (int k = 0; k < m; k++) {
            if (prefix[to[k]] - prefix[from[k]] != diff[k]) {
                System.out.println("NO");
                return;
            }
        }
        StringBuilder out = new StringBuilder("YES\n");
        for (int i = 1; i <= n; i++) {
            out.append(prefix[i] - prefix[i - 1]).append(i < n ? ' ' : '\n');
        }
        System.out.print(out);
    }
}
```

#### Time complexity

**O(n + m)**, n being the array length and m the number of constraints: building the adjacency arrays is O(m), the BFS visits each of the n + 1 nodes once and each of the 2m directed edges once, the check is O(m), and the output O(n). Measured: 0.10–0.19 s for the whole program at n = 5000, m = 2 · 10^5 (random constraints, the sweep alternative's worst cases, and a contradiction at the end), JVM start included. Most of that time is reading the input.

#### Space complexity

**O(n + m)**: four arrays of 2m entries for the edges, three of m for the constraints, and O(n) for values, marks and the queue.

#### The bridge to the next approach

> "BFS needs the whole graph in memory before it starts, and it can only say NO at the end. If the constraints arrived one at a time and I had to say, after each one, whether everything so far is still consistent, I'd want a structure that merges components as edges arrive and remembers each node's offset from its component's representative. That's union-find with weights."

### Approach 2: Weighted union-find, online

#### What I say out loud

> "I keep a union-find over nodes 0..n where each node also stores its offset from its parent: offset[v] = P_v − P_parent(v). Find compresses paths and adds the offsets up, so after find(v), offset[v] = P_v − P_root. For a constraint P_v − P_u = s: if u and v already share a root, I check offset[v] − offset[u] = s; otherwise I hang one root under the other with the offset that makes the constraint true. At the end each root has P = 0 and every node's P is its offset. Near-linear, and it detects the first contradiction as it reads."

#### Intuition

A component is stored as a tree, and every node knows its potential relative to the tree's root. Joining two components only requires deciding the difference between their two roots, which the new constraint determines.

#### Algorithm

1. `parent[v] = v`, `size[v] = 1`, `offset[v] = 0` for v in 0..n.
2. `find(v)`: walk up to the root; then walk the path again, setting each node's parent to the root and its offset to its total offset to the root.
3. For each constraint, with u = l − 1, v = r: `ru = find(u)`, `rv = find(v)`.
   - If `ru == rv`: the constraint holds exactly when `offset[v] − offset[u] == s`; otherwise remember NO.
   - Else: `rootDiff = s + offset[u] − offset[v]` (this is P_rv − P_ru). Hang the smaller tree under the larger: `parent[rv] = ru, offset[rv] = rootDiff`, or `parent[ru] = rv, offset[ru] = −rootDiff`.
4. On NO, print `NO`. Otherwise every root's P is 0: call find on each node, and print x_i = offset[i] − offset[i − 1].

#### Why it is correct

- **Invariant:** offset[v] = P_v − P_parent(v) for the potentials "every root at 0". A root's offset is 0 and stays 0 until it gets a parent.
- **find keeps the invariant:** the new offset of a path node is the sum of the offsets along its old path to the root, which is P_v − P_root by telescoping.
- **The root difference:** with P_u = P_ru + offset[u] and P_v = P_rv + offset[v] (both after find), the constraint P_v − P_u = s becomes P_rv − P_ru = s + offset[u] − offset[v] = rootDiff. If rv goes under ru, offset[rv] = P_rv − P_ru = rootDiff; if ru goes under rv, offset[ru] = P_ru − P_rv = −rootDiff. Getting this sign wrong produces invalid arrays: hanging ru under rv with +rootDiff prints `-2 5 1` on `3 3` / `2 2 5` / `3 3 1` / `1 1 2`, where x_1 must be 2 (verified).
- **Same root:** the difference offset[v] − offset[u] is already forced by earlier constraints (the tree path between u and v), so the constraint is consistent exactly when it agrees, by the same cycle argument as in the sweep alternative. A conflict at any point means no array exists.
- **Range:** each component's union edges form a spanning tree of it, so every potential relative to the root is a signed sum along at most n constraint edges: at most 5 · 10^12, and |x_i| ≤ 10^13.

#### Dry run

Example 1, constraints (u, v, s) = (0, 3, 3), (2, 5, 3), (3, 4, −1).

| Constraint | find(u): root, offset | find(v): root, offset | rootDiff | Action |
|---|---|---|---|---|
| (0, 3, 3) | 0, 0 | 3, 0 | 3 + 0 − 0 = 3 | sizes equal: parent[3] = 0, offset[3] = 3 |
| (2, 5, 3) | 2, 0 | 5, 0 | 3 | parent[5] = 2, offset[5] = 3 |
| (3, 4, −1) | 0, 3 | 4, 0 | −1 + 3 − 0 = 2 | size 2 > 1: parent[4] = 0, offset[4] = 2 |

Final offsets (roots at 0): node 0: 0, 1: 0, 2: 0, 3: 3, 4: 2, 5: 3, the same potentials as the BFS. Output `YES` / `0 0 3 -1 1`.

Example 2, constraints (0, 1, 2), (1, 3, 4), (0, 3, 5): the first gives parent[1] = 0, offset[1] = 2; the second finds roots 0 (offset 2) and 3 (offset 0), rootDiff = 4 + 2 − 0 = 6, so parent[3] = 0, offset[3] = 6; the third finds both under root 0 with offset[3] − offset[0] = 6 ≠ 5: `NO`.

#### Java code

```java title="Approach 2: weighted union-find"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    static int[] parent;
    static int[] size;
    static long[] offset;                          // offset[v] = P[v] - P[parent[v]]

    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(st.nextToken());
        int m = Integer.parseInt(st.nextToken());

        parent = new int[n + 1];
        size = new int[n + 1];
        offset = new long[n + 1];
        for (int v = 0; v <= n; v++) {
            parent[v] = v;
            size[v] = 1;
        }

        boolean ok = true;
        for (int k = 0; k < m; k++) {
            st = new StringTokenizer(in.readLine());
            int u = Integer.parseInt(st.nextToken()) - 1;
            int v = Integer.parseInt(st.nextToken());
            long s = Long.parseLong(st.nextToken());
            if (ok && !union(u, v, s)) {           // a conflict: the answer is NO
                ok = false;
            }
        }
        if (!ok) {
            System.out.println("NO");
            return;
        }

        StringBuilder out = new StringBuilder("YES\n");
        find(0);
        long previous = offset[0];                 // P[0] with its root at 0
        for (int i = 1; i <= n; i++) {
            find(i);                               // now offset[i] = P[i] - P[root], root's P = 0
            out.append(offset[i] - previous).append(i < n ? ' ' : '\n');
            previous = offset[i];
        }
        System.out.print(out);
    }

    /** Returns the root of v and compresses the path, so that afterwards offset[v] = P[v] - P[root]. */
    static int find(int v) {
        int root = v;
        while (parent[root] != root) {
            root = parent[root];
        }
        // Total offset of v to the root, then relink every node on the path directly to it.
        long toRoot = 0;
        for (int w = v; w != root; w = parent[w]) {
            toRoot += offset[w];
        }
        int w = v;
        while (w != root) {
            int up = parent[w];
            long rest = toRoot - offset[w];        // offset of up to the root
            offset[w] = toRoot;
            parent[w] = root;
            toRoot = rest;
            w = up;
        }
        return root;
    }

    /** Records P[v] - P[u] = s. Returns false when it contradicts what is already known. */
    static boolean union(int u, int v, long s) {
        int ru = find(u);
        int rv = find(v);
        if (ru == rv) {
            return offset[v] - offset[u] == s;
        }
        // P[v] - P[u] = s, P[u] = P[ru] + offset[u], P[v] = P[rv] + offset[v]
        // => P[rv] - P[ru] = s + offset[u] - offset[v].
        long rootDiff = s + offset[u] - offset[v];
        if (size[ru] < size[rv]) {                 // hang the smaller tree under the larger
            parent[ru] = rv;
            offset[ru] = -rootDiff;
            size[rv] += size[ru];
        } else {
            parent[rv] = ru;
            offset[rv] = rootDiff;
            size[ru] += size[rv];
        }
        return true;
    }
}
```

#### Time complexity

**O((n + m) · α(n))**, α being the inverse Ackermann function (at most 4 for any realistic n): union by size together with path compression gives that amortized bound per operation, for m unions and n + 1 final finds. Measured: 0.09–0.13 s for the whole program on the same n = 5000, m = 2 · 10^5 inputs.

#### Space complexity

**O(n)**: three arrays over the n + 1 nodes. The constraints are processed as they are read and never stored, unlike in Approach 1.

## 5. Comparison table

n is the array length (n + 1 prefix-sum nodes) and m the number of constraints.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Gaussian elimination in the x variables (prose only) | O(m · n²) | O(m · n²) | O(n²) |
| Alt. Sweep until nothing changes | a few sweeps on random input | O(n · m), 1.6–1.9 s measured | O(n + m) |
| 1. BFS potentials + check | O(n + m) | O(n + m) | O(n + m) |
| 2. Weighted union-find | O((n + m) α(n)) | O((n + m) α(n)) amortized | O(n) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Gaussian elimination | General: any linear system | Far too slow; exact arithmetic | Never at these limits; mention it to show you recognise a linear system |
| Alt. Sweeps | Mirrors solving by hand; no graph needed | Quadratic-like worst case | Explaining the idea; tiny inputs |
| 1. BFS | Linear; easiest correctness argument; plain arrays | Stores the graph; NO only after all input | The recommended answer |
| 2. Weighted union-find | Online (detects the first conflict as it reads); O(n) memory | Sign conventions are easy to get wrong | Streams of constraints; "is it still consistent after each one?" |

## 6. Which solution to give, and when to stop optimizing

**The solution I recommend:** Approach 1. The prefix-sum rewrite is the whole insight; after it, "assign potentials by BFS, then verify every edge" is standard, linear, and its correctness argument (a failed edge closes a cycle with non-zero weight) is easy to say aloud. Approach 2 is equally fast and better when constraints arrive online, but its offset signs are a common source of bugs under time pressure.

**Is it optimal?** In the worst case a correct algorithm must read essentially every constraint, since changing a single s can turn YES into NO, and it must print n numbers: Ω(n + m). Approach 1 is O(n + m). Stop here.

**What the generous output bound means:** elements may go up to 10^15, and the construction never exceeds 10^13. There is no need to minimise or balance the values; any root choice works.

## 7. Interview script: code it and test it

### What I say while coding

> "Node l − 1, not l: the constraint is P_r − P_{l−1}. With l, a single-element constraint becomes P_l − P_l = s."

> "Every value is a `long`: potentials reach 5 · 10^12."

> "Both directions of each edge go into the adjacency list, with opposite weights, so BFS can walk a constraint from either end."

> "After the BFS I check every constraint, tree edges included; checking only the non-tree ones would be fine but needs bookkeeping, and checking all is O(m) anyway."

> "Output goes into one `StringBuilder`: n numbers, `YES` on its own line first."

### Testing out loud

**Example 1:** the BFS table above, `YES` / `0 0 3 -1 1`. Re-check by summing: 0 + 0 + 3 = 3, 3 − 1 + 1 = 3, −1. Valid.

**Example 2:** the check of (1, 3, 4) fails: `NO`.

**m = 0:** every node is its own start with P = 0: `YES` and n zeros.

**n = 1, `1 2` / `1 1 5` / `1 1 6`:** P_1 = 5 from the first edge, the second check fails: `NO`. With both s = 5: `YES` / `5`.

**Largest values:** n = 5000 with constraints x_i = 10^9 for i < 5000: P_4999 = 4.999 · 10^12, P_5000 is free and set to 0 as its own start, so x_5000 = −4.999 · 10^12: large, but within ±10^15.

**Official tests:** all three programs on this page produce a valid answer, with the expected YES or NO, on the 4 official CSES tests stored with this site (including n = 5000 with m = 0), run on a real JVM and checked by a validator, since any valid array is accepted. The page's tests add the largest inputs: m = 2 · 10^5 consistent constraints, the same with one contradiction at the end, and the sweep alternative's worst cases.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 3 min | Output format, any valid answer, value bound, m = 0 |
| Find the rewrite | 7 min | Small cases by hand; prefix sums; two unknowns per constraint |
| Ladder | 5 min | Linear system (too slow), sweeps, BFS, union-find; why NO is a proof |
| Code | 12 min | Adjacency arrays, BFS from each start, check, output |
| Test | 5 min | Both examples, m = 0, a contradiction, value bound |

If stuck, write P_0..P_n under the array and rewrite one constraint as a difference.

## 9. Interviewer challenges

### About correctness

#### Your BFS chose P = 0 for each start. How do you know a NO isn't just a bad choice?

**What they are testing:** whether you can argue that a failed check rules out every array.

**How to reason:** which values were forced and which were free; what any valid assignment must do on the tree edges.

**What I say:** "Only the start of each component was a free choice, and shifting a whole component by a constant doesn't change any difference inside it. Every other value was forced by a tree edge. If an edge (u, v, s) fails, the tree path from u to v forces P_v − P_u to some value d for *every* valid assignment, and d ≠ s. So the failed edge and the tree path form a cycle whose weights don't sum to zero, and no assignment can satisfy a cycle like that, because differences around a cycle always telescope to 0."

**Nuance:** this is the general theory of potentials: a set of difference *equalities* is consistent exactly when every cycle has total weight 0. With *inequalities* (P_v − P_u ≤ s) the condition becomes "no negative cycle", solved with Bellman-Ford.

#### Can the numbers you print exceed 10^15?

**What they are testing:** whether you bound the construction rather than hope.

**How to reason:** how far a node can be from its component's start, and how big each step is.

**What I say:** "A BFS path among n + 1 nodes has at most n edges, each with |s| ≤ 10^9, so |P| ≤ 5 · 10^12, and x_i = P_i − P_{i−1} is at most 10^13 in absolute value. The limit 10^15 leaves a factor of 100. It also means `int` is not enough for P: 5 · 10^12 overflows it."

**Nuance:** P_i and P_{i−1} can sit in different components with values of opposite sign, which is why the bound on x is twice the bound on P; the test with x_i = 10^9 for i < n prints x_n = −4.999 · 10^12.

### About the choice of method

#### Why not union-find? Isn't it the "standard" tool here?

**What they are testing:** knowing both methods and when each wins.

**How to reason:** offline versus online, memory, implementation risk.

**What I say:** "Weighted union-find works and is near-linear. It wins when constraints arrive online and I must report the first contradiction, and it needs only O(n) memory because constraints aren't stored. But its offsets carry signs that are easy to flip: hanging ru under rv needs −rootDiff, and with +rootDiff it printed an invalid array on a three-constraint input. With all constraints given up front, BFS plus a verification pass is simpler to get right."

**Nuance:** union-find's α(n) factor is irrelevant in practice; the real differences are online-ness and memory.

#### Why is n only 5000?

**What they are testing:** reading the limits critically.

**How to reason:** what would break at larger n?

**What I say:** "Nothing in my solution needs n to be small: it is O(n + m). With n up to 2 · 10^5 the values would reach 2 · 10^14, still within 10^15. My guess is that the limit leaves room for slower but reasonable methods, such as quadratic propagation; I wouldn't rely on it."

**Nuance:** the sweep alternative is exactly such a method, and it still fails the 1 s limit on crafted inputs at m = 2 · 10^5.

## 10. Follow-up questions the interviewer might ask

**"Report, after each constraint, whether the constraints so far are still consistent."**
Weighted union-find (Approach 2), checking each constraint as it arrives: O((n + m) α(n)) total.

**"Constraints are inequalities: x_l + … + x_r ≤ s."**
P_r − P_{l−1} ≤ s is a difference constraint; with also "≥" constraints, a solution exists if and only if the constraint graph has no negative cycle. Bellman-Ford finds one or computes potentials: O(n · m).

**"Also require every x_i ≥ 0."**
That is P_i − P_{i−1} ≥ 0, more difference constraints, so the same Bellman-Ford framework (equalities become pairs of inequalities).

**"Count how many prefix sums are determined, given P_0 = 0."**
Exactly the nodes in P_0's component (if consistent): the size of that component in either approach.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Working in the x variables.** Each constraint touches up to n unknowns, and nothing simple follows. The prefix-sum rewrite is the step to make first.
- **Trusting NO without an argument.** A NO must hold for every array; the cycle argument is what makes the verification pass correct.
- **Starting the search only from P_0.** Nodes not connected to node 0 are never visited, so constraints among them are never propagated. With only node 0 as a start, `2 1` / `2 2 5` prints `NO` instead of `YES` / `0 5` (verified): every component needs its own start.

### Implementation mistakes

> [!MISTAKE] Using node l instead of l − 1
> The constraint is P_r − P_{l−1} = s. Storing it as P_r − P_l makes a single-element constraint (l = r) read "0 = s": on Example 1 the program prints `NO` (verified), because `4 4 -1` becomes P_4 − P_4 = −1.

- **Not checking the non-tree edges.** BFS satisfies only the tree edges. Without the verification pass, Example 2 prints `YES` / `2 -2 5` (verified), which breaks x_2 + x_3 = 4.
- **The wrong sign when hanging one root under the other** (union-find). It prints invalid arrays (verified above).
- **`int` potentials.** Chains of constraints with |s| = 10^9 reach 5 · 10^12.
- **Printing value by value with `System.out.print`.** Up to 5000 numbers is fine, but the habit costs time on larger outputs; build one `StringBuilder`.

## 12. Pattern recognition

**The pattern:** subarray sums as differences of prefix sums, then *difference constraints as a graph*. Equalities: potentials by BFS or weighted union-find, consistent if and only if every cycle sums to 0. Inequalities: shortest paths, consistent if and only if there is no negative cycle.

**Signals in the problem statement:**

- Constraints on sums of ranges, or on differences between pairs of unknowns.
- "Construct any array satisfying…", with a YES/NO.
- Many constraints (m up to 2 · 10^5) over few positions.

**Related problems in this list:**

- [[cses-subarray-sums-ii|Subarray Sums II]]: subarray sums as prefix-sum differences, used for counting instead of construction.
- [[cses-subarray-divisibility|Subarray Divisibility]]: the same rewrite with remainders.
- [[nc-subarray-sum-equals-k|Subarray Sum Equals K]]: counting subarrays with a sum, through prefix sums.
- [[nc-evaluate-division|Evaluate Division]]: weighted union-find (or graph search) with ratios instead of differences.
- [[cses-building-roads|Building Roads]]: components of a graph, the unweighted core of this problem.
- [[cses-system-of-linear-equations|System of Linear Equations]]: the general linear system, where Gaussian elimination is the right tool.

**Takeaway:** when constraints talk about range sums, rewrite them with prefix sums; each becomes a difference of two unknowns, i.e. a weighted edge. Assign potentials along a spanning tree, verify every edge, and a failure is a cycle that proves no solution exists.

## 13. 60-second revision card

**Key insight:** x_l + … + x_r = s is P_r − P_{l−1} = s: a weighted edge between two prefix-sum nodes; any P_0..P_n gives a valid array x_i = P_i − P_{i−1}.

**Invariant:** after BFS, every tree edge holds; every component's start has P = 0.

**Complexity:** O(n + m) time and space (BFS); O((n + m) α(n)) time, O(n) space (weighted union-find).

**Code skeleton:**

```java title="Subarray Sum Constraints, BFS potentials"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(st.nextToken());
        int m = Integer.parseInt(st.nextToken());
        int[] from = new int[m];
        int[] to = new int[m];
        long[] diff = new long[m];
        List<List<long[]>> adj = new ArrayList<>();
        for (int v = 0; v <= n; v++) adj.add(new ArrayList<>());
        for (int k = 0; k < m; k++) {
            st = new StringTokenizer(in.readLine());
            from[k] = Integer.parseInt(st.nextToken()) - 1;   // P[r] - P[l-1] = s
            to[k] = Integer.parseInt(st.nextToken());
            diff[k] = Long.parseLong(st.nextToken());
            adj.get(from[k]).add(new long[] {to[k], diff[k]});
            adj.get(to[k]).add(new long[] {from[k], -diff[k]});
        }
        long[] p = new long[n + 1];
        boolean[] seen = new boolean[n + 1];
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        for (int start = 0; start <= n; start++) {             // every component gets a start
            if (seen[start]) continue;
            seen[start] = true;
            queue.add(start);
            while (!queue.isEmpty()) {
                int u = queue.poll();
                for (long[] e : adj.get(u)) {
                    int v = (int) e[0];
                    if (!seen[v]) {
                        seen[v] = true;
                        p[v] = p[u] + e[1];
                        queue.add(v);
                    }
                }
            }
        }
        for (int k = 0; k < m; k++) {
            if (p[to[k]] - p[from[k]] != diff[k]) {
                System.out.println("NO");
                return;
            }
        }
        StringBuilder out = new StringBuilder("YES\n");
        for (int i = 1; i <= n; i++) out.append(p[i] - p[i - 1]).append(i < n ? ' ' : '\n');
        System.out.print(out);
    }
}
```

**Main traps:**

- Node l − 1, not l.
- Check every constraint after the BFS.
- `long` potentials (up to 5 · 10^12); output through one `StringBuilder`.

**What to say in one breath:** "With prefix sums each constraint is P_r − P_{l−1} = s, an edge in a graph on 0..n. I BFS each component from potential 0, then verify every edge: a failed edge closes a cycle with non-zero weight, so NO is correct for every array. Otherwise I print P_i − P_{i−1}, which stays below 10^13. O(n + m)."
