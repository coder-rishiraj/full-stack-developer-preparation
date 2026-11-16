---
problemId: cses-sum-of-two-values
title: Sum of Two Values
source: cses
sourceUrl: https://cses.fi/problemset/task/1640
difficulty: easy
patterns: [sorting-searching, two-pointers, hashing, sorting]
relatedLessons: [a2-two-pointers, a2-hashing, a2-sorting-based, a3-binary-search, a3-lower-upper-bounds, a1-java-syntax-competitive, a14-brute-force-first]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

You get an array of n integers and a target x. Find two values at **different positions** whose sum is x, and print their positions (1-based). If several pairs work, print any one of them. If none does, print `IMPOSSIBLE`. This is a whole program: it reads standard input and writes standard output.

**Example 1** (the CSES example)

- Input: `4 8` on the first line, `2 7 5 1` on the second
- Output: `2 4`
- Why: the values at positions 2 and 4 are 7 and 1, and 7 + 1 = 8. `4 2` would also be accepted, since the statement allows any valid answer.

**Example 2** (an extra example: the CSES statement has only one)

- Input: `3 10` / `5 1 4`
- Output: `IMPOSSIBLE`
- Why: 5 + 5 would be 10, but there is only one 5, and a position cannot be used twice. The other sums are 6, 9 and 5.

**What the problem statement guarantees**

- 1 ≤ n ≤ 2 · 10^5.
- 1 ≤ x, a_i ≤ 10^9.
- Input: n and x on the first line, the n values on the second. Output: two positions, or `IMPOSSIBLE`. Any valid pair is accepted.
- Time limit: 1 second (memory limit 512 MB).

## 2. Practice first: try it before reading on

If you have not solved this yourself yet, stop here. You may know a famous version of this problem; this one is a whole program with a time limit, positions instead of values, and inputs that could be chosen to hurt you. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 15 minutes.
2. Write the slowest correct program, and estimate its cost at n = 2 · 10^5.
3. Find two faster programs that use different tools. For each, say what it assumes about the input and what it costs in the worst case.
4. Make sure both print the original positions and never use one position twice.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> For a value v, the only partner that works is x − v. How fast can you check whether that partner exists at some other position?

> [!HINT] Hint 2: the kind of tool you need
> Either remember the values seen so far in a lookup structure, or put the values in increasing order. In sorted order, the smallest and the largest value together tell you which of the two can be discarded.

> [!HINT] Hint 3: almost the whole plan
> Sort the values but keep each one's original position with it. Put one index at the smallest and one at the largest. If their sum is too small, move the left index right; if too big, move the right index left; if equal, print the two original positions. Stop when the indices meet.

**Check yourself before revealing the walkthrough**

- [ ] My program prints `IMPOSSIBLE` for `3 10` / `5 1 4`, and a pair for `3 10` / `5 1 5`
- [ ] It prints original positions, 1-based, even after sorting
- [ ] I can say which of my solutions has only an *expected* bound, and why that matters on a judge
- [ ] I know whether a_i + a_j can overflow an `int`

## 3. Interview script: understand the problem (≈1 min)

Treat it as if an interviewer had posed it. The questions are about the output format, duplicates, and what counts as a valid answer.

**Me:** I read n and x, then n values, and print two positions whose values sum to x, or `IMPOSSIBLE`. Positions are 1-based? And any valid pair is fine, in either order?

**Interviewer:** 1-based, any valid pair, either order.

**Me:** The positions must differ, so a single 4 doesn't make 8. But two 4s at different positions do?

**Interviewer:** Yes.

**Me:** Let me check the example: `2 7 5 1`, x = 8. 2 needs 6, absent. 7 needs 1, which is at position 4. So `2 4`.

**Interviewer:** Good. Limits?

**Me:** n up to 2 · 10^5, values and x up to 10^9. The largest sum is 2 · 10^9, below 2^31 − 1 ≈ 2.147 · 10^9, so `int` addition doesn't overflow; and x − v is between 1 − 10^9 and 10^9 − 1, also fine. Checking all pairs would be 2 · 10^10 sums, too slow for one second. I'll read with a `BufferedReader`.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 2 · 10^5 | All pairs is about 2 · 10^10 checks: too slow. n log n is fine. n = 1 has no pair. |
| 1 ≤ x, a_i ≤ 10^9 | a_i + a_j ≤ 2 · 10^9 fits in an `int`. Values are too large for an array indexed by value. |
| Time limit 1 s | Fast input; one line of output. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Any valid pair, in any order | No need to find a particular pair; the first one found can be printed. Tests must validate answers, not compare strings. |
| The two positions must differ; equal values at different positions are fine | Duplicates need care: a lookup must not match a value with itself, and a sort must keep duplicates as separate entries. |
| Positions are 1-based and refer to the original input order | A sorted solution must remember where each value came from. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The tokens may be split over lines differently from the statement | My reader takes tokens wherever they are. |

### Edge cases I will keep in mind

- n = 1: always `IMPOSSIBLE`.
- x = 1: impossible, since two values of at least 1 sum to at least 2.
- x = 2v with a single v: `IMPOSSIBLE`; with two v's: their positions.
- Several valid pairs: any one.
- Values equal to x: they would need a partner of 0, which cannot exist.

## 4. Think out loud: from first idea to best solution

The partner of a value v is forced: it must be x − v. Every approach below answers "is x − v at another position?", and they differ in how. The ladder: check all pairs; remember what you've seen in a hash map; sort and binary search for the partner; sort and walk two pointers inwards.

### Alternative: check all pairs

This rung is O(n²): 3.8 s measured at n = 2 · 10^5 when there is no pair, so it is not a numbered approach.

#### What I say out loud

> "Try every pair of positions i < j and stop at the first whose values sum to x. That's correct by inspection, since it checks every pair, but it's about 2 · 10^10 checks when there's no answer."

#### Intuition

There are only n(n − 1)/2 pairs of positions; checking them all leaves nothing to prove.

#### Algorithm

1. For i from 0 to n − 1, for j from i + 1 to n − 1: if `a[i] + a[j] == x`, print `i+1 j+1` and stop.
2. Print `IMPOSSIBLE`.

#### Why it is correct

- **Only valid answers:** it prints a pair only after checking its sum, and j > i, so the positions differ.
- **Cannot miss one:** every pair of different positions is checked.

#### Dry run

Example 1: `2 7 5 1`, x = 8.

| Positions | Values | Sum | Equal to 8? |
|---|---|---|---|
| 1, 2 | 2, 7 | 9 | no |
| 1, 3 | 2, 5 | 7 | no |
| 1, 4 | 2, 1 | 3 | no |
| 2, 3 | 7, 5 | 12 | no |
| 2, 4 | 7, 1 | 8 | yes |

Prints `2 4`.

#### Java code

```java title="Alternative: check all pairs (O(n²), too slow at n = 2 · 10^5)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    static BufferedReader in;
    static StringTokenizer st;

    public static void main(String[] args) throws IOException {
        in = new BufferedReader(new InputStreamReader(System.in));
        st = new StringTokenizer("");
        int n = nextInt(), x = nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = nextInt();
        int[] pair = findPairByAllPairs(a, x);
        System.out.println(pair == null ? "IMPOSSIBLE" : (pair[0] + 1) + " " + (pair[1] + 1));
    }

    /** Indices i < j with a[i] + a[j] == x, or null. */
    static int[] findPairByAllPairs(int[] a, int x) {
        for (int i = 0; i < a.length; i++) {
            for (int j = i + 1; j < a.length; j++) {
                if (a[i] + a[j] == x) {                          // at most 2 * 10^9: fits in an int
                    return new int[] {i, j};
                }
            }
        }
        return null;
    }

    static int nextInt() throws IOException {
        while (!st.hasMoreTokens()) {
            st = new StringTokenizer(in.readLine());
        }
        return Integer.parseInt(st.nextToken());
    }
}
```

#### Time complexity

**O(n²) in the worst case**, n being the array length: n(n − 1)/2 sums when no pair exists or it is found late. Measured 3.8 s at n = 2 · 10^5 with no pair (JDK 26). It stops early when a pair comes early, but a judge will include the bad case.

#### Space complexity

**O(n)** for the array; O(1) beyond it.

#### The bridge to the next approach

> "For each i, the inner loop searches for one specific value, x − a[i], among the other positions. If I remember the values I've already passed in a hash map from value to position, that search becomes one lookup."

### Approach 1: Hash map of the values seen so far

#### What I say out loud

> "Walk left to right. For each value v at position i, look up x − v in a map of the values seen before i. If it's there, I have my pair: its position and i. Otherwise I record v at position i. Looking up before inserting means a value never pairs with itself."

#### Intuition

A pair (j, i) with j < i is found at the moment i is reached, because a[j] is already in the map. Every pair has a later element, so every pair is detectable.

#### Algorithm

1. `seenAt = new HashMap<>()` (value → a position where it occurred).
2. For i from 0 to n − 1: `j = seenAt.get(x − a[i])`. If not null, print `j+1 i+1` and stop. Otherwise `seenAt.put(a[i], i)`.
3. Print `IMPOSSIBLE`.

#### Why it is correct

- **Only valid answers:** when the lookup succeeds, `seenAt` holds x − a[i] at a position j < i, because only earlier positions have been inserted. So the positions differ and the values sum to x.
- **Cannot miss one:** suppose positions j < i form a valid pair. If the program has not stopped before reaching i, then a[j] is in the map (possibly overwritten by a later position with the same value, which is equally good), so the lookup at i succeeds.
- **Duplicates:** for `5 1 5` with x = 10, the second 5 finds the first one in the map: `1 3`. For `5 1 4`, the only 5 looks itself up before it is inserted, so it is not found.

#### Dry run

Example 1: `2 7 5 1`, x = 8.

| i | a[i] | Looks up x − a[i] | Found? | Map after |
|---|---|---|---|---|
| 0 | 2 | 6 | no | {2: 0} |
| 1 | 7 | 1 | no | {2: 0, 7: 1} |
| 2 | 5 | 3 | no | {2: 0, 7: 1, 5: 2} |
| 3 | 1 | 7 | yes, position 1 | prints `2 4` |

#### Java code

```java title="Approach 1: hash map of values seen"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;
import java.util.StringTokenizer;

public class Main {
    static BufferedReader in;
    static StringTokenizer st;

    public static void main(String[] args) throws IOException {
        in = new BufferedReader(new InputStreamReader(System.in));
        st = new StringTokenizer("");
        int n = nextInt(), x = nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = nextInt();

        Map<Integer, Integer> seenAt = new HashMap<>(2 * n);    // value -> an earlier index holding it
        for (int i = 0; i < n; i++) {
            Integer j = seenAt.get(x - a[i]);                    // the complement, seen earlier?
            if (j != null) {
                System.out.println((j + 1) + " " + (i + 1));
                return;
            }
            seenAt.put(a[i], i);
        }
        System.out.println("IMPOSSIBLE");
    }

    static int nextInt() throws IOException {
        while (!st.hasMoreTokens()) {
            st = new StringTokenizer(in.readLine());
        }
        return Integer.parseInt(st.nextToken());
    }
}
```

#### Time complexity

**O(n) expected**, assuming the hash codes spread the keys over the buckets: n lookups and at most n insertions at O(1) each on average. That assumption is the catch on a judge. `Integer.hashCode()` is the value itself, so an input can be built whose values all land in a few buckets (section 9). A plain chained table would then take O(n) per operation, O(n²) in total. Current Java `HashMap` implementations (Java 8 onwards) turn a bucket with more than 8 entries into a balanced tree, which for comparable keys such as `Integer` keeps an operation at about O(log n); that is implementation behaviour, not a guarantee of the `HashMap` API. Measured: about 0.1 s for the whole program at n = 2 · 10^5 on random values, and about the same on 2 · 10^5 values built to share 105 buckets.

#### Space complexity

**O(n) expected**: up to n entries, each a map node with two boxed `Integer`s, tens of bytes per entry.

#### The bridge to the next approach

> "That's fast, but its bound is only expected, and judges are known to include inputs designed against hash tables. A deterministic route: sort, then the partner search becomes a binary search. The catch is that sorting loses the positions, so I'll carry each position along with its value."

### Approach 2: Sort with positions, then binary search for the partner

#### What I say out loud

> "I pack each value and its position into one `long`, value in the high bits, so sorting the longs sorts by value and keeps the position. Then for each entry I binary-search the entries after it for the value x − v. Searching only after it means I never pair an entry with itself, and I don't miss pairs, because every pair has a first entry in sorted order."

#### Intuition

In sorted order, "is x − v present?" is a binary search. Packing the position into the low bits of a `long` lets a primitive `long[]` sort carry the positions along, with no objects and no comparator.

#### Algorithm

1. Read the values. For each i, `s[i] = (a[i] << 18) | i`: n ≤ 2 · 10^5 < 2^18 = 262,144, so the index fits in 18 bits, and a[i] < 2^30, so the packed value is below 2^48.
2. Sort `s`. The value of entry p is `s[p] >>> 18`, its position is `s[p] & (2^18 − 1)`.
3. For p from 0 to n − 1: `need = x − value(p)`. If `need ≥ 1`, find the first entry q in `s[p+1..n−1]` with `s[q] ≥ need << 18` (a lower bound). If q exists and `value(q) == need`, print the two positions (smaller first, 1-based) and stop.
4. Print `IMPOSSIBLE`.

#### Why it is correct

- **Order:** comparing packed longs compares values first (high bits) and positions only between equal values (low bits), so the sort is by value.
- **Only valid answers:** q > p, so the two entries are different entries, therefore different positions; their values sum to x by the check.
- **Cannot miss one:** take any valid pair, and let p be the one of its two entries that comes first in sorted order. When the loop reaches p (if it has not already stopped), the partner's entry lies in `s[p+1..n−1]` with value x − value(p). The lower bound for `need << 18` lands on the first entry with value ≥ need, and since an entry of value need exists after p, that first entry has value exactly need.

#### Dry run

Example 1: `2 7 5 1`, x = 8. Sorted (value, original index): (1, 3), (2, 0), (5, 2), (7, 1).

| p | value | need | First entry after p with value ≥ need | Match? |
|---|---|---|---|---|
| 0 | 1 | 7 | q = 3, (7, 1) | yes: indices 3 and 1 |

Prints `2 4` (positions 1-based, smaller first).

#### Java code

```java title="Approach 2: sort with positions, binary search"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Main {
    static final int BITS = 18;                                  // n <= 2 * 10^5 < 2^18
    static final long MASK = (1L << BITS) - 1;

    static BufferedReader in;
    static StringTokenizer st;

    public static void main(String[] args) throws IOException {
        in = new BufferedReader(new InputStreamReader(System.in));
        st = new StringTokenizer("");
        int n = nextInt(), x = nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = nextInt();

        long[] s = new long[n];                                  // value in the high bits, index below
        for (int i = 0; i < n; i++) s[i] = ((long) a[i] << BITS) | i;
        Arrays.sort(s);                                          // sorted by value, then by index
        for (int p = 0; p < n; p++) {
            long need = x - (s[p] >>> BITS);
            int q = lowerBound(s, p + 1, n, need << BITS);       // first entry after p with value >= need
            if (need >= 1 && q < n && (s[q] >>> BITS) == need) {
                int i = (int) (s[p] & MASK), j = (int) (s[q] & MASK);
                System.out.println((Math.min(i, j) + 1) + " " + (Math.max(i, j) + 1));
                return;
            }
        }
        System.out.println("IMPOSSIBLE");
    }

    /** The first index in [from, to) with s[index] >= key, or to. */
    static int lowerBound(long[] s, int from, int to, long key) {
        int lo = from, hi = to;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (s[mid] < key) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return lo;
    }

    static int nextInt() throws IOException {
        while (!st.hasMoreTokens()) {
            st = new StringTokenizer(in.readLine());
        }
        return Integer.parseInt(st.nextToken());
    }
}
```

#### Time complexity

**O(n log n) in the worst case**: the sort, then n binary searches of O(log n) each. For `Arrays.sort(long[])` the JDK documentation's implementation note (Java 17) describes a dual-pivot quicksort that "offers O(n log(n)) performance on all data sets"; that describes the implementation, not a contract. Measured about 0.1 s for the whole program at n = 2 · 10^5.

#### Space complexity

**O(n)**: the packed `long[]`, 8 bytes per value, alongside the input array.

#### The bridge to the next approach

> "Each binary search starts from scratch. But as the left value grows, its partner x − v shrinks, so the partner's position only moves left. One index from each end, moving inwards, does all the searches together in one pass."

### Approach 3: Sort with positions, then two pointers (recommended)

#### What I say out loud

> "Same packed sort. Then lo at the smallest value, hi at the largest. If their sum is x, print the two original positions. If it's less than x, the smallest value is too small even with the largest partner left, so it can't be in any pair: lo++. If it's more, the largest is too large even with the smallest partner: hi--. Stop when they meet."

#### Intuition

In sorted order, the sum of the two ends tells you which end is useless. Discarding one entry per step finds a pair, or proves there is none, in n − 1 steps.

#### Algorithm

1. Build and sort the packed array `s` as in Approach 2.
2. `lo = 0`, `hi = n − 1`.
3. While `lo < hi`: `sum = value(lo) + value(hi)`. If `sum == x`, print the two positions (smaller first, 1-based) and stop. If `sum < x`, `lo++`; else `hi--`.
4. Print `IMPOSSIBLE`.

#### Why it is correct

**Invariant:** every valid pair of entries lies inside `s[lo..hi]`.

- **At the start** it holds, since `s[0..n−1]` is everything.
- **sum < x:** for any partner k in (lo, hi], value(k) ≤ value(hi), so value(lo) + value(k) ≤ sum < x. Entry lo is in no pair inside the range; dropping it keeps the invariant.
- **sum > x:** symmetric: for any partner k in [lo, hi), value(k) ≥ value(lo), so the sum stays above x. Entry hi is in no pair; drop it.
- **sum == x:** lo < hi are two different entries, so two different positions, summing to x.

If the loop ends with lo ≥ hi, the range holds at most one entry, so by the invariant no pair exists: `IMPOSSIBLE` is right. The loop runs at most n − 1 times, since every step shrinks the range.

**The 20-second version to say to the interviewer:**

> "Sort values with their positions. If the smallest plus the largest is too small, the smallest can't pair with anything, because the largest is its best chance; drop it. If too big, drop the largest by the same reasoning. Each step discards an entry that can't be in any pair, so if a pair exists I reach it, and if the pointers meet there's none."

#### Dry run

Example 1: sorted (value, index): (1, 3), (2, 0), (5, 2), (7, 1). lo = 0, hi = 3: 1 + 7 = 8. Prints positions 4 and 2 as `2 4`. A longer run, `5 10` / `6 3 8 1 4`: sorted (1, 3), (3, 1), (4, 4), (6, 0), (8, 2).

| lo | hi | values | sum | Action |
|---|---|---|---|---|
| 0 | 4 | 1, 8 | 9 | < 10: lo++ |
| 1 | 4 | 3, 8 | 11 | > 10: hi-- |
| 1 | 3 | 3, 6 | 9 | < 10: lo++ |
| 2 | 3 | 4, 6 | 10 | found: indices 4 and 0 |

Prints `1 5`: the 6 at position 1 and the 4 at position 5.

#### Java code

```java title="Approach 3: sort with positions, two pointers (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Main {
    static final int BITS = 18;                                  // n <= 2 * 10^5 < 2^18
    static final long MASK = (1L << BITS) - 1;

    static BufferedReader in;
    static StringTokenizer st;

    public static void main(String[] args) throws IOException {
        in = new BufferedReader(new InputStreamReader(System.in));
        st = new StringTokenizer("");
        int n = nextInt(), x = nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = nextInt();

        long[] s = new long[n];                                  // value in the high bits, index below
        for (int i = 0; i < n; i++) s[i] = ((long) a[i] << BITS) | i;
        Arrays.sort(s);                                          // sorted by value
        int lo = 0, hi = n - 1;
        while (lo < hi) {
            long sum = (s[lo] >>> BITS) + (s[hi] >>> BITS);
            if (sum == x) {
                int i = (int) (s[lo] & MASK), j = (int) (s[hi] & MASK);
                System.out.println((Math.min(i, j) + 1) + " " + (Math.max(i, j) + 1));
                return;
            } else if (sum < x) {
                lo++;                    // s[lo] is too small even with the largest partner left
            } else {
                hi--;                    // s[hi] is too large even with the smallest partner left
            }
        }
        System.out.println("IMPOSSIBLE");
    }

    static int nextInt() throws IOException {
        while (!st.hasMoreTokens()) {
            st = new StringTokenizer(in.readLine());
        }
        return Integer.parseInt(st.nextToken());
    }
}
```

#### Time complexity

**O(n log n) in the worst case**: the sort, then at most n − 1 steps of O(1). The scan is linear, so the sort is now the only super-linear part. Measured about 0.1 s for the whole program at n = 2 · 10^5, random values or no pair.

#### Space complexity

**O(n)**: the packed `long[]`.

## 5. Comparison table

n is the array length.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Alt. All pairs | O(n²) when no pair exists | O(n²); 3.8 s at n = 2 · 10^5 | O(1) beyond the input |
| 1. Hash map | O(n), if hash codes spread well | O(n²) for chained buckets; about O(n log n) with current Java tree buckets for `Integer` keys (not an API guarantee) | O(n), boxed entries |
| 2. Sort + binary search | O(n log n) | O(n log n) per the JDK implementation note | O(n) `long[]` |
| 3. Sort + two pointers | O(n log n) | O(n log n) per the JDK implementation note | O(n) `long[]` |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Alt. All pairs | Nothing to get wrong | Quadratic | Only as the baseline |
| 1. Hash map | O(n) expected, one pass, works on a stream | Expected bound only; boxing; crafted inputs can slow it | Interviews where "O(n) expected" is the target, as in Two Sum |
| 2. Binary search | Deterministic, easy to reason about | An extra log factor in the search phase, more code than two pointers | When only some values need partners, or the sorted array is reused |
| 3. Two pointers | Deterministic, primitive arrays, shortest correct code after the sort | n log n because of the sort; needs all values up front | The CSES submission, and the basis of 3- and 4-value sums |

## 6. Which solution to give, and when to stop optimizing

**The solution I recommend for CSES:** Approach 3. Its bound holds whatever the input, it uses a primitive `long[]`, and it is the building block for [[cses-sum-of-three-values|Sum of Three Values]] and [[cses-sum-of-four-values|Sum of Four Values]]. It is about as fast as the hash map at this size.

**In an interview,** the hash map is often the answer the interviewer expects first (it is the classic [[nc-two-sum|Two Sum]]), and it is fine as long as you say "expected" and what it assumes. Then offer the sort-based version as the deterministic alternative, and say that on a judge with adversarial tests you would submit it.

**Is it optimal?** In the worst case a correct algorithm must look at essentially every value (any unseen value could complete a pair), so there is an Ω(n) worst-case lower bound; the hash map meets it in expectation. Among comparison-based algorithms, I would not claim a matching n log n lower bound without checking a source, so I stop at "two deterministic n log n approaches and one expected-linear one".

## 7. Interview script: code it and test it

### What I say while coding

> "I pack value and index into one `long`: value shifted left by 18 bits, index in the low 18 bits, since n < 2^18. Sorting a `long[]` is a primitive sort, no comparator, no boxing."

> "`lo < hi`, strictly, so I never use one entry twice."

> "I print the original positions plus one, in increasing order. Any order is accepted, but a fixed order makes my tests and the output predictable."

### Testing out loud

**Example 1:** 1 + 7 = 8 at the first step; positions 4 and 2, printed `2 4`.

**Example 2, `3 10` / `5 1 4`:** sorted 1, 4, 5: 1 + 5 = 6 < 10, lo++; 4 + 5 = 9 < 10, lo++; lo = hi: `IMPOSSIBLE`. The 5 is never paired with itself.

**`3 10` / `5 1 5`:** sorted 1, 5, 5: 1 + 5 < 10, lo++; 5 + 5 = 10, the two entries come from positions 1 and 3: `1 3`.

**n = 1:** the loop doesn't run: `IMPOSSIBLE`.

**x = 1:** every sum is at least 2 > 1, so hi moves down to lo: `IMPOSSIBLE`.

**Official tests:** all four programs on this page give a valid answer on the 12 official CSES tests stored with this site (n ≤ 4), checked by validating the output (any valid pair is accepted), on a real JVM. Those tests are tiny, so the tests for this page add n = 2 · 10^5 inputs: a pair at the start, all values equal, no pair, a single pair hidden at the last two positions, random values, and values built to collide in a `HashMap`.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1 min | 1-based positions, any pair, distinct positions, overflow |
| Ladder | 3 min | All pairs → hash map → sort + binary search → two pointers, with costs |
| Choose | 1 min | Expected vs guaranteed; pick and say why |
| Code | 4 min | Packing, sort, the loop, printing positions |
| Test | 3 min | Example, a lone duplicate (`5 1 4`), a real duplicate pair, n = 1 |

If stuck on the two-pointer argument, write the sorted values in a row and ask: "can the smallest one be in any pair, given that its best partner is the largest?"

## 9. Interviewer challenges

### About hashing on a judge

#### Your hash map is O(n). Why submit a sort?

**What they are testing:** whether you know what "expected" hides.

**How to reason:** who chooses the input, and what happens to a hash table when many keys share a bucket?

**What I say:** "The O(n) is expected, assuming hash codes spread well. `Integer`'s hash code is the value itself, and `HashMap` picks the bucket from the low bits after mixing in the high 16 bits, so it is easy to build values that share buckets: the tests for this page use 2 · 10^5 distinct values that land in only 105 buckets. Current Java turns crowded buckets into trees, so lookups stay around log n and I measured no real slowdown here; but that's implementation behaviour, not a promise. Contest judges, especially Codeforces with hacks, are known for anti-hash tests aimed at weak hash tables, typically C++'s `unordered_map`. Sorting a `long[]` has no such assumption, so on a judge I submit the sort."

**Nuance:** the standard defences, if you want to keep hashing, are a randomized hash (a random seed mixed with a strong mixing function) or a sort. CSES tests are fixed, so this is about habit and robustness.

#### Why pack into a `long` instead of sorting an `Integer[]` of indices with a comparator?

**What they are testing:** awareness of Java's sorting and boxing costs.

**How to reason:** an object sort with a lambda comparator, versus a primitive sort.

**What I say:** "Both work. Sorting `Integer[]` indices by `a[i]` uses the object sort, a merge sort (TimSort) with a comparator call per comparison and a boxed index per entry; packing gives a primitive `long[]` and the comparison is a plain `<`. The packing needs a bound: values below 2^30 and indices below 2^18, so the packed number is below 2^48 and positive."

**Nuance:** a common bug in the comparator version is `(i, j) -> a[i] - a[j]`, which can overflow for wide value ranges; here values are positive and at most 10^9, so the difference fits, but `Integer.compare` is the safe habit.

### About the two-pointer argument

#### Why can you discard the left entry when the sum is too small?

**What they are testing:** the invariant, said precisely.

**How to reason:** the largest remaining partner is its best chance.

**What I say:** "Every other entry in the range is at most the right end, so the left entry plus anything in the range is at most the current sum, which is below x. It can't be in any pair inside the range, and pairs outside the range were already ruled out. So dropping it keeps 'every valid pair is inside lo..hi'."

**Nuance:** this is the same argument as [[nc-two-sum-ii-input-array-is-sorted|Two Sum II]], where the input is already sorted and the positions are the sorted ones.

## 10. Follow-up questions the interviewer might ask

**"Three values instead of two."**
Fix one entry, then run two pointers on the entries after it: O(n²) after an O(n log n) sort. That is [[cses-sum-of-three-values|Sum of Three Values]] (and [[nc-3sum|3Sum]] when all triples are wanted).

**"Four values."**
Fix two, two pointers for the rest: O(n³); or store pair sums in a hash map for O(n²) expected. That is [[cses-sum-of-four-values|Sum of Four Values]].

**"Count all pairs that sum to x."**
A hash map from value to count, adding the count of x − v before inserting v: O(n) expected. Or two pointers that handle runs of equal values. The count can reach about n²/2 ≈ 2 · 10^10, so it needs a `long`.

**"The array is already sorted, and positions refer to the sorted array."**
Two pointers alone, O(n) and O(1) extra space: [[nc-two-sum-ii-input-array-is-sorted|Two Sum II]].

**"Values arrive one at a time; report the first pair as soon as it exists."**
Only the hash map works without seeing everything first: O(1) expected per value.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Calling the hash map "O(n)" without "expected".** Its bound assumes well-spread hash codes, which a judge's input need not have.
- **Forgetting that sorting loses positions.** Running two pointers on a sorted copy and printing the sorted indices prints `1 4` for Example 1, whose values 2 and 1 sum to 3 (verified).
- **Pairing a value with itself.** x = 2v with a single v has no answer.

### Implementation mistakes

> [!MISTAKE] Filling the map before looking up
> Putting every value in the map first and then looking up x − a[i] for each i finds a value's own position: `1 8` / `4` prints `1 1`, and `3 10` / `5 1 4` prints `1 1` instead of `IMPOSSIBLE` (both verified). Look up before inserting, or check that the found index differs.

- **`while (lo <= hi)`.** Lets an entry pair with itself: `1 4` / `2` prints `1 1` (verified).
- **Printing 0-based positions.** The statement counts from 1.
- **Reading with `Scanner`.** Much slower per token than `BufferedReader` with `StringTokenizer` at 2 · 10^5 numbers.

## 12. Pattern recognition

**The pattern:** a pair with a target sum. The partner of v is forced to be x − v, so the question is how to find it: a hash lookup, a binary search in sorted order, or two pointers from both ends of the sorted order.

**Signals in the problem statement:**

- "Two values", "sum equals x", "print positions".
- Large n with values too wide for direct indexing.
- "Any valid answer": the first pair found is enough.

**Related problems in this list:**

- [[nc-two-sum|Two Sum]]: the same problem as a function, usually answered with the hash map.
- [[nc-two-sum-ii-input-array-is-sorted|Two Sum II]]: the input arrives sorted, so only the two pointers remain.
- [[cses-sum-of-three-values|Sum of Three Values]] and [[cses-sum-of-four-values|Sum of Four Values]]: this page's two pointers inside one or two outer loops.
- [[cses-ferris-wheel|Ferris Wheel]]: the same two-ended scan, with a bound instead of an exact target.
- [[cses-apartments|Apartments]]: two pointers across two sorted lists.

**Takeaway:** for "two values summing to x", know three tools and their assumptions: hash map (O(n) expected), sort + binary search, sort + two pointers (O(n log n), deterministic). When sorting, carry the original positions along.

## 13. 60-second revision card

**Key insight:** in sorted order, if the ends sum to less than x the left end is in no pair; if more, the right end is in no pair. Pack value and position into one `long` so the sort keeps the positions.

**Invariant:** every valid pair of entries lies in `s[lo..hi]`.

**Complexity:** O(n log n) time, O(n) space; the hash map is O(n) expected.

**Code skeleton:**

```java title="Sum of Two Values, packed sort and two pointers"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(st.nextToken()), x = Integer.parseInt(st.nextToken());
        long[] s = new long[n];
        st = new StringTokenizer(in.readLine());
        for (int i = 0; i < n; i++) s[i] = (Long.parseLong(st.nextToken()) << 18) | i;
        Arrays.sort(s);
        int lo = 0, hi = n - 1;
        while (lo < hi) {
            long sum = (s[lo] >>> 18) + (s[hi] >>> 18);
            if (sum == x) {
                long i = s[lo] & 262143, j = s[hi] & 262143;
                System.out.println((Math.min(i, j) + 1) + " " + (Math.max(i, j) + 1));
                return;
            }
            if (sum < x) lo++; else hi--;
        }
        System.out.println("IMPOSSIBLE");
    }
}
```

**Main traps:**

- Keep the original positions through the sort; print them 1-based.
- `lo < hi`, and look up before inserting in the hash version: never one position twice.
- Hash map: "O(n) expected", not O(n).

**What to say in one breath:** "The partner of v must be x − v. A hash map of values seen finds it in O(n) expected, but `Integer` hashes are predictable, so for a judge I sort values packed with their positions and walk two pointers inwards: if the sum is too small the left end can't be in any pair, if too big the right end can't. O(n log n), deterministic, and it extends to three and four values."
