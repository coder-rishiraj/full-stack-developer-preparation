---
summary: Interviewers care less about whether you know the optimal solution than whether you can get there from a slow one. You will learn a repeatable way to do it — use the constraints to set a target, find the work the brute force repeats, pick the technique that removes exactly that work, and check the idea against a counterexample before coding.
difficulty: intermediate
minutes: 50
objectives:
  - Use the input bounds to set a target time complexity before designing the optimisation
  - Identify the bottleneck in a brute force as a repeated scan, a repeated subproblem or work that ordering would avoid
  - Choose the technique (hashing, sorting, two pointers, prefix sums, memoisation, heaps) that removes that specific bottleneck, and justify the choice
  - Derive an optimised solution step by step — prefix sums with a hash map, recursion to dynamic programming — and state its complexity before and after
  - Test a greedy idea with a counterexample hunt before committing to it
---

## Introduction

The previous lesson ended with a brute force on the table and one sentence naming its waste: *"for every end, I'm scanning all starts to see which give sum k."* This lesson is about what happens next — turning that sentence into a faster algorithm, out loud, in a way the interviewer can follow.

**Deriving an optimised solution** means improving a correct but slow algorithm by finding the work it does unnecessarily and replacing that work with something cheaper: a lookup instead of a scan, an ordering that lets you skip candidates, a remembered answer instead of a recomputed one. The emphasis is on *deriving*. Saying "this is a hash map problem" is recall. Saying "the inner loop is searching for a value it has seen before, so a hash map can answer that search in O(1)" is derivation, and it is what interviewers are trying to observe, because it is the skill that still works on a problem you have never seen.

The method has four steps, and the rest of the lesson takes them one at a time:

1. **Set a target** from the constraints: how fast does the solution need to be?
2. **Find the bottleneck** in the brute force: which work is repeated or wasted?
3. **Choose the technique** that removes exactly that work.
4. **Check the idea** on the example and against a counterexample before writing code.

## Before you start

- **A brute force to start from**, with its complexity — [[a14-brute-force-first]].
- **The constraints** you gathered while clarifying — [[a14-clarifying-requirements]].
- **The core techniques**, at least by name: [[a2-hashing]], [[a2-prefix-suffix]], [[a2-two-pointers]], [[a2-sliding-window]], [[a3-binary-search]], [[a7-priority-queues]] and [[a11-memoization]]. This lesson teaches *when to reach for them*; their own lessons teach how they work.

## The intuition

Performance engineers do not optimise by guessing. They run a **profiler**, which shows where the program spends its time, and they work on the hottest part. Speeding up code that runs once does nothing; speeding up the loop that runs a billion times changes everything.

An algorithm on a whiteboard has no profiler, but you can do the same analysis by reading it. In a brute force, the "hot" part is almost always the innermost loop or the recursive call. Ask what that inner part is *for*. If it is searching for something, a data structure can index it. If it is recomputing something already computed, you can store it. If it is examining candidates that cannot win, an ordering may let you skip them. The optimisation is then aimed at a specific line of code rather than at the problem in general.

## Step 1: let the constraints set the target

Before looking for a better idea, decide how good it must be. A useful rule of thumb is that a judge or an interviewer's mental model allows roughly 10⁷ to 10⁸ simple operations for a typical time limit. Dividing by the input size gives a target:

| Largest `n` | Comfortable complexity | Typical techniques |
|---|---|---|
| ≤ 10–11 | O(n!) | Permutations, brute-force orderings ([[a9-permutations]]) |
| ≤ 20–25 | O(2ⁿ), O(2ⁿ × n) | Subsets, bitmask enumeration ([[a9-subsets]], [[a11-bitmask-dp]]) |
| ≤ 500 | O(n³) | Triple loops, interval DP, Floyd–Warshall |
| ≤ 5,000 | O(n²) | Pairs, 2D DP ([[a11-2d-dp]]) |
| ≤ 10⁵ – 10⁶ | O(n log n) or O(n) | Sorting, heaps, binary search, hashing, two pointers, prefix sums |
| ≥ 10⁹ | O(log n) or O(1) | Binary search on the answer, mathematics |

These are rough guides, not laws: constants, language and the time limit all matter. But they turn a vague goal ("make it faster") into a concrete one ("I need O(n log n) or better"), and the target often names the technique. If `n` is 10⁵ and your brute force is O(n²), you are looking for a way to make the inner loop O(log n) or O(1) — which points at sorting with binary search, a heap, or a hash map. If `n` is 20, you may not need to optimise at all.

The table also works in reverse as a hint: an interviewer who says "n is at most 20" is often telling you that an exponential solution is expected.

## Step 2: find the bottleneck

Look at the brute force and ask what its innermost work does. Almost every bottleneck in interview problems is one of a few kinds:

| The inner work is… | Example | Fix |
|---|---|---|
| **Searching** for a value seen earlier | Two Sum: scanning for the complement | Hash map or set: O(n) scan becomes O(1) lookup ([[a2-hashing]]) |
| **Re-summing** a range | Range-sum queries, subarray sums | Prefix sums: any range sum in O(1) ([[a2-prefix-suffix]]) |
| **Examining candidates that cannot win** because of their order | Pair with target sum in sorted data | Sort, then two pointers or binary search ([[a2-two-pointers]], [[a3-binary-search]]) |
| **Re-solving the same subproblem** | Recursion with repeated arguments | Memoisation or a bottom-up table ([[a11-memoization]], [[a11-tabulation]]) |
| **Finding the best current candidate** repeatedly | "Next smallest", "earliest finishing" | Heap ([[a7-priority-queues]]) |
| **Rescanning a window** that moved by one | Fixed-size window sums or maxima | Sliding window, monotonic deque ([[a2-sliding-window]], [[a5-monotonic-queue]]) |
| **Looking for the next larger/smaller element** | Daily temperatures, stock span | Monotonic stack ([[a5-monotonic-stack]]) |

The table is a lookup aid, but notice what drives it: the left column describes *what the code is doing*, not what the problem is called. That is the habit to build. When you are stuck, point at the innermost loop and finish the sentence "this loop is looking for…".

## Step 3: worked derivation — from O(n²) to O(n) with prefix sums

Return to **Subarray Sum Equals K**: count the contiguous subarrays of `nums` whose sum is `k`, where values may be negative. The O(n²) brute force from [[a14-brute-force-first]] fixes a start, extends the end, and keeps a running sum.

**Set the target.** `n` is up to 2 × 10⁴, so O(n²) is about 2 × 10⁸ operations — too slow to be comfortable. The target is O(n) or O(n log n).

**Find the bottleneck.** Flip the loops in your head: for each `end`, the brute force effectively checks every `start ≤ end` to see whether `sum(start..end) == k`. That check over all starts is a *search*. What is it searching for?

**Rewrite the search as an equation.** Define the **prefix sum** `P[i]` as the sum of the first `i` elements, so `P[0] = 0` and `P[i + 1] = P[i] + nums[i]`. Then the sum of `nums[start..end]` is `P[end + 1] − P[start]`. The condition becomes:

```text
P[end + 1] - P[start] == k      which is the same as      P[start] == P[end + 1] - k
```

For a fixed `end`, the question "how many starts give sum k?" is now "how many earlier prefix sums equal `P[end + 1] − k`?" That is a counting lookup over values seen before — the first row of the bottleneck table. A hash map from prefix-sum value to how many times it has occurred answers it in O(1).

**Settle the details.** Two details decide correctness:

- **Seed the map with `0 → 1`.** The empty prefix `P[0] = 0` exists before any element. Without it, a subarray starting at index 0 (whose sum is `P[end + 1] − P[0]`) would never be counted.
- **Look up before inserting.** The current prefix must not match itself, because that would correspond to an empty subarray.

**State before and after.** "The brute force is O(n²) time and O(1) space. This is O(n) time — one pass with O(1) average map operations — and O(n) space for the map. I'm trading memory for time."

Here is the result as a complete program.

```java title="SubarraySumCount.java"
import java.util.HashMap;
import java.util.Map;

public class SubarraySumCount {

    /** Counts contiguous subarrays of nums whose sum is k. O(n) time, O(n) space. */
    static int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> prefixCount = new HashMap<>();
        prefixCount.put(0, 1);                 // the empty prefix, so subarrays starting at 0 count
        int prefix = 0, count = 0;
        for (int x : nums) {
            prefix += x;                                       // sum of nums[0..current]
            count += prefixCount.getOrDefault(prefix - k, 0);  // starts that give sum k
            prefixCount.merge(prefix, 1, Integer::sum);        // record after looking up
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(subarraySum(new int[]{3, 4, 7, 2, -3, 1, 4, 2}, 7));
        System.out.println(subarraySum(new int[]{1, 1, 1}, 2));
        System.out.println(subarraySum(new int[]{0, 0}, 0));
        System.out.println(subarraySum(new int[]{}, 0));
    }
}
```

```output
4
2
3
0
```

The third case is a good check of the reasoning: `[0, 0]` with `k = 0` has three qualifying subarrays — each zero alone and both together — and the counting map finds all three because the prefix value `0` occurs three times (the seed, after the first element, after the second). The last case shows that the seed does not create a phantom answer for empty input: the loop never runs, so nothing is looked up.

### Dry run

Trace `nums = [3, 4, 7, 2, -3, 1, 4, 2]`, `k = 7`. The map starts as `{0: 1}`.

| Index | `x` | `prefix` | Looking for `prefix − 7` | Found | `count` | Map after insert (new or changed entry) |
|---|---|---|---|---|---|---|
| 0 | 3 | 3 | −4 | 0 | 0 | `3: 1` |
| 1 | 4 | 7 | 0 | 1 | 1 | `7: 1` |
| 2 | 7 | 14 | 7 | 1 | 2 | `14: 1` |
| 3 | 2 | 16 | 9 | 0 | 2 | `16: 1` |
| 4 | −3 | 13 | 6 | 0 | 2 | `13: 1` |
| 5 | 1 | 14 | 7 | 1 | 3 | `14: 2` |
| 6 | 4 | 18 | 11 | 0 | 3 | `18: 1` |
| 7 | 2 | 20 | 13 | 1 | 4 | `20: 1` |

Each hit corresponds to a subarray. At index 1, finding `0` (the seed) means the subarray from the start, `[3, 4]`. At index 2, finding `7` (stored at index 1) means the subarray after index 1, `[7]`. At index 5, finding `7` again means `[7, 2, -3, 1]`. At index 7, finding `13` (stored at index 4) means `[1, 4, 2]`. Four hits, matching the brute force.

## Step 3, again: from exponential recursion to dynamic programming

The second common derivation starts from a recursive brute force. Take **House Robber**: houses in a row hold amounts of money; you cannot rob two adjacent houses; maximise the total.

**Brute force.** At house `i`, either skip it (best from `i + 1`) or rob it (its money plus best from `i + 2`). That is two recursive calls per house, so the call tree roughly doubles at each level: exponential time.

**Bottleneck.** Draw the first few levels. `best(0)` calls `best(1)` and `best(2)`; `best(1)` calls `best(2)` and `best(3)`. `best(2)` is already being computed twice, and the duplication compounds further down. The function's answer depends only on `i`, so there are only `n + 1` distinct subproblems, but the brute force solves them exponentially many times. That is the **overlapping subproblems** signal.

**Fix.** Store each `best(i)` the first time it is computed (memoisation). Then notice each `best(i)` depends only on `best(i + 1)` and `best(i + 2)`, so you can compute them from right to left in a loop and keep only two variables.

```java title="HouseRobber.java"
import java.util.Arrays;

public class HouseRobber {
    static long calls = 0;

    // Brute force: at each house, either skip it or rob it and skip the next one.
    static int robFrom(int[] money, int i) {
        calls++;
        if (i >= money.length) return 0;
        return Math.max(robFrom(money, i + 1), money[i] + robFrom(money, i + 2));
    }

    // Same recursion, but each index is solved once and cached.
    static int robMemo(int[] money, int i, int[] memo) {
        calls++;
        if (i >= money.length) return 0;
        if (memo[i] != -1) return memo[i];
        memo[i] = Math.max(robMemo(money, i + 1, memo), money[i] + robMemo(money, i + 2, memo));
        return memo[i];
    }

    // Bottom-up: best(i) depends only on best(i+1) and best(i+2), so keep two variables.
    static int robIterative(int[] money) {
        int next = 0, nextNext = 0;                 // best(i+1), best(i+2)
        for (int i = money.length - 1; i >= 0; i--) {
            int current = Math.max(next, money[i] + nextNext);
            nextNext = next;
            next = current;
        }
        return next;
    }

    public static void main(String[] args) {
        int[] money = new int[30];
        for (int i = 0; i < money.length; i++) money[i] = (i * 7) % 10 + 1;

        calls = 0;
        System.out.println("brute:     " + robFrom(money, 0) + " in " + calls + " calls");

        int[] memo = new int[money.length];
        Arrays.fill(memo, -1);
        calls = 0;
        System.out.println("memo:      " + robMemo(money, 0, memo) + " in " + calls + " calls");

        System.out.println("iterative: " + robIterative(money));
        System.out.println("small:     " + robIterative(new int[]{2, 7, 9, 3, 1}));
    }
}
```

```output
brute:     93 in 4356617 calls
memo:      93 in 61 calls
iterative: 93
small:     12
```

The call counts make the bottleneck concrete. For 30 houses the brute force makes over four million calls; the memoised version makes 61 — each of the 30 indices does its real work once, and the other 31 calls are instant cache hits or base cases. The iterative version makes no calls at all and uses O(1) extra space. For `[2, 7, 9, 3, 1]`, the best is 2 + 9 + 1 = 12.

**Before and after:** exponential time and O(n) stack → O(n) time and O(n) memo plus stack → O(n) time and O(1) space. Saying all three steps shows the interviewer a chain of reasoning, not a recalled formula. The general procedure — write the recurrence, notice repeated arguments, cache, then convert to a table and shrink it — is taught in [[a11-memoization]] and [[a11-1d-dp]].

## Step 4: check the idea before coding — the counterexample hunt

An optimisation that is fast but wrong is worse than the brute force. Before coding, run the idea on the given example, then spend a minute actively trying to **break** it. This matters most for **greedy** ideas — "always take the largest", "always take the earliest" — because they are easy to propose, easy to code, and often wrong.

Take *fewest coins to make an amount*. The greedy idea: repeatedly take the largest coin that fits. It works for US coins `{1, 5, 10, 25}`. Hunt for a counterexample with small denominations that are not multiples of each other:

```java title="CoinGreedy.java"
import java.util.Arrays;

public class CoinGreedy {

    // Greedy: always take the largest coin that still fits.
    static int greedy(int[] coins, int amount) {
        int[] desc = coins.clone();
        Arrays.sort(desc);
        int used = 0;
        for (int i = desc.length - 1; i >= 0; i--) {
            used += amount / desc[i];
            amount %= desc[i];
        }
        return amount == 0 ? used : -1;
    }

    // DP: fewest[a] = 1 + min over coins c of fewest[a - c].
    static int dp(int[] coins, int amount) {
        int[] fewest = new int[amount + 1];
        Arrays.fill(fewest, Integer.MAX_VALUE);
        fewest[0] = 0;
        for (int a = 1; a <= amount; a++) {
            for (int c : coins) {
                if (c <= a && fewest[a - c] != Integer.MAX_VALUE) {
                    fewest[a] = Math.min(fewest[a], fewest[a - c] + 1);
                }
            }
        }
        return fewest[amount] == Integer.MAX_VALUE ? -1 : fewest[amount];
    }

    public static void main(String[] args) {
        int[] usCoins = {1, 5, 10, 25};
        int[] oddCoins = {1, 3, 4};
        System.out.println("{1,5,10,25}, 63: greedy " + greedy(usCoins, 63) + ", dp " + dp(usCoins, 63));
        System.out.println("{1,3,4}, 6:      greedy " + greedy(oddCoins, 6) + ", dp " + dp(oddCoins, 6));
    }
}
```

```output
{1,5,10,25}, 63: greedy 6, dp 6
{1,3,4}, 6:      greedy 3, dp 2
```

With `{1, 3, 4}` and amount 6, greedy takes 4 then 1 then 1 (three coins), but 3 + 3 uses two. One small counterexample is enough to reject greedy and move to dynamic programming. Finding it took three denominations and an amount under ten — that is the scale at which counterexamples usually live.

When a greedy idea survives the hunt, say *why* it is safe. For choosing the most non-overlapping intervals, "sort by end time and take each interval that fits" is correct because finishing earliest never leaves less room for the rest — an **exchange argument** that [[a10-interval-scheduling]] proves and [[a10-local-vs-global]] generalises. Without that argument, a greedy is a guess.

> [!WARNING] A passing example is not a proof
> The given example usually passes for both the right idea and several wrong ones. Before coding, try at least one input designed to break your idea: duplicates, negatives, ties, values that are not multiples of each other.

## When you are stuck

Sometimes the bottleneck is clear but the fix is not. These moves reliably produce progress, and narrating them is itself good interview communication ([[a14-thinking-aloud]]):

- **Solve a small example by hand and watch what you do.** People often use the efficient method instinctively — scanning once, remembering what they have seen — before they can name it.
- **Ask "what if the input were sorted?"** If sorting unlocks a fast method and costs only O(n log n) within your target, sort. (Check first that the output does not need the original order.)
- **Simplify the problem.** Solve it for positive numbers only, for k = 1, or for one dimension, then see what breaks when you restore the full problem.
- **Work backwards from the target.** If you need O(n log n), what could happen `n` times at O(log n) each? A heap operation, a binary search, a tree-map lookup.
- **Precompute.** If the same kind of query is asked many times, a table built once (prefix sums, sorted copies, counts) may answer each query in O(1).
- **Trade space for time.** Most of the fixes above spend memory — a map, a table, a heap — to save time. Say so, and ask whether memory is constrained.

## Common mistakes

> [!MISTAKE] Naming a pattern without connecting it to the bottleneck
> "This is a sliding window problem" is a claim, not a derivation, and on Subarray Sum Equals K with negatives it is a wrong claim. Always connect the technique to the specific work it removes; if you cannot, you may have the wrong technique.

**Optimising the wrong part.** Making the outer loop faster does nothing when the inner loop dominates. Aim at the innermost repeated work.

**Breaking correctness while optimising.** Sorting to enable two pointers when indices must be returned, or forgetting the `0 → 1` seed in the prefix-sum map, produces fast wrong answers. Re-check the clarified requirements after each change.

**Trusting greedy without a counterexample hunt.** The coin example is typical: greedy works on the common case and fails on a small, slightly unusual one.

**Not stating complexity before and after.** "Faster" is not an answer. "O(n²) time, O(1) space → O(n) time, O(n) space" is.

**Faking a derivation.** If you recognise the problem and remember the solution, say so honestly and then explain *why* it works, with a trace. Pretending to discover a known trick tends to show, and the explanation is what earns credit anyway.

## Interview perspective

The interviewer is grading the path: a stated target, an explicit bottleneck, a justified technique, complexity before and after, and a check on an example. Even if you recognise the optimal solution instantly, presenting it as a short derivation makes your understanding visible.

> [!INTERVIEW] What a strong derivation sounds like
> "n is up to 2 × 10⁴, so I want roughly linear. In the O(n²) version, for each end I scan all starts looking for prefix sums equal to the current prefix minus k. That's a lookup of earlier values, so I'll keep a map from prefix sum to count, seeded with 0 for the empty prefix. One pass, O(n) time, O(n) space. Let me trace the example to check."

Common follow-ups:

- **"Can you do it in less space?"** Sometimes yes (House Robber's two variables), sometimes no (the prefix-sum map is needed with negatives). Explain which, and why.
- **"Prove your greedy is correct."** Give an exchange argument, or admit you are not sure and test small cases.
- **"How did you know to use a heap?"** Tie it to the bottleneck: "I repeatedly needed the earliest-ending meeting among the active ones."
- **"What if the input doesn't fit in memory?"** Revisit the target: streaming, external sorting, or approximate structures.

## Practice

For each problem: state the brute force and its cost, set a target from the constraint, name the bottleneck in one sentence, and derive the optimisation with before/after complexity.

1. **Two Sum** (`n ≤ 10⁵`). Bottleneck: the complement scan.
2. **Longest Consecutive Sequence** in O(n) (`n ≤ 10⁵`). Hint: what does sorting give you, and can a set give it without sorting? ([[a2-hashing]])
3. **Container With Most Water.** Why can the shorter wall's pointer always move inward? ([[a2-two-pointers]])
4. **Kth Largest Element** (`n ≤ 10⁵`). Compare sorting, a size-k heap and quickselect ([[a7-top-k]], [[a3-quickselect]]).
5. **Climbing Stairs** with steps of 1, 2 or 3. Write the recursion, count its calls for n = 25, then memoise and reduce to O(1) space.
6. **Counterexample hunt.** For "choose meetings with the shortest duration first to maximise how many you attend", find an input where it fails.

## Quick revision {#quick-revision}

- Four steps: set a target from constraints → find the bottleneck → apply the technique that removes it → check on example and counterexample.
- About 10⁷–10⁸ simple operations is a comfortable budget: `n ≤ 20` → 2ⁿ; `≤ 5,000` → n²; `10⁵–10⁶` → n log n or n.
- Find the bottleneck by asking what the innermost loop or recursive call is doing.
- Searching earlier values → hash map/set. Re-summing ranges → prefix sums. Order would skip candidates → sort + two pointers/binary search. Repeated subproblems → memo/DP. Repeated "best so far" → heap. Moving window → sliding window/monotonic deque.
- Subarray Sum Equals K: `P[start] = P[end+1] − k`; count map seeded `0 → 1`; look up before insert; O(n) time, O(n) space.
- House Robber: exponential recursion → memo O(n) → two variables O(1) space.
- Greedy needs a proof (exchange argument) or it is a guess; coins `{1,3,4}`, amount 6 breaks largest-first.
- Always state complexity before and after, and say what you traded (usually space for time).

## Key takeaways {#key-takeaways}

- An optimisation is the removal of specific wasted work in the brute force, so start by finding that work.
- Constraints tell you how fast the solution must be, which narrows the techniques worth considering.
- Describe the bottleneck by what the code does ("searching for an earlier value"), and the technique usually follows.
- Recursion with repeated arguments is the doorway to dynamic programming: cache, then tabulate, then shrink.
- Test every idea — especially greedy ones — against a deliberately awkward small input before coding it.
- State the before and after complexity, including the space you spent to buy the time.

```quiz
Q: A brute force for "count pairs (i, j) with i < j and nums[i] + nums[j] == target" uses two nested loops. The constraint is n ≤ 10⁵. Which description of the bottleneck leads most directly to the optimisation?
- [ ] "The outer loop runs n times"
- [x] "For each j, the inner loop searches earlier elements for the value target − nums[j]"
- [ ] "The array might be unsorted"
- [ ] "Java's loops are slow"
> Describing what the inner loop is searching for turns it into a lookup problem: keep a map from value to how many times it has appeared so far, and add map[target − nums[j]] for each j. That makes the solution O(n). The outer loop is not the waste; it must visit each element once anyway.

Q: In the prefix-sum solution to Subarray Sum Equals K, what goes wrong if the map is not seeded with 0 → 1?
- [ ] Nothing; the seed is an optimisation only
- [ ] Subarrays ending at the last index are missed
- [x] Subarrays that start at index 0 are never counted, because their sum is P[end+1] − P[0] and P[0] = 0 was never recorded
- [ ] The map overflows
> The sum of nums[start..end] is P[end+1] − P[start]. When start is 0, the matching earlier prefix is P[0] = 0, the empty prefix. If it is not in the map, every subarray beginning at index 0 — such as [3, 4] in the example — is silently skipped.

Q: You propose "always take the largest coin that fits" for fewest coins. What should you do before coding it?
- [ ] Nothing; greedy algorithms are always optimal for coins
- [ ] Code it and see whether the given example passes
- [x] Try small, awkward inputs such as coins {1, 3, 4} and amount 6, where greedy uses three coins but two suffice
- [ ] Switch to brute force immediately
> Greedy is correct only when an exchange argument shows the local choice never hurts. For arbitrary denominations no such argument holds, and a three-coin counterexample proves it. The given example often passes for wrong ideas too, so a deliberate counterexample hunt is the cheap check.
```
