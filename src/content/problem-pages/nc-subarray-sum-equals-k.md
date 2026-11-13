---
problemId: nc-subarray-sum-equals-k
title: Subarray Sum Equals K
source: neetcode
sourceUrl: https://leetcode.com/problems/subarray-sum-equals-k/
difficulty: medium
patterns: [arrays-hashing, hashing, prefix-sum]
relatedLessons: [a2-prefix-suffix, a2-hashing, a2-sliding-window, a2-frequency-counting, a14-deriving-optimization]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

You get an integer array `nums` and an integer `k`. Count how many contiguous, non-empty stretches of the array (subarrays) add up to exactly `k`. Two subarrays are different if they start or end at different positions, even if they contain the same values.

**Example 1**

- Input: `nums = [1, 2, 3]`, `k = 3`
- Output: `2`
- Why: `[1, 2]` (positions 0 to 1) and `[3]` (position 2) both sum to 3. No other subarray does: the others sum to 1, 2, 5 and 6.

**Example 2**

- Input: `nums = [1, -1, 1, -1]`, `k = 0`
- Output: `4`
- Why: `[1, -1]` at positions 0–1, `[-1, 1]` at 1–2, `[1, -1]` at 2–3, and the whole array 0–3. Equal values at different positions count separately.

**What the problem statement guarantees**

- 1 ≤ `nums.length` ≤ 2 × 10^4.
- −1000 ≤ `nums[i]` ≤ 1000.
- −10^7 ≤ `k` ≤ 10^7.
- Subarrays are contiguous and non-empty.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The values can be negative, and that one fact decides which techniques work.

**How to practise**

1. Set a timer for 20 minutes and talk out loud.
2. Write the simplest correct solution and its complexity for n = 2 × 10^4.
3. Before reaching for a technique you know from other subarray problems, test it on `[5, -3, 1]` with k = 3 (the answer is 1).
4. Try to express "the sum of `nums[i..j]`" using two numbers that you could compute once each.
5. Code it, then trace Example 2 and the input `[1, 2, 3]` with k = 0 (the answer is 0).

> [!HINT] Hint 1: a small nudge
> Let S(j) be the sum of the first j elements. Write the sum of the subarray from position i to position j − 1 in terms of S. What equation must hold for that subarray to count?

> [!HINT] Hint 2: the kind of tool you need
> For a fixed right end j, you need to know how many earlier values S(i), with i < j, equal one particular number. A structure that counts how many times each value has appeared answers that without scanning.

> [!HINT] Hint 3: almost the whole plan
> Walk through the array keeping a running sum and a table from "running-sum value" to "how many times seen so far". Before the first element, the table already records the empty prefix, sum 0, once. At each element, update the running sum, add the count stored for (running sum − k), and only then record the running sum. Work out what goes wrong with k = 0 if you record first.

**Check yourself before revealing the walkthrough**

- [ ] My code returns 2 for `[1, 2, 3]` with k = 3, and 4 for `[1, -1, 1, -1]` with k = 0
- [ ] It returns 1 for `[5, -3, 1]` with k = 3, and 0 for `[1, 2, 3]` with k = 0
- [ ] It returns 6 for `[0, 0, 0]` with k = 0
- [ ] I can say why a two-pointer window is wrong here, with an input that breaks it

## 3. Interview script: understand the problem (≈2 min)

**Me:** I count contiguous subarrays whose sum is exactly k. I return a count, not the subarrays themselves. And subarrays at different positions count separately even if they hold the same values?

**Interviewer:** Yes, count by position.

**Me:** Can values be negative or zero?

**Interviewer:** Values are between −1000 and 1000.

**Me:** That matters a lot. With only positive values, extending a subarray always increases its sum, and I could use a sliding window. With negatives that monotonicity is gone. Can k be zero or negative?

**Interviewer:** k is between −10^7 and 10^7.

**Me:** So k = 0 is allowed, and I'll test it specifically. How long is the array?

**Interviewer:** Up to 2 × 10^4, at least one element.

**Me:** Then the number of subarrays is n(n + 1) / 2, about 2 × 10^8. Is an empty subarray allowed, for k = 0?

**Interviewer:** No, subarrays are non-empty.

**Me:** Good, I'll make sure my counting can't include an empty one. On sizes: any subarray sum is at most 2 × 10^4 × 1000 = 2 × 10^7 in absolute value, and the count is at most about 2 × 10^8. Both fit in an `int`.

**Me:** By hand on `[1, 2, 3]` with k = 3: starting at 0, the sums are 1, 3, 6, so one hit. Starting at 1: 2, 5. Starting at 2: 3, another hit. Total 2.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 2 × 10^4 | O(n²) is about 2 × 10^8 simple steps: it might pass, but it is the baseline, not the goal. O(n³) is out. |
| −1000 ≤ `nums[i]` ≤ 1000 | Negatives and zeros: sums are not monotone, so a sliding window does not work. Every prefix sum is within ±2 × 10^7, so `int` holds it. |
| −10^7 ≤ k ≤ 10^7 | k = 0 and negative k occur. `sum - k` is within ±3 × 10^7, still an `int`. |
| Contiguous, non-empty | A subarray is a pair of a start and an end with start ≤ end. An empty one must never be counted, which matters for k = 0. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Count by position, not by distinct contents | Equal subarrays at different positions are separate; I need counts of prefix sums, not just whether they occurred. |
| Return only the count | I don't have to materialize subarrays, so an O(n) solution is possible even when there are Θ(n²) matching subarrays. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The result fits in an `int` | The count is at most n(n + 1) / 2 = 2 × 10^4 × 20,001 / 2 = 200,010,000, below 2^31 − 1 ≈ 2.147 × 10^9. I'd switch to `long` for longer arrays. |
| `nums` may not be modified | Nothing says I may; the solutions below only read it. |

### Edge cases I will keep in mind

- k = 0, where an empty subarray must not be counted.
- All zeros with k = 0: every subarray counts, the maximum possible answer.
- Negative values that make a too-large sum come back down: `[5, -3, 1]`, k = 3.
- A single element, equal to k or not.
- Subarrays starting at index 0, and a repeated prefix-sum value.

## 4. Think out loud: from first idea to best solution

Throughout: **n** is the length of `nums`, and **S(j)** is the sum of the first j elements, with S(0) = 0. The sum of `nums[i..j-1]` is S(j) − S(i).

The most literal solution tries every start and every end and sums the elements between them: O(n³), about 10^12 operations here. I say it in one sentence and immediately notice that it re-adds the same elements for each end, so I start from the version that does not.

### Approach 1: Every start, with a running sum

#### What I say out loud

> "Fix a start i, and extend the end to the right one element at a time, keeping a running sum. Every time the running sum equals k, that's one subarray. That's O(n²): about 2 × 10^8 additions for the largest input. It's correct and it might even pass, but I want to see if I can drop the inner loop."

#### Intuition

Every subarray has one start and one end. For a fixed start, the sum for end j + 1 is the sum for end j plus one element, so each subarray costs one addition.

#### Algorithm

1. `count = 0`.
2. For each start i: `sum = 0`; for each end j from i to n − 1: `sum += nums[j]`; if `sum == k`, `count++`.
3. Return `count`.

#### Why it is correct

Each pair (i, j) with i ≤ j, that is, each non-empty subarray, is visited exactly once, and at that moment `sum` equals the sum of `nums[i..j]`, because it started at 0 for this i and has added exactly `nums[i]` through `nums[j]`. So `count` is the number of subarrays with sum k.

#### Dry run

`nums = [1, 2, 3]`, `k = 3`

| i | j | sum | equals 3? | count |
|---|---|---|---|---|
| 0 | 0 | 1 | no | 0 |
| 0 | 1 | 3 | yes | 1 |
| 0 | 2 | 6 | no | 1 |
| 1 | 1 | 2 | no | 1 |
| 1 | 2 | 5 | no | 1 |
| 2 | 2 | 3 | yes | 2 |

Returns 2.

#### Java code

```java title="Approach 1: every start, running sum"
class Solution {
    public int subarraySum(int[] nums, int k) {
        int count = 0;
        for (int i = 0; i < nums.length; i++) {
            int sum = 0;
            for (int j = i; j < nums.length; j++) {
                sum += nums[j];
                if (sum == k) {
                    count++;
                }
            }
        }
        return count;
    }
}
```

#### Time complexity

**O(n²) in every case**: n(n + 1) / 2 inner iterations, 200,010,000 for n = 2 × 10^4. Early exits are impossible, because negative values mean a later element can bring the sum back to k.

#### Space complexity

**O(1) auxiliary space.**

#### The bridge to the next approach

> "Can I skip some ends? With only positive numbers, once the sum passes k, extending further only makes it bigger, so I could stop, and that's the sliding-window idea. But here a negative number can bring it back: `[5, -3, 1]` with k = 3 passes 3 at the first element and returns to exactly 3 at the end. So pruning by size is wrong."

> "Different angle. Every subarray sum is a difference of two prefix sums: sum of `nums[i..j-1]` is S(j) − S(i). So a subarray ending just before j has sum k exactly when S(i) = S(j) − k. For a fixed j, I'm asking: how many earlier prefix sums equal one specific value? That's the Two Sum question again, a lookup of a known value among things I've already seen, except now I need a count rather than a position. A hash map from prefix-sum value to how many times it has occurred answers it in constant expected time."

### Alternative: sliding window (does not work here)

A variable-size window is the usual tool for "subarray with sum k" when every value is positive: grow the right end, and while the sum exceeds k, shrink from the left. It relies on the sum only growing as the window grows. With negatives that fails:

- `[5, -3, 1]`, k = 3: the window sees 5 > 3 and drops the 5. But `[5, -3, 1]` itself sums to 3 and is the only answer. The window version returns 0; the correct answer is 1.
- Zeros break it too: `[0, 0, 0]` with k = 0 has 6 qualifying subarrays, but a window that counts at most one window per right end returns 3.

The window is the right answer to the positive-only variant (see section 12), which is worth saying when you reject it.

### Approach 2: Prefix sums with a hash map of counts (recommended)

#### What I say out loud

> "I walk the array once with a running sum, which is S(j) after j elements. I keep a map from each prefix-sum value to how many times it has occurred among S(0) .. S(j − 1). At each step, the number of subarrays ending at the current element with sum k is the count of `sum - k` in the map. I add that, and then record the current sum."

> "Two details. The map starts with `{0: 1}`, for the empty prefix S(0) = 0: without it, subarrays that start at index 0 are never counted. And I look up before I insert, so the map only holds prefixes strictly before the current end: otherwise, with k = 0, the current prefix would match itself, which is the empty subarray."

#### Intuition

A subarray is a pair of prefixes (i, j) with i < j, and its sum is S(j) − S(i). Counting subarrays with sum k means counting pairs i < j with S(i) = S(j) − k. Walking j from left to right and keeping a frequency table of the prefix sums already seen turns each j into one lookup. This is complement lookup from [[nc-two-sum|Two Sum]] applied to [[a2-prefix-suffix|prefix sums]], with [[a2-frequency-counting|frequency counting]] instead of a single stored index.

#### Algorithm

1. `seen = {0: 1}` (the empty prefix), `sum = 0`, `count = 0`.
2. For each element x:
   1. `sum += x` (now `sum` is S(j) for the prefix ending at x).
   2. `count += seen.getOrDefault(sum - k, 0)`.
   3. `seen[sum] += 1`.
3. Return `count`.

#### Why it is correct

**The invariant: when processing the element at index j − 1 (so that `sum` = S(j) after step 2.1), `seen` maps every value v to the number of indices i with 0 ≤ i ≤ j − 1 and S(i) = v.**

- Initially (j = 1), the only such index is i = 0 with S(0) = 0: that is `{0: 1}`.
- Step 2.3 adds S(j) after the lookup, which extends the range to i ≤ j for the next element.

Given the invariant:

- **Every subarray counted is valid and non-empty.** At step 2.2, each counted index i satisfies i ≤ j − 1 < j and S(i) = S(j) − k, so `nums[i..j-1]` is a non-empty subarray with sum k.
- **No subarray is missed or counted twice.** Every non-empty subarray `nums[i..j-1]` has exactly one right boundary j. When the loop computes S(j), index i is in the table (because i < j) and is counted once, in the count for value S(j) − k.
- **Why `{0: 1}`:** subarrays starting at index 0 correspond to i = 0, the empty prefix. Without that entry, `[1, 2, 3]` with k = 3 returns 1 instead of 2: it misses `[1, 2]`.
- **Why query before insert:** if S(j) were inserted first, the table would contain i = j, the empty subarray, which has sum 0. That only matters when k = 0, because then S(j) − k = S(j) and the current prefix matches itself. With insert-first, `[1, 2, 3]` and k = 0 returns 3 instead of 0. For any k ≠ 0, the order happens not to matter, which is exactly why this bug survives casual testing.

**The 25-second version to say to the interviewer:**

> "The sum of a subarray is the difference of two prefix sums, so a subarray ending here sums to k exactly when some earlier prefix sum equals the current one minus k. I keep a count of each prefix sum seen so far, starting with the empty prefix 0 once, so subarrays starting at index 0 are counted. At each element I add the count for sum minus k, then record the current sum. Looking up before recording means only strictly earlier prefixes count, so I never count an empty subarray."

#### Dry run

`nums = [1, 2, 1, -1, 2, 1]`, `k = 3` (prefix sum 3 occurs twice, so one lookup returns 2)

| j − 1 | x | sum = S(j) | sum − k | `seen` before the lookup | added | count |
|---|---|---|---|---|---|---|
| 0 | 1 | 1 | −2 | {0: 1} | 0 | 0 |
| 1 | 2 | 3 | 0 | {0: 1, 1: 1} | 1 | 1 |
| 2 | 1 | 4 | 1 | {0: 1, 1: 1, 3: 1} | 1 | 2 |
| 3 | −1 | 3 | 0 | {0: 1, 1: 1, 3: 1, 4: 1} | 1 | 3 |
| 4 | 2 | 5 | 2 | {0: 1, 1: 1, 3: 2, 4: 1} | 0 | 3 |
| 5 | 1 | 6 | 3 | {0: 1, 1: 1, 3: 2, 4: 1, 5: 1} | 2 | 5 |

Returns 5. The five subarrays: `[1, 2]` (0–1), `[2, 1]` (1–2), `[1, 2, 1, -1]` (0–3), and at the last step the two prefixes with sum 3 give `[1, -1, 2, 1]` (2–5) and `[2, 1]` (4–5).

#### Java code

```java title="Approach 2: prefix sums + hash map (recommended)"
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> seen = new HashMap<>(); // prefix-sum value -> how many earlier prefixes have it
        seen.put(0, 1);                               // the empty prefix, so subarrays starting at index 0 count
        int sum = 0;
        int count = 0;
        for (int x : nums) {
            sum += x;
            count += seen.getOrDefault(sum - k, 0);   // look up first: only strictly earlier prefixes
            seen.merge(sum, 1, Integer::sum);         // then record this prefix
        }
        return count;
    }
}
```

#### Time complexity

**O(n) expected time; not O(n) in the worst case.** The loop runs n times with one `getOrDefault` and one `merge`, each constant time on average if the prefix-sum values spread well over the buckets (with amortized resizing). If many values collided, each operation could cost up to O(n) with list buckets, O(n²) overall; current Java implementations convert heavily collided buckets into balanced trees, which for `Integer` keys keeps an operation to about O(log n), but that is implementation behaviour, not an API guarantee.

#### Space complexity

**O(n) auxiliary space**: the map holds at most n + 1 distinct prefix sums, each a boxed key, a boxed count and a node.

## 5. Comparison table

n = length of `nums`. "Expected" averages over hashing behaviour.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Every start and end, re-summing (not coded) | O(n³) | O(n³) | O(1) |
| 1. Every start, running sum | O(n²) | O(n²) | O(1) |
| Alt. Sliding window | O(n) | O(n) | O(1), but wrong with negative values or zeros |
| 2. Prefix sums + hash map | O(n) | O(n²) in general; about O(n log n) with current Java tree buckets (not an API guarantee) | O(n) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Every start, running sum | Simple, no memory, guaranteed bound | 2 × 10^8 steps at the limits | Baseline; tiny inputs |
| Alt. Sliding window | O(1) space | Incorrect unless all values are positive | The positive-only variant |
| 2. Prefix sums + hash map | Linear expected time, handles negatives and k = 0 | O(n) memory; expected rather than guaranteed time | The answer to give |

## 6. Which solution to give, and when to stop optimizing

Give the prefix-sum hash map. Say the O(n²) running-sum version first, explain in one sentence why a sliding window is wrong here (with `[5, -3, 1]`), then derive the prefix-sum identity. O(n) expected time matches the Ω(n) worst-case lower bound: an element that is never read could change the count, so a correct algorithm must, in the worst case, read essentially all of them. Stop once `{0: 1}` and the look-up-then-insert order are justified and k = 0 has been traced. If the interviewer wants a guaranteed bound, offer a `TreeMap` (O(n log n) worst case) rather than more cleverness.

## 7. Interview script: code it and test it

### What I say while coding

> "The map is prefix-sum value to count, not to index: several earlier prefixes can share a value, and each one is a different subarray."

> "`seen.put(0, 1)` before the loop: that's the empty prefix."

> "Inside the loop: update the sum, add the count for `sum - k`, then record `sum`. I'll keep those three lines in that order."

> "`sum` stays within ±2 × 10^7, `sum - k` within ±3 × 10^7, and the count at most about 2 × 10^8, so `int` everywhere."

### Testing out loud

**Normal case:** `[1, 2, 3]`, k = 3. sum 1: need −2, none. sum 3: need 0, found once, count 1. sum 6: need 3, found once (the prefix after two elements), count 2. Returns 2.

**k = 0:** `[1, 2, 3]`, k = 0. Sums 1, 3, 6, each looked up before it is recorded, and none was seen before: 0. Returns 0, so no empty subarray was counted.

**Negatives:** `[5, -3, 1]`, k = 3. sum 5: need 2, none. sum 2: need −1, none. sum 3: need 0, found once. Returns 1, the case the sliding window gets wrong.

**All zeros:** `[0, 0, 0]`, k = 0. sum 0 each time; the table holds 0 with count 1, then 2, then 3 before each lookup: 1 + 2 + 3 = 6. That is every subarray, n(n + 1) / 2.

**Example 2:** `[1, -1, 1, -1]`, k = 0. Sums 1, 0, 1, 0. Lookups find 0, 1, 1, 2 previous equal sums: total 4.

**Single element:** `[-7]`, k = −7: sum −7, need 0, found: 1. With k = 7: need −14, none: 0.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1–2 min | Negatives, k = 0, non-empty, count by position |
| Baseline and why not a window | 2 min | O(n²) running sum; `[5, -3, 1]` breaks a window |
| Derive the prefix-sum identity | 2–3 min | S(j) − S(i) = k, then "count earlier S(i) = S(j) − k" |
| Code | 3 min | Three lines in the loop, `{0: 1}` before it |
| Test | 3–4 min | Normal, k = 0, negatives, all zeros |
| Complexity and follow-ups | rest | Expected versus worst case, variants |

The derivation is the hard part. If it does not come, write out the prefix sums of an example under the array and look for two of them whose difference is k: the pairs you find are exactly the answers.

## 9. Interviewer challenges

### About the design

#### Why does the map start with `{0: 1}`?

**What they are testing:** whether you know what the entry represents, or just remember it.

**How to reason:** a subarray from index 0 to j − 1 has sum S(j) − S(0), and S(0) is the sum of nothing.

**What I say:** "It's the empty prefix, S(0) = 0, which exists before I read anything. A subarray starting at index 0 is the difference between the current prefix and that empty prefix. Without the entry, `[1, 2, 3]` with k = 3 gives 1 instead of 2, because `[1, 2]` is never counted."

**Nuance:** it is a count of 1, not a flag: it says one prefix (the empty one) has sum 0. An alternative is `if (sum == k) count++` inside the loop, which counts the same thing, but the seeded map keeps all cases on one path.

#### Why do you look up before inserting?

**What they are testing:** the invariant, and whether you know when the wrong order actually fails.

**How to reason:** if the current prefix is in the table during its own lookup, which pair does it form?

**What I say:** "The table must hold only prefixes strictly before the current one, so every counted pair is a non-empty subarray. If I inserted first, the current prefix would be paired with itself, which is an empty subarray with sum 0. That's counted only when k is 0: `[1, 2, 3]` with k = 0 returns 3 instead of 0. For other k it happens to give the right answer, so it's an easy bug to miss."

**Nuance:** the same "look up, then record" order is what makes Two Sum's one-pass map unable to pair an element with itself.

#### Why not a sliding window?

**What they are testing:** whether you know the precondition of the technique.

**How to reason:** a window shrinks from the left when the sum is too big, which is only safe if removing elements can only decrease the sum and adding them can only increase it.

**What I say:** "A window needs the sum to grow as the window grows, which is true only for positive values. Here `[5, -3, 1]` with k = 3 makes the window drop the 5 because 5 > 3, but the whole array sums to 3. The window returns 0, the answer is 1. With only positive numbers I would use the window, in O(1) space."

**Nuance:** zeros alone already break the usual window code (`[0, 0, 0]` with k = 0 gives 3 instead of 6), because several left ends can match the same right end.

### About complexity

#### Is it really O(n)?

**What they are testing:** precision about hashing.

**How to reason:** n iterations, two map operations each; those are constant only on average.

**What I say:** "O(n) expected, assuming the prefix sums hash well. In the worst case a hash table can degrade to linear time per operation, so O(n²); Java's tree buckets would make that about O(n log n), but that's implementation behaviour. If you need a guarantee, a `TreeMap` gives O(n log n) in the worst case."

**Nuance:** prefix sums here lie in [−2 × 10^7, 2 × 10^7], so an `int` array of 4 × 10^7 + 1 counts indexed by `sum + 2 × 10^7` gives guaranteed O(n) time, at the cost of about 160 MB. Not worth it, but it shows where the hash map's memory trade sits.

#### Can the count overflow?

**What they are testing:** whether you bound the output, not just the inputs.

**How to reason:** the worst case is every subarray qualifying.

**What I say:** "At most n(n + 1) / 2 subarrays exist: for n = 2 × 10^4 that's 200,010,000, which fits in an `int`; all zeros with k = 0 reaches exactly that. Prefix sums are within ±2 × 10^7. For arrays a few times longer, the count would need a `long`."

**Nuance:** in the all-zeros case the count passes 2^31 − 1 once n reaches 65,536, since 65,536 × 65,537 / 2 = 2,147,516,416.

## 10. Follow-up questions the interviewer might ask

**"What if all values are positive?"**
Then sums grow as the window grows, and a sliding window counts the subarrays in O(n) time and O(1) space: for each right end at most one left end can match, because prefix sums are strictly increasing. See [[a2-sliding-window|Sliding Window]] and [[cses-subarray-sums-i|Subarray Sums I]].

**"Return the length of the longest subarray with sum k."**
Map each prefix-sum value to the *first* index where it occurred (insert only if absent). At index j, if S(j) − k was seen at index i, the candidate length is j − i. O(n) expected time and O(n) space.

**"Count subarrays whose sum is divisible by k."**
Two prefix sums give a sum divisible by k exactly when they are congruent modulo k, so count prefix sums by remainder, using `Math.floorMod` so negative sums give a remainder in [0, k). For each remainder seen c times, add c(c − 1) / 2, or add counts on the fly as above. That is [[cses-subarray-divisibility|Subarray Divisibility]].

**"Count subarrays with sum at most k."**
Now you need the number of earlier prefix sums that are ≥ S(j) − k, an order query a hash map cannot answer. Coordinate-compress the prefix sums and use a [[a12-fenwick|Fenwick tree]], O(n log n), or count pairs during a merge sort of the prefix sums.

**"Return all the subarrays, not just the count."**
The output alone can have Θ(n²) entries (all zeros with k = 0), so no algorithm is faster than the output size. Store a list of indices per prefix-sum value and emit one subarray per matching index: O(n + output) expected time.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Using a sliding window by reflex.** It assumes non-negative values (and handles zeros only with extra care). Check the value range before choosing it.
- **Thinking of the map as "seen or not".** Several prefixes can share a value, and each is a different subarray. The map must count.
- **Forgetting that k = 0 is special.** It is the only value where the update order matters and where zeros create many answers.

### Implementation mistakes

> [!MISTAKE] Not seeding the map with `{0: 1}`
> Starting with an empty map misses every subarray that begins at index 0. `[1, 2, 3]` with k = 3 returns 1 instead of 2.

> [!MISTAKE] Recording the current prefix before looking it up
> With `seen.merge(sum, 1, Integer::sum)` above the lookup, `[1, 2, 3]` with k = 0 returns 3 instead of 0: each prefix matches itself, counting an empty subarray. Other values of k hide the bug.

> [!MISTAKE] Using a set of prefix sums
> A `HashSet` adds 1 per match instead of the number of matching prefixes. On `[1, 2, 1, -1, 2, 1]` with k = 3 it returns 4 instead of 5, and on `[0, 0, 0]` with k = 0 it returns 3 instead of 6.

- **Looking up `k - sum` instead of `sum - k`.** The equation is S(i) = S(j) − k. With the sign flipped, `[1, 2, 3]` with k = 3 returns 1 instead of 2: it finds the empty prefix once by coincidence (3 − 3 = 0) and misses `[3]`.
- **Breaking out of the brute-force inner loop when `sum > k`.** That pruning is only valid for non-negative values.

## 12. Pattern recognition

**The pattern:** prefix sums plus a hash map of prefix-sum counts. A subarray sum is a difference of two prefix sums, so "count subarrays with sum k" becomes "for each prefix, count earlier prefixes equal to it minus k".

**Signals in the problem statement:**

- "Count the subarrays" (contiguous) whose sum, or another invertible aggregate, equals a target.
- Negative values or zeros, which rule out a sliding window.
- n too large for O(n²) to be comfortable.

**Related problems in this list:**

- [[nc-two-sum|Two Sum]]: the same complement lookup on raw values; here on prefix sums, with counts instead of indices.
- [[cses-subarray-sums-ii|Subarray Sums II]] (CSES): the same count with values up to 10^9, which needs `long` sums.
- [[cses-subarray-sums-i|Subarray Sums I]] (CSES): positive values only, so a sliding window works.
- [[cses-subarray-divisibility|Subarray Divisibility]] (CSES): the same idea with prefix sums modulo n.
- [[nc-minimum-size-subarray-sum|Minimum Size Subarray Sum]]: positive values, sliding window, contrast case.
- [[nc-range-sum-query-2d-immutable|Range Sum Query 2D - Immutable]]: prefix sums turning range sums into differences.

**Takeaway:** if a problem asks for subarrays with an exact sum and values can be negative, think "S(j) − S(i) = k: count earlier prefix sums equal to S(j) − k in a hash map seeded with the empty prefix".

## 13. 60-second revision card

**Key insight:** sum of `nums[i..j-1]` = S(j) − S(i). Count, for each j, the earlier prefixes with S(i) = S(j) − k.

**Invariant:** before the lookup at prefix j, the map counts the prefix sums S(0) .. S(j − 1). Seed `{0: 1}`; look up, then record.

**Complexity:** O(n) expected time, O(n) space; worst case O(n²) for hash tables in general. Sums fit in `int` (|S| ≤ 2 × 10^7), and so does the count (≤ 200,010,000).

**Code skeleton:**

```java title="Prefix-sum counts" fragment="public int subarraySum(int[] nums, int k)"
Map<Integer, Integer> seen = new HashMap<>();
seen.put(0, 1);                              // empty prefix
int sum = 0, count = 0;
for (int x : nums) {
    sum += x;
    count += seen.getOrDefault(sum - k, 0);  // earlier prefixes only
    seen.merge(sum, 1, Integer::sum);        // then record this one
}
return count;
```

**Main traps:**

- Missing `{0: 1}`: subarrays starting at index 0 are lost.
- Insert before lookup: wrong only when k = 0.
- A set instead of counts: repeated prefix sums undercount.
- Sliding window: wrong with negatives and zeros.

**What to say in one breath:** "Brute force is O(n²) with a running sum, and a window fails because values can be negative. A subarray sum is the difference of two prefix sums, so at each position I add how many earlier prefix sums equal the current one minus k, using a hash map of counts seeded with the empty prefix, looking up before recording. O(n) expected time, O(n) space."
