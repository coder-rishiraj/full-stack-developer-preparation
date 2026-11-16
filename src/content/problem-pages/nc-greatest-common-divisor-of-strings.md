---
problemId: nc-greatest-common-divisor-of-strings
title: Greatest Common Divisor of Strings
source: neetcode
sourceUrl: https://leetcode.com/problems/greatest-common-divisor-of-strings/
difficulty: easy
patterns: [math-geometry, strings]
relatedLessons: [a1-strings-stringbuilder, a2-array-string-traversal, a14-brute-force-first, a14-edge-cases]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

Say a string `t` **divides** a string `s` when `s` is `t` written one or more times in a row: `"AB"` divides `"ABABAB"`, but `"ABA"` does not divide `"ABAABAB"`, and `"AB"` does not divide `"ABA"`. Given two strings, return the longest string that divides both of them. If no string divides both, return the empty string.

**Example 1**

- Input: `str1 = "ABABAB"`, `str2 = "ABAB"`
- Output: `"AB"`
- Why: `"ABABAB"` is `"AB"` three times and `"ABAB"` is `"AB"` twice. `"ABAB"` itself does not divide `"ABABAB"` (two copies are too long, one is too short), so nothing longer than `"AB"` works.

**Example 2**

- Input: `str1 = "AAAAAB"`, `str2 = "AAA"`
- Output: `""`
- Why: anything that divides `"AAA"` is made only of `A`s, so it can never build the `B` at the end of `"AAAAAB"`.

The official statement also has `"ABCABC"` with `"ABC"` (answer `"ABC"`: the shorter string can be the answer) and `"LEET"` with `"CODE"` (answer `""`).

**What the problem statement guarantees**

- Each string has between 1 and 1000 characters.
- Both consist of English uppercase letters only.
- "Divides" means one *or more* copies, so the empty string is never a divisor; `""` is only the "nothing found" answer.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The code is short; what interviewers listen for is whether you can say *why* it is right.

**How to practise**

1. Set a timer for 15 minutes and talk out loud.
2. Write down three pairs of strings where a careless answer goes wrong, including one where the shorter string is not itself a divisor of the longer one.
3. Start with a solution that is certainly correct, however slow, and state its cost.
4. Then ask which candidates you could rule out without looking at a single character.
5. Trace your final code on `"AAAAAB"`, `"AAA"`.

> [!HINT] Hint 1: a small nudge
> Any string that divides `str1` is a prefix of `str1`, and any string that divides `str2` is a prefix of `str2`. So how many candidates are there at most, and what is the only thing that distinguishes one candidate from another?

> [!HINT] Hint 2: the kind of tool you need
> If a string of length k divides a string of length n, what must be true about k and n? Apply that to both strings at once, and think about which single length is the best possible.

> [!HINT] Hint 3: almost the whole plan
> Only lengths that divide both string lengths can work, and the largest such length is the greatest common divisor of the two lengths. Show that if *any* common divisor string exists, the prefix with exactly that length is one. Then all that is left is a check that a common divisor exists at all; there is a one-line test that compares two concatenations of the inputs.

**Check yourself before revealing the walkthrough**

- [ ] My code returns `"AB"` for `"ABABAB"`, `"ABAB"` and `""` for `"AAAAAB"`, `"AAA"`
- [ ] It returns `"A"` for `"AAA"`, `"AA"`, even though neither string divides the other
- [ ] I can explain why the answer's length, when there is an answer, is fixed by the two lengths alone
- [ ] I can state the time and extra space with the variables defined

## 3. Interview script: understand the problem (≈2 min)

**Me:** Let me restate. A string t divides s if s is exactly t repeated a whole number of times, at least once. I return the longest t that divides both inputs, or the empty string if there is none.

**Interviewer:** Yes.

**Me:** "At least once" means t can be the whole string, so if `str2` divides `str1`, the answer can be `str2` itself?

**Interviewer:** Right, like `"ABCABC"` and `"ABC"`, where the answer is `"ABC"`.

**Me:** What are the sizes and the alphabet?

**Interviewer:** Each string has 1 to 1000 characters, uppercase English letters.

**Me:** So both are non-empty, and comparing `char`s with `==` is all I need. Is the comparison case-sensitive? With only uppercase letters it doesn't matter, but I'd like to know if that could change.

**Interviewer:** Only uppercase, so you don't need to worry about it.

**Me:** And is the longest divisor unique, or could there be two different answers of the same length?

**Interviewer:** What do you think?

**Me:** A divisor of `str1` must be a prefix of `str1`, because `str1` starts with a copy of it. There's only one prefix of each length. So the answer is unique, and I'll return a substring of `str1`.

**Me:** Let me do one by hand: `"ABABAB"` and `"ABAB"`. A divisor of `"ABAB"` has length 1, 2 or 4. Length 4 can't divide a string of length 6. Length 2 is `"AB"`, which is 3 copies and 2 copies. So `"AB"`.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ `str1.length`, `str2.length` ≤ 1000 | Both strings are non-empty, so a length-based argument never divides by zero. With at most 1000 candidate lengths and 2000 characters to check per candidate, even trying every candidate is about 2 million character comparisons: fast, but it can be beaten. |
| Uppercase English letters only | Plain `char` comparison, no case folding, no Unicode questions. |
| A divisor is one or more copies | The empty string is never a candidate; it only reports "none". |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| The answer may be one of the inputs itself | The search must include the full length of the shorter string. |
| The comparison is exact (only uppercase occurs) | `equals` and `==` on `char` are correct as they are. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The inputs are not modified, and I may build new strings | Java strings are immutable anyway; the question is only how much extra memory I allocate, which I will state per approach. |
| Returning `""` (not `null`) when there is no common divisor | It is what the examples show; I say it so that nobody expects `null`. |

### Edge cases I will keep in mind

- One string divides the other: `"ABCABC"`, `"ABC"` returns the shorter string.
- Neither divides the other, but a shorter common divisor exists: `"ABABAB"`, `"ABAB"`, and `"AAA"`, `"AA"` (lengths 3 and 2 share only 1).
- Same letters, different arrangement: `"ABAB"`, `"BABA"` returns `""`.
- A shared prefix that is not a divisor: `"AAAAAB"`, `"AAA"` returns `""`.
- Equal strings: the answer is the whole string, for example `"XYZ"`, `"XYZ"`.
- Single characters: `"A"`, `"A"` gives `"A"`; `"A"`, `"B"` gives `""`.

## 4. Think out loud: from first idea to best solution

Throughout: **m** = `str1.length()`, **n** = `str2.length()`, **g** = gcd(m, n), the greatest common divisor of the two lengths, and **d(g)** = the number of divisors of g, which is at most 32 for numbers up to 1000 (840 has 32).

Two facts get used by every approach, so I say them once:

- **A divisor is a prefix.** If `t` divides `s`, then `s` starts with a copy of `t`, so `t = s.substring(0, |t|)`. So every candidate is a prefix of the shorter string, one per length.
- **A divisor's length divides the string's length.** `s` is k copies of `t`, so `|s| = k · |t|`.

### Approach 1: Try every prefix of the shorter string, longest first

#### What I say out loud

> "The answer is a prefix of both strings, so in particular it's a prefix of the shorter one. There are at most a thousand of those. I'll try them from the longest down, and for each one I'll literally build copies of it until I reach the target length and compare. The first one that rebuilds both strings is the longest, so I return it."

> "Each check costs about the length of the string being rebuilt, so this is around min(m, n) times (m + n) character operations, two million at worst. Correct and fast enough here, but it does a lot of pointless building."

#### Intuition

There are only min(m, n) candidates and each one can be checked directly against the definition. Going from the longest down means the first success is the answer.

#### Algorithm

1. Let `shorter` be the shorter input (either one if equal).
2. For `len` from `shorter.length()` down to 1: let `candidate = shorter.substring(0, len)`.
3. If `candidate` divides `str1` and divides `str2`, return it.
4. `divides(t, s)`: append `t` to an empty builder until the builder is at least as long as `s`, then compare the builder with `s`.
5. If no length worked, return `""`.

#### Why it is correct

- **It returns only common divisors.** `divides(t, s)` returns true only when some number k ≥ 1 of copies of `t` equals `s` exactly: the builder holds k copies, and equality also forces the lengths to match.
- **It cannot miss the longest one.** Every common divisor is a prefix of the shorter string, so it is among the candidates; trying lengths in decreasing order means the first success is the longest common divisor.
- If no candidate passes, no common divisor exists, and `""` is right.

#### Dry run

`str1 = "ABABAB"`, `str2 = "ABAB"`, so `shorter = "ABAB"`.

| len | candidate | Built for `str1` | Divides `str1`? | Divides `str2`? |
|---|---|---|---|---|
| 4 | `"ABAB"` | `"ABABABAB"` (8 chars) | no | not checked |
| 3 | `"ABA"` | `"ABAABA"` | no | not checked |
| 2 | `"AB"` | `"ABABAB"` | yes | yes, return `"AB"` |

On `"AAAAAB"`, `"AAA"` the candidates `"AAA"`, `"AA"`, `"A"` all fail on `str1`, and it returns `""`.

#### Java code

```java title="Approach 1: every prefix, rebuilt by repetition"
class Solution {
    public String gcdOfStrings(String str1, String str2) {
        String shorter = str1.length() <= str2.length() ? str1 : str2;
        for (int len = shorter.length(); len >= 1; len--) {
            String candidate = shorter.substring(0, len);
            if (divides(candidate, str1) && divides(candidate, str2)) {
                return candidate;
            }
        }
        return "";
    }

    // Does t divide s? Build t + t + ... until it is at least as long as s, then compare.
    private boolean divides(String t, String s) {
        StringBuilder built = new StringBuilder();
        while (built.length() < s.length()) {
            built.append(t);
        }
        return built.toString().equals(s);
    }
}
```

#### Time complexity

**O(min(m, n) · (m + n)) in the worst case.** There are at most min(m, n) candidates. For each, `divides` builds at most |s| + |t| − 1 characters and compares at most |s|, for both strings: O(m + n). The worst case is when no candidate passes, for example `"A"` × 999 followed by `"B"` against 1000 `A`s: every length is tried. At the limits that is about 1000 × 2000 = 2 × 10^6 character operations, which is fast, but most of it is wasted on lengths that could never work.

#### Space complexity

**O(m + n) auxiliary space** at any moment: one candidate substring and one builder up to the longer length, discarded after each check. No recursion.

#### The bridge to the next approach

> "Look at the dry run: I built eight characters for `"ABAB"` just to discover that 4 copies of nothing fit into 6. That's arithmetic, not string work. A divisor of length k can only divide a string whose length is a multiple of k. So before touching any characters, I can skip every length that doesn't divide both m and n. And while I'm at it, I don't need to build anything: position i of s must equal position i mod k of the candidate."

### Approach 2: Only lengths that divide both lengths

#### What I say out loud

> "Same search, two fixes. I skip any length k unless k divides m and k divides n; those can't possibly work. For the survivors I check in place, without building strings: s is k-periodic from its first k characters exactly when every character equals the one k positions earlier, or equivalently `s.charAt(i) == s.charAt(i % k)`."

> "How many lengths survive? Only the common divisors of m and n, which are exactly the divisors of gcd(m, n). For numbers up to 1000 that's at most 32. So the character work drops from a thousand checks to at most 32."

#### Intuition

The length test is free and rejects almost every candidate. Only the common divisors of the two lengths are worth a character-by-character check.

#### Algorithm

1. For `k` from min(m, n) down to 1:
2. If `m % k != 0` or `n % k != 0`, skip.
3. Let `candidate = str1.substring(0, k)`. If `str2` starts with `candidate`, `str1` repeats its first k characters, and `str2` repeats its first k characters, return `candidate`.
4. Return `""`.

`repeats(s, k)` checks `s.charAt(i) == s.charAt(i % k)` for every i.

#### Why it is correct

- **Skipping is safe.** A string of length k divides a string of length L only if L = (copies) · k, so a k that fails `m % k == 0` or `n % k == 0` cannot be the length of a common divisor.
- **The check matches the definition.** When k divides |s|, `s` is copies of its first k characters exactly when each position i holds the same character as position i mod k of the first block. Both strings must repeat *the same* block, which is why `str2` must also start with `candidate`.
- Lengths are still tried from the longest down, so the first success is the answer, and if none passes, there is no common divisor.

#### Dry run

`str1 = "ABABAB"` (m = 6), `str2 = "ABAB"` (n = 4).

| k | 6 % k | 4 % k | Action |
|---|---|---|---|
| 4 | 2 | 0 | skip |
| 3 | 0 | 1 | skip |
| 2 | 0 | 0 | candidate `"AB"`: `str2` starts with it; `ABABAB` and `ABAB` repeat their first 2 characters; return `"AB"` |

No characters were looked at for k = 4 and k = 3.

#### Java code

```java title="Approach 2: only common divisors of the lengths"
class Solution {
    public String gcdOfStrings(String str1, String str2) {
        int m = str1.length();
        int n = str2.length();
        for (int k = Math.min(m, n); k >= 1; k--) {
            if (m % k != 0 || n % k != 0) {
                continue;                       // a block of length k cannot tile both strings
            }
            String candidate = str1.substring(0, k);
            if (str2.startsWith(candidate) && repeats(str1, k) && repeats(str2, k)) {
                return candidate;
            }
        }
        return "";
    }

    // Is s its first k characters repeated? (k divides s.length())
    private boolean repeats(String s, int k) {
        for (int i = k; i < s.length(); i++) {
            if (s.charAt(i) != s.charAt(i % k)) {
                return false;
            }
        }
        return true;
    }
}
```

#### Time complexity

**O(min(m, n) + d(g) · (m + n)) in the worst case**, where d(g) is the number of divisors of g = gcd(m, n). The loop runs min(m, n) times, but only for the d(g) common divisors does it touch characters, at O(m + n) each. Since d(g) ≤ 32 for lengths up to 1000, this is at most about 32 × 2000 = 64,000 character comparisons, against 2 million for Approach 1.

#### Space complexity

**O(min(m, n)) auxiliary space** for the candidate substring; the checks themselves use O(1). No recursion.

#### The bridge to the next approach

> "The loop still tries several lengths. Do I need more than one? Suppose some common divisor x exists, of length k. Then str1 is a copies of x and str2 is b copies of x. Now take x repeated gcd(a, b) times. That divides both strings too, since gcd(a, b) divides a and b, and its length is k · gcd(a, b), which is exactly gcd(k·a, k·b) = gcd(m, n). And no common divisor can be longer than gcd(m, n), because its length divides both m and n. So: if there's any answer at all, it has length exactly g = gcd(m, n). I only need to check that one prefix."

### Approach 3: Check only the prefix of length gcd(m, n)

#### What I say out loud

> "I compute g = gcd(m, n) with Euclid's algorithm. The only possible answer is the first g characters of str1. I check that both strings repeat that block; if they do, it's the answer, and if not, there's no common divisor of any length."

#### Intuition

The lengths alone decide the answer's length. The characters only decide whether there is an answer.

#### Algorithm

1. `g = gcd(m, n)` by Euclid: replace (a, b) by (b, a mod b) until b is 0.
2. `candidate = str1.substring(0, g)`.
3. If `str2` starts with `candidate` and both strings repeat their first g characters, return `candidate`; otherwise return `""`.

#### Why it is correct

**The claim:** if any common divisor exists, the length-g prefix of `str1` is one, and it is the longest.

- **No common divisor is longer than g.** Its length divides m and n, so it divides gcd(m, n) = g, so it is at most g.
- **If some common divisor x exists, one of length g exists.** Write `str1` = x repeated a times and `str2` = x repeated b times, so m = |x| · a and n = |x| · b, and g = |x| · gcd(a, b). Then y = x repeated gcd(a, b) times has length g, and since gcd(a, b) divides both a and b, y repeated a / gcd(a, b) times is `str1` and repeated b / gcd(a, b) times is `str2`. So y is a common divisor of length g.
- **That divisor is the length-g prefix of `str1`,** because a divisor is a prefix.

So: if the length-g prefix divides both strings, it is the longest common divisor; if it does not, then by the second point no common divisor exists, and `""` is right.

#### Dry run

`str1 = "AAAAAB"` (m = 6), `str2 = "AAA"` (n = 3).

| Step | Values |
|---|---|
| Euclid | gcd(6, 3): 6 mod 3 = 0, so g = 3 |
| candidate | `"AAA"` |
| `str2` starts with `"AAA"`? | yes |
| `"AAAAAB"` repeats its first 3? | i = 3: `A` = `A`; i = 4: `A` = `A`; i = 5: `B` ≠ `A`, no |
| Result | `""` |

On `"ABABAB"`, `"ABAB"`: gcd(6, 4) = 2, candidate `"AB"`, both repeat it, return `"AB"`.

#### Java code

```java title="Approach 3: only the prefix of length gcd(m, n)"
class Solution {
    public String gcdOfStrings(String str1, String str2) {
        int g = gcd(str1.length(), str2.length());
        String candidate = str1.substring(0, g);
        if (str2.startsWith(candidate) && repeats(str1, g) && repeats(str2, g)) {
            return candidate;
        }
        return "";
    }

    private int gcd(int a, int b) {
        while (b != 0) {
            int r = a % b;
            a = b;
            b = r;
        }
        return a;
    }

    // Is s its first k characters repeated? (k divides s.length())
    private boolean repeats(String s, int k) {
        for (int i = k; i < s.length(); i++) {
            if (s.charAt(i) != s.charAt(i % k)) {
                return false;
            }
        }
        return true;
    }
}
```

#### Time complexity

**O(m + n) in the worst case.** Euclid's algorithm takes O(log min(m, n)) steps. The prefix test and the two repetition checks read each character of both strings at most once.

#### Space complexity

**O(g) auxiliary space** for the candidate substring, which is at most min(m, n). The checks use O(1). (Returning `""` early when `str2` does not start with the candidate does not change the bound.)

#### The bridge to the next approach

> "That's already linear. There's a well-known shortcut for the 'does any common divisor exist' part that doesn't need the repetition loops at all: compare str1 + str2 with str2 + str1. If both strings are copies of the same block, both concatenations are copies of that block, so they're equal. The interesting direction is the converse, and I'd want to be able to prove it before I rely on it."

### Approach 4: The concatenation test, then the gcd length (recommended)

#### What I say out loud

> "A common divisor exists exactly when `str1 + str2` equals `str2 + str1`. If they differ, I return the empty string. If they're equal, the answer is the first gcd(m, n) characters of str1, by the length argument I just made."

> "Why is the test right? One direction is easy: if both strings are copies of x, both concatenations are a + b copies of x. For the other direction I argue by shrinking the problem, like Euclid's algorithm does with numbers: if the shorter string is a prefix of the longer one, I can cut it off and repeat."

#### Intuition

`str1 + str2 == str2 + str1` says the two strings **commute**: putting them in either order gives the same text. Strings commute exactly when they are built from the same block. And the gcd of the lengths picks the longest such block.

#### Algorithm

1. If `!(str1 + str2).equals(str2 + str1)`, return `""`.
2. Return `str1.substring(0, gcd(m, n))`.

#### Why it is correct

Write `s` and `t` for the two strings and `st` for their concatenation.

**If a common divisor x exists, then st = ts.** With `s` = x repeated a times and `t` = x repeated b times, both `st` and `ts` are x repeated a + b times.

**If st = ts, then a common divisor exists.** By induction on |s| + |t|, for non-empty `s` and `t`:

- If |s| = |t|: the first |s| characters of `st` are `s` and those of `ts` are `t`, so s = t, and `s` is a common divisor.
- If |s| > |t| (the other case is symmetric): `st` starts with `s` and `ts` starts with `t`, so `t` is a prefix of `s`. Write s = t·r with `r` non-empty. Then st = ts reads t·r·t = t·t·r, and removing the leading `t` from both sides gives r·t = t·r. So `r` and `t` commute, and |r| + |t| < |s| + |t|. By induction they have a common divisor x: r and t are both copies of x. Then s = t·r is copies of x too, so x divides both s and t.

This shrinking step, "cut the shorter off the front of the longer", is Euclid's subtraction algorithm acting on the strings themselves, which is why the two strings end up tiled by a block whose length divides both lengths.

**Why the answer is the prefix of length g = gcd(m, n).** Once a common divisor exists, the argument from Approach 3 applies: no common divisor is longer than g, and one of length g exists, namely the length-g prefix.

**The 20-second version to say out loud:**

> "If both strings are copies of x, both concatenations are copies of x, so they're equal. Conversely, if s + t = t + s with s longer, t is a prefix of s, cutting it off leaves a shorter commuting pair, and by induction everything is copies of one block. Any common divisor has a length dividing both lengths, so it's at most gcd; and repeating a divisor gcd(a, b) times gives one of exactly that length. So the answer is the gcd-length prefix."

#### Dry run

| str1 | str2 | str1 + str2 | str2 + str1 | Equal? | g | Result |
|---|---|---|---|---|---|---|
| `ABABAB` | `ABAB` | `ABABABABAB` | `ABABABABAB` | yes | 2 | `"AB"` |
| `AAAAAB` | `AAA` | `AAAAABAAA` | `AAAAAAAAB` | no (index 5: `B` vs `A`) | — | `""` |
| `ABCABC` | `ABC` | `ABCABCABC` | `ABCABCABC` | yes | 3 | `"ABC"` |

#### Java code

```java title="Approach 4: concatenation test + gcd length (recommended)"
class Solution {
    public String gcdOfStrings(String str1, String str2) {
        // The strings are built from one common block exactly when they commute.
        if (!(str1 + str2).equals(str2 + str1)) {
            return "";
        }
        return str1.substring(0, gcd(str1.length(), str2.length()));
    }

    private int gcd(int a, int b) {
        while (b != 0) {
            int r = a % b;
            a = b;
            b = r;
        }
        return a;
    }
}
```

#### Time complexity

**O(m + n) in the worst case.** Building each concatenation copies m + n characters, `equals` compares at most m + n, Euclid takes O(log min(m, n)) steps, and the final `substring` copies g characters.

#### Space complexity

**O(m + n) auxiliary space** for the two concatenated strings (about 2(m + n) characters, at most 4000 here). Approach 3 needs only O(g); that is the price of the shorter code.

## 5. Comparison table

m and n are the two lengths, g = gcd(m, n), and d(g) ≤ 32 for lengths up to 1000. No approach hashes or randomizes, so expected and worst case are the same.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Every prefix, rebuilt by repetition | O(min(m, n) · (m + n)) | O(min(m, n) · (m + n)) | O(m + n) |
| 2. Only common divisors of the lengths | O(min(m, n) + d(g) · (m + n)) | O(min(m, n) + d(g) · (m + n)) | O(min(m, n)) |
| 3. Only the length-g prefix | O(m + n) | O(m + n) | O(g) |
| 4. Concatenation test + gcd length | O(m + n) | O(m + n) | O(m + n) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Every prefix | Correct straight from the definition; no number theory | Quadratic-ish; builds strings that a length check would reject | As the baseline you say out loud |
| 2. Common divisors of lengths | The length filter is easy to justify; much less character work | Still tries several lengths; needs the in-place repetition check | If you see the length filter but not yet the gcd argument |
| 3. Length-g prefix | Linear time, smallest memory, every step easy to justify | Two helper loops to write | When you prefer an argument without the concatenation lemma, or memory matters |
| 4. Concatenation test | Linear time, three lines, hard to get wrong | Its correctness needs the commuting-strings argument; allocates two concatenations | The default interview answer, said together with its proof |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 4, with both directions of the concatenation argument and the gcd-length argument. If the converse proof does not come to you under pressure, give Approach 3 instead: it has the same O(m + n) time, and its correctness needs only the length argument, which is easier to say.

**Is it optimal?** Yes. In the worst case a correct algorithm must read essentially every character of both strings, because changing one unread character could turn a common divisor into none (for example the final `B` in `"AAAAAB"`). So Ω(m + n) is a worst-case lower bound, and both linear approaches match it.

**When to stop:** once you have linear time and can justify it. Saving the 2(m + n) characters of the concatenations is a constant-factor memory change (Approach 3 does it); mention it only if asked.

## 7. Interview script: code it and test it

### What I say while coding

> "First the existence test: `(str1 + str2).equals(str2 + str1)`. I use `equals`, not `==`, because these are two different String objects."

> "If they differ, return the empty string, not null."

> "Otherwise the answer is the first gcd(m, n) characters. I'll write gcd as a small loop: replace (a, b) by (b, a mod b) until b is zero. Both lengths are at least 1, so the result is at least 1 and the substring is never empty."

> "I take the substring of str1, but str2 would give the same characters: both start with the common block."

### Testing out loud

**Example 1:** `"ABABAB"`, `"ABAB"`. Both concatenations are `ABABABABAB`, equal. gcd(6, 4): 6 mod 4 = 2, 4 mod 2 = 0, so 2. Return `"AB"`. Correct.

**No common block:** `"AAAAAB"`, `"AAA"`. `AAAAABAAA` versus `AAAAAAAAB`: they differ at index 5. Return `""`. Correct.

**One divides the other:** `"ABCABC"`, `"ABC"`: concatenations equal, gcd(6, 3) = 3, return `"ABC"`, the whole shorter string. Correct.

**Lengths share only 1:** `"AAA"`, `"AA"`: `AAAAA` both ways, gcd(3, 2) = 1, return `"A"`. Correct: neither input divides the other, but `"A"` divides both.

**Same letters, different order:** `"ABAB"`, `"BABA"`: `ABABBABA` versus `BABAABAB` differ at index 0. Return `""`. Correct.

**Equal strings:** `"XYZ"`, `"XYZ"`: equal concatenations, gcd 3, return `"XYZ"`.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify and one example by hand | 2 min | Definition of "divides", sizes, uniqueness of the answer |
| Baseline | 1–2 min | Every prefix of the shorter string, with its cost |
| Length filter and gcd argument | 3–4 min | "A divisor's length divides the string's length", then why only g matters |
| Concatenation test and its proof | 2–3 min | Both directions, briefly |
| Code | 2 min | Three lines plus Euclid |
| Test | 2 min | `"AAAAAB"`/`"AAA"`, `"AAA"`/`"AA"`, `"ABAB"`/`"BABA"` |

Most of the time goes on the argument, not the code. If the converse of the concatenation test does not come, say so honestly and code Approach 3, whose proof you already gave. If you are stuck before the gcd idea, write lengths m and n next to Example 1 and ask which lengths a divisor could have.

## 9. Interviewer challenges

### About the reasoning

#### Why is `str1 + str2 == str2 + str1` enough to know a common divisor exists?

**What they are testing:** whether you can prove the lemma or only remember it.

**How to reason:** one direction is a one-liner. For the converse, look at what equality forces at the start of each concatenation, cut off the shorter string, and notice the problem got smaller.

**What I say:** "If both are copies of x, both concatenations are copies of x. Conversely, if they're equal and s is longer, then t is a prefix of s, say s = t·r. Substituting, t·r·t = t·t·r, so r·t = t·r: a smaller commuting pair. Repeating this is Euclid's algorithm on the strings, and it ends with two equal strings, which is the common block."

**Nuance:** this is a classic fact about words (two words commute exactly when they are powers of a common word). The proof is the same shape as the Euclidean algorithm, which is why gcd shows up twice.

#### Why must the answer have length exactly gcd(m, n)?

**What they are testing:** whether you can justify returning a prefix of a computed length without checking it.

**How to reason:** bound from above by divisibility; then build a divisor that reaches the bound.

**What I say:** "Any common divisor's length divides both m and n, so it's at most gcd(m, n). And if x is a common divisor, with str1 = x^a and str2 = x^b, then x repeated gcd(a, b) times also divides both, and its length is |x| · gcd(a, b) = gcd(m, n). Since divisors are prefixes, that string is the gcd-length prefix."

**Nuance:** the second half is the step candidates skip. Without it, "length gcd" is just a guess that happens to work.

#### Couldn't you just return the gcd-length prefix without any check?

**What they are testing:** whether you know which part of the argument needs the characters.

**How to reason:** the length argument says *if* an answer exists it has length g. It says nothing about whether one exists.

**What I say:** "No. On `"AAAAAB"` and `"AAA"` that returns `"AAA"`, and on `"LEET"` and `"CODE"` it returns `"LEET"`, both wrong. The lengths fix the answer's length; the characters decide whether there is an answer."

**Nuance:** I ran that version: it returns `"AAA"` and `"LEET"` on those inputs.

### About the code

#### Is `str1 + str2` expensive?

**What they are testing:** awareness of the allocation behind the one-liner.

**How to reason:** each `+` creates a new string of m + n characters.

**What I say:** "It allocates two strings of m + n characters, so O(m + n) extra memory, about 4000 characters here. If memory mattered I'd use Approach 3, which checks the repetition in place and only allocates the g-character answer. You could also compare the two concatenations without building them, by indexing into str1 and str2, at the cost of clarity."

**Nuance:** time is O(m + n) either way.

#### Does it matter whether you take the prefix of `str1` or `str2`?

**What they are testing:** whether you understand that both strings start with the same block.

**How to reason:** once a common divisor of length g exists, it is a prefix of both strings.

**What I say:** "No. When the concatenations are equal, both strings are copies of the same block, so their first g characters are identical. Before the check, though, they can differ, which is why the check comes first."

**Nuance:** in Approach 3, the `str2.startsWith(candidate)` check is what stops two strings that repeat *different* blocks of the same length, such as `"ABAB"` and `"BABA"`, from passing: without it, g = 4, each string trivially "repeats" its own first 4 characters, and the method returns `"ABAB"`.

## 10. Follow-up questions the interviewer might ask

**"What about k strings instead of two?"** Fold: g = gcd of all lengths, and check that every string repeats the first g characters of the first string (or fold the concatenation test pairwise, replacing the running answer each time). O(total length).

**"Return the shortest common divisor instead of the longest."** If a common divisor exists, the shortest is the **primitive root** of the common block: the shortest prefix p such that the block is copies of p. Find the smallest k dividing g for which the g-prefix repeats its first k characters, at O(d(g) · g) by the Approach 2 loop, or O(g) with the prefix function from string matching.

**"How many common divisors are there?"** Let p be the primitive root of the common block. The common divisors are exactly p repeated j times where j · |p| divides g, so their count is the number of divisors of g / |p|.

**"What if the strings were huge, say 10^9 characters on disk?"** The algorithm is already a single streaming pass per string once g is known from the lengths: read each string sequentially and compare each character with the one at position i mod g of the first block, keeping only g characters in memory.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Only checking whether the shorter string divides the longer.** That misses answers shorter than both, like `"AB"` for `"ABABAB"` and `"ABAB"`; that version returns `""` there (checked by running it).
- **Assuming the answer is the common prefix.** `"AAAAAB"` and `"AAA"` share the prefix `"AAA"`, which divides neither.
- **Treating length gcd as enough.** The gcd fixes the length only if an answer exists; without a character check `"LEET"`, `"CODE"` returns `"LEET"`.
- **Citing the concatenation test without being able to justify it.** It is fine to use, but be ready for "why?".
- **Thinking the answer could be one of several strings of the same length.** A divisor is a prefix, so the answer is unique.

### Implementation mistakes

> [!MISTAKE] Comparing strings with `==`
> `(str1 + str2) == (str2 + str1)` compares references of two freshly built objects and is false even when the text is equal. Use `equals`.

- **Repetition check without the length test.** Checking only `s.charAt(i) == s.charAt(i % k)` says that `s` is periodic with period k, not that k copies tile it exactly. `"ABA"` passes for k = 2 though `"AB"` does not divide it. Check `s.length() % k == 0` first (Approach 2) or use a k that divides it by construction (Approaches 3 and 4).
- **Forgetting that both strings must repeat the same block.** Approach 3 without `str2.startsWith(candidate)` checks each string against *its own* first g characters, so `"ABAB"` and `"BABA"` (g = 4) both pass and it returns `"ABAB"` (checked by running it); `"ABAB"` and `"BA"` would return `"AB"`.
- **Returning `null`** instead of `""` for no answer.
- **A recursive gcd with the arguments in the wrong order** is still correct (the first step swaps them), but a gcd that divides by zero is not: stop when the second argument is 0.

## 12. Pattern recognition

**The pattern:** reduce a string question to arithmetic on lengths, then confirm with one linear pass. Periodic structure (repetition, rotation, tiling) usually has a length condition that rules out almost every candidate for free.

**Signals in the problem statement:**

- "Repeated one or more times", "built from copies of", "is a rotation of".
- The answer is a prefix or substring determined by its length alone.
- A small number of candidate lengths compared with the string length.

**Related problems in this list:**

- [[nc-longest-common-prefix|Longest Common Prefix]]: also about prefixes shared by several strings, but there the common prefix is the answer; here it is only a candidate.
- [[nc-encode-and-decode-strings|Encode and Decode Strings]]: another problem where lengths do the real work in a string question.
- [[nc-merge-strings-alternately|Merge Strings Alternately]]: the same section of the roadmap; simple index arithmetic over two strings of different lengths.
- [[nc-valid-anagram|Valid Anagram]]: a case where "same letters" is the whole question; here same letters (`"ABAB"`, `"BABA"`) is not enough.

**Takeaway:** when a string problem talks about repeating a block, first ask what the lengths force, then check the characters once.

## 13. 60-second revision card

**Key insight:** a common divisor exists exactly when `str1 + str2` equals `str2 + str1`, and then the longest one is the prefix of length gcd(m, n).

**Invariant (proof shape):** if s + t = t + s and s is longer, then s = t + r with r + t = t + r: Euclid's algorithm on strings.

**Complexity:** O(m + n) time, O(m + n) auxiliary space for the two concatenations (O(g) with the in-place check of Approach 3). Ω(m + n) is a worst-case lower bound.

**Code skeleton:**

```java title="GCD of strings in four lines" fragment="public String gcdOfStrings(String str1, String str2)"
if (!(str1 + str2).equals(str2 + str1)) return "";
int a = str1.length(), b = str2.length();
while (b != 0) { int r = a % b; a = b; b = r; }
return str1.substring(0, a);
```

**Traps:** `==` on strings; returning the gcd prefix without a check; only testing whether the shorter divides the longer; `null` instead of `""`.
