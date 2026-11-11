---
summary: Every interview solution ends with "what is the time and space complexity?", and a wrong answer there undoes a lot of good work. You will learn a repeatable method for analysing your own code under pressure — naming variables, counting iterations rather than loops, catching hidden library costs and recursion stack space — and how to state the result in a few clear sentences.
difficulty: intermediate
minutes: 45
objectives:
  - Analyse the time and space of your own interview code with a five-step method, naming every input variable
  - Explain why some nested loops are O(n) and prove it by counting total pointer movement
  - Identify hidden costs in library calls, string operations and sorting, and include them in the analysis
  - Derive the complexity of a recursive or memoised solution from states, transitions and stack depth
  - State the analysis in an interview in a few sentences, including when to give average, worst-case and amortized bounds
---

## Introduction

At some point in every coding interview, usually right after you have explained your approach and again after you have written the code, the interviewer asks: *"What's the time and space complexity?"* It sounds like a formality. It is not. A candidate who writes a correct sliding-window solution and then calls it O(n²) "because there are two loops" has shown that they do not fully understand why their own code is fast. A candidate who calls a solution O(n) while it sorts the input, or builds a new string in every iteration, has missed a cost that would matter in production.

**Complexity analysis in an interview** is the skill of deriving the Big-O time and space of *your own code*, in real time, and explaining the derivation briefly. It is different from knowing Big-O as theory. The theory — what O(n log n) means, how to simplify expressions, the difference between O, Ω and Θ — is taught in [[a1-big-o]] and [[a1-time-complexity]]. This lesson is about applying it reliably to code you wrote five minutes ago, under time pressure, and saying the result in a way an interviewer trusts.

Three things make that hard. Code has **hidden costs**: a `substring` call or a `contains` on a list is a loop you did not write. Some nested loops are **not** multiplicative, and some single loops are. And recursion hides its cost in a call tree and its space in the call stack. The method below handles each of these, and the walkthroughs show it on realistic interview problems.

## Before you start

- **Big-O notation and simplification rules** — dropping constants and lower-order terms, multiple variables. See [[a1-big-o]].
- **Counting loops, library costs and constraint budgets** — see [[a1-time-complexity]]; its table of input sizes versus feasible complexities is used here without being repeated.
- **Space complexity** — auxiliary versus output space and the recursion stack. See [[a1-space-complexity]].
- **Recursion** — call trees and base cases. See [[a1-recursion]].
- The walkthroughs touch [[a2-sliding-window]], [[a2-hashing]] and [[a11-memoization]]; you can follow them without having read those lessons.

## The intuition

Complexity is a story about **what repeats and how often**. Find the operation that is executed the most times, count how many times it runs as a function of the input size, and that count — with constants dropped — is the time complexity. Space is the same story about memory: what is stored, and how much of it exists at the same moment.

The trap is that code *shape* is a poor proxy for that count. Two nested loops look like n × n, but if the inner loop's index never resets, the inner body runs at most n times in total across the entire outer loop. A single loop looks like n, but if each iteration calls `list.remove(0)` on an `ArrayList`, each iteration secretly shifts every remaining element. The reliable approach is to stop looking at shape and ask, for each line, **"how many times does this execute over the whole run, and what does one execution cost?"**

## When complexity comes up

Complexity is discussed at three points, and the purpose is slightly different each time.

1. **After you propose an approach, before coding.** You state the expected complexity to justify the approach against the constraints: "Sorting plus one pass is O(n log n); with n up to 10⁵ that's comfortable." This is a plan, and it is how the interviewer agrees that the approach is worth coding. The link between constraints and acceptable complexity is in [[a1-time-complexity]].
2. **After coding.** You re-derive it *from the code you actually wrote*, because code drifts from plans. You might have added a `contains` check on a list, or a string concatenation, that the plan did not have.
3. **When asked "can you do better?"** Your analysis tells you where the cost is concentrated, which is where optimisation must happen — and sometimes it tells you that you are already at a lower bound and should say so. That conversation leads into [[a14-deriving-optimization]].

## A five-step method

Use the same five steps every time. With practice they take under a minute.

### Step 1: Name the variables

Before writing any Big-O, say what the letters mean. "O(n)" is ambiguous when the input has more than one dimension:

- A list of `n` words, each up to `L` characters, has total size n·L. Hashing a word costs O(L), not O(1).
- A graph has `V` vertices and `E` edges, and E can be anywhere from 0 to about V². BFS is O(V + E), and collapsing that to "O(n)" hides whether n means V or E ([[a8-graph-representation]]).
- A grid is `m × n`; a "top k" problem has both n and k; a coin problem has the number of coins and the target amount.

Keeping separate variables is not pedantry. O(n·L log L) and O(n·L) are different algorithms with different trade-offs, and the difference disappears if you write "O(n)" for both.

### Step 2: Cost each phase, and add sequential phases

Break the code into phases that run one after another: "build the map", "sort the keys", "scan the array". Cost each one separately, then **add** them. Sorting (O(n log n)) followed by a scan (O(n)) is O(n log n + n), which simplifies to O(n log n) because the sort dominates. Always mention the dominant phase by name — "dominated by the sort" — because that tells the interviewer you know where the time goes.

### Step 3: Multiply what is nested — by counting iterations, not loops

For nested code, the cost is the **total number of times the inner body executes**, multiplied by the cost of one execution. Usually that is outer iterations × inner iterations, giving the familiar O(n²). But the rule is about *total executions*, and you must check it:

- If the inner loop's variable resets every outer iteration (`for (int j = i + 1; j < n; j++)`), the inner body runs about n²/2 times: O(n²).
- If the inner loop's variable is shared and only moves forward (a `left` pointer in a sliding window, a stack that is only pushed once per element), the inner body runs at most n times *in total*: O(n) overall. This is **amortized** reasoning — the cost of the inner loop is averaged across all outer iterations. Walkthrough 2 proves it with a counter.
- If the inner loop halves something (`while (x > 0) x /= 2`), it contributes O(log x) per outer iteration.

### Step 4: Add the hidden costs of library calls

Many single lines hide a loop. The ones that come up most in Java interviews:

| Call | Cost | Why it surprises people |
|---|---|---|
| `s.substring(i, j)`, `new String(chars)`, `s.toCharArray()` | O(length) | Copies characters (since Java 7u6, `substring` copies rather than sharing) |
| `s1.equals(s2)`, `s.hashCode()` (first call) | O(length) | A `HashMap<String, …>` lookup is O(L), not O(1) |
| `str += x` in a loop | O(total length) per iteration | Strings are immutable, so the loop is O(n²) overall; use `StringBuilder` |
| `list.contains(x)`, `list.indexOf(x)` on `ArrayList` | O(n) | A linear scan; use a `HashSet` for membership |
| `list.remove(0)`, `list.add(0, x)` on `ArrayList` | O(n) | Shifts every element; use `ArrayDeque` for queue behaviour |
| `Arrays.sort`, `Collections.sort`, `list.sort` | O(n log n) | Often forgotten in the final answer |
| `new HashSet<>(collection)`, `new ArrayList<>(list)` | O(n) | Copies the elements |
| `pq.offer`, `pq.poll` / `pq.peek` | O(log n) / O(1) | `pq.remove(x)` for an arbitrary element is O(n) |
| `new PriorityQueue<>(collection)` | O(n) | Builds the heap bottom-up, cheaper than n offers |
| `TreeMap` get/put/floorKey | O(log n) | Not O(1) like `HashMap` |

[[a1-time-complexity]] explains several of these in more depth. In the interview, the habit that matters is to look at each library call in your loop body and ask whether it is O(1).

### Step 5: Count the space

Space has three parts, and you should say which you are counting:

- **Auxiliary data structures**: maps, sets, arrays, queues, the memo table. Size them by what they hold at their largest.
- **The recursion stack**: each active call holds a frame, so recursion depth is space. A DFS on a balanced tree uses O(log n) stack; on a skewed tree, O(n).
- **The output**: a result list of size n is unavoidable. The common convention is to report space *excluding* the output ("O(1) extra space beyond the output array"), but say so explicitly, because conventions differ between interviewers.

Sorting also costs space. Java's object sort (TimSort, used by `Collections.sort` and `Arrays.sort` on objects) may allocate a temporary array of up to n/2 references. If the interviewer asks for O(1) extra space, mention that sorting is not quite free.

## How to say it

A good complexity answer is two or three sentences: the result, the reason, and the dominant term.

> "Time is O(n log n): sorting is n log n and the scan after it is linear, so the sort dominates. Space is O(n) for the hash map; the recursion is only O(log n) deep, so it doesn't change that."

Compare the weak version: "It's O(n log n)." It may be right, but it gives the interviewer no evidence you derived it. And compare the over-long version: five minutes on constant factors and cache effects for a problem where nobody asked. Give the derivation in one breath, then stop and let the interviewer ask follow-ups.

> [!TIP] Re-derive after coding, out loud
> After the code is written, point at it: "This outer loop is n, this map lookup is O(1) on average, this sort is outside the loop — so O(n log n) as planned." If the code differs from the plan, the re-derivation is where you catch it, and catching it yourself is far better than having it pointed out.

## Worked walkthrough 1: Group Anagrams — two variables and a hidden sort

The prompt: *"Given an array of strings, group the anagrams together."* Clarification established: `n` words, each up to `L` lowercase letters, any output order.

The candidate's approach: two words are anagrams exactly when their letters, sorted, are identical. So use the sorted letters as a `HashMap` key.

```java title="GroupAnagrams.java"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GroupAnagrams {

    // Key = the word's letters in sorted order. O(L log L) per word.
    static String sortedKey(String w) {
        char[] cs = w.toCharArray();
        Arrays.sort(cs);
        return new String(cs);
    }

    // Key = 26 letter counts. O(L + 26) per word; assumes lowercase a-z.
    static String countKey(String w) {
        int[] count = new int[26];
        for (int i = 0; i < w.length(); i++) count[w.charAt(i) - 'a']++;
        return Arrays.toString(count);
    }

    static List<List<String>> group(String[] words, boolean useCounts) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String w : words) {
            String key = useCounts ? countKey(w) : sortedKey(w);
            groups.computeIfAbsent(key, k -> new ArrayList<>()).add(w);
        }
        List<List<String>> result = new ArrayList<>(groups.values());
        result.sort((a, b) -> a.get(0).compareTo(b.get(0)));   // fixed order for printing
        return result;
    }

    public static void main(String[] args) {
        String[] words = {"eat", "tea", "tan", "ate", "nat", "bat"};
        System.out.println(group(words, false));
        System.out.println(group(words, true));
    }
}
```

```output
[[bat], [eat, tea, ate], [tan, nat]]
[[bat], [eat, tea, ate], [tan, nat]]
```

Here is how the analysis goes in the interview, with the common wrong answer first.

> **Candidate (first attempt):** "One loop over the words with a hash map, so O(n)."
>
> **Interviewer:** "What does one iteration cost?"

That question is the interviewer pointing at Step 4. Walk through one iteration of `group` with the sorted key: `toCharArray` copies L characters (O(L)), `Arrays.sort` sorts them (O(L log L)), `new String` copies them again (O(L)), and the `HashMap` lookup must hash and compare a string of length L (O(L)). The sort dominates, so one iteration is O(L log L), and n iterations give:

> **Candidate:** "Each word costs L log L to sort, plus linear work to copy and hash the key, so time is O(n · L log L). Space is O(n · L): the map stores every word once plus a key per group. The final `result.sort` is only there to make the printed order stable — it sorts at most n groups, so it doesn't change the bound."

Now the follow-up: *"Can you avoid the sort?"* The count key builds a 26-element frequency array in O(L) and turns it into a string of constant length, so each word costs O(L + 26) = O(L), and the total is **O(n · L)**. The candidate should state the trade-off precisely: the count key is asymptotically faster but assumes a 26-letter alphabet; with arbitrary Unicode it would need a map of counts instead, and for short words the sort is fast enough that the difference is small. Both versions produce the same groups, as the output shows. Notice that none of this discussion is possible if you collapse everything into "O(n)" — the second variable `L` *is* the optimisation story.

## Worked walkthrough 2: a nested loop that is O(n)

The prompt: *"Return the length of the longest substring without repeating characters."* The candidate writes the sliding window from [[a2-sliding-window]]: extend `right` one character at a time, and while the newest character is duplicated in the window, shrink from `left`.

The tempting analysis is "a `for` loop with a `while` inside, so O(n²)". To see why that is wrong, add a counter for the inner loop and run it:

```java title="WindowCost.java"
import java.util.Random;

public class WindowCost {

    static long innerSteps;   // total iterations of the shrinking while loop

    static int longestUnique(String s) {
        int[] count = new int[128];
        int best = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            count[c]++;
            while (count[c] > 1) {            // nested loop, but left only ever moves forward
                count[s.charAt(left)]--;
                left++;
                innerSteps++;
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }

    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        Random rng = new Random(7);
        for (int i = 0; i < 100_000; i++) sb.append((char) ('a' + rng.nextInt(26)));
        String[] inputs = {"abcabcbb", "bbbbb", "pwwkew", sb.toString()};
        for (String s : inputs) {
            innerSteps = 0;
            int best = longestUnique(s);
            String label = s.length() > 10 ? "random, n=" + s.length() : "\"" + s + "\"";
            System.out.printf("%-18s answer=%-3d n=%-7d inner steps=%d%n",
                    label, best, s.length(), innerSteps);
        }
    }
}
```

```output
"abcabcbb"         answer=3   n=8       inner steps=7
"bbbbb"            answer=1   n=5       inner steps=4
"pwwkew"           answer=3   n=6       inner steps=3
random, n=100000   answer=21  n=100000  inner steps=99996
```

The inner loop ran fewer than n times *in total* on every input — 99,996 steps for 100,000 characters, not anything close to 10¹⁰. The argument that proves it holds for every input is the one you say in the interview:

> "The `while` loop is nested, but each of its iterations moves `left` forward by one, and `left` never moves back and can't pass `right`, so it moves at most n times over the whole run. The `for` loop moves `right` n times. So the total work is at most 2n steps: O(n) time. Space is O(1) — the count array has 128 slots regardless of n."

This is the **potential argument** behind amortized analysis: find a quantity (here, the position of `left`) that every inner step increases, and that can only increase a bounded number of times. The same argument shows that two pointers ([[a2-two-pointers]]), monotonic stacks ([[a5-monotonic-stack]]) and monotonic queues ([[a5-monotonic-queue]]) are O(n) despite their nested loops: every element is pushed once and popped at most once. When you see a nested loop, ask: **does the inner loop's progress ever reset?** If not, count total progress instead of multiplying.

The reverse also happens. A single loop that calls an O(n) operation each time — `list.remove(0)`, `str += c`, `list.contains(x)` — is O(n²) even though only one loop is visible.

## Worked walkthrough 3: recursion and memoisation

The prompt: *"Given a string `s` and a dictionary of words, return whether `s` can be split into a sequence of dictionary words."* (Word Break.) The candidate starts with a brute-force recursion ([[a14-brute-force-first]]): from position `i`, try every end `j`; if `s[i..j)` is a word, recurse from `j`. Then they add memoisation, so each start position is solved once.

How do you analyse a recursion? Two ways, and you should know both:

- **Plain recursion: count the call tree.** If each call makes up to b recursive calls and the depth is up to d, there are up to O(bᵈ) calls. That bound is often loose, but it tells you whether the algorithm is exponential.
- **Memoised recursion: count states × work per state.** Each distinct argument value (a **state**) is computed once. Total time is the number of states times the work done inside one state, excluding the recursive calls it looks up.

To make the difference concrete, the program below counts calls on a deliberately bad input: a run of `a`s followed by a `b`, with the dictionary `{a, aa, aaa}`. Every split fails at the `b`, so the plain recursion explores every way of splitting the `a`s.

```java title="WordBreakCalls.java"
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class WordBreakCalls {

    static long calls;

    // Plain recursion: can the suffix starting at i be split into dictionary words?
    static boolean naive(String s, int i, Set<String> dict) {
        calls++;
        if (i == s.length()) return true;
        for (int j = i + 1; j <= s.length(); j++) {
            if (dict.contains(s.substring(i, j)) && naive(s, j, dict)) return true;
        }
        return false;
    }

    // Same recursion, but each start index is solved once.
    static boolean memo(String s, int i, Set<String> dict, Map<Integer, Boolean> seen) {
        calls++;
        if (i == s.length()) return true;
        Boolean known = seen.get(i);
        if (known != null) return known;
        boolean ok = false;
        for (int j = i + 1; j <= s.length() && !ok; j++) {
            ok = dict.contains(s.substring(i, j)) && memo(s, j, dict, seen);
        }
        seen.put(i, ok);
        return ok;
    }

    public static void main(String[] args) {
        Set<String> dict = Set.copyOf(List.of("a", "aa", "aaa"));
        for (int n : new int[] {10, 20, 25}) {
            String s = "a".repeat(n) + "b";          // the trailing b makes every split fail
            calls = 0;
            boolean r1 = naive(s, 0, dict);
            long naiveCalls = calls;
            calls = 0;
            boolean r2 = memo(s, 0, dict, new HashMap<>());
            System.out.printf("n=%-3d naive=%-5b calls=%-9d memo=%-5b calls=%d%n",
                    s.length(), r1, naiveCalls, r2, calls);
        }
    }
}
```

```output
n=11  naive=false calls=600       memo=false calls=28
n=21  naive=false calls=266079    memo=false calls=58
n=26  naive=false calls=5600910   memo=false calls=73
```

The plain recursion's calls grow by a factor of roughly 1.8 for each extra character — exponential — while the memoised version's calls grow linearly. The analysis the candidate gives for the memoised version:

> "There are n + 1 states, one per start index. In each state I try up to n end positions. Each try builds a substring of up to n characters and hashes it for the set lookup, so one try is O(n). That's O(n) states × O(n) tries × O(n) per try = O(n³) time. Space is O(n) for the memo plus O(n) recursion depth — the deepest chain is one character per call."

Two things in that answer are easy to miss. The first is the **cost per transition**: many candidates say "n states, n transitions, so O(n²)" and forget that `substring` and hashing are O(length). The second is the **recursion stack**, which counts as space even though there is no explicit data structure. A follow-up improvement drops out of the analysis: if the longest dictionary word has length W, only try `j` up to `i + W`, which makes the work O(n · W²) — much better when words are short. That is exactly how complexity analysis guides optimisation: it tells you which factor to attack.

The same "states × work per state" rule covers all of dynamic programming. An m × n grid DP with O(1) work per cell is O(mn) ([[a11-grid-dp]]); the Longest Common Subsequence table is O(mn) time and, with a rolling row, O(min(m, n)) space ([[a11-lcs]]).

## Average, worst-case and amortized: which to state

Some operations do not have a single cost, and a precise answer names which bound you mean.

- **Average (expected) case.** `HashMap` operations are O(1) on average, assuming a reasonable hash function. In the worst case — many keys colliding in one bucket — a lookup degrades; since Java 8, a large bucket is converted into a balanced tree, which limits the damage to O(log n) for keys that implement `Comparable`. In an interview, "O(1) average" is the expected answer; mentioning the worst case is a bonus, not a requirement.
- **Worst case that differs from average.** Quickselect ([[a3-quickselect]]) and quicksort with a poor pivot are O(n) and O(n log n) on average but O(n²) in the worst case. State both when they differ: "O(n) average, O(n²) worst case, which randomised pivot selection makes very unlikely."
- **Amortized.** `ArrayList.add` is O(1) amortized: occasionally it copies the whole array to grow it, but the total over n adds is O(n). The sliding-window argument above is also amortized. Say "amortized" when a single operation can be expensive but the sequence is cheap.

When in doubt, give the bound for the case that would matter in production and name it: "O(1) average per lookup, so O(n) expected overall."

## Reference: common patterns

These are worth knowing well enough to recognise, but in the interview you should still give the one-line reason, not only the result.

| Pattern | Time | Extra space | Reason in one line |
|---|---|---|---|
| Hash map single pass | O(n) | O(n) | n iterations, O(1) average lookup each |
| Sort + scan | O(n log n) | O(log n) to O(n) | Sort dominates; sort's own space depends on the algorithm |
| Two pointers / sliding window | O(n) | O(1) or O(alphabet) | Each pointer moves at most n times |
| Binary search on sorted array | O(log n) | O(1) | Range halves each step ([[a3-binary-search]]) |
| Binary search on the answer | O(n log R) | O(1) | log R guesses, each checked in O(n) ([[a3-binary-search-on-answer]]) |
| Tree DFS | O(n) | O(h) | Each node visited once; stack depth is the height h |
| BFS / DFS on a graph | O(V + E) | O(V) | Each vertex enqueued once, each edge examined once or twice ([[a8-bfs]]) |
| Dijkstra with a binary heap | O((V + E) log V) | O(V + E) | Each edge relaxation may push to the heap ([[a8-dijkstra]]) |
| Top k with a heap of size k | O(n log k) | O(k) | n offers to a heap capped at k ([[a7-top-k]]) |
| Merge k sorted lists (N nodes total) | O(N log k) | O(k) | Each node passes through a heap of size k ([[a7-k-way-merge]]) |
| Subsets by backtracking | O(n · 2ⁿ) | O(n) stack | 2ⁿ subsets, O(n) to copy each ([[a9-subsets]]) |
| Permutations | O(n · n!) | O(n) stack | n! orderings, O(n) to copy each ([[a9-permutations]]) |
| 2D DP table m × n | O(mn) | O(mn), or O(n) rolled | One O(1) cell update per state |

## "Can you do better?" — knowing when to stop

Complexity analysis also tells you when an improvement is impossible, and saying so confidently is a strong signal. Three lower bounds cover most interview situations:

- **You must read the input.** Any algorithm that needs to look at every element is Ω(n). If your solution is O(n) and the answer depends on every element, you are at the bound for time; the remaining question is space.
- **Comparison sorting is Ω(n log n).** Any algorithm that sorts using only comparisons needs at least on the order of n log n comparisons in the worst case. Beating it requires extra structure, such as a small value range for counting sort ([[a3-counting-sort]]).
- **You must produce the output.** Listing all subsets is Ω(2ⁿ) because there are 2ⁿ of them, so an O(n · 2ⁿ) backtracking solution is essentially optimal.

> "This is O(n) time and O(1) space. Every element can affect the answer, so I need to read all of them — I don't think time can go below O(n). The only possible improvement would be constant factors."

## Common mistakes

> [!MISTAKE] "Two loops, so O(n²)" — or "one loop, so O(n)"
> Loop shape is not cost. A nested loop whose inner pointer never resets is O(n) overall; a single loop that calls `list.remove(0)` or does `str += c` each iteration is O(n²). Count how many times each line executes over the whole run, and what each execution costs.

**Forgetting the sort.** "I sort the intervals and then merge in one pass, so O(n)." The sort is O(n log n) and dominates. Mention it by name in the final answer.

**Treating string operations as O(1).** Hashing, comparing, copying and taking substrings of a string are all linear in its length. A `HashMap<String, …>` keyed by words of length L costs O(L) per lookup, which is why Group Anagrams is O(n · L log L) and not O(n log n).

**Misreading hash lookups inside loops.** Replacing an *inner loop* with a hash lookup removes a factor of n — that is the Two Sum optimisation. But a hash lookup *inside* two nested loops does not make them O(n); the nested loops still run n² times. The lookup only helps when it replaces a loop.

**Forgetting recursion stack space.** A recursive DFS that uses no explicit data structure is still O(h) space, and O(n) on a skewed tree. "O(1) space" is wrong for any recursion whose depth grows with the input.

**Using one letter for two sizes.** Writing O(n²) for an algorithm over an n × m grid, or O(n) for BFS without saying whether n means vertices or edges, makes the answer ambiguous and often wrong.

**Over-analysing.** Debating constant factors, cache lines or JIT behaviour for five minutes when nobody asked uses time you need for testing. Give the asymptotic answer with its reason; go deeper only if the interviewer follows up.

## Interview perspective

Interviewers listen for whether the analysis is *derived from the code* or recited. The fastest way to show derivation is to point at the dominant line and give its count.

> [!INTERVIEW] What a strong answer sounds like
> "Time is O(n · L log L), where n is the number of words and L the maximum length: for each word I sort its letters, which is L log L, and the map lookup hashes a string of length L, which is smaller. Space is O(n · L) for the groups. If I replace the sorted key with a 26-count key, each word drops to O(L), so the total becomes O(n · L)."

Questions you should be ready for:

- **"Why is this sliding window O(n) when there's a nested loop?"** Each inner iteration advances `left`, which never moves back, so the inner loop runs at most n times in total.
- **"What's the space of your recursive solution?"** The maximum recursion depth times the frame size — O(h) for a tree, O(n) for a chain — plus any memo.
- **"Is HashMap really O(1)?"** On average, with a good hash function. Worst case is worse; Java 8+ treeifies large buckets, bounding it at O(log n) for `Comparable` keys. And for string keys, add the O(L) to hash the key.
- **"What's the complexity of merge k sorted lists with a heap?"** O(N log k) for N total nodes, O(k) extra space for the heap.
- **"Can you do better?"** Name what dominates and whether a lower bound applies. If you are at Ω(n) and must read every element, say so.

```quiz
Q: A sliding-window solution has a for loop over right from 0 to n - 1 and, inside it, a while loop that increments left. left starts at 0 and is never decreased. What is the time complexity?
- [ ] O(n²), because the loops are nested
- [x] O(n), because left can be incremented at most n times over the entire run
- [ ] O(n log n), because the window shrinks geometrically
- [ ] O(1) amortized per character, so O(1) overall
> Count total executions, not loop shape. Every inner iteration increments left, and left can only go from 0 to n, so the inner body runs at most n times across all outer iterations. Together with n outer iterations the total is at most 2n. Amortized O(1) per character means O(n) in total, not O(1).

Q: A memoised recursion has n states. Each state loops over up to n next positions and, for each one, calls s.substring(i, j) and checks it in a HashSet<String>. What is the time complexity?
- [ ] O(n), one unit of work per state
- [ ] O(n²), n states times n transitions
- [x] O(n³), because each substring and hash costs up to O(n)
- [ ] O(2ⁿ), because it is recursive
> Memoised time is states times work per state. There are n states and n transitions each, but every transition copies a substring and hashes it, which is linear in its length. Forgetting that hidden cost gives the tempting O(n²). Memoisation is precisely what removes the exponential blow-up of the plain recursion.

Q: Which statement about the space complexity of a recursive DFS on a binary tree with n nodes is correct?
- [ ] It is O(1) because no data structure is allocated
- [ ] It is always O(log n)
- [x] It is O(h), where h is the height: O(log n) if balanced, O(n) if skewed
- [ ] It is O(n²) because every node is visited
> Each active call occupies a stack frame, and the deepest chain of active calls equals the tree's height. A balanced tree has height about log n; a tree where every node has one child has height n. No explicit data structure does not mean no space.
```

## Practice

For each solution, apply the five steps out loud — variables, phases, nesting, hidden costs, space — and write the two-sentence answer you would give.

1. **Merge Intervals**: sort by start, then merge in one pass. What dominates, and what is the space of the sort? ([[a2-intervals]])
2. **Top K Frequent Elements**: frequency map, then a size-k min-heap. Express the answer in n and k, then compare with bucket sort by frequency. ([[a7-top-k]])
3. **Daily Temperatures** with a monotonic stack: prove the O(n) bound with a push/pop argument. ([[a5-next-greater-smaller]])
4. **Number of Islands** on an m × n grid with recursive DFS: what is the worst-case recursion depth, and what grid causes it? ([[a8-connected-components]])
5. Find the hidden cost: a loop over n words that does `result += word + " "`. What is the complexity in terms of the total output length, and how do you fix it?
6. **Coin Change** with memoisation, c coin types and amount A: count states and transitions. ([[a11-memoization]])

## Quick revision {#quick-revision}

- Five steps: **name variables** (n, L, V, E, k, m×n) → **cost phases and add** → **multiply nesting by counting total executions** → **add hidden library costs** → **count space** (aux, stack, output).
- Sequential phases add; the dominant one wins — name it ("dominated by the sort").
- Nested loops multiply only if the inner progress resets. Shared forward-only pointers and push-once/pop-once stacks are O(n) amortized.
- Hidden O(length) costs: `substring`, `toCharArray`, `equals`, string hashing, `str +=`. Hidden O(n): `ArrayList.contains`, `remove(0)`, copying collections. Sorting is O(n log n).
- Recursion: plain → count the call tree (branching^depth); memoised → states × work per state, including per-transition costs.
- Space: auxiliary structures + recursion depth; say whether output is included.
- Name the case: average (hash map), worst (quickselect O(n²)), amortized (`ArrayList.add`, sliding window).
- Lower bounds: must read input Ω(n); comparison sort Ω(n log n); output size (2ⁿ subsets).
- Say it in two or three sentences: result, reason, dominant term — then stop.

## Key takeaways {#key-takeaways}

- Complexity in an interview is derived from your own code: how many times each line runs over the whole execution, times what one run costs.
- Name every input dimension; collapsing n words of length L, or V and E, into a single n hides both costs and optimisations.
- Loop shape misleads in both directions — a nested loop can be O(n), and a single loop can be O(n²) because of a hidden library cost.
- Recursive solutions are analysed by their call tree, or by states times work per state once memoised, and their stack depth is space.
- State average, worst-case or amortized explicitly when they differ.
- Re-derive the complexity after coding, and use it to point at what an optimisation must remove — or to argue you are already at a lower bound.
