---
problemId: cses-digit-queries
title: Digit Queries
source: cses
sourceUrl: https://cses.fi/problemset/task/2431
difficulty: medium
patterns: [introductory, mathematics, binary-search-on-answer]
relatedLessons: [a1-java-syntax-competitive, a3-binary-search-on-answer, a14-brute-force-first, a14-edge-cases]
companies: []
timeToSolve: 30
---

## 1. Problem restatement

Write all positive integers one after another, with no separators: `12345678910111213141516…`. This string is infinite. You get q queries, each a position k (counted from 1), and for each one you print the digit at position k. This is a whole program reading standard input and writing standard output.

**Example**

- Input: `3`, then `7`, `19`, `12`
- Output: `7`, `4`, `1`
- Why: the first nine digits are 1 to 9, so position 7 is `7`. After them come `10`, `11`, `12`, `13`, `14`, …: positions 10–11 are `10`, 12–13 are `11`, so position 12 is the `1` that starts 11, and position 19 is the second digit of 14, a `4`.

**What the problem statement guarantees**

- 1 ≤ q ≤ 1000.
- 1 ≤ k ≤ 10^18.
- Time limit: 1 second.

## 2. Practice first: try it before reading on

If you have not solved this yourself yet, stop here. The string up to position 10^18 cannot be built or walked, so the question is how to jump to the right place. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 30 minutes.
2. By hand: which number contains position 10? Position 189? Position 190? Write down how many digits the one-digit numbers use, then the two-digit numbers, then the three-digit numbers.
3. Design a method that finds, for any k, the number that contains position k and which of its digits it is. Check it on the three example positions.
4. Work out the largest value your arithmetic forms when k = 10^18, and make sure it fits in 64 bits.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> All numbers with the same number of digits take the same space each. How many digits do the 2-digit numbers use in total? The 3-digit numbers?

> [!HINT] Hint 2: the kind of tool you need
> Group the string into blocks: all 1-digit numbers, all 2-digit numbers, and so on. The block of d-digit numbers has a size you can compute directly. Skip whole blocks until k falls inside one, and then use division inside that block.

> [!HINT] Hint 3: almost the whole plan
> The d-digit block holds 9 · 10^(d−1) numbers and d · 9 · 10^(d−1) digits. While k is larger than the current block, subtract the block and move to d + 1. Inside the block, with k counted from 1, the number is 10^(d−1) + (k − 1) / d and the digit is at index (k − 1) mod d of that number, from the left. Check which blocks k ≤ 10^18 can reach and the largest product you form.

**Check yourself before revealing the walkthrough**

- [ ] My method gives 7, 4, 1 for the example
- [ ] Position 189 gives `9` (the end of 99) and 190 gives `1` (the start of 100)
- [ ] I know which digit length position 10^18 falls into and that nothing overflows a `long`
- [ ] I read k as a 64-bit number, not an `int`

## 3. Interview script: understand the problem (≈3 min)

Treat it as if an interviewer had posed it. The questions are about indexing, the size of k, and the number of queries.

**Me:** Positions are 1-based, so position 1 is the `1` of the number 1?

**Interviewer:** Yes.

**Me:** Queries are independent, and I print one digit per line in input order?

**Interviewer:** Right.

**Me:** k goes up to 10^18. That's beyond `int`, so I read it as a `long`; `long` holds up to about 9.2 · 10^18. Building the string is out: even 10^9 characters would not fit in memory. And with up to 1000 queries, each query should be cheap, a few hundred operations at most.

**Interviewer:** Fine. How would you start?

**Me:** By hand. Digits 1 to 9 take positions 1–9. Then the 90 two-digit numbers, 10 to 99, take 180 positions: 10 to 189. Then 900 three-digit numbers, 2700 positions: 190 to 2889. So position 19 is in the two-digit part, at offset 19 − 9 = 10 there. Each two-digit number takes 2 positions, so offsets 1–2 are `10`, 3–4 are `11`, … offsets 9–10 are `14`. Offset 10 is the second digit of 14: `4`. That matches.

**Interviewer:** And for 10^18?

**Me:** Then I need the general sizes and to be careful with overflow. Let me define them before writing code.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ k ≤ 10^18 | k needs a `long`. No walking the string; each query needs arithmetic that skips huge stretches. Every intermediate value must stay under 2^63 − 1 ≈ 9.22 · 10^18. |
| 1 ≤ q ≤ 1000 | Even O(log k · digits) per query is tiny. I still read with `BufferedReader` and print once, the CSES habit. |
| Time limit 1 s | Far from binding once each query is polylogarithmic. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Positions are 1-based | Inside a block I convert to 0-based with k − 1 before dividing; mixing the two is the classic bug here. |
| One digit per line, in input order | Append each answer to one buffer. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The string starts at 1, not 0 | The statement says "all positive integers"; 0 is not in it. |

### Edge cases I will keep in mind

- k = 1 and k = 9: the first block, which has 9 numbers, not 10.
- k = 10 and k = 11: the first two-digit number, `10`.
- Block ends and starts: 189 → `9` (last digit of 99), 190 → `1` (first digit of 100), 191 → `0`.
- k = 10^18: lands in the 17-digit block, number 59477124183006535, digit `3`.
- The end of the 16-digit block, 158,888,888,888,888,889 → `9`, and the next position → `1`.

## 4. Think out loud: from first idea to best solution

**The first idea, and why it is not a numbered approach.** Build the string by appending 1, 2, 3, … until it has k characters, then read character k. For small k it is perfect, and it is the test file's reference for every position below 1.2 million. But at k = 10^18 it needs 10^18 characters of memory and time. Even without storing the string, counting the digits number by number visits about 6 · 10^16 numbers. So it stays a checking tool.

**What makes skipping possible.** The string is made of runs of equal-length numbers. Let me name the sizes.

- The d-digit numbers run from 10^(d−1) to 10^d − 1: there are **9 · 10^(d−1)** of them.
- Together they use **d · 9 · 10^(d−1)** digits. Call this block d.
- The digits used by all numbers with at most d digits: **S(d) = d · 10^d − (10^d − 1)/9**. Check: S(1) = 10 − 1 = 9, S(2) = 200 − 11 = 189, S(3) = 3000 − 111 = 2889. Proof by induction: S(d) − S(d − 1) = d · 10^d − (d − 1) · 10^(d−1) − 10^(d−1) = d · 10^d − d · 10^(d−1) = 9d · 10^(d−1), exactly block d.

| d | Numbers in block d | Digits in block d | Positions covered, S(d − 1) + 1 … S(d) |
|---|---|---|---|
| 1 | 9 | 9 | 1 … 9 |
| 2 | 90 | 180 | 10 … 189 |
| 3 | 900 | 2,700 | 190 … 2,889 |
| 16 | 9 · 10^15 | 1.44 · 10^17 | … 158,888,888,888,888,889 |
| 17 | 9 · 10^16 | 1.53 · 10^18 | … 1,688,888,888,888,888,889 |

So every k ≤ 10^18 is in a block with d ≤ 17, and the largest block size I ever need, 1.53 · 10^18, fits in a `long`. Block 18 would have 18 · 9 · 10^17 = 1.62 · 10^19 digits, which does not fit, so the code must never compute it.

There are two ways to use these sizes: search for the number that holds position k, or walk the blocks.

### Approach 1: Binary search on the number

#### What I say out loud

> "Let D(n) be the number of digits written for 1, 2, …, n. It's increasing in n, and I can compute it in O(number of digits of n) with the block sizes. The number that holds position k is the smallest n with D(n) ≥ k, which is a binary search. Then the digit is at offset k − D(n − 1) − 1 inside n."

#### Intuition

I don't know where k lands, but I can answer "has the string reached position k by the end of number n?" quickly for any n. That yes/no answer flips from no to yes exactly once as n grows, so binary search finds the flip point: the number containing position k.

#### Algorithm

1. `D(n)`: for each digit length d with 10^(d−1) ≤ n, add d · (min(n, 10^d − 1) − 10^(d−1) + 1).
2. For each query k: binary search n in [1, 10^17] for the smallest n with D(n) ≥ k. The upper bound works because D(10^17 − 1) = S(17) ≈ 1.69 · 10^18 ≥ 10^18.
3. `offset = k − D(n − 1) − 1` (0-based from the left of n); print that character of n's decimal string.

#### Why it is correct

- **D is right.** The d-digit numbers not above n are 10^(d−1) … min(n, 10^d − 1), each contributing d digits; summing over d counts every digit of 1..n once.
- **The search finds the right number.** D is strictly increasing, D(0) = 0 < k, and D(10^17) ≥ k, so a smallest n with D(n) ≥ k exists in the range. For that n, D(n − 1) < k ≤ D(n): position k is one of the digits that n adds.
- **The offset.** n's digits occupy positions D(n − 1) + 1 … D(n), so position k is at 0-based index k − D(n − 1) − 1 within n.
- **No overflow.** The search only evaluates D(n) for n ≤ 10^17, where D(n) ≤ D(10^17) = S(17) + 18 ≈ 1.69 · 10^18, and the largest power formed inside D is 10^18. All fit in a `long`.

#### Dry run

| k | Smallest n with D(n) ≥ k | D(n − 1) | D(n) | offset = k − D(n − 1) − 1 | Digit |
|---|---|---|---|---|---|
| 7 | 7 | 6 | 7 | 0 | `7` |
| 19 | 14 | 17 (9 + 2 · 4) | 19 | 1 | `4` |
| 12 | 11 | 11 (9 + 2) | 13 | 0 | `1` |
| 190 | 100 | 189 | 192 | 0 | `1` |

For k = 19 the search tests about 57 midpoints (log₂ 10^17 ≈ 56.5) before the range closes on 14.

#### Java code

```java title="Approach 1: binary search on the number"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    /** Total number of digits written for 1, 2, ..., n (n <= 10^17). */
    static long digitsUpTo(long n) {
        long total = 0;
        long low = 1;                                   // smallest d-digit number, 10^(d-1)
        for (int d = 1; low <= n; d++, low *= 10) {
            long high = Math.min(n, low * 10 - 1);      // largest d-digit number not above n
            total += (high - low + 1) * d;
        }
        return total;
    }

    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int q = Integer.parseInt(in.readLine().trim());
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < q; i++) {
            long k = Long.parseLong(in.readLine().trim());
            // smallest n with digitsUpTo(n) >= k: the number that holds position k
            long lo = 1, hi = 100_000_000_000_000_000L;  // digitsUpTo(10^17) > 10^18
            while (lo < hi) {
                long mid = lo + (hi - lo) / 2;
                if (digitsUpTo(mid) >= k) hi = mid;
                else lo = mid + 1;
            }
            int offset = (int) (k - digitsUpTo(lo - 1) - 1);   // 0-based, from the left of lo
            out.append(Long.toString(lo).charAt(offset)).append('\n');
        }
        System.out.print(out);
    }
}
```

#### Time complexity

Let L = 18, the most digits a number in the search range has. **O(q · L · log 10^17)**: about 57 search steps per query, each computing D in at most 18 loop iterations, so roughly 1,000 operations per query and 10^6 for q = 1000.

#### Space complexity

**O(1)** per query, plus the O(q) output buffer.

#### The bridge to the next approach

> "This works, and the 'monotone count, then binary search' idea is a tool I'd reuse. But it recomputes the same block sums about 57 times per query, and it needs two extra facts: a safe upper bound and the n − 1 offset. The blocks already tell me where k lands: if I walk them once, subtracting each block's size, the remainder tells me the number by a single division. No search needed."

### Approach 2: Skip whole blocks, then divide (recommended)

#### What I say out loud

> "I walk the blocks: 1-digit, 2-digit, and so on. While k is larger than the current block's digit count, I subtract that count and go to the next length. When k fits, it's a position inside the d-digit block, counted from 1. Each number there takes d positions, so the number is 10^(d−1) + (k − 1)/d, and the digit is index (k − 1) mod d from the left. For k ≤ 10^18 I stop at d = 17 at the latest, and the biggest product I form is 17 · 9 · 10^16, about 1.5 · 10^18, which fits in a `long`."

#### Intuition

It's a mixed-radix address. First I find which block the position is in, by subtracting block sizes like reading off a coarse unit. Inside a block all numbers have the same width, so the position splits evenly into "which number" (quotient) and "which digit" (remainder).

#### Algorithm

1. `d = 1`, `first = 1` (10^(d−1)), `count = 9` (numbers with d digits).
2. While `k > count · d`: `k −= count · d`; `d++`; `first *= 10`; `count *= 10`.
3. `number = first + (k − 1) / d`; `offset = (k − 1) % d`.
4. The answer is character `offset` of `number`'s decimal string.

#### Why it is correct

- **Loop invariant.** At the top of each iteration, k is the position counted from the start of block d (1-based), and the original position lies in block d or later. Initially d = 1 and k is the original position. If k > count · d, the position is past block d, so subtracting block d's size gives the position counted from the start of block d + 1, and `first`, `count` are updated to block d + 1's values.
- **The loop stops at the right block.** When k ≤ count · d, the position is inside block d, because k ≥ 1 throughout (k is only reduced when it exceeds the subtracted amount).
- **Inside the block.** Block d lists first, first + 1, …, each with d digits. Positions 1..d belong to `first`, d + 1..2d to `first + 1`, and so on: position k belongs to `first + (k − 1)/d`, at 0-based index (k − 1) mod d. The `k − 1` is what turns 1-based positions into this even split.
- **It ends, and nothing overflows.** Block sizes grow, so the loop runs at most 17 times for k ≤ 10^18: the remaining k when d reaches 17 is at most 10^18 − S(16) = 841,111,111,111,111,111, below block 17's size 1.53 · 10^18, so the loop never moves to d = 18. The largest values formed are `count · d` = 1.53 · 10^18, `count` = 9 · 10^16 and `number` < 10^17, all under 9.22 · 10^18.

**The 20-second version:** "Numbers with d digits form a block of 9 · 10^(d−1) numbers and d times as many digits. I subtract whole blocks while k is past them; then k is a 1-based position inside the d-digit block, so the number is 10^(d−1) + (k − 1)/d and the digit is (k − 1) mod d from its left. For k ≤ 10^18 the walk stops by d = 17, and the biggest product, 1.53 · 10^18, fits in a long."

#### Dry run

k = 19:

| d | first | count | Block size count · d | k before | k > block? | k after |
|---|---|---|---|---|---|---|
| 1 | 1 | 9 | 9 | 19 | yes | 10 |
| 2 | 10 | 90 | 180 | 10 | no, stop | 10 |

number = 10 + (10 − 1)/2 = 10 + 4 = 14, offset = 9 mod 2 = 1: the second digit of `14`, `4`.

k = 12: after block 1, k = 3; number = 10 + 2/2 = 11, offset 0: `1`. k = 7: stops in block 1; number = 1 + 6 = 7, offset 0: `7`. k = 190: after blocks 1 and 2, k = 190 − 9 − 180 = 1; number = 100, offset 0: `1`.

k = 10^18 (the largest input):

| Stage | Value |
|---|---|
| Blocks 1–16 subtracted | S(16) = 158,888,888,888,888,889 |
| k inside block 17 | 841,111,111,111,111,111 (block 17 has 1,530,000,000,000,000,000 digits, so the loop stops) |
| (k − 1) / 17 | 49,477,124,183,006,535 |
| number = 10^16 + that | 59,477,124,183,006,535 |
| offset = (k − 1) mod 17 | 15 |
| digit at index 15 of `59477124183006535` | `3` |

The test file checks this against an independent `BigInteger` computation.

#### Java code

```java title="Approach 2: skip whole blocks, then divide (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int q = Integer.parseInt(in.readLine().trim());
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < q; i++) {
            long k = Long.parseLong(in.readLine().trim());
            out.append(digitAt(k)).append('\n');
        }
        System.out.print(out);
    }

    /** The k-th digit (1-based) of 123456789101112... */
    static char digitAt(long k) {
        int d = 1;                      // length of the numbers in the current block
        long first = 1;                 // first d-digit number, 10^(d-1)
        long count = 9;                 // how many d-digit numbers exist, 9 * 10^(d-1)
        while (k > count * d) {         // largest product formed is 17 * 9 * 10^16 < 2^63
            k -= count * d;             // skip the whole block of d-digit numbers
            d++;
            first *= 10;
            count *= 10;
        }
        long number = first + (k - 1) / d;           // k is now 1-based inside the block
        int offset = (int) ((k - 1) % d);           // 0-based position inside that number
        return Long.toString(number).charAt(offset);
    }
}
```

#### Time complexity

**O(q · L)**, where L ≤ 17 is the number of blocks walked: at most 17 loop iterations per query, plus converting one number of at most 17 digits to a string. Measured on my machine (JDK 26), 1000 queries near 10^18 run in well under 0.1 s including JVM start; so does Approach 1.

#### Space complexity

**O(1)** per query, plus the O(q) output buffer.

Both programs print the expected output for all four official CSES tests stored for this problem (`public/tests/cses/cses-digit-queries.json`, 1000, 1000, 1000 and 99 queries, including positions around 158,888,888,888,888,840 and up to 10^18), run on a real JVM. The test file also checks them against the explicitly built string for every position below about 1.2 million, and against a `BigInteger` reference at every block boundary up to d = 16 and on random positions up to 10^18.

## 5. Comparison table

q is the number of queries, k ≤ 10^18 a position, and L ≤ 18 the digit count of the numbers involved. Nothing is randomized, so expected and worst case agree.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Build the string (prose only) | O(k) per query | O(k) per query | O(k) |
| 1. Binary search on the number | O(q · L · log 10^17) | O(q · L · log 10^17) | O(1) beyond the O(q) output |
| 2. Skip whole blocks | O(q · L) | O(q · L) | O(1) beyond the O(q) output |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Build the string | Impossible to get wrong for small k | Hopeless beyond about 10^8 | As the reference in tests |
| 1. Binary search | Only needs a monotone count D(n); the same idea solves many "k-th element of a sequence" problems | An upper bound, an n − 1 step and ~57 recomputations of D per query | When the count is easy but the inverse is not |
| 2. Skip blocks | Direct, short, at most 17 steps; the invariant is easy to state | The k − 1 conversion and the overflow argument must be said explicitly | The answer to give |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2. It is the shortest correct program, and its cost per query is at most 17 loop steps, so there is nothing left to optimize: reading the input already dominates. Mention Approach 1 if the interviewer asks for another way, because "count up to n, then binary search" is the general tool when the blocks are not this regular.

Where to spend the remaining minutes: the boundary positions (9, 10, 189, 190) and the overflow argument. Precomputing the 17 block sizes into an array saves nothing measurable.

## 7. Interview script: code it and test it

### What I say while coding

> "k is a `long`, read with `Long.parseLong`; `Integer.parseInt` throws a `NumberFormatException` on 10^18."

> "`first` and `count` are `long` too: at d = 9 the block has 8.1 · 10^9 digits, already past `int`."

> "The loop condition is `k > count * d`, strictly greater, so a position at the very end of a block stays in that block: k = 189 must stop in the 2-digit block, not move on."

> "Inside the block I divide k − 1, not k, because positions are 1-based."

### Testing out loud

**k = 7, 19, 12:** `7`, `4`, `1`, as traced above.

**k = 9:** 9 > 9 is false, stay in block 1; number 1 + 8 = 9, offset 0. `9`.

**k = 10:** 10 > 9, k = 1 in block 2; number 10, offset 0. `1`. **k = 11:** k = 2; number 10 + 1/2 = 10, offset 1. `0`.

**k = 189:** k = 180 in block 2, 180 > 180 is false, stay; number 10 + 179/2 = 99, offset 1. `9`. **k = 190:** `1`, the start of 100.

**k = 158,888,888,888,888,889 = S(16):** the last digit of 9,999,999,999,999,999: `9`. The next position is the first digit of 10^16: `1`.

**k = 10^18:** `3`, from the table above.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify, hand examples | 4 min | 1-based positions; positions 10, 19, 190 by hand |
| Block sizes | 5 min | 9 · 10^(d−1) numbers, d times as many digits; which d k ≤ 10^18 reaches |
| Algorithm and proof | 5 min | Subtract blocks, then quotient and remainder of k − 1 |
| Code | 6 min | `long` everywhere, strict `>` in the loop, `k − 1` |
| Trace | 5 min | 9, 10, 11, 189, 190, 10^18 |

If the block idea does not come, write the first 30 characters of the string with positions under them; the runs of equal-width numbers stand out.

## 9. Interviewer challenges

### About correctness

#### Why `(k − 1) / d` and not `k / d`?

**What they are testing:** off-by-one discipline with 1-based input.

**How to reason:** list the positions of the first two numbers of a block.

**What I say:** "In the 2-digit block, positions 1 and 2 are `10`, 3 and 4 are `11`. With k − 1 they become 0, 1 → quotient 0 and 2, 3 → quotient 1: exactly right. With k itself, position 2 would give quotient 1, the wrong number. Using k / d and k % d prints `8` for k = 7 and `1` for k = 19; I ran it."

**Nuance:** an equivalent fix is to make k 0-based once, at the start (`k--`), and use the conditions `k >= count * d`. One convention, applied everywhere, is what matters.

#### How do you know your loop never overflows?

**What they are testing:** whether you can bound values instead of hoping.

**How to reason:** find the last block the loop can reach, and the largest product it forms.

**What I say:** "The first 16 blocks hold 158,888,888,888,888,889 digits, so for k ≤ 10^18 the remaining k in block 17 is at most about 8.4 · 10^17, smaller than block 17's 1.53 · 10^18 digits. So the loop stops at d = 17 at the latest, and the largest product it ever forms is 17 · 9 · 10^16 = 1.53 · 10^18, under 9.22 · 10^18. Block 18, which would be 1.62 · 10^19, is never computed."

**Nuance:** if k could be as large as `Long.MAX_VALUE`, write the condition as `(k - 1) / d >= count`, which is the same test without the product; I checked that version against a `BigInteger` reference on 100,000 random positions up to 2^63 − 1.

### About implementation

#### What happens if you use `int` for `count` and `first`?

**What they are testing:** spotting where the sizes outgrow 32 bits.

**How to reason:** the 9-digit block has 9 · 10^8 numbers and 8.1 · 10^9 digits.

**What I say:** "`count * d` overflows at d = 9. Up to position 788,888,889, the end of the 8-digit block, the answers are right. From 788,888,890 on, the overflowed block size is negative, `k > count * d` stays true and the loop never stops: my run did not finish in 5 seconds."

**Nuance:** that is a hang, not a wrong answer, which is harder to diagnose on a judge: it shows up as "time limit exceeded" with an O(17) algorithm.

## 10. Follow-up questions the interviewer might ask

**"Return the whole number that contains position k, or the positions where number n starts."**
The first is `number` from the same code. The second is D(n − 1) + 1, with D from Approach 1. Both O(L).

**"The string is written in base b instead of base 10."**
Replace 9 · 10^(d−1) by (b − 1) · b^(d−1) and 10^(d−1) by b^(d−1), and extract the digit in base b. The overflow bound must be redone for the base.

**"Only even numbers, or only multiples of m, are written."**
Blocks still exist, but their sizes become counts of multiples of m in [10^(d−1), 10^d − 1], that is ⌊(10^d − 1)/m⌋ − ⌊(10^(d−1) − 1)/m⌋, and the number inside a block is the ((k − 1)/d)-th multiple of m from the first one in the block. O(L) per query.

**"Count how many times digit c appears among the first k positions."**
Much harder: find the number containing k as here, then count digit c in 1..n − 1 with a digit-counting DP or a per-position formula, plus the partial number. O(L²) per query.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Starting the first block at 0 or with 10 numbers.** The 1-digit numbers are 1 to 9: 9 of them. Starting at 0 shifts every answer.
- **Assuming 10^18 needs 18- or 19-digit numbers.** It is in the 17-digit block; the block structure grows fast. Working this out is what proves the arithmetic fits.
- **Binary searching on the position instead of the number.** The search space is the numbers n, with D(n) as the monotone function; searching over positions has nothing to test.

### Implementation mistakes

> [!MISTAKE] Dividing k instead of k − 1
> `number = first + k / d` and `offset = k % d` mix 1-based positions with 0-based arithmetic. That version prints `8` for k = 7 and `1` for k = 19 (verified); the correct answers are `7` and `4`.

> [!MISTAKE] 32-bit block sizes
> With `int count` and `int first`, `count * d` overflows at the 9-digit block. Positions up to 788,888,889 are still right; from 788,888,890 on, the loop never terminates (verified: no output after 5 seconds). Keep every size in `long`.

- **Reading k with `Integer.parseInt`.** It throws on any k above 2,147,483,647, so the large tests crash.
- **`>=` in the block loop.** `while (k >= count * d)` moves the last position of each block into the next one, where k becomes 0. Java's division rounds toward zero, so `(k − 1) / d` is 0 but `(k − 1) % d` is −1, and k = 9 crashes with `StringIndexOutOfBoundsException: Index -1` (verified).
- **Computing powers with `Math.pow`.** It returns a `double`; converting near 10^17 relies on floating-point exactness. Multiply `long`s by 10 instead.

## 12. Pattern recognition

**The pattern:** locating the k-th element of a structured sequence by skipping blocks of known size, then using division inside the block. When the blocks are irregular, the general form is "a monotone count of elements up to n, then binary search on n".

**Signals in the problem statement:**

- A position or index up to 10^18 into an implicit sequence: you cannot build it, so you must count your way to it.
- The sequence is made of runs whose lengths you can compute (all numbers with d digits, all rows of length r, all strings of length L).
- 1-based positions: plan the k − 1 conversion before writing code.

**Related problems in this list:**

- [[cses-number-spiral|Number Spiral]]: the inverse direction on a grid, value at a position by a formula from the layer it lies in, with `long` arithmetic.
- [[cses-two-knights|Two Knights]]: counting by blocks of a fixed shape instead of enumerating.
- [[cses-trailing-zeros|Trailing Zeros]]: a count over a huge range computed by summing a few terms (multiples of 5, 25, 125, …).
- [[nc-koko-eating-bananas|Koko Eating Bananas]]: binary search on the answer with a monotone check, the idea behind Approach 1.

**Takeaway:** for "the k-th thing" with k up to 10^18, find the block sizes, skip whole blocks, and finish with one division; then prove the largest intermediate value fits in 64 bits.

## 13. 60-second revision card

**Key insight:** the d-digit numbers form a block of d · 9 · 10^(d−1) digits. Subtract blocks while k is past them; then the number is 10^(d−1) + (k − 1)/d and the digit is at index (k − 1) mod d.

**Invariant:** k is the 1-based position from the start of the current block.

**Complexity:** O(17) per query, O(q) total; O(1) extra space besides the output.

**Code skeleton:**

```java title="Digit Queries"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int q = Integer.parseInt(in.readLine().trim());
        StringBuilder out = new StringBuilder();
        while (q-- > 0) {
            long k = Long.parseLong(in.readLine().trim());
            int d = 1;
            long first = 1, count = 9;
            while (k > count * d) { k -= count * d; d++; first *= 10; count *= 10; }
            out.append(Long.toString(first + (k - 1) / d).charAt((int) ((k - 1) % d))).append('\n');
        }
        System.out.print(out);
    }
}
```

**Main traps:**

- `k − 1` before dividing; strict `>` in the loop.
- Everything in `long`; k ≤ 10^18 stops at the 17-digit block, largest product 1.53 · 10^18.
- The first block has 9 numbers (1 to 9).

**What to say in one breath:** "The d-digit numbers take d · 9 · 10^(d−1) positions, so I subtract whole blocks while k is past them. Then k is a 1-based position inside the d-digit block: the number is 10^(d−1) + (k − 1)/d and the digit is (k − 1) mod d from its left. At most 17 steps per query, and every value stays under 1.6 · 10^18."
