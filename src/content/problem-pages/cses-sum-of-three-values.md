---
problemId: cses-sum-of-three-values
title: Sum of Three Values
source: cses
sourceUrl: https://cses.fi/problemset/task/1641
difficulty: medium
patterns: [sorting-searching, two-pointers, sorting, hashing]
relatedLessons: [a2-two-pointers, a2-sorting-based, a3-comparator-sorting, a2-hashing, a1-java-syntax-competitive, a14-brute-force-first, a14-deriving-optimization, a14-edge-cases]
companies: []
timeToSolve: 25
---

## 1. Problem restatement

You get n integers a₁, …, aₙ and a target x. Find three different positions whose values add up to exactly x, and print those three positions (1-based). If no three positions work, print `IMPOSSIBLE`. This is a whole program: it reads standard input and writes standard output.

**Example 1**

- Input: `4 8` on the first line, `2 7 5 1` on the second
- Output: `1 3 4`
- Why: a₁ + a₃ + a₄ = 2 + 5 + 1 = 8. Any other correct triple would be accepted too; here it is the only one.

**Example 2**

- Input: `3 5` on the first line, `1 3 2` on the second
- Output: `IMPOSSIBLE`
- Why: with three numbers there is one triple, and 1 + 3 + 2 = 6, not 5. (This is one of the official CSES tests.)

**What the problem statement guarantees**

- 1 ≤ n ≤ 5000.
- 1 ≤ x ≤ 10^9 and 1 ≤ aᵢ ≤ 10^9.
- The three positions must be distinct; the values at them may be equal.
- If several triples work, any one of them may be printed.
- Time limit 1 second, memory limit 512 MB.

## 2. Practice first: try it before reading on

If you have not solved this yet, stop here. The difficulty is not finding *some* idea; it is finding one that is fast enough for 5000 numbers and still reports the original positions. Everything after this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 25 minutes.
2. Count how many triples of positions there are when n = 5000, and decide whether checking them all fits in one second.
3. Look for a way to make one of the three choices cost almost nothing once the other two are fixed, or once one is fixed.
4. Write the whole program, including fast input, and run it on both examples.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> Fix the first value of the triple. What is left is a problem about two values with a known target. Have you solved that smaller problem before, and how fast?

> [!HINT] Hint 2: the kind of tool you need
> For the two-value part you can remember the values seen so far in a hash map (value → position), or you can sort the array once and walk two pointers inward from both ends. Sorting loses the original positions, so sort the positions by value instead of the values themselves.

> [!HINT] Hint 3: almost the whole plan
> Sort the positions by value. For each i in sorted order, put `lo` just after i and `hi` at the end. While `lo < hi`, compute the three-value sum in a `long`: equal to x, print the three original positions; smaller, move `lo` right; larger, move `hi` left. If no i finds a triple, print `IMPOSSIBLE`. That is O(n²) steps, about 1.25 · 10^7 at n = 5000.

**Check yourself before revealing the walkthrough**

- [ ] I print original 1-based positions, not positions in a sorted copy
- [ ] My three positions are always different, even when values repeat
- [ ] I know the largest sum my program computes and my variable type holds it
- [ ] For n = 1 or n = 2 my program prints `IMPOSSIBLE` without crashing

## 3. Interview script: understand the problem (≈2 min)

Treat it as if an interviewer had posed it. The questions are about the output format, the meaning of "three values", and how large things get.

**Me:** I get n numbers and a target x, and I need three distinct positions whose values sum to x. I print the positions, 1-based, or `IMPOSSIBLE`. If there are several answers, can I print any?

**Interviewer:** Any one is accepted.

**Me:** Distinct positions, but equal values are fine? So in `1 1 1` with x = 3 I can print `1 2 3`?

**Interviewer:** Yes. What you can't do is use one position twice.

**Me:** Does the order of the three positions matter? Could I print `4 1 3` instead of `1 3 4`?

**Interviewer:** The statement only asks for the positions. Any order.

**Me:** Then I'm free to find them in sorted-value order. Sizes: n up to 5000, values and x up to 10^9, all positive. Three values can sum to 3 · 10^9, which is more than 2^31 − 1 ≈ 2.147 · 10^9, so sums go in a `long`. And n = 5000 means there are C(5000, 3) ≈ 2.08 · 10^10 triples, far too many to try in a second.

**Interviewer:** Right.

**Me:** Let me do the example by hand: `2 7 5 1`, x = 8. Triples by position: (1, 2, 3) = 14, (1, 2, 4) = 10, (1, 3, 4) = 8. Found it: `1 3 4`. Notice the 7 can never be used: 7 plus the two smallest others, 1 + 2, is already 10.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 5000 | O(n³) is about 2 · 10^10 triples: too slow. O(n²) is about 1.25 · 10^7 pairs: fine. n can be below 3, which must print `IMPOSSIBLE`. |
| 1 ≤ aᵢ, x ≤ 10^9 | A sum of three values reaches 3 · 10^9 > 2^31 − 1, so I compute sums in `long`. A single value and x fit in `int`. All values are positive. |
| Distinct positions, any valid triple accepted | Equal values at different positions are allowed; I must never reuse one position. I can stop at the first triple I find. |
| Time limit 1 s, memory 512 MB | Fast input (`BufferedReader` + `StringTokenizer`). Memory is not a concern for O(n) extra arrays. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Output: three positions on one line, or `IMPOSSIBLE` | One `println` at the end; nothing else is printed. |
| The positions may come in any order | I can print them in the order my search finds them, for example in sorted-value order. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The input has n numbers on the second line, as the statement says | I read the second line with one `readLine`. The official tests follow this format. |

### Edge cases I will keep in mind

- n = 1 or n = 2: fewer than three positions, so `IMPOSSIBLE`.
- n = 3: exactly one triple.
- Repeated values, for example `1 1 1` with x = 3 (valid) and `1 1 2` with x = 5 (invalid: 1 + 2 + 2 would need position 3 twice).
- The largest values: `1000000000` three times with x = 10^9: the sum is 3 · 10^9 and the answer is `IMPOSSIBLE`.
- n = 5000 with no answer: the search must run to the end within the time limit.

## 4. Think out loud: from first idea to best solution

Every approach answers the same question: is there a triple of positions with sum x? They differ in how much work it takes to settle the third value once the others are chosen.

### Alternative: try every triple

This rung is too slow for the largest tests (4.0 s measured at n = 5000 with no answer), so it is not a numbered approach. It is the baseline to state first.

#### What I say out loud

> "The direct way is three nested loops over positions i < j < k and a check of the sum. It's correct by inspection because it looks at every triple. But it's about n³/6 sums, roughly 2 · 10^10 when n = 5000, so it can't be the final answer."

#### Intuition

A triple of distinct positions is exactly a choice of i < j < k. Enumerate them all and stop at the first one that works.

#### Algorithm

1. Read n, x and the array.
2. For i from 0, j from i + 1, k from j + 1: if `a[i] + a[j] + a[k] == x` (in `long`), print i + 1, j + 1, k + 1 and stop.
3. If the loops finish, print `IMPOSSIBLE`.

#### Why it is correct

- **Only valid answers:** it prints i, j, k with i < j < k, so the positions are distinct, and only after checking that their sum is x.
- **It cannot miss one:** every set of three distinct positions appears exactly once as some i < j < k.

#### Dry run

`4 8` / `2 7 5 1`

| i, j, k (0-based) | Values | Sum | Equal to 8? |
|---|---|---|---|
| 0, 1, 2 | 2, 7, 5 | 14 | no |
| 0, 1, 3 | 2, 7, 1 | 10 | no |
| 0, 2, 3 | 2, 5, 1 | 8 | yes |

Prints `1 3 4`.

#### Java code

```java title="Alternative: every triple (too slow at n = 5000)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(st.nextToken());
        long x = Long.parseLong(st.nextToken());
        int[] a = new int[n];
        st = new StringTokenizer(in.readLine());
        for (int i = 0; i < n; i++) a[i] = Integer.parseInt(st.nextToken());
        System.out.println(searchAllTriples(a, x));
    }

    /** Tries every i < j < k; returns the 1-based positions, or IMPOSSIBLE. */
    static String searchAllTriples(int[] a, long x) {
        int n = a.length;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                for (int k = j + 1; k < n; k++) {
                    if ((long) a[i] + a[j] + a[k] == x) {   // up to 3 * 10^9: long
                        return (i + 1) + " " + (j + 1) + " " + (k + 1);
                    }
                }
            }
        }
        return "IMPOSSIBLE";
    }
}
```

#### Time complexity

**O(n³):** C(n, 3) ≈ n³/6 sums when there is no answer, about 2.08 · 10^10 at n = 5000. Measured on my machine (JDK 26), the program takes 4.0 s at n = 5000 with no answer, four times the time limit.

#### Space complexity

**O(1)** beyond the input array.

#### The bridge to the next approach

> "The innermost loop is wasteful. Once i and j are fixed, I know exactly which value I need: x − a[i] − a[j]. I shouldn't scan for it; I should look it up. That's Two Sum inside a loop: fix i, and run Two Sum with a hash map on the rest."

### Approach 1: fix one value, then Two Sum with a hash map

#### What I say out loud

> "For each i, I need two later positions j and k with a[j] + a[k] = x − a[i]. That is Two Sum. I walk j from i + 1 to the end, and before adding a[j] to a map from value to position, I ask whether x − a[i] − a[j] is already in it. If it is, its position is strictly between i and j, so the three positions are distinct. That's O(n²) map operations, expected."

#### Intuition

Fixing the first value turns a three-value question into a two-value one, and Two Sum is answered in one pass by remembering what has been seen. The order "look up, then insert" is what keeps j from pairing with itself.

#### Algorithm

1. Read n, x and the array.
2. For each i from 0 to n − 1:
   1. `seen` = an empty `HashMap<Integer, Integer>` (value → position).
   2. For each j from i + 1 to n − 1: `need = x − a[i] − a[j]`. If `seen` has `need` at position k, print i + 1, k + 1, j + 1 and stop. Otherwise put `a[j] → j`.
3. Print `IMPOSSIBLE`.

`need` can be negative, down to 1 − 2 · 10^9, which still fits in an `int`; a negative `need` is never in the map, which is correct because every value is positive.

#### Why it is correct

- **Invariant:** when the inner loop looks up `need` at step j, `seen` holds a position for every value that occurs strictly between i and j (the latest such position, if a value repeats), and nothing else.
- **Only valid answers:** a hit returns k with i < k < j, so the positions are distinct, and a[i] + a[k] + a[j] = a[i] + need + a[j] = x.
- **It cannot miss one:** take any answer i < k < j. When the outer loop is at i and the inner loop reaches j, the value a[k] was inserted at step k, so `seen` contains some position with value a[k] = need (perhaps a different position with the same value, which is equally valid). The lookup succeeds, so the search stops at this triple or earlier.

#### Dry run

`4 8` / `2 7 5 1`; i = 0 (a[i] = 2):

| j | a[j] | need = 8 − 2 − a[j] | In `seen`? | `seen` after |
|---|---|---|---|---|
| 1 | 7 | −1 | no | {7 → 1} |
| 2 | 5 | 1 | no | {7 → 1, 5 → 2} |
| 3 | 1 | 5 | yes, k = 2 | stop |

Prints `1 3 4` (positions i + 1, k + 1, j + 1).

#### Java code

```java title="Approach 1: fix one value, Two Sum with a hash map"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(st.nextToken());
        int x = Integer.parseInt(st.nextToken());
        int[] a = new int[n];
        st = new StringTokenizer(in.readLine());
        for (int i = 0; i < n; i++) a[i] = Integer.parseInt(st.nextToken());

        for (int i = 0; i < n; i++) {                       // the first value of the triple
            HashMap<Integer, Integer> seen = new HashMap<>();   // value -> position, inside (i, j)
            for (int j = i + 1; j < n; j++) {
                int need = x - a[i] - a[j];                 // >= 1 - 2 * 10^9: fits in int
                Integer k = seen.get(need);
                if (k != null) {
                    System.out.println((i + 1) + " " + (k + 1) + " " + (j + 1));
                    return;
                }
                seen.put(a[j], j);
            }
        }
        System.out.println("IMPOSSIBLE");
    }
}
```

#### Time complexity

**O(n²) expected,** assuming hash codes spread well: about n²/2 lookups and inserts, 1.25 · 10^7 at n = 5000. If many keys collide, a chained bucket makes each operation slower; current Java versions turn a crowded bucket into a balanced tree, which for `Integer` keys keeps an operation at about O(log n), but that is implementation behaviour, not an API guarantee. Measured: 0.6 s at n = 5000 with no answer (random even values, odd x), which is under the limit but with little margin, mostly spent boxing `Integer`s and rebuilding a map for every i.

#### Space complexity

**O(n):** one map of at most n − 1 entries at a time.

#### The bridge to the next approach

> "The idea is right, but I'm paying for hashing, boxing, and a fresh map per i. Is there a way to do the Two Sum part with plain array reads? Yes, if the array is sorted: then two pointers from both ends solve Two Sum in one linear sweep, and the sort costs only O(n log n) once. The catch is the positions: I must sort positions by value, not the values themselves."

### Approach 2: sort positions by value, then two pointers (recommended)

#### What I say out loud

> "I sort the positions by their values, keeping a copy of the values in that order. For each i in sorted order, I look for two values after it with lo starting right after i and hi at the end. If the sum is too small, the smallest candidate, v[lo], is useless with every remaining partner, so lo moves right. If it's too big, v[hi] is useless, so hi moves left. Each i costs a linear sweep, so the whole thing is O(n²) array steps, and I print the original positions stored next to the values."

#### Intuition

In a sorted list, the two-value question has a monotone structure: the smallest remaining value with the largest remaining value is the only pair worth checking, because if it is too small, nothing smaller-than-largest can help that small value, and if it is too big, nothing larger-than-smallest can help that large value. Every comparison throws one candidate away for good.

#### Algorithm

1. Read n, x and the array a.
2. `order` = positions 0..n − 1 sorted by a (an `Integer[]` sorted with a comparator). `v[t] = a[order[t]]`, as `long`.
3. For i from 0 to n − 3:
   1. `lo = i + 1`, `hi = n − 1`.
   2. While `lo < hi`: `sum = v[i] + v[lo] + v[hi]`. If `sum == x`, print `order[i] + 1`, `order[lo] + 1`, `order[hi] + 1` and stop. If `sum < x`, `lo++`; else `hi--`.
4. Print `IMPOSSIBLE`.

#### Why it is correct

- **Only valid answers:** i < lo < hi are distinct places in the sorted order, and `order` is a permutation, so they map to three distinct original positions; their values sum to x.
- **It cannot miss one.** Take any answer and look at it in sorted order: places i < L < H with v[i] + v[L] + v[H] = x. The outer loop reaches i (unless it already stopped at another answer). For that i, the invariant is: *while nothing has been printed, lo ≤ L and H ≤ hi.* It holds at the start (lo = i + 1, hi = n − 1).
  - When `lo = L` and `hi > H`: the sum is v[i] + v[L] + v[hi] ≥ v[i] + v[L] + v[H] = x, because v[hi] ≥ v[H]. So the program either prints (another valid triple) or moves `hi` left, never `lo`. `lo` cannot pass L.
  - When `hi = H` and `lo < L`: the sum is at most x, because v[lo] ≤ v[L]. So the program prints or moves `lo` right, never `hi`. `hi` cannot pass H.
  - Otherwise both pointers are strictly outside (L, H), and moving either one keeps the invariant.
  - Each step shrinks the window by one, so at the latest the window becomes exactly `lo = L`, `hi = H`, where the sum is x and the program prints.
- **Sorting does not lose answers:** it only reorders the positions, and every triple of distinct positions still appears as three distinct places in the sorted order.

**The 30-second version:** "Sort positions by value. Fix the smallest value of the triple, then two pointers on the rest. When the sum is too small, the smallest candidate can't work even with the biggest partner, so it goes; when too big, the biggest candidate can't work even with the smallest partner, so it goes. The answer's two places are never passed, so if one exists I find it. O(n²) after an O(n log n) sort, sums in `long`, positions from the sorted index array."

#### Dry run

`4 8` / `2 7 5 1`. Sorted: v = [1, 2, 5, 7] with original positions [4, 1, 3, 2].

| i | lo | hi | v[i] + v[lo] + v[hi] | Action |
|---|---|---|---|---|
| 0 | 1 | 3 | 1 + 2 + 7 = 10 | too big: hi-- |
| 0 | 1 | 2 | 1 + 2 + 5 = 8 | found |

Prints `4 1 3`: positions 4, 1, 3 hold 1, 2, 5. The same triple as the example's `1 3 4`, in a different order, which is accepted.

Second dry run, `3 5` / `1 3 2`: sorted v = [1, 2, 3]. i = 0: 1 + 2 + 3 = 6 > 5, hi-- makes lo = hi, the sweep ends. i = 1 is not tried (it needs two values after it). Prints `IMPOSSIBLE`.

#### Java code

```java title="Approach 2: sort positions by value, two pointers (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(st.nextToken());
        long x = Long.parseLong(st.nextToken());
        int[] a = new int[n];
        st = new StringTokenizer(in.readLine());
        for (int i = 0; i < n; i++) a[i] = Integer.parseInt(st.nextToken());

        Integer[] order = new Integer[n];                   // positions, sorted by value
        for (int i = 0; i < n; i++) order[i] = i;
        Arrays.sort(order, (p, q) -> Integer.compare(a[p], a[q]));
        long[] v = new long[n];                             // the values in sorted order
        for (int i = 0; i < n; i++) v[i] = a[order[i]];

        for (int i = 0; i < n - 2; i++) {                   // smallest value of the triple
            int lo = i + 1, hi = n - 1;
            while (lo < hi) {
                long sum = v[i] + v[lo] + v[hi];            // up to 3 * 10^9: long
                if (sum == x) {
                    System.out.println((order[i] + 1) + " " + (order[lo] + 1) + " " + (order[hi] + 1));
                    return;
                }
                if (sum < x) lo++;                          // v[lo] is too small for every partner left
                else hi--;                                  // v[hi] is too large for every partner left
            }
        }
        System.out.println("IMPOSSIBLE");
    }
}
```

#### Time complexity

**O(n²) worst case:** the sort is O(n log n) (for object arrays the JDK implementation note describes a stable, adaptive mergesort with the performance of a traditional mergesort), then for each of the n − 2 values of i the two pointers together take at most n − i − 2 steps, so at most about n²/2 ≈ 1.25 · 10^7 steps at n = 5000, with no hashing. Measured on my machine: 0.07 s for the whole program at n = 5000 with no answer.

#### Space complexity

**O(n):** the `order` and `v` arrays.

All three programs on this page pass the 12 official CSES tests stored with the site (checked for validity, since any triple is accepted) and the randomized tests in the test file.

## 5. Comparison table

n is the number of values. Expected and worst case differ only where a hash map is involved.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Alt. Every triple | O(n³) | O(n³), 4.0 s at n = 5000 | O(1) |
| 1. Fix one + hash map | O(n²), if hash codes spread well | Slower under heavy collisions; about O(n² log n) with current Java tree buckets for `Integer` keys (not an API guarantee) | O(n) |
| 2. Sort positions + two pointers | O(n²) | O(n²) (plus the O(n log n) sort) | O(n) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Alt. Every triple | Trivially correct | 2 · 10^10 sums at the limit | Only to state the baseline, or as a checker in tests |
| 1. Hash map | No sorting; keeps positions for free; the same idea as Two Sum | Boxing and a map per i: 0.6 s measured, close to the limit; expected, not guaranteed | When the array must not be reordered, or values are not comparable |
| 2. Two pointers | Plain array reads, 0.07 s measured; no hashing assumptions | Must carry original positions through the sort | The answer to give |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2. It is O(n²) in the worst case, needs only arrays, and runs an order of magnitude faster than the hash map version on the largest input. Mention Approach 1 as the natural first improvement, since it is how most people get from the brute force to O(n²).

**Is O(n²) optimal?** This is the 3SUM problem. No algorithm running in O(n^(2 − ε)) time for a fixed ε > 0 is known, and the 3SUM conjecture says none exists; the best known algorithms beat n² only by logarithmic factors and are not interview material. For n ≤ 5000, O(n²) is about 10^7 steps, so stop here.

**When the other one is better:** if you are not allowed to reorder the input or to allocate the sorted index array, or if the values were not comparable, the hash map version still works.

## 7. Interview script: code it and test it

### What I say while coding

> "I sort an `Integer[]` of positions with a comparator, so I can always get back from a sorted place to the original position. Then I copy the values into a `long[]` in that order, so every sum is computed in `long` without casts."

> "The outer loop stops at n − 3, because i needs two places after it. The inner loop runs while lo < hi, which keeps the three places distinct."

> "I print `order[...] + 1`, the original positions, 1-based. Printing i + 1, lo + 1, hi + 1 would be positions in the sorted copy."

### Testing out loud

**Example `4 8` / `2 7 5 1`:** sorted 1, 2, 5, 7. i = 0: 1 + 2 + 7 = 10, too big, hi to 5; 1 + 2 + 5 = 8. Prints `4 1 3`, which is 1 + 2 + 5. Accepted.

**`3 5` / `1 3 2`:** one triple, sum 6. Prints `IMPOSSIBLE`.

**n = 1 or 2:** the outer loop condition `i < n − 2` is false at once; prints `IMPOSSIBLE`.

**`3 3` / `1 1 1`:** i = 0, lo = 1, hi = 2: sum 3. Prints `1 2 3`; equal values at different positions are fine.

**`3 5` / `1 1 2`:** sorted 1, 1, 2; the only triple sums to 4. Prints `IMPOSSIBLE`. A version that reused a position could print 1 + 2 + 2.

**`3 1000000000` / `1000000000 1000000000 1000000000`:** the sum is 3,000,000,000, held in `long`; too big, hi--, done. Prints `IMPOSSIBLE`.

**n = 5000, no answer:** about 1.25 · 10^7 pointer steps, 0.07 s measured.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 3 min | Distinct positions, any answer, any order, 1-based, `long` sums |
| Brute force and its cost | 2 min | n³/6 ≈ 2 · 10^10, too slow |
| Reduce to Two Sum | 4 min | Hash map version, or straight to sorting + two pointers |
| Correctness of two pointers | 4 min | Why discarding v[lo] or v[hi] is safe |
| Code | 8 min | Index sort, `long[]`, the sweep |
| Test | 4 min | Example, n < 3, repeated values, the 3 · 10^9 sum |

If you get stuck on the pointer argument, write the sorted example and ask: "if 1 + 2 + 7 is too big, can 7 ever work with this 1?" The answer, no (every other partner is at least 2), is the whole proof.

## 9. Interviewer challenges

### About correctness

#### Why is it safe to move `lo` right when the sum is too small?

**What they are testing:** whether you can justify two pointers instead of reciting them.

**How to reason:** say which candidate is eliminated and against which partners.

**What I say:** "If v[i] + v[lo] + v[hi] < x, then v[lo] paired with any place between lo and hi is at most v[lo] + v[hi], still too small. So v[lo] cannot be in an answer with this i and the remaining window, and dropping it loses nothing. The mirror argument covers moving hi."

**Nuance:** the argument needs the window to be sorted; that is why sorting comes first, and why the positions have to travel with the values.

#### Do you need to try i as the middle or largest value too?

**What they are testing:** whether you see why one outer loop covers every triple.

**How to reason:** every triple has a smallest place in sorted order.

**What I say:** "Any triple, sorted, is i < L < H. I fix the smallest place i and search only after it. The same triple is never needed with another place as the fixed one."

**Nuance:** this is also why the hash map version only looks forward from i.

### About implementation

#### Why `long`? Would `int` actually break here?

**What they are testing:** overflow reasoning from the constraints, not by reflex.

**How to reason:** compute the largest sum, then check what the wrapped value does.

**What I say:** "Three values reach 3 · 10^9 and `int` stops at 2,147,483,647, so the sum does not fit. I use `long` and the question goes away."

**Nuance:** curiously, with these exact limits the `int` version of Approach 2 still gives correct answers. A wrapped sum is negative (the true sum is at most 3 · 10^9 < 2^32), so it never equals x ≥ 1 and never produces a false answer. It does send `lo` the wrong way, but only harmlessly: an overflow while the answer's places L, H are still inside the window would need v[hi] > 2^31 − 1 − v[i] − v[lo] ≥ 2^31 − 1 − x ≥ 1.147 · 10^9, and no value exceeds 10^9. I ran 1.5 million random inputs built to overflow, and the `int` version never failed. That is luck of the limits, not a design: allow larger x or negative values and it breaks. Use `long`.

#### Why not sort `a` directly?

**What they are testing:** whether you noticed that the output is positions.

**How to reason:** after sorting values, a sorted place no longer tells you where the value came from.

**What I say:** "Then I'd print positions in the sorted copy. On the example that prints `1 2 3`, which in the original array is 2 + 7 + 5 = 14. I sort the positions by value instead, or sort (value, position) pairs."

**Nuance:** packing value · 8192 + position into a `long` and sorting a `long[]` is a faster alternative to the `Integer[]` comparator sort (5000 < 8192 = 2^13); it is not needed at this size.

### About complexity

#### Can you do better than O(n²)?

**What they are testing:** whether you know where the floor is believed to be.

**How to reason:** name the problem and avoid overclaiming.

**What I say:** "This is 3SUM. No algorithm with time O(n^(2 − ε)) is known, and it is conjectured that none exists; known improvements shave only logarithmic factors. So O(n²) is what I'd aim for."

**Nuance:** if values were small (say up to 10^5), a polynomial multiplication by FFT over the value range would answer existence faster, but handling distinct positions makes it fiddly, and with values up to 10^9 it does not apply.

## 10. Follow-up questions the interviewer might ask

**"Return every distinct triple of values that sums to x, not just one set of positions."**
That is [[nc-3sum|3Sum]]: the same sort and two pointers, plus skipping equal values at each level so that each value triple is reported once. O(n²) time.

**"Four values instead of three."**
[[cses-sum-of-four-values|Sum of Four Values]]: fix two and use two pointers for O(n³), or store pair sums in a hash map for O(n²) expected, with care that the two pairs use four distinct positions.

**"Two values."**
[[cses-sum-of-two-values|Sum of Two Values]]: one sweep with a hash map, or sort positions and two pointers. O(n) expected or O(n log n).

**"Count the triples of positions with sum x."**
For each middle position j, count pairs (i < j < k): keep a count map of values to the left and scan to the right, or for each i run a counting Two Sum on the suffix. O(n²) expected; the count can reach C(5000, 3) ≈ 2 · 10^10, so it needs a `long`.

**"Find the triple whose sum is closest to x."**
The same sweep, tracking the best |sum − x| instead of stopping at equality. O(n²).

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Dismissing O(n²) as too slow.** At n = 5000 it is 1.25 · 10^7 steps. Compute the number before rejecting an approach.
- **Thinking the values must be distinct.** Only positions must be; `1 1 1` with x = 3 is a valid answer.
- **Fixing i but searching the whole array for the other two.** They must come after i (in sorted order, or by position in the hash version), otherwise the same position can be picked twice.

### Implementation mistakes

> [!MISTAKE] Printing positions in the sorted copy
> Sorting the values and printing `i + 1, lo + 1, hi + 1` gives `1 2 3` on the example (verified), and positions 1, 2, 3 of the original array hold 2 + 7 + 5 = 14. Carry the original positions through the sort.

> [!MISTAKE] Inserting before looking up in the hash version
> With `seen.put(a[j], j)` before `seen.get(need)`, the lookup can return j itself when need = a[j]. On `3 5` / `1 1 2` it prints `1 3 3` (verified), using position 3 twice; on the official test `3 5` / `1 3 2` it prints a reused position too. Look up first, then insert.

- **`int` for the sum.** It happens to survive these limits (section 9), but the habit breaks on the next problem. Use `long`.
- **`Scanner` for input.** 5000 numbers is small, but the habit costs time on larger CSES inputs; `BufferedReader` with `StringTokenizer` is standard.

## 12. Pattern recognition

**The pattern:** k-Sum by reduction. Fix k − 2 values, and solve the remaining two-value problem in linear time with two pointers on sorted data (or with a hash map). Each fixed value multiplies the cost by n.

**Signals in the problem statement:**

- "Find k values whose sum is x" with k small and fixed.
- n in the thousands for k = 3 (O(n²)), or up to about 1000 for k = 4.
- Output asks for positions: the sort must carry them along.

**Related problems in this list:**

- [[cses-sum-of-two-values|Sum of Two Values]]: the k = 2 building block, with positions.
- [[cses-sum-of-four-values|Sum of Four Values]]: k = 4, where pair sums in a hash map beat fixing two values.
- [[nc-3sum|3Sum]]: all distinct value triples summing to zero; the same sweep with duplicate skipping.
- [[nc-4sum|4Sum]]: all distinct value quadruples; two fixed values plus two pointers.
- [[nc-two-sum-ii-input-array-is-sorted|Two Sum II]]: the two-pointer sweep on its own.

**Takeaway:** fix the smallest value, then two pointers on what is after it; every comparison discards one candidate for good, so each fixed value costs one linear sweep.

## 13. 60-second revision card

**Key insight:** fixing one value leaves Two Sum. On sorted data Two Sum is a linear two-pointer sweep, so the whole search is O(n²). Sort positions by value so the answer can be printed as original positions.

**Invariant:** for the fixed i, an answer's two places L < H are never passed: lo ≤ L and H ≤ hi until the sum equals x.

**Complexity:** O(n²) time worst case (plus an O(n log n) sort), O(n) extra space.

**Code skeleton:**

```java title="Sum of Three Values, sort positions + two pointers"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(st.nextToken());
        long x = Long.parseLong(st.nextToken());
        int[] a = new int[n];
        st = new StringTokenizer(in.readLine());
        for (int i = 0; i < n; i++) a[i] = Integer.parseInt(st.nextToken());
        Integer[] order = new Integer[n];
        for (int i = 0; i < n; i++) order[i] = i;
        Arrays.sort(order, (p, q) -> Integer.compare(a[p], a[q]));
        for (int i = 0; i < n - 2; i++) {
            int lo = i + 1, hi = n - 1;
            while (lo < hi) {
                long sum = (long) a[order[i]] + a[order[lo]] + a[order[hi]];
                if (sum == x) {
                    System.out.println((order[i] + 1) + " " + (order[lo] + 1) + " " + (order[hi] + 1));
                    return;
                }
                if (sum < x) lo++; else hi--;
            }
        }
        System.out.println("IMPOSSIBLE");
    }
}
```

**Main traps:**

- Print original positions, not sorted places.
- Sums in `long` (up to 3 · 10^9).
- `lo < hi` keeps the three places distinct; n < 3 prints `IMPOSSIBLE`.

**What to say in one breath:** "Sort positions by value, fix the smallest value of the triple, and two-pointer the rest: too small moves lo, too big moves hi, and the answer's places are never skipped. O(n²) with `long` sums, printing the original positions."
