---
problemId: cses-distinct-values-subsequences
title: Distinct Values Subsequences
source: cses
sourceUrl: https://cses.fi/problemset/task/3421
difficulty: easy
patterns: [sorting-searching, frequency-counting, combinatorics, hashing]
relatedLessons: [a2-frequency-counting, a2-hashing, a2-sorting-based, a11-subsequences, a1-java-syntax-competitive, a14-brute-force-first]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

You get an array of n integers. Count the subsequences in which no value appears twice. A subsequence picks some of the positions, at least one, keeping their left-to-right order; two subsequences are different when they use different positions, even if they read the same. Print the count modulo 10^9 + 7. This is a whole program: it reads standard input and writes standard output.

**Example 1**

- Input: `4` on the first line, `1 2 1 3` on the second
- Output: `11`
- Why: the statement lists them: [1] (twice, once for each 1), [2], [3], [1, 2], [1, 3] (twice), [2, 1], [2, 3], [1, 2, 3] and [2, 1, 3]. [1, 1] and anything else using both 1s are not allowed.

**Example 2** (an extra example: the CSES statement has only one)

- Input: `2` on the first line, `5 5` on the second
- Output: `2`
- Why: [5] from position 1 and [5] from position 2. The subsequence [5, 5] repeats a value.

**What the problem statement guarantees**

- 1 ≤ n ≤ 2 · 10^5.
- 1 ≤ x_i ≤ 10^9.
- The answer is printed modulo 10^9 + 7.
- Time limit: 1 second (memory limit 512 MB).

## 2. Practice first: try it before reading on

If you have not solved this yourself yet, stop here. The answer has a short formula, but the point is to derive it and prove it, then compute it without overflow. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 15 minutes.
2. List all 15 non-empty subsequences of `1 2 1 3` by hand and mark the valid ones.
3. Find what the count depends on. Does the order of the array matter?
4. Write the program and work out the largest intermediate value it computes.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> Shuffle the array `1 2 1 3` into `1 1 2 3`. Does the answer change? If not, what information about the array is the answer really using?

> [!HINT] Hint 2: the kind of tool you need
> A valid subsequence uses each value at most once. So for each value you make an independent decision: leave it out, or take exactly one of its copies. Count the options per value and combine them.

> [!HINT] Hint 3: almost the whole plan
> If value v occurs c_v times, it has c_v + 1 options. Multiply over all values, subtract 1 for the choice that takes nothing, and do every multiplication modulo 10^9 + 7 in a `long`. Get the counts c_v by sorting or with a hash map.

**Check yourself before revealing the walkthrough**

- [ ] I can prove my formula, including why each subsequence is counted exactly once
- [ ] I know the largest product my program computes before taking the remainder, and my type holds it
- [ ] My program prints n when all values are equal, and 2^n − 1 when all differ (for small n)
- [ ] I subtract the empty choice, and the result stays in 0..10^9 + 6

## 3. Interview script: understand the problem (≈2 min)

Treat it as if an interviewer had posed it. The questions are what "different subsequences" means, the output format and the size of the numbers.

**Me:** I count subsequences, meaning choices of positions in left-to-right order, where the chosen values are pairwise different. Two subsequences that read the same but use different positions count separately?

**Interviewer:** Yes. The example counts [1] twice, once per position.

**Me:** And the empty subsequence does not count, since the example's list has none. The output is the count modulo 10^9 + 7, one number?

**Interviewer:** Correct.

**Me:** Let me check the example by hand. Out of the 15 non-empty position sets of `1 2 1 3`, the ones using both 1s are bad: there are 4 of those (both 1s, plus any subset of {2, 3}). 15 − 4 = 11, which matches.

**Interviewer:** Good. How big can it get?

**Me:** If all 2 · 10^5 values differ, every subsequence is valid: 2^200000 − 1, hence the modulo. I'll keep everything in `long` and reduce after each multiplication. Reading is 2 · 10^5 numbers, so `BufferedReader` and `StringTokenizer`.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 2 · 10^5 | 2^n subsequences: enumerating them is hopeless beyond n ≈ 25. I need a formula, O(n log n) or better. |
| 1 ≤ x_i ≤ 10^9 | The values serve only as labels for counting; too wide for an array indexed by value. |
| Answer modulo 10^9 + 7 | The true count reaches 2^200000 − 1. Reduce after every multiplication, in `long`. |
| Time limit 1 s | Fast input. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Subsequences are counted by positions | Each copy of a value is a separate option, which is where "c_v + 1" comes from. |
| The empty subsequence is not counted | Subtract 1 at the end. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The tokens may be spread over lines differently from the statement | My reader takes tokens until it has n of them; it costs nothing. |

### Edge cases I will keep in mind

- n = 1: the answer is 1.
- All values equal: n subsequences, one per position.
- All values different: 2^n − 1, which wraps modulo 10^9 + 7 from n = 30 (2^30 − 1 = 1,073,741,823 > 10^9 + 7).
- Values with several copies at large n: this is where an `int` product overflows (section 11).

## 4. Think out loud: from first idea to best solution

### Alternative: enumerate every set of positions

This rung is exponential: 2^n − 1 position sets, about 10^6 at n = 20 and beyond counting at n = 2 · 10^5. It is not a numbered approach, but it is the definition turned into code, and the reference I check the formula against.

#### What I say out loud

> "The direct way: every non-empty subsequence is a set of positions, so I try all 2^n − 1 bitmasks and keep those whose values are pairwise different, using a set to spot a repeat. It is correct by definition and usable up to n ≈ 20. The constraint says 2 · 10^5, so it only tells me what to count."

#### Intuition

The statement defines the count; enumerate exactly what it defines.

#### Algorithm

1. Read n and the numbers.
2. For each mask from 1 to 2^n − 1: clear a set; for each set bit i, add x[i]; if an add fails, the mask is invalid.
3. Count the valid masks, and print the count modulo 10^9 + 7.

#### Why it is correct

- Every non-empty subsequence is exactly one non-zero mask (bit i set when position i is chosen), and every mask is one subsequence, so nothing is missed or counted twice.
- A mask is counted exactly when no value is added to the set twice, which is the definition of "each element distinct".

#### Dry run

Input `4` / `1 2 1 3` (positions 0 to 3). Grouping the 15 masks by size:

| Size | Masks | Invalid (both 1s, positions 0 and 2) | Valid |
|---|---|---|---|
| 1 | 4 | none | 4 |
| 2 | 6 | {0, 2} | 5 |
| 3 | 4 | {0, 1, 2}, {0, 2, 3} | 2 |
| 4 | 1 | {0, 1, 2, 3} | 0 |

Total 4 + 5 + 2 = 11.

#### Java code

```java title="Alternative: enumerate all position sets (exponential, n up to about 20)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashSet;
import java.util.Set;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] x = readNumbers(in, n);
        System.out.println(countByEnumeratingSubsets(x));
    }

    /** Tries every non-empty set of positions; only usable for n up to about 25. */
    static long countByEnumeratingSubsets(int[] x) {
        int n = x.length;
        long count = 0;
        Set<Integer> used = new HashSet<>();
        for (long mask = 1; mask < (1L << n); mask++) {  // bit i set: position i is chosen
            used.clear();
            boolean allDistinct = true;
            for (int i = 0; i < n && allDistinct; i++) {
                if ((mask >> i & 1) == 1 && !used.add(x[i])) {
                    allDistinct = false;                  // this value was already chosen
                }
            }
            if (allDistinct) {
                count++;
            }
        }
        return count % 1_000_000_007L;
    }

    static int[] readNumbers(BufferedReader in, int count) throws IOException {
        int[] x = new int[count];
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < count; i++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            x[i] = Integer.parseInt(st.nextToken());
        }
        return x;
    }
}
```

#### Time complexity

**O(2^n · n) expected** (n hash-set operations per mask, each O(1) expected). At n = 20 that is about 2 · 10^7 operations; at n = 40 it would already be hours. The `long` mask also limits it to n ≤ 62, which is irrelevant given the running time.

#### Space complexity

**O(n)** for the array and the set.

#### The bridge to the next approach

> "Looking at the dry run, the only thing that made a mask invalid was taking two copies of the same value. The positions of the other values didn't matter. So the answer depends only on how many times each value occurs. If I know those counts, maybe I can count the valid choices directly instead of listing them."

**Deriving the formula.** Let the distinct values be v_1, …, v_d, occurring c_1, …, c_d times. A valid subsequence takes, for each value v_j, either none of its copies or exactly one of its c_j copies: c_j + 1 options. The options for different values are independent, so there are (c_1 + 1)(c_2 + 1)⋯(c_d + 1) combinations. Exactly one of them takes nothing, so

**answer = ∏ (c_v + 1) − 1, modulo 10^9 + 7.**

**Why it counts each subsequence exactly once.** Map a valid subsequence to its choice: for each value, which copy it uses, or "none". This map is one-to-one in both directions:

- **Every combination gives one valid subsequence.** The chosen positions, read left to right, form a subsequence; it has at most one copy of each value, so its values are pairwise different. Different combinations choose different position sets, hence different subsequences (they are counted by positions).
- **Every valid subsequence comes from one combination.** Its values are pairwise different, so it uses at most one copy of each value; recording which copy (or none) gives a combination, and that combination gives back the same position set.
- The ordering of the positions is fixed by the array, so a position set is never counted in two orders.

Check on the example: counts 1 → 2, 2 → 1, 3 → 1, so (2 + 1)(1 + 1)(1 + 1) − 1 = 12 − 1 = 11. The two extremes check too: all values equal gives (n + 1) − 1 = n, and all different gives 2^n − 1.

Two ways to get the counts follow: sorting and a hash map.

### Approach 1: Sort, then multiply (block length + 1) (recommended)

#### What I say out loud

> "I sort the array, so each value's copies form one block. For each block of length c I multiply the answer by c + 1, modulo 10^9 + 7, and at the end subtract 1 for the empty choice. Sorting is O(n log n), the pass is O(n)."

#### Intuition

After sorting, a value's count is the length of its block, read off with one scan.

#### Algorithm

1. Read n and the numbers into an `int[]`; sort it.
2. `product = 1`. Walk the blocks: from i, advance j while `x[j] == x[i]`; `count = j − i`; `product = product * (count + 1) % MOD`; i = j.
3. Print `(product − 1 + MOD) % MOD`.

#### Why it is correct

- Sorting groups equal values into contiguous blocks (between two equal values in a sorted array, everything equals them), so each block length is exactly one value's count c_v, and each value has exactly one block.
- The loop multiplies (c_v + 1) once per block, so `product` is ∏ (c_v + 1) modulo MOD. Taking the remainder after each step gives the same final remainder as taking it once at the end, because (a · b) mod m = ((a mod m) · b) mod m.
- Subtracting 1 removes the empty choice, by the derivation above.

**Overflow.** Before each multiplication, `product` is a remainder, at most 10^9 + 6, and count + 1 ≤ 2 · 10^5 + 1, so the product before `% MOD` is below about 2.0 · 10^14, far below the `long` limit of about 9.2 · 10^18. In `int` it would overflow (section 11).

**Why the final `− 1` cannot go negative.** MOD = 10^9 + 7 is prime and every factor c_v + 1 is between 2 and 2 · 10^5 + 1, so no factor is divisible by MOD, and neither is their product. So `product` is never 0 modulo MOD, and `product − 1` is already in 0..MOD − 2. The `+ MOD` is a habit that costs nothing and protects the code if the problem changes.

**The 20-second version:** "Only the count of each value matters. Each value is left out or contributes exactly one of its copies, so c + 1 choices per value, independent across values. Multiply, subtract the empty choice. I get the counts by sorting, and multiply in `long` modulo 10^9 + 7: the largest intermediate is about 10^9 times 2 · 10^5."

#### Dry run

Input `4` / `1 2 1 3`. Sorted: `1 1 2 3`.

| Block | Value | count | count + 1 | product after |
|---|---|---|---|---|
| positions 0–1 | 1 | 2 | 3 | 3 |
| position 2 | 2 | 1 | 2 | 6 |
| position 3 | 3 | 1 | 2 | 12 |

Prints 12 − 1 = `11`.

#### Java code

```java title="Approach 1: sort, multiply (block length + 1) (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Main {
    static final long MOD = 1_000_000_007L;

    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] x = readNumbers(in, n);

        Arrays.sort(x);                            // equal values form one block
        long product = 1;                          // always in [1, MOD - 1]
        int i = 0;
        while (i < n) {
            int j = i;
            while (j < n && x[j] == x[i]) {
                j++;
            }
            int count = j - i;                     // occurrences of the value x[i]
            product = product * (count + 1) % MOD; // skip it, or take one of its copies
            i = j;
        }
        System.out.println((product - 1 + MOD) % MOD);  // drop the empty choice
    }

    static int[] readNumbers(BufferedReader in, int count) throws IOException {
        int[] x = new int[count];
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < count; i++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            x[i] = Integer.parseInt(st.nextToken());
        }
        return x;
    }
}
```

#### Time complexity

**O(n log n)**, n being the array length: the sort (O(n log n) on all inputs according to the JDK implementation note for `Arrays.sort(int[])`), then one pass in which i and j only move forward, O(n). Measured on my machine (JDK 26): 0.06–0.10 s for the whole program at n = 2 · 10^5, JVM start included.

#### Space complexity

**O(n)** for the array; O(1) beyond it apart from the sort's internal workspace, which is an implementation detail.

#### The bridge to the next approach

> "The sort is only there to group equal values. Counting is the textbook use of a hash map: value to count, one pass, O(n) expected. Then I multiply over the map's counts."

### Approach 2: Hash map of counts

#### What I say out loud

> "I count each value's occurrences in a `HashMap<Integer, Integer>`, then multiply (count + 1) over the map's values modulo 10^9 + 7 and subtract 1. O(n) expected, if the hash codes spread well."

#### Intuition

The formula needs the multiset of counts, nothing else. A frequency map produces exactly that.

#### Algorithm

1. Read the numbers. For each, `count.merge(value, 1, Integer::sum)`.
2. `product = 1`; for each count c in `count.values()`, `product = product * (c + 1) % MOD`.
3. Print `(product − 1 + MOD) % MOD`.

#### Why it is correct

- After the first loop, the map has one entry per distinct value, holding its number of occurrences c_v.
- The second loop multiplies (c_v + 1) once per distinct value; the order of multiplication does not matter. Then the derivation above applies. The overflow argument is the same as in Approach 1.

#### Dry run

Input `4` / `1 2 1 3`

| Value read | Map after |
|---|---|
| 1 | {1: 1} |
| 2 | {1: 1, 2: 1} |
| 1 | {1: 2, 2: 1} |
| 3 | {1: 2, 2: 1, 3: 1} |

Product (2 + 1)(1 + 1)(1 + 1) = 12 (in whatever order the map iterates), prints `11`.

#### Java code

```java title="Approach 2: hash map of counts"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;
import java.util.StringTokenizer;

public class Main {
    static final long MOD = 1_000_000_007L;

    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] x = readNumbers(in, n);

        Map<Integer, Integer> count = new HashMap<>(2 * n);
        for (int value : x) {
            count.merge(value, 1, Integer::sum);   // occurrences of each value
        }
        long product = 1;                          // always in [1, MOD - 1]
        for (int c : count.values()) {
            product = product * (c + 1) % MOD;     // skip the value, or take one of its c copies
        }
        System.out.println((product - 1 + MOD) % MOD);  // drop the empty choice
    }

    static int[] readNumbers(BufferedReader in, int count) throws IOException {
        int[] x = new int[count];
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < count; i++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            x[i] = Integer.parseInt(st.nextToken());
        }
        return x;
    }
}
```

#### Time complexity

**O(n) expected**, assuming the hash codes spread well: n `merge` calls and at most n multiplications. `Integer.hashCode()` is the value itself, so colliding inputs can be constructed; current Java `HashMap` implementations turn crowded buckets into balanced trees, which keeps an operation near O(log n) for `Integer` keys, but that is implementation behaviour, not an API guarantee. Measured on my machine: 0.08–0.16 s for the whole program at n = 2 · 10^5, slightly slower than Approach 1 on every input I tried, including keys built to share buckets (see [[cses-distinct-numbers|Distinct Numbers]], section 9, for how).

#### Space complexity

**O(d)** entries for d distinct values, each a boxed key, a boxed count and a map node: tens of bytes per entry, plus the O(n) input array.

## 5. Comparison table

n is the array length and d the number of distinct values.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Alt. Enumerate position sets | O(2^n · n) | O(2^n · n) (hash set per mask; O(2^n · n²) with pairwise checks) | O(n) |
| 1. Sort, multiply block lengths + 1 | O(n log n) | O(n log n) per the JDK implementation note | O(n) array |
| 2. Hash map of counts | O(n), if hash codes spread well | O(n²) for chained buckets; about O(n log n) with current Java tree buckets (not an API guarantee) | O(d) map entries |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Alt. Enumerate | Needs no insight; the reference to test the formula against | Exponential | Small-n checking only |
| 1. Sort | Deterministic bound; primitive array; fastest in my measurements | Reorders the input | The submission |
| 2. Hash map | O(n) expected; the natural "frequency count" code | Expected bound only; boxing | When the interviewer asks for O(n) expected, or the values are not sortable cheaply |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** the formula ∏ (c_v + 1) − 1 with its proof, computed with Approach 1. The proof is the interview; the counting method is a detail. I recommend sorting because its bound does not depend on hash codes and it was the faster program in my runs; the hash map is just as acceptable in an interview if you say "expected".

**Is it optimal?** Up to the cost of grouping equal values, yes: once the counts are known, the product is O(d). Grouping is the same problem as [[cses-distinct-numbers|Distinct Numbers]], with the same sort-or-hash choice. Stop there; the remaining risks are the `long`, the `− 1`, and fast input.

## 7. Interview script: code it and test it

### What I say while coding

> "`MOD` and `product` are `long`. `product` is below 10^9 + 7 and the factor is at most 2 · 10^5 + 1, so the product is at most about 2 · 10^14 before the remainder."

> "I subtract 1 at the end as `(product - 1 + MOD) % MOD`. It can't actually go negative here, since the product is never divisible by the prime MOD, but the form is safe either way."

> "Blocks: j runs from i while the value is the same, so `j − i` is the count, and i jumps to j. Each index is visited once."

### Testing out loud

**Example `1 2 1 3`:** sorted `1 1 2 3`, factors 3, 2, 2, product 12, prints 11. Correct.

**`5 5`:** one block of 2, product 3, prints 2.

**n = 1:** one block of 1, product 2, prints 1.

**`1 1 2 2`:** two blocks of 2, product 9, prints 8: {[1], [1], [2], [2], and the four pairs of one 1 with one 2}, which I can list.

**All different, n = 30:** 2^30 − 1 = 1,073,741,823, which is above MOD, so the program prints 73,741,816. The tests check this boundary.

**n = 2 · 10^5, all different:** 2^200000 − 1 mod 10^9 + 7 = 175,895,281, checked against an exact `BigInteger` computation.

**Official tests:** all three programs on this page print the expected answer on the one official CSES test stored with this site (n = 20, answer 419), run on a real JVM. That test is small, so the tests for this page add random inputs checked against an independent enumeration, and n = 2 · 10^5 inputs checked against the product computed exactly with `BigInteger`.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2 min | Positions vs values, empty excluded, modulo |
| Brute force and observation | 3 min | 15 masks of the example; only repeated values break a mask |
| Formula and proof | 4 min | c + 1 choices per value, independence, minus 1 |
| Code | 3 min | Sort, blocks, `long` product modulo |
| Test | 3 min | Example, all equal, all different, n = 1 |

If the formula does not come, sort the example to `1 1 2 3` and ask how many ways each value can appear in a valid subsequence.

## 9. Interviewer challenges

### About correctness

#### Why doesn't the order of the array matter, when subsequences are about order?

**What they are testing:** whether the proof handles order, or just waves at it.

**How to reason:** a subsequence is determined by its position set; the order is inherited from the array.

**What I say:** "A subsequence is a set of positions, read left to right, so once I choose the positions there is exactly one subsequence. Whether it's valid depends only on which values the positions hold, not where they are. So the count depends only on how many copies each value has. Rearranging the array changes which subsequences exist, for example [2, 1] versus [1, 2], but not how many are valid."

**Nuance:** if the problem counted *distinct value sequences* instead of position sets, order would matter and the formula would change completely; see the follow-ups.

#### Your remainder of the product: why is it the remainder of the true count?

**What they are testing:** modular arithmetic hygiene.

**How to reason:** multiplication is compatible with remainders; subtraction too, with care for negatives.

**What I say:** "(a · b) mod m equals ((a mod m) · b) mod m, so reducing after every step gives the true product's remainder. For the final − 1, I add MOD before the last remainder, which handles a product remainder of 0. Here it can't be 0, because MOD is prime and every factor is between 2 and 200,001."

**Nuance:** the "never 0" argument is specific to small factors and a prime modulus; the defensive form is what to write in general.

### About implementation

#### Is `int` enough for the product?

**What they are testing:** overflow analysis from the constraints.

**How to reason:** the intermediate before `%` is up to (10^9 + 6)(2 · 10^5 + 1).

**What I say:** "No. The remainder alone fits in an `int`, but the product before reducing can reach about 2 · 10^14. In `int`, 36 distinct values followed by one value twice already goes wrong: it prints 863,461,504 instead of 158,428,765. I ran it. Notably, an input where every value is distinct never overflows, since doubling a number below 10^9 + 7 stays under 2^31 − 1, so a test with only distinct values would miss the bug."

**Nuance:** the dangerous inputs are the ones with a factor of 3 or more applied to a large product; tests must include repeated values at large sizes.

## 10. Follow-up questions the interviewer might ask

**"Count only the distinct-value subsequences of length exactly k."**
That is the k-th elementary symmetric polynomial of the counts: dp[j] = number of ways to pick j values so far; for each count c, update dp[j] += dp[j − 1] · c from high j to low. O(d · k) time, O(k) space.

**"Count distinct value *sequences* instead of position sets (so [1] counts once)."**
Then order matters, and it becomes a DP over positions that avoids double-counting repeated sequences, related to [[cses-distinct-subsequences|Distinct Subsequences]], with the extra rule that a value may not repeat. The product formula no longer applies.

**"Contiguous subarrays with distinct values instead of subsequences."**
Two pointers with a set or map of the window's values: for each right end, the window extends left until a repeat; add its length. O(n) expected. That is [[cses-distinct-values-subarrays|Distinct Values Subarrays]].

**"Values are lowercase letters."**
A `int[26]` count array replaces the sort or map: O(n) deterministic, and the product has at most 26 factors.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Counting value sets instead of position sets.** 2^d − 1 (here 2^3 − 1 = 7) counts each set of values once; the example's answer 11 counts copies separately.
- **Forgetting the empty choice.** The product includes "take nothing from every value"; without the − 1 the example prints 12.
- **Thinking order must be tracked.** Positions fix the order; the count depends only on the multiset of counts.

### Implementation mistakes

> [!MISTAKE] Keeping the product in `int`
> With `int product` and `int MOD`, `product * (count + 1)` overflows before the remainder. For 36 distinct values followed by a value twice (n = 38), it prints 863461504 instead of 158428765, and a random n = 2 · 10^5 input prints 673132479 instead of 112018852 (both verified). All-distinct inputs happen to survive, so they do not catch it.

- **Reducing only at the end.** The true product has tens of thousands of digits at n = 2 · 10^5 (2^200000 alone has 60,206), so a `long` overflows after at most 63 factors (each is at least 2). Take the remainder after every multiplication.
- **Starting the product at 0.** Everything multiplies to 0.
- **Comparing boxed counts or keys with `==`.** With a `Map<Integer, Integer>`, compare with `equals` or unbox to `int`, as the loop over `values()` into an `int c` does.

## 12. Pattern recognition

**The pattern:** count frequencies, then combine per-value choices with the product rule. When the constraint is "each value at most once" (or any per-value rule), choices for different values are independent, so the total is a product of per-value option counts.

**Signals in the problem statement:**

- "Count subsequences/subsets where …" with a condition about *values*, not positions.
- The answer is modulo 10^9 + 7: a combinatorial count, so look for a formula rather than an enumeration.
- The array's order looks irrelevant to the condition: reduce to frequencies.

**Related problems in this list:**

- [[cses-distinct-numbers|Distinct Numbers]]: the same grouping step, counting the groups instead of multiplying their sizes.
- [[nc-top-k-frequent-elements|Top K Frequent Elements]]: a frequency map as the first step, then a selection over the counts.
- [[nc-valid-anagram|Valid Anagram]]: two strings compared through their letter counts, another problem reduced to frequencies.
- [[cses-distinct-values-subarrays|Distinct Values Subarrays]]: the contiguous version, where order does matter.

**Takeaway:** when a counting condition only cares about how many copies of each value you take, throw away the order, count frequencies, and multiply the per-value choices.

## 13. 60-second revision card

**Key insight:** each value is skipped or contributes exactly one of its c copies: c + 1 choices, independent across values. Answer ∏ (c_v + 1) − 1.

**Invariant:** after processing some values, `product` is the number of valid choices for those values (empty included), modulo 10^9 + 7.

**Complexity:** O(n log n) time with sorting (O(n) expected with a hash map), O(n) space.

**Code skeleton:**

```java title="Distinct Values Subsequences, sort and multiply"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        final long MOD = 1_000_000_007L;
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] x = new int[n];
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < n; i++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(in.readLine());
            x[i] = Integer.parseInt(st.nextToken());
        }
        Arrays.sort(x);
        long product = 1;
        for (int i = 0, j; i < n; i = j) {
            for (j = i; j < n && x[j] == x[i]; j++) { }
            product = product * (j - i + 1) % MOD;
        }
        System.out.println((product - 1 + MOD) % MOD);
    }
}
```

**Main traps:**

- `long` for the product; reduce after every multiplication.
- Subtract 1 for the empty choice.
- Positions, not values: each copy is its own option.

**What to say in one breath:** "Only the counts matter: each value is left out or contributes one of its c copies, so c + 1 options, independent across values. Multiply them modulo 10^9 + 7 in a `long`, since the intermediate reaches about 2 · 10^14, and subtract 1 for the empty choice. Sorting gives the counts in O(n log n)."
