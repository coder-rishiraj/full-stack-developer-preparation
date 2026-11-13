---
problemId: nc-trapping-rain-water
title: Trapping Rain Water
source: neetcode
sourceUrl: https://leetcode.com/problems/trapping-rain-water/
difficulty: hard
patterns: [two-pointers, prefix-sum, stack]
relatedLessons: [a2-two-pointers, a2-prefix-suffix, a5-monotonic-stack, a14-brute-force-first, a14-deriving-optimization]
companies: []
timeToSolve: 30
---

## 1. Problem restatement

You get an array `height` of n non-negative integers. It describes a landscape of solid bars, each one unit wide, standing side by side: bar i is `height[i]` units tall. Rain falls on it, and water settles in the dips between bars; whatever is not enclosed runs off the two ends. Return the total amount of water that stays, in square units (one unit wide, one unit high).

**Example 1**

- Input: `height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]`
- Output: `6`
- Why: 1 unit sits above index 2 (between the bars of height 1 and 2), 4 units fill the dip at indices 4 to 6 (1 + 2 + 1, held at level 2 by the bars at indices 3 and 7), and 1 unit sits above index 9 (between the 2s at indices 8 and 10). Everything else runs off or has no dip under it.

**Example 2**

- Input: `height = [4, 2, 0, 3, 2, 5]`
- Output: `9`
- Why: the bars at the ends, 4 and 5, hold the water at level 4. Above the four inner bars that is 4 − 2, 4 − 0, 4 − 3 and 4 − 2, which add up to 2 + 4 + 1 + 2 = 9. The inner bar of height 3 is under water, not a wall.

**What the problem statement guarantees**

- n == `height.length`, and 1 ≤ n ≤ 2 × 10^4.
- 0 ≤ `height[i]` ≤ 10^5.
- Every bar has width 1, and the answer is a single total.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. This is a hard problem because the first idea most people have, finding "pools" between walls, is awkward to code correctly. The clean solutions come from asking the right small question. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 30 minutes and talk out loud.
2. Draw Example 2 on paper as bars and shade the water by hand.
3. Instead of looking for pools, pick a single column and ask how high the water stands above that one column. Write down what it depends on.
4. Turn that into a correct solution, however slow, and state its complexity.
5. Then remove the repeated work. Finally, see whether you can get the extra memory down to a constant.
6. Trace your final code on Example 1, column by column.

Open a hint only after two minutes without progress. After each hint, close it and try again before opening the next one.

> [!HINT] Hint 1: a small nudge
> Look at one column only. Water above it would run off to the left unless something on the left is at least as tall as the water, and the same on the right. So what is the highest the water above this column can stand?

> [!HINT] Hint 2: the kind of tool you need
> The water above column i is the smaller of "the tallest bar from the start up to i" and "the tallest bar from i to the end", minus `height[i]`. Both of those are running maximums, and running maximums can be computed for every index in one sweep each.

> [!HINT] Hint 3: almost the whole plan
> Walk inwards from both ends at once, keeping the tallest bar seen so far on each side. Whichever side has the smaller of these two maximums: its next column's water level is decided already, even though you have not seen the bars in the middle. Work out why, then settle that column and step inwards on that side.

**Check yourself before revealing the walkthrough**

- [ ] I can state the water above one column as a formula, and explain why it is never negative
- [ ] I have an O(n) time solution, and can say how much extra memory it uses
- [ ] My code returns 6 for Example 1, 9 for Example 2, and 0 for `[5]` and `[2, 7]`
- [ ] I can explain why a column can be settled before every bar has been seen
- [ ] I checked whether the total fits in an `int`

## 3. Interview script: understand the problem (≈3 min)

**Me:** Let me say it back. The array is a row of bars, each one unit wide. After rain, water collects wherever it is enclosed on both sides, and I return the total amount of water. Water that isn't enclosed flows off the ends.

**Interviewer:** That's right.

**Me:** The bars are solid and water can't leak between them or under them?

**Interviewer:** Yes, solid bars, and the ground is sealed.

**Me:** And outside the array there's nothing: the ends are open, so the first and last bars can only act as walls, never hold water above themselves?

**Interviewer:** Correct.

**Me:** Sizes: how long is the array, and how tall can bars be?

**Interviewer:** 1 to 2 × 10^4 bars, heights from 0 to 10^5.

**Me:** So an array of length 1 or 2 is possible, and those trap nothing: there's no column with a wall on both sides. And quadratic would be about 4 × 10^8 simple steps, which might pass, but I'd like linear.

**Me:** Let me check the size of the answer before I pick a type. Above any column the water is at most 10^5 deep, and the two end columns can't hold any. So the total is at most (n − 2) × 10^5 = 19,998 × 10^5 = 1,999,800,000. `Integer.MAX_VALUE` is 2,147,483,647, so it fits in an `int`, but with only about 7% headroom. I'll keep every term I add non-negative so no partial sum goes above the final total, and I'll mention `long` if the limits were larger.

**Me:** Let me do Example 2 by hand: `[4, 2, 0, 3, 2, 5]`. The left end is 4, the right end is 5, so between them water can rise to 4 before spilling over the left wall. Over the bar of height 2 that's 2 units, over the 0 it's 4, over the 3 it's 1, over the 2 it's 2. Total 9. And I notice I just reasoned one column at a time, with "the lower of the two walls". That's probably the idea to build on.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 2 × 10^4 | n = 1 and n = 2 are valid and must return 0. An O(n²) solution is about 4 × 10^8 steps at the maximum; linear is the target. |
| 0 ≤ height[i] ≤ 10^5 | Water above one column is at most 10^5. The total is at most (n − 2) × 10^5 = 1,999,800,000 < 2^31 − 1, so an `int` holds it if every added term is non-negative. |
| Bars have width 1 | The water above a column is just its depth; no widths to multiply, except in the layer-by-layer view, where a layer's width is a column count. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Bars are solid and the ground is sealed | Water can only escape over the top of a bar or off an end, so the water level at a column depends only on the bars to its left and right. |
| The two ends are open | The first and last columns hold no water. It also means "nothing on that side" acts like a wall of height 0. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The input is read-only | Nothing says I may change it, and none of the approaches needs to. |
| The answer is returned as an `int` | The signature says so, and the bound above shows it fits under these constraints. |

### Edge cases I will keep in mind

- n = 1 and n = 2: `[5]`, `[2, 7]`. Nothing is trapped.
- Monotonic landscapes: `[1, 2, 3, 4]` or `[4, 3, 2, 1]`. Water runs off the low end: 0.
- Flat: `[3, 3, 3]`, and all zeros. 0.
- V-shaped: `[3, 1, 0, 1, 3]`, the deepest point in the middle: 2 + 3 + 2 = 7.
- Plateaus and equal walls: `[2, 0, 2, 2, 0, 2]`, two pools separated by a flat top: 2 + 2 = 4.
- An inner bar taller than one end: Example 2's bar of height 3 is under water, not a wall.
- The overflow extreme: `[100000, 0, 0, …, 0, 100000]` with n = 2 × 10^4, which traps exactly 1,999,800,000.

## 4. Think out loud: from first idea to best solution

> "My first instinct is to find pools: a wall, a dip, another wall, and fill between them. But pools nest. In Example 1 the pool from index 3 to 7 contains a small bump, and in general a pool between two walls can contain smaller walls whose own pools are under the bigger pool's water. Tracking that by hand gets messy. Let me ask a smaller question instead: forget pools, how high does the water stand above **one column**?"

### Approach 1: Per-column brute force

#### What I say out loud

> "Take column i. Water above it would escape to the left unless there's a bar on the left at least as tall as the water surface. Not necessarily the adjacent bar: any bar between i and the left end will do, because anything shorter in between would just be under water. So the surface can be at most the tallest bar on the left. Same on the right. So the surface is at most the smaller of those two maximums."

> "And it really does reach that level: if the lower of the two tallest walls is W, then every point between those two walls is enclosed up to height W, so water fills up to W. So the surface above column i is exactly the minimum of the two maximums, and the water there is that minus the bar's own height."

> "One detail: I'll include column i itself in both maximums. Then if the bar is taller than everything around it, the minimum is the bar's own height and the water is 0, never negative. It also makes the end columns hold zero automatically."

> "The direct implementation scans left and right from every column: O(n²) time, O(1) space."

#### Intuition

For column i, define

- `maxLeft(i)` = the tallest bar among indices 0 to i (including i),
- `maxRight(i)` = the tallest bar among indices i to n − 1 (including i).

Then

**water above column i = min(maxLeft(i), maxRight(i)) − height[i].**

The water surface is set by the lower of the two highest walls around the column. The total is the sum over all columns. This turns a problem about pools of irregular shape into n independent questions, one per column.

#### Algorithm

1. `water = 0`.
2. For each i from 0 to n − 1:
   1. Scan indices 0..i for the maximum, `leftMax`.
   2. Scan indices i..n − 1 for the maximum, `rightMax`.
   3. Add `min(leftMax, rightMax) − height[i]` to `water`.
3. Return `water`.

#### Why it is correct

The whole page rests on the formula, so it is worth saying why it is right in both directions. Let `level(i) = min(maxLeft(i), maxRight(i))`.

- **The water cannot stand higher than `level(i)`.** Say `maxLeft(i)` is the smaller one. Every bar from the left end to column i is at most `maxLeft(i)` tall, so water above that height at column i would flow left over all of them and off the open end. The same reasoning applies on the right if `maxRight(i)` is smaller.
- **The water does stand that high.** Let p ≤ i be a position of a bar of height `maxLeft(i)` and q ≥ i a position of a bar of height `maxRight(i)`. Everything strictly between p and q is enclosed by two walls at least `level(i)` tall, so rain fills that span up to `level(i)` (bars between them that are taller only displace water, and if a bar at i itself reaches `level(i)` there is simply no water above it).
- **Never negative.** Both maximums include `height[i]`, so `level(i) ≥ height[i]`.
- **The ends hold nothing.** For i = 0, `maxLeft(0) = height[0]`, so `level(0) ≤ height[0]` and the water is 0. The same for i = n − 1.

Summing a correct value per column gives the correct total, and each column is counted once.

#### Dry run

Example 2: `height = [4, 2, 0, 3, 2, 5]`

| i | height[i] | maxLeft(i) | maxRight(i) | level = min | water above i | running total |
|---|---|---|---|---|---|---|
| 0 | 4 | 4 | 5 | 4 | 0 | 0 |
| 1 | 2 | 4 | 5 | 4 | 2 | 2 |
| 2 | 0 | 4 | 5 | 4 | 4 | 6 |
| 3 | 3 | 4 | 5 | 4 | 1 | 7 |
| 4 | 2 | 4 | 5 | 4 | 2 | 9 |
| 5 | 5 | 5 | 5 | 5 | 0 | 9 |

Returns 9. Column 3 shows why "the nearest taller bar" is the wrong wall: its nearest neighbours are 0 and 2, but the walls that matter are the 4 and the 5.

#### Java code

```java title="Approach 1: per-column brute force"
class Solution {
    public int trap(int[] height) {
        int n = height.length;
        int water = 0;
        for (int i = 0; i < n; i++) {
            int leftMax = 0;
            for (int j = 0; j <= i; j++) {          // includes i itself
                leftMax = Math.max(leftMax, height[j]);
            }
            int rightMax = 0;
            for (int j = i; j < n; j++) {           // includes i itself
                rightMax = Math.max(rightMax, height[j]);
            }
            water += Math.min(leftMax, rightMax) - height[i];   // never negative
        }
        return water;
    }
}
```

#### Time complexity

**O(n²) in every case**, where n is the number of bars. For each of the n columns the two scans together read i + 1 and n − i bars, n + 1 in total, so the method reads n(n + 1) bars. For n = 2 × 10^4 that is about 4 × 10^8 constant-time steps: it may finish within a time limit, but it is the cost to remove.

#### Space complexity

**O(1) auxiliary space**: a handful of `int` variables. The input is not counted and not modified.

#### The bridge to the next approach

> "Where does the time go? Every column rescans to find `maxLeft` and `maxRight`. But those are the same running maximums over and over. `maxLeft(i)` is just `max(maxLeft(i − 1), height[i])`: the tallest bar up to i is either the tallest up to i − 1 or bar i itself. So one left-to-right sweep computes all of them. Likewise `maxRight(i) = max(maxRight(i + 1), height[i])` in one right-to-left sweep."

> "If I store both in arrays, each column's water is a constant-time lookup. That's O(n) time for O(n) extra memory. Let me do that first; then I'll see whether I really need both arrays."

### Approach 2: Prefix and suffix maximum arrays

#### What I say out loud

> "Three passes. Left to right, fill `leftMax[i]`, the tallest bar from 0 to i. Right to left, fill `rightMax[i]`, the tallest bar from i to the end. Then one more pass adds `min(leftMax[i], rightMax[i]) − height[i]` for every column. Same formula as before, without the rescanning."

#### Intuition

The brute force computes the same prefix maximums n times. Store each prefix maximum and each suffix maximum once: the [[a2-prefix-suffix|prefix and suffix]] technique, with `max` in place of `+`. The formula itself does not change.

#### Algorithm

1. `leftMax[0] = height[0]`; for i = 1..n − 1, `leftMax[i] = max(leftMax[i − 1], height[i])`.
2. `rightMax[n − 1] = height[n − 1]`; for i = n − 2 down to 0, `rightMax[i] = max(rightMax[i + 1], height[i])`.
3. `water = Σ (min(leftMax[i], rightMax[i]) − height[i])` over all i.

#### Why it is correct

The recurrences compute exactly `maxLeft(i)` and `maxRight(i)` (the tallest bar in 0..i is the tallest in 0..i − 1 or bar i; by induction from i = 0), and then each column's water is the proven formula from Approach 1. Nothing else changes.

#### Dry run

Example 1: `height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]`

| i | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| height | 0 | 1 | 0 | 2 | 1 | 0 | 1 | 3 | 2 | 1 | 2 | 1 |
| leftMax | 0 | 1 | 1 | 2 | 2 | 2 | 2 | 3 | 3 | 3 | 3 | 3 |
| rightMax | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 2 | 2 | 2 | 1 |
| min | 0 | 1 | 1 | 2 | 2 | 2 | 2 | 3 | 2 | 2 | 2 | 1 |
| water | 0 | 0 | 1 | 0 | 1 | 2 | 1 | 0 | 0 | 1 | 0 | 0 |

Sum of the last row: 1 + 1 + 2 + 1 + 1 = 6. Notice where `min` comes from: left of the tallest bar (index 7) it is always `leftMax`, right of it always `rightMax`. That observation is the seed of the next approach.

#### Java code

```java title="Approach 2: prefix and suffix maximum arrays"
class Solution {
    public int trap(int[] height) {
        int n = height.length;
        int[] leftMax = new int[n];   // leftMax[i] = tallest bar in height[0..i]
        int[] rightMax = new int[n];  // rightMax[i] = tallest bar in height[i..n-1]

        leftMax[0] = height[0];
        for (int i = 1; i < n; i++) {
            leftMax[i] = Math.max(leftMax[i - 1], height[i]);
        }
        rightMax[n - 1] = height[n - 1];
        for (int i = n - 2; i >= 0; i--) {
            rightMax[i] = Math.max(rightMax[i + 1], height[i]);
        }

        int water = 0;
        for (int i = 0; i < n; i++) {
            water += Math.min(leftMax[i], rightMax[i]) - height[i];
        }
        return water;
    }
}
```

`n ≥ 1` is guaranteed, so `height[0]` and `height[n − 1]` always exist; for n = 1 both loops that start at 1 and at n − 2 do nothing, and the answer is 0.

#### Time complexity

**O(n) in every case**: three passes of n steps each, constant work per step.

#### Space complexity

**O(n) auxiliary space**: two `int` arrays of length n, 2 × 2 × 10^4 × 4 bytes ≈ 160 KB at the maximum. Small in practice, but it is the thing an interviewer will ask you to remove.

#### The bridge to the next approach

> "Can I get rid of the arrays? `leftMax` is easy to keep as a single running variable if I sweep left to right. The problem is `rightMax`: at column i in a left-to-right sweep, I haven't seen the bars to the right yet."

> "But look at the formula again: I only need the *smaller* of the two maximums. Suppose I've seen the bars from the left end up to column `left`, and also the bars from the right end down to some column `right` further along. I know `leftMax` exactly for column `left`. For the right side I don't know `maxRight(left)` exactly, but I know it's at least the `rightMax` I've seen, because it's a maximum over a bigger range that includes those bars. So if `leftMax ≤ rightMax`, the right side is at least as tall as the left one, and the minimum is `leftMax`, decided, without knowing what's in the middle."

> "That suggests walking in from both ends and always settling the side whose maximum is smaller. It's the same pattern as the dry-run table: left of the tallest bar the left maximum decides, right of it the right maximum decides; the two pointers find out which side they're on as they go."

### Approach 3: Two pointers with running maximums (recommended)

#### What I say out loud

> "I keep two pointers, `left` at the start and `right` at the end, and two running maximums: `leftMax` is the tallest bar from index 0 up to `left`, and `rightMax` is the tallest bar from `right` to the end. The columns from `left` to `right` are the ones I haven't settled yet."

> "Each step, I update both maximums with the bars under the pointers. If `leftMax ≤ rightMax`, I settle column `left`: its water is `leftMax − height[left]`, and I move `left` right. Otherwise I settle column `right` with `rightMax − height[right]` and move `right` left. When the window is empty, every column is settled."

> "Why can I settle column `left` without knowing the bars in the middle? Its left wall is exactly `leftMax`. Its right wall is the tallest bar from `left` to the end, which includes all the bars from `right` to the end, so it's at least `rightMax`, and `rightMax` is already at least `leftMax`. The bars I haven't seen can only make the right wall taller, never shorter. So the lower wall is the left one, and the water level is `leftMax`."

#### Intuition

The water at a column is decided by its **lower** wall. You do not need to know the higher wall exactly; you only need to know that it is at least as high as the lower one. A running maximum from the far side gives exactly such a lower bound. So whichever side currently has the smaller maximum can settle its next column for certain. This is the converging-pointers idea from [[a2-two-pointers|Two Pointers]]: each step discards one column from the window, here because its answer is already known.

#### Algorithm

1. `left = 0`, `right = n − 1`, `leftMax = 0`, `rightMax = 0`, `water = 0`.
2. While `left ≤ right`:
   1. `leftMax = max(leftMax, height[left])`; `rightMax = max(rightMax, height[right])`.
   2. If `leftMax ≤ rightMax`: add `leftMax − height[left]` to `water`, then `left++`.
   3. Otherwise: add `rightMax − height[right]` to `water`, then `right--`.
3. Return `water`.

#### Why it is correct

**The invariant**, true at the top of every iteration:

- the columns `0..left − 1` and `right + 1..n − 1` have been settled, each with its correct water, and the columns `left..right` have not been counted;
- `leftMax` is the tallest bar in `0..left − 1` (0 if that range is empty), and `rightMax` is the tallest bar in `right + 1..n − 1` (0 if empty).

After step 2.1, `leftMax` covers `0..left` and `rightMax` covers `right..n − 1`.

**The key step: settling the side with the smaller maximum.** Suppose `leftMax ≤ rightMax` after the update. For column `left`:

- `maxLeft(left)` is the tallest bar in `0..left`, which is exactly `leftMax`.
- `maxRight(left)` is the tallest bar in `left..n − 1`. Since `left ≤ right`, that range contains `right..n − 1`, so `maxRight(left) ≥ rightMax ≥ leftMax`.
- Therefore `min(maxLeft(left), maxRight(left)) = leftMax`, and the correct water is `leftMax − height[left]`, which is what the code adds. It is never negative, because `leftMax` includes `height[left]`.

In words: the unseen bars between the pointers can only raise the right wall, and the right wall is already no lower than the left one, so they cannot change the answer for column `left`. The case `leftMax > rightMax` is the mirror image and settles column `right` with `rightMax`.

**It settles every column exactly once.** Each iteration settles one column of the window `left..right` and shrinks the window by one, and both maximums keep their meaning (moving `left` right after `leftMax` already includes `height[left]` keeps the invariant). The loop runs while the window is non-empty, so it runs exactly n times and stops when every column is settled. When `left == right`, both maximums include that last column and either branch gives it the correct water.

**Ties.** When `leftMax == rightMax`, the argument for the left side still works (it needs only `rightMax ≥ leftMax`), so settling the left side is correct. Settling the right side would be too.

**The 25-second version to say to the interviewer:**

> "The water at a column is the lower of its two walls minus its height. I walk in from both ends with the tallest bar seen on each side. If the left maximum is the smaller one, the left column's left wall is exactly that maximum, and its right wall is at least the right maximum, because the bars I haven't seen can only make it taller. So the left wall decides, I add `leftMax − height[left]`, and move on. Symmetric on the right. Each step settles one column, so it's O(n) time and O(1) space."

#### Dry run

Example 1: `height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]`. `leftMax` and `rightMax` are shown after the update in step 2.1.

| Step | left | right | leftMax | rightMax | Decision | Water added | Total |
|---|---|---|---|---|---|---|---|
| 1 | 0 | 11 | 0 | 1 | 0 ≤ 1: settle column 0 (height 0) | 0 | 0 |
| 2 | 1 | 11 | 1 | 1 | 1 ≤ 1: settle column 1 (height 1) | 0 | 0 |
| 3 | 2 | 11 | 1 | 1 | 1 ≤ 1: settle column 2 (height 0) | 1 | 1 |
| 4 | 3 | 11 | 2 | 1 | 2 > 1: settle column 11 (height 1) | 0 | 1 |
| 5 | 3 | 10 | 2 | 2 | 2 ≤ 2: settle column 3 (height 2) | 0 | 1 |
| 6 | 4 | 10 | 2 | 2 | settle column 4 (height 1) | 1 | 2 |
| 7 | 5 | 10 | 2 | 2 | settle column 5 (height 0) | 2 | 4 |
| 8 | 6 | 10 | 2 | 2 | settle column 6 (height 1) | 1 | 5 |
| 9 | 7 | 10 | 3 | 2 | 3 > 2: settle column 10 (height 2) | 0 | 5 |
| 10 | 7 | 9 | 3 | 2 | settle column 9 (height 1) | 1 | 6 |
| 11 | 7 | 8 | 3 | 2 | settle column 8 (height 2) | 0 | 6 |
| 12 | 7 | 7 | 3 | 3 | 3 ≤ 3: settle column 7 (height 3) | 0 | 6 |

The loop ran n = 12 times and returns 6. Compare with the Approach 2 table: every column received the same water. Step 3 is worth a second look: when column 2 was settled, the bars at indices 3 to 10 had not been read yet, and the 1 unit was still correct, because the right side had already shown a bar of height 1 and nothing unseen can lower that.

#### Java code

```java title="Approach 3: two pointers with running maximums (recommended)"
class Solution {
    public int trap(int[] height) {
        int left = 0;
        int right = height.length - 1;
        int leftMax = 0;   // tallest bar in height[0..left]
        int rightMax = 0;  // tallest bar in height[right..n-1]
        int water = 0;     // at most (n - 2) * 10^5 = 1,999,800,000 < 2^31 - 1
        while (left <= right) {
            leftMax = Math.max(leftMax, height[left]);
            rightMax = Math.max(rightMax, height[right]);
            if (leftMax <= rightMax) {
                // The left wall is the lower one; unseen bars can only raise the right wall.
                water += leftMax - height[left];
                left++;
            } else {
                water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }
}
```

#### Time complexity

**O(n) in every case**: the window `left..right` starts with n columns and loses exactly one per iteration, so the loop runs exactly n times, each with constant work.

#### Space complexity

**O(1) auxiliary space**: five `int` variables. The input is not modified.

### Alternative: monotonic stack, filling water in horizontal layers

The approaches above count water **by columns**. You can also count it **by layers**: horizontal slabs of water, each bounded by a wall on the left, a wall on the right and a floor. A [[a5-monotonic-stack|monotonic stack]] finds those slabs in one left-to-right pass.

**How it works.** Keep a stack of indices whose heights do not increase from bottom to top: these are bars still waiting for a taller bar on their right. When bar `i` is taller than the bar on top of the stack, that top bar is a **floor** with a wall on its right (bar `i`). Pop it. The new top of the stack, if there is one, is the nearest bar to its left that is at least as tall: the left wall. The slab between them is `width = i − leftWall − 1` columns wide and `min(height[leftWall], height[i]) − height[floor]` units high. If the stack is empty after the pop, there is no left wall and that water runs off. Repeat while bar `i` is taller than the top, then push `i`.

**Why each unit is counted once.** Every bar strictly between the left wall and `i` has already been popped, so it is no taller than the floor, and the water below the floor's height in that span was counted by earlier, lower slabs. This slab adds only the band from the floor's height up to the lower wall.

**Dry run** on `[3, 0, 2, 0, 4]` (the answer is 7):

| i | height[i] | Event | Water added | Stack after (bottom → top) |
|---|---|---|---|---|
| 0 | 3 | push 0 | 0 | [0] |
| 1 | 0 | push 1 | 0 | [0, 1] |
| 2 | 2 | pop floor 1 (h 0); left wall 0 (h 3); width 2 − 0 − 1 = 1, height min(3, 2) − 0 = 2 | 2 | [0] |
| 2 | 2 | 2 < 3, stop popping; push 2 | 0 | [0, 2] |
| 3 | 0 | push 3 | 0 | [0, 2, 3] |
| 4 | 4 | pop floor 3 (h 0); left wall 2 (h 2); width 4 − 2 − 1 = 1, height min(2, 4) − 0 = 2 | 2 | [0, 2] |
| 4 | 4 | pop floor 2 (h 2); left wall 0 (h 3); width 4 − 0 − 1 = 3, height min(3, 4) − 2 = 1 | 3 | [0] |
| 4 | 4 | pop 0 (h 3); stack now empty, no left wall: stop; push 4 | 0 | [4] |

Total 2 + 2 + 3 = 7. The last slab is the band from height 2 to height 3 across columns 1 to 3: the lower bands there were counted by the first two slabs.

```java title="Alternative: monotonic stack (horizontal layers)"
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int trap(int[] height) {
        Deque<Integer> stack = new ArrayDeque<>();  // indices; heights non-increasing bottom to top
        int water = 0;
        for (int i = 0; i < height.length; i++) {
            while (!stack.isEmpty() && height[i] > height[stack.peek()]) {
                int floor = stack.pop();
                if (stack.isEmpty()) {
                    break;                          // no left wall: this water runs off
                }
                int leftWall = stack.peek();
                int width = i - leftWall - 1;
                int level = Math.min(height[leftWall], height[i]) - height[floor];
                water += width * level;             // at most (n - 2) * 10^5, fits in an int
            }
            stack.push(i);
        }
        return water;
    }
}
```

**Cost.** O(n) time in every case: each index is pushed once and popped at most once, so the inner `while` runs at most n times over the whole method, even though it is nested. O(n) auxiliary space in the worst case: for a strictly decreasing landscape every index stays on the stack.

**When it wins.** It reads the bars strictly left to right, once, and never needs the right end. If the bars arrive as a stream (you cannot jump to the last bar), the two-pointer method does not apply and the prefix/suffix method needs the whole array stored anyway; the stack processes the stream directly. It is also the same machinery as [[nc-largest-rectangle-in-histogram|Largest Rectangle in Histogram]], so it is worth knowing. For a single array in memory, the two-pointer solution is simpler and uses O(1) space.

## 5. Comparison table

n = number of bars. No approach uses hashing or randomness, so expected and worst case are the same.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Per-column brute force | O(n²) | O(n²) | O(1) |
| 2. Prefix and suffix maximum arrays | O(n) | O(n) | O(n) |
| 3. Two pointers with running maximums | O(n) | O(n) | O(1) |
| Alt. Monotonic stack (layers) | O(n) | O(n) | O(n) worst case |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Per-column brute force | Shows the key formula directly; easy to verify | Quadratic | To state the formula and the baseline; as a test reference |
| 2. Prefix and suffix arrays | Linear; each step follows from the formula with no extra argument; hard to get wrong | Two extra arrays | A complete answer on its own; the safe fallback if the two-pointer argument will not come |
| 3. Two pointers | Linear time, constant space, one pass | Needs the "lower wall decides" argument to be convincing | The answer to give |
| Alt. Monotonic stack | One left-to-right pass; works on a stream; same machinery as histogram problems | Layer accounting is the easiest to get wrong; O(n) stack | Streaming input, or when the interviewer asks for a different view |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 3, two pointers. Derive it out loud through Approaches 1 and 2: the formula first, then the arrays, then "I only need the smaller maximum exactly". That path is the explanation the interviewer wants to hear, and each stage is a correct fallback.

**Is it optimal?** Yes, in both time and space. Space is O(1). For time there is an Ω(n) worst-case lower bound, for any algorithm that learns bar heights only by reading them: take n ≥ 3 and the input `[1, 0, 0, …, 0, 1]`, which traps n − 2. If an algorithm never reads an inner position, it cannot tell this input apart from the one with that bar raised to 1, which traps n − 3. If it never reads an end, it cannot tell it apart from the one with that end lowered to 0, which traps nothing. So on this input every bar must be read.

**When another solution is better in practice:**

- If the two-pointer argument is not coming together, code Approach 2. It is O(n) time, and O(n) memory is a small price at n ≤ 2 × 10^4. A working Approach 2 with a clear explanation beats a half-justified Approach 3.
- If the bars arrive as a stream, use the stack.

**When to stop:** with Approach 3, its correctness argument and the overflow bound, you are done. Do not try to merge passes in Approach 2 or shave comparisons in Approach 3; offer the stack only as a different view, if asked.

## 7. Interview script: code it and test it

### What I say while coding

> "Signature `int trap(int[] height)`. Two pointers at the ends, two running maximums starting at 0, and the total."

> "The loop condition is `left <= right`: the columns from `left` to `right` are the unsettled ones, and I want to settle every one of them, including the last."

> "First I fold the current bars into the maximums, so each maximum includes its own pointer's bar. That's what keeps every added amount non-negative."

> "Then: if `leftMax <= rightMax`, the left column's level is `leftMax`, because the right wall is at least `rightMax`. Add, move `left`. Otherwise the mirror image."

> "The total is at most 1,999,800,000, and every term is non-negative, so the running sum never exceeds that: `int` is safe."

### Testing out loud

**Normal case:** Example 1, as in the dry-run table: 12 iterations, water added at columns 2, 4, 5, 6 and 9, total 6.

**Example 2:** `[4, 2, 0, 3, 2, 5]`. `rightMax` is 5 from the first step and `leftMax` stays 4, so the left side is settled every time: 0, 2, 4, 1, 2, then column 5 with `leftMax = 5 ≤ 5`, adding 0. Returns 9.

**n = 1:** `[5]`. One iteration with `left = right = 0`: both maximums 5, add 5 − 5 = 0. Returns 0.

**n = 2:** `[2, 7]`. Step 1: maxima 2 and 7, settle column 0, add 0. Step 2: `left = right = 1`, maxima 7 and 7, add 0. Returns 0.

**Increasing:** `[1, 2, 3, 4]`. `rightMax` is 4 from the start; `leftMax` always equals the current bar, so every addition is 0. Returns 0. **Decreasing** `[4, 3, 2, 1]` is the mirror image: `leftMax` is 4 from the start, and the right side settles columns 3, 2 and 1 with `rightMax` equal to the current bar; the last column, 0, is a tie at 4 and adds 0. Returns 0.

**Flat:** `[3, 3, 3]`. Every comparison is a tie, the left side settles each time, adding 3 − 3 = 0. Returns 0.

**V-shaped:** `[3, 1, 0, 1, 3]`. Both maximums are 3 after the first update; ties settle the left side: 0, then 3 − 1 = 2, 3 − 0 = 3, 3 − 1 = 2, then 0. Returns 7.

**Plateau:** `[2, 0, 2, 2, 0, 2]`. Both maximums are 2 throughout; the left side settles every column: 0, 2, 0, 0, 2, 0. Returns 4.

**The overflow extreme:** `[100000, 0, …, 0, 100000]` with 2 × 10^4 bars. Both maximums are 10^5 from the first step; each of the 19,998 inner columns adds 10^5. Returns 1,999,800,000, below 2,147,483,647.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 2–3 min | Open ends, sealed ground, n = 1 and n = 2, the overflow bound |
| Derive the per-column formula | 3–4 min | "Lower of the two tallest walls minus the bar", with both directions of the argument |
| Brute force and the arrays | 3 min | Name the rescanning, fix it with prefix/suffix maximums. Code only if you might not reach Approach 3 |
| Derive two pointers | 3–4 min | "I only need the smaller maximum exactly" |
| Argue correctness | 2 min | The settled-window invariant, the inequality, ties |
| Code | 4 min | Approach 3 |
| Trace and edge cases | 4 min | Part of Example 1, `[5]`, `[2, 7]`, a monotonic input |
| Questions | rest | Section 9 |

**Where the time should go:** the formula and the two-pointer argument. The code is twelve lines; the reasoning is the interview. Do not rush the formula: "lower of the two tallest walls, including the bar itself" is what every later step stands on, and getting "nearest wall" or "excluding the bar" wrong here poisons everything after.

**If you get stuck:**

1. If no formula comes, stop thinking about pools. Point at one column of Example 2 and ask: "why does the water stop exactly here?"
2. If the formula is there but linear time is not, say what the brute force recomputes, and the arrays follow.
3. If the arrays are there but O(1) space is not, write Approach 2 and say so. Then look at the Approach 2 table and ask which of the two maximums decides each column. Left of the tallest bar it is always the left one.
4. Accept a hint without fuss; the interviewer is grading how you use it ([[a14-responding-to-hints|Responding to Interviewer Hints]]).

## 9. Interviewer challenges

### About correctness

#### How can you settle a column before you have seen all the bars?

**What they are testing:** the heart of the two-pointer solution. Many candidates recite the code but cannot answer this.

**How to reason:** write the formula and look at what each side of the `min` needs. The left wall is fully known. The right wall is not, but you have a lower bound for it.

**What I say:** "The water at column `left` is the lower of its two walls minus its height. The left wall is exactly `leftMax`, since I've seen everything from the start to `left`. The right wall is the tallest bar from `left` to the end; I haven't seen all of those, but they include everything from `right` to the end, so it's at least `rightMax`. When `leftMax ≤ rightMax`, the right wall is at least the left wall, so the minimum is `leftMax` no matter what's in the middle. Unseen bars can raise the right wall, never lower it."

**Nuance:** the argument needs only a *lower* bound on the far wall. That is why it fails if you settle the side with the larger maximum: then the unknown far wall might be lower than your maximum, and the level is not decided. Doing that returns 17 instead of 6 on Example 1.

#### Why do you include the column's own height in the maximums?

**What they are testing:** whether you understand the formula's edge, or copied it.

**How to reason:** consider a bar taller than everything around it, where the true answer is 0.

**What I say:** "If a bar is taller than both walls, it holds no water. With the bar included, the minimum is at least its height and the water comes out as 0. If I excluded it, I'd get a negative number and have to clamp with `max(0, …)`. Including it also makes the end columns come out as 0 automatically."

**Nuance:** excluding the bar and clamping is also correct; forgetting the clamp is not. On `[1, 2, 1]` the unclamped exclusive version returns −3: each column gets −1.

#### Why `left <= right` and not `left < right`?

**What they are testing:** whether your loop bound follows from an invariant.

**How to reason:** say what the window means. `left..right` are the unsettled columns; the loop should run while there is one.

**What I say:** "The window holds the columns I haven't settled. With `<=`, I settle every column once, including the one where the pointers meet, and the loop runs exactly n times."

**Nuance:** with `<` this code still returns correct totals, because the column where the pointers meet always holds no water: it turns out to be the tallest bar on one of its sides. But that needs a separate argument. `<=` makes the code follow the invariant with nothing extra to prove.

#### Many solutions compare `height[left] < height[right]` instead of the maximums. Is that the same?

**What they are testing:** whether you can reason about a variant instead of rejecting it.

**How to reason:** in the common variant, you move the side whose current bar is lower, and settle it with that side's running maximum. Check that the far side's wall is still at least the near side's maximum.

**What I say:** "It's also correct. The bar under the higher pointer is itself a wall for the other side, and the pointer with the lower bar always has a running maximum no higher than the bar under the other pointer, so the same 'lower wall decides' argument applies. I compare the maximums because the argument is shorter to state."

**Nuance:** the two versions can settle columns in a different order but always add the same per-column amounts. Pick one and be able to justify it; mixing them (comparing heights but updating the maximum after adding) produces negative terms.

### About complexity and arithmetic

#### Can the total overflow an `int`?

**What they are testing:** computing a bound from the constraints, including intermediate values.

**How to reason:** bound the final total, then check that no intermediate value exceeds it.

**What I say:** "Each column holds at most 10^5, and the two end columns hold none, so the total is at most 19,998 × 10^5 = 1,999,800,000, just under 2,147,483,647. Each term I add is between 0 and 10^5, so the running sum only grows towards the final total. In the stack version, `width × level` is one slab, which is part of the total, so it's bounded the same way."

**Nuance:** the headroom is only about 7%. With n up to 2.2 × 10^4 the bound would pass `Integer.MAX_VALUE`, so for larger limits I'd sum in a `long`. And a buggy version that adds negative terms can produce values outside this reasoning, which is another reason to keep every term non-negative.

#### The stack version has a loop inside a loop. Why is it O(n)?

**What they are testing:** amortized analysis rather than counting nesting depth.

**How to reason:** count operations per index instead of per iteration of the outer loop.

**What I say:** "Each index is pushed exactly once and popped at most once. Every iteration of the inner `while` pops one index, so over the whole run the inner loop executes at most n times. Total O(n)."

**Nuance:** the space is O(n) in the worst case, a strictly decreasing landscape, where nothing is ever popped.

#### Is O(n) time with O(1) space the best possible?

**What they are testing:** whether you can justify stopping.

**How to reason:** find an input on which every bar matters.

**What I say:** "Yes. On `[1, 0, …, 0, 1]` the answer is n − 2. Raise any inner bar to 1 and the answer changes; lower either end to 0 and it changes. So an algorithm that skips any bar on that input can be fooled: a worst-case Ω(n) lower bound. My solution matches it with constant extra space."

**Nuance:** the bound is for algorithms that learn heights by reading them, and it is a worst-case statement: it does not say every input needs every bar read.

## 10. Follow-up questions the interviewer might ask

**"What if the bars arrive one at a time and you can't see the end?"**
Use the monotonic stack: it only ever looks left, adds water as soon as a right wall arrives, and its total is final once the stream ends. O(1) amortized per bar, O(n) memory in the worst case (decreasing bars).

**"Return the water above each column, not just the total."**
Approach 2 or 3 already computes it per column; write each term into an output array. O(n) time; the output itself is O(n).

**"What if bars have different widths?"**
Each column's depth is unchanged (it depends only on heights), so multiply each column's depth by its width. Same O(n), but the total can grow much larger: compute it as a `long`.

**"What if the landscape is a 2D grid of heights?"**
The one-dimensional argument does not carry over, because water can escape around a column in any direction. The standard approach starts from the border cells in a min-heap and always expands from the lowest boundary cell: that cell's height is the level for any lower neighbour, the 2D version of "the lower wall decides". O(mn log(mn)) for an m × n grid.

**"What if heights or n were much larger?"**
Sum in a `long`. The algorithm is unchanged; only the bound from section 3 stops holding.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Using the nearest taller bars as walls.** In Example 2, column 3 (height 3) has neighbours 0 and 2, but its walls are the 4 at index 0 and the 5 at index 5. The walls are the *tallest* bars on each side.
- **Using the max of the two walls instead of the min.** Water spills over the lower wall.
- **Hunting for pools.** It can be done, but nested pools make it error-prone. The per-column formula avoids the problem entirely.
- **Thinking two pointers need the whole picture.** The point of the argument is that a lower bound on the far wall is enough. If you cannot explain that, fall back to Approach 2 rather than presenting code you cannot justify.
- **Assuming the end columns need special handling.** With the bar included in both maximums, they come out as 0 by themselves.

### Implementation mistakes

> [!MISTAKE] Settling the side with the larger maximum
> Flipping the comparison (`if (leftMax >= rightMax)` settles the left side) uses a maximum that the far side might not reach. Example 1 returns 17 instead of 6, and Example 2 returns 14 instead of 9.

> [!MISTAKE] Adding before updating the maximum
> Moving each maximum's update into its branch, after the addition (`water += leftMax - height[left]; leftMax = Math.max(leftMax, height[left]); left++;` and the mirror image on the right), lets a bar taller than the old maximum add a negative amount. With the maximums starting at 0, Example 1 returns 1 and Example 2 returns 0.

- **Excluding the bar from the maximums without clamping.** `[1, 2, 1]` returns −3.
- **Stack: forgetting the empty check after popping the floor.** With `ArrayDeque`, `peek()` on an empty deque returns `null`, and unboxing it throws a `NullPointerException` (on Example 2, when the 5 arrives and pops the 4 at index 0).
- **Stack: width as `i − floor` instead of `i − leftWall − 1`.** Slabs that span popped columns come out too narrow: Example 2 returns 7 instead of 9.
- **Prefix/suffix: off-by-one starts.** `rightMax` must be filled from `n − 1` downwards and `leftMax` from 0 upwards; starting either loop at the wrong end reads unset zeros.

## 12. Pattern recognition

**The pattern:** reduce a global shape problem to a per-element formula involving a prefix aggregate and a suffix aggregate (here the running maximum from each side), then compute it with prefix/suffix arrays, or with two pointers when only the smaller of the two aggregates matters.

**Signals in the problem statement:**

- The answer at a position depends on "the best/tallest/largest to my left" and "to my right".
- A brute force rescans to the left and to the right of every element.
- The combination is `min` (or `max`) of the two sides, so only one of them needs to be known exactly at a time.
- Elevation, histogram or "bars" language often points to stack-based layer processing as a second view.

**Related problems in this list:**

- [[nc-container-with-most-water|Container With Most Water]]: two lines, the shorter one decides, discard it from the window. The closest relative of the two-pointer argument here.
- [[nc-product-of-array-except-self|Product of Array Except Self]]: the same prefix/suffix structure with products instead of maximums.
- [[nc-largest-rectangle-in-histogram|Largest Rectangle in Histogram]]: bars again, solved with the same monotonic stack, looking for the nearest shorter bar instead of walls.
- [[nc-daily-temperatures|Daily Temperatures]]: the simplest monotonic stack: pop when a taller element arrives.
- [[nc-best-time-to-buy-and-sell-stock|Best Time to Buy and Sell Stock]]: a single running extreme from one side, the one-sided version of this idea.

**Takeaway:** when each position's answer is "the smaller of the best on my left and the best on my right", compute both with prefix/suffix sweeps, and if you only need the smaller one exactly, walk in from both ends and settle the side whose running best is smaller.

## 13. 60-second revision card

**Key insight:** water above column i = min(tallest bar in 0..i, tallest bar in i..n − 1) − height[i]. Only the lower wall matters, and a lower bound on the higher wall is enough to know which one is lower.

**Invariant:** columns outside `left..right` are settled; `leftMax` and `rightMax` are the tallest bars seen from each end. If `leftMax ≤ rightMax`, column `left` holds exactly `leftMax − height[left]`.

**Complexity:** O(n) time (exactly n iterations), O(1) space. Ω(n) worst-case lower bound. The total is at most (n − 2) × 10^5 = 1,999,800,000 < 2^31 − 1.

**Code skeleton:**

```java title="Trapping Rain Water, two pointers" fragment="public int trap(int[] height)"
int left = 0, right = height.length - 1, leftMax = 0, rightMax = 0, water = 0;
while (left <= right) {
    leftMax = Math.max(leftMax, height[left]);      // update first: terms stay >= 0
    rightMax = Math.max(rightMax, height[right]);
    if (leftMax <= rightMax) water += leftMax - height[left++];   // the lower wall decides
    else water += rightMax - height[right--];
}
return water;
```

**Main traps:**

- Settle the side with the *smaller* maximum: Example 1 returns 17 otherwise.
- Update the maximum before adding, so no term is negative.
- Walls are the tallest bars on each side, not the nearest ones.
- Stack: check for an empty stack after popping; width is `i − leftWall − 1`.

**What to say in one breath:** "Each column holds the lower of its two tallest walls minus its height. Prefix and suffix maximums make that O(n) with O(n) space. To get O(1) space I walk in from both ends: the side with the smaller running maximum can be settled, because unseen bars can only raise the other wall. Each step settles one column, so O(n) time, and the total stays under 2 × 10^9."
