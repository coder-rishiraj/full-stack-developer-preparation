---
problemId: cses-trailing-zeros
title: Trailing Zeros
source: cses
sourceUrl: https://cses.fi/problemset/task/1618
difficulty: easy
patterns: [introductory, mathematics]
relatedLessons: [a1-java-syntax-competitive, a1-time-complexity, a14-edge-cases]
companies: []
timeToSolve: 10
---

## 1. Problem restatement

Given n, print how many zeros the decimal number n! = 1 · 2 · 3 · … · n ends with.

**Example**

- Input: `20`
- Output: `4`
- Why: 20! = 2,432,902,008,176,640,000, which ends in four zeros.

**A second example**

- Input: `4`
- Output: `0`
- Why: 4! = 24 has no trailing zero.

**What the problem statement guarantees**

- The input is one integer n with 1 ≤ n ≤ 10^9.
- The output is the number of trailing zeros of n!.
- Time limit: 1 second.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. n! for n = 10^9 has billions of digits, so the exercise is answering a question about a number you can never compute. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 10 minutes.
2. Write down 5!, 10!, 15! and 25! (or look at how many zeros they end with) and ask what makes a zero appear.
3. Write a complete program that reads standard input and writes standard output.
4. Before submitting, check n = 25 and n = 125 by hand, and ask: what is the largest value any of my variables reaches when n = 10^9?

Open a hint only after a couple of minutes without progress.

> [!HINT] Hint 1: a small nudge
> A trailing zero is a factor of 10, and 10 = 2 · 5. Which of the two prime factors is in shorter supply among the numbers 1 to n?

> [!HINT] Hint 2: the kind of tool you need
> You need the exponent of 5 in the prime factorization of n!. Do not look at each number separately: count how many numbers up to n are multiples of 5, how many are multiples of 25 (they contribute a second 5), of 125, and so on.

> [!HINT] Hint 3: almost the whole plan
> The answer is ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + … until the power exceeds n. Either keep a power p = 5, 25, 125, … in a `long`, or repeatedly replace n by n / 5 and add it to the answer, which never multiplies anything.

**Check yourself before revealing the walkthrough**

- [ ] My program prints 4 for n = 20, 6 for n = 25 and 249999998 for n = 10^9
- [ ] I can explain why the number of 2s never limits the answer
- [ ] I can explain why 25 counts twice and 125 three times
- [ ] I can name the largest value my loop variable takes and why it does not overflow

## 3. Interview script: understand the problem (≈1–2 min)

**Me:** So I need the number of trailing zeros of n!, for n up to a billion. I can't compute n!: it has billions of digits, and even a `long` overflows at 21!. So the answer has to come from the structure of the product.

**Interviewer:** Go on.

**Me:** A trailing zero means the number is divisible by 10. The number of trailing zeros is the largest z such that 10^z divides n!. Since 10 = 2 · 5, that's the smaller of how many 2s and how many 5s are in the prime factorization of n!. Let me check: 20! has 4 zeros, and the multiples of 5 up to 20 are 5, 10, 15, 20, each with one 5. That's 4.

**Interviewer:** What about the 2s?

**Me:** Every other number is even, but only every fifth is a multiple of 5, so I expect 2s to be more plentiful. I'll prove that properly before relying on it. Time limit and format?

**Interviewer:** One second, one number in and one out.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^9 | n! cannot be computed; the answer must come from counting prime factors. A loop over all numbers up to n is 10^9 steps, right at the edge of 1 s in Java, so I want something better. |
| Time limit 1 s | A logarithmic loop (13 iterations at most) is effortless. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| One number in, one number out | Fast I/O is not an issue; `BufferedReader` plus one `println`. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The input line may have surrounding spaces | I trim before parsing. |

### Numbers I computed once (the tests check them)

| Value | Number | Consequence |
|---|---|---|
| Answer for n = 10^9 | 249,999,998 | Below n / 4, fits an `int` easily. |
| Largest power of 5 that is at most 10^9 | 5^12 = 244,140,625 | The loop adds at most 12 terms. |
| First power of 5 above 10^9 | 5^13 = 1,220,703,125 | The loop variable reaches this before stopping. It is below `Integer.MAX_VALUE` (2,147,483,647), so even an `int` survives for n ≤ 10^9, but only just. |
| The next power | 5^14 = 6,103,515,625 | Overflows an `int`. An `int` loop variable breaks as soon as n ≥ 5^13. |

### Edge cases I will keep in mind

- n = 1 to 4: no factor 5 at all, the answer 0.
- n = 5: the first zero.
- n = 24 and n = 25: 4, then 6, because 25 = 5 · 5 adds two.
- n = 124 and n = 125: 28, then 31.
- n = 10^9: the largest input; the loop variable reaches 5^13.

## 4. Think out loud: from first idea to best solution

The derivation goes from "compute n!" (impossible), to "count the 5s in every number" (correct but slow), to Legendre's formula, which counts the 5s by multiples in a dozen steps. The two numbered approaches are the two ways to write that formula: with a growing power of 5, where the loop variable's type matters, and by dividing n, where nothing can overflow.

### Alternative: count the factors of 5 in every number

Loop i from 1 to n, and for each i divide by 5 while it is divisible, adding one per division. It is correct (the exponent of 5 in a product is the sum of the exponents in the factors) and it needs no insight beyond the 2-versus-5 argument. But it is about n = 10^9 iterations. I measured it once: about 1.0 s at n = 10^9 on my machine (JDK 26), at the time limit. Stepping i by 5 (only multiples of 5 contribute) cut that to about 0.4 s, which would probably pass, but it is still O(n) and the next idea makes it O(log n). Computing n! itself is worse: a `long` holds n! only up to 20!; at n = 21 the wrapped value ends in no zero at all, so such a program prints 0 instead of 4 (run once).

### Approach 1: Legendre's formula with a growing power of 5

#### What I say out loud

> "Instead of asking each number how many 5s it has, I ask each level how many numbers reach it. Every multiple of 5 contributes at least one 5: that's ⌊n/5⌋. Every multiple of 25 contributes a second one: ⌊n/25⌋ more. Multiples of 125 a third, and so on. I sum ⌊n/5^i⌋ until 5^i exceeds n."

#### Intuition

Write each number's count of 5s as a stack of marks: 25 has two marks, 125 three. Counting marks number by number is slow; counting them level by level is fast. Level 1 has a mark for every multiple of 5, level 2 for every multiple of 25, and so on. Each level's count is a single division.

#### Algorithm

1. zeros = 0, p = 5 (a `long`).
2. While p ≤ n: zeros += n / p; p = p · 5.
3. Print zeros.

#### Why it is correct

- **Zeros equal the exponent of 5.** The number of trailing zeros is the largest z with 10^z dividing n!, which is min(v₂, v₅), where v₂ and v₅ are the exponents of 2 and 5 in n!.
- **The 2s never run out first.** By the same level-by-level count, v₂ = Σ ⌊n/2^i⌋ and v₅ = Σ ⌊n/5^i⌋. For every i, 2^i ≤ 5^i, so ⌊n/2^i⌋ ≥ ⌊n/5^i⌋: each term of v₂ is at least the matching term of v₅, and v₂ has extra nonnegative terms besides. So v₂ ≥ v₅ and the answer is v₅. (For n = 10^9, v₂ = 999,999,987 against v₅ = 249,999,998; the tests also check v₂ ≥ v₅ for every n up to 20,000.)
- **Legendre's formula counts v₅ exactly.** A number m ≤ n with exactly j factors of 5 is a multiple of 5, 25, …, 5^j and of no higher power, so it is counted in exactly j of the terms ⌊n/5^i⌋. Summing over the levels counts every factor once.
- **The loop stops at the right point and does not overflow.** Terms with 5^i > n are 0, so stopping there loses nothing. The largest p the loop computes is the first power above n, at most 5^13 = 1,220,703,125 for n ≤ 10^9, far inside a `long`.

#### Dry run

Input `130`

| p | p ≤ n? | n / p | zeros after |
|---|---|---|---|
| 5 | yes | 26 | 26 |
| 25 | yes | 5 | 31 |
| 125 | yes | 1 | 32 |
| 625 | no | — | stop |

Output `32`: 26 multiples of 5, of which 5 (25, 50, 75, 100, 125) are multiples of 25, of which 1 (125) is a multiple of 125.

#### Java code

```java title="Approach 1: sum n / 5^i with a long power"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        long n = Long.parseLong(in.readLine().trim());
        long zeros = 0;
        for (long p = 5; p <= n; p *= 5) {       // p = 5, 25, 125, ...; long so p * 5 cannot wrap
            zeros += n / p;                      // multiples of p each give one more factor 5
        }
        System.out.println(zeros);
    }
}
```

#### Time complexity

**O(log₅ n)** iterations: one per power of 5 up to n, at most 12 for n ≤ 10^9.

#### Space complexity

**O(1) auxiliary space.**

#### The bridge to the next approach

> "The only thing I had to argue carefully was the type of p: it reaches 5^13, which fits an `int` with not much room. If the limit grew to 2^31 − 1, an `int` p would wrap. I can avoid the question entirely: ⌊n/25⌋ = ⌊⌊n/5⌋/5⌋, so instead of multiplying p up, I divide n down. Nothing ever gets bigger than n."

### Approach 2: Divide n by 5 repeatedly

#### What I say out loud

> "Same sum, computed from the other end. n / 5 is the first term. Dividing that by 5 again gives n / 25, the second term, because floor division composes. So I keep dividing n by 5 and adding the result until it hits zero. No multiplication, so no overflow, for any n that fits the type."

#### Intuition

The terms ⌊n/5⌋, ⌊n/25⌋, ⌊n/125⌋, … are each the previous one divided by 5 (rounded down). So one variable that is divided by 5 each round walks through all the terms.

#### Algorithm

1. zeros = 0.
2. While n ≥ 5: n = n / 5; zeros += n.
3. Print zeros.

#### Why it is correct

The value of n after i divisions is ⌊⌊⌊n/5⌋/5⌋…/5⌋ (i times) = ⌊n/5^i⌋, because for positive integers ⌊⌊a/b⌋/c⌋ = ⌊a/(bc)⌋. So the loop adds exactly the terms of Legendre's formula, and stops when the next term would be 0 (n < 5 means ⌊n/5⌋ = 0). Correctness then follows from Approach 1's argument. The variable only decreases, so it never exceeds the input, and the sum is at most about n/4 < 2.5 × 10^8, so `int` is enough for both.

**The 25-second version:** "Zeros come from pairs of 2 and 5, and 2s are always at least as many, since ⌊n/2^i⌋ ≥ ⌊n/5^i⌋ term by term. So I count 5s: every multiple of 5 gives one, multiples of 25 another, and so on. That's ⌊n/5⌋ + ⌊n/25⌋ + …, which I get by dividing n by 5 repeatedly and summing. At most 12 rounds for n ≤ 10^9, and nothing can overflow because the value only shrinks."

#### Dry run

Input `100`

| Round | n before | n / 5 | zeros after |
|---|---|---|---|
| 1 | 100 | 20 | 20 |
| 2 | 20 | 4 | 24 |
| end | 4 | — | 4 < 5, stop |

Output `24`, which matches the 24 trailing zeros of 100! (the tests count them on the actual BigInteger value).

#### Java code

```java title="Approach 2: divide n by 5 and accumulate (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int zeros = 0;
        while (n >= 5) {
            n /= 5;                              // now n = floor(original / 5^i)
            zeros += n;
        }
        System.out.println(zeros);
    }
}
```

#### Time complexity

**O(log₅ n)**: at most 12 rounds for n ≤ 10^9.

#### Space complexity

**O(1) auxiliary space.**

## 5. Comparison table

n = the input (at most 10^9).

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Alternative: count 5s in each number | O(n) | O(n) | O(1) |
| 1. Σ n / 5^i with a growing power | O(log n) | O(log n) | O(1) |
| 2. Divide n by 5 repeatedly | O(log n) | O(log n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Count per number | Needs only the 2-versus-5 argument; good brute force for tests | About 10^9 steps at the limit | Testing, or tiny n |
| 1. Growing power | Reads exactly like the formula | The power must be 64-bit (or argued to fit) | When explaining the formula |
| 2. Dividing n | No overflow possible; shortest code | One more step to see why it equals the formula | The code to submit |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** explain with Approach 1's formula, then code Approach 2 and say in one sentence why it computes the same sum. Both are O(log n).

**Is it optimal?** For a single n, O(log n) arithmetic is as good as it needs to be: the answer has about log₁₀ n digits, and the loop runs at most 12 times.

**When to stop:** once the 2-versus-5 argument and the overflow argument are stated. There is nothing left to speed up.

## 7. Interview script: code it and test it

### What I say while coding

> "I count factors of 5, because 2s are at least as frequent: each term ⌊n/2^i⌋ is at least ⌊n/5^i⌋."

> "Divide-and-add loop. The variable only shrinks, so `int` is fine for n ≤ 10^9 and for the answer, which is below n / 4."

> "If I had written the power version, p would reach 5^13 = 1,220,703,125 before the loop stops. That fits an `int`, but only by a factor of about 1.8, so I'd make it `long`."

### Testing out loud

**Normal case:** n = 20. 20 / 5 = 4, then 4 < 5 stops. Output 4, matching the example.

**No fives:** n = 4. The loop does not run: 0.

**First double five:** n = 25. 25 / 5 = 5 (zeros 5), 5 / 5 = 1 (zeros 6), stop. Output 6: the multiples 5, 10, 15, 20 give one each and 25 gives two.

**Triple five:** n = 125. 25 + 5 + 1 = 31, while n = 124 gives 24 + 4 = 28.

**Largest input:** n = 10^9. 200,000,000 + 40,000,000 + 8,000,000 + 1,600,000 + 320,000 + 64,000 + 12,800 + 2,560 + 512 + 102 + 20 + 4 = 249,999,998, after 12 rounds.

**What the tests cover:** both programs pass all 12 official CSES tests imported for this site (n from 1 to 850,915,850), the actual trailing zeros of n! for every n up to 300 (computed with `BigInteger`), every n up to 20,000 against a running count of 5s, the power-of-5 boundaries above, and 2,000 random n up to 10^9 against the independent formula (n − s₅(n)) / 4, where s₅ is the sum of n's base-5 digits.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1 min | n! is impossible to compute; zeros = factors of 10 |
| Derive | 3–4 min | 2s versus 5s, then the level-by-level count |
| Code | 1–2 min | Approach 2 |
| Test | 2 min | 20, 4, 25, 125, 10^9 |

The time should go into the two arguments: why 5s alone decide the answer, and why multiples of 25 count twice. If you are stuck, write out the factors of 5 for 1 to 30 and count them by hand; the pattern of 25 is the moment it clicks.

## 9. Interviewer challenges

### About the reasoning

#### Prove that 2s never limit the answer.

**What they are testing:** whether you can turn "2s are more common" into an argument.

**How to reason:** compare the two Legendre sums term by term.

**What I say:** "The exponent of 2 in n! is Σ ⌊n/2^i⌋ and of 5 is Σ ⌊n/5^i⌋. Since 2^i ≤ 5^i, each term ⌊n/2^i⌋ is at least ⌊n/5^i⌋, and the 2-sum has more nonzero terms on top. So there are at least as many 2s as 5s, and each 5 can pair with its own 2."

**Nuance:** "every other number is even" is the intuition but not a proof on its own, since a number can carry several 5s; the term-by-term comparison handles that.

#### Why does 25 count twice? Isn't that double counting?

**What they are testing:** understanding of the formula, not just recall.

**How to reason:** look at what each term counts.

**What I say:** "25 = 5 · 5 really contributes two factors of 5 to the product. The first term counts the first 5 of every multiple of 5, including 25; the second term counts the second 5 of every multiple of 25. Each factor is counted once, on its own level."

**Nuance:** this is the general Legendre formula, v_p(n!) = Σ ⌊n/p^i⌋ for any prime p.

### About the implementation

#### What is the largest value your loop variable takes?

**What they are testing:** overflow reasoning for a loop that multiplies.

**How to reason:** the loop stops at the first power of 5 greater than n.

**What I say:** "In the power version, p reaches 5^13 = 1,220,703,125 for n = 10^9, the first power above n. That is below 2^31 − 1, so even `int` works for these limits, but if n could reach 5^13 the next multiplication would give 5^14 ≈ 6.1 × 10^9 and wrap. With n = 2^31 − 1 an `int` loop `p <= n` would never end, because every `int` is at most 2^31 − 1. So I use `long` for p, or the dividing version, which never multiplies."

**Nuance:** the dividing version's only requirement is that n itself fits the type.

## 10. Follow-up questions the interviewer might ask

**"Trailing zeros of n! in base b instead of 10."**
Factor b into primes b = ∏ p^e. For each prime, compute v_p(n!) by Legendre's formula; the answer is the minimum over primes of ⌊v_p(n!) / e⌋. O(√b + (number of primes of b) · log n).

**"Smallest n whose factorial has at least k trailing zeros."**
The count is non-decreasing in n, so binary search n in [0, 5k] using the formula as the test. O(log k · log k).

**"Last nonzero digit of n!."**
Much harder: remove the paired 2s and 5s and track the remaining product modulo 10, using a recursive formula on n / 5 to stay O(log n).

**"Number of trailing zeros of n! for q queries."**
Each query is O(log n) on its own; no precomputation is needed.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Counting only multiples of 5.** ⌊n/5⌋ alone gives 5 for n = 25 instead of 6, and misses every extra 5 from 25, 125, … (for n = 10^9 it gives 200,000,000 instead of 249,999,998).
- **Counting 10s.** Numbers like 10 and 20 are not the only source; 5 · 2 and 25 · 4 make zeros too.
- **Counting the 2s, or min(2s, 5s) by brute force.** Correct but unnecessary once the term-by-term argument shows the 5s are the minimum.

### Implementation mistakes

> [!MISTAKE] Computing the factorial
> `long f = 1; for (int i = 1; i <= n; i++) f *= i;` and then counting zeros works up to n = 20. At n = 21 the product wraps to −4,249,290,049,419,214,848, which ends in 8, so the program prints 0 instead of 4 (run once). `BigInteger` gets it right but builds a number with billions of digits for n = 10^9.

- **An `int` power that can wrap.** Fine for n ≤ 10^9 as argued, but `for (int p = 5; p <= n; p *= 5)` with n = 2^31 − 1 never terminates, because `p <= n` is always true for an `int` (seen once with an iteration cap: p wraps through negative values). Make p a `long`, or divide n instead.
- **Stopping the loop one level early.** `while (p < n)` misses the term for n itself when n is a power of 5: n = 25 gives 5 instead of 6.

## 12. Pattern recognition

**The pattern:** counting a prime's exponent in a factorial (Legendre's formula), and more generally: when the object is too large to build, count its properties from the structure that produces it.

**Signals in the problem statement:**

- A question about a factorial or a huge product, with n up to 10^9.
- "Trailing zeros", "divisible by", "largest power of p dividing …".
- An answer that should be computed in a handful of steps.

**Related problems in this list:**

- [[cses-bit-strings|Bit Strings]]: also a count whose underlying number is astronomically large; there it is reduced modulo a prime instead of analysed.
- [[cses-number-spiral|Number Spiral]]: a closed form from a counting argument, with the same care for the range of intermediates.
- [[cses-counting-divisors|Counting Divisors]]: prime factorizations again, where the count of divisors comes from the exponents.
- [[cses-two-knights|Two Knights]]: a formula derived by counting, checked against a brute force on small inputs.

**Takeaway:** trailing zeros are the exponent of 10, which is the smaller of the exponents of 2 and 5; for a factorial that is always the 5s, counted as ⌊n/5⌋ + ⌊n/25⌋ + ….

## 13. 60-second revision card

**Key insight:** zeros = min(#2s, #5s) in n! = #5s = Σ ⌊n/5^i⌋, because ⌊n/2^i⌋ ≥ ⌊n/5^i⌋ term by term.

**Invariant:** after i rounds of dividing by 5, n holds ⌊n₀/5^i⌋ and zeros holds the first i terms.

**Complexity:** O(log₅ n), at most 12 rounds for n ≤ 10^9; O(1) space.

**Code skeleton:**

```java title="Trailing Zeros in a few lines"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws IOException {
        int n = Integer.parseInt(new BufferedReader(new InputStreamReader(System.in)).readLine().trim());
        int zeros = 0;
        while (n >= 5) zeros += (n /= 5);
        System.out.println(zeros);
    }
}
```

**Main traps:**

- Multiples of 25, 125, … contribute extra 5s: n = 25 gives 6.
- Never build n! (`long` fails at n = 21).
- A multiplying power reaches 5^13 = 1,220,703,125: use `long` or divide n instead.

**What to say in one breath:** "A trailing zero is a 2 times a 5, and a factorial always has at least as many 2s as 5s, since ⌊n/2^i⌋ ≥ ⌊n/5^i⌋. So I count 5s with Legendre's formula, ⌊n/5⌋ + ⌊n/25⌋ + …, computed by dividing n by 5 until it is zero. At most 12 rounds, and dividing means nothing can overflow."
