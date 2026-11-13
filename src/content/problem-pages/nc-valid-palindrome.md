---
problemId: nc-valid-palindrome
title: Valid Palindrome
source: neetcode
sourceUrl: https://leetcode.com/problems/valid-palindrome/
difficulty: easy
patterns: [two-pointers]
relatedLessons: [a2-two-pointers, a1-strings-stringbuilder, a2-array-string-traversal, a14-edge-cases]
companies: []
timeToSolve: 10
---

## 1. Problem restatement

You get a string `s`. Turn every uppercase letter into lowercase and throw away every character that is not a letter or a digit. If what remains reads the same forwards and backwards, return `true`; otherwise return `false`.

**Example 1**

- Input: `s = "A man, a plan, a canal: Panama"`
- Output: `true`
- Why: keeping only letters and digits, in lowercase, gives `amanaplanacanalpanama`, which is the same reversed.

**Example 2**

- Input: `s = "race a car"`
- Output: `false`
- Why: the cleaned string is `raceacar`. Reversed it is `racaecar`; they differ at the fourth character (`e` against `a`).

**Example 3**

- Input: `s = " "`
- Output: `true`
- Why: after removing the space nothing is left, and the empty string reads the same both ways.

**What the problem statement guarantees**

- 1 ≤ `s.length` ≤ 2 × 10^5.
- `s` consists only of printable ASCII characters (codes 32 to 126): letters, digits, the space and punctuation.
- "Alphanumeric" means letters and digits. Case does not matter for letters; digits are kept as they are.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The idea comes quickly; the marks are in getting the skipping right without running off the end of the string. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 10 minutes and talk out loud.
2. Write the simplest correct version first, and say what it costs in memory.
3. Then try to do it without building any new string.
4. Trace your code on `"race a car"`, on `".,"` and on `"0P"`.

> [!HINT] Hint 1: a small nudge
> Cleaning the string first and then checking it is correct. What does the cleaning cost you in memory, and do you actually need the cleaned string, or only to compare characters of it?

> [!HINT] Hint 2: the kind of tool you need
> A palindrome check compares the first character with the last, the second with the second-to-last, and so on. Can you find "the next character that counts" from each end of the original string as you go, without building anything?

> [!HINT] Hint 3: almost the whole plan
> Put one index at the start and one at the end. Move the left one right past anything that is not a letter or digit, and the right one left in the same way, never letting them cross. Compare the two characters ignoring case: if they differ, the answer is false; otherwise step both inward and repeat. What must your skipping loops check so that a string made only of punctuation does not crash?

**Check yourself before revealing the walkthrough**

- [ ] My method returns `true` for `" "` and for `".,"`
- [ ] It returns `false` for `"0P"`
- [ ] It never reads an index outside the string
- [ ] I can say how much extra memory it uses, and why

## 3. Interview script: understand the problem (≈2 min)

**Me:** So I ignore everything that isn't a letter or a digit, compare letters case-insensitively, and check whether what's left is a palindrome.

**Interviewer:** Yes.

**Me:** Digits count, and they're compared exactly. So `"0P"` is two different characters, `0` and `p`, and that's false.

**Interviewer:** Right.

**Me:** The input is printable ASCII, up to 2 × 10^5 characters. That tells me "letter" means `A` to `Z` and `a` to `z`, and "digit" means `0` to `9`. Java's `Character.isLetterOrDigit` also accepts letters from other scripts, but on printable ASCII it gives exactly those 62 characters, so I can use it here. If the input could contain other characters, I'd want to ask what counts.

**Interviewer:** Assume what the constraints say.

**Me:** And if nothing alphanumeric is left, for example `" "` or `".,"`, the cleaned string is empty and that's a palindrome, so true.

**Interviewer:** Correct.

**Me:** Let me do `"race a car"` by hand. From the outside: `r`/`r`, `a`/`a`, `c`/`c`. Then the left side is at `e`; the right side is at a space, so I skip it and land on `a`. `e` against `a` differ, so false.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 2 × 10^5 | Linear time is required in practice; O(n²) would be about 4 × 10^10 steps. Indices fit in an `int`. |
| Printable ASCII only | "Alphanumeric" is exactly `A–Z`, `a–z`, `0–9`, and `Character.isLetterOrDigit` agrees with an explicit range check on these characters. `Character.toLowerCase` maps `A–Z` to `a–z` and leaves every other printable ASCII character unchanged. |
| Letters compared ignoring case; digits kept | Lower-case both sides before comparing. Never use a "differ by 32" shortcut: `'0'` (48) and `'P'` (80) differ by 32 too. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Stick to the constraints: printable ASCII | I can use `Character.isLetterOrDigit` and `Character.toLowerCase` without discussing Unicode letters. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| An empty cleaned string counts as a palindrome | It reads the same both ways; Example 3 confirms it. I state it because the two-pointer loop gives it for free and I want that to be a decision, not an accident. |

### Edge cases I will keep in mind

- Only punctuation or spaces, such as `" "` or `".,"`: true, and the pointers must not run off the string.
- One character: true.
- Mixed case, such as `"Aa"`: true.
- A digit next to a letter, `"0P"`: false.
- Non-alphanumerics only on one side, such as `"a."`.

## 4. Think out loud: from first idea to best solution

### Approach 1: Build the cleaned string, then compare with its reverse

#### What I say out loud

> "The direct translation of the statement: build a new string with only the letters and digits, lower-cased, then check it equals its reverse. That's O(n) time, and it's hard to get wrong. The cost is O(n) extra memory for the cleaned string and its reversed copy."

#### Intuition

The statement defines the answer in terms of a cleaned string, so build that string and test the definition directly.

#### Algorithm

1. For each character of `s`: if it is a letter or digit, append its lowercase form to a `StringBuilder`.
2. Return whether the cleaned string equals its reverse.

#### Why it is correct

The builder holds exactly the cleaned string the statement describes, and a string is a palindrome exactly when it equals its reverse. No other reasoning is involved.

#### Dry run

`s = "A man, a plan, a canal: Panama"`

| Step | Result |
|---|---|
| Keep letters and digits, lower-cased | `amanaplanacanalpanama` (21 characters) |
| Reverse | `amanaplanacanalpanama` |
| Equal? | yes, return `true` |

#### Java code

```java title="Approach 1: cleaned string compared with its reverse"
class Solution {
    public boolean isPalindrome(String s) {
        StringBuilder cleaned = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (Character.isLetterOrDigit(c)) {
                cleaned.append(Character.toLowerCase(c));
            }
        }
        String forward = cleaned.toString();
        return forward.equals(cleaned.reverse().toString());
    }
}
```

#### Time complexity

**O(n) in every case**, where n is `s.length()`. One pass to build, one reverse, one comparison, each O(n). `StringBuilder.append` is amortised constant time; that is how the JDK implements growth, not a documented guarantee, but either way the builder never holds more than n characters.

#### Space complexity

**O(n) auxiliary space**: the builder plus two strings of up to n characters.

#### The bridge to the next approach

> "The cleaned string only exists so I can compare its i-th character from the front with its i-th from the back. I can get those characters straight from `s`: one pointer from each end, each skipping characters that don't count. Then nothing is built, and the extra memory is two indices."

### Approach 2: Two pointers that skip non-alphanumerics (recommended)

#### What I say out loud

> "`left` starts at 0, `right` at the end. While `left < right`: move `left` forward past non-alphanumerics, move `right` back past non-alphanumerics, both loops also stopping if the pointers meet. Then compare the two characters in lowercase. Different means false. Same means step both inward. If the loop finishes, it's a palindrome."

> "The `left < right` check in the skipping loops matters: with `".,"` there's nothing to stop at, and without that check `left` walks off the end."

#### Intuition

The k-th character of the cleaned string from the front and the k-th from the back are exactly what the two pointers land on after their k-th skip. So the pointers compare the same pairs as Approach 1, without materialising the cleaned string. This is the opposite-ends form of [[a2-two-pointers|Two Pointers]].

#### Algorithm

1. `left = 0`, `right = n − 1`.
2. While `left < right`:
   1. While `left < right` and `s[left]` is not alphanumeric: `left++`.
   2. While `left < right` and `s[right]` is not alphanumeric: `right--`.
   3. If `lower(s[left]) != lower(s[right])`, return `false`.
   4. `left++`, `right--`.
3. Return `true`.

#### Why it is correct

**The invariant:** at the top of the outer loop, the alphanumerics outside `[left, right]` form a prefix and a suffix of the cleaned string of equal length, and they mirror each other (each one equals, ignoring case, its partner on the other side).

- At the start nothing is outside, so the invariant holds.
- After the two skipping loops, if `left < right`, both pointers sit on alphanumerics, and these are the next unmatched characters of the cleaned string from each end, because everything skipped was not alphanumeric. If they differ, the cleaned string has a mismatched mirror pair, so `false` is right. If they match, stepping inward extends the matched prefix and suffix by one each.
- If a skipping loop stops because `left == right`, the remaining window is a single slot. Whether or not that slot is alphanumeric, it is the middle of what remains and has no partner; comparing it with itself is harmless.
- When the loop ends, every alphanumeric has been matched with its mirror or is the lone middle one, so the cleaned string is a palindrome. For an input with no alphanumerics this returns `true`, which matches the empty cleaned string.

**The 20-second version to say to the interviewer:**

> "Each pointer skips to the next character that counts from its end, so they meet the cleaned string's characters in mirror order. Every pair is compared once; a mismatch is a real mismatch of the cleaned string. The skipping loops stop when the pointers meet, so a string of punctuation just ends with true. O(n) time, O(1) space."

#### Dry run

`s = "race a car"` (indices: `r0 a1 c2 e3 _4 a5 _6 c7 a8 r9`, `_` is a space)

| left | right | After skipping | Compare | Result |
|---|---|---|---|---|
| 0 | 9 | 0, 9 | `r` = `r` | step inward |
| 1 | 8 | 1, 8 | `a` = `a` | step inward |
| 2 | 7 | 2, 7 | `c` = `c` | step inward |
| 3 | 6 | 3, 5 (space at 6 skipped) | `e` ≠ `a` | return `false` |

#### Java code

```java title="Approach 2: two pointers skipping non-alphanumerics (recommended)"
class Solution {
    public boolean isPalindrome(String s) {
        int left = 0;
        int right = s.length() - 1;
        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
                left++;
            }
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
                right--;
            }
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
}
```

#### Time complexity

**O(n) in every case.** `left` only increases and `right` only decreases, and the loops stop when they meet, so together they take at most about n steps, each constant time.

#### Space complexity

**O(1) auxiliary space**: two indices.

## 5. Comparison table

n = `s.length()`. Nothing hashes, so expected and worst case coincide.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Cleaned string and reverse | O(n) | O(n) | O(n) |
| 2. Two pointers with skipping | O(n) | O(n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Cleaned string and reverse | Mirrors the statement; almost no edge-case risk | O(n) extra memory; always scans the whole string | A quick first answer, or when clarity beats memory |
| 2. Two pointers with skipping | O(1) memory; stops at the first mismatch | The skipping loops need the `left < right` guard | The answer to give |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2. Mention Approach 1 in one sentence as the baseline.

**Is it optimal?** Yes. In the worst case a correct algorithm must read essentially every character: if the input is, say, a palindrome made only of letters and the algorithm never looks at some position other than the middle, changing that letter to a different one makes the answer `false` without the algorithm noticing. That is an Ω(n) worst-case lower bound, and both approaches meet it; Approach 2 also uses O(1) space.

**When to stop:** after the two-pointer version is coded and traced on a mismatch, on punctuation only, and on `"0P"`.

## 7. Interview script: code it and test it

### What I say while coding

> "Outer loop while `left < right`. Two skipping loops, each also guarded by `left < right`, so they can't cross or leave the string."

> "Compare with `Character.toLowerCase` on both sides. That leaves digits alone."

> "Step both pointers after a match. If I get out of the loop, return true."

### Testing out loud

**Normal case:** `"race a car"`, as in the dry run. Three matches, then `e` against `a` after skipping the space. Returns `false`.

**Only punctuation:** `".,"`. `left = 0`, `right = 1`. The first skipping loop moves `left` to 1 and stops because `left == right`. The second loop does not run. Comparing `,` with itself passes; `left = 2`, `right = 0`; the loop ends. Returns `true`.

**Single space:** `" "`. `left = right = 0`; the outer loop never runs. Returns `true`.

**Digit and letter:** `"0P"`. Both alphanumeric; `'0'` against `'p'` differ. Returns `false`.

**Punctuation on one side:** `"a."`. The right pointer skips `.` and stops at `left == right == 0`; `a` compared with itself. Returns `true`.

**Mixed case:** `"Aa"`. `a` equals `a` after lower-casing. Returns `true`.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1–2 min | What counts as alphanumeric, digits kept, empty after cleaning is true |
| Baseline | 30 s | Clean and reverse, O(n) memory, not coded unless asked |
| Code | 3 min | Approach 2 |
| Trace and edge cases | 2–3 min | A mismatch, punctuation only, `"0P"` |

Most of the risk is in the skipping loops, so the time should go into tracing them on a string with no alphanumerics. If stuck, write the cleaned string on paper, then point at where each pointer is in the original.

## 9. Interviewer challenges

### About correctness

#### Why do the inner loops need `left < right` again, when the outer loop already checks it?

**What they are testing:** whether you see that the skipping loops move the pointers without going back to the outer check.

**How to reason:** run `".,"` with the guard removed.

**What I say:** "The outer check runs once per pair, but the inner loop can move `left` many times. Without its own guard, on `".,"` it skips both characters and calls `charAt(2)`, which throws. With the guard it stops when the pointers meet."

**Nuance:** guarding only the left loop is not enough: on `".,"` the left loop then stops at index 1, and the unguarded right loop skips both characters and calls `charAt(-1)`. Guard both the same way.

#### Is `Character.isLetterOrDigit` correct here?

**What they are testing:** precision about library behaviour against the problem's definition.

**How to reason:** compare what the method accepts with what the statement means, over the input alphabet.

**What I say:** "On printable ASCII it returns true for exactly `A–Z`, `a–z` and `0–9`, which is the statement's alphanumeric set, so it's correct here. Outside ASCII it also accepts letters like `é` or digits from other scripts; if the input could contain those, I'd ask whether they count, or write an explicit range check to pin the ASCII meaning down."

**Nuance:** the same goes for case: `Character.toLowerCase` is a per-`char` mapping. For ASCII it is just `A–Z` to `a–z`. Full Unicode case-insensitive comparison is a harder problem than one `char` at a time.

### About trade-offs

#### When would you choose the cleaned-string version anyway?

**What they are testing:** whether you can weigh simplicity against memory honestly.

**How to reason:** both are O(n) time; the difference is O(n) memory and implementation risk.

**What I say:** "If memory doesn't matter and I want code whose correctness is easiest to check by reading it, for example in production where readability wins, the cleaned string is fine. In an interview that asks about space, or for very long inputs, the two-pointer version avoids allocating up to 2 × 10^5 characters several times."

**Nuance:** the two-pointer version can also stop at the first mismatch near the ends, while the cleaned version always processes the whole string.

## 10. Follow-up questions the interviewer might ask

**"What if you may delete at most one character?"**
That is [[nc-valid-palindrome-ii|Valid Palindrome II]]: on the first mismatch, try skipping the left character or the right one, and check the rest without further deletions. O(n) time, O(1) space.

**"What if the input is a stream you can only read once, front to back?"**
Then you cannot walk from the end. Keep the cleaned characters (O(n) memory), or compare rolling hashes of the cleaned prefix read forwards and backwards; hashing gives a probabilistic answer, with a small chance of a false `true` on a collision.

**"What if the string is huge and stored as a linked list of characters?"**
Without random access, find the middle with slow and fast pointers, reverse the second half, compare, and restore it. O(n) time, O(1) extra space, as in Palindrome Linked List.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Treating digits as ignorable,** or letters as case-sensitive. Only non-alphanumerics are dropped, and only letters are case-folded.
- **Thinking an all-punctuation string is false** because "there is nothing to compare". The cleaned string is empty, which is a palindrome.

### Implementation mistakes

> [!MISTAKE] Skipping loops without the `left < right` guard
> `while (!Character.isLetterOrDigit(s.charAt(left))) left++;` runs off the end on `".,"` and throws `StringIndexOutOfBoundsException`. Guard both skipping loops with `left < right`.

- **Comparing by "same letter if the codes differ by 32".** `'0'` is 48 and `'P'` is 80, so `"0P"` would wrongly return `true`. Lower-case both characters and compare for equality.
- **Lower-casing with `s.toLowerCase()` inside the loop.** It builds a new string every iteration, turning O(n) into O(n²). Lower-case once up front, or one character at a time.
- **Forgetting to step the pointers after a match,** which loops forever on `"aa"`: the same pair is compared again and again.

## 12. Pattern recognition

**The pattern:** two pointers from opposite ends, each skipping elements that do not take part, comparing mirror pairs.

**Signals in the problem statement:**

- "Reads the same forward and backward".
- A filter ("ignore non-alphanumerics") applied on top of a symmetric comparison.
- An implicit question about extra memory: the cleaned string is not needed, only its characters in order.

**Related problems in this list:**

- [[nc-reverse-string|Reverse String]]: the same pointers, swapping instead of comparing.
- [[nc-valid-palindrome-ii|Valid Palindrome II]]: the same comparison, with one deletion allowed.
- [[nc-two-sum-ii-input-array-is-sorted|Two Sum II]]: pointers from both ends again, but moving according to a sum.
- [[nc-palindromic-substrings|Palindromic Substrings]]: palindromes again, checked from the centre outwards instead of from the ends inwards.

**Takeaway:** when the answer is defined on a filtered version of the input, you can often walk the original with pointers that skip what the filter would drop, instead of building the filtered copy.

## 13. 60-second revision card

**Key insight:** the cleaned string is never needed, only its characters in mirror order, which two skipping pointers produce directly.

**Invariant:** the alphanumerics outside `[left, right]` are matched mirror pairs.

**Complexity:** O(n) time, O(1) auxiliary space. Ω(n) worst-case lower bound: an unread character could break the symmetry.

**Code skeleton:**

```java title="Valid Palindrome in ten lines"
class Solution {
    public boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l++)) != Character.toLowerCase(s.charAt(r--))) return false;
        }
        return true;
    }
}
```

**Main traps:**

- Guard the skipping loops with `l < r`.
- Lower-case both sides; digits stay as they are; `"0P"` is false.
- Empty after cleaning is true.

**What to say in one breath:** "Two pointers from both ends, each skipping non-alphanumerics without crossing; compare lower-cased characters, false on the first mismatch, true if they meet. On printable ASCII `isLetterOrDigit` is exactly letters and digits. O(n) time, O(1) space."
