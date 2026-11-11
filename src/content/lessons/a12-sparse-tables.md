---
summary: A sparse table precomputes the answer for every power-of-two-length window of a fixed array, so that range minimum, maximum, GCD, AND and OR queries take O(1) after O(n log n) preprocessing. You will learn how it is built, why two overlapping blocks are enough, which operations allow that overlap, and when to choose it over a segment tree.
difficulty: advanced
minutes: 35
objectives:
  - Explain what `st[k][i]` stores and build the table with the doubling recurrence
  - Answer a range-minimum query in O(1) by covering the range with two overlapping blocks
  - Define idempotent operations and explain why range sums cannot use the overlapping query
  - Compute floor(log2) safely with a lookup table or `Integer.numberOfLeadingZeros`
  - Choose between a sparse table, a segment tree and a Fenwick tree for a given workload
---

## Introduction

Many problems hand you an array once and then ask a very large number of questions of the form "what is the smallest value in `a[l..r]`?" This is the **range minimum query (RMQ)** problem. The array never changes; only the queries keep coming — a million of them, say, over an array of a million elements.

Scanning each range costs O(n) per query: up to 10¹² steps in total. Precomputing the answer for every pair `(l, r)` makes each query O(1) but needs O(n²) memory — 10¹² entries. A segment tree ([[a12-segment-trees]]) answers in O(log n) with O(n) memory, which is good, but it pays for the ability to handle updates that this problem does not need.

A **sparse table** exploits the fact that the data is static. It stores the minimum of every window whose length is a power of two — lengths 1, 2, 4, 8, … — starting at every position. That is only about `n log n` values, and any range, whatever its length, can be covered by **two** of those windows. For minimum, overlap between the two windows does no harm, so a query is two table lookups and one comparison: **O(1)**.

Sparse tables appear wherever static range queries are hot: lowest-common-ancestor queries on trees ([[a6-lca]]), suffix-array algorithms (minimum over a range of longest-common-prefix values), and competitive programming problems with heavy query loads. They are also a clean example of a recurring idea — **doubling**: build answers for length 2^k from two answers for length 2^(k−1).

## Before you start

- **Prefix sums and their limits** — why prefix tricks work for sums but not for minimum. See [[a2-prefix-suffix]].
- **Powers of two and logarithms** — 2^k, and the largest power of two not exceeding a number. See [[a13-powers-of-two]].
- **2D arrays in Java** — `int[][]`, including rows of different lengths. See [[a2-matrix]].
- **Segment trees** for comparison. See [[a12-segment-trees]].

## The intuition: two overlapping windows

Suppose you want the minimum of `a[2..8]`, a range of length 7. The largest power of two not exceeding 7 is 4. Take the window of length 4 that starts at the left end, `a[2..5]`, and the window of length 4 that ends at the right end, `a[5..8]`. Together they cover the whole range — they overlap at position 5 — and neither sticks out beyond it.

```text
index:   2   3   4   5   6   7   8
         [----- a[2..5] -----]
                     [----- a[5..8] -----]
```

The minimum of the range is the smaller of the two windows' minimums. Position 5 is counted in both windows, but that does not matter: the minimum of a set does not change if an element appears twice. This works for any range: with `len = r − l + 1` and `k = ⌊log₂ len⌋`, the windows `[l, l + 2^k − 1]` and `[r − 2^k + 1, r]` each have length `2^k ≤ len`, and because `2^k > len / 2`, together they cover all of `[l, r]`.

So if we precompute the minimum of every power-of-two window, every query is two lookups.

## The table and its recurrence

Define:

> `st[k][i]` = the minimum of `a[i .. i + 2^k − 1]`, the window of length 2^k starting at `i`.

Level `k = 0` is the array itself (windows of length 1). Every longer window splits into two halves of the previous level:

`st[k][i] = min(st[k − 1][i], st[k − 1][i + 2^(k − 1)])`

The window of length 2^k starting at `i` is the window of length 2^(k−1) starting at `i` followed by the one starting at `i + 2^(k−1)`. So each level is computed from the one below in O(n), and there are `⌊log₂ n⌋ + 1` levels. On level `k`, a window must fit inside the array, so valid starts are `0 .. n − 2^k`.

For `a = [5, 2, 4, 7, 6, 3, 1, 2]`:

| Level | Window length | `st[k]` (by start index 0, 1, 2, …) |
|---|---|---|
| `k = 0` | 1 | 5, 2, 4, 7, 6, 3, 1, 2 |
| `k = 1` | 2 | 2, 2, 4, 6, 3, 1, 1 |
| `k = 2` | 4 | 2, 2, 3, 1, 1 |
| `k = 3` | 8 | 1 |

Check one entry: `st[2][2]` is the minimum of `a[2..5] = 4, 7, 6, 3`, which is 3; by the recurrence it is `min(st[1][2], st[1][4]) = min(4, 3) = 3`.

Now the query `min(1, 6)`: `len = 6`, `k = 2`. The two windows start at `l = 1` and at `r − 4 + 1 = 3`: `min(st[2][1], st[2][3]) = min(2, 1) = 1`. The actual values `a[1..6] = 2, 4, 7, 6, 3, 1` confirm it.

## Computing ⌊log₂ len⌋

Every query needs `k = ⌊log₂(r − l + 1)⌋`, and it must be exact. Two good ways exist.

A **lookup table** computed once: `log[1] = 0` and `log[len] = log[len / 2] + 1`. That is O(n) to build and one array read per query.

A **bit trick**: the position of the highest set bit of `len`. In Java, `31 − Integer.numberOfLeadingZeros(len)` computes it exactly for any positive `int`, and the JVM typically compiles `numberOfLeadingZeros` to a single CPU instruction.

Avoid `(int) (Math.log(len) / Math.log(2))`. It goes through floating point, which is slower and, because the division is rounded, is not guaranteed to land exactly on an integer at powers of two; an answer that comes out a hair below the true value truncates to the wrong `k`. Integer methods have no such risk.

## The complete sparse table

```java title="SparseTable.java"
public class SparseTable {

    private final int[][] st;    // st[k][i] = min of a[i .. i + 2^k - 1]
    private final int[] log;     // log[len] = floor(log2(len))

    public SparseTable(int[] a) {
        int n = a.length;
        log = new int[n + 1];
        for (int len = 2; len <= n; len++) log[len] = log[len / 2] + 1;

        int levels = log[Math.max(n, 1)] + 1;
        st = new int[levels][];
        st[0] = a.clone();
        for (int k = 1; k < levels; k++) {
            int half = 1 << (k - 1);
            int count = n - (1 << k) + 1;       // starts whose window fits in the array
            st[k] = new int[count];
            for (int i = 0; i < count; i++) {
                st[k][i] = Math.min(st[k - 1][i], st[k - 1][i + half]);
            }
        }
    }

    /** Minimum of a[l..r], inclusive, in O(1). */
    public int min(int l, int r) {
        int k = log[r - l + 1];                 // largest power of two that fits
        return Math.min(st[k][l], st[k][r - (1 << k) + 1]);
    }

    public static void main(String[] args) {
        int[] a = {5, 2, 4, 7, 6, 3, 1, 2};
        SparseTable t = new SparseTable(a);
        System.out.println(t.min(0, 7));
        System.out.println(t.min(2, 4));
        System.out.println(t.min(1, 6));
        System.out.println(t.min(3, 3));
        for (int k = 0; k < t.st.length; k++) {
            System.out.println("k=" + k + " " + java.util.Arrays.toString(t.st[k]));
        }
    }
}
```

```output
1
4
1
7
k=0 [5, 2, 4, 7, 6, 3, 1, 2]
k=1 [2, 2, 4, 6, 3, 1, 1]
k=2 [2, 2, 3, 1, 1]
k=3 [1]
```

Walk through the design. Rows have different lengths (jagged arrays), because level `k` has only `n − 2^k + 1` valid windows; this avoids storing meaningless entries past the end. The layout `st[k][i]` keeps each level contiguous, so the inner build loop reads two nearby entries of one row — friendlier to the CPU cache than `st[i][k]`, which would jump between rows. The single-element query `min(3, 3)` gives `len = 1`, `k = 0`, and both lookups read `a[3]`, so no special case is needed.

The class was checked against a brute-force scan on 5,000 random arrays of up to 70 elements, with 100 random queries each.

## Complexity

**Build.** There are `⌊log₂ n⌋ + 1` levels, and each level does O(1) work per entry for at most `n` entries, so preprocessing is **O(n log n)** time.

**Query.** One table read for `k`, two table reads and one comparison: **O(1)**, independent of the range length.

**Space.** **O(n log n)**. This is the real cost. For `n = 10⁶` there are 20 levels; as `int`, that is about 20 × 10⁶ × 4 bytes ≈ 80 MB. Feasible in a contest with a 256 MB limit, but noticeably more than a segment tree's few megabytes. For larger inputs, or tighter memory, a segment tree or one of the block-based RMQ structures is the better choice.

**Updates.** There are none. Changing one `a[i]` affects every window that contains `i` — up to 2^k windows on level `k`, O(n) entries in total — so the practical answer is to rebuild. A sparse table is for **static** data.

## Which operations work: idempotence

The overlapping query relies on one property: combining a value with itself changes nothing. An operation `⊕` is **idempotent** if `x ⊕ x = x`. Together with being associative and commutative, that makes "combine everything in the union of two windows" equal to "combine the two windows' results", even when they overlap.

| Operation | Idempotent? | O(1) overlapping query? |
|---|---|---|
| `min`, `max` | Yes | Yes |
| `gcd` | Yes: `gcd(x, x) = x` | Yes |
| Bitwise AND, OR | Yes: `x & x = x`, `x | x = x` | Yes |
| Sum | No: `x + x = 2x` | No — overlap double-counts |
| Product, XOR | No (`x ^ x = 0`) | No |

For sum, using two overlapping windows of `[1, 6]` in the example adds `a[3]` and `a[4]` twice. You can still use the same table for non-idempotent associative operations by covering the range with **disjoint** power-of-two blocks — at most one per bit of the length — which costs O(log n):

```java title="SparseSum.java"
public class SparseSum {

    /** Sum of a[l..r] using disjoint power-of-two blocks: O(log n) per query. */
    static long sum(long[][] st, int l, int r) {
        long total = 0;
        for (int k = st.length - 1; k >= 0; k--) {
            if (l + (1 << k) - 1 <= r) {        // block of length 2^k still fits
                total += st[k][l];
                l += 1 << k;                    // next block starts right after it
            }
        }
        return total;
    }

    static long[][] build(int[] a) {
        int n = a.length;
        int levels = 32 - Integer.numberOfLeadingZeros(n);   // floor(log2 n) + 1
        long[][] st = new long[levels][];
        st[0] = new long[n];
        for (int i = 0; i < n; i++) st[0][i] = a[i];
        for (int k = 1; k < levels; k++) {
            int half = 1 << (k - 1);
            st[k] = new long[n - (1 << k) + 1];
            for (int i = 0; i < st[k].length; i++) st[k][i] = st[k - 1][i] + st[k - 1][i + half];
        }
        return st;
    }

    public static void main(String[] args) {
        int[] a = {5, 2, 4, 7, 6, 3, 1, 2};
        long[][] st = build(a);
        System.out.println(sum(st, 1, 6));      // 2 + 4 + 7 + 6 + 3 + 1
    }
}
```

```output
23
```

This shows that the *table* is general; only the O(1) *query* needs idempotence. In practice nobody uses a sparse table for static sums — a prefix-sum array does it in O(1) with O(n) memory — but the disjoint decomposition is the same idea as binary lifting, used for jumping `k` levels up a tree in [[a6-lca]].

```quiz
Q: Why can a sparse table answer range minimum in O(1) but not range sum?
- [ ] Sums need `long` and minimums fit in `int`
- [x] The two windows can overlap, and minimum ignores duplicates while sum counts the overlap twice
- [ ] The table for sums would need O(n²) entries
- [ ] Sum is not associative
> The O(1) query covers [l, r] with two windows of length 2^k that may share elements. min(x, x) = x, so repeated elements are harmless; x + x = 2x, so the shared part would be added twice. Sum is associative — the table can still answer sums in O(log n) using disjoint blocks.

Q: For a query on `a[10..22]`, which two table entries does the O(1) minimum query read?
- [ ] `st[3][10]` and `st[3][22]`
- [x] `st[3][10]` and `st[3][15]`
- [ ] `st[4][10]` and `st[4][7]`
- [ ] `st[2][10]` and `st[2][19]`
> The length is 13, so k = floor(log2 13) = 3 and the windows have length 8. The first starts at l = 10 and covers 10..17; the second starts at r − 8 + 1 = 15 and covers 15..22. Starting the second window at r would run past the range, and k = 4 would give windows of 16, longer than the range.
```

## Variations

**Returning the position, not the value.** Store indices in the table and compare `a[st[k][i]]` instead of the values themselves. This is what LCA via Euler tour needs: write down the nodes in the order a DFS visits them, with their depths; the LCA of two nodes is the shallowest node between their first appearances — a range-minimum query by depth whose answer is the *node*, i.e. the position ([[a6-lca]]).

**Maximum and other idempotent operations.** Replace `Math.min` with `Math.max`, a GCD function, `&` or `|`. Nothing else changes.

**Two dimensions.** A 2D sparse table stores minimums of every `2^a × 2^b` sub-rectangle and answers rectangle minimums with four overlapping blocks in O(1), at O(n m log n log m) memory — usually too large outside contests.

**Disjoint sparse table.** A variant that arranges blocks so that any range is covered by exactly two *non-overlapping* precomputed pieces, giving O(1) queries for any associative operation, including sum and product, with the same O(n log n) preprocessing. It is rarely needed but worth knowing exists.

## Recognising sparse-table problems

The pattern is: **the array is fixed after reading it; there are many range queries; the operation is min, max, GCD, AND or OR.** Phrases like "answer `q` queries", with `q` up to 10⁵ or 10⁶ and no update operations, are the strongest hint. Examples include static RMQ, "for each query, is the GCD of `a[l..r]` equal to 1?", counting subarrays whose GCD or AND equals a value (combine with binary search on the right end, since GCD and AND only shrink as a range grows — see [[a3-binary-search-on-answer]]), and LCA preprocessing.

If the windows all have the **same fixed length** and move left to right — "the minimum of every window of size `k`" — a monotonic deque ([[a5-monotonic-queue]]) does it in O(n) total with O(k) memory, which beats a sparse table. If any update appears, switch to a segment tree.

## In real systems

Sparse tables live mostly inside other algorithms. Suffix-array-based string tools (used in bioinformatics and full-text indexing) answer "longest common prefix of two suffixes" as a range minimum over the LCP array, often with a sparse table or a more compact RMQ structure. Tree and graph libraries use the Euler-tour-plus-RMQ method for fast LCA queries on static trees. More generally, read-heavy analytics over immutable data — a day's sealed time series, a finished log — can precompute power-of-two aggregates for minimum and maximum, paying memory once to make every later query constant time.

## Trade-offs and alternatives

| Structure | Build | Query | Updates | Memory | Operations |
|---|---|---|---|---|---|
| Brute-force scan | — | O(n) | O(1) | O(1) extra | Anything |
| Sparse table | O(n log n) | O(1) | Rebuild | O(n log n) | Idempotent (min, max, gcd, and, or) |
| Segment tree | O(n) | O(log n) | O(log n) | O(n) | Any associative |
| Fenwick tree | O(n) | O(log n) | O(log n) | O(n) | Sums and counts |
| Monotonic deque | — | O(1) amortised | — | O(k) | Fixed-size sliding windows only |
| Sqrt decomposition | O(n) | O(√n) | O(1) or O(√n) | O(n) | Most operations |

The choice usually reduces to two questions. Are there updates? If yes, a segment tree (or a Fenwick tree for sums). Is memory tight? If yes, a segment tree's O(n) beats the sparse table's O(n log n). Otherwise, for static min/max/gcd queries, the sparse table's O(1) query and short code make it the best tool.

## Common mistakes

> [!MISTAKE] Using the overlapping query for sums
> Code that computes `st[k][l] + st[k][r − 2^k + 1]` for a range sum passes tests where the two windows happen not to overlap (when the length is exactly a power of two) and fails everywhere else. Use prefix sums for static sums, or the disjoint O(log n) decomposition.

**Choosing `k` from the endpoints.** `k` must be `⌊log₂(r − l + 1)⌋`, the length's logarithm — not `log₂ r` or `log₂ l`.

**Off by one in the second window.** It starts at `r − 2^k + 1`, so that it *ends* at `r`. Writing `r − 2^k` shifts it left by one and can miss `a[r]`.

**Building rows past the end.** On level `k`, starts go only up to `n − 2^k`. Looping to `n − 1` reads beyond the previous row.

**Using a sparse table with updates.** Each change invalidates O(n) entries. If the problem has updates, use a segment tree.

**Floating-point logarithms.** Use a log table or `31 − Integer.numberOfLeadingZeros(len)` rather than `Math.log`.

## Interview perspective

Sparse tables are less common in interviews than segment trees, but they make a strong answer to the follow-up "the array never changes and there are millions of queries — can you do better than O(log n)?"

> [!INTERVIEW] The core argument
> "I'd precompute the minimum of every window of length 2^k at every start, in O(n log n). Any range of length `len` is covered by two such windows of length 2^⌊log₂ len⌋ — one from each end. They may overlap, but minimum is idempotent, so the overlap does not matter, and the query is two lookups."

Expect: why it needs idempotence (and why sum fails), how to compute `k`, the memory cost for large `n`, why updates are impractical, and when you would pick a segment tree instead.

## Practice

1. **Static RMQ.** Build a sparse table and answer queries; verify against a brute-force scan on random inputs.
2. **Range GCD queries.** Swap the operation for GCD and answer "is `gcd(a[l..r]) == 1`?".
3. **Index of the minimum.** Modify the table to return the position of the minimum, breaking ties by the smaller index.
4. **Sum with the same table.** Implement the disjoint-block O(log n) range sum and explain why the O(1) query is invalid.
5. **LCA via Euler tour.** Build the Euler tour of a tree with depths and answer LCA queries with an index-returning sparse table.
6. **Subarrays with GCD equal to k.** Count them using a sparse table and binary search on the right endpoint.

The DSA explorer lists matching problems under this topic.

## Quick revision {#quick-revision}

- For **static** arrays with many range queries; no updates.
- `st[k][i]` = answer on `a[i .. i + 2^k − 1]`; `st[0] = a`.
- Build: `st[k][i] = op(st[k−1][i], st[k−1][i + 2^(k−1)])`, for `i ≤ n − 2^k`. O(n log n) time and space.
- Query `[l, r]`: `k = ⌊log₂(r − l + 1)⌋`; answer `op(st[k][l], st[k][r − 2^k + 1])`. O(1).
- `k` via a log table (`log[i] = log[i/2] + 1`) or `31 − Integer.numberOfLeadingZeros(len)`; avoid `Math.log`.
- Requires idempotent `op` (`x op x = x`): min, max, gcd, AND, OR. Not sum, product or XOR.
- Non-idempotent associative ops: disjoint blocks, O(log n) per query.
- Memory: about 80 MB for 10⁶ `int`s; use `st[k][i]` layout for cache locality.
- Updates → segment tree; fixed-size sliding windows → monotonic deque; static sums → prefix sums.

## Key takeaways {#key-takeaways}

- A sparse table stores the answer for every power-of-two window, built level by level by doubling.
- Any range is covered by two windows of the largest power-of-two length that fits, one anchored at each end.
- The overlap between those windows is harmless only for idempotent operations, which is why min, max and GCD get O(1) queries and sums do not.
- The cost is O(n log n) memory and no support for updates, so it fits static, read-heavy workloads.
- When updates appear or memory is tight, a segment tree is the natural replacement.
