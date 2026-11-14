---
problemId: nc-longest-repeating-character-replacement
title: Longest Repeating Character Replacement
source: neetcode
sourceUrl: https://leetcode.com/problems/longest-repeating-character-replacement/
difficulty: medium
patterns: [sliding-window, frequency-counting]
relatedLessons: [a2-sliding-window, a2-frequency-counting, a2-two-pointers, a14-brute-force-first, a14-deriving-optimization, a14-edge-cases]
companies: []
timeToSolve: 25
---

## 1. Problem restatement

You get a string `s` of uppercase English letters and a number `k`. You may change up to `k` characters of `s`, each into any uppercase letter. After the changes, look for the longest stretch of consecutive positions that all hold the same letter. Return the largest length such a stretch can have.

**Example 1**

- Input: `s = "ABBAB"`, `k = 1`
- Output: `4`
- Why: change the `A` at index 3 to `B` and the string reads `ABBBB`, whose last four characters are equal. Five is impossible: the whole string has two `A`s and three `B`s, so making it uniform needs at least two changes.

**Example 2**

- Input: `s = "AAAB"`, `k = 0`
- Output: `3`
- Why: with no changes allowed, the answer is the longest run that is already there, `AAA`.

**What the problem statement guarantees**

- `s` has between 1 and 10^5 characters.
- Every character is an uppercase English letter, `A` to `Z`.
- `0 ≤ k ≤ s.length`.
- You may make *at most* `k` changes; you do not have to use them all.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 25 minutes and talk out loud.
2. Before designing anything, answer this for a single fixed stretch of the string: how many changes does it need to become one letter? Write the formula.
3. State the simplest correct solution and its cost for a string of 10^5 characters.
4. Look at how the formula's inputs change when the stretch grows by one character on the right, or loses one on the left.
5. Code it and trace it on Example 1 and on `"AABC"` with `k = 1` (the answer is 3).

Open a hint only after two minutes without progress.

> [!HINT] Hint 1: a small nudge
> For one fixed substring, which letter should all the others be changed into, and how many changes does that take? Once you can compute that number, the question becomes "which substrings need at most k changes?"

> [!HINT] Hint 2: the kind of tool you need
> If a substring needs at most k changes, so does every shorter substring inside it. That monotonic property is what a sliding window needs: grow the right end, and move the left end forward only while the window needs too many changes. Keep a count of each letter inside the window.

> [!HINT] Hint 3: almost the whole plan
> A window needs `length − (count of its most frequent letter)` changes. Move `right` across the string, add `s[right]` to a 26-slot count array, and while the window needs more than `k` changes, remove `s[left]` and advance `left`. Record the window length after shrinking. Then ask: do you really need the exact most-frequent count at every step, or only the largest one you have ever seen?

**Check yourself before revealing the walkthrough**

- [ ] I can state the number of changes a fixed substring needs, and why the most frequent letter is the right target
- [ ] I said a brute-force solution and its cost before optimizing
- [ ] My code returns 4 for `"ABBAB"`, `k = 1`, and 3 for `"AABC"`, `k = 1`
- [ ] I can explain why my window never skips past the best substring

## 3. Interview script: understand the problem (≈3 min)

**Me:** Let me say it back. I can change up to `k` characters, each into any uppercase letter. Afterwards I want the longest contiguous block of one repeated letter, and I return its length. Contiguous, so a substring, not a subsequence?

**Interviewer:** Yes, a substring.

**Me:** And "up to k" means I may use fewer changes. With `k = 0` the answer is just the longest run already in the string?

**Interviewer:** Right.

**Me:** Do you want only the length, or also where the block is and which letter it uses?

**Interviewer:** Just the length.

**Me:** What are the sizes? And the character set?

**Interviewer:** Up to 10^5 characters, uppercase English letters only, and `k` is between 0 and the length of the string.

**Me:** So 26 possible letters. That's small enough for a fixed-size count array. And the length means anything quadratic is around 5 × 10^9 steps, which is too slow; I'm aiming for linear or close to it. Lengths are at most 10^5, so every count and length fits in an `int` with plenty of room.

**Me:** Let me do one by hand. `"ABBAB"`, `k = 1`. A substring is fine if, after I change the minority letters into its majority letter, I've used at most one change. The whole string has 3 `B`s and 2 `A`s: needs 2 changes, too many. `"BBAB"` from index 1: 3 `B`s and one `A`, needs 1 change. Length 4. So the number I care about for any substring is its length minus the count of its most common letter.

**Interviewer:** Why the most common letter?

**Me:** Every character that differs from the target letter has to be changed, and nothing else needs to be. So the cost of target letter `c` is `length − count(c)`, and that's smallest when `count(c)` is largest. Changes outside the substring don't help it, so I only count changes inside.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ `s.length` ≤ 10^5 | The string is never empty, so the answer is at least 1. O(n²) is about 5 × 10^9 substring extensions, too slow; I need about O(n) or O(26·n). |
| Only uppercase English letters | Counts fit in an `int[26]` indexed by `c − 'A'`. "Find the most frequent letter" costs at most 26 steps. |
| 0 ≤ `k` ≤ `s.length` | `k = 0` is legal and means "longest existing run". `k` can reach n, in which case the whole string qualifies. No negative `k` to guard against. |
| At most `k` changes | A substring qualifies when it needs `≤ k` changes, not exactly `k`. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| The block must be contiguous | This is a question about substrings, so a window over the string fits; counting letters over the whole string would answer a different question. |
| Only the length is returned | I don't need to track which letter or which position, so a single integer `best` is enough. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The input respects the constraints, so I don't validate characters | A lowercase letter would make `c − 'A'` index outside the 26-slot array. If inputs were untrusted I would check or switch to a map. |

### Edge cases I will keep in mind

- A single character: the answer is 1 whatever `k` is.
- `k = 0`: the longest run, possibly in the middle (`"BAAAB"` gives 3) or at the end (`"ABBB"` gives 3).
- `k` large enough to cover the whole string: `"ABCD"` with `k = 3` or `k = 4` gives 4.
- Every letter different and `k = 0`: `"ABCD"` gives 1.
- A string of one repeated letter: the answer is n.
- `"AABC"` with `k = 1`: answer 3. This is the input that shows how the fast version's window can hold an invalid substring while still reporting the right length (section 4).

## 4. Think out loud: from first idea to best solution

### Approach 1: One window per target letter

#### What I say out loud

> "The brute force is every substring: for each start, extend the end one character at a time, keep 26 counts and the running maximum count, and record the length whenever `length − maxCount ≤ k`. Extending by one character updates the counts in constant time, so that's O(n²), about 5 × 10^9 steps for 10^5 characters. Too slow, and I won't code it, but it gives me the test for one substring."

> "What makes it awkward is that the target letter depends on the substring. So let me fix it. Suppose I decide in advance that the block will be all `B`s. Then the question is: what's the longest substring with at most `k` characters that aren't `B`? That's a plain window problem with one counter: grow the right end, and while the window has more than `k` non-`B`s, move the left end. I can do that for each of the 26 letters and take the best."

#### Intuition

Once the target letter `c` is fixed, the cost of a substring is just "how many characters are not `c`", a number that only goes up when the window grows and only goes down when it shrinks. That makes the classic variable-size window work: for each right end, the left end only ever moves forward. The real answer uses some letter as its target, so trying all 26 cannot miss it.

#### Algorithm

1. `best = 0`.
2. For each letter `c` from `A` to `Z`:
3. Set `left = 0`, `others = 0`.
4. For each `right` from 0 to n − 1: if `s[right] ≠ c`, increment `others`.
5. While `others > k`: if `s[left] ≠ c`, decrement `others`; advance `left`.
6. Update `best` with `right − left + 1`.
7. Return `best`.

#### Why it is correct

- **It returns only achievable lengths.** After the while loop, the window `[left, right]` has at most `k` characters other than `c`. Changing them to `c` makes the window uniform with at most `k` changes, so every recorded length is achievable.
- **It cannot miss the answer.** Say the best block is `[a, b]` with target letter `c`. When the pass for `c` reaches `right = b`, could `left` already be past `a`? `left` only moves past a position `p` when the window `[p, r]` (for some `r ≤ b`) had more than `k` non-`c` characters. But `[p, r]` with `a ≤ p` sits inside `[a, b]`, which has at most `k` of them. So `left ≤ a` at that moment, the window contains `[a, b]`, and `best` is at least `b − a + 1`.

#### Dry run

`s = "ABBAB"`, `k = 1`, the pass for `c = B` (the pass that finds the answer).

| right | s[right] | others after adding | Shrink? | Window | Length |
|---|---|---|---|---|---|
| 0 | A | 1 | no | `[0, 0]` "A" | 1 |
| 1 | B | 1 | no | `[0, 1]` "AB" | 2 |
| 2 | B | 1 | no | `[0, 2]` "ABB" | 3 |
| 3 | A | 2 | yes: drop `A` at 0, others = 1 | `[1, 3]` "BBA" | 3 |
| 4 | B | 1 | no | `[1, 4]` "BBAB" | 4 |

The pass for `A` peaks at 2 (for example `"BA"`), and every other letter's pass peaks at `k = 1`. The answer is 4.

#### Java code

```java title="Approach 1: one window per target letter"
class Solution {
    public int characterReplacement(String s, int k) {
        int n = s.length();
        int best = 0;
        for (char c = 'A'; c <= 'Z'; c++) {
            int left = 0;
            int others = 0; // characters in the window that are not c
            for (int right = 0; right < n; right++) {
                if (s.charAt(right) != c) {
                    others++;
                }
                while (others > k) {
                    if (s.charAt(left) != c) {
                        others--;
                    }
                    left++;
                }
                best = Math.max(best, right - left + 1);
            }
        }
        return best;
    }
}
```

#### Time complexity

**O(26 · n) = O(n) for a fixed alphabet**, where n is the length of `s`. Each of the 26 passes moves `right` n times and `left` at most n times in total, because `left` never moves backwards; so one pass is at most 2n steps. Written with the alphabet size σ as a variable, it is O(σ · n).

#### Space complexity

**O(1) auxiliary space**: a handful of integers. The input is not counted.

#### The bridge to the next approach

> "This is linear for 26 letters, and honestly it would pass. But it reads the string 26 times, and most passes are for letters that barely appear. Can I let the window figure out the target letter itself? For a window, the best target is its most frequent letter, so the window is fine exactly when `length − maxCount ≤ k`. If I keep the counts of all 26 letters in the window, I can evaluate that in one pass."

> "I need to check that the window idea still holds without a fixed letter: if a window needs at most `k` changes, does every window inside it as well? Removing one character lowers the length by 1 and the max count by at most 1, so `length − maxCount` can't go up. Yes. Then one window, one pass."

### Approach 2: One window, recompute the most frequent count

#### What I say out loud

> "One pass. I keep `count[26]` for the window. After adding `s[right]` I compute the window's max count by scanning the 26 slots, and while `length − max > k` I drop `s[left]` and recompute. After the loop the window is the longest valid window ending at `right`, and I record its length."

> "The 26-slot scan per check makes this O(26·n), the same order as Approach 1. Its value is that it's a single pass and the correctness argument is short. I'd code this one if I had any doubt about the next refinement."

#### Intuition

Validity is monotone: a valid window's sub-windows are valid, because removing a character lowers `length` by one and `maxCount` by at most one. So for each right end there is a smallest valid left end, and it never moves backwards as `right` advances. That is exactly what a window with two forward-moving pointers explores.

#### Algorithm

1. `count = new int[26]`, `left = 0`, `best = 0`.
2. For each `right`: increment `count[s[right]]`.
3. While `(right − left + 1) − max(count) > k`: decrement `count[s[left]]`, advance `left`.
4. Update `best` with `right − left + 1`.
5. Return `best`.

#### Why it is correct

- **Every recorded window is valid.** The while loop ends only when `length − max(count) ≤ k`, with `max(count)` computed exactly from the window's counts.
- **For each `right`, the window after shrinking is the longest valid window ending at `right`.** `left` moves past a position `p` only when `[p, r]` was invalid for some `r ≤ right`. A window containing an invalid window is invalid (the monotone property, read the other way), so every window `[q, right]` with `q ≤ p` is invalid too. Nothing longer than the current window ends at `right`.
- **So the maximum over all `right` is the answer**: the best block ends somewhere, and at that right end the window is at least as long as the block.

#### Dry run

`s = "ABBAB"`, `k = 1`.

| right | add | counts (A, B) | length − max | Shrink | Window | best |
|---|---|---|---|---|---|---|
| 0 | A | 1, 0 | 1 − 1 = 0 | no | `[0, 0]` | 1 |
| 1 | B | 1, 1 | 2 − 1 = 1 | no | `[0, 1]` | 2 |
| 2 | B | 1, 2 | 3 − 2 = 1 | no | `[0, 2]` | 3 |
| 3 | A | 2, 2 | 4 − 2 = 2 | drop `A` at 0 → counts 1, 2, check 3 − 2 = 1 | `[1, 3]` | 3 |
| 4 | B | 1, 3 | 4 − 3 = 1 | no | `[1, 4]` | 4 |

Returns 4.

#### Java code

```java title="Approach 2: one window, recompute the max count"
class Solution {
    public int characterReplacement(String s, int k) {
        int[] count = new int[26];
        int left = 0;
        int best = 0;
        for (int right = 0; right < s.length(); right++) {
            count[s.charAt(right) - 'A']++;
            // changes needed = window length - count of its most frequent letter
            while ((right - left + 1) - maxOf(count) > k) {
                count[s.charAt(left) - 'A']--;
                left++;
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }

    private static int maxOf(int[] count) {
        int max = 0;
        for (int c : count) {
            max = Math.max(max, c);
        }
        return max;
    }
}
```

#### Time complexity

**O(26 · n) = O(n) for a fixed alphabet.** `right` advances n times and `left` at most n times in total, so the while condition is evaluated at most 2n times (one failing check per `right`, one passing check per step of `left`). Each evaluation scans 26 counts. With alphabet size σ: O(σ · n).

#### Space complexity

**O(1) auxiliary space**: 26 counts and a few integers (O(σ) in general).

#### The bridge to the next approach

> "The 26-slot scan is the only thing that isn't constant per step. When the window grows, the max can only change to the count of the letter I just added, so that update is free. The problem is shrinking: removing a letter might lower the max, and finding the new max needs the scan."

> "But do I care when the max goes down? I'm looking for the *longest* window. A window longer than my current best needs `length − maxCount ≤ k` with a bigger length, which needs a bigger `maxCount` than any window has had so far. So a max that drops is never going to produce a new record. Let me try keeping `maxFreq` as the largest count I've ever seen, never decreasing it, and see what that does to the window. I have to be careful here, because then the window can hold an invalid substring, and I need to argue the reported length is still right."

### Approach 3: One window, `maxFreq` never decreases (recommended)

#### What I say out loud

> "Same window, but `maxFreq` is the largest count any letter has reached in any window so far. When I add `s[right]`, I update `maxFreq` with that letter's count. If `length − maxFreq > k`, I slide the left end forward by one. I don't recompute `maxFreq` when I remove a letter."

> "With a `maxFreq` that never goes down, the check `length − maxFreq > k` can only fail by one: the window was fine against `maxFreq` after the previous step, it grew by one, and `maxFreq` didn't shrink. So one step of `left` restores it, and the window length never decreases. It grows when there is slack, and otherwise slides along at the same length."

> "The catch I have to be honest about: because `maxFreq` can be stale, the current window may need more than `k` changes. Its length is still a length that some genuinely valid substring has. Let me show that, because it's the whole correctness argument."

#### Intuition

Think of the window length as the record so far, not as "the window ending here". Matching the record needs nothing; beating it by one needs a window of length `best + 1` with at most `k` changes, so it needs some letter to appear at least `best + 1 − k` times in it. That is more than any count seen so far, so `maxFreq` must strictly increase at that moment, and the update when adding `s[right]` sees it. A stale `maxFreq` only matters when no new record is possible, and then the window just slides at its current length.

#### Algorithm

1. `count = new int[26]`, `left = 0`, `maxFreq = 0`, `best = 0`.
2. For each `right`: increment `count[s[right]]`; set `maxFreq = max(maxFreq, count[s[right]])`.
3. If `(right − left + 1) − maxFreq > k`: decrement `count[s[left]]`, advance `left` (one step is always enough, see below).
4. Update `best` with `right − left + 1`.
5. Return `best`.

#### Why it is correct

Write `L` for the window length after step 3. Three facts, each short:

1. **`maxFreq` is at least the true max count of the current window.** A letter's count in the window rises only when that letter is added at `right`, and that is exactly when `maxFreq` is updated; removals only lower counts.
2. **`L` never decreases, and one shrink step is enough.** After the previous step, `L − maxFreq ≤ k`. Adding `s[right]` raises `L` by 1 and does not lower `maxFreq`, so `L − maxFreq ≤ k + 1`, and removing one character fixes it. So the window either grows by one or keeps its length.
3. **`L` never exceeds `maxFreq + k`** (the shrink makes sure of it), and `L` grows by one only if `L + 1 − maxFreq ≤ k` at that step.

Now the two directions:

- **It never reports too much.** Whenever `maxFreq` gets its current value `f`, some window really contained `f` copies of one letter `c`, and that window had length at most `f + k` (fact 3). Extend it to any substring of length `min(n, f + k)` that contains it: that substring still has at least `f` copies of `c`, so it needs at most `k` changes. Every reported `L ≤ maxFreq + k` (and `L ≤ n`), so it is the length of a genuinely valid substring, even when the current window is not that substring.
- **It never reports too little.** Let `[a, b]` be a best block, with letter `c`. While `right ≤ b`, could `left` move past `a`? That happens only if the window `[a, right]` failed the check, that is `(right − a + 1) − maxFreq > k`. But `[a, right]` sits inside `[a, b]`, so it needs at most `k` changes against `c`: `(right − a + 1) − count(c) ≤ k`, and `maxFreq ≥ count(c)` by fact 1. So it passes, `left` stays at or before `a`, and at `right = b` the window contains `[a, b]`.

**The 30-second version to say to the interviewer:**

> "`maxFreq` is the best count I've ever seen, so it's an upper bound on the window's real max. That means I never shrink a window that is truly valid, so the window can't lose the left end of the best block before reaching its right end. In the other direction, the length never exceeds `maxFreq + k`, and since some window really had `maxFreq` copies of a letter, padding that window to `maxFreq + k` characters gives a real valid substring of that length. So the length is right even when the current window itself isn't valid."

#### Dry run

`s = "AABC"`, `k = 1` (answer 3), next to Approach 2 to show where they differ.

| right | add | counts (A, B, C) | maxFreq | L before | L − maxFreq | Approach 3 action | Window | best |
|---|---|---|---|---|---|---|---|---|
| 0 | A | 1, 0, 0 | 1 | 1 | 0 | keep | `[0, 0]` "A" | 1 |
| 1 | A | 2, 0, 0 | 2 | 2 | 0 | keep | `[0, 1]` "AA" | 2 |
| 2 | B | 2, 1, 0 | 2 | 3 | 1 | keep | `[0, 2]` "AAB" | 3 |
| 3 | C | 2, 1, 1 | 2 | 4 | 2 | drop `A` at 0, counts 1, 1, 1 | `[1, 3]` "ABC" | 3 |

At the last step the window is `"ABC"`, whose true max count is 1: it needs 2 changes, more than `k`. Approach 3 does not notice, because `maxFreq` is still 2. It returns 3, which is right: `"AAB"` is a valid substring of that length. Approach 2 at the same step recomputes the max after dropping the first `A` (1, so `3 − 1 = 2 > 1`), drops the second `A` too, and ends with `[2, 3]` = `"BC"`; its `best` is also 3.

On `"ABBAB"` with `k = 1` both approaches go through exactly the steps of the Approach 2 table, because `maxFreq` never gets stale there; both return 4.

#### Java code

```java title="Approach 3: maxFreq never decreases (recommended)"
class Solution {
    public int characterReplacement(String s, int k) {
        int[] count = new int[26];
        int left = 0;
        int maxFreq = 0; // largest count any letter has had in any window so far
        int best = 0;
        for (int right = 0; right < s.length(); right++) {
            int c = s.charAt(right) - 'A';
            count[c]++;
            maxFreq = Math.max(maxFreq, count[c]);
            // The window was within maxFreq + k before this step and grew by one,
            // so a single step of left is enough to bring it back.
            if (right - left + 1 - maxFreq > k) {
                count[s.charAt(left) - 'A']--;
                left++;
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}
```

Writing `while` instead of `if` behaves identically here (the loop body runs at most once, by fact 2), and many people write `while` out of habit. I write `if` and say why, because it shows I know the window never shrinks.

#### Time complexity

**O(n)**, independent of the alphabet size. Each step does a constant amount of work: one increment, one `max`, at most one decrement.

#### Space complexity

**O(1) auxiliary space**: 26 counts and four integers (O(σ) for an alphabet of size σ, since the count array has one slot per letter).

## 5. Comparison table

n = length of `s`; σ = alphabet size (26 here). No approach uses hashing, so expected and worst case are the same.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Brute force over substrings (described, not coded) | O(n²) | O(n²) | O(σ) |
| 1. One window per target letter | O(σ · n) | O(σ · n) | O(1) |
| 2. One window, recompute max count | O(σ · n) | O(σ · n) | O(σ) |
| 3. One window, `maxFreq` never decreases | O(n) | O(n) | O(σ) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Brute force | Correct by inspection, since it tests every substring | About 5 × 10^9 steps at the limit | Only as the stated baseline |
| 1. Per target letter | Simplest invariant (one counter); easy to prove | 26 passes over the string; needs the alphabet listed up front | When the fixed-target idea comes first, or the alphabet is tiny |
| 2. Recompute max | One pass, short and fully rigorous argument | 26-slot scan per check | When you cannot yet argue the stale `maxFreq` version, or the window itself must be valid (for example, to report the substring) |
| 3. Stale `maxFreq` | O(n) regardless of alphabet; least code | The current window may be invalid; the correctness argument is subtle | The default answer, if you can explain why it works |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 3, with its argument. If you cannot reconstruct why the stale `maxFreq` is safe, give Approach 2 instead; for 26 letters it is the same O(n) order, and an interviewer would much rather hear a correct, fully argued O(26·n) than an O(n) you cannot defend.

**Is it optimal?** Yes in time. A correct algorithm must in the worst case look at essentially every character: change any unread character and the answer can change (for instance, in a string of all `A`s with `k = 0`, any unread position might be a `B` that splits the run). So there is an Ω(n) worst-case lower bound, and Approach 3 matches it. Space is a constant 26 counts.

**When another is better in practice:** if you need the substring itself (its start index, or the target letter), Approach 3's final window is not reliable; record the best window in Approach 2, or note the right end where Approach 3's `best` last grew and rebuild from there. With a huge alphabet (Unicode), Approach 1 is unusable and Approach 2's max scan grows with the alphabet; Approach 3 with a hash map of counts stays O(n) expected.

**When to stop:** once you have Approach 3 (or 2) and its argument, stop. The only remaining wins are constant factors, such as reading `s.toCharArray()` once instead of calling `charAt`.

## 7. Interview script: code it and test it

### What I say while coding

> "Count array of 26, `left`, `maxFreq`, `best`. I convert each character with `c − 'A'`, because the input is uppercase."

> "Add the right character, update `maxFreq` from that one count, that's the only count that went up."

> "If the window is longer than `maxFreq + k`, slide `left` by one. An `if` is enough, because the window grew by exactly one."

> "I update `best` after the shrink, never before, so I only record a length that passed the check."

### Testing out loud

**Normal case:** `"ABBAB"`, `k = 1`. Windows: `A`, `AB`, `ABB` (lengths 1, 2, 3, each within `maxFreq + 1`); at `right = 3` the length 4 exceeds `maxFreq + k = 3`, slide to `BBA`; at `right = 4`, `maxFreq` becomes 3, window `BBAB`, length 4. Returns 4.

**`k = 0`:** `"AAAB"`. `A`, `AA`, `AAA` with `maxFreq` 1, 2, 3; then `B`: length 4, `4 − 3 = 1 > 0`, slide to `AAB`. `best` stayed 3. Correct. (`"BAAAB"` behaves the same way and also returns 3.)

**Single character:** `"A"`, any `k`. One step, length 1, returns 1.

**`k` covers everything:** `"ABCD"`, `k = 3`. `maxFreq` stays 1; lengths 1 to 4 all satisfy `length − 1 ≤ 3`; returns 4.

**All different, `k = 0`:** `"ABCD"`. After the first step every addition makes `2 − 1 = 1 > 0`, so the window slides at length 1. Returns 1.

**Stale window:** `"AABC"`, `k = 1`. As in the dry run: returns 3 although the final window `"ABC"` is not itself valid.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify and solve one example by hand | 2–3 min | Substring, at most `k`, the cost formula `length − maxCount` |
| Brute force | about 1 min | Say it, O(n²), too slow at 10^5 |
| Derive the window | 3–4 min | Monotone validity; per-letter version or the recompute version |
| Code | 4–5 min | Approach 2 or 3 |
| Argue and test | 4–5 min | Why one shrink step is enough; `"AABC"`; `k = 0` |
| Challenges | the rest | The stale `maxFreq` question will come |

**Where the time should go:** the correctness argument. Many candidates have memorised the stale `maxFreq` code; what distinguishes you is explaining it. If you cannot, say so plainly and present Approach 2 as your answer, mentioning that the max scan could be avoided.

**If you are stuck:** fix the target letter (Approach 1). It turns the problem into "longest window with at most `k` bad characters", which is a standard window, and leads to the general version once it works.

## 9. Interviewer challenges

### About the stale `maxFreq`

#### Why don't you decrease `maxFreq` when you remove a character?

**What they are testing:** whether you understand the trick or have memorised it.

**How to reason:** separate "is this window valid?" from "can this step beat the record?". A record needs a larger `maxFreq` than ever before.

**What I say:** "I only care about windows longer than the best so far. A longer window with at most `k` changes needs some letter to appear more often than any letter has in any window so far, so when that happens, `maxFreq` goes up on the step that adds that letter. A stale value never causes a wrong record, because the reported length never exceeds `maxFreq + k`, and some real substring of that length is valid: the window that set `maxFreq`, padded with up to `k` neighbours."

**Nuance:** keeping the max exact is not wrong either; it is Approach 2, which costs a 26-slot scan, or O(1) with a bucket-of-counts structure, which is not worth it for 26 letters.

#### Is the window always valid at the end of each step?

**What they are testing:** honesty about what the invariant is.

**How to reason:** run `"AABC"`, `k = 1`.

**What I say:** "No. On `"AABC"` the final window is `"ABC"`, which needs two changes. The invariant is about the length, not the contents: the length equals the best answer for the prefix processed so far. If you asked me for the substring itself, I'd record the position when `best` grows, or use the exact-max version."

**Nuance:** the length at each step is `min(right + 1, maxFreq + k)`, which shows directly that the window behaves like a counter tied to `maxFreq`.

#### Why is `if` enough? Wouldn't `while` be safer?

**What they are testing:** whether you can reason about how far the window can be off.

**How to reason:** the previous window satisfied `length − maxFreq ≤ k`; the length grew by one and `maxFreq` did not drop.

**What I say:** "After adding one character the window can exceed the limit by at most one, so one step restores it. `while` would run its body at most once, so it's identical; I use `if` because it states what happens."

**Nuance:** in Approach 2, with an exact max, a `while` is the natural form and it can run several times in one step (as on `"AABC"`).

### About complexity and alternatives

#### Isn't O(26·n) the same as O(n)? Why bother with the trick?

**What they are testing:** whether you can weigh asymptotics against simplicity.

**How to reason:** 26 is a constant fixed by the problem.

**What I say:** "For this alphabet, yes, both are O(n), and Approach 2 is a perfectly good answer. The trick matters if the alphabet is large, like Unicode, where scanning all counts per step is expensive. It also gets rid of a helper method."

**Nuance:** with a large alphabet you would also switch the count array to a hash map, which makes the bound O(n) expected rather than guaranteed.

#### Could you binary search on the answer?

**What they are testing:** whether you see other structures in the problem.

**How to reason:** if some window of length `L` is valid, a window of length `L − 1` is valid (drop an end). So "some valid window of length `L` exists" is monotone in `L`.

**What I say:** "Yes. For a candidate length, slide a fixed-size window and check `L − maxCount ≤ k` for each position, O(26·n) per check, O(26·n·log n) total. It's correct but slower and longer than the variable window, so I'd only mention it."

**Nuance:** the test file for this page uses that method as an independent check on large inputs.

## 10. Follow-up questions the interviewer might ask

**"Return the substring, not just its length."**
Use Approach 2 (exact max), where every recorded window is valid, and store `left` whenever `best` improves; return `s.substring(bestLeft, bestLeft + best)`. O(26·n) time, O(1) auxiliary space apart from the returned string. Approach 3 is the wrong base here, because its current window can be invalid, as on `"AABC"`.

**"The string can contain any Unicode characters."**
Replace the array with a `HashMap<Integer, Integer>` of code-point counts and use Approach 3: the stale `maxFreq` avoids scanning the map. O(n) expected time, O(d) space for d distinct characters in a window. Approach 1 would need one pass per distinct character, O(d · n).

**"Binary string only, and you may flip at most k zeros to ones."**
This is the same window with a fixed target letter (Approach 1 with one pass): longest window with at most `k` zeros. O(n) time, O(1) space.

**"Each replacement has a cost, with a total budget."**
With a fixed target letter, the window's cost is the sum of the costs of the non-target characters in it, and it still only grows when the window grows, so Approach 1's window works: one pass per target letter, O(σ · n). Approach 3's stale-max trick no longer applies, because the cost is no longer a function of the max count alone.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Counting distinct letters instead of non-majority characters.** "The window has two distinct letters, so it needs one change" is wrong; `"AABB"` needs two. The cost is `length − maxCount`.
- **Treating `k` as a budget shared across the whole string.** Changes outside the chosen substring do nothing for it, so each candidate window gets the full `k`. There is nothing global to track.
- **Believing the stale-`maxFreq` window is always valid.** It is not (`"AABC"`). Say what the invariant really is: the length is right, the contents might not be.
- **Calling the recompute version O(n²) or the stale version O(1) per step "because of the array".** The scan is 26 slots; say O(26·n), and state that 26 is fixed by the input alphabet.

### Implementation mistakes

> [!MISTAKE] Recording the length before shrinking
> Writing `best = Math.max(best, right - left + 1)` before the shrink records invalid windows. On `"AAAB"` with `k = 0` it returns 4 instead of 3. Update `best` after the window has been checked.

- **`s.charAt(i) - 'a'` on uppercase input.** `'A' − 'a'` is −32, so the index is negative and the code throws `ArrayIndexOutOfBoundsException`. Use `'A'`.
- **Forgetting to update `maxFreq`.** It stays 0, so the window can never hold more than `k` characters: `"AAAB"` with `k = 0` returns 0. Only the letter just added can raise the max, so update from `count[c]` right after the increment.
- **Reporting the final window as the answer substring** in the stale version.

## 12. Pattern recognition

**The pattern:** variable-size sliding window over a monotone condition. A substring "fits" if it needs at most `k` changes; fitting is preserved when the window shrinks, so two forward-only pointers explore every candidate.

**Signals in the problem statement:**

- "Longest substring" or "longest subarray" such that some cost is at most `k`.
- The cost of a window can be maintained from counts as characters enter and leave.
- Small fixed alphabet, which makes a count array possible.

**Related problems in this list:**

- [[nc-longest-substring-without-repeating-characters|Longest Substring Without Repeating Characters]]: the same variable window, with "no letter appears twice" as the condition.
- [[nc-permutation-in-string|Permutation in String]]: a fixed-size window over letter counts.
- [[nc-minimum-window-substring|Minimum Window Substring]]: the window shrinks to find the shortest valid window instead of the longest.
- [[nc-minimum-size-subarray-sum|Minimum Size Subarray Sum]]: a variable window over sums.
- [[nc-best-time-to-buy-and-sell-stock|Best Time to Buy and Sell Stock]]: the simplest two-index scan in the sliding-window category.

**Takeaway:** when a question asks for the longest window whose cost stays within a budget, check that shrinking never raises the cost; then one window with forward-only pointers finds it, and for a "longest" question the window never has to shrink below the best length found so far.

## 13. 60-second revision card

**Key insight:** a substring needs `length − maxCount` changes. The window is valid if that is at most `k`, and validity is preserved when it shrinks.

**Invariant (Approach 3):** `maxFreq` is the largest count seen so far, an upper bound on the window's true max; the window length equals the best answer so far, and the window never drops the left end of a best block before reaching its right end.

**Complexity:** O(n) time, O(1) auxiliary space (26 counts). Exact-max version: O(26·n).

**Code skeleton:**

```java title="Character replacement in one loop" fragment="public int characterReplacement(String s, int k)"
int[] count = new int[26];
int left = 0, maxFreq = 0, best = 0;
for (int right = 0; right < s.length(); right++) {
    maxFreq = Math.max(maxFreq, ++count[s.charAt(right) - 'A']);
    if (right - left + 1 - maxFreq > k) {          // at most one step too long
        count[s.charAt(left++) - 'A']--;
    }
    best = Math.max(best, right - left + 1);       // after the check, never before
}
return best;
```

**Main traps:**

- Cost is `length − maxCount`, not "distinct letters − 1".
- Record `best` after the shrink.
- The stale-`maxFreq` window can be invalid; only its length is guaranteed.
- `'A'`, not `'a'`.

**What to say in one breath:** "A window needs length minus its most frequent count changes, and shrinking never makes that worse, so I slide a window with 26 counts. I keep `maxFreq` as the best count ever seen, because only a bigger `maxFreq` can produce a longer valid window; the window length then never shrinks, it's O(n), and the reported length is always achievable even if the current window isn't."
