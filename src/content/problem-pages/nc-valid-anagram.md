---
problemId: nc-valid-anagram
title: Valid Anagram
source: neetcode
sourceUrl: https://leetcode.com/problems/valid-anagram/
difficulty: easy
patterns: [arrays-hashing, hashing]
relatedLessons: [a2-frequency-counting, a2-hashing, a2-sorting-based, a3-counting-sort, a1-strings-stringbuilder]
companies: []
timeToSolve: 8
---

## 1. Problem restatement

You get two strings, `s` and `t`. Decide whether `t` uses exactly the same letters as `s`, each one the same number of times, just possibly in a different order. If so, `t` is an anagram of `s` and you return `true`; otherwise `false`.

**Example 1**

- Input: `s = "stale"`, `t = "least"`
- Output: `true`
- Why: both strings contain one each of a, e, l, s and t. Only the order differs.

**Example 2**

- Input: `s = "aab"`, `t = "abb"`
- Output: `false`
- Why: both use only the letters a and b, but `s` has two a's and one b, while `t` has one a and two b's. Having the same *set* of letters is not enough; the counts must match too.

**What the problem statement guarantees**

- Each string has between 1 and 5 × 10^4 characters. The two lengths may differ.
- Both strings consist of lowercase English letters only.
- The statement ends with a follow-up: what if the inputs contain Unicode characters? How would you adapt the solution?

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. It takes a few minutes, and the interesting part is the follow-up, which you can only discuss well once your own solution is clear. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 8 minutes and talk out loud.
2. Say what "same letters, same number of times" means for two strings of different lengths. Can they ever be anagrams?
3. Find a slow method you can show is correct, then a faster one.
4. Use the fact that only lowercase English letters occur. What does that let you do that you could not do for arbitrary text?
5. Trace your code on Example 2, then answer the follow-up out loud.

Open a hint only after two minutes without progress.

> [!HINT] Hint 1: a small nudge
> If you rearranged both strings into some fixed, standard order, what would be true about the two results exactly when the strings are anagrams?

> [!HINT] Hint 2: the kind of tool you need
> The order of letters is irrelevant; only how many times each letter appears matters. Can you record those amounts for one string and check them against the other? There are only 26 possible letters.

> [!HINT] Hint 3: almost the whole plan
> Reject strings of different lengths at once. Keep 26 counters. Go through `s` adding one to the counter of each letter, then through `t` subtracting one. Work out what it means if a counter ever drops below zero, and why, with equal lengths, never dropping below zero means every counter ends at exactly zero.

**Check yourself before revealing the walkthrough**

- [ ] I check the lengths first and can say why that is safe
- [ ] My code returns `false` for `"aab"` and `"abb"`
- [ ] I can say how much extra memory my counting uses and why
- [ ] I have an answer to the Unicode follow-up that mentions how Java stores characters

## 3. Interview script: understand the problem (≈1–2 min)

The interviewer may say only: "Given two strings, return whether `t` is an anagram of `s`." The definition and the character set are the facts to pin down, because the character set decides the data structure.

**Me:** By anagram you mean `t` has exactly the same characters as `s`, each the same number of times, in any order? So "aab" and "abb" are not anagrams even though they use the same letters?

**Interviewer:** Correct.

**Me:** What characters can appear? Lowercase letters only, or also uppercase, spaces, punctuation?

**Interviewer:** Lowercase English letters only.

**Me:** Then there are only 26 possible characters. That matters, because it means I can count with a fixed-size array. And case and spaces don't need special treatment. How long can the strings be, and can they have different lengths?

**Interviewer:** Each between 1 and 5 × 10^4. They can differ in length.

**Me:** If the lengths differ, the answer is immediately `false`, since anagrams have the same number of characters. So a length check comes first. Should I worry about anything beyond that, like a different alphabet?

**Interviewer:** Solve it for lowercase first. We may come back to Unicode.

**Me:** Let me do Example 2 by hand. "aab" has a:2, b:1. "abb" has a:1, b:2. The counts differ, so `false`.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ s.length, t.length ≤ 5 × 10^4 | Strings are never empty. O(n²) would be about 2.5 × 10^9 steps, so I want n log n or better. The lengths may differ, which gives a cheap first check. |
| Only lowercase English letters | 26 possible characters, so a counter array of size 26 indexed by `c - 'a'` covers them all, with no hashing. |
| Follow-up: Unicode input | The fixed array will not survive that change; I should be ready to say what replaces it. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Counts must match, not just the set of letters | A set of letters is not enough; I need a count per letter. |
| No case folding, no ignoring spaces | No normalization step before counting. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| Both strings are given in full, in memory | Lets me iterate over them and index them directly. |
| I may not modify anything | Java `String` is immutable anyway; sorting would need copies, which I count as extra memory. |

### Edge cases I will keep in mind

- Different lengths, including one string being a prefix of the other: `"a"` and `"aa"`.
- Same letters, different counts: `"aab"` and `"abb"`.
- Single characters: `"a"` and `"a"`, `"a"` and `"b"`.
- Identical strings: an anagram of itself.
- The letter `'z'`, to catch an off-by-one in the array index.

The edge cases follow [[a14-edge-cases|Edge-Case Identification]].

## 4. Think out loud: from first idea to best solution

### Approach 1: Sort both strings and compare

#### What I say out loud

> "The most literal method would be to take each character of `s` and cross off a matching one in `t`. That's O(n²) because each cross-off searches `t`. A cleaner baseline: if two strings are anagrams, sorting their characters produces the same sequence. So I sort both and compare. That's O(n log n)."

#### Intuition

Sorting puts characters into a canonical order. Two strings are anagrams exactly when they hold the same multiset of characters, and two multisets are equal exactly when their sorted sequences are equal. See [[a2-sorting-based|Sorting-Based Problems]].

#### Algorithm

1. If the lengths differ, return `false`.
2. Copy each string into a `char[]` and sort both arrays.
3. Return whether the two sorted arrays are equal element by element.

#### Why it is correct

- Sorting does not change which characters a string contains or how often; it only reorders them.
- If `s` and `t` are anagrams, they have the same multiset, and sorting a multiset gives one specific sequence, so the sorted arrays are equal.
- If the sorted arrays are equal, they contain the same characters with the same counts, so `s` and `t` do too.

#### Dry run

`s = "stale"`, `t = "least"`. Lengths are both 5.

| String | Characters | Sorted |
|---|---|---|
| s | s, t, a, l, e | a, e, l, s, t |
| t | l, e, a, s, t | a, e, l, s, t |

The sorted arrays are equal, so the result is `true`. For `"aab"` and `"abb"`, the sorted arrays are `[a, a, b]` and `[a, b, b]`, which differ at index 1: `false`.

#### Java code

```java title="Approach 1: sort both and compare"
import java.util.Arrays;

class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) {
            return false;
        }
        char[] a = s.toCharArray();
        char[] b = t.toCharArray();
        Arrays.sort(a);
        Arrays.sort(b);
        return Arrays.equals(a, b);
    }
}
```

#### Time complexity

**O(n log n)**, where n is the common length (if the lengths differ, the method returns in O(1)). Copying is O(n), each sort is O(n log n), and the comparison is O(n).

Analyse it as a comparison sort. As an implementation detail, current JDKs sort a large `char[]` with a counting sort (a `char` has only 65,536 possible values), which is linear for big arrays. That is how the library behaves today, not a promise in its contract, and it is not the idea the interviewer is looking for.

#### Space complexity

**O(n) auxiliary space**: `toCharArray` creates two new arrays of n characters, because a `String` cannot be sorted in place. The sort may use some further memory internally.

#### The bridge to the next approach

> "Sorting computes the full order of the characters, but I never use that order. The only thing I compare at the end is how many of each character there are. So I could count directly: one pass over `s` to count, one over `t` to check. Counting with a hash map from character to count would be linear, expected."

### Approach 2: Count with a hash map

#### What I say out loud

> "I count each character of `s` in a map. Then I go through `t` and decrement. If `t` needs a character the map doesn't have, or has already used up, I return `false`. Since I checked the lengths first, if I get through `t` without running out, every count is back to zero."

#### Intuition

Two strings are anagrams exactly when they have the same count for every character. A [[a2-frequency-counting|frequency map]] records those counts in one pass. Subtracting the second string's counts from the first's leaves all zeros exactly when they match.

#### Algorithm

1. If the lengths differ, return `false`.
2. For each character `c` of `s`: increment `count[c]`.
3. For each character `c` of `t`: if `count[c]` is missing or zero, return `false`; otherwise decrement it.
4. Return `true`.

#### Why it is correct

After step 2, `count[c]` is the number of times `c` occurs in `s`. During step 3, before processing a character of `t`, `count[c]` equals (occurrences of `c` in `s`) minus (occurrences of `c` in the part of `t` already processed).

- **If it returns `false`, they are not anagrams:** `t` contains more copies of some `c` than `s` does.
- **If it returns `true`, they are anagrams:** no count went below zero, so for every `c`, `t` has at most as many copies as `s`. The lengths are equal, so the counts in `t` add up to the same total as those in `s`. If any count of `t` were strictly smaller, some other count would have to be strictly larger to make up the total, which did not happen. So every count is equal.

#### Dry run

`s = "aab"`, `t = "abb"`. After counting `s`: `{a: 2, b: 1}`.

| Character of `t` | count before | Action |
|---|---|---|
| a | 2 | decrement to 1 |
| b | 1 | decrement to 0 |
| b | 0 | used up, return `false` |

#### Java code

```java title="Approach 2: hash map of counts"
import java.util.HashMap;
import java.util.Map;

class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) {
            return false;
        }
        Map<Character, Integer> count = new HashMap<>();
        for (int i = 0; i < s.length(); i++) {
            count.merge(s.charAt(i), 1, Integer::sum);
        }
        for (int i = 0; i < t.length(); i++) {
            char c = t.charAt(i);
            Integer left = count.get(c);
            if (left == null || left == 0) {
                return false; // t has more copies of c than s
            }
            count.put(c, left - 1);
        }
        return true;
    }
}
```

#### Time complexity

**O(n) expected time.** Each string is read once, with one or two map operations per character, each constant on average when keys hash well. Here there are at most 26 distinct keys, so in practice buckets stay tiny; the general hash-table caveat (a worst case of O(n) per operation if many keys collide) only matters for large alphabets.

#### Space complexity

**O(d) auxiliary space**, where d is the number of distinct characters in `s`. With lowercase letters d ≤ 26, so it is bounded by a constant here; for arbitrary text it can reach n. Each entry costs a boxed `Character`, a boxed `Integer` and a map node.

#### The bridge to the next approach

> "The map is general, and that's why it's here for the Unicode follow-up. But for this problem the keys are only 'a' to 'z'. I don't need hashing to find a counter: `c - 'a'` is a number from 0 to 25, a perfect index into an array. Same algorithm, no hashing, no boxing, and a guaranteed linear bound."

### Approach 3: Count with an `int[26]` array (recommended)

#### What I say out loud

> "Since the input is lowercase English letters, I'll use an array of 26 counters indexed by `c - 'a'`. Lengths first. Then add one for each letter of `s` and subtract one for each letter of `t`, and if a counter ever goes negative, `t` has a letter that `s` doesn't have enough of. If that never happens and the lengths match, all counters are zero, so they're anagrams."

#### Intuition

The 26 counters are a direct-address table: the character itself tells you where its counter lives. This is the idea behind [[a3-counting-sort|counting sort]]: when the set of possible keys is small and known, an array replaces comparisons and hashing.

#### Algorithm

1. If the lengths differ, return `false`.
2. `count = new int[26]`.
3. For each character `c` of `s`: `count[c - 'a']++`.
4. For each character `c` of `t`: `count[c - 'a']--`; if it is now negative, return `false`.
5. Return `true`.

#### Why it is correct

The argument is the same as for the map, made sharper by one fact: the sum of all 26 counters.

- After step 3, `count[x]` = occurrences of x in `s`, and the counters add up to |s|.
- Every step of 4 subtracts one, so after step 4 the counters add up to |s| − |t| = 0.
- **A negative counter means "not an anagram":** `t` has more of that letter than `s`.
- **No negative counter means "anagram":** 26 numbers that are all ≥ 0 and add up to 0 must all be 0, so every letter has the same count in both strings.

This is why the length check is not only a shortcut: the early-exit version relies on it. Without it, `s = "ab"`, `t = "a"` would never go negative and would return `true`.

**The 20-second version to say to the interviewer:**

> "I add one per letter of `s` and subtract one per letter of `t`. A negative counter means `t` has too many of that letter. Because the lengths are equal, the counters sum to zero at the end, and if none is negative, they're all exactly zero, which means every letter count matches."

#### Dry run

`s = "aab"`, `t = "abb"`. Only the counters for a and b are shown; the other 24 stay 0.

| Step | Character | count[a] | count[b] | Note |
|---|---|---|---|---|
| s | a | 1 | 0 | |
| s | a | 2 | 0 | |
| s | b | 2 | 1 | |
| t | a | 1 | 1 | |
| t | b | 1 | 0 | |
| t | b | 1 | −1 | negative, return `false` |

For `s = "stale"`, `t = "least"`, the counters for a, e, l, s, t each go up to 1 while reading `s` and back down to 0 while reading `t`; none goes negative, so the result is `true`.

#### Java code

```java title="Approach 3: int[26] counts (recommended)"
class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) {
            return false; // anagrams always have the same length
        }
        int[] count = new int[26]; // count[0] is 'a', count[25] is 'z'
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
        }
        for (int i = 0; i < t.length(); i++) {
            if (--count[t.charAt(i) - 'a'] < 0) {
                return false; // t has more of this letter than s
            }
        }
        return true; // equal lengths and nothing negative: every counter is 0
    }
}
```

`charAt` is used instead of `toCharArray` so that no copy of either string is made.

#### Time complexity

**O(n) time, in the worst case too**, where n is the common length. Each character of each string is read once and does one array update. Allocating and zeroing 26 counters is a constant. No hashing, so there is no expected-versus-worst-case distinction.

#### Space complexity

**O(1) auxiliary space.** The array always has 26 entries, whatever the length of the strings. Be precise about why: it is constant because the problem fixes the alphabet at 26 letters. In general this approach takes O(σ) space for an alphabet of σ characters, and for an alphabet as large as Unicode that stops being a sensible thing to call constant (see the follow-ups).

## 5. Comparison table

n = length of the strings (after the length check they are equal); σ = alphabet size (26 here); d = distinct characters in `s`.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Sort both | O(n log n) | O(n log n) | O(n) for the two copies |
| 2. Hash map counts | O(n) | O(n) here (at most 26 keys); O(n²) for a hash table in general | O(d), at most 26 here |
| 3. `int[26]` counts | O(n) | O(n) | O(σ) = O(1) for a fixed 26-letter alphabet |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Sort both | Shortest idea to explain; works for any comparable characters | Slower; two copies | As the baseline, or when you want a one-line answer and n is small |
| 2. Hash map counts | Works for any alphabet, including Unicode code points | Boxing and hashing overhead; expected time only | The alphabet is large or unknown |
| 3. `int[26]` counts | Linear worst case, constant space, simplest loop | Only for a small known alphabet | The default answer for this problem |

## 6. Which solution to give, and when to stop optimizing

**Give the `int[26]` version.** With a fixed lowercase alphabet it is linear in the worst case, uses constant extra space and has the least code.

**Is it optimal?** Yes. If the strings are anagrams, a correct algorithm must, in the worst case, read essentially every character of both, since an unread character could break the match. That is an Ω(n) worst-case lower bound, and this solution meets it with O(1) extra space.

**When another one is better:** if the character set is large or not fixed, use the hash map (Approach 2), counting code points. Sorting is never better asymptotically, but it is a fine first sentence.

**Where to stop:** once you have the counting array, the length check and the complexity. The next thing the interviewer wants is the Unicode discussion, not a faster version.

## 7. Interview script: code it and test it

### What I say while coding

> "Length check first; it's also what makes my early exit valid."

> "Twenty-six counters. `c - 'a'` maps 'a' to 0 and 'z' to 25."

> "I increment for `s` and decrement for `t` in a separate loop, so I can stop the moment a counter goes negative."

> "If I finish, the lengths are equal and nothing went negative, so every counter is zero."

### Testing out loud

**Normal case:** `"stale"`, `"least"`. Lengths 5 and 5. Counters for a, e, l, s, t go to 1, then each back to 0; nothing negative; `true`.

**Same letters, different counts:** `"aab"`, `"abb"`. After `s`: a = 2, b = 1. Reading `t`: a → 1, b → 0, b → −1, return `false`.

**Different lengths:** `"a"`, `"aa"`. Returns `false` before counting anything.

**Single characters:** `"a"`, `"b"`. count[a] = 1, then count[b] = −1, `false`. And `"a"`, `"a"`: 1 then 0, `true`.

**Identical strings:** every counter goes up and back down to zero, `true`.

**The last letter:** `"zzza"`, `"azzz"`. `'z' - 'a'` is 25, the last valid index. count[z] reaches 3 and comes back to 0, `true`.

## 8. Time plan for the interview

Aim for about eight minutes, then expect the Unicode follow-up.

| Phase | Time | What to get done |
|---|---|---|
| Clarify | about 1 min | Counts matter, character set, lengths can differ |
| Baseline and better idea | about 1 min | Sort is n log n; only counts matter; 26 letters, so an array |
| Code | 1–2 min | Length check, counting array |
| Test | 1–2 min | Example 2, different lengths, `'z'` |
| Complexity and follow-up | 2–3 min | Why the space is O(1); what changes for Unicode |

The follow-up is where this question is decided: most candidates code the array correctly, fewer can explain what breaks for Unicode and why. If the counting idea does not come, code the sort first: it is correct, and asking "do I really need the order?" leads straight to counting.

## 9. Interviewer challenges

### About the solution

#### Why check the lengths first?

**What they are testing:** whether the check is a habit or part of your correctness argument.

**How to reason:** run the counting loop without it on `s = "ab"`, `t = "a"`.

**What I say:** "Two reasons. It's a free early answer, since anagrams have equal length. More importantly, my decrement loop only catches `t` having too many of a letter. If `t` is shorter, nothing goes negative: with 'ab' and 'a', I'd return `true`. The equal lengths are what let me conclude that all counters are exactly zero."

**Nuance:** an alternative that does not rely on the length check is to count both strings fully and then check all 26 counters for zero. That is also correct; it just cannot exit early inside the loop.

#### Why do you say the space is O(1)? The array has 26 elements.

**What they are testing:** whether you understand what "constant space" means, and its limits.

**How to reason:** auxiliary space is measured as a function of the input size n. The array size depends only on the alphabet, which the problem fixes.

**What I say:** "The array has 26 entries whether the strings have 5 characters or 50,000, so it doesn't grow with n: that's O(1). Strictly, it's O(σ) for an alphabet of size σ, and it's constant here because the problem fixes σ at 26. If the alphabet were part of the input, like all of Unicode, I wouldn't call it constant."

**Nuance:** the hash map version is O(d) for d distinct characters, which is also at most 26 here. The real advantage of the array is no hashing and no boxing, not a better space bound.

#### What happens if the input contains a character outside 'a' to 'z'?

**What they are testing:** whether you know what your code relies on.

**How to reason:** `c - 'a'` for an uppercase `'A'` is −32; for `'{'` it is 26.

**What I say:** "The index would be out of range and Java would throw `ArrayIndexOutOfBoundsException`. That's acceptable only because the problem guarantees lowercase letters. If that guarantee went away, I'd either normalize first, for example lowercase the strings if case doesn't matter, or switch to a map."

**Nuance:** a "safe" fix of skipping unexpected characters would silently give wrong answers, which is worse than failing loudly.

### About complexity

#### Is sorting really worse? Java's sort is fast.

**What they are testing:** whether you can separate asymptotic analysis from library internals.

**How to reason:** as an algorithm, sorting is a comparison sort, O(n log n). What a particular library does internally is a separate question.

**What I say:** "Asymptotically, sorting is O(n log n) against linear for counting, and it needs two O(n) copies. In practice the difference at 5 × 10^4 characters is small. Current JDKs even use a counting sort internally for large `char` arrays, but that's an implementation detail I wouldn't build an argument on. Counting is simpler and has the better guaranteed bound, so I'd still choose it."

**Nuance:** "the library happens to be linear here" is a fact about one implementation; the contract only promises a sorted array.

## 10. Follow-up questions the interviewer might ask

**"What if the inputs contain Unicode characters?"** (the follow-up in the problem statement)
Three things change.

1. **The alphabet is too large for a 26-slot array.** Use a map from character to count (Approach 2). An array covering every possible code point would need over a million slots; a map stores only the characters that occur.
2. **A Java `char` is not a character.** A `String` is stored as UTF-16 code units. Characters outside the Basic Multilingual Plane, such as most emoji, take two `char`s (a surrogate pair). Counting `char`s compares code units, and that can give a wrong answer: the strings "😀𝐀" and "🐀𝘀" (U+1F600, U+1D400 versus U+1F400, U+1D600) consist of exactly the same four UTF-16 code units, just paired differently, so counting `char`s, or sorting a `char[]`, says they are anagrams even though they share no character. Count **code points** instead, with `codePoints()` or `codePointAt`.
3. **Ask what "same character" means.** An accented letter like "é" can be written as one code point or as "e" followed by a combining accent. Counting code points treats those as different. If they should count as equal, normalize both strings first, for example with `java.text.Normalizer` (NFC); whether that is wanted is a question for the interviewer, and characters as a reader perceives them (grapheme clusters) are a further level beyond that.

Time is O(n) expected for n code units, space O(d) for d distinct code points.

```java title="Unicode version: count code points"
import java.util.HashMap;
import java.util.Map;

class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) {
            return false; // equal code-point multisets always have equal UTF-16 lengths
        }
        Map<Integer, Integer> count = new HashMap<>();
        s.codePoints().forEach(cp -> count.merge(cp, 1, Integer::sum));
        for (int i = 0; i < t.length(); ) {
            int cp = t.codePointAt(i);
            Integer left = count.get(cp);
            if (left == null || left == 0) {
                return false;
            }
            count.put(cp, left - 1);
            i += Character.charCount(cp); // 2 for a surrogate pair, otherwise 1
        }
        return true;
    }
}
```

The length check is still valid in code units: each code point always occupies the same number of code units, so two strings with the same code points have the same UTF-16 length. And as with the array, equal length plus no count going below zero means every count is zero, because the code-unit totals of the two strings agree.

**"Ignore case and spaces."**
Normalize before counting: skip spaces and map each letter to lowercase. The length check must then compare the number of counted characters, not the raw lengths. Same complexity.

**"Find every position where an anagram of `p` starts inside `s`."**
Slide a window of length |p| across `s` and update the 26 counters as one character enters and one leaves, instead of recounting. O(|s|) time, O(1) space. [[nc-permutation-in-string|Permutation in String]] is the yes-or-no version.

**"Many strings: group the ones that are anagrams of each other."**
Turn each string into a canonical key (its sorted characters, or its 26 counts) and group by key in a hash map. That is [[nc-group-anagrams|Group Anagrams]].

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Comparing sets of letters instead of counts.** "aab" and "abb" have the same set of letters. Counts are what define an anagram.
- **Calling the 26-element array O(n) space, or calling it O(1) without saying why.** It is constant because the alphabet is fixed; say so.
- **Answering the Unicode follow-up with "use a bigger array".** That misses surrogate pairs, which is the real trap in Java.

### Implementation mistakes

> [!MISTAKE] Dropping the length check from the early-exit version
> Without it, `isAnagram("ab", "a")` returns `true`: the decrement loop never sees a negative counter, because `t` simply has fewer letters. Either keep the length check or verify all counters are zero at the end.

- **`c - 'A'` or `c - '0'` as the index.** For lowercase letters the base is `'a'`; anything else indexes out of range.
- **Counting `char`s for Unicode input.** Surrogate pairs are split into halves, and different characters can share halves, as the follow-up example shows.

## 12. Pattern recognition

**The pattern:** frequency counting. Reduce each string to how many times each character occurs, and compare the counts.

**Signals in the problem statement:**

- "Same characters, any order", "rearrange", "permutation of".
- A small fixed alphabet (lowercase letters, digits), which invites a counting array.
- Order is irrelevant, so sorting does more work than needed.

**Related problems in this list:**

- [[nc-group-anagrams|Group Anagrams]]: the same canonical form used as a hash key to group many strings.
- [[nc-permutation-in-string|Permutation in String]]: the same count comparison over a sliding window.
- [[nc-contains-duplicate|Contains Duplicate]]: another "sort, or count with hashing" question about values.
- [[nc-minimum-window-substring|Minimum Window Substring]]: frequency counts of a pattern, matched inside a variable-size window.

**Takeaway:** when order does not matter and only "how many of each" does, count. If the alphabet is small and known, count with an array.

## 13. 60-second revision card

**Key insight:** anagrams have identical character counts. With 26 letters, 26 counters are enough.

**Invariant:** after reading all of `s` and part of `t`, `count[x]` = (x's in `s`) − (x's in the read part of `t`). Equal lengths + never negative ⇒ all zero at the end.

**Complexity:** O(n) time worst case, O(1) auxiliary space because the alphabet is fixed at 26 (O(σ) in general).

**Code skeleton:**

```java title="Valid Anagram in seven lines"
class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) count[s.charAt(i) - 'a']++;
        for (int i = 0; i < t.length(); i++) {
            if (--count[t.charAt(i) - 'a'] < 0) return false;
        }
        return true;
    }
}
```

**Main traps:**

- Forgetting the length check, which the early exit depends on.
- Same set of letters is not the same counts.
- For Unicode: count code points, not `char`s, with a map; ask whether normalization is wanted.

**What to say in one breath:** "Sorting both is n log n. Only the counts matter, and there are 26 letters, so I count `s` up and `t` down in an `int[26]`: linear time, constant space. Equal lengths and no negative counter means they're anagrams. For Unicode I'd count code points in a hash map, because a `char` can be half of a surrogate pair."
