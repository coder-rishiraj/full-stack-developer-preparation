---
problemId: nc-minimum-window-substring
title: Minimum Window Substring
source: neetcode
sourceUrl: https://leetcode.com/problems/minimum-window-substring/
difficulty: hard
patterns: [sliding-window, two-pointers, counting]
relatedLessons: [a2-sliding-window, a2-frequency-counting, a2-two-pointers, a2-hashing, a14-brute-force-first, a14-deriving-optimization]
companies: []
timeToSolve: 35
---

## 1. Problem restatement

You get two strings, `s` of length m and `t` of length n. Find the shortest contiguous piece of `s` (a substring) that contains every character of `t`, counting repeats: if `t` has two `a`s, the piece needs at least two `a`s. The order of the characters inside the piece does not matter, and it may contain other characters too. Return that piece, or the empty string `""` if no piece of `s` contains all of `t`.

**Example 1**

- Input: `s = "ADOBECODEBANC"`, `t = "ABC"`
- Output: `"BANC"`
- Why: several pieces contain an `A`, a `B` and a `C`, for instance `"ADOBEC"` (length 6) and `"CODEBA"` (length 6). `"BANC"`, the last four characters, is the only one of length 4, and no piece of length 3 contains all three letters.

**Example 2**

- Input: `s = "a"`, `t = "aa"`
- Output: `""`
- Why: `t` needs two `a`s, and the whole of `s` has only one. Repeats count.

**What the problem statement guarantees**

- 1 ≤ m, n ≤ 10^5, where m = `s.length()` and n = `t.length()`.
- `s` and `t` consist of uppercase and lowercase English letters only.
- When an answer exists, it is unique: there is exactly one shortest qualifying piece.
- The method is `public String minWindow(String s, String t)`.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The difficulty is not finding *a* correct algorithm, which is easy, but finding one that runs in time for strings of 10^5 characters, and then getting its bookkeeping exactly right. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 35 minutes and talk out loud.
2. Write down a correct method first, however slow, and count how much work it does when both strings have 10^5 characters.
3. Take Example 1 on paper. Fix the end of the piece at some position and ask: which start positions give a piece containing all of `t`? Then move the end one step right and ask the same question. Compare the answers.
4. Decide how you will tell, quickly, whether the current piece contains all of `t`. Aim for constant work per step, not work proportional to the alphabet.
5. Trace your code on Example 1 and on `s = "bbaa"`, `t = "aba"` (answer `"baa"`).

Open a hint only after two minutes without progress. After each hint, close it and try again before opening the next one.

> [!HINT] Hint 1: a small nudge
> If the piece `s[i..j]` contains all of `t`, so does every longer piece around it. If it does not, no shorter piece inside it does either. Ask what that means for the best start position as the end position moves to the right: can it ever need to move left?

> [!HINT] Hint 2: the kind of tool you need
> Keep a window with two indices that both only move right. Grow it on the right until it contains all of `t`, then shrink it from the left for as long as it still does, recording the shortest one seen. To know whether the window is valid, keep per-character counts of what `t` needs.

> [!HINT] Hint 3: almost the whole plan
> Store `need[c]` = (copies of c in `t`) − (copies of c in the window), and one integer `missing` = how many characters of `t` the window still lacks, counting repeats. Adding a character lowers `missing` only if its `need` was positive before; removing one raises `missing` only if its `need` becomes positive. The window is valid exactly when `missing == 0`. Remember the best window as a start index and a length, and build the string once at the end.

**Check yourself before revealing the walkthrough**

- [ ] I can explain why the left index never has to move back to the left
- [ ] My validity test costs O(1) per step, not one pass over the alphabet
- [ ] I can say what each counter means at every moment, including when a count is negative
- [ ] My code returns `"BANC"`, `""` for Example 2, `"baa"` for `s = "bbaa"`, `t = "aba"`, and `""` when `t` has a letter that `s` lacks
- [ ] I can explain why the total work is O(m + n) even though there is a loop inside a loop

## 3. Interview script: understand the problem (≈3 min)

**Me:** Let me restate it. I need the shortest substring of `s` whose character counts are at least the character counts of `t`. Order inside the substring doesn't matter, extra characters are allowed, and if nothing qualifies I return the empty string.

**Interviewer:** Yes.

**Me:** "Every character including duplicates" means a multiset comparison: for `t = "aab"` I need at least two `a`s and one `b` in the window?

**Interviewer:** Right.

**Me:** Is it case-sensitive? Is `'A'` a different character from `'a'`?

**Interviewer:** Yes, they're different characters.

**Me:** And the sizes? And what characters can appear?

**Interviewer:** Both strings are between 1 and 10^5 characters, only uppercase and lowercase English letters. And the answer is guaranteed to be unique.

**Me:** Good, so I don't need a tie-breaking rule between two shortest windows. Note that `t` can be longer than `s`; then the answer is `""` straight away, because a window can't hold more characters than `s` has. And `t` can contain a letter `s` doesn't have, which also means `""`.

**Me:** Let me work Example 1 by hand: `s = "ADOBECODEBANC"`, `t = "ABC"`. Reading from the left, the first point where I have seen an `A`, a `B` and a `C` is index 5, giving `"ADOBEC"`, length 6. Can I drop the `A` at the front? No, it's the only `A` so far. Continuing, at index 10 there's a new `A`, so now the first `A` is no longer needed, and I can cut `"ADOBE"` off the front until I hit the `C` at index 5: `"CODEBA"`, still length 6. At index 12 a new `C` arrives, and I can cut down to `"BANC"`, length 4. Interesting: as I moved the end right, the best start only moved right too. I'll come back to that.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ m, n ≤ 10^5 | Checking every substring is about m²/2 = 5 × 10^9 substrings, far too many. Even O(m²) simple steps (10^10) is too slow; I need something close to O(m + n). Every count and length fits in an `int`. |
| Only uppercase and lowercase English letters | Character codes are 65–90 and 97–122, all below 128. A plain `int[128]` indexed by the character works as a count table: no hashing, no boxing. |
| n can exceed m | Then no window of `s` is long enough: return `""` at once. |
| The answer is unique | No tie-breaking rule is needed. My code will keep the leftmost shortest window, which would also be a sensible rule if ties were possible. |
| Return `""` if no window exists | I need a sentinel for "nothing found yet" and a check at the end. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Duplicates in `t` must be matched with multiplicity | Validity is a comparison of counts, not of sets. One counter per character, not one flag. |
| Upper and lower case are different characters | Index the count table by the character itself; no case folding. An `int[26]` indexed by `c - 'a'` would be wrong. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| A window means a contiguous substring | It is the statement's "substring"; order and gaps are not allowed. A version where `t` must appear in order is a different problem (see section 10). |
| I return a new `String`; nothing needs to be modified | Java strings are immutable, so there is nothing to modify anyway. I will track the best window as indices and build the result once. |

### Edge cases I will keep in mind

- `t` longer than `s`: `s = "a"`, `t = "aa"` → `""`.
- `t` has a letter not in `s`: `s = "abc"`, `t = "d"` → `""`.
- Duplicates in `t`: `s = "bbaa"`, `t = "aba"` → `"baa"` (needs two `a`s, one `b`).
- Surplus copies in the window: `s = "AAB"`, `t = "AB"` → `"AB"`, not `"AA"` or `"AAB"`.
- The answer is the whole string: `s = "abc"`, `t = "cba"`.
- `s == t`, both of length 10^5: the answer is all of `s`.
- Case: `s = "aA"`, `t = "A"` → `"A"`.

## 4. Think out loud: from first idea to best solution

> "The obvious correct method is to try every substring, check whether its counts cover `t`, and keep the shortest. Let me cost it before I write anything."

**The brute force, and why I won't code it as an approach.** There are m(m + 1)/2 substrings, about 5 × 10^9 for m = 10^5. Checking each from scratch costs up to m more, so O(m³) overall. A smarter brute force fixes the start `i`, extends the end one character at a time while updating counts, and stops at the first end where the window covers `t`: that is the shortest valid window starting at `i`, and it costs O(1) per step if I track how many characters are still lacking. That is O(m²) time, which is 10^10 steps at the limits: too slow to run on the largest inputs, so I treat it as the baseline, not as an answer. (It is what the tests on this page use as their reference on small inputs.)

> "Where is the waste? For start `i` I scan forward to some end `e(i)`, the first position where `s[i..e(i)]` covers `t`. Then for start `i + 1` I throw all that away and scan again from `i + 1`. But I already know `s[i + 1..e(i) − 1]` can't be valid: it's inside `s[i..e(i) − 1]`, which wasn't valid, and a piece inside an invalid piece has no more of any character, so it can't be valid either. So `e(i + 1) ≥ e(i)`. The end never has to move back."

> "That's the monotonicity I noticed by hand. Validity is monotone in both directions: growing a valid window keeps it valid, shrinking an invalid one keeps it invalid. That means both ends of the window only ever move right, and the whole search is one sweep. The question is how to test validity cheaply as the window moves."

### Approach 1: Sliding window, checking the whole count table

#### What I say out loud

> "Two indices, `left` and `right`, both start at 0. I keep `have[c]`, the count of each character in `s[left..right]`, and `need[c]`, the count in `t`. For each new `right` I add `s[right]` to `have`. Then, while the window covers `t`, I record it if it's the shortest so far and drop `s[left]` from the left. The covering test compares `have` and `need` for every character code: 128 comparisons."

> "This is linear in m times the alphabet: at most about 2m tests of 128 comparisons, roughly 2.6 × 10^7 for m = 10^5. That would pass. But the test is doing the same comparison for 127 characters that didn't change, so I'll make it constant afterwards."

#### Intuition

For each end position `right`, the useful question is: what is the shortest valid window **ending** at `right`? Its start is the largest `left` for which `s[left..right]` still covers `t`. Shrinking from the left while the window stays valid finds exactly that start. Because the best start never moves backwards as `right` grows (the monotonicity argument above), the shrinking can continue from wherever it stopped for the previous `right`. This is the variable-size [[a2-sliding-window|sliding window]]: grow on the right until valid, shrink on the left while valid.

#### Algorithm

1. Fill `need[c]` with the count of each character in `t`. Set `have` to all zeros, `left = 0`, `bestLen = ∞`.
2. For `right` from 0 to m − 1:
   1. `have[s[right]]++`.
   2. While `have[c] ≥ need[c]` for every character code c:
      1. If `right − left + 1 < bestLen`, record `bestLeft = left`, `bestLen = right − left + 1`.
      2. `have[s[left]]--`, `left++`.
3. Return `""` if `bestLen` is still ∞, otherwise `s.substring(bestLeft, bestLeft + bestLen)`.

#### Why it is correct

Call a window **valid** if it covers `t`. Two facts about validity:

- **Growing keeps it valid.** A longer window containing a valid one has every count at least as large.
- **Shrinking keeps it invalid.** A window inside an invalid one has every count at most as large, so it lacks whatever the bigger one lacked.

**Only valid windows are recorded.** A window is recorded only inside the `while`, whose condition is exactly the covering test. So the returned string, if any, really contains all of `t`.

**The minimum window is not missed.** Let the shortest valid window be `s[a..b]`. First, `left` never passes `a` before `right` reaches `b`: `left` steps from position x to x + 1 only after the window `s[x..right]` tested valid. If `left` stepped past `a` while `right < b`, then `s[a..right]` was valid and shorter than `s[a..b]`, which contradicts minimality. So when `right` becomes `b`, `left ≤ a`, and the window `s[left..b]` contains `s[a..b]`, so it is valid and the `while` runs. Each step keeps it valid as long as `left ≤ a` (it still contains `s[a..b]`), so the loop reaches `left = a`, tests `s[a..b]`, finds it valid, and records it, because nothing shorter was ever valid. It then drops `s[a]`, and `s[a + 1..b]` is invalid (it is shorter than the minimum), so the loop stops.

**It returns the shortest.** Every recorded window is valid, the minimum is recorded, and a later window only replaces the best if it is strictly shorter. So `bestLen` ends equal to the minimum length.

**The answer is empty only when it should be.** If any valid window exists, the minimum one is recorded, so `bestLen` is finite.

#### Dry run

`s = "bbaa"`, `t = "aba"`, so `need`: a = 2, b = 1. Only the counts of `a` and `b` are shown; every other `need` is 0 and always satisfied.

| right | char | have (a, b) after adding | covers? | Action | best |
|---|---|---|---|---|---|
| 0 | b | (0, 1) | no: a 0 < 2 | next right | none |
| 1 | b | (0, 2) | no: a 0 < 2 | next right | none |
| 2 | a | (1, 2) | no: a 1 < 2 | next right | none |
| 3 | a | (2, 2) | yes | record `s[0..3]` = `"bbaa"`; drop `b`, `left = 1` | `"bbaa"` |
| 3 | | (2, 1) | yes | record `s[1..3]` = `"baa"`; drop `b`, `left = 2` | `"baa"` |
| 3 | | (2, 0) | no: b 0 < 1 | loop ends | `"baa"` |

Returns `"baa"`. The covering test ran 6 times: once failing for each of the 4 values of `right`, plus once for each of the 2 steps of `left`. That count, m plus the number of `left` steps, is what bounds the running time below.

#### Java code

```java title="Approach 1: sliding window, checking the whole count table"
class Solution {
    public String minWindow(String s, String t) {
        int[] need = new int[128];               // count of each character in t
        for (int i = 0; i < t.length(); i++) {
            need[t.charAt(i)]++;
        }
        int[] have = new int[128];               // count of each character in s[left..right]
        int bestLeft = 0;
        int bestLen = Integer.MAX_VALUE;
        int left = 0;
        for (int right = 0; right < s.length(); right++) {
            have[s.charAt(right)]++;
            while (covers(have, need)) {         // shrink while the window is still valid
                if (right - left + 1 < bestLen) {
                    bestLen = right - left + 1;
                    bestLeft = left;
                }
                have[s.charAt(left)]--;
                left++;
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestLeft, bestLeft + bestLen);
    }

    private static boolean covers(int[] have, int[] need) {
        for (int c = 0; c < 128; c++) {          // 128 comparisons per check
            if (have[c] < need[c]) {
                return false;
            }
        }
        return true;
    }
}
```

The `while` cannot run `left` past `right`: once the window is empty, `have` is all zeros and `need` has at least one positive entry (n ≥ 1), so `covers` is false.

#### Time complexity

**O(σ·m + n) in every case**, where σ = 128 is the size of the count table. Reading `t` costs n. The covering test runs at most once per `right` with a false result (that ends the `while`) and at most once per step of `left` with a true result; `left` only increases and never exceeds m, so there are at most 2m tests, each of at most 128 comparisons. At m = 10^5 that is at most about 2.6 × 10^7 comparisons. Building the answer copies at most m characters once.

#### Space complexity

**O(σ) auxiliary space**: two tables of 128 `int`s, constant for this alphabet. The returned string is output, not counted.

#### The bridge to the next approach

> "Almost all of the covering test is wasted. Between two tests, one character entered or left the window, so at most one comparison could have changed its answer. I want to keep the answer to 'how far am I from covering `t`' up to date incrementally."

> "Natural candidate: a single integer `missing`, the number of characters of `t` the window still lacks, counting repeats. Adding a character only helps if the window was still short of that character; removing one only hurts if the window had no spare copy. If I store one signed count per character, `need[c]` = required minus present, then 'short of c' is `need[c] > 0` and 'has a spare' is `need[c] < 0`. Then validity is just `missing == 0`."

### Approach 2: Sliding window with a `missing` counter (recommended)

#### What I say out loud

> "Same window, same loops. I replace the two tables with one: `need[c]` starts as the count of c in `t`, and I decrement it when c enters the window and increment it when c leaves. So `need[c]` is how many more copies of c I still need; negative means I have spares. I also keep `missing`, starting at n, the total of the positive `need` values."

> "When `s[right]` enters: if its `need` was positive, it fills a gap, so `missing--`; then `need--`. When `s[left]` leaves: `need++`; if it's now positive, I just lost a copy I needed, so `missing++`. The window is valid exactly when `missing` is 0."

> "I store the best window as a start and a length and call `substring` once at the end, so I never copy characters inside the loop."

#### Intuition

Validity only changes when a **needed** copy enters or leaves the window. A surplus copy (a third `a` when `t` has two, or a `D` when `t` has none) changes nothing. The signed count `need[c]` tells you which kind of copy you are dealing with, and `missing` summarises the whole table in one number. Characters that are not in `t` start at `need = 0`, go negative when they enter, and come back to at most 0 when they leave, so they never touch `missing`; no special case is needed for them.

#### Algorithm

1. If n > m, return `""`.
2. `need[c]` = count of c in `t`; `missing = n`; `left = 0`; `bestLen = ∞`.
3. For `right` from 0 to m − 1, with `in = s[right]`:
   1. If `need[in] > 0`, `missing--`. Then `need[in]--`.
   2. While `missing == 0`:
      1. If `right − left + 1 < bestLen`, record `bestLeft = left`, `bestLen = right − left + 1`.
      2. With `out = s[left]`: `need[out]++`; if `need[out] > 0`, `missing++`. Then `left++`.
4. Return `""` if `bestLen` is ∞, otherwise `s.substring(bestLeft, bestLeft + bestLen)`.

#### Why it is correct

**The invariant**, true before and after every update (at the top of each loop iteration and each `while` iteration):

- `need[c]` = (copies of c in `t`) − (copies of c in `s[left..right]`) for every character c, and
- `missing` = the sum of max(0, `need[c]`) over all c: the number of characters of `t`, counting repeats, that the window does not yet supply.

**It holds at the start**: the window is empty, `need` is the count of `t`, every entry is ≥ 0, and the sum is n = `missing`.

**Adding `in` keeps it.** `need[in]` drops by 1. If it was positive, max(0, `need[in]`) drops by 1, and the code decrements `missing`. If it was 0 or negative, max(0, ·) stays 0, and the code leaves `missing` alone. No other entry changes.

**Removing `out` keeps it.** `need[out]` rises by 1. If it is now positive, it was ≥ 0 before, so max(0, ·) rose by 1, and the code increments `missing`. If it is still ≤ 0, max(0, ·) stays 0. No other entry changes.

**`missing == 0` exactly when the window is valid.** `missing` is 0 if and only if every `need[c] ≤ 0`, that is, the window has at least as many copies of every character as `t`. So the `while` condition is the same covering test as in Approach 1, and the correctness argument from Approach 1 (only valid windows are recorded; `left` never passes the start of the minimum window before `right` reaches its end; the minimum window is recorded) carries over unchanged.

**The early return is correct.** A window has at most m characters, so if n > m it cannot contain all of `t`. The loop would also return `""` in that case; the check only skips the work.

**The 25-second version to say to the interviewer:**

> "If a window covers `t`, every window containing it does too, and if it doesn't, nothing inside it does. So for each right end I shrink from the left while the window stays valid, and that start never moves backwards: one sweep. To test validity in O(1), `need[c]` is required minus present, and `missing` counts the positive part. A character entering only lowers `missing` if it was still needed; one leaving only raises it if it was needed. Valid means `missing == 0`. Each index enters once and leaves once, so it's O(m + n) time with a 128-entry table."

#### Dry run

Example 1: `s = "ADOBECODEBANC"`, `t = "ABC"`. Initially `need` A = 1, B = 1, C = 1, everything else 0, and `missing = 3`. The table shows the counts after each event; `need` for other letters goes negative and never matters.

| right | in | Event | need (A, B, C) | missing | left | best |
|---|---|---|---|---|---|---|
| 0 | A | A was needed | (0, 1, 1) | 2 | 0 | none |
| 1–2 | D, O | not in `t` (need goes to −1) | (0, 1, 1) | 2 | 0 | none |
| 3 | B | B was needed | (0, 0, 1) | 1 | 0 | none |
| 4 | E | not in `t` | (0, 0, 1) | 1 | 0 | none |
| 5 | C | C was needed | (0, 0, 0) | 0 | 0 | none |
| 5 | | valid: record `[0, 5]` `"ADOBEC"` (6); drop A, need[A] = 1 > 0 | (1, 0, 0) | 1 | 1 | `"ADOBEC"` |
| 6–8 | O, D, E | not in `t` | (1, 0, 0) | 1 | 1 | `"ADOBEC"` |
| 9 | B | B was **not** needed (need[B] = 0): a spare | (1, −1, 0) | 1 | 1 | `"ADOBEC"` |
| 10 | A | A was needed | (0, −1, 0) | 0 | 1 | `"ADOBEC"` |
| 10 | | valid `[1, 10]` (10), drop D; valid `[2, 10]` (9), drop O | (0, −1, 0) | 0 | 3 | `"ADOBEC"` |
| 10 | | valid `[3, 10]` (8), drop B: need[B] = 0, not > 0, still valid | (0, 0, 0) | 0 | 4 | `"ADOBEC"` |
| 10 | | valid `[4, 10]` (7), drop E; valid `[5, 10]` `"CODEBA"` (6, not shorter), drop C: need[C] = 1 | (0, 0, 1) | 1 | 6 | `"ADOBEC"` |
| 11 | N | not in `t` | (0, 0, 1) | 1 | 6 | `"ADOBEC"` |
| 12 | C | C was needed | (0, 0, 0) | 0 | 6 | `"ADOBEC"` |
| 12 | | valid `[6, 12]` (7), drop O; valid `[7, 12]` (6), drop D | (0, 0, 0) | 0 | 8 | `"ADOBEC"` |
| 12 | | valid `[8, 12]` `"EBANC"` (5): record; drop E | (0, 0, 0) | 0 | 9 | `"EBANC"` |
| 12 | | valid `[9, 12]` `"BANC"` (4): record; drop B: need[B] = 1 | (0, 1, 0) | 1 | 10 | `"BANC"` |

The loop ends and the method returns `s.substring(9, 13)` = `"BANC"`. Two moments are worth pointing at. At right = 9 the second `B` makes `need[B]` negative without touching `missing`: the window gains a spare. At right = 10 that spare is what lets `left` cut past the first `B` (at index 3) and keep going until it loses the only `C`.

#### Java code

```java title="Approach 2: sliding window with a missing counter (recommended)"
class Solution {
    public String minWindow(String s, String t) {
        if (t.length() > s.length()) {
            return "";                           // no window of s is long enough
        }
        int[] need = new int[128];               // need[c] = (count of c in t) - (count of c in window)
        for (int i = 0; i < t.length(); i++) {
            need[t.charAt(i)]++;
        }
        int missing = t.length();                // sum of the positive need[c]: characters still lacking
        int bestLeft = 0;
        int bestLen = Integer.MAX_VALUE;
        int left = 0;
        for (int right = 0; right < s.length(); right++) {
            char in = s.charAt(right);
            if (need[in] > 0) {
                missing--;                       // this copy was still lacking
            }
            need[in]--;                          // may go negative: a surplus copy
            while (missing == 0) {               // valid: shrink to the shortest window ending at right
                if (right - left + 1 < bestLen) {
                    bestLen = right - left + 1;
                    bestLeft = left;
                }
                char out = s.charAt(left);
                need[out]++;
                if (need[out] > 0) {
                    missing++;                   // removed a copy the window needed
                }
                left++;
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestLeft, bestLeft + bestLen);
    }
}
```

**Why `int[128]` and not a `HashMap`.** Every character here is an ASCII letter, so its code is a valid index into a 128-entry array: each update is one array access, with no hashing and no boxing of `Character` and `Integer`. A `HashMap<Character, Integer>` would also be correct and is the right choice if the alphabet were arbitrary Unicode, at O(1) *expected* cost per operation and noticeably more constant overhead. An `int[52]` with an offset would also work but needs a mapping for two separate letter ranges; 128 entries avoid that for a few hundred bytes.

**Arithmetic.** Counts, lengths and indices are at most 10^5, so `int` is safe everywhere. `Integer.MAX_VALUE` is only a sentinel and is never added to anything before the final check.

#### Time complexity

**O(m + n) in every case.** Building `need` reads `t` once: n steps (plus 128 to allocate the table). The outer loop runs m times. The inner `while` body increments `left` every time it runs, `left` starts at 0, and it can never exceed `right + 1` (an empty window has `missing = n ≥ 1`, so the loop stops), so across the whole run the body executes at most m times. Each body and each outer step is O(1). The final `substring` copies at most m characters once. Total: at most about 2m + n constant-time steps.

#### Space complexity

**O(1) auxiliary space** for this alphabet: one table of 128 `int`s and a few variables. (In general, O(σ) for an alphabet of size σ.) The returned string is the output.

### Alternative: sweep only the positions that matter

When `s` is much longer than `t` and most of its characters do not occur in `t`, you can first collect the list of indices `i` where `s[i]` occurs in `t`, then run the same window over that list (window length is measured with the original indices). The answer and the asymptotic cost are unchanged, O(m + n), because building the list reads all of `s`. It only saves the work of moving `left` across irrelevant characters, which is a constant factor. Mention it if the interviewer asks how to speed things up in practice; it is not a different idea.

## 5. Comparison table

m = length of `s`, n = length of `t`, σ = 128, the size of the count table. No approach uses hashing or randomness, so expected and worst case are the same.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Brute force per start (not coded) | O(m² + n) | O(m² + n) | O(σ) |
| 1. Window, full table check | O(σ·m + n) | O(σ·m + n) | O(σ) |
| 2. Window with `missing` counter | O(m + n) | O(m + n) | O(σ) |
| Alt. Window over filtered positions | O(m + n) | O(m + n) | O(m) for the index list |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Brute force per start | Easiest to trust; useful as a test reference | About 10^10 steps at the limits | Only to state the baseline |
| 1. Full table check | The window logic on its own, with a validity test you can check by reading it: compare every count | 128 comparisons per test | As a stepping stone, or as a fallback if the counter bookkeeping is not coming together |
| 2. `missing` counter | O(1) per step; one table | The bookkeeping (when to change `missing`) is the classic place for bugs | The answer to give |
| Alt. Filtered positions | Skips characters that cannot matter | Extra list; same bound | Very long `s` with few relevant characters, as a practical tweak |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2. Get there by saying the brute force and its cost, then the monotonicity argument (both ends only move right), then the incremental validity test. Each of those steps is worth explaining; the interviewer is listening for the monotonicity argument in particular.

**Is it optimal?** Yes, up to constant factors. There is a worst-case Ω(m + n) lower bound for any algorithm that learns characters by reading them. Take `t` = n copies of `a` and `s` = n copies of `a` (so m = n): the answer is all of `s`. If an algorithm never reads some position of `t`, changing that character to `b` makes the answer `""`. If it never reads some position of `s`, changing it to `b` also makes the answer `""`. So on this input every character must be read. The extra memory is a fixed 128-entry table.

**When another solution is better in practice:**

- If the counter logic is not coming out right under pressure, code Approach 1. Its validity test is trivially correct and it still runs in about 2.6 × 10^7 comparisons at the limits. Then upgrade the test to the counter if time allows.
- With a large or unknown alphabet, swap the array for a `HashMap` (expected O(1) per operation); the algorithm does not change.

**When to stop:** Approach 2 with the invariant, the two-pointer argument and the edge cases traced is complete. Do not micro-optimise the filtered-index version unless asked.

## 7. Interview script: code it and test it

### What I say while coding

> "Signature `String minWindow(String s, String t)`. First, if `t` is longer than `s`, return the empty string."

> "`need` is an `int[128]` because these are ASCII letters; I count `t` into it. `missing` starts at `t.length()`."

> "For each `right`: if `need[c]` is positive this copy fills a gap, so `missing--`, then decrement `need[c]` unconditionally. I decrement even for characters not in `t`, so that removing them later brings them back to 0 rather than making them look needed."

> "While `missing` is 0, the window is valid: record it if it's shorter than the best, then remove `s[left]`: increment its `need`, and if that made it positive I lost a needed copy, so `missing++`. Then `left++`. This is a `while`, not an `if`, because one new character on the right can let me drop many on the left."

> "I keep `bestLeft` and `bestLen` and build the substring once. `substring` takes an end index, not a length, so it's `bestLeft + bestLen`."

### Testing out loud

**Normal case:** Example 1, as in the dry-run table: the best goes from `"ADOBEC"` to `"EBANC"` to `"BANC"`, and the method returns `"BANC"`.

**Duplicates in `t`:** `s = "bbaa"`, `t = "aba"`. `need` a = 2, b = 1, `missing = 3`. right 0, `b`: need[b] was 1, `missing = 2`, need[b] = 0. right 1, `b`: need[b] was 0, a spare, need[b] = −1, `missing` stays 2. right 2, `a`: `missing = 1`, need[a] = 1. right 3, `a`: `missing = 0`, need[a] = 0. Valid: record `"bbaa"` (4); drop `b`, need[b] = 0, not positive, still valid. Record `"baa"` (3); drop `b`, need[b] = 1, `missing = 1`. Returns `"baa"`.

**Surplus copies:** `s = "AAB"`, `t = "AB"`. The second `A` arrives when need[A] = 0, so it does not lower `missing`; the window `"AA"` is never considered valid. At right 2 the window `"AAB"` is valid, then `"AB"` (dropping a spare `A`), then dropping the last `A` breaks it. Returns `"AB"`.

**`t` longer than `s`:** `s = "a"`, `t = "aa"`. The early return gives `""`. (Without it: need[a] = 2, `missing = 2`, the single `a` brings it to 1, never 0, and `bestLen` stays the sentinel: `""` as well.)

**`t` has a letter `s` lacks:** `s = "abc"`, `t = "d"`. need[d] = 1 is never touched, `missing` stays 1, returns `""`.

**Whole string:** `s = "abc"`, `t = "cba"`. `missing` reaches 0 only at right 2; record `"abc"`; dropping `a` breaks it. Returns `"abc"`.

**Case:** `s = "aA"`, `t = "A"`. Index 0, `a`, has need 0 and is a spare; index 1, `A`, gives `missing = 0`; record `"aA"` (2), drop `a` (need[a] back to 0, still valid), record `"A"` (1), drop `A`, `missing = 1`. Returns `"A"`.

**Largest inputs:** `s == t` with 10^5 characters: `missing` reaches 0 only at the last index, the loop shrinks once and returns all of `s`. At most 2 × 10^5 window steps.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 3 min | Multiset semantics, case, n > m, uniqueness, the `""` result |
| Brute force and its cost | 2 min | Per-start extension, O(m²), 10^10 at the limits |
| Monotonicity and the window | 4 min | "Valid stays valid when growing, invalid stays invalid when shrinking", so both ends move right |
| Validity in O(1) | 4 min | Signed `need`, `missing`, when each changes |
| Code | 6 min | Approach 2 |
| Trace and edge cases | 6 min | Part of Example 1, `"bbaa"`/`"aba"`, `"a"`/`"aa"` |
| Questions | rest | Section 9 |

**Where the time should go:** the two arguments. Most candidates can write a sliding window; what separates answers is explaining why `left` never needs to move back, and stating exactly when `missing` changes. The code is 25 lines; get the two `if` conditions right (`> 0` before decrementing, `> 0` after incrementing).

**If you get stuck:**

1. If no idea beyond brute force comes, take the brute force for start `i` and `i + 1` side by side and ask what the second one recomputes.
2. If the window is there but validity is slow, code Approach 1 and say so. Then ask: between two tests, how many counts changed?
3. If the counter keeps coming out wrong, write the invariant as a comment (`missing` = sum of positive `need`) and derive each `if` from it.
4. Take hints calmly ([[a14-responding-to-hints|Responding to Interviewer Hints]]).

## 9. Interviewer challenges

### About correctness

#### Why can the left pointer never need to move back?

**What they are testing:** whether the sliding window is justified or recited.

**How to reason:** use the two monotonicity facts and the definition of when `left` moves.

**What I say:** "`left` only moves past a position x when `s[x..right]` is valid, and I record that window before moving. Any window that starts at or before x and ends later than `right` contains `s[x..right]`, so it is strictly longer than a valid window I've already seen. It can never be the shortest. So once `left` has passed x, no window starting at x or earlier matters again."

**Nuance:** this relies on validity being monotone. It fails for conditions that are not, for example "the window contains *exactly* the counts of `t`", where shrinking can turn an invalid window into a valid one. For that kind of condition with a fixed length, a fixed-size window works instead (see [[nc-permutation-in-string|Permutation in String]]).

#### Why does `missing == 0` mean the window is valid, even though some counts are negative?

**What they are testing:** whether you know what your counters mean.

**How to reason:** state the invariant: `missing` is the sum of the positive parts of `need`.

**What I say:** "`need[c]` is required minus present. Negative means spare copies, which don't hurt. `missing` adds up only the positive entries, the shortfalls. Zero shortfall in every character is exactly 'the window covers `t`'. I keep that sum correct by changing `missing` only when an entry crosses between positive and non-positive."

**Nuance:** a common variant counts *distinct* characters whose requirement is met (`formed == required`) using two maps. It is equivalent; `missing` counts copies instead of distinct characters and needs only one table.

#### What happens with characters that are not in `t`?

**What they are testing:** whether the uniform update has a hidden case.

**How to reason:** follow one such character in and out.

**What I say:** "Its `need` starts at 0. Entering, it was not positive, so `missing` is unchanged, and `need` goes to −1. Leaving, `need` goes back to 0, which is not positive, so `missing` is unchanged. They are spares, permanently, with no special case in the code."

**Nuance:** if you skip the decrement for characters not in `t` but still increment on removal, their `need` becomes positive on removal and `missing` increases wrongly. Either update them both ways or skip them both ways.

### About complexity

#### There's a `while` inside a `for`. Why is it linear?

**What they are testing:** amortized counting.

**How to reason:** count how many times the `while` body can run in total, not per outer iteration.

**What I say:** "Every run of the `while` body increments `left`, and `left` never exceeds `right + 1 ≤ m`. So across the whole method the body runs at most m times. Together with the m outer iterations and n steps for `t`, that's O(m + n)."

**Nuance:** a single outer iteration can run the body many times (at right = 10 in Example 1 it runs five times), so the per-iteration cost is not O(1); only the total is.

#### Why not build the substring each time you find a shorter window?

**What they are testing:** awareness of hidden costs.

**How to reason:** `substring` copies its characters.

**What I say:** "Each `substring` call copies the window, so doing it on every improvement adds a copy of up to m characters per improvement. Storing two ints and copying once at the end keeps the loop O(1) per step."

**Nuance:** this is an implementation behaviour of `String.substring` in modern Java (it copies since Java 7u6), not something the problem forces; the point is that the loop should not depend on it.

#### Could you use a `HashMap` instead of the array?

**What they are testing:** data-structure choice with reasons.

**How to reason:** compare what the alphabet allows with what each structure costs.

**What I say:** "Yes, and with an arbitrary alphabet I would. Here every character is an ASCII letter, so an `int[128]` gives direct indexing with no hashing or boxing. With a `HashMap` each update is O(1) expected, assuming hash codes spread well, so the algorithm is O(m + n) expected instead of in every case."

**Nuance:** `Character` hash codes are just the character values, so in practice they spread fine; the "expected" wording is still the honest description of `HashMap`.

## 10. Follow-up questions the interviewer might ask

**"What if the characters of `t` must appear in order (a subsequence, not a multiset)?"**
That is Minimum Window Subsequence, a different problem: the window condition is no longer about counts. One standard method scans forward from each candidate start to match `t` in order, then scans backward from the match end to find the latest start; that is O(m·n) in the worst case. A DP over (position in `s`, position in `t`) also gives O(m·n).

**"What if duplicates in `t` don't matter, only which letters appear?"**
Count each distinct letter of `t` once: `need[c] = 1` for each distinct c, and `missing` = the number of distinct letters. Same algorithm, same O(m + n).

**"What if the alphabet is all of Unicode?"**
Use a `HashMap<Integer, Integer>` keyed by code point (and iterate with code points, since a character outside the Basic Multilingual Plane takes two `char`s). O(m + n) expected.

**"What if `s` arrives as a stream and you must report the best window so far at any time?"**
The algorithm already reads `s` left to right once. It needs to look at `s[left]` again when shrinking, so keep the characters from `left` to `right` in a queue: O(length of the current window) memory instead of the whole stream.

**"How many windows of minimum length are there?"**
Run the same sweep; when a valid window's length equals the best, increment a counter, and reset it to 1 when a strictly shorter one appears. Each window `[left, right]` is examined at most once (the pair only moves forward), and every minimum-length window is examined, by the same argument as for the unique one in section 4. O(m + n).

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Treating `t` as a set.** `t = "aa"` needs two `a`s. Flags instead of counts accept `"a"`.
- **Thinking you must reset the window when it becomes invalid.** Restarting from `right + 1` misses windows that reuse the end of the old one; the left end only needs to move forward one character at a time.
- **Assuming the first valid window is the shortest.** In Example 1 the first valid window is `"ADOBEC"`; the answer appears only at the end.
- **Comparing exact counts.** The window may have spares; validity is "at least" for every character.

### Implementation mistakes

> [!MISTAKE] Using `if` instead of `while` to shrink
> Shrinking at most one character per new `right` cannot cut a window down by several characters at once. On Example 1 it returns `"ADOBEC"` instead of `"BANC"`, and on `s = "bbaa"`, `t = "aba"` it returns `"bbaa"` instead of `"baa"`.

> [!MISTAKE] The wrong condition when removing a character
> Writing `if (need[out] >= 0) missing++` treats removing a spare (which brings `need` from −1 to 0) as losing a needed copy. The window is declared invalid too early: Example 1 returns `"ADOBEC"`, and `"bbaa"`/`"aba"` returns `"bbaa"`.

> [!MISTAKE] Counting surplus copies as progress
> Decrementing `missing` whenever the entering character is in `t` (instead of whenever its `need` is still positive) lets spares fill gaps they cannot fill. `s = "AAB"`, `t = "AB"` returns `"AA"`, and `"bbaa"`/`"aba"` returns `"bba"`.

- **`int[26]` indexed by `c - 'a'`.** Uppercase letters give negative indices (`'A' - 'a'` is −32): Example 1 throws `ArrayIndexOutOfBoundsException` on its first uppercase letter.
- **`substring(bestLeft, bestLen)`.** The second argument is an end index, not a length. On Example 1 this is `substring(9, 4)`, which throws `StringIndexOutOfBoundsException`.
- **No "not found" check.** If nothing was found, `bestLeft` is 0 and `bestLen` is still the sentinel, so `s.substring(0, Integer.MAX_VALUE)` throws `StringIndexOutOfBoundsException` (for instance on `s = "abc"`, `t = "d"`). Test the sentinel and return `""` first.

## 12. Pattern recognition

**The pattern:** variable-size sliding window for the *shortest* window satisfying a monotone condition: grow on the right until valid, shrink on the left while valid, record inside the shrinking loop. Keep the condition's state incrementally, ideally as one counter.

**Signals in the problem statement:**

- "Minimum (or maximum) length contiguous substring / subarray such that…"
- The condition is monotone: if a window satisfies it, every larger window around it does too.
- The condition is about counts of characters or a sum of non-negative values, which can be updated in O(1) as one element enters or leaves.

**Related problems in this list:**

- [[nc-permutation-in-string|Permutation in String]]: the same count table and counter, with a fixed window length and an "exactly equal" condition.
- [[nc-minimum-size-subarray-sum|Minimum Size Subarray Sum]]: the same shrink-while-valid loop for the shortest window, with a running sum instead of counts.
- [[nc-longest-substring-without-repeating-characters|Longest Substring Without Repeating Characters]]: the mirror image: the *longest* window, so you shrink while *invalid* and record after.
- [[nc-longest-repeating-character-replacement|Longest Repeating Character Replacement]]: a longest-window problem whose validity uses a count table.
- [[nc-valid-anagram|Valid Anagram]]: the count-table comparison on its own.

**Takeaway:** for "shortest window that contains…", make sure the condition is monotone, then let both ends move only right; record while shrinking, and replace any full re-check of the condition with a counter of how far you are from satisfying it.

## 13. 60-second revision card

**Key insight:** validity is monotone (growing keeps a window valid, shrinking keeps it invalid), so for each right end, shrink from the left while valid; the left end never moves back.

**Invariant:** `need[c]` = (count in `t`) − (count in window); `missing` = sum of the positive `need[c]`. Valid ⇔ `missing == 0`. Entering: `if (need[c] > 0) missing--; need[c]--`. Leaving: `need[c]++; if (need[c] > 0) missing++`.

**Complexity:** O(m + n) time (each index enters and leaves at most once), O(1) extra space for a 128-entry table. Worst-case Ω(m + n) lower bound.

**Code skeleton:**

```java title="Minimum Window Substring, missing counter" fragment="public String minWindow(String s, String t)"
int[] need = new int[128];
for (char c : t.toCharArray()) need[c]++;
int missing = t.length(), left = 0, bestLeft = 0, bestLen = Integer.MAX_VALUE;
for (int right = 0; right < s.length(); right++) {
    if (need[s.charAt(right)]-- > 0) missing--;         // filled a gap
    while (missing == 0) {                               // valid: shrink
        if (right - left + 1 < bestLen) { bestLen = right - left + 1; bestLeft = left; }
        if (++need[s.charAt(left++)] > 0) missing++;     // lost a needed copy
    }
}
return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestLeft, bestLeft + bestLen);
```

**Main traps:**

- `while`, not `if`, when shrinking.
- `> 0` on both sides: before decrementing, after incrementing.
- `int[128]` for upper and lower case, not `int[26]`.
- `substring(start, start + len)`, and return `""` when nothing was found.

**What to say in one breath:** "Validity is monotone, so both pointers only move right: for each right end I shrink while the window still covers `t`, recording the shortest. `need` is required minus present and `missing` counts the shortfall, so each step is O(1) and the whole thing is O(m + n)."
