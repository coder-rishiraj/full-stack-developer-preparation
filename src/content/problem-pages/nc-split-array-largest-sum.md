---
problemId: nc-split-array-largest-sum
title: Split Array Largest Sum
source: neetcode
sourceUrl: https://leetcode.com/problems/split-array-largest-sum/
difficulty: hard
patterns: [binary-search, dynamic-programming, greedy]
relatedLessons: [a3-binary-search-on-answer, a3-binary-search, a11-partition-dp, a2-prefix-suffix, a10-local-vs-global, a14-brute-force-first, a14-deriving-optimization, a14-edge-cases]
companies: []
timeToSolve: 35
---

## 1. Problem restatement

You get an array of non-negative integers and a number k. Cut the array into exactly k pieces, each a non-empty run of consecutive elements, and look at the sum of each piece. Choose the cuts so that the largest of those k sums is as small as possible, and return that smallest possible largest sum.

**Example 1**

- Input: `nums = [7, 2, 5, 10, 8]`, `k = 2`
- Output: `18`
- Why: the four ways to cut once give `[7] [2,5,10,8]` (largest sum 25), `[7,2] [5,10,8]` (23), `[7,2,5] [10,8]` (18) and `[7,2,5,10] [8]` (24). The best is 18.

**Example 2**

- Input: `nums = [0, 4, 0, 0]`, `k = 3`
- Output: `4`
- Why: for example `[0] [4] [0, 0]`. No split can do better than 4, because whichever piece holds the 4 has a sum of at least 4. Zeros are allowed, and pieces that sum to 0 are still non-empty pieces.

**What the problem statement guarantees**

- Exactly k pieces, each non-empty and contiguous, covering the whole array.
- 1 ≤ `nums.length` ≤ 1000.
- 0 ≤ `nums[i]` ≤ 10^6.
- 1 ≤ k ≤ min(50, `nums.length`), so a valid split always exists.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 35 minutes and talk out loud.
2. Solve Example 1 by hand, then count how many splits a brute force would try at n = 1000, k = 50.
3. Look for two different ways in: describe the best split of a prefix in terms of shorter prefixes, and separately ask how you would answer "can the largest sum be at most X?".
4. For whichever you code, write down why it cannot miss the best split.
5. Trace your code on Example 2, where zeros make "exactly k" pieces worth checking.

Open a hint only after two minutes without progress.

> [!HINT] Hint 1: a small nudge
> Fix the last piece of the split. What is left is a shorter array that must be cut into one fewer piece. Separately: if someone tells you a limit X, can you quickly tell whether every piece can be kept at or below X?

> [!HINT] Hint 2: the kind of tool you need
> The first idea is a table indexed by (prefix length, number of pieces). The second idea is faster: "pieces can be kept at or below X" stays true when X grows, so the answers over X are false, …, false, true, …, true. What finds the first true quickly?

> [!HINT] Hint 3: almost the whole plan
> Search X between the largest element and the total sum. For each X, walk the array and start a new piece only when adding the next element would exceed X; this gives the fewest pieces possible. X is achievable if that count is at most k. Then ask yourself why "at most k" is enough when the problem demands exactly k non-empty pieces.

**Check yourself before revealing the walkthrough**

- [ ] I can say why the greedy piece count is the minimum number of pieces for a given limit
- [ ] I can explain why "at most k pieces" implies "exactly k pieces" here, and which input property that uses
- [ ] My code returns 18 for Example 1, 4 for Example 2, and 0 for `[0, 0, 0]` with k = 3
- [ ] I computed the largest possible sum and checked my arithmetic cannot overflow

## 3. Interview script: understand the problem (≈3 min)

**Me:** Let me restate it. I cut the array into k contiguous pieces, none empty, and I want to minimize the biggest piece sum. I return that minimum value, not the cuts. Right?

**Interviewer:** Right.

**Me:** Exactly k pieces, or at most k?

**Interviewer:** Exactly k, each non-empty.

**Me:** And k never exceeds the length, so it's always possible. The values are non-negative, can they be zero?

**Interviewer:** Yes, 0 to 10^6.

**Me:** That's worth noting: zeros mean a piece can sum to 0, and splitting a piece never makes either half bigger than the whole. I'll come back to that. Sizes: up to 1000 elements and k up to 50. The total is at most 1000 × 10^6 = 10^9, which is under `Integer.MAX_VALUE` (2,147,483,647), so a sum fits in an `int`. If I binary search over sums, `lo + hi` could reach 2 × 10^9, still under the limit but with only about 7% to spare, so I'll compute the middle as `lo + (hi − lo) / 2`, which never exceeds `hi`.

**Interviewer:** Fine.

**Me:** Example by hand: `[7, 2, 5, 10, 8]`, k = 2. One cut, four positions. Sums: 7 | 25, 9 | 23, 14 | 18, 24 | 8. Largest sums 25, 23, 18, 24. Minimum 18. The good cut balances the two sides.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| Exactly k non-empty contiguous pieces | Choosing a split is choosing k − 1 cut positions among the n − 1 gaps. |
| 1 ≤ n ≤ 1000, 1 ≤ k ≤ min(50, n) | k · n² ≈ 5 × 10^7, so a quadratic-per-piece DP runs. Brute force over cut sets does not (section 4). |
| 0 ≤ `nums[i]` ≤ 10^6 | Total ≤ 10^9 fits in an `int`. Non-negative values make sums grow with length, which both the DP and the greedy check rely on. Zeros are possible and must be tested. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Exactly k pieces, all non-empty | A check that counts "at most k" pieces needs an argument that exactly k is then possible. |
| Only the value is returned | No need to record the cuts (a follow-up). |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The input array is read-only | Neither approach needs to modify it. |

### Edge cases I will keep in mind

- k = 1: the answer is the total.
- k = n: every piece is a single element; the answer is the maximum element.
- n = 1.
- Zeros, including an all-zero array (answer 0).
- One huge element: the answer is at least that element, whatever k is.
- The extremes: n = 1000, every value 10^6.

## 4. Think out loud: from first idea to best solution

### Approach 1: Dynamic programming over prefixes and piece counts

#### What I say out loud

> "The brute force picks k − 1 cut positions out of n − 1 gaps and evaluates each split. That's C(n − 1, k − 1) splits; for n = 1000 and k = 50 that's C(999, 49), about 4.7 × 10^83. Hopeless, so I won't code it, but it tells me what a split is: a sequence of cut points."

> "Lots of those splits share structure. If I fix where the last piece starts, say at index p, the last piece's sum is fixed, and the rest is the same question on the first p elements with k − 1 pieces. And the best way to split those first p elements doesn't depend on what comes after. That's optimal substructure, and the subproblems are just (prefix length, pieces), at most 1000 × 50 of them. So: DP."

> "With prefix sums, each piece sum is a subtraction. Each state tries every start of its last piece, so about n transitions per state: k times n squared overall, which is 5 × 10^7 at the limits. That runs."

#### Intuition

Let `dp[j][i]` be the smallest possible largest sum when the first i elements are cut into exactly j non-empty pieces. The last of those j pieces covers indices `p … i − 1` for some p, and its sum is `prefix[i] − prefix[p]`. The other j − 1 pieces split the first p elements, and the best they can do is `dp[j − 1][p]`. So

`dp[j][i] = min over p of max(dp[j − 1][p], prefix[i] − prefix[p])`,

where p ranges from j − 1 (each of the first j − 1 pieces needs at least one element) to i − 1 (the last piece needs at least one). This is the "choose the last piece of a prefix" shape from [[a11-partition-dp|Partition DP]].

#### Algorithm

1. Build `prefix` with `prefix[0] = 0` and `prefix[i + 1] = prefix[i] + nums[i]`.
2. Fill `dp` with "infinity" and set `dp[0][0] = 0` (zero elements in zero pieces costs nothing).
3. For j from 1 to k, for i from j to n, for p from j − 1 to i − 1: `dp[j][i] = min(dp[j][i], max(dp[j − 1][p], prefix[i] − prefix[p]))`.
4. Return `dp[k][n]`.

#### Why it is correct

- **Every value is achievable.** By induction on j: `dp[j − 1][p]` is the largest sum of a real split of the first p elements into j − 1 pieces; adding the non-empty piece `p … i − 1` gives a real split of the first i elements into j pieces whose largest sum is the `max` written down.
- **Nothing is missed.** Take any split of the first i elements into j pieces and let its last piece start at p. Its largest sum is `max(largest of the first j − 1 pieces, last piece)`. The first part is at least `dp[j − 1][p]` by definition, and `max` never decreases when an argument grows, so this split is no better than the candidate the DP evaluated for that p. Every p is tried.
- **The ranges are right.** `p ≥ j − 1` because j − 1 non-empty pieces need at least j − 1 elements; `p ≤ i − 1` because the last piece is non-empty. States with fewer elements than pieces stay at infinity and are never chosen.

#### Dry run

`nums = [7, 2, 5, 10, 8]`, `k = 2`. `prefix = [0, 7, 9, 14, 24, 32]`.

Row j = 1 has a single piece, so `dp[1][i] = prefix[i]`.

| i | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| `dp[1][i]` | 7 | 9 | 14 | 24 | 32 |
| `dp[2][i]` | ∞ | 7 | 7 | 14 | 18 |

How `dp[2][5]` is computed (the last piece starts at p):

| p | `dp[1][p]` (first piece) | `prefix[5] − prefix[p]` (last piece) | max |
|---|---|---|---|
| 1 | 7 | 25 | 25 |
| 2 | 9 | 23 | 23 |
| 3 | 14 | 18 | **18** |
| 4 | 24 | 8 | 24 |

These are the four hand-computed splits from section 3, and the minimum is 18.

#### Java code

```java title="Approach 1: DP over (pieces, prefix length)"
import java.util.Arrays;

class Solution {
    public int splitArray(int[] nums, int k) {
        int n = nums.length;
        int[] prefix = new int[n + 1]; // prefix[n] <= 1000 * 10^6 = 10^9 fits in an int
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
        final int INF = Integer.MAX_VALUE; // only compared, never added to
        int[][] dp = new int[k + 1][n + 1];
        for (int[] row : dp) {
            Arrays.fill(row, INF);
        }
        dp[0][0] = 0;
        for (int j = 1; j <= k; j++) {
            for (int i = j; i <= n; i++) {
                for (int p = j - 1; p < i; p++) {
                    if (dp[j - 1][p] == INF) {
                        continue;
                    }
                    int largest = Math.max(dp[j - 1][p], prefix[i] - prefix[p]);
                    dp[j][i] = Math.min(dp[j][i], largest);
                }
            }
        }
        return dp[k][n];
    }
}
```

#### Time complexity

**O(k · n²) in the worst case**, where n is the length of `nums` and k the number of pieces. There are k rows of up to n cells, and each cell tries up to n start positions for its last piece, each in O(1) thanks to the prefix sums. More precisely the innermost loop runs i − j + 1 times, so the total is about k · n² / 2: exactly 23,819,600 inner steps at n = 1000, k = 50 (about 2.4 × 10^7).

#### Space complexity

**O(k · n) auxiliary space** for the table (51 × 1001 `int`s here), plus O(n) for the prefix sums. Row j only reads row j − 1, so two rows of length n + 1 suffice, which brings it to O(n).

#### The bridge to the next approach

> "This is fine for the constraints, but it's quadratic in n per piece, and most of that work is comparing splits I could rule out. Let me look at the problem from the answer's side instead. Suppose someone gives me a limit X and asks: can I cut into k pieces with every piece at most X? That's much easier than optimizing. I walk left to right and only start a new piece when the next element would push the current one over X. That's one pass."

> "And the answers to that question are monotone in X: if every piece fits under X, it fits under X + 1. So the yes/no answers over X look like no, no, …, yes, yes, and the minimum largest sum is the first yes. I can binary search X. The thing I have to be careful about is that my greedy walk counts the *fewest* pieces, and the problem wants *exactly* k."

### Approach 2: Binary search on the answer with a greedy piece count (recommended)

#### What I say out loud

> "I'll binary search the value of the largest sum. The low end is the largest element: whichever piece contains it has at least that sum, since nothing is negative. The high end is the total, the sum of the whole array, which no piece can exceed."

> "For a candidate limit X, I count pieces greedily: extend the current piece while it stays at most X, otherwise start a new one. That gives the minimum number of pieces whose sums are all at most X. If that minimum is at most k, X is achievable with exactly k pieces, because I can split pieces further: every element is non-negative, so a piece cut in two gives two sums that are each at most the original. And since k ≤ n, while I have fewer than k pieces, at least one piece has two or more elements to cut."

> "Each check is O(n), and the range has at most 10^9 values, so about 30 checks. That's around 3 × 10^4 steps against the DP's 2.4 × 10^7."

#### Intuition

Turn "minimize the maximum" into a yes/no question: `feasible(X)` = "the array can be cut into exactly k non-empty pieces, each with sum at most X". Raising X can only turn a no into a yes, and the answer is the smallest X with a yes. Answering `feasible(X)` is easy because the greedy walk tells you the fewest pieces needed under X, and with non-negative values "fewest ≤ k" is exactly the condition. This is [[a3-binary-search-on-answer|binary search on the answer]], the same machinery as [[nc-capacity-to-ship-packages-within-d-days|Capacity to Ship Packages]].

#### Algorithm

1. `lo = max(nums)`, `hi = sum(nums)`.
2. While `lo < hi`:
   1. `mid = lo + (hi − lo) / 2`.
   2. If `piecesNeeded(mid) ≤ k`, set `hi = mid`; otherwise set `lo = mid + 1`.
3. Return `lo`.
4. `piecesNeeded(X)`: start with 1 piece and sum 0; for each x, if `sum + x > X`, start a new piece (count + 1, sum 0); then add x to the sum.

#### Why it is correct

This is the part the interviewer cares about. Five facts, each short.

**1. The greedy count is the minimum (for X ≥ max(nums)).** Let greedy's pieces end after positions g₁, g₂, … and any other split with all sums ≤ X end after o₁, o₂, …. Claim: g_t ≥ o_t for every t (greedy stays ahead). If g_(t−1) ≥ o_(t−1), the other split's piece t covers `o_(t−1) … o_t`, which sums to at most X. Greedy's piece t starts at or after that start, so its elements up to o_t are a sub-run, and with non-negative values a sub-run sums to no more than the whole run, so they fit. Greedy only closes a piece when the next element does not fit, so it reaches at least o_t. Hence greedy finishes in no more pieces than any other split. The condition X ≥ max(nums) ensures greedy never creates a piece that already exceeds X.

**2. At most k pieces implies exactly k pieces.** Suppose greedy uses m ≤ k pieces, all with sum ≤ X. If m < k, then since k ≤ n, the m pieces cannot all be single elements (that would be m = n ≥ k), so some piece has at least two elements. Cut it into two non-empty pieces. Each new piece is a sub-run of the old one and, because every value is at least 0, sums to at most the old sum, so still ≤ X. That is m + 1 pieces. Repeat until there are exactly k. Zeros cause no trouble: a piece `[0]` is non-empty and sums to 0 ≤ X. So `feasible(X)` ⟺ `piecesNeeded(X) ≤ k`, and the reverse direction holds by fact 1 (if a k-piece split exists, greedy needs at most k).

**3. Monotonic.** If a split has every piece ≤ X, the same split has every piece ≤ X + 1. So feasibility never switches back from yes to no, and binary search may discard half the range at each step.

**4. The range holds the answer.** Every split puts the maximum element in some piece whose sum is at least that element (the other elements are ≥ 0), so the answer is ≥ `max(nums)`. Every piece sum is at most the total, so the answer is ≤ `sum(nums)`, and `sum(nums)` is feasible by fact 2 (greedy gives one piece, and one ≤ k).

**5. The value returned is a real largest sum, not just a limit.** The search ends at the smallest feasible X. Take an optimal split; its largest sum H satisfies H ≤ X (X is feasible, so the optimum is at most X) and H is itself feasible, so H ≥ X. Hence H = X: the search returns exactly the minimum largest sum.

The loop itself keeps the invariant "the answer is in `[lo, hi]`": a feasible `mid` keeps `[lo, mid]`, an infeasible `mid` rules out everything up to `mid` by fact 3. `mid < hi` whenever `lo < hi`, so each step shrinks the range and the loop ends with `lo == hi`.

**The 30-second version to say to the interviewer:**

> "Feasibility of a limit X is monotonic, so I binary search X between the max element and the total. For each X, the greedy walk that starts a new piece only when forced gives the fewest pieces, because it's never behind any other valid split. If that's at most k I can get exactly k, since k ≤ n means some piece has two elements, and cutting it never raises a sum when values are non-negative. The smallest feasible X is the answer, and it is achieved, because the optimal split's largest sum is itself feasible."

#### Dry run

`nums = [7, 2, 5, 10, 8]`, `k = 2`: `lo = 10`, `hi = 32`.

| lo | hi | mid | Greedy pieces at mid | Count | Action |
|---|---|---|---|---|---|
| 10 | 32 | 21 | `[7,2,5] [10,8]` | 2 | ≤ 2, `hi = 21` |
| 10 | 21 | 15 | `[7,2,5] [10] [8]` | 3 | > 2, `lo = 16` |
| 16 | 21 | 18 | `[7,2,5] [10,8]` | 2 | ≤ 2, `hi = 18` |
| 16 | 18 | 17 | `[7,2,5] [10] [8]` | 3 | > 2, `lo = 18` |
| 18 | 18 | | | | return 18 |

At 17 the greedy split has pieces 14, 10 and 8, three pieces; at 18 the pieces `[10]` and `[8]` merge into 18. The answer 18 is the sum of an actual piece, as fact 5 promises.

#### Java code

```java title="Approach 2: binary search on the largest sum (recommended)"
class Solution {
    public int splitArray(int[] nums, int k) {
        int lo = 0;
        int hi = 0; // total, at most 1000 * 10^6 = 10^9 < 2^31 - 1
        for (int x : nums) {
            lo = Math.max(lo, x);
            hi += x;
        }
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2; // never exceeds hi, so no overflow
            if (piecesNeeded(nums, mid) <= k) {
                hi = mid;       // mid is achievable: the answer is mid or smaller
            } else {
                lo = mid + 1;   // mid is not, and neither is anything smaller
            }
        }
        return lo;
    }

    /** The fewest contiguous pieces with every sum at most limit (limit >= max(nums)). */
    private int piecesNeeded(int[] nums, int limit) {
        int pieces = 1;
        int sum = 0; // stays <= limit, so sum + x <= 10^9 + 10^6
        for (int x : nums) {
            if (sum + x > limit) {
                pieces++;
                sum = 0;
            }
            sum += x;
        }
        return pieces;
    }
}
```

#### Time complexity

**O(n log S) in the worst case**, where n is the length of `nums` and S the total sum. The range starts with `S − max + 1 ≤ 10^9 + 1` values and halves each round, so there are at most ⌈log₂(10^9 + 1)⌉ = 30 rounds, each an O(n) pass, plus one pass for the bounds: about 3 × 10^4 steps at the limits. The bound does not depend on k.

#### Space complexity

**O(1) auxiliary space**: a handful of `int` variables. No recursion; the input is not modified.

## 5. Comparison table

n = length of `nums` (≤ 1000), k = number of pieces (≤ 50), S = total sum (≤ 10^9). Nothing is hashed or randomized, so expected and worst case agree.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Brute force over cut sets (prose only) | O(C(n − 1, k − 1) · n) | Same; C(999, 49) ≈ 4.7 × 10^83 splits | O(k) |
| 1. DP over (pieces, prefix) | O(k · n²) | O(k · n²), about 2.4 × 10^7 steps | O(k · n), or O(n) with two rows |
| 2. Binary search + greedy count | O(n log S) | O(n log S), about 3 × 10^4 steps | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Brute force | Defines the search space | Exponential | Never coded; say it to set the baseline |
| 1. DP | Needs no monotonicity or greedy argument; works with negative values and other cost functions; one table gives the answer for every piece count up to k | Slower by three orders of magnitude here; O(k · n) memory unless rolled | Negative numbers, a cost that is not "the largest sum", or answers for every j ≤ k at once |
| 2. Binary search | Fast, tiny memory, short code; independent of k | Correctness rests on three non-obvious facts (greedy minimal, at most → exactly, monotonic), all of which use non-negative values | The default answer for this problem |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** binary search on the answer (Approach 2), with the correctness argument spoken. On a hard problem, the argument is what separates a memorized answer from an understood one.

**Should I mention the DP?** Yes, briefly, and possibly first. Many candidates reach the DP first because "split into k pieces, optimize" sounds like partition DP. It is correct and fits the limits, so if you derive it, say its complexity and offer the binary search as the improvement. If the interviewer asks for code of only one, code the binary search.

**Is it optimal?** In the worst case any correct algorithm must read essentially every element (an unread one could be large enough to change the answer), so there is an Ω(n) worst-case lower bound. O(n log S) is within a factor of 30 of it. Stop there.

**When the DP is better in practice:** values may be negative (the greedy check and fact 2 both break), the objective is not the largest sum (for example, minimize the sum of squared piece sums), or you need the answer for every number of pieces from 1 to k (the DP's last column gives all of them).

**Where to stop:** do not chase a faster DP (section 9 sketches one). Do not tighten the search range beyond `[max, sum]`; it saves a few of the 30 rounds.

## 7. Interview script: code it and test it

### What I say while coding

> "One pass for the bounds: `lo` is the maximum element, `hi` the total. The total is at most 10^9, inside `int`. For the middle I write `lo + (hi − lo) / 2`, which stays at most `hi`."

> "The loop is `while (lo < hi)`; success keeps mid with `hi = mid`, failure moves to `mid + 1`."

> "The helper counts pieces. It starts at one piece. When the next element doesn't fit, I open a new piece, and then the element goes into the current piece; the element that overflowed starts the new piece."

> "I return the count and compare with `<= k`, not `== k`, because the greedy count is the minimum, and fewer pieces can always be split up."

### Testing out loud

**Normal case:** `[7, 2, 5, 10, 8]`, k = 2: traced in section 4, returns 18.

**Example with a different balance point:** `[1, 2, 3, 4, 5]`, k = 2. `lo = 5`, `hi = 15`. `mid = 10`: `[1,2,3,4] [5]`, 2 pieces, `hi = 10`. `mid = 7`: `[1,2,3] [4] [5]`, 3, `lo = 8`. `mid = 9`: `[1,2,3] [4,5]`, 2, `hi = 9`. `mid = 8`: `[1,2,3] [4] [5]`, 3, `lo = 9`. Returns 9 (`[1,2,3] [4,5]`). Correct.

**Zeros, exactly k:** `[0, 4, 0, 0]`, k = 3. `lo = hi = 4`, so the loop does not run and the method returns 4. Greedy at 4 would make a single piece `[0,4,0,0]`, and fact 2 says that is enough: cut it into `[0] [4] [0, 0]`, three non-empty pieces, each ≤ 4. Correct.

**All zeros:** `[0, 0, 0]`, k = 3. `lo = hi = 0`, returns 0. The split `[0] [0] [0]` has largest sum 0. The helper would accept limit 0 without starting a new piece, because `0 + 0 > 0` is false.

**k = n:** `[2, 4, 2, 4]`, k = 4. `lo = 4`, `hi = 12`. `mid = 8`: `[2,4,2] [4]`, 2, `hi = 8`. `mid = 6`: `[2,4] [2,4]`, 2, `hi = 6`. `mid = 5`: `[2] [4] [2] [4]`, 4, `hi = 5`. `mid = 4`: 4 pieces, `hi = 4`. Returns 4, the maximum element. Correct.

**k = 1:** `[3, 1, 4]`. `lo = 4`, `hi = 8`; every `mid` below 8 needs 2 pieces, so `lo` climbs to 8. Returns 8, the total.

**n = 1:** `[5]`, k = 1. `lo = hi = 5`, returns 5.

**Limits:** n = 1000, all values 10^6, k = 50: each piece holds at most `limit / 10^6` elements, so the answer is 10^6 × ⌈1000 / 50⌉ = 2 × 10^7. With k = 1 the answer is 10^9, and `hi` reached that value without overflow.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 3 min | Exactly k, non-empty, zeros allowed, total ≤ 10^9 |
| Brute force and its size | 1–2 min | C(n − 1, k − 1) splits: exponential |
| DP derivation | 4–5 min | State, recurrence, O(k · n²); code only if asked or if the faster idea does not come |
| Switch to the answer's side | 3–4 min | The yes/no question, monotonicity, greedy count, range |
| Correctness of the check | 3 min | Greedy minimal; at most k ⇒ exactly k; returned value is achieved |
| Code | 5–6 min | Bounds, loop, helper |
| Trace and edge cases | 4 min | Example 1, zeros, k = n |
| Complexity and comparison | the rest | O(n log S) versus O(k · n²); when the DP wins |

**Where the time should go:** the correctness argument for the check, especially "at most k implies exactly k". It is the step most candidates skip, and it is where a hard-level interviewer probes.

**If stuck:** if the binary search idea does not come, code the DP: it is a complete, correct answer within the limits. A question that unlocks the faster idea: "If you told me the answer was at most X, could I verify it quickly?"

## 9. Interviewer challenges

### About the feasibility check

#### Your check counts the fewest pieces. The problem wants exactly k. Why is `<= k` right?

**What they are testing:** the subtle step. Many candidates write `<= k` because it passes, without knowing why.

**How to reason:** from a split with m < k pieces, build one with m + 1 pieces that still respects the limit, and say which constraints make that possible.

**What I say:** "If greedy needs m pieces and m < k, then since k ≤ n not every piece is a single element, so I can cut a piece with two or more elements into two non-empty pieces. Each half is part of the old piece, and with no negative values its sum is at most the old sum, so still within the limit. Repeating gives exactly k. Conversely, if a k-piece split exists, greedy needs at most k. So feasible means greedy count ≤ k."

**Nuance:** this uses both k ≤ n and non-negative values. With negatives it fails: for `[3, −3]` and k = 2, the whole array sums to 0, but every 2-piece split has a piece of 3. Zeros are fine, since a sub-run of zeros sums to 0.

#### Why is the greedy count the minimum number of pieces?

**What they are testing:** whether you can prove a greedy claim.

**How to reason:** compare greedy with any valid split piece by piece and show greedy is never behind.

**What I say:** "After each piece, greedy has covered at least as many elements as any other valid split. If that holds after piece t − 1, the other split's piece t is a run that fits under the limit. Greedy's piece t starts no earlier, so its elements up to where the other piece ends form a sub-run, which fits because values are non-negative. Greedy only stops at an element that doesn't fit, so it gets at least that far. Being ahead after every piece, it finishes in no more pieces."

**Nuance:** the check needs `limit ≥ max(nums)`. Below that, the helper puts an oversized element in its own piece without complaint. With `lo = 0`, `[1, 10]` and k = 2 returns 1.

#### Why does the search return a sum that some split actually has?

**What they are testing:** whether "smallest feasible limit" and "minimum largest sum" are the same thing in your head, and why.

**How to reason:** compare the optimal split's largest sum with the smallest feasible limit, in both directions.

**What I say:** "Let H be the best possible largest sum and X the limit I return. H is feasible, so X ≤ H since X is the smallest feasible. X is feasible, so some split has every piece at most X, which means H ≤ X. So X = H."

**Nuance:** in the dry run the search tested 21, 15, 18 and 17, values that are not piece sums, but the final value 18 is one. A search over real numbers would need a stopping tolerance; here the answer is an integer, so the integer search lands on it exactly.

### About the comparison with the DP

#### Your DP and your binary search both work. Which would you ship, and when would you change your mind?

**What they are testing:** judgment, not just knowledge of two algorithms.

**How to reason:** list what each one depends on. The binary search depends on non-negative values and on "minimize the maximum" being the objective. The DP depends on neither.

**What I say:** "For this problem the binary search: 30 linear passes, constant memory, a few lines. I'd switch to the DP if values could be negative, because the greedy check and the 'split further' step both break; or if the cost were something like the sum of squares of piece sums, where there's no yes/no threshold to search; or if I needed the answer for every number of pieces up to k, which the DP produces at once."

**Nuance:** the DP's O(k · n²) with n = 1000 is about 2.4 × 10^7 steps, which is fine here, so this is about robustness and generality, not about the DP being too slow for these limits.

#### Can the DP be made faster?

**What they are testing:** whether you can find structure in your own recurrence; this comes up when the interviewer wants to see the DP pushed.

**How to reason:** in `max(dp[j − 1][p], prefix[i] − prefix[p])`, look at how each term moves as p grows.

**What I say:** "As p grows, the last piece shrinks, so `prefix[i] − prefix[p]` never increases. And `dp[j − 1][p]` never decreases with p for non-negative values: removing the last element of an optimal split of p elements, and re-splitting a piece if the last one became empty, never raises the maximum. The max of a non-decreasing and a non-increasing sequence is minimized where they cross, so I can binary search p instead of scanning, giving O(k · n log n)."

**Nuance:** I would only say this if asked. The binary search on the answer is simpler and faster still, and the crossing argument also needs non-negative values.

### About complexity

#### Why 30 iterations, and is `(lo + hi) / 2` safe here?

**What they are testing:** precise bounds and overflow reasoning from the constraints.

**How to reason:** compute the range size and the largest `lo + hi`.

**What I say:** "The range has at most 10^9 + 1 values, and 2^30 is just over 10^9, so at most 30 rounds. `lo + hi` is at most 2 × 10^9, which happens to fit under 2^31 − 1, about 2.147 × 10^9, but only barely; `lo + (hi − lo) / 2` never goes above `hi`, so I use that. Inside the helper, `sum + x` is at most 10^9 + 10^6."

**Nuance:** if values could reach `Integer.MAX_VALUE`, the total itself would overflow; then `lo`, `hi` and the running sum must be `long`.

## 10. Follow-up questions the interviewer might ask

**"Return the split itself, with exactly k pieces."**
Run the greedy walk at the answer to get m ≤ k pieces, then cut multi-element pieces (for example, peel single elements off the end of the last piece with two or more elements) until there are k. O(n) extra after the search. The DP version records the best p for each state and walks back.

**"What if values can be negative?"**
The binary search breaks: greedy no longer gives the fewest pieces, and cutting a piece can raise a sum. The DP still works unchanged, O(k · n²), because its argument never used the sign of the values.

**"What if you need the answer for every k from 1 to K?"**
The DP gives `dp[j][n]` for every j ≤ K in one O(K · n²) run. The binary search would run once per k: O(K · n log S). For K = 50 and n = 1000 the second is still smaller (about 1.5 × 10^6 steps versus 2.4 × 10^7).

**"What if the pieces could be any subsets, not contiguous runs?"**
That is multiprocessor scheduling (minimize the makespan on k machines), which is NP-hard. Binary search on the answer still applies, but the check becomes an exponential search or a heuristic.

**"Maximize the smallest piece sum instead."**
Same machinery mirrored: feasibility "every piece is at least X" is monotone the other way, the greedy closes a piece as soon as it reaches X, and you search for the largest feasible X.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Treating it as a balancing heuristic.** "Aim for pieces of size total / k" is a lower bound (⌈S / k⌉), not the answer: `[1, 2, 3, 4, 5]` with k = 2 has ⌈15 / 2⌉ = 8 but answer 9, because the elements are indivisible and ordered.
- **Not noticing the problem is "minimize the maximum".** That phrase is the strongest signal for binary search on the answer.
- **Asserting `<= k` without the argument,** or worse, testing `== k`. The predicate "greedy uses exactly k pieces" is not monotonic: with `== k`, `[2, 4, 2, 4]` and k = 4 returns 12 instead of 4.
- **Claiming the greedy and the split-further step work for any integers.** Both need non-negative values; say where you use that.
- **Coding the brute force recursion without memoization** and calling it a DP. The recursion over cut positions is exponential until results for (pieces, prefix) are cached.

### Implementation mistakes

> [!MISTAKE] Starting the new piece empty
> `if (sum + x > limit) { pieces++; sum = 0; } else { sum += x; }` loses the element that opened the new piece. On Example 1 it returns 14 instead of 18.

> [!MISTAKE] Starting the search at 0
> The helper never reports an element larger than the limit; it just gives it its own piece. With `lo = 0`, `[1, 10]` and k = 2 returns 1. Start at `max(nums)`.

- **`hi = mid − 1` on success:** discards a feasible mid that may be the answer.
- **`while (lo <= hi)` with `hi = mid`:** loops forever once `lo == hi`.
- **DP inner loop from p = 0 with a sentinel that gets added to:** using `Integer.MAX_VALUE` and then adding a piece sum to it overflows to a negative number that wins every `min`. Only compare the sentinel, or skip it, as the code above does.
- **DP initialised with `dp[1][i] = nums[i − 1]`** instead of the prefix sum: the first piece is a prefix, not a single element.

## 12. Pattern recognition

**The pattern:** binary search on the answer for "minimize the maximum" (or "maximize the minimum") over contiguous pieces, with a greedy feasibility check. A partition DP is the general fallback.

**Signals in the problem statement:**

- "Minimize the largest sum / load / time" across k groups.
- Groups are contiguous runs, and values are non-negative, so a greedy walk can test a limit.
- The answer is an integer in a range you can bound from the input (largest element, total).
- A DP is possible but its cost grows with n² per group.

**Related problems in this list:**

- [[nc-capacity-to-ship-packages-within-d-days|Capacity to Ship Packages Within D Days]]: the same check with "at most `days`" instead of "exactly k", and positive weights.
- [[nc-koko-eating-bananas|Koko Eating Bananas]]: binary search on a speed, with a summing check instead of a greedy split.
- [[cses-array-division|Array Division]] (CSES): this problem, with larger n, where only the binary search is fast enough.
- [[cses-factory-machines|Factory Machines]] (CSES): binary search on time with a counting check.
- [[nc-partition-to-k-equal-sum-subsets|Partition to K Equal Sum Subsets]]: the non-contiguous cousin, which needs backtracking instead of a greedy walk.

**Takeaway:** when a problem says "minimize the largest", ask whether "can the largest be at most X?" is easy to answer. If it is, and the answer only improves as X grows, binary search X and spend your words on why the check is exact.

## 13. 60-second revision card

**Key insight:** "minimize the largest piece sum" becomes "smallest X such that the greedy walk needs at most k pieces under X", and that predicate is monotone in X.

**Invariant:** the answer stays in `[lo, hi]`, starting from `[max(nums), sum(nums)]`; the greedy count under X is the minimum number of pieces; and with non-negative values and k ≤ n, at most k pieces can always be cut into exactly k.

**Complexity:** O(n log S) time (at most 30 rounds for S ≤ 10^9), O(1) auxiliary space. The DP alternative is O(k · n²) time and O(k · n) space.

**Code skeleton:**

```java title="Split array, binary search" fragment="public int splitArray(int[] nums, int k)"
int lo = 0, hi = 0;
for (int x : nums) { lo = Math.max(lo, x); hi += x; }
while (lo < hi) {
    int mid = lo + (hi - lo) / 2, pieces = 1, sum = 0;
    for (int x : nums) {
        if (sum + x > mid) { pieces++; sum = 0; }
        sum += x;
    }
    if (pieces <= k) hi = mid; else lo = mid + 1;
}
return lo;
```

**Main traps:**

- Compare with `<= k`, and know why: split pieces further, which needs values ≥ 0 and k ≤ n.
- `lo = max(nums)`, not 0: the helper does not detect an oversized element.
- The element that overflows starts the next piece; add it after resetting.
- `hi = mid` on success, `lo = mid + 1` on failure, `while (lo < hi)`.
- Total ≤ 10^9 fits in `int`; compute the middle as `lo + (hi − lo) / 2`.

**What to say in one breath:** "The DP over prefixes and piece counts is O(k · n²). Faster: binary search the largest sum between the max element and the total. Greedy gives the fewest pieces under a limit, and fewer than k pieces can be cut into exactly k because values are non-negative, so the check is `count <= k`. That's O(n log S) time and O(1) space."
