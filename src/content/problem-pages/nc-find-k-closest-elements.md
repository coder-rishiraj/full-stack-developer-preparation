---
problemId: nc-find-k-closest-elements
title: Find K Closest Elements
source: neetcode
sourceUrl: https://leetcode.com/problems/find-k-closest-elements/
difficulty: medium
patterns: [sliding-window, binary-search, two-pointers]
relatedLessons: [a2-sliding-window, a3-binary-search, a3-lower-upper-bounds, a3-binary-search-on-answer, a2-two-pointers, a3-comparator-sorting]
companies: []
timeToSolve: 25
---

## 1. Problem restatement

You get an array `arr` sorted in ascending order, an integer `k` and an integer `x`. Return the k elements of `arr` that are closest to `x`, listed in ascending order.

"Closer" is defined precisely: a is closer to x than b if |a − x| < |b − x|, or if |a − x| = |b − x| and a < b. So on a tie in distance, the **smaller value wins**.

**Example 1**

- Input: `arr = [1, 2, 3, 4, 5]`, `k = 4`, `x = 3`
- Output: `[1, 2, 3, 4]`
- Why: the distances are 2, 1, 0, 1, 2. 3, 2 and 4 are the three closest. For the fourth, 1 and 5 are both at distance 2, and 1 wins because it is smaller.

**Example 2**

- Input: `arr = [1, 1, 2, 3, 4, 5]`, `k = 4`, `x = -1`
- Output: `[1, 1, 2, 3]`
- Why: x is below every element, so the closest elements are the smallest ones, and both copies of 1 count.

**What the problem statement guarantees**

- 1 ≤ `k` ≤ `arr.length` ≤ 10^4.
- `arr` is sorted in ascending order (it may contain duplicates, as Example 2 shows).
- −10^4 ≤ `arr[i]`, `x` ≤ 10^4.
- The result must be sorted in ascending order.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. There is a simple solution that ignores the fact that the array is sorted; find it, then find out how much the sortedness buys you.

**How to practise**

1. Set a timer for 25 minutes and talk out loud.
2. Write the simplest correct solution, including the tie rule, and its complexity.
3. Look at where the k answers sit in the sorted array. Are they scattered, or is there a shape?
4. Code your best idea, then trace it on both examples and on `arr = [1, 1, 2, 2, 2, 2, 2, 3, 3]`, `k = 3`, `x = 3` (the answer is `[2, 3, 3]`).
5. Test x below every element, above every element, and k = n.

> [!HINT] Hint 1: a small nudge
> The set of all values within some distance of x is an interval of the number line, and the array is sorted. So the answer is always k consecutive elements of `arr`. The question is only where that block starts.

> [!HINT] Hint 2: the kind of tool you need
> There are n − k + 1 possible starting positions. Compare the block starting at i with the block starting at i + 1: they differ only in `arr[i]` (dropped) and `arr[i + k]` (added). Whether moving right helps is a yes/no question whose answers, as i grows, are "yes" for a while and then "no" forever. That shape can be searched in logarithmic time.

> [!HINT] Hint 3: almost the whole plan
> Search for the start in the range from 0 to n − k. At a midpoint m, compare `x - arr[m]` with `arr[m + k] - x`, without absolute values. If the first is strictly larger, `arr[m]` is worse than `arr[m + k]`, so the start is to the right of m; otherwise it is at m or to the left. When the range closes, return the k elements from that start. Work out why absolute values break this on the input in step 4.

**Check yourself before revealing the walkthrough**

- [ ] My code returns `[1, 2, 3, 4]` for Example 1 and `[1, 1, 2, 3]` for Example 2
- [ ] It returns `[2, 3, 3]` for `[1, 1, 2, 2, 2, 2, 2, 3, 3]`, k = 3, x = 3
- [ ] It returns `[1, 2]` for `[1, 2, 3]`, k = 2, x = 2 (the tie between 1 and 3 goes to 1)
- [ ] My index arithmetic can never read past the end of the array

## 3. Interview script: understand the problem (≈2 min)

**Me:** I return k elements of the array, the ones closest to x, sorted ascending. On a tie in distance the smaller value is closer?

**Interviewer:** Yes, that's the definition.

**Me:** Is the array sorted, and can it contain duplicates?

**Interviewer:** Sorted ascending. Duplicates are allowed.

**Me:** So if two copies of the same value are both among the closest, I return both. Does x have to be in the array?

**Interviewer:** No. x is any integer between −10^4 and 10^4, and so are the elements.

**Me:** So x can be below or above all of them. And k is between 1 and n, n up to 10^4. All distances are at most 2 × 10^4, so `int` arithmetic is safe everywhere, including sums like `arr[i] + arr[j]`, which are at most 2 × 10^4 in absolute value.

**Me:** By hand on Example 1, `[1, 2, 3, 4, 5]`, k = 4, x = 3: distances 2, 1, 0, 1, 2. Taking the closest first: 3, then 2 and 4, then a tie between 1 and 5 at distance 2, and 1 wins. Sorted: `[1, 2, 3, 4]`. The answer is the first four elements: a contiguous block.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| `arr` sorted ascending | The k closest elements form a contiguous block, so I only need its start. Binary search becomes possible. |
| Duplicates allowed | Equal values have equal distance; any comparison that can't tell "same value" from "equally far on opposite sides" must be checked against runs of duplicates. |
| 1 ≤ k ≤ n ≤ 10^4 | Even O(n log n) is tiny. k = n means returning everything; k = 1 means the single closest element. |
| −10^4 ≤ `arr[i]`, x ≤ 10^4 | Distances are at most 2 × 10^4; no overflow anywhere with `int`. x may lie outside the array's range. |
| Ties go to the smaller value | Every comparison must break ties toward the left element. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| x need not occur in `arr` | I can't search for x itself and stop; I need "where x would go". |
| Duplicates are returned as separate elements | The output is a list of k values, with repeats. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| `arr` may not be modified | Nothing says I may; the solutions below only read it (the sorting approach sorts a copy). |
| The output list's memory is not counted as auxiliary space | It has k entries whatever I do. |

### Edge cases I will keep in mind

- x below every element (Example 2) or above every element: the answer is the first or last k elements.
- k = n: the whole array.
- k = 1: the single closest element, with the tie rule.
- A tie in distance between the two ends of the block (Example 1).
- Long runs of duplicates, especially on the far side of x: `[1, 1, 2, 2, 2, 2, 2, 3, 3]`, k = 3, x = 3.
- x exactly between two elements, such as `[1, 2, 3]` with x = 2 and k = 2.

## 4. Think out loud: from first idea to best solution

Throughout: **n** is the length of `arr`, and **block i** means the k elements `arr[i..i+k-1]`, for i from 0 to n − k.

### Approach 1: Sort by distance

#### What I say out loud

> "The definition gives me an ordering directly: compare by distance to x, then by value. I sort all the elements by that, take the first k, and sort those ascending for the output. O(n log n). It doesn't use the fact that the array is sorted, which is a sign there's something better, but it's correct and it makes the tie rule explicit."

#### Intuition

"The k closest" is "the k smallest under some ordering". Sorting under that ordering and taking a prefix is the most direct reading of the statement.

#### Algorithm

1. Copy `arr` into a list of boxed integers.
2. Sort it with the comparator: smaller |a − x| first; on equal distance, smaller a first.
3. Take the first k, sort them ascending, return them.

#### Why it is correct

The comparator is exactly the statement's definition of "closer", and it is a valid total order on values (equal keys only for equal values, which are interchangeable). After sorting, the first k elements are k elements that no other element is closer than, which is what the problem asks for. Sorting them again produces the required ascending output.

#### Dry run

`arr = [1, 3, 5, 7, 9, 11]`, `k = 3`, `x = 6`

| value | 1 | 3 | 5 | 7 | 9 | 11 |
|---|---|---|---|---|---|---|
| distance | 5 | 3 | 1 | 1 | 3 | 5 |

Sorted by (distance, value): 5, 7, 3, 9, 1, 11. The first three are 5, 7, 3; sorted ascending: `[3, 5, 7]`. The tie between 3 and 9 (both at distance 3) goes to 3.

#### Java code

```java title="Approach 1: sort by (distance, value)"
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class Solution {
    public List<Integer> findClosestElements(int[] arr, int k, int x) {
        List<Integer> all = new ArrayList<>();
        for (int v : arr) {
            all.add(v);
        }
        all.sort((a, b) -> {
            int da = Math.abs(a - x), db = Math.abs(b - x);   // at most 2 * 10^4: no overflow
            return da != db ? Integer.compare(da, db) : Integer.compare(a, b);
        });
        List<Integer> result = new ArrayList<>(all.subList(0, k));
        Collections.sort(result);
        return result;
    }
}
```

#### Time complexity

**O(n log n + k log k) = O(n log n) in every case**: Java's object sort (a merge sort variant) is O(n log n) comparisons in the worst case, each comparison O(1).

#### Space complexity

**O(n) auxiliary space** for the boxed copy, plus the sort's own buffer.

#### The bridge to the next approach

> "In the dry run the answer was 3, 5, 7: neighbours in the array. That's always true. The values within distance d of x form an interval on the number line, and in a sorted array an interval of values is a contiguous block of indices. So the answer is a window of k consecutive elements, and the question is only where it starts. Start with the whole array as the window and shrink it to size k: at each step, the element to throw away must be at one of the two ends, because the ends are the farthest elements on each side."

### Approach 2: Shrink from both ends

#### What I say out loud

> "Two pointers at the ends of the array. While the window holds more than k elements, compare the two ends and remove the one that is farther from x; on a tie, remove the right one, because the smaller value wins. When k elements remain, that's the answer, already sorted. O(n − k) comparisons plus O(k) to copy."

#### Intuition

Inside a sorted window, the farthest element from x is always one of the two ends: everything between them is between them on the number line too, so it can't be farther than both. Removing the worse end n − k times leaves the k best.

#### Algorithm

1. `lo = 0`, `hi = n - 1`.
2. While `hi - lo + 1 > k`:
   - if `x - arr[lo] <= arr[hi] - x` (the left end is at least as close), `hi--`;
   - otherwise `lo++`.
3. Return `arr[lo..hi]`.

#### Why it is correct

**The invariant: the window `arr[lo..hi]` contains a valid answer.** Initially it is the whole array. At each step, compare the ends. Because the array is sorted, every element strictly inside is at least as close to x as the farther end. If the right end is farther (or equally far but larger), then at least `hi - lo` elements in the window are at least as good as it, which is ≥ k since the window has more than k elements; so it is not needed, and dropping it keeps an answer inside the window. The same holds for the left end when it is strictly farther.

**Why `x - arr[lo] <= arr[hi] - x` without absolute values is right here.** Since lo < hi, `arr[lo]` ≤ `arr[hi]`. If x lies between them, both differences are the true distances, and a tie drops the right (larger) end, as the rule says. If both ends are ≥ x, the left difference is ≤ 0 ≤ the right one, so the right end goes; it is at least as far and at least as large. If both ends are < x, the left difference is positive and the right one negative, so the left end goes; it is at least as far, and if it is equally far it has the same value as the right end, so it does not matter which copy is dropped. Absolute values would also work in this approach, because each comparison is between the two current ends; the signed form keeps the same comparison as Approach 3.

#### Dry run

`arr = [1, 3, 5, 7, 9, 11]`, `k = 3`, `x = 6`

| lo | hi | x − arr[lo] | arr[hi] − x | action |
|---|---|---|---|---|
| 0 | 5 | 5 | 5 | tie: drop right, hi = 4 |
| 0 | 4 | 5 | 3 | left is farther: lo = 1 |
| 1 | 4 | 3 | 3 | tie: drop right, hi = 3 |
| 1 | 3 | – | – | size 3 = k: stop |

Returns `[3, 5, 7]`.

#### Java code

```java title="Approach 2: shrink from both ends"
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> findClosestElements(int[] arr, int k, int x) {
        int lo = 0, hi = arr.length - 1;
        while (hi - lo + 1 > k) {
            if (x - arr[lo] <= arr[hi] - x) {   // left end at least as close: the right end goes
                hi--;
            } else {
                lo++;
            }
        }
        List<Integer> result = new ArrayList<>(k);
        for (int i = lo; i <= hi; i++) {
            result.add(arr[i]);
        }
        return result;
    }
}
```

#### Time complexity

**O(n) in every case**: exactly n − k loop iterations, each O(1), then k additions to the output.

#### Space complexity

**O(1) auxiliary space** besides the output list.

#### The bridge to the next approach

> "The shrinking spends n − k steps throwing elements away one at a time. But the answer is fully described by one number, the start of the block, between 0 and n − k. If I could tell, for a candidate start, whether the true start is to its left or its right, I could binary search it. Block i and block i + 1 differ in one element each: block i has `arr[i]`, block i + 1 has `arr[i + k]`. So 'should the block move right from i?' is just 'is `arr[i + k]` better than `arr[i]`?'"

### Approach 3: Binary search for the left edge of the window (recommended)

#### What I say out loud

> "I binary search the start of the window in [0, n − k]. At a midpoint m, I compare `x - arr[m]` with `arr[m + k] - x`. If the first is strictly larger, `arr[m]` is farther than `arr[m + k]`, so the window should start after m: `lo = m + 1`. Otherwise start at m or earlier: `hi = m`. No absolute values, on purpose: with absolute values the search breaks on duplicates. O(log(n − k)) for the search, plus O(k) to build the output."

#### Intuition

Define, for i from 0 to n − k − 1, the question "is block i + 1 better than block i?", which is "is `arr[i + k]` closer than `arr[i]`?". Answered with the signed comparison `x - arr[i] > arr[i + k] - x`, which rearranges to `arr[i] + arr[i + k] < 2x`. Since the array is sorted, `arr[i] + arr[i + k]` never decreases as i grows, so the answers are "yes, yes, …, yes, no, no, …, no". Sliding the block right never makes it worse while the answer is "yes" and never makes it better once it is "no", so the best start is the first "no", and a [[a3-binary-search|binary search]] finds the first "no" in O(log(n − k)) steps. It is a [[a2-sliding-window|fixed-size window]] whose position is found by search instead of by sliding.

#### Algorithm

1. `lo = 0`, `hi = n - k`.
2. While `lo < hi`:
   1. `mid = (lo + hi) >>> 1`.
   2. If `x - arr[mid] > arr[mid + k] - x`, `lo = mid + 1`; else `hi = mid`.
3. Return `arr[lo..lo+k-1]`.

#### Why it is correct

**In bounds.** Inside the loop `mid < hi ≤ n − k`, so `mid + k ≤ n − 1`.

**What the comparison means.** Let p(i) be `x - arr[i] > arr[i + k] - x`, that is, `arr[i] + arr[i + k] < 2x`.

- If p(i) is true: since `arr[i]` ≤ `arr[i + k]` and their sum is below 2x, `arr[i]` < x. If `arr[i + k]` ≥ x, its distance `arr[i + k] - x` is less than `x - arr[i]`, the distance of `arr[i]`: `arr[i + k]` is strictly closer. If `arr[i + k]` < x too, it is at least as close as `arr[i]`, and equally close only when `arr[i + k]` = `arr[i]`, in which case blocks i and i + 1 contain the same values. Either way, block i + 1 is at least as good as block i.
- If p(i) is false: `arr[i] + arr[i + k]` ≥ 2x, so `arr[i + k]` ≥ x, and the same case analysis shows `arr[i]` is at least as close as `arr[i + k]`, with an exact tie in distance resolved in favour of `arr[i]`, the smaller value. Block i is at least as good as block i + 1.

**Monotone.** `arr[i] + arr[i + k]` is non-decreasing in i, so p is true for a prefix of the starts and false afterwards. Starting from block 0, each step right is no worse while p holds, and from the first i where p fails, each step right is no better. So the first start where p fails (or n − k if p never fails) is a best block, and the loop computes exactly that: it keeps the invariant "the first false is in [lo, hi]", moving `lo` past true positions and `hi` down to false ones.

**Why absolute values break it.** With `Math.abs(x - arr[mid]) > Math.abs(arr[mid + k] - x)`, the predicate is no longer monotone when both elements are on the same side of x and equal. Take `arr = [1, 1, 2, 2, 2, 2, 2, 3, 3]`, k = 3, x = 3. The signed predicate is `arr[i] + arr[i + 3] < 6`: for i = 0 to 5 the sums are 3, 3, 4, 4, 4, 5, all true, so the search returns start 6 and `[2, 3, 3]`, the right answer (distances 1, 0, 0). With absolute values, at mid = 3 both sides have distance 1 (`arr[3] = 2`, `arr[6] = 2`), the comparison says "not farther", the search moves left, and it returns start 2: `[2, 2, 2]`. The two 2s at index 3 and 6 are equally far for the same reason, the same value, but the block still had to move right to reach the 3s. The signed version sees that both are below x, so the right one is not worse and the window should keep moving.

**The 25-second version to say to the interviewer:**

> "The answer is k consecutive elements, so I search for the start in 0 to n − k. Moving the block from i to i + 1 swaps `arr[i]` for `arr[i + k]`, and that helps exactly when `x - arr[i] > arr[i + k] - x`, which is `arr[i] + arr[i + k] < 2x`. That sum only grows with i, so the answers are yes then no, and I binary search for the first no. Signed differences, not absolute values, so equal values on the same side don't stop the search early; ties go left, matching the smaller-value rule."

#### Dry run

`arr = [1, 3, 5, 7, 9, 11]`, `k = 3`, `x = 6`, so the start is in [0, 3].

| lo | hi | mid | x − arr[mid] | arr[mid + 3] − x | farther? | update |
|---|---|---|---|---|---|---|
| 0 | 3 | 1 | 6 − 3 = 3 | 9 − 6 = 3 | no (tie) | hi = 1 |
| 0 | 1 | 0 | 6 − 1 = 5 | 7 − 6 = 1 | yes | lo = 1 |
| 1 | 1 | – | – | – | – | stop |

Start 1: returns `[3, 5, 7]`, the same as Approaches 1 and 2.

The duplicates input, `[1, 1, 2, 2, 2, 2, 2, 3, 3]`, k = 3, x = 3, start in [0, 6]:

| lo | hi | mid | x − arr[mid] | arr[mid + 3] − x | farther? | update |
|---|---|---|---|---|---|---|
| 0 | 6 | 3 | 1 | −1 | yes | lo = 4 |
| 4 | 6 | 5 | 1 | 0 | yes | lo = 6 |
| 6 | 6 | – | – | – | – | stop |

Start 6: returns `[2, 3, 3]`.

#### Java code

```java title="Approach 3: binary search for the window start (recommended)"
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> findClosestElements(int[] arr, int k, int x) {
        int lo = 0, hi = arr.length - k;                  // the start of the window is in [0, n - k]
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;                    // mid + k <= n - 1, since mid < hi <= n - k
            if (x - arr[mid] > arr[mid + k] - x) {        // arr[mid] strictly worse: move right
                lo = mid + 1;
            } else {                                      // arr[mid] at least as good (ties keep the smaller)
                hi = mid;
            }
        }
        List<Integer> result = new ArrayList<>(k);
        for (int i = lo; i < lo + k; i++) {
            result.add(arr[i]);
        }
        return result;
    }
}
```

#### Time complexity

**O(log(n − k) + k) in every case**: the search range has n − k + 1 positions and halves each iteration; copying the output is k steps. With k = n the loop does not run at all.

#### Space complexity

**O(1) auxiliary space** besides the output list.

### Alternative: binary search for x, then expand

Find the insertion point of x (the first index with `arr[i] ≥ x`) by binary search, then grow a window outward from there with two pointers, k times, each time taking whichever neighbour is closer (the left one on a tie). That is O(log n + k) time and O(1) extra space, about the same as Approach 3. It reads naturally ("start where x is, take the nearest"), but it has more boundary cases: the insertion point can be 0 or n, and each step must check whether either side has run out. Approach 3 has a single loop with no special cases, which is why it is the one to code; this one is a fine answer if it is the one you think of first, as long as the tie goes left.

## 5. Comparison table

n = length of `arr`. Nothing here is hashed or randomized, so expected and worst-case times agree. The output (k elements) is not counted in auxiliary space.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Sort by (distance, value) | O(n log n) | O(n log n) | O(n) |
| 2. Shrink from both ends | O(n) | O(n) | O(1) |
| 3. Binary search for the window start | O(log(n − k) + k) | O(log(n − k) + k) | O(1) |
| Alt. Binary search for x, then expand | O(log n + k) | O(log n + k) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Sort by distance | Direct reading of the statement; works on unsorted input | Ignores the sortedness; boxing and a comparator | Unsorted input, or as the opening baseline |
| 2. Shrink from both ends | Simple; linear because each step removes one element; easy to prove | O(n) even when k is small | When k is close to n, or as the step between 1 and 3 |
| 3. Binary search for the start | Fastest, short, one loop | The signed comparison is subtle and must be justified | The answer to give |
| Alt. Search x, then expand | Intuitive | More boundary checks | If it is the version you derive first |

## 6. Which solution to give, and when to stop optimizing

Give Approach 3. Get there in the interview by saying the sort-based baseline in a sentence, noting that the answer is a contiguous block (that observation is the heart of the problem), mentioning the two-pointer shrink, and then binary searching the start. The part to spend words on is the comparison: why it is signed, and why ties go left.

O(log(n − k) + k) is optimal up to constants for this output: writing k elements needs Ω(k), and locating the block in a sorted array needs Ω(log(n − k)) comparisons in the worst case in the comparison model, since there are n − k + 1 possible starts and each comparison has two outcomes. With n ≤ 10^4 all three approaches run instantly, so if the interviewer only wants a working answer, Approach 2 is also defensible. Stop once the duplicates case and the tie rule are traced.

## 7. Interview script: code it and test it

### What I say while coding

> "`hi = arr.length - k`, because the window must fit: the last possible start is n − k."

> "`mid + k` is in bounds because `mid < hi`."

> "Strictly greater moves right. Equal stays left, because on a tie the smaller value wins and the left element is the smaller one."

> "Signed differences, not `Math.abs`. I'll show why with duplicates in testing."

### Testing out loud

**Normal case:** `[1, 3, 5, 7, 9, 11]`, k = 3, x = 6, as in the dry run: start 1, `[3, 5, 7]`.

**Tie between the ends (Example 1):** `[1, 2, 3, 4, 5]`, k = 4, x = 3. Start in [0, 1]. mid = 0: `3 - 1 = 2` vs `5 - 3 = 2`, not strictly greater, so `hi = 0`. Start 0: `[1, 2, 3, 4]`. With `>=` it would move to start 1 and return `[2, 3, 4, 5]`, breaking the tie the wrong way.

**x below everything (Example 2):** `[1, 1, 2, 3, 4, 5]`, k = 4, x = −1. Start in [0, 2]. mid = 1: `-1 - 1 = -2` vs `arr[5] - (-1) = 6`, no: `hi = 1`. mid = 0: −2 vs `arr[4] - (-1) = 5`, no: `hi = 0`. `[1, 1, 2, 3]`.

**x above everything:** `[1, 2, 3, 4, 5]`, k = 2, x = 100. Every comparison has `x - arr[mid]` positive and larger than `arr[mid + 2] - x`, which is negative, so the start moves to 3: `[4, 5]`.

**Duplicates on the far side:** `[1, 1, 2, 2, 2, 2, 2, 3, 3]`, k = 3, x = 3: start 6, `[2, 3, 3]`, as traced above.

**x exactly between:** `[1, 2, 3]`, k = 2, x = 2. Start in [0, 1]. mid = 0: `2 - 1 = 1` vs `3 - 2 = 1`, not strictly greater: start 0, `[1, 2]`.

**k = n:** `lo = hi = 0`, the loop does not run, and the whole array is returned.

**k = 1:** `[1, 2, 4, 5]`, x = 3: start in [0, 3]. mid = 1: `3 - 2 = 1` vs `4 - 3 = 1`, tie: `hi = 1`. mid = 0: 2 vs `2 - 3 = -1`: yes, `lo = 1`. `[2]`: 2 and 4 are equally close, and 2 is smaller.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2 min | Tie rule, duplicates, x outside the range, output sorted |
| Baseline | 2 min | Sort by (distance, value); O(n log n) |
| The contiguity observation | 2 min | Values within a distance form an interval, so the answer is a block |
| Two pointers, then binary search | 4–5 min | Shrink from the ends; then search the start with the signed comparison |
| Code | 3 min | One loop, `hi = n - k`, strict `>` |
| Test | 4 min | Example 1 tie, Example 2, duplicates, k = n |
| Follow-ups | rest | Unsorted input, streams |

If the binary search's comparison won't come, code Approach 2: it is linear, easy to prove, and well within the limits for n ≤ 10^4. Then mention that the start could be binary searched.

## 9. Interviewer challenges

### About correctness

#### Why is the answer always a contiguous block?

**What they are testing:** whether you can justify the window rather than assume it.

**How to reason:** what does the set of values "within distance d of x" look like on the number line?

**What I say:** "The k closest elements are all those closer than some threshold, plus some at exactly the threshold distance. The values within a distance of x form an interval of the number line, and in a sorted array the elements inside an interval of values are a contiguous run of indices. At the threshold distance there are at most two values, x − d and x + d, and the tie rule takes the smaller ones first, so the chosen elements are still a contiguous run."

**Nuance:** without sortedness this fails, which is why Approach 1 is the right tool for unsorted input.

#### Why not compare absolute distances in the binary search?

**What they are testing:** the subtle part of the recommended solution.

**How to reason:** for the search to work, the yes/no answers must be "yes … yes, no … no". Check whether the absolute comparison keeps that shape when equal values sit on the same side of x.

**What I say:** "The signed test `x - arr[m] > arr[m + k] - x` is the same as `arr[m] + arr[m + k] < 2x`, and that sum only grows with m, so the predicate is monotone. With absolute values, two equal elements on the same side of x compare as a tie, and the search moves left even though the block should keep moving right. On `[1, 1, 2, 2, 2, 2, 2, 3, 3]`, k = 3, x = 3, the absolute version returns `[2, 2, 2]`; the answer is `[2, 3, 3]`."

**Nuance:** in Approach 2 absolute values are fine, because there each comparison is between the actual current ends, not a probe used to steer a search.

#### Why does a tie go left?

**What they are testing:** whether the tie rule is handled deliberately.

**How to reason:** on a tie, which of `arr[m]` and `arr[m + k]` is smaller?

**What I say:** "If the two are equally far, the left one is the smaller (or the same value), and the statement says the smaller is closer. So on a tie the block should not move right: `hi = mid`. That's why the condition is strictly greater. With `>=`, Example 1 returns `[2, 3, 4, 5]` instead of `[1, 2, 3, 4]`."

**Nuance:** the same rule appears in Approach 2 as `<=` when deciding to drop the right end.

### About complexity

#### Is O(log(n − k) + k) really better than O(n) here?

**What they are testing:** whether you understand when the improvement matters.

**How to reason:** the output alone costs k.

**What I say:** "The search is logarithmic, but I still copy k elements, so when k is close to n both are linear. The gain is when k is small compared to n: for k = 1 it's a pure binary search. With n ≤ 10^4 all three approaches are fast; I'd still give the binary search because it's no longer or harder to code once the comparison is understood."

**Nuance:** if the caller accepted a view of the array (start index and length) instead of a new list, the whole thing would be O(log(n − k)).

## 10. Follow-up questions the interviewer might ask

**"What if the array is not sorted?"**
The answer is no longer contiguous in the input. Use a max-heap of size k keyed by (distance, value), O(n log k), or quickselect by that key, O(n) expected and O(n²) in the worst case, then sort the k results. Or sort first and use Approach 3, O(n log n). See [[nc-k-closest-points-to-origin|K Closest Points to Origin]].

**"Many queries with different x on the same array."**
Approach 3 needs no preprocessing: each query costs O(log(n − k) + k).

**"Return only the index of the single closest element."**
That is k = 1: the binary search alone, O(log n). Equivalently, find the insertion point of x and compare the neighbours on both sides.

**"Elements arrive as a stream, in sorted order, and you need the k closest at the end."**
Keep a queue of the k best so far. Because values arrive in order, the worst of the queue plus the new element is either the oldest (smallest) queued element or the new one, so the new element replaces the oldest exactly when it is strictly closer (being larger, it loses ties); otherwise skip it. O(n) time, O(k) space. Once a skipped element is ≥ x, every later one is farther still, so you may stop reading there.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Not noticing the answer is contiguous.** Without that, you end up with a heap or a sort and never use the sortedness.
- **Treating the binary search as "search for x".** The thing being searched is the start of the block, over [0, n − k], not the position of x.
- **Forgetting the tie rule.** Tests where the two candidates are at different distances pass; Example 1 is the one that catches it.

### Implementation mistakes

> [!MISTAKE] Comparing absolute values in the binary search
> `Math.abs(x - arr[mid]) > Math.abs(arr[mid + k] - x)` returns `[2, 2, 2]` for `[1, 1, 2, 2, 2, 2, 2, 3, 3]`, k = 3, x = 3. The answer is `[2, 3, 3]`.

> [!MISTAKE] `>=` instead of `>`
> Ties then move the block right, toward larger values. Example 1 returns `[2, 3, 4, 5]` instead of `[1, 2, 3, 4]`.

> [!MISTAKE] Searching the start over [0, n − 1]
> With `hi = arr.length - 1`, `arr[mid + k]` can be past the end: `[1, 2, 3]` with k = 2 and x = 5 throws `ArrayIndexOutOfBoundsException` at the first probe.

- **Forgetting to sort the result in Approach 1.** The first k elements by distance are in distance order, not ascending.
- **Returning indices instead of values** after the search: the search finds an index, and the output is the values `arr[lo..lo+k-1]`.

## 12. Pattern recognition

**The pattern:** a fixed-size window over a sorted array, where the window's position is found by binary search on a monotone "should it move right?" predicate rather than by sliding through every position.

**Signals in the problem statement:**

- A sorted array and "the k elements that are best by some distance or score".
- The best k elements are provably contiguous.
- A tie-breaking rule that picks a side.

**Related problems in this list:**

- [[nc-binary-search|Binary Search]] and [[nc-search-insert-position|Search Insert Position]]: the search primitives, the second giving the insertion point used by the alternative approach.
- [[nc-k-closest-points-to-origin|K Closest Points to Origin]]: the unsorted version, where a heap or quickselect replaces the window.
- [[nc-minimum-size-subarray-sum|Minimum Size Subarray Sum]]: a window whose position is found by moving pointers, with a binary-search follow-up.
- [[nc-koko-eating-bananas|Koko Eating Bananas]]: binary search over a monotone yes/no predicate, here on the answer instead of an index.
- [[nc-two-sum-ii-input-array-is-sorted|Two Sum II]]: two pointers closing in from both ends of a sorted array.

**Takeaway:** when the answer is a block of fixed size in a sorted array, binary search its start with a predicate that compares what the block would drop against what it would gain, and check the predicate is monotone, especially with duplicates.

## 13. 60-second revision card

**Key insight:** the k closest elements are a contiguous block; moving the block from i to i + 1 helps exactly when `x - arr[i] > arr[i + k] - x`, i.e. `arr[i] + arr[i + k] < 2x`, which is monotone in i.

**Invariant:** the best start is in [lo, hi], with `hi` starting at n − k.

**Complexity:** O(log(n − k) + k) time, O(1) auxiliary space besides the output.

**Code skeleton:**

```java title="Binary search the window start" fragment="public List<Integer> findClosestElements(int[] arr, int k, int x)"
int lo = 0, hi = arr.length - k;
while (lo < hi) {
    int mid = (lo + hi) >>> 1;
    if (x - arr[mid] > arr[mid + k] - x) lo = mid + 1;   // signed, strict
    else hi = mid;
}
List<Integer> result = new ArrayList<>(k);
for (int i = lo; i < lo + k; i++) result.add(arr[i]);
return result;
```

**Main traps:**

- `Math.abs` in the comparison: wrong with duplicates.
- `>=`: ties go to the larger value.
- `hi = n - 1`: out of bounds.

**What to say in one breath:** "The answer is a block of k consecutive elements, so I binary search its start in 0 to n − k. Moving the block right swaps `arr[i]` for `arr[i + k]`, which helps exactly when `x - arr[i] > arr[i + k] - x`; that's monotone in i because it's `arr[i] + arr[i + k] < 2x`. Signed comparison so duplicates don't stall it, strict so ties keep the smaller value. O(log(n − k) + k) time, O(1) extra space."
