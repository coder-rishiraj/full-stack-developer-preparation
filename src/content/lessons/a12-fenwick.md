---
summary: A Fenwick tree (binary indexed tree) keeps prefix sums of a changing array in a single array of n + 1 numbers, answering prefix sums and point updates in O(log n) with a few lines of code. You will learn what each cell stores, why `i & -i` drives both loops, and how to extend it to range updates, inversion counting and order statistics.
difficulty: advanced
minutes: 45
objectives:
  - Explain which block of the array each Fenwick cell is responsible for, using the lowest set bit
  - Trace the query and update loops by hand and justify why each touches O(log n) cells
  - Implement a one-indexed Fenwick tree with an O(n) build and range sums via prefix differences
  - Extend it to range updates with point or range queries using difference arrays
  - Apply it to inversion counting and k-th smallest queries with coordinate compression
---

## Introduction

A Fenwick tree solves the same problem that motivates segment trees ([[a12-segment-trees]]): an array changes, and you keep asking for sums over ranges. A prefix-sum array answers a range sum in O(1) but needs O(n) work to absorb one change, because every later prefix includes the changed element. A plain array updates in O(1) but sums in O(n). The Fenwick tree — named after Peter Fenwick, who described it in 1994, and also called a **binary indexed tree (BIT)** — does both in O(log n).

What makes it worth its own lesson is its economy. A sum segment tree needs about `4n` cells and three recursive methods. A Fenwick tree needs `n + 1` cells and two loops of one line each. It is the standard tool for dynamic prefix sums, frequency tables and counting problems such as inversions, and it is a favourite of competitive programmers because it is hard to get wrong once understood.

The price is generality. A Fenwick tree is built around *prefixes* and *subtraction*: a range sum is `prefix(r) − prefix(l − 1)`. Operations without an inverse, such as an arbitrary range minimum, do not fit. Knowing where that line falls is part of using it well.

## Before you start

- **Prefix sums** — and the identity `sum(l..r) = prefix(r) − prefix(l − 1)`. See [[a2-prefix-suffix]].
- **Binary representation and bit operations** — reading numbers in binary, AND, and two's complement negatives. See [[a13-and-or-xor]] and [[a13-powers-of-two]].
- **Difference arrays** — for the range-update section. See [[a2-difference-arrays]].
- **Segment trees** are helpful for comparison but not required. See [[a12-segment-trees]].

## The intuition: blocks sized by the lowest set bit

Write any positive integer in binary, for example 13 = `1101`. Its set bits say 13 = 8 + 4 + 1. That suggests a way to split the prefix `a[1..13]` into blocks whose lengths are those powers of two: `a[1..8]` (length 8), `a[9..12]` (length 4), `a[13..13]` (length 1). If we had those three block sums stored somewhere, the prefix sum would be three additions — one per set bit, so at most about log₂ n.

The Fenwick tree stores exactly such blocks. Cell `tree[i]` holds the sum of the block that **ends at `i`** and whose **length is the lowest set bit of `i`**:

> `tree[i] = a[i − lowbit(i) + 1] + … + a[i]`, where `lowbit(i)` is the value of the lowest 1-bit of `i`.

For indices 1 to 8:

| `i` | Binary | `lowbit(i)` | `tree[i]` covers |
|---|---|---|---|
| 1 | `0001` | 1 | `a[1]` |
| 2 | `0010` | 2 | `a[1..2]` |
| 3 | `0011` | 1 | `a[3]` |
| 4 | `0100` | 4 | `a[1..4]` |
| 5 | `0101` | 1 | `a[5]` |
| 6 | `0110` | 2 | `a[5..6]` |
| 7 | `0111` | 1 | `a[7]` |
| 8 | `1000` | 8 | `a[1..8]` |

Odd indices cover one element; multiples of 2 that are not multiples of 4 cover two; multiples of 4 (not 8) cover four; and so on. Despite the name, there is no tree of node objects — only this array, with an implicit structure given by the binary digits of the indices. The indices are **1-based** because index 0 has no set bit and would cover an empty block.

## `i & -i`: extracting the lowest set bit

In two's complement, `-i` is `~i + 1`: flip every bit, then add one. Flipping turns the trailing zeros of `i` into ones and its lowest 1 into a 0; adding one carries through those trailing ones and turns that position back into a 1. Every bit above it remains flipped. So `i` and `-i` agree on exactly one 1-bit — the lowest — and `i & -i` isolates it.

```text
i      = 12 = 0000 1100
~i          = 1111 0011
-i = ~i + 1 = 1111 0100
i & -i      = 0000 0100 = 4
```

## Prefix query: strip the lowest bit

To compute `prefix(i) = a[1] + … + a[i]`, take `tree[i]`, which covers `a[i − lowbit(i) + 1 .. i]`. What remains is the prefix ending immediately before that block, at `i − lowbit(i)`. Repeat until the index reaches 0.

```java
long prefix(int i) {
    long total = 0;
    for (; i > 0; i -= i & -i) total += tree[i];
    return total;
}
```

Subtracting the lowest set bit **clears** it, so each iteration removes one 1-bit from `i`. An `int` up to `n` has at most ⌊log₂ n⌋ + 1 set bits, so the loop runs **O(log n)** times. For `prefix(7)`: 7 = `111` → add `tree[7]` (`a[7]`), go to 6 = `110` → add `tree[6]` (`a[5..6]`), go to 4 = `100` → add `tree[4]` (`a[1..4]`), go to 0 and stop. The three blocks tile `a[1..7]` exactly, with no overlap and no gap.

## Point update: climb by adding the lowest bit

To add `delta` to `a[i]`, every cell whose block contains position `i` must change. The first is `tree[i]` itself. The next larger block that contains `i` ends at `i + lowbit(i)`: adding the lowest bit carries into a higher bit, producing an index whose lowest bit is larger, and whose block therefore reaches back far enough to include `i`. Repeat until past `n`.

```java
void add(int i, long delta) {
    for (; i <= n; i += i & -i) tree[i] += delta;
}
```

For `add(5, …)` with `n = 8`: 5 = `0101` updates `tree[5]` (`a[5]`); 5 + 1 = 6 = `0110` updates `tree[6]` (`a[5..6]`); 6 + 2 = 8 = `1000` updates `tree[8]` (`a[1..8]`); 8 + 8 = 16 > 8 stops. Check against the table: those are exactly the three cells whose blocks contain position 5. Each step moves the lowest set bit at least one position left, so there are at most about log₂ n steps: **O(log n)**.

Why are these the *only* cells containing `i`? A cell `j ≥ i` covers `i` when its block reaches back to `i` or earlier, that is, when `lowbit(j)` is larger than the distance `j − i`. Climbing by `i += lowbit(i)` visits exactly those `j`: any index skipped in between has a lowest bit too small to reach back to `i`. You do not need to reproduce this proof in an interview, but you should be able to verify it on the table for a small case.

## The complete Fenwick tree

The constructor below builds in O(n) rather than by `n` separate updates (O(n log n)). Each cell, once its own block sum is final, adds itself into the next cell that contains its block — its "parent" `i + lowbit(i)`. Processing indices in increasing order guarantees every cell is final before it is passed on.

```java title="Fenwick.java"
public class Fenwick {

    private final long[] tree;   // 1-indexed: tree[i] = sum of a[i - lowbit(i) + 1 .. i]

    public Fenwick(int n) {
        tree = new long[n + 1];
    }

    /** O(n) build from a 0-indexed array. */
    public Fenwick(int[] a) {
        this(a.length);
        for (int i = 1; i <= a.length; i++) {
            tree[i] += a[i - 1];
            int parent = i + (i & -i);          // the next block that contains block i
            if (parent < tree.length) tree[parent] += tree[i];
        }
    }

    /** a[i] += delta, for 1 <= i <= n. */
    public void add(int i, long delta) {
        for (; i < tree.length; i += i & -i) tree[i] += delta;
    }

    /** a[1] + ... + a[i]; prefix(0) == 0. */
    public long prefix(int i) {
        long total = 0;
        for (; i > 0; i -= i & -i) total += tree[i];
        return total;
    }

    /** a[l] + ... + a[r], 1-indexed and inclusive. */
    public long rangeSum(int l, int r) {
        return prefix(r) - prefix(l - 1);
    }

    public static void main(String[] args) {
        int[] a = {5, 8, 6, 3, 2, 7, 2, 6};     // a[1..8] in Fenwick terms
        Fenwick fw = new Fenwick(a);
        System.out.println(java.util.Arrays.toString(fw.tree));
        System.out.println(fw.prefix(8));
        System.out.println(fw.rangeSum(3, 7)); // 6 + 3 + 2 + 7 + 2
        fw.add(5, 8);                          // a[5]: 2 -> 10
        System.out.println(fw.rangeSum(3, 7));
        System.out.println(fw.prefix(7));     // tree[7] + tree[6] + tree[4]
    }
}
```

```output
[0, 5, 13, 6, 22, 2, 9, 2, 39]
39
20
28
41
```

Compare the printed array with the responsibility table: `tree[2] = 5 + 8 = 13`, `tree[4] = 5 + 8 + 6 + 3 = 22`, `tree[6] = 2 + 7 = 9`, `tree[8] = 39`, and odd cells hold single elements. `rangeSum(3, 7)` is `prefix(7) − prefix(2) = 33 − 13 = 20`. The update `add(5, 8)` changes cells 5, 6 and 8; `prefix(7)` then reads cells 7, 6 and 4 to give `2 + 17 + 22 = 41`. Cell 6 is shared by the update path and the query path, which is how a single change reaches every affected prefix.

The class stores `long` because sums of many `int` values overflow. Callers with 0-indexed data must add 1 before calling `add` or `prefix` — the most common Fenwick bug. This class and every variant below were checked against brute-force arrays on thousands of random arrays and operation sequences.

```quiz
Q: Which cells does `prefix(12)` read, for a Fenwick tree with n = 16?
- [ ] 12, 11, 10, …, 1
- [x] 12 and 8
- [ ] 12, 13 and 16
- [ ] Only 12
> 12 is 1100 in binary. tree[12] covers a[9..12] (lowbit 4); clearing that bit gives 8 = 1000, and tree[8] covers a[1..8]; clearing it gives 0. Two cells, one per set bit. The path 12, 16 climbs upwards and belongs to an update, not a query.

Q: Why does a Fenwick tree use 1-based indexing?
- [ ] Java arrays are 1-based
- [x] Index 0 has no set bit, so `0 & -0` is 0 and the loops would never move
- [ ] It saves one array slot
- [ ] It makes range queries O(1)
> The block length of cell i is lowbit(i). For i = 0 that is 0: an update loop doing i += 0 would run forever, and the cell would cover nothing. Starting at 1 gives every cell a non-empty block; prefix(0) = 0 then falls out of the loop condition naturally.
```

## Range updates

### Range update, point query

Sometimes the operations are reversed: "add `v` to every element of `a[l..r]`" and "what is `a[i]` now?". Store the **difference array** `d` instead of `a`, where `a[i] = d[1] + … + d[i]` ([[a2-difference-arrays]]). A range add becomes two point updates — `d[l] += v` and `d[r + 1] −= v` — and the current `a[i]` is the prefix sum of `d` up to `i`. A Fenwick tree over `d` does both in O(log n).

### Range update, range query

If you need range adds *and* range sums, one tree is not enough, but two are. After `add v to a[l..r]`, the prefix sum `prefix(i)` changes by:

- `0` when `i < l`,
- `v · (i − l + 1) = v · i − v · (l − 1)` when `l ≤ i ≤ r`,
- `v · (r − l + 1)` when `i > r`.

Each case has the form `X · i − Y`, so keep two Fenwick trees: `B1`, whose prefix gives the coefficient `X`, and `B2`, whose prefix gives `Y`. For the update, add `v` at `l` and `−v` at `r + 1` in `B1`, and add `v · (l − 1)` at `l` and `−v · r` at `r + 1` in `B2`. Then `prefix(i) = sum(B1, i) · i − sum(B2, i)`. Check the third case: `B1` contributes `v − v = 0`, `B2` contributes `v(l − 1) − v·r`, and `0 − (v(l − 1) − vr) = v(r − l + 1)` as required.

```java title="RangeFenwick.java"
public class RangeFenwick {

    private final int n;
    private final long[] b1, b2;   // two Fenwick trees over the difference array

    RangeFenwick(int n) {
        this.n = n;
        b1 = new long[n + 1];
        b2 = new long[n + 1];
    }

    private static void add(long[] t, int i, long v) {
        for (; i < t.length; i += i & -i) t[i] += v;
    }

    private static long sum(long[] t, int i) {
        long s = 0;
        for (; i > 0; i -= i & -i) s += t[i];
        return s;
    }

    /** a[l..r] += v (1-indexed, inclusive). */
    void rangeAdd(int l, int r, long v) {
        add(b1, l, v);
        add(b1, r + 1, -v);
        add(b2, l, v * (l - 1));
        add(b2, r + 1, -v * r);
    }

    /** a[1] + ... + a[i]. */
    long prefix(int i) {
        return sum(b1, i) * i - sum(b2, i);
    }

    long rangeSum(int l, int r) {
        return prefix(r) - prefix(l - 1);
    }

    public static void main(String[] args) {
        RangeFenwick f = new RangeFenwick(6);    // all zeros
        f.rangeAdd(2, 5, 3);                     // [0, 3, 3, 3, 3, 0]
        f.rangeAdd(1, 3, 1);                     // [1, 4, 4, 3, 3, 0]
        System.out.println(f.rangeSum(1, 6));
        System.out.println(f.rangeSum(3, 4));
        System.out.println(f.rangeSum(6, 6));
    }
}
```

```output
15
7
0
```

When `r = n`, the `r + 1` updates start at `n + 1`, which is outside the array, so the loop body never runs — correct, because no prefix within the array lies beyond `r`. This is the Fenwick counterpart of a lazy segment tree for add/sum; for anything more complex (range assignment, range minimum with range add), use the segment tree.

## Counting with a Fenwick tree

The most common use in interviews is not summing values but **counting values**. Index the tree by value instead of by position: `tree` then represents a frequency table, `add(v, 1)` records that value `v` was seen, and `prefix(v)` counts how many seen values are `≤ v`.

### Counting inversions

An **inversion** is a pair `i < j` with `a[i] > a[j]`; the count measures how far an array is from sorted. The brute force checks all pairs, O(n²). Scanning left to right with a frequency Fenwick tree, at position `j` there are `j` earlier elements; those `≤ a[j]` are not inversions, and `prefix(rank(a[j]))` counts them. So element `j` contributes `j − prefix(rank(a[j]))` inversions.

Values may be negative or as large as 10⁹, which cannot index an array. **Coordinate compression** replaces each value by its rank among the distinct values (1 for the smallest), preserving order while making indices dense ([[a2-sorting-based]]).

```java title="Inversions.java"
import java.util.Arrays;

public class Inversions {

    /** Number of pairs i < j with a[i] > a[j]. */
    static long countInversions(int[] a) {
        int n = a.length;
        // Coordinate compression: map each value to its rank 1..m.
        int[] sorted = Arrays.stream(a).distinct().sorted().toArray();
        long[] tree = new long[sorted.length + 1];
        long inversions = 0;
        for (int j = 0; j < n; j++) {
            int rank = Arrays.binarySearch(sorted, a[j]) + 1;
            // Earlier elements with rank <= rank(a[j]) are not inversions; the rest are.
            long notGreater = 0;
            for (int i = rank; i > 0; i -= i & -i) notGreater += tree[i];
            inversions += j - notGreater;
            for (int i = rank; i < tree.length; i += i & -i) tree[i]++;
        }
        return inversions;
    }

    public static void main(String[] args) {
        System.out.println(countInversions(new int[] {8, 4, 2, 1}));
        System.out.println(countInversions(new int[] {3, 1, 2, 3, 1}));
        System.out.println(countInversions(new int[] {1_000_000_000, -5, 7}));
    }
}
```

```output
6
5
2
```

A strictly decreasing array of 4 elements has all 4·3/2 = 6 pairs inverted. In `[3, 1, 2, 3, 1]`, equal values are correctly *not* counted, because "not greater" uses `≤`. The total is O(n log n): sorting for compression, then one query and one update per element. Merge sort counts inversions in the same time ([[a3-merge-sort]]); the Fenwick version generalises more easily, for example to *Count of Smaller Numbers After Self* (scan from the right and record each element's count instead of summing).

### Finding the k-th smallest: descending the tree

With a frequency tree, "what is the k-th smallest value seen so far?" asks for the smallest index whose prefix count reaches `k`. Binary search over `prefix` would cost O(log² n). The tree's structure allows O(log n): build the answer position bit by bit from the highest power of two downwards. At each step, try jumping forward by `step`; the cell at `pos + step` covers exactly `a[pos + 1 .. pos + step]`, so if its count is still below `k`, the answer lies beyond — jump and subtract that count from `k`.

```java title="KthFenwick.java"
public class KthFenwick {

    /** Smallest index i with prefix(i) >= k, assuming all values are non-negative. */
    static int lowerBound(long[] tree, long k) {
        int n = tree.length - 1;
        int pos = 0;
        for (int step = Integer.highestOneBit(Math.max(n, 1)); step > 0; step >>= 1) {
            int next = pos + step;
            if (next <= n && tree[next] < k) {  // whole block fits under k: skip past it
                pos = next;
                k -= tree[next];
            }
        }
        return pos + 1;                          // n + 1 means "k exceeds the total"
    }

    public static void main(String[] args) {
        // Multiset of values 1..8 stored as counts: {2, 2, 5, 7, 7, 7}
        long[] tree = new long[9];
        int[] values = {2, 2, 5, 7, 7, 7};
        for (int v : values) for (int i = v; i < tree.length; i += i & -i) tree[i]++;
        for (int k = 1; k <= 6; k++) System.out.print(lowerBound(tree, k) + " ");
        System.out.println();
    }
}
```

```output
2 2 5 7 7 7 
```

Because `pos` only ever has bits higher than `step` set, `pos + step` has lowest bit `step`, so its cell covers precisely the next `step` positions — that is why one cell read per bit suffices. The method requires non-negative counts, since it relies on prefix sums increasing. This turns a Fenwick tree into an **order-statistic** structure over a known value range: running medians, the k-th remaining element after deletions, or ranking in a leaderboard.

## Two dimensions

The same loops nest. A 2D Fenwick tree over a grid supports "add to cell `(r, c)`" and "sum of the rectangle from `(1, 1)` to `(r, c)`" in O(log R · log C), and any rectangle sum follows by inclusion–exclusion — the 2D version of `prefix(r) − prefix(l − 1)`.

```java title="Fenwick2D.java"
public class Fenwick2D {

    private final long[][] tree;   // 1-indexed in both dimensions

    Fenwick2D(int rows, int cols) {
        tree = new long[rows + 1][cols + 1];
    }

    void add(int r, int c, long delta) {
        for (int i = r; i < tree.length; i += i & -i)
            for (int j = c; j < tree[0].length; j += j & -j)
                tree[i][j] += delta;
    }

    /** Sum of the rectangle from (1, 1) to (r, c). */
    long prefix(int r, int c) {
        long s = 0;
        for (int i = r; i > 0; i -= i & -i)
            for (int j = c; j > 0; j -= j & -j)
                s += tree[i][j];
        return s;
    }

    /** Sum of the rectangle (r1, c1)..(r2, c2), inclusive. */
    long rect(int r1, int c1, int r2, int c2) {
        return prefix(r2, c2) - prefix(r1 - 1, c2) - prefix(r2, c1 - 1) + prefix(r1 - 1, c1 - 1);
    }
}
```

This is the structure behind *Range Sum Query 2D – Mutable*. Memory is O(R · C), so it suits grids up to a few thousand on each side.

## In real systems

Fenwick's original paper was about data compression: arithmetic coders need cumulative symbol frequencies that change as the model adapts, which is precisely "prefix sum with point updates". The same need appears wherever a running frequency table must answer "how many values are at most `x`?" while the data keeps changing — leaderboards that report a player's rank, rate limiters or schedulers that keep counts over fixed time slots, and analytics code computing running percentiles over a bounded value range. In application code you will see it less often than in libraries and contest solutions, but where it fits it is usually the smallest, fastest correct structure.

## Trade-offs and alternatives

| Need | Fenwick tree | Segment tree |
|---|---|---|
| Point update + prefix/range sum | Yes, about 10 lines, `n + 1` cells | Yes, more code, about `4n` cells |
| Range add + point query | Yes, over the difference array | Yes, with lazy tags |
| Range add + range sum | Yes, two trees | Yes, lazy propagation |
| Range minimum/maximum with arbitrary updates | No | Yes |
| Prefix maximum when values only increase | Yes (replace `+=` with `max`) | Yes |
| Custom merges (GCD, max subarray) | No | Yes |
| k-th smallest by counts | Yes, O(log n) descent | Yes, O(log n) descent |

The rule of thumb: **if the question is a sum or a count and you can answer ranges by subtracting prefixes, use a Fenwick tree**. The limitation comes from that subtraction. A range minimum cannot be recovered from two prefix minimums, because minimum has no inverse. Prefix minimum or maximum *can* be maintained when updates only move values in one direction (only decrease for minimum, only increase for maximum), which is enough for some DP optimisations such as longest increasing subsequence in O(n log n) ([[a11-lis]]). If the array never changes, a plain prefix-sum array is simpler still; for static range minimum use a sparse table ([[a12-sparse-tables]]).

## Common mistakes

> [!MISTAKE] Passing 0-based indices
> Calling `add(0, v)` on a Fenwick tree loops forever, because `0 & -0` is 0 and `i` never changes. Calling `prefix(i)` with a 0-based index silently omits the last element. Convert once at the boundary — `add(i + 1, v)` — and write the convention in a comment.

**Forgetting `l − 1` in range sums.** `rangeSum(l, r)` is `prefix(r) − prefix(l − 1)`; using `prefix(l)` drops `a[l]`.

**Using `int` storage.** Prefix sums of 10⁵ values up to 10⁹ need `long`.

**Treating it as a prefix-sum array.** `tree[i]` is *not* `a[1] + … + a[i]` except when `i` is a power of two. Reading `tree[i]` directly instead of calling `prefix(i)` gives wrong answers.

**Indexing by raw values.** Values like 10⁹ or negative numbers need coordinate compression before they can index a frequency tree.

**Using the plain tree for range minimum.** It returns a prefix minimum at best; arbitrary ranges need a segment tree or sparse table.

## Interview perspective

> [!INTERVIEW] The explanation interviewers want
> "Cell `i` stores the sum of the block ending at `i` whose length is the lowest set bit of `i`, which `i & -i` extracts. A prefix query clears the lowest bit each step, so it adds one block per set bit; an update adds the lowest bit each step, visiting every block that contains `i`. Both are O(log n)."

Likely questions:

- **What does `i & -i` compute, and why?** The lowest set bit, via two's complement.
- **Fenwick tree or segment tree?** Fenwick for sums and counts; segment tree for min/max with updates or custom merges.
- **How do you support range updates?** Difference array for point queries; two trees for range sums.
- **Count inversions or smaller elements after self.** Coordinate compression plus a frequency tree.
- **How is it built?** By `n` updates in O(n log n), or in O(n) by pushing each cell into `i + lowbit(i)`.
- **2D?** Nested loops; O(log R · log C) per operation.

## Practice

1. **Range Sum Query – Mutable.** Implement it with a Fenwick tree; note that the problem's "update" *sets* a value, so add the difference between the new and old values.
2. **Count of Smaller Numbers After Self.** Compress, then scan from the right with a frequency tree.
3. **Count inversions** and compare your answer with a merge-sort count on random arrays.
4. **Range add, range sum.** Implement the two-tree version and test it against a brute-force array.
5. **k-th smallest in a stream** of insertions and deletions over values 1..10⁵, using the O(log n) descent.
6. **Range Sum Query 2D – Mutable** with a 2D Fenwick tree.

The DSA explorer lists matching problems under this topic.

## Quick revision {#quick-revision}

- 1-indexed array `tree[1..n]`; `tree[i]` = sum of `a[i − lowbit(i) + 1 .. i]`; `lowbit(i) = i & -i`.
- Prefix query: `for (; i > 0; i -= i & -i) s += tree[i];` — one cell per set bit, O(log n).
- Point update: `for (; i <= n; i += i & -i) tree[i] += d;` — every block containing `i`, O(log n).
- Range sum = `prefix(r) − prefix(l − 1)`.
- O(n) build: add each cell into `i + lowbit(i)` in increasing order.
- Range add + point query: tree over the difference array. Range add + range sum: two trees, `prefix(i) = sum(B1, i) · i − sum(B2, i)`.
- Frequency tree over compressed values: inversions, count smaller after self, k-th smallest via bit-by-bit descent.
- 2D: nested loops, O(log R · log C).
- Not for arbitrary range min/max — no inverse; use a segment tree or sparse table.

## Key takeaways {#key-takeaways}

- A Fenwick tree breaks every prefix into blocks whose lengths are the set bits of the index, so a prefix needs one stored block per set bit.
- `i & -i` isolates the lowest set bit; subtracting it walks down a prefix, adding it climbs through every block that contains a position.
- It gives the same O(log n) as a segment tree for sums and counts with a fraction of the code and memory.
- Its reliance on prefix subtraction is both its strength and its limit: sums and counts fit, arbitrary range minimums do not.
- Combined with coordinate compression, it turns counting problems such as inversions and order statistics into O(n log n) scans.
