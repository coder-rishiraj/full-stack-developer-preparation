---
summary: Height and depth measure how tall a tree is and how far down a node sits, and they decide the cost of nearly every tree operation. You will learn both definitions and their edge-versus-node conventions, compute maximum and minimum depth correctly, and check whether a tree is balanced in a single O(n) pass.
difficulty: beginner
minutes: 45
objectives:
  - Define height and depth, and state whether a formula counts edges or nodes
  - Compute maximum depth bottom-up, top-down and iteratively, and trace the recursion on a concrete tree
  - Explain why 1 + min(left, right) is wrong for minimum depth and write correct DFS and BFS versions
  - Check whether a tree is height-balanced in one O(n) pass and derive why the naive check is slower
  - Relate height to the O(h) cost of tree operations and to recursion depth
---

## Introduction

Two numbers describe where things are in a tree. The **depth** of a node says how far it is below the root. The **height** of a node says how far the deepest point below it is. The height of the whole tree — the height of its root — says how tall the tree is.

These sound like bookkeeping, but they control performance. Searching a binary search tree costs O(h), where `h` is the height ([[a6-bst]]). A recursive traversal uses O(h) stack space, and a very tall tree overflows the stack ([[a6-dfs]]). Self-balancing trees such as AVL trees exist entirely to keep the height near `log₂ n`. So computing height, recognising when it is small or large, and checking whether a tree is balanced are basic skills, and interviewers ask for them directly: *Maximum Depth of Binary Tree*, *Minimum Depth of Binary Tree* and *Balanced Binary Tree* are among the most common first tree questions.

They are also the first place where two classic traps appear. The first is the off-by-one confusion between counting edges and counting nodes. The second is a minimum-depth formula that looks obviously right and is wrong. This lesson handles both explicitly, and the height computation it builds is reused directly in [[a6-diameter]].

## Before you start

- **Binary trees** — nodes, leaves, subtrees, levels. See [[a6-binary-trees]].
- **Tree DFS** — bottom-up return values versus top-down parameters. See [[a6-dfs]].
- **Tree BFS** — the queue and the level-size snapshot, used for minimum depth. See [[a6-bfs]].

## The intuition

Think of a tree as a building that hangs downward from its roof. The root is the roof. The **depth** of a node is which floor it is on, counting down from the roof: the roof is floor 0, the floor below is 1, and so on. Depth depends only on the path *above* a node, so you work it out going down: a child is one floor below its parent.

The **height** of a node is how many floors there are below it, down to the deepest basement in its part of the building. Height depends only on what is *below* a node, so you work it out going up: a leaf has nothing below it, and a parent is one floor above the taller of its children.

That difference in direction is the main idea of the lesson. **Depth flows down** and is computed top-down, by passing a number to the children. **Height flows up** and is computed bottom-up, by combining the children's answers. The height of the tree equals the greatest depth of any node, so either direction can find it.

## Definitions and conventions

Take this tree:

```text
          3
        /   \
       9     20
            /  \
           15   7
```

- The **depth** of a node is the number of edges from the root to it. `3` has depth 0, `9` and `20` have depth 1, `15` and `7` have depth 2.
- The **height** of a node is the number of edges on the longest path from it down to a leaf. Leaves (`9`, `15`, `7`) have height 0, `20` has height 1, and `3` has height 2.
- The **height of the tree** is the height of the root: 2.

That is the **edge-counting** convention used by most textbooks. Many problems instead count **nodes** on the path. LeetCode's *Maximum Depth of Binary Tree* defines the maximum depth as "the number of nodes along the longest path from the root down to the farthest leaf", so it would answer 3 for this tree. Both are fine; they differ by exactly one for any non-empty tree. What matters is the base case:

| Convention | Empty tree (`null`) | Single node | This tree | Recurrence |
|---|---|---|---|---|
| Count edges | -1 | 0 | 2 | `h = 1 + max(hL, hR)` |
| Count nodes (LeetCode "depth") | 0 | 1 | 3 | `h = 1 + max(hL, hR)` |

The recurrence is the same in both conventions; only the value for `null` differs. Returning `-1` for `null` makes a leaf come out as `1 + max(-1, -1) = 0` edges, and returning `0` makes it `1 + max(0, 0) = 1` node. When a problem says "depth" or "height", read its examples to see which it means, and say your choice aloud in an interview.

This lesson uses "maximum depth" for the node-counting LeetCode quantity and "height" for edge counting, matching the names you will see in problems.

## Maximum depth, three ways

### Bottom-up recursion

The tallest path from a node goes through whichever child has the taller subtree. So the maximum depth of a tree is one (for the root) plus the larger of its two subtrees' maximum depths, and the empty tree has depth 0:

```java
static int maxDepth(TreeNode node) {
    if (node == null) return 0;
    return 1 + Math.max(maxDepth(node.left), maxDepth(node.right));
}
```

This is a postorder computation: a node's answer needs both children's answers first. Trace it on the tree above; each row is one call, in the order calls return:

| Call | Left answer | Right answer | Returns |
|---|---|---|---|
| `maxDepth(9)` | 0 | 0 | 1 |
| `maxDepth(15)` | 0 | 0 | 1 |
| `maxDepth(7)` | 0 | 0 | 1 |
| `maxDepth(20)` | 1 | 1 | 2 |
| `maxDepth(3)` | 1 | 2 | 3 |

**Time** is O(n): one call per node plus one per `null` child, each doing O(1) work. **Space** is O(h) for the call stack — the very quantity being computed. On a chain of a million nodes that is a million frames, which overflows Java's default stack; the iterative versions below avoid that.

### Top-down recursion

Alternatively, pass each node its own depth and keep the largest depth seen at any node. This is the "depth flows down" view:

```java
static int best;
static void visit(TreeNode node, int depth) {
    if (node == null) return;
    best = Math.max(best, depth);          // depth of this node, counting nodes
    visit(node.left, depth + 1);
    visit(node.right, depth + 1);
}
// best = 0; visit(root, 1);
```

Both versions visit every node once. The bottom-up version is usually preferred because it returns its answer without shared state, but the top-down version generalises naturally to questions such as "list every node with its depth".

### Iteratively, by counting levels

BFS processes the tree one level at a time ([[a6-bfs]]), so the maximum depth is simply the number of levels. With the level-size snapshot, count how many times the outer loop runs:

```java
static int maxDepthBfs(TreeNode root) {
    if (root == null) return 0;
    Queue<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);
    int levels = 0;
    while (!queue.isEmpty()) {
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        levels++;                          // one full level processed
    }
    return levels;
}
```

This uses no recursion, so it cannot overflow the call stack. Its queue holds up to one level, O(w), where `w` is the maximum width. An iterative DFS with a stack of `(node, depth)` pairs is the other option, using O(h) heap memory instead.

## The depth of a particular node

Depth is a property of one node's position, so it is computed top-down: the root has depth 0, and a child's depth is its parent's plus one. To find the depth of a node with a given value in a general binary tree, search for it while passing the depth along:

```java
static int depthOf(TreeNode node, int target, int depth) {
    if (node == null) return -1;                       // not in this subtree
    if (node.val == target) return depth;
    int left = depthOf(node.left, target, depth + 1);
    if (left != -1) return left;                       // found on the left
    return depthOf(node.right, target, depth + 1);
}
// depthOf(root, 15, 0) returns 2
```

In a general tree this is O(n), because the target could be anywhere. In a binary search tree you would instead walk straight down by comparisons in O(h). If you need the depth of *many* nodes, one traversal that records every node's depth in a map is O(n) in total, rather than O(n) per query.

## Minimum depth and the leaf trap

The **minimum depth** is the number of nodes on the *shortest* path from the root down to a **leaf** — a node with no children. It seems that you could take the maximum-depth formula and replace `max` with `min`:

```java
static int minDepthWrong(TreeNode node) {
    if (node == null) return 0;
    return 1 + Math.min(minDepthWrong(node.left), minDepthWrong(node.right));
}
```

Try it on a tree whose root has only a right child: `1 → 2 → 3`, each node with only a right child. The only leaf is `3`, at depth 3. But at the root, the missing left child returns 0, `min(0, 2) = 0`, and the function returns `1`, as if the root were a leaf. **A missing child is not a path to a leaf.** The `max` version never had this problem, because an empty side never wins a maximum against a real one; with `min`, the empty side always wins.

The fix is to only take the minimum over children that exist:

```java
static int minDepth(TreeNode node) {
    if (node == null) return 0;
    if (node.left == null) return 1 + minDepth(node.right);   // only one way down
    if (node.right == null) return 1 + minDepth(node.left);
    return 1 + Math.min(minDepth(node.left), minDepth(node.right));
}
```

When a node has one child, the shortest path to a leaf must go through that child. Only when both children exist do we choose between them. A leaf falls into the first line with `node.right == null`, which returns `1 + 0 = 1` — correct.

**BFS is often the better tool for minimum depth.** BFS polls nodes in order of depth, so the first leaf it meets is a shallowest one and it can stop immediately. The DFS above always explores the whole tree: on a tree with a leaf one step below the root and a million nodes hanging off the other side, BFS touches a handful of nodes while DFS touches all of them. Both are O(n) in the worst case, but BFS's early stop often matters in practice. The BFS version is in [[a6-bfs]].

## Balanced binary tree

A binary tree is **height-balanced** if, at **every** node, the heights of the left and right subtrees differ by at most one. This is the definition used by AVL trees and by the *Balanced Binary Tree* problem. Checking only the root is not enough: a root can have two subtrees of equal height, each of which is a lopsided chain.

### The naive check

The definition translates directly into code that calls a height function at every node:

```java
static boolean isBalancedNaive(TreeNode node) {
    if (node == null) return true;
    return Math.abs(maxDepth(node.left) - maxDepth(node.right)) <= 1
            && isBalancedNaive(node.left) && isBalancedNaive(node.right);
}
```

It is correct, but it does repeated work. `maxDepth` walks the whole subtree, and it is called again at every descendant, so each node's height is recomputed once for each of its ancestors that the check visits. The total work is the sum of all visited nodes' depths, which is O(n · h): O(n log n) for a balanced tree, and up to O(n²) for tall trees when the check does not stop early.

### The one-pass check

The fix is the same idea as in [[a6-dfs]]: compute heights bottom-up once, and let each node check its own balance using the heights its children already returned. One extra trick makes it clean. The function returns the subtree's height when the subtree is balanced, and the sentinel `-1` when it is not. Since a real height (counting nodes) is never negative, `-1` cannot be confused with an answer, and once any subtree reports `-1`, every ancestor passes it straight up without further work.

```java
static int checkedHeight(TreeNode node) {     // height in nodes, or -1 if unbalanced
    if (node == null) return 0;
    int left = checkedHeight(node.left);
    if (left == -1) return -1;                // stop early: already unbalanced
    int right = checkedHeight(node.right);
    if (right == -1) return -1;
    if (Math.abs(left - right) > 1) return -1;
    return 1 + Math.max(left, right);
}
// balanced if checkedHeight(root) != -1
```

Each node is visited at most once and does O(1) work, so the check is **O(n) time** and O(h) space. If you prefer not to overload the return value with a sentinel, return a small record such as `record Result(boolean balanced, int height)`; it is clearer to read and costs an object per call.

## Worked example

This program puts every method from the lesson side by side, and counts calls to compare the naive and one-pass balance checks on a large tree.

```java title="HeightDepth.java"
import java.util.ArrayDeque;
import java.util.Queue;

public class HeightDepth {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
        TreeNode(int val, TreeNode left, TreeNode right) {
            this.val = val; this.left = left; this.right = right;
        }
    }

    static long calls = 0;                       // instrumentation only

    static int maxDepth(TreeNode node) {         // counts nodes
        calls++;
        if (node == null) return 0;
        return 1 + Math.max(maxDepth(node.left), maxDepth(node.right));
    }

    static int heightEdges(TreeNode node) {      // counts edges
        if (node == null) return -1;
        return 1 + Math.max(heightEdges(node.left), heightEdges(node.right));
    }

    static int maxDepthBfs(TreeNode root) {
        if (root == null) return 0;
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        int levels = 0;
        while (!queue.isEmpty()) {
            for (int i = queue.size(); i > 0; i--) {   // size read once, at loop start
                TreeNode node = queue.poll();
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            levels++;
        }
        return levels;
    }

    static int depthOf(TreeNode node, int target, int depth) {
        if (node == null) return -1;
        if (node.val == target) return depth;
        int left = depthOf(node.left, target, depth + 1);
        return left != -1 ? left : depthOf(node.right, target, depth + 1);
    }

    static int minDepthWrong(TreeNode node) {
        if (node == null) return 0;
        return 1 + Math.min(minDepthWrong(node.left), minDepthWrong(node.right));
    }

    static int minDepth(TreeNode node) {
        if (node == null) return 0;
        if (node.left == null) return 1 + minDepth(node.right);
        if (node.right == null) return 1 + minDepth(node.left);
        return 1 + Math.min(minDepth(node.left), minDepth(node.right));
    }

    static boolean isBalancedNaive(TreeNode node) {
        if (node == null) return true;
        return Math.abs(maxDepth(node.left) - maxDepth(node.right)) <= 1
                && isBalancedNaive(node.left) && isBalancedNaive(node.right);
    }

    static int checkedHeight(TreeNode node) {
        calls++;
        if (node == null) return 0;
        int left = checkedHeight(node.left);
        if (left == -1) return -1;
        int right = checkedHeight(node.right);
        if (right == -1) return -1;
        if (Math.abs(left - right) > 1) return -1;
        return 1 + Math.max(left, right);
    }

    static TreeNode perfect(int levels) {        // perfect tree with 2^levels - 1 nodes
        if (levels == 0) return null;
        return new TreeNode(levels, perfect(levels - 1), perfect(levels - 1));
    }

    public static void main(String[] args) {
        TreeNode tree = new TreeNode(3,
                new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
        TreeNode chain = new TreeNode(1, null, new TreeNode(2, null, new TreeNode(3)));

        System.out.println("maxDepth (nodes)  = " + maxDepth(tree));
        System.out.println("height (edges)    = " + heightEdges(tree));
        System.out.println("maxDepth by BFS   = " + maxDepthBfs(tree));
        System.out.println("depth of 15       = " + depthOf(tree, 15, 0));
        System.out.println("chain minDepth    = " + minDepth(chain)
                + " (wrong formula says " + minDepthWrong(chain) + ")");
        System.out.println("tree balanced?    = " + (checkedHeight(tree) != -1));
        System.out.println("chain balanced?   = " + (checkedHeight(chain) != -1));

        TreeNode big = perfect(16);              // 65,535 nodes, all balanced
        calls = 0;
        boolean a = isBalancedNaive(big);
        long naiveCalls = calls;
        calls = 0;
        boolean b = checkedHeight(big) != -1;
        System.out.println("perfect(16): naive=" + a + " in " + naiveCalls
                + " calls, one-pass=" + b + " in " + calls + " calls");
    }
}
```

```output
maxDepth (nodes)  = 3
height (edges)    = 2
maxDepth by BFS   = 3
depth of 15       = 2
chain minDepth    = 3 (wrong formula says 1)
tree balanced?    = true
chain balanced?   = false
perfect(16): naive=true in 1966082 calls, one-pass=true in 131071 calls
```

The last line shows the cost difference concretely. The one-pass check makes exactly `2n + 1 = 131,071` calls on a 65,535-node tree: one per node and one per `null` child. The naive check makes about fifteen times as many, because each of the 16 levels re-measures the subtrees below it — the O(n log n) behaviour predicted above. On a tree with a million nodes, the gap grows to roughly twenty times; on tall, nearly balanced shapes, it is worse.

In the BFS method, `for (int i = queue.size(); i > 0; i--)` reads the size once, when the loop starts, which is another way of writing the level-size snapshot.

## How height connects to everything else

Height is the hidden variable in most tree complexity statements, so it is worth knowing its range by heart. An `n`-node binary tree has height (in edges) between `⌊log₂ n⌋` and `n - 1` ([[a6-binary-trees]]). Height-balanced trees sit near the bottom of that range: an AVL tree's height is at most about `1.44 log₂ n`, because the sparsest possible balanced tree of each height grows like the Fibonacci numbers. A red–black tree's height is at most `2 log₂(n + 1)`.

Height also bounds **recursion depth**. A recursive tree function has at most `h + 2` frames on the call stack at once (one per node on the current path, plus a `null` call). That is why recursive solutions are safe on balanced trees and dangerous on tall ones, and why "O(h) space" in an answer should be followed by "which is O(n) if the tree is skewed".

## In real systems

**Self-balancing trees store height.** An AVL tree keeps each node's height in the node itself. After an insert or delete, it walks back up the changed path, recomputes each height as `1 + max(left, right)` in O(1) from the children's stored values, and performs a rotation wherever the two sides differ by two. This is exactly the bottom-up height recurrence, maintained incrementally instead of recomputed.

**Database indexes are kept short on purpose.** A B-tree with hundreds of keys per node has a height of three or four even for hundreds of millions of rows, and each level is roughly one disk or cache-page read ([[c7-btrees]]). Database engines are designed around keeping that height low.

**Depth limits as safety rails.** Parsers for nested formats such as JSON, and serialisers that walk object graphs, often enforce a maximum nesting depth. Without one, a maliciously deep input — `[[[[…]]]]` nested a million times — would drive a recursive parser into a stack overflow.

**Interfaces show depth.** File explorers, comment threads and organisation charts indent each item by its depth, computed top-down as the tree is rendered.

## Trade-offs and alternatives

| Measure | Best method | Time | Extra space | Why |
|---|---|---|---|---|
| Maximum depth / height | Bottom-up DFS | O(n) | O(h) | Three lines; postorder combines children |
| Maximum depth on a very tall tree | BFS level count | O(n) | O(w) | No recursion, so no stack overflow |
| Depth of one node | Top-down DFS (or a BST walk) | O(n), or O(h) in a BST | O(h) | Depth depends on the path above |
| Minimum depth | BFS | O(n), often less | O(w) | Stops at the first leaf |
| Balanced check | One-pass DFS with `-1` sentinel | O(n) | O(h) | Each height computed once |

## Common mistakes

> [!MISTAKE] Using `1 + min(left, right)` for minimum depth
> A missing child returns 0 and always wins the minimum, so a node with one child is treated as a leaf. Only take the minimum when both children exist; otherwise follow the child that does exist. Or use BFS and stop at the first node whose children are both `null`.

**Mixing edges and nodes.** Returning `0` for `null` counts nodes; returning `-1` counts edges. Mixing a node-counting base case with an edge-counting expectation produces answers that are off by one. Check the problem's examples.

**Confusing height with depth.** Depth is measured from the root down to a node; height is measured from a node down to its deepest leaf. The root has depth 0 and the largest height; leaves have height 0 and can have any depth.

**Checking balance only at the root.** The definition applies at every node. A tree whose root has two subtrees of height 5 can still be unbalanced deeper down.

**Recomputing height at every node.** Calling a height function inside a recursive check makes it O(n · h). Return the height from the same recursion that does the check.

**Using a sentinel that can be a real answer.** `-1` works as "unbalanced" only because node-counting heights are never negative. If you count edges, a `null` subtree already has height `-1`, so choose a different sentinel (for example `Integer.MIN_VALUE`) or return a record.

## Interview perspective

Maximum depth is often the warm-up question in a tree interview; interviewers then extend it to minimum depth or the balanced check to see whether you notice the traps. State your convention, then the recurrence, then the complexity.

> [!INTERVIEW] Talking through the balanced check
> "The naive way calls height at every node, which recomputes subtrees and costs O(n log n) even when balanced. Instead I'll compute heights bottom-up once and return -1 as soon as any subtree is unbalanced, so ancestors short-circuit. Every node is processed once: O(n) time, O(h) stack."

Questions you should be able to answer:

- **What does the empty tree return?** 0 when counting nodes, -1 when counting edges; say which.
- **Why can't minimum depth use `1 + min`?** Because an absent child is not a leaf; it would report 1 for any root with one child.
- **Why BFS for minimum depth?** It finds the shallowest leaf first and stops, instead of exploring the whole tree.
- **Maximum depth without recursion?** BFS counting levels, or DFS with a stack of `(node, depth)` pairs.
- **What is the height of a balanced tree with n nodes?** O(log n); AVL guarantees at most about `1.44 log₂ n`.
- **Follow-up: return the depth of every node.** One top-down traversal filling a map from node to depth, O(n).

```quiz
Q: What does minDepthWrong, written as 1 + Math.min(left, right) with null returning 0, return for a root whose only child is a right child that is a leaf?
- [ ] 2, the correct answer
- [x] 1, because the missing left child contributes 0
- [ ] 0
- [ ] It throws NullPointerException
> The left call returns 0 and the right returns 1, so min is 0 and the result is 1, as if the root were a leaf. The correct minimum depth is 2, because the only leaf is the right child. Only children that exist can lead to a leaf.

Q: Using the edge-counting convention, what should a height function return for null so that a single leaf has height 0?
- [ ] 0
- [x] -1
- [ ] 1
- [ ] Integer.MIN_VALUE
> With h = 1 + max(hL, hR), a leaf gets 1 + max(base, base). For that to be 0, the base must be -1. Returning 0 for null gives the node-counting convention, where a leaf has depth 1.

Q: Why is the naive balanced check, which calls a height function at every node, slower than the one-pass version?
- [ ] It visits nodes in the wrong order
- [x] Each node's height is recomputed once for every ancestor the check visits
- [ ] It uses BFS instead of DFS
- [ ] It does not handle null children
> The height function walks the entire subtree each time it is called, and it is called again at each descendant. The total is the sum of node depths, O(n log n) for a balanced tree and worse for tall ones. Returning heights from the same recursion that checks balance computes each one once, for O(n).

Q: In the one-pass balanced check, why is -1 a safe signal for "unbalanced"?
- [ ] Because Java reserves -1 for errors
- [x] Because when heights count nodes, every real height is 0 or more, so -1 can never be a genuine answer
- [ ] Because -1 is smaller than any height difference
- [ ] It is not safe; the method has a bug
> A sentinel must be a value the function cannot otherwise return. Node-counting heights are non-negative, so -1 is unambiguous, and ancestors can pass it upward without further work. With edge counting, null already has height -1, so a different sentinel or a record would be needed.
```

## Practice

1. **Maximum Depth of Binary Tree.** Solve it recursively, then with BFS, then with an iterative DFS using `(node, depth)` pairs.
2. **Minimum Depth of Binary Tree.** Write the correct DFS and the BFS version, and construct a tree on which BFS visits far fewer nodes.
3. **Balanced Binary Tree.** Write the naive check, then the one-pass version, and count calls on a large tree as in the worked example.
4. **Depth of a node.** Return the depth of a target value in a general tree, then in a BST in O(h).
5. **Maximum Depth of N-ary Tree.** Generalise the recurrence to any number of children ([[a6-nary-trees]]).
6. **Diameter of Binary Tree.** Reuse the height recursion to find the longest path between any two nodes ([[a6-diameter]]).

The DSA explorer lists these under Trees; start with *Maximum Depth of Binary Tree*, *Minimum Depth of Binary Tree* and *Balanced Binary Tree*.

## Quick revision {#quick-revision}

- Depth: edges from the root down to a node; computed top-down (child = parent + 1). Root depth 0.
- Height: edges from a node down to its deepest leaf; computed bottom-up (1 + max of children). Leaf height 0.
- Tree height = root's height = greatest node depth.
- Conventions: `null` → -1 counts edges; `null` → 0 counts nodes (LeetCode "maximum depth"). Same recurrence.
- Max depth: `1 + max(maxDepth(left), maxDepth(right))`, O(n) time, O(h) space; BFS level count avoids recursion.
- Min depth: not `1 + min`; with one child, follow that child. BFS returns at the first leaf.
- Balanced: at every node, subtree heights differ by at most 1. One-pass check returns height or -1; O(n). Naive is O(n · h).
- Height ranges from `⌊log₂ n⌋` to `n - 1`; AVL ≤ about `1.44 log₂ n`; red–black ≤ `2 log₂(n + 1)`.
- Recursion depth is about `h`, so tall trees risk `StackOverflowError`.

## Key takeaways {#key-takeaways}

- Depth flows down from the root and is passed as a parameter; height flows up from the leaves and is returned from children.
- Decide whether you count edges or nodes, and make the `null` base case match (-1 or 0).
- Maximum depth is a three-line postorder recursion; it costs O(n) time and O(h) space.
- Minimum depth must ignore missing children — an absent child is not a leaf — and BFS can stop at the first leaf it meets.
- Check balance in one pass by returning heights and a sentinel for failure; recomputing heights at every node wastes O(n · h) work.
- Height is the variable hidden inside "O(h)": it decides whether tree operations and recursion depth are logarithmic or linear.
