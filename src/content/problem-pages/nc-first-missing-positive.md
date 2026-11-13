---
problemId: nc-first-missing-positive
title: First Missing Positive
source: neetcode
sourceUrl: https://leetcode.com/problems/first-missing-positive/
difficulty: hard
patterns: [arrays-hashing, hashing, cyclic-sort]
relatedLessons: [a2-hashing, a2-sorting-based, a2-array-string-traversal, a14-clarifying-requirements, a14-edge-cases, a14-deriving-optimization]
companies: []
timeToSolve: 30
---

## 1. Problem restatement

You get an unsorted integer array `nums`. Return the smallest positive integer (1, 2, 3, …) that does not appear in it. Your algorithm must run in O(n) time and use only O(1) auxiliary space.

**Example 1**

- Input: `nums = [5, 3, -2, 1, 2]`
- Output: `4`
- Why: 1, 2 and 3 are present, 4 is not. The 5 and the −2 do not matter: 5 comes after the gap and −2 is not positive.

**Example 2**

- Input: `nums = [8, 9, 10]`
- Output: `1`
- Why: 1 is the smallest positive integer, and it is missing. Large values do not help if the small ones are absent.

**What the problem statement guarantees**

- 1 ≤ n ≤ 10^5, where n = `nums.length`.
- −2^31 ≤ `nums[i]` ≤ 2^31 − 1: the full `int` range, including `Integer.MIN_VALUE` and `Integer.MAX_VALUE`.
- The algorithm must run in O(n) time with O(1) auxiliary space.
- Values may repeat, and may be zero or negative.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. Two easy solutions each break one of the two requirements; finding the one that meets both is the whole problem. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 30 minutes and talk out loud.
2. Write down two simple correct solutions and say which requirement each one breaks.
3. Answer this before designing: if the array has n elements, how large can the answer possibly be?
4. Write the code, then trace it on `[5, 3, -2, 1, 2]`, `[1, 1]` and `[2, 1]`.
5. Count how many times your inner loop can run in total, and check what your code does with `-2147483648` and `2147483647`.

> [!HINT] Hint 1: a small nudge
> n numbers can cover at most n of the values 1, 2, …, n + 1. So the answer is always between 1 and n + 1. Which values in the array can you then ignore completely?

> [!HINT] Hint 2: the kind of tool you need
> You only need to remember "is k present?" for k from 1 to n. That fits in a boolean array of length n, but you may not allocate one. The input array already has n slots. Can slot k − 1 itself record whether k is present?

> [!HINT] Hint 3: almost the whole plan
> Put each value v with 1 ≤ v ≤ n into slot v − 1 by swapping: while the current slot holds such a v and slot v − 1 does not already hold v, swap them. Afterwards, the first slot i that does not hold i + 1 gives the answer i + 1; if every slot is right, the answer is n + 1. Then work out why the condition is "slot v − 1 does not already hold v" and not "slot i does not hold i + 1".

**Check yourself before revealing the walkthrough**

- [ ] I can prove the answer is between 1 and n + 1
- [ ] I said which requirement the sorting and hash set solutions break
- [ ] My code returns 4 for `[5, 3, -2, 1, 2]`, 2 for `[1, 1]` and 3 for `[2, 1]`, and terminates on all of them
- [ ] I can argue that my solution's total work is linear, even if it has a loop inside a loop
- [ ] I said out loud that my solution changes the input array, and asked whether that is allowed

## 3. Interview script: understand the problem (≈3 min)

**Me:** I return the smallest positive integer that isn't in the array. So zero and negatives never count as the answer, and the answer is at least 1.

**Interviewer:** Right.

**Me:** Duplicates allowed? Negative values and zero?

**Interviewer:** Yes to all.

**Me:** Range and size?

**Interviewer:** Up to 10^5 elements, at least one. Any 32-bit integer.

**Me:** So `Integer.MIN_VALUE` and `Integer.MAX_VALUE` can both show up. I'll be careful not to do arithmetic on a raw value, like `nums[i] - 1` or `nums[i] + 1`, before I've checked it's in a small range. And the requirement is O(n) time and O(1) extra space?

**Interviewer:** Yes, both.

**Me:** Then I'll almost certainly need to use the input array as my scratch space. May I modify `nums`? The caller would see it reordered or overwritten.

**Interviewer:** Yes, you may modify it.

**Me:** Good. Quick example: `[5, 3, -2, 1, 2]`. Is 1 there? Yes. 2? Yes. 3? Yes. 4? No. So 4.

**Me:** One more observation before designing. There are n numbers, and the values 1 to n + 1 are n + 1 different values, so at least one of them is missing. The answer is at most n + 1. That means anything less than 1 or greater than n is irrelevant to the answer.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| O(n) time | Rules out sorting as the final answer. |
| O(1) auxiliary space | Rules out a hash set or a boolean array as the final answer. The input array itself must hold the bookkeeping. |
| 1 ≤ n ≤ 10^5 | Never empty. O(n²) would be about 10^10 steps, far too slow. Answers up to n + 1 ≤ 100,001 fit in an `int`. |
| Values span the whole `int` range | `v - 1` and `v + 1` overflow at the extremes, so every index computation happens only after a range check. |
| Duplicates, zeros and negatives occur | Zeros and negatives must be skipped; duplicates must not make a placement loop spin forever. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| The input array may be modified | Makes the O(1)-space methods possible: they rearrange or overwrite `nums`. Without this permission I would copy the array and lose the O(1) space. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The caller does not need `nums` in its original state afterwards | It follows from the permission, but I say it explicitly: the array comes back permuted (or overwritten, in the sign-marking variant). |
| A single-threaded call: nobody else reads `nums` while I work | The array is in a temporarily inconsistent state during the method. |

### Edge cases I will keep in mind

- n = 1: `[1]` → 2; `[2]` → 1; `[-5]` → 1.
- A permutation of 1..n: the answer is n + 1, for example `[2, 1]` → 3.
- Duplicates that could loop forever in a careless swap: `[1, 1]`, `[2, 2]`.
- All non-positive or all too large: `[0, -1, -7]` → 1, `[8, 9, 10]` → 1.
- `Integer.MIN_VALUE` and `Integer.MAX_VALUE` in the input.
- The largest n, including long chains of swaps.

## 4. Think out loud: from first idea to best solution

**Why the answer is between 1 and n + 1.** The values 1, 2, …, n + 1 are n + 1 different numbers, and the array has only n elements, so at least one of them is missing. The answer is the smallest missing positive, so it is at most that missing one, which is at most n + 1. It is at least 1 by definition. Consequence: values ≤ 0 and values > n can never be the answer and never affect which of 1..n are present, so every method below can ignore them.

The most literal method tries k = 1, 2, … and scans the whole array for each k. By the bound, it stops by k = n + 1, so it is O(n²) time and O(1) space: about 10^10 steps at n = 10^5. I state it as the baseline and do not code it.

### Approach 1: Sort, then walk up from 1

#### What I say out loud

> "If the array were sorted, I could walk through it with a counter `expected` starting at 1. Each time I see `expected`, I bump it. Values below `expected` are negatives, zeros or duplicates and I skip them. The first time I see something bigger than `expected`, there's a gap, and `expected` is the answer."

> "That's O(n log n) time, which breaks the O(n) requirement. Space: sorting in place is allowed since I may modify the array, but Java's primitive sort still uses a recursion stack, O(log n) in typical implementations, so it's not strictly O(1) either. It's my correct baseline."

#### Intuition

In sorted order the positives appear in increasing order, so the first gap in the run 1, 2, 3, … is visible in one scan. This is the standard use of [[a2-sorting-based|sorting to expose structure]].

#### Algorithm

1. Sort `nums` in place.
2. `expected = 1`. For each `x` in order: if `x == expected`, increment `expected`; if `x > expected`, stop.
3. Return `expected`.

#### Why it is correct

Invariant: after processing a prefix of the sorted array, every positive integer below `expected` occurs in that prefix, and every value in the prefix is below `expected`. It holds for the empty prefix with `expected = 1`. A value below `expected` (non-positive, or a duplicate of one already counted) changes nothing. A value equal to `expected` is now present, and incrementing `expected` keeps both halves true. When a value x greater than `expected` arrives, every later value is at least x because the array is sorted, and every earlier value is below `expected`, so `expected` occurs nowhere; all smaller positives occur, so it is the answer. If the scan ends, the same two facts cover the whole array.

#### Dry run

`nums = [5, 3, -2, 1, 2]`. Sorted: `[-2, 1, 2, 3, 5]`.

| x | `expected` before | Action | `expected` after |
|---|---|---|---|
| −2 | 1 | below, skip | 1 |
| 1 | 1 | equal, increment | 2 |
| 2 | 2 | equal, increment | 3 |
| 3 | 3 | equal, increment | 4 |
| 5 | 4 | greater, stop | 4 |

Returns 4.

#### Java code

```java title="Approach 1: sort, then walk up from 1"
import java.util.Arrays;

class Solution {
    public int firstMissingPositive(int[] nums) {
        Arrays.sort(nums);              // allowed: the interviewer said nums may be modified
        int expected = 1;               // smallest positive not seen yet
        for (int x : nums) {
            if (x == expected) {
                expected++;
            } else if (x > expected) {
                break;                  // expected was skipped in sorted order
            }                           // x < expected: non-positive or a duplicate
        }
        return expected;
    }
}
```

`expected` never exceeds n + 1, and comparisons on `int` values cannot overflow, so the extremes are safe.

#### Time complexity

**O(n log n)**, where n is `nums.length`: the sort dominates the linear scan. The JDK documentation for recent versions states O(n log n) for sorting an `int[]`. **This breaks the O(n) requirement.**

#### Space complexity

**O(log n) auxiliary space** for the sort's recursion stack in typical implementations; the scan itself uses O(1). Not strictly O(1).

#### The bridge to the next approach

> "Sorting does more than I need: I don't care about order, only about membership, 'is k present?'. A hash set answers that in expected constant time, and I only ever ask about k from 1 to n + 1."

### Approach 2: Hash set of the values

#### What I say out loud

> "Put every value in a HashSet, then try k = 1, 2, 3, … until the set doesn't contain k. By the bound, that's at most n + 1 lookups. Linear expected time, but O(n) memory, which breaks the space requirement. It also leaves the input untouched, which is nice."

#### Intuition

Membership questions are what [[a2-hashing|hashing]] is for. The bound on the answer caps the number of questions at n + 1.

#### Algorithm

1. Add every element of `nums` to a set.
2. `k = 1`; while the set contains `k`, increment `k`.
3. Return `k`.

#### Why it is correct

The loop stops at the first k that is not in the set, and every smaller positive was found in it, so k is the smallest missing positive. It stops by k = n + 1, since some value in 1..n + 1 is missing.

#### Dry run

`nums = [5, 3, -2, 1, 2]`: the set is {5, 3, −2, 1, 2}. k = 1 found, 2 found, 3 found, 4 not found. Returns 4.

#### Java code

```java title="Approach 2: hash set"
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int firstMissingPositive(int[] nums) {
        Set<Integer> present = new HashSet<>();
        for (int x : nums) {
            present.add(x);
        }
        int k = 1;
        while (present.contains(k)) {   // stops by k = n + 1
            k++;
        }
        return k;
    }
}
```

#### Time complexity

**O(n) expected time**: n inserts and at most n + 1 lookups, each constant on average if hash codes spread well. In the worst case colliding keys make each operation slower: O(n) with list buckets; about O(log n) with the balanced-tree buckets that current Java implementations use for `Integer` keys, which is implementation behaviour rather than an API guarantee. **Expected rather than worst-case linear.**

#### Space complexity

**O(n) auxiliary space**: up to n boxed values in the set. **This breaks the O(1) space requirement.**

#### The bridge to the next approach

> "The set stores every value, including negatives and huge ones, that can never matter. I only care about 1 to n. So I could replace the set with a boolean array of size n: `seen[k - 1]` says whether k is present. That gets rid of hashing and makes the time a worst-case O(n), but it's still O(n) space."

### Approach 3: Boolean presence array

#### What I say out loud

> "A boolean array indexed by value, only for values 1 to n. One pass marks them, a second pass finds the first unmarked one. Deterministic O(n), but O(n) extra memory. Now the real question: the input already has exactly n slots. Can I store this presence information in `nums` itself?"

#### Intuition

The bound turns an unbounded membership question into one about a fixed range 1..n, and a fixed small range is a direct-address table: an array indexed by value.

#### Algorithm

1. `seen = new boolean[n]`.
2. For each `x` with 1 ≤ `x` ≤ n, set `seen[x - 1] = true`.
3. Return the first k with `seen[k - 1] == false`, or n + 1 if all are true.

#### Why it is correct

`seen[k - 1]` is true exactly when k occurs in `nums`, for every k in 1..n. The first false entry is the smallest missing value in 1..n; if there is none, 1..n are all present and the answer is n + 1.

#### Dry run

`nums = [5, 3, -2, 1, 2]`, n = 5. Marks for 5, 3, 1, 2; −2 is skipped. `seen = [T, T, T, F, T]`. The first false is index 3. Returns 4.

#### Java code

```java title="Approach 3: boolean presence array"
class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;
        boolean[] seen = new boolean[n];
        for (int x : nums) {
            if (x >= 1 && x <= n) {         // range check before computing x - 1
                seen[x - 1] = true;
            }
        }
        for (int k = 1; k <= n; k++) {
            if (!seen[k - 1]) {
                return k;
            }
        }
        return n + 1;
    }
}
```

#### Time complexity

**O(n) in every case**: two passes, constant work per element, no hashing.

#### Space complexity

**O(n) auxiliary space** for `seen`. **This still breaks the O(1) requirement.**

#### The bridge to the next approach

> "Here's the idea. Instead of a separate `seen[k - 1]`, I make slot k − 1 of `nums` hold the value k whenever k is in the array. I move each value v in 1..n to slot v − 1 by swapping. Whatever was in slot v − 1 comes back to my current position, and I keep going with it until the current slot holds something useless or something whose home is already right. Then a scan finds the first slot i that doesn't hold i + 1."

> "Two things to check before I trust it. Duplicates: if two 3s exist, the second one's home already holds a 3, so I must not swap, or I'd swap 3 with 3 forever. That's why the stop condition is 'slot v − 1 already holds v'. And cost: a while loop inside a for loop looks quadratic. But each swap puts a value into its home slot permanently, and there are only n slots, so at most n swaps in total."

### Approach 4: Cyclic placement in place (recommended)

#### What I say out loud

> "Phase one: for each index i, while `nums[i]` is a value v between 1 and n and slot v − 1 doesn't already hold v, swap `nums[i]` with `nums[v - 1]`. Phase two: return the first i + 1 where `nums[i] != i + 1`, or n + 1."

> "The range check comes first, so I only compute v − 1 for 1 ≤ v ≤ n: no overflow at the extremes. And this rearranges the input, which you said is fine."

#### Intuition

After phase one, the array is its own presence table: slot k − 1 holds k if and only if k occurs in the input. The values are only permuted, never lost, so nothing outside the array needs remembering. This in-place placement is often called cyclic sort, because each swap follows the cycle of "where does this value belong" until it closes.

#### Algorithm

1. For i from 0 to n − 1:
   - while 1 ≤ `nums[i]` ≤ n and `nums[nums[i] - 1] != nums[i]`: let v = `nums[i]`, swap `nums[i]` and `nums[v - 1]`.
2. For i from 0 to n − 1: if `nums[i] != i + 1`, return i + 1.
3. Return n + 1.

#### Why it is correct

Call slot j **settled** when `nums[j] == j + 1`.

**Swaps only permute.** The multiset of values never changes, so a value is present at the end exactly when it was present at the start.

**A settled slot stays settled.** A swap at index i touches slots i and v − 1. It never touches a settled slot: if v − 1 were settled it would hold v, and the loop condition `nums[v - 1] != v` would be false; if i were settled, `nums[i] = i + 1 = v` would make v − 1 = i, the same slot, and the condition would again be false.

**What every slot holds after phase one.** When the while loop for index i stops, `nums[i]` is either out of range (≤ 0 or > n) or a value v whose home slot v − 1 already holds v (either i is its home, or it is a duplicate). Later iterations touch slot i only if it is the home slot of a value being placed, which settles it. So at the end every slot is settled, holds an out-of-range value, or holds a duplicate whose home is settled.

**So, for every k in 1..n: k is present in the input if and only if slot k − 1 is settled.** If slot k − 1 holds k, k is present (swaps only permute). If k is present, it sits in some slot j; by the previous paragraph either j = k − 1 or slot k − 1 is settled. Either way slot k − 1 holds k. Phase two returns the first k whose slot is not settled, which is the smallest missing value in 1..n, or n + 1 if 1..n are all present, which by the bound is the answer.

**Termination and cost: at most n swaps in total.** Each swap puts v into slot v − 1, which was not settled before (the loop condition), and is settled afterwards, and settled slots stay settled. There are n slots, so there are at most n swaps over the whole run, however they are spread across the outer iterations. Each while-condition check either leads to a swap or ends that index's loop, so the checks number at most n (failed) + n (successful). Phase one is O(n): amortized, not per index.

**Why the condition is `nums[v - 1] != v`, not `nums[i] != i + 1`.** Both stop when slot i is settled, but only the first stops on a duplicate. With `[1, 1]`, at i = 1 the value 1 is not at its home index 1, yet its home slot 0 already holds 1. The condition `nums[i] != i + 1` would swap the two 1s, change nothing, and loop forever. The condition `nums[v - 1] != v` guarantees that every swap settles a new slot, which is what bounds the swaps by n.

**Overflow.** `nums[i] - 1` is only computed after `1 <= nums[i] && nums[i] <= n` has passed, thanks to `&&` short-circuiting, so it lies in [0, n − 1]. `Integer.MIN_VALUE` fails the first comparison and `Integer.MAX_VALUE` the second; no arithmetic is ever done on them. The return values are at most n + 1 ≤ 100,001.

**The 30-second version to say to the interviewer:**

> "The answer is between 1 and n + 1, so only values 1 to n matter, and the array has exactly n slots. I swap each such value v into slot v − 1 unless that slot already holds v. Every swap settles one slot for good, so there are at most n swaps in total and the whole thing is O(n). Afterwards slot k − 1 holds k exactly when k was in the input, so the first slot that's wrong gives the answer, and if none is wrong it's n + 1. The 'slot already holds v' check is what stops duplicates from swapping forever."

#### Dry run

`nums = [5, 3, -2, 1, 2]`, n = 5.

| i | `nums[i]` = v | Check | Array after the step |
|---|---|---|---|
| 0 | 5 | in range; slot 4 holds 2 ≠ 5: swap | `[2, 3, -2, 1, 5]` |
| 0 | 2 | in range; slot 1 holds 3 ≠ 2: swap | `[3, 2, -2, 1, 5]` |
| 0 | 3 | in range; slot 2 holds −2 ≠ 3: swap | `[-2, 2, 3, 1, 5]` |
| 0 | −2 | out of range: next i | `[-2, 2, 3, 1, 5]` |
| 1 | 2 | slot 1 already holds 2: next i | unchanged |
| 2 | 3 | slot 2 already holds 3: next i | unchanged |
| 3 | 1 | in range; slot 0 holds −2 ≠ 1: swap | `[1, 2, 3, -2, 5]` |
| 3 | −2 | out of range: next i | `[1, 2, 3, -2, 5]` |
| 4 | 5 | slot 4 already holds 5: next i | unchanged |

Four swaps for n = 5; the index-0 loop did three of them, which is why only the total is bounded. Phase two: slots 0, 1, 2 hold 1, 2, 3; slot 3 holds −2 ≠ 4. Returns 4.

#### Java code

```java title="Approach 4: cyclic placement (recommended)"
class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;
        // Phase 1: put every value v in 1..n into slot v - 1. Modifies nums (allowed).
        for (int i = 0; i < n; i++) {
            // Range check first, so nums[i] - 1 is only computed for 1 <= nums[i] <= n.
            // "Home slot already holds v" stops duplicates from swapping forever.
            while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                int v = nums[i];
                nums[i] = nums[v - 1];
                nums[v - 1] = v;            // slot v - 1 is now settled for good
            }
        }
        // Phase 2: the first slot that does not hold its own value names the answer.
        for (int i = 0; i < n; i++) {
            if (nums[i] != i + 1) {
                return i + 1;
            }
        }
        return n + 1;                       // 1..n are all present
    }
}
```

#### Time complexity

**O(n) in every case.** Phase one makes at most n swaps in total (each settles a new slot) and at most 2n condition checks; phase two is one scan. No hashing, so this is a worst-case bound.

#### Space complexity

**O(1) auxiliary space**: a few integers. The input array is used as the presence table, which is why the permission to modify it matters.

### Alternative: sign marking

Another way to store "k is present" in `nums`: use the sign of slot k − 1 as the flag.

1. Replace every value ≤ 0 or > n with n + 1. Now every value is positive and at most n + 1, so negation cannot overflow, and no original negative can be mistaken for a mark.
2. For each i: v = `Math.abs(nums[i])` (the slot may already be marked). If v ≤ n and `nums[v - 1] > 0`, negate `nums[v - 1]`.
3. The first i with `nums[i] > 0` gives i + 1; otherwise n + 1.

On `[5, 3, -2, 1, 2]`: step 1 gives `[5, 3, 6, 1, 2]`; step 2 negates slots 4, 2, 0, 1 (6 is skipped) and ends at `[-5, -3, -6, 1, -2]`; slot 3 is the first positive, so it returns 4.

```java title="Alternative: sign marking"
class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            if (nums[i] <= 0 || nums[i] > n) {
                nums[i] = n + 1;            // irrelevant values; also removes Integer.MIN_VALUE
            }
        }
        for (int i = 0; i < n; i++) {
            int v = Math.abs(nums[i]);      // the slot may already carry a mark
            if (v <= n && nums[v - 1] > 0) {
                nums[v - 1] = -nums[v - 1]; // mark: v is present
            }
        }
        for (int i = 0; i < n; i++) {
            if (nums[i] > 0) {
                return i + 1;
            }
        }
        return n + 1;
    }
}
```

O(n) time in every case (three passes) and O(1) space, like Approach 4. It has no swap loop to argue about, but it overwrites values, while cyclic placement only permutes them. The cleanup step is essential: skip it and `[-2]` returns 2 instead of 1, because the original −2 looks like a mark; and `Math.abs(Integer.MIN_VALUE)` is still negative, since +2^31 does not fit in an `int`.

## 5. Comparison table

n = `nums.length`.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Baseline: scan for k = 1, 2, … | O(n²) | O(n²) | O(1) |
| 1. Sort, walk up from 1 | O(n log n) | O(n log n) per recent JDK documentation | O(log n) sort stack |
| 2. Hash set | O(n) | O(n²) in general; about O(n log n) with current Java tree buckets and `Integer` keys (not an API guarantee) | O(n) |
| 3. Boolean presence array | O(n) | O(n) | O(n) |
| 4. Cyclic placement | O(n) | O(n) | O(1) |
| Alt. Sign marking | O(n) | O(n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Sort | Short, easy to justify | Breaks O(n) time; mutates or copies | A first correct answer, said in a sentence |
| 2. Hash set | Simple; input untouched | Breaks O(1) space; expected time only | When the input must not change and memory is fine |
| 3. Boolean array | Deterministic O(n); input untouched | Breaks O(1) space | The best answer if mutation is not allowed |
| 4. Cyclic placement | Meets both requirements; values only permuted | Needs the amortized argument and careful loop condition | The default answer here |
| Alt. Sign marking | Meets both; no swap loop | Overwrites values; cleanup step and sign tricks are easy to get wrong | If you find the flag idea more natural than swapping |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** derive the [1, n + 1] bound first, mention sorting and the hash set with the requirement each one breaks, step through the boolean array, then present cyclic placement as "the same table, stored in `nums`". Code it with the range check first and the `nums[v - 1] != v` condition, and give the amortized swap count.

**Is it optimal?** Yes. In the worst case a correct algorithm must inspect essentially every element: for a permutation of 1..n the answer is n + 1, but if any unread element were changed to a value outside 1..n the answer would drop. That gives an Ω(n) worst-case lower bound, and Approach 4 meets it with O(1) auxiliary space.

**When something else is better in practice:** if the caller needs `nums` unchanged, the boolean array (O(n) time, O(n) space) is the honest answer; both in-place methods use the input as scratch space. Copying the array first and running Approach 4 on the copy costs the same O(n) space.

**When to stop:** once you have Approach 4, its proof, the swap bound and the overflow argument. Mention sign marking as an alternative; do not code it unless asked.

## 7. Interview script: code it and test it

### What I say while coding

> "Phase one, the for loop with a while inside. I'll write the range check first, `nums[i] >= 1 && nums[i] <= n`, and only then index `nums[nums[i] - 1]`, so I never compute `MIN_VALUE - 1`."

> "The while condition's last part is 'home slot doesn't already hold this value'. That's both the duplicate guard and the reason each swap settles a new slot."

> "I copy `nums[i]` into `v` before swapping, because after the first assignment `nums[i]` is a different value, and `nums[v - 1]` must use the old one."

> "Phase two is a plain scan; if it falls through, the answer is n + 1."

### Testing out loud

**Normal case:** `[5, 3, -2, 1, 2]`. As in the dry run, four swaps give `[1, 2, 3, -2, 5]`, and the first wrong slot is index 3. Returns 4.

**Duplicates:** `[1, 1]`. i = 0: 1 is home. i = 1: v = 1, slot 0 already holds 1, stop. Phase two: slot 1 holds 1 ≠ 2. Returns 2, and the loop terminated.

**Permutation:** `[2, 1]`. i = 0: v = 2, slot 1 holds 1 ≠ 2, swap → `[1, 2]`; now v = 1 is home. Phase two finds nothing wrong. Returns 3 = n + 1.

**Nothing useful:** `[8, 9, 10]`. Every value is > n = 3, no swaps. Slot 0 holds 8 ≠ 1. Returns 1.

**Single element:** `[1]` returns 2; `[-5]` returns 1.

**Extremes:** `[2147483647, -2147483648, 1]`. The first two fail the range check without any arithmetic; 1 is swapped into slot 0, which brings `MAX_VALUE` to index 2. Phase two: slot 1 holds `MIN_VALUE` ≠ 2. Returns 2.

**Largest n:** a shuffled permutation of 1..10^5 returns 100,001 after at most 10^5 swaps.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2–3 min | Duplicates, negatives, full `int` range, may I modify `nums` |
| The bound | 1–2 min | Answer in [1, n + 1], so only 1..n matter |
| Simple solutions | 2 min | Sort and hash set, and which requirement each breaks; the boolean array |
| Derive in-place placement | 5 min | "Store the boolean array in `nums`"; the duplicate condition |
| Correctness and cost | 3 min | Settled slots, at most n swaps |
| Code | 5 min | Range check first, `v` copied before the swap |
| Trace | 5 min | Example, `[1, 1]`, `[2, 1]`, extremes |

The bound and the amortized argument are where this problem is won; interviewers expect a hard problem to take most of the session. If the in-place idea does not come, code the boolean array (it is correct and linear), say that it breaks only the space requirement, and ask for a hint about reusing `nums`.

## 9. Interviewer challenges

### About complexity

#### There's a while loop inside a for loop. Why isn't it O(n²)?

**What they are testing:** amortized analysis instead of counting loops.

**How to reason:** count swaps over the whole run, not per outer iteration, and find something that each swap uses up.

**What I say:** "Each swap puts some value v into slot v − 1, which didn't hold v before and does afterwards. A slot holding its own value is never touched again, because the condition would be false for it. So each swap settles a new slot, and there are only n slots: at most n swaps in total. One index can do many swaps, as index 0 did three times in my trace, but then the others do fewer."

**Nuance:** the bound needs the exact condition `nums[v - 1] != v`. With a condition that allows a swap that settles nothing, the counting argument fails, and with duplicates the loop never ends.

#### Is this really O(1) space?

**What they are testing:** honesty about what the trick costs.

**How to reason:** separate auxiliary space from the input, and say what you do to the input.

**What I say:** "Auxiliary space is a few integers. But I use the input array as my table, so the caller gets it back permuted. That's why I asked whether I may modify it. If I couldn't, I'd need a copy or a boolean array, O(n) space."

**Nuance:** sign marking also overwrites values (out-of-range ones become n + 1 and signs flip), so the original contents cannot be recovered from it either.

### About correctness

#### Why is the answer never larger than n + 1?

**What they are testing:** the observation that makes the in-place idea possible.

**How to reason:** pigeonhole on the values 1..n + 1.

**What I say:** "There are n + 1 values from 1 to n + 1 and only n elements, so at least one of them is missing, and the smallest missing positive is no larger than that one. That's why values below 1 or above n can be ignored, and why the array's n slots are exactly enough to record what matters."

**Nuance:** n + 1 itself is reached exactly when the array is a permutation of 1..n.

#### What happens with duplicates?

**What they are testing:** whether your loop terminates on every input.

**How to reason:** run the loop on the smallest duplicate input.

**What I say:** "With `[1, 1]`, at index 1 the value 1 isn't at its own index, but its home slot 0 already holds 1. My condition checks the home slot, so it stops. A version that checks `nums[i] != i + 1` would swap 1 with 1 forever. Duplicates just stay in some unsettled slot and are skipped."

**Nuance:** a duplicate never causes a wrong answer either: its value's home is settled, and phase two only reads which slots are settled.

#### How do you avoid overflow with `Integer.MIN_VALUE` and `Integer.MAX_VALUE`?

**What they are testing:** care at the type boundaries.

**How to reason:** find every arithmetic expression on an input value and check what guards it.

**What I say:** "The only arithmetic on a value is `nums[i] - 1` as an index, and it's behind `nums[i] >= 1 && nums[i] <= n` with short-circuiting, so it only runs for 1 to n. The extremes fail the range check and are never touched arithmetically. In the sign-marking version, the cleanup pass replaces them with n + 1 before any negation, because `-Integer.MIN_VALUE` is still `MIN_VALUE`."

**Nuance:** the answer itself is at most n + 1 ≤ 100,001, so returning `i + 1` or `n + 1` cannot overflow.

## 10. Follow-up questions the interviewer might ask

**"You may not modify the input."**
Use the boolean array: O(n) time in every case, O(n) space. The in-place methods depend on writing to `nums`; copying it first costs the same O(n) space.

**"The array holds 0..n with exactly one missing; find it."**
The values fit the slots exactly, so XOR or the sum formula finds it in O(n) time and O(1) space without modifying anything (use `long` for the sum or rely on wrapping, which cancels out). That is [[nc-missing-number|Missing Number]].

**"Values are 1..n with one repeated; find the duplicate without modifying the array."**
Treat `i → nums[i]` as a linked list and use cycle detection: O(n) time, O(1) space. That is [[nc-find-the-duplicate-number|Find the Duplicate Number]].

**"Return all numbers in 1..n that are missing."**
Run the same cyclic placement, then report every unsettled slot index + 1. O(n) time, O(1) auxiliary space plus the output.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Not finding the [1, n + 1] bound.** Without it, values look unbounded and the in-place idea has nowhere to start.
- **Presenting the hash set as meeting the requirements.** It is O(n) space, and its time is only expected linear.
- **Calling the nested loop O(n²)** or, worse, O(n) without the swap-counting argument.
- **Modifying the input without asking.** Here the permission is essential; say so.
- **Thinking duplicates need special handling.** The right loop condition handles them; they end up in unsettled slots.

### Implementation mistakes

> [!MISTAKE] Loop condition `nums[i] != i + 1` instead of `nums[nums[i] - 1] != nums[i]`
> With duplicates the loop never ends: on `[1, 1]` the second 1 is swapped with the first one forever, and `[2, 2]` hangs at index 0. Check whether the value's home already holds it.

> [!MISTAKE] `if` instead of `while` for the swap
> One swap per index leaves the value that arrived at index i unplaced. `[3, 4, -1, 1]` then returns 1 instead of 2, and `[-1, 3, 1]` returns 1 instead of 2.

- **Indexing before the range check,** for example `nums[nums[i] - 1]` first: a negative value gives a negative index, and the program throws.
- **Swapping through `nums[i]` twice:** `nums[i] = nums[nums[i] - 1]; nums[nums[i] - 1] = …` reads the already-changed `nums[i]`. Save `v` first.
- **Sign marking without the cleanup pass:** original negatives look like marks; `[-2]` returns 2 instead of 1.
- **Using `Math.abs` on unbounded values:** `Math.abs(Integer.MIN_VALUE)` is negative. Clean up first.

## 12. Pattern recognition

**The pattern:** cyclic placement (index-as-hash). When the relevant values lie in 1..n and the array has n slots, slot v − 1 can record value v, turning the array into its own presence table in O(1) extra space.

**Signals in the problem statement:**

- "O(n) time and O(1) extra space" on a membership or counting question.
- Values that matter are bounded by the array length (often after an argument like the n + 1 bound).
- "Missing", "duplicate", "first positive", "numbers in the range [1, n]".

**Related problems in this list:**

- [[nc-missing-number|Missing Number]]: values 0..n, one missing; arithmetic or XOR instead of placement.
- [[nc-find-the-duplicate-number|Find the Duplicate Number]]: values 1..n as pointers, with the input read-only.
- [[cses-missing-number|Missing Number (CSES)]]: n − 1 distinct numbers from 1..n, one missing; the sum or XOR trick again.
- [[nc-contains-duplicate|Contains Duplicate]]: the hash-set membership baseline.
- [[nc-sort-colors|Sort Colors]]: another in-place rearrangement with O(1) space and a careful swap loop.

**Takeaway:** bound the answer first. If the values that matter fit the array's indices, store "v is present" at index v − 1, by swapping or by sign, and count work by what each step settles for good.

## 13. 60-second revision card

**Key insight:** the answer is in [1, n + 1], so only values 1..n matter, and they fit in the array's own n slots. Swap each such v into slot v − 1; then the first slot i not holding i + 1 gives the answer.

**Invariant:** a settled slot (`nums[j] == j + 1`) is never touched again, so each swap settles a new slot: at most n swaps.

**Complexity:** O(n) worst-case time, O(1) auxiliary space; the input is permuted. Ω(n) worst-case lower bound.

**Code skeleton:**

```java title="Cyclic placement in nine lines" fragment="public int firstMissingPositive(int[] nums)"
int n = nums.length;
for (int i = 0; i < n; i++)
    while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
        int v = nums[i];
        nums[i] = nums[v - 1];
        nums[v - 1] = v;
    }
for (int i = 0; i < n; i++) if (nums[i] != i + 1) return i + 1;
return n + 1;
```

**Main traps:**

- Range check before `nums[i] - 1`; extremes never touched arithmetically.
- Condition `nums[v - 1] != v`, not `nums[i] != i + 1`, or duplicates loop forever.
- `while`, not `if`; save `v` before swapping.
- Say that `nums` is modified, and ask first.

**What to say in one breath:** "n numbers can't cover 1 to n + 1, so the answer is at most n + 1 and only values 1 to n matter. I swap each such v into slot v − 1 unless it's already there, which settles one slot per swap, so at most n swaps: O(n) time, O(1) space, with the input permuted. Then the first slot that doesn't hold its index plus one is the answer, or n + 1."
