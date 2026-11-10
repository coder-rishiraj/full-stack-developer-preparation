---
summary: Many optimisation problems become a single pass once the items are in the right order — the hard part is finding that order and proving it is right. You will learn to derive a sort key with the adjacent-swap argument, apply it to scheduling, matching, ratio and cost-difference problems, and recognise when a sort-then-scan greedy is safe and when it is not.
difficulty: intermediate
minutes: 55
objectives:
  - Derive a sort key by comparing two adjacent items and checking which order is no worse
  - Prove that sorting by the derived key is optimal by eliminating inversions one swap at a time
  - Implement shortest-job-first, Smith's rule, earliest-deadline-first, two-city scheduling, cookie matching and fractional knapsack in Java
  - Write comparators that respect Java's contract, using cross-multiplication instead of floating-point ratios
  - Recognise when sorting makes a greedy scan correct and when a weighted or indivisible variant needs dynamic programming
---

## Introduction

A print shop has one copier and six customers waiting, each with a job of known length. Every customer cares about when *their* job finishes. In what order should the jobs run so that the total waiting time is as small as possible?

There are 6! = 720 possible orders, and for 20 customers there are more than 2 × 10¹⁸. Trying them all is out of the question. Yet the answer is one line: **run the shortest job first**. Sort by length, then run in that order.

This lesson is about that shape of solution — **sorting plus greedy**. You sort the items by some key, then scan them once, making a simple irrevocable decision for each one: take it, skip it, pair it, or place it next. A **greedy algorithm** is any algorithm that builds its answer through such locally best, never-revisited choices. Sorting is what makes the local choice obvious: after sorting, "the best next item" is always the next one in the array.

The scan is usually trivial. All the difficulty lives in two questions: **which key do I sort by**, and **how do I know that order is optimal?** Guessing the key by intuition is how most wrong greedy solutions are born. This lesson teaches a mechanical way to derive the key — compare two neighbouring items and ask which order is better — and a matching way to prove it.

You will see the pattern in operating-system schedulers, batch job queues, load balancers, and in interview problems such as *Assign Cookies*, *Two City Scheduling*, *Boats to Save People*, *Largest Number*, *Non-overlapping Intervals* and *Partition Labels*.

## Before you start

- **Sorting first, then scanning** — what sorted order gives you and what it costs. [[a2-sorting-based]] introduces the pattern with *Boats to Save People* and *Largest Number*.
- **Comparators** — writing `(a, b) -> Integer.compare(...)`, multi-key orders, and the comparator contract. See [[a3-comparator-sorting]].
- **Interval selection** — sorting by end time and the stays-ahead and exchange proofs. See [[a10-interval-scheduling]]; this lesson generalises the exchange idea.
- **Big-O** — O(n log n) for sorting, O(n!) for trying every order. See [[a1-big-o]].

## The intuition

Go back to the copier. Suppose a 10-minute job and a 1-minute job are next in line. If the long job goes first, the short job's customer waits 10 minutes before their 1-minute job even starts. If the short job goes first, the long job's customer waits only 1 extra minute. Both jobs finish by minute 11 either way, but in the second order one customer is done at minute 1 instead of minute 11.

The insight is that **only the two neighbours are affected** by swapping them. Everyone before them is untouched, and everyone after them starts at the same moment either way (the two jobs take 11 minutes in total regardless of order). So deciding the order of *two* adjacent items is a tiny, local question with a clear answer — and if that answer is consistent ("shorter goes first"), it defines a sort key for the whole list.

That is the entire method in miniature. The rest of this lesson makes it precise, shows where it applies, and shows where it does not.

## The method

When a problem asks you to choose or arrange items to optimise a total, try these steps in order:

1. **Name the items and the objective.** Jobs and total completion time; children and cookies and the number satisfied; people and cities and total cost.
2. **Compare two adjacent items.** Write the objective's contribution when item `i` comes right before `j`, and again when `j` comes right before `i`. Everything else cancels.
3. **Read off the key.** The inequality "`i` before `j` is no worse" usually simplifies to `key(i) ≤ key(j)`.
4. **Check the key with tiny cases.** Hand-check two or three items, and hunt for a counterexample to the rule.
5. **Sort and scan.** Write the one-pass decision.

The proof of step 3 has a standard shape, the **adjacent-swap argument** (also called an *interchange argument*). An **inversion** is a pair of adjacent items that are out of key order. Take any arrangement — in particular an optimal one. If it has an inversion, swapping that pair does not make the objective worse (that is what step 2 showed). Each swap removes exactly one inversion, as in bubble sort, so after finitely many swaps you reach the sorted order without ever getting worse. Therefore the sorted order is at least as good as the optimal one, so it is optimal.

## Deriving a key: three scheduling problems

All three problems below run jobs one after another on a single machine with no idle time. Job `i` takes `pᵢ` time units. A job's **completion time** `Cᵢ` is the moment it finishes.

### Minimise total completion time: shortest job first

Let jobs `i` and `j` be adjacent, starting at time `t`.

- `i` then `j`: `Cᵢ = t + pᵢ` and `Cⱼ = t + pᵢ + pⱼ`, sum `2t + 2pᵢ + pⱼ`.
- `j` then `i`: sum `2t + 2pⱼ + pᵢ`.

The first is no worse exactly when `2pᵢ + pⱼ ≤ 2pⱼ + pᵢ`, that is, when **`pᵢ ≤ pⱼ`**. The key is the job length, and the rule is **Shortest Processing Time first (SPT)**, also called shortest job first. Ties do not matter: equal lengths give equal sums.

### Minimise weighted completion time: Smith's rule

Now each job also has a **weight** `wᵢ > 0` — how important it is that this job finishes early — and we minimise `Σ wᵢCᵢ`. Repeat the comparison:

- `i` then `j`: `wᵢ(t + pᵢ) + wⱼ(t + pᵢ + pⱼ)`
- `j` then `i`: `wⱼ(t + pⱼ) + wᵢ(t + pⱼ + pᵢ)`

Subtract the second from the first. The `t` terms and the `wᵢpᵢ`, `wⱼpⱼ` terms cancel, leaving `wⱼpᵢ − wᵢpⱼ`. So `i` first is no worse when `pᵢwⱼ ≤ pⱼwᵢ`, which, because weights are positive, is the same as **`pᵢ / wᵢ ≤ pⱼ / wⱼ`**. Sort by time per unit of weight, smallest first. This is **Smith's rule** (W. E. Smith, 1956). SPT is the special case where all weights are equal.

Notice what the derivation did that intuition would not. "Most important first" (sort by weight) is wrong: a heavy job that takes forever should still wait behind a medium job that takes a second. "Shortest first" is also wrong once weights differ. Only the ratio balances the two.

### Minimise the maximum lateness: earliest deadline first

Each job now has a **deadline** `dᵢ`. Its **lateness** is `Cᵢ − dᵢ` (negative if it finishes early), and we minimise the *largest* lateness. Suppose `i` sits directly before `j` but `dᵢ > dⱼ` — an inversion by deadline. Let `T` be the time the pair finishes.

- Before the swap, `j` finishes at `T` with lateness `T − dⱼ`. That is at least as large as `i`'s lateness, because `i` finishes earlier and has a later deadline.
- After the swap, `j` finishes earlier, so its lateness drops. `i` now finishes at `T`, with lateness `T − dᵢ < T − dⱼ`.

So the larger of the two latenesses does not increase, and nothing outside the pair changes. Removing inversions one at a time reaches deadline order without increasing the maximum lateness: **Earliest Deadline First (EDF)** is optimal. Here the objective is a maximum rather than a sum, but the adjacent-swap argument works the same way.

### The three rules in code

```java title="SchedulingRules.java"
import java.util.Arrays;

public class SchedulingRules {

    record Job(String name, int time, int weight, int deadline) {}

    /** Sum over jobs of weight * completion time, running jobs back to back in this order. */
    static long weightedCompletion(Job[] order) {
        long clock = 0, total = 0;
        for (Job j : order) {
            clock += j.time();
            total += (long) j.weight() * clock;
        }
        return total;
    }

    /** Largest lateness max(0, completion - deadline) over all jobs in this order. */
    static long maxLateness(Job[] order) {
        long clock = 0, worst = 0;
        for (Job j : order) {
            clock += j.time();
            worst = Math.max(worst, clock - j.deadline());
        }
        return worst;
    }

    static String names(Job[] order) {
        StringBuilder sb = new StringBuilder();
        for (Job j : order) sb.append(j.name());
        return sb.toString();
    }

    public static void main(String[] args) {
        Job[] jobs = {
            new Job("A", 3, 1, 6), new Job("B", 2, 1, 8), new Job("C", 1, 1, 9),
            new Job("D", 4, 1, 9), new Job("E", 3, 1, 14), new Job("F", 2, 1, 15)
        };

        // Shortest processing time first minimises the sum of completion times.
        Job[] spt = jobs.clone();
        Arrays.sort(spt, (a, b) -> Integer.compare(a.time(), b.time()));
        System.out.println("SPT  " + names(spt) + " total completion " + weightedCompletion(spt));

        // Earliest deadline first minimises the maximum lateness.
        Job[] edf = jobs.clone();
        Arrays.sort(edf, (a, b) -> Integer.compare(a.deadline(), b.deadline()));
        System.out.println("EDF  " + names(edf) + " max lateness " + maxLateness(edf));
        System.out.println("SPT  " + names(spt) + " max lateness " + maxLateness(spt));

        // Smith's rule: a before b when time(a) / weight(a) < time(b) / weight(b),
        // compared by cross-multiplying in long so there is no division or rounding.
        Job[] weighted = {
            new Job("P", 3, 1, 0), new Job("Q", 1, 1, 0), new Job("R", 4, 6, 0), new Job("S", 2, 1, 0)
        };
        Job[] smith = weighted.clone();
        Arrays.sort(smith, (a, b) -> Long.compare((long) a.time() * b.weight(),
                                                  (long) b.time() * a.weight()));
        Job[] byTime = weighted.clone();
        Arrays.sort(byTime, (a, b) -> Integer.compare(a.time(), b.time()));
        System.out.println("Smith " + names(smith) + " weighted " + weightedCompletion(smith));
        System.out.println("SPT   " + names(byTime) + " weighted " + weightedCompletion(byTime));
    }
}
```

```output
SPT  CBFAED total completion 43
EDF  ABCDEF max lateness 1
SPT  CBFAED max lateness 6
Smith RQSP weighted 46
SPT   QSPR weighted 70
```

Every printed value was checked against brute force over all orders: 43 is the smallest possible total for these six jobs, 1 the smallest possible maximum lateness, and 46 the smallest weighted total for P, Q, R and S. `maxLateness` reports `max(0, …)` because `worst` starts at 0, matching the usual convention that finishing early does not offset finishing late.

Two lines deserve attention. The SPT output `CBFAED` shows that `Arrays.sort` on objects is **stable**: B and F both take 2 units and keep their input order, as do A and E. Stability does not affect these objectives, but it makes output reproducible. The Smith comparator never computes a ratio. Comparing `pₐ / wₐ` with `p_b / w_b` as `double` values risks rounding two different ratios to the same value; cross-multiplying, `pₐ · w_b` versus `p_b · wₐ` in `long`, is exact.

The middle two lines make an important point: **a rule is optimal only for the objective it was derived for**. SPT minimises total completion time but gives a maximum lateness of 6 here, while EDF gets 1. Here is the EDF schedule step by step:

| Job | Time | Deadline | Completes at | Lateness |
|---|---|---|---|---|
| A | 3 | 6 | 3 | −3 |
| B | 2 | 8 | 5 | −3 |
| C | 1 | 9 | 6 | −3 |
| D | 4 | 9 | 10 | 1 |
| E | 3 | 14 | 13 | −1 |
| F | 2 | 15 | 15 | 0 |

Jobs A, B, C and D all have deadlines of 9 or earlier but need 10 units of work between them, so whichever of them finishes last is at least 1 late in *any* order. EDF achieves that bound.

```quiz
Q: Two adjacent jobs have (time, weight) of (4, 2) and (3, 1). Which should run first to minimise total weighted completion time?
- [x] The (4, 2) job, because 4/2 = 2 is less than 3/1 = 3
- [ ] The (3, 1) job, because it is shorter
- [ ] The (4, 2) job, because it is heavier
- [ ] Either; the order does not matter
> Smith's rule compares time per unit weight. Swapping two neighbours changes the total by w_j·p_i − w_i·p_j = 1·4 − 2·3 = −2 for running (4,2) first, so that order is 2 units better. "Shorter first" ignores weight and "heavier first" ignores time; the ratio balances both.

Q: Why does the adjacent-swap argument prove that the sorted order is optimal, rather than only that it is locally good?
- [ ] Because sorting is O(n log n)
- [x] Because any order, including an optimal one, can be turned into the sorted order by swapping inverted neighbours, and no swap makes it worse
- [ ] Because adjacent swaps are the only moves a scheduler can make
- [ ] Because all orders have the same cost
> Start from an optimal order. Each swap of an inverted adjacent pair removes one inversion and does not increase the cost, so after finitely many swaps you reach the sorted order with cost no greater than optimal. Hence sorted is optimal.
```

## Matching two sorted lists: Assign Cookies

**Problem.** Child `i` is content with any cookie of size at least `greed[i]`. Each child gets at most one cookie and each cookie goes to at most one child. Maximise the number of content children.

**Naive approach.** Try every assignment of cookies to children — exponential. Even a smarter "for each child, search all cookies" is O(n · m) and still needs a rule for *which* cookie to give.

**Deriving the rule.** Consider the least greedy child. Any cookie that satisfies anybody satisfies them, so they are the easiest to please. Give them the **smallest cookie that is big enough**. Bigger cookies are kept for greedier children, who may need them.

Why is that safe? Let `g` be the least greedy child and `c` the smallest cookie with `c ≥ g`, and take any optimal assignment.

- If the optimal assignment gives `g` a different cookie `c′` and gives `c` to another child `x`, swap them. `g` is fine with `c`, and `x` gets `c′ ≥ c ≥ greed[x]`, so `x` is still content. The count is unchanged.
- If `c` goes to `x` and `g` gets nothing, move `c` from `x` to `g`: one child loses, one gains, same count.
- If `g` gets `c′` and `c` is unused, give `g` the cookie `c` instead; same count.
- If neither `g` nor `c` is used, giving `c` to `g` would increase the count, contradicting optimality.

So some optimal assignment gives `c` to `g`, and the rest of the problem is the same problem on fewer children and cookies. Sorting both arrays turns "least greedy child" and "smallest sufficient cookie" into two pointers moving forward.

```java title="AssignCookies.java"
import java.util.Arrays;

public class AssignCookies {

    /** Child i is content with a cookie of size >= greed[i]; each child gets at most one. */
    static int findContentChildren(int[] greed, int[] sizes) {
        int[] g = greed.clone(), s = sizes.clone();
        Arrays.sort(g);
        Arrays.sort(s);
        int child = 0;
        for (int cookie = 0; cookie < s.length && child < g.length; cookie++) {
            if (s[cookie] >= g[child]) child++;   // smallest cookie that satisfies this child
            // otherwise this cookie is too small for every remaining child: discard it
        }
        return child;
    }

    public static void main(String[] args) {
        System.out.println(findContentChildren(new int[]{1, 2, 3}, new int[]{1, 1}));
        System.out.println(findContentChildren(new int[]{1, 2}, new int[]{1, 2, 3}));
        System.out.println(findContentChildren(new int[]{10, 9, 8, 7}, new int[]{5, 6, 7, 8}));
    }
}
```

```output
1
2
2
```

Trace the third case. Sorted greed `[7, 8, 9, 10]`, sorted sizes `[5, 6, 7, 8]`. Cookies 5 and 6 are smaller than the least greedy child's 7, so they are useless to everyone and are discarded. Cookie 7 satisfies the child with greed 7; cookie 8 satisfies the child with greed 8. Two children.

The discard step relies on sortedness: if a cookie fails the *least* greedy remaining child, it fails all of them. Without sorting, you could not throw it away safely. Sorting costs O(n log n + m log m); the scan moves `cookie` forward every iteration and `child` at most `n` times, so it is O(n + m).

The same "pair the extremes" reasoning gives *Boats to Save People* (pair the heaviest with the lightest if they fit), worked through with its exchange argument in [[a2-sorting-based]].

## Sorting by a derived key: Two City Scheduling

**Problem.** `2n` people must be flown to interviews, exactly `n` to city A and `n` to city B. Person `i` costs `aᵢ` to fly to A and `bᵢ` to B. Minimise the total cost.

**Naive approach.** Choose which `n` people go to A: C(2n, n) ways, which for `2n = 100` is about 10²⁹.

**Tempting but wrong.** "Send each person to their cheaper city" ignores the constraint of exactly `n` per city. "Sort by `aᵢ`" ignores what the person would cost elsewhere.

**Deriving the key.** Pretend everyone first goes to B, costing `Σ bᵢ`. Moving person `i` to A changes the total by `aᵢ − bᵢ`. We must move exactly `n` people, and the total is

`Σ bᵢ + Σ (aᵢ − bᵢ) over the people sent to A`.

The first sum is fixed. To minimise the second, choose the `n` people with the **smallest `aᵢ − bᵢ`**. That is the whole proof: the objective separates into a constant plus independent per-person terms, and picking the `n` smallest terms is clearly optimal. Sort by `aᵢ − bᵢ` and send the first half to A.

```java title="TwoCity.java"
import java.util.Arrays;

public class TwoCity {

    /** 2n people; send exactly n to city A and n to city B at minimum total cost. */
    static int twoCitySchedCost(int[][] costs) {
        int[][] s = costs.clone();
        // Most "A-favouring" first: the smaller costA - costB, the more A saves over B.
        Arrays.sort(s, (x, y) -> Integer.compare(x[0] - x[1], y[0] - y[1]));
        int n = s.length / 2, total = 0;
        for (int i = 0; i < n; i++) total += s[i][0];          // first half fly to A
        for (int i = n; i < 2 * n; i++) total += s[i][1];      // second half fly to B
        return total;
    }

    public static void main(String[] args) {
        System.out.println(twoCitySchedCost(new int[][]{{10, 20}, {30, 200}, {400, 50}, {30, 20}}));
        System.out.println(twoCitySchedCost(new int[][]{
            {259, 770}, {448, 54}, {926, 667}, {184, 139}, {840, 118}, {577, 469}}));
    }
}
```

```output
110
1859
```

For the first input the differences are −10, −170, 350 and 10. Sorted: `[30,200]` (−170), `[10,20]` (−10), `[30,20]` (10), `[400,50]` (350). The first two fly to A for 30 + 10, the last two to B for 20 + 50: 110.

The comparator computes `x[0] - x[1]` and then compares those differences with `Integer.compare`. Computing a cost difference is part of the key, not a subtraction-based comparator, and it is safe here because costs are small (the problem bounds them by 1,000). With costs near `Integer.MAX_VALUE` you would compute the differences in `long`.

## Sorting by a ratio: fractional knapsack

**Problem.** A knapsack holds weight `W`. Item `i` has value `vᵢ` and weight `wᵢ`, and you may take **any fraction** of an item, receiving that fraction of its value. Maximise the value carried.

Because items can be split, every unit of capacity is a separate decision, and each unit should hold the most valuable material available. Item `i` provides `vᵢ / wᵢ` value per unit of weight, its **value density**. Sort by density, highest first, and fill the knapsack in that order, taking a fraction of the last item that does not fit whole.

The exchange argument: suppose an optimal load carries some weight `δ` of a lower-density item `j` while a higher-density item `i` is not fully taken. Replace `δ` of `j` (or as much as `i` has left) with the same weight of `i`. The weight is unchanged and the value rises by `δ(vᵢ/wᵢ − vⱼ/wⱼ) ≥ 0`. Repeating this turns any optimal load into the greedy load without losing value.

```java title="FractionalKnapsack.java"
import java.util.Arrays;

public class FractionalKnapsack {

    /** items[i] = {value, weight}; any fraction of an item may be taken. */
    static double maxValue(int[][] items, int capacity) {
        int[][] s = items.clone();
        // Higher value per unit weight first: compare v1/w1 > v2/w2 as v1*w2 > v2*w1.
        Arrays.sort(s, (a, b) -> Long.compare((long) b[0] * a[1], (long) a[0] * b[1]));
        double total = 0;
        int room = capacity;
        for (int[] it : s) {
            if (room == 0) break;
            int take = Math.min(room, it[1]);
            total += (double) it[0] * take / it[1];
            room -= take;
        }
        return total;
    }

    public static void main(String[] args) {
        int[][] items = {{60, 10}, {100, 20}, {120, 30}};
        System.out.println(maxValue(items, 50));
        System.out.println(maxValue(items, 0));
        System.out.println(maxValue(items, 100));
    }
}
```

```output
240.0
0.0
280.0
```

With capacity 50, the densities are 6, 5 and 4. The algorithm takes all of the first two items (weight 30, value 160) and 20 of the third item's 30 units of weight, worth 120 × 20/30 = 80, for 240. With capacity 100 everything fits: 280.

> [!WARNING] The fraction is what makes it greedy
> If items cannot be split — the **0/1 knapsack** — the same density rule takes the first two items for 160, while the best whole-item choice is the second and third for 220. Indivisibility means a high-density item can waste capacity that a combination would have used, and the exchange argument above no longer works because you cannot move "`δ` of an item". The 0/1 version needs dynamic programming ([[a11-knapsack]]); [[a10-local-vs-global]] uses it as the standard example of a local rule failing.

## When the order is already given: Partition Labels

Not every sort-and-scan greedy needs a sort. Sometimes the input already has a fixed order and the greedy needs a precomputed fact about each item instead.

**Problem.** Split a string into as many parts as possible so that each letter appears in at most one part. Return the part sizes.

A part that contains a letter must extend at least to that letter's **last occurrence**. So scan left to right, keeping `end` = the farthest last occurrence of any letter seen in the current part. When the scan index reaches `end`, nothing in the current part needs to go further, and closing the part here is safe. Closing it as early as possible is the greedy choice, and it is optimal for a simple reason. A cut after index `i` is legal exactly when no letter at or before `i` appears again after `i`. The test `i == end` is true at precisely those indices, so the scan makes every legal cut, and no partition can have more parts.

```java title="PartitionLabels.java"
import java.util.ArrayList;
import java.util.List;

public class PartitionLabels {

    static List<Integer> partitionLabels(String s) {
        int[] last = new int[26];
        for (int i = 0; i < s.length(); i++) last[s.charAt(i) - 'a'] = i;

        List<Integer> sizes = new ArrayList<>();
        int start = 0, end = 0;
        for (int i = 0; i < s.length(); i++) {
            end = Math.max(end, last[s.charAt(i) - 'a']);  // this part must reach that far
            if (i == end) {                                // nothing inside needs to go further
                sizes.add(end - start + 1);
                start = i + 1;
            }
        }
        return sizes;
    }

    public static void main(String[] args) {
        System.out.println(partitionLabels("ababcbacadefegdehijhklij"));
        System.out.println(partitionLabels("eccbbbbdec"));
        System.out.println(partitionLabels("abc"));
    }
}
```

```output
[9, 7, 8]
[10]
[1, 1, 1]
```

In `eccbbbbdec`, the first letter `e` reappears at the final index, so the only valid partition is the whole string. The algorithm is O(n) time and O(1) extra space (26 counters). If you view each letter as the interval from its first to its last occurrence, this is merging overlapping intervals ([[a2-intervals]]) without ever building or sorting them — the left-to-right scan visits the intervals in start order for free.

## Recognising sort-and-scan greedy problems

| Problem | Sort by | One-pass rule |
|---|---|---|
| Activity selection / Non-overlapping Intervals | End time | Keep if start `>=` last kept end ([[a10-interval-scheduling]]) |
| Minimise total completion time | Duration | Run in order |
| Minimise weighted completion time | `time / weight` (cross-multiply) | Run in order |
| Minimise maximum lateness | Deadline | Run in order |
| Assign Cookies | Both arrays ascending | Smallest sufficient cookie to least greedy child |
| Boats to Save People | Weight | Heaviest with lightest if they fit ([[a2-sorting-based]]) |
| Two City Scheduling | `costA − costB` | First half to A |
| Fractional knapsack | Value density, descending | Fill, splitting the last item |
| Largest Number | `a + b` vs `b + a` as strings | Concatenate ([[a2-sorting-based]]) |
| Partition Labels | No sort; last occurrence | Cut when index reaches farthest last occurrence |

The signals that a problem belongs in this family: the objective is a **sum, count or maximum** over items; the answer is an **arrangement or a subset**; and the order of decisions is **static** — once sorted, an item's priority never changes because of earlier choices. When the best next item *does* change as you go (new items become available, or a choice changes others' value), sorting once is not enough and you need a heap ([[a10-heap-greedy]]).

## How it works internally: comparators that are safe to sort with

A greedy derived from a pairwise comparison is only usable if that comparison is a valid ordering. Java's sorting algorithms assume the comparator is **consistent** — `compare(a, b)` and `compare(b, a)` have opposite signs — and **transitive** — if `a ≤ b` and `b ≤ c` then `a ≤ c`. A comparator that breaks these rules does not throw a clean error up front. The sort may produce a wrong order, and TimSort, which Java uses for object arrays, sometimes detects the inconsistency mid-sort and throws `IllegalArgumentException: Comparison method violates its general contract!`.

Comparators derived by the adjacent-swap method are safe when the inequality reduces to comparing a **per-item key** (`pᵢ`, `dᵢ`, `pᵢ/wᵢ`, `aᵢ − bᵢ`): comparing numbers is always transitive. Be more careful when the comparison depends on *both* items in a way that does not separate, such as Largest Number's `a + b` versus `b + a`; that one happens to be transitive, but it needs its own proof ([[a2-sorting-based]]).

Three implementation rules follow:

- **Never compare by subtraction** (`a.time - b.time`); it overflows for widely separated values. Use `Integer.compare` or `Long.compare` ([[a3-comparator-sorting]]).
- **Compare ratios by cross-multiplying in `long`.** `pₐ · w_b` versus `p_b · wₐ` is exact; two `int` products fit in a `long`. Floating point can round distinct ratios to equal values.
- **Know which sort you are calling.** `Arrays.sort(int[])` uses a dual-pivot quicksort and is not stable, which does not matter for primitives. `Arrays.sort(T[], Comparator)` and `List.sort` are stable, which can matter when ties are later broken by position.

## Complexity

Every algorithm in this lesson costs **O(n log n)** for the sort plus O(n) for the scan, so O(n log n) total. Assign Cookies sorts two arrays, O(n log n + m log m). Partition Labels needs no sort and is O(n).

Extra space is what the sort needs — O(n) worst case for Java's object sort, O(log n) stack for the primitive sort — plus the copies made to leave inputs unchanged. If you may sort in place, the scans themselves use O(1) space.

Compare that with the naive alternatives: n! orders for scheduling, C(2n, n) subsets for Two City Scheduling, exponential assignments for cookies. Sorting turns all of them into near-linear work, which is why the pattern is worth recognising quickly.

## In real systems

**Operating-system and batch schedulers.** On one machine with all jobs waiting, shortest-job-first is the order that minimises average completion time when job lengths are known, which is why batch systems that ask for runtime estimates use it or variants of it. Its known weakness is starvation: a long job can wait forever if short jobs keep arriving, so real schedulers add **aging**, raising a job's priority the longer it waits.

**Deadline scheduling.** Linux has a `SCHED_DEADLINE` scheduling class (since kernel 3.14) built on Earliest Deadline First, intended for tasks with timing requirements such as periodic media or control work. EDF is attractive there for the reason derived above: it minimises maximum lateness on one processor.

**Load balancing.** Spreading jobs over several machines to minimise the finishing time of the busiest one is NP-hard, so no sort-then-scan rule is optimal. The classic heuristic, **Longest Processing Time first** (sort descending, give each job to the least-loaded machine), is guaranteed to be within a factor of 4/3 of optimal (Graham, 1969). That is a sort-and-greedy used as an approximation, not as an exact algorithm — a distinction [[a10-local-vs-global]] develops.

**Query and request planning.** Databases evaluate cheap, selective filter conditions before expensive ones, and services check fast caches before slow backends. Both are informal Smith's rules: cost per unit of benefit, cheapest first.

## Trade-offs and alternatives

| Approach | Time | When it is right |
|---|---|---|
| Try every order or subset | O(n!) or O(2ⁿ) | Tiny inputs; a brute-force checker for your greedy |
| Sort + greedy scan | O(n log n) | Static priorities and a proven key |
| Heap + greedy | O(n log n) | Priorities change as items become available ([[a10-heap-greedy]]) |
| Dynamic programming | Usually O(n · capacity) or O(n²) | Indivisible items, weights that break exchange, dependent choices ([[a11-knapsack]]) |

The strength of sort-and-greedy is that it is fast, short and explainable. Its weakness is that it is **silently wrong** when the key is wrong: there is no error, only a slightly worse answer. That is why the derivation and a brute-force check on small inputs are part of the technique, not optional extras.

## Common mistakes

> [!MISTAKE] Choosing the key by feel
> "Most important first" and "shortest first" both sound right for weighted scheduling, and both are wrong. Write the two-item comparison; it takes one line of algebra and tells you the key.

**Optimising the wrong objective.** SPT minimises total completion time, not maximum lateness; EDF minimises maximum lateness, not the number of late jobs. (Minimising the number of late jobs needs a heap-based refinement; see *Course Schedule III* in [[a10-heap-greedy]].)

**Using a ratio greedy on indivisible items.** Fractional knapsack is greedy; 0/1 knapsack is not.

**Ignoring a global constraint.** Two City Scheduling with "each person to their cheaper city" violates the `n` / `n` split. Derive the key with the constraint in place.

**Comparator bugs.** Subtraction overflow, floating-point ratios, and comparators that are not transitive. Use `Integer.compare`, `Long.compare` and cross-multiplication.

**Forgetting the discard case.** In Assign Cookies, a cookie too small for the least greedy child is useless; code that instead advances the child pointer skips children who could still be satisfied.

## Interview perspective

Interviewers use these problems to see whether you can justify a greedy rule, not whether you remember one. The strongest answers say what is being sorted, why, and how they would convince themselves.

> [!INTERVIEW] Deriving the key out loud
> "Let me look at two neighbouring jobs. If `i` goes first the cost is `wᵢ(t + pᵢ) + wⱼ(t + pᵢ + pⱼ)`; the other way it's the mirror image. The difference is `wⱼpᵢ − wᵢpⱼ`, so `i` should go first when `pᵢ/wᵢ` is smaller. Any order can be bubble-sorted into that one without getting worse, so sorting by that ratio is optimal. I'll compare by cross-multiplying in `long` to avoid floating point."

Questions to be ready for:

- **Why is SPT optimal for total completion time?** Swapping adjacent jobs changes the sum by the difference of their lengths; remove inversions one by one.
- **Fractional versus 0/1 knapsack?** Give the 60/100/120 example: 240 fractional, 160 greedy whole-item, 220 optimal whole-item.
- **Two City Scheduling proof?** Everyone to B, then pay `a − b` for each person moved; choose the `n` smallest.
- **What if a comparator is not transitive?** Results are unpredictable, and Java may throw `IllegalArgumentException` during the sort.
- **How would you test a greedy?** Write a brute-force solver over all orders for `n ≤ 8`, compare on thousands of random inputs, and keep the first mismatch as a counterexample.

## Practice

1. **Assign Cookies** — then change it so each child may receive several cookies whose sizes add up to their greed. Does the greedy still work? (Hint: it becomes a packing problem.)
2. **Two City Scheduling** — prove the key in your own words before coding.
3. **Maximum Bags With Full Capacity of Rocks** — sort bags by the rocks still missing and argue, with an exchange, why filling the nearest-to-full bags first is optimal.
4. **Maximum Units on a Truck** — fractional knapsack with integer boxes; explain why it is still greedy.
5. **Queue Reconstruction by Height** — sort by height descending, then by `k` ascending, and insert at index `k`; argue why taller people placed first are unaffected by later insertions.
6. **Smith's rule by brute force** — write a checker over all permutations for six random jobs and confirm the rule on 1,000 inputs.
7. **Partition Labels** — then solve it by building first/last-occurrence intervals and merging them; compare the two.

The DSA explorer lists these problems under the Sorting + Greedy topic.

## Quick revision {#quick-revision}

- Pattern: sort by a key, then one pass of take / skip / pair / place. O(n log n).
- Derive the key: compare cost of `i` then `j` against `j` then `i` for adjacent items; everything else cancels.
- Prove it: remove adjacent inversions one at a time; no swap makes the cost worse, so sorted is optimal.
- Total completion time → shortest first. Weighted → smallest `p/w` first (Smith). Max lateness → earliest deadline first.
- Assign Cookies: sort both; smallest sufficient cookie to least greedy child; discard cookies too small for everyone.
- Two City: sort by `a − b`; first `n` to A.
- Fractional knapsack: highest `v/w` first, split the last item. 0/1 knapsack is not greedy.
- Partition Labels: no sort; cut when the index reaches the farthest last occurrence.
- Comparators: `Integer.compare` / `Long.compare`, cross-multiply ratios in `long`, keep them transitive.
- If priorities change as you go, use a heap; if items are indivisible or choices interact, use DP.

## Key takeaways {#key-takeaways}

- In sort-and-greedy problems the scan is easy; the work is choosing the sort key and proving it.
- Comparing two adjacent items gives the key mechanically, and eliminating inversions turns that local comparison into a proof of global optimality.
- Each rule is optimal for one objective only: SPT for total completion time, Smith's rule for weighted completion time, EDF for maximum lateness.
- Splitting the objective into a constant plus independent per-item terms, as in Two City Scheduling, is another fast route to a provable key.
- A wrong key gives a silently wrong answer, so check every greedy against brute force on small inputs.
- Indivisible items, dependent choices and changing priorities are the signals to reach for DP or a heap instead.
