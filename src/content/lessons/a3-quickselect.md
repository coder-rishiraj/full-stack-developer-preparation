---
summary: Quickselect finds the k-th smallest element of an unsorted array in O(n) average time by partitioning like quicksort but continuing into only one side. You will learn why discarding a side is safe, why the average cost is linear, how to avoid its O(n²) worst case, and when a heap is the better tool.
difficulty: intermediate
minutes: 35
objectives:
  - Explain why, after a partition, the k-th smallest element must lie on one known side of the pivot
  - Implement iterative quickselect with a random pivot and convert "k-th largest" into the right index
  - Derive the O(n) average running time and the O(n²) worst case
  - Choose between quickselect, a size-k heap and full sorting for order-statistic and top-k problems
---

## Introduction

Many questions about data ask for one element by its rank rather than the whole sorted order. What is the median response time? Which player has the 10th highest score? What value separates the top 1% of transactions from the rest? Each of these asks for the **k-th smallest** element — the element that would sit at index `k` if the array were sorted. That element is called the **k-th order statistic**.

The simplest answer is to sort the array and read index `k`. That costs O(n log n) and produces a lot of information the question never asked for: the exact order of every other element.

**Quickselect** gets the answer in O(n) time on average by doing only the work that matters. It reuses the partition step from [[a3-quick-sort]]: after partitioning around a pivot, the pivot sits at its final sorted index `p`. If `p == k`, the pivot is the answer. If `k < p`, the answer is somewhere left of the pivot, and everything on the right can be ignored for good. If `k > p`, the answer is on the right. Quicksort recurses into both sides; quickselect continues into only one. The algorithm was published by Tony Hoare alongside quicksort, which is why it is also called **Hoare's selection algorithm**.

## Before you start

- [[a3-quick-sort]] — you need the Lomuto partition, its invariant, and the idea of a random pivot. This lesson does not re-derive them.
- [[a3-binary-search]] — quickselect's loop shrinks a range `[lo, hi]` known to contain the answer, much like binary search does.
- [[a7-min-heap]] — for the heap-based alternative compared later.

## The intuition

Suppose 1,000 runners have finished a race and you want to know who came 300th, but nobody has sorted the results. Pick a random runner — say their time is 52 minutes — and split everyone into "faster than 52" and "slower than 52". If 420 runners were faster, then the 300th runner is among those 420, and the 579 slower runners are irrelevant. You never need to sort them, or even look at them again. Pick a random runner from the 420 and split again.

Each split typically throws away a large fraction of the remaining runners. That is the same halving instinct as binary search, applied to an unsorted collection by using partitioning to create the order we need — but only around one point at a time.

## Why discarding one side is safe

Lomuto partitioning on `a[lo..hi]` returns an index `p` with three guarantees: `a[p]` is the pivot, every element in `a[lo..p-1]` is at most the pivot, and every element in `a[p+1..hi]` is greater. So exactly `p - lo` elements of the range are placed before the pivot, and the pivot is at its correct sorted position.

Now compare `p` with the target index `k`:

| Case | Conclusion | Next range |
|---|---|---|
| `p == k` | The pivot is the k-th smallest | Return `a[p]` |
| `k < p` | The k-th smallest is one of the elements at most the pivot | `[lo, p - 1]` |
| `k > p` | The k-th smallest is one of the elements greater than the pivot | `[p + 1, hi]` |

The invariant is the same shape as in binary search: **the element that belongs at index `k` is somewhere in `a[lo..hi]`.** Partitioning keeps elements inside their own side, so indices stay meaningful — the element that ends at index `k` when the whole array is sorted is the one we are looking for, and we never need to adjust `k` as the range shrinks.

## Dry run

Find the element at index 2 (the 3rd smallest) of `[3, 2, 1, 5, 6, 4]`. For a predictable trace, use the last element as the pivot instead of a random one.

| Step | `lo` | `hi` | Pivot | Array after partition | `p` | Decision |
|---|---|---|---|---|---|---|
| 1 | 0 | 5 | 4 | `[3, 2, 1, 4, 6, 5]` | 3 | `k = 2 < 3`, so `hi = 2` |
| 2 | 0 | 2 | 1 | `[1, 2, 3, 4, 6, 5]` | 0 | `k = 2 > 0`, so `lo = 1` |
| 3 | 1 | 2 | 3 | `[1, 2, 3, 4, 6, 5]` | 2 | `p == k`, return `3` |

Step 1 eliminated `6` and `5` without ever ordering them — notice that they are still out of order at the end. Step 2 eliminated `1`. The answer is `3`. Sorting would have given the same answer and also sorted `5` and `6`, which nobody asked for.

## The implementation

```java title="QuickSelect.java"
import java.util.Random;

public class QuickSelect {

    private static final Random RNG = new Random();

    /** The k-th smallest element, k counted from 0. Reorders a. */
    static int select(int[] a, int k) {
        if (k < 0 || k >= a.length) throw new IllegalArgumentException("k out of range");
        int lo = 0, hi = a.length - 1;            // invariant: index k lies in [lo, hi]
        while (lo < hi) {
            int p = partition(a, lo, hi);
            if (p == k) return a[p];              // the pivot landed exactly on k
            if (k < p) hi = p - 1;                // answer is left of the pivot
            else       lo = p + 1;                // answer is right of the pivot
        }
        return a[lo];                             // one element left: it must be k
    }

    /** k-th largest, k counted from 1, as most problems state it. */
    static int kthLargest(int[] a, int k) {
        return select(a, a.length - k);
    }

    /** Lomuto partition around a random pivot; returns the pivot's final index. */
    private static int partition(int[] a, int lo, int hi) {
        swap(a, lo + RNG.nextInt(hi - lo + 1), hi);
        int pivot = a[hi], i = lo;
        for (int j = lo; j < hi; j++) {
            if (a[j] <= pivot) swap(a, i++, j);
        }
        swap(a, i, hi);
        return i;
    }

    private static void swap(int[] a, int i, int j) {
        int t = a[i]; a[i] = a[j]; a[j] = t;
    }

    public static void main(String[] args) {
        System.out.println(select(new int[] {3, 2, 1, 5, 6, 4}, 2));         // 3rd smallest
        System.out.println(kthLargest(new int[] {3, 2, 1, 5, 6, 4}, 2));     // 2nd largest
        System.out.println(kthLargest(new int[] {3, 2, 3, 1, 2, 4, 5, 5, 6}, 4));
        int[] odd = {9, 1, 8, 2, 7};
        System.out.println("median: " + select(odd, odd.length / 2));
        System.out.println(select(new int[] {42}, 0));
    }
}
```

```output
3
5
4
median: 7
42
```

The pivots are random, so the intermediate arrays differ from run to run, but the returned values never do: the k-th smallest element is a fact about the data, not about the algorithm's choices.

A few details are worth slowing down for.

**It is a loop, not recursion.** Quicksort needs recursion because it must come back and sort the other side. Quickselect never comes back, so the recursive call is the last thing it would do, and it can be written as a loop that narrows `[lo, hi]`. Extra space is **O(1)**.

**`k`-th largest is index `n - k`.** Problems usually count "k-th largest" from 1. The largest element is at sorted index `n - 1`, the second largest at `n - 2`, so the k-th largest is at `n - k`. Getting this wrong (using `k - 1` or `n - k - 1`) is the most common bug in this problem. In the third example, the sorted array is `[1, 2, 2, 3, 3, 4, 5, 5, 6]`; the 4th largest is at index `9 - 4 = 5`, which is `4`. Duplicates count as separate positions.

**The median.** For an odd-length array, the median is at index `n / 2`. For an even length it is usually defined as the average of the elements at `n/2 - 1` and `n/2`, which takes two selections (or one selection followed by finding the maximum of the left part).

**The array is reordered.** Quickselect works in place, so the caller's array is modified. If the original order matters, select on a copy. After it returns, the array is partitioned around index `k`: everything before it is at most `a[k]` and everything after it is at least `a[k]`. That side effect is useful, as the top-k section shows.

## Why it takes O(n) time on average

Each partition costs time proportional to the size of the current range. So the total cost is the sum of the range sizes over all iterations.

If every pivot split the range exactly in half, the sizes would be `n, n/2, n/4, …`, and the sum is less than `2n`. That is the core reason quickselect is linear: a geometric series that halves each time adds up to a constant multiple of its first term. Compare quicksort, which partitions *both* halves, so every level costs `n` and there are `log n` levels.

Random pivots do not split exactly in half, but they do not need to. As in the quicksort analysis, call a pivot "good" if it lands in the middle half of the range; that happens with probability 1/2, and a good pivot leaves at most `3/4` of the range. On average it takes two partitions to get a good one, so the expected range size drops by a factor of `3/4` every two iterations. The expected total is at most `2n + 2(3/4)n + 2(3/4)²n + … = 2n / (1 - 3/4) = 8n`. That bound is loose; a careful calculation shows the expected number of comparisons for the median is about `3.4n`. Either way, it is **O(n)**.

```java title="SelectCost.java"
import java.util.Random;

public class SelectCost {

    static long comparisons;
    static final Random RNG = new Random(7);

    static int select(int[] a, int k) {
        int lo = 0, hi = a.length - 1;
        while (lo < hi) {
            swap(a, lo + RNG.nextInt(hi - lo + 1), hi);
            int pivot = a[hi], i = lo;
            for (int j = lo; j < hi; j++) {
                comparisons++;
                if (a[j] <= pivot) swap(a, i++, j);
            }
            swap(a, i, hi);
            if (i == k) return a[i];
            if (k < i) hi = i - 1; else lo = i + 1;
        }
        return a[lo];
    }

    static void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    public static void main(String[] args) {
        for (int n : new int[] {1_000, 100_000, 10_000_000}) {
            int[] a = new int[n];
            for (int i = 0; i < n; i++) a[i] = RNG.nextInt();
            comparisons = 0;
            select(a, n / 2);                                  // the median
            System.out.printf("n=%,d comparisons=%,d (%.2f per element)%n",
                              n, comparisons, (double) comparisons / n);
        }
    }
}
```

```output
n=1,000 comparisons=2,217 (2.22 per element)
n=100,000 comparisons=537,915 (5.38 per element)
n=10,000,000 comparisons=35,505,315 (3.55 per element)
```

The comparisons per element stay small and do not grow with `n` — that is what linear time looks like. Individual runs vary (5.38 per element in the middle run came from a few unlucky early pivots), but they scatter around the expected value of about 3.4. Sorting ten million elements would take roughly `n log₂ n ≈ 230` million comparisons, more than six times as many as this selection.

**Worst case.** If every pivot is the largest or smallest element of its range, each partition removes only one element, and the total is `n + (n-1) + … ≈ n²/2`: **O(n²)**. With a fixed last-element pivot, sorted input triggers this. A random pivot makes it extremely unlikely, but not impossible. Arrays with many equal values also hurt Lomuto partitioning, for the reason explained in [[a3-quick-sort]]; a three-way partition fixes that, and lets quickselect stop as soon as `k` falls inside the block of values equal to the pivot.

### Guaranteed linear time

If an O(n) worst case is required, the **median-of-medians** algorithm chooses a pivot that is provably good: split the array into groups of five, take each group's median, and recursively select the median of those medians. That pivot is guaranteed to have at least about 30% of the elements on each side, which bounds the total work by a geometric series. It is a celebrated result (Blum, Floyd, Pratt, Rivest and Tarjan, 1973) but its constant factor is large, so it is slower than random quickselect in practice. **Introselect** combines the two: run ordinary quickselect, and switch to median-of-medians only if progress is too slow. You should know these exist and why; you will rarely be asked to implement them.

## Top-k: using the partition as the answer

Quickselect does more than return one value. When `select(a, k)` returns, the array is partitioned around index `k`. So after `select(a, n - k)`, the last `k` positions hold the **k largest elements**, in no particular order. If a problem asks for the top `k` items and does not care about their order — *K Closest Points to Origin*, *Top K Frequent Elements* (after counting frequencies) — one quickselect solves it in O(n) average time, followed by copying out the slice.

The standard alternative is a **min-heap of size k**: scan the data, push each element, and pop the smallest whenever the heap grows past `k`. The heap always holds the `k` largest elements seen so far, and its top is the k-th largest.

```java title="TopK.java"
import java.util.Arrays;
import java.util.PriorityQueue;

public class TopK {

    /** The k largest values using a min-heap that never holds more than k elements. */
    static int[] topKHeap(int[] a, int k) {
        PriorityQueue<Integer> heap = new PriorityQueue<>();   // smallest of the top k on top
        for (int x : a) {
            heap.offer(x);
            if (heap.size() > k) heap.poll();                   // evict the smallest
        }
        int[] out = new int[k];
        for (int i = k - 1; i >= 0; i--) out[i] = heap.poll();
        return out;
    }

    public static void main(String[] args) {
        int[] a = {7, 10, 4, 3, 20, 15, 8};
        System.out.println(Arrays.toString(topKHeap(a, 3)));
    }
}
```

```output
[20, 15, 10]
```

Each heap operation costs O(log k), so the heap approach is **O(n log k)** time and **O(k)** space. It does not modify the input, it returns the elements in order, and — crucially — it works on a **stream**, where elements arrive one at a time and you cannot go back. Quickselect needs the whole array in memory and is free to rearrange it. Heaps are covered in [[a7-top-k]] and [[a7-priority-queues]].

## Choosing a method

| Method | Time | Extra space | Modifies input | Works on a stream | Output order |
|---|---|---|---|---|---|
| Sort, then index | O(n log n) | O(log n) to O(n) | Yes (or copy) | No | Fully sorted |
| Quickselect | O(n) average, O(n²) worst | O(1) | Yes | No | Partitioned only |
| Min-heap of size `k` | O(n log k) | O(k) | No | Yes | Sorted on extraction |
| Median of medians | O(n) worst | O(log n) | Yes | No | Partitioned only |

Use quickselect for a one-off order statistic on an array you are allowed to modify, especially when `k` is near the middle (the median), where `log k` is largest. Use a heap when `k` is small compared with `n`, when the data streams, when the input must not change, or when you need the top `k` in order. For repeatedly asking for the median of a growing stream, neither is right — use the two-heap pattern in [[a7-running-median]]. If you will ask many different rank queries of the same data, sort once and answer each in O(1).

## In real systems

**Library functions.** C++ provides `std::nth_element`, which rearranges a range so the element at a given position is the one that would be there if sorted, with smaller-or-equal elements before it — exactly quickselect's postcondition. Implementations typically use introselect. NumPy's `numpy.partition` and `numpy.median` use the same idea. Java has no built-in selection method; you write it, or sort.

**Percentiles in monitoring.** Computing an exact p99 latency over a batch of measurements already in memory is a selection problem. Over continuous streams of millions of requests, monitoring systems usually avoid storing every value and instead keep compact summaries such as histograms or sketches (HDR Histogram, t-digest) that give approximate percentiles in bounded memory. Knowing that exact selection needs all the data in memory explains why.

**Thresholds and sampling.** "Keep the top 10% of candidates by score for re-ranking" in a search pipeline, or "drop the most extreme 1% of values before averaging" in analytics, both need a cut-off value — the k-th order statistic — not a full sort.

## Common mistakes

> [!MISTAKE] Wrong index for the k-th largest
> With 0-based indices in ascending order, the k-th largest (counting from 1) is at index `n - k`. Using `k - 1` returns the k-th smallest; using `n - k - 1` is off by one. Check with `k = 1`: the largest element must map to index `n - 1`.

**No randomisation.** A fixed last-element pivot is quadratic on sorted input, and online judges include such tests. Pick the pivot at random.

**Recursing into both sides.** That is quicksort, and costs O(n log n). Quickselect continues into exactly one side.

**Forgetting that the input is modified.** Callers that expect their array unchanged get a scrambled one. Copy first if needed.

**Mixing partition schemes.** Hoare's partition returns a split point rather than the pivot's final index, so `p == k` does not mean "found". With Hoare, continue into `[lo, p]` if `k <= p`, otherwise `[p + 1, hi]`, until the range has one element.

## Interview perspective

*Kth Largest Element in an Array* is one of the most frequently asked medium problems, and interviewers expect you to discuss more than one solution.

> [!INTERVIEW] Presenting the options
> "Sorting is O(n log n). A min-heap of size k gives O(n log k) and works on streams. Quickselect partitions like quicksort but only continues into the side containing index n - k, so the work is about n + n/2 + n/4 + …, which is O(n) on average. Its worst case is O(n²), so I'd use a random pivot."

Follow-ups to expect:

- **Derive the average case.** The geometric series, with the "good pivot with probability 1/2" refinement if pressed.
- **Can you guarantee O(n)?** Median of medians, or introselect in practice.
- **What if the data is a stream, or does not fit in memory?** A size-k heap, O(n log k) time and O(k) memory.
- **K Closest Points to Origin / Top K Frequent Elements.** Quickselect on distances or on frequencies, then return the slice; mention the heap alternative and bucket sort by frequency for the second ([[a3-counting-sort]]).
- **Wiggle Sort II.** Find the median with quickselect, then arrange elements around it — a harder problem that uses selection as its first step.

## Practice

1. **Kth Largest Element in an Array** with random-pivot quickselect; then add three-way partitioning and test on an array of 100,000 equal values.
2. **Median of an even-length array** as the average of the two middle elements, using one selection plus one linear scan.
3. **K Closest Points to Origin** by quickselect on squared distances; explain why squared distances avoid both floating point and `Math.sqrt`.
4. **Top K Frequent Elements** by counting with a `HashMap` and quickselecting on frequencies.
5. **Trace by hand** the selection of index 4 in `[9, 4, 7, 1, 8, 2, 6]` with last-element pivots, writing down each partition.

The DSA explorer lists the matching problems under this topic; start with *Kth Largest Element in an Array* and *K Closest Points to Origin*.

```quiz
Q: After partitioning, the pivot lands at index 6 and you are looking for index 2. What does quickselect do next?
- [ ] Returns the pivot
- [x] Continues only in the range left of the pivot, because the element for index 2 must be among the elements placed before it
- [ ] Recurses into both sides, as quicksort does
- [ ] Restarts with a different pivot on the whole array
> The partition places exactly the elements that belong before the pivot to its left. Index 2 is left of index 6, so the target is in that part, and everything right of the pivot can be discarded permanently.

Q: Why is quickselect O(n) on average while quicksort is O(n log n)?
- [ ] Quickselect uses a better partition algorithm
- [ ] Quickselect does not compare elements
- [x] Quickselect continues into one side only, so the range sizes form a shrinking geometric series instead of n work at each of log n levels
- [ ] Quickselect only works on small arrays
> Both partition in O(size of range). Quicksort partitions both sides, so every level of recursion still covers about n elements. Quickselect discards one side, so the work is roughly n + n/2 + n/4 + ..., which sums to a constant multiple of n.

Q: An array has 10 elements. Which 0-based index holds the 3rd largest element in sorted (ascending) order?
- [ ] 2
- [ ] 3
- [x] 7
- [ ] 6
> The largest is at index 9 and the 2nd largest at index 8, so the 3rd largest is at index 10 - 3 = 7. Index 2 is the 3rd smallest — the most common mix-up.

Q: Data arrives as a stream of millions of numbers and you must report the 100 largest at the end. Which approach fits best?
- [ ] Quickselect, because it is O(n)
- [x] A min-heap of size 100, because it needs only O(k) memory and processes each element as it arrives
- [ ] Sort everything at the end
- [ ] Binary search
> Quickselect needs every element in memory at once and rearranges them. A size-k min-heap keeps only the current top 100, evicting the smallest each time it overflows, so it handles a stream in O(n log k) time and O(k) space.
```

## Quick revision {#quick-revision}

- Goal: k-th smallest (k-th order statistic) without sorting.
- Partition around a random pivot → pivot at final index `p`; if `p == k` done; `k < p` → `[lo, p-1]`; `k > p` → `[p+1, hi]`.
- Invariant: index `k`'s element is in `a[lo..hi]`; `k` never needs adjusting.
- Iterative loop → O(1) extra space; modifies the input.
- k-th largest (1-based) = index `n - k`; median (odd `n`) = index `n / 2`.
- Average O(n): `n + n/2 + n/4 + … < 2n`; about `3.4n` comparisons for the median with random pivots.
- Worst O(n²) with extreme pivots; random pivot makes it unlikely; three-way partition for duplicates.
- Guaranteed O(n): median of medians (large constants); introselect in practice.
- After `select(a, n - k)`, the last `k` positions hold the top k (unordered).
- Heap of size k: O(n log k), O(k) space, streams, input untouched.
- C++ `std::nth_element`, NumPy `partition`; Java has none built in.

## Key takeaways {#key-takeaways}

- Partitioning places the pivot at its final rank, which tells you which side contains the k-th element; the other side can be discarded.
- Continuing into only one side turns quicksort's O(n log n) into an O(n) average, because the work forms a shrinking geometric series.
- Random pivots protect against the O(n²) worst case; median of medians guarantees linear time at a high constant cost.
- Convert "k-th largest" to index `n - k` and check it with `k = 1`.
- Quickselect is best for a single selection on an in-memory array you may modify; a size-k heap is better for streams, small `k`, or when the input must stay unchanged.
