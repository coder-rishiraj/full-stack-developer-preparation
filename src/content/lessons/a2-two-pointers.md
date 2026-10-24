---
summary: The two-pointer technique keeps two indices into a sequence and moves them by a rule that provably discards impossible candidates, turning many O(n²) pair-checking problems into a single O(n) pass. You will learn the three families — converging, same-direction and two-sequence pointers — how to prove each move is safe, and how to recognise the pattern in new problems.
difficulty: intermediate
minutes: 50
objectives:
  - Explain why converging pointers on sorted data can discard a whole row of candidate pairs with each move
  - Implement Two Sum II, Container With Most Water and 3Sum, and justify every pointer move
  - Apply same-direction and two-sequence pointers to partitioning and merging, including merging in place from the back
  - Derive the O(n) bound from how far each pointer can move
  - Distinguish two pointers from sliding window and hashing, and choose between them
---

## Introduction

You are given a sorted list of prices, `[1, 3, 4, 6, 8, 11]`, and a gift card worth exactly 10. Is there a pair of items that uses the card exactly? The brute force checks every pair: `(1, 3)`, `(1, 4)`, …, `(8, 11)`. For `n` items that is `n(n - 1) / 2` pairs — about 50 billion for 300,000 items.

There is a much faster way, and it uses only the fact that the list is sorted. Put one finger on the cheapest item (1) and one on the most expensive (11). Their sum is 12: too much. Now ask what that tells you. The 11 paired with the *cheapest* remaining item already overshoots, so the 11 cannot be part of any valid pair. Drop it and move the right finger to 8. Now `1 + 8 = 9`: too little. The 1 paired with the *most expensive* remaining item falls short, so the 1 is useless too. Move the left finger. Each comparison eliminates one item for good, so after at most `n - 1` steps you have either found a pair or proved there is none.

That is the **two-pointer technique**: keep two indices into the data and move them according to a rule that **safely discards candidates** at every step. It is not one algorithm but a family of them, and it shows up across this module and beyond — checking palindromes ([[a2-array-string-traversal]]), merging sorted lists ([[a3-merge-sort]]), partitioning in quicksort ([[a3-quick-sort]]), detecting cycles in linked lists ([[a4-fast-slow-pointers]]), and as the engine inside every sliding window ([[a2-sliding-window]]).

## Before you start

- **Array traversal and the read/write pattern** — two indices moving through one array. See [[a2-array-string-traversal]].
- **Big-O analysis** — why an O(n log n) sort followed by an O(n) scan is O(n log n) overall. See [[a1-big-o]].
- **Sorting in Java** — `Arrays.sort` and what sorted order guarantees. See [[a2-sorting-based]].

## The intuition

Every two-pointer algorithm answers one question: **when I look at the elements under my two pointers, what can I conclude about elements I have not looked at?** If the answer is "one of these two elements can never be part of the solution", you can move that pointer and never look back.

That is exactly the reasoning behind binary search ([[a3-binary-search]]), where one comparison rules out half the array because the data is ordered. Here each comparison rules out less — one element instead of half — but it does so in a problem with `n²` candidates (pairs), not `n`. Ruling out a whole *row* of pairs per step is what takes the work from O(n²) down to O(n).

There are three families, distinguished by where the pointers start and which way they move:

| Family | Start | Movement | Typical problems |
|---|---|---|---|
| **Converging** (opposite ends) | `0` and `n - 1` | Towards each other | Pair sums in sorted data, palindromes, Container With Most Water |
| **Same direction** (read/write, slow/fast) | Both near the start | Both forward, at different speeds | Remove duplicates, partition, cycle detection |
| **Two sequences** | Start of each sequence (or end) | Each forward in its own sequence | Merge sorted arrays, intersections, subsequence checks |

## Converging pointers: Two Sum II

**Two Sum II** gives a sorted array and a target, and asks for the indices of two elements that add up to the target. (LeetCode numbers indices from 1; this lesson uses 0-based indices.)

### Why the moves are safe

Picture every candidate pair `(i, j)` with `i < j` as a cell in a grid, with `i` as the row and `j` as the column. The brute force visits every cell. The pointers `left` and `right` define a smaller region: only pairs with `left <= i < j <= right` are still possible. Now compare `sum = a[left] + a[right]` with the target:

- **`sum < target`.** For every `j` in the region, `a[j] <= a[right]` because the array is sorted, so `a[left] + a[j] <= sum < target`. No pair in row `left` can work. Discard the entire row: `left++`.
- **`sum > target`.** For every `i` in the region, `a[i] >= a[left]`, so `a[i] + a[right] >= sum > target`. No pair in column `right` can work. Discard the column: `right--`.
- **`sum == target`.** Found.

Each move removes a whole row or column of candidates that we have *proved* contains no answer, which is why the algorithm never misses a solution even though it looks at only O(n) pairs. This proof — "the element I am discarding cannot pair with anything still in range" — is what interviewers want to hear.

### Implementation and dry run

```java title="TwoSumSorted.java"
import java.util.Arrays;

public class TwoSumSorted {
    /** Returns indices {i, j} with a[i] + a[j] == target, or {-1, -1}. a must be sorted. */
    static int[] twoSum(int[] a, int target) {
        int left = 0, right = a.length - 1;
        while (left < right) {                 // a pair needs two distinct indices
            int sum = a[left] + a[right];
            if (sum == target) return new int[]{left, right};
            if (sum < target) left++;          // a[left] is too small for every partner
            else right--;                      // a[right] is too large for every partner
        }
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        int[] prices = {1, 3, 4, 6, 8, 11};
        System.out.println(Arrays.toString(twoSum(prices, 10)));
        System.out.println(Arrays.toString(twoSum(prices, 2)));
    }
}
```

```output
[2, 3]
[-1, -1]
```

| Step | `left` | `right` | `a[left] + a[right]` | Conclusion | Move |
|---|---|---|---|---|---|
| 1 | 0 | 5 | 1 + 11 = 12 | 11 too large for anything | `right--` |
| 2 | 0 | 4 | 1 + 8 = 9 | 1 too small for anything | `left++` |
| 3 | 1 | 4 | 3 + 8 = 11 | 8 too large | `right--` |
| 4 | 1 | 3 | 3 + 6 = 9 | 3 too small | `left++` |
| 5 | 2 | 3 | 4 + 6 = 10 | found | return `[2, 3]` |

The loop condition is `left < right`, not `left <= right`, because a pair needs two different elements; with `<=`, a target of 8 could wrongly match the single element 4 with itself.

For a target of 2, the left pointer stays at 1 while the right pointer walks all the way down — every sum is too large — until the pointers meet and the loop ends.

### Complexity

Each iteration moves one pointer one step inward, so the gap `right - left` shrinks by exactly 1 per iteration. It starts at `n - 1` and the loop stops when it reaches 0, so there are at most `n - 1` iterations: **O(n) time, O(1) space**. If the input is not sorted, sorting first costs O(n log n), which then dominates — and you lose the original indices, which matters when the problem asks for them. For unsorted input, the hash-map approach in [[a2-hashing]] is O(n).

## Converging pointers with a cleverer rule: Container With Most Water

You are given heights of vertical lines at positions `0..n-1`. Choose two lines that, with the x-axis, form a container holding the most water. The water held by lines `i < j` is `min(h[i], h[j]) × (j - i)` — the shorter line limits the height, and the distance is the width.

The array is not sorted, so the Two Sum argument does not apply directly. But a different argument does. Start with the widest container, `left = 0` and `right = n - 1`. Suppose `h[left] < h[right]`. Consider *any* other container that uses the line at `left` with some partner `j < right`:

- Its width `j - left` is smaller than the current width.
- Its height is `min(h[left], h[j]) <= h[left]`, which is no more than the current height (the current height is `h[left]`, because it is the shorter line).

Smaller width and no greater height means a smaller area. So **every remaining container that uses `left` is worse than the one we just measured**, and `left` can be discarded. The rule is: **move the pointer at the shorter line**. Moving the taller one could never help, because the shorter line would still cap the height while the width shrinks. When the heights are equal, the same argument shows both lines are finished, so moving either is safe.

```java title="ContainerWithMostWater.java"
public class ContainerWithMostWater {
    static int maxArea(int[] h) {
        int left = 0, right = h.length - 1, best = 0;
        while (left < right) {
            int area = Math.min(h[left], h[right]) * (right - left);
            best = Math.max(best, area);
            if (h[left] < h[right]) left++;   // the shorter line can never do better
            else right--;
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(maxArea(new int[]{1, 8, 6, 2, 5, 4, 8, 3, 7}));
    }
}
```

```output
49
```

| `left` | `right` | Heights | Area | Best | Move |
|---|---|---|---|---|---|
| 0 | 8 | 1, 7 | 1 × 8 = 8 | 8 | `left++` (1 is shorter) |
| 1 | 8 | 8, 7 | 7 × 7 = 49 | 49 | `right--` |
| 1 | 7 | 8, 3 | 3 × 6 = 18 | 49 | `right--` |
| 1 | 6 | 8, 8 | 8 × 5 = 40 | 49 | `right--` (equal: either) |
| 1 | 5 | 8, 4 | 4 × 4 = 16 | 49 | `right--` |
| 1 | 4 | 8, 5 | 5 × 3 = 15 | 49 | `right--` |
| 1 | 3 | 8, 2 | 2 × 2 = 4 | 49 | `right--` |
| 1 | 2 | 8, 6 | 6 × 1 = 6 | 49 | `right--`, pointers meet |

Eight areas computed instead of 36 pairs. The lesson generalises: converging pointers work whenever you can prove that **one of the two current elements cannot be part of any better answer**. Sorted order is the most common source of that proof, but not the only one.

## Extending to three elements: 3Sum

**3Sum** asks for all *unique* triplets that sum to zero. The brute force tries every triple: O(n³).

### Deriving the approach

Fix the first element of the triplet, `nums[i]`. The problem becomes: find pairs in the rest of the array that sum to `-nums[i]` — that is Two Sum II, if the array is sorted. So sort once (O(n log n)), then for each `i` run a converging scan over `i + 1 .. n - 1` (O(n)). Total: **O(n²)**, a full factor of `n` better than brute force.

The subtle part is **uniqueness**. In `[-1, 0, 1, 2, -1, -4]`, the triplet `[-1, 0, 1]` can be formed with either `-1`. After sorting, equal values sit next to each other, which makes duplicates easy to skip:

- If `nums[i] == nums[i - 1]`, every triplet starting with `nums[i]` was already found in the previous iteration. Skip it.
- After recording a triplet, move both pointers inward and keep moving each past values equal to the one just used.

```java title="ThreeSum.java"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ThreeSum {
    static List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;   // same first value: same triplets
            if (nums[i] > 0) break;                          // three positives cannot sum to 0
            int lo = i + 1, hi = nums.length - 1;
            while (lo < hi) {
                int sum = nums[i] + nums[lo] + nums[hi];
                if (sum < 0) {
                    lo++;
                } else if (sum > 0) {
                    hi--;
                } else {
                    result.add(List.of(nums[i], nums[lo], nums[hi]));
                    lo++;
                    hi--;
                    while (lo < hi && nums[lo] == nums[lo - 1]) lo++;   // skip repeated values
                    while (lo < hi && nums[hi] == nums[hi + 1]) hi--;
                }
            }
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(threeSum(new int[]{-1, 0, 1, 2, -1, -4}));
        System.out.println(threeSum(new int[]{0, 0, 0, 0}));
    }
}
```

```output
[[-1, -1, 2], [-1, 0, 1]]
[[0, 0, 0]]
```

After sorting, the first array is `[-4, -1, -1, 0, 1, 2]`. With `i = 0` (value −4) no pair sums to 4. With `i = 1` (value −1) the scan finds `[-1, -1, 2]` and then `[-1, 0, 1]`. At `i = 2` the value −1 repeats, so the iteration is skipped — without that check, `[-1, 0, 1]` would be reported twice. For `[0, 0, 0, 0]`, the inner skip loops stop the same triplet being recorded three times.

The `break` when `nums[i] > 0` is an optimisation: in a sorted array, everything after a positive value is also positive, so no later triplet can sum to zero. The pattern extends to **4Sum** (fix two elements, then two pointers: O(n³)) and to "closest sum" variants, where you track the best sum instead of returning on equality.

## Same-direction pointers

In the same-direction family both pointers move forward, but at different speeds or under different conditions. You have already met the most common form in [[a2-array-string-traversal]]: a **read** pointer that visits every element and a **write** pointer that advances only when an element is kept. Remove Duplicates from Sorted Array and Move Zeroes are both this pattern.

Another form is **slow and fast pointers**, where one pointer moves one step and the other moves two. On a linked list, if there is a cycle the fast pointer eventually laps the slow one; when there is no cycle the fast pointer reaches the end, and at that moment the slow pointer is at the middle. That technique gets its own lesson in [[a4-fast-slow-pointers]].

### Partitioning into three groups: the Dutch national flag

**Sort Colors** gives an array of 0s, 1s and 2s and asks you to sort it in place in one pass, without a counting pass first. (It is called the Dutch national flag problem because the three values are like the flag's three colour bands.) It uses three pointers that split the array into four regions:

```text
[ 0 0 0 | 1 1 1 | ? ? ? ? | 2 2 2 ]
  0      lo      mid     hi       n-1
```

The **invariant** is: `a[0..lo)` are all 0, `a[lo..mid)` are all 1, `a[mid..hi]` are not yet examined, and `a(hi..n-1]` are all 2. Each step examines `a[mid]`:

- **0**: swap it with `a[lo]` (which is a 1, or is `mid` itself), then advance both `lo` and `mid`.
- **1**: it is already in the right region; advance `mid`.
- **2**: swap it with `a[hi]` and shrink `hi`. Do **not** advance `mid` — the element that arrived from `hi` has not been examined yet.

```java title="SortColors.java"
import java.util.Arrays;

public class SortColors {
    static void sortColors(int[] a) {
        int lo = 0, mid = 0, hi = a.length - 1;
        while (mid <= hi) {                    // a[mid..hi] is the unknown region
            if (a[mid] == 0) {
                swap(a, lo++, mid++);
            } else if (a[mid] == 1) {
                mid++;
            } else {
                swap(a, mid, hi--);            // mid stays: the swapped-in value is unexamined
            }
        }
    }

    static void swap(int[] a, int i, int j) {
        int t = a[i]; a[i] = a[j]; a[j] = t;
    }

    public static void main(String[] args) {
        int[] a = {2, 0, 2, 1, 1, 0};
        sortColors(a);
        System.out.println(Arrays.toString(a));
    }
}
```

```output
[0, 0, 1, 1, 2, 2]
```

| `lo` | `mid` | `hi` | `a[mid]` | Action | Array after |
|---|---|---|---|---|---|
| 0 | 0 | 5 | 2 | swap `mid`, `hi`; `hi--` | `[0, 0, 2, 1, 1, 2]` |
| 0 | 0 | 4 | 0 | swap `lo`, `mid`; both advance | `[0, 0, 2, 1, 1, 2]` |
| 1 | 1 | 4 | 0 | swap `lo`, `mid`; both advance | `[0, 0, 2, 1, 1, 2]` |
| 2 | 2 | 4 | 2 | swap `mid`, `hi`; `hi--` | `[0, 0, 1, 1, 2, 2]` |
| 2 | 2 | 3 | 1 | `mid++` | unchanged |
| 2 | 3 | 3 | 1 | `mid++`; now `mid > hi`, stop | `[0, 0, 1, 1, 2, 2]` |

Every iteration either advances `mid` or shrinks `hi`, so the unknown region shrinks by one each time: at most `n` iterations, O(n) time, O(1) space. The same three-way partition is used by quicksort to handle many equal keys efficiently ([[a3-quick-sort]]).

## Pointers into two sequences

When the input is two sorted sequences, give each its own pointer and always advance the one whose current element should come first. This is the **merge** step of merge sort ([[a3-merge-sort]]), and it is O(n + m) for sequences of lengths `n` and `m`.

### Merge Sorted Array — in place, from the back

In **Merge Sorted Array**, `nums1` has length `m + n`: its first `m` slots hold sorted values and the last `n` are empty padding. `nums2` holds `n` sorted values. Merge `nums2` into `nums1` in place.

Merging from the front would overwrite elements of `nums1` before they are read. The fix is to notice where the free space is: at the **back**. So merge from the largest elements downwards, writing into `nums1` from index `m + n - 1`. The write position is always at or to the right of the next unread element of `nums1`, so nothing is overwritten before it is used — the same safety argument as read/write compaction, mirrored.

```java title="MergeSortedArray.java"
import java.util.Arrays;

public class MergeSortedArray {
    static void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1, j = n - 1, write = m + n - 1;
        while (j >= 0) {                                   // stop when nums2 is used up
            if (i >= 0 && nums1[i] > nums2[j]) {
                nums1[write--] = nums1[i--];
            } else {
                nums1[write--] = nums2[j--];
            }
        }
    }

    public static void main(String[] args) {
        int[] nums1 = {1, 2, 3, 0, 0, 0};
        merge(nums1, 3, new int[]{2, 5, 6}, 3);
        System.out.println(Arrays.toString(nums1));
    }
}
```

```output
[1, 2, 2, 3, 5, 6]
```

The loop ends as soon as `nums2` is exhausted. Whatever remains of `nums1` is already sorted and already in its final position, so no clean-up loop is needed. The opposite case — `nums1` exhausted first — is handled by the `i >= 0` check, which then takes every remaining element from `nums2`. When values are equal, this code takes from `nums2` first; either choice produces a correctly sorted result.

The same two-sequence idea checks whether one string is a **subsequence** of another (advance the pointer in the short string only on a match) and finds the **intersection** of two sorted arrays (advance the pointer at the smaller value; record and advance both on equality).

## Converging pointers with running state: Trapping Rain Water

[[a2-prefix-suffix]] solves Trapping Rain Water with a prefix-maximum array and a suffix-maximum array: the water above bar `i` is `min(maxLeft, maxRight) - h[i]`. Two pointers remove both arrays.

Keep `left` and `right` at the ends, with `leftMax` and `rightMax` holding the tallest bar each pointer has seen. If `h[left] < h[right]`, the water above `left` is decided by `leftMax` alone. The reason: the left pointer only ever moved past a bar when some bar at or beyond the current `right` was taller, so every bar on the left so far is shorter than some bar still to the right. The true right maximum for position `left` is therefore at least `leftMax`, and the minimum in the formula is `leftMax`. The symmetric argument applies on the right.

```java
static int trap(int[] h) {
    int left = 0, right = h.length - 1, leftMax = 0, rightMax = 0, water = 0;
    while (left < right) {
        if (h[left] < h[right]) {
            leftMax = Math.max(leftMax, h[left]);
            water += leftMax - h[left];        // the right side is guaranteed to be at least as tall
            left++;
        } else {
            rightMax = Math.max(rightMax, h[right]);
            water += rightMax - h[right];
            right--;
        }
    }
    return water;
}
// trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]) == 6
```

O(n) time and O(1) space. It is a harder proof than the prefix-array version, so in an interview present the prefix version first and offer this as the optimisation.

## How it works: why the total is O(n)

All of these algorithms share one bound. Each pointer moves in **one direction only** and can take at most `n` steps before it leaves the array or meets the other pointer. If every loop iteration moves at least one pointer, the number of iterations is at most the total distance the pointers can travel — `n` for converging pointers, `2n` for read/write, `n + m` for two sequences. With constant work per iteration, the total is O(n).

This also tells you how to spot a broken two-pointer algorithm: if some iteration can leave *both* pointers where they were, the loop may never end. And if a pointer ever moves backwards, the O(n) argument no longer holds.

## Recognising the pattern

Ask these questions when you meet a new problem:

1. **Is the input sorted, or can I sort it without losing what the question asks for?** Pair, triplet and "closest sum" questions on sorted data are converging-pointer problems.
2. **Can I prove one of the two current candidates is finished?** If comparing the two ends tells you one of them cannot be in any better answer, converging pointers work even without sorting (Container With Most Water).
3. **Am I filtering, deduplicating or partitioning in place?** Use same-direction pointers.
4. **Are there two sorted sequences?** Give each its own pointer.
5. **Is the answer a contiguous range whose validity changes as it grows or shrinks?** That is a sliding window — a same-direction pair of pointers with a maintained range state. See [[a2-sliding-window]].

| Problem shape | Two pointers | Hash map | Sliding window |
|---|---|---|---|
| Pair with given sum, sorted input | O(n), O(1) space | O(n), O(n) space | — |
| Pair with given sum, unsorted, need indices | Sort loses indices | O(n) — best choice | — |
| All unique triplets | Sort + two pointers, O(n²) | Possible but awkward to deduplicate | — |
| Best contiguous range under a constraint | Building block | Sometimes, via prefix sums | Best choice |

## In real systems

**Merging sorted data.** Databases implement a **merge join** with exactly the two-sequence pattern: when both inputs are sorted on the join key, the engine advances a cursor on each side, emitting matches, in one linear pass. LSM-tree storage engines (RocksDB, Cassandra) use the same merge to compact sorted files.

**Diffing and version control.** Comparing two sorted lists of file names or keys — which files were added, removed or kept — is a two-sequence walk.

**Partitioning.** In-place partitioning (`lo`/`mid`/`hi`) is how quicksort and quickselect ([[a3-quickselect]]) work, and similar three-way splits appear in Java's dual-pivot quicksort for primitive arrays.

## Trade-offs and alternatives

Two pointers give O(n) time with O(1) extra space, which is hard to beat. The price is a **precondition**: sorted order or a provable discard rule. When the data is unsorted, you either pay O(n log n) to sort — acceptable if the question does not need original positions — or use a hash map for O(n) time at the cost of O(n) space.

Two pointers also find a *single* pair per position efficiently but do not enumerate all pairs in less than the number of pairs: if the question asks for every pair, the output itself may be O(n²).

## Common mistakes

> [!MISTAKE] Converging on unsorted input
> The discard argument depends on order. Running Two Sum II's loop on an unsorted array skips valid pairs without any error. Sort first, or use a hash map if you need original indices.

**Moving the wrong pointer.** In Container With Most Water, moving the taller line can only make things worse; the proof says to move the shorter one. Always ask which element the comparison proved useless.

**Advancing `mid` after swapping with `hi`.** In the Dutch national flag, the element swapped in from `hi` has not been examined. Advancing `mid` leaves it unclassified.

**Forgetting duplicates in 3Sum.** Without the skip on `nums[i] == nums[i - 1]` and the inner skips, the same triplet is reported several times.

**`left <= right` when a pair needs two distinct elements.** This lets an element pair with itself.

**Merging from the front in place.** In Merge Sorted Array it overwrites unread values; merge from the back where the free space is.

## Interview perspective

Two pointers is one of the most frequently tested patterns, and the differentiator is the *justification*. Many candidates know to "move the smaller side"; few can say why.

> [!INTERVIEW] Prove the move
> "If the sum is too small, `a[left]` plus the largest remaining element is still too small, so `a[left]` can't be in any answer — I discard it. Each step discards one element, so it's O(n)."

Expect:

- **Two Sum II** — and the follow-up "what if the array is unsorted?" (hash map, or sort and lose indices).
- **3Sum / 3Sum Closest / 4Sum** — fix elements, two pointers on the rest; deduplication.
- **Container With Most Water** — explain why moving the taller line cannot help.
- **Sort Colors** — state the four-region invariant.
- **Merge Sorted Array** — why from the back.
- **Valid Palindrome II** — at the first mismatch, try skipping the left or the right character once.
- **Trapping Rain Water** — prefix arrays first, then the O(1)-space two-pointer version.

## Practice

1. **Squares of a Sorted Array.** The largest square is at one of the two ends; fill the output from the back.
2. **3Sum Closest.** Track the sum closest to the target instead of collecting triplets.
3. **Is Subsequence.** Decide whether `s` is a subsequence of `t` with one pointer in each.
4. **Boats to Save People.** Each boat holds at most two people and a weight limit; sort, then pair the heaviest with the lightest when possible.
5. **Remove Duplicates from Sorted Array II.** Keep each value at most twice; practise same-direction pointers with a different keep rule.

The DSA explorer lists the matching problems under this topic; start with *Two Sum II*, *3Sum* and *Container With Most Water*.

```quiz
Q: In Two Sum II on a sorted array, a[left] + a[right] is less than the target. Why is it safe to discard a[left]?
- [ ] Because a[left] is the smallest element in the whole array
- [x] Because even paired with the largest remaining element, a[right], it falls short, so it falls short with every remaining partner
- [ ] Because the target must be in the right half
- [ ] Because moving right would cause an infinite loop
> Every remaining partner a[j] satisfies a[j] <= a[right], so a[left] + a[j] <= a[left] + a[right] < target. No pair in a[left]'s row can work, so the whole row is discarded with one move.

Q: In Container With Most Water, h[left] = 3 and h[right] = 9. Which move is correct and why?
- [x] Move left, because any container using the line at left with a closer partner is narrower and no taller than the current one
- [ ] Move right, because 9 is the larger value and should be explored
- [ ] Move both, to save time
- [ ] Either, because the heights are different
> The current height is capped by the shorter line, 3. Any other container using that line has smaller width and a height of at most 3, so it can only be worse. Moving the taller line keeps the cap of 3 while the width shrinks.

Q: In the Dutch national flag algorithm, why is `mid` not advanced after swapping a[mid] with a[hi]?
- [ ] Because hi has already been decremented
- [ ] Because a[mid] is now guaranteed to be 1
- [x] Because the element that came from a[hi] has not been examined yet and could be 0, 1 or 2
- [ ] Because mid must always equal lo
> Positions mid..hi are the unknown region. The swapped-in value came from that region, so it still needs to be classified on the next iteration. Advancing mid would leave it in the 1s region whatever its value.

Q: What is the time complexity of 3Sum using sort plus two pointers?
- [ ] O(n log n)
- [x] O(n²)
- [ ] O(n³)
- [ ] O(n)
> Sorting costs O(n log n). Then for each of n choices of the first element, a converging scan takes O(n), giving O(n²), which dominates the sort.
```

## Quick revision {#quick-revision}

- Two pointers = two indices moved by a rule that provably discards candidates; each pointer moves one way, so O(n).
- Converging (sorted pair sum): `sum < target` → `left++`; `sum > target` → `right--`; loop `left < right`.
- The proof: the discarded element cannot pair with anything still in range (a whole row or column of the pair grid).
- Container With Most Water: move the shorter line; equal heights → move either.
- 3Sum: sort, fix `i`, two pointers on `i+1..n-1`; skip `nums[i] == nums[i-1]` and repeated values after a match; O(n²).
- Same direction: read/write filters; slow/fast for linked lists.
- Dutch flag: regions `[0,lo)` 0s, `[lo,mid)` 1s, `[mid,hi]` unknown, `(hi,n-1]` 2s; do not advance `mid` after swapping with `hi`.
- Two sequences: advance the pointer with the element that comes first; merge in place from the back where free space is.
- Rain water O(1) space: process the side with the smaller height; its own running max decides the water.
- Unsorted pair sum needing indices → hash map; contiguous range with constraint → sliding window.

## Key takeaways {#key-takeaways}

- Two pointers replace an O(n²) search over pairs with O(n) moves by proving, at each step, that one current candidate can never be part of an answer.
- Sorted order is the usual source of that proof, but any argument that one end is "finished" will do.
- Same-direction pointers filter and partition in place; two-sequence pointers merge sorted data.
- The O(n) bound comes from each pointer moving only one way; an iteration that moves neither pointer is a bug.
- Write the invariant for multi-pointer partitions, and derive every move from it.
- Choose between two pointers, hashing and sliding window by whether the data is sorted, whether indices matter and whether the answer is contiguous.
