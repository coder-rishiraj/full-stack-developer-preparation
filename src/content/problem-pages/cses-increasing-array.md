---
problemId: cses-increasing-array
title: Increasing Array
source: cses
sourceUrl: https://cses.fi/problemset/task/1094
difficulty: easy
patterns: [introductory, greedy]
relatedLessons: [a1-java-syntax-competitive, a2-array-string-traversal, a10-sorting-greedy, a14-edge-cases]
companies: []
timeToSolve: 8
---

## 1. Problem restatement

You get an array of n integers. In one move you may increase any single element by 1. Print the smallest number of moves that makes the array non-decreasing, meaning every element is at least as large as the one before it.

**Example 1**

- Input: n = 5, array `3 2 5 1 7`
- Output: `5`
- Why: the 2 must become at least 3 (1 move), and the 1 must become at least 5, the largest value before it (4 moves). The result `3 3 5 5 7` is non-decreasing after 5 moves, and no smaller number works because each of those raises is forced.

**Example 2**

- Input: n = 3, array `1 2 2`
- Output: `0`
- Why: equal neighbours are allowed ("at least the previous"), so the array is already fine.

**What the problem statement guarantees**

- The first input line is n, the second holds the n integers.
- 1 ≤ n ≤ 2 · 10^5.
- 1 ≤ x_i ≤ 10^9.
- Moves only increase elements; there is no decrease operation.
- Time limit: 1 second.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The program is short, but it has one decision you must justify (why your choice of raise is the cheapest) and one number you must size correctly. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 8 minutes.
2. Solve `5 4 3 2 1` by hand and write down the final array.
3. Write a complete program that reads standard input and writes standard output.
4. Work out the largest answer the constraints allow before you choose its type.
5. Explain in two sentences why no cheaper sequence of moves exists.

Open a hint only after a minute without progress.

> [!HINT] Hint 1: a small nudge
> Look at one element on its own. Given everything before it, what is the smallest value it can end up with? Can raising it more than that ever help an element further right?

> [!HINT] Hint 2: the kind of tool you need
> One left-to-right pass. You need to remember a single number about the prefix you have already processed, not the whole prefix.

> [!HINT] Hint 3: almost the whole plan
> Keep the largest value seen so far. For each element, if it is below that value, add the difference to the answer (the element is raised to exactly that value); otherwise it becomes the new largest value. Then compute the answer for 10^9 followed by 199,999 ones and check your type.

**Check yourself before revealing the walkthrough**

- [ ] My program prints `5` for `3 2 5 1 7` and `10` for `5 4 3 2 1`
- [ ] I compare each element with the largest value before it, not just with its original neighbour
- [ ] I can say how large the answer can get and why my type holds it
- [ ] I can explain why raising each element to exactly the needed value is optimal

## 3. Interview script: understand the problem (≈2 min)

Read aloud by an interviewer, this sounds like an array puzzle. The clarifications that matter are "non-decreasing or strictly increasing?", "only increases?", and the size of the answer.

**Me:** Let me say it back. I can add 1 to any element, as many times as I like. I want the fewest additions so that every element is at least the previous one. Equal neighbours are fine?

**Interviewer:** Yes, non-decreasing.

**Me:** And I can only increase, never decrease?

**Interviewer:** Only increase.

**Me:** Input format: n on the first line, then the n numbers?

**Interviewer:** Yes. n is up to 2 · 10^5, each value between 1 and 10^9. One second.

**Me:** That's a lot of numbers to read, so I'll use `BufferedReader` with `StringTokenizer` instead of `Scanner`. And the answer: if the first value is 10^9 and the other 199,999 are 1, each needs 10^9 − 1 moves. That's 199,999 × 999,999,999 = 199,998,999,800,001, about 2 · 10^14. Way past `int`, so the total is a `long`.

**Interviewer:** Good.

**Me:** Let me try `3 2 5 1 7` by hand. 3 is fine. 2 is below 3, raise it to 3: one move. 5 is fine. 1 is below 5, not just below its neighbour, because the neighbour is 5: raise it to 5, four moves. 7 is fine. Total 5.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 2 · 10^5 | One pass is about 2 · 10^5 steps. Quadratic (about 2 · 10^10 for the prefix-maximum brute force) is too slow. n = 1 means 0 moves. |
| 1 ≤ x_i ≤ 10^9 | Each value fits an `int`, and so does each single difference (below 10^9). The total can reach (2 · 10^5 − 1)(10^9 − 1) = 199,998,999,800,001, so the total needs a `long`. |
| Only +1 moves | An element can never go down, so its final value is at least its original value. |
| Time limit 1 s | Reading 2 · 10^5 numbers with `Scanner` is a common source of slowness in Java; `BufferedReader` and `StringTokenizer` keep reading well under 0.1 s. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Non-decreasing, equal neighbours allowed | An element equal to the running maximum costs 0. With "strictly increasing" each element would need to exceed the maximum by 1 instead. |
| Only increases | No element is ever lowered, which is what makes the greedy argument below work. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The numbers may be split across lines | I refill the tokenizer whenever it runs out, so the reader does not depend on the line layout. |

### Edge cases I will keep in mind

- n = 1: answer 0.
- Already non-decreasing, including equal values (`1 2 2 3`, `5 5 5`): answer 0.
- Strictly decreasing (`5 4 3 2 1`): every element is raised to 5, answer 10.
- A dip after a peak (`3 2 5 1 7`): the 1 is compared with 5, not with its neighbour's original value.
- The largest answer: 10^9 followed by 199,999 ones, answer 199,998,999,800,001. The smallest input that overflows an `int` total is shorter: `10^9 1 1 1` already needs 2,999,999,997.

## 4. Think out loud: from first idea to best solution

The first correct idea: element i must end up at least as large as every element before it, so it needs `max(x[0..i]) − x[i]` moves. Computing that maximum from scratch for every i is O(n^2), about 2 · 10^10 steps at n = 2 · 10^5, far too slow for one second; it appears in the tests as a reference, not as an approach. The repeated work is visible: the prefix maximum for i + 1 is the prefix maximum for i with one more element. The two approaches below both avoid it.

### Approach 1: Raise elements in place, left to right

#### What I say out loud

> "I read the whole array. Then I walk left to right: if an element is smaller than the one before it, I raise it to exactly that value, add the difference to the answer, and write the new value back. Because I write it back, the element before the next one is already raised, so it carries the maximum forward."

#### Intuition

Fix the array one position at a time. When I reach position i, positions 0 to i − 1 are already fixed and non-decreasing, so the only constraint on `x[i]` is to be at least `x[i − 1]` (its raised value). Raising it to exactly that is the cheapest way to fix it, and leaves the smallest possible value for the next element to clear.

#### Algorithm

1. Read n and the array `x`.
2. `moves = 0` (a `long`).
3. For `i` from 1 to n − 1: if `x[i] < x[i − 1]`, add `x[i − 1] − x[i]` to `moves` and set `x[i] = x[i − 1]`.
4. Print `moves`.

#### Why it is correct

**Invariant:** after step i, `x[0..i]` is non-decreasing, `x[i]` equals the maximum of the original values in positions 0 to i, and `moves` is the number of moves spent so far.

- **Enough:** each raise makes `x[i] ≥ x[i − 1]`, so at the end the whole array is non-decreasing.
- **Necessary (no cheaper answer exists):** in any valid final array, element i is at least every final value before it, and each final value is at least its original value. So element i ends at least at `max(original x[0..i])`, and needs at least `max − x[i]` moves. My algorithm spends exactly that on each element, so its total equals the sum of these lower bounds, which no valid sequence of moves can beat.
- **Raising exactly that much never hurts later elements:** raising more would only increase the value later elements must reach. Raising exactly to the prefix maximum is the smallest value the element can legally have.

#### Dry run

Input `3 2 5 1 7`

| i | x[i−1] (current) | x[i] original | Raise? | moves | Array after the step |
|---|---|---|---|---|---|
| — | — | — | — | 0 | `3 2 5 1 7` |
| 1 | 3 | 2 | +1 → 3 | 1 | `3 3 5 1 7` |
| 2 | 3 | 5 | no | 1 | `3 3 5 1 7` |
| 3 | 5 | 1 | +4 → 5 | 5 | `3 3 5 5 7` |
| 4 | 5 | 7 | no | 5 | `3 3 5 5 7` |

Output `5`.

#### Java code

```java title="Approach 1: raise in place"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] x = new int[n];
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < n; i++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());   // numbers may span lines
            }
            x[i] = Integer.parseInt(st.nextToken());
        }
        long moves = 0;                                    // can reach about 2 * 10^14
        for (int i = 1; i < n; i++) {
            if (x[i] < x[i - 1]) {
                moves += x[i - 1] - x[i];                  // one difference fits an int
                x[i] = x[i - 1];
            }
        }
        System.out.println(moves);
    }
}
```

#### Time complexity

**O(n)**, where n is the array length: reading n numbers, then one loop with constant work per element.

#### Space complexity

**O(n) auxiliary space** for the array: 2 · 10^5 `int`s, about 800 KB.

#### The bridge to the next approach

> "The only thing each step reads from the past is the previous element's final value, which is the running maximum. So I don't need the array at all: I can read each number, compare it with one variable, and throw it away."

### Approach 2: One pass with a running maximum

#### What I say out loud

> "I keep `max`, the largest value read so far. For each new number: if it's below `max`, it costs `max − x` moves and `max` stays; otherwise it becomes the new `max` and costs nothing. The total is a `long`."

#### Intuition

Raising element i to the prefix maximum, as in Approach 1, means the "current previous element" is always the prefix maximum. Keeping just that number is enough, so the elements can be processed as they are read.

#### Algorithm

1. Read n. Set `max = 0`, `moves = 0` (a `long`).
2. For each of the n numbers `x`: if `x > max`, set `max = x`; otherwise add `max − x` to `moves`.
3. Print `moves`.

#### Why it is correct

Same argument as Approach 1. Element i must end at least at the maximum of the original values before and including it, which costs at least `max − x` moves; this total is reachable by raising each element to exactly that maximum, which makes the array non-decreasing. Starting `max` at 0 is safe because every value is at least 1, so the first number always becomes the maximum and costs nothing.

The spoken version: "Each element has to reach the largest value before it, since it can't go below anything earlier and nothing ever decreases. That costs `max − x`. Raising it exactly that far is enough to keep the array sorted and doesn't make later elements' targets any higher, so the sum of those gaps is the minimum."

#### Dry run

Input `4 9 2 9 6`

| x | x > max? | max after | Cost | moves |
|---|---|---|---|---|
| 4 | yes (0) | 4 | 0 | 0 |
| 9 | yes | 9 | 0 | 0 |
| 2 | no | 9 | 7 | 7 |
| 9 | no (equal) | 9 | 0 | 7 |
| 6 | no | 9 | 3 | 10 |

Output `10`.

#### Java code

```java title="Approach 2: running maximum, no array (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        StringTokenizer st = new StringTokenizer("");
        int max = 0;                       // every x is at least 1
        long moves = 0;                    // up to (2*10^5 - 1) * (10^9 - 1)
        for (int i = 0; i < n; i++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            int x = Integer.parseInt(st.nextToken());
            if (x > max) {
                max = x;
            } else {
                moves += max - x;          // raise x to max
            }
        }
        System.out.println(moves);
    }
}
```

#### Time complexity

**O(n)**: n reads and constant work per number. Measured as a fresh `java Main < input` run at n = 2 · 10^5 with values up to 10^9, each approach took under 100 ms in total, most of it JVM start-up (an empty program takes about 60 ms on the same machine).

#### Space complexity

**O(1) auxiliary space** for the algorithm. The reader still holds the current input line, which on CSES is the whole second line (about 2 MB at the largest size); a byte-level reader (below) avoids even that.

### Alternative: a byte-level reader

`DataInputStream` with a hand-written number parser reads bytes directly and skips `String` and `StringTokenizer` objects. It is a few times faster than `BufferedReader` + `StringTokenizer` and uses constant memory for the input. At 2 · 10^5 numbers the difference does not matter; it starts to matter around 10^6 or more numbers, which some later CSES problems have.

## 5. Comparison table

n = array length.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Naive: prefix maximum from scratch (prose only) | O(n^2) | O(n^2) | O(n) |
| 1. Raise in place | O(n) | O(n) | O(n) for the array |
| 2. Running maximum | O(n) | O(n) | O(1) besides the input buffer |
| Alt. Byte-level reader | O(n) | O(n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Naive | Matches the "reach the largest value before you" argument literally | 2 · 10^10 steps at the limit | Only as a test reference |
| 1. Raise in place | The final array is available (useful to print it); easy to trace | Stores the array; modifies the input | If the follow-up asks for the resulting array |
| 2. Running maximum | Least code and memory; works on a stream | None for this problem | The default answer |
| Alt. Byte-level reader | Fastest Java input | More code to type and get right | Inputs of 10^6+ numbers |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2, with a `long` total and buffered input, plus the two-sentence correctness argument.

**Is it optimal?** Yes. In the worst case a correct algorithm must read essentially every number (any unread value could be a deep dip that changes the answer), so Ω(n) is a worst-case lower bound, and Approach 2 is O(n) with O(1) extra memory.

**When to stop:** once the type is `long` and the input is buffered. A faster reader buys nothing at this input size.

## 7. Interview script: code it and test it

### What I say while coding

> "`BufferedReader`, and a `StringTokenizer` that I refill whenever it runs out, so it doesn't matter how the numbers are split into lines."

> "`max` starts at 0, which is below every allowed value, so the first number always becomes the maximum."

> "`moves` is a `long`. `max − x` is below 10^9, so the subtraction is safe in `int`, and it's widened when it's added."

> "Equal to `max` falls into the `else` branch and adds 0, which is correct for non-decreasing."

### Testing out loud

**Normal case:** `3 2 5 1 7`. `max` 3; 2 costs 1; `max` 5; 1 costs 4; `max` 7. Total 5. Matches.

**n = 1:** `7`. It becomes `max`; nothing is added. Output 0.

**Already sorted with equals:** `1 2 2 3`. 1, 2 become `max`; the second 2 costs 0; 3 becomes `max`. Output 0.

**Strictly decreasing:** `5 4 3 2 1`. `max` stays 5; costs 1, 2, 3, 4. Output 10.

**Largest answer:** 10^9 then 199,999 ones. Each 1 costs 999,999,999; total 199,998,999,800,001, which the tests check. In an `int` it would print −447,305,535 (section 11).

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | about 1 min | Non-decreasing, only increases, format, limits; compute the 2 · 10^14 bound |
| Explain and argue | 1–2 min | Each element must reach the prefix maximum; reaching exactly that is enough |
| Code | 2 min | Approach 2 |
| Test | 1–2 min | Example, `5 4 3 2 1`, n = 1, the overflow input |

The time should go into the correctness argument and the `long`. If you are stuck, solve `5 4 3 2 1` by hand and write the final array: every element ends at 5, the largest value before it.

## 9. Interviewer challenges

### About correctness

#### Why is raising each element to exactly the running maximum optimal? Maybe raising one more helps later.

**What they are testing:** whether you can argue a greedy choice rather than assert it.

**How to reason:** find a lower bound that any solution must pay, then show the greedy pays exactly that.

**What I say:** "Every element must end at least at the maximum of the original values up to it, because it can't be below the final value of anything earlier and nothing ever goes down. So every valid solution spends at least the sum of those gaps. My algorithm spends exactly that sum and produces a valid array, so it's optimal. Raising an element further only raises the bar for later elements; it can never lower it."

**Nuance:** the lower bound is per element and independent of the order of moves, which is why no clever ordering beats it.

#### Why not compare each element with its original neighbour?

**What they are testing:** whether you see that the neighbour may itself have been raised.

**How to reason:** find an input where the two differ.

**What I say:** "Because the neighbour's final value matters, not its original one. In `5 4 3 2 1`, comparing with the original neighbour gives 1 + 1 + 1 + 1 = 4, but the 3 must reach 5, not 4. The correct answer is 10."

**Nuance:** on the statement's example `3 2 5 1 7` the wrong version happens to give the right answer (5), because the only dips follow unraised elements. Examples alone can hide this bug.

### About the numbers

#### How large can the answer be, and what goes wrong with `int`?

**What they are testing:** overflow awareness, computed from the constraints.

**How to reason:** maximize every gap at once: one element at the top value, everything after it at the bottom value.

**What I say:** "At most (2 · 10^5 − 1)(10^9 − 1) = 199,998,999,800,001, from 10^9 followed by 199,999 ones. An `int` holds about 2.1 · 10^9, so it overflows silently. Even `10^9 1 1 1` overflows: the answer 2,999,999,997 prints as −1,294,967,299 in an `int`."

**Nuance:** each single difference fits an `int`, so only the accumulator needs to be `long`. If you wrote `moves += (long) max - x` the cast is harmless but not needed.

## 10. Follow-up questions the interviewer might ask

**"What if the array must be strictly increasing?"**
Element i must be at least `max + 1` where `max` is the final value of the previous element. Keep `prev` (the previous final value): if `x ≤ prev`, cost `prev + 1 − x` and set `prev = prev + 1`; otherwise `prev = x`. O(n), and the total can be larger by up to about n^2 / 2, still well inside a `long`.

**"What if you may also decrease elements, each ±1 costing one move?"**
Now the target is any non-decreasing array minimizing the total distance. Raising alone is no longer optimal: for `5 1 1 1` raising costs 12, but lowering the 5 to 1 costs 4. The known solution uses a max-heap (the "slope trick") in O(n log n). This is a much harder problem.

**"What if one move adds 1 to a whole contiguous range of elements?"**
Look at the neighbour differences `x[i] − x[i−1]`. A range move raises one difference by 1 (at its left end) and lowers at most one other (just after its right end), so each move repairs at most one unit of drop. Adding 1 to a suffix repairs exactly one unit and harms nothing. So the answer is the sum of `max(0, x[i−1] − x[i])` over the *original* neighbours: for `5 4 3 2 1` it is 4. O(n), O(1) space. Note this is exactly the formula that is wrong for the single-element version.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Comparing with the original previous element.** `5 4 3 2 1` gives 4 instead of 10 (run once). The previous element's *final* value is the running maximum.
- **Asserting the greedy without a reason.** Say the lower bound: each element must reach the prefix maximum, and the algorithm pays exactly that.

### Implementation mistakes

> [!MISTAKE] An `int` total
> With `int moves`, the input `1000000000 1 1 1` prints −1294967299 instead of 2999999997, and the largest case (10^9 followed by 199,999 ones) prints −447305535 instead of 199998999800001. Both were run once to confirm. The total needs `long`.

- **`Scanner` for 2 · 10^5 numbers.** It may still pass this problem, but it is noticeably slower than `BufferedReader` + `StringTokenizer` and is the habit that fails later CSES problems with 10^6 numbers.
- **Assuming all numbers are on one line without a refill loop.** If the judge's input wrapped lines, a single `StringTokenizer` would run out and throw `NoSuchElementException`.
- **Adding the gap before updating the maximum.** Writing `moves += max - x;` and then `if (x > max) max = x;` adds a negative amount whenever a new maximum arrives: the example `3 2 5 1 7` prints −2 instead of 5 (run once). Update `max` first, or use the `else` branch.

## 12. Pattern recognition

**The pattern:** greedy one-pass with a running aggregate. Each element's cost depends only on a summary of the prefix (here the maximum), and choosing the cheapest fix for each element is optimal because it never makes the future harder.

**Signals in the problem statement:**

- "Minimum number of operations" where each operation affects one element.
- A monotonic target ("non-decreasing", "each at least the previous").
- Operations go in one direction only (only increases).

**Related problems in this list:**

- [[cses-weird-algorithm|Weird Algorithm]]: the overflow lesson in a different setting, values rather than a total.
- [[cses-repetitions|Repetitions]]: another one-pass scan with a single piece of state.
- [[nc-best-time-to-buy-and-sell-stock|Best Time to Buy and Sell Stock]]: a running minimum of the prefix decides each element's contribution.
- [[nc-candy|Candy]]: neighbour constraints fixed greedily with left-to-right passes.

**Takeaway:** when each element must clear something defined by the prefix, carry that summary in one variable and add each element's gap; then compute the largest possible total before picking its type.

## 13. 60-second revision card

**Key insight:** element i must reach the maximum of everything before it; paying exactly that gap for each element is both necessary and sufficient.

**Invariant:** `max` is the largest value read so far, which is also the final value of the previous element.

**Complexity:** O(n) time, O(1) auxiliary space besides the input buffer.

**Code skeleton:**

```java title="Increasing Array in a dozen lines"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        StringTokenizer st = new StringTokenizer("");
        int max = 0;
        long moves = 0;
        for (int i = 0; i < n; i++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(in.readLine());
            int x = Integer.parseInt(st.nextToken());
            if (x > max) max = x; else moves += max - x;
        }
        System.out.println(moves);
    }
}
```

**Main traps:**

- `long` total: up to 199,998,999,800,001.
- Compare with the running maximum, not the original neighbour.
- Buffered input for 2 · 10^5 numbers.

**What to say in one breath:** "Every element has to reach the largest value before it, so I keep a running maximum and add `max − x` whenever an element falls below it. Raising exactly that far is the minimum and never hurts later elements. O(n) time, O(1) space, and the total needs a `long` because it can reach about 2 · 10^14."
