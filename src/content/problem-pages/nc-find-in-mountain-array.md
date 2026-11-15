---
problemId: nc-find-in-mountain-array
title: Find in Mountain Array
source: neetcode
sourceUrl: https://leetcode.com/problems/find-in-mountain-array/
difficulty: hard
patterns: [binary-search]
relatedLessons: [a3-binary-search, a3-lower-upper-bounds, a14-clarifying-requirements, a14-edge-cases, a14-deriving-optimization]
companies: []
timeToSolve: 30
---

## 1. Problem restatement

A mountain array rises strictly to a single highest element and then falls strictly to the end: there is a peak index p with 0 < p < n − 1, the values strictly increase from index 0 to p, and strictly decrease from p to n − 1. You cannot see the array. You get an object with two methods, `length()` and `get(k)`, which returns the element at index k. Return the **smallest** index whose element equals `target`, or −1 if there is none. Calling `get` more than 100 times makes the answer wrong, whatever it returns.

**Example 1**

- Input: `array = [1, 2, 3, 4, 5, 3, 1]`, `target = 3`
- Output: `2`
- Why: 3 appears at index 2 (on the way up) and at index 5 (on the way down). The smaller index is 2.

**Example 2**

- Input: `array = [0, 1, 2, 4, 2, 1]`, `target = 3`
- Output: `-1`
- Why: the values jump from 2 to 4 on the way up and from 4 to 2 on the way down, so 3 never appears.

**What the problem statement guarantees**

- 3 ≤ `length()` ≤ 10^4.
- 0 ≤ every value ≤ 10^9, and 0 ≤ `target` ≤ 10^9.
- The array is a mountain as defined above, so the peak is never at either end.
- The array can only be read through `get`; more than 100 calls to `get` is judged Wrong Answer.

## 2. Practice first: try it before reading on

The tools here are all standard. The difficulty is in combining them under a hard budget and getting the "smallest index" rule right. Before coding, count your calls.

**How to practise**

1. Set a timer for 30 minutes and talk out loud.
2. Ask yourself how many calls a left-to-right scan makes at the largest length, and what the budget of 100 tells you about the number of reads you can afford per element.
3. Draw a mountain. Mark a value that appears twice, once on each slope. Which occurrence must you return?
4. Write your solution, then compute the largest number of `get` calls it can make at length 10^4. Write the number down before you run anything.
5. Trace your code on Example 1, Example 2, `[1, 5, 2]` with target 2, and `[0, 1, 0]` with target 0.

> [!HINT] Hint 1: a small nudge
> Each slope on its own is sorted: one ascending, one descending. If you knew where one slope ended and the other began, what could you do on each?

> [!HINT] Hint 2: the kind of tool you need
> The top is where the array stops going up. Look at two neighbours, index k and k + 1: whether `get(k) < get(k + 1)` tells you which side of the top k is on, so you can halve the range where the top can be. Once you have it, each slope is a sorted range you can halve too.

> [!HINT] Hint 3: almost the whole plan
> First find the peak index with a range `[lo, hi]` that always contains it: if `get(mid) < get(mid + 1)` the peak is right of `mid`, otherwise it is at `mid` or left of it. Then binary search `[0, peak]` as an ascending range. If you find the target, return it: anything on the falling slope has a larger index. Only if it is missing, binary search `[peak + 1, n - 1]` with the comparisons reversed. Count: about 2 log₂ n calls for the peak and log₂ n for each slope.

**Check yourself before revealing the walkthrough**

- [ ] My code returns `2` for Example 1 and `-1` for Example 2
- [ ] It returns `2` for `[1, 5, 2]` with target 2 and `0` for `[0, 1, 0]` with target 0
- [ ] I have a number for my worst-case `get` calls at length 10^4, and it is at most 100
- [ ] I can say why the left slope is searched first and why that gives the smallest index

## 3. Interview script: understand the problem (≈3 min)

**Me:** So it's a mountain: strictly up to one peak, strictly down after it, and the peak isn't at either end. I can only read it with `get` and `length`, and I return the first index holding the target, or −1.

**Interviewer:** Right. And more than 100 calls to `get` fails.

**Me:** That budget is the real constraint. How long can the array be?

**Interviewer:** Up to ten thousand, at least three.

**Me:** Then scanning is out: ten thousand reads against a hundred allowed. A hundred is only about seven times log₂ of ten thousand, which is about 13.3. So I can afford a small, fixed number of binary searches and nothing else. Does `length()` count against the budget?

**Interviewer:** No, only `get`.

**Me:** Values?

**Interviewer:** Zero to a billion, and the target is in the same range.

**Me:** I only compare values, never add them, so `int` is fine. Strictly increasing then strictly decreasing means each slope has distinct values, but the same value can appear once on each slope. Let me try one: `[1, 3, 6, 9, 12, 10, 7, 3]`, target 3. It's at index 1 on the way up and index 7 on the way down. I return 1. Every index on the rising slope is smaller than every index on the falling slope, so if the target is on the rising slope at all, that's the answer.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| At most 100 `get` calls | The solution must use O(log n) reads with a small constant, and I must compute the exact worst case for my code, not wave at "log n". |
| 3 ≤ n ≤ 10^4 | log₂ 10^4 ≈ 13.3: each binary search over a slope costs at most 14 reads, and a peak search that reads two neighbours per step costs at most 28. n ≥ 3 means a peak with a slope on each side always exists. |
| Strictly up, then strictly down, peak not at an end | `get(k)` and `get(k + 1)` are never equal, so comparing them always says up or down. Each slope is a sorted range of distinct values. |
| 0 ≤ values, target ≤ 10^9 | Comparisons only; no overflow risk. Index arithmetic is at most about 2·10^4. |
| Return the minimum index | A value can occur twice, once per slope. The rising slope must be searched first, and the falling slope only if the target is not there. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Only `get` counts, not `length` | I call `length()` once and store it anyway. |
| The 100-call limit is per test case | Each call to my method gets a fresh budget. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| `get` may be expensive, so fewer calls is better even under the limit | It motivates the caching variant, which is optional. |
| The judge's object is the only way to read the array | No copying it out: that would take n calls. |

### Edge cases I will keep in mind

- n = 3: one element per slope, and the peak search must not read past the end.
- The target at the peak, which belongs to the rising-slope search.
- The target on both slopes (return the rising one) and only on the falling slope.
- The target at index 0, or at index n − 1.
- The target below every value or above the peak.
- The worst case for calls at n = 10^4, which I will compute exactly.

## 4. Think out loud: from first idea to best solution

Throughout: **n** is `length()`, **p** is the peak index, the **rising slope** is indices 0..p and the **falling slope** is p + 1..n − 1. Cost is counted in calls to `get`. The running example is `[1, 3, 6, 9, 12, 10, 7, 3]` (n = 8, p = 4).

The baseline is a left-to-right scan that returns the first index holding the target. It is correct by inspection, since the first match it sees has the smallest index, but it makes up to n = 10^4 calls against a budget of 100. It is not an approach here; it is the reference the tests check against. With a budget about seven times log₂ n, the question is how few binary searches the problem can be split into.

### Approach 1: Find the peak, then search the rising slope, then the falling slope (recommended)

#### What I say out loud

> "Three binary searches. First, find the peak: keep a range that always contains it, and compare `get(mid)` with `get(mid + 1)`. If the next one is bigger, I'm on the way up and the peak is to the right of `mid`. Otherwise I'm on the way down or at the peak, so the peak is at `mid` or to the left. Second, a normal ascending binary search on `0..peak`. If it finds the target, that's the answer, because every index on the falling slope is larger. Third, only if that failed, a binary search on `peak + 1..n − 1` with the comparison flipped, since that slope is descending."

> "Calls: the peak search reads two values per round over a range of 10^4, so at most 14 rounds and 28 calls. Each slope search is at most ⌊log₂ size⌋ + 1 reads. I'll compute the exact worst case after the code; it's around 54, well under 100."

#### Intuition

A mountain is two sorted arrays glued at the top. Binary search needs sorted data, so first find the glue point. The glue point itself is found by binary search too, because "is the array going up at k?" is true for every k before the peak and false from the peak on. That predicate is monotone even though the values are not.

#### Algorithm

1. `n = length()`.
2. **Peak.** `lo = 0`, `hi = n - 1`. While `lo < hi`: `mid = (lo + hi) >>> 1`; if `get(mid) < get(mid + 1)`, `lo = mid + 1`; else `hi = mid`. Then `peak = lo`.
3. **Rising slope.** Binary search `[0, peak]`: if `get(mid) == target` return `mid`; if smaller, go right; if larger, go left.
4. **Falling slope**, only if step 3 found nothing. Binary search `[peak + 1, n - 1]`: equal returns `mid`; if `get(mid)` is larger than the target, go right (values fall to the right); if smaller, go left.
5. Return −1.

Steps 3 and 4 share one helper with an `ascending` flag: "go right" when `(value < target) == ascending`.

#### Why it is correct

**Peak search.** Define `up(k)` as `get(k) < get(k + 1)` for 0 ≤ k ≤ n − 2. On a mountain, `up(k)` is true exactly for k < p: before the peak the values rise, and from the peak on they fall. **Invariant:** p is in `[lo, hi]`. Initially `[0, n − 1]` contains it. If `up(mid)`, then mid < p, so p is in `[mid + 1, hi]`. If not, mid ≥ p, so p is in `[lo, mid]`. Inside the loop `lo < hi`, so the lower middle satisfies `lo ≤ mid < hi`: `mid + 1 ≤ hi ≤ n − 1` is a valid index, and both updates shrink the range. When `lo == hi`, that index is p.

**Slope searches.** `[0, p]` is strictly increasing, so the standard binary search finds the target there if present, with the invariant "if the target is in this slope, its index is in `[lo, hi]`". `[p + 1, n − 1]` is strictly decreasing: a value bigger than the target means the target, if present, is further right; a smaller one means further left. Same invariant with the directions flipped. Each slope holds distinct values, so each search finds the only occurrence on its slope, if there is one.

**The minimum index.** The target appears at most twice: at most once per slope. Every rising-slope index (≤ p) is smaller than every falling-slope index (≥ p + 1). So if the rising search finds it, that is the smallest index and the falling slope does not need to be read. If not, the only possible occurrence is on the falling slope. If neither finds it, it is absent. The peak value is on the rising slope, so a target equal to the peak is found in step 3.

**The 25-second version to say to the interviewer:**

> "Before the peak, each element is smaller than the next; from the peak on, it's bigger. That's monotone, so I binary search the peak with a range that always contains it, comparing `get(mid)` with `get(mid + 1)`. Then each slope is sorted and I binary search it: the rising one first, because all its indices are smaller, and the falling one with flipped comparisons only if the rising one misses. That's at most 54 calls at ten thousand elements."

#### Dry run

`[1, 3, 6, 9, 12, 10, 7, 3]`, n = 8.

Peak search (the same for every target):

| lo | hi | mid | get(mid), get(mid + 1) | Update |
|---|---|---|---|---|
| 0 | 7 | 3 | 9, 12: going up | `lo = 4` |
| 4 | 7 | 5 | 10, 7: going down | `hi = 5` |
| 4 | 5 | 4 | 12, 10: going down | `hi = 4` |
| 4 | 4 | – | – | peak = 4, after 6 calls |

**Target 3** (on both slopes). Rising slope `[0, 4]`:

| lo | hi | mid | get(mid) | Update |
|---|---|---|---|---|
| 0 | 4 | 2 | 6 > 3 | `hi = 1` |
| 0 | 1 | 0 | 1 < 3 | `lo = 1` |
| 1 | 1 | 1 | 3 | found: return 1 |

9 calls. The 3 at index 7 is never read.

**Target 7** (only on the falling slope). Rising `[0, 4]`: mid 2 reads 6 < 7, `lo = 3`; mid 3 reads 9 > 7, `hi = 2`; empty. Falling `[5, 7]`:

| lo | hi | mid | get(mid) | Update |
|---|---|---|---|---|
| 5 | 7 | 6 | 7 | found: return 6 |

9 calls.

**Target 8** (absent). Rising: 6 < 8 then 9 > 8, empty. Falling `[5, 7]`: mid 6 reads 7 < 8, so on a falling slope the target would be further left: `hi = 5`; mid 5 reads 10 > 8: `lo = 6`; empty. Return −1 after 10 calls.

#### Java code

```java title="Approach 1: peak, then rising slope, then falling slope (recommended)"
class Solution {
    public int findInMountainArray(int target, MountainArray mountainArr) {
        int n = mountainArr.length();
        int lo = 0, hi = n - 1;                       // invariant: the peak is in [lo, hi]
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;                // mid < hi, so mid + 1 is a valid index
            if (mountainArr.get(mid) < mountainArr.get(mid + 1)) {
                lo = mid + 1;                         // still going up: the peak is right of mid
            } else {
                hi = mid;                             // going down: the peak is mid or left of it
            }
        }
        int peak = lo;
        int index = search(mountainArr, target, 0, peak, true);
        if (index != -1) return index;                // rising-slope indices are all smaller
        return search(mountainArr, target, peak + 1, n - 1, false);
    }

    /** Binary search for target in [lo, hi], which is ascending or descending. */
    private static int search(MountainArray arr, int target, int lo, int hi, boolean ascending) {
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1;
            int value = arr.get(mid);
            if (value == target) return mid;
            if ((value < target) == ascending) {
                lo = mid + 1;                         // the target is further right
            } else {
                hi = mid - 1;
            }
        }
        return -1;
    }
}
```

#### Time complexity

**O(log n) calls and time.** Exact count for this code:

- **Peak search.** The range starts with n elements. A round keeps `[mid + 1, hi]` (⌊size/2⌋ elements) or `[lo, mid]` (⌈size/2⌉), so after r rounds at most ⌈n / 2^r⌉ remain, and the loop stops at one element: at most ⌈log₂ n⌉ rounds, 2 calls each. For n = 10^4 that is 14 rounds and **28 calls**. (Depending on where the peak is, it is 13 or 14 rounds.)
- **Each slope search.** A `lo <= hi` binary search over s elements probes at most ⌊log₂ s⌋ + 1 times. The two slopes have p + 1 and n − 1 − p elements, which add up to n, so each is below 2^14 and needs at most **13 calls**.
- **Total.** At most 28 + 13 + 13 = **54**. I checked this by computing, for every peak position at n = 10^4, the peak rounds plus the longest possible path in each slope search: the maximum is exactly 54, for example with the peak at index 4102 and a target missing from both slopes. The test file builds that input, and the harness reports 54 as the most calls Approach 1 makes in any test case. The budget of 100 is not close.

Each call is O(1) work besides the call itself.

#### Space complexity

**O(1)** auxiliary space.

#### The bridge to the next approach

> "54 is comfortable. But the searches read some indices twice: the peak search reads both `mid` and `mid + 1`, its later rounds revisit values it already read, and the slope searches start at midpoints the peak search may have touched. If `get` were expensive, say a network call, I'd remember every value I read."

### Approach 2: The same three searches, with a cache of values already read

#### What I say out loud

> "Same algorithm, but every read goes through a small map from index to value. A second read of an index is free. It doesn't change the big-O, but it never costs extra calls and sometimes saves several."

#### Intuition

The calls are what is scarce, not memory or time. The three searches together touch O(log n) distinct indices; caching makes the count of calls equal to the count of distinct indices.

#### Algorithm

As in Approach 1, with every `get(k)` replaced by: if k is in the cache, return its value; otherwise call `get(k)`, store the value and return it.

#### Why it is correct

The array never changes, so a cached value equals what a fresh call would return. The algorithm sees exactly the same values in the same order as Approach 1 and makes the same decisions, so it returns the same index. Only the number of real calls changes, and it can only go down.

#### Dry run

`[1, 3, 6, 9, 12, 10, 7, 3]`, target 8. Peak search reads 3, 4, 5, 6, then 4 and 5 again (cached): 4 calls instead of 6. Rising slope: index 2 is new, index 3 is cached: 1 call. Falling slope: index 6 then 5, both cached: 0 calls. Total **5 calls** instead of 10, and the answer is still −1. For target 3 it is 7 calls instead of 9, and for target 7, 5 instead of 9.

#### Java code

```java title="Approach 2: the same searches with a cache"
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int findInMountainArray(int target, MountainArray mountainArr) {
        Map<Integer, Integer> cache = new HashMap<>();    // index -> value already read
        int n = mountainArr.length();
        int lo = 0, hi = n - 1;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (get(mountainArr, cache, mid) < get(mountainArr, cache, mid + 1)) lo = mid + 1;
            else hi = mid;
        }
        int peak = lo;
        int index = search(mountainArr, cache, target, 0, peak, true);
        if (index != -1) return index;
        return search(mountainArr, cache, target, peak + 1, n - 1, false);
    }

    private static int search(MountainArray arr, Map<Integer, Integer> cache, int target,
                              int lo, int hi, boolean ascending) {
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1;
            int value = get(arr, cache, mid);
            if (value == target) return mid;
            if ((value < target) == ascending) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }

    private static int get(MountainArray arr, Map<Integer, Integer> cache, int index) {
        Integer value = cache.get(index);
        if (value == null) {
            value = arr.get(index);                       // the only real call
            cache.put(index, value);
        }
        return value;
    }
}
```

#### Time complexity

**O(log n) calls.** At n = 10^4 the worst case is at most **51** calls: the same computation as above, now counting only indices not read before, gives 51, again with the peak at index 4102. The savings are small in the worst case because the slope searches mostly read new indices. Time is O(log n) expected, because each cache access is a `HashMap` operation, O(1) on average assuming hash codes spread well (small `Integer` keys do).

#### Space complexity

**O(log n)** auxiliary space for the cache: one entry per distinct index read, at most 51 here.

### Alternative: ternary search for the peak

Ternary search reads two points a third of the way in and discards a third of the range per round. It finds the peak of a strictly unimodal sequence, but it keeps two thirds per round for two reads, about 2 log₁.₅ n ≈ 45 reads at n = 10^4, against 2 log₂ n ≈ 27 for the neighbour comparison. It still fits the budget with the slope searches, but it is slower and has more boundary cases. The neighbour comparison is the better tool: it turns the peak into a monotone yes/no question, like [[nc-find-minimum-in-rotated-sorted-array|Find Minimum In Rotated Sorted Array]].

## 5. Comparison table

n is the array length. Costs are calls to `get`; the worst cases are for n = 10^4.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Linear scan (baseline, not valid here) | O(n) | O(n) | O(1) |
| 1. Peak, then two slope searches | O(log n) | O(log n) | O(1) |
| 2. Same, with a cache | O(log n) | O(log n) calls; each map operation is O(1) only on average | O(log n) |
| Alt. Ternary search for the peak | O(log n) | O(log n) | O(1) |

| Approach | Worst-case `get` calls at n = 10^4 |
|---|---|
| Linear scan | 10^4 |
| 1. Peak, then two slope searches | 54 |
| 2. Same, with a cache | 51 |
| Alt. Ternary search for the peak | about 45 for the peak alone, before the slope searches |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Linear scan | Correct by inspection | 100 times over the budget | As the test reference only |
| 1. Three binary searches | Simple, O(1) space, 54 calls is far under 100 | Rereads a few indices | The answer to give |
| 2. With a cache | Fewest calls | A map and a helper for a saving of 3 calls in the worst case | When `get` is expensive or the budget is tighter |
| Alt. Ternary search | Works on any unimodal function | More reads, more boundary cases | Continuous unimodal functions, where there is no "next element" |

## 6. Which solution to give, and when to stop optimizing

Give Approach 1, and say the call count out loud with the computation: 28 for the peak, 13 per slope, 54 in total. Interviewers ask for it, and having the number ready shows you respect the budget rather than hoping you are under it. Spend your words on the peak search's invariant (`lo < hi` with `hi = mid`, and why `mid + 1` is always in range) and on why the rising slope is searched first.

Mention the cache as an optimization if calls are expensive; do not code it unless asked. Stop there. In the worst case, any algorithm that only reads elements needs Ω(log n) reads just to decide whether the target is on a slope (it contains a sorted search), so you are within a constant factor of optimal, and the constant only matters against the budget, which you already beat by almost half.

## 7. Interview script: code it and test it

### What I say while coding

> "`n = length()`, once."

> "Peak: `lo = 0`, `hi = n - 1`, `while (lo < hi)`. The lower middle means `mid < hi`, so `mid + 1` is never past the end."

> "If `get(mid) < get(mid + 1)` I'm still climbing, `lo = mid + 1`. Else `hi = mid`, because `mid` might be the peak."

> "One helper for both slopes with an `ascending` flag. Go right when the value is below the target on the rising slope, or above it on the falling slope: `(value < target) == ascending`."

> "Rising slope first, `0..peak` inclusive, so the peak is included. Return if found. Otherwise the falling slope, `peak + 1..n - 1`."

### Testing out loud

**Normal cases:** the running example, traced above: target 3 returns 1 (both slopes), target 7 returns 6, target 8 returns −1.

**Example 1:** `[1, 2, 3, 4, 5, 3, 1]`, target 3. Peak: mid 3 (4 < 5, `lo = 4`), mid 5 (3 > 1, `hi = 5`), mid 4 (5 > 3, `hi = 4`): peak 4. Rising `[0, 4]`: mid 2 reads 3, found. Returns 2 after 7 calls; the 3 at index 5 is never read.

**Example 2:** `[0, 1, 2, 4, 2, 1]`, target 3. Peak 3. Rising `[0, 3]`: 1 < 3 (`lo = 2`), 2 < 3 (`lo = 3`), 4 > 3 (`hi = 2`). Falling `[4, 5]`: 2 < 3, so further left: `hi = 3`, empty. Returns −1 after 10 calls.

**n = 3:** `[1, 5, 2]`, target 2. Peak: mid 1 (5 > 2, `hi = 1`), mid 0 (1 < 5, `lo = 1`): peak 1. Rising `[0, 1]`: 1 < 2, `lo = 1`; 5 > 2, `hi = 0`; empty. Falling `[2, 2]`: reads 2, found. Returns 2. The peak search never read index 3: `mid + 1` was at most 2.

**Equal values at both ends:** `[0, 1, 0]`, target 0. Peak 1. Rising `[0, 1]`: mid 0 reads 0, found. Returns 0, not 2.

**Target at the peak:** `[1, 3, 6, 9, 12, 10, 7, 3]`, target 12. Rising `[0, 4]`: 6, 9, then mid 4 reads 12. Returns 4. Searching `0..peak` inclusive is what makes this work.

**Target outside the values:** target 0 on the running example walks the rising search left to an empty range and the falling search right to an empty range; target 13, above the peak, does the reverse. Both return −1.

**Largest case:** at n = 10^4 with the peak at 4102 and a target missing from both slopes, the code makes 54 calls, the most in any test.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 3 min | The budget, n, minimum index, what counts as a call |
| Plan | 4–5 min | Why scanning fails; peak search; two slope searches; the order |
| Count calls | 2 min | 28 + 13 + 13 = 54, before coding |
| Code | 8 min | Peak loop and one helper with a direction flag |
| Test | 6 min | Both slopes, falling slope only, the peak, n = 3, absent |
| Follow-ups | rest | Caching, unknown length, plateaus |

The time goes into the plan and the count. The code is three textbook loops; the risk is in the peak loop's boundaries and in the direction flag for the falling slope. If you get stuck on the peak search, ask: "for an index k, what tells me whether I'm before or after the top?"

## 9. Interviewer challenges

### About correctness

#### Why does comparing `get(mid)` with `get(mid + 1)` find the peak?

**What they are testing:** whether you see the monotone predicate behind a non-monotone array.

**How to reason:** write down, for each k, whether `get(k) < get(k + 1)`.

**What I say:** "That comparison is true for every k before the peak and false from the peak on, because the values rise strictly to the peak and fall strictly after. So it's a sorted sequence of trues then falses, and the peak is the first false. I keep a range that always contains it. True means `mid` is before the peak, so `lo = mid + 1`. False means `mid` is the peak or after it, so `hi = mid`."

**Nuance:** strictness matters. With equal neighbours (a plateau) the comparison is false on the plateau, which can sit on the rising side, and the predicate stops being monotone. See section 10.

#### Can `get(mid + 1)` go out of range? Why `lo < hi`?

**What they are testing:** boundary discipline under a call budget, where an extra or invalid call is costly.

**How to reason:** what is the largest `mid` can be?

**What I say:** "Inside the loop `lo < hi`, so the lower middle is strictly less than `hi`, at most n − 2. So `mid + 1` is at most n − 1. With `lo <= hi` the loop would continue at `lo == hi == mid`, set `hi = mid`, and never change anything: an infinite loop that burns through the budget. On the running example that version fails on its 101st call."

**Nuance:** this is the same "narrow a range that always holds the answer" loop as in [[nc-find-minimum-in-rotated-sorted-array|Find Minimum In Rotated Sorted Array]], as opposed to the "find a value that may be absent" loop of [[nc-binary-search|Binary Search]], which the slope searches use.

#### Why search the rising slope first? Could you search both and take the minimum?

**What they are testing:** whether the minimum-index rule shapes the code, and whether you think about calls.

**How to reason:** compare the index ranges of the two slopes.

**What I say:** "Every rising-slope index is at most the peak, every falling-slope index is above it. So a hit on the rising slope is the answer, and searching the falling slope would only spend calls. Searching both and taking the smaller found index is also correct, but costs up to 13 extra calls when the target is on the rising slope. Searching the falling slope first is wrong if I return its hit: on `[1, 3, 6, 9, 12, 10, 7, 3]` with target 3 that returns 7 instead of 1."

**Nuance:** the falling search must flip its comparisons. Using the ascending rule there returns −1 for target 10 on the running example, where the answer is 5.

### About the budget

#### Prove that you stay under 100 calls.

**What they are testing:** whether you can count exactly, not just say "log n".

**How to reason:** bound each of the three loops for n = 10^4.

**What I say:** "The peak loop's range starts at 10^4 and at most halves each round, rounding up, so it ends after at most ⌈log₂ 10^4⌉ = 14 rounds, two calls each: 28. A `lo <= hi` search on s elements makes at most ⌊log₂ s⌋ + 1 probes; each slope has fewer than 2^14 elements, so at most 13 each. 28 + 13 + 13 = 54. I also computed the exact maximum over every peak position, and it is 54."

**Nuance:** a quick bound without the slope sizes, 3 searches of at most 14 rounds with 2 reads in the peak rounds, gives 28 + 14 + 14 = 56, also safe. The limit of 100 leaves room for a sloppier design but not for a scan.

#### How much does caching save, and is it worth it?

**What they are testing:** whether you measure an optimization before recommending it.

**How to reason:** which indices are read twice?

**What I say:** "The peak search re-reads `mid` or `mid + 1` from the previous round in some rounds, and the slope searches sometimes land on indices the peak search read. On the running example caching cuts target 8 from 10 calls to 5. In the worst case at 10^4 it goes from 54 to 51: small, because the slope searches mostly read new indices. I'd add it only if `get` were expensive."

**Nuance:** another small saving without a map: the peak search already knows `get(peak)`, so the rising search could test it first. It is not worth the extra code at this budget.

#### Can you do it in fewer calls than about 3 log₂ n?

**What they are testing:** whether you know what is necessary and what is just convenient.

**How to reason:** what must any algorithm learn?

**What I say:** "A constant factor, maybe; the order, no. Even if the peak were known, deciding whether the target is on one slope is a search in a sorted range, which needs about log₂ n reads in the worst case. Finding the peak itself also takes Ω(log n) reads: an adversary can keep the peak's position open in a range that each read at most halves. So Θ(log n) is the right order; the constant 2 for the peak search comes from reading two neighbours per round."

**Nuance:** a peak search can be done with one new read per round by golden-section search, but the bookkeeping is much harder to get right in an interview. Caching captures part of that saving with no new reasoning.

## 10. Follow-up questions the interviewer might ask

**"What if `length()` were not available?"**
Find the length by galloping: read indices 1, 2, 4, 8, … until one is out of range (assuming out-of-range reads return a sentinel), then binary search the end. That costs about 2 log₂ n extra calls, roughly 28 more at 10^4: 54 + 28 = 82 is still under 100, but the margin is gone.

**"Return the largest index instead of the smallest."**
Search the falling slope first and the rising slope only if it misses. Same cost.

**"What if the mountain could have a flat top or flat stretches?"**
Then `get(mid) == get(mid + 1)` gives no direction, and with long plateaus no algorithm can find the peak in O(log n) reads in the worst case: a single higher element hidden in a long flat stretch forces reading most of it. Within a budget of 100 that version is not solvable in general.

**"Find a peak in an array that is not a mountain (any local maximum)."**
The same neighbour comparison works: if `nums[mid] < nums[mid + 1]`, some peak lies to the right, because the values cannot rise forever. O(log n). That is LeetCode's Find Peak Element.

**"Search a rotated sorted array instead."**
A different shape, two rising runs, but the same plan: find the break point, or decide per step which half is sorted. See [[nc-search-in-rotated-sorted-array|Search in Rotated Sorted Array]].

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Returning the first hit from either slope.** The minimum-index rule makes the order of the two searches part of the correctness, not a detail.
- **Assuming a value appears once.** It can appear once per slope.
- **"It's O(log n), so it's under 100."** Big-O hides the constant. Count: three searches with two reads per peak round is 54; a careless design with several full searches might not fit.
- **Searching the whole array with one binary search.** The array is not sorted; a single search for the target can go the wrong way at the first probe.

### Implementation mistakes

> [!MISTAKE] Searching the falling slope first and returning its hit
> On `[1, 3, 6, 9, 12, 10, 7, 3]` with target 3 this returns 7; the answer is 1.

> [!MISTAKE] Using the ascending comparison on the falling slope
> On the running example with target 10 it walks right past index 5 and returns −1; the answer is 5. On a falling slope a value above the target means "go right".

> [!MISTAKE] `while (lo <= hi)` in the peak search with `hi = mid`
> When `lo == hi`, the update changes nothing and the loop repeats until the budget runs out: on the running example it fails on the 101st call.

- **Searching the falling slope from `peak` instead of `peak + 1`.** Harmless for correctness but wastes a call; searching the rising slope only up to `peak - 1` is a real bug, since a target equal to the peak is then missed by both searches unless the falling search starts at `peak`.
- **Comparing `get(mid - 1)` with `get(mid)`** in the peak search with the lower middle: when `mid` is 0 that reads index −1.
- **Calling `get` twice for the same `mid` in a slope search** (once for `==`, once for `<`). It doubles the cost of the slope searches: still under 100 here (28 + 26 + 26 = 80), but for no reason. Store the value.

## 12. Pattern recognition

**The pattern:** binary search on a monotone predicate, then binary search on sorted pieces. A shape that is not sorted can still be split by binary search if some yes/no question about a position is monotone, here "is the array still rising at k?".

**Signals in the problem statement:**

- A hard limit on reads, around a small multiple of log₂ n.
- An array described by its shape (rising then falling, rotated, bitonic).
- Duplicated values across the pieces and a "smallest index" rule.

**Related problems in this list:**

- [[nc-binary-search|Binary Search]]: the slope searches, in their basic form.
- [[nc-find-minimum-in-rotated-sorted-array|Find Minimum In Rotated Sorted Array]]: the same `lo < hi`, `hi = mid` boundary search, with a cliff instead of a peak.
- [[nc-search-in-rotated-sorted-array|Search in Rotated Sorted Array]]: searching a target in an array made of two sorted pieces.
- [[nc-guess-number-higher-or-lower|Guess Number Higher or Lower]]: another problem where the data is only reachable through an API, so calls are the cost.
- [[nc-median-of-two-sorted-arrays|Median of Two Sorted Arrays]]: binary search on a position defined by a comparison across a boundary.

**Takeaway:** when an array is not sorted but has a known shape, binary search for the place where the shape changes, then binary search each sorted piece, in the order the question demands, and count your reads.

## 13. 60-second revision card

**Key insight:** `get(k) < get(k + 1)` is true before the peak and false from it, so the peak is found by binary search. Each slope is then sorted.

**Invariant:** peak search: the peak is in `[lo, hi]`; `while (lo < hi)`, `lo = mid + 1` or `hi = mid`. Slope search: if the target is on this slope, it is in `[lo, hi]`.

**Complexity:** O(log n) time and calls, O(1) space. At n = 10^4: at most 28 + 13 + 13 = 54 calls.

**Code skeleton:**

```java title="Peak, then two slope searches" fragment="public int findInMountainArray(int target, MountainArray mountainArr)"
int n = mountainArr.length(), lo = 0, hi = n - 1;
while (lo < hi) {
    int mid = (lo + hi) >>> 1;
    if (mountainArr.get(mid) < mountainArr.get(mid + 1)) lo = mid + 1; else hi = mid;
}
int peak = lo;
for (int pass = 0; pass < 2; pass++) {             // rising slope first, then falling
    boolean ascending = pass == 0;
    int l = ascending ? 0 : peak + 1, h = ascending ? peak : n - 1;
    while (l <= h) {
        int mid = (l + h) >>> 1, value = mountainArr.get(mid);
        if (value == target) return mid;
        if ((value < target) == ascending) l = mid + 1; else h = mid - 1;
    }
}
return -1;
```

**Main traps:**

- Searching the falling slope first, or returning its hit before the rising slope is checked.
- Not flipping the comparison on the falling slope.
- `lo <= hi` with `hi = mid` in the peak search.
- Not counting calls.

**What to say in one breath:** "Rising-ness is monotone, so I binary search the peak comparing neighbours; then binary search the rising slope, and only if that misses, the falling slope with flipped comparisons, which gives the smallest index; 54 calls at most at ten thousand elements, O(1) space."
