---
problemId: cses-bit-strings
title: Bit Strings
source: cses
sourceUrl: https://cses.fi/problemset/task/1617
difficulty: easy
patterns: [introductory, mathematics]
relatedLessons: [a13-powers-of-two, a1-java-syntax-competitive, a14-edge-cases]
companies: []
timeToSolve: 8
---

## 1. Problem restatement

Count the strings of length n made only of the characters 0 and 1. The count is very large, so print it modulo 10^9 + 7 (the remainder after dividing by 1,000,000,007).

**Example**

- Input: `3`
- Output: `8`
- Why: the strings of length 3 are 000, 001, 010, 011, 100, 101, 110 and 111. There are 8, which is less than the modulus, so it is printed as it is.

**A second example**

- Input: `1`
- Output: `2`
- Why: the strings are `0` and `1`.

**What the problem statement guarantees**

- The input is one integer n with 1 ≤ n ≤ 10^6.
- The output is the count modulo 10^9 + 7.
- Time limit: 1 second.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The counting is short; the exercise is computing a number with hundreds of thousands of digits without ever holding it, and knowing exactly where a Java program would silently overflow. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 8 minutes.
2. Count the strings for n = 1, 2, 3, 4 by hand and look for the rule.
3. Write a complete program that reads standard input and writes standard output.
4. Before submitting, try n = 63, n = 64 and n = 10^6, and ask for each intermediate value in your code: what is the largest it can get?

Open a hint only after a couple of minutes without progress.

> [!HINT] Hint 1: a small nudge
> How do the strings of length n relate to the strings of length n − 1? Every string of length n is a string of length n − 1 with one more character on the end.

> [!HINT] Hint 2: the kind of tool you need
> The count doubles with each character, so the answer is a power of two that is far too large for any primitive type. Remainders survive multiplication: you may reduce modulo 10^9 + 7 after every step instead of only at the end.

> [!HINT] Hint 3: almost the whole plan
> Start with 1 and, n times, replace it with (value · 2) mod 1,000,000,007. The value stays below the modulus throughout, so `long` (or even `int`, for doubling) is safe. Print the value.

**Check yourself before revealing the walkthrough**

- [ ] My program prints 8 for n = 3 and 2 for n = 1
- [ ] I can say why reducing after every step gives the same answer as reducing once at the end
- [ ] My program prints 582344008 for n = 64 (a version that reduces only at the end prints 0)
- [ ] I can name the largest intermediate value my code computes

## 3. Interview script: understand the problem (≈1 min)

**Me:** So I count binary strings of length n. Each position independently holds a 0 or a 1, so I expect 2 · 2 · … · 2 = 2^n. For n = 3 that is 8, matching the example. Let me check n = 2: 00, 01, 10, 11, four. Good.

**Interviewer:** Right.

**Me:** n goes up to a million, so 2^n has about 300,000 decimal digits. That is why the answer is asked modulo 10^9 + 7. What is the time limit?

**Interviewer:** One second.

**Me:** And the output is just the one number, with a newline?

**Interviewer:** Yes.

**Me:** Then the real question is how to get 2^n mod 10^9 + 7 without computing 2^n. I'll reduce as I go, and I need to be careful about which intermediate products can overflow.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^6 | 2^n cannot be stored, so reduce modulo m at every step. A loop of n steps is about 10^6 operations, fine for 1 s. |
| Output modulo m = 10^9 + 7 | Every stored value is below m ≈ 2^29.9. A product of two such values is below m² ≈ 10^18, which fits a `long` but not an `int`. |
| Time limit 1 s | Either O(n) or O(log n) is far inside it. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| One number on one line | No output buffering needed; a single `println`. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The input line may have surrounding spaces | I trim before parsing. |

### Overflow facts I computed once (the tests check them)

| Value | Number | Fits `int` (max 2,147,483,647)? | Fits `long` (max ≈ 9.22 × 10^18)? |
|---|---|---|---|
| Largest stored value | m − 1 = 1,000,000,006 | yes | yes |
| Largest doubling, 2 · (m − 1) | 2,000,000,012 | yes, by about 147 million | yes |
| Largest product of two stored values, (m − 1)² | 1,000,000,012,000,000,036 | no | yes, with about 9× headroom |
| 2^n without any reduction | breaks `int` at n = 31, `long` at n = 63 | — | — |

### Edge cases I will keep in mind

- n = 1: the answer 2.
- n = 29 and n = 30: the last power below m (536,870,912) and the first that is reduced (2^30 − m = 73,741,817).
- n = 63 and n = 64: where an unreduced `long` wraps to a negative number and then to 0.
- n = 10^6: the largest input (the answer is 235,042,059).

## 4. Think out loud: from first idea to best solution

The count itself takes one sentence. The two approaches differ in how they compute 2^n mod m: n doublings, or the general fast-exponentiation method that every later modular problem needs. The tempting shortcuts (`Math.pow`, a shift, reducing only at the end) all fail, and they are in section 11 with their actual outputs.

### Approach 1: Double n times, reducing every time

#### What I say out loud

> "Strings of length i come from strings of length i − 1 by appending 0 or 1, so the count doubles. I start from 1, the empty string, and double n times. To keep the number small, I take it modulo m after every doubling. That is allowed because the remainder of a product depends only on the remainders of the factors."

#### Intuition

Let c(i) be the number of strings of length i. Each string of length i is obtained in exactly one way from a string of length i − 1 (drop the last character to see which), and each string of length i − 1 extends in two ways. So c(i) = 2 · c(i − 1), and c(0) = 1. We only ever need c(i) mod m, and the rule for that is (2 · c) mod m = (2 · (c mod m)) mod m.

#### Algorithm

1. Read n.
2. count = 1.
3. Repeat n times: count = count · 2 mod m.
4. Print count.

#### Why it is correct

- **The count is 2^n.** By the doubling argument, c(n) = 2^n: every string is produced once (no duplicates, because different strings differ in some position) and no string is missed (every string of length n arises from its prefix).
- **Reducing at every step is exact.** For any integers a and b, (a · b) mod m = ((a mod m) · b) mod m, because a = qm + r gives a · b = qbm + r · b, and qbm is a multiple of m. So after step i the variable holds exactly 2^i mod m. The invariant is "count = 2^i mod m after i steps", true for i = 0 and preserved by each step.
- **No step overflows.** count < m before each step, so count · 2 < 2m = 2,000,000,014, which fits even an `int`. I use `long` anyway, so the bound does not need to be re-checked if the step ever becomes a multiplication by something larger.

#### Dry run

Input `5`

| Step i | count before | count · 2 | mod m | count after |
|---|---|---|---|---|
| 1 | 1 | 2 | 2 | 2 |
| 2 | 2 | 4 | 4 | 4 |
| 3 | 4 | 8 | 8 | 8 |
| 4 | 8 | 16 | 16 | 16 |
| 5 | 16 | 32 | 32 | 32 |

Output `32`. The first step where the reduction actually changes something is n = 30:

| Step i | count before | count · 2 | mod m | count after |
|---|---|---|---|---|
| 29 | 268,435,456 | 536,870,912 | 536,870,912 | 536,870,912 |
| 30 | 536,870,912 | 1,073,741,824 | 1,073,741,824 − 1,000,000,007 | 73,741,817 |

#### Java code

```java title="Approach 1: n doublings modulo 10^9 + 7"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    static final int MOD = 1_000_000_007;

    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        long count = 1;                          // strings of length 0: just the empty one
        for (int i = 0; i < n; i++) {
            count = count * 2 % MOD;             // each string extends by a 0 or a 1
        }
        System.out.println(count);
    }
}
```

#### Time complexity

**O(n)**: n iterations, each a multiplication and a remainder. For n = 10^6 that is a few milliseconds.

#### Space complexity

**O(1) auxiliary space.**

#### The bridge to the next approach

> "This is all the problem needs, and I would submit it. But the interviewer's next question is predictable: what if n were 10^18? Then a loop of n steps is hopeless. The general tool is fast exponentiation: square the base, and multiply it into the result for each set bit of n. It takes O(log n) steps, and it is the version I want in my head for every modular power. The one new risk is that it multiplies two values below m, not a value by 2, so the product is up to about 10^18."

### Approach 2: Fast exponentiation (square and multiply)

#### What I say out loud

> "Write n in binary. 2^n is the product of 2^(2^i) over the bits i that are set in n. I keep base = 2^(2^i) mod m by squaring it each round, and multiply it into the result when the current bit is 1. That's about 20 rounds for n up to a million, and the same code handles n up to 10^18."

#### Intuition

If n = 13 = 8 + 4 + 1 in binary (1101), then 2^13 = 2^8 · 2^4 · 2^1. The powers 2^1, 2^2, 2^4, 2^8, … each come from squaring the previous one. So walk through the bits of n from the lowest, squaring a running base each time, and multiply the base into the result exactly when the bit is set.

#### Algorithm

1. result = 1, base = 2 mod m, e = n.
2. While e > 0:
   - if the lowest bit of e is 1, result = result · base mod m;
   - base = base · base mod m;
   - e = e shifted right by one bit.
3. Print result.

#### Why it is correct

- **Invariant:** at the start of each round, result · base^e ≡ 2^n (mod m). Initially result = 1, base = 2, e = n. If e is odd, result · base^e = (result · base) · base^(e − 1), so moving one factor of base into result keeps the product. Then base^(e') with e' = ⌊e/2⌋ after squaring equals the old base^(e without its lowest bit). When e reaches 0, base^0 = 1, so result ≡ 2^n.
- **Reductions are exact,** by the same rule as Approach 1, applied to products of two reduced values.
- **No overflow in `long`:** both factors are below m, so each product is at most (m − 1)² = 1,000,000,012,000,000,036, below `Long.MAX_VALUE` ≈ 9.22 × 10^18. With `int` it overflows (section 11).

#### Dry run

Input `13` (binary 1101)

| Round | e (binary) | Lowest bit | result after | base after squaring |
|---|---|---|---|---|
| 1 | 1101 | 1 | 1 · 2 = 2 | 4 |
| 2 | 110 | 0 | 2 | 16 |
| 3 | 11 | 1 | 2 · 16 = 32 | 256 |
| 4 | 1 | 1 | 32 · 256 = 8,192 | 65,536 |
| end | 0 | — | 8,192 | — |

Output `8192` = 2^13. Four rounds instead of thirteen doublings.

#### Java code

```java title="Approach 2: fast modular exponentiation (recommended as the general tool)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    static final long MOD = 1_000_000_007L;

    static long power(long base, long exp) {
        long result = 1;
        base %= MOD;
        while (exp > 0) {
            if ((exp & 1) == 1) result = result * base % MOD;   // this bit of exp is set
            base = base * base % MOD;                           // base^(2^i) for the next bit
            exp >>= 1;
        }
        return result;
    }

    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        long n = Long.parseLong(in.readLine().trim());
        System.out.println(power(2, n));
    }
}
```

#### Time complexity

**O(log n)** multiplications: one round per bit of n, 20 rounds for n ≤ 10^6.

#### Space complexity

**O(1) auxiliary space.**

## 5. Comparison table

n = the string length (at most 10^6); m = 10^9 + 7.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. n doublings mod m | O(n) | O(n) | O(1) |
| 2. Fast exponentiation | O(log n) | O(log n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Doubling loop | Four lines; the intermediate is at most 2m, so even `int` is safe | O(n): useless for n near 10^18 | This problem, as stated |
| 2. Fast exponentiation | O(log n); works for any base and exponent up to 10^18 | Products reach m², so `long` is mandatory; slightly more to get right | Any modular power; the version to memorize |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** either is a full answer here. I would code Approach 1 first, because it is the direct translation of the counting argument and hard to get wrong, then say: "if n were larger, I'd use fast exponentiation", and write it if asked. If the interviewer prefers one program, give Approach 2: it is equally short and is the general tool.

**Is it optimal?** For n ≤ 10^6 both run in milliseconds, so there is nothing to gain. Asymptotically, O(log n) for a single power is what the standard method gives; the answer must depend on every bit of n, so reading n already costs O(log n) bit operations.

**When to stop:** once the reductions and the types are right. Precomputing powers only helps when there are many queries.

## 7. Interview script: code it and test it

### What I say while coding

> "`count` is a `long`. Strictly, doubling a value below m stays below 2.15 billion, so `int` would survive, but I don't want correctness to depend on that margin."

> "I reduce inside the loop, every time, not once after the loop. After 63 doublings a `long` has already wrapped."

> "For the fast version, both factors are below m, so the product is below about 10^18: `long` is required there."

### Testing out loud

**Normal case:** n = 3. 1 → 2 → 4 → 8. Output 8, matching the example.

**Smallest input:** n = 1. One doubling: 2.

**First real reduction:** n = 30. After 29 steps count = 536,870,912; doubling gives 1,073,741,824, minus m is 73,741,817.

**Overflow boundary of the naive approach:** n = 64. My program prints 582,344,008; a version that only reduces at the end prints 0 (section 11).

**Largest input:** n = 10^6, output 235,042,059, which is the official expected answer; a million iterations take a few milliseconds.

**What the tests cover:** both programs pass all 12 official CSES tests imported for this site (n from 1 to 10^6), every n from 1 to 2,000, 300 random n up to 10^6, the boundaries above, and are compared with Java's `BigInteger.modPow`.

## 8. Time plan for the interview

This is a warm-up; aim for about eight minutes.

| Phase | Time | What to get done |
|---|---|---|
| Clarify and count | 1–2 min | 2^n by the product rule, why the modulus exists |
| Code | 2 min | Approach 1 with reduction in the loop |
| Overflow and generalize | 2–3 min | The int/long boundaries; fast exponentiation if asked |
| Test | 1 min | n = 1, 3, 30, 64 |

The time should go into the reduction argument and the overflow points; they are what this problem is actually testing. If you forget the modular identity, prove it on the spot from a = qm + r.

## 9. Interviewer challenges

### About the arithmetic

#### Why are you allowed to take the remainder in the middle?

**What they are testing:** whether you can justify modular arithmetic, not just use it.

**How to reason:** write a = qm + r and expand the product.

**What I say:** "If a = qm + r, then a · b = qbm + rb. The first term is a multiple of m, so a · b and r · b have the same remainder. Applying that at each step means my variable always equals 2^i mod m, and the last one is the answer."

**Nuance:** the same holds for addition and subtraction (with care to keep subtraction non-negative), but not for division: dividing needs a modular inverse, which exists here because m is prime.

#### Where exactly would an `int` overflow?

**What they are testing:** precise reasoning about intermediate values.

**How to reason:** list every intermediate and its maximum.

**What I say:** "In the doubling loop, the largest intermediate is 2 · (m − 1) = 2,000,000,012, under the `int` limit of 2,147,483,647, so even `int` works. In fast exponentiation, I multiply two values below m, up to about 10^18, which needs `long`: with `int` the program prints −147,483,634 for n = 31 and 0 for n = 32."

**Nuance:** for a modulus near 10^18, even `long` products overflow; then use `Math.multiplyHigh`, `BigInteger` or a mulmod by repeated doubling.

### About the alternatives

#### Why not `BigInteger.TWO.pow(n).mod(...)` or `modPow`?

**What they are testing:** whether you know the library and its costs.

**How to reason:** `pow` builds the full number; `modPow` does not.

**What I say:** "`BigInteger.TWO.pow(n)` builds a number with a million bits before reducing it. That is likely fast enough here, but it does far more work than needed. `BigInteger.TWO.modPow(BigInteger.valueOf(n), m)` reduces as it goes and is a fine one-liner; I use it as the reference in my tests. In an interview I write the loop, because they want to see that I know how it works."

**Nuance:** CSES judges in Java accept `BigInteger`, but in many interview settings you are expected to write the arithmetic yourself.

## 10. Follow-up questions the interviewer might ask

**"What if n can be up to 10^18?"**
Approach 2 unchanged: about 60 rounds. Read n as a `long`. O(log n).

**"Count strings over an alphabet of k letters."**
k^n mod m by fast exponentiation, reducing k first. O(log n).

**"Count bit strings of length n with no two adjacent 1s."**
No longer a pure power: let a(i) and b(i) count strings ending in 0 and in 1; a(i) = a(i − 1) + b(i − 1), b(i) = a(i − 1). The total follows the Fibonacci numbers. O(n) with reduction at every addition, or O(log n) with 2 × 2 matrix exponentiation.

**"Answer q queries, each with its own n ≤ 10^6."**
Precompute pow[i] = 2^i mod m for all i up to 10^6 once, O(10^6), then answer each query in O(1).

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Thinking the modulus can wait until the end.** It cannot: the unreduced value has already overflowed long before.
- **Assuming `int` is always wrong (or always fine).** Doubling stays under 2m and fits `int`; multiplying two reduced values does not.
- **Using `Math.pow` because "2^n is a power".** Floating point cannot carry a million-bit number.

### Implementation mistakes

> [!MISTAKE] Reducing only after the loop
> `long c = 1; for (...) c *= 2; System.out.println(c % MOD);` is right up to n = 62. At n = 63 the `long` wraps to −9,223,372,036,854,775,808 and the program prints −291,172,004; from n = 64 on it holds 0 and prints 0 (run once for n = 63, 64, 100 and 10^6). The correct answer for n = 64 is 582,344,008.

> [!MISTAKE] Fast exponentiation with `int` variables
> With `int result, base`, the product of two values below m overflows 32 bits. Run once: n = 31 prints −147,483,634 (correct: 147,483,634), and n = 32 prints 0, because `base` reaches 65,536 and 65,536 · 65,536 wraps to 0. The same code with `long` is correct.

- **`(long) Math.pow(2, n) % MOD`.** Correct up to n = 62. From n = 63 on, `Math.pow(2, n)` exceeds the `long` range and the cast saturates at `Long.MAX_VALUE`, so the program prints 291,172,003 for every larger n (run once). Keeping the `double` and writing `Math.pow(2, n) % MOD` happens to compute the right value up to n = 1,023, because powers of two are exact in a `double` and `%` on doubles is exact (checked for every n up to 1,023), but printing it gives `7.3741817E7` instead of `73741817`, and from n = 1,024 `Math.pow` returns infinity and the program prints `NaN`.
- **`1 << n`.** Java uses only the low five bits of the shift distance for an `int`, so `1 << 32` is 1 and `1 << 31` is negative.
- **`%` on a possibly negative value.** Not an issue here (all values stay positive), but in subtraction-based recurrences add m before taking the remainder.

## 12. Pattern recognition

**The pattern:** counting by the product rule, then computing a large power modulo a prime. Choices that are independent multiply; the answer is reduced at every arithmetic step.

**Signals in the problem statement:**

- "Count the number of …" with an answer that grows exponentially.
- "Print the result modulo 10^9 + 7."
- Each position has a fixed number of independent choices.

**Related problems in this list:**

- [[cses-exponentiation|Exponentiation]]: fast modular exponentiation for arbitrary a^b, the direct generalization of Approach 2.
- [[nc-pow-x-n|Pow(x, n)]]: the same square-and-multiply idea with floating point and negative exponents.
- [[cses-trailing-zeros|Trailing Zeros]]: another closed-form count where the number itself (n!) is far too big to compute.
- [[cses-creating-strings|Creating Strings]]: counting and generating strings when the choices are not independent.

**Takeaway:** when an answer is "modulo a prime", reduce after every multiplication and bound each product before choosing the type: below 2m fits `int`, below m² needs `long`.

## 13. 60-second revision card

**Key insight:** each character doubles the count, so the answer is 2^n mod (10^9 + 7), computed with a reduction after every step.

**Invariant:** after i steps, count = 2^i mod m (fast version: result · base^e ≡ 2^n).

**Complexity:** O(n) doubling, or O(log n) fast exponentiation; O(1) space.

**Code skeleton:**

```java title="Bit Strings with fast exponentiation"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws IOException {
        long n = Long.parseLong(new BufferedReader(new InputStreamReader(System.in)).readLine().trim());
        final long m = 1_000_000_007L;
        long result = 1, base = 2;
        for (long e = n; e > 0; e >>= 1) {
            if ((e & 1) == 1) result = result * base % m;
            base = base * base % m;
        }
        System.out.println(result);
    }
}
```

**Main traps:**

- Reduce inside the loop: an unreduced `long` wraps at n = 63 and is 0 from n = 64.
- Products of two reduced values reach about 10^18: `long`, not `int`.
- No `Math.pow`, no `1 << n`.

**What to say in one breath:** "Every position is 0 or 1, so the answer is 2^n. I keep it modulo 10^9 + 7 at every step, which is exact because remainders survive multiplication. Doubling n times is O(n) and never exceeds 2m; the general tool is square-and-multiply in O(log n), where products reach m², about 10^18, so `long`."
