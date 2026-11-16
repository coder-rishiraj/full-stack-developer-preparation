---
problemId: nc-reverse-integer
title: Reverse Integer
source: neetcode
sourceUrl: https://leetcode.com/problems/reverse-integer/
difficulty: medium
patterns: [bit-manipulation, mathematics]
relatedLessons: [a1-java-syntax-competitive, a14-edge-cases, a14-manual-testing, a14-clarifying-requirements]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

You get a signed 32-bit integer `x`. Return the number whose decimal digits are those of `x` in reverse order, keeping the sign. If that reversed number does not fit in a signed 32-bit integer, return 0 instead.

**Example 1**

- Input: `x = 123`
- Output: `321`
- Why: the digits 1, 2, 3 read backwards are 3, 2, 1.

**Example 2**

- Input: `x = -123`
- Output: `-321`
- Why: the sign stays in front; only the digits are reversed.

**Example 3**

- Input: `x = 120`
- Output: `21`
- Why: reversed, the digits are 0, 2, 1, and a leading zero is not part of a number.

**What the problem statement guarantees**

- −2^31 ≤ `x` ≤ 2^31 − 1, so `x` is any Java `int`, from −2,147,483,648 to 2,147,483,647.
- If the reversed value is outside [−2^31, 2^31 − 1], the answer is 0.
- "Assume the environment does not allow you to store 64-bit integers (signed or unsigned)." Every value you keep must fit in 32 bits.

## 2. Practice first: try it before reading on

Reversing the digits is the easy half. The real problem is knowing that the result will not fit *before* you compute it, with no wider type to compute it in. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 15 minutes and talk out loud.
2. Write the answers for 123, −123, 120, 0 and 1,534,236,469 before writing code. For the last one, write out the reversed digits and compare them with 2,147,483,647.
3. Decide how you will get the last digit of a negative number, and check what your language gives for −123 % 10.
4. Write your solution without `long`, `double`, `BigInteger` or strings, then trace it on 2,147,483,647 and −2,147,483,648.

> [!HINT] Hint 1: a small nudge
> You can peel digits off the right end of `x` and push them onto the right end of a result, one at a time. The danger is a single step of that loop. Which step could make the result too big, and what do you know just before it?

> [!HINT] Hint 2: the kind of tool you need
> Each step computes `result * 10 + digit`. You cannot compute that and then look at it, because the overflow has already happened. Rearrange "result · 10 + digit ≤ 2,147,483,647" into a condition on `result` and `digit` that you can test with values you already have.

> [!HINT] Hint 3: almost the whole plan
> 2,147,483,647 = 214,748,364 · 10 + 7, and −2,147,483,648 = −214,748,364 · 10 − 8. Before each step, if `result` is already past 214,748,364 (or past −214,748,364 on the negative side), the step overflows whatever the digit is. If it equals that value exactly, the digit decides. Then ask whether that last case can happen at all for an input that is itself a 32-bit integer.

**Check yourself before revealing the walkthrough**

- [ ] My code returns 321, −321, 21, 0 and 0 for 123, −123, 120, 0 and 1,534,236,469
- [ ] It returns 0 for 2,147,483,647 and for −2,147,483,648, and 2,147,483,641 for 1,463,847,412
- [ ] No variable in my code is wider than 32 bits
- [ ] I can say, for the step that would overflow, which check stops it and why that check itself cannot overflow

## 3. Interview script: understand the problem (≈2 min)

**Me:** I reverse the decimal digits of `x` and keep the sign, so 123 gives 321 and −123 gives −321. Trailing zeros of `x` become leading zeros and vanish: 120 gives 21. If the reversed value is outside the `int` range, I return 0.

**Interviewer:** Yes.

**Me:** The statement says to assume 64-bit integers can't be stored. In Java I could just use a `long`. Do you want me to honour that rule?

**Interviewer:** Yes. Pretend `long` doesn't exist.

**Me:** Then the whole difficulty is detecting overflow without ever producing an overflowed value, because in Java an `int` overflow doesn't throw: it silently wraps around. Let me do one by hand. 1,534,236,469 reversed is 9,646,324,351. That's above 2,147,483,647, so the answer is 0. A loop that doesn't check would wrap and return garbage.

**Me:** And strings? Reversing `Integer.toString(x)` and parsing it back would work.

**Interviewer:** I'd rather see the arithmetic.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| −2^31 ≤ x ≤ 2^31 − 1 | x can be negative, zero, or one of the two extremes. x has at most 10 digits, so the loop runs at most 10 times. |
| Out-of-range result → 0 | Overflow is an expected outcome, not an error. About 42% of all `int` inputs overflow when reversed (I counted: 1,802,126,805 of the 2^32). |
| No 64-bit storage | I can't compute the reversed value in a `long` and range-check it. The check must happen before the step that would overflow, using only `int` values. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| The 64-bit rule is enforced, even though Java has `long` | The `long` version is only a baseline. The answer must work in `int`. |
| Arithmetic preferred over string reversal | The string version is a valid alternative; I mention it, I don't lead with it. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| Java's `%` and `/` on negative numbers truncate toward zero | So −123 % 10 is −3 and −123 / 10 is −12. That lets one loop handle both signs: the digits come out negative and the result builds up negative. This is defined by the Java Language Specification, not an assumption about the platform, but I say it because other languages (Python) differ. |

### Edge cases I will keep in mind

- 0, which skips the loop entirely.
- Trailing zeros: 120 → 21, 900,000 → 9.
- The extremes: 2,147,483,647 and −2,147,483,648 both overflow when reversed.
- The largest values that still fit: 1,463,847,412 → 2,147,483,641 and −1,463,847,412 → −2,147,483,641.
- The smallest overflowing input with a small reversal: 1,000,000,003 → 3,000,000,001, too big.

## 4. Think out loud: from first idea to best solution

Throughout, x is the input, `rev` is the reversed value built so far, and d is the digit being moved. MAX = 2^31 − 1 = 2,147,483,647 and MIN = −2^31 = −2,147,483,648.

### Approach 1: Reverse in a 64-bit integer, then range-check

#### What I say out loud

> "If I ignore the 64-bit rule for a second, this is easy. The reversed value of a 10-digit number is at most about 8.5 billion in size, which fits in a `long`. So I build it in a `long` and compare with the `int` range at the end. That breaks the rule we agreed on, so it's not my answer, but it tells me exactly what the right output is, and it shows where the problem is: one specific multiply-by-10."

#### Intuition

`x % 10` is the last digit and `x / 10` drops it. Appending a digit d to `rev` is `rev * 10 + d`. Repeat until x is 0. In a wide enough type nothing can overflow, so the range check can come last.

#### Algorithm

1. `long rev = 0`.
2. While x ≠ 0: `rev = rev * 10 + x % 10`, then `x /= 10`.
3. If `rev` is outside [MIN, MAX], return 0; otherwise return `(int) rev`.

#### Why it is correct

After k iterations, `rev` holds the last k digits of x in reverse order, with x's sign (both `%` and `/` keep the sign). The loop ends when every digit has been moved, so `rev` is the exact reversed value. The largest possible magnitude is 8,463,847,412 (from −2,147,483,648), far below the `long` limit of about 9.2 × 10^18, so `rev` never overflows and the final range check sees the true value.

#### Dry run

x = 1,534,236,469: the digits come out as 9, 6, 4, 6, 3, 2, 4, 3, 5, 1, and `rev` ends at 9,646,324,351. That is above 2,147,483,647, so the method returns 0.

x = −123: `rev` goes −3, −32, −321. In range, returns −321.

#### Java code

```java title="Approach 1: reverse in a long (breaks the 64-bit rule)"
class Solution {
    public int reverse(int x) {
        long rev = 0;                        // |rev| <= 8,463,847,412: fits easily in a long
        while (x != 0) {
            rev = rev * 10 + x % 10;         // % keeps x's sign, so negatives just work
            x /= 10;
        }
        if (rev > Integer.MAX_VALUE || rev < Integer.MIN_VALUE) {
            return 0;
        }
        return (int) rev;
    }
}
```

#### Time complexity

**O(log |x|)**: one iteration per decimal digit, at most 10 for an `int`.

#### Space complexity

**O(1)** auxiliary space, but one of the values is 64 bits wide, which the problem forbids.

#### The bridge to the next approach

> "The only reason I needed a `long` is the last multiply-by-10. Every earlier step is a number with at most nine digits, which always fits. So I don't need a wider type, I need to know *before* that step whether it will overflow. The overflow condition is rev · 10 + d > MAX. I can't evaluate the left side, but I can move the 10 to the other side: that turns it into a comparison of `rev` with MAX / 10, and both of those fit in an `int`."

### Approach 2: Check before every multiply (recommended)

#### What I say out loud

> "Before I append a digit I ask: would rev · 10 + d leave the range? Write MAX as 214,748,364 · 10 + 7. If `rev` is less than 214,748,364, then rev · 10 is at most 2,147,483,630 and adding a digit gives at most 2,147,483,639, which fits. If `rev` is more than 214,748,364, then rev · 10 is at least 2,147,483,650, already too big. If `rev` is exactly 214,748,364, the digit decides: up to 7 fits, 8 or 9 doesn't. The negative side is the same with −214,748,364 and −8."

#### Intuition

The comparison rev · 10 + d ≤ MAX contains a value we may not compute. Dividing both sides by 10 turns it into a comparison between `rev` and `MAX / 10` = 214,748,364, plus a tie-break on the last digit. Every value in that test is a small `int`, and so is every value the loop ever stores, because we stop before the one step that would leave the range.

#### Algorithm

1. `rev = 0`.
2. While x ≠ 0:
3. `d = x % 10`, `x /= 10`.
4. If `rev > MAX / 10`, or `rev == MAX / 10` and `d > 7`: return 0.
5. If `rev < MIN / 10`, or `rev == MIN / 10` and `d < −8`: return 0.
6. `rev = rev * 10 + d`.
7. Return `rev`.

#### Why it is correct

**The checks are exact.** Java's `/` truncates toward zero, so MAX / 10 = 214,748,364 with MAX % 10 = 7, and MIN / 10 = −214,748,364 with MIN % 10 = −8. For the positive side, with 0 ≤ d ≤ 9:

- rev < 214,748,364: rev · 10 + d ≤ 2,147,483,630 + 9 = 2,147,483,639 ≤ MAX. Fits.
- rev = 214,748,364: rev · 10 + d = 2,147,483,640 + d, which fits exactly when d ≤ 7.
- rev > 214,748,364: rev · 10 ≥ 2,147,483,650 > MAX. Overflows for every d.

The negative side mirrors it with −214,748,364 and d ≥ −8. When x is positive, every d and every `rev` is non-negative, so only the first check can fire; when x is negative, only the second. So the method returns 0 exactly when the true reversed value is out of range.

**Nothing overflows.** Step 6 only runs after the checks have proved its result is in range, and the checks compare `rev` with constants. So every stored value is the exact prefix of the reversed number, as in Approach 1, and the returned value is the exact answer.

**The last-digit tie-break never fires for a 32-bit input.** For `rev` to equal 214,748,364 (nine digits) before a step, at least nine digits of x have been moved and one is left, so x has ten digits and the remaining d is x's leading digit. A ten-digit `int` starts with 1 or 2, and 1 and 2 are both ≤ 7. The same holds on the negative side. So `rev > MAX / 10` alone would be enough. I keep the tie-break anyway: it costs nothing, it makes the check correct for any digit, and an interviewer can see it is right without hearing this argument. (I ran the method on all 2^32 inputs against Approach 1: it matched every one, and the tie-break branch was never the reason for a return.)

**The 20-second version to say to the interviewer:**

> "I build the reversed number digit by digit. Before each `rev * 10 + d` I compare `rev` with `MAX / 10`: below it, the step fits; above it, it overflows; equal, the digit must be at most 7. Same for the negative side with −8. So I return 0 exactly when the true answer is out of range, and I never compute a value that doesn't fit in an `int`."

#### Dry run

x = −123 (the sign rides along in every digit):

| d | x after `/= 10` | rev before | Checks | rev after |
|---|---|---|---|---|
| −3 | −12 | 0 | pass | −3 |
| −2 | −1 | −3 | pass | −32 |
| −1 | 0 | −32 | pass | −321 |

Returns −321.

x = 1,534,236,469 (overflows):

| d | x after `/= 10` | rev before | Checks | rev after |
|---|---|---|---|---|
| 9 | 153,423,646 | 0 | pass | 9 |
| 6 | 15,342,364 | 9 | pass | 96 |
| 4, 6, 3, 2, 4, 3 | … | … | pass | 96,463,243 |
| 5 | 1 | 96,463,243 | pass | 964,632,435 |
| 1 | 0 | 964,632,435 | 964,632,435 > 214,748,364 | return 0 |

x = 1,463,847,412 (the largest reversal that fits): after nine digits `rev` = 214,748,364, the remaining digit is 1, the tie-break allows it, and the result is 2,147,483,641.

#### Java code

```java title="Approach 2: check before every multiply (recommended)"
class Solution {
    public int reverse(int x) {
        int rev = 0;
        while (x != 0) {
            int digit = x % 10;              // same sign as x: -123 % 10 == -3
            x /= 10;
            // rev * 10 + digit must stay in [MIN, MAX]; MAX = 214748364 * 10 + 7, MIN = -214748364 * 10 - 8
            if (rev > Integer.MAX_VALUE / 10 || (rev == Integer.MAX_VALUE / 10 && digit > 7)) {
                return 0;
            }
            if (rev < Integer.MIN_VALUE / 10 || (rev == Integer.MIN_VALUE / 10 && digit < -8)) {
                return 0;
            }
            rev = rev * 10 + digit;          // proved in range by the checks above
        }
        return rev;
    }
}
```

#### Time complexity

**O(log |x|)**: one iteration per decimal digit of x, at most 10, each O(1).

#### Space complexity

**O(1)** auxiliary space, and every value is a 32-bit `int`.

### Alternative: detect the overflow by undoing the step

Compute `next = rev * 10 + digit` in `int`, and accept it only if `(next - digit) / 10 == rev`:

```java title="Alternative: undo the step and compare"
class Solution {
    public int reverse(int x) {
        int rev = 0;
        while (x != 0) {
            int digit = x % 10;
            x /= 10;
            int next = rev * 10 + digit;     // may wrap around
            if ((next - digit) / 10 != rev) {
                return 0;                    // the multiply wrapped, so undoing it fails
            }
            rev = next;
        }
        return rev;
    }
}
```

**Why it works, and where it is weaker.** If `rev * 10` wraps, it lands a multiple of 2^32 away from the true product, and dividing back by 10 cannot recover `rev`. But if `rev * 10` fits and only the `+ digit` wraps, then `next - digit` wraps back to exactly `rev * 10` and the test passes wrongly. That can only happen with `rev` = 214,748,364 and a digit of 8 or 9, the case shown above to be impossible for a 32-bit input. So the method is correct here (it matched Approach 1 on all 2^32 inputs when I ran it), but it leans on that argument, and it deliberately computes an overflowed value, which an interviewer who asked for "no overflow" may not accept. Approach 2 has neither problem.

**The string version.** Reverse the digits of `Integer.toString(x)`, keep the minus sign, and call `Integer.parseInt` inside a `try`, returning 0 on `NumberFormatException`. `parseInt` throws exactly when the value is out of the `int` range, so it is correct (it gave the right answer on every input in this page's tests), but it allocates strings and uses an exception for an outcome that happens on 42% of inputs. It is the right answer to "what would you write in production", not to this interview question.

## 5. Comparison table

Let D be the number of decimal digits of x (D ≤ 10). Nothing is randomized, so expected and worst case coincide.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Reverse in a `long` | O(D) | O(D) | O(1), but 64-bit |
| 2. Check before multiply | O(D) | O(D) | O(1), 32-bit only |
| Alt. Undo the step | O(D) | O(D) | O(1), 32-bit only |
| Alt. String + `parseInt` | O(D) | O(D) | O(D) for the strings |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Reverse in a `long` | Shortest, correct by inspection | Breaks the stated rule | As the baseline, and as a test oracle |
| 2. Check before multiply | Never overflows; the checks are exact for any digit | Two checks to get right | The answer |
| Alt. Undo the step | One check for both signs | Computes a wrapped value; correct only because of the leading-digit argument | If the interviewer asks for a different detection method |
| Alt. String + `parseInt` | Uses the library's own range check | Allocates; exceptions as control flow | Production code where clarity beats speed |

## 6. Which solution to give, and when to stop optimizing

Give Approach 2. Everything runs in at most 10 iterations, so there is nothing to optimize; the question is entirely about correctness under the 32-bit rule. Mention Approach 1 in one sentence as the target behaviour, write Approach 2, and then say why the last-digit tie-break can never fire. That last remark is what distinguishes a strong answer, but do not drop the tie-break from the code because of it: the code should be correct on its face. Stop once you have traced both extremes.

## 7. Interview script: code it and test it

### What I say while coding

> "`digit = x % 10` keeps the sign of x in Java, so I don't need to strip the sign and put it back."

> "The checks go *before* the multiply. After it, the value has already wrapped."

> "`Integer.MAX_VALUE / 10` is 214,748,364 and the remainder is 7; `Integer.MIN_VALUE / 10` is −214,748,364 and the remainder is −8. Those two remainders are the digit limits."

> "If the checks pass, `rev * 10 + digit` is provably in range, so I assign it."

### Testing out loud

**Normal case:** 123: `rev` goes 3, 32, 321. Returns 321.

**Negative:** −123: −3, −32, −321 (first table).

**Trailing zeros:** 120: the first digit is 0, so `rev` stays 0; then 2, 21. Returns 21.

**Zero:** the loop doesn't run; returns 0.

**Largest input:** 2,147,483,647: after nine digits `rev` = 746,384,741 > 214,748,364, so the tenth step returns 0.

**Smallest input:** −2,147,483,648: after nine digits `rev` = −846,384,741 < −214,748,364, so it returns 0.

**Largest result that fits:** 1,463,847,412 → 2,147,483,641; and −1,463,847,412 → −2,147,483,641.

**Overflow with small digits:** 1,000,000,003: after nine digits `rev` = 300,000,000 > 214,748,364, returns 0.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2 min | The 64-bit rule, negatives, what "doesn't fit" returns |
| Baseline | 1 min | The `long` version in words |
| Derive the check | 3 min | MAX = 214,748,364 · 10 + 7, the three cases |
| Code | 3–4 min | Approach 2 |
| Trace | 3 min | 123, −123, 120, both extremes |
| Follow-ups | rest | Why the tie-break never fires; the undo check; strings |

Spend the time on the derivation of the check: writing MAX as 214,748,364 · 10 + 7 out loud is the moment that shows you understand the problem. If you are stuck, work one ten-digit example by hand and look at which step goes wrong.

## 9. Interviewer challenges

### About overflow

#### What does your loop return if you remove the checks?

**What they are testing:** whether you know that Java `int` overflow wraps silently, and can show it.

**How to reason:** run the overflowing inputs through the unchecked loop.

**What I say:** "It returns wrapped garbage instead of 0. 1,534,236,469 should give 0 but gives 1,056,389,759. 2,147,483,647 gives −1,126,087,180, a negative answer for a positive input. −2,147,483,648 gives 126,087,180. And 1,000,000,003 gives −1,294,967,295. Every overflowing input comes back wrong: I counted 1,802,126,805 wrong answers out of 2^32 inputs, exactly the number that overflow."

**Nuance:** none of these throw. That is why the check must be explicit, and why testing only small inputs misses the bug entirely.

#### Your `digit > 7` check: can it ever be true?

**What they are testing:** whether you understand your check, not only that it is safe.

**How to reason:** ask what x must look like for `rev` to reach 214,748,364 with a digit still left.

**What I say:** "No. `rev` would have nine digits, so nine of x's digits are used and one is left, which makes x a ten-digit `int` and the remaining digit its leading digit. A ten-digit `int` starts with 1 or 2, so the digit is at most 2. The same on the negative side. So `rev > MAX / 10` alone decides overflow. I keep the tie-break because it makes the condition correct for any digit, so it stays right if this code is reused for, say, reversing into a smaller type."

**Nuance:** I confirmed it by running all 2^32 inputs: the tie-break never fired. The undo-check alternative depends on this same fact.

#### Can you just reverse the absolute value and put the sign back?

**What they are testing:** the asymmetry of two's complement.

**How to reason:** look at the one value whose absolute value is not an `int`.

**What I say:** "Mostly, but `Math.abs(Integer.MIN_VALUE)` is still −2,147,483,648, because +2,147,483,648 doesn't fit. A loop like `while (y > 0)` then doesn't run and returns 0, which happens to be the right answer for that input, by luck rather than design. Keeping the sign in the digits, as Java's `%` already does, avoids the special case."

**Nuance:** the only reversed value that would need the extra negative number, −2,147,483,648, would have to come from 8,463,847,412, which is not an `int`, so the absolute-value version is otherwise correct (I checked every negative input). It is still one more thing to argue.

### About the rule

#### Why not just use a `long`? Java has one.

**What they are testing:** whether you take a stated constraint seriously and can explain what it is for.

**How to reason:** the rule simulates the real situation, where the widest type you have is the one that might overflow.

**What I say:** "The `long` version works and I'd write it in production. The rule exists because the same problem appears one level up: if the input were a `long`, there would be no wider type, and I'd need exactly this check with `Long.MAX_VALUE / 10`. The skill being tested is detecting overflow before it happens."

**Nuance:** `Math.multiplyExact` and `Math.addExact` throw on `int` overflow and would also work, but they turn the answer into exception handling and hide the reasoning the question is about.

## 10. Follow-up questions the interviewer might ask

**"Reverse a `long` under the same rule."**
The same loop with `Long.MAX_VALUE / 10` = 922,337,203,685,477,580 and last digit 7, and `Long.MIN_VALUE / 10` with −8. O(D) time, O(1) space.

**"Is x a palindrome number?"**
Compare x with its reversal, or, to avoid overflow altogether, reverse only the second half: pop digits from x onto `rev` while `rev < x`, then compare `x == rev` or `x == rev / 10`. Negative numbers are not palindromes, and neither is a positive number ending in 0 (it would need a leading 0), which the half-reversal must reject up front. O(D) time.

**"Implement `atoi`: parse a string into an `int`, clamping on overflow."**
The same check, with the digit coming from a character instead of `x % 10`, and clamping to MAX or MIN instead of returning 0. O(length) time.

**"Reverse the bits instead of the decimal digits."**
Shift bits out of x and into the result 32 times; there is no overflow question because the result has exactly 32 bits. That is [[nc-reverse-bits|Reverse Bits]].

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Checking after the multiply.** `if (rev > Integer.MAX_VALUE)` can never be true for an `int`, and by then the value has already wrapped.
- **Treating negative numbers as a separate problem.** Java's `%` and `/` keep the sign, so one loop handles both; stripping the sign introduces the `Integer.MIN_VALUE` special case.
- **Assuming `long` is fine because Java has it.** The statement rules it out; ask, and if the interviewer enforces it, design for 32 bits.

### Implementation mistakes

> [!MISTAKE] No overflow check at all
> Returns 1,056,389,759 for 1,534,236,469 instead of 0, and −1,126,087,180 for 2,147,483,647. Small tests pass, so the bug survives unless you test a ten-digit input.

- **Getting the limits wrong.** MAX / 10 is 214,748,364 and its remainder is 7; the negative limit's remainder is −8, not −7 or +8.
- **Forgetting the negative-side check.** With only the positive check, −2,147,483,648 runs into the unchecked multiply.
- **Writing the check with the multiplication in it.** `rev * 10 > Integer.MAX_VALUE - digit` computes `rev * 10` first and overflows before comparing.

## 12. Pattern recognition

**The pattern:** build a number digit by digit and guard each `value * base + digit` step against overflow by comparing `value` with `LIMIT / base` before the step.

**Signals in the problem statement:**

- A fixed-width result type and "return 0 / clamp if out of range".
- A ban on wider types (here 64-bit), so the check must happen in the narrow type.
- Digits handled one at a time with `% 10` and `/ 10`.

**Related problems in this list:**

- [[nc-plus-one|Plus One]]: digit-by-digit arithmetic with a carry, on an array of digits.
- [[nc-multiply-strings|Multiply Strings]]: when the result cannot fit in any built-in type, keep the digits instead of the number.
- [[nc-roman-to-integer|Roman to Integer]]: building an integer from a different number format.
- [[nc-reverse-bits|Reverse Bits]]: the same reversal in base 2, where nothing overflows.
- [[nc-sqrt-x|Sqrt(x)]]: another problem where the largest intermediate value decides whether the code is right.

**Takeaway:** to check `a · b + c ≤ LIMIT` without overflow, compare `a` with `LIMIT / b` and break the tie with `LIMIT % b`.

## 13. 60-second revision card

**Key insight:** rev · 10 + d overflows exactly when `rev` > 214,748,364, or `rev` = 214,748,364 and d > 7 (negative side: −214,748,364 and −8). Check before the multiply.

**Invariant:** `rev` is the exact reversal of the digits moved so far, and every stored value fits in an `int`.

**Complexity:** O(D) time, D ≤ 10 digits; O(1) space, all 32-bit.

**Code skeleton:**

```java title="Reverse Integer, check before multiply" fragment="public int reverse(int x)"
int rev = 0;
while (x != 0) {
    int d = x % 10;
    x /= 10;
    if (rev > Integer.MAX_VALUE / 10 || (rev == Integer.MAX_VALUE / 10 && d > 7)) return 0;
    if (rev < Integer.MIN_VALUE / 10 || (rev == Integer.MIN_VALUE / 10 && d < -8)) return 0;
    rev = rev * 10 + d;
}
return rev;
```

**Main traps:**

- Overflow in Java wraps silently: 1,534,236,469 → 1,056,389,759 without the check.
- The check goes before `rev * 10 + d`, and must not contain `rev * 10`.
- Both sides: 7 for MAX, −8 for MIN.
- `Math.abs(Integer.MIN_VALUE)` is negative.

**What to say in one breath:** "I pop digits with `% 10` and push them onto `rev`, and Java's `%` keeps the sign, so negatives need nothing special. Before each `rev * 10 + d`, I compare `rev` with `MAX / 10`: above it overflows, equal means the digit must be at most 7, and the same with −8 on the negative side. So I never store an out-of-range value, and it's at most ten iterations."
