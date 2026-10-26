---
summary: Tree construction rebuilds a binary tree from a description of it — usually two traversal orders, sometimes one traversal plus an ordering rule. You will learn which descriptions determine a tree uniquely, how preorder and inorder combine to rebuild it in O(n), and the related constructions interviews ask for, from BSTs out of preorder to maximum binary trees with a monotonic stack.
difficulty: intermediate
minutes: 55
objectives:
  - Explain why a single traversal cannot determine a binary tree, and which pairs of traversals can
  - Build a tree from preorder and inorder in O(n) using index ranges, a value-to-index map and a moving preorder pointer
  - Adapt the construction to postorder plus inorder, and to preorder plus postorder for full binary trees
  - Construct BSTs from preorder in O(n) using bounds, and balanced BSTs from sorted input
  - Recognise construction problems solved by other means, such as a monotonic stack or a parent map
---

## Introduction

A **traversal** turns a tree into a sequence: preorder lists each node before its subtrees, inorder lists the left subtree, then the node, then the right subtree, and postorder lists the node after its subtrees ([[a6-dfs]]). **Tree construction** goes the other way. Given one or more sequences, rebuild the tree that produced them.

This sounds like a puzzle, and in interviews it is one — *Construct Binary Tree from Preorder and Inorder Traversal* is among the most frequently asked tree problems. But the skill behind it is practical. Compilers turn flat token streams into syntax trees. Databases store hierarchies as rows and rebuild them on read. Serialisation formats ([[a6-serialization]]) are designed precisely so that one sequence is enough to rebuild a tree. Understanding *why* some sequences are enough and others are not is what lets you design or debug those formats.

The central idea of the lesson fits in one sentence: **preorder (or postorder) tells you which node is the root; inorder tells you which nodes are on its left and which are on its right.** Everything else is bookkeeping — and the bookkeeping is where the O(n²) solutions and the off-by-one bugs come from.

## Before you start

- **Tree traversals** — preorder, inorder and postorder, and what each says about where the root appears. See [[a6-dfs]].
- **Binary search trees** — the ordering property, and that an inorder traversal of a BST is sorted. See [[a6-bst]].
- **Recursion** — building a structure by building smaller structures first. See [[a1-recursion]].
- **HashMap** — for O(1) lookups of a value's position. See [[a1-hashmap]].

## The intuition

Here is a small tree and its three traversals:

```text
        3
       / \
      9   20
         /  \
        15   7

preorder:  3  9  20 15 7      (root, left, right)
inorder:   9  3  15 20 7      (left, root, right)
postorder: 9  15 7  20 3      (left, right, root)
```

Look at what each sequence reveals. In preorder, the **first** value is always the root, because the root is visited before anything else. In postorder, the root is always **last**. Inorder does not tell you the root, but if you already know it, inorder **splits** around it: everything before `3` in the inorder sequence (`9`) is in the left subtree, and everything after it (`15 20 7`) is in the right subtree.

That split gives you more than just the members of each subtree. It tells you their **sizes**: the left subtree has 1 node, the right has 3. And since preorder lists the root, then the entire left subtree, then the entire right subtree, you can now cut the preorder sequence too: after the root `3`, the next 1 value (`9`) is the left subtree's preorder, and the remaining 3 (`20 15 7`) are the right subtree's preorder. You now have two smaller instances of the same problem, so recursion does the rest.

## Why one traversal is not enough

Could preorder alone determine the tree? Consider two nodes, `1` and `2`. If `2` is the left child of `1`, the preorder is `1 2`. If `2` is the right child, the preorder is still `1 2`. One sequence, two trees. Inorder has the same problem from the other side: the tree with root `1` and right child `2`, and the tree with root `2` and left child `1`, both have inorder `1 2`. With `n` nodes the number of different tree shapes grows exponentially (it is the `n`-th Catalan number: 5 shapes for 3 nodes, 42 for 5), while a traversal with fixed values is just one sequence. So a single plain traversal cannot pin down the shape.

The question is which *pairs* of traversals can. The answer, assuming all values are **distinct**:

| Given | Determines the tree? | Why |
|---|---|---|
| Preorder + inorder | Yes | Preorder names each root; inorder splits around it |
| Postorder + inorder | Yes | Same, with roots read from the end |
| Level order + inorder | Yes | Level order names the root (first); inorder splits |
| Preorder + postorder | Only for **full** binary trees | When a node has one child, nothing says whether it is left or right |
| Preorder alone with `null` markers | Yes | The markers record the shape directly ([[a6-serialization]]) |
| Preorder of a **BST** | Yes | The ordering rule plays the role of inorder |

The preorder-plus-postorder failure is worth seeing concretely. Both "root `1` with left child `2`" and "root `1` with right child `2`" have preorder `1 2` and postorder `2 1`. Only when every node has zero or two children — a **full binary tree** — does the ambiguity disappear, because then a node that has any children always has a left one.

And the distinctness assumption matters. If inorder is `1 1 1`, the root value `1` appears three times and you cannot tell where to split. Interview problems guarantee unique values for exactly this reason.

## Preorder + inorder: from O(n²) to O(n)

### The direct translation

The intuition translates straight into code: take the first preorder value as the root, find it in inorder, cut both arrays, and recurse.

```java
static TreeNode buildNaive(int[] pre, int[] in) {
    if (pre.length == 0) return null;
    TreeNode root = new TreeNode(pre[0]);
    int mid = 0;
    while (in[mid] != pre[0]) mid++;                       // linear search
    root.left = buildNaive(Arrays.copyOfRange(pre, 1, mid + 1),
                           Arrays.copyOfRange(in, 0, mid));
    root.right = buildNaive(Arrays.copyOfRange(pre, mid + 1, pre.length),
                            Arrays.copyOfRange(in, mid + 1, in.length));
    return root;
}
```

The slicing is the heart of it. If the root is at inorder index `mid`, the left subtree has `mid` nodes. So its preorder is the `mid` values after the root, `pre[1 .. mid]`, and its inorder is `in[0 .. mid - 1]`. The right subtree gets everything after: `pre[mid + 1 ..]` and `in[mid + 1 ..]`.

It works, but each call does O(k) work on a subproblem of size `k`: a linear search and four array copies. On a balanced tree that totals O(n log n). On a skewed tree — every node has only a left child, so inorder is the preorder reversed — the subproblem sizes are `n, n - 1, n - 2, …` and the total is O(n²). It also allocates O(n²) memory in that case.

### Removing the two costs

Both costs can be eliminated.

**The search.** Every lookup asks "where is value `v` in the inorder array?" The array never changes, so build a `HashMap` from value to inorder index once, in O(n), and each lookup becomes O(1).

**The copying.** Instead of passing new arrays, pass the **range** of the inorder array that the current subtree occupies, as two indices `lo` and `hi`. The subtree's nodes are exactly `in[lo .. hi]`, and an empty range (`lo > hi`) means an empty subtree.

What about the preorder side? Here is a neat observation. If the recursion always builds the root first, then the whole left subtree, then the whole right subtree, it creates nodes **in exactly preorder**. So the next root it needs is always the next unused value in the preorder array. A single pointer `preIdx` that advances by one every time a node is created is all the preorder bookkeeping required — no preorder ranges at all.

```java
static int preIdx;

static TreeNode buildFromPreIn(int[] pre, int[] in) {
    Map<Integer, Integer> pos = new HashMap<>();
    for (int i = 0; i < in.length; i++) pos.put(in[i], i);  // value -> inorder index
    preIdx = 0;
    return buildPre(pre, pos, 0, in.length - 1);
}

static TreeNode buildPre(int[] pre, Map<Integer, Integer> pos, int lo, int hi) {
    if (lo > hi) return null;                     // empty inorder range: no subtree
    TreeNode root = new TreeNode(pre[preIdx++]);  // next unused preorder value
    int mid = pos.get(root.val);
    root.left = buildPre(pre, pos, lo, mid - 1);  // left first: preorder order
    root.right = buildPre(pre, pos, mid + 1, hi);
    return root;
}
```

Why is it safe to consume the preorder value *before* knowing whether the subtree is non-empty? Because the check `lo > hi` comes first: a call only takes a value when its inorder range is non-empty, which means the subtree has at least one node, and its root is the next preorder value. Empty subtrees take nothing.

> [!IMPORTANT] The order of the two recursive calls is not optional
> With a forward-moving preorder pointer, the left subtree must be built before the right one, because that is the order in which preorder lists them. Swapping the two lines gives the right subtree the left subtree's values.

### Dry run

Trace `pre = [3, 9, 20, 15, 7]`, `in = [9, 3, 15, 20, 7]`. The map is `9→0, 3→1, 15→2, 20→3, 7→4`. Each row is a call that creates a node, in the order they happen.

| Call range `[lo, hi]` | `preIdx` before | Root created | `mid` | Left range | Right range |
|---|---|---|---|---|---|
| [0, 4] | 0 | 3 | 1 | [0, 0] | [2, 4] |
| [0, 0] | 1 | 9 | 0 | [0, -1] empty | [1, 0] empty |
| [2, 4] | 2 | 20 | 3 | [2, 2] | [4, 4] |
| [2, 2] | 3 | 15 | 2 | [2, 1] empty | [3, 2] empty |
| [4, 4] | 4 | 7 | 4 | [4, 3] empty | [5, 4] empty |

The "Root created" column reads `3, 9, 20, 15, 7` — the preorder sequence — confirming that the recursion creates nodes in preorder, which is why the single pointer works. Every node is created by a call with a non-empty range, and every empty range returns `null` immediately.

### Postorder + inorder

Postorder lists the root last, after both subtrees. Read it **backwards** and you get root, right subtree, left subtree — a mirror image of preorder. So the same algorithm works with two changes: the pointer starts at the end and moves left, and the recursion builds the **right** subtree first.

```java
static int postIdx;

static TreeNode buildPost(int[] post, Map<Integer, Integer> pos, int lo, int hi) {
    if (lo > hi) return null;
    TreeNode root = new TreeNode(post[postIdx--]);  // roots appear from the end
    int mid = pos.get(root.val);
    root.right = buildPost(post, pos, mid + 1, hi); // right first: reversed postorder
    root.left = buildPost(post, pos, lo, mid - 1);
    return root;
}
```

Building left first here is the classic bug: the values just before the root in postorder belong to the right subtree, and the left subtree would consume them.

## Worked example

```java title="BuildTree.java"
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Queue;

public class BuildTree {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // ---- Naive: copy subarrays and search linearly. O(n^2) worst case ----
    static TreeNode buildNaive(int[] pre, int[] in) {
        if (pre.length == 0) return null;
        TreeNode root = new TreeNode(pre[0]);
        int mid = 0;
        while (in[mid] != pre[0]) mid++;                       // linear search
        root.left = buildNaive(Arrays.copyOfRange(pre, 1, mid + 1),
                               Arrays.copyOfRange(in, 0, mid));
        root.right = buildNaive(Arrays.copyOfRange(pre, mid + 1, pre.length),
                                Arrays.copyOfRange(in, mid + 1, in.length));
        return root;
    }

    // ---- Preorder + inorder with index ranges and a map. O(n) ----
    static int preIdx;

    static TreeNode buildFromPreIn(int[] pre, int[] in) {
        Map<Integer, Integer> pos = new HashMap<>();
        for (int i = 0; i < in.length; i++) pos.put(in[i], i);  // value -> inorder index
        preIdx = 0;
        return buildPre(pre, pos, 0, in.length - 1);
    }

    static TreeNode buildPre(int[] pre, Map<Integer, Integer> pos, int lo, int hi) {
        if (lo > hi) return null;                     // empty inorder range: no subtree
        TreeNode root = new TreeNode(pre[preIdx++]);  // next unused preorder value
        int mid = pos.get(root.val);
        root.left = buildPre(pre, pos, lo, mid - 1);  // left first: preorder order
        root.right = buildPre(pre, pos, mid + 1, hi);
        return root;
    }

    // ---- Postorder + inorder: take roots from the end, build right first ----
    static int postIdx;

    static TreeNode buildFromPostIn(int[] post, int[] in) {
        Map<Integer, Integer> pos = new HashMap<>();
        for (int i = 0; i < in.length; i++) pos.put(in[i], i);
        postIdx = post.length - 1;
        return buildPost(post, pos, 0, in.length - 1);
    }

    static TreeNode buildPost(int[] post, Map<Integer, Integer> pos, int lo, int hi) {
        if (lo > hi) return null;
        TreeNode root = new TreeNode(post[postIdx--]);  // roots appear from the end
        int mid = pos.get(root.val);
        root.right = buildPost(post, pos, mid + 1, hi); // right first: reversed postorder
        root.left = buildPost(post, pos, lo, mid - 1);
        return root;
    }

    // ---- helpers to check the result ----
    static void preorder(TreeNode n, List<Integer> out) {
        if (n == null) return;
        out.add(n.val); preorder(n.left, out); preorder(n.right, out);
    }

    static void inorder(TreeNode n, List<Integer> out) {
        if (n == null) return;
        inorder(n.left, out); out.add(n.val); inorder(n.right, out);
    }

    static List<Integer> levelOrder(TreeNode root) {           // LeetCode notation
        List<Integer> out = new ArrayList<>();
        Queue<TreeNode> q = new ArrayDeque<>();
        List<TreeNode> order = new ArrayList<>();
        q.add(root);
        order.add(root);
        while (!q.isEmpty()) {
            TreeNode n = q.remove();
            for (TreeNode c : new TreeNode[] {n.left, n.right}) {
                order.add(c);
                if (c != null) q.add(c);
            }
        }
        for (TreeNode n : order) out.add(n == null ? null : n.val);
        while (out.get(out.size() - 1) == null) out.remove(out.size() - 1);
        return out;
    }

    public static void main(String[] args) {
        int[] pre = {3, 9, 20, 15, 7};
        int[] in = {9, 3, 15, 20, 7};
        int[] post = {9, 15, 7, 20, 3};

        System.out.println("pre + in  -> " + levelOrder(buildFromPreIn(pre, in)));
        System.out.println("post + in -> " + levelOrder(buildFromPostIn(post, in)));
        System.out.println("naive     -> " + levelOrder(buildNaive(pre, in)));

        int[] pre2 = {1, 2, 4, 5, 3, 6, 7, 8};
        int[] in2 = {4, 2, 5, 1, 6, 3, 8, 7};
        TreeNode t = buildFromPreIn(pre2, in2);
        List<Integer> p = new ArrayList<>(), i = new ArrayList<>();
        preorder(t, p);
        inorder(t, i);
        System.out.println("rebuilt   -> " + levelOrder(t));
        System.out.println("round trip: pre " + p + ", in " + i);
    }
}
```

```output
pre + in  -> [3, 9, 20, null, null, 15, 7]
post + in -> [3, 9, 20, null, null, 15, 7]
naive     -> [3, 9, 20, null, null, 15, 7]
rebuilt   -> [1, 2, 3, 4, 5, 6, 7, null, null, null, null, null, null, 8]
round trip: pre [1, 2, 4, 5, 3, 6, 7, 8], in [4, 2, 5, 1, 6, 3, 8, 7]
```

All three builders produce the same tree, printed in LeetCode's level-order notation ([[a6-binary-trees]]). The second test is a stronger check: after rebuilding, the program traverses the result and gets back exactly the input sequences. A **round-trip test** like this is the right way to test any construction or serialisation code, because a wrong tree almost always produces a different traversal.

The pointers `preIdx` and `postIdx` are `static` fields reset by the entry methods. That is fine in a single-threaded test, but a field in an object, or a one-element `int[]` passed down, avoids shared state between calls — the same concern discussed for diameter in [[a6-diameter]].

### Complexity

**Time.** Building the map is O(n). Each recursive call that creates a node does O(1) work — one array read, one map lookup, one allocation — and there are `n` such calls plus at most `n + 1` calls that return `null` for empty ranges. Total: **O(n)**, compared with O(n²) worst case for the copying version.

**Space.** The map is O(n). The recursion depth equals the height of the tree being built: O(log n) if it is balanced, O(n) if it is skewed. So the total is **O(n)**. For trees deep enough to overflow the call stack, there is an iterative version that walks preorder with an explicit stack and uses inorder to decide when to stop going left; it is a good exercise but rarely asked.

## Other ways to pin down a tree

### Preorder + postorder (full binary trees)

*Construct Binary Tree from Preorder and Postorder Traversal* gives both sequences and asks for *any* tree that matches — an admission that the answer is not unique in general. The trick is to find the size of the left subtree without inorder. After the root, the next preorder value `pre[i]` is the root of the left subtree (if the node has any children). In postorder, a subtree's root comes **last** among that subtree's values, so the position of `pre[i]` in postorder marks the end of the left subtree's block. Everything after it, up to just before the parent, is the right subtree.

```java
static TreeNode prePost(int[] pre, Map<Integer, Integer> postPos, int lo, int hi) {
    if (lo > hi) return null;
    TreeNode root = new TreeNode(pre[preI++]);
    if (lo == hi) return root;                       // a leaf
    int leftEnd = postPos.get(pre[preI]);            // left child's root ends its block
    root.left = prePost(pre, postPos, lo, leftEnd);
    root.right = prePost(pre, postPos, leftEnd + 1, hi - 1);
    return root;
}
```

Here `[lo, hi]` is a range of the *postorder* array, and the root sits at `post[hi]`, which is why the right subtree ends at `hi - 1`. When a node has one child, this code always makes it the left child — one valid answer among several. For a full binary tree, the answer is unique and this code finds it.

### A BST from its preorder

*Construct Binary Search Tree from Preorder Traversal* gives only the preorder of a BST. The ordering rule replaces inorder: sorting the preorder gives the inorder, so you could sort and use the algorithm above in O(n log n). Inserting each value into a growing BST one at a time also works, but it is O(n²) for sorted input, because the tree becomes a chain ([[a6-bst]]).

The O(n) solution passes an **upper bound** down. A call builds the subtree that may contain only values below `bound`. If the next preorder value exceeds the bound, it belongs to some ancestor's right side, so this subtree is empty and the value is left for a higher call. Otherwise, take it as the root; its left subtree contains values below the root, and its right subtree contains values between the root and the inherited bound.

```java
static TreeNode bst(int[] pre, int bound) {
    if (i == pre.length || pre[i] > bound) return null;  // value belongs higher up
    TreeNode root = new TreeNode(pre[i++]);
    root.left = bst(pre, root.val);       // left subtree: values below root
    root.right = bst(pre, bound);         // right subtree: up to the inherited bound
    return root;
}
```

Why is the lower bound not needed? Because preorder guarantees it. By the time a call is building a right subtree, every value smaller than its parent has already been consumed by the left subtree. Each value is consumed exactly once and each call does O(1) work, so this is O(n) time and O(h) stack.

Trace `[8, 5, 1, 7, 10, 12]`. The root is `8`. Its left call has bound 8: it takes `5`, whose left call (bound 5) takes `1`, whose children both see `7 > 1` and `7 > 5` and return empty. Back at `5`, the right call has bound 8: `7 ≤ 8`, so it takes `7`. Its children see `10 > 7` and `10 > 8` and return empty. Back at the root, the right call has bound `Integer.MAX_VALUE` and takes `10`, then `12` becomes its right child. The result is `[8, 5, 10, 1, 7, null, 12]`.

### A balanced BST from sorted input

*Convert Sorted Array to Binary Search Tree* asks for a **height-balanced** BST. A sorted array is already the inorder sequence of every BST on those values; the freedom is which value becomes the root. Choosing the **middle** element puts half the values on each side, and doing that recursively makes the left and right heights of every node differ by at most one, giving height about `log₂ n`. It is O(n) time: each element becomes a node once. The linked-list version (*Convert Sorted List to Binary Search Tree*) cannot jump to the middle in O(1); the elegant O(n) solution counts the list, then builds the tree in inorder, consuming list nodes one by one as the recursion reaches them — the same "the recursion visits nodes in a known order, so consume the input with a pointer" idea as `preIdx`.

### Maximum Binary Tree: a monotonic stack

*Maximum Binary Tree* defines a tree from an array: the root is the maximum, its left subtree is built from the part before the maximum, and its right subtree from the part after. The direct recursion finds the maximum in each range — O(n²) for a sorted array, the same skew problem as before.

A **monotonic stack** ([[a5-monotonic-stack]]) builds it in O(n). Scan left to right, keeping a stack of nodes with decreasing values from bottom to top — the "right spine" of the tree built so far. For each new value `x`, pop every node smaller than `x`; the last one popped becomes `x`'s left child, because those nodes form the run of smaller values just before `x`. Then `x` becomes the right child of whatever is now on top of the stack, if anything, because that node is the nearest larger value to its left.

```java
static TreeNode maximumTree(int[] a) {
    Deque<TreeNode> stack = new ArrayDeque<>();     // values decrease bottom to top
    for (int x : a) {
        TreeNode node = new TreeNode(x);
        TreeNode last = null;
        while (!stack.isEmpty() && stack.peek().val < x) last = stack.pop();
        node.left = last;                            // smaller run to the left
        if (!stack.isEmpty()) stack.peek().right = node;
        stack.push(node);
    }
    return stack.peekLast();                         // the bottom is the maximum
}
```

Each node is pushed and popped at most once, so the loop is O(n) overall. The resulting structure — a heap by value, with inorder equal to the array order — is called a **Cartesian tree**, and it appears in range-minimum-query algorithms.

### From parent–child descriptions

*Create Binary Tree From Descriptions* gives rows `[parent, child, isLeft]` in any order. This is how a database often stores a hierarchy: each row has a key and a parent key. Build it with a map from value to node, creating nodes on first sight with `computeIfAbsent`, and linking each child to its parent. The root is the one value that never appears as a child. This is O(n) and needs no recursion. In SQL, the same adjacency-list model is traversed with a recursive common table expression ([[c7-recursive-cte]]).

```java title="MoreBuilds.java"
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;

public class MoreBuilds {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // ---- BST from preorder in O(n): each call accepts values below an upper bound ----
    static int i;

    static TreeNode bstFromPreorder(int[] pre) {
        i = 0;
        return bst(pre, Integer.MAX_VALUE);
    }

    static TreeNode bst(int[] pre, int bound) {
        if (i == pre.length || pre[i] > bound) return null;  // value belongs higher up
        TreeNode root = new TreeNode(pre[i++]);
        root.left = bst(pre, root.val);       // left subtree: values below root
        root.right = bst(pre, bound);         // right subtree: up to the inherited bound
        return root;
    }

    // ---- Sorted array to height-balanced BST: middle element as root ----
    static TreeNode balanced(int[] a, int lo, int hi) {
        if (lo > hi) return null;
        int mid = lo + (hi - lo) / 2;
        TreeNode root = new TreeNode(a[mid]);
        root.left = balanced(a, lo, mid - 1);
        root.right = balanced(a, mid + 1, hi);
        return root;
    }

    // ---- Preorder + postorder (full binary tree): pre[1] is the left child's root ----
    static int preI;

    static TreeNode fromPrePost(int[] pre, int[] post) {
        Map<Integer, Integer> postPos = new HashMap<>();
        for (int k = 0; k < post.length; k++) postPos.put(post[k], k);
        preI = 0;
        return prePost(pre, postPos, 0, post.length - 1);
    }

    static TreeNode prePost(int[] pre, Map<Integer, Integer> postPos, int lo, int hi) {
        if (lo > hi) return null;
        TreeNode root = new TreeNode(pre[preI++]);
        if (lo == hi) return root;                       // a leaf
        int leftEnd = postPos.get(pre[preI]);            // left child's root ends its block
        root.left = prePost(pre, postPos, lo, leftEnd);
        root.right = prePost(pre, postPos, leftEnd + 1, hi - 1);
        return root;
    }

    // ---- Maximum Binary Tree with a monotonic stack: O(n) ----
    static TreeNode maximumTree(int[] a) {
        Deque<TreeNode> stack = new ArrayDeque<>();     // values decrease bottom to top
        for (int x : a) {
            TreeNode node = new TreeNode(x);
            TreeNode last = null;
            while (!stack.isEmpty() && stack.peek().val < x) last = stack.pop();
            node.left = last;                            // smaller run to the left
            if (!stack.isEmpty()) stack.peek().right = node;
            stack.push(node);
        }
        return stack.peekLast();                         // the bottom is the maximum
    }

    // ---- From parent-child descriptions: [parent, child, isLeft] ----
    static TreeNode fromDescriptions(int[][] desc) {
        Map<Integer, TreeNode> nodes = new HashMap<>();
        Set<Integer> children = new HashSet<>();
        for (int[] d : desc) {
            TreeNode parent = nodes.computeIfAbsent(d[0], TreeNode::new);
            TreeNode child = nodes.computeIfAbsent(d[1], TreeNode::new);
            if (d[2] == 1) parent.left = child; else parent.right = child;
            children.add(d[1]);
        }
        for (int[] d : desc) if (!children.contains(d[0])) return nodes.get(d[0]);
        return null;                                     // the root is never a child
    }

    static List<Integer> levelOrder(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        if (root == null) return out;
        Queue<TreeNode> q = new ArrayDeque<>(List.of(root));
        out.add(root.val);
        while (!q.isEmpty()) {
            TreeNode n = q.remove();
            for (TreeNode c : new TreeNode[] {n.left, n.right}) {
                out.add(c == null ? null : c.val);
                if (c != null) q.add(c);
            }
        }
        while (out.get(out.size() - 1) == null) out.remove(out.size() - 1);
        return out;
    }

    public static void main(String[] args) {
        System.out.println("BST from preorder:  "
                + levelOrder(bstFromPreorder(new int[] {8, 5, 1, 7, 10, 12})));
        int[] sorted = {-10, -3, 0, 5, 9};
        System.out.println("balanced BST:       " + levelOrder(balanced(sorted, 0, sorted.length - 1)));
        System.out.println("pre + post:         " + levelOrder(fromPrePost(
                new int[] {1, 2, 4, 5, 3, 6, 7}, new int[] {4, 5, 2, 6, 7, 3, 1})));
        System.out.println("maximum tree:       "
                + levelOrder(maximumTree(new int[] {3, 2, 1, 6, 0, 5})));
        System.out.println("from descriptions:  " + levelOrder(fromDescriptions(
                new int[][] {{20, 15, 1}, {20, 17, 0}, {50, 20, 1}, {50, 80, 0}, {80, 19, 1}})));
    }
}
```

```output
BST from preorder:  [8, 5, 10, 1, 7, null, 12]
balanced BST:       [0, -10, 5, null, -3, null, 9]
pre + post:         [1, 2, 3, 4, 5, 6, 7]
maximum tree:       [6, 3, 5, null, 2, 0, null, null, 1]
from descriptions:  [50, 20, 80, 15, 17, 19]
```

Look at the maximum tree for `[3, 2, 1, 6, 0, 5]`. While scanning `3, 2, 1`, each value is smaller than the last, so each becomes the right child of the previous: the stack holds `3, 2, 1`. Then `6` pops all three; the last popped is `3`, which becomes `6`'s left child, carrying the chain `3 → 2 → 1` with it. `0` becomes `6`'s right child. Finally `5` pops `0`, takes it as its left child, and becomes `6`'s new right child. The balanced BST is one of several valid answers: with an even-sized range, choosing the lower or the upper middle both give balanced trees.

### The array layout of complete trees

One more construction needs no recursion at all. A **complete** binary tree — every level full except possibly the last, which is filled from the left — can be stored in an array with no pointers: the node at index `i` has children at `2i + 1` and `2i + 2` and its parent at `(i - 1) / 2`. Building the linked tree from such an array is a loop over indices. This is how binary heaps are stored ([[a7-min-heap]]), and it is why LeetCode's level-order notation reads like an array with gaps.

## In real systems

**Compilers and parsers.** A parser reads a flat stream of tokens and constructs an abstract syntax tree, using the grammar as the rule that decides where each subtree begins and ends — the same role inorder plays here. Converting an infix expression to a tree uses operator precedence to find the root of each subexpression ([[a5-expression]]).

**Databases.** Relational tables store hierarchies — categories, comment threads, org charts — as rows with a `parent_id` column. Rebuilding the tree in application code is the descriptions problem: one pass with a map from id to node, then link children to parents. Ordering children usually needs an explicit position column, because a table has no inherent order.

**Serialisation.** Formats that store trees are designed so that **one** sequence is enough: they add `null` markers, child counts or nesting brackets so the shape is recorded explicitly ([[a6-serialization]]). Understanding why two plain traversals are needed otherwise is what explains those markers.

**Cartesian trees and treaps.** The maximum-tree construction builds a Cartesian tree in linear time, which is used to reduce range-minimum queries to lowest-common-ancestor queries ([[a6-lca]]) and underlies the treap, a randomised balanced BST.

## Trade-offs and alternatives

| Input | Method | Time | Space | Notes |
|---|---|---|---|---|
| Preorder + inorder | Copy arrays, linear search | O(n²) worst | O(n²) worst | Clear but slow on skewed trees |
| Preorder + inorder | Index ranges + map + pointer | O(n) | O(n) | Standard answer; needs distinct values |
| Postorder + inorder | Same, pointer from the end, right first | O(n) | O(n) | Mirror image of the above |
| Preorder + postorder | Left-child root marks block end | O(n) | O(n) | Unique only for full binary trees |
| BST preorder | Sort, then preorder + inorder | O(n log n) | O(n) | Easy to explain |
| BST preorder | Upper-bound recursion | O(n) | O(h) | Best; no map needed |
| Sorted array | Middle as root | O(n) | O(log n) | Height-balanced result |
| Array, max as root | Monotonic stack | O(n) | O(n) | Direct recursion is O(n²) worst |
| Parent rows | Map from id to node | O(n) | O(n) | No recursion; any row order |

The general rule: if a description determines the tree, there is usually an O(n) construction, and the slow versions come from re-scanning or copying the input. Look for the order in which your recursion creates nodes; if it matches the order of an input sequence, a single pointer can replace all the searching.

## Common mistakes

> [!MISTAKE] Building left first when reading postorder backwards
> Reading postorder from the end gives root, right, left. The right subtree must be built first, or the left subtree consumes the right subtree's values and the result is wrong without any error.

**Off-by-one in the ranges.** The root at inorder index `mid` belongs to neither subtree: the left range is `[lo, mid - 1]` and the right range is `[mid + 1, hi]`. Including `mid` in either causes the root to be created twice or infinite recursion.

**Searching inorder linearly in every call.** It turns an O(n) algorithm into O(n²) on skewed input. Build the value-to-index map once.

**Copying subarrays.** Each `Arrays.copyOfRange` costs O(k); across the recursion it costs O(n²) time and memory on skewed trees. Pass indices.

**Assuming any two traversals suffice.** Preorder plus postorder is ambiguous when a node has one child. If an interviewer offers that pair, say the answer is unique only for full binary trees.

**Duplicate values.** With repeated values the map cannot record a single position, and the tree may not be unique. State the distinctness assumption, or ask how duplicates should be handled.

**Forgetting to reset a static pointer.** If `preIdx` is a static field and the method runs twice, the second call starts where the first ended. Reset it in the entry method or avoid static state.

## Interview perspective

The preorder-plus-inorder problem is a favourite because it checks several things at once: whether you understand what each traversal reveals, whether you can manage index ranges without off-by-one errors, and whether you notice the O(n²) trap.

> [!INTERVIEW] Explaining the construction
> "The first preorder value is the root. Its position in inorder splits the remaining values into the left and right subtrees and tells me their sizes. I'll store each value's inorder index in a map, recurse on inorder index ranges, and keep one pointer into preorder — the recursion creates nodes in preorder, so the next root is always the next unused value. That's O(n) time and O(n) space, assuming distinct values."

Questions to be ready for:

- **Why do you need inorder?** Preorder gives the roots, but not where the left subtree ends; inorder gives the split.
- **Can you use preorder and postorder?** Only for full binary trees; otherwise a single child could be on either side.
- **What changes for postorder plus inorder?** Read roots from the end and build the right subtree first.
- **What if it is a BST and you only have preorder?** Bound recursion in O(n), or sort to get inorder.
- **What if values repeat?** The tree may not be unique; the map approach breaks.
- **Balanced BST from a sorted array or list?** Middle as root; for a list, build in inorder while advancing a list pointer.
- **Follow-up: how would you send a tree over the network instead?** Serialise preorder with `null` markers so one sequence suffices ([[a6-serialization]]).

```quiz
Q: Preorder is [1, 2] and the values are distinct. Which statement is true?
- [ ] The tree must be 1 with left child 2
- [ ] The tree must be 1 with right child 2
- [x] Either shape is possible, so preorder alone does not determine the tree
- [ ] The tree must be 2 with left child 1
> Preorder lists the root first and then the subtrees, but it does not say on which side a single child sits. Both "2 is the left child" and "2 is the right child" give preorder [1, 2]. Adding inorder resolves it: [2, 1] means left, [1, 2] means right.

Q: In the O(n) preorder + inorder construction, why can a single pointer into preorder replace preorder index ranges?
- [ ] Because preorder is sorted
- [x] Because the recursion creates nodes in exactly preorder: root, then the whole left subtree, then the right
- [ ] Because the inorder map stores preorder positions
- [ ] Because each subtree has the same size
> The builder creates the root, recurses fully into the left subtree, then into the right. That is the definition of preorder, so the next node it needs is always the next unused preorder value. This is also why the left call must come before the right call.

Q: You rebuild a tree from postorder and inorder, reading postorder from the end. In which order must the subtrees be built?
- [ ] Left, then right
- [x] Right, then left
- [ ] Either order works
- [ ] Both at the same time
> Postorder is left, right, root. Read backwards it is root, right, left, so after taking the root from the end, the next values belong to the right subtree. Building the left subtree first would hand it the right subtree's values.

Q: Which construction is only unique for full binary trees (every node has 0 or 2 children)?
- [ ] Preorder + inorder
- [ ] Postorder + inorder
- [x] Preorder + postorder
- [ ] Preorder of a BST
> When a node has exactly one child, preorder and postorder both list the child next to the parent in the same way whether it is a left or a right child. With inorder, or with the BST ordering, the side is determined.
```

## Practice

1. **Construct Binary Tree from Preorder and Inorder Traversal.** Write the copying version, then the O(n) version, and test with a round trip.
2. **Construct Binary Tree from Inorder and Postorder Traversal.** Explain why the right subtree is built first.
3. **Construct Binary Tree from Preorder and Postorder Traversal.** Find two different trees that match `pre = [1, 2]`, `post = [2, 1]`.
4. **Construct Binary Search Tree from Preorder Traversal.** Solve in O(n) with an upper bound.
5. **Convert Sorted Array to Binary Search Tree** and **Convert Sorted List to Binary Search Tree.**
6. **Maximum Binary Tree.** Write the O(n²) recursion, then the monotonic stack.
7. **Create Binary Tree From Descriptions.** Find the root without recursion.

The DSA explorer lists these under Trees; start with *Construct Binary Tree from Preorder and Inorder Traversal*.

## Quick revision {#quick-revision}

- Preorder: root first. Postorder: root last. Inorder: splits around a known root and gives subtree sizes.
- One plain traversal never determines a tree. Pre + in, post + in and level + in do (distinct values). Pre + post only for full binary trees.
- Pre + in in O(n): map value → inorder index; recurse on inorder `[lo, hi]`; `lo > hi` → `null`; root = `pre[preIdx++]`; left `[lo, mid - 1]`, right `[mid + 1, hi]`; build left before right.
- Post + in: root = `post[postIdx--]`; build right before left.
- Pre + post: `pre[i]` after the root is the left child's root; its postorder index ends the left block.
- BST from preorder: recurse with an upper bound; O(n), no map.
- Sorted array → balanced BST: middle element as root.
- Maximum binary tree: monotonic decreasing stack; last popped is the left child; new node is the right child of the new top.
- Parent rows: map id → node; the root is the value never seen as a child.
- Complete tree in an array: children `2i + 1`, `2i + 2`, parent `(i - 1) / 2`.
- Test constructions with a round trip: rebuild, traverse, compare.

## Key takeaways {#key-takeaways}

- A traversal loses shape information, so rebuilding a tree needs either two traversals, one of them inorder, or extra structure such as `null` markers or the BST ordering.
- Preorder or postorder identifies each root, and inorder splits the remaining values into the left and right subtrees.
- The O(n) construction comes from removing repeated work: a map replaces searching, index ranges replace copying, and a moving pointer replaces preorder ranges because the recursion creates nodes in preorder.
- Postorder is preorder's mirror image: read it from the end and build the right subtree first.
- Many construction problems have their own linear-time trick — bounds for BSTs, the middle element for balance, a monotonic stack for maximum trees, a map for parent rows.
- Always state assumptions about distinct values and verify a construction with a round-trip test.
