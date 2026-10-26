---
summary: Comparison sorts cannot beat O(n log n), but when keys are small integers or spread evenly over a known range, you can sort without comparing at all. You will learn counting sort, its stable prefix-sum form and its use inside radix sort, and bucket sort for evenly distributed values — including when each one is fast and when it breaks down.
difficulty: intermediate
minutes: 45
objectives:
  - Explain why every comparison sort needs about n log n comparisons, and what non-comparison sorts do differently
  - Implement counting sort, both the simple rewrite form and the stable prefix-sum form, and handle negative keys
  - Decide when counting sort is worthwhile by comparing the key range k with n, and use radix sort when k is too large
  - Implement bucket sort for values in [0, 1), derive its expected O(n) time and identify inputs that make it O(n²)
  - Recognise frequency-bucket and range-bucket patterns such as Top K Frequent Elements in interview problems
---

## Introduction

[[a3-merge-sort]] and [[a3-quick-sort]] sort anything that can be compared, in O(n log n) time. A natural question is whether a cleverer comparison sort could do better — O(n log log n), say, or O(n). The answer is no: there is a proof that **every** sort that learns about the data only by comparing pairs of elements needs about `n log₂ n` comparisons in the worst case.

But that proof has a loophole. It assumes comparing is the only thing you can do. If the keys are small integers — exam scores from 0 to 100, ages, ratings from 1 to 5, characters in a string — you can use a key directly as an array index. Instead of asking "is this score bigger than that one?", you put each score into the slot numbered by its value, then read the slots in order. No comparisons at all, and the time is **O(n + k)**, where `k` is the number of possible key values.

That is **counting sort**. Its relatives build on the same idea: **radix sort** sorts large integers by applying counting sort to one digit at a time, and **bucket sort** spreads real numbers into evenly sized ranges, sorts each small range, and concatenates them. These algorithms are not general-purpose replacements for the library sort; each wins only under specific conditions on the keys. Knowing those conditions — and recognising the "use the value as an index" trick in problems that do not mention sorting at all — is what this lesson is about.

## Before you start

- [[a1-big-o]] — for comparing O(n + k) with O(n log n).
- [[a2-frequency-counting]] — counting sort begins with a frequency array, the same tool used for anagrams and character counts.
- [[a2-prefix-suffix]] — the stable version of counting sort turns counts into positions with a prefix sum.
- [[a3-merge-sort]] — for what **stability** means.

## Why comparison sorts cannot beat n log n

Picture any comparison sort running on `n` distinct elements. Every comparison has two outcomes, and the algorithm's next step depends on which outcome it got. So its behaviour is a binary tree of decisions — a **decision tree** — and each possible input order leads down some path to a leaf, where the algorithm has decided what the sorted order is.

There are `n!` possible orderings of `n` distinct elements, and each must reach a different leaf (if two different orderings reached the same leaf, the algorithm would rearrange them the same way and get one of them wrong). A binary tree with at least `n!` leaves has height at least `log₂(n!)`. Using Stirling's approximation, `log₂(n!) ≈ n log₂ n − 1.44 n`. The height is the worst-case number of comparisons, so every comparison sort needs **Ω(n log n)** comparisons in the worst case. Merge sort and heap sort meet this bound, so they are optimal among comparison sorts.

The argument depends on each step gaining at most one bit of information. Counting sort escapes it by doing something a comparison cannot: using a key as a memory address, which in one step chooses among `k` places rather than two.

## The intuition

A teacher has 200 exam papers scored from 0 to 10 and wants them in order. Comparing papers pairwise is silly. Instead, she lays out eleven labelled piles, 0 through 10, walks through the stack once, and drops each paper on the pile matching its score. Then she picks up the piles in order, 0 first. Two passes, no comparisons.

If she only needs the scores (not the papers), she does not even need piles — tally marks per score are enough: "three 0s, seven 1s, …". Then she writes out three 0s, seven 1s, and so on. That is the simplest form of counting sort.

If the scores ran from 0 to 1,000,000, she would need a million piles for 200 papers — almost all of them empty. That is the catch: counting sort's cost depends on the **range** of the keys, not just on how many there are.

## Counting sort: the simple form

For plain integers, counting sort has two steps. First count how many times each value occurs. Then overwrite the array by writing each value as many times as it was counted, from the smallest value to the largest.

```java title="CountingSort.java"
import java.util.Arrays;

public class CountingSort {

    /** Sorts integers in place. Time and space O(n + k), k = max - min + 1. */
    static void sort(int[] a) {
        if (a.length == 0) return;
        int min = a[0], max = a[0];
        for (int v : a) { min = Math.min(min, v); max = Math.max(max, v); }

        int[] count = new int[max - min + 1];   // count[v - min] = copies of v
        for (int v : a) count[v - min]++;

        int i = 0;
        for (int v = 0; v < count.length; v++) {
            for (int c = 0; c < count[v]; c++) a[i++] = v + min;   // rewrite in order
        }
    }

    public static void main(String[] args) {
        int[] scores = {4, 1, 3, 4, 0, 1, 4};
        sort(scores);
        System.out.println(Arrays.toString(scores));

        int[] temps = {3, -2, 0, -2, 5, 1};     // negatives work via the min offset
        sort(temps);
        System.out.println(Arrays.toString(temps));
    }
}
```

```output
[0, 1, 1, 3, 4, 4, 4]
[-2, -2, 0, 1, 3, 5]
```

For `scores`, the count array is `[1, 2, 0, 1, 3]`: one 0, two 1s, no 2s, one 3, three 4s. Writing those out gives the sorted array.

**Negative numbers and offsets.** Array indices cannot be negative, so the code shifts every value by the minimum: value `v` is counted at index `v - min`. For `temps`, `min = -2`, so `-2` maps to index 0 and `5` to index 7. The count array has `max - min + 1` slots — forgetting the `+ 1` drops the largest value. If `max - min` itself could overflow `int` (values near both ends of the `int` range), the range is far too large for counting sort anyway.

**Cost.** Finding the minimum and maximum is O(n). Counting is O(n). Writing out visits all `k = max - min + 1` slots and writes `n` values, so it is O(n + k). Total time **O(n + k)**, extra space **O(k)**. When `k` is O(n) — say, 1,000,000 values in the range 0 to 1,000,000 — the sort is linear.

## Counting sort: the stable form

The simple form recreates values from counts. That works for integers, but not for **records**: if you are sorting support tickets by priority, you need to move the tickets themselves, not write out "priority 2" twice. And you usually want the sort to be **stable**, so tickets with equal priority keep their original order.

The stable form computes, for each key, **where its group starts** in the output, then copies each record to the next free slot of its group. The starting positions come from a prefix sum of the counts: the group for key `v` starts after all records with smaller keys.

```java title="StableCountingSort.java"
import java.util.Arrays;

public class StableCountingSort {

    record Ticket(String id, int priority) {}   // priority is in 0..3

    static Ticket[] sortByPriority(Ticket[] in, int k) {
        int[] count = new int[k];
        for (Ticket t : in) count[t.priority()]++;
        System.out.println("counts: " + Arrays.toString(count));

        // turn counts into starting positions: start[v] = number of keys smaller than v
        int[] start = new int[k];
        for (int v = 1; v < k; v++) start[v] = start[v - 1] + count[v - 1];
        System.out.println("starts: " + Arrays.toString(start));

        Ticket[] out = new Ticket[in.length];
        for (Ticket t : in) {                    // left to right keeps ties in input order
            out[start[t.priority()]++] = t;
        }
        return out;
    }

    public static void main(String[] args) {
        Ticket[] tickets = {
            new Ticket("T1", 2), new Ticket("T2", 0), new Ticket("T3", 2),
            new Ticket("T4", 1), new Ticket("T5", 0), new Ticket("T6", 3)};
        for (Ticket t : sortByPriority(tickets, 4)) {
            System.out.println(t.priority() + " " + t.id());
        }
    }
}
```

```output
counts: [2, 1, 2, 1]
starts: [0, 2, 3, 5]
0 T2
0 T5
1 T4
2 T1
2 T3
3 T6
```

Here is the placement pass, one ticket at a time. Each ticket goes to `start[priority]`, which is then incremented so the next ticket with that priority lands just after it:

| Ticket | Priority | Written to | `start` after |
|---|---|---|---|
| T1 | 2 | `out[3]` | `[0, 2, 4, 5]` |
| T2 | 0 | `out[0]` | `[1, 2, 4, 5]` |
| T3 | 2 | `out[4]` | `[1, 2, 5, 5]` |
| T4 | 1 | `out[2]` | `[1, 3, 5, 5]` |
| T5 | 0 | `out[1]` | `[2, 3, 5, 5]` |
| T6 | 3 | `out[5]` | `[2, 3, 5, 6]` |

T1 and T3 both have priority 2. T1 was seen first, so it took slot 3 and T3 took slot 4: their input order survives. The same holds for T2 and T5. That is why the sort is **stable** — the placement pass walks the input from left to right and fills each group from its start.

> [!NOTE] Two equivalent ways to write the placement pass
> Many textbooks use an *inclusive* prefix sum instead: after `count[v] += count[v - 1]`, `count[v]` is the number of keys `<= v`, which is one past the **end** of group `v`. They then walk the input from **right to left** and place each record at `--count[key]`, filling each group from its end. Both versions are stable. The bug is mixing them — end positions with a left-to-right walk reverses the order of ties.

The stable form costs O(n + k) time and O(n + k) extra space: the count array plus an output array of size `n`. It is not in-place.

## When counting sort is the wrong tool

The whole analysis hinges on `k`, the size of the key range:

| Situation | `n` | `k` | Counting sort cost | Verdict |
|---|---|---|---|---|
| Characters of a string (ASCII) | 10⁶ | 128 | ~10⁶ | Excellent |
| Ages of customers | 10⁶ | ~130 | ~10⁶ | Excellent |
| Scores 0–10⁶ | 10⁶ | 10⁶ | ~2 × 10⁶ | Good |
| 100 user IDs up to 10⁹ | 100 | 10⁹ | ~10⁹ steps, 4 GB of counts | Terrible |
| Arbitrary `long` or `double` keys | any | astronomical | impossible | Not applicable |

When `k` is much larger than `n`, most of the count array is empty, and allocating and scanning it dominates everything. In that case use a comparison sort, **compress** the keys first (sort the distinct values, then replace each value by its rank — which needs a sort anyway), or use radix sort, which handles large integer keys by splitting them into small digits. Counting sort also needs keys that can be turned into small integer indices: it cannot sort arbitrary strings or floating-point values directly.

## Radix sort: counting sort one digit at a time

**Radix sort** sorts integers with large values by running a stable counting sort on each digit, starting with the least significant. Each pass has only 10 possible keys (or 256, if you use bytes as digits), so `k` stays tiny no matter how large the numbers are.

```java title="RadixSort.java"
import java.util.Arrays;

public class RadixSort {

    /** LSD radix sort for non-negative ints, one stable counting pass per decimal digit. */
    static void sort(int[] a) {
        int max = Arrays.stream(a).max().orElse(0);
        int[] out = new int[a.length];
        for (long exp = 1; max / exp > 0; exp *= 10) {
            int[] count = new int[10];
            for (int v : a) count[(int) (v / exp % 10)]++;

            int[] start = new int[10];                         // exclusive prefix sum
            for (int d = 1; d < 10; d++) start[d] = start[d - 1] + count[d - 1];

            for (int v : a) out[start[(int) (v / exp % 10)]++] = v;   // stable placement
            System.arraycopy(out, 0, a, 0, a.length);
            System.out.println("by digit " + exp + ": " + Arrays.toString(a));
        }
    }

    public static void main(String[] args) {
        sort(new int[] {170, 45, 75, 90, 802, 24, 2, 66});
    }
}
```

```output
by digit 1: [170, 90, 802, 2, 24, 45, 75, 66]
by digit 10: [802, 2, 24, 45, 66, 170, 75, 90]
by digit 100: [2, 24, 45, 66, 75, 90, 170, 802]
```

After the first pass the numbers are ordered by their last digit (`170` and `90` end in 0, `802` and `2` in 2, and so on). After the second they are ordered by their last two digits, and after the third by all three. Why does sorting by the *least* important digit first work? Because each pass is stable. When the hundreds pass sees `24` and `45` (both with hundreds digit 0), it keeps them in the order the previous passes left them, which was already correct for the lower digits. **Stability is what makes radix sort correct**: an unstable digit sort would scramble the work of earlier passes.

With `d` digits in base `b`, radix sort runs `d` passes of O(n + b), so it is **O(d · (n + b))**. For 32-bit integers in base 256, that is 4 passes of O(n + 256) — linear in `n`, with no dependence on the size of the values beyond the fixed number of digits. Negative numbers need extra handling (for example, flipping the sign bit so they sort before positives). `exp` is a `long` so that `exp *= 10` cannot overflow when `max` has ten digits.

## Bucket sort {#a3-bucket-sort}

**Bucket sort** sorts values that are spread roughly evenly over a known range by dividing the range into equal-width **buckets**, dropping each value into the bucket that covers it, sorting each bucket on its own, and concatenating the buckets in order. If values in `[0, 1)` are split into 10 buckets, bucket 0 holds `[0, 0.1)`, bucket 1 holds `[0.1, 0.2)`, and so on. Because every value in bucket 3 is smaller than every value in bucket 4, sorting inside each bucket and reading the buckets left to right gives the fully sorted result.

The idea extends counting sort to keys that are not small integers. Counting sort gives every possible key its own slot; bucket sort gives every *range* of keys a slot, and accepts that several values may share a slot and need sorting there. When the values are evenly spread and there are about as many buckets as values, each bucket holds only one or two values, and the whole sort takes linear time on average.

### Sorting values in [0, 1)

With `n` values and `n` buckets, a value `v` in `[0, 1)` belongs in bucket `⌊v · n⌋`:

```java title="BucketSort.java"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class BucketSort {

    /** Sorts values in [0, 1). Expected O(n) when the values are spread evenly. */
    static void sort(double[] a) {
        int n = a.length;
        List<List<Double>> buckets = new ArrayList<>(n);
        for (int i = 0; i < n; i++) buckets.add(new ArrayList<>());

        for (double v : a) {
            int b = Math.min((int) (v * n), n - 1);   // clamp guards against v == 1.0
            buckets.get(b).add(v);
        }

        int i = 0;
        for (List<Double> bucket : buckets) {
            Collections.sort(bucket);                 // buckets are tiny on average
            for (double v : bucket) a[i++] = v;
        }
    }

    public static void main(String[] args) {
        double[] a = {0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68};
        sort(a);
        System.out.println(Arrays.toString(a));
    }
}
```

```output
[0.12, 0.17, 0.21, 0.23, 0.26, 0.39, 0.68, 0.72, 0.78, 0.94]
```

With ten values and ten buckets, the scatter step produces:

| Bucket | Range | Contents after scatter | After sorting the bucket |
|---|---|---|---|
| 1 | `[0.1, 0.2)` | `0.17, 0.12` | `0.12, 0.17` |
| 2 | `[0.2, 0.3)` | `0.26, 0.21, 0.23` | `0.21, 0.23, 0.26` |
| 3 | `[0.3, 0.4)` | `0.39` | `0.39` |
| 6 | `[0.6, 0.7)` | `0.68` | `0.68` |
| 7 | `[0.7, 0.8)` | `0.78, 0.72` | `0.72, 0.78` |
| 9 | `[0.9, 1.0)` | `0.94` | `0.94` |

Buckets 0, 4, 5 and 8 are empty. Reading the buckets in order gives the sorted array. The largest bucket has three values, so the per-bucket sorting is trivial.

The `Math.min(..., n - 1)` clamp protects against a value of exactly `1.0` (which some data sources include despite promising `[0, 1)`), since `⌊1.0 · n⌋ = n` would index past the last bucket. For a general range `[lo, hi]`, the bucket index is `(int) ((v - lo) / (hi - lo) * n)`, clamped the same way. For integer keys, compute that index with `long` arithmetic, because `(v - min) * n` can overflow `int`.

### Why it is O(n) on average — and when it is not

Scattering and concatenating are O(n + m) for `m` buckets. The uncertain part is sorting the buckets. With insertion sort (the classic choice, since buckets are small), sorting a bucket of size `nᵢ` costs O(nᵢ²), so the total cost is the sum of `nᵢ²` over all buckets.

If the `n` values are independent and uniformly distributed over the range, and `m = n`, each value lands in a given bucket with probability `1/n`. The expected value of `nᵢ²` then works out to `2 − 1/n` — less than 2 — for every bucket. Summed over `n` buckets, the expected total is less than `2n`. So bucket sort runs in **O(n) expected time** on uniform data.

The guarantee rests entirely on the distribution. If the values cluster — say, every value lies between 0.50 and 0.51 — they all land in one bucket, and the sort degenerates to sorting that bucket: O(n²) with insertion sort, or O(n log n) if the inner sort is a comparison sort such as `Collections.sort` (as in the code above). Bucket sort is therefore a tool for data whose distribution you know, not for arbitrary input. **Space** is O(n + m) for the buckets.

Bucket sort is **stable** if the values are appended to buckets in input order and each bucket is sorted with a stable sort. `Collections.sort` is stable, so the example is.

### Buckets indexed by count: Top K Frequent Elements

In interviews, the bucket idea appears most often in a form that does not look like sorting. *Top K Frequent Elements* asks for the `k` values that occur most often. Counting frequencies with a `HashMap` is O(n). Sorting the distinct values by frequency would then cost O(n log n). But a frequency can only be between 1 and `n`, a small integer range — so make an array of `n + 1` buckets, put each value in the bucket for its frequency, and read buckets from the highest frequency down.

```java title="TopKFrequent.java"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TopKFrequent {

    static int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int x : nums) freq.merge(x, 1, Integer::sum);

        // bucket[f] holds the values that occur exactly f times; f is at most n
        List<List<Integer>> bucket = new ArrayList<>();
        for (int f = 0; f <= nums.length; f++) bucket.add(new ArrayList<>());
        freq.forEach((value, f) -> bucket.get(f).add(value));

        int[] out = new int[k];
        int i = 0;
        for (int f = nums.length; f > 0 && i < k; f--) {      // highest frequency first
            for (int value : bucket.get(f)) {
                if (i == k) break;
                out[i++] = value;
            }
        }
        return out;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(topKFrequent(new int[] {1, 1, 1, 2, 2, 3}, 2)));
        System.out.println(Arrays.toString(topKFrequent(new int[] {4, 4, 7, 7, 7, 9}, 1)));
    }
}
```

```output
[1, 2]
[7]
```

This is counting sort applied to frequencies, and it runs in O(n) time and space. The same "the key is a small integer, so use it as an index" observation solves *Sort Characters By Frequency*, the H-index problem (citations above `n` can be capped at `n`), and *Maximum Gap*, where `n - 1` buckets and the pigeonhole principle find the largest gap between sorted neighbours in O(n).

### Bucket sort compared with its relatives

| | Counting sort | Radix sort | Bucket sort |
|---|---|---|---|
| Keys | Small integers in a known range | Integers (or fixed-length strings) of any size | Real numbers in a known range |
| Slots | One per possible key value | One per digit value, per pass | One per sub-range |
| Time | O(n + k) always | O(d · (n + b)) always | O(n) expected if uniform; worse if clustered |
| Needs | `k` not much larger than `n` | Fixed number of digits | Roughly even distribution |
| Stable | Yes (prefix-sum form) | Yes (requires stable passes) | Yes, with stable bucket sorts |

## In real systems

**Sorting characters, bytes and small codes.** Text-processing code that sorts or groups characters (building anagram keys, frequency tables, histograms) counts into a fixed array of 26, 128 or 256 slots rather than calling a general sort. Image processing does the same with pixel intensities from 0 to 255, for example in histogram equalisation.

**Radix sort for large numeric workloads.** Radix sort is a strong choice for sorting very large arrays of fixed-width keys — 32-bit or 64-bit integers, or floating-point values mapped to integers — because its passes are sequential and branch-free. GPU sorting libraries commonly use radix sort for this reason, and suffix-array construction algorithms rely on radix-style passes over characters.

**Distributed range partitioning.** Large distributed sorts (for example in Hadoop's TeraSort benchmark, or Spark's `sortByKey`) first sample the data to choose split points, then send each record to the machine responsible for its key range, and finally sort each machine's range locally. That is bucket sort at cluster scale, and the sampling step exists precisely to make the buckets even — the same uniformity assumption, enforced by measurement instead of hope.

**Time-bucketed data.** Monitoring systems group events into per-minute or per-hour buckets keyed by timestamp, which gives an approximate time order for free and makes range queries cheap.

## Trade-offs and alternatives

Non-comparison sorts trade **generality for speed**. They achieve linear time by exploiting facts about the keys — small range, fixed number of digits, even distribution — and they lose that advantage, or stop working, when the facts do not hold. They also use extra memory proportional to the range or the number of buckets, and they cannot accept an arbitrary comparator.

Choose **counting sort** when keys are integers in a range comparable to `n` or smaller. Choose **radix sort** for large volumes of fixed-width integer keys where comparison sorting is a measured bottleneck. Choose **bucket sort** when values are real numbers spread evenly over a known interval, or when a problem's key (such as a frequency) is naturally bounded. In every other case — unknown ranges, skewed data, custom orderings, modest input sizes — the library's comparison sort is simpler and fast enough.

## Common mistakes

> [!MISTAKE] Using counting sort when the range is huge
> Counting 100 values that range up to 10⁹ allocates a billion counters. The cost is O(n + k), and when `k` dominates, it is far slower than an O(n log n) sort. Check `max - min` before choosing counting sort.

**Forgetting the offset or the `+ 1`.** Negative keys need `v - min` as the index, and the count array needs `max - min + 1` slots.

**Mixing placement conventions.** Inclusive prefix sums (group ends) need a right-to-left walk with `--count[key]`; exclusive prefix sums (group starts) need a left-to-right walk with `start[key]++`. Any other combination breaks stability.

**Unstable passes in radix sort.** Each digit pass must be stable, or later passes destroy the order established by earlier ones.

**Assuming bucket sort is always linear.** Its O(n) is an expected bound for uniformly distributed input. Clustered data puts everything in a few buckets.

**Bucket index out of bounds.** `(int) (v * n)` equals `n` when `v` is `1.0`; clamp to `n - 1`. For integer keys, compute `(v - min) * n` in `long` to avoid overflow.

## Interview perspective

Interviewers rarely ask you to implement counting sort for its own sake. They test whether you notice that a key is bounded and can be used as an index, and whether you understand the limits of each linear-time sort.

> [!INTERVIEW] Explaining when linear-time sorting applies
> "Comparison sorts need Ω(n log n) because each comparison gives one bit and there are n! orderings. Here the frequencies are between 1 and n, so I can bucket values by frequency and read the buckets from the top — O(n) time and space, with no comparison sort."

Questions to prepare:

- **Why can't a comparison sort be faster than n log n?** The decision-tree argument: `n!` leaves need height `log₂(n!) ≈ n log₂ n`.
- **What are counting sort's time and space?** O(n + k) for both; explain what `k` is and when it ruins the bound.
- **Why does the stable version walk the input in a particular direction?** It depends on whether the prefix sums give group starts (left to right) or group ends (right to left).
- **Top K Frequent Elements, Sort Characters By Frequency.** Frequency buckets in O(n).
- **Sort Colors.** Counting with three counters is a valid two-pass answer; the one-pass answer is the three-way partition from [[a3-quick-sort]].
- **Maximum Gap.** Bucket by range with `n - 1` buckets; the maximum gap cannot occur inside a bucket, so only bucket minima and maxima are needed.
- **When is bucket sort linear, and what is its worst case?** Expected O(n) on uniform data with `n` buckets; O(n²) with insertion sort when everything lands in one bucket.

## Practice

1. **Sort an array of ages** (0 to 130) for 10⁶ people with counting sort, and compare its running time with `Arrays.sort` on the same data.
2. **Stable counting sort of records.** Sort student records by grade (A to F) so that students with the same grade keep their input order. Write it once with start positions and once with end positions.
3. **Radix sort with bytes.** Rewrite the radix sort to use base 256 (`(v >>> shift) & 0xFF`), so that any non-negative `int` takes exactly four passes.
4. **Top K Frequent Elements** and **Sort Characters By Frequency** with frequency buckets.
5. **Maximum Gap.** Find the maximum difference between successive elements in sorted order in O(n) time using buckets.

The DSA explorer lists the matching problems under this topic; start with *Sort Colors*, *Top K Frequent Elements* and *Maximum Gap*.

```quiz
Q: Counting sort runs in O(n + k). For which input is it a poor choice?
- [ ] 10^6 exam scores between 0 and 100
- [ ] The characters of a long ASCII string
- [x] 1,000 user IDs ranging up to 2 × 10^9
- [ ] 10^6 integers between 0 and 10^6
> The cost depends on k, the size of the key range. For 1,000 IDs spread over two billion possible values, k dwarfs n: the count array would need billions of slots that are almost all zero. The other inputs have k at most about n, so counting sort is linear.

Q: In the stable form of counting sort with group start positions, why must the placement pass walk the input from left to right?
- [ ] Because walking right to left would go out of bounds
- [x] Each group is filled from its start, so records seen earlier take earlier slots, which keeps equal keys in input order
- [ ] Because prefix sums are only valid from the left
- [ ] It makes no difference to stability
> start[key]++ fills each group front to back. Walking the input left to right means the first record with a given key takes the first slot, preserving input order. Walking right to left with start positions would reverse the order of ties; the right-to-left walk is correct only with end positions and --count[key].

Q: Why does LSD radix sort require each digit pass to be stable?
- [ ] Stable sorts are faster
- [ ] Unstable sorts cannot handle digits
- [x] Later passes must keep elements with equal digits in the order earlier passes put them in, or the ordering by lower digits is lost
- [ ] It does not; any sort works for each pass
> After sorting by the units digit, the tens pass groups numbers by tens digit. For numbers with the same tens digit, only a stable pass keeps them ordered by their units digit, which earlier work established. For example, 21 and 24 share the tens digit 2: the units pass puts 21 first, and an unstable tens pass could swap them back.

Q: Bucket sort with n buckets is run on n values that all lie between 0.500 and 0.501 in the range [0, 1). What happens?
- [ ] It still runs in O(n), because bucket sort is always linear
- [x] Almost every value lands in the same bucket, so the cost becomes that of sorting one bucket — O(n²) with insertion sort
- [ ] It throws an exception
- [ ] It returns the values unsorted
> Bucket sort's O(n) is an expected bound that assumes values are spread evenly. Clustered values all map to bucket ⌊0.5n⌋, and the per-bucket sort must then handle everything. With a comparison sort inside buckets the result is still correct, just O(n log n) instead of linear.
```

## Quick revision {#quick-revision}

- Comparison sorts need Ω(n log n): `n!` orderings, one bit per comparison, `log₂(n!) ≈ n log₂ n`.
- Non-comparison sorts use keys as indices and can be linear, but only under conditions on the keys.
- Counting sort: count values, then rewrite (integers) or place via prefix sums (records). O(n + k) time and space, `k = max - min + 1`.
- Offset by `min` for negatives; count array size `max - min + 1`.
- Stable placement: exclusive prefix sums (starts) + left-to-right walk, or inclusive prefix sums (ends) + right-to-left walk with `--count`.
- Use counting sort only when `k` is O(n) or smaller; otherwise comparison sort, key compression or radix sort.
- Radix sort (LSD): stable counting sort per digit, least significant first; O(d · (n + b)); stability is essential.
- Bucket sort: equal-width ranges, scatter, sort each bucket, concatenate. Index `min(n - 1, (int)(v * n))` for `[0, 1)`.
- Bucket sort expected O(n) on uniform data (E[nᵢ²] < 2); clustered data → one bucket → O(n²) with insertion sort.
- Stable if buckets keep input order and use a stable inner sort.
- Frequency buckets (frequencies are 1..n): Top K Frequent and Sort Characters By Frequency in O(n).

## Key takeaways {#key-takeaways}

- The n log n barrier applies only to sorts that learn about the data by comparing; using a key as an index sidesteps it.
- Counting sort is linear when the key range is small relative to the input, and wasteful when it is not — always check the range first.
- The prefix-sum form of counting sort is stable, which makes it suitable for records and makes radix sort possible.
- Radix sort extends counting sort to large integers by sorting one small digit at a time, relying on stability between passes.
- Bucket sort extends the idea to real numbers, with linear expected time only when values are spread evenly.
- In problems, the most valuable lesson is the pattern: when a key is a bounded integer, such as a frequency or a score, index by it instead of sorting.
