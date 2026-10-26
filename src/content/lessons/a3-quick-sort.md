---
summary: Quicksort sorts by choosing a pivot, rearranging the array so smaller elements sit left of it and larger ones right, and then sorting each side. You will learn how partitioning works and why it is correct, why the average running time is O(n log n) but the worst case is O(n²), and how random pivots, three-way partitioning and hybrid designs make quicksort fast and safe in practice.
difficulty: intermediate
minutes: 50
objectives:
  - Trace Lomuto and Hoare partitioning and state the invariant each one maintains
  - Implement an in-place quicksort with a random pivot and explain why the pivot is excluded from the recursive calls
  - Derive the O(n log n) average and O(n²) worst-case running times and identify inputs that trigger the worst case
  - Use three-way partitioning to handle many duplicate keys and recognise it in problems such as Sort Colors
  - Compare quicksort with merge sort and explain what introsort and library sorts add
---

## Introduction

[[a3-merge-sort]] showed that dividing a problem in half and combining the results gives an O(n log n) sort. Merge sort divides trivially — it cuts the array in the middle — and does all its work when combining. **Quicksort** turns that around. It does all its work when dividing, and then there is nothing left to combine.

The dividing step is called **partitioning**. Pick one element, the **pivot**. Rearrange the array so that every element smaller than the pivot is on its left and every larger element on its right. Now the pivot is exactly where it belongs in the sorted output — nothing on its left will ever need to move to its right, or the reverse. Sort the left part and the right part independently, by the same method, and the whole array is sorted. No merge needed.

Partitioning happens **in place**, by swapping elements within the array, so quicksort needs no large buffer. It scans memory sequentially, which modern CPUs handle very efficiently. These properties make well-implemented quicksorts some of the fastest general-purpose in-memory sorts, and variants of it sort primitive arrays in Java, C++ and Go.

Quicksort also has a famous weakness: if the pivots are chosen badly, partitioning splits off almost nothing, and the running time degrades to O(n²). Understanding why, and how real implementations prevent it, is as important as the algorithm itself. Finally, partitioning is a tool on its own. It solves "segregate these values" problems directly and powers [[a3-quickselect]], which finds the k-th smallest element without sorting.

## Before you start

- [[a1-recursion]] — quicksort recurses on the two sides of the pivot.
- [[a3-merge-sort]] — not required, but the comparison between the two algorithms is a recurring theme here.
- [[a2-two-pointers]] — both partition schemes move pointers through the array and swap.
- [[a1-big-o]] — for the analysis of average and worst cases.

## The intuition

Imagine lining up a class by height. Pick one student — say, Maya — and ask everyone shorter than her to move to her left and everyone taller to her right. You have not sorted anyone yet, but Maya is now standing in exactly the place she will occupy in the final line: the number of people to her left is the number of people shorter than her.

Now the two groups are independent problems. Nobody in the left group needs to swap with anybody in the right group. Repeat the same trick inside each group, choosing a new "Maya" each time, until every group has one person.

How well this goes depends on who you pick. If Maya is of middling height, each group has about half the class, and the work halves at every step. If you keep picking the shortest person, one group is empty and the other has everyone else — each step only places one person, and you have done a slow version of selection sort. Everything in quicksort's analysis comes back to this: **good pivots split the work evenly; bad pivots barely split it at all.**

## Partitioning: the Lomuto scheme

The simplest partition method to get right is the **Lomuto scheme**. It uses the last element of the range as the pivot and scans the rest left to right with an index `j`, keeping a boundary `i` that separates "small" elements from "large" ones. It maintains this invariant:

> `a[lo..i-1]` are all `<= pivot`, `a[i..j-1]` are all `> pivot`, and `a[j..hi-1]` have not been examined yet.

When the scan reaches an element `a[j] <= pivot`, it belongs in the small group, so swap it to position `i` and grow the small group by one (`i++`). When `a[j] > pivot`, it already sits at the end of the large group, so do nothing. After the scan, swap the pivot from `a[hi]` into position `i` — between the two groups — and return `i`.

Here is the partition of `[7, 2, 9, 4, 3, 8, 5]` with pivot `5`:

| `j` | `a[j]` | `a[j] <= 5`? | Action | `i` after | Array after |
|---|---|---|---|---|---|
| 0 | 7 | no | — | 0 | `[7, 2, 9, 4, 3, 8, 5]` |
| 1 | 2 | yes | swap `a[0]`, `a[1]` | 1 | `[2, 7, 9, 4, 3, 8, 5]` |
| 2 | 9 | no | — | 1 | `[2, 7, 9, 4, 3, 8, 5]` |
| 3 | 4 | yes | swap `a[1]`, `a[3]` | 2 | `[2, 4, 9, 7, 3, 8, 5]` |
| 4 | 3 | yes | swap `a[2]`, `a[4]` | 3 | `[2, 4, 3, 7, 9, 8, 5]` |
| 5 | 8 | no | — | 3 | `[2, 4, 3, 7, 9, 8, 5]` |
| end | | | swap pivot into `a[3]` | | `[2, 4, 3, 5, 9, 8, 7]` |

The result is `[2, 4, 3 | 5 | 9, 8, 7]`. Neither side is sorted, but every element left of index 3 is at most `5` and every element right of it is greater. The pivot is in its final position, and the function returns `3`. The partition made one pass and `hi - lo` comparisons: O(n) for a range of `n` elements.

## The complete algorithm

```java title="QuickSort.java"
import java.util.Arrays;
import java.util.Random;

public class QuickSort {

    private static final Random RNG = new Random();

    static void sort(int[] a) {
        sort(a, 0, a.length - 1);
    }

    /** Sorts a[lo..hi] inclusive. */
    private static void sort(int[] a, int lo, int hi) {
        if (lo >= hi) return;                 // zero or one element
        int p = partition(a, lo, hi);         // a[p] is now in its final place
        sort(a, lo, p - 1);                   // p itself is excluded from both calls
        sort(a, p + 1, hi);
    }

    /** Lomuto partition with a random pivot. Returns the pivot's final index. */
    private static int partition(int[] a, int lo, int hi) {
        swap(a, lo + RNG.nextInt(hi - lo + 1), hi);   // move a random element to the end
        int pivot = a[hi];
        int i = lo;                           // a[lo..i-1] <= pivot
        for (int j = lo; j < hi; j++) {       // a[i..j-1]  >  pivot
            if (a[j] <= pivot) {
                swap(a, i, j);
                i++;
            }
        }
        swap(a, i, hi);                       // pivot goes between the two groups
        return i;
    }

    private static void swap(int[] a, int i, int j) {
        int t = a[i]; a[i] = a[j]; a[j] = t;
    }

    public static void main(String[] args) {
        int[] a = {7, 2, 9, 4, 3, 8, 5};
        sort(a);
        System.out.println(Arrays.toString(a));

        int[] b = {3, 6, 8, 10, 1, 2, 1};
        sort(b);
        System.out.println(Arrays.toString(b));

        int[] c = {};
        sort(c);
        System.out.println(Arrays.toString(c));
    }
}
```

```output
[2, 3, 4, 5, 7, 8, 9]
[1, 1, 2, 3, 6, 8, 10]
[]
```

Three decisions in this code deserve attention.

**The pivot is excluded from both recursive calls.** After partitioning, `a[p]` is final, so the calls cover `lo..p-1` and `p+1..hi`. This is also what guarantees progress: each call removes at least one element (the pivot) from further consideration. Recursing on `lo..p` instead would, in the worst case, call itself on the same range forever.

**The pivot is chosen at random.** Swapping a random element into position `hi` before partitioning costs almost nothing and, as the analysis below shows, makes the slow case vanishingly unlikely for every input. Without it, the code would always pivot on the last element — and already-sorted input would be its worst case.

**The loop runs `j < hi`, not `j <= hi`.** Position `hi` holds the pivot, which must not be compared with itself and swapped into the small group mid-scan.

## Why the running time depends on the pivot

Every level of recursion partitions ranges that together contain at most `n` elements, so each level costs O(n). The total cost is therefore O(n) times the **depth** of the recursion — and the depth depends entirely on how evenly the pivots split.

**Best case.** If every pivot is the median, each range splits into two halves. The recursion tree looks exactly like merge sort's: about `log₂ n` levels, each costing O(n), for **O(n log n)**.

**Worst case.** If every pivot is the smallest (or largest) element in its range, one side is empty and the other has `n - 1` elements. The partitions cost `(n - 1) + (n - 2) + … + 1 = n(n - 1) / 2` comparisons — **O(n²)**. The recursion is also `n` levels deep, which on large inputs overflows the call stack. A last-element pivot produces exactly this on input that is already sorted, or sorted in reverse — some of the most common inputs in real life.

**Average case with random pivots.** You do not need perfect medians, only pivots that are not terrible. Call a pivot "good" if it lands in the middle half of its range (between the 25th and 75th percentile). A random pivot is good with probability 1/2, and after a good pivot both sides have at most `3n/4` elements. Follow any one element down the recursion: on average every second level shrinks its range by a factor of at least 3/4, and a range can shrink by 3/4 only about `log_{4/3} n` times before reaching size 1. So the expected depth is about `2 log_{4/3} n`, which is O(log n), and the expected total work is **O(n log n)**. A more careful count gives about `2 n ln n ≈ 1.39 n log₂ n` comparisons on average.

The key point: with a random pivot, the running time does not depend on the input at all — only on the random choices. No input is bad; there are only unlucky coin flips, and a run that is much slower than average is astronomically unlikely for large `n`.

This program measures the difference by counting comparisons on 10,000 elements:

```java title="PivotCost.java"
import java.util.Random;

public class PivotCost {

    static long comparisons;
    static Random rng = new Random(42);

    /** Lomuto quicksort; if randomPivot is false, the last element is the pivot. */
    static void sort(int[] a, int lo, int hi, boolean randomPivot) {
        while (lo < hi) {
            if (randomPivot) swap(a, lo + rng.nextInt(hi - lo + 1), hi);
            int pivot = a[hi], i = lo;
            for (int j = lo; j < hi; j++) {
                comparisons++;
                if (a[j] <= pivot) swap(a, i++, j);
            }
            swap(a, i, hi);
            // recurse into the smaller side, loop on the larger: stack stays O(log n)
            if (i - lo < hi - i) { sort(a, lo, i - 1, randomPivot); lo = i + 1; }
            else                 { sort(a, i + 1, hi, randomPivot); hi = i - 1; }
        }
    }

    static void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    static long run(int[] a, boolean randomPivot) {
        comparisons = 0;
        sort(a, 0, a.length - 1, randomPivot);
        return comparisons;
    }

    public static void main(String[] args) {
        int n = 10_000;
        int[] sorted = new int[n];
        for (int i = 0; i < n; i++) sorted[i] = i;

        System.out.println("sorted input, last pivot:   " + run(sorted.clone(), false));
        System.out.println("sorted input, random pivot: " + run(sorted.clone(), true));
        System.out.println("all equal,    random pivot: " + run(new int[n], true));
        System.out.println("n log2 n is about           " + Math.round(n * Math.log(n) / Math.log(2)));
    }
}
```

```output
sorted input, last pivot:   49995000
sorted input, random pivot: 147724
all equal,    random pivot: 49995000
n log2 n is about           132877
```

On sorted input, the last-element pivot does exactly `10,000 · 9,999 / 2 = 49,995,000` comparisons — the quadratic worst case. A random pivot on the same input needs about 148,000, close to `n log₂ n`: over 300 times fewer. (The random generator is seeded with 42 so the output is repeatable; other seeds give similar counts.)

The third line is the surprise: an array of **identical** values is quadratic even with a random pivot. With Lomuto's `a[j] <= pivot`, every element equal to the pivot goes into the left group, so each partition splits off only the pivot itself. Randomness cannot help when every candidate pivot is the same value. The fix is three-way partitioning, covered below.

The program also shows a stack-safety technique: it **recurses into the smaller side and loops on the larger side**. The smaller side has at most half the elements, so the recursion depth is at most `log₂ n` even in the worst case. That is why it could run the quadratic cases without a `StackOverflowError`. The time is still quadratic, but the stack is safe.

**Space.** Quicksort is in-place: the only extra memory is the recursion stack — O(log n) expected, and O(log n) guaranteed with the smaller-side-first technique. Plain recursion on both sides can reach O(n) depth in the worst case.

## Partitioning: the Hoare scheme

The original partition method, published by Tony Hoare in 1961, uses two pointers moving towards each other. The left pointer `i` skips elements smaller than the pivot; the right pointer `j` skips elements larger than it. When both stop, `a[i]` belongs on the right and `a[j]` belongs on the left, so swap them and continue. When the pointers cross, the partition is done.

```java title="Hoare.java"
import java.util.Arrays;

public class Hoare {

    static void sort(int[] a, int lo, int hi) {
        if (lo >= hi) return;
        int p = partition(a, lo, hi);
        sort(a, lo, p);          // note: p is included on the left
        sort(a, p + 1, hi);
    }

    /** Hoare partition: afterwards a[lo..p] <= pivot <= a[p+1..hi]. */
    static int partition(int[] a, int lo, int hi) {
        int pivot = a[lo + (hi - lo) / 2];
        int i = lo - 1, j = hi + 1;
        while (true) {
            do { i++; } while (a[i] < pivot);   // stop at an element >= pivot
            do { j--; } while (a[j] > pivot);   // stop at an element <= pivot
            if (i >= j) return j;
            int t = a[i]; a[i] = a[j]; a[j] = t;
        }
    }

    public static void main(String[] args) {
        int[] a = {7, 2, 9, 4, 3, 8, 5};
        int p = partition(a, 0, a.length - 1);
        System.out.println("p=" + p + " " + Arrays.toString(a));
        sort(a, 0, a.length - 1);
        System.out.println(Arrays.toString(a));
        int[] same = {4, 4, 4, 4, 4};
        System.out.println("p=" + partition(same, 0, 4));
    }
}
```

```output
p=2 [3, 2, 4, 9, 7, 8, 5]
[2, 3, 4, 5, 7, 8, 9]
p=2
```

The pivot is the middle element, `4`. The first round stops `i` at `7` and `j` at `3` and swaps them; the second stops `i` at `9` and `j` at `4` and swaps those; then the pointers cross and the function returns `2`. Everything in `a[0..2]` is at most `4` and everything in `a[3..6]` is at least `4`.

Hoare's scheme differs from Lomuto's in ways that matter when you write it:

- **The returned index is a split point, not the pivot's final position.** Elements equal to the pivot may be on both sides, and the pivot itself may end up anywhere. So the recursion is on `lo..p` and `p+1..hi` — `p` is *included* on the left. Using Lomuto's `p - 1` here would leave elements unsorted.
- **The pivot must not be the last element** when recursing this way, or a two-element range can split into "everything" and "nothing" and recurse forever. Choosing the middle element (rounded down), as above, is safe.
- **It handles duplicates well.** Both pointers stop on elements *equal* to the pivot and swap them, so an array of identical values splits in the middle — the last line of output shows `p=2` for five equal elements. Lomuto would split off just one element.
- **It does fewer swaps** — about three times fewer than Lomuto on average — because it only swaps pairs that are both on the wrong side.

Lomuto is easier to explain and is what most interview answers use. Hoare is what you would choose for performance. Either is acceptable if you can state its invariant.

## Many duplicates: three-way partitioning

When the input has many equal keys — ratings from 1 to 5, status codes, a few categories — two-way partitioning wastes effort repeatedly re-sorting runs of equal values, and with Lomuto it becomes quadratic. **Three-way partitioning** splits the range into three groups: less than, equal to, and greater than the pivot. The equal group is final and is excluded from recursion entirely.

The method, known as the **Dutch national flag** algorithm (after Edsger Dijkstra's three-colour formulation), keeps three boundaries:

> `a[lo..lt-1] < pivot`, `a[lt..i-1] == pivot`, `a[i..gt]` not yet examined, `a[gt+1..hi] > pivot`.

```java title="ThreeWay.java"
import java.util.Arrays;
import java.util.Random;

public class ThreeWay {

    static final Random RNG = new Random();

    /** Quicksort with three-way (Dutch national flag) partitioning. */
    static void sort(int[] a, int lo, int hi) {
        if (lo >= hi) return;
        int pivot = a[lo + RNG.nextInt(hi - lo + 1)];
        int lt = lo, i = lo, gt = hi;
        // a[lo..lt-1] < pivot, a[lt..i-1] == pivot, a[i..gt] unseen, a[gt+1..hi] > pivot
        while (i <= gt) {
            if (a[i] < pivot)      swap(a, lt++, i++);
            else if (a[i] > pivot) swap(a, i, gt--);   // do not advance i: a[i] is new
            else                   i++;
        }
        sort(a, lo, lt - 1);       // the whole block of pivots is excluded
        sort(a, gt + 1, hi);
    }

    static void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    public static void main(String[] args) {
        int[] colors = {2, 0, 2, 1, 1, 0, 1, 2, 0};
        sort(colors, 0, colors.length - 1);
        System.out.println(Arrays.toString(colors));

        int[] a = {5, 1, 5, 3, 5, 5, 2, 5};
        sort(a, 0, a.length - 1);
        System.out.println(Arrays.toString(a));
    }
}
```

```output
[0, 0, 0, 1, 1, 1, 2, 2, 2]
[1, 2, 3, 5, 5, 5, 5, 5]
```

The one subtle line is the "greater than" case. The element swapped in from `a[gt]` has not been examined yet, so `i` must stay where it is and look at it on the next iteration. In the "less than" case, the element swapped in from `a[lt]` is known to equal the pivot (it came from the equal group), so `i` can advance.

On an array of identical values, a single pass puts everything in the equal group and both recursive calls are empty: **O(n)** instead of O(n²). When there are only `k` distinct values, the recursion depth is at most about `k`. The interview problem *Sort Colors* — sort an array of 0s, 1s and 2s in one pass — is exactly one three-way partition with pivot `1`.

## Stability

Quicksort is **not stable**: equal elements can come out in a different order from the one they went in. Partitioning swaps elements across long distances. In the Lomuto trace above, the `7` that started at index 0 ends at index 6, behind the `9` and `8` that started after it. The same kind of jump can carry one of two equal keys past the other. When stability matters — sorting records by one key after another — use a stable sort such as [[a3-merge-sort]], or make every key unique by adding the original index as a final tie-breaker.

## Introsort and library sorts

Production sorts keep quicksort's speed and remove its risks by combining it with other algorithms:

- **Small ranges use insertion sort.** Below a cutoff of a few dozen elements, insertion sort's low overhead beats more recursion.
- **Better pivots.** Instead of one random element, take the median of three (first, middle, last), or of more samples on large ranges. This makes balanced splits more likely and adds little cost.
- **A depth limit.** **Introsort** ("introspective sort") counts recursion depth and, if it passes about `2 log₂ n`, switches that range to heap sort, which is O(n log n) in the worst case. The result is quicksort's speed on typical input with a guaranteed O(n log n) worst case.

These ideas appear across standard libraries. C++'s `std::sort` is required to make O(n log n) comparisons and is typically implemented as introsort. Go's `sort` package has used **pattern-defeating quicksort** (pdqsort), a refined introsort, since Go 1.19. Java's `Arrays.sort` for primitive arrays uses a **dual-pivot quicksort** (since Java 7), which partitions around two pivots into three groups at once, together with fallbacks to other algorithms for small or unfavourable inputs. For object arrays, Java uses stable Timsort instead, because quicksort's instability would be visible.

## In real systems

**Sorting in-memory arrays of numbers.** Whenever Java code calls `Arrays.sort` on an `int[]`, `long[]` or `double[]`, or C++ code calls `std::sort`, a quicksort-based hybrid runs. It is chosen because it is in-place and cache-friendly, and because stability is irrelevant for indistinguishable primitive values.

**Partitioning without sorting.** Many systems need only the partition step. A query engine evaluating `WHERE price < 100` on an in-memory column can partition rows into matches and non-matches in place. Selecting the top 1% of results by score is a partition around the 99th-percentile value, found with [[a3-quickselect]] — C++ exposes this as `std::nth_element`, and NumPy as `numpy.partition`.

**Denial-of-service concerns.** A deterministic pivot rule has a known worst-case input. If a server sorts user-supplied data with such a sort, an attacker can send exactly that input and make each request quadratic. Randomised pivots and introsort's depth limit are defences against this, not just performance tweaks.

## Trade-offs and alternatives

| | Quicksort (randomised) | Merge sort | Heap sort |
|---|---|---|---|
| Average time | O(n log n), small constants | O(n log n) | O(n log n), larger constants |
| Worst time | O(n²), very unlikely | O(n log n) | O(n log n) |
| Extra space | O(log n) stack | O(n) buffer for arrays | O(1) |
| Stable | No | Yes | No |
| Memory access | Sequential scans, cache-friendly | Sequential, but copies to a buffer | Jumps around the array |
| Best for | In-memory arrays of primitives | Stability, linked lists, external data | Strict memory and worst-case limits |

Quicksort is the right default when you are sorting an in-memory array, do not need stability, and want the best average speed. Choose merge sort when stability or a hard worst-case bound matters, or for linked lists and data on disk. Choose heap sort when you need a worst-case bound with O(1) extra memory. In application code, call the library sort and rely on its hybrid design.

## Common mistakes

> [!MISTAKE] Including the pivot in a recursive call
> With Lomuto, recursing on `lo..p` or `p..hi` keeps the pivot in a range that can be partitioned into the same split again, giving infinite recursion when the pivot is the largest or smallest element. The pivot is final: recurse on `lo..p-1` and `p+1..hi`. With Hoare, the opposite is true — recurse on `lo..p` and `p+1..hi`.

**Fixed first or last pivot.** Correct, but quadratic on sorted and reverse-sorted input, which are common in practice and in test cases designed to time out such solutions. Use a random or median-of-three pivot.

**Claiming an O(n log n) worst case.** Plain quicksort's worst case is O(n²) even with random pivots — the random pivot makes it unlikely, not impossible. Only hybrids such as introsort guarantee O(n log n).

**Ignoring duplicates.** Lomuto with many equal keys is quadratic regardless of pivot choice. Use three-way partitioning or Hoare's scheme.

**Off-by-one in the Lomuto loop.** Looping to `j <= hi` compares the pivot with itself and moves it into the small group early, so the final swap puts the wrong element at `p`.

**Stack overflow on bad splits.** Deep recursion on unlucky or adversarial input can throw `StackOverflowError`. Recurse into the smaller side and loop on the larger one to cap the depth at `log₂ n`.

## Interview perspective

Interviewers ask about quicksort to test partitioning (which underlies many array problems), probabilistic reasoning about the average case, and judgement about which sort to use.

> [!INTERVIEW] Comparing quicksort and merge sort
> "Both are O(n log n) on average. Quicksort works in place with only a log n stack and scans memory sequentially, so it's usually faster for arrays, but its worst case is O(n²) and it isn't stable — I'd use a random pivot, or a library introsort. Merge sort guarantees O(n log n) and is stable, but needs O(n) extra space for arrays. For linked lists or when I need stability, I'd pick merge sort."

Questions to prepare:

- **Implement quicksort** with Lomuto partition and a random pivot; state the partition invariant.
- **What is the worst case, and which inputs cause it?** O(n²) when pivots are always extreme — for example sorted input with a last-element pivot, or all-equal input with two-way Lomuto partitioning.
- **Why does a random pivot help?** It makes the expected running time O(n log n) for every input, because a pivot in the middle half (probability 1/2) shrinks both sides to at most 3n/4.
- **Sort Colors.** One three-way partition with pivot 1, in one pass and O(1) space.
- **Kth Largest Element in an Array.** Partition, then recurse only into the side containing the target index — see [[a3-quickselect]].
- **Is quicksort stable? Can it be made stable?** No; it can be made stable only by adding the original index as a tie-breaker or by partitioning into extra buffers, which gives up the in-place advantage.

## Practice

1. **Trace both schemes.** Partition `[4, 9, 1, 7, 4, 2, 8]` by hand with Lomuto (last element as pivot) and with Hoare (middle element), and write down the array and returned index for each.
2. **Sort Colors** in one pass with a three-way partition.
3. **Move zeroes** to the end of an array while keeping the order of non-zero elements. Explain why a single Lomuto-style pass with pivot "non-zero" keeps the order of the non-zero elements, even though quicksort is not stable.
4. **Measure.** Extend `PivotCost` to count comparisons for reverse-sorted input and for an array with only three distinct values, with Lomuto and with three-way partitioning.
5. **Iterative quicksort.** Replace recursion with an explicit stack of `(lo, hi)` ranges, pushing the larger range first so the smaller is processed next.

The DSA explorer lists the matching problems under this topic; start with *Sort an Array*, *Sort Colors* and *Kth Largest Element in an Array*.

```quiz
Q: After a Lomuto partition returns index `p`, what is guaranteed?
- [ ] Both halves are sorted
- [x] `a[p]` is the pivot in its final sorted position, everything before it is `<=` the pivot and everything after it is `>` the pivot
- [ ] `p` is the middle index of the range
- [ ] The array is sorted from `lo` to `p`
> Partitioning only separates small from large; neither side is sorted yet. But because exactly the elements <= pivot are to its left, the pivot's index equals its rank, so it never needs to move again. Its position depends on the pivot value, not on the range's middle.

Q: Quicksort with the last element as pivot is run on an array that is already sorted. What happens?
- [ ] It finishes in O(n), because nothing needs to move
- [ ] It runs in O(n log n) as usual
- [x] Every pivot is the maximum of its range, so each partition splits off one element and the total work is O(n²)
- [ ] It throws an exception
> On sorted input the last element is always the largest, so the right side is empty and the left side has n - 1 elements. The partitions cost (n-1) + (n-2) + ... + 1 = n(n-1)/2 comparisons, and the recursion is n levels deep.

Q: Why does an array of 10,000 identical values make Lomuto quicksort quadratic even with a random pivot?
- [x] Every element equals the pivot, so `a[j] <= pivot` sends all of them to the left and each partition splits off only the pivot
- [ ] Random pivots are not truly random
- [ ] Identical values cannot be compared
- [ ] It does not; random pivots always give O(n log n)
> Randomness only helps if different pivot choices lead to different splits. With all values equal, every choice produces the same lopsided split. Three-way partitioning puts all equal elements in a middle group that is never recursed into, giving O(n) for this input.

Q: In Hoare's partition, why does the recursion use `lo..p` and `p+1..hi` rather than `lo..p-1` and `p+1..hi`?
- [ ] Because Hoare's partition sorts the left side
- [x] Because Hoare returns a split point, not the pivot's final position, so `a[p]` may still need to move
- [ ] Because `p` is always `lo`
- [ ] It is a matter of style; both are correct
> Hoare guarantees a[lo..p] <= pivot <= a[p+1..hi], but the pivot value itself can end up anywhere on either side. Excluding index p would leave that element out of both recursive sorts, and the array could end up unsorted.
```

## Quick revision {#quick-revision}

- Pick a pivot → partition (smaller left, larger right) → recurse on both sides. No merge step.
- Lomuto: pivot `a[hi]`; invariant `a[lo..i-1] <= pivot < a[i..j-1]`; swap pivot to `i`; recurse `lo..p-1`, `p+1..hi`.
- Hoare: middle pivot, pointers from both ends, swap pairs; returns a split point; recurse `lo..p`, `p+1..hi`; fewer swaps; good with duplicates.
- Partition is O(n). Total = O(n) × recursion depth.
- Best/average O(n log n) (expected ~1.39 n log₂ n comparisons with random pivots); worst O(n²) with extreme pivots.
- Worst-case triggers: sorted input + fixed end pivot; all-equal input + Lomuto.
- Random pivot: expected O(n log n) for every input.
- Three-way (Dutch flag): `< | == | >`; equal block excluded; O(n) on all-equal input; solves Sort Colors.
- Space O(log n) expected; recurse into the smaller side to guarantee O(log n).
- Not stable. Introsort = quicksort + insertion sort for small ranges + heap sort past a depth limit.
- Java `Arrays.sort(int[])`: dual-pivot quicksort; objects: Timsort (stable).

## Key takeaways {#key-takeaways}

- Quicksort does its work in the partition step, which places the pivot in its final position and splits the rest into two independent problems.
- Its speed depends on the depth of recursion, which depends on how evenly pivots split the data.
- Random pivots make the expected time O(n log n) for every input; fixed pivots have a known quadratic input, and sorted data is one of them.
- Duplicate-heavy data needs three-way partitioning (or Hoare's scheme) to avoid quadratic behaviour.
- In-place partitioning and sequential memory access make quicksort fast in practice, at the cost of stability and a worst-case guarantee — which library hybrids such as introsort restore.
- The partition step is a tool in its own right, behind quickselect, Sort Colors and many "segregate the array" problems.
