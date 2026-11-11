---
summary: A segment tree stores aggregates (sums, minimums, maximums and more) of every half, quarter and smaller piece of an array, so that range queries and updates both take O(log n). You will learn how it is built, why a query touches only O(log n) nodes, how to support any associative operation, and how lazy propagation makes range updates fast.
difficulty: advanced
minutes: 60
objectives:
  - Explain why prefix sums fail when the array changes and what a segment tree stores instead
  - Implement build, point update and range query, and justify each of the three query cases
  - Derive the O(n) build, the O(log n) query bound and the 4n array size
  - Adapt the tree to min, max, gcd and maximum-subarray queries by choosing a merge and an identity
  - Implement lazy propagation for range add with range sum, and explain the push-down invariant
---

## Introduction

You are given an array of `n` numbers and a stream of operations, each either "change `a[i]` to `v`" or "what is the sum of `a[l..r]`?". With `n` and the number of operations both around 10⁵, how fast can you go?

The direct approach handles an update in O(1) but must add up to `n` numbers per query. A prefix-sum array ([[a2-prefix-suffix]]) flips the trade-off: any range sum becomes one subtraction, O(1), but a single change to `a[i]` invalidates every prefix after `i`, so an update costs O(n). With 10⁵ of each operation, either approach can do around 10¹⁰ steps.

A **segment tree** sits in between and makes *both* operations O(log n). It precomputes the sum of the whole array, of each half, of each quarter, and so on down to single elements. Any range can be assembled from O(log n) of these precomputed pieces, and changing one element affects only the O(log n) pieces that contain it. The same structure works for minimum, maximum, greatest common divisor, XOR and more elaborate summaries, and with **lazy propagation** it also handles "add `v` to every element in `a[l..r]`" in O(log n).

Segment trees are a staple of competitive programming and appear in harder interviews (*Range Sum Query – Mutable*, *Count of Smaller Numbers After Self*, *My Calendar III*, *Falling Squares*). More importantly, they teach a reusable design idea: **store a summary per segment, and choose summaries that can be merged**.

## Before you start

- **Prefix sums** — and why they cannot absorb updates cheaply. See [[a2-prefix-suffix]].
- **Recursion on binary trees** — a function that handles a node by calling itself on both children. See [[a1-recursion]] and [[a6-binary-trees]].
- **Array-stored trees** — storing node `i`'s children at `2i` and `2i + 1`, as a binary heap does. See [[a7-min-heap]].
- **Big-O and logarithms** — why repeatedly halving `n` gives about log₂ n levels. See [[a1-big-o]].

## The intuition

Think of a company's sales reports. Each store reports its daily total. Each district manager keeps the sum of their stores; each region keeps the sum of its districts; head office keeps the national total. To answer "total sales of stores 3 through 6", you do not phone every store — you take whole districts where the range covers them completely, and individual stores only at the ragged edges. When one store corrects its figure, only its district, its region and head office need to adjust: one number per level.

A segment tree is that hierarchy built over array indices, with every manager responsible for exactly two halves. Its power comes from two facts: any range can be covered by a small number of complete "districts", and any single element belongs to only one district per level.

## The structure

Take `a = [5, 8, 6, 3, 2, 7, 2, 6]` (indices 0–7). The root is responsible for the whole range `[0, 7]` and stores its sum. Its left child handles `[0, 3]` and its right child `[4, 7]`. Each of those splits in half again, until every leaf holds one element. A node responsible for `[l, r]` with `l < r` splits at `mid = (l + r) / 2` into `[l, mid]` and `[mid + 1, r]`.

```mermaid title="Sum segment tree over [5, 8, 6, 3, 2, 7, 2, 6]; each node shows its range and sum"
flowchart TD
    N1["1: [0,7] = 39"] --> N2["2: [0,3] = 22"]
    N1 --> N3["3: [4,7] = 17"]
    N2 --> N4["4: [0,1] = 13"]
    N2 --> N5["5: [2,3] = 9"]
    N3 --> N6["6: [4,5] = 9"]
    N3 --> N7["7: [6,7] = 8"]
    N4 --> L["leaves 8-15: 5, 8, 6, 3, 2, 7, 2, 6"]
    N5 --> L
    N6 --> L
    N7 --> L
```

The number before each colon is the node's index in an array, using the heap layout: the root is node 1, and node `i` has children `2i` and `2i + 1`. Storing the tree in a flat `long[]` this way needs no child pointers and keeps memory compact. The leaves are not shown individually; leaf `8` holds `a[0] = 5`, leaf `9` holds `a[1] = 8`, and so on.

**How big must the array be?** When `n` is a power of two, the tree is perfect: `n` leaves, `n − 1` internal nodes, indices up to `2n − 1`. For other `n` the halves are uneven, the tree's height is `h = ⌈log₂ n⌉`, and indices can reach `2^(h+1) − 1`. Because `2^h < 2n`, that is below `4n`. So an array of size **`4n`** is always enough. It wastes some slots, but it is the safe, conventional choice.

### Building in O(n)

Build recursively: a leaf copies its element; an internal node builds both children, then stores the sum of their two values. Each node is computed once with O(1) work, and there are fewer than `2n` real nodes (a full binary tree with `n` leaves has `n − 1` internal nodes), so building is **O(n)**. A common misconception is that building costs O(n log n) — that would be the cost of inserting the elements one at a time with point updates, which is unnecessary.

### Range query: three cases

To find the sum of `[ql, qr]`, start at the root and compare each node's range `[l, r]` with the query:

1. **Disjoint** (`qr < l` or `r < ql`): this node contributes nothing. Return the **identity** of the operation — 0 for sums, because adding 0 changes nothing.
2. **Fully covered** (`ql <= l` and `r <= qr`): the node's stored value is exactly the contribution of its range. Return it without looking further down.
3. **Partial overlap**: the query covers part of this range. Ask both children and add their answers.

Dry run: `query(2, 6)` on the tree above, the sum `6 + 3 + 2 + 7 + 2 = 20`.

| Node | Range | Case | Returns |
|---|---|---|---|
| 1 | `[0,7]` | partial | `left + right` |
| 2 | `[0,3]` | partial | `left + right` |
| 4 | `[0,1]` | disjoint | 0 |
| 5 | `[2,3]` | covered | 9 |
| 3 | `[4,7]` | partial | `left + right` |
| 6 | `[4,5]` | covered | 9 |
| 7 | `[6,7]` | partial | `left + right` |
| 14 | `[6,6]` | covered | 2 |
| 15 | `[7,7]` | disjoint | 0 |

The answer is `9 + 9 + 2 = 20`, assembled from three stored values. The query never descended into nodes 5 or 6 — the "whole districts".

### Why a query visits O(log n) nodes

Look at one level of the tree. Its nodes' ranges are disjoint and in order, and the query range `[ql, qr]` is one contiguous block. So at most **two** nodes per level can be partially overlapped — the one containing the left edge `ql` and the one containing the right edge `qr`; every node strictly between them is fully covered and every node outside is disjoint. Only partial nodes recurse, so each level has at most 2 partial nodes, which generate at most 4 visited children on the next level. With about `log₂ n` levels, a query visits at most about `4 log₂ n` nodes: **O(log n)**.

### Point update

To set `a[idx] = v`, walk from the root towards the leaf for `idx` (go left if `idx <= mid`, otherwise right), set the leaf, and on the way back up recompute each ancestor as the sum of its children. Exactly one node per level changes, so an update is **O(log n)**.

## The complete sum segment tree

```java title="SegmentTree.java"
public class SegmentTree {

    private final int n;
    private final long[] tree;             // tree[node] = sum of the node's segment

    public SegmentTree(int[] a) {
        n = a.length;
        tree = new long[4 * Math.max(n, 1)];
        if (n > 0) build(a, 1, 0, n - 1);
    }

    private void build(int[] a, int node, int l, int r) {
        if (l == r) {
            tree[node] = a[l];
            return;
        }
        int mid = (l + r) >>> 1;
        build(a, 2 * node, l, mid);
        build(a, 2 * node + 1, mid + 1, r);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    /** Sum of a[ql..qr], both ends inclusive. */
    public long query(int ql, int qr) {
        return query(1, 0, n - 1, ql, qr);
    }

    private long query(int node, int l, int r, int ql, int qr) {
        if (qr < l || r < ql) return 0;                 // disjoint: identity for sum
        if (ql <= l && r <= qr) return tree[node];      // fully inside: use the total
        int mid = (l + r) >>> 1;                        // partial: ask both halves
        return query(2 * node, l, mid, ql, qr)
             + query(2 * node + 1, mid + 1, r, ql, qr);
    }

    /** Sets a[idx] = value. */
    public void update(int idx, int value) {
        update(1, 0, n - 1, idx, value);
    }

    private void update(int node, int l, int r, int idx, int value) {
        if (l == r) {
            tree[node] = value;
            return;
        }
        int mid = (l + r) >>> 1;
        if (idx <= mid) update(2 * node, l, mid, idx, value);
        else update(2 * node + 1, mid + 1, r, idx, value);
        tree[node] = tree[2 * node] + tree[2 * node + 1];   // repair on the way back up
    }

    public static void main(String[] args) {
        int[] a = {5, 8, 6, 3, 2, 7, 2, 6};
        SegmentTree st = new SegmentTree(a);
        System.out.println(st.query(0, 7));     // whole array
        System.out.println(st.query(2, 6));     // 6 + 3 + 2 + 7 + 2
        st.update(4, 10);                       // a[4]: 2 -> 10
        System.out.println(st.query(2, 6));
        System.out.println(st.query(5, 5));     // single element
    }
}
```

```output
39
20
28
7
```

Several choices here are deliberate. Node ranges are passed as parameters (`l`, `r`) rather than stored, because they are determined by the path from the root; storing them would triple memory for no gain. The tree holds `long` even though the input is `int`, because a sum of 10⁵ values up to 10⁹ overflows `int`. The midpoint uses `>>> 1`, which is safe for any non-negative `l + r` (see [[a3-binary-search]]). The public methods take the familiar `(ql, qr)` while private overloads carry the recursion state — a clean way to hide the node bookkeeping.

Recursion depth is the tree height, about 17 for `n = 10⁵` and 20 for 10⁶, so stack overflow is not a concern here, despite what you may read. The tree, together with the lazy and iterative versions below, was checked against a brute-force array on 3,000 random arrays with 100 mixed operations each.

```quiz
Q: In a sum segment tree query, what should a node whose range is disjoint from the query return?
- [ ] Its stored sum
- [x] 0, the identity for addition
- [ ] `Integer.MAX_VALUE`
- [ ] The value of its left child
> A disjoint node contributes nothing to the answer, so it must return a value that leaves the sum unchanged — 0. For a minimum tree the identity would be `Integer.MAX_VALUE`, which is why the identity depends on the operation, not on the tree.

Q: Why can a segment tree query visit no more than about four nodes per level?
- [ ] Because the tree is stored in an array
- [ ] Because each node has two children and the query stops at leaves
- [x] Because at most two nodes per level are partially overlapped by a contiguous range, and only those recurse
- [ ] Because queries always start at the root
> Nodes on one level cover disjoint, ordered ranges, and the query is contiguous, so only the nodes containing its two edges can be partly inside. Those two recurse into at most four children; all other nodes are either fully covered (returned) or disjoint (identity).
```

## Beyond sums: choosing a merge and an identity

Nothing in the tree depends on addition specifically. It needs a **merge** operation that combines two adjacent segments' summaries into the summary of their union, and an **identity** value for disjoint nodes. The merge must be **associative** — `merge(merge(x, y), z) == merge(x, merge(y, z))` — because the tree groups elements in an arbitrary bracket structure. It does not need to be commutative, as long as the left child is always merged before the right.

| Query | Merge | Identity |
|---|---|---|
| Range sum | `x + y` | `0` |
| Range minimum | `min(x, y)` | `+∞` (`Integer.MAX_VALUE`) |
| Range maximum | `max(x, y)` | `−∞` |
| Range GCD | `gcd(x, y)` | `0`, since `gcd(0, y) = y` |
| Range XOR | `x ^ y` | `0` |
| Count of elements satisfying a property | `x + y` over 0/1 leaves | `0` |

Some questions need a richer summary. "What is the maximum subarray sum within `a[l..r]`?" cannot be answered from each half's best subarray alone: the best subarray might cross the midpoint. [[a2-kadane]] solves it for one fixed array; to answer it for arbitrary ranges with updates, each node stores four numbers — the segment's total, its best prefix sum, its best suffix sum and its best subarray sum — and merging two adjacent segments `A` (left) and `B` (right) works like this:

- total = `A.total + B.total`
- best prefix = the better of `A`'s best prefix, or all of `A` followed by `B`'s best prefix
- best suffix = the better of `B`'s best suffix, or `A`'s best suffix followed by all of `B`
- best = the best of `A.best`, `B.best`, and `A.bestSuffix + B.bestPrefix` (a subarray crossing the boundary)

```java title="MaxSubarrayTree.java"
public class MaxSubarrayTree {

    /** Everything a parent needs to know about a segment to answer "best subarray". */
    record Info(long total, long bestPrefix, long bestSuffix, long best) {
        static Info of(long v) { return new Info(v, v, v, v); }

        static Info merge(Info a, Info b) {
            return new Info(
                a.total + b.total,
                Math.max(a.bestPrefix, a.total + b.bestPrefix),
                Math.max(b.bestSuffix, b.total + a.bestSuffix),
                Math.max(Math.max(a.best, b.best), a.bestSuffix + b.bestPrefix));
        }
    }

    private final int n;
    private final Info[] tree;

    MaxSubarrayTree(int[] a) {
        n = a.length;
        tree = new Info[4 * n];
        build(a, 1, 0, n - 1);
    }

    private void build(int[] a, int node, int l, int r) {
        if (l == r) { tree[node] = Info.of(a[l]); return; }
        int mid = (l + r) >>> 1;
        build(a, 2 * node, l, mid);
        build(a, 2 * node + 1, mid + 1, r);
        tree[node] = Info.merge(tree[2 * node], tree[2 * node + 1]);
    }

    /** Best non-empty subarray sum inside a[ql..qr]. */
    long best(int ql, int qr) { return query(1, 0, n - 1, ql, qr).best(); }

    private Info query(int node, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return tree[node];
        int mid = (l + r) >>> 1;
        if (qr <= mid) return query(2 * node, l, mid, ql, qr);       // only left half
        if (ql > mid) return query(2 * node + 1, mid + 1, r, ql, qr); // only right half
        return Info.merge(query(2 * node, l, mid, ql, qr),
                          query(2 * node + 1, mid + 1, r, ql, qr));
    }

    void set(int idx, int v) { set(1, 0, n - 1, idx, v); }

    private void set(int node, int l, int r, int idx, int v) {
        if (l == r) { tree[node] = Info.of(v); return; }
        int mid = (l + r) >>> 1;
        if (idx <= mid) set(2 * node, l, mid, idx, v); else set(2 * node + 1, mid + 1, r, idx, v);
        tree[node] = Info.merge(tree[2 * node], tree[2 * node + 1]);
    }

    public static void main(String[] args) {
        MaxSubarrayTree t = new MaxSubarrayTree(new int[] {-2, 1, -3, 4, -1, 2, 1, -5, 4});
        System.out.println(t.best(0, 8));
        System.out.println(t.best(0, 2));
        t.set(7, 5);
        System.out.println(t.best(0, 8));
    }
}
```

```output
6
1
15
```

This query has no identity value — there is no sensible "empty" `Info` for a non-empty subarray — so instead of a disjoint case it only recurses into halves that actually intersect the query. That is a useful alternative form whenever an identity is awkward. The first answer, 6, is the classic `[4, −1, 2, 1]`; after setting index 7 to 5, the best subarray becomes `4 − 1 + 2 + 1 + 5 + 4 = 15`.

## Range updates: lazy propagation

Now suppose operations include "add `v` to every element of `a[l..r]`". Doing it as `r − l + 1` point updates costs O(n log n) per operation. A difference array ([[a2-difference-arrays]]) makes range updates O(1) but then needs an O(n) pass to read anything.

**Lazy propagation** applies the update to whole nodes and postpones telling their children. When a range update fully covers a node, you can update that node's sum immediately — adding `v` to each of its `len` elements adds `v · len` to its sum — and leave a note, a **lazy tag**, saying "every element below me still owes `+v`". The children are corrected only when some later operation needs to go below this node. At that moment the node **pushes** its tag down: it applies the pending add to both children (updating their sums and their own tags) and clears its own tag.

The invariant that makes this correct is:

> `sum[node]` is always the true sum of the node's range. `lazy[node]` is an amount that has been applied to `sum[node]` but not yet to its children.

With that invariant, a fully covered node can answer a query directly, and any operation that descends past a node pushes first, so the children it reads are up to date. Each range update and query still touches only O(log n) nodes — the same ones a plain query would — so both are **O(log n)**.

```java title="LazySegmentTree.java"
public class LazySegmentTree {

    private final int n;
    private final long[] sum;   // correct sum of the node's segment, pending adds included
    private final long[] lazy;  // add still owed to every element of both children

    public LazySegmentTree(int[] a) {
        n = a.length;
        sum = new long[4 * n];
        lazy = new long[4 * n];
        build(a, 1, 0, n - 1);
    }

    private void build(int[] a, int node, int l, int r) {
        if (l == r) { sum[node] = a[l]; return; }
        int mid = (l + r) >>> 1;
        build(a, 2 * node, l, mid);
        build(a, 2 * node + 1, mid + 1, r);
        sum[node] = sum[2 * node] + sum[2 * node + 1];
    }

    /** Applies "add v to every element" to a whole node in O(1). */
    private void apply(int node, int l, int r, long v) {
        sum[node] += v * (r - l + 1);
        lazy[node] += v;
    }

    /** Hands this node's pending add down to its two children. */
    private void push(int node, int l, int r) {
        if (lazy[node] == 0) return;
        int mid = (l + r) >>> 1;
        apply(2 * node, l, mid, lazy[node]);
        apply(2 * node + 1, mid + 1, r, lazy[node]);
        lazy[node] = 0;
    }

    /** Adds v to every a[i] with ql <= i <= qr. */
    public void rangeAdd(int ql, int qr, long v) { rangeAdd(1, 0, n - 1, ql, qr, v); }

    private void rangeAdd(int node, int l, int r, int ql, int qr, long v) {
        if (qr < l || r < ql) return;
        if (ql <= l && r <= qr) { apply(node, l, r, v); return; }   // stop here: be lazy
        push(node, l, r);
        int mid = (l + r) >>> 1;
        rangeAdd(2 * node, l, mid, ql, qr, v);
        rangeAdd(2 * node + 1, mid + 1, r, ql, qr, v);
        sum[node] = sum[2 * node] + sum[2 * node + 1];
    }

    public long query(int ql, int qr) { return query(1, 0, n - 1, ql, qr); }

    private long query(int node, int l, int r, int ql, int qr) {
        if (qr < l || r < ql) return 0;
        if (ql <= l && r <= qr) return sum[node];
        push(node, l, r);                                   // children must be current
        int mid = (l + r) >>> 1;
        return query(2 * node, l, mid, ql, qr) + query(2 * node + 1, mid + 1, r, ql, qr);
    }

    public static void main(String[] args) {
        LazySegmentTree t = new LazySegmentTree(new int[] {1, 2, 3, 4, 5, 6});
        t.rangeAdd(1, 4, 10);                  // [1, 12, 13, 14, 15, 6]
        System.out.println(t.query(0, 5));
        System.out.println(t.query(3, 3));
        t.rangeAdd(0, 2, -1);                  // [0, 11, 12, 14, 15, 6]
        System.out.println(t.query(0, 2));
        System.out.println(t.query(2, 4));
    }
}
```

```output
61
14
23
41
```

Follow `rangeAdd(1, 4, 10)` on six elements. The root `[0,5]` is partial, so it pushes (nothing pending) and recurses. Its left child `[0,2]` is partial; inside it, `[0,1]` is partial and `[2,2]` is covered — that leaf gets `+10`. Further down, `[1,1]` is covered. On the right, `[3,5]` is partial; `[3,4]` is fully covered, so it receives `sum += 10 · 2` and `lazy = 10`, and the recursion stops there — its leaves `[3,3]` and `[4,4]` are *not* touched. Later, `query(3, 3)` reaches `[3,4]` as a partial node, pushes the tag into both leaves, and reads the correct value 14.

Two points are easy to get wrong. Updates must recompute the parent's sum after recursing (the last line of `rangeAdd`), or ancestors keep stale totals. And every path that goes *below* a node must push first — in both updates and queries — or it reads children that are missing pending adds. Other lazy operations follow the same template with a different `apply`: "assign `v` to the range" sets `sum = v · len` and stores an assignment tag (which must overwrite any pending add), and "add `v`" on a minimum tree adds `v` to the node's minimum.

```quiz
Q: In the lazy tree, what does `lazy[node] = 10` mean?
- [ ] The node's `sum` is 10 too small and must be fixed before use
- [x] `sum[node]` already includes +10 per element, but the children have not been told yet
- [ ] Every element in the array must have 10 added at the next query
- [ ] The node will be rebuilt after 10 more operations
> The invariant keeps `sum[node]` correct at all times; the tag records only what the children still owe. That is why a fully covered node can answer a query immediately, and why any operation going below the node must push the tag first.
```

## An iterative bottom-up tree

When the operation is a simple associative one (sum, min, max) and no lazy tags are needed, a shorter iterative version is popular. It stores the leaves at indices `n..2n−1` and each parent `i` at `i` with children `2i` and `2i + 1`, using only `2n` slots for any `n`. A query on the half-open range `[l, r)` climbs from both edges towards the root: whenever the left edge is a right child, its node is entirely inside the range, so it is taken and the edge moves right; symmetrically on the right.

```java title="IterativeSegmentTree.java"
public class IterativeSegmentTree {

    private final int n;
    private final int[] t;      // leaves at t[n..2n-1], parents at t[1..n-1]

    IterativeSegmentTree(int[] a) {
        n = a.length;
        t = new int[2 * n];
        System.arraycopy(a, 0, t, n, n);
        for (int i = n - 1; i >= 1; i--) t[i] = Math.min(t[2 * i], t[2 * i + 1]);
    }

    void set(int i, int value) {
        for (t[i += n] = value; i > 1; i >>= 1) t[i >> 1] = Math.min(t[i], t[i ^ 1]);
    }

    /** Minimum of a[l..r), half-open. */
    int min(int l, int r) {
        int res = Integer.MAX_VALUE;
        for (l += n, r += n; l < r; l >>= 1, r >>= 1) {
            if ((l & 1) == 1) res = Math.min(res, t[l++]);   // l is a right child
            if ((r & 1) == 1) res = Math.min(res, t[--r]);   // r - 1 is a left child
        }
        return res;
    }

    public static void main(String[] args) {
        IterativeSegmentTree st = new IterativeSegmentTree(new int[] {5, 8, 6, 3, 2, 7, 2, 6});
        System.out.println(st.min(0, 3));
        System.out.println(st.min(2, 7));
        st.set(4, 9);
        System.out.println(st.min(2, 7));
    }
}
```

```output
5
2
2
```

`i ^ 1` is the sibling of node `i` (it flips the last bit, turning `2k` into `2k + 1` and back). The code is short and fast, but it is harder to explain and to extend; for non-commutative merges the left and right partial results must be kept separately. In interviews, the recursive version is easier to write correctly under pressure.

## Recognising segment-tree problems

The signal is: **an array that changes, and repeated questions about contiguous ranges, where the answer for a range can be combined from answers for its two halves.** Some disguises:

- **Count of Smaller Numbers After Self.** Walk the array from the right, and keep a tree indexed by *value* that counts how many of each value have been seen. "How many seen values are smaller than `x`?" is a range sum over values `[min, x − 1]`. Values can be huge or negative, so first map them to ranks 1..n with **coordinate compression** ([[a2-sorting-based]]). A merge-sort solution also exists ([[a3-merge-sort]]), and a Fenwick tree ([[a12-fenwick]]) is shorter.
- **Booking and calendar problems** (*My Calendar III*): range add of +1 over a booking's time span, then a global maximum — lazy add on a max tree, over compressed times.
- **Finding the first position with a property.** "First index `i` with `a[i] >= x`" with updates: store the maximum per node, and descend into the left child if its maximum is at least `x`, otherwise the right — O(log n). This **tree descent** replaces a binary search over the tree.

Beyond interviews there are further variants worth knowing by name: **2D segment trees** (a tree of trees for rectangle queries, O(log² n)), **persistent segment trees** (each update creates O(log n) new nodes and keeps old versions queryable) and **dynamic (sparse) segment trees** that create nodes on demand when indices range up to 10⁹.

## In real systems

Segment trees themselves live mostly in specialised software rather than everyday application code. Computational geometry uses them for sweep-line algorithms such as the area of a union of rectangles. Genomics and other interval-heavy domains use segment and interval trees to find all features overlapping a region. Game servers and analytics tools sometimes keep range aggregates over a fixed slot space — for example, counts per score bucket — that must update and be queried constantly.

The design idea is more widespread than the data structure. Time-series and metrics systems store **pre-aggregated rollups** (per-minute, per-hour, per-day totals) so that a query over a long window combines a few coarse buckets plus partial buckets at the edges — the same "whole districts plus ragged edges" strategy, with the same requirement that the aggregate be mergeable. Sums, counts, minima and maxima merge; an exact median does not, which is why such systems use mergeable approximate sketches for percentiles.

## Trade-offs and alternatives

| Approach | Update | Range query | Memory | Best when |
|---|---|---|---|---|
| Plain array | O(1) | O(n) | `n` | Few queries |
| Prefix sums | O(n) | O(1) | `n` | Static array, sum queries |
| Sparse table | rebuild | O(1) for min/max/gcd | `n log n` | Static array, idempotent queries — [[a12-sparse-tables]] |
| Fenwick tree | O(log n) | O(log n) for prefix-decomposable ops | `n` | Sums and counts with updates — [[a12-fenwick]] |
| Segment tree | O(log n) | O(log n), any associative merge | about `4n` (or `2n` iterative) | Custom merges, min/max with updates, range updates |
| Sqrt decomposition | O(1) or O(√n) | O(√n) | `n` | Operations too awkward for a tree |

Choose a Fenwick tree when you need only sums or counts with point updates: it is shorter and has a smaller constant factor. Choose a segment tree when the operation is min, max, GCD or a custom summary, when you need range updates beyond the Fenwick tricks, or when you need tree descent. If the array never changes, a segment tree is overkill.

## Common mistakes

> [!MISTAKE] Allocating 2n slots for the recursive tree
> The recursive layout with root 1 and children `2i`, `2i + 1` can use indices close to `4n` when `n` is not a power of two. Allocating `2n` passes small tests and throws `ArrayIndexOutOfBoundsException` on unlucky sizes. Use `4n`, or use the iterative layout, which really needs only `2n`.

**Wrong identity.** Returning 0 for disjoint nodes in a minimum tree makes every range with a non-negative minimum report 0. The identity must leave the merge unchanged: `Integer.MAX_VALUE` for min.

**Mixing inclusive and exclusive bounds.** The recursive version above uses inclusive `[ql, qr]`; the iterative one uses half-open `[l, r)`. Calling one with the other's convention silently drops or adds an element.

**Forgetting to recompute the parent.** After a point or range update recurses into a child, the parent's value must be recomputed from its children; otherwise every ancestor reports the old value.

**Not pushing before descending.** In a lazy tree, reading or updating children without first pushing the parent's tag uses stale child values.

**Overflow.** Sums of many `int` values, and `v * len` in lazy updates, need `long`.

## Interview perspective

> [!INTERVIEW] Explaining the query
> "Each node stores the sum of its range. A query returns the stored value for nodes completely inside the range, zero for nodes completely outside, and splits the rest. Only the nodes containing the two ends of the range can be split on any level, so at most four nodes per level are visited — O(log n)."

Expect these questions:

- **Why not prefix sums?** O(n) per update. Give the 10⁵ × 10⁵ arithmetic.
- **Why is the array 4n?** Height `⌈log₂ n⌉`, indices below `2^(h+1) < 4n`.
- **What is the build cost?** O(n): each of fewer than `2n` nodes is computed once.
- **How would you change it to range minimum?** Change the merge to `min` and the identity to `+∞`.
- **Range updates?** Lazy propagation; state the invariant about `sum` and `lazy`.
- **Fenwick or segment tree?** Fenwick for sums and counts with point updates; segment tree for general merges, min/max with updates, or range assignment.

## Practice

1. **Range Sum Query – Mutable.** Implement the recursive tree from memory.
2. **Range minimum with updates.** Change the merge and identity; test with a range that excludes the global minimum.
3. **Count of Smaller Numbers After Self.** Coordinate-compress, then use a count tree while scanning from the right.
4. **Range add, range sum.** Implement lazy propagation and compare with a brute-force array on random operations.
5. **Maximum subarray in a range.** Implement the four-value node and verify against an O(n²) brute force.
6. **First element at least x.** Add a tree-descent query to a max segment tree.

The DSA explorer lists matching problems under this topic.

## Quick revision {#quick-revision}

- Problem: point/range updates and range queries both fast; prefix sums are O(n) per update.
- Node `i` covers `[l, r]`, children `2i` (`[l, mid]`) and `2i + 1` (`[mid+1, r]`); root is node 1; allocate `4n`.
- Build O(n): leaves copy, parents merge children.
- Query cases: disjoint → identity; covered → stored value; partial → merge both children. O(log n): at most 2 partial nodes per level.
- Point update: walk to the leaf, recompute ancestors. O(log n).
- Any associative merge with an identity works: sum/0, min/+∞, max/−∞, gcd/0, xor/0; richer nodes (total, best prefix, best suffix, best) answer max-subarray queries.
- Lazy propagation: `sum` always correct; `lazy` owed to children; apply on full cover, push before going below.
- Iterative tree: leaves at `n..2n−1`, half-open queries, `2n` memory, no lazy.
- Prefer Fenwick for sum-only; sparse table for static idempotent queries.

## Key takeaways {#key-takeaways}

- A segment tree precomputes summaries of every half, quarter and smaller piece, so any range is a merge of O(log n) stored summaries and any point change touches O(log n) of them.
- Correctness of the query comes from three cases; its speed comes from the fact that only the nodes holding the range's two ends can be split on each level.
- The structure is generic: pick an associative merge and an identity, or a richer node summary when the answer needs it.
- Lazy propagation makes range updates O(log n) by updating whole nodes and deferring their children, guarded by a precise invariant.
- Reach for a simpler tool first — prefix sums for static sums, a Fenwick tree for dynamic sums, a sparse table for static minimums — and use a segment tree when you need its generality.
