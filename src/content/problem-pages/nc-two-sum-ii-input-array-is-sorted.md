---
problemId: nc-two-sum-ii-input-array-is-sorted
title: Two Sum II - Input Array Is Sorted
source: neetcode
sourceUrl: https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/
difficulty: medium
patterns: [two-pointers, binary-search]
relatedLessons: [a2-two-pointers, a3-binary-search, a2-hashing, a14-deriving-optimization, a14-edge-cases]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

You get an array of integers that is already sorted from smallest to largest (equal neighbours are allowed), and a target. Exactly one pair of different positions holds values that add up to the target. Return those two positions, **counting from 1**, smaller position first. You may use only a constant amount of extra memory.

**Example 1**

- Input: `numbers = [1, 3, 4, 7, 11]`, `target = 11`
- Output: `[3, 4]`
- Why: `numbers[2] + numbers[3] = 4 + 7 = 11` in 0-based terms, which are positions 3 and 4 when counting from 1. No other pair reaches 11: `1 + 11` is 12, `3 + 7` is 10.

**Example 2**

- Input: `numbers = [-3, -3, 2, 5]`, `target = -6`
- Output: `[1, 2]`
- Why: the two `-3`s are different positions, so they may be paired. Every other pair sums to -1, 2 or 7.

**What the problem statement guarantees**

- `numbers` is sorted in non-decreasing order.
- Exactly one solution exists, and the same element may not be used twice.
- The answer is `[index1, index2]` with `1 <= index1 < index2 <= numbers.length`.
- Only constant extra space may be used.
- `2 <= numbers.length <= 3 * 10^4`; every value and the target lie between -1000 and 1000.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 15 minutes and talk out loud.
2. Restate the problem in one sentence, including the output format. Write down which fact in the statement is new compared with an ordinary "find two numbers" problem, and which fact takes a familiar tool away.
3. Say the simplest correct solution and its cost.
4. Ask what the sorted order tells you after you add two numbers and compare with the target.
5. Code it and trace it on Example 1 and on Example 2.

Open a hint only after two minutes without progress.

> [!HINT] Hint 1: a small nudge
> Add the smallest and the largest value. Suppose the sum is below the target. Is there any partner left in the array that could rescue the smallest value?

> [!HINT] Hint 2: the kind of tool you need
> Each comparison of a sum with the target can rule out one element for good, depending on which side of the target the sum falls. Keep two positions, one at each end, and decide after every comparison which one to retire.

> [!HINT] Hint 3: almost the whole plan
> Start one index at the left end and one at the right end. While they have not met: if the pair sums to the target, return both positions plus one; if the sum is too small, move the left index right; if too big, move the right index left. Then explain why the answer can never be stepped over.

**Check yourself before revealing the walkthrough**

- [ ] I can name the constraint that rules out the usual hash-map solution
- [ ] I can explain why moving a pointer never skips the answer, not just that it works
- [ ] My code returns `[3, 4]` for Example 1 and `[1, 2]` for Example 2, counting from 1
- [ ] I know the time and extra space of my solution, and whether the time bound is guaranteed

## 3. Interview script: understand the problem (≈2 min)

This is usually asked right after, or instead of, the original Two Sum. The interviewer wants to see whether you notice what changed: the input is sorted, the answer is 1-based, and memory is restricted. So the questions focus on those three.

**Me:** So the array is sorted ascending, I find the two positions whose values add up to the target, and I return them counting from 1, smaller first?

**Interviewer:** Yes. 1-indexed, `index1 < index2`.

**Me:** Sorted in non-decreasing order, so duplicates can appear next to each other. Can two equal values be the answer, like two -3s for target -6?

**Interviewer:** Yes, as long as they're different positions.

**Me:** And there's exactly one valid pair, so I can return as soon as I find it?

**Interviewer:** Exactly one.

**Me:** The statement says constant extra space. Does that rule out a hash map, even though it would be linear time?

**Interviewer:** Yes, I want O(1) extra space.

**Me:** Then I can't reuse the usual Two Sum answer. Values and target are between -1000 and 1000, so a sum of two values is at most 2000 in absolute value, nowhere near overflowing an `int`. The array has at least two elements and up to 30,000. I'll treat it as read-only, since nothing asks me to change it.

**Interviewer:** Fine.

**Me:** Quick example by hand: `[1, 3, 4, 7, 11]`, target 11. 1 + 11 is 12, too big. Even the smallest value overshoots when paired with 11, so 11 can't be in the answer. 1 + 7 is 8, too small, and 7 is now the largest remaining, so 1 is out. 3 + 7 is 10, 3 is out. 4 + 7 is 11. Positions 3 and 4.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| Sorted in non-decreasing order | The sum of two elements tells me which direction to move. This is the fact that makes O(1) extra space possible. |
| Exactly one solution | Return on the first match; no "not found" result. |
| Same element may not be used twice | The two positions must differ; a pointer pair must stop when the pointers meet. |
| 1-based output, `index1 < index2` | Add 1 to each 0-based index, and return the left one first. |
| Constant extra space | Rules out the hash map from Two Sum. A few index variables only. |
| 2 ≤ n ≤ 3 · 10^4 | Never empty. Brute force is about 4.5 · 10^8 pair checks at the top end, too slow to be the answer. |
| Values and target in [-1000, 1000] | Sums lie in [-2000, 2000], so `int` arithmetic is safe. Negatives occur, so no "skip values larger than the target" shortcut. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Equal values may form the answer | No special case: two different positions holding the same value are a legal pair. |
| A hash map does not count as constant space | The O(n)-expected-time hash solution is out, even though it would pass a judge. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The input is read-only | Not needed for any approach here, but it keeps the contract clear. |
| If the "exactly one solution" promise is broken, I throw | The statement says it cannot happen; throwing makes a bad input visible. |

### Edge cases I will keep in mind

- The smallest input: two elements, which must be the answer, `[2, 7]` with target 9.
- Two equal values forming the answer: `[-3, -3, 2, 5]` with target -6, and `[5, 5]` with target 10.
- Negative target and zero: `[-1, 0]` with target -1.
- The answer at the far ends `[-5, 1, 2, 9]` with target 4, or squeezed into a corner: `[1, 2, 4, 8, 16]` with target 24 (the last two) or target 3 (the first two).
- Long runs of duplicates, so that one pointer has to walk almost the whole array.

## 4. Think out loud: from first idea to best solution

> "This is Two Sum with two changes: the array is sorted and I'm not allowed O(n) memory. The sortedness is clearly the thing to use, but let me start from the baseline."

### Approach 1: Brute force (try every pair)

#### What I say out loud

> "Every pair of positions `i < j`, check the sum, return `[i + 1, j + 1]` on a match. It's O(n²) time and O(1) space, so it meets the memory rule. At 30,000 elements it's about 450 million pair checks. That's my correct fallback, not my answer."

#### Intuition

The answer is one of the n(n − 1) / 2 pairs, so checking every pair cannot miss it. This ignores the sorted order completely, which is a sign there is something better.

#### Algorithm

1. For each `i` from 0 to n − 2, for each `j` from `i + 1` to n − 1:
2. If `numbers[i] + numbers[j] == target`, return `[i + 1, j + 1]`.
3. If the loops finish, throw.

#### Why it is correct

It returns only after checking the sum, and `j > i` guarantees different positions and the required order `index1 < index2`. Every pair is visited, so the one valid pair is found.

#### Dry run

`numbers = [1, 3, 4, 7, 11]`, `target = 11`

| i | j values tried | Match? |
|---|---|---|
| 0 | 3, 4, 7, 11: sums 4, 5, 8, 12 | no |
| 1 | 4, 7, 11: sums 7, 10, 14 | no |
| 2 | 7: sum 11 | yes, return `[3, 4]` |

Eight sums in total, the last one the hit.

#### Java code

```java title="Approach 1: brute force"
class Solution {
    public int[] twoSum(int[] numbers, int target) {
        for (int i = 0; i < numbers.length - 1; i++) {
            for (int j = i + 1; j < numbers.length; j++) {
                if (numbers[i] + numbers[j] == target) {
                    return new int[] {i + 1, j + 1}; // the answer is 1-indexed
                }
            }
        }
        throw new IllegalArgumentException("No two numbers add up to the target");
    }
}
```

#### Time complexity

**O(n²) in the worst case**, n = `numbers.length`: up to n(n − 1) / 2 sums. For n = 3 · 10^4 that is 449,985,000 checks, reached when the answer is the last pair, for example `[-1000, …, -1000, 499, 500]` with target 999.

#### Space complexity

**O(1) auxiliary**: two loop indices and the two-element result.

#### The bridge to the next approach

> "As in Two Sum, the inner loop is a search for one known value, `target - numbers[i]`. Before, I sped that up with a hash map, which is now banned. But the array is sorted, and the standard way to find a value in a sorted array without extra memory is binary search."

### Approach 2: Binary search for each complement

#### What I say out loud

> "For each `i`, I binary search the part to the right of `i` for `target - numbers[i]`. Searching only to the right means I never pair an element with itself, and the index I find is automatically the larger one. That's n searches of log n each, with O(1) extra space. It's a real improvement, and it meets every constraint."

#### Intuition

The inner loop of the brute force does a linear scan for a known value. In a sorted range, [[a3-binary-search|binary search]] finds it in O(log n) by halving the range each step.

#### Algorithm

1. For each `i` from 0 to n − 2, let `need = target - numbers[i]`.
2. Binary search `numbers[i + 1 .. n − 1]` for `need`: `lo = i + 1`, `hi = n − 1`; while `lo <= hi`, compare `numbers[mid]` with `need` and halve.
3. If found at `mid`, return `[i + 1, mid + 1]`.

#### Why it is correct

- **Only valid answers:** it returns only when `numbers[mid] == target - numbers[i]`, and `mid >= i + 1 > i`, so the positions differ and come out in the right order.
- **It cannot miss the answer:** let the answer be at 0-based positions `p < q`. When the loop reaches `i = p` (it cannot return earlier, because the answer is unique), the range `[p + 1, n − 1]` contains `q`, and since the range is sorted, binary search finds some position holding the value `numbers[q]`. If the value occurs more than once in the range, it may find a different copy, but then that copy would form a second valid pair with `p`, which the statement rules out. So the copy found is `q`.

#### Dry run

`numbers = [1, 3, 4, 7, 11]`, `target = 11`

| i | numbers[i] | need | Range searched | Result |
|---|---|---|---|---|
| 0 | 1 | 10 | indices 1–4: `[3, 4, 7, 11]` | not found |
| 1 | 3 | 8 | indices 2–4: `[4, 7, 11]` | not found |
| 2 | 4 | 7 | indices 3–4: `[7, 11]` | `mid = 3`, `numbers[3] = 7`, return `[3, 4]` |

#### Java code

```java title="Approach 2: binary search for each complement"
class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int n = numbers.length;
        for (int i = 0; i < n - 1; i++) {
            int need = target - numbers[i];
            // Binary search for need, only to the right of i so an element never pairs with itself.
            int lo = i + 1;
            int hi = n - 1;
            while (lo <= hi) {
                int mid = lo + (hi - lo) / 2;
                if (numbers[mid] == need) {
                    return new int[] {i + 1, mid + 1};
                }
                if (numbers[mid] < need) {
                    lo = mid + 1;
                } else {
                    hi = mid - 1;
                }
            }
        }
        throw new IllegalArgumentException("No two numbers add up to the target");
    }
}
```

#### Time complexity

**O(n log n) in the worst case.** Up to n − 1 searches, each over at most n − 1 elements, so each takes at most about log₂ n + 1 iterations (about 15 for n = 3 · 10^4).

#### Space complexity

**O(1) auxiliary**: a handful of `int` variables. No recursion.

#### The bridge to the next approach

> "Every binary search starts from scratch. But the searches are related: as `i` moves right, `numbers[i]` grows, so the value I need, `target - numbers[i]`, shrinks. Its position can only move left. So instead of searching the whole range each time, I could keep a second index that only ever moves left. That's two pointers, and it should make the whole thing linear."

> "Let me also think about it the other way, as eliminating elements. If I add the smallest and the largest value and the sum is too small, the smallest value is useless: its best possible partner wasn't enough. That's the exact argument from the sorted version of Two Sum, and here I don't even need to sort."

### Alternative: the hash map from Two Sum

The one-pass hash map from [[nc-two-sum|Two Sum]] works unchanged (adding 1 to each index): O(n) expected time and O(n) extra space. It ignores the sorted order and breaks the constant-space rule, so it is not an acceptable answer here. Mention it in one sentence to show you know why it is excluded, not as a candidate.

### Approach 3: Two pointers from both ends (recommended)

#### What I say out loud

> "One index at the left end, one at the right. I add the two values. Equal to the target: done. Too small: the left value can't be in the answer, because I paired it with the largest value still available and it still fell short, so I move left forward. Too big: the right value can't be in the answer for the mirror reason, so I move right back. Each step discards one element for good, so it's at most n − 1 steps, with two integers of extra memory."

#### Intuition

In sorted order, `numbers[left] + numbers[right]` is the largest sum the left element can make inside the window and the smallest sum the right element can make. Comparing it with the target therefore condemns one of them. This is the converging pair from [[a2-two-pointers|Two Pointers]], the same scan as Approach 2 of Two Sum but without the sort and the index bookkeeping, because the array is already in order and the positions are the answer.

#### Algorithm

1. `left = 0`, `right = n − 1`.
2. While `left < right`: `sum = numbers[left] + numbers[right]`.
3. If `sum == target`, return `[left + 1, right + 1]`.
4. If `sum < target`, `left++`; otherwise `right--`.

#### Why it is correct

**Invariant:** the answer's two positions `p < q` both lie in `[left, right]`.

- **Initially** the window is the whole array.
- **A step when the sum is too small.** Could `left` be `p`? Its partner `q` is at most `right`, and the array is sorted, so `numbers[q] <= numbers[right]` and `numbers[left] + numbers[q] <= sum < target`. So `left` is not `p`. It is not `q` either, since `q > p >= left`. Removing it keeps both answer positions inside.
- **A step when the sum is too big:** the mirror argument removes `right`.
- **Termination:** each step shrinks the window by one. The window cannot shrink past the answer, so while `p` and `q` are both inside and different, the loop is still running; eventually `left = p` and `right = q`, the sum equals the target, and it returns.
- **Only valid answers:** it returns only on an exact match with `left < right`, which gives different positions in the required order.

**The 20-second version to say to the interviewer:**

> "I keep the answer inside the window `[left, right]`. If the sum is too small, the left value can't be in the answer, because even the largest remaining value doesn't lift it to the target; if it's too big, the right value can't be, by the same argument. So each step throws away an element that can't be part of the pair, and the window closes in on the answer without ever passing it."

#### Dry run

`numbers = [1, 3, 4, 7, 11]`, `target = 11`

| left | right | Values | Sum | Action |
|---|---|---|---|---|
| 0 | 4 | 1 + 11 | 12 | too big, `right--` |
| 0 | 3 | 1 + 7 | 8 | too small, `left++` |
| 1 | 3 | 3 + 7 | 10 | too small, `left++` |
| 2 | 3 | 4 + 7 | 11 | match, return `[3, 4]` |

`numbers = [-3, -3, 2, 5]`, `target = -6`

| left | right | Values | Sum | Action |
|---|---|---|---|---|
| 0 | 3 | -3 + 5 | 2 | too big, `right--` |
| 0 | 2 | -3 + 2 | -1 | too big, `right--` |
| 0 | 1 | -3 + -3 | -6 | match, return `[1, 2]` |

#### Java code

```java title="Approach 3: two pointers (recommended)"
class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int left = 0;
        int right = numbers.length - 1;
        // Invariant: if the answer exists, both of its indices lie in [left, right].
        while (left < right) {
            int sum = numbers[left] + numbers[right];
            if (sum == target) {
                return new int[] {left + 1, right + 1}; // 1-indexed
            }
            if (sum < target) {
                left++;  // numbers[left] is too small even with the largest partner left
            } else {
                right--; // numbers[right] is too big even with the smallest partner left
            }
        }
        throw new IllegalArgumentException("No two numbers add up to the target");
    }
}
```

#### Time complexity

**O(n) in the worst case**, no hashing involved. The window starts with n elements; each iteration removes one or returns, so there are at most n − 1 iterations, each constant work. The worst case is a pointer walking almost the whole array, such as `[-1000, …, -1000, 499, 500]` with target 999, where `left` moves n − 2 times.

#### Space complexity

**O(1) auxiliary**: two indices and the sum. The input is not modified.

## 5. Comparison table

n = `numbers.length`.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Brute force | O(n²) | O(n²) | O(1) |
| 2. Binary search per element | O(n log n) | O(n log n) | O(1) |
| Alt. Hash map (Two Sum) | O(n) | O(n²) in general for hash tables | O(n): breaks the constraint |
| 3. Two pointers | O(n) | O(n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Brute force | Correct by inspection, since it checks every pair | Quadratic; ignores the sorted order | Only as the stated baseline |
| 2. Binary search | Meets the space rule; uses a well-known tool | Extra log factor; off-by-one risk in the search bounds | When only a few complements must be looked up in a large sorted array |
| Alt. Hash map | Familiar from Two Sum | O(n) memory, forbidden here; expected rather than guaranteed time | Never for this problem; it is the answer for unsorted input |
| 3. Two pointers | Linear, guaranteed, O(1) space, shortest code | Needs sorted input | The default answer |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** two pointers (Approach 3).

**Is it optimal?** In space, yes: O(1). In time, it is linear, and in general you cannot do better. As long as values may grow with n, you can build sorted arrays in which the pairs `(i, n − 1 − i)` all sum to one less than the target, and then raise exactly one element by 1 (spacing values 10 apart keeps the order and keeps every other pair far from the target). An algorithm that has not read either element of one of those roughly n / 2 pairs cannot tell whether that pair is the answer, so it needs about n / 2 reads in the worst case: an Ω(n) worst-case lower bound for algorithms that learn about the array only by reading its entries. Two pointers matches it.

**When another approach is better in practice:** if you need to answer many different targets on the same sorted array, or look up only a handful of complements, binary search touches fewer elements per query. For one target, two pointers wins.

**When to stop:** once you have the two-pointer scan and its invariant. There is nothing left to improve asymptotically in time or space; spend the remaining minutes on testing and on the 1-based return.

## 7. Interview script: code it and test it

### What I say while coding

> "Signature `int[] twoSum(int[] numbers, int target)`. Two indices at the ends. The loop condition is `left < right`, strictly, because the two positions must differ."

> "The sum is at most 2000 in absolute value, so `int` is fine."

> "On a match I return `left + 1` and `right + 1`: the problem counts from 1, and `left < right` gives the required order for free."

> "Too small moves `left`, too big moves `right`. I'll say the reason as I write each line, because that reason is the correctness proof."

### Testing out loud

**Normal case:** Example 1 as in the dry run: 12, 8, 10, 11, returns `[3, 4]`.

**Equal values:** Example 2: sums 2 and -1 move `right` down twice, then -3 + -3 = -6 returns `[1, 2]`. Equal values need no special handling, because the pointers are at different positions.

**Smallest input:** `[2, 7]`, target 9. `left = 0`, `right = 1`, sum 9, returns `[1, 2]`.

**Negative target with zero:** `[-1, 0]`, target -1: sum -1, returns `[1, 2]`.

**Answer at the right end:** `[1, 2, 4, 8, 16]`, target 24. Sums 17, 18, 20, 24 move `left` three times, then return `[4, 5]`. **At the left end:** target 3: sums 17, 9, 5, 3 move `right` three times, return `[1, 2]`.

**1-based check:** before saying "done", I look at the return statement once more. Returning `[left, right]` is the most common way to fail this problem with a correct algorithm.

## 8. Time plan for the interview

Usually 15 minutes or less; if it follows Two Sum, the interviewer expects the hash map to be ruled out quickly.

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1–2 min | 1-based output, duplicates, the meaning of constant space |
| Brute force and binary search | 2 min | State both with costs; code neither unless asked |
| Two pointers and the invariant | 2–3 min | The elimination argument, before coding |
| Code | 2–3 min | Six lines |
| Test | 2 min | Example, equal values, both corner positions |
| Complexity and follow-ups | 2+ min | O(n) guaranteed, O(1) space, the 3Sum extension |

**Where the time should go:** the elimination argument. Many candidates know to "move the pointer", but cannot say why that never skips the answer; that sentence is what this problem tests.

**If stuck:** say the binary search version and code it if needed; it already meets every constraint. Then ask: "as `i` moves right, which way does the position of the complement move?"

## 9. Interviewer challenges

### About correctness

#### Why can't moving a pointer skip the answer?

**What they are testing:** whether you can state and use the invariant, or only recall the moves.

**How to reason:** look at the element you are about to discard and ask whether it could be in any valid pair within the window.

**What I say:** "When the sum is too small, the left value paired with the largest value still in the window falls short, and every other partner in the window is no larger, so the left value can't be in the answer. When it's too big, the mirror argument removes the right value. So I only ever discard elements that can't be in the answer, and the answer stays inside the window until the pointers land on it."

**Nuance:** the argument needs only the sorted order and the fact that the discarded element is at the window's edge; it does not need the values to be distinct.

#### What happens with duplicates?

**What they are testing:** whether equal values, which the statement allows, break anything.

**How to reason:** the pointers are positions, not values; the loop condition keeps them apart.

**What I say:** "Nothing special. Two equal values at different positions are a legal answer, and the scan reaches them like any other pair: `[-3, -3, 2, 5]` with target -6 returns `[1, 2]`. Runs of equal values only mean a pointer may step over several copies, each discarded by the same argument."

**Nuance:** in the binary search version, a run of duplicates means the search may land on any copy. That is harmless here only because the answer is unique, which section 4 argues.

### About the design

#### Why not just use the hash map from Two Sum?

**What they are testing:** whether you read the constraints, and whether you can say what the hash map is for.

**How to reason:** the hash map stores what has been seen, to replace order. Here the order is given.

**What I say:** "It would work and run in expected linear time, but it uses O(n) extra memory, and the problem asks for constant. More to the point, the map exists to remember values because the array has no order. Here it does, and the order gives me the direction to move without remembering anything. So two pointers are both cheaper and guaranteed linear."

**Nuance:** the hash version's time is only expected O(n); two pointers give O(n) in the worst case.

#### Why is the binary search version slower if both use the sorted order?

**What they are testing:** whether you see the repeated work between searches.

**How to reason:** compare where consecutive searches end up.

**What I say:** "Each binary search starts from the full range, even though the complement's position only moves left as `i` moves right. Two pointers keep that position from one step to the next, so the total movement of the right pointer over the whole run is at most n. That removes the log factor."

**Nuance:** this "the answer moves monotonically, so keep a pointer instead of searching" idea is the same one behind merging two sorted lists.

## 10. Follow-up questions the interviewer might ask

**"What if there could be several pairs, and you need all of them (as value pairs, without repeats)?"**
On a match, record it, then move both pointers past their current values (skip equal neighbours) so the same value pair is not reported twice. Still O(n) time, O(1) extra space besides the output. This is the inner loop of [[nc-3sum|3Sum]].

**"What if you need the number of index pairs instead?"**
On a match with different values, count the run of equal values at each end and add the product of the two run lengths; if both pointers sit inside one run of equal values, add `k(k − 1) / 2` for its length k. O(n) time. The count can reach n(n − 1) / 2, about 4.5 · 10^8 here, which still fits in an `int`, but use `long` if n can grow.

**"What if the target changes for many queries on the same array?"**
Each query is an independent O(n) scan. If queries greatly outnumber elements and only existence matters, precompute the set of all pair sums once in O(n²) expected time and space, then answer each query in O(1) expected.

**"What about three numbers?"**
Fix the first number, then run this scan on the part to its right: O(n²). That is [[nc-3sum|3Sum]], and adding one more fixed number gives [[nc-4sum|4Sum]].

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Reusing the Two Sum hash map.** It passes a judge but violates the stated space limit. Read the constraints before reaching for the familiar answer.
- **Not being able to justify the pointer moves.** "Too small, so move left" is the rule; "the left value cannot reach the target with any remaining partner" is the reason, and the interviewer wants the reason.
- **Sorting again.** The array is already sorted; an extra sort costs O(n log n) for nothing.

### Implementation mistakes

> [!MISTAKE] Returning 0-based indices
> `return new int[] {left, right};` returns `[2, 3]` for Example 1 instead of `[3, 4]`. The algorithm is right and the answer is wrong. Add 1 to both.

- **`while (left <= right)`.** When the pointers meet, `numbers[left] + numbers[right]` adds an element to itself. With `[1, 2, 4]` and target 4 there is no valid pair, but `2 + 2` would be reported as `[2, 2]`. Under the statement's guarantee the strict loop always returns first, so `<` is both correct and safe.
- **Binary searching from 0 instead of `i + 1`.** The search can find `i` itself when `numbers[i]` is half the target, or return the two positions in the wrong order.
- **Computing `mid = (lo + hi) / 2`.** It is safe here (indices are at most 3 · 10^4), but `lo + (hi - lo) / 2` is the habit that stays safe for larger ranges.

## 12. Pattern recognition

**The pattern:** converging two pointers on sorted data. The sum at the two ends tells you which end cannot be part of the answer.

**Signals in the problem statement:**

- The input is sorted, or sorting it costs nothing that matters.
- A pair must hit an exact target, or be as close as possible to one.
- O(1) extra space is required.

**Related problems in this list:**

- [[nc-two-sum|Two Sum]]: the same question on unsorted input, where a hash map wins.
- [[nc-3sum|3Sum]]: fix one element and run this scan on the rest, with duplicate skipping.
- [[nc-4sum|4Sum]]: two fixed elements plus this scan, and the overflow care that comes with large values.
- [[nc-container-with-most-water|Container With Most Water]]: the same "discard the end that cannot do better" argument, applied to areas.
- [[nc-boats-to-save-people|Boats to Save People]]: pair the lightest with the heaviest on sorted weights.
- [[nc-valid-palindrome|Valid Palindrome]]: two pointers from both ends, without the sum.

**Takeaway:** on sorted input, a pair problem with a target is usually a two-pointer scan; prove each move by showing the discarded element has no possible partner left.

## 13. 60-second revision card

**Key insight:** if the sum of the two ends is too small, the left value is useless (its best partner was not enough); if too big, the right value is. Discard it and continue.

**Invariant:** the answer's two positions stay inside `[left, right]`.

**Complexity:** O(n) worst-case time, O(1) auxiliary space. Binary search per element is O(n log n); the hash map is O(n) space and not allowed.

**Code skeleton:**

```java title="Two pointers in eight lines" fragment="public int[] twoSum(int[] numbers, int target)"
int left = 0, right = numbers.length - 1;
while (left < right) {
    int sum = numbers[left] + numbers[right];
    if (sum == target) return new int[] {left + 1, right + 1};
    if (sum < target) left++;
    else right--;
}
```

**Main traps:**

- The output is 1-based.
- `left < right`, not `<=`: an element cannot pair with itself.
- A hash map breaks the constant-space rule.

**What to say in one breath:** "The array is sorted, so I put pointers at both ends. If the sum is too small, the left value can't reach the target with any remaining partner, so I drop it; if it's too big, I drop the right value. The answer never leaves the window, so in at most n − 1 steps I land on it: O(n) time, O(1) space, and I return the indices plus one."
