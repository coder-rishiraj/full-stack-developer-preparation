---
problemId: nc-longest-common-prefix
title: Longest Common Prefix
source: neetcode
sourceUrl: https://leetcode.com/problems/longest-common-prefix/
difficulty: easy
patterns: [arrays-hashing, hashing]
relatedLessons: [a2-array-string-traversal, a1-strings-stringbuilder, a12-trie, a3-comparator-sorting, a14-edge-cases]
companies: []
timeToSolve: 10
---

## 1. Problem restatement

You get a list of strings. Return the longest string that every one of them starts with. If they do not all start with the same first letter (or one of them is empty), return the empty string.

**Example 1**

- Input: `strs = ["interview", "internet", "interval"]`
- Output: `"inter"`
- Why: all three begin with `i, n, t, e, r`. At position 5 they split: `v`, `n` and `v`. One disagreement is enough to stop.

**Example 2**

- Input: `strs = ["team", "teammate", "teamwork"]`
- Output: `"team"`
- Why: the answer can be a whole string. `"team"` has no position 4, so nothing longer can be a prefix of it.

**What the problem statement guarantees**

- There is at least one string and at most 200.
- Each string has between 0 and 200 characters.
- A non-empty string consists only of lowercase English letters.
- If there is no common prefix, the answer is `""`.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. It looks too easy to practise, which is exactly why people lose it to an index-out-of-bounds error or a forgotten empty string.

**How to practise**

1. Set a timer for 10 minutes and talk out loud.
2. Write down three inputs that would break a careless solution before you write any code.
3. Solve Example 1 by hand and notice what you actually look at, and in what order.
4. Write the code, then trace it on a list where the shortest string is not the first one.

> [!HINT] Hint 1: a small nudge
> The answer is a prefix of every string, so in particular it is a prefix of the first one. What is the most it can be, and what makes it shorter?

> [!HINT] Hint 2: the kind of tool you need
> You can compare the strings one at a time and keep shrinking a candidate, or you can compare them one *position* at a time, all strings together. Which of the two can stop the moment it sees the first disagreement anywhere?

> [!HINT] Hint 3: almost the whole plan
> Walk the positions of the first string from left to right. At each position, check every other string: if one of them has ended, or has a different character there, the answer is the first string cut just before this position. If no position fails, the whole first string is the answer.

**Check yourself before revealing the walkthrough**

- [ ] My code returns `"inter"` for Example 1 and `"team"` for Example 2
- [ ] It returns `""` for `["abc", ""]` and `"abc"` for `["abc"]` without crashing
- [ ] It never calls `charAt` past the end of a shorter string
- [ ] I can state its time complexity with the variables defined, and say why it can stop early

## 3. Interview script: understand the problem (≈2 min)

**Me:** So I return the longest string that is a prefix of every string in the list. All of them, not most of them?

**Interviewer:** All of them.

**Me:** And if the first characters already differ, the answer is the empty string, not `null`?

**Interviewer:** Yes, empty string.

**Me:** Can the list be empty, and can a string inside it be empty?

**Interviewer:** There is at least one string. A string can be empty.

**Me:** Then an empty string anywhere forces the answer to `""`, and a list of one string returns that string. What characters can appear?

**Interviewer:** Lowercase English letters only. Up to 200 strings, each up to 200 characters.

**Me:** Can strings repeat?

**Interviewer:** Yes, duplicates are fine.

**Me:** They don't change anything: an identical string agrees everywhere. One more: I'll treat the array as read-only, so if I want to sort I'll sort a copy.

**Interviewer:** Sure.

**Me:** By hand on `["interview", "internet", "interval"]`: I look at the first letter of all three, `i`, `i`, `i`. Then `n`, then `t`, `e`, `r`. At position 5 I see `v`, `n`, `v`: different, so I stop. `"inter"`.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ `strs.length` ≤ 200 | `strs[0]` always exists, so I can use it as the reference string without a null or empty-array check. |
| 0 ≤ `strs[i].length` ≤ 200 | Strings can be empty and can have different lengths. Every character access must check the length first. |
| Only lowercase English letters | Comparing `char` values with `==` is enough. A trie node would need only 26 children. |
| Return `""` when there is no common prefix | The "nothing in common" case is an ordinary result, not an error. |

The input is at most 200 × 200 = 40,000 characters, so any approach that reads each character a constant number of times is instant. The question is about doing it cleanly.

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| The prefix must be common to **all** strings | One disagreeing string ends the search. |
| Duplicate strings may appear | No special handling: equal strings never cause a mismatch. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The input array is read-only | Rules out sorting `strs` in place; the sorting idea needs a copy. |
| Characters are compared exactly, by `char` value | The statement says lowercase letters, so there are no case or Unicode questions. If the input could hold arbitrary Unicode, comparing `char`s could split a surrogate pair; I would mention it, not solve it. |

### Edge cases I will keep in mind

- One string: the answer is that string.
- An empty string anywhere in the list: `""`.
- The first characters differ: `""`.
- One string is a prefix of the others, and it is not the first: `["flower", "flow"]` gives `"flow"`.
- All strings identical: the answer is the whole string, and the loop must not run off its end.

## 4. Think out loud: from first idea to best solution

Throughout: **n** is the number of strings, **S** is the total number of characters in all of them, **m** is the length of the shortest string, and **L** is the length of the answer. Always L ≤ m, and n · m ≤ S.

### Approach 1: Horizontal scanning (shrink a candidate)

#### What I say out loud

> "The answer is a prefix of the first string, so the first string is my starting candidate. Then I take the strings one at a time and cut the candidate down to the part this string agrees with. After the last string, what's left is common to everyone."

#### Intuition

"Common prefix of all" can be built up pairwise: the common prefix of three strings is the common prefix of (the common prefix of the first two) and the third. The candidate can only shrink, and the moment it is empty, nothing can grow it back.

#### Algorithm

1. Let `first = strs[0]` and `len = first.length()`. The candidate is `first[0, len)`.
2. For each other string `s`, while `len > 0`: count how many leading characters `s` and the candidate share, stopping at the end of either; set `len` to that count.
3. Return `first.substring(0, len)`.

Tracking the length instead of building a new substring each time avoids copying characters on every step.

#### Why it is correct

The invariant: **after processing strings 0 to i, the candidate is the longest common prefix of exactly those strings.** It holds for the first string alone. Processing string `i + 1` keeps the part of the candidate that `s` agrees with, which is the longest prefix common to the old candidate and `s`, and so to all strings so far. After the last string it is the answer. Stopping at `len == 0` is safe, because an empty candidate stays empty.

#### Dry run

`strs = ["interview", "internet", "interval"]`

| String | Compared against candidate | Shared length | Candidate after |
|---|---|---|---|
| `"interview"` | (start) | 9 | `"interview"` |
| `"internet"` | `"interview"` | 5 (`v` vs `n`) | `"inter"` |
| `"interval"` | `"inter"` | 5 (candidate ends) | `"inter"` |

#### Java code

```java title="Approach 1: horizontal scanning"
class Solution {
    public String longestCommonPrefix(String[] strs) {
        String first = strs[0];
        int len = first.length(); // the candidate prefix is first[0, len)
        for (int i = 1; i < strs.length && len > 0; i++) {
            String s = strs[i];
            int k = 0;
            while (k < len && k < s.length() && first.charAt(k) == s.charAt(k)) {
                k++;
            }
            len = k;
        }
        return first.substring(0, len);
    }
}
```

#### Time complexity

**O(n + S) in the worst case.** String `i` costs at most `min(len, |s|) + 1` character comparisons, which is at most its own length plus one. Summed over the strings, that is at most S + n. The final `substring` copies L characters.

The weakness is that the cost depends on how much the strings agree *with the candidate so far*, not on the answer. Take 199 copies of a 200-character string of `a`s followed by the single string `"b"`. The answer is `""`, but this approach compares 200 characters for each of the 198 copies after the first before it meets `"b"`: 39,601 comparisons.

#### Space complexity

**O(1) auxiliary space**: an index and a length. The returned string of length L is the output and is not counted.

#### The bridge to the next approach

> "That example bothers me. The answer was decided by the very first column, but I only found out after reading almost the whole input, because I went string by string. If I go column by column instead, checking position 0 in every string, then position 1, the first disagreement anywhere stops everything."

### Approach 2: Vertical scanning (recommended)

#### What I say out loud

> "I'll walk the positions of the first string. At each position I check that every other string is long enough and has the same character there. The first time one doesn't, the answer is the first string cut at that position. If I get through all of `strs[0]`, the answer is all of it."

> "This reads exactly what I read by hand: one column at a time, top to bottom. It stops at the first column that fails, so it never reads past the answer plus one column."

#### Intuition

A prefix of length k is common to all strings exactly when columns 0 to k − 1 are each uniform. So scan columns left to right and stop at the first non-uniform one. A string that has ended counts as a disagreement.

#### Algorithm

1. Let `first = strs[0]`.
2. For each column `col` from 0 to `first.length() − 1`, let `c = first.charAt(col)`.
3. For each other string `s`: if `col == s.length()` or `s.charAt(col) != c`, return `first.substring(0, col)`.
4. If every column passes, return `first`.

#### Why it is correct

The invariant: **when column `col` is about to be checked, columns 0 to `col − 1` are identical in every string.** It holds at `col = 0` (no columns yet). If column `col` is identical in every string, the loop moves on and the invariant holds for `col + 1`.

- **The returned prefix is common.** It is `first[0, col)`, and the invariant says every string has those characters in those positions.
- **Nothing longer is common.** The method returns at the first column where some string has ended or has a different character, so no prefix of length `col + 1` or more can be shared. If no column fails, the answer is all of `strs[0]`, and nothing can be longer than that, because the answer is a prefix of `strs[0]`.
- **No out-of-bounds read.** `col == s.length()` is checked before `s.charAt(col)`. Columns advance by one, so a shorter string is caught exactly when the column reaches its length.

**The 20-second version to say to the interviewer:**

> "I scan column by column. Before checking column c, every string agrees on columns 0 to c − 1. The first column where a string has ended or differs is where the shared prefix stops, so I return the first string cut there; if no column fails, the first string itself is the answer."

#### Dry run

`strs = ["interview", "internet", "interval"]`

| col | `c` | `"internet"` | `"interval"` | Result |
|---|---|---|---|---|
| 0 | `i` | `i` | `i` | match |
| 1 | `n` | `n` | `n` | match |
| 2 | `t` | `t` | `t` | match |
| 3 | `e` | `e` | `e` | match |
| 4 | `r` | `r` | `r` | match |
| 5 | `v` | `n` | (not reached) | mismatch, return `"inter"` |

On the 199 `a`-strings plus `"b"` example, this approach checks column 0 in strings 1 to 199, finds `b` in the last one and stops: 199 comparisons instead of 39,601.

#### Java code

```java title="Approach 2: vertical scanning (recommended)"
class Solution {
    public String longestCommonPrefix(String[] strs) {
        String first = strs[0];
        for (int col = 0; col < first.length(); col++) {
            char c = first.charAt(col);
            for (int i = 1; i < strs.length; i++) {
                String s = strs[i];
                // Check the length first: a string that has ended disagrees.
                if (col == s.length() || s.charAt(col) != c) {
                    return first.substring(0, col);
                }
            }
        }
        return first; // every column of strs[0] matched
    }
}
```

#### Time complexity

**O(n · (L + 1)) in the worst case**, where L is the answer's length. Columns 0 to L − 1 each cost n − 1 comparisons, and the failing column (if there is one) costs at most n − 1 more. Since L ≤ m and n · m ≤ S, this is also O(n · (m + 1)), which never exceeds O(n + S).

The worst case is when all strings are identical: then L = m and every character of the shortest string is checked in every string. No algorithm can do asymptotically better in that case: if any character of the shared prefix were left unread, it could have been different. So there is an Ω(n · L) worst-case lower bound, and vertical scanning matches it.

#### Space complexity

**O(1) auxiliary space**: two indices and a `char`. The returned substring is the output.

### Alternative: sort, then compare only the first and last string

Sort a copy of the array lexicographically, then compute the common prefix of just the first and the last string. That is the answer for the whole list.

**Why it works.** If the smallest string `a` and the largest string `z` share a prefix P, every string `s` with `a ≤ s ≤ z` also starts with P. The strings that start with P form one contiguous block in sorted order, because comparison is decided at the first differing character: a string that differs from P at position k < |P| sorts entirely before or entirely after every string that starts with P. So everything between `a` and `z` lies inside the block. The converse is immediate: a prefix common to all strings is common to `a` and `z`.

```java title="Alternative: sort a copy, compare first and last"
import java.util.Arrays;

class Solution {
    public String longestCommonPrefix(String[] strs) {
        String[] sorted = strs.clone();
        Arrays.sort(sorted);
        String a = sorted[0];
        String z = sorted[sorted.length - 1];
        int k = 0;
        while (k < a.length() && k < z.length() && a.charAt(k) == z.charAt(k)) {
            k++;
        }
        return a.substring(0, k);
    }
}
```

**Cost.** The sort makes O(n log n) string comparisons, each of which can read up to M + 1 characters, where M is the longest string's length: **O(M · n log n)** worst case, plus O(n) auxiliary space for the copy and the sort's temporary storage. That is more than the O(n · (L + 1)) of vertical scanning. It is worth knowing because it is a neat argument and the interviewer may ask, and because if the strings are already sorted, the comparison of the two ends alone is O(m).

### Alternative: divide and conquer, binary search on the length, or a trie

- **Divide and conquer:** the LCP of the left half and the LCP of the right half, then their LCP. O(n + S) time, like horizontal scanning, plus O(log n) recursion depth and the intermediate strings. It only wins if the work is spread over several machines, because "common prefix" can be combined in any grouping.
- **Binary search on the answer length:** test "do all strings share a prefix of length k?" in O(n · k) and search k in [0, m]. That is O(n · m · log m), worse than scanning, because each test re-reads characters a scan reads once.
- **Trie:** insert every string, then walk down from the root while a node has one child and no word ends there. O(S) time and up to S nodes, each with 26 child slots. Too heavy for a single query, but the right structure when the set is fixed and you are asked many prefix questions (see the follow-ups and [[a12-trie|Trie]]).

## 5. Comparison table

n = number of strings, S = total characters, m = shortest length, M = longest length, L = answer length. Nothing here hashes, so expected and worst-case times are the same.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Horizontal scanning | O(n + S) | O(n + S) | O(1) |
| 2. Vertical scanning | O(n · (L + 1)) | O(n · (L + 1)) ⊆ O(n + S) | O(1) |
| Alt. Sort, compare ends | O(M · n log n) | O(M · n log n) | O(n) |
| Alt. Divide and conquer | O(n + S) | O(n + S) | O(M log n) for the intermediate prefixes |
| Alt. Binary search on length | O(n · m · log m) | O(n · m · log m) | O(1) |
| Alt. Trie | O(S) | O(S) | O(S) nodes × 26 slots |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Horizontal scanning | Simple; works on a stream of strings | Reads past the answer when the mismatch is late in the list | Strings arrive one at a time |
| 2. Vertical scanning | Stops at the first failing column; O(1) space; short | Needs all strings at once | The default answer |
| Alt. Sort, compare ends | Elegant argument | Sorting costs more than the whole problem | Strings already sorted |
| Alt. Divide and conquer | Parallelizes | More code, no single-machine gain | Distributed input |
| Alt. Binary search on length | Shows the "binary search on the answer" idea | Strictly slower | Rarely; mention only if asked |
| Alt. Trie | Answers many prefix queries on a fixed set | Large memory for one query | Repeated queries |

## 6. Which solution to give, and when to stop optimizing

Give vertical scanning. It reads each column only until the first disagreement, so its cost is tied to the answer, O(n · (L + 1)), and it uses O(1) extra space. In the worst case (all strings identical) it reads every character of the shared prefix in every string, which any correct algorithm must do, so it is optimal. Horizontal scanning is an equally acceptable answer to code; say in one sentence why vertical stops sooner. Mention the sorting trick only if asked, and do not build a trie for a single query. Once the code is correct and the empty-string case is traced, stop.

## 7. Interview script: code it and test it

### What I say while coding

> "I take `strs[0]` as the reference. It exists because the list is non-empty, and the answer can't be longer than it."

> "Outer loop over columns of the reference, inner loop over the other strings. The condition checks the length first, `col == s.length()`, then the character. The `||` short-circuits, so `charAt` is never called past the end."

> "On a mismatch I return the reference cut at `col`. If the loops finish, every column matched, so I return the whole reference."

### Testing out loud

**Normal case:** `["interview", "internet", "interval"]`. Columns 0 to 4 match; column 5 has `v` against `n`; return `first.substring(0, 5)` = `"inter"`.

**Answer is a whole string, not the first:** `["flower", "flow"]`. Columns 0 to 3 match. At column 4, `col == "flow".length()`, so return `"flow"`. The length check, not `charAt`, ends it.

**Empty string in the list:** `["abc", ""]`. Column 0: `0 == "".length()`, return `""`.

**Empty reference:** `["", "abc"]`. The outer loop does not run; return `first`, which is `""`.

**One string:** `["abc"]`. The inner loop never runs; every column "passes"; return `"abc"`.

**First characters differ:** `["dog", "cat"]`. Column 0: `c` ≠ `d`, return `""`.

## 8. Time plan for the interview

This is a warm-up. Aim to finish in about ten minutes.

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1 min | Empty list? Empty strings? All strings or most? |
| Idea | 1–2 min | Horizontal in one sentence, then why vertical stops sooner |
| Code | 2–3 min | Length check before `charAt` |
| Trace | 2 min | The normal case, then a short string that is not first, and an empty string |
| Complexity | 1 min | Define n, m, L, S before giving the bound |

Most of the marks are in the edge cases and in stating the complexity with defined variables. If you freeze, solve Example 1 by hand and say what your eyes are doing: they move down a column, not along a word.

## 9. Interviewer challenges

### About the approach

#### Both approaches are O(S) in the worst case. Why do you prefer vertical scanning?

**What they are testing:** whether you can compare algorithms beyond their worst-case bound.

**How to reason:** look for an input where they differ. Horizontal pays for agreement with the candidate so far; vertical pays only up to the first failing column.

**What I say:** "Their worst cases match, when all strings are equal. But vertical is bounded by n times (L + 1), the answer's length plus one column, while horizontal can read nearly the whole input to produce an empty answer: 199 long identical strings followed by `"b"` costs horizontal about 40,000 comparisons and vertical 199."

**Nuance:** if the strings arrive one at a time and you cannot keep them, horizontal is the only one of the two that works, and it is then the right choice.

#### Why does comparing only the first and last string after sorting work?

**What they are testing:** whether you can justify a trick rather than recite it.

**How to reason:** use how lexicographic comparison works: it is decided at the first differing position.

**What I say:** "All strings that start with a given prefix P sit together in sorted order, because any other string differs from P at some position before P ends, and that position decides whether it sorts before or after the whole group. If the smallest and largest strings both start with P, everything between them is in that group too. It's correct, but the sort costs O(M · n log n), more than scanning."

**Nuance:** it needs a copy of the array unless modifying the input is allowed, and Java's object sort uses O(n) temporary space either way.

### About the code

#### What happens with an empty string, or when a shorter string comes later?

**What they are testing:** bounds safety, the bug that actually breaks this problem.

**How to reason:** trace `["abc", ""]` and `["flower", "flow"]` through the inner condition.

**What I say:** "The condition checks `col == s.length()` before calling `charAt`, and `||` short-circuits. An empty string fails at column 0, which returns `""`. A shorter string fails exactly when the column reaches its length, which returns that string's full length as the answer."

**Nuance:** checking `col >= s.length()` is equivalent here, since `col` grows by one; `==` documents that it cannot skip past.

## 10. Follow-up questions the interviewer might ask

**"The set of strings is fixed, and you get many queries: for a query string q, what is its longest common prefix with all strings?"**
Compute the set's common prefix P once, in O(n · (L + 1)). Each query is then the common prefix of q and P: O(min(|q|, L)). No trie needed.

**"And if a query asks for the longest prefix of q shared with *any* string in the set?"**
Now a [[a12-trie|trie]] is the right structure: build it in O(S), then walk q down from the root until it falls off, O(|q|) per query, with O(S) nodes of memory.

**"The strings arrive as a stream, and you can't store them."**
Horizontal scanning: keep the current candidate and shrink it against each new string. O(1) extra space beyond the candidate, O(|s| + 1) per string, and you can stop reading once the candidate is empty.

**"What about the longest common suffix?"**
The same column scan, with columns counted from the end of each string: compare `s.charAt(s.length() - 1 - col)`. Same complexity.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Assuming the first string is the shortest.** The answer is bounded by the shortest string, which can be anywhere in the list. The length check inside the inner loop handles it; reasoning "I only loop to `strs[0].length()`, so I'm safe" does not.
- **Using a hash map or counting characters.** Prefixes are about position, and a count of letters loses position.
- **Quoting O(n · m) without defining m.** Say whether m is the shortest length, the longest or the average; vertical scanning's honest bound uses the answer length L.

### Implementation mistakes

> [!MISTAKE] Calling `charAt` before checking the length
> Writing `if (s.charAt(col) != c || col == s.length())` throws `StringIndexOutOfBoundsException` on `["flower", "flow"]` at column 4. The length check must come first.

- **Returning `""` when the loops finish.** If every column of `strs[0]` matched, the answer is all of `strs[0]`. Returning an empty string there fails `["abc"]` and `["abc", "abcd"]`.
- **Building the answer with `+=` on a `String` in a loop.** It creates a new string per character: O(L²) copying in total. Return `substring(0, col)` once.
- **Sorting `strs` in place** for the sorting trick when the input should stay untouched. Sort a copy.

## 12. Pattern recognition

**The pattern:** column-wise (synchronized) scanning of several sequences, stopping at the first position where they disagree.

**Signals in the problem statement:**

- "Common to all" over several strings or arrays.
- The answer is a prefix, so position matters and the first failure ends the search.
- Small alphabet and short strings, which make a heavy data structure unnecessary for one query.

**Related problems in this list:**

- [[nc-implement-trie|Implement Trie (Prefix Tree)]]: the structure to use when prefix questions are asked many times.
- [[nc-valid-anagram|Valid Anagram]]: also compares strings, but order does not matter there, so counting replaces positional scanning.
- [[nc-group-anagrams|Group Anagrams]]: comparing many strings by a canonical key instead of position by position.
- [[nc-word-search-ii|Word Search II]]: a trie of words, walked as a prefix tree to prune a search.

**Takeaway:** when several sequences must agree from the start, compare them one position at a time across all of them, and stop at the first position that fails.

## 13. 60-second revision card

**Key insight:** the answer is a prefix of `strs[0]`. Scan its columns, checking every string at each column, and stop at the first string that has ended or differs.

**Invariant:** before column `col` is checked, columns 0 to `col − 1` agree in every string.

**Complexity:** O(n · (L + 1)) time, where n is the number of strings and L the answer length (at most O(n + S) for S total characters); O(1) auxiliary space.

**Code skeleton:**

```java title="Vertical scanning"
class Solution {
    public String longestCommonPrefix(String[] strs) {
        String first = strs[0];
        for (int col = 0; col < first.length(); col++) {
            for (String s : strs) {           // checking strs[0] against itself is harmless
                if (col == s.length() || s.charAt(col) != first.charAt(col)) return first.substring(0, col);
            }
        }
        return first;
    }
}
```

**Main traps:**

- Check `col == s.length()` before `charAt`.
- If every column matches, return all of `strs[0]`, not `""`.
- An empty string anywhere gives `""`.
- Define n, L, m and S before stating a bound.

**What to say in one breath:** "The answer is a prefix of the first string. I scan its columns and check every string at each one; the first string that has ended or differs ends the prefix. That costs n times the answer length plus one column, which is optimal in the worst case, with O(1) extra space."
