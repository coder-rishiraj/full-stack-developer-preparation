---
summary: The two-heap pattern uses a pair of heaps when a problem needs fast access to two different extremes at once — the boundary between a lower and an upper group, or the best item among those that a second ordering has made available. You will learn both forms, how to keep them consistent with invariants, how lazy deletion lets them handle sliding windows, and how to recognise the pattern in scheduling problems such as IPO.
difficulty: advanced
minutes: 55
objectives:
  - Recognise the two forms of the pattern — partition by value and two orderings of the same items — from a problem statement
  - State and maintain the ordering and size invariants of a partitioned pair of heaps, counting only live elements
  - Implement sliding window median with lazy deletion and explain why every heap root must be kept live
  - Solve unlock-then-choose problems such as IPO with a locked min heap and an available max heap
  - Compare the pattern with TreeMap-based multisets and order-statistic structures, and derive its costs
---

## Introduction

A single heap answers one question fast: "what is the smallest?" or "what is the largest?". Some problems need *two* such answers at the same time, about two different groups of items. The **two-heap pattern** keeps two heaps side by side so that both answers are always one `peek` away.

The pattern comes in two forms that look different but rest on the same idea.

**Partition by value.** The items are split into a lower group and an upper group, and the problem cares about the boundary between them. The running median is the classic case: a max heap holds the lower half, a min heap the upper half, and their roots meet at the median. Percentiles and sliding-window medians are the same form.

**Two orderings of the same items.** Each item has two attributes, and the problem moves items from one group to the other according to the first attribute and then chooses among them according to the second. In the IPO problem, projects are *unlocked* by their capital requirement (a min heap ordered by cost) and then *chosen* by profit (a max heap ordered by profit). Servers move between a "free" heap ordered by weight and a "busy" heap ordered by the time they become free.

This lesson recaps the partition form briefly — it is derived in full in [[a7-running-median]] — then extends it to sliding windows with lazy deletion, and finally teaches the two-orderings form through IPO.

## Before you start

- **Running median** — the derivation of the max-heap/min-heap split and its invariants. See [[a7-running-median]].
- **Max heaps in Java** — `Comparator.reverseOrder()` and why not `b - a`. See [[a7-max-heap]].
- **Lazy deletion** — leaving stale entries in a priority queue and skipping them later. See [[a7-priority-queues]].
- **Sliding windows** — maintaining a summary as a window moves across an array. See [[a2-sliding-window]].
- **Greedy choices** — taking the best available option at each step. See [[a10-heap-greedy]].

## The intuition

Picture two tables in a room. In the first form, the left table holds all the "small" cards and the right table holds all the "large" ones, and each table keeps its card nearest the dividing line on top: the largest card of the left table, the smallest of the right. Whatever happens, you can see the boundary at a glance.

In the second form, the left table is a waiting area sorted by when each card becomes eligible, and the right table holds eligible cards sorted by how good they are. As time (or capital, or any resource) increases, cards move from the left table to the right; whenever you must choose, you take the best card on the right.

In both cases, each table only ever needs its top card to be instantly visible — the defining property of a heap — and the work is in moving cards between tables while keeping the rules true.

## Form 1: partition by value

Keep `low`, a max heap, and `high`, a min heap, with two invariants:

- **Ordering:** every value in `low` ≤ every value in `high` — equivalently `low.peek() <= high.peek()`.
- **Size:** `low` has the same number of elements as `high`, or one more. (Other ratios give other percentiles: keep `low` at 90% of the elements and its root is the 90th percentile.)

To insert `x`: put it in `low` if `low` is empty or `x <= low.peek()`, otherwise in `high`; then, if one heap is too large, move its root to the other. Moving a root never breaks ordering, because the root is the value closest to the boundary. The median is `low.peek()` when `low` is larger, and the average of both roots — computed in `long` to avoid overflow — when the sizes are equal. Inserts cost O(log n), the median O(1). The step-by-step derivation, proof and dry run are in [[a7-running-median]].

That design handles insertions only. The interesting extension is removal.

## Sliding window median: why removal is hard

*Given an array and a window size k, return the median of every window of k consecutive elements.* For `nums = [1, 3, -1, -3, 5, 3, 6, 7]` and k = 3, the windows are `[1, 3, -1]`, `[3, -1, -3]`, … and the medians are `[1, -1, -1, 3, 5, 6]`.

**Naive approach.** Sort each window: O(k log k) per window, O(n · k log k) in total. With n = 10⁵ and k = 5 × 10⁴, that is far too slow.

**Two heaps, plus removal.** As the window slides, one element enters and one leaves. Entering is an ordinary two-heap insert. Leaving is the problem: the element to remove may sit anywhere inside one of the heaps, and `PriorityQueue.remove(Object)` finds it by linear scan, O(k). That gives O(n · k) overall — better, but still too slow for large windows.

**Lazy deletion.** Do not remove the element when it leaves. Record that one copy of its value is **pending deletion** in a map, adjust the *count* of live elements on its side, and physically remove it only when it surfaces at the root of its heap. A dead element buried inside a heap does no harm, because the only values the algorithm ever reads are the roots. The rule that makes this safe is a third invariant:

- **Live roots:** after every operation, the root of each heap is a live (not pending-deletion) element.

Whenever an operation might expose a dead element at a root — after a poll, or after marking the current root as dead — call `prune`, which pops roots while they are pending deletion.

The size invariant must now count **live** elements, not `heap.size()`, because the heaps physically contain dead entries. So the structure tracks `lowSize` and `highSize` separately.

## Implementation: sliding window median

```java title="SlidingWindowMedian.java"
import java.util.*;

public class SlidingWindowMedian {
    private final PriorityQueue<Integer> low = new PriorityQueue<>(Comparator.reverseOrder());
    private final PriorityQueue<Integer> high = new PriorityQueue<>();
    private final Map<Integer, Integer> delayed = new HashMap<>();  // value -> removals pending
    private int lowSize = 0, highSize = 0;                          // live elements only

    /** Pops roots that were removed earlier. Keeps the invariant: both roots are live. */
    private void prune(PriorityQueue<Integer> heap) {
        while (!heap.isEmpty()) {
            int top = heap.peek();
            Integer pending = delayed.get(top);
            if (pending == null) return;
            if (pending == 1) delayed.remove(top); else delayed.put(top, pending - 1);
            heap.poll();
        }
    }

    /** Restores the size invariant using live counts: lowSize is highSize or highSize + 1. */
    private void rebalance() {
        if (lowSize > highSize + 1) {
            high.offer(low.poll());
            lowSize--; highSize++;
            prune(low);                         // a dead element may now be low's root
        } else if (lowSize < highSize) {
            low.offer(high.poll());
            highSize--; lowSize++;
            prune(high);
        }
    }

    void add(int x) {
        if (low.isEmpty() || x <= low.peek()) { low.offer(x); lowSize++; }
        else { high.offer(x); highSize++; }
        rebalance();
    }

    void remove(int x) {
        delayed.merge(x, 1, Integer::sum);      // physically removed later, when it surfaces
        if (x <= low.peek()) {
            lowSize--;
            if (x == low.peek()) prune(low);
        } else {
            highSize--;
            if (x == high.peek()) prune(high);
        }
        rebalance();
    }

    double median() {
        return lowSize > highSize ? low.peek() : ((long) low.peek() + high.peek()) / 2.0;
    }

    static double[] medians(int[] nums, int k) {
        SlidingWindowMedian w = new SlidingWindowMedian();
        double[] result = new double[nums.length - k + 1];
        for (int i = 0; i < nums.length; i++) {
            w.add(nums[i]);
            if (i >= k) w.remove(nums[i - k]);  // the element that just left the window
            if (i >= k - 1) result[i - k + 1] = w.median();
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(medians(new int[]{1, 3, -1, -3, 5, 3, 6, 7}, 3)));
        System.out.println(Arrays.toString(medians(new int[]{1, 2, 3, 4, 2, 3, 1, 4, 2}, 4)));
        System.out.println(Arrays.toString(medians(
                new int[]{Integer.MAX_VALUE, Integer.MAX_VALUE}, 2)));
    }
}
```

```output
[1.0, -1.0, -1.0, 3.0, 5.0, 6.0]
[2.5, 2.5, 3.0, 2.5, 2.5, 2.5]
[2.147483647E9]
```

The implementation was checked against a sort-every-window solution on thousands of random arrays with many duplicate values. Walk through the parts:

**`remove` decides the side by value.** Since every live value in `low` is ≤ `low.peek()` and every live value in `high` is ≥ it, a value `x <= low.peek()` belongs to `low` (or, if it equals the root, an equal copy is in `low` — and equal copies are interchangeable). So the live count of that side drops by one. If `x` is the root itself, the root just became dead, so `prune` must run at once to restore the live-roots invariant.

**`rebalance` prunes after every poll.** Moving `low`'s root to `high` exposes a new root of `low`, which might be a dead element that was buried; pruning fixes that. The element *offered* to the other heap was a live root, so the receiving heap's root stays live.

**Sizes come from counters.** `lowSize` and `highSize` count live elements; `low.size()` would include dead entries and give wrong medians.

**The window briefly holds k + 1 elements.** The loop adds the new element before removing the old one. That keeps `low` non-empty when `remove` calls `low.peek()`, even when k = 1.

### Complexity

Every element is added once, marked dead at most once, and physically polled at most once. Dead elements can accumulate inside the heaps — in the worst case, a heap may hold O(n) entries, for example when departing values keep landing deep inside one heap — so each heap operation costs O(log n) rather than O(log k). Total time is **O(n log n)**, and space is O(n) in the worst case for the heaps and the map. In typical inputs the heaps stay close to size k.

## Form 2: two orderings of the same items (IPO)

*You start with capital `w` and may complete at most `k` projects. Project `i` requires capital `capital[i]` to start (it is not spent) and adds `profits[i]` to your capital when done. Maximise your final capital.*

For `k = 2`, `w = 0`, `profits = [1, 2, 3]`, `capital = [0, 1, 1]`: with capital 0 only project 0 is affordable; doing it gives capital 1, which unlocks projects 1 and 2; the more profitable is project 2, giving 4.

**Greedy insight.** At any moment, among the projects you can afford, doing the most profitable one is never worse: profits are non-negative, capital only grows, so taking the largest profit now leaves you with at least as much capital — and therefore at least as many unlocked projects — as any other choice. The exchange argument behind such greedy choices is covered in [[a10-local-vs-global]].

**Two orderings.** That greedy rule needs two different "best" questions:

- "Which locked projects become affordable now that my capital is `w`?" — the locked projects with the smallest capital requirement: a **min heap by capital**.
- "Among affordable projects, which is most profitable?" — a **max heap by profit**.

Each round: move every project whose capital requirement is ≤ `w` from the locked heap to the available heap, then poll the most profitable available project and add its profit to `w`. Because capital never decreases, a project that has been unlocked stays affordable forever, so items only ever move from the first heap to the second.

```java title="IPO.java"
import java.util.*;

public class IPO {
    /** Max final capital after at most k projects, starting with capital w. */
    static int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {
        int n = profits.length;
        // locked: projects we cannot afford yet, cheapest first
        PriorityQueue<Integer> locked = new PriorityQueue<>(Comparator.comparingInt(i -> capital[i]));
        // available: affordable projects, most profitable first
        PriorityQueue<Integer> available =
                new PriorityQueue<>((i, j) -> Integer.compare(profits[j], profits[i]));
        for (int i = 0; i < n; i++) locked.offer(i);

        for (int round = 0; round < k; round++) {
            while (!locked.isEmpty() && capital[locked.peek()] <= w) {
                available.offer(locked.poll());             // unlocked by our current capital
            }
            if (available.isEmpty()) break;                 // nothing affordable: stop early
            w += profits[available.poll()];                 // greedily take the best project
        }
        return w;
    }

    public static void main(String[] args) {
        System.out.println(findMaximizedCapital(2, 0, new int[]{1, 2, 3}, new int[]{0, 1, 1}));
        System.out.println(findMaximizedCapital(3, 0, new int[]{1, 2, 3}, new int[]{0, 1, 2}));
        System.out.println(findMaximizedCapital(5, 0, new int[]{1, 2, 3}, new int[]{1, 1, 2}));
    }
}
```

```output
4
6
0
```

Dry run of the second call (k = 3, capitals `[0, 1, 2]`, profits `[1, 2, 3]`):

| Round | Capital w | Unlocked this round | Available (by profit) | Chosen | New w |
|---|---|---|---|---|---|
| 1 | 0 | project 0 (needs 0) | {0: profit 1} | 0 | 1 |
| 2 | 1 | project 1 (needs 1) | {1: profit 2} | 1 | 3 |
| 3 | 3 | project 2 (needs 2) | {2: profit 3} | 2 | 6 |

In the third call no project needs 0 capital, so the first round finds nothing affordable and the loop stops early with the starting capital 0. The heaps store indices, and the comparators look up `capital[i]` and `profits[i]`; this avoids creating pair objects. Both comparators use `Integer.compare`.

**Complexity.** Each project moves from `locked` to `available` at most once, and at most k projects are polled from `available`: O((n + k) log n) time and O(n) space. Building `locked` with a sort or the heapify constructor instead of n offers does not change the bound.

## Other problems with the same shape

**Process tasks using servers.** Servers have weights; tasks arrive over time and each takes some duration. Keep a min heap of *free* servers ordered by (weight, index) and a min heap of *busy* servers ordered by (time they become free, weight, index). At each task's arrival time, move every server whose free time has passed from busy to free, then assign the best free server. If none is free, advance time to the earliest busy server's free time. Items move back and forth between the two heaps, each ordered by a different attribute.

**Find right interval.** For each interval, find the interval with the smallest start ≥ its end. One approach processes intervals in decreasing order of end (a max heap by end) and keeps a max heap of starts: for each interval, pop starts while the top start is still ≥ its end, remember the last one popped as the answer, and push that start back for the next interval. Sorting the starts and binary searching each end ([[a3-lower-upper-bounds]]) is simpler and equally fast. The two-heap version is a useful exercise rather than the best tool.

**Meeting scheduling with room numbers.** "Meeting Rooms III" keeps a min heap of free room numbers and a min heap of busy rooms by end time — again, the two-pools form.

The common question to ask: *do I need the best item from one group, while items migrate into that group according to a different attribute?* If yes, the second form applies. *Do I need the elements on either side of a moving boundary?* Then the first.

```quiz
Q: In the sliding window median, why must the sizes be tracked with separate counters instead of heap.size()?
- [ ] Because PriorityQueue.size() is O(n)
- [x] Because the heaps physically contain dead entries waiting for lazy deletion, which must not be counted
- [ ] Because the window size changes
- [ ] Because size() returns the number of distinct values
> Lazy deletion leaves removed values inside the heaps until they reach a root. heap.size() counts them, so the balance check would be wrong. lowSize and highSize count only live elements.

Q: Why is it safe to leave a removed element buried inside a heap?
- [ ] Java removes it automatically during the next offer
- [ ] It is not safe; every removal must be physical
- [x] The algorithm only reads heap roots, and it prunes dead roots whenever one could be exposed
- [ ] Because the map stores the element's index in the heap
> A dead element affects nothing until it becomes a root. Pruning after every poll, and after marking the current root dead, keeps both roots live, so medians are always computed from live values.

Q: In IPO, why does the locked heap order projects by capital while the available heap orders them by profit?
- [ ] Both should order by profit; the split is only for speed
- [x] Capital decides when a project becomes affordable, and profit decides which affordable project to take
- [ ] Because capital and profit are always correlated
- [ ] To avoid integer overflow
> The two heaps answer two different questions: which projects does my current capital unlock (smallest requirement first), and which unlocked project is best (largest profit first). Since capital never decreases, projects only move one way.
```

## How it works internally: invariants as a checklist

Every two-heap solution is a small state machine. Before writing code, write the invariants and check each operation against them.

| Invariant | Partition form | Two-orderings form |
|---|---|---|
| What each heap holds | lower half / upper half | not-yet-eligible / eligible |
| Ordering of each heap | max heap / min heap by value | by eligibility key / by quality key |
| Cross-heap rule | every low value ≤ every high value | every eligible item meets the current threshold |
| Size rule | live sizes equal or low one larger | none |
| With deletions | both roots are live; sizes count live elements | usually not needed |

Then check each operation: does insert preserve every row? Does the move between heaps? Does removal? Bugs in two-heap solutions are almost always an operation that forgets one row — usually the size rule after a removal, or the live-root rule after a poll.

## In real systems

**Robust signal processing.** Median filters over a moving window remove spikes from sensor data and impulse noise from audio and images. Implementations for small windows often sort the window directly; for large windows, two-heap and tree-based moving medians keep the per-sample cost logarithmic.

**Scheduling with eligibility.** Job schedulers frequently have a "not yet runnable" set ordered by the time a job becomes ready (delayed retries, cron triggers) and a "runnable" set ordered by priority. Moving jobs from the first to the second when their time arrives, then picking the highest-priority runnable job, is the two-orderings form. Java's `DelayQueue` implements the first half of that design ([[c3-scheduled-executor]]).

**Resource pools.** Connection pools, GPU schedulers and cloud autoscalers track free resources ordered by preference and busy resources ordered by release time — the same structure as the servers problem.

## Trade-offs and alternatives

**Balanced trees as multisets.** Java has no multiset, but a `TreeMap<Integer, Integer>` of value → count, or a `TreeSet` of `(value, index)` pairs, supports insert, delete and order queries in O(log k) with no lazy deletion. For the sliding window median, two `TreeSet`s of indices (compared by value, then index) keep the window's lower and upper halves with true O(log k) removal and O(k) space. The code is a little longer but has no dead entries.

**Order-statistic trees** (a balanced tree that stores subtree sizes) find the element of any rank in O(log n), which answers medians and every percentile at once. Java's standard library does not include one; a Fenwick tree over compressed values ([[a12-fenwick]]) can play the same role when values are known in advance.

**Sorting per window** is acceptable when k is tiny (say, under 10).

| Approach | Insert | Remove | Median / best | Space | Notes |
|---|---|---|---|---|---|
| Sort each window | — | — | O(k log k) per window | O(k) | Only for tiny k |
| Two heaps + lazy deletion | O(log n) | O(log n) amortized | O(1) | O(n) worst | Short code; dead entries accumulate |
| Two `TreeSet`s of indices | O(log k) | O(log k) | O(1) | O(k) | Exact removal; more code |
| Fenwick tree over ranks | O(log m) | O(log m) | O(log m) | O(m) | Needs values up front (m distinct) |

## Common mistakes

> [!MISTAKE] Counting dead entries as live
> With lazy deletion, `low.size()` and `high.size()` include elements that have already left the window. Balancing by them produces wrong medians that pass small tests. Track live counts explicitly.

**Forgetting to prune after a poll.** Moving `low`'s root to `high` can expose a dead element as `low`'s new root, and the next median reads it. Prune every heap whose root may have changed.

**Removing from the wrong side.** Decide the side of a departing value with the same rule used to insert, `x <= low.peek()`, and prune the heap whose live count you decremented. If the count drops on one side while the pending deletion is later consumed from the other, the live counters no longer match the heaps' real contents.

**Overflow in the median.** Average roots as `((long) a + b) / 2.0`. Windows of large values are a common hidden test.

**Re-scanning all items each round in the two-orderings form.** In IPO, looping over all n projects every round to find affordable ones is O(n · k). The locked min heap makes each project move exactly once.

**Moving items back when they never return.** In IPO capital never decreases, so items only move from locked to available. In the servers problem items do move back. Know which applies before writing the transfer loop.

## Interview perspective

Interviewers use the two-heap pattern to test whether you can keep several invariants straight under change. Name the heaps by what they *mean* — `lower` and `upper`, `locked` and `available` — rather than `pq1` and `pq2`, and state the invariants before coding.

> [!INTERVIEW] Explaining lazy deletion concisely
> "Heaps can't remove an arbitrary element quickly, so when a value leaves the window I record it in a map and decrement the live count of its side. I only pop it when it reaches a root, and I prune roots after every operation that might expose one. So the roots are always live, the live counts drive the balancing, and every element is pushed and popped once — O(n log n) overall."

Questions that come up:

- **Why not `PriorityQueue.remove(x)`?** It is a linear scan, O(k) per slide, O(n · k) overall.
- **Is O(n log n) tight with lazy deletion?** Dead entries can make a heap grow beyond k, so heap operations are O(log n), not O(log k); the `TreeSet` version is O(n log k).
- **IPO — why is greedy correct?** Taking the largest available profit maximises capital after each step, and more capital only unlocks more projects; no other choice can lead to a better state.
- **How would you return the 90th percentile of a window?** Same structure, with the size rule changed to keep 90% of the live elements in `low`.

## Practice

1. **Sliding Window Median** — implement the lazy-deletion version, then the two-`TreeSet` version, and compare code length and complexity.
2. **IPO** — then modify it so projects have a duration and you can run only one at a time.
3. **Process Tasks Using Servers** — the two-pools form with items moving in both directions.
4. **Meeting Rooms III** — free rooms by number, busy rooms by end time and number.
5. **Find Right Interval** — solve with sorting and binary search, then with two heaps, and explain which you would choose.
6. **Moving percentile** — return the 75th percentile of each window of size k.

The DSA explorer lists these problems under the Two-Heap Pattern topic.

## Quick revision {#quick-revision}

- Two forms: **partition by value** (max heap lower, min heap upper; roots meet at the boundary) and **two orderings** (eligibility heap feeds a quality heap).
- Partition invariants: low ≤ high; live sizes equal or low one larger (other ratios → other percentiles).
- Median: `low.peek()` if low is larger, else `((long) low.peek() + high.peek()) / 2.0`.
- Sliding window: lazy deletion — map of pending removals, live counters per side, prune roots after every poll and when the root dies.
- Decide a departing value's side with `x <= low.peek()`.
- Sliding window cost: O(n log n) time, O(n) worst-case space; `TreeSet` version O(n log k), O(k).
- IPO: locked min heap by capital → available max heap by profit; each round unlock all affordable, take the best. O((n + k) log n).
- Servers / Meeting Rooms III: free heap by preference, busy heap by release time; items move both ways.

## Key takeaways {#key-takeaways}

- Use two heaps when a problem needs two extremes at once: either both sides of a value boundary, or the best item within a group that a second attribute keeps refilling.
- Write the invariants first — ordering, size, live roots — and check every operation against each one.
- Lazy deletion makes heaps usable for sliding windows by deferring removals until a dead value reaches a root; balance by live counts, never by `size()`.
- In the two-orderings form, the first heap decides *when* an item becomes eligible and the second decides *which* eligible item is best.
- Balanced-tree multisets are the main alternative when you need exact removals and tighter space bounds.
