---
summary: Knapsack problems ask you to choose items under a capacity limit, and a surprising number of interview problems are knapsacks in disguise. You will derive the 0/1 knapsack DP from a take-or-skip recursion, compress it to one array and prove why the loop direction matters, and then adapt the same state to unbounded items, subset sum, counting problems and limited copies.
difficulty: intermediate
minutes: 60
objectives:
  - Derive the 0/1 knapsack state, recurrence and base cases from a take-or-skip brute force
  - Compress the table to one array and explain why 0/1 needs a descending capacity loop and unbounded needs an ascending one
  - Explain why greedy by value per weight fails for whole items and why the DP is only pseudo-polynomial
  - Reduce subset sum, partition, target sum and coin change counting to the knapsack state
  - Choose the right initialisation for "at most W" versus "exactly W", and handle limited copies with binary splitting
---

## Introduction

You are packing a bag that holds at most 7 kg for a trip. Four items are on the table: a 1 kg item worth 2 points to you, a 3 kg item worth 4, a 4 kg item worth 5, and a 5 kg item worth 8. Which items should go in to make the bag as valuable as possible without going over 7 kg?

Taking the most valuable item first (the 5 kg one, worth 8) leaves 2 kg, so only the 1 kg item fits: total 10. Taking the two middle items gives 3 + 4 = 7 kg and 4 + 5 = 9 points. Is 10 the best? With four items you can try all 16 subsets by hand and confirm it. With forty items there are over a trillion subsets, and you need a better method.

This is the **0/1 knapsack problem**: given items with **weights** and **values** and a bag with **capacity** `W`, choose a subset of items with total weight at most `W` and the largest possible total value. "0/1" means each item is either left out (0) or taken once (1) — you cannot take half of one, and you cannot take two copies.

Knapsack matters far beyond packing. Choosing projects under a budget, choosing tests to run within a time limit, deciding whether some numbers add up to a target, splitting an array into two equal-sum halves, counting the ways to make change — all of these are knapsacks once you see the shape: **a list of items, a single numeric resource that each item consumes, and a decision per item**. This lesson derives the core DP once, carefully, and then shows how small changes to it solve each variant.

## Before you start

- **The five decisions of a DP** — [[a11-memoization]]. That lesson turns a recursion into a DP by fixing (1) the state, written as a sentence; (2) the recurrence, from the last choice made; (3) the base cases; (4) the order of computation; (5) where the answer lives. Here we apply it to items and capacity.
- **Bottom-up tables and rolling rows** — [[a11-tabulation]] and [[a11-2d-dp]]. Knapsack is a two-index state `(item, capacity)` that compresses to one array in an unusual way.
- **Subsets** — [[a9-subsets]]. The brute force below is the include/exclude recursion from that lesson.
- **Coin change for the minimum number of coins** — [[a11-1d-dp]]. It is the "unbounded, minimise a count" member of this family and is taught there.

## The intuition: one decision per item

Line the items up and walk past them one at a time. At each item you make one decision: put it in the bag or leave it. After deciding about every item, you have chosen a subset.

Now ask what you need to *remember* while walking. You do not need to remember which earlier items you took — the future does not care whether the 3 kg in the bag came from one item or from a 1 kg and a 2 kg item. The only thing the remaining decisions depend on is **how much room is left**. Two different histories that leave the same room behind face exactly the same remaining problem.

That observation is the whole reason knapsack has a fast solution. The number of possible histories is `2ⁿ`, but the number of distinct situations "I am at item `i` with `w` kg of room" is only `(n + 1) × (W + 1)`. Solve each situation once and you have solved all histories.

## The naive approach: try every subset

Write the decision as a recursion. Let `best(i, w)` be the highest value achievable using only the first `i` items with `w` kg of room. Look at the last of those items, item `i - 1` in zero-based array terms:

- **Skip it**: the answer is `best(i - 1, w)`.
- **Take it**, if it fits: you gain its value and lose its weight, so the answer is `val[i - 1] + best(i - 1, w - wt[i - 1])`.

The answer is the larger of the two. With no items left, the value is 0.

```java title="KnapsackBrute.java"
import java.util.Random;

public class KnapsackBrute {
    static long calls = 0;

    // best(i, w): highest value using only the first i items, total weight at most w
    static int best(int[] wt, int[] val, int i, int w) {
        calls++;
        if (i == 0) return 0;                              // no items left to consider
        int skip = best(wt, val, i - 1, w);                // decide about item i-1: leave it
        if (wt[i - 1] > w) return skip;                    // it does not fit
        int take = val[i - 1] + best(wt, val, i - 1, w - wt[i - 1]);
        return Math.max(skip, take);
    }

    public static void main(String[] args) {
        int[] wt = {1, 3, 4, 5};
        int[] val = {2, 4, 5, 8};
        System.out.println("best = " + best(wt, val, 4, 7) + " after " + calls + " calls");

        Random rnd = new Random(1);
        for (int n : new int[] {10, 20, 25}) {
            int[] w = new int[n], v = new int[n];
            for (int i = 0; i < n; i++) { w[i] = 1 + rnd.nextInt(10); v[i] = rnd.nextInt(100); }
            calls = 0;
            best(w, v, n, 1000);                           // capacity large enough for everything
            System.out.println("n = " + n + ": " + calls + " calls");
        }
    }
}
```

```output
best = 10 after 20 calls
n = 10: 2047 calls
n = 20: 2097151 calls
n = 25: 67108863 calls
```

The recursion is correct — it confirms 10 for the trip example — but look at the growth. When every item fits, each call makes two more calls, so the call tree is a full binary tree of depth `n` with `2ⁿ⁺¹ − 1` nodes: 2,047 for ten items, two million for twenty, sixty-seven million for twenty-five. Each extra item doubles the work. Forty items would need about two trillion calls.

The waste is visible if you print the arguments. With weights `1, 3, 4, 5`, taking the 1 kg and the 3 kg items and taking only the 4 kg item both arrive at "first `i` items done, 3 kg of room used", and the recursion solves the rest of the problem twice. That repetition — the same `(i, w)` reached along different paths — is what dynamic programming removes.

## Deriving the DP

Apply the five decisions to the recursion you already have.

**1. State.** The recursion has two changing arguments, so the state is the pair:

> `dp[i][w]` = the highest total value achievable using only the first `i` items, with total weight at most `w`.

Notice the precise wording. "First `i` items" uses **prefix length**, so `i` runs from `0` (no items) to `n` (all items), and item number `i` in the table is `wt[i - 1]` in the array. This costs one subtraction in the code but gives a natural base case — the empty prefix — and never needs an index of `-1`. "At most `w`" matters too; a later section shows what changes when the bag must be filled exactly.

**2. Recurrence.** Decide about the last item in the prefix, item `i - 1`:

```text
dp[i][w] = dp[i-1][w]                                      if wt[i-1] > w
dp[i][w] = max( dp[i-1][w],  val[i-1] + dp[i-1][w - wt[i-1]] )   otherwise
```

The first argument of `max` is "skip", the second is "take". Both read only row `i - 1`. That is how the 0/1 rule appears in the formula: after taking item `i - 1`, the remaining room is filled from the items *before* it, so it cannot be taken again.

**3. Base cases.** With zero items nothing can be packed: `dp[0][w] = 0` for every `w`. Capacity 0 needs no special rule — the recurrence gives 0 automatically as long as every weight is positive.

**4. Order of computation.** Cell `(i, w)` reads `(i - 1, w)` and `(i - 1, w - wt)`: both are in the previous row. So filling rows from `i = 0` upward computes every dependency first. Within a row the order does not matter, because no cell reads another cell in its own row. Remember that fact; it is what makes the one-array version possible.

**5. Answer.** `dp[n][W]`: all items considered, full capacity available.

**Complexity.** There are `(n + 1)(W + 1)` states and each does a constant amount of work, so the time is **O(n · W)** and the table is O(n · W) memory.

Before building the table, it is worth seeing that the same recursion with a cache already gets the speed-up. This is the memoized form from [[a11-memoization]]: identical logic, plus a lookup keyed by the state.

```java title="KnapsackMemo.java"
import java.util.Arrays;
import java.util.Random;

public class KnapsackMemo {
    static long calls = 0;

    // Same recursion as the brute force, plus a cache keyed by the state (i, w)
    static int best(int[] wt, int[] val, int i, int w, int[][] memo) {
        calls++;
        if (i == 0) return 0;
        if (memo[i][w] != -1) return memo[i][w];           // -1 = not computed; values are >= 0
        int skip = best(wt, val, i - 1, w, memo);
        int ans = skip;
        if (wt[i - 1] <= w)
            ans = Math.max(skip, val[i - 1] + best(wt, val, i - 1, w - wt[i - 1], memo));
        memo[i][w] = ans;
        return ans;
    }

    public static void main(String[] args) {
        Random rnd = new Random(1);
        for (int n : new int[] {10, 20, 25}) {
            int[] w = new int[n], v = new int[n];
            for (int i = 0; i < n; i++) { w[i] = 1 + rnd.nextInt(10); v[i] = rnd.nextInt(100); }
            int[][] memo = new int[n + 1][1001];
            for (int[] row : memo) Arrays.fill(row, -1);
            calls = 0;
            int ans = best(w, v, n, 1000, memo);
            System.out.println("n = " + n + ": best = " + ans + ", " + calls + " calls");
        }
    }
}
```

```output
n = 10: best = 480, 433 calls
n = 20: best = 994, 2063 calls
n = 25: best = 1148, 3273 calls
```

The random items are generated with the same seed as before, so these are the same three problems. Twenty-five items took 3,273 calls instead of 67 million. The count is even smaller than `(n + 1)(W + 1) = 26,026` because the recursion only visits states that some sequence of decisions can actually reach.

## The table, step by step

The bottom-up version fills the same states in row order. It also keeps the whole table, which lets us recover *which* items were chosen.

```java title="Knapsack01.java"
import java.util.ArrayList;
import java.util.List;

public class Knapsack01 {

    // dp[i][w] = best value using only the first i items with total weight at most w
    static int[][] table(int[] wt, int[] val, int W) {
        int n = wt.length;
        int[][] dp = new int[n + 1][W + 1];                // row 0: no items, value 0
        for (int i = 1; i <= n; i++) {
            int weight = wt[i - 1], value = val[i - 1];    // item i is wt[i-1] in the array
            for (int w = 0; w <= W; w++) {
                int skip = dp[i - 1][w];
                int take = weight <= w ? dp[i - 1][w - weight] + value : Integer.MIN_VALUE;
                dp[i][w] = Math.max(skip, take);
            }
        }
        return dp;
    }

    // Walk back up the table: if the value changed from the row above, item i was taken
    static List<Integer> chosen(int[] wt, int[][] dp, int W) {
        List<Integer> items = new ArrayList<>();
        int w = W;
        for (int i = wt.length; i >= 1; i--) {
            if (dp[i][w] != dp[i - 1][w]) {
                items.add(i - 1);                          // array index of the item
                w -= wt[i - 1];
            }
        }
        return items.reversed();                           // List.reversed() is Java 21
    }

    public static void main(String[] args) {
        int[] wt = {1, 3, 4, 5};
        int[] val = {2, 4, 5, 8};
        int W = 7;
        int[][] dp = table(wt, val, W);
        for (int i = 0; i <= wt.length; i++) {
            StringBuilder row = new StringBuilder("i=" + i + ":");
            for (int w = 0; w <= W; w++) row.append(String.format("%3d", dp[i][w]));
            System.out.println(row);
        }
        System.out.println("best value = " + dp[wt.length][W]);
        System.out.println("items taken (indices) = " + chosen(wt, dp, W));
    }
}
```

```output
i=0:  0  0  0  0  0  0  0  0
i=1:  0  2  2  2  2  2  2  2
i=2:  0  2  2  4  6  6  6  6
i=3:  0  2  2  4  6  7  7  9
i=4:  0  2  2  4  6  8 10 10
best value = 10
items taken (indices) = [0, 3]
```

Read the rows as "what is the best I can do with these items, for every bag size". Row 1 has only the 1 kg item, so any bag of at least 1 kg is worth 2. Row 2 adds the 3 kg item: a 4 kg bag can hold both, worth 6. A few cells of the last two rows, computed by hand:

| Cell | Item considered | Skip: `dp[i-1][w]` | Take: `val + dp[i-1][w - wt]` | Result |
|---|---|---|---|---|
| `dp[3][5]` | 4 kg, value 5 | `dp[2][5]` = 6 | 5 + `dp[2][1]` = 5 + 2 = 7 | 7 |
| `dp[3][7]` | 4 kg, value 5 | `dp[2][7]` = 6 | 5 + `dp[2][3]` = 5 + 4 = 9 | 9 |
| `dp[4][5]` | 5 kg, value 8 | `dp[3][5]` = 7 | 8 + `dp[3][0]` = 8 | 8 |
| `dp[4][7]` | 5 kg, value 8 | `dp[3][7]` = 9 | 8 + `dp[3][2]` = 8 + 2 = 10 | 10 |

The last row shows the decision the brute force had to discover by trying everything: with all four items, a 7 kg bag is better off taking the 5 kg item and filling the remaining 2 kg as well as the first three items can (value 2) than skipping it and using the 9 found for the first three items.

**Recovering the items.** The table stores values, not decisions, but the decisions can be read back. Start at `(n, W)`. If `dp[i][w]` equals `dp[i - 1][w]`, skipping item `i - 1` achieves the optimum, so move up a row. Otherwise the optimum must have taken it: record it, subtract its weight, and move up.

| `i` | `w` | `dp[i][w]` | `dp[i-1][w]` | Decision |
|---|---|---|---|---|
| 4 | 7 | 10 | 9 | take item 3 (5 kg), `w = 2` |
| 3 | 2 | 2 | 2 | skip item 2 |
| 2 | 2 | 2 | 2 | skip item 1 |
| 1 | 2 | 2 | 0 | take item 0 (1 kg), `w = 1` |

The answer is items 0 and 3: 6 kg, value 10. When several subsets tie, this walk returns one of them — the one that prefers skipping.

## Why it is "pseudo-polynomial"

O(n · W) looks polynomial, but knapsack is a famous **NP-hard** problem, and no algorithm is known that is polynomial in the size of the input. The two facts fit together once you measure input size properly. The number `W` is written with about `log₂ W` bits. A table with `W + 1` columns is therefore exponential in the number of bits needed to write the capacity: add ten bits to `W` and the table grows a thousand times. An algorithm that is polynomial in the *numeric value* of the input but not in its *bit length* is called **pseudo-polynomial**.

In practice this tells you when the DP is usable. With `n = 100` and `W = 10,000`, the table has about a million cells — instant. With `W = 10⁹`, a single row of `int`s takes 4 GB, and the DP is hopeless even for ten items. When capacities are huge but **values** are small, flip the state: let `dp[v]` be the minimum weight needed to reach value exactly `v`, and take the largest `v` whose weight is at most `W`. When `n` is small (up to about 40) and both numbers are huge, split the items into two halves, enumerate each half's `2^(n/2)` subsets, and combine them with sorting and binary search — the **meet-in-the-middle** technique.

> [!IMPORTANT] Read the constraints first
> The knapsack DP is the right tool when the capacity (or target sum) is small enough to index an array — typically up to about 10⁴–10⁶. If the capacity is up to 10⁹, the problem wants a different state or a different technique, even though it looks like knapsack.

## Compressing to one array: why capacity must run downward

Every row of the table reads only the row above it. Keeping all `n + 1` rows is therefore wasteful; one array of size `W + 1` can hold "the previous row" and be overwritten into "the current row" in place. The question is the order in which to overwrite it.

The update for item `i` is `dp[w] = max(dp[w], dp[w - wt] + val)`. On the right-hand side, both reads must still hold **row `i - 1`** values — that is what the 2D recurrence says. `dp[w]` is fine: it has not been touched yet when we compute it. The danger is `dp[w - wt]`, which sits to the *left* of `w`:

- If `w` runs **downward** from `W`, cells to the left of `w` have not been updated yet in this pass. `dp[w - wt]` still holds the row `i - 1` value. Correct.
- If `w` runs **upward**, `dp[w - wt]` was already updated in this pass — it may already include item `i`. Adding item `i` on top of it uses the item twice.

Here are both loops on the trip example, with the array printed after each item for the upward version:

```java title="OneRow.java"
import java.util.Arrays;

public class OneRow {

    static int zeroOne(int[] wt, int[] val, int W) {
        int[] dp = new int[W + 1];
        for (int i = 0; i < wt.length; i++) {
            for (int w = W; w >= wt[i]; w--) {             // descending: dp[w - wt[i]] is old
                dp[w] = Math.max(dp[w], dp[w - wt[i]] + val[i]);
            }
        }
        return dp[W];
    }

    static int ascendingBug(int[] wt, int[] val, int W) {
        int[] dp = new int[W + 1];
        for (int i = 0; i < wt.length; i++) {
            for (int w = wt[i]; w <= W; w++) {             // ascending: dp[w - wt[i]] may be new
                dp[w] = Math.max(dp[w], dp[w - wt[i]] + val[i]);
            }
            System.out.println("after item " + i + ": " + Arrays.toString(dp));
        }
        return dp[W];
    }

    public static void main(String[] args) {
        int[] wt = {1, 3, 4, 5};
        int[] val = {2, 4, 5, 8};
        System.out.println("descending (0/1) = " + zeroOne(wt, val, 7));
        System.out.println("ascending = " + ascendingBug(wt, val, 7));
    }
}
```

```output
descending (0/1) = 10
after item 0: [0, 2, 4, 6, 8, 10, 12, 14]
after item 1: [0, 2, 4, 6, 8, 10, 12, 14]
after item 2: [0, 2, 4, 6, 8, 10, 12, 14]
after item 3: [0, 2, 4, 6, 8, 10, 12, 14]
ascending = 14
```

The descending loop agrees with the table: 10. The ascending loop goes wrong on the very first item. Processing the 1 kg item upward, `dp[1] = dp[0] + 2 = 2`, then `dp[2] = dp[1] + 2 = 4` — reading the `dp[1]` that already contains the item — then `dp[3] = 6`, and so on. After one item the array claims a 7 kg bag is worth 14, which means seven copies of a single item. No later item can beat that, so the final answer is 14.

The loop also stops at `w = wt[i]` instead of `0`: for smaller capacities the item cannot fit and `dp[w]` keeps its row `i - 1` value, which is exactly "skip".

The one-array version uses O(W) memory instead of O(n · W), which matters when `n` is in the thousands. The price is that the decisions can no longer be recovered by walking back, because the earlier rows are gone. If you need both small memory and the chosen items, keep a compact `boolean[n][W + 1]` (or a bitset) recording whether each cell took its item.

## Why greedy fails, and when it works

A natural shortcut is to sort items by **value per kilogram** and take the densest ones first. Compare it with the DP on three items of weights 10, 20, 30 and values 60, 100, 120, capacity 50:

```java title="GreedyVsDp.java"
import java.util.Arrays;
import java.util.Comparator;

public class GreedyVsDp {

    // Item indices sorted by value per unit of weight, best ratio first
    static Integer[] byRatio(int[] wt, int[] val) {
        Integer[] order = new Integer[wt.length];
        for (int i = 0; i < order.length; i++) order[i] = i;
        Arrays.sort(order, Comparator.comparingDouble((Integer i) -> (double) val[i] / wt[i])
                                     .reversed());
        return order;
    }

    // Greedy for 0/1: take whole items in ratio order while they fit
    static int greedyWhole(int[] wt, int[] val, int W) {
        int room = W, total = 0;
        for (int i : byRatio(wt, val)) {
            if (wt[i] <= room) { room -= wt[i]; total += val[i]; }
        }
        return total;
    }

    // Fractional knapsack: same order, but the last item may be cut
    static double fractional(int[] wt, int[] val, int W) {
        double room = W, total = 0;
        for (int i : byRatio(wt, val)) {
            double part = Math.min(wt[i], room);
            total += part * val[i] / wt[i];
            room -= part;
        }
        return total;
    }

    static int dp(int[] wt, int[] val, int W) {
        int[] dp = new int[W + 1];
        for (int i = 0; i < wt.length; i++)
            for (int w = W; w >= wt[i]; w--)
                dp[w] = Math.max(dp[w], dp[w - wt[i]] + val[i]);
        return dp[W];
    }

    public static void main(String[] args) {
        int[] wt = {10, 20, 30};
        int[] val = {60, 100, 120};
        System.out.println("greedy by ratio (whole items) = " + greedyWhole(wt, val, 50));
        System.out.println("dynamic programming (0/1)     = " + dp(wt, val, 50));
        System.out.println("fractional greedy             = " + fractional(wt, val, 50));
    }
}
```

```output
greedy by ratio (whole items) = 160
dynamic programming (0/1)     = 220
fractional greedy             = 240.0
```

Greedy takes the densest items (ratios 6 and 5), uses 30 kg for 160, and then the 30 kg item does not fit in the remaining 20. The DP finds that skipping the densest item and taking the other two fills the bag exactly for 220. A choice that looks best locally blocked a better combination — the general phenomenon is discussed in [[a10-local-vs-global]].

The third line is the **fractional knapsack**, where items can be cut (gold dust rather than gold bars). There greedy *is* optimal: take whole items in ratio order and cut the last one to fill the bag, here two-thirds of the 30 kg item for 80 more. The proof is an exchange argument — any solution holding some less-dense material while denser material is left behind can swap a little of one for the other and gain — and it depends on being able to move part of an item. For whole items that move does not exist, which is why 0/1 needs the DP. Sorting-based greedy proofs are covered in [[a10-sorting-greedy]].

## Unbounded knapsack: unlimited copies

Now suppose every item comes in unlimited supply — a shop with infinite stock and a fixed budget. Only one thing changes in the derivation. When you take item `i - 1`, you may take it *again*, so the room that remains should be filled from the first `i` items **including** item `i - 1` itself:

```text
dp[i][w] = max( dp[i-1][w],  val[i-1] + dp[i][w - wt[i-1]] )   // note: row i, not i-1
```

The take branch now reads the *current* row. In the one-array version, the current row's values to the left of `w` are exactly what an **ascending** loop provides. So the loop that was a bug for 0/1 is the correct algorithm for unbounded:

```java
for (int i = 0; i < wt.length; i++)
    for (int w = wt[i]; w <= W; w++)              // ascending: dp[w - wt[i]] may include item i
        dp[w] = Math.max(dp[w], dp[w - wt[i]] + val[i]);
```

On the trip example the unbounded answer is 14 — seven copies of the 1 kg item, worth 2 each, really are the best you can do with unlimited stock. That is the same 14 the buggy loop produced, which is the clearest way to remember the rule.

> [!TIP] One rule for the loop direction
> In the one-array form, the take branch reads `dp[w - wt]`. Ask whether that cell should be from the **previous item round** (each item once: loop `w` downward) or may already include the **current item** (unlimited copies: loop `w` upward).

Coin change for the fewest coins is an unbounded knapsack that minimises a count instead of maximising a value; [[a11-1d-dp]] derives it from scratch. Rod cutting — cut a rod of length `L` into pieces with given prices — is another unbounded knapsack in which piece lengths are weights and prices are values.

## Subset sum and partition equal subset sum

Many knapsack problems have no values at all. **Subset sum** asks: given positive integers and a target `T`, does some subset add up to exactly `T`? Each number is an item whose weight is the number itself, and we ask about reachability rather than maximum value.

Re-run the five decisions. The state becomes a boolean: `can[i][s]` is true when some subset of the first `i` numbers sums to exactly `s`. The recurrence is "skip or take" with `or` instead of `max`: `can[i][s] = can[i-1][s] || can[i-1][s - x]`. The base case is `can[0][0] = true` — the empty subset sums to 0 — and `can[0][s] = false` for every other `s`. The answer is `can[n][T]`. Compressing to one array works exactly as before, with `s` running downward because each number may be used once.

**Partition Equal Subset Sum** asks whether an array can be split into two groups with equal sums. If the total is odd, no. If it is even, the two groups each sum to `total / 2`, and finding one group with that sum automatically makes the rest the other group. The problem is subset sum with `T = total / 2`.

```java title="PartitionEqualSubset.java"
import java.util.Arrays;

public class PartitionEqualSubset {

    // can[s] = some subset of the numbers processed so far sums to exactly s
    static boolean subsetSum(int[] nums, int target) {
        boolean[] can = new boolean[target + 1];
        can[0] = true;                                     // the empty subset sums to 0
        for (int x : nums) {
            for (int s = target; s >= x; s--) {            // descending: each number used once
                can[s] = can[s] || can[s - x];
            }
        }
        return can[target];
    }

    static boolean canPartition(int[] nums) {
        int total = Arrays.stream(nums).sum();
        if (total % 2 != 0) return false;                  // equal halves need an even total
        return subsetSum(nums, total / 2);
    }

    public static void main(String[] args) {
        System.out.println(canPartition(new int[] {1, 5, 11, 5}));
        System.out.println(canPartition(new int[] {1, 2, 3, 5}));
        System.out.println(canPartition(new int[] {3, 3, 2}));
    }
}
```

```output
true
false
false
```

`[1, 5, 11, 5]` sums to 22 and `{11}` versus `{1, 5, 5}` splits it. `[1, 2, 3, 5]` sums to 11, which is odd, so the early check answers immediately. `[3, 3, 2]` sums to 8 but no subset reaches 4 — the reachable sums are 0, 2, 3, 5, 6 and 8. The time is O(n · total), which is why the constraints for this problem keep the numbers small.

## Counting assignments: target sum

**Target Sum** gives an array and a target and asks in how many ways you can put a `+` or `−` in front of each number so that the expression equals the target. It does not look like a knapsack — every number is used — but a little algebra turns it into one.

Let `P` be the sum of the numbers given `+` and `N` the sum of those given `−`. Then `P − N = target` and `P + N = total`. Adding the two equations gives `P = (total + target) / 2`. Every valid sign assignment corresponds to exactly one subset (the `+` numbers) with sum `P`, and every such subset gives a valid assignment. So the answer is **the number of subsets with sum `P`**: a subset-sum count. Two quick checks come first: if `|target| > total` no assignment can reach it, and if `total + target` is odd, `P` is not an integer and the answer is 0.

The counting version of the state is `ways[s]` = number of subsets of the processed numbers with sum `s`. Skip and take now **add** instead of taking a maximum, because the two branches describe disjoint sets of subsets:

```java title="TargetSum.java"
import java.util.Arrays;

public class TargetSum {

    // Number of ways to give each number a + or - sign so that the total equals target
    static int findTargetSumWays(int[] nums, int target) {
        int total = Arrays.stream(nums).sum();
        if (Math.abs(target) > total) return 0;            // even all-plus or all-minus misses
        if ((total + target) % 2 != 0) return 0;           // plus-sum would not be an integer
        int plus = (total + target) / 2;
        int[] ways = new int[plus + 1];                    // ways[s]: subsets with sum s
        ways[0] = 1;
        for (int x : nums) {
            for (int s = plus; s >= x; s--) {
                ways[s] += ways[s - x];
            }
        }
        return ways[plus];
    }

    public static void main(String[] args) {
        System.out.println(findTargetSumWays(new int[] {1, 1, 1, 1, 1}, 3));
        System.out.println(findTargetSumWays(new int[] {0, 0, 1}, 1));
        System.out.println(findTargetSumWays(new int[] {2, 3}, 2));
        System.out.println(findTargetSumWays(new int[] {1}, -1));
    }
}
```

```output
5
4
0
1
```

Five ones with target 3 need `P = 4`: choose which one of the five gets the minus sign, 5 ways. The second case shows why zeros need care. `+0` and `−0` are different assignments with the same value, so each zero should double the count. The loop handles it: for `x = 0` the inner loop runs down to `s = 0` and performs `ways[s] += ways[s]`, doubling every entry. Two zeros give a factor of 4. A loop written as `s > x` or a pre-filter that drops zeros would undercount. The third case fails the parity check (total 5, target 2), and the last shows a negative target working through the formula: `P = (1 − 1) / 2 = 0`, and the empty subset is the one way.

## Coin change II: counting combinations, not sequences

**Coin Change II** asks for the number of ways to make an amount from unlimited coins, where `{1, 2, 2}` and `{2, 1, 2}` count as the same way. This is an unbounded counting knapsack, and its loop order carries a meaning that interviewers like to probe.

Derive it from the 2D state first. Let `ways[k][a]` be the number of **multisets** of coins drawn from the first `k` coin types that sum to `a`. Either the multiset uses no copy of coin `k - 1` — counted by `ways[k-1][a]` — or it uses at least one, in which case removing one copy leaves a multiset from the same first `k` types summing to `a − c`, counted by `ways[k][a − c]`. So `ways[k][a] = ways[k-1][a] + ways[k][a − c]`, the unbounded pattern with "current row" on the take side. Compressed to one array, this is a loop over **coins outside, amounts inside, ascending**. Each multiset is counted once because the coins are introduced in a fixed order: by the time coin `c` is considered, every way of using the earlier coins has been counted, and coin `c` can only be added on top.

Swap the loops — amounts outside, coins inside — and the meaning changes. Now `ways[a] = Σ ways[a − c]` over every coin `c`, which says "the last coin of the sequence is `c`". That counts **ordered sequences**, so `1 + 2 + 2` and `2 + 1 + 2` are different.

```java title="CoinChangeWays.java"
public class CoinChangeWays {

    // Coins in the outer loop: each multiset of coins is counted once
    static long combinations(int[] coins, int amount) {
        long[] ways = new long[amount + 1];
        ways[0] = 1;
        for (int c : coins) {
            for (int a = c; a <= amount; a++) {            // ascending: coin c may repeat
                ways[a] += ways[a - c];
            }
        }
        return ways[amount];
    }

    // Amount in the outer loop: every ordering is counted separately
    static long sequences(int[] coins, int amount) {
        long[] ways = new long[amount + 1];
        ways[0] = 1;
        for (int a = 1; a <= amount; a++) {
            for (int c : coins) {
                if (c <= a) ways[a] += ways[a - c];        // c is the last coin of the sequence
            }
        }
        return ways[amount];
    }

    public static void main(String[] args) {
        int[] coins = {1, 2, 5};
        System.out.println("combinations = " + combinations(coins, 5));
        System.out.println("sequences    = " + sequences(coins, 5));
    }
}
```

```output
combinations = 4
sequences    = 9
```

The four combinations for amount 5 are `{5}`, `{2, 2, 1}`, `{2, 1, 1, 1}` and `{1, 1, 1, 1, 1}`. The nine sequences count the orderings of those: 1 + 3 + 4 + 1. The sequences version is the problem called Combination Sum IV, which [[a9-combination-sum]] meets from the backtracking side. Both run in O(number of coins × amount) time. Counts grow quickly, which is why this program uses `long`; problems that ask for the count "modulo 10⁹ + 7" want the addition reduced on every step.

## "At most W" versus "exactly W"

The base row decides which question the DP answers. With `dp[0][w] = 0` for every `w`, an empty bag is a valid starting point at every capacity, so `dp[n][W]` is the best value with weight **at most** `W`. If the bag must be filled **exactly** — or a sum must be hit exactly — only weight 0 is reachable with no items. Set `dp[0][0] = 0` and every other base cell to "impossible", represented by a very negative number for a maximisation:

```java title="ExactVsAtMost.java"
import java.util.Arrays;

public class ExactVsAtMost {
    static final int NEG = Integer.MIN_VALUE / 2;          // "unreachable"; adding to it is safe

    static int solve(int[] wt, int[] val, int W, boolean exact) {
        int[] dp = new int[W + 1];
        if (exact) {
            Arrays.fill(dp, NEG);
            dp[0] = 0;                                     // only weight 0 is reachable with no items
        }                                                  // else: every capacity starts at value 0
        for (int i = 0; i < wt.length; i++)
            for (int w = W; w >= wt[i]; w--)
                dp[w] = Math.max(dp[w], dp[w - wt[i]] + val[i]);
        return dp[W];
    }

    public static void main(String[] args) {
        int[] wt = {3, 5}, val = {4, 7};
        for (int W : new int[] {7, 8}) {
            int exact = solve(wt, val, W, true);
            System.out.println("W = " + W + ": at most -> " + solve(wt, val, W, false)
                + ", exactly -> " + (exact < 0 ? "impossible" : String.valueOf(exact)));
        }
    }
}
```

```output
W = 7: at most -> 7, exactly -> impossible
W = 8: at most -> 11, exactly -> 11
```

With items of 3 and 5 kg, nothing weighs exactly 7, but a 7 kg bag can still hold the 5 kg item. The sentinel is `Integer.MIN_VALUE / 2` rather than `Integer.MIN_VALUE` because the code adds values to it; `MIN_VALUE + 4` would be fine, but subtracting or adding a negative would wrap around to a huge positive number and silently become "the best answer". The same idea for a minimisation uses a large positive "infinity" such as `Integer.MAX_VALUE / 2`, which is how coin change for the fewest coins marks unreachable amounts.

## Bounded knapsack: limited copies

Between 0/1 and unbounded lies the **bounded knapsack**: item `i` is available up to `cnt[i]` times. The direct approach treats each copy as a separate 0/1 item, which costs O(W · Σ cnt) time — slow when counts are large.

A neat trick reduces the number of pseudo-items. Split a count `c` into pieces `1, 2, 4, …` doubling while they fit, plus whatever remains. For `c = 13` the pieces are `1, 2, 4, 6`. Each piece becomes one 0/1 item with `k` times the weight and value. This is **binary splitting**, and it is correct because the pieces can form every count from 0 to `c` and nothing larger: the powers of two `1, 2, …, 2^(m−1)` form every number from 0 to `2^m − 1` (that is binary notation), and adding the remainder `r` extends the range to `2^m − 1 + r = c`. So "choose any subset of the pieces" is the same as "choose any number of copies from 0 to `c`", and the number of pieces is about `log₂ c`.

```java title="Bounded.java"
import java.util.ArrayList;
import java.util.List;

public class Bounded {

    // Split a count c into 1, 2, 4, ... plus a remainder; every 0..c is a sum of some pieces
    static List<Integer> pieces(int count) {
        List<Integer> out = new ArrayList<>();
        for (int p = 1; count > 0; p *= 2) {
            int take = Math.min(p, count);
            out.add(take);
            count -= take;
        }
        return out;
    }

    static int bounded(int[] wt, int[] val, int[] cnt, int W) {
        int[] dp = new int[W + 1];
        for (int i = 0; i < wt.length; i++) {
            for (int k : pieces(cnt[i])) {                 // each piece is one 0/1 item
                int w0 = k * wt[i], v0 = k * val[i];
                for (int w = W; w >= w0; w--)
                    dp[w] = Math.max(dp[w], dp[w - w0] + v0);
            }
        }
        return dp[W];
    }

    public static void main(String[] args) {
        System.out.println("pieces(13) = " + pieces(13));
        System.out.println("pieces(5)  = " + pieces(5));
        int[] wt = {2, 3}, val = {3, 5}, cnt = {5, 2};
        System.out.println("bounded best = " + bounded(wt, val, cnt, 10));
    }
}
```

```output
pieces(13) = [1, 2, 4, 6]
pieces(5)  = [1, 2, 2]
bounded best = 16
```

With up to five 2 kg items worth 3 and up to two 3 kg items worth 5, a 10 kg bag is best filled with both 3 kg items and two 2 kg items: 10 kg, value 16. Unbounded would allow a third 3 kg item and is not the same problem. The time is O(W · Σ log cnt[i]).

## Checking the DP against brute force

Every knapsack variant above differs from its neighbours by one loop direction, one base value or one operator, and each of those mistakes still produces plausible numbers. The reliable defence is to compare against a brute force that is too slow for real inputs but clearly correct, on thousands of small random inputs. The checker below compares 0/1 against trying all `2ⁿ` subsets with a bitmask (see [[a13-bitmasking]]), unbounded against recursive enumeration of multisets, bounded against trying every count, and target sum against trying every sign:

```java title="KnapsackCheck.java"
import java.util.Arrays;
import java.util.Random;

public class KnapsackCheck {

    static int bruteZeroOne(int[] wt, int[] val, int W) {
        int n = wt.length, best = 0;
        for (int mask = 0; mask < (1 << n); mask++) {      // every subset of the items
            int w = 0, v = 0;
            for (int i = 0; i < n; i++)
                if ((mask >> i & 1) == 1) { w += wt[i]; v += val[i]; }
            if (w <= W) best = Math.max(best, v);
        }
        return best;
    }

    // Try every multiset: the next item index never decreases, so each multiset is seen once
    static int bruteUnbounded(int[] wt, int[] val, int room, int from) {
        int best = 0;
        for (int i = from; i < wt.length; i++)
            if (wt[i] <= room)
                best = Math.max(best, val[i] + bruteUnbounded(wt, val, room - wt[i], i));
        return best;
    }

    static int bruteSigns(int[] nums, int i, int sum, int target) {
        if (i == nums.length) return sum == target ? 1 : 0;
        return bruteSigns(nums, i + 1, sum + nums[i], target)
             + bruteSigns(nums, i + 1, sum - nums[i], target);
    }

    static int bruteBounded(int[] wt, int[] val, int[] cnt, int i, int room) {
        if (i == wt.length) return 0;
        int best = 0;
        for (int k = 0; k <= cnt[i] && k * wt[i] <= room; k++)  // k copies of item i
            best = Math.max(best, k * val[i] + bruteBounded(wt, val, cnt, i + 1, room - k * wt[i]));
        return best;
    }

    static int bounded(int[] wt, int[] val, int[] cnt, int W) {
        int[] dp = new int[W + 1];
        for (int i = 0; i < wt.length; i++) {
            int left = cnt[i];
            for (int p = 1; left > 0; p *= 2) {            // pieces 1, 2, 4, ... and a remainder
                int k = Math.min(p, left);
                left -= k;
                for (int w = W; w >= k * wt[i]; w--)
                    dp[w] = Math.max(dp[w], dp[w - k * wt[i]] + k * val[i]);
            }
        }
        return dp[W];
    }

    static int zeroOne(int[] wt, int[] val, int W) {
        int[] dp = new int[W + 1];
        for (int i = 0; i < wt.length; i++)
            for (int w = W; w >= wt[i]; w--)
                dp[w] = Math.max(dp[w], dp[w - wt[i]] + val[i]);
        return dp[W];
    }

    static int unbounded(int[] wt, int[] val, int W) {
        int[] dp = new int[W + 1];
        for (int i = 0; i < wt.length; i++)
            for (int w = wt[i]; w <= W; w++)
                dp[w] = Math.max(dp[w], dp[w - wt[i]] + val[i]);
        return dp[W];
    }

    static int targetSum(int[] nums, int target) {
        int total = Arrays.stream(nums).sum();
        if (Math.abs(target) > total || (total + target) % 2 != 0) return 0;
        int plus = (total + target) / 2;
        int[] ways = new int[plus + 1];
        ways[0] = 1;
        for (int x : nums)
            for (int s = plus; s >= x; s--)
                ways[s] += ways[s - x];
        return ways[plus];
    }

    public static void main(String[] args) {
        Random rnd = new Random(2024);
        int trials = 1000;
        for (int t = 0; t < trials; t++) {
            int n = 1 + rnd.nextInt(8), W = rnd.nextInt(20);
            int[] wt = new int[n], val = new int[n], nums = new int[n];
            for (int i = 0; i < n; i++) {
                wt[i] = 1 + rnd.nextInt(7);
                val[i] = rnd.nextInt(20);
                nums[i] = rnd.nextInt(4);                  // zeros on purpose
            }
            int[] cnt = new int[n];
            for (int i = 0; i < n; i++) cnt[i] = rnd.nextInt(6);
            int target = rnd.nextInt(13) - 6;
            same(bruteBounded(wt, val, cnt, 0, W), bounded(wt, val, cnt, W), "bounded", t);
            same(bruteZeroOne(wt, val, W), zeroOne(wt, val, W), "0/1", t);
            same(bruteUnbounded(wt, val, W, 0), unbounded(wt, val, W), "unbounded", t);
            same(bruteSigns(nums, 0, 0, target), targetSum(nums, target), "target sum", t);
        }
        System.out.println("random tests passed: " + trials);
    }

    static void same(int expected, int got, String what, int trial) {
        if (expected != got)
            throw new AssertionError(what + " failed on trial " + trial
                + ": expected " + expected + ", got " + got);
    }
}
```

```output
random tests passed: 1000
```

The inputs are deliberately small — at most eight items, capacity under 20, weights from 1 to 7 — so the brute forces finish instantly and the cases are varied: items that do not fit, capacity 0, zero values, zeros and negative targets in target sum. To check that the harness can actually catch a bug, change the 0/1 loop to run upward and run it again. It fails on the first trial:

```output
Exception in thread "main" java.lang.AssertionError: 0/1 failed on trial 0: expected 32, got 78
```

A checker that cannot fail proves nothing; trying one deliberate bug is a cheap way to make sure yours can.

## Recognising a knapsack in disguise

Problems rarely say "knapsack". Look for this shape: a collection of items, a **single numeric budget** that the chosen items consume (weight, cost, time, a target sum), an independent decision per item, and a question that asks for a best value, a yes/no, or a count. Then classify:

| Problem | Item | Weight | Value / question | Variant |
|---|---|---|---|---|
| Pack a bag | object | its weight | maximise value | 0/1 |
| Partition Equal Subset Sum | number | the number | reach `total / 2`? | 0/1, boolean |
| Target Sum | number | the number | count subsets with sum `P` | 0/1, count |
| Last Stone Weight II | stone | its weight | largest reachable sum `≤ total / 2` | 0/1, boolean |
| Ones and Zeroes | binary string | its count of 0s *and* 1s | maximise strings chosen | 0/1, two budgets |
| Coin Change (fewest coins) | coin type | its value | minimise count, exact amount | unbounded, min |
| Coin Change II | coin type | its value | count combinations | unbounded, count |
| Rod cutting | piece length | the length | maximise price | unbounded |

**Ones and Zeroes** is worth noting: when items consume *two* budgets, the state gains a dimension — `dp[i][zeros][ones]`, compressed to a 2D array with both capacity loops running downward.

Knapsack is the wrong model when the order of items matters to the cost (that is usually a sequence DP from [[a11-1d-dp]] or [[a11-2d-dp]]), when the capacity is too large to index, or when items interact so that the value of a set is not the sum of its items' values.

```quiz
Q: In the one-array 0/1 knapsack, what goes wrong if the capacity loop runs from `wt[i]` up to `W`?
- [ ] Some capacities are never updated, so the answer is too small
- [x] `dp[w - wt[i]]` may already include item `i`, so the item can be counted more than once
- [ ] The loop reads past the end of the array
- [ ] Nothing; the direction only affects speed
> The take branch must read the previous item round. Running upward, the cell to the left has already been updated in this round, so adding item i on top of it uses the item again. That is the unbounded knapsack, which is why the same loop is correct there.

Q: Target Sum has numbers with total 10 and target 4. What must `P`, the sum of the numbers given a `+` sign, be?
- [ ] 4
- [ ] 6
- [x] 7
- [ ] 3
> P − N = 4 and P + N = 10, so 2P = 14 and P = 7. Counting subsets with sum 7 counts the sign assignments. 3 is N, the sum of the minus group, which also works but is not what P means.

Q: Why is the O(n · W) knapsack algorithm called pseudo-polynomial?
- [ ] Because it is polynomial only when n is small
- [ ] Because it uses recursion
- [x] Because its time grows with the numeric value of W, which is exponential in the number of bits used to write W
- [ ] Because it only works for integer values
> Input size is measured in bits. Writing W takes about log2 W bits, so a table with W + 1 columns grows exponentially as that bit count grows. Integer weights are needed to index the table, but that is not what the term refers to.

Q: Coins `[1, 2]`, amount 3. A loop with amounts outside and coins inside returns 3. What is it counting?
- [ ] Combinations, so the answer for combinations is also 3
- [x] Ordered sequences: 1+1+1, 1+2 and 2+1
- [ ] Sequences of at most two coins
- [ ] Nothing meaningful; the loop is a bug
> With the amount outside, each amount sums over every possible last coin, so different orders are counted separately. The combinations are only {1,1,1} and {1,2}, which is 2 — the answer the coins-outside loop gives.
```

## In real systems

**Budgeted selection.** Choosing which projects to fund under a fixed budget, which features to fit into a release, or which advertisements to place in a slot of fixed length are 0/1 knapsacks. Real planning tools usually hand them to an integer-programming solver rather than a hand-written DP, because real instances have extra constraints (dependencies, several budgets). The DP is still the mental model, and for a single small budget it is often the fastest exact method.

**Test and job selection.** A continuous-integration system that has ten minutes to run tests and wants to maximise the estimated chance of catching a regression is solving a knapsack with test durations as weights. Time budgets in seconds are small integers, which suits the DP.

**Resource allocation with discrete units.** Allocating a fixed number of servers, licences or cache slots among services with different payoffs per unit is a bounded knapsack when each service has a maximum useful allocation.

**Cryptography's cautionary tale.** The Merkle–Hellman cryptosystem (1978) based its security on the hardness of subset sum. It was broken in the early 1980s because its keys produced special, easy instances. NP-hardness describes the worst case, not every instance — which is also why the pseudo-polynomial DP is so useful in practice.

## Trade-offs and alternatives

| Approach | Time | Space | Use when |
|---|---|---|---|
| Brute force over subsets | O(2ⁿ · n) | O(n) | `n` up to about 20, or as a test oracle |
| Memoized recursion on `(i, w)` | O(n · W) worst case, often less | O(n · W) memo + O(n) stack | The recursion is natural and few states are reachable |
| Table `dp[i][w]` | O(n · W) | O(n · W) | You need to recover the chosen items |
| One array `dp[w]` | O(n · W) | O(W) | You need only the value; `n` is large |
| DP over value (`minWeight[v]`) | O(n · Σ values) | O(Σ values) | Capacity is huge, values are small |
| Meet in the middle | O(2^(n/2) · n) | O(2^(n/2)) | `n` up to about 40, numbers huge |
| Greedy by ratio | O(n log n) | O(1) extra | Only the fractional problem; never 0/1 |

## Common mistakes

> [!MISTAKE] Using the wrong loop direction
> In the one-array form, a 0/1 problem with capacity running upward silently lets each item be used many times, and an unbounded problem with capacity running downward silently forbids reuse. Both produce plausible numbers. Decide from the take branch: should `dp[w - wt]` be from the previous item round (downward) or may it include the current item (upward)?

**Writing the recurrence without a state sentence.** "dp[w] is the knapsack thing for w" leads to wrong base cases. Write "the best value with weight at most `w` using the items processed so far" — and then the base row of zeros follows. Change "at most" to "exactly" and you know the base row must be "impossible" except at 0.

**Greedy by value per weight for whole items.** It is optimal only for the fractional version. The 10/20/30 example above is the standard counterexample to have ready.

**Forgetting the early checks.** Partition with an odd total, target sum with `(total + target)` odd or `|target| > total`: skipping these produces a negative or fractional "capacity" and an exception or a wrong answer.

**Unsafe sentinels.** Filling with `Integer.MIN_VALUE` or `Integer.MAX_VALUE` and then adding to them wraps around in Java without any error. Use half of the extreme, or check reachability before adding.

**Overflow in counts.** The number of subsets or coin combinations grows exponentially with the input. Use `long`, or reduce modulo the number the problem specifies.

**Zero-weight items.** In a 0/1 knapsack they are harmless with the downward loop — the item is added once. In an unbounded knapsack a zero-weight item with positive value makes the answer infinite, and the code will quietly report a finite number. Filter or reject such inputs explicitly.

## Interview perspective

Interviewers use knapsack to see whether you can derive a DP rather than recite one. A strong answer starts from the take-or-skip recursion, names what the future depends on (remaining capacity), and only then writes the table.

> [!INTERVIEW] Explaining the loop direction
> "The 2D recurrence reads `dp[i-1][w - wt]`, the row before this item. When I squeeze it into one array, cells to the left of `w` must still hold that older row, so I loop `w` from `W` down. If items could be reused, the recurrence would read the current row instead, and the upward loop would be exactly right."

Questions to be ready for:

- **Why is knapsack DP not polynomial?** Its running time is proportional to the value of `W`, which is exponential in the number of bits used to write `W`. That is pseudo-polynomial.
- **Partition Equal Subset Sum.** Odd total → false; otherwise subset sum to `total / 2`, boolean array, downward loop.
- **Target Sum.** Derive `P = (total + target) / 2`; count subsets with sum `P`; mention zeros double the count.
- **Coin Change II versus Combination Sum IV.** Coins outer counts combinations; amount outer counts ordered sequences. Explain why from the 2D state.
- **Return the chosen items.** Keep the 2D table (or a decision bitset) and walk back from `(n, W)`.
- **What if `W` is 10⁹?** The DP over capacity is infeasible; consider DP over value if values are small, or meet in the middle if `n` is about 40.
- **Partition into `k` equal subsets.** The single-budget DP no longer suffices because `k` bins must be tracked; for small `n` use backtracking with pruning or a bitmask DP over which items are used ([[a11-bitmask-dp]]).

## Practice

Work through these in order. For each, write the five decisions in words first, then a brute force, then the DP, and compare them on random small inputs.

1. **0/1 knapsack with reconstruction.** Return both the best value and the list of chosen items, then rewrite it with one value array plus a `boolean[n][W + 1]` decision table.
2. **Partition Equal Subset Sum.** Then solve **Last Stone Weight II**: smash stones pairwise; the answer is the smallest possible difference between two groups.
3. **Target Sum.** Write both the algebraic reduction and a memoized solution on `(index, running sum)`, and compare their state counts.
4. **Coin Change II.** Then change one line to count ordered sequences, and explain why the answers differ for coins `[1, 2]` and amount 3.
5. **Ones and Zeroes.** A 0/1 knapsack with two capacities; decide the loop directions for both.
6. **Bounded knapsack.** Implement binary splitting and verify it against the "try every count" brute force.

The DSA explorer lists the matching problems under this topic; start with *Partition Equal Subset Sum*, *Target Sum*, *Coin Change II* and *Last Stone Weight II*.

## Quick revision {#quick-revision}

- Knapsack shape: items, one numeric budget they consume, a decision per item, and a best value, yes/no or count.
- State: `dp[i][w]` = best value using the first `i` items with weight at most `w`. Base `dp[0][w] = 0`. Answer `dp[n][W]`.
- 0/1 recurrence: `max(dp[i-1][w], val + dp[i-1][w - wt])`. Unbounded: take branch reads `dp[i][w - wt]`.
- One array: 0/1 loops `w` from `W` down to `wt`; unbounded loops `w` from `wt` up to `W`.
- Time O(n · W) — pseudo-polynomial; space O(n · W) table or O(W) array (array cannot recover choices).
- Greedy by value/weight is optimal only for fractional knapsack.
- Subset sum: boolean `can[s]`, base `can[0] = true`. Partition: odd total → false, else target `total / 2`.
- Target sum: `P = (total + target) / 2`; count subsets with sum `P`; zeros double the count.
- Counting: replace `max` with `+`, base `ways[0] = 1`. Coins outer = combinations; amount outer = sequences.
- Exactly `W`: base `dp[0] = 0`, others "impossible" (`MIN_VALUE / 2`); at most `W`: all zeros.
- Bounded copies: binary splitting into pieces `1, 2, 4, …, remainder`, each a 0/1 item.

## Key takeaways {#key-takeaways}

- Knapsack is fast because the future depends only on the remaining capacity, not on which items produced it, so `2ⁿ` histories collapse into `(n + 1)(W + 1)` states.
- Derive the recurrence from the decision about one item: skip it, or take it and solve the rest with less room.
- In the one-array form, the capacity loop's direction decides whether an item can be reused; derive it from which row the take branch should read.
- The base row encodes the question: zeros everywhere for "at most", "impossible" except at 0 for "exactly", and `ways[0] = 1` for counting.
- Many problems that never mention a bag — partition, target sum, coin change counts — are knapsacks once you identify the item, the budget and the question.
- The DP is pseudo-polynomial; when the capacity is huge, change the state or the technique instead of the code.
