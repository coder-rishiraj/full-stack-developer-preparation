---
summary: Subsequence problems ask you to pick elements in their original order while skipping any you like. You will learn why brute force over subsequences is exponential, how to choose among the four standard dynamic programming states for these problems, and how to derive solutions for matching, counting and palindrome questions from first principles.
difficulty: intermediate
minutes: 60
objectives:
  - Distinguish subsequences, substrings and subarrays, and count how many of each a sequence has
  - Choose a state shape — prefix with take/skip, ending at i, prefix pair or interval — from the wording of a problem
  - Derive the state, recurrence, base cases, order and answer for Distinct Subsequences and Longest Palindromic Subsequence
  - Explain why the greedy two-pointer check for Is Subsequence is correct and adapt it to many queries
  - Count distinct subsequences without double counting, handling the empty subsequence and overflow correctly
---

## Introduction

Take the word `abcde`. Cross out `b` and `d`, and you are left with `ace`. You did not move any letter; you only deleted some. `ace` is a **subsequence** of `abcde`: a sequence obtained by deleting zero or more elements without changing the order of the rest. By contrast, `bcd` is a **substring** — a contiguous block — and `aec` is neither, because it reorders the letters.

A large family of problems is built on this one idea of "keep the order, skip whatever you want". Is one string hidden inside another? What is the longest sequence two strings have in common? How many ways can a pattern be picked out of a text? What is the longest palindrome you can get by deleting letters? How few elements must be removed to make an array sorted?

These problems look different, but they share a structure. Every subsequence is the result of a series of yes/no decisions, one per element, so there are exponentially many of them. Yet the decisions made so far usually matter to the future only through a small summary — a position, a last value, a pair of positions. That is precisely the situation in which dynamic programming turns an exponential search into a polynomial one. This lesson is about recognising which summary to keep. The flagship problems have their own lessons — [[a11-lis]] and [[a11-lcs]] — and here you learn the family they belong to, along with several problems that complete it.

## Before you start

- **The five decisions of a DP** — [[a11-memoization]]. Every derivation here fixes (1) the state, written as a sentence; (2) the recurrence, from the last or first choice; (3) the base cases; (4) the order of computation; and (5) where the answer lives. Complexity is the number of states times the work per state.
- **One- and two-dimensional tables** — [[a11-1d-dp]] and [[a11-2d-dp]], for filling tables and rolling them into fewer rows.
- **Enumerating subsets** — [[a9-subsets]]. A subsequence is a subset of positions, so the brute force is the subsets recursion.
- **Two pointers** — [[a2-two-pointers]], used in the greedy subsequence check.

## Subsequence, substring, subarray

The three words are easy to confuse, and confusing them leads to solving the wrong problem.

| Term | Contiguous? | Order kept? | Example from `abcde` | How many (length `n`) |
|---|---|---|---|---|
| Subsequence | No | Yes | `ace`, `bd`, `abcde`, empty | `2ⁿ` choices of positions |
| Substring (strings) | Yes | Yes | `bcd`, `a`, `abcde` | `n(n + 1)/2` non-empty |
| Subarray (arrays) | Yes | Yes | `[2, 3]` from `[1, 2, 3]` | `n(n + 1)/2` non-empty |
| Subset | No | Not required | `{e, a}` | `2ⁿ` |

"Substring" and "subarray" mean the same thing for strings and arrays respectively. A non-empty substring is fixed by choosing a start and an end with `start ≤ end`, which gives `n(n + 1)/2` options — about 5,000 for `n = 100`. A subsequence is fixed by choosing, for every position, whether to keep it, which gives `2ⁿ` options — about 10³⁰ for `n = 100`. That gap is the reason substring problems are often solved with [[a2-sliding-window]] or plain double loops, while subsequence problems almost always need dynamic programming.

The `2ⁿ` counts choices of *positions*, including the empty choice. Different position choices can spell the same string: in `aba`, keeping position 0 or position 2 both give `a`. Whether a problem counts position choices or distinct strings is a detail you must read carefully, and the two counting examples below do one of each.

## Why brute force is exponential, and where the DP comes from

Here is the brute-force shape of every subsequence problem: walk through the sequence and, at each element, branch into "take it" and "skip it".

```text
decide(i, summary):
    if i == n: evaluate the finished subsequence
    skip: decide(i + 1, summary)
    take: if allowed, decide(i + 1, summary updated with element i)
```

With two branches per element, the recursion tree has `2ⁿ` leaves. But look at what the function needs from the past. Not the whole list of taken elements — only the `summary` that affects what may be taken next and how the result is scored. If that summary can take only a few values, the same `(i, summary)` call recurs many times, and caching it collapses the tree. The art of subsequence DP is choosing a summary that is **small** (few possible values) and **sufficient** (enough to decide every future step).

Four summaries cover nearly every problem you will meet.

| Shape | State | Summary of the past | Typical problems |
|---|---|---|---|
| Prefix with take/skip | `dp[i]` or `dp[i][c]` over the first `i` elements | A small quantity: a sum, a count, whether the last was taken | Maximum non-adjacent sum, subset sum, counting with a target |
| Ending at `i` | `dp[i]` = best subsequence whose last element is `i` | The last element taken | LIS, longest arithmetic, bitonic, chains |
| Prefix pair | `dp[i][j]` over the first `i` of `A` and first `j` of `B` | How far each sequence has been consumed | LCS, Distinct Subsequences, Is Subsequence, edit-style problems |
| Interval | `dp[i][j]` over `s[i..j]` | Which inner block remains | Longest palindromic subsequence, minimum insertions to a palindrome |

> [!TIP] Reading the shape from the problem
> One sequence and a "chain" condition between consecutive picks (each larger than the last, a fixed difference) suggests **ending at i**. Two sequences suggest a **prefix pair**. A condition that pairs the first pick with the last pick, like a palindrome, suggests an **interval**. A condition on the *total* of what was picked suggests **prefix with take/skip** plus that total as a dimension.

## Shape 1: prefix with take/skip

When the constraint is about the collection as a whole rather than about neighbouring picks, the state is "the first `i` elements" plus whatever quantity the constraint needs. Two examples, each owned by another lesson:

- **No two adjacent picks, maximise the sum** (House Robber). The future only needs to know whether element `i − 1` was taken, which collapses to `dp[i] = max(dp[i − 1], dp[i − 2] + nums[i − 1])` over prefixes. Derived in full in [[a11-1d-dp]].
- **Does some subsequence sum to `T`?** The future needs the sum so far, so the state becomes `dp[i][s]`. That is the subset-sum form of [[a11-knapsack]].

For a subset-sum question, the order of the elements does not matter, so it is not really a "subsequence" question at all. That is a useful check: if reordering the input cannot change the answer, think knapsack or subsets, not subsequence DP.

## Shape 2: ending at i

When each pick must relate to the previous pick — strictly larger, or a fixed difference apart — the summary must include the last pick. Making it part of the state gives the **"ending at i"** shape: `dp[i]` describes the best subsequence whose final element is `nums[i]`. The recurrence looks back at every possible previous element `j < i`, and the answer is the best `dp[i]` over all `i`, because the optimal subsequence could end anywhere.

The flagship is the longest increasing subsequence, `dp[i] = 1 + max(dp[j])` over `j < i` with `nums[j] < nums[i]`, which [[a11-lis]] derives in full along with its O(n log n) speed-up.

A variant shows how to extend the summary when one value is not enough. In the **longest arithmetic subsequence** problem, consecutive picks must differ by the same amount `d`. Knowing the last element is not sufficient; you also need the difference. So the state becomes `dp[i][d]` = the length of the longest arithmetic subsequence ending at `i` with common difference `d`. Differences can be any integer, so a `HashMap` per index stores only the differences that occur.

```java title="Arithmetic.java"
import java.util.HashMap;
import java.util.Map;

public class Arithmetic {

    /** Longest arithmetic subsequence: "ending at i" state, split by common difference. */
    static int longestArithSeqLength(int[] nums) {
        int n = nums.length, best = Math.min(n, 2);
        @SuppressWarnings("unchecked")
        Map<Integer, Integer>[] dp = new HashMap[n];  // dp[i].get(d): longest ending at i, diff d
        for (int i = 0; i < n; i++) {
            dp[i] = new HashMap<>();
            for (int j = 0; j < i; j++) {
                int d = nums[i] - nums[j];
                int len = dp[j].getOrDefault(d, 1) + 1;   // a lone nums[j] counts as length 1
                dp[i].merge(d, len, Math::max);
                best = Math.max(best, len);
            }
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(longestArithSeqLength(new int[] {3, 6, 9, 12}));
        System.out.println(longestArithSeqLength(new int[] {9, 4, 7, 2, 10}));
        System.out.println(longestArithSeqLength(new int[] {20, 1, 15, 3, 10, 5, 8}));
    }
}
```

```output
4
3
4
```

The second answer is `4, 7, 10` (difference 3) and the third is `20, 15, 10, 5` (difference −5). There are O(n²) pairs `(j, i)`, each doing O(1) expected map work, so the time is O(n²) and the maps hold O(n²) entries in total.

A **longest bitonic subsequence** — one that rises and then falls — combines two "ending at i" tables: the LIS ending at `i` from the left and the longest decreasing subsequence starting at `i`. A peak at `i` gives `inc[i] + dec[i] − 1`, subtracting one because the peak is counted twice. [[a11-lis]] covers it among the LIS variations.

## Shape 3: prefix pair for two sequences

With two sequences `A` (length `m`) and `B` (length `n`), the natural summary is how much of each has been consumed. Use **prefix lengths**: `dp[i][j]` describes the first `i` characters of `A` and the first `j` characters of `B`. Prefix lengths run from 0, and that is why they are preferred over "index of the last character": the value 0 means "empty prefix", so the base cases become an ordinary row and column of the table instead of special cases for index −1.

The recurrence nearly always asks the same question: **what happens to the last character of each prefix?** For the **longest common subsequence (LCS)**:

```text
if A[i-1] == B[j-1]:  dp[i][j] = dp[i-1][j-1] + 1           (both last characters are matched)
else:                 dp[i][j] = max(dp[i-1][j], dp[i][j-1]) (one of them is not in the LCS)
base: dp[0][j] = dp[i][0] = 0
```

The full derivation, a dry run and reconstruction are in [[a11-lcs]]. One consequence is worth knowing here. **Delete Operation for Two Strings** asks for the fewest deletions from both strings to make them equal. What survives must be a common subsequence, and to delete as little as possible you keep the longest one, so the answer is `m + n − 2 · LCS`. For `sea` and `eat`, the LCS is `ea`, and the answer is `3 + 3 − 4 = 2`.

The two worked examples below — Is Subsequence and Distinct Subsequences — are also prefix-pair problems.

## Shape 4: interval

A palindrome reads the same forwards and backwards, so its *first* pick and its *last* pick must match. A prefix state cannot see both ends at once. The summary that works is "which contiguous block of the input is still available": `dp[i][j]` over the substring `s[i..j]`. The recurrence looks at the two ends of the block, and smaller blocks must be computed before larger ones. The Longest Palindromic Subsequence worked example below derives it step by step.

## Worked example 1: Is Subsequence

**Problem.** Given strings `s` and `t`, is `s` a subsequence of `t`? For `s = "ace"`, `t = "abcde"` the answer is yes; for `s = "aec"` it is no.

**The DP view.** This is a prefix-pair problem: `ok[i][j]` = "the first `i` characters of `s` are a subsequence of the first `j` characters of `t`". That works, in O(|s| · |t|) time. But this problem has a much simpler solution, and seeing why it is correct is a lesson in itself.

**The greedy.** Scan `t` from left to right with a pointer into `s`. Whenever the current character of `t` equals the next unmatched character of `s`, match it and advance. If the pointer reaches the end of `s`, the answer is yes.

**Why matching early is safe.** Suppose some valid matching uses position `p` of `t` for the first character of `s`, and the greedy uses the earliest position `e ≤ p` with the same character. Everything the valid matching does after `p` is still available after `e`, because the part of `t` after `e` contains the part after `p`. So swapping `p` for `e` never destroys a valid matching, and repeating the argument character by character shows the greedy succeeds whenever any matching exists. This is an **exchange argument**, the standard way to justify a greedy choice (see [[a10-local-vs-global]]).

**Many queries.** A follow-up asks: `t` is fixed and long, and there are a billion short strings `s` to test. Rescanning `t` each time is O(|t|) per query. Instead, preprocess `t` once into, for each letter, the sorted list of positions where it occurs. To match a character, find the first occurrence at or after the current position with a binary search, and jump past it. Each query then costs O(|s| log |t|).

```java title="IsSubsequence.java"
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class IsSubsequence {

    /** Greedy two pointers: match each character of s at its earliest possible position in t. */
    static boolean isSubsequence(String s, String t) {
        int i = 0;                                   // next character of s to match
        for (int j = 0; j < t.length() && i < s.length(); j++) {
            if (s.charAt(i) == t.charAt(j)) i++;     // earliest match: never worse to take it
        }
        return i == s.length();
    }

    /** Preprocess t once, then answer each query in O(|s| log |t|). */
    static class Matcher {
        private final List<List<Integer>> positions = new ArrayList<>();

        Matcher(String t) {
            for (int c = 0; c < 26; c++) positions.add(new ArrayList<>());
            for (int j = 0; j < t.length(); j++) positions.get(t.charAt(j) - 'a').add(j);
        }

        boolean matches(String s) {
            int pos = 0;                             // first index of t we may still use
            for (char ch : s.toCharArray()) {
                List<Integer> list = positions.get(ch - 'a');
                int k = Collections.binarySearch(list, pos);
                if (k < 0) k = -(k + 1);             // not found: insertion point = first >= pos
                if (k == list.size()) return false;  // no occurrence of ch at or after pos
                pos = list.get(k) + 1;
            }
            return true;
        }
    }

    public static void main(String[] args) {
        System.out.println(isSubsequence("ace", "abcde"));
        System.out.println(isSubsequence("aec", "abcde"));
        System.out.println(isSubsequence("", "abc"));

        Matcher m = new Matcher("abcde");
        for (String q : new String[] {"ace", "aec", "bd", "ee"}) {
            System.out.println(q + " -> " + m.matches(q));
        }
    }
}
```

```output
true
false
true
ace -> true
aec -> false
bd -> true
ee -> false
```

`Collections.binarySearch` returns the index of the key if it is present, and `-(insertionPoint) - 1` if it is not. Each position list contains distinct, sorted positions, so either way the converted `k` is the first position `>= pos`. The empty string is a subsequence of everything, and the code returns `true` for it without special handling. The query `ee` fails because `t` contains only one `e`.

An alternative to the position lists is a **next-occurrence table**: `next[j][c]` = the first index `>= j` where letter `c` occurs in `t`. It takes O(26 · |t|) memory and makes each step O(1), so it is the better choice when `t` is moderate and queries are very many.

## Worked example 2: Distinct Subsequences

**Problem.** Count the number of ways `t` can be picked out of `s` as a subsequence, where two ways differ if they use different positions of `s`. For `s = "rabbbit"`, `t = "rabbit"` the answer is 3: any one of the three `b`s can be the one left out.

**Brute force.** Walk through `s`; for each character, either skip it or, if it equals the next needed character of `t`, use it. Count the paths that consume all of `t`. Each character of `s` can branch twice, so this is up to `2^|s|` paths. The recursion's only changing parameters are the position in `s` and the position in `t` — a prefix pair, with at most `(|s| + 1)(|t| + 1)` distinct values. That is the overlap that DP exploits.

Now the five decisions.

1. **State.** `dp[i][j]` = the number of ways the first `j` characters of `t` occur as a subsequence of the first `i` characters of `s`.
2. **Recurrence.** Look at the last character of the `s`-prefix, `s[i − 1]`. Either it is not used — then all the ways come from the first `i − 1` characters, `dp[i − 1][j]` — or it is used to match the last needed character `t[j − 1]`, which is only possible if the two are equal, and then the remaining `j − 1` characters must come from the first `i − 1` characters of `s`: `dp[i − 1][j − 1]`. The two cases do not overlap (one uses `s[i − 1]`, one does not), so the counts add:
   `dp[i][j] = dp[i − 1][j] + (s[i − 1] == t[j − 1] ? dp[i − 1][j − 1] : 0)`.
3. **Base cases.** `dp[i][0] = 1` for every `i`: the empty prefix of `t` occurs in exactly one way, by picking nothing. `dp[0][j] = 0` for `j > 0`: a non-empty pattern cannot come from an empty text.
4. **Order.** Each cell reads from row `i − 1`, so fill rows top to bottom; within a row any order works.
5. **Answer.** `dp[|s|][|t|]`.

**Complexity.** `(m + 1)(n + 1)` cells with O(1) work each: **O(m · n)** time and space, where `m = |s|`, `n = |t|`.

**Dry run.** `s = "babgbag"`, `t = "bag"`. Rows are prefixes of `s` (labelled by their last character), columns are prefix lengths of `t`.

| `s` prefix ends in | `j=0` (empty) | `j=1` (`b`) | `j=2` (`ba`) | `j=3` (`bag`) |
|---|---|---|---|---|
| (empty) | 1 | 0 | 0 | 0 |
| `b` | 1 | 1 | 0 | 0 |
| `a` | 1 | 1 | 1 | 0 |
| `b` | 1 | 2 | 1 | 0 |
| `g` | 1 | 2 | 1 | 1 |
| `b` | 1 | 3 | 1 | 1 |
| `a` | 1 | 3 | 4 | 1 |
| `g` | 1 | 3 | 4 | 5 |

Read the row for the second `a` (row 6): `dp[6][2] = dp[5][2] + dp[5][1] = 1 + 3 = 4`. There was one way to form `ba` without this `a`, plus one new way for each of the three `b`s before it. The final answer is 5.

**Rolling to one row.** Each row depends only on the previous one, so a single array suffices — but the update `dp[j] += dp[j − 1]` must read the *old* `dp[j − 1]`. Iterating `j` downwards guarantees that `dp[j − 1]` has not yet been overwritten in this row. This is the same reasoning as the downward capacity loop in 0/1 [[a11-knapsack]].

```java title="DistinctSubsequences.java"
public class DistinctSubsequences {

    /** Number of ways t appears in s as a subsequence (distinct index sets). */
    static long numDistinct(String s, String t) {
        int m = s.length(), n = t.length();
        // dp[i][j] = ways the first j chars of t appear in the first i chars of s
        long[][] dp = new long[m + 1][n + 1];
        for (int i = 0; i <= m; i++) dp[i][0] = 1;   // empty t: one way (pick nothing)
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                dp[i][j] = dp[i - 1][j];             // s[i-1] not used for t[j-1]
                if (s.charAt(i - 1) == t.charAt(j - 1)) {
                    dp[i][j] += dp[i - 1][j - 1];    // s[i-1] matched to t[j-1]
                }
            }
        }
        return dp[m][n];
    }

    /** Same recurrence with one row; j runs downwards so dp[j-1] is still the old row. */
    static long numDistinct1D(String s, String t) {
        int n = t.length();
        long[] dp = new long[n + 1];
        dp[0] = 1;
        for (int i = 0; i < s.length(); i++) {
            for (int j = n; j >= 1; j--) {
                if (s.charAt(i) == t.charAt(j - 1)) dp[j] += dp[j - 1];
            }
        }
        return dp[n];
    }

    public static void main(String[] args) {
        System.out.println(numDistinct("rabbbit", "rabbit") + " " + numDistinct1D("rabbbit", "rabbit"));
        System.out.println(numDistinct("babgbag", "bag") + " " + numDistinct1D("babgbag", "bag"));
        System.out.println(numDistinct("abc", "") + " " + numDistinct("", "a"));
    }
}
```

```output
3 3
5 5
1 0
```

The last line checks the bases: the empty pattern occurs once in any string, and a non-empty pattern occurs zero times in the empty string.

> [!WARNING] Counts overflow before the answer does
> Counting problems grow combinatorially. Intermediate cells can be far larger than the final answer, because a short prefix of `t` may occur in astronomically many ways even when the whole of `t` occurs rarely. Use `long`, and when the problem says "return the answer modulo 10⁹ + 7", apply `% MOD` after every addition (see [[a1-java-syntax-competitive]]). With `s` = 1,000 copies of `a` and `t` = 500 copies of `a`, the answer is the binomial coefficient C(1000, 500), about 2.7 × 10²⁹⁹ — far beyond `long`, whose maximum is about 9.2 × 10¹⁸.

## Worked example 3: counting distinct subsequences of one string

**Problem.** How many *different* non-empty strings are subsequences of `s`? For `abc` there are 7 (`a, b, c, ab, ac, bc, abc`). For `aba` there are 6 (`a, b, ab, aa, ba, aba`), not 7, because positions `{0}` and `{2}` both spell `a`. The answer is requested modulo 10⁹ + 7.

This is a prefix problem whose difficulty is entirely in **avoiding double counting**.

1. **State.** `dp[i]` = the number of distinct subsequences of the first `i` characters, **including the empty one**. Including the empty subsequence makes the recurrence uniform; it is subtracted once at the end.
2. **Recurrence.** Every distinct subsequence of the first `i` characters either does not use the new character `c = s[i − 1]` — those are the `dp[i − 1]` old ones — or ends with `c`, in which case it is some old subsequence `X` followed by `c`. That gives `2 · dp[i − 1]` candidates. Some are duplicates: if `c` appeared before, at 1-based position `p`, then every `X + c` with `X` drawn from the first `p − 1` characters was already created when `c` was processed at position `p`. There are exactly `dp[p − 1]` of those, so:
   `dp[i] = 2 · dp[i − 1] − dp[p − 1]` if `c` occurred before at position `p` (its most recent occurrence), else `2 · dp[i − 1]`.
3. **Base.** `dp[0] = 1` — the empty string has one subsequence, itself.
4. **Order.** Left to right, tracking `last[c]`, the most recent position of each letter.
5. **Answer.** `dp[n] − 1`, removing the empty subsequence.

Why subtract only for the *most recent* earlier occurrence? Because that occurrence's step already removed duplicates from all occurrences before it. Every `X + c` with `X` from an even earlier prefix is contained in the `dp[p − 1]` set, since the first `p − 1` characters include those earlier prefixes.

**Dry run** on `aba`: `dp[0] = 1` (`{""}`). Reading `a`: no earlier `a`, `dp[1] = 2` (`{"", a}`). Reading `b`: `dp[2] = 4` (`{"", a, b, ab}`). Reading `a` again: its previous position is `p = 1`, so `dp[3] = 2 · 4 − dp[0] = 7` — the one duplicate removed is `"" + a`. The answer is `7 − 1 = 6`.

```java title="CountDistinct.java"
import java.util.Arrays;

public class CountDistinct {
    static final int MOD = 1_000_000_007;

    /** Number of distinct NON-EMPTY subsequences of s, modulo 1e9+7. */
    static int distinctSubseqII(String s) {
        int n = s.length();
        long[] dp = new long[n + 1];   // dp[i] = distinct subsequences of s[0..i), INCLUDING empty
        dp[0] = 1;                     // only the empty subsequence
        int[] last = new int[26];      // last[c] = 1-based position of c's previous occurrence
        Arrays.fill(last, 0);
        for (int i = 1; i <= n; i++) {
            int c = s.charAt(i - 1) - 'a';
            dp[i] = 2 * dp[i - 1] % MOD;           // every old one, with and without s[i-1]
            if (last[c] > 0) {
                // the copies made by appending c to dp[last[c]-1] were already counted
                dp[i] = (dp[i] - dp[last[c] - 1] + MOD) % MOD;
            }
            last[c] = i;
        }
        return (int) ((dp[n] - 1 + MOD) % MOD);    // drop the empty subsequence
    }

    public static void main(String[] args) {
        for (String s : new String[] {"abc", "aba", "aaa", ""}) {
            System.out.println("\"" + s + "\" -> " + distinctSubseqII(s));
        }
    }
}
```

```output
"abc" -> 7
"aba" -> 6
"aaa" -> 3
"" -> 0
```

The `+ MOD` before taking `% MOD` matters: after reducing modulo 10⁹ + 7, `dp[i]` can be numerically smaller than the value being subtracted, and Java's `%` keeps the sign of a negative operand. Adding `MOD` keeps the result in `[0, MOD)`. The final `- 1` gets the same treatment, because `dp[n]` itself may have been reduced to 0. Time is O(n) and space O(n), reducible to O(26) by storing `dp` only at each letter's last occurrence.

## Worked example 4: Longest Palindromic Subsequence

**Problem.** Find the length of the longest subsequence of `s` that is a palindrome. For `bbbab` it is 4 (`bbbb`); for `cbbd` it is 2 (`bb`).

**Brute force.** Enumerate the `2ⁿ` subsequences and test each, O(n · 2ⁿ).

**Choosing the state.** A palindrome's first character must equal its last. If we tried a prefix state, we would need to remember the entire chosen first half to check it against the second half — not a small summary. Instead, decide the two *ends* of the palindrome together, working inwards. After deciding about `s[i]` and `s[j]`, what remains is the block between them. So the summary is an interval.

1. **State.** `dp[i][j]` = the length of the longest palindromic subsequence within `s[i..j]` (inclusive), for `i ≤ j`.
2. **Recurrence.** Consider the two end characters of the block.
   - If `s[i] == s[j]` (and `i < j`), it is never worse to use both as the outermost pair: any palindrome inside `s[i..j]` that does not use them could be wrapped by them without breaking anything. So `dp[i][j] = 2 + dp[i + 1][j − 1]`.
   - Otherwise they cannot both be used, so drop one: `dp[i][j] = max(dp[i + 1][j], dp[i][j − 1])`.
3. **Base cases.** `dp[i][i] = 1`: a single character is a palindrome. When `j = i + 1` and the two characters match, the inner block `s[i + 1..i]` is empty; treat it as 0, which a Java `int[][]` gives automatically because that cell is below the diagonal and never written.
4. **Order.** `dp[i][j]` reads `dp[i + 1][…]` (the next row down) and `dp[i][j − 1]` (to its left). So fill `i` from `n − 1` down to 0, and within each row fill `j` from `i + 1` upwards. Equivalently, fill by increasing block length. Filling `i` upwards would read rows that do not exist yet.
5. **Answer.** `dp[0][n − 1]`, the whole string.

**Complexity.** About `n²/2` cells, O(1) each: **O(n²)** time, **O(n²)** space (reducible to O(n) by keeping only rows `i` and `i + 1`).

**Dry run** on `bbbab` (rows `i`, columns `j`; dots are unused cells below the diagonal):

| `i` \ `j` | 0 `b` | 1 `b` | 2 `b` | 3 `a` | 4 `b` |
|---|---|---|---|---|---|
| 0 `b` | 1 | 2 | 3 | 3 | 4 |
| 1 `b` | . | 1 | 2 | 2 | 3 |
| 2 `b` | . | . | 1 | 1 | 3 |
| 3 `a` | . | . | . | 1 | 1 |
| 4 `b` | . | . | . | . | 1 |

The bottom row is filled first. Cell `(2, 4)`: `s[2] = b = s[4]`, so `2 + dp[3][3] = 3` (`bab`). Cell `(0, 4)`: `s[0] = b = s[4]`, so `2 + dp[1][3] = 2 + 2 = 4`, the palindrome `bbbb`.

There is also a neat reduction: **LPS(s) = LCS(s, reverse(s))**. A palindromic subsequence of `s` reads the same in the reversed string, so it is a common subsequence of the two, and LCS(s, reverse(s)) ≥ LPS(s). The reverse inequality also holds — the two lengths are always equal — although a particular longest common subsequence found by the table need not itself be a palindrome, and proving equality takes more care than this one direction. The program below computes both and they agree, as they did on every random test later in the lesson. The interval DP is still the more useful thing to learn, because the same interval shape solves problems with no LCS equivalent.

```java title="Palindromic.java"
public class Palindromic {

    /** Length of the longest palindromic subsequence of s. */
    static int lps(String s) {
        int n = s.length();
        if (n == 0) return 0;
        int[][] dp = new int[n][n];   // dp[i][j] = LPS length of s[i..j] (inclusive)
        for (int i = n - 1; i >= 0; i--) {         // i descending: dp[i+1][*] is ready
            dp[i][i] = 1;                           // one character is a palindrome
            for (int j = i + 1; j < n; j++) {       // j ascending: dp[i][j-1] is ready
                if (s.charAt(i) == s.charAt(j)) {
                    dp[i][j] = 2 + dp[i + 1][j - 1];   // 0 when j == i + 1 (empty middle)
                } else {
                    dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[0][n - 1];
    }

    static int lcs(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];
        for (int i = 1; i <= a.length(); i++)
            for (int j = 1; j <= b.length(); j++)
                dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1) ? dp[i - 1][j - 1] + 1
                                                              : Math.max(dp[i - 1][j], dp[i][j - 1]);
        return dp[a.length()][b.length()];
    }

    public static void main(String[] args) {
        for (String s : new String[] {"bbbab", "cbbd", "character"}) {
            String rev = new StringBuilder(s).reverse().toString();
            System.out.println(s + ": lps=" + lps(s) + ", lcs(s, reverse)=" + lcs(s, rev));
        }
        System.out.println("delete ops sea/eat = " + (3 + 3 - 2 * lcs("sea", "eat")));
    }
}
```

```output
bbbab: lps=4, lcs(s, reverse)=4
cbbd: lps=2, lcs(s, reverse)=2
character: lps=5, lcs(s, reverse)=5
delete ops sea/eat = 2
```

For `character` the answer is `carac`. A direct consequence: the **minimum number of insertions to make `s` a palindrome** is `n − LPS(s)`, because each character outside the longest palindromic subsequence needs a mirror partner inserted.

> [!NOTE] Subsequence versus substring palindromes
> The longest palindromic **substring** of `bbbab` is `bbb` (length 3), not `bbbb`, because a substring cannot skip the `a`. That problem is usually solved by expanding around each centre in O(n²) time with O(1) space; the subsequence version needs the interval DP.

## Minimum deletions to make an array sorted

"Delete the fewest elements so that what remains is sorted" is a subsequence problem in disguise: whatever remains is a subsequence, and to delete as little as possible you keep the longest one that is sorted. The precise answer depends on what "sorted" means:

- **Strictly increasing** order: `n − (length of the LIS)`.
- **Non-decreasing** order (equal neighbours allowed): `n − (length of the longest non-decreasing subsequence)`.

On `[1, 2, 2, 3]` the first formula gives 1 and the second gives 0. The second is what "sorted" usually means, so a solution that quotes `n − LIS` without checking can be off by the number of duplicates. [[a11-lis]] shows the one-character change that switches between the two.

```quiz
Q: A string of length 10 has how many non-empty substrings, and how many subsequences (as choices of positions, including the empty one)?
- [ ] 10 substrings and 100 subsequences
- [x] 55 substrings and 1,024 subsequences
- [ ] 1,024 substrings and 55 subsequences
- [ ] 45 substrings and 1,023 subsequences
> A non-empty substring is a choice of start ≤ end: 10 · 11 / 2 = 55. A subsequence is a keep/skip choice for each of the 10 positions: 2^10 = 1,024, including the empty choice. The exponential count is why subsequence problems need DP while substring problems can often be enumerated.

Q: In Distinct Subsequences, dp[i][j] = dp[i-1][j] + (s[i-1] == t[j-1] ? dp[i-1][j-1] : 0). Why is the result a sum rather than a maximum?
- [ ] Because the problem asks for the longest match
- [x] Because "s[i-1] unused" and "s[i-1] matched to t[j-1]" are disjoint sets of ways, and we are counting all ways
- [ ] Because a maximum would overflow
- [ ] Because the base case dp[i][0] is 1
> Counting problems add the sizes of disjoint cases; optimisation problems take the best case. The two cases differ in whether position i-1 of s is used, so no way is counted twice. Taking a maximum would return the size of only one case.

Q: In the interval DP for Longest Palindromic Subsequence, why must i be filled from n-1 down to 0?
- [ ] Because palindromes are read backwards
- [x] Because dp[i][j] depends on dp[i+1][...], which must already be computed
- [ ] Because j must be smaller than i
- [ ] Either direction works
> The recurrence reads the row below (dp[i+1][j-1] and dp[i+1][j]) and the cell to the left (dp[i][j-1]). Filling i downwards and j upwards guarantees all three are ready. Filling i upwards would read rows that are still zero and give wrong answers.

Q: How many distinct non-empty subsequences does "aab" have?
- [ ] 7
- [ ] 6
- [x] 5
- [ ] 8
> They are a, b, aa, ab, aab. With the recurrence including the empty one: dp = 1, 2, 2·2 − dp[0] = 3, 2·3 = 6; subtracting the empty subsequence gives 5. Counting position choices instead would give 2^3 − 1 = 7, which double-counts a and ab.
```

## Checking against brute force

Every recurrence above was checked against exhaustive enumeration. The program below generates 1,000 random strings of up to 12 characters over the alphabet `{a, b, c}` — a small alphabet so that repeated letters, the source of most counting bugs, are common. For each, it enumerates all `2ⁿ` position choices and compares: the greedy and binary-search subsequence checks, both Distinct Subsequences versions, the distinct-subsequence count, the LPS (directly and as the LCS of the string with its reverse), and an LCS against a second random string. Compile it in the same directory as `IsSubsequence.java`, `DistinctSubsequences.java`, `CountDistinct.java` and `Palindromic.java`.

```java title="SubseqCrossCheck.java"
import java.util.HashSet;
import java.util.Random;
import java.util.Set;

public class SubseqCrossCheck {

    // All subsequences of s as index masks; returns the string picked by a mask.
    static String pick(String s, int mask) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) if ((mask >> i & 1) == 1) sb.append(s.charAt(i));
        return sb.toString();
    }

    static boolean isPalindrome(String x) {
        return new StringBuilder(x).reverse().toString().equals(x);
    }

    static String randomString(Random rnd, int maxLen, int alphabet) {
        int len = rnd.nextInt(maxLen + 1);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < len; i++) sb.append((char) ('a' + rnd.nextInt(alphabet)));
        return sb.toString();
    }

    public static void main(String[] args) {
        Random rnd = new Random(2024);
        int tests = 1000;
        for (int t = 0; t < tests; t++) {
            String s = randomString(rnd, 12, 3);       // 3 letters: many repeats
            String q = randomString(rnd, 4, 3);
            String b = randomString(rnd, 8, 3);

            Set<String> distinct = new HashSet<>();
            long ways = 0;
            int lps = 0;
            for (int mask = 0; mask < (1 << s.length()); mask++) {
                String sub = pick(s, mask);
                distinct.add(sub);
                if (sub.equals(q)) ways++;              // distinct index sets spelling q
                if (isPalindrome(sub)) lps = Math.max(lps, sub.length());
            }
            Set<String> ofB = new HashSet<>();
            for (int mask = 0; mask < (1 << b.length()); mask++) ofB.add(pick(b, mask));
            int lcs = 0;
            for (String x : distinct) if (ofB.contains(x)) lcs = Math.max(lcs, x.length());

            boolean ok = IsSubsequence.isSubsequence(q, s) == (ways > 0)
                    && new IsSubsequence.Matcher(s).matches(q) == (ways > 0)
                    && DistinctSubsequences.numDistinct(s, q) == ways
                    && DistinctSubsequences.numDistinct1D(s, q) == ways
                    && CountDistinct.distinctSubseqII(s) == distinct.size() - 1
                    && Palindromic.lps(s) == lps
                    && Palindromic.lcs(s, new StringBuilder(s).reverse().toString()) == lps
                    && Palindromic.lcs(s, b) == lcs;
            if (!ok) {
                System.out.println("MISMATCH s=" + s + " q=" + q + " b=" + b);
                return;
            }
        }
        System.out.println("random tests passed: " + tests);
    }
}
```

```output
random tests passed: 1000
```

The brute force is deliberately naive — it shares no code or idea with the DPs — so agreement is real evidence. Note the two kinds of counting it checks: `ways` counts *position sets* (the Distinct Subsequences convention), while `distinct` is a `Set<String>` of *spellings* (the convention of the one-string count). The longest arithmetic subsequence was checked the same way on 2,000 random arrays.

## In real systems

**Diff and version control.** Comparing two versions of a file line by line is a longest-common-subsequence question: lines in the LCS are unchanged, and everything else is an insertion or deletion. Git's default diff uses Myers' algorithm, which finds a shortest edit script — equivalent to maximising the common subsequence — in O((m + n) · D) time, where `D` is the number of differences, so it is fast when files are similar.

**Bioinformatics.** DNA and protein comparison is built on subsequence alignment. Classic global and local alignment algorithms (Needleman–Wunsch, Smith–Waterman) are prefix-pair DPs like LCS, with scores for matches, mismatches and gaps instead of a plain count.

**Search and autocomplete.** "Fuzzy" file finders in editors match a typed query as a subsequence of a file path, so typing `usrctl` can find `UserController.java`. The membership test is the greedy from worked example 1; ranking the matches usually adds a DP that rewards consecutive and word-start matches.

## Trade-offs and alternatives

| Problem | Best approach | Time | Space |
|---|---|---|---|
| Is `s` a subsequence of `t` (one query) | Greedy two pointers | O(\|t\|) | O(1) |
| Same, many queries | Position lists + binary search, or next-occurrence table | O(\|s\| log \|t\|) or O(\|s\|) | O(\|t\|) or O(26 · \|t\|) |
| Distinct Subsequences | Prefix-pair DP, rolled to one row | O(m · n) | O(n) |
| Distinct subsequences of one string | Prefix DP with last-occurrence subtraction | O(n) | O(n) or O(alphabet) |
| Longest palindromic subsequence | Interval DP | O(n²) | O(n²), or O(n) with two rows |
| LIS | "Ending at i" DP, or tails + binary search | O(n²) or O(n log n) | O(n) |
| LCS | Prefix-pair DP | O(m · n) | O(min(m, n)) for length only |

The general cost of the DP approach is memory: two-sequence and interval tables are quadratic, which is 10⁸ cells for two 10,000-character strings. When only the value is needed, roll the table to one or two rows. When the actual subsequence is needed as well, either keep the full table for backtracking or use a divide-and-conquer technique (Hirschberg's algorithm) that recovers the LCS in linear space at about twice the time.

## Common mistakes

> [!MISTAKE] Solving the substring problem instead
> If the problem says "subsequence", elements may be skipped; if it says "substring" or "subarray", they may not. A contiguous solution (sliding window, Kadane) applied to a subsequence problem returns answers that are too small, and a subsequence DP applied to a substring problem returns answers that are too large. Underline the word before choosing an approach.

**Defining the state as "the answer for the prefix" when the recurrence needs the last element.** For LIS-like chains, "best among the first `i`" cannot tell whether `nums[i]` may be appended. If the recurrence needs to know what was picked last, put it in the state.

**Off-by-one between string indices and prefix lengths.** With prefix-length states, `dp[i][j]` refers to characters `s[i − 1]` and `t[j − 1]`. Writing `s.charAt(i)` reads the wrong character and throws at the last row.

**Wrong bases in counting problems.** `dp[i][0] = 1` (the empty pattern matches once) is what makes every count start. Setting it to 0 makes every answer 0.

**Forgetting the empty subsequence.** Some problems count it and most do not. Including it inside the recurrence and subtracting it at the end, as in worked example 3, is usually cleaner than special-casing it throughout.

**Rolling a table in the wrong direction.** Rolling Distinct Subsequences to one row with `j` ascending reads a value already updated in the current row and counts one character of `s` twice.

## Interview perspective

Interviewers use subsequence problems to see whether you can choose a state, not whether you remember a formula. Saying the state out loud, with its exact meaning, is the strongest signal you can give.

> [!INTERVIEW] What a strong answer sounds like
> "Two strings, order preserved, skips allowed, so I'll use prefix lengths: `dp[i][j]` is the number of ways the first `j` characters of `t` appear in the first `i` characters of `s`. The last character of `s` is either unused or matched to the last character of `t` if they're equal; those cases are disjoint, so I add them. The empty pattern matches once, so column 0 is all ones. It's O(mn), and since each row only needs the previous one, I can roll it with `j` descending."

Questions to be ready for:

- **Subsequence versus substring?** Order kept in both; only a substring must be contiguous. `2ⁿ` versus `n(n + 1)/2`.
- **Is Subsequence with a billion queries?** Preprocess positions per letter and binary search, or a next-occurrence table.
- **Why is greedy matching correct?** Exchange argument: the earliest matching position leaves a superset of options.
- **Minimum deletions to make two strings equal?** `m + n − 2 · LCS`.
- **Minimum insertions to make a palindrome?** `n − LPS`.
- **Minimum deletions to sort an array?** `n − LIS` for strictly increasing; `n −` longest non-decreasing subsequence otherwise.

## Practice

1. **Is Subsequence**, then the many-queries version with position lists.
2. **Distinct Subsequences**: fill the table for `s = "rabbbit"`, `t = "rabbit"` by hand, then roll it to one row.
3. **Delete Operation for Two Strings** via LCS, and **Minimum ASCII Delete Sum** (weight each deletion by the character code).
4. **Longest Palindromic Subsequence**, then **Minimum Insertion Steps to Make a String Palindrome**.
5. **Distinct Subsequences II** (count distinct non-empty subsequences modulo 10⁹ + 7), and trace `aab` by hand.
6. **Longest Arithmetic Subsequence**, then **Number of Matching Subsequences** (many queries against one string).
7. **Longest Bitonic Subsequence**, reusing your LIS code from [[a11-lis]].

The DSA explorer lists the matching problems under this topic; start with *Is Subsequence*, *Distinct Subsequences*, *Longest Palindromic Subsequence* and *Delete Operation for Two Strings*.

## Quick revision {#quick-revision}

- Subsequence: delete elements, keep order. Substring/subarray: contiguous. Counts: `2ⁿ` position choices vs `n(n + 1)/2` non-empty substrings.
- Brute force is take/skip over every element, `O(2ⁿ)`; DP works when the future depends only on a small summary.
- Four state shapes: **prefix with take/skip** (constraint on the total), **ending at i** (chain between consecutive picks), **prefix pair** (two sequences), **interval** (first and last picks interact, e.g. palindromes).
- Prefer prefix lengths: index 0 = empty prefix, so bases are a plain row/column.
- Is Subsequence: greedy earliest match (exchange argument), O(|t|); many queries → position lists + binary search or next-occurrence table.
- Distinct Subsequences: `dp[i][j] = dp[i−1][j] + [s[i−1] == t[j−1]] · dp[i−1][j−1]`, `dp[i][0] = 1`; roll with `j` descending; use `long`/modulo.
- Distinct subsequences of one string: `dp[i] = 2·dp[i−1] − dp[last(c) − 1]`, including empty; subtract 1 at the end; `(x − y + MOD) % MOD`.
- LPS: `dp[i][j] = 2 + dp[i+1][j−1]` if ends match, else `max(dp[i+1][j], dp[i][j−1])`; `i` descending, `j` ascending; LPS(s) = LCS(s, reverse s).
- Derived formulas: deletions to equalise two strings `m + n − 2·LCS`; insertions to a palindrome `n − LPS`; deletions to sort `n − LIS` (strict) or `n − LNDS` (non-decreasing).

## Key takeaways {#key-takeaways}

- Subsequence problems are exponential by brute force because each element is a keep/skip decision; DP works because the future depends only on a small summary of the past.
- Choosing the state means choosing that summary: the prefix and a running quantity, the last element, a pair of prefixes, or an interval.
- Write the state as a sentence, derive the recurrence from what happens to the last (or outermost) element, then let the dependencies dictate the base cases and fill order.
- Counting problems add disjoint cases and need care with duplicates, the empty subsequence and overflow; optimisation problems take the best case.
- Many "minimum deletions or insertions" problems reduce to a longest-subsequence problem, but check the exact definition (strict versus non-decreasing) before quoting a formula.
- Verify subsequence DPs against exhaustive enumeration on short random strings over a small alphabet, where repeated characters expose double counting.
