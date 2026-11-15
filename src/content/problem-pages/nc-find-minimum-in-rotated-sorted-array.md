---
problemId: nc-find-minimum-in-rotated-sorted-array
title: Find Minimum In Rotated Sorted Array
source: neetcode
sourceUrl: https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/
difficulty: medium
patterns: [binary-search]
relatedLessons: [a3-binary-search, a3-lower-upper-bounds, a14-edge-cases, a14-deriving-optimization]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

Someone took an array of distinct integers sorted in ascending order and rotated it: they repeatedly moved the last element to the front, somewhere between 1 and n times. You get the result and must return its smallest element, in O(log n) time.

**Example 1**

- Input: `nums = [5, 6, 7, 1, 2, 3, 4]`
- Output: `1`
- Why: the original array was `[1, 2, 3, 4, 5, 6, 7]`, rotated 4 times. The array climbs from 5 to 7, drops to 1, then climbs again. The smallest element sits right after the drop.

**Example 2**

- Input: `nums = [8, 10, 12, 14]`
- Output: `8`
- Why: rotating an array of 4 elements 4 times gives back the original. There is no drop, and the minimum is the first element. Any solution must handle this case.

**What the problem statement guarantees**

- The values are distinct.
- The array was sorted ascending, then rotated between 1 and n times, so it may come back fully sorted.
- 1 ≤ n ≤ 5000, and −5000 ≤ `nums[i]` ≤ 5000.
- The algorithm must run in O(log n) time.

## 2. Practice first: try it before reading on

If you have not solved this yourself, stop here. The idea is short; getting the loop exactly right is the actual exercise.

**How to practise**

1. Set a timer for 20 minutes and talk out loud.
2. Write the linear solution in one sentence. Then ask what the O(log n) requirement forces on you.
3. Draw the array as a line graph: two rising segments with a cliff between them. Where is the minimum on that picture?
4. Code your best idea and trace it on Example 1, Example 2, `[2, 1]` and `[3, 4, 5, 1, 2]`.
5. For your loop, say what is true about `lo` and `hi` before every iteration, and why the loop cannot run forever.

> [!HINT] Hint 1: a small nudge
> Pick an index in the middle. Without looking at anything else, can you tell whether it is before the cliff or after it? You may compare it with one other element.

> [!HINT] Hint 2: the kind of tool you need
> Everything after the cliff is smaller than everything before it, and the last element is always after the cliff (or there is no cliff). So comparing the middle element with the last element of the current range tells you which side of the cliff the middle is on. That lets you throw away half the range, every time.

> [!HINT] Hint 3: almost the whole plan
> Keep a range `[lo, hi]` that always contains the minimum. While `lo < hi`, look at `mid`. If `nums[mid] > nums[hi]`, the cliff is after `mid`, so the minimum is in `[mid + 1, hi]`. Otherwise `mid` through `hi` is rising, so the minimum is in `[lo, mid]` (keep `mid`: it might be the answer). When the range has one element, that is the minimum. Then try the same thing comparing with `nums[lo]` instead, on `[1, 2, 3, 4, 5]`, and see what breaks.

**Check yourself before revealing the walkthrough**

- [ ] My code returns `1` for Example 1 and `8` for Example 2
- [ ] It returns `1` for `[2, 1]` and for `[3, 4, 5, 1, 2]`
- [ ] I can state the invariant my loop keeps, and why each iteration shrinks the range
- [ ] I can explain why I compare with the element I chose and not the other end

## 3. Interview script: understand the problem (≈2 min)

**Me:** So the array was sorted ascending, then rotated some number of times, and I return the minimum value, not its index?

**Interviewer:** The value.

**Me:** Are the values distinct?

**Interviewer:** Yes, all unique.

**Me:** Good, that matters: it means two different positions never compare equal, so a comparison always tells me something. Rotated between 1 and n times: so rotated n times, it is sorted again?

**Interviewer:** Right, that's allowed.

**Me:** So I have to handle the case with no cliff at all. Sizes?

**Interviewer:** n from 1 to 5000, values from −5000 to 5000. And you need O(log n).

**Me:** With n at most 5000 and values that small, nothing overflows, including `lo + hi`. Let me try one by hand: `[5, 6, 7, 1, 2, 3, 4]`. It rises 5, 6, 7, drops to 1, rises again to 4. The minimum is right after the drop: 1. And every element after the drop (1 to 4) is smaller than every element before it (5 to 7), because they were the first part of the sorted array before it was rotated.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| Distinct values | `nums[mid]` and `nums[hi]` are never equal when `mid ≠ hi`, so the comparison has exactly two outcomes and each one decides which half to keep. With duplicates this breaks (see section 10). |
| Ascending, then rotated 1 to n times | The array is two rising runs, with every element of the second run smaller than every element of the first, or a single rising run if it was rotated n times. That second shape must not be a special case that goes wrong. |
| 1 ≤ n ≤ 5000 | n = 1 is possible: the loop must handle a single element. `lo + hi` is at most 9998, far from overflow. |
| −5000 ≤ `nums[i]` ≤ 5000 | No arithmetic on values at all, only comparisons. |
| O(log n) required | The linear scan is a baseline only; the answer must discard a constant fraction of the range per step. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Return the value, not the index | `return nums[lo]` at the end. (Returning the index is the same search; see section 10.) |
| A fully sorted array is a valid input | The comparison I choose must give the right answer when there is no cliff. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| `nums` is read-only | I only read it. |
| A probe means reading one element | That is what "O(log n)" counts here, and the lower-bound argument in section 9 uses this model. |

### Edge cases I will keep in mind

- n = 1: the loop must not run, and must not read outside the array.
- n = 2, rotated (`[2, 1]`) and not rotated (`[1, 2]`).
- Fully sorted (Example 2).
- The minimum at the last index (`[2, 3, 4, 5, 1]`) or right after index 0 (`[5, 1, 2, 3, 4]`).

## 4. Think out loud: from first idea to best solution

Throughout: **n** is the length of `nums`. "The cliff" is the one place where `nums[i] > nums[i + 1]`, if there is one; the minimum is at `i + 1`, or at index 0 if there is no cliff. The **first run** is the part before the cliff, the **second run** the part from the minimum to the end.

### Approach 1: Linear scan

#### What I say out loud

> "The baseline: the minimum of any array is one pass with a running minimum. O(n). It ignores the structure completely and doesn't meet the O(log n) requirement, but it's certainly correct and I'll use it to test the faster one."

#### Intuition

The minimum of a collection is the smallest of its elements; checking each one once finds it.

#### Algorithm

1. `min = nums[0]`.
2. For every other element, `min = Math.min(min, nums[i])`.
3. Return `min`.

#### Why it is correct

After processing index i, `min` is the smallest of `nums[0..i]`. At the end that is the whole array. It returns a value from the array, and no element is skipped, so it cannot miss the minimum.

#### Dry run

`nums = [5, 6, 7, 1, 2, 3, 4]`: `min` goes 5, 5, 5, 1, 1, 1, 1. Returns 1.

#### Java code

```java title="Approach 1: linear scan"
class Solution {
    public int findMin(int[] nums) {
        int min = nums[0];
        for (int i = 1; i < nums.length; i++) {
            min = Math.min(min, nums[i]);
        }
        return min;
    }
}
```

#### Time complexity

**O(n)** in every case: n − 1 comparisons. That breaks the O(log n) requirement.

#### Space complexity

**O(1)** auxiliary space.

#### The bridge to the next approach

> "The scan doesn't use the fact that the array is two sorted runs. I could stop at the cliff, the first `i` with `nums[i] > nums[i + 1]`, but that's still linear when the cliff is near the end. To get log n I need to throw away half the array with one look. So: if I look at the middle element, can I tell which side of the cliff it's on?"

> "Compare it with something. The last element is always in the second run, or the whole array is one run. Every second-run element is smaller than every first-run element. So if the middle is bigger than the last element, the middle is in the first run and the minimum is to its right. If it's smaller, the middle is in the second run, and everything from the middle to the end is rising, so the minimum is at the middle or to its left. Either way half the range goes."

### Approach 2: Binary search, comparing with the right end (recommended)

#### What I say out loud

> "I keep a range `[lo, hi]` that always contains the minimum. While it has more than one element, I take `mid` and compare `nums[mid]` with `nums[hi]`. If `nums[mid]` is bigger, the cliff is between them, so the minimum is in `mid + 1` to `hi`. If it's smaller, `mid` to `hi` is rising, so the minimum is in `lo` to `mid`, and I keep `mid` because it might be the answer. When `lo == hi`, that's the minimum."

> "The loop condition is `lo < hi`, not `lo <= hi`: I'm not searching for a value that may be absent, I'm narrowing a range that always holds the answer, and I stop when it's one element. It terminates because `mid` is strictly less than `hi`, so both updates shrink the range."

#### Intuition

Picture the array as a graph: a rising line, a cliff, a lower rising line. The right end of the current range is always on the lower line. Any point higher than it must be on the upper line, before the cliff; any point lower than it is on the lower line, from which the graph only rises to the right. One comparison with the right end places `mid` on the picture.

#### Algorithm

1. `lo = 0`, `hi = n - 1`.
2. While `lo < hi`:
   1. `mid = (lo + hi) >>> 1`.
   2. If `nums[mid] > nums[hi]`: `lo = mid + 1`.
   3. Else: `hi = mid`.
3. Return `nums[lo]`.

#### Why it is correct

**Invariant:** the index of the minimum, call it m, is in `[lo, hi]`.

- **Initially** the range is the whole array.
- **Why `hi` is always in the second run.** Every index from m to n − 1 is in the second run (from the minimum to the end the array rises). The invariant says `hi ≥ m`, so `hi` is in the second run. If the array is not rotated, m = 0 and the whole array is the "second run".
- **Case `nums[mid] > nums[hi]`.** If `mid` were in the second run, then `mid < hi` would both be in the rising part and `nums[mid] < nums[hi]`. So `mid` is in the first run, before the cliff, which means `mid < m`. The minimum is in `[mid + 1, hi]`: setting `lo = mid + 1` keeps the invariant.
- **Case `nums[mid] < nums[hi]`** (the values are distinct and `mid < hi`, so the two are never equal). If `mid` were in the first run, then `nums[mid]` would be larger than every second-run value, including `nums[hi]`. So `mid` is in the second run: `m ≤ mid`. Setting `hi = mid` keeps the invariant. `mid` stays in the range because it may be m itself.
- **Termination.** Inside the loop `lo < hi`, so `mid = ⌊(lo + hi) / 2⌋` satisfies `lo ≤ mid < hi`. Then `lo = mid + 1` moves `lo` up by at least one, and `hi = mid` moves `hi` down by at least one. The range strictly shrinks and the loop ends.
- **At the end** `lo == hi`, and the invariant says the minimum is there.

**Why `nums[hi]` and not `nums[lo]`.** The argument above needs a reference point whose run is known. `hi` is pinned to the second run by the invariant. `lo` is not pinned: it starts in the first run, but after `lo = mid + 1` it can land exactly on m, and from then on the range `[lo, hi]` is entirely rising. In a rising range, `nums[mid] ≥ nums[lo]` is also true, so the same comparison result means "mid is before the cliff" in one situation and "there is no cliff" in the other. The naive `nums[lo]` version (`if (nums[mid] >= nums[lo]) lo = mid + 1; else hi = mid;`) returns 5 for `[1, 2, 3, 4, 5]` and 2 for `[3, 4, 5, 1, 2]`. In the second input, `lo` reaches index 3, the minimum, and the next comparison pushes it past.

A `nums[lo]` version can be made correct by first asking "is this range sorted?" (`nums[lo] < nums[hi]`) and returning `nums[lo]` if so, before comparing `mid` with `lo`. That works, but it is one more branch to get right, and the `nums[hi]` comparison needs none.

**The 25-second version to say to the interviewer:**

> "The range `[lo, hi]` always contains the minimum, so `hi` is always at or after it, in the low rising part. If `nums[mid]` is bigger than `nums[hi]`, `mid` must be before the cliff, and the minimum is right of `mid`. If it's smaller, `mid` is in the low part, which only rises to the right, so the minimum is at `mid` or left of it. `mid` is always strictly below `hi`, so the range shrinks every step, and when one element is left, that's the minimum."

#### Dry run

`nums = [4, 5, 6, 7, 0, 1, 2]`

| lo | hi | mid | nums[mid] vs nums[hi] | Update |
|---|---|---|---|---|
| 0 | 6 | 3 | 7 > 2 | `lo = 4` |
| 4 | 6 | 5 | 1 < 2 | `hi = 5` |
| 4 | 5 | 4 | 0 < 1 | `hi = 4` |
| 4 | 4 | – | – | stop, return `nums[4] = 0` |

Example 1, `[5, 6, 7, 1, 2, 3, 4]`, where the first probe lands after the cliff:

| lo | hi | mid | nums[mid] vs nums[hi] | Update |
|---|---|---|---|---|
| 0 | 6 | 3 | 1 < 4 | `hi = 3` |
| 0 | 3 | 1 | 6 > 1 | `lo = 2` |
| 2 | 3 | 2 | 7 > 1 | `lo = 3` |
| 3 | 3 | – | – | stop, return 1 |

#### Java code

```java title="Approach 2: binary search against nums[hi] (recommended)"
class Solution {
    public int findMin(int[] nums) {
        int lo = 0, hi = nums.length - 1;     // invariant: the minimum's index is in [lo, hi]
        while (lo < hi) {                     // stop when one candidate is left
            int mid = (lo + hi) >>> 1;        // lo <= mid < hi
            if (nums[mid] > nums[hi]) {
                lo = mid + 1;                 // mid is before the cliff: the minimum is right of it
            } else {
                hi = mid;                     // mid..hi is rising: the minimum is at mid or left of it
            }
        }
        return nums[lo];
    }
}
```

#### Time complexity

**O(log n) in every case.** The range starts with n elements. Each iteration keeps either `[mid + 1, hi]` or `[lo, mid]`, and with `mid` the lower middle each of those holds at most ⌈size / 2⌉ elements. So the loop runs about log₂ n times: at most 13 for n = 5000.

#### Space complexity

**O(1)** auxiliary space: three indices.

### Alternative: find the cliff by binary search on "is this element in the first run?"

The same search can be phrased as a lower bound: the predicate "`nums[i] < nums[0]`" is false for the first run and true for the second, so the minimum is at the first index where it is true, or at index 0 if it is never true (the unrotated case). That is a correct and useful framing, the one from [[a3-lower-upper-bounds|lower and upper bounds]], and it makes the monotone predicate explicit. It needs the unrotated case handled separately (check `nums[0] < nums[n - 1]` first), which is exactly the special case the `nums[hi]` comparison avoids. Mention it if the interviewer likes the predicate view; code Approach 2.

## 5. Comparison table

n = length of `nums`. Nothing is hashed or randomized, so expected and worst-case times agree.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Linear scan | O(n) | O(n) | O(1) |
| 2. Binary search against `nums[hi]` | O(log n) | O(log n) | O(1) |
| Alt. Lower bound on `nums[i] < nums[0]` | O(log n) | O(log n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Linear scan | Correct by inspection, since it reads every element | Fails the O(log n) requirement | Baseline, and as the reference in tests |
| 2. Against `nums[hi]` | No special cases; unrotated input handled by the same comparison | Needs the "hi is always in the low run" argument | The answer to give |
| Alt. Lower bound | Makes the monotone predicate explicit | Separate check for the unrotated case | If you think in predicates, or the interviewer asks for the rotation index |

## 6. Which solution to give, and when to stop optimizing

Give Approach 2. State the linear scan in a sentence, then the cliff picture, then the comparison with `nums[hi]` and its invariant. Spend your words on why `hi` is the right reference and why `hi = mid` (not `mid - 1`) and `lo < hi` belong together.

O(log n) is optimal in the worst case for algorithms that learn the array only by reading elements: section 9 gives an adversary argument showing Ω(log n) reads are needed. Stop once you have traced the unrotated case and a two-element case.

## 7. Interview script: code it and test it

### What I say while coding

> "`lo = 0`, `hi = n - 1`. The invariant: the minimum is in `[lo, hi]`."

> "`while (lo < hi)`: when they meet, one candidate is left, and it's the answer."

> "`mid = (lo + hi) >>> 1`, the lower middle, so `mid < hi` always: that's why I can compare against `nums[hi]` without comparing an element with itself, and why `hi = mid` still shrinks the range."

> "Bigger than `nums[hi]`: `lo = mid + 1`, since `mid` itself is before the cliff and can't be the minimum. Otherwise `hi = mid`, keeping `mid`."

### Testing out loud

**Normal case:** `[4, 5, 6, 7, 0, 1, 2]`: as in the dry run, returns 0.

**Not rotated (Example 2):** `[8, 10, 12, 14]`. `mid = 1`: 10 < 14, `hi = 1`. `mid = 0`: 8 < 10, `hi = 0`. Returns 8. No special case was needed: in a rising range every `nums[mid]` is below `nums[hi]`, so `hi` walks left to 0.

**n = 1:** `[7]`. `lo = hi = 0`, the loop does not run, returns 7.

**n = 2:** `[2, 1]`: `mid = 0`, 2 > 1, `lo = 1`, returns 1. `[1, 2]`: `mid = 0`, 1 < 2, `hi = 0`, returns 1.

**Minimum at the end:** `[2, 3, 4, 5, 1]`. `mid = 2`: 4 > 1, `lo = 3`. `mid = 3`: 5 > 1, `lo = 4`. Returns 1.

**Minimum near the start:** `[5, 1, 2, 3, 4]`. `mid = 2`: 2 < 4, `hi = 2`. `mid = 1`: 1 < 2, `hi = 1`. `mid = 0`: 5 > 1, `lo = 1`. Returns 1.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2 min | Distinct values, value or index, the fully sorted case |
| Baseline and picture | 2 min | Linear scan; the two-runs-and-a-cliff picture |
| Derive the comparison | 3–4 min | Which end to compare with, and why |
| Code | 3 min | Eight lines; say the invariant while typing |
| Test | 3–4 min | Unrotated, n = 1, n = 2, minimum at the end |
| Follow-ups | rest | Duplicates, returning the rotation count |

Most of the risk is in the loop details (`<` vs `<=`, `mid` vs `mid - 1`), so the testing time is well spent. If the comparison won't come, draw the picture and ask: "which element do I know for sure is in the low part?"

## 9. Interviewer challenges

### About correctness

#### Why compare with `nums[hi]` instead of `nums[lo]`?

**What they are testing:** whether you understand the reference point or copied a template.

**How to reason:** for a comparison to tell you which side of the cliff `mid` is on, the reference must be on a known side. Which end does the invariant pin down?

**What I say:** "The invariant says the minimum is in `[lo, hi]`, so `hi` is at or after the minimum, always in the low rising part. Comparing with it is unambiguous: bigger means before the cliff, smaller means after. `lo` isn't pinned. It can land exactly on the minimum, and then the range is fully sorted, and `nums[mid] ≥ nums[lo]` looks the same as 'mid is before the cliff'. The naive `nums[lo]` version returns 5 on `[1, 2, 3, 4, 5]`, and 2 on `[3, 4, 5, 1, 2]`."

**Nuance:** a `nums[lo]` version is fine if it first returns `nums[lo]` whenever `nums[lo] < nums[hi]` (the range is sorted). It is a correct variant, just with one more case.

#### Why `hi = mid` and not `hi = mid - 1`? And why `lo < hi`?

**What they are testing:** whether the loop details follow from the invariant.

**How to reason:** in the "smaller" branch, can `mid` be the answer? And with `hi = mid`, what loop condition still terminates?

**What I say:** "When `nums[mid] < nums[hi]`, `mid` might be the minimum itself, so I can't drop it: `hi = mid`. In the other branch `mid` is before the cliff and can't be the minimum, so `lo = mid + 1`. With `lo < hi`, the lower middle is strictly below `hi`, so `hi = mid` shrinks the range. With `lo <= hi` the loop would reach `lo == hi == mid`, set `hi = mid` and never change anything again: an infinite loop."

**Nuance:** this is the "search a range that always holds the answer" shape, as opposed to the "search for a value that may be absent" shape of [[nc-binary-search|Binary Search]], which uses `lo <= hi` and `mid ± 1`.

#### Why the lower middle? What if `mid` rounded up?

**What they are testing:** off-by-one awareness.

**How to reason:** check `lo + 1 == hi`.

**What I say:** "With two elements left, the upper middle is `hi` itself. Then I'd compare `nums[hi]` with itself, go to the else branch, set `hi = mid = hi`, and loop forever. The lower middle is always strictly below `hi`, which both comparisons need."

**Nuance:** `(lo + hi) >>> 1` and `lo + (hi - lo) / 2` both round down for non-negative indices. Overflow is not a concern at n ≤ 5000, but the habit costs nothing.

### About complexity

#### Can you do better than O(log n)?

**What they are testing:** whether you can argue a lower bound, carefully.

**How to reason:** an adversary answers every read so as to keep as many candidate positions for the minimum as possible.

**What I say:** "Not in the worst case, if the algorithm learns the array only by reading elements. An adversary can keep a range of positions where the minimum could still be. When I read index i, it decides whether i is before or after the cliff, choosing whichever side leaves more candidates, and it can always give a value consistent with that, for example i for an index before the cliff and i − 5000 for one after it. Each read at most halves the candidates, and there are n to start with, so about log₂ n reads are needed."

**Nuance:** the bound is about worst-case inputs. For special families, such as rotations of exactly 1..n, a single read reveals the rotation; the adversary argument works because general inputs leave the values free.

## 10. Follow-up questions the interviewer might ask

**"What if the array can contain duplicates?"**
Then `nums[mid] == nums[hi]` is possible and tells you nothing: in `[1, 1, 1, 0, 1]` and `[1, 0, 1, 1, 1]` the middle and the end are equal, but the minimum is on different sides. The standard fix is `hi--` in that case (safe, because `nums[hi]` has a copy at `mid`, so dropping it cannot lose the minimum value). The worst case becomes O(n), for example all equal values but one. This is the same issue as [[nc-search-in-rotated-sorted-array-ii|Search in Rotated Sorted Array II]].

**"Return how many times the array was rotated."**
The index of the minimum, `lo` at the end, is the number of rotations modulo n (an array rotated n times reports 0). Same O(log n).

**"Now search for a target in it."**
Either find the minimum's index with this search and then binary search the correct run, or search in one pass by asking which half of each range is sorted: [[nc-search-in-rotated-sorted-array|Search in Rotated Sorted Array]]. Both are O(log n).

**"What if the array were rotated the other way?"**
Rotating right by k is rotating left by n − k; the result is still two rising runs, so nothing changes.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Comparing with `nums[lo]` without handling the sorted range.** It is the natural first attempt and it fails on unrotated input and whenever `lo` lands on the minimum.
- **Treating the unrotated array as a separate case.** It isn't one with the `nums[hi]` comparison; adding a special branch adds risk for nothing.
- **Thinking of it as a search for a value.** There is no target. It is a search for a boundary, the cliff, and its loop shape follows from that.

### Implementation mistakes

> [!MISTAKE] Comparing with `nums[lo]`
> `if (nums[mid] >= nums[lo]) lo = mid + 1; else hi = mid;` returns 5 for `[1, 2, 3, 4, 5]` and 2 for `[3, 4, 5, 1, 2]`.

> [!MISTAKE] `while (lo <= hi)` with `hi = mid`
> When `lo == hi`, `mid == hi`, the else branch sets `hi = mid` and nothing changes: the loop never ends.

- **`hi = mid - 1` in the else branch.** It throws away `mid`, which can be the minimum. On `[3, 1, 2]`: `mid = 1`, 1 < 2, and `hi = 0` discards the answer; the method returns 3.
- **Returning `nums[mid]` from inside the loop** when some condition "looks" like the minimum. The loop never needs to return early; return `nums[lo]` after it.

## 12. Pattern recognition

**The pattern:** binary search on a boundary. The array splits into a part where some property holds and a part where it does not, and one comparison per probe tells you which part you are in. Keep a range that always contains the boundary and shrink it.

**Signals in the problem statement:**

- "Sorted, then rotated": two sorted runs with a known relation between them.
- An explicit O(log n) requirement on an array problem.
- No target value; the answer is a position defined by the shape of the data.

**Related problems in this list:**

- [[nc-binary-search|Binary Search]]: the basic loop, in its "find a value that may be absent" form, to contrast with this "narrow to one candidate" form.
- [[nc-search-in-rotated-sorted-array|Search in Rotated Sorted Array]]: the same rotated structure, now with a target.
- [[nc-search-in-rotated-sorted-array-ii|Search in Rotated Sorted Array II]]: what duplicates do to the comparison.
- [[nc-rotate-array|Rotate Array]]: how the rotation itself is performed.
- [[nc-koko-eating-bananas|Koko Eating Bananas]]: another search for the first position where a monotone predicate turns true.

**Takeaway:** in a rotated sorted array, compare the middle with an end whose side of the cliff you know for certain. Here that is `hi`, because the range always contains the minimum.

## 13. 60-second revision card

**Key insight:** the last element of the range is always in the low run. `nums[mid] > nums[hi]` means `mid` is before the cliff; otherwise `mid..hi` is rising.

**Invariant:** the minimum's index is in `[lo, hi]`. Loop while `lo < hi`; `lo = mid + 1` or `hi = mid`; `mid < hi` guarantees progress.

**Complexity:** O(log n) time, O(1) space. Ω(log n) reads are needed in the worst case.

**Code skeleton:**

```java title="Find the minimum" fragment="public int findMin(int[] nums)"
int lo = 0, hi = nums.length - 1;
while (lo < hi) {
    int mid = (lo + hi) >>> 1;
    if (nums[mid] > nums[hi]) lo = mid + 1;   // mid before the cliff
    else hi = mid;                            // mid..hi rising, mid may be the answer
}
return nums[lo];
```

**Main traps:**

- Comparing with `nums[lo]`: wrong on sorted ranges.
- `lo <= hi` with `hi = mid`: infinite loop.
- `hi = mid - 1`: can discard the minimum.

**What to say in one breath:** "The range always contains the minimum, so `hi` is in the low rising part. If `nums[mid]` beats `nums[hi]`, mid is before the cliff and I go right of it; otherwise mid to hi is rising and I keep mid as the new hi. The range shrinks every step and the last element standing is the minimum: O(log n), O(1) space, and the sorted case needs no special handling."
