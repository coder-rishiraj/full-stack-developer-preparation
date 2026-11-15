---
problemId: cses-weird-algorithm
title: Weird Algorithm
source: cses
sourceUrl: https://cses.fi/problemset/task/1068
difficulty: easy
patterns: [introductory, simulation]
relatedLessons: [a1-java-syntax-competitive, a1-big-o, a14-edge-cases]
companies: []
timeToSolve: 5
---

## 1. Problem restatement

You are given one positive integer n. Repeat this step until n becomes 1: if n is even, halve it; if n is odd, replace it with 3n + 1. Print every value n takes, starting with the original n and ending with 1, on a single line separated by spaces.

**Example 1**

- Input: `3`
- Output: `3 10 5 16 8 4 2 1`
- Why: 3 is odd, so it becomes 3·3 + 1 = 10. 10 is even and halves to 5, 5 is odd and becomes 16, and from 16 the halvings go 8, 4, 2, 1. The start value and the final 1 are both printed.

**Example 2**

- Input: `1`
- Output: `1`
- Why: n is already 1, so no step runs. The output is just the starting value.

**What the problem statement guarantees**

- The input is a single integer n with 1 ≤ n ≤ 10^6.
- The output is all values of n during the algorithm, on one line.
- Time limit: 1 second.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The steps are spelled out for you, so the exercise is not finding an idea: it is noticing what can go wrong in a program that looks correct after one glance. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 5 minutes.
2. Before writing code, run the steps by hand for n = 3 and n = 7, and watch how large the values get compared with the start.
3. Write a complete program that reads standard input and writes standard output.
4. Ask yourself: how large can a value become for some n up to a million, and does your variable type hold it? How many numbers can you be asked to print?

Open a hint only after a minute without progress.

> [!HINT] Hint 1: a small nudge
> The values do not only go down. Write out the sequence for 27 (or any odd number you like) for a few dozen steps and look at the largest value compared with the starting one.

> [!HINT] Hint 2: the kind of tool you need
> A plain loop that applies the rule is the whole algorithm. The two decisions that matter are the type of the variable (a 32-bit `int` stops a little above 2.1 billion) and how you print many numbers without paying for each print separately.

> [!HINT] Hint 3: almost the whole plan
> Read n into a `long`. Append n to a `StringBuilder`; while n is not 1, apply the rule and append a space and the new n. Print the builder once at the end. Then test n = 1, which must print just `1`.

**Check yourself before revealing the walkthrough**

- [ ] My program prints `3 10 5 16 8 4 2 1` for input `3` and `1` for input `1`
- [ ] I can say why my variable type cannot overflow for any n up to 10^6
- [ ] I print the starting value and the final 1
- [ ] I can say whether the loop is guaranteed to stop

## 3. Interview script: understand the problem (≈1 min)

On CSES the statement is the whole contract, but imagine an interviewer reading it to you. The useful questions are about the input and output format, the limits, and the one thing the statement does not say: how large the numbers get.

**Me:** Let me say it back. I read one positive integer. While it isn't 1, I halve it if it's even and replace it with 3n + 1 if it's odd. I print every value, including the first one and the final 1, on one line with spaces between them.

**Interviewer:** Yes.

**Me:** What's the range of n, and what's the time limit?

**Interviewer:** 1 ≤ n ≤ 10^6, one second.

**Me:** If n is 1 at the start, I print just `1`, with no steps?

**Interviewer:** Right.

**Me:** Does trailing whitespace matter, a space at the end or a final newline?

**Interviewer:** The checker compares the numbers, so a trailing space or newline is fine.

**Me:** Let me try 3 by hand: 3, then 10, 5, 16, 8, 4, 2, 1. So the values can climb well above the start before they come down. That makes me worry about the type. A starting value is at most a million, but 3n + 1 can be applied many times in a row with only one halving in between. I want to know the largest value before I pick `int`. I can't derive it on the spot, so I'll use `long`, which costs nothing here, and say why.

**Interviewer:** Do you know the loop ever ends?

**Me:** Honestly, nobody has proved that it ends for every n: that's the Collatz conjecture, which is open. But it has been checked by computer for every start value far beyond 10^18, so for n up to 10^6 it does end. The problem only promises that range, so that's enough.

### Given constraints

These are in the statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^6 | The start fits an `int`, but the values reached do not (see the measured facts below). n = 1 is allowed and prints only `1`. |
| Print all values on one line | The output is the whole sequence, so the work is at least its length. |
| Time limit 1 s | Generous here: the sequence is short. It still sets the habit of fast output for later CSES problems. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Trailing space or newline is accepted | I don't need special handling for the last separator; I still print `n` first and `" " + next` after, which avoids the question entirely. |
| n = 1 prints `1` | The loop condition is checked before the first step, so a `while` loop (not `do … while`) is right. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The input line may have surrounding spaces | I trim before parsing, because `Long.parseLong(" 3")` throws. (`readLine` already strips the line terminator.) |

### Measured facts (I ran every n from 1 to 10^6)

These are not in the statement; I measured them once with a 64-bit simulation, and the tests check them.

| Fact | Value | Consequence |
|---|---|---|
| Largest value reached for any n ≤ 10^6 | 56,991,483,520 (start n = 704,511) | About 26 times `Integer.MAX_VALUE` (2,147,483,647); far below `Long.MAX_VALUE` (about 9.2 × 10^18). `long` is enough. |
| Smallest n whose sequence passes 2^31 − 1 | n = 113,383 (peak 2,482,111,348) | An `int` program is wrong on this input; 432 start values up to 10^6 overflow an `int`. |
| Longest sequence for n ≤ 10^6 | 525 values (start n = 837,799) | The output is at most a few kilobytes (3,911 characters for that n, with separators). |

### Edge cases I will keep in mind

- n = 1: print `1` and do no step.
- n = 2: one halving, `2 1`.
- n = 113,383: the first input that breaks an `int`.
- n = 704,511: the largest peak; n = 837,799: the longest output.

## 4. Think out loud: from first idea to best solution

The statement gives the algorithm, so there is nothing to search for. The two approaches below compute the same sequence and differ in how the program does its output. The real lessons are the type of the variable and the I/O habit that every CSES problem needs.

### Approach 1: Simulate and print each value as you go

#### What I say out loud

> "I'll read n with a `Scanner`, print it, and then loop: apply the rule, print a space and the new value. I'll keep n in a `long`, because the values climb above the start and I don't want to bet on them fitting an `int`."

#### Intuition

The statement is already an algorithm: apply the rule until n is 1. The only work is translating it faithfully: print before the first step, check the condition before each step, and use a type that holds every intermediate value.

#### Algorithm

1. Read n as a `long`.
2. Print n.
3. While n ≠ 1: if n is even set n = n / 2, otherwise n = 3n + 1; print a space and n.
4. Print a newline.

#### Why it is correct

- **It prints exactly the values of the algorithm.** The first print is the starting value; each loop iteration performs one step of the rule and prints the result. The loop stops as soon as n is 1, after printing that 1.
- **No value is corrupted.** The largest value for any n ≤ 10^6 is 56,991,483,520. Every value, including that peak, is the result of the computation that produced it, so no intermediate result is larger, and it fits in a `long` with room to spare.
- **It stops.** For every n ≤ 10^6 the sequence reaches 1 (measured for all of them, and covered by far larger published computer checks), so the loop ends.

#### Dry run

Input `6`

| Step | n before | Even? | n after | Printed so far |
|---|---|---|---|---|
| start | — | — | 6 | `6` |
| 1 | 6 | yes | 3 | `6 3` |
| 2 | 3 | no | 10 | `6 3 10` |
| 3 | 10 | yes | 5 | `6 3 10 5` |
| 4 | 5 | no | 16 | `6 3 10 5 16` |
| 5–8 | 16 → 8 → 4 → 2 | yes | 1 | `6 3 10 5 16 8 4 2 1` |

The loop condition sees n = 1 and stops. Output: `6 3 10 5 16 8 4 2 1`.

#### Java code

```java title="Approach 1: Scanner and one print per value"
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        long n = in.nextLong();             // long: values reach about 5.7 * 10^10
        System.out.print(n);
        while (n != 1) {
            if (n % 2 == 0) {
                n /= 2;
            } else {
                n = 3 * n + 1;
            }
            System.out.print(" " + n);
        }
        System.out.println();
    }
}
```

#### Time complexity

**O(L)**, where L is the number of values in the sequence (L ≤ 525 for n ≤ 10^6, measured). Each iteration does one arithmetic step and one print. There is no known formula for L in terms of n, which is why I state the measured maximum rather than a bound like O(log n).

#### Space complexity

**O(1) auxiliary space**: one `long` and the `Scanner`'s buffer. The output is written as it is produced and not stored.

#### The bridge to the next approach

> "This passes: 525 prints is nothing. But `System.out.print` goes through a synchronized `PrintStream` and its character encoder on every call, and `Scanner` parses with regular expressions. On a CSES problem with 10^5 or 10^6 numbers in or out, that per-call overhead is what turns a correct O(n) program into a time-limit failure. So I'll write the version I'd use as my template for every CSES problem: `BufferedReader` for input, one `StringBuilder` for output, printed once."

### Approach 2: Same loop, buffered input and one output write

#### What I say out loud

> "Same loop. I read the line with `BufferedReader` and parse it, I append every value to one `StringBuilder`, and I print the builder once at the end. That's the shape I'll reuse for every CSES problem."

#### Intuition

The algorithm cannot be improved: it has to produce every value. What can be improved is the fixed cost per value. Building the whole line in memory and handing it to the output stream once replaces L small writes with one large one.

#### Algorithm

1. Read the line, trim it, parse n as a `long`.
2. Append n to a `StringBuilder`.
3. While n ≠ 1: apply the rule, append `' '` and n.
4. Print the builder once.

#### Why it is correct

The loop is the same as in Approach 1, so the same values are produced in the same order; they are collected in the builder instead of printed one at a time. Printing the builder once writes exactly that text. The type argument is unchanged: every value fits in a `long`.

#### Dry run

Input `3`

| Step | n before | Rule | n after | Builder |
|---|---|---|---|---|
| start | — | — | 3 | `3` |
| 1 | 3 | odd: 3·3 + 1 | 10 | `3 10` |
| 2 | 10 | even: 10 / 2 | 5 | `3 10 5` |
| 3 | 5 | odd: 3·5 + 1 | 16 | `3 10 5 16` |
| 4–7 | 16 → 8 → 4 → 2 | even | 1 | `3 10 5 16 8 4 2 1` |

One print: `3 10 5 16 8 4 2 1`, matching the statement's example.

#### Java code

```java title="Approach 2: BufferedReader and one StringBuilder (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        long n = Long.parseLong(in.readLine().trim());
        StringBuilder out = new StringBuilder();
        out.append(n);
        while (n != 1) {
            n = (n % 2 == 0) ? n / 2 : 3 * n + 1;
            out.append(' ').append(n);
        }
        System.out.println(out);            // one write for the whole line
    }
}
```

#### Time complexity

**O(L)** with L ≤ 525, as before. Appending to a `StringBuilder` is amortized O(1) per character: the builder occasionally copies into a larger buffer, and the total copying stays proportional to the final length (that is how the JDK grows it, not a documented guarantee, but it holds in practice).

#### Space complexity

**O(L) auxiliary space** for the builder: at most 3,911 characters here. That memory is the price of a single write, and it is negligible.

### Alternative: `int` with an overflow check

Keeping an `int` and calling `Math.multiplyExact(3, n)` would throw on overflow instead of silently wrapping. That detects the problem but does not solve it: the answer for n = 113,383 genuinely contains 2,482,111,348, so you need `long` anyway. The only case for it is a language or setting where 64-bit arithmetic is not available.

## 5. Comparison table

L = number of values in the sequence (at most 525 for n ≤ 10^6).

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. `Scanner` + one print per value | O(L) | O(L) | O(1) |
| 2. `BufferedReader` + one `StringBuilder` | O(L) | O(L) | O(L) for the output text |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Print per value | Shortest to type; no buffer | Per-call output and parsing overhead; too slow once outputs reach 10^5–10^6 values | Tiny outputs like this one, if you are in a hurry |
| 2. One buffered write | The I/O template that scales to every CSES problem | A few more lines | Always on CSES; build the habit here |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2, with `long`, and the one-sentence reason for each: "values reach about 5.7 × 10^10, so `long`; one buffered write because per-value printing is the bottleneck on larger CSES outputs."

**Is it optimal?** Yes: the output has L numbers and each must be computed and written, so any program does Ω(L) work, and this one does O(L).

**When to stop:** once the type and the I/O are right. There is nothing to precompute or cache for a single n.

## 7. Interview script: code it and test it

### What I say while coding

> "`long n`, not `int`. I measured the peak at 56,991,483,520 for n = 704,511; the first n that breaks an `int` is 113,383."

> "I append n before the loop, so the start value is in the output, and I test `n != 1` before each step, so n = 1 prints just `1`."

> "Even test with `n % 2 == 0`. n is always positive here, so `%` is safe; with negatives I'd write `(n & 1) == 0`."

> "One `println` at the end."

### Testing out loud

**Normal case:** `3`. Builder starts `3`; 3 is odd → 10; 10 → 5; 5 → 16; 16 → 8 → 4 → 2 → 1. Output `3 10 5 16 8 4 2 1`. Matches.

**Smallest input:** `1`. Builder is `1`; the loop condition is false at once. Output `1`.

**One step:** `2`. Builder `2`; 2 is even → 1; append. Output `2 1`.

**Overflow boundary:** `113383`. Step 120 computes 3 · 827,370,449 + 1 = 2,482,111,348. In a `long` that is just a number; the sequence continues down and reaches 1 after 248 values in total. (With an `int` this is exactly where it breaks; see section 11.)

**Largest output:** `837799` produces 525 values, about 3.9 KB of text. The tests run this and n = 704,511 well inside the limit.

## 8. Time plan for the interview

This is a warm-up; aim for five minutes.

| Phase | Time | What to get done |
|---|---|---|
| Clarify | about 1 min | Format, n = 1, limits; raise the overflow question and the termination question |
| Code | 2 min | Approach 2 with `long` |
| Test and complexity | 1–2 min | `3`, `1`, `2`; O(L), L ≤ 525 |

The time should go into the two sentences that show judgement: why `long`, and why buffered output. If you are unsure whether `int` is enough, do not guess: say "I can't bound the peak in my head, `long` costs nothing, so I'll use it."

## 9. Interviewer challenges

### About the numbers

#### Why `long`? Wouldn't `int` do for n up to a million?

**What they are testing:** whether you check intermediate values, not only inputs, against the type's range.

**How to reason:** the input bound says nothing about the values reached. One odd step triples the value; several odd steps with single halvings between them grow it by about 1.5 each round.

**What I say:** "No. The peak for n ≤ 10^6 is 56,991,483,520, reached from 704,511, which is 26 times the `int` limit. The first input that overflows is 113,383. With `int`, 3n + 1 wraps to a negative number, and from there the program either prints garbage or never stops."

**Nuance:** in an interview without a computer you will not know the exact peak. "I can't bound it, and `long` is free" is a perfectly good answer; what is not acceptable is assuming the start bound covers the intermediates.

#### Are you sure the loop terminates?

**What they are testing:** honesty about what is known, and whether you can tie it to the given limits.

**How to reason:** separate the general claim (unproven) from the claim for this input range (checked).

**What I say:** "For all positive integers, it's the Collatz conjecture, which is unproven. For the inputs this problem allows it's fine: every start value up to 10^6 reaches 1, which is easy to check by running it, and published computer checks go far beyond 10^18."

**Nuance:** if the interviewer pushes ("what if it doesn't terminate?"), a defensive program could cap the number of steps and report failure, but for these limits that cap would never trigger.

### About performance

#### Why not just `System.out.print` each number? It passed.

**What they are testing:** whether you know where Java's I/O cost comes from and when it matters.

**How to reason:** count the calls. Here there are at most 525, which is nothing. The question is what happens with a million.

**What I say:** "Here it doesn't matter. In general, every `System.out.print` call goes through a synchronized stream and the character encoder, and when output is flushed often that also means a system call. With 10^6 numbers that overhead dominates the actual algorithm. One `StringBuilder` written once has almost none of it, so I use it everywhere on CSES."

**Nuance:** a `PrintWriter` wrapped around a `BufferedWriter`, flushed once at the end, is equally good and avoids holding the whole output in memory, which matters when the output is hundreds of megabytes (not here).

## 10. Follow-up questions the interviewer might ask

**"Print only the number of steps, for every n from 1 to 10^6."**
Memoize: compute steps(n) by following the sequence until it drops below the current start (whose answer is already known), then fill the answers back. Total work is far less than the sum of all lengths. O(N) memory for N = 10^6 starts, and still `long` for the values.

**"Which n ≤ 10^6 has the longest sequence?"**
The same memoized pass, keeping the maximum: it is 837,799, with 525 values (524 steps). This is the well-known Project Euler 14 answer.

**"What if n could be up to 10^18?"**
Then 3n + 1 overflows even a `long` (its limit is about 9.2 × 10^18). Use `Math.multiplyExact` to detect overflow, or `BigInteger`. The sequence length is still small in practice, but no proven bound exists.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Sizing the type from the input bound.** n ≤ 10^6 fits an `int`; the values it produces do not.
- **Claiming the loop provably terminates.** It is an open conjecture in general. Say "checked for this range".
- **Calling the complexity O(log n).** The sequence does not halve steadily; there is no proven bound. Give the measured maximum (525) instead.

### Implementation mistakes

> [!MISTAKE] Using `int` for n
> With `int n`, input `113383` reaches 827,370,449 at step 119, and 3 · 827,370,449 + 1 wraps to −1,812,855,948. From there the negative values fall into the cycle −17 → −50 → −25 → … → −34 → −17 and never reach 1, so the program runs until the time limit. Input `704511` is worse in a quieter way: after 878,506,235 it prints −1,659,448,590 instead of 2,635,518,706, the values wander back to positive, and it happens to reach 1 after 212 values instead of the correct 243. Both were run once to confirm.

- **Forgetting the starting value or the final 1.** Append n before the loop and append after each step.
- **`do … while` instead of `while`.** For n = 1 a `do … while` applies one step first and prints `1 4 2 1`.
- **Printing value by value with `System.out.println`.** Correct here, but puts each value on its own line (the statement asks for one line) and carries per-call overhead that will not survive larger CSES problems.

## 12. Pattern recognition

**The pattern:** direct simulation. The statement gives the procedure; the job is a faithful translation plus the two non-algorithmic checks: the range of every intermediate value and the cost of the I/O.

**Signals in the problem statement:**

- "Repeat until …" with an explicit rule.
- The output is the full history of a process.
- Small input bounds, but operations (multiplication) that can grow values.

**Related problems in this list:**

- [[cses-repetitions|Repetitions]]: the next CSES warm-up, a one-pass scan over a 10^6-character string where reading input fast matters.
- [[cses-increasing-array|Increasing Array]]: the same overflow lesson, this time in a running total that needs `long`.
- [[cses-missing-number|Missing Number]]: another single-loop CSES warm-up where the sum's type matters.
- [[nc-happy-number|Happy Number]]: repeatedly apply a rule to a number; there, the cycle question is the whole problem.

**Takeaway:** for every simulation, ask two questions before coding: how large can any intermediate value get, and how many numbers will I read and print?

## 13. 60-second revision card

**Key insight:** follow the rule literally, but hold n in a `long`: values reach 56,991,483,520 for n ≤ 10^6 (from 704,511), and `int` first breaks at n = 113,383.

**Invariant:** the builder holds every value from the start through the current n.

**Complexity:** O(L) time with L ≤ 525 values; O(L) characters of output buffer.

**Code skeleton:**

```java title="Weird Algorithm in a dozen lines"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws IOException {
        long n = Long.parseLong(new BufferedReader(new InputStreamReader(System.in)).readLine().trim());
        StringBuilder out = new StringBuilder().append(n);
        while (n != 1) {
            n = (n % 2 == 0) ? n / 2 : 3 * n + 1;
            out.append(' ').append(n);
        }
        System.out.println(out);
    }
}
```

**Main traps:**

- `int` overflows at n = 113,383.
- Print the start and the final 1; n = 1 prints `1`.
- One buffered write, not a print per value.

**What to say in one breath:** "I simulate the rule in a `long`, because intermediate values reach about 5.7 × 10^10 for n up to a million, append each value to one `StringBuilder` and print it once. It's O(L) for a sequence of L values, at most 525 here. Termination is the open Collatz conjecture in general, but it is checked far beyond this range."
