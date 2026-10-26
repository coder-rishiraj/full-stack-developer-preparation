---
summary: An N-ary tree lets each node have any number of children, which is how file systems, the DOM, organisation charts and JSON documents are shaped. You will learn how to represent one in Java, how every binary-tree traversal generalises by looping over children, and how to serialise N-ary trees or convert them to binary trees with the left-child right-sibling trick.
difficulty: intermediate
minutes: 45
objectives:
  - Represent an N-ary tree in Java and choose between a children list, a fixed array, a parent array and left-child right-sibling pointers
  - Implement preorder, postorder and level-order traversals recursively and iteratively, and explain why there is no inorder
  - Compute depth, subtree aggregates and diameter by combining results from all children
  - Serialise and deserialise N-ary trees with child counts, and parse LeetCode's null-separated level-order format
  - Convert between N-ary and binary trees with left-child right-sibling pointers and recognise the pattern in real systems such as React Fiber
---

## Introduction

Most hierarchies in software do not have exactly two branches per node. A folder can contain any number of files and folders. An HTML element can contain any number of child elements. A manager can have one report or twenty. A JSON object can have any number of fields, each of which can be another object. These structures are **N-ary trees**: rooted trees in which each node may have any number of children (sometimes "N-ary" means "at most `N` children"; in interview problems it usually means "any number").

A **binary tree** is the special case where each node has at most two children, and those two are distinguished as left and right ([[a6-binary-trees]]). N-ary trees drop both restrictions: a node has a **list** of children, in order, with no special meaning attached to "left" or "right". Almost every binary-tree algorithm carries over by replacing "visit the left child, then the right child" with "visit each child in turn". The interesting differences are the few places where that replacement is not enough — inorder traversal has no natural meaning, "combine left and right" becomes "combine the best two of many", and serialisation needs a new way to say where a child list ends.

Interview problems on N-ary trees — level-order traversal, maximum depth, preorder and postorder, serialisation, the diameter — test exactly that: whether you understand the binary-tree patterns well enough to generalise them, rather than having memorised `left` and `right`.

## Before you start

- **Binary trees** — nodes, children, leaves, depth, and LeetCode's level-order notation. See [[a6-binary-trees]].
- **Tree DFS** — preorder and postorder, top-down and bottom-up information flow, and iterative DFS with a stack. See [[a6-dfs]].
- **Tree BFS** — level-by-level traversal with the queue-size snapshot. See [[a6-bfs]].
- **ArrayList** — the usual container for a node's children. See [[a1-arraylist]].
- **Serialisation** — why a tree's shape must be encoded explicitly. See [[a6-serialization]].

## The intuition

Think of a file system. To print every file with its full path, you start at the root folder, print it, and then, for each item inside it in turn, do the same thing recursively. To compute how much disk space a folder uses, you first compute the size of each item inside it, then add them up. To list folders by how deeply nested they are, you go level by level.

Those three tasks are preorder, postorder and level-order traversal. Nothing about them needed "left" or "right"; they needed only "for each child". That is the whole mental model: **an N-ary tree is a binary tree whose two child slots have been replaced by a list**, and the algorithms change from two recursive calls to a loop of recursive calls.

## Representing an N-ary tree

### A list of children

The standard representation, used by LeetCode, stores a value and a list of children:

```java
class Node {
    int val;
    List<Node> children = new ArrayList<>();
    Node(int val) { this.val = val; }
}
```

A **leaf** is a node whose list is empty. Initialising the list in the field declaration means `children` is never `null`, so every loop over it is safe; some platforms (including LeetCode) may pass `null` lists or empty ones, so check the problem's conventions. Keep the two notions separate: a `null` *node* is an empty tree, while a node with an empty *list* is a real node with no children.

The list preserves **order**. In a file explorer, the order may be alphabetical; in the DOM, it is document order; in an organisation chart, it may be meaningless. Algorithms that produce output — traversals, serialisations — must respect it, while aggregates such as sums do not care.

### Other representations

Different problems and systems use different layouts, and recognising them saves time:

| Representation | Shape | Strengths | Weaknesses |
|---|---|---|---|
| `List<Node> children` | Each node owns a list | Natural; any fan-out; ordered | A list object per node |
| Fixed array `Node[] children = new Node[26]` | A slot per possible child | O(1) access by key | Wastes memory when sparse; used by tries ([[a12-trie]]) |
| Parent array `parent[i]` | Each node stores only its parent | Compact; easy to store in a table | Finding children needs a scan or a built index |
| Adjacency list from edges | Undirected neighbours | How graph problems give trees ([[a8-adjacency-list]]) | Must skip the parent while traversing |
| Left-child right-sibling | Two pointers per node | Every tree becomes a binary tree | Reaching the k-th child costs O(k) |

The **parent array** is how relational databases usually store hierarchies: each row has an `id` and a `parent_id`. The **adjacency list** is how graph problems describe trees: `n` nodes and `n - 1` undirected edges, with no root given. In both cases, the first step is often to build the children lists from the data, which is shown later.

## Traversals

### Preorder and postorder

Preorder visits a node before its children; postorder visits it after them. With a list of children, each is a loop:

```java
static void preorder(Node n, List<Integer> out) {
    if (n == null) return;
    out.add(n.val);                                   // node before its children
    for (Node c : n.children) preorder(c, out);
}

static void postorder(Node n, List<Integer> out) {
    if (n == null) return;
    for (Node c : n.children) postorder(c, out);
    out.add(n.val);                                   // node after its children
}
```

Preorder suits work that must happen before the children — printing a path, copying a node before its subtree, passing a value down. Postorder suits work that needs the children's results — sizes, sums, deleting a tree from the bottom up. That is the same division of labour as in [[a6-dfs]].

### Why there is no inorder

Binary inorder visits the left subtree, then the node, then the right subtree. Its importance comes from binary search trees, where that order is sorted ([[a6-bst]]). With `k` children, there is no single natural place to put the node: after the first child, after half of them, after all but one? Each choice gives *some* traversal, but none has a meaning that algorithms rely on — except in multiway search trees such as B-trees, where a node holds several **keys** between its children and an in-order walk interleaves keys and children ([[c7-btrees]]). For a plain N-ary tree, say that inorder is not defined.

### Iterative versions

Recursion depth equals the tree's height, which for a file system or a deeply nested document can be large. Both depth-first orders can be done with an explicit stack.

For **preorder**, pop a node, output it, and push its children **in reverse order**, so that the first child is on top and is popped next. Pushing them in natural order would visit the last child first.

For **postorder**, there is a neat trick. A traversal that outputs the node and then its children *from last to first* is the exact reverse of postorder (which outputs children first to last, then the node). So run that "reversed preorder" — pop, output, push children in natural order so the last child is popped first — and reverse the result at the end.

```java
static List<Integer> preorderIterative(Node root) {
    List<Integer> out = new ArrayList<>();
    if (root == null) return out;
    Deque<Node> stack = new ArrayDeque<>(List.of(root));
    while (!stack.isEmpty()) {
        Node n = stack.pop();
        out.add(n.val);
        for (int i = n.children.size() - 1; i >= 0; i--) stack.push(n.children.get(i));
    }
    return out;
}
```

The reverse-and-flip postorder costs O(n) extra space for the output, which you need anyway. A postorder that emits nodes as it goes, without the final reversal, needs to track how many children of each stacked node have been processed — possible, but rarely worth the complexity.

### Level order

Level-order traversal is unchanged from binary trees except that each dequeued node enqueues **all** its children. The level-size snapshot — reading `q.size()` once at the start of each level — still separates the levels ([[a6-level-order]]).

```java
static List<List<Integer>> levelOrder(Node root) {
    List<List<Integer>> out = new ArrayList<>();
    if (root == null) return out;
    Queue<Node> q = new ArrayDeque<>(List.of(root));
    while (!q.isEmpty()) {
        List<Integer> level = new ArrayList<>();
        for (int i = q.size(); i > 0; i--) {
            Node n = q.remove();
            level.add(n.val);
            q.addAll(n.children);
        }
        out.add(level);
    }
    return out;
}
```

Writing the loop as `for (int i = q.size(); i > 0; i--)` evaluates `q.size()` exactly once, before any children are added. Writing `for (int i = 0; i < q.size(); i++)` re-reads the size every iteration, and since children are being added, the loop would run into the next level.

## Aggregating over children

Bottom-up problems compute something for each node from its children's results. On a binary tree that combines two values; here it combines a list.

**Maximum depth.** The depth of a tree is one more than the deepest child's depth, and a leaf has depth 1 (the empty loop leaves `best` at 0). An empty tree has depth 0.

```java
static int maxDepth(Node n) {
    if (n == null) return 0;
    int best = 0;
    for (Node c : n.children) best = Math.max(best, maxDepth(c));
    return 1 + best;
}
```

**Sums, sizes and counts.** The size of a subtree is one plus the sizes of its children; a folder's disk usage is its own size plus its children's usage. These are the same loop with `+` instead of `max`. *Employee Importance* is this pattern on an organisation chart stored as a map from employee id to record.

**Diameter.** The longest path between two nodes bends at a single highest node, as explained in [[a6-diameter]]. On a binary tree the bent path uses the left and right heights. On an N-ary tree it uses the **two tallest** children — any other pair is shorter. Track the largest and second-largest child heights in one pass; record their sum; return one plus the largest:

```java
static int height(Node n, int[] diameter) {          // height in nodes
    int first = 0, second = 0;                       // two tallest child heights
    for (Node c : n.children) {
        int h = height(c, diameter);
        if (h > first) { second = first; first = h; }
        else if (h > second) second = h;
    }
    diameter[0] = Math.max(diameter[0], first + second);
    return 1 + first;
}
```

The update order matters: when a new height beats the current maximum, the old maximum moves down to second place before being replaced. Sorting all child heights would also work but costs O(k log k) per node instead of O(k).

**Lowest common ancestor.** The postorder LCA from [[a6-lca]] generalises by counting how many children reported a target: if two or more did, this node is the LCA; if exactly one did, pass its result up.

### Worked example

```java title="NaryTree.java"
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Deque;
import java.util.List;
import java.util.Queue;

public class NaryTree {
    static class Node {
        int val;
        List<Node> children = new ArrayList<>();
        Node(int val) { this.val = val; }
        Node add(Node... kids) { children.addAll(List.of(kids)); return this; }
    }

    // ---- Recursive traversals: a loop over children replaces left/right ----
    static void preorder(Node n, List<Integer> out) {
        if (n == null) return;
        out.add(n.val);                                   // node before its children
        for (Node c : n.children) preorder(c, out);
    }

    static void postorder(Node n, List<Integer> out) {
        if (n == null) return;
        for (Node c : n.children) postorder(c, out);
        out.add(n.val);                                   // node after its children
    }

    // ---- Iterative preorder: push children in reverse so the first is popped first ----
    static List<Integer> preorderIterative(Node root) {
        List<Integer> out = new ArrayList<>();
        if (root == null) return out;
        Deque<Node> stack = new ArrayDeque<>(List.of(root));
        while (!stack.isEmpty()) {
            Node n = stack.pop();
            out.add(n.val);
            for (int i = n.children.size() - 1; i >= 0; i--) stack.push(n.children.get(i));
        }
        return out;
    }

    // ---- Iterative postorder: node-then-children-right-to-left, reversed ----
    static List<Integer> postorderIterative(Node root) {
        List<Integer> out = new ArrayList<>();
        if (root == null) return out;
        Deque<Node> stack = new ArrayDeque<>(List.of(root));
        while (!stack.isEmpty()) {
            Node n = stack.pop();
            out.add(n.val);
            for (Node c : n.children) stack.push(c);     // last child popped first
        }
        Collections.reverse(out);
        return out;
    }

    // ---- Level order: the level-size snapshot, unchanged from binary trees ----
    static List<List<Integer>> levelOrder(Node root) {
        List<List<Integer>> out = new ArrayList<>();
        if (root == null) return out;
        Queue<Node> q = new ArrayDeque<>(List.of(root));
        while (!q.isEmpty()) {
            List<Integer> level = new ArrayList<>();
            for (int i = q.size(); i > 0; i--) {
                Node n = q.remove();
                level.add(n.val);
                q.addAll(n.children);
            }
            out.add(level);
        }
        return out;
    }

    // ---- Depth and diameter (in edges): combine the two tallest children ----
    static int maxDepth(Node n) {
        if (n == null) return 0;
        int best = 0;
        for (Node c : n.children) best = Math.max(best, maxDepth(c));
        return 1 + best;
    }

    static int height(Node n, int[] diameter) {          // height in nodes
        int first = 0, second = 0;                       // two tallest child heights
        for (Node c : n.children) {
            int h = height(c, diameter);
            if (h > first) { second = first; first = h; }
            else if (h > second) second = h;
        }
        diameter[0] = Math.max(diameter[0], first + second);
        return 1 + first;
    }

    public static void main(String[] args) {
        //          1
        //       /  |  \
        //      3   2   4
        //     / \
        //    5   6
        Node root = new Node(1).add(new Node(3).add(new Node(5), new Node(6)),
                                    new Node(2), new Node(4));
        List<Integer> pre = new ArrayList<>(), post = new ArrayList<>();
        preorder(root, pre);
        postorder(root, post);
        System.out.println("preorder:            " + pre);
        System.out.println("preorder (stack):    " + preorderIterative(root));
        System.out.println("postorder:           " + post);
        System.out.println("postorder (stack):   " + postorderIterative(root));
        System.out.println("level order:         " + levelOrder(root));
        System.out.println("max depth:           " + maxDepth(root));
        int[] d = {0};
        height(root, d);
        System.out.println("diameter (edges):    " + d[0]);
    }
}
```

```output
preorder:            [1, 3, 5, 6, 2, 4]
preorder (stack):    [1, 3, 5, 6, 2, 4]
postorder:           [5, 6, 3, 2, 4, 1]
postorder (stack):   [5, 6, 3, 2, 4, 1]
level order:         [[1], [3, 2, 4], [5, 6]]
max depth:           3
diameter (edges):    3
```

The small `add` helper returns the node itself so a tree can be written as one nested expression. The recursive and iterative traversals agree, as they must. The diameter is 3 edges, the path `5 → 3 → 1 → 2` (or `→ 4`): at the root the two tallest children are `3` (height 2) and `2` (height 1), giving `2 + 1 = 3`.

### Dry run: iterative preorder

Trace the stack on the same tree. The top of the stack is written first.

| Step | Popped | Output so far | Pushed (in this order) | Stack after (top first) |
|---|---|---|---|---|
| 1 | 1 | 1 | 4, 2, 3 | 3, 2, 4 |
| 2 | 3 | 1, 3 | 6, 5 | 5, 6, 2, 4 |
| 3 | 5 | 1, 3, 5 | — | 6, 2, 4 |
| 4 | 6 | 1, 3, 5, 6 | — | 2, 4 |
| 5 | 2 | 1, 3, 5, 6, 2 | — | 4 |
| 6 | 4 | 1, 3, 5, 6, 2, 4 | — | empty |

Pushing `4, 2, 3` leaves `3` on top, so the first child is explored first, and its whole subtree (`5, 6`) is finished before `2` comes off the stack — exactly the recursive order.

### Complexity

Every traversal and aggregate visits each node once and looks at each child reference once. Since every node except the root is the child of exactly one node, the total number of child references is `n - 1`, so all of these run in **O(n)** time regardless of how the children are distributed. Space is **O(h)** for recursion or a DFS stack — though the iterative preorder stack can hold all children of every node on the current path, up to O(n) for a very wide tree — and **O(w)** for the BFS queue, where `w` is the widest level. A star-shaped tree (one root with `n - 1` children) has `h = 2` but `w = n - 1`.

## Building and encoding N-ary trees

### From a parent array or an edge list

When a tree arrives as `parent[i]` (with `-1` for the root), build the children lists in one pass: create all nodes, then append each node to its parent's list. Iterating `i` in increasing order keeps each child list in index order, which matters if the output order is checked.

```java
static Node fromParents(int[] parent) {
    Node[] nodes = new Node[parent.length];
    for (int i = 0; i < parent.length; i++) nodes[i] = new Node(i);
    Node root = null;
    for (int i = 0; i < parent.length; i++) {         // children keep index order
        if (parent[i] == -1) root = nodes[i];
        else nodes[parent[i]].children.add(nodes[i]);
    }
    return root;
}
```

When it arrives as undirected edges, you do not know which endpoint is the parent. Build an adjacency list and run a DFS or BFS from the chosen root, treating every neighbour except the one you came from as a child. That "skip the parent" rule is what turns a graph traversal into a tree traversal without a visited set ([[a8-dfs]]).

### Serialising with child counts

A binary tree can be serialised as preorder with a marker for each `null` child ([[a6-serialization]]). With a variable number of children there are no fixed child slots to mark, so the encoding needs another way to say where a node's children end. The simplest is to write, after each value, **how many children it has**. The decoder reads a value and a count `k`, then decodes exactly `k` subtrees in a row.

```text
          1
       /  |  \          encoded: 1,3, 3,2, 5,0, 6,0, 2,0, 4,0
      3   2   4
     / \
    5   6
```

The decoder never has to guess: the count tells it exactly how many subtrees to read before returning to the parent. Every node contributes two tokens, so the encoding has `2n` tokens and decodes in O(n).

### LeetCode's level-order format

LeetCode writes N-ary trees level by level, with a `null` after each node's group of children: the tree above is `[1,null,3,2,4,null,5,6]`. Read it as: the root `1`, then a `null` closing the root's own "group"; then `3,2,4`, the children of `1`, closed by `null`; then `5,6`, the children of `3`. The groups for `2` and `4` would be empty, and trailing `null`s are dropped. Parsing uses a queue of nodes waiting for their child group, just like the binary level-order builder:

```java
static Node fromLeetCode(Integer[] v) {
    if (v.length == 0) return null;
    Node root = new Node(v[0]);
    Queue<Node> waiting = new ArrayDeque<>(List.of(root));
    int i = 2;                                        // v[1] is the null after the root
    while (!waiting.isEmpty() && i < v.length) {
        Node parent = waiting.remove();
        while (i < v.length && v[i] != null) {        // this parent's children...
            Node c = new Node(v[i++]);
            parent.children.add(c);
            waiting.add(c);
        }
        i++;                                          // ...up to the null separator
    }
    return root;
}
```

An empty child group appears as two `null`s in a row in the middle of the list: the first closes the previous group, the second closes an empty one.

## Left-child right-sibling: N-ary as binary

Any N-ary tree can be stored as a binary tree with two pointers per node:

- **left** points to the node's **first child**;
- **right** points to the node's **next sibling** (the next child of the same parent).

This is the **left-child right-sibling** (LCRS) representation, also called first-child next-sibling. A node's children become a linked list: start at `left`, then follow `right` pointers. The encoding is reversible, so *Encode N-ary Tree to Binary Tree* is solved by converting in each direction:

```java
static TreeNode toBinary(Node n) {
    if (n == null) return null;
    TreeNode b = new TreeNode(n.val);
    TreeNode prev = null;
    for (Node c : n.children) {
        TreeNode cb = toBinary(c);
        if (prev == null) b.left = cb;                // first child goes left
        else prev.right = cb;                         // later children chain right
        prev = cb;
    }
    return b;
}

static Node fromBinary(TreeNode b) {
    if (b == null) return null;
    Node n = new Node(b.val);
    for (TreeNode c = b.left; c != null; c = c.right) n.children.add(fromBinary(c));
    return n;
}
```

For the example tree, `1`'s left pointer goes to `3`; `3`'s right pointer goes to its sibling `2`, and `2`'s right pointer to `4`; `3`'s left pointer goes to its first child `5`, whose right pointer goes to `6`. The root's right pointer is empty because the root has no siblings.

LCRS uses a fixed two pointers per node however many children there are, and it lets binary-tree code walk an N-ary structure. The cost is that the binary tree is "taller": reaching the `k`-th child takes `k` steps along the sibling chain, and a node with many children becomes a long right-leaning chain. A useful property: a preorder traversal of the binary form visits nodes in the same order as a preorder of the original N-ary tree.

```java title="NaryEncodings.java"
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;
import java.util.StringJoiner;

public class NaryEncodings {
    static class Node {
        int val;
        List<Node> children = new ArrayList<>();
        Node(int val) { this.val = val; }
    }

    static class TreeNode {                               // binary node for LCRS
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // ---- Codec 1: preorder, each value followed by its number of children ----
    static String encode(Node root) {
        StringJoiner sj = new StringJoiner(",");
        if (root != null) write(root, sj);
        return sj.toString();
    }

    static void write(Node n, StringJoiner sj) {
        sj.add(String.valueOf(n.val)).add(String.valueOf(n.children.size()));
        for (Node c : n.children) write(c, sj);
    }

    static Node decode(String data) {
        if (data.isEmpty()) return null;
        String[] tok = data.split(",");
        return read(tok, new int[] {0});
    }

    static Node read(String[] tok, int[] i) {
        Node n = new Node(Integer.parseInt(tok[i[0]++]));
        int count = Integer.parseInt(tok[i[0]++]);       // how many subtrees follow
        for (int k = 0; k < count; k++) n.children.add(read(tok, i));
        return n;
    }

    // ---- Codec 2: LeetCode level order, each child group ended by null ----
    static Node fromLeetCode(Integer[] v) {
        if (v.length == 0) return null;
        Node root = new Node(v[0]);
        Queue<Node> waiting = new ArrayDeque<>(List.of(root));
        int i = 2;                                        // v[1] is the null after the root
        while (!waiting.isEmpty() && i < v.length) {
            Node parent = waiting.remove();
            while (i < v.length && v[i] != null) {        // this parent's children...
                Node c = new Node(v[i++]);
                parent.children.add(c);
                waiting.add(c);
            }
            i++;                                          // ...up to the null separator
        }
        return root;
    }

    // ---- Left-child right-sibling: any N-ary tree as a binary tree ----
    static TreeNode toBinary(Node n) {
        if (n == null) return null;
        TreeNode b = new TreeNode(n.val);
        TreeNode prev = null;
        for (Node c : n.children) {
            TreeNode cb = toBinary(c);
            if (prev == null) b.left = cb;                // first child goes left
            else prev.right = cb;                         // later children chain right
            prev = cb;
        }
        return b;
    }

    static Node fromBinary(TreeNode b) {
        if (b == null) return null;
        Node n = new Node(b.val);
        for (TreeNode c = b.left; c != null; c = c.right) n.children.add(fromBinary(c));
        return n;
    }

    // ---- From a parent array: parent[i] is i's parent, -1 for the root ----
    static Node fromParents(int[] parent) {
        Node[] nodes = new Node[parent.length];
        for (int i = 0; i < parent.length; i++) nodes[i] = new Node(i);
        Node root = null;
        for (int i = 0; i < parent.length; i++) {         // children keep index order
            if (parent[i] == -1) root = nodes[i];
            else nodes[parent[i]].children.add(nodes[i]);
        }
        return root;
    }

    static String show(Node n) {                          // bracket form: 1[3[5 6] 2 4]
        if (n.children.isEmpty()) return String.valueOf(n.val);
        StringJoiner sj = new StringJoiner(" ", n.val + "[", "]");
        for (Node c : n.children) sj.add(show(c));
        return sj.toString();
    }

    static String showBinary(TreeNode b) {                // (val left right)
        if (b == null) return "-";
        return "(" + b.val + " " + showBinary(b.left) + " " + showBinary(b.right) + ")";
    }

    public static void main(String[] args) {
        Node root = fromLeetCode(new Integer[] {1, null, 3, 2, 4, null, 5, 6});
        System.out.println("parsed:          " + show(root));
        String enc = encode(root);
        System.out.println("child counts:    " + enc);
        System.out.println("decoded:         " + show(decode(enc)));
        TreeNode bin = toBinary(root);
        System.out.println("as binary:       " + showBinary(bin));
        System.out.println("back to n-ary:   " + show(fromBinary(bin)));
        System.out.println("from parents:    " + show(fromParents(new int[] {-1, 0, 0, 1, 1, 1, 2})));
    }
}
```

```output
parsed:          1[3[5 6] 2 4]
child counts:    1,3,3,2,5,0,6,0,2,0,4,0
decoded:         1[3[5 6] 2 4]
as binary:       (1 (3 (5 - (6 - -)) (2 - (4 - -))) -)
back to n-ary:   1[3[5 6] 2 4]
from parents:    0[1[3 4 5] 2[6]]
```

The `show` method prints a bracket encoding, `value[children]`, which is the same idea JSON and HTML use to record nesting. Read the binary form `(val left right)`: node `1` has left `3` and no right; node `3` has left `5` and right `2`; `5` has right `6`; `2` has right `4`. Converting back recovers the original tree, and the parent array `[-1, 0, 0, 1, 1, 1, 2]` builds node 0 with children 1 and 2, node 1 with children 3, 4, 5, and node 2 with child 6.

## In real systems

**File systems.** Directories form an N-ary tree. Commands like `du` compute directory sizes in postorder; `find` and `tree` walk in preorder; and deleting a directory recursively must delete children before their parent, which is postorder again.

**The DOM.** Every HTML element has an ordered list of child nodes, and `element.children` exposes it ([[b3-dom-tree-model]]). Events that bubble travel from a node up through its ancestors, and `querySelectorAll` returns matches in document order, which is a preorder traversal of the tree.

**React Fiber.** React's reconciler represents the component tree with fiber objects that have `child`, `sibling` and `return` fields: the first child, the next sibling and the parent. That is exactly left-child right-sibling, plus a parent pointer. It lets React walk the tree with a simple loop rather than recursion, so it can pause after any unit of work and resume later ([[b4-fiber-tree]]).

**Databases and indexes.** B-trees, the default index structure in PostgreSQL and MySQL, are N-ary search trees with hundreds of children per node, chosen so that each node fills a disk page and the tree stays only a few levels deep ([[c7-btrees]]). Hierarchical data stored with `parent_id` columns is the parent-array representation, often queried with recursive common table expressions ([[c7-recursive-cte]]).

**Documents and ASTs.** JSON and XML documents parse into N-ary trees, and compilers represent programs as abstract syntax trees in which a block node has one child per statement.

## Trade-offs and alternatives

**N-ary vs binary.** A children list models variable fan-out directly and keeps the tree shallow; a binary tree gives each node fixed, cheap fields and supports ordered operations through the BST property. The LCRS form converts one into the other at the cost of height.

**List vs array of children.** An `ArrayList` per node costs an extra object and some spare capacity, but adapts to any number of children. A fixed array indexed by key (as in a trie with 26 slots) gives O(1) lookup of a specific child but wastes memory when most slots are empty. A `HashMap` of children is the middle ground when keys are sparse.

**Recursion vs explicit stack.** Real hierarchies — directories, documents — can be deep enough to overflow Java's default thread stack in recursive code. Iterative DFS or BFS avoids that, at the price of slightly longer code.

**Child counts vs markers in serialisation.** Child counts are compact and decode in one pass; a "end of children" marker after each child list (as in LeetCode's format or closing brackets) allows streaming output without knowing the count in advance, which is why XML and JSON use closing tokens.

## Common mistakes

> [!MISTAKE] Re-reading the queue size inside the level loop
> `for (int i = 0; i < q.size(); i++)` re-evaluates the size after children are enqueued, so one "level" swallows part of the next. Capture the size once per level, as in `for (int i = q.size(); i > 0; i--)`.

**Writing binary-tree code by habit.** Accessing `node.left` and `node.right` on an N-ary node, or recursing on only two children, silently ignores the rest. Loop over the whole list.

**Pushing children in the wrong order on a stack.** For iterative preorder, push children in reverse so the first child is popped first; otherwise the output visits children right to left.

**Confusing a `null` node with an empty child list.** An empty tree is `null`; a leaf is a node with no children. Depth 0 versus depth 1, and "nothing to encode" versus "encode one value with count 0", depend on keeping them apart.

**Forgetting to track the second-tallest child.** For the N-ary diameter, the best path through a node uses the two tallest children. Updating `second` incorrectly — for example, not demoting the old maximum — gives answers that are too small.

**Misaligned tokens when decoding.** In the child-count format, every node consumes exactly two tokens before its children. Reading the count in the wrong place shifts every later token.

## Interview perspective

Interviewers use N-ary trees to check that you understand tree patterns rather than memorised binary-tree code. Phrase solutions in terms of "for each child" and point out where the binary version needed changing.

> [!INTERVIEW] Generalising from binary trees
> "The traversals are the same as for binary trees with a loop over children. There's no meaningful inorder. For the diameter I keep the two tallest child heights instead of left and right. To serialise, I can't mark null children because there are no fixed slots, so I write each value followed by its child count, and the decoder reads exactly that many subtrees."

Questions to be ready for:

- **How do you store a node?** `int val` plus `List<Node> children`; mention arrays for tries and LCRS.
- **Level order?** BFS with the level-size snapshot, enqueueing all children.
- **Iterative preorder and postorder?** Stack with children pushed in reverse; postorder as reversed node-then-children-from-last.
- **Why no inorder?** No single natural position for the node among `k` children; B-trees interleave keys instead.
- **Serialise an N-ary tree?** Child counts in preorder, or a separator after each child group.
- **Convert to a binary tree?** Left = first child, right = next sibling; reversible.
- **Follow-up: diameter, LCA or depth?** Combine over all children: two tallest for diameter, count of reporting children for LCA.

```quiz
Q: Why is inorder traversal not defined for a general N-ary tree?
- [ ] Because N-ary trees cannot be traversed recursively
- [x] Because with k children there is no single natural position for the node among them, and no ordering property that would make one meaningful
- [ ] Because N-ary trees have no leaves
- [ ] Because inorder requires a queue
> Binary inorder places the node between its two subtrees, which in a BST yields sorted order. With three or more children you could place the node anywhere, and none of the choices corresponds to a property algorithms rely on. Multiway search trees such as B-trees instead store several keys between children.

Q: In iterative preorder on an N-ary tree, in which order should a popped node's children be pushed onto the stack?
- [ ] First child first, so it is at the bottom
- [x] Last child first, so the first child ends up on top and is popped next
- [ ] In any order; preorder does not care
- [ ] Only the first child should be pushed
> A stack returns the most recently pushed item. To visit children from first to last, as recursive preorder does, the first child must be pushed last. Pushing in natural order would produce a traversal that visits children from last to first.

Q: A node has children with heights 4, 2, 7 and 5 (counted in nodes). What is the longest path bending at this node, in edges?
- [ ] 7
- [ ] 11
- [x] 12
- [ ] 18
> The path goes down into two different children, so it uses the two tallest: 7 and 5. With heights counted in nodes, a child of height h is h edges away from the bottom of its subtree when measured from the parent, so the path has 7 + 5 = 12 edges.

Q: In the left-child right-sibling representation, what does a node's right pointer refer to?
- [ ] Its last child
- [ ] Its parent
- [x] Its next sibling, the next child of the same parent
- [ ] Its second child
> The left pointer holds the first child, and each child's right pointer holds the next child of the same parent, forming a linked list of siblings. The root's right pointer is null because it has no siblings.
```

## Practice

1. **N-ary Tree Preorder Traversal** and **N-ary Tree Postorder Traversal.** Write both recursively and iteratively.
2. **N-ary Tree Level Order Traversal.** Use the level-size snapshot.
3. **Maximum Depth of N-ary Tree.** Solve recursively, then with BFS by counting levels.
4. **Diameter of N-ary Tree.** Track the two tallest children.
5. **Serialize and Deserialize N-ary Tree.** Use child counts; then write a parser for LeetCode's null-separated format.
6. **Encode N-ary Tree to Binary Tree.** Implement both directions and check a round trip.
7. **Employee Importance.** Aggregate over a hierarchy stored as a map from id to record.
8. **Build a tree from a parent array**, then compute every subtree's size in one postorder pass.

The DSA explorer lists these under Trees; start with *N-ary Tree Level Order Traversal* and *Maximum Depth of N-ary Tree*.

## Quick revision {#quick-revision}

- N-ary node: `int val` + `List<Node> children`; leaf = empty list; empty tree = `null`.
- Other representations: fixed child array (tries), parent array (database rows), adjacency list (graph input), left-child right-sibling.
- Preorder: node, then each child. Postorder: each child, then node. No inorder.
- Iterative preorder: pop, output, push children in reverse. Iterative postorder: pop, output, push children in order, reverse the output.
- Level order: snapshot `q.size()` once per level; enqueue all children.
- Depth: `1 + max(child depths)`; size/sum: `1 + sum`; diameter: two tallest children, record `first + second`, return `1 + first`.
- All traversals O(n): there are `n - 1` child references in total. Space O(h) for DFS, O(w) for BFS; a star has `w = n - 1`.
- From parents: create nodes, append each to its parent's list. From edges: traverse from the root, skipping the parent.
- Serialise: preorder `value, childCount, …`; decode reads `k` subtrees after each count.
- LeetCode format: `[1,null,3,2,4,null,5,6]` — child groups separated by `null`.
- LCRS: left = first child, right = next sibling; reversible; used by React Fiber (`child`, `sibling`, `return`).

## Key takeaways {#key-takeaways}

- An N-ary tree replaces a binary node's two child slots with an ordered list, and most binary-tree algorithms generalise by looping over that list.
- Preorder, postorder and level order carry over directly, while inorder has no meaning without a search-tree ordering.
- Bottom-up computations combine all children's results, and problems that used "left and right" usually need "the best two" instead.
- With no fixed child slots, serialisation records the shape with child counts or separators instead of null markers.
- The left-child right-sibling representation turns any N-ary tree into a binary tree, and real systems such as React Fiber use it to walk trees without recursion.
- File systems, the DOM, B-tree indexes and parsed documents are all N-ary trees, so these patterns apply directly to everyday engineering work.
