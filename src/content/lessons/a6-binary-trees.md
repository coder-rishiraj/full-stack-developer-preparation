---
summary: A binary tree stores data as a hierarchy in which every node has at most two children. You will learn the vocabulary and shapes of binary trees, how to represent and build them in Java, and the recursive way of thinking that solves almost every tree problem in a few lines.
difficulty: beginner
minutes: 55
objectives:
  - Explain the parts of a binary tree (root, leaf, edge, subtree, depth, height) on a concrete example
  - Implement a TreeNode class and build a tree by hand and from LeetCode-style level-order input
  - Distinguish full, complete, perfect, balanced and degenerate trees and relate height to node count
  - Write recursive tree functions using the base case, recurse, combine structure and derive their O(n) time and O(h) space
  - Choose between linked-node and array representations for a given tree
---

## Introduction

Most of the data structures you have met so far are **linear**. An array, a linked list, a stack and a queue all arrange elements in a single line: every element has at most one element before it and one after it. Plenty of real data does not look like a line. A company has a chief executive, who has several managers, each of whom has a team. A folder contains files and other folders, which contain more files. The arithmetic expression `(3 + 4) * 2` has a multiplication whose left operand is itself an addition. In each case the natural relationship is "this item **contains** or **is in charge of** those items", and a line cannot express that without losing information.

A **tree** is the data structure for hierarchies. It is a collection of **nodes** connected so that there is one special top node, and every other node hangs below exactly one node above it. A **binary tree** is the most common restriction of that idea: each node has **at most two** children, called the **left child** and the **right child**.

Binary trees matter for three reasons. First, many important structures are binary trees with extra rules added: a binary search tree keeps its values ordered ([[a6-bst]]), a heap keeps the smallest value on top ([[a7-min-heap]]), and Java's `TreeMap` is a self-balancing binary search tree. Second, trees are the single largest family of coding-interview problems, and nearly all of them reuse the same handful of ideas taught in this module. Third, learning trees is how most engineers become comfortable with recursion, because a tree is defined in terms of smaller trees.

This lesson builds the foundation: vocabulary, shapes, representation in Java, and the recursive habit of mind. The next lessons use it to traverse trees depth-first ([[a6-dfs]]) and level by level ([[a6-bfs]]), and to compute heights ([[a6-height-depth]]) and diameters ([[a6-diameter]]).

## Before you start

- **Recursion** — a method that calls itself on a smaller input, with a base case that stops it. Almost every tree algorithm is recursive. See [[a1-recursion]].
- **Linked lists** — objects that hold references to other objects of the same class. A tree node is a linked-list node with two "next" references instead of one. See [[a4-singly-linked-lists]].
- **Big-O notation** — reading O(n) and O(log n). See [[a1-time-complexity]] and [[a1-big-o]].
- **Stacks and queues** — you will meet them as the machinery behind traversal. See [[a5-stack]] and [[a5-queue]].

## The intuition

Picture a company organisation chart. The chief executive sits at the top. Directly below are the people who report to them, and below each of those, their own reports. To find out how many people work in the engineering department, you do not need to look at the whole company: you ask the head of engineering, who asks each of their managers, who each count their own teams and report back. The head of engineering adds up the answers and adds one for themself.

That small story contains the two ideas that make trees easy to work with:

1. **Every node is the top of its own smaller tree.** The head of engineering is the top of the engineering sub-chart, which is itself a complete organisation chart.
2. **A question about a tree can be answered by asking the same question of its sub-trees and combining the answers.** That is recursion, and it is how you will solve most tree problems.

In a binary tree, every person has at most two direct reports, and we care about which one is on the left and which is on the right. The analogy stops working in one place: in a real organisation someone might report to two managers. In a tree that is forbidden. Every node except the top has **exactly one** parent, which is what guarantees there is exactly one path from the top to any node, and no cycles.

## Vocabulary on a concrete tree

We will use this tree throughout the lesson:

```text
          1
        /   \
       2     3
      / \     \
     4   5     6
```

- The **root** is the node with no parent — here, `1`. A non-empty tree has exactly one root.
- An **edge** is the link between a node and one of its children. This tree has five edges: 1–2, 1–3, 2–4, 2–5 and 3–6.
- A **parent** is the node directly above; a **child** is a node directly below. `2` is the parent of `4` and `5`; `6` is the right child of `3`. Nodes with the same parent, such as `4` and `5`, are **siblings**.
- A **leaf** is a node with no children: `4`, `5` and `6`. A node with at least one child is an **internal node**: `1`, `2` and `3`.
- An **ancestor** of a node is any node on the path from the root down to it; a **descendant** is any node below it. `1` and `2` are ancestors of `5`.
- The **subtree** rooted at a node is that node together with all its descendants. The subtree rooted at `2` contains `2`, `4` and `5`, and it is a binary tree in its own right.
- The **depth** of a node is the number of edges from the root to it. The root has depth 0; `4`, `5` and `6` have depth 2. All nodes at the same depth form a **level**.
- The **height** of a node is the number of edges on the longest downward path from it to a leaf. Leaves have height 0, and the height of the tree is the height of its root — 2 here.

| Node | Parent | Children | Depth | Height | Leaf? |
|---|---|---|---|---|---|
| 1 | none | 2, 3 | 0 | 2 | no |
| 2 | 1 | 4, 5 | 1 | 1 | no |
| 3 | 1 | 6 (right) | 1 | 1 | no |
| 4 | 2 | none | 2 | 0 | yes |
| 5 | 2 | none | 2 | 0 | yes |
| 6 | 3 | none | 2 | 0 | yes |

Depth is measured downward from the root, height upward from the leaves. Some sources, including LeetCode's "Maximum Depth" problem, count **nodes** on the path instead of edges, so they would say this tree has depth 3. Neither convention is wrong, but mixing them causes off-by-one errors; [[a6-height-depth]] covers this in detail. In this lesson, depth and height count edges.

### The recursive definition

Here is a definition that looks circular but is perfectly precise:

> A binary tree is either **empty**, or it is a **root node** together with two binary trees, called its **left subtree** and **right subtree**.

The definition refers to binary trees inside itself, but always to *smaller* ones, and it has a case that does not refer to itself at all (the empty tree). That is exactly the shape of a recursive method: a base case, and a recursive case on smaller input. When you write tree code, you are translating this definition into Java. The empty tree becomes `null`, and "a root together with two subtrees" becomes a node object with two references.

The definition also explains why left and right are different. A node with only a left child and a node with only a right child are different binary trees, because the empty subtree is in a different position.

## Representing a binary tree in Java

The standard representation is a class with a value and two references:

```java
class TreeNode {
    int val;
    TreeNode left;   // root of the left subtree, or null if it is empty
    TreeNode right;  // root of the right subtree, or null if it is empty

    TreeNode(int val) { this.val = val; }
}
```

This is the same `TreeNode` LeetCode and most interview platforms use. A `null` reference means "the subtree here is empty". A leaf is a node whose `left` and `right` are both `null`. The tree as a whole is represented by a reference to its root; an empty tree is a `null` root.

Each node is a separate object on the heap, and the references are what connect them. On a typical 64-bit HotSpot JVM with compressed references, a node like this occupies about 24 bytes (an object header plus an `int` and two references), so a million-node tree uses roughly 24 MB before counting anything the values point to. The nodes are scattered across memory, which makes trees less cache-friendly than arrays — one of the trade-offs discussed later.

### Building a tree by hand

```java title="BuildByHand.java"
public class BuildByHand {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        root.left.left = new TreeNode(4);
        root.left.right = new TreeNode(5);
        root.right.right = new TreeNode(6);   // 3 has no left child

        System.out.println("root: " + root.val);
        System.out.println("root.left.right: " + root.left.right.val);
        System.out.println("3 has a left child? " + (root.right.left != null));
        System.out.println("4 is a leaf? " + (root.left.left.left == null
                && root.left.left.right == null));
    }
}
```

```output
root: 1
root.left.right: 5
3 has a left child? false
4 is a leaf? true
```

Writing chains such as `root.left.right` works for tiny trees, but it does not scale, and tests need many trees. That is why problems describe trees in a compact text format.

### Reading LeetCode's level-order notation

LeetCode writes the tree above as `[1,2,3,4,5,null,6]`. The list is the tree read **level by level, left to right**, with `null` marking a missing child. Read it like this: `1` is the root. The next two entries, `2` and `3`, are the children of `1`. The next two, `4` and `5`, are the children of `2`. The next two, `null` and `6`, are the children of `3` — so `3` has no left child. Two rules keep the list short: children of a missing node are not listed at all, and trailing `null`s are dropped.

The rule "each node, in order, takes the next two entries as its children" is a queue in disguise: nodes wait their turn to receive children in the same order they were created. Here is a builder that does exactly that, which you can reuse when testing your own solutions:

```java title="LevelOrderBuilder.java"
import java.util.ArrayDeque;
import java.util.Queue;

public class LevelOrderBuilder {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    /** Builds a tree from LeetCode notation, e.g. {1, 2, 3, 4, 5, null, 6}. */
    static TreeNode fromLevelOrder(Integer[] values) {
        if (values.length == 0 || values[0] == null) return null;
        TreeNode root = new TreeNode(values[0]);
        Queue<TreeNode> waiting = new ArrayDeque<>();  // nodes still owed children
        waiting.add(root);
        int i = 1;
        while (i < values.length) {
            TreeNode parent = waiting.remove();
            if (values[i] != null) {                   // next entry: left child
                parent.left = new TreeNode(values[i]);
                waiting.add(parent.left);
            }
            i++;
            if (i < values.length && values[i] != null) { // then: right child
                parent.right = new TreeNode(values[i]);
                waiting.add(parent.right);
            }
            i++;
        }
        return root;
    }

    /** Prints the tree sideways: root on the left, right subtree above. */
    static void print(TreeNode node, int depth) {
        if (node == null) return;
        print(node.right, depth + 1);
        System.out.println("    ".repeat(depth) + node.val);
        print(node.left, depth + 1);
    }

    public static void main(String[] args) {
        TreeNode root = fromLevelOrder(new Integer[] {1, 2, 3, 4, 5, null, 6});
        print(root, 0);
    }
}
```

```output
        6
    3
1
        5
    2
        4
```

Tilt your head to the left and you see the original tree: `1` at the root, `3` above it on the right with its single child `6`, and `2` below with children `4` and `5`. Notice that `null` entries never enter the queue, which is how "children of a missing node are not listed" is enforced automatically. `ArrayDeque` is used as the queue because it is faster than `LinkedList` and rejects `null`, which would only ever be a bug here.

## Shapes of binary trees

The same number of nodes can be arranged in very different shapes, and the shape decides how fast tree operations are. Five named shapes come up constantly.

```text
 full          complete       perfect        degenerate
   1              1              1             1
  / \            / \            / \             \
 2   3          2   3          2   3             2
    / \        / \            / \ / \             \
   4   5      4   5          4  5 6  7             3
```

- A **full** binary tree is one in which every node has either zero or two children — never exactly one. Expression trees for binary operators are full: every operator has two operands, every number is a leaf.
- A **complete** binary tree has every level completely filled except possibly the last, and the last level is filled from the left with no gaps. Complete trees can be stored in an array with no wasted slots, which is why binary heaps use them.
- A **perfect** binary tree has every internal node with two children and all leaves at the same depth. Every perfect tree is both full and complete.
- A **balanced** binary tree is one whose height stays proportional to log n. The most common precise definition, used by AVL trees and LeetCode's "Balanced Binary Tree", is: at every node, the heights of the left and right subtrees differ by at most one.
- A **degenerate** (or **skewed**) tree is one where every internal node has exactly one child. It is a linked list wearing a tree costume, and it is the worst case for almost every tree algorithm.

### How height relates to the number of nodes

Level `d` of a binary tree can hold at most `2^d` nodes, because each node on level `d - 1` contributes at most two. A perfect tree of height `h` fills every level from `0` to `h`, so it has

```text
1 + 2 + 4 + … + 2^h = 2^(h+1) - 1 nodes.
```

Turn that around. If a tree with height `h` can hold at most `2^(h+1) - 1` nodes, then a tree with `n` nodes must have height at least `⌊log₂ n⌋`. At the other extreme, a degenerate tree with `n` nodes has height `n - 1`. So the height of an `n`-node binary tree lies somewhere between about `log₂ n` and `n - 1`:

| Nodes `n` | Smallest possible height | Largest possible height |
|---|---|---|
| 7 | 2 | 6 |
| 1,023 | 9 | 1,022 |
| 1,000,000 | 19 | 999,999 |

This range is the most important number in the module. Many tree operations cost time or memory proportional to the height `h`. On a balanced tree that is O(log n); on a skewed tree it is O(n). Whenever you see "O(h)" in a complexity analysis, ask which shape you are dealing with.

Two more counting facts are handy. A tree with `n` nodes has exactly `n - 1` edges, because every node except the root has exactly one edge to its parent. And it has `n + 1` `null` child references, because there are `2n` child slots in total and `n - 1` of them are used by edges. Serialisation formats that write a marker for every `null` ([[a6-serialization]]) therefore write about twice as many markers as values in a sparse tree.

## Thinking recursively about trees

Here is the skill that the rest of the module depends on. To compute something about a tree, assume you already have a method that computes it correctly for any smaller tree, call it on the two subtrees, and combine the results. This is sometimes called the **recursive leap of faith**: you do not trace the recursive calls in your head; you trust them, the same way the head of engineering trusts each manager's headcount.

The recipe has three parts:

1. **Base case.** What is the answer for the empty tree (`null`)? Write this first. It is usually a neutral value: `0` for counts and sums, `true` for "every node satisfies…", `false` for "some node satisfies…".
2. **Recurse.** Get the answers for `node.left` and `node.right`.
3. **Combine.** Produce this node's answer from its own value and the two subtree answers.

Counting nodes follows the recipe directly: the empty tree has 0 nodes; any other tree has the nodes on the left, the nodes on the right, and one more for the root.

```java title="TreeBasics.java"
public class TreeBasics {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
        TreeNode(int val, TreeNode left, TreeNode right) {
            this.val = val; this.left = left; this.right = right;
        }
    }

    static int count(TreeNode node) {
        if (node == null) return 0;                         // base case
        return count(node.left) + count(node.right) + 1;   // recurse + combine
    }

    static int sum(TreeNode node) {
        if (node == null) return 0;
        return sum(node.left) + sum(node.right) + node.val;
    }

    static int max(TreeNode node) {
        if (node == null) return Integer.MIN_VALUE;  // neutral for max
        return Math.max(node.val, Math.max(max(node.left), max(node.right)));
    }

    static boolean contains(TreeNode node, int target) {
        if (node == null) return false;              // nothing here to find
        return node.val == target || contains(node.left, target)
                || contains(node.right, target);
    }

    static int countLeaves(TreeNode node) {
        if (node == null) return 0;
        if (node.left == null && node.right == null) return 1;  // a leaf
        return countLeaves(node.left) + countLeaves(node.right);
    }

    public static void main(String[] args) {
        //        1
        //      /   \
        //     2     3
        //    / \     \
        //   4   5     6
        TreeNode root = new TreeNode(1,
                new TreeNode(2, new TreeNode(4), new TreeNode(5)),
                new TreeNode(3, null, new TreeNode(6)));

        System.out.println("count    = " + count(root));
        System.out.println("sum      = " + sum(root));
        System.out.println("max      = " + max(root));
        System.out.println("has 5?   = " + contains(root, 5));
        System.out.println("has 7?   = " + contains(root, 7));
        System.out.println("leaves   = " + countLeaves(root));
        System.out.println("empty    = " + count(null));
    }
}
```

```output
count    = 6
sum      = 21
max      = 6
has 5?   = true
has 7?   = false
leaves   = 3
empty    = 0
```

Every method has the same skeleton, and each one makes a deliberate choice of base value. `max` returns `Integer.MIN_VALUE` for the empty tree because that value can never beat a real node in `Math.max`. `contains` uses `||`, which short-circuits: once the target is found in the left subtree, the right subtree is never searched. `countLeaves` has a second base case for leaves, because a leaf is where the thing being counted actually lives.

### What the recursion actually does

The leap of faith is how you *design* the method; tracing it once shows why it works. Here is the order of calls and returns for `count(root)` on the example tree. Each row is one call, listed in the order the calls return.

| Call returns | Left answer | Right answer | Returns |
|---|---|---|---|
| `count(4)` | 0 | 0 | 1 |
| `count(5)` | 0 | 0 | 1 |
| `count(2)` | 1 | 1 | 3 |
| `count(6)` | 0 | 0 | 1 |
| `count(3)` | 0 | 1 | 2 |
| `count(1)` | 3 | 2 | 6 |

The calls go down the left side first, reach `null`, and answers flow back up. Node `2` cannot answer until both `4` and `5` have, and the root answers last. Information computed at the bottom travels to the top — this "children first, then parent" order is called **postorder**, and it is the natural order for any question whose answer depends on the subtrees.

### Passing information down instead of up

The examples so far compute answers **bottom-up**: children return values to their parent. The other direction is **top-down**: the parent passes information to its children as a parameter. Printing each node with its depth is a top-down problem, because a node cannot know its depth without being told its parent's depth.

```java
static void printDepths(TreeNode node, int depth) {
    if (node == null) return;
    System.out.println(node.val + " at depth " + depth);
    printDepths(node.left, depth + 1);
    printDepths(node.right, depth + 1);
}
```

Called as `printDepths(root, 0)` on the example tree, this prints `1 at depth 0`, `2 at depth 1`, `4 at depth 2`, `5 at depth 2`, `3 at depth 1`, `6 at depth 2`. Many real problems combine both directions: constraints flow down (for example, the allowed value range when validating a binary search tree) and results flow up. [[a6-dfs]] develops both styles fully.

## Traversals: visiting every node

A **traversal** visits every node exactly once in some defined order. Binary trees have four standard traversals, and the difference between them is only *when* a node is processed relative to its subtrees:

| Traversal | Order | Example tree | Typical use |
|---|---|---|---|
| Preorder | node, left, right | 1 2 4 5 3 6 | Copying or serialising a tree; top-down work |
| Inorder | left, node, right | 4 2 5 1 3 6 | Visiting a binary search tree in sorted order |
| Postorder | left, right, node | 4 5 2 6 3 1 | Deleting a tree; bottom-up computations |
| Level-order | level by level, left to right | 1 2 3 4 5 6 | Anything about levels; shortest distance from the root |

The first three are **depth-first**: they follow one branch all the way down before backing up, and they are written recursively or with a stack. They are taught in [[a6-dfs]]. Level-order is **breadth-first**: it finishes each level before moving to the next, and uses a queue. It is taught in [[a6-bfs]].

## How it works internally: the call stack

Each recursive call creates a **stack frame** holding its parameters and local variables. The frame is removed when the call returns. At any moment the frames on the stack are exactly the path from the root to the node currently being visited, so the maximum number of frames at once is the height of the tree plus one (plus one more for the `null` call at the bottom).

That gives the standard complexity of a recursive tree traversal:

- **Time O(n).** Each node causes exactly one call, which does a constant amount of work besides its recursive calls. There are also `n + 1` calls on `null` children, each O(1). In total, O(2n + 1) = O(n).
- **Space O(h)** for the call stack, where `h` is the height. That is O(log n) for a balanced tree and O(n) for a skewed one.

The O(n) worst case for space is not only theoretical. Java gives each thread a fixed-size stack — typically between 512 KB and 1 MB by default, adjustable with `-Xss` — and a deep enough recursion throws `StackOverflowError` ([[c2-stackoverflow]]). A degenerate tree built from a million sorted inserts is deep enough:

```java title="DeepTree.java"
import java.util.ArrayDeque;
import java.util.Deque;

public class DeepTree {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    static int countRecursive(TreeNode node) {
        if (node == null) return 0;
        return countRecursive(node.left) + countRecursive(node.right) + 1;
    }

    static int countIterative(TreeNode root) {
        int count = 0;
        Deque<TreeNode> stack = new ArrayDeque<>();  // explicit stack on the heap
        if (root != null) stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            count++;
            if (node.left != null) stack.push(node.left);
            if (node.right != null) stack.push(node.right);
        }
        return count;
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(0);
        TreeNode tail = root;
        for (int i = 1; i < 1_000_000; i++) {   // every node has only a right child
            tail.right = new TreeNode(i);
            tail = tail.right;
        }
        try {
            System.out.println("recursive: " + countRecursive(root));
        } catch (StackOverflowError e) {
            System.out.println("recursive: StackOverflowError");
        }
        System.out.println("iterative: " + countIterative(root));
    }
}
```

```output
recursive: StackOverflowError
iterative: 1000000
```

The iterative version does the same work but keeps its pending nodes in an `ArrayDeque`, which lives on the heap and can grow to millions of entries. In interviews, recursion is the expected default and inputs are small; mentioning that you would switch to an explicit stack for very deep trees is a mark of experience.

## Worked example: an expression tree

Trees are not only for storing values; their *shape* can carry meaning. An **expression tree** represents arithmetic: leaves are numbers and internal nodes are operators applied to their two subtrees. The expression `(3 + 4) * (10 - 8)` becomes:

```text
            *
          /   \
         +     -
        / \   / \
       3   4 10  8
```

The tree has no parentheses because it does not need them: the structure already says that `+` happens before `*`. To evaluate it, a node needs the values of both subtrees before it can apply its operator — a bottom-up, postorder computation.

```java title="ExpressionTree.java"
public class ExpressionTree {
    // A node is either an operator with two children or a number with none.
    static class Node {
        char op;          // '+', '-', '*', '/' for operators; unused for numbers
        int value;        // used only for numbers
        Node left, right;

        static Node num(int v) { Node n = new Node(); n.value = v; return n; }
        static Node op(char op, Node l, Node r) {
            Node n = new Node(); n.op = op; n.left = l; n.right = r; return n;
        }
        boolean isLeaf() { return left == null && right == null; }
    }

    static int evaluate(Node node) {
        if (node.isLeaf()) return node.value;      // base case: a number
        int a = evaluate(node.left);               // both operands first
        int b = evaluate(node.right);
        return switch (node.op) {                  // then apply the operator
            case '+' -> a + b;
            case '-' -> a - b;
            case '*' -> a * b;
            case '/' -> a / b;
            default -> throw new IllegalStateException("bad op " + node.op);
        };
    }

    static String infix(Node node) {             // inorder, with parentheses
        if (node.isLeaf()) return String.valueOf(node.value);
        return "(" + infix(node.left) + " " + node.op + " " + infix(node.right) + ")";
    }

    static String postfix(Node node) {           // postorder: Reverse Polish notation
        if (node.isLeaf()) return String.valueOf(node.value);
        return postfix(node.left) + " " + postfix(node.right) + " " + node.op;
    }

    public static void main(String[] args) {
        Node tree = Node.op('*',
                Node.op('+', Node.num(3), Node.num(4)),
                Node.op('-', Node.num(10), Node.num(8)));
        System.out.println(infix(tree) + " = " + evaluate(tree));
        System.out.println("postfix: " + postfix(tree));
    }
}
```

```output
((3 + 4) * (10 - 8)) = 14
postfix: 3 4 + 10 8 - *
```

Three different methods walk the same tree, and each produces a different, useful result just by changing when the node's own contribution happens. `evaluate` and `postfix` handle the node *after* its subtrees (postorder); `infix` places the operator *between* them (inorder). The postfix string is Reverse Polish notation, which a stack evaluates without parentheses ([[a5-expression]]). Compilers build the same kind of tree, called an **abstract syntax tree**, from source code, and then walk it to type-check and generate machine code.

Note the base case here is "leaf", not `null`: in a full tree every node has zero or two children, so checking for a leaf before recursing means the method never receives `null`. That is a design choice that holds only because expression trees are full. For general binary trees, the `null` base case is safer.

## In real systems

**Ordered maps and sets.** `java.util.TreeMap` and `TreeSet` are red–black trees, a kind of self-balancing binary search tree that keeps height O(log n) so every lookup, insert and delete is O(log n) ([[a1-treemap]]). The Linux kernel schedules processes with a red–black tree for the same reason.

**Priority queues.** `java.util.PriorityQueue` is a binary heap: a complete binary tree stored in an array, so the parent of index `i` is at `(i - 1) / 2` and its children are at `2i + 1` and `2i + 2`. No node objects or references exist at all ([[a7-min-heap]]).

**Compilers and interpreters.** Parsers turn source code into abstract syntax trees, and most later stages — type checking, optimisation, code generation — are tree traversals. Expression operators make many of those nodes binary.

**Compression.** Huffman coding builds a binary tree in which each left edge means bit `0` and each right edge means bit `1`; a character's code is the path from the root to its leaf.

**Wider trees.** The DOM in a browser ([[b3-dom-tree-model]]) and file systems are trees whose nodes have any number of children ([[a6-nary-trees]]). Database indexes use B-trees ([[c7-btrees]]), where each node holds hundreds of keys and children so that the tree stays only three or four levels deep even for millions of rows — the same height argument as above, pushed further to minimise disk reads. Everything in this module carries over to those trees with "left and right" replaced by "for each child".

## Trade-offs and alternatives

Linked nodes are the default representation, but not the only one:

| Representation | Space | Strengths | Weaknesses |
|---|---|---|---|
| Linked nodes (`TreeNode`) | One object per node, plus two references | Any shape; cheap to restructure (rotate, splice) | Pointer chasing is cache-unfriendly; per-object overhead |
| Array, children at `2i + 1`, `2i + 2` | One slot per position up to the last node | Compact and cache-friendly for complete trees; parent is computable | Sparse or skewed trees waste space exponentially: height `h` needs `2^(h+1) - 1` slots |
| Parent array `parent[i]` | One integer per node | Simple; easy upward walks (used by union–find) | Finding children requires a scan or an extra structure |

Compared with other structures, a binary tree is not automatically fast. A plain binary tree with no ordering rule is no better than a list for finding a value: `contains` above is O(n) because the value could be anywhere. Trees become fast when you add an invariant. The binary-search-tree ordering lets each comparison discard a whole subtree; the heap ordering keeps the minimum at the root. Choose a tree when your data is genuinely hierarchical, or when one of those invariants gives you the operations you need. For exact-match lookups only, a `HashMap` is simpler and faster.

## Common mistakes

> [!MISTAKE] Reading a child's value before checking it exists
> `if (node.left.val > node.val)` throws `NullPointerException` when `node` has no left child. Either check `node.left != null` first or, better, recurse into `node.left` and let the `null` base case handle the empty subtree. Recursing on children and handling `null` in one place keeps code short and correct.

**Confusing a leaf with `null`.** A leaf is a real node with two `null` children; `null` is the absence of a node. Problems that say "root-to-leaf path" must stop at nodes where both children are `null`, not at the first `null` reached. A node with one child is not a leaf, and treating it as one is a classic bug in minimum-depth and path-sum problems.

**Assuming the tree is ordered.** A binary tree has no ordering rule unless the problem says it is a binary search tree. Searching only one side of a plain binary tree will miss values.

**Assuming the tree is balanced.** Saying "O(log n)" for a tree operation is only correct for balanced trees. If the problem does not guarantee balance, the honest bound is O(h), which is O(n) in the worst case.

**Shared state between calls.** Solutions that store an answer in a field (common for diameter and path problems) must reset it for every new input. A `static` field that keeps its value from the previous test case is a frequent cause of "passes the first test, fails the second".

**Off-by-one in depth and height.** Decide whether you count edges or nodes, say it out loud, and make the base case match: `null` returns `0` when counting nodes and `-1` when counting edges.

## Interview perspective

Interviewers use tree questions to check whether you can think recursively and handle edge cases cleanly. Before writing code, clarify the inputs: can the tree be empty, can values be negative or duplicated, is it a binary search tree, is it balanced? Then state the base case and what each call returns. Most bugs come from an unclear return value.

> [!INTERVIEW] A strong opening for any tree problem
> "My function returns the answer for the subtree rooted at `node`. For `null` that's 0. Otherwise I get the answers for the left and right subtrees and combine them with the node's value. Every node is visited once, so it's O(n) time, and the recursion depth is the height, so O(h) space — O(log n) if balanced, O(n) if it's a chain."

Questions you should be able to answer:

- **What is the maximum number of nodes in a binary tree of height h?** `2^(h+1) - 1`, counting height in edges; each level doubles.
- **How many `null` children does an `n`-node tree have?** `n + 1`: `2n` slots minus `n - 1` edges.
- **What is the difference between complete and full?** Complete is about filling levels left to right with no gaps; full is about every node having zero or two children. A tree can be either without the other.
- **Why can a heap use an array but a binary search tree usually cannot?** A heap is always complete, so the array has no gaps; a binary search tree can take any shape.
- **When would you avoid recursion?** When the tree can be very deep (unbalanced, user-controlled input), because the call stack is limited; use an explicit stack or queue instead.

Common first-round problems built only on this lesson: Maximum Depth of Binary Tree, Same Tree, Invert Binary Tree, Symmetric Tree, Count Complete Tree Nodes and Sum of Left Leaves.

```quiz
Q: A binary tree has 15 nodes. What is the smallest height it can have, counting edges?
- [ ] 2
- [x] 3
- [ ] 4
- [ ] 14
> A perfect tree of height h holds 2^(h+1) - 1 nodes. Height 3 holds exactly 15 nodes, so 15 nodes fit in height 3. Height 2 holds only 7. A height of 14 is the largest possible, reached by a degenerate chain.

Q: Which base case is correct for a recursive method that returns the largest value in a binary tree that may contain negative numbers?
- [ ] Return 0 for null
- [x] Return Integer.MIN_VALUE for null
- [ ] Return node.val for null
- [ ] No base case is needed if the root is not null
> The base value must never win a comparison against a real node. If every value is negative, returning 0 for null would make the method report 0, a value not in the tree. Reading node.val on null throws, and every leaf's children are null, so a base case is always needed.

Q: Why does a recursive traversal of a degenerate tree with one million nodes risk StackOverflowError while a balanced tree of the same size does not?
- [ ] The degenerate tree has more nodes to visit
- [x] Recursion depth equals the tree's height, which is about a million for a chain but about 20 when balanced
- [ ] Java limits the number of recursive calls in total
- [ ] The balanced tree is visited iteratively by the JVM
> Both trees cause the same total number of calls, but only the calls on the current root-to-node path are on the stack at once. That path is as long as the height: about log2(1,000,000) = 20 for a balanced tree and 999,999 for a chain, which exceeds the default thread stack.
```

## Practice

1. **Build and print.** Use the level-order builder to create `[5,3,8,1,4,null,9]` and draw it on paper before running the sideways printer to check.
2. **Maximum depth.** Return the number of nodes on the longest root-to-leaf path. Write it recursively, then explain its space complexity on a skewed tree.
3. **Same tree.** Given two roots, decide whether the trees have the same shape and values. What are the base cases when one root is `null` and the other is not?
4. **Invert a tree.** Swap every node's left and right children. Does the order of swapping and recursing matter?
5. **Symmetric tree.** Decide whether a tree is a mirror image of itself. Hint: write a helper that compares two subtrees, left-of-one against right-of-the-other.
6. **Sum of left leaves.** Return the sum of leaves that are the left child of their parent. Which information must be passed down?

The DSA explorer lists these under Trees; start with *Maximum Depth of Binary Tree*, *Same Tree* and *Invert Binary Tree*.

## Quick revision {#quick-revision}

- Binary tree: empty, or a root with a left and right binary subtree. Every non-root node has exactly one parent; no cycles.
- Terms: root, leaf (no children), internal node, edge, subtree, ancestor, descendant, sibling. Depth counts down from the root; height counts up from the deepest leaf.
- `TreeNode { int val; TreeNode left, right; }`; `null` means an empty subtree.
- LeetCode notation `[1,2,3,4,5,null,6]` is level order; each node in turn takes the next two entries as children.
- Shapes: full (0 or 2 children), complete (levels filled left to right), perfect (all levels full), balanced (height O(log n)), degenerate (a chain).
- Height of an `n`-node tree is between `⌊log₂ n⌋` and `n - 1`; a perfect tree of height `h` has `2^(h+1) - 1` nodes. `n` nodes have `n - 1` edges and `n + 1` null children.
- Recursive recipe: base case for `null`, recurse on both children, combine.
- Bottom-up passes results up through return values; top-down passes context down through parameters.
- Recursive traversal: O(n) time, O(h) stack space; deep trees can throw `StackOverflowError` — use an explicit stack.
- Array storage (`2i + 1`, `2i + 2`) suits complete trees such as heaps, not sparse ones.

## Key takeaways {#key-takeaways}

- A binary tree models hierarchy: one root, each other node hangs under exactly one parent, and each node has at most two ordered children.
- The recursive definition — a tree is empty or a root with two subtrees — is the blueprint for recursive code: handle `null`, recurse left and right, combine.
- Height decides cost. It ranges from about log₂ n (balanced) to n − 1 (a chain), so state O(h) and say which shape you assume.
- Visiting every node is O(n) time; recursion adds O(h) stack space.
- A plain binary tree is not a search structure. Speed comes from extra invariants such as BST ordering or heap ordering.
- Be explicit about conventions — edges versus nodes, leaf versus null — because most tree bugs are off-by-one or null-handling mistakes.
