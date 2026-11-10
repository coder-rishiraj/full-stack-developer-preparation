---
summary: Combination Sum asks for every group of numbers that adds up to a target. You will learn how one index decides between reuse and single use, why sorting turns an overshoot into an early stop, how to skip duplicate values safely, and how to recognise when the question really wants a count — which is a dynamic programming problem, not a backtracking one.
difficulty: intermediate
minutes: 50
objectives:
  - Implement Combination Sum with reuse and explain why recursing with the same index allows it
  - Adapt the template to single use with repeated input values (Combination Sum II) and fixed size (Combination Sum III)
  - Use sorting to prune with an early break, and explain why break is correct where continue would only be slower
  - Describe the size of the search tree and the factors that drive its cost
  - Distinguish listing combinations from counting them, and choose DP with the correct loop order for counting
---

## Introduction

A vending machine accepts coins of 2, 3, 6 and 7 cents, and something costs 7 cents. Which handfuls of coins pay exactly 7? Two: three coins (2 + 2 + 3) or one coin (7). Paying 3 + 2 + 2 uses the same handful as 2 + 2 + 3, so it is not a new answer.

That is the **Combination Sum** problem: given a list of distinct positive **candidates** and a **target**, list every combination of candidates whose sum equals the target, where each candidate may be used any number of times and two answers with the same numbers in a different order count as one.

It combines the two ideas you have learned so far in this module. The answer is unordered, so it is a [[a9-combinations]] problem and uses the start-index rule to avoid reorderings. But the size is not fixed and elements can repeat, so the stopping condition is a sum instead of a count, and the recursion must allow the same element again. Getting those two changes right — and the variants where reuse is forbidden or values repeat in the input — is the whole lesson.

The same shape appears whenever a total must be made from parts: making change, splitting a budget into allowed amounts, choosing items that fill a container exactly. It also marks an important boundary in problem solving. When a problem asks you to *list* the ways, you backtrack; when it asks *how many* ways, listing is usually far too slow and [[a11-knapsack]]-style dynamic programming is the tool.

## Before you start

- **Combinations and the start index** — [[a9-combinations]]. You should be comfortable with why recursing from `j + 1` prevents duplicates.
- **Subsets with duplicate values** — the "skip equal values at the same level" rule from [[a9-subsets]].
- **Recursion** — [[a1-recursion]].
- **Sorting an array** — `Arrays.sort`, and why sorted order lets you stop scanning early. See [[a2-sorting-based]].

## The intuition: pay with coins in non-decreasing order

To avoid listing 2 + 2 + 3 and 3 + 2 + 2 separately, adopt a habit: **always hand over coins in non-decreasing order of value**. Every handful has exactly one such order, so each combination is produced once. This is the start-index rule again, with one change. In ordinary combinations the next element must be *strictly* larger than the last, because each element is used at most once. Here the same coin may be handed over again, so the next coin must be *at least as large* as the last — the same index is still allowed.

The recursion state is the list of coins handed over so far (`path`), the amount still owed (`remain`), and the smallest candidate index still allowed (`start`). From each state there are three possibilities:

- `remain == 0`: the path pays exactly. Record it.
- A candidate is larger than `remain`: using it would overpay, so that branch is dead.
- Otherwise, hand over the candidate and recurse with the smaller `remain`, still allowed to use that same candidate next.

## The naive approach and why it repeats itself

The most direct recursion tries every candidate at every step, without a start index:

```java title="NaiveOrdered.java"
import java.util.ArrayList;
import java.util.List;

public class NaiveOrdered {

    // Tries every candidate at every step, so the same multiset appears in many orders.
    static void build(int[] cand, int remain, List<Integer> path, List<List<Integer>> out) {
        if (remain == 0) {
            out.add(new ArrayList<>(path));
            return;
        }
        if (remain < 0) return;
        for (int c : cand) {
            path.add(c);
            build(cand, remain - c, path, out);
            path.remove(path.size() - 1);
        }
    }

    public static void main(String[] args) {
        List<List<Integer>> out = new ArrayList<>();
        build(new int[]{2, 3, 6, 7}, 7, new ArrayList<>(), out);
        System.out.println(out);
    }
}
```

```output
[[2, 2, 3], [2, 3, 2], [3, 2, 2], [7]]
```

It finds the right multisets but lists `{2, 2, 3}` three times — once per distinct ordering. In general a combination with `m` coins can appear up to m! times, so this explores **ordered sequences** (compositions), whose number grows far faster than the number of combinations. Deduplicating the output afterwards with a set does not remove the wasted exploration. The fix is to make it structurally impossible to build anything but the non-decreasing order.

## Combination Sum: reuse allowed

```java title="CombinationSum.java"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CombinationSum {

    // cand is sorted ascending and has distinct values; each may be reused.
    static void build(int[] cand, int start, int remain, List<Integer> path,
                      List<List<Integer>> out) {
        if (remain == 0) {                       // path sums exactly to the target
            out.add(new ArrayList<>(path));
            return;
        }
        for (int i = start; i < cand.length; i++) {
            if (cand[i] > remain) break;         // sorted: every later candidate is bigger
            path.add(cand[i]);
            build(cand, i, remain - cand[i], path, out);  // i, not i + 1: reuse allowed
            path.remove(path.size() - 1);
        }
    }

    static List<List<Integer>> combinationSum(int[] candidates, int target) {
        int[] cand = candidates.clone();
        Arrays.sort(cand);
        List<List<Integer>> out = new ArrayList<>();
        build(cand, 0, target, new ArrayList<>(), out);
        return out;
    }

    public static void main(String[] args) {
        System.out.println(combinationSum(new int[]{2, 3, 6, 7}, 7));
        System.out.println(combinationSum(new int[]{5, 3, 2}, 8));
        System.out.println(combinationSum(new int[]{2}, 1));
    }
}
```

```output
[[2, 2, 3], [7]]
[[2, 2, 2, 2], [2, 3, 3], [3, 5]]
[]
```

Three decisions in this code are worth understanding rather than memorising.

**The recursive call passes `i`, not `i + 1`.** The next call's loop starts at `i`, so it may pick `cand[i]` again — that is reuse — but it cannot go back to a smaller index, so the path stays non-decreasing. Passing `i + 1` would forbid reuse and lose `[2, 2, 3]`. Passing `0` would bring back every ordering.

**Sorting enables `break`.** Once `cand[i] > remain`, every later candidate is at least as large (the array is sorted), so none of them can fit either. `break` ends the whole loop. With unsorted candidates you would have to `continue` past each oversized one, or let the recursion discover the overshoot one level deeper with a `remain < 0` check.

**`remain` instead of a running sum.** Passing the amount still owed makes both tests — "done?" and "too big?" — compare against a single number, and because `remain` is an argument, each call has its own copy and there is nothing to undo for it. Only `path` is shared and needs the `remove`.

The third example shows the empty case: with only `2`s, a target of 1 is impossible, the loop breaks immediately, and the result is an empty list.

### Dry run

`combinationSum([2, 3, 6, 7], 7)`, one row per call:

| Call | `start` | `remain` | `path` | What happens |
|---|---|---|---|---|
| 1 | 0 | 7 | `[]` | try 2 |
| 2 | 0 | 5 | `[2]` | try 2 |
| 3 | 0 | 3 | `[2, 2]` | try 2 |
| 4 | 0 | 1 | `[2, 2, 2]` | 2 > 1: break, return |
| — | | 3 | `[2, 2]` | back in call 3: try 3 |
| 5 | 1 | 0 | `[2, 2, 3]` | record |
| — | | 3 | `[2, 2]` | call 3 tries 6: 6 > 3, break |
| 6 | 1 | 2 | `[2, 3]` | back in call 2, tried 3; now 3 > 2: break |
| — | | 5 | `[2]` | call 2 tries 6: 6 > 5, break |
| 7 | 1 | 4 | `[3]` | back in call 1, tried 3; try 3 |
| 8 | 1 | 1 | `[3, 3]` | 3 > 1: break |
| — | | 4 | `[3]` | call 7 tries 6: break |
| 9 | 2 | 1 | `[6]` | call 1 tried 6; 6 > 1: break |
| 10 | 3 | 0 | `[7]` | call 1 tried 7: record |

Ten calls in total, and two results. Notice how often the `break` fires: in a sorted search, overshooting is detected at the first candidate that is too large, and the rest of that loop is skipped.

```mermaid title="Search tree for candidates [2, 3, 6, 7], target 7 (remain shown)"
flowchart TD
    R["7: [ ]"] --> A["5: [2]"]
    R --> B["4: [3]"]
    R --> C["1: [6]"]
    R --> D["0: [7] found"]
    A --> E["3: [2, 2]"]
    A --> F["2: [2, 3]"]
    E --> G["1: [2, 2, 2]"]
    E --> H["0: [2, 2, 3] found"]
    B --> I["1: [3, 3]"]
```

## How big is the search?

Every node in the tree is a non-decreasing sequence of candidates whose sum does not exceed the target — that is, a **multiset of candidates with total at most the target**. The `break` guarantees no node overshoots, and the start index guarantees no multiset appears twice. So the number of calls equals the number of such multisets.

That number depends on the values, not just on `n`. Let `m` be the smallest candidate and `T` the target. A path can have at most `T / m` elements, so the recursion depth is at most `T / m + 1`. Each node has at most `n` children. That gives the loose bound **O(n^(T/m))** nodes — exponential in `T / m`. Small candidates and large targets are what make the search explode; a target of 40 with a candidate of 1 allows paths of 40 coins.

In practice the tree is much smaller than that bound, because the start index forbids decreasing paths and the break cuts every overshoot. Each recorded result also costs O(T / m) to copy. Interview statements keep the input small (LeetCode guarantees fewer than 150 combinations for its version) precisely because the output can be exponential.

**Space** is O(T / m) for the recursion depth and `path`, plus the output.

How much does the sorted `break` save? On the candidates `[2, 3, 5, 7, 11, 13, 17, 19, 23, 29]` with target 60, a version that recurses into overshoots and returns on `remain < 0` makes 93,115 calls. The sorted version with `break` makes 20,953 — the same answers in under a quarter of the calls, because each overshooting branch is never entered.

## Combination Sum II: each element once, input may repeat

The second variant changes two rules: each input element may be used **at most once**, and the input may contain **equal values**. For candidates `[10, 1, 2, 7, 6, 1, 5]` and target 8, `[1, 7]` is a valid answer — and because there are two `1`s, a careless search finds it twice.

Each rule needs its own fix, and they are the two rules you already know:

- Single use → recurse with **`i + 1`**, as in combinations.
- Repeated values → sort and skip a value equal to the previous one **at the same level**, as in subsets with duplicates.

```java title="CombinationSum2.java"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CombinationSum2 {

    // cand is sorted and may contain duplicates; each position is used at most once.
    static void build(int[] cand, int start, int remain, List<Integer> path,
                      List<List<Integer>> out) {
        if (remain == 0) {
            out.add(new ArrayList<>(path));
            return;
        }
        for (int i = start; i < cand.length; i++) {
            if (i > start && cand[i] == cand[i - 1]) continue;  // same value, same level
            if (cand[i] > remain) break;
            path.add(cand[i]);
            build(cand, i + 1, remain - cand[i], path, out);    // i + 1: no reuse
            path.remove(path.size() - 1);
        }
    }

    static List<List<Integer>> combinationSum2(int[] candidates, int target) {
        int[] cand = candidates.clone();
        Arrays.sort(cand);
        List<List<Integer>> out = new ArrayList<>();
        build(cand, 0, target, new ArrayList<>(), out);
        return out;
    }

    public static void main(String[] args) {
        System.out.println(combinationSum2(new int[]{10, 1, 2, 7, 6, 1, 5}, 8));
        System.out.println(combinationSum2(new int[]{2, 5, 2, 1, 2}, 5));
    }
}
```

```output
[[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]
[[1, 2, 2], [5]]
```

After sorting, the first input is `[1, 1, 2, 5, 6, 7, 10]`. At the root, the loop tries the first `1` and explores everything that starts with a 1 — including `[1, 1, 6]`, where the child call (with `start = 1`) takes the second `1` as its *first* option. When the root loop reaches the second `1`, the skip rule fires: everything that starts with "a 1" has already been explored, so starting with the other 1 would only repeat it. Equal values can still be stacked across levels, which is how `[1, 1, 6]` and `[1, 2, 2]` exist.

The order of the two checks inside the loop does not affect correctness — both only skip work — but putting the skip first is conventional and avoids reasoning about whether `break` could fire on a duplicate.

## Combination Sum III: fixed size, digits 1–9

The third variant asks for all combinations of exactly `k` **distinct digits from 1 to 9** that sum to `n`. Now there are two stopping conditions — size and sum — and there are no duplicates in the input (the digits are distinct), so no skip rule is needed.

```java title="CombinationSum3.java"
import java.util.ArrayList;
import java.util.List;

public class CombinationSum3 {

    static void build(int k, int start, int remain, List<Integer> path,
                      List<List<Integer>> out) {
        if (path.size() == k) {
            if (remain == 0) out.add(new ArrayList<>(path));
            return;
        }
        for (int d = start; d <= 9; d++) {
            if (d > remain) break;               // digits only grow from here
            path.add(d);
            build(k, d + 1, remain - d, path, out);
            path.remove(path.size() - 1);
        }
    }

    public static void main(String[] args) {
        List<List<Integer>> out = new ArrayList<>();
        build(3, 1, 9, new ArrayList<>(), out);
        System.out.println(out);
        out.clear();
        build(4, 1, 1, new ArrayList<>(), out);
        System.out.println(out);
    }
}
```

```output
[[1, 2, 6], [1, 3, 5], [2, 3, 4]]
[]
```

The size check comes first: once `k` digits are chosen, the path either sums to `n` or it does not, and no further digits may be added. The second example asks for four distinct digits summing to 1, which is impossible — the smallest four distinct digits already sum to 10 — and the search returns nothing after a handful of calls. A stronger prune would compare `remain` with the smallest and largest sums the remaining `k − path.size()` digits could make; that is a good exercise in [[a9-pruning]].

| Variant | Reuse? | Input duplicates? | Recurse with | Extra rule |
|---|---|---|---|---|
| Combination Sum | yes | no | `i` | — |
| Combination Sum II | no | yes | `i + 1` | sort; skip `i > start && c[i] == c[i-1]` |
| Combination Sum III | no | no (digits 1–9) | `d + 1` | stop at size `k` |
| Combination Sum IV | yes | no | — | ordered count: use DP |

```quiz
Q: In Combination Sum (reuse allowed), the recursive call passes `i` as the new start. What goes wrong if it passes `i + 1` instead?
- [ ] Duplicate combinations such as [2, 3] and [3, 2] appear
- [x] Combinations that use a candidate more than once, such as [2, 2, 3], are never found
- [ ] The recursion never terminates
- [ ] Nothing; both are correct
> With i + 1, the next pick must have a larger index, so each candidate can be used at most once. That is the rule for Combination Sum II. Reordered duplicates are prevented by never going below the current index, which both versions do.

Q: Why is `break` (rather than `continue`) correct when `cand[i] > remain`?
- [x] The candidates are sorted, so every later candidate is also greater than `remain`
- [ ] Because `remain` becomes negative and the method must return
- [ ] Because each candidate can be used only once
- [ ] `break` is only an optimisation; `continue` would give wrong answers
> In a sorted array, cand[i + 1], cand[i + 2], … are all at least cand[i], so none can fit. break skips them all at once. continue would also give correct answers, only more slowly; break is wrong only if the array is not sorted.
```

## When the question is "how many": Combination Sum IV

The fourth problem in the family looks similar but is a different kind of problem. **Combination Sum IV** asks for the *number* of ways to reach the target where **order matters** — `[1, 3]` and `[3, 1]` count separately. For nums `[1, 2, 3]` and target 4 the answer is 7: `1111, 112, 121, 211, 22, 13, 31`.

Backtracking would have to visit every one of those sequences, and their number grows exponentially with the target. But the question needs only a count, and the count has a recursive structure with **overlapping subproblems**: the number of sequences summing to `t` is the sum, over each `x`, of the number of sequences summing to `t − x` (the last number is `x`). Each `t` only needs computing once — that is dynamic programming ([[a11-1d-dp]]).

The unordered count — Coin Change II, which counts *combinations* — uses almost the same code with the loops swapped, and the difference is a classic interview question:

```java title="CountWays.java"
public class CountWays {

    // Combination Sum IV: ordered sequences, so [1, 3] and [3, 1] count separately.
    static int countOrdered(int[] nums, int target) {
        int[] dp = new int[target + 1];
        dp[0] = 1;                               // one way to make 0: pick nothing
        for (int t = 1; t <= target; t++) {      // outer loop over totals
            for (int x : nums) {
                if (x <= t) dp[t] += dp[t - x];  // last number in the sequence is x
            }
        }
        return dp[target];
    }

    // Coin Change II: unordered combinations, so [1, 3] and [3, 1] are the same.
    static int countUnordered(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        dp[0] = 1;
        for (int c : coins) {                    // outer loop over coins fixes an order
            for (int t = c; t <= amount; t++) {
                dp[t] += dp[t - c];
            }
        }
        return dp[amount];
    }

    public static void main(String[] args) {
        int[] nums = {1, 2, 3};
        System.out.println("ordered:   " + countOrdered(nums, 4));
        System.out.println("unordered: " + countUnordered(nums, 4));
    }
}
```

```output
ordered:   7
unordered: 4
```

With totals in the outer loop, every total considers every possible last number, so all orders are counted. With coins in the outer loop, coin 1 is fully processed before coin 2 is allowed, which means every counted combination uses its coins in the input's order — exactly the non-decreasing rule from the backtracking solution, expressed as a loop order. The four unordered ways are `1111, 112, 22, 13`. Both run in O(n · target) time and O(target) space, against an exponential number of sequences for backtracking. The knapsack lesson [[a11-knapsack]] develops this further.

> [!IMPORTANT] Listing versus counting
> If the output must contain every combination, backtracking is necessary, because the output itself can be exponential. If only the count, the minimum or a yes/no is required, look for dynamic programming first.

## In real systems

**Making change and packing.** Point-of-sale systems that dispense coins, and logistics tools that fill a pallet or container to an exact weight, face the same "parts that sum to a total" structure. For a few denominations a greedy choice often works (most real coin systems are designed so that it does), but checking all exact combinations is backtracking, and choosing the best one is a DP.

**Configuration bundles.** Cloud and licensing tools sometimes need every way to build a requested capacity from fixed-size units — say, 64 GB from modules of 8, 16 and 32 GB. Listing the options for a user to choose from is Combination Sum with reuse; picking the cheapest is an optimisation on top.

**Test data for financial code.** Generating every way to split a payment into allowed instalment sizes is a convenient way to produce exhaustive edge-case tests for small amounts — a direct use of the listing algorithm, kept small on purpose.

## Trade-offs and alternatives

| Need | Technique | Cost |
|---|---|---|
| List every combination summing to target | Backtracking with start index and sorted break | Proportional to the number of partial multisets explored; exponential worst case |
| Count unordered combinations | DP, items in the outer loop | O(n · target) |
| Count ordered sequences | DP, totals in the outer loop | O(n · target) |
| Fewest items to reach target | DP (Coin Change) or BFS on remainders | O(n · target) |
| Does any subset (no reuse) reach target, n ≈ 40 | Meet in the middle | about O(2^(n/2) · n) |

Backtracking is the only option for listing, and it is fast enough when the number of results is small. It becomes the wrong tool as soon as the question asks for an aggregate.

## Common mistakes

> [!MISTAKE] Mixing up `i` and `i + 1`
> Reuse allowed → recurse with `i`. Each element once → recurse with `i + 1`. Read the statement for the words "unlimited number of times" or "may only be used once", and write the matching index deliberately.

**Skipping duplicates across levels.** Using `i > 0` instead of `i > start` in Combination Sum II forbids stacking equal values, so `[1, 1, 6]` is lost. The skip applies only to alternatives within one loop.

**Using `break` without sorting.** On unsorted candidates, an oversized candidate does not mean later ones are oversized, and `break` silently drops valid answers.

**Forgetting the copy or the undo.** As in every backtracking problem, save `new ArrayList<>(path)` and remove after the recursive call.

**Solving Combination Sum IV by backtracking.** It produces the right count on small inputs and times out on larger ones. When the question asks "how many", reach for DP.

**Overflow in counts.** In the DP versions, intermediate counts can exceed `int` even when the final answer fits. Use `long` when the problem does not guarantee intermediate bounds.

## Interview perspective

Combination Sum I and II are among the most common backtracking interview questions because they test whether you can adapt one template to small rule changes. Interviewers listen for the reuse decision, the duplicate rule and the pruning.

> [!INTERVIEW] A strong walkthrough
> "I'll sort the candidates and build each combination in non-decreasing order so each multiset appears once. Since reuse is allowed, I recurse with the same index. When a candidate exceeds the remaining target, every later one does too, so I break. For Combination Sum II I'd recurse with `i + 1` and skip a value equal to the previous one in the same loop."

Questions to prepare:

- **Why sort?** It enables the `break` prune and, in Combination Sum II, makes equal values adjacent for the skip rule.
- **What is the complexity?** Exponential in `target / min(candidate)`; explain that every node is a distinct multiset with sum at most the target, and that depth is at most `target / min`.
- **Combination Sum II vs Subsets II?** Same duplicate rule; Combination Sum II adds a sum condition and a sorted break.
- **Combination Sum IV?** It is a counting problem with order mattering: DP over totals. Contrast it with Coin Change II's loop order.
- **Follow-up: what if candidates can be negative?** The `break` and the termination argument both fail — with negative values, paths could grow forever without the sum leaving range — so the problem needs a bound on length or a different formulation.

## Practice

1. **Combination Sum.** Implement it and test with `[2, 3, 5]`, target 8, and `[2]`, target 1.
2. **Combination Sum II.** Test `[10, 1, 2, 7, 6, 1, 5]`, target 8, then deliberately change `i > start` to `i > 0` and observe which answers disappear.
3. **Combination Sum III.** Add a prune that stops when `remain` is less than the sum of the smallest possible remaining digits.
4. **Combination Sum IV.** Solve with DP; then explain why swapping the loops gives Coin Change II.
5. **Factor Combinations.** List every way to write `n` (for example 12) as a product of factors greater than 1 in non-decreasing order. Identify `start`, `remain` and the reuse rule.

The DSA explorer lists matching problems under this topic; start with *Combination Sum*, *Combination Sum II* and *Combination Sum III*.

## Quick revision {#quick-revision}

- Build each combination in non-decreasing order with a start index; record when `remain == 0`.
- Reuse allowed → recurse with `i`; each element once → recurse with `i + 1`.
- Sort candidates; `if (cand[i] > remain) break;` cuts every overshoot at once.
- Duplicates in input: sort; `if (i > start && cand[i] == cand[i-1]) continue;`.
- Combination Sum III: stop at size `k`, record only if `remain == 0`.
- Search size: nodes are multisets with sum ≤ target; depth ≤ target / min candidate; exponential worst case.
- Counting is DP: totals outer loop → ordered (Sum IV); items outer loop → unordered (Coin Change II).
- Save `new ArrayList<>(path)`; remove after the recursive call.

## Key takeaways {#key-takeaways}

- Combination Sum is the combinations template with a sum as the stopping rule and the start index deciding reuse.
- One character — `i` or `i + 1` — is the difference between unlimited and single use, so choose it from the problem statement deliberately.
- Sorting gives two benefits: an early `break` on overshoot and adjacency of equal values for the duplicate rule.
- The cost depends on the target relative to the smallest candidate, not only on the number of candidates.
- When the question asks for a count rather than the list, dynamic programming replaces backtracking, and the loop order decides whether order matters.
