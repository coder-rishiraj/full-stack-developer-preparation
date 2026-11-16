---
problemId: nc-missing-number
title: Missing Number
source: neetcode
sourceUrl: https://leetcode.com/problems/missing-number/
difficulty: easy
patterns: [bit-manipulation, mathematics, hashing, cyclic-sort]
relatedLessons: [a13-and-or-xor, a13-xor-tricks, a2-array-string-traversal, a2-hashing, a2-sorting-based, a14-brute-force-first, a14-deriving-optimization]
companies: []
timeToSolve: 10
---

## 1. Problem restatement

You get an array `nums` of n distinct integers, each between 0 and n inclusive. The range 0..n has n + 1 values and the array holds n of them, so exactly one value of the range is absent. Return it.

**Example 1**

- Input: `nums = [3, 0, 1]`
- Output: `2`
- Why: n = 3, so the range is 0..3. The array has 0, 1 and 3; 2 is absent.

**Example 2**

- Input: `nums = [0, 1]`
- Output: `2`
- Why: n = 2, so the range is 0..2. The absent value is n itself, which no gap between the numbers reveals.

**Example 3**

- Input: `nums = [9, 6, 4, 2, 3, 5, 7, 0, 1]`
- Output: `8`
- Why: n = 9; every value of 0..9 except 8 appears.

**What the problem statement guarantees**

- n == `nums.length`, and 1 ≤ n ≤ 10^4.
- 0 ≤ `nums[i]` ≤ n.
- All the numbers in `nums` are distinct.
- Follow-up in the statement: could you do it with O(1) extra space and O(n) time?

## 2. Practice first: try it before reading on

If you have not solved this yourself yet, stop here. The answer is short, but the interview is about the path: several solutions, what each costs, and why the last one works. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 10 minutes and talk out loud.
2. Say the slowest solution you are certain of, and its cost at n = 10^4.
3. Find solutions that use more memory to go faster, then one that meets the follow-up: O(n) time and O(1) extra space.
4. For that last one, prove it in two sentences, and check the largest number it computes.

Open a hint only after a couple of minutes without progress.

> [!HINT] Hint 1: a small nudge
> You know exactly which values the array would hold if nothing were missing: 0, 1, …, n. What single number could you compute for that full list, and for the array, so that comparing them gives the missing value?

> [!HINT] Hint 2: the kind of tool you need
> Removing one value from 0..n lowers the total 0 + 1 + … + n by exactly that value, and the total has a closed form. Another operation has the same "cancelling" property without ever growing: one under which any value combined with itself gives zero.

> [!HINT] Hint 3: almost the whole plan
> Compute n(n + 1)/2 and subtract every element; what remains is the answer. Check that n(n + 1) fits in an `int` for n ≤ 10^4. Or: start from n and, for each index i, fold in both i and `nums[i]` with the cancelling operation; the indices 0..n − 1 plus n cover the whole range.

**Check yourself before revealing the walkthrough**

- [ ] I can give at least four solutions with their time and extra space
- [ ] My O(1)-space solution returns 2 for `[0, 1]`, 0 for `[1]` and 1 for `[0]`
- [ ] I know the largest intermediate value my solution computes for n = 10^4
- [ ] I can say which of my solutions modify `nums`, and whether that is allowed

## 3. Interview script: understand the problem (≈1 min)

**Me:** I get n distinct numbers, all in 0..n, so exactly one value of 0..n is missing, and I return it. The 0 is included in the range, and n is too, so the missing value can be 0 or n?

**Interviewer:** Yes, either end can be missing.

**Me:** Distinct is guaranteed, so I never have to handle a duplicate. Is the array sorted?

**Interviewer:** No, any order.

**Me:** How large is n?

**Interviewer:** Up to 10^4, at least 1.

**Me:** Then even a quadratic solution is about 5 · 10^7 comparisons, which would run, but you'd like O(n) time and O(1) extra space, as in the follow-up?

**Interviewer:** That's the goal.

**Me:** May I modify `nums`? Some in-place tricks need that.

**Interviewer:** Assume you may if you need to, but tell me when you do.

**Me:** Example by hand: `[3, 0, 1]`, n = 3. Ticking off 0, 1, 2, 3: 0 yes, 1 yes, 2 no. So 2. Or by totals: 0 + 1 + 2 + 3 = 6, the array sums to 4, and 6 − 4 = 2.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^4 | Never empty. O(n²) is about 5 · 10^7 steps, so it runs; the follow-up still asks for O(n). |
| 0 ≤ `nums[i]` ≤ n | Values index directly into an array of n + 1 flags. The value n has no index in `nums` (indices stop at n − 1), which every index-based approach must handle. |
| All numbers distinct | Exactly one value is missing; sum and XOR tricks rely on this. |
| Follow-up: O(1) extra space, O(n) time | Rules out sorting a copy, sets and flag arrays as final answers. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Either 0 or n can be missing | Both ends need a test case; a "gap between neighbours" approach must fall back to n. |
| The array is not sorted | Binary search on the index does not apply directly. |
| `nums` may be modified if I say so | In-place marking becomes allowed; I will point out when I use it. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| I treat `nums` as read-only unless an approach needs to change it | The caller may still use the array. Approaches that sort or rearrange will say so (or copy). |
| Values fit in an `int` and so does n(n + 1) | n ≤ 10^4 gives n(n + 1) ≤ 100,010,000, far below 2^31 − 1. I state it rather than reach for `long` by reflex. |

### Edge cases I will keep in mind

- n = 1: `[0]` → 1 and `[1]` → 0.
- 0 missing: `[1, 2]` → 0.
- n missing: `[0, 1]` → 2, and the largest case, 0..9,999 → 10,000.
- A value 0 in the array, which matters for any trick that marks values by sign.

## 4. Think out loud: from first idea to best solution

All approaches answer "which value of 0..n was not seen?", recording what was seen either explicitly (a scan, a sort, a set, flags, positions in the array) or as one number that cancels everything seen (a sum, an XOR). n = `nums.length`.

### Approach 1: Check each candidate in turn

#### What I say out loud

> "The baseline: for each candidate v from 0 to n, scan the array for v. The first one I can't find is the answer. That's up to n + 1 scans of n elements, O(n²). At n = 10^4 it's about 5 · 10^7 comparisons, which actually runs, but it doesn't meet the follow-up."

#### Intuition

"Missing" means "a search for it fails". Search for every possible value and return the first failure.

#### Algorithm

1. For v = 0, 1, …, n: scan `nums` for v.
2. If the scan does not find v, return v.

#### Why it is correct

It returns v only after a full scan failed to find v, so v is missing. Exactly one of 0..n is missing and the loop tries them all, so it reaches it.

#### Dry run

`nums = [3, 0, 1]`

| Candidate | Elements compared | Found? |
|---|---|---|
| 0 | 3, 0 | yes |
| 1 | 3, 0, 1 | yes |
| 2 | 3, 0, 1 | no: return 2 |

#### Java code

```java title="Approach 1: scan once per candidate"
class Solution {
    public int missingNumber(int[] nums) {
        int n = nums.length;
        for (int candidate = 0; candidate <= n; candidate++) {
            boolean found = false;
            for (int x : nums) {
                if (x == candidate) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return candidate;
            }
        }
        throw new IllegalArgumentException("every value 0..n is present");
    }
}
```

The final `throw` only runs if the input breaks the "one value missing" promise.

#### Time complexity

**O(n²) in the worst case.** A successful scan for v stops at v's position, so the work is the sum of the positions of every value below the answer, plus one full scan. When n is missing, every other value is searched for and their positions are a permutation of 0..n − 1: n(n + 1)/2 + n comparisons, about 5 · 10^7 at n = 10^4. I timed it on that input (JDK 26): about 33 ms. So at LeetCode's limits it runs, which is why it is a numbered approach here; its sibling with n up to 2 · 10^5, [[cses-missing-number|Missing Number (CSES)]], measures about 7 s for it. It fails the follow-up, not the time limit.

#### Space complexity

**O(1) auxiliary space**: a few variables.

#### The bridge to the next approach

> "Each scan starts from nothing. If the values were sorted, I wouldn't search at all: value i should sit at index i, and the first index where it doesn't is the answer. Sorting is n log n, a real improvement over n²."

### Approach 2: Sort, then find the first gap

#### What I say out loud

> "I sort a copy, so the caller's array is untouched. In sorted order, if nothing is missing before index i, the value at index i is i. The first index where `sorted[i] != i` is the missing value. If every index matches, the array is exactly 0..n − 1 and the answer is n."

#### Intuition

Sorted, the array is 0..n with one value cut out: before the cut, value equals index; after it, every value is one more than its index.

#### Algorithm

1. `sorted = nums.clone()`; sort it.
2. For i = 0..n − 1: if `sorted[i] != i`, return i.
3. Return n.

#### Why it is correct

When the loop reaches index i, `sorted[0..i−1]` is exactly 0..i − 1 (invariant). If `sorted[i] != i`, then, since values are distinct and sorted and 0..i − 1 are used up, `sorted[i] > i`, and i appears nowhere. If every index matches, 0..n − 1 are present and n is missing.

#### Dry run

`nums = [3, 0, 1]` → `sorted = [0, 1, 3]`

| i | sorted[i] | Match? |
|---|---|---|
| 0 | 0 | yes |
| 1 | 1 | yes |
| 2 | 3 | no: return 2 |

For `[0, 1]` every index matches and the method returns n = 2.

#### Java code

```java title="Approach 2: sort a copy, first gap"
import java.util.Arrays;

class Solution {
    public int missingNumber(int[] nums) {
        int[] sorted = nums.clone();           // leave the caller's array as it was
        Arrays.sort(sorted);
        for (int i = 0; i < sorted.length; i++) {
            if (sorted[i] != i) {              // 0..i-1 are present, so i is the gap
                return i;
            }
        }
        return sorted.length;                  // 0..n-1 all present: n is missing
    }
}
```

#### Time complexity

**O(n log n)** for the sort, plus O(n) for the copy and the scan. `Arrays.sort(int[])` is a dual-pivot quicksort; the implementation note in recent JDK documentation says it offers O(n log n) performance on all data sets, which describes the current implementation rather than promising it. The scan could be a binary search, since "value = index" holds on a prefix and fails after it, but that does not change the n log n total.

#### Space complexity

**O(n)** for the copy. Sorting `nums` itself would avoid the copy (leaving only the sort's own working memory, an implementation detail), at the price of reordering the caller's array.

#### The bridge to the next approach

> "I only use the order to answer 'is v present?'. That's a membership question, and a hash set answers it in expected constant time, without sorting."

### Approach 3: Hash set

#### What I say out loud

> "Put every element in a `HashSet`, then ask for 0, 1, …, n until one is missing. Expected O(n) time, O(n) space."

#### Intuition

Approach 1 with the scan replaced by a set lookup.

#### Algorithm

1. Add every element to a `HashSet<Integer>`.
2. For v = 0..n: if the set does not contain v, return v.

#### Why it is correct

The set holds exactly the array's values; the loop tries every value of 0..n and returns only one the set lacks, which is the missing one.

#### Dry run

`nums = [3, 0, 1]` → set {0, 1, 3}. Lookups: 0 yes, 1 yes, 2 no: return 2.

#### Java code

```java title="Approach 3: hash set"
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int missingNumber(int[] nums) {
        Set<Integer> present = new HashSet<>();
        for (int x : nums) {
            present.add(x);
        }
        for (int v = 0; v <= nums.length; v++) {
            if (!present.contains(v)) {
                return v;
            }
        }
        throw new IllegalArgumentException("every value 0..n is present");
    }
}
```

#### Time complexity

**O(n) expected,** assuming the hash codes spread well, which they do here (an `Integer` hashes to its own value, and consecutive values fall into different buckets). A hash table's worst case with heavy collisions is worse; current Java versions convert a heavily collided bucket into a balanced tree, about O(log n) per lookup for `Integer` keys, but that is implementation behaviour, not an API guarantee.

#### Space complexity

**O(n)**, with a large constant: a boxed `Integer` and a table node per value, roughly 50 bytes each on a typical 64-bit JVM.

#### The bridge to the next approach

> "The keys are 0..n: small, dense integers. A hash table is for key ranges too large to index directly; this one isn't. An array of n + 1 booleans indexed by value does the same job with no hashing, no boxing and a worst-case bound."

### Approach 4: Boolean presence array

#### What I say out loud

> "`seen = new boolean[n + 1]`, one flag per value 0..n. Set the flag of each element, then return the first value whose flag is false. Two passes, O(n) time in the worst case, n + 1 bytes."

#### Intuition

A direct-address table: the value is its own index.

#### Algorithm

1. `seen = new boolean[n + 1]`.
2. For each x in `nums`: `seen[x] = true`.
3. For v = 0..n: if `!seen[v]`, return v.

#### Why it is correct

Every value lies in 0..n, so each has its own flag, and after step 2 `seen[v]` is true exactly when v is in the array. Step 3 checks every v and returns the only unflagged one.

#### Dry run

`nums = [3, 0, 1]`: after step 2, `seen = [T, T, F, T]`. Step 3 returns 2.

#### Java code

```java title="Approach 4: boolean presence array"
class Solution {
    public int missingNumber(int[] nums) {
        int n = nums.length;
        boolean[] seen = new boolean[n + 1];   // one flag per value 0..n
        for (int x : nums) {
            seen[x] = true;
        }
        for (int v = 0; v <= n; v++) {
            if (!seen[v]) {
                return v;
            }
        }
        throw new IllegalArgumentException("every value 0..n is present");
    }
}
```

#### Time complexity

**O(n) in the worst case**: two linear passes, no hashing.

#### Space complexity

**O(n)**: n + 1 booleans. This is the one thing the follow-up still objects to.

#### The bridge to the next approach

> "The flags remember all n values, but at the end I only want the one I didn't see. Is there a single number that changes by a known amount per value? A running total. I know the total of 0..n without reading anything: n(n + 1)/2. Subtract every element; the remainder is the missing value. That's O(1) space without touching `nums`."

### Approach 5: Sum formula (recommended)

#### What I say out loud

> "0 + 1 + … + n = n(n + 1)/2. The array is that range minus one value, so its sum is n(n + 1)/2 minus the missing value. Start from the formula, subtract every element, return what's left. For n = 10^4, n(n + 1) is 100,010,000, well inside an `int`, so `int` is fine here."

#### Intuition

The sum is a fingerprint of the set that drops by exactly the removed value. The full set's fingerprint is known in closed form, so the difference names the missing value.

#### Algorithm

1. `missing = n * (n + 1) / 2`.
2. For each x in `nums`: `missing -= x`.
3. Return `missing`.

#### Why it is correct

The array is {0, …, n} without the missing value m, so it sums to n(n + 1)/2 − m. Subtracting that sum from n(n + 1)/2 leaves m. Addition is commutative, so the order of elements does not matter.

**Overflow, exactly.** The largest value computed is the product n(n + 1) = 100,010,000 at n = 10^4, against 2^31 − 1 = 2,147,483,647, so nothing overflows. The product would first overflow at n = 46,341 (46,341 · 46,342 = 2,147,534,622), which is exactly the line [[cses-missing-number|the CSES version]] crosses with n up to 2 · 10^5, where the sum must be a `long`.

**The "subtract as you go" variant** avoids the multiplication: `missing = n`, then `missing += i − nums[i]` for each index i. Its running value depends on the order: for the array in descending order it dips to −24,995,000 at n = 10^4 (computed), still inside an `int`. In general, Java `int` addition wraps modulo 2^32, and the true answer lies in 0..n, so even a running value that left the `int` range would come back to the right answer. Only the division in n(n + 1)/2 does not survive a wrapped product.

**The 20-second version:** "The values 0 to n add up to n(n + 1)/2. The array is all of them but one, so it adds up to that minus the missing one. I subtract every element from the formula and return the rest. One pass, O(1) space, and with n at most 10^4 the largest number is about 10^8, so an `int` is safe."

#### Dry run

`nums = [3, 0, 1]`: n = 3, start at 3 · 4 / 2 = 6.

| Element | missing after |
|---|---|
| (start) | 6 |
| 3 | 3 |
| 0 | 3 |
| 1 | 2 |

Return 2.

#### Java code

```java title="Approach 5: n(n + 1)/2 minus the sum (recommended)"
class Solution {
    public int missingNumber(int[] nums) {
        int n = nums.length;
        int missing = n * (n + 1) / 2;         // 0 + 1 + ... + n; at most 50,005,000 for n <= 10^4
        for (int x : nums) {
            missing -= x;
        }
        return missing;
    }
}
```

#### Time complexity

**O(n) in the worst case**: one pass. In the worst case a correct algorithm must inspect essentially every element, since any element it skips could be the value it is about to report as missing, so Ω(n) is a lower bound and this is optimal.

#### Space complexity

**O(1) auxiliary space**, and `nums` is not modified. This meets the follow-up.

#### The bridge to the next approach

> "Addition works because adding and subtracting a value cancel. XOR has the same cancelling property, x ^ x = 0, and it never grows: no overflow question at any n. Pair each index with an element: the indices 0..n − 1 plus n cover the whole range, the elements cover it minus one value, and everything but the missing value appears twice."

### Approach 6: XOR of indices and values

#### What I say out loud

> "Start with `missing = n`, because n is the one value with no index. For each i, XOR in both i and `nums[i]`. Every value that is present appears once as an index-or-n and once as an element, and cancels. The missing value appears only once and survives."

#### Intuition

XOR is bitwise addition modulo 2, without carries. A value XORed twice contributes nothing to any bit, so XOR is a "sum" in which every value is its own negative and nothing ever grows.

#### Algorithm

1. `missing = n`.
2. For i = 0..n − 1: `missing ^= i ^ nums[i]`.
3. Return `missing`.

#### Why it is correct

The result is the XOR of n, all indices 0..n − 1 (together: every value of 0..n once) and all elements (every value of 0..n except m, once). XOR is associative and commutative, so the terms can be regrouped by value: each present value appears twice and v ^ v = 0; m appears once. The XOR of zeros and m is m.

No overflow: all values are at most 10^4 < 2^14, and XOR never sets a bit that none of its operands has, so every intermediate value is below 2^14.

#### Dry run

`nums = [3, 0, 1]`: start at `missing = 3`.

| i | nums[i] | i ^ nums[i] | missing after (binary) |
|---|---|---|---|
| (start) | | | 3 (11) |
| 0 | 3 | 3 | 0 (00) |
| 1 | 0 | 1 | 1 (01) |
| 2 | 1 | 3 | 2 (10) |

Return 2.

#### Java code

```java title="Approach 6: XOR of indices and values"
class Solution {
    public int missingNumber(int[] nums) {
        int missing = nums.length;             // the value n has no index of its own
        for (int i = 0; i < nums.length; i++) {
            missing ^= i ^ nums[i];            // pairs each index with a value; equal ones cancel
        }
        return missing;
    }
}
```

#### Time complexity

**O(n) in the worst case**: one pass.

#### Space complexity

**O(1) auxiliary space**; `nums` is not modified.

#### The bridge to the next approach

> "Sum and XOR are optimal here, but both collapse the array into one number, so they only work while exactly one value is missing and nothing repeats. The presence-array idea survives those changes; it just costs n flags. If I'm allowed to modify `nums`, the array itself can hold the flags: put each value v at index v, and afterwards the index that doesn't hold its own value is the answer."

### Approach 7: In place, cyclic placement

#### What I say out loud

> "With permission to modify `nums`, I move every value v < n to index v by swapping. The value n has no index, so it stays wherever it ends up, and it will end up in the slot of the missing value. Then I scan: the first index i with `nums[i] != i` is the answer; if there's none, it's n. Each swap puts one value home for good, so there are at most n swaps."

#### Intuition

This is Approach 4's flag array, stored in `nums`: "index v holds v" means "v is present". The position of each value becomes the flag.

**Why not mark by sign instead?** Sign marking (negate slot v to say "v was seen") needs a spare sign bit in every slot, and the value 0 does not have one: −0 is 0. On `[2, 0]` the value 1 is missing, so nothing marks slot 1; but slot 1 holds the 0, which is not positive, so the scan reads it as marked and a sign-marking version returns 2 instead of 1 (run). Swapping has no such problem. (On [[cses-missing-number|the CSES version]], whose values start at 1, sign marking does work.)

#### Algorithm

1. For i = 0..n − 1: while `nums[i] != n` and `nums[i] != i`: let v = `nums[i]`; swap `nums[i]` and `nums[v]` (now `nums[v] = v`).
2. For i = 0..n − 1: if `nums[i] != i`, return i.
3. Return n.

#### Why it is correct

- **Termination and cost:** each swap writes v into `nums[v]`, where it equals its index; such a slot is never chosen as a swap target again (the loop only swaps from a slot that does not hold its own value, into the home of the value it holds, and values are distinct, so no other value has that home). So at most n swaps happen in total, and every while loop ends when slot i holds i or holds n.
- **After phase 1, every present value v < n sits at index v:** when the outer loop passes i, slot i holds i or n; any value moved later moves to its own home. A value v < n that is present ends at index v.
- **Phase 2:** if 0..n − 1 are all present, every index holds its own value and the method returns n. Otherwise the missing value m < n has no owner, so slot m holds something else (n, in fact), and every smaller index holds its own value. The first mismatch is m.

#### Dry run

`nums = [3, 0, 1]`, n = 3.

| i | Before | Action | After |
|---|---|---|---|
| 0 | [3, 0, 1] | `nums[0]` = 3 = n: stop | [3, 0, 1] |
| 1 | [3, 0, 1] | v = 0: swap slots 1 and 0 | [0, 3, 1] |
| 1 | [0, 3, 1] | `nums[1]` = 3 = n: stop | [0, 3, 1] |
| 2 | [0, 3, 1] | v = 1: swap slots 2 and 1 | [0, 1, 3] |
| 2 | [0, 1, 3] | `nums[2]` = 3 = n: stop | [0, 1, 3] |

Scan: indices 0 and 1 match, index 2 holds 3: return 2. Two swaps for n = 3.

#### Java code

```java title="Approach 7: cyclic placement (modifies nums)"
class Solution {
    public int missingNumber(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            // Send the value here to its home slot until this slot holds its own value or n.
            while (nums[i] != n && nums[i] != i) {
                int v = nums[i];
                nums[i] = nums[v];
                nums[v] = v;                   // v is now home and never moves again
            }
        }
        for (int i = 0; i < n; i++) {
            if (nums[i] != i) {                // slot i never received i
                return i;
            }
        }
        return n;
    }
}
```

#### Time complexity

**O(n) in the worst case**, even though there is a loop inside a loop: the inner loop's iterations are swaps, and there are at most n swaps over the whole run (each settles a slot for good). The scan is n more steps.

#### Space complexity

**O(1) auxiliary space**, but `nums` is rearranged. That is acceptable only when the caller allows it (the interviewer did here), or when the array is a private copy, in which case the copy costs O(n) and the sum is better anyway. For this problem, sum and XOR meet the follow-up without modifying anything, so cyclic placement is the technique to know for [[nc-first-missing-positive|First Missing Positive]], not the answer to give here.

## 5. Comparison table

n = `nums.length`. Only the hash set has an expected time different from its worst case.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Scan per candidate | O(n²) | O(n²), about 33 ms at n = 10^4 | O(1) |
| 2. Sort a copy | O(n log n) | O(n log n) per the JDK implementation note | O(n) copy |
| 3. Hash set | O(n) | O(n²) in general; about O(n log n) with current Java tree buckets for `Integer` keys (not an API guarantee) | O(n), about 50 bytes per value |
| 4. Boolean presence array | O(n) | O(n) | O(n), 1 byte per value |
| 5. Sum formula | O(n) | O(n) | O(1) |
| 6. XOR | O(n) | O(n) | O(1) |
| 7. Cyclic placement | O(n) | O(n) | O(1), but modifies `nums` |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Scan per candidate | No idea needed; O(1) space | Quadratic | Only to state the baseline |
| 2. Sort a copy | Easy to argue | n log n; copy or mutation; must handle "n missing" | When the data is sorted anyway (then binary search, see the follow-ups) |
| 3. Hash set | Works for any value range | Boxing and hashing for nothing; expected time only | Values not a small dense range |
| 4. Boolean array | Deterministic; simplest proof; extends to several missing values | O(n) space fails the follow-up | When you need all missing values, or the input may break the promise |
| 5. Sum formula | One line of logic; O(1); input untouched | Needs the overflow check (fine here) | The answer to give |
| 6. XOR | O(1); input untouched; no overflow at any n | Proof is less familiar | In a bit-manipulation round, or when asked to avoid overflow |
| 7. Cyclic placement | The in-place technique that survives harder variants | Modifies `nums`; the amortized argument takes care | When sum and XOR do not apply (First Missing Positive) |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 5, the sum formula. It meets the follow-up exactly (O(n) time, O(1) space), leaves `nums` alone, and its proof is one sentence. Say the overflow check out loud: n(n + 1) ≤ 100,010,000, so `int` is safe at these limits.

**Mention right after:** Approach 6, XOR, as the version with no overflow question at all. In a round about bit manipulation (this problem sits in NeetCode's bit-manipulation list), lead with XOR instead; both are optimal and interviewers accept either.

**How to present the ladder:** the scan per candidate (n²), sort (n log n) and flags (n time, n space) in a sentence each, then the sum. Mention cyclic placement only if asked about modifying the array or about First Missing Positive.

**When to stop:** at the sum or XOR. In the worst case every element must be inspected, so O(n) time cannot be beaten, and O(1) space is already reached.

## 7. Interview script: code it and test it

### What I say while coding

> "n is `nums.length`; the range is 0..n, one larger than the array."

> "The formula `n * (n + 1) / 2`: with n ≤ 10^4 the product is at most 100,010,000, so `int` is fine. If n could reach 46,341 or more, I'd write `(long) n * (n + 1) / 2`."

> "I don't modify `nums`."

### Testing out loud

**`[3, 0, 1]`:** 6 − 4 = 2. Correct.

**`[0, 1]`:** n = 2, 3 − 1 = 2. The missing value is n, and the sum needs no special case.

**`[0]` and `[1]`:** n = 1, total 1: 1 − 0 = 1 and 1 − 1 = 0. Both n = 1 cases.

**`[1, 2]`:** total 3, sum 3: returns 0. Missing 0 works.

**`[2, 0]`:** total 3, sum 2: returns 1. (This is the input that breaks sign marking.)

**n = 10^4, values 0..9,999 in reverse order:** 50,005,000 − 49,995,000 = 10,000. Correct, and nothing near the `int` limit.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1 min | Range 0..n, distinct, both ends can be missing, may I modify `nums` |
| Ladder | 3 min | Scan (n²), sort (n log n), set or flags (n, n space) |
| Optimal | 2 min | Sum formula with the overflow check; XOR as the twin |
| Code | 2 min | Four lines |
| Test | 2 min | Example, `[0, 1]`, `[1]`, `[0]`, n = 10^4 |

If stuck, do the example twice by hand: once ticking values off, once adding them up.

## 9. Interviewer challenges

### About correctness

#### Prove the XOR version.

**What they are testing:** whether you can justify a bit trick rather than recall it.

**How to reason:** list the properties used, then count each value's occurrences.

**What I say:** "XOR is associative and commutative, v ^ v = 0 and v ^ 0 = v. My expression contains n and every index 0..n − 1, which is every value of 0..n once, plus every element, which is every value except the missing one, once. Regroup by value: present values appear twice and cancel; the missing one appears once and is the result."

**Nuance:** you can see the cancellation in the dry run: after index 0 the running XOR is 0, because 3 (the start value n) met the element 3.

#### What if two values were missing, or one repeated?

**What they are testing:** whether you know which approaches depend on the "exactly one" promise.

**How to reason:** sum and XOR compress the array into one number; flags do not.

**What I say:** "Sum and XOR would return a wrong value silently. The flag array still works and would even detect the repeat when it finds a flag already set. For two missing values I'd use the sum and the sum of squares, or XOR and then split by a set bit; both stay O(n) time and O(1) space."

**Nuance:** this is exactly why the in-place presence technique matters: in [[nc-first-missing-positive|First Missing Positive]] the full set is unknown, sum and XOR have nothing to compare against, and only presence marking works.

### About implementation

#### Can `n * (n + 1) / 2` overflow?

**What they are testing:** whether you compute bounds from the constraints.

**How to reason:** find the largest intermediate value, not just the answer.

**What I say:** "The largest intermediate is the product n(n + 1), at most 100,010,000 for n = 10^4, against 2,147,483,647. No overflow. It would overflow from n = 46,341, where I'd need a `long`, or the XOR version, or the 'subtract as you go' form `missing += i − nums[i]`."

**Nuance:** the subtract-as-you-go form is safe not because its running value always stays small, but because `int` addition wraps modulo 2^32 and the final answer fits in an `int`. A product that wraps and is then divided by 2 does not recover.

#### Why does your sign-marking idea fail here?

**What they are testing:** whether you check a borrowed trick against this problem's value range.

**How to reason:** marking by sign needs every stored value to have a usable sign bit.

**What I say:** "The value 0 can't be made negative. On `[2, 0]` the value 1 is missing, but slot 1 holds the 0, so it never looks positive, and a sign-marking version returns 2. Swapping values to their own index has no such problem, or I could mark with an offset instead of a sign, adding n + 1 to slot v and testing `>= n + 1`."

**Nuance:** in the 1..n version every value is positive, and sign marking works there.

## 10. Follow-up questions the interviewer might ask

**"The array is sorted."**
Then "value equals index" holds on a prefix and fails after the missing value, so binary search for the first index with `nums[i] != i`: O(log n) time, O(1) space. If no index fails, the answer is n.

**"The values are 1..n and arrive on standard input."**
That is [[cses-missing-number|Missing Number (CSES)]]: the same sum or XOR, but with n up to 2 · 10^5, so the sum needs a `long`, and the input never has to be stored.

**"Two values are missing."**
Sum and sum of squares give m₁ + m₂ and m₁² + m₂², which determine both. Or XOR everything to get m₁ ^ m₂, choose a bit where they differ, and XOR the values and indices on each side of that bit separately. O(n) time, O(1) space.

**"Find the smallest missing positive in an arbitrary array."**
[[nc-first-missing-positive|First Missing Positive]]: no closed-form total exists, so presence marking in place (cyclic placement, Approach 7 here) is the O(n) time, O(1) space answer.

**"Values 1..n with one repeated, array read-only, O(1) space."**
[[nc-find-the-duplicate-number|Find the Duplicate Number]]: when the repeated value can occur many times the sum no longer identifies it, and cycle detection does.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Forgetting that n can be missing.** Approaches that look for a gap (sort, cyclic placement) find none on `[0, 1]` and need the final `return n`.
- **Forgetting that 0 can be missing.** Test `[1]` and `[1, 2]`.
- **Using sign marking with 0 in the range.** `[2, 0]` returns 2 instead of 1 (run).
- **Calling the hash set O(n) without saying "expected".** The boolean array is the deterministic version.

### Implementation mistakes

> [!MISTAKE] Treating n as the largest array index
> The range is 0..n where n = `nums.length`: one more value than the array has slots. Sizing the flag array as `new boolean[n]` makes `seen[x] = true` throw for x = n, and starting the XOR at 0 instead of n leaves n out of the range, so `[0, 1]` would return 0 instead of 2.

- **Mutating the input without saying so.** `Arrays.sort(nums)` and cyclic placement reorder the caller's array; copy it or get permission.
- **A swap loop that never ends.** In cyclic placement, the loop must stop when the slot holds n (it has no home); without the `nums[i] != n` test, `nums[v]` with v = n is out of bounds.

## 12. Pattern recognition

**The pattern:** a known universe minus an unknown part. When the full set of values is fixed in advance (0..n), compare an aggregate of the full set (sum or XOR) with the same aggregate of the input; the difference names what is missing. When no full set is known, or more than one value is missing, use presence instead: flags, or flags stored in the array by position.

**Signals in the problem statement:**

- "Contains n distinct numbers in the range [0, n]": the range is known, so a closed-form total exists.
- "Return the only number missing": one aggregate suffices.
- "O(1) extra space": aggregates, or in-place marking if the input may change.

**Related problems in this list:**

- [[cses-missing-number|Missing Number (CSES)]]: the 1..n version with n up to 2 · 10^5, where the overflow is real.
- [[nc-first-missing-positive|First Missing Positive]]: the hard relative; only in-place presence marking works there.
- [[nc-single-number|Single Number]]: XOR cancellation, every value twice but one.
- [[nc-find-the-duplicate-number|Find the Duplicate Number]]: values 1..n with a repeat, read-only, O(1) space.
- [[nc-contains-duplicate|Contains Duplicate]]: presence tracking with a set, the general form of Approach 3.

**Takeaway:** if you know what a complete input should contain, a single number that cancels everything you saw is enough to find what you did not see.

## 13. 60-second revision card

**Key insight:** 0 + 1 + … + n = n(n + 1)/2; subtract every element and the missing value remains. XOR of n, every index and every element does the same with no overflow.

**Invariant:** after k elements, `missing` = n(n + 1)/2 minus the sum of those k elements.

**Complexity:** O(n) time, O(1) space, `nums` unchanged.

**Code skeleton:**

```java title="Missing Number, sum formula" fragment="public int missingNumber(int[] nums)"
int n = nums.length;
int missing = n * (n + 1) / 2;   // at most 50,005,000 for n <= 10^4
for (int x : nums) missing -= x;
return missing;
```

**Main traps:**

- The range has n + 1 values: start the XOR at n, size flags as n + 1.
- Either end, 0 or n, can be missing.
- n(n + 1) overflows `int` from n = 46,341; here n ≤ 10^4.

**What to say in one breath:** "The values 0 to n sum to n(n + 1)/2 and the array is all of them but one, so the difference is the answer: one pass, O(1) space, no mutation, and n(n + 1) stays near 10^8, so `int` is safe. XOR of n, the indices and the values gives the same answer without any overflow question."
