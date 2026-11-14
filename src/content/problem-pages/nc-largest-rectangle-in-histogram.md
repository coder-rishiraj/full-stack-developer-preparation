---
problemId: nc-largest-rectangle-in-histogram
title: Largest Rectangle In Histogram
source: neetcode
sourceUrl: https://leetcode.com/problems/largest-rectangle-in-histogram/
difficulty: hard
patterns: [stack, monotonic-stack]
relatedLessons: [a5-monotonic-stack, a5-next-greater-smaller, a5-stack, a14-brute-force-first, a14-deriving-optimization]
companies: []
timeToSolve: 35
---

## 1. Problem restatement

You get an array `heights` describing a histogram: bar i is one unit wide and `heights[i]` units tall, and the bars stand side by side with no gaps. Return the area of the largest axis-aligned rectangle that fits entirely inside the histogram. Such a rectangle covers a run of consecutive bars, and its height can be at most the shortest bar in that run.

**Example 1**

- Input: `heights = [2, 1, 5, 6, 2, 3]`
- Output: `10`
- Why: the bars of height 5 and 6 (indices 2 and 3) hold a rectangle of height 5 and width 2. No other run does better: all six bars give 1 × 6 = 6, and the four bars from index 2 to 5 give 2 × 4 = 8.

**Example 2**

- Input: `heights = [2, 4]`
- Output: `4`
- Why: the bar of height 4 alone gives 4, and both bars together give 2 × 2 = 4.

**What the problem statement guarantees**

- 1 ≤ `heights.length` ≤ 10^5.
- 0 ≤ `heights[i]` ≤ 10^4.
- Method signature: `public int largestRectangleArea(int[] heights)`.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. A correct quadratic answer is not hard; the linear one needs a structure that many people meet for the first time on this problem, and the details at equal heights and at the ends are where attempts break. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 35 minutes and talk out loud.
2. Draw Example 1 as bars on squared paper and shade the best rectangle.
3. Write a correct solution first, however slow, and say why it cannot be fast enough at the given limits.
4. Instead of choosing the rectangle's two ends, try choosing which bar is its shortest one. Ask what you would need to know about that bar.
5. Turn that into a linear solution, then trace it on Example 1 with every intermediate state written down.

Open a hint only after two minutes without progress. After each hint, close it and try again before opening the next one.

> [!HINT] Hint 1: a small nudge
> Every rectangle in the answer's search space has some shortest bar under it, and that bar fixes the height. If you knew which bar is the shortest one, how wide could the rectangle be at most?

> [!HINT] Hint 2: the kind of tool you need
> For each bar you need the nearest bar to its left that is lower, and the nearest bar to its right that is lower. "Nearest lower element on each side, for every element" can be computed for all elements in linear time with a stack that keeps its contents sorted by height.

> [!HINT] Hint 3: almost the whole plan
> Scan left to right, keeping a stack of indices whose heights increase from bottom to top. When the current bar is not taller than the bar on top of the stack, that top bar has just found its right limit (the current index), and the element below it on the stack is its left limit. Compute its rectangle, pop it, and repeat. Add a bar of height 0 after the last one so that everything left on the stack gets processed too.

**Check yourself before revealing the walkthrough**

- [ ] My code returns 10 and 4 for the examples
- [ ] It returns 9 for `[1, 2, 3, 4, 5]` and for `[5, 4, 3, 2, 1]`, and 12 for `[3, 3, 3, 3]`
- [ ] I can say why my solution is linear even though it has a loop inside a loop
- [ ] I can explain what happens at equal heights, and why my answer is still right
- [ ] I checked whether the largest possible area fits in an `int`

## 3. Interview script: understand the problem (≈3 min)

**Me:** Let me say it back. Bars of width 1, side by side. I pick a contiguous run of bars and a height no taller than the shortest bar in the run; the area is height times the run's length. I return the largest such area.

**Interviewer:** That's it.

**Me:** Could the best rectangle use a height that isn't any bar's height? I don't think so: if a run's rectangle is shorter than its shortest bar, I can raise it to that bar's height. So I only ever need the shortest bar's height for each run.

**Interviewer:** Agreed.

**Me:** Zero-height bars are allowed, so a zero splits the histogram: no rectangle with positive area can cross it. And n is at least 1, so there's always an answer, possibly 0 if every bar is 0.

**Interviewer:** Yes.

**Me:** Sizes: up to 10^5 bars, heights up to 10^4. So the largest area anything could reach is 10^4 × 10^5 = 10^9, which is below `Integer.MAX_VALUE` = 2,147,483,647. An `int` holds every area and every product of a height and a width. And n = 10^5 rules out quadratic: about 5 × 10^9 steps.

**Me:** Let me do Example 1 by hand: `[2, 1, 5, 6, 2, 3]`. The 1 at index 1 spans everything: 6. The 5 at index 2 can extend over the 6 but not the 1 on its left or the 2 on its right: 5 × 2 = 10. The 2 at index 4 extends left to index 2 (5 and 6 are taller) and right to the end: 2 × 4 = 8. So the answer is 10. I notice I just reasoned "this bar is the shortest, how far can it stretch". That's the idea to build on.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^5 | n = 1 is valid (the answer is that bar's height). An O(n²) method does about n(n + 1)/2 ≈ 5 × 10^9 inner steps at the maximum: too slow for a typical time limit. Linear (or n log n) is the target. |
| 0 ≤ heights[i] ≤ 10^4 | Zero bars are possible and split the histogram. Any area is at most 10^4 × 10^5 = 10^9 < 2^31 − 1 = 2,147,483,647, so `int` arithmetic cannot overflow, including `height * width` before the comparison. |
| Bars have width 1 | A run from index L to R has width R − L + 1; widths come straight from indices. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| The rectangle's height can be taken as the shortest bar of its run | Every candidate is "a run, at the height of its minimum": the search is over runs, or over which bar is the minimum. |
| A zero-height bar is a legitimate bar | It caps any run containing it at area 0, so a zero acts as a separator; no special code needed. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The input array is read-only | Nothing says I may change it; none of the approaches needs to. |
| The answer is returned as an `int` | The signature says so, and the 10^9 bound shows it fits. |

### Edge cases I will keep in mind

- n = 1: `[7]` gives 7; `[0]` gives 0.
- Strictly increasing `[1, 2, 3, 4, 5]`: nothing to the right is lower, so a left-to-right method must handle bars that are never "closed" by a later bar. The answer is 9 (3 × 3).
- Strictly decreasing `[5, 4, 3, 2, 1]`: every bar is lower than the previous one. Also 9.
- All equal `[3, 3, 3, 3]`: the answer uses every bar, 12. Equal heights are where "lower" versus "not taller" matters.
- Zeros: `[0, 0, 0]` gives 0; `[2, 0, 2]` gives 2.
- The lowest bar spans everything: `[2, 1, 2]` gives 3.
- The extreme: 10^5 bars all of height 10^4, area exactly 10^9.

## 4. Think out loud: from first idea to best solution

> "A rectangle is determined by its two ends, L and R, and then its height is the minimum of `heights[L..R]`. The most direct thing is to try every pair of ends. Let me start there, then look for the repeated work."

### Approach 1: Brute force over both ends, extending the minimum

#### What I say out loud

> "The very first version tries every pair (L, R) and scans the run for its minimum: O(n³). I can drop one factor right away: if I fix L and move R to the right one step at a time, the minimum of `L..R` is the old minimum or the new bar, so I can keep it in a variable. That's O(n²) time and O(1) space."

> "At n = 10^5 that's about 5 × 10^9 steps, so it won't pass, but it's a correct baseline, and it's what I'd test a faster version against."

#### Intuition

For a fixed left end L, sweeping R to the right visits every rectangle that starts at L. The running minimum `min(heights[L..R])` is maintained in one variable, and the area of the run is that minimum times `R − L + 1`. Taking the best over all L and R covers every rectangle.

#### Algorithm

1. `best = 0`.
2. For each L from 0 to n − 1:
   1. `minHeight = +∞`.
   2. For each R from L to n − 1: `minHeight = min(minHeight, heights[R])`; `best = max(best, minHeight × (R − L + 1))`.
3. Return `best`.

#### Why it is correct

Every candidate rectangle is a run L..R at a height no larger than its minimum, and the best one for that run uses exactly the minimum (raising it to the minimum only adds area). The loops visit every run once, and `minHeight` equals the minimum of `heights[L..R]` at each step, because the minimum of a run grown by one bar is the smaller of the old minimum and the new bar. So the maximum over all visited areas is the answer.

#### Dry run

Example 1: `heights = [2, 1, 5, 6, 2, 3]`. One row per left end; the cells are the areas for R = L, L + 1, …

| L | Areas as R moves right | Best for this L | Best so far |
|---|---|---|---|
| 0 | 2×1=2, 1×2=2, 1×3=3, 1×4=4, 1×5=5, 1×6=6 | 6 | 6 |
| 1 | 1, 2, 3, 4, 5 | 5 | 6 |
| 2 | 5×1=5, 5×2=10, 2×3=6, 2×4=8 | 10 | 10 |
| 3 | 6, 2×2=4, 2×3=6 | 6 | 10 |
| 4 | 2, 2×2=4 | 4 | 10 |
| 5 | 3 | 3 | 10 |

Returns 10.

#### Java code

```java title="Approach 1: brute force, extending the minimum"
class Solution {
    public int largestRectangleArea(int[] heights) {
        int n = heights.length;
        int best = 0;
        for (int i = 0; i < n; i++) {                 // left edge
            int minHeight = Integer.MAX_VALUE;
            for (int j = i; j < n; j++) {             // right edge
                minHeight = Math.min(minHeight, heights[j]);   // lowest bar in i..j
                best = Math.max(best, minHeight * (j - i + 1));
            }
        }
        return best;
    }
}
```

#### Time complexity

**O(n²) in every case**: the inner loop runs n − L times for each L, n(n + 1)/2 iterations in total. At n = 10^5 that is about 5 × 10^9 iterations, which takes several seconds in Java and should be expected to exceed the judge's time limit. (The O(n³) version that rescans each run is worse by another factor of n.)

#### Space complexity

**O(1) auxiliary space**: three `int` variables.

#### The bridge to the next approach

> "The brute force enumerates pairs of ends: n² of them. But most pairs are useless. Let me turn it around. Every rectangle has a shortest bar, and that bar sets its height. So instead of choosing ends, choose the shortest bar i. Given i, the best rectangle with height `heights[i]` stretches left until just before the first bar that's lower than i, and right until just before the first bar that's lower. Those are only n candidates, one per bar."

> "Why can't that miss the answer? Take the optimal rectangle and its shortest bar i. The run it covers contains only bars at least as tall as `heights[i]`, so it lies inside the span I'd compute for i, and that span's rectangle is at least as large. And every span I compute is valid, because by construction every bar in it is at least `heights[i]`."

> "So the problem becomes: for every bar, find the nearest lower bar on the left and on the right. Scanning outwards from each bar is O(n²) again on bad inputs, like a staircase. But 'nearest lower element, for every element' is exactly what a monotonic stack computes in one pass, the same idea as Daily Temperatures with 'warmer' turned into 'lower'."

### Approach 2: Nearest lower bar on each side, two monotonic stack passes

#### What I say out loud

> "Two arrays. `left[i]` is the index of the nearest bar to the left of i that is strictly lower, or −1 if there's none. `right[i]` is the nearest strictly lower bar to the right, or n. Then bar i's rectangle spans `left[i] + 1` to `right[i] − 1`, so its width is `right[i] − left[i] − 1`, and the answer is the max of `heights[i] × width`."

> "To fill `left`, I scan left to right with a stack of indices. Before handling bar i, I pop every index whose bar is at least as tall as bar i. They can never be the 'nearest lower bar' for anything after i: bar i is at least as low and closer. Whatever is left on top is lower than bar i, and it's the nearest such bar, so that's `left[i]`. Then I push i. `right` is the mirror image, scanning from the right."

#### Intuition

When you look for "the nearest lower bar to my left", a bar that has a lower-or-equal bar after it is useless to everyone further right: that later bar is closer and at least as low. Throwing away useless bars as soon as they become useless leaves a stack whose heights strictly increase from bottom to top, and the answer for each new bar is found by popping the bars that are not lower than it. This is the [[a5-next-greater-smaller|next greater / next smaller element]] technique, run once in each direction.

#### Algorithm

1. Left pass, i = 0..n − 1: while the stack is non-empty and `heights[top] ≥ heights[i]`, pop. `left[i]` = top, or −1 if the stack is empty. Push i.
2. Clear the stack. Right pass, i = n − 1 down to 0: the same, setting `right[i]` = top, or n if empty.
3. `best = max over i of heights[i] × (right[i] − left[i] − 1)`.

#### Why it is correct

**What the arrays mean.** After the left pass, `left[i]` is the largest index j < i with `heights[j] < heights[i]`, or −1. The stack invariant before processing i: it holds, bottom to top, exactly the indices j < i that have no index k with j < k < i and `heights[k] ≤ heights[j]`, and their heights strictly increase. Popping those with height ≥ `heights[i]` leaves on top the nearest index with a strictly lower height: any index skipped over between it and i was either popped now (height ≥ `heights[i]`) or popped earlier by some later bar no taller than it, and that bar was itself either on the stack or popped by an even lower one, so by following that chain every skipped index has height ≥ `heights[i]`. Pushing i restores the invariant, since every remaining index below it is strictly lower. The right pass is the mirror image.

**Every computed area is a real rectangle.** Every bar strictly between `left[i]` and `right[i]` is at least `heights[i]` tall, so the rectangle of height `heights[i]` over that span fits.

**The best rectangle is found.** Take an optimal rectangle over the run L..R at height equal to the run's minimum, and let i be a bar in the run with that minimum height. Every bar in L..R is at least `heights[i]`, so `left[i] < L` and `right[i] > R`: the span computed for i contains L..R, and its area is at least the optimum.

**Equal heights.** Both passes use "strictly lower" (they pop on `≥`). Then for a run of equal bars, each one stretches over the whole run, which is fine. If you made *both* sides "lower or equal" (pop on `>`), equal neighbours would block each other and `[2, 2]` would return 2 instead of 4. Making exactly one side "lower or equal" is still correct: the leftmost (or rightmost) bar of each equal group still gets the full span.

#### Dry run

Example 1: `heights = [2, 1, 5, 6, 2, 3]`, n = 6.

| i | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| heights | 2 | 1 | 5 | 6 | 2 | 3 |
| left (nearest strictly lower on the left) | −1 | −1 | 1 | 2 | 1 | 4 |
| right (nearest strictly lower on the right) | 1 | 6 | 4 | 4 | 6 | 6 |
| width = right − left − 1 | 1 | 6 | 2 | 1 | 4 | 1 |
| area | 2 | 6 | **10** | 6 | 8 | 3 |

The left pass, step by step: i = 0 pushes 0; i = 1 pops 0 (2 ≥ 1), stack empty, `left[1] = −1`; i = 2 sees 1 on top (1 < 5), `left[2] = 1`; i = 3 sees 2 on top, `left[3] = 2`; i = 4 pops 3 and 2 (6 and 5 ≥ 2), sees 1, `left[4] = 1`; i = 5 sees 4 on top (2 < 3), `left[5] = 4`. The maximum area is 10, at bar 2.

#### Java code

```java title="Approach 2: nearest lower bar on each side, two passes"
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int largestRectangleArea(int[] heights) {
        int n = heights.length;
        int[] left = new int[n];   // left[i]: index of the nearest bar to the left lower than heights[i], or -1
        int[] right = new int[n];  // right[i]: index of the nearest bar to the right lower than heights[i], or n
        Deque<Integer> stack = new ArrayDeque<>();

        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && heights[stack.peek()] >= heights[i]) {
                stack.pop();                       // not lower than bar i: never anyone's answer again
            }
            left[i] = stack.isEmpty() ? -1 : stack.peek();
            stack.push(i);
        }

        stack.clear();
        for (int i = n - 1; i >= 0; i--) {
            while (!stack.isEmpty() && heights[stack.peek()] >= heights[i]) {
                stack.pop();
            }
            right[i] = stack.isEmpty() ? n : stack.peek();
            stack.push(i);
        }

        int best = 0;
        for (int i = 0; i < n; i++) {
            int width = right[i] - left[i] - 1;   // bars left[i]+1 .. right[i]-1
            best = Math.max(best, heights[i] * width);  // at most 10^4 * 10^5 = 10^9
        }
        return best;
    }
}
```

#### Time complexity

**O(n) in every case.** Each pass pushes every index once and pops each index at most once, so its inner `while` runs at most n times over the whole pass, even though it is nested inside a loop. Three passes of O(n) each.

#### Space complexity

**O(n) auxiliary space**: the two arrays of n `int`s and a stack that holds up to n indices (for strictly increasing heights in the left pass, nothing is ever popped).

#### The bridge to the next approach

> "Look at when `right[i]` becomes known: it's the first bar after i that's lower. In the left-to-right pass, that's exactly the bar that pops i off the stack. And at the moment i is popped, the element under it on the stack is `left[i]`. So in the left pass, at each pop, I already have both limits of the popped bar: I can compute its area right there and never store the arrays."

> "The bars that are never popped are the ones with no lower bar to their right. If I pretend there's one more bar of height 0 after the end, it pops everything that's left, with right limit n. That's the sentinel."

### Approach 3: One pass with a monotonic stack and a sentinel (recommended)

#### What I say out loud

> "I keep a stack of indices with strictly increasing heights from bottom to top. I go through i from 0 to n, treating position n as a bar of height 0. While the bar on top of the stack is at least as tall as the current bar, I pop it: the current index i is its right limit, and the new top of the stack, or −1 if empty, is its left limit. Its area is its height times `i − leftLimit − 1`. Then I push i."

> "Each index is pushed once and popped once, so it's O(n). The areas are at most 10^9, so `int` is fine."

#### Intuition

The stack holds bars that are still "open": their rectangle can still grow to the right, because nothing lower has arrived yet. A bar is closed by the first later bar that is not taller than it; at that moment both of its limits are known: the closer is on its right, and the bar under it on the stack is the nearest lower bar on its left. Because the stack's heights increase upwards, the bars below the top are exactly the left limits, nested like brackets. The sentinel of height 0 at the end closes every bar still open.

#### Algorithm

1. Empty stack of indices; `best = 0`.
2. For i from 0 to n (inclusive):
   1. `h = heights[i]` if i < n, else 0 (the sentinel).
   2. While the stack is non-empty and `heights[top] ≥ h`:
      - pop `top`; `height = heights[top]`;
      - `leftLimit` = the new top, or −1 if the stack is empty;
      - `best = max(best, height × (i − leftLimit − 1))`.
   3. Push i.
3. Return `best`.

#### Why it is correct

**The stack invariant.** Before step 2 for index i, the stack holds indices in increasing order with strictly increasing heights, and for any two adjacent entries a (below) and b (above), every index strictly between them has height ≥ `heights[b]`. Also, every index strictly between the top entry and i has height ≥ the top entry's height. Pushing i after popping everything at least as tall as `h` keeps all of this: the entry below i is strictly lower than `h`, and everything between them was popped, either now (height ≥ `h`) or earlier by a bar that was itself popped now or was not lower than `h`.

**Every computed area is a real rectangle.** When `top` is popped at index i, the new top `leftLimit` is strictly lower than `heights[top]` (the heights strictly increase up the stack), and every index between `leftLimit` and `top` has height ≥ `heights[top]` (invariant). Every index between `top` and i is taller than `heights[top]`: such an index is either still above `top` on the stack (strictly taller) or lies between two stack entries above `top` (at least as tall as one of them). So all bars from `leftLimit + 1` to `i − 1` are at least `heights[top]`, and the rectangle fits.

**The best rectangle is found.** Take an optimal rectangle over the run L..R at the height m of its minimum, with L − 1 and R + 1 lower than m or outside the array (any optimal run can be extended until that holds without losing area). Let t be the **rightmost** index in L..R with height m. Every bar in t + 1..R is taller than m, and bar R + 1 is lower than m (or is the sentinel, which is 0 ≤ m), so t stays on the stack until i = R + 1 and is popped exactly then. At that moment its left limit is the nearest index to its left that is strictly lower than m. Every bar in L..t − 1 is at least m, so that index is L − 1 (or −1 if L = 0). The width computed is (R + 1) − (L − 1) − 1 = R − L + 1: the optimal rectangle exactly.

**Equal heights.** With `≥`, a bar is popped by a later bar of the same height, and the area computed for it is too narrow on the right. That is harmless: the later bar of the same height inherits the same left limit (the popped bar was the only thing between them) and is popped later with the full width, as the proof shows by choosing the rightmost bar of minimum height. Popping only on `>` is also correct, by the mirror argument: then the *leftmost* bar of minimum height in the optimal run is popped by bar R + 1 with left limit L − 1. Both versions pass the same tests.

**Why the sentinel works.** At i = n, `h = 0`, and every remaining bar has height ≥ 0, so all of them are popped with right limit n. Without it, bars with no lower bar to their right, such as every bar of an increasing histogram, would never be measured.

**The 25-second version to say to the interviewer:**

> "Every rectangle has a shortest bar, so I compute, for every bar, the widest rectangle at its height: from just after the nearest lower bar on its left to just before the nearest lower bar on its right. A stack with increasing heights gives both: when a bar is popped, the bar popping it is its right limit and the bar beneath it is its left limit. A height-0 sentinel at the end pops everything left. Each index is pushed and popped once, so O(n), and areas are at most 10^9, so `int` is fine."

#### Dry run

Example 1: `heights = [2, 1, 5, 6, 2, 3]`, then the sentinel at i = 6.

| i | h | Event | Width | Area | best | Stack after (bottom → top) |
|---|---|---|---|---|---|---|
| 0 | 2 | push 0 | | | 0 | [0] |
| 1 | 1 | pop 0 (height 2); stack empty, left limit −1 | 1 − (−1) − 1 = 1 | 2 | 2 | |
| 1 | 1 | push 1 | | | 2 | [1] |
| 2 | 5 | 1 < 5: push 2 | | | 2 | [1, 2] |
| 3 | 6 | 5 < 6: push 3 | | | 2 | [1, 2, 3] |
| 4 | 2 | pop 3 (height 6); left limit 2 | 4 − 2 − 1 = 1 | 6 | 6 | [1, 2] |
| 4 | 2 | pop 2 (height 5); left limit 1 | 4 − 1 − 1 = 2 | 10 | 10 | [1] |
| 4 | 2 | 1 < 2: push 4 | | | 10 | [1, 4] |
| 5 | 3 | 2 < 3: push 5 | | | 10 | [1, 4, 5] |
| 6 | 0 | pop 5 (height 3); left limit 4 | 6 − 4 − 1 = 1 | 3 | 10 | [1, 4] |
| 6 | 0 | pop 4 (height 2); left limit 1 | 6 − 1 − 1 = 4 | 8 | 10 | [1] |
| 6 | 0 | pop 1 (height 1); stack empty, left limit −1 | 6 − (−1) − 1 = 6 | 6 | 10 | |
| 6 | 0 | push 6 | | | 10 | [6] |

Returns 10. Each bar's area here matches the `area` row of the Approach 2 table: the pops compute exactly the same rectangles, just in a different order.

Equal heights, `[3, 3, 3, 3]`: index 1 pops index 0 with width 1 (area 3), index 2 pops index 1 with width 2 (area 6, since the stack was empty below it), index 3 pops index 2 with width 3 (area 9), and the sentinel pops index 3 with width 4 (area 12). The early pops are under-measured, and the last bar of the run carries the full width.

#### Java code

```java title="Approach 3: one pass with a sentinel (recommended)"
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int largestRectangleArea(int[] heights) {
        int n = heights.length;
        Deque<Integer> stack = new ArrayDeque<>();  // indices; heights strictly increasing bottom to top
        int best = 0;
        for (int i = 0; i <= n; i++) {
            int h = (i == n) ? 0 : heights[i];       // sentinel bar of height 0 flushes the stack
            while (!stack.isEmpty() && heights[stack.peek()] >= h) {
                int height = heights[stack.pop()];   // bar i is the first one to its right that is not taller
                int leftBound = stack.isEmpty() ? -1 : stack.peek();  // nearest lower bar to its left
                int width = i - leftBound - 1;
                best = Math.max(best, height * width);   // at most 10^4 * 10^5 = 10^9 < 2^31 - 1
            }
            stack.push(i);
        }
        return best;
    }
}
```

Pushing the sentinel index n at the end is harmless: the loop is over, and `heights[n]` is never read, because nothing is popped after that.

#### Time complexity

**O(n) in every case.** Every index from 0 to n is pushed exactly once and popped at most once, so the inner `while` body runs at most n + 1 times over the whole method. Each step does constant work (`ArrayDeque` operations are amortized O(1)).

#### Space complexity

**O(n) auxiliary space** for the stack in the worst case: for strictly increasing heights nothing is popped until the sentinel, so all n indices are on the stack at once.

### Alternative: divide and conquer on the minimum

Take the lowest bar m of the whole range. The best rectangle either uses bar m, and then it can span the entire range at height `heights[m]`, or it does not, and then it lies entirely to the left of m or entirely to the right. So:

`best(L, R) = max(heights[m] × (R − L + 1), best(L, m − 1), best(m + 1, R))`, where m is the index of a minimum in L..R.

**Cost, stated precisely.** With a linear scan to find the minimum, the recurrence is T(n) = T(k) + T(n − 1 − k) + Θ(n), where k is the size of the left part.

- If the minimum lands near the middle each time, this is Θ(n log n).
- For a uniformly random permutation of distinct heights, the minimum's position is uniform, which is the recurrence of quicksort with a random pivot: Θ(n log n) **expected over random inputs**. The input is not random, though, and the algorithm has no randomness of its own to fall back on.
- For sorted heights (increasing or decreasing) the minimum is always at one end: Θ(n²) time, about 5 × 10^9 steps at n = 10^5, and a recursion depth of n. In Java, 10^5 nested calls overflow the default thread stack: a sorted input of 10^5 bars throws `StackOverflowError` before the time even matters.

Finding each minimum with a [[a12-sparse-tables|sparse table]] (O(n log n) to build, O(1) per query) or a [[a12-segment-trees|segment tree]] (O(log n) per query) makes the time O(n log n) in the worst case, since there are at most n recursive calls. The recursion depth is still Θ(n) on sorted input, so it needs an explicit stack of pending ranges.

**When it wins.** Rarely, in this problem: it is longer and slower than the monotonic stack. It is worth knowing as the natural answer to "the shortest bar splits the problem", and the minimum-split idea reappears in problems where the stack trick does not apply.

## 5. Comparison table

n = number of bars. Nothing here uses hashing; the only "expected" bound is the divide and conquer one, over random inputs.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Brute force, extending the minimum | O(n²) | O(n²) | O(1) |
| 2. Nearest lower bars, two passes | O(n) | O(n) | O(n) |
| 3. One pass with a sentinel | O(n) | O(n) | O(n) worst case |
| Alt. Divide and conquer, linear-scan minimum | O(n log n) over random permutations | O(n²), recursion depth n | O(n) recursion stack |
| Alt. Divide and conquer, sparse table | O(n log n) | O(n log n) | O(n log n) for the table |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Brute force | Exhaustive by construction; tiny | About 5 × 10^9 steps at n = 10^5 | Baseline and test reference |
| 2. Two passes | Each array has a simple meaning; easy to argue and debug | Two extra arrays, three passes | The safe answer if the one-pass bookkeeping feels shaky; also when the limits themselves are needed for something else |
| 3. One pass | Shortest linear solution; no arrays | The width and equal-height details need a careful argument | The answer to give |
| Alt. Divide and conquer | Follows directly from "the shortest bar splits the problem" | Quadratic and stack overflow on sorted input unless you add a range-minimum structure | To explain the minimum-split idea, not to submit |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 3. Derive it through the brute force and the "fix the shortest bar" reformulation, then the two-pass arrays, then the observation that the left pass already knows each bar's right limit at the moment it pops the bar.

**Is it optimal?** Yes in time: there is an Ω(n) worst-case lower bound for any algorithm that learns heights only by reading them. On the input of n bars all of height 1, the answer is n; if an algorithm never reads bar i, it cannot tell this input from the one with bar i lowered to 0, whose answer is max(i, n − 1 − i) < n. So every bar must be read on that input. The O(n) stack in the worst case is the price of a single pass; the two-pass version uses more memory, not less.

**When another solution is better in practice:**

- If you are not sure of the one-pass width rule under pressure, code Approach 2. The arrays make every step checkable, and it is the same complexity.
- If the heights come as a stream, Approach 3 already processes them one at a time; only the final answer waits for the end.

**When to stop:** with Approach 3, its correctness argument, the equal-heights explanation and the overflow bound, you are done. Replacing `ArrayDeque<Integer>` with an `int[]` used as a stack avoids boxing and is a fine remark, not a different algorithm.

## 7. Interview script: code it and test it

### What I say while coding

> "Signature `int largestRectangleArea(int[] heights)`. A deque of indices used as a stack, and `best = 0`."

> "The loop goes to `i <= n`, with a height of 0 at `i == n`. That's the sentinel that closes everything still open at the end."

> "While the top bar is at least as tall as the current one, pop it. The current index is the first bar to its right that's not taller; the new top is the nearest lower bar on its left, or −1 if the stack is empty. I check emptiness before peeking, because `peek` on an empty `ArrayDeque` returns `null`."

> "Width is `i − leftBound − 1`: the bars strictly between the two limits. Height times width is at most 10^9, so `int` is safe. Then push i."

### Testing out loud

**Normal case:** Example 1, as in the dry-run table: pops at i = 1, 4 (twice) and 6 (three times), best 10.

**Example 2:** `[2, 4]`. Push 0, push 1 (2 < 4). Sentinel: pop 1 with left limit 0, width 2 − 0 − 1 = 1, area 4; pop 0 with left limit −1, width 2, area 4. Returns 4.

**n = 1:** `[7]`. Push 0; the sentinel pops it with width 1 − (−1) − 1 = 1. Returns 7. `[0]` also works: 0 ≥ 0, so the sentinel pops it, area 0.

**Increasing:** `[1, 2, 3, 4, 5]`. Nothing is popped until the sentinel, which pops 4, 3, 2, 1, 0 with widths 1, 2, 3, 4, 5: areas 5, 8, 9, 8, 5. Returns 9. This is the case the sentinel exists for.

**Decreasing:** `[5, 4, 3, 2, 1]`. Each new bar pops the previous one, always with an empty stack below: areas 5 × 1, 4 × 2, 3 × 3, 2 × 4, then the sentinel pops the 1 with width 5. Returns 9.

**All equal:** `[3, 3, 3, 3]`: areas 3, 6, 9, then 12 at the sentinel, as traced in section 4. Returns 12.

**Zeros:** `[2, 0, 2]`. The 0 pops the first 2 (area 2) and is pushed; the last 2 is pushed on top of it. The sentinel pops the 2 (left limit 1, width 1, area 2) and the 0 (area 0). Returns 2.

**The lowest bar spans everything:** `[2, 1, 2]`. The 1 pops the first 2 (area 2). The sentinel pops the last 2 (left limit 1, width 1, area 2), then the 1 with an empty stack below, width 3, area 3. Returns 3.

**The extreme:** 10^5 bars of height 10^4. Each bar pops the previous equal one; the sentinel pops the last with width 10^5: area 10^9 = 1,000,000,000, below 2,147,483,647.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 3 min | Height = minimum of the run, zeros, n = 1, the 10^9 bound |
| Brute force | 3 min | O(n²) with a running minimum, and why it is too slow |
| Reformulate | 4 min | "Fix the shortest bar": nearest lower bar on each side; why it cannot miss |
| Monotonic stack | 5 min | Two passes first in words, then "the pop already knows both limits" |
| Code | 5 min | Approach 3 |
| Trace and edge cases | 6 min | Example 1 with the stack, an increasing input, all equal |
| Questions | rest | Section 9 |

**Where the time should go:** the reformulation and the width rule. Once "for each bar, nearest lower bar on each side" is said out loud, the rest is a known technique; most failed attempts either never make that switch or get the width wrong.

**If you get stuck:**

1. If the reformulation will not come, look at Example 1's answer and ask which bar limits its height, and why the rectangle stops where it does.
2. If the one-pass bookkeeping is shaky, write Approach 2 and say so. It is linear and each array is easy to check.
3. If you cannot remember whether to pop on `>` or `≥`, pick `≥` and trace `[3, 3, 3, 3]`: if the last pop has width 4, you are fine.
4. Accept a hint without fuss; the interviewer is grading how you use it ([[a14-responding-to-hints|Responding to Interviewer Hints]]).

## 9. Interviewer challenges

### About correctness

#### Why is the width `i − stack.peek() − 1` and not `i − poppedIndex`?

**What they are testing:** whether you understand what lies between the left limit and the popped bar.

**How to reason:** look at the bars between the new top of the stack and the popped bar. They were popped earlier, which means they were at least as tall.

**What I say:** "Bars between the left limit and the popped bar were popped earlier by something no taller than them, so they're all at least as tall as the popped bar. The rectangle extends over them. `i − poppedIndex` would only count the popped bar and the bars to its right, and miss everything to its left that was already popped."

**Nuance:** the wrong width still returns 10 on Example 1, which is why it survives casual testing. It returns 5 instead of 9 on `[5, 4, 3, 2, 1]`, 2 instead of 3 on `[2, 1, 2]`, and 8 instead of 12 on `[6, 2, 5, 4, 5, 1, 6]`.

#### Should you pop on `>=` or on `>`? What happens with equal heights?

**What they are testing:** whether you can reason about ties instead of copying an operator.

**How to reason:** follow an optimal rectangle's shortest bars. Ask which of the equal bars gets measured with the full width.

**What I say:** "Both work. With `>=`, an equal bar pops the earlier one and the earlier one's area is too narrow, but the later bar inherits its left limit, so the rightmost bar of the equal group is measured with the full width. With `>`, equal bars stay stacked, each one's left limit is the equal bar below it, so they are too narrow on the left, but the leftmost of the group is measured with the full width when a lower bar arrives. Either way the bar that matters gets the right rectangle."

**Nuance:** in the two-pass version the rule is different: at least one of the two passes must use "strictly lower". If both use "lower or equal", equal neighbours block each other: `[2, 2]` returns 2 and `[3, 3, 3, 3]` returns 3.

#### Why do you need the sentinel? Couldn't you just return `best` after the loop?

**What they are testing:** whether you know which bars are never popped.

**How to reason:** a bar is popped only by a later bar that is not taller. Which bars have no such bar?

**What I say:** "A bar with no lower-or-equal bar to its right is never popped by a real bar: in an increasing histogram, that's every bar. Without a final flush their rectangles are never measured. The sentinel is a bar of height 0 that pops all of them with right limit n. I could also write a second loop after the main one, but the sentinel avoids duplicating the body."

**Nuance:** without it, `[1, 2, 3, 4, 5]` and `[2, 4]` both return 0, and `[3, 3, 3, 3]` returns 9 instead of 12. Example 1 still returns 10, since its best bar is popped by the 2 at index 4 before the end.

### About complexity and arithmetic

#### There is a `while` inside a `for`. Why is this O(n)?

**What they are testing:** amortized analysis rather than counting nesting depth.

**How to reason:** count work per index, not per iteration of the outer loop.

**What I say:** "Each index is pushed exactly once and popped at most once. Every iteration of the inner loop pops one index, so across the whole run the inner loop executes at most n + 1 times, counting the sentinel. Total O(n)."

**Nuance:** a single step can still pop many indices: in `[1, 2, 3, …, n]` the sentinel pops all n at once. The bound is on the total, not on each step.

#### Can the area overflow an `int`?

**What they are testing:** computing a bound from the constraints, including the intermediate product.

**How to reason:** bound height and width separately.

**What I say:** "Height is at most 10^4 and width at most n = 10^5, so any product is at most 10^9, and 2^31 − 1 is about 2.15 × 10^9. So `height * width` can't overflow, and neither can `best`."

**Nuance:** the headroom is only about 2×. If heights could reach 10^5 the bound would be 10^10, and the product would have to be computed in `long`. The test suite includes 10^5 bars of height 10^4, the exact 10^9 case.

#### Is O(n) the best possible?

**What they are testing:** whether you can justify stopping.

**How to reason:** find an input on which every bar matters.

**What I say:** "Yes. With all bars at height 1 the answer is n; lowering any single bar to 0 changes it to less than n. So an algorithm that skips any bar on that input can be fooled: a worst-case Ω(n) lower bound for algorithms that read the heights."

**Nuance:** it is a worst-case statement about the time; it says nothing about extra space, where the stack is O(n) in the worst case.

## 10. Follow-up questions the interviewer might ask

**"Given a binary matrix, find the largest rectangle containing only 1s."**
This is LeetCode's Maximal Rectangle. Process the rows from top to bottom, keeping for each column the number of consecutive 1s ending at the current row; each row is then a histogram, and this algorithm runs on it. O(rows × cols) time, O(cols) space.

**"Return the rectangle's position as well as its area."**
When an area beats `best`, record `leftBound + 1`, `i − 1` and the height. Same O(n).

**"Find the largest square instead."**
For each bar's span from Approach 2 (or at each pop in Approach 3), the largest square at that bar is `min(height, width)` squared. The optimal square has some shortest bar, and that bar's span contains it, so the same argument applies. O(n).

**"Sum, over every subarray, the minimum of that subarray."**
Same structure: bar i is the minimum of `(i − left[i]) × (right[i] − i)` subarrays. Here ties must be broken asymmetrically (strictly lower on one side, lower or equal on the other) so that each subarray is counted once, the same issue as in section 9 but now it changes the answer. O(n), and the sum needs a `long` or a modulus.

**"The bars arrive one at a time and you must report the best area so far after each one."**
Approach 3 measures a bar only when it is popped, so after a prefix the running `best` misses the bars still on the stack (for an increasing prefix it is still 0). Popped bars are final, so the prefix's answer is `best` combined with each stack entry's rectangle extended to the current end, using the entry below it as its left limit. That costs O(stack size) per report, O(n) in the worst case; the stack itself is still O(1) amortized per bar.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Searching over pairs of ends.** It leads to O(n²) and no obvious way down. The step that unlocks the problem is fixing the shortest bar instead.
- **Extending a bar only over its immediate neighbours.** A bar's rectangle extends over every bar at least as tall, not just adjacent ones: in Example 1, the 2 at index 4 extends over the 5 and the 6.
- **Thinking equal heights need special handling.** Either pop rule works; what matters is that the bar measured last in each equal group gets the full span. Trace `[3, 3, 3, 3]` to convince yourself.
- **Assuming divide and conquer on the minimum is O(n log n).** Only when the minimum splits the range well; on sorted input it is quadratic with recursion depth n.

### Implementation mistakes

> [!MISTAKE] Width measured from the popped index
> `width = i − poppedIndex` forgets the taller bars to the left of the popped bar that were popped earlier. Example 1 still returns 10, but `[5, 4, 3, 2, 1]` returns 5 instead of 9, `[2, 1, 2]` returns 2 instead of 3, and `[6, 2, 5, 4, 5, 1, 6]` returns 8 instead of 12.

> [!MISTAKE] No sentinel and no final flush
> Looping only to `i < n` never measures bars without a lower bar to their right. `[1, 2, 3, 4, 5]` and `[2, 4]` return 0, `[7]` returns 0, and `[3, 3, 3, 3]` returns 9.

- **Peeking without checking for an empty stack.** `stack.peek()` on an empty `ArrayDeque` returns `null`, and assigning it to an `int` throws `NullPointerException`. Without the check, every input throws, because the sentinel always ends up popping the bottom index; Example 1 already throws at i = 1, when the 2 is popped.
- **Both passes "lower or equal" in the two-pass version.** Popping on `>` in both passes returns 2 for `[2, 2]` and 3 for `[3, 3, 3, 3]`.
- **Storing heights on the stack instead of indices.** You need the left limit's *position* for the width; with only heights you cannot compute it.
- **`long` where none is needed, or `int` where it is.** Here 10^9 fits in an `int`; say so, and say when it would stop fitting.

## 12. Pattern recognition

**The pattern:** "for every element, the nearest smaller (or greater) element on each side", computed with a [[a5-monotonic-stack|monotonic stack]] in amortized O(1) per element. Here it answers "how far can this bar stretch as the shortest bar of a rectangle".

**Signals in the problem statement:**

- A quantity determined by the minimum (or maximum) of a contiguous range, optimized over all ranges.
- A brute force that extends left and right from each element until something smaller or larger appears.
- Bars, heights, histograms, skylines.

**Related problems in this list:**

- [[nc-daily-temperatures|Daily Temperatures]]: the simplest monotonic stack, next warmer day for each day; the same pop rule with the comparison flipped.
- [[nc-online-stock-span|Online Stock Span]]: for each new price, how far back the prices are no higher: the "left limit" of this problem, computed online.
- [[nc-trapping-rain-water|Trapping Rain Water]]: bars again; its stack solution pops when a taller bar arrives and measures water between walls, where this one pops on a lower bar and measures rectangles.
- [[nc-sliding-window-maximum|Sliding Window Maximum]]: a monotonic deque, the same "discard elements that can never be the answer" idea over a moving window.
- [[nc-car-fleet|Car Fleet]]: a stack where later elements absorb earlier ones, with the same push-once, pop-once cost argument.

**Takeaway:** when an answer is "the best range in which this element is the minimum", find each element's nearest smaller neighbour on both sides; a stack kept in increasing order gives both limits at the moment an element is popped.

## 13. 60-second revision card

**Key insight:** the best rectangle has a shortest bar; for each bar, stretch from just after the nearest lower bar on the left to just before the nearest lower bar on the right. Area = height × (right − left − 1).

**Invariant:** the stack holds indices with strictly increasing heights; when a bar is popped by index i, i is its right limit and the new top (or −1) is its left limit.

**Complexity:** O(n) time (each index pushed and popped once), O(n) stack in the worst case. Ω(n) worst-case lower bound. Areas ≤ 10^4 × 10^5 = 10^9 < 2^31 − 1.

**Code skeleton:**

```java title="Largest Rectangle in Histogram, one pass" fragment="public int largestRectangleArea(int[] heights)"
Deque<Integer> stack = new ArrayDeque<>();
int n = heights.length, best = 0;
for (int i = 0; i <= n; i++) {
    int h = (i == n) ? 0 : heights[i];                  // sentinel flushes the stack
    while (!stack.isEmpty() && heights[stack.peek()] >= h) {
        int height = heights[stack.pop()];
        int left = stack.isEmpty() ? -1 : stack.peek(); // check before peeking
        best = Math.max(best, height * (i - left - 1)); // width between the two lower bars
    }
    stack.push(i);
}
return best;
```

**Main traps:**

- Width is `i − newTop − 1`, not `i − popped`.
- Loop to `i <= n` with a height-0 sentinel, or flush the stack afterwards.
- Check for an empty stack before `peek`.
- Equal heights: either pop rule in the one-pass version; in two passes, at least one side strictly lower.

**What to say in one breath:** "Every rectangle has a shortest bar, so for each bar I find the nearest lower bar on each side and take height times the gap. A stack of indices with increasing heights gives both limits when a bar is popped: the popper on the right, the bar beneath on the left. A zero sentinel flushes the end. Each index is pushed and popped once, so O(n), and the area is at most 10^9, which fits in an `int`."
