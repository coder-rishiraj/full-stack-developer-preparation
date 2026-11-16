---
problemId: cses-static-range-sum-queries
title: Static Range Sum Queries
source: cses
sourceUrl: https://cses.fi/problemset/task/1646
difficulty: easy
patterns: [range-queries, prefix-sum]
relatedLessons: [a2-prefix-suffix, a1-java-syntax-competitive, a12-fenwick, a12-segment-trees, a14-brute-force-first, a14-deriving-optimization]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

You get an array of n positive integers x_1, …, x_n, and then q questions. Each question names two positions a ≤ b and asks for x_a + x_(a+1) + … + x_b, the sum of the values from position a to position b, both included. Print one answer per line. The array never changes between questions. This is a whole program: it reads standard input and writes standard output.

**Example** (the one in the CSES statement)

Input:

```text
8 4
3 2 4 5 1 1 5 3
2 4
5 6
1 8
3 3
```

Output:

```text
11
2
24
4
```

- `2 4` is 2 + 4 + 5 = 11 (positions 2, 3 and 4; positions count from 1).
- `5 6` is 1 + 1 = 2.
- `1 8` is the whole array, 24.
- `3 3` is the single value at position 3, 4.

**What the problem statement guarantees**

- 1 ≤ n, q ≤ 2 · 10^5.
- 1 ≤ x_i ≤ 10^9.
- 1 ≤ a ≤ b ≤ n for every question, so a range is never empty and never leaves the array.
- Time limit 1 second, memory limit 512 MB.

## 2. Practice first: try it before reading on

If you have not solved this yet, stop here. Everything below this section stays hidden until you ask for it. The problem is short, but the interviewer is listening for three things: the cost of the obvious solution at these limits, the idea that removes the repeated work, and the size of the numbers involved.

**How to practise**

1. Set a timer for 15 minutes.
2. Write the direct solution and work out how many additions it does in the worst case at n = q = 2 · 10^5.
3. Find a way to answer each question with a constant number of operations after some preparation.
4. Work out the largest answer the program can ever print, and pick a type that holds it.
5. Decide how you read 2 · 10^5 numbers and 4 · 10^5 more, and how you print 2 · 10^5 lines, in well under a second.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> The same array is asked about up to 2 · 10^5 times, and many questions overlap. If you had to answer every question about ranges that start at position 1, could you do it quickly? And can every other range be written in terms of two of those?

> [!HINT] Hint 2: the kind of tool you need
> Precompute, for every position i, the sum of the first i values. The sum from a to b is "everything up to b" minus "everything before a".

> [!HINT] Hint 3: almost the whole plan
> Build an array `s` of length n + 1 with s[0] = 0 and s[i] = s[i − 1] + x_i, in a 64-bit type. Answer each question with s[b] − s[a − 1]. The largest answer is 2 · 10^5 · 10^9 = 2 · 10^14, far beyond a 32-bit integer. Read with a buffered reader and collect the answers in one buffer that you print once.

**Check yourself before revealing the walkthrough**

- [ ] I know the worst-case cost of re-adding each range, and why it fails here
- [ ] My per-question work is constant, and I can say why the formula gives exactly the range
- [ ] I know the largest answer and my type holds it
- [ ] My program answers `1 1` / `7` / `1 1` with 7, and a range that starts at position 1 without reading outside the array

## 3. Interview script: understand the problem (≈2 min)

Treat it as if an interviewer had said: "Here is an array that never changes. I'll ask you many times for the sum of a range. Make the questions fast."

**Me:** So I read n and q, the n values, then q pairs (a, b), and for each pair print the sum of positions a through b, both included. Are positions 1-based?

**Interviewer:** Yes. Position 1 is the first value.

**Me:** Is a always at most b, and both inside the array?

**Interviewer:** Yes, 1 ≤ a ≤ b ≤ n.

**Me:** Does the array change between questions, or do I get all the values up front?

**Interviewer:** It never changes. All the values come first, then all the questions.

**Me:** How big can things get?

**Interviewer:** n and q are each up to 2 · 10^5, values between 1 and 10^9, one second.

**Me:** Then the biggest answer is the whole array at its largest: 2 · 10^5 values of 10^9 is 2 · 10^14. That is about a hundred thousand times what an `int` holds, so every sum goes in a `long`. A single value still fits in an `int`, since 10^9 is below 2,147,483,647.

**Me:** And output: one answer per line, in the order of the questions?

**Interviewer:** Yes.

**Me:** Let me do the second question by hand. `5 6`: positions 5 and 6 hold 1 and 1, so 2. And `2 4`: 2 + 4 + 5 = 11. If I keep a running total of the array, 3, 5, 9, 14, 15, …, then the total up to 4 is 14, the total up to 1 is 3, and 14 − 3 = 11 as well. That second way might be the useful one.

### Given constraints

These are in the CSES statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 2 · 10^5 | Precomputing one number per position is cheap: 2 · 10^5 `long` values are 1.6 MB. |
| 1 ≤ q ≤ 2 · 10^5 | The work per question decides everything. O(n) per question is up to 4 · 10^10 additions in total, far too many for a second. O(1) or O(log n) per question is fine. |
| 1 ≤ x_i ≤ 10^9 | A value fits an `int`, but a sum of up to 2 · 10^5 of them reaches 2 · 10^14: sums go in a `long` (up to about 9.2 · 10^18). |
| 1 ≤ a ≤ b ≤ n | No empty ranges, no out-of-range positions; the only boundary to handle is a = 1, where "everything before a" is nothing. |
| Time limit 1 s | About 6 · 10^5 numbers in and 2 · 10^5 lines out: buffered input and one buffered output, not `Scanner` and a `println` per answer. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Positions are 1-based | I store the precomputed totals at indices 0..n with index 0 meaning "nothing yet", so a question (a, b) maps to indices a − 1 and b without shifting. |
| The array never changes | Any preparation I do is paid once and reused by every question. If values could change, the preparation would go stale; that is a different problem. |
| One answer per line, in order | I can answer each question as I read it; no need to store the questions. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The input matches the statement (no a > b, no empty array) | I do not validate it. I will mention that a > b would give a negative "sum" with the formula, and an a of 0 would read index −1. |
| I may use O(n) extra memory | The limit is 512 MB and the preparation needs about 1.6 MB. |

### Edge cases I will keep in mind

- n = 1: one value, and every question is `1 1`.
- a = b: a single value.
- a = 1: the range starts at the first value, so "everything before a" is the empty total, 0.
- b = n and the whole array `1 n`.
- Every value 10^9 at n = 2 · 10^5: the answer 2 · 10^14 must not overflow.

## 4. Think out loud: from first idea to best solution

All three rungs below answer the same question, "sum of x_a..x_b", and differ only in how much they prepare before the questions arrive. The direct approach prepares nothing, the block approach prepares about √n partial totals, and prefix sums prepare n + 1 of them. n is the array length, q the number of questions.

**Measured cost:** each program was run as `java Main < input` on my machine (JDK 26), JVM start-up included (an empty program takes about 0.03 s), on n = q = 2 · 10^5 inputs. Three inputs: every question `1 n`, every question a random range, and every question `2 n−1` (the worst case for the block approach).

### Alternative: add up each range on demand

This rung is too slow for the largest tests (about 27 s measured), so it is not a numbered approach. It is still the baseline an interviewer expects you to state, with its cost.

#### What I say out loud

> "The direct way: for each question, loop from a to b and add. It's certainly correct. The cost is the length of the range, up to n, so q questions cost up to n · q additions: 4 · 10^10 at the limits. That's far over a second, so I'll need to stop re-adding the same values."

#### Intuition

The question literally says "add these values". Do exactly that, once per question.

#### Algorithm

1. Read n, q and the values into `x[1..n]`.
2. For each question (a, b): `sum = 0`; for i = a..b, `sum += x[i]`; print `sum`.

#### Why it is correct

The loop visits exactly the positions a, a + 1, …, b, each once, and adds each value once. The sum is held in a `long`, so no partial total overflows (at most 2 · 10^14).

#### Dry run

The example, `x = [3, 2, 4, 5, 1, 1, 5, 3]` (positions 1..8).

| Question | Values added | Additions | Answer |
|---|---|---|---|
| `2 4` | 2, 4, 5 | 3 | 11 |
| `5 6` | 1, 1 | 2 | 2 |
| `1 8` | 3, 2, 4, 5, 1, 1, 5, 3 | 8 | 24 |
| `3 3` | 4 | 1 | 4 |

14 additions for 4 questions. The whole-array question alone costs n.

#### Java code

```java title="Alternative: add each range again (too slow at n = q = 2 · 10^5)"
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
        int n = nextInt();
        int q = nextInt();
        int[] x = new int[n + 1];              // 1-indexed, like the queries
        for (int i = 1; i <= n; i++) {
            x[i] = nextInt();
        }

        StringBuilder out = new StringBuilder();
        for (int k = 0; k < q; k++) {
            int a = nextInt();
            int b = nextInt();
            long sum = 0;                      // up to 2 * 10^14: needs long
            for (int i = a; i <= b; i++) {     // re-adds the whole range every time
                sum += x[i];
            }
            out.append(sum).append('\n');
        }
        System.out.print(out);
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

**O(n + Σ (b − a + 1))**, which is **O(n · q) in the worst case**: every question can be `1 n`. At n = q = 2 · 10^5 that is 4 · 10^10 additions. Measured: **about 27 s** with every question `1 n`, and **about 6.7 s** with random ranges (whose average length is about n/4). Both are far over the 1-second limit.

#### Space complexity

**O(n)** for the values. Answers are collected in one `StringBuilder` (O(q) characters), which every approach on this page shares.

#### The bridge to the next approach

> "The waste: question `1 8` adds 3 + 2 + 4 + … and question `2 4` adds 2 + 4 + 5 again, from scratch. The values never change, so I could add up chunks of the array once and reuse them. If I cut the array into blocks of about √n values and store each block's total, a long range is mostly whole blocks, one stored number each, plus at most two partial blocks at the ends."

### Approach 1: Block totals (square-root decomposition)

#### What I say out loud

> "I split the array into blocks of length about √n, roughly 448 at n = 2 · 10^5, and store each block's total. For a question I add single values until I reach a block boundary, then whole blocks by their totals, then the leftover single values at the right end. That's at most about √n single values on each side and n/√n = √n blocks: about 3√n steps, roughly 1,300, instead of up to 2 · 10^5."

#### Intuition

A ruler with centimetre marks: to measure from 2.3 cm to 9.6 cm you don't count every millimetre, you count millimetres up to the next mark, whole centimetres, then millimetres again. The block totals are the centimetre marks.

#### Algorithm

1. Pick `size = ⌊√n⌋ + 1`. Value i (0-based inside the program) belongs to block i / size.
2. Read the values; `block[i / size] += x[i]`.
3. For each question, convert to 0-based l = a − 1, r = b − 1, then:
   - while l ≤ r and l is not at the start of a block: add `x[l]`, l++;
   - while the whole block starting at l fits (l + size − 1 ≤ r): add `block[l / size]`, l += size;
   - while l ≤ r: add `x[l]`, l++.
4. Print the sum.

#### Why it is correct

- **Every position from l to r is counted once:** the three loops move l forward without skipping, and each step adds either one value (and moves l by 1) or the total of the block that starts at l (and moves l past exactly that block, which lies inside the range because l + size − 1 ≤ r).
- **Nothing outside the range is counted:** every loop checks against r before adding.
- **The middle loop only adds whole blocks:** it starts at a block boundary, since the first loop stops only when l is a multiple of `size` (or the range is used up).
- **Overflow:** sums are `long`; a block total is at most size · 10^9 ≈ 4.5 · 10^11.

#### Dry run

The example: n = 8, so size = ⌊√8⌋ + 1 = 3, and the blocks are `[3, 2, 4]`, `[5, 1, 1]`, `[5, 3]` with totals 9, 7, 8.

| Question | 0-based l..r | Left singles | Whole blocks | Right singles | Answer |
|---|---|---|---|---|---|
| `2 4` | 1..3 | x[1] = 2, x[2] = 4 | none (3 + 2 > 3) | x[3] = 5 | 11 |
| `5 6` | 4..5 | x[4] = 1, x[5] = 1 | none | none | 2 |
| `1 8` | 0..7 | none (0 is a boundary) | 9, 7 | x[6] = 5, x[7] = 3 | 24 |
| `3 3` | 2..2 | x[2] = 4 | none | none | 4 |

In `1 8` the last block `[5, 3]` is shorter than `size`, so the middle loop does not take it as a whole block; the right-hand loop adds its two values.

#### Java code

```java title="Approach 1: block totals, about 3√n steps per question"
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
        int n = nextInt();
        int q = nextInt();
        int size = (int) Math.sqrt(n) + 1;     // block length, about sqrt(n)
        int[] x = new int[n];                  // 0-indexed inside the program
        long[] block = new long[n / size + 1]; // block[j] = sum of x[j*size .. j*size+size-1]
        for (int i = 0; i < n; i++) {
            x[i] = nextInt();
            block[i / size] += x[i];
        }

        StringBuilder out = new StringBuilder();
        for (int k = 0; k < q; k++) {
            int l = nextInt() - 1;
            int r = nextInt() - 1;
            long sum = 0;
            while (l <= r && l % size != 0) {  // left partial block, one value at a time
                sum += x[l++];
            }
            while (l + size - 1 <= r) {        // whole blocks, one stored sum each
                sum += block[l / size];
                l += size;
            }
            while (l <= r) {                   // right partial block
                sum += x[l++];
            }
            out.append(sum).append('\n');
        }
        System.out.print(out);
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

**O(n + q√n) in the worst case.** Building the totals is one pass. A question touches at most size − 1 values on each side and at most n/size whole blocks, so about 3√n ≈ 1,340 steps at n = 2 · 10^5, and about 2.7 · 10^8 steps for 2 · 10^5 questions. Measured over several runs: **about 0.3 s** with every question `1 n` or random ranges, and **0.45 to 0.5 s** with every question `2 n−1`, where both partial blocks are as long as they get. That passes, but with less margin than I'd like on a slower judge.

#### Space complexity

**O(n)** for the values plus **O(√n)** for the block totals.

#### The bridge to the next approach

> "Blocks help because a stored total replaces many additions. But I still pay for the partial blocks at both ends. What if every stored total started at the same place, position 1? Then I'd have the total up to b and the total up to a − 1, and the range a..b is exactly the first minus the second. No partial blocks at all: two lookups and a subtraction, whatever the range."

### Approach 2: Prefix sums (recommended)

#### What I say out loud

> "I precompute s[i], the sum of the first i values, with s[0] = 0. The sum from a to b is s[b] − s[a − 1]: s[b] covers positions 1..b, s[a − 1] covers 1..a − 1, and the difference is exactly a..b. One pass to build, O(1) per question. The totals reach 2 · 10^14, so the array is `long[]`."

#### Intuition

It's an odometer. To know how far you drove between the 2nd and the 4th stop, you don't add up the legs; you subtract the odometer reading at stop 1 from the reading at stop 4. s[i] is the odometer reading after position i.

#### Algorithm

1. Read n and q. Create `prefix = new long[n + 1]` (so `prefix[0] = 0`).
2. For i = 1..n: `prefix[i] = prefix[i − 1] + x_i`. The values themselves need not be kept.
3. For each question (a, b): append `prefix[b] − prefix[a − 1]` and a newline to a `StringBuilder`.
4. Print the builder once.

#### Why it is correct

- **Invariant of the build:** after step i, `prefix[i] = x_1 + … + x_i`. It holds for i = 0 (the empty sum) and each step adds exactly x_i.
- **The formula:** for 1 ≤ a ≤ b ≤ n, `prefix[b] = (x_1 + … + x_(a−1)) + (x_a + … + x_b)` and `prefix[a − 1] = x_1 + … + x_(a−1)`. Subtracting cancels the first part exactly, leaving x_a + … + x_b.
- **The a = 1 case** needs no special code: `prefix[0] = 0`. That is the reason for the extra slot at index 0.
- **Why subtraction is allowed at all:** addition has an inverse. That sounds trivial, but it's what fails for "minimum of a range", where knowing the minimum of 1..b and of 1..a − 1 does not tell you the minimum of a..b.
- **Overflow bound:** the largest prefix total is n · 10^9 ≤ 2 · 10^14 (computed: 200,000 · 1,000,000,000 = 200,000,000,000,000), far below `Long.MAX_VALUE` ≈ 9.22 · 10^18. Each x_i (≤ 10^9) fits an `int` when read, and `prefix[i − 1] + nextInt()` adds a `long` and an `int`, which Java does in `long`.

**The 20-second version:** "I store prefix[i], the sum of the first i values, with prefix[0] = 0. The range a..b is prefix[b] minus prefix[a − 1], because the shared part 1..a − 1 cancels. Building is O(n), each question is O(1), and I use `long` because a range can sum to 2 · 10^14."

#### Dry run

The example: `x = [3, 2, 4, 5, 1, 1, 5, 3]`.

| i | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|---|
| x_i | | 3 | 2 | 4 | 5 | 1 | 1 | 5 | 3 |
| prefix[i] | 0 | 3 | 5 | 9 | 14 | 15 | 16 | 21 | 24 |

| Question | prefix[b] | prefix[a − 1] | Answer |
|---|---|---|---|
| `2 4` | prefix[4] = 14 | prefix[1] = 3 | 11 |
| `5 6` | prefix[6] = 16 | prefix[4] = 14 | 2 |
| `1 8` | prefix[8] = 24 | prefix[0] = 0 | 24 |
| `3 3` | prefix[3] = 9 | prefix[2] = 5 | 4 |

#### Java code

```java title="Approach 2: prefix sums (recommended)"
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
        int n = nextInt();
        int q = nextInt();
        long[] prefix = new long[n + 1];       // prefix[i] = x_1 + ... + x_i, prefix[0] = 0
        for (int i = 1; i <= n; i++) {
            prefix[i] = prefix[i - 1] + nextInt();
        }

        StringBuilder out = new StringBuilder();
        for (int k = 0; k < q; k++) {
            int a = nextInt();
            int b = nextInt();
            out.append(prefix[b] - prefix[a - 1]).append('\n');
        }
        System.out.print(out);                 // one write for all q answers
    }

    static int nextInt() throws IOException {
        while (!st.hasMoreTokens()) {
            st = new StringTokenizer(in.readLine());
        }
        return Integer.parseInt(st.nextToken());
    }
}
```

**Why this I/O:** `BufferedReader` with `StringTokenizer` reads the roughly 6 · 10^5 numbers quickly, and one `StringBuilder` printed once avoids 2 · 10^5 separate writes. I measured the same algorithm three ways on the random-range input: `Scanner` with a `println` per answer took **0.88 s**, `BufferedReader` with a `println` per answer **0.72 s**, and the version above **0.18 s**, JVM start-up included. The first two are dangerously close to the 1-second limit for a problem whose algorithm takes milliseconds.

#### Time complexity

**O(n + q) in the worst case:** one pass to build, two array reads and a subtraction per question. In the worst case a correct program has to read the whole input, which is n + 2q numbers, so this is optimal up to the constant. Measured: **0.13 s** with every question `1 n`, **0.18 s** with random ranges, **0.19 s** with every question `2 n−1`.

#### Space complexity

**O(n)** auxiliary: n + 1 `long` values, 1.6 MB at the largest n. The values themselves are not stored; the output buffer is O(q) characters, as in every approach.

## 5. Comparison table

n is the array length, q the number of questions. Times are my measurements at n = q = 2 · 10^5 (JVM start-up included).

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Alt. Add each range again | O(n · q) | O(n · q): about 27 s measured | O(n) values |
| 1. Block totals | O(n + q√n) | O(n + q√n): about 0.3 to 0.5 s measured | O(n) values + O(√n) totals |
| 2. Prefix sums | O(n + q) | O(n + q): 0.13 to 0.19 s measured | O(n): n + 1 `long` totals |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Alt. Add each range again | Nothing to prepare; no formula to get wrong | Quadratic in the worst case; about 27 s at the limits | Only to state the baseline, or when there are very few questions |
| 1. Block totals | Point updates are easy (change one value and one block total in O(1)); works for operations without an inverse, like minimum | About 3√n per question; three loops with boundary conditions | When values change between questions and a Fenwick tree feels like too much, or as a stepping stone in the interview |
| 2. Prefix sums | O(1) per question; five lines of logic | Goes stale if a value changes (O(n) to rebuild); needs an invertible operation | The answer to give whenever the array is static |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2, prefix sums in a `long` array of length n + 1, with buffered input and one buffered output. It is O(n + q), which matches the cost of reading the input, and it is about as short as a program gets.

**How to present the ladder:** say the direct loop and its 4 · 10^10 worst case in one breath, mention blocks only if you need a stepping stone or the interviewer asks about updates, and go to prefix sums.

**When another tool is better:** if values could change between questions, a prefix array costs O(n) per change. Then a **Fenwick tree** (binary indexed tree) or a **segment tree** gives O(log n) per change and O(log n) per range sum; that is the CSES problem Dynamic Range Sum Queries. For this static problem they only add a log factor and more code, so do not reach for them here, but say that you know where the line is.

**When to stop:** after prefix sums. There is nothing left to optimize in the algorithm; the remaining risks are `long`, the off-by-one in `a − 1`, and I/O speed.

## 7. Interview script: code it and test it

### What I say while coding

> "`new long[n + 1]`: index 0 is the empty total, so a question that starts at position 1 reads `prefix[0] = 0` and needs no special case."

> "`prefix[i] = prefix[i − 1] + nextInt()`: the left side is `long`, so the addition happens in `long`. The value itself fits an `int`."

> "`prefix[b] − prefix[a − 1]`, not `prefix[b] − prefix[a]`: I want to keep x_a, so I subtract only what comes before it."

> "All the answers go into one `StringBuilder`, printed once at the end."

### Testing out loud

**The example:** prefix = 0, 3, 5, 9, 14, 15, 16, 21, 24. `2 4` → 14 − 3 = 11, `5 6` → 16 − 14 = 2, `1 8` → 24 − 0 = 24, `3 3` → 9 − 5 = 4. Matches.

**n = 1, `1 1` with value 7:** prefix = 0, 7; answer 7 − 0 = 7.

**a = b:** `3 3` above gave the single value 4, since prefix[3] − prefix[2] is exactly x_3.

**a = 1:** `1 8` read prefix[0] = 0, never index −1.

**Overflow:** with three values of 10^9, `1 3` is 3 · 10^9. In `long` it prints 3000000000. With an `int` prefix array it prints −1294967296 (I ran it). At n = 2 · 10^5 values of 10^9, `1 n` is 2 · 10^14.

**Official tests:** all three programs on this page (the slow alternative included) print the expected output on the official CSES test stored with this site (CSES has two tests for this problem; the site stores the small one, n = 8 with all 36 ranges), run on a real JVM. It is small, so the tests for this page add the largest n and q, values of 10^9, and the overflow boundaries 2^31 − 1 and 2^31.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2 min | 1-based positions, static array, limits, largest answer 2 · 10^14 |
| Ladder | 3 min | Direct loop and its n · q cost; (blocks if useful); prefix sums with the a − 1 boundary |
| Code | 5 min | `long[n + 1]`, the build loop, the query loop, fast I/O |
| Test | 3 min | The example, a = 1, a = b, the overflow case |
| Follow-ups | 2 min | Updates (Fenwick tree), minimum instead of sum |

If you get stuck, write the running totals of the example under the array and look at two of them, 14 and 3. Their difference is the first answer.

## 9. Interviewer challenges

### About correctness

#### Why is it `prefix[a − 1]` and not `prefix[a]`?

**What they are testing:** whether you can derive the boundary instead of guessing it.

**How to reason:** write out what each prefix covers and subtract.

**What I say:** "prefix[b] covers positions 1..b. I want a..b, so I remove 1..a − 1, which is prefix[a − 1]. Subtracting prefix[a] would also remove x_a. On the example that bug prints 9, 1, 21, 0 instead of 11, 2, 24, 4. I ran it."

**Nuance:** the extra slot `prefix[0] = 0` is what makes the formula work at a = 1. With an n-element array (prefix[i] = sum of the first i + 1 values) you need `a == 1 ? prefix[b−1] : prefix[b−1] − prefix[a−2]`, a branch that invites mistakes.

#### Would the same trick give the minimum of a range?

**What they are testing:** whether you know why prefix sums work, not only that they do.

**How to reason:** the formula undoes the part before a. That needs an inverse operation.

**What I say:** "No. Prefix sums rely on subtraction undoing addition. Minimum has no inverse: if the minimum of 1..b is 1 and the minimum of 1..a − 1 is also 1, I learn nothing about a..b. XOR works, because x ^ x = 0 makes XOR its own inverse; minimum and maximum need a different structure, like a sparse table for a static array."

**Nuance:** the general condition is that the operation forms a group (associative, with an identity and inverses): sums, XOR, products of nonzero numbers modulo a prime. Products of ordinary integers lose this as soon as a zero appears.

### About implementation

#### Is `int` enough anywhere?

**What they are testing:** overflow awareness backed by numbers.

**How to reason:** bound every quantity: a value, a prefix total, an answer.

**What I say:** "A single value, yes: 10^9 < 2,147,483,647. A prefix total, no: it reaches 2 · 10^14. With all values 10^9, the third prefix total, 3 · 10^9, already overflows an `int`. I ran an `int` version: on `1 3` over three values of 10^9 it prints −1294967296."

**Nuance:** the `int` version is not wrong everywhere. `int` subtraction wraps modulo 2^32, so `prefix[b] − prefix[a − 1]` still comes out right whenever the true answer fits an `int`: on the same input, `2 3` prints 2000000000 correctly (run). It is wrong exactly when the answer exceeds 2^31 − 1, which is why tests with small values miss it.

#### Why not `Scanner` and `System.out.println`?

**What they are testing:** awareness that I/O can dominate a judged program.

**How to reason:** count the tokens and lines: about 6 · 10^5 numbers in, 2 · 10^5 lines out.

**What I say:** "I measured it: `Scanner` with a `println` per answer took 0.88 s on a random input at the limits, against 0.18 s with `BufferedReader` and one `StringBuilder`. The algorithm itself is a few milliseconds; the difference is all I/O."

**Nuance:** most of that gap is output: replacing only the `println` calls took the time from 0.72 s to 0.18 s. In current JDKs `System.out` is set up to flush on every `println` (an implementation detail, not a documented guarantee), so 2 · 10^5 lines become 2 · 10^5 small writes. One buffer printed once avoids that; `BufferedReader` handles the input side.

### About changing requirements

#### What if values can change between questions?

**What they are testing:** whether you know the limit of your structure and the next tool.

**How to reason:** a change to x_i changes prefix[i..n], up to n entries.

**What I say:** "Then prefix sums cost O(n) per update, which is too slow with many updates. A Fenwick tree keeps partial sums over power-of-two-sized ranges, so an update touches O(log n) of them and a prefix sum reads O(log n) of them; a range is still prefix(b) − prefix(a − 1). A segment tree does the same and also handles minimum. Block totals are a simpler middle ground: O(1) update, O(√n) query."

**Nuance:** if updates come only after all questions, or in rare batches, rebuilding the prefix array in O(n) per batch can be simpler and fast enough. Count the operations before choosing.

## 10. Follow-up questions the interviewer might ask

**"Values can change between questions."**
That is [[cses-dynamic-range-sum-queries|Dynamic Range Sum Queries]]: a [[a12-fenwick|Fenwick tree]] or [[a12-segment-trees|segment tree]], O(log n) per update and per query.

**"The question is the XOR of a range."**
That is [[cses-range-xor-queries|Range Xor Queries]]: the same prefix idea with XOR, since x ^ x = 0 lets XOR undo itself.

**"The question is the minimum of a range."**
Prefix sums do not apply (no inverse). That is [[cses-static-range-minimum-queries|Static Range Minimum Queries]], solved with a sparse table: O(n log n) to build, O(1) per query.

**"The array is a 2D grid and the question is a rectangle."**
Build 2D prefix sums and combine four of them by inclusion–exclusion: [[cses-forest-queries|Forest Queries]] and [[nc-range-sum-query-2d-immutable|Range Sum Query 2D - Immutable]]. O(n²) to build, O(1) per query.

**"Instead of questions, you get many 'add v to every value in a..b' updates, and want the final array."**
The reverse of this problem: a difference array, O(1) per update and O(n) at the end. See [[a2-difference-arrays|Difference Arrays]].

**"Count the ranges whose sum equals k."**
A range sum is a difference of two prefix sums, so count pairs of prefix sums that differ by k with a hash map: [[cses-subarray-sums-ii|Subarray Sums II]]. O(n) expected.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Stopping at "loop over the range".** It is O(n) per question; the bound to state is n · q = 4 · 10^10.
- **Choosing `long` only for the answer.** The prefix totals are where the large numbers live; they need `long` even when a particular answer is small.
- **Reaching for a segment tree on a static array.** It works, but costs O(log n) per question and many more lines, with no benefit when nothing changes.
- **Assuming the trick works for any operation.** It needs an inverse: sum and XOR yes, minimum and maximum no.

### Implementation mistakes

> [!MISTAKE] Subtracting `prefix[a]` instead of `prefix[a − 1]`
> That also removes x_a. On the example it prints 9, 1, 21, 0 instead of 11, 2, 24, 4 (run). Derive the boundary from "prefix[i] covers 1..i".

- **An `int[]` prefix array.** On three values of 10^9, `1 3` prints −1294967296 (run). The answers that fit an `int` still come out right, so small tests pass.
- **No slot for index 0.** With `long[n]` and 1-based questions, `prefix[a − 1]` reads index −1 or the indices shift by one; the n + 1 layout avoids both.
- **A `println` per answer.** Correct, but 0.72 s of the 1-second budget on a random input at the limits (measured), against 0.18 s with one `StringBuilder`.

## 12. Pattern recognition

**The pattern:** prefix sums for static range queries. Precompute "everything up to i" once; a range is the difference of two such totals.

**Signals in the problem statement:**

- "Many queries" on data that "does not change".
- The query is a sum, a count, or a XOR over a contiguous range: an operation you can undo.
- n and q both large, so per-query work must be O(1) or O(log n).

**Related problems in this list:**

- [[cses-range-xor-queries|Range Xor Queries]]: the same structure with XOR, and the cleanest place to see why an inverse is needed.
- [[cses-forest-queries|Forest Queries]]: the 2D version with inclusion–exclusion over four corners.
- [[nc-range-sum-query-2d-immutable|Range Sum Query 2D - Immutable]]: the same 2D idea as a class with a constructor and a query method.
- [[cses-dynamic-range-sum-queries|Dynamic Range Sum Queries]]: the version with updates, where a Fenwick tree replaces the prefix array.
- [[nc-subarray-sum-equals-k|Subarray Sum Equals K]]: range sums as differences of prefix sums, combined with a hash map to count them.

**Takeaway:** when the same static data answers many range questions, spend O(n) once to store "everything up to here", and every question becomes a subtraction.

## 13. 60-second revision card

**Key insight:** sum(a..b) = prefix[b] − prefix[a − 1], with prefix[0] = 0.

**Invariant:** prefix[i] = x_1 + … + x_i.

**Complexity:** O(n + q) time, O(n) extra memory.

**Code skeleton:**

```java title="Static Range Sum Queries, prefix sums"
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
        int n = nextInt(), q = nextInt();
        long[] prefix = new long[n + 1];
        for (int i = 1; i <= n; i++) prefix[i] = prefix[i - 1] + nextInt();
        StringBuilder out = new StringBuilder();
        while (q-- > 0) {
            int a = nextInt(), b = nextInt();
            out.append(prefix[b] - prefix[a - 1]).append('\n');
        }
        System.out.print(out);
    }

    static int nextInt() throws IOException {
        while (!st.hasMoreTokens()) st = new StringTokenizer(in.readLine());
        return Integer.parseInt(st.nextToken());
    }
}
```

**Main traps:**

- `long`: answers reach 2 · 10^14.
- `prefix[a − 1]`, not `prefix[a]`; index 0 holds 0.
- Fast I/O: one `StringBuilder`, printed once.

**What to say in one breath:** "The array never changes, so I store prefix sums once, in `long` because a range can reach 2 · 10^14. Each question is prefix[b] minus prefix[a − 1]. O(n + q) total, and the I/O is buffered both ways."
