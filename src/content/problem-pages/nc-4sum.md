---
problemId: nc-4sum
title: 4Sum
source: neetcode
sourceUrl: https://leetcode.com/problems/4sum/
difficulty: medium
patterns: [two-pointers, sorting]
relatedLessons: [a2-two-pointers, a2-sorting-based, a1-recursion, a14-edge-cases, a14-deriving-optimization]
companies: []
timeToSolve: 25
---

## 1. Problem restatement

You get an array of integers and a target. Find every group of four values, taken from four different positions, whose sum equals the target. Report each group of values once, no matter how many position choices produce it. The groups, and the values inside each group, may be returned in any order.

**Example 1**

- Input: `nums = [2, -1, 0, 1, -2, 2]`, `target = 1`
- Output: `[[-2, -1, 2, 2], [-2, 0, 1, 2]]`
- Why: `-2 - 1 + 2 + 2 = 1` uses both 2s, which is allowed because they are at different positions. `-2 + 0 + 1 + 2 = 1` can be built with either 2, but it is reported once.

**Example 2**

- Input: `nums = [3, 3, 3, 3, 3]`, `target = 12`
- Output: `[[3, 3, 3, 3]]`
- Why: five ways to choose four positions, one set of values.

**Example 3**

- Input: `nums = [1000000000, 1000000000, 1000000000, 1000000000]`, `target = -294967296`
- Output: `[]`
- Why: the only possible sum is 4,000,000,000, which is not the target. (This input exists to catch a specific bug; see section 4.)

**What the problem statement guarantees**

- The four positions must be different; values may repeat.
- The answer must contain unique quadruplets; any order is accepted.
- `1 <= nums.length <= 200`.
- `-10^9 <= nums[i] <= 10^9` and `-10^9 <= target <= 10^9`.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 25 minutes and talk out loud.
2. Compute the largest and smallest possible sum of four values from the constraints, and compare them with the range of a Java `int`.
3. Say the brute force and its cost at n = 200.
4. Decide which smaller problem is left once you fix some of the four values, and how many you need to fix.
5. Code it, then run it in your head on Example 1 and Example 3.

Open a hint only after two minutes without progress.

> [!HINT] Hint 1: a small nudge
> If you fix the two smallest values of the group, what is left to find, and is it a problem you have solved before on ordered data?

> [!HINT] Hint 2: the kind of tool you need
> Ordering the array lets you finish each choice of the first two values with a single sweep from both ends of the remaining range, and it makes repeated values neighbours, which is how you avoid reporting the same group twice. Watch the arithmetic: four values near 10^9 do not fit in 32 bits.

> [!HINT] Hint 3: almost the whole plan
> Order the array. Loop over the first value, skipping a value equal to the previous first value; inside, loop over the second value, skipping a value equal to the previous second value **for the same first value**; then sweep two indices inward over the rest, computing the sum in 64-bit arithmetic, and after each match move both indices past copies of the values just used.

**Check yourself before revealing the walkthrough**

- [ ] I can state the largest possible sum and why `int` is not enough
- [ ] My code returns `[]` for Example 3 and `[[3, 3, 3, 3]]` for Example 2
- [ ] My code finds `[-2, -2, 2, 2]` in `[-2, -2, -2, 2, 2, 2]` with target 0
- [ ] I can extend my solution to k numbers and give its complexity

## 3. Interview script: understand the problem (≈2 min)

If you have done [[nc-3sum|3Sum]], the shape of this one is familiar. The new parts are an arbitrary target, which breaks a 3Sum shortcut, and a value range large enough to overflow.

**Me:** I return all quadruplets of values from four different positions that sum to the target, each set of values once, in any order. Same rules as 3Sum, with four numbers and a target instead of zero?

**Interviewer:** Yes.

**Me:** The array can be as short as one element. Then the answer is just empty?

**Interviewer:** Right.

**Me:** Values and target go up to 10^9 in absolute value. Four values can reach 4 · 10^9, and an `int` stops at 2,147,483,647. Even three values, 3 · 10^9, overflow. Two values reach 2 · 10^9, which fits, but only just. So I'll do every sum in `long`.

**Interviewer:** Good. What would go wrong otherwise?

**Me:** The sum would wrap around. Four times 10^9 in `int` arithmetic is 4,000,000,000 − 2^32 = −294,967,296, so with that target the code would report a quadruplet that doesn't exist. A wrapped sum can also make me move the wrong pointer and miss a real one. I'll show both when I test.

**Interviewer:** OK.

**Me:** Up to 200 elements, so n⁴ is about 6.5 · 10^7 quadruples (n choose 4), and n³ is 8 · 10^6. I'm aiming for n³. May I sort the array in place?

**Interviewer:** Yes.

**Me:** Quick example by hand: `[2, -1, 0, 1, -2, 2]` with target 1, sorted `[-2, -1, 0, 1, 2, 2]`. Fix -2 and -1: the rest needs 4, that's 2 + 2. Fix -2 and 0: needs 3, that's 1 + 2. Fix -2 and 1: needs 2, from `[2, 2]` that's 4, no. Starting from -1 instead, the smallest remaining combination, -1 + 0 + 1 + 2, is already 2, too big. Two quadruplets.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| Four different positions; values may repeat | `[-2, -1, 2, 2]` is legal. Duplicate skipping must keep the first copy at each level. |
| Unique quadruplets, any order | Report each value set once; sorting gives each in ascending order. |
| 1 ≤ n ≤ 200 | n < 4 gives an empty answer without special code if loop bounds are right. n⁴ ≈ 6.5 · 10^7 quadruples (n choose 4); n³-level work is a few million steps. |
| \|nums[i]\| ≤ 10^9, \|target\| ≤ 10^9 | Sums of three or four values exceed `int` (max 2,147,483,647). Use `long`. Negative targets break "skip values above the target". |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Sorting in place is allowed | No copy; otherwise O(n) more memory. |
| n < 4 returns an empty list | No exception; the loops simply do not run. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The output is not counted as auxiliary space | It can hold on the order of n³ quadruplets (section 4). |
| `long` is wide enough for every intermediate value | The largest magnitude is 4 · 10^9 for a sum of four values, or 3 · 10^9 for the remaining target `target − nums[a] − nums[b]`; `long` holds about 9.2 · 10^18. |

### Edge cases I will keep in mind

- Fewer than four elements: `[1]`, `[1, 2, 3]`.
- Exactly four elements: `[1, 2, 3, 4]` with target 10 and with target 11.
- All equal: `[3, 3, 3, 3, 3]`, and 200 equal values.
- A value used twice or more in one quadruplet, at different levels: `[-2, -2, -2, 2, 2, 2]` with target 0.
- Overflow: four values of 10^9 with target -294,967,296; four of -10^9 with target 294,967,296; `[-10^9, -10^9, -10^9, 5 · 10^8, 5 · 10^8]` with target -10^9.
- A negative target that is smaller than every value: `[-5, -4, -3, -2]` with target -14.

## 4. Think out loud: from first idea to best solution

> "This is 3Sum with one more number and a general target. I expect one more loop around the 3Sum scan, so n³. Two things deserve care: duplicate rules at two levels instead of one, and the arithmetic."

### Approach 1: Brute force over every quadruple, deduplicated with a set

#### What I say out loud

> "Four nested loops over positions `a < b < c < d`. If I sort first, every quadruple comes out in ascending order, so equal value sets look identical and a set of lists removes repeats. The sum goes in a `long`. At n = 200 that's about 65 million quadruples: slow, but it runs, so it's my reference."

#### Intuition

Every answer is one of the n choose 4 position quadruples, so checking all of them cannot miss one, and a set keyed by the sorted values reports each value set once.

#### Algorithm

1. Sort `nums`.
2. For all `a < b < c < d`: if `(long) nums[a] + nums[b] + nums[c] + nums[d] == target`, add the list of the four values to a `HashSet`.
3. Return the set's contents as a list.

#### Why it is correct

- **Only valid quadruplets:** each comes from four different positions and passes the exact `long` sum check.
- **None missed:** every position quadruple is visited.
- **No repeats:** after sorting, positions `a < b < c < d` give values in ascending order, so two quadruples with the same values produce equal lists, and the set keeps one.

#### Dry run

`nums = [3, 3, 3, 3, 3]`, `target = 12`. All five position quadruples (`0123`, `0124`, `0134`, `0234`, `1234`) sum to 12 and produce the list `[3, 3, 3, 3]`. The set keeps one; the result is `[[3, 3, 3, 3]]`.

#### Java code

```java title="Approach 1: brute force + set"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

class Solution {
    public List<List<Integer>> fourSum(int[] nums, int target) {
        Arrays.sort(nums); // so every quadruple a < b < c < d comes out already sorted
        int n = nums.length;
        Set<List<Integer>> found = new HashSet<>(); // equal sorted quadruples collapse into one
        for (int a = 0; a < n; a++) {
            for (int b = a + 1; b < n; b++) {
                for (int c = b + 1; c < n; c++) {
                    for (int d = c + 1; d < n; d++) {
                        long sum = (long) nums[a] + nums[b] + nums[c] + nums[d];
                        if (sum == target) {
                            found.add(Arrays.asList(nums[a], nums[b], nums[c], nums[d]));
                        }
                    }
                }
            }
        }
        return new ArrayList<>(found);
    }
}
```

#### Time complexity

**O(n⁴) for the loops**: n(n − 1)(n − 2)(n − 3) / 24 sums, 64,684,950 for n = 200. Each hit also hashes a four-element list, O(1) expected. On 200 equal values with a matching target every quadruple is a hit, so all 65 million go through the set. The sort, O(n log n), is negligible.

#### Space complexity

**O(q) auxiliary** for the set, where q is the number of distinct quadruplets in the answer, plus the copy returned. No other storage.

#### The bridge to the next approach

> "The two innermost loops look for a pair with a known sum, `target − nums[a] − nums[b]`, in a sorted range. That's Two Sum II, which two pointers solve in linear time. Replacing those two loops with one scan gives n³. And if I copy 3Sum's skip rules, I can drop the set."

### Approach 2: Two fixed values, then two pointers (recommended)

#### What I say out loud

> "Sort. The outer loop fixes the smallest value `nums[a]`, the next loop fixes the second `nums[b]` with `b > a`, and two pointers scan `[b + 1, n − 1]` for the rest. Every sum is computed in `long`."

> "Duplicates at three places. First level: skip `a` if it equals the previous `a`. Second level: skip `b` if it equals the previous `b`, but only counting from `a + 1`; otherwise I'd skip the first copy of a value that is also the first value, and lose `[-2, -2, 2, 2]`. Third level: after a hit, move both pointers past copies, as in 3Sum."

> "One shortcut I won't copy from 3Sum: 'break when the first value is positive' depended on the target being zero. With target -14 and `[-5, -4, -3, -2]`, the first value -5 is already above the target and the answer still exists."

#### Intuition

Fixing two values reduces 4Sum to the pair search from [[nc-two-sum-ii-input-array-is-sorted|Two Sum II]], with several answers allowed, exactly as fixing one value did in [[nc-3sum|3Sum]]. Sorting makes every repeat adjacent, so one "skip equal neighbour" rule per level removes all duplicates.

#### Algorithm

1. Sort `nums`.
2. For `a` from 0 to n − 4; skip if `a > 0` and `nums[a] == nums[a − 1]`.
3. For `b` from `a + 1` to n − 3; skip if `b > a + 1` and `nums[b] == nums[b − 1]`.
4. `left = b + 1`, `right = n − 1`. While `left < right`:
   - `sum = (long) nums[a] + nums[b] + nums[left] + nums[right]`.
   - Below target: `left++`. Above: `right--`.
   - Equal: record; `left++`, `right--`; skip `left` past values equal to `nums[left − 1]` and `right` past values equal to `nums[right + 1]`, both while `left < right`.

#### Why it is correct

The argument is 3Sum's, with one more level.

- **The scan, for fixed `a` and `b`,** finds every value pair `(x, y)` in `[b + 1, n − 1]` with `x + y = target − nums[a] − nums[b]`, each once. A miss discards an element whose best remaining partner already failed; after a hit with values `x` and `y`, every skipped copy can only pair into the same `(x, y)`.
- **Second level.** If `nums[b]` equals `nums[b − 1]` and `b − 1 > a`, then `b − 1` was already a second value for this `a`, with a range `[b, n − 1]` that contains `b`'s range. Everything `b` could find is already found. The condition starts at `a + 1` because position `a + 1` is the first candidate for this level, even if it equals `nums[a]`.
- **First level.** The same containment argument: an earlier `a` with the same value had a range that includes the later one's.
- **No repeats overall.** Each quadruplet is reported in ascending order with `nums[a]` as its smallest value and `nums[b]` as its second smallest; each distinct first value is used once, each distinct second value once per first value, and each pair once per `(a, b)`.
- **Nothing missed.** For a value set `w ≤ x ≤ y ≤ z` that the array can supply, take `a` as the first position holding `w`, and `b` as the first position after `a` holding `x`. Neither is skipped, and the scan's range after `b` holds `y` and `z`, so the scan reports them.
- **Arithmetic.** In `long`, the true sum, at most 4 · 10^9 in absolute value, is computed exactly, so every comparison with the target is the real one.

#### Dry run

`nums = [2, -1, 0, 1, -2, 2]`, `target = 1`, sorted to `[-2, -1, 0, 1, 2, 2]` (indices 0–5).

| a (value) | b (value) | left (value) | right (value) | Sum | Action |
|---|---|---|---|---|---|
| 0 (-2) | 1 (-1) | 2 (0) | 5 (2) | -1 | too small, `left++` |
| 0 (-2) | 1 (-1) | 3 (1) | 5 (2) | 0 | too small, `left++` |
| 0 (-2) | 1 (-1) | 4 (2) | 5 (2) | 1 | record `[-2, -1, 2, 2]`; `left = 5`, `right = 4`, stop |
| 0 (-2) | 2 (0) | 3 (1) | 5 (2) | 1 | record `[-2, 0, 1, 2]`; `left = 4`, `right = 4`, stop |
| 0 (-2) | 3 (1) | 4 (2) | 5 (2) | 3 | too big, `right--`, stop |
| 1 (-1) | 2 (0) | 3 (1) | 5 (2) | 2 | too big, `right--` |
| 1 (-1) | 2 (0) | 3 (1) | 4 (2) | 2 | too big, `right--`, stop |
| 1 (-1) | 3 (1) | 4 (2) | 5 (2) | 4 | too big, `right--`, stop |
| 2 (0) | 3 (1) | 4 (2) | 5 (2) | 5 | too big, `right--`, stop |

Result: `[[-2, -1, 2, 2], [-2, 0, 1, 2]]`. The `b` loop stops at index 3 (`b < n − 2`) and the `a` loop at index 2 (`a < n − 3`).

**The overflow input** `[10^9, 10^9, 10^9, 10^9]`, target -294,967,296: one step, `a = 0`, `b = 1`, `left = 2`, `right = 3`, `long` sum 4,000,000,000, above the target, `right--`, stop. Result `[]`. With an `int` sum the same step computes -294,967,296 and records `[10^9, 10^9, 10^9, 10^9]`; I ran it to confirm.

#### Java code

```java title="Approach 2: two fixed values + two pointers (recommended)"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Solution {
    public List<List<Integer>> fourSum(int[] nums, int target) {
        Arrays.sort(nums); // sorts the caller's array in place
        int n = nums.length;
        List<List<Integer>> result = new ArrayList<>();
        for (int a = 0; a < n - 3; a++) {
            if (a > 0 && nums[a] == nums[a - 1]) {
                continue; // first value already used as nums[a]
            }
            for (int b = a + 1; b < n - 2; b++) {
                if (b > a + 1 && nums[b] == nums[b - 1]) {
                    continue; // second value already used with this nums[a]
                }
                int left = b + 1;
                int right = n - 1;
                while (left < right) {
                    // long: four values of up to 10^9 in absolute value reach 4 * 10^9
                    long sum = (long) nums[a] + nums[b] + nums[left] + nums[right];
                    if (sum < target) {
                        left++;
                    } else if (sum > target) {
                        right--;
                    } else {
                        result.add(Arrays.asList(nums[a], nums[b], nums[left], nums[right]));
                        left++;
                        right--;
                        while (left < right && nums[left] == nums[left - 1]) {
                            left++;
                        }
                        while (left < right && nums[right] == nums[right + 1]) {
                            right--;
                        }
                    }
                }
            }
        }
        return result;
    }
}
```

The cast is on the first operand: `(long) nums[a] + nums[b] + …` widens before the first addition, and Java evaluates left to right, so every partial sum is a `long`. `(long) (nums[a] + nums[b] + nums[left] + nums[right])` would add in `int` first and widen the already-wrapped result.

#### Time complexity

**O(n³) in the worst case**, no hashing. At most n² / 2 choices of `(a, b)`, each with a scan in which every step moves a pointer inward, O(n) per scan. For n = 200 that is a few million steps. Sorting is O(n log n).

The output can be large: for fixed `(a, b)` the scan records at most about n / 2 pairs, so O(n³) quadruplets in total, and that order is reached. For `nums = [-100, -99, …, 99]` (n = 200) with target 0 there are 217,239 distinct quadruplets, and the tests check that case.

#### Space complexity

**O(1) auxiliary besides the sort and the output**: a few indices and a `long`. `Arrays.sort(int[])` is in place, with an O(log n) recursion stack in current JDK implementations (implementation behaviour, not an API promise). If the input must stay untouched, sorting a copy adds O(n).

### Alternative: recursive k-Sum

The loops of Approach 2 follow one rule per level: fix a value, skip equal neighbours, go one level down with a smaller k and a reduced target; when k reaches 2, run the two-pointer scan. Writing that as a recursion solves any k with the same code, at the cost of an O(k) recursion stack and a list of chosen values. Pick it when the interviewer asks for k-Sum or when you want to show the generalisation; for exactly four numbers, the two loops are easier to verify. Note that the reduced target must be a `long`: `target − nums[a] − nums[b]` reaches 10^9 + 2 · 10^9 = 3 · 10^9.

```java title="Alternative: recursive k-Sum"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Solution {
    public List<List<Integer>> fourSum(int[] nums, int target) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        kSum(nums, 4, 0, target, new ArrayList<>(), result);
        return result;
    }

    /** Appends to result every distinct k-tuple from nums[start..] that sums to target, prefixed by chosen. */
    private void kSum(int[] nums, int k, int start, long target, List<Integer> chosen, List<List<Integer>> result) {
        int n = nums.length;
        if (k == 2) {
            int left = start;
            int right = n - 1;
            while (left < right) {
                long sum = (long) nums[left] + nums[right];
                if (sum < target) {
                    left++;
                } else if (sum > target) {
                    right--;
                } else {
                    List<Integer> found = new ArrayList<>(chosen);
                    found.add(nums[left]);
                    found.add(nums[right]);
                    result.add(found);
                    left++;
                    right--;
                    while (left < right && nums[left] == nums[left - 1]) {
                        left++;
                    }
                    while (left < right && nums[right] == nums[right + 1]) {
                        right--;
                    }
                }
            }
            return;
        }
        for (int i = start; i <= n - k; i++) {
            if (i > start && nums[i] == nums[i - 1]) {
                continue; // same rule at every level: each value once per position
            }
            chosen.add(nums[i]);
            kSum(nums, k - 1, i + 1, target - nums[i], chosen, result); // long arithmetic
            chosen.remove(chosen.size() - 1);
        }
    }
}
```

The skip condition `i > start` is the general form of `b > a + 1`: at every level, the first candidate position is never skipped. Time O(n^(k − 1)) for k ≥ 2, here O(n³).

## 5. Comparison table

n = `nums.length`; q = number of distinct quadruplets in the answer. Output space is excluded.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Brute force + set | O(n⁴) | O(n⁴) for the loops; the set's hashing is O(1) expected per hit | O(q) for the set |
| 2. Two fixed values + two pointers | O(n³) | O(n³) | O(1) besides the sort (O(log n) stack in current JDKs) |
| Alt. Recursive k-Sum | O(n³), O(n^(k − 1)) in general | O(n³) | O(k) recursion stack and chosen list, besides the sort |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Brute force | Correct by inspection, since it checks every quadruple | 65 million quadruples at n = 200; set of lists | As the stated baseline and as a test reference |
| 2. Two loops + two pointers | Guaranteed O(n³), no extra memory, explicit rules per level | Three skip rules to get exactly right; modifies the input | The default answer for 4Sum |
| Alt. Recursive k-Sum | One piece of code for any k; one skip rule | Harder to trace; recursion and list copying | When k is a parameter or the interviewer asks to generalise |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2, with `long` sums, and a sentence on how it generalises to k.

**Is it optimal?** For listing the answer, O(n³) cannot be beaten in the worst case, because the output itself can contain Θ(n³) quadruplets (217,239 of them for the 200 consecutive values above). If the interviewer only wants to know whether one quadruplet exists, sorting all n² pair sums and running two pointers over them decides it in O(n² log n), with care so that the two pairs use four different positions; that does not help with listing all of them.

**What else is worth saying:** two prunes are valid and cheap. For a fixed `a`, if the smallest possible sum `nums[a] + nums[a + 1] + nums[a + 2] + nums[a + 3]` (in `long`) exceeds the target, break; if the largest, `nums[a] + nums[n − 3] + nums[n − 2] + nums[n − 1]`, is below it, continue. The same works for `b`. They do not change the worst case. The 3Sum prune "break when the first value is positive" is **not** valid here.

**When to stop:** once the code uses `long`, the skip rules are justified, and you have traced the overflow input. That is a complete answer.

## 7. Interview script: code it and test it

### What I say while coding

> "Sort in place, which you said is fine."

> "Outer loop to `n − 4` inclusive, so that three positions remain; the second loop to `n − 3`. With fewer than four elements neither loop runs and I return an empty list, no special case."

> "Skip rules: `a > 0` at the first level, `b > a + 1` at the second. The second one is relative to `a`, because the first candidate for `b` must always be tried."

> "The sum: cast the first operand to `long` so every addition happens in 64 bits."

> "After a hit, the same two skip loops as in 3Sum, both guarded by `left < right`."

### Testing out loud

**Normal case:** Example 1 as in the dry run: two quadruplets.

**All equal:** `[3, 3, 3, 3, 3]`, target 12. `a = 0`, `b = 1`, `left = 2`, `right = 4`: sum 12, record; `left = 3`, `right = 3`, stop. `b = 2` equals `nums[1]` with `b > a + 1`: skip. `a = 1` equals `nums[0]`: skip. One quadruplet.

**Repeated value across levels:** `[-2, -2, -2, 2, 2, 2]`, target 0. `a = 0` (-2), `b = 1` (-2): `b == a + 1`, so not skipped. Scan `[2, 5]`: -2 + 2 = 0 at once, record `[-2, -2, 2, 2]`, then the skip loops close the window. Later `b` and `a` values repeat and are skipped. If the second-level rule were written `b > 0`, `b = 1` would be skipped because it equals `nums[0]`, and the result would be `[]`; I ran that variant to confirm.

**Too short:** `[1]` or `[1, 2, 3]`: the outer loop condition `a < n − 3` is false at once. `[]`.

**Overflow, false match:** `[10^9, 10^9, 10^9, 10^9]`, target -294,967,296: traced above, `[]` with `long`.

**Overflow, missed match:** `[-10^9, -10^9, -10^9, 5 · 10^8, 5 · 10^8]`, target -10^9. With `a = 0`, `b = 1`, `left = 2`, `right = 4`, the true sum is -2.5 · 10^9, below the target, so `left` moves to 3 and the next sum, -10^9, is recorded. In `int`, -2.5 · 10^9 wraps to 1,794,967,296, which looks too big, so `right` moves instead, the window closes, and the real answer is lost; the `int` version returns `[]`.

**Negative target below every value:** `[-5, -4, -3, -2]`, target -14: one scan step, sum -14, recorded.

## 8. Time plan for the interview

Often asked as a follow-up to 3Sum, in which case the interviewer wants the extension, the overflow and the generalisation in about 15 minutes; on its own, 25.

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2 min | Short arrays, sorting in place, and the overflow bound computed out loud |
| Brute force | 1 min | n choose 4 and the set |
| Reduce to 3Sum / Two Sum II | 2 min | Two fixed values plus a scan; which 3Sum shortcut does not carry over |
| Skip rules | 2–3 min | Three levels, and why the second is relative to `a` |
| Code | 5–6 min | Two loops, one scan, `long` |
| Test | 4–5 min | Example 1, all equal, `[-2, -2, -2, 2, 2, 2]`, the two overflow inputs |
| Generalise | 2+ min | k-Sum and O(n^(k − 1)) |

**Where the time should go:** the overflow bound and the second-level skip rule. Those are what separate this from a copy of 3Sum.

**If stuck:** code the brute force with `long` and a set; it runs at n = 200. Then replace the two innermost loops with a two-pointer scan, keeping the set, and finally replace the set with skip rules.

## 9. Interviewer challenges

### About arithmetic

#### Why `long`? Show me an input that breaks `int`.

**What they are testing:** whether you computed the bound or just know "use long".

**How to reason:** take the largest values allowed and add them, then compare with 2^31 − 1.

**What I say:** "Four values of 10^9 add up to 4 · 10^9, almost twice the `int` maximum of about 2.147 · 10^9. In `int` arithmetic, 4 · 10^9 wraps to 4 · 10^9 − 2^32 = −294,967,296. So with four 10^9s and that target, the `int` version reports a quadruplet that doesn't exist. Wrapping can also flip a comparison: with three −10^9s and two 5 · 10^8s and target −10^9, a true sum of −2.5 · 10^9 wraps to a large positive number, I move the wrong pointer, and the real answer is missed."

**Nuance:** two values never overflow here (2 · 10^9 < 2^31 − 1), which is why Two Sum II and 3Sum did not need this. The remaining target in the recursive version, `target − nums[a] − nums[b]`, can reach 3 · 10^9, so it needs `long` too.

#### Where exactly does the cast go?

**What they are testing:** knowledge of Java's evaluation order and promotion rules.

**How to reason:** an operation is done in `long` only if one of its operands is a `long` when that operation runs.

**What I say:** "`(long) nums[a] + nums[b] + nums[left] + nums[right]`: the cast applies to the first operand, the first addition is therefore in `long`, and left-to-right evaluation keeps every later addition in `long`. Writing `(long) (nums[a] + … )` casts after the overflow has happened. `nums[a] + nums[b] + (long) nums[left] + …` would add the first two in `int`, which happens to fit here, but it's fragile."

**Nuance:** `Math.addExact` throws on `int` overflow, which is a useful way to find such bugs in testing, but the fix is still `long`.

### About duplicates

#### Why is the second-level rule `b > a + 1` and not `b > 0`?

**What they are testing:** whether you understand what the skip rule protects.

**How to reason:** the rule skips a value that this level has already tried. "Already tried at this level" means since `a + 1`, not since index 0.

**What I say:** "For a fixed `a`, the first position `a + 1` has never been tried as a second value, even if it equals `nums[a]`. `b > 0` would skip it whenever it equals `nums[a]`, which loses every quadruplet whose two smallest values are equal: `[-2, -2, -2, 2, 2, 2]` with target 0 returns `[]` instead of `[[-2, -2, 2, 2]]`."

**Nuance:** in the recursive version, `i > start` is the same rule at every level.

#### Can you reuse 3Sum's early break?

**What they are testing:** whether you know why a shortcut was valid, not just that it was.

**How to reason:** 3Sum broke when the smallest value was positive because the target was 0. Restate that condition for a general target.

**What I say:** "Not as written. 3Sum's 'break when the anchor is positive' used target 0. The tempting translation, 'break when `nums[a] > target`', is wrong when the target is negative: `[-5, -4, -3, -2]` with target -14 has `-5 > -14` at once, breaks, and returns nothing, although the four values sum to -14. The correct version compares the smallest possible sum, `nums[a] + nums[a + 1] + nums[a + 2] + nums[a + 3]`, with the target, in `long`."

**Nuance:** these prunes help in practice but do not change the O(n³) worst case.

### About complexity

#### Can you do better than O(n³)?

**What they are testing:** knowing where the bound comes from.

**How to reason:** look at the output size, then at what a cheaper method could still do.

**What I say:** "Not for listing all quadruplets in the worst case: the answer can have Θ(n³) entries, for example 217,239 for the 200 consecutive integers from -100 to 99 with target 0. If you only need to know whether one exists, I'd sort the n² pair sums and use two pointers over them, which is O(n² log n), with a check that the two pairs don't share a position."

**Nuance:** the meet-in-the-middle idea becomes awkward for listing distinct value sets, because a single quadruplet can be split into pairs in several ways and positions must not overlap.

## 10. Follow-up questions the interviewer might ask

**"Generalise to k numbers."**
The recursive version above: fix a value with the skip rule `i > start`, recurse with k − 1 and a `long` remaining target, and finish at k = 2 with two pointers. O(n^(k − 1)) time for k ≥ 2, O(k) recursion depth. For k = 1, it is a simple scan (not needed here).

**"Count the quadruplets of positions instead of listing distinct value sets."**
The skip rules no longer apply, since equal values at different positions count separately. Keep a map from pair sum to the number of position pairs `(a, b)` stored so far. For each third position `c`: for every `d > c`, add the map's count for `target − nums[c] − nums[d]`; then store every pair `(b, c)` with `b < c`. Every stored pair ends before `c`, so the four positions are distinct and each quadruple is counted once. O(n²) expected time and O(n²) space, with `long` keys and a `long` count.

**"Four separate arrays, one value from each, count the combinations that sum to 0."**
Store all sums of the first two arrays in a hash map with counts, then for each sum of the last two look up its negation. O(n²) expected time and space. The arrays being separate removes the different-positions issue.

**"What if the input must not be modified?"**
Sort a copy: O(n) extra memory, nothing else changes.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Assuming `int` is enough because it was in 3Sum.** The bound changed: values up to 10^9 and four of them. Compute the bound from the constraints every time.
- **Copying 3Sum's "break when positive".** It depended on target 0.
- **Thinking the brute force is out of reach.** At n = 200 it is about 6.5 · 10^7 quadruples: slow but runnable, and useful as a test reference.

### Implementation mistakes

> [!MISTAKE] Summing in `int`
> `int sum = nums[a] + nums[b] + nums[left] + nums[right];` returns `[[1000000000, 1000000000, 1000000000, 1000000000]]` for four 10^9s with target -294,967,296, and `[]` instead of `[[-1000000000, -1000000000, 500000000, 500000000]]` for `[-10^9, -10^9, -10^9, 5 · 10^8, 5 · 10^8]` with target -10^9.

> [!MISTAKE] Second-level skip measured from 0
> `if (b > 0 && nums[b] == nums[b - 1]) continue;` returns `[]` for `[-2, -2, -2, 2, 2, 2]` with target 0. Use `b > a + 1`.

> [!MISTAKE] Breaking when `nums[a] > target`
> Returns `[]` for `[-5, -4, -3, -2]` with target -14.

- **Casting after the addition.** `(long) (x + y + z + w)` widens a value that has already wrapped.
- **No skip after a hit.** The same mistake as in 3Sum: runs of equal values in the scan produce the same quadruplet more than once.

## 12. Pattern recognition

**The pattern:** k-Sum by reduction. Sort, fix the smallest k − 2 values in nested loops (or recursion) that skip equal neighbours, and finish with a two-pointer pair scan. Each fixed level costs a factor of n.

**Signals in the problem statement:**

- "All unique quadruplets" (or k-tuples) with a given sum.
- n in the low hundreds, which allows n³ but not n⁴ comfortably.
- Values close to the 32-bit limit: a sign that sums need `long`.

**Related problems in this list:**

- [[nc-3sum|3Sum]]: one fixed value plus the scan; the duplicate rules and their proof come from there.
- [[nc-two-sum-ii-input-array-is-sorted|Two Sum II - Input Array Is Sorted]]: the pair scan at the bottom of every k-Sum.
- [[nc-two-sum|Two Sum]]: the hash-based pair search, which is what the counting follow-ups use.
- [[cses-sum-of-four-values|Sum of Four Values]] (CSES): find one quadruplet with given positions, where pair sums and hashing are the usual route.
- [[nc-container-with-most-water|Container With Most Water]]: the same discard-an-end reasoning in a different objective.

**Takeaway:** for k-Sum, add one sorted, duplicate-skipping loop per extra value on top of Two Sum II, use `long` as soon as k values can exceed 32 bits, and re-check every shortcut that depended on the target.

## 13. 60-second revision card

**Key insight:** fix the two smallest values, then the other two are a Two Sum II scan for `target − nums[a] − nums[b]`. One skip rule per level removes duplicates.

**Rules:** first level `a > 0 && nums[a] == nums[a − 1]`; second level `b > a + 1 && nums[b] == nums[b − 1]`; after a hit, move both pointers past copies. Sum in `long`. No "break when positive".

**Complexity:** O(n³) worst-case time; O(1) auxiliary besides the sort (O(log n) stack in current JDKs) and the output, which can be Θ(n³). k-Sum: O(n^(k − 1)).

**Code skeleton:**

```java title="4Sum core loops" fragment="public List<List<Integer>> fourSum(int[] nums, int target)"
Arrays.sort(nums);
int n = nums.length;
List<List<Integer>> res = new ArrayList<>();
for (int a = 0; a < n - 3; a++) {
    if (a > 0 && nums[a] == nums[a - 1]) continue;
    for (int b = a + 1; b < n - 2; b++) {
        if (b > a + 1 && nums[b] == nums[b - 1]) continue;
        int l = b + 1, r = n - 1;
        while (l < r) {
            long s = (long) nums[a] + nums[b] + nums[l] + nums[r];
            if (s < target) l++;
            else if (s > target) r--;
            else {
                res.add(Arrays.asList(nums[a], nums[b], nums[l++], nums[r--]));
                while (l < r && nums[l] == nums[l - 1]) l++;
                while (l < r && nums[r] == nums[r + 1]) r--;
            }
        }
    }
}
return res;
```

**Main traps:**

- Four values reach 4 · 10^9: `int` wraps; cast the first operand to `long`.
- Second-level skip is `b > a + 1`, not `b > 0`.
- "Break when `nums[a] > target`" fails for negative targets.

**What to say in one breath:** "Sort, fix the first two values with loops that skip repeated values, and find the last two with two pointers, skipping copies after each hit. Sums go in `long`, because four values of 10^9 overflow an `int`. That's O(n³), optimal for listing since the answer can be cubic, with O(1) extra space besides the sort; adding a loop per value gives k-Sum in O(n^(k − 1))."
