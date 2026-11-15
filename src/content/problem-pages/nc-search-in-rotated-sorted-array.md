---
problemId: nc-search-in-rotated-sorted-array
title: Search In Rotated Sorted Array
source: neetcode
sourceUrl: https://leetcode.com/problems/search-in-rotated-sorted-array/
difficulty: medium
patterns: [binary-search]
relatedLessons: [a3-binary-search, a3-lower-upper-bounds, a14-edge-cases, a14-deriving-optimization, a14-manual-testing]
companies: []
timeToSolve: 25
---

## 1. Problem restatement

An array of distinct integers was sorted in ascending order and then possibly rotated: cut at some unknown position, with the part after the cut moved to the front. Given the result and a target value, return the index of the target, or −1 if it is not there. The algorithm must run in O(log n) time.

**Example 1**

- Input: `nums = [6, 7, 9, 1, 3, 4]`, `target = 3`
- Output: `4`
- Why: the array is `[1, 3, 4, 6, 7, 9]` rotated so that it starts at 6. The value 3 sits at index 4.

**Example 2**

- Input: `nums = [6, 7, 9, 1, 3, 4]`, `target = 5`
- Output: `-1`
- Why: 5 is not in the array. It would fit between 4 and 6 in sorted order, which in the rotated array is the wrap-around between the last and the first element.

**What the problem statement guarantees**

- The values are distinct.
- The array was sorted ascending and possibly rotated, so it may also be fully sorted.
- 1 ≤ n ≤ 5000, and −10^4 ≤ `nums[i]`, `target` ≤ 10^4.
- The algorithm must run in O(log n) time.

## 2. Practice first: try it before reading on

If you have not solved this yourself, stop here. Most people know roughly what to do; the marks are in getting every comparison exactly right.

**How to practise**

1. Set a timer for 25 minutes and talk out loud.
2. Say the linear solution. Then say what an O(log n) solution must be able to do at every step.
3. Draw the array as two rising segments. Cut it anywhere in the middle and look at the two halves. What do you notice?
4. Code your idea, then trace it on both examples, on `[4, 5, 6, 7, 0, 1, 2]` with target 0, and on `[3, 1]` with target 1.
5. Make sure your search works on an array that is not rotated at all.

> [!HINT] Hint 1: a small nudge
> Split the current range at its middle. The range contains at most one "drop" where the values go down. So at least one of the two halves has no drop. What does that half look like?

> [!HINT] Hint 2: the kind of tool you need
> A half with no drop is sorted, and for a sorted half you can decide with two comparisons whether the target could be in it, using its first and last values. If it could, search there; if not, search the other half. You can tell which half is sorted by comparing the first element of the range with the middle element.

> [!HINT] Hint 3: almost the whole plan
> Keep `lo` and `hi`; while `lo <= hi`, take `mid`. If `nums[mid]` is the target, return `mid`. If `nums[lo] <= nums[mid]`, the left half `lo..mid` is sorted: go left if `nums[lo] <= target < nums[mid]`, else go right. Otherwise the right half `mid..hi` is sorted: go right if `nums[mid] < target <= nums[hi]`, else go left. Then work out what happens on `[3, 1]`, target 1, if you write `<` instead of `<=` in the first test.

**Check yourself before revealing the walkthrough**

- [ ] My code returns 4 and −1 for the two examples
- [ ] It returns 1 for `[3, 1]` with target 1, and 0 for `[5]` with target 5
- [ ] It works on an unrotated array, such as `[1, 3, 5, 7, 9]` with target 7
- [ ] I can explain why at least one half is always sorted

## 3. Interview script: understand the problem (≈2 min)

**Me:** The array was sorted ascending and then rotated at some unknown point, I'm given a target, and I return its index or −1. Are the values distinct?

**Interviewer:** Yes.

**Me:** That makes comparisons clean: equal values mean the same position. "Possibly rotated": so it might not be rotated at all?

**Interviewer:** It might be fully sorted, yes.

**Me:** Then my search must not assume there is a drop. Sizes and value range?

**Interviewer:** Up to 5000 elements, at least one. Values and target between −10^4 and 10^4. You need O(log n).

**Me:** No arithmetic on values, only comparisons, and `lo + hi` is at most about 10^4, so no overflow concerns. Let me try Example 1 by hand. `[6, 7, 9, 1, 3, 4]`, target 3. I look at the middle, index 2, value 9. The left part 6, 7, 9 is rising. 3 is not between 6 and 9, so it's not there: it must be on the right, in 1, 3, 4. The middle of that is 3: found at index 4.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| Distinct values | `nums[lo] <= nums[mid]` holds with equality only when `lo == mid`, so the "which half is sorted" test is never fooled by repeated values. With duplicates it can be (that is problem II). |
| Ascending, possibly rotated | At most one drop in the array, and every element after it is smaller than every element before it. The unrotated array must work without a special case. |
| 1 ≤ n ≤ 5000 | n = 1 is possible. Index arithmetic cannot overflow. |
| −10^4 ≤ values, target ≤ 10^4 | Only comparisons; the target may be outside the range of the array. |
| O(log n) | Each step must discard about half of the range. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| The array may be unrotated | One of my test cases is a plain sorted array. |
| Return −1 when absent | The loop must be able to end without finding anything: `lo <= hi`, with `mid ± 1` updates, as in ordinary binary search. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| `nums` is read-only | All approaches only read it. |
| Cost is counted in element reads and comparisons | That is the model for the O(log n) requirement and for the lower bound in section 6. |

### Edge cases I will keep in mind

- n = 1, target present or absent.
- n = 2, where `lo == mid` on the first probe: `[3, 1]` with target 1.
- Unrotated array.
- Target at index 0, at the last index, or at the minimum.
- Target outside the value range of the array, or falling into the wrap-around gap (Example 2).

## 4. Think out loud: from first idea to best solution

Throughout: **n** is the length of `nums`. A range `[lo, hi]` is **sorted** if it contains no drop.

### Approach 1: Linear scan

#### What I say out loud

> "Baseline: check every index and return the one that matches. O(n), certainly correct, and too slow for the stated requirement. I'll use it to test the fast version."

#### Intuition

The target is at one index or nowhere; looking at every index finds it.

#### Algorithm

1. For each index `i`, if `nums[i] == target`, return `i`.
2. Return −1.

#### Why it is correct

It returns `i` only when `nums[i]` equals the target, and it checks every index before returning −1.

#### Dry run

Example 1: 6, 7, 9, 1 do not match; `nums[4] = 3` does. Returns 4.

#### Java code

```java title="Approach 1: linear scan"
class Solution {
    public int search(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == target) {
                return i;
            }
        }
        return -1;
    }
}
```

#### Time complexity

**O(n)** in the worst case (target absent or last).

#### Space complexity

**O(1)** auxiliary space.

#### The bridge to the next approach

> "To get log n I need binary search, and binary search needs a sorted range. The array isn't sorted, but it is two sorted runs. If I knew where the second run starts, I'd know which run the target belongs to and could binary search just that run. Finding where the second run starts is finding the minimum, which I can do in log n by comparing the middle with the right end."

### Approach 2: Find the rotation point, then binary search one run

#### What I say out loud

> "Two passes, both logarithmic. First, find `p`, the index of the minimum: the second run is `p..n-1` and the first run is `0..p-1`. Second, decide which run the target would be in. Everything in the second run is at most `nums[n - 1]`, everything in the first run is bigger than that. So if `target <= nums[n - 1]` I search `p..n-1`, else `0..p-1`. Then an ordinary binary search."

#### Intuition

Undo the rotation logically: once you know where the rotation point is, each run is an ordinary sorted array, and the last element separates their value ranges.

#### Algorithm

1. Find `p`: `lo = 0`, `hi = n - 1`; while `lo < hi`, `mid = (lo + hi) >>> 1`; if `nums[mid] > nums[hi]` then `lo = mid + 1`, else `hi = mid`. Then `p = lo`.
2. If `target <= nums[n - 1]`, search `[p, n - 1]`; otherwise search `[0, p - 1]`.
3. Standard binary search in that range; return the index or −1.

#### Why it is correct

- **Step 1** finds the minimum's index: the range always contains it, and comparing with `nums[hi]` tells which side of the drop `mid` is on, because `hi` is always in the second run. The full argument is on [[nc-find-minimum-in-rotated-sorted-array|Find Minimum in Rotated Sorted Array]].
- **Step 2** picks the only run that can contain the target. The second run `[p, n - 1]` holds values up to `nums[n - 1]`, its largest. The first run holds values greater than every second-run value, so all of them exceed `nums[n - 1]`. A target `≤ nums[n - 1]` can only be in the second run; a larger one only in the first.
- **No special case for the unrotated array.** Then `p = 0`, the second run is the whole array, and the first run `[0, −1]` is empty. A target `≤ nums[n − 1]` searches everything; a larger one searches nothing and returns −1, which is right because it exceeds the maximum.
- **Step 3** is ordinary binary search on a sorted range.

#### Dry run

`nums = [4, 5, 6, 7, 0, 1, 2]`, `target = 0`.

Step 1 (find the minimum):

| lo | hi | mid | nums[mid] vs nums[hi] | Update |
|---|---|---|---|---|
| 0 | 6 | 3 | 7 > 2 | `lo = 4` |
| 4 | 6 | 5 | 1 < 2 | `hi = 5` |
| 4 | 5 | 4 | 0 < 1 | `hi = 4` |

`p = 4`. Step 2: 0 ≤ `nums[6]` = 2, so search `[4, 6]`. Step 3: `mid = 5`, 1 > 0, `hi = 4`; `mid = 4`, 0 = 0, return 4.

#### Java code

```java title="Approach 2: find the rotation point, then binary search"
class Solution {
    public int search(int[] nums, int target) {
        int n = nums.length;
        int lo = 0, hi = n - 1;
        while (lo < hi) {                       // find the index of the minimum
            int mid = (lo + hi) >>> 1;
            if (nums[mid] > nums[hi]) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        int p = lo;
        if (target <= nums[n - 1]) {            // second run [p, n - 1] holds every value <= nums[n - 1]
            return binarySearch(nums, p, n - 1, target);
        }
        return binarySearch(nums, 0, p - 1, target);
    }

    private int binarySearch(int[] nums, int lo, int hi, int target) {
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1;
            if (nums[mid] == target) {
                return mid;
            }
            if (nums[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return -1;
    }
}
```

#### Time complexity

**O(log n)** in every case: two binary searches of at most about log₂ n iterations each (13 each at n = 5000).

#### Space complexity

**O(1)** auxiliary space.

#### The bridge to the next approach

> "That works and it's easy to justify, because each pass is a search I already know. But it's two loops and a helper. Can I decide where to go in a single pass, without knowing the rotation point?"

> "Look at any range and its middle. The range has at most one drop. The drop is either in the left half or the right half, or nowhere, so at least one half has no drop: it's sorted. For a sorted half, two comparisons tell me if the target is inside its value range. If yes, go there. If no, the target can only be in the other half. And I don't need to know where the drop is, only which half is sorted, which one comparison of `nums[lo]` with `nums[mid]` tells me."

### Approach 3: One pass, decide which half is sorted (recommended)

#### What I say out loud

> "Ordinary binary search loop, `lo <= hi`. At `mid`, if it's the target, done. Otherwise one of the two halves is sorted. If `nums[lo] <= nums[mid]`, the left half `lo..mid` is sorted. Then the target is in it exactly when `nums[lo] <= target < nums[mid]`; if so, `hi = mid - 1`, else `lo = mid + 1`. Otherwise the right half `mid..hi` is sorted, and I check `nums[mid] < target <= nums[hi]` the same way."

> "The `<=` in `nums[lo] <= nums[mid]` matters: when `lo == mid`, the left half is one element, which is sorted, and the test has to say so."

#### Intuition

A range of a rotated sorted array is itself a rotated sorted array, with at most one drop. Splitting it at `mid` puts the drop on one side, so the other side is an ordinary sorted range. You cannot binary search the unsorted side directly, but you never need to: you only ask "is the target in the sorted side?", which is two comparisons, and the answer tells you which side to keep.

#### Algorithm

1. `lo = 0`, `hi = n - 1`.
2. While `lo <= hi`:
   1. `mid = (lo + hi) >>> 1`. If `nums[mid] == target`, return `mid`.
   2. If `nums[lo] <= nums[mid]` (left half sorted): if `nums[lo] <= target && target < nums[mid]`, `hi = mid - 1`; else `lo = mid + 1`.
   3. Else (right half sorted): if `nums[mid] < target && target <= nums[hi]`, `lo = mid + 1`; else `hi = mid - 1`.
3. Return −1.

#### Why it is correct

**Invariant:** if the target is in the array, its index is in `[lo, hi]`.

- **Initially** `[lo, hi]` is the whole array.
- **Every range has at most one drop.** The whole array has at most one, and a range is a piece of it.
- **The test identifies a sorted half.** If `[lo, mid]` contained the drop, then `nums[lo]` would be in the first run and `nums[mid]` in the second, and every second-run value is smaller than every first-run value: `nums[lo] > nums[mid]`. So `nums[lo] <= nums[mid]` proves `[lo, mid]` has no drop: it is sorted. If instead `nums[lo] > nums[mid]`, the drop is in `[lo, mid]`, so `[mid, hi]` has none: it is sorted.
- **Left half sorted.** Its values run from `nums[lo]` to `nums[mid]`, rising. The target (already known not to be `nums[mid]`) is in `[lo, mid − 1]` exactly when `nums[lo] <= target < nums[mid]`. If so, `hi = mid - 1` keeps it. If not, it is not in `[lo, mid]`, and `lo = mid + 1` keeps the invariant.
- **Right half sorted.** Symmetric: the target is in `[mid + 1, hi]` exactly when `nums[mid] < target <= nums[hi]`.
- **It returns only correct indices**, since it returns `mid` only when `nums[mid] == target`.
- **Termination.** Each iteration either returns or moves `lo` above `mid` or `hi` below `mid`, so the range shrinks by at least one (in fact by about half). When it is empty, the invariant says the target is absent, and −1 is right.

**Why `<=` and not `<`.** When `lo == mid` (a range of one or two elements), `nums[lo] == nums[mid]`, and the left half `[lo, mid]` is a single element, which is sorted. With `<`, the code concludes the right half is sorted, which may be false. On `[3, 1]` with target 1: `mid = 0`, `3 < 3` is false, so it treats `[0, 1]` (values 3, 1) as sorted, tests `3 < 1`, fails, sets `hi = −1`, and returns −1. The answer is 1.

**The 25-second version to say to the interviewer:**

> "The range always contains the target if it exists. Any range has at most one drop, so one half of it is sorted: the left half if `nums[lo] <= nums[mid]`, else the right half. For the sorted half I can check with two comparisons whether the target lies in its value range. If it does, I keep that half; if not, it can only be in the other half. Each step halves the range, so O(log n), and an empty range means −1."

#### Dry run

Example 1, `nums = [6, 7, 9, 1, 3, 4]`, `target = 3`:

| lo | hi | mid | nums[mid] | Sorted half | Target in it? | Update |
|---|---|---|---|---|---|---|
| 0 | 5 | 2 | 9 | left (6 ≤ 9): values 6..9 | 6 ≤ 3? no | `lo = 3` |
| 3 | 5 | 4 | 3 | – | – | found, return 4 |

Example 2, `target = 5`:

| lo | hi | mid | nums[mid] | Sorted half | Target in it? | Update |
|---|---|---|---|---|---|---|
| 0 | 5 | 2 | 9 | left: 6..9 | 6 ≤ 5? no | `lo = 3` |
| 3 | 5 | 4 | 3 | left (1 ≤ 3): 1..3 | 5 < 3? no | `lo = 5` |
| 5 | 5 | 5 | 4 | left (lo = mid) | 5 < 4? no | `lo = 6` |
| 6 | 5 | – | – | – | – | empty, return −1 |

#### Java code

```java title="Approach 3: one pass (recommended)"
class Solution {
    public int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;           // invariant: if target exists, its index is in [lo, hi]
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1;
            if (nums[mid] == target) {
                return mid;
            }
            if (nums[lo] <= nums[mid]) {            // left half [lo, mid] is sorted (<= covers lo == mid)
                if (nums[lo] <= target && target < nums[mid]) {
                    hi = mid - 1;
                } else {
                    lo = mid + 1;
                }
            } else {                                // right half [mid, hi] is sorted
                if (nums[mid] < target && target <= nums[hi]) {
                    lo = mid + 1;
                } else {
                    hi = mid - 1;
                }
            }
        }
        return -1;
    }
}
```

#### Time complexity

**O(log n)** in every case: each iteration keeps at most half of the range (`[lo, mid − 1]` or `[mid + 1, hi]`), so there are at most about log₂ n + 1 iterations, 13 for n = 5000.

#### Space complexity

**O(1)** auxiliary space.

## 5. Comparison table

n = length of `nums`. No hashing or randomness: expected and worst case agree.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Linear scan | O(n) | O(n) | O(1) |
| 2. Rotation point + binary search | O(log n) | O(log n) | O(1) |
| 3. One pass, sorted half | O(log n) | O(log n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Linear scan | Correct by inspection, since it checks every index | Fails the O(log n) requirement | Baseline and test reference |
| 2. Two passes | Built from two searches you already trust; each easy to argue | Two loops and a helper; more code | If you have just solved Find Minimum, or the one-pass conditions feel shaky |
| 3. One pass | One loop, no helper, about 15 lines | Four boundary comparisons that must each be exactly right | The answer to give |

## 6. Which solution to give, and when to stop optimizing

Give Approach 3, after saying the linear baseline and, briefly, the two-pass idea. Many interviewers accept Approach 2 too: it has the same complexity, and a candidate who codes it cleanly and justifies the `target <= nums[n - 1]` test has shown the same understanding. If you are more confident in it, it is a perfectly good answer; mention that a single pass is possible.

O(log n) is optimal in the worst case for algorithms that learn the array by reading elements: the inputs include ordinary sorted arrays, and searching a sorted array of n elements needs Ω(log n) comparisons in the worst case, because there are n + 1 possible answers (n positions or absent) and each comparison of an element with the target has only three outcomes. Stop there; spend the remaining time tracing the two-element case.

## 7. Interview script: code it and test it

### What I say while coding

> "Standard loop: `lo <= hi`, because the target may be absent and I need the range to be able to become empty."

> "Check `mid` for the target first, so every later comparison can treat `nums[mid]` as not the target. That's why the bounds are `target < nums[mid]` and `nums[mid] < target`, strict."

> "`nums[lo] <= nums[mid]`, with equals, for the case `lo == mid`."

> "Inside each branch the sorted side's range check uses both of its ends: `nums[lo]` and `nums[mid]` on the left, `nums[mid]` and `nums[hi]` on the right."

### Testing out loud

**Normal case:** Example 1, as in the dry run: index 4.

**Absent, in the wrap-around gap:** Example 2: −1, as traced.

**Two elements, `lo == mid`:** `[3, 1]`, target 1. `mid = 0`, 3 ≠ 1; `3 <= 3`, left sorted; `3 <= 1` fails, `lo = 1`. `mid = 1`: found, 1.

**Single element:** `[5]`, target 5: `mid = 0`, found. Target 2: `mid = 0`, left sorted, `5 <= 2` fails, `lo = 1`, loop ends: −1.

**Unrotated:** `[1, 3, 5, 7, 9]`, target 7. `mid = 2` (5): left sorted 1..5, 7 not below 5, `lo = 3`. `mid = 3`: found, 3.

**Target at the minimum:** `[3, 5, 7, 9, 1]`, target 1. `mid = 2` (7): left sorted 3..7, `3 <= 1` fails, `lo = 3`. `mid = 3` (9): left sorted (lo = mid), `9 <= 1` fails, `lo = 4`. `mid = 4`: found, 4.

**Target at index 0 with the right half sorted:** `[9, 1, 3, 5, 7]`, target 9. `mid = 2` (3): `9 <= 3` is false, so the right half is sorted, 3..7; 9 is not in it, `hi = 1`. `mid = 0`: found, 0.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2 min | Distinct values, possibly unrotated, −1 when absent |
| Baseline and idea | 3–4 min | Linear; two-pass idea; "one half is always sorted" |
| Code | 4–5 min | One loop; say each comparison's reason as you type it |
| Test | 5 min | Both examples, `[3, 1]`, n = 1, unrotated, target at the minimum |
| Follow-ups | rest | Duplicates (problem II), rotation count |

If the one-pass conditions keep coming out wrong, switch to Approach 2: it reuses two loops you can write reliably, and it is still O(log n).

## 9. Interviewer challenges

### About correctness

#### Why is one half always sorted?

**What they are testing:** the structural fact the algorithm rests on.

**How to reason:** count the drops.

**What I say:** "The whole array has at most one place where the values go down, so any range has at most one. Splitting the range at `mid` puts that drop in one half or nowhere, so the other half has none, which means it's sorted. And if the left half contained the drop, `nums[lo]` would be in the high run and `nums[mid]` in the low run, so `nums[lo] > nums[mid]`. That's why `nums[lo] <= nums[mid]` is enough to say the left half is sorted."

**Nuance:** this uses distinct values. With duplicates, `nums[lo] == nums[mid]` can happen with the drop between them, and the test no longer identifies a sorted half.

#### What breaks if you write `nums[lo] < nums[mid]`?

**What they are testing:** whether you know why the `=` is there.

**How to reason:** when are `nums[lo]` and `nums[mid]` equal with distinct values? Only when `lo == mid`.

**What I say:** "With distinct values they're equal only when `lo == mid`, a one-element left half, which is sorted. With `<`, the code goes to the 'right half sorted' branch even when the right half has the drop. On `[3, 1]` with target 1 it decides 3..1 is sorted, rules the target out, and returns −1 instead of 1."

**Nuance:** `<` with `lo == mid` happens to work when the right half really is sorted, which is why some tests pass; the two-element rotated case is the one that exposes it.

#### Why are the range checks `nums[lo] <= target < nums[mid]` and not `<=` on both sides?

**What they are testing:** boundary precision.

**How to reason:** what has already been ruled out at this point?

**What I say:** "I've already checked `nums[mid] == target`, so the target is strictly below `nums[mid]` if it's in the left half. `nums[lo]` could be the target, so that end is inclusive. Writing `<=` at `mid` would also work, since equality can't happen there, but strict states what's actually true."

**Nuance:** the right-half check mirrors it: `nums[mid] < target <= nums[hi]`.

### About the alternatives

#### Is the two-pass version worse?

**What they are testing:** judgement rather than template-matching.

**How to reason:** compare complexity, then risk.

**What I say:** "Same O(log n), up to a factor of two in iterations, which doesn't matter. It's more code, but each part is a search I already trust, and the run choice is one comparison with the last element. If I'm unsure of the one-pass conditions under pressure, two passes is the safer answer."

**Nuance:** the two-pass version also gives the rotation point for free, which helps if the interviewer next asks for many targets on the same array: find `p` once, then O(log n) per query with one simple search.

## 10. Follow-up questions the interviewer might ask

**"What if the array can contain duplicates and you only return whether the target is present?"**
`nums[lo] == nums[mid]` no longer tells you which half is sorted: `[1, 0, 1, 1, 1]` and `[1, 1, 1, 0, 1]` look the same at `lo`, `mid` and `hi`. When all three are equal you can only shrink the range by one at each end, and the worst case becomes O(n). See [[nc-search-in-rotated-sorted-array-ii|Search in Rotated Sorted Array II]].

**"Many queries on the same array."**
Find the rotation point once (O(log n)), then answer each query with one binary search in the right run, or with a single binary search over "virtual" indices where virtual index i maps to `(i + p) % n`. O(log n) per query, no extra memory.

**"Return the index where the target would be inserted in sorted order."**
Map back to the sorted order with the rotation point p: run a lower-bound search over virtual indices `0..n` and convert the result. O(log n). Ask what an "insertion index" means in the rotated array before coding.

**"What if you are given the rotation count k?"**
Then the rotation point is known, and the search is one ordinary binary search on virtual indices. O(log n), and the first pass of Approach 2 disappears.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Trying to find the target's run by comparing with `nums[0]` without handling the unrotated case.** The comparison with `nums[n − 1]` in Approach 2 handles it for free; a comparison with `nums[0]` needs care when p = 0.
- **Thinking the unsorted half must be searched recursively.** You never search it directly: the sorted half's range check tells you whether to go there.
- **Assuming the method still works with duplicates.** It does not; see section 10.

### Implementation mistakes

> [!MISTAKE] `nums[lo] < nums[mid]` instead of `<=`
> On `[3, 1]` with target 1 the method returns −1. When `lo == mid` the left half is a single, sorted element, and the test must say so.

> [!MISTAKE] Range check against the wrong end
> Writing `nums[lo] <= target && target < nums[hi]` in the left-sorted branch checks against the end of the whole range, which is not sorted. On `[2, 3, 1]` with target 2: `mid = 1`, the left half 2..3 is sorted, but `2 <= 2 && 2 < 1` is false, so the method goes right and returns −1 instead of 0.

- **Not checking `nums[mid] == target` first.** The strict comparisons then become wrong at `mid`.
- **`lo < hi` as the loop condition** with `mid ± 1` updates: a one-element range is never examined, so `[5]` with target 5 returns −1.
- **In Approach 2, searching `[0, p]` or `[p − 1, n − 1]`.** The runs are exactly `[0, p − 1]` and `[p, n − 1]`.

## 12. Pattern recognition

**The pattern:** binary search on data that is not globally sorted, but where every probe lets you identify a part that is sorted and decide, with constant work, whether the answer can be in it.

**Signals in the problem statement:**

- "Sorted, then rotated", or more generally "piecewise sorted with a known structure".
- An O(log n) requirement.
- Distinct values, which make each comparison decisive.

**Related problems in this list:**

- [[nc-binary-search|Binary Search]]: the loop this one extends, with the same `lo <= hi` and `mid ± 1` shape.
- [[nc-find-minimum-in-rotated-sorted-array|Find Minimum in Rotated Sorted Array]]: the first pass of Approach 2.
- [[nc-search-in-rotated-sorted-array-ii|Search in Rotated Sorted Array II]]: the same problem with duplicates, where the guarantee is lost.
- [[nc-find-in-mountain-array|Find in Mountain Array]]: find the turning point, then binary search each monotone part: the same two-pass idea.
- [[nc-rotate-array|Rotate Array]]: the rotation itself.

**Takeaway:** when the whole range isn't sorted, look for a half that provably is, and use it to decide which half to keep.

## 13. 60-second revision card

**Key insight:** a range of a rotated sorted array has at most one drop, so one half is sorted. `nums[lo] <= nums[mid]` means the left half is.

**Invariant:** if the target exists, its index is in `[lo, hi]`. Loop while `lo <= hi`; return at `mid` if found; empty range means −1.

**Complexity:** O(log n) time, O(1) space; Ω(log n) is a worst-case lower bound for comparison-based search.

**Code skeleton:**

```java title="One-pass rotated search" fragment="public int search(int[] nums, int target)"
int lo = 0, hi = nums.length - 1;
while (lo <= hi) {
    int mid = (lo + hi) >>> 1;
    if (nums[mid] == target) return mid;
    if (nums[lo] <= nums[mid]) {                       // left half sorted
        if (nums[lo] <= target && target < nums[mid]) hi = mid - 1; else lo = mid + 1;
    } else {                                           // right half sorted
        if (nums[mid] < target && target <= nums[hi]) lo = mid + 1; else hi = mid - 1;
    }
}
return -1;
```

**Main traps:**

- `<` instead of `<=` in `nums[lo] <= nums[mid]`: fails on `[3, 1]`, target 1.
- Range checks must use the ends of the sorted half, not `lo` and `hi`.
- Check `nums[mid] == target` before anything else.

**What to say in one breath:** "One half of any range is sorted, the left one if `nums[lo] <= nums[mid]`. If the target is within that sorted half's ends, I go there; otherwise the other half. Each step halves the range: O(log n), O(1) space. The `<=` matters when `lo == mid`."
