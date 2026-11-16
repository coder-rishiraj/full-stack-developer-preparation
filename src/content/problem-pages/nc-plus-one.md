---
problemId: nc-plus-one
title: Plus One
source: neetcode
sourceUrl: https://leetcode.com/problems/plus-one/
difficulty: easy
patterns: [math-geometry, arrays]
relatedLessons: [a2-array-string-traversal, a14-edge-cases, a1-big-o, a14-clarifying-requirements]
companies: []
timeToSolve: 10
---

## 1. Problem restatement

A non-negative integer is stored as an array `digits`, one decimal digit per element, most significant digit first. Add one to the integer and return the digits of the result in the same format.

**Example 1**

- Input: `digits = [1, 2, 9]`
- Output: `[1, 3, 0]`
- Why: the array stands for 129, and 129 + 1 = 130. The last digit rolls over from 9 to 0 and the digit before it goes up by one.

**Example 2**

- Input: `digits = [9, 9]`
- Output: `[1, 0, 0]`
- Why: 99 + 1 = 100, which has one more digit than the input.

**What the problem statement guarantees**

- 1 ≤ `digits.length` ≤ 100.
- Every element is a digit: 0 ≤ `digits[i]` ≤ 9.
- There are no leading zeros (so the only way to write zero is `[0]`).

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The interviewer will be watching two things: whether you notice that the number can be far too large for any primitive type, and whether you handle the case where the answer grows by a digit. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 10 minutes and talk out loud.
2. Write down, before coding, how large the number can be and whether it fits in an `int` or a `long`.
3. Work out by hand `[1, 2, 3]`, `[1, 9, 9]` and `[9, 9, 9]`, and notice which digits change each time.
4. Write the code and trace it on those three inputs and on `[0]`.

Open a hint only after a minute without progress.

> [!HINT] Hint 1: a small nudge
> A 100-digit number does not fit in a `long`. How did you add one to a number on paper at school, and where did you start?

> [!HINT] Hint 2: the kind of tool you need
> Work from the last digit towards the first. A digit below 9 absorbs the one; a 9 becomes 0 and passes the one along. Once a digit absorbs it, nothing further left changes.

> [!HINT] Hint 3: almost the whole plan
> Walk from the right. If the digit is below 9, increment it and return the array. If it is 9, set it to 0 and continue. If the loop finishes, every digit was 9: the answer is a 1 followed by n zeros, in a new array of length n + 1.

**Check yourself before revealing the walkthrough**

- [ ] My code never converts the whole array into an `int` or a `long`
- [ ] `[9]` gives `[1, 0]` and `[9, 9, 9]` gives `[1, 0, 0, 0]`
- [ ] `[0]` gives `[1]`
- [ ] I can say how many digits my loop visits in the best and the worst case

## 3. Interview script: understand the problem (≈1 min)

**Me:** So the array is a decimal number, most significant digit first, and I return the digits of that number plus one. Up to 100 digits, each 0 to 9, no leading zeros.

**Interviewer:** Yes.

**Me:** A hundred digits is about 10^100, so I can't convert to a `long`, which holds only about 19 digits. I'll work on the digits directly.

**Interviewer:** Good.

**Me:** May I modify the input array and return it, or should the input stay unchanged?

**Interviewer:** You may modify it.

**Me:** Then for most inputs I can do it in place and return the same array; only when every digit is 9 does the result need one more slot, and I'll allocate then. Example: `[1, 2, 9]`. The 9 becomes 0 with a carry, the 2 absorbs it and becomes 3, and I stop: `[1, 3, 0]`.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ `digits.length` ≤ 100 | The value can reach 10^100 − 1, far beyond `long` (at most 9,223,372,036,854,775,807, 19 digits). Arithmetic has to happen digit by digit, or with `BigInteger`. |
| 0 ≤ `digits[i]` ≤ 9 | Each slot holds one decimal digit, so a digit plus a carry is at most 10, and the carry is 0 or 1. |
| No leading zeros | The input `[0]` is possible and gives `[1]`. The output must not have a leading zero either, which my method guarantees (section 4). |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| The input may be modified and returned | No copy is needed when the length does not change; the all-nines case is the only allocation. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The caller does not rely on the input staying unchanged after the call | Follows from the clarification; if it didn't, I would copy first, which costs O(n) every time. |

### Edge cases I will keep in mind

- Last digit below 9: `[1, 2, 3]` changes one digit.
- Trailing nines: `[1, 9, 9]` becomes `[2, 0, 0]`.
- All nines: `[9]`, `[9, 9, 9]`, and 100 nines. The answer has one more digit.
- Zero: `[0]` becomes `[1]`.

## 4. Think out loud: from first idea to best solution

The tempting first idea, converting the array to a number, adding one and converting back, is wrong here, not slow: the number does not fit (section 11 shows the real output). Both approaches below do the arithmetic on the digits.

### Approach 1: Schoolbook addition with a carry

#### What I say out loud

> "I'll do exactly what I'd do on paper: add from the rightmost digit, with the 'plus one' entering as the initial carry. Each position gets `(digit + carry) % 10` and passes on `(digit + carry) / 10`. If a carry is left at the end, the result needs one more leading digit."

#### Intuition

Adding one is long addition where the second number is `0…01`. Treating the one as an incoming carry makes every position follow the same rule.

#### Algorithm

1. Let `n = digits.length`, allocate `sum = new int[n]`, and set `carry = 1`.
2. For `i` from n − 1 down to 0: `d = digits[i] + carry`, `sum[i] = d % 10`, `carry = d / 10`.
3. If `carry == 0`, return `sum`.
4. Otherwise return a new array of length n + 1 with `carry` at index 0 followed by `sum`.

#### Why it is correct

This is ordinary long addition of the number and 1, so after step 2 `sum` holds the last n digits of the result and `carry` is what overflows past the most significant digit. Since every `d` is at most 9 + 1 = 10, `carry` is always 0 or 1. If it is 1 at the end, the result has n + 1 digits with a leading 1; otherwise it has n digits, and its first digit is not 0 (it is at least the input's first digit, which is nonzero, or `[0]` became `[1]`).

#### Dry run

`digits = [1, 9, 9]`

| i | digits[i] | carry in | d | sum[i] | carry out |
|---|---|---|---|---|---|
| 2 | 9 | 1 | 10 | 0 | 1 |
| 1 | 9 | 1 | 10 | 0 | 1 |
| 0 | 1 | 1 | 2 | 2 | 0 |

`carry` is 0, so it returns `sum = [2, 0, 0]`.

#### Java code

```java title="Approach 1: full addition with a carry"
class Solution {
    public int[] plusOne(int[] digits) {
        int n = digits.length;
        int[] sum = new int[n];
        int carry = 1;                       // the "+ 1" enters as the initial carry
        for (int i = n - 1; i >= 0; i--) {
            int d = digits[i] + carry;
            sum[i] = d % 10;
            carry = d / 10;
        }
        if (carry == 0) {
            return sum;
        }
        int[] longer = new int[n + 1];       // every digit was 9
        longer[0] = carry;
        System.arraycopy(sum, 0, longer, 1, n);
        return longer;
    }
}
```

#### Time complexity

**O(n) in every case**, where n = `digits.length`. The loop always visits all n digits, and the extra copy in the all-nines case is another n.

#### Space complexity

**O(n) auxiliary space** for `sum` (and `longer` in the all-nines case). If the output is not counted, `sum` is the output in the common case, but the approach still allocates on every call.

#### The bridge to the next approach

> "Look at the trace: once the carry became 0 at index 0, nothing else could change. In general, the first digit below 9 from the right absorbs the carry and everything to its left is untouched. So I can stop there, and since only the trailing nines change, I can write into the input array directly."

### Approach 2: In place, stop at the first digit below 9

#### What I say out loud

> "Adding one changes only the trailing nines, which become zeros, and the first digit before them, which goes up by one. So I walk from the right: a 9 becomes 0 and I keep going; any other digit gets incremented and I return immediately. If I run off the left end, the number was all nines, and the answer is 1 followed by n zeros."

#### Intuition

`1299 + 1 = 1300`: the two trailing nines turn into zeros, the 2 becomes 3, and the 1 is never looked at. The carry dies at the first non-9 digit from the right.

#### Algorithm

1. For `i` from n − 1 down to 0:
   - if `digits[i] < 9`: increment it and return `digits`;
   - otherwise set `digits[i] = 0` and continue.
2. (Every digit was 9.) Allocate `result = new int[n + 1]`, set `result[0] = 1`, and return it. The other slots are already 0.

#### Why it is correct

- **Invariant:** when the loop reaches index `i`, every digit to the right of `i` was 9 and has been set to 0, and a carry of one is pending at `i`.
- **A digit below 9 absorbs the carry.** `digits[i] + 1` is at most 9, so no new carry is produced; the digits to the left are unchanged and the array now holds the number plus one. Returning early is correct.
- **If the loop finishes,** every digit was 9, so the number was 10^n − 1 and the answer is 10^n: a 1 followed by n zeros. Java zero-fills new arrays, so setting index 0 is enough.
- **No leading zero.** A returned in-place array keeps its first digit unless the carry reached it, and a carry reaching index 0 either increments it (nonzero result) or, if it was 9, leads to the new array starting with 1.

The 20-second version: "Only trailing nines change, to zeros, and the first non-9 from the right goes up by one. If there is no such digit, the number was all nines and the answer is 1 followed by zeros."

#### Dry run

`digits = [1, 9, 9]`

| i | digits[i] | Action | Array afterwards |
|---|---|---|---|
| 2 | 9 | set to 0, continue | `[1, 9, 0]` |
| 1 | 9 | set to 0, continue | `[1, 0, 0]` |
| 0 | 1 | below 9: increment and return | `[2, 0, 0]` |

`digits = [9, 9]`

| i | digits[i] | Action | Array afterwards |
|---|---|---|---|
| 1 | 9 | set to 0, continue | `[9, 0]` |
| 0 | 9 | set to 0, continue | `[0, 0]` |
| — | — | loop ends: new array, `result[0] = 1` | `[1, 0, 0]` |

#### Java code

```java title="Approach 2: in place with early return (recommended)"
class Solution {
    public int[] plusOne(int[] digits) {
        for (int i = digits.length - 1; i >= 0; i--) {
            if (digits[i] < 9) {
                digits[i]++;                 // absorbs the carry: nothing to the left changes
                return digits;
            }
            digits[i] = 0;                   // 9 + 1 = 10: write 0, carry on
        }
        int[] result = new int[digits.length + 1];   // all nines: 10^n
        result[0] = 1;                       // the rest is already 0
        return result;
    }
}
```

#### Time complexity

Let n = `digits.length` and t = the number of trailing nines. The loop visits t + 1 digits when t < n, so **O(t + 1)**: O(1) in the best case (last digit below 9) and **O(n) in the worst case** (all nines, which also allocates and zero-fills n + 1 slots).

#### Space complexity

**O(1) auxiliary space** when some digit is below 9: the input is updated in place. In the all-nines case the n + 1 element result is the required output; besides it there is only the loop index.

### Alternative: `BigInteger`

Build a string from the digits, `new BigInteger(s).add(BigInteger.ONE)`, and turn the result's `toString()` back into digits. It is correct and O(n) for 100 digits, and in production code using the library is reasonable. In an interview it usually skips what is being tested (the carry), so mention it, then write Approach 2.

## 5. Comparison table

n = `digits.length`, t = the number of trailing nines. Nothing hashes, so expected and worst case are the same.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Full addition with a carry | O(n) | O(n) | O(n) |
| 2. In place, early return | O(t + 1) | O(n) | O(1) beyond the output |
| Alt. `BigInteger` | O(n) | O(n) | O(n) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Full addition | The general long-addition template; works for adding any number | Always visits every digit and allocates | When the follow-up adds two arbitrary numbers |
| 2. In place, early return | Touches only the digits that change; no allocation in the common case | Modifies the input, which needs the interviewer's agreement | The default answer |
| Alt. `BigInteger` | Shortest; no carry logic of your own | Hides the skill being tested; string conversions | Production code |

## 6. Which solution to give, and when to stop optimizing

Give Approach 2 after confirming you may modify the input. In the worst case (all nines) every digit changes, so any algorithm must write n + 1 digits: Ω(n), and Approach 2 matches it. In the common case it stops after the trailing nines. Stop there; the only meaningful follow-up is the general addition of Approach 1.

## 7. Interview script: code it and test it

### What I say while coding

> "Loop from the last index down to 0. The return inside the loop is the common case."

> "A 9 becomes 0 and the loop continues; that's the carry."

> "After the loop, every digit was 9. `new int[n + 1]` is zero-filled, so I only set index 0."

### Testing out loud

**Normal case:** `[1, 2, 3]`. `i = 2`: 3 < 9, becomes 4, return `[1, 2, 4]`. One digit visited.

**Trailing nines:** `[1, 9, 9]` as in the dry run: `[2, 0, 0]`.

**All nines:** `[9]`. `i = 0`: set to 0, loop ends; new array `[1, 0]`. Correct, 9 + 1 = 10.

**Zero:** `[0]`. `i = 0`: 0 < 9, becomes 1, return `[1]`.

**Largest input:** 100 nines. The loop zeroes all 100 and returns 101 digits, `1` followed by 100 zeros, with no arithmetic beyond single digits, so nothing can overflow.

## 8. Time plan for the interview

A warm-up, usually expected in under 10 minutes.

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1 min | Size (no `long`), may I modify the input |
| Explain | 1–2 min | Trailing nines become 0, the first non-9 goes up, all nines grow by a digit |
| Code | 2–3 min | Approach 2 |
| Test | 2 min | `[1, 2, 3]`, `[1, 9, 9]`, `[9]`, `[0]` |

The time should go into the all-nines case, which is where most bugs are. If stuck, add one to 1299 and to 999 on paper and watch which digits change.

## 9. Interviewer challenges

### About the approach

#### Why not convert to a number, add one, and convert back?

**What they are testing:** whether you checked the constraints before reaching for the obvious code.

**How to reason:** 100 digits against the 19-digit capacity of a `long`.

**What I say:** "The number can have 100 digits; a `long` holds at most 19. The conversion would overflow silently and return wrong digits. With an `int`, `[9, 8, 7, 6, 5, 4, 3, 2, 1, 0]` already overflows: the code returns the digits of 1286608619 instead of 9876543211."

**Nuance:** `BigInteger` avoids the overflow, but it skips the carry logic the question is about.

#### What is the time complexity, really?

**What they are testing:** whether you distinguish best, typical and worst case.

**How to reason:** the loop stops at the first digit below 9.

**What I say:** "O(t + 1), where t is the number of trailing nines: O(1) when the last digit isn't 9, O(n) when all digits are 9. Worst case O(n), and that's optimal, because then all n + 1 output digits are different from the input."

**Nuance:** for uniformly random digits, the chance of t or more trailing nines is (1/10)^t, so the expected number of digits visited is a constant (about 1.11).

### About implementation

#### Your function sometimes returns the input array and sometimes a new one. Is that a problem?

**What they are testing:** awareness of aliasing.

**How to reason:** the caller sees a different object only in the all-nines case.

**What I say:** "It's fine for this contract, since the interviewer allowed modifying the input and the caller uses the return value. If the caller kept using the old array, they'd see the modified digits in one case and a stale array of zeros in the other. If that matters, copy first and always return a new array."

**Nuance:** Java arrays have fixed length, so growing by a digit always means a new array; an `ArrayList` could grow, but inserting at the front costs O(n).

## 10. Follow-up questions the interviewer might ask

**"Add an arbitrary non-negative digit array `b` instead of one."**
Approach 1 with two indices from the right and a carry; when one array runs out, treat its digits as 0. O(max(n, m)) time, O(max(n, m)) space for the result. This is [[nc-add-binary|Add Binary]] in base 10.

**"What if the digits were stored least significant first, as a linked list?"**
Then the carry moves forward along the list, which is the natural direction: [[nc-add-two-numbers|Add Two Numbers]]. O(n) time.

**"Subtract one instead (the input is at least 1)."**
Mirror image: trailing zeros become 9 and the first nonzero digit from the right decreases. If the leading digit becomes 0 (as in 10 − 1 = 9), drop it, unless the result is the single digit 0. O(n) worst case.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Converting to an `int` or `long`.** The value overflows: running the `int` version on `[9, 8, 7, 6, 5, 4, 3, 2, 1, 0]` gives the digits of 1286608619, and the `long` version on a 20-digit array such as `[9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]` gives 6531711741328785131. Both are silently wrong.
- **Forgetting that the answer can be longer than the input.** Every all-nines input grows by one digit.

### Implementation mistakes

> [!MISTAKE] Returning the zeroed input when every digit was 9
> If the code after the loop is `return digits;`, then `[9, 9]` returns `[0, 0]`. The all-nines case needs a new array of length n + 1 starting with 1.

- **Incrementing without the carry check:** `digits[n - 1]++` alone turns `[1, 9]` into `[1, 10]`, an element that is not a digit.
- **Copying the old digits into the longer array.** For all nines they are all 0 after the loop anyway; copying is harmless but shows the case was not understood.

## 12. Pattern recognition

**The pattern:** digit-by-digit arithmetic with a carry, processed from the least significant digit.

**Signals in the problem statement:**

- A number given as an array or string of digits, or a size limit far beyond 64 bits.
- An arithmetic operation (add, multiply, increment) on that representation.

**Related problems in this list:**

- [[nc-add-binary|Add Binary]]: the same carry loop for two numbers in base 2.
- [[nc-add-two-numbers|Add Two Numbers]]: carry addition on linked lists stored least significant first.
- [[nc-multiply-strings|Multiply Strings]]: schoolbook multiplication with carries on digit strings.
- [[nc-excel-sheet-column-title|Excel Sheet Column Title]]: digits in an unusual base, produced from the least significant end.
- [[nc-roman-to-integer|Roman to Integer]]: another conversion between a symbol representation and its value.

**Takeaway:** when a number is too big for a primitive type, do the arithmetic digit by digit from the least significant end, and always ask whether the result can have more digits than the input.

## 13. 60-second revision card

**Key insight:** only the trailing nines change (to 0) and the first digit before them goes up by one; all nines become 1 followed by zeros.

**Invariant:** at index `i`, every digit to its right has become 0 and a carry of one is pending.

**Complexity:** O(n) worst case (all nines), O(1) when the last digit is below 9; O(1) auxiliary space beyond the output.

**Code skeleton:**

```java title="Plus One in eight lines" fragment="public int[] plusOne(int[] digits)"
for (int i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
        digits[i]++;
        return digits;
    }
    digits[i] = 0;
}
int[] result = new int[digits.length + 1];
result[0] = 1;
return result;
```

**Main traps:**

- Never convert to `int` or `long`: up to 100 digits.
- All nines need a new array of length n + 1.
- `[0]` becomes `[1]`.

**What to say in one breath:** "I walk from the last digit: a 9 becomes 0 and carries, anything else goes up by one and I return. If every digit was 9, I return a new array with a 1 and n zeros. O(n) worst case, O(1) extra space, and no conversion to a number, which would overflow at 100 digits."
