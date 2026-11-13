---
problemId: nc-merge-strings-alternately
title: Merge Strings Alternately
source: neetcode
sourceUrl: https://leetcode.com/problems/merge-strings-alternately/
difficulty: easy
patterns: [two-pointers]
relatedLessons: [a2-two-pointers, a1-strings-stringbuilder, a2-array-string-traversal, a14-edge-cases]
companies: []
timeToSolve: 8
---

## 1. Problem restatement

You get two strings, `word1` and `word2`. Build a new string by taking one letter from `word1`, then one from `word2`, then the next from `word1`, and so on, always starting with `word1`. When one string runs out, append whatever is left of the other one unchanged. Return the merged string.

**Example 1**

- Input: `word1 = "ace"`, `word2 = "bdfgh"`
- Output: `"abcdefgh"`
- Why: the letters pair up as a–b, c–d, e–f. `word1` is then used up, so the rest of `word2`, `"gh"`, goes on the end.

**Example 2**

- Input: `word1 = "wxyz"`, `word2 = "ab"`
- Output: `"waxbyz"`
- Why: w–a, x–b, then `word2` is used up and `"yz"` is appended.

**What the problem statement guarantees**

- 1 ≤ `word1.length`, `word2.length` ≤ 100, so neither string is empty.
- Both strings contain only lowercase English letters.
- The result always has length `word1.length + word2.length`, at most 200.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The idea is short; what is worth practising is writing the loop so that the unequal-length case needs no special code, and knowing what your string-building costs. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 8 minutes and talk out loud.
2. Write the answer for `"ace"` and `"bdfgh"` by hand, then for two strings of the same length.
3. Write the code, then trace the case where `word1` is the longer one.
4. Say the time complexity of your code, counting the cost of building the string, not only the number of loop iterations.

> [!HINT] Hint 1: a small nudge
> You are walking through two strings at once. What does one step of that walk produce, and when does the walk end?

> [!HINT] Hint 2: the kind of tool you need
> Keep a position in each string (or one shared position, since both advance together). Think about how you accumulate characters in Java: a `String` cannot change after it is created, so think about what `result += c` does on every iteration.

> [!HINT] Hint 3: almost the whole plan
> Use a `StringBuilder` sized to the total length. Loop an index `i` from 0 up to the longer length; append `word1.charAt(i)` if `i` is inside `word1`, then `word2.charAt(i)` if `i` is inside `word2`. Return the builder as a string. Check that the leftover letters of the longer word come out in order.

**Check yourself before revealing the walkthrough**

- [ ] My code handles `word1` longer, `word2` longer, and equal lengths, without a separate branch for each
- [ ] It never calls `charAt` with an index past the end of a string
- [ ] I can explain why `+=` on a `String` inside a loop is quadratic in the total length
- [ ] I can say the output length before I run the code

## 3. Interview script: understand the problem (≈1 min)

**Me:** So I interleave the two words letter by letter, `word1` first, and when one runs out the rest of the other goes on the end as it is. I return a new string.

**Interviewer:** Yes.

**Me:** Both words have between 1 and 100 lowercase letters, so I don't need to handle empty strings or anything outside `a`–`z`. The output length is just the sum of the lengths.

**Interviewer:** Right.

**Me:** Let me check with an example. `"ace"` and `"bdfgh"`: a, b, c, d, e, f, and then `word1` is done, so g, h. That gives `"abcdefgh"`, eight letters, which is 3 + 5.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ each length ≤ 100 | Neither string is empty, so there is no null or empty special case. The total is at most 200 characters, so any linear method is instant, and even a quadratic one finishes; the difference is what the interviewer will listen for. |
| Lowercase English letters only | Characters are just copied, never interpreted. No Unicode surrogate pairs to worry about, so one `char` is one letter. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Return a new string; the inputs are not modified | Java strings are immutable anyway, so this matches the language. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| "Append the rest" means the remaining letters in their original order | It is how the examples read; I say it so the tail handling is not up for debate. |

### Edge cases I will keep in mind

- Equal lengths: no tail at all.
- `word1` longer: the tail comes from `word1`.
- `word2` longer: the tail comes from `word2`.
- Length-1 words, for example `"a"` and `"bcd"`, where the tail starts right after the first pair.

## 4. Think out loud: from first idea to best solution

### Approach 1: Concatenate onto a String

#### What I say out loud

> "The most direct version: keep a `String result`, loop an index over the longer length, and do `result += word1.charAt(i)` and `result += word2.charAt(i)` when those indices exist."

> "This is correct, but I want to be honest about the cost. A Java `String` is immutable, so every `+=` makes a new string and copies all the characters built so far into it."

#### Intuition

One index `i` serves both words, because at step `i` we take letter `i` of each. A bounds check per word decides whether that word still has a letter to give.

#### Algorithm

1. `result = ""`.
2. For `i` from 0 to `max(len1, len2) − 1`: if `i < len1`, append `word1.charAt(i)`; if `i < len2`, append `word2.charAt(i)`.
3. Return `result`.

#### Why it is correct

At step `i` the code appends letter `i` of `word1` then letter `i` of `word2`, which is exactly the alternating order. Once `i` passes the end of the shorter word, its check fails and only the longer word contributes, one letter per step, in order: that is the "append the rest" rule. The loop runs to the longer length, so no letter of either word is missed.

#### Dry run

`word1 = "wxyz"`, `word2 = "ab"`

| i | `i < 4`? | `i < 2`? | Appended | `result` |
|---|---|---|---|---|
| 0 | yes | yes | `w`, `a` | `"wa"` |
| 1 | yes | yes | `x`, `b` | `"waxb"` |
| 2 | yes | no | `y` | `"waxby"` |
| 3 | yes | no | `z` | `"waxbyz"` |

Returns `"waxbyz"`.

#### Java code

```java title="Approach 1: concatenate onto a String"
class Solution {
    public String mergeAlternately(String word1, String word2) {
        String result = "";
        int longest = Math.max(word1.length(), word2.length());
        for (int i = 0; i < longest; i++) {
            if (i < word1.length()) result += word1.charAt(i);   // builds a new String every time
            if (i < word2.length()) result += word2.charAt(i);
        }
        return result;
    }
}
```

#### Time complexity

**O((m + n)²) in the worst case**, where m = `word1.length()`, n = `word2.length()`, and L = m + n is the output length. Each `+=` creates a new `String` holding all characters so far, so the j-th append copies about j characters. Over L appends that is 1 + 2 + … + L = L(L + 1)/2 character copies: 20,100 for the maximum L = 200. The loop itself is only O(L); the quadratic part is the copying.

Why not count on the compiler to fix it? The Java Language Specification allows an implementation to avoid intermediate strings *within one concatenation expression*, and javac does so, but each `+=` here is a separate statement in a separate iteration that must produce a complete `String`. Nothing in the language promises that the copying across iterations disappears, so the honest bound for this code is quadratic. At L ≤ 200 it is still fast; the point is that the same habit on a 10⁶-character input would not be.

#### Space complexity

**O(m + n)** live at any time: the current `result` (the output) plus the new string being built. The discarded intermediate strings total O((m + n)²) characters allocated over the run, which is garbage-collector work rather than live memory.

#### The bridge to the next approach

> "The loop is fine; the container is the problem. I need something I can append to without copying what's already there. That's `StringBuilder`: it keeps a growable char buffer, and if I give it the final capacity up front, every append just writes one character."

### Approach 2: StringBuilder, one index to the longer length (recommended)

#### What I say out loud

> "Same loop, but into a `StringBuilder` created with capacity `m + n`, since I know the exact output length. Each append writes one character into the buffer. At the end I call `toString()` once."

> "I keep the single index up to the longer length with a bounds check per word. That way the tail of the longer word comes out of the same loop, with no extra code after it."

#### Intuition

The order of output letters is fixed by the index: position `i` of `word1`, then position `i` of `word2`. A word that has run out simply stops contributing. The builder is a write pointer into an output buffer that only moves forward.

#### Algorithm

1. `sb = new StringBuilder(m + n)`.
2. For `i` from 0 to `max(m, n) − 1`: if `i < m`, append `word1.charAt(i)`; if `i < n`, append `word2.charAt(i)`.
3. Return `sb.toString()`.

#### Why it is correct

**The invariant:** after the iteration for index `i`, `sb` holds the merge of `word1[0 .. i]` and `word2[0 .. i]` (each cut at its own length), in the required order.

- Before the loop, both prefixes are empty and so is `sb`.
- Iteration `i` adds `word1[i]` (if it exists) and then `word2[i]` (if it exists). While both exist, that is the next pair in the alternation. Once one word is exhausted, only the other contributes, in order, which is the "append the rest" rule.
- After the last iteration, `i = max(m, n) − 1`, so both prefixes are the whole words, and every letter appears exactly once.

**The 20-second version to say to the interviewer:**

> "One index walks both words. At each step I append the letter from `word1` if it still has one, then from `word2` if it still has one. While both have letters, that alternates; once one runs out, the other's remaining letters come through in order. I loop to the longer length, so nothing is missed, and a `StringBuilder` sized m + n makes it linear."

#### Dry run

`word1 = "ace"`, `word2 = "bdfgh"` (m = 3, n = 5, loop to 5)

| i | `i < 3`? | `i < 5`? | Appended | `sb` |
|---|---|---|---|---|
| 0 | yes | yes | `a`, `b` | `ab` |
| 1 | yes | yes | `c`, `d` | `abcd` |
| 2 | yes | yes | `e`, `f` | `abcdef` |
| 3 | no | yes | `g` | `abcdefg` |
| 4 | no | yes | `h` | `abcdefgh` |

Returns `"abcdefgh"`, length 8 = 3 + 5.

#### Java code

```java title="Approach 2: StringBuilder, one index (recommended)"
class Solution {
    public String mergeAlternately(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        StringBuilder sb = new StringBuilder(m + n);   // exact output length: no regrowth
        for (int i = 0; i < Math.max(m, n); i++) {
            if (i < m) sb.append(word1.charAt(i));
            if (i < n) sb.append(word2.charAt(i));
        }
        return sb.toString();
    }
}
```

#### Time complexity

**O(m + n) in every case.** The loop runs max(m, n) times with O(1) work per iteration, and `toString()` copies the m + n characters once. Because the builder starts with capacity m + n, no append ever has to grow the buffer. Without the capacity hint the builder would occasionally reallocate; OpenJDK grows the buffer geometrically (roughly doubling), which keeps appends amortized O(1), but that growth policy is an implementation detail, not a documented guarantee. Pre-sizing sidesteps the question.

#### Space complexity

**O(m + n)**, all of it the output: the builder's buffer and the returned string. Beyond the output, O(1): one index and two lengths.

### Alternative: loop to the shorter length, then append the tail

Loop `i` while it is inside both words, appending one letter from each; then append the remainder of whichever word is longer, with `sb.append(word1, i, m)` and `sb.append(word2, i, n)` (one of the two ranges is empty). Same O(m + n) time and space. It has no bounds check inside the loop, and it makes the "rest of the longer word" step explicit, which some interviewers find easier to read. The cost is a second place where an off-by-one can live: the tail must start at the index where the loop stopped.

```java title="Alternative: loop to the shorter length, then append the tail"
class Solution {
    public String mergeAlternately(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        StringBuilder sb = new StringBuilder(m + n);
        int i = 0;
        while (i < m && i < n) {
            sb.append(word1.charAt(i)).append(word2.charAt(i));
            i++;
        }
        sb.append(word1, i, m);   // empty range if word1 is used up
        sb.append(word2, i, n);   // empty range if word2 is used up
        return sb.toString();
    }
}
```

## 5. Comparison table

m = `word1.length()`, n = `word2.length()`. Nothing is hashed or randomized, so expected and worst case coincide. Space includes the output, since the output is the only memory either approach uses.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. String `+=` | O((m + n)²) | O((m + n)²) | O(m + n) live |
| 2. StringBuilder, one index | O(m + n) | O(m + n) | O(m + n) (the output) |
| Alternative: shorter length, then tail | O(m + n) | O(m + n) | O(m + n) (the output) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. String `+=` | Shortest to think of | Quadratic copying; a habit that hurts on large inputs | Only as the baseline you name and replace |
| 2. StringBuilder, one index | One loop, no tail code, linear | Two bounds checks per iteration | The default answer |
| Alternative: shorter, then tail | No checks inside the loop; tail step explicit | A second index range to get right | If you find the explicit tail clearer |

## 6. Which solution to give, and when to stop optimizing

Give Approach 2. It is linear, and the single loop handles all three length cases with the same code. It is optimal: the output has m + n characters and each must be written, so Ω(m + n) time is unavoidable for any method that produces the string. Stop once you have the code, a trace with unequal lengths, and one sentence on why `+=` would be quadratic.

## 7. Interview script: code it and test it

### What I say while coding

> "I'll size the builder to `m + n` because I know the output length exactly."

> "One index to the longer length; a bounds check before each `charAt`, so I can't go off the end of the shorter word."

### Testing out loud

**Normal case, `word2` longer:** `"ace"`, `"bdfgh"`. As in the dry run: `"abcdefgh"`.

**`word1` longer:** `"wxyz"`, `"ab"`. Steps 0 and 1 append both; steps 2 and 3 only `word1`. `"waxbyz"`.

**Equal lengths:** `"abc"`, `"xyz"`. Every step appends both: `"axbycz"`, no tail.

**Length 1 against longer:** `"a"`, `"bcd"`. Step 0: `a`, `b`. Steps 1 and 2: `c`, `d`. `"abcd"`.

**Both length 1:** `"a"`, `"b"` gives `"ab"`.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | under 1 min | Start with `word1`, append the rest, lengths 1 to 100 |
| Approach | about 1 min | One index to the longer length; name `+=` as the quadratic trap |
| Code | 2 min | Approach 2 |
| Trace | 2 min | One case where each word is longer, plus equal lengths |

On a problem this small, the time is better spent on the trace than on alternatives. If the interviewer seems to want more, the follow-ups in section 10 are where the conversation usually goes.

## 9. Interviewer challenges

### About cost

#### Why not just use `+=`? The input is tiny.

**What they are testing:** whether you know what string concatenation costs in Java, and can say it precisely.

**How to reason:** strings are immutable, so each `+=` allocates a new string of the current length plus one and copies into it.

**What I say:** "Here it would pass. But each `+=` copies everything built so far, so building L characters costs about L²/2 character copies. For 200 characters that's 20,100; for a million it's around 5 × 10¹¹. A `StringBuilder` appends into a buffer, so the whole thing is O(L)."

**Nuance:** javac compiles a single expression like `a + b + c` without intermediate strings, so that is fine. The problem is concatenation repeated across loop iterations, which the language does not promise to optimize.

#### Why pass `m + n` to the `StringBuilder` constructor?

**What they are testing:** whether you understand what the builder does internally, without overclaiming.

**How to reason:** the default capacity is small (16 characters), and the builder reallocates and copies when it runs out.

**What I say:** "I know the exact output length, so I allocate it once and no append ever reallocates. Without it the result is still linear in practice, because OpenJDK grows the buffer geometrically, but pre-sizing makes the cost obvious and costs nothing."

**Nuance:** the growth factor is an implementation detail of the JDK, not part of the `StringBuilder` contract; the documented guarantee is only that capacity grows automatically.

### About correctness

#### How do you know you never read past the end of the shorter word?

**What they are testing:** loop bounds discipline.

**How to reason:** every `charAt(i)` is guarded by `i <` that word's length.

**What I say:** "Each `charAt` sits behind its own length check, so the shorter word just stops contributing once `i` reaches its length. The loop bound is the longer length, which is why the longer word's tail still comes out."

**Nuance:** if the loop ran to the shorter length instead, the tail would be silently dropped. That is the bug the explicit-tail alternative guards against with its two `append` calls.

## 10. Follow-up questions the interviewer might ask

**"What if there are k strings, merged round-robin?"**
Loop `i` from 0 to the longest length and, inside, loop over the k strings, appending `s.charAt(i)` when `i < s.length()`. Time O(k · maxLen), which is more than the total length T when lengths are very uneven. To get O(T + k), keep a queue of strings that still have letters: pop one, append its next letter, push it back if it has more.

**"What if the inputs are streams, so you don't know their lengths?"**
Use two iterators and alternate `next()` calls while both `hasNext()`, then drain the one that remains. O(m + n) time; O(1) besides the output, or no output buffer at all if the result can be streamed out too.

**"What if you take two letters from `word1`, then three from `word2`, and so on in fixed chunks?"**
Keep a separate position in each word instead of one shared index, and on each turn append up to the chunk size from the current word, advancing its position. When one word is exhausted, append the rest of the other. Still O(m + n).

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Calling the `+=` version O(m + n)** because the loop runs O(m + n) times. The cost of each iteration grows with the result's length.
- **Assuming the JIT or javac makes repeated `+=` linear.** The language allows optimizing one concatenation expression; it does not promise anything across loop iterations.

### Implementation mistakes

> [!MISTAKE] Looping to the shorter length and forgetting the tail
> `for (int i = 0; i < Math.min(m, n); i++)` with no tail step returns `"abcdef"` for `"ace"` and `"bdfgh"`: the `"gh"` is lost. Loop to the longer length with per-word checks, or append both tails after the loop.

- **Appending `word2` first.** The statement says start with `word1`; `"ace"`, `"bdfgh"` would come out as `"badcfegh"`.
- **Guarding with `i <= m`.** `charAt(m)` throws `StringIndexOutOfBoundsException`.

## 12. Pattern recognition

**The pattern:** walking two sequences in step, where each step consumes from one or both and the shorter one simply stops contributing. Here the two pointers always move together, so one index serves both; in a sorted merge, each pointer moves on its own.

**Signals in the problem statement:**

- Two sequences combined into one output in a fixed interleaving.
- "If one is longer, append the rest", which is the tail step of every merge.

**Related problems in this list:**

- [[nc-merge-sorted-array|Merge Sorted Array]]: the same "walk two inputs, drain the leftover" shape, but which input advances depends on a comparison.
- [[nc-merge-two-sorted-lists|Merge Two Sorted Lists]]: the comparison-driven merge on linked lists.
- [[nc-reverse-string|Reverse String]]: another two-index walk over characters, here from both ends.
- [[nc-concatenation-of-array|Concatenation of Array]]: index-driven construction of an output of known length.

**Takeaway:** build strings in a `StringBuilder` sized to the output, and let the loop run to the longer input so the tail needs no extra code.

## 13. 60-second revision card

**Key insight:** one index walks both words; a word that runs out stops contributing, and the longer word's tail falls out of the same loop.

**Invariant:** after index `i`, the builder holds the merge of the first `i + 1` letters of each word (cut at each word's length).

**Complexity:** O(m + n) time, O(m + n) space for the output. String `+=` in the loop would be O((m + n)²) from copying.

**Code skeleton:**

```java title="Merge Strings Alternately in one loop"
class Solution {
    public String mergeAlternately(String word1, String word2) {
        StringBuilder sb = new StringBuilder(word1.length() + word2.length());
        for (int i = 0; i < Math.max(word1.length(), word2.length()); i++) {
            if (i < word1.length()) sb.append(word1.charAt(i));
            if (i < word2.length()) sb.append(word2.charAt(i));
        }
        return sb.toString();
    }
}
```

**Main traps:**

- Loop to the longer length, or append the tail explicitly.
- `word1` first.
- No `+=` on a `String` inside a loop.

**What to say in one breath:** "One index up to the longer length; at each step append `word1`'s letter if it has one, then `word2`'s. That alternates while both have letters and appends the rest of the longer one after. A `StringBuilder` sized m + n makes it O(m + n), where `+=` would copy quadratically."
