---
summary: A binary search tree keeps its keys ordered so that every comparison discards a whole subtree, giving fast search, insertion and deletion on data that keeps changing. You will learn the ordering rule and why it makes inorder traversal sorted, implement every core operation, validate a tree correctly, and see why balance decides whether operations cost O(log n) or O(n).
difficulty: intermediate
minutes: 65
objectives:
  - State the binary-search-tree property precisely and explain why checking only parent and child is not enough
  - Implement search, insert and delete (including the two-child case) and trace them on a concrete tree
  - Validate a BST with value bounds or an inorder pass, handling extreme values correctly
  - Answer ordered queries — min, max, floor, ceiling, kth smallest, range sum — in O(h) or O(h + k)
  - Explain how insertion order and self-balancing determine the height, and choose between a BST, TreeMap, sorted array and HashMap
---

## Introduction

Suppose you are building a leaderboard. Scores arrive constantly, and at any moment you need to answer questions such as "is anyone on exactly 4,200 points?", "who is the next player above 4,200?" and "list everyone between 4,000 and 5,000 in order". The data keeps changing, and the questions are about **order**.

The structures you already know each fail one of these needs. A **sorted array** answers order questions with binary search in O(log n) ([[a3-binary-search]]), but inserting a new score means shifting everything after it, which is O(n). A **linked list** inserts in O(1) once you are at the right spot, but finding that spot means walking the list, O(n). A **hash map** finds an exact score in O(1) on average but knows nothing about order — it cannot tell you the next score above 4,200 without looking at every entry.

A **binary search tree (BST)** combines the strengths. It is a binary tree ([[a6-binary-trees]]) with one extra rule about where keys may sit, and that rule lets every comparison discard an entire subtree, the way binary search discards half an array. Because it is made of linked nodes, inserting and deleting only rewires a few references. On a well-shaped tree, search, insert, delete and "next larger key" all take O(log n).

BSTs are worth learning in depth for two reasons. They are among the most frequently asked interview topics — validating a BST, finding the kth smallest key, and lowest common ancestor in a BST are staples. And they are the basis of the ordered maps and sets you use in production: Java's `TreeMap` and `TreeSet` are self-balancing BSTs.

## Before you start

- **Binary trees** — nodes, subtrees, height, and the recursive recipe. See [[a6-binary-trees]].
- **Binary search** — how one comparison against a middle element rules out half the candidates. See [[a3-binary-search]].
- **Tree DFS** — preorder, inorder and postorder, top-down parameters and bottom-up returns. See [[a6-dfs]].

## The intuition

Binary search on a sorted array always compares against the middle element, then the middle of the remaining half, and so on. Write down all the middles you could possibly compare against, in the order you would meet them, and you get a tree: the array's middle at the top, the middles of the left and right halves below it, and so on down. A BST is that decision structure **built out of nodes** instead of computed from array indices.

Searching a BST is therefore the same game as guessing a number with "higher" or "lower" answers. At each node you compare the target with the node's key. Equal: found. Smaller: the target can only be in the left subtree, so go left. Larger: go right. Each step throws away a whole subtree without looking at it.

Where the analogy stops: in an array, binary search always splits exactly in half, so it always takes O(log n) steps. A BST splits wherever its nodes happen to be, and if the keys were inserted in an unlucky order the "halves" can be wildly lopsided. That is the central weakness of a plain BST, and the reason self-balancing trees exist.

## The BST property

A binary tree is a binary search tree when, **for every node**:

- every key in its **left subtree** is less than the node's key, and
- every key in its **right subtree** is greater than the node's key.

The words "every key in its subtree" carry the whole definition. It is not enough for each node to be larger than its left child and smaller than its right child. Look at this tree:

```text
          10
         /  \
        5    15
            /  \
           6    20
```

Check each parent against its children: `5 < 10 < 15` and `6 < 15 < 20`. Every local comparison passes. But `6` is in the **right** subtree of `10`, and `6 < 10`, so this is *not* a BST. A search for `6` would compare with `10`, go left (because `6 < 10`), compare with `5`, go right, find `null`, and wrongly report that `6` is absent. The property must hold between each node and **all** of its descendants, which means it is a constraint that flows down from ancestors, not just from the parent.

**Duplicates.** The strict definition above allows no duplicate keys, which is how interview problems usually define a BST and how `TreeMap` behaves (inserting an existing key replaces its value). If duplicates must be stored, pick a rule and apply it consistently — for example, "equal keys go to the right", which changes the property to *left < node ≤ right* — or store a count in each node. Say which policy you are using.

### Why inorder traversal is sorted

**Inorder** traversal visits the left subtree, then the node, then the right subtree. On a BST, that visits keys in **ascending order**. The reason follows directly from the property, by induction on the size of the tree. An empty tree produces an empty, trivially sorted sequence. For a non-empty tree, assume inorder produces sorted sequences for the two (smaller) subtrees. Inorder outputs the left subtree's keys (sorted, and all less than the root), then the root, then the right subtree's keys (sorted, and all greater than the root). Concatenating them gives a sorted sequence.

The converse is also true: if inorder traversal of a binary tree with distinct keys is strictly increasing, the tree is a BST. That gives one of the two standard validation methods, covered below. For the invalid tree above, inorder produces `5, 10, 6, 15, 20` — the `6` after `10` exposes the violation.

## Search

Searching only ever moves down, choosing one child at each step, so it needs no recursion or stack:

```java
static TreeNode search(TreeNode root, int key) {
    TreeNode cur = root;
    while (cur != null && cur.val != key) {
        cur = key < cur.val ? cur.left : cur.right;   // discard the other subtree
    }
    return cur;                                        // the node, or null if absent
}
```

Each iteration moves one level deeper, so the loop runs at most `h + 1` times, where `h` is the tree's height. Search is **O(h)** time and O(1) space. Whether that is fast depends entirely on `h`, which is the subject of the balance section below.

## Insert

A new key belongs exactly where an unsuccessful search for it ends. Search for the key; when you fall off the tree at a `null` reference, attach a new node there. That position is the only one that keeps the property: at every node on the way down, the search went left exactly when the new key was smaller, so the new node lands in the correct subtree of every ancestor.

The recursive form is compact because it returns the (possibly new) root of each subtree, and the parent re-attaches whatever it gets back:

```java
static TreeNode insert(TreeNode node, int key) {
    if (node == null) return new TreeNode(key);          // the empty spot: put it here
    if (key < node.val) node.left = insert(node.left, key);
    else if (key > node.val) node.right = insert(node.right, key);
    // key == node.val: already present, nothing to do
    return node;
}
// usage: root = insert(root, key);
```

Insertion is O(h) time. The recursive version uses O(h) stack space; an iterative version that tracks the parent uses O(1).

### Insertion order decides the shape

Insert the same seven keys in two different orders and compare:

```java title="BstShapes.java"
import java.util.ArrayList;
import java.util.List;

public class BstShapes {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    static TreeNode insert(TreeNode node, int key) {
        if (node == null) return new TreeNode(key);
        if (key < node.val) node.left = insert(node.left, key);
        else if (key > node.val) node.right = insert(node.right, key);
        return node;
    }

    static TreeNode search(TreeNode root, int key) {
        TreeNode cur = root;
        while (cur != null && cur.val != key) cur = key < cur.val ? cur.left : cur.right;
        return cur;
    }

    static int height(TreeNode node) {              // in edges; empty tree = -1
        if (node == null) return -1;
        return 1 + Math.max(height(node.left), height(node.right));
    }

    static void inorder(TreeNode node, List<Integer> out) {
        if (node == null) return;
        inorder(node.left, out);
        out.add(node.val);
        inorder(node.right, out);
    }

    static TreeNode build(int... keys) {
        TreeNode root = null;
        for (int k : keys) root = insert(root, k);
        return root;
    }

    public static void main(String[] args) {
        TreeNode balanced = build(4, 2, 6, 1, 3, 5, 7);
        TreeNode chain = build(1, 2, 3, 4, 5, 6, 7);

        List<Integer> a = new ArrayList<>(), b = new ArrayList<>();
        inorder(balanced, a);
        inorder(chain, b);
        System.out.println("balanced inorder: " + a + ", height " + height(balanced));
        System.out.println("chain inorder:    " + b + ", height " + height(chain));
        System.out.println("find 5: " + (search(balanced, 5) != null)
                + ", find 8: " + (search(balanced, 8) != null));
    }
}
```

```output
balanced inorder: [1, 2, 3, 4, 5, 6, 7], height 2
chain inorder:    [1, 2, 3, 4, 5, 6, 7], height 6
find 5: true, find 8: false
```

Both trees hold the same keys and both have the same sorted inorder sequence, but their shapes are completely different:

```text
 inserted 4,2,6,1,3,5,7          inserted 1,2,3,4,5,6,7
          4                      1
        /   \                     \
       2     6                     2
      / \   / \                     \
     1   3 5   7                     3 ... 7
```

In the first, a search touches at most three nodes. In the second, which is a linked list in disguise, a search for `7` touches all seven. Inserting keys that are already sorted — a very common real-world situation, such as IDs or timestamps that only increase — produces the worst possible shape.

## Delete

Deletion is the operation people find hardest, because removing a node must leave a valid BST behind. First search for the node; then handle one of three cases depending on how many children it has.

1. **No children (a leaf).** Remove it: the parent's reference becomes `null`.
2. **One child.** Replace the node with its only child. The child's whole subtree was already on the correct side of every ancestor, so moving it up one level keeps the property.
3. **Two children.** You cannot simply remove the node, because two subtrees would need one slot. Instead, find the node's **inorder successor** — the smallest key in its right subtree — copy that key into the node, and then delete the successor from the right subtree.

Why does the successor work in case 3? It is the next key after the deleted one in sorted order. It is larger than everything in the left subtree (it came from the right subtree), and smaller than everything else in the right subtree (it is the minimum there). So it can sit in the deleted node's position without breaking any comparison. And deleting the successor from the right subtree is easy, because the minimum of a subtree has **no left child** — otherwise that left child would be smaller — so removing it is always case 1 or case 2. The **inorder predecessor** (the largest key in the left subtree) works symmetrically.

```java title="BstDelete.java"
import java.util.ArrayList;
import java.util.List;

public class BstDelete {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    static TreeNode insert(TreeNode node, int key) {
        if (node == null) return new TreeNode(key);
        if (key < node.val) node.left = insert(node.left, key);
        else if (key > node.val) node.right = insert(node.right, key);
        return node;
    }

    /** Deletes key from the subtree and returns the subtree's new root. */
    static TreeNode delete(TreeNode node, int key) {
        if (node == null) return null;                     // key not present
        if (key < node.val) {
            node.left = delete(node.left, key);
        } else if (key > node.val) {
            node.right = delete(node.right, key);
        } else {
            if (node.left == null) return node.right;     // cases 1 and 2
            if (node.right == null) return node.left;     // case 2
            TreeNode succ = node.right;                    // case 3: min of right subtree
            while (succ.left != null) succ = succ.left;
            node.val = succ.val;                           // copy successor's key up
            node.right = delete(node.right, succ.val);     // remove the successor
        }
        return node;
    }

    static String preorder(TreeNode node) {               // shows the shape
        if (node == null) return "-";
        if (node.left == null && node.right == null) return String.valueOf(node.val);
        return node.val + "(" + preorder(node.left) + " " + preorder(node.right) + ")";
    }

    public static void main(String[] args) {
        TreeNode root = null;
        for (int k : new int[] {50, 30, 70, 20, 40, 60, 80, 65}) root = insert(root, k);
        System.out.println("start:        " + preorder(root));
        root = delete(root, 20);
        System.out.println("delete 20:    " + preorder(root));   // leaf
        root = delete(root, 30);
        System.out.println("delete 30:    " + preorder(root));   // one child
        root = delete(root, 50);
        System.out.println("delete 50:    " + preorder(root));   // two children
        root = delete(root, 99);
        System.out.println("delete 99:    " + preorder(root));   // absent
    }
}
```

```output
start:        50(30(20 40) 70(60(- 65) 80))
delete 20:    50(30(- 40) 70(60(- 65) 80))
delete 30:    50(40 70(60(- 65) 80))
delete 50:    60(40 70(65 80))
```

The printed form `node(left right)` uses `-` for an empty subtree. Wait — the output above stops at four lines, but the program prints five. Let us look at the last step properly. Deleting `99`, which is not in the tree, walks down to a `null` and returns it unchanged, so the tree is the same as after deleting `50`. The full output is:

```output
start:        50(30(20 40) 70(60(- 65) 80))
delete 20:    50(30(- 40) 70(60(- 65) 80))
delete 30:    50(40 70(60(- 65) 80))
delete 50:    60(40 70(65 80))
delete 99:    60(40 70(65 80))
```

Trace the two-child case, deleting `50` from `50(40 70(60(- 65) 80))`:

| Step | What happens | Tree afterwards |
|---|---|---|
| 1 | `50` has two children; its successor is the leftmost node of the right subtree: `70 → 60`, and `60` has no left child | unchanged |
| 2 | Copy `60` into the root | `60(40 70(60(- 65) 80))` |
| 3 | Delete `60` from the right subtree; that `60` has only a right child, `65`, so case 2 replaces it with `65` | `60(40 70(65 80))` |

Notice that the successor `60` had a right child of its own, `65`. That child is why "delete the successor" is a recursive delete rather than simply setting a reference to `null`.

Deletion is O(h): one walk down to find the node and, in the two-child case, one more walk down the right subtree to find and remove the successor.

## Validating a BST

"Is this binary tree a valid BST?" is one of the most common tree interview questions, and the counterexample earlier shows why the naive parent-versus-child check is wrong. There are two correct approaches.

### Method 1: pass bounds down

Every node in a BST must lie inside an **open interval** determined by its ancestors. The root may be anything: `(-∞, +∞)`. Moving to a left child narrows the upper bound to the parent's key; moving to a right child narrows the lower bound. A node is valid if its key lies strictly inside its interval and both subtrees are valid with their narrowed intervals. This is a top-down DFS: constraints flow from ancestors to descendants.

The bounds must start *outside* the range of `int`. If you start with `Integer.MIN_VALUE` and `Integer.MAX_VALUE` and use strict comparisons, a tree whose root is `Integer.MAX_VALUE` is wrongly rejected. Using `long` bounds, or `Integer` objects with `null` meaning "no bound", avoids that.

### Method 2: inorder must be strictly increasing

Since a binary tree with distinct keys is a BST exactly when its inorder sequence is strictly increasing, traverse in inorder and compare each key with the previous one. No list is needed — only the previous key. Using a nullable `Integer` for "no previous key yet" again avoids treating `Integer.MIN_VALUE` as a sentinel.

```java title="ValidateBst.java"
public class ValidateBst {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
        TreeNode(int val, TreeNode left, TreeNode right) {
            this.val = val; this.left = left; this.right = right;
        }
    }

    // Wrong: compares each node only with its children.
    static boolean naive(TreeNode node) {
        if (node == null) return true;
        if (node.left != null && node.left.val >= node.val) return false;
        if (node.right != null && node.right.val <= node.val) return false;
        return naive(node.left) && naive(node.right);
    }

    // Method 1: every key must lie strictly inside (low, high).
    static boolean byBounds(TreeNode node, long low, long high) {
        if (node == null) return true;
        if (node.val <= low || node.val >= high) return false;
        return byBounds(node.left, low, node.val) && byBounds(node.right, node.val, high);
    }

    // Method 2: inorder keys must be strictly increasing.
    static Integer prev;
    static boolean byInorder(TreeNode node) {
        if (node == null) return true;
        if (!byInorder(node.left)) return false;
        if (prev != null && node.val <= prev) return false;
        prev = node.val;
        return byInorder(node.right);
    }

    static void check(String name, TreeNode root) {
        prev = null;                                       // reset shared state
        System.out.printf("%-12s naive=%-5b bounds=%-5b inorder=%b%n", name, naive(root),
                byBounds(root, Long.MIN_VALUE, Long.MAX_VALUE), byInorder(root));
    }

    public static void main(String[] args) {
        TreeNode valid = new TreeNode(10,
                new TreeNode(5), new TreeNode(15, new TreeNode(12), new TreeNode(20)));
        TreeNode sneaky = new TreeNode(10,
                new TreeNode(5), new TreeNode(15, new TreeNode(6), new TreeNode(20)));
        TreeNode extreme = new TreeNode(Integer.MAX_VALUE, new TreeNode(Integer.MIN_VALUE), null);
        TreeNode duplicate = new TreeNode(2, new TreeNode(2), null);

        check("valid", valid);
        check("sneaky", sneaky);
        check("extreme", extreme);
        check("duplicate", duplicate);
    }
}
```

```output
valid        naive=true  bounds=true  inorder=true
sneaky       naive=true  bounds=false inorder=false
extreme      naive=true  bounds=true  inorder=true
duplicate    naive=false bounds=false inorder=false
```

The `sneaky` tree is the counterexample from earlier: the naive check accepts it, while both correct methods reject it — the bounds method because `6` arrives at the right subtree of `10` with interval `(10, 15)`, and the inorder method because `6` follows `10`. The `extreme` tree uses the largest and smallest `int` values and passes, which would not happen if the bounds were `int`s compared strictly. Both correct methods take O(n) time, since they may visit every node, and O(h) stack space.

## Ordered queries

The ordering rule makes a family of "near a key" questions cheap. All of them walk one root-to-leaf path, so they cost O(h).

- **Minimum and maximum.** The minimum is the leftmost node: keep going left until there is no left child. The maximum is the rightmost node.
- **Floor** (the largest key ≤ x) and **ceiling** (the smallest key ≥ x). Walk down as if searching for `x`. Whenever you move right from a node because its key is smaller than `x`, that key is a candidate floor — the best so far, because later candidates on the path are closer to `x`. For ceiling, record candidates when you move left.
- **Inorder successor of a key** (the smallest key strictly greater). The same walk as ceiling with a strict comparison. If you already hold the node and it has a right child, the successor is the minimum of the right subtree.
- **Kth smallest.** Inorder visits keys in ascending order, so stop at the kth visited node. An iterative inorder can stop early, costing O(h + k) instead of O(n).
- **Range sum** (sum of keys in `[low, high]`). Recurse, but skip any subtree that cannot contain keys in range: if a node's key is below `low`, its whole left subtree is too, so only the right subtree is explored. That **pruning** is what makes a BST better than a plain binary tree for range questions.

```java title="BstQueries.java"
import java.util.ArrayDeque;
import java.util.Deque;

public class BstQueries {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    /** Builds a height-balanced BST from a sorted array: the middle becomes the root. */
    static TreeNode fromSorted(int[] a, int lo, int hi) {
        if (lo > hi) return null;
        int mid = lo + (hi - lo) / 2;
        TreeNode node = new TreeNode(a[mid]);
        node.left = fromSorted(a, lo, mid - 1);
        node.right = fromSorted(a, mid + 1, hi);
        return node;
    }

    static Integer floor(TreeNode root, int x) {
        Integer best = null;
        for (TreeNode cur = root; cur != null; ) {
            if (cur.val == x) return x;
            if (cur.val < x) { best = cur.val; cur = cur.right; }  // candidate; look larger
            else cur = cur.left;
        }
        return best;                                   // null: nothing <= x
    }

    static Integer ceiling(TreeNode root, int x) {
        Integer best = null;
        for (TreeNode cur = root; cur != null; ) {
            if (cur.val == x) return x;
            if (cur.val > x) { best = cur.val; cur = cur.left; }   // candidate; look smaller
            else cur = cur.right;
        }
        return best;
    }

    static int kthSmallest(TreeNode root, int k) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode cur = root;
        while (cur != null || !stack.isEmpty()) {
            while (cur != null) { stack.push(cur); cur = cur.left; }
            cur = stack.pop();
            if (--k == 0) return cur.val;              // the kth inorder visit
            cur = cur.right;
        }
        throw new IllegalArgumentException("k is larger than the tree");
    }

    static long rangeSum(TreeNode node, int low, int high) {
        if (node == null) return 0;
        if (node.val < low) return rangeSum(node.right, low, high);   // left side too small
        if (node.val > high) return rangeSum(node.left, low, high);   // right side too big
        return node.val + rangeSum(node.left, low, high) + rangeSum(node.right, low, high);
    }

    static TreeNode lcaInBst(TreeNode root, int p, int q) {
        TreeNode cur = root;
        while (cur != null) {
            if (p < cur.val && q < cur.val) cur = cur.left;        // both on the left
            else if (p > cur.val && q > cur.val) cur = cur.right;  // both on the right
            else return cur;                                       // they split here
        }
        return null;
    }

    public static void main(String[] args) {
        int[] sorted = {3, 8, 15, 21, 27, 34, 42, 56};
        TreeNode root = fromSorted(sorted, 0, sorted.length - 1);
        //              21
        //            /    \
        //           8      34
        //          / \    /  \
        //         3   15 27   42
        //                       \
        //                        56
        System.out.println("root:        " + root.val);
        System.out.println("floor(30):   " + floor(root, 30));
        System.out.println("ceiling(30): " + ceiling(root, 30));
        System.out.println("floor(1):    " + floor(root, 1));
        System.out.println("3rd smallest:" + " " + kthSmallest(root, 3));
        System.out.println("sum [10,40]: " + rangeSum(root, 10, 40));
        System.out.println("lca(3, 15):  " + lcaInBst(root, 3, 15).val);
        System.out.println("lca(15, 42): " + lcaInBst(root, 15, 42).val);
    }
}
```

```output
root:        21
floor(30):   27
ceiling(30): 34
floor(1):    null
3rd smallest: 15
sum [10,40]: 97
lca(3, 15):  8
lca(15, 42): 21
```

Trace `floor(root, 30)`: at `21`, `21 < 30`, so `21` is a candidate and we go right. At `34`, `34 > 30`, so go left. At `27`, `27 < 30`, so `27` replaces `21` as the candidate and we go right, reaching `null`. The answer is `27`. The range sum `15 + 21 + 27 + 34 = 97` never visits `3` (pruned when `8 < 10` sent the search right) or `56` (pruned when `42 > 40` sent it left).

`fromSorted` is itself a classic problem, *Convert Sorted Array to Binary Search Tree*. Choosing the middle element as the root puts half of the remaining keys on each side, so the tree's height is `⌊log₂ n⌋` — the best possible. It visits each element once, so it runs in O(n).

`lcaInBst` finds the **lowest common ancestor**: the deepest node that has both keys in its subtree. In a BST, while both keys are smaller than the current node, the answer is on the left; while both are larger, it is on the right; the first node where they split (or that equals one of them) is the answer. That is O(h) and uses no recursion, unlike the general binary-tree version taught in [[a6-lca]].

## Balance: the whole story of BST performance

Every BST operation in this lesson costs O(h). The height ranges from `⌊log₂ n⌋` for a perfectly balanced tree to `n - 1` for a chain, so "O(h)" can mean anything from about 20 steps to a million steps for a million keys.

| Operation | Balanced (h ≈ log₂ n) | Degenerate (h = n - 1) |
|---|---|---|
| Search, insert, delete | O(log n) | O(n) |
| Min, max, floor, ceiling, successor | O(log n) | O(n) |
| Kth smallest | O(log n + k) | O(n) |
| Inorder traversal of all keys | O(n) | O(n) |

**Random insertion order** tends to produce reasonable trees: if keys arrive in a uniformly random order, the expected depth of a node is about `2 ln n`, roughly `1.39 log₂ n`, so operations are O(log n) *on average*. But real data is rarely random — sorted and nearly sorted input is common — and an adversary can always choose a bad order.

**Self-balancing BSTs** fix this by restructuring the tree during insert and delete so the height stays O(log n) no matter what order keys arrive in. The restructuring operation is a **rotation**, which changes the parent–child relationship of two nodes while preserving inorder order, in O(1). Two designs dominate:

- **AVL trees** keep the heights of every node's two subtrees within one of each other. They are the most strictly balanced (height at most about `1.44 log₂ n`), which makes lookups slightly faster, at the cost of more rotations on updates.
- **Red–black trees** colour each node red or black and enforce rules that keep the longest root-to-leaf path at most twice the shortest, giving height at most `2 log₂(n + 1)`. They rotate less on updates. Java's `TreeMap` and `TreeSet` are red–black trees.

Interviewers rarely ask you to implement rotations, but they do expect you to know that a plain BST degrades to O(n), and that production code uses a balanced variant.

## How it works internally: TreeMap and friends

In Java you will almost never write your own BST for production work. `TreeMap<K, V>` is a red–black tree that keeps keys sorted by their natural order or by a `Comparator` you supply ([[a1-comparable-comparator]]). It exposes exactly the ordered queries from this lesson, each in O(log n) ([[a1-treemap]]):

| You want | `TreeMap` method |
|---|---|
| Exact lookup | `get(key)`, `containsKey(key)` |
| Floor / ceiling | `floorKey(x)`, `ceilingKey(x)` |
| Strict predecessor / successor | `lowerKey(x)`, `higherKey(x)` |
| Minimum / maximum | `firstKey()`, `lastKey()` |
| Keys in a range, in order | `subMap(low, true, high, true)` |

Each entry is a node object holding the key, the value, three references (left, right and parent) and a colour flag. The parent reference lets iterators move to the next key without a stack. Because the structure depends on comparisons, a key's fields that affect `compareTo` must never change while it is in the map — the key would then sit in the wrong subtree, and lookups would miss it, exactly like the invalid tree earlier.

Balanced BSTs also appear inside other collections. Since Java 8, a `HashMap` bucket that collects many colliding keys (at least eight, once the table has at least 64 buckets) is converted from a linked list into a red–black tree, so a flood of collisions degrades lookups to O(log n) instead of O(n).

## In real systems

**Ordered maps everywhere.** Leaderboards, order books (bids sorted by price), calendars (events sorted by time) and rate limiters (requests sorted by timestamp) all need "next larger" and "everything in a range" queries on changing data. In Java that means `TreeMap` or `TreeSet`; in C++ `std::map`; both are red–black trees.

**Operating systems.** The Linux kernel uses red–black trees in its process scheduler to keep runnable tasks ordered so the next one to run can be found quickly, and in many other subsystems that need an ordered, frequently updated set.

**Databases.** Disk-based indexes use **B-trees** rather than binary trees ([[c7-btrees]]). A B-tree node holds hundreds of sorted keys, so a single disk read discards far more than half the candidates and the tree stays three or four levels deep for millions of rows. Within a node, the keys are binary-searched. It is the same search-tree idea, reshaped for the cost of disk access.

## Trade-offs and alternatives

| Structure | Search | Insert / delete | Ordered queries | Notes |
|---|---|---|---|---|
| Sorted array | O(log n) | O(n) | O(log n) | Compact and cache-friendly; best for static data |
| Plain BST | O(h), up to O(n) | O(h), up to O(n) | O(h) | Simple; degrades on sorted input |
| Balanced BST (`TreeMap`) | O(log n) | O(log n) | O(log n) | Guaranteed bounds; more memory per entry |
| Hash map (`HashMap`) | O(1) average | O(1) average | Not supported | Fastest for exact keys only |
| Heap (`PriorityQueue`) | O(n) | O(log n) | Min or max only | Use when you only need the smallest or largest |

Choose a balanced BST when data changes and you need order: neighbours, ranges, sorted iteration. Choose a hash map when you only ever look up exact keys. Choose a sorted array when data is built once and queried many times. Choose a heap ([[a7-min-heap]]) when you only need repeated access to the minimum or maximum.

## Common mistakes

> [!MISTAKE] Validating by comparing each node with its children
> A node can be correctly placed relative to its parent but wrong relative to a grandparent, as in the tree where `6` sits in the right subtree of `10`. Pass bounds down from ancestors, or check that the inorder sequence is strictly increasing.

**Sentinel bounds that collide with real keys.** Starting validation with `Integer.MIN_VALUE` and `Integer.MAX_VALUE` as `int` bounds rejects valid trees that contain those values. Use `long` bounds or nullable `Integer`s.

**Picking the wrong replacement when deleting.** For a node with two children, the replacement must be the minimum of the right subtree (or the maximum of the left). Using the right child itself breaks the property whenever the right child has a left subtree.

**Forgetting to reassign the result of a recursive insert or delete.** `insert(root, 5)` without `root = …`, or `delete(node.left, key)` without `node.left = …`, loses the change whenever the subtree's root changes — for example when inserting into an empty tree or deleting the root.

**Assuming O(log n).** Without balancing, inserting sorted keys produces a chain and every operation becomes O(n). Say "O(h), which is O(log n) if the tree is balanced".

**Assuming any binary tree's inorder is sorted.** Only a BST's is. Using inorder to "sort" a general binary tree gives nonsense.

**Ignoring duplicates.** If the input may contain equal keys, decide where they go, and make insert, search and validation agree on that rule.

## Interview perspective

BST questions test whether you use the ordering rule rather than treating the tree as a generic binary tree. If a solution to a BST problem visits every node when it could have discarded subtrees, an interviewer will usually ask whether you can do better.

> [!INTERVIEW] Explaining BST validation
> "Checking each node against its children isn't enough, because a node also has to respect every ancestor. I'll pass down an open interval: the root gets minus to plus infinity, going left caps the upper bound at the parent, going right raises the lower bound. I'll use `long` bounds so `Integer.MIN_VALUE` and `MAX_VALUE` keys still work. It's O(n) time and O(h) space."

Questions you should be able to answer:

- **Delete a node with two children.** Replace its key with the inorder successor's (minimum of the right subtree), then delete the successor, which has at most one child.
- **Kth smallest element.** Iterative inorder, stop at the kth pop: O(h + k). *Follow-up: the tree changes often and you query often.* Store each node's subtree size; then you can decide left, here or right at each node in O(h).
- **Lowest common ancestor in a BST.** Walk down from the root; go left while both keys are smaller, right while both are larger; the split point is the answer.
- **Why is TreeMap O(log n) when a BST can be O(n)?** It is a red–black tree, which rebalances with rotations during updates to keep its height at most `2 log₂(n + 1)`.
- **Two Sum in a BST.** Inorder into a sorted list and use two pointers ([[a2-two-pointers]]), or run a forward and a reverse iterative inorder simultaneously for O(h) extra space.
- **Recover a BST in which two nodes were swapped.** Inorder traversal reveals one or two places where a key is smaller than the previous one; the swapped nodes are the first "previous" and the last "current" at those places.

```quiz
Q: Which tree is NOT a valid BST?
- [ ] Root 8, left child 3, right child 10
- [x] Root 8, left child 3, and 3 has a right child 9
- [ ] Root 8, right child 10, and 10 has a left child 9
- [ ] A single node with value 8
> The node 9 is in the left subtree of 8, so it must be less than 8. It is greater than its parent 3, so a parent-only check passes, but the property requires every key in 8's left subtree to be less than 8. In the third option 9 is in 8's right subtree and 10's left subtree, so 8 < 9 < 10 is fine.

Q: To delete a node with two children, why is its inorder successor a safe replacement?
- [ ] It is always a leaf
- [x] It is greater than every key in the left subtree and smaller than every other key in the right subtree, and it has no left child
- [ ] It is the node's right child
- [ ] Any node in the right subtree would work equally well
> The successor is the minimum of the right subtree, so it fits between the two subtrees in sorted order. Being a minimum, it has no left child, so removing it from its old position is the easy leaf or one-child case. It is not always a leaf: it may have a right child, which is why that removal is a recursive delete.

Q: You insert the keys 10, 20, 30, 40, 50 in that order into an empty plain BST. What is the cost of searching for 50?
- [ ] O(1), because 50 was inserted last
- [ ] O(log n), because BST search halves the candidates
- [x] O(n), because sorted insertion builds a chain of height n - 1
- [ ] It cannot be found because the tree is invalid
> Each key is larger than all previous ones, so each becomes the right child of the last, forming a chain. The tree is a valid BST, but its height is n - 1 and search must walk every node. Self-balancing trees such as red-black trees prevent this.

Q: A validation method starts with int bounds Integer.MIN_VALUE and Integer.MAX_VALUE and rejects keys equal to a bound. What happens on a single-node tree whose value is Integer.MAX_VALUE?
- [ ] It is correctly accepted
- [x] It is wrongly rejected
- [ ] It throws an overflow exception
- [ ] It loops forever
> The check node.val >= high is true because the value equals the bound, so a perfectly valid tree is rejected. Long bounds (Long.MIN_VALUE, Long.MAX_VALUE) or nullable Integer bounds leave room outside the int range. Java does not throw on comparisons, so no exception occurs.
```

## Practice

1. **Search and insert.** Implement both recursively and iteratively; insert `[5, 3, 8, 1, 4, 7, 9]` and print the inorder traversal.
2. **Delete Node in a BST.** Handle all three cases, then test deleting the root of a two-node tree.
3. **Validate Binary Search Tree.** Write both the bounds and the inorder versions.
4. **Kth Smallest Element in a BST.** Stop the traversal early; then describe the subtree-size augmentation.
5. **Range Sum of BST.** Prune subtrees that cannot contain keys in range, and count how many nodes you avoid visiting.
6. **Convert Sorted Array to BST.** Prove the height is `⌊log₂ n⌋`.
7. **Lowest Common Ancestor of a BST.** Solve iteratively in O(h) time and O(1) space.
8. **Inorder Successor in BST.** Given a node with only `left` and `right` references, find the next key in O(h).

The DSA explorer lists these under Trees; start with *Validate Binary Search Tree*, *Kth Smallest Element in a BST* and *Lowest Common Ancestor of a Binary Search Tree*.

## Quick revision {#quick-revision}

- BST property: for every node, all keys in the left subtree are smaller and all keys in the right subtree are larger — not just the children.
- Inorder traversal of a BST is sorted; a tree with distinct keys is a BST exactly when its inorder is strictly increasing.
- Search: go left if smaller, right if larger; O(h) time, O(1) space iteratively.
- Insert: attach at the `null` where an unsuccessful search ends; reassign `root = insert(root, key)`.
- Delete: leaf → remove; one child → splice the child up; two children → copy the inorder successor (min of right subtree) and delete it.
- Validate with open bounds `(low, high)` using `long`, or with an inorder pass tracking the previous key.
- Floor, ceiling, successor: one root-to-leaf walk, recording the best candidate. Kth smallest: iterative inorder, O(h + k). Range sum: prune impossible subtrees.
- Sorted array → balanced BST: middle element as root, recurse on halves, O(n).
- LCA in a BST: the first node where the two keys split.
- All operations are O(h): O(log n) when balanced, O(n) for a chain (for example after sorted inserts). `TreeMap` is a red–black tree with height at most `2 log₂(n + 1)`.

## Key takeaways {#key-takeaways}

- A BST is binary search turned into a linked structure: each comparison discards a whole subtree, and insertions only rewire references.
- The ordering rule applies between each node and all of its descendants; that is why validation passes bounds down from ancestors.
- Inorder traversal of a BST yields sorted keys, which powers validation, kth smallest and conversion to sorted lists.
- Deleting a node with two children works by swapping in the inorder successor, which always has at most one child.
- Every operation costs O(h). Without balancing, sorted input makes h = n − 1; self-balancing trees such as red–black trees guarantee O(log n).
- In production Java, use `TreeMap` or `TreeSet` for ordered, changing data, and a `HashMap` when you only need exact lookups.
