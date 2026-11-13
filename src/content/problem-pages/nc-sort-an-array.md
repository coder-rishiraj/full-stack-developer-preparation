---
problemId: nc-sort-an-array
title: Sort an Array
source: neetcode
sourceUrl: https://leetcode.com/problems/sort-an-array/
difficulty: medium
patterns: [arrays-hashing, hashing, sorting-searching, heap]
relatedLessons: [a3-merge-sort, a3-quick-sort, a3-counting-sort, a7-min-heap, a1-big-o, a1-recursion]
companies: []
timeToSolve: 25
---

## 1. Problem restatement

You get an array of integers. Return it sorted in ascending order. The catch is in the rules: you may not call a built-in sort function, the time must be O(n log n), and the extra space should be as small as you can make it.

**Example 1**

- Input: `nums = [2, 5, 1, 4, 3]`
- Output: `[1, 2, 3, 4, 5]`
- Why: every value appears once, so the output is the same five values from smallest to largest.

**Example 2**

- Input: `nums = [0, -3, 0, 7, -3]`
- Output: `[-3, -3, 0, 0, 7]`
- Why: equal values stay in the output as many times as they occur in the input. Sorting reorders; it never removes duplicates.

**What the problem statement guarantees and requires**

- 1 ≤ n ≤ 5 × 10^4, where n is the length of `nums`.
- −5 × 10^4 ≤ `nums[i]` ≤ 5 × 10^4.
- No built-in sort function may be used.
- The time must be O(n log n), with the smallest space complexity possible.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. Knowing the names of sorting algorithms is not the same as being able to write one correctly under pressure, and that is exactly what this problem tests. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 25 minutes and talk out loud.
2. Say the simplest sort you know and its cost, then say why it fails the stated time requirement.
3. Pick one O(n log n) method and say how much extra memory it needs, honestly, including any recursion.
4. Ask yourself whether a method with less extra memory exists, and what you would give up for it.
5. Write the code and trace it on `[2, 5, 1, 4, 3]`. Then think about what your code does on 5 × 10^4 equal values, and on an input that is already sorted.

Open a hint only after two minutes without progress. After each hint, close it and try again before opening the next one.

> [!HINT] Hint 1: a small nudge
> There are three classic ways to reach n log n: split the array in half and combine sorted halves; pick one value and split the array around it; or repeatedly pull out the current largest value. For each, ask where the extra memory goes.

> [!HINT] Hint 2: the kind of tool you need
> "Repeatedly take the largest" is slow if you search for the largest each time. A structure that hands you the largest value in O(log n) per removal can live inside the array itself, in the positions you have not finished yet.

> [!HINT] Hint 3: almost the whole plan
> Arrange the array as a binary max-heap in place (children of index i at 2i + 1 and 2i + 2), fixing nodes from the last parent back to the root. Then, n − 1 times: swap the root (the maximum of the unsorted part) to the end of that part, shrink the part by one, and push the new root down until the heap is valid again. Check what happens if you fix the nodes from the root forward instead.

**Check yourself before revealing the walkthrough**

- [ ] I can say why an O(n²) sort is not acceptable here, with a number
- [ ] I know the worst-case time and the auxiliary space of my method, recursion stack included
- [ ] My code returns `[-3, -3, 0, 0, 7]` for `[0, -3, 0, 7, -3]` and `[7]` for `[7]`
- [ ] I know what my code does on 5 × 10^4 equal values and on already-sorted input

## 3. Interview script: understand the problem (≈2 min)

**Me:** Let me say it back. I get an integer array and return it in ascending order, keeping duplicates. I can't use the library sort, the time has to be O(n log n), and you want the extra memory as small as possible.

**Interviewer:** That's it.

**Me:** Is O(n log n) a worst-case requirement, or is an average-case bound acceptable? That decides whether a quicksort-style answer is enough.

**Interviewer:** Assume we care about the worst case.

**Me:** And "smallest space possible": do you count the recursion stack? I'd like to be honest about it rather than call something in-place that uses log n stack frames.

**Interviewer:** Yes, count everything beyond the input.

**Me:** May I sort `nums` itself and return it, instead of building a new array?

**Interviewer:** Yes.

**Me:** That matters for the space question: a new output array would already be O(n). Sizes: up to 5 × 10^4 elements, values between −5 × 10^4 and 5 × 10^4. So the values fit easily in an `int`, and any difference of two values is at most 10^5 in size, so even a subtraction comparator could not overflow. I'll still compare with `<` and `>` rather than subtracting.

**Me:** Let me make sure I have the scale right. An O(n²) sort like insertion sort does about n² / 4 shifts on random input and n² / 2 on reversed input: for n = 5 × 10^4 that is around 10^9 operations. That fails the requirement on paper and is likely too slow in practice, so I won't code it. n log₂ n is about 5 × 10^4 × 16 = 8 × 10^5. That's the target.

**Me:** One example by hand: `[0, -3, 0, 7, -3]`. Smallest is −3, twice, then 0 twice, then 7. So `[-3, -3, 0, 0, 7]`.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| No built-in sort | I write the sort myself. Library containers are allowed in principle, but using `PriorityQueue` as a sorting device would sidestep the point; I keep the sort explicit. |
| O(n log n) time | Rules out insertion, selection and bubble sort. In the comparison model it is also the best possible order (see section 6). |
| Smallest space possible | Pushes away from merge sort's O(n) buffer, towards something that rearranges in place. |
| 1 ≤ n ≤ 5 × 10^4 | Never empty. Recursion depth matters if it can reach n: a 5 × 10^4-deep recursion can overflow a default Java thread stack. |
| −5 × 10^4 ≤ `nums[i]` ≤ 5 × 10^4 | Only 100,001 possible values. That makes counting sort possible, which is not a comparison sort (see the alternative in section 4). |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| The time bound is meant in the worst case | Randomized quicksort is expected O(n log n), not worst case. It is a good answer to discuss, not the one to recommend here. |
| Space counts the recursion stack | Merge sort is O(n) + O(log n); quicksort is at least O(log n) of stack; only an iterative heap sort reaches O(1) auxiliary. |
| I may sort `nums` in place and return it | No separate output array is needed, so O(1) auxiliary space is achievable. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| Stability does not matter | Equal `int`s are indistinguishable, so no one can observe whether their order changed. It would matter for records sorted by a key. |
| "Smallest space" is judged as a function of n | Counting sort uses about 100,001 counters regardless of n. The value range is fixed by the constraints, but I'll describe that cost as O(R) rather than hide it as "constant". |

### Edge cases I will keep in mind

- n = 1: nothing to do, and no loop may index past the end.
- n = 2, in both orders.
- All values equal, 5 × 10^4 of them: the input that breaks the simplest quicksort partition.
- Already sorted and reverse-sorted input: the inputs that break a fixed-pivot quicksort.
- Negative values and both extremes, −5 × 10^4 and 5 × 10^4: matters for counting sort's index offset.

## 4. Think out loud: from first idea to best solution

> "The simplest sort I can write is insertion sort, but it is O(n²), about 10^9 steps at this size, so it fails the requirement. I'll go straight to the n log n family. Merge sort is the one I can make correct most reliably and it is n log n on every input, so I'll start there, then work on its memory."

### Approach 1: Merge sort

#### What I say out loud

> "Split the array into two halves, sort each half recursively, then merge the two sorted halves by repeatedly taking the smaller front element. Every level of the recursion does linear work, and there are about log n levels, so n log n on every input."

> "The cost is memory. Merging two adjacent sorted runs in place is hard, so I copy the range into a buffer and merge back into `nums`. One buffer of size n, allocated once, plus a recursion stack of about log n frames."

#### Intuition

Two sorted lists can be combined into one sorted list in a single left-to-right pass, because the smallest remaining element of the combination is always at the front of one of the two lists. Merge sort turns that linear merge into a full sort by applying it at every level of a halving recursion. The [[a3-merge-sort|Merge Sort]] lesson covers the pattern.

#### Algorithm

1. Allocate `buffer` with n slots once.
2. `mergeSort(lo, hi)`: if the range has fewer than two elements, return. Otherwise sort `[lo, mid]` and `[mid + 1, hi]` recursively, with `mid = lo + (hi - lo) / 2`, then merge them.
3. Merge: copy `nums[lo..hi]` into `buffer[lo..hi]`. Walk `i` through the left half and `j` through the right half of the buffer, writing the smaller front element into `nums[k]` for `k = lo..hi`. When one half runs out, take the rest of the other.
4. Return `nums`.

#### Why it is correct

By induction on the length of the range. A range of 0 or 1 elements is sorted. For a longer range, the two recursive calls leave both halves sorted (the induction hypothesis, since each half is shorter). The merge then writes positions `lo..hi` in order, and at each step the element it writes is the smallest one not yet written: both halves are sorted, so the smallest remaining element of each half is at its front, and the merge takes the smaller of those two fronts. So the merged range is sorted, and it contains exactly the elements that were there before, because every element is copied once from the buffer.

#### Dry run

`nums = [2, 5, 1, 4, 3]`. The splits are `[0..2] | [3..4]`, then `[0..1] | [2..2]`, then `[0..0] | [1..1]`. Merges happen as the recursion returns:

| Merge | Left run | Right run | Result in that range | `nums` afterwards |
|---|---|---|---|---|
| `[0..0] + [1..1]` | `[2]` | `[5]` | `[2, 5]` | `[2, 5, 1, 4, 3]` |
| `[0..1] + [2..2]` | `[2, 5]` | `[1]` | `[1, 2, 5]` | `[1, 2, 5, 4, 3]` |
| `[3..3] + [4..4]` | `[4]` | `[3]` | `[3, 4]` | `[1, 2, 5, 3, 4]` |
| `[0..2] + [3..4]` | `[1, 2, 5]` | `[3, 4]` | `[1, 2, 3, 4, 5]` | `[1, 2, 3, 4, 5]` |

#### Java code

```java title="Approach 1: merge sort"
class Solution {
    public int[] sortArray(int[] nums) {
        int[] buffer = new int[nums.length]; // allocated once, reused by every merge
        mergeSort(nums, buffer, 0, nums.length - 1);
        return nums;
    }

    private void mergeSort(int[] a, int[] buffer, int lo, int hi) {
        if (lo >= hi) {
            return;
        }
        int mid = lo + (hi - lo) / 2;
        mergeSort(a, buffer, lo, mid);
        mergeSort(a, buffer, mid + 1, hi);
        merge(a, buffer, lo, mid, hi);
    }

    private void merge(int[] a, int[] buffer, int lo, int mid, int hi) {
        for (int k = lo; k <= hi; k++) {
            buffer[k] = a[k];
        }
        int i = lo;      // front of the left run in buffer
        int j = mid + 1; // front of the right run in buffer
        for (int k = lo; k <= hi; k++) {
            if (i > mid) {
                a[k] = buffer[j++];
            } else if (j > hi) {
                a[k] = buffer[i++];
            } else if (buffer[j] < buffer[i]) {
                a[k] = buffer[j++];
            } else {
                a[k] = buffer[i++]; // ties take the left run first, which keeps the sort stable
            }
        }
    }
}
```

#### Time complexity

**O(n log n) in the worst case, and on every input.** n is the length of `nums`. The recursion halves the range each time, so there are ⌈log₂ n⌉ levels (16 for n = 5 × 10^4). At each level the ranges are disjoint and cover the array, and a merge does a constant amount of work per element (one copy, one comparison, one write), so each level costs O(n). The recurrence is T(n) = 2T(n/2) + Θ(n), which solves to Θ(n log n), independent of the order of the input.

#### Space complexity

**O(n) auxiliary**: the buffer holds n ints. On top of that, the recursion stack is ⌈log₂ n⌉ + 1 frames deep, O(log n). The input is sorted in place and returned, so no output array is counted.

#### The bridge to the next approach

> "That meets the time requirement on every input, but the buffer is O(n), and you asked for the smallest space possible. The buffer exists because merging needs somewhere to put elements. What if I did the work before the recursion instead of after? If I first rearrange the range so that small values are on the left and large values on the right, the two halves need no merging at all. That's partitioning, and partitioning can be done with swaps inside the array. That's quicksort. The question is what it costs in the worst case."

### Approach 2: Randomized quicksort with a three-way partition

#### What I say out loud

> "Pick a pivot value, rearrange the range into three parts: less than the pivot, equal to it, greater than it. The middle part is already in its final place, so I only recurse on the two outer parts. Partitioning is in place, so there's no buffer."

> "Two traps I want to avoid. If I always pick the first or last element as pivot, an already-sorted array gives the most lopsided split every time: n² time and n levels of recursion. So I pick the pivot at random. And if I partition into only two parts, '< pivot' and '≥ pivot', then 5 × 10^4 equal values all land on one side every time, and random pivots don't help, because every pivot is the same value. So I use three parts, which puts all the equal values in the middle in one pass."

> "And for the stack: I recurse into the smaller of the two outer parts and loop on the larger one. That keeps the recursion depth at most log₂ n."

#### Intuition

After partitioning around a pivot p, every element left of the equal block is smaller than every element right of it, so sorting the two sides independently sorts the whole range. A random pivot is unlikely to be near the extremes, so the sides are balanced on average, whatever the input order. The three-way partition is the same "Dutch national flag" scan as [[nc-sort-colors|Sort Colors]], with "less than, equal to, greater than the pivot" as the three colours. The [[a3-quick-sort|Quick Sort]] lesson covers the pattern.

#### Algorithm

1. While the range `[lo, hi]` has at least two elements:
2. Pick `pivot = nums[r]` for a uniformly random `r` in `[lo, hi]`.
3. Three-way partition with pointers `lt`, `i`, `gt`, keeping `[lo, lt)` < pivot, `[lt, i)` == pivot, `[i, gt]` unexamined, `(gt, hi]` > pivot. Look at `nums[i]`: if smaller, swap it to `lt` and advance both `lt` and `i`; if larger, swap it with `gt` and decrease `gt` (do not advance `i`, the element swapped in is unexamined); if equal, advance `i`. Stop when `i > gt`.
4. The outer parts are `[lo, lt − 1]` and `[gt + 1, hi]`. Recurse into the smaller one, then continue the loop on the larger one.

#### Why it is correct

**The partition invariant:** `[lo, lt)` holds values less than the pivot, `[lt, i)` values equal to it, `(gt, hi]` values greater than it, and `[i, gt]` is unexamined. It holds at the start (all of `[lo, hi]` is unexamined) and each step moves one unexamined element into its correct region. Each step also shrinks the unexamined region by one (either `i` grows or `gt` shrinks), so the loop ends, with every element classified.

**The sort:** after partitioning, the equal block is in its final position, because everything before it is smaller and everything after it is larger. Sorting the two outer parts (recursively for one, by the loop for the other) sorts the range. The equal block holds at least the pivot itself, so each outer part is strictly shorter than the range, and the process terminates.

#### Dry run

`nums = [0, -3, 0, 7, -3]`, and suppose the random index picks value 0 as the pivot.

| Step | `nums[i]` vs pivot 0 | Action | `nums` after | lt | i | gt |
|---|---|---|---|---|---|---|
| start | | | `[0, -3, 0, 7, -3]` | 0 | 0 | 4 |
| 1 | 0 = 0 | `i++` | `[0, -3, 0, 7, -3]` | 0 | 1 | 4 |
| 2 | −3 < 0 | swap `lt`, `i`; both advance | `[-3, 0, 0, 7, -3]` | 1 | 2 | 4 |
| 3 | 0 = 0 | `i++` | `[-3, 0, 0, 7, -3]` | 1 | 3 | 4 |
| 4 | 7 > 0 | swap `i`, `gt`; `gt--` | `[-3, 0, 0, -3, 7]` | 1 | 3 | 3 |
| 5 | −3 < 0 | swap `lt`, `i`; both advance | `[-3, -3, 0, 0, 7]` | 2 | 4 | 3 |

`i > gt`, so the partition ends: `[0, 1]` holds the values below 0, `[2, 3]` the zeros, `[4, 4]` the 7. The left part has 2 elements and the right part 1, so the code recurses into the right part (nothing to do) and loops on `[0, 1]`. Any pivot there is −3, both elements are equal to it, and one pass finishes. Result `[-3, -3, 0, 0, 7]`.

Step 4 shows why `i` does not advance after a swap with `gt`: the −3 that came from the end has not been examined yet, and step 5 handles it.

#### Java code

```java title="Approach 2: randomized quicksort, three-way partition"
import java.util.concurrent.ThreadLocalRandom;

class Solution {
    public int[] sortArray(int[] nums) {
        quickSort(nums, 0, nums.length - 1);
        return nums;
    }

    private void quickSort(int[] a, int lo, int hi) {
        while (lo < hi) {
            int pivot = a[lo + ThreadLocalRandom.current().nextInt(hi - lo + 1)];
            // [lo, lt) < pivot, [lt, i) == pivot, [i, gt] unexamined, (gt, hi] > pivot
            int lt = lo;
            int i = lo;
            int gt = hi;
            while (i <= gt) {
                if (a[i] < pivot) {
                    swap(a, lt++, i++);
                } else if (a[i] > pivot) {
                    swap(a, i, gt--); // the element swapped in is unexamined, so i stays
                } else {
                    i++;
                }
            }
            // Recurse into the smaller outer part, loop on the larger: depth stays at most log2(n).
            if (lt - lo < hi - gt) {
                quickSort(a, lo, lt - 1);
                lo = gt + 1;
            } else {
                quickSort(a, gt + 1, hi);
                hi = lt - 1;
            }
        }
    }

    private void swap(int[] a, int i, int j) {
        int tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
}
```

#### Time complexity

**O(n log n) expected, for every input; O(n²) in the worst case.**

- **Expected:** the expectation is over the algorithm's own random pivot choices, not over inputs, so no input order is bad on average (sorted, reversed and adversarial inputs included). For distinct values the expected number of comparisons is about 2n ln n ≈ 1.39 n log₂ n. Duplicates only help: the equal block is removed from further work, so 5 × 10^4 equal values take a single O(n) partition.
- **Worst case:** if the random pivots keep landing near the smallest or largest remaining value, each partition removes only a few elements, and the total is O(n²). For n = 5 × 10^4 the probability of anything close to that is astronomically small, but it is not zero, and you said worst case matters.
- **Without the two safeguards:** a fixed first- or last-element pivot makes sorted and reverse-sorted input quadratic every time. A two-way partition (`<` versus `≥`) makes all-equal input quadratic every time, whatever the pivot rule: in a test run on 5 × 10^4 equal values it made over 10^9 comparisons and then threw `StackOverflowError`, because the recursion was heading for n levels.

#### Space complexity

**O(log n) auxiliary in the worst case**, all of it recursion stack. The code recurses only into the smaller outer part, which has at most half the elements of the current range, so each nested call works on at most half of its caller's range, and the depth is at most log₂ n (about 16 here). The larger part is handled by the `while` loop, which costs no stack. Without that trick, plain double recursion has O(n) depth in the worst case. Partitioning itself uses a constant number of variables.

#### The bridge to the next approach

> "So quicksort fixed the buffer, but it gives me two things you asked me not to accept: the n log n is only expected, and there is still a log n stack. What I want is in place, no recursion, and n log n guaranteed."

> "Let me think about selection sort, which is in place and iterative: find the largest of the unsorted part, swap it to the end, repeat. Its only problem is that finding the largest is a linear scan, so it's n². A max-heap gives me the largest in O(log n) per removal. And a heap is just an array with an index rule, so I can build it inside the unsorted prefix of `nums` itself. That's heap sort."

### Approach 3: Heap sort (recommended)

#### What I say out loud

> "I treat the array as a complete binary tree: the children of index i are 2i + 1 and 2i + 2. First I turn the whole array into a max-heap, where every parent is at least as large as its children, so the maximum is at index 0. Then I repeat: swap index 0 with the last element of the heap, which puts the maximum in its final position, shrink the heap by one, and sift the new root down until the heap property holds again."

> "Everything happens with swaps inside `nums`, the sift-down is a loop rather than recursion, so the extra memory is a few integer variables. And every sift-down is at most the height of the tree, log n, so it is n log n in the worst case, not just on average."

#### Intuition

It is selection sort with a better way to find the maximum. The array is split into a heap prefix `[0, end]` and a sorted suffix `(end, n − 1]`. The heap answers "what is the largest unsorted value?" at index 0, and fixing the heap after removing it costs one walk from the root down, O(log n). The [[a7-min-heap|Heap]] lesson covers the index rule and sift-down for a min-heap; a max-heap is the same with the comparisons reversed.

#### Algorithm

1. **Build the heap.** For `i` from `n / 2 − 1` down to 0, sift `i` down within `[0, n)`. (Indices from `n / 2` on are leaves and are already one-element heaps.)
2. **Sift down `i` within `[0, size)`:** while `i` has a child, let `child` be its larger child. If `nums[i] ≥ nums[child]`, stop. Otherwise swap them and continue from `child`.
3. **Extract.** For `end` from `n − 1` down to 1: swap `nums[0]` with `nums[end]`, then sift 0 down within `[0, end)`.
4. Return `nums`.

#### Why it is correct

**Building.** Sift-down at index `i` makes the subtree rooted at `i` a heap, provided both child subtrees are already heaps: the larger of the three values moves up, and the displaced value continues down into a subtree that was a heap before. Processing indices from the last parent back to 0 guarantees that whenever `i` is processed, its children (which have larger indices) have already been processed. So after the loop the whole array is a max-heap. Going the other way, from 0 forward, breaks that precondition: on `[1, 1, 1, 2]` the 2 at index 3 is never lifted to the root, and the final output is `[1, 1, 2, 1]`.

**Extracting. The invariant:** before each iteration, `nums[0..end]` is a max-heap, and `nums[end + 1..n − 1]` holds the n − 1 − end largest values in ascending order, each at least as large as every value in the heap.

- It holds after building, with `end = n − 1` and an empty suffix.
- Each iteration swaps the heap's maximum (at index 0) to position `end`. That value is at least everything still in the heap and at most everything already in the suffix, so the suffix grows by one and stays sorted. The swap may break the heap property at the root only, and sifting the root down within `[0, end)` repairs it.
- When `end` reaches 0, the suffix is `[1, n − 1]` and the remaining single element at index 0 is at most all of them. The array is sorted.

**The 25-second version to say to the interviewer:**

> "The array is split into a max-heap at the front and a sorted suffix at the back, and every suffix value is at least every heap value. Each step swaps the heap's root, its maximum, onto the front of the suffix, so the suffix stays sorted, and one sift-down repairs the heap. When the heap is down to one element, everything is sorted. The heap is built bottom-up so that each sift-down starts above two valid heaps."

#### Dry run

`nums = [2, 5, 1, 4, 3]`, n = 5. Children of index 0 are 1 and 2; of index 1 are 3 and 4.

**Build** (`i` from 1 down to 0):

| i | Children's values | Action | `nums` after |
|---|---|---|---|
| 1 | 4, 3 | 5 ≥ 4, stop | `[2, 5, 1, 4, 3]` |
| 0 | 5, 1 | 2 < 5: swap with index 1; then at index 1 children 4, 3: 2 < 4, swap with index 3 | `[5, 4, 1, 2, 3]` |

**Extract:**

| end | After swapping `nums[0]` and `nums[end]` | Sift-down of the root within `[0, end)` | `nums` after (heap \| sorted) |
|---|---|---|---|
| 4 | `[3, 4, 1, 2, 5]` | 3 < 4: swap with index 1; index 1's only child inside the heap is index 3 (value 2), 3 ≥ 2, stop | `[4, 3, 1, 2 \| 5]` |
| 3 | `[2, 3, 1, 4, 5]` | 2 < 3: swap with index 1; index 1 has no child inside size 3 | `[3, 2, 1 \| 4, 5]` |
| 2 | `[1, 2, 3, 4, 5]` | 1 < 2: swap with index 1 | `[2, 1 \| 3, 4, 5]` |
| 1 | `[1, 2, 3, 4, 5]` | heap of size 1, nothing to do | `[1 \| 2, 3, 4, 5]` |

Result `[1, 2, 3, 4, 5]`.

#### Java code

```java title="Approach 3: heap sort (recommended)"
class Solution {
    public int[] sortArray(int[] nums) {
        int n = nums.length;
        // Build a max-heap bottom-up: each sift-down starts above two valid heaps.
        for (int i = n / 2 - 1; i >= 0; i--) {
            siftDown(nums, i, n);
        }
        // nums[0..end] is a max-heap; nums[end+1..] is sorted and holds the largest values.
        for (int end = n - 1; end > 0; end--) {
            swap(nums, 0, end);
            siftDown(nums, 0, end);
        }
        return nums;
    }

    /** Restores the max-heap property below index i, considering only a[0..size). */
    private void siftDown(int[] a, int i, int size) {
        while (2 * i + 1 < size) {
            int child = 2 * i + 1;
            if (child + 1 < size && a[child + 1] > a[child]) {
                child++;
            }
            if (a[i] >= a[child]) {
                return;
            }
            swap(a, i, child);
            i = child;
        }
    }

    private void swap(int[] a, int i, int j) {
        int tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
}
```

#### Time complexity

**O(n log n) in the worst case.**

- **Building is O(n)**, not O(n log n). A sift-down from a node costs at most that node's height. About half the nodes are leaves and are skipped, a quarter have height 1, an eighth height 2, and so on; the sum n/4 · 1 + n/8 · 2 + n/16 · 3 + … is at most n. (Bounding each of the n/2 sift-downs by log n gives the looser O(n log n), which is also true.)
- **Extracting is O(n log n)**: n − 1 sift-downs, each at most the tree height ⌊log₂ n⌋ levels with two comparisons and one swap per level.

On all-equal input every sift-down stops at its first comparison, because `a[i] >= a[child]` holds, so that input takes O(n).

#### Space complexity

**O(1) auxiliary.** A handful of `int` variables. `siftDown` is a loop, not a recursive call, so there is no stack growth; a recursive sift-down would add O(log n) of stack. Nothing is allocated.

### Alternative: counting sort

Counting sort does not compare elements at all. Since every value lies in `[−5 × 10^4, 5 × 10^4]`, keep a counter for each of the R = 100,001 possible values, count the input, then write each value back as many times as it was counted, in increasing order of value.

```java title="Alternative: counting sort (bounded values)"
class Solution {
    private static final int OFFSET = 50_000; // maps the smallest allowed value, -5 * 10^4, to index 0

    public int[] sortArray(int[] nums) {
        int[] count = new int[2 * OFFSET + 1];
        for (int x : nums) {
            count[x + OFFSET]++;
        }
        int k = 0;
        for (int v = 0; v < count.length; v++) {
            for (int c = count[v]; c > 0; c--) {
                nums[k++] = v - OFFSET;
            }
        }
        return nums;
    }
}
```

**Cost:** O(n + R) time in the worst case, with R = 100,001, and O(R) auxiliary space for the counters. Here n ≤ 5 × 10^4, so it is roughly 1.5 × 10^5 steps: faster than any of the three approaches above, and guaranteed.

**Why this does not contradict the n log n lower bound:** the Ω(n log n) bound applies to algorithms that learn about the input only by comparing pairs of elements. Counting sort uses a value as an array index, which is a different operation, so the bound does not apply to it. What it pays instead is a dependence on the value range.

**When it wins and when it does not:** it wins whenever the value range is small relative to n, which is the case here. It is not the answer to "smallest space possible": 100,001 counters (about 400 KB) are more memory than the largest input itself, and the cost grows with the range rather than with n. If the values could be any `int`, R would be about 4.3 × 10^9 and it would be unusable. I mention it as the practical fastest choice for these constraints and let the interviewer decide whether they want it.

### Alternative: bottom-up merge sort

Merge runs of width 1, 2, 4, … with two nested loops instead of recursion. Same O(n log n) worst-case time and same O(n) buffer, but no recursion stack. Worth one sentence if the interviewer worries about stack depth; it does not change the O(n) buffer, which is the real cost.

## 5. Comparison table

n = length of `nums`; R = 100,001, the number of possible values. No approach hashes, so "expected" differs from the worst case only where randomness is involved.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Merge sort | O(n log n) | O(n log n) | O(n) buffer + O(log n) stack |
| 2. Randomized quicksort, three-way partition | O(n log n), over the random pivots, for every input | O(n²) | O(log n) stack in the worst case (recurse on the smaller part) |
| 3. Heap sort | O(n log n) | O(n log n) | O(1) |
| Alt. Counting sort | O(n + R) | O(n + R) | O(R) |
| Alt. Bottom-up merge sort | O(n log n) | O(n log n) | O(n) buffer, no stack |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Merge sort | Guaranteed n log n; stable; simplest to get right; the merge step is reusable (linked lists, external sorting) | O(n) extra memory | When O(n) memory is acceptable, or stability matters |
| 2. Randomized quicksort | In place; typically the fastest comparison sort in practice thanks to sequential memory access | Only expected n log n; O(log n) stack; two classic traps (fixed pivot, two-way partition) | When average speed matters and a rare slow run is acceptable |
| 3. Heap sort | Guaranteed n log n and O(1) extra memory, both at once | Not stable; jumps around the array, so typically slower than quicksort or merge sort in practice | When worst-case time and minimum memory are both required, as here |
| Alt. Counting sort | Linear in n + R; trivial code | Memory and time grow with the value range; only for integer keys in a small range | Small known value ranges, when the interviewer allows a non-comparison sort |
| Alt. Bottom-up merge sort | No recursion | Still O(n) buffer; index arithmetic is easier to get wrong | When recursion depth is a concern but memory is not |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** heap sort (Approach 3). It is the only one of the three comparison sorts here that meets both stated requirements at once: O(n log n) in the worst case and O(1) auxiliary space.

**Is it optimal?** For comparison sorts, yes, in both measures. Any algorithm that learns about the input only by comparing elements must, in the worst case, make at least log₂(n!) comparisons, because there are n! possible orderings and each comparison has two outcomes, so it can at best halve the remaining possibilities. log₂(n!) is about n log₂ n − 1.44 n, so Ω(n log n) in the worst case. O(1) auxiliary space cannot be beaten. Outside the comparison model the time bound does not hold, which is why counting sort is faster here.

**Why it is the preferred interview answer, even though others exist.** The problem statement itself asks for the smallest space, and the interviewer confirmed that the worst case and the stack count. Under those rules merge sort loses on memory and quicksort loses on both the guarantee and the stack. Heap sort is a little more code than merge sort, but its two loops and one helper are short and each has a clear invariant.

**When a different solution is preferable in practice:**

- O(n) memory is fine and you want the least risky code: merge sort. Many interviewers accept it for this problem; ask.
- Average speed is what matters: randomized quicksort with a three-way partition. It is what general-purpose library sorts for primitives build on, typically with extra safeguards.
- The interviewer allows a non-comparison sort: counting sort, because the value range is small.

**When to stop:**

- Once you have heap sort with its invariant and can state the Ω(n log n) comparison lower bound, the asymptotic work is done.
- Mention counting sort in one or two sentences, with its O(R) memory, and let the interviewer choose whether to go there.
- Do not try to write an in-place merge sort. Stable in-place merging in O(n log n) exists but is far too intricate for an interview, and heap sort already gives O(1) space.

## 7. Interview script: code it and test it

### What I say while coding

> "Signature `int[] sortArray(int[] nums)`. I sort `nums` in place and return it, which you said is fine."

> "Two small helpers: `swap`, and `siftDown(a, i, size)`. The `size` parameter matters: during extraction the heap is only the prefix `[0, end)`, and sift-down must not touch the sorted suffix."

> "Build loop: `i` from `n / 2 - 1` down to 0. Bottom-up, so each node is sifted above two valid heaps."

> "Inside sift-down: pick the larger child, checking `child + 1 < size` before reading the right child. Stop when the parent is at least that child. I use `>=` so equal values stop immediately instead of swapping for nothing."

> "Extract loop: swap the root to `end`, then sift down with size `end`, not `n`."

### Testing out loud

**Normal case:** `[2, 5, 1, 4, 3]`. Building gives `[5, 4, 1, 2, 3]`; the four extractions give `[4, 3, 1, 2 | 5]`, `[3, 2, 1 | 4, 5]`, `[2, 1 | 3, 4, 5]`, `[1 | 2, 3, 4, 5]`. Correct (section 4 has the full trace).

**Duplicates and negatives:** `[0, -3, 0, 7, -3]`. Build: `i = 1` (value −3) has children 7 and −3, larger is 7, swap → `[0, 7, 0, -3, -3]`; index 3 is a leaf. `i = 0` (value 0) has children 7 and 0, swap with 7 → `[7, 0, 0, -3, -3]`; at index 1 the children are −3 and −3, 0 ≥ −3, stop. Extract: `end = 4` → swap to `[-3, 0, 0, -3, 7]`, sift: children 0 and 0, the right one is not larger, swap with index 1 → `[0, -3, 0, -3 | 7]`; at index 1 the child at index 3 is −3, −3 ≥ −3, stop. `end = 3` → `[-3, -3, 0 | 0, 7]` after the swap; sift: larger child is index 2 (0), swap → `[0, -3, -3 | 0, 7]`. `end = 2` → `[-3, -3 | 0, 0, 7]`; sift: −3 ≥ −3, stop. `end = 1` → swap indices 0 and 1, both −3: `[-3 | -3, 0, 0, 7]`. Result `[-3, -3, 0, 0, 7]`. Correct.

**n = 1:** `[7]`. The build loop starts at `1 / 2 − 1 = −1` and does not run; the extract loop starts at `end = 0` and does not run. Returns `[7]`.

**n = 2:** `[2, 1]`: build `i = 0`, child 1 holds 1, 2 ≥ 1, stop; extract `end = 1` swaps → `[1, 2]`. `[1, 2]`: build swaps to `[2, 1]`, extract swaps back to `[1, 2]`. Both correct.

**All equal, 5 × 10^4 values:** every sift-down stops at its first comparison because `a[i] >= a[child]`, so the whole run is linear. Same answer either way, but it shows `>=` is the right stop test.

**Extremes:** `[50000, -50000, 0, -50000, 50000]`. Only comparisons are used, never subtraction, so there is nothing to overflow. Returns `[-50000, -50000, 0, 50000, 50000]`.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 2–3 min | Worst case or expected? Does the stack count? May I sort in place? |
| Rule out O(n²) | about 30 s | Insertion sort is about 10^9 steps here |
| Lay out the options | 3–4 min | Merge sort (O(n) buffer), quicksort (expected, stack, traps), heap sort (O(1), guaranteed); mention counting sort |
| Say why heap sort works | about 1 min | The heap-prefix / sorted-suffix invariant; bottom-up build |
| Write the code | 6–8 min | Two loops, one sift-down helper with a `size` parameter |
| Trace and edge cases | 3–4 min | One full trace, then n = 1, n = 2, all equal |
| Complexity and follow-ups | 2–3 min | O(n) build, O(n log n) extract, O(1) space; the comparison lower bound |

### Where the time should go

- **Most attention:** the comparison of the three sorts. The problem is a vehicle for showing you know their trade-offs, and the space requirement decides between them.
- **Do not skimp on:** the `size` boundary in sift-down and the direction of the build loop. Those are the two heap sort bugs that actually happen.
- **Least attention:** counting sort and bottom-up merge sort. One sentence each.

### If the code does not come

1. **Write merge sort** if heap sort's details escape you. It is O(n log n) worst case; say plainly that it uses O(n) memory and that heap sort would reduce it to O(1).
2. **Rebuild sift-down from the picture,** not from memory: draw five boxes as a tree, write the child indices, and ask "which value should sit at the top?"
3. **If unsure about the build direction,** try both on `[1, 1, 1, 2]` by hand. Only bottom-up lifts the 2 to the root.

## 9. Interviewer challenges

### About the requirements

#### The lower bound for sorting is n log n. How can counting sort be linear?

**What they are testing:** whether you know what model the lower bound holds in.

**How to reason:** the argument counts comparisons: n! possible orders, two outcomes per comparison, so at least log₂(n!) comparisons in the worst case. It says nothing about an algorithm that never compares.

**What I say:** "The Ω(n log n) bound is a worst-case bound for comparison-based sorting: with only pairwise comparisons you need about log₂(n!) of them to tell n! orderings apart. Counting sort never compares two elements; it uses each value as an index. So it isn't covered by the bound. It pays with a cost in the value range instead: O(n + R) time and O(R) memory."

**Nuance:** radix sort is the same idea for wider ranges: O(n · w / b) for w-bit keys processed b bits at a time, with 2^b counters.

#### Is heap sort really O(1) extra space?

**What they are testing:** whether "in place" in your mouth includes the stack.

**How to reason:** list everything allocated: no arrays, no collections. List every call chain: `sortArray` calls `siftDown`, which calls `swap`, and neither recurses.

**What I say:** "Yes. Nothing is allocated and nothing recurses: sift-down is a loop. That's a constant number of variables. If I had written sift-down recursively it would be O(log n) stack, which is why I wrote it as a loop."

**Nuance:** quicksort is often called in place, and its partition is, but the recursion is at least O(log n) of stack, and O(n) if you don't recurse on the smaller side.

#### Why not merge sort? It's simpler.

**What they are testing:** whether you can weigh simplicity against a stated requirement instead of defending a choice.

**How to reason:** merge sort satisfies the time bound in the worst case. It fails only the space requirement, and only if that requirement is strict.

**What I say:** "Merge sort is what I'd write if O(n) extra memory were fine: it's guaranteed n log n and it's hard to get wrong. The buffer is the problem, since the statement asks for the smallest space. Heap sort gets the same worst-case time with O(1) extra memory. If you're happy with O(n), I'll take merge sort."

**Nuance:** merge sort is stable and heap sort is not. For plain `int`s nobody can tell, but for records sorted by a key that would decide it the other way.

### About quicksort

#### What is the worst case of your quicksort, and when does it happen?

**What they are testing:** whether you say "n log n" without the qualifier.

**How to reason:** separate the pivot rule from the input. With a random pivot, the expectation is over the random choices and holds for every input. The worst case still exists: a run of unlucky pivots.

**What I say:** "O(n²), if the random pivots keep landing near the extremes of their ranges. The expected time is O(n log n) on every input, because the randomness is mine, not the input's. With a fixed first or last pivot, a sorted array would hit the quadratic case every time, and on 5 × 10^4 elements it would also recurse about 5 × 10^4 levels deep and could overflow the stack."

**Nuance:** introsort, which some library sorts use, switches to heap sort when the recursion gets too deep, guaranteeing O(n log n) worst case. That is the practical answer to "how do I get quicksort's speed with a guarantee".

#### What happens when the array has many duplicates?

**What they are testing:** the trap that random pivots do not fix.

**How to reason:** trace a two-way partition (`< pivot` to the left, everything else to the right) on all-equal input. Every element goes right, the pivot ends up at one end, and the next call has n − 1 elements. The pivot rule doesn't matter, because every candidate pivot is the same value.

**What I say:** "With a two-way partition, all-equal input is quadratic no matter how I choose the pivot: every element lands on the same side. On 5 × 10^4 equal values that's about 1.25 × 10^9 comparisons and a recursion n levels deep. The three-way partition puts all values equal to the pivot in the middle block, which is never touched again, so all-equal input takes one linear pass."

**Nuance:** Hoare's original partition scheme, which stops on elements equal to the pivot from both sides, also avoids this by splitting equal values evenly. The three-way version is easier to argue correct and reuses the Sort Colors scan.

### About heap sort

#### Why build the heap from the last parent backwards, and why is building only O(n)?

**What they are testing:** whether you understand sift-down's precondition and can count the work instead of multiplying n by log n.

**How to reason:** sift-down at `i` only works if both subtrees of `i` are already heaps. For the cost, most nodes are near the bottom and sift only a short distance.

**What I say:** "Sift-down assumes both children are roots of valid heaps. Going from `n / 2 − 1` down to 0 guarantees that, because children have larger indices. Going forward from 0 doesn't: `[1, 1, 1, 2]` comes out as `[1, 1, 2, 1]`. As for cost, a node's sift-down is at most its height, and half the nodes are leaves, a quarter have height 1, and so on. The total is at most about n."

**Nuance:** building by inserting elements one at a time with sift-up is O(n log n) in the worst case. The O(n) build relies on sift-down from the bottom.

## 10. Follow-up questions the interviewer might ask

**"What if the array were a linked list?"**
Merge sort. Splitting needs a middle-finding walk (slow and fast pointers), and merging two sorted lists needs no buffer, because nodes are relinked. O(n log n) time; O(log n) stack for the recursive version, O(1) for bottom-up. Heap sort and quicksort rely on random access, which a list does not have.

**"What if the data is too big for memory?"**
External merge sort. Read chunks that fit in memory, sort each one, write it out as a sorted run, then merge the runs with a k-way merge driven by a min-heap of the runs' front elements. O(N log N) comparisons for N total elements, and the number of passes over the disk is what you minimise.

**"What if every element is at most k positions away from its sorted position?"**
Keep a min-heap of the next k + 1 elements. The smallest of them must belong at the current output position, because any element further right is at least k + 1 positions away from it. Pop it, push the next element. O(n log k) time, O(k) space.

**"What if the values could be any `int`?"**
Counting sort is out (R ≈ 4.3 × 10^9). Comparison sorts are unchanged. Radix sort on 32-bit keys in four passes of 8 bits, with 256 counters and an O(n) output buffer, is linear in n; negative numbers need the sign bit flipped first so they order before positive ones.

**"What if you had to sort records by a key and keep equal keys in their original order?"**
That is stability. Merge sort is stable if ties take the left run, which the code above does. Counting sort is stable when it places records using prefix sums of the counts, scanning the input from the back. Heap sort and quicksort are not stable.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Calling quicksort O(n log n) without a qualifier.** With a random pivot it is expected O(n log n) on every input and O(n²) in the worst case. The interviewer asked about the worst case.
- **Calling quicksort or recursive sorts "O(1) space".** The recursion stack counts: O(log n) at best for quicksort, O(log n) for merge sort's recursion on top of its O(n) buffer.
- **Believing a random pivot fixes everything.** It fixes ordered inputs, not duplicates. With a two-way partition, all-equal input is quadratic for any pivot rule.
- **Saying counting sort "beats the lower bound".** The lower bound is for comparison sorts. Counting sort is outside that model and pays with O(R) memory.
- **Treating "the values are small" as free.** Counting sort's 100,001 counters exceed the size of the largest input. It is fast, not small.

### Implementation mistakes

> [!MISTAKE] Sifting down with the whole array size during extraction
> `siftDown(nums, 0, n)` instead of `siftDown(nums, 0, end)` lets the sift reach into the sorted suffix and pull the maxima back into the heap. On `[2, 5, 1, 4, 3]` the result is `[5, 4, 1, 2, 3]`.

> [!MISTAKE] Building the heap from the root forward
> `for (int i = 0; i <= n / 2 - 1; i++)` calls sift-down on nodes whose subtrees are not heaps yet. On `[1, 1, 1, 2]` the result is `[1, 1, 2, 1]`.

- **Reading the right child without checking it exists.** `a[child + 1]` needs `child + 1 < size` first, or it reads past the heap (and, at the end of the array, throws).
- **Advancing `i` after swapping with `gt` in the three-way partition.** The element brought in from `gt` has not been examined; skipping it can leave a smaller value on the right of the pivot block.
- **Fixed pivot (first or last element) in quicksort.** Sorted and reverse-sorted inputs become quadratic, and at 5 × 10^4 elements the recursion is deep enough to risk `StackOverflowError`.
- **Merge without the leftover branches.** Once one run is exhausted, the rest of the other must still be copied; the `i > mid` and `j > hi` branches do that.
- **Allocating a new array in every merge call.** Still correct, but it allocates O(n log n) memory in total over the run and is much slower; allocate one buffer up front.
- **Forgetting the offset in counting sort.** `count[x]` with a negative `x` throws `ArrayIndexOutOfBoundsException`; index by `x + 50_000`.

## 12. Pattern recognition

**The pattern:** choosing a sorting algorithm from the constraints. Each classic sort makes a different trade between worst-case time, extra memory, stability and the kind of keys it handles.

**Signals in the problem statement:**

- "Without built-in functions" plus a complexity requirement: the problem is about the sort itself.
- "Smallest space possible" with an O(n log n) bound: heap sort.
- A small, known value range: counting sort becomes possible.
- Linked lists, external data, or stability: merge sort.

**Related problems in this list:**

- [[nc-sort-colors|Sort Colors]]: a three-value sort in one pass; its scan is exactly quicksort's three-way partition.
- [[nc-kth-largest-element-in-array|Kth Largest Element in an Array]]: quickselect (one side of quicksort) or a size-k heap, without sorting everything.
- [[nc-top-k-frequent-elements|Top K Frequent Elements]]: sorting by frequency, then beating n log n with a counting idea on the frequencies.
- [[nc-merge-sorted-array|Merge Sorted Array]]: merge sort's merge step on its own, done in place from the back.
- [[nc-merge-k-sorted-lists|Merge K Sorted Lists]]: the k-way merge from the external sorting follow-up.
- [[cses-distinct-numbers|Distinct Numbers]] (CSES): sort, then one scan, the most common use of a sort in practice.

**Takeaway:** when asked to sort by hand, decide by the constraints: merge sort for guaranteed time and stability, heap sort for guaranteed time in O(1) space, randomized three-way quicksort for average speed, and counting sort when the value range is small.

## 13. 60-second revision card

**Key insight:** heap sort is selection sort with a heap: keep a max-heap in the prefix, swap its root to the end of the prefix, repair with one sift-down. In place, iterative, n log n guaranteed.

**Invariant:** `nums[0..end]` is a max-heap; `nums[end + 1..]` is sorted and every value there is at least every heap value. Build bottom-up, from `n / 2 − 1` to 0.

**Complexity:** O(n log n) worst-case time (O(n) build + n − 1 sift-downs of O(log n)), O(1) auxiliary space. Comparison sorts need Ω(n log n) comparisons in the worst case; counting sort escapes that bound with O(n + R) time and O(R) space because it does not compare.

**Code skeleton:**

```java title="Heap sort in two loops"
class Solution {
    public int[] sortArray(int[] a) {
        for (int i = a.length / 2 - 1; i >= 0; i--) sift(a, i, a.length); // build bottom-up
        for (int end = a.length - 1; end > 0; end--) {
            int t = a[0]; a[0] = a[end]; a[end] = t;                     // max to its final place
            sift(a, 0, end);                                             // heap is now a[0..end)
        }
        return a;
    }

    private void sift(int[] a, int i, int size) {
        for (int c = 2 * i + 1; c < size; i = c, c = 2 * i + 1) {
            if (c + 1 < size && a[c + 1] > a[c]) c++;                    // larger child
            if (a[i] >= a[c]) return;
            int t = a[i]; a[i] = a[c]; a[c] = t;
        }
    }
}
```

**Main traps:**

- Sift-down during extraction uses size `end`, not `n`.
- Build from the last parent down to 0, not from 0 up.
- Quicksort: random pivot for ordered inputs, three-way partition for duplicates, recurse on the smaller side for the stack. Still only expected n log n.
- Merge sort is O(n) extra memory; counting sort is O(R).

**What to say in one breath:** "Merge sort is n log n guaranteed but needs an O(n) buffer; randomized quicksort is in place but only expected n log n with a log n stack. Heap sort gives both: build a max-heap bottom-up in O(n), then n − 1 times swap the root to the end and sift down, O(n log n) worst case with O(1) extra space. Since the values are bounded, counting sort would be O(n + R), which doesn't contradict the comparison lower bound because it never compares."
