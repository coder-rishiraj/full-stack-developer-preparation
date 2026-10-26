---
summary: A priority queue hands out the most important waiting item next, not the oldest. You will learn the abstract operations, why a binary heap is the standard implementation, how to design comparators with tie-breakers in Java, how to "change" a priority with lazy deletion, and how to recognise scheduling and best-next problems that a priority queue solves.
difficulty: intermediate
minutes: 55
objectives:
  - Distinguish the priority queue abstract data type from the heap that usually implements it, and compare implementations by cost
  - Use Java's PriorityQueue correctly — constructors, empty-queue behaviour, iteration order, null and thread-safety rules
  - Design comparators that break ties deliberately, including first-come-first-served order among equal priorities
  - Update priorities safely with remove-and-reinsert or lazy deletion, and explain why mutating queued objects corrupts the heap
  - Solve best-next problems such as Meeting Rooms II and Task Scheduler and derive their complexity
---

## Introduction

A hospital emergency room does not treat patients in the order they walk in. A patient with chest pain who arrives at 10:05 is seen before a patient with a sprained ankle who arrived at 9:30. Patients still wait in a queue, but the rule for who goes next is **priority**, not arrival time.

A **priority queue** is the data structure version of that room. You add items, each with a priority, and when you ask for the next item you get the one with the highest priority — whatever order they arrived in. It is one of the most widely used structures in software: operating systems use priority-driven queues to decide which work runs next, timer libraries use them to decide which timeout fires next, and graph algorithms such as Dijkstra's use them to decide which node to explore next.

This lesson treats the priority queue as a tool. The heap that implements it is taught in [[a7-min-heap]] (and its mirror, the [[a7-max-heap|max heap]]); here you will learn to *use* the abstraction well in Java: designing priorities, breaking ties, handling updates, and recognising the problems where "always take the best next item" is the core of the solution. The collections overview in [[a1-priorityqueue]] introduced the class; this lesson goes deeper into patterns and pitfalls.

## Before you start

- **Heaps** — what a min heap is and why insert and remove-min cost O(log n). See [[a7-min-heap]].
- **Queues** — the first-in, first-out (FIFO) model that a priority queue changes. See [[a5-queue]].
- **Comparators** — how Java orders objects and why comparisons must not subtract. See [[a1-comparable-comparator]].
- **Records** — compact immutable classes, useful as queue entries. See [[a1-custom-classes]].

## The intuition: an interface, not a structure

It helps to separate *what* a priority queue promises from *how* it keeps the promise.

A **priority queue** is an **abstract data type (ADT)**: a description of operations and their meaning, with no commitment to a layout in memory. Its core operations are:

| Operation | Meaning |
|---|---|
| insert(x) | Add an item with its priority |
| peek() | Look at the highest-priority item without removing it |
| extract() | Remove and return the highest-priority item |
| size() / isEmpty() | How many items are waiting |

"Highest priority" is defined by you. It may mean the smallest number (earliest deadline, shortest distance) — a **min-priority queue** — or the largest (most urgent, most profitable) — a **max-priority queue**. Either can be turned into the other by reversing the comparison.

A **binary heap** is one possible *implementation* of this ADT, and by far the most common, but not the only one. Keeping the two ideas apart lets you reason clearly: the ADT tells you what your algorithm needs; the implementation tells you what it costs.

## Choosing an implementation

Each candidate structure makes a different trade between inserting and extracting.

| Implementation | insert | peek | extract | Notes |
|---|---|---|---|---|
| Unsorted array or list | O(1) amortized | O(n) | O(n) | Fine for a handful of items |
| Sorted array | O(n) | O(1) | O(1) (from the end) | Inserting shifts elements |
| Balanced BST (`TreeMap`, `TreeSet`) | O(log n) | O(log n) | O(log n) | Also supports arbitrary delete and ordered iteration |
| **Binary heap** | **O(log n)** | **O(1)** | **O(log n)** | Array-backed, small constants |
| d-ary heap (d children per node) | O(log_d n) | O(1) | O(d · log_d n) | Shallower tree; cheaper inserts |
| Fibonacci heap | O(1) amortized | O(1) | O(log n) amortized | O(1) decrease-key; rarely faster in practice |

Why is the binary heap the default? Look at the workload priority queues usually see: roughly as many inserts as extracts, interleaved. The unsorted array pays O(n) on every extract; the sorted array pays O(n) on every insert. Over n operations both cost O(n²). The heap pays O(log n) for each, so O(n log n) in total, and it stores everything in one array without per-node objects. A balanced tree has the same O(log n) bounds but uses more memory and has larger constants; you choose it when you need its extra powers. The Fibonacci heap improves the theoretical bound of Dijkstra's algorithm, but its overhead means binary heaps usually win on real inputs, which is why standard libraries do not ship one.

## Java's PriorityQueue in practice

`java.util.PriorityQueue<E>` is a min-priority queue backed by a binary heap. "Highest priority" means "smallest according to the ordering", where the ordering is either the elements' natural order (`Comparable`) or a `Comparator` you pass in.

```java
PriorityQueue<Integer> minQ = new PriorityQueue<>();                         // natural order
PriorityQueue<Integer> maxQ = new PriorityQueue<>(Comparator.reverseOrder()); // largest first
PriorityQueue<int[]> byFirst = new PriorityQueue<>(Comparator.comparingInt(p -> p[0]));
PriorityQueue<Integer> fromList = new PriorityQueue<>(List.of(5, 1, 4));      // O(n) heapify
```

The methods come in two families that differ only on failure:

| Purpose | Returns special value | Throws exception | Time |
|---|---|---|---|
| Insert | `offer(e)` → `true` | `add(e)` | O(log n) |
| Remove highest priority | `poll()` → `null` if empty | `remove()` → `NoSuchElementException` | O(log n) |
| Examine highest priority | `peek()` → `null` if empty | `element()` → `NoSuchElementException` | O(1) |
| Remove a specific object | `remove(Object o)` → `false` if absent | — | O(n) |
| Membership | `contains(Object o)` | — | O(n) |

Four rules about this class cause most bugs.

**Only the head is ordered.** Iterating with for-each, calling `toString()`, using `stream()` or copying into a list shows the internal heap array, not sorted order. To consume in priority order you must `poll` repeatedly.

**Empty means `null`.** `poll()` and `peek()` return `null` on an empty queue, and auto-unboxing that `null` into an `int` throws `NullPointerException`. Write `while (!pq.isEmpty())` loops, or check before reading.

**No `null` elements.** `offer(null)` throws `NullPointerException`, because `null` is how the class signals "empty".

**Not thread-safe.** Use `PriorityBlockingQueue` when several threads share a queue; its `take()` blocks until an element is available, which is what a worker thread wants. `DelayQueue` is a related concurrent queue that releases elements only when their delay has expired.

## Designing priorities and tie-breakers

The comparator *is* your definition of priority, so design it like an interface. Put the primary key first and decide explicitly what happens when the primary keys are equal.

That second decision matters more than it looks. A heap is **not stable**: when two items have equal priority, it promises nothing about which comes out first — in particular, not that the earlier arrival does. If your problem requires first-come-first-served among equals (patients of the same severity, jobs of the same priority, events at the same timestamp), you must encode arrival into the priority with a **sequence number**.

```java title="Triage.java"
import java.util.*;

public class Triage {
    record Patient(String name, int severity, long arrival) {}

    public static void main(String[] args) {
        String[] names = {"Ana", "Ben", "Cal", "Dee", "Eli", "Fay"};
        int[] severity = {2, 1, 2, 1, 2, 1};   // 1 = most urgent

        // Priority only: patients with equal severity come out in no promised order.
        PriorityQueue<Patient> bySeverity =
                new PriorityQueue<>(Comparator.comparingInt(Patient::severity));
        // Priority, then arrival: equal severities are served first come, first served.
        PriorityQueue<Patient> fair = new PriorityQueue<>(
                Comparator.comparingInt(Patient::severity)
                          .thenComparingLong(Patient::arrival));

        long clock = 0;
        for (int i = 0; i < names.length; i++) {
            Patient p = new Patient(names[i], severity[i], clock++);
            bySeverity.offer(p);
            fair.offer(p);
        }
        System.out.println("severity only:    " + order(bySeverity));
        System.out.println("severity+arrival: " + order(fair));
    }

    static String order(PriorityQueue<Patient> pq) {
        StringJoiner out = new StringJoiner(" ");
        while (!pq.isEmpty()) {
            Patient p = pq.poll();
            out.add(p.name() + "(" + p.severity() + ")");
        }
        return out.toString();
    }
}
```

```output
severity only:    Ben(1) Dee(1) Fay(1) Ana(2) Eli(2) Cal(2)
severity+arrival: Ben(1) Dee(1) Fay(1) Ana(2) Cal(2) Eli(2)
```

With severity alone, Eli (who arrived fifth) is treated before Cal (who arrived third). Nothing is broken — the queue kept its promise about severity — but it is not what an emergency room means by "fair". Adding `thenComparingLong(Patient::arrival)` makes the ordering total and deterministic: the sequence number is unique, so no two patients ever compare as equal. The exact order of ties without a tie-breaker depends on the heap's internal swaps, so do not rely on the first line's order; rely only on the fact that it is unspecified.

The record also shows a good habit: an immutable entry type with named fields. `int[]` pairs are common in interview code and acceptable for speed, but `cur.severity()` cannot be confused with `cur.arrival()` the way `cur[0]` and `cur[1]` can.

> [!WARNING] Comparators must not subtract
> `(a, b) -> a.severity() - b.severity()` works for small values and silently fails when values are far apart, because the subtraction overflows `int`. Use `Comparator.comparingInt`, `Integer.compare` or `Long.compare`. The failure is demonstrated in [[a7-max-heap]].

## Changing a priority after insertion

Real schedulers change priorities: a job is escalated, a node in Dijkstra's algorithm is found to be closer than thought. Textbook priority queues offer a **decrease-key** operation for this. `PriorityQueue` does not, because it has no way to find an element's position in better than O(n).

The one thing you must never do is change the object in place.

```java title="MutationBug.java"
import java.util.*;

public class MutationBug {
    static final class Job {
        final String name;
        int priority;
        Job(String name, int priority) { this.name = name; this.priority = priority; }
        public String toString() { return name + ":" + priority; }
    }

    public static void main(String[] args) {
        PriorityQueue<Job> pq = new PriorityQueue<>(Comparator.comparingInt((Job j) -> j.priority));
        Job a = new Job("a", 5), b = new Job("b", 3), c = new Job("c", 8), d = new Job("d", 6);
        pq.addAll(List.of(a, b, c, d));

        d.priority = 1;                  // mutated while inside the heap: the heap is not told
        System.out.println("peek after mutation: " + pq.peek());

        // Correct way to change a priority: remove, change, reinsert (remove is O(n)).
        pq.remove(d);
        pq.offer(d);
        System.out.println("peek after reinsert: " + pq.peek());
    }
}
```

```output
peek after mutation: b:3
peek after reinsert: d:1
```

After the mutation, `d` has the best priority but sits deep in the heap array where the heap put it when its priority was 6. The heap only re-checks order during `offer` and `poll`, so `peek` still returns `b`. Every later operation builds on a broken invariant. The rule: **anything the comparator reads must not change while the object is in the queue**. Immutable entries such as records make the rule automatic.

There are two correct ways to change a priority.

**Remove and reinsert.** `pq.remove(d)` followed by `pq.offer(d)` (with the field changed in between) is correct but costs O(n) for the removal. Acceptable when updates are rare.

**Lazy deletion.** Leave the old entry in the queue and insert a new entry with the new priority. Keep the authoritative priority of each item in a separate map. When you poll an entry, compare it with the map; if they disagree, the entry is **stale** — superseded by a later update — and you skip it.

```java title="LazyUpdate.java"
import java.util.*;

public class LazyUpdate {
    record Entry(String task, int priority) {}

    public static void main(String[] args) {
        PriorityQueue<Entry> pq = new PriorityQueue<>(Comparator.comparingInt(Entry::priority));
        Map<String, Integer> current = new HashMap<>();   // the one true priority per task

        update(pq, current, "backup", 40);
        update(pq, current, "email", 20);
        update(pq, current, "report", 30);
        update(pq, current, "backup", 10);   // raise urgency: push a new entry, keep the old one
        update(pq, current, "email", 50);    // lower urgency

        while (!pq.isEmpty()) {
            Entry e = pq.poll();
            Integer live = current.get(e.task());
            if (live == null || live != e.priority()) {
                System.out.println("skip stale " + e);
                continue;
            }
            current.remove(e.task());            // processed: later copies become stale too
            System.out.println("run " + e);
        }
    }

    static void update(PriorityQueue<Entry> pq, Map<String, Integer> current, String task, int p) {
        current.put(task, p);
        pq.offer(new Entry(task, p));
    }
}
```

```output
run Entry[task=backup, priority=10]
skip stale Entry[task=email, priority=20]
run Entry[task=report, priority=30]
skip stale Entry[task=backup, priority=40]
run Entry[task=email, priority=50]
```

Each update is O(log n) instead of O(n). The price is memory: the queue may hold several entries per item, up to one per update. Lazy deletion works for both directions — raising and lowering a priority — because the map, not the queue, is the source of truth. The `live != e.priority()` comparison is safe here because `live` is unboxed to `int` before comparing; comparing two `Integer` objects with `!=` would compare references.

This is exactly how Dijkstra's algorithm is written with `PriorityQueue`: the `dist[]` array plays the role of the map, and an entry `(node, d)` is stale when `d > dist[node]`.

```java
// pq holds {node, distance}; dist[] is the best distance found so far
while (!pq.isEmpty()) {
    long[] cur = pq.poll();
    int u = (int) cur[0];
    if (cur[1] > dist[u]) continue;            // stale: a shorter path was found later
    for (int[] edge : adj.get(u)) {            // edge = {v, weight}
        int v = edge[0];
        long nd = dist[u] + edge[1];
        if (nd < dist[v]) { dist[v] = nd; pq.offer(new long[]{v, nd}); }
    }
}
```

The queue can hold up to one entry per successful relaxation, at most E entries, so the algorithm runs in O(E log E) = O(E log V) time. The full algorithm is taught in [[a8-dijkstra-priority-queue]].

## Worked example: Meeting Rooms II

*Given meeting intervals `[start, end)`, find the minimum number of rooms needed so that no two overlapping meetings share a room.*

**Naive approach.** For each meeting, count how many other meetings overlap its start time and take the maximum: O(n²). It works but scales badly.

**Deriving the better idea.** Process meetings in order of start time, like a receptionist assigning rooms through the day. When a meeting starts, the only question is: *is any room free now?* A room is free if its current meeting has ended. Of all busy rooms, the one most likely to be free is the one whose meeting ends **earliest** — if even that room is busy, all of them are. "The earliest end time among busy rooms" is a minimum query over a changing set: a min-priority queue of end times.

**Invariant.** After processing each meeting, the queue holds exactly one end time per room in use, and its size is the number of rooms opened so far.

```java title="MeetingRooms.java"
import java.util.*;

public class MeetingRooms {
    /** Minimum number of rooms so that no two overlapping meetings share a room. */
    static int minRooms(int[][] meetings) {
        int[][] byStart = meetings.clone();
        Arrays.sort(byStart, Comparator.comparingInt(m -> m[0]));
        PriorityQueue<Integer> endTimes = new PriorityQueue<>();  // one entry per busy room
        for (int[] m : byStart) {
            if (!endTimes.isEmpty() && endTimes.peek() <= m[0]) {
                endTimes.poll();                     // the earliest-ending room is free again
            }
            endTimes.offer(m[1]);                    // this meeting occupies a room until m[1]
        }
        return endTimes.size();
    }

    public static void main(String[] args) {
        System.out.println(minRooms(new int[][]{{0, 30}, {5, 10}, {15, 20}}));
        System.out.println(minRooms(new int[][]{{9, 10}, {10, 11}, {11, 12}}));
        System.out.println(minRooms(new int[][]{{1, 5}, {2, 6}, {3, 7}, {6, 8}}));
    }
}
```

```output
2
1
3
```

Dry run on the third input, already sorted by start:

| Meeting | Earliest end before | Free room? | Queue after | Rooms |
|---|---|---|---|---|
| [1, 5) | — | no rooms yet | {5} | 1 |
| [2, 6) | 5 | 5 > 2: no | {5, 6} | 2 |
| [3, 7) | 5 | 5 > 3: no | {5, 6, 7} | 3 |
| [6, 8) | 5 | 5 ≤ 6: reuse | {6, 7, 8} | 3 |

The comparison is `<=` because intervals are half-open: a meeting ending at 10 frees its room for one starting at 10, which is why the second input needs only one room. Sorting costs O(n log n); each meeting causes at most one poll and one offer on a queue of at most n entries, so O(n log n) total, with O(n) space. Polling at most one room per meeting is enough because we only need *a* free room, and the size of the queue then counts rooms in use. The interval background is in [[a2-intervals]].

## Worked example: Task Scheduler

*CPU tasks are labelled `A`–`Z`; equal tasks must be separated by at least `n` time slots (idle slots allowed). Find the least number of slots to finish all tasks.*

The greedy insight is that the task with the most copies left is the bottleneck: run it as early as possible. Think in **cycles** of `n + 1` slots. Within one cycle, no task can run twice — that is what the cooling time means — so each cycle runs up to `n + 1` *different* tasks, choosing the ones with the most copies remaining. "The task with the most remaining copies" is a max-priority query, and the counts change after each cycle.

```java title="TaskScheduler.java"
import java.util.*;

public class TaskScheduler {
    /** Least intervals to run all tasks when equal tasks must be at least n slots apart. */
    static int leastInterval(char[] tasks, int n) {
        int[] count = new int[26];
        for (char t : tasks) count[t - 'A']++;
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());
        for (int c : count) if (c > 0) maxHeap.offer(c);

        int time = 0;
        while (!maxHeap.isEmpty()) {
            List<Integer> ranThisCycle = new ArrayList<>();
            int slots = 0;
            // one cycle = n + 1 slots; run the most frequent distinct tasks first
            while (slots <= n && !maxHeap.isEmpty()) {
                int remaining = maxHeap.poll() - 1;
                if (remaining > 0) ranThisCycle.add(remaining);
                slots++;
            }
            maxHeap.addAll(ranThisCycle);
            // a full cycle costs n + 1 even if idle; the last cycle costs only what ran
            time += maxHeap.isEmpty() ? slots : n + 1;
        }
        return time;
    }

    public static void main(String[] args) {
        System.out.println(leastInterval("AAABBB".toCharArray(), 2));
        System.out.println(leastInterval("AAABBB".toCharArray(), 0));
        System.out.println(leastInterval("AAAAAABCDEFG".toCharArray(), 2));
    }
}
```

```output
8
6
16
```

For `AAABBB` with `n = 2`, each cycle runs `A` and `B` and then must idle once: `A B idle A B idle A B`, 8 slots. The polled counts are held aside in `ranThisCycle` and returned only after the cycle, which enforces "no task twice per cycle". With only 26 distinct tasks, the heap never holds more than 26 entries, so each operation is O(log 26) = O(1) and the whole algorithm is O(total tasks). There is also a closed-form answer based on the maximum count, but the heap simulation is the version that generalises — for example to *Reorganize String*, where you must output the actual order.

```quiz
Q: Why does a binary heap beat a sorted array as a general-purpose priority queue?
- [ ] A heap finds the minimum faster
- [x] A sorted array pays O(n) per insert, while a heap pays O(log n) for both insert and extract
- [ ] A heap keeps all elements in sorted order
- [ ] A sorted array cannot hold duplicates
> Both read the minimum in O(1). The difference is insertion: keeping an array sorted means shifting elements, O(n) each time. With interleaved inserts and extracts, the heap totals O(n log n) and the sorted array O(n²). A heap is not sorted.

Q: Jobs with equal priority must run in the order they were submitted. What should the comparator be?
- [ ] Priority only — PriorityQueue is stable
- [ ] Priority, then job name alphabetically
- [x] Priority, then a submission sequence number
- [ ] Use reverseOrder so ties keep insertion order
> A heap is not stable, so equal priorities come out in an unspecified order. A unique, increasing sequence number as the second key makes ties resolve first-come-first-served and makes the order fully deterministic.

Q: A queued Job object's priority field is changed directly while it is still in a PriorityQueue. What happens?
- [ ] The queue re-sorts automatically on the next peek
- [ ] The queue throws ConcurrentModificationException
- [x] The heap invariant silently breaks and later peeks and polls can return the wrong element
- [ ] Nothing, as long as the new priority is smaller
> The heap only restores order inside offer and poll operations; it cannot observe a field changing. The object stays where its old priority placed it. Remove and reinsert it, or use lazy deletion with immutable entries.
```

## In real systems

**Timers and delayed work.** `ScheduledThreadPoolExecutor` keeps scheduled tasks in an internal heap ordered by trigger time (`DelayedWorkQueue`), and `java.util.Timer` does the same with its own binary heap. The worker sleeps until the head is due. See [[c3-scheduled-executor]].

**Job and message queues.** Background job systems and message brokers commonly offer priority levels so that, say, password-reset emails jump ahead of newsletters ([[d10-email-queue-priority]]). Many implement a small fixed number of priority levels as separate FIFO queues rather than a heap, because a handful of levels with FIFO order inside each is easier to reason about and to scale.

**Event-driven simulation.** A discrete-event simulator stores future events in a min-priority queue keyed by timestamp, then repeatedly polls the earliest event, advances the clock to it, and processes it — which may schedule new events. The sequence-number tie-breaker matters here, so that simultaneous events are processed in a reproducible order.

**Starvation and aging.** A pure priority rule can starve low-priority work forever if high-priority work keeps arriving. Production schedulers counter this with **aging** — gradually raising the effective priority of items that have waited long — or with quotas per priority level. If you design a priority queue for real users, ask what happens to the lowest priority under sustained load.

## Trade-offs and alternatives

Use a priority queue when an algorithm repeatedly needs "the best remaining item" while items keep arriving or changing. Do not use one when:

- **Arrival order is the rule.** A FIFO queue (`ArrayDeque`) is O(1) per operation and stable. See [[a5-queue]].
- **The data is static.** If all items are known up front and you need them all in order, sort once: O(n log n) with better constants and sorted iteration.
- **You need arbitrary deletes or ordered traversal.** A `TreeSet` (with a tie-breaker so equal keys are not merged as duplicates) or `TreeMap` gives O(log n) delete of any element and in-order iteration.
- **Priorities are small integers.** With priorities in a small range, an array of FIFO buckets indexed by priority gives O(1) insert and near-O(1) extract — the idea behind Dial's algorithm ([[a8-dials-algorithm]]) and bucket queues.
- **You need only the single k-th element of a static array.** Quickselect ([[a3-quickselect]]) is O(n) on average.

## Common mistakes

> [!MISTAKE] Treating iteration as priority order
> `for (Task t : pq)`, `pq.toString()` and `pq.stream()` all walk the heap array, which is not sorted. Code that prints "the top 3" by iterating the first three elements is wrong. Poll them, or copy the queue and poll the copy.

**Forgetting stale entries.** With lazy deletion, every poll must check whether the entry is still current. Without the check, Dijkstra processes a node with an outdated distance, and a scheduler runs a cancelled task.

**Calling `remove(Object)` in a loop.** It is a linear scan. A loop of n removals is O(n²). Switch to lazy deletion or a `TreeSet`.

**Using a priority queue where FIFO was required.** BFS on an unweighted graph needs a plain queue; using a priority queue keyed by distance gives correct answers but adds a needless log factor.

**Ignoring equal priorities.** If the expected output depends on how ties are broken (for example, "return the lexicographically smallest"), the comparator must encode that rule. Leaving it out produces answers that pass some tests and fail others.

## Interview perspective

Interviewers use priority queues to test two things: whether you recognise a "best next item" structure inside a word problem, and whether you handle the Java details — comparators, empty queues, stale entries — without fumbling.

> [!INTERVIEW] Name the queue's contents and order out loud
> "I'll keep a min-priority queue of end times, one per room in use. When a meeting starts, if the earliest end time is at or before the start, that room is free, so I poll it. Then I push this meeting's end. The queue size is the number of rooms." Saying what one entry represents and what sits at the head makes the rest of the code easy to follow.

Common questions and the reasoning behind strong answers:

- **Priority queue versus queue?** A queue is FIFO by arrival; a priority queue releases by priority, and Java's is a binary heap with O(log n) offer and poll.
- **Why does Dijkstra's queue contain stale entries?** Because `PriorityQueue` has no decrease-key, a node is offered again whenever its distance improves; the old, larger entry is skipped when polled.
- **Meeting Rooms II: why end times, not start times?** Rooms become free when meetings end; the earliest end is the only candidate worth checking.
- **How would you support changing priorities efficiently?** Lazy deletion with a map of current priorities, or an indexed priority queue that tracks each element's array position for O(log n) decrease-key.
- **What if many threads add and take jobs?** `PriorityBlockingQueue`, with `take()` blocking on an empty queue; mention starvation and aging if the discussion turns to design.

## Practice

1. **Meeting Rooms II** — implement it, then rewrite it with two sorted arrays (starts and ends) and two pointers, and compare.
2. **Task Scheduler** and **Reorganize String** — the second asks for the actual arrangement, so use a max heap of `(count, char)` and hold back the last used character for one step.
3. **Single-Threaded CPU** — sort tasks by enqueue time, and keep available tasks in a priority queue ordered by processing time, then index.
4. **Network Delay Time** — Dijkstra with lazy deletion ([[a8-dijkstra]]).
5. **Design a job queue** — a class with `submit(job, priority)`, `escalate(jobId, newPriority)` and `next()`, FIFO among equal priorities. Use records, a sequence counter and lazy deletion.

The DSA explorer lists the matching problems under the Heaps topics, including *Meeting Rooms II*, *Task Scheduler* and *Single-Threaded CPU*. More greedy problems that pair sorting with a heap are in [[a10-heap-greedy]].

## Quick revision {#quick-revision}

- Priority queue = ADT (insert, peek, extract highest priority); binary heap = usual implementation.
- Heap: insert O(log n), peek O(1), extract O(log n); sorted array: O(n) insert; unsorted: O(n) extract.
- Java `PriorityQueue`: min by default; `Comparator.reverseOrder()` for max; heapify constructor O(n).
- `offer`/`poll`/`peek` return values; `add`/`remove()`/`element()` throw. `poll`/`peek` give `null` when empty.
- Iteration and `toString` are not sorted. No `null` elements. Not thread-safe → `PriorityBlockingQueue`.
- Not stable: add a sequence number to break ties first-come-first-served.
- Never mutate a field the comparator reads while the object is queued.
- Change priority: remove + reinsert (O(n)) or lazy deletion (new entry + map of current values; skip stale on poll).
- Dijkstra: skip entries with `d > dist[u]`; O(E log V).
- Meeting Rooms II: sort by start, min-queue of end times, reuse if `peek() <= start`; answer = queue size.

## Key takeaways {#key-takeaways}

- A priority queue releases the most important waiting item, defined entirely by your comparator; the heap behind it is an implementation detail with O(log n) updates.
- Equal priorities come out in no promised order, so encode any tie rule — especially arrival order — in the comparator.
- Objects in a priority queue must not change the fields their order depends on; use immutable entries and reinsert or lazily delete to update.
- Lazy deletion turns an O(n) update into O(log n) at the cost of extra entries, and it is the standard way to write Dijkstra in Java.
- Recognise the pattern by its question: "which item should be handled next?" asked repeatedly over a changing set.
