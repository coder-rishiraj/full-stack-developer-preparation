---
problemId: nc-daily-temperatures
title: Daily Temperatures
source: neetcode
sourceUrl: https://leetcode.com/problems/daily-temperatures/
difficulty: medium
patterns: [stack, monotonic-stack]
relatedLessons: [a5-stack, a5-monotonic-stack, a5-next-greater-smaller, a14-deriving-optimization]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

You get the daily temperatures as an array `temperatures` of length n. For every day i, report how many days you have to wait after day i to get a **strictly** warmer day. If no later day is warmer, report 0. Return the answers as an array of length n.

**Example 1**

- Input: `temperatures = [73, 74, 75, 71, 69, 72, 76, 73]`
- Output: `[1, 1, 4, 2, 1, 1, 0, 0]`
- Why: after day 2 (75) the next warmer day is day 6 (76), four days later. After day 3 (71) it is day 5 (72), two days later; day 4 (69) is not warmer. Nothing after day 6 (76) is warmer, and day 7 is the last day, so both get 0.

**Example 2**

- Input: `temperatures = [30, 40, 50, 60]`
- Output: `[1, 1, 1, 0]`
- Why: every day is followed directly by a warmer one, except the last.

**What the problem statement guarantees**

- 1 ≤ n ≤ 10^5, where n = `temperatures.length`.
- 30 ≤ `temperatures[i]` ≤ 100.
- The method is `public int[] dailyTemperatures(int[] temperatures)`.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The direct method is a two-line nested loop; the question is how to avoid scanning the same stretch of days over and over.

**How to practise**

1. Set a timer for 20 minutes and talk out loud.
2. Write the direct method and work out its worst case for n = 10^5. Which input makes it slowest?
3. Walk through Example 1 from left to right. At each day, write down the earlier days that are still waiting for their warmer day. What order are their temperatures in?
4. Decide what should happen to the waiting days when a warm day arrives, and which of them it affects.
5. Trace your solution on Example 1 and on a run of equal temperatures.

Open a hint only after two minutes without progress. After each hint, close it and try again before opening the next one.

> [!HINT] Hint 1: a small nudge
> Think about the days that are still waiting for an answer. If day a and a later day b are both still waiting, what can you say about their temperatures compared with each other?

> [!HINT] Hint 2: the kind of tool you need
> The waiting days, oldest to newest, never get warmer. A new day settles waiting days starting from the most recent one, and stops at the first one that is at least as warm. Keep the waiting days in a structure where you add and remove only at the newest end, and store positions so you can compute distances.

> [!HINT] Hint 3: almost the whole plan
> Keep a stack of indices. For each day i: while the stack is not empty and the temperature at its top is strictly lower than `temperatures[i]`, pop the top j and set `answer[j] = i − j`. Then push i. Indices left on the stack at the end keep the default answer 0. Each index is pushed once and popped at most once.

**Check yourself before revealing the walkthrough**

- [ ] My solution returns `[1, 1, 4, 2, 1, 1, 0, 0]` for Example 1
- [ ] `[70, 70, 71]` returns `[2, 1, 0]`: an equal day is not warmer
- [ ] I can explain why a `while` inside the `for` is still O(n) in total
- [ ] I know what happens to days that never find a warmer day

## 3. Interview script: understand the problem (≈2 min)

**Me:** For each day I return the distance to the next strictly warmer day, and 0 if there is none. An equal temperature doesn't count as warmer?

**Interviewer:** Right, it has to be strictly higher.

**Me:** Sizes and values?

**Interviewer:** Up to 10^5 days, temperatures between 30 and 100.

**Me:** So only 71 possible temperatures, which is unusually small; I'll remember that. And n = 10^5 rules out anything quadratic in the worst case. Answers are distances, at most n − 1, so `int` is fine.

**Me:** By hand on Example 1: day 0 is 73, the next day is 74, so 1. Day 2 is 75: I scan 71, 69, 72, all colder, then 76, so 4. Day 3 is 71: 69 is colder, 72 is warmer, so 2. Notice that for day 2 I scanned 71, 69 and 72, and then for day 3 I scanned 69 and 72 again. That rescanning is what I want to avoid.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^5 | A scan forward from every day is up to n(n − 1)/2 ≈ 5 × 10^9 comparisons on a non-increasing input. I want O(n) or close to it. |
| 30 ≤ temperatures[i] ≤ 100 | Only 71 distinct values, which allows a per-temperature table (Approach 1). |
| Strictly warmer | Equal temperatures must not settle a waiting day: the comparison is `<`, not `<=`. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Strictly warmer only | Decides the comparison in every approach. |
| No warmer day means 0 | Java's `new int[n]` is already 0, so unresolved days need no extra step. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| I may not modify the input | Nothing says I may, and no approach needs to. |

### Edge cases I will keep in mind

- n = 1: the answer is `[0]`.
- Strictly increasing: every answer is 1 except the last.
- Non-increasing (including all equal): every answer is 0, and this is the worst case for the direct scan.
- Equal temperatures before a warmer one: `[70, 70, 71]` gives `[2, 1, 0]`.
- A warm day that settles several waiting days at once: day 5 (72) in Example 1 settles days 4 and 3.

## 4. Think out loud: from first idea to best solution

> "Simplest thing: for each day, walk forward until I find a warmer one. It's correct by definition, since it checks every later day in order and stops at the first warmer one. On a non-increasing array it never stops early, so it does n(n − 1)/2 comparisons, about 5 × 10^9 at n = 10^5. That's my baseline and test reference, not an answer, so I won't code it as a solution."

> "Two ideas to cut the repeated scanning. One uses the small value range: from day i, I only need the nearest later day for each warmer *temperature*, and there are at most 70 of them. The other is more general: I should look at which days are still waiting for an answer and what a new day does to them."

### Approach 1: Nearest later day for each temperature

#### What I say out loud

> "I scan from right to left and keep `next[t]`, the nearest index to the right of the current day whose temperature is exactly t, or 'none'. For day i, the next warmer day is the smallest `next[t]` over all t from `temperatures[i] + 1` to 100. Then I set `next[temperatures[i]] = i`, because day i is now the nearest day with that temperature for everything to its left. That's at most 70 checks per day."

#### Intuition

The next warmer day is the nearest later day with *some* temperature above today's. Group the later days by temperature: for each temperature only the nearest occurrence matters, and there are at most 71 temperatures. Scanning from the right keeps the "nearest occurrence" table up to date in O(1) per day.

#### Algorithm

1. Create `next` of size 101, filled with a sentinel `NONE` larger than any index (for example `Integer.MAX_VALUE`), and `answer` of size n.
2. For i from n − 1 down to 0:
   1. `best = NONE`. For t from `temperatures[i] + 1` to 100: `best = min(best, next[t])`.
   2. If `best != NONE`, `answer[i] = best − i`.
   3. `next[temperatures[i]] = i`.
3. Return `answer`.

#### Why it is correct

When day i is processed, `next[t]` holds the smallest index greater than i with temperature t, because every day to the right has been processed and each one overwrote `next[t]` with a smaller index than the one before. The next warmer day is the smallest index j > i with `temperatures[j] > temperatures[i]`, which is the minimum over the warmer temperatures t of the nearest index with temperature t. Step 2.1 computes exactly that minimum, and `NONE` survives only if no later day is warmer.

#### Dry run

`temperatures = [73, 74, 75, 71, 69, 72, 76, 73]`. Only the table entries that have been set are shown.

| i | temp | Warmer temperatures already seen (temp: nearest index) | answer[i] | Table update |
|---|---|---|---|---|
| 7 | 73 | none | 0 | next[73] = 7 |
| 6 | 76 | none | 0 | next[76] = 6 |
| 5 | 72 | 73: 7, 76: 6 | 6 − 5 = 1 | next[72] = 5 |
| 4 | 69 | 72: 5, 73: 7, 76: 6 | 5 − 4 = 1 | next[69] = 4 |
| 3 | 71 | 72: 5, 73: 7, 76: 6 | 5 − 3 = 2 | next[71] = 3 |
| 2 | 75 | 76: 6 | 6 − 2 = 4 | next[75] = 2 |
| 1 | 74 | 75: 2, 76: 6 | 2 − 1 = 1 | next[74] = 1 |
| 0 | 73 | 74: 1, 75: 2, 76: 6 | 1 − 0 = 1 | next[73] = 0 |

Returns `[1, 1, 4, 2, 1, 1, 0, 0]`. At i = 0, `next[73]` changes from 7 to 0, which is why the table always holds the *nearest* occurrence.

#### Java code

```java title="Approach 1: nearest later day for each temperature"
import java.util.Arrays;

class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        final int maxTemp = 100;
        final int none = Integer.MAX_VALUE;
        int n = temperatures.length;
        int[] answer = new int[n];
        int[] next = new int[maxTemp + 1];       // next[t] = nearest index to the right with temperature t
        Arrays.fill(next, none);
        for (int i = n - 1; i >= 0; i--) {
            int best = none;
            for (int t = temperatures[i] + 1; t <= maxTemp; t++) {
                best = Math.min(best, next[t]);
            }
            if (best != none) {
                answer[i] = best - i;
            }
            next[temperatures[i]] = i;
        }
        return answer;
    }
}
```

#### Time complexity

**O(n·W)** in every case, where n = `temperatures.length` and W = 71 is the number of possible temperatures: the inner loop runs `100 − temperatures[i]` ≤ 70 times. At n = 10^5 that is at most 7 × 10^6 steps, which is fast. But the bound depends on the value range; it is not O(n) for arbitrary integers.

#### Space complexity

**O(W) auxiliary space** for `next` (101 slots), plus the output array.

#### The bridge to the next approach

> "This works only because the range is tiny. If the interviewer says 'now temperatures are any int', the table is dead. So let me think about the days instead of the values. Going left to right, which earlier days are still waiting for a warmer day?"

> "If days a < b are both still waiting at some point, then b isn't warmer than a, otherwise a would have been settled by b. So the waiting days, from oldest to newest, never get warmer. When a new day arrives, the waiting days it can settle are the coldest ones, and those are the newest. So I settle from the newest end and stop at the first one that's at least as warm. Add and remove at one end: a stack."

### Approach 2: Monotonic stack of waiting days (recommended)

#### What I say out loud

> "I keep a stack of indices of days still waiting for a warmer day. Their temperatures never increase from bottom to top. For each new day i, while the top day is strictly colder than day i, day i is its answer: I pop it and write `i − top`. Then I push i, since it's now waiting too. Days still on the stack at the end never got a warmer day and keep 0. Each index is pushed once and popped at most once, so it's O(n)."

#### Intuition

Every day waits for the first strictly warmer day after it. The days waiting at any moment form a non-increasing sequence by temperature, because a warmer later day would already have settled an earlier colder one. A new day settles exactly the waiting days colder than it, and those sit together on top. This is a [[a5-monotonic-stack|monotonic stack]], the standard tool for [[a5-next-greater-smaller|next greater element]] questions.

#### Algorithm

1. Create `answer` of size n (all 0) and an empty stack of indices.
2. For i from 0 to n − 1:
   1. While the stack is not empty and `temperatures[top] < temperatures[i]`: pop j, set `answer[j] = i − j`.
   2. Push i.
3. Return `answer`.

#### Why it is correct

**The invariant**, after day i is processed: the stack holds exactly the indices j ≤ i such that no day in `j + 1..i` is warmer than day j, in increasing order of index from bottom to top; and for every index not on the stack, `answer` already holds its correct value.

- **The stack's temperatures never increase from bottom to top.** If j < j' are both on the stack, day j' is in `j + 1..i` and is not warmer than day j.
- **Day i settles exactly the right days.** A waiting day j has no warmer day in `j + 1..i − 1`. If `temperatures[j] < temperatures[i]`, then i is the *first* warmer day, and `i − j` is its answer. If not, j keeps waiting. Because the temperatures on the stack never increase towards the top, the days colder than day i form a run at the top, so popping while the top is colder and stopping at the first day that is at least as warm settles exactly them.
- **Pushing i** keeps the invariant: nothing after i has been seen yet.
- **At the end**, the days left on the stack have no warmer day at all, and their answer is the default 0.

**The 20-second version to say to the interviewer:**

> "The days still waiting for an answer never get warmer from oldest to newest, because a warmer later day would already have answered an earlier one. So a new day answers the waiting days from the newest end until it meets one that's at least as warm. I keep their indices on a stack; each index is pushed and popped once, so it's O(n) time and O(n) extra space in the worst case."

#### Dry run

Example 1: `[73, 74, 75, 71, 69, 72, 76, 73]`. Stack entries are written `index:temperature`, bottom first.

| i | temp | Popped (strictly colder than temp) | Answers written | Stack after |
|---|---|---|---|---|
| 0 | 73 | | | [0:73] |
| 1 | 74 | 0:73 | answer[0] = 1 | [1:74] |
| 2 | 75 | 1:74 | answer[1] = 1 | [2:75] |
| 3 | 71 | | | [2:75, 3:71] |
| 4 | 69 | | | [2:75, 3:71, 4:69] |
| 5 | 72 | 4:69, 3:71 | answer[4] = 1, answer[3] = 2 | [2:75, 5:72] |
| 6 | 76 | 5:72, 2:75 | answer[5] = 1, answer[2] = 4 | [6:76] |
| 7 | 73 | | | [6:76, 7:73] |

Days 6 and 7 stay on the stack and keep 0. Returns `[1, 1, 4, 2, 1, 1, 0, 0]`. Day 5 is the moment from section 3: it settles two waiting days in one step, and stops at 75 without looking further back.

#### Java code

```java title="Approach 2: monotonic stack of waiting days (recommended)"
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] answer = new int[n];                    // days never settled keep 0
        Deque<Integer> waiting = new ArrayDeque<>();  // indices; temperatures never increase towards the top
        for (int i = 0; i < n; i++) {
            while (!waiting.isEmpty() && temperatures[waiting.peek()] < temperatures[i]) {
                int j = waiting.pop();
                answer[j] = i - j;                    // day i is the first warmer day after day j
            }
            waiting.push(i);
        }
        return answer;
    }
}
```

`ArrayDeque` used through `push`, `pop` and `peek` is a stack (the legacy `Stack` class is synchronized and slower). It stores boxed `Integer`s; an `int[]` of size n with a top pointer does the same without boxing.

#### Time complexity

**O(n) in every case (amortized O(1) per day).** Each index is pushed exactly once and popped at most once, and every iteration of the inner `while` pops one index, so the inner loop body runs at most n times over the whole run. A single day can still pop many indices (day 6 pops two; a warm day after a long cooling run pops all of them). The `ArrayDeque` operations are themselves O(1) amortized, as it occasionally resizes its array.

#### Space complexity

**O(n) auxiliary space in the worst case:** on a non-increasing input nothing is ever popped and the stack holds all n indices. On a strictly increasing input it never holds more than one. The output array is required and not counted.

### Alternative: jump backwards using the answers already computed

Scan from right to left. For day i, start at j = i + 1. If day j is warmer, done. If not, any day between j and `j + answer[j]` is not warmer than day j, so it is not warmer than day i either: jump straight to `j + answer[j]`. If `answer[j]` is 0, nothing after j is warmer than day j, hence nothing is warmer than day i.

```java title="Alternative: backward jumps"
class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] answer = new int[n];
        for (int i = n - 2; i >= 0; i--) {
            int j = i + 1;
            // Skip days that are not warmer, using their own answers; answer[j] == 0 means a dead end.
            while (temperatures[j] <= temperatures[i] && answer[j] > 0) {
                j += answer[j];
            }
            if (temperatures[j] > temperatures[i]) {
                answer[i] = j - i;
            }
        }
        return answer;
    }
}
```

**Why it is O(n), and the argument is not automatic.** From day i, the days visited are i + 1, then its next warmer day, then that day's next warmer day, and so on: each visited day is warmer than all days between i + 1 and it. Call a visited day *skipped* if it is not warmer than day i and the loop jumps past it. A day j skipped from day i can never be visited again from an earlier day i' < i: to be visited from i', day j would have to be warmer than every day between i' + 1 and j, but day i lies in that range and is at least as warm as day j. So every day is skipped at most once in total, and each i adds at most one more visit (the one that ends the loop). That is at most 2n visits: O(n) time in every case.

**When it wins:** it needs O(1) auxiliary space instead of the stack's O(n), and no extra structure. **Costs:** the amortized argument above is harder to give convincingly in an interview than "pushed once, popped once", and it works only when the whole array is available, whereas the stack also works when days arrive one at a time (section 10).

## 5. Comparison table

n = `temperatures.length`, W = 71 possible temperatures. Nothing is hashed or randomized, so expected and worst case agree.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Scan forward from every day (not coded) | O(n²) | O(n²) | O(1) |
| 1. Nearest day per temperature | O(n·W) | O(n·W) | O(W) |
| 2. Monotonic stack | O(n) | O(n) | O(n) |
| Alt. Backward jumps | O(n) | O(n) | O(1) |

The output array of n values is not counted.

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Forward scan | Correct by definition | About 5 × 10^9 steps on a non-increasing input | Test reference only |
| 1. Per-temperature table | Easy to argue; no amortization | Depends on the tiny value range | When the range is small and the stack idea is not coming |
| 2. Stack | O(n) for any values, simple invariant, works on a stream | O(n) stack in the worst case | The answer to give |
| Alt. Backward jumps | O(1) extra space | Harder amortized argument; needs the whole array | When asked to remove the extra space |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2. State the forward-scan cost, mention that the 30–100 range allows Approach 1, then derive the stack from "the waiting days never get warmer from oldest to newest".

**Is it optimal?** In time, yes: it is O(n), and there is a worst-case Ω(n) lower bound for any algorithm that learns temperatures by reading them. On an all-50 array every answer is 0, but raising any unread day j ≥ 1 to 51 changes `answer[j − 1]` to 1, so an algorithm that skips a day can be wrong. If the interviewer asks for less memory, the backward-jump alternative removes the stack.

**When to stop:** once the stack solution, its invariant, the strict `<` and the amortized bound are explained. Replacing the boxed deque with an `int[]` stack is a constant-factor tweak to mention, not to code.

## 7. Interview script: code it and test it

### What I say while coding

> "`answer` is `new int[n]`, so every day that's never settled already holds 0."

> "Stack of indices, not temperatures: I need the index to compute the distance, and I can always read the temperature from the array."

> "While the top is strictly colder than today, pop it and write `i − j`. Strictly, because an equal day isn't warmer. Then push today."

### Testing out loud

**Normal case:** Example 1, traced in section 4, returns `[1, 1, 4, 2, 1, 1, 0, 0]`.

**n = 1:** `[50]`: push 0, done. Returns `[0]`.

**Equal days before a warmer one:** `[70, 70, 71]`. i = 0: push. i = 1: 70 < 70 is false, so nothing is popped; stack [0, 1]. i = 2: pop 1 (answer 1), pop 0 (answer 2). Returns `[2, 1, 0]`.

**Strictly increasing:** `[30, 40, 50, 60]`: each day pops the previous one: `[1, 1, 1, 0]`.

**Non-increasing:** `[100, 90, 90, 30]`: nothing is popped, the stack ends with all four indices: `[0, 0, 0, 0]`.

**Largest input:** n = 10^5, all 100: the stack grows to 10^5 indices and nothing is popped; 10^5 pushes in total.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 2 min | Strictly warmer, 0 when none, the 30–100 range |
| Forward scan and its cost | 1 min | O(n²) on a non-increasing input |
| Derive the stack | 4 min | Waiting days never get warmer from oldest to newest |
| Code | 4 min | Approach 2 |
| Trace and edge cases | 4 min | Example 1, `[70, 70, 71]`, n = 1 |
| Questions | rest | Section 9 |

**If you get stuck:** list the waiting days at each step of Example 1 on paper and look at their temperatures; the order gives the structure away. If it still does not come, code Approach 1, which is fast enough for these constraints, and say that it depends on the value range.

## 9. Interviewer challenges

### About correctness

#### Why can you stop popping at the first day that is at least as warm?

**What they are testing:** whether you know why the stack is ordered, rather than having memorised the loop.

**How to reason:** use the ordering of the waiting days.

**What I say:** "Every day below it on the stack is at least as warm as it is, since the waiting days never get warmer from oldest to newest. If today isn't warmer than the top, it isn't warmer than anything below it either."

**Nuance:** the ordering is non-increasing, not strictly decreasing: equal days stay on the stack together, as in `[70, 70, 71]`, and one warmer day later settles both.

#### What happens to the days left on the stack?

**What they are testing:** completeness of the solution.

**How to reason:** what does being on the stack at the end mean under the invariant?

**What I say:** "A day still on the stack has no warmer day anywhere after it, so its answer is 0, and the array already holds 0. No cleanup loop is needed."

**Nuance:** in a language where a new array is not zero-filled, or if the problem wanted −1 for "never", you would need that loop, or a fill before the scan.

### About complexity

#### There's a `while` inside a `for`. Why is it O(n)?

**What they are testing:** amortized analysis.

**How to reason:** count operations per index, not per iteration of the outer loop.

**What I say:** "Each pass of the `while` pops an index. Each index is pushed once, so it's popped at most once. Over the whole run the `while` body executes at most n times."

**Nuance:** one day can pop up to n − 1 indices, so a single step is O(n) in the worst case; only the total is bounded.

#### Can you do it without the extra O(n) stack?

**What they are testing:** whether you can reuse the output as working memory.

**How to reason:** the answers already computed on the right are jump pointers.

**What I say:** "Go right to left. From i + 1, if that day isn't warmer, jump by its own answer, since nothing in between is warmer than it. A dead end, answer 0, means no warmer day. Each day can be jumped over at most once in total, so it stays O(n), with O(1) extra space."

**Nuance:** the reason it stays linear is not obvious; give the "skipped at most once" argument from section 4, not just "it's amortized".

## 10. Follow-up questions the interviewer might ask

**"Temperatures can be any `int`."**
Approach 2 is unchanged: it only compares values. Approach 1 no longer works. O(n).

**"Days arrive one at a time; report each day's answer as soon as it is known."**
The stack already processes days left to right: when day i pops day j, report `answer[j] = i − j` immediately. The days still on the stack are the ones whose answers are pending. O(1) amortized per day, O(n) memory in the worst case.

**"Return the number of days since the previous warmer day."**
The mirror image: scan right to left with the same loop, or, scanning left to right, after popping every day not warmer than today, the top (if any) is the previous warmer day. This is exactly Online Stock Span with "strictly greater" in the role of the boundary.

**"Return the warmer temperature itself, not the distance."**
Write `temperatures[i]` instead of `i − j` when popping, and decide with the interviewer what to return when there is none.

**"The days form a cycle: after the last day comes the first again."**
Run the loop over indices 0..2n − 1, using `i % n`, and push only during the first pass. Every day gets a chance to be settled by a day before it. O(n).

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Treating an equal day as warmer.** The statement says warmer, and the answer changes: `[70, 70, 71]` must give `[2, 1, 0]`.
- **Calling the stack solution O(n²)** because of the nested loop. Count pushes and pops instead.
- **Thinking the stack must hold all earlier days.** Settled days are never needed again.

### Implementation mistakes

> [!MISTAKE] Popping on `<=` instead of `<`
> With `temperatures[top] <= temperatures[i]`, an equal day settles a waiting day. `[70, 70, 71]` returns `[1, 1, 0]` instead of `[2, 1, 0]`.

- **Storing temperatures instead of indices.** The distance `i − j` needs the index, and the temperature can be read from the array.
- **Writing `answer[i]` instead of `answer[j]` when popping.** The day being settled is the popped one, not today.
- **In the backward-jump version, looping while `answer[j] >= 0`.** A zero answer is a dead end; jumping by 0 would loop forever.

## 12. Pattern recognition

**The pattern:** monotonic stack for "next greater element". Keep the elements still waiting for their answer; they form a monotonic sequence, so a new element settles a run of them at the top.

**Signals in the problem statement:**

- "The next (or previous) element that is larger/smaller than this one", for every element.
- "How far until…", "how many consecutive elements before this one are smaller…".
- A quadratic scan that stops at the first element beating the current one.

**Related problems in this list:**

- [[nc-online-stock-span|Online Stock Span]]: the previous-greater version, asked one value at a time.
- [[nc-largest-rectangle-in-histogram|Largest Rectangle in Histogram]]: the nearest smaller bar on each side, found with the same stack.
- [[nc-sliding-window-maximum|Sliding Window Maximum]]: the same "pop what the newcomer dominates" loop, with removals at both ends.
- [[cses-nearest-smaller-values|Nearest Smaller Values]]: the previous-smaller-element question in its plainest form.
- [[nc-car-fleet|Car Fleet]]: a stack of fleets where a newcomer either joins the fleet ahead or starts a new one.

**Takeaway:** when every element needs the first later element that beats it, keep the elements that are still waiting on a stack; they are monotonic, so each newcomer settles a run at the top, and every element is pushed and popped once.

## 13. 60-second revision card

**Key insight:** the days still waiting for a warmer day never get warmer from oldest to newest, so a new day settles them from the newest end until it meets one at least as warm.

**Invariant:** the stack holds the indices of the days with no warmer day yet, temperatures non-increasing from bottom to top; every other day already has its answer.

**Complexity:** O(n) time (each index pushed once, popped at most once), O(n) extra space in the worst case. The backward-jump variant uses O(1) extra space.

**Code skeleton:**

```java title="Daily Temperatures, monotonic stack" fragment="public int[] dailyTemperatures(int[] temperatures)"
int[] answer = new int[temperatures.length];
java.util.ArrayDeque<Integer> stack = new java.util.ArrayDeque<>();   // waiting days
for (int i = 0; i < temperatures.length; i++) {
    while (!stack.isEmpty() && temperatures[stack.peek()] < temperatures[i]) {
        int j = stack.pop();
        answer[j] = i - j;
    }
    stack.push(i);
}
return answer;
```

**Main traps:**

- Strictly warmer: pop on `<`, not `<=`.
- Store indices; write the popped day's answer.
- Days left on the stack keep 0.

**What to say in one breath:** "The waiting days never get warmer from oldest to newest, so each new day pops the colder ones off a stack of indices and writes their distance; equal days stay. Each index is pushed and popped once: O(n) time, O(n) space."
