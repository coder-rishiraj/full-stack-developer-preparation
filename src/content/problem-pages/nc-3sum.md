---
problemId: nc-3sum
title: 3Sum
source: neetcode
sourceUrl: https://leetcode.com/problems/3sum/
difficulty: medium
patterns: [two-pointers, sorting]
relatedLessons: [a2-two-pointers, a2-sorting-based, a2-hashing, a14-edge-cases, a14-deriving-optimization]
companies: []
timeToSolve: 25
---

## 1. Problem restatement

You get an array of integers. Find every group of three values, taken from three different positions, that adds up to zero. Return each such group once: two groups that contain the same three values count as the same group, even if they come from different positions. The groups, and the values inside each group, may be returned in any order.

**Example 1**

- Input: `nums = [0, -1, 2, -3, 1, -1]`
- Output: `[[-3, 1, 2], [-1, -1, 2], [-1, 0, 1]]`
- Why: these are the only three value combinations that sum to zero. `[-1, 0, 1]` can be built from two different positions of `-1`, but it is reported once. `[-1, -1, 2]` uses both `-1`s, which is allowed because they sit at different positions.

**Example 2**

- Input: `nums = [0, 0, 0, 0]`
- Output: `[[0, 0, 0]]`
- Why: four choices of three positions, all giving the same values, so one group.

**Example 3**

- Input: `nums = [3, -1, 5]`
- Output: `[]`
- Why: the only possible group sums to 7.

**What the problem statement guarantees**

- The three positions must be different; values may repeat.
- The answer must not contain duplicate triplets; any order is accepted.
- `3 <= nums.length <= 3000` and `-10^5 <= nums[i] <= 10^5`.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 25 minutes and talk out loud.
2. Restate the problem and write down what "no duplicate triplets" means on `[0, 0, 0, 0]` and on Example 1.
3. Say the brute force and its cost, including how it would avoid duplicates.
4. Fix one of the three numbers. What problem is left, and have you solved it before?
5. Decide how you will avoid duplicates **without** a set of results, then code it and trace it on Example 1.

Open a hint only after two minutes without progress.

> [!HINT] Hint 1: a small nudge
> If you decide which value is the smallest of the three, what must the other two add up to?

> [!HINT] Hint 2: the kind of tool you need
> Putting the array in order does two jobs at once: equal values become neighbours, which makes repeats easy to spot, and the remaining pair search can use the ends of a sorted range.

> [!HINT] Hint 3: almost the whole plan
> Order the array. For each position, if its value equals the previous position's value, skip it; otherwise look for pairs to its right that sum to minus that value, using one index from the left and one from the right of that range. After you record a pair, move both indices past every copy of the values you just used. Check why "equal to the previous" works and "equal to the next" does not, using `[-1, -1, 2]`.

**Check yourself before revealing the walkthrough**

- [ ] I can say why the brute force needs a set and what it costs
- [ ] My code returns each triplet once for `[0, 0, 0, 0]` and for `[-2, 0, 0, 2, 2]`
- [ ] My code still finds `[-1, -1, 2]` in `[-1, -1, 2]`
- [ ] I can argue that my duplicate-skipping never throws away a triplet that has not been reported yet

## 3. Interview script: understand the problem (≈3 min)

The heart of this problem is not finding triplets; it is finding each one exactly once. So the questions are about what "duplicate" means and whether I may reorder the input.

**Me:** I return all triplets of values from three different positions that sum to zero, each set of values once. So for `[0, 0, 0, 0]` the answer is a single `[0, 0, 0]`?

**Interviewer:** Right. Duplicates are about values, not positions.

**Me:** And a triplet may repeat a value if it occurs at two positions, like `[-1, -1, 2]` when there are two -1s?

**Interviewer:** Yes.

**Me:** Does the order matter, of the triplets or inside each one?

**Interviewer:** No, any order.

**Me:** The sizes: up to 3000 elements, values up to 10^5 in absolute value. Three values sum to at most 3 · 10^5 in absolute value, so `int` is safe. And n³ would be about 4.5 · 10^9 triples, which is too slow; n² is about 9 · 10^6, which is fine. So I'm aiming for quadratic.

**Interviewer:** That's reasonable.

**Me:** I'd like to sort the array. May I sort it in place, or should I leave the caller's array as it is?

**Interviewer:** Sorting in place is fine.

**Me:** Good. If it weren't, I'd sort a copy for O(n) extra memory. Let me try Example 1 by hand. Sorted: -3, -1, -1, 0, 1, 2. Smallest -3 needs a pair summing to 3 from the rest: 1 and 2. Smallest -1 needs 1: -1 with 2, and 0 with 1. The second -1 as the smallest would find 0 and 1 again, a duplicate. 0 as the smallest needs 0 from `[1, 2]`: nothing. So three triplets, and I already see where duplicates come from.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| Three different positions; values may repeat | `[-1, -1, 2]` is legal when -1 occurs twice. Skipping repeated values must not lose it. |
| No duplicate triplets | Equal value sets must be reported once. This drives most of the design. |
| Any order | I can return triplets in sorted order, which is what sorting produces anyway. |
| 3 ≤ n ≤ 3000 | O(n³) is about 4.5 · 10^9 triples, too slow; O(n²) is about 9 · 10^6 pair steps. |
| \|nums[i]\| ≤ 10^5 | Sums fit in an `int` (at most 3 · 10^5). Negatives, zero and positives all occur. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Duplicates are judged by values, not positions | Two position triples with the same values must produce one output entry. |
| Sorting `nums` in place is allowed | No O(n) copy needed; the auxiliary space can stay small. Otherwise I sort a copy. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| Each triplet is returned in ascending order | Not required, but it falls out of sorting and makes duplicates easy to reason about. |
| The output is not counted as auxiliary space | It can hold on the order of n² triplets (see section 4); I report it separately. |

### Edge cases I will keep in mind

- All zeros: `[0, 0, 0, 0]` gives one triplet, and n = 3000 zeros gives one triplet too.
- No answer: all positive `[1, 2, 3]`, all negative `[-3, -2, -1]`, or `[3, -1, 5]`.
- A triplet that repeats a value: `[-1, -1, 2]`, `[-4, 2, 2]`.
- Long runs of duplicates on either side: `[-4, 2, 2, 2, 2]`, `[-2, 0, 0, 2, 2]`.
- The smallest input, n = 3.

## 4. Think out loud: from first idea to best solution

> "Three nested loops would find everything, so correctness isn't the hard part. The two problems are speed and duplicates. Let me start with the brute force to see how it handles duplicates, then fix the speed."

### Baseline: every triple, deduplicated with a set (described, not coded)

> "Every triple of positions `i < j < k`; if the sum is zero, sort the three values and put them in a set of lists, so equal value sets collapse into one. Return the set as a list."

That is correct by inspection: it checks every triple of positions, and the set removes repeated value sets. It costs n(n − 1)(n − 2) / 6 checks, about 4.5 · 10^9 for n = 3000, plus hashing each hit. On `[0, 0, …, 0]` every triple is a hit, so the set receives billions of insertions. I say this baseline and its cost in one breath and do not code it; it is too slow for the stated limits.

> "The inner two loops are a pair search: once `nums[i]` is fixed, I'm looking for two numbers that sum to `-nums[i]`. That's Two Sum. I know how to do Two Sum in linear time, so fixing one number and solving Two Sum on the rest should give n². The duplicates are the open question."

### Approach 1: Sort, then a Two Sum hash set for each anchor

#### What I say out loud

> "I'll call the fixed number the anchor. For each anchor I run the one-pass Two Sum from before on the part to its right, with target `-nums[i]`, keeping a set of values I've passed. That finds pairs in expected linear time per anchor."

> "Now duplicates. Two Sum gives me pairs of positions, and different positions can carry the same values. I could throw every triplet into a set, but if I sort the array first, equal values become neighbours, and I can avoid generating repeats at all. Two rules: an anchor value I've already used, I skip. And within one anchor, once a value at `j` has produced a triplet, later copies of that same value would produce the same triplet, so I skip past them."

> "Sorting also gives me a free early exit: the anchor is the smallest of the three, so once the anchor is positive, no sum can be zero."

#### Intuition

Fixing the smallest element turns 3Sum into Two Sum with target `-anchor`, which the complement lookup from [[nc-two-sum|Two Sum]] solves in one pass. Sorting puts equal values side by side, so "have I already produced this triplet?" becomes "is this value equal to its neighbour?", with no set of results needed.

#### Algorithm

1. Sort `nums`.
2. For each `i` from 0 to n − 3:
   - If `nums[i] > 0`, stop.
   - If `i > 0` and `nums[i] == nums[i − 1]`, skip this anchor.
   - Create an empty set `seen`. For each `j` from `i + 1` to n − 1:
     - `need = -nums[i] - nums[j]`.
     - If `seen` contains `need`: record `[nums[i], need, nums[j]]`, then advance `j` past every following copy of `nums[j]`.
     - Add `nums[j]` to `seen`.

#### Why it is correct

- **Only valid triplets.** `need` was seen at a position between `i` and `j`, so the three positions differ, and `nums[i] + need + nums[j] = 0` by construction.
- **No triplet twice.** The anchor is the smallest value of its triplet (everything to its right is at least as large), and each anchor value is processed once, so triplets from different anchors differ in their smallest value. Within one anchor, the triplet is fixed by `nums[j]` (the third value is then determined), and after a hit every later copy of that `nums[j]` is skipped.
- **No triplet missed.** Take a zero-sum value set `a ≤ b ≤ c` that the array can supply. Then `a ≤ 0`, so the early exit does not stop before it. Let `i` be the first position holding `a`; it is not skipped. To its right there are positions holding `b` and `c` (if `b` equals `a`, the second copy of `a` is to the right of the first). Scan `j` up to the first position after `i` where `c` occurs with `b` already in `seen`; that is the first copy of `c` if `b < c`, or the second copy if `b == c`. The skip rule only jumps over copies of a value that has already produced its triplet, so it cannot jump over that position before the triplet is recorded.

#### Dry run

`nums = [0, -1, 2, -3, 1, -1]`, sorted to `[-3, -1, -1, 0, 1, 2]` (indices 0 to 5).

| i (anchor) | j (value) | need | `seen` before the check | Result |
|---|---|---|---|---|
| 0 (-3) | 1 (-1) | 4 | {} | no |
| 0 (-3) | 2 (-1) | 4 | {-1} | no |
| 0 (-3) | 3 (0) | 3 | {-1} | no |
| 0 (-3) | 4 (1) | 2 | {-1, 0} | no |
| 0 (-3) | 5 (2) | 1 | {-1, 0, 1} | hit `[-3, 1, 2]` |
| 1 (-1) | 2 (-1) | 2 | {} | no |
| 1 (-1) | 3 (0) | 1 | {-1} | no |
| 1 (-1) | 4 (1) | 0 | {-1, 0} | hit `[-1, 0, 1]` |
| 1 (-1) | 5 (2) | -1 | {-1, 0, 1} | hit `[-1, -1, 2]` |
| 2 (-1) | | | | same value as `nums[1]`, skip |
| 3 (0) | 4 (1) | -1 | {} | no |
| 3 (0) | 5 (2) | -2 | {1} | no |

Result: `[[-3, 1, 2], [-1, 0, 1], [-1, -1, 2]]`. Skipping anchor 2 is what prevents a second `[-1, 0, 1]`.

#### Java code

```java title="Approach 1: sort + hash set per anchor"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums); // sorts the caller's array in place
        int n = nums.length;
        List<List<Integer>> result = new ArrayList<>();
        for (int i = 0; i < n - 2; i++) {
            if (nums[i] > 0) {
                break; // every later value is positive too, so no sum can be 0
            }
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue; // this anchor value was already handled
            }
            Set<Integer> seen = new HashSet<>(); // values at indices i+1 .. j-1
            for (int j = i + 1; j < n; j++) {
                int need = -nums[i] - nums[j];
                if (seen.contains(need)) {
                    result.add(Arrays.asList(nums[i], need, nums[j]));
                    while (j + 1 < n && nums[j + 1] == nums[j]) {
                        j++; // the same nums[j] would rebuild the same triplet
                    }
                }
                seen.add(nums[j]);
            }
        }
        return result;
    }
}
```

#### Time complexity

**O(n²) expected.** Sorting is O(n log n). There are at most n − 2 anchors, each scanning at most n − 1 positions with one `contains` and one `add`, each O(1) on average when hash codes spread well. The worst case for hash tables in general is O(n) per operation, so O(n³) overall; with current Java tree buckets and `Integer` keys a collided bucket costs about O(log n), but that is implementation behaviour, not an API guarantee.

#### Space complexity

**O(n) auxiliary** for `seen` (rebuilt for each anchor, at most n entries at a time), plus the sort's own space (below). The output is not counted.

#### The bridge to the next approach

> "This is quadratic in expectation, and the duplicate rules are clean. But look at what the hash set is doing: it's Two Sum on a range that is already sorted. I solved exactly that in Two Sum II with two pointers and no memory at all. So I can drop the set, get a worst-case guarantee instead of an expected one, and use O(1) extra space."

> "The duplicate rules need a small change. With two pointers I find a pair from both ends at once, so after a hit I have to move both pointers past the values I just used. Let me make sure that doesn't lose anything."

### Approach 2: Sort, then two pointers for each anchor (recommended)

#### What I say out loud

> "Sort. For each anchor `i`, skipping repeated anchor values and stopping once the anchor is positive, I run two pointers on `[i + 1, n − 1]` looking for the sum `-nums[i]`. Too small, move left up; too big, move right down. On a hit, I record it, then move left forward past every copy of its value and right backward past every copy of its value."

> "Two duplicate rules, and I want to say why each is safe. Rule one: an anchor equal to the previous anchor can only find triplets the previous one already found, because the previous one's range contains this one's range. Rule two: after a hit with values x and y, the only partner for x is y, so any other copy of x or y can only rebuild the same triplet. So both rules only discard repeats."

#### Intuition

For each anchor, the rest is [[nc-two-sum-ii-input-array-is-sorted|Two Sum II]] on a sorted range, but with possibly several answers. The [[a2-two-pointers|two-pointer]] scan finds all of them if it keeps going after each hit. Sorting makes all repeats adjacent, so skipping equal neighbours (at the anchor level and at both pointers) removes every duplicate without a set.

#### Algorithm

1. Sort `nums`.
2. For each `i` from 0 to n − 3:
   - If `nums[i] > 0`, stop: the anchor is the smallest of the three.
   - **Rule 1:** if `i > 0` and `nums[i] == nums[i − 1]`, skip this anchor.
   - `left = i + 1`, `right = n − 1`. While `left < right`:
     - `sum = nums[i] + nums[left] + nums[right]`.
     - `sum < 0`: `left++`. `sum > 0`: `right--`.
     - `sum == 0`: record the triplet; `left++`, `right--`; **rule 2:** while `left < right` and `nums[left] == nums[left − 1]`, `left++`; while `left < right` and `nums[right] == nums[right + 1]`, `right--`.

#### Why it is correct

Call `T = -nums[i]` the pair target for one anchor.

**Within one anchor, the scan reports every value pair `(x, y)` with `x ≤ y`, `x + y = T`, from the range `[i + 1, n − 1]`, exactly once.** The invariant: *every such pair not yet reported still has positions holding x and y inside `[left, right]`.*

- A miss with the sum too small removes `left`. Its largest possible partner, `nums[right]`, was not enough, and the array is sorted, so `nums[left]` pairs with nothing in the window. Too big removes `right` by the mirror argument. This is the Two Sum II argument.
- A hit with values `x = nums[left]` and `y = nums[right]` is recorded. Now every position rule 2 removes holds `x` (on the left) or `y` (on the right). A copy of `x` can only pair with `T − x = y`, and a copy of `y` only with `x`: both make the pair just recorded. So removing them loses no unreported pair.
- Each hit is followed by a move of `left` to a strictly larger value, so the left values of recorded pairs strictly increase. No pair is recorded twice.

**Across anchors (rule 1).** If `nums[i] == nums[i − 1]`, the earlier anchor scanned `[i, n − 1]`, which contains this anchor's range `[i + 1, n − 1]`. Every pair this anchor could find, the earlier one already found, so skipping it loses nothing and avoids repeats. It must compare with the previous position, not the next: the earlier copy is the one whose range includes the later copy, which is how `[-1, -1, 2]` gets found.

**No duplicates overall.** The anchor is the smallest value of its triplet, and each anchor value is processed once, so triplets from different anchors differ in their first value; within an anchor, pairs are distinct.

**Nothing missed.** A zero-sum value set `a ≤ b ≤ c` has `a ≤ 0`, so the loop has not stopped before the first position holding `a`, which is not skipped; its range contains positions for `b` and `c`, and the invariant says the scan reports `(b, c)`.

**The 30-second version to say to the interviewer:**

> "The anchor is the smallest of the three, so a positive anchor ends the search. For each anchor, two pointers find every pair summing to minus the anchor: a miss discards an element that has no partner left, and after a hit, the copies I skip can only rebuild the same triplet, because x's only partner is y. I skip an anchor equal to the previous one because the previous one's range contained this one's, so it already found everything. Each anchor value is used once and each pair once, so there are no duplicates and nothing is lost."

#### Dry run

`nums = [0, -1, 2, -3, 1, -1]`, sorted to `[-3, -1, -1, 0, 1, 2]`.

| i (anchor) | left (value) | right (value) | Sum | Action |
|---|---|---|---|---|
| 0 (-3) | 1 (-1) | 5 (2) | -2 | too small, `left++` |
| 0 (-3) | 2 (-1) | 5 (2) | -2 | too small, `left++` |
| 0 (-3) | 3 (0) | 5 (2) | -1 | too small, `left++` |
| 0 (-3) | 4 (1) | 5 (2) | 0 | record `[-3, 1, 2]`; now `left = 5`, `right = 4`, stop |
| 1 (-1) | 2 (-1) | 5 (2) | 0 | record `[-1, -1, 2]`; now `left = 3`, `right = 4` (no copies to skip) |
| 1 (-1) | 3 (0) | 4 (1) | 0 | record `[-1, 0, 1]`; now `left = 4`, `right = 3`, stop |
| 2 (-1) | | | | rule 1: equals `nums[1]`, skip |
| 3 (0) | 4 (1) | 5 (2) | 3 | too big, `right--`; `left == right`, stop |

Result: `[[-3, 1, 2], [-1, -1, 2], [-1, 0, 1]]`.

Rule 2 doing real work, `nums = [-2, 0, 0, 2, 2]`: anchor -2 hits with `left = 1` (0) and `right = 4` (2). After `left++` and `right--` both pointers sit on copies (`left = 2` holds 0, `right = 3` holds 2); the first skip loop moves `left` to 3, where `left < right` fails. Without rule 2 the scan would record `[-2, 0, 2]` a second time.

#### Java code

```java title="Approach 2: sort + two pointers (recommended)"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums); // sorts the caller's array in place
        int n = nums.length;
        List<List<Integer>> result = new ArrayList<>();
        for (int i = 0; i < n - 2; i++) {
            if (nums[i] > 0) {
                break; // smallest remaining value is positive: no sum can be 0
            }
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue; // rule 1: each anchor value once
            }
            int left = i + 1;
            int right = n - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum < 0) {
                    left++;
                } else if (sum > 0) {
                    right--;
                } else {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    left++;
                    right--;
                    // rule 2: after a hit, move both pointers past the values just used
                    while (left < right && nums[left] == nums[left - 1]) {
                        left++;
                    }
                    while (left < right && nums[right] == nums[right + 1]) {
                        right--;
                    }
                }
            }
        }
        return result;
    }
}
```

#### Time complexity

**O(n²) in the worst case**, with no hashing. Sorting is O(n log n). For each of at most n − 2 anchors, every step of the scan, including each step of the skip loops, moves `left` right or `right` left, and they start at most n − 2 apart, so a scan is O(n). Recording a triplet is O(1) amortized (`ArrayList` growth), and there is at most one per scan step, so the output does not change the bound.

How large can the output be? Within one anchor the pairs have strictly increasing left values, so at most about n / 2 per anchor, and O(n²) in total. That bound is reached: for `nums = [-1499, -1498, …, 1500]` (n = 3000, all values in range), there are 1,124,250 distinct triplets, which the tests check. The running time is O(n²) whatever the output size.

#### Space complexity

**O(1) auxiliary besides the sort and the output.** The scan uses a few indices. `Arrays.sort(int[])` sorts in place; in current JDKs it is a dual-pivot quicksort whose recursion uses O(log n) stack, which is how the implementation behaves rather than an API promise. The output can hold Θ(n²) triplets in the worst case, as above, and is not counted. If the input must stay untouched, sorting a copy adds O(n).

## 5. Comparison table

n = `nums.length`. Output space is excluded throughout.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Baseline: every triple + set | O(n³) | O(n³) | O(number of distinct triplets) for the set, up to O(n²) |
| 1. Sort + hash set per anchor | O(n²) | O(n³) in general for hash tables; about O(n² log n) with current Java tree buckets (not an API guarantee) | O(n) |
| 2. Sort + two pointers | O(n²) | O(n²) | O(1) besides the sort (O(log n) stack in current JDKs); O(n) more if the input must not be modified |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Baseline | Correct by inspection, since it checks every triple | 4.5 · 10^9 checks at n = 3000; dedupe needs a set | Only as the opening sentence |
| 1. Hash set per anchor | Direct reuse of Two Sum; easy to derive | Expected rather than guaranteed time; O(n) memory; boxing | If you derive it first, say it, then improve |
| 2. Two pointers | Guaranteed O(n²), O(1) extra, dedupe without hashing | Duplicate rules must be exact; modifies the input | The default answer |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** sort plus two pointers (Approach 2).

**Is it optimal?** For this problem as stated, yes in the worst case: the output alone can contain Θ(n²) triplets (the consecutive-values input above has over a million at n = 3000), so any algorithm that lists them needs Ω(n²) time on such inputs. Even the yes/no version ("does any triplet sum to zero?") has no known O(n^(2 − ε)) algorithm; the widely believed 3SUM conjecture says none exists, and the known theoretical improvements shave only sub-logarithmic or polylogarithmic factors. Do not try to beat n² in an interview.

**Why this answer and not the hash version?** Both are O(n²) in expectation, but two pointers give the bound in the worst case, use no extra memory, avoid boxing, and handle duplicates with the same "skip equal neighbours" idea at both levels.

**When something else is better:** if the input must not be reordered and memory is tight, you still sort a copy; there is no practical O(1)-space alternative. If the values lie in a small range (here 2 · 10^5 + 1 possible values), counting occurrences and iterating over pairs of distinct values is another O(d²) option for d distinct values, useful when there are many duplicates.

**When to stop:** once the two-pointer version is coded, traced on a duplicate-heavy input, and you have said why the skip rules lose nothing. Micro-optimizations (also breaking when `nums[i] + nums[i + 1] + nums[i + 2] > 0`, or skipping anchors with `nums[i] + nums[n − 2] + nums[n − 1] < 0`) are worth a sentence, not a rewrite.

## 7. Interview script: code it and test it

### What I say while coding

> "Sort first. I'm allowed to sort in place, so no copy."

> "Outer loop up to `n − 3`, because I need two more positions to the right. Positive anchor: break, not continue, because everything after it is positive too."

> "Rule 1 compares with the previous element. If I compared with the next, I'd skip the first -1 in `[-1, -1, 2]`, and the second -1 would no longer see the first."

> "The inner loop is Two Sum II. On a hit I record, step both pointers, then skip copies. Every skip loop keeps `left < right` in its condition, so it can't run off the array."

### Testing out loud

**Normal case:** Example 1, traced in the dry run. Three triplets, and anchor index 2 is skipped by rule 1.

**All zeros:** `[0, 0, 0, 0]`. Anchor 0: `left = 1`, `right = 3`, sum 0, record `[0, 0, 0]`; step to `left = 2`, `right = 2`, and the skip loops stop at once because `left < right` fails. Anchor 1 equals anchor 0 and is skipped, and it is the last anchor (`i < n − 2 = 2`). One triplet.

**Run of duplicates:** `[-4, 2, 2, 2, 2]`. Anchor -4: `left = 1`, `right = 4`, sum 0, record `[-4, 2, 2]`; step to `left = 2`, `right = 3`; the left skip moves `left` to 3 and stops. One triplet, no repeats.

**Rule 2 at work:** `[-2, 0, 0, 2, 2]` as traced above: one `[-2, 0, 2]`. Then anchor 0 (index 1) sees sums 2 and 2 and moves `right` down until the pointers meet; anchor index 2 is skipped by rule 1.

**No answer:** `[1, 2, 3]`: the first anchor is positive, break immediately, return `[]`. `[3, -1, 5]` sorts to `[-1, 3, 5]`: anchor -1, sum 7, `right--`, pointers meet; that was the only anchor (`i < n − 2 = 1`). `[]`.

**Repeated value in the triplet:** `[-1, -1, 2]`: anchor index 0, `left = 1`, `right = 2`, sum 0, record `[-1, -1, 2]`.

## 8. Time plan for the interview

3Sum usually gets 25–30 minutes, and the time goes into duplicates, not into finding triplets.

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2–3 min | What a duplicate is, sorting in place, the n² target |
| Brute force and its dedupe | 1–2 min | Say it with the set; do not code it |
| Reduce to Two Sum | 2–3 min | Anchor + pair search; hash version in a sentence or two |
| Duplicate rules and why they are safe | 3–4 min | Both rules and the one-line reason for each, before coding |
| Code | 5–7 min | One loop, one scan, two skip loops |
| Test | 4–5 min | Example 1, all zeros, `[-2, 0, 0, 2, 2]`, `[-1, -1, 2]` |
| Complexity and follow-ups | 3+ min | O(n²) guaranteed; output can be Θ(n²) |

**Where the time should go:** the duplicate rules. Candidates who know "sort and two pointers" still lose this problem by skipping in the wrong direction, forgetting the inner skip, or not being able to say why it is safe.

**If stuck:** fall back on the set of sorted triplets for deduplication. It costs memory and hashing but is correct; say so, code the anchor + two pointers with a `Set<List<Integer>>`, and then offer to replace the set with skip rules.

## 9. Interviewer challenges

### About duplicates

#### Why compare the anchor with the previous element and not the next?

**What they are testing:** whether you understand what rule 1 relies on, or memorised `nums[i] == nums[i - 1]`.

**How to reason:** the earlier copy's range includes the later copy. So the earlier copy can do everything the later one can, but not the other way round.

**What I say:** "The first copy of a value scans a range that includes all the later copies, so it can form triplets that use the value twice, and everything the later copies could find is already found. If I skipped while the next element is equal, I'd throw away the first copy and keep the last one, whose range no longer contains the other copies. On `[-1, -1, 2]` that returns nothing instead of `[-1, -1, 2]`."

**Nuance:** I checked this: the look-ahead version also drops `[-1, -1, 2]` from Example 1, returning only `[[-3, 1, 2], [-1, 0, 1]]`.

#### How do you know the skipping never loses a triplet?

**What they are testing:** a correctness argument, not just a test that passes.

**How to reason:** for each discarded element, name the only triplets it could still take part in, and show they were already reported.

**What I say:** "After a hit with values x and y, a copy of x can only pair with y, because the pair has to sum to minus the anchor. That pair is already recorded, so every copy of x or y I skip could only rebuild it. An ordinary miss discards an element with no partner left, the Two Sum II argument. And a repeated anchor scans a sub-range of what the first copy scanned. So every discarded element or anchor could only produce repeats."

**Nuance:** this argument is per anchor value and per pair target. If the problem asked for all index triples instead of value sets, none of the skips would be allowed.

#### Why not just put the triplets in a `HashSet` and skip the rules?

**What they are testing:** whether you can weigh a simpler-to-write option.

**How to reason:** count the cost: memory for the set, hashing a `List` per hit, and the scan still generates the repeats.

**What I say:** "It works, and if I were short of time I'd do it. But the scan would still generate every repeat, each one hashed as a list of three boxed integers, and the set takes memory proportional to the output. On `n` zeros without rule 1, every anchor rediscovers `[0, 0, 0]`. The skip rules cost two comparisons and remove the repeats at the source."

**Nuance:** with the set but without rule 2, the inner scan can also do extra work producing repeated pairs, though it stays O(n) per anchor because every step still moves a pointer.

### About the details

#### Why `break` when the anchor is positive, and why not `>= 0`?

**What they are testing:** whether the early exit is reasoned or copied.

**How to reason:** the anchor is the smallest of the three. Ask what the smallest possible sum is when the anchor is positive, and when it is zero.

**What I say:** "If the anchor is positive, the other two are at least as large, so the sum is positive, and the same holds for every later anchor; so `break`, not `continue`. With `>= 0` I'd lose `[0, 0, 0]`: on `[0, 0, 0, 0]` it returns an empty list."

**Nuance:** it is an optimisation, not needed for correctness; without it the scans simply find nothing.

#### You modified the input. Is that acceptable?

**What they are testing:** awareness of side effects and of the space accounting.

**How to reason:** the caller's array is reordered. Whether that matters is the caller's contract.

**What I say:** "I asked, and sorting in place was allowed. If it weren't, I'd sort `nums.clone()`, which adds O(n) memory and changes nothing else. I'd also mention that `Arrays.sort` on an `int[]` is in place but, as currently implemented, recursive, so the honest auxiliary space is O(log n) for the stack, not strictly O(1)."

**Nuance:** an in-place heap sort would make it O(1) auxiliary, at the cost of a slower sort in practice; irrelevant next to the O(n²) scan.

### About complexity

#### Can you do better than O(n²)?

**What they are testing:** whether you know when to stop.

**How to reason:** look at the output size first, then at what is known about the decision version.

**What I say:** "Not in the worst case for this problem: the answer itself can have on the order of n² triplets. For example, all integers from -1499 to 1500 give over a million triplets. Even just deciding whether one triplet exists has no known truly subquadratic algorithm; that's the 3SUM conjecture, and many conditional lower bounds, for example in computational geometry, are based on it."

**Nuance:** theoretical algorithms improve the decision version by polylogarithmic factors; none of that is interview material.

## 10. Follow-up questions the interviewer might ask

**"What if the target is some value `t` instead of 0?"**
Use `t - nums[i]` as the pair target. The early exit changes: break when `3 · nums[i] > t` (computed in `long` if values can be large), since the other two values are at least `nums[i]`. Everything else is unchanged. O(n²).

**"Return the sum of three numbers closest to a target."**
Same scan, no duplicate rules needed: track the best `|sum − t|` and move the pointer that brings the sum toward the target, returning early on an exact match. O(n²).

**"Count the triplets with sum less than a target."**
Sort, anchor, and when `nums[i] + nums[left] + nums[right] < t`, every index in `(left, right]` also works as the third element, so add `right − left` and move `left`; otherwise move `right`. O(n²); counts index triples, so no duplicate rules.

**"What about four numbers?"**
Add one more anchor level with the same rule 1, giving O(n³). That is [[nc-4sum|4Sum]], where an arbitrary target also makes overflow possible.

**"What if you must not sort or modify the input?"**
Sort a copy (O(n) extra). If even that is ruled out, use a hash set per anchor over the original order and deduplicate the found triplets by sorting each one and storing it in a set: O(n²) expected time, O(n + output) space.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Treating 3Sum as "find triplets" and leaving duplicates for later.** Deduplication shapes the whole design; plan it before coding.
- **Believing the skip rules are an optimisation.** They are what makes the output correct. Without them the answer contains repeats.
- **Not being able to say why skipping is safe.** "It passed the examples" is not an argument; the one-line reasons in section 4 are.
- **Claiming O(n log n) or "linear after sorting".** There are n anchors, each with a linear scan.

### Implementation mistakes

> [!MISTAKE] Skipping an anchor by looking ahead
> `if (i + 1 < n && nums[i] == nums[i + 1]) continue;` skips the first copy instead of the later ones. `[-1, -1, 2]` returns `[]`, and Example 1 loses `[-1, -1, 2]`.

> [!MISTAKE] No skipping after a hit
> Moving `left++` and `right--` but not past the copies records `[-2, 0, 2]` twice for `[-2, 0, 0, 2, 2]`.

> [!MISTAKE] Skip loops without `left < right`
> `while (nums[left] == nums[left - 1]) left++;` runs off the end on `[0, 0, 0]` and throws `ArrayIndexOutOfBoundsException` (index 3, length 3).

- **No anchor skip at all.** Example 1 returns `[-1, 0, 1]` twice.
- **`break` on `nums[i] >= 0`.** `[0, 0, 0, 0]` returns `[]`.

## 12. Pattern recognition

**The pattern:** fix one element, then solve a pair problem on the rest with two pointers on sorted data. Sorting doubles as the deduplication tool: repeats become neighbours.

**Signals in the problem statement:**

- "Find all triplets (or k-tuples) with a given sum."
- "The solution set must not contain duplicates" over values.
- n in the low thousands, which allows O(n²) but not O(n³).

**Related problems in this list:**

- [[nc-two-sum|Two Sum]]: the pair problem on unsorted input; Approach 1 here is its complement lookup applied once per anchor.
- [[nc-two-sum-ii-input-array-is-sorted|Two Sum II - Input Array Is Sorted]]: the inner scan of Approach 2, with its invariant.
- [[nc-4sum|4Sum]]: one more anchor level, an arbitrary target and overflow.
- [[nc-container-with-most-water|Container With Most Water]]: the same "discard the end that cannot do better" reasoning.
- [[nc-remove-duplicates-from-sorted-array|Remove Duplicates from Sorted Array]]: skipping equal neighbours in sorted data, the core of the dedupe rules.
- [[cses-sum-of-three-values|Sum of Three Values]] (CSES): find one triplet with a given target and return its original positions.

**Takeaway:** for "all k-tuples with a sum, no duplicates", sort, anchor the smallest elements in loops that skip equal neighbours, and finish with a two-pointer scan that skips past both values after every hit.

## 13. 60-second revision card

**Key insight:** fix the smallest element; the other two must sum to its negation, which is Two Sum II on the sorted suffix. Sorting also makes duplicates adjacent.

**Invariant and rules:** each unreported pair keeps positions in `[left, right]`. Rule 1: skip an anchor equal to the **previous** one. Rule 2: after a hit, move both pointers past every copy of the values just used. Break once the anchor is positive.

**Complexity:** O(n²) worst-case time; O(1) auxiliary besides the sort (O(log n) stack for Java's `int[]` sort as currently implemented) and the output, which can be Θ(n²).

**Code skeleton:**

```java title="3Sum core loop" fragment="public List<List<Integer>> threeSum(int[] nums)"
Arrays.sort(nums);
List<List<Integer>> res = new ArrayList<>();
for (int i = 0; i < nums.length - 2 && nums[i] <= 0; i++) {
    if (i > 0 && nums[i] == nums[i - 1]) continue;
    int l = i + 1, r = nums.length - 1;
    while (l < r) {
        int s = nums[i] + nums[l] + nums[r];
        if (s < 0) l++;
        else if (s > 0) r--;
        else {
            res.add(Arrays.asList(nums[i], nums[l++], nums[r--]));
            while (l < r && nums[l] == nums[l - 1]) l++;
            while (l < r && nums[r] == nums[r + 1]) r--;
        }
    }
}
return res;
```

**Main traps:**

- Look back (`nums[i - 1]`), not ahead, when skipping anchors.
- Skip copies on both sides after a hit, guarded by `left < right`.
- `> 0` breaks, `>= 0` loses `[0, 0, 0]`.
- Sorting in place modifies the caller's array; say so.

**What to say in one breath:** "Sort, fix the smallest element, and find pairs summing to its negation with two pointers. Skip an anchor equal to the previous one, and after each hit move both pointers past the values just used, because those copies can only rebuild the same triplet. O(n²) time, which is optimal here since the output can be quadratic, and O(1) extra space besides the sort."
