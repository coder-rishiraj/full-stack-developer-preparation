---
summary: A heap keeps the smallest (or largest) element permanently at the front while still allowing fast inserts and removals. You will learn how a min heap and a max heap are laid out in a plain array, how sift-up and sift-down restore order in O(log n), why building a heap from n values takes only O(n), and how to get either kind from Java's PriorityQueue without comparator bugs.
difficulty: intermediate
minutes: 60
objectives:
  - Explain the two heap rules — complete shape and heap order — and why together they give O(1) peek and O(log n) updates
  - Trace sift-up and sift-down on an array and compute parent and child indices without drawing the tree
  - Implement a min heap from scratch and derive why bottom-up heapify runs in O(n)
  - Choose between a min heap and a max heap for a problem, and build a max heap in Java without overflow bugs
  - Compare heaps with sorted arrays, balanced trees and hash maps for a given workload
---

## Introduction

Many programs repeatedly ask one question: *what is the smallest item right now?* A job scheduler asks which job is due soonest. Dijkstra's shortest-path algorithm asks which unfinished node is closest. A program merging ten sorted files asks which file's next line comes first. Between questions, new items keep arriving and the smallest item keeps being removed, so the answer keeps changing.

The obvious structures handle this badly. If you keep items in an unsorted list, adding is instant but finding the minimum means scanning everything: O(n) per question. If you keep the list sorted, the minimum is at the front, but every insert has to shift elements to make room: O(n) per insert. Either way, a workload of n inserts and n removals costs O(n²).

A **heap** is the structure built for exactly this workload. A **min heap** keeps the smallest element at a known position, so reading it is O(1), and both inserting a new element and removing the smallest one take O(log n). It does this by being only *partially* sorted: it maintains only enough order to find the minimum, and no more. That restraint is the whole trick, and this lesson shows how it works. A **max heap** is the mirror image, keeping the largest element at the front; it has its own section below.

In Java you rarely write a heap yourself: `java.util.PriorityQueue` is a binary min heap. But you need to understand the mechanism to reason about complexity, choose the right polarity (min or max), write correct comparators, and answer the follow-up questions interviewers ask, such as "how would you build a heap in linear time?". The heap is also the engine behind the rest of this module — [[a7-priority-queues]], [[a7-top-k]], [[a7-k-way-merge]] and [[a7-running-median]].

## Before you start

- **Binary trees** — nodes, children, levels and height. See [[a6-binary-trees]].
- **Big-O notation** — what O(log n) and O(n) mean, and why log n grows so slowly. See [[a1-big-o]].
- **Arrays and indexing** — the heap lives in an array, so index arithmetic matters. See [[a2-array-string-traversal]].
- **Comparators** — how Java decides which of two objects comes first, and why subtraction is dangerous. See [[a1-comparable-comparator]].

## The intuition

Picture a company's org chart where the rule is that every manager is more senior than the people who report directly to them. Who is the most senior person in the company? The person at the top, necessarily — follow any chain upward and seniority only increases. You know that without comparing everyone.

Notice what the rule does *not* say. It does not say anything about how two people in different departments compare, or whether a manager on the third level is more senior than a direct report of the CEO on another branch. The chart is not a ranking of everybody. It only guarantees that the top is the top.

A min heap is that org chart with "smaller" in place of "more senior". Every parent is smaller than or equal to its children, so the root is the minimum. Because the rule is local — it only relates a node to its own children — fixing it after a change only requires work along one path from top to bottom, and in a well-shaped tree that path is short.

Where the analogy stops working: real org charts are lopsided, with one manager having twelve reports and another having one. A heap insists on a very specific shape, and that shape is what makes it fast.

## The two heap rules

A **binary heap** is a binary tree that obeys two rules at all times.

**Rule 1 — shape.** The tree is a **complete binary tree**: every level is completely full except possibly the last, and the last level is filled from left to right with no gaps. With 6 elements, the tree has a root, two children on level 1, and three nodes on level 2 filling its leftmost slots.

**Rule 2 — order.** In a **min heap**, every node's value is less than or equal to the values of its children. This is called the **heap property** (or heap order).

The order rule gives the fast peek: by following the property upward from any node, values never increase, so the root holds the minimum of the whole heap. The shape rule gives the fast updates: a complete tree with n nodes has height ⌊log₂ n⌋, because each full level doubles the number of nodes. A heap with a million elements is only 19 levels deep, and every update in this lesson walks along at most one root-to-leaf path.

The two rules together still leave many valid heaps for the same values. Both `[1, 3, 2, 5, 9, 8]` and `[1, 2, 3, 5, 9, 8]` are valid min heaps of the same six numbers. Siblings, cousins and nodes on different branches are not ordered relative to each other. That freedom is why a heap can be maintained cheaply — and also why a heap is *not* a sorted structure.

## Storing a tree in an array

Because the tree is complete, it has no gaps, so you can lay it out level by level in a plain array and never need pointers. The root goes at index 0, its two children at indices 1 and 2, their four children at indices 3 to 6, and so on. With 0-based indexing, for a node at index `i`:

| Relationship | Index |
|---|---|
| Left child | `2 * i + 1` |
| Right child | `2 * i + 2` |
| Parent | `(i - 1) / 2` (integer division) |
| Last parent (in a heap of size n) | `n / 2 - 1` |
| Is a leaf | `2 * i + 1 >= n` |

You can check the formulas on a small case. Node 1's children are 3 and 4; node 2's children are 5 and 6. Going back, `(3 - 1) / 2 = 1` and `(4 - 1) / 2 = 1`, so both have parent 1. The last parent formula holds because node `n / 2 - 1` has left child `n - 1`, the last element, and every later node would have its left child past the end.

```mermaid title="The min heap [1, 3, 2, 5, 9, 8] as a tree; the label shows array index and value"
flowchart TB
    A["0: 1"] --> B["1: 3"]
    A --> C["2: 2"]
    B --> D["3: 5"]
    B --> E["4: 9"]
    C --> F["5: 8"]
```

The array layout is a practical win, not merely a neat trick. There are no node objects and no child pointers, so a heap of `int`s uses one array slot per element. The elements sit next to each other in memory, which the CPU cache handles well. And "add a leaf in the next free position" — which the shape rule requires — becomes "append to the end of the array".

> [!TIP] 1-based heaps
> Some textbooks start the root at index 1 so that the children of `i` are `2i` and `2i + 1` and the parent is `i / 2`. It is the same structure with slightly simpler arithmetic. Pick one convention per program and never mix them.

## Inserting: sift up

To insert a value, you must keep both rules true. The shape rule leaves no choice about *where* the new node goes: the next free slot on the last level, which is index `size` in the array. That placement can break the order rule, because the new value may be smaller than its parent.

The fix is **sift up** (also called swim, bubble up or percolate up): while the new value is smaller than its parent, swap it with the parent and continue from the parent's position. Each swap moves the smaller value up, and the parent that moves down is still smaller than or equal to its other child — it was already that child's parent — so the order rule holds everywhere below the moving value. When the value stops, either it reached the root or its parent is ≤ it, and the heap is valid again.

Here is a trace of inserting `5, 3, 8, 1, 9, 2` into an empty min heap. The "array" column shows the state after the insert finishes.

| Insert | Placed at index | Comparisons and swaps | Array afterwards |
|---|---|---|---|
| 5 | 0 | it is the root | `[5]` |
| 3 | 1 | parent `5` at index 0 is larger: swap | `[3, 5]` |
| 8 | 2 | parent `3` is smaller: stop | `[3, 5, 8]` |
| 1 | 3 | parent `5` at index 1: swap; parent `3` at index 0: swap | `[1, 3, 8, 5]` |
| 9 | 4 | parent `3` at index 1 is smaller: stop | `[1, 3, 8, 5, 9]` |
| 2 | 5 | parent `8` at index 2: swap; parent `1` at index 0: stop | `[1, 3, 2, 5, 9, 8]` |

The worst case is a new minimum, which travels from the bottom to the root — one swap per level, so O(log n). The best case is a value no smaller than its parent: one comparison, no swaps.

## Removing the minimum: sift down

The minimum is at the root, so `poll` returns `a[0]`. The difficulty is the hole it leaves. The shape rule says the node that disappears must be the *last* one, so the standard move is: take the last element, put it at the root, and shrink the size by one. Now the shape is right, but the new root is probably too large.

The fix is **sift down** (also called sink or percolate down): compare the node with its children, and if either child is smaller, swap it with the **smaller** child; continue from that child's position until the node is ≤ both children or has none.

Why the *smaller* child? After the swap, the child that moved up becomes the parent of its former sibling. If you promoted the larger child, it would sit above a smaller sibling and break the order rule immediately. Promoting the smaller one guarantees the new parent is ≤ both positions below it.

Trace `poll()` on `[1, 3, 2, 5, 9, 8]`:

| Step | Array | Node being sifted | Children (index: value) | Action |
|---|---|---|---|---|
| Remove root | `[_, 3, 2, 5, 9, 8]` | — | — | save `1` to return |
| Move last to root | `[8, 3, 2, 5, 9]` | index 0: `8` | 1: `3`, 2: `2` | smaller child is `2`; `8 > 2`: swap |
| Continue | `[2, 3, 8, 5, 9]` | index 2: `8` | none (5 is past the end) | leaf: stop |

The method returns `1` and the heap is `[2, 3, 8, 5, 9]`. A second `poll` returns `2`: the last element `9` moves to the root, swaps with the smaller child `3`, then with the smaller child `5`, leaving `[3, 5, 8, 9]`. Sift down also does at most one swap per level, so it is O(log n), with up to two comparisons per level.

`peek` reads `a[0]`: O(1).

## A complete implementation

Writing a heap once by hand is the fastest way to make the rules stick. This version stores `int`s, grows its array when full, and includes a `heapify` builder that the next section explains.

```java title="MinHeap.java"
import java.util.Arrays;

public class MinHeap {
    private int[] a = new int[8];
    private int size = 0;

    public void offer(int x) {
        if (size == a.length) a = Arrays.copyOf(a, size * 2);  // grow like ArrayList
        a[size] = x;                                            // next free slot keeps the tree complete
        siftUp(size);
        size++;
    }

    public int peek() {
        if (size == 0) throw new IllegalStateException("heap is empty");
        return a[0];                                            // the root is the minimum
    }

    public int poll() {
        int min = peek();
        size--;
        a[0] = a[size];                                         // last leaf fills the hole at the root
        siftDown(0);
        return min;
    }

    public int size() { return size; }

    private void siftUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (a[i] >= a[parent]) break;                       // order is restored
            swap(i, parent);
            i = parent;
        }
    }

    private void siftDown(int i) {
        while (true) {
            int left = 2 * i + 1;
            if (left >= size) break;                            // i is a leaf
            int right = left + 1;
            int smaller = (right < size && a[right] < a[left]) ? right : left;
            if (a[i] <= a[smaller]) break;                      // order is restored
            swap(i, smaller);
            i = smaller;
        }
    }

    /** Builds a heap from existing values in O(n) by sifting down every parent. */
    public static MinHeap heapify(int[] values) {
        MinHeap h = new MinHeap();
        h.a = Arrays.copyOf(values, Math.max(values.length, 1));
        h.size = values.length;
        for (int i = h.size / 2 - 1; i >= 0; i--) h.siftDown(i);  // last parent first
        return h;
    }

    private void swap(int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    @Override
    public String toString() { return Arrays.toString(Arrays.copyOf(a, size)); }

    public static void main(String[] args) {
        MinHeap h = new MinHeap();
        for (int x : new int[]{5, 3, 8, 1, 9, 2}) {
            h.offer(x);
            System.out.println("offer " + x + " -> " + h);
        }
        System.out.println("poll -> " + h.poll() + ", heap " + h);
        System.out.println("poll -> " + h.poll() + ", heap " + h);

        MinHeap built = heapify(new int[]{9, 4, 7, 1, 8, 2, 6});
        System.out.println("heapify -> " + built);
        StringBuilder out = new StringBuilder();
        while (built.size() > 0) out.append(built.poll()).append(' ');
        System.out.println("drain -> " + out.toString().trim());
    }
}
```

```output
offer 5 -> [5]
offer 3 -> [3, 5]
offer 8 -> [3, 5, 8]
offer 1 -> [1, 3, 8, 5]
offer 9 -> [1, 3, 8, 5, 9]
offer 2 -> [1, 3, 2, 5, 9, 8]
poll -> 1, heap [2, 3, 8, 5, 9]
poll -> 2, heap [3, 5, 8, 9]
heapify -> [1, 4, 2, 9, 8, 7, 6]
drain -> 1 2 4 6 7 8 9
```

A few details deserve attention. `offer` writes the value at index `size` *before* incrementing `size`, so `siftUp` works on a valid index. `poll` decrements `size` first, so `a[size]` is the last element; when the heap had one element, it copies index 0 onto itself and `siftDown` stops at once because index 0 has no children. The loop conditions in `siftUp` and `siftDown` use `>=` and `<=`, so equal values do not swap — equal keys are allowed and they stop the sift early, which saves work. Finally, draining the heap with repeated `poll` produces `1 2 4 6 7 8 9`: sorted order, even though the array itself never was sorted. Draining a heap is how **heap sort** works.

## Building a heap in O(n)

Suppose you already have all n values. Inserting them one by one costs O(log n) each, so O(n log n) in total. There is a faster way, called **heapify** or bottom-up heap construction, and it is what `new PriorityQueue<>(collection)` does.

Copy the values into the array as they are — the shape rule is automatically satisfied, because any array is a complete tree. Then repair the order from the bottom up: call `siftDown` on every parent, starting from the last parent at `n / 2 - 1` and moving towards the root. Leaves need no work; a single node is already a valid heap. When you sift down node `i`, both of its subtrees are already valid heaps (their roots have higher indices and were processed earlier), and sift down is exactly the operation that merges a root with two valid sub-heaps into one valid heap.

Trace `heapify([9, 4, 7, 1, 8, 2, 6])`, where n = 7 and the last parent is index 2:

| Sift down at | Before | Action | After |
|---|---|---|---|
| index 2 (`7`) | `[9, 4, 7, 1, 8, 2, 6]` | children `2`, `6`; swap with `2` | `[9, 4, 2, 1, 8, 7, 6]` |
| index 1 (`4`) | `[9, 4, 2, 1, 8, 7, 6]` | children `1`, `8`; swap with `1` | `[9, 1, 2, 4, 8, 7, 6]` |
| index 0 (`9`) | `[9, 1, 2, 4, 8, 7, 6]` | swap with `1`, then with `4` | `[1, 4, 2, 9, 8, 7, 6]` |

**Why it is O(n), not O(n log n).** The cost of `siftDown` at a node is bounded by that node's *height* — the distance to the bottom — not by log n. And most nodes have tiny heights. In a complete tree, about half the nodes are leaves (height 0, no work), about a quarter have height 1 (at most one swap), an eighth have height 2, and so on. The total work is at most

n/4 · 1 + n/8 · 2 + n/16 · 3 + … = n · Σ h / 2^(h+1)

and the series Σ h / 2^(h+1) for h = 1, 2, 3, … adds up to exactly 1. So the total is at most about n swaps: O(n). Inserting one by one is slower because it does the opposite — the many nodes at the *bottom* are the ones that might travel the full height to the root.

The O(n) build matters in practice when you have a large batch of data up front: heapify it once, then poll only what you need. For example, the 10 smallest of a million values cost O(n + 10 log n) this way.

```quiz
Q: In a 0-indexed array heap, what are the children of the node at index 4?
- [ ] Indices 8 and 9
- [x] Indices 9 and 10
- [ ] Indices 5 and 6
- [ ] Index 2 only
> With 0-based indexing the children of i are 2i + 1 and 2i + 2, so 9 and 10. Indices 8 and 9 would be correct for a 1-based heap (2i and 2i + 1), which is why mixing conventions causes bugs.

Q: During sift-down in a min heap, why must the node swap with the smaller of its two children?
- [ ] Because the smaller child is always the left child
- [ ] Because it does fewer comparisons
- [x] Because the promoted child becomes the parent of its sibling and must be no larger than it
- [ ] Any child works; the choice only affects speed
> After the swap, the promoted child sits above its former sibling. Promoting the larger child would place it above a smaller value and break the heap property immediately. The smaller child is not necessarily on the left.

Q: Why does bottom-up heapify run in O(n) even though each sift-down can cost O(log n)?
- [ ] Because it skips half of the elements entirely
- [x] Because the cost of sifting a node is bounded by its height, and most nodes are near the bottom with small heights
- [ ] Because Java optimises the loop
- [ ] It does not; it is O(n log n) like repeated inserts
> Half the nodes are leaves and cost nothing, a quarter cost at most one swap, an eighth at most two, and so on. The weighted sum is bounded by n. Only the few nodes near the root can pay log n.
```

## Using Java's PriorityQueue as a min heap

`java.util.PriorityQueue` is a binary heap stored in an `Object[]` array, implemented with the same sift-up and sift-down you wrote above. Without a comparator it is a min heap by natural ordering.

| Heap operation | `PriorityQueue` method | Time | Empty heap |
|---|---|---|---|
| Insert | `offer(x)` / `add(x)` | O(log n) | — |
| Read minimum | `peek()` | O(1) | returns `null` |
| Remove minimum | `poll()` | O(log n) | returns `null` |
| Read / remove, throwing | `element()` / `remove()` | O(1) / O(log n) | throws `NoSuchElementException` |
| Build from collection | `new PriorityQueue<>(collection)` | O(n) | — |
| Search / remove arbitrary | `contains(x)` / `remove(x)` | O(n) | — |

Two of these rows cause real bugs. `peek()` and `poll()` return `null` on an empty queue, and assigning that to an `int` throws `NullPointerException` during unboxing — check `isEmpty()` first. And `contains` and `remove(Object)` scan the array linearly, because heap order says nothing about where an arbitrary value lives. If an algorithm calls them inside a loop, it is quietly O(n²).

Iterating over a `PriorityQueue` or printing it shows the internal array — the heap order, not sorted order. `PriorityQueue` also rejects `null` elements and is not thread-safe; `PriorityBlockingQueue` is the concurrent version. The full API, comparator design and patterns are covered in [[a7-priority-queues]] and the collections overview in [[a1-priorityqueue]].

For a heap of objects or pairs, pass a comparator that orders by the key you want at the top:

```java
// min heap of {distance, node} pairs ordered by distance
PriorityQueue<int[]> pq = new PriorityQueue<>((p, q) -> Integer.compare(p[0], q[0]));
```

Use `Integer.compare`, not `p[0] - q[0]`; the next section shows the subtraction bug in action.

## Max Heap {#a7-max-heap}

A **max heap** is a heap in which every parent is greater than or equal to its children, so the root holds the **maximum** instead of the minimum. Everything else is identical: the same complete-tree shape, the same array layout and index formulas, the same O(1) peek, O(log n) insert and remove, and O(n) heapify. The only change is the direction of each comparison. Sift up moves a value upward while it is *larger* than its parent, and sift down swaps a node with its *larger* child while that child is larger than it — the mirror of the min-heap rule, for the same reason: the promoted child must dominate its former sibling.

You need a max heap whenever the question is "what is the largest item right now?": a scheduler that always runs the highest-priority job, a simulation that always processes the heaviest object, or the lower half of the numbers in a running median, where you need the largest of the small values ([[a7-running-median]]).

### Building a max heap in Java

Java has no `MaxPriorityQueue` class. You get a max heap by giving `PriorityQueue` a comparator that reverses the order, so that the "smallest" element according to the comparator is the largest value. There are several ways to write that comparator, and two popular shortcuts are wrong. The program below puts the same five values, including the extreme `int` values, into four heaps and drains each one.

```java title="MaxHeapDemo.java"
import java.util.*;

public class MaxHeapDemo {
    static String drain(PriorityQueue<Integer> pq) {
        List<Integer> out = new ArrayList<>();
        while (!pq.isEmpty()) out.add(pq.poll());
        return out.toString();
    }

    public static void main(String[] args) {
        List<Integer> values = List.of(1, Integer.MIN_VALUE, 7, Integer.MAX_VALUE, -3);

        PriorityQueue<Integer> correct = new PriorityQueue<>(Comparator.reverseOrder());
        correct.addAll(values);
        System.out.println("reverseOrder    " + drain(correct));

        PriorityQueue<Integer> compare = new PriorityQueue<>((x, y) -> Integer.compare(y, x));
        compare.addAll(values);
        System.out.println("compare(y, x)   " + drain(compare));

        PriorityQueue<Integer> subtract = new PriorityQueue<>((x, y) -> y - x);   // bug
        subtract.addAll(values);
        System.out.println("y - x           " + drain(subtract));

        PriorityQueue<Integer> negated = new PriorityQueue<>();                     // bug
        for (int v : values) negated.offer(-v);
        List<Integer> out = new ArrayList<>();
        while (!negated.isEmpty()) out.add(-negated.poll());
        System.out.println("negate trick    " + out);
    }
}
```

```output
reverseOrder    [2147483647, 7, 1, -3, -2147483648]
compare(y, x)   [2147483647, 7, 1, -3, -2147483648]
y - x           [-3, -2147483648, 2147483647, 7, 1]
negate trick    [-2147483648, 2147483647, 7, 1, -3]
```

The first two heaps are correct: `Comparator.reverseOrder()` for any naturally ordered type, or `Integer.compare(y, x)` with the arguments swapped. For objects, `Comparator.comparingInt(Task::priority).reversed()` does the same job.

The third heap is wrong because **`y - x` overflows**. Comparing `x = Integer.MIN_VALUE` with `y = 1`, the true difference is 2,147,483,649, which does not fit in an `int`, so it wraps around to a negative number and the comparator reports the wrong order. The heap does not crash; it silently returns elements in a nonsensical order. With small values, such as array indices or ages, subtraction happens to work, which is exactly why the bug survives testing.

The fourth approach — store `-x` in a min heap and negate on the way out — is common in Python, where integers do not overflow. In Java it breaks on `Integer.MIN_VALUE`, because `-Integer.MIN_VALUE` is still `Integer.MIN_VALUE`. The negated minimum lands at the top and comes out first.

### When to choose a max heap

Choosing the polarity is the first decision in most heap problems, and the rule is not always the obvious one. Use a max heap when you repeatedly need the largest element — but also when you are keeping the **k smallest** elements of a stream. In that case you hold the k best candidates seen so far and must evict the *worst* of them, which for "smallest" means the largest; the max heap puts it at the root, ready to evict. The program below shows both uses: keeping the 3 smallest values, and simulating "Last Stone Weight", where the two heaviest stones are repeatedly smashed together.

```java title="KSmallest.java"
import java.util.*;

public class KSmallest {
    /** Returns the k smallest values in ascending order using a max-heap of size k. */
    static List<Integer> kSmallest(int[] nums, int k) {
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());
        for (int x : nums) {
            maxHeap.offer(x);
            if (maxHeap.size() > k) maxHeap.poll();   // evict the largest survivor
        }
        List<Integer> result = new ArrayList<>(maxHeap);
        Collections.sort(result);
        return result;
    }

    /** Last Stone Weight: smash the two heaviest stones until at most one remains. */
    static int lastStone(int[] stones) {
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());
        for (int s : stones) maxHeap.offer(s);
        while (maxHeap.size() > 1) {
            int y = maxHeap.poll(), x = maxHeap.poll();   // y >= x
            if (y != x) maxHeap.offer(y - x);
        }
        return maxHeap.isEmpty() ? 0 : maxHeap.peek();
    }

    public static void main(String[] args) {
        System.out.println(kSmallest(new int[]{7, 10, 4, 3, 20, 15}, 3));
        System.out.println(lastStone(new int[]{2, 7, 4, 1, 8, 1}));
    }
}
```

```output
[3, 4, 7]
1
```

For the k smallest values the heap never holds more than k + 1 elements, so each step costs O(log k) and the whole pass O(n log k) — the subject of [[a7-top-k]]. In Last Stone Weight, each round removes at least one stone, so there are at most n rounds of O(log n) work. The subtraction `y - x` there is safe because stone weights are positive and `y >= x`; it is comparators that must avoid subtraction, not arithmetic in general.

| You need | Heap | Why |
|---|---|---|
| The current minimum, repeatedly | min heap | root is the minimum |
| The current maximum, repeatedly | max heap | root is the maximum |
| The k largest of many values | min heap of size k | root is the weakest survivor, evicted when a larger value arrives |
| The k smallest of many values | max heap of size k | root is the largest survivor, evicted when a smaller value arrives |
| The median of a stream | max heap (lower half) + min heap (upper half) | the two roots sit at the middle |

Max heaps also power **heap sort**: heapify the array into a max heap in place, then repeatedly swap the root (the maximum) with the last element of the heap region and sift down within a region that shrinks by one. The largest values collect at the end of the array, giving an ascending sort in O(n log n) time and O(1) extra space. It is not stable, and in practice it is usually slower than quicksort or merge sort because sift-down jumps around the array in a cache-unfriendly way.

## In real systems

**Timers and schedulers.** `java.util.Timer` keeps its tasks in a binary min heap ordered by next execution time, and `ScheduledThreadPoolExecutor` uses an internal heap-based queue (`DelayedWorkQueue`) the same way: the worker thread peeks at the root to learn how long it can sleep. See [[c3-scheduled-executor]].

**Graph algorithms.** Dijkstra's algorithm and Prim's minimum spanning tree algorithm repeatedly take the closest unfinished node from a min heap ([[a8-dijkstra-priority-queue]], [[a8-mst-prim]]).

**Databases and external sorting.** When a sort is too large for memory, databases sort chunks, write them to disk, and merge them with a min heap holding the front of each chunk ([[a7-k-way-merge]]). A heap also appears in top-N queries: an `ORDER BY … LIMIT 10` over a large table can keep only the best ten rows in a bounded heap instead of sorting everything — PostgreSQL reports this as a "top-N heapsort" in `EXPLAIN ANALYZE`.

**Operating systems and networking.** Event-driven simulators and many network stacks keep pending timeouts in heaps or heap-like structures keyed by deadline, because "what expires next?" is a minimum query.

## Trade-offs and alternatives

| Structure | Read min | Insert | Remove min | Find / remove arbitrary | Sorted iteration |
|---|---|---|---|---|---|
| Unsorted array | O(n) | O(1) amortized | O(n) | O(n) | no |
| Sorted array | O(1) | O(n) | O(1) from the end | O(log n) find, O(n) remove | yes |
| Binary heap | O(1) | O(log n) | O(log n) | O(n) | no |
| Balanced BST (`TreeMap`/`TreeSet`) | O(log n) | O(log n) | O(log n) | O(log n) | yes |
| Hash map | O(n) | O(1) average | O(n) | O(1) average | no |

A heap wins when the workload is *only* "add" and "take the extreme". It uses less memory than a balanced tree (no node objects or pointers), has smaller constants, and builds from a batch in O(n). A `TreeSet` or `TreeMap` costs more per operation but answers more questions: remove any element in O(log n), iterate in sorted order, find the largest value below `x`. If you find yourself wanting to delete arbitrary elements from a heap or update their priorities, consider a `TreeSet` (with a tie-breaker so equal keys are not merged) or the lazy-deletion technique from [[a7-priority-queues]]. If you need the k-th smallest only once on static data, quickselect ([[a3-quickselect]]) does it in O(n) average time without a heap. If the data never changes and you need everything in order, sort it once.

## Common mistakes

> [!MISTAKE] Expecting the heap to be sorted
> Printing a `PriorityQueue`, iterating it with a for-each loop, or converting it with `new ArrayList<>(pq)` gives heap order, such as `[1, 3, 2, 5, 9, 8]`. Only the root is guaranteed. Poll repeatedly, or copy and sort, when you need sorted output.

**Using the wrong polarity.** `PriorityQueue` is a min heap by default. Code that expects the largest element at `peek()` without passing a reversed comparator returns the smallest. Decide polarity first from what you need to *evict* or *read*, then write the comparator.

**Comparator subtraction.** `(a, b) -> a - b` and `(a, b) -> b - a` overflow for values far apart, as the demo above showed. Use `Integer.compare`, `Long.compare`, `Comparator.comparingInt` or `Comparator.reverseOrder()`.

**Unboxing `null`.** `int top = pq.peek();` on an empty queue throws `NullPointerException`, because `peek()` returns `null`. Guard with `isEmpty()`.

**Mutating an element inside the heap.** If you change a field that the comparator reads while the object sits in a `PriorityQueue`, the heap does not notice; that element is now in the wrong place and later polls return wrong answers. Remove it, change it, and reinsert it — or insert a new entry and skip the stale one later.

**Off-by-one in index formulas.** Using `2 * i` and `2 * i + 1` with a 0-based array makes index 0 its own child. With 0-based arrays the children are `2i + 1` and `2i + 2`.

## Interview perspective

Interviewers expect you to know the complexities without hesitation — O(1) peek, O(log n) insert and remove, O(n) heapify, O(n) arbitrary search — and to know that `PriorityQueue` is a min heap by default. Most heap questions are really about *choosing* the heap: say which polarity you need and why in one sentence before writing code.

> [!INTERVIEW] A strong explanation of the mechanism
> "A heap is a complete binary tree stored in an array, where each parent is no larger than its children, so the minimum is at index 0. Insert appends at the end and sifts up; remove-min moves the last element to the root and sifts down towards the smaller child. Both walk one root-to-leaf path, and a complete tree has height log n."

Questions to be ready for:

- **Min heap versus sorted array for repeated minimum?** Both read the minimum in O(1), but inserting into a sorted array shifts elements, O(n); the heap inserts in O(log n).
- **How do you build a heap in O(n)?** Copy the values, then sift down every parent from `n / 2 - 1` back to 0; the cost is bounded by the sum of node heights, which is O(n).
- **Why use a min heap to find the k-th largest element?** Keep the k largest seen so far; the smallest of them sits at the root and is the k-th largest overall, and it is the one to evict when a larger value arrives.
- **How do you make a max heap in Java?** `new PriorityQueue<>(Comparator.reverseOrder())`, or `(a, b) -> Integer.compare(b, a)` — and explain why `b - a` is wrong.
- **Can you delete an arbitrary element?** With `PriorityQueue`, only in O(n). An indexed heap, which also stores each element's position in a map, supports O(log n) delete and decrease-key; in interviews, lazy deletion is the usual substitute.

## Practice

1. **Validate a heap.** Given an `int[]`, return whether it satisfies the min-heap property. Use the parent formula, and do it in one O(n) pass.
2. **Generic heap.** Change `MinHeap` to `MinHeap<T>` that takes a `Comparator<? super T>`, so the same class can act as a min or a max heap.
3. **Kth Largest Element in an Array.** Solve it with a size-k min heap, then explain why a max heap of all n elements followed by k polls is slower when k is small.
4. **Last Stone Weight** and **Kth Smallest Element in a Sorted Matrix.** The first is a direct max-heap simulation; the second is a small k-way merge ([[a7-k-way-merge]]).
5. **Heap sort.** Implement in-place heap sort with a max heap, then trace it on `[4, 10, 3, 5, 1]`.

The DSA explorer lists the matching problems under the Heaps topics; *Kth Largest Element in an Array*, *Last Stone Weight* and *Sort an Array* (with heap sort) are good starting points.

## Quick revision {#quick-revision}

- Heap = complete binary tree + heap order. Min heap: parent ≤ children, root = minimum. Max heap: parent ≥ children, root = maximum.
- Array layout (0-based): children `2i + 1`, `2i + 2`; parent `(i - 1) / 2`; last parent `n / 2 - 1`.
- Insert: place at index `size`, sift up while smaller than parent (min heap). O(log n).
- Remove root: move last element to root, sift down towards the smaller child (larger child for a max heap). O(log n).
- Peek O(1). Heapify (sift down every parent, last to first) O(n). Arbitrary search/remove O(n).
- Height of a complete tree is ⌊log₂ n⌋; that is why updates are logarithmic.
- Java: `PriorityQueue` is a min heap; max heap via `Comparator.reverseOrder()` or `Integer.compare(b, a)`. Never `b - a`; never negate `int`s.
- `peek`/`poll` return `null` when empty; iteration is not sorted; no `null` elements; not thread-safe.
- k largest → min heap of size k; k smallest → max heap of size k.

| Operation | Min heap | Max heap |
|---|---|---|
| Root holds | minimum | maximum |
| Sift up while | child < parent | child > parent |
| Sift down swaps with | smaller child | larger child |
| Java | `new PriorityQueue<>()` | `new PriorityQueue<>(Comparator.reverseOrder())` |

## Key takeaways {#key-takeaways}

- A heap is only partially ordered: it guarantees the root and nothing else, and that restraint is what makes updates cheap.
- The complete-tree shape keeps the height at log n and lets the tree live in a plain array with arithmetic in place of pointers.
- Sift up repairs order after an insert at the bottom; sift down repairs it after the last element replaces the root; each walks one path.
- Building a heap bottom-up costs O(n), because most nodes are near the bottom and have little distance to sift.
- A max heap is the same structure with comparisons reversed; in Java you get it with a reversed comparator, never with subtraction or negation.
- Pick the polarity from what you need to read or evict — which is why the k largest elements use a min heap.
