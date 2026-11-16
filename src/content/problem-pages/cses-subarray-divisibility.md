---
problemId: cses-subarray-divisibility
title: Subarray Divisibility
source: cses
sourceUrl: https://cses.fi/problemset/task/1662
difficulty: medium
patterns: [sorting-searching, prefix-sum, frequency-counting, mathematics]
relatedLessons: [a2-prefix-suffix, a2-frequency-counting, a2-hashing, a1-java-syntax-competitive, a14-deriving-optimization]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

You get an array of n integers, which may be negative. Count the subarrays (contiguous, non-empty runs of elements) whose sum is divisible by n, the length of the array itself. This is a whole program: it reads standard input and writes standard output.

**Example 1**

- Input: `5` on the first line, `3 1 2 7 4` on the second
- Output: `1`
- Why: only `1 2 7` (positions 2 to 4) has a sum divisible by 5, namely 10. Every other subarray's sum, such as 3, 4, 13 or 17, leaves a remainder.

**Example 2** (an extra example: the CSES statement has only one)

- Input: `4` on the first line, `5 -65 -67 -67` on the second
- Output: `2`
- Why: `5 -65` sums to −60 and `-65 -67` to −132, both multiples of 4. Negative multiples count: −60 = 4 · (−15).

**What the problem statement guarantees**

- 1 ≤ n ≤ 2 · 10^5.
- −10^9 ≤ a_i ≤ 10^9.
- The first line has n, the second line the n integers.
- Time limit: 1 second (memory limit 512 MB).

## 2. Practice first: try it before reading on

If you have not solved this yourself yet, stop here. The problem looks like a twin of "count subarrays with sum x", and it is, with two twists: the condition is about remainders, and the divisor is n itself. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 20 minutes.
2. Write a correct quadratic program first and estimate its running time at n = 2 · 10^5.
3. Find an O(n) idea, and decide what data structure counts what.
4. Test your program on an input with negative values before trusting it.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> A subarray sum is the difference of two running totals. When is a difference of two numbers divisible by n, in terms of the two numbers alone?

> [!HINT] Hint 2: the kind of tool you need
> Two running totals give a divisible difference exactly when they leave the same remainder mod n. So you need, for each remainder, how many running totals have it. There are only n possible remainders. Be careful: in Java, `-7 % 5` is `-2`, not `3`.

> [!HINT] Hint 3: almost the whole plan
> Make an `int[n]` of counters, set counter[0] = 1 for the empty prefix, sweep the array keeping the remainder of the running total in 0..n − 1 (normalise with `((r % n) + n) % n`), and increment its counter. The answer is the sum over remainders of c(c − 1)/2, in `long`.

**Check yourself before revealing the walkthrough**

- [ ] I can say why two prefix sums with the same remainder give a divisible subarray
- [ ] My program prints 2 on `4` / `5 -65 -67 -67`, not 1
- [ ] I know the largest possible answer and which type holds it
- [ ] I can explain why the answer is never 0

## 3. Interview script: understand the problem (≈2 min)

I treat it as if an interviewer had posed it. The questions are about the divisor, negative sums and the size of the answer.

**Me:** I count pairs l ≤ r with a_l + … + a_r divisible by n, where n is the number of elements. The divisor is the array length itself, not a separate input?

**Interviewer:** Yes, the length of the array.

**Me:** Values can be negative, so sums can be negative. A negative multiple of n, like −10 for n = 5, counts as divisible? And 0 counts?

**Interviewer:** Yes to both: divisible means the sum is n times some integer.

**Me:** Let me check the example: `3 1 2 7 4`, n = 5. The running totals are 3, 4, 6, 13, 17. The sum of `1 2 7` is 13 − 3 = 10, divisible. Scanning all 15 subarrays by hand, that is the only one. So 1.

**Me:** Sizes: a sum can reach 2 · 10^14 in absolute value, so sums in `long` (or I keep only remainders). The answer can be as large as the number of subarrays, n(n + 1)/2 = 20,000,100,000 at n = 2 · 10^5, for example all zeros: beyond `int`, so `long`. Fast input with `BufferedReader`.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 2 · 10^5 | n²/2 = 2 · 10^10: too slow. O(n) or O(n log n). The divisor n is also the number of remainders, so an `int[n]` of counters is 800 KB. |
| −10^9 ≤ a_i ≤ 10^9 | Negative sums: Java's `%` returns negative remainders, which must be normalised. Sums up to 2 · 10^14: `long`, or keep only remainders. |
| Time limit 1 s, memory 512 MB | Fast input. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| The divisor is n, the array's length | Remainders are 0..n − 1: an array of n counters, no hashing needed. |
| Negative multiples and 0 are divisible | `sum % n == 0` is the test; for remainders, −10 and 0 and 5 must all land in class 0. |
| One integer of output | One `println`. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| Numbers may be split over lines differently | The reader takes tokens until it has n of them. |

### Edge cases I will keep in mind

- n = 1: every sum is divisible by 1, so the answer is 1.
- All zeros, or all values multiples of n: every subarray counts, n(n + 1)/2.
- Negative values whose prefix sums go below 0: remainders must be normalised.
- A subarray starting at the first element: it needs the empty prefix (remainder 0).

## 4. Think out loud: from first idea to best solution

Throughout: **n** is the length of the array and also the divisor; **P(j)** is the sum of the first j elements, with P(0) = 0, so the sum of the subarray from 0-based index i to j − 1 is P(j) − P(i). **r(j)** is the remainder of P(j) mod n, taken in 0..n − 1.

The most literal program sums every subarray from scratch in three nested loops, O(n³); it is written out on [[cses-subarray-sums-ii|Subarray Sums II]]. Here I start one step later, with the running sum.

### Alternative: every start, with a running sum

Too slow for the largest tests (18.1 s measured at n = 2 · 10^5), so not a numbered approach. It is the baseline to state and a test oracle.

#### What I say out loud

> "Fix a start, extend the end to the right keeping a running sum, and count every time the sum is divisible by n. That's n(n + 1)/2 steps, 2 · 10^10 at the limit: correct but too slow. It does tell me that for each end I'm asking how many starts give a divisible sum."

#### Intuition

One addition per subarray instead of re-summing. `sum % n == 0` is true for negative multiples too, since a zero remainder is zero whatever the sign.

#### Algorithm

1. `count = 0`.
2. For each start l: `sum = 0`; for each end r from l: `sum += a[r]`; if `sum % n == 0`, `count++`.
3. Print `count`.

#### Why it is correct

- **Invariant:** when the test runs, `sum` equals a[l] + … + a[r] exactly (a `long`, so no overflow).
- **Every subarray is tested once:** the loops enumerate each pair l ≤ r once.
- **The test is right for negative sums:** Java's `%` gives a result with the sign of the dividend, but it is 0 exactly when n divides the sum.

#### Dry run

Input `5` / `3 1 2 7 4`.

| l | Running sums for r = l, l + 1, … | Divisible by 5 | count after |
|---|---|---|---|
| 0 | 3, 4, 6, 13, 17 | none | 0 |
| 1 | 1, 3, 10, 14 | 10 (r = 3) | 1 |
| 2 | 2, 9, 13 | none | 1 |
| 3 | 7, 11 | none | 1 |
| 4 | 4 | none | 1 |

Prints `1`.

#### Java code

```java title="Alternative: every start with a running sum (too slow at n = 2 · 10^5)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] a = readNumbers(in, n);
        System.out.println(countByRunningSum(a));
    }

    /** Fixes each start l, extends the end r, and tests the running sum of a[l..r]. */
    static long countByRunningSum(int[] a) {
        int n = a.length;
        long count = 0;
        for (int l = 0; l < n; l++) {
            long sum = 0;                          // long: |sum| <= 2 * 10^14
            for (int r = l; r < n; r++) {
                sum += a[r];
                if (sum % n == 0) {                // true for negative multiples too
                    count++;
                }
            }
        }
        return count;
    }

    static int[] readNumbers(BufferedReader in, int count) throws IOException {
        int[] a = new int[count];
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < count; i++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            a[i] = Integer.parseInt(st.nextToken());
        }
        return a;
    }
}
```

#### Time complexity

**O(n²)**: n(n + 1)/2 additions and remainder tests. Measured on my machine (JDK 26): 18.1 s for the whole program at n = 2 · 10^5 with random values in −10^9..10^9, against a 1 s limit.

#### Space complexity

**O(n)** for the array; O(1) beyond it.

#### The bridge to the next approach

> "The subarray from i to j − 1 has sum P(j) − P(i). That's divisible by n exactly when P(j) and P(i) leave the same remainder. So I don't care about the prefix sums themselves, only their remainders: for each end, I need the number of earlier prefixes with the same remainder. That's the Subarray Sums II trick, with 'equal remainder' instead of 'differ by x'. A hash map from remainder to count does it in one pass."

### Approach 1: Prefix remainders with a hash map of counts

#### What I say out loud

> "One pass with a running prefix sum. I keep a hash map from remainder to how many prefixes so far had it, seeded with {0: 1} for the empty prefix. For each element I update the sum, take its remainder normalised into 0..n − 1, add the number of earlier prefixes with that remainder, and record it. O(n) expected."

#### Intuition

Two numbers differ by a multiple of n exactly when they are in the same remainder class. Counting divisible subarrays is counting pairs of prefixes in the same class; each new prefix pairs with every earlier one in its class.

#### Algorithm

1. `seen = {0: 1}`, `prefix = 0`, `count = 0`.
2. For each value v: `prefix += v`; `r = ((prefix % n) + n) % n`; `count += seen.get(r)` (0 if absent); `seen[r]++`.
3. Print `count`.

#### Why it is correct

- **The key equivalence:** n divides P(j) − P(i) if and only if P(j) and P(i) have the same remainder in 0..n − 1. (Write P = qn + r with 0 ≤ r < n; the difference is a multiple of n plus r(j) − r(i), and |r(j) − r(i)| < n, so it is a multiple of n only when r(j) = r(i).)
- **Normalisation:** Java's `prefix % n` lies in −(n − 1)..n − 1 with the sign of `prefix`. Adding n and taking `% n` again maps it into 0..n − 1 without changing its class, so −7 and 3 both become 3 for n = 5.
- **Invariant:** before element j, `seen[c]` counts the i ≤ j with r(i) = c. Element j's lookup then counts the starts i of the divisible subarrays ending at j, and its insert (after the lookup) restores the invariant.
- **Each divisible subarray is counted once,** at its last element; the empty subarray never is, since the lookup comes first.

#### Dry run

Input `5` / `3 1 2 7 4`.

| Value | prefix | r | Earlier prefixes with r | count | Map after |
|---|---|---|---|---|---|
| start | 0 | 0 | | 0 | {0: 1} |
| 3 | 3 | 3 | 0 | 0 | {0: 1, 3: 1} |
| 1 | 4 | 4 | 0 | 0 | + {4: 1} |
| 2 | 6 | 1 | 0 | 0 | + {1: 1} |
| 7 | 13 | 3 | 1 | 1 | {3: 2} |
| 4 | 17 | 2 | 0 | 1 | + {2: 1} |

The match at value 7 pairs P(4) = 13 with P(1) = 3: the subarray `1 2 7`. Prints `1`.

#### Java code

```java title="Approach 1: prefix remainders with a hash map"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] a = readNumbers(in, n);

        Map<Long, Integer> seen = new HashMap<>(); // remainder of a prefix sum -> how many so far
        seen.put(0L, 1);                           // the empty prefix has sum 0
        long prefix = 0;
        long count = 0;
        for (int value : a) {
            prefix += value;                       // long: |prefix| <= 2 * 10^14
            long r = ((prefix % n) + n) % n;       // in 0..n-1 even when prefix < 0
            count += seen.getOrDefault(r, 0);      // earlier prefixes with the same remainder
            seen.merge(r, 1, Integer::sum);
        }
        System.out.println(count);
    }

    static int[] readNumbers(BufferedReader in, int count) throws IOException {
        int[] a = new int[count];
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < count; i++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            a[i] = Integer.parseInt(st.nextToken());
        }
        return a;
    }
}
```

#### Time complexity

**O(n) expected**: n lookups and updates at O(1) each on average, assuming the keys spread over the buckets. Here the keys are small, 0..n − 1, so they are not under the input's control the way arbitrary prefix sums are in Subarray Sums II. Measured: 0.07–0.12 s for the whole program at n = 2 · 10^5.

#### Space complexity

**O(n) expected**: at most n map entries (one per remainder), each with boxed key and value.

#### The bridge to the next approach

> "The keys of my map are exactly the integers 0 to n − 1. A hash map over a dense range of small integers is an array with extra steps: boxing, hashing, nodes. I'll use an `int[n]`. And once I have the counts per remainder, I don't even need to add as I go: a class with c prefixes contributes c(c − 1)/2 pairs."

### Approach 2: Remainder counts in an array (recommended)

#### What I say out loud

> "I keep an `int` array of n counters, one per remainder, with counter[0] = 1 for the empty prefix. I sweep once keeping only the remainder of the running sum, normalised into 0..n − 1, and increment its counter. Then every pair of prefixes in the same class is one divisible subarray, so the answer is the sum of c(c − 1)/2, computed in `long`. O(n) time, deterministic, O(n) memory."

#### Intuition

The n + 1 prefixes fall into n remainder classes. Divisible subarrays are exactly the pairs inside a class. Count the class sizes, then count pairs with the formula.

#### Algorithm

1. `prefixes = new int[n]`, `prefixes[0] = 1`, `r = 0`.
2. For each value v: `r = ((r + v % n) % n + n) % n`; `prefixes[r]++`.
3. `count = 0` (`long`); for each c in `prefixes`: `count += (long) c * (c − 1) / 2`.
4. Print `count`.

#### Why it is correct

- **Remainders compose:** the remainder of P(j + 1) = P(j) + v depends only on r(j) and v mod n, so I never need the full sum. `v % n` is in −(n − 1)..n − 1, `r + v % n` is in −(n − 1)..2n − 2, and the outer `(… % n + n) % n` brings it into 0..n − 1. Every intermediate value is below 3n ≤ 6 · 10^5, so `int` is safe.
- **After the sweep, `prefixes[c]`** is the number of indices i in 0..n with r(i) = c (the empty prefix counted in class 0).
- **Pairs inside a class are the answer:** by the equivalence in Approach 1, a pair i < j is a divisible subarray exactly when r(i) = r(j). A class of size c contains c(c − 1)/2 such pairs, and different classes share none.
- **Why `long`:** c can be n + 1 = 200,001 (all zeros), and c(c − 1) = 4 · 10^10 overflows `int`.

The 20-second version: "Subarray sum divisible by n means two prefix sums with equal remainder mod n. I count prefixes per remainder in an `int[n]`, starting with the empty prefix in class 0, normalising Java's negative remainders, and add c(c − 1)/2 per class in `long`. O(n), no hashing."

#### Dry run

Input `4` / `5 -65 -67 -67` (Example 2, where normalisation matters).

| Value | v % 4 | r before | r + v % 4 | Normalised r | Counters [0, 1, 2, 3] after |
|---|---|---|---|---|---|
| start | | | | 0 | [1, 0, 0, 0] |
| 5 | 1 | 0 | 1 | 1 | [1, 1, 0, 0] |
| −65 | −1 | 1 | 0 | 0 | [2, 1, 0, 0] |
| −67 | −3 | 0 | −3 | 1 | [2, 2, 0, 0] |
| −67 | −3 | 1 | −2 | 2 | [2, 2, 1, 0] |

Pairs: class 0 gives 1 (P(0), P(2): `5 -65` = −60), class 1 gives 1 (P(1), P(3): `-65 -67` = −132), class 2 gives 0. Prints `2`.

On Example 1 (`3 1 2 7 4`, n = 5) the remainders are 3, 4, 1, 3, 2 after the empty prefix's 0, so the counters are [1, 1, 1, 2, 1] and the answer is C(2, 2) = 1.

#### Java code

```java title="Approach 2: remainder counts in an array (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] a = readNumbers(in, n);

        int[] prefixes = new int[n];               // prefixes[r]: prefix sums with remainder r
        prefixes[0] = 1;                           // the empty prefix has sum 0
        int r = 0;                                 // remainder of the current prefix sum, 0..n-1
        for (int value : a) {
            r = ((r + value % n) % n + n) % n;     // value % n is in (-n, n): no overflow
            prefixes[r]++;
        }

        long count = 0;                            // up to n(n+1)/2 = 20,000,100,000: long
        for (int c : prefixes) {
            count += (long) c * (c - 1) / 2;       // pairs of prefixes with equal remainders
        }
        System.out.println(count);
    }

    static int[] readNumbers(BufferedReader in, int count) throws IOException {
        int[] a = new int[count];
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < count; i++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            a[i] = Integer.parseInt(st.nextToken());
        }
        return a;
    }
}
```

#### Time complexity

**O(n)**, deterministic: one pass over the values and one over the n counters, with no hashing. Measured: 0.05–0.09 s for the whole program at n = 2 · 10^5, JVM start included.

#### Space complexity

**O(n)**: the n counters (and the input array, which a streaming reader could avoid).

## 5. Comparison table

n is the length of the array and the divisor.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Alt. Running sum per start | O(n²) | O(n²), 18.1 s at n = 2 · 10^5 | O(1) |
| 1. Hash map of remainders | O(n), if keys spread well | O(n²) for chained buckets in theory; the keys are only 0..n − 1 | O(n), boxed entries |
| 2. Array of remainder counts | O(n) | O(n) | O(n) `int`s |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Alt. Running sum | Short, needs no insight | Quadratic | Stating the baseline; a test oracle |
| 1. Hash map | Same code shape as Subarray Sums II; works for any modulus | Boxing, hashing for no gain here | When the modulus is huge (say 10^18) and an array of that size is impossible |
| 2. Array | Deterministic O(n), smallest constant | Needs the modulus to be small enough for an array | This problem: the modulus is n |

## 6. Which solution to give, and when to stop optimizing

**The solution I recommend:** Approach 2. The remainders are 0..n − 1, so an `int[n]` replaces the map, the bound becomes deterministic, and the code is shorter. In an interview, get there by saying Approach 1 first (it is the natural transfer from "subarray sum equals x") and then noticing the keys are a dense small range.

**Is it optimal?** In the worst case a correct algorithm must look at essentially every value, since changing one can change the answer: Ω(n). Approach 2 is O(n). Stop here; the remaining risks are the negative remainder and the `long` answer.

## 7. Interview script: code it and test it

### What I say while coding

> "I keep only the remainder, not the sum, so nothing grows beyond 3n. `value % n` can be negative, so I normalise with `+ n` and a second `% n`."

> "Counter 0 starts at 1: the empty prefix. Without it, subarrays that start at the first element are missed."

> "The pair count uses `(long) c * (c - 1) / 2`. The cast comes before the multiplication; casting the result would be too late."

### Testing out loud

**Example `5` / `3 1 2 7 4`:** counters [1, 1, 1, 2, 1], one pair. Prints 1.

**Example 2, `4` / `5 -65 -67 -67`:** the table above, 2. A version without normalisation computes remainders 1, 0, −3, −2, which splits class 1 into "1" and "−3" and prints 1 (verified).

**n = 1:** every remainder is 0, counters [2], C(2, 2) = 1.

**`3` / `1 1 1`:** remainders 1, 2, 0 after the empty prefix's 0: counters [2, 1, 1], answer 1 (the whole array, sum 3).

**All zeros, n = 2 · 10^5:** one class of 200,001 prefixes, 200,001 · 200,000 / 2 = 20,000,100,000.

**Official tests:** all three programs on this page print the expected answer on the 7 official CSES tests stored with this site (n up to 100), run on a real JVM. The tests for this page add n = 2 · 10^5 inputs (all zeros, all ±10^9, all −1, random) for the two fast approaches.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2 min | Divisor is n, negative multiples count, answer size |
| Ladder | 4 min | Running sum; prefix difference; equal remainders; map, then array |
| Code | 5 min | Fast input, normalised remainder, counter[0] = 1, `long` pairs |
| Test | 3 min | Example, a negative input, n = 1, all zeros |

If stuck, write the prefix sums of the example and their remainders mod 5 under the array, and look for repeated remainders.

## 9. Interviewer challenges

### About the mathematics

#### Can the answer ever be 0?

**What they are testing:** whether you see the structure behind the counting.

**How to reason:** how many prefixes are there, and how many remainder classes?

**What I say:** "No. There are n + 1 prefix sums, P(0) to P(n), and only n remainders. By the pigeonhole principle two of them share a remainder, and that pair is a divisible subarray. So the answer is always at least 1. It's a nice sanity check: if my program ever prints 0, it's wrong."

**Nuance:** this is a classic olympiad fact (any n integers have a non-empty contiguous block whose sum is divisible by n), and it only works because the divisor equals the length.

#### Why normalise? `sum % n == 0` worked fine in the quadratic version.

**What they are testing:** the exact semantics of `%` on negative numbers in Java.

**How to reason:** testing for zero only needs to know whether the remainder is 0; comparing two remainders needs them in the same range.

**What I say:** "Java's `%` takes the sign of the dividend: `-7 % 5` is −2. Testing `== 0` doesn't care about the sign, but here I compare remainders with each other, and −2 and 3 are the same class mod 5. Without normalising, the example `5 -65 -67 -67` prints 1 instead of 2. `Math.floorMod` does the same normalisation in one call."

**Nuance:** Python's `%` already returns a non-negative result for a positive divisor; C, C++, Java and JavaScript do not.

### About implementation

#### Your counters are `int`. Can they overflow? And the answer?

**What they are testing:** precise overflow reasoning.

**How to reason:** bound each quantity from the constraints.

**What I say:** "A counter is at most n + 1 = 200,001, fine for `int`. But c(c − 1) for c = 200,001 is about 4 · 10^10, beyond `int`; so I cast to `long` before multiplying. With `c * (c - 1) / 2` in `int`, all zeros at n = 2 · 10^5 prints 672747168 instead of 20000100000 (I ran it). The total answer is at most n(n + 1)/2 = 20,000,100,000, which needs `long` anyway."

**Nuance:** keeping only remainders also removes the 2 · 10^14 prefix sums from the picture, so `int` suffices for everything except the answer.

## 10. Follow-up questions the interviewer might ask

**"Divisible by k instead of n, with k given."**
The same code with k counters: O(n + k) time and O(k) space. If k is huge (up to 10^18), use a hash map of remainders instead (Approach 1). That is LeetCode's "Subarray Sums Divisible by K".

**"Count subarrays with sum exactly x."**
Pair prefixes with a fixed difference instead of equal remainders; the values are arbitrary, so a hash map (or sorted prefix sums). That is [[cses-subarray-sums-ii|Subarray Sums II]].

**"Find one divisible subarray, not the count."**
Pigeonhole: record the first prefix index for each remainder; the first repeat gives a subarray. O(n), and one always exists.

**"Longest subarray whose sum is divisible by n."**
Keep the first index of each remainder; for each j, the longest ending there starts after first[r(j)]. O(n).

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Treating this as a window problem.** Divisibility is not monotone in the window, with or without negative values.
- **Forgetting that remainders, not sums, are what match.** Looking for P(j) − P(i) = n, 2n, … separately would be hopeless; equal remainders cover every multiple at once.

### Implementation mistakes

> [!MISTAKE] Using `prefix % n` directly as the class
> Java's `%` returns a negative remainder for a negative prefix sum, so one class is split in two. On `4` / `5 -65 -67 -67` the program prints `1` instead of `2` (verified). Normalise with `((p % n) + n) % n` or `Math.floorMod(p, n)`.

- **Not counting the empty prefix.** With `prefixes[0] = 0`, the input `3` / `1 1 1` prints `0` instead of `1` (verified): the only divisible subarray starts at the first element.
- **`c * (c - 1) / 2` in `int`.** All zeros at n = 2 · 10^5 prints `672747168` instead of `20000100000` (verified).
- **An `int` running sum.** It overflows past 2^31 − 1; keep the remainder or use `long`.

## 12. Pattern recognition

**The pattern:** prefix states counted in a table. A subarray property becomes a relation between two prefix states (here: equal remainder), and the answer is the number of related pairs. When the states are a small dense range, the table is an array.

**Signals in the problem statement:**

- "count subarrays" with a divisibility or parity condition.
- A modulus that is small (here, at most 2 · 10^5).
- Negative values, which warn you about `%`.

**Related problems in this list:**

- [[cses-subarray-sums-ii|Subarray Sums II]]: prefix sums with a fixed difference, counted in a hash map.
- [[nc-subarray-sum-equals-k|Subarray Sum Equals K]]: the same counting as a LeetCode method.
- [[cses-subarray-sums-i|Subarray Sums I]]: positive values and a fixed sum, where a two-pointer window works.
- [[cses-subarray-sum-constraints|Subarray Sum Constraints]]: subarray sums as differences of prefix sums, used to build an array instead of count.
- [[cses-static-range-sum-queries|Static Range Sum Queries]]: the plain prefix-sum array, answering range sums in O(1).

**Takeaway:** "subarray sum divisible by m" is "two prefix sums with equal remainder mod m". Count prefixes per remainder, add c(c − 1)/2 per class, and normalise negative remainders.

## 13. 60-second revision card

**Key insight:** n divides P(j) − P(i) exactly when P(i) and P(j) leave the same remainder mod n.

**Invariant:** after the sweep, `prefixes[c]` is the number of prefixes (the empty one included) with remainder c.

**Complexity:** O(n) time, O(n) space, no hashing.

**Code skeleton:**

```java title="Subarray Divisibility, remainder counts"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] prefixes = new int[n];
        prefixes[0] = 1;
        int r = 0;
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < n; i++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(in.readLine());
            int value = Integer.parseInt(st.nextToken());
            r = ((r + value % n) % n + n) % n;
            prefixes[r]++;
        }
        long count = 0;
        for (int c : prefixes) count += (long) c * (c - 1) / 2;
        System.out.println(count);
    }
}
```

**Main traps:**

- Normalise negative remainders.
- `prefixes[0] = 1` for the empty prefix.
- Cast to `long` before c · (c − 1).

**What to say in one breath:** "A subarray sum divisible by n means two prefix sums with the same remainder mod n, so I count prefixes per remainder in an `int[n]`, starting with the empty prefix in class 0, normalising Java's negative remainders, and sum c(c − 1)/2 per class in `long`: O(n), deterministic, and by pigeonhole the answer is never 0."
