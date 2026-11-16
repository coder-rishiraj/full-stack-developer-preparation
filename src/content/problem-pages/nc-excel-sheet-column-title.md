---
problemId: nc-excel-sheet-column-title
title: Excel Sheet Column Title
source: neetcode
sourceUrl: https://leetcode.com/problems/excel-sheet-column-title/
difficulty: easy
patterns: [math-geometry, strings]
relatedLessons: [a1-strings-stringbuilder, a14-edge-cases, a2-array-string-traversal, a14-manual-testing]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

Spreadsheet columns are labelled `A`, `B`, …, `Z`, then `AA`, `AB`, …, `AZ`, `BA`, …, `ZZ`, then `AAA`, and so on. Given a column number (1 for the first column), return its label.

**Example 1**

- Input: `columnNumber = 28`
- Output: `"AB"`
- Why: columns 1 to 26 are the single letters `A` to `Z`. Column 27 is `AA` and column 28 is `AB`.

**Example 2**

- Input: `columnNumber = 701`
- Output: `"ZY"`
- Why: after the 26 single letters, the two-letter labels go `AA`…`AZ` (columns 27–52), `BA`…`BZ` (53–78), and so on, 26 per first letter. The block starting with `Z` begins at column 27 + 25 × 26 = 677, so 701 is 24 places into it: `Z` followed by the 25th letter, `Y`.

**What the problem statement guarantees**

- 1 ≤ `columnNumber` ≤ 2^31 − 1, so the input is any positive `int`.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. This looks like a routine base conversion, and that is exactly the trap: test your first idea on column 26 and column 52 before you trust it. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 15 minutes and talk out loud.
2. Write the labels for columns 1, 25, 26, 27, 52, 53, 702 and 703 by hand.
3. Write the code and run it, on paper, on every one of those numbers.
4. Explain in one sentence why your code produces `Z` and not something else for 26.

Open a hint only after a minute without progress.

> [!HINT] Hint 1: a small nudge
> This resembles writing a number in base 26. In which way is it different? Is there a letter that plays the role of the digit 0?

> [!HINT] Hint 2: the kind of tool you need
> Peel off one letter at a time from the right, with `%` and `/`. The letters have values 1 to 26, not 0 to 25, so the remainder needs adjusting before each step, and so does the quotient.

> [!HINT] Hint 3: almost the whole plan
> Repeat while the number is positive: subtract 1, take the remainder mod 26 as the letter (0 is `A`, 25 is `Z`), then divide by 26. Collect the letters and reverse them. Check that 26 gives `Z` and 52 gives `AZ`.

**Check yourself before revealing the walkthrough**

- [ ] 26 gives `Z`, 27 gives `AA`, 52 gives `AZ`, 702 gives `ZZ`, 703 gives `AAA`
- [ ] My output never contains a character outside `A`–`Z`
- [ ] I can explain why the "subtract 1" is needed, not just that it is
- [ ] 2147483647 neither overflows nor loops forever

## 3. Interview script: understand the problem (≈2 min)

**Me:** So 1 is `A`, 26 is `Z`, 27 is `AA`. It's like base 26, except that there's no zero: after `Z` comes `AA`, not `BA` or `A0`.

**Interviewer:** Right.

**Me:** Let me check that against decimal. In decimal, after 9 comes 10, a 1 and a 0. Here, after `Z` comes `AA`. If `A` meant 0, `AA` would equal `A`, so `A` can't be a zero. Letters are worth 1 to 26.

**Interviewer:** Go on.

**Me:** Then a label is like a number in base 26 with digits 1 to 26. For `AB`: A is 1, B is 2, so 1 × 26 + 2 = 28. And `ZY`: 26 × 26 + 25 = 701. That matches both examples. What's the input range?

**Interviewer:** 1 up to 2^31 − 1.

**Me:** So always positive, and the label has at most seven letters: the labels of length one to six cover 26 + 26^2 + … + 26^6 = 321,272,406 columns, which is less than 2^31 − 1, and adding the seven-letter ones takes the count past it. I'll watch for overflow in anything that multiplies by 26.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ `columnNumber` ≤ 2^31 − 1 | Never zero or negative, so there is always at least one letter. Labels have at most 7 letters (the largest input gives `FXSHRXW`). Any intermediate value above the input, such as 26^7 = 8,031,810,176, overflows an `int`. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| The sequence continues `ZZ`, `AAA`, `AAB`, … with no zero digit | The letters are digits 1 to 26 in base 26, a **bijective** base: every positive number has exactly one label, and there is no letter for 0. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| Uppercase `A`–`Z` only | The examples are uppercase; I return uppercase. |

### Edge cases I will keep in mind

- Multiples of 26: 26 → `Z`, 52 → `AZ`, 702 → `ZZ`. The remainder is 0 here, and that is where naive code breaks.
- The first label of a new length: 27 → `AA`, 703 → `AAA`.
- The smallest input: 1 → `A`.
- The largest input: 2147483647 → `FXSHRXW`.

## 4. Think out loud: from first idea to best solution

### Why plain base 26 fails (the derivation)

The first idea most people try is ordinary base conversion: take `n % 26` as the last letter and continue with `n / 26`. Ordinary base 26 has digits 0 to 25. Here the letters are worth 1 to 26:

> label `c_k … c_1 c_0` means n = d_k × 26^k + … + d_1 × 26 + d_0, with every d_i between 1 and 26.

Now look at what `n % 26` gives. If the last letter is `Z` (d_0 = 26), then n is a multiple of 26 and `n % 26` is 0, which is not a letter. And `n / 26` is then one too large, because the 26 in the last position was really a full "26 times 1" carried up.

The fix is to shift the last digit down by one before dividing. Subtract 1 from both sides:

> n − 1 = (d_0 − 1) + 26 × (d_k × 26^(k−1) + … + d_1)

Since d_0 − 1 lies between 0 and 25, this is an ordinary division with remainder by 26:

- `(n − 1) % 26` = d_0 − 1, which is the letter's index (0 = `A`, 25 = `Z`);
- `(n − 1) / 26` = d_k × 26^(k−1) + … + d_1, which is exactly the number whose label is the remaining letters `c_k … c_1`.

So each step is "subtract 1, take the remainder as the letter, divide by 26", and the subtraction happens again at every step, because every position has digits 1 to 26.

Running the two tempting variants on real inputs shows how they fail:

| n | Correct | `'A' + n % 26`, then `n /= 26` | `'A' + n % 26 - 1`, then `n /= 26` | `'A' + (n - 1) % 26`, then `n /= 26` |
|---|---|---|---|---|
| 1 | `A` | `B` | `A` | `A` |
| 26 | `Z` | `BA` | `A@` | `AZ` |
| 52 | `AZ` | `CA` | `B@` | `BZ` |
| 701 | `ZY` | `BAZ` | `A@Y` | `AZY` |
| 702 | `ZZ` | `BBA` | `AA@` | `AAZ` |

The third column is the classic bug: the remainder 0 becomes the character before `A`, which is `@`. The last column fixes the letter but not the quotient, so every number whose label contains a `Z` gets a spurious extra letter. Both variants are correct on 28 (`AB`), which is why testing only the examples does not catch them.

### Approach 1: Count the labels by length

#### What I say out loud

> "Another way to see it: there are 26 labels of length 1, 26^2 of length 2, 26^3 of length 3, and within one length they're in alphabetical order. So I first find the length by subtracting whole blocks, then the position inside the block written in plain base 26, with `A` as 0, padded to that length."

#### Intuition

All labels of length L, listed alphabetically, are exactly the L-digit base-26 numbers from `AA…A` (0) to `ZZ…Z` (26^L − 1), with `A` = 0 and `Z` = 25. Fixed length makes the leading `A`s meaningful, so a zero digit is fine inside a block. The only work is finding which block the column falls into.

#### Algorithm

1. `rank = columnNumber − 1` (0-based position among all labels), `block = 26`, `length = 1`. Use `long` for `rank` and `block`.
2. While `rank ≥ block`: `rank −= block`, `block *= 26`, `length++`.
3. Write `rank` in base 26 with exactly `length` digits, filling from the right: letter = `'A' + rank % 26`, then `rank /= 26`.

#### Why it is correct

- **Step 2 finds the length.** Labels shorter than L account for 26 + 26^2 + … + 26^(L−1) positions. The loop subtracts those block sizes in order and stops at the first block that still contains `rank`, so afterwards `rank` is the 0-based position inside the block of length `length`, between 0 and 26^length − 1.
- **Step 3 finds the label inside the block.** Alphabetical order of fixed-length strings over `A`–`Z` is the numeric order of the corresponding base-26 numbers with `A` = 0, so the label at position `rank` is `rank` written with `length` digits, leading `A`s included.

#### Dry run

`columnNumber = 701`

| Step | rank | block | length |
|---|---|---|---|
| start | 700 | 26 | 1 |
| 700 ≥ 26: subtract | 674 | 676 | 2 |
| 674 < 676: stop | 674 | 676 | 2 |

674 = 25 × 26 + 24. Filling from the right: 674 % 26 = 24 → `Y`, rank = 25; 25 % 26 = 25 → `Z`. Returns `ZY`.

`columnNumber = 28`: rank 27 ≥ 26 → rank 1, length 2. 1 = 0 × 26 + 1, so the letters are `A` (0) and `B` (1): `AB`.

#### Java code

```java title="Approach 1: find the length, then plain base 26 inside the block"
class Solution {
    public String convertToTitle(int columnNumber) {
        long rank = columnNumber - 1L;   // 0-based position among all labels
        long block = 26;                 // how many labels have the current length
        int length = 1;
        while (rank >= block) {
            rank -= block;
            block *= 26;                 // reaches 26^7 > 2^31 - 1: needs a long
            length++;
        }
        char[] title = new char[length];
        for (int i = length - 1; i >= 0; i--) {
            title[i] = (char) ('A' + rank % 26);
            rank /= 26;
        }
        return new String(title);
    }
}
```

#### Time complexity

**O(L)**, where L is the length of the label, which is O(log₂₆ n) for n = `columnNumber`. Both loops run L times; L ≤ 7 for the given range.

#### Space complexity

**O(1) auxiliary space** besides the L-character output.

#### The bridge to the next approach

> "This works, but it needs the block sizes and a `long`: with `int`, `block` overflows when it reaches 26^7, and running that version on 321272407, the first seven-letter column, returns `AA;,16?>/` instead of `AAAAAAA`. The derivation gave a simpler route: subtract one at every step, and the remainder and quotient come out right without counting blocks."

### Approach 2: Subtract one, then divide (bijective base 26)

#### What I say out loud

> "Letters are digits 1 to 26. If I subtract 1 first, the last digit becomes 0 to 25, so `(n − 1) % 26` is the last letter and `(n − 1) / 26` is the number for the remaining letters. I repeat until it hits 0 and reverse at the end."

#### Intuition

The derivation in this section: shifting the last digit down by one turns one step of bijective base 26 into one step of ordinary base 26. The shift has to be repeated at every step because every position, not only the last, has digits 1 to 26.

#### Algorithm

1. Create an empty `StringBuilder`.
2. While `n > 0`: `n--`; append `'A' + n % 26`; `n /= 26`.
3. Reverse the builder and return it.

#### Why it is correct

- **Each step is right.** By the identity n − 1 = (d_0 − 1) + 26 × (rest), the appended letter is the last letter of the label and the new `n` is the number represented by the remaining letters.
- **It stops at the right time.** The remaining letters represent 0 exactly when there are none left (every label of at least one letter represents at least 1), so the loop ends after the first letter.
- **It never overflows.** `n` only decreases, starting from at most 2^31 − 1, and `n--` runs only when `n ≥ 1`.
- **It terminates.** Each step replaces n by (n − 1) / 26, which is less than n.

The 20-second version: "Column labels are base 26 with digits 1 to 26 instead of 0 to 25. Subtracting one before each step shifts the last digit into 0 to 25, so the remainder is the letter and the quotient is the rest of the label."

#### Dry run

`n = 701`

| n before | n − 1 | (n − 1) % 26 | Letter | (n − 1) / 26 | Builder |
|---|---|---|---|---|---|
| 701 | 700 | 24 | `Y` | 26 | `Y` |
| 26 | 25 | 25 | `Z` | 0 | `YZ` |

Reversed: `ZY`.

`n = 52`, the case the buggy variants get wrong:

| n before | n − 1 | (n − 1) % 26 | Letter | (n − 1) / 26 | Builder |
|---|---|---|---|---|---|
| 52 | 51 | 25 | `Z` | 1 | `Z` |
| 1 | 0 | 0 | `A` | 0 | `ZA` |

Reversed: `AZ`. The variant without the second subtraction divides 52 by 26 and continues with 2, which gives `B` instead of `A`.

#### Java code

```java title="Approach 2: subtract one, then divide (recommended)"
class Solution {
    public String convertToTitle(int columnNumber) {
        StringBuilder title = new StringBuilder();
        int n = columnNumber;
        while (n > 0) {
            n--;                                   // letters are 1..26; shift to 0..25
            title.append((char) ('A' + n % 26));   // last letter
            n /= 26;                               // the number for the remaining letters
        }
        return title.reverse().toString();
    }
}
```

#### Time complexity

**O(L) = O(log₂₆ n)**, where n = `columnNumber` and L is the label length (at most 7). Each iteration does constant work and removes one letter; the reverse is O(L).

#### Space complexity

**O(1) auxiliary space** besides the L-character output (the builder holds the output itself).

### Alternative: recursion

`return n == 0 ? "" : convertToTitle((n - 1) / 26) + (char) ('A' + (n - 1) % 26);` is the same identity written recursively, with no reverse. The recursion depth is at most 7 and the concatenations copy at most 7 characters, so it is fine here; mention it as a compact equivalent.

## 5. Comparison table

n = `columnNumber`, L = the length of the label = O(log₂₆ n), at most 7. Nothing hashes, so expected and worst case are the same.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Count labels by length | O(L) | O(L) | O(1) beyond the output |
| 2. Subtract one, then divide | O(L) | O(L) | O(1) beyond the output |
| Alt. Recursion | O(L^2) character copies, L ≤ 7 | O(L^2) | O(L) stack |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Count by length | Explains the structure (blocks of 26^L); easy to adapt to "the k-th string of length L" | Needs `long` for the block size; two loops | When asked to explain the ordering, or as a cross-check |
| 2. Subtract one | Shortest; no overflow risk | The `n--` looks like magic unless you derive it | The default answer, with the derivation |
| Alt. Recursion | One line | String concatenation per level | As a mention |

## 6. Which solution to give, and when to stop optimizing

Give Approach 2, together with the derivation (letters are digits 1 to 26; subtracting one turns each step into ordinary division). That derivation is what the interviewer is listening for. It is optimal: the output has L letters and each takes O(1). Stop there and spend the remaining time testing 26, 52, 702 and 703 out loud.

## 7. Interview script: code it and test it

### What I say while coding

> "`n--` comes first inside the loop, every iteration, not once before it."

> "The letter is `'A' + n % 26` after the decrement, so it ranges over `A` to `Z`."

> "I build the letters from the right, so I reverse at the end."

### Testing out loud

**Normal case:** 701 as in the dry run: `ZY`.

**A multiple of 26:** 26. `n--` gives 25, letter `Z`, `n = 25 / 26 = 0`. Returns `Z`.

**A label with a `Z` in the middle of the computation:** 52, as in the dry run: `AZ`.

**First label of a new length:** 703. 702 % 26 = 0 → `A`, n = 27; 26 % 26 = 0 → `A`, n = 1; 0 % 26 = 0 → `A`, n = 0. Returns `AAA`.

**Smallest and largest:** 1 → `A`. 2147483647 → `FXSHRXW` (7 letters); `n` only shrinks, so nothing overflows.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1–2 min | No zero letter; the range of n |
| Derive | 3–4 min | Why plain base 26 fails at 26; the n − 1 identity |
| Code | 2 min | Approach 2 |
| Test | 3 min | 1, 26, 27, 52, 701, 703 |

The time should go into the derivation and the multiples-of-26 tests. If stuck, write the labels for 25 to 28 and 51 to 53 by hand and compare them with what `n % 26` gives.

## 9. Interviewer challenges

### About the method

#### Why do you subtract one inside the loop and not just once at the start?

**What they are testing:** whether you understand the derivation or memorized the line.

**How to reason:** which positions have digits 1 to 26?

**What I say:** "Every position does, not only the last one. After one step, `(n − 1) / 26` is again a number whose label uses digits 1 to 26, so the same shift is needed again. Subtracting only once gives `AZY` for 701 instead of `ZY`, because the 26 hidden in the `Z` is never taken out of the quotient."

**Nuance:** in ordinary base b, the loop is `n % b`, `n /= b`. Bijective base b is the same loop with `n--` in front.

#### What is the reverse direction, label to number?

**What they are testing:** whether the bijective base view works both ways.

**How to reason:** Horner's rule with digits 1 to 26.

**What I say:** "`n = 0`, then for each letter `n = n * 26 + (c - 'A' + 1)`. No adjustment is needed in this direction, because each letter's value is already 1 to 26. For labels up to `FXSHRXW` the result fits in an `int`."

**Nuance:** this is a good test oracle: convert to a label and back, and check you get the original number.

### About implementation

#### Can your code overflow?

**What they are testing:** whether you check bounds against the actual constraint.

**How to reason:** look at every arithmetic operation.

**What I say:** "Approach 2 only decrements a positive number and divides, so every value is between 0 and the input. Approach 1 multiplies a block size by 26 and reaches 26^7 ≈ 8.0 × 10^9, which is why it uses `long`; with `int` the block size wraps negative and the output for 321272407 is garbage."

**Nuance:** "only divides and decrements" is a quick, reliable way to argue that no overflow is possible.

## 10. Follow-up questions the interviewer might ask

**"Convert a column label back to a number."**
Horner's rule: `n = n * 26 + (c - 'A' + 1)` for each letter. O(L) time, O(1) space. The result fits in an `int` for every label up to `FXSHRXW` (2^31 − 1); labels beyond it, such as `FXSHRXX` or any eight-letter label, need a `long`.

**"Generalize to an alphabet of k symbols."**
Replace 26 by k: `n--`, symbol `n % k`, `n /= k`. O(log_k n) time. For k = 1 it degenerates to unary: n copies of the single symbol, and the loop runs n times.

**"Return the label for 0-based column indices instead."**
Then the first step has no shift but later steps still do: call the 1-based function with `index + 1`. Mixing the two conventions is the most common source of off-by-one errors here.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Treating it as ordinary base 26.** Plain `n % 26` maps 26 to `BA` (with `A` as 0) or to `A@` (with `- 1` on the letter). There is no zero letter.
- **Testing only the given examples.** All the buggy variants in section 4 return `AB` for 28. Multiples of 26 (26, 52, 702) expose them.

### Implementation mistakes

> [!MISTAKE] Fixing the letter but not the quotient
> `'A' + (n - 1) % 26` followed by `n /= 26` gives the right last letter, but the quotient is one too large whenever that letter is `Z`. Running it: 26 returns `AZ`, 701 returns `AZY`, 702 returns `AAZ`.

- **Subtracting `1` from the character instead of from `n`.** `'A' + n % 26 - 1` produces `@` for every multiple of 26 (26 → `A@`).
- **Forgetting to reverse.** The letters come out least significant first: 28 would give `BA`.
- **Using `int` for the block size in Approach 1.** It overflows at 26^7; 321272407 returns `AA;,16?>/`.

## 12. Pattern recognition

**The pattern:** base conversion by repeated division, adapted to a number system whose digits are 1 to b (bijective base b).

**Signals in the problem statement:**

- A sequence of labels that rolls over like an odometer (`Z` → `AA`) but has no symbol for zero.
- A conversion between an integer and a string of symbols.

**Related problems in this list:**

- [[nc-roman-to-integer|Roman to Integer]]: another symbol format, converted in the opposite direction.
- [[nc-plus-one|Plus One]]: digits processed from the least significant end with a carry; adding one to a label is the same odometer with `Z` playing the role of 9.
- [[nc-add-binary|Add Binary]]: digit-by-digit work in a base other than 10.
- [[cses-digit-queries|Digit Queries]]: counting by blocks of equal length, the idea behind Approach 1.

**Takeaway:** before reusing a standard conversion, check what the digits range over. If there is no zero digit, subtract one before each `%` and `/`.

## 13. 60-second revision card

**Key insight:** letters are digits 1 to 26; n − 1 = (last digit − 1) + 26 × (rest), so subtract one, then use `%` and `/`.

**Invariant:** after each iteration, `n` is the number whose label is the letters not yet produced.

**Complexity:** O(log₂₆ n) time (at most 7 iterations), O(1) space beyond the output.

**Code skeleton:**

```java title="Column title in six lines" fragment="public String convertToTitle(int columnNumber)"
StringBuilder title = new StringBuilder();
for (int n = columnNumber; n > 0; n /= 26) {
    n--;
    title.append((char) ('A' + n % 26));
}
return title.reverse().toString();
```

**Main traps:**

- `n--` on every iteration, before both `%` and `/`.
- Test 26 (`Z`), 52 (`AZ`), 702 (`ZZ`), 703 (`AAA`).
- Reverse at the end.

**What to say in one breath:** "Column labels are base 26 with digits 1 to 26, so there's no zero. Subtracting one before each step makes the remainder 0 to 25, which is the letter, and the quotient is the number for the remaining letters. O(log n) time, and nothing can overflow because n only shrinks."
