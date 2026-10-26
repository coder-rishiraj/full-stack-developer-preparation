---
summary: The diameter of a tree is the longest path between any two nodes, and that path need not pass through the root. You will learn to find it in one O(n) pass by returning heights while recording the best path at each node, and to reuse the same pattern for maximum path sum, longest univalue path and diameters of general trees.
difficulty: intermediate
minutes: 50
objectives:
  - Explain why every tree path has a unique highest node and how that reduces the diameter to left height plus right height
  - Derive the O(n) one-pass algorithm from the O(n·h) naive approach and trace it on a tree whose diameter avoids the root
  - Separate the value a recursive call returns to its parent from the global answer it records
  - Adapt the pattern to Binary Tree Maximum Path Sum and Longest Univalue Path, including negative values
  - Find the diameter of a general tree with two breadth-first searches and state when that method is valid
---

## Introduction

The **diameter** of a tree is the length of the longest path between any two nodes. A **path** here is a sequence of nodes where each consecutive pair is joined by an edge and no node repeats; in a tree there is exactly one such path between any two nodes. Its **length** is usually measured in edges. LeetCode's *Diameter of Binary Tree* uses edges, so the diameter of a single node is 0 and of two connected nodes is 1.

The diameter answers "how far apart can two things in this hierarchy be?" If a tree describes a network, the diameter is the worst-case number of hops a message must travel. If it describes a phylogeny, it is the most distant pair of species. In interviews, the diameter problem is less important for itself than for the **pattern** it teaches: each node computes the best path that *bends* at that node, records it in a global answer, and returns something different — the best path that *continues upward* — to its parent. That split between "what I record" and "what I return" is the key to *Binary Tree Maximum Path Sum*, *Longest Univalue Path* and a large family of tree dynamic-programming problems ([[a11-tree-dp]]).

The main trap is assuming the longest path goes through the root. It often does, but not always, and the algorithm has to consider every node as a possible bend point.

## Before you start

- **Height and depth** — the bottom-up recurrence `1 + max(left, right)` and the edge-versus-node conventions. See [[a6-height-depth]].
- **Tree DFS** — postorder, and returning one value while recording another. See [[a6-dfs]].
- **Binary trees** — paths, subtrees, leaves. See [[a6-binary-trees]].

## The intuition

Hold a tree up by its root and look at any path in it. Follow the path from one end to the other: it climbs up towards the root for a while, reaches a highest point, and then goes down. It cannot go up, down and up again, because going back up would mean returning to a node already visited — every node has only one parent. So **every path has exactly one highest node**, called its **apex** (or peak). A path might go down only one side of its apex — for example, from the apex straight down to a leaf — but it can never pass through the apex's parent.

That observation splits the problem. The longest path overall is the longest path among those whose apex is node `v`, for some `v`. And the longest path with apex `v` is easy to describe: go as deep as possible into `v`'s left subtree, and as deep as possible into its right subtree, and join the two through `v`.

How long is that? If `L` is the number of nodes on the longest downward path in the left subtree (its height counting nodes, with `null` = 0), then going from `v` down to the bottom of the left subtree takes `L` edges — one edge into the left child, then `L - 1` more. Similarly the right side takes `R` edges. So the longest path with apex `v` has **`L + R` edges**. If `v` has no left child, `L = 0` and the path only goes down the right, which is still correct.

The diameter is therefore the maximum of `height(v.left) + height(v.right)` over **all** nodes `v`, with heights counted in nodes.

## A diameter that avoids the root

Consider this tree:

```text
            1
           /
          2
         / \
        3   4
       /     \
      5       6
     /
    7
```

At the root `1`, the left subtree has height 4 (path `2 → 3 → 5 → 7`) and the right subtree is empty, so the best path with apex `1` is `1 → 2 → 3 → 5 → 7`, with 4 edges. But at node `2`, the left height is 3 (`3 → 5 → 7`) and the right height is 2 (`4 → 6`), giving a path `7 → 5 → 3 → 2 → 4 → 6` with **5 edges**. That is the diameter, and it never touches the root. Any algorithm that only computes `height(root.left) + height(root.right)` returns 4 and is wrong.

## From the naive approach to one pass

The definition leads straight to a naive algorithm: visit every node, compute the heights of its two subtrees with a height function, and keep the largest sum.

```java
static int diameterNaive(TreeNode node) {
    if (node == null) return 0;
    int throughHere = height(node.left) + height(node.right);
    return Math.max(throughHere, Math.max(diameterNaive(node.left),
                                          diameterNaive(node.right)));
}
```

It is correct, but each call to `height` walks the whole subtree, and `height` is called at every node, so each node is measured once for each of its ancestors. The total work is the sum of all node depths — O(n · h). That is O(n log n) on a balanced tree and O(n²) on a chain, where depths add up to about `n² / 2`.

The waste is that the heights a parent needs are exactly the heights its children already computed. A postorder DFS that **returns** the height of each subtree gives every node both children's heights for free. At that moment, the node can compute `L + R`, the best path bending at itself, in O(1). It records that in a running maximum, then returns `1 + max(L, R)` — its own height — to its parent.

```java
int best = 0;                                   // longest path seen so far, in edges

int height(TreeNode node) {                     // returns height in nodes
    if (node == null) return 0;
    int left = height(node.left);
    int right = height(node.right);
    best = Math.max(best, left + right);        // record: best path bending here
    return 1 + Math.max(left, right);           // return: best path going up
}
// height(root); answer = best
```

Two different quantities live in this function, and keeping them apart is the whole lesson:

- The **returned value** is the longest *downward* path starting at this node — one arm. A parent can extend one arm upward, but not a bent path: a bent path already uses both of this node's children, so adding the parent would give the node three neighbours on the path, which is impossible.
- The **recorded value** `left + right` is the longest path with this node as its apex — two arms joined. It is a candidate for the final answer, but it cannot be extended, so it goes into `best` instead of being returned.

Returning `left + right` instead of `1 + max(left, right)` is the most common bug in this problem. The parent would then treat a bent path as if it were a straight arm and overcount.

## Worked example

```java title="Diameter.java"
public class Diameter {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
        TreeNode(int val, TreeNode left, TreeNode right) {
            this.val = val; this.left = left; this.right = right;
        }
    }

    // ---- Naive: O(n * h) ----
    static int height(TreeNode node) {
        if (node == null) return 0;
        return 1 + Math.max(height(node.left), height(node.right));
    }

    static int diameterNaive(TreeNode node) {
        if (node == null) return 0;
        int throughHere = height(node.left) + height(node.right);
        return Math.max(throughHere, Math.max(diameterNaive(node.left),
                                              diameterNaive(node.right)));
    }

    // ---- One pass: O(n), no static state ----
    static int diameter(TreeNode root) {
        int[] best = {0};                     // holder the recursion can update
        heightAndRecord(root, best);
        return best[0];
    }

    static int heightAndRecord(TreeNode node, int[] best) {
        if (node == null) return 0;
        int left = heightAndRecord(node.left, best);
        int right = heightAndRecord(node.right, best);
        best[0] = Math.max(best[0], left + right);   // two arms: a candidate answer
        return 1 + Math.max(left, right);            // one arm: what the parent can use
    }

    public static void main(String[] args) {
        // [1,2,3,4,5]: the diameter 4-2-1-3 passes through the root
        TreeNode small = new TreeNode(1,
                new TreeNode(2, new TreeNode(4), new TreeNode(5)), new TreeNode(3));

        // The tree from the lesson: the diameter 7-5-3-2-4-6 avoids the root
        TreeNode offRoot = new TreeNode(1,
                new TreeNode(2,
                        new TreeNode(3, new TreeNode(5, new TreeNode(7), null), null),
                        new TreeNode(4, null, new TreeNode(6))),
                null);

        TreeNode single = new TreeNode(1);

        System.out.println("small:    " + diameter(small) + " (naive " + diameterNaive(small) + ")");
        System.out.println("off-root: " + diameter(offRoot) + " (naive " + diameterNaive(offRoot) + ")");
        System.out.println("root only sees: " + (height(offRoot.left) + height(offRoot.right)));
        System.out.println("single:   " + diameter(single));
        System.out.println("empty:    " + diameter(null));
    }
}
```

```output
small:    3 (naive 3)
off-root: 5 (naive 5)
root only sees: 4
single:   0
empty:    0
```

The `int[] best` holder replaces a `static` field. Java passes the array reference by value, so every call updates the same element, but the state is created fresh in each call to `diameter` and cannot leak from one input to the next — a real problem with `static` fields when a test harness reuses the class. A field in a solver object, or returning a record with both the height and the best path, works equally well.

### Dry run

Trace the one-pass algorithm on the off-root tree. Each row is a node, in the order its call finishes (postorder).

| Node | `left` (height) | `right` (height) | `left + right` | `best` after | Returns |
|---|---|---|---|---|---|
| 7 | 0 | 0 | 0 | 0 | 1 |
| 5 | 1 | 0 | 1 | 1 | 2 |
| 3 | 2 | 0 | 2 | 2 | 3 |
| 6 | 0 | 0 | 0 | 2 | 1 |
| 4 | 0 | 1 | 1 | 2 | 2 |
| 2 | 3 | 2 | **5** | 5 | 4 |
| 1 | 4 | 0 | 4 | 5 | 5 |

The record is set at node `2` and survives the root's smaller candidate of 4. Node `2` returns 4, not 5, to the root: the root can only extend one of `2`'s arms, and the longer arm `2 → 3 → 5 → 7` has 4 nodes.

**Edges or nodes?** This algorithm returns the diameter in edges. If a problem asks for the number of *nodes* on the longest path, add one to the answer (for a non-empty tree): a path with `k` edges has `k + 1` nodes.

## Complexity

**Time.** The one-pass version makes one call per node and one per `null` child, and each call does O(1) work beyond its recursive calls, so it is **O(n)**. The naive version is O(n · h), as derived above.

**Space.** The recursion stack holds the current root-to-node path: **O(h)**, which is O(log n) for a balanced tree and O(n) for a chain. For trees deep enough to overflow the stack, the same computation can be done iteratively with a postorder traversal using an explicit stack and a map from node to height ([[a6-dfs]]).

## The same pattern: path sums and univalue paths

Once you see "return one arm, record two arms", several harder problems become small changes to the diameter code.

### Binary Tree Maximum Path Sum

Instead of counting edges, each node has a value (possibly negative), and you want the path with the largest **sum** of values. The path must contain at least one node, may start and end anywhere, and — just as before — has a unique apex.

Define the **gain** of a node as the largest sum of a downward path that starts at that node: the node's value plus the better of its two children's gains. The twist is negative values: if a child's best downward path has a negative sum, including it only makes things worse, so the node should treat that side as 0 — that is, not extend into it at all. That is the `Math.max(0, …)` in the code below. The best path bending at a node is `node.val + leftGain + rightGain`, recorded globally; the value returned upward is `node.val + max(leftGain, rightGain)`, one arm.

The record must start at `Integer.MIN_VALUE`, not 0. If every value is negative, the answer is the single largest (least negative) node, which is negative; starting at 0 would wrongly report a path of sum 0 that does not exist.

### Longest Univalue Path

Find the longest path, in edges, in which every node has the same value. A node can extend an arm into a child only if the child has the **same value**; otherwise that arm has length 0 at this node. The record is `leftArm + rightArm` and the return is `max(leftArm, rightArm)` — the diameter pattern with a condition attached to each arm.

```java title="PathPatterns.java"
public class PathPatterns {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
        TreeNode(int val, TreeNode left, TreeNode right) {
            this.val = val; this.left = left; this.right = right;
        }
    }

    // ---- Binary Tree Maximum Path Sum ----
    static int maxPathSum(TreeNode root) {
        int[] best = {Integer.MIN_VALUE};      // MIN_VALUE: the answer may be negative
        gain(root, best);
        return best[0];
    }

    static int gain(TreeNode node, int[] best) {
        if (node == null) return 0;
        int left = Math.max(0, gain(node.left, best));    // drop a harmful arm
        int right = Math.max(0, gain(node.right, best));
        best[0] = Math.max(best[0], node.val + left + right);  // path bending here
        return node.val + Math.max(left, right);              // one arm upward
    }

    // ---- Longest Univalue Path (edges) ----
    static int longestUnivalue(TreeNode root) {
        int[] best = {0};
        arm(root, best);
        return best[0];
    }

    /** Longest downward same-value path starting at node, in edges. */
    static int arm(TreeNode node, int[] best) {
        if (node == null) return 0;
        int left = arm(node.left, best);
        int right = arm(node.right, best);
        int leftArm = (node.left != null && node.left.val == node.val) ? left + 1 : 0;
        int rightArm = (node.right != null && node.right.val == node.val) ? right + 1 : 0;
        best[0] = Math.max(best[0], leftArm + rightArm);
        return Math.max(leftArm, rightArm);
    }

    public static void main(String[] args) {
        //     -10
        //     /  \
        //    9    20
        //        /  \
        //       15   7
        TreeNode t1 = new TreeNode(-10,
                new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
        System.out.println("max path sum:          " + maxPathSum(t1));

        TreeNode allNegative = new TreeNode(-3, new TreeNode(-1), new TreeNode(-2));
        System.out.println("max path sum (all -):  " + maxPathSum(allNegative));

        //       5
        //      / \
        //     4   5
        //    / \   \
        //   1   1   5
        TreeNode t2 = new TreeNode(5,
                new TreeNode(4, new TreeNode(1), new TreeNode(1)),
                new TreeNode(5, null, new TreeNode(5)));
        System.out.println("longest univalue path: " + longestUnivalue(t2));
    }
}
```

```output
max path sum:          42
max path sum (all -):  -1
longest univalue path: 2
```

Trace the first tree. Leaves `9`, `15` and `7` have gains 9, 15 and 7, and each records itself. At `20`, both arms are positive: it records `20 + 15 + 7 = 42` and returns `20 + 15 = 35`. At the root `-10`, it records `-10 + 9 + 35 = 34`, which is less than 42, and the answer stays 42 — the path `15 → 20 → 7`, which does not include the root. For the all-negative tree, every child gain is clipped to 0, so each node records just its own value, and the best is `-1`. The univalue answer is 2: the path `5 → 5 → 5` down the right side.

| Problem | Arm returned to parent | Candidate recorded at node | Initial best |
|---|---|---|---|
| Diameter (edges) | `1 + max(L, R)` (height in nodes) | `L + R` | 0 |
| Maximum path sum | `val + max(L, R)`, with `L, R` clipped at 0 | `val + L + R` | `Integer.MIN_VALUE` |
| Longest univalue path | `max(leftArm, rightArm)`, arms 0 unless values match | `leftArm + rightArm` | 0 |

## Beyond binary trees

### N-ary trees

When a node can have any number of children, the longest path bending at a node uses its **two tallest** children. Track the largest and second-largest child heights in one loop; record their sum and return one plus the largest. The time stays O(n). See [[a6-nary-trees]].

### Trees given as edges: two breadth-first searches

Graph problems often describe a tree as `n` nodes and `n - 1` undirected edges, with no root at all ([[a8-graph-representation]]). There is an elegant alternative for this setting:

1. From **any** node `s`, run BFS and find the farthest node `u`.
2. From `u`, run BFS again and find the farthest node `v`. The distance from `u` to `v` is the diameter.

Why does this work? The key fact is that the farthest node from any starting point is always an endpoint of *some* longest path. Intuitively, if `u` were not an endpoint of a diameter, you could take a diameter, connect it to `u` through the tree's unique paths, and show that one end of the diameter would be at least as far from `s` as `u`, contradicting the choice of `u`. Once you stand at an endpoint of a diameter, the farthest node from there is the other endpoint.

```java title="TreeDiameterTwoBfs.java"
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Queue;

public class TreeDiameterTwoBfs {
    /** Returns {farthest node, its distance} from start. */
    static int[] farthest(List<List<Integer>> adj, int start) {
        int[] dist = new int[adj.size()];
        Arrays.fill(dist, -1);                 // -1 = not visited (graph BFS needs this)
        Queue<Integer> queue = new ArrayDeque<>();
        queue.offer(start);
        dist[start] = 0;
        int far = start;
        while (!queue.isEmpty()) {
            int u = queue.poll();
            if (dist[u] > dist[far]) far = u;
            for (int v : adj.get(u)) {
                if (dist[v] == -1) {
                    dist[v] = dist[u] + 1;
                    queue.offer(v);
                }
            }
        }
        return new int[] {far, dist[far]};
    }

    public static void main(String[] args) {
        int n = 7;
        int[][] edges = {{0, 1}, {1, 2}, {2, 3}, {1, 4}, {4, 5}, {5, 6}};
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {                // undirected: add both directions
            adj.get(e[0]).add(e[1]);
            adj.get(e[1]).add(e[0]);
        }
        int[] first = farthest(adj, 0);
        int[] second = farthest(adj, first[0]);
        System.out.println("first BFS from 0 reaches " + first[0] + " at distance " + first[1]);
        System.out.println("diameter = " + second[1] + " (between " + first[0]
                + " and " + second[0] + ")");
    }
}
```

```output
first BFS from 0 reaches 6 at distance 4
diameter = 5 (between 6 and 3)
```

Starting at node 0, the farthest node is 6 (path 0–1–4–5–6). From 6, the farthest is 3 (path 6–5–4–1–2–3), five edges, which is the diameter. Notice that this BFS **does** keep a visited array: the input is an undirected adjacency list, so every edge appears in both directions and the search would otherwise walk straight back to the node it came from ([[a8-bfs]]).

The two-pass method is O(n) and needs no recursion. It is valid for trees, including trees whose edges have non-negative weights (with a weighted search in place of BFS). It is **not** valid for general graphs with cycles: the longest simple path in a general graph is an NP-hard problem, and "diameter" in graph theory usually means something different — the greatest *shortest-path* distance between any two nodes.

## In real systems

**Network topologies.** When a network is arranged as a tree — for example, the loop-free topology that the Spanning Tree Protocol builds over Ethernet switches, or a hierarchy of relay servers — its diameter is the worst-case number of hops between two endpoints, which bounds latency and how long a broadcast takes to reach everyone.

**Choosing a centre.** The **centre** of a tree, the node that minimises the greatest distance to every other node, lies at the middle of a diameter. Placing a coordinator, a cache or the root of a broadcast tree at the centre minimises the worst-case distance, and finding the diameter is the first step.

**Evolutionary biology.** Phylogenetic trees connect species by inferred ancestry, with edge weights for evolutionary distance; the weighted diameter identifies the most divergent pair. Because the edges have non-negative weights and there are no cycles, the two-search method applies.

## Trade-offs and alternatives

| Approach | Time | Space | Works on | Notes |
|---|---|---|---|---|
| Naive: height at every node | O(n · h), up to O(n²) | O(h) | Rooted trees | Easy to write; recomputes heights |
| One-pass postorder (record two arms, return one) | O(n) | O(h) | Rooted binary or n-ary trees | Standard interview answer; extends to path sums |
| Two BFS / DFS passes | O(n) | O(n) | Unrooted trees as edge lists; non-negative weights | No recursion needed; not for graphs with cycles |

The one-pass postorder method is the answer interviewers expect for a binary tree. The two-pass method is the better fit when the input is an edge list and there is no natural root, or when you also want the endpoints of the diameter.

## Common mistakes

> [!MISTAKE] Returning `L + R` from the recursive function
> The parent needs the longest *straight* arm below it, which is `1 + max(L, R)`. A bent path cannot be extended upward, because the node would then have three neighbours on the path. Record `L + R` in the global answer and return one arm.

**Only checking the root.** `height(root.left) + height(root.right)` is the best path whose apex is the root. The diameter can bend at any node, as the off-root example shows. Every node must be considered.

**Off by one between edges and nodes.** With node-counting heights (`null` = 0), `L + R` counts edges. If the problem wants nodes on the path, add one. If your height function counts edges (`null` = -1), the path through a node is `L + R + 2`.

**Starting maximum path sum at 0.** When all values are negative, the correct answer is the largest single value, which is negative. Initialise the record to `Integer.MIN_VALUE`, and still let every node record `node.val + left + right` with the clipped arms.

**Clipping the wrong thing.** In maximum path sum, clip each *child's gain* at 0, never the node's own value: a path must include its apex, so the apex's value is always counted.

**Leaking state between inputs.** A `static int best` keeps its value from the last tree. Reset it in the entry method, or use a holder array, an instance field or a returned record.

## Interview perspective

Interviewers use diameter to test whether you can hold two quantities in one recursion. The strongest answers explain the apex argument before writing code.

> [!INTERVIEW] Explaining the one-pass solution
> "Every path has a unique highest node. The longest path bending at a node is the left height plus the right height, so the diameter is the max of that over all nodes. I'll do a postorder DFS that returns height, because a parent can only extend one arm, and at each node record left plus right in a running best. That's O(n) time and O(h) space."

Questions to be ready for:

- **Does the diameter pass through the root?** Not necessarily; give a tree where it does not.
- **Why not return `L + R`?** Because a parent can extend only a single downward arm.
- **Edges or nodes?** State the convention; nodes = edges + 1.
- **Maximum path sum with negative values?** Clip child gains at 0; initialise the best to `Integer.MIN_VALUE`.
- **Diameter of a tree given as an edge list?** Two BFS passes: farthest node from anywhere, then farthest from that. Explain why it fails on graphs with cycles.
- **Follow-up: return the path itself.** Record the node where the best `L + R` occurs, then walk down the taller side of each subtree from there, or keep parent pointers from the two-BFS method.

```quiz
Q: In the one-pass diameter algorithm, what should height(node) return to its parent?
- [ ] left + right, the longest path through the node
- [x] 1 + max(left, right), the longest downward path from the node
- [ ] max(best, left + right)
- [ ] left + right + 1
> The parent can extend only one straight arm upward; a path that already uses both of this node's children cannot also continue to the parent. left + right is recorded as a candidate answer, but returning it would make ancestors overcount.

Q: The root of a tree has a left subtree of height 4 (counting nodes) and no right subtree, and somewhere in the left subtree a node has subtrees of heights 3 and 3. What is the diameter in edges?
- [ ] 4
- [ ] 5
- [x] 6
- [ ] 7
> The path bending at the root has 4 + 0 = 4 edges, but the inner node offers 3 + 3 = 6 edges. The diameter is the maximum over all nodes, so it is 6, and that path avoids the root.

Q: Why is the best value in Binary Tree Maximum Path Sum initialised to Integer.MIN_VALUE instead of 0?
- [ ] To avoid integer overflow
- [x] Because if every node is negative the true answer is negative, and 0 would report a path that does not exist
- [ ] Because Java requires it for static fields
- [ ] Because 0 would make the recursion loop forever
> A path must contain at least one node. When all values are negative, the best path is the single largest value, for example -1. Starting at 0 would return 0, which no path achieves. Clipping child gains at 0 is still correct, because it only means "do not extend into that side".

Q: For which input is the "two BFS passes" diameter method valid?
- [ ] Any undirected graph, including ones with cycles
- [x] A tree given as an undirected edge list, possibly with non-negative edge weights
- [ ] A directed graph with negative edge weights
- [ ] Only perfect binary trees
> The farthest node from any start is an endpoint of a longest path only when there is a unique path between every pair of nodes and no negative weights — that is, in a tree. In graphs with cycles the longest simple path is NP-hard, and the method can give wrong answers.
```

## Practice

1. **Diameter of Binary Tree.** Write the naive version, then the one-pass version, and count height calls on a chain of 1,000 nodes to see the difference.
2. **Return the diameter path.** Modify the one-pass solution to output the nodes on a longest path.
3. **Binary Tree Maximum Path Sum.** Test it on an all-negative tree and on a tree whose best path avoids the root.
4. **Longest Univalue Path.** Explain why a child's arm counts only when its value matches.
5. **Diameter of N-ary Tree.** Track the two tallest child heights at each node.
6. **Tree Diameter (edge list).** Implement the two-BFS method, then the one-pass method after choosing node 0 as the root, and confirm they agree.

The DSA explorer lists these under Trees; start with *Diameter of Binary Tree* and *Binary Tree Maximum Path Sum*.

## Quick revision {#quick-revision}

- Diameter: longest path between any two nodes, usually in edges; single node → 0, empty → 0.
- Every path has a unique apex; the longest path with apex `v` is `height(v.left) + height(v.right)` (heights in nodes, `null` = 0).
- The diameter may not pass through the root — check every node.
- One pass: postorder; record `best = max(best, L + R)`; return `1 + max(L, R)`. O(n) time, O(h) space.
- Naive (height at every node) is O(n · h): O(n log n) balanced, O(n²) for a chain.
- Nodes on the path = edges + 1.
- Max path sum: `gain = val + max(L, R)` with `L, R = max(0, childGain)`; record `val + L + R`; start best at `Integer.MIN_VALUE`.
- Longest univalue path: an arm extends only into a child with the same value.
- N-ary: combine the two tallest children.
- Unrooted tree as edges: BFS from anywhere to the farthest `u`, then BFS from `u`; valid for trees with non-negative weights, not for graphs with cycles.
- Avoid leaking `static` state: use a holder array, instance field or record.

## Key takeaways {#key-takeaways}

- Every path in a tree bends at exactly one highest node, so the diameter is the best `left height + right height` over all nodes.
- Compute it in one postorder pass: return the longest single arm to the parent and record the two-arm path in a separate answer.
- Keeping "what I return" separate from "what I record" is a reusable pattern for maximum path sum, univalue paths and tree dynamic programming.
- The diameter can avoid the root, and the edge-versus-node convention changes the answer by one, so check both explicitly.
- With negative values, drop harmful arms by clipping child gains at zero, and start the record at the smallest possible value.
- For unrooted trees given as edge lists, two breadth-first searches find the diameter in O(n), but the trick does not extend to graphs with cycles.
