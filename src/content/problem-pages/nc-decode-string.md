---
problemId: nc-decode-string
title: Decode String
source: neetcode
sourceUrl: https://leetcode.com/problems/decode-string/
difficulty: medium
patterns: [stack, recursion, string-parsing]
relatedLessons: [a5-stack, a5-parentheses, a1-recursion, a1-strings-stringbuilder, a14-edge-cases]
companies: []
timeToSolve: 25
---

## 1. Problem restatement

A string is compressed with one rule: `k[text]` stands for `text` written out exactly `k` times, where `k` is a positive integer. These groups can be nested, and plain letters can appear before, between and after them. Given such an encoded string, return the fully decoded string.

**Example 1**

- Input: `s = "2[x3[y]]z"`
- Output: `"xyyyxyyyz"`
- Why: the inner group `3[y]` is `yyy`, so the outer group is `2[xyyy]`, which is `xyyyxyyy`. Then the `z` follows.

**Example 2**

- Input: `s = "ab10[c]"`
- Output: `"abcccccccccc"` (`ab` followed by ten `c`s)
- Why: the count can have more than one digit. `10[c]` means ten copies, not "1, then `0[c]`".

**What the problem statement guarantees**

- The input is always valid: no extra whitespace, and the square brackets are well-formed.
- The original data contains no digits, so digits only ever appear as repeat counts (no input like `3a` or `2[4]`).
- 1 ≤ `s.length` ≤ 30.
- `s` consists of lowercase English letters, digits and the characters `[` and `]`.
- Every integer in `s` is between 1 and 300.
- The decoded output is never longer than 10^5 characters.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 25 minutes and talk out loud.
2. Decode `"3[a2[c]]"` by hand and notice in which order you actually expanded the groups.
3. Write down what you needed to remember when you hit an opening bracket, so that you could carry on after the matching closing bracket.
4. Write the code, then trace `"2[ab3[c]]d"` and `"10[a]"`.

Open a hint only after two minutes without progress.

> [!HINT] Hint 1: a small nudge
> A group can contain other groups. When you meet an opening bracket, the text inside is a smaller instance of the same problem. What do you have to put aside before you start on it, so that you can come back afterwards?

> [!HINT] Hint 2: the kind of tool you need
> Two things are put aside at every opening bracket: the repeat count you just read, and the text you had decoded so far at the current level. They are taken back in the reverse order of being put aside, so the latest group closes first. Either recursion or an explicit last-in-first-out structure keeps them for you.

> [!HINT] Hint 3: almost the whole plan
> Scan left to right with a current text and a current number. A digit extends the number (number × 10 + digit). An opening bracket saves the number and the current text, then starts both fresh. A closing bracket takes back the latest saved text and number, and appends the current text that many times to the saved text, which becomes current. A letter is appended to the current text.

**Check yourself before revealing the walkthrough**

- [ ] `"10[a]"` gives ten `a`s, not nothing
- [ ] `"2[a]3[b]"` gives `aabbb`; my number is reset after each opening bracket
- [ ] `"3[a2[c]]"` gives `accaccacc`
- [ ] I can state the running time in terms of the output length, not only the input length

## 3. Interview script: understand the problem (≈3 min)

**Me:** Let me say it back. `k[text]` means `text` repeated k times, groups can nest, and letters can sit outside groups. I return the fully expanded string.

**Interviewer:** Correct.

**Me:** Is the input always well-formed? Balanced brackets, and a number before every opening bracket?

**Interviewer:** Yes, always valid.

**Me:** Can the decoded text itself contain digits? If it could, `2[4]` would be ambiguous.

**Interviewer:** No, the original data has no digits. Digits are only repeat counts.

**Me:** Good: then any digit I see starts a count, and every count is followed by `[`. How large can a count be? Can it have several digits?

**Interviewer:** Between 1 and 300.

**Me:** So up to three digits; I must read the whole number, and it never overflows an `int`. Is k ever zero?

**Interviewer:** No, it's always positive.

**Me:** How long is the input, and how long can the output get?

**Interviewer:** The input is at most 30 characters. The output is at most 10^5.

**Me:** That's worth noting: the output can be thousands of times the input. `300[300[a]]` is 11 characters and decodes to 90,000. So my cost should be measured by the output length, not the input length. One by hand: `3[a2[c]]`. Inside, `2[c]` is `cc`, so the group is `acc`, three times: `accaccacc`.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| Input always valid, brackets well-formed | No error handling: every `[` has its `]`, every count is followed by `[`. |
| The original data has no digits | A digit always belongs to a count. A letter is always literal text. |
| Counts are integers in [1, 300] | Counts can have up to three digits, so read the whole number. 300 fits easily in an `int`. No zero counts. |
| 1 ≤ `s.length` ≤ 30 | The input is tiny; nesting depth is at most 10, since each level needs at least three characters (a digit, `[` and `]`). Recursion depth is no concern here. |
| Output length ≤ 10^5 | The output, not the input, dominates the cost. The output length fits in an `int`, and building it with a `StringBuilder` is required: repeated `String` concatenation would copy far more. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| k is always positive | Every group appears in the output at least once; there is no "group repeated zero times" case. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| An empty group such as `2[]` decodes to nothing | The statement does not rule it out explicitly. My code handles it without a special case (the inside is empty, so k copies of it add nothing), and I say so rather than assume it cannot happen. |

### Edge cases I will keep in mind

- No brackets at all: `"a"`, `"abc"`.
- Multi-digit counts: `"10[a]"`, `"100[a]"`.
- Text before, between and after groups: `"ab2[c]"`, `"2[a]b"`, `"2[a]2[b]"`.
- Nesting with no letters between levels: `"2[2[2[a]]]"`.
- Nesting with letters on both sides of an inner group: `"2[ab3[c]]d"`.
- The largest outputs: `"300[300[a]]"` (90,000 characters).

## 4. Think out loud: from first idea to best solution

Throughout, n is the length of `s`, L the length of the decoded output (L ≤ 10^5), D the maximum nesting depth of brackets, and p the number of bracket pairs. With n ≤ 30, both D and p are small (D ≤ 10 and p ≤ 10, since every bracket pair needs at least three characters), but the bounds are stated in general.

### Approach 1: Expand the innermost group, repeat

#### What I say out loud

> "When I decoded `3[a2[c]]` by hand, I expanded the innermost group first. A group that contains no other brackets is easy: it's just letters, and I can write it out. So: find an innermost group, replace it in the string by its expansion, and repeat until no brackets are left."

> "How do I find an innermost group? The first `]` in the string closes one: everything between it and the last `[` before it has no brackets. The digits just before that `[` are the count."

#### Intuition

Expanding a group that contains no brackets turns the string into a shorter encoding of the same output. Each step removes one bracket pair, so after p steps nothing is left to expand.

#### Algorithm

1. Find the first `]`. If there is none, return the string.
2. Find the last `[` before it. Walk left over the digits before that `[` to get the count k.
3. Replace "k[inner]" by `inner` repeated k times.
4. Go back to step 1.

#### Why it is correct

- **The group found is innermost:** between the last `[` before the first `]` and that `]` there is no bracket, so the inner text is plain letters (no digits either, since a digit is always followed by `[`).
- **Each step preserves the meaning:** the replaced group decodes to exactly the text put in its place, and the surrounding counts still apply to it, so the new string decodes to the same output.
- **It terminates:** each step removes one bracket pair, and there are p of them.

#### Dry run

`s = "2[ab3[c]]d"`

| Step | String before | First `]` at | Group found | String after |
|---|---|---|---|---|
| 1 | `2[ab3[c]]d` | 7 | `3[c]` → `ccc` | `2[abccc]d` |
| 2 | `2[abccc]d` | 7 | `2[abccc]` → `abcccabccc` | `abcccabcccd` |
| 3 | `abcccabcccd` | none | | return it |

#### Java code

```java title="Approach 1: expand the innermost group, repeat"
class Solution {
    public String decodeString(String s) {
        String cur = s;
        int close = cur.indexOf(']');
        while (close >= 0) {
            int open = cur.lastIndexOf('[', close);          // the innermost group ends at the first ']'
            int start = open;
            while (start > 0 && Character.isDigit(cur.charAt(start - 1))) {
                start--;                                     // the count is the digits just before '['
            }
            int k = Integer.parseInt(cur.substring(start, open));
            String inner = cur.substring(open + 1, close);   // contains no brackets, so no digits either
            cur = cur.substring(0, start) + inner.repeat(k) + cur.substring(close + 1);
            close = cur.indexOf(']');
        }
        return cur;
    }
}
```

#### Time complexity

**O(p · (n + L)) in the worst case.** Each of the p steps rebuilds the whole string, and the string never gets longer than n + L: every letter in it produces at least one output character (all counts are at least 1), so it holds at most L letters, and its digits and brackets are a subset of the original n characters. The searches for `]` and `[` are also linear in the current length.

#### Space complexity

**O(n + L) auxiliary space**: the current string and the new one being built. The returned string is the last of them.

#### The bridge to the next approach

> "This rebuilds the entire string once per bracket pair, including all the parts that are already decoded. With 30 input characters that's harmless, but it's wasteful: text far away from the group I'm expanding gets copied every time."

> "What I really want is to decode each group once, as I read it. Reading left to right, when I hit `k[`, the inside is a smaller decoding problem that ends at the matching `]`. That's recursion: decode the inside, repeat it k times, carry on. The grammar is: a sequence is letters and groups; a group is a number, `[`, a sequence, `]`. One function per rule."

### Approach 2: Recursive descent

#### What I say out loud

> "I'll keep one position into the string, shared by all calls. `decodeSequence` reads letters and groups until it reaches the end or a `]` that closes the group it is in, and returns what it decoded. When it sees a digit, it reads the whole number, skips the `[`, calls itself for the inside, skips the `]`, and appends the result k times."

#### Intuition

The input is a nested structure, and each nesting level is the same problem on a smaller piece. Recursion decodes each group exactly once, innermost first, as a natural consequence of the call order. [[a1-recursion|Recursion]] covers the idea of a function that solves the inside of a structure by calling itself.

#### Algorithm

1. `pos = 0`; return `decodeSequence()`.
2. `decodeSequence()`: with an empty builder, while `pos` is in range and `s[pos] != ']'`:
   - if `s[pos]` is a digit: read digits into k until `[`; skip `[`; `inner = decodeSequence()`; skip `]`; append `inner` k times;
   - otherwise append the letter and advance.
3. Return the builder's contents.

#### Why it is correct

**The contract:** `decodeSequence()`, called with `pos` at the start of a sequence, returns the decoding of that sequence and leaves `pos` on the `]` that ends it, or at the end of the string.

- A letter decodes to itself.
- For a group, the recursive call (by the same contract on the shorter inside) returns the decoding of the inside and stops on the matching `]`; the caller skips that `]` and appends k copies, which is the meaning of `k[inside]`.
- The loop stops at the first `]` that the current call has not opened itself, which is the one closing its own group, because every `]` opened inside was consumed by a deeper call.
- The recursion terminates because each call is on a strictly shorter part of the string, and at the top level the loop ends at the end of the string, since the brackets are balanced.

#### Dry run

`s = "2[ab3[c]]d"`

| Call | Reads | Calls / returns | `out` of this call |
|---|---|---|---|
| level 0 | `2`, `[` | calls level 1 at pos 2 | `""` |
| level 1 | `a`, `b` | | `"ab"` |
| level 1 | `3`, `[` | calls level 2 at pos 6 | `"ab"` |
| level 2 | `c`, stops at `]` (pos 7) | returns `"c"` | `"c"` |
| level 1 | skips `]`, appends `"c"` × 3, stops at `]` (pos 8) | returns `"abccc"` | `"abccc"` |
| level 0 | skips `]`, appends `"abccc"` × 2, reads `d` | returns at the end | `"abcccabcccd"` |

#### Java code

```java title="Approach 2: recursive descent"
class Solution {
    private String s;
    private int pos;                                   // next character to read, shared by all levels

    public String decodeString(String s) {
        this.s = s;
        this.pos = 0;
        return decodeSequence();
    }

    /** Decodes from pos up to the end or an unmatched ']', and leaves pos on that ']' (or at the end). */
    private String decodeSequence() {
        StringBuilder out = new StringBuilder();
        while (pos < s.length() && s.charAt(pos) != ']') {
            char c = s.charAt(pos);
            if (c >= '0' && c <= '9') {
                int k = 0;
                while (s.charAt(pos) != '[') {
                    k = k * 10 + (s.charAt(pos) - '0');    // accumulate every digit of the count
                    pos++;
                }
                pos++;                                     // skip '['
                String inner = decodeSequence();
                pos++;                                     // skip the matching ']'
                for (int r = 0; r < k; r++) {
                    out.append(inner);
                }
            } else {
                out.append(c);
                pos++;
            }
        }
        return out.toString();
    }
}
```

#### Time complexity

**O(n + D · L) in the worst case.** Every input character is read once: O(n). The rest is copying. When a group closes, its expansion (k copies of its inside) is appended to its parent: that costs the length of the expansion. Every group's expansion appears in the final output at least once, because all counts are at least 1, and groups at the same depth have non-overlapping expansions there. So the groups at any one depth copy at most L characters in total, and there are D depths. The `toString` at the end of each call copies a group's inside once more, which is within the same bound. The bound is reached: in `1[1[…1[300[a]]…]]` the 300 characters are copied once per level.

#### Space complexity

**O(L + D) auxiliary space.** The call stack has at most D + 1 frames. Each frame's partial result is a different piece of the output, so together they hold at most L characters, plus the inner string being repeated. The returned string is the output.

#### The bridge to the next approach

> "This is clean, and with depth at most 10 the recursion is no risk here. But if the input could be deeply nested, say a million levels, the call stack would overflow. And what does each frame actually hold? Two things: the count it read before `[`, and the text it had decoded before the group started. I can keep exactly those on two explicit stacks and turn the recursion into a loop."

### Approach 3: Two stacks (recommended)

#### What I say out loud

> "I scan left to right with a current builder `cur` and a number `k`. A digit extends k. At `[` I push k onto a counts stack and push `cur` onto a strings stack, then start a fresh `cur` and reset k to 0. A letter goes into `cur`. At `]` I pop the count and the outer builder, append `cur` to the outer builder that many times, and the outer builder becomes `cur`. At the end, `cur` is the answer."

> "The two stacks always have the same height: one entry per group that is open right now. That's the same information the recursion kept in its frames."

#### Intuition

Brackets nest, so the most recently opened group is always the first to close. When it closes, you need back the context that was current when it opened: what had been decoded before it, and its count. That last-opened, first-closed behaviour is what a [[a5-stack|stack]] provides; it is the same matching structure as in [[a5-parentheses|parentheses problems]].

#### Algorithm

1. `counts` and `outer` are empty stacks; `cur` is an empty builder; `k = 0`.
2. For each character `c`:
   - digit: `k = k * 10 + digit`;
   - `[`: push `k` and `cur`; `cur` = new builder; `k = 0`;
   - `]`: `times = counts.pop()`, `prev = outer.pop()`; append `cur` to `prev` `times` times; `cur = prev`;
   - letter: append to `cur`.
3. Return `cur`.

#### Why it is correct

**The invariant:** at any moment, the stacks hold one entry per open group, outermost at the bottom. Each `outer` entry is the decoded text of its enclosing level up to where that group opened, and the matching `counts` entry is that group's k. `cur` is the decoded text of the innermost open level so far (the whole string if no group is open).

- **`[` keeps it:** a new group opens; its enclosing level's text so far (`cur`) and its count (k) are saved on top, and its own text starts empty.
- **`]` keeps it:** the innermost group closes. Its text is complete in `cur`, so its expansion is `cur` repeated `times`, which belongs right after the saved text of the enclosing level. Appending it there and making that the current builder restores the enclosing level, with the expansion added.
- **Letters and digits keep it:** a letter is part of the current level's text. Digits only build k, which is consumed and reset by the `[` that always follows.
- **At the end** the brackets are balanced, so no group is open, and `cur` is the decoding of the whole string.

**The 25-second version to say to the interviewer:**

> "Groups close in reverse order of opening, so I keep a stack of open groups. At each `[` I save the text decoded so far and the count, and start fresh. At `]` the current text is the complete inside of the innermost group: I pop its count and the saved text, append the inside that many times, and continue from there. Digits accumulate times ten so multi-digit counts work, and I reset the number at each `[`."

#### Dry run

`s = "2[ab3[c]]d"` (stacks shown bottom → top)

| Char | Action | `counts` | `outer` | `cur` | `k` |
|---|---|---|---|---|---|
| `2` | k = 2 | `[]` | `[]` | `""` | 2 |
| `[` | push 2 and `""`, start fresh | `[2]` | `[""]` | `""` | 0 |
| `a` | append | `[2]` | `[""]` | `"a"` | 0 |
| `b` | append | `[2]` | `[""]` | `"ab"` | 0 |
| `3` | k = 3 | `[2]` | `[""]` | `"ab"` | 3 |
| `[` | push 3 and `"ab"`, start fresh | `[2, 3]` | `["", "ab"]` | `""` | 0 |
| `c` | append | `[2, 3]` | `["", "ab"]` | `"c"` | 0 |
| `]` | pop 3 and `"ab"`: `"ab"` + `"c"` × 3 | `[2]` | `[""]` | `"abccc"` | 0 |
| `]` | pop 2 and `""`: `""` + `"abccc"` × 2 | `[]` | `[]` | `"abcccabccc"` | 0 |
| `d` | append | `[]` | `[]` | `"abcccabcccd"` | 0 |

Result `"abcccabcccd"`, the same as both other approaches.

#### Java code

```java title="Approach 3: two stacks (recommended)"
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public String decodeString(String s) {
        Deque<Integer> counts = new ArrayDeque<>();          // the k of each open group
        Deque<StringBuilder> outer = new ArrayDeque<>();     // the text decoded before each open group
        StringBuilder cur = new StringBuilder();             // the text of the innermost open group
        int k = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c >= '0' && c <= '9') {
                k = k * 10 + (c - '0');                       // multi-digit counts
            } else if (c == '[') {
                counts.push(k);                               // save the context and start a fresh group
                outer.push(cur);
                cur = new StringBuilder();
                k = 0;
            } else if (c == ']') {
                int times = counts.pop();                     // close the group: repeat it onto its context
                StringBuilder prev = outer.pop();
                for (int r = 0; r < times; r++) {
                    prev.append(cur);
                }
                cur = prev;
            } else {
                cur.append(c);
            }
        }
        return cur.toString();
    }
}
```

#### Time complexity

**O(n + D · L) in the worst case**, by the same argument as Approach 2. Each input character costs O(1) apart from the copying at `]`. Closing a group appends its expansion, k times the length of its inside, to its parent's builder; expansions of groups at one depth are disjoint parts of the output, so each depth copies at most L characters, and there are D depths. The final `toString` copies L characters once. `StringBuilder` appends are amortized O(1) per character because the buffer grows geometrically; that is how the JDK implements it, and the amortized bound is what the analysis uses. With this problem's limits, D · L ≤ 10 × 10^5 = 10^6 character copies.

The output length is also a floor: any algorithm has to write all L characters, and in the worst case read all n input characters, so Ω(n + L) is a lower bound. Ours is within a factor D of it.

#### Space complexity

**O(L + D) auxiliary space.** The two stacks hold D entries each. The saved builders are different pieces of the output, so together with `cur` they hold O(L) characters. The returned string is the output.

## 5. Comparison table

n = input length, L = output length, D = maximum nesting depth, p = number of bracket pairs. Nothing is hashed or randomized, so expected and worst case coincide.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Expand innermost, repeat | O(p · (n + L)) | O(p · (n + L)) | O(n + L) |
| 2. Recursive descent | O(n + D · L) | O(n + D · L) | O(L + D), including D stack frames |
| 3. Two stacks | O(n + D · L) | O(n + D · L) | O(L + D) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Expand innermost | Very easy to explain; mirrors decoding by hand | Rebuilds the whole string once per group | As a spoken baseline |
| 2. Recursive descent | Follows the grammar line by line; extends easily to richer grammars | Shared index is easy to mishandle; call-stack depth equals nesting depth | When you think recursively first, or the grammar is richer (a calculator) |
| 3. Two stacks | No recursion, any nesting depth; state is easy to show in a table | The push/reset order at `[` is easy to get wrong | The default answer |

## 6. Which solution to give, and when to stop optimizing

**Give the two-stack version (Approach 3), and say that recursive descent is the same algorithm.** Both are O(n + D · L), which is within a factor D of the Ω(n + L) needed to read the input and write the output, and D ≤ 10 here. I recommend the stacks because they work for any nesting depth without a call stack, the whole state fits in a trace table, and it is the answer this problem is usually filed under. If recursion comes to you first, give Approach 2 with the same confidence; the interviewer will often ask for the other one as a follow-up, and the bridge between them (each frame holds a count and a partial string) is the thing to say.

Stop there. Removing the factor D needs a different representation of strings (for example a rope or a lazy description of repetitions), which changes the problem and is not worth it for a 10^5-character output.

## 7. Interview script: code it and test it

### What I say while coding

> "Four cases per character: digit, open bracket, close bracket, letter. I'll write them in that order."

> "Digit: `k = k * 10 + digit`, so `10` and `300` work. An assignment `k = digit` would turn `10[a]` into zero copies."

> "Open bracket: push k and the current builder, start a new builder, reset k. Resetting k is easy to forget; `2[a]3[b]` would then read the count as 23."

> "Close bracket: pop both, append the inner builder to the outer one `times` times, and continue with the outer builder. I append into the outer builder directly, so I don't create a temporary repeated string."

> "Letter: append. At the end return the builder as a string."

### Testing out loud

**Normal case:** `"2[ab3[c]]d"` gives `"abcccabcccd"`, as in the dry run table.

**Multi-digit count:** `"10[a]"`. k becomes 1, then 10. Push 10 and `""`. `a`. At `]`: ten copies. Correct.

**Count reset:** `"2[a]3[b]"`. After the first `[`, k is 0 again, so `3` gives k = 3, not 23. `aa` then `bbb`. Correct.

**No brackets:** `"abc"`. Only letters; stacks stay empty; returns `"abc"`.

**Text after a group:** `"2[a]b"`. After `]`, `cur` is `"aa"`; `b` is appended: `"aab"`. Correct.

**Nesting with nothing between levels:** `"2[2[2[a]]]"`. Three pushes of `""`, then `a`, then three closes: `aa`, `aaaa`, `aaaaaaaa`. Correct.

**Large output:** `"300[300[a]]"` produces 90,000 characters; with `StringBuilder` appends that is about 90,300 character copies plus the final `toString`.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 2–3 min | Digits only as counts, multi-digit counts, output length |
| Baseline | 1–2 min | Innermost-first expansion, said, not coded |
| Derive the structure | 3 min | "Each group is the same problem inside"; recursion or stack |
| Say why it works | 1 min | What is saved at `[` and restored at `]` |
| Code | 6–8 min | Four cases, the reset of k |
| Trace | 3–4 min | `2[ab3[c]]d`, `10[a]`, `2[a]3[b]` |
| Complexity and follow-ups | the rest | O(n + D · L) and why the output length matters |

Most of the risk is in the `[` and `]` branches, so spend the tracing time there. If you are stuck on the design, decode `3[a2[c]]` by hand and say aloud what you would have to remember if you had to read it strictly left to right: the answer is "the count and what I had so far", one pair per open bracket.

## 9. Interviewer challenges

### About the design

#### Why two stacks? Could you use one?

**What they are testing:** whether you know what state each open group needs.

**How to reason:** each open group needs a count and the text decoded before it. They are always pushed and popped together.

**What I say:** "They always move together, so one stack of pairs works just as well, for example a small record holding a count and a builder. Two stacks just avoid declaring the pair type. What matters is that both are pushed at `[` and popped at `]`."

**Nuance:** a single stack of strings in which counts are pushed as strings also works, but then you have to tell counts and text apart when popping, which adds bugs for no gain.

#### Recursion or stacks: which would you choose?

**What they are testing:** whether you see them as the same algorithm and can weigh them.

**How to reason:** list what a recursive frame stores and compare with what the stacks store.

**What I say:** "They're the same algorithm: a frame stores the count and the partial text, which is exactly one entry on each stack. I'd pick the stacks when nesting could be deep, because a deep recursion can overflow the call stack. With at most 30 characters here, depth is at most 10, so either is fine; recursion reads more like the grammar."

**Nuance:** the JVM's default thread stack typically allows thousands of frames of this size, but that depends on the configuration, which is exactly why an explicit stack is the safer default for unknown depth.

### About complexity

#### Your input is 30 characters. Why isn't this O(n)?

**What they are testing:** whether you measure cost by output size when the output can dwarf the input.

**How to reason:** look at `300[300[a]]`: 11 input characters, 90,000 output characters. Writing the output alone takes time proportional to it.

**What I say:** "Writing the answer takes at least L steps, and L can be thousands of times n. So the honest bound is in terms of both: O(n + D · L), where D is the nesting depth, because each level copies its expansion into its parent once. The lower bound is Ω(n + L), so I'm within a factor D of optimal, and D is at most 10 here."

**Nuance:** without the guarantee L ≤ 10^5, the output could be exponential in n (`300[300[300[a]]]` is 2.7 × 10^7 characters from 16 input characters), and no algorithm that builds the string could be fast.

#### Why use a `StringBuilder` rather than `+` on strings?

**What they are testing:** awareness of the cost of immutable-string concatenation.

**How to reason:** `a = a + b` copies `a` every time.

**What I say:** "A `String` is immutable, so `result = result + inner` in a loop copies the growing result on each iteration: k copies of an inside of length m would cost about m · k² / 2 character copies instead of m · k. Appending to a builder is amortized constant per character."

**Nuance:** the compiler may turn a single `a + b + c` expression into one builder, but not a concatenation repeated across loop iterations.

## 10. Follow-up questions the interviewer might ask

**"What if you only need the k-th character of the output, and the output could be huge?"**
Do not build the string. First compute the decoded length of each group (lengths can be large, so use `long`), then walk down: a group of k copies of an inside of length m maps position i to position i mod m inside it. O(n) time and O(D) space beyond the input. This is the idea of "decoded string at index" problems.

**"What if the input could be invalid?"**
Then validate while scanning: every `[` must follow a count, every `]` needs a non-empty stack, a count must be followed by `[`, and the stacks must be empty at the end. Each check is O(1), so the complexity is unchanged; decide with the interviewer whether to throw or return an error value.

**"What if a count could be 0, or the text could contain digits?"**
A zero count simply produces nothing: the code already handles it, since the append loop runs zero times. Digits in the text break the encoding itself (`2[4]` is ambiguous), so the format would need an escape character; ask how digits are escaped and treat an escaped digit as a letter.

**"Can you write the encoder?"**
Finding the shortest encoding is much harder than decoding. Standard solutions use dynamic programming over all O(n²) substrings, trying every split point and every way to write a substring as repetitions of a shorter one, which makes that standard method O(n³) or more. That is the cost of this algorithm, not a proven lower bound for the problem. Mention that the two directions have very different difficulty.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Assuming counts are single digits.** The statement allows up to 300.
- **Stating O(n) time.** The output can be thousands of times longer than the input; the cost depends on L.
- **Treating the innermost-first rewrite as the final answer.** It is correct, but it re-copies the whole string once per group.

### Implementation mistakes

> [!MISTAKE] Overwriting the count instead of accumulating it
> `k = c - '0'` keeps only the last digit: `"10[a]"` returns the empty string, because the count becomes 0. Use `k = k * 10 + (c - '0')`.

> [!MISTAKE] Not resetting the count at `[`
> If k is not set back to 0 after it is pushed, the next count continues the old one: `"2[a]3[b]"` returns `aa` followed by 23 `b`s.

> [!MISTAKE] Not skipping the closing bracket in the recursive version
> If the caller does not advance past the `]` that the inner call stopped on, the outer loop stops there too: `"2[a]b"` returns `"aa"` and loses the `b`.

- **Concatenating `String`s in the repeat loop**, which copies the growing result again on every iteration.
- **Popping the strings stack and forgetting the prefix**, so that `"ab2[c]"` loses `ab`: the saved builder must be the one you append to.

## 12. Pattern recognition

**The pattern:** a stack (or recursion) that saves the context of the enclosing level when a nested level opens and restores it when the level closes.

**Signals in the problem statement:**

- Brackets or other delimiters that nest.
- Something that happens "when a group closes": a repetition, an evaluation, a check.
- The meaning of the inside of a group depends on context that was set before it opened.

**Related problems in this list:**

- [[nc-valid-parentheses|Valid Parentheses]]: the same open/close nesting, with only a match check at each closing bracket.
- [[nc-simplify-path|Simplify Path]]: entering a directory pushes, `..` pops back to the enclosing level.
- [[nc-evaluate-reverse-polish-notation|Evaluate Reverse Polish Notation]]: an operator pops the values it applies to, the same "resolve the latest pending items" step.
- [[nc-generate-parentheses|Generate Parentheses]]: the other direction, building well-nested strings recursively.

**Takeaway:** for nested input, save what the outer level needs at each opening delimiter and restore it at the matching closing one, with an explicit stack or with recursion.

## 13. 60-second revision card

**Key insight:** a group's inside is the same problem. At `[`, save the count and the text so far; at `]`, repeat the inside onto the saved text.

**Invariant:** the stacks hold one (count, text-before-it) pair per open group; `cur` is the text of the innermost open level so far.

**Complexity:** O(n + D · L) time, O(L + D) auxiliary space; n = input length, L = output length (≤ 10^5), D = nesting depth. Ω(n + L) is a lower bound.

**Code skeleton:**

```java title="Decode String core" fragment="public String decodeString(String s)"
Deque<Integer> counts = new ArrayDeque<>();
Deque<StringBuilder> outer = new ArrayDeque<>();
StringBuilder cur = new StringBuilder();
int k = 0;
for (char c : s.toCharArray()) {
    if (Character.isDigit(c)) k = k * 10 + (c - '0');
    else if (c == '[') { counts.push(k); outer.push(cur); cur = new StringBuilder(); k = 0; }
    else if (c == ']') { StringBuilder prev = outer.pop(); for (int t = counts.pop(); t > 0; t--) prev.append(cur); cur = prev; }
    else cur.append(c);
}
return cur.toString();
```

**Main traps:**

- Counts have several digits: accumulate `k * 10 + digit`.
- Reset k to 0 after pushing it.
- Append into the popped outer builder, not into a new one.
- Measure the cost by the output length.

**What to say in one breath:** "Scan once with a number and a current builder. Digits build the number; at an open bracket push the number and the builder and start fresh; at a close bracket pop both and append the current text that many times to the saved one; letters append. It's recursion made explicit: O(n + D·L) time, where L is the output length."
