---
problemId: nc-minimum-size-subarray-sum
title: Minimum Size Subarray Sum
source: neetcode
sourceUrl: https://leetcode.com/problems/minimum-size-subarray-sum/
difficulty: medium
patterns: [sliding-window, two-pointers, prefix-sum, binary-search]
relatedLessons: [a2-sliding-window, a2-two-pointers, a2-prefix-suffix, a3-binary-search, a3-lower-upper-bounds, a14-deriving-optimization]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

You get an array `nums` of positive integers and a positive integer `target`. Find the shortest contiguous, non-empty stretch of the array (a subarray) whose elements add up to **at least** `target`, and return its length. If no subarray reaches `target`, return 0.

**Example 1**

- Input: `target = 7`, `nums = [2, 3, 1, 2, 4, 3]`
- Output: `2`
- Why: `[4, 3]` (positions 4 to 5) sums to 7. No single element reaches 7, so no answer of length 1 exists.

**Example 2**

- Input: `target = 11`, `nums = [1, 1, 1, 1, 1, 1, 1, 1]`
- Output: `0`
- Why: the whole array sums to 8, so no subarray reaches 11.

A third case worth keeping in mind: `target = 4`, `nums = [1, 4, 4]` returns 1, because the single element 4 already reaches the target.

**What the problem statement guarantees**

- 1 ≤ `target` ≤ 10^9.
- 1 ≤ `nums.length` ≤ 10^5.
- 1 ≤ `nums[i]` ≤ 10^4: every value is strictly positive.
- The statement asks, as a follow-up, for an O(n log n) solution once you have an O(n) one.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The word "positive" in the statement is doing a lot of work; find out what.

**How to practise**

1. Set a timer for 20 minutes and talk out loud.
2. Write the simplest correct solution and work out how many steps it takes for n = 10^5.
3. Fix a start position and ask how the sum behaves as the end moves right. Then fix the end and move the start.
4. Code your best idea, then trace it on Example 1 and on `target = 7`, `nums = [1, 1, 1, 1, 7]` (the answer is 1).
5. Check that you return 0, not some huge sentinel, when nothing reaches the target.

> [!HINT] Hint 1: a small nudge
> Because every value is at least 1, adding an element to a subarray always makes its sum bigger, and removing one always makes it smaller. If the subarray from i to j already reaches the target, what do you know about every subarray that starts at i and ends later than j?

> [!HINT] Hint 2: the kind of tool you need
> Keep two indices, a left and a right edge, and the sum of the elements between them. The best left edge for each right edge never moves backwards as the right edge advances, so neither index ever needs to go back.

> [!HINT] Hint 3: almost the whole plan
> Move the right edge forward one element at a time, adding it to the running sum. While the running sum is at least the target, record the current length as a candidate and remove the leftmost element, moving the left edge forward. Use a repeated check, not a single one: one new element can make several left elements unnecessary. At the end, return 0 if no candidate was ever recorded.

**Check yourself before revealing the walkthrough**

- [ ] My code returns 2 for Example 1, 0 for Example 2, and 1 for `[1, 4, 4]` with target 4
- [ ] It returns 1 for `[1, 1, 1, 1, 7]` with target 7
- [ ] It returns 100,000 for 10^5 copies of 10^4 with target 10^9, and I know the sum cannot overflow
- [ ] I can say which line of the statement my solution depends on, and give an input without it where my solution is wrong

## 3. Interview script: understand the problem (≈2 min)

**Me:** I return the length of the shortest contiguous subarray whose sum is at least the target, not exactly the target. And 0 if there is none?

**Interviewer:** Yes. At least the target, and 0 if nothing qualifies.

**Me:** Are all the values positive? That decides a lot.

**Interviewer:** Every value is between 1 and 10^4, and the target is between 1 and 10^9.

**Me:** Strictly positive, so a longer subarray always has a larger sum. And n?

**Interviewer:** Up to 10^5.

**Me:** Then checking every subarray is about n² / 2 = 5 × 10^9 pairs in the worst case, which is too slow; I want O(n) or O(n log n). On overflow: the largest possible sum is 10^5 × 10^4 = 10^9, which is below 2^31 − 1 ≈ 2.147 × 10^9, so an `int` running sum is safe. I'll recheck any expression that adds or subtracts the target.

**Me:** By hand on Example 1, `[2, 3, 1, 2, 4, 3]` with target 7: no single element reaches 7. For length 2 the pairs sum to 5, 4, 3, 6, 7: the last one, `[4, 3]`, reaches 7. So the answer is 2.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ `nums[i]` ≤ 10^4 | Every value is positive, so sums grow strictly as a subarray grows. This is what makes a sliding window correct, and makes prefix sums strictly increasing, so they can be binary searched. |
| 1 ≤ n ≤ 10^5 | O(n²) is up to about 5 × 10^9 steps: too slow. O(n) or O(n log n) is the target. |
| 1 ≤ `target` ≤ 10^9 | The target can exceed every possible sum (10^9 is reached only when all 10^5 values are 10^4), so "no answer" is a real case. Since `target` ≥ 1, the empty subarray never qualifies. |
| Sum ≤ 10^5 × 10^4 = 10^9 | Any running or prefix sum fits in an `int`. `sum - target` lies in [−10^9, 10^9 − 1], also an `int`. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| "At least" the target, not "exactly" | Overshooting is fine. I minimize length among subarrays whose sum is ≥ target. |
| Return 0 when none exists | I need a sentinel for "nothing found yet" that I convert to 0 at the end. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| `nums` may not be modified | Nothing says I may; both solutions below only read it (the binary-search one builds its own prefix array). |

### Edge cases I will keep in mind

- No subarray reaches the target (Example 2): return 0, not the sentinel.
- A single element reaches the target: answer 1.
- The whole array is needed: answer n.
- n = 1, reaching or not reaching the target.
- A large element arriving after many small ones, where several left elements must be dropped at once: `[1, 1, 1, 1, 7]` with target 7.
- The largest sums: 10^5 copies of 10^4 with target 10^9.

## 4. Think out loud: from first idea to best solution

Throughout: **n** is the length of `nums`, and **P(j)** is the sum of the first j elements, with P(0) = 0. The sum of `nums[i..j-1]` is P(j) − P(i).

**The baseline, said but not coded.** For every start i, extend the end to the right with a running sum and stop at the first end where the sum reaches the target; that end gives the shortest subarray starting at i. It is correct and the early stop is valid because values are positive, but when the answer is long or does not exist it still does about n² / 2 steps: 5 × 10^9 for n = 10^5. I say it in two sentences and look for what it wastes.

### Approach 1: Prefix sums and binary search

#### What I say out loud

> "In the brute force, for a fixed end I'm searching for the latest start that still reaches the target. Prefix sums turn that into a lookup: the subarray `nums[i..j-1]` has sum P(j) − P(i), so I want the largest i with P(i) ≤ P(j) − target. And since every value is positive, the prefix sums are strictly increasing, so that's a binary search. n binary searches over n + 1 prefix sums: O(n log n). That's also the follow-up the problem asks for."

#### Intuition

The brute force scans ends one by one because it doesn't know where the sum crosses the target. Prefix sums make every subarray sum available in O(1), and positivity makes P a sorted array, so "where does it cross" becomes "where does a value fall in a sorted array".

#### Algorithm

1. Build `prefix[0..n]` with `prefix[0] = 0` and `prefix[j] = prefix[j - 1] + nums[j - 1]`.
2. `best = n + 1` (longer than any real subarray, meaning "none yet").
3. For each end boundary j from 1 to n:
   1. `need = prefix[j] - target`. If `need < 0`, even the whole prefix is too small: skip.
   2. Binary search for the first index `lo` in [0, j] with `prefix[lo] > need`. Then i = `lo - 1` is the largest index with `prefix[i] ≤ need`.
   3. `best = min(best, j - i)`.
4. Return `best == n + 1 ? 0 : best`.

#### Why it is correct

- **The search is valid.** P is strictly increasing because every `nums[i]` ≥ 1. Within [0, j], `prefix[j] > need` because `target` ≥ 1, so the first index with `prefix > need` exists and is at most j. When `need ≥ 0`, `prefix[0] = 0 ≤ need`, so that first index is at least 1 and i = `lo - 1` ≥ 0.
- **Every candidate is valid.** P(i) ≤ P(j) − target means P(j) − P(i) ≥ target, so `nums[i..j-1]` reaches the target, and i < j, so it is non-empty.
- **Nothing shorter is missed.** For a fixed j, starting later means a shorter subarray. Any start i' > i has P(i') > need, so `nums[i'..j-1]` falls short. So j − i is the shortest qualifying length for this end, and taking the minimum over all ends covers every subarray.
- **None found:** if no j has `need ≥ 0` (the total is below the target), `best` stays n + 1 and becomes 0.

#### Dry run

Example 1: `target = 7`, `nums = [2, 3, 1, 2, 4, 3]`, so `prefix = [0, 2, 5, 6, 8, 12, 15]`.

| j | prefix[j] | need = prefix[j] − 7 | largest i with prefix[i] ≤ need | length j − i | best |
|---|---|---|---|---|---|
| 1 | 2 | −5 | skip | – | 7 (none) |
| 2 | 5 | −2 | skip | – | 7 |
| 3 | 6 | −1 | skip | – | 7 |
| 4 | 8 | 1 | 0 (prefix 0) | 4 | 4 |
| 5 | 12 | 5 | 2 (prefix 5) | 3 | 3 |
| 6 | 15 | 8 | 4 (prefix 8) | 2 | 2 |

Returns 2: the subarray from index 4 to 5, `[4, 3]`.

#### Java code

```java title="Approach 1: prefix sums + binary search"
class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int n = nums.length;
        int[] prefix = new int[n + 1];                 // prefix[j] = sum of the first j elements, at most 10^9
        for (int j = 1; j <= n; j++) {
            prefix[j] = prefix[j - 1] + nums[j - 1];
        }
        int best = n + 1;                              // "none found yet"
        for (int j = 1; j <= n; j++) {
            int need = prefix[j] - target;             // in [-10^9, 10^9 - 1]: no overflow
            if (need < 0) {
                continue;                              // even nums[0..j-1] is too small
            }
            int lo = 0, hi = j;                        // first index in [0, j] with prefix > need
            while (lo < hi) {
                int mid = (lo + hi) >>> 1;
                if (prefix[mid] > need) {
                    hi = mid;
                } else {
                    lo = mid + 1;
                }
            }
            int i = lo - 1;                            // largest i with prefix[i] <= need
            best = Math.min(best, j - i);
        }
        return best == n + 1 ? 0 : best;
    }
}
```

#### Time complexity

**O(n log n) in every case**: building the prefix array is O(n), and each of the n ends does a binary search over at most n + 1 entries, O(log n).

#### Space complexity

**O(n) auxiliary space** for the prefix array.

#### The bridge to the next approach

> "Look at the dry run: the start I found went 0, 2, 4. It never moved backwards. That isn't luck. If the latest valid start for end j is i, then for a later end the sum from i is even bigger, so the latest valid start can only be the same or later. A pointer that only moves forward doesn't need a binary search, and it doesn't need the prefix array either: I can keep the sum of the window between the two pointers."

### Approach 2: Variable-size sliding window (recommended)

#### What I say out loud

> "Two pointers, left and right, and the sum of the window between them. I move right forward one element at a time and add it. While the sum is at least the target, the window qualifies: I record its length, then remove the left element and move left forward, to see if a shorter window still qualifies. Each pointer moves at most n times, so it's O(n) with O(1) extra space."

#### Intuition

With positive values, the sum of `nums[l..r]` grows when r grows and shrinks when l grows. For each right edge r, the starts that still reach the target are exactly 0 through some L(r), and the shortest qualifying window ending at r starts at L(r). As r moves right, L(r) can only stay or move right. So one left pointer, chasing L(r), visits every start once in total. This is the "shortest valid window" form of the [[a2-sliding-window|sliding window]].

#### Algorithm

1. `left = 0`, `sum = 0`, `best = Integer.MAX_VALUE` ("none found yet").
2. For each `right` from 0 to n − 1:
   1. `sum += nums[right]`.
   2. While `sum >= target`: `best = min(best, right - left + 1)`; `sum -= nums[left]`; `left++`.
3. Return `best == Integer.MAX_VALUE ? 0 : best`.

#### Why it is correct

**Why positivity makes the window monotone.** Write W(l, r) for the sum of `nums[l..r]`. Because every value is at least 1:

- For a fixed l, W(l, r) strictly increases with r.
- For a fixed r, W(l, r) strictly decreases as l increases.

So for each right edge r, the set of starts l with W(l, r) ≥ target is a prefix of the possible starts: {0, 1, …, L(r)} (or empty). The shortest qualifying window ending at r is [L(r), r]. And L is non-decreasing: W(L(r), r + 1) > W(L(r), r) ≥ target, so L(r + 1) ≥ L(r). A start that was dropped at some right edge is never needed again, because every later right edge has its last valid start at or after it.

**The invariant: after the inner loop at right edge r, `sum` = W(left, r) < target, and every start before `left` is at most L(r), the last valid start for r.**

- When right edge r arrives, every start before `left` was dropped earlier because it was valid then, so (by the bullets above) it is still valid for r: `left` ≤ L(r) + 1. If any window ending at r qualifies, then the window [left, r] qualifies too (its start is at most L(r)), so the while loop runs.
- The loop records [left, r], [left + 1, r], … and stops exactly when the sum drops below the target, which happens when `left` = L(r) + 1. The last recorded length is r − L(r) + 1, the shortest for this r.
- If no window ending at r qualifies, the sum is already below the target and nothing changes.

So the loop records the shortest qualifying window for every right edge that has one, and every recorded window really reaches the target (the loop condition checks it). The minimum of these is the answer; if nothing was recorded, no subarray qualifies and we return 0.

**Where this breaks without positivity.** With a negative value, removing the left element can *raise* the sum, and the set of valid starts is no longer a prefix. Take `nums = [3, -2, 4]`, `target = 4` (this input is outside this problem's constraints; it shows why they matter). The window reaches sum 5 at r = 2, records length 3, removes 3 (sum 2), and stops because 2 < 4. It returns 3. But `[4]` alone reaches 4: the correct answer is 1. The window stopped shrinking at a start where the sum was too small, while a later start (after dropping the −2) was valid again. For sums that can go down, use prefix sums: for "exactly k" with negatives, see [[nc-subarray-sum-equals-k|Subarray Sum Equals K]]; for "at least k" with negatives, a [[a5-monotonic-queue|monotonic deque]] over prefix sums.

**The 25-second version to say to the interviewer:**

> "All values are positive, so for a fixed right edge, moving the left edge forward only lowers the sum, and the valid starts form a prefix. The shortest window ending here starts at the last valid start, and that start only moves forward as the right edge does. So I grow on the right, and while the sum still reaches the target I record the length and shrink from the left. Each index enters and leaves once: O(n) time, O(1) space."

#### Dry run

Example 1: `target = 7`, `nums = [2, 3, 1, 2, 4, 3]`.

| right | add | sum after adding | windows recorded (while sum ≥ 7) | sum after shrinking | left after | best |
|---|---|---|---|---|---|---|
| 0 | 2 | 2 | – | 2 | 0 | none |
| 1 | 3 | 5 | – | 5 | 0 | none |
| 2 | 1 | 6 | – | 6 | 0 | none |
| 3 | 2 | 8 | [0..3] length 4 | 6 | 1 | 4 |
| 4 | 4 | 10 | [1..4] length 4, [2..4] length 3 | 6 | 3 | 3 |
| 5 | 3 | 9 | [3..5] length 3, [4..5] length 2 | 3 | 5 | 2 |

Returns 2. At right = 4 and right = 5 the loop shrinks twice in a row, which is why it must be a `while`.

#### Java code

```java title="Approach 2: sliding window (recommended)"
class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int left = 0;
        int sum = 0;                                   // sum of nums[left..right], at most 10^9
        int best = Integer.MAX_VALUE;                  // "none found yet"
        for (int right = 0; right < nums.length; right++) {
            sum += nums[right];
            while (sum >= target) {                    // window qualifies: record, then try a shorter one
                best = Math.min(best, right - left + 1);
                sum -= nums[left];
                left++;
            }
        }
        return best == Integer.MAX_VALUE ? 0 : best;
    }
}
```

#### Time complexity

**O(n) in every case.** `right` moves n times. `left` only increases and never passes `right + 1` (when `left = right + 1` the window is empty, its sum is 0 < target, and the loop stops), so the inner loop runs at most n times in total across the whole scan: amortized O(1) per element.

#### Space complexity

**O(1) auxiliary space**: three integers.

## 5. Comparison table

n = length of `nums`. No approach here uses hashing or randomness, so expected and worst-case times are the same.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Every start, extend until the target (not coded) | O(n²) | O(n²) | O(1) |
| 1. Prefix sums + binary search | O(n log n) | O(n log n) | O(n) |
| 2. Sliding window | O(n) | O(n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Brute force | Obvious, easy to argue | 5 × 10^9 steps at the limits | Say it, don't code it |
| 1. Prefix sums + binary search | Answers the stated O(n log n) follow-up; the prefix array can be reused for many targets | Extra memory, an off-by-one-prone search, slower | When asked for the follow-up, or when there are many queries on the same array |
| 2. Sliding window | Linear, constant memory, short code | Relies entirely on positive values | The answer to give |

## 6. Which solution to give, and when to stop optimizing

Give the sliding window. Mention the brute force in a sentence, then justify the window by the positivity argument (the valid starts form a prefix, and the last one only moves forward), because the interviewer is listening for that, not for the code. O(n) time is optimal up to constants: in the worst case a correct algorithm must look at essentially every element, since an unread element could be large enough to form a length-1 answer, so there is an Ω(n) worst-case lower bound. O(1) space cannot be improved.

When the interviewer asks for the follow-up ("also an O(n log n) one"), present prefix sums with binary search; it is slower here, but it is the version that generalizes to answering many targets against one prefix array. Stop once the `while`, the 0 return and the overflow bound are covered.

## 7. Interview script: code it and test it

### What I say while coding

> "`best` starts at `Integer.MAX_VALUE` as 'nothing found', and I convert it to 0 at the end."

> "Add on the right first. Then a `while`, not an `if`: one big element can make several left elements unnecessary."

> "Inside the loop I record the length before I shrink, because the current window is the one that qualifies."

> "The sum is at most 10^5 × 10^4 = 10^9, so `int` is fine."

### Testing out loud

**Normal case:** Example 1 as in the dry run: 4, then 3, then 2. Returns 2.

**No answer:** eight 1s with target 11. The sum climbs to 8, the loop never runs, `best` stays at the sentinel, and I return 0.

**Single element reaches the target:** `[1, 4, 4]` with target 4. At right = 1, sum 5: record [0..1] length 2, remove 1 → 4, still ≥ 4: record [1..1] length 1, remove 4 → 0. At right = 2: sum 4, record length 1. Returns 1.

**Several shrinks at once:** `[1, 1, 1, 1, 7]` with target 7. The sum reaches 4 by right = 3. At right = 4 it is 11: record lengths 5, 4, 3, 2, 1 while removing the four 1s and then the 7. Returns 1.

**Whole array needed:** `[1, 2, 3]` with target 6. Sum reaches 6 only at right = 2: record 3, remove 1 → 5. Returns 3.

**n = 1:** `[5]` with target 5 returns 1; with target 6 returns 0.

**Largest sums:** 10^5 copies of 10^4 with target 10^9: the sum reaches exactly 10^9 at the last element, the only qualifying window is the whole array, and the result is 100,000. No intermediate value exceeds 10^9.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1–2 min | "At least", 0 when none, all values positive, overflow bound |
| Brute force | 1 min | Every start, stop at the first end that reaches the target; O(n²) |
| Derive the window | 3–4 min | Positivity → valid starts form a prefix → the left edge only moves forward |
| Code | 3 min | Grow right, `while` shrink, sentinel |
| Test | 3 min | Example 1, no answer, `[1, 1, 1, 1, 7]` |
| Follow-up | rest | Prefix sums + binary search; negatives |

If the window doesn't come to you, write out the prefix sums of an example: they are increasing, which leads to Approach 1, and from there the observation that the found starts only move forward.

## 9. Interviewer challenges

### About correctness

#### Why is it safe to move the left edge forward and never back?

**What they are testing:** whether you can state the monotonicity condition rather than recite the template.

**How to reason:** for a fixed right edge, which starts give a valid window, and how does that set change when the right edge moves?

**What I say:** "Every value is positive, so for a fixed right edge, starting later gives a smaller sum: the valid starts are 0 up to some last start L. The shortest window ending there starts at L. When the right edge moves forward, the sum from L only gets bigger, so the new last valid start is L or later. The left edge chases L, so it never needs to go back."

**Nuance:** this is exactly what fails with negative values. `[3, -2, 4]` with target 4 returns 3 from the window instead of 1, because after removing 3 the sum dropped to 2, but removing the −2 as well would have raised it to 4.

#### Why a `while` and not an `if`?

**What they are testing:** whether you understand that the left edge can jump several places for one new element.

**How to reason:** after adding one large element, how many short windows ending here might qualify?

**What I say:** "One big element can make many earlier ones unnecessary. With `[1, 1, 1, 1, 7]` and target 7, adding the 7 makes windows of length 5 down to 1 all qualify. An `if` records only the length-5 one and moves left once, and the code returns 5 instead of 1."

**Nuance:** the `while` doesn't hurt the complexity: across the whole run it executes at most n times in total, because each execution moves `left` forward and `left` never exceeds n.

### About complexity

#### There's a loop inside a loop. Why is it O(n)?

**What they are testing:** amortized analysis.

**How to reason:** count how many times each pointer moves overall, not per outer iteration.

**What I say:** "The right edge moves n times. Each inner iteration moves the left edge forward by one, and the left edge never goes past the right edge plus one, so the inner loop runs at most n times over the entire scan. 2n pointer moves in total."

**Nuance:** a single right edge can trigger up to n inner iterations, as with a huge last element, so the per-iteration cost is O(n) in the worst case; it's the total that is linear.

#### Could the sum overflow?

**What they are testing:** bounding values from the constraints.

**How to reason:** the window sum is at most the total sum.

**What I say:** "At most 10^5 elements of at most 10^4 each: 10^9, below 2^31 − 1 ≈ 2.147 × 10^9. In the binary-search version I compute `prefix[j] - target`, which is between −10^9 and 10^9 − 1, so no overflow there either. If I'd written `prefix[i] + target` instead, it could reach 2 × 10^9, which still fits, but only just."

**Nuance:** with values up to 10^9 instead, the sums would need `long`.

## 10. Follow-up questions the interviewer might ask

**"Give an O(n log n) solution."**
Prefix sums plus binary search (Approach 1): positivity makes the prefix sums strictly increasing, and for each end the latest valid start is a binary search. O(n log n) time, O(n) space. An equivalent form binary searches the answer length: "does some window of length L reach the target?" is monotone in L and checkable in O(n) with a fixed window, giving O(n log n) as well.

**"What if values can be negative?"**
The window is wrong (see `[3, -2, 4]`, target 4). Use prefix sums and a monotonic deque of candidate starts with increasing prefix sums: for each end, pop starts from the front while they qualify (recording lengths), and pop from the back any start whose prefix sum is ≥ the new one. O(n) time, O(n) space. See [[a5-monotonic-queue|Monotonic Queue]].

**"Return the longest subarray with sum at most the target instead."**
The mirror-image window: grow on the right, and while the sum exceeds the target, shrink from the left; record the length after shrinking. Still O(n), still requires non-negative values.

**"Many queries with different targets on the same array."**
Build the prefix array once, then answer each target with Approach 1 in O(n log n), or with the window in O(n) per query.

**"Count the subarrays with sum at least the target."**
With the same window, for each right edge the valid starts are 0 through L(r), so add L(r) + 1 (the left pointer after shrinking) to the count. O(n).

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Using the window without checking the value range.** It is correct here only because every value is at least 1. With negatives it can return a length that is too long: `[3, -2, 4]`, target 4, gives 3 instead of 1.
- **Reading "at least" as "exactly".** Overshooting is allowed; `[1, 4, 4]` with target 4 qualifies at sum 5 and 4 alike.
- **Thinking the nested loop is O(n²).** Count total pointer moves.

### Implementation mistakes

> [!MISTAKE] `if` instead of `while` when shrinking
> The left edge moves at most once per new element. `[1, 1, 1, 1, 7]` with target 7 returns 5 instead of 1.

> [!MISTAKE] Returning the sentinel when nothing qualifies
> Without the final `best == Integer.MAX_VALUE ? 0 : best`, Example 2 returns 2147483647 instead of 0.

- **Shrinking before recording.** Removing the left element and then measuring records a window that may no longer reach the target.
- **Off-by-one in the binary search.** The result is the *largest* i with P(i) ≤ P(j) − target, which is one before the first index with P > P(j) − target. Searching for the first index with P ≥ P(j) − target and subtracting 1 loses the start whose prefix sum equals P(j) − target exactly: Example 1 returns 3 instead of 2, because `[4, 3]` (P(4) = 8 = 15 − 7) is missed.

## 12. Pattern recognition

**The pattern:** a variable-size sliding window for "shortest subarray satisfying a condition", valid when the condition is monotone: if a window satisfies it, every larger window containing it does too. Here that comes from all values being positive.

**Signals in the problem statement:**

- "Contiguous subarray" and "minimal length" (or "maximal length").
- A sum threshold ("at least", "at most"), not an exact value.
- All values positive (or non-negative): the condition grows with the window.

**Related problems in this list:**

- [[nc-subarray-sum-equals-k|Subarray Sum Equals K]]: exact sum with negatives, where the window fails and prefix sums with a hash map take over.
- [[nc-longest-substring-without-repeating-characters|Longest Substring Without Repeating Characters]]: the "longest valid window" form.
- [[nc-minimum-window-substring|Minimum Window Substring]]: the same "shortest valid window" loop with a richer validity check.
- [[nc-longest-repeating-character-replacement|Longest Repeating Character Replacement]]: a window whose validity depends on counts.
- [[cses-subarray-sums-i|Subarray Sums I]] (CSES): positive values, exact sum, the same two pointers.

**Takeaway:** if a problem asks for the shortest or longest contiguous range under a sum threshold and every value is positive, grow on the right and shrink on the left; check the positivity first, because that is the whole proof.

## 13. 60-second revision card

**Key insight:** positive values make the window sum monotone, so the valid starts for each right edge form a prefix and the last valid start only moves forward.

**Invariant:** after shrinking at right edge r, `sum` = sum of `nums[left..r]` < target, and every qualifying window ending at r has been recorded.

**Complexity:** O(n) time (each pointer moves at most n times), O(1) space. Sums ≤ 10^9 fit in `int`. Follow-up: prefix sums + binary search, O(n log n) time, O(n) space.

**Code skeleton:**

```java title="Shortest window with sum at least target" fragment="public int minSubArrayLen(int target, int[] nums)"
int left = 0, sum = 0, best = Integer.MAX_VALUE;
for (int right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {                 // record, then shrink
        best = Math.min(best, right - left + 1);
        sum -= nums[left++];
    }
}
return best == Integer.MAX_VALUE ? 0 : best;
```

**Main traps:**

- `if` instead of `while`: `[1, 1, 1, 1, 7]`, target 7, gives 5.
- Forgetting to map the sentinel to 0.
- Using the window when values can be negative.

**What to say in one breath:** "Brute force is O(n²). Because all values are positive, for each right edge the valid starts form a prefix and the last valid start only moves right, so I grow the window on the right and, while it reaches the target, record its length and shrink from the left. O(n) time, O(1) space; the follow-up is prefix sums plus binary search in O(n log n)."
