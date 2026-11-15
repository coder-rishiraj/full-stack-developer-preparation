---
problemId: nc-search-in-rotated-sorted-array-ii
title: Search In Rotated Sorted Array II
source: neetcode
sourceUrl: https://leetcode.com/problems/search-in-rotated-sorted-array-ii/
difficulty: medium
patterns: [binary-search]
relatedLessons: [a3-binary-search, a14-edge-cases, a14-complexity-in-interview, a14-deriving-optimization]
companies: []
timeToSolve: 25
---

## 1. Problem restatement

An array sorted in non-decreasing order (so values may repeat) was rotated at an unknown position: the part after some cut was moved to the front. Given the result and a target, return `true` if the target occurs in the array and `false` otherwise. The statement asks you to keep the number of steps as low as possible, and adds a question: do the duplicates change the runtime complexity, and how and why?

**Example 1**

- Input: `nums = [3, 4, 4, 0, 1, 1, 2]`, `target = 1`
- Output: `true`
- Why: the array is `[0, 1, 1, 2, 3, 4, 4]` rotated to start at 3, and 1 occurs (twice).

**Example 2**

- Input: `nums = [3, 4, 4, 0, 1, 1, 2]`, `target = 5`
- Output: `false`
- Why: 5 does not occur.

**What the problem statement guarantees**

- `nums` is a rotation of a non-decreasing array; duplicates are allowed. (A rotation may also leave it unchanged.)
- 1 ≤ n ≤ 5000, and −10^4 ≤ `nums[i]`, `target` ≤ 10^4.
- Only presence is asked, not an index.

## 2. Practice first: try it before reading on

If you have solved the version with distinct values, this is the place to find out exactly which step of that solution depended on distinctness.

**How to practise**

1. Set a timer for 25 minutes and talk out loud.
2. Write down your solution for distinct values and mark every comparison whose meaning could change when two values are equal.
3. Find a small input where that comparison gives no information. Then decide what you can still safely do.
4. Code it and trace both examples, `[1, 0, 1, 1, 1]` with target 0, and `[1, 1, 1, 1, 1]` with target 2.
5. Answer the statement's question: what is the worst-case number of steps, and could any algorithm do better?

> [!HINT] Hint 1: a small nudge
> Compare `[1, 0, 1, 1, 1]` and `[1, 1, 1, 0, 1]`. Look only at the first, middle and last element of each. Can you tell which half contains the 0?

> [!HINT] Hint 2: the kind of tool you need
> Keep the distinct-values method (one half of the range is sorted; check whether the target lies in that half's value range). It still works whenever the first, middle and last values are not all equal. When they are all equal and the middle is not the target, neither end is the target either, so both ends can be dropped.

> [!HINT] Hint 3: almost the whole plan
> Loop while `lo <= hi`: if `nums[mid]` is the target, return true. If `nums[lo] == nums[mid] && nums[mid] == nums[hi]`, do `lo++` and `hi--`. Otherwise, if `nums[lo] <= nums[mid]` the left half is sorted, else the right half is, and you continue exactly as in the distinct version. For the complexity question, think about an array of all 1s with a single 2 hidden somewhere, and what an algorithm learns from each element it reads.

**Check yourself before revealing the walkthrough**

- [ ] My code returns `true` and `false` for the two examples
- [ ] It returns `true` for `[1, 0, 1, 1, 1]` with target 0, and for `[1, 1, 1, 0, 1]` with target 0
- [ ] I can say why dropping both ends is safe
- [ ] I can give an input that forces my solution to take about n steps, and explain why every algorithm needs about n reads on some input

## 3. Interview script: understand the problem (≈2 min)

**Me:** It's the rotated sorted search again, but the values can repeat, and I return whether the target is present, not where. Right?

**Interviewer:** Right.

**Me:** Can the whole array be one repeated value?

**Interviewer:** Yes, nothing rules it out.

**Me:** That's the case I'll have to think hardest about. Is the array possibly not rotated?

**Interviewer:** Possibly.

**Me:** Sizes and values?

**Interviewer:** n from 1 to 5000; values and target from −10^4 to 10^4.

**Me:** No overflow anywhere, only comparisons. And "as few steps as possible": I'll aim for logarithmic when the duplicates allow it, and I'll be explicit about what the worst case is. Let me do Example 1 by hand: `[3, 4, 4, 0, 1, 1, 2]`, target 1. Middle is index 3, value 0. The first element 3 is bigger than 0, so the drop is on the left and the right half 0, 1, 1, 2 is sorted. 1 is between 0 and 2, go right. The middle of indices 4 to 6 is index 5, value 1: found.

**Me:** Now the hard case. `[1, 0, 1, 1, 1]` and `[1, 1, 1, 0, 1]`: first, middle and last are 1 in both, but the 0 is on opposite sides. So when the three are equal, one look can't tell me which half to keep.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| Rotation of a non-decreasing array, duplicates allowed | Two non-decreasing runs, every value of the second ≤ every value of the first. `nums[lo] == nums[mid]` can now happen with the drop between them, so the "which half is sorted" test needs a guard. |
| Possibly unrotated, possibly all equal | Both must work without special branches going wrong. |
| 1 ≤ n ≤ 5000 | n = 1 must work; no overflow. |
| −10^4 ≤ values, target ≤ 10^4 | Only comparisons. |
| Return a boolean | Any occurrence will do, which is what makes discarding a duplicate end safe. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| All-equal arrays are valid | It is the worst case for the search; I will trace it. |
| The array may be unrotated | One test is a plain sorted array with duplicates. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| `nums` is read-only | I only read it. |
| Cost is measured in element reads | That is the model in which I answer the complexity question and state the lower bound. |

### Edge cases I will keep in mind

- n = 1.
- All elements equal, target present or absent.
- All equal but one, in different positions: `[1, 0, 1, 1, 1]`, `[1, 1, 1, 0, 1]`.
- First, middle and last equal with the target somewhere inside.
- Unrotated with duplicates.

## 4. Think out loud: from first idea to best solution

Throughout: **n** is the length of `nums`. The array is a **first run** followed by a **second run**, both non-decreasing, with every second-run value ≤ every first-run value (the first run is empty if the array is unrotated). A range of the array has the same shape.

### Approach 1: Linear scan

#### What I say out loud

> "Check every element: O(n). Normally that's only a baseline. Here I want to keep it in mind, because I suspect that with duplicates nothing beats it in the worst case."

#### Intuition

The target is present exactly when some element equals it.

#### Algorithm

1. For each element, if it equals the target, return `true`.
2. Return `false`.

#### Why it is correct

It returns `true` only on an actual match, and `false` only after every element was compared.

#### Dry run

Example 1, target 1: 3, 4, 4, 0 do not match, `nums[4] = 1` does. Returns `true`.

#### Java code

```java title="Approach 1: linear scan"
class Solution {
    public boolean search(int[] nums, int target) {
        for (int value : nums) {
            if (value == target) {
                return true;
            }
        }
        return false;
    }
}
```

#### Time complexity

**O(n)** in the worst case: n comparisons when the target is absent.

#### Space complexity

**O(1)** auxiliary space.

#### The bridge to the next approach

> "The distinct-values search decides which half is sorted with `nums[lo] <= nums[mid]`. Where did that use distinctness? It argued: if the left half contained the drop, `nums[lo]` would be in the high run and `nums[mid]` in the low run, so `nums[lo] > nums[mid]`. With duplicates the high run and the low run can share a value, so `nums[lo] == nums[mid]` no longer rules out a drop between them. `[1, 1, 1, 0, 1]`: `lo = 0`, `mid = 2`, both 1, and the left half is fine; `[1, 0, 1, 1, 1]`: also both 1, and the left half has the drop."

> "When exactly is the test fooled? Only when `nums[lo] == nums[mid]`. And I think it's only fatal when `nums[hi]` is equal too: if the left half had the drop, `mid` and `hi` would both be in the low run, so `nums[mid] ≤ nums[hi] ≤ nums[lo] = nums[mid]`, forcing all three equal. So if they're not all equal, the old logic is still right. If they are all equal and `nums[mid]` isn't the target, then `nums[lo]` and `nums[hi]` aren't the target either, and I can drop them both. That's a step of 2 instead of a halving, but it's safe."

### Approach 2: Sorted-half search, shrinking both ends on a tie (recommended)

#### What I say out loud

> "Same loop as the distinct version. At `mid`: target found, return true. If `nums[lo]`, `nums[mid]` and `nums[hi]` are all equal, I can't tell which half is sorted, but none of the three is the target, so `lo++` and `hi--`. Otherwise `nums[lo] <= nums[mid]` means the left half is sorted, and I do the usual range check; else the right half is sorted."

> "Complexity: each normal step halves the range, each tie step removes two elements. So it's O(log n) plus the number of tie steps. With few duplicates that's logarithmic; on an array of all 1s with one 2, it's about n / 2 steps: O(n) worst case."

#### Intuition

The tie is the only situation where one probe gives no direction. Rather than guess, spend the probe on something certain: the two ends are known not to be the target, so remove them. Everywhere else the distinct-values argument still holds.

#### Algorithm

1. `lo = 0`, `hi = n - 1`.
2. While `lo <= hi`:
   1. `mid = (lo + hi) >>> 1`. If `nums[mid] == target`, return `true`.
   2. If `nums[lo] == nums[mid] && nums[mid] == nums[hi]`: `lo++`, `hi--`.
   3. Else if `nums[lo] <= nums[mid]` (left half sorted): if `nums[lo] <= target && target < nums[mid]`, `hi = mid - 1`; else `lo = mid + 1`.
   4. Else (right half sorted): if `nums[mid] < target && target <= nums[hi]`, `lo = mid + 1`; else `hi = mid - 1`.
3. Return `false`.

#### Why it is correct

**Invariant:** if the target occurs in the array, it occurs at some index in `[lo, hi]`. (With duplicates there may be several occurrences; at least one stays in range.)

- **Initially** the range is the whole array.
- **Loop condition `lo <= hi`.** The range is closed, so it still holds one unchecked index when `lo == hi`; stopping at `lo < hi` would answer `false` for `[1]` with target 1. With `lo <= hi`, `mid = (lo + hi) >>> 1` lies in `[lo, hi]`, so all three reads are in bounds.
- **Tie step.** `nums[mid]` is not the target, and `nums[lo]` and `nums[hi]` equal it, so neither end is the target. Removing them cannot remove an occurrence.
- **The sorted-half test, when not all three are equal.** The range is a first run then a second run. If `lo` were in the first run and `mid` in the second, then `hi` is in the second run too, so `nums[mid] ≤ nums[hi]` (the second run rises) and `nums[hi] ≤ nums[lo]` (second-run values are at most first-run values). With `nums[lo] <= nums[mid]` that forces all three equal, which this branch excludes. So `nums[lo] <= nums[mid]` puts `lo` and `mid` in the same run: `[lo, mid]` is non-decreasing. If `nums[lo] > nums[mid]`, they cannot be in the same run (a run never decreases), so `mid` is in the second run, and so is everything up to `hi`: `[mid, hi]` is non-decreasing.
- **Left half sorted, condition true** (`nums[lo] <= target < nums[mid]`): could the target occur only to the right of `mid`? Values right of `mid` are either still in `lo`'s run, hence `≥ nums[mid] > target`, or in the second run, hence `≤ nums[lo] ≤ target`, equal only if `target == nums[lo]`, which already occurs at `lo`. So an occurrence remains in `[lo, mid − 1]`.
- **Left half sorted, condition false:** the target is not in the non-decreasing `[lo, mid]` (it would lie between `nums[lo]` and `nums[mid]`, and it is not `nums[mid]`), so `lo = mid + 1` keeps every occurrence.
- **Right half sorted:** symmetric. If `nums[mid] < target <= nums[hi]` holds, values left of `mid` are first-run values (≥ `nums[hi]` ≥ target, equal only when the target also sits at `hi`) or second-run values ≤ `nums[mid]` < target, so an occurrence remains in `[mid + 1, hi]`. If it fails, the target is not in `[mid, hi]`.
- **Returns only correct answers:** `true` only on a match; `false` only when the range is empty, and the invariant then says no occurrence exists.
- **Termination:** every iteration returns or shrinks the range by at least one.

**The 25-second version to say to the interviewer:**

> "It's the distinct-values search with one extra case. The test `nums[lo] <= nums[mid]` for 'left half sorted' can only be fooled when `nums[lo]`, `nums[mid]` and `nums[hi]` are all equal. In that case none of them is the target, so I drop both ends and loop. Otherwise one half is provably sorted and I keep the half whose value range can contain the target. Each normal step halves the range and each tie step removes two, so it's O(log n) plus the number of ties, O(n) in the worst case."

#### Dry run

Example 1, `[3, 4, 4, 0, 1, 1, 2]`, target 1:

| lo | hi | mid | nums[lo], nums[mid], nums[hi] | Case | Update |
|---|---|---|---|---|---|
| 0 | 6 | 3 | 3, 0, 2 | right sorted (3 > 0); 0 < 1 ≤ 2 | `lo = 4` |
| 4 | 6 | 5 | 1, 1, 2 | `nums[5] = 1` = target | return `true` |

Example 2, target 5:

| lo | hi | mid | nums[lo], nums[mid], nums[hi] | Case | Update |
|---|---|---|---|---|---|
| 0 | 6 | 3 | 3, 0, 2 | right sorted; 0 < 5 ≤ 2? no | `hi = 2` |
| 0 | 2 | 1 | 3, 4, 4 | left sorted (3 ≤ 4, not all equal); 3 ≤ 5 < 4? no | `lo = 2` |
| 2 | 2 | 2 | 4, 4, 4 | tie (one element) | `lo = 3`, `hi = 1` |
| 3 | 1 | – | – | empty | return `false` |

A tie-heavy input, `[1, 1, 1, 1, 2, 1, 1]`, target 2:

| lo | hi | mid | nums[lo], nums[mid], nums[hi] | Case | Update |
|---|---|---|---|---|---|
| 0 | 6 | 3 | 1, 1, 1 | tie | `lo = 1`, `hi = 5` |
| 1 | 5 | 3 | 1, 1, 1 | tie | `lo = 2`, `hi = 4` |
| 2 | 4 | 3 | 1, 1, 2 | left sorted (not all equal); 1 ≤ 2 < 1? no | `lo = 4` |
| 4 | 4 | 4 | 2, 2, 2 | `nums[4] = 2` = target | return `true` |

#### Java code

```java title="Approach 2: sorted-half search with tie shrinking (recommended)"
class Solution {
    public boolean search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;         // invariant: if target occurs, an occurrence is in [lo, hi]
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1;
            if (nums[mid] == target) {
                return true;
            }
            if (nums[lo] == nums[mid] && nums[mid] == nums[hi]) {
                lo++;                             // neither end is the target: drop both
                hi--;
            } else if (nums[lo] <= nums[mid]) {   // left half [lo, mid] is non-decreasing
                if (nums[lo] <= target && target < nums[mid]) {
                    hi = mid - 1;
                } else {
                    lo = mid + 1;
                }
            } else {                              // right half [mid, hi] is non-decreasing
                if (nums[mid] < target && target <= nums[hi]) {
                    lo = mid + 1;
                } else {
                    hi = mid - 1;
                }
            }
        }
        return false;
    }
}
```

#### Time complexity

Let t be the number of tie steps. Each other step keeps at most half the range, and tie steps only make the range smaller, so there are at most about log₂ n + 1 halving steps. Total: **O(log n + t) iterations**, each O(1).

- **Without ties** (for example, distinct values, where a tie can only be a one-element range at the very end): O(log n).
- **Worst case: O(n).** Take all 1s with target 2: every step is a tie, each removes two elements, and the loop runs ⌈n / 2⌉ times (2500 for n = 5000). A single 2 hidden among the 1s is just as bad when it sits next to the middle. A tie step moves `lo` and `hi` inwards by one each, so `mid` stays where it is, and the ties continue until `lo` or `hi` reaches the 2. With n = 5000, `mid` is 2499, and a 2 at index 2500 takes 2501 iterations (counted by running the code).

#### Space complexity

**O(1)** auxiliary space.

### Alternative: find the rotation point first, then binary search

The two-pass method from the distinct version (find the minimum's index p, then search the right run) is tempting here too, but the rotation point is harder to find than the minimum value. The usual duplicate-tolerant minimum search does `hi--` when `nums[mid] == nums[hi]`. That keeps the minimum *value* in range, but it can discard the index where the second run starts. On `[0, 0, 0, 1, 0, 0]` it reports p = 0, so the code treats the whole array as one sorted run, and searching for 1 returns `false`. A fix exists: before `hi--`, return `hi` if `nums[hi − 1] > nums[hi]`, because then `hi` is exactly where the drop lands. With that check it is correct and has the same O(log n + ties) behaviour, but it is two loops and a subtle guard for no gain over Approach 2. Mention it only to show you see why the "find p" plan is riskier with duplicates.

## 5. Comparison table

n = length of `nums`; t = number of tie steps (all three probes equal) in Approach 2. No hashing or randomness: expected and worst case agree for a fixed input.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Linear scan | O(n) | O(n) | O(1) |
| 2. Sorted half + tie shrinking | O(log n + t) | O(n) | O(1) |
| Alt. Rotation point (with the guard), then binary search | O(log n + t) | O(n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Linear scan | Correct by inspection, since it checks every element; worst-case optimal | Always linear, even when the array has no duplicates | Baseline; honestly fine if the interviewer only cares about the worst case |
| 2. Tie shrinking | Logarithmic unless ties occur; one extra branch on top of the distinct version | O(n) on tie-heavy inputs | The answer to give |
| Alt. Rotation point | Reuses a two-pass plan | The naive pivot search is wrong with duplicates; needs a guard | Rarely |

## 6. Which solution to give, and when to stop optimizing

Give Approach 2, and answer the statement's question directly: **yes, duplicates change the worst case from O(log n) to O(n).** Explain why in two parts: why this algorithm slows down, and why no algorithm can avoid it.

**Why the algorithm slows down.** When `nums[lo] == nums[mid] == nums[hi]`, the probe gives no direction: `[1, 0, 1, 1, 1]` and `[1, 1, 1, 0, 1]` agree at all three positions but have the 0 on opposite sides. The only safe move is to discard the two ends, which removes 2 elements instead of half.

**Why no algorithm can do better in the worst case.** Measure cost by the number of array elements an algorithm reads; it may choose which ones to read based on what it has seen. Fix n and target 2, and consider these inputs:

- A₀: all n elements are 1. It is valid (a non-decreasing array, unrotated) and the answer is `false`.
- Aₚ, for each position p: all 1s except a 2 at position p. It is valid (a rotation of `[1, …, 1, 2]`) and the answer is `true`.

Run any correct algorithm on A₀. Every element it reads is a 1. Suppose it finishes without reading some position p. Now run it on Aₚ: Aₚ agrees with A₀ everywhere except p, so the algorithm reads the same positions, sees the same 1s, and makes the same decisions, never looking at p. It therefore gives the same answer, `false`, which is wrong for Aₚ. So a correct algorithm must read all n positions on A₀. **In the worst case every correct algorithm reads n elements: an Ω(n) worst-case lower bound** in this model. Randomness does not help an always-correct algorithm: on any run that skips some position of A₀, the same random choices on the matching Aₚ give the same wrong answer.

So Approach 2 is worst-case optimal (as is the linear scan) and much faster when ties are rare. That is the honest answer to "as few steps as possible", and the place to stop.

## 7. Interview script: code it and test it

### What I say while coding

> "This is the distinct-values search plus one branch. Found at `mid`: true."

> "Tie check first: if all three are equal, I drop both ends. They equal `nums[mid]`, which isn't the target, so nothing is lost."

> "Then the old logic: `nums[lo] <= nums[mid]` means the left half is non-decreasing. That's only safe because I've excluded the all-equal case."

> "Range checks use the sorted half's own ends, strict at `mid` because `mid` isn't the target."

### Testing out loud

**Normal cases:** Examples 1 and 2, as in the dry runs: `true`, `false`.

**One element:** `[1]`, target 1: found at `mid = 0`. Target 2: a one-element range is a tie, `lo = 1`, `hi = −1`, loop ends: `false`.

**Ties hiding the answer on the left:** `[1, 0, 1, 1, 1]`, target 0. `mid = 2`: 1, 1, 1 tie, `lo = 1`, `hi = 3`. `mid = 2`: `nums[1] = 0`, `nums[2] = 1`, `nums[3] = 1`, not all equal, and `0 <= 1` says the left half `[1, 2]` is sorted; `0 <= 0 < 1`, so `hi = 1`. `mid = 1`: found, `true`.

**All equal, absent:** `[1, 1, 1, 1, 1]`, target 2. Ties at `[0, 4]`, `[1, 3]`, `[2, 2]`; the range empties: `false` after 3 iterations, ⌈5 / 2⌉.

**Unrotated with duplicates:** `[0, 0, 1, 2, 2, 5]`, target 5. `mid = 2` (1): left `[0, 2]` sorted, 5 not below 1, `lo = 3`. `mid = 4` (2): `nums[3] = 2 <= 2`, left sorted, `2 <= 5 < 2` fails, `lo = 5`. `mid = 5`: found, `true`.

**Target at index 0 with a tie elsewhere:** `[3, 1, 1]`, target 3. `mid = 1`: 3, 1, 1, not all equal; `3 > 1`, right half sorted 1..1; 3 not in it, `hi = 0`. `mid = 0`: found, `true`.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2 min | Duplicates, all-equal arrays, boolean result |
| Find where distinctness was used | 3–4 min | The `[1, 0, 1, 1, 1]` / `[1, 1, 1, 0, 1]` pair; why only the all-three-equal case is ambiguous |
| Code | 4 min | The distinct version plus the tie branch |
| Test | 4 min | Examples, a tie-heavy input, n = 1, all equal |
| The complexity question | 3–4 min | O(n) worst case for this code, then the Ω(n) argument for every algorithm |
| Follow-ups | rest | Returning an index, the minimum with duplicates |

The complexity question is the part of this problem that distinguishes candidates. Leave time to state the lower bound carefully rather than just saying "it's O(n) because of duplicates".

## 9. Interviewer challenges

### About correctness

#### Why is it safe to drop both ends on a tie?

**What they are testing:** whether the discard is justified or hopeful.

**How to reason:** what do you know about the values at `lo` and `hi`?

**What I say:** "I only reach the tie branch after checking that `nums[mid]` isn't the target. On a tie, `nums[lo]` and `nums[hi]` equal `nums[mid]`, so they aren't the target either. Removing two non-targets can't lose an occurrence."

**Nuance:** this relies on returning a boolean. If you had to return the first index of the target, dropping `lo` would be fine (it isn't the target), but the sorted-half logic would also need changing to keep the leftmost occurrence.

#### Why is "not all three equal" enough to trust `nums[lo] <= nums[mid]`?

**What they are testing:** the precise point where duplicates matter.

**How to reason:** suppose the left half contains the drop and see what that forces.

**What I say:** "If the drop were between `lo` and `mid`, then `mid` and `hi` are both in the low run, so `nums[mid] ≤ nums[hi]`, and every low-run value is at most every high-run value, so `nums[hi] ≤ nums[lo]`. Combined with `nums[lo] ≤ nums[mid]`, all three would be equal. So outside the tie case, `nums[lo] <= nums[mid]` really means the left half is sorted."

**Nuance:** some solutions only check `nums[lo] == nums[mid]` and do `lo++`. That is also correct, with the same O(n) worst case, but drops one element per tie instead of two.

### About complexity

#### Do duplicates change the complexity? How and why?

**What they are testing:** the statement's own follow-up; whether you can separate "my algorithm is slow here" from "every algorithm is slow here".

**How to reason:** first a bad input for this code, then an argument about all algorithms.

**What I say:** "Yes: from O(log n) to O(n) in the worst case. For my code, an array of all 1s with target 2 makes every step a tie, so it removes two elements per step: n / 2 steps. And no algorithm can do better in the worst case. Take the all-1s array and, for each position, the same array with a 2 there. All of them are valid rotated sorted arrays. On the all-1s array, any algorithm that stops without reading some position p would give the same answer on the array with the 2 at p, since everything it read is identical, and one of those two answers is wrong. So every correct algorithm reads all n elements on that input."

**Nuance:** the lower bound is about the worst case. On inputs with few duplicates the algorithm is still logarithmic: O(log n + t), with t the number of tie steps.

#### Then why not just scan linearly?

**What they are testing:** judgement about worst case versus typical case.

**How to reason:** both are O(n) worst case; compare them on inputs without many ties.

**What I say:** "In the worst case they're the same order. But the binary search is O(log n) whenever ties are rare, including every input with distinct values, while the scan is always linear. The statement asks to reduce the steps as much as possible, so I'd give the version that's never worse in order and usually much better, and say plainly that its worst case is linear."

**Nuance:** with n ≤ 5000 the difference is microseconds; the question is about reasoning, not speed.

## 10. Follow-up questions the interviewer might ask

**"Return the minimum instead."**
Compare `nums[mid]` with `nums[hi]`: greater, `lo = mid + 1`; smaller, `hi = mid`; equal, `hi--` (safe because `nums[mid]` has the same value). O(log n) without ties, O(n) worst case, by the same lower-bound argument with a single 0 hidden among 1s. The distinct version is [[nc-find-minimum-in-rotated-sorted-array|Find Minimum in Rotated Sorted Array]].

**"Return an index of the target instead of a boolean."**
Approach 2 returns at a `mid` where `nums[mid] == target`, so return `mid` instead of `true` and −1 instead of `false`. Complexity unchanged. For the first index specifically, more care is needed; ask whether any index will do.

**"What if values are distinct?"**
Then ties happen only when `lo == mid == hi`, a one-element range, and the method is O(log n): it becomes [[nc-search-in-rotated-sorted-array|Search in Rotated Sorted Array]].

**"Count the occurrences of the target."**
In a sorted array that is two boundary searches. In a rotated one with duplicates, a linear scan is the safe answer; with a known rotation point p, two lower/upper-bound searches in each run give O(log n), but finding p itself is O(n) in the worst case.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Claiming O(log n).** The statement's question exists because it is not true in the worst case.
- **Saying "duplicates make it O(n)" without an input or a reason.** Give the all-1s example and the lower-bound argument.
- **Overstating the lower bound.** It is a worst-case bound in the model where an algorithm learns the array by reading elements; on many inputs the search is still logarithmic.
- **Finding the rotation index with the duplicate-tolerant minimum search.** It finds the minimum value, not necessarily the index where the runs meet.

### Implementation mistakes

> [!MISTAKE] Reusing the distinct-values code unchanged
> Without the tie branch, `[1, 0, 1, 1, 1]` with target 0 returns `false`: at `mid = 2`, `1 <= 1` says the left half is sorted, 0 is not in 1..1, and the search moves right, away from the 0. The mirror input `[1, 1, 1, 0, 1]` happens to return `true`, because moving right is correct there, which is why testing only one of the pair can hide the bug.

> [!MISTAKE] Naive rotation point with duplicates
> The `hi--` minimum search reports p = 0 on `[0, 0, 0, 1, 0, 0]`, and the two-pass search for 1 returns `false`.

- **Checking the tie before checking `nums[mid] == target`.** The safety argument for dropping the ends needs `nums[mid]` not to be the target. With the order swapped, `[1]` with target 1 is a one-element tie, both ends are dropped, and the method returns `false`.
- **Putting the tie branch after the sorted-half test.** `nums[lo] <= nums[mid]` is also true on a tie, so the sorted-half branch runs first, the tie branch is never reached, and the code behaves like the distinct-values version.

## 12. Pattern recognition

**The pattern:** binary search whose deciding comparison can be inconclusive. When a probe gives no direction, make a small step that is provably safe instead of guessing, and account for that in the complexity.

**Signals in the problem statement:**

- A search problem you know for distinct values, now with "duplicates allowed".
- A question about how the complexity changes: expect a worst case that degrades, and be ready with an adversarial input.

**Related problems in this list:**

- [[nc-search-in-rotated-sorted-array|Search in Rotated Sorted Array]]: the distinct version this extends.
- [[nc-find-minimum-in-rotated-sorted-array|Find Minimum in Rotated Sorted Array]]: the same structure; its duplicates variant uses `hi--` for the same reason.
- [[nc-binary-search|Binary Search]]: the basic loop and invariant.
- [[nc-rotate-array|Rotate Array]]: the rotation itself.

**Takeaway:** find the exact comparison that distinctness made decisive, handle the case where it is not, and answer "how bad can it get?" with a concrete input and a lower bound, not just a big-O.

## 13. 60-second revision card

**Key insight:** the test `nums[lo] <= nums[mid]` ("left half sorted") is only ambiguous when `nums[lo] == nums[mid] == nums[hi]`. Then none of them is the target, so drop both ends.

**Invariant:** if the target occurs, an occurrence is in `[lo, hi]`.

**Complexity:** O(log n + t) time with t tie steps; O(n) worst case (all 1s, target 2). Every correct algorithm must read all n elements on some input, so O(n) is worst-case optimal. O(1) space.

**Code skeleton:**

```java title="Rotated search with duplicates" fragment="public boolean search(int[] nums, int target)"
int lo = 0, hi = nums.length - 1;
while (lo <= hi) {
    int mid = (lo + hi) >>> 1;
    if (nums[mid] == target) return true;
    if (nums[lo] == nums[mid] && nums[mid] == nums[hi]) { lo++; hi--; }
    else if (nums[lo] <= nums[mid]) {
        if (nums[lo] <= target && target < nums[mid]) hi = mid - 1; else lo = mid + 1;
    } else {
        if (nums[mid] < target && target <= nums[hi]) lo = mid + 1; else hi = mid - 1;
    }
}
return false;
```

**Main traps:**

- Forgetting the tie branch: `[1, 0, 1, 1, 1]`, target 0 fails.
- Claiming O(log n) worst case.
- Finding the rotation point with plain `hi--`.

**What to say in one breath:** "It's the rotated search with one extra case: when the first, middle and last values are all equal, I can't tell which half is sorted, but none of them is the target, so I drop both ends. Otherwise one half is provably sorted and I keep the half that can hold the target. Duplicates make the worst case O(n), for example all 1s with target 2, and no algorithm can beat that: on the all-1s array it has to read every position, or it can't rule out a hidden 2."
