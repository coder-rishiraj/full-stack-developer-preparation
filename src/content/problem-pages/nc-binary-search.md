---
problemId: nc-binary-search
title: Binary Search
source: neetcode
sourceUrl: https://leetcode.com/problems/binary-search/
difficulty: easy
patterns: [binary-search]
relatedLessons: [a3-binary-search, a3-lower-upper-bounds, a1-recursion, a14-edge-cases, a14-manual-testing]
companies: []
timeToSolve: 8
---

## 1. Problem restatement

You get an array of integers sorted in ascending order, with no repeated values, and a `target`. Return the index where `target` sits, or `-1` if it is not in the array. The statement adds a requirement on the method itself: it must run in O(log n) time, where n is the length of the array.

**Example 1**

- Input: `nums = [-4, 1, 6, 9, 15, 22]`, `target = 15`
- Output: `4`
- Why: `nums[4] = 15`, and because the values are distinct there is no other index it could be.

**Example 2**

- Input: `nums = [-4, 1, 6, 9, 15, 22]`, `target = 7`
- Output: `-1`
- Why: 7 would sit between 6 and 9, but no element equals it.

**What the problem statement guarantees**

- 1 ≤ `nums.length` ≤ 10^4, so the array is never empty.
- Every value and the target lie strictly between −10^4 and 10^4.
- All values are distinct, and `nums` is sorted in ascending order.
- The running time must be O(log n).

## 2. Practice first: try it before reading on

This is the problem everyone thinks they can write and many people get subtly wrong. The idea takes seconds; the loop condition and the two updates are what you are practising. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 8 minutes and talk out loud.
2. Before writing code, write one sentence that is true about your search range at the start of every loop iteration.
3. Write the code, then check each line against that sentence: the starting values, the loop condition, and each update.
4. Trace it on a one-element array where the target is missing, and on a two-element array where the target is the second element.

> [!HINT] Hint 1: a small nudge
> Compare the target with one element somewhere in the array. Because the values are sorted, that single comparison tells you about more than one element. About which ones?

> [!HINT] Hint 2: the kind of tool you need
> If you always compare with the element in the middle of the part you have not ruled out, every comparison discards about half of what is left. Keep two indices for the ends of that part.

> [!HINT] Hint 3: almost the whole plan
> Keep `lo` and `hi` so that the target, if present, is always at an index from `lo` to `hi` inclusive. Look at the middle index: equal means done; smaller means everything up to and including the middle is ruled out; larger means everything from the middle onwards is. Stop when the range is empty, and decide what "empty" means for an inclusive range.

**Check yourself before revealing the walkthrough**

- [ ] I can state what is true about `lo` and `hi` before every iteration
- [ ] My loop condition follows from that statement, and I can say why it is `<=` or `<`
- [ ] Every update makes the range strictly smaller, so the loop cannot run forever
- [ ] My code returns `-1` for `[5]` with target 3 and `1` for `[1, 3]` with target 3

## 3. Interview script: understand the problem (≈1 min)

**Me:** So the array is sorted ascending and I return the index of the target, or −1 if it isn't there. Can values repeat?

**Interviewer:** No, they're all distinct.

**Me:** Good, then "the index" is well defined; with duplicates I'd have to ask which copy you want. And you want O(log n), so a scan is out even though it would be correct.

**Interviewer:** Right.

**Me:** Sizes: at least one element, at most 10^4, values and target strictly between −10^4 and 10^4. So indices fit in an `int` with plenty of room, and I won't do arithmetic on the values at all, only compare them.

**Interviewer:** Fine.

**Me:** By hand on `[-4, 1, 6, 9, 15, 22]` with target 15: the middle is around index 2, value 6, too small, so the target is to its right. Among indices 3 to 5 the middle is 4, value 15. Found in two looks.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| Sorted ascending | One comparison with `nums[mid]` rules out a whole side, which is what makes O(log n) possible. |
| All values distinct | At most one index matches, so I can return the moment I see it. No "first or last occurrence" question. |
| 1 ≤ n ≤ 10^4 | Never empty, though the loop handles an empty array anyway. `lo + hi` is at most about 2 × 10^4, nowhere near the `int` limit. At most ⌊log2 10^4⌋ + 1 = 14 iterations. |
| −10^4 < values, target < 10^4 | Only compared, never added, so no overflow question on values. |
| O(log n) required | Rules out the linear scan as an answer, not as a baseline. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Return −1 when absent (the statement says so; I confirm it is −1, not an insertion point) | The variant that returns where the target would go is a different problem with a different loop shape. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The array is read-only | Nothing asks me to change it, and binary search does not need to. |
| Indices are 0-based | The statement's examples use 0-based indices. |

### Edge cases I will keep in mind

- One element, target equal, smaller or larger.
- Two elements, target equal to the second: checks that the midpoint rounding and the update do not skip it.
- Target smaller than every element or larger than every element: the range must empty out cleanly on either side.
- Target equal to the first or the last element.

## 4. Think out loud: from first idea to best solution

### Approach 1: Linear scan

#### What I say out loud

> "The certainly-correct baseline: walk the array and return the first index whose value equals the target. That's O(n), which breaks the stated O(log n) requirement, and it ignores the fact that the array is sorted. I'll say it and not code it unless you want it."

#### Intuition

Checking every element cannot miss the target. It is the right answer only when the data is not sorted.

#### Algorithm

1. For each index `i` from 0 to n − 1, if `nums[i] == target`, return `i`.
2. Return −1.

#### Why it is correct

It returns `i` only after seeing `nums[i] == target`, and it returns −1 only after inspecting every index, so it never misses a present target.

#### Dry run

`nums = [-4, 1, 6, 9, 15, 22]`, `target = 15`: indices 0 to 3 hold −4, 1, 6, 9, none equal; index 4 holds 15, return 4. Five comparisons, where Approach 2 needs two.

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

**O(n) in the worst case**, where n is `nums.length`: n comparisons when the target is absent or last. This violates the problem's O(log n) requirement.

#### Space complexity

**O(1) auxiliary space**: one loop index.

#### The bridge to the next approach

> "The scan learns one thing per comparison: whether this element is the target. But in a sorted array, `nums[i] < target` tells me more: every element at or before `i` is also smaller, so none of them can be the target. If I compare in the middle of what's left, each comparison throws away half. Halving from 10^4 gets to nothing in 14 steps."

### Approach 2: Iterative binary search on a closed range (recommended)

#### What I say out loud

> "I'll keep a range `[lo, hi]`, both ends inclusive, with one promise: if the target is in the array, its index is between `lo` and `hi`. I start with the whole array. Each step I look at the middle. Equal: return it. Smaller than the target: the middle and everything left of it are out, so `lo = mid + 1`. Larger: `hi = mid - 1`. When `lo` passes `hi`, the range is empty, so the target isn't there."

> "Every line of the loop comes from that one promise, so let me state it before I code."

#### Intuition

Sorted order lets one comparison speak for a whole side of the array. Comparing with the middle guarantees that whichever side is discarded, at least half of the remaining range goes with it. This is the method from [[a3-binary-search|Binary Search]].

#### Algorithm

1. `lo = 0`, `hi = n − 1`.
2. While `lo <= hi`:
3. `mid = lo + (hi − lo) / 2`.
4. If `nums[mid] == target`, return `mid`.
5. If `nums[mid] < target`, set `lo = mid + 1`; otherwise set `hi = mid − 1`.
6. Return −1.

#### Why it is correct

**The invariant:** before every iteration, if `target` occurs in `nums`, its index is in the closed range `[lo, hi]`.

Every choice in the code is derived from that sentence:

- **Start.** `lo = 0`, `hi = n − 1` is the whole array, so the invariant holds trivially.
- **Loop condition `lo <= hi`.** A closed range `[lo, hi]` contains at least one index exactly when `lo <= hi`. Using `lo < hi` would stop with one candidate left unexamined; on `[5]` with target 5 it would return −1 without ever looking.
- **The midpoint is inside the range.** With `lo <= hi`, `mid = lo + (hi − lo) / 2` rounds down and satisfies `lo <= mid <= hi`, so `nums[mid]` is always a valid index.
- **`nums[mid] < target`.** Sorted ascending means every index `≤ mid` holds a value `≤ nums[mid] < target`, so none of them is the target. The smallest index that can still hold it is `mid + 1`, so `lo = mid + 1` keeps the invariant. `lo = mid` would also keep it, but it would not shrink the range when `lo == mid`, which is how infinite loops start.
- **`nums[mid] > target`.** By the mirror argument every index `≥ mid` is out, and `hi = mid − 1` keeps the invariant.
- **Termination.** Each non-returning iteration moves `lo` up past `mid` or `hi` down past `mid`, and `mid` lies inside the range, so the range loses at least one index (in fact about half). It cannot shrink forever.
- **The result.** The method returns `mid` only when `nums[mid] == target`. It returns −1 only when the range is empty, and then the invariant says "if the target exists, its index is in an empty range", so it does not exist.

**The 25-second version to say to the interviewer:**

> "My invariant is: if the target is in the array, it's in `[lo, hi]`, inclusive. That's why I start at 0 and n − 1, loop while `lo <= hi` since that's when the range is non-empty, and move to `mid + 1` or `mid − 1`, because sorted order proves `mid` and everything on one side can't be the target. Each step shrinks the range, so it ends, and an empty range means not found."

#### Dry run

`nums = [-4, 1, 6, 9, 15, 22]`, `target = 15`

| lo | hi | mid | nums[mid] | Comparison | Action |
|---|---|---|---|---|---|
| 0 | 5 | 2 | 6 | 6 < 15 | `lo = 3` |
| 3 | 5 | 4 | 15 | equal | return 4 |

`target = 7` (absent), which shows how the range empties:

| lo | hi | mid | nums[mid] | Comparison | Action |
|---|---|---|---|---|---|
| 0 | 5 | 2 | 6 | 6 < 7 | `lo = 3` |
| 3 | 5 | 4 | 15 | 15 > 7 | `hi = 3` |
| 3 | 3 | 3 | 9 | 9 > 7 | `hi = 2` |
| 3 | 2 | | | `lo > hi`, range empty | return −1 |

Three iterations for n = 6, which is ⌊log2 6⌋ + 1. When the loop ends without a match, `lo` = 3 is exactly where 7 would be inserted; [[nc-search-insert-position|Search Insert Position]] builds on that.

#### Java code

```java title="Approach 2: iterative binary search, closed range (recommended)"
class Solution {
    public int search(int[] nums, int target) {
        int lo = 0;
        int hi = nums.length - 1;              // invariant: target, if present, is in nums[lo..hi]
        while (lo <= hi) {                     // the closed range is non-empty
            int mid = lo + (hi - lo) / 2;      // lo <= mid <= hi
            if (nums[mid] == target) {
                return mid;
            }
            if (nums[mid] < target) {
                lo = mid + 1;                  // mid and everything left of it are too small
            } else {
                hi = mid - 1;                  // mid and everything right of it are too large
            }
        }
        return -1;                             // empty range: target is absent
    }
}
```

**About `lo + (hi − lo) / 2`.** With these constraints, `(lo + hi) / 2` would be just as correct: `lo` and `hi` are at most 10^4 − 1, so their sum is below 2 × 10^4, far below `Integer.MAX_VALUE` = 2,147,483,647. I still write the offset form, because it is a habit that costs nothing and matters as soon as the range is not a small array index. In [[nc-guess-number-higher-or-lower|Guess Number Higher or Lower]] the range is `[1, 2^31 − 1]` and `(lo + hi) / 2` overflows to a negative number and sends the search into an infinite loop.

#### Time complexity

**O(log n) in the worst case; exactly at most ⌊log2 n⌋ + 1 iterations.** If the range holds k indices, the next one holds at most ⌊k / 2⌋: with `mid` rounding down, the left part has ⌊(k − 1) / 2⌋ indices and the right part ⌊k / 2⌋. Starting from n, after i iterations at most ⌊n / 2^i⌋ remain, which reaches 0 after ⌊log2 n⌋ + 1 iterations. For n = 10^4 that is 14, and the bound is reached: a target larger than every element always goes right, where the part kept has exactly ⌊k / 2⌋ indices (I counted the iterations to confirm it). Each iteration does constant work: one midpoint and up to two `int` comparisons with `nums[mid]`. The best case is one iteration, when the first middle is the target.

#### Space complexity

**O(1) auxiliary space**: three `int`s. No recursion, and the input is not modified.

### Alternative: recursive binary search

The same invariant can be passed as parameters instead of kept in variables:

```java title="Alternative: recursive binary search"
class Solution {
    public int search(int[] nums, int target) {
        return search(nums, target, 0, nums.length - 1);
    }

    private int search(int[] nums, int target, int lo, int hi) {
        if (lo > hi) {
            return -1;                         // empty range
        }
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) {
            return mid;
        }
        return nums[mid] < target
                ? search(nums, target, mid + 1, hi)
                : search(nums, target, lo, mid - 1);
    }
}
```

The time bound is the same, but each call adds a stack frame and Java does not eliminate tail calls, so it uses **O(log n) auxiliary space** for the stack: at most 14 frames here, which is harmless. It is a fine answer if recursion is how you think about it; the iterative version is preferred because it uses O(1) space and puts the invariant in one place. [[a1-recursion|Recursion]] covers why the frames are kept.

## 5. Comparison table

n = `nums.length`. Nothing is hashed or randomized, so expected and worst case coincide.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Linear scan | O(n) | O(n) | O(1) |
| 2. Iterative binary search | O(log n) | O(log n), at most ⌊log2 n⌋ + 1 iterations | O(1) |
| Alternative: recursive | O(log n) | O(log n) | O(log n) stack |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Linear scan | Correct by inspection; works on unsorted data | O(n), violates the requirement | Only as the baseline sentence |
| 2. Iterative binary search | Optimal comparisons, O(1) space, invariant in one place | Boundary details must be argued, not guessed | The answer |
| Alternative: recursive | Mirrors the "search one half" description | O(log n) stack, slightly more code | If the interviewer asks for it, or you find it clearer |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2, with the invariant stated before the code.

**Is it optimal?** Yes, in the comparison model. A search that learns about the target only by comparing it with array elements needs ⌊log2 n⌋ + 1 three-way comparisons in the worst case; this is the classic decision-tree result for searching ordered keys (Knuth, *The Art of Computer Programming*, vol. 3, §6.2.1), and binary search meets it exactly. So stop once it is written and traced. Library equivalents such as `Arrays.binarySearch` exist, but an interviewer asking this problem wants to see you write the loop.

**When something else is better in practice:** a linear scan on a handful of elements (a few dozen at most) can be as fast in wall-clock time because it is branch-predictable and cache-friendly, but that is a constant-factor argument and does not meet this problem's requirement.

## 7. Interview script: code it and test it

### What I say while coding

> "`lo = 0`, `hi = n - 1`, and I'll write the invariant as a comment: the target, if present, is in `nums[lo..hi]`."

> "The loop runs while `lo <= hi`, because a closed range with `lo == hi` still has one element to check."

> "`mid = lo + (hi - lo) / 2`. Here `lo + hi` can't overflow, but I write it this way out of habit; it's the same value."

> "Equal returns. Smaller means `mid` is ruled out along with its left side, so `lo = mid + 1`. Larger, `hi = mid - 1`. Both strictly shrink the range."

### Testing out loud

**Normal case:** `[-4, 1, 6, 9, 15, 22]`, target 15: mid 2 (6, too small), `lo = 3`; mid 4 (15), return 4.

**Absent, between elements:** target 7 on the same array ends with `lo = 3`, `hi = 2`, returns −1 (the second dry-run table).

**One element:** `[5]`, target 5: `lo = hi = 0`, mid 0, return 0. Target 3: `nums[0] = 5 > 3`, `hi = −1`, loop ends, −1. Target 8: `lo = 1`, loop ends, −1.

**Two elements, target second:** `[1, 3]`, target 3: mid = 0 + (1 − 0) / 2 = 0, value 1 < 3, `lo = 1`; now `lo = hi = 1`, mid 1, return 1. This is the case `lo < hi` would get wrong.

**Target outside the range:** smaller than all, `hi` walks down to −1; larger than all, `lo` walks up to n. Neither index is read once the loop ends.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 30–60 s | Distinct values, −1 when absent, O(log n) |
| Baseline | 15 s | Linear scan, O(n), not coded |
| Invariant | 30 s | Say the closed-range promise out loud |
| Code | 2 min | Approach 2 |
| Trace | 2 min | Found, absent, one element, `[1, 3]` with target 3 |

This is a warm-up; the interviewer is checking that your binary search is reliable, because later questions will lean on it. If you get stuck on a boundary, stop guessing and re-read your invariant: every boundary decision is a question about what that sentence allows.

## 9. Interviewer challenges

### About boundaries

#### Why `lo <= hi` and not `lo < hi`?

**What they are testing:** whether the loop condition comes from reasoning or from a template.

**How to reason:** ask what range `[lo, hi]` means when `lo == hi`. It holds one index that has not been compared yet.

**What I say:** "My range is inclusive on both ends, so when `lo == hi` there's still one candidate. With `lo < hi` I'd exit without checking it; `[5]` with target 5 would return −1. The `lo < hi` loop is right for a half-open range `[lo, hi)`, which is the shape I'd use for finding an insertion point, with `hi = mid` instead of `mid − 1`."

**Nuance:** the two styles are both correct when used consistently; bugs come from mixing them, for example `lo < hi` with `hi = mid − 1`. See [[a3-lower-upper-bounds|Lower and Upper Bounds]] for the half-open style.

#### Why `mid + 1` and `mid − 1`, not `mid`?

**What they are testing:** whether you can see the infinite loop before it happens.

**How to reason:** `mid` has been compared and is known not to be the target, so keeping it is pointless; worse, with rounding down, `mid == lo` whenever the range has one or two elements.

**What I say:** "After the comparison I know `mid` isn't the target, so I exclude it. If I wrote `lo = mid`, then on a range of two elements, `mid` equals `lo`, and when the target is to the right `lo` never moves: an infinite loop. Excluding `mid` guarantees the range shrinks every time."

**Nuance:** both directions fail. With `lo = mid`, `[1, 3]` with target 3 repeats `lo = 0, hi = 1, mid = 0` forever. With `hi = mid`, `[5]` with target 3 has `lo = hi = mid = 0`, finds 5 > 3, sets `hi = 0` again, and repeats forever. `hi = mid` is correct only in the half-open loop, where the condition is `lo < hi` and `mid < hi` always holds.

#### Doesn't `(lo + hi) / 2` overflow?

**What they are testing:** awareness of the classic bug, and honesty about whether it applies here.

**How to reason:** compute the largest possible sum from the constraints.

**What I say:** "Not here: `lo` and `hi` are below 10^4, so the sum is under 2 × 10^4. It overflows when the two ends together exceed 2^31 − 1, which needs indices above about 10^9, or a search over a value range rather than an array. I write `lo + (hi − lo) / 2` anyway, since `hi − lo` never overflows when both are non-negative, and it computes the same value."

**Nuance:** this bug lived in the JDK's own `Arrays.binarySearch` until 2006, as the lesson [[a3-binary-search|Binary Search]] describes. `(lo + hi) >>> 1` is another fix, correct for non-negative `lo` and `hi`.

### About complexity

#### How many comparisons, exactly?

**What they are testing:** whether "O(log n)" means something concrete to you.

**How to reason:** follow the size of the range: k becomes at most ⌊k / 2⌋.

**What I say:** "At most ⌊log2 n⌋ + 1 iterations. The range halves, rounded down, each time, and it takes that many halvings to reach empty. For 10^4 elements, 14. And that's optimal for comparison-based search over ordered keys."

**Nuance:** each iteration compares `nums[mid]` with the target up to twice in Java (`==` then `<`); counted as three-way comparisons, it is one per iteration.

## 10. Follow-up questions the interviewer might ask

**"What if values can repeat, and you need the first occurrence?"**
Equality no longer ends the search. Find the first index with `nums[i] >= target` using the half-open `[lo, hi)` loop with `hi = mid`, then check that index holds the target. Still O(log n). This is lower bound from [[a3-lower-upper-bounds|Lower and Upper Bounds]].

**"Return where the target would be inserted instead of −1."**
That is [[nc-search-insert-position|Search Insert Position]]. In this code, `lo` at the end of an unsuccessful search is already that position, since everything before `lo` is smaller and everything after `hi = lo − 1` is larger.

**"What if the array is rotated, like `[9, 15, 22, -4, 1, 6]`?"**
One half around `mid` is always sorted; check whether the target lies in that half's value range to decide which half to keep. O(log n). See [[nc-search-in-rotated-sorted-array|Search in Rotated Sorted Array]].

**"What if you don't know the length, only that reads past the end return a sentinel?"**
Double an upper index (1, 2, 4, …) until it reaches a value ≥ the target or the sentinel, then binary search inside the last doubling. O(log p) where p is the target's position.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Writing from a remembered template without an invariant.** Templates differ in `<` vs `<=` and `mid` vs `mid − 1`, and mixing two of them is the usual source of bugs.
- **Claiming `(lo + hi) / 2` overflows here.** It does not with n ≤ 10^4. Say what the habit protects against instead of claiming a bug that is not there.
- **Calling the recursive version O(1) space.** Each call keeps a frame; it is O(log n).

### Implementation mistakes

> [!MISTAKE] `hi = nums.length` with a closed-range loop
> `hi` is then one past the end, and `nums[mid]` can read index n. With `[1, 3]` and target 5: mid 1, `lo = 2`; now `lo = hi = 2`, mid 2, `nums[2]` throws `ArrayIndexOutOfBoundsException`. Closed range means `hi = n − 1`.

> [!MISTAKE] `lo = mid` or `hi = mid` in the closed-range loop
> The range can stop shrinking. `lo = mid` on `[1, 3]` with target 3 loops forever, and so does `hi = mid` on `[5]` with target 3.

- **`while (lo < hi)` with `hi = n − 1`:** the last candidate is never checked; `[5]` with target 5 returns −1.
- **Returning `lo` instead of −1** when not found: that is the insertion point, which this problem does not ask for.

## 12. Pattern recognition

**The pattern:** binary search on a sorted array, closed range `[lo, hi]`, returning on equality.

**Signals in the problem statement:**

- "Sorted" plus "find".
- An explicit O(log n) requirement.
- A yes/no question about each index whose answer changes only once along the array.

**Related problems in this list:**

- [[nc-search-insert-position|Search Insert Position]]: the same search, but the answer when absent is a position, which leads to the half-open lower-bound loop.
- [[nc-guess-number-higher-or-lower|Guess Number Higher or Lower]]: the same loop over a range of numbers instead of an array, where the midpoint overflow is real.
- [[nc-sqrt-x|Sqrt(x)]]: binary search over candidate answers, with the last value whose square fits.
- [[nc-search-a-2d-matrix|Search a 2D Matrix]]: one binary search over a matrix viewed as a flattened sorted array.
- [[nc-two-sum-ii-input-array-is-sorted|Two Sum II]]: sorted input again, where binary searching each complement works but two pointers are better.

**Takeaway:** write the invariant first ("the target, if present, is in `[lo, hi]`"), and let it dictate the start values, the `<=`, and the `mid ± 1` updates.

## 13. 60-second revision card

**Key insight:** in sorted data, one comparison with the middle discards half the remaining range.

**Invariant:** if the target is present, its index is in the closed range `[lo, hi]`.

**Complexity:** O(log n) time, at most ⌊log2 n⌋ + 1 iterations (14 for n = 10^4), O(1) auxiliary space. Optimal for comparison-based search.

**Code skeleton:**

```java title="Binary search, closed range" fragment="public int search(int[] nums, int target)"
int lo = 0, hi = nums.length - 1;          // target, if present, is in [lo, hi]
while (lo <= hi) {                         // non-empty
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;
}
return -1;
```

**Main traps:**

- Closed range: `hi = n − 1`, `lo <= hi`, `mid ± 1`. Do not mix with the half-open style.
- `lo = mid` can loop forever.
- `(lo + hi) / 2` is safe here; write `lo + (hi − lo) / 2` anyway, because on value ranges up to 2^31 − 1 it is not.

**What to say in one breath:** "The target, if present, is always in `[lo, hi]`. I compare with the middle; sorted order rules out the middle and one side, so I move to `mid + 1` or `mid − 1`. The range shrinks every step, so after at most ⌊log2 n⌋ + 1 steps I've either found it or the range is empty."
