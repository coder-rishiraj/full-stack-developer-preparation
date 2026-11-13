---
problemId: nc-container-with-most-water
title: Container With Most Water
source: neetcode
sourceUrl: https://leetcode.com/problems/container-with-most-water/
difficulty: medium
patterns: [two-pointers, greedy]
relatedLessons: [a2-two-pointers, a14-brute-force-first, a14-deriving-optimization, a14-edge-cases]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

You get an array `height` of n numbers. Picture n vertical lines standing on the x-axis: line i stands at x = i and is `height[i]` tall. Pick two of the lines. Together with the x-axis they form a container, and the water it holds is limited by the shorter of the two lines (the water would spill over it) and by the distance between them. Return the largest amount of water any pair of lines can hold. The container may not be tilted, and the other lines do not get in the way.

For lines i < j the amount is `min(height[i], height[j]) × (j − i)`.

**Example 1**

- Input: `height = [1, 8, 6, 2, 5, 4, 8, 3, 7]`
- Output: `49`
- Why: lines 1 and 8 have heights 8 and 7. The water level is the shorter one, 7, and the lines are 8 − 1 = 7 apart, so 7 × 7 = 49. The two 8s (lines 1 and 6) are taller, but only 5 apart: 8 × 5 = 40.

**Example 2**

- Input: `height = [4, 3, 2, 1, 4]`
- Output: `16`
- Why: the two outer lines are both 4 tall and 4 apart. Every other pair is either shorter or narrower.

**What the problem statement guarantees**

- n == `height.length`, and 2 ≤ n ≤ 10^5, so there is always at least one pair.
- 0 ≤ `height[i]` ≤ 10^4. Lines of height 0 are allowed.
- The answer is a single number, the area, not the pair of lines.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The fast solution is short, but an interviewer will ask why it cannot miss the best pair, and that argument is the real content of this problem. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 20 minutes and talk out loud.
2. Write down the formula for one pair, and the simplest solution that is certainly correct, with its complexity.
3. Look at the widest pair, the first and last lines. Ask what you learn from its area about other pairs.
4. Write your faster solution and trace it on Example 1 by hand, writing the area at every step.
5. Before you call it done, say in two sentences why it cannot skip the best pair.

Open a hint only after two minutes without progress. After each hint, close it and try again before opening the next one.

> [!HINT] Hint 1: a small nudge
> Start from the widest pair. Width can only shrink from there, so any better pair must be taller. Which of the two outer lines is limiting the height?

> [!HINT] Hint 2: the kind of tool you need
> Keep one index at each end and move them towards each other, recording the area at every step. The only question is which index to move.

> [!HINT] Hint 3: almost the whole plan
> Suppose the left line is the shorter one. Every pair that uses it together with a line between the two indices is narrower and no taller than the pair you just measured. So the left line has nothing more to offer: move past it. Do the same for the right line when it is the shorter one, and stop when the indices meet.

**Check yourself before revealing the walkthrough**

- [ ] I said the O(n²) solution and its complexity first
- [ ] My code returns 49 for Example 1, 16 for Example 2 and 1 for `[1, 1]`
- [ ] I can explain why moving the taller line can never produce a larger area
- [ ] I checked that the largest possible area fits in an `int`

## 3. Interview script: understand the problem (≈2 min)

**Me:** Let me say it back. Each value is the height of a vertical line, and line i sits at x = i. I choose two lines; the water they hold is the shorter height times the distance between them. I return the largest such area, just the number.

**Interviewer:** Yes.

**Me:** The lines in between don't matter? If there's a tall line between my two, the water still fills the whole width?

**Interviewer:** Right, only the two chosen lines matter.

**Me:** Good, so each pair is independent of the rest of the array: area = min(height[i], height[j]) × (j − i). How many lines, and how tall?

**Interviewer:** Between 2 and 10^5 lines, heights from 0 to 10^4.

**Me:** Then the biggest possible area is a width of at most 10^5 − 1 = 99,999 times a height of at most 10^4, which is 999,990,000. That's below 2^31 − 1, about 2.147 × 10^9, so an `int` holds every area, and the product `min × width` cannot overflow either. With 10^5 lines there are about 5 × 10^9 pairs, so checking all of them is too slow; I'm aiming for linear or n log n.

**Me:** Heights of 0 are allowed, so an answer of 0 is possible, for example when every line is 0.

**Me:** Quick example by hand: `[1, 8, 6, 2, 5, 4, 8, 3, 7]`. The widest pair is the two ends, 1 and 7, width 8, but the 1 makes it only 8. The two 8s give 8 × 5 = 40. The 8 at index 1 with the 7 at the end gives 7 × 7 = 49. That looks like the best; I'll let the algorithm confirm it.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 2 ≤ n ≤ 10^5 | There is always a pair, so the answer is defined. All pairs is about 5 × 10^9 checks at n = 10^5: too slow. Linear or n log n is the target. |
| 0 ≤ height[i] ≤ 10^4 | Areas reach at most 99,999 × 10^4 = 999,990,000 < 2^31 − 1, so `int` arithmetic is safe. Zero heights make an answer of 0 possible. |
| Area = shorter line × distance | The shorter line alone caps a pair's height. That single fact drives the fast solution. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Lines between the chosen two do not matter | Each pair's area depends only on its two heights and their distance. No need to look at the lines in between. |
| Return the area only | No need to remember which pair achieved it. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The input array is read-only | Nothing says I may modify it, and the fast solution does not need to. |
| Line i stands at x = i, so the distance between lines i and j is j − i | That is what the statement's picture means; if the x-positions were arbitrary, I would need them as a second input (see the follow-ups). |

### Edge cases I will keep in mind

- n = 2: the only pair is the answer, for example `[1, 1]` gives 1.
- All heights 0, or all but one 0: the answer is 0.
- The best pair is the two ends: `[4, 3, 2, 1, 4]`.
- The tallest lines are close together and short lines are far apart: `[1, 100, 100, 1]` gives 100, not 3.
- Equal heights at both pointers, where the code has to pick one side to move.
- Strictly increasing or decreasing heights.
- The largest case: n = 10^5, all heights 10^4, answer 999,990,000.

## 4. Think out loud: from first idea to best solution

### Approach 1: Brute force (try every pair)

#### What I say out loud

> "The answer is the best of all pairs, and each pair's area is one formula. So the certainly-correct baseline is two nested loops over i < j, keeping the maximum. That's about n²/2 pairs, roughly 5 × 10^9 for 10^5 lines, which is too slow here, but it tells me what I'm improving on."

#### Intuition

There are n(n − 1)/2 pairs and the answer is the best of them. Checking all of them cannot miss it.

#### Algorithm

1. `best = 0`.
2. For every i from 0 to n − 2 and every j from i + 1 to n − 1: compute `min(height[i], height[j]) × (j − i)` and keep the larger of it and `best`.
3. Return `best`.

#### Why it is correct

Every pair of lines is examined exactly once, `best` ends as the largest area among them, and every value it ever takes is the area of a real pair (or the initial 0, which is never larger than a real area, since areas are non-negative).

#### Dry run

`height = [1, 3, 2, 4]`

| i | j | min height | width | area | best |
|---|---|---|---|---|---|
| 0 | 1 | 1 | 1 | 1 | 1 |
| 0 | 2 | 1 | 2 | 2 | 2 |
| 0 | 3 | 1 | 3 | 3 | 3 |
| 1 | 2 | 2 | 1 | 2 | 3 |
| 1 | 3 | 3 | 2 | 6 | 6 |
| 2 | 3 | 2 | 1 | 2 | 6 |

Returns 6: the lines of height 3 and 4, two apart.

#### Java code

```java title="Approach 1: brute force"
class Solution {
    public int maxArea(int[] height) {
        int best = 0;
        for (int i = 0; i < height.length - 1; i++) {
            for (int j = i + 1; j < height.length; j++) {
                int area = Math.min(height[i], height[j]) * (j - i);
                best = Math.max(best, area);
            }
        }
        return best;
    }
}
```

#### Time complexity

**O(n²)** in every case, where n is the number of lines: exactly n(n − 1)/2 area computations, each constant time. For n = 10^5 that is 4,999,950,000.

#### Space complexity

**O(1) auxiliary space**: a few `int` variables. The input is not counted and not modified.

#### The bridge to the next approach

> "Where is the waste? Look at the widest pair, the two ends. Say the left end is the shorter one, height 1 in Example 1. Its area is 1 × 8. Now think about every other pair that uses that left line: whatever partner it gets, the water level is at most 1, because the left line is that short, and the width is less than 8, because the partner is inside. So none of those pairs can beat the one I just measured. The brute force still tries all of them."

> "That means one measurement lets me throw away a whole line. If I throw away one line per step, starting from the two ends, I get n − 1 steps instead of n² / 2. The question is which line I'm allowed to throw away, and I just argued it's the shorter one. Let me check the other direction too before I trust it."

### Approach 2: Two pointers from both ends, move the shorter line (recommended)

#### What I say out loud

> "I start with one index at each end, the widest possible container. I record its area. Then I move the index that points at the shorter line one step inward, record again, and repeat until the indices meet. Return the best area I recorded."

> "Why the shorter one? The shorter line sets the water level. If I kept it and moved the taller line inward, the width would drop and the level could never rise above that same short line, so I'd only ever get smaller areas. Moving the shorter line is the only move that could find a taller level to make up for the lost width."

> "It's one pass, each step moves one index, so O(n) time and O(1) space."

#### Intuition

Think of the window `[left, right]` as the set of lines that might still be part of a better container. The pair at the two ends is the widest pair inside the window. Its shorter line has already done its best: paired with anything inside the window it is narrower and no taller. So the shorter line leaves the window, and the window shrinks by one. This is the converging pair from [[a2-two-pointers|Two Pointers]], with a different reason for discarding an end than in sorted-array problems.

#### Algorithm

1. `left = 0`, `right = n − 1`, `best = 0`.
2. While `left < right`:
   1. `best = max(best, min(height[left], height[right]) × (right − left))`.
   2. If `height[left] < height[right]`, do `left++`; otherwise do `right--`.
3. Return `best`.

#### Why it is correct

The whole argument rests on one inequality. Take the current window with `height[left] ≤ height[right]`, and any line j strictly inside it (`left < j < right`). Then

- the pair (left, j) is narrower: `j − left < right − left`;
- and it is no taller: `min(height[left], height[j]) ≤ height[left] = min(height[left], height[right])`.

So `area(left, j) ≤ area(left, right)`, and `area(left, right)` has just been recorded in `best`. **Every pair that pairs the shorter line with a line inside the window is no larger than what we already have**, so dropping the shorter line loses nothing. The same holds with the roles swapped when the right line is shorter. When the two are equal, either one may be dropped; the code drops the right one.

**Why moving the taller line can never help.** Suppose `height[left] < height[right]` and you moved `right` instead. Every pair you could then measure while `left` stays put is a pair (left, j) with j inside the old window, and the inequality above says each of those is no larger than `area(left, right)`. The taller line was never the limit; the short one was, and it is still there. Only replacing the short line gives a chance of a higher water level.

**The invariant:** `best` is at least the area of every pair that has at least one line outside the window `[left, right]`.

- At the start the window is the whole array, so no pair has a line outside it: true.
- Each step removes one line, the shorter end. The pairs that become "outside" are exactly the pairs using that line with a partner still inside the window, plus the pair (left, right) itself. The inequality shows each of them is at most `area(left, right)`, which is now in `best`. Pairs using it with lines already outside were covered before.
- The loop ends when `left == right`. Then no pair lies completely inside the window, so `best` is at least the area of every pair.
- Conversely, `best` is always the area of a real pair (or 0, which no real area is below). So at the end `best` is exactly the maximum.

**The 25-second version to say to the interviewer:**

> "The two ends are the widest pair in the window. If the left line is the shorter one, any other pair using it has a partner inside, so it's narrower, and its height is still capped by that left line. So none of those pairs beats the area I just recorded, and I can drop the left line for good. Each step drops one line without losing the optimum, and when the pointers meet every pair has been accounted for."

#### Dry run

Example 1: `height = [1, 8, 6, 2, 5, 4, 8, 3, 7]`

| left | right | height[left], height[right] | width | area | best | Move |
|---|---|---|---|---|---|---|
| 0 | 8 | 1, 7 | 8 | 8 | 8 | 1 < 7, `left++` |
| 1 | 8 | 8, 7 | 7 | 49 | 49 | 8 ≥ 7, `right--` |
| 1 | 7 | 8, 3 | 6 | 18 | 49 | `right--` |
| 1 | 6 | 8, 8 | 5 | 40 | 49 | tie, `right--` |
| 1 | 5 | 8, 4 | 4 | 16 | 49 | `right--` |
| 1 | 4 | 8, 5 | 3 | 15 | 49 | `right--` |
| 1 | 3 | 8, 2 | 2 | 4 | 49 | `right--` |
| 1 | 2 | 8, 6 | 1 | 6 | 49 | `right--`, now `left == right`, stop |

Returns 49 after 8 = n − 1 steps. Notice the tie at (1, 6): moving `right` dropped the 8 at index 6, which is safe because its best remaining partners are all inside the window and narrower.

#### Java code

```java title="Approach 2: two pointers, move the shorter line (recommended)"
class Solution {
    public int maxArea(int[] height) {
        int left = 0;
        int right = height.length - 1;
        int best = 0;
        while (left < right) {
            // At most 99,999 * 10^4 = 999,990,000, which fits in an int.
            int area = Math.min(height[left], height[right]) * (right - left);
            best = Math.max(best, area);
            if (height[left] < height[right]) {
                left++;      // the left line is the limit; it cannot do better with anything inside
            } else {
                right--;     // the right line is the limit (or they are equal)
            }
        }
        return best;
    }
}
```

#### Time complexity

**O(n) in the worst case**, where n is the number of lines. The pointers start n − 1 apart, every iteration moves exactly one of them one step closer, and the loop stops when they meet: exactly n − 1 iterations, each constant time.

#### Space complexity

**O(1) auxiliary space**: three `int` variables. The input is not modified.

## 5. Comparison table

n = number of lines. Neither approach uses hashing or randomness, so expected and worst case are the same.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Brute force | O(n²) | O(n²) | O(1) |
| 2. Two pointers | O(n) | O(n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Brute force | Correct by inspection, since it checks every pair; trivial to write | About 5 × 10^9 steps at the maximum size | As the stated baseline, and as the reference when testing |
| 2. Two pointers | Linear, constant space, eight lines of code | Its correctness is not visible from the code; you must be able to argue it | The answer to give |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2, together with the "shorter line cannot do better inside the window" argument. The code is easy; the argument is what the interviewer is grading.

**Is it optimal?** Yes, for time and space. Space is already O(1). For time, there is an Ω(n) worst-case lower bound for any algorithm that learns heights only by reading them: on an all-zero input the answer is 0, and if an algorithm left two positions i < j unread, it could not tell that input apart from the same array with those two heights set to 1, whose answer is j − i ≥ 1. So it must read at least n − 1 positions on that input.

**When to stop:** once you have the two-pointer solution, its correctness argument, and the overflow check. Skipping lines that are no taller than the one you just left is a constant-factor tweak; mention it only if asked about speed.

## 7. Interview script: code it and test it

### What I say while coding

> "Signature `int maxArea(int[] height)`. `left` at 0, `right` at the last index, `best` at 0, since areas are never negative."

> "The loop runs while `left < right`; when they meet there's no pair left. Area is the minimum height times `right − left`. I checked earlier that this product stays below 10^9."

> "Then I move the pointer at the shorter line. On a tie I move `right`; either side would be correct, because both lines are the limit."

### Testing out loud

**Normal case:** Example 1 as in the dry run: 8, 49, 18, 40, 16, 15, 4, 6. Returns 49.

**Smallest input:** `[1, 1]`. One iteration: area 1 × 1 = 1, tie, `right--`, loop ends. Returns 1.

**Best pair at the ends, with ties:** `[4, 3, 2, 1, 4]`. (0, 4): 4 × 4 = 16, tie, `right--`. (0, 3): 1 × 3 = 3, `right--`. (0, 2): 2 × 2 = 4, `right--`. (0, 1): 3 × 1 = 3, `right--`. Returns 16.

**Tall lines close together:** `[1, 100, 100, 1]`. (0, 3): 1 × 3 = 3, tie, `right--`. (0, 2): 1 × 2 = 2, 1 < 100, `left++`. (1, 2): 100 × 1 = 100, tie, `right--`. Returns 100.

**All zeros:** `[0, 0, 0]`. Every area is 0. Returns 0.

**Largest case:** 10^5 lines of height 10^4. The first area is 10^4 × 99,999 = 999,990,000, which is the answer, and it fits in an `int`.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 2 min | The area formula, the constraints, the overflow bound |
| Brute force | 1 min | Say it with its complexity; do not code it |
| Derive the two-pointer idea | 3–4 min | Start from the widest pair, find which line is useless |
| Argue correctness | 2 min | The inequality and the invariant, before coding |
| Code | 3 min | Approach 2 |
| Trace and edge cases | 3 min | Example 1, `[1, 1]`, ties, all zeros |
| Questions | rest | Section 9 |

Spend the time on the correctness argument: most candidates can write this code from memory, and the argument is what separates them. If you are stuck, measure the widest pair, then ask "is there any line I now know cannot be part of a better answer?"

## 9. Interviewer challenges

### About correctness

#### Why do you move the shorter line and not the taller one?

**What they are testing:** the core argument, not the code.

**How to reason:** fix the shorter line and look at every pair it could still form inside the window. Width shrinks; height is capped by the short line. So none of them wins.

**What I say:** "The shorter line limits the water level. Any other container that uses it pairs it with a line inside the window, so it's narrower, and its level still can't exceed that short line. So it can't beat the area I just recorded, and the short line is finished. Moving the taller one instead would keep the short line as the limit and only reduce the width, so it can only find smaller areas."

**Nuance:** the argument says moving the taller line *cannot help*; it does not say that the next window after moving the shorter line is better. It often is not (in Example 1 the area falls from 49 to 18). Moving the shorter line is merely the only move that can still lead somewhere better.

#### Two pointers usually need sorted input. This array isn't sorted. Why does it work?

**What they are testing:** whether you know *why* two pointers work, rather than matching on a pattern.

**How to reason:** the pointer technique needs a rule that lets you discard an end safely. In sorted-sum problems the order of values gives that rule. Here the order that matters is the order of positions, which sets the widths, and the positions are sorted by definition.

**What I say:** "What's monotone here is the width: moving either pointer inward always makes it smaller. Together with 'the shorter line caps the height', that's enough to prove the shorter end is useless. I never need the heights to be sorted."

**Nuance:** sorting the heights would destroy the positions and therefore the widths, so it would be wrong, not just unnecessary.

#### How do you know you didn't skip the best pair?

**What they are testing:** whether you can state an invariant instead of saying "it's greedy".

**How to reason:** say which pairs have been accounted for at each moment.

**What I say:** "At any moment, every pair that has at least one line outside the window has an area no bigger than `best`. It holds at the start, when nothing is outside. Each step pushes out the shorter end, and every pair that uses it with a line still inside is narrower and no taller than the pair I just recorded. When the pointers meet, every pair has a line outside, so `best` is the maximum."

**Nuance:** this is an exchange-style argument that shows the discarded pairs are dominated. It is the same kind of reasoning [[a10-sorting-greedy|greedy algorithms]] rely on.

#### What happens when both lines have the same height?

**What they are testing:** whether your rule is fully specified and you can defend the tie-break.

**How to reason:** apply the argument to each line separately. Both are "the shorter line".

**What I say:** "Then both are the limit, so the argument applies to both: neither can do better with a partner inside the window. I can move either one, or even both. My code moves `right`."

**Nuance:** moving both at once is also correct and saves a step, but it is one more case to explain. In Example 1, the tie at (1, 6) shows the safe choice: the 8 at index 6 could only pair with lines inside the window, all narrower.

### About complexity and arithmetic

#### Can the area overflow?

**What they are testing:** whether you compute bounds from the constraints.

**How to reason:** take the largest width and the largest height.

**What I say:** "Width is at most n − 1 = 99,999 and height at most 10^4, so at most 999,990,000, below 2^31 − 1 ≈ 2.147 × 10^9. An `int` is enough, product included."

**Nuance:** if heights could reach 10^9 the product could exceed the `int` range, and I'd compute it as a `long`.

#### Is O(n) optimal?

**What they are testing:** whether you know when to stop, with a reason.

**How to reason:** find an input on which skipping elements would make an algorithm wrong.

**What I say:** "Yes. Take an all-zero input, answer 0. If an algorithm never read two of the positions, it couldn't tell that apart from the same array with those two set to 1, which has a positive answer. So it has to read at least n − 1 values: a worst-case Ω(n) lower bound, which this matches with O(1) space."

**Nuance:** the bound is for algorithms that learn heights by reading them; it is about the worst case, not every input.

## 10. Follow-up questions the interviewer might ask

**"Return the two indices instead of the area."**
Remember `left` and `right` whenever `best` improves. Same O(n) time and O(1) space. If several pairs tie, say which one you return (the first found by the scan).

**"The lines stand at arbitrary x-positions, given as a sorted array `x`."**
Width becomes `x[right] − x[left]`. The argument still holds, because moving either pointer inward still shrinks the width. O(n). If the positions are not sorted, sort the lines by position first: O(n log n).

**"How much water does the whole landscape hold, if every bar is solid and water collects between them?"**
That is a different question, [[nc-trapping-rain-water|Trapping Rain Water]]: the bars in between now matter and you sum water over every column. It also uses two pointers from both ends, with a different invariant.

**"What if heights can be up to 10^9?"**
The area can reach about 10^5 × 10^9 = 10^14, so compute and store it as a `long`. The algorithm does not change.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **"Pick the two tallest lines" or "pick the widest pair".** In Example 1 the two tallest lines (the 8s) give 40 and the widest pair gives 8; the answer is 49. Neither rule is reliable.
- **Sorting the heights.** It destroys the positions, and the positions are the widths.
- **Thinking the next window is always better.** The two-pointer rule only guarantees that nothing discarded was better. Areas go up and down during the scan, so you must keep a running maximum.
- **Claiming correctness with "it's greedy".** That names the strategy without justifying it. Give the inequality: a narrower pair whose height is still capped by the same short line.
- **Thinking the lines in between block the water.** They do not in this problem; only the two chosen lines matter.

### Implementation mistakes

> [!MISTAKE] Moving the taller line
> Swapping the two moves (`right--` when the left line is shorter) keeps the short line as the limit forever. On Example 1 it returns 8 instead of 49: the left pointer never leaves the line of height 1, so every window after the first is capped at height 1.

> [!MISTAKE] Using `max` instead of `min` for the height
> The water spills over the shorter line. With `max`, Example 1 returns 56 (8 × 7 from the first window), more than any real container holds.

- **Not keeping a running maximum.** Returning the last area, or the area when the pointers meet, is wrong; the best pair can appear at any step.
- **Width as `right − left + 1`.** The lines stand at x = left and x = right, so the distance is `right − left`. The `+ 1` belongs to counting elements, not distances.
- **Moving both pointers every step.** It skips pairs that can be the answer: Example 1 returns 24. Only on a tie is moving both safe.

## 12. Pattern recognition

**The pattern:** two pointers converging from both ends, where each step discards one end because it is provably useless for every pair still inside the window.

**Signals in the problem statement:**

- The answer is the best pair (i, j), and the value depends on the distance between them, which shrinks as the pointers converge.
- The value is limited by the smaller (or weaker) of the two elements.
- Brute force over pairs is too slow, and there is no lookup that turns a pair into a single search.

**Related problems in this list:**

- [[nc-trapping-rain-water|Trapping Rain Water]]: lines become solid bars and the water is summed over all columns; also solved with two pointers from both ends.
- [[nc-two-sum-ii-input-array-is-sorted|Two Sum II - Input Array Is Sorted]]: converging pointers where sorted values tell you which end to discard.
- [[nc-3sum|3Sum]]: the same converging scan inside an outer loop.
- [[nc-boats-to-save-people|Boats to Save People]]: pair the extremes, and argue which end can be settled at each step.
- [[nc-largest-rectangle-in-histogram|Largest Rectangle in Histogram]]: area = width × shortest bar again, but over a contiguous range of bars, which needs a stack.

**Takeaway:** when the score of a pair is "the weaker element × the distance", start with the widest pair and discard the weaker end: it cannot do better with anything closer.

## 13. 60-second revision card

**Key insight:** the area is capped by the shorter line. Paired with anything inside the window it is narrower and no taller, so once measured against the far end, the shorter line is finished.

**Invariant:** every pair with a line outside `[left, right]` has area ≤ `best`.

**Complexity:** O(n) time (exactly n − 1 steps), O(1) space. Ω(n) worst-case lower bound. Max area 999,990,000 fits in an `int`.

**Code skeleton:**

```java title="Container With Most Water in seven lines" fragment="public int maxArea(int[] height)"
int left = 0, right = height.length - 1, best = 0;
while (left < right) {
    best = Math.max(best, Math.min(height[left], height[right]) * (right - left));
    if (height[left] < height[right]) left++;   // drop the shorter line
    else right--;
}
return best;
```

**Main traps:**

- Moving the taller line: Example 1 returns 8.
- `max` instead of `min`: the water spills over the shorter line.
- Forgetting the running maximum.
- Width is `right − left`, not `+ 1`.

**What to say in one breath:** "Start with the widest pair. The shorter line caps the height, so any other pair using it is narrower and no taller; it can't beat what I just recorded, and I drop it. One pass, O(n) time, O(1) space, and the area stays under 10^9."
