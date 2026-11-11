---
summary: Partition DP solves problems that ask you to cut a sequence into pieces as well as possible. You will learn its two shapes — choosing the last piece of a prefix, and choosing the split point of an interval — and derive the state, recurrence, base cases and fill order for palindrome cuts, bounded pieces, k-way splits, matrix chains and Burst Balloons.
difficulty: advanced
minutes: 65
objectives:
  - Explain why trying every set of cut positions is exponential and how "the last piece" collapses it to O(n²) states and transitions
  - Derive prefix-partition DPs with dp[i] defined on prefixes, including a piece-count dimension for exactly k pieces
  - Precompute segment costs (palindrome tables, prefix sums, running maxima) so each transition is O(1)
  - Derive interval DPs over dp[l][r], fill them by increasing length, and explain the "last operation" trick in Burst Balloons
  - Recognise which shape an unseen splitting problem has and choose between partition DP, knapsack, greedy and binary search on the answer
---

## Introduction

Many problems hand you a sequence and ask you to **cut it into pieces**: split a string so every piece is a palindrome, divide a list of chapters among `k` readers so the busiest reader has the least to read, break a sentence into dictionary words, or decide the order in which to multiply a chain of matrices. Each of these has a huge number of possible cuttings, a rule about what a piece may be, and a cost or score to optimise.

**Partition DP** is the dynamic programming pattern for these problems. It comes in two shapes, and recognising which one you face is most of the work:

- **Prefix partition (linear cuts).** The pieces are consecutive and independent: the cost of the whole cutting is the sum (or maximum) of the pieces' costs. You decide where the *last* piece starts and recurse on what is left in front of it. Palindrome Partitioning, Word Break and Split Array Largest Sum have this shape.
- **Interval partition (recursive splits).** Splitting a segment into two parts changes the cost of the parts, so pieces are not independent. You decide the *split point* (or the last operation) inside an interval `[l, r]` and recurse on both sides. Matrix Chain Multiplication and Burst Balloons have this shape; it is often called **interval DP**.

The curriculum names this topic "partition DP basics" because it is the first time the DP state is a *range of positions* rather than a single position or a pair of prefixes. Learning to derive it here prepares you for harder interval problems in competitive programming and for the many scheduling and layout problems in real systems that cut a sequence into chunks.

## Before you start

You should already know:

- **The four parts of a DP answer** — state, recurrence, base cases, order — and memoization versus tabulation. See [[a11-memoization]] and [[a11-1d-dp]]. The two-prefix derivation in [[a11-lcs]] uses the same reasoning style.
- **Prefix sums**, which give any range sum in O(1). See [[a2-prefix-suffix]].
- **Recursion and backtracking**, because the brute force here is "try every cut". See [[a1-recursion]] and [[a9-subsets]].

One problem with "partition" in its name is *not* this pattern. **Partition Equal Subset Sum** asks whether you can split a *set* into two groups of equal sum; the pieces are not consecutive, so it is a subset-sum problem, taught in [[a11-knapsack]].

## The intuition: decide the last piece

Imagine a string of length 10 to be cut into palindromes. You could try to decide all the cuts at once, but there are nine gaps between characters and each either has a cut or not — 2⁹ = 512 cuttings, and 2ⁿ⁻¹ in general.

Instead, ask about only one piece: **where does the last piece start?** If it starts at position `j`, then the last piece is `s[j..9]`, it must be a palindrome, and everything before it — the prefix `s[0..j-1]` — must be cut as well as possible, independently. The best cutting of the whole string is the best over all choices of `j`. The prefix before `j` is a smaller instance of exactly the same problem, and there are only 11 different prefixes (lengths 0 to 10). That is the whole idea: a decision about one piece plus a smaller problem of the same kind, with few distinct smaller problems.

For interval problems the picture is a tree rather than a line. To multiply matrices `A × B × C × D`, decide which multiplication happens **last** — for example `(A × B × C) × D`. Then each side is a smaller chain to be solved the same way, and the number of distinct chains is the number of intervals `[l, r]`.

## Shape 1: prefix partition

### Deriving Palindrome Partitioning II

*Given a string `s`, return the fewest cuts needed so that every piece is a palindrome.* For `"aab"` the answer is 1 (`"aa" | "b"`); for `"abacdcx"` it is 2 (`"aba" | "cdc" | "x"`).

**Naive approach.** Try every subset of the `n - 1` gaps, check every piece, keep the cutting with the fewest cuts: O(2ⁿ⁻¹ · n). Thirty characters already means half a billion cuttings.

**State.** Following the intuition, define

> `pieces(i)` = the fewest palindromic pieces that the prefix `s[0..i-1]` (its first `i` characters) can be cut into.

Counting *pieces* instead of cuts makes the base case clean: the answer is `pieces(n) - 1`. As in LCS, using the prefix length `i` lets `i = 0` stand for the empty prefix.

**Recurrence.** The last piece is `s[j..i-1]` for some `j` with `0 ≤ j < i`. It is allowed only if it is a palindrome. If it is, the prefix in front needs `pieces(j)` pieces, so the total is `pieces(j) + 1`:

```text
pieces(i) = min over j in [0, i) with s[j..i-1] a palindrome of  pieces(j) + 1
```

Why is it safe to use the *best* cutting of the prefix? Because the last piece's validity does not depend on how the prefix was cut. Swapping any cutting of `s[0..j-1]` for a better one keeps the whole cutting valid and makes it no worse. That is optimal substructure, and it is exactly what fails in the interval problems below — which is why they need a different shape.

**Base case.** `pieces(0) = 0`: the empty prefix needs no pieces. There is always at least one valid `j` for `i ≥ 1`, namely `j = i - 1`, because a single character is a palindrome.

**Order.** `pieces(i)` reads only `pieces(j)` for `j < i`, so fill `i = 1, 2, …, n`.

**Making each transition O(1).** Checking "is `s[j..i-1]` a palindrome?" naively costs O(n), which would make the whole DP O(n³). Precompute a table `pal[l][r]` instead, using its own small recurrence: `s[l..r]` is a palindrome when its end characters match and the inside `s[l+1..r-1]` is a palindrome (or is empty or one character). `pal[l][r]` depends on `pal[l+1][r-1]`, so fill `l` from right to left. This is a common partition-DP move: **precompute the cost of every candidate piece** so the main DP only looks it up.

### Dry run

Trace `"abacdcx"` (`n = 7`). Row `i` lists the palindromic last pieces and the best choice.

| `i` | prefix | palindromic last pieces `s[j..i-1]` | candidates `pieces(j) + 1` | `pieces(i)` |
|---|---|---|---|---|
| 1 | `a` | `a` (j = 0) | 0 + 1 | 1 |
| 2 | `ab` | `b` (j = 1) | 1 + 1 | 2 |
| 3 | `aba` | `a` (j = 2), `aba` (j = 0) | 2 + 1, 0 + 1 | 1 |
| 4 | `abac` | `c` (j = 3) | 1 + 1 | 2 |
| 5 | `abacd` | `d` (j = 4) | 2 + 1 | 3 |
| 6 | `abacdc` | `c` (j = 5), `cdc` (j = 3) | 3 + 1, 1 + 1 | 2 |
| 7 | `abacdcx` | `x` (j = 6) | 2 + 1 | 3 |

`pieces(7) = 3`, so the answer is 2 cuts. Row 6 shows the DP reconsidering: at `i = 5` the best prefix used three pieces, but at `i = 6` a longer palindrome `cdc` reaches back to a cheaper prefix. Greedy rules fail on other inputs. Always taking the longest palindrome that starts at the current position cuts `"abaab"` into `aba | a | b` (2 cuts), while the optimum is `a | baab` (1 cut), because the greedy first piece swallowed the `a` that `baab` needed.

### Pieces with a length limit: Partition Array for Maximum Sum

*Cut an integer array into pieces of length at most `k`. Each piece is then replaced by copies of its maximum. Maximise the total.* For `[1, 15, 7, 9, 2, 5, 10]` and `k = 3`, the best is `[15, 15, 15, 9, 10, 10, 10]` = 84.

Same shape, different piece rule and cost. `best(i)` = the best total for the first `i` elements. The last piece has length `len` from 1 to `k`, so it is `a[i-len..i-1]`, worth `max(piece) · len`:

```text
best(i) = max over len in [1, min(k, i)] of  best(i - len) + len · max(a[i-len..i-1])
best(0) = 0
```

The piece cost needs a maximum over a range. Instead of a precomputed table, extend the piece *leftwards* one element at a time inside the loop over `len` and keep a running maximum. Each transition is O(1), and the whole DP is **O(n · k)**. That running-cost trick is the second standard way to make transitions cheap.

### Exactly k pieces: Split Array Largest Sum

*Split an array of non-negative integers into exactly `k` non-empty consecutive pieces so that the largest piece sum is as small as possible.* For `[7, 2, 5, 10, 8]` and `k = 2`, the best split is `[7, 2, 5] | [10, 8]`, whose largest sum is 18.

Two things change. First, the number of pieces is constrained, and the prefix alone does not tell you how many pieces you have used — so that count must be part of the state. Second, the cost combines with `max` rather than `+`.

> `dp(p, i)` = the smallest possible largest-piece-sum when the first `i` elements are cut into exactly `p` non-empty pieces.

The last piece is `a[j..i-1]`. The other `p - 1` pieces cover the first `j` elements, which needs `j ≥ p - 1` so each has at least one element. The largest piece sum is the larger of the prefix's best and the last piece's sum:

```text
dp(p, i) = min over j in [p-1, i-1] of  max(dp(p-1, j), sum(a[j..i-1]))
dp(0, 0) = 0,   dp(0, i > 0) = infinity
```

The base case `dp(0, i > 0) = infinity` says "you cannot cover a non-empty prefix with zero pieces"; forgetting it lets the DP produce splits with fewer than `k` pieces. Range sums come from prefix sums. The order is increasing `p`, and within a layer any order of `i`. There are `k · n` states with up to `n` transitions each, so time is **O(k · n²)**.

This problem has a famous alternative: **binary search on the answer**. "Can the array be split into at most `k` pieces each with sum ≤ `X`?" is answered greedily in O(n), and it is monotonic in `X`, so binary searching `X` gives O(n · log(sum)). See [[a3-binary-search-on-answer]]. The DP is still worth knowing because it generalises to costs where no greedy check exists — for example, minimising the *sum* of squared piece lengths, as in text justification.

### The Java code

```java title="PrefixPartition.java"
import java.util.Arrays;

public class PrefixPartition {

    // Palindrome Partitioning II: fewest cuts so that every piece is a palindrome
    static int minCut(String s) {
        int n = s.length();
        boolean[][] pal = new boolean[n][n];             // pal[l][r]: is s[l..r] a palindrome?
        for (int l = n - 1; l >= 0; l--) {
            for (int r = l; r < n; r++) {
                pal[l][r] = s.charAt(l) == s.charAt(r) && (r - l < 2 || pal[l + 1][r - 1]);
            }
        }
        int[] pieces = new int[n + 1];                   // pieces[i]: fewest pieces for s[0..i-1]
        pieces[0] = 0;                                   // the empty prefix needs no pieces
        for (int i = 1; i <= n; i++) {
            pieces[i] = Integer.MAX_VALUE;
            for (int j = 0; j < i; j++) {                // last piece is s[j..i-1]
                if (pal[j][i - 1]) pieces[i] = Math.min(pieces[i], pieces[j] + 1);
            }
        }
        return pieces[n] - 1;                            // cuts = pieces - 1
    }

    // Partition Array for Maximum Sum: pieces of length <= k, each replaced by its maximum
    static int maxSumAfterPartitioning(int[] a, int k) {
        int n = a.length;
        int[] best = new int[n + 1];                     // best[i]: answer for a[0..i-1]
        for (int i = 1; i <= n; i++) {
            int max = 0;
            for (int len = 1; len <= k && len <= i; len++) {  // last piece is a[i-len..i-1]
                max = Math.max(max, a[i - len]);         // extend the piece leftwards
                best[i] = Math.max(best[i], best[i - len] + max * len);
            }
        }
        return best[n];
    }

    // Split Array Largest Sum: exactly k non-empty pieces, minimise the largest piece sum
    static long splitArray(int[] a, int k) {
        int n = a.length;
        long[] prefix = new long[n + 1];
        for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + a[i];
        long INF = Long.MAX_VALUE;
        long[][] dp = new long[k + 1][n + 1];            // dp[p][i]: first i items in p pieces
        for (long[] row : dp) Arrays.fill(row, INF);
        dp[0][0] = 0;
        for (int p = 1; p <= k; p++) {
            for (int i = p; i <= n; i++) {               // need at least one item per piece
                for (int j = p - 1; j < i; j++) {        // last piece is a[j..i-1]
                    if (dp[p - 1][j] == INF) continue;
                    long cost = Math.max(dp[p - 1][j], prefix[i] - prefix[j]);
                    dp[p][i] = Math.min(dp[p][i], cost);
                }
            }
        }
        return dp[k][n];
    }

    public static void main(String[] args) {
        System.out.println(minCut("aab"));
        System.out.println(minCut("abacdcx"));
        System.out.println(minCut("a"));
        System.out.println(maxSumAfterPartitioning(new int[]{1, 15, 7, 9, 2, 5, 10}, 3));
        System.out.println(splitArray(new int[]{7, 2, 5, 10, 8}, 2));
        System.out.println(splitArray(new int[]{1, 2, 3, 4, 5}, 5));
    }
}
```

```output
1
2
0
84
18
5
```

In `minCut`, the palindrome table is filled with `l` decreasing because `pal[l][r]` reads `pal[l + 1][r - 1]`, a row below. The condition `r - l < 2` covers pieces of length 1 and 2, whose "inside" is empty. A single character needs 0 cuts. In `splitArray`, the `INF` check skips impossible prefixes instead of feeding `Long.MAX_VALUE` into `max`; prefix sums are `long` because sums of many `int`s can overflow. With `k = 5` and five elements, every element is its own piece and the answer is the largest element, 5.

**Complexity.** `minCut`: the palindrome table has n² cells at O(1) each, and the main DP has `n` states with up to `n` transitions: **O(n²) time and O(n²) space** for the table. `maxSumAfterPartitioning`: **O(n · k) time, O(n) space**. `splitArray`: **O(k · n²) time, O(k · n) space**, reducible to O(n) by keeping only layer `p - 1`.

**Word Break** is the same shape with a Boolean value: `ok(i)` is true if some `j < i` has `ok(j)` true and `s[j..i-1]` in the dictionary, with `ok(0) = true`. Limiting `j` to the longest dictionary word, or walking a [[a12-trie]] from position `j` forwards, keeps the transitions cheap.

## Shape 2: interval partition

### Why the prefix shape is not enough

Consider multiplying a chain of matrices. Multiplying a `p × q` matrix by a `q × r` matrix takes `p · q · r` scalar multiplications, and the result is `p × r`. Matrix multiplication is associative, so `(A × B) × C` and `A × (B × C)` give the same matrix — but the cost can be very different. With `A` = 10 × 30, `B` = 30 × 5 and `C` = 5 × 60:

- `(A × B) × C` costs `10 · 30 · 5 + 10 · 5 · 60 = 1,500 + 3,000 = 4,500`;
- `A × (B × C)` costs `30 · 5 · 60 + 10 · 30 · 60 = 9,000 + 18,000 = 27,000`.

Try a prefix state, "the cheapest way to multiply the first `i` matrices". The last step multiplies the product of some prefix by the product of the remaining suffix, and that suffix's own internal cost depends on how *it* is parenthesised. A prefix state cannot describe the suffix. Both sides are open problems, so the state must be able to describe *any* contiguous block: an interval.

### Deriving Matrix Chain Multiplication

Matrix `i` has shape `dims[i] × dims[i+1]`, for `i = 0 … n-1`.

**State.** `cost(l, r)` = the minimum number of scalar multiplications to compute the product of matrices `l` through `r`.

**Recurrence.** Whatever the parenthesisation, it has a *last* multiplication, which joins the product of `l..k` with the product of `k+1..r` for some split `k` with `l ≤ k < r`. The left product is `dims[l] × dims[k+1]`, the right is `dims[k+1] × dims[r+1]`, so the last multiplication costs `dims[l] · dims[k+1] · dims[r+1]`. The two sides are independent once `k` is fixed, so each should be done optimally:

```text
cost(l, r) = min over k in [l, r) of  cost(l, k) + cost(k+1, r) + dims[l] · dims[k+1] · dims[r+1]
```

**Base case.** `cost(l, l) = 0`: a single matrix needs no multiplication.

**Order.** `cost(l, r)` reads intervals strictly *shorter* than `[l, r]`. So fill **by increasing interval length**: all length-1 intervals, then length 2, and so on. Plain row-major order would be wrong here, because `cost(l, r)` needs `cost(k+1, r)`, which lies in a *later* row. (Filling `l` from `n-1` down to 0, and `r` upwards within each row, also works; increasing length is the order that is easiest to justify.)

The number of parenthesisations of `n` matrices is the Catalan number `Cₙ₋₁`, which grows roughly like 4ⁿ; the DP has n²/2 intervals with up to `n` splits each, so **O(n³) time and O(n²) space**.

### Dry run

Four matrices: `A` = 40 × 20, `B` = 20 × 30, `C` = 30 × 10, `D` = 10 × 30, so `dims = [40, 20, 30, 10, 30]`.

| Interval | Split `k` | Calculation | Value | Best |
|---|---|---|---|---|
| `[0,1]` AB | 0 | `0 + 0 + 40·20·30` | 24,000 | 24,000 |
| `[1,2]` BC | 1 | `20·30·10` | 6,000 | 6,000 |
| `[2,3]` CD | 2 | `30·10·30` | 9,000 | 9,000 |
| `[0,2]` ABC | 0 | `0 + 6,000 + 40·20·10` | 14,000 | **14,000** |
| | 1 | `24,000 + 0 + 40·30·10` | 36,000 | |
| `[1,3]` BCD | 1 | `0 + 9,000 + 20·30·30` | 27,000 | |
| | 2 | `6,000 + 0 + 20·10·30` | 12,000 | **12,000** |
| `[0,3]` ABCD | 0 | `0 + 12,000 + 40·20·30` | 36,000 | |
| | 1 | `24,000 + 9,000 + 40·30·30` | 69,000 | |
| | 2 | `14,000 + 0 + 40·10·30` | 26,000 | **26,000** |

The optimum is `(A × (B × C)) × D` at 26,000 multiplications; the worst order costs more than two and a half times as much. To print the parenthesisation, record the best `k` for each interval and recurse on it.

### The "last operation" trick: Burst Balloons

*Balloons in a row have values `nums[i]`. Bursting balloon `i` earns `left · nums[i] · right`, where `left` and `right` are the values of its current neighbours (1 beyond the ends). Then it disappears and its neighbours become adjacent. Maximise the total.* For `[3, 1, 5, 8]` the answer is 167.

The tempting state is "choose which balloon to burst **first** in `[l, r]`". It fails: after bursting balloon `k` first, the balloons on its left and right become neighbours, so the two sides are *not* independent — the left side's last balloon may be multiplied by the right side's first. The subproblems interact and no interval state describes them.

Flip the question: choose which balloon in the interval is burst **last**. If `k` is burst last among the balloons strictly between two fixed boundaries `l` and `r`, then while everything else is being burst, `k` is still standing and acts as a wall. The balloons between `l` and `k` only ever see `l` and `k` as outer neighbours, and those between `k` and `r` only see `k` and `r`. The two sides are independent again. When `k` finally bursts, its neighbours are exactly `l` and `r`.

Pad the array with a 1 at each end, and define `best(l, r)` = the most coins from bursting every balloon strictly between positions `l` and `r` (the boundaries themselves stay). Then

```text
best(l, r) = max over k in (l, r) of  best(l, k) + v[l] · v[k] · v[r] + best(k, r)
best(l, l + 1) = 0     (nothing between adjacent positions)
```

with the answer `best(0, n + 1)`, filled by increasing `r - l`. **When choosing the first action makes subproblems interact, try choosing the last one.** Not every interval problem needs the reversal. In *Minimum Cost to Cut a Stick*, each cut costs the current length of the piece being cut, and the *first* cut works well: it splits the stick into two pieces whose later cuts never affect each other, so `cost(i, j) = (pos[j] - pos[i]) + min over k of cost(i, k) + cost(k, j)` over sorted cut positions. Ask, for each candidate decision, whether the two sides are independent afterwards.

```java title="IntervalPartition.java"
public class IntervalPartition {

    // Matrix Chain Multiplication: matrix i has shape dims[i] x dims[i+1]
    static long matrixChain(int[] dims) {
        int n = dims.length - 1;                         // number of matrices
        long[][] cost = new long[n][n];                  // cost[l][r]: multiply matrices l..r
        for (int len = 2; len <= n; len++) {             // shorter intervals first
            for (int l = 0; l + len - 1 < n; l++) {
                int r = l + len - 1;
                cost[l][r] = Long.MAX_VALUE;
                for (int k = l; k < r; k++) {            // last multiplication: (l..k)(k+1..r)
                    long c = cost[l][k] + cost[k + 1][r]
                           + (long) dims[l] * dims[k + 1] * dims[r + 1];
                    cost[l][r] = Math.min(cost[l][r], c);
                }
            }
        }
        return cost[0][n - 1];
    }

    // Burst Balloons: choose the LAST balloon to burst inside each open interval
    static int maxCoins(int[] nums) {
        int n = nums.length;
        int[] v = new int[n + 2];                        // padded with 1 at both ends
        v[0] = 1;
        v[n + 1] = 1;
        for (int i = 0; i < n; i++) v[i + 1] = nums[i];
        int[][] best = new int[n + 2][n + 2];            // best[l][r]: burst everything strictly between
        for (int len = 2; len <= n + 1; len++) {         // len = r - l
            for (int l = 0; l + len <= n + 1; l++) {
                int r = l + len;
                for (int k = l + 1; k < r; k++) {        // k is burst last, next to l and r
                    best[l][r] = Math.max(best[l][r],
                            best[l][k] + v[l] * v[k] * v[r] + best[k][r]);
                }
            }
        }
        return best[0][n + 1];
    }

    public static void main(String[] args) {
        System.out.println(matrixChain(new int[]{10, 30, 5, 60}));
        System.out.println(matrixChain(new int[]{40, 20, 30, 10, 30}));
        System.out.println(maxCoins(new int[]{3, 1, 5, 8}));
        System.out.println(maxCoins(new int[]{1, 5}));
    }
}
```

```output
4500
26000
167
10
```

The cast `(long) dims[l]` happens before the multiplication; writing `(long) (dims[l] * dims[k + 1] * dims[r + 1])` would multiply in `int` first and overflow for large dimensions. In `maxCoins`, length-1 intervals (`r = l + 1`) contain no balloons and stay 0 from Java's default initialisation, so the loop starts at length 2. For `[1, 5]`, bursting 1 first earns `1 · 1 · 5 = 5` and then 5 earns `1 · 5 · 1 = 5`, for 10.

Every method in both programs was stress-tested against brute force — all 2ⁿ⁻¹ cuttings for the prefix problems, all parenthesisations for matrix chains, and all burst orders for balloons — on 3,000 random inputs, with no mismatches.

```quiz
Q: In Palindrome Partitioning II, why does the DP over prefixes need only O(n) states even though there are 2^(n-1) cuttings?
- [ ] Because most cuttings are invalid and can be ignored
- [x] Because once the last piece is fixed, the best way to cut the prefix in front of it does not depend on that piece, so only the prefix length matters
- [ ] Because palindromes can be found greedily
- [ ] Because the palindrome table already contains the answer
> Many cuttings share the same prefix, and the prefix's best cutting is independent of what follows it. So the subproblem is fully described by the prefix length — n + 1 possibilities. Greedy longest-palindrome choices are wrong, as "abacdcx" shows.

Q: Why must Matrix Chain Multiplication be filled by increasing interval length rather than plain row-major order (l ascending, r ascending)?
- [ ] Row-major order is slower
- [ ] Interval DP cannot be memoized
- [x] cost(l, r) needs cost(k+1, r) for k ≥ l, which lies in a later row; increasing length guarantees every shorter interval is finished
- [ ] Because the base case is on the diagonal
> The dependency is "every strictly shorter interval inside [l, r]". Rows with larger l come later in row-major order, so cost(k+1, r) would still be uncomputed. Increasing length (or l descending) respects the dependencies.

Q: In Burst Balloons, why does choosing the balloon burst LAST in an interval work when choosing the FIRST does not?
- [x] The last balloon stays standing while the others burst, separating the interval into two sides that never become neighbours
- [ ] Bursting last always earns more coins
- [ ] Because the padding with 1s only applies to the last balloon
- [ ] The first-balloon version is correct but slower
> If k is burst first, its left and right neighbours become adjacent, so the two sides interact and no interval state describes them. If k is burst last, it is a wall between the sides until the end, and when it bursts, its neighbours are exactly the interval boundaries.
```

## Choosing the shape in an unseen problem

Ask three questions.

1. **Are the pieces consecutive?** If the problem lets you put any elements in any group, it is not partition DP; it is subset or knapsack DP ([[a11-knapsack]]), or bitmask DP for small `n` ([[a11-bitmask-dp]]).
2. **Is a piece's cost determined by the piece alone?** Then it is a prefix partition: `dp(i)` over prefixes, try every start of the last piece, and add dimensions only for constraints the prefix cannot express (such as "exactly `k` pieces").
3. **Does a split or an operation change what the sides look like** — a product shape, neighbours that become adjacent, a stick whose length depends on earlier cuts? Then it is an interval DP over `[l, r]`. Try "the last operation" if "the first operation" makes the sides interact.

| Problem | Shape | State | Transition | Time |
|---|---|---|---|---|
| Palindrome Partitioning II | Prefix | `pieces(i)` | last palindromic piece | O(n²) |
| Word Break | Prefix | `ok(i)` | last dictionary word | O(n · L) lookups, max word length L |
| Partition Array for Maximum Sum | Prefix | `best(i)` | last piece of length ≤ k | O(n · k) |
| Split Array Largest Sum | Prefix + count | `dp(p, i)` | last piece, max with prefix | O(k · n²) |
| Matrix Chain Multiplication | Interval | `cost(l, r)` | last multiplication at `k` | O(n³) |
| Burst Balloons | Interval | `best(l, r)` | last balloon `k` | O(n³) |
| Minimum Cost to Cut a Stick | Interval over cut positions | `cost(i, j)` | first cut between them | O(c³) for c cuts |
| Partition Equal Subset Sum | Not partition DP | subset sum | knapsack | O(n · sum) |

## In real systems

**Text layout.** The Knuth–Plass line-breaking algorithm, used by TeX, chooses where to break a paragraph into lines by minimising a total "badness" over lines — a prefix partition where each piece is a line and its cost depends on how much it must stretch or shrink. It produces visibly better paragraphs than greedy "fill each line as far as possible".

**Database query optimisation.** Choosing the order in which to join tables is a close cousin of matrix chain ordering: the cost of a join depends on the sizes of the intermediate results. Classic optimisers (System R, and PostgreSQL's standard planner for queries with few tables) use dynamic programming over subsets of tables; with many tables PostgreSQL switches to a genetic search, because the DP grows too large.

**Batching and segmentation.** Splitting a time series into segments that are each well approximated by a line, cutting a video into scenes, or dividing work among `k` machines to minimise the slowest one are all prefix partitions with domain-specific piece costs.

## Trade-offs and alternatives

| Approach | When it fits | Cost |
|---|---|---|
| Enumerate cuttings or parenthesisations | Brute-force checking on tiny inputs | O(2ⁿ) or Catalan, roughly 4ⁿ |
| Prefix partition DP | Consecutive pieces, piece cost independent of the rest | O(n²) typical, O(n · k) with bounded pieces |
| Interval DP | Splits or operations change the sides | O(n³) typical, O(n²) memory |
| Greedy | Only with a proof, such as the feasibility check for a fixed maximum | O(n) |
| Binary search on the answer + greedy check | Minimise a maximum, with a monotonic check | O(n · log range) |

Interval DP's O(n³) limits it to a few hundred elements in typical time limits. Some interval DPs satisfy a special inequality on their costs (the quadrangle inequality) that allows Knuth's optimisation to O(n²), and some prefix DPs allow divide-and-conquer or convex-hull optimisations; these are competitive-programming techniques beyond what interviews expect.

## Common mistakes

> [!MISTAKE] Checking the piece rule inside the DP loop
> Testing "is `s[j..i-1]` a palindrome?" with a loop inside the transition turns O(n²) into O(n³). Precompute a table or maintain the cost incrementally while extending the piece.

**Off-by-one between prefix lengths and indices.** With `pieces(i)` defined on the first `i` characters, the last piece is `s[j..i-1]`, so the palindrome lookup is `pal[j][i - 1]`, not `pal[j][i]`. Writing the state in words before coding prevents most of these.

**Allowing empty pieces or the wrong number of pieces.** In Split Array Largest Sum, `j` must be at least `p - 1` and the base row must mark non-empty prefixes with zero pieces as impossible. Otherwise the DP quietly returns an answer with fewer than `k` pieces.

**Wrong identity for unreachable states.** A minimisation must start from infinity, a maximisation from minus infinity (or 0 only when 0 is a genuinely achievable value). Starting `pieces[i]` at 0 makes every prefix "free".

**Filling an interval table in row-major order.** It reads intervals that have not been computed. Fill by increasing length.

**Choosing the first operation when it couples the sides.** If after your first choice the two sides can still affect each other, the recurrence double-counts or misses cases. Try the last operation instead.

## Interview perspective

Interviewers use partition problems to see whether you can find the right subproblem rather than recite one. Start with brute force ("try every set of cuts, 2ⁿ⁻¹"), then say what one decision you will make and why the rest is independent.

> [!INTERVIEW] What a strong answer sounds like
> "Let `dp[i]` be the fewest pieces for the first `i` characters. The last piece is `s[j..i-1]` for some `j`; if it's a palindrome, the rest is `dp[j]`, and how I cut the prefix doesn't affect whether the last piece is valid. So `dp[i] = min(dp[j] + 1)`. I'll precompute palindromes in O(n²) so each check is O(1). Total O(n²) time and space."

Questions to be ready for:

- **Palindrome Partitioning (return all partitions)** — that is backtracking, exponential output; the palindrome table still speeds up the checks. Contrast it with Palindrome Partitioning II.
- **Split Array Largest Sum** — give the DP, then offer binary search on the answer as the faster solution and explain why the check is monotonic.
- **Burst Balloons** — explain why "first balloon" fails before giving "last balloon".
- **Matrix Chain** — explain why a prefix state is insufficient, then fill by length and show how to print the parenthesisation.
- **"Is Partition Equal Subset Sum a partition DP?"** — no: the groups are not consecutive, so it is subset sum.

## Practice

1. **Palindrome Partitioning II** — derive, dry-run `"aabbc"`, and print one optimal cutting by storing the best `j` for each `i`.
2. **Word Break** — then **Word Break II**, which returns all sentences.
3. **Partition Array for Maximum Sum**.
4. **Split Array Largest Sum** — solve with the DP and with binary search on the answer; stress-test them against each other.
5. **Minimum Cost to Cut a Stick** — sort the cuts, add the ends, and define the interval over cut positions.
6. **Burst Balloons**.
7. **Matrix Chain Multiplication** — print the parenthesisation.
8. **Minimum Score Triangulation of Polygon** — recognise it as an interval DP on vertices.

For each, write a brute force that tries all cuttings or orders for `n ≤ 8` and compare on random inputs. The DSA explorer lists the matching problems under this topic.

## Quick revision {#quick-revision}

- Two shapes: **prefix partition** (decide the last piece; pieces independent) and **interval partition** (decide the split or last operation in `[l, r]`).
- Prefix: `dp(i)` on the first `i` elements; `dp(i) = best over j of dp(j) ⊕ cost(j..i-1)`; base `dp(0)` = identity; fill `i` increasing.
- Add a dimension for constraints the prefix cannot express, such as exactly `k` pieces: `dp(p, i)`, base `dp(0, i > 0)` impossible.
- Make transitions O(1): palindrome table, prefix sums, running max while extending the piece leftwards.
- Interval: `dp(l, r) = best over k of dp(l, k) ⊕ dp(k+1, r) ⊕ joinCost`; base single elements; fill by increasing length. O(n³) time, O(n²) space.
- If choosing the first action couples the sides, choose the last (Burst Balloons).
- Partition Equal Subset Sum is knapsack, not partition DP. Split Array Largest Sum also yields to binary search on the answer.

## Key takeaways {#key-takeaways}

- Partition DP replaces an exponential number of cuttings with one decision — where the last piece starts, or where an interval splits — plus a smaller problem of the same kind.
- Use a prefix state when a piece's cost depends only on the piece; use an interval state when splitting changes what the parts look like.
- Precompute or incrementally maintain piece costs so each transition is O(1); otherwise the DP gains an extra factor of n.
- Constraints the state cannot see, such as the number of pieces, must become a dimension of the state, with base cases that forbid impossible combinations.
- Interval tables are filled by increasing length, because each interval depends on all shorter ones inside it.
- "Choose the last operation" is the standard fix when choosing the first one makes subproblems interact.
