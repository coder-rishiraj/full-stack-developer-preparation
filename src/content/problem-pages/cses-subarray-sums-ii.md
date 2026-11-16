---
problemId: cses-subarray-sums-ii
title: Subarray Sums II
source: cses
sourceUrl: https://cses.fi/problemset/task/1661
difficulty: medium
patterns: [sorting-searching, prefix-sum, hashing, frequency-counting]
relatedLessons: [a2-prefix-suffix, a2-hashing, a2-frequency-counting, a3-binary-search, a2-sorting-based, a2-sliding-window, a14-deriving-optimization]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

You get an array of n integers, which may be negative, and a target x. Count the subarrays (contiguous, non-empty runs of elements) whose sum is exactly x. This is a whole program: it reads standard input and writes standard output.

**Example 1**

- Input: `5 7` on the first line, `2 -1 3 5 -2` on the second
- Output: `2`
- Why: `-1 3 5` (positions 2 to 4) sums to 7, and so does the whole array, 2 − 1 + 3 + 5 − 2 = 7. No other run of consecutive elements does.

**Example 2** (an extra example: the CSES statement has only one)

- Input: `5 0` on the first line, `0 0 0 0 0` on the second
- Output: `15`
- Why: every one of the 5 · 6 / 2 = 15 subarrays sums to 0. Equal sums are counted once per subarray, not once per value.

**What the problem statement guarantees**

- 1 ≤ n ≤ 2 · 10^5.
- −10^9 ≤ x, a_i ≤ 10^9: the values and the target can be negative or zero.
- The first line has n and x, the second line the n integers.
- Time limit: 1 second (memory limit 512 MB).

## 2. Practice first: try it before reading on

If you have not solved this yourself yet, stop here. The first correct program is easy to write; the interview is about the climb from it to a linear one, and about the one tempting idea that is wrong here. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 20 minutes.
2. Write the slowest program you are sure is correct, and estimate its running time at n = 2 · 10^5.
3. Remove one loop at a time. For each version, say what repeated work it removes.
4. Work out the largest possible answer and the largest possible sum before choosing your types.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> The sum of a subarray is the difference of two running totals: the total up to its end minus the total before its start. What does "this difference equals x" say about the two totals?

> [!HINT] Hint 2: the kind of tool you need
> Sweep the array once, keeping the running total. When you are at an end position, you need to know how many earlier running totals equal (current total − x). That is a counting question about values you have already seen. Note that negative values make the running total go up and down, so "grow and shrink a window" reasoning does not apply.

> [!HINT] Hint 3: almost the whole plan
> Keep a map from running-total value to how many times it has occurred, starting with {0: 1} for the empty prefix. For each element: add it to the total, add `count[total − x]` to the answer, then increment `count[total]`. Use `long` for the total and the answer. Alternatively, sort the n + 1 running totals once and replace the map with binary search plus a counter array.

**Check yourself before revealing the walkthrough**

- [ ] I can say why a sum of a subarray is a difference of two running totals
- [ ] My program prints 2 for the example and 15 for five zeros with x = 0
- [ ] I know the largest answer (it does not fit in an `int`) and the largest running total
- [ ] I can give a counterexample to the grow-and-shrink window on this problem

## 3. Interview script: understand the problem (≈2 min)

I treat it as if an interviewer had posed it. The questions are about what counts as a subarray, the signs of the values, and the size of the answer.

**Me:** I count pairs of positions l ≤ r such that a_l + … + a_r = x, and print that count. Subarray means contiguous and non-empty?

**Interviewer:** Yes, contiguous, at least one element.

**Me:** Two different subarrays with the same values, say two separate `0`s, count separately?

**Interviewer:** Yes, they are different positions.

**Me:** The values go from −10^9 to 10^9, so they can be negative and zero. That matters: with only positive values I would shrink a window from the left when the sum is too big, but with negatives the sum is not monotone. And the target can be negative or 0 too.

**Interviewer:** Right, anything in that range.

**Me:** Let me do the example by hand: `2 -1 3 5 -2`, x = 7. Starting at the 2: sums 2, 1, 4, 9, 7, so the whole array is one. Starting at −1: −1, 2, 7: that is `-1 3 5`. Starting at 3: 3, 8, 6. At 5: 5, 3. At −2: −2. Two subarrays.

**Me:** Sizes: a sum can reach 2 · 10^5 · 10^9 = 2 · 10^14, beyond `int`, so sums are `long`. The answer can be as large as the number of subarrays, n(n + 1)/2 = 20,000,100,000 for n = 2 · 10^5 (all zeros with x = 0), also beyond `int` (about 2.1 · 10^9), so the answer is a `long` as well. I'll read with a `BufferedReader`, since 2 · 10^5 numbers through `Scanner` is slow.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 2 · 10^5 | n² / 2 is 2 · 10^10 operations: too slow for 1 s. Aim for O(n) or O(n log n). |
| −10^9 ≤ a_i ≤ 10^9 | Negative values: no two-pointer window. Sums up to 2 · 10^14 in absolute value: `long`. |
| −10^9 ≤ x ≤ 10^9 | x = 0 and negative x are allowed; x fits in an `int`, but `total − x` is computed in `long`. |
| Time limit 1 s, memory 512 MB | Fast input; O(n) extra memory is fine. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Subarrays are contiguous and non-empty | An empty subarray (sum 0) must not be counted when x = 0. |
| Different positions count separately | The answer counts pairs (l, r), so it can reach n(n + 1)/2: `long`. |
| Output is one integer | One `println`. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The numbers may be split over lines differently from the statement | My reader takes tokens until it has n, wherever the line breaks are. |

### Edge cases I will keep in mind

- n = 1: the answer is 1 if a_1 = x, else 0.
- x = 0, with zeros or with cancelling values like `1 -1`: many subarrays, and the empty one must not be counted.
- All zeros with x = 0: the largest answer, n(n + 1)/2.
- All values 10^9 (or −10^9): the largest running totals, 2 · 10^14 in absolute value.
- A subarray that starts at position 1: it needs the "empty prefix" (total 0 before the first element).

## 4. Think out loud: from first idea to best solution

Throughout: **n** is the length of the array, and **P(j)** is the sum of the first j elements, the *prefix sum*, with P(0) = 0. The subarray from position i + 1 to position j (1-based) has sum P(j) − P(i), for 0 ≤ i < j ≤ n. Every approach below counts the same pairs (i, j); they differ in how much work each pair costs.

### Alternative: every subarray, summed from scratch

This rung is far too slow for the largest tests (it already takes 1.0 s at n = 2,000), so it is not a numbered approach. It is the definition turned into code, and the place to start.

#### What I say out loud

> "The literal version: choose a start l, choose an end r, add up a[l..r], and compare with x. Three nested loops. It is the definition itself, so it is correct, but it re-adds the same elements over and over: about n³/6 additions, 10^15 at the limit."

#### Intuition

There are n(n + 1)/2 subarrays. Look at each one and test it.

#### Algorithm

1. `count = 0`.
2. For each start l and each end r ≥ l: `sum = 0`; for k from l to r, `sum += a[k]`; if `sum == x`, `count++`.
3. Print `count`.

#### Why it is correct

- **It counts only valid subarrays:** a subarray is counted only after its sum has been computed exactly (in `long`, so no overflow) and found equal to x.
- **It misses none:** the two outer loops enumerate every pair l ≤ r, which is every non-empty contiguous subarray, exactly once.

#### Dry run

Input `5 7` / `2 -1 3 5 -2`. Each row is one start l (0-based); the sums are those of a[l..r] for r = l, l + 1, …, each recomputed from scratch.

| l | Sums for r = l, l + 1, … | Equal to 7 | count after |
|---|---|---|---|
| 0 | 2, 1, 4, 9, 7 | r = 4 | 1 |
| 1 | −1, 2, 7, 5 | r = 3 | 2 |
| 2 | 3, 8, 6 | none | 2 |
| 3 | 5, 3 | none | 2 |
| 4 | −2 | none | 2 |

Prints `2`.

#### Java code

```java title="Alternative: every subarray from scratch (too slow at n = 2 · 10^5)"
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
        int[] a = readNumbers(in, n);
        System.out.println(countByTripleLoop(a, x));
    }

    /** Tries every subarray a[l..r] and adds its elements from scratch. */
    static long countByTripleLoop(int[] a, long x) {
        long count = 0;
        for (int l = 0; l < a.length; l++) {
            for (int r = l; r < a.length; r++) {
                long sum = 0;                      // long: up to 2 * 10^14 in absolute value
                for (int k = l; k <= r; k++) {
                    sum += a[k];
                }
                if (sum == x) {
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

**O(n³)**: the subarray a[l..r] costs r − l + 1 additions, and summed over all pairs that is n(n + 1)(n + 2)/6, about 1.3 · 10^15 at n = 2 · 10^5. Measured on my machine (JDK 26): 1.0 s at n = 2,000 already, and the cost grows with n³, so n = 2 · 10^5 would take about 10^6 times as long.

#### Space complexity

**O(n)** for the array; O(1) beyond it.

#### The bridge to the next approach

> "For a fixed start, the sum of a[l..r + 1] is the sum of a[l..r] plus one element. I'm throwing that away and re-adding from l every time. Keep a running sum per start and the inner loop disappears."

### Alternative: every start, with a running sum

Still too slow for the largest tests (16.4 s measured at n = 2 · 10^5), so not a numbered approach, but it is the natural second step and the one many candidates stop at.

#### What I say out loud

> "Fix the start l and extend the end r to the right, adding one element per step. Every time the running sum equals x, that's a subarray. Quadratic: 2 · 10^10 steps at the limit, so too slow for one second, but it tells me what I'm really asking for each end."

#### Intuition

The sums of a[l..l], a[l..l + 1], a[l..l + 2], … differ by one element each. One addition per subarray instead of up to n.

#### Algorithm

1. `count = 0`.
2. For each start l: `sum = 0`; for each end r from l to n − 1: `sum += a[r]`; if `sum == x`, `count++`.
3. Print `count`.

#### Why it is correct

- **Invariant:** at the moment the inner loop tests `sum == x`, `sum` equals a[l] + … + a[r]. It starts at 0 before r = l and gains exactly a[r] at step r.
- So each subarray is tested exactly once with its exact sum, as in the triple loop.

#### Dry run

The same input. The table of the triple loop applies row for row: the running sums for l = 0 are 2, 1, 4, 9, 7, now each obtained by one addition from the previous one. The matches are (l, r) = (0, 4) and (1, 3), and the program prints `2`.

#### Java code

```java title="Alternative: every start with a running sum (too slow at n = 2 · 10^5)"
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
        int[] a = readNumbers(in, n);
        System.out.println(countByRunningSum(a, x));
    }

    /** Fixes each start l and extends the end r, adding one element per step. */
    static long countByRunningSum(int[] a, long x) {
        long count = 0;
        for (int l = 0; l < a.length; l++) {
            long sum = 0;                          // sum of a[l..r]
            for (int r = l; r < a.length; r++) {
                sum += a[r];
                if (sum == x) {
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

**O(n²)**: n(n + 1)/2 additions and comparisons, 2 · 10^10 at n = 2 · 10^5. Measured: 16.4 s for the whole program at n = 2 · 10^5 with random values in −10..10, against a 1 s limit.

#### Space complexity

**O(n)** for the array; O(1) beyond it.

#### The bridge to the next approach

> "To beat n² I can't look at every (start, end) pair one by one, because there can be n²/2 answers... but I only need to *count* them. The standard trick for counting subarrays with a sum is a window: grow the right end, shrink the left while the sum is too big. Let me check whether it applies here before I commit to it."

### Alternative: grow-and-shrink window (does not work here)

A two-pointer window counts subarrays with sum x in O(n) when every value is **positive**: for each right end r, move the left end l forward while the window sum exceeds x, then count the window if its sum equals x. It relies on one fact: dropping an element from the left makes the sum smaller, and adding one on the right makes it larger. Negative values break that fact.

- On the example `2 -1 3 5 -2`, x = 7, the window reaches `2 -1 3 5` (sum 9 > 7) at r = 3 and drops the 2, finding `-1 3 5`. But the whole array, which starts with that 2, also sums to 7: after the −2 arrives the sum *falls* back to 7, and the 2 is already gone. The window prints `1` instead of `2` (I ran it).
- Zeros break it too: for `0 0 0` with x = 0 there are 6 subarrays, but a window that counts at most one window per right end prints `3` (I ran it).

The window is the right tool for the positive-only version, [[cses-subarray-sums-i|Subarray Sums I]], and saying so when rejecting it is worth a sentence in an interview. Here I need a tool that does not rely on the sum being monotone.

> "So the window is out. Back to the quadratic version: for a fixed end r, I'm asking 'for how many starts is the sum of a[l..r] equal to x?'. Written with prefix sums, the sum is P(r + 1) − P(l), so I'm asking how many earlier prefix sums equal P(r + 1) − x. That is a counting question about values I have already seen. If I sort the prefix sums I can find a value by binary search."

### Approach 1: Sorted prefix sums, binary search and a counter array

#### What I say out loud

> "I compute all n + 1 prefix sums. A subarray ending at j has sum x exactly when it starts after an index i < j with P(i) = P(j) − x. So I sweep j from 0 to n, and for each j I add the number of earlier i with that prefix value. To count values without a hash map, I sort the distinct prefix values once; then each value has a rank, found by binary search, and I keep an `int` counter per rank. O(n log n), with no assumption about the input."

#### Intuition

Turn "sum of a range" into "difference of two prefix sums", and the problem becomes Two Sum on the prefix array, with order: count pairs i < j with P(j) − P(i) = x. Sorting gives every prefix value a small integer name (its rank), so a plain array can count them.

#### Algorithm

1. Read n, x and the array. Compute `prefix[0..n]` in `long`: `prefix[0] = 0`, `prefix[i + 1] = prefix[i] + a[i]`.
2. Copy `prefix`, sort the copy, and remove duplicates: `values[0..distinct-1]` holds each prefix value once, in increasing order.
3. `seen = new int[distinct]` (all zero), `count = 0`.
4. For j from 0 to n:
   - look up `prefix[j] − x` in `values` by binary search; if present at rank k, `count += seen[k]`;
   - then find the rank of `prefix[j]` itself and do `seen[rank]++`.
5. Print `count`.

#### Why it is correct

- **Every subarray is one pair.** The subarray a[i..j − 1] (0-based) has sum `prefix[j] − prefix[i]`, for 0 ≤ i < j ≤ n. So the answer is the number of pairs i < j with `prefix[i] = prefix[j] − x`.
- **Invariant:** at the start of step j, `seen[k]` is the number of indices i < j with `prefix[i] = values[k]`. It holds at j = 0 (all zero), and step j adds `prefix[j]` *after* its lookup, so it holds at j + 1.
- **So step j adds exactly the pairs (i, j).** The lookup counts the indices i < j whose prefix equals `prefix[j] − x`; if that value is not among the prefix values, there are none and binary search reports it absent.
- **Order matters, and only "earlier" is counted.** Looking up before inserting means i = j is never paired with itself, which would be the empty subarray (sum 0) when x = 0.
- **Every rank lookup of `prefix[j]` succeeds**, since `values` contains every prefix value.

#### Dry run

Input `5 7` / `2 -1 3 5 -2`. Prefix sums: P = `0 2 1 4 9 7`. Sorted distinct values: `0 1 2 4 7 9` (ranks 0 to 5).

| j | prefix[j] | Look up prefix[j] − 7 | Rank found? | seen at that rank | count | Then seen[rank of prefix[j]]++ |
|---|---|---|---|---|---|---|
| 0 | 0 | −7 | no | | 0 | value 0 (rank 0) → 1 |
| 1 | 2 | −5 | no | | 0 | value 2 (rank 2) → 1 |
| 2 | 1 | −6 | no | | 0 | value 1 (rank 1) → 1 |
| 3 | 4 | −3 | no | | 0 | value 4 (rank 3) → 1 |
| 4 | 9 | 2 | rank 2 | 1 | 1 | value 9 (rank 5) → 1 |
| 5 | 7 | 0 | rank 0 | 1 | 2 | value 7 (rank 4) → 1 |

At j = 4 the match is i = 1: a[1..3] = `-1 3 5`. At j = 5 it is i = 0: the whole array. Prints `2`.

#### Java code

```java title="Approach 1: sorted prefix sums with binary search"
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
        int[] a = readNumbers(in, n);

        long[] prefix = new long[n + 1];           // prefix[j] = a[0] + ... + a[j-1]
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + a[i];
        }

        // The distinct prefix values, sorted: value -> rank by binary search.
        long[] values = prefix.clone();
        Arrays.sort(values);
        int distinct = 0;
        for (int i = 0; i < values.length; i++) {
            if (i == 0 || values[i] != values[i - 1]) {
                values[distinct++] = values[i];
            }
        }

        int[] seen = new int[distinct];            // seen[k]: earlier prefixes equal to values[k]
        long count = 0;
        for (int j = 0; j <= n; j++) {
            int want = Arrays.binarySearch(values, 0, distinct, prefix[j] - x);
            if (want >= 0) {
                count += seen[want];               // every earlier i with prefix[i] = prefix[j] - x
            }
            seen[Arrays.binarySearch(values, 0, distinct, prefix[j])]++;
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

**O(n log n)**: the sort of n + 1 `long`s, then n + 1 steps with two binary searches of O(log n) each. For `Arrays.sort(long[])` the JDK documentation's implementation note describes a dual-pivot quicksort that offers O(n log n) "on all data sets"; that describes the current implementation, not a contract, but no input is known to make it quadratic. Measured: 0.08–0.16 s for the whole program at n = 2 · 10^5, JVM start included.

#### Space complexity

**O(n)**: the prefix array, the sorted copy and the counter array, each n + 1 entries.

#### The bridge to the next approach

> "The sort only exists to give each prefix value a name I can index an array with. A hash map does that naming on the fly: no sort, no binary search, one pass, O(n) expected. And it doesn't even need the prefix array: I can keep the running total and the map as I read."

### Approach 2: Running prefix sum with a hash map of counts (recommended)

#### What I say out loud

> "One pass. I keep the running total and a hash map from 'prefix value' to 'how many prefixes so far had it', starting with {0: 1} for the empty prefix. At each element I add it to the total; the subarrays ending here with sum x are the earlier prefixes equal to total − x, so I add that count; then I record the current total. Each step is O(1) expected, so O(n) expected overall. Totals and the answer are `long`."

#### Intuition

The same pair-counting as Approach 1, but the "how many earlier prefixes had value v?" question is answered by a hash map built during the sweep, so it needs neither the full prefix array nor a sort.

#### Algorithm

1. `seen = {0: 1}`, `prefix = 0`, `count = 0`.
2. For each value v in order:
   - `prefix += v`;
   - `count += seen.get(prefix − x)` (0 if absent);
   - `seen[prefix]++`.
3. Print `count`.

#### Why it is correct

- **Invariant:** before processing element j (0-based), `prefix` = P(j) and `seen[v]` is the number of i in 0..j with P(i) = v. It holds at the start (only P(0) = 0, hence {0: 1}).
- After `prefix += v`, `prefix` = P(j + 1). The lookup counts the i ≤ j with P(i) = P(j + 1) − x, which are exactly the starts of subarrays a[i..j] with sum x. Then P(j + 1) is recorded, restoring the invariant for the next element.
- **Nothing is missed or double-counted:** each subarray a[i..j] is counted once, at its last element j, through the single earlier prefix index i.
- **The empty subarray is never counted:** P(j + 1) is inserted after its own lookup.
- **{0: 1} is what makes subarrays that start at position 0 count:** their "earlier prefix" is the empty one.

The 20-second version: "The sum of a[i..j] is P(j+1) − P(i). For each end I count earlier prefixes equal to the current prefix minus x, using a hash map of prefix counts seeded with {0: 1}. Look up before inserting, so I never count the empty subarray. One pass, O(n) expected, `long` everywhere."

#### Dry run

Input `5 7` / `2 -1 3 5 -2`.

| Value | prefix | Look up prefix − 7 | Found | count | Map after |
|---|---|---|---|---|---|
| start | 0 | | | 0 | {0: 1} |
| 2 | 2 | −5 | 0 | 0 | {0: 1, 2: 1} |
| −1 | 1 | −6 | 0 | 0 | {0: 1, 2: 1, 1: 1} |
| 3 | 4 | −3 | 0 | 0 | {0: 1, 2: 1, 1: 1, 4: 1} |
| 5 | 9 | 2 | 1 | 1 | … + {9: 1} |
| −2 | 7 | 0 | 1 | 2 | … + {7: 1} |

Prints `2`. With five zeros and x = 0, the lookups find 1, 2, 3, 4, 5 earlier zeros, so the count is 15 (Example 2).

#### Java code

```java title="Approach 2: running prefix sum with a hash map (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(st.nextToken());
        long x = Long.parseLong(st.nextToken());
        int[] a = readNumbers(in, n);

        Map<Long, Integer> seen = new HashMap<>(2 * (n + 1)); // prefix value -> how many so far
        seen.put(0L, 1);                           // the empty prefix, before a[0]
        long prefix = 0;
        long count = 0;
        for (int value : a) {
            prefix += value;                       // long: |prefix| <= 2 * 10^14
            count += seen.getOrDefault(prefix - x, 0); // subarrays ending here with sum x
            seen.merge(prefix, 1, Integer::sum);
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

**O(n) expected**, assuming the hash codes of the prefix values spread well over the buckets: n lookups and n updates at O(1) each on average. The values are chosen by whoever writes the input, and `Long.hashCode` is just the two 32-bit halves XORed together, so colliding inputs are easy to build (section 9 builds one). In a plain chained table that would cost O(n) per operation and O(n²) in total; current Java `HashMap` implementations turn a crowded bucket into a balanced tree, which for comparable keys such as `Long` keeps an operation at about O(log n). That is implementation behaviour, not a guarantee of the `Map` API. Measured: 0.08–0.14 s for the whole program at n = 2 · 10^5 on random values, all zeros, ±10^9 values, and prefix sums built to share 105 buckets.

#### Space complexity

**O(n) expected**: up to n + 1 map entries, each a boxed `Long` key, a boxed `Integer` count and a map node (tens of bytes per entry), plus the input array.

## 5. Comparison table

n is the length of the array.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Alt. Every subarray from scratch | O(n³) | O(n³), 1.0 s already at n = 2,000 | O(1) |
| Alt. Running sum per start | O(n²) | O(n²), 16.4 s at n = 2 · 10^5 | O(1) |
| Alt. Grow-and-shrink window | (wrong with negative values or zeros) | | |
| 1. Sorted prefix sums + binary search | O(n log n) | O(n log n) per the JDK implementation note | O(n) |
| 2. Hash map of prefix counts | O(n), if hash codes spread well | O(n²) for chained buckets; about O(n log n) with current Java tree buckets for `Long` keys (not an API guarantee) | O(n), tens of bytes per entry |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Alt. From scratch | The definition; nothing to get wrong | Cubic | Only to state the baseline |
| Alt. Running sum | Short; shows the "for each end, count starts" question | Quadratic | n up to a few thousand; as a test oracle |
| Alt. Window | O(n), O(1) space | Needs positive values | Only the positive-only version (Subarray Sums I) |
| 1. Sorted prefix sums | Deterministic bound, primitive arrays, no hashing | Two passes, more code, log factor | Adversarial input; when you want no hash assumptions |
| 2. Hash map | One pass, shortest code, works online | Expected bound only; boxing | The standard interview answer, and the CSES submission |

## 6. Which solution to give, and when to stop optimizing

**The solution I recommend:** Approach 2, the running prefix sum with a hash map of counts. It is the answer interviewers expect, it is one short loop, and on CSES it runs in about 0.1 s at the limit. Say "O(n) expected" and what that assumes.

**When the other one is better:** if the input may be adversarial (a judge with anti-hash tests, or an online service), Approach 1 gives O(n log n) with no assumption about the input, and on this problem it measured just as fast. It is also the version to reach for when a language's hash table is slow or unavailable.

**Is it optimal?** In the worst case a correct algorithm must look at essentially every element, since changing any one value can change the answer, so Ω(n) is a lower bound and Approach 2 matches it in expectation. Stop here. The remaining risks are types (`long` sums and answer) and the empty prefix, not the algorithm.

## 7. Interview script: code it and test it

### What I say while coding

> "`prefix` is a `long`: 2 · 10^5 values of 10^9 sum to 2 · 10^14. `count` is a `long` too: all zeros with x = 0 gives n(n + 1)/2 = 20,000,100,000."

> "The map starts with {0: 1}. Without it, subarrays that start at the first element have no earlier prefix to pair with."

> "I look up before I insert. If I inserted first, then with x = 0 every position would pair with itself and I'd count n empty subarrays."

> "I size the map at 2(n + 1) so it never rehashes; that is a constant-factor detail, not a correctness one."

### Testing out loud

**Example `5 7` / `2 -1 3 5 -2`:** the table above, 2. Correct.

**Five zeros, x = 0:** lookups find 1, 2, 3, 4, 5, total 15 = 5 · 6 / 2.

**n = 1, `1 5` / `5`:** prefix 5, look up 0, found once: 1. With `5` / `4`: look up −1, absent: 0.

**x = 0 with cancelling values, `3 0` / `1 -1 0`:** prefixes 1, 0, 0. Looking up 1: absent. Looking up 0: found once (the empty prefix), `1 -1`. Looking up 0 again: found twice (empty prefix and P(2)), `1 -1 0` and `0`. Total 3.

**Overflow:** 2 · 10^5 copies of 10^9 with x = 10^9: each prefix k · 10^9 finds (k − 1) · 10^9 once, so the answer is n = 200,000, and the prefix reaches 2 · 10^14. With an `int` prefix, the official test with 20 values of 2^28 and x = 2^29 prints 22 instead of 19 (I ran it).

**Official tests:** all four programs on this page print the expected answer on the 7 official CSES tests stored with this site (n up to 100), run on a real JVM. The tests for this page add n = 2 · 10^5 inputs (all zeros, ±10^9, alternating, random, colliding hash keys) for the two fast approaches.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2 min | Contiguous, non-empty, negatives allowed, answer size |
| Ladder | 4 min | Triple loop, running sum, why the window fails, prefix-sum pairs |
| Choose | 1 min | Hash map (expected) or sort (guaranteed), and say which |
| Code | 5 min | Fast input, `long`s, {0: 1}, lookup before insert |
| Test | 3 min | Example, all zeros, n = 1, cancelling values |

If stuck, write the prefix sums of the example under the array and point at two that differ by x.

## 9. Interviewer challenges

### About the design

#### Why does the map start with {0: 1}?

**What they are testing:** whether you understand what the map holds, or memorised the line.

**How to reason:** the map holds prefix sums P(i) for every possible start i, and i = 0 is a start whose prefix is empty.

**What I say:** "A subarray a[i..j] pairs prefix P(j + 1) with P(i). For subarrays starting at the first element, i = 0 and P(0) = 0 is the empty prefix. If I don't put it in the map, those subarrays are never counted: on the example the whole array is missed and I print 1 instead of 2 (I ran it)."

**Nuance:** an equivalent fix is `if (prefix == x) count++` inside the loop, but seeding the map keeps one rule for all subarrays.

#### Why not a two-pointer window? It's O(n) with O(1) memory.

**What they are testing:** whether you know the window's precondition.

**How to reason:** the window moves the left end forward when the sum is too big, which is only safe when removing elements can only decrease the sum.

**What I say:** "The window needs the sum to grow when the window grows. With negative values it doesn't: on the example the window drops the leading 2 when the sum reaches 9, and then the −2 brings the full-array sum back to 7, a subarray it can no longer see. It prints 1 instead of 2. With zeros it also undercounts: `0 0 0` with x = 0 has 6 subarrays, the window finds 3."

**Nuance:** with strictly positive values the window is the better answer: O(1) extra memory and deterministic. That is [[cses-subarray-sums-i|Subarray Sums I]].

### About complexity and robustness

#### Your solution is O(n). Can an input make it slow?

**What they are testing:** the difference between expected and worst-case bounds, and how Java's `HashMap` behaves.

**How to reason:** who chooses the keys? The keys are prefix sums, which the input controls completely.

**What I say:** "It's O(n) expected, assuming the prefix sums hash evenly. For a `Long` below 2^31 the hash code is the value itself, and `HashMap` picks the bucket from its low bits after mixing in the high 16, so I can choose prefix sums that land in a few buckets: I built 2 · 10^5 distinct prefix sums, all positive steps of at most 10^9, that fall into 105 of the 2^19 buckets. Current Java turns crowded buckets into trees, so this costs about log n per operation, and the run still took about 0.1 s. That's implementation behaviour, not a promise. If I need a guarantee I use Approach 1: sort the prefix sums and count by rank, O(n log n) with no hashing."

**Nuance:** CSES's tests are fixed, but judges with hacking phases (Codeforces) see anti-hash tests written against unseeded tables, C++ `unordered_map` in particular. The standard defences are sorting, or hashing with a random seed and a strong mixing function.

#### What is the largest answer, and does it fit?

**What they are testing:** overflow awareness, with a computed bound rather than a guess.

**How to reason:** the answer counts subarrays; the most there can be is all of them.

**What I say:** "At most n(n + 1)/2 subarrays: 2 · 10^5 · 200,001 / 2 = 20,000,100,000, about 9.3 times `Integer.MAX_VALUE`. All zeros with x = 0 reaches it. With an `int` counter that input prints −1474736480 (I ran it). And the prefix sums reach 2 · 10^14, so they need `long` too."

**Nuance:** each map count is at most n + 1, so the map's values can stay `Integer`; only the sum of them needs `long`.

## 10. Follow-up questions the interviewer might ask

**"All values are positive."**
Use the grow-and-shrink window: O(n) time, O(1) extra space, deterministic. That is [[cses-subarray-sums-i|Subarray Sums I]].

**"Count subarrays whose sum is divisible by n instead of equal to x."**
Pair prefix sums with equal remainders mod n instead of a fixed difference. Remainders lie in 0..n − 1, so a plain counter array replaces the map: O(n), deterministic. That is [[cses-subarray-divisibility|Subarray Divisibility]].

**"Return the length of the longest subarray with sum x."**
Store the *first* index of each prefix value instead of a count; at each j, the longest subarray ending there starts after the first index with P = P(j) − x. O(n) expected.

**"Count subarrays with sum at most x."**
Equality becomes an inequality on prefix sums: count earlier P(i) ≥ P(j) − x. A Fenwick tree over the ranks of the sorted prefix sums answers that in O(log n): O(n log n) overall.

**"The same, as a LeetCode method."**
That is [[nc-subarray-sum-equals-k|Subarray Sum Equals K]]: the same algorithm, with n ≤ 2 · 10^4 and values small enough that even `int` sums suffice there.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Using the two-pointer window.** It needs positive values; here it prints 1 instead of 2 on the official example (verified).
- **Calling the hash map version "O(n)" without "expected".** Its bound assumes well-spread hash codes, and the input chooses the keys.
- **Assuming the answer fits in an `int`.** It can reach 20,000,100,000.

### Implementation mistakes

> [!MISTAKE] Inserting the current prefix before looking it up
> With `seen.merge(prefix, …)` before `seen.get(prefix - x)`, when x = 0 every prefix finds itself and counts an empty subarray. Five zeros with x = 0 then print `20` instead of `15` (verified). Look up first, then insert.

- **Forgetting {0: 1}.** Subarrays that start at the first element are lost; the example prints `1` instead of `2` (verified).
- **An `int` running sum.** It overflows once the total passes 2^31 − 1; the official test with twenty values of 2^28 and x = 2^29 prints `22` instead of `19` (verified).
- **An `int` answer.** All zeros at n = 2 · 10^5 with x = 0 prints `-1474736480` instead of `20000100000` (verified).
- **Reading with `Scanner`.** Much slower per token than `BufferedReader` with `StringTokenizer`.

## 12. Pattern recognition

**The pattern:** prefix sum plus a count of earlier prefix states. "A range has property X" becomes "two prefix states are related by X", and a map (or a counter array, when the states are small) counts the earlier partners of each new state in one pass.

**Signals in the problem statement:**

- "count the subarrays" with a sum condition.
- Values that may be negative or zero, which rules out a sliding window.
- n up to 10^5–10^6, which rules out looking at every pair.

**Related problems in this list:**

- [[nc-subarray-sum-equals-k|Subarray Sum Equals K]]: the same problem as a LeetCode method.
- [[cses-subarray-sums-i|Subarray Sums I]]: positive values only, where the two-pointer window works.
- [[cses-subarray-divisibility|Subarray Divisibility]]: prefix remainders instead of prefix sums, counted in an array.
- [[cses-subarray-sum-constraints|Subarray Sum Constraints]]: the reverse question, building an array from given subarray sums, again through prefix sums.
- [[nc-two-sum|Two Sum]]: "find an earlier value equal to target minus the current one", the same lookup on plain values.

**Takeaway:** a subarray sum is a difference of two prefix sums. Counting subarrays with a sum is counting pairs of prefix sums with a difference, which a hash map of counts does in one pass, or a sort does deterministically.

## 13. 60-second revision card

**Key insight:** sum(a[i..j]) = P(j + 1) − P(i). For each end, count earlier prefixes equal to the current prefix minus x.

**Invariant:** before element j, `seen[v]` = number of i ≤ j with P(i) = v; the map starts as {0: 1}.

**Complexity:** O(n) expected time, O(n) space (hash map); O(n log n) guaranteed with sorted prefix sums.

**Code skeleton:**

```java title="Subarray Sums II, prefix sums with a hash map"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(st.nextToken());
        long x = Long.parseLong(st.nextToken());
        Map<Long, Integer> seen = new HashMap<>(2 * (n + 1));
        seen.put(0L, 1);
        long prefix = 0;
        long count = 0;
        st = new StringTokenizer("");
        for (int i = 0; i < n; i++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(in.readLine());
            prefix += Integer.parseInt(st.nextToken());
            count += seen.getOrDefault(prefix - x, 0);
            seen.merge(prefix, 1, Integer::sum);
        }
        System.out.println(count);
    }
}
```

**Main traps:**

- `long` for the prefix and the answer (2 · 10^14 and 20,000,100,000).
- Seed {0: 1}; look up before inserting.
- No sliding window: values can be negative.

**What to say in one breath:** "A subarray sum is a difference of prefix sums, so for each end I count earlier prefixes equal to the current prefix minus x, with a hash map seeded with {0: 1}, looking up before inserting: O(n) expected, `long` for sums and the count. If the input could be adversarial, I sort the prefix sums and count by rank instead, O(n log n) guaranteed."
