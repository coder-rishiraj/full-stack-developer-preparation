---
problemId: cses-sum-of-four-values
title: Sum of Four Values
source: cses
sourceUrl: https://cses.fi/problemset/task/1642
difficulty: medium
patterns: [sorting-searching, hashing, two-pointers, sorting]
relatedLessons: [a2-hashing, a2-two-pointers, a2-sorting-based, a3-comparator-sorting, a1-java-syntax-competitive, a14-brute-force-first, a14-deriving-optimization, a14-edge-cases]
companies: []
timeToSolve: 30
---

## 1. Problem restatement

You get n integers a₁, …, aₙ and a target x. Find four different positions whose values add up to exactly x, and print those four positions (1-based). If no four positions work, print `IMPOSSIBLE`. This is a whole program: it reads standard input and writes standard output.

**Example 1**

- Input: `8 15` on the first line, `3 2 5 8 1 3 2 3` on the second
- Output: `2 4 6 7`
- Why: a₂ + a₄ + a₆ + a₇ = 2 + 8 + 3 + 2 = 15. Other answers exist, such as positions 1, 2, 4, 7 (3 + 2 + 8 + 2), and any of them is accepted.

**Example 2**

- Input: `4 9` on the first line, `4 1 2 3` on the second
- Output: `IMPOSSIBLE`
- Why: with four numbers there is one choice of four positions, and 4 + 1 + 2 + 3 = 10, not 9. (This is one of the official CSES tests.)

**What the problem statement guarantees**

- 1 ≤ n ≤ 1000.
- 1 ≤ x ≤ 10^9 and 1 ≤ aᵢ ≤ 10^9.
- The four positions must be distinct; the values at them may be equal.
- If several answers exist, any one may be printed.
- Time limit 1 second, memory limit 512 MB.

## 2. Practice first: try it before reading on

If you have not solved this yet, stop here. There is a straightforward way that is just fast enough, and a faster one with a subtle detail about which positions may be combined. Try to find both. Everything after this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 30 minutes.
2. Count the quadruples of positions for n = 1000, and how many steps n³ and n² would be.
3. Find a first solution that fits in the time limit, then ask what the four values look like if you split them into two groups of two.
4. Write the program and run it on both examples, including a case where a value repeats.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> If you have solved the three-value version, you can fix one more value and reuse it. That is n³/6, about 1.7 · 10^8 simple steps for n = 1000. Is there a way to look at the four values as two pairs instead?

> [!HINT] Hint 2: the kind of tool you need
> Four values are a pair plus a pair. Store pair sums in a hash map (sum → one pair of positions) and look up x minus the other pair's sum. The danger is that the two pairs share a position. Choose *when* you insert a pair so that every pair in the map lies entirely before the pair you are looking up with.

> [!HINT] Hint 3: almost the whole plan
> Loop c over positions as the third position of the answer. For every d > c, look up x − a[c] − a[d] in the map; a hit (p, q) gives the answer p, q, c, d. Only after all d are done, insert every pair (p, c) with p < c. Then every stored pair ends before c, so the four positions are distinct, and any answer p < q < c < d is found when the loop is at c. O(n²) expected.

**Check yourself before revealing the walkthrough**

- [ ] My four positions are always distinct, even when values repeat
- [ ] I can say why my method cannot miss an answer, not only why the answers it prints are valid
- [ ] I know the largest sum my program computes and which type holds it
- [ ] For n < 4 my program prints `IMPOSSIBLE`

## 3. Interview script: understand the problem (≈2 min)

Treat it as if an interviewer had posed it.

**Me:** n numbers, a target x, and I need four distinct positions whose values sum to x, printed 1-based, or `IMPOSSIBLE`. Any valid answer is accepted?

**Interviewer:** Yes, any.

**Me:** Distinct positions, values may repeat: `2 2 2 2` with x = 8 is `1 2 3 4`. And the order of the four positions in the output is free?

**Interviewer:** The statement asks for the positions only, so any order.

**Me:** Sizes: n ≤ 1000, values and x between 1 and 10^9. Four values reach 4 · 10^9, which is more than 2^31 − 1 ≈ 2.147 · 10^9, so a sum of four needs a `long`. A sum of two reaches 2 · 10^9, which still fits in an `int`. There are C(1000, 4) ≈ 4.1 · 10^10 quadruples, so trying all of them is out.

**Interviewer:** Go on.

**Me:** The example: `3 2 5 8 1 3 2 3`, x = 15. The 8 looks useful: I need 7 more from three other values. 3 + 2 + 2 = 7 works, for example positions 1, 2, 7. So positions 1, 2, 4, 7: 3 + 2 + 8 + 2 = 15. The official output picks 2, 4, 6, 7 instead, and both are fine.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 1000 | O(n⁴) ≈ 4 · 10^10: too slow. O(n³)/6 ≈ 1.7 · 10^8 simple steps: fits in Java, measured 0.29 s. O(n²) ≈ 5 · 10^5 pairs: easy. n < 4 must print `IMPOSSIBLE`. |
| 1 ≤ aᵢ, x ≤ 10^9 | A four-value sum reaches 4 · 10^9: `long`. A pair sum reaches 2 · 10^9 ≤ 2,147,483,647: fits in `int`, which matters for a hash map keyed by pair sums. All values are positive. |
| Distinct positions, any valid answer | Never reuse a position; stop at the first answer found. |
| Time limit 1 s, memory 512 MB | Half a million map entries is tens of megabytes: affordable, but worth stating. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Output: four positions on one line, or `IMPOSSIBLE` | One `println` at the end. |
| Positions may be printed in any order | I can print them in the order the search produces them. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The second line holds all n numbers, as the statement says | I read it with one `readLine`. The official tests follow this format. |

### Edge cases I will keep in mind

- n ≤ 3: `IMPOSSIBLE`.
- n = 4: exactly one choice.
- A value needed twice: `3 1 2 1` with x = 7 is 3 + 1 + 2 + 1 using both 1s; a program that reuses one position could print 3 + 1 + 1 + 2 with the same 1 twice.
- `1000000000` four times with x = 10^9: the sum is 4 · 10^9, `IMPOSSIBLE`.
- n = 1000 with no answer: the search runs to the end.

## 4. Think out loud: from first idea to best solution

Each rung removes one nested loop: first by sorting and sweeping two pointers, then by splitting the four values into two pairs and meeting in the middle with a hash map.

### Alternative: try every quadruple

This rung is too slow for the largest tests (10.2 s measured at n = 1000 with no answer), so it is not a numbered approach. It is the baseline to state first.

#### What I say out loud

> "Four nested loops over positions i < j < k < l, checking the sum in a `long`. Correct because it looks at every choice of four positions, but that is about n⁴/24 ≈ 4 · 10^10 sums at n = 1000."

#### Intuition

A set of four distinct positions is exactly one increasing quadruple i < j < k < l. Enumerate them.

#### Algorithm

1. Read n, x and the array.
2. For i < j < k < l: if `a[i] + a[j] + a[k] + a[l] == x` (in `long`), print the four positions plus one and stop.
3. Print `IMPOSSIBLE`.

#### Why it is correct

- **Only valid answers:** strictly increasing indices are distinct, and the sum is checked.
- **It cannot miss one:** every set of four distinct positions occurs once as an increasing quadruple.

#### Dry run

`8 15` / `3 2 5 8 1 3 2 3`: with i = 0, j = 1 (values 3, 2), it needs 10 from two later values. k = 2 (5) fails with every l; k = 3 (8) fails with l = 4 (1) and l = 5 (3), then succeeds with l = 6 (2): 3 + 2 + 8 + 2 = 15. Prints `1 2 4 7`.

#### Java code

```java title="Alternative: every quadruple (too slow at n = 1000)"
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
        System.out.println(searchAllQuadruples(a, x));
    }

    /** Tries every i < j < k < l; returns the 1-based positions, or IMPOSSIBLE. */
    static String searchAllQuadruples(int[] a, long x) {
        int n = a.length;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                for (int k = j + 1; k < n; k++) {
                    for (int l = k + 1; l < n; l++) {
                        if ((long) a[i] + a[j] + a[k] + a[l] == x) {   // up to 4 * 10^9: long
                            return (i + 1) + " " + (j + 1) + " " + (k + 1) + " " + (l + 1);
                        }
                    }
                }
            }
        }
        return "IMPOSSIBLE";
    }
}
```

#### Time complexity

**O(n⁴):** C(n, 4) ≈ n⁴/24 sums when there is no answer, about 4.1 · 10^10 at n = 1000. Measured on my machine (JDK 26): 10.2 s at n = 1000 with no answer.

#### Space complexity

**O(1)** beyond the input.

#### The bridge to the next approach

> "The two innermost loops are a Two Sum: with i and j fixed, I need two later values summing to x − a[i] − a[j]. On sorted data that's one two-pointer sweep instead of a double loop. So: sort positions by value, fix two, sweep. That's the three-value solution with one more fixed value."

### Approach 1: sort positions by value, fix two, then two pointers

#### What I say out loud

> "I sort the positions by value and keep the values in that order. For every pair of sorted places i < j, I run two pointers on the places after j: lo from j + 1, hi from the end. Too small, lo moves right; too big, hi moves left. That's n²/2 pairs times a linear sweep: about n³/6 ≈ 1.7 · 10^8 steps at n = 1000, which is fine for simple array reads."

#### Intuition

Sorting makes the last two choices cheap: with the window sorted, each comparison rules out one candidate for good (the smallest is too small even with the largest partner, or the largest is too big even with the smallest). Fixing the two smallest places of the answer leaves exactly that situation.

#### Algorithm

1. Read n, x, a. `order` = positions sorted by value; `v[t] = a[order[t]]` as `long`.
2. For i from 0 to n − 4, for j from i + 1 to n − 3:
   1. `lo = j + 1`, `hi = n − 1`.
   2. While `lo < hi`: `sum = v[i] + v[j] + v[lo] + v[hi]`. Equal: print the four original positions and stop. Smaller: `lo++`. Larger: `hi--`.
3. Print `IMPOSSIBLE`.

#### Why it is correct

- **Only valid answers:** i < j < lo < hi are distinct sorted places, so they map to distinct original positions, and their values sum to x.
- **It cannot miss one.** Write any answer in sorted order as places i < j < L < H. The loops reach that (i, j). In its sweep, while nothing is printed, lo ≤ L and H ≤ hi: when `lo = L`, the sum is at least x because v[hi] ≥ v[H], so only `hi` moves (or an answer is printed); when `hi = H`, the sum is at most x because v[lo] ≤ v[L], so only `lo` moves. The window shrinks one step at a time, so it reaches (L, H) at the latest, where the sum is x.

#### Dry run

`8 15` / `3 2 5 8 1 3 2 3`. Sorted values with original positions: 1 (5), 2 (2), 2 (7), 3 (1), 3 (6), 3 (8), 5 (3), 8 (4). The comparator sort is stable, so equal values keep their original order.

| i | j | lo | hi | v[i] + v[j] + v[lo] + v[hi] | Action |
|---|---|---|---|---|---|
| 0 | 1 | 2 | 7 | 1 + 2 + 2 + 8 = 13 | lo++ |
| 0 | 1 | 3 | 7 | 1 + 2 + 3 + 8 = 14 | lo++ |
| 0 | 1 | 4 | 7 | 14 | lo++ |
| 0 | 1 | 5 | 7 | 14 | lo++ |
| 0 | 1 | 6 | 7 | 1 + 2 + 5 + 8 = 16 | hi--, sweep ends |
| 0 | 2 | 3 | 7 | 14 | lo++ |
| 0 | 2 | 4 | 7 | 14 | lo++ |
| 0 | 2 | 5 | 7 | 14 | lo++ |
| 0 | 2 | 6 | 7 | 16 | hi--, sweep ends |
| 0 | 3 | 4 | 7 | 1 + 3 + 3 + 8 = 15 | found |

Prints `5 1 6 4`: positions 5, 1, 6, 4 hold 1 + 3 + 3 + 8 = 15.

Second dry run, `4 9` / `4 1 2 3`: sorted 1, 2, 3, 4. Only i = 0, j = 1: 1 + 2 + 3 + 4 = 10 > 9, hi-- ends the sweep. Prints `IMPOSSIBLE`.

#### Java code

```java title="Approach 1: sort positions, fix two, two pointers"
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

        for (int i = 0; i < n - 3; i++) {
            for (int j = i + 1; j < n - 2; j++) {
                int lo = j + 1, hi = n - 1;
                while (lo < hi) {
                    long sum = v[i] + v[j] + v[lo] + v[hi]; // up to 4 * 10^9: long
                    if (sum == x) {
                        System.out.println((order[i] + 1) + " " + (order[j] + 1) + " "
                                + (order[lo] + 1) + " " + (order[hi] + 1));
                        return;
                    }
                    if (sum < x) lo++;
                    else hi--;
                }
            }
        }
        System.out.println("IMPOSSIBLE");
    }
}
```

#### Time complexity

**O(n³) worst case:** the O(n log n) sort (for object arrays the JDK implementation note describes a stable, adaptive mergesort), then for each of about n²/2 pairs (i, j) a sweep of at most n − j − 2 steps, about n³/6 ≈ 1.7 · 10^8 steps at n = 1000. Measured: 0.29 s for the whole program at n = 1000 with no answer (random even values, odd x).

#### Space complexity

**O(n):** `order` and `v`.

#### The bridge to the next approach

> "This passes, but it's cubic, and it treats the four values as 'two fixed, two searched'. What if I treat them as two pairs? There are only about 5 · 10^5 pairs. If I had every pair sum in a hash map, each pair (c, d) would just look up x − a[c] − a[d]. The catch is that the stored pair might share a position with (c, d). I need to control which pairs are in the map when I look up."

### Approach 2: pair sums in a hash map, inserted only once they are safe (recommended)

#### What I say out loud

> "I let c run over positions as the third position of the answer. For each d after c, I look up x − a[c] − a[d] in a map from pair sum to one pair. Only after finishing all d do I insert the pairs (p, c) for every p < c. So whenever I look up, every pair in the map ends before c: it can't overlap with (c, d). And any answer p < q < c < d is caught when the loop is at c, because (p, q) was inserted when the loop finished q. O(n²) map operations, expected."

#### Intuition

Split the four sorted-by-position indices p < q < c < d into a left pair (p, q) and a right pair (c, d). The left pair lies entirely before c. If the map contains exactly the pairs that lie before c, every hit is automatically disjoint from (c, d), and every answer's left pair is there in time. Then the map only needs *one* pair per sum, because every stored pair is equally safe.

#### Algorithm

1. Read n, x, a. `pairs` = empty `HashMap<Integer, Integer>` from pair sum to a pair (p, q), encoded as p · n + q.
2. For c from 0 to n − 1:
   1. For d from c + 1 to n − 1: `need = x − a[c] − a[d]`. If `pairs` has `need` → (p, q), print p + 1, q + 1, c + 1, d + 1 and stop.
   2. For p from 0 to c − 1: insert `a[p] + a[c] → (p, c)` unless that sum is already present.
3. Print `IMPOSSIBLE`.

Types: a pair sum is at most 2 · 10^9 ≤ 2,147,483,647, and `need` is at least 1 − 2 · 10^9, so both fit in an `int`. The encoding p · n + q is below 10^6. No four-value sum is ever formed, so nothing here can overflow.

#### Why it is correct

- **Invariant:** when the lookups for c start, `pairs` contains a pair for exactly those sums that some pair (p, q) with p < q < c has, and every stored pair has p < q < c. (Pairs (p, q) are inserted at the end of iteration q, so after iterations 0..c − 1, exactly the pairs with q ≤ c − 1 have been offered.)
- **Only valid answers:** a hit (p, q) for (c, d) has p < q < c < d, so the four positions are distinct, and a[p] + a[q] = need = x − a[c] − a[d].
- **It cannot miss one:** take any answer and sort its positions: p < q < c < d. At the loop for this c, (p, q) has already been offered, so the sum a[p] + a[q] is a key, and the lookup for this d finds it. The stored pair may be a different pair (p′, q′) with the same sum, but it also satisfies q′ < c, so the printed answer is valid. The program therefore stops at this (c, d) or earlier.
- **Why the insert must come after the lookups:** if (p, c) were inserted before scanning d, a lookup for (c, d) could hit a pair that contains c itself.

**The 30-second version:** "Four values are two pairs. I sweep c as the third position; for each d after c I look up the complementary pair sum, and only after that do I add the pairs ending at c. So the map only ever holds pairs entirely before c: hits never overlap, and any answer p < q < c < d is found at c because (p, q) was added at q. One pair per sum is enough, since any stored pair is safe. O(n²) expected."

#### Dry run

`8 15` / `3 2 5 8 1 3 2 3` (0-based positions).

| c | a[c] | Lookups need = 15 − a[c] − a[d], for d > c | Hit? | Pair sums in the map afterwards |
|---|---|---|---|---|
| 0 | 3 | 10, 7, 4, 11, 9, 10, 9 | no (map empty) | none |
| 1 | 2 | 8, 5, 12, 10, 11, 10 | no (map empty) | 5 = (0, 1) |
| 2 | 5 | 2, 9, 7, 8, 7 | no | 5, 7 = (1, 2), 8 = (0, 2) |
| 3 | 8 | d = 4: 6, d = 5: 4, d = 6: 5 | yes: 5 → (0, 1) | stop |

Prints `1 2 4 7`: 3 + 2 + 8 + 2 = 15. Notice row c = 1, d = 3: need = 5 is exactly a[0] + a[1], the pair that ends at c = 1 itself. It is not in the map yet, which is the point; inserting it early would print the invalid `1 2 2 4`.

Second dry run, `4 9` / `4 1 2 3`: c = 0 looks up 4, 3, 2 (empty map); c = 1 looks up 6, 5 (empty), then adds 5 = (0, 1); c = 2 looks up 9 − 2 − 3 = 4 (map {5}), then adds 6 and 3; c = 3 has no d. Prints `IMPOSSIBLE`.

#### Java code

```java title="Approach 2: pair sums in a hash map, inserted after the lookups (recommended)"
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

        // pair sum -> one pair (p, q) with p < q < c, stored as p * n + q.
        HashMap<Integer, Integer> pairs = new HashMap<>();
        for (int c = 0; c < n; c++) {                       // the third position of the answer
            for (int d = c + 1; d < n; d++) {               // the fourth position
                int need = x - a[c] - a[d];                 // >= 1 - 2 * 10^9: fits in int
                Integer pq = pairs.get(need);
                if (pq != null) {
                    int p = pq / n, q = pq % n;
                    System.out.println((p + 1) + " " + (q + 1) + " " + (c + 1) + " " + (d + 1));
                    return;
                }
            }
            for (int p = 0; p < c; p++) {                   // now pairs ending at c become usable
                pairs.putIfAbsent(a[p] + a[c], p * n + c);  // a pair sum is at most 2 * 10^9: fits in int
            }
        }
        System.out.println("IMPOSSIBLE");
    }
}
```

#### Time complexity

**O(n²) expected,** assuming hash codes spread well: n(n − 1)/2 lookups and at most as many inserts, about 5 · 10^5 each at n = 1000. Under heavy collisions each operation is slower; current Java versions turn a crowded bucket into a balanced tree, which keeps an `Integer` lookup near O(log n), but that is implementation behaviour, not an API guarantee. Measured: 0.16 s for the whole program at n = 1000 with no answer and about 5 · 10^5 distinct pair sums, against 0.29 s for Approach 1.

#### Space complexity

**O(n²):** up to n(n − 1)/2 = 499,500 entries, each a map node plus a boxed key and value. Measured peak memory of the whole JVM process: about 94 MB, against about 43 MB for Approach 1 on the same input. Well within 512 MB, but it is the price of the faster time.

All three programs on this page pass the 12 official CSES tests stored with the site (checked for validity, since any answer is accepted) and the randomized tests in the test file.

## 5. Comparison table

n is the number of values. Expected and worst case differ only where hashing is involved.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Alt. Every quadruple | O(n⁴) | O(n⁴), 10.2 s at n = 1000 | O(1) |
| 1. Sort + fix two + two pointers | O(n³) | O(n³) (plus the sort), 0.29 s at n = 1000 | O(n) |
| 2. Pair sums in a hash map | O(n²), if hash codes spread well | Slower under heavy collisions; about O(n² log n) with current Java tree buckets for `Integer` keys (not an API guarantee); 0.16 s measured | O(n²), about 50 MB more than Approach 1 measured |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Alt. Every quadruple | Trivially correct | 4 · 10^10 sums at the limit | Only as the stated baseline or a test oracle |
| 1. Fix two + two pointers | Worst-case guarantee; O(n) memory; same code shape as 3Sum and 4Sum | Cubic: fine at n = 1000, not at n = 5000 | When memory is tight, or hashing is not trusted |
| 2. Pair-sum map | Asymptotically best; fastest measured; never forms a four-value sum | O(n²) memory; the insert order is a subtle correctness point; expected, not guaranteed | The answer to give, with the insert-order argument |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2. It is the only one that beats cubic time, and the existence-only question ("print any one answer") is exactly what makes it work: one pair per sum is enough. Present the insert-after-lookup rule together with the proof that it is both safe and complete, because that rule is what the interviewer will probe.

**When Approach 1 is the better answer:** if the interviewer cares about memory, wants a worst-case guarantee, or you are short on time. At n ≤ 1000 it passes comfortably (0.29 s measured), and it is the same code as the three-value problem with one more loop. Starting with it and then offering Approach 2 is a strong sequence.

**Where to stop:** O(n²) is already the number of pairs, and a method that looks at every pair sum cannot do better. For this problem there is nothing worth gaining beyond it.

## 7. Interview script: code it and test it

### What I say while coding

> "The outer loop is c, the third position. The lookups for every d > c come first; the inserts of pairs (p, c) come after. That order is the correctness argument, so I'm writing a comment on it."

> "Keys are pair sums, at most 2 · 10^9, which fits in an `int`. I store a pair as p · n + q in one `Integer` to avoid allocating an array per entry."

> "`putIfAbsent` keeps the first pair seen for each sum. Any stored pair works, so either `put` or `putIfAbsent` is fine."

### Testing out loud

**Example `8 15` / `3 2 5 8 1 3 2 3`:** nothing found for c = 0, 1, 2; at c = 3, d = 6 (value 2) needs 5, which is (0, 1). Prints `1 2 4 7`: 3 + 2 + 8 + 2 = 15.

**`4 9` / `4 1 2 3`:** the only quadruple sums to 10. Prints `IMPOSSIBLE`.

**n ≤ 3:** for any c there are too few positions on one side; no lookup can hit, because a hit needs q < c < d. Prints `IMPOSSIBLE`.

**`4 7` / `3 1 2 1`:** at c = 2 (value 2), d = 3 (value 1) needs 4 = a[0] + a[1], stored at the end of c = 1. Prints `1 2 3 4`.

**`4 1000000000` / four times `1000000000`:** need = 10^9 − 2 · 10^9 = −10^9, never a key. Prints `IMPOSSIBLE`.

**n = 1000, no answer:** 499,500 lookups and inserts; 0.16 s measured.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 3 min | Distinct positions, any answer, 1-based, sizes and overflow |
| Baseline and first improvement | 5 min | O(n⁴), then sort + two pointers for O(n³) |
| Pair idea | 5 min | Two pairs, the overlap problem, insert after lookup |
| Proof | 4 min | Safe (p < q < c < d) and complete (added at q) |
| Code | 8 min | The two inner loops in the right order |
| Test | 4 min | Example, n < 4, a value used twice, the 4 · 10^9 case |

If the pair idea does not come, code Approach 1: it passes, and you can describe the pair idea in words afterwards.

## 9. Interviewer challenges

### About correctness

#### Why insert the pairs (p, c) only after the lookups for c?

**What they are testing:** whether you can find the overlap bug and prove the fix.

**How to reason:** look at which pairs can share a position with (c, d).

**What I say:** "A stored pair overlaps (c, d) only if it contains c or d. Pairs are inserted with their larger position as the current loop index, so after iterations 0..c − 1 every stored pair has both positions below c. If I inserted the pairs ending at c first, the lookup for (c, d) could hit (p, c). On the example that prints `1 2 2 4`, position 2 twice."

**Nuance:** an alternative fix is to store a list of pairs per sum and check overlaps, but a lookup may then walk past many overlapping pairs (up to about 2n of them contain c or d), so the O(n²) bound is lost.

#### Why is one pair per sum enough? What if the stored pair overlaps?

**What they are testing:** whether you see that the order removes the overlap question entirely.

**How to reason:** every stored pair has both positions below c, and c < d.

**What I say:** "At lookup time, every pair in the map lies strictly before c. So whichever pair the map keeps for a sum, it is disjoint from (c, d). That's why one pair per sum is enough, and it only works because we need just one answer, not all of them."

**Nuance:** counting all quadruples keeps a count per sum instead of a pair, with the same order trick.

#### Can the search miss an answer whose positions are not in the order p < q < c < d?

**What they are testing:** whether you are confusing positions with the order of output.

**How to reason:** any set of four distinct positions can be sorted.

**What I say:** "Any answer is a set of four positions; sort them and call them p < q < c < d. The loop catches that sorted form when it is at c."

**Nuance:** the printed order follows the search, which is fine because any order is accepted.

### About cost

#### How much memory does the map really use, and is it worth it?

**What they are testing:** honesty about trade-offs.

**How to reason:** count entries, estimate per-entry cost, compare with the alternative.

**What I say:** "Up to 499,500 entries. Each is a hash map node plus a boxed key and value, tens of bytes each. I measured the JVM's peak at about 94 MB against 43 MB for the cubic version, and time 0.16 s against 0.29 s. Within 512 MB it's worth it; under a tight memory limit I'd use Approach 1."

**Nuance:** a primitive open-addressing table of `int` keys would cut the memory several times, but it is more code than this problem needs.

#### Where do the sums overflow?

**What they are testing:** overflow bounds from the constraints.

**How to reason:** compute the largest pair sum and the largest four-value sum separately.

**What I say:** "Four values reach 4 · 10^9, beyond `int`, so Approach 1 sums in `long`. Approach 2 never forms a four-value sum: pair sums reach 2 · 10^9 ≤ 2,147,483,647, and `need` is at least 1 − 2 · 10^9, both `int`."

**Nuance:** with these limits even an `int` sum in Approach 1 happens to give correct answers: a wrapped sum is negative, so it never equals x, and an overflow while the answer is still inside the window would need a value above 10^9. I ran 1.5 million random inputs built to overflow without a failure. That is a property of the limits, not a reason to use `int`.

## 10. Follow-up questions the interviewer might ask

**"Return all distinct value quadruples with sum x."**
That is [[nc-4sum|4Sum]]. The pair map does not list all answers efficiently; sort, fix two values with duplicate skipping, and two-pointer the rest. O(n³).

**"Three values instead of four."**
[[cses-sum-of-three-values|Sum of Three Values]]: sort positions and fix one value with two pointers, O(n²). The pair trick does not help, since three values do not split into two pairs.

**"Count the quadruples of positions with sum x."**
The same loop with a map from sum to the number of pairs before c: for each d add `count[need]`, then add the pairs ending at c. O(n²) expected; the count can reach C(1000, 4) ≈ 4.1 · 10^10, so it needs a `long`.

**"Four separate arrays, one value from each."**
Store all sums of the first two arrays in a count map and look up the complement for every pair from the other two. No overlap issue, because the arrays are different. O(n²) expected.

**"General k."**
Meet in the middle: sums of ⌈k/2⌉ positions in a map and the rest looked up, O(n^⌈k/2⌉) entries, with the same ordering idea to keep positions distinct; or recursive fixing down to two pointers in O(n^(k−1)).

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Storing all pair sums first, then looking up.** Then a hit can share a position with (c, d). An overlap check restores validity, but then you owe a separate argument that skipping an overlapping hit never loses an answer, since the map keeps only one pair per sum. The insert-after-lookup order gives validity and completeness together, with a two-line proof.
- **Proving only that hits are valid.** The completeness half (an answer's left pair is already in the map at c) is the part interviewers ask about.
- **Dismissing O(n³) for n = 1000.** It is 1.7 · 10^8 simple steps, 0.29 s measured. It is a valid answer; the pair map is an improvement, not a necessity.

### Implementation mistakes

> [!MISTAKE] Inserting the pairs ending at c before the lookups
> Moving the insert loop above the `d` loop prints `1 2 2 4` on the example (verified): 3 + 2 + 2 + 8 with position 2 used twice. On `4 7` / `3 1 2 1` it prints `1 2 2 3` (verified). Insert after the lookups.

- **A four-value sum in `int`** in Approach 1. It happens to survive these limits (section 9), but write `long`.
- **Printing sorted places instead of original positions** in Approach 1. Carry `order` through the sort.
- **Decoding p · n + q with the wrong base,** for example dividing by 1000 when n is smaller. Encode and decode with the same n.

## 12. Pattern recognition

**The pattern:** meet in the middle on pair sums. A sum of four becomes "pair sum + pair sum": store one half, look up the other. When the pieces come from one array, process positions in order and insert a piece only once every later lookup is guaranteed not to overlap it.

**Signals in the problem statement:**

- k = 4 values from one array, n around 1000: n² pairs fit in memory, n³ is borderline, n⁴ is out.
- Only one answer is needed, so one pair per sum suffices.
- "Distinct positions": the overlap question has to be answered by the order of insertion.

**Related problems in this list:**

- [[cses-sum-of-three-values|Sum of Three Values]]: one fixed value plus two pointers, O(n²).
- [[cses-sum-of-two-values|Sum of Two Values]]: the look-up-then-insert pattern with single values; this problem applies it to pairs.
- [[nc-4sum|4Sum]]: all distinct quadruples, where two fixed values plus two pointers is the standard answer.
- [[nc-3sum|3Sum]]: the sweep with duplicate skipping.
- [[nc-two-sum|Two Sum]]: the same "look up first, then insert" order that keeps an element from pairing with itself.

**Takeaway:** for "find k elements summing to x", split them into two halves, store one half in a map, and choose the insertion order so that everything in the map is disjoint from what you look up with.

## 13. 60-second revision card

**Key insight:** four values are two pairs. Sweep c as the third position: look up x − a[c] − a[d] for every d > c, then add the pairs (p, c). The map only holds pairs before c, so hits are disjoint and every answer is found at its third position.

**Invariant:** at the lookups for c, the map holds one pair for every sum of a pair (p, q) with q < c, and nothing else.

**Complexity:** O(n²) expected time, O(n²) space (about 5 · 10^5 entries at n = 1000).

**Code skeleton:**

```java title="Sum of Four Values, pair-sum map"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(st.nextToken()), x = Integer.parseInt(st.nextToken());
        int[] a = new int[n];
        st = new StringTokenizer(in.readLine());
        for (int i = 0; i < n; i++) a[i] = Integer.parseInt(st.nextToken());
        HashMap<Integer, Integer> pairs = new HashMap<>();
        for (int c = 0; c < n; c++) {
            for (int d = c + 1; d < n; d++) {
                Integer pq = pairs.get(x - a[c] - a[d]);
                if (pq != null) {
                    System.out.println((pq / n + 1) + " " + (pq % n + 1) + " " + (c + 1) + " " + (d + 1));
                    return;
                }
            }
            for (int p = 0; p < c; p++) pairs.putIfAbsent(a[p] + a[c], p * n + c);
        }
        System.out.println("IMPOSSIBLE");
    }
}
```

**Main traps:**

- Insert the pairs ending at c only after the lookups for c.
- Pair sums fit in `int` (2 · 10^9); a four-value sum does not (4 · 10^9).
- Decode p · n + q with the same n; print 1-based positions.

**What to say in one breath:** "Split the four values into a left pair and a right pair. Sweep the right pair's first position c: look up the complement of every (c, d), then add the pairs ending at c. Everything in the map is before c, so hits never overlap and any answer is found. O(n²) expected time and memory; the cubic two-pointer version is the safe fallback."
