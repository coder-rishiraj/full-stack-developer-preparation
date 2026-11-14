---
problemId: nc-longest-substring-without-repeating-characters
title: Longest Substring Without Repeating Characters
source: neetcode
sourceUrl: https://leetcode.com/problems/longest-substring-without-repeating-characters/
difficulty: medium
patterns: [sliding-window, hashing]
relatedLessons: [a2-sliding-window, a2-hashing, a2-two-pointers, a1-strings-stringbuilder, a14-deriving-optimization, a14-edge-cases]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

You get a string `s`. Find the longest substring, meaning a contiguous run of characters, in which no character appears twice, and return its length. Only the length is returned, not the substring.

**Example 1**

- Input: `s = "abcbdea"`
- Output: `5`
- Why: `"cbdea"` (indices 2 to 6) has five different characters. Any longer substring contains either both `b`s (indices 1 and 3) or both `a`s (indices 0 and 6).

**Example 2**

- Input: `s = "aaaa"`
- Output: `1`
- Why: any substring of length 2 contains `a` twice; a single character never repeats.

**What the problem statement guarantees**

- 0 ≤ `s.length` ≤ 10^5.
- `s` consists of English letters, digits, symbols and spaces.
- The string may be empty, in which case the answer is 0.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. Most candidates know the name of the technique; fewer can state exactly what the two ends of their window mean, and that is where the bugs live. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 20 minutes and talk out loud.
2. Write the slowest correct method and its complexity.
3. Suppose the substring from some start to some end has no repeats, and the next character is a repeat. Ask which starts are still worth considering.
4. Write the code and trace it on `"abcbdea"`, `"abba"` and `""`.

Open a hint only after three minutes without progress.

> [!HINT] Hint 1: a small nudge
> If a substring has a repeated character, every longer substring that contains it also has that repeat. So when extending to the right breaks the rule, extending further from the same start is pointless.

> [!HINT] Hint 2: the kind of tool you need
> Keep two positions, a left end and a right end, describing a run with no repeats. Move the right end one step at a time. When the new character is already inside the run, move the left end forward until it is not. A set of the characters inside the run, or a record of where each character was last seen, tells you that quickly.

> [!HINT] Hint 3: almost the whole plan
> Remember, for every character, the last index where you saw it. When the right end reaches a character whose last index is inside the current run, the left end jumps to just after that index. It must never move backwards, so take the larger of its current position and that new position. After each step, the run's length is a candidate answer.

**Check yourself before revealing the walkthrough**

- [ ] My code returns 0 for `""` and 1 for `" "`
- [ ] My code returns 2 for `"abba"` and 3 for `"dvdf"`
- [ ] I can state what my window holds at the start of every step
- [ ] I said which character set I assumed, and what changes if that assumption is wrong

## 3. Interview script: understand the problem (≈2 min)

The questions that shape this solution are about the character set (it decides between a hash map and a plain array) and about the empty string.

**Me:** I return the length of the longest contiguous substring with all characters distinct. Substring, not subsequence: I can't skip characters?

**Interviewer:** Right, contiguous.

**Me:** Can the string be empty, and how long can it be?

**Interviewer:** From 0 up to 10^5 characters.

**Me:** So O(n²) is around 10^10 in the worst case, too slow if it were really quadratic; I'll aim for O(n). What characters can appear?

**Interviewer:** English letters, digits, symbols and spaces.

**Me:** Can I assume they're all ASCII, codes below 128? That would let me use a fixed-size array instead of a hash map. If not, I'll use a map, which works for any `char`.

**Interviewer:** You can assume ASCII, but tell me what you'd do otherwise.

**Me:** A space counts as an ordinary character, so `"a b"` is three distinct characters and `"a  b"` repeats the space. And uppercase and lowercase are different characters?

**Interviewer:** Yes, `'A'` and `'a'` are different.

**Me:** Let me do Example 1 by hand. `"abcbdea"`: `abc` is fine, then the second `b` repeats, so the run must start after the first `b`, at `c`. `cbdea` is fine through the end. 5.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 0 ≤ s.length ≤ 10^5 | The empty string must return 0. Checking all substrings is far too slow; I aim for one pass. |
| English letters, digits, symbols and spaces | The alphabet is small, so the window can never be longer than the number of distinct characters available. A space is an ordinary character. |
| Return a length | No need to build the substring; track two indices. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Characters may be assumed ASCII (codes 0–127) | A 128-entry `int` array can replace the hash map: guaranteed O(1) per step. Without this assumption I use a `HashMap<Character, Integer>`. |
| Case-sensitive | `'A'` and `'a'` are different keys; no normalisation. |
| Substring means contiguous | A sliding window, not a set of chosen characters. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| A Java `char` counts as one character | True for ASCII. For text with characters outside the Basic Multilingual Plane, one character is two `char`s, which is a follow-up. |

### Edge cases I will keep in mind

- Empty string: 0.
- One character, including a space `" "`: 1.
- All the same: `"aaaa"` gives 1.
- All distinct: `"abcdef"` gives 6, the window never shrinks.
- A repeat whose earlier copy is already outside the window: `"abba"` gives 2. This is where the left end could wrongly move back.
- A repeat that must not reset the whole window: `"dvdf"` gives 3 (`"vdf"`).

## 4. Think out loud: from first idea to best solution

### Approach 1: Brute force (extend from every start)

#### What I say out loud

> "The most literal version checks every substring for duplicates, which is O(n³), or O(n²) per check with a set. A small improvement: for each start, extend to the right with a set of seen characters and stop at the first repeat, because any longer substring from that start contains the same repeat. That's my baseline."

#### Intuition

The answer is the longest run starting at some index. For a fixed start `i`, the longest valid run ends just before the first character that repeats. Trying every start finds the best.

#### Algorithm

1. `best = 0`.
2. For each start `i`: create an empty set; for `j = i, i + 1, …`: if `s[j]` is in the set, stop; otherwise add it and set `best = max(best, j − i + 1)`.
3. Return `best`.

#### Why it is correct

- **Only valid substrings are counted:** a length is recorded only after `s[j]` was added to a set that held all of `s[i..j−1]` without it, so `s[i..j]` has no repeat.
- **None is missed:** for every start, the scan stops exactly at the first repeat. Any valid substring starting at `i` ends before that point, so it is no longer than the length recorded for `i`.

#### Dry run

`s = "abcbdea"`

| Start i | Longest run from i | Stops because | Length |
|---|---|---|---|
| 0 | `abc` | `b` at 3 repeats | 3 |
| 1 | `bc` | `b` at 3 repeats | 2 |
| 2 | `cbdea` | end of string | 5 |
| 3 | `bdea` | end of string | 4 |
| 4–6 | `dea`, `ea`, `a` | end of string | 3, 2, 1 |

The best is 5.

#### Java code

```java title="Approach 1: extend from every start"
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        int best = 0;
        for (int i = 0; i < s.length(); i++) {
            Set<Character> seen = new HashSet<>();
            for (int j = i; j < s.length(); j++) {
                if (!seen.add(s.charAt(j))) {
                    break; // s[i..j] has a repeat, and so does every longer run from i
                }
                best = Math.max(best, j - i + 1);
            }
        }
        return best;
    }
}
```

#### Time complexity

Let n = `s.length()` and m = the number of different characters that can occur. A run without repeats has at most m characters, so the inner loop does at most min(n, m + 1) steps. **O(n·min(n, m)) expected** (the set is a hash set). Treated as a general string algorithm, with m unbounded, that is **O(n²)**. With the small alphabet here it is fast in practice, which is worth saying (see the challenges), but the interviewer is asking for the window.

#### Space complexity

**O(min(n, m)) auxiliary space** for the set.

#### The bridge to the next approach

> "When the run from start i stops at a repeat at j, the run from start i + 1 starts by re-reading characters I've already checked: everything from i + 1 to j − 1 is known to be distinct. I'm throwing that knowledge away."

> "Instead, keep the window: when `s[j]` repeats, drop characters from the left until the old copy of `s[j]` is gone, then add `s[j]` and keep going. The right end never moves back."

### Approach 2: Sliding window with a set, shrinking one step at a time

#### What I say out loud

> "Two indices, left and right, and a set of the characters in `s[left..right−1]`, which has no repeats. For each new right character, while it's already in the set, I remove `s[left]` and move left forward. Then I add it and record the window length. Each character enters the set once and leaves at most once, so it's linear."

#### Intuition

If `s[left..right−1]` has no repeats and `s[right]` already occurs in it, then no valid window ending at `right` can start at or before that earlier occurrence. Removing characters from the left until the earlier copy is gone gives the longest valid window ending at `right`.

#### Algorithm

1. `left = 0`, `best = 0`, `window = empty set`.
2. For each `right` from 0 to n − 1, with `c = s[right]`:
   1. While `c` is in `window`: remove `s[left]`, `left++`.
   2. Add `c`; `best = max(best, right − left + 1)`.
3. Return `best`.

#### Why it is correct

**Invariant:** after step 2.2, `window` holds exactly the characters of `s[left..right]`, they are distinct, and `s[left..right]` is the longest substring without repeats that ends at `right`.

- The inner loop stops as soon as `c` is no longer in the window, which is exactly when `left` has moved one past the earlier copy of `c`. Any start at or before that copy would contain `c` twice, and every start after the previous `left` is still repeat-free, so this `left` is the smallest valid start for `right`.
- Every valid substring ends at some `right`, and its length is at most the window length recorded at that `right`, so `best` is the maximum.

#### Dry run

`s = "abcbdea"`

| right | c | Removed (left moves) | Window after | left | Length | best |
|---|---|---|---|---|---|---|
| 0 | a | — | {a} | 0 | 1 | 1 |
| 1 | b | — | {a, b} | 0 | 2 | 2 |
| 2 | c | — | {a, b, c} | 0 | 3 | 3 |
| 3 | b | a (left 0→1), b (left 1→2) | {c, b} | 2 | 2 | 3 |
| 4 | d | — | {c, b, d} | 2 | 3 | 3 |
| 5 | e | — | {c, b, d, e} | 2 | 4 | 4 |
| 6 | a | — (a already gone) | {c, b, d, e, a} | 2 | 5 | 5 |

#### Java code

```java title="Approach 2: window with a set"
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        Set<Character> window = new HashSet<>(); // the characters of s[left..right-1]
        int left = 0;
        int best = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            while (window.contains(c)) {
                window.remove(s.charAt(left));
                left++;
            }
            window.add(c);
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}
```

#### Time complexity

**O(n) expected.** `right` moves n times and `left` moves at most n times in total, because it only increases and never passes `right`. Each move is a constant number of hash-set operations, constant on average, so at most about 2n adds and removes plus the `contains` checks.

#### Space complexity

**O(min(n, m)) auxiliary space**: the set holds the window, which has at most m distinct characters.

#### The bridge to the next approach

> "When `b` repeats at index 3, I already know exactly where the earlier `b` is. Walking left forward one character at a time to find it is wasted motion. If I store the last index of each character, left can jump straight to one past it."

> "The catch: the stored index may be from before the current window, as with the final `a` in `abcbdea`. Jumping there would move left backwards, so I take the maximum."

### Approach 3: Sliding window with last-seen indices (recommended)

#### What I say out loud

> "I keep a map from each character to the last index where I saw it, and the left end of the window. For each right: if the character was seen at an index at or after left, left jumps to that index plus one. Written as `left = max(left, last + 1)`, so an old occurrence outside the window can't pull left backwards. Then I record the character's index and the window length. One pass, one map lookup per character."

#### Intuition

The window `s[left..right]` is valid exactly when no character inside it has an earlier copy inside it. When `s[right]` arrives, the only new conflict it can create is with its own previous occurrence. If that occurrence is inside the window, the window must start after it; if it is before `left`, it is irrelevant.

#### Algorithm

1. `left = 0`, `best = 0`, `last = empty map`.
2. For each `right` with `c = s[right]`:
   1. If `last` has `c`, set `left = max(left, last[c] + 1)`.
   2. `last[c] = right`.
   3. `best = max(best, right − left + 1)`.
3. Return `best`.

#### Why it is correct

**Invariant:** after processing `right`, `s[left..right]` has no repeated character and `left` is the smallest index with that property for this `right`.

- **No repeats:** before the step, `s[left..right−1]` has none. The only possible new repeat is `c` with its previous occurrence `p = last[c]`. If `p ≥ left`, `left` becomes `p + 1`, which excludes it; if `p < left`, it is already outside. Earlier occurrences of `c` are before `p`, so also outside.
- **Smallest start:** the new `left` is either the old one (which was already the smallest repeat-free start for `right − 1`, and a start cannot get earlier when we add a character) or `p + 1`, and any start ≤ p would contain `c` twice.
- **Why the max:** `left` must never decrease, because a decrease would re-admit a repeat that an earlier step excluded. `p + 1` can be smaller than `left` when `p` lies before the window.
- Every valid substring ends at some `right` and is no longer than `right − left + 1` at that step, so `best` is the answer.

**The 30-second version:**

> "The window from left to right is always repeat-free and as long as possible for this right end. When a character comes in, its only possible conflict is its last occurrence. If that's inside the window, left jumps just past it; if it's before left, nothing changes, which is why I take the max. Left only moves forward and right moves once per character, so it's one pass."

#### Dry run

`s = "abcbdea"`

| right | c | last[c] before | left = max(left, last + 1) | Window | Length | best |
|---|---|---|---|---|---|---|
| 0 | a | — | 0 | `a` | 1 | 1 |
| 1 | b | — | 0 | `ab` | 2 | 2 |
| 2 | c | — | 0 | `abc` | 3 | 3 |
| 3 | b | 1 | max(0, 2) = 2 | `cb` | 2 | 3 |
| 4 | d | — | 2 | `cbd` | 3 | 3 |
| 5 | e | — | 2 | `cbde` | 4 | 4 |
| 6 | a | 0 | max(2, 1) = 2 | `cbdea` | 5 | 5 |

Step 6 is the trap: the earlier `a` at index 0 is outside the window, and without the max, left would go back to 1 and the window `bcbdea` would contain `b` twice. `"abba"` shows the same thing: at the final `a`, `last[a] = 0` but `left = 2` already.

#### Java code

```java title="Approach 3: last-seen index map (recommended)"
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> last = new HashMap<>(); // character -> last index seen
        int left = 0;
        int best = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            Integer prev = last.get(c);
            if (prev != null) {
                left = Math.max(left, prev + 1); // never move left backwards
            }
            last.put(c, right);
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}
```

This works for any `char`, so it needs no assumption about the character set.

#### Time complexity

**O(n) expected**: n iterations, each with one `get` and one `put`, constant on average under good hashing. Here the keys are at most m distinct characters, so collisions are not a practical concern, but the bound is still stated as expected for a hash map.

#### Space complexity

**O(min(n, m)) auxiliary space**: one entry per distinct character seen.

### Alternative: a 128-entry array when the interviewer confirms ASCII

With the ASCII clarification, replace the map by an `int[128]` indexed by character code. Storing "last index + 1" lets 0 mean "never seen", so the max needs no special case:

```java title="Alternative: int[128] last-seen array (ASCII only)"
class Solution {
    public int lengthOfLongestSubstring(String s) {
        int[] after = new int[128]; // after[c] = 1 + last index of c, 0 if unseen
        int left = 0;
        int best = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            left = Math.max(left, after[c]);
            after[c] = right + 1;
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}
```

**O(n) guaranteed time** and O(1) auxiliary space (128 `int`s), with no boxing. The trade-off: a character with code ≥ 128 throws `ArrayIndexOutOfBoundsException`. An `int[65536]` covers every `char` at a fixed 256 KB, which is wasteful for short strings; the map version has no such limit. Pick the array only after the ASCII clarification, and say so.

## 5. Comparison table

n = `s.length()`; m = number of distinct characters that can occur (about a hundred for this character set, but not fixed by the statement).

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Extend from every start | O(n·min(n, m)) | O(n·min(n, m)) if set operations stay constant; O(n²) for an unbounded alphabet | O(min(n, m)) |
| 2. Window with a set | O(n) | O(n) when hash operations stay constant; hash caveats otherwise | O(min(n, m)) |
| 3. Last-seen index map | O(n) | same caveat as Approach 2 | O(min(n, m)) |
| Alternative: int[128] | O(n) | O(n), guaranteed | O(1) (128 ints) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Extend from every start | Simple, correct by construction | Quadratic for large alphabets; redoes work | Baseline only |
| 2. Window with a set | Easy invariant, no max trap | Up to two set operations per character; left walks step by step | If the jump version's max feels risky under pressure |
| 3. Last-seen index map | One lookup per character; any character set | The `max(left, last + 1)` trap | The default answer |
| Alternative: int[128] | Fastest, no hashing, guaranteed O(n) | Only valid for ASCII | After the interviewer confirms ASCII |

## 6. Which solution to give, and when to stop optimizing

**Give Approach 3,** and switch to the `int[128]` array if the interviewer confirms ASCII, which is the common case. It is one pass with one lookup per character and makes the left jump explicit. Approach 2 is an equally acceptable O(n) answer and is safer if you are worried about the max; say that both are linear and that the jump version saves the step-by-step shrinking.

**Is it optimal?** Yes in time: in the worst case a correct algorithm must read essentially every character, since an unread character could extend the best window or create a repeat inside it, so there is an Ω(n) worst-case lower bound. Space is O(min(n, m)), or a fixed 128 entries with the array.

**Where to stop:** once you have the window, its invariant and the max. Micro-optimizations beyond the array are not worth interview time.

## 7. Interview script: code it and test it

### What I say while coding

> "`last` maps a character to the last index I saw it at; `left` is the start of the current repeat-free window."

> "For each right: if this character was seen, left becomes the max of left and one past that index. The max is because the old occurrence may already be outside the window."

> "Record the current index, then the window length `right − left + 1`, which is at least 1."

### Testing out loud

**Example 1:** `"abcbdea"`. Lefts 0, 0, 0, 2, 2, 2, 2 and lengths 1, 2, 3, 2, 3, 4, 5: answer 5. At the last `a`, `max(2, 1)` keeps left at 2.

**`"abba"`:** right 2 (`b`, last 1): left 2, length 1. Right 3 (`a`, last 0): left = max(2, 1) = 2, length 2. Answer 2.

**`"dvdf"`:** right 2 (`d`, last 0): left 1, window `vd`. Right 3 (`f`): window `vdf`, length 3. Answer 3.

**Empty string:** the loop does not run: 0.

**Single space `" "`:** one iteration, length 1.

**`"aaaa"`:** left becomes 1, 2, 3; every length is 1: answer 1.

**All distinct `"abcdef"`:** left stays 0, answer 6.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2 min | Substring vs subsequence, empty string, character set (ASCII?), case |
| Brute force and the window idea | 3–4 min | Extend from every start; why shrinking from the left is enough |
| Code | 5 min | The last-seen version (or the set version) |
| Test | 4 min | `"abcbdea"`, `"abba"`, `"dvdf"`, `""` |
| Complexity and follow-ups | 3 min | O(n), why left only moves forward; Unicode |

The time should go into stating the invariant and testing `"abba"`. If stuck on the jump, code Approach 2: it is O(n) and much harder to get wrong.

## 9. Interviewer challenges

### About correctness

#### Why `max(left, last + 1)` and not just `last + 1`?

**What they are testing:** whether you understand that a stored index can be stale.

**How to reason:** the map remembers occurrences from the whole prefix, but the window only covers `left..right`.

**What I say:** "The previous occurrence may be before the current window. In `abba`, when the last `a` arrives, its previous index is 0 but left is already 2. Setting left to 1 would bring back the window `bba`, which has two `b`s, and the method would return 3 instead of 2. Taking the max means left never moves backwards."

**Nuance:** the set version (Approach 2) cannot have this bug, because it removes characters from the set when they leave the window, so the set is never stale.

#### Why can the left end only move forward?

**What they are testing:** the monotonicity argument that makes the window linear.

**How to reason:** compare the smallest valid start for `right` with the one for `right + 1`.

**What I say:** "If `s[a..right+1]` has no repeats, then neither does `s[a..right]`, so the smallest valid start for right + 1 is at least the one for right. That's why one forward-only left pointer is enough, and why the total work is O(n)."

**Nuance:** this "valid windows are closed under shrinking" property is what every variable-size sliding window needs. Without it, two pointers are not justified.

### About complexity

#### Your brute force stops after at most m + 1 characters. Isn't it already fast?

**What they are testing:** whether you can reason about the alphabet as a parameter.

**How to reason:** a repeat-free run has at most m characters.

**What I say:** "Yes, with about a hundred possible characters the brute force is O(n·m), roughly 10^7 steps at this size, which would pass. But that relies on the small alphabet. With general Unicode, or with integers instead of characters, m is unbounded and it becomes O(n²). The window is O(n) regardless, which is why I'd still give it."

**Nuance:** honest analysis in terms of both n and m is better than calling the brute force "O(n³)" by reflex.

#### Is the map version really O(n)?

**What they are testing:** hashing caveats.

**How to reason:** n map operations, each constant on average.

**What I say:** "O(n) expected: one get and one put per character, constant on average for a hash map. With the ASCII array it's O(n) guaranteed, since each step is plain array indexing."

**Nuance:** with at most m keys, hash collisions are not a practical concern here, but the precise statement for a general hash map is still "expected".

## 10. Follow-up questions the interviewer might ask

**"Return the substring itself."**
Also record `bestStart = left` whenever `best` improves, and return `s.substring(bestStart, bestStart + best)`. Same O(n) time; the result string takes O(best) space.

**"The string can contain any Unicode text, including emoji."**
A Java `char` is a UTF-16 code unit, and characters outside the Basic Multilingual Plane are two `char`s. Iterate over code points (`s.codePointAt`, advancing by `Character.charCount`), key the map by code point, and measure the window in code points. Still O(n) expected; the array version no longer fits.

**"Allow at most k distinct characters in the window (instead of all distinct)."**
Keep a map from character to count in the window; when the number of keys exceeds k, shrink from the left, decrementing counts and removing keys that reach 0. O(n) expected time, O(min(n, m)) space; the jump trick no longer applies because one character leaving does not settle the condition.

**"The input is an array of integers (find the longest run of distinct values)."**
Exactly the same window with a map keyed by value, as in [[cses-playlist|Playlist]]. The array version is out because the values are not small.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Confusing substring with subsequence.** The number of distinct characters in the whole string is only an upper bound: `"aabbcc"` has 3 distinct characters, but the longest repeat-free substring is `"ab"` or `"bc"`, length 2.
- **Resetting the window on a repeat.** Starting over from the repeated character loses the part after the earlier copy: on `"dvdf"`, clearing everything at the second `d` gives 2 instead of 3.
- **Assuming ASCII without saying so.** It is a clarification to ask for, not a given.

### Implementation mistakes

> [!MISTAKE] `left = last + 1` without the max
> On `"abba"` this returns 3: at the final `a`, left moves back from 2 to 1 and the window `bba` is counted. On `"abcbdea"` it returns 6 instead of 5.

- **Computing the length as `right − left`.** The window `s[left..right]` has `right − left + 1` characters; the off-by-one returns 0 for a one-character string.
- **Guarding the jump with `last[c] > left` instead of `last[c] >= left`.** A previous occurrence exactly at `left` is inside the window and must move left: with the strict guard, `"aa"` returns 2. The `max` form handles this case without a guard.
- **Using `int[128]` without the ASCII clarification.** Any character with code ≥ 128 throws.

## 12. Pattern recognition

**The pattern:** a variable-size sliding window over a property that is preserved when the window shrinks ("no repeats"), with a hash map or array of last positions to move the left end.

**Signals in the problem statement:**

- "Longest substring / subarray such that …" with a condition on the elements inside.
- If a window violates the condition, every larger window containing it does too.
- A linear-size input, so O(n) or O(n log n) is expected.

**Related problems in this list:**

- [[nc-longest-repeating-character-replacement|Longest Repeating Character Replacement]]: a variable window whose validity depends on character counts.
- [[nc-permutation-in-string|Permutation in String]]: a fixed-size window compared by character counts.
- [[nc-minimum-window-substring|Minimum Window Substring]]: the shortest window satisfying a condition, shrinking while it stays valid.
- [[nc-contains-duplicate-ii|Contains Duplicate II]]: "no repeat within distance k", the fixed-size cousin of this problem.
- [[cses-playlist|Playlist]] (CSES): the same problem on an integer array.

**Takeaway:** for "longest window without a violation", move the right end every step and the left end only forward, just far enough to remove the violation; remembering last positions lets the left end jump.

## 13. 60-second revision card

**Key insight:** when `s[right]` repeats inside the window, the window must start just after the previous copy, and the start never moves back.

**Invariant:** after each step, `s[left..right]` is the longest repeat-free substring ending at `right`.

**Complexity:** O(n) expected time with a map, O(n) guaranteed with an `int[128]` (ASCII); O(min(n, m)) or O(1) auxiliary space.

**Code skeleton:**

```java title="Last-seen jump"
import java.util.*;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> last = new HashMap<>();
        int left = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            Integer prev = last.put(s.charAt(right), right);
            if (prev != null) left = Math.max(left, prev + 1);   // never backwards
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}
```

**Main traps:**

- `left = last + 1` without the max (`"abba"` gives 3).
- Resetting the whole window on a repeat (`"dvdf"` gives 2).
- Length `right − left` instead of `right − left + 1`.

**What to say in one breath:** "A window from left to right with no repeats. Each new character can only conflict with its own last occurrence, so left jumps just past it, using a max so it never moves back. Right moves once per character and left only forward, so O(n), with a map for any characters or an int[128] for ASCII."
