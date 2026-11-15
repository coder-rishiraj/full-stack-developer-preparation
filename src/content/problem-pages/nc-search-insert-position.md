---
problemId: nc-search-insert-position
title: Search Insert Position
source: neetcode
sourceUrl: https://leetcode.com/problems/search-insert-position/
difficulty: easy
patterns: [binary-search]
relatedLessons: [a3-lower-upper-bounds, a3-binary-search, a14-edge-cases, a14-manual-testing]
companies: []
timeToSolve: 8
---

## 1. Problem restatement

You get a sorted array of distinct integers and a `target`. If the target is in the array, return its index. If it is not, return the index where it would have to be inserted so that the array stays sorted. The method must run in O(log n) time, where n is the length of the array.

**Example 1**

- Input: `nums = [2, 5, 8, 11, 14]`, `target = 9`
- Output: `3`
- Why: 9 is not present. It is bigger than 8 (index 2) and smaller than 11 (index 3), so inserting it at index 3 keeps the order: `[2, 5, 8, 9, 11, 14]`.

**Example 2**

- Input: `nums = [2, 5, 8, 11, 14]`, `target = 16`
- Output: `5`
- Why: 16 is bigger than every element, so it goes after the last one. Index 5 is one past the end of the array, and that is a valid answer.

**What the problem statement guarantees**

- 1 ≤ `nums.length` ≤ 10^4.
- The values are distinct and sorted in ascending order.
- Every value and the target lie between −10^4 and 10^4, inclusive.
- The running time must be O(log n).

## 2. Practice first: try it before reading on

The search itself is familiar; the practice here is in deciding exactly which index to return, including one that is not a valid index of the array. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 8 minutes and talk out loud.
2. Write down every value your method can return. How many are there for an array of length n?
3. Describe the answer as "the first index where something becomes true". What is that something?
4. Write the code, then trace it with a target smaller than everything, larger than everything, and equal to an element.

> [!HINT] Hint 1: a small nudge
> Whether the target is present or not, the answer is the same kind of index: the first position whose value is not smaller than the target. Check that this description covers both cases.

> [!HINT] Hint 2: the kind of tool you need
> Along the array, "is `nums[i]` at least the target?" is false, false, …, then true, true, … . You are looking for where it switches, and halving the range works for that as well as for finding an exact value.

> [!HINT] Hint 3: almost the whole plan
> Keep two indices so that everything before the first is known to be too small and everything from the second on is known to be large enough. Start the second at n, not n − 1, because the answer can be n. Look at the middle: too small moves the first index past it; large enough moves the second index onto it. Stop when they meet.

**Check yourself before revealing the walkthrough**

- [ ] My method can return n, and it never reads `nums[n]`
- [ ] I can say why one update is `mid + 1` and the other is `mid`
- [ ] It returns 0 for `[7]` with target 3, 1 for `[7]` with target 9, and 0 for `[7]` with target 7
- [ ] I can state the invariant that makes the loop correct

## 3. Interview script: understand the problem (≈1 min)

**Me:** So if the target is there I return its index, and if not, the index where it would go to keep the array sorted. If the target is bigger than everything, that's n, one past the end?

**Interviewer:** Yes.

**Me:** Then the answer is one of n + 1 positions, 0 through n. Are the values distinct?

**Interviewer:** Yes, distinct and ascending.

**Me:** Good; with duplicates I'd need to ask whether to insert before or after equal values. Sizes are at least one element, up to 10^4, values and target from −10^4 to 10^4 inclusive. Indices stay tiny, so no overflow concern, and the values are only compared.

**Interviewer:** And O(log n).

**Me:** By hand on `[2, 5, 8, 11, 14]` with target 9: 8 is smaller, 11 is not, so the answer is 11's index, 3. With target 11 it's also 3. So "found" and "insert here" are the same rule: the first index whose value is at least the target.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| Sorted ascending | "`nums[i] >= target`" is false up to some point and true after it, so the boundary can be found by halving. |
| Distinct values | The first index with `nums[i] >= target` is the target's only index when it is present. No tie rule needed. |
| 1 ≤ n ≤ 10^4 | Indices and `lo + hi` stay far below the `int` limit. At most ⌊log2 10^4⌋ + 1 = 14 iterations. |
| −10^4 ≤ values, target ≤ 10^4 | The target may be below or above every element; the answer is then 0 or n. |
| O(log n) required | The linear scan is a baseline only. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| A target larger than every element returns n | The search range for the answer is `[0, n]`, one more than the array's indices. This is why `hi` starts at n. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| I return the position only; I don't actually insert | The method returns an `int` and the array is not modified. |

### Edge cases I will keep in mind

- Target smaller than every element: answer 0.
- Target larger than every element: answer n, which is not a readable index.
- Target equal to the first or last element.
- One element, with the target below, equal and above.

## 4. Think out loud: from first idea to best solution

### Approach 1: Linear scan

#### What I say out loud

> "Baseline: walk from the left and return the first index whose value is at least the target. If none is, return n. That's O(n), so it misses the requirement, but it pins down the definition I'm going to search for."

#### Intuition

The answer is the first index where `nums[i] >= target`. A scan finds the first such index by checking them in order.

#### Algorithm

1. For each `i` from 0 to n − 1, if `nums[i] >= target`, return `i`.
2. Return n.

#### Why it is correct

Everything before the returned `i` was checked and is smaller than the target, so inserting there keeps the order, and if `nums[i]` equals the target, `i` is its index. If the loop finishes, every element is smaller, so the target goes at the end.

#### Dry run

`[2, 5, 8, 11, 14]`, target 9: 2, 5, 8 are smaller; 11 ≥ 9, return 3. Target 16: nothing qualifies, return 5.

#### Java code

```java title="Approach 1: linear scan"
class Solution {
    public int searchInsert(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] >= target) {
                return i;
            }
        }
        return nums.length;
    }
}
```

#### Time complexity

**O(n) in the worst case**, n = `nums.length`, when the target is larger than everything. It violates the O(log n) requirement.

#### Space complexity

**O(1) auxiliary space.**

#### The bridge to the next approach

> "I already know a loop that finds a value in a sorted array in O(log n): the closed-range binary search from [[nc-binary-search|Binary Search]]. When it fails, it ends with `lo` one past `hi`. Let me check whether `lo` is the insertion point at that moment; if so, the only change is the return value."

### Approach 2: Closed-range binary search, return `lo` when not found

#### What I say out loud

> "Same loop as Binary Search: `[lo, hi]` inclusive, `lo <= hi`, `mid ± 1`. If I find the target I return `mid`. If the loop ends, I return `lo` instead of −1, because everything left of `lo` has been shown to be smaller and everything right of `hi` larger, and `lo = hi + 1`."

#### Intuition

The updates in the classic search leave a record: `lo` only moves past elements known to be smaller than the target, and `hi` only moves past elements known to be larger. When the range is empty, the gap between them is exactly where the target belongs.

#### Algorithm

1. `lo = 0`, `hi = n − 1`.
2. While `lo <= hi`: `mid = lo + (hi − lo) / 2`; return `mid` if equal; `lo = mid + 1` if `nums[mid] < target`; else `hi = mid − 1`.
3. Return `lo`.

#### Why it is correct

**Invariant:** every index before `lo` holds a value smaller than the target, and every index after `hi` holds a value larger than it. It holds at the start, when both sets are empty. `lo = mid + 1` happens only when `nums[mid] < target`, and sorted order makes everything up to `mid` smaller; `hi = mid − 1` is the mirror image.

Each update either sets `lo` to at most `hi + 1` or `hi` to at least `lo − 1`, so when `lo <= hi` first fails, `lo == hi + 1` exactly. Then the indices before `lo` are smaller and the indices from `lo` on are larger, so `lo` is the insertion point. It is in `[0, n]`: `lo` starts at 0 and ends at `hi + 1 ≤ n`.

#### Dry run

`[2, 5, 8, 11, 14]`, target 9

| lo | hi | mid | nums[mid] | Action |
|---|---|---|---|---|
| 0 | 4 | 2 | 8 | 8 < 9, `lo = 3` |
| 3 | 4 | 3 | 11 | 11 > 9, `hi = 2` |
| 3 | 2 | | | range empty, return `lo` = 3 |

#### Java code

```java title="Approach 2: closed-range binary search, return lo"
class Solution {
    public int searchInsert(int[] nums, int target) {
        int lo = 0;
        int hi = nums.length - 1;     // before lo: smaller than target; after hi: larger
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) {
                return mid;
            }
            if (nums[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return lo;                    // lo == hi + 1: the gap where target belongs
    }
}
```

#### Time complexity

**O(log n) in the worst case**, at most ⌊log2 n⌋ + 1 iterations, by the same halving argument as in [[nc-binary-search|Binary Search]].

#### Space complexity

**O(1) auxiliary space.**

#### The bridge to the next approach

> "That works, but the reason it returns the right thing is a second argument bolted onto a loop designed for a different question. The question here is a single yes/no boundary: the first index where `nums[i] >= target`. If I search for that boundary directly, equality stops being a special case, the answer range `[0, n]` becomes the search range, and the same loop handles duplicates if they're ever allowed. That's the lower-bound loop."

### Approach 3: Lower bound on a half-open range (recommended)

#### What I say out loud

> "I'll search for the first index whose value is at least the target. The answer is somewhere in 0 to n, so I keep `lo` and `hi` with `lo` starting at 0 and `hi` at n. Everything before `lo` is known to be too small; everything from `hi` on is known to be big enough. While `lo < hi` there's an index I haven't classified, so I look at the middle. Too small: `lo = mid + 1`. Big enough: `mid` might be the first one, so `hi = mid`, not `mid − 1`. When they meet, that's the answer."

#### Intuition

Think of each index as answering "is `nums[i] >= target`?": no, no, no, yes, yes. The answer is where the first yes is, or n if there is none. The range `[lo, hi)` is the unclassified part; `lo` is the first index not known to be a no, and `hi` is the first index known to be a yes (or n). This is lower bound, from [[a3-lower-upper-bounds|Lower and Upper Bounds]].

#### Algorithm

1. `lo = 0`, `hi = n`.
2. While `lo < hi`:
3. `mid = lo + (hi − lo) / 2`.
4. If `nums[mid] < target`, set `lo = mid + 1`; otherwise set `hi = mid`.
5. Return `lo`.

#### Why it is correct

**The invariant:** every index before `lo` holds a value smaller than the target, and every index from `hi` to n − 1 holds a value at least the target. So the answer, the first index with `nums[i] >= target` (or n), lies in the closed range `[lo, hi]`.

- **Start: `lo = 0`, `hi = n`.** Both claims are about empty sets, so they hold. `hi = n`, not n − 1, because the answer can be n: if `hi` started at n − 1, a target larger than everything could never produce n.
- **Loop condition `lo < hi`.** While `lo < hi`, the indices `lo` to `hi − 1` are unclassified. When `lo == hi`, the "smaller" block ends exactly where the "at least" block starts, so `lo` is the answer.
- **The midpoint is a real index.** With `lo < hi`, `mid = lo + (hi − lo) / 2` rounds down and satisfies `lo <= mid < hi ≤ n`, so `nums[mid]` never reads index n.
- **`nums[mid] < target`.** `mid` and, by sorted order, everything before it are smaller: `lo = mid + 1`.
- **`nums[mid] >= target`.** `mid` and everything after it are at least the target. But `mid` may be the first such index, so it must stay a candidate: `hi = mid`. Writing `mid − 1` could skip the answer.
- **Termination.** `lo = mid + 1 > lo`, or `hi = mid < hi`; the gap `hi − lo` shrinks every iteration.
- **Found and not found are the same case.** The values are distinct, so if the target is present, the first index with `nums[i] >= target` is the target's index; if not, it is the insertion point.

**The 25-second version to say to the interviewer:**

> "I'm finding the first index with `nums[i] >= target`. Everything before `lo` is too small, everything from `hi` is big enough. `hi` starts at n because the answer can be n, and `mid` is always below `hi`, so I never read past the end. Too small moves `lo` past `mid`; big enough sets `hi = mid` because `mid` might be the first one. They meet at the answer."

#### Dry run

`[2, 5, 8, 11, 14]`, target 9

| lo | hi | mid | nums[mid] | `nums[mid] < 9`? | Action |
|---|---|---|---|---|---|
| 0 | 5 | 2 | 8 | yes | `lo = 3` |
| 3 | 5 | 4 | 14 | no | `hi = 4` |
| 3 | 4 | 3 | 11 | no | `hi = 3` |
| 3 | 3 | | | | `lo == hi`, return 3 |

Target 16, where the answer is n:

| lo | hi | mid | nums[mid] | `nums[mid] < 16`? | Action |
|---|---|---|---|---|---|
| 0 | 5 | 2 | 8 | yes | `lo = 3` |
| 3 | 5 | 4 | 14 | yes | `lo = 5` |
| 5 | 5 | | | | return 5 |

`nums[5]` was never read: `mid` was at most 4.

#### Java code

```java title="Approach 3: lower bound, half-open range (recommended)"
class Solution {
    public int searchInsert(int[] nums, int target) {
        int lo = 0;
        int hi = nums.length;          // answer is in [lo, hi]; it can be n
        while (lo < hi) {              // indices lo..hi-1 are unclassified
            int mid = lo + (hi - lo) / 2;   // lo <= mid < hi, so nums[mid] is safe
            if (nums[mid] < target) {
                lo = mid + 1;          // mid is too small, and so is everything before it
            } else {
                hi = mid;              // mid is big enough and may be the first such index
            }
        }
        return lo;                     // lo == hi: the first index with nums[i] >= target
    }
}
```

#### Time complexity

**O(log n) in every case: between ⌊log2 n⌋ and ⌊log2 n⌋ + 1 iterations,** one comparison each. The gap `hi − lo` = k becomes either ⌊k / 2⌋ or ⌈k / 2⌉ − 1, both at most ⌊k / 2⌋, so it reaches 0 within ⌊log2 n⌋ + 1 iterations; for n = 10^4 that is 13 or 14 (I counted both over every target). Unlike Approach 2 there is no early exit on equality, so the best case is also logarithmic, which costs nothing that matters.

It is optimal: the answer is one of n + 1 positions, and each two-way comparison at most halves the set of positions still possible, so any comparison-based method needs ⌈log2(n + 1)⌉ comparisons in the worst case, and ⌈log2(n + 1)⌉ = ⌊log2 n⌋ + 1.

#### Space complexity

**O(1) auxiliary space.**

### Alternative: `Arrays.binarySearch`

```java title="Alternative: Arrays.binarySearch"
import java.util.Arrays;

class Solution {
    public int searchInsert(int[] nums, int target) {
        int r = Arrays.binarySearch(nums, target);
        return r >= 0 ? r : -r - 1;    // not found: r = -(insertion point) - 1
    }
}
```

The JDK documents the contract: if the key is found, the result is its index; if not, it is `-(insertion point) - 1`, where the insertion point is the index of the first element greater than the key, or the length if there is none. The encoding keeps every "not found" result negative, even for insertion point 0, so decoding is `-r - 1`. This is a one-line answer, and naming it shows you know the library.

The caution: the documentation says that if the array contains several elements equal to the key, **there is no guarantee which one is found**. Here the values are distinct, so the result is exact. On data with duplicates it is not a lower bound, and you would write Approach 3. In an interview, offer it and then write the loop, since the loop is what is being assessed.

## 5. Comparison table

n = `nums.length`. Nothing is hashed or randomized, so expected and worst case coincide.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Linear scan | O(n) | O(n) | O(1) |
| 2. Closed range, return `lo` | O(log n) | O(log n) | O(1) |
| 3. Lower bound, half-open | O(log n) | O(log n), at most ⌊log2 n⌋ + 1 iterations | O(1) |
| Alternative: `Arrays.binarySearch` | O(log n) | O(log n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Linear scan | States the definition directly | O(n), violates the requirement | Baseline sentence only |
| 2. Closed range, return `lo` | Reuses the Binary Search loop unchanged | Needs a second argument for why `lo` is the answer; returns any equal index if duplicates appear | If you came from Binary Search and can justify the return |
| 3. Lower bound | One question, no equality case, handles n naturally, first occurrence with duplicates | Asymmetric updates must be justified | The answer |
| Alternative: library | One line, documented contract | Arbitrary index among duplicates; not what the interviewer is assessing | Production code on distinct values |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 3. Approach 2 is also correct and complete; if it is what you wrote, explain why `lo` is the insertion point and you are done.

**Is it optimal?** Yes. There are n + 1 possible answers and each comparison splits them at best in half, so ⌊log2 n⌋ + 1 comparisons are needed in the worst case, which Approach 3 matches. Stop there.

## 7. Interview script: code it and test it

### What I say while coding

> "`lo = 0`, `hi = n`, because the answer ranges over 0 to n. I'll comment the invariant: before `lo` is too small, from `hi` on is big enough."

> "`while (lo < hi)`. `mid` is below `hi`, so even with `hi = n` I never read out of bounds."

> "Too small: `lo = mid + 1`. Otherwise `hi = mid`: `mid` could be the answer, so I keep it."

> "Return `lo`. No separate found case: with distinct values the first index that's at least the target is the target itself when it's present."

### Testing out loud

**Normal, absent:** target 9 on `[2, 5, 8, 11, 14]` returns 3 (dry-run table).

**Present:** target 11: mid 2 (8 < 11), `lo = 3`; mid 4 (14), `hi = 4`; mid 3 (11, not smaller), `hi = 3`; return 3.

**Larger than all:** target 16 returns 5 = n without reading `nums[5]`.

**Smaller than all:** target 1: every `nums[mid]` is ≥ 1, so `hi` falls 5 → 2 → 1 → 0 with `lo` at 0; return 0.

**One element:** `[7]`: target 3 or 7 gives mid 0, 7 is not smaller, `hi = 0`, return 0. Target 9: 7 < 9, `lo = 1`, return 1.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 30–60 s | Answer can be n; distinct values; O(log n) |
| Define the answer | 30 s | "First index with `nums[i] >= target`" |
| Code | 2 min | Approach 3 |
| Trace | 2 min | Absent in the middle, larger than all, smaller than all, one element |

Most of the value is in the definition: once you say "first index with `nums[i] >= target`", the code follows. If you start with the classic search instead, that is fine; just be ready to say why `lo` is the answer at the end.

## 9. Interviewer challenges

### About boundaries

#### Why does `hi` start at n and not n − 1?

**What they are testing:** whether you see that the answer space is larger than the index space.

**How to reason:** list the possible answers: 0 through n, which is n + 1 values. The search range has to include all of them.

**What I say:** "The answer can be n, when the target is bigger than everything. My loop returns `lo`, which ends equal to `hi`, so `hi` has to be able to stay at n. With `hi = n − 1`, a target of 16 on `[2, 5, 8, 11, 14]` would return 4. And starting at n is safe, because `mid` is always strictly less than `hi`."

**Nuance:** in Approach 2, `hi` does start at n − 1, and it still returns n, because the returned value is `lo`, which can reach `hi + 1 = n`. Each style is consistent with itself; the bug comes from mixing them.

#### Why `hi = mid` here but `hi = mid − 1` in Binary Search?

**What they are testing:** whether the update comes from the invariant.

**How to reason:** ask whether `mid` can still be the answer after the comparison.

**What I say:** "In Binary Search, if `nums[mid]` isn't the target I know `mid` is not the answer, so I drop it. Here, `nums[mid] >= target` makes `mid` a possible answer, the first such index, so I keep it with `hi = mid`. That's safe from infinite loops because `mid < hi`, so `hi` still decreases."

**Nuance:** that safety depends on `mid` rounding down. If you ever need `lo = mid` (searching for a last index), round the midpoint up instead, or the loop stalls at two elements.

#### What happens if the loop is `lo <= hi` with `hi = mid`?

**What they are testing:** whether you can spot the infinite loop from mixing styles.

**How to reason:** consider `lo == hi`. Then `mid == lo == hi`.

**What I say:** "When `lo == hi`, `mid` equals both. If `nums[mid] >= target`, `hi = mid` changes nothing and the loop runs forever. On `[2, 5, 8, 11, 14]` with target 9 it gets stuck at `lo = hi = 3`. With `hi = n` it would also read `nums[n]` once `lo` reached n."

**Nuance:** this is why the half-open loop is `lo < hi`: the condition guarantees `mid < hi`, which is what makes `hi = mid` progress.

### About the library

#### Why not just call `Arrays.binarySearch`?

**What they are testing:** library knowledge and judgement about its contract.

**How to reason:** read what the documentation promises, especially for duplicates.

**What I say:** "I could: it returns the index if found, or minus the insertion point minus one, so `-r - 1` decodes it. With distinct values it's exactly this problem. With duplicates, the documentation says any matching index may be returned, so it's not a lower bound. Since you're asking me to implement the search, I'd write the loop."

**Nuance:** the encoding `-(p) - 1` exists so that insertion point 0 is distinguishable from finding the key at index 0.

## 10. Follow-up questions the interviewer might ask

**"What if values can repeat? Insert before or after equal values?"**
Before all equal values: this exact code (lower bound, `nums[mid] < target`). After them: change the test to `nums[mid] <= target`, which gives upper bound. Both O(log n).

**"Count how many times the target occurs."**
Upper bound minus lower bound, two O(log n) searches. See [[a3-lower-upper-bounds|Lower and Upper Bounds]].

**"Find the first and last position of the target."**
Lower bound gives the first (check that it holds the target); upper bound minus one gives the last.

**"Many inserts and queries on the same collection?"**
Inserting into an array is O(n) per insert because elements shift. A balanced tree (`TreeSet.ceiling`, `TreeMap`) keeps both operations at O(log n).

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Treating "found" and "not found" as two problems.** With distinct values, "first index with `nums[i] >= target`" answers both.
- **Thinking the answer must be a valid index.** It ranges over 0 to n.
- **Assuming `Arrays.binarySearch` gives the first occurrence.** Its documentation promises no particular index among duplicates.

### Implementation mistakes

> [!MISTAKE] `hi = nums.length - 1` in the lower-bound loop
> The answer n becomes unreachable. Target 16 on `[2, 5, 8, 11, 14]` returns 4 instead of 5.

> [!MISTAKE] `while (lo <= hi)` with `hi = mid`
> When `lo == hi` and `nums[mid] >= target`, nothing changes: target 9 on `[2, 5, 8, 11, 14]` loops forever at `lo = hi = 3`.

- **`nums[mid] <= target` instead of `<`:** that is upper bound; target 11 on `[2, 5, 8, 11, 14]` returns 4 instead of 3.
- **Returning `hi + 1` or `mid`** at the end of the half-open loop: at exit `lo == hi`, and `mid` is stale.

## 12. Pattern recognition

**The pattern:** lower bound, the first index where a monotone yes/no condition becomes true, searched on a half-open range `[lo, hi)` with `hi` starting at n.

**Signals in the problem statement:**

- "Where it would be inserted", "first position", "smallest index such that".
- The answer may be one past the end.
- Sorted input with an O(log n) requirement.

**Related problems in this list:**

- [[nc-binary-search|Binary Search]]: the closed-range search for an exact value; its `lo` at exit is this problem's answer.
- [[nc-guess-number-higher-or-lower|Guess Number Higher or Lower]]: the same halving over a number range, where the midpoint overflow is real.
- [[nc-find-minimum-in-rotated-sorted-array|Find Minimum in Rotated Sorted Array]]: a lower-bound loop on a different yes/no condition (`nums[i] <= nums[n − 1]`).
- [[nc-koko-eating-bananas|Koko Eating Bananas]]: lower bound over candidate speeds instead of indices.
- [[nc-time-based-key-value-store|Time Based Key-Value Store]]: an upper-bound-style search over timestamps.
- [[cses-concert-tickets|Concert Tickets]] (CSES): repeated "largest price not above x" queries, where a balanced tree replaces the array because elements are removed.

**Takeaway:** when the answer is "the first index where something becomes true", search for the boundary on `[0, n)` with `lo < hi`, `lo = mid + 1` for no and `hi = mid` for yes.

## 13. 60-second revision card

**Key insight:** the answer is the first index with `nums[i] >= target`, found or not; it can be n.

**Invariant:** before `lo`: smaller than the target. From `hi` on: at least the target. The answer is in `[lo, hi]`.

**Complexity:** O(log n) time, at most ⌊log2 n⌋ + 1 iterations (14 for n = 10^4), O(1) auxiliary space. Optimal: n + 1 possible answers need ⌈log2(n + 1)⌉ comparisons.

**Code skeleton:**

```java title="Lower bound, half-open" fragment="public int searchInsert(int[] nums, int target)"
int lo = 0, hi = nums.length;              // answer in [lo, hi], may be n
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;          // lo <= mid < hi
    if (nums[mid] < target) lo = mid + 1; else hi = mid;
}
return lo;
```

**Main traps:**

- `hi = n`, not n − 1.
- `lo < hi` with `hi = mid`; never `lo <= hi` with `hi = mid`.
- `<` gives lower bound; `<=` gives upper bound.

**What to say in one breath:** "I search for the first index whose value is at least the target. Everything before `lo` is too small, everything from `hi` is big enough; `hi` starts at n because the answer can be n. Too small moves `lo` past `mid`, big enough sets `hi` to `mid` because it might be the first. They meet at the answer in at most ⌊log2 n⌋ + 1 steps."
