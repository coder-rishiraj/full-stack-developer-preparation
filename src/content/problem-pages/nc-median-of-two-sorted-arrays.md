---
problemId: nc-median-of-two-sorted-arrays
title: Median of Two Sorted Arrays
source: neetcode
sourceUrl: https://leetcode.com/problems/median-of-two-sorted-arrays/
difficulty: hard
patterns: [binary-search, two-pointers]
relatedLessons: [a3-binary-search, a3-lower-upper-bounds, a3-merge-sort, a3-quickselect, a14-deriving-optimization, a14-edge-cases]
companies: []
timeToSolve: 40
---

## 1. Problem restatement

You get two arrays of integers, `nums1` of length m and `nums2` of length n, each sorted in ascending order (values may repeat). Return the median of all m + n values taken together, as a `double`. The median is the middle value when the total count is odd, and the average of the two middle values when it is even. The statement also demands a running time of O(log(m + n)).

**Example 1**

- Input: `nums1 = [1, 3]`, `nums2 = [2]`
- Output: `2.0`
- Why: together the values are `[1, 2, 3]`. Three values, so the median is the middle one, 2.

**Example 2**

- Input: `nums1 = [1, 2]`, `nums2 = [3, 4]`
- Output: `2.5`
- Why: together they are `[1, 2, 3, 4]`. Four values, so the median is the average of the two middle ones, (2 + 3) / 2 = 2.5. The answer is not always an integer, which is why the return type is `double`.

**What the problem statement guarantees**

- 0 ≤ m ≤ 1000 and 0 ≤ n ≤ 1000, so either array may be empty.
- 1 ≤ m + n ≤ 2000, so the two are never both empty.
- −10^6 ≤ every value ≤ 10^6.
- Both arrays are sorted in non-decreasing order.
- The overall running time must be O(log(m + n)).

## 2. Practice first: try it before reading on

This is a famous hard problem because the obvious solution is easy and the required one is fiddly. The interview value is in deriving the fast solution rather than remembering it, and in getting the boundaries right when an array is empty or one side runs out.

**How to practise**

1. Set a timer for 40 minutes and talk out loud.
2. Write the linear solution first, in a few lines. Make sure it handles an empty array and an even total.
3. Then stop thinking about the median and think about the smallest half of all the values. Which elements of `nums1` can be in it? Which of `nums2`?
4. Code your faster idea and trace it on Example 1, Example 2, `nums1 = []`, `nums2 = [2, 3]`, and `nums1 = [7, 8]`, `nums2 = [1, 2, 3, 4]`.
5. Say why your loop always ends, and why it never reads outside either array.

> [!HINT] Hint 1: a small nudge
> The median splits all the values into a lower half and an upper half, with every value in the lower half at most every value in the upper half. Because each array is sorted, the lower half takes a prefix of `nums1` and a prefix of `nums2`. If you knew how many elements came from `nums1`, how many would come from `nums2`?

> [!HINT] Hint 2: the kind of tool you need
> Call the number taken from `nums1` i. The size of the lower half is fixed, so the number taken from `nums2` is determined by i. You can check a guess for i with two comparisons across the cut, and if the guess is wrong, one of those comparisons tells you whether i is too big or too small. A guess you can check, that also says which way to move, is the setting for halving a range of candidates.

> [!HINT] Hint 3: almost the whole plan
> Let the lower half have h = ⌊(m + n + 1) / 2⌋ elements and search i from 0 to m, with j = h − i. The cut is right when `nums1[i - 1] ≤ nums2[j]` and `nums2[j - 1] ≤ nums1[i]`. If `nums1[i - 1]` is too big, move i down; if `nums2[j - 1]` is too big, move i up. Treat a missing neighbour (index −1 or past the end) as minus or plus infinity. Search over the shorter array so that j never leaves `0..n`. Then the median is the largest value of the lower half, or for an even total its average with the smallest value of the upper half.

**Check yourself before revealing the walkthrough**

- [ ] My code returns `2.0` for Example 1 and `2.5` for Example 2
- [ ] It returns `2.5` for `[]` and `[2, 3]`, and `3.5` for `[7, 8]` and `[1, 2, 3, 4]`
- [ ] It never divides two `int`s where it means to get a `double`
- [ ] I can say why the loop cannot run forever and why every index it reads is in range

## 3. Interview script: understand the problem (≈3 min)

**Me:** So I have two sorted arrays and I return the median of their union, counting duplicates, as a double. For an odd total it's the middle element, for an even total the mean of the two middle ones?

**Interviewer:** Yes.

**Me:** Can either array be empty?

**Interviewer:** Either one, but not both. Each has up to 1000 elements.

**Me:** So I have to handle m = 0 and n = 0 without special-casing myself into a bug. Values?

**Interviewer:** Between minus a million and a million. Duplicates are allowed, within and across the arrays.

**Me:** Then the sum of two values is at most two million in absolute value, so I can add the two middle values in an `int` before dividing. And the time limit?

**Interviewer:** O(log(m + n)).

**Me:** That rules out merging, which reads up to half of everything. Let me do one by hand so I know what I'm computing: `nums1 = [1, 7, 12, 13]`, `nums2 = [2, 3, 4, 6, 8, 11]`. Merged: `1, 2, 3, 4, 6, 7, 8, 11, 12, 13`. Ten values, so the median is the mean of the 5th and 6th, 6 and 7: 6.5. Notice the lower five values are `1` from `nums1` and `2, 3, 4, 6` from `nums2`: a prefix of each array. That's what sorted inputs buy me.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| Both arrays sorted, non-decreasing | The k smallest values of the union are always a prefix of `nums1` plus a prefix of `nums2`. Every faster approach is built on that. Ties must not break it, so comparisons use `≤` where it matters. |
| 0 ≤ m, n ≤ 1000, 1 ≤ m + n | An empty array is a normal input: every index read must be guarded. The median always exists. |
| −10^6 ≤ values ≤ 10^6 | The sum of the two middle values is within ±2·10^6, far inside `int`. Sentinels of `Integer.MIN_VALUE` and `Integer.MAX_VALUE` are strictly outside the value range, so they never tie with a real value (and are never added; see section 9). |
| O(log(m + n)) required | Merging is the baseline only. The answer must discard a constant fraction of the candidates per step. |
| Return type `double` | The even case needs a real division: `/ 2.0`, never `/ 2` on `int`s. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Duplicates count separately | `[2, 2, 2]` and `[2, 2]` have five values, median 2. The partition argument must allow equal values on both sides of the cut. |
| Either array may be empty | After putting the shorter array first, an empty array is always `nums1`, and the search range for i is just `{0}`. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The inputs are read-only | No approach here modifies them; the tests check that. |
| Time is measured in element reads and comparisons | That is the model in which "O(log(m + n))" and the lower bound in section 9 make sense. |

### Edge cases I will keep in mind

- One array empty, with an odd total (`[]`, `[1]`) and an even total (`[]`, `[2, 3]`).
- Every element of `nums1` belongs in the lower half (`[1, 2]`, `[3, 4, 5, 6]`), or none of them does (`[7, 8]`, `[1, 2, 3, 4]`).
- All values equal, and duplicates straddling the cut.
- Negative values, where the median is negative and not a whole number (`[-1]`, `[0]` gives −0.5).
- A two-value total whose average is a half (`[1]`, `[2]` gives 1.5): the integer-division trap.
- Values at ±10^6, where the two middle values add up to ±2·10^6.

## 4. Think out loud: from first idea to best solution

Throughout: **m** and **n** are the lengths of `nums1` and `nums2`, and **T = m + n** is the total. Positions in the merged order are counted from 1 when I say "the k-th smallest". The running example is `nums1 = [1, 7, 12, 13]`, `nums2 = [2, 3, 4, 6, 8, 11]`, whose median is 6.5.

### Approach 1: Merge, then pick the middle

#### What I say out loud

> "The straightforward way: merge the two sorted arrays the way merge sort does, with two pointers, and read the middle of the result. That's O(m + n) time and space. It doesn't meet the log requirement, but it's certainly correct, it handles empty arrays for free, and it's the reference I'll test the fast version against."

#### Intuition

The median is defined on the merged order, so build the merged order. Two sorted arrays merge in one pass: the smaller of the two front elements is the next smallest overall.

#### Algorithm

1. Allocate `merged` of length T. Keep pointers `i` into `nums1` and `j` into `nums2`.
2. While both have elements left, copy the smaller front element (taking from `nums1` on a tie) and advance its pointer.
3. Copy whatever is left of either array.
4. If T is odd, return `merged[T / 2]`. Otherwise return `(merged[T / 2 - 1] + merged[T / 2]) / 2.0`.

#### Why it is correct

After each copy, `merged[0..k-1]` holds the k smallest values of the union in order: the next smallest value overall must be the front of one of the arrays, because everything behind a front element is at least as large. When one array runs out, the rest of the other is already in order and at least everything copied. So `merged` is the sorted union, and the median is read from its definition. With 0-based indices, the middle of an odd T is `T / 2`; for an even T the two middle positions are `T / 2 - 1` and `T / 2`.

#### Dry run

`nums1 = [1, 7, 12, 13]`, `nums2 = [2, 3, 4, 6, 8, 11]`

| Step | Fronts compared | Copied | `merged` so far |
|---|---|---|---|
| 1 | 1 vs 2 | 1 (`nums1`) | 1 |
| 2 | 7 vs 2 | 2 | 1, 2 |
| 3 | 7 vs 3 | 3 | 1, 2, 3 |
| 4 | 7 vs 4 | 4 | 1, 2, 3, 4 |
| 5 | 7 vs 6 | 6 | 1, 2, 3, 4, 6 |
| 6 | 7 vs 8 | 7 (`nums1`) | …, 6, 7 |
| 7 | 12 vs 8 | 8 | …, 7, 8 |
| 8 | 12 vs 11 | 11 | …, 8, 11 (`nums2` is used up) |
| 9–10 | – | 12, 13 | 1, 2, 3, 4, 6, 7, 8, 11, 12, 13 |

T = 10 is even: `(merged[4] + merged[5]) / 2.0 = (6 + 7) / 2.0 = 6.5`.

#### Java code

```java title="Approach 1: merge, then pick the middle"
class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        int m = nums1.length, n = nums2.length, total = m + n;
        int[] merged = new int[total];
        int i = 0, j = 0, k = 0;
        while (i < m && j < n) {
            merged[k++] = nums1[i] <= nums2[j] ? nums1[i++] : nums2[j++];
        }
        while (i < m) merged[k++] = nums1[i++];
        while (j < n) merged[k++] = nums2[j++];
        if (total % 2 == 1) return merged[total / 2];
        return (merged[total / 2 - 1] + merged[total / 2]) / 2.0;   // a double division
    }
}
```

#### Time complexity

**O(m + n)** in every case: each element is copied once. That breaks the O(log(m + n)) requirement.

#### Space complexity

**O(m + n)** auxiliary space for `merged`. Stopping the merge at position T / 2 and keeping only the last two values copied brings it to O(1) space, with about T / 2 steps, which is still linear.

#### The bridge to the next approach

> "Merging does a lot of work I don't need: it puts every element in its exact place, when I only need the one or two in the middle. I need to throw elements away in bulk. Suppose I want the k-th smallest. If I look at the (k/2)-th element of each array, the smaller of the two, and everything before it in its array, is at most k/2 + k/2 − 1 = k − 1 elements into the merged order. So that whole block is before position k and can be discarded at once. That halves k per step."

### Approach 2: k-th smallest by discarding k / 2 elements at a time

#### What I say out loud

> "I'll write a helper that returns the k-th smallest of the union. The median is the ((T + 1) / 2)-th smallest for odd T, and the average of the (T / 2)-th and (T / 2 + 1)-th for even T. The helper keeps a start index into each array. Each round it compares the element k/2 places into each remaining array, clamped to the array's end, and drops the block with the smaller endpoint, reducing k by the block's size. When an array is exhausted, or k is 1, the answer is direct."

#### Intuition

Think of the merged order as a line. Each array contributes its elements to the line in order. Take the first ⌊k/2⌋ remaining elements of each array. Whichever block ends with the smaller value cannot contain anything at position k or later: there are not enough elements that could come before its last element to push it that far. So discard it and look for the (k − size)-th smallest in what remains.

#### Algorithm

`kth(a, b, k)` with `i = 0`, `j = 0` (the remaining parts are `a[i..]` and `b[j..]`):

1. If `a[i..]` is empty, return `b[j + k - 1]`. If `b[j..]` is empty, return `a[i + k - 1]`.
2. If `k == 1`, return `min(a[i], b[j])`.
3. `step = k / 2`. `ia = min(i + step, a.length) - 1` and `jb = min(j + step, b.length) - 1`: the last index of each block.
4. If `a[ia] <= b[jb]`: discard `a[i..ia]`: `k -= ia - i + 1`, `i = ia + 1`. Otherwise discard `b[j..jb]` the same way.
5. Repeat.

Then the median is `kth(T / 2 + 1)` for odd T, and `(kth(T / 2) + kth(T / 2 + 1)) / 2.0` for even T.

#### Why it is correct

Fix the merged order with ties broken in favour of `a` (an `a` element comes before an equal `b` element). That is one valid sorted order, so its k-th element is the k-th smallest value.

**Invariant:** the answer is the k-th element of the merged order of `a[i..]` and `b[j..]`. Discarding elements that are all before position k, and reducing k by their number, keeps it true.

- **Why the discarded block is safe.** Say `a[ia] <= b[jb]`, with block sizes p = ia − i + 1 ≤ ⌊k/2⌋ and q = jb − j + 1 ≤ ⌊k/2⌋. Which remaining elements come before `a[ia]` in the merged order? From `a`, only `a[i..ia-1]`: p − 1 of them. From `b`, only elements strictly smaller than `a[ia]` (ties go to `a`), and since `a[ia] <= b[jb]` those are all inside `b[j..jb-1]`: at most q − 1. So `a[ia]` is at position at most (p − 1) + (q − 1) + 1 = p + q − 1 ≤ 2⌊k/2⌋ − 1 ≤ k − 1. Every element of the block is at or before `a[ia]`, so all p of them are strictly before position k. The case `a[ia] > b[jb]` is symmetric: then `b[jb] < a[ia]` is strictly smaller, and the same count works.
- **The base cases.** With one side empty, the k-th element is read directly. With k = 1, it is the smaller front (on a tie either is fine, they are equal).
- **Every index is in range.** `k ≤` (elements remaining) is kept by the invariant, so `b[j + k - 1]` exists when `a` is empty. Steps 3–4 only run when both sides are non-empty and k ≥ 2, so `step ≥ 1`, `ia ≥ i` and `jb ≥ j`.
- **Termination.** Each round discards p ≥ 1 elements.

#### Dry run

Running example, T = 10, so I need `kth(5)` and `kth(6)`. `a = nums1 = [1, 7, 12, 13]`, `b = nums2 = [2, 3, 4, 6, 8, 11]`.

`kth(5)`:

| i | j | k | step | Compare | Discard |
|---|---|---|---|---|---|
| 0 | 0 | 5 | 2 | `a[1] = 7` vs `b[1] = 3` | `b[0..1]` = 2, 3; k = 3 |
| 0 | 2 | 3 | 1 | `a[0] = 1` vs `b[2] = 4` | `a[0]` = 1; k = 2 |
| 1 | 2 | 2 | 1 | `a[1] = 7` vs `b[2] = 4` | `b[2]` = 4; k = 1 |
| 1 | 3 | 1 | – | k = 1: `min(a[1], b[3]) = min(7, 6)` | return 6 |

`kth(6)`:

| i | j | k | step | Compare | Discard |
|---|---|---|---|---|---|
| 0 | 0 | 6 | 3 | `a[2] = 12` vs `b[2] = 4` | `b[0..2]`; k = 3 |
| 0 | 3 | 3 | 1 | `a[0] = 1` vs `b[3] = 6` | `a[0]`; k = 2 |
| 1 | 3 | 2 | 1 | `a[1] = 7` vs `b[3] = 6` | `b[3]`; k = 1 |
| 1 | 4 | 1 | – | `min(a[1], b[4]) = min(7, 8)` | return 7 |

Median: `(6 + 7) / 2.0 = 6.5`.

#### Java code

```java title="Approach 2: k-th smallest, discarding k / 2 per round"
class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        int total = nums1.length + nums2.length;
        if (total % 2 == 1) return kth(nums1, nums2, total / 2 + 1);
        return (kth(nums1, nums2, total / 2) + kth(nums1, nums2, total / 2 + 1)) / 2.0;
    }

    /** The k-th smallest (1-based) value of the union of a and b. */
    private static int kth(int[] a, int[] b, int k) {
        int i = 0, j = 0;                                 // a[i..] and b[j..] remain
        while (true) {
            if (i == a.length) return b[j + k - 1];
            if (j == b.length) return a[i + k - 1];
            if (k == 1) return Math.min(a[i], b[j]);
            int step = k / 2;
            int ia = Math.min(i + step, a.length) - 1;    // last index of a's block
            int jb = Math.min(j + step, b.length) - 1;    // last index of b's block
            if (a[ia] <= b[jb]) {
                k -= ia - i + 1;                          // a[i..ia] all come before position k
                i = ia + 1;
            } else {
                k -= jb - j + 1;
                j = jb + 1;
            }
        }
    }
}
```

#### Time complexity

**O(log(m + n))** in every case. In a round where neither block is clamped, p = ⌊k/2⌋ and k drops to ⌈k/2⌉. A clamped block that gets discarded empties its array, and the next round returns. So one `kth` call makes about log₂ k + 2 rounds, with k ≤ T / 2 + 1, and the median needs at most two calls. For T = 2000 that is at most a dozen rounds per call.

#### Space complexity

**O(1)** auxiliary space: the helper is iterative. (A recursive version that passes the start indices uses O(log(m + n)) stack.)

#### The bridge to the next approach

> "This meets the requirement. But it calls the search twice for even totals, and its bound depends on the longer array. Let me look at what the answer really is. The median is about one cut: a lower half of size about T/2. That lower half is a prefix of `nums1` plus a prefix of `nums2`. If I take i elements from `nums1`, I must take h − i from `nums2`, where h is the size of the lower half. So the whole problem is choosing one number, i, between 0 and m. And a wrong i tells me which way to move: if the last element I took from `nums1` is bigger than the first one I left in `nums2`, I took too many from `nums1`. That's a binary search over i, on the shorter array."

### Approach 3: Binary search for the partition of the shorter array (recommended)

#### What I say out loud

> "I'll make `nums1` the shorter array. The lower half has h = (m + n + 1) / 2 elements, so for an odd total it holds the median. I binary search i, the number of `nums1` elements in the lower half, over 0..m, with j = h − i from `nums2`. The four values around the cut are `nums1[i-1]`, `nums1[i]`, `nums2[j-1]`, `nums2[j]`, with minus infinity for a missing left neighbour and plus infinity for a missing right one. If `nums1[i-1] > nums2[j]`, i is too big. If `nums2[j-1] > nums1[i]`, i is too small. Otherwise the cut is right: the median is the larger of the two left values, or for an even total, its average with the smaller of the two right values."

#### Intuition

Imagine drawing one vertical line through each array, splitting each into a left and a right piece. The left pieces together should be exactly the lower half of all values. Inside each array, left is already at most right, because the array is sorted. The only thing that can go wrong is across the arrays: the last left element of one array being bigger than the first right element of the other. And the two lines are tied together: moving the `nums1` line right by one moves the `nums2` line left by one, because the lower half has a fixed size. Moving `nums1`'s line right makes its last left value bigger and `nums2`'s first right value smaller, so "too far right" becomes truer as i grows. That one-directional behaviour is what makes binary search work.

#### Deriving the algorithm

**1. What the median is in terms of a cut.** Let h = ⌈T/2⌉ = ⌊(T + 1) / 2⌋. Split the sorted union into the h smallest values (the lower half) and the remaining T − h (the upper half). For odd T, the median is the largest value of the lower half (position h = (T + 1) / 2). For even T, the two middle values are positions h = T/2 and h + 1, so the median is (max of the lower half + min of the upper half) / 2. Choosing h = ⌈T/2⌉ rather than ⌊T/2⌋ is a convention that puts the odd median on the left; the other convention works if every formula changes with it.

**2. The lower half is two prefixes.** Take the h smallest values with ties broken by array and index. If the lower half contains `nums1[x]`, it contains every `nums1[x']` with x' < x, since those are no larger and come first. So the lower half is `nums1[0..i-1]` plus `nums2[0..j-1]` for some i and j with **i + j = h**. Choosing i fixes j.

**3. The condition for a correct cut.** Two prefixes of total size h form a valid lower half exactly when every left value is at most every right value. Within `nums1`, `nums1[i-1] ≤ nums1[i]` holds because it is sorted; likewise in `nums2`. The cross conditions are what remain, and since the largest left value of each array is its last one and the smallest right value is its first:

- **`nums1[i-1] ≤ nums2[j]`**, and
- **`nums2[j-1] ≤ nums1[i]`**.

**4. Sentinels.** If i = 0, `nums1` contributes nothing to the left and there is no `nums1[i-1]`: the condition involving it holds vacuously, which is what treating it as −∞ does. If i = m, there is no `nums1[i]`: treat it as +∞. The same for j = 0 and j = n. In Java, `Integer.MIN_VALUE` and `Integer.MAX_VALUE` work as −∞ and +∞ because every real value is within ±10^6, so a sentinel always loses the comparison it should lose.

**5. Which way to move.** If `nums1[i-1] > nums2[j]`, the cut took a `nums1` value that is bigger than a `nums2` value it left out: i is too large. Is every larger i also wrong? Increasing i makes `nums1[i-1]` no smaller and decreases j, making `nums2[j]` no larger, so the violation persists. Symmetrically, if `nums2[j-1] > nums1[i]`, i is too small, and every smaller i is wrong too. Both violations cannot happen at once: that would need `nums1[i-1] > nums2[j] ≥ nums2[j-1] > nums1[i]`, contradicting `nums1[i-1] ≤ nums1[i]`. So each probe either succeeds or rules out one side.

**6. Why search the shorter array.** j = h − i must stay within 0..n for every i in 0..m. With m ≤ n: h = ⌊(m + n + 1) / 2⌋ ≥ ⌊(2m + 1) / 2⌋ = m, so j ≥ 0 when i = m; and h ≤ ⌊(2n + 1) / 2⌋ = n, so j ≤ n when i = 0. If `nums1` were the longer array, small i would need j > n, an index past the end of `nums2`. Searching the shorter array also gives the better bound: log of m + 1 candidates.

**7. Empty arrays.** After the swap, an empty array is always `nums1`, so m = 0: the range is `{0}`, i = 0, j = h, both `nums1` neighbours are sentinels, and the cut is valid at once. The median then comes from `nums2` alone. n = 0 with m > 0 cannot happen after the swap.

#### Algorithm

1. If `nums1` is longer than `nums2`, swap them (call again with the arguments reversed).
2. `h = (m + n + 1) / 2`, `lo = 0`, `hi = m`.
3. While `lo <= hi`:
   1. `i = (lo + hi) >>> 1`, `j = h - i`.
   2. Read `aLeft`, `aRight`, `bLeft`, `bRight` with sentinels.
   3. If `aLeft > bRight`: `hi = i - 1`.
   4. Else if `bLeft > aRight`: `lo = i + 1`.
   5. Else: `leftMax = max(aLeft, bLeft)`. If T is odd return `leftMax`; else return `(leftMax + min(aRight, bRight)) / 2.0`.
4. Unreachable for sorted input (throw).

#### Why it is correct

**A valid i exists.** Step 2 of the derivation built one: the count of `nums1` elements among the h smallest values.

**Invariant:** at least one valid i lies in `[lo, hi]`. Initially the range is all of 0..m. When `aLeft > bRight`, every i' ≥ i is invalid (step 5), so the valid ones are below i and `hi = i - 1` keeps them. When `bLeft > aRight`, every i' ≤ i is invalid, and `lo = i + 1` keeps the valid ones. Since the range always contains a valid i, it is never empty, so the loop returns from step 3.5 and never falls through. Each update shrinks the range by at least one, so it ends.

**The returned value is the median.** At a valid cut, the left pieces are h values that are all at most all right values, so they are exactly the h smallest values as a multiset. Their maximum is the h-th smallest value and the minimum of the right pieces is the (h + 1)-th, whichever valid i was found. With duplicates there can be several valid i; they all give the same two values.

**The sentinels never reach the result.** The lower half has h ≥ 1 elements, so at least one of i and j is positive, and `leftMax` is a real value. For even T the upper half has T/2 ≥ 1 elements, so `rightMin` is real too. So `leftMax + rightMin` adds two real values: no sentinel arithmetic, no overflow.

**The 30-second version to say to the interviewer:**

> "The lower half of the merged values is a prefix of each array, and its size h is fixed, so choosing i elements from the shorter array forces h − i from the other. A choice is right exactly when the two cross pairs are in order: `nums1[i-1] ≤ nums2[j]` and `nums2[j-1] ≤ nums1[i]`. If the first fails, every larger i fails too, so I go left; if the second fails, I go right. Missing neighbours are infinities. Searching the shorter array keeps j in range. At the right cut the median is the max of the left side, or its average with the min of the right side."

#### Dry run

Running example: `nums1 = [1, 7, 12, 13]` is already the shorter (m = 4, n = 6). T = 10, h = 5.

| lo | hi | i | j | aLeft | aRight | bLeft | bRight | Check | Update |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 4 | 2 | 3 | 7 | 12 | 4 | 6 | 7 > 6: too many from `nums1` | `hi = 1` |
| 0 | 1 | 0 | 5 | −∞ | 1 | 8 | 11 | 8 > 1: too few from `nums1` | `lo = 1` |
| 1 | 1 | 1 | 4 | 1 | 7 | 6 | 8 | 1 ≤ 8 and 6 ≤ 7 | valid |

Lower half: `[1]` from `nums1` and `[2, 3, 4, 6]` from `nums2`. T is even: `leftMax = max(1, 6) = 6`, `rightMin = min(7, 8) = 7`, return `(6 + 7) / 2.0 = 6.5`. The first row shows a probe that goes left and the second one that goes right; the second also uses a sentinel.

#### Java code

```java title="Approach 3: binary search for the partition (recommended)"
class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1); // search the shorter
        int m = nums1.length, n = nums2.length;
        int half = (m + n + 1) / 2;                 // size of the lower half
        int lo = 0, hi = m;                         // i = how many nums1 values go to the lower half
        while (lo <= hi) {
            int i = (lo + hi) >>> 1;
            int j = half - i;                       // 0 <= j <= n because m <= n
            int aLeft = i == 0 ? Integer.MIN_VALUE : nums1[i - 1];
            int aRight = i == m ? Integer.MAX_VALUE : nums1[i];
            int bLeft = j == 0 ? Integer.MIN_VALUE : nums2[j - 1];
            int bRight = j == n ? Integer.MAX_VALUE : nums2[j];
            if (aLeft > bRight) {
                hi = i - 1;                         // took too many from nums1
            } else if (bLeft > aRight) {
                lo = i + 1;                         // took too few from nums1
            } else {
                int leftMax = Math.max(aLeft, bLeft);
                if ((m + n) % 2 == 1) return leftMax;
                int rightMin = Math.min(aRight, bRight);
                return (leftMax + rightMin) / 2.0;  // |sum| <= 2 * 10^6: no overflow
            }
        }
        throw new IllegalArgumentException("the input arrays are not sorted");
    }
}
```

#### Time complexity

**O(log min(m, n))** in every case, which is within the required O(log(m + n)). The search range has m + 1 candidates with m = min(m, n), and each probe at least halves it, so there are at most ⌊log₂(m + 1)⌋ + 1 probes: 10 for m = 1000. Each probe does a constant amount of work. The swap is one extra call, not a copy.

#### Space complexity

**O(1)** auxiliary space. The swap recurses at most once.

### Alternative: count the elements at most a value, and binary search on the value

Binary search the answer value v in [−10^6, 10^6]: count the elements ≤ v in each array with two lower-bound searches, and find the smallest v whose count reaches the target rank. That is O(log(range) · log(m + n)): about 21 rounds over the value range, each with two lower-bound searches of about 10 probes, which is fine in practice but does not meet the stated O(log(m + n)), since the range of values is not a function of the input size. It is worth knowing because it generalises: it works for the k-th smallest across many sorted arrays or a sorted matrix, where the partition trick does not. See [[a3-lower-upper-bounds|lower and upper bounds]].

## 5. Comparison table

m, n are the array lengths, T = m + n. Nothing is hashed or randomized, so expected and worst-case times agree.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Merge, then pick | O(m + n) | O(m + n) | O(m + n), or O(1) if the merge stops at the middle |
| 2. k-th smallest, discard k/2 | O(log(m + n)) | O(log(m + n)) | O(1) |
| 3. Partition search on the shorter array | O(log min(m, n)) | O(log min(m, n)) | O(1) |
| Alt. Binary search on the value | O(log(V) · log(m + n)), V = value range | same | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Merge | Correct by inspection; no edge-case risk | Linear; fails the requirement | As the baseline you state first, and as a test reference |
| 2. k-th smallest | Solves the more general k-th problem; the discard argument is short | Two calls for even totals; clamping at array ends is fiddly | When the interviewer asks for the k-th smallest, not just the median |
| 3. Partition | Best bound; one search; no recursion | Four boundary values and sentinels to get right; the swap is essential | The answer to give for the median |
| Alt. Value search | Generalises to many arrays and matrices | Depends on the value range; slower | When the structure is not two arrays |

## 6. Which solution to give, and when to stop optimizing

Give Approach 3. Open with the merge in one sentence so the interviewer knows you have a correct baseline. Then reframe: "the median is a cut through both arrays", derive the two cross conditions, and say which way each violation moves i. Spend your words on three things: why j is determined by i, why the search runs over the shorter array, and why the sentinels never get added.

Approach 2 is a respectable answer if the partition does not come to you; it meets the requirement and its correctness argument is shorter. If you are already halfway into it, finish it rather than switch.

O(log min(m, n)) is the end of the road for this problem. In the comparison model, each of the m + 1 values of i (with m the shorter length) can lead to a different median, and a comparison has two outcomes, so a decision-tree argument gives a worst-case lower bound of about log₂(m + 1) comparisons, which Approach 3 matches. Stop once you have traced an empty array, an even total and a case where the probe moves both ways.

## 7. Interview script: code it and test it

### What I say while coding

> "First line: if `nums1` is the longer one, call myself with them swapped. That's what keeps j in range, so it's not optional."

> "`half = (m + n + 1) / 2`: the lower half gets the extra element when the total is odd, so the odd median is the max of the left side."

> "`lo = 0`, `hi = m`, inclusive: i can be 0 (no `nums1` values on the left) or m (all of them). That's m + 1 candidates, not m."

> "The four neighbours, with `MIN_VALUE` and `MAX_VALUE` for missing ones. Values are at most a million in size, so the sentinels never tie with real values."

> "Left value of `nums1` too big: `hi = i - 1`. Left value of `nums2` too big: `lo = i + 1`. Otherwise I'm done."

> "Even total: `(leftMax + rightMin) / 2.0`, with `2.0` so it's a double division. The sum is at most two million in size, so the `int` addition is safe."

### Testing out loud

**Normal case:** the running example, traced in the dry run: three probes, 6.5.

**First probe already right:** `[1, 4, 7, 9]`, `[2, 3, 5, 8, 10, 12]`, h = 5. i = 2, j = 3: aLeft = 4, aRight = 7, bLeft = 5, bRight = 8. 4 ≤ 8 and 5 ≤ 7, valid. Even: `(max(4, 5) + min(7, 8)) / 2.0 = 6.0`.

**Odd total:** `[3, 8, 9]`, `[1, 2, 4, 5, 6, 7]`, h = 5. i = 1, j = 4: aLeft = 3, aRight = 8, bLeft = 5, bRight = 6. Valid. Odd: return `max(3, 5) = 5`.

**m = 0:** `[]`, `[1]`. m = 0, h = 1, i = 0, j = 1: aLeft = −∞, aRight = +∞, bLeft = 1, bRight = +∞. Valid, odd: 1.

**n = 0:** `[5]`, `[]`. Swapped to `[]`, `[5]`, which is the case above: 5.

**One array empty, even total:** `[]`, `[2, 3]`. h = 1, i = 0, j = 1: bLeft = 2, bRight = 3, both `nums1` values are sentinels. `(max(−∞, 2) + min(+∞, 3)) / 2.0 = 2.5`. The sentinels were compared, never added.

**All of `nums1` on the left:** `[1, 2]`, `[3, 4, 5, 6]`, h = 3. i = 1, j = 2: bLeft = 4 > aRight = 2, so `lo = 2`. i = 2, j = 1: aLeft = 2, aRight = +∞, bLeft = 3, bRight = 4. Valid. `(max(2, 3) + min(+∞, 4)) / 2.0 = 3.5`. This is the case that needs `hi = m`, not `m - 1`.

**None of `nums1` on the left:** `[7, 8]`, `[1, 2, 3, 4]`, h = 3. i = 1, j = 2: aLeft = 7 > bRight = 3, so `hi = 0`. i = 0, j = 3: aLeft = −∞, aRight = 7, bLeft = 3, bRight = 4. Valid. `(3 + min(7, 4)) / 2.0 = 3.5`.

**All equal:** `[2, 2, 2]`, `[2, 2]`. Swapped to `[2, 2]`, `[2, 2, 2]`, h = 3. i = 1, j = 2: all four neighbours are 2, and `2 > 2` is false both times, so the cut is valid at once. Odd: 2. Equal values across the cut are fine because the conditions use `≤`.

**Negatives and a half:** `[-1]`, `[0]`, h = 1. i = 0, j = 1: aLeft = −∞, aRight = −1, bLeft = 0, bRight = +∞. bLeft = 0 > aRight = −1, so `lo = 1`. i = 1, j = 0: aLeft = −1, aRight = +∞, bLeft = −∞, bRight = 0. Valid. `(−1 + 0) / 2.0 = −0.5`.

**Value extremes:** `[1000000]`, `[1000000]`: the sum is 2,000,000, well inside `int`, and the result is 1,000,000.0.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 3 min | Empty arrays, duplicates, value range, the log requirement |
| Baseline | 2 min | The merge in two sentences, with its cost |
| Derive | 8–10 min | Lower half = two prefixes; i determines j; the two cross conditions; which way to move |
| Edge decisions | 3 min | Shorter array, `hi = m`, sentinels, h = ⌊(T + 1)/2⌋ |
| Code | 7–8 min | About 20 lines; say each boundary decision as you type it |
| Test | 6–7 min | The running example, an empty array, all-left, all-right, a half |
| Follow-ups | rest | k-th smallest, many arrays, streaming |

The derivation is where the interview is won. Interviewers will forgive a slow start on the code if you can say why the cut condition is what it is. If the partition idea does not come, say "I know how to find the k-th smallest by discarding half of k at a time" and code Approach 2: it meets the requirement. If you get lost in indices, write the four neighbour names on the board and draw the two cut lines.

## 9. Interviewer challenges

### About correctness

#### Why must the binary search run over the shorter array?

**What they are testing:** whether the swap is understood or memorised.

**How to reason:** j = h − i. For which i is j a valid count for `nums2`?

**What I say:** "j has to be between 0 and n for every i I might try. With m ≤ n, h is at least m and at most n, so j stays in range for every i from 0 to m. If I searched the longer array, small i would need more than n elements from the shorter one. On `[1, 2, 3, 4, 5]` and `[6]` without the swap, the first probe moves right and the next one computes j = −1, which throws an `ArrayIndexOutOfBoundsException`. It's also faster: log of the shorter length."

**Nuance:** you could instead clamp the search range to `max(0, h − n) .. min(m, h)` and search either array. That is correct, but the swap is one line and easier to defend.

#### Why `hi = m` and not `m - 1`?

**What they are testing:** whether the search range is the set of answers, not the set of indices.

**How to reason:** i is a count, not an index.

**What I say:** "i is how many `nums1` elements go left, so it ranges over 0 to m inclusive, m + 1 values. i = m means all of `nums1` is on the left, which is the answer for `[1, 2]` and `[3, 4, 5, 6]`. With `hi = m - 1` that answer is outside the range: both probes move right, the range empties, and the code reaches the `throw` after the loop."

**Nuance:** with the `throw` after the loop, that bug surfaces as an exception on sorted input instead of a silent wrong answer; another reason to write the loop as `while (lo <= hi)` rather than `while (true)`.

#### What happens with duplicates? Can there be more than one valid i?

**What they are testing:** whether the argument depends on distinct values.

**How to reason:** run `[2, 2]`, `[2, 2, 2]`. Which i are valid?

**What I say:** "Yes, with equal values several cuts can be valid; for all twos, every i is. That's fine: any valid cut puts exactly h values on the left with everything left at most everything right, so its maximum is the h-th smallest value and the right minimum is the (h + 1)-th, whichever cut I land on. The conditions use `≤`, I only move when one is strictly violated, so equal values across the cut don't cause movement."

**Nuance:** the monotonicity in the derivation (step 5) uses "no smaller" and "no larger", not "strictly", so it holds with duplicates.

#### Can the sentinels end up in the answer, or overflow the sum?

**What they are testing:** care at the boundaries.

**How to reason:** how big are the two halves?

**What I say:** "No. The lower half has h ≥ 1 elements because the total is at least 1, so at least one of the two left neighbours is real, and `leftMax` is real. For an even total the upper half has T/2 ≥ 1 elements, so `rightMin` is real. So the sum adds two real values, each at most a million in size: at most two million, far below 2^31 − 1 ≈ 2.1 billion."

**Nuance:** if values could reach `Integer.MAX_VALUE`, the sentinels would tie with real values and the sum could overflow. Then use `long` neighbours with `Long.MIN_VALUE`/`Long.MAX_VALUE`, and add as `long` or compute `a / 2.0 + b / 2.0`.

### About arithmetic

#### Is `(a + b) / 2.0` exact? Could the double be slightly off?

**What they are testing:** whether you know when floating point is safe.

**How to reason:** which numbers can a `double` represent exactly?

**What I say:** "It's exact here. `a + b` is an integer of at most 2·10^6 in size, and a double holds every integer up to 2^53 exactly, so the conversion loses nothing. Dividing by 2.0 gives either an integer or an integer plus a half, which a double represents exactly too (it only needs one more bit below the point), and IEEE division returns the exact result when it is representable. So the median is computed with no rounding at all, and the tests compare with `==`."

**Nuance:** writing `/ 2` instead of `/ 2.0` is a real bug: integer division truncates toward zero, so `[1]`, `[2]` returns 1.0 instead of 1.5, and `[-1]`, `[0]` returns 0.0 instead of −0.5.

### About complexity

#### Your code is O(log min(m, n)). The problem asked for O(log(m + n)). Is that a problem, and can you do better?

**What they are testing:** whether you can compare bounds and argue a lower bound.

**How to reason:** log min(m, n) ≤ log(m + n). For the lower bound, count distinguishable outcomes.

**What I say:** "It's better than asked: min(m, n) ≤ m + n. And it's optimal in the comparison model. Fix a long `nums2` and vary where the m values of `nums1` interleave with it: each of the m + 1 possible counts of `nums1` values in the lower half can make a different element the median. A comparison has two outcomes, so any comparison-based algorithm needs about log₂(m + 1) comparisons in the worst case."

**Nuance:** this is a decision-tree sketch, not a full proof; it shows why you should not hunt for an O(1) trick. When one array is empty, the median is read directly in O(1), which matches log₂(0 + 1) = 0.

#### Approach 2 also says O(log(m + n)). Why prefer the partition?

**What they are testing:** whether you compare real costs, not just big-O.

**How to reason:** count calls and rounds.

**What I say:** "Both meet the requirement. The k-th approach needs two searches for an even total and its rounds depend on the total length, about log₂ of T/2 each. The partition does one search over the shorter array and finishes with both middle values at once. It's also one loop with no helper. Approach 2 is the better tool when the question is the k-th smallest for arbitrary k."

**Nuance:** the even case of Approach 2 can be done in one search by finding the k-th and then taking the smaller of the next candidates in each array, but that adds more boundary code.

## 10. Follow-up questions the interviewer might ask

**"Return the k-th smallest element of the union instead."**
Approach 2 as written: O(log k) rounds. The partition approach also adapts: use h = k instead of ⌈T/2⌉ and restrict i to `max(0, k − n) .. min(m, k)`; the answer is `leftMax`.

**"What if there are k sorted arrays?"**
The partition trick does not extend cleanly. Binary search on the value (the alternative in section 4): count elements ≤ v in each array with a lower-bound search, O(k log n) per count, O(k log n log V) in total, where V is the value range. Or merge with a heap until the middle, O(T log k): the idea of [[nc-merge-k-sorted-lists|Merge K Sorted Lists]].

**"The values arrive one at a time and you must report the median after each."**
Two heaps: a max-heap for the lower half and a min-heap for the upper half, kept within one element of each other. O(log n) per insertion, O(1) per query. That is [[nc-find-median-from-data-stream|Find Median from Data Stream]].

**"What if the arrays were huge and on disk?"**
Approach 3 still reads only about 4 log₂ min(m, n) values, at random positions; that is ideal for random-access storage. A merge would read half the data sequentially.

**"What if the values could be anywhere in the `int` range?"**
The sentinels could tie with real values, and the sum could overflow. Use `long` for the neighbours, `Long.MIN_VALUE`/`Long.MAX_VALUE` as sentinels, and `((long) a + b) / 2.0`. The sum of two `int`s fits in a `long` and is below 2^53 in size, so the result is still exact.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Searching for the median value directly.** The median is not "the middle of `nums1`" or "the middle of `nums2`"; comparing the two medians and discarding halves is a classic method for equal lengths, but it gets fiddly with unequal lengths and parity. Searching the cut is cleaner.
- **Thinking the cut needs four conditions.** The within-array conditions are free because each array is sorted. Only the two cross conditions matter.
- **Believing the answer is unique when the cut is.** With duplicates the cut may not be unique, but the median is. Do not add tie-breaking code.
- **Treating empty arrays as a special case.** After the swap and with sentinels, m = 0 runs through the same code.

### Implementation mistakes

> [!MISTAKE] Integer division in the even case
> `(leftMax + rightMin) / 2` divides two `int`s and truncates toward zero: `[1]`, `[2]` returns 1.0 instead of 1.5, and `[-1]`, `[0]` returns 0.0 instead of −0.5. Write `/ 2.0`.

> [!MISTAKE] Forgetting to search the shorter array
> Without the swap, `[1, 2, 3, 4, 5]`, `[6]` makes the second probe compute j = −1 and throws `ArrayIndexOutOfBoundsException: Index -2 out of bounds for length 1`.

> [!MISTAKE] Mixing the two conventions for the half size
> With `half = (m + n) / 2` the odd median is the smallest value of the upper half, not the largest of the lower. Keeping `return leftMax` for odd totals then returns 1.0 for `[1, 3]`, `[2]` instead of 2.0.

- **`hi = m - 1`.** i is a count from 0 to m; the all-left cut (`[1, 2]`, `[3, 4, 5, 6]`) becomes unreachable.
- **Sentinels inside the value range,** such as 0 or −1, when values can be negative. Use values strictly outside the allowed range.
- **In Approach 2, not clamping the block to the array's end.** `i + k/2 - 1` can be past the end of a short array; clamp with `Math.min(i + step, a.length) - 1` and subtract the real block size from k, not k/2.
- **In Approach 2, mixing 0-based and 1-based k.** The base case `b[j + k - 1]` is only right if k is 1-based throughout.

## 12. Pattern recognition

**The pattern:** binary search over a split point. When the answer is defined by "how many elements come from each part", one count determines the rest, and a wrong count says which way to move, binary search the count rather than the values.

**Signals in the problem statement:**

- Two sorted inputs and an order statistic (median, k-th smallest).
- A required bound logarithmic in the input size, which rules out reading most elements.
- An answer defined by a balance between two sides.

**Related problems in this list:**

- [[nc-merge-sorted-array|Merge Sorted Array]]: the two-pointer merge of Approach 1.
- [[nc-binary-search|Binary Search]]: the basic `lo <= hi` loop and its invariant.
- [[nc-find-minimum-in-rotated-sorted-array|Find Minimum In Rotated Sorted Array]]: binary search for a boundary defined by a comparison, not a target.
- [[nc-split-array-largest-sum|Split Array Largest Sum]]: binary search where the thing searched is a property of a split.
- [[nc-kth-largest-element-in-array|Kth Largest Element in an Array]]: the k-th order statistic of one unsorted array, by quickselect or a heap.
- [[nc-find-median-from-data-stream|Find Median from Data Stream]]: the median when values arrive over time.

**Takeaway:** the median of two sorted arrays is a cut through both. Pick how many elements the shorter array puts on the left, and the two cross comparisons tell you whether you picked too many, too few or exactly right.

## 13. 60-second revision card

**Key insight:** the lower half (h = ⌊(m + n + 1)/2⌋ values) is a prefix of each array. Choosing i from the shorter `nums1` forces j = h − i from `nums2`.

**Invariant:** a valid i lies in `[lo, hi]`, starting from `[0, m]`. Valid means `nums1[i-1] ≤ nums2[j]` and `nums2[j-1] ≤ nums1[i]`, with ±∞ for missing neighbours. First fails: `hi = i - 1`. Second fails: `lo = i + 1`.

**Complexity:** O(log min(m, n)) time, O(1) space; optimal in the comparison model.

**Code skeleton:**

```java title="Partition search" fragment="public double findMedianSortedArrays(int[] nums1, int[] nums2)"
if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
int m = nums1.length, n = nums2.length, half = (m + n + 1) / 2;
int lo = 0, hi = m;
while (lo <= hi) {
    int i = (lo + hi) >>> 1, j = half - i;
    int aL = i == 0 ? Integer.MIN_VALUE : nums1[i - 1], aR = i == m ? Integer.MAX_VALUE : nums1[i];
    int bL = j == 0 ? Integer.MIN_VALUE : nums2[j - 1], bR = j == n ? Integer.MAX_VALUE : nums2[j];
    if (aL > bR) hi = i - 1;
    else if (bL > aR) lo = i + 1;
    else if ((m + n) % 2 == 1) return Math.max(aL, bL);
    else return (Math.max(aL, bL) + Math.min(aR, bR)) / 2.0;
}
// unreachable for sorted input: a valid i always exists
```

**Main traps:**

- Not swapping: j leaves `0..n`.
- `hi = m - 1`: the all-left cut is lost.
- `/ 2` instead of `/ 2.0`.
- The half-size convention and the odd-case formula must match.

**What to say in one breath:** "The lower half of the merged values is a prefix of each array with fixed total size, so I binary search how many come from the shorter array; the two cross comparisons say too many, too few or right, sentinels handle empty sides, and the median is the left max or its average with the right min: O(log min(m, n)) time, O(1) space."
