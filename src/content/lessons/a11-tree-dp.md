---
summary: DP on trees computes an answer for every subtree from the answers of its children, in one post-order pass. You will learn to design the small summary each node reports to its parent, derive multi-state recurrences such as rob/skip and the three camera states, run tree DP on adjacency lists without recursion, and answer a question for every possible root with rerooting.
difficulty: advanced
minutes: 60
objectives:
  - Explain why a tree's subtrees are independent subproblems and why post-order is the natural order of computation
  - Design a node's return value by asking what the parent needs, and derive multi-state recurrences such as rob/skip and camera coverage
  - Implement tree DP on binary trees recursively and on general trees given as edge lists with an iterative order that cannot overflow the stack
  - Use rerooting to compute an answer for every root in O(n) total, deriving how the answer changes when the root moves across one edge
  - Verify tree DP solutions against brute force over subsets of nodes on small random trees
---

## Introduction

A neighbourhood's houses are arranged as a binary tree: every house except the root has exactly one parent house, and an alarm goes off if two directly connected houses are robbed on the same night. How much can a thief take? On a line of houses this is the familiar House Robber problem, solved with a one-dimensional DP in [[a11-1d-dp]]. On a tree there is no "previous house" — each house has a parent and possibly several children — so the line DP does not apply directly.

**DP on trees** (tree DP) is the pattern for such problems. Each node's subtree is a subproblem. A node asks each child for a small **summary** of the child's subtree — for the thief, "the best you can do if you are robbed, and the best if you are not" — and combines those summaries into its own, which it reports to its own parent. The root's summary is the answer. Because every node is visited once and does work proportional to its number of children, the whole computation is O(n).

Tree DP shows up wherever data is hierarchical: organisation charts (choose a party guest list where nobody attends with their direct manager), file systems (aggregate sizes), network topologies (place monitors so every link is watched), parse trees in compilers (compute the cheapest instruction sequence for an expression), and phylogenetic trees in biology. In interviews it appears as House Robber III, Binary Tree Cameras, Binary Tree Maximum Path Sum and Sum of Distances in Tree.

This lesson teaches how to *design* the summary — that is the hard part — and how to compute it safely on trees with hundreds of thousands of nodes.

## Before you start

You should be comfortable with:

- **Binary trees and depth-first traversal**, especially post-order (children before parent). See [[a6-binary-trees]] and [[a6-dfs]].
- **Recursion and the call stack**, including why deep recursion overflows. See [[a1-recursion]].
- **Height and diameter** — the diameter lesson already uses the core tree-DP move of returning one value while recording another. See [[a6-height-depth]] and [[a6-diameter]].
- **The four parts of a DP answer** (state, recurrence, base cases, order) and memoization. See [[a11-memoization]].
- **General trees as adjacency lists** and breadth-first search. See [[a6-nary-trees]] and [[a6-bfs]].

## The intuition: what does the parent need to know?

Think of a company where the CEO wants a number computed over the whole organisation. She cannot inspect every employee. Instead she asks each direct report for a short report about their part of the company, and each of them asks their own direct reports, and so on down. Leaves (people with no reports) answer immediately. Each manager combines the reports from below and passes a single summary up.

Two things make this work:

1. **Subtrees do not overlap.** The part of the company under one direct report shares nobody with the part under another. So the subproblems are independent, and each is solved exactly once — no memo table is needed, because no state is ever reached twice.
2. **The summary is small, and it is designed for the parent.** A manager does not forward every detail of her team. She reports exactly what her boss needs to make *her* decision, and nothing more.

The second point is the skill. For each problem, ask: *when the parent makes its decision, what must it know about each child's subtree?* That becomes the state.

## Why post-order, and why no memo table

A node's value depends on its children's values, so children must be computed first. That is **post-order**: recurse into all children, then compute the node. Pre-order (node first) would be computing a value before the information it depends on exists.

In array DP, memoization prevents the same state from being solved many times through different paths. In a tree, every node is reached through exactly one path from the root, so a plain recursive post-order traversal already solves each subproblem once. The recursion *is* the DP; its "table" is the set of values returned up the call stack. (If shared substructures exist — a DAG rather than a tree — you would need memoization again.)

The time is therefore the sum over nodes of the work done there. If each node does O(1) work per child, the total is O(number of child links) = O(n). The space is the recursion depth, O(h) for a tree of height `h`, which is O(log n) for a balanced tree and O(n) for a path.

## The first summary that is not enough: House Robber III

*Each node of a binary tree holds an amount of money. You may not take from two nodes joined by an edge. Maximise the total.*

**Naive approach.** Try every subset of nodes, discard those containing an edge, keep the best: O(2ⁿ · n). Twenty nodes is a million subsets; a hundred is impossible.

**A first attempt at the state.** "`best(v)` = the most money from `v`'s subtree." To compute `best(v)`, decide whether to rob `v`. If you skip `v`, the children are unconstrained: `best(left) + best(right)`. If you rob `v`, the children must *not* be robbed — but `best(left)` might rob the left child, and the parent cannot tell. The summary is missing exactly the fact the parent needs. A common patch is to also look at the grandchildren (`v.val + best of all four grandchildren`), which works but is clumsy and visits nodes more than once.

**The fix: report two numbers.** Make the state say what the parent needs:

> For each node `v`: `take(v)` = the most money from `v`'s subtree **if `v` is robbed**, and `skip(v)` = the most **if `v` is not robbed**.

**Recurrence.** If `v` is robbed, neither child may be, so each child contributes its `skip`. If `v` is not robbed, each child is free, so each contributes the better of its two values:

```text
take(v) = v.val + skip(left) + skip(right)
skip(v) = max(take(left), skip(left)) + max(take(right), skip(right))
```

**Base case.** An empty subtree (`null`) contributes nothing either way: `take = skip = 0`. Robbing `null` is meaningless, but `take(null) = 0` is harmless because a parent only ever reads `skip` of a child when it is robbed itself, and `max(take, skip)` otherwise.

**Order.** Post-order. **Answer.** `max(take(root), skip(root))`.

### Dry run

Tree (values shown at nodes):

```text
        3
       / \
      4   5
     / \    \
    1   3    1
```

| Node | Children's `(take, skip)` | `take` | `skip` |
|---|---|---|---|
| leaf 1 (under 4) | null, null | 1 | 0 |
| leaf 3 | null, null | 3 | 0 |
| leaf 1 (under 5) | null, null | 1 | 0 |
| 4 | (1, 0), (3, 0) | 4 + 0 + 0 = 4 | 1 + 3 = 4 |
| 5 | null, (1, 0) | 5 + 0 + 0 = 5 | 0 + 1 = 1 |
| root 3 | (4, 4), (5, 1) | 3 + 4 + 1 = 8 | 4 + 5 = 9 |

The answer is `max(8, 9) = 9`: skip the root and rob 4 and 5. Look at node 4: robbing it and skipping it both give 4 (`{4}` versus `{1, 3}`), and the root keeps both options open because it does not need to know *which* set produced the value — only the value under each condition. That is what a good summary does.

## More states: Binary Tree Cameras

*Place cameras on nodes of a binary tree. A camera watches its own node, its parent and its children. Find the minimum number of cameras so every node is watched.*

Ask what the parent needs to know about a child. When the parent decides whether to hold a camera, it needs to know:

- whether the child **already has a camera** (then the parent is watched by it), and
- whether the child is **still unwatched** (then the parent *must* hold a camera, since the parent is the only one left who can watch it).

So each node reports the cheapest cost in three situations, each assuming everything strictly below it is watched:

| State | Meaning |
|---|---|
| `uncovered(v)` | `v` has no camera and does not rely on its children to be watched, so its parent must hold a camera |
| `byChild(v)` | `v` has no camera but is watched by one of its children |
| `camera(v)` | `v` holds a camera |

**Recurrences.** Let `covered(c) = min(byChild(c), camera(c))` be the cheapest way for child `c` to be watched without help from `v`.

```text
uncovered(v) = covered(left) + covered(right)                      no camera at v; parent will watch v
byChild(v)   = min(camera(left) + covered(right),
                   camera(right) + covered(left))                   at least one child has a camera
camera(v)    = 1 + min of all three states of left
                 + min of all three states of right                v's camera watches both children
```

In `uncovered(v)`, the children cannot rely on `v`, so they must already be watched. (A child might happen to hold a camera, which would also watch `v`; counting such cases here is harmless, because this state is only used when the parent holds a camera anyway, and `byChild(v)` covers them properly.) In `camera(v)`, `v` watches its children, so even an `uncovered` child is fine.

**Base case.** A `null` child must never force a camera and must never provide one. Model it as "watched, no camera, cost 0": `uncovered(null) = ∞`, `byChild(null) = 0`, `camera(null) = ∞`. Check a leaf: `uncovered = 0` (the leaf waits for its parent), `byChild = ∞` (it has no children with cameras), `camera = 1`.

**Answer.** The root has no parent to rescue it, so the answer is `min(byChild(root), camera(root))`.

For a path of five nodes, this gives 2: cameras on the second and fourth nodes from the bottom. A well-known greedy (place a camera at the parent of every unwatched leaf, working upwards) also solves this particular problem in O(n), but the three-state DP is the method that generalises — to weighted camera costs, to cameras that watch two levels, and to similar covering problems where no greedy is known.

## The binary-tree code

```java title="BinaryTreeDp.java"
public class BinaryTreeDp {

    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
        TreeNode(int val, TreeNode left, TreeNode right) {
            this.val = val; this.left = left; this.right = right;
        }
    }

    // House Robber III: no two directly linked houses may both be robbed
    static int rob(TreeNode root) {
        int[] r = robDfs(root);
        return Math.max(r[0], r[1]);
    }

    // returns {best if this node is robbed, best if it is not}
    static int[] robDfs(TreeNode node) {
        if (node == null) return new int[]{0, 0};
        int[] l = robDfs(node.left);
        int[] r = robDfs(node.right);
        int take = node.val + l[1] + r[1];                     // children must be skipped
        int skip = Math.max(l[0], l[1]) + Math.max(r[0], r[1]); // children are free to choose
        return new int[]{take, skip};
    }

    // Binary Tree Cameras: a camera watches its node, its parent and its children
    static final int INF = 1_000_000;

    static int minCameras(TreeNode root) {
        int[] r = camDfs(root);
        return Math.min(r[1], r[2]);              // the root has no parent to cover it
    }

    // returns {node uncovered but subtree below covered,
    //          node covered by a child (no camera here),
    //          camera on this node}
    static int[] camDfs(TreeNode node) {
        if (node == null) return new int[]{INF, 0, INF}; // "covered, no camera": costs nothing
        int[] l = camDfs(node.left);
        int[] r = camDfs(node.right);
        int lCovered = Math.min(l[1], l[2]);
        int rCovered = Math.min(r[1], r[2]);
        int uncovered = lCovered + rCovered;                      // children covered, no camera
        int byChild = Math.min(l[2] + rCovered, r[2] + lCovered); // a child holds a camera
        int camera = 1 + min3(l) + min3(r);                       // children may be in any state
        return new int[]{uncovered, Math.min(byChild, INF), Math.min(camera, INF)};
    }

    static int min3(int[] s) { return Math.min(s[0], Math.min(s[1], s[2])); }

    public static void main(String[] args) {
        //      3
        //     / \
        //    2   3
        //     \    \
        //      3    1
        TreeNode t1 = new TreeNode(3,
                new TreeNode(2, null, new TreeNode(3)),
                new TreeNode(3, null, new TreeNode(1)));
        System.out.println(rob(t1));

        //        3
        //       / \
        //      4   5
        //     / \    \
        //    1   3    1
        TreeNode t2 = new TreeNode(3,
                new TreeNode(4, new TreeNode(1), new TreeNode(3)),
                new TreeNode(5, null, new TreeNode(1)));
        System.out.println(rob(t2));

        // a path of five nodes hanging to the left
        TreeNode path = new TreeNode(0, new TreeNode(0, new TreeNode(0,
                new TreeNode(0, new TreeNode(0), null), null), null), null);
        System.out.println(minCameras(path));
        System.out.println(minCameras(new TreeNode(0)));
    }
}
```

```output
7
9
2
1
```

The first tree gives 7 by robbing the root and the two grandchildren (3 + 3 + 1). A single node needs one camera, since nothing else can watch it.

`INF` is one million rather than `Integer.MAX_VALUE` because states are *added* together: `l[2] + rCovered` may add two infinities, and two copies of `Integer.MAX_VALUE` overflow to a negative number that would then win every `min`. Capping with `Math.min(…, INF)` keeps values from growing as they move up the tree. One million is safe because no real answer can exceed the number of nodes.

Each call does O(1) work and allocates a small array, so both methods take **O(n) time and O(h) stack space**. Returning an `int[]` is the simplest way to return several values in Java; a `record` (Java 16+) such as `record Rob(int take, int skip)` reads better in production code.

## The same idea you already know: diameter and maximum path sum

The diameter and maximum path sum problems in [[a6-diameter]] are tree DP with a twist worth naming. Each node *returns* one quantity to its parent — the longest (or most valuable) downward arm — but *records* a different quantity in a global answer: the best path that bends at this node, using two arms. The two differ because a path passing up through the parent can use only one arm of this node; a path that bends here uses both and never reaches the parent. Separating "what I return" from "what I record" is the same discipline as designing `take`/`skip`: return exactly what the parent can use.

## General trees: adjacency lists and no recursion

Many tree problems give the tree as `n` nodes and `n - 1` undirected edges, with no designated root. Two practical issues appear.

**Choosing a root and children.** Pick any node as the root (node 0 is usual). A node's children are its neighbours other than its parent. Tracking the parent prevents walking back up the edge you came from.

**Stack depth.** With `n` up to 10⁵ or 2 × 10⁵, the tree may be a long path, and a recursive DFS would need that many stack frames. Java's default thread stack is typically about 1 MB on 64-bit JVMs (the exact size depends on the platform and the `-Xss` setting), and a recursive method like this overflows it after somewhere between roughly ten thousand and a hundred thousand frames, depending on how large each frame is, throwing `StackOverflowError`. The robust fix is to avoid recursion entirely:

1. Run a breadth-first search from the root, recording the visiting `order` and each node's `parent`. BFS visits every parent before its children.
2. Process nodes in **reverse BFS order**. Every child then comes before its parent — a valid post-order for DP purposes — and each node adds its finished summary into its parent's accumulators.

The example below finds a maximum-weight **independent set** (no edge with both ends chosen) — the general-tree version of House Robber III, also known as the party-planning problem — and runs it on a path of 200,000 nodes, which recursion could not handle with default settings.

## Rerooting: an answer for every root

Some questions ask for a value *for every node as if it were the root*. *Sum of Distances in Tree*: for each node, return the sum of its distances to all other nodes.

**Naive approach.** Run a BFS from each node: n BFS runs of O(n) each, **O(n²)**. For 3 × 10⁴ nodes that is 9 × 10⁸ steps — too slow.

**Pass 1: one root, ordinary tree DP.** Root the tree at 0. For each node `u` compute `size(u)` (nodes in its subtree) and `down(u)` = the sum of distances from `u` to every node in its subtree. A child `c`'s subtree nodes are all one step further from `u` than from `c`, so

```text
down(u) = sum over children c of (down(c) + size(c))
```

and `down(0)` is the answer for node 0.

**Pass 2: move the root across one edge.** Suppose you know `ans(p)`, the full answer for `p`, and `u` is a child of `p`. Moving the viewpoint from `p` to `u` changes every distance by exactly one: the `size(u)` nodes in `u`'s subtree become one step **closer**, and the other `n - size(u)` nodes become one step **farther**. So

```text
ans(u) = ans(p) - size(u) + (n - size(u))
```

Process nodes in BFS order (parents first) and every node's answer follows from its parent's in O(1). Two O(n) passes replace n BFS runs.

This is **rerooting**: compute a rooted DP once, then derive how the answer changes when the root steps across an edge. The general recipe is "down" values from children (pass 1), "up" values from the parent's side (pass 2), and an answer that combines both. Here the change was a simple formula; in harder problems (for example, the longest path starting at each node) the "up" value must exclude the child's own contribution, which is done by keeping the best and second-best child values at each node.

Dry run on the tree with edges `0–1, 0–2, 2–3, 2–4, 2–5` (node 2 has three leaf children):

| Node | `size` | `down` | `ans` | How `ans` was computed |
|---|---|---|---|---|
| 0 | 6 | 1 + 7 = 8 | 8 | root: `down(0)` |
| 1 | 1 | 0 | 12 | `8 - 1 + 5` |
| 2 | 4 | 3 | 6 | `8 - 4 + 2` |
| 3, 4, 5 | 1 | 0 | 10 | `6 - 1 + 5` |

Check node 2 directly: it is one step from 0, 3, 4 and 5 and two steps from 1, so `1 + 1 + 1 + 1 + 2 = 6`.

```java title="GeneralTreeDp.java"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class GeneralTreeDp {

    static List<List<Integer>> buildTree(int n, int[][] edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            adj.get(e[1]).add(e[0]);
        }
        return adj;
    }

    // a root-first order and parent array, computed without recursion
    static int[] order, parent;

    static void rootAt(List<List<Integer>> adj, int root) {
        int n = adj.size();
        order = new int[n];
        parent = new int[n];
        Arrays.fill(parent, -1);
        int head = 0, tail = 0;
        order[tail++] = root;
        boolean[] seen = new boolean[n];
        seen[root] = true;
        while (head < tail) {                             // BFS: parents before children
            int u = order[head++];
            for (int v : adj.get(u)) {
                if (!seen[v]) {
                    seen[v] = true;
                    parent[v] = u;
                    order[tail++] = v;
                }
            }
        }
    }

    // maximum-weight independent set: no edge may have both ends chosen
    static long maxIndependentSet(List<List<Integer>> adj, int[] w) {
        rootAt(adj, 0);
        int n = adj.size();
        long[] take = new long[n], skip = new long[n];
        for (int i = n - 1; i >= 0; i--) {                // reverse BFS order: children first
            int u = order[i];
            take[u] += w[u];
            if (parent[u] >= 0) {                         // hand this node's summary to its parent
                int p = parent[u];
                take[p] += skip[u];
                skip[p] += Math.max(take[u], skip[u]);
            }
        }
        return Math.max(take[0], skip[0]);
    }

    // Sum of Distances in Tree: for every node, the sum of distances to all other nodes
    static long[] sumOfDistances(List<List<Integer>> adj) {
        rootAt(adj, 0);
        int n = adj.size();
        long[] size = new long[n], down = new long[n];   // down[u]: distances into u's subtree
        for (int i = n - 1; i >= 0; i--) {                // pass 1: children first
            int u = order[i];
            size[u] += 1;
            if (parent[u] >= 0) {
                size[parent[u]] += size[u];
                down[parent[u]] += down[u] + size[u];     // every node below u is one step further
            }
        }
        long[] ans = new long[n];
        ans[0] = down[0];
        for (int i = 1; i < n; i++) {                     // pass 2: parents first
            int u = order[i], p = parent[u];
            // moving the root from p to u: size[u] nodes get closer, n - size[u] get farther
            ans[u] = ans[p] - size[u] + (n - size[u]);
        }
        return ans;
    }

    public static void main(String[] args) {
        int[][] edges = {{0, 1}, {0, 2}, {2, 3}, {2, 4}, {2, 5}};
        List<List<Integer>> adj = buildTree(6, edges);
        System.out.println(maxIndependentSet(adj, new int[]{1, 1, 1, 1, 1, 1}));
        System.out.println(maxIndependentSet(adj, new int[]{5, 1, 1, 1, 1, 1}));
        System.out.println(maxIndependentSet(adj, new int[]{1, 1, 10, 1, 1, 1}));
        System.out.println(Arrays.toString(sumOfDistances(adj)));

        int n = 200_000;                                  // a path: recursion would overflow
        int[][] chain = new int[n - 1][];
        for (int i = 0; i + 1 < n; i++) chain[i] = new int[]{i, i + 1};
        int[] ones = new int[n];
        Arrays.fill(ones, 1);
        System.out.println(maxIndependentSet(buildTree(n, chain), ones));
    }
}
```

```output
4
8
11
[8, 12, 6, 10, 10, 10]
100000
```

With equal weights the best independent set is `{1, 3, 4, 5}` (4). Making node 0 worth 5 changes it to `{0, 3, 4, 5}` (8), and making node 2 worth 10 gives `{1, 2}` (11): the DP picks a different shape each time without any special cases. On the 200,000-node path the answer is every second node, 100,000.

In `maxIndependentSet`, `take[u]` and `skip[u]` start at zero and *accumulate* contributions from children as they are processed; by the time `u` itself is reached in reverse order, all its children have already added to it, so adding `w[u]` completes `take[u]`. Then `u` pushes its finished summary into its parent. Both programs take **O(n) time and O(n) memory**, with no recursion.

All four methods across the two programs were stress-tested against brute force on 3,000 random trees of up to 12 nodes: every subset of nodes for robbing, cameras and independent sets, and a BFS from every node for the distance sums. No mismatches were found.

```quiz
Q: Why does House Robber III return two values per node instead of one?
- [ ] To make the code run faster
- [x] Because the parent's choice depends on whether the child is robbed, and one number for "best in this subtree" hides that
- [ ] Because binary trees have two children
- [ ] Because the root needs a special case
> If the parent is robbed, it needs the child's best value with the child NOT robbed. A single "best" might come from robbing the child. Returning both conditional values gives the parent exactly what its decision needs. The count of values has nothing to do with the number of children.

Q: Tree DP on a tree with n nodes visits each node once. Why is no memo table needed, unlike in array DP?
- [ ] Because trees are always balanced
- [ ] Because post-order caches results automatically
- [x] Because each subtree is reached by exactly one path from the root, so no subproblem is ever requested twice
- [ ] Because the values fit in the call stack
> Memoization saves work when the same state is reached through different paths. In a tree, a subtree hangs below exactly one parent, so the recursion computes it once. If substructures were shared (a DAG), memoization would be needed again.

Q: In Sum of Distances in Tree, the root moves from p to its child u. Why does the answer change by -size(u) + (n - size(u))?
- [ ] Because u has size(u) children
- [x] The size(u) nodes in u's subtree each get one step closer, and the other n - size(u) nodes each get one step farther
- [ ] Because distances double when the root moves
- [ ] It is an approximation that is exact only for binary trees
> Every path from the new viewpoint either stays inside u's subtree (one edge shorter than from p) or must cross the edge u–p (one edge longer). The formula is exact for any tree.
```

## Recognising tree DP

Signals that a problem is tree DP:

- The input is a tree (or `n` nodes with `n - 1` edges and connectivity), and the question is an optimum, a count or a feasibility over **choices on nodes or edges** — select, colour, cover, cut, place.
- A choice at a node constrains its neighbours (no two adjacent, every node covered, parent and child must differ).
- The question asks for a value **for every node** — distances, farthest nodes, subtree properties when re-rooted — which suggests rerooting.

The design question is always the same: *what does the parent need to know about a child's subtree to make its own decision?* Typical answers are the node's own choice (taken or not, a colour, camera or not), a small number of coverage states, a depth or arm length, or a count indexed by some small parameter. When the parameter is a budget ("choose exactly `k` nodes"), the summary becomes an array indexed by `k`, and merging two children is a small knapsack; summing the merge costs carefully gives O(n · k) total — see [[a11-knapsack]] for the merging idea.

## In real systems

**Compilers.** Instruction selection for expression trees — choosing which machine instructions cover which parts of a parse tree — is classically done by tree DP: each node records the cheapest way to compute its subtree into each kind of location (a register, memory, an addressing mode). Tools such as the BURG family of code-generator generators are built on this.

**Networks and infrastructure.** Placing monitors, caches or replicas in a tree-shaped network (a CDN hierarchy, a corporate network, a power distribution tree) so that every node is covered at minimum cost is the cameras problem with weights.

**Phylogenetics.** The Fitch and Sankoff algorithms compute the minimum number (or cost) of mutations needed to explain observed DNA at the leaves of an evolutionary tree. Each node keeps the best cost for each possible ancestral base — a four-state tree DP, one state per nucleotide.

**Organisation and file hierarchies.** Aggregations such as "total size under each directory" or "headcount under each manager" are the simplest tree DP: one number per node, summed from children.

## Trade-offs and alternatives

| Approach | Time | Space | When to use |
|---|---|---|---|
| Brute force over node subsets | O(2ⁿ · n) | O(n) | Checking on tiny trees only |
| Recursive post-order DP | O(n · work per node) | O(h) stack | Binary trees in interviews; height is small |
| Iterative DP (reverse BFS order) | O(n · work per node) | O(n) | Large or path-like trees given as edges |
| Rerooting | O(n) for all roots | O(n) | An answer is needed for every node |
| Greedy from the leaves | O(n) | O(h) | Only with a proof, as for unweighted cameras |

Recursion is the clearest to write and explain, and interviewers expect it for binary trees. For general trees with large `n`, prefer the iterative order, or run the recursion on a thread with a larger stack (`new Thread(null, task, "dp", 1 << 26)`), which works but is less portable.

## Common mistakes

> [!MISTAKE] Reporting what you want instead of what the parent needs
> Returning only "the best value in my subtree" is the most common tree-DP bug. Before coding, write the parent's recurrence and list every fact about the child that it uses. Each fact becomes a returned value.

**Computing a node before its children.** Pre-order code reads child values that are not computed yet. Children first, always.

**Forgetting the parent in adjacency lists.** On an undirected edge list, every node's parent is also its neighbour. Iterating over all neighbours as "children" walks back up and recurses forever (or double-counts).

**Mixing the returned value and the global answer.** In diameter and path-sum problems, a node returns one arm but records a two-arm path. Returning the two-arm value lets a parent extend a path that already bends, which is not a path.

**Wrong base case for `null`.** For cameras, a `null` child must be "watched, no camera, cost 0". Treating it as "unwatched" forces a camera on every leaf's parent for no reason; treating it as "has a camera" makes leaves look watched.

**Overflow from infinity sentinels.** Adding two `Integer.MAX_VALUE` states overflows to a negative number. Use a moderate infinity and cap the results.

**Stack overflow on long paths.** Tests with 10⁵ nodes in a line are common. Use the iterative order.

## Interview perspective

Interviewers watch for two things: whether you can state a clean contract for the recursive function ("this returns X about the subtree, given condition Y"), and whether you separate what is returned from what is recorded.

> [!INTERVIEW] What a strong answer sounds like
> "Each call returns two numbers for its subtree: the best if this node is robbed and the best if it isn't. If I rob it, both children must be in their not-robbed state; if I don't, each child takes its better option. Null returns zeros. It's post-order, O(n) time, O(h) stack. If the tree could be a 10⁵-node path, I'd switch to an iterative order."

Questions to be ready for:

- **Why post-order?** The parent's value is a function of its children's values.
- **House Robber III with grandchildren instead of two states** — explain why it works and why two states are cleaner.
- **Binary Tree Cameras** — name the three states and the `null` base case; mention the greedy and why the DP generalises.
- **Maximum path sum** — return `node.val + max(0, best arm)`, record `node.val + left + right` with negative arms clamped to 0.
- **Sum of Distances in Tree** — derive the rerooting formula from "who gets closer, who gets farther".
- **"What if the tree has a million nodes?"** — iterative order, `long` accumulators.

## Practice

1. **House Robber III** — two-state, then rewrite with the grandchildren approach and compare.
2. **Diameter of Binary Tree** and **Binary Tree Maximum Path Sum** — identify what is returned and what is recorded.
3. **Binary Tree Cameras** — three states; stress-test against all subsets for `n ≤ 12`.
4. **Maximum-weight independent set** on an edge list with `n = 10⁵` — iterative.
5. **Longest Univalue Path** — an arm that only extends through equal values.
6. **Sum of Distances in Tree** — rerooting.
7. **Tree Diameter** on an edge list — solve it once with tree DP (best two arms per node) and once with the two-BFS method from [[a6-diameter]].
8. **Choose exactly k nodes** (any tree-knapsack problem) — merge children's arrays and analyse the total cost.

The DSA explorer lists the matching problems under this topic.

## Quick revision {#quick-revision}

- Subproblem = a subtree; subtrees do not overlap, so plain post-order recursion is the DP (no memo).
- Design the return value by listing what the parent's recurrence needs about each child.
- House Robber III: `take = val + skip(L) + skip(R)`, `skip = max(L) + max(R)`; `null` → (0, 0).
- Cameras: states uncovered / watched-by-child / camera; `null` = watched, no camera, 0; root answer excludes "uncovered".
- Return one thing, record another: diameter and maximum path sum.
- General trees: root anywhere, skip the parent, process reverse BFS order to avoid recursion depth.
- Rerooting: pass 1 computes `size` and `down` children-first; pass 2 moves the root across edges parents-first; Sum of Distances: `ans(u) = ans(p) - size(u) + (n - size(u))`.
- Time O(n) for constant-size states; space O(h) recursive or O(n) iterative.

## Key takeaways {#key-takeaways}

- Tree DP computes each subtree's summary once, in post-order, and the root's summary is the answer.
- The key design step is the summary: it must contain exactly what the parent needs to make its own decision, which often means several conditional values per node.
- Base cases for `null` children must be neutral: they should neither help nor force anything.
- Keep "returned to the parent" and "recorded as the global answer" separate when a path or structure can bend at a node.
- On large trees given as edge lists, use an explicit BFS order processed in reverse instead of recursion.
- Rerooting turns n separate computations into two O(n) passes by deriving how the answer changes when the root crosses one edge.
