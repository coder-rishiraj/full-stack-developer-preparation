---
summary: Pruning stops a backtracking search from exploring branches that provably cannot contain a valid or better answer. You will learn the one rule every prune must obey, the five prunes that cover most problems — remaining count, sorted break and sum bounds, duplicate skipping, symmetry breaking and branch and bound — and how to measure what each one saves.
difficulty: intermediate
minutes: 60
objectives:
  - Explain what makes a prune sound and prove that a given prune never discards a solution
  - Implement remaining-count, sorted-break and suffix-sum prunes and justify each boundary
  - Distinguish duplicate skipping (continue) from a sorted bound (break) and debug code that confuses them
  - Apply symmetry breaking to partition problems and branch and bound to optimisation problems
  - Measure the effect of a prune by counting calls, and explain why the worst case usually stays exponential
---

## Introduction

A backtracking search walks a tree of decisions. Generating every subset of 30 numbers means a tree with 2³⁰ — about a billion — leaves. Many interview problems sit on trees like that, and yet a well-written solution finishes in milliseconds. The difference is **pruning**: recognising, part-way down a branch, that nothing below can be an answer, and returning immediately instead of exploring it.

Here is the scale of what that can mean, measured with the programs in this lesson. Splitting twelve numbers into four groups of equal sum took 22,369,621 recursive calls without pruning and 180 calls with three simple prunes. Finding subsets of 30 numbers whose sum is close to the total took over a billion calls with one prune and under twenty thousand with two. None of those prunes changed the answers; they only skipped work that could not have produced one.

That last sentence is the whole discipline. A prune is only allowed if you can say *why* every branch it discards is hopeless. A prune that is slightly too aggressive does not crash or slow down — it silently loses valid answers, which is much worse. So this lesson teaches each prune together with its proof: what fact about the problem guarantees that the discarded branch is empty.

You have already met one kind of pruning in [[a9-constraint-backtracking]]: rejecting a value that breaks a rule. This lesson generalises that idea to arithmetic bounds, duplicates, symmetry and optimisation, and shows how to measure what each prune buys.

## Before you start

- **Backtracking with choose, recurse, undo** — the shape of every search here. See [[a1-recursion]].
- **Subsets and combinations** — the decision trees that the prunes cut. See [[a9-subsets]] and [[a9-combinations]].
- **Constraint checks before recursing** — the simplest prune. See [[a9-constraint-backtracking]].
- **Sorting** — several prunes depend on sorted input. Any of [[a3-merge-sort]] or `Arrays.sort` knowledge is enough.

## The intuition

Imagine exploring a maze in which some corridors are marked with a sign at the entrance: "dead end". Walking down a marked corridor to touch the far wall gives you no information you did not already have. Pruning is reading the sign.

The interesting part is where the signs come from, because the maze does not provide them; you have to *derive* them from the problem. "The remaining numbers are all larger than what I still need" is a sign. "Even if I take every remaining number I will not reach the target" is a sign. "I have already explored a bucket with exactly this load" is a sign. Each is a short argument about every completion of the current partial answer, made without enumerating those completions.

A useful way to see the payoff: a prune applied at depth `d` of a tree with branching factor `b` removes a subtree of up to `bⁿ⁻ᵈ` nodes with one check. Prunes that fire *near the root* are worth far more than prunes that fire near the leaves. That is why so many pruning techniques are really about ordering — arranging the search so that hopeless branches are recognised early.

## What makes a prune correct

Write down what the search is looking for, then the prune condition. A prune is **sound** when:

> For a **feasibility** search: if the condition holds at a node, no completion of that node is a valid answer.
> For an **optimisation** search: if the condition holds, no completion of that node is better than the best answer already found.

Everything else in this lesson is an application of that test. Two consequences are worth absorbing now.

First, a sound prune never changes the output, only the work. So you can always test a prune by running the search with and without it on many small random inputs and comparing results. If the outputs ever differ, the prune is wrong.

Second, soundness usually rests on a **monotonic** property of the problem: something that only moves in one direction as the path grows. Partial sums only grow when all numbers are positive. Bucket loads only grow. The number of positions left only shrinks. When the property is not monotonic — for instance, when numbers can be negative — the same prune becomes unsound.

| Kind of prune | The question it asks | Example |
|---|---|---|
| Feasibility | Can this partial answer still be completed? | Too few elements left; sum already over target |
| Constraint | Does this choice already break a rule? | Queen attacks a queen; digit repeated in a row |
| Duplicate | Will this branch produce an answer already produced? | Skip a second equal value at the same depth |
| Symmetry | Is this branch a relabelled copy of one already explored? | Two empty buckets are interchangeable |
| Bound | Can this branch beat the best answer found so far? | Partial cost already at least the best cost |

## The cost of not pruning

The raw trees are big. Choosing `k` numbers from `1..n` in increasing order, with no pruning, visits every increasing sequence of length at most `k` — for `n = 20` and `k = 16` that is 1,047,225 calls to produce 4,845 combinations. Subset problems over `n` numbers have 2ⁿ leaves. Assigning `n` items to `k` groups has `kⁿ` leaves; for twelve items and four groups that is 16,777,216 leaves and 22,369,621 calls.

Faster hardware does not rescue this, because each extra item multiplies the work. Prunes do, because they remove subtrees, not nodes.

## Prune 1: not enough elements left

The problem: list every way to choose `k` numbers from `1..n`. The search picks numbers in increasing order; `start` is the smallest number still allowed and `need` is how many more numbers must be picked.

Suppose `n = 5`, `k = 3`, and the search has picked nothing yet. Can the first number be `4`? Then the other two must come from `{5}`, which has one element. That branch cannot produce a single combination, yet an unpruned search explores it anyway.

Derive the bound rather than guessing it. If `v` is the next number picked, the remaining `need - 1` numbers must come from `v + 1 .. n`, which has `n - v` numbers. So we need `n - v ≥ need - 1`, which rearranges to **`v ≤ n - need + 1`**. Putting this bound in the loop condition means the hopeless values are never tried at all.

```java title="CombinationsPrune.java"
public class CombinationsPrune {
    static long calls;
    static int found;

    // Choose `need` more numbers from start..n, in increasing order.
    static void plain(int n, int start, int need) {
        calls++;
        if (need == 0) { found++; return; }
        for (int v = start; v <= n; v++) {
            plain(n, v + 1, need - 1);
        }
    }

    static void pruned(int n, int start, int need) {
        calls++;
        if (need == 0) { found++; return; }
        // v is the smallest of the `need` numbers still to pick; the other need - 1
        // come from v+1..n, so there must be room: v <= n - need + 1.
        for (int v = start; v <= n - need + 1; v++) {
            pruned(n, v + 1, need - 1);
        }
    }

    public static void main(String[] args) {
        int[][] cases = {{5, 3}, {10, 5}, {20, 16}};
        for (int[] c : cases) {
            calls = 0; found = 0;
            plain(c[0], 1, c[1]);
            long plainCalls = calls;
            int plainFound = found;
            calls = 0; found = 0;
            pruned(c[0], 1, c[1]);
            System.out.printf("n=%d k=%d: %,d combinations, plain %,d calls, pruned %,d calls%n",
                    c[0], c[1], plainFound, plainCalls, calls);
        }
    }
}
```

```output
n=5 k=3: 10 combinations, plain 26 calls, pruned 20 calls
n=10 k=5: 252 combinations, plain 638 calls, pruned 462 calls
n=20 k=16: 4,845 combinations, plain 1,047,225 calls, pruned 20,349 calls
```

The program counts calls instead of building lists, so the effect of the prune is visible on its own. When `k` is small relative to `n`, few branches run out of elements and the saving is modest (26 to 20). When `k` is close to `n`, almost every branch of the unpruned tree is a dead end, and the prune removes 98% of the calls.

Check the boundary on the smallest case. With `n = 5` and `need = 3`, the loop runs `v = 1..3`. `v = 3` leaves `{4, 5}` for the remaining two picks — exactly enough, so it must be allowed, and it is. `v = 4` leaves only `{5}`, and it is excluded. An off-by-one here (`v < n - need + 1`) would silently drop the combination `{3, 4, 5}`; this is why you derive the inequality instead of remembering it. A version that checks at the top of the call instead — `if (n - start + 1 < need) return;` — is equally correct but pays one call per hopeless branch before rejecting it.

## Prune 2: sorted break and sum bounds

The problem: given distinct positive integers, list every subset whose sum is exactly `target`. The search walks the subset tree, tracking `remain`, the amount still needed.

### Deriving the prunes

The simplest place to check is on entry to a call: `if (remain < 0) return;`. That is sound — with positive numbers, a negative `remain` can only get more negative — but it rejects a branch only *after* making the recursive call into it.

Move the check to the loop and test before recursing: if `a[i] > remain`, taking `a[i]` overshoots, so skip it with `continue`. That removes the wasted calls, but the loop still examines every later candidate.

Now **sort the numbers in ascending order**. If `a[i] > remain`, then every `a[j]` with `j > i` is at least `a[i]`, so it overshoots too. Nothing later in this loop can be used, and the loop can `break`. Sorting turns a per-candidate test into a test that ends the loop.

There is one more bound, from the other side. Let `suffix[i]` be the sum of `a[i..n-1]`, computed once before the search. If `suffix[start] < remain`, then even taking *every* remaining number falls short, so no completion reaches the target. This prune fires in exactly the cases the sorted break cannot: when the target is large and the problem is running out of material, not overshooting.

```java title="SubsetSum.java"
import java.util.*;

public class SubsetSum {
    private final int[] a;        // sorted ascending; every value positive
    private final int[] suffix;   // suffix[i] = a[i] + a[i+1] + ... + a[n-1]
    private final List<List<Integer>> found = new ArrayList<>();
    long calls = 0;

    SubsetSum(int[] input) {
        a = input.clone();
        Arrays.sort(a);
        suffix = new int[a.length + 1];
        for (int i = a.length - 1; i >= 0; i--) suffix[i] = suffix[i + 1] + a[i];
    }

    List<List<Integer>> solve(int target) {
        search(0, target, new ArrayDeque<>());
        return found;
    }

    private void search(int start, int remain, Deque<Integer> path) {
        calls++;
        if (remain == 0) {                       // path sums to exactly the target
            found.add(new ArrayList<>(path));
            return;
        }
        if (suffix[start] < remain) return;      // even taking everything left falls short
        for (int i = start; i < a.length; i++) {
            if (a[i] > remain) break;            // sorted: every later value is bigger too
            path.addLast(a[i]);
            search(i + 1, remain - a[i], path);
            path.removeLast();
        }
    }

    public static void main(String[] args) {
        SubsetSum small = new SubsetSum(new int[] {8, 3, 6, 2, 5});
        System.out.println(small.solve(10) + " in " + small.calls + " calls");
    }
}
```

```output
[[2, 3, 5], [2, 8]] in 13 calls
```

The constructor sorts a copy and builds `suffix` with one extra slot, `suffix[n] = 0`, so `suffix[start]` is safe even when `start == n`. In `search`, success is tested first, so a path that has just hit the target is recorded before any prune looks at it. The loop then tries each candidate in increasing order and stops at the first one that is too big.

### Dry run

Sorted, the input is `[2, 3, 5, 6, 8]` and the target is 10. Each row is one call, in the order they happen.

| Call | Path | `remain` | What the loop does |
|---|---|---|---|
| 1 | `[]` | 10 | takes 2, 3, 5, 6, 8 in turn (none exceeds 10) |
| 2 | `[2]` | 8 | takes 3, 5, 6, 8 |
| 3 | `[2, 3]` | 5 | takes 5; 6 > 5, **break** |
| 4 | `[2, 3, 5]` | 0 | record `[2, 3, 5]` |
| 5 | `[2, 5]` | 3 | 6 > 3, **break** immediately |
| 6 | `[2, 6]` | 2 | 8 > 2, **break** |
| 7 | `[2, 8]` | 0 | record `[2, 8]` |
| 8 | `[3]` | 7 | takes 5, 6; 8 > 7, **break** |
| 9 | `[3, 5]` | 2 | 6 > 2, **break** |
| 10 | `[3, 6]` | 1 | 8 > 1, **break** |
| 11 | `[5]` | 5 | 6 > 5, **break** |
| 12 | `[6]` | 4 | 8 > 4, **break** |
| 13 | `[8]` | 2 | no numbers left: `suffix[5] = 0 < 2`, return |

Without any prunes, this loop-style search makes one call per subset — 32 calls for five numbers. The pruned search makes 13. Row 5 shows the break at its best: after `[2, 5]` needs only 3 more, the very first candidate, 6, is too big, and the sorted order guarantees 8 is too.

### Measuring where each check pays off

The table below comes from a counting variant of this search run on 30 numbers between 1 and 40 (generated by `java.util.Random` with seed 1, total 764). "Calls" counts recursive calls; "steps" counts loop iterations, which is closer to the real work.

| Target | Check on entry only | + skip with `continue` | + sorted `break` | + suffix bound |
|---|---|---|---|---|
| 60 (157 answers) | 23,887 calls / 23,886 steps | 1,773 / 23,886 | 1,773 / 3,346 | 1,773 / 3,346 |
| 100 (2,744 answers) | 351,633 / 351,632 | 41,237 / 351,632 | 41,237 / 76,382 | 41,212 / 76,357 |
| 734 (11 answers) | — | — | 1,073,741,755 / 1,073,741,823 | 19,756 / 19,824 |

Read across the rows. Testing before recursing removes most *calls*; the sorted `break` then removes most of the remaining *loop iterations*. For small targets the suffix bound almost never fires, because the search is limited by overshooting. For a target close to the total, the situation flips: almost nothing overshoots, so the break never helps, and the search explores about 2³⁰ nodes — over a billion calls — until the suffix bound cuts it to under twenty thousand. Each prune covers a different way to fail. That is a good habit to adopt: for every search, ask "how can a branch fail by having too much?" and "how can it fail by having too little?"

> [!WARNING] These prunes need non-negative numbers
> Both the sorted break and "partial sum already exceeds the target" assume that adding numbers never decreases the sum. With `{3, -2}` and target 1, the path `[3]` has sum 3, which exceeds 1, yet adding `-2` reaches the target. If negatives are possible, either shift the problem (for example, handle negatives separately) or drop those prunes.

```quiz
Q: In the sorted subset-sum search, why can the loop `break` (not just `continue`) when `a[i] > remain`?
- [ ] Because `break` is faster to execute than `continue`
- [x] Because the array is sorted ascending, so every later candidate is also larger than `remain`
- [ ] Because a subset can contain each number only once
- [ ] Because `remain` becomes negative after the break
> Sorting is what turns one failed candidate into a fact about all later candidates. Without sorting, a later value could be small enough, so only `continue` would be sound.

Q: For 30 numbers and a target close to their total, which prune does most of the work?
- [ ] Breaking when a candidate exceeds `remain`
- [x] Returning when the sum of all remaining numbers is less than `remain`
- [ ] Skipping duplicate values
- [ ] Checking `remain < 0` on entry
> When the target is near the total, branches fail by running out of material, not by overshooting. The suffix-sum bound detects "too little left"; in the measurement it cut about a billion calls to under twenty thousand.
```

## Prune 3: skipping duplicate branches

If the input contains repeated values, the same subset can be built in more than one way. With `[1, 1, 2, 3]` and target 3, picking the first `1` then `2` and picking the second `1` then `2` both produce `[1, 2]`. Generating everything and removing duplicates afterwards with a `Set` works but wastes the time spent building the copies, which can be exponential.

The pruning fix is: **at a given depth, never start a branch with a value already used to start a branch at that same depth.** After sorting, equal values are adjacent, so the rule becomes `if (i > start && a[i] == a[i - 1]) continue;`. The `i > start` part matters. It lets the *first* copy be used, including when it follows an equal value that was chosen at the previous depth — that is how `[1, 1, ...]` remains possible — and blocks only later copies at the same depth, which would repeat a subtree that has already been explored.

The skip must be `continue`, not `break`, and the program below shows why.

```java title="UniqueSubsetSums.java"
import java.util.*;

public class UniqueSubsetSums {
    static void search(int[] a, int start, int remain, boolean wrongBreak,
                       Deque<Integer> path, List<List<Integer>> out) {
        if (remain == 0) { out.add(new ArrayList<>(path)); return; }
        for (int i = start; i < a.length; i++) {
            if (a[i] > remain) break;                     // sorted: later values are bigger
            if (i > start && a[i] == a[i - 1]) {          // same value at the same depth
                if (wrongBreak) break;                    // BUG: also skips larger values
                continue;                                 // correct: skip only this copy
            }
            path.addLast(a[i]);
            search(a, i + 1, remain - a[i], wrongBreak, path, out);
            path.removeLast();
        }
    }

    public static void main(String[] args) {
        int[] a = {1, 1, 2, 3};                           // already sorted
        for (boolean wrongBreak : new boolean[] {false, true}) {
            List<List<Integer>> out = new ArrayList<>();
            search(a, 0, 3, wrongBreak, new ArrayDeque<>(), out);
            System.out.println((wrongBreak ? "break:    " : "continue: ") + out);
        }
    }
}
```

```output
continue: [[1, 2], [3]]
break:    [[1, 2]]
```

With `continue`, the top-level loop skips the second `1` and goes on to try `2` and `3`, finding `[3]`. With `break`, hitting the second `1` ends the top-level loop, so `3` is never tried and `[3]` is lost. The two kinds of skip rest on different facts: the sorted bound says *everything after this is too big*, which justifies `break`; the duplicate rule says *this particular value is a repeat*, which says nothing about the values after it, so only `continue` is sound. [[a9-combination-sum]] uses the same rule for Combination Sum II.

## Prune 4: symmetry breaking

Some searches explore the same situation many times under different names. The clearest example is partitioning: split numbers into `k` groups ("buckets") with equal sums. Placing the first number into bucket 0 or bucket 3 gives two situations that differ only in which bucket is called what; whatever can be completed from one can be completed from the other by relabelling. An unpruned search explores both — and, deeper down, every permutation of bucket labels.

The **symmetry prune** says: if bucket `b` currently has the same load as some earlier bucket `j < b`, skip `b`. Placing the number into bucket `j` was already tried, and since the state is fully described by the multiset of loads, bucket `b` would lead to an identical sub-search. Empty buckets are the most common case: once one empty bucket has been tried for a number, every other empty bucket is redundant.

Combined with a **capacity prune** — skip a bucket if adding the number would exceed the target sum, which is sound because loads never shrink — and with **largest-first ordering**, this turns a hopeless search into a quick one. Largest-first helps because big numbers have the fewest places they fit, so placing them first makes the capacity prune fire near the root, where it removes the largest subtrees.

```java title="KPartition.java"
import java.util.*;

public class KPartition {
    private final int[] nums;
    private final int[] load;
    private final int target;
    private final int level;   // 0 = no pruning, 1 = capacity, 2 = capacity + symmetry
    long calls = 0;

    KPartition(int[] input, int k, int level, boolean largestFirst) {
        nums = input.clone();
        load = new int[k];
        this.level = level;
        target = Arrays.stream(input).sum() / k;
        if (largestFirst) {
            Arrays.sort(nums);
            for (int a = 0, z = nums.length - 1; a < z; a++, z--) {
                int t = nums[a]; nums[a] = nums[z]; nums[z] = t;
            }
        }
    }

    boolean place(int i) {
        calls++;
        if (i == nums.length) {
            for (int l : load) if (l != target) return false;    // leaf check
            return true;
        }
        for (int b = 0; b < load.length; b++) {
            // Capacity: loads never shrink, so an overfull bucket stays overfull.
            if (level >= 1 && load[b] + nums[i] > target) continue;
            // Symmetry: a bucket with the same load as an earlier bucket leads to
            // the same sub-search, which has already been explored.
            if (level >= 2 && sameAsEarlier(b)) continue;
            load[b] += nums[i];
            if (place(i + 1)) return true;
            load[b] -= nums[i];
        }
        return false;
    }

    private boolean sameAsEarlier(int b) {
        for (int j = 0; j < b; j++) if (load[j] == load[b]) return true;
        return false;
    }

    public static void main(String[] args) {
        int[] nums = {4, 2, 7, 8, 7, 8, 3, 8, 4, 6, 8, 3};   // sum 68, k = 4, target 17
        String[] names = {"no pruning", "capacity", "capacity + symmetry"};
        for (int level = 0; level <= 2; level++) {
            for (boolean largestFirst : new boolean[] {false, true}) {
                KPartition p = new KPartition(nums, 4, level, largestFirst);
                boolean ok = p.place(0);
                System.out.printf("%-19s %-13s -> %-5s %,11d calls%n", names[level],
                        largestFirst ? "largest first" : "as given", ok, p.calls);
            }
        }
    }
}
```

```output
no pruning          as given      -> false  22,369,621 calls
no pruning          largest first -> false  22,369,621 calls
capacity            as given      -> false     100,741 calls
capacity            largest first -> false      17,373 calls
capacity + symmetry as given      -> false       3,366 calls
capacity + symmetry largest first -> false         180 calls
```

The instance was chosen to be impossible, so every version must explore its whole (pruned) tree before answering — the fairest comparison, because an early lucky success cannot flatter any version. You can see by hand why no split exists: the four 8s must go to different buckets (two 8s make 16 and there is no 1 to finish the bucket), so each bucket needs 9 more. A 7 can only make 9 with the 2, and there are two 7s but one 2.

Read the output from top to bottom. Without pruning, ordering is irrelevant: the search builds all 4¹² assignments either way, and 22,369,621 is exactly the number of nodes in that complete tree. The capacity prune alone removes over 99% of the calls, and largest-first ordering makes it six times more effective by making it fire earlier. The symmetry prune then removes the relabelled copies, leaving 180 calls — about 124,000 times fewer than the start, for three short `if` statements and a sort.

Two smaller sound prunes are common before the search starts: if the total is not divisible by `k`, or if any single number exceeds `total / k`, the answer is immediately `false`.

## Prune 5: branch and bound for optimisation

So far the searches looked for answers that *exist*. Optimisation problems ask for the *best* answer, and they allow a stronger kind of prune. Keep the best complete answer found so far, called the **incumbent**. At each node, compute a **bound**: an optimistic estimate of the best result any completion of this node could achieve. If the bound is no better than the incumbent, the whole subtree is pruned. This is **branch and bound**.

The rule for the bound is that it must never be *too pessimistic*. When minimising, the bound must be at most the true best cost of any completion (a lower bound); when maximising, at least it (an upper bound). A bound that overestimates the cost of a minimisation branch might discard the branch that holds the true optimum.

The example: assign jobs with given durations to `k` workers so that the time when the last worker finishes — the largest total load — is as small as possible. While building an assignment, the largest load so far can only grow, so it is a valid lower bound on the finishing time of any completion. If placing the next job would give some worker a load of at least the incumbent, that branch cannot produce a strictly better plan.

```java title="JobAssignment.java"
import java.util.*;

public class JobAssignment {
    private final int[] jobs;
    private final int[] load;
    private final boolean useBound;
    private int best = Integer.MAX_VALUE;   // incumbent: best finishing time found so far
    long calls = 0;

    JobAssignment(int[] input, int workers, boolean useBound) {
        jobs = input.clone();
        Arrays.sort(jobs);
        for (int a = 0, z = jobs.length - 1; a < z; a++, z--) {   // largest job first
            int t = jobs[a]; jobs[a] = jobs[z]; jobs[z] = t;
        }
        load = new int[workers];
        this.useBound = useBound;
    }

    int solve() {
        assign(0, 0);
        return best;
    }

    // currentMax = largest load among the workers so far: the cost of this partial plan.
    private void assign(int i, int currentMax) {
        calls++;
        if (i == jobs.length) {
            best = Math.min(best, currentMax);    // complete plan: maybe a new incumbent
            return;
        }
        for (int w = 0; w < load.length; w++) {
            if (sameAsEarlier(w)) continue;       // symmetric worker, already explored
            int newLoad = load[w] + jobs[i];
            // Bound: loads only grow, so this branch can never finish below newLoad.
            if (useBound && newLoad >= best) continue;
            load[w] = newLoad;
            assign(i + 1, Math.max(currentMax, newLoad));
            load[w] -= jobs[i];
        }
    }

    private boolean sameAsEarlier(int w) {
        for (int j = 0; j < w; j++) if (load[j] == load[w]) return true;
        return false;
    }

    public static void main(String[] args) {
        int[] jobs = {13, 11, 9, 9, 8, 7, 7, 6, 5, 4, 3, 2};
        for (boolean bound : new boolean[] {false, true}) {
            JobAssignment j = new JobAssignment(jobs, 4, bound);
            int answer = j.solve();
            System.out.printf("bound %-5s -> best = %d, %,d calls%n", bound, answer, j.calls);
        }
    }
}
```

```output
bound false -> best = 21, 738,593 calls
bound true  -> best = 21, 11,275 calls
```

Both runs use the symmetry prune; only the bound differs. Without it, the search must evaluate every distinct assignment to be sure of the minimum: 738,593 calls. With it, the first complete plan sets an incumbent, and from then on every branch that would push a worker to that load or beyond is abandoned. As better incumbents are found the bound tightens, so pruning gets stronger as the search goes on — 11,275 calls, the same answer.

Three refinements make branch and bound stronger still, and each is a good interview follow-up:

- **Start with a good incumbent.** Run a fast greedy first (here: give each job, largest first, to the currently least-loaded worker) and use its result as the initial `best`. The bound then prunes from the very first branch instead of waiting for the search to find its first complete plan.
- **Use a tighter bound.** No plan can finish before `ceil(total / k)` or before the longest single job finishes, so the larger of those is a lower bound for the whole problem. Here the total is 84 and `k = 4`, so no plan beats 21; once the search finds 21 it can stop outright.
- **Explore promising branches first.** Branch and bound benefits from finding good incumbents early, which is another reason to place the largest jobs first.

> [!NOTE] Branch and bound is not only for backtracking
> Integer-programming solvers branch on fractional variables and use the linear-programming relaxation as their bound, and game-tree search uses the same "this branch cannot beat what I already have" argument in alpha-beta pruning. The vocabulary — incumbent, bound, prune — carries over directly.

## How pruning changes the complexity

Pruning almost never improves the **worst-case** bound. The subset-sum search is still O(2ⁿ) in the worst case, and k-partition is still O(kⁿ): there are inputs (an impossible instance with many near-equal numbers, for example) on which few prunes fire. What prunes change is the number of nodes visited on typical inputs, and that number depends on the data in ways that are hard to express as a formula. That is why the honest way to describe a pruned search is "worst case O(kⁿ); in practice the prunes remove most of the tree, and here is a measurement".

Pruning also has a cost per node. The suffix bound is O(1) after O(n) preprocessing. The symmetry check in `sameAsEarlier` is O(k) per bucket, so O(k²) per node; for small `k` that is negligible next to the subtrees it removes. Sorting costs O(n log n) once. A prune that costs O(n) per node and rarely fires can make a search *slower*; measure before keeping an expensive one.

There is a hard limit to what pruning can do: it cannot detect that two *different* paths reach the *same* state. In k-partition, many different placements of the first six numbers lead to the same set of loads, and the search explores the rest of the problem from each of them. When states repeat like that, memoisation is the right tool — store the result for each state and look it up — which turns k-partition into a bitmask dynamic programme over subsets ([[a11-bitmask-dp]], [[a11-memoization]]). Pruning and memoisation combine well: prune what is hopeless, cache what is repeated.

## Recognising pruning opportunities

When you have a correct but slow backtracking solution, go through these questions in order. Each corresponds to a prune in this lesson.

1. **Does a rule already fail?** Move every constraint check to before the recursive call.
2. **Is there too little left?** Count remaining elements, remaining sum or remaining capacity; compare with what is still needed.
3. **Is there already too much?** Partial sum, partial cost or partial load beyond the limit — and is the quantity monotonic, so the excess cannot be undone?
4. **Would sorting turn a skip into a break?** If candidates are tried in order and a failure implies failure for all later ones, sort and break.
5. **Are branches repeating?** Equal values at the same depth, or interchangeable buckets, workers or colours.
6. **Is it an optimisation?** Keep an incumbent, find an optimistic bound, start with a greedy answer.

## In real systems

**Game engines.** Chess programs search a tree of moves using minimax with **alpha-beta pruning**, which skips moves that cannot affect the final decision because the opponent already has a better alternative elsewhere. Alpha-beta returns exactly the same value as full minimax, and with good move ordering it examines roughly the square root of the nodes — the reason move ordering heuristics are a major part of engine engineering. It is the same lesson as largest-first ordering above: prunes are worth more when good branches are explored first.

**Optimisation solvers.** Mixed-integer programming solvers such as HiGHS, CBC and Gurobi run branch and bound at their core. Their bound comes from solving a relaxed version of the problem in which variables may be fractional; a subtree whose relaxed optimum is no better than the incumbent is pruned. A large part of their engineering is finding tighter bounds (cutting planes) and good incumbents early (primal heuristics) — exactly the two refinements listed for the job-assignment example.

**Query planners.** When a database plans a multi-table join, the number of possible plans grows explosively. PostgreSQL's planner builds plans bottom-up and discards a partial plan when another plan for the same set of tables is cheaper and at least as useful (for example, produces rows in the same sort order). That is a dominance prune: the discarded plan cannot lead to a better final plan than the one kept.

**Constraint and SAT solvers.** Propagation in these solvers is pruning by another name: each deduction removes values that cannot appear in any solution, and clause learning records why a branch failed so equivalent branches are pruned later.

## Trade-offs and alternatives

| Technique | Removes | Cost | Watch out for |
|---|---|---|---|
| Remaining-count bound | Branches without enough elements | O(1) | Off-by-one in the bound |
| Sorted break | All larger candidates at once | Sort O(n log n) | Needs monotonic sums; sorting changes order of output and indices |
| Suffix or capacity bound | Branches with too little left / too much used | O(n) preprocessing, O(1) per check | Negative values make it unsound |
| Duplicate skip | Repeated subtrees from equal values | Sort; O(1) check | Must be `continue`, and `i > start` |
| Symmetry breaking | Relabelled copies of explored subtrees | O(k) per node or less | Only for genuinely interchangeable items |
| Branch and bound | Branches that cannot beat the incumbent | Bound computation per node | Bound must be optimistic, never pessimistic |
| Memoisation / DP | Repeated identical states | Memory for the state table | Needs a compact state |
| Meet in the middle | Splits 2ⁿ into two 2ⁿᐟ² halves | O(2ⁿᐟ²) memory | Only for problems that combine two halves |

Choose by what kind of waste your search has. If it explores hopeless branches, prune. If it explores the same state repeatedly, memoise. If neither helps enough and `n` is around 40, consider meet in the middle; beyond that, reconsider whether exact search is the right approach at all.

## Common mistakes

**Pruning on a quantity that is not monotonic.** "Partial sum exceeds the target, so return" assumes sums only grow. With negative numbers it discards valid answers. Before writing any bound, state the monotonic fact it relies on and check that the input guarantees it.

> [!MISTAKE] Using `break` to skip a duplicate
> `if (i > start && a[i] == a[i - 1]) break;` looks like a harmless variant of the `continue` version but discards every larger value at that depth. In the program above it lost the answer `[3]`. Use `break` only when the condition is true for *all* later candidates — which is what sorting guarantees for "too big", and what it does not guarantee for "equal to the previous one".

**An off-by-one in the remaining-count bound.** Writing `v < n - need + 1` instead of `v <= n - need + 1` silently drops the last valid combination at each level. Derive the inequality from "the rest must fit in `v + 1..n`" and test the boundary case by hand.

**A bound that is not optimistic.** In branch and bound, estimating the remaining cost with a guess that might be *higher* than the true minimum (for a minimisation) can prune the optimal branch. Every bound must be provably on the optimistic side. Also use `>=` versus `>` deliberately: `newLoad >= best` is correct when you only want strictly better plans; when you must list all optimal plans, use `>` so ties survive.

**Prune check placed after a mutation, without undoing it.** Writing `load[b] += x; if (load[b] > target) continue;` skips the `load[b] -= x` at the end of the loop body, corrupting the state for every later branch. Check before mutating, as in `KPartition`, or undo before every `continue`.

**Sorting without considering what it changes.** Sorting reorders elements. If the problem asks for indices, or for answers in the original order, keep the original indices alongside the values, or sort a copy of index–value pairs.

**Believing a prune improves the worst case.** "With pruning it's O(n²)" is almost never true for these problems. Claim what you can prove: the worst-case bound plus the observed effect.

## Interview perspective

In backtracking interviews, the correct-but-unpruned solution is usually the minimum bar; the prunes are where the distinction between candidates appears. Interviewers listen for whether you can *state* a prune, *justify* it and *place* it in the code correctly.

> [!INTERVIEW] What a strong answer sounds like
> "Before coding, the prunes: all numbers are positive, so sorted ascending I can break as soon as a candidate exceeds the remaining sum. If the suffix sum from here is smaller than what I still need, I return. Equal values at the same depth would repeat a subtree, so I skip them with `continue`, not `break`. None of these changes the output — each discarded branch provably contains no answer — but worst case is still exponential."

Questions to be ready for:

- **What makes a prune correct?** No completion of the pruned node is a valid (or better) answer; usually proven from a monotonic quantity.
- **Why sort before Combination Sum?** So one too-large candidate implies all later ones are too large, allowing `break`. See [[a9-combination-sum]].
- **Combinations of `k` from `n`: what is the bound?** The next value `v` must satisfy `v ≤ n - (k - path.size()) + 1`.
- **Partition to K Equal Sum Subsets: how do you make it fast?** Check divisibility and the largest element first, sort descending, skip overfull buckets, skip buckets whose load equals an earlier bucket's (covers empty buckets).
- **Branch and bound versus plain pruning?** Plain pruning removes infeasible branches; branch and bound also removes feasible branches that cannot beat the incumbent, using an optimistic bound.
- **Follow-up: "Does sorting break correctness?"** Not for set-valued answers; it does change output order and indices, which matters if the problem asks for them.
- **Follow-up: "When would you switch to DP?"** When different paths reach the same state — the same remaining target, the same used-set — so a cache would reuse results that pruning cannot.

## Practice

1. **Combinations.** Implement the pruned version from memory and verify on `n = 20, k = 16` that the call count drops as shown.
2. **Combination Sum II.** Candidates may repeat; each may be used once; output unique combinations. Combine sorted break, duplicate skip and (optionally) the suffix bound.
3. **Partition to K Equal Sum Subsets.** Implement `KPartition` with all prunes, then add the two pre-checks (divisibility, largest element). Construct an input where symmetry breaking matters most.
4. **Find Minimum Time to Finish All Jobs.** Start from `JobAssignment`; add a greedy initial incumbent and the `ceil(total / k)` early exit, and measure the change in calls.
5. **Matchsticks to Square.** Recognise it as k-partition with `k = 4` and reuse your solution.
6. **Prune tester.** For any of the above, write a test that runs the search with and without each prune on a few hundred random small inputs and asserts the answers are identical.

## Quick revision {#quick-revision}

- A prune is sound if no completion of the pruned node is a valid answer (feasibility) or a better answer than the incumbent (optimisation).
- Soundness usually comes from a monotonic quantity: sums, loads and costs only grow; elements left only shrink.
- Remaining count: next value `v ≤ n - need + 1`.
- Sorted ascending + positive values: `a[i] > remain` → `break`.
- Suffix bound: `suffix[start] < remain` → return (catches "too little left").
- Duplicates: sort, then `if (i > start && a[i] == a[i - 1]) continue;` — never `break`.
- Symmetry: skip a bucket whose load equals an earlier bucket's; covers empty buckets.
- Largest-first ordering makes capacity prunes fire near the root.
- Branch and bound: incumbent + optimistic bound; start with a greedy incumbent; stop early if the incumbent meets a global lower bound.
- Check before mutating, or undo before `continue`.
- Worst case is still exponential; measure the effect by counting calls.

| Measured on this page | Without | With |
|---|---|---|
| Combinations `n = 20, k = 16` | 1,047,225 calls | 20,349 |
| Subset sum, 30 numbers, target near total | 1,073,741,755 | 19,756 |
| 4-way partition of 12 numbers (impossible) | 22,369,621 | 180 |
| Job assignment, 12 jobs, 4 workers | 738,593 | 11,275 |

## Key takeaways {#key-takeaways}

- Pruning makes exponential searches practical by discarding subtrees that provably contain no answer, without changing the output.
- Every prune needs a one-sentence proof, usually based on a quantity that only moves in one direction.
- Different prunes catch different failures — too much, too little, repeated, symmetric, not better — so strong solutions combine several.
- Ordering matters: sorting enables `break`, and placing the most constrained items first makes prunes fire near the root.
- `break` is for "all later candidates fail"; `continue` is for "this candidate fails"; confusing them silently loses answers.
- Branch and bound extends pruning to optimisation through an incumbent and an optimistic bound.
- Pruning cannot merge repeated states; when they appear, add memoisation or switch to dynamic programming.
