---
summary: Depth-first search walks a tree by going as deep as possible along one branch before backing up. You will learn the three depth-first orders, how to pass information down and up a tree, how to collect root-to-leaf paths with backtracking, and how to write every traversal iteratively when recursion is not an option.
difficulty: intermediate
minutes: 60
objectives:
  - Trace preorder, inorder and postorder on any tree and choose the right order for a problem
  - Design top-down (parameter) and bottom-up (return value) DFS solutions and combine them
  - Implement root-to-leaf path collection with correct backtracking and defensive copying
  - Write iterative preorder, inorder and postorder traversals with an explicit stack and explain Morris traversal
  - Derive O(n) time and O(h) space for DFS and replace an O(n²) per-node recomputation with a single pass
---

## Introduction

Almost every question you can ask about a binary tree — how deep is it, does it contain a path that sums to 22, is it a valid binary search tree, what is the longest path between two nodes — needs you to visit nodes in some organised way. **Depth-first search (DFS)** is the most common way: start at the root, go down one branch as far as it goes, then back up to the most recent node that still has an unexplored branch and go down that one. It is called depth-first because it reaches the bottom of one branch before it looks sideways at any other.

On a binary tree, DFS is what you get when you write the obvious recursive function: handle `null`, recurse left, recurse right. That makes it the default tool for tree problems. The skill is not writing the traversal — it is three lines — but deciding *what to do at each node, and when*: before the children (to pass information down), between them, or after them (to combine their answers). This lesson teaches those decisions.

DFS also appears far outside trees. File-system tools such as `du` compute directory sizes depth-first, compilers walk syntax trees depth-first, garbage collectors mark reachable objects depth-first, and React walks its component tree depth-first when it renders. The graph version of the algorithm, which adds a visited set because graphs can have cycles, is covered in [[a8-dfs]].

## Before you start

- **Binary trees** — `TreeNode`, leaves, subtrees and the base case / recurse / combine recipe. See [[a6-binary-trees]].
- **Recursion and the call stack** — how frames are pushed and popped. See [[a1-recursion]].
- **Stacks** — last in, first out (LIFO); needed for the iterative versions. See [[a5-stack]].

## The intuition

Imagine exploring a cave system with one rule: at every fork, take the leftmost passage you have not tried. When you hit a dead end, walk back to the most recent fork with an untried passage and take it. You never need a map of the whole cave, only a memory of the forks between you and the entrance — and you revisit those forks in reverse order of how you reached them. That memory is a **stack**: the last fork you passed is the first one you return to.

Recursion gives you that stack for free. When `dfs(node)` calls `dfs(node.left)`, the current call pauses and its frame waits on the call stack; when the left call returns, the paused call resumes and moves on to `node.right`. The chain of paused calls is exactly the path from the root to the node you are standing on.

There is a second picture that makes the three DFS orders easy to remember. Think of DFS as **touching each node three times**:

1. on the way down, before visiting its left subtree;
2. in between, after the left subtree and before the right;
3. on the way back up, after the right subtree.

The walk is identical every time. **Preorder**, **inorder** and **postorder** differ only in which of those three touches you choose to *process* the node at.

## The three depth-first orders

We will use this tree:

```text
          1
        /   \
       2     3
      / \     \
     4   5     6
```

```java title="ThreeOrders.java"
import java.util.ArrayList;
import java.util.List;

public class ThreeOrders {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
        TreeNode(int val, TreeNode left, TreeNode right) {
            this.val = val; this.left = left; this.right = right;
        }
    }

    static void preorder(TreeNode node, List<Integer> out) {
        if (node == null) return;
        out.add(node.val);            // touch 1: before the children
        preorder(node.left, out);
        preorder(node.right, out);
    }

    static void inorder(TreeNode node, List<Integer> out) {
        if (node == null) return;
        inorder(node.left, out);
        out.add(node.val);            // touch 2: between the children
        inorder(node.right, out);
    }

    static void postorder(TreeNode node, List<Integer> out) {
        if (node == null) return;
        postorder(node.left, out);
        postorder(node.right, out);
        out.add(node.val);            // touch 3: after the children
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(1,
                new TreeNode(2, new TreeNode(4), new TreeNode(5)),
                new TreeNode(3, null, new TreeNode(6)));

        List<Integer> pre = new ArrayList<>(), in = new ArrayList<>(), post = new ArrayList<>();
        preorder(root, pre);
        inorder(root, in);
        postorder(root, post);
        System.out.println("preorder:  " + pre);
        System.out.println("inorder:   " + in);
        System.out.println("postorder: " + post);
    }
}
```

```output
preorder:  [1, 2, 4, 5, 3, 6]
inorder:   [4, 2, 5, 1, 3, 6]
postorder: [4, 5, 2, 6, 3, 1]
```

The three methods are identical except for the position of one line. Check the outputs against the "three touches" picture. Preorder lists `1` first, because the root is touched on the way down before anything else. Postorder lists `1` last, because the root is the last node the walk climbs back through. Inorder lists everything in the left subtree of `1`, then `1`, then everything in its right subtree.

Each order has a natural use, and recognising which one a problem needs is half the solution:

| Order | Node is processed | Natural for | Examples |
|---|---|---|---|
| Preorder (node, left, right) | before its subtrees | Work that a parent must do before its children; copying; serialising with the root first | Copy a tree, serialise ([[a6-serialization]]), pass a running sum or depth down |
| Inorder (left, node, right) | between its subtrees | Binary search trees, where it visits values in sorted order | Validate a BST, kth smallest, convert a BST to a sorted list ([[a6-bst]]) |
| Postorder (left, right, node) | after its subtrees | Answers that depend on the children's answers | Height ([[a6-height-depth]]), diameter ([[a6-diameter]]), deleting a tree, evaluating an expression |

Inorder only produces sorted output for a **binary search tree**. On the tree above it produces `[4, 2, 5, 1, 3, 6]`, which is not sorted, because this tree has no ordering rule. Confusing the two is a common interview misconception.

## Two directions of information

The order tells you *when* a node is processed. The other design decision is *which way information flows*. Tree DFS problems come in two flavours, and many combine them.

### Top-down: pass information to the children

In a **top-down** DFS, each call receives something from its parent as a parameter — a depth, a running sum, the largest value seen so far, an allowed range — and uses it before recursing. The work happens on the way down, so the code has a preorder shape.

Consider LeetCode's *Count Good Nodes in Binary Tree*: a node is **good** if no node on the path from the root to it has a larger value. A node cannot decide this by looking at its subtrees; it needs to know the largest value *above* it. So the parent passes that value down:

```java
static int goodNodes(TreeNode node, int maxAbove) {
    if (node == null) return 0;
    int good = node.val >= maxAbove ? 1 : 0;
    int newMax = Math.max(maxAbove, node.val);
    return good + goodNodes(node.left, newMax) + goodNodes(node.right, newMax);
}
// call: goodNodes(root, Integer.MIN_VALUE)
```

Each call gets its own copy of `maxAbove`, because Java passes `int` by value. That is what makes top-down recursion with primitive parameters so tidy: when the call for the left child returns, the parent's `newMax` is untouched and is passed to the right child unchanged. Nothing has to be undone.

### Bottom-up: return information to the parent

In a **bottom-up** DFS, each call returns a summary of its subtree, and the parent combines its children's summaries. The work happens on the way up, so the code has a postorder shape. Height is the classic case: a node's height is one more than the larger of its children's heights, so it cannot be computed until both children have answered.

Top-down and bottom-up often appear together. Validating a binary search tree passes the allowed range down and returns `true` or `false` up. Path problems pass the current path down and return results up.

### One pass instead of many

The bottom-up style is also how you avoid a hidden quadratic cost. Take this problem: count the nodes whose value equals the sum of all their descendants. The direct approach calls a `sum` helper at every node:

```java
static int countNaive(TreeNode node) {
    if (node == null) return 0;
    int self = node.val == sum(node.left) + sum(node.right) ? 1 : 0;
    return self + countNaive(node.left) + countNaive(node.right);
}
```

It is correct, but each `sum` call walks the whole subtree, so every node is summed once for each of its ancestors. On a degenerate tree of `n` nodes, the node at depth `d` is summed by `d` ancestors, for a total of `0 + 1 + … + (n - 1) = n(n - 1) / 2` visits — O(n²). On a balanced tree each node has about `log₂ n` ancestors, giving O(n log n). Either way, the same subtree sums are computed over and over.

The fix is to notice that the parent's sum *contains* the children's sums. If each call returns its subtree sum, the parent gets both children's sums for free and can test itself in O(1):

```java title="SumOfDescendants.java"
public class SumOfDescendants {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
        TreeNode(int val, TreeNode left, TreeNode right) {
            this.val = val; this.left = left; this.right = right;
        }
    }

    static int count = 0;

    /** Returns the sum of the subtree rooted at node; counts matching nodes on the way. */
    static long subtreeSum(TreeNode node) {
        if (node == null) return 0;
        long left = subtreeSum(node.left);
        long right = subtreeSum(node.right);
        if (node.val == left + right) count++;   // side effect: the answer we want
        return left + right + node.val;          // return value: what the parent needs
    }

    public static void main(String[] args) {
        //        10
        //       /  \
        //      3    4
        //     / \
        //    2   1
        TreeNode root = new TreeNode(10,
                new TreeNode(3, new TreeNode(2), new TreeNode(1)),
                new TreeNode(4));
        subtreeSum(root);
        System.out.println(count);
    }
}
```

```output
2
```

Node `3` matches (`2 + 1`) and node `10` matches (`2 + 1 + 3 + 4`). The leaves `2`, `1` and `4` do not, because their descendant sum is `0`. Each node is now visited once, so the time is O(n).

Notice the two separate channels. The **return value** is the subtree sum, because that is what the parent needs to do its own check. The **answer** — the count — is something no parent needs, so it is accumulated on the side. Mixing those two up, for example by returning the count, would leave the parent unable to compute its sum. This "return what the parent needs, record what the problem asks for" split is the heart of [[a6-diameter]] and many path problems.

A `static` field is the shortest way to record the answer, but it keeps its value between calls, so it must be reset before each new tree. In production code, prefer an instance field in a solver object, a one-element array (`int[] count = {0}`) passed into the recursion, or returning a small record holding both values.

## Backtracking: collecting root-to-leaf paths

Some problems ask not for a number but for the paths themselves. *Path Sum II* asks for every root-to-leaf path whose values add up to a target. A top-down DFS can carry the current path as a list: add the node when you arrive, and when you reach a leaf with the right sum, save the path.

The subtlety is that a `List` is an object, not a primitive. All the calls share the *same* list, so whatever one call adds stays there until someone removes it. When a call finishes, it must remove the node it added, so its parent sees the path exactly as it was before. That undo step is called **backtracking**.

```java title="PathSumII.java"
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

public class PathSumII {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    static List<List<Integer>> pathSum(TreeNode root, int target) {
        List<List<Integer>> result = new ArrayList<>();
        dfs(root, target, new ArrayList<>(), result);
        return result;
    }

    static void dfs(TreeNode node, int remaining, List<Integer> path,
                    List<List<Integer>> result) {
        if (node == null) return;
        path.add(node.val);                                   // choose
        remaining -= node.val;
        if (node.left == null && node.right == null) {        // a real leaf
            if (remaining == 0) result.add(new ArrayList<>(path)); // save a copy
        } else {
            dfs(node.left, remaining, path, result);          // explore
            dfs(node.right, remaining, path, result);
        }
        path.remove(path.size() - 1);                         // un-choose
    }

    static TreeNode fromLevelOrder(Integer[] v) {
        TreeNode root = new TreeNode(v[0]);
        Queue<TreeNode> q = new ArrayDeque<>(List.of(root));
        for (int i = 1; i < v.length; i += 2) {
            TreeNode p = q.remove();
            if (v[i] != null) q.add(p.left = new TreeNode(v[i]));
            if (i + 1 < v.length && v[i + 1] != null) q.add(p.right = new TreeNode(v[i + 1]));
        }
        return root;
    }

    public static void main(String[] args) {
        //            5
        //          /   \
        //         4     8
        //        /     / \
        //      11     13  4
        //     /  \       / \
        //    7    2     5   1
        TreeNode root = fromLevelOrder(new Integer[]
                {5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1});
        System.out.println(pathSum(root, 22));
        System.out.println(pathSum(root, 26));
        System.out.println(pathSum(root, 9));   // 5 + 4 is not a leaf path
    }
}
```

```output
[[5, 4, 11, 2], [5, 8, 4, 5]]
[[5, 8, 13]]
[]
```

Three details make this correct. First, `remaining` is an `int`, so each call has its own copy and it never needs undoing; only the shared `path` list does. Second, the path is saved as `new ArrayList<>(path)`. Saving `path` itself would store a reference to the one shared list, which the backtracking steps later empty — every saved "path" would end up as `[]`. Third, the target is checked only at a **leaf**: in the last query, `5 + 4 = 9`, but node `4` has a child, so `[5, 4]` is not a root-to-leaf path and the answer is empty.

Here is the start of the search for target 22, showing the shared list as it grows and shrinks:

| Step | Event | `path` after the step | `remaining` |
|---|---|---|---|
| 1 | arrive at 5 | [5] | 17 |
| 2 | arrive at 4 | [5, 4] | 13 |
| 3 | arrive at 11 | [5, 4, 11] | 2 |
| 4 | arrive at leaf 7 | [5, 4, 11, 7] | -5, not saved |
| 5 | leave 7 | [5, 4, 11] | |
| 6 | arrive at leaf 2 | [5, 4, 11, 2] | 0, saved |
| 7 | leave 2, 11, 4 | [5] | |
| 8 | arrive at 8 | [5, 8] | 9 |

The traversal itself is O(n), but each saved path costs up to O(h) to copy, so the total is O(n + L·h) for `L` saved paths — which can reach O(n²) on adversarial shapes, simply because the output itself can be that large. Space is O(h) for the recursion and the path, not counting the output. This choose–explore–un-choose shape is the same one used throughout backtracking ([[a9-subsets]], [[a9-permutations]]); trees are where most people first meet it. Further path variants, such as paths that may start anywhere, are in [[a6-path-problems]].

## Iterative DFS with an explicit stack

Recursion uses the call stack, which is limited — a few thousand to tens of thousands of frames by default in Java. A tree with a million nodes in a chain throws `StackOverflowError` ([[c2-stackoverflow]]). Interviewers also ask for iterative versions to check that you understand what the recursion is doing. The fix is to manage the stack yourself, with an `ArrayDeque` used as a stack (`push`, `pop`, `peek`).

### Preorder

Preorder processes a node the moment it is reached, so the iterative version is straightforward: pop a node, process it, then push its children. The stack is LIFO, so push the **right child first**, which leaves the left child on top to be processed next.

### Inorder

Inorder is harder, because a node must wait until its whole left subtree is finished. The trick is to walk left as far as possible, pushing every node on the way — those are the nodes still waiting for their left subtree to finish. When you cannot go further, pop the top node: its left subtree is done, so process it, and then move into its right subtree and repeat.

### Postorder

Postorder must wait for both subtrees. The simplest correct method uses an observation: postorder is left, right, node. Reverse that and you get node, right, left — which is preorder with the children swapped. So run the iterative preorder pushing the left child first, collect the output, and reverse it. A single-stack version also exists: it peeks at the top node and processes it only if it has no right child or its right child was the last node processed.

```java title="IterativeDfs.java"
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Deque;
import java.util.List;

public class IterativeDfs {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
        TreeNode(int val, TreeNode left, TreeNode right) {
            this.val = val; this.left = left; this.right = right;
        }
    }

    static List<Integer> preorder(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        if (root != null) stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            out.add(node.val);
            if (node.right != null) stack.push(node.right);  // pushed first, popped later
            if (node.left != null) stack.push(node.left);
        }
        return out;
    }

    static List<Integer> inorder(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode cur = root;
        while (cur != null || !stack.isEmpty()) {
            while (cur != null) {            // nodes waiting for their left subtree
                stack.push(cur);
                cur = cur.left;
            }
            cur = stack.pop();               // its left subtree is finished
            out.add(cur.val);
            cur = cur.right;                 // now do its right subtree
        }
        return out;
    }

    static List<Integer> postorderByReversal(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        if (root != null) stack.push(root);
        while (!stack.isEmpty()) {           // produces node, right, left
            TreeNode node = stack.pop();
            out.add(node.val);
            if (node.left != null) stack.push(node.left);
            if (node.right != null) stack.push(node.right);
        }
        Collections.reverse(out);            // becomes left, right, node
        return out;
    }

    static List<Integer> postorderOneStack(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode cur = root, lastVisited = null;
        while (cur != null || !stack.isEmpty()) {
            while (cur != null) {
                stack.push(cur);
                cur = cur.left;
            }
            TreeNode top = stack.peek();
            if (top.right != null && top.right != lastVisited) {
                cur = top.right;             // right subtree not done yet
            } else {
                out.add(top.val);            // both subtrees done
                lastVisited = stack.pop();
            }
        }
        return out;
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(1,
                new TreeNode(2, new TreeNode(4), new TreeNode(5)),
                new TreeNode(3, null, new TreeNode(6)));
        System.out.println("preorder:         " + preorder(root));
        System.out.println("inorder:          " + inorder(root));
        System.out.println("postorder (rev):  " + postorderByReversal(root));
        System.out.println("postorder (1 st): " + postorderOneStack(root));
        System.out.println("empty inorder:    " + inorder(null));
    }
}
```

```output
preorder:         [1, 2, 4, 5, 3, 6]
inorder:          [4, 2, 5, 1, 3, 6]
postorder (rev):  [4, 5, 2, 6, 3, 1]
postorder (1 st): [4, 5, 2, 6, 3, 1]
empty inorder:    []
```

The outputs match the recursive versions exactly, which is the test you should always apply to an iterative traversal. Here is the iterative inorder on the example tree, one row per pop:

| Pushed while walking left | Stack after walking (top first) | Pop and output | Move to |
|---|---|---|---|
| 1, 2, 4 | 4, 2, 1 | 4 | `4.right` = null |
| none | 2, 1 | 2 | 5 |
| 5 | 5, 1 | 5 | `5.right` = null |
| none | 1 | 1 | 3 |
| 3 | 3 | 3 | 6 |
| 6 | 6 | 6 | null; stack empty, stop |

At every moment the stack holds the ancestors whose left subtree is still in progress — exactly the paused frames the recursive version would have. That is why its size never exceeds the height plus one.

The reversal trick for postorder uses O(n) extra space for the output list, which you need anyway when returning a list, but it cannot be used when you must *act* on each node in postorder as you go (for example, freeing child resources before the parent). The single-stack version processes nodes in true postorder and uses O(h) space.

### Morris traversal: inorder in O(1) extra space

Every method so far uses O(h) memory for a stack. **Morris traversal** visits a tree in inorder using O(1) extra space by temporarily rewiring the tree. The stack exists to answer one question: "after I finish this left subtree, where do I go back to?" Morris answers it by making the last node of the left subtree — the current node's **inorder predecessor**, the rightmost node in its left subtree — point back to the current node through its unused `right` reference. That temporary link is called a **thread**.

```java
static List<Integer> morrisInorder(TreeNode root) {
    List<Integer> out = new ArrayList<>();
    TreeNode cur = root;
    while (cur != null) {
        if (cur.left == null) {
            out.add(cur.val);                      // nothing on the left: visit
            cur = cur.right;                       // (may follow a thread back up)
        } else {
            TreeNode pred = cur.left;              // find the inorder predecessor
            while (pred.right != null && pred.right != cur) pred = pred.right;
            if (pred.right == null) {
                pred.right = cur;                  // first arrival: lay the thread
                cur = cur.left;
            } else {
                pred.right = null;                 // second arrival: remove it
                out.add(cur.val);                  // left subtree done: visit
                cur = cur.right;
            }
        }
    }
    return out;
}
```

On the example tree this returns `[4, 2, 5, 1, 3, 6]`, the same as before, and leaves the tree exactly as it found it. Each node with a left child is reached twice: once to lay its thread and once, via the thread, to remove it. Each predecessor search walks down a right spine, and every edge is walked by such searches at most twice in total, so the running time is still O(n). The price is that the tree is modified while the traversal runs, so it is unsafe if another thread reads the tree at the same time, and an exception mid-traversal leaves threads behind. Morris traversal is a favourite follow-up question rather than something you would normally ship.

## Complexity

**Time.** Every DFS above calls itself (or pushes) once per node and once per `null` child, and does O(1) work per call apart from the recursion. With `n` nodes there are `n + 1` null children, so the total is O(n). The work you add per node changes this: O(1) per node keeps it O(n); calling an O(subtree) helper per node makes it O(n²) in the worst case, as the descendant-sum example showed.

**Space.** The recursion stack — or the explicit stack — holds one entry per node on the current root-to-node path, so its maximum size is O(h). For a balanced tree that is O(log n); for a chain it is O(n). Iterative preorder can hold one pushed-but-unvisited right child for each node on the current path, which is still O(h) entries. Any output list is O(n) on top of that.

| Version | Time | Extra space | Notes |
|---|---|---|---|
| Recursive | O(n) | O(h) call stack | Shortest code; can overflow on deep trees |
| Iterative with stack | O(n) | O(h) heap stack | Safe for deep trees; inorder and postorder are fiddlier |
| Morris (inorder) | O(n) | O(1) | Temporarily modifies the tree |

## In real systems

**Disk usage and deletion.** Computing the size of a directory needs the sizes of everything inside it first: a postorder walk. Deleting a directory tree is also postorder, because a directory can only be removed once it is empty. `du` and `rm -r` both work this way.

**Serialisation and copying.** Writing a tree to disk in preorder puts each parent before its children, so a reader can rebuild the tree in one pass, creating each node before attaching its subtrees ([[a6-serialization]]).

**Compilers.** After parsing, a compiler walks the abstract syntax tree depth-first many times: once to resolve names (top-down, passing the current scope), once to compute types (bottom-up, since an expression's type depends on its operands), and once to emit code.

**UI frameworks.** React's reconciler walks its fiber tree depth-first: it begins work on a component on the way down, descending into the first child, and completes it on the way back up once all its children are complete ([[b4-fiber-tree]]). That is a preorder touch and a postorder touch on the same walk.

**Garbage collection.** Many mark-and-sweep collectors mark reachable objects with a depth-first walk from the roots, driven by an explicit mark stack. Objects form a graph rather than a tree, so the collector keeps a mark bit per object as its visited set, which is the step that turns tree DFS into graph DFS ([[a8-dfs]]).

## Trade-offs and alternatives

DFS is not the only way to visit a tree. **Breadth-first search** ([[a6-bfs]]) visits level by level using a queue, and each is better at different questions:

| Question | Better choice | Why |
|---|---|---|
| Anything about root-to-leaf paths | DFS | The current path is exactly the recursion stack |
| A subtree property (height, sum, balance) | DFS (postorder) | Children's answers are available when the parent is processed |
| BST in sorted order | DFS (inorder) | Inorder visits keys in ascending order |
| Anything per level, or the shallowest leaf | BFS | BFS finishes each level before the next; the first leaf found is the shallowest |
| Memory on a very wide, shallow tree | DFS | DFS stores O(h); BFS stores a whole level, O(w) |
| Memory on a very deep, narrow tree | BFS | BFS stores O(w); DFS stores O(h) |

A perfect binary tree with a million nodes has height 19 but a bottom level of about half a million nodes, so DFS needs about 20 stack entries while BFS needs about 500,000 queue entries. DFS is usually the more memory-frugal choice on bushy trees.

## Common mistakes

> [!MISTAKE] Saving the shared path instead of a copy
> `result.add(path)` stores a reference to the one list every call is editing. Backtracking later removes all its elements, so every saved path ends up empty or wrong. Save `new ArrayList<>(path)`.

**Forgetting to backtrack.** If you add a node to a shared list and do not remove it before returning, the right subtree sees the left subtree's nodes still in the path. Put the removal at the end of the method, on every path out — not only inside the leaf branch.

**Checking the target at `null` instead of at a leaf.** Testing `remaining == 0` when `node == null` counts a path that ends at a node with one child, because that node's missing child is `null`. Root-to-leaf conditions must be tested where both children are `null`.

**Pushing children in the wrong order.** In iterative preorder, pushing left then right processes the right subtree first. Remember: the stack reverses order, so push in the reverse of the order you want to visit.

**Returning the answer instead of what the parent needs.** In bottom-up problems the return value must be what the parent needs to compute *its* answer (a height, a sum, a gain). The problem's final answer often belongs in a separate variable.

**Static state between test cases.** A `static int count` that is not reset makes the second test case include the first one's count. Reset it in the public entry method, or avoid statics.

**Overflow in sums.** Path and subtree sums of many `int` values can exceed `Integer.MAX_VALUE`; use `long` when values and node counts are large, as the descendant-sum example does.

## Interview perspective

Interviewers expect recursive DFS as the default and watch for three things: a clean `null` base case, a clearly stated return value, and correct complexity (O(n) time, O(h) space). Naming the traversal order you are using, and why, is a strong signal.

> [!INTERVIEW] Explaining a DFS design
> "I'll do a postorder DFS that returns the subtree sum, because each node needs both children's sums before it can check itself. The count isn't needed by any parent, so I'll keep it in a separate variable. One visit per node, so O(n) time; recursion depth is the height, so O(h) space."

Questions to be ready for:

- **Name the three DFS orders and a use for each.** Preorder for copying and serialising; inorder for sorted BST order; postorder for bottom-up properties such as height.
- **Write inorder iteratively.** Walk left pushing nodes; pop, visit, move to the right child; loop while the current node is non-null or the stack is non-empty.
- **Why might recursion fail in production?** Stack depth is proportional to height, and a skewed tree of hundreds of thousands of nodes overflows the default thread stack.
- **Can you do inorder in O(1) space?** Morris traversal, using temporary threads from each node's inorder predecessor; O(n) time, but it modifies the tree while running.
- **Why `new ArrayList<>(path)`?** Because the path list is shared and mutated by backtracking; you must snapshot it.
- **Validate a BST.** Top-down DFS passing an open interval `(low, high)`; each node must fall inside it, and its children get narrowed intervals. Use `long` bounds so `Integer.MIN_VALUE` and `Integer.MAX_VALUE` nodes work.

```quiz
Q: Which traversal order should compute the height of every node in one pass?
- [ ] Preorder, because the root is processed first
- [ ] Inorder, because it visits nodes in sorted order
- [x] Postorder, because a node's height needs both children's heights
- [ ] Level-order, because height is about levels
> Height(node) = 1 + max(height(left), height(right)), so a node can only be finished after both subtrees. That is postorder. Preorder processes a node before its children have been measured, and inorder's sorted property applies only to BSTs and is irrelevant here.

Q: In iterative preorder with a stack, why is the right child pushed before the left child?
- [ ] To save memory
- [x] Because the stack is LIFO, so the child pushed last is processed first
- [ ] Because preorder visits right subtrees first
- [ ] It makes no difference to the output
> A stack returns the most recently pushed item first. Pushing right then left leaves the left child on top, so the left subtree is processed before the right, matching node-left-right. Reversing the pushes produces node-right-left, which is a different order.

Q: A Path Sum II solution calls result.add(path) when it finds a matching leaf, and backtracks correctly. What does it return for a tree with two matching paths?
- [ ] Both correct paths
- [ ] Only the last path found
- [x] Two references to the same list, which is empty after the traversal finishes
- [ ] It throws ConcurrentModificationException
> Both entries refer to the single shared list. Backtracking removes every element before the top-level call returns, so both entries show []. Saving new ArrayList<>(path) snapshots the path at the moment it matched.

Q: Calling an O(size of subtree) helper at every node of a degenerate tree with n nodes costs how much in total?
- [ ] O(n)
- [ ] O(n log n)
- [x] O(n²)
- [ ] O(2^n)
> In a chain, the subtree below the node at depth d has n - d nodes, so the helper calls cost n + (n - 1) + ... + 1 = n(n + 1)/2. Returning the helper's result from a postorder DFS instead lets each parent reuse its children's work, giving O(n).
```

## Practice

1. **Traversals three ways.** Implement preorder, inorder and postorder recursively, iteratively and (for inorder) with Morris traversal. Test them against each other on random trees.
2. **Count good nodes.** Pass the maximum value seen so far down the tree.
3. **Path Sum.** Return whether any root-to-leaf path sums to the target. Then do Path Sum II.
4. **Sum root-to-leaf numbers.** Each root-to-leaf path such as 1 → 2 → 3 represents the number 123; return the sum of all of them. Which value is passed down?
5. **Validate a binary search tree.** Use top-down bounds, then solve it again with an inorder traversal that checks each value is greater than the previous one.
6. **Flatten a tree to a linked list.** Rearrange the tree in place so that it follows preorder using only right pointers.

The DSA explorer lists these under Trees; start with *Binary Tree Inorder Traversal*, *Path Sum II* and *Count Good Nodes in Binary Tree*.

## Quick revision {#quick-revision}

- DFS goes deep along one branch, then backtracks; recursion's call stack holds the current root-to-node path.
- Each node is touched three times; preorder processes on the first touch, inorder on the second, postorder on the third.
- Preorder (N L R): copy, serialise, pass context down. Inorder (L N R): sorted order for a BST only. Postorder (L R N): height, sums, deletion — anything needing children's answers.
- Top-down: pass state as parameters (depth, max so far, bounds). Bottom-up: return subtree summaries. Many problems use both.
- Return what the parent needs; record the final answer separately. Reset any shared state per input.
- Backtracking on paths: add, recurse, remove; save `new ArrayList<>(path)`; test the condition at a leaf.
- Iterative preorder: pop, visit, push right then left. Inorder: push left spine, pop, visit, go right. Postorder: reversed (N R L) preorder, or one stack with `lastVisited`.
- Morris inorder: O(1) space via temporary threads from the inorder predecessor; O(n) time; modifies the tree while running.
- Complexity: O(n) time, O(h) space; an O(subtree) helper per node makes it O(n²).

## Key takeaways {#key-takeaways}

- Tree DFS is the three-line recursion — handle `null`, recurse left, recurse right — plus a decision about when to process the node and which way information flows.
- Choose the order from the question: preorder when parents act before children, inorder for sorted BST order, postorder when a node's answer depends on its subtrees.
- A single bottom-up pass that returns subtree summaries replaces repeated per-node recomputation and turns O(n²) into O(n).
- When a shared mutable object such as a path list is passed down, undo every change before returning and copy it before saving.
- Every recursive traversal can be written with an explicit stack, which avoids `StackOverflowError` on deep trees; Morris traversal goes further to O(1) extra space.
- DFS costs O(n) time and O(h) memory, which makes it the frugal choice for wide, bushy trees.
