---
problemId: cses-distinct-numbers
title: Distinct Numbers
source: cses
sourceUrl: https://cses.fi/problemset/task/1621
difficulty: easy
patterns: [sorting-searching, hashing, sorting]
relatedLessons: [a2-hashing, a2-sorting-based, a1-java-syntax-competitive, a1-big-o, a14-brute-force-first, a14-deriving-optimization]
companies: []
timeToSolve: 10
---

## 1. Problem restatement

You get n integers. Print how many different values appear among them: a value that occurs several times counts once. This is a whole program: it reads standard input and writes standard output.

**Example 1**

- Input: `5` on the first line, `2 3 2 2 3` on the second
- Output: `2`
- Why: only the values 2 and 3 appear; 2 occurs three times and 3 twice, but each counts once.

**Example 2** (an extra example: the CSES statement has only one)

- Input: `1` on the first line, `1000000000` on the second
- Output: `1`
- Why: the smallest input, with the largest allowed value. One number is one distinct value.

**What the problem statement guarantees**

- 1 ≤ n ≤ 2 · 10^5.
- 1 ≤ x_i ≤ 10^9.
- The first line has n, the second line the n integers.
- Time limit: 1 second (memory limit 512 MB).

## 2. Practice first: try it before reading on

If you have not solved this yourself yet, stop here. It is a one-line problem in most languages, which is exactly why an interviewer uses it: the questions are about *which* one-liner, what it costs, and when it breaks. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 10 minutes.
2. Write the slowest solution you are sure is correct, and estimate its cost at n = 2 · 10^5.
3. Find two faster ideas that use different tools, and give each one's time and memory.
4. Decide which of them you would submit to a judge, and say in one sentence why.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> A value should be counted at the moment you meet it for the first time. How do you know, cheaply, whether you have met it before?

> [!HINT] Hint 2: the kind of tool you need
> Either put equal values next to each other, so that "met before" means "equal to my left neighbour", or keep a collection of the values seen so far that answers "is this in here?" quickly. The values go up to 10^9, so an array indexed by value is out.

> [!HINT] Hint 3: almost the whole plan
> Read the numbers into an `int[]` with a buffered reader, sort it, and count the positions i where i = 0 or x[i] differs from x[i − 1]. Or add every number to a hash set and print its size. Compare what each costs, and what each assumes.

**Check yourself before revealing the walkthrough**

- [ ] I can state a quadratic baseline and why it is too slow here
- [ ] I can give two faster solutions and say which one's bound is only *expected*
- [ ] My program prints 1 when n = 1, and 1 when all the numbers are equal
- [ ] My program reads 2 · 10^5 numbers without `Scanner`

## 3. Interview script: understand the problem (≈1 min)

Treat it as if an interviewer had posed it. The questions are about the input format, the value range (which rules out a lookup array) and the speed of reading.

**Me:** I read n and then n integers, and print the number of different values among them. A single integer on one line?

**Interviewer:** Yes, just the count.

**Me:** n up to 2 · 10^5 and values from 1 to 10^9. So the values fit in an `int`, the count fits in an `int`, and I can't use an array indexed by value, because 10^9 entries is far too much memory. Is the list in any particular order?

**Interviewer:** No, arbitrary order.

**Me:** Let me do the example by hand: `2 3 2 2 3`. The first 2 is new, the 3 is new, and the remaining 2, 2, 3 have each appeared earlier. Two values, so I print 2.

**Interviewer:** Good.

**Me:** With 2 · 10^5 numbers to read I'll use a `BufferedReader` with a `StringTokenizer`, not `Scanner`.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 2 · 10^5 | n² is 4 · 10^10, far too slow; n log n is about 3.5 · 10^6, fine. |
| 1 ≤ x_i ≤ 10^9 | `int` holds every value. Too wide for a boolean array indexed by value. |
| Time limit 1 s | Fast input: one `BufferedReader`, tokens with `StringTokenizer`. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| The output is the count alone, on one line | One `println` at the end. |
| The numbers come in arbitrary order | Nothing to exploit; sorting is a step I choose, not a given. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The tokens may be spread over lines differently from the statement | My reader takes tokens until it has n of them, wherever the line breaks are. It costs nothing and removes a failure mode. |

### Edge cases I will keep in mind

- n = 1: the answer is 1.
- All values equal: the answer is 1.
- All values different: the answer is n.
- Values at the limits, 1 and 10^9.

## 4. Think out loud: from first idea to best solution

"Count distinct values" is the same as "count the positions where a value appears for the first time". Every approach below decides, for each number, whether its value was seen before; they differ only in how that question is answered.

### Alternative: compare each value with every earlier one

This rung is too slow for the largest tests (3.5 s measured at n = 2 · 10^5 with all values different), so it is not a numbered approach. It is the baseline to state first.

#### What I say out loud

> "The direct way: walk through the numbers, and for each one scan everything before it. If none of the earlier numbers is equal, this is the value's first occurrence, so I count it. Correct, but the scans add up to n(n − 1)/2 comparisons when all values differ: about 2 · 10^10 at the limit."

#### Intuition

Each distinct value has exactly one first occurrence. Recognise first occurrences by looking backwards.

#### Algorithm

1. Read n and the numbers into `x`.
2. `distinct = 0`. For each i, scan j from 0 to i − 1; stop at the first `x[j] == x[i]`.
3. If the scan found nothing, `distinct++`.
4. Print `distinct`.

#### Why it is correct

- **Each distinct value is counted at least once:** at its first occurrence, no earlier element is equal, so the scan finds nothing and it is counted.
- **No value is counted twice:** at every later occurrence, the first occurrence is among the earlier elements, so the scan finds it and the occurrence is skipped.

#### Dry run

Input `5` / `2 3 2 2 3`

| i | x[i] | Earlier values compared | Found equal? | distinct |
|---|---|---|---|---|
| 0 | 2 | none | no | 1 |
| 1 | 3 | 2 | no | 2 |
| 2 | 2 | 2 (j = 0) | yes | 2 |
| 3 | 2 | 2 (j = 0) | yes | 2 |
| 4 | 3 | 2, 3 (j = 1) | yes | 2 |

Prints `2`.

#### Java code

```java title="Alternative: compare with every earlier value (too slow at n = 2 · 10^5)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] x = readNumbers(in, n);
        System.out.println(countByScanningEarlier(x));
    }

    /** Counts each value at its first occurrence: x[i] is new if no earlier x[j] equals it. */
    static int countByScanningEarlier(int[] x) {
        int distinct = 0;
        for (int i = 0; i < x.length; i++) {
            boolean seenBefore = false;
            for (int j = 0; j < i; j++) {          // compare with every earlier value
                if (x[j] == x[i]) {
                    seenBefore = true;
                    break;
                }
            }
            if (!seenBefore) {
                distinct++;
            }
        }
        return distinct;
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

**O(n²) in the worst case**, n being the count of numbers: when all values differ, element i is compared with all i earlier ones, n(n − 1)/2 comparisons in total. Measured on my machine (JDK 26), 3.5 s at n = 2 · 10^5, all different. It is fast when there are few distinct values, since each scan then stops early: O(n · d) for d distinct values.

#### Space complexity

**O(n)** for the array of numbers; O(1) beyond it.

#### The bridge to the next approach

> "The waste is that each scan looks at the earlier values in no useful order. If equal values were next to each other, 'seen before' would just mean 'equal to my left neighbour', one comparison. Sorting puts them next to each other, for n log n."

### Approach 1: Sort, then count where the value changes (recommended)

#### What I say out loud

> "I sort the array. Equal values then form contiguous blocks, and the number of distinct values is the number of blocks. A block starts at index 0 and at every i where x[i] differs from x[i − 1]. Sorting is O(n log n), the count is one pass."

#### Intuition

After sorting, the first occurrence of each value (in sorted order) is the position where the value changes. Counting distinct values becomes counting changes.

#### Algorithm

1. Read n and the numbers into `x` (an `int[]`, not `Integer[]`).
2. `Arrays.sort(x)`.
3. `distinct = 1` (n ≥ 1, so `x[0]` starts a block). For i from 1 to n − 1: if `x[i] != x[i - 1]`, `distinct++`.
4. Print `distinct`.

#### Why it is correct

- **Sorted order groups equal values.** In a sorted array, if x[i] = x[k] with i < k, every element between them is squeezed between equal values and so equals them too. Each distinct value therefore occupies one contiguous block.
- **The loop counts block starts.** Index 0 starts a block, and i > 0 starts one exactly when x[i] ≠ x[i − 1]. So `distinct` is the number of blocks, which is the number of distinct values.
- Sorting does not change which values are present, only their order, so the count is the same as for the original list.

#### Dry run

Input `5` / `2 3 2 2 3`. After sorting: `2 2 2 3 3`.

| i | x[i − 1] | x[i] | Change? | distinct |
|---|---|---|---|---|
| start | | 2 | (block at 0) | 1 |
| 1 | 2 | 2 | no | 1 |
| 2 | 2 | 2 | no | 1 |
| 3 | 2 | 3 | yes | 2 |
| 4 | 3 | 3 | no | 2 |

Prints `2`.

#### Java code

```java title="Approach 1: sort, then count changes (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] x = readNumbers(in, n);

        Arrays.sort(x);                            // equal values become neighbours
        int distinct = 1;                          // n >= 1: x[0] starts the first block
        for (int i = 1; i < n; i++) {
            if (x[i] != x[i - 1]) {                // a new block of equal values starts here
                distinct++;
            }
        }
        System.out.println(distinct);
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

**O(n log n)** for the sort, then O(n) for the pass. For `Arrays.sort(int[])`, the JDK documentation's implementation note (Java 17) describes a dual-pivot quicksort that "offers O(n log(n)) performance on all data sets"; that is a description of the current implementation rather than a contract of the method, but it means there is no known input that makes this sort quadratic in current JDKs. Measured on my machine: about 0.1–0.17 s for the whole program at n = 2 · 10^5, JVM start included; the sort itself takes about 25 ms on random values.

#### Space complexity

**O(n)** for the array of numbers. Beyond it, the sort's extra memory is an implementation detail of the JDK (recursion stack, and possibly a work buffer); it is not part of the method's contract.

#### The bridge to the next approach

> "Sorting does more than I need: it orders all the values, when I only need to know 'seen or not'. A hash set answers that one question in O(1) expected time per number, so the whole thing is O(n) expected. Let me see whether it is actually faster here, and what 'expected' is hiding."

### Approach 2: Hash set of the values seen

#### What I say out loud

> "I add every number to a `HashSet<Integer>`. Adding a value that is already there changes nothing, so at the end the size of the set is the number of distinct values. Each add is O(1) on average if the hash codes spread well, so O(n) expected."

#### Intuition

A set stores each value once by definition. Pour everything in and read off the size.

#### Algorithm

1. Read n and the numbers.
2. `seen = new HashSet<>(2 * n)` (sized so that it never has to grow).
3. For each value, `seen.add(value)`.
4. Print `seen.size()`.

#### Why it is correct

- A `Set` contains no duplicate elements (`add` returns false and leaves the set unchanged when an equal element is present), and `Integer.equals` compares values.
- After all adds the set contains exactly the values that occur in the input, each once, so its size is the answer.

#### Dry run

Input `5` / `2 3 2 2 3`

| Value | `add` returns | Set after |
|---|---|---|
| 2 | true | {2} |
| 3 | true | {2, 3} |
| 2 | false | {2, 3} |
| 2 | false | {2, 3} |
| 3 | false | {2, 3} |

Size 2, prints `2`.

#### Java code

```java title="Approach 2: hash set"
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

        Set<Integer> seen = new HashSet<>(2 * n);  // room for n keys without resizing
        for (int value : x) {
            seen.add(value);                       // a repeat leaves the set unchanged
        }
        System.out.println(seen.size());
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

**O(n) expected**, assuming the hash codes spread the values evenly over the buckets: n adds at O(1) each on average. That assumption is the catch, because `Integer.hashCode()` is the value itself, so anyone choosing the input can choose values that land in the same buckets (section 9 builds such an input). With all keys in one bucket a plain chained table would cost O(n) per add, O(n²) in total. Current Java `HashMap` implementations (Java 8 onwards) turn a bucket with more than 8 entries into a balanced tree, which for comparable keys such as `Integer` limits an operation to about O(log n); that is implementation behaviour, not a guarantee of the `HashSet` API.

What I measured (JDK 26, in-process timing of just the counting step, n = 2 · 10^5, all values different):

| Input | Sort `int[]` + count | `HashSet` sized 2n | `HashSet` default size |
|---|---|---|---|
| Random values in 1..10^9 | about 26 ms | about 16 ms | about 29 ms |
| Values built to share 105 buckets | about 10–13 ms | about 45 ms | about 47 ms |

Whole-program times were 0.09–0.17 s for both approaches on every input. So on this problem both pass easily; the hash set wins slightly on random data and loses about 3× on colliding data.

#### Space complexity

**O(n) expected**, but with a large constant: each distinct value becomes a boxed `Integer` (values above 127 are not cached) plus a `HashMap` node, tens of bytes per value scattered over the heap, against 4 bytes per value in the sorted `int[]`.

## 5. Comparison table

n is the number of input values and d the number of distinct values.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Alt. Compare with every earlier value | O(n · d) | O(n²), 3.5 s at n = 2 · 10^5 | O(n) array |
| 1. Sort, count changes | O(n log n) | O(n log n) per the JDK implementation note | O(n) array |
| 2. Hash set | O(n), if hash codes spread well | O(n²) for chained buckets; about O(n log n) with current Java tree buckets for `Integer` keys (not an API guarantee) | O(n), tens of bytes per distinct value |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Alt. Compare with earlier | No data structure, no idea needed | Quadratic | Only to state the baseline |
| 1. Sort | Deterministic bound; primitive `int[]`, no boxing; no hash assumptions | n log n; reorders the input | The CSES submission; any time inputs may be adversarial |
| 2. Hash set | O(n) expected; the shortest code; keeps the input order; extends to streaming | Expected bound only; boxing and memory; slower on crafted collisions | Interviews where "expected O(n)" is the stated goal; values that cannot be sorted cheaply; online "seen before?" questions |

## 6. Which solution to give, and when to stop optimizing

**The solution I recommend:** Approach 1, sort then count changes. Its bound does not depend on how the input was chosen, it uses a primitive array with no boxing, and on this problem it is as fast as the hash set in practice (both well under 0.2 s whole-program at the limit). Approach 2 is asymptotically better only in expectation, and its advantage at n = 2 · 10^5 is a few milliseconds on random data, reversed on colliding data.

**In an interview,** say both. The hash set is often what the interviewer expects first ("O(n) expected"), and that is a fine answer as long as you say *expected* and what it assumes. If asked which you would ship against untrusted input, say the sort, and why.

**Is it optimal?** In the comparison model, element distinctness has a known Ω(n log n) worst-case lower bound (for algebraic decision trees), so the sort is optimal among algorithms that only compare. Hashing escapes that model by computing with the values, which is how it reaches O(n) expected. Stop here: the remaining risk is input speed, not the algorithm.

## 7. Interview script: code it and test it

### What I say while coding

> "I read into an `int[]`, not an `Integer[]`. Sorting `int[]` is the primitive sort, and comparing `int`s with `!=` compares values; with `Integer` objects `!=` compares references."

> "`distinct` starts at 1, because n ≥ 1 and index 0 always starts a block. Starting at 0 would undercount by one."

> "The reader takes tokens until it has n numbers, so it does not depend on all of them being on one line."

### Testing out loud

**Example `5` / `2 3 2 2 3`:** sorted `2 2 2 3 3`, one change, so 1 + 1 = 2. Correct.

**n = 1, `1000000000`:** the loop does not run, `distinct` = 1.

**All equal, `3` / `7 7 7`:** no changes, 1.

**All different, `4` / `4 3 2 1`:** sorted `1 2 3 4`, three changes, 4 = n.

**n = 2 · 10^5:** about 2 · 10^5 tokens through `StringTokenizer`; the sort is about 3.5 · 10^6 comparisons. Fine.

**Official tests:** all three programs on this page print the expected answer on the 4 official CSES tests stored with this site (n up to 10), run on a real JVM. Those tests are tiny, so the tests for this page add n = 2 · 10^5 inputs: all equal, 100 distinct values, all different (ascending, descending, random) and the colliding keys from section 9.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1 min | Format, value range (no lookup array), n |
| Ladder | 2 min | Quadratic scan, sort and count changes, hash set; cost of each |
| Choose | 1 min | Expected vs guaranteed; pick one and say why |
| Code | 3 min | Fast input, `int[]`, sort, one pass |
| Test | 2 min | Example, n = 1, all equal, all different |

If stuck, write the sorted example `2 2 2 3 3` and point at where the value changes.

## 9. Interviewer challenges

### About the choice of data structure

#### Your hash set is O(n). Why would you ever submit the sort?

**What they are testing:** whether you know what "expected" hides, and whether you measure before choosing.

**How to reason:** the hash set's bound assumes spread-out hash codes; who chooses the input? What do boxing and pointer-chasing cost at this size?

**What I say:** "The O(n) is expected, under the assumption that hash codes spread well. `Integer`'s hash code is the value itself, and `HashMap` picks the bucket from the low bits after mixing in the high 16 bits, so it is easy to construct values that share buckets: I built 2 · 10^5 values in 1..10^9 that land in just 105 of the 2^19 buckets. Current Java turns such crowded buckets into trees, so it degrades to about log time per operation rather than linear, and my measurement went from 16 ms to 45 ms. That is fine here, but it is implementation behaviour, not a promise. Sorting a primitive `int[]` has no such assumption, no boxing, and measured just as fast. So for a judge or untrusted input I submit the sort."

**Nuance:** without tree buckets, my colliding input would put about 1,900 keys in each bucket, so each add would scan up to that many: on the order of 10^8 equality checks in total (an estimate, not measured). On judges with adaptive "anti-hash" tests (known on Codeforces, especially against C++ `unordered_set`) such inputs are written on purpose; CSES tests are fixed, but the habit matters. A randomized hash (a random seed mixed into a strong mixing function) or sorting are the standard defences.

#### Could you use a `TreeSet` instead?

**What they are testing:** knowing the ordered alternative and its cost.

**How to reason:** a balanced search tree gives guaranteed O(log n) per operation.

**What I say:** "Yes: a `TreeSet<Integer>` gives O(n log n) worst case with no hash assumption, and its size is the answer. But it boxes every value and allocates a tree node per distinct value, so it is slower than sorting an `int[]` with the same bound. It is the right tool only if I also needed the values in order while they arrive."

**Nuance:** this is the same trade-off as sorting, paid in a heavier data structure; worth one sentence, not code.

### About implementation

#### What goes wrong if you read into `Integer[]` and sort that?

**What they are testing:** Java boxing semantics.

**How to reason:** `!=` on two `Integer` objects compares references.

**What I say:** "The comparison `x[i] != x[i - 1]` would compare object identities. Java caches `Integer` objects only from −128 to 127, so for `1000 2000 1000` the two 1000s are different objects and the count comes out 3 instead of 2 (I ran it), while small values happen to work. I'd need `.equals`, and the object sort is slower anyway. With `int[]` the problem does not arise."

**Nuance:** the test that passes with small values and fails with large ones is the dangerous kind; this problem's values go up to 10^9.

## 10. Follow-up questions the interviewer might ask

**"Print the distinct values in increasing order."**
Sort and print x[i] at each block start. O(n log n). (A hash set would need sorting afterwards anyway.)

**"Answer 'how many distinct values so far?' after each number, as they arrive."**
The sort no longer works, since it needs all the input first. Keep a hash set and print its size after each add: O(n) expected. A `TreeSet` gives O(n log n) guaranteed.

**"How many distinct values in each window of k consecutive numbers?"**
A hash map from value to count in the window: add the entering value, decrement the leaving one, and track how many counts are positive. O(n) expected. That is [[cses-sliding-window-distinct-values|Sliding Window Distinct Values]].

**"Many queries: how many distinct values in x[a..b]?"**
Offline with a Fenwick tree over positions, keeping only the last occurrence of each value: O((n + q) log n). That is [[cses-distinct-values-queries|Distinct Values Queries]].

**"Values up to 10^6 instead of 10^9."**
Then a `boolean[10^6 + 1]` marks values directly: O(n + V) time, deterministic, V being the value bound.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Calling the hash set "O(n)" without "expected".** Its bound assumes well-spread hash codes; say so, and know what Java does when they are not.
- **Planning an array indexed by value.** Values go to 10^9: a billion entries. That works only for small value ranges.
- **Assuming the input is sorted** because the example looks almost grouped. It is in arbitrary order.

### Implementation mistakes

> [!MISTAKE] Starting the counter at 0 in the sort version
> With `int distinct = 0` and the loop from i = 1, the first block is never counted: the example prints `1` instead of `2` (verified). Index 0 always starts a block, so the count starts at 1 (n ≥ 1 is guaranteed).

- **Comparing boxed `Integer`s with `!=`.** For `1000 2000 1000` it prints 3 (verified); use `int[]`.
- **Reading with `Scanner`.** It is much slower per token than `BufferedReader` with `StringTokenizer`; it may still pass at 2 · 10^5 numbers, but the habit fails on larger CSES inputs.
- **Counting `x[i] != x[i + 1]` without guarding the last index.** It reads past the end of the array.

## 12. Pattern recognition

**The pattern:** "seen before?" in one of two forms: sort so that duplicates are neighbours, or keep a set of the values seen. Counting distinct values, detecting duplicates, and finding first or last occurrences are all the same question.

**Signals in the problem statement:**

- "distinct", "unique", "duplicate", "appears before".
- Values too large for a direct lookup array (here 10^9), which means sorting or hashing.
- No order needed in the answer, which makes the hash set possible; adversarial or judged input, which makes the sort attractive.

**Related problems in this list:**

- [[nc-contains-duplicate|Contains Duplicate]]: the yes/no version of the same question, with the same sort-or-set choice.
- [[cses-distinct-values-subsequences|Distinct Values Subsequences]]: counts each distinct value's occurrences instead of just its presence.
- [[cses-sliding-window-distinct-values|Sliding Window Distinct Values]]: the count of distinct values, maintained as a window slides.
- [[cses-distinct-values-subarrays|Distinct Values Subarrays]]: subarrays without repeats, with a set and two pointers.
- [[nc-longest-consecutive-sequence|Longest Consecutive Sequence]]: a hash set used for membership tests with an O(n) expected answer.

**Takeaway:** sort-and-compare-neighbours and a hash set answer the same question; one gives a deterministic n log n on a primitive array, the other an expected O(n) that depends on the hash codes. Know both, and say which assumption each makes.

## 13. 60-second revision card

**Key insight:** count first occurrences. Sorted, they are the positions where the value changes.

**Invariant:** after sorting, equal values form one contiguous block each; `distinct` = number of block starts seen so far.

**Complexity:** O(n log n) time, O(n) space (sort); O(n) expected with a hash set.

**Code skeleton:**

```java title="Distinct Numbers, sort and count changes"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] x = new int[n];
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < n; i++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(in.readLine());
            x[i] = Integer.parseInt(st.nextToken());
        }
        Arrays.sort(x);
        int distinct = 1;
        for (int i = 1; i < n; i++) if (x[i] != x[i - 1]) distinct++;
        System.out.println(distinct);
    }
}
```

**Main traps:**

- `int[]`, not `Integer[]` (`!=` on objects).
- Start the count at 1.
- Hash set: "O(n) expected", not O(n).

**What to say in one breath:** "Distinct values are block starts in the sorted array, so I sort an `int[]` and count positions where the value changes: O(n log n), with no assumption about the input. A hash set gives O(n) expected, but `Integer` hash codes are the values themselves, so colliding inputs are easy to build; Java's tree buckets soften that, but it's implementation behaviour, so I submit the sort."
