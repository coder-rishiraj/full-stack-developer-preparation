---
summary: Serialisation turns a tree of objects into a flat string or byte sequence that can be stored or sent, and deserialisation rebuilds the identical tree from it. You will learn why null markers make a single preorder sequence enough, how to write and test a codec in both preorder and level-order styles, and how the same encoding solves problems such as finding duplicate subtrees.
difficulty: intermediate
minutes: 50
objectives:
  - Explain why a tree in memory cannot be stored as-is and what information a serialised form must preserve
  - Prove that preorder with null markers decodes to exactly one tree, and validate an encoding by counting open slots
  - Implement preorder and level-order codecs in Java and verify them with round-trip tests
  - Compare encodings — null markers, BST preorder without markers, child counts, brackets — by size, speed and robustness
  - Use subtree serialisation to detect duplicate and matching subtrees efficiently
---

## Introduction

A binary tree in a running Java program is a set of `TreeNode` objects scattered across the heap, connected by references. Those references are memory addresses that mean something only inside that one process. Write them to a file, restart the program, and the addresses point at nothing. Send them to another machine and they are meaningless.

**Serialisation** is converting a data structure into a flat sequence — a string or an array of bytes — that captures everything needed to rebuild it. **Deserialisation** is the reverse. A pair of functions that do both is often called a **codec** (coder–decoder). The requirement is strict: deserialising the serialised form must produce a tree with **exactly the same shape and values**, every time.

You use serialisation constantly, usually without thinking about trees. A JSON document is a serialised tree: each object or array is a node, and nesting records which nodes are children of which. HTML is a serialised DOM tree. Remote procedure calls serialise nested request objects into Protocol Buffers bytes. Caches, message queues and databases all store serialised structures. In interviews, *Serialize and Deserialize Binary Tree* is a classic hard-rated problem, and it is mostly a test of whether you understand what information a traversal throws away.

## Before you start

- **Tree DFS and BFS** — preorder traversal and level-order traversal with a queue. See [[a6-dfs]] and [[a6-bfs]].
- **Tree construction** — why one plain traversal does not determine a tree. See [[a6-construction]].
- **Strings and StringBuilder** — building strings efficiently and splitting them. See [[a1-strings-stringbuilder]].
- **HashMap** — used when serialising subtrees for comparison. See [[a1-hashmap]].

## The intuition

Suppose you must describe a tree to someone over the phone so that they can draw it exactly. Reading the values in preorder — "1, 2, 3, 4, 5" — is not enough: they cannot tell whether `2` is a left child or a right child, or where one subtree ends. [[a6-construction]] shows that you would need a second traversal to resolve that.

But there is a simpler fix. As you walk the tree in preorder, also say "empty" every time you reach a missing child. Now the listener can follow along: "1" — draw a root. "2" — draw its left child. "empty" — 2 has no left child. "empty" — 2 has no right child, so 2 is finished; go back up to 1's right side. "3" — draw 1's right child, and so on. The "empty" markers tell the listener exactly when to stop going down and go back up. Nothing about the shape is left to guess.

That is the whole idea of the standard codec: **preorder with null markers**. The rest of this lesson makes it precise, proves it works, and looks at alternatives.

## Preorder with null markers

### The encoding

Walk the tree in preorder. For a real node, write its value; for a `null` child, write a marker such as `#`. Separate tokens with a delimiter such as a comma.

```text
        1
       / \
      2   3
         / \
       -4   5

1,2,#,#,3,-4,#,#,5,#,#
```

Read the encoding against the tree: `1` is the root; `2` is its left child; `#,#` are 2's two empty children; `3` is 1's right child; `-4` is 3's left child with two empty children; `5` is 3's right child with two empty children. Every node is followed by its entire left subtree and then its entire right subtree, and every subtree, however small, ends in markers.

A useful counting fact: a binary tree with `n` nodes has exactly `n + 1` null child references, because there are `2n` child slots and `n - 1` of them are used by edges ([[a6-binary-trees]]). So this encoding always has `n` values and `n + 1` markers — `2n + 1` tokens. Here, 5 values and 6 markers.

### Why it decodes to exactly one tree

Define the encoding recursively: the encoding of an empty tree is `#`, and the encoding of a non-empty tree is its root value, followed by the encoding of its left subtree, followed by the encoding of its right subtree.

Now decode by reading tokens left to right. If the first token is `#`, the tree is empty and you have consumed exactly one token. Otherwise the first token is the root's value; then decode one complete tree from the remaining tokens (that is the left subtree), and then one more (the right subtree). The crucial point is that a decoder can always tell **where an encoded subtree ends**, without looking ahead: it ends exactly when its own recursive decode returns. No encoding of a tree is a proper prefix of the encoding of another tree, so there is never a choice to make. Because each step is forced, there is only one way to read the sequence, and so only one tree it can describe.

Compare plain preorder without markers, `1,2,3,-4,5`. After reading `1` and `2`, a decoder does not know whether `3` is 2's child or 1's right child. The markers remove that ambiguity.

### Validating an encoding without building the tree

The same reasoning gives a neat check, used by the problem *Verify Preorder Serialization of a Binary Tree*. Think of **slots**: places in the tree waiting to be filled. Before reading anything there is one slot, for the root. Every token fills one slot. A value also creates two new slots, for its children; a marker creates none. A string is a valid encoding exactly when no token arrives while there are zero slots, and there are zero slots left at the end.

```java
static boolean isValidPreorder(String data) {
    int slots = 1;                                  // the root's slot
    for (String tok : data.split(",")) {
        if (slots == 0) return false;               // nowhere to put this token
        slots--;                                    // every token fills one slot
        if (!tok.equals("#")) slots += 2;           // a value opens two child slots
    }
    return slots == 0;
}
```

`"1,#"` fails because one slot (1's right child) is still open at the end. `"9,#,#,1"` fails because after `9,#,#` the tree is complete and `1` has nowhere to go. The count also explains the `n + 1` fact: starting at 1, each value adds a net +1 slot and each marker −1, so ending at 0 requires one more marker than values.

### The code

```java
static String serialize(TreeNode root) {
    StringBuilder sb = new StringBuilder();
    write(root, sb);
    sb.setLength(sb.length() - 1);                  // drop the trailing comma
    return sb.toString();
}

static void write(TreeNode node, StringBuilder sb) {
    if (node == null) { sb.append("#,"); return; }  // record the missing child
    sb.append(node.val).append(',');
    write(node.left, sb);
    write(node.right, sb);
}

static TreeNode deserialize(String data) {
    Deque<String> tokens = new ArrayDeque<>(Arrays.asList(data.split(",")));
    return read(tokens);
}

static TreeNode read(Deque<String> tokens) {
    String tok = tokens.removeFirst();
    if (tok.equals("#")) return null;
    TreeNode node = new TreeNode(Integer.parseInt(tok));
    node.left = read(tokens);                       // same order as write()
    node.right = read(tokens);
    return node;
}
```

The two halves mirror each other line for line. `write` emits the node, then the left subtree, then the right; `read` consumes a token, then builds the left subtree, then the right. The token queue plays the role of the listener's position in the phone call: each `read` call takes exactly the tokens of its own subtree and leaves the rest for its caller. An `int` index passed in a one-element array works just as well; the deque makes the "consume from the front" idea explicit.

A `StringBuilder` matters. Building the string with `+=` in a recursion copies the whole string on every append, which is O(n²) for `n` nodes; a `StringBuilder` appends in amortised O(1).

### Dry run of deserialisation

Decode `1,2,#,#,3,-4,#,#,5,#,#`. Each row is one `read` call, in the order the calls start; "depth" is how deep the call is in the recursion.

| Token read | Depth | Action | What this call returns |
|---|---|---|---|
| 1 | 0 | create 1, read left | the whole tree |
| 2 | 1 | create 2, read left | node 2 |
| # | 2 | empty | null (2.left) |
| # | 2 | empty | null (2.right); node 2 complete |
| 3 | 1 | create 3, read left | node 3 |
| -4 | 2 | create -4, read left | node -4 |
| # | 3 | empty | null (-4.left) |
| # | 3 | empty | null (-4.right); node -4 complete |
| 5 | 2 | create 5, read left | node 5 |
| # | 3 | empty | null (5.left) |
| # | 3 | empty | null (5.right); nodes 5, 3, 1 complete |

Each marker ends a branch and sends control back up exactly as the phone-call listener would. When the last token is consumed, every call has returned and the queue is empty — which is also a useful sanity check for corrupted input.

## Level order with null markers

LeetCode displays trees as `[1,2,3,null,null,-4,5]`: values level by level, left to right, with `null` for missing children. This is also a complete codec. The serialiser is a BFS that writes each node's two children as it dequeues the node; the deserialiser is the same queue in reverse, where each waiting node takes the next two tokens as its children ([[a6-binary-trees]]).

Two details differ from preorder. Children of a `null` are never written, because a `null` is never enqueued. And trailing `null`s can be dropped, because the deserialiser treats "ran out of tokens" as "no more children".

The practical advantage of level order is that it is **iterative in both directions** — a queue instead of recursion. A preorder codec written recursively uses stack depth equal to the tree's height, and a degenerate tree that is a chain of a few hundred thousand nodes can throw `StackOverflowError` with Java's default thread stack size. A level-order codec has no such limit. Its disadvantage is that for skewed trees it writes more markers in the middle of the output, and it is slightly longer to code.

```java title="Codec.java"
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Deque;
import java.util.List;
import java.util.Queue;

public class Codec {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // ---- Preorder with null markers ----
    static String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        write(root, sb);
        sb.setLength(sb.length() - 1);                  // drop the trailing comma
        return sb.toString();
    }

    static void write(TreeNode node, StringBuilder sb) {
        if (node == null) { sb.append("#,"); return; }  // record the missing child
        sb.append(node.val).append(',');
        write(node.left, sb);
        write(node.right, sb);
    }

    static TreeNode deserialize(String data) {
        Deque<String> tokens = new ArrayDeque<>(Arrays.asList(data.split(",")));
        return read(tokens);
    }

    static TreeNode read(Deque<String> tokens) {
        String tok = tokens.removeFirst();
        if (tok.equals("#")) return null;
        TreeNode node = new TreeNode(Integer.parseInt(tok));
        node.left = read(tokens);                       // same order as write()
        node.right = read(tokens);
        return node;
    }

    // ---- Level order (LeetCode style), iterative in both directions ----
    static String serializeLevel(TreeNode root) {
        List<String> out = new ArrayList<>();
        Queue<TreeNode> q = new ArrayDeque<>();
        if (root != null) { q.add(root); out.add(String.valueOf(root.val)); }
        while (!q.isEmpty()) {
            TreeNode n = q.remove();
            for (TreeNode c : new TreeNode[] {n.left, n.right}) {
                out.add(c == null ? "null" : String.valueOf(c.val));
                if (c != null) q.add(c);
            }
        }
        while (!out.isEmpty() && out.get(out.size() - 1).equals("null")) {
            out.remove(out.size() - 1);                 // trailing nulls carry no shape
        }
        return "[" + String.join(",", out) + "]";
    }

    static TreeNode deserializeLevel(String data) {
        String body = data.substring(1, data.length() - 1);
        if (body.isEmpty()) return null;
        String[] t = body.split(",");
        TreeNode root = new TreeNode(Integer.parseInt(t[0]));
        Queue<TreeNode> waiting = new ArrayDeque<>(List.of(root)); // nodes owed children
        for (int i = 1; i < t.length; i += 2) {
            TreeNode p = waiting.remove();
            if (!t[i].equals("null")) {
                p.left = new TreeNode(Integer.parseInt(t[i]));
                waiting.add(p.left);
            }
            if (i + 1 < t.length && !t[i + 1].equals("null")) {
                p.right = new TreeNode(Integer.parseInt(t[i + 1]));
                waiting.add(p.right);
            }
        }
        return root;
    }

    // ---- Is this string a valid preorder serialization? (no tree needed) ----
    static boolean isValidPreorder(String data) {
        int slots = 1;                                  // the root's slot
        for (String tok : data.split(",")) {
            if (slots == 0) return false;               // nowhere to put this token
            slots--;                                    // every token fills one slot
            if (!tok.equals("#")) slots += 2;           // a value opens two child slots
        }
        return slots == 0;
    }

    public static void main(String[] args) {
        //        1
        //       / \
        //      2   3
        //         / \
        //       -4   5
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        root.right.left = new TreeNode(-4);
        root.right.right = new TreeNode(5);

        String pre = serialize(root);
        System.out.println("preorder:      " + pre);
        System.out.println("round trip:    " + serialize(deserialize(pre)));
        String level = serializeLevel(root);
        System.out.println("level order:   " + level);
        System.out.println("round trip:    " + serializeLevel(deserializeLevel(level)));
        System.out.println("empty tree:    " + serialize(null) + " and " + serializeLevel(null));

        for (String s : new String[] {"9,3,4,#,#,1,#,#,2,#,6,#,#", "1,#", "9,#,#,1"}) {
            System.out.println("valid(" + s + ") = " + isValidPreorder(s));
        }
    }
}
```

```output
preorder:      1,2,#,#,3,-4,#,#,5,#,#
round trip:    1,2,#,#,3,-4,#,#,5,#,#
level order:   [1,2,3,null,null,-4,5]
round trip:    [1,2,3,null,null,-4,5]
empty tree:    # and []
valid(9,3,4,#,#,1,#,#,2,#,6,#,#) = true
valid(1,#) = false
valid(9,#,#,1) = false
```

Several edge cases are covered on purpose. The negative value `-4` survives because the delimiter is a comma and `Integer.parseInt` accepts a leading minus; a codec that wrote values without delimiters (`12#3`) could not tell `-4` or multi-digit numbers apart. The empty tree serialises to `#` in preorder and `[]` in level order, and both deserialise back to `null`. And each codec is checked by a **round trip**: serialise, deserialise, serialise again, and compare. That test catches nearly every codec bug, because a wrong tree almost never produces the same string.

### Complexity

**Time.** Serialisation visits every node once and writes O(1) tokens per node and per null child: O(n) tokens. Deserialisation consumes each token once in O(1). Both are **O(n)**, assuming each value has a bounded number of digits. **Space.** The output has `2n + 1` tokens: O(n). The recursive preorder codec uses O(h) stack; the level-order codec uses O(w) queue space, where `w` is the maximum width of a level — up to about `n / 2` for a complete tree.

## Smaller encodings

Null markers are general but not compact: about half the tokens of a sparse tree carry no value. When you know more about the tree, you can drop them.

### BSTs need no markers

*Serialize and Deserialize BST* asks for an encoding "as compact as possible". For a binary search tree, plain preorder **without** markers is enough, because the BST ordering decides where each value goes — exactly the construction in [[a6-construction]]. The deserialiser passes a range `(lo, hi)` down: the next value belongs to the current subtree only if it lies within the range; otherwise this subtree is empty and the value is left for an ancestor.

```java
static TreeNode readBst(int[] pre, int lo, int hi) {
    if (pos == pre.length || pre[pos] < lo || pre[pos] > hi) return null;
    TreeNode n = new TreeNode(pre[pos++]);
    n.left = readBst(pre, lo, n.val);
    n.right = readBst(pre, n.val, hi);
    return n;
}
```

The BST `[8, 5, 10, 1, 7, null, 12]` serialises to `8,5,1,7,10,12` — six tokens instead of thirteen. This relies on distinct keys and on the tree really being a BST; applied to an arbitrary binary tree, it silently rebuilds a different tree. For further compactness, values can be written as fixed-width binary (four bytes per `int`) instead of decimal text with commas.

### Other ways to record the shape

Null markers are one way to say "this subtree has ended". There are others, and real formats use all of them:

| Encoding | Example for the tree above | Records the shape by | Notes |
|---|---|---|---|
| Preorder + null markers | `1,2,#,#,3,-4,#,#,5,#,#` | A marker for each empty child | Standard interview codec |
| Level order + null markers | `[1,2,3,null,null,-4,5]` | Markers, trailing ones dropped | Iterative; LeetCode's format |
| Brackets | `1(2)(3(-4)(5))` | Parentheses around each subtree | Like *Construct String from Binary Tree*; human-readable |
| Child counts (n-ary) | `1,2,2,0,3,2,-4,0,5,0` | Value then number of children | Natural for any fan-out ([[a6-nary-trees]]) |
| BST preorder | `8,5,1,7,10,12` | The ordering rule | Only for BSTs with distinct keys |

The bracket form is how JSON and HTML work: every nested object or element opens with `{` or `<tag>` and closes with `}` or `</tag>`, and the closing token plays the role of the null markers — it says "this subtree is finished". Length-prefixed formats such as Protocol Buffers record instead how many bytes a nested message occupies, which lets a reader skip a whole subtree without parsing it.

## Serialising subtrees: duplicates and matches

Serialisation is not only for storage. Because two subtrees have the same serialisation exactly when they have the same shape and values, a serialised form is a **canonical name** for a subtree, and names can go in a hash map.

### Find Duplicate Subtrees

*Find Duplicate Subtrees* asks for one root of every subtree shape that appears more than once. A postorder DFS can compute a name for every subtree from its children's names — `left + "," + val + "," + right` — and count names in a map. That works, but the names are full serialisations, and concatenating them costs O(size of subtree) at every node: O(n²) time and memory in the worst case.

The improvement is to give each distinct shape a small **integer id** the first time it is seen. A node's key is then the triple "left id, value, right id", which has constant length, and two subtrees get the same id exactly when they have the same value and their children have the same ids — that is, the same shape.

```java
static int assignId(TreeNode n, Map<String, Integer> idOf,
                    Map<Integer, Integer> seen, List<TreeNode> result) {
    if (n == null) return 0;                        // id 0 means "empty"
    String key = assignId(n.left, idOf, seen, result) + "," + n.val + ","
            + assignId(n.right, idOf, seen, result);
    int id = idOf.computeIfAbsent(key, k -> idOf.size() + 1);
    if (seen.merge(id, 1, Integer::sum) == 2) result.add(n);  // report once
    return id;
}
```

Each node builds one short key and does two map operations, so the whole pass is O(n) expected time. Reporting when the count reaches exactly 2 lists each duplicated shape once, however many copies exist.

### Subtree of Another Tree

*Subtree of Another Tree* asks whether tree `small` appears inside tree `big` as a complete subtree. Serialise both with markers, and ask whether one string contains the other. Two details make this correct. First, the markers are required: without them, a subtree that matches the top of a larger subtree would also match. Second, each value needs a **start delimiter**, not only an end one: without it, the encoding of `[2]` would be found inside the encoding of `12`. The program below uses `^` before each value.

```java title="SerializationUses.java"
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.StringJoiner;

public class SerializationUses {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // ---- BST codec: preorder without null markers ----
    static String serializeBst(TreeNode root) {
        StringJoiner sj = new StringJoiner(",");
        writeBst(root, sj);
        return sj.toString();
    }

    static void writeBst(TreeNode n, StringJoiner sj) {
        if (n == null) return;                          // no marker: the ordering knows
        sj.add(String.valueOf(n.val));
        writeBst(n.left, sj);
        writeBst(n.right, sj);
    }

    static int pos;

    static TreeNode deserializeBst(String data) {
        if (data.isEmpty()) return null;
        String[] parts = data.split(",");
        int[] pre = new int[parts.length];
        for (int i = 0; i < parts.length; i++) pre[i] = Integer.parseInt(parts[i]);
        pos = 0;
        return readBst(pre, Integer.MIN_VALUE, Integer.MAX_VALUE);
    }

    static TreeNode readBst(int[] pre, int lo, int hi) {
        if (pos == pre.length || pre[pos] < lo || pre[pos] > hi) return null;
        TreeNode n = new TreeNode(pre[pos++]);
        n.left = readBst(pre, lo, n.val);
        n.right = readBst(pre, n.val, hi);
        return n;
    }

    // ---- Find Duplicate Subtrees: give each distinct subtree shape an integer id ----
    static List<TreeNode> findDuplicates(TreeNode root) {
        Map<String, Integer> idOf = new HashMap<>();    // "left id,val,right id" -> id
        Map<Integer, Integer> seen = new HashMap<>();   // id -> times seen
        List<TreeNode> result = new ArrayList<>();
        assignId(root, idOf, seen, result);
        return result;
    }

    static int assignId(TreeNode n, Map<String, Integer> idOf,
                        Map<Integer, Integer> seen, List<TreeNode> result) {
        if (n == null) return 0;                        // id 0 means "empty"
        String key = assignId(n.left, idOf, seen, result) + "," + n.val + ","
                + assignId(n.right, idOf, seen, result);
        int id = idOf.computeIfAbsent(key, k -> idOf.size() + 1);
        if (seen.merge(id, 1, Integer::sum) == 2) result.add(n);  // report once
        return id;
    }

    // ---- Subtree of Another Tree by comparing serializations ----
    static String encode(TreeNode n) {
        if (n == null) return "#";
        return "^" + n.val + " " + encode(n.left) + " " + encode(n.right);
    }

    static boolean isSubtree(TreeNode big, TreeNode small) {
        return encode(big).contains(encode(small));
    }

    static String encodeNoPrefix(TreeNode n) {          // the buggy version
        if (n == null) return "#";
        return n.val + " " + encodeNoPrefix(n.left) + " " + encodeNoPrefix(n.right);
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
        TreeNode bst = fromLevelOrder(new Integer[] {8, 5, 10, 1, 7, null, 12});
        String s = serializeBst(bst);
        System.out.println("BST codec:   " + s + "  ->  " + serializeBst(deserializeBst(s)));

        //          1
        //         / \
        //        2   3
        //       /   / \
        //      4   2   4
        //         /
        //        4
        TreeNode t = fromLevelOrder(new Integer[] {1, 2, 3, 4, null, 2, 4, null, null, 4});
        List<Integer> roots = new ArrayList<>();
        for (TreeNode d : findDuplicates(t)) roots.add(d.val);
        System.out.println("duplicate subtree roots: " + roots);

        TreeNode big = fromLevelOrder(new Integer[] {1, 12, 3});
        TreeNode two = fromLevelOrder(new Integer[] {2});
        System.out.println("encode(big) = " + encode(big));
        System.out.println("is [2] a subtree of [1,12,3]?  " + isSubtree(big, two));
        System.out.println("is [12] a subtree of [1,12,3]? "
                + isSubtree(big, fromLevelOrder(new Integer[] {12})));
        System.out.println("without ^, [2] matches? "
                + encodeNoPrefix(big).contains(encodeNoPrefix(two)));
    }
}
```

```output
BST codec:   8,5,1,7,10,12  ->  8,5,1,7,10,12
duplicate subtree roots: [4, 2]
encode(big) = ^1 ^12 # # ^3 # #
is [2] a subtree of [1,12,3]?  false
is [12] a subtree of [1,12,3]? true
without ^, [2] matches? true
```

In the duplicates tree, the single leaf `4` appears three times and the shape "2 with left child 4" appears twice, so the answer lists one root of each, in the order the second copy is found during the postorder pass. The last three lines show why the start delimiter matters. Without `^`, the leaf `2` encodes as `2 # #`, and the encoding of the big tree, `1 12 # # 3 # #`, contains that text inside `12 # #` — a false match. With `^`, the small tree is `^2 # #`, which cannot occur inside `^12 # #`. Java's `String.contains` uses a simple search that is O(n · m) in the worst case; for guaranteed O(n + m), use a linear-time string-matching algorithm such as KMP on the two encodings.

## In real systems

**JSON.** `JSON.stringify` walks an object graph depth-first, writing each object's fields in order — a preorder traversal — and the braces and brackets record the shape ([[b1-json-stringify-parse]]). Because it assumes a tree, it throws a `TypeError` when it meets a circular reference. Java's Jackson library has the same assumption: two entities that reference each other (an order that holds its customer, a customer that lists its orders) recurse until the stack overflows, unless one side is annotated, for example with `@JsonManagedReference` and `@JsonBackReference` or `@JsonIgnore` ([[c6-jackson-binding]]). A tree codec never meets this problem, because a tree has no cycles; general object graphs need identifiers and back-references.

**HTML and the DOM.** Reading `element.innerHTML` serialises that element's DOM subtree into HTML text, and assigning to it parses text back into nodes. The opening and closing tags are the bracket encoding of the tree ([[b3-dom-tree-model]]).

**Messaging and storage.** Services serialise nested request and event objects into compact binary formats such as Protocol Buffers or Avro before sending them across the network or into a log like Kafka ([[c11-serialization]]). These formats nest messages with length prefixes so that a reader can skip a subtree it does not understand — a property that matters when old and new versions of a service must read each other's data.

**Caching and deduplication.** Computing a canonical serialisation, or a hash of it, is a standard way to detect identical substructures. Compilers use the same idea (often called hash-consing) to share identical subexpressions, and build systems hash serialised dependency trees to decide whether something must be rebuilt.

## Trade-offs and alternatives

| Approach | Size | Time | Recursion | Works for |
|---|---|---|---|---|
| Preorder + markers | `2n + 1` tokens | O(n) | Depth O(h) if recursive | Any binary tree |
| Level order + markers | Up to `2n + 1`, trailing markers dropped | O(n) | None (queue) | Any binary tree; deep trees |
| BST preorder | `n` tokens | O(n) | Depth O(h) | BSTs with distinct keys |
| Two traversals (pre + in) | `2n` tokens | O(n) with a map | Depth O(h) | Distinct values only |
| Brackets | `n` values + `2n` brackets at most | O(n) | Depth O(h) | Any tree; readable |
| Binary, fixed width | 4 bytes per value plus shape bits | O(n) | Either | When size and speed matter |

Choose by what you know and what you need. For an interview, preorder with markers is the clearest. For production code, use an established format (JSON, Protocol Buffers) rather than inventing one: they handle escaping, versioning and character encodings that a hand-rolled string codec gets wrong. Storing two traversals is almost never a good idea — it is larger than one traversal with markers and fails on duplicate values.

## Common mistakes

> [!MISTAKE] Leaving out the null markers
> Plain preorder `1,2,3` cannot be decoded: `3` might be 2's child or 1's right child. Every empty child needs a marker, unless an ordering rule such as the BST property decides the shape.

**Mismatched traversal orders.** If `serialize` writes left before right, `deserialize` must read left before right. Any difference produces a mirrored or scrambled tree without an error.

**No delimiter, or a delimiter that can appear in values.** Writing `123` for the values 1, 2, 3 is ambiguous, and so is `1-2` if `-` is both a delimiter and a minus sign. Use a delimiter that cannot occur in a value.

**Building the string with `+=`.** Each concatenation copies the string, making serialisation O(n²). Use a `StringBuilder` or `StringJoiner`.

**Trailing delimiters and empty tokens.** `"1,#,#,".split(",")` drops trailing empty strings in Java, but a leading delimiter produces an empty first token that `parseInt` rejects. Write the format so it never has stray delimiters, or trim deliberately.

**Forgetting the empty tree.** `serialize(null)` and `deserialize` of its output must round-trip. Test it explicitly.

**Deep recursion on degenerate trees.** A recursive codec on a chain of hundreds of thousands of nodes can throw `StackOverflowError`. Use the level-order codec, or an explicit stack, when trees may be very deep.

## Interview perspective

*Serialize and Deserialize Binary Tree* rewards a clear explanation more than clever code. The interviewer wants to hear why your format is unambiguous.

> [!INTERVIEW] Explaining the codec
> "I'll write the tree in preorder and put a `#` wherever a child is missing. That makes the encoding self-delimiting: when I deserialise, a `#` tells me a subtree has ended, so each recursive call consumes exactly its own subtree's tokens. Serialise and deserialise are mirror images — node, left, right — and both are O(n). I'll test with a round trip, including an empty tree and negative values."

Questions to be ready for:

- **Why are null markers needed?** Without them, preorder does not say where subtrees end; with them, decoding is forced at every step.
- **How many markers are there?** `n + 1` for `n` nodes, because there are `2n` child slots and `n - 1` edges.
- **Can you do it without recursion?** Yes: level order with a queue in both directions.
- **More compact for a BST?** Preorder without markers, decoded with value bounds.
- **How would you validate an encoding?** Count open slots: start at 1, each token uses one, each value adds two; never go below zero, end at zero.
- **Follow-up: N-ary trees?** Write a child count after each value, or end each node's child list with a marker ([[a6-nary-trees]]).
- **Follow-up: general object graphs with cycles?** Assign ids and write references to ids for objects already written.

```quiz
Q: Why does preorder with null markers decode to exactly one tree?
- [ ] Because preorder is sorted
- [x] Because a marker tells the decoder when a subtree has ended, so each step of decoding is forced
- [ ] Because the root is always the largest value
- [ ] Because the number of markers equals the number of values
> Reading left to right, a value starts a node whose left and then right subtrees follow, and a marker ends an empty subtree. The decoder never has a choice about where a subtree stops, so only one tree fits the sequence. Plain preorder lacks that information.

Q: A binary tree has 7 nodes. How many null markers does its preorder serialisation contain?
- [ ] 6
- [ ] 7
- [x] 8
- [ ] 14
> There are 2 × 7 = 14 child slots, and 6 of them hold edges (every node except the root has one parent edge). The remaining 14 − 6 = 8 slots are empty, so there are n + 1 = 8 markers.

Q: Is the string "9,#,#,1" a valid preorder serialisation?
- [ ] Yes, it is the tree 9 with right child 1
- [x] No, because after "9,#,#" the tree is complete and "1" has no slot to fill
- [ ] Yes, because it contains more values than markers
- [ ] No, because 9 must be followed by a value
> Slots start at 1. Reading 9 uses one and adds two (2 open). Each # uses one, leaving 0. The token 1 then arrives with no open slot, so the string is invalid. A valid encoding of 9 with right child 1 would be "9,#,1,#,#".

Q: Why can a BST be serialised as plain preorder without markers?
- [ ] Because BSTs are always balanced
- [ ] Because BSTs have no null children
- [x] Because the ordering rule decides, for each value, whether it belongs to the current subtree
- [ ] Because inorder can be computed from the root alone
> During decoding, each subtree has a range of allowed values. A value outside the range belongs to an ancestor, which tells the decoder the current subtree is finished — the job markers do in a general tree. This works only for BSTs with distinct keys.
```

## Practice

1. **Serialize and Deserialize Binary Tree.** Write the preorder codec, then the level-order codec, and test both with round trips on an empty tree, a single node, negative values and a chain.
2. **Verify Preorder Serialization of a Binary Tree.** Solve with slot counting, without building a tree.
3. **Serialize and Deserialize BST.** Drop the markers and decode with bounds; compare string lengths with the general codec.
4. **Construct String from Binary Tree.** Produce the bracket form, omitting unnecessary empty brackets, and explain when `()` cannot be omitted.
5. **Find Duplicate Subtrees.** Write the string-key version, then the integer-id version, and explain the complexity difference.
6. **Subtree of Another Tree.** Solve by serialisation and by direct recursive comparison.
7. **Serialize and Deserialize N-ary Tree.** Use child counts.

The DSA explorer lists these under Trees; start with *Serialize and Deserialize Binary Tree*.

## Quick revision {#quick-revision}

- Serialisation = tree → flat string or bytes; deserialisation = the exact inverse. References are memory addresses and cannot be stored.
- Standard codec: preorder, value for a node, `#` for a null child, comma-separated.
- Unambiguous because markers end subtrees, so decoding is forced; plain preorder is ambiguous.
- `n` values and `n + 1` markers: `2n + 1` tokens.
- Deserialise with a token queue: read token; `#` → `null`; else create node, read left, read right.
- Validate without building: slots = 1; each token −1; each value +2; never consume at 0; end at 0.
- Level-order codec: BFS out, queue of nodes owed children in; drop trailing `null`s; no recursion.
- BST codec: preorder without markers, decode with `(lo, hi)` bounds.
- Other shape encodings: brackets (JSON, HTML), child counts (n-ary), length prefixes (Protocol Buffers).
- Duplicate subtrees: postorder key "leftId,val,rightId" → integer id; O(n) instead of O(n²) string keys.
- Subtree matching by string search needs markers and a start delimiter before each value.
- Use `StringBuilder`; round-trip test; handle empty trees, negatives and deep chains.

## Key takeaways {#key-takeaways}

- A tree in memory is held together by addresses, so storing or sending it means encoding its shape explicitly alongside its values.
- Writing a marker for every empty child makes a single preorder sequence decodable in exactly one way, because each marker says where a subtree ends.
- Serialiser and deserialiser must mirror each other exactly, and a round-trip test is the most effective way to check them.
- Knowing more about the tree allows smaller encodings: a BST needs no markers because its ordering decides the shape.
- Real formats record shape with markers, brackets, child counts or length prefixes — the same idea in different clothes.
- A serialisation is a canonical name for a subtree, which turns duplicate and matching-subtree problems into hash-map lookups.
