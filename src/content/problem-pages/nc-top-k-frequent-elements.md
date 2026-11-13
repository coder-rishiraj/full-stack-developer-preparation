---
problemId: nc-top-k-frequent-elements
title: Top K Frequent Elements
source: neetcode
sourceUrl: https://leetcode.com/problems/top-k-frequent-elements/
difficulty: medium
patterns: [arrays-hashing, hashing, heap, counting]
relatedLessons: [a2-frequency-counting, a7-top-k, a7-min-heap, a7-priority-queues, a3-quickselect, a3-counting-sort]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

You get an integer array `nums` and a number `k`. Return the `k` values that occur most often in `nums`. The values can be returned in any order.

**Example 1**

- Input: `nums = [4, 4, 7, 4, 7, 2]`, `k = 2`
- Output: `[4, 7]` (or `[7, 4]`)
- Why: 4 occurs three times, 7 twice and 2 once. The two most frequent values are 4 and 7.

**Example 2**

- Input: `nums = [3, -3, -3, 0, 3, -3]`, `k = 1`
- Output: `[-3]`
- Why: −3 occurs three times, 3 twice, 0 once. The answer is a value, not a count and not a position.

**What the problem statement guarantees**

- 1 ≤ n ≤ 10^5, where n is the length of `nums`.
- −10^4 ≤ `nums[i]` ≤ 10^4.
- k is between 1 and the number of distinct values in `nums`.
- The answer is unique: there is exactly one set of k values that are the most frequent.
- The follow-up asks for a time complexity better than O(n log n).

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The first solution is short; the one the follow-up asks for needs one small change of viewpoint, and finding it yourself is what sticks. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 20 minutes and talk out loud.
2. Split the problem into two steps and solve each one separately: finding how often each value occurs, and choosing the k values with the highest counts.
3. Give a solution with its complexity, then ask which step is the bottleneck and whether the follow-up's "better than O(n log n)" is reachable.
4. Write the code and trace it on Example 1.
5. Check `[9]` with k = 1, and think about the largest count a value can have.

Open a hint only after two minutes without progress. After each hint, close it and try again before opening the next one.

> [!HINT] Hint 1: a small nudge
> Once you know each value's count, you need the k largest counts. Do you need the values in fully sorted order to know which k are on top?

> [!HINT] Hint 2: the kind of tool you need
> If k is small, keep only the best k candidates seen so far, in a structure where the weakest of them is cheap to find and replace. Alternatively, think about the range of possible counts: no count can be larger than n.

> [!HINT] Hint 3: almost the whole plan
> Count each value in a hash map. Make an array of n + 1 lists, where list f holds the values that occur exactly f times. Walk f from n down to 1, collecting values until you have k of them. Then ask what happens to the size of that array for `[9]`.

**Check yourself before revealing the walkthrough**

- [ ] I can say the cost of each of the two steps separately
- [ ] I can say why my selection step does not need a full sort, or why it does
- [ ] My code returns `[4, 7]` in some order for Example 1 and `[9]` for `[9]`, k = 1
- [ ] I can say whether my time bound is expected or guaranteed, and why

## 3. Interview script: understand the problem (≈2 min)

**Me:** Let me say it back. I count how often each value appears, and return the k values with the highest counts, as values, in any order.

**Interviewer:** Yes.

**Me:** What if two values tie at the cut-off? Say k is 1 and two values both occur three times.

**Interviewer:** The answer is guaranteed to be unique. That won't happen.

**Me:** Good, so the k-th highest count is strictly larger than the (k+1)-th, and I don't need a tie-breaking rule. Ties inside the answer are fine, though: two values with the same count can both be in the top k?

**Interviewer:** Yes, as long as the set of k is unique.

**Me:** Is k always valid? At least 1, at most the number of distinct values?

**Interviewer:** Yes.

**Me:** Sizes and values?

**Interviewer:** Up to 10^5 elements, values between −10^4 and 10^4.

**Me:** So a count is at most 10^5, which fits an `int`, and there are at most 20,001 distinct values. And the follow-up wants better than n log n. Let me do the example by hand: `[4, 4, 7, 4, 7, 2]`, k = 2. Counts are 4 → 3, 7 → 2, 2 → 1. Top two: 4 and 7.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^5 | Never empty. n log n is about 1.7 × 10^6 steps, fast in practice; the follow-up asks for better on principle. |
| −10^4 ≤ `nums[i]` ≤ 10^4 | Negatives occur, so values cannot be used as array indices directly; an offset of 10^4 would make that possible (20,001 slots). |
| 1 ≤ k ≤ number of distinct values | No "not enough values" case; the result always has exactly k entries. |
| The answer is unique | The k-th highest count is strictly larger than the (k+1)-th. No tie-breaking at the boundary is needed, and any correct selection method returns the same set. |
| Follow-up: better than O(n log n) | Sorting all values by count is allowed as a first answer, but the target is O(n log k) or O(n). |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Ties inside the answer are fine | Several values with the same count may all be returned. Only the boundary is tie-free. |
| Any order of the output | No need to sort the result; the k values can come out of a heap or bucket walk in whatever order is convenient. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| I may not modify `nums` | Nothing asks me to. All approaches below read it once and work on their own count structures. |
| d is the number of distinct values | I'll state complexities in n, d and k: d ≤ n always, and d ≤ 20,001 here. |

### Edge cases I will keep in mind

- n = 1, k = 1: the single value has count n, so a structure indexed by count needs a slot for n.
- One distinct value repeated n times.
- k equal to the number of distinct values: every value is returned.
- Negative values and both extremes.
- Ties inside the answer, for example `[1, 1, 2, 2, 3]` with k = 2.

## 4. Think out loud: from first idea to best solution

> "There are two separate jobs: count, then select. Counting is a hash map pass, O(n) expected, and I don't think it can be avoided, since every element affects some count. So the real question is the selection step."

### Approach 1: Count, then sort the distinct values by count

#### What I say out loud

> "Simplest version: count with a hash map, put the distinct values in a list, sort the list by count from high to low, and take the first k. Sorting d values costs d log d, and d can be as large as n, so this is O(n log n) in the worst case. That's the bound the follow-up asks me to beat, but it's correct and a good baseline."

#### Intuition

Once each value has its count, "the k most frequent" is "the first k after sorting by count, descending". Counting with a hash map is the [[a2-frequency-counting|Frequency Counting]] pattern.

#### Algorithm

1. Build `count`: value → number of occurrences.
2. Copy the keys of `count` into a list `values`.
3. Sort `values` by `count.get(v)`, largest first.
4. Return the first k elements.

#### Why it is correct

After step 1, `count` holds exact counts, since every element added one to its own value's entry. After sorting, the first k values have counts at least as large as every value after them. By the uniqueness guarantee, the k-th count is strictly larger than the (k+1)-th, so those k values are exactly the answer.

#### Dry run

`nums = [4, 4, 7, 4, 7, 2]`, `k = 2`

| Step | State |
|---|---|
| Count | `{4 → 3, 7 → 2, 2 → 1}` |
| Sort distinct values by count, descending | `[4, 7, 2]` |
| Take the first 2 | `[4, 7]` |

#### Java code

```java title="Approach 1: count, then sort by count"
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : nums) {
            count.merge(x, 1, Integer::sum);
        }
        List<Integer> values = new ArrayList<>(count.keySet());
        values.sort((a, b) -> Integer.compare(count.get(b), count.get(a))); // most frequent first
        int[] result = new int[k];
        for (int i = 0; i < k; i++) {
            result[i] = values.get(i);
        }
        return result;
    }
}
```

#### Time complexity

**O(n + d log d) expected**, which is O(n log n) in the worst case because d ≤ n. Here n is the length of `nums` and d the number of distinct values.

- Counting: n `merge` calls, each O(1) on average when hash codes spread well, so O(n) expected.
- Sorting: d log d comparisons. Each comparison calls `count.get` twice, which is again O(1) expected.
- Taking k values: O(k).

The sort is a merge sort variant for object lists in current Java, so its d log d bound holds in the worst case; the "expected" comes only from hashing.

#### Space complexity

**O(d) auxiliary**: the map and the list each hold d entries. The sort of an object list may use up to about d / 2 temporary slots. The k-element result is the output and not counted.

#### The bridge to the next approach

> "The waste here is that I fully order all d values, but I only need to know which k are on top, not the order of the rest. If k is small, that's most of the work thrown away."

> "What if I keep only k candidates? I scan the distinct values once, and I need to know which of my current k is the weakest, so that a stronger newcomer can replace it. 'Find and remove the smallest, insert a new one' is exactly what a min-heap does in O(log k)."

### Approach 2: Count, then keep a min-heap of size k

#### What I say out loud

> "I count as before. Then I push each distinct value into a min-heap ordered by count. Whenever the heap grows to k + 1, I pop its minimum, which is the least frequent of the k + 1 candidates. At the end, the heap holds the k most frequent values."

> "Min-heap, not max-heap: the heap's job is to throw out the weakest candidate quickly, so the weakest has to be on top. Each push and pop is log k, so the selection is d log k."

#### Intuition

A size-k min-heap is a waiting room of the best k seen so far, with the weakest at the door. Every new value has to beat the weakest to stay. This is the [[a7-top-k|Top-K]] pattern built on a [[a7-min-heap|Min-Heap]].

#### Algorithm

1. Build `count` as before.
2. For each entry (value, frequency): push `[value, frequency]` onto a min-heap ordered by frequency. If the heap has more than k entries, pop the minimum.
3. Pop the k entries into the result.

#### Why it is correct

**Invariant:** after processing some of the distinct values, the heap holds the k most frequent among them (or all of them, if fewer than k have been processed).

- When a value arrives and the heap reaches k + 1 entries, popping the minimum removes one with the lowest frequency among those k + 1. Everything still in the heap has frequency at least as large as the popped one, so the remaining k are a set of k most frequent among the processed values.
- At the end all d values are processed, so the heap holds a set of k most frequent values. The uniqueness guarantee says there is only one such set, so it is the answer.

Ties among the popped minima can only occur below the k-th frequency or inside the answer, so the guarantee makes the outcome independent of how the heap breaks ties.

#### Dry run

`nums = [4, 4, 7, 4, 7, 2]`, `k = 2`. Counts `{2 → 1, 4 → 3, 7 → 2}`. A `HashMap` with small `Integer` keys iterates them in the order 2, 4, 7 in current Java versions; that order is implementation behaviour, and the result does not depend on it.

| Entry pushed | Heap after push (value:count) | Size > k? | Heap after |
|---|---|---|---|
| 2:1 | {2:1} | no | {2:1} |
| 4:3 | {2:1, 4:3} | no | {2:1, 4:3} |
| 7:2 | {2:1, 7:2, 4:3} | yes, pop 2:1 | {7:2, 4:3} |

Popping gives 7, then 4. Filled from the back, the result is `[4, 7]`.

#### Java code

```java title="Approach 2: count + min-heap of size k"
import java.util.HashMap;
import java.util.Map;
import java.util.PriorityQueue;

class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : nums) {
            count.merge(x, 1, Integer::sum);
        }
        // Min-heap of {value, frequency}: the least frequent candidate is on top, ready to be evicted.
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));
        for (Map.Entry<Integer, Integer> e : count.entrySet()) {
            heap.offer(new int[] {e.getKey(), e.getValue()});
            if (heap.size() > k) {
                heap.poll();
            }
        }
        int[] result = new int[k];
        for (int i = k - 1; i >= 0; i--) {
            result[i] = heap.poll()[0]; // pops least frequent first, so fill from the back
        }
        return result;
    }
}
```

#### Time complexity

**O(n + d log k) expected.** Counting is O(n) expected (hashing). The heap never holds more than k + 1 entries, so each of the d offers and at most d polls costs O(log k) in the worst case, and the final k polls cost O(k log k). Since k ≤ d ≤ n, this is O(n log k), better than O(n log n) whenever k is much smaller than n. When k is close to d it is no better than sorting.

#### Space complexity

**O(d + k) auxiliary**: the count map holds d entries and the heap at most k + 1. Since k ≤ d, that is O(d).

#### The bridge to the next approach

> "That beats n log n for small k, but for k close to d it's still d log d. Is there something about the counts I'm not using? They're not arbitrary numbers: each count is an integer between 1 and n. A heap is a general tool for comparing arbitrary keys; when the keys are small integers, I can index by them instead of comparing them."

> "So: an array of n + 1 buckets, bucket f holding the values that occur f times. Walk from the top bucket down and collect k values. No comparisons, so no log factor."

### Approach 3: Bucket by frequency (recommended)

#### What I say out loud

> "Count with a hash map. Then make buckets indexed by frequency, from 0 to n, because no value can occur more than n times. Each value goes into the bucket for its count. Then I walk the buckets from n down to 1, collecting values until I have k. Every step is linear: n to count, d to fill buckets, n + 1 buckets to walk."

> "The bucket array needs size n + 1, not n. If the array is `[9]`, the value 9 has count 1 = n, and bucket n has to exist."

#### Intuition

It is counting sort applied to the counts: the frequencies are integers in `[1, n]`, so they can serve directly as array indices, and walking the indices in decreasing order lists the values from most to least frequent without a single comparison. This is why it escapes the log factor. [[a3-counting-sort|Counting Sort]] covers the underlying idea.

#### Algorithm

1. Build `count`: value → frequency.
2. Create `buckets[0..n]`, each an empty list.
3. For each (value, frequency) in `count`, add the value to `buckets[frequency]`.
4. For `f` from n down to 1: append the values in `buckets[f]` to the result until it holds k values.

#### Why it is correct

- **Every value is in exactly one bucket**, the one for its exact frequency, so the walk sees every distinct value once.
- **The walk visits values in non-increasing order of frequency**, because it visits buckets in decreasing order of f.
- **So the first k values collected** have frequencies at least as large as every value not collected. That makes them a set of k most frequent values, and the uniqueness guarantee says it is the only one.
- The guarantee also means the k-th collected value finishes its bucket: the (k+1)-th most frequent value has a strictly smaller count, so it lives in a lower bucket. The code still stops at exactly k values, which keeps it safe if the guarantee were broken.

**The 25-second version to say to the interviewer:**

> "I count each value, then put each value into a bucket indexed by its count. Counts are between 1 and n, so n + 1 buckets cover them all. Walking the buckets from n down lists the values from most to least frequent, so the first k I collect have counts at least as large as everyone else's. That's the top k, and the problem guarantees it's unique. Linear time apart from hashing, because I index by count instead of comparing counts."

#### Dry run

`nums = [4, 4, 7, 4, 7, 2]`, `k = 2`, n = 6. Counts `{2 → 1, 4 → 3, 7 → 2}`.

Buckets after step 3: `buckets[1] = [2]`, `buckets[2] = [7]`, `buckets[3] = [4]`; buckets 0, 4, 5 and 6 are empty.

| f | `buckets[f]` | Result after this bucket | Collected |
|---|---|---|---|
| 6 | `[]` | `[]` | 0 |
| 5 | `[]` | `[]` | 0 |
| 4 | `[]` | `[]` | 0 |
| 3 | `[4]` | `[4]` | 1 |
| 2 | `[7]` | `[4, 7]` | 2 = k, return |

#### Java code

```java title="Approach 3: bucket by frequency (recommended)"
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : nums) {
            count.merge(x, 1, Integer::sum);
        }
        // buckets.get(f) = values occurring exactly f times; f can be as large as n.
        List<List<Integer>> buckets = new ArrayList<>(nums.length + 1);
        for (int f = 0; f <= nums.length; f++) {
            buckets.add(new ArrayList<>());
        }
        for (Map.Entry<Integer, Integer> e : count.entrySet()) {
            buckets.get(e.getValue()).add(e.getKey());
        }
        int[] result = new int[k];
        int filled = 0;
        for (int f = nums.length; f >= 1 && filled < k; f--) {
            for (int value : buckets.get(f)) {
                if (filled == k) {
                    break;
                }
                result[filled++] = value;
            }
        }
        return result;
    }
}
```

#### Time complexity

**O(n) expected.**

- Counting: n map updates, O(1) each on average when hash codes spread well, so O(n) expected.
- Creating n + 1 bucket lists: O(n).
- Distributing: d additions, O(1) amortized each (`ArrayList` grows by a constant factor).
- Walking: at most n + 1 buckets and at most k values collected, O(n).

The only non-guaranteed part is hashing. Because the values are bounded, it can be removed: an `int` array of 20,001 counters indexed by `value + 10^4` gives O(n + R) time in the worst case, with R = 20,001 (see section 9).

#### Space complexity

**O(n) auxiliary**: n + 1 bucket lists (even the empty ones are allocated), d values spread among them, and the count map with d entries. The result is the output and not counted.

### Alternative: quickselect on the distinct values

Put the d distinct values in an array with their counts and use quickselect to move the k most frequent to the end, without sorting them. It is the partition from quicksort, applied to one side only. This is the [[a3-quickselect|Quickselect]] pattern.

```java title="Alternative: quickselect on counts"
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : nums) {
            count.merge(x, 1, Integer::sum);
        }
        int d = count.size();
        int[] values = new int[d];
        int[] freq = new int[d];
        int idx = 0;
        for (Map.Entry<Integer, Integer> e : count.entrySet()) {
            values[idx] = e.getKey();
            freq[idx] = e.getValue();
            idx++;
        }
        // Goal: every frequency in [target, d) is >= every frequency in [0, target).
        int target = d - k;
        int lo = 0;
        int hi = d - 1;
        while (lo < hi) {
            int pivot = freq[lo + ThreadLocalRandom.current().nextInt(hi - lo + 1)];
            int lt = lo;
            int i = lo;
            int gt = hi;
            while (i <= gt) { // three-way partition by frequency
                if (freq[i] < pivot) {
                    swap(values, freq, lt++, i++);
                } else if (freq[i] > pivot) {
                    swap(values, freq, i, gt--);
                } else {
                    i++;
                }
            }
            if (target < lt) {
                hi = lt - 1;
            } else if (target > gt) {
                lo = gt + 1;
            } else {
                break; // target is inside the block equal to the pivot
            }
        }
        return Arrays.copyOfRange(values, target, d);
    }

    private void swap(int[] values, int[] freq, int i, int j) {
        int v = values[i];
        values[i] = values[j];
        values[j] = v;
        int f = freq[i];
        freq[i] = freq[j];
        freq[j] = f;
    }
}
```

**Cost:** O(n + d) expected time (counting, plus expected linear quickselect over the random pivots); O(n + d²) in the worst case, when the pivots keep landing at the extremes. O(d) auxiliary space for the two arrays.

**Why it works:** after each partition, everything left of the pivot block has a smaller count and everything right of it a larger one, and the loop narrows to the side containing position `target`. When it stops, every count from `target` on is at least every count before it, so the last k values are a set of k most frequent values, unique by the guarantee.

**When it wins:** it needs no n-sized bucket array, only d-sized arrays, and is expected linear. It loses on worst-case time and on code length and risk. A three-way partition is used so that many equal counts (common: lots of values occurring once) do not slow it down. I mention it as the answer to "can you do it without the bucket array?", not as the first choice.

## 5. Comparison table

n = length of `nums`, d = number of distinct values (d ≤ n, and d ≤ 20,001 here), k = number of values to return. Every approach counts with a hash map, so every time bound is expected; the worst-case column assumes the counting step behaves as expected and shows the cost of the selection step, then states the hashing caveat.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Count + sort | O(n + d log d), so O(n log n) | Selection O(d log d); counting can degrade if hashing does | O(d) |
| 2. Count + min-heap of size k | O(n + d log k) | Selection O(d log k); counting can degrade if hashing does | O(d + k) |
| 3. Count + buckets by frequency | O(n) | Selection O(n); counting can degrade if hashing does; O(n + R) with array counting instead | O(n) |
| Alt. Count + quickselect | O(n + d) | Selection O(d²) | O(d) |

When hashing does degrade, counting with Java's `HashMap` and `Integer` keys costs about O(n log n) with current tree buckets (implementation behaviour, not an API guarantee), and O(n²) for a hash table with list buckets. With an array of 20,001 counters there is no hashing at all.

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Count + sort | Shortest; the output comes out ordered by count | O(n log n): what the follow-up asks to beat | As the baseline, said in one sentence |
| 2. Count + min-heap | O(n log k); only k candidates kept beyond the counts; works on a stream of distinct counts | Still log k per value; min- versus max-heap confusion | Small k, or values arriving one by one |
| 3. Buckets by frequency | Linear; no comparisons in the selection; simple loops | O(n) bucket array even when d is small | The answer to the follow-up |
| Alt. Quickselect | Expected linear with only O(d) arrays | Quadratic worst case; most code; easy to get partition bounds wrong | When asked to avoid the bucket array |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** count, then bucket by frequency (Approach 3). It answers the follow-up with O(n) expected time and simple code. Mention the min-heap version on the way, because it is the general tool and the one interviewers often expect you to know.

**Is it optimal?** In time, yes, in expectation: in the worst case a correct algorithm must read essentially every element, since an unread element could change which values are most frequent, so Ω(n) is a worst-case lower bound. The bucket solution matches it, with the hashing caveat. In space, Approach 2 and quickselect use O(d) instead of O(n), which matters only when d is much smaller than n.

**When another solution is better in practice:**

- k is tiny and you also want little memory beyond the counts: the min-heap.
- You need a guaranteed bound: count with an array of 20,001 counters (allowed by the value range) instead of a hash map; then buckets give O(n + R) in the worst case.
- n is small: any of them; sorting is the least code.

**When to stop:** once you have the bucket solution, can state why it is linear (counts are small integers, used as indices), and have said "expected" because of the hash map. Do not optimise the bucket allocation unless asked.

## 7. Interview script: code it and test it

### What I say while coding

> "Count with `merge(x, 1, Integer::sum)`, which inserts 1 or adds 1 in one call."

> "Buckets: a list of n + 1 lists, because a count can be n. I index by count."

> "Walk from n down to 1, and stop as soon as I have k values. The inner check makes sure I never write past k, even though the guarantee means a bucket never straddles the boundary."

### Testing out loud

**Normal case:** `[4, 4, 7, 4, 7, 2]`, k = 2. Buckets 1: [2], 2: [7], 3: [4]. Walk 6, 5, 4 (empty), 3 → [4], 2 → [4, 7], stop. Correct.

**n = 1:** `[9]`, k = 1. Count `{9 → 1}`, n = 1, so buckets 0 and 1 exist; 9 goes into bucket 1 = n. Walk f = 1: collect 9. Returns `[9]`. With only n buckets, `buckets.get(1)` would throw `IndexOutOfBoundsException`.

**One distinct value:** `[5, 5, 5, 5]`, k = 1. 5 goes into bucket 4 = n, found on the first step. `[5]`.

**k = number of distinct values:** `[1, 2, 3]`, k = 3. All three in bucket 1; the walk passes buckets 3 and 2 (empty) and collects all three from bucket 1. Returns them in the map's iteration order, which is fine because any order is accepted.

**Ties inside the answer:** `[1, 1, 2, 2, 3]`, k = 2. Bucket 2 holds 1 and 2; both are collected; the walk stops before bucket 1. `[1, 2]`.

**Extremes:** `[-10000, 10000, 10000]`, k = 1. Counts `{-10000 → 1, 10000 → 2}`; bucket 2 is reached first. `[10000]`. Negative values are keys of the map, not indices, so they need no offset.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 1–2 min | Ties at the cut-off? Output order? |
| Count + sort | about 1 min | Say it, with O(n log n); do not code it unless asked |
| Heap | 2–3 min | Why a min-heap of size k; O(n log k) |
| Buckets | 2 min | Counts are integers in `[1, n]`, so index by them |
| Write the code | 4–5 min | Count, buckets, walk |
| Trace and edge cases | 2–3 min | Example 1, then `[9]` with k = 1 |
| Complexity and follow-ups | 2 min | Expected because of hashing; array counting removes it |

### Where the time should go

- **Most attention:** the move from "compare counts" to "index by count". That is the insight the follow-up is fishing for.
- **Do not skimp on:** saying "expected" for anything that uses the hash map, and the n + 1 bucket size.
- **Least attention:** coding the sort baseline, and quickselect unless asked.

### If the linear idea does not come

1. Code the heap version. O(n log k) already beats n log n for small k and is a strong answer.
2. Ask: "What do I know about the numbers I'm sorting here?" They are counts: integers from 1 to n.
3. Remember where a small integer range showed up before: counting sort indexes by the key instead of comparing keys.

## 9. Interviewer challenges

### About the design

#### Why a min-heap? You want the most frequent elements.

**What they are testing:** whether you understand what the heap is for, or associate "top k" with "max-heap" by reflex.

**How to reason:** the heap holds the current best k; what you need to find quickly is the one to throw out, which is the weakest.

**What I say:** "The heap is a filter that keeps the best k so far. When a new value comes in and I have k + 1, I have to drop the least frequent, so it must be on top: a min-heap. With a max-heap of size k, evicting the top would throw away the most frequent values; on Example 1 that version returns 7 and 2 instead of 4 and 7. The other max-heap option is to push all d values and pop k times, which is O(d + k log d) with a bottom-up heap build, or O(d log d) if I insert one at a time."

**Nuance:** the max-heap-of-everything version is fine when k is close to d; the size-k min-heap wins when k is small, and it is the version that also works on a stream.

#### Why is the bucket array of size n + 1, and isn't that wasteful when there are few distinct values?

**What they are testing:** boundary reasoning and awareness of the memory trade-off.

**How to reason:** the largest possible count is n (a single distinct value), so indices run from 1 to n; index 0 is unused but makes the indexing direct.

**What I say:** "A count can be as large as n, when one value fills the array, so bucket n has to exist; with only n buckets `[9]` throws. It is wasteful when d is small: `[5, 5, …, 5]` allocates n + 1 lists to hold one value. I could size it by the maximum count instead, or use the heap, which keeps only O(k) beyond the map."

**Nuance:** sizing by the maximum count does not change the worst case, since the maximum count can be n.

### About complexity

#### Is the bucket solution really O(n)?

**What they are testing:** whether you say "O(n)" unconditionally when a hash map is involved.

**How to reason:** separate the steps. Bucket creation, distribution and the walk are linear in the worst case. Counting uses a hash map, which is constant per operation only on average.

**What I say:** "O(n) expected. The buckets and the walk are linear, guaranteed. The hash map counting is O(1) per element on average, assuming the hash codes spread well, so the total is O(n) expected. Here the values are between −10^4 and 10^4, so I could count in an `int` array of 20,001 slots indexed by value plus 10^4. Then there's no hashing at all and it's O(n + R) in the worst case, with R = 20,001."

**Nuance:** with Java's `HashMap`, a collision-heavy bucket can be converted into a balanced tree for comparable keys like `Integer`, which keeps the worst case of counting around O(n log n); that is implementation behaviour, not something the API promises.

#### Can it be done in better than O(n)?

**What they are testing:** whether you can argue a lower bound.

**How to reason:** imagine skipping an element. It could be a copy of a value that is one occurrence away from entering the top k.

**What I say:** "No, not in the worst case. Any element I don't read could be the extra occurrence that moves its value into the top k, so a correct algorithm has to read essentially all of them. That's an Ω(n) worst-case lower bound, and the bucket version matches it in expectation."

**Nuance:** the bound is about reading the input; the selection step alone can be cheaper than n when d is small, which is why the heap and quickselect are stated in terms of d.

### About the guarantee

#### What would change if the answer were not unique?

**What they are testing:** whether you know where your code relies on the guarantee.

**How to reason:** find the step that chooses between equally frequent values at the boundary. In the bucket walk, it is the bucket that contains the k-th value: if it holds more values than are still needed, some must be left out.

**What I say:** "First I'd ask for a tie-breaking rule, say smaller value first. Without the guarantee, the bucket containing the k-th value could hold more than I need, and my code would take whichever come first in the list, which depends on hash map iteration order, so it's arbitrary. With a rule, I'd sort just that one bucket by the rule, or use a comparator of (count descending, value ascending) in the sort or heap versions."

**Nuance:** LeetCode's Top K Frequent Words, a variant outside this list, does exactly that: ties are broken alphabetically, and the output must be ordered by frequency.

## 10. Follow-up questions the interviewer might ask

**"Return the k values ordered from most to least frequent."**
The bucket walk already visits buckets in decreasing count order, so values come out in that order (values with equal counts in arbitrary order). For the heap version, pop into the result from the back, as the code above does. No change in complexity.

**"The numbers arrive as a stream, and you're asked for the top k at any moment."**
Keep the count map updated as values arrive (O(1) expected per value). Answering a query exactly needs a pass over the d counts with a size-k heap, O(d log k). If memory for all d counts is not available, use an approximate summary such as Misra–Gries or Count-Min sketch with a heap of candidates; those trade exactness for memory that does not grow with d.

**"Find just the k-th largest element of an array, not by frequency."**
The same selection tools on the values themselves: a size-k min-heap in O(n log k), or quickselect in O(n) expected. That is [[nc-kth-largest-element-in-array|Kth Largest Element in an Array]].

**"The data is spread over many machines."**
Exact top-k from per-machine top-k lists is wrong in general: a value can be ranked (k+1)-th on every machine and first overall. Partition values across machines by a hash of the value, so each value's full count lives on one machine; each machine computes its local top k; a coordinator merges the lists with a heap. The partitioning is expected to be balanced under a good hash function, not guaranteed.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Calling the bucket solution O(n) unconditionally.** The counting step uses a hash map, so it is O(n) expected. Say so, and know the array-counting alternative.
- **Thinking the heap version beats O(n log n) for every k.** It is O(n + d log k); with k close to d it is no better than sorting.
- **Taking the top k from local top-k lists** in the distributed follow-up. Counts must be combined per value before selecting.
- **Ignoring the uniqueness guarantee.** It is what makes "any order" and arbitrary tie order inside buckets safe. Say where you rely on it.

### Implementation mistakes

> [!MISTAKE] A max-heap of size k
> Ordering the heap with the most frequent on top and polling when the size exceeds k evicts the best candidates. On `[4, 4, 7, 4, 7, 2]` with k = 2 it returns 7 and 2 instead of 4 and 7.

> [!MISTAKE] A bucket array of size n
> A value that fills the whole array has count n. For `[9]` with k = 1, `buckets.get(1)` on a list of one bucket throws `IndexOutOfBoundsException`. Allocate n + 1 buckets.

- **Returning counts instead of values,** or the first k entries of the map without selecting.
- **Using `count.get(a) - count.get(b)` in a comparator.** Counts are at most 10^5 here, so it cannot overflow, but `Integer.compare` is the habit that is never wrong.
- **Not stopping at k inside a bucket.** If a bucket holds more values than are still needed, the code writes past the result array. The guarantee prevents it here, but the check is cheap.
- **In quickselect, partitioning by value instead of by count,** or forgetting to swap the parallel `values` and `freq` arrays together.

## 12. Pattern recognition

**The pattern:** frequency counting followed by top-k selection. Count with a hash map, then select with a size-k heap, or with buckets indexed by count when counts are small integers.

**Signals in the problem statement:**

- "Most frequent", "k most common", "top k".
- "Any order" for the output: selection, not sorting.
- A follow-up asking to beat O(n log n).
- Keys that are small integers (here, counts between 1 and n): an index can replace a comparison.

**Related problems in this list:**

- [[nc-kth-largest-element-in-array|Kth Largest Element in an Array]]: the same selection step, size-k heap or quickselect, on values instead of counts.
- [[nc-k-closest-points-to-origin|K Closest Points to Origin]]: top-k by a computed key, with a size-k max-heap (closest means smallest).
- [[nc-kth-largest-element-in-stream|Kth Largest Element in a Stream]]: the size-k min-heap kept up to date as values arrive.
- [[nc-majority-element|Majority Element]]: frequency counting with a special guarantee that allows O(1) space.
- [[nc-sort-an-array|Sort an Array]]: why counting sort beats n log n for small integer keys, which is the bucket idea here.
- [[nc-sort-colors|Sort Colors]]: the three-way partition used inside quickselect.

**Takeaway:** "top k by count" is two steps: count with a hash map, then select. Use a size-k min-heap for O(n log k), and buckets indexed by count for O(n) expected, because counts are integers between 1 and n.

## 13. 60-second revision card

**Key insight:** counts are integers between 1 and n, so they can index buckets. Walking the buckets from n down lists values from most to least frequent without comparing anything.

**Invariant:** bucket f holds exactly the values with count f; the walk visits buckets in decreasing f, so everything collected has a count at least as large as everything not collected.

**Complexity:** O(n) expected time (hashing), O(n) auxiliary space. Heap version: O(n + d log k) expected, O(d + k) space. Array counting over the 20,001 possible values removes hashing: O(n + R) worst case. Ω(n) worst-case lower bound: every element can matter.

**Code skeleton:**

```java title="Buckets by frequency" fragment="public int[] topKFrequent(int[] nums, int k)"
Map<Integer, Integer> count = new HashMap<>();
for (int x : nums) count.merge(x, 1, Integer::sum);
List<List<Integer>> buckets = new ArrayList<>();
for (int f = 0; f <= nums.length; f++) buckets.add(new ArrayList<>()); // counts go up to n
for (Map.Entry<Integer, Integer> e : count.entrySet()) buckets.get(e.getValue()).add(e.getKey());
int[] result = new int[k];
int filled = 0;
for (int f = nums.length; f >= 1 && filled < k; f--)
    for (int v : buckets.get(f)) if (filled < k) result[filled++] = v;
return result;
```

**Main traps:**

- n + 1 buckets, not n.
- Min-heap of size k, not max-heap, for the heap version.
- "O(n)" with a hash map means expected.
- Return values, not counts.

**What to say in one breath:** "Count with a hash map, O(n) expected. Sorting by count is n log n; a size-k min-heap is n log k. But counts are integers from 1 to n, so I put each value in a bucket indexed by its count and walk the buckets from n down until I have k values. That's O(n) expected time and O(n) space, and with an array of 20,001 counters instead of the map it's O(n + R) guaranteed."
