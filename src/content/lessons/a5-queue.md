---
summary: A queue hands items out in the order they arrived — first in, first out. You will learn how queues are stored efficiently, how to use Java's queue API without its traps, how to build a queue from two stacks, and why breadth-first search depends on a queue to find shortest paths.
difficulty: beginner
minutes: 40
objectives:
  - Explain first-in, first-out order and trace offer, poll and peek on paper
  - Implement a fixed-capacity circular queue and explain why the indices wrap around
  - Choose the right Java queue methods and explain the difference between offer/poll and add/remove
  - Implement a queue with two stacks and derive its amortised O(1) cost
  - Use a queue for breadth-first search and explain why it yields shortest paths in unweighted graphs
---

## Introduction

A print server receives jobs from twenty people. Which job should it print next? The fair answer is the one that has been waiting longest. New jobs join at the back, the printer takes from the front, and nobody jumps the line.

That is a **queue**: a collection where items are added at one end (the **rear** or **tail**) and removed from the other (the **front** or **head**). The item removed is always the one that has been inside the longest, a rule called **FIFO (first in, first out)**. A queue is the mirror image of a [[a5-stack]], which always removes the *newest* item.

Queues show up wherever work must be handled in arrival order. Web servers queue incoming connections, operating systems queue processes waiting for the CPU, message brokers queue events between services, and keyboards queue keystrokes so none are lost while a program is busy. In algorithms, the queue's most important job is **breadth-first search (BFS)**: because it processes items in the order they were discovered, BFS explores a graph in rings of increasing distance, which is exactly what you need to find shortest paths when every step costs the same.

This lesson covers how a queue is stored so that both ends are O(1), the Java API and its two families of methods, the classic "queue from two stacks" design, and the patterns that make queues the right tool in interview problems.

## Before you start

- **Stacks** — push, pop and LIFO order; the two-stack queue builds on them. See [[a5-stack]].
- **Arrays and the modulo operator** — `i % n` gives a remainder between `0` and `n - 1`, which is how circular buffers wrap. See [[a2-array-string-traversal]].
- **Amortised cost** — why an occasional expensive operation can still average out to O(1). See [[a1-time-complexity]].

## The intuition

Think of a line at a ticket counter. People join at the back and are served at the front. If Ann arrives before Bob, Ann is served before Bob, always.

| Operation | Queue (front → rear) | Returned |
|---|---|---|
| `offer("ann")` | `[ann]` | — |
| `offer("bob")` | `[ann, bob]` | — |
| `offer("cy")` | `[ann, bob, cy]` | — |
| `peek()` | `[ann, bob, cy]` | `ann` |
| `poll()` | `[bob, cy]` | `ann` |
| `offer("di")` | `[bob, cy, di]` | — |
| `poll()` | `[cy, di]` | `bob` |

Items come out in the *same* order they went in. A stack reverses order; a queue preserves it. That one difference decides which to use: if the problem needs "most recent first", use a stack; if it needs "earliest first" or "in the order discovered", use a queue.

## The queue operations

Like a stack, a queue is an **abstract data type** defined by its operations:

- **enqueue / offer(x)** adds `x` at the rear.
- **dequeue / poll()** removes and returns the front item.
- **peek()** returns the front item without removing it.
- **isEmpty()** and **size()**.

All of them should be O(1). The interesting question is how to store items so that *both* ends are cheap, because the obvious array approach is not.

### Why a plain array is a poor queue

Store the queue in an `ArrayList` and enqueue with `add` at the end — that is O(1) amortised. Dequeue with `remove(0)` — that shifts every remaining element one slot left, which is O(n). A program that processes a million jobs would do about half a trillion element moves. The front of an array is the expensive end.

You could avoid shifting by keeping a `head` index and moving it forward on each dequeue. Now dequeue is O(1), but the slots before `head` are wasted forever: after a million enqueues and dequeues, the array is a million slots long with nothing useful in it.

### The circular buffer

The fix is to let the array **wrap around**. Keep a `head` index and a `size`. The rear is at `(head + size) % capacity`. When an index runs off the end of the array, the modulo brings it back to `0`, reusing the slots that dequeues have freed. This structure is called a **circular buffer** or **ring buffer**.

```java title="RingQueue.java"
import java.util.NoSuchElementException;

public class RingQueue {
    private final int[] items;
    private int head = 0;    // index of the front element
    private int size = 0;

    RingQueue(int capacity) { items = new int[capacity]; }

    boolean offer(int x) {
        if (size == items.length) return false;          // full: refuse, do not overwrite
        int tail = (head + size) % items.length;          // first free slot, wrapping around
        items[tail] = x;
        size++;
        return true;
    }

    int poll() {
        if (size == 0) throw new NoSuchElementException("queue is empty");
        int x = items[head];
        head = (head + 1) % items.length;                 // front moves forward, wrapping
        size--;
        return x;
    }

    public static void main(String[] args) {
        RingQueue q = new RingQueue(3);
        System.out.println(q.offer(10) + " " + q.offer(20) + " " + q.offer(30));
        System.out.println(q.offer(40));                  // full
        System.out.println(q.poll() + " " + q.poll());    // frees slots 0 and 1
        System.out.println(q.offer(40) + " " + q.offer(50)); // reuse slots 0 and 1
        System.out.println("head=" + q.head + " size=" + q.size);
        System.out.println(q.poll() + " " + q.poll() + " " + q.poll());
    }
}
```

```output
true true true
false
10 20
true true
head=2 size=3
30 40 50
```

Trace the array to see the wrap-around. Capacity is 3, and `_` marks a slot that holds no live item.

| Step | Array slots `[0, 1, 2]` | `head` | `size` | Note |
|---|---|---|---|---|
| offer 10, 20, 30 | `[10, 20, 30]` | 0 | 3 | full |
| offer 40 | `[10, 20, 30]` | 0 | 3 | refused |
| poll, poll | `[_, _, 30]` | 2 | 1 | returned 10, 20 |
| offer 40 | `[40, _, 30]` | 2 | 2 | tail = (2 + 1) % 3 = 0 |
| offer 50 | `[40, 50, 30]` | 2 | 3 | tail = (2 + 2) % 3 = 1 |
| poll ×3 | `[_, _, _]` | 2 | 0 | returned 30, 40, 50 |

The logical order (30, 40, 50) differs from the physical order in the array (40, 50, 30). That is fine: `head` and `size` together say where the queue starts and how far it runs. Tracking `size` explicitly also solves a classic ambiguity — with only `head` and `tail` indices, `head == tail` could mean either empty or full, so implementations without a size counter must leave one slot permanently unused.

This fixed-capacity version refuses new items when full. Real-world ring buffers make different choices: Java's `ArrayDeque` allocates a larger array and copies the items into it, so it never refuses; audio and logging buffers often *overwrite* the oldest item so they always hold the most recent data. The [[a5-deque]] lesson shows how the same ring lets you add and remove at both ends.

## Queues in Java

`java.util.Queue` is an interface. For an ordinary FIFO queue, use `ArrayDeque`, which is a resizable circular buffer.

```java title="QueueBasics.java"
import java.util.*;

public class QueueBasics {
    public static void main(String[] args) {
        Queue<String> q = new ArrayDeque<>();
        q.offer("ann");
        q.offer("bob");
        q.offer("cy");
        System.out.println(q);                 // front first
        System.out.println(q.peek());          // front, not removed
        System.out.println(q.poll());          // remove front
        System.out.println(q.poll());
        System.out.println(q.poll());
        System.out.println(q.poll());          // empty: poll returns null
        try {
            q.remove();                        // empty: remove throws
        } catch (NoSuchElementException e) {
            System.out.println("remove on empty: " + e.getClass().getSimpleName());
        }

        Queue<Integer> pq = new PriorityQueue<>();
        for (int x : new int[] {5, 1, 4}) pq.offer(x);
        StringBuilder out = new StringBuilder();
        while (!pq.isEmpty()) out.append(pq.poll()).append(' ');
        System.out.println("PriorityQueue polls: " + out.toString().trim());
    }
}
```

```output
[ann, bob, cy]
ann
ann
bob
cy
null
remove on empty: NoSuchElementException
PriorityQueue polls: 1 4 5
```

The `Queue` interface has **two methods for each operation**, which differ only in how they report failure:

| Operation | Throws an exception on failure | Returns a special value on failure |
|---|---|---|
| Insert at rear | `add(x)` — throws if a capacity-limited queue is full | `offer(x)` — returns `false` |
| Remove front | `remove()` — throws `NoSuchElementException` if empty | `poll()` — returns `null` |
| Examine front | `element()` — throws if empty | `peek()` — returns `null` |

For an unbounded `ArrayDeque`, `add` and `offer` behave the same, so the choice is about style; most interview code uses `offer`/`poll`/`peek` and checks `isEmpty()` explicitly. The difference matters for bounded queues such as `ArrayBlockingQueue`, where `offer` returning `false` lets you handle a full queue gracefully.

Because `null` is the "empty" signal for `poll` and `peek`, `ArrayDeque` refuses to store `null` at all — `offer(null)` throws `NullPointerException`. `LinkedList` also implements `Queue` and does accept `null`, but it allocates a node per element and is slower, so prefer `ArrayDeque` unless you have a reason.

> [!WARNING] Not every Queue is FIFO
> `PriorityQueue` implements `Queue`, but as the output shows it hands out the *smallest* element first (1, 4, 5), not the earliest (5, 1, 4). It is a heap, not a line. Declaring a variable as `Queue<Integer>` tells you nothing about the order — the implementation decides. See [[a7-priority-queues]].

## Building a queue from two stacks

A favourite interview question: implement a FIFO queue using only stacks. It is worth learning because the solution is a clean example of amortised analysis.

**The idea.** A stack reverses order. Reversing twice restores it. So keep two stacks: `in` receives every new element, and `out` serves removals. When `out` is empty and someone wants the front, pour all of `in` into `out`. The pouring reverses `in`, which puts the *oldest* element on top of `out` — exactly the front of the queue.

```java title="MyQueue.java"
import java.util.ArrayDeque;
import java.util.Deque;

public class MyQueue {
    private final Deque<Integer> in = new ArrayDeque<>();   // receives new elements
    private final Deque<Integer> out = new ArrayDeque<>();  // top = front of the queue

    public void push(int x) { in.push(x); }

    public int pop() {
        peek();                                // make sure out holds the front
        return out.pop();
    }

    public int peek() {
        if (out.isEmpty()) {
            // reversing 'in' puts the oldest element on top of 'out'
            while (!in.isEmpty()) out.push(in.pop());
        }
        return out.peek();
    }

    public boolean empty() { return in.isEmpty() && out.isEmpty(); }

    public static void main(String[] args) {
        MyQueue q = new MyQueue();
        q.push(1);
        q.push(2);
        q.push(3);
        System.out.println(q.pop());           // transfers 3 elements, returns 1
        q.push(4);                             // goes to 'in'; 'out' still holds 2, 3
        System.out.println(q.pop());
        System.out.println(q.pop());
        System.out.println(q.pop());           // 'out' empty again: transfers 4
        System.out.println(q.empty());
    }
}
```

```output
1
2
3
4
true
```

Trace the stacks (top on the right):

| Call | `in` | `out` | Returns |
|---|---|---|---|
| push 1, 2, 3 | `[1, 2, 3]` | `[]` | — |
| pop | `[]` | `[3, 2]` | 1 (after pouring `[3, 2, 1]`) |
| push 4 | `[4]` | `[3, 2]` | — |
| pop | `[4]` | `[3]` | 2 |
| pop | `[4]` | `[]` | 3 |
| pop | `[]` | `[]` | 4 (after pouring `[4]`) |

The crucial rule is **pour only when `out` is empty**. If you poured while `out` still held elements, the newly poured ones would land on top of older ones and come out first, breaking FIFO. In the trace, element 4 waits in `in` until 2 and 3 have left.

**Why it is amortised O(1).** A single `pop` can cost O(n) when it pours. But follow one element through its life: it is pushed onto `in` once, popped from `in` once, pushed onto `out` once, and popped from `out` once. Four stack operations per element, no matter how operations are interleaved. So `n` queue operations do at most `4n` stack operations in total — O(1) per operation on average. The worst single call is O(n); the average over any sequence is O(1). Being able to say both is the strong answer.

The reverse question — a stack from queues — has a less pleasant answer: with one queue, after each push you rotate the queue by polling and re-offering the older `size - 1` elements, which makes push O(n). There is no amortised trick there, because a queue cannot reverse order.

## Breadth-first search: the queue's main job

**Breadth-first search** explores a graph starting from a source, visiting all nodes one step away, then all nodes two steps away, and so on. A queue produces this order automatically: nodes are discovered in increasing order of distance and enqueued at the back, so they are processed in that same order. Every node at distance `d` leaves the queue before any node at distance `d + 1`.

That property gives BFS its most valuable result: **in a graph where every edge has the same cost, the first time BFS reaches a node is along a shortest path.** A stack would explore one branch deeply first and could reach a node by a long route before finding the short one.

Here is BFS finding the fewest steps through a grid, where `#` is a wall:

```java title="GridBfs.java"
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Queue;

public class GridBfs {
    static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    /** Fewest steps from (0,0) to the bottom-right cell, moving through '.' cells; -1 if unreachable. */
    static int shortestPath(String[] grid) {
        int rows = grid.length, cols = grid[0].length();
        if (grid[0].charAt(0) == '#') return -1;
        int[][] dist = new int[rows][cols];
        for (int[] row : dist) Arrays.fill(row, -1);      // -1 = not discovered yet

        Queue<int[]> q = new ArrayDeque<>();
        q.offer(new int[] {0, 0});
        dist[0][0] = 0;                                   // mark when enqueued, not when polled

        while (!q.isEmpty()) {
            int[] cell = q.poll();
            int r = cell[0], c = cell[1];
            if (r == rows - 1 && c == cols - 1) return dist[r][c];
            for (int[] d : DIRS) {
                int nr = r + d[0], nc = c + d[1];
                if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
                if (grid[nr].charAt(nc) == '#' || dist[nr][nc] != -1) continue;
                dist[nr][nc] = dist[r][c] + 1;
                q.offer(new int[] {nr, nc});
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        String[] grid = {
            "..#.",
            ".##.",
            "....",
        };
        System.out.println(shortestPath(grid));
        System.out.println(shortestPath(new String[] {".#", "#."}));
    }
}
```

```output
5
-1
```

The route found is down two cells, then right three: five steps. In the second grid the destination is walled off, so the queue empties without reaching it and the method returns `-1`.

The detail that matters most is **when a cell is marked as discovered**. The code sets `dist[nr][nc]` at the moment the cell is enqueued. If it waited until the cell was polled, the same cell could be enqueued several times by different neighbours before its first copy is processed. The answer would still be right, but the queue could grow far larger than the grid and the run time would suffer. Marking on enqueue guarantees each cell enters the queue at most once, so BFS runs in O(rows × cols) time and space — in graph terms, O(V + E) for V vertices and E edges.

Two variations come up constantly:

- **Level-by-level processing.** To handle one distance ring at a time (for example, to collect each level of a tree separately), record `int levelSize = q.size()` at the start of each round and poll exactly that many items. Those are precisely the nodes at the current depth. This is the core of [[a6-bfs]].
- **Multi-source BFS.** To find the distance from the *nearest* of several sources — the nearest exit, or how long until every orange rots — enqueue all sources at distance `0` before the loop starts. The queue then expands from all of them at once.

## Worked example: counting recent requests

**Problem.** A `RecentCounter` receives `ping(t)` calls with strictly increasing timestamps in milliseconds. Each call returns how many pings occurred in the last 3,000 ms, inclusive: the range `[t - 3000, t]`.

**Naive approach.** Store every timestamp in a list and count those in range on each call. That is O(n) per call and grows forever.

**The better idea.** Because timestamps arrive in increasing order, the oldest stored ping is always the first to fall out of the window. Expiry happens in arrival order — FIFO. Keep the pings in a queue, add each new one at the rear, and poll from the front while the front is too old.

```java title="RecentCounter.java"
import java.util.ArrayDeque;
import java.util.Queue;

public class RecentCounter {
    private final Queue<Integer> times = new ArrayDeque<>();

    /** Records a request at time t (ms, strictly increasing) and returns requests in [t-3000, t]. */
    public int ping(int t) {
        times.offer(t);
        while (times.peek() < t - 3000) times.poll();   // oldest requests expire first
        return times.size();
    }

    public static void main(String[] args) {
        RecentCounter rc = new RecentCounter();
        for (int t : new int[] {1, 100, 3001, 3002}) {
            System.out.println("ping(" + t + ") = " + rc.ping(t));
        }
    }
}
```

```output
ping(1) = 1
ping(100) = 2
ping(3001) = 3
ping(3002) = 3
```

At `ping(3001)` the window is `[1, 3001]`, so the ping at time 1 is still inside (the range is inclusive). At `ping(3002)` the window is `[2, 3002]`, and time 1 expires. Each timestamp is offered once and polled at most once, so the total work over `n` calls is O(n) — amortised O(1) per call — and the queue never holds more than the pings inside one window.

This is a **sliding window over time**, and it is the same mechanism behind rate limiters that allow "at most N requests per minute". When the window must also report a maximum or minimum, a plain queue is not enough; you need the [[a5-monotonic-queue]].

```quiz
Q: You offer 7, 2 and 9 into an empty ArrayDeque used as a queue, poll once, then offer 4. What does peek() return?
- [ ] 7
- [x] 2
- [ ] 9
- [ ] 4
> The queue is [7, 2, 9]; poll removes 7, the earliest arrival, leaving [2, 9]; offering 4 adds at the rear, giving [2, 9, 4]. The front is 2. Answering 4 treats the queue like a stack.

Q: In the two-stack queue, why must elements be poured from `in` to `out` only when `out` is empty?
- [ ] Pouring is not allowed by ArrayDeque while out has elements
- [x] Elements poured on top of a non-empty out would be popped before older elements already there, breaking FIFO
- [ ] It saves memory but does not affect correctness
- [ ] Because in is always empty when out is non-empty
> out holds the oldest elements with the very oldest on top. Pouring newer elements onto it would bury the older ones. Waiting until out is empty keeps every element in out older than every element in in.

Q: Why does BFS mark a cell as discovered when it is enqueued rather than when it is polled?
- [ ] Marking on poll would give wrong distances
- [x] Marking on enqueue stops the same cell from entering the queue many times before it is processed
- [ ] Java's ArrayDeque requires it
- [ ] It makes BFS explore deeper paths first
> With marking on poll, several neighbours can each enqueue the same cell before it is polled. Distances stay correct because the first copy polled is still a shortest one, but the queue grows needlessly and work multiplies. Marking on enqueue bounds the queue at one entry per cell.
```

## In real systems

**Message queues.** Systems such as RabbitMQ, Amazon SQS and Apache Kafka let one service hand work to another without waiting for it to finish. The producer enqueues a message; consumers dequeue and process it later. This smooths out traffic spikes and keeps one slow service from blocking another. (Kafka is strictly a log that keeps messages after they are read, but each partition is consumed in order, so the FIFO idea still applies.)

**Thread pools.** Java's `ThreadPoolExecutor` holds submitted tasks in a `BlockingQueue` until a worker thread is free. A `BlockingQueue`'s `take()` waits while the queue is empty and `put()` waits while a bounded queue is full, which is how producer and consumer threads coordinate safely.

**Operating systems and networking.** Schedulers keep ready processes in queues; network cards and routers buffer packets in ring buffers; a web server keeps a queue of connections waiting to be accepted.

**Breadth-first search everywhere.** Finding degrees of separation in a social graph, crawling a website level by level, and computing the fewest moves in a puzzle are all BFS with a queue.

## Trade-offs and alternatives

| Structure | Removes | Typical use |
|---|---|---|
| Queue (`ArrayDeque`) | Oldest item | BFS, scheduling, buffering in order |
| Stack (`ArrayDeque` with `push`/`pop`) | Newest item | Nesting, undo, DFS |
| Deque | Either end | Sliding windows, 0-1 BFS — see [[a5-deque]] |
| `PriorityQueue` | Smallest by comparator | Dijkstra, scheduling by priority, top-k |
| `BlockingQueue` | Oldest, with waiting | Producer-consumer between threads |

A queue offers no access to the middle and no search. If a problem needs "the oldest item that satisfies some condition", a plain queue may force you to poll and re-offer everything, and a different structure is usually better. If items must be served by importance rather than arrival, use a priority queue. And for weighted shortest paths, a plain queue is wrong — BFS's guarantee holds only when every edge costs the same.

## Common mistakes

> [!MISTAKE] Dequeuing from the front of an ArrayList
> `list.remove(0)` shifts every element and costs O(n). A loop that drains a list this way is O(n²). Use `ArrayDeque.poll()`, which is O(1).

**Marking BFS nodes visited on poll instead of on enqueue.** The result is usually still correct, but duplicates pile up in the queue and the algorithm can become much slower. Mark when you enqueue.

**Treating `PriorityQueue` as FIFO.** It orders by value. If you need arrival order, use `ArrayDeque`.

**Mixing up `add`/`offer` and `remove`/`poll`.** `remove()` throws on an empty queue; `poll()` returns `null`. Code that calls `poll()` and then unboxes the result into an `int` will throw `NullPointerException` on an empty queue, so check `isEmpty()` first.

**Pouring too early in the two-stack queue.** Transfer from `in` to `out` only when `out` is empty.

**Using BFS on weighted graphs.** BFS's "first visit is shortest" guarantee needs equal edge costs. With weights, use Dijkstra's algorithm with a priority queue, or 0-1 BFS with a deque when weights are only 0 and 1.

## Interview perspective

Queue questions test whether you can tell FIFO problems from LIFO ones and whether you understand amortised cost.

> [!INTERVIEW] The amortised argument, said well
> "A single pop can cost O(n) when it pours `in` into `out`, but each element is moved from `in` to `out` at most once in its lifetime. So any sequence of n operations costs O(n) total — O(1) amortised per operation."

Questions you should be ready for:

- **Implement Queue using Stacks** — two stacks, lazy pouring, amortised O(1).
- **Implement Stack using Queues** — rotate after each push; push becomes O(n).
- **Design Circular Queue** — `head`, `size` and modulo arithmetic; explain how you tell full from empty.
- **Number of Recent Calls** and **Moving Average from Data Stream** — a queue holds the current window; evict from the front.
- **Rotting Oranges** and **Walls and Gates** — multi-source BFS.
- **Binary Tree Level Order Traversal** — BFS with a size snapshot per level.
- **Follow-up: why is BFS shortest-path correct?** Nodes leave the queue in non-decreasing order of distance, so the first time a node is discovered is via a shortest path.

## Practice

1. **Design Circular Queue** with `enQueue`, `deQueue`, `Front`, `Rear`, `isEmpty` and `isFull`, using a fixed array.
2. **Implement Stack using Queues** with a single queue, and state the cost of each operation.
3. **Moving Average from Data Stream.** Keep a running sum alongside the queue so each call is O(1).
4. **Rotting Oranges.** Multi-source BFS on a grid; return the minutes until no fresh orange remains.
5. **Open the Lock.** BFS over the 10,000 lock combinations with dead ends as walls.
6. **Task Scheduler with cooldown.** Use a queue to hold tasks that are cooling down, together with a priority queue for ready tasks.

The DSA explorer lists the matching problems under this topic; start with *Implement Queue using Stacks*, *Number of Recent Calls* and *Rotting Oranges*.

## Quick revision {#quick-revision}

- Queue = FIFO: offer at the rear, poll and peek at the front, all O(1).
- `ArrayList.remove(0)` is O(n); a circular buffer makes both ends O(1) by wrapping indices with `% capacity`.
- Ring buffer state: `head` and `size` (or one empty slot) to tell full from empty.
- Java: `Queue<T> q = new ArrayDeque<>()`. `offer`/`poll`/`peek` return `false`/`null`; `add`/`remove`/`element` throw. No `null` elements.
- `PriorityQueue` implements `Queue` but is ordered by value, not arrival.
- Two-stack queue: push to `in`; pour into `out` only when `out` is empty; worst O(n), amortised O(1).
- BFS uses a queue; with equal edge costs the first visit to a node is a shortest path. Mark visited on enqueue.
- Level order: snapshot `q.size()` per round. Multi-source BFS: enqueue all sources first.
- Time windows (recent calls, rate limits): evict expired items from the front.

## Key takeaways {#key-takeaways}

- A queue preserves arrival order, which makes it the right structure for fairness, buffering and anything processed "in the order discovered".
- Storing a queue in a circular buffer keeps both ends O(1); Java's `ArrayDeque` does this and is the default choice.
- The two-stack queue shows how an occasional O(n) step can still be O(1) amortised, because each element is moved only once.
- BFS's shortest-path guarantee comes directly from FIFO order: nodes are processed in non-decreasing distance.
- Know the API traps: `poll` returns `null` while `remove` throws, and `PriorityQueue` is not FIFO.
