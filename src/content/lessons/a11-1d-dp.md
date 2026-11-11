---
summary: One-dimensional DP solves problems whose subproblems are named by a single number — a prefix length, a position, or an amount. You will derive House Robber, Decode Ways, Coin Change and Word Break from their brute-force recursions, learn the four common shapes of a one-index state, and reduce the memory to a couple of variables where the recurrence allows it.
difficulty: intermediate
minutes: 55
objectives:
  - Choose a one-index state (prefix, ending at i, suffix or amount) and state its meaning in one sentence
  - Derive the recurrence, base cases and order for House Robber, Decode Ways, Coin Change and Word Break from a brute force
  - Trace a 1D DP table by hand and reconstruct the choices behind its answer
  - Reduce O(n) memory to O(1) with rolling variables, and explain when that is not possible
  - Handle circular inputs, invalid transitions and "impossible" states without overflow
---

## Introduction

A street has five houses with `2, 7, 9, 3, 1` thousand in cash. A burglar wants as much as possible, but the houses have connected alarms: robbing two neighbours triggers them. Which houses should be robbed?

Robbing every other house starting with the first gives `2 + 9 + 1 = 12`. Starting with the second gives `7 + 3 = 10`. Taking the biggest house (9) and then the biggest compatible one (2, then 1) also gives 12, but that greedy rule fails on `[5, 9, 5]`, where the best is 10 from the two outer houses. To be sure, you have to weigh each house against what taking it rules out, and with `n` houses there are about 1.6ⁿ valid choices of houses.

Yet the problem has a simple structure. Walk along the street from left to right. When you reach house `i`, the only thing that matters about the past is the best you could do with the houses before it — not *which* houses produced that amount. So one number per position is enough to summarise the past. That is a **one-dimensional dynamic programme (1D DP)**: a table `dp[i]` with one entry per position, each computed from a few earlier entries.

Many classic problems have this shape: climbing stairs, decoding a digit string, making change with the fewest coins, splitting a string into dictionary words, maximum subarray sums. They are the best place to practise deriving DPs, because there is only one index to get right. This lesson takes four of them from brute force to an efficient solution, and on the way builds the habits every later DP lesson relies on.

## Before you start

- **The five decisions of a DP** — [[a11-memoization]]. That lesson shows how to turn a recursion into a DP by fixing (1) the state, as a sentence; (2) the recurrence, from one decision; (3) the base cases; (4) the order of computation; (5) where the answer lives. This lesson applies them repeatedly.
- **Bottom-up tables and rolling variables** — [[a11-tabulation]].
- **Recursion** — [[a1-recursion]], for the brute forces that each derivation starts from.
- **Arrays and strings in Java** — indexing, `charAt` and `substring`. See [[a2-array-string-traversal]].

## The intuition: answers along a line

Imagine writing the answer to a smaller version of the problem under each position of the input: under house 3, "the best haul from the first three houses"; under digit 4, "the number of ways to decode the first four digits". If each of those numbers can be worked out from the few numbers immediately before it, you can fill the whole row from left to right in one pass, and the last number is the answer.

The hard part is never the loop. It is choosing **what number to write under each position** — the state — so that it really can be computed from earlier numbers alone. If the number you choose leaves out something the future needs, the recurrence will be wrong; if it includes more than needed, the table becomes two-dimensional for no reason.

## Four shapes of a one-index state

Most 1D DPs use one of four kinds of index. Recognising which one a problem wants is the first decision.

| Shape | `dp[i]` means | Typical recurrence reads | Examples |
|---|---|---|---|
| **Prefix** | Answer for the first `i` elements | `dp[i − 1]`, `dp[i − 2]`, or every `dp[j]` with `j < i` | House Robber, Decode Ways, Word Break, Climbing Stairs |
| **Ending at `i`** | Best answer among solutions whose last element is `i` | `dp[i − 1]`, or every `dp[j]` with `j < i` | Maximum subarray (Kadane), Longest Increasing Subsequence |
| **Suffix** | Answer for elements `i` to `n − 1` | `dp[i + 1]`, `dp[i + 2]` | Jump games, "from here to the end" problems |
| **Amount / value** | Answer for a total of exactly `a` | `dp[a − c]` for each option `c` | Coin Change, Perfect Squares, Combination Sum IV |

Prefix and suffix states are mirror images; pick whichever makes the recurrence read more naturally. **Ending at `i`** states differ in an important way: the answer to the whole problem is not `dp[n]` but the best over all `dp[i]`, because the optimal solution can end anywhere. **Amount** states index by a value rather than a position, which is why their table size depends on the target, not the input length.

Throughout this lesson, prefix states use **prefix length**: `dp[i]` covers the first `i` elements, so the table has `n + 1` entries and `dp[0]` is the empty prefix. The element that prefix `i` adds is `nums[i − 1]`. This costs a `− 1` in the code but buys a natural base case — the empty input — and removes the special cases for indices like `-1`.

## Warm-up: Climbing Stairs

You can climb 1 or 2 steps at a time. How many distinct sequences of moves reach step `n`? Applying the five decisions:

- **State:** `dp[i]` = the number of ways to reach step `i`.
- **Recurrence:** look at the **last move**. It was either a 1-step from step `i − 1` or a 2-step from step `i − 2`, and these two groups do not overlap, so `dp[i] = dp[i − 1] + dp[i − 2]`.
- **Base cases:** `dp[0] = 1` (one way to be at the bottom: make no moves) and `dp[1] = 1`.
- **Order:** increasing `i`. **Answer:** `dp[n]`.

The values run 1, 1, 2, 3, 5, 8, … — the Fibonacci sequence. Notice the reasoning pattern, because every derivation below repeats it: **classify the solutions by their last decision, make sure the classes do not overlap and cover everything, and express each class through a smaller state**. For counting you add the classes; for optimising you take the best class.

## House Robber: deriving a 1D DP from scratch

Return to the burglar: given non-negative amounts `nums`, choose houses with no two adjacent to maximise the total.

### Step 1: brute force from the last house

Consider the last house among the first `i`. Either it is not robbed, and the best is whatever the first `i − 1` houses give; or it is robbed, which forbids house `i − 2` (zero-based), so the rest must come from the first `i − 2` houses.

```java title="HouseRobber.java"
import java.util.ArrayList;
import java.util.List;

public class HouseRobber {
    static long calls = 0;

    // Brute force: decide about the last house of the first i, then recurse
    static int brute(int[] nums, int i) {
        calls++;
        if (i <= 0) return 0;                              // no houses
        int skip = brute(nums, i - 1);
        int take = nums[i - 1] + brute(nums, i - 2);       // neighbour i-2 is off limits
        return Math.max(skip, take);
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 9, 3, 1};
        int n = nums.length;
        int[] dp = new int[n + 1];                         // dp[i] = best from the first i houses
        dp[0] = 0;
        dp[1] = nums[0];
        for (int i = 2; i <= n; i++)
            dp[i] = Math.max(dp[i - 1], nums[i - 1] + dp[i - 2]);
        System.out.println("dp = " + java.util.Arrays.toString(dp));

        // Walk back: if dp[i] == dp[i-1], house i-1 was not needed
        List<Integer> robbed = new ArrayList<>();
        for (int i = n; i >= 1; ) {
            if (dp[i] == dp[i - 1]) i -= 1;
            else { robbed.add(i - 1); i -= 2; }
        }
        System.out.println("best = " + dp[n] + ", houses " + robbed.reversed());

        for (int size : new int[] {10, 20, 30}) {
            calls = 0;
            brute(new int[size], size);
            System.out.println("brute force, " + size + " houses: " + calls + " calls");
        }
    }
}
```

```output
dp = [0, 2, 7, 11, 11, 12]
best = 12, houses [0, 2, 4]
brute force, 10 houses: 287 calls
brute force, 20 houses: 35421 calls
brute force, 30 houses: 4356617 calls
```

The brute force makes two calls per call, on `i − 1` and `i − 2` — the same shape as naive Fibonacci — so its call count grows by a factor of about 1.6 per house: four million calls for thirty houses. Yet its only argument is `i`, which takes only `n + 1` values. The rest of the program is the DP derived from it.

### Step 2: the state

> `dp[i]` = the largest total obtainable from the first `i` houses (houses `0` to `i − 1`), robbing no two adjacent houses.

Note what the state does *not* say: whether house `i − 1` was robbed. The recurrence does not need to know, because the "take" option jumps straight to `dp[i − 2]`, which by definition never touches house `i − 2`'s neighbour `i − 1`. If you defined the state differently — say, "best total with house `i − 1` robbed" — you would need a second array for "not robbed". That also works (it is the [[a11-state-machine-dp]] view of this problem) but is more than needed.

### Step 3: the recurrence

```text
dp[i] = max( dp[i − 1],  nums[i − 1] + dp[i − 2] )
```

The two options split all valid choices for the first `i` houses into those that skip house `i − 1` and those that rob it; every choice is in exactly one group, and the best of each group is the expression shown. That is why taking the maximum is correct — this is optimal substructure in concrete form.

### Step 4: base cases

`dp[0] = 0`: no houses, no money. `dp[1] = nums[0]`: with one house, rob it (amounts are non-negative). The recurrence needs two earlier values, so it starts at `i = 2`. An equally valid alternative is to define `dp[−1] = 0` implicitly, which the rolling version below does.

### Step 5: order and answer

`dp[i]` reads `i − 1` and `i − 2`, so fill in increasing `i`. The answer is `dp[n]`. There are `n + 1` states and each takes constant work: **O(n) time and O(n) space**.

### Dry run

On `[2, 7, 9, 3, 1]`:

| `i` | House added `nums[i − 1]` | Skip: `dp[i − 1]` | Take: `nums[i − 1] + dp[i − 2]` | `dp[i]` |
|---|---|---|---|---|
| 0 | — | — | — | 0 |
| 1 | 2 | — | — | 2 |
| 2 | 7 | 2 | 7 + 0 = 7 | 7 |
| 3 | 9 | 7 | 9 + 2 = 11 | 11 |
| 4 | 3 | 11 | 3 + 7 = 10 | 11 |
| 5 | 1 | 11 | 1 + 11 = 12 | 12 |

Row 4 is the interesting one: house 3 holds 3, and taking it would mean giving up house 2's 9, so the best for four houses stays at 11. Row 5 then takes the last house on top of that 11.

**Reconstruction.** The program walks backwards. At `i = 5`, `dp[5] = 12 ≠ dp[4] = 11`, so skipping the last house cannot achieve 12 and house 4 was robbed; jump to `i = 3`. `dp[3] = 11 ≠ dp[2] = 7`: house 2 was robbed; jump to `i = 1`. `dp[1] = 2 ≠ dp[0] = 0`: house 0 was robbed. Result `[0, 2, 4]`, totalling 12. The jump of two after a "take" mirrors the recurrence: robbing house `i − 1` means the rest came from `dp[i − 2]`.

### Rolling to two variables

`dp[i]` reads only the two previous entries, so two variables suffice. The function below also takes a range, which the next problem needs:

```java title="RobberRolling.java"
public class RobberRolling {

    // Best total from houses lo..hi (inclusive) with no two adjacent
    static int robRange(int[] nums, int lo, int hi) {
        int prev2 = 0, prev1 = 0;                          // dp[i-2], dp[i-1]
        for (int i = lo; i <= hi; i++) {
            int cur = Math.max(prev1, nums[i] + prev2);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }

    static int rob(int[] nums) {
        return robRange(nums, 0, nums.length - 1);
    }

    // Houses in a circle: the first and last are neighbours, so at most one of them is used
    static int robCircle(int[] nums) {
        int n = nums.length;
        if (n == 1) return nums[0];                        // both ranges below would be empty
        return Math.max(robRange(nums, 0, n - 2), robRange(nums, 1, n - 1));
    }

    public static void main(String[] args) {
        System.out.println(rob(new int[] {2, 7, 9, 3, 1}));
        System.out.println(robCircle(new int[] {2, 3, 2}));
        System.out.println(robCircle(new int[] {1, 2, 3, 1}));
        System.out.println(robCircle(new int[] {5}));
    }
}
```

```output
12
3
4
5
```

Starting both variables at 0 handles the first house without a special case: for the first house, `prev2` plays the role of `dp[−1] = 0` and `prev1` of `dp[0] = 0`, so `cur = max(0, nums[lo])`. Space is now O(1). The order of the two assignments after computing `cur` matters — `prev2` must receive the old `prev1` before `prev1` is overwritten.

## Houses in a circle: breaking a cycle by cases

In **House Robber II** the houses stand in a circle, so the first and last houses are neighbours. The linear recurrence no longer applies directly: whether you may rob the last house depends on a decision made at the very start, which a left-to-right state does not remember.

Rather than enlarging the state, split the problem. Any valid choice either does not rob house 0 or does not rob house `n − 1` (it cannot rob both). So the answer is the better of two linear problems: houses `0` to `n − 2`, and houses `1` to `n − 1`. Each is an ordinary House Robber. The two cases overlap (choices that rob neither end appear in both), but for a maximum that is harmless; only for *counting* would overlapping cases need care.

In the output above, `[2, 3, 2]` gives 3 because the two 2s are neighbours around the circle; `[1, 2, 3, 1]` gives 4 from houses 0 and 2. The single-house case needs its own line, because removing one end from a one-element array leaves nothing.

> [!TIP] Breaking a circle
> When a 1D problem becomes circular, look for a decision about one fixed element that makes the rest linear: "element 0 excluded" versus "element `n − 1` excluded", or "element 0 used" versus "not used". Solve each linear case and combine.

## Decode Ways: when the base case carries the logic

A message of letters was encoded as digits with `A = 1`, `B = 2`, …, `Z = 26`. Given the digit string, how many letter strings could it have come from? `"226"` could be `BZ` (2, 26), `VF` (22, 6) or `BBF` (2, 2, 6): three ways.

**Brute force.** Read the string from the start; the next letter uses either one digit (1–9; `0` is not a letter) or two digits (10–26), then recurse on the rest. The calls overlap exactly as in Fibonacci: after `"11"` and after `"1", "1"`, the same suffix is decoded twice.

**State.** The recursion's only argument is how much of the string has been consumed, so use the prefix form:

> `dp[i]` = the number of ways to decode the first `i` characters.

**Recurrence.** Classify decodings of the first `i` characters by their **last letter**. It used either the last digit alone — allowed if that digit is not `0` — leaving the first `i − 1` characters to decode in `dp[i − 1]` ways; or the last two digits — allowed if they form a number from 10 to 26 — leaving `dp[i − 2]` ways. The classes are disjoint (the last letter has one length or the other), so add them:

```text
dp[i] = (s[i−1] != '0' ? dp[i − 1] : 0) + (10 ≤ s[i−2..i−1] ≤ 26 ? dp[i − 2] : 0)
```

**Base case.** `dp[0] = 1`. This is the decision people find strange, so it deserves a reason rather than a rule. `dp[0]` counts the ways to decode the empty string, and there is exactly one: produce the empty message. Without it, `"12"` would get `dp[2] = dp[1] + dp[0] = 1 + 0 = 1`, missing the decoding `L`. A good check for any counting base case is to verify the first one or two states by hand.

```java title="DecodeWays.java"
public class DecodeWays {

    // dp[i] = number of ways to decode the first i characters
    static int numDecodings(String s) {
        int n = s.length();
        int[] dp = new int[n + 1];
        dp[0] = 1;                                         // the empty prefix: one way (decode nothing)
        for (int i = 1; i <= n; i++) {
            char last = s.charAt(i - 1);
            if (last != '0') dp[i] += dp[i - 1];           // last letter uses one digit, 1-9
            if (i >= 2) {
                int two = (s.charAt(i - 2) - '0') * 10 + (last - '0');
                if (two >= 10 && two <= 26) dp[i] += dp[i - 2];  // last letter uses two digits
            }
        }
        return dp[n];
    }

    public static void main(String[] args) {
        for (String s : new String[] {"12", "226", "11106", "06", "2101", "1111111111"})
            System.out.println(s + " -> " + numDecodings(s));
    }
}
```

```output
12 -> 2
226 -> 3
11106 -> 2
06 -> 0
2101 -> 1
1111111111 -> 89
```

Trace `"11106"`:

| `i` | Last digit | One-digit option | Last two digits | Two-digit option | `dp[i]` |
|---|---|---|---|---|---|
| 0 | — | — | — | — | 1 |
| 1 | `1` | `dp[0]` = 1 | — | — | 1 |
| 2 | `1` | `dp[1]` = 1 | `11` | `dp[0]` = 1 | 2 |
| 3 | `1` | `dp[2]` = 2 | `11` | `dp[1]` = 1 | 3 |
| 4 | `0` | not allowed | `10` | `dp[2]` = 2 | 2 |
| 5 | `6` | `dp[4]` = 2 | `06` | not allowed (< 10) | 2 |

The zero does all the interesting work. At `i = 4` it cannot stand alone, so it must pair with the `1` before it, which forces that `1` out of any other pairing. `"06"` gives 0 because neither `0` alone nor `06` is a letter. A string of ten `1`s gives 89, the eleventh Fibonacci number, because with no zeros and every pair valid, the recurrence is exactly Fibonacci's.

The two-digit check is `10 ≤ two ≤ 26`, not `two ≤ 26`: the lower bound rejects pairs starting with `0`, such as `06`. Forgetting it makes `"06"` decode in one way.

## Coin Change: a state indexed by amount

Given coin denominations and an amount, find the **fewest coins** that add up to it exactly, with unlimited coins of each kind, or report `-1` if it cannot be done. With coins `{1, 3, 4}` and amount 6, taking the largest coin first gives `4 + 1 + 1` (three coins), but `3 + 3` uses two. Greedy works for some coin systems (including the euro and US coins) but not in general, so we derive a DP.

**Brute force.** To pay `a`, choose the last coin `c` (any coin no larger than `a`) and pay `a − c` as cheaply as possible. The argument is the remaining amount, and the same remaining amounts are reached by many different coin orders — `6 − 1 − 3` and `6 − 3 − 1` both leave 2.

**State.** This time the index is not a position in the input; it is a value:

> `dp[a]` = the fewest coins whose values sum to exactly `a`, or "infinity" if no combination does.

**Recurrence.** Classify by the last coin: `dp[a] = 1 + min over coins c ≤ a of dp[a − c]`.

**Base cases.** `dp[0] = 0` — zero coins pay nothing. Every other entry starts at **infinity**, meaning "not reachable yet". This matters: if unfilled entries started at Java's default 0, an unreachable amount would look free.

**Order and answer.** `dp[a]` reads smaller amounts, so fill `a = 1, 2, …, amount`. The answer is `dp[amount]`, translated to `-1` if it is still infinity. There are `amount + 1` states, each trying every coin: **O(amount × number of coins) time, O(amount) space**.

```java title="CoinChange.java"
import java.util.Arrays;

public class CoinChange {
    static final int INF = Integer.MAX_VALUE / 2;          // "unreachable"; INF + 1 cannot overflow

    // dp[a] = fewest coins that sum to exactly a, or INF if impossible
    static int[] table(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, INF);
        dp[0] = 0;                                         // zero coins make amount 0
        for (int a = 1; a <= amount; a++)
            for (int c : coins)
                if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);  // c is the last coin
        return dp;
    }

    static int coinChange(int[] coins, int amount) {
        int best = table(coins, amount)[amount];
        return best >= INF ? -1 : best;
    }

    static int greedy(int[] coins, int amount) {           // largest coin first
        int[] sorted = coins.clone();
        Arrays.sort(sorted);
        int count = 0;
        for (int i = sorted.length - 1; i >= 0; i--) {
            count += amount / sorted[i];
            amount %= sorted[i];
        }
        return amount == 0 ? count : -1;
    }

    public static void main(String[] args) {
        System.out.println(coinChange(new int[] {1, 2, 5}, 11));
        System.out.println(coinChange(new int[] {2}, 3));
        System.out.println(coinChange(new int[] {1}, 0));
        int[] coins = {1, 3, 4};
        System.out.println("dp for {1, 3, 4} = " + Arrays.toString(table(coins, 6)));
        System.out.println("greedy " + greedy(coins, 6) + " vs dp " + coinChange(coins, 6));
    }
}
```

```output
3
-1
0
dp for {1, 3, 4} = [0, 1, 2, 1, 1, 2, 2]
greedy 3 vs dp 2
```

Eleven with `{1, 2, 5}` takes three coins (5 + 5 + 1); 3 cannot be made from 2s; amount 0 needs no coins. The table for `{1, 3, 4}`, built by hand:

| `a` | Last coin 1: `dp[a−1] + 1` | Last coin 3: `dp[a−3] + 1` | Last coin 4: `dp[a−4] + 1` | `dp[a]` |
|---|---|---|---|---|
| 1 | 0 + 1 = 1 | — | — | 1 |
| 2 | 1 + 1 = 2 | — | — | 2 |
| 3 | 2 + 1 = 3 | 0 + 1 = 1 | — | 1 |
| 4 | 1 + 1 = 2 | 1 + 1 = 2 | 0 + 1 = 1 | 1 |
| 5 | 1 + 1 = 2 | 2 + 1 = 3 | 1 + 1 = 2 | 2 |
| 6 | 2 + 1 = 3 | 1 + 1 = 2 | 2 + 1 = 3 | 2 |

At `a = 6` the "last coin 4" option (greedy's choice) leaves 2, which costs two more coins; "last coin 3" leaves 3, which costs one. The DP compares both instead of committing.

> [!WARNING] Infinity plus one
> Using `Integer.MAX_VALUE` as infinity makes `dp[a - c] + 1` overflow to `Integer.MIN_VALUE`, which then wins every `min` and produces a negative answer with no error. Use `Integer.MAX_VALUE / 2` (or `amount + 1`, which is larger than any real answer since the smallest coin is at least 1), and translate it back at the end.

Coin Change is an **unbounded knapsack** — each coin is an item that can be reused — that minimises a count instead of maximising a value. Its counting sibling, Coin Change II, and the reason loop order changes what is counted, are developed in [[a11-knapsack]].

## When a transition reads many states: Word Break

So far each state read a fixed number of earlier states. Some 1D DPs read *all* of them. **Word Break** asks whether a string can be split into a sequence of dictionary words: `"leetcode"` with `{"leet", "code"}` can; `"catsandog"` with `{"cats", "dog", "sand", "and", "cat"}` cannot.

**State:** `ok[i]` = the first `i` characters can be split into dictionary words. **Recurrence:** classify splits by their **last word**, which is `s[j..i−1]` for some `j < i`: `ok[i]` is true if some `j` has `ok[j]` true and `s[j..i−1]` in the dictionary. **Base:** `ok[0] = true` — the empty prefix is split into zero words, the same reasoning as Decode Ways' `dp[0] = 1`. **Order:** increasing `i`. **Answer:** `ok[n]`.

```java title="WordBreak.java"
import java.util.List;
import java.util.Set;

public class WordBreak {

    // ok[i] = the first i characters can be split into dictionary words
    static boolean wordBreak(String s, List<String> words) {
        Set<String> dict = Set.copyOf(words);
        int n = s.length();
        boolean[] ok = new boolean[n + 1];
        ok[0] = true;                                      // the empty prefix needs no words
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i && !ok[i]; j++) {        // last word is s[j..i-1]
                if (ok[j] && dict.contains(s.substring(j, i))) ok[i] = true;
            }
        }
        return ok[n];
    }

    public static void main(String[] args) {
        System.out.println(wordBreak("leetcode", List.of("leet", "code")));
        System.out.println(wordBreak("applepenapple", List.of("apple", "pen")));
        System.out.println(wordBreak("catsandog", List.of("cats", "dog", "sand", "and", "cat")));
    }
}
```

```output
true
true
false
```

The complexity formula — states × work per state — now has a non-constant second factor. There are `n + 1` states, each tries up to `i` split points, and each try builds and hashes a substring of length up to `n`, so the worst case is **O(n³)** time. If the longest dictionary word has length `L`, only `j ≥ i − L` can work, which cuts it to O(n · L²). For `"catsandog"`, `ok` becomes true at 3 (`cat`), 4 (`cats`) and 7 (`sand` after `cat`, or `and` after `cats`). The only dictionary word that could end the string is `dog`, which would need `ok[6]`, and no split reaches position 6; from the reachable position 7 the remainder `og` is not a word. So the answer is false.

Longest Increasing Subsequence has the same shape with an "ending at `i`" state: `dp[i] = 1 + max dp[j]` over earlier `j` with a smaller value, O(n²) in total. [[a11-lis]] derives it and then speeds it up to O(n log n).

## "Ending at i" states: when the answer is a maximum over the table

Maximum subarray sum (Kadane's algorithm) is the standard example of the second shape. A prefix state "best subarray sum within the first `i` elements" does not have a clean recurrence, because extending a subarray requires knowing that it *touches* the end. The fix is to require it: `best[i]` = the largest sum of a subarray that **ends exactly at** index `i`. Then `best[i] = max(nums[i], best[i − 1] + nums[i])` — either start fresh at `i` or extend the best subarray ending at `i − 1`. Because the optimal subarray can end anywhere, the answer is the maximum of all `best[i]`, not the last entry. [[a2-kadane]] develops this in full.

The general lesson: **if extending a solution needs a fact about its end, put that fact in the state** by making the state "ending at `i`".

## Checking against brute force

Each problem above has a brute force that is too slow for real inputs but easy to trust: try every subset of houses, every way to split the digits, every sequence of coins. This harness compares them with the DP versions from `RobberRolling`, `DecodeWays` and `CoinChange` on 1,000 random inputs. It is compiled together with those three classes, which it calls.

```java title="OneDCheck.java"
import java.util.Random;

public class OneDCheck {

    // Brute forces: try every subset / every split / every coin sequence
    static int bruteRob(int[] nums, boolean circle) {
        int n = nums.length, best = 0;
        for (int mask = 0; mask < (1 << n); mask++) {
            if ((mask & (mask >> 1)) != 0) continue;       // two neighbours chosen
            if (circle && n > 1 && (mask & 1) != 0 && (mask >> (n - 1) & 1) != 0) continue;
            int sum = 0;
            for (int i = 0; i < n; i++) if ((mask >> i & 1) == 1) sum += nums[i];
            best = Math.max(best, sum);
        }
        return best;
    }

    static int bruteDecode(String s, int from) {
        if (from == s.length()) return 1;
        int ways = 0;
        if (s.charAt(from) != '0') {
            ways += bruteDecode(s, from + 1);
            if (from + 2 <= s.length() && Integer.parseInt(s.substring(from, from + 2)) <= 26)
                ways += bruteDecode(s, from + 2);
        }
        return ways;
    }

    static int bruteCoins(int[] coins, int amount) {       // fewest coins, or -1
        if (amount == 0) return 0;
        int best = -1;
        for (int c : coins) {
            if (c > amount) continue;
            int rest = bruteCoins(coins, amount - c);
            if (rest >= 0 && (best < 0 || rest + 1 < best)) best = rest + 1;
        }
        return best;
    }

    public static void main(String[] args) {
        Random rnd = new Random(11);
        int trials = 1000;
        for (int t = 0; t < trials; t++) {
            int n = 1 + rnd.nextInt(12);
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) nums[i] = rnd.nextInt(50);
            check(bruteRob(nums, false), RobberRolling.rob(nums), "rob", t);
            check(bruteRob(nums, true), RobberRolling.robCircle(nums), "circle", t);

            StringBuilder sb = new StringBuilder();
            int len = 1 + rnd.nextInt(10);
            for (int i = 0; i < len; i++) sb.append((char) ('0' + rnd.nextInt(4)));  // many 0s, 1s, 2s
            String s = sb.toString();
            check(bruteDecode(s, 0), DecodeWays.numDecodings(s), "decode " + s, t);

            int k = 1 + rnd.nextInt(3);
            int[] coins = new int[k];
            for (int i = 0; i < k; i++) coins[i] = 1 + rnd.nextInt(9);
            int amount = rnd.nextInt(25);
            check(bruteCoins(coins, amount), CoinChange.coinChange(coins, amount), "coins", t);
        }
        System.out.println("random tests passed: " + trials);
    }

    static void check(int expected, int got, String what, int trial) {
        if (expected != got)
            throw new AssertionError(what + " failed on trial " + trial
                + ": expected " + expected + ", got " + got);
    }
}
```

```output
random tests passed: 1000
```

The random inputs are shaped to hit edge cases: digit strings use only `0`–`3`, so zeros and the 10–26 boundary appear constantly; arrays can have one element, which exercises the circular special case; coin sets can make some amounts impossible, which exercises the infinity handling. The brute force for the robber uses a bitmask over houses ([[a13-bitmasking]]) and rejects masks with two adjacent bits with `mask & (mask >> 1)`.

## How it works internally

The subproblem graph of a 1D DP is a set of points on a line, with arrows pointing back to earlier points. For House Robber each point has two arrows (to `i − 1` and `i − 2`); for Coin Change, one per coin; for Word Break, up to `i`. The cost is the total number of arrows: O(n), O(amount × coins) and O(n²) respectively, times the cost of evaluating each arrow.

Memory follows the arrows' **reach**. If every arrow from `i` reaches at most `k` steps back, only the last `k` values need to be stored, so the table rolls into `k` variables or a small circular buffer: two for House Robber and Decode Ways. If arrows can reach arbitrarily far back — Coin Change with large coins, Word Break, LIS — the whole table must stay.

The one-pass, left-to-right access pattern is also why tabulated 1D DPs are fast in practice. Reads of `dp[i − 1]` and `dp[i − 2]` hit memory that was written moments earlier and is still in the CPU cache, and there is no call overhead. A memoized recursion computes the same states but through a call chain as deep as `n`, which in Java risks a `StackOverflowError` for inputs in the tens of thousands (see [[a11-memoization]]).

## Recognising a 1D DP

The signals are:

- The input is a sequence (array, string, staircase, days) or a single target number.
- The question asks for a maximum, minimum, count, or yes/no — not for a list of all solutions.
- A decision made at one position constrains only nearby positions (no two adjacent, a letter uses one or two digits), or the remaining problem is described entirely by "how much is left".
- The brute force has **one** changing argument.

When the brute force has two changing arguments that cannot be merged — two strings, a position plus a remaining budget, a position plus "holding a stock or not" — the state needs a second dimension ([[a11-2d-dp]], [[a11-knapsack]], [[a11-state-machine-dp]]). When the decisions constrain far-away positions in complicated ways, DP may not apply at all.

```quiz
Q: In Decode Ways, why is `dp[0] = 1` rather than 0?
- [ ] Because Java arrays start at index 1
- [x] Because the empty prefix has exactly one decoding (the empty message), and two-digit letters at the start need it
- [ ] Because every non-empty string has at least one decoding
- [ ] It is an arbitrary convention that does not affect results
> dp[2] for "12" adds dp[0] for the decoding that uses "12" as one letter. With dp[0] = 0 that decoding would be lost and the answer would be 1 instead of 2. Not every string has a decoding — "06" has none.

Q: Coin Change uses `dp[a] = min(dp[a], dp[a - c] + 1)`. What happens if unreachable entries are initialised to `Integer.MAX_VALUE`?
- [ ] Nothing; MAX_VALUE is the correct infinity
- [ ] The answer becomes 0 for impossible amounts
- [x] `MAX_VALUE + 1` overflows to a large negative number, which wins the `min` and corrupts later entries
- [ ] Java throws an ArithmeticException
> Java int addition wraps silently. An unreachable dp[a - c] plus one becomes Integer.MIN_VALUE, and min picks it. Use MAX_VALUE / 2 or amount + 1 as infinity.

Q: For House Robber II (houses in a circle), why is the answer `max(rob(0..n-2), rob(1..n-1))`?
- [ ] Because the best solution always skips both end houses
- [x] Because no valid choice robs both ends, so every valid choice lies in at least one of the two linear ranges
- [ ] Because the circular problem has twice as many houses
- [ ] Because rob(0..n-1) counts the middle houses twice
> Excluding house n-1 or excluding house 0 covers every legal choice. Some choices (those robbing neither end) appear in both ranges, which is harmless for a maximum.

Q: Which state lets maximum subarray sum be solved with a one-step recurrence?
- [ ] Best subarray sum within the first i elements
- [x] Best sum of a subarray that ends exactly at index i
- [ ] Best sum of a subarray that starts at index 0
- [ ] Number of positive elements before i
> Extending a subarray to i requires it to touch i - 1, so the state must fix the end. The answer is then the maximum over all i, not dp[n].
```

## In real systems

**Line breaking.** TeX's paragraph builder, the Knuth–Plass algorithm, chooses line breaks with a DP over break positions: the best layout ending at a break point is built from the best layouts ending at earlier break points, with a cost for how stretched or squeezed each line is. It is the Word Break pattern with costs instead of booleans. Simpler line breakers fill each line greedily before moving to the next, which is why their paragraphs often look more uneven.

**Word segmentation.** Text in languages written without spaces, such as Chinese and Japanese, must be split into words before search indexing. Dictionary-based tokenisers use a prefix DP like Word Break, maximising a score (often word frequencies) instead of returning true or false.

**Making change.** Cash-handling software and vending machines need the fewest coins for an amount. For "canonical" coin systems — such as euro and US coins — greedy is optimal and is what they use; for arbitrary denominations, or limited coin supplies, the coin-change DP is the safe method.

**Streaming metrics.** Kadane-style "ending at `i`" recurrences find the worst stretch of latency or the best trading window in a single pass over a time series, using O(1) memory.

## Trade-offs and alternatives

| Approach | Time | Space | When |
|---|---|---|---|
| Brute-force recursion | Exponential (≈1.6ⁿ for House Robber) | O(n) stack | As a test oracle, or tiny inputs |
| Memoized recursion | O(states × transition) | O(n) memo + O(n) stack | Quick to derive; risky for deep `n` in Java |
| Tabulated array | O(states × transition) | O(n) | Need reconstruction, or arrows reach far back |
| Rolling variables | O(states × transition) | O(k) for a reach of `k` | Recurrence reads a short fixed window; value only |
| Greedy | Usually O(n) or O(n log n) | O(1) | Only when an exchange argument proves it (canonical coins) |
| Matrix exponentiation | O(k³ log n) | O(k²) | Linear recurrences like Fibonacci for huge `n` |

The last row is worth knowing for follow-up questions. A fixed linear recurrence such as `dp[i] = dp[i − 1] + dp[i − 2]` can be written as multiplication by a 2 × 2 matrix, and raising that matrix to the `n`th power by repeated squaring computes `dp[n]` in O(log n) multiplications — useful when `n` is 10¹⁸ and the answer is wanted modulo a prime.

## Common mistakes

> [!MISTAKE] Writing the recurrence before the state sentence
> "dp[i] is the robber answer at i" does not say whether house `i` is included, whether `i` is a prefix length or an index, or whether the solution must end at `i`. Each reading gives a different recurrence and base case. Write the sentence first; the code then follows from it.

**Mixing prefix length and index.** With `dp` of size `n + 1`, `dp[i]` refers to `nums[i − 1]`. Writing `nums[i]` reads one element ahead and throws `ArrayIndexOutOfBoundsException` on the last iteration, or silently shifts the problem.

**Missing small-input cases.** The recurrence `dp[i − 2]` needs `i ≥ 2`; arrays of length 0 or 1 need the base cases to handle them, and circular versions need an explicit one-element case.

**Returning `dp[n]` for an "ending at `i`" state.** The best subarray or the longest increasing subsequence can end anywhere; the answer is the maximum over the table.

**Default zeros as "impossible".** For a minimum, an unreachable state left at 0 looks like the cheapest state of all. Initialise with infinity (safely below overflow) and set only true base cases.

**Trusting greedy.** Taking the biggest house or the largest coin first gives plausible answers that are wrong on small counterexamples: `[5, 9, 5]` for the robber, `{1, 3, 4}` with amount 6 for coins.

**Rolling when the reach is unbounded.** Two variables work for House Robber because it reads only two steps back. Coin Change reads `dp[a − c]` for each coin, so it needs at least as many entries as the largest coin; Word Break needs the whole table.

## Interview perspective

1D DP problems are the most common DP interview questions, and the interviewer is usually checking three things: whether you can state what `dp[i]` means, whether your recurrence covers every case without double counting, and whether you get the base cases and edge inputs right.

> [!INTERVIEW] Narrating House Robber
> "Let `dp[i]` be the best haul from the first `i` houses. For the last of those houses I either skip it, which gives `dp[i − 1]`, or rob it, which rules out its neighbour and gives its value plus `dp[i − 2]`. Base cases are zero houses and one house. It's O(n) time, and since I only look two back, I can keep two variables for O(1) space."

Questions to expect:

- **House Robber II (circle).** Split into "exclude the first" and "exclude the last"; handle a single house.
- **Decode Ways with `*` wildcards.** The same recurrence, but each option contributes a multiplier (how many letters a `*` or `1*` can be); counts need a modulus.
- **Coin Change: return the coins.** Store the winning last coin per amount and follow it back.
- **Why not greedy for coins?** Give `{1, 3, 4}` and 6. Mention that greedy is optimal for canonical systems such as US coins.
- **Min Cost Climbing Stairs, Jump Game, Perfect Squares, Maximum Product Subarray.** All 1D; for the last, note that a negative number swaps the roles of the largest and smallest product ending at `i`, so the state keeps both.
- **Space follow-up.** Explain the reach of the recurrence and roll it if the reach is fixed and small.

## Practice

For each problem, write the five decisions in words, then a brute force, then the DP; compare them on random small inputs with a fixed seed.

1. **Min Cost Climbing Stairs.** Each step has a cost; you may start at step 0 or 1 and climb 1 or 2 steps. Decide whether a prefix or suffix state is more natural, then roll it.
2. **House Robber with reconstruction.** Return the list of houses; then solve the circular version and return its houses too.
3. **Decode Ways with modulus.** Extend to strings of length 10⁵ and return the count modulo 10⁹ + 7.
4. **Perfect Squares.** The fewest perfect squares summing to `n`: an amount-indexed state with `√n` options per state.
5. **Word Break with the split.** Return one valid split, then all valid splits for short strings — and explain why "all splits" cannot be polynomial in general.
6. **Maximum Product Subarray.** Derive why the state needs both the largest and the smallest product ending at `i`.

The DSA explorer lists the matching problems under this topic; start with *Climbing Stairs*, *House Robber*, *House Robber II*, *Decode Ways*, *Coin Change* and *Word Break*.

## Quick revision {#quick-revision}

- 1D DP: one number per position, amount or value, each computed from earlier entries.
- Four state shapes: **prefix** (`dp[i]` for the first `i` elements), **ending at `i`** (answer = max over all `i`), **suffix**, **amount**.
- Derive by classifying solutions by their **last decision**; classes must cover everything and (for counting) not overlap.
- Prefix length indexing: table size `n + 1`, `dp[0]` = empty input, element added is `nums[i − 1]`.
- House Robber: `dp[i] = max(dp[i−1], nums[i−1] + dp[i−2])`, `dp[0] = 0`, `dp[1] = nums[0]`; roll to two variables.
- Circle: `max(rob(0..n−2), rob(1..n−1))`, single house separately.
- Decode Ways: add `dp[i−1]` if last digit ≠ 0, add `dp[i−2]` if last two in 10..26; `dp[0] = 1`.
- Coin Change: `dp[a] = 1 + min dp[a − c]`, `dp[0] = 0`, others `MAX_VALUE / 2`; O(amount × coins).
- Word Break: `ok[i] = OR over j (ok[j] && s[j..i−1] in dict)`; O(n³) worst, O(n · L²) with max word length `L`.
- Time = states × work per state. Roll only when the recurrence's reach is short and fixed; rolling loses reconstruction.

## Key takeaways {#key-takeaways}

- The heart of a 1D DP is the sentence defining `dp[i]`; a precise state makes the recurrence and base cases follow almost mechanically.
- Classify solutions by their last decision: add the classes for counts, take the best class for optimisation.
- Base cases such as `dp[0] = 1` for the empty prefix are derived from the meaning of the state, not memorised.
- "Impossible" needs its own value — infinity for minimums, `false` for feasibility — and that value must survive arithmetic without overflow.
- Circular and boundary variants are usually solved by splitting into a few linear cases rather than by enlarging the state.
- When the recurrence reads only a fixed number of earlier entries, the table rolls into a few variables.
