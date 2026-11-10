---
summary: Some greedy algorithms need "the best item right now" while the set of items keeps changing — merged results re-enter the pool, new options unlock over time, or an earlier choice turns out to be a mistake. You will learn the three shapes of heap-based greedy (combine the smallest, unlock then choose, commit then regret), why a priority queue makes each step O(log n), and how to prove these greedy choices correct.
difficulty: intermediate
minutes: 60
objectives:
  - Explain why a single sort is not enough when candidates appear, merge or expire during the algorithm
  - Implement the three heap-greedy shapes in Java — combine the two smallest, unlock by one key and choose by another, and commit then undo the worst choice
  - Justify each greedy step with an exchange argument or an invariant
  - Choose the heap's polarity and contents, and derive O(n log n) running times for each algorithm
  - Recognise heap-greedy problems such as Huffman coding, Maximum Events, Course Schedule III, Refueling Stops and Furthest Building
---

## Introduction

A hospital emergency department does not treat patients in the order they arrive, and it does not decide the order once at the start of the day either. Every time a doctor becomes free, they take the **most urgent patient currently waiting**. New patients keep arriving, some patients' conditions change, and the "most urgent" one is different every time the question is asked.

Many greedy algorithms have the same need. In [[a10-sorting-greedy]] the order of decisions was fixed: sort once, then scan. That works when an item's priority never changes. It fails when:

- the result of a choice goes **back into the pool** (merging two sticks creates a new stick that competes with the rest),
- items **become available over time** (an event can only be attended once it has started),
- or a choice made earlier should be **revisited** when better information arrives (a course you signed up for now pushes you past a deadline).

In all three cases the algorithm repeatedly asks "what is the best candidate *now*?" over a set that keeps changing. A **priority queue**, implemented as a binary **heap**, answers that question in O(log n) per insertion or removal, and that is what makes these greedy algorithms fast. This lesson calls the pattern **heap + greedy**.

You will meet it in compression (Huffman coding), shortest paths (Dijkstra's algorithm), schedulers and timers, and in interview problems such as *Minimum Cost to Connect Sticks*, *Maximum Number of Events That Can Be Attended*, *IPO*, *Course Schedule III*, *Minimum Number of Refueling Stops* and *Furthest Building You Can Reach*.

## Before you start

- **Priority queues in Java** — `PriorityQueue` with `add`, `peek` and `poll`, min-heap by default, `Collections.reverseOrder()` for a max-heap, comparators with tie-breakers. See [[a7-priority-queues]] and [[a1-priorityqueue]].
- **Sort-and-scan greedy** — choosing a key and proving it with an exchange argument. See [[a10-sorting-greedy]].
- **Interval selection** — earliest-end-first and why it is safe. See [[a10-interval-scheduling]]; the events problem below extends it.
- **Heap patterns you may already know** — bounded heaps for top K ([[a7-top-k]]) and k-way merge ([[a7-k-way-merge]]). This lesson focuses on the greedy *reasoning*, and links to those lessons for the data-structure detail.

## The intuition

Picture a pile of cards where the best card is always on top and you can add a card anywhere and it finds its own place. Taking the top card or adding a card costs a few moves, never a full reshuffle. That is the contract a heap gives you.

Now consider how greedy algorithms use that pile.

- **Combine:** take the two top cards, glue them into one card, and put it back. The glued card may land anywhere in the pile.
- **Unlock then choose:** cards are dealt into the pile over time according to one rule (their start time, their required capital), and you always take the top card according to a different rule (earliest deadline, largest profit).
- **Commit then regret:** you add every card you see to your hand, and the moment your hand becomes invalid you throw away the worst card in it — which a max-heap keeps on top.

In each case, the heap's job is to make "the best right now" cheap, and the greedy argument's job is to show that taking it is never a mistake.

## Why sorting once is not enough

Take the simplest example, *Minimum Cost to Connect Sticks*. You have sticks of lengths `[1, 8, 3, 5]`. Joining sticks of length `x` and `y` costs `x + y` and produces a stick of length `x + y`. Join them all into one stick at minimum total cost.

If you sort once — `[1, 3, 5, 8]` — and join from the left, you get `1 + 3 = 4`, then `4 + 5 = 9`, then `9 + 8 = 17`, total 30. That happens to match the optimum here, but it is luck: on `[4, 4, 5, 5]`, joining left to right costs `8 + 13 + 18 = 39`, while joining the two 4s, then the two 5s, then the results costs `8 + 10 + 18 = 36`. The merged stick of length 8 is *larger* than the remaining 5s, so after the first join, the "two smallest" are no longer at the front of the sorted array.

The naive fix — find the two smallest by scanning, or re-sort after each join — costs O(n) or O(n log n) per step, so O(n²) or O(n² log n) in total. A heap keeps everything partially ordered so that each of the `n − 1` joins costs O(log n): **O(n log n)** in total.

The same reasoning applies to all three shapes below. Whenever the candidate set changes between decisions, the one-time sort of [[a10-sorting-greedy]] goes stale, and a heap is the cheapest structure that stays up to date.

## Shape 1: repeatedly combine the two smallest

**Problem (Minimum Cost to Connect Sticks).** Given stick lengths, repeatedly join two sticks at a cost equal to the sum of their lengths, until one stick remains. Minimise the total cost.

**Seeing the structure.** Draw the joins as a binary tree: the original sticks are leaves, and each join is an internal node whose value is the sum below it. The total cost is the sum of all internal node values. Each original stick is counted once for every join it takes part in, which is its **depth** in the tree. So

`total cost = Σ length(stick) × depth(stick)`.

To minimise that, long sticks should be shallow and short sticks deep — the same objective as building an optimal prefix code, where frequent characters get short codes.

**The greedy rule.** Always join the **two shortest** sticks currently available. The exchange argument: in any optimal tree, some two sibling leaves sit at the maximum depth. If the two shortest sticks are not those siblings, swap them in. Moving a shorter stick deeper and a longer stick shallower never increases `Σ length × depth`. So some optimal tree joins the two shortest sticks first. Once joined, they behave like a single stick of their combined length, and the same argument applies to the smaller problem. This is exactly the proof of **Huffman's algorithm** (David Huffman, 1952), with frequencies in place of lengths.

```java title="ConnectSticks.java"
import java.util.PriorityQueue;

public class ConnectSticks {

    /** Joining sticks of lengths x and y costs x + y; return the cheapest way to join all. */
    static long connectSticks(int[] sticks) {
        PriorityQueue<Long> heap = new PriorityQueue<>();
        for (int s : sticks) heap.add((long) s);
        long cost = 0;
        while (heap.size() > 1) {
            long a = heap.poll(), b = heap.poll();   // the two shortest sticks right now
            cost += a + b;
            heap.add(a + b);                         // the joined stick competes again
        }
        return cost;
    }

    public static void main(String[] args) {
        System.out.println(connectSticks(new int[]{2, 4, 3}));
        System.out.println(connectSticks(new int[]{1, 8, 3, 5}));
        System.out.println(connectSticks(new int[]{5}));
    }
}
```

```output
14
30
0
```

Trace `[1, 8, 3, 5]`:

| Step | Heap before | Polled | Join cost | Running cost | Heap after |
|---|---|---|---|---|---|
| 1 | {1, 3, 5, 8} | 1, 3 | 4 | 4 | {4, 5, 8} |
| 2 | {4, 5, 8} | 4, 5 | 9 | 13 | {8, 9} |
| 3 | {8, 9} | 8, 9 | 17 | 30 | {17} |

A single stick needs no joins, so the loop does not run and the cost is 0. The heap stores `Long` because the joined lengths and the total can exceed the `int` range when there are many long sticks.

**Complexity.** Building the heap with `n` insertions is O(n log n) (Java's `PriorityQueue` constructor that takes a collection heapifies in O(n), but that saving does not change the total). There are `n − 1` joins, each with two polls and one add at O(log n): O(n log n) time, O(n) space.

> [!NOTE] Where Huffman coding lives
> The DEFLATE format, used by gzip, zlib and PNG, encodes data with Huffman codes. Real encoders add constraints such as a maximum code length, so they do not run the textbook algorithm unchanged, but the "merge the two least frequent" step is the core idea.

## Shape 2: unlock by one key, choose by another

**Problem (Maximum Number of Events That Can Be Attended).** Event `i` runs from day `startᵢ` to day `endᵢ` inclusive. You can attend an event on any one day within its range, and attend at most one event per day. Maximise the number of events attended.

**Two orders, two jobs.** An event cannot be attended before it starts, so events must **enter** the candidate pool in start order. Among the events that are open today, which one should you attend? The one that **ends soonest** — every other open event will still be available tomorrow at least as long as it is. These are different keys, which is the signature of this shape: sort by the unlocking key, and keep a heap ordered by the choosing key.

**Why earliest end is safe.** Suppose on day `d` greedy attends event `e`, the open event with the smallest end, and some optimal plan attends a different event `x` on day `d`.

- If the optimal plan never attends `e`, replace `x` by `e` on day `d`. The count is unchanged.
- If the optimal plan attends `e` on a later day `d′`, swap: attend `e` on `d` and `x` on `d′`. That is valid because `x` was open on day `d`, so it starts by `d < d′`, and `end(x) ≥ end(e) ≥ d′`, so `x` is still open on `d′`.

Either way, an optimal plan agrees with greedy on day `d`. This is the same earliest-deadline idea that made earliest-end interval selection ([[a10-interval-scheduling]]) and EDF scheduling ([[a10-sorting-greedy]]) optimal, now applied one day at a time.

```java title="MaxEvents.java"
import java.util.Arrays;
import java.util.PriorityQueue;

public class MaxEvents {

    /** events[i] = {startDay, endDay}, inclusive; attend at most one event per day. */
    static int maxEvents(int[][] events) {
        int[][] s = events.clone();
        Arrays.sort(s, (a, b) -> Integer.compare(a[0], b[0]));
        PriorityQueue<Integer> openEnds = new PriorityQueue<>();  // end days of open events
        int i = 0, attended = 0, n = s.length;
        int day = 0;
        while (i < n || !openEnds.isEmpty()) {
            if (openEnds.isEmpty()) day = Math.max(day, s[i][0]);   // skip idle days
            while (i < n && s[i][0] <= day) openEnds.add(s[i++][1]); // unlock events
            while (!openEnds.isEmpty() && openEnds.peek() < day) openEnds.poll(); // expired
            if (!openEnds.isEmpty()) {
                openEnds.poll();                // attend the open event that ends soonest
                attended++;
            }
            day++;
        }
        return attended;
    }

    public static void main(String[] args) {
        System.out.println(maxEvents(new int[][]{{1, 2}, {2, 3}, {3, 4}}));
        System.out.println(maxEvents(new int[][]{{1, 2}, {2, 3}, {3, 4}, {1, 2}}));
        System.out.println(maxEvents(new int[][]{{1, 4}, {4, 4}, {2, 2}, {3, 4}, {1, 1}}));
        System.out.println(maxEvents(new int[][]{{1, 1}, {1, 1}, {1, 1}}));
        System.out.println(maxEvents(new int[][]{{1, 5}, {1, 1}, {1, 1}, {100000, 100000}}));
    }
}
```

```output
3
4
4
1
3
```

The heap holds only **end days**: once an event is unlocked, its start no longer matters. Each day has three steps in a fixed order — unlock, discard expired, attend — and the order matters. Unlocking first lets an event that starts today be chosen today; discarding before attending stops the code from "attending" an event that ended yesterday. Expired events are removed lazily, only when they reach the top; an expired event buried in the heap does no harm until then.

Trace the third input, sorted by start as `[1,4] [1,1] [2,2] [3,4] [4,4]`:

| Day | Unlocked (end days) | Expired removed | Heap before attending | Attend (end) | Total |
|---|---|---|---|---|---|
| 1 | 4, 1 | — | {1, 4} | 1 | 1 |
| 2 | 2 | — | {2, 4} | 2 | 2 |
| 3 | 4 | — | {4, 4} | 4 | 3 |
| 4 | 4 | — | {4, 4} | 4 | 4 |

On day 1, attending `[1,4]` instead of `[1,1]` would have lost `[1,1]` for good; the heap's earliest-end choice avoids that.

**Complexity.** The `day = Math.max(day, s[i][0])` line jumps over days on which nothing is open, so the loop does not walk through every calendar day up to 100,000 when events are sparse — the last test jumps from day 3 straight to day 100,000. Each loop iteration either attends an event (at most `n` times) or finds the heap empty, which triggers a jump to the next unlocked event (also at most `n` times). Every event is added once and polled at most once. Sorting is O(n log n) and the heap work is O(n log n), so the total is **O(n log n)** time and O(n) space.

**The same shape elsewhere.** *IPO* unlocks projects by required capital and chooses by profit ([[a7-two-heap-pattern]]). *Meeting Rooms II* unlocks meetings by start and frees rooms by end ([[a10-interval-scheduling]]). *Single-Threaded CPU* unlocks tasks by enqueue time and chooses by processing time. **Dijkstra's algorithm** is the most famous member: vertices become reachable as edges are relaxed, and the algorithm always settles the closest unsettled vertex ([[a8-dijkstra]]).

```quiz
Q: In Maximum Events, why is the heap ordered by end day rather than start day?
- [ ] Because events must be sorted by end day to be unlocked correctly
- [x] Because every open event has already started, so the only thing that distinguishes them is how soon each becomes unavailable
- [ ] Because a min-heap cannot store start days
- [ ] Because ordering by start day would be O(n²)
> Start day controls when an event enters the pool, which the sorted scan already handles. Among events that are open today, the one ending soonest is the one most at risk of being lost; the exchange argument shows attending it is never worse.

Q: Joining sticks [4, 4, 5, 5]: what does always joining the two smallest cost?
- [ ] 39
- [x] 36
- [ ] 26
- [ ] 18
> 4+4 = 8 (cost 8), then 5+5 = 10 (cost 10), then 8+10 = 18 (cost 18), total 36. Joining left to right in the original sorted order costs 8 + 13 + 18 = 39, because after the first join the new stick of 8 is larger than the 5s; only a heap notices that.
```

## Shape 3: commit now, regret later

The third shape is the least obvious and the most powerful. Instead of deciding carefully before each choice, the algorithm **accepts every candidate tentatively**, and when the accepted set becomes invalid it **undoes the worst accepted choice** — which a heap keeps on top. A greedy algorithm that cannot see the future gets to correct itself after the fact, at O(log n) per correction.

### Course Schedule III

**Problem.** Course `i` takes `durationᵢ` days and must be finished by day `lastDayᵢ`. Courses are taken one at a time, starting on day 1. Maximise the number of courses completed.

**Step 1: order.** For a *fixed* set of courses, the best order is by deadline — that is EDF, proved by the adjacent-swap argument in [[a10-sorting-greedy]]. So process courses in deadline order, and the question becomes which ones to keep.

**Step 2: commit and regret.** Keep a max-heap of the durations taken so far and their total `time`. For each course, take it: push its duration and add it to `time`. If `time` now exceeds the course's deadline, the set is infeasible, so remove the **longest** course in the set.

**Why that works.** The invariant after processing each course is: *the heap holds a largest feasible set among the courses seen so far, and among all largest feasible sets, it has the smallest total duration.* When a new course fits, the set grows by one and remains feasible. When it does not fit, the best you can do is keep the same count, so drop one course — and dropping the longest leaves the smallest possible total, which leaves the most room for future courses. Dropping the longest is also guaranteed to restore feasibility: the dropped duration is at least the new course's duration, so `time` falls back to at most its value before this course, which was within the previous deadline and therefore within the current, later one. This procedure is known as the **Moore–Hodgson algorithm** for minimising the number of late jobs.

```java title="CourseScheduleIII.java"
import java.util.Arrays;
import java.util.Collections;
import java.util.PriorityQueue;

public class CourseScheduleIII {

    /** courses[i] = {duration, lastDay}; a course must finish by lastDay. Maximise count. */
    static int scheduleCourse(int[][] courses) {
        int[][] s = courses.clone();
        Arrays.sort(s, (a, b) -> Integer.compare(a[1], b[1]));       // by deadline
        PriorityQueue<Integer> taken = new PriorityQueue<>(Collections.reverseOrder());
        long time = 0;                                                // total duration taken
        for (int[] c : s) {
            taken.add(c[0]);
            time += c[0];
            if (time > c[1]) time -= taken.poll();   // over the deadline: drop the longest
        }
        return taken.size();
    }

    public static void main(String[] args) {
        System.out.println(scheduleCourse(new int[][]{
            {100, 200}, {200, 1300}, {1000, 1250}, {2000, 3200}}));
        System.out.println(scheduleCourse(new int[][]{{1, 2}}));
        System.out.println(scheduleCourse(new int[][]{{3, 2}, {4, 3}}));
        System.out.println(scheduleCourse(new int[][]{{5, 5}, {4, 6}, {2, 6}}));
    }
}
```

```output
3
1
0
2
```

Trace the last input, sorted by deadline: `(5, 5)`, `(4, 6)`, `(2, 6)`.

| Course (duration, deadline) | Heap after add | `time` | Over deadline? | Action | Heap after |
|---|---|---|---|---|---|
| (5, 5) | {5} | 5 | no | keep | {5} |
| (4, 6) | {5, 4} | 9 | 9 > 6 | drop 5, `time` = 4 | {4} |
| (2, 6) | {4, 2} | 6 | no | keep | {4, 2} |

Two courses. Notice the regret step: the 5-day course was perfectly valid when accepted, but swapping it for the 4-day course kept the count at one while freeing a day, and that freed day is exactly what let the third course fit. A forward-only greedy that never revisited the first course would have finished with one.

The solution was checked against brute force over all subsets on thousands of random inputs. It runs in O(n log n): one sort, then `n` pushes and at most `n` polls.

### Minimum Number of Refueling Stops

**Problem.** A car starts with `startFuel` litres and uses one litre per mile. Stations along the road, in order of position, each hold some fuel; stopping at one adds all of it. Find the fewest stops needed to reach `target`, or `-1`.

**Regret, the other way round.** You do not have to decide whether to stop at a station when you pass it. Drive as far as the current fuel allows, remembering every station passed in a max-heap of fuel amounts. When you cannot go further, **retroactively** stop at the passed station with the most fuel. Since you reached that station anyway, pretending you stopped there is legal — fuel added earlier or later is the same fuel, as long as the car never ran dry, and it did not.

Why the largest? With `k` stops, the reach is `startFuel` plus the fuel of the stations chosen, so to make `k` stops reach as far as possible you want the `k` largest stations among those you could reach. Greedy keeps exactly that: each time it is stuck, it adds the largest unused station within reach. A stays-ahead argument shows that after `k` stops its reach is at least that of any plan with `k` stops.

```java title="RefuelingStops.java"
import java.util.Collections;
import java.util.PriorityQueue;

public class RefuelingStops {

    /** stations[i] = {position, fuel}, sorted by position; 1 litre per mile. */
    static int minRefuelStops(int target, int startFuel, int[][] stations) {
        PriorityQueue<Integer> passed = new PriorityQueue<>(Collections.reverseOrder());
        long reach = startFuel;          // farthest point reachable with the stops chosen so far
        int stops = 0, i = 0;
        while (reach < target) {
            // Every station we can reach becomes a candidate we could have stopped at.
            while (i < stations.length && stations[i][0] <= reach) passed.add(stations[i++][1]);
            if (passed.isEmpty()) return -1;               // stranded
            reach += passed.poll();     // retroactively stop at the biggest station passed
            stops++;
        }
        return stops;
    }

    public static void main(String[] args) {
        System.out.println(minRefuelStops(100, 10, new int[][]{{10, 60}, {20, 30}, {30, 30}, {60, 40}}));
        System.out.println(minRefuelStops(100, 1, new int[][]{{10, 100}}));
        System.out.println(minRefuelStops(1, 1, new int[][]{}));
    }
}
```

```output
2
-1
0
```

In the first case the car reaches mile 10 and passes the 60-litre station; stuck, it takes it (reach 70). Now stations at 20, 30 and 60 are within reach, with 30, 30 and 40 litres; stuck again at 70, it takes the 40 (reach 110). Two stops. In the second case the car cannot reach the first station, so the heap is empty and the answer is `-1`. `reach` is a `long` because the sum of many large fuel amounts can exceed `int`. Each station is pushed and popped at most once: O(n log n).

### Furthest Building You Can Reach

**Problem.** You walk along buildings of given heights. Going down or level is free. Going up by `h` costs either `h` bricks or one ladder (a ladder covers any height). With a fixed supply of bricks and ladders, how far can you get?

Ladders are most valuable on the **largest** climbs. You do not know the largest climbs in advance, so commit tentatively: give every climb a ladder, keeping those climbs in a min-heap. When you have used more ladders than you own, take back the ladder from the **smallest** climb so far and pay for that climb in bricks. If bricks run out, you are stuck at the current building.

```java title="FurthestBuilding.java"
import java.util.PriorityQueue;

public class FurthestBuilding {

    static int furthestBuilding(int[] heights, int bricks, int ladders) {
        PriorityQueue<Integer> ladderClimbs = new PriorityQueue<>();  // climbs given a ladder
        for (int i = 0; i + 1 < heights.length; i++) {
            int climb = heights[i + 1] - heights[i];
            if (climb <= 0) continue;                 // going down or level is free
            ladderClimbs.add(climb);                  // tentatively use a ladder
            if (ladderClimbs.size() > ladders) {
                bricks -= ladderClimbs.poll();        // smallest ladder climb pays in bricks
                if (bricks < 0) return i;             // cannot make step i -> i + 1
            }
        }
        return heights.length - 1;
    }

    public static void main(String[] args) {
        System.out.println(furthestBuilding(new int[]{4, 2, 7, 6, 9, 14, 12}, 5, 1));
        System.out.println(furthestBuilding(new int[]{4, 12, 2, 7, 3, 18, 20, 3, 19}, 10, 2));
        System.out.println(furthestBuilding(new int[]{14, 3, 19, 3}, 17, 0));
    }
}
```

```output
4
7
3
```

Trace the first input with 5 bricks and 1 ladder. The climbs are 2→7 (5), 6→9 (3) and 9→14 (5). After the first climb the heap is {5}: one ladder, fine. After the second it is {3, 5}, two ladders but only one owned, so the 3-climb is paid in bricks (5 − 3 = 2 left). After the third it is {5, 5}; the smallest, 5, would need 5 bricks and only 2 remain, so the walk stops at building 4.

The invariant is that the heap always holds the `ladders` largest climbs so far, which is the best possible use of ladders, so the bricks spent are as few as possible at every point. It is the bounded-heap idea of [[a7-top-k]] used inside a greedy. Time O(n log (L + 1)), where `L` is the number of ladders (the heap never holds more than `L + 1` entries), and O(L) space.

> [!TIP] Spotting the regret shape
> Look for problems where a choice looks fine now but might be the wrong use of a limited resource later — a ladder, a time budget, a stop. If "undo the worst choice so far" always restores validity and never hurts, a heap of past choices turns an apparently exponential search into O(n log n).

## Heap greedy problems you may already know

| Problem | Heap holds | Greedy step | Lesson |
|---|---|---|---|
| Top K largest | The k best so far (min-heap) | Evict the smallest when over k | [[a7-top-k]] |
| Merge k sorted lists | One front element per list | Output the smallest, push its successor | [[a7-k-way-merge]] |
| Task Scheduler, Reorganize String | Remaining counts (max-heap) | Run the most frequent available task | [[a7-priority-queues]] |
| Running median | Lower half (max), upper half (min) | Insert and rebalance | [[a7-running-median]] |
| IPO | Unlocked profits (max-heap) | Take the most profitable affordable project | [[a7-two-heap-pattern]] |
| Meeting Rooms II | End times of busy rooms | Reuse the room that frees soonest | [[a10-interval-scheduling]] |
| Dijkstra's shortest paths | Tentative distances | Settle the closest vertex | [[a8-dijkstra]] |

Read the table as a reminder that "heap + greedy" is not a separate set of tricks: in every row, a greedy rule chooses "the best right now", and the heap makes that choice cheap.

## How it works internally

Java's `PriorityQueue` is a **binary min-heap** stored in an array. `add` (or `offer`) and `poll` are O(log n) because they move one element up or down a tree of height log n; `peek` is O(1); `size` is O(1). A few properties matter for greedy code:

- **Polarity.** The default orders by natural order, smallest first. For a max-heap, pass `Collections.reverseOrder()` or a comparator such as `(a, b) -> Integer.compare(b, a)`. Choosing the wrong polarity produces a plausible-looking wrong answer, so state in a comment what the top of the heap means.
- **Iteration is not sorted.** Printing a `PriorityQueue` or looping over it with `for-each` shows the internal array order. Only repeated `poll` yields sorted order.
- **Arbitrary removal is slow.** `remove(Object)` is O(n), because it must search the array. Heap-greedy algorithms avoid it with **lazy deletion**: leave stale entries inside and discard them when they reach the top, as the events code does with expired events.
- **Ties are unordered.** A heap is not stable; equal keys come out in no guaranteed order. When reproducible output matters, add a tie-breaker such as an index or sequence number.
- **Boxing costs.** `PriorityQueue<Integer>` stores objects, not `int`s. That is fine for interview sizes; performance-critical code sometimes uses a hand-written heap over a primitive array.

When the algorithm needs the best **and** the worst element, or removal of arbitrary elements, a `TreeMap` or `TreeSet` ([[a1-treemap]]) does each in O(log n) at a higher constant cost.

## Complexity summary

| Algorithm | Time | Space | Why |
|---|---|---|---|
| Connect sticks / Huffman | O(n log n) | O(n) | `n − 1` joins, three heap operations each |
| Maximum events | O(n log n) | O(n) | Sort, then each event pushed and polled once |
| Course Schedule III | O(n log n) | O(n) | Sort, then one push and at most one poll per course |
| Refueling stops | O(n log n) | O(n) | Each station pushed and polled at most once |
| Furthest building | O(n log (L + 1)) | O(L + 1) | Heap capped at `L + 1` ladder climbs |

The pattern of the analysis is always the same: count how many times each item enters and leaves the heap (usually at most once each), multiply by O(log heap size), and add the cost of any initial sort.

## In real systems

**Compression.** Huffman coding inside DEFLATE (gzip, zlib, PNG) and in JPEG's entropy coding builds codes by merging the least frequent symbols first.

**Routing.** Link-state routing protocols such as OSPF compute shortest paths with Dijkstra's algorithm, a heap-driven greedy over the network graph.

**Timers and delayed work.** Java's `ScheduledThreadPoolExecutor` keeps scheduled tasks in a heap-based delay queue so that the next task due is always at the front. Event-driven simulators work the same way with a min-heap of future events.

**Resource schedulers.** Cluster and job schedulers repeatedly pick the highest-priority runnable job as jobs arrive and finish — "unlock then choose" in production form — usually with extra rules for fairness and starvation.

## Trade-offs and alternatives

| Approach | Best when | Cost |
|---|---|---|
| Sort once + scan | Priorities never change after sorting | O(n log n), simplest code |
| Heap + greedy | Candidates arrive, merge or are undone during the run | O(n log n), more moving parts |
| `TreeMap` / `TreeSet` | Need min and max, or arbitrary deletes | O(n log n), larger constants |
| Bucket array | Keys are small integers (e.g. 26 letters, days ≤ 10⁵) | O(n + range), no log factor |
| Dynamic programming | No greedy step can be proved safe | Often O(n²) or O(n · capacity) |

A heap is the right tool when a greedy rule is proven but the candidate set is dynamic. If the problem has small integer keys, a bucket array can replace the heap entirely; if you cannot prove the greedy step at all, a heap only makes a wrong answer arrive faster ([[a10-local-vs-global]]).

## Common mistakes

> [!MISTAKE] Min-heap where a max-heap is needed (or the reverse)
> Course Schedule III must drop the *longest* course, so it needs a max-heap; Furthest Building must give up the ladder on the *smallest* climb, so it needs a min-heap. Write down, before coding, "the top of this heap is the item I want to remove next because …".

**Forgetting to push the result back.** In Connect Sticks and Huffman coding, the joined item must re-enter the heap. Without that line the algorithm degenerates into summing pairs of the original items.

**Wrong order of steps in a day loop.** In Maximum Events, unlock before discarding expired events, and discard expired before attending. Swapping them attends events that have already ended or misses events that start today.

**Walking every day up to the maximum.** A loop over days 1 to 10⁵ is fine; a loop over timestamps up to 10⁹ is not. Jump to the next start when the heap is empty.

**Comparator subtraction.** `(a, b) -> b - a` overflows for values far apart. Use `Collections.reverseOrder()` or `Integer.compare(b, a)`.

**Treating the regret step as optional.** A forward-only greedy for Course Schedule III ("take the course if it fits") returns 1 on `(5,5), (4,6), (2,6)`; the answer is 2.

## Interview perspective

Interviewers like these problems because the code is short but the reasoning is not. The signals they look for are: you noticed the candidate set changes, you named what the heap holds and what its top means, and you can say why taking the top is safe.

> [!INTERVIEW] Explaining a regret greedy
> "I'll take courses in deadline order and accept each one. If the total time passes the current deadline, I drop the longest course taken so far. That restores feasibility, because the dropped course is at least as long as the new one, and it keeps the count as high as possible with the least total time used, which is the best position for later courses. A max-heap gives me the longest in O(log n), so it's O(n log n) overall."

Questions to be ready for:

- **Why not sort once?** Because merged items re-enter (sticks), items unlock over time (events), or earlier choices are revised (courses, ladders).
- **Huffman: why the two smallest?** They should be the deepest siblings; swapping them there never increases `Σ weight × depth`.
- **Why does the heap in Maximum Events hold end days only?** Once an event is open, its start is irrelevant; urgency is all that matters.
- **Refueling: isn't stopping retroactively cheating?** No — you passed the station with fuel to spare, so stopping there earlier is a legal plan with the same total fuel.
- **What if keys are small integers?** A bucket array can replace the heap and drop the log factor.

## Practice

1. **Minimum Cost to Connect Sticks** — then output the Huffman code lengths for given character frequencies.
2. **Maximum Number of Events That Can Be Attended** — prove the exchange step in your own words.
3. **Single-Threaded CPU** — identify the unlocking key and the choosing key before coding.
4. **IPO** — compare your solution with the two-heap version in [[a7-two-heap-pattern]].
5. **Course Schedule III** — write the forward-only greedy, find an input where it fails, then add the regret step.
6. **Minimum Number of Refueling Stops** — also solve it with DP (`dp[k]` = farthest reach with `k` stops) and compare O(n²) with O(n log n).
7. **Furthest Building You Can Reach** — explain why the heap never needs more than `ladders + 1` entries.
8. **Maximum Performance of a Team** — sort by efficiency descending, keep the `k` largest speeds in a min-heap.

The DSA explorer lists these problems under the Heap + Greedy topic.

## Quick revision {#quick-revision}

- Use a heap when the greedy's "best right now" changes: items merge back in, unlock over time, or need to be undone.
- Shape 1, combine smallest: poll two, push their sum (Connect Sticks, Huffman). Exchange: smallest are deepest siblings.
- Shape 2, unlock then choose: sort by the unlocking key, heap by the choosing key (Max Events: start / end; IPO: capital / profit; Dijkstra).
- Shape 3, commit then regret: accept tentatively, and when invalid, poll the worst accepted choice (Course Schedule III: max-heap of durations; Furthest Building: min-heap of ladder climbs; Refueling: max-heap of passed fuel).
- Analysis: each item pushed and polled at most once → O(n log n), plus any sort.
- Java: `PriorityQueue` is a min-heap; `Collections.reverseOrder()` for max; iteration is unsorted; `remove(Object)` is O(n), so delete lazily.
- Never compare by subtraction; add tie-breakers when output must be deterministic.

## Key takeaways {#key-takeaways}

- Sorting once works only when priorities are fixed; a heap keeps "the best right now" cheap when the candidate set changes.
- Three shapes cover most heap-greedy problems: combine the two smallest, unlock by one key and choose by another, and commit then undo the worst choice.
- Each greedy step still needs a reason — an exchange argument, a stays-ahead claim or an invariant such as "largest feasible set with the least total time".
- The regret shape lets a greedy algorithm correct earlier choices at O(log n) each, which is why it solves problems a forward-only greedy cannot.
- Counting pushes and pops per item, times O(log n), gives the running time almost every time.
