---
summary: Tree view problems ask which nodes you would see when looking at a drawn tree from one side — from the right, from above, from below, or column by column. You will learn to give every node a row and a column, and to solve right and left views, top and bottom views, vertical order, boundary traversal and maximum width as small variations of BFS or DFS over those coordinates.
difficulty: intermediate
minutes: 45
objectives:
  - Assign row and column coordinates to every node and explain how each view is defined in terms of them
  - Implement right and left side views with BFS and with depth-first search
  - Implement top and bottom views with BFS, and explain why a plain preorder DFS gives wrong top views
  - Produce vertical order traversal under both common tie-breaking rules
  - Solve boundary traversal and maximum width, and recognise when a problem is a view problem in disguise
---

## Introduction

Draw a binary tree on paper in the usual way: the root at the top, each left child below and to the left of its parent, each right child below and to the right. Now ask simple visual questions. If you stand to the right of the drawing, which nodes can you see? If you look down from above, which nodes are not hidden behind others? Which nodes line up in the same vertical column?

These are **tree view** problems. *Binary Tree Right Side View* and *Vertical Order Traversal of a Binary Tree* are on LeetCode; the top view, bottom view, left view and boundary traversal are long-standing staples on GeeksforGeeks and in interviews. They look like a collection of separate puzzles, but they share one idea: **give every node coordinates — a row and a column — and then each view is a rule for picking nodes by coordinate.** Once you have the coordinates, every view is a BFS or DFS you already know, with a map or list that remembers the right node for each row or column.

That is also why interviewers like these problems. They do not test a new algorithm; they test whether you can augment a standard traversal with the metadata a question needs, and whether you notice the traps in traversal order — the top view, in particular, has a famous wrong solution.

## Before you start

- **Tree BFS and level-order traversal** — processing a tree level by level with a queue and the level-size snapshot. See [[a6-bfs]] and [[a6-level-order]].
- **Tree DFS** — preorder, and passing a depth down to children. See [[a6-dfs]].
- **TreeMap and HashMap** — maps keyed by column. See [[a1-treemap]] and [[a1-hashmap]].
- **Sorting with comparators** — for vertical order with tie-breaking. See [[a3-comparator-sorting]].

## Coordinates for every node

Give the root the coordinates **row 0, column 0**. For any node at `(row, col)`:

- its left child is at `(row + 1, col - 1)`;
- its right child is at `(row + 1, col + 1)`.

The **row** is just the depth of the node. The **column** is its horizontal position in the drawing: going left subtracts one, going right adds one. Here is a complete tree of seven nodes with its columns:

```text
column:   -2   -1    0    1    2

                     1                 row 0
                   /   \
                 2       3             row 1
                / \     / \
               4   5   6   7           row 2
```

Node `2` is at column −1 and node `3` at column +1. Their children land at columns −2, 0, 0 and +2. Notice that `5` (left subtree, then right) and `6` (right subtree, then left) are both at row 2, column 0 — directly below the root. Columns are not unique. In this drawing they stack exactly, which is what makes the top and bottom views interesting.

With coordinates in hand, every view is a sentence:

| View | For each... | Keep the node that is... |
|---|---|---|
| Right side view | row | rightmost (last in BFS order) |
| Left side view | row | leftmost (first in BFS order) |
| Top view | column | highest (smallest row) |
| Bottom view | column | lowest (largest row; ties: later in level order) |
| Vertical order | column | all of them, top to bottom, with a tie rule |

For the tree above, the right view is `[1, 3, 7]`, the left view is `[1, 2, 4]`, the top view is `[4, 2, 1, 3, 7]` and the bottom view is `[4, 2, 6, 3, 7]` — column 0 has `1` at the top and both `5` and `6` at the bottom, and `6` comes later in level order.

A word of warning about the simplified drawing: the column model treats each step as one unit left or right, so in a real drawing nodes from different subtrees can overlap at the same coordinates. The view problems define visibility purely in terms of these coordinates, not in terms of a nicely laid-out picture, and you should state that model when you start.

## Side views: one node per row

### Right side view

The right side view lists, from top to bottom, the last node in each row. BFS already processes the tree row by row: snapshot the queue size at the start of each level, process exactly that many nodes, and the last one is the rightmost. This is covered in detail in [[a6-bfs]]:

```java
static List<Integer> rightView(TreeNode root) {
    List<Integer> out = new ArrayList<>();
    if (root == null) return out;
    Queue<TreeNode> q = new ArrayDeque<>(List.of(root));
    while (!q.isEmpty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            TreeNode n = q.remove();
            if (i == size - 1) out.add(n.val);       // rightmost in this level
            if (n.left != null) q.add(n.left);
            if (n.right != null) q.add(n.right);
        }
    }
    return out;
}
```

A common misconception is that the right view is the chain of right children from the root. It is not. In the tree `[1, 2, 3, 4]`, where `4` is the left child of `2`, the third row contains only `4`, so `4` is visible from the right even though it is in the left subtree. The right view is `[1, 3, 4]`.

### Left side view, and the DFS version

The left view is the mirror image: the first node of each row. It can be done with BFS (record the node at `i == 0`) or with a DFS that passes the depth down and visits the **left child first**. The first node a left-first DFS reaches at a new depth is the leftmost node of that row, because it explores everything to the left before anything to the right at the same depth. The trick for "is this a new depth?" is to compare the depth with the size of the output list: when they are equal, no node has been recorded at this depth yet.

```java
static void leftView(TreeNode n, int depth, List<Integer> out) {
    if (n == null) return;
    if (depth == out.size()) out.add(n.val);         // first visit to this depth
    leftView(n.left, depth + 1, out);
    leftView(n.right, depth + 1, out);
}
```

Visiting the right child first instead gives the right view. The DFS version uses O(h) stack instead of an O(w) queue, where `h` is the height and `w` the largest level width.

## Column views: one node per column

### Top view with BFS

The top view lists, from the leftmost column to the rightmost, the highest node in each column. BFS visits nodes in increasing row order, so **the first node BFS reaches in a column is the highest one** in that column. That makes the algorithm short: carry each node's column in the queue alongside the node, and record a column's value only if the column has not been seen before (`putIfAbsent`).

To print the columns in order, either use a `TreeMap` (which sorts its keys) or track the smallest and largest column seen and loop between them. Columns are consecutive integers — every column between the minimum and maximum contains a node, because a path from the root to the leftmost node passes through every column on the way — so a `HashMap` plus the range is enough and avoids the `log` factor of a `TreeMap`.

### Bottom view with BFS

The bottom view is the lowest node in each column. BFS can do that too, by **overwriting** the column's value every time instead of keeping the first: the last node BFS reaches in a column is in the deepest row. When two nodes share the same row and column, like `5` and `6` above, the one later in level order wins, which is the conventional definition. One method handles both views:

```java
static List<Integer> columnView(TreeNode root, boolean top) {
    Map<Integer, Integer> byCol = new HashMap<>();
    int minCol = 0, maxCol = 0;
    Queue<Cell> q = new ArrayDeque<>(List.of(new Cell(root, 0, 0)));
    while (!q.isEmpty()) {
        Cell c = q.remove();
        if (top) byCol.putIfAbsent(c.col(), c.node().val);  // first = highest
        else byCol.put(c.col(), c.node().val);              // last = lowest
        minCol = Math.min(minCol, c.col());
        maxCol = Math.max(maxCol, c.col());
        if (c.node().left != null) q.add(new Cell(c.node().left, c.row() + 1, c.col() - 1));
        if (c.node().right != null) q.add(new Cell(c.node().right, c.row() + 1, c.col() + 1));
    }
    List<Integer> out = new ArrayList<>();
    for (int col = minCol; col <= maxCol; col++) out.add(byCol.get(col));
    return out;
}
```

`Cell` is a small `record` holding the node with its row and column. Putting the coordinates in the same queue entry as the node keeps them in step; keeping a second, parallel queue of coordinates works too but is easy to desynchronise.

### The wrong DFS top view

Here is a solution that appears in many notes and looks right:

```java
static void topViewWrong(TreeNode n, int col, TreeMap<Integer, Integer> map) {
    if (n == null) return;
    map.putIfAbsent(col, n.val);
    topViewWrong(n.left, col - 1, map);
    topViewWrong(n.right, col + 1, map);
}
```

It keeps the first node a **preorder DFS** reaches in each column. The flaw is that preorder does not visit nodes in order of depth. It dives deep into the left subtree before it ever looks at the right subtree, and a deep node in the left subtree can reach a column on the right side of the tree before a shallow node of the right subtree does. Consider:

```text
          1            col 0
         / \
        2   3          2 at col -1, 3 at col +1 (row 1)
         \
          4            col 0 (row 2)
           \
            5          col +1 (row 3)
```

The correct top view is `[2, 1, 3]`: column +1 contains `3` at row 1 and `5` at row 3, and `3` is higher. But the DFS visits `1, 2, 4, 5` before `3`, so it claims column +1 for `5` and outputs `[2, 1, 5]`. On the balanced example tree, it happens to give the right answer, which is why the bug survives casual testing.

There are two correct fixes. Use BFS, whose visiting order *is* row order. Or keep using DFS but store the row along with the value for each column and replace the stored node whenever a shallower one arrives:

```java
static void topViewDfs(TreeNode n, int row, int col, TreeMap<Integer, int[]> best) {
    if (n == null) return;
    int[] cur = best.get(col);
    if (cur == null || row < cur[0]) best.put(col, new int[] {row, n.val});
    topViewDfs(n.left, row + 1, col - 1, best);
    topViewDfs(n.right, row + 1, col + 1, best);
}
```

The same reasoning applies to the bottom view: with DFS you must compare rows (and break ties between equal rows deliberately), whereas with BFS the visiting order does the work.

> [!WARNING] Test views on lopsided trees
> Perfect trees hide traversal-order bugs, because every column's nodes are reached in a convenient order. Always test a view algorithm on a tree where a deep branch of one subtree crosses into the other subtree's columns.

### Worked example

```java title="Views.java"
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.TreeMap;

public class Views {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    record Cell(TreeNode node, int row, int col) {}

    // ---- Right side view: the last node of each BFS level ----
    static List<Integer> rightView(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        if (root == null) return out;
        Queue<TreeNode> q = new ArrayDeque<>(List.of(root));
        while (!q.isEmpty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                TreeNode n = q.remove();
                if (i == size - 1) out.add(n.val);       // rightmost in this level
                if (n.left != null) q.add(n.left);
                if (n.right != null) q.add(n.right);
            }
        }
        return out;
    }

    // ---- Left side view: DFS left first, keep the first node seen at each depth ----
    static void leftView(TreeNode n, int depth, List<Integer> out) {
        if (n == null) return;
        if (depth == out.size()) out.add(n.val);         // first visit to this depth
        leftView(n.left, depth + 1, out);
        leftView(n.right, depth + 1, out);
    }

    // ---- Top and bottom view: BFS with columns ----
    static List<Integer> columnView(TreeNode root, boolean top) {
        Map<Integer, Integer> byCol = new HashMap<>();
        int minCol = 0, maxCol = 0;
        Queue<Cell> q = new ArrayDeque<>(List.of(new Cell(root, 0, 0)));
        while (!q.isEmpty()) {
            Cell c = q.remove();
            if (top) byCol.putIfAbsent(c.col(), c.node().val);  // first = highest
            else byCol.put(c.col(), c.node().val);              // last = lowest
            minCol = Math.min(minCol, c.col());
            maxCol = Math.max(maxCol, c.col());
            if (c.node().left != null) q.add(new Cell(c.node().left, c.row() + 1, c.col() - 1));
            if (c.node().right != null) q.add(new Cell(c.node().right, c.row() + 1, c.col() + 1));
        }
        List<Integer> out = new ArrayList<>();
        for (int col = minCol; col <= maxCol; col++) out.add(byCol.get(col));
        return out;
    }

    // ---- A tempting but WRONG top view: preorder DFS, first visit per column wins ----
    static void topViewWrong(TreeNode n, int col, TreeMap<Integer, Integer> map) {
        if (n == null) return;
        map.putIfAbsent(col, n.val);
        topViewWrong(n.left, col - 1, map);
        topViewWrong(n.right, col + 1, map);
    }

    // ---- Correct DFS top view: keep the shallowest node per column ----
    static void topViewDfs(TreeNode n, int row, int col, TreeMap<Integer, int[]> best) {
        if (n == null) return;
        int[] cur = best.get(col);
        if (cur == null || row < cur[0]) best.put(col, new int[] {row, n.val});
        topViewDfs(n.left, row + 1, col - 1, best);
        topViewDfs(n.right, row + 1, col + 1, best);
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
        //          1
        //        /   \
        //       2     3
        //      / \   / \
        //     4   5 6   7
        TreeNode t = fromLevelOrder(new Integer[] {1, 2, 3, 4, 5, 6, 7});
        List<Integer> left = new ArrayList<>();
        leftView(t, 0, left);
        System.out.println("right view:  " + rightView(t));
        System.out.println("left view:   " + left);
        System.out.println("top view:    " + columnView(t, true));
        System.out.println("bottom view: " + columnView(t, false));

        //      1
        //     / \
        //    2   3
        //     \
        //      4
        //       \
        //        5
        TreeNode s = fromLevelOrder(new Integer[] {1, 2, 3, null, 4, null, null, null, 5});
        TreeMap<Integer, Integer> wrong = new TreeMap<>();
        topViewWrong(s, 0, wrong);
        TreeMap<Integer, int[]> best = new TreeMap<>();
        topViewDfs(s, 0, 0, best);
        List<Integer> fixed = new ArrayList<>();
        for (int[] e : best.values()) fixed.add(e[1]);
        System.out.println("top view (BFS):          " + columnView(s, true));
        System.out.println("top view (DFS, wrong):   " + wrong.values());
        System.out.println("top view (DFS, by row):  " + fixed);
    }
}
```

```output
right view:  [1, 3, 7]
left view:   [1, 2, 4]
top view:    [4, 2, 1, 3, 7]
bottom view: [4, 2, 6, 3, 7]
top view (BFS):          [2, 1, 3]
top view (DFS, wrong):   [2, 1, 5]
top view (DFS, by row):  [2, 1, 3]
```

### Dry run: top and bottom view on the lopsided tree

Trace the BFS on the second tree. Each row is one node removed from the queue.

| Removed | Row | Col | Top view map after | Bottom view map after |
|---|---|---|---|---|
| 1 | 0 | 0 | 0→1 | 0→1 |
| 2 | 1 | −1 | 0→1, −1→2 | 0→1, −1→2 |
| 3 | 1 | +1 | adds +1→3 | adds +1→3 |
| 4 | 2 | 0 | unchanged (0 taken) | 0→4 |
| 5 | 3 | +1 | unchanged (+1 taken) | +1→5 |

The top view keeps `[2, 1, 3]`; the bottom view becomes `[2, 4, 5]`. Node `3` claims column +1 at row 1 before `5` is ever dequeued, because BFS finishes all of row 1 before any of row 3 — the property the preorder DFS lacked.

## Vertical order traversal

Vertical order lists **every** node, grouped by column from left to right, and within each column from top to bottom. The only question is what to do with nodes at the **same row and column**, and the two well-known versions of the problem answer it differently:

- *Binary Tree Vertical Order Traversal* (LeetCode 314): nodes in the same row and column appear **left to right**, which is simply BFS order.
- *Vertical Order Traversal of a Binary Tree* (LeetCode 987): nodes in the same row and column are **sorted by value**.

The difference only shows when two nodes share a cell. In the tree `[1, 2, 3, 4, 6, 5, 7]`, `6` (right child of `2`) and `5` (left child of `3`) are both at row 2, column 0. BFS order gives column 0 as `[1, 6, 5]`; sorting by value gives `[1, 5, 6]`.

For the BFS version, append each node to its column's list as BFS reaches it: BFS order is already top to bottom, and left to right within a row. For the sorted version, collect a `(col, row, val)` triple for every node with any traversal, sort the triples by column, then row, then value, and cut the sorted list into groups by column.

```java
static List<List<Integer>> verticalSorted(TreeNode root) {
    List<int[]> cells = new ArrayList<>();               // {col, row, val}
    collect(root, 0, 0, cells);
    cells.sort((a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0])
                       : a[1] != b[1] ? Integer.compare(a[1], b[1])
                       : Integer.compare(a[2], b[2]));
    List<List<Integer>> out = new ArrayList<>();
    Integer lastCol = null;
    for (int[] c : cells) {
        if (lastCol == null || c[0] != lastCol) { out.add(new ArrayList<>()); lastCol = c[0]; }
        out.get(out.size() - 1).add(c[2]);
    }
    return out;
}
```

`Integer.compare` is used instead of subtraction (`a[0] - b[0]`) because subtraction can overflow for large values and produce a wrong ordering. The BFS version is O(n) time; the sorted version is **O(n log n)** because of the sort. A common mistake in notes is to sort each column by row but forget the value tie-break, which passes most tests and fails exactly the cells where two nodes coincide.

## Boundary traversal

The **boundary** of a tree, as defined in *Boundary of Binary Tree*, is the anticlockwise outline starting at the root: the root, then the **left boundary** going down, then **all leaves** from left to right, then the **right boundary** going up. The left boundary is the path from the root's left child that always goes left when possible and right otherwise, stopping before a leaf; the right boundary is its mirror image. Leaves are excluded from both boundaries so that they are not listed twice.

```text
               1
            /     \
          2         3
         / \       /
        4   5     6
           / \   / \
          7   8 9   10

boundary: 1, 2, 4, 7, 8, 9, 10, 6, 3
```

Reading it: the root `1`; the left boundary is just `2` (its next step, `4`, is a leaf); the leaves `4, 7, 8, 9, 10` from left to right; and the right boundary `3, 6` read bottom-up as `6, 3`. Three simple passes produce it: walk the left edge, collect leaves with a DFS, and walk the right edge into a list that is then reversed.

```java
static List<Integer> boundary(TreeNode root) {
    List<Integer> out = new ArrayList<>();
    if (root == null) return out;
    if (!isLeaf(root)) out.add(root.val);
    for (TreeNode n = root.left; n != null; n = (n.left != null) ? n.left : n.right) {
        if (!isLeaf(n)) out.add(n.val);                  // left edge, top down
    }
    addLeaves(root, out);
    List<Integer> right = new ArrayList<>();
    for (TreeNode n = root.right; n != null; n = (n.right != null) ? n.right : n.left) {
        if (!isLeaf(n)) right.add(n.val);                // right edge, top down...
    }
    Collections.reverse(right);                          // ...then bottom up
    out.addAll(right);
    return out;
}
```

The edge cases are what make this problem tricky. A root that is itself a leaf is listed once, by the leaf pass. A root with no left child has an empty left boundary — the left boundary does not "borrow" from the right subtree. The leaf pass must start at the root, not at its children, so that a single-node tree still outputs its root.

## Maximum width: coordinates without columns

*Maximum Width of Binary Tree* defines the width of a level as the number of positions between its leftmost and rightmost nodes, **counting the gaps** where nodes are missing, as if the tree were complete. Columns cannot measure that, because different subtrees overlap in column numbers. Instead use the array layout of a complete tree ([[a7-min-heap]]): give the root position 0, and a node at position `i` children at `2i` and `2i + 1` within the next level's numbering. The width of a level is `last position − first position + 1`.

Positions double at every level, so on a deep, skewed tree they overflow even a `long` after about 63 levels. The fix is to **renumber each level** relative to its first position before computing children:

```java
static int maxWidth(TreeNode root) {
    record Pos(TreeNode node, long index) {}
    int best = 0;
    Queue<Pos> q = new ArrayDeque<>(List.of(new Pos(root, 0)));
    while (!q.isEmpty()) {
        int size = q.size();
        long first = q.peek().index();
        long last = first;
        for (int i = 0; i < size; i++) {
            Pos p = q.remove();
            long idx = p.index() - first;                // keep numbers small
            last = idx;
            if (p.node().left != null) q.add(new Pos(p.node().left, 2 * idx));
            if (p.node().right != null) q.add(new Pos(p.node().right, 2 * idx + 1));
        }
        best = Math.max(best, (int) (last + 1));
    }
    return best;
}
```

Subtracting `first` shifts the level so its leftmost node is at 0, and the next level's positions are then at most about twice the current level's width, rather than `2^depth`. Widths themselves stay small because the problem guarantees the answer fits in 32 bits.

```java title="VerticalAndBoundary.java"
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Queue;

public class VerticalAndBoundary {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    record Cell(TreeNode node, int row, int col) {}

    // ---- Vertical order, BFS order inside a column (top to bottom, left to right) ----
    static List<List<Integer>> verticalBfs(TreeNode root) {
        List<List<Integer>> out = new ArrayList<>();
        if (root == null) return out;
        Map<Integer, List<Integer>> byCol = new HashMap<>();
        int minCol = 0, maxCol = 0;
        Queue<Cell> q = new ArrayDeque<>(List.of(new Cell(root, 0, 0)));
        while (!q.isEmpty()) {
            Cell c = q.remove();
            byCol.computeIfAbsent(c.col(), k -> new ArrayList<>()).add(c.node().val);
            minCol = Math.min(minCol, c.col());
            maxCol = Math.max(maxCol, c.col());
            if (c.node().left != null) q.add(new Cell(c.node().left, c.row() + 1, c.col() - 1));
            if (c.node().right != null) q.add(new Cell(c.node().right, c.row() + 1, c.col() + 1));
        }
        for (int col = minCol; col <= maxCol; col++) out.add(byCol.get(col));
        return out;
    }

    // ---- Vertical order, ties at the same (row, col) broken by value ----
    static List<List<Integer>> verticalSorted(TreeNode root) {
        List<int[]> cells = new ArrayList<>();               // {col, row, val}
        collect(root, 0, 0, cells);
        cells.sort((a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0])
                           : a[1] != b[1] ? Integer.compare(a[1], b[1])
                           : Integer.compare(a[2], b[2]));
        List<List<Integer>> out = new ArrayList<>();
        Integer lastCol = null;
        for (int[] c : cells) {
            if (lastCol == null || c[0] != lastCol) { out.add(new ArrayList<>()); lastCol = c[0]; }
            out.get(out.size() - 1).add(c[2]);
        }
        return out;
    }

    static void collect(TreeNode n, int row, int col, List<int[]> cells) {
        if (n == null) return;
        cells.add(new int[] {col, row, n.val});
        collect(n.left, row + 1, col - 1, cells);
        collect(n.right, row + 1, col + 1, cells);
    }

    // ---- Boundary: root, left boundary, leaves, right boundary reversed ----
    static boolean isLeaf(TreeNode n) { return n.left == null && n.right == null; }

    static List<Integer> boundary(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        if (root == null) return out;
        if (!isLeaf(root)) out.add(root.val);
        for (TreeNode n = root.left; n != null; n = (n.left != null) ? n.left : n.right) {
            if (!isLeaf(n)) out.add(n.val);                  // left edge, top down
        }
        addLeaves(root, out);
        List<Integer> right = new ArrayList<>();
        for (TreeNode n = root.right; n != null; n = (n.right != null) ? n.right : n.left) {
            if (!isLeaf(n)) right.add(n.val);                // right edge, top down...
        }
        Collections.reverse(right);                          // ...then bottom up
        out.addAll(right);
        return out;
    }

    static void addLeaves(TreeNode n, List<Integer> out) {
        if (n == null) return;
        if (isLeaf(n)) { out.add(n.val); return; }
        addLeaves(n.left, out);
        addLeaves(n.right, out);
    }

    // ---- Maximum width: heap-style positions, renumbered per level ----
    static int maxWidth(TreeNode root) {
        record Pos(TreeNode node, long index) {}
        int best = 0;
        Queue<Pos> q = new ArrayDeque<>(List.of(new Pos(root, 0)));
        while (!q.isEmpty()) {
            int size = q.size();
            long first = q.peek().index();
            long last = first;
            for (int i = 0; i < size; i++) {
                Pos p = q.remove();
                long idx = p.index() - first;                // keep numbers small
                last = idx;
                if (p.node().left != null) q.add(new Pos(p.node().left, 2 * idx));
                if (p.node().right != null) q.add(new Pos(p.node().right, 2 * idx + 1));
            }
            best = Math.max(best, (int) (last + 1));
        }
        return best;
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
        TreeNode a = fromLevelOrder(new Integer[] {3, 9, 8, 4, 0, 1, 7});
        System.out.println("vertical (BFS order):  " + verticalBfs(a));
        TreeNode b = fromLevelOrder(new Integer[] {1, 2, 3, 4, 6, 5, 7});
        System.out.println("vertical (BFS order):  " + verticalBfs(b));
        System.out.println("vertical (sorted):     " + verticalSorted(b));

        TreeNode c = fromLevelOrder(new Integer[] {1, 2, 3, 4, 5, 6, null, null, null, 7, 8, 9, 10});
        System.out.println("boundary:              " + boundary(c));

        TreeNode d = fromLevelOrder(new Integer[] {1, 3, 2, 5, 3, null, 9});
        System.out.println("max width:             " + maxWidth(d));
    }
}
```

```output
vertical (BFS order):  [[4], [9], [3, 0, 1], [8], [7]]
vertical (BFS order):  [[4], [2], [1, 6, 5], [3], [7]]
vertical (sorted):     [[4], [2], [1, 5, 6], [3], [7]]
boundary:              [1, 2, 4, 7, 8, 9, 10, 6, 3]
max width:             4
```

In the first tree, `[3, 9, 8, 4, 0, 1, 7]`, column 0 holds the root `3` and the two row-2 nodes `0` (right child of `9`) and `1` (left child of `8`), in left-to-right order. The second and third lines show the two tie rules disagreeing on the cell shared by `6` and `5`. In the width example, the last level has `5` at position 0 and `9` at position 3, with two missing positions between them, so the width is 4 even though the level holds only three nodes.

## Complexity

| Problem | Time | Space |
|---|---|---|
| Right / left view (BFS) | O(n) | O(w) queue |
| Right / left view (DFS) | O(n) | O(h) stack |
| Top / bottom view (BFS, HashMap + range) | O(n) | O(n) |
| Top / bottom view with a TreeMap | O(n log c) for `c` columns | O(n) |
| Vertical order, BFS tie rule | O(n) | O(n) |
| Vertical order, sorted tie rule | O(n log n) | O(n) |
| Boundary traversal | O(n) | O(h) |
| Maximum width | O(n) | O(w) |

Every algorithm visits each node once. The extra costs come from ordering: a `TreeMap` adds O(log c) per insertion, and the value tie-break requires a sort. The number of columns `c` is at most `n`: a perfect tree with `h` levels spans only `2h - 1` columns, which is O(log n), while a chain of `n` nodes spans `n`.

## In real systems

**Drawing trees.** Tree visualisers in debuggers, organisation-chart tools and Git history viewers must assign each node an x and y position. The simple column scheme of this lesson is the starting point; production layout algorithms, such as the Reingold–Tilford family, shift subtrees apart so that nodes never overlap and the drawing stays compact. Problems like the top view describe what the naive scheme would show.

**User interfaces over hierarchies.** A file explorer that shows "the first item at each nesting level" or a breadcrumb that shows one item per depth is computing a side view. A UI that collapses a tree to its outline — top-level items and leaves — is close to a boundary traversal.

**Spatial indexing.** Assigning coordinates or positions to tree nodes is the same move that heap arrays and segment trees ([[a12-segment-trees]]) make: once every node has an index, relationships can be computed arithmetically instead of by following references.

## Trade-offs and alternatives

**BFS or DFS?** For anything defined by "first" or "last" in a row or a column, BFS is the natural fit, because its visiting order matches the definition and the code needs no extra comparisons. DFS works for all of these problems too, but only if you carry the row and compare it explicitly; it uses less memory on very wide trees (O(h) instead of O(w)).

**TreeMap or HashMap with a range?** A `TreeMap` keeps columns sorted automatically and is the easiest to write. A `HashMap` plus the minimum and maximum column is faster, and correct because columns form a contiguous range. A third option is to compute the minimum column first (one DFS) and then use an `ArrayList` indexed by `col - minCol`.

**Which tie rule?** Ask. "Vertical order" and "bottom view" both have more than one definition in circulation, and the difference appears only when two nodes share a cell.

## Common mistakes

> [!MISTAKE] Preorder DFS with "first visit wins" for the top view
> Preorder reaches deep nodes of the left subtree before shallow nodes of the right subtree, so it can claim a column for the wrong node. Use BFS, or store the row with each column's node and keep the shallowest.

**Treating the right view as the chain of right children.** A node in the left subtree is visible from the right when its row has nothing further right.

**Forgetting the level-size snapshot.** In BFS side views, reading `q.size()` inside the loop changes as children are added, mixing levels. Capture it once per level.

**Desynchronised coordinate queues.** Keeping nodes in one queue and coordinates in another invites bugs such as polling the coordinate queue twice per node. Store the node and its coordinates together, for example in a `record`.

**Missing the tie-break in vertical order.** Sorting a column by row alone leaves nodes in the same cell in arbitrary order. Know which rule the problem wants and implement it.

**Double-counting in boundary traversal.** Leaves appear on the left or right edge as well as in the leaf pass. Exclude leaves from the edge walks.

**Overflowing positions in maximum width.** Doubling an index at every level overflows after a few dozen levels on skewed trees. Renumber each level from 0.

## Interview perspective

Interviewers use view problems to see whether you can turn a picture into a precise rule. Start by defining coordinates out loud.

> [!INTERVIEW] Framing a view problem
> "I'll give the root row 0 and column 0, left children column minus one, right children column plus one. The top view is then the smallest-row node in each column. BFS visits rows in order, so the first node it sees in each column is the answer; I'll carry the column in the queue and record it with `putIfAbsent`. That's O(n) with a hash map and the column range."

Questions to be ready for:

- **Right side view?** BFS, last node per level; or DFS right-first, first node per new depth.
- **Top vs bottom view?** Same coordinates and BFS; top keeps the first node per column, bottom overwrites to keep the last.
- **Why not DFS with `putIfAbsent` for the top view?** Preorder is not row order; give the lopsided counterexample.
- **Vertical order ties?** Clarify: left-to-right BFS order, or sorted by value.
- **Boundary traversal edge cases?** Root as a leaf, missing left subtree, leaves not duplicated.
- **Follow-up: views of an N-ary tree?** Side views work unchanged with a loop over children ([[a6-nary-trees]]); columns need a definition, since there is no single left or right.

```quiz
Q: For the tree [1, 2, 3, 4] (4 is the left child of 2), what is the right side view?
- [ ] [1, 3]
- [x] [1, 3, 4]
- [ ] [1, 2, 4]
- [ ] [4, 2, 1, 3]
> The right view is the last node in each row. Row 0 is 1, row 1 ends with 3, and row 2 contains only 4. The fact that 4 is in the left subtree does not hide it, because nothing in its row lies further right.

Q: Why does a preorder DFS that keeps the first node seen in each column give wrong top views?
- [ ] Because DFS cannot track columns
- [x] Because preorder can reach a deep node of the left subtree before a shallow node of the right subtree in the same column
- [ ] Because DFS visits right children first
- [ ] Because TreeMap sorts columns incorrectly
> The top view needs the smallest row in each column. Preorder finishes the whole left subtree before starting the right one, so a deep left-subtree node that drifts into a right-hand column claims it first. BFS visits rows in order, which matches the definition.

Q: In the tree [1, 2, 3, 4, 6, 5, 7], nodes 6 and 5 share row 2 and column 0. Under the "sort ties by value" rule, what is column 0 in vertical order?
- [ ] [1, 6, 5]
- [x] [1, 5, 6]
- [ ] [5, 6, 1]
- [ ] [1]
> Within a column, nodes are ordered by row first, so 1 (row 0) comes first. 6 and 5 are in the same row and column, so the tie-break applies: sorted by value gives 5 then 6. The BFS-order version of the problem would give [1, 6, 5] instead.

Q: How does a BFS compute the bottom view?
- [ ] Keep the first node seen in each column
- [x] Overwrite each column's entry with every node seen, so the last (deepest) one remains
- [ ] Keep the node with the largest value in each column
- [ ] Record the last node of each level
> BFS visits nodes in increasing row order, so the last node it records in a column is in that column's deepest row. With ties in the same row, the later node in level order wins, which matches the usual definition. Keeping the last node of each level would be the right side view.
```

## Practice

1. **Binary Tree Right Side View.** Solve with BFS and with right-first DFS.
2. **Left view.** Adapt either solution and test on a tree whose leftmost deep node is in the right subtree.
3. **Top view and bottom view.** Use BFS with columns; then write the row-aware DFS and check it against the lopsided tree from this lesson.
4. **Binary Tree Vertical Order Traversal** (BFS tie rule) and **Vertical Order Traversal of a Binary Tree** (sorted tie rule).
5. **Boundary of Binary Tree.** Test a single node, a tree with no left subtree, and a chain.
6. **Maximum Width of Binary Tree.** Test a skewed tree of depth 100 to confirm the renumbering prevents overflow.

The DSA explorer lists these under Trees; start with *Binary Tree Right Side View* and *Vertical Order Traversal of a Binary Tree*.

## Quick revision {#quick-revision}

- Coordinates: root `(0, 0)`; left child `(row + 1, col - 1)`; right child `(row + 1, col + 1)`. Row = depth.
- Right view: last node per BFS level (`i == size - 1`), or DFS right-first recording the first node at each new depth (`depth == out.size()`).
- Left view: first node per level, or DFS left-first.
- Top view: BFS with columns; `putIfAbsent` keeps the highest node per column.
- Bottom view: BFS with columns; `put` overwrites, keeping the lowest (later in level order on ties).
- Preorder DFS + `putIfAbsent` is wrong for top view; with DFS, store the row and keep the shallowest.
- Columns are contiguous: a `HashMap` plus min/max column avoids a `TreeMap`.
- Vertical order: BFS order within a column (O(n)), or sort by (col, row, value) (O(n log n)). Use `Integer.compare`, not subtraction.
- Boundary: root, left edge (no leaves), all leaves left to right, right edge reversed (no leaves).
- Maximum width: heap positions `2i`, `2i + 1`; renumber each level from 0 to avoid overflow.

## Key takeaways {#key-takeaways}

- Every view problem becomes simple once each node has a row and a column; each view is then a rule for choosing nodes by coordinate.
- BFS visits nodes in row order, which makes "first" and "last" in a row or column correspond directly to the views.
- DFS can solve the same problems only if it carries the row and compares it, because preorder is not ordered by depth.
- Vertical order and bottom view have competing tie-breaking rules, so clarify which one is wanted before coding.
- Boundary traversal is three simple passes; the difficulty lies in the edge cases, especially not listing leaves twice.
- Position numbering borrowed from the array layout of complete trees measures widths with gaps, as long as each level is renumbered to prevent overflow.
