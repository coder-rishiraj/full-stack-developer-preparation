---
problemId: nc-roman-to-integer
title: Roman to Integer
source: neetcode
sourceUrl: https://leetcode.com/problems/roman-to-integer/
difficulty: easy
patterns: [math-geometry, strings]
relatedLessons: [a2-array-string-traversal, a1-strings-stringbuilder, a14-edge-cases, a14-clarifying-requirements]
companies: []
timeToSolve: 10
---

## 1. Problem restatement

You get a string `s` written in Roman numerals and must return the integer it stands for. The seven symbols are `I` = 1, `V` = 5, `X` = 10, `L` = 50, `C` = 100, `D` = 500 and `M` = 1000. Normally the symbols are written from largest to smallest and simply added. Six combinations are written the other way round and mean a subtraction: `IV` = 4, `IX` = 9, `XL` = 40, `XC` = 90, `CD` = 400 and `CM` = 900.

**Example 1**

- Input: `s = "LVIII"`
- Output: `58`
- Why: the symbols never increase from left to right, so everything is added: 50 + 5 + 1 + 1 + 1 = 58.

**Example 2**

- Input: `s = "MCMXCIV"`
- Output: `1994`
- Why: it splits into `M` = 1000, `CM` = 900, `XC` = 90 and `IV` = 4, and 1000 + 900 + 90 + 4 = 1994.

**What the problem statement guarantees**

- 1 ≤ `s.length` ≤ 15.
- `s` contains only the characters `I`, `V`, `X`, `L`, `C`, `D` and `M`.
- `s` is a valid Roman numeral, and its value lies between 1 and 3999.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The code is short, so the interview is really about how precisely you turn the rules into a loop and how you test the awkward inputs. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 10 minutes and talk out loud.
2. Convert `MCMXCIV`, `XLIX` and `MMMDCCCLXXXVIII` by hand, and notice what you look at to decide whether a symbol is added or subtracted.
3. Write the code, then trace it on `III`, `IV` and `MCMXCIV`.
4. State the time and space, and say what you would do with an invalid numeral.

Open a hint only after a minute without progress.

> [!HINT] Hint 1: a small nudge
> When you convert by hand, how do you know that the `C` in `MCM` is worth −100 and not +100? Which other symbol did you have to look at?

> [!HINT] Hint 2: the kind of tool you need
> One pass over the string is enough. For each symbol you need its value and the value of at most one neighbouring symbol. A fixed lookup from symbol to value does the rest.

> [!HINT] Hint 3: almost the whole plan
> Walk left to right. If the current symbol is worth less than the symbol right after it, subtract it; otherwise add it. The last symbol has no right neighbour, so it is always added. Check this rule against `MCMXCIV` before you code it.

**Check yourself before revealing the walkthrough**

- [ ] My code returns 3 for `III`, 4 for `IV`, 9 for `IX` and 1994 for `MCMXCIV`
- [ ] The last character is counted, and I never read past the end of the string
- [ ] Equal neighbours (`II`, `XX`, `CC`) are added, not subtracted
- [ ] I can explain why my rule gives the right answer for every valid numeral, not only the examples

## 3. Interview script: understand the problem (≈1–2 min)

**Me:** Let me say it back. I get a Roman numeral as a string and return its integer value. Symbols are normally added, except in the six subtractive pairs, `IV`, `IX`, `XL`, `XC`, `CD` and `CM`, where the smaller symbol in front is subtracted.

**Interviewer:** Right.

**Me:** Is the input always a valid numeral? For example, could I get `IIII`, `IL` or `VX`?

**Interviewer:** It is guaranteed valid, between 1 and 3999.

**Me:** Good, then I won't validate. I'll mention afterwards how I'd add validation. And it's uppercase only, no spaces?

**Interviewer:** Only the seven uppercase symbols, length 1 to 15.

**Me:** Let me do `MCMXCIV` by hand. `M` is 1000. Then `C` followed by `M`: a smaller symbol before a larger one, so that's 900 together. `X` before `C` is 90, `I` before `V` is 4. Total 1994. What told me to subtract was always the symbol to the right being bigger.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ `s.length` ≤ 15 | The string is never empty, and any linear or even quadratic method is instant. The interest is in correctness, not speed. |
| Only `I V X L C D M` | A seven-entry lookup covers every character. No lowercase or other characters to handle. |
| Valid numeral with value 1 to 3999 | The answer fits easily in an `int`. Validity means a smaller symbol appears before a larger one only in the six subtractive pairs, which is exactly what makes a simple rule correct (section 4). |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| No validation needed | I trust the input. An invalid string such as `IIV` still produces some number, and I'll say so rather than pretend the code rejects it. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| An unknown character is a programming error | The statement rules it out, so my lookup throws instead of silently returning 0, which would hide a bug. |

### Edge cases I will keep in mind

- One symbol: `I` gives 1, `M` gives 1000. The single symbol has no neighbour and must still be counted.
- A numeral that ends in a subtractive pair: `IV`, `MCMXCIV`. The pair's second symbol is the last character.
- Repeated symbols: `III`, `MMM`. Equal neighbours are added.
- The longest valid numeral: `MMMDCCCLXXXVIII` = 3888, 15 characters.

## 4. Think out loud: from first idea to best solution

Both approaches below are linear. The first follows the statement literally (read tokens of one or two characters); the second notices that a single comparison captures all six special cases.

### Approach 1: Read the numeral as tokens

#### What I say out loud

> "The statement lists six two-character tokens with their own values. So I can scan left to right, and at each position first check whether the next two characters form one of those six pairs. If they do, I add the pair's value and skip both. Otherwise I add the single symbol's value."

#### Intuition

A valid numeral is a sequence of tokens, each either one symbol or one of the six subtractive pairs, and its value is the sum of the token values. Reading greedily, two characters at a time when they form a pair, splits the string into exactly those tokens.

#### Algorithm

1. Set `total = 0` and `i = 0`.
2. While `i < s.length()`:
   - if `i + 1 < s.length()` and `s[i..i+1]` is one of `IV IX XL XC CD CM`, add its value (4, 9, 40, 90, 400, 900) and set `i += 2`;
   - otherwise add the value of `s[i]` and set `i += 1`.
3. Return `total`.

#### Why it is correct

- **It reads the intended tokens.** In a valid numeral, the two characters of a subtractive pair always belong together: a smaller symbol followed by a larger one can mean nothing else. Two consecutive characters that are not one of the six pairs never form a token, so reading one symbol is right.
- **It adds each character exactly once.** `i` moves past every character it consumes, by 1 or 2, so no character is skipped or counted twice.
- **It never reads past the end.** The pair check is guarded by `i + 1 < s.length()`.

#### Dry run

`s = "MCMXCIV"`

| i | Next two characters | Token read | total |
|---|---|---|---|
| 0 | `MC` (not a pair) | `M` = 1000 | 1000 |
| 1 | `CM` | `CM` = 900 | 1900 |
| 3 | `XC` | `XC` = 90 | 1990 |
| 5 | `IV` | `IV` = 4 | 1994 |
| 7 | — | loop ends | 1994 |

Returns 1994.

#### Java code

```java title="Approach 1: tokens of one or two characters"
class Solution {
    public int romanToInt(String s) {
        int total = 0;
        int i = 0;
        while (i < s.length()) {
            if (i + 1 < s.length()) {
                int pair = pairValue(s.substring(i, i + 2));
                if (pair > 0) {          // one of the six subtractive pairs
                    total += pair;
                    i += 2;
                    continue;
                }
            }
            total += value(s.charAt(i));
            i++;
        }
        return total;
    }

    private static int pairValue(String two) {
        switch (two) {
            case "IV": return 4;
            case "IX": return 9;
            case "XL": return 40;
            case "XC": return 90;
            case "CD": return 400;
            case "CM": return 900;
            default: return 0;           // not a subtractive pair
        }
    }

    private static int value(char c) {
        switch (c) {
            case 'I': return 1;
            case 'V': return 5;
            case 'X': return 10;
            case 'L': return 50;
            case 'C': return 100;
            case 'D': return 500;
            case 'M': return 1000;
            default: throw new IllegalArgumentException("not a Roman symbol: " + c);
        }
    }
}
```

#### Time complexity

**O(n)**, where n = `s.length()` (at most 15). Each loop iteration consumes one or two characters, so there are at most n iterations, and each does a constant amount of work: `substring(i, i + 2)` copies two characters, and a `switch` on a string of length 2 hashes two characters.

#### Space complexity

**O(1) auxiliary space.** Each iteration creates one two-character string, which is garbage right after the check; at any moment only a constant amount of extra memory is live.

#### The bridge to the next approach

> "This works, but it hard-codes six special cases. Looking at them, they all have the same shape: a symbol followed by a larger one. So instead of listing pairs, I can compare each symbol with its right neighbour and decide its sign from that. That removes the pair table and the two-step jump."

### Approach 2: Compare each symbol with the next one

#### What I say out loud

> "Every subtractive pair is a smaller symbol followed by a larger one, and that never happens anywhere else in a valid numeral. So each symbol's sign depends only on its right neighbour: if the neighbour is bigger, subtract; otherwise add. One pass, one comparison per character."

#### Intuition

`CM` = 900 is the same as −100 + 1000. So instead of valuing the pair as a whole, give the `C` a minus sign and the `M` its usual plus sign. A symbol gets a minus sign exactly when a larger symbol comes right after it.

#### Algorithm

1. Set `total = 0`.
2. For each index `i` from 0 to n − 1, let `v` be the value of `s[i]`:
   - if `i + 1 < n` and `v < value(s[i + 1])`, subtract `v`;
   - otherwise add `v`.
3. Return `total`.

#### Why it is correct

Split the valid numeral into its tokens as in Approach 1, and compare the signs this rule gives with the token values.

- **A single-symbol token** is added. Its right neighbour is either the end of the string or the first symbol of the next token. In a valid numeral the tokens are written in non-increasing order of value, and the next token's first symbol is never larger than the current symbol (`MC`, `XV`, `II` are fine; `IM` would not be valid). So the rule adds it, which is correct.
- **A pair `ab`** (such as `CM`) has `value(a) < value(b)`, so `a` is subtracted. `b` is followed by the end or by a smaller symbol (in `MCMXCIV`, the `M` of `CM` is followed by `X`), so `b` is added. The pair contributes `value(b) − value(a)`, its correct value: 1000 − 100 = 900.

So the signed sum equals the sum of the token values. The strict `<` matters: equal neighbours, as in `II`, are both added.

The 20-second version: "A smaller symbol before a larger one only happens in the six subtractive pairs, and there the smaller one should count as negative. So each symbol's sign is decided by its right neighbour, and the last symbol is always positive."

#### Dry run

`s = "MCMXCIV"`

| i | Symbol | Value | Next value | Action | total |
|---|---|---|---|---|---|
| 0 | M | 1000 | 100 | add | 1000 |
| 1 | C | 100 | 1000 | subtract | 900 |
| 2 | M | 1000 | 10 | add | 1900 |
| 3 | X | 10 | 100 | subtract | 1890 |
| 4 | C | 100 | 1 | add | 1990 |
| 5 | I | 1 | 5 | subtract | 1989 |
| 6 | V | 5 | none | add | 1994 |

Returns 1994. The running total dips below the final value of each pair (900 before the `M` arrives), which is fine: only the final sum matters.

#### Java code

```java title="Approach 2: sign from the right neighbour (recommended)"
class Solution {
    public int romanToInt(String s) {
        int total = 0;
        int n = s.length();
        for (int i = 0; i < n; i++) {
            int v = value(s.charAt(i));
            if (i + 1 < n && v < value(s.charAt(i + 1))) {
                total -= v;              // smaller before larger: the subtractive part of a pair
            } else {
                total += v;
            }
        }
        return total;
    }

    private static int value(char c) {
        switch (c) {
            case 'I': return 1;
            case 'V': return 5;
            case 'X': return 10;
            case 'L': return 50;
            case 'C': return 100;
            case 'D': return 500;
            case 'M': return 1000;
            default: throw new IllegalArgumentException("not a Roman symbol: " + c);
        }
    }
}
```

#### Time complexity

**O(n)**, where n = `s.length()`. One iteration per character, each with at most two constant-time lookups. Since n ≤ 15 the running time is a few dozen operations.

#### Space complexity

**O(1) auxiliary space**: the total and the loop index.

### Alternative: scan right to left

Walk from the last character to the first, remembering the value of the symbol just processed (`prev`). Add the current value if it is at least `prev`, otherwise subtract it. It is the same rule seen from the other side, with no `i + 1 < n` bound check, because the first symbol processed (the last character) has no right neighbour and `prev` starts at 0. Some people find it cleaner; neither is faster.

## 5. Comparison table

n = `s.length()`, at most 15. Nothing hashes in a way that depends on the input size (the string `switch` hashes a two-character string), so expected and worst case are the same.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Tokens of one or two characters | O(n) | O(n) | O(1) |
| 2. Sign from the right neighbour | O(n) | O(n) | O(1) |
| Alt. Right to left with `prev` | O(n) | O(n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Tokens | Mirrors the statement; easy to extend with validation of tokens | Six special cases to type and get right; an index that moves by 1 or 2 | When you want to validate the numeral, or as a first idea to say out loud |
| 2. Right neighbour | One rule instead of six cases; shortest code | Needs the correctness argument to be convincing | The default answer |
| Alt. Right to left | No bounds check on the neighbour | Same idea, slightly less natural to read | If you prefer it; mention as equivalent |

## 6. Which solution to give, and when to stop optimizing

Give Approach 2, with the 20-second argument for why the neighbour comparison reproduces the six subtractive pairs. It is optimal: the answer depends on every character (changing any one symbol changes the value), so a correct algorithm must read all n characters, and Approach 2 reads each once. With n ≤ 15 there is nothing to optimize; spend the time on the traces in section 7 and on the validation follow-up.

## 7. Interview script: code it and test it

### What I say while coding

> "First the lookup: a `switch` from character to value. I throw on anything else, because the statement rules it out and a silent 0 would hide a bug."

> "The loop goes over every index, including the last. The neighbour check is `i + 1 < n` first, so I never read past the end."

> "Strict `<`: equal symbols like `II` are added."

### Testing out loud

**Normal case:** `MCMXCIV` as in the dry run: 1000 − 100 + 1000 − 10 + 100 − 1 + 5 = 1994.

**One symbol:** `M`. `i = 0`, no neighbour, add 1000. Returns 1000.

**Ends with a pair:** `IV`. `I` (1) before `V` (5): subtract, total −1. `V` has no neighbour: add, total 4. Correct.

**Repeated symbols:** `III`. Each `I` is followed by an equal `I` or by nothing, so all three are added: 3. With `<=` instead of `<` this would be −1 + −1 + 1 = −1 (section 11).

**Longest input:** `MMMDCCCLXXXVIII`. The values never increase from left to right, so everything is added: 3000 + 500 + 300 + 50 + 30 + 5 + 3 = 3888.

## 8. Time plan for the interview

A warm-up, usually expected in about 10 minutes.

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1 min | Valid input, value range, uppercase only |
| Hand example and the rule | 2 min | `MCMXCIV` by hand; state "smaller before larger means subtract" and why |
| Code | 3 min | Approach 2 |
| Test | 2–3 min | `III`, `IV`, `M`, `MCMXCIV` |
| Follow-ups | rest | Validation, Integer to Roman |

The time should go into the correctness argument and the traces. If stuck, convert two numerals by hand and say aloud what made you subtract.

## 9. Interviewer challenges

### About correctness

#### Why is comparing with only the next symbol enough?

**What they are testing:** whether you can justify the rule, not just recall it.

**How to reason:** the only places where a smaller symbol precedes a larger one in a valid numeral are the six pairs. Check what the rule does inside a pair and at the boundary after it.

**What I say:** "In a valid numeral the values never go up from one token to the next, so outside a subtractive pair a symbol is never followed by a larger one. Inside a pair the first symbol is smaller, gets a minus, and the second gets a plus, which is exactly the pair's value. So the signed sum equals the token sum."

**Nuance:** the argument depends on validity. For an invalid string the rule still returns a number, which leads to the next challenge.

#### What does your code return for an invalid numeral like `IIV` or `IM`?

**What they are testing:** whether you know the limits of your guarantee.

**How to reason:** run the rule. `IIV`: `I` before `I` is added (+1), `I` before `V` is subtracted (−1), `V` is added (+5): 5. `IM`: −1 + 1000 = 999.

**What I say:** "It returns 5 and 999. It doesn't reject them, because the statement promises valid input. If I had to validate, the simplest reliable check is to convert the result back to Roman with the standard greedy method and compare with the input; a valid numeral round-trips exactly."

**Nuance:** writing the validity rules directly (at most three repeats, `V L D` never repeated, only the six pairs) is possible but error-prone; the round trip reuses code you trust.

### About implementation

#### Would a `HashMap<Character, Integer>` be better than a `switch`?

**What they are testing:** judgement about data structures for a tiny fixed mapping.

**How to reason:** seven fixed keys. Both are constant time per lookup.

**What I say:** "Either works. The `switch` (or an `int[]` indexed by character) avoids boxing and hashing and fails loudly on an unknown character. A `HashMap` reads nicely but `get` returns `null` for an unknown key, which unboxes to a `NullPointerException`. For seven keys I'd use the `switch` or an array."

**Nuance:** an `int[128]` table indexed by the character is the fastest of the three and still one line per symbol to fill.

## 10. Follow-up questions the interviewer might ask

**"Convert an integer between 1 and 3999 to Roman."**
Greedy over the 13 tokens in decreasing value (`M 1000, CM 900, D 500, CD 400, C 100, XC 90, L 50, XL 40, X 10, IX 9, V 5, IV 4, I 1`): while the number is at least a token's value, append it and subtract. O(1) for this bounded range (at most 15 symbols appended), O(1) extra space besides the output.

**"Validate the input and reject invalid numerals."**
Convert with Approach 2, then convert the result back with the greedy above and compare the strings. A valid numeral is the unique greedy representation of its value, so the strings match exactly when the input is valid. O(n) time.

**"What if the numeral could be very long, with values beyond 3999 written as many `M`s?"**
The algorithm is unchanged, still O(n), but the total needs a `long` (or `BigInteger`) once n × 1000 can exceed 2^31 − 1, that is for strings longer than about 2.1 million characters.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Trying to special-case all six pairs and forgetting one.** If you go the token route, list the pairs from the statement, do not recall them from memory. The neighbour rule avoids the list entirely.
- **Assuming the running total is always the value of the prefix read so far.** In Approach 2 it is not (it is 900 after `MC`, before the `M` arrives), which is fine; only the final sum is meaningful.

### Implementation mistakes

> [!MISTAKE] Using `<=` instead of `<`
> With `v <= value(s.charAt(i + 1))` equal neighbours are subtracted. Running it: `III` returns −1 instead of 3, and `LVIII` returns 54 instead of 58. Only strictly smaller symbols are subtracted.

- **Looping to `n − 1` to avoid the bounds check.** That drops the last symbol. Running it: `III` returns 2, `MCMXCIV` returns 1989, and `IV` returns −1.
- **Reading `s.charAt(i + 1)` before checking `i + 1 < n`.** The order of the two conditions matters; the wrong order throws `StringIndexOutOfBoundsException` on the last character.
- **Returning 0 for an unknown character.** It hides a bug in the caller; throw instead.

## 12. Pattern recognition

**The pattern:** scan a symbol string once and let a small, local rule decide each symbol's contribution: here the sign from the right neighbour.

**Signals in the problem statement:**

- A fixed alphabet with fixed values, and a rule that refers to adjacent symbols ("before", "after").
- A conversion from one number format to another, with no search or optimization involved.

**Related problems in this list:**

- [[nc-excel-sheet-column-title|Excel Sheet Column Title]]: the conversion in the other direction for a different format, where the trap is a number system with no zero digit.
- [[nc-plus-one|Plus One]]: digits stored as symbols, processed from the least significant end with a carry.
- [[nc-add-binary|Add Binary]]: digit-by-digit arithmetic on a string representation.
- [[nc-multiply-strings|Multiply Strings]]: the harder relative, where whole arithmetic is done on digit strings.

**Takeaway:** when a format has special cases, look for the one structural property they all share (here: smaller before larger) and turn it into a single local rule.

## 13. 60-second revision card

**Key insight:** a symbol is subtracted exactly when a larger symbol comes right after it.

**Invariant:** after index `i`, `total` is the signed sum of the first `i + 1` symbols, each sign decided by its right neighbour.

**Complexity:** O(n) time, O(1) space, n ≤ 15.

**Code skeleton:**

```java title="Roman to integer in one loop" fragment="public int romanToInt(String s)"
String symbols = "IVXLCDM";
int[] values = {1, 5, 10, 50, 100, 500, 1000};
int total = 0;
for (int i = 0; i < s.length(); i++) {
    int v = values[symbols.indexOf(s.charAt(i))];
    boolean smallerThanNext = i + 1 < s.length() && v < values[symbols.indexOf(s.charAt(i + 1))];
    total += smallerThanNext ? -v : v;
}
return total;
```

**Main traps:**

- Strict `<`: `III` is 3, not −1.
- The last symbol is always added; do not stop the loop early.
- Check `i + 1 < n` before reading the neighbour.

**What to say in one breath:** "In a valid numeral a smaller symbol comes before a larger one only in the six subtractive pairs, so I subtract a symbol when its right neighbour is larger and add it otherwise. One pass, O(n) time, O(1) space."
