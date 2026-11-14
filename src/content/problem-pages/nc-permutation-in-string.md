---
problemId: nc-permutation-in-string
title: Permutation In String
source: neetcode
sourceUrl: https://leetcode.com/problems/permutation-in-string/
difficulty: medium
patterns: [sliding-window, frequency-counting]
relatedLessons: [a2-sliding-window, a2-frequency-counting, a2-sorting-based, a14-brute-force-first, a14-deriving-optimization, a14-edge-cases]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

You get two strings, `s1` and `s2`. Decide whether some rearrangement of `s1` appears in `s2` as a block of consecutive characters. In other words: is there a stretch of `s2`, exactly as long as `s1`, that uses the same letters as `s1`, each the same number of times? Return `true` or `false`.

**Example 1**

- Input: `s1 = "ab"`, `s2 = "cbad"`
- Output: `true`
- Why: `s2` contains `"ba"` at indices 1 and 2, which is a rearrangement of `"ab"`.

**Example 2**

- Input: `s1 = "aab"`, `s2 = "abbab"`
- Output: `false`
- Why: the length-3 stretches of `s2` are `"abb"`, `"bba"` and `"bab"`. Each has one `a` and two `b`s, but `s1` needs two `a`s and one `b`. The right letters are there, in the wrong amounts.

**What the problem statement guarantees**

- Both strings have between 1 and 10^4 characters.
- Both consist of lowercase English letters only.
- Nothing says `s1` is shorter than `s2`; it may be longer.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 20 minutes and talk out loud.
2. Decide what "is a rearrangement of `s1`" means in terms you can check quickly, without generating rearrangements.
3. Say the simplest correct solution and its cost when both strings have 10^4 characters.
4. Look at two neighbouring candidate stretches of `s2`. How much do they differ?
5. Code it and trace it on `s1 = "abc"`, `s2 = "cbxacb"` (the answer is `true`, and only the last stretch works).

Open a hint only after two minutes without progress.

> [!HINT] Hint 1: a small nudge
> Two strings are rearrangements of each other exactly when they contain the same letters with the same counts. So you need a stretch of `s2` of length `s1.length` whose letter counts equal those of `s1`. Which stretches are candidates?

> [!HINT] Hint 2: the kind of tool you need
> Use a fixed-size sliding window of length `s1.length` over `s2`, with a 26-slot count array. Moving the window one step adds one character on the right and removes one on the left, so the counts can be updated in constant time instead of recounted.

> [!HINT] Hint 3: almost the whole plan
> Count `s1` into `need` and the first window of `s2` into `window`. Compare; then for each next position, add the entering character, remove the leaving one, and compare again. Comparing two 26-slot arrays costs 26 steps; to make each step constant, keep a counter of how many of the 26 letters currently have equal counts, and update it only for the two letters that changed. Handle `s1` longer than `s2` before anything else.

**Check yourself before revealing the walkthrough**

- [ ] I check counts, not just which letters appear (Example 2)
- [ ] I said a correct but slower solution and its cost first
- [ ] My code returns `true` for `"abc"` / `"cbxacb"`, where only the last stretch matches
- [ ] My code returns `false`, without crashing, when `s1` is longer than `s2`

## 3. Interview script: understand the problem (≈2 min)

**Me:** Let me restate. I'm looking for a substring of `s2` that is a permutation of `s1`. So a contiguous block of `s2`, same length as `s1`, same multiset of letters. I return a boolean.

**Interviewer:** Correct.

**Me:** Same multiset, so the counts must match, not just the set of letters? With `s1 = "aab"`, a window `"abb"` doesn't count.

**Interviewer:** Right, it has to be a real rearrangement.

**Me:** What are the sizes and the alphabet?

**Interviewer:** Both up to 10^4, lowercase English letters.

**Me:** So counts fit in an `int[26]`, and every count is at most 10^4, no overflow anywhere. Can `s1` be longer than `s2`?

**Interviewer:** The constraints allow it.

**Me:** Then the answer is `false` without looking further, and I must make sure my code doesn't index past the end of `s2` while setting up. Do you need the position of the match?

**Interviewer:** No, just true or false.

**Me:** Let me try one. `s1 = "ab"`, `s2 = "cbad"`. Candidate windows of length 2: `"cb"`, `"ba"`, `"ad"`. `"ba"` has one `a` and one `b`, same as `s1`. True. So the candidates are exactly the `n − m + 1` windows of length `m`, where `n = s2.length` and `m = s1.length`, and the question for each is "same counts?".

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ `s1.length`, `s2.length` ≤ 10^4 | Neither string is empty. Checking each of up to 10^4 windows from scratch costs up to about n·m, around 2.5 × 10^7 count updates at m = n/2: it would run, but a window that updates in constant time is linear. |
| Lowercase English letters only | A 26-slot count array indexed by `c − 'a'`; comparing two count arrays takes 26 steps. |
| `s1` may be longer than `s2` | No window of length `m` exists, so return `false` before building the first window. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Counts must match, not only the set of letters | Compare count arrays, not sets of present letters. |
| Only a boolean is returned | I can return at the first matching window. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| Inputs respect the constraints | I don't validate characters; a non-lowercase character would index outside the count array. |

### Edge cases I will keep in mind

- `s1` longer than `s2`: `"abc"`, `"ab"` gives `false`.
- Equal lengths: one window, the whole of `s2` (`"ab"`, `"ba"` gives `true`).
- `s1` of length 1: any occurrence of that letter.
- The match is the first window (`"ab"`, `"abx"`) or the last one (`"ab"`, `"xab"`, and `"abc"`, `"cbxacb"`).
- The right letters, wrong counts: `"aab"`, `"abbab"` gives `false`.
- The right letters, not adjacent: `"zz"`, `"azaz"` gives `false`.

## 4. Think out loud: from first idea to best solution

### Approach 1: Sort each window and compare

#### What I say out loud

> "The most literal brute force would generate every permutation of `s1` and search for each in `s2`. That's up to m! permutations, hopeless for m = 10^4, so I'll drop it right away."

> "A better baseline: two strings are permutations of each other exactly when they're equal after sorting. So I sort `s1` once, then for each of the `n − m + 1` windows of `s2` I copy it, sort it and compare. That's correct, and costs about `(n − m + 1) · m log m`."

#### Intuition

Sorting puts the letters of any rearrangement of `s1` into the same order, so "sorted window equals sorted `s1`" is a check that ignores order and respects counts. The match must be a window of length `m`, so checking all of them cannot miss it.

#### Algorithm

1. If `m > n`, return `false`.
2. Sort the characters of `s1` into `target`.
3. For each `start` from 0 to `n − m`: copy `s2[start .. start + m)`, sort it, and return `true` if it equals `target`.
4. Return `false`.

#### Why it is correct

- **It returns only valid answers.** Equal sorted strings have the same letters with the same counts, so the window is a permutation of `s1`.
- **It cannot miss one.** A permutation of `s1` in `s2` is a window of length `m` starting somewhere in `0 .. n − m`, and every such window is checked.

#### Dry run

`s1 = "ab"`, `s2 = "cbad"`. `target = "ab"`.

| start | window | sorted | equal to `"ab"`? |
|---|---|---|---|
| 0 | `"cb"` | `"bc"` | no |
| 1 | `"ba"` | `"ab"` | yes, return `true` |

#### Java code

```java title="Approach 1: sort every window"
import java.util.Arrays;

class Solution {
    public boolean checkInclusion(String s1, String s2) {
        int m = s1.length();
        int n = s2.length();
        if (m > n) {
            return false;
        }
        char[] target = s1.toCharArray();
        Arrays.sort(target);
        for (int start = 0; start + m <= n; start++) {
            char[] window = s2.substring(start, start + m).toCharArray();
            Arrays.sort(window);
            if (Arrays.equals(window, target)) {
                return true;
            }
        }
        return false;
    }
}
```

#### Time complexity

**O((n − m + 1) · m log m)** with a comparison sort, where n = `s2.length` and m = `s1.length`: each of the `n − m + 1` windows is copied (m steps), sorted (m log m) and compared (m). The product is largest around m = n/2, which gives O(n² log n) in the worst case; for n = 10^4 that is roughly 5,000 windows × 5,000 characters × a log factor of about 12, around 3 × 10^8 steps. Current JDKs sort large `char` arrays with a counting sort, which removes the log factor in practice; that is implementation behaviour, not something `Arrays.sort` promises.

#### Space complexity

**O(m) auxiliary space** for the sorted copy of `s1` and the window copy, plus whatever the library sort uses internally, which depends on the implementation.

#### The bridge to the next approach

> "Where's the waste? Neighbouring windows share `m − 1` characters, and I re-sort all of them every time. Sorting also produces more than I need: the order. All I need is the count of each letter. Counts are easy to update when the window moves: the entering character's count goes up by one, the leaving one's goes down by one. Two updates per step instead of a sort."

> "Then the check is 'do these two count arrays match?' With 26 letters, comparing them is 26 steps. That's constant, so the whole thing is linear. Let me write that."

### Approach 2: Fixed window, compare count arrays (co-recommended: lowest risk)

#### What I say out loud

> "I count `s1` into `need` and the first `m` characters of `s2` into `window`. If they're equal, done. Then I slide: for `right` from `m` to `n − 1`, add `s2[right]`, remove `s2[right − m]`, compare. `Arrays.equals` compares the contents of two `int` arrays, element by element."

#### Intuition

A permutation of `s1` is a window of length `m` with the same letter counts. A fixed-size window keeps those counts current with two updates per step, so the only cost per window is the comparison, which is bounded by the alphabet size.

#### Algorithm

1. If `m > n`, return `false`.
2. For `i` in `0 .. m − 1`: increment `need[s1[i]]` and `window[s2[i]]`.
3. If `need` equals `window`, return `true`.
4. For `right` from `m` to `n − 1`: increment `window[s2[right]]`, decrement `window[s2[right − m]]`; if `need` equals `window`, return `true`.
5. Return `false`.

#### Why it is correct

**Invariant:** after setup, and after each slide, `window` holds the letter counts of `s2[right − m + 1 .. right]`, the current window of length `m`. It is true after setup (the first `m` characters), and each slide adds the new right character and removes the character that just left on the left.

- **It returns only valid answers.** It returns `true` only when the current window's counts equal `s1`'s, which means the window is a permutation of `s1`.
- **It cannot miss one.** Every window start from 0 to `n − m` is compared exactly once: start 0 after setup, start `right − m + 1` after each slide.

#### Dry run

`s1 = "abc"`, `s2 = "cbxacb"`. `need`: a 1, b 1, c 1. Only the letters that ever have a nonzero count are shown.

| Step | Enters | Leaves | Window | counts (a, b, c, x) | Equal to `need`? |
|---|---|---|---|---|---|
| setup | | | `"cbx"` | 0, 1, 1, 1 | no |
| right = 3 | a | c | `"bxa"` | 1, 1, 0, 1 | no |
| right = 4 | c | b | `"xac"` | 1, 0, 1, 1 | no |
| right = 5 | b | x | `"acb"` | 1, 1, 1, 0 | yes, return `true` |

#### Java code

```java title="Approach 2: fixed window, compare count arrays"
import java.util.Arrays;

class Solution {
    public boolean checkInclusion(String s1, String s2) {
        int m = s1.length();
        int n = s2.length();
        if (m > n) {
            return false; // no window of length m exists
        }
        int[] need = new int[26];
        int[] window = new int[26];
        for (int i = 0; i < m; i++) {
            need[s1.charAt(i) - 'a']++;
            window[s2.charAt(i) - 'a']++;
        }
        if (Arrays.equals(need, window)) {
            return true;
        }
        for (int right = m; right < n; right++) {
            window[s2.charAt(right) - 'a']++;      // enters on the right
            window[s2.charAt(right - m) - 'a']--;  // leaves on the left
            if (Arrays.equals(need, window)) {
                return true;
            }
        }
        return false;
    }
}
```

#### Time complexity

**O(m + 26 · (n − m + 1)) = O(26 · n)**, which is O(n) for this fixed alphabet. Setup is m steps; each of the `n − m + 1` windows costs two updates and a 26-slot comparison. Since `m ≤ n`, the total is O(26·n), about 2.6 × 10^5 steps at the limit. With alphabet size σ, O(m + σ · n).

#### Space complexity

**O(1) auxiliary space**: two arrays of 26 integers (O(σ) in general).

#### The bridge to the next approach

> "This is linear for lowercase letters. If you wanted it independent of the alphabet, the comparison is what's left: each slide changes only two counts, but I compare all 26. Instead, I can keep a number `matches`: how many of the 26 letters currently have `window[c] == need[c]`. A slide changes two letters, so only those two can change `matches`. The window is a permutation when `matches == 26`."

> "The care is in the update. When a count changes, `matches` goes up if it just became equal, down if it was equal and just stopped being equal, and otherwise stays the same. I'll write those cases out explicitly."

### Approach 3: Fixed window with a match counter (co-recommended: O(n))

#### What I say out loud

> "Same window. `matches` counts letters whose window count equals their `need` count, all 26 of them, including letters that appear in neither string, since 0 equals 0. After setup I compute it once in 26 steps. Then each slide does: add the entering letter and fix `matches` for it, remove the leaving letter and fix `matches` for it. Check `matches == 26` before each slide, and once more after the last one."

#### Intuition

Equality of two count arrays is the statement "all 26 slots agree". A slide touches two slots, so instead of re-checking all of them, track how many agree and adjust for the two that changed. A single increment of `window[c]` can only move slot `c` from "equal" to "one too many", or from "one too few" to "equal", or between two unequal states; the same holds for a decrement.

#### Algorithm

1. If `m > n`, return `false`.
2. Build `need` and `window` as in Approach 2, then `matches` = number of `c` with `need[c] == window[c]`.
3. For `right` from `m` to `n − 1`:
4. If `matches == 26`, return `true` (the window ending at `right − 1` matches).
5. Add `in = s2[right]`: `window[in]++`; if it now equals `need[in]`, `matches++`; else if it is now `need[in] + 1` (it was equal before), `matches--`.
6. Remove `out = s2[right − m]`: `window[out]--`; if it now equals `need[out]`, `matches++`; else if it is now `need[out] − 1` (it was equal before), `matches--`.
7. Return `matches == 26` (the check for the last window).

#### Why it is correct

**Invariant:** at the top of each loop iteration and at the end, `window` holds the counts of the current window of length `m`, and `matches` is the number of letters `c` with `window[c] == need[c]`.

- The window part is the same as in Approach 2.
- `matches` stays exact because each update looks at one slot before and after a change of ±1. After an increment, the slot is equal now only if it was one short before (so `matches` gains one), and it was equal before only if it is one over now (so `matches` loses one); in any other case it was unequal and stays unequal. The decrement is the mirror image. When `in == out`, the two updates cancel, as they should.
- `matches == 26` means all 26 slots agree, so the window is a permutation of `s1`. Every window is checked: windows starting at 0 to `n − m − 1` at the top of the loop, and the last one by the final `return`.

**The 20-second version to say to the interviewer:**

> "The window always holds the counts of `m` consecutive characters, and `matches` is how many of the 26 letters agree with `s1`'s counts. A slide changes two counts by one each, so I adjust `matches` only for those: plus one if a count just became equal, minus one if it was equal and just moved off. All 26 agreeing means this window is a permutation. I check before each slide and once after the loop, so no window is skipped."

#### Dry run

`s1 = "abc"`, `s2 = "cbxacb"`. Setup window `"cbx"`: a 0/1, b 1/1, c 1/1, x 1/0 (window/need); `a` and `x` disagree, the other 24 letters agree, so `matches = 24`.

| right | Top check | Enters | After adding | Leaves | After removing | Window | matches |
|---|---|---|---|---|---|---|---|
| 3 | 24, no | a | a 1/1, equal: 25 | c | c 0/1, was equal: 24 | `"bxa"` | 24 |
| 4 | 24, no | c | c 1/1, equal: 25 | b | b 0/1, was equal: 24 | `"xac"` | 24 |
| 5 | 24, no | b | b 1/1, equal: 25 | x | x 0/0, equal: 26 | `"acb"` | 26 |

The loop ends; the final `return matches == 26` returns `true`. This is the case that a missing final check gets wrong.

#### Java code

```java title="Approach 3: match counter (co-recommended)"
class Solution {
    public boolean checkInclusion(String s1, String s2) {
        int m = s1.length();
        int n = s2.length();
        if (m > n) {
            return false;
        }
        int[] need = new int[26];
        int[] window = new int[26];
        for (int i = 0; i < m; i++) {
            need[s1.charAt(i) - 'a']++;
            window[s2.charAt(i) - 'a']++;
        }
        int matches = 0; // letters c with window[c] == need[c]
        for (int c = 0; c < 26; c++) {
            if (window[c] == need[c]) {
                matches++;
            }
        }
        for (int right = m; right < n; right++) {
            if (matches == 26) {
                return true;
            }
            int in = s2.charAt(right) - 'a';
            window[in]++;
            if (window[in] == need[in]) {
                matches++;
            } else if (window[in] == need[in] + 1) {
                matches--; // it was equal before this increment
            }
            int out = s2.charAt(right - m) - 'a';
            window[out]--;
            if (window[out] == need[out]) {
                matches++;
            } else if (window[out] == need[out] - 1) {
                matches--; // it was equal before this decrement
            }
        }
        return matches == 26; // the last window
    }
}
```

#### Time complexity

**O(m + n + 26) = O(n)**, since `m ≤ n` after the early return. Setup is m steps plus one 26-slot pass; each slide is constant work. With alphabet size σ, O(n + σ): the alphabet now costs once, not per window.

#### Space complexity

**O(1) auxiliary space**: two arrays of 26 integers and a few counters.

### Alternative: one difference array

Keep a single array `diff[c] = window[c] − need[c]` and a counter of nonzero slots; the window matches when the counter is 0. It is the same idea as Approach 3 with one array instead of two, and the same two-case update per slot. Pick whichever form you can write without hesitation; the trade-offs are identical.

## 5. Comparison table

n = `s2.length`, m = `s1.length` (m ≤ n after the early return), σ = alphabet size (26). No approach uses hashing, so expected and worst case agree.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Generate permutations (described, not coded) | O(m! · n · m) | O(m! · n · m) | O(m) |
| 1. Sort every window | O((n − m + 1) · m log m) | O(n² log n) | O(m) plus the sort's internals |
| 2. Count arrays, compare each step | O(m + σ · n) | O(m + σ · n) | O(σ) |
| 3. Match counter | O(n + σ) | O(n + σ) | O(σ) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Sort every window | Needs only "permutation = same sorted string"; hard to get wrong | Quadratic-times-log; copies every window | As a stated baseline, or for a one-off check with tiny inputs |
| 2. Compare count arrays | Linear for a fixed alphabet; very few places for a bug | Each window costs σ to compare | The default code to write with 26 letters |
| 3. Match counter | Linear regardless of alphabet; constant work per slide | Four-way update logic and a final check that are easy to get wrong | When asked to remove the σ factor, or with a large alphabet (using a map) |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approaches 2 and 3 are both strong answers, and the choice between them is about implementation risk, not asymptotics. With 26 letters, Approach 2 is O(26·n), already linear, and its slide is two lines plus `Arrays.equals`, so there is very little to get wrong. Approach 3 removes the factor 26, but its update has four branches and needs the extra check after the loop; each of those is a common bug, and both are shown with their wrong outputs in section 11. My default is to code Approach 2, state its complexity, and then say "if you want the per-window cost independent of the alphabet, I'd keep a match counter" and write Approach 3 if asked.

**Is it optimal?** Yes in time. In the worst case a correct algorithm must read essentially all of `s2` (an unread character could complete or spoil a window) and essentially all of `s1` (an unread character changes the counts to match), so there is an Ω(n + m) worst-case lower bound; Approach 3 matches it, and Approach 2 matches it for a fixed alphabet. Space is O(1) for a fixed alphabet.

**When another is better in practice:** for a large alphabet such as Unicode, Approach 2's per-window comparison grows with the alphabet, so use Approach 3 with hash maps.

**When to stop:** once you have Approach 2 or 3 with the `m > n` guard and the last-window check. Constant-factor tweaks (a `char[]` instead of `charAt`) are not worth interview time.

## 7. Interview script: code it and test it

### What I say while coding

> "First, if `s1` is longer than `s2`, return false; otherwise my setup loop would read past the end of `s2`."

> "Two count arrays, filled together over the first `m` characters, then one comparison for the first window."

> "In the loop, `right` is the index entering; the one leaving is `right − m`, so the window stays exactly `m` long."

> "`Arrays.equals`, not `==`: `==` on arrays compares references."

### Testing out loud

**Normal case:** `"ab"`, `"cbad"`. Setup window `"cb"`: b 1, c 1, not equal. `right = 2`: add `a`, remove `c`, window `"ba"`: a 1, b 1, equal. Returns `true`.

**`s1` longer than `s2`:** `"abc"`, `"ab"`: the guard returns `false` before any indexing.

**Equal lengths:** `"ab"`, `"ba"`. Setup covers the whole of `s2`; counts are equal; returns `true` without entering the loop.

**Wrong counts:** `"aab"`, `"abbab"`. Windows `"abb"`, `"bba"`, `"bab"` all have a 1, b 2 against a 2, b 1. Returns `false`.

**Match at the last window:** `"abc"`, `"cbxacb"`, as in the dry run: Approach 2 compares after the last slide, Approach 3 returns `matches == 26` after the loop. Both return `true`.

**Letters present but apart:** `"zz"`, `"azaz"`. Windows `"az"`, `"za"`, `"az"` each have one `z`. Returns `false`.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1–2 min | Counts matter; `s1` may be longer; boolean only |
| Baselines | 1–2 min | Permutations (no), sort each window (yes, and its cost) |
| Derive the window | 2–3 min | Only counts matter; neighbouring windows differ by two characters |
| Code | 4–5 min | Approach 2, then Approach 3 if asked |
| Test | 3 min | Last-window match, `m > n`, wrong counts |
| Challenges | the rest | Why 26 in `matches`; Unicode; returning all positions |

**Where the time should go:** tests on the boundaries. The algorithm is short; the bugs are in the setup (`m > n`), the last window, and the match-counter update.

**If you are stuck:** solve Example 1 by hand and notice that you are comparing letter counts of each length-2 stretch. Then ask what changes between two neighbouring stretches.

## 9. Interviewer challenges

### About the solution

#### Why does `matches` start by counting all 26 letters, including ones in neither string?

**What they are testing:** whether you understand what `matches == 26` means.

**How to reason:** the goal is "every slot agrees". A letter missing from both has 0 = 0, which is agreement.

**What I say:** "`matches == 26` has to mean all 26 counts agree. Letters absent from both strings agree from the start, so they must be counted; otherwise the target number would depend on `s1`. If I only wanted to track letters in `s1`, I'd need a different target and would still have to notice extra letters in the window, which is exactly what the absent-letter slots do."

**Nuance:** the difference-array form avoids the question by counting nonzero slots and waiting for zero.

#### Why compare counts instead of checking that each window's letters are in `s1`?

**What they are testing:** the multiset versus set distinction.

**How to reason:** Example 2.

**What I say:** "A set check would say `"abb"` matches `"aab"`, since both use only `a` and `b`. A permutation must have the same count of each letter, so I compare counts."

**Nuance:** a quick prefilter "every character is in `s1`" is correct but not sufficient, so it adds code without removing any.

#### Why is the window size fixed, when many window problems grow and shrink?

**What they are testing:** whether you chose the window type for a reason.

**How to reason:** a permutation of `s1` has length exactly `m`.

**What I say:** "Any permutation of `s1` has exactly `m` characters, so the only candidates are windows of length `m`. A variable window would be the tool for 'longest' or 'shortest' window with some property; here the length is given."

**Nuance:** a variable-window version also exists: grow right, and shrink from the left whenever a letter's count exceeds its `need`; a match is when the window length reaches `m`. It works but is harder to argue than the fixed window.

### About complexity

#### Is O(26·n) really O(n)?

**What they are testing:** precision about constants versus parameters.

**How to reason:** 26 is fixed by the input alphabet, not by the input size.

**What I say:** "For this problem, yes: the alphabet is fixed at 26, so it's a constant factor. If the alphabet were a parameter σ, it's O(σ·n), and the match counter brings that to O(n + σ)."

**Nuance:** with a map instead of an array, the bounds become expected rather than guaranteed.

## 10. Follow-up questions the interviewer might ask

**"Return every starting index where a permutation of `s1` begins."**
Same window, but record `right − m + 1` (or 0 for the first window) whenever the counts match, instead of returning. O(n) time with the match counter, O(1) auxiliary space plus the output list.

**"The strings contain arbitrary Unicode characters."**
Use hash maps of code-point counts and the match counter (or the difference-map form, removing keys whose difference reaches 0 and checking the map is empty). Comparing two maps per window would cost up to the number of distinct characters each time. O(n + m) expected time, O(d) space for d distinct characters.

**"Many different `s1` queries against one long `s2`."**
Each query is still one O(n + m) pass with this method. Grouping queries of the same length lets one pass over `s2` serve all of them: key each query by its count signature (as in grouping anagrams), and look up each window's signature in that table; with the 26-count signature as the key, that is O(26) per window plus expected O(1) hashing per lookup.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Generating permutations.** It is the literal reading of the statement and costs m!; the counts make it unnecessary.
- **Checking which letters appear, not how often.** `"abb"` is not a permutation of `"aab"`.
- **Using a variable window by habit.** The length of a match is known: it is `m`.

### Implementation mistakes

> [!MISTAKE] Forgetting the last window in the match-counter version
> With the check at the top of the loop, the final window is never checked inside the loop. Returning `false` after the loop instead of `matches == 26` makes `"abc"`, `"cbxacb"` return `false`.

> [!MISTAKE] Decrementing `matches` on every unequal update
> Writing `if (window[in] == need[in]) matches++; else matches--;` subtracts even when the slot was already unequal, so `matches` drifts. With `s1 = "c"`, `s2 = "aacbca"` it returns `false`, although `"c"` occurs. Only decrement when the slot was equal before the change.

- **No `m > n` guard.** The setup loop reads `s2.charAt(i)` for `i < m`; `"abc"`, `"ab"` throws `StringIndexOutOfBoundsException` instead of returning `false`.
- **Comparing arrays with `==` or `need.equals(window)`.** Both compare references for arrays and are always `false` for two different arrays: `"ab"`, `"cbad"` returns `false`. Use `Arrays.equals`.
- **Removing the wrong character.** The leaving index is `right − m`, not `right − m + 1`. Off by one, the counts still total `m`, but they describe the wrong characters: one that is still inside the window is removed, and the one that left stays counted.

## 12. Pattern recognition

**The pattern:** fixed-size sliding window over letter counts. When a match must have a known length and the test depends only on letter counts, slide a window of that length and update the counts by one character in, one out.

**Signals in the problem statement:**

- "Permutation", "anagram" or "rearrangement" of a given string, inside another string.
- The match is contiguous, and its length is determined by the input.
- A small alphabet, so counts fit in an array.

**Related problems in this list:**

- [[nc-valid-anagram|Valid Anagram]]: the single-window version of the same count comparison.
- [[nc-group-anagrams|Group Anagrams]]: count signatures used as hash keys.
- [[nc-minimum-window-substring|Minimum Window Substring]]: a variable window with the same need/have counting and a satisfied-letters counter.
- [[nc-longest-repeating-character-replacement|Longest Repeating Character Replacement]]: a variable window over letter counts.
- [[nc-contains-duplicate-ii|Contains Duplicate II]]: another window of fixed size, sliding one element at a time.

**Takeaway:** "Is there a substring that is an anagram of `p`?" means a window of length `p.length` with a count array; keep a counter of agreeing slots if you need constant work per step.

## 13. 60-second revision card

**Key insight:** a permutation of `s1` is a window of length `m` with the same letter counts. Neighbouring windows differ by one character in and one out.

**Invariant:** `window` holds the counts of the current `m` characters; `matches` is the number of the 26 letters whose counts agree with `need`.

**Complexity:** compare arrays: O(26·n) time; match counter: O(n + 26). O(1) auxiliary space either way.

**Code skeleton:**

```java title="Fixed window, compare counts" fragment="public boolean checkInclusion(String s1, String s2)"
int m = s1.length(), n = s2.length();
if (m > n) return false;                              // no window of length m
int[] need = new int[26], window = new int[26];
for (int i = 0; i < m; i++) { need[s1.charAt(i) - 'a']++; window[s2.charAt(i) - 'a']++; }
if (Arrays.equals(need, window)) return true;
for (int right = m; right < n; right++) {
    window[s2.charAt(right) - 'a']++;                 // in on the right
    window[s2.charAt(right - m) - 'a']--;             // out on the left
    if (Arrays.equals(need, window)) return true;
}
return false;
```

**Main traps:**

- `s1` longer than `s2`: return `false` before the setup loop.
- Counts, not sets.
- Match counter: count all 26 letters, decrement only when a slot was equal, and check the last window after the loop.
- `Arrays.equals`, never `==`.

**What to say in one breath:** "A permutation of `s1` is any length-`m` window with the same letter counts, so I slide a fixed window over `s2` with a 26-count array, adding one character and removing one per step, and compare with `s1`'s counts. That's O(26·n), linear for this alphabet; a counter of agreeing letters makes each step O(1) if needed."
