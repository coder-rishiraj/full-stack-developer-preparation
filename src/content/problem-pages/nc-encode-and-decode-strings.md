---
problemId: nc-encode-and-decode-strings
title: Encode and Decode Strings
source: neetcode
sourceUrl: https://leetcode.com/problems/encode-and-decode-strings/
difficulty: medium
patterns: [arrays-hashing, hashing]
relatedLessons: [a1-strings-stringbuilder, a2-array-string-traversal, a14-clarifying-requirements, a14-edge-cases]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

Write two methods. `encode` turns a list of strings into one single string. `decode` takes that string and rebuilds the original list: the same strings, in the same order, with nothing added, lost or merged. What the encoded string looks like is entirely up to you. The only rule is that `decode(encode(strs))` gives back `strs`, for every list that can occur.

**Example 1**

- Input: `["hi", "", "a,b"]`
- Output of `decode(encode(...))`: `["hi", "", "a,b"]`
- Why: three strings come back as three strings. The empty string in the middle must survive as an element of its own, and the comma inside `"a,b"` is part of the text, not a boundary between two strings.

**Example 2**

- Input: `[]` (no strings at all) and, separately, `[""]` (one empty string)
- Output: `[]` and `[""]` respectively
- Why: these are different lists, one of size 0 and one of size 1. So `encode` must produce two different strings for them, even though neither contains a single character of text.

**What the problem statement guarantees**

This problem is a premium problem on LeetCode. The constraints below are from NeetCode's free version of it, which is the one this list follows.

- The list has between 0 and 99 strings (`0 <= strs.length < 100`).
- Each string has between 0 and 199 characters (`0 <= strs[i].length < 200`).
- A string may contain any of 256 possible characters (codes 0 to 255), so commas, digits, spaces, `#` and control characters can all appear.
- Follow-up: could your scheme work for any set of characters at all?

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The difficulty is not the code, which is short. It is noticing why the first idea everyone has does not work, and then designing a format you can argue is unambiguous.

**How to practise**

1. Set a timer for 15 minutes and talk out loud.
2. Write down three lists that would break a careless format. Use the guarantee that any character may appear inside a string.
3. Design the encoded format on paper first. For each list you wrote down, encode it by hand and then decode it by hand, without remembering what the original was.
4. Only then write `encode` and `decode`, and trace both on `["", ""]` and on `[]`.

Open a hint only after two minutes without progress. After each hint, close it and try again before opening the next one.

> [!HINT] Hint 1: a small nudge
> Suppose you join the strings with some separator character. Which input makes the result ambiguous, given that every character is allowed inside a string? Is there any separator that avoids this?

> [!HINT] Hint 2: the kind of tool you need
> The decoder gets into trouble when it has to look at the text to find where a string ends. Either mark the special characters inside the text so they cannot be confused with the boundary, or tell the decoder in advance how many characters belong to the next string, so it never has to look at them.

> [!HINT] Hint 3: almost the whole plan
> Write each string as its length, then a `#`, then the string itself. The decoder reads digits up to the first `#`, converts them to a number k, takes exactly the next k characters as the string, and repeats from the position right after them. Ask yourself why a `#` or digits inside a string can never confuse this decoder.

**Check yourself before revealing the walkthrough**

- [ ] My format gives different encodings for `[]`, `[""]` and `["", ""]`
- [ ] `["3#abc"]` and `["#", "12"]` round-trip correctly
- [ ] A string of 12 or more characters works (its length has more than one digit)
- [ ] I can explain why the decoder can never mistake text for a boundary, without saying "it is unlikely"

## 3. Interview script: understand the problem (≈2 min)

This problem is often asked as a design question: "You need to send a list of strings over a channel that only carries one string. Write both ends." The questions below pin down what the channel can carry and what the strings can contain, because the whole difficulty lives there.

**Me:** So `encode` gets a list of strings and returns one string, `decode` gets that string and returns the list, and the round trip must give back exactly the original list. Same order, same strings. Is that right?

**Interviewer:** Yes.

**Me:** What characters can the strings contain? If they were letters only, I could join them with a comma and be done.

**Interviewer:** Any of the 256 extended ASCII characters, codes 0 to 255.

**Me:** So commas, digits, `#`, newlines, even the null character can appear inside a string. That rules out any separator character in the plain-join sense, because whatever I pick could be part of the text. Can the encoded string contain any characters too, or does it have to be printable?

**Interviewer:** Any characters. It's just a string.

**Me:** Does `decode` run in the same object as `encode`? I'm asking because if it did, I could cheat and keep the list in a field.

**Interviewer:** Assume it runs somewhere else, on another machine. Everything has to be in the string.

**Me:** Good, so both methods are stateless. Can the list be empty, and can strings be empty?

**Interviewer:** Both. Up to 99 strings, each up to 199 characters.

**Me:** Then `[]`, `[""]` and `["", ""]` must all encode differently. I'll keep those three as test cases. Let me try the obvious idea on a hard case by hand before designing anything. Join `["a,b", "c"]` with commas: `"a,b,c"`. Splitting that gives `["a", "b", "c"]`, three strings instead of two. So the decoder needs a way to tell a comma that is text from a comma that is a boundary.

### Given constraints

These are from NeetCode's statement of the problem (LeetCode's own version is premium).

| Constraint | How it shapes the solution |
|---|---|
| `0 <= strs.length < 100` | The empty list is a legal input and must encode to something that decodes to zero strings. |
| `0 <= strs[i].length < 200` | Empty strings are legal and must survive as elements. A length has at most three decimal digits, so a length header is short. |
| Any of the 256 characters 0 to 255 may appear | No character is safe as a plain separator. The format must work when a string contains every special character I choose. |
| Follow-up: any set of characters | A scheme that relies on "character X never appears" will fail the follow-up, so I prefer one that never inspects the text. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| `decode` runs elsewhere, with no shared state | Everything, including the number of strings and where each ends, must be in the encoded string. No fields. |
| The encoded string may contain any characters | I may use non-printable characters in a header if I want to, though a readable format is easier to debug. |
| Order matters | The list comes back in the original order; no sorting or grouping. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| Neither the list nor any element is `null` | The constraints talk only about lengths. If `null` elements were possible, the format would need a marker for them (see the follow-ups). |
| `decode` only receives strings that `encode` produced | I do not validate the input. A corrupted string may make `decode` throw; I can add checks if asked. |
| "Characters" means Java `char` values | Under the constraints every character fits in one `char`. For the follow-up I will be precise about chars, code points and bytes. |

### Edge cases I will keep in mind

- `[]` versus `[""]` versus `["", ""]`: zero, one and two empty strings.
- A string that contains whatever special characters my format uses, such as `"#"`, `","` or `"/"`.
- A string that looks like a piece of my own format, such as `"3#abc"`.
- A string of 12 or more characters, so its length has more than one digit.
- Characters 0 and 255, and all 256 possible characters appearing somewhere in the list.

The question list follows [[a14-clarifying-requirements|Clarifying Requirements]]; the edge cases follow [[a14-edge-cases|Edge-Case Identification]].

## 4. Think out loud: from first idea to best solution

### Approach 1: Escape special characters, end each string with a terminator

#### What I say out loud

> "The first idea is to join with a separator, but we just saw it breaks: a comma inside a string looks exactly like a comma between strings. And there is no character I can pick that is guaranteed to be absent, because all 256 can appear."

> "This is the same problem as putting a quote character inside a quoted string in source code. The usual fix is escaping: I pick an escape character, say `/`. Inside the text, every `/` becomes `//` and every `,` becomes `/,`. Then a bare comma, one not preceded by the escape, can only be a boundary."

> "One more decision: separator or terminator? If I put a comma only *between* strings, then `[]` and `[""]` both encode to the empty string. If I put a comma *after* every string, `[]` is `""` and `[""]` is `","`. So a terminator, not a separator."

#### Intuition

Escaping splits the characters of the encoded string into two roles. An escaped character is always text. An unescaped `,` is always the end of a string. Since the encoder escapes every `,` and `/` that occurs in the text, the only bare commas in the output are the ones the encoder wrote as terminators. The escape character itself must be escaped too, or a string ending in `/` would swallow its own terminator.

#### Algorithm

Encode:

1. For each string, copy its characters to the output, writing `/` before every `/` and every `,`.
2. After each string, write a bare `,`.

Decode, reading left to right with a buffer for the current string:

1. On `/`: skip it and append the next character to the buffer, whatever it is.
2. On `,`: the current string is complete. Add the buffer to the result and clear it.
3. On any other character: append it to the buffer.

#### Why it is correct

- **Every bare `,` is a terminator.** The encoder writes a comma from the text only after a `/`, and the decoder consumes the character after every `/` as text. So the decoder treats a comma as a boundary exactly when the encoder wrote it as one. The one thing to check is that the decoder never misreads which `/` is an escape: reading left to right, the first `/` of a run is always an escape, because the encoder never writes a bare `/`, and it consumes the character after it, so the decoder stays in step with the encoder.
- **Text comes back unchanged.** Every text character was written either as itself (an ordinary character) or as `/` plus itself, and the decoder turns both forms back into the character.
- **The count is right.** The encoder writes exactly one terminator per string, so the decoder emits exactly one string per terminator. `[]` encodes to `""` and decodes to no strings; `[""]` encodes to `","` and decodes to one empty string.

#### Dry run

`encode(["a,b", "", "c/"])`: `"a,b"` becomes `a/,b` plus `,`; `""` becomes just `,`; `"c/"` becomes `c//` plus `,`. The encoded string is `a/,b,,c//,` (10 characters).

| Index | Character | Action | Buffer after | Result after |
|---|---|---|---|---|
| 0 | `a` | text | `a` | `[]` |
| 1–2 | `/` `,` | escape: take `,` as text | `a,` | `[]` |
| 3 | `b` | text | `a,b` | `[]` |
| 4 | `,` | terminator | (empty) | `["a,b"]` |
| 5 | `,` | terminator | (empty) | `["a,b", ""]` |
| 6 | `c` | text | `c` | `["a,b", ""]` |
| 7–8 | `/` `/` | escape: take `/` as text | `c/` | `["a,b", ""]` |
| 9 | `,` | terminator | (empty) | `["a,b", "", "c/"]` |

#### Java code

```java title="Approach 1: escaping with a terminator"
import java.util.ArrayList;
import java.util.List;

class Solution {
    private static final char ESCAPE = '/';
    private static final char END = ',';

    public String encode(List<String> strs) {
        StringBuilder out = new StringBuilder();
        for (String s : strs) {
            for (int i = 0; i < s.length(); i++) {
                char c = s.charAt(i);
                if (c == ESCAPE || c == END) {
                    out.append(ESCAPE); // mark the next character as text
                }
                out.append(c);
            }
            out.append(END); // a terminator after every string, so [] and [""] differ
        }
        return out.toString();
    }

    public List<String> decode(String s) {
        List<String> result = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == ESCAPE) {
                i++; // the escaped character is text, whatever it is
                current.append(s.charAt(i));
            } else if (c == END) {
                result.add(current.toString());
                current.setLength(0);
            } else {
                current.append(c);
            }
        }
        return result;
    }
}
```

#### Time complexity

Let n be the number of strings and L the total number of characters in them.

**O(L + n) for both methods, in the worst case.** `encode` looks at every text character once and writes at most two characters for it, plus one terminator per string, so the encoded string has at most 2L + n characters. `StringBuilder` grows its buffer by roughly doubling, so the total copying is proportional to the final length (amortized constant per append). `decode` reads each encoded character once, and building each output string copies its characters once more. No hashing is involved, so there is no expected-versus-worst-case distinction.

#### Space complexity

**O(L + n)**, all of it for the result. `encode` returns a string of up to 2L + n characters; the builder holds the same characters before `toString` copies them, so the peak is about twice the output. `decode` returns the list (its output) and uses one buffer that holds at most one string at a time, so its auxiliary space beyond the output is O(longest string).

#### The bridge to the next approach

> "This works, and the argument is solid. But two things bother me. The output can double in size if a string is full of commas and slashes. And the decoder has to look at every single character and make a decision on it, which is exactly where escaping bugs live: forget to escape the escape character and a string ending in `/` eats its own terminator."

> "The root cause is that the decoder discovers where a string ends by reading it. What if it didn't have to? If the decoder knew *before* reading a string how long it is, it could just take that many characters and never interpret them. So I write the length first. The length is a number, and I need a way to know where the number ends, but that part is written by me, not by the user, so I control which characters can appear in it."

### Approach 2: Length prefix, `length#text` (recommended)

#### What I say out loud

> "For each string I write its length in decimal, then a `#`, then the string itself, unchanged. `["ab#", "", "12"]` becomes `3#ab#0#2#12`."

> "The decoder is always in one of two situations: at the start of a header, or inside a payload whose length it already knows. At a header, it reads digits up to the first `#`. There is no ambiguity there, because the header is something I wrote: it is only digits followed by one `#`. Then it takes exactly that many characters as the string, without looking at them, so a `#` or digits inside the text can't confuse it. Then it is at the next header."

> "And `[]` is the empty string, while `[""]` is `0#`. Every string, even an empty one, gets a header, so the count comes out right."

#### Intuition

This is length-prefixed framing, the way many network protocols separate messages: tell the reader how much is coming, then send it. The text is never scanned for special characters, so it can contain anything. The only part the decoder parses is the header, and the encoder controls exactly what a header can contain.

#### Algorithm

Encode: for each string `s`, append `s.length()`, then `#`, then `s`.

Decode, with a position `i` starting at 0:

1. While `i` is inside the string, find the first `#` at or after `i`. The characters from `i` up to it are the length, k.
2. The string is the k characters right after that `#`. Add it to the result.
3. Move `i` to the character after those k, which is the next header (or the end).

#### Why it is correct

**The invariant:** at the top of each loop iteration, `i` is the index where some header begins, or `i` equals the length of the encoded string.

- It holds at the start: the encoded string is either empty or begins with the first string's header.
- Suppose it holds and `i` is at a header. The header is the decimal digits of a length followed by a `#`, and digits are never `#`, so the first `#` at or after `i` is the header's own `#`. The digits before it are exactly the length k that the encoder wrote, so the next k characters are exactly that string's text. Whatever those characters are, `#` and digits included, the decoder copies them without reading them. After them comes the next header or the end, so the invariant holds again.

From the invariant: each header produces exactly the string the encoder wrote after it, in order, and the loop stops exactly at the end. One header per string means `[]` gives zero headers (empty output) and `[""]` gives one (`0#`).

**The 25-second version to say to the interviewer:**

> "The decoder always knows whether it is at a header or inside a string. A header is digits ending in the first `#`, and since I wrote it, it contains no `#` before that one. Then it takes exactly that many characters, without reading them, so whatever the string contains can't matter. After them is the next header. One header per string, even empty ones, so the count is exact too."

#### Dry run

`strs = ["ab#", "", "12"]`. `encode` writes `3#` + `ab#`, then `0#` + nothing, then `2#` + `12`:

| Index | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Character | `3` | `#` | `a` | `b` | `#` | `0` | `#` | `2` | `#` | `1` | `2` |

`decode("3#ab#0#2#12")`:

| `i` | First `#` at or after `i` | Length k | Text taken | Result after | Next `i` |
|---|---|---|---|---|---|
| 0 | 1 | 3 | indices 2–4: `ab#` | `["ab#"]` | 5 |
| 5 | 6 | 0 | nothing | `["ab#", ""]` | 7 |
| 7 | 8 | 2 | indices 9–10: `12` | `["ab#", "", "12"]` | 11 |
| 11 | (loop ends: `i` equals the length 11) | | | | |

Note the `#` at index 4: it belongs to the first string, and the decoder never looks for a `#` there, because it jumped straight from index 1 to index 5.

#### Java code

```java title="Approach 2: length prefix (recommended)"
import java.util.ArrayList;
import java.util.List;

class Solution {
    public String encode(List<String> strs) {
        StringBuilder out = new StringBuilder();
        for (String s : strs) {
            out.append(s.length()).append('#').append(s); // header, then the text unchanged
        }
        return out.toString();
    }

    public List<String> decode(String s) {
        List<String> result = new ArrayList<>();
        int i = 0; // invariant: i is at the start of a header, or at the end
        while (i < s.length()) {
            int hash = s.indexOf('#', i); // the header's own '#': digits never contain one
            int length = Integer.parseInt(s.substring(i, hash));
            int start = hash + 1;
            result.add(s.substring(start, start + length));
            i = start + length; // jump over the text without reading it
        }
        return result;
    }
}
```

#### Time complexity

Let n be the number of strings and L the total number of characters in them.

**O(L + n) for both methods, in the worst case.** `encode` writes each text character once and a header of d + 1 characters per string, where d is the number of digits of that string's length. Under the constraints d is at most 3, and in general d is at most one more than log₁₀ of the length, which is never more than the length plus one, so all headers together are O(L + n) characters. `decode` scans only header characters with `indexOf` (the search starts at `i` and stops at the header's `#`), parses d digits, and copies each string's text once with `substring`. Every encoded character is touched a constant number of times.

A lower bound for comparison: `decode` has to produce L characters of output and n list entries, so any decoder takes Ω(L + n) time. `encode` must, in the worst case, read essentially every character, because a character it never reads could differ between two lists that need different encodings. So this is optimal up to constant factors.

#### Space complexity

**O(L + n)**, all of it the output: the encoded string has L + O(n) characters (L plus at most 4 per string under the constraints), and the decoded list holds L characters in n strings. Beyond the output, `encode` has the builder (up to one extra copy of the output before `toString`) and `decode` creates one short header substring per string, which is garbage right after parsing.

### Alternative: fixed-width binary length header

Instead of a variable number of digits ended by `#`, every header can have the same width, so the decoder never searches for anything. Under the constraints, three decimal digits would do (`007abcdefg`), but that hard-codes the limit of 199. A width that works for any Java string is two `char`s holding the high and low 16 bits of the length, the string-world version of the 4-byte length field used by many binary protocols:

```java title="Alternative: fixed two-char header"
import java.util.ArrayList;
import java.util.List;

class Solution {
    public String encode(List<String> strs) {
        StringBuilder out = new StringBuilder();
        for (String s : strs) {
            int n = s.length();
            out.append((char) (n >>> 16)).append((char) (n & 0xFFFF)).append(s);
        }
        return out.toString();
    }

    public List<String> decode(String s) {
        List<String> result = new ArrayList<>();
        int i = 0;
        while (i < s.length()) {
            int n = (s.charAt(i) << 16) | s.charAt(i + 1); // a char is unsigned, so no sign extension
            i += 2;
            result.add(s.substring(i, i + n));
            i += n;
        }
        return result;
    }
}
```

Same O(L + n) time and space. It wins when the encoded data is binary anyway and parsing speed or a predictable header size matters. It loses in an interview: the encoded string is unreadable when you debug or trace it by hand, and the bit manipulation is one more place to slip. I mention it as the "what a real protocol does" option and code the `#` version.

## 5. Comparison table

n = number of strings, L = total number of characters. No approach uses hashing, so expected and worst case are the same.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Escaping + terminator | O(L + n) | O(L + n) | O(L + n) for the encoded string, which can be up to 2L + n characters |
| 2. Length prefix `len#text` | O(L + n) | O(L + n) | O(L + n) for the encoded string, L plus at most 4 characters per string here |
| Alt. Fixed two-char header | O(L + n) | O(L + n) | O(L + n), exactly L + 2n characters |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Escaping + terminator | Output stays readable; the encoder can stream without knowing a string's length first | Up to twice the size; every character is inspected; escaping the escape is easy to forget | When the length is not known up front (data arriving character by character), or a text format with delimiters is required |
| 2. Length prefix | Text is copied untouched, so any character is safe; short, easy to argue; readable when traced | Needs the length before writing the text | The default interview answer |
| Alt. Fixed two-char header | No search, constant-size header, works for any Java string length | Unreadable output; bit manipulation | Binary protocols, or when asked how a real wire format would do it |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** the length prefix (Approach 2).

**Is it optimal?** Yes, up to constant factors. The decoder must output L characters in n strings, which is Ω(L + n) work, and both methods are O(L + n). The encoded size is L plus a few characters per string, and some per-string overhead is unavoidable: without it, `[]`, `[""]` and `["", ""]` could not all be told apart.

**Why it is the preferred interview answer.** The correctness argument is short and complete ("the decoder never reads the text"), it handles the follow-up about arbitrary characters with no change, and there are only two lines in `decode` where a bug can hide. Escaping is also correct, but its argument has more cases, and its classic bug (not escaping the escape) is easy to make under pressure.

**When a different solution is preferable in practice:**

- The text arrives as a stream and its length is not known in advance: escaping, or chunked length prefixes (send a length, then that many characters, repeated, ending with a length of 0).
- A binary protocol: a fixed-width or variable-length binary header, not decimal digits.

**When to stop:** once you have the length prefix, have shown that `"3#abc"` and `[]` versus `[""]` work, and have said O(L + n). Shaving the header (three digits instead of a `#`, or binary) changes constants only. Mention it in a sentence if asked about size.

## 7. Interview script: code it and test it

### What I say while coding

> "`encode` is one loop: length, `#`, the string. `StringBuilder`, not `+=` in a loop, so it stays linear."

> "In `decode`, `i` always points at the start of a header. I find the `#` with `indexOf('#', i)`. The `i` matters: without it I'd find the first `#` in the whole string, which might be inside an earlier string's text."

> "The length can have several digits, so I parse the whole substring between `i` and the `#`, not one character."

> "Then `substring(start, start + length)` takes the text without inspecting it, and I set `i` to `start + length`, which by the invariant is the next header."

> "Both methods are stateless: there are no fields."

### Testing out loud

**Normal case with tricky text:** `["ab#", "", "12"]` encodes to `3#ab#0#2#12`. Decoding: header at 0 says 3, take `ab#`, jump to 5; header says 0, take nothing, jump to 7; header says 2, take `12`, jump to 11, which is the end. Back comes `["ab#", "", "12"]`. Correct.

**Empty list:** `[]` encodes to `""`. In `decode`, `i = 0` is not less than 0, so the loop never runs and the result is `[]`. Correct.

**One empty string:** `[""]` encodes to `0#`. `decode`: the `#` is at 1, length 0, the text is `substring(2, 2)`, which is `""`, and `i` becomes 2, the end. Result `[""]`. Correct, and different from `[]`.

**Two empty strings:** `["", ""]` encodes to `0#0#`, which decodes to two empty strings by the same steps.

**Text that looks like a header:** `["3#abc"]` encodes to `5#3#abc`. The decoder reads the header `5`, takes the 5 characters `3#abc`, and stops at 7, the end. It never sees the inner `3#` as a header because it never reads the text.

**A length with two digits:** `["abcdefghijkl"]` (12 characters) encodes to `12#abcdefghijkl`. `parseInt("12")` is 12, and the decoder takes all 12 letters.

## 8. Time plan for the interview

The code is short, so the time goes into the format design and its argument.

### Suggested split

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 2 min | Which characters can appear, statelessness, empty list and empty strings |
| Break the naive join | 1 min | One concrete counterexample: `["a,b", "c"]` |
| Design the format | 2–3 min | Escaping versus length prefix; pick one and say why |
| Argue it is unambiguous | 1 min | "The decoder never reads the text"; `[]` versus `[""]` |
| Write the code | 3–4 min | Two short methods |
| Trace | 2 min | `["ab#", "", "12"]`, then `[]` and `[""]` |
| Complexity and follow-ups | 1–2 min | O(L + n); arbitrary characters; bytes versus chars |

### Where the time should go

- **Most attention:** the counterexample and the unambiguity argument. A candidate who jumps to `len#` without saying why a delimiter fails looks like they memorized it.
- **Do not skimp on:** the empty-list trace. It is the case most often broken.
- **Least attention:** micro-optimizing header size.

### If the better idea does not come

1. Break the naive join on a concrete input out loud. The failure tells you what is missing: a way to tell text from structure.
2. Ask: "How do programming languages put a quote inside a quoted string?" That leads to escaping, which is a correct answer on its own.
3. Then ask: "What if the decoder knew how long the string was before reading it?" That leads to the length prefix.
4. If neither comes, code escaping. It is correct, linear, and a fine answer.

## 9. Interviewer challenges

### About the format

#### Why not just pick a separator that never appears in the strings?

**What they are testing:** whether you can see the hole in "pick a rare character", and whether you know exactly which constraint makes it work or fail.

**How to reason:** under these constraints every character from 0 to 255 may appear, so no character in that range is safe. A `char` above 255 cannot appear under the constraints, so it would actually work here. Then look at the follow-up, which allows any characters.

**What I say:** "Any separator in the 0 to 255 range can appear in the text, so a string containing it splits into two. Strictly, a character like `Ā` can't appear under these constraints, so it would work today. But it is correct only because of the character set, and the follow-up removes exactly that guarantee. The length prefix doesn't depend on which characters appear at all, so I prefer it."

**Nuance:** "never appears in practice" is how real bugs ship: CSV files break on commas in names, log formats break on newlines in messages. A format should be correct for every input it accepts, not likely to be.

#### A string can contain `#` and digits. Why can't `"3#abc"` confuse your decoder?

**What they are testing:** whether you understand your own format's invariant, or only remember it.

**How to reason:** ask where the decoder ever looks for a `#`. Only at the start of a header, and the encoder controls what a header contains. Text is skipped by count.

**What I say:** "The decoder only searches for `#` when it is at a header, and a header is digits followed by one `#`, which I wrote. Then it takes exactly the number of characters the header says, without reading them. So `"3#abc"` encodes to `5#3#abc`: the decoder reads 5, takes `3#abc` as text, and the inner `3#` is never seen as a header."

**Nuance:** this is why the `fromIndex` in `indexOf('#', i)` matters. Search from 0 and you can land on a `#` inside earlier text: on `1#a1#b` that version computes `substring(3, 1)` for the header and throws `StringIndexOutOfBoundsException`.

#### How do you tell an empty list from a list with one empty string?

**What they are testing:** the edge case that most first attempts get wrong.

**How to reason:** count what the encoder writes per string. If every string, even an empty one, produces at least one character of structure, the number of strings is recoverable.

**What I say:** "Every string gets a header, even an empty one. So `[]` encodes to the empty string and `[""]` to `0#`, and `["", ""]` to `0#0#`. In the escaping version the same thing is achieved by writing a terminator after every string instead of a separator between them."

**Nuance:** the separator version of escaping fails here: `[]` and `[""]` would both become `""`. `String.join` plus `split` fails even worse: `"".split(",")` returns one empty string, so `[]` comes back as `[""]`, and `split` also drops trailing empty strings, so `["a", "", ""]` comes back as `["a"]`.

#### Why the length prefix rather than escaping?

**What they are testing:** whether you chose on purpose, and whether you know when the other one wins.

**How to reason:** compare size, the number of places a bug can hide, and what each needs to know in advance.

**What I say:** "Both are linear. Escaping inspects every character and can double the size; its decoder has three cases, and forgetting to escape the escape character breaks it. The length prefix copies text untouched, and its argument is one sentence. The one thing it needs is the length before the text, which I have, because the strings are already in memory. If the data arrived as a stream of unknown length, escaping, or sending it in length-prefixed chunks, would be the way to go."

**Nuance:** HTTP/1.1 offers both styles: a `Content-Length` header (length prefix) and chunked transfer encoding (length-prefixed chunks, for when the total is not known up front).

### About robustness and cost

#### What does your decoder do with a corrupted or truncated string?

**What they are testing:** whether you know the assumptions your code relies on, and can harden it on request.

**How to reason:** list what can go wrong: no `#` after `i`, non-digits in the header, or a length that runs past the end.

**What I say:** "As written, I assume the input came from `encode`. On garbage it throws: `indexOf` returns −1 and `substring` throws, or `parseInt` throws `NumberFormatException`, or the length runs past the end. If this were a real protocol I'd check each case and throw a clear exception, and I'd cap the header length, so a malicious header can't make me allocate a huge string."

**Nuance:** `Integer.parseInt` also accepts a leading `+` or `-`, so a strict validator would check that the header has only digits.

#### What exactly is linear here? `substring` copies.

**What they are testing:** whether "O(n)" is a guess or comes from counting the work, including library calls.

**How to reason:** name the variables, then count each call. `substring` copies its characters in current Java versions, but each text character is copied once, by the `substring` that extracts its own string.

**What I say:** "With n strings and L total characters, `encode` appends L text characters and n short headers. `decode` scans only header characters, because `indexOf` starts at the header and stops at its `#`, and each `substring` copies one string once. So both are O(L + n). I'd only worry if I re-scanned from the start or built strings with `+=`, which would be quadratic."

**Nuance:** whether `substring` copies or shares the backing array is an implementation detail (very old Java versions shared it). The bound holds either way, since a copy costs at most the length of the string it returns.

## 10. Follow-up questions the interviewer might ask

**"Make it work for any characters at all, including Unicode." (NeetCode's follow-up)**
The length prefix already does, for any Java `String`. A Java string is a sequence of UTF-16 `char`s; a character outside the Basic Multilingual Plane, such as an emoji, is two `char`s (a surrogate pair). `length()` counts `char`s, and `substring` takes `char`s, so the header and the extraction use the same unit and the round trip is exact, even for unpaired surrogates, because the code never interprets the characters. Escaping also still works: `/` and `,` are single `char`s. Same O(L + n), with L counted in `char`s.

**"What if this goes over a network as bytes?"**
Then the unit must be bytes. Encode each string to bytes first (for example UTF-8, where one character takes 1 to 4 bytes), and write the byte length, not `s.length()`. Mixing the units breaks the format: `"é"` has length 1 in `char`s but 2 bytes in UTF-8. Also note that UTF-8 cannot represent an unpaired surrogate (the standard encoder replaces it), so "any Java string" round-trips through UTF-8 only if the strings are valid Unicode. Binary protocols usually use a fixed 4-byte length or a variable-length integer (varint) as the header.

**"What if the list can contain `null`?"**
The format needs a way to say "null", distinct from `""`. With the length prefix, a header such as `-1#` (or a one-character flag before each header) is enough, and the decoder adds `null` when it sees it. Same complexity.

**"What if the strings are huge, or arrive as a stream?"**
The decoder of a length prefix can read a header and then wait for exactly that many characters, without buffering everything, which is why protocols use it. If the encoder doesn't know a string's length up front, send it in chunks, each with its own length, and end with a zero-length chunk. Memory is then bounded by the chunk size.

**"Encode a nested structure, such as a list of lists, or a tree."**
Apply the same idea recursively: write how many items follow, then each item with its own framing. [[nc-serialize-deserialize-tree|Serialize and Deserialize Binary Tree]] is this problem for trees: there the structure (where a subtree ends) is recovered from markers for missing children, read in a fixed traversal order.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Joining with a "rare" delimiter.** Any character from 0 to 255 can appear in the text. "Rare" is not "impossible", and the follow-up removes even the characters above 255.
- **Using a separator instead of a terminator** (with escaping). Separators make `[]` and `[""]` encode identically.
- **Keeping the list in a field.** It passes a test where both calls run on one object, and fails the real contract: `decode` runs elsewhere.
- **Believing that a `#` inside the text breaks the length prefix.** It would only if the decoder searched the text for `#`. It doesn't: it skips text by count. Being unsure of this point leads people to add needless escaping on top of the length prefix.
- **Mixing up `char`s and bytes** in the network follow-up. The length must be counted in the same unit the decoder uses to extract.

### Implementation mistakes

> [!MISTAKE] `String.join` and `split`
> `split` treats every comma as a boundary, so `["a,b"]` comes back as `["a", "b"]`. It also drops trailing empty strings (`["a", "", ""]` comes back as `["a"]`), and `"".split(",")` returns one empty string, so `[]` comes back as `[""]`.

> [!MISTAKE] Reading a one-digit length
> `int length = s.charAt(i) - '0'` works until a string has 10 or more characters. On `["abcdefghijkl"]`, encoded as `12#abcdefghijkl`, it reads length 1, returns `"#"` as the first string, then reads `'a' - '0'` = 49 as the next length and throws `StringIndexOutOfBoundsException`. Parse every digit up to the `#`.

- **`indexOf('#')` without the start index.** It always finds the first `#` in the whole string. On `1#a1#b` the second header is computed as `substring(3, 1)`, which throws.
- **Not escaping the escape character** (in the escaping approach). If only `,` is escaped, `["a/", "b"]` encodes to `a/,b,`, and the decoder reads `/,` as a text comma: the result is `["a,b"]`.
- **Off by one around the `#`.** The text starts at `hash + 1`, not `hash`, and the next header starts at `start + length`.
- **Building the encoded string with `+=` in a loop.** Each `+=` copies the whole string so far, which makes `encode` quadratic in the output length. Use `StringBuilder`.

## 12. Pattern recognition

**The pattern:** framing, also called serialization. To pack several variable-length items into one flat sequence, either escape the structure characters inside the data or prefix each item with its length. Length prefixes avoid inspecting the data at all.

**Signals in the problem statement:**

- "Encode … into a single string" and "decode … back", or "serialize / deserialize".
- The items can contain any character, so a plain delimiter is not safe.
- Empty items and empty collections are allowed.
- The two ends share nothing but the encoded data.

**Related problems in this list:**

- [[nc-serialize-deserialize-tree|Serialize and Deserialize Binary Tree]]: the same framing question for a tree, where markers for missing children make the structure recoverable.
- [[nc-decode-string|Decode String]]: parses a count followed by a bracketed payload, like reading a length header, but nested.
- [[nc-group-anagrams|Group Anagrams]]: building a key from letter counts needs separators between the counts, or counts 1 and 11 merge; the same ambiguity, in a hash key instead of a message.
- [[nc-longest-common-prefix|Longest Common Prefix]]: another problem that treats a list of strings as character data and must handle empty strings carefully.

**Takeaway:** if the data can contain any character, don't search the data for a boundary. Tell the reader in advance how long each piece is.

## 13. 60-second revision card

**Key insight:** a delimiter fails because the text can contain it. Write each string as `length#text`. The decoder reads the length, then takes exactly that many characters without looking at them.

**Invariant:** at the top of the decode loop, `i` is at the start of a header (or at the end). A header is digits followed by one `#`, so the first `#` from `i` ends it.

**Complexity:** O(L + n) time for both methods, O(L + n) for the output, where n is the number of strings and L the total number of characters. Optimal, since the output alone has that size.

**Code skeleton:**

```java title="Encode and Decode Strings, length prefix"
import java.util.ArrayList;
import java.util.List;

class Solution {
    public String encode(List<String> strs) {
        StringBuilder out = new StringBuilder();
        for (String s : strs) out.append(s.length()).append('#').append(s);
        return out.toString();
    }

    public List<String> decode(String s) {
        List<String> result = new ArrayList<>();
        for (int i = 0; i < s.length(); ) {
            int hash = s.indexOf('#', i);                    // search from i, not from 0
            int start = hash + 1, end = start + Integer.parseInt(s.substring(i, hash));
            result.add(s.substring(start, end));
            i = end;
        }
        return result;
    }
}
```

**Main traps:**

- `split` on a delimiter: breaks on text that contains it, drops trailing empty strings, and turns `[]` into `[""]`.
- Lengths can have several digits: parse up to the `#`.
- `indexOf('#', i)`, with the `i`.
- Every string gets a header, even `""`, so `[]` and `[""]` differ.
- For bytes on a network, count bytes, not `char`s.

**What to say in one breath:** "Any delimiter can appear in the text, so I prefix each string with its length and a `#`. The decoder reads digits up to the first `#`, takes exactly that many characters without reading them, and repeats, so text containing `#` or digits can't confuse it. Every string gets a header, so empty strings and the empty list round-trip. O(L + n) time and space."
