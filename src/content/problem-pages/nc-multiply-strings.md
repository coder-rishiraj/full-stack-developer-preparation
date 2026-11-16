---
problemId: nc-multiply-strings
title: Multiply Strings
source: neetcode
sourceUrl: https://leetcode.com/problems/multiply-strings/
difficulty: medium
patterns: [math-geometry, simulation, string-traversal]
relatedLessons: [a1-strings-stringbuilder, a2-array-string-traversal, a14-edge-cases, a14-manual-testing]
companies: []
timeToSolve: 25
---

## 1. Problem restatement

You get two non-negative integers written as strings of decimal digits, `num1` and `num2`. Return their product, also as a string of decimal digits. You may not use a big-integer library, and you may not convert either input to a built-in integer type directly.

**Example 1**

- Input: `num1 = "2"`, `num2 = "3"`
- Output: `"6"`
- Why: 2 × 3 = 6.

**Example 2**

- Input: `num1 = "123"`, `num2 = "456"`
- Output: `"56088"`
- Why: 123 × 456 = 56,088.

**What the problem statement guarantees**

- 1 ≤ `num1.length`, `num2.length` ≤ 200.
- Both strings contain digits only: no sign, no spaces.
- Neither has a leading zero, except the number 0 itself, written `"0"`.
- No `BigInteger`-style library, and no direct conversion of the inputs to integers.

## 2. Practice first: try it before reading on

This is long multiplication as taught in school, and the challenge is turning the pencil-and-paper method into indices without an off-by-one. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 25 minutes and talk out loud.
2. Multiply 123 by 456 on paper the way you learned in school. Then look at your working: which column did the product of the 2 in 123 and the 5 in 456 land in?
3. Work out how many digits the answer can have at most, for an m-digit number times an n-digit number.
4. Before you code, decide what your function returns for `"0"` times `"52"`, and for `"99"` times `"99"`.
5. For every intermediate value your code stores, ask how large it can get when both inputs are 200 nines.

> [!HINT] Hint 1: a small nudge
> Two 200-digit numbers have a product of up to 400 digits, which no built-in integer type holds. So the answer has to be built digit by digit. What did the paper method actually do with each pair of digits, one from each number?

> [!HINT] Hint 2: the kind of tool you need
> Every pair of digits, one from each input, contributes their product to one specific column of the answer, decided only by where the two digits sit. If you number the columns of the answer, you can add each pair's product straight into the right column and deal with carries, instead of writing out whole rows and adding them.

> [!HINT] Hint 3: almost the whole plan
> Use an array of m + n digit slots. Number the digits of each input from the left starting at 0, and the slots of the answer the same way. Work out which slot holds the ones of the product of digit i and digit j, and which slot its tens go to (write 123 × 456 in a grid and read off a few). Fill the slots from the right, carrying as you go, then turn the slots into a string, dropping leading zeros, and make sure an all-zero answer still prints as "0".

**Check yourself before revealing the walkthrough**

- [ ] My code returns "6", "56088", "0", "9801" and "100" for 2 × 3, 123 × 456, 0 × 52, 99 × 99 and 10 × 10
- [ ] It never calls `Integer.parseInt`, `Long.parseLong` or `BigInteger` on an input
- [ ] I can say which slot a pair of digits writes to, and derive it rather than remember it
- [ ] I can give the largest value any array cell or intermediate sum reaches, and why

## 3. Interview script: understand the problem (≈2 min)

**Me:** Two non-negative integers as digit strings, up to 200 digits each, and I return the product as a string. No `BigInteger`, and no converting to `int` or `long`.

**Interviewer:** Right.

**Me:** And even if conversion were allowed, it couldn't work at this size. A `long` holds up to 9,223,372,036,854,775,807, which is 19 digits. `Long.parseLong` on a 20-digit string throws `NumberFormatException`, and long before that the product overflows: two 10-digit inputs parse fine, but 9,999,999,999 squared in `long` silently comes out as 7,766,279,611,452,241,921 instead of 99,999,999,980,000,000,001. So I have to multiply digit by digit.

**Me:** How long can the answer be? An m-digit number is less than 10^m, so the product of an m-digit and an n-digit number is less than 10^(m+n): at most m + n digits, 400 here. And if both are non-zero, each is at least 10^(m−1) and 10^(n−1), so the product is at least 10^(m+n−2): at least m + n − 1 digits. So one array of m + n digit slots is enough, and at most one leading slot is unused, unless the product is zero.

**Me:** By hand, 123 × 456: 123 × 6 = 738, 123 × 5 = 615 shifted one place is 6,150, 123 × 4 = 492 shifted two places is 49,200. Sum: 56,088.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ length ≤ 200 | The product has up to 400 digits: no primitive type can hold the inputs or the answer. m · n ≤ 40,000 digit pairs, so O(m · n) is instant. |
| Digits only, no leading zeros except "0" | No parsing of signs or spaces. The answer may start with one zero slot, which I must drop, and "0" times anything must come out as "0", not "". |
| No big-integer library, no direct conversion | I implement the multiplication myself, on digits. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Converting a single character to its digit value (`c - '0'`) is allowed | That is reading one digit, not converting the input to an integer. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The output must not have leading zeros | The examples show none, and a number is not normally written with them. |

### Edge cases I will keep in mind

- Either input is "0": the answer is "0".
- Single digits, where the product may have one digit (2 × 3) or two (9 × 9).
- Carries that run through many columns: 99 × 99 = 9,801, 999 × 999 = 998,001.
- Products of powers of ten: 10 × 10 = 100, with zeros at the end that must stay.
- The maximum: 200 nines times 200 nines, a 400-digit answer.

## 4. Think out loud: from first idea to best solution

Throughout, m = `num1.length()`, n = `num2.length()`, and digits are indexed from the left starting at 0, as Java indexes strings. So `num1.charAt(i)` is worth 10^(m−1−i) and `num2.charAt(j)` is worth 10^(n−1−j).

One idea to discard first: multiplication as repeated addition (add `num1` to itself `num2` times) needs up to 10^200 additions. The schoolbook method is what makes this tractable.

### Approach 1: Multiply by one digit at a time and add the rows

#### What I say out loud

> "The paper method, literally. For each digit of `num2`, from the right, multiply all of `num1` by that one digit, which gives a row; shift the row left by the digit's position, which is appending zeros; and add it to a running total. I need two helpers: multiply a digit string by one digit, and add two digit strings. Both are a single right-to-left pass with a carry."

#### Intuition

num1 × num2 = Σ over j of num1 × digit_j × 10^(n−1−j). Each term is "num1 times one digit", shifted. Multiplying by one digit and adding two numbers are both easy on strings, because a carry from one column never exceeds a single digit.

#### Algorithm

1. If either input is "0", return "0".
2. `result = "0"`.
3. For j from n − 1 down to 0, with d = `num2[j]`, skipping d = 0:
4. `row` = `num1` × d (one pass, carry ≤ 8), then append n − 1 − j zeros.
5. `result` = `result` + `row` (string addition, carry ≤ 1).
6. Return `result`.

#### Why it is correct

The loop adds exactly the terms of num1 × num2 = Σ num1 × d_j × 10^(n−1−j), skipping the zero terms. The single-digit multiplier is correct because each column computes digit × d + carry ≤ 9 · 9 + 8 = 89, writes its last digit and carries at most 8. The adder is correct because each column computes at most 9 + 9 + 1 = 19 and carries at most 1; it keeps going while either string or the carry has something left. No leading zeros appear: `num1` has none and d ≥ 1, so every row starts with a non-zero digit, and the sum of two such numbers does too.

#### Dry run

123 × 456:

| j | Digit | Row = 123 × digit, shifted | Running total |
|---|---|---|---|
| 2 | 6 | 738 | 0 + 738 = 738 |
| 1 | 5 | 615 → 6150 | 738 + 6150 = 6888 |
| 0 | 4 | 492 → 49200 | 6888 + 49200 = 56088 |

#### Java code

```java title="Approach 1: add shifted rows"
class Solution {
    public String multiply(String num1, String num2) {
        if (num1.equals("0") || num2.equals("0")) {
            return "0";
        }
        String result = "0";
        int n = num2.length();
        for (int j = n - 1; j >= 0; j--) {
            int digit = num2.charAt(j) - '0';
            if (digit == 0) {
                continue;                          // a zero row adds nothing
            }
            StringBuilder row = timesDigit(num1, digit);
            for (int k = 0; k < n - 1 - j; k++) {
                row.append('0');                   // shift by the digit's place value
            }
            result = add(result, row.toString());
        }
        return result;
    }

    // a * digit, for 1 <= digit <= 9; each column is at most 9 * 9 + 8 = 89
    private StringBuilder timesDigit(String a, int digit) {
        StringBuilder out = new StringBuilder();
        int carry = 0;
        for (int i = a.length() - 1; i >= 0; i--) {
            int p = (a.charAt(i) - '0') * digit + carry;
            out.append((char) ('0' + p % 10));
            carry = p / 10;
        }
        if (carry > 0) {
            out.append((char) ('0' + carry));
        }
        return out.reverse();
    }

    // a + b; each column is at most 9 + 9 + 1 = 19
    private String add(String a, String b) {
        StringBuilder out = new StringBuilder();
        int i = a.length() - 1;
        int j = b.length() - 1;
        int carry = 0;
        while (i >= 0 || j >= 0 || carry > 0) {
            int s = carry;
            if (i >= 0) {
                s += a.charAt(i--) - '0';
            }
            if (j >= 0) {
                s += b.charAt(j--) - '0';
            }
            out.append((char) ('0' + s % 10));
            carry = s / 10;
        }
        return out.reverse().toString();
    }
}
```

#### Time complexity

**O(n · (m + n))**: n rows; each is built in O(m + n) (m digits plus up to n − 1 zeros) and added to a total of at most m + n digits in O(m + n). With m = n = 200 that is about 200 · 800 character operations, plus the strings created along the way.

#### Space complexity

**O(m + n)** auxiliary space at any moment (the current row and total), not counting the output. Each iteration creates new strings, so the total allocation is O(n · (m + n)).

#### The bridge to the next approach

> "Most of the work here is bookkeeping: every row is written out in full, padded with zeros, then added digit by digit into a new string. But look at what actually happens to one pair of digits: the 2 in 123 and the 5 in 456 multiply to 10, and that 10 always ends up in the same column of the answer, the hundreds, because 20 × 50 = 1,000 = 10 × 100. If I can say for each pair exactly which slot of the answer it belongs to, I can add every product straight into one array and skip the rows entirely."

### Approach 2: Add each digit product into its slot (recommended)

#### What I say out loud

> "One `int` array `pos` of m + n slots, where slot k is the answer's digit at index k from the left. The product of `num1[i]` and `num2[j]` is worth 10^(m−1−i) · 10^(n−1−j). Slot k is worth 10^(m+n−1−k). Setting those exponents equal: m + n − 2 − i − j = m + n − 1 − k, so k = i + j + 1. The ones of the product belong in slot i + j + 1, and its tens in the slot to the left, i + j. I go right to left, add the product to whatever is already in slot i + j + 1, keep the last digit there and push the rest into slot i + j."

#### Intuition

In the paper method the row for `num2[j]` is shifted so that `num1[i]` × `num2[j]` lands in a fixed column. Here is the 3 × 3 grid for 123 × 456, with each cell's slot i + j + 1:

| | j = 0 (4) | j = 1 (5) | j = 2 (6) |
|---|---|---|---|
| i = 0 (1) | 4 → slot 1 | 5 → slot 2 | 6 → slot 3 |
| i = 1 (2) | 8 → slot 2 | 10 → slot 3 | 12 → slot 4 |
| i = 2 (3) | 12 → slot 3 | 15 → slot 4 | 18 → slot 5 |

Slots run 0 to 5 (m + n = 6). The bottom-right pair, 3 × 6, is two ones digits: worth 10^0, the last slot, 5 = i + j + 1. Every step left in either input moves one slot left. Slot 0 is reached only by carries, which is why the answer can have m + n digits.

#### Algorithm

1. `pos = new int[m + n]`, all zero.
2. For i from m − 1 down to 0, for j from n − 1 down to 0:
3. `sum = num1[i] · num2[j] + pos[i + j + 1]`.
4. `pos[i + j] += sum / 10`, `pos[i + j + 1] = sum % 10`.
5. Build the string from `pos`, skipping leading zeros. If nothing is left, return "0".

#### Why it is correct

**Every product is counted once, at the right weight.** Each pair (i, j) is visited once. Its product p is added as `sum % 10` at weight 10^(m+n−1−(i+j+1)) and `sum / 10` at weight one place higher, and (sum / 10) · 10 + sum % 10 = sum. So the value Σ pos[k] · 10^(m+n−1−k) increases by exactly p · 10^(m+n−2−i−j), the pair's contribution to num1 × num2. Moving the old content of slot i + j + 1 into `sum` and back out keeps the value unchanged. After all pairs, the array's value is num1 × num2.

**Every cell ends as a single digit,** which matters because each one becomes one character. This is the loop-order argument, and it also bounds every value:

- **Entering row i, every cell holds 0–9.** True before the first row (all zero).
- **Within row i**, j goes right to left. Slot i + j + 1 first receives the carry from step j + 1 (where it was slot i + (j + 1)), then at step j it is read into `sum` and reset to `sum % 10` ≤ 9. So when read, it holds at most 9 + the previous carry.
- **Carries stay at most 9.** If the previous carry is ≤ 9, then sum ≤ 81 + 9 + 9 = 99, so the new carry `sum / 10` ≤ 9. The first step of a row has no previous carry, so by induction every carry is ≤ 9, every `sum` is ≤ 99 and no cell ever exceeds 18.
- **Leaving row i**, slots i + 1 to i + n were each reset after their last carry, and slot i holds only the last carry (no earlier row reaches that far left), so every cell is again 0–9.

After the last row every cell is a digit, and the array is exactly the decimal digits of the product, with possibly one leading zero (or all zeros if an input is 0).

**No overflow anywhere.** The largest value computed is 99 and the largest stored is 18, against an `int` limit above 2 · 10^9. I instrumented the code on 200 nines times 200 nines and on 20,000 random inputs up to 200 digits: the largest `sum` was 99 and the largest cell 18, matching the argument.

**The 30-second version to say to the interviewer:**

> "Digit i of `num1` times digit j of `num2` is worth 10 to the (m − 1 − i) + (n − 1 − j), and slot k of an (m + n)-slot answer is worth 10 to the (m + n − 1 − k), so the product's ones go to slot i + j + 1 and its tens to slot i + j. I add each product plus the slot's current value, keep the last digit, carry the rest left. Going right to left, every carry is at most 9 and every sum at most 99, so the cells end up as digits. Then I strip leading zeros, and return "0" if nothing is left."

#### Dry run

123 × 456, `pos` has 6 slots. Each row of the table is one (i, j) step:

| i | j | Product | Slots i + j, i + j + 1 | `sum` = product + pos[i + j + 1] | `pos` after |
|---|---|---|---|---|---|
| 2 | 2 | 3 × 6 = 18 | 4, 5 | 18 + 0 = 18 | [0, 0, 0, 0, 1, 8] |
| 2 | 1 | 3 × 5 = 15 | 3, 4 | 15 + 1 = 16 | [0, 0, 0, 1, 6, 8] |
| 2 | 0 | 3 × 4 = 12 | 2, 3 | 12 + 1 = 13 | [0, 0, 1, 3, 6, 8] |
| 1 | 2 | 2 × 6 = 12 | 3, 4 | 12 + 6 = 18 | [0, 0, 1, 4, 8, 8] |
| 1 | 1 | 2 × 5 = 10 | 2, 3 | 10 + 4 = 14 | [0, 0, 2, 4, 8, 8] |
| 1 | 0 | 2 × 4 = 8 | 1, 2 | 8 + 2 = 10 | [0, 1, 0, 4, 8, 8] |
| 0 | 2 | 1 × 6 = 6 | 2, 3 | 6 + 4 = 10 | [0, 1, 1, 0, 8, 8] |
| 0 | 1 | 1 × 5 = 5 | 1, 2 | 5 + 1 = 6 | [0, 1, 6, 0, 8, 8] |
| 0 | 0 | 1 × 4 = 4 | 0, 1 | 4 + 1 = 5 | [0, 5, 6, 0, 8, 8] |

Slot 0 stays 0 and is skipped: the answer is "56088". (After the first row the array reads 0, 0, 1, 3, 6, 8, which is 123 × 6 = 738 aligned to the right, as the paper method would have it.)

"0" × "52": every product is 0, `pos` = [0, 0, 0], every slot is skipped and the method returns "0".

#### Java code

```java title="Approach 2: digit products into slots (recommended)"
class Solution {
    public String multiply(String num1, String num2) {
        int m = num1.length();
        int n = num2.length();
        int[] pos = new int[m + n];                 // slot k is worth 10^(m + n - 1 - k)
        for (int i = m - 1; i >= 0; i--) {
            int a = num1.charAt(i) - '0';
            for (int j = n - 1; j >= 0; j--) {
                int b = num2.charAt(j) - '0';
                int sum = a * b + pos[i + j + 1];   // at most 81 + 18 = 99
                pos[i + j] += sum / 10;             // tens move one slot left
                pos[i + j + 1] = sum % 10;          // ones stay in slot i + j + 1
            }
        }
        StringBuilder sb = new StringBuilder();
        for (int d : pos) {
            if (sb.length() == 0 && d == 0) {
                continue;                           // skip leading zeros
            }
            sb.append(d);                           // every cell is 0..9 here
        }
        return sb.length() == 0 ? "0" : sb.toString();
    }
}
```

#### Time complexity

**O(m · n)**: one O(1) step per digit pair, 40,000 at most, plus O(m + n) to build the string.

#### Space complexity

**O(m + n)** auxiliary space for `pos`, plus the O(m + n) output.

### Alternative: add all products first, carry once at the end

Add every product into slot i + j + 1 with no carrying at all, then make one right-to-left pass that carries: `pos[k − 1] += pos[k] / 10; pos[k] %= 10`.

```java title="Alternative: accumulate, then carry once"
class Solution {
    public String multiply(String num1, String num2) {
        int m = num1.length();
        int n = num2.length();
        int[] pos = new int[m + n];
        for (int i = 0; i < m; i++) {               // any order works: nothing is carried yet
            for (int j = 0; j < n; j++) {
                pos[i + j + 1] += (num1.charAt(i) - '0') * (num2.charAt(j) - '0');
            }
        }
        for (int k = m + n - 1; k > 0; k--) {       // one carry pass, right to left
            pos[k - 1] += pos[k] / 10;
            pos[k] %= 10;
        }
        StringBuilder sb = new StringBuilder();
        for (int d : pos) {
            if (sb.length() == 0 && d == 0) {
                continue;
            }
            sb.append(d);
        }
        return sb.length() == 0 ? "0" : sb.toString();
    }
}
```

**Overflow argument.** Slot k receives one product for each pair with i + j + 1 = k, and there are at most min(m, n) such pairs, so before the carry pass a slot holds at most 81 · min(m, n) = 81 · 200 = 16,200 (exactly what 200 nines times 200 nines produces). The carry pass adds at most a tenth of a neighbour each step, so nothing comes near the `int` range. The argument is simpler than Approach 2's, and the loop order no longer matters. The price is that the cell bound grows with the input length: for inputs of about 26 million digits it would pass 2^31, while Approach 2's bound of 99 does not depend on the length at all. At this problem's sizes either is fine; I would mention this one if the interviewer finds the loop-order argument hard to follow.

## 5. Comparison table

m, n = the lengths of `num1` and `num2` (each at most 200). Nothing is randomized, so expected and worst case coincide.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Add shifted rows | O(n · (m + n)) | O(n · (m + n)) | O(m + n) at a time; O(n · (m + n)) allocated in total |
| 2. Products into slots | O(m · n) | O(m · n) | O(m + n) |
| Alt. Accumulate, carry once | O(m · n) | O(m · n) | O(m + n) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Add shifted rows | Mirrors the paper method; each helper is simple | Two helpers to write; builds and discards a string per digit | When you want to show the method before optimizing |
| 2. Products into slots | One array, one loop pair, no helpers; values never exceed 99 | The slot rule and the loop order need an argument | The answer |
| Alt. Accumulate, carry once | Order-independent, simplest overflow bound | Cell values grow with the input length | When explaining the carry argument is the obstacle |

## 6. Which solution to give, and when to stop optimizing

Give Approach 2. Its code is shorter than Approach 1's, and the derivation of i + j + 1 from place values is the thing the interviewer is listening for, so derive it out loud rather than reciting it. Approach 1 is a good thing to describe in one sentence first, because it shows where the slot rule comes from.

Faster multiplication exists: Karatsuba's method multiplies two n-digit numbers in about O(n^1.585) digit operations, and FFT-based methods do better asymptotically. At 200 digits, schoolbook multiplication is 40,000 cheap steps, and none of those methods pays for its complexity here. Mention Karatsuba only if asked how big-integer libraries handle very large numbers. Stop when the slot rule, the leading-zero handling and the "0" case are traced.

## 7. Interview script: code it and test it

### What I say while coding

> "`pos` has m + n slots, because the product is below 10^(m+n)."

> "Both loops go right to left. That's what keeps every carry at most 9, so each cell ends up a single digit."

> "`sum` is the product plus what's already in slot i + j + 1. The last digit stays, the rest goes to slot i + j."

> "Building the string: skip zeros until the first non-zero digit. If I skipped everything, the product is zero and I return "0"."

### Testing out loud

**Normal case:** 123 × 456 gives "56088" (the table in section 4).

**Single digits:** 2 × 3: `pos` = [0, 6], the leading 0 is skipped, "6". And 9 × 9: sum = 81, `pos` = [8, 1], "81", where both slots are used.

**Zero:** "0" × "52": `pos` = [0, 0, 0], all skipped, so the `sb.length() == 0` check returns "0".

**Long carries:** 99 × 99 = "9801" and 999 × 999 = "998001".

**Trailing zeros:** 10 × 10: `pos` = [0, 1, 0, 0]; only the leading zero is skipped, "100".

**Largest input:** 200 nines times 200 nines: a 400-digit answer, 199 nines, an 8, 199 zeros and a 1, with every `sum` at most 99.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2 min | No library, why `long` cannot work, the m + n digit bound |
| Paper method | 2 min | 123 × 456 by rows (Approach 1 in words) |
| Derive the slot rule | 3 min | Place values give i + j + 1 and i + j; the grid |
| Code | 5–6 min | Approach 2 |
| Trace | 4 min | 123 × 456 partly, 0 × 52, 9 × 9, 10 × 10 |
| Bounds and follow-ups | rest | Why no cell exceeds 18; loop order; Karatsuba if asked |

The derivation is where to spend the time. If you can't remember the rule, write a 2 × 2 grid for 12 × 34 and read the slots off it; that is faster and more convincing than guessing.

## 9. Interviewer challenges

### About the rules

#### Why not `Long.parseLong`, or `BigInteger`?

**What they are testing:** whether you understand the size of the numbers, not only the rule.

**How to reason:** compare the input sizes with the range of each type.

**What I say:** "`BigInteger` is ruled out by the statement, and it would turn the question into a library call. `Long.parseLong` is ruled out too, and couldn't work anyway: a `long` holds 19 digits, the inputs have up to 200. `Long.parseLong("99999999999999999999")` throws `NumberFormatException`. Worse, it fails silently before that: 9,999,999,999 parses fine, but its square in `long` is 7,766,279,611,452,241,921, a wrapped value with no error. `Integer.parseInt` already throws at 11 digits."

**Nuance:** the silent case is the dangerous one. The product of two 10-digit numbers can need 20 digits, and Java's `long` multiplication wraps without warning; `Math.multiplyExact` would throw instead.

### About the slot rule

#### Why is the ones digit at i + j + 1 and not i + j?

**What they are testing:** whether you derived the rule or memorised it.

**How to reason:** equate place values.

**What I say:** "Digit i of `num1` is worth 10^(m−1−i), digit j of `num2` is worth 10^(n−1−j), so their product is worth 10^(m+n−2−i−j). Slot k is worth 10^(m+n−1−k). Equal when k = i + j + 1. The extra 1 is there because the answer has m + n slots, one more than the m + n − 1 places the digit products can reach, and that extra slot sits on the left, for the final carry."

**Nuance:** I ran the version with the ones at i + j and the carry at i + j − 1: it multiplies everything by 10, returning "560880" for 123 × 456 and "60" for 2 × 3, and it would lose a carry out of slot 0.

#### Can any cell overflow, and does the loop order matter?

**What they are testing:** whether you can bound intermediate values and know which part of your code depends on order.

**How to reason:** follow one cell through a row, then try the loops in the other direction.

**What I say:** "With both loops right to left, a slot is read once per row, holding at most 9 plus the carry from the step before, so `sum` is at most 81 + 18 = 99, carries are at most 9, and cells never exceed 18. And the order does matter: run the same loop body left to right and a carry can arrive in a slot after it was last reduced, so a cell can end at 10 or more and print as two characters. That version returns "551088" for 123 × 456 and "817101" for 99 × 99. If I want order independence, I accumulate first and carry once at the end."

**Nuance:** in the accumulate-first version the bound becomes 81 · min(m, n) = 16,200 here, still far from overflow, but it grows with the input length, while 99 does not.

### About the output

#### What happens if you don't strip leading zeros, or don't special-case zero?

**What they are testing:** whether you tested the edges of the output format.

**How to reason:** the array has m + n slots; the product may have m + n − 1 digits, or be 0.

**What I say:** "Without stripping, 123 × 456 returns "056088", because slot 0 is unused. Stripping all leading zeros without the fallback turns "0" × "52" into the empty string. I need both: skip leading zeros, then return "0" if nothing remains."

**Nuance:** for non-zero inputs only slot 0 can be a leading zero, because the product has at least m + n − 1 digits, so a single check `pos[0] == 0` would do; the loop is just as short and also covers the zero case.

## 10. Follow-up questions the interviewer might ask

**"Add two numbers given as strings."**
One right-to-left pass with a carry of at most 1, as in Approach 1's `add`. O(m + n) time. [[nc-add-binary|Add Binary]] is the same in base 2.

**"The numbers can be negative."**
Strip the signs, multiply the magnitudes, and prepend "−" if exactly one input was negative and the product is not zero ("−0" is wrong). Same complexity.

**"Multiply numbers stored as linked lists of digits, or as digit arrays."**
The slot rule is unchanged; only the indexing changes. With lists stored least-significant digit first, digit i times digit j goes to position i + j, with no + 1, because indices now count from the ones place.

**"What if the numbers have a million digits?"**
Schoolbook is 10^12 steps. Karatsuba splits each number in half and needs three half-size products instead of four, about O(n^1.585); FFT-based multiplication is about O(n log n). Libraries such as Java's `BigInteger` switch to faster algorithms above size thresholds (an implementation detail, not something its API promises).

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Thinking conversion fails only because of the rule.** It also fails because of size, including the silent overflow at 10 digits.
- **Memorising i + j + 1 without the place-value argument.** It is easy to swap the two slots under pressure; deriving it takes ten seconds.
- **Assuming any loop order works.** The inline-carry argument depends on going right to left; with both loops reversed the code prints wrong answers (section 9).

### Implementation mistakes

> [!MISTAKE] Ones digit at i + j
> Shifts the whole product one place: "560880" for 123 × 456 and "60" for 2 × 3.

> [!MISTAKE] Leading zeros kept, or zero lost
> Without stripping, 123 × 456 gives "056088". Stripping with no fallback gives "" for "0" × "52".

- **Overwriting instead of adding.** `pos[i + j + 1] = a * b` loses what earlier pairs put there; the slot must be read into `sum`.
- **Assigning the carry.** `pos[i + j] = sum / 10` drops the carry already there; it must be `+=`.
- **`sb.append(d)` on a cell that is not a single digit,** which happens with the left-to-right loops.

## 12. Pattern recognition

**The pattern:** arithmetic on numbers too large for any primitive type, done digit by digit with an array of digit slots and explicit carries, where each slot's index comes from place value.

**Signals in the problem statement:**

- Numbers given as strings or digit arrays.
- Lengths far beyond 19 digits, or an explicit ban on big-integer libraries.
- "Return the result as a string."

**Related problems in this list:**

- [[nc-plus-one|Plus One]]: the simplest case, adding 1 to a digit array with a carry that can run the whole length.
- [[nc-add-binary|Add Binary]]: string addition in base 2, the helper from Approach 1.
- [[nc-add-two-numbers|Add Two Numbers]]: the same carry logic on linked lists, least-significant digit first.
- [[nc-reverse-integer|Reverse Integer]]: the opposite situation, where the number fits in a primitive type and the work is preventing overflow.
- [[nc-excel-sheet-column-title|Excel Sheet Column Title]]: converting between a number and a digit string in another base.

**Takeaway:** when a number doesn't fit in a primitive, store its digits, decide each digit's slot from its place value, and bound every intermediate value before trusting the code.

## 13. 60-second revision card

**Key insight:** `num1[i] × num2[j]` is worth 10^(m+n−2−i−j), so in an array of m + n slots its ones go to slot i + j + 1 and its tens to slot i + j.

**Invariant:** going right to left, every carry is at most 9 and every `sum` at most 99; after each row every cell is a single digit.

**Complexity:** O(m · n) time, O(m + n) space.

**Code skeleton:**

```java title="Multiply Strings, digit slots" fragment="public String multiply(String num1, String num2)"
int m = num1.length(), n = num2.length();
int[] pos = new int[m + n];
for (int i = m - 1; i >= 0; i--)
    for (int j = n - 1; j >= 0; j--) {
        int sum = (num1.charAt(i) - '0') * (num2.charAt(j) - '0') + pos[i + j + 1];
        pos[i + j] += sum / 10;
        pos[i + j + 1] = sum % 10;
    }
StringBuilder sb = new StringBuilder();
for (int d : pos) if (sb.length() > 0 || d != 0) sb.append(d);
return sb.length() == 0 ? "0" : sb.toString();
```

**Main traps:**

- Ones at i + j + 1, carry at i + j: derive it from place values.
- `+=` for the carry, and read the slot into `sum`.
- Right-to-left loops, or the cells may end above 9.
- Strip leading zeros, and return "0" when nothing is left.

**What to say in one breath:** "The product can have up to 400 digits, so no primitive type works, and parsing a long fails at 20 digits and wraps silently at 10. I use m + n digit slots: digit i times digit j is worth 10 to the m + n − 2 − i − j, so its ones go to slot i + j + 1 and its tens to i + j. Going right to left, sums stay under 100, so each cell ends as one digit; I strip leading zeros and return "0" for an empty result. O(m · n) time, O(m + n) space."
