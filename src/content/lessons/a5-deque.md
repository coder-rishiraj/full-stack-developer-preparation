---
summary: A deque (double-ended queue) lets you add and remove items at both ends in O(1). You will learn how it is stored as a circular array, how one Java class serves as stack, queue and deque, and the problems — palindromes, 0-1 BFS and sliding windows — where needing both ends is the whole point.
difficulty: beginner
minutes: 35
objectives:
  - Explain what a deque adds to a stack and a queue, and map stack and queue operations onto its two ends
  - Implement a fixed-capacity circular deque and handle index wrap-around in both directions
  - Use ArrayDeque's first/last methods correctly, including their behaviour on an empty deque
  - Apply a deque to 0-1 BFS and explain why weight-0 edges go to the front
  - Recognise problems where both ends must be accessed and choose a deque over two separate structures
---

## Introduction

A [[a5-stack]] lets you work at one end. A [[a5-queue]] adds at one end and removes at the other. Some problems need more freedom than either gives. Checking whether `"racecar"` is a palindrome means comparing the first character with the last, then the second with the second-to-last — taking from *both* ends. Tracking the maximum of a sliding window means discarding expired items at the front and dominated items at the back. A shortest-path algorithm for edges that cost either 0 or 1 wants to put some nodes at the front of the line and others at the back.

A **deque** — short for **double-ended queue**, pronounced "deck" — supports exactly this: insert, remove and examine at the **front** and at the **rear**, each in O(1) time. It is a generalisation of both earlier structures. Use only one end and it is a stack; add at one end and remove at the other and it is a queue. That is why Java's `ArrayDeque` is the recommended implementation for all three.

This lesson shows how a deque is stored, how to use the Java API without tripping over its many similar method names, and the patterns where both ends genuinely matter. The most important of those patterns, the monotonic deque, has its own lesson in [[a5-monotonic-queue]]; here you will learn the structure it is built on.

## Before you start

- **Stacks and queues** — LIFO and FIFO order and their operations. See [[a5-stack]] and [[a5-queue]].
- **Circular buffers** — how a queue reuses array slots by wrapping its indices with `%`. The queue lesson builds one; this lesson extends it to both ends.
- **Java collections basics** — interfaces versus implementations, generics, boxing of `int` into `Integer`. See [[a1-deque]] for the Java API reference.

## The intuition

Picture a train of carriages on a straight track with engines that can couple or uncouple at either end. You can add a carriage at the front or the back, and remove one from the front or the back, but you cannot pull one out of the middle without first removing everything in front of it.

| Operation | Deque (front → rear) | Returned |
|---|---|---|
| `offerLast(2)` | `[2]` | — |
| `offerLast(3)` | `[2, 3]` | — |
| `offerFirst(1)` | `[1, 2, 3]` | — |
| `offerLast(4)` | `[1, 2, 3, 4]` | — |
| `pollLast()` | `[1, 2, 3]` | `4` |
| `pollFirst()` | `[2, 3]` | `1` |

The train analogy holds for the access rule. Where it stops working is cost: in a real train yard, coupling at the far end might take longer; in a deque, both ends cost the same O(1).

## Deque as stack, queue, or both

Because a deque has two open ends, every stack and queue operation is just a choice of end:

| Role | Add | Remove | Examine |
|---|---|---|---|
| Stack (top = front) | `push(x)` = `addFirst(x)` | `pop()` = `removeFirst()` | `peek()` = `peekFirst()` |
| Queue (rear = last) | `offer(x)` = `offerLast(x)` | `poll()` = `pollFirst()` | `peek()` = `peekFirst()` |
| True deque | `offerFirst` / `offerLast` | `pollFirst` / `pollLast` | `peekFirst` / `peekLast` |

Notice that the stack methods and the queue methods both remove from the **front**. A stack pushes at the front; a queue offers at the rear. So if one piece of code calls `push` and another calls `offer` on the same `ArrayDeque`, you get a structure that is neither a clean stack nor a clean queue. Pick one vocabulary per variable.

Here is the API in action:

```java title="DequeBasics.java"
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Iterator;

public class DequeBasics {
    public static void main(String[] args) {
        Deque<Integer> dq = new ArrayDeque<>();
        dq.offerLast(2);       // [2]
        dq.offerLast(3);       // [2, 3]
        dq.offerFirst(1);      // [1, 2, 3]
        dq.offerLast(4);       // [1, 2, 3, 4]
        System.out.println(dq + " first=" + dq.peekFirst() + " last=" + dq.peekLast());

        System.out.println(dq.pollLast() + " " + dq.pollFirst() + " -> " + dq);

        // the stack and queue methods are aliases for particular ends
        dq.push(0);            // same as addFirst
        dq.offer(9);           // same as offerLast
        System.out.println(dq + " pop=" + dq.pop() + " poll=" + dq.poll() + " -> " + dq);

        StringBuilder back = new StringBuilder();
        for (Iterator<Integer> it = dq.descendingIterator(); it.hasNext(); ) back.append(it.next()).append(' ');
        System.out.println("back to front: " + back.toString().trim());

        try {
            dq.offerFirst(null);
        } catch (NullPointerException e) {
            System.out.println("null rejected: " + e.getClass().getSimpleName());
        }
    }
}
```

```output
[1, 2, 3, 4] first=1 last=4
4 1 -> [2, 3]
[0, 2, 3, 9] pop=0 poll=2 -> [3, 9]
back to front: 9 3
null rejected: NullPointerException
```

The third line shows the aliasing directly: `push(0)` put `0` at the front, `offer(9)` put `9` at the rear, and then both `pop()` and `poll()` removed from the front. Printing a deque, or iterating it with a `for` loop, goes front to rear; `descendingIterator()` goes rear to front.

### The method families

`Deque` has twelve core methods: three operations (insert, remove, examine) at two ends, each in a version that throws on failure and one that returns a special value.

| | Front, throws | Front, special value | Rear, throws | Rear, special value |
|---|---|---|---|---|
| Insert | `addFirst` | `offerFirst` (returns `false` if full) | `addLast` | `offerLast` |
| Remove | `removeFirst` | `pollFirst` (returns `null` if empty) | `removeLast` | `pollLast` |
| Examine | `getFirst` | `peekFirst` (returns `null` if empty) | `getLast` | `peekLast` |

`ArrayDeque` is unbounded, so `offerX` and `addX` both succeed. The difference that bites in practice is on removal: `pollFirst()` on an empty deque returns `null`, and `int x = dq.pollFirst();` then throws `NullPointerException` while unboxing. Guard with `isEmpty()`. `ArrayDeque` refuses `null` elements for the same reason a queue does — `null` is reserved to mean "empty".

## How it works internally

A deque could be a doubly linked list: each node points to its neighbours, and you keep references to both end nodes. Every end operation is then a few pointer updates. Java's `LinkedList` works this way. The cost is one node object per element and memory scattered across the heap.

`ArrayDeque` instead uses a **circular array** — the same ring buffer as the queue lesson, extended to grow at the front too. It keeps a `head` index for the front element and knows where the rear is. Adding at the rear writes just past the last element; adding at the front *steps `head` backwards*, wrapping from index `0` to the last index of the array. When the array fills, `ArrayDeque` allocates a larger one and copies the elements across in order, so insertions are amortised O(1), exactly like a dynamic array.

The only new piece compared with a circular queue is stepping backwards. In Java, `-1 % 5` is `-1`, not `4`, so `(head - 1) % capacity` would produce a negative index. Add the capacity first: `(head - 1 + capacity) % capacity`. Here is a complete fixed-capacity deque — the interview question *Design Circular Deque*:

```java title="CircularDeque.java"
public class CircularDeque {
    private final int[] items;
    private int head = 0;    // index of the front element
    private int size = 0;

    CircularDeque(int capacity) { items = new int[capacity]; }

    boolean insertFront(int x) {
        if (size == items.length) return false;
        head = (head - 1 + items.length) % items.length;  // step back, wrapping past 0
        items[head] = x;
        size++;
        return true;
    }

    boolean insertLast(int x) {
        if (size == items.length) return false;
        items[(head + size) % items.length] = x;
        size++;
        return true;
    }

    boolean deleteFront() {
        if (size == 0) return false;
        head = (head + 1) % items.length;
        size--;
        return true;
    }

    boolean deleteLast() {
        if (size == 0) return false;
        size--;                                            // the last slot simply stops counting
        return true;
    }

    int getFront() { return size == 0 ? -1 : items[head]; }
    int getRear()  { return size == 0 ? -1 : items[(head + size - 1) % items.length]; }

    public static void main(String[] args) {
        CircularDeque d = new CircularDeque(3);
        System.out.println(d.insertLast(1) + " " + d.insertLast(2) + " " + d.insertFront(3));
        System.out.println(d.insertFront(4));              // full
        System.out.println("rear=" + d.getRear() + " head=" + d.head);
        System.out.println(d.deleteLast() + " " + d.insertFront(4));
        System.out.println("front=" + d.getFront() + " rear=" + d.getRear() + " head=" + d.head);
    }
}
```

```output
true true true
false
rear=2 head=2
true true
front=4 rear=1 head=1
```

Trace the slots (`_` = not part of the deque):

| Step | Slots `[0, 1, 2]` | `head` | `size` | Logical order |
|---|---|---|---|---|
| insertLast 1 | `[1, _, _]` | 0 | 1 | 1 |
| insertLast 2 | `[1, 2, _]` | 0 | 2 | 1, 2 |
| insertFront 3 | `[1, 2, 3]` | 2 | 3 | 3, 1, 2 — `head` wrapped from 0 to 2 |
| insertFront 4 | unchanged | 2 | 3 | refused, full |
| deleteLast | `[1, _, 3]` | 2 | 2 | 3, 1 |
| insertFront 4 | `[1, 4, 3]` | 1 | 3 | 4, 3, 1 |

Two things make this design simple. Keeping `size` rather than a separate `tail` index means "full" is `size == capacity` and "empty" is `size == 0`, with no ambiguity. And deleting from the rear needs no index change at all: decrementing `size` is enough, because the rear is always computed as `head + size - 1`.

## Worked example: palindrome check

**Problem.** Decide whether a string reads the same forwards and backwards, ignoring case and anything that is not a letter or digit. `"A man, a plan, a canal: Panama"` should return `true`.

**Why a deque.** The check compares the two ends and moves inwards. After filtering, a deque gives O(1) access to both ends, and removing each compared pair exposes the next pair.

```java title="Palindrome.java"
import java.util.ArrayDeque;
import java.util.Deque;

public class Palindrome {
    /** True if s reads the same both ways, ignoring case and non-alphanumeric characters. */
    static boolean isPalindrome(String s) {
        Deque<Character> dq = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (Character.isLetterOrDigit(c)) dq.offerLast(Character.toLowerCase(c));
        }
        while (dq.size() > 1) {
            if (!dq.pollFirst().equals(dq.pollLast())) return false;   // compare the two ends
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama"));
        System.out.println(isPalindrome("race a car"));
        System.out.println(isPalindrome(""));
    }
}
```

```output
true
false
true
```

The loop runs while at least two characters remain; a single middle character (odd length) matches itself, and an empty string is a palindrome. Note the `.equals` call: the deque holds `Character` objects, and comparing boxed objects with `!=` compares references. It happens to work for these characters because Java caches `Character` values up to 127, but it would silently break for characters beyond that range — always compare boxed values with `equals`.

This version is O(n) time and O(n) space. In production you would use **two pointers** on the original string instead — `i` from the left, `j` from the right — which is also O(n) time but O(1) extra space (see [[a2-two-pointers]]). The deque version is worth knowing because it shows the access pattern plainly, and because in streaming situations, where characters arrive one at a time and you cannot index into them, a deque is what you would actually keep.

## Worked example: 0-1 BFS

**Problem.** A graph has edges that cost either 0 or 1. Find the shortest distance from a source to every node.

**Why ordinary BFS fails.** BFS with a plain queue assumes every edge costs the same, so it treats a 0-cost edge as a full step and can report distances that are too large. **Dijkstra's algorithm** with a priority queue solves any non-negative weights in O((V + E) log V), but with only two possible weights we can do better.

**Deriving the idea.** Dijkstra's essential rule is: always process the unprocessed node with the smallest known distance next. In BFS, a queue achieves that for free because new nodes are always exactly one step further than the current one. With 0/1 weights, a newly reached node is either at the *same* distance as the current node (via a 0 edge) or one further (via a 1 edge). So the pending nodes only ever hold two distances, `d` and `d + 1`. If same-distance nodes go to the **front** and one-further nodes go to the **back**, the deque stays sorted by distance — front holds `d`, back holds `d + 1` — and taking from the front is exactly Dijkstra's choice, without a heap.

```java title="ZeroOneBfs.java"
import java.util.*;

public class ZeroOneBfs {
    /** edges[u] holds {v, w} pairs with w in {0, 1}. Returns shortest distances from src. */
    static int[] shortest(List<int[]>[] edges, int src) {
        int[] dist = new int[edges.length];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;
        Deque<Integer> dq = new ArrayDeque<>();
        dq.offerFirst(src);
        while (!dq.isEmpty()) {
            int u = dq.pollFirst();
            for (int[] e : edges[u]) {
                int v = e[0], w = e[1];
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    if (w == 0) dq.offerFirst(v);   // same distance as u: handle it next
                    else dq.offerLast(v);           // one more: handle after the current level
                }
            }
        }
        return dist;
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) {
        int n = 5;
        List<int[]>[] edges = new List[n];
        for (int i = 0; i < n; i++) edges[i] = new ArrayList<>();
        int[][] list = {{0, 1, 1}, {0, 2, 0}, {2, 1, 0}, {1, 3, 1}, {2, 4, 1}, {4, 3, 0}};
        for (int[] e : list) edges[e[0]].add(new int[] {e[1], e[2]});
        System.out.println(Arrays.toString(shortest(edges, 0)));
    }
}
```

```output
[0, 0, 0, 1, 1]
```

Dry run (deque shown front → rear):

| Poll | Relaxations | Deque after |
|---|---|---|
| 0 (dist 0) | 1 ← 1 via cost 1 (back); 2 ← 0 via cost 0 (front) | `[2, 1]` |
| 2 (dist 0) | 1 ← 0 via cost 0 (front); 4 ← 1 via cost 1 (back) | `[1, 1, 4]` |
| 1 (dist 0) | 3 ← 1 via cost 1 (back) | `[1, 4, 3]` |
| 1 (dist 0) | 3 is already 1, no improvement | `[4, 3]` |
| 4 (dist 1) | 3 ← 1 via cost 0: not an improvement | `[3]` |
| 3 (dist 1) | no edges | `[]` |

Node 1 was first given distance 1 via the direct edge, then improved to 0 via the free path 0 → 2 → 1, so it appears in the deque twice. The second copy does no harm: when polled, its relaxations find nothing to improve. Each node's distance can only drop from "unknown" to `d + 1` to `d`, so it is pushed a small constant number of times, and the algorithm runs in **O(V + E)** — the same as plain BFS.

Putting a 1-cost node at the front would break the sorted order, letting a farther node be processed before nearer ones; that is the classic bug.

```quiz
Q: On an ArrayDeque, you call push(1), offer(2), push(3). What does pollLast() return?
- [ ] 1
- [x] 2
- [ ] 3
- [ ] null
> push adds at the front and offer adds at the rear. After the three calls the deque is [3, 1, 2], front to rear, so pollLast returns 2. Mixing stack and queue vocabulary on one deque is legal but makes the order hard to reason about.

Q: In a circular deque with capacity 5 and head = 0, where does insertFront write?
- [ ] Index -1
- [ ] Index 1
- [x] Index 4
- [ ] It must shift all elements right first
> Stepping the front backwards from 0 wraps to the last slot: (0 - 1 + 5) % 5 = 4. Writing (head - 1) % 5 in Java gives -1, because Java's % keeps the sign of the left operand. No shifting is needed — that is the point of the ring.

Q: In 0-1 BFS, why are nodes reached by a 0-cost edge added to the front?
- [ ] To process them last
- [x] They have the same distance as the node being processed, so they belong before nodes one step further
- [ ] Because ArrayDeque's offerFirst is faster than offerLast
- [ ] Any end works as long as dist is updated
> The deque must stay ordered by distance so that polling the front always gives the smallest pending distance, as Dijkstra requires. A 0-cost neighbour has distance d, equal to the current node, so it goes to the front; a 1-cost neighbour has d + 1 and goes to the back.
```

## Where both ends matter: recognising deque problems

A deque earns its place when a problem needs **removals at both ends**, or additions at both ends. The common shapes:

- **Sliding window maximum or minimum.** Expired indices leave from the front; indices that can never be the answer again leave from the back. This is the **monotonic deque**, taught in [[a5-monotonic-queue]], and it is the most frequent interview use of a deque.
- **0-1 BFS.** Same-distance nodes at the front, next-distance nodes at the back.
- **Two-ended comparisons on a stream.** Palindromes, or matching the oldest and newest items in a buffer.
- **Rotation.** Rotating a sequence by one is `offerLast(pollFirst())`, O(1), which is handy in simulations such as *Dota2 Senate* or *Reveal Cards in Increasing Order*.
- **Undo with a size limit.** Keep the newest actions at one end for undo, and drop the oldest from the other end when the history grows too long.

If a problem only ever touches one end, you need a stack; if it adds at one end and removes at the other, you need a queue. Using `ArrayDeque` for those is still right, but the *thinking* should be "stack" or "queue", not "deque".

## In real systems

**Work stealing.** Java's `ForkJoinPool` (which runs parallel streams) gives each worker thread its own deque of tasks. A worker pushes and pops its own tasks at one end, like a stack, which keeps recently created, cache-warm tasks local. An idle worker *steals* from the other end of a busy worker's deque, taking the oldest task — usually the largest chunk of remaining work. Two ends let the owner and the thieves mostly stay out of each other's way.

**Browser and editor history with limits.** A bounded history adds new entries at one end and evicts the oldest from the other.

**Schedulers and network buffers.** Some schedulers put urgent or retried jobs at the front of a queue while normal jobs join the back.

**Concurrent deques.** `ArrayDeque` is not thread-safe. For shared use, Java provides `ConcurrentLinkedDeque` (lock-free, non-blocking) and `LinkedBlockingDeque` (optionally bounded, with operations that wait).

## Trade-offs and alternatives

| Implementation | End operations | Memory | Notes |
|---|---|---|---|
| `ArrayDeque` | O(1) amortised | Compact array | Default choice; no `null`; not thread-safe |
| `LinkedList` | O(1) | One node per element | Allows `null`; also a `List`, so it permits index access in O(n) |
| Two stacks | Amortised O(1) for a queue | Two arrays | Interview exercise; awkward for true deque use |
| `ConcurrentLinkedDeque` / `LinkedBlockingDeque` | O(1) | Nodes | For multiple threads |

A deque still gives no fast access to the middle. If you need the k-th element, a sorted order, or the minimum of everything stored, reach for an array, a `TreeMap` or a heap. The monotonic deque is the exception that proves the rule: it answers "minimum of the window" in O(1) only because it *discards* elements that can never be the answer, which is a property of the problem, not of the deque.

## Common mistakes

> [!MISTAKE] Negative index when stepping the front backwards
> In a hand-written circular deque, `(head - 1) % capacity` is `-1` when `head` is `0`, and the array access throws `ArrayIndexOutOfBoundsException`. Write `(head - 1 + capacity) % capacity`.

**Mixing `push` and `offer` on the same deque.** `push` adds to the front; `offer` adds to the rear. Code that uses both while thinking of the deque as "a stack" or "a queue" will process items in an unexpected order.

**Confusing `peekFirst` with `pollFirst`.** In sliding-window code, the stale index must be *removed* with `pollFirst()`; `peekFirst()` only looks at it, and a `while` loop on that condition never ends.

**Unboxing a `null`.** `int x = dq.pollFirst();` on an empty deque throws `NullPointerException`. Check `isEmpty()` first.

**Comparing boxed values with `==`.** A `Deque<Integer>` or `Deque<Character>` holds objects. Use `equals`, or unbox explicitly, when comparing elements.

**Using `LinkedList` by habit.** It works, but it is slower and heavier than `ArrayDeque`. Use it only if you need `null` elements or `List` methods.

## Interview perspective

Interviewers rarely ask "what is a deque?" on its own. They ask problems where a deque is the right state, and they watch for two things: whether you pick the right end for each operation, and whether you can explain why the total work is linear.

> [!INTERVIEW] Explaining 0-1 BFS
> "With 0/1 weights the frontier only ever holds two distances, d and d + 1. If I push 0-edge neighbours to the front and 1-edge neighbours to the back, the deque stays sorted, so polling the front gives the same order Dijkstra would — in O(V + E) without a heap."

Questions to be ready for:

- **Design Circular Deque** — `head`, `size`, wrap-around in both directions, full versus empty.
- **Sliding Window Maximum** — monotonic deque of indices; see [[a5-monotonic-queue]].
- **Minimum Cost to Make at Least One Valid Path in a Grid** and **Minimum Obstacle Removal to Reach Corner** — 0-1 BFS on a grid.
- **Stack versus deque in Java?** `ArrayDeque` is both; avoid the legacy `Stack` class.
- **Follow-up: why `ArrayDeque` over `LinkedList`?** Contiguous memory, no per-element node objects, better cache behaviour.

## Practice

1. **Design Circular Deque** with all eight operations, then add a `toString` that prints front to rear.
2. **Valid Palindrome** with a deque, then with two pointers; compare the space used.
3. **Reveal Cards in Increasing Order.** Simulate the reveal process backwards with a deque.
4. **Minimum Obstacle Removal to Reach Corner.** Moving into an empty cell costs 0 and into an obstacle costs 1; solve with 0-1 BFS.
5. **Sliding Window Maximum.** Attempt it before reading [[a5-monotonic-queue]], then compare your approach.

The DSA explorer lists the matching problems under this topic; start with *Design Circular Deque* and *Sliding Window Maximum*.

## Quick revision {#quick-revision}

- Deque = insert, remove and examine at both front and rear, each O(1) (amortised for a growable array).
- Stack = one end of a deque; queue = add at the rear, remove at the front.
- Java aliases: `push` = `addFirst`, `pop` = `removeFirst`, `offer` = `offerLast`, `poll` = `pollFirst`, `peek` = `peekFirst`.
- `pollX`/`peekX` return `null` when empty; `removeX`/`getX` throw. `ArrayDeque` rejects `null`.
- `ArrayDeque` = growable circular array; `LinkedList` = doubly linked nodes (slower, allows `null`).
- Circular deque: front steps back with `(head - 1 + cap) % cap`; rear is `(head + size - 1) % cap`.
- 0-1 BFS: 0-edge neighbour → `offerFirst`, 1-edge neighbour → `offerLast`; O(V + E).
- Sliding window min/max uses a monotonic deque: expire from the front, discard dominated from the back.
- `ArrayDeque` is not thread-safe; use `ConcurrentLinkedDeque` or `LinkedBlockingDeque` across threads.

## Key takeaways {#key-takeaways}

- A deque generalises both stack and queue, which is why one Java class, `ArrayDeque`, covers all three roles.
- Internally it is a circular array whose front index can step backwards; wrap negative indices by adding the capacity before taking the remainder.
- Reach for a deque when a problem needs to add or remove at both ends — two-ended comparison, 0-1 BFS, sliding window extremes.
- 0-1 BFS works because putting same-distance nodes at the front keeps the deque sorted by distance, matching Dijkstra's order without a heap.
- Be careful with the API: `push` and `offer` use different ends, and `poll` returns `null` on an empty deque.
