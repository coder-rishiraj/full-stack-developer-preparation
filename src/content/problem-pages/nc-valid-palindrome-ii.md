---
problemId: nc-valid-palindrome-ii
title: Valid Palindrome II
source: neetcode
sourceUrl: https://leetcode.com/problems/valid-palindrome-ii/
difficulty: easy
patterns: [two-pointers, greedy]
relatedLessons: [a2-two-pointers, a14-brute-force-first, a14-deriving-optimization, a14-edge-cases]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

You get a string `s` of lowercase letters. Return `true` if you can make it a palindrome by deleting **at most one** character, and `false` otherwise. Deleting nothing is allowed, so a string that is already a palindrome gives `true`.

**Example 1**

- Input: `s = "aba"`
- Output: `true`
- Why: it is already a palindrome; no deletion is needed.

**Example 2**

- Input: `s = "abca"`
- Output: `true`
- Why: delete the `c` to get `aba` (deleting the `b` to get `aca` works too).

**Example 3**

- Input: `s = "abc"`
- Output: `false`
- Why: deleting one character leaves `bc`, `ac` or `ab`, and none of them is a palindrome; `abc` itself is not one either.

**What the problem statement guarantees**

- 1 ≤ `s.length` ≤ 10^5.
- `s` consists of lowercase English letters only, so there is no case-folding or filtering to do.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The fast solution is short, but the reason it is correct, and the input that breaks the almost-right version, are what the interview is really about. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 15 minutes and talk out loud.
2. State the brute force and its cost first.
3. Find the faster idea, and before coding it, convince yourself it cannot miss a valid deletion.
4. Trace your code on `"abca"`, `"abc"`, `"bba"` and `"abbab"`.

> [!HINT] Hint 1: a small nudge
> Check the string as an ordinary palindrome, comparing from both ends. Nothing needs deleting while the pairs match. What do you know at the first pair that does not match?

> [!HINT] Hint 2: the kind of tool you need
> At the first mismatch, the two characters cannot both survive, because they would end up as a mirror pair of the result. So the one deletion must be one of those two. Do you know which one, just by looking at their neighbours?

> [!HINT] Hint 3: almost the whole plan
> Walk two pointers inward while the characters match. At the first mismatch, at positions `i` and `j`, return whether the substring without `s[i]` (from `i + 1` to `j`) is a palindrome, or the substring without `s[j]` (from `i` to `j − 1`) is. Those checks must not allow a second deletion. If the pointers meet without a mismatch, return `true`. Test it on `"abbab"`.

**Check yourself before revealing the walkthrough**

- [ ] My method returns `true` for a palindrome, and for any string of length 1 or 2
- [ ] It returns `true` for both `"bba"` and `"abb"`
- [ ] It returns `true` for `"abbab"` and `false` for `"abcda"`
- [ ] I can say why mismatches after the first one do not need their own decisions

## 3. Interview script: understand the problem (≈2 min)

**Me:** So I may delete zero or one character, and I need to know whether the result can be a palindrome. I don't need to say which character.

**Interviewer:** Right, just true or false.

**Me:** Only lowercase letters, length up to 10^5. So no filtering or case-folding like the earlier palindrome problem, and I need something close to linear: trying every deletion and checking is about n² ≈ 10^10 character comparisons in the worst case.

**Interviewer:** Yes, that would be too slow.

**Me:** Length 1 is a palindrome already. Length 2 is always true: either the two letters match, or I delete one and a single letter is left.

**Interviewer:** Agreed.

**Me:** Let me do `"abca"` by hand. Ends: `a` and `a` match. Next: `b` and `c` don't. If I delete `b`, the middle that's left is `c`: palindrome. So true. And `"abc"`: `a` and `c` don't match. Delete `a`, I get `bc`, no. Delete `c`, I get `ab`, no. Deleting `b` leaves `a` and `c` as the ends, still no. False.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^5 | Trying all n deletions with an O(n) check each is O(n²), around 10^10 operations in the worst case: too slow. I need about O(n). Indices fit in an `int`. |
| Lowercase letters only | Compare characters directly. No filtering, no case handling. |
| At most one deletion | Zero deletions counts, so a palindrome input returns `true`. After the one deletion, the rest must be an exact palindrome. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Only a boolean is needed, not the index to delete | I can stop as soon as one choice works. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| "Delete" means remove a character and close the gap, not replace it | That is the usual meaning; replacing would be a different problem (changing a character), which I mention as a follow-up. |

### Edge cases I will keep in mind

- Already a palindrome, such as `"aba"` or `"racecar"`: true with no deletion.
- Length 1 or 2: always true.
- Only one of the two deletions at the first mismatch works: `"bba"` (delete the right one), `"abb"` (delete the left one).
- Both neighbours "look right" at the first mismatch but only one deletion works: `"abbab"`.
- Two separate problems that one deletion cannot fix: `"abcda"`.

## 4. Think out loud: from first idea to best solution

### Approach 1: Try every deletion (brute force)

#### What I say out loud

> "First the obvious version: check whether `s` is already a palindrome; if not, for each index k, check whether `s` without position k is a palindrome. I don't need to build new strings: the check can just skip index k. That's n + 1 checks of O(n) each, so O(n²), about 10^10 comparisons in the worst case for n = 10^5. Correct, but too slow. It does tell me what I'm really asking: which deletions are worth trying?"

#### Intuition

The answer is defined as "some deletion (or none) gives a palindrome", so try them all, and check each one with the usual two-pointer palindrome test that jumps over the deleted index.

#### Algorithm

1. If `s` is a palindrome, return `true`.
2. For each k from 0 to n − 1: if `s` with index k skipped is a palindrome, return `true`.
3. Return `false`.

The skipping check: `i = 0`, `j = n − 1`; while `i < j`, if `i == k` move `i` right, else if `j == k` move `j` left, else compare `s[i]` with `s[j]`, returning `false` on a difference and moving both inward on a match.

#### Why it is correct

It tries every allowed outcome: no deletion and each single deletion. The check compares exactly the mirror pairs of the shorter string, because skipping index k is the same as reading the string with that character removed. So it returns `true` exactly when some allowed outcome is a palindrome.

#### Dry run

`s = "abca"`

| Deleted index | String checked | First comparison that fails | Palindrome? |
|---|---|---|---|
| none | `abca` | `b` vs `c` | no |
| 0 | `bca` | `b` vs `a` | no |
| 1 | `aca` | none | yes, return `true` |

#### Java code

```java title="Approach 1: try every deletion"
class Solution {
    public boolean validPalindrome(String s) {
        if (isPalindromeSkipping(s, -1)) {
            return true;                        // no deletion needed
        }
        for (int k = 0; k < s.length(); k++) {
            if (isPalindromeSkipping(s, k)) {
                return true;
            }
        }
        return false;
    }

    /** Is s, read without the character at index skip, a palindrome? skip = -1 skips nothing. */
    private boolean isPalindromeSkipping(String s, int skip) {
        int i = 0;
        int j = s.length() - 1;
        while (i < j) {
            if (i == skip) {
                i++;
            } else if (j == skip) {
                j--;
            } else if (s.charAt(i) != s.charAt(j)) {
                return false;
            } else {
                i++;
                j--;
            }
        }
        return true;
    }
}
```

#### Time complexity

**O(n²) in the worst case**, where n is `s.length()`: up to n + 1 checks, each up to O(n). Early exits make many inputs fast, but not all: for `a…abca…a` (the same run of `a`s on both sides of `bc`), every deletion inside the left run passes the outer comparisons and fails only near the middle, so about n/2 checks each cost about n/2 comparisons.

#### Space complexity

**O(1) auxiliary space**: a few indices; no new strings are built.

#### The bridge to the next approach

> "Where does the brute force waste time? Look at the plain palindrome check. While the outer pairs match, nothing needs deleting. At the first pair that doesn't match, at i and j, those two characters can't both stay: they'd be a mirror pair of the result, and they differ. So the one deletion has to be s[i] or s[j]. That's two candidates instead of n, each checked once. I just need to be sure that matching the outer pairs first can't lead me past the right deletion."

### Approach 2: Two pointers, and at the first mismatch try both deletions (recommended)

#### What I say out loud

> "Two pointers from the ends. While the characters match, move inward. At the first mismatch, at `i` and `j`, the answer is: is `s[i+1..j]` a palindrome, or is `s[i..j-1]` a palindrome? Those are plain checks, no further deletions. If there's no mismatch, it's already a palindrome."

> "I have to try both sides. Looking at the neighbours isn't enough to choose: in `abbab`, the first mismatch is `a` against `b`, and both possible deletions put matching letters next to each other, but only deleting the last `b` works."

#### Intuition

A matching outer pair never needs to be broken, so the only real decision is at the first mismatch, and there it is a choice between exactly two characters. Each choice is then a plain palindrome check of what is left inside. This is opposite-ends [[a2-two-pointers|Two Pointers]] with a single, bounded branch.

#### Algorithm

1. `i = 0`, `j = n − 1`.
2. While `i < j`:
   - If `s[i] == s[j]`: `i++`, `j--`.
   - Otherwise return `isPalindrome(s, i + 1, j) || isPalindrome(s, i, j − 1)`.
3. Return `true`.

`isPalindrome(s, lo, hi)` is the ordinary check of `s[lo..hi]` with two pointers.

#### Why it is correct

Write "fixable" for "can be made a palindrome by deleting at most one character".

**Matching ends can be peeled off.** Suppose `s[i] == s[j]` with `i < j`. Then `s[i..j]` is fixable exactly when `s[i+1..j−1]` is.

- If the inside is fixable, keep the same deletion (or none) inside and put the equal ends back around it: still a palindrome.
- Conversely, suppose some deletion makes `s[i..j]` a palindrome. If the deleted character is strictly inside, the ends survive and the inside, with that deletion, is the palindrome's interior, so the inside is fixable. If the deleted character is an end, say `s[i]`, then `s[i+1..j]` is a palindrome; dropping its first and last characters leaves `s[i+2..j−1]`, still a palindrome, and that is the inside `s[i+1..j−1]` with one character deleted. The case of deleting `s[j]` is symmetric. If nothing is deleted, `s[i..j]` is a palindrome and so is its inside.

So the loop's peeling never changes the answer, which is why only the first mismatch matters: everything outside it can be set aside.

**At a mismatch the deletion is forced to one of the two ends.** If `s[i] != s[j]` and neither is deleted, they remain the first and last characters of the result, which differ, so the result is not a palindrome. With only one deletion available, it must be `s[i]` or `s[j]`, and what is left must then be a palindrome with no further deletions: `s[i+1..j]` or `s[i..j−1]`. The method checks exactly those two.

**Why both must be tried.** Neither choice is right in general: `"bba"` needs the right character deleted (`bb`), while `"abb"` needs the left one. A one-character look-ahead does not decide it either: in `"abbab"`, at the first mismatch (`a` at 0, `b` at 4), deleting the left gives `bbab` (not a palindrome) and deleting the right gives `abba` (a palindrome), even though `s[1] == s[4]` and `s[0] == s[3]` both "look right".

If the loop ends without a mismatch, every mirror pair matched and `s` is already a palindrome.

**The 30-second version to say to the interviewer:**

> "Matching outer pairs never have to be broken: if the ends match, the string is fixable exactly when its inside is. So I peel matching ends. At the first mismatch, those two characters can't both survive, so the single deletion is one of them, and what's left must be a plain palindrome. I check both options, because looking at neighbours can't tell me which one is right. At most one extra linear scan, so O(n) time, O(1) space."

#### Dry run

`s = "abbab"`

| i | j | s[i], s[j] | Action |
|---|---|---|---|
| 0 | 4 | `a`, `b` | mismatch: try both |
| | | | delete left: `s[1..4] = bbab`: `b` = `b`, then `b` ≠ `a`, not a palindrome |
| | | | delete right: `s[0..3] = abba`: `a` = `a`, `b` = `b`, palindrome |

Returns `true`.

`s = "abcda"`

| i | j | s[i], s[j] | Action |
|---|---|---|---|
| 0 | 4 | `a`, `a` | match, move inward |
| 1 | 3 | `b`, `d` | mismatch: try both |
| | | | delete left: `s[2..3] = cd`, not a palindrome |
| | | | delete right: `s[1..2] = bc`, not a palindrome |

Returns `false`.

#### Java code

```java title="Approach 2: try both deletions at the first mismatch (recommended)"
class Solution {
    public boolean validPalindrome(String s) {
        int i = 0;
        int j = s.length() - 1;
        while (i < j) {
            if (s.charAt(i) != s.charAt(j)) {
                // One of s[i], s[j] must go; the rest must then be an exact palindrome.
                return isPalindrome(s, i + 1, j) || isPalindrome(s, i, j - 1);
            }
            i++;
            j--;
        }
        return true;                            // already a palindrome
    }

    private boolean isPalindrome(String s, int lo, int hi) {
        while (lo < hi) {
            if (s.charAt(lo) != s.charAt(hi)) {
                return false;
            }
            lo++;
            hi--;
        }
        return true;
    }
}
```

#### Time complexity

**O(n) in every case.** The main loop does at most n/2 comparisons. If it finds a mismatch at `i`, `j`, each of the two checks scans part of `s[i..j]`, at most about (j − i)/2 comparisons, and they run at most once each. In total that is at most about n comparisons.

#### Space complexity

**O(1) auxiliary space**: a few indices. No substrings are built, and the helper is not recursive.

## 5. Comparison table

n = `s.length()`. Nothing hashes or sorts, so expected and worst case coincide.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Try every deletion | O(n²) | O(n²) | O(1) |
| 2. Two pointers, both options at the first mismatch | O(n) | O(n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Try every deletion | Correct by definition; a good reference for testing | About 10^10 steps at n = 10^5 | As the stated baseline, and as a brute-force checker |
| 2. Two pointers | Linear, constant space, short | Needs the argument for why two candidates suffice | The answer to give |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2, with the "peel matching ends, the deletion is forced to one of the two mismatched characters" argument.

**Is it optimal?** Yes. Take the palindrome `abcabc…abccba…cbacba` (a repeating `abc` followed by its reverse). The answer is `true`, but changing any one letter other than the two middle ones to `z` makes it `false`: deleting the `z` or its mirror partner shifts one half against the other by one position, and the repeating pattern no longer lines up (checked by brute force for length 60). So on that input a correct algorithm must read all but two positions, otherwise it cannot tell the input from a changed one. That is an Ω(n) worst-case lower bound, and Approach 2 meets it with O(1) space.

**When to stop:** once the linear solution is coded, traced on `"abbab"` and `"abcda"`, and you can say why both sides are tried. Generalising to k deletions is a follow-up, not part of the answer.

## 7. Interview script: code it and test it

### What I say while coding

> "Main loop: move inward while the characters match. On the first mismatch I return immediately: the two options, joined with `||`."

> "The helper is a plain palindrome check on a range. It must not allow a deletion; that's the whole point of 'at most one'."

> "If the main loop finishes, there was no mismatch, so true."

### Testing out loud

**Normal case:** `"abca"`. `a`/`a` match. `b`/`c` mismatch: delete left gives `s[2..2] = c`, a palindrome. Returns `true` without trying the right side.

**False case:** `"abcda"`, as in the dry run: both options fail. Returns `false`.

**Already a palindrome:** `"racecar"`. All pairs match; the loop ends at the middle. Returns `true`.

**One character:** `"a"`. `i = j = 0`; the loop never runs. Returns `true`.

**Two characters:** `"ab"`. Mismatch at 0 and 1; delete left leaves `s[1..1] = b`, a palindrome. Returns `true`.

**Only the right deletion works:** `"bba"`. `b`/`a` mismatch; delete left gives `ba`, no; delete right gives `bb`, yes. Returns `true`. (`"abb"` is the mirror case: the left deletion works.)

**Look-ahead trap:** `"abbab"`, as in the dry run. Returns `true`, via the right deletion.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1–2 min | At most one deletion, zero allowed, lowercase only |
| Brute force | 1 min | All deletions, O(n²), not coded |
| Derive and justify | 3–4 min | Forced deletion at the first mismatch, peeling matching ends, why both sides |
| Code | 3 min | Approach 2 |
| Trace | 3 min | `"abcda"`, `"bba"`, `"abbab"`, length 1 |

The time should go into the justification: anyone can write the code, and the interviewer is listening for why two candidates are enough. If stuck, write the string, connect mirror pairs with arcs, and look at the first arc whose letters differ.

## 9. Interviewer challenges

### About correctness

#### Why is it enough to handle only the first mismatch?

**What they are testing:** whether you can justify the greedy step, not just state it.

**How to reason:** show that a matching outer pair never needs to be broken.

**What I say:** "If the ends match, the string is fixable exactly when its inside is. If the inside is fixable, I wrap it in the matching ends. And if a deletion fixes the whole string, either it's inside, and it fixes the inside, or it's an end, and then dropping both ends of the resulting palindrome shows the inside is fixable by deleting its first or last character. So I can peel matching pairs without losing anything, and the first mismatch is the first real decision."

**Nuance:** after that decision there are no more decisions: the remaining string must be an exact palindrome, so later mismatches are simply failures.

#### Why not decide which side to delete by looking at the next character?

**What they are testing:** whether you have checked the tempting shortcut against a counterexample.

**How to reason:** find an input where both neighbours match but only one deletion works.

**What I say:** "In `abbab`, the first mismatch is `a` at 0 and `b` at 4. `s[1]` is `b`, equal to `s[4]`, so the peek says 'delete the left'. But that leaves `bbab`, which fails. Deleting the right leaves `abba`, which works. One character of look-ahead isn't enough, so I check both; it costs one extra linear scan at most."

**Nuance:** `abaab` is the mirror image: there only the left deletion works. Any fixed preference for one side fails on one of `bba` or `abb`.

### About trade-offs

#### Your helper scans substrings. Could the total work become quadratic?

**What they are testing:** whether you count the cost of the branch.

**How to reason:** the branch happens once, and each helper call scans part of the remaining window.

**What I say:** "No. The main loop stops for good at the first mismatch, and I call the helper at most twice, each over less than the remaining window. So at most about n comparisons in total. It would be quadratic only if I branched at every mismatch, which the 'at most one deletion' rule makes unnecessary."

**Nuance:** if the helper built substrings with `substring`, it would add O(n) allocation, still linear but wasteful; passing indices avoids it.

## 10. Follow-up questions the interviewer might ask

**"Return the index to delete, or −1 if none works."**
Same algorithm: at the first mismatch return `i` if `s[i+1..j]` is a palindrome, else `j` if `s[i..j−1]` is, else −1; if there is no mismatch, no deletion is needed. O(n) time, O(1) space.

**"What if you may delete up to k characters?"**
Branching both ways at every mismatch, with a budget, can take up to about 2^k branches. The standard answer is that the minimum number of deletions that makes `s` a palindrome is `n − LPS(s)`, where LPS is the length of the longest palindromic subsequence, so the question is whether `n − LPS(s) ≤ k`. LPS is an O(n²)-time dynamic programme (O(n) space with rolling rows). For k = 1 the linear method here is far better.

**"What if you may change one character instead of deleting one?"**
Count the mismatched mirror pairs in one pass: the answer is `true` exactly when there is at most one, because one change fixes one pair. O(n), O(1).

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Assuming you must delete exactly one character.** Zero is allowed: `"aba"` is `true`.
- **Trying only one side at the first mismatch.** Always deleting the left fails on `"bba"`; always deleting the right fails on `"abb"`.
- **Deciding by a one-character look-ahead.** "Delete the left one if `s[i+1] == s[j]`" fails on `"abbab"`.

### Implementation mistakes

> [!MISTAKE] Continuing the main loop after a skip
> A single loop that, on a mismatch, moves one pointer and sets a "used my deletion" flag commits to one side and never reconsiders: with "skip left", `"bba"` returns `false`. Branch into two separate exact checks instead.

- **Letting the helper delete again,** for example by calling the main method recursively on each remaining range. That allows unlimited deletions: on `"abc"` it deletes `a`, then finds `b`/`c` mismatched, deletes again, and returns `true` instead of `false`. Keep the helper a plain palindrome check.
- **Building substrings** with `s.substring(i + 1, j + 1)` for the checks. Correct, but it allocates O(n) for no reason; pass the indices.
- **Off-by-one in the ranges:** deleting `s[i]` leaves `i + 1 .. j`, deleting `s[j]` leaves `i .. j − 1`, both inclusive.

## 12. Pattern recognition

**The pattern:** opposite-ends two pointers with a single bounded branch: run the simple check until the first failure, then try the few ways the allowed fix could apply.

**Signals in the problem statement:**

- "Palindrome" plus "at most one" change, deletion or exception.
- A small, fixed budget of edits, which suggests the first failure forces the decision.

**Related problems in this list:**

- [[nc-valid-palindrome|Valid Palindrome]]: the same two-pointer check without the deletion.
- [[nc-reverse-string|Reverse String]]: the same opposite-ends pointers, swapping instead of comparing.
- [[nc-longest-palindromic-substring|Longest Palindromic Substring]]: palindrome structure again, built from centres instead of checked from ends.
- [[nc-palindromic-substrings|Palindromic Substrings]]: counting palindromes by expanding from each centre.
- [[nc-two-sum-ii-input-array-is-sorted|Two Sum II]]: pointers from both ends whose moves are forced by a comparison.

**Takeaway:** with a budget of one fix, run the plain check until it first fails; the failure tells you the only places the fix can go, and you try each of them once.

## 13. 60-second revision card

**Key insight:** matching outer pairs never need breaking; at the first mismatch, one of the two mismatched characters must be the deleted one.

**Invariant:** `s` is fixable exactly when `s[i..j]` is, for the current window (all pairs outside it matched).

**Complexity:** O(n) time, at most about n comparisons; O(1) auxiliary space. Ω(n) worst-case lower bound.

**Code skeleton:**

```java title="Valid Palindrome II core" fragment="public boolean validPalindrome(String s)"
        int i = 0, j = s.length() - 1;
        while (i < j && s.charAt(i) == s.charAt(j)) { i++; j--; }
        if (i >= j) return true;
        for (int[] r : new int[][] {{i + 1, j}, {i, j - 1}}) {
            int lo = r[0], hi = r[1];
            while (lo < hi && s.charAt(lo) == s.charAt(hi)) { lo++; hi--; }
            if (lo >= hi) return true;
        }
        return false;
```

**Main traps:**

- Try both deletions; neither side nor a one-character look-ahead is always right (`bba`, `abb`, `abbab`).
- The checks after the deletion allow no further deletions.
- Zero deletions is allowed.

**What to say in one breath:** "Two pointers inward while they match; matching ends never need to be broken. At the first mismatch one of the two characters must go, so I check whether the rest is a palindrome without the left one, or without the right one. Both must be tried, as `abbab` shows. O(n) time, O(1) space."
