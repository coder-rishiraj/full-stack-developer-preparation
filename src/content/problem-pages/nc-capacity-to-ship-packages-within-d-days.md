---
problemId: nc-capacity-to-ship-packages-within-d-days
title: Capacity to Ship Packages Within D Days
source: neetcode
sourceUrl: https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/
difficulty: medium
patterns: [binary-search, greedy]
relatedLessons: [a3-binary-search-on-answer, a3-binary-search, a3-lower-upper-bounds, a10-local-vs-global, a14-brute-force-first, a14-deriving-optimization, a14-edge-cases]
companies: []
timeToSolve: 25
---

## 1. Problem restatement

Packages sit on a conveyor belt in a fixed order, with weights `weights[0], weights[1], …`. Each day a ship is loaded with the next packages from the belt, in order, as long as their total weight does not exceed the ship's capacity; then it sails. A package cannot be split, skipped or moved to a different position. Find the smallest capacity that gets every package shipped within `days` days.

**Example 1**

- Input: `weights = [3, 2, 2, 4, 1, 4]`, `days = 3`
- Output: `6`
- Why: with capacity 6 the days carry `[3, 2]`, `[2, 4]`, `[1, 4]`. Capacity 5 is not enough: the total weight is 16, and three days of at most 5 carry at most 15.

**Example 2**

- Input: `weights = [1, 2, 3, 1, 1]`, `days = 4`
- Output: `3`
- Why: capacity 3 works with `[1, 2]`, `[3]`, `[1, 1]` (three days, which is within four). Capacity 2 cannot work however many days you have, because one package weighs 3.

**What the problem statement guarantees**

- Packages are shipped in the given order; each day takes a contiguous run of them.
- A day's load may not exceed the capacity.
- 1 ≤ `days` ≤ `weights.length` ≤ 5 × 10^4.
- 1 ≤ `weights[i]` ≤ 500.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 25 minutes and talk out loud.
2. Answer a smaller question first: if someone hands you a capacity, how do you decide whether it is enough? Write that check before anything else.
3. Find the smallest capacity that could possibly work and one that certainly works.
4. Say what is slow about trying capacities one by one, with numbers from the constraints.
5. Write the code and trace Example 1 line by line.

Open a hint only after two minutes without progress.

> [!HINT] Hint 1: a small nudge
> Turn the question around. Given a fixed capacity, can you compute the fewest days it needs? How should you load each day to use as few days as possible?

> [!HINT] Hint 2: the kind of tool you need
> If capacity c is enough, is c + 1 enough? So the capacities form a run of "not enough" followed by a run of "enough", and you want the first "enough". What finds the boundary of such a run quickly?

> [!HINT] Hint 3: almost the whole plan
> Search capacities between the heaviest package (anything less cannot carry it) and the total weight (one day carries everything). For a middle capacity, load each day greedily until the next package would overflow, and count the days. If the count is at most `days`, the answer is at most this capacity; otherwise it is larger. Halve the range until one value is left.

**Check yourself before revealing the walkthrough**

- [ ] I can explain why loading each day as full as possible never uses more days than any other loading
- [ ] I can explain both ends of my search range
- [ ] My code returns 6 for Example 1 and 3 for Example 2
- [ ] I computed the largest total weight and checked that it fits in an `int`

## 3. Interview script: understand the problem (≈3 min)

**Me:** Let me restate it. The packages have to leave in this exact order, and each day the ship takes a prefix of what is left, as long as it fits. I pick one capacity for the whole job, and I want the smallest capacity that finishes in at most `days` days. Is that right?

**Interviewer:** Yes.

**Me:** Can I reorder the packages, or put a light one on an earlier day to fill it up?

**Interviewer:** No. Order is fixed.

**Me:** So each day is a contiguous run. And "within `days` days" means finishing early is fine, it's at most `days`, not exactly?

**Interviewer:** Within, so at most.

**Me:** Sizes: up to 5 × 10^4 packages, each from 1 to 500. Then the total weight is at most 5 × 10^4 × 500 = 2.5 × 10^7, which fits easily in an `int` (about 2.1 × 10^9). And `days` is between 1 and the number of packages, so there is always an answer: with capacity equal to the total, one day is enough.

**Interviewer:** Right.

**Me:** Let me do Example 1 by hand. `[3, 2, 2, 4, 1, 4]`, 3 days. The heaviest package is 4, so capacity 4 is the least I could even try. With 4: `[3]`, `[2, 2]`, `[4]`, `[1]`, `[4]`, five days. With 5: `[3, 2]`, `[2]`, `[4, 1]`, `[4]`, four days. With 6: `[3, 2]`, `[2, 4]`, `[1, 4]`, three days. So 6. I notice I answered by guessing a capacity and checking it; that check is going to be the core of whatever I write.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| Fixed order, contiguous days | A capacity's day count can be computed in one left-to-right pass; there is no packing or reordering problem to solve. |
| 1 ≤ `days` ≤ n | The total weight is always a feasible capacity, so the answer exists and is at most the total. If `days = n`, every package can have its own day and the answer is the heaviest package. |
| 1 ≤ n ≤ 5 × 10^4 | A single O(n) check is cheap; I can afford a few dozen of them, but not millions. |
| 1 ≤ `weights[i]` ≤ 500 | Total ≤ 2.5 × 10^7, so loads and sums fit in an `int`. The range of capacities to consider has up to 2.5 × 10^7 values. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Packages cannot be reordered or split | Each day is a contiguous run, and a capacity below the heaviest package is impossible. |
| Finishing in fewer days is allowed | The test for a capacity is "days needed ≤ `days`", not "= `days`". |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The input array is read-only | I only read it; nothing needs it modified. |
| A day may be left empty at the end | This is the same as finishing early, which the interviewer allowed. |

### Edge cases I will keep in mind

- `days = 1`: the answer is the total weight.
- `days = n`: the answer is the heaviest package.
- A single package.
- All packages equal.
- One very heavy package among light ones: the answer may be forced up to it.

## 4. Think out loud: from first idea to best solution

### Approach 1: Try capacities in increasing order, from a tight lower bound

#### What I say out loud

> "The question asks for the smallest capacity, and I already know how to test a single capacity: walk the belt, fill each day until the next package would overflow it, count the days. So the simplest plan is to try capacity after capacity, starting from the heaviest package, and return the first one that fits in `days` days."

> "How long would that take? The answer can be as large as the total weight, 2.5 × 10^7, when `days` is 1. Starting from at most 500, that's up to about 2.5 × 10^7 capacities, each checked in O(n) with n = 5 × 10^4: around 10^12 steps. Far too slow as it stands."

> "But I'm starting the scan in a silly place. If I have `days` days and a total weight W, some day has to carry at least W / `days`, so the capacity is at least the ceiling of that. Starting there helps when `days` is small. How far above that start can the answer be? That's what decides whether a scan is viable."

#### Intuition

Two lower bounds hold for every capacity that works: it is at least the heaviest package M (else that package never ships), and at least ⌈W / D⌉, where W is the total weight and D is `days` (else D days carry less than W). Call the larger of the two `start`.

The surprise is an upper bound: capacity ⌈W / D⌉ + M − 1 always works. With greedy loading, a day only closes when the next package does not fit, so a closed day carries more than capacity − M. If every one of the D days carries more than ⌈W / D⌉ − 1, together they carry at least W, and nothing is left over. So the answer lies in a window of at most M ≤ 500 capacities, and scanning that window is affordable.

#### Algorithm

1. Compute M = max weight and W = total weight.
2. `start = max(M, ⌈W / D⌉)`, computed as `(W + D − 1) / D`.
3. For `cap = start, start + 1, …`: count the days greedy loading needs at `cap`; return `cap` as soon as the count is at most D.
4. Greedy count: start with one day and load 0; for each weight w, if `load + w > cap`, start a new day with load 0; then add w to the load.

#### Why it is correct

- **The greedy count is the fewest days for that capacity.** Any loading is a sequence of day boundaries. Compare greedy with any valid loading, day by day. After day i, greedy has shipped at least as many packages as the other loading (it "stays ahead"): if it was ahead or level after day i − 1, then on day i the other loading ships a run whose total fits; greedy starts at the same package or later, so the packages up to where the other day ends are a subset of that run, and they fit too. Greedy only stops when the next package does not fit, so it ships at least that far. Being ahead after every day, greedy never needs more days.
- **It returns a capacity that works.** It returns only after the count is at most D.
- **It cannot skip a smaller one.** Every capacity below `start` fails one of the two lower bounds, and the scan tries every capacity from `start` upwards in order, so the first success is the smallest.
- **It stops within M steps.** The upper bound in the intuition: at capacity c = ⌈W / D⌉ + M − 1, suppose greedy needed more than D days. Then days 1 to D all closed because the next package (at most M) did not fit, so each carries more than c − M = ⌈W / D⌉ − 1, that is, at least ⌈W / D⌉. D such days carry at least W, all of it, leaving nothing for a day D + 1. Contradiction. Also c ≥ M because ⌈W / D⌉ ≥ 1.

#### Dry run

`weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`, `days = 5`. W = 55, M = 10, ⌈55 / 5⌉ = 11, so `start = 11`; the bound says the answer is at most 11 + 10 − 1 = 20.

| cap | Greedy days | Days needed | ≤ 5? |
|---|---|---|---|
| 11 | `[1,2,3,4] [5,6] [7] [8] [9] [10]` | 6 | no |
| 12 | `[1,2,3,4] [5,6] [7] [8] [9] [10]` | 6 | no |
| 13 | `[1,2,3,4] [5,6] [7] [8] [9] [10]` | 6 | no |
| 14 | `[1,2,3,4] [5,6] [7] [8] [9] [10]` | 6 | no |
| 15 | `[1,2,3,4,5] [6,7] [8] [9] [10]` | 5 | yes, return 15 |

Five checks instead of the six that a scan from M = 10 would take here; on `days = 1` with large inputs the difference is millions of checks.

#### Java code

```java title="Approach 1: scan capacities from a tight lower bound"
class Solution {
    public int shipWithinDays(int[] weights, int days) {
        int heaviest = 0;
        int total = 0; // at most 5 * 10^4 * 500 = 2.5 * 10^7
        for (int w : weights) {
            heaviest = Math.max(heaviest, w);
            total += w;
        }
        int start = Math.max(heaviest, (total + days - 1) / days);
        // The answer is at most ceil(total / days) + heaviest - 1, so this loop runs at most `heaviest` times.
        for (int cap = start; cap < total; cap++) {
            if (daysNeeded(weights, cap) <= days) {
                return cap;
            }
        }
        return total; // one day carries everything
    }

    private int daysNeeded(int[] weights, int cap) {
        int daysUsed = 1;
        int load = 0;
        for (int w : weights) {
            if (load + w > cap) { // w does not fit today: it starts the next day
                daysUsed++;
                load = 0;
            }
            load += w;
        }
        return daysUsed;
    }
}
```

The loop stops below `total` and falls back to `total`, which always works; that keeps the method correct even without the upper-bound argument, which only bounds how long the loop runs.

#### Time complexity

**O(n · M) in the worst case**, where n is the number of packages and M the heaviest weight (M ≤ 500). Computing M and W is one pass. The scan tries at most M capacities (the window from ⌈W / D⌉ to ⌈W / D⌉ + M − 1, cut further when `start` is M), and each check is one O(n) pass. At the limits that is 500 × 5 × 10^4 = 2.5 × 10^7 steps, which runs. The plain scan from M, without the ⌈W / D⌉ start, is O(n · W) and can reach about 10^12.

#### Space complexity

**O(1) auxiliary space**: a few counters. The input is not modified.

#### The bridge to the next approach

> "This works, but its speed depends on a bound I had to prove, and it's still linear in M. Let me look at what the scan actually relies on: if a capacity works, every larger capacity works too, since the same loading still fits. So 'works' is false for a while and then true forever. I'm scanning for the first true in a sorted sequence of answers, and that's exactly what binary search does in logarithmic steps. I don't even need the clever bound for it: between the heaviest package and the total weight there are at most 2.5 × 10^7 values, about 25 halvings."

### Approach 2: Binary search on the capacity (recommended)

#### What I say out loud

> "I'll binary search the capacity. The low end is the heaviest package, because nothing smaller can carry it. The high end is the total weight, which ships everything on day one, so it always works. For a middle capacity I run the greedy day count. If it fits in `days`, the answer is this capacity or something smaller, so I keep the left half including mid. If not, the answer is strictly bigger, so I move past mid."

> "The search is correct because feasibility is monotonic: a capacity that works keeps working when you raise it. And the check is correct because loading each day as fully as possible can never use more days than another loading. I'll keep the search in the form `lo < hi`, `hi = mid` on success, `lo = mid + 1` on failure, so it ends with `lo == hi` at the first capacity that works."

#### Intuition

Define `works(c)` as "greedy loading at capacity c needs at most `days` days". Over the capacities M, M + 1, …, W it reads false, …, false, true, …, true, ending in true. The answer is the first true. This is [[a3-binary-search-on-answer|binary search on the answer]]: you search the space of possible answers, not the array, and the array is consulted only through the check.

#### Algorithm

1. `lo = max(weights)`, `hi = sum(weights)`.
2. While `lo < hi`:
   1. `mid = lo + (hi − lo) / 2`.
   2. If `daysNeeded(mid) ≤ days`, set `hi = mid`.
   3. Otherwise set `lo = mid + 1`.
3. Return `lo`.

#### Why it is correct

**The invariant:** the answer always lies in `[lo, hi]`.

- **At the start:** every capacity below `max(weights)` fails, because that package never fits on any day. `sum(weights)` works, because one day carries everything and `days ≥ 1`. So the answer is in `[lo, hi]`.
- **Monotonic predicate:** if capacity c works, so does c + 1. The same day boundaries still respect the larger limit, and greedy at c + 1 needs no more days than that loading (stays ahead, below). So each step can discard a whole half.
- **Each step keeps the invariant.** If `mid` works, the answer is at most `mid`, and it is at least `lo`, so `[lo, mid]` still holds it. If `mid` fails, every capacity at or below `mid` fails too (monotonicity), so the answer is in `[mid + 1, hi]`.
- **It ends.** `mid` is strictly below `hi` when `lo < hi` (the division rounds down), so `hi = mid` shrinks the range, and `lo = mid + 1` shrinks it too. When `lo == hi`, the range holds exactly the answer.
- **The check is exact (greedy is optimal for a fixed capacity).** Let greedy's i-th day end after package g_i and any valid loading's i-th day end after o_i. Claim g_i ≥ o_i for every i. For i = 0 both are 0. If g_(i−1) ≥ o_(i−1), the other loading's day i ships packages o_(i−1)+1 … o_i, which fit. Greedy's day i starts at g_(i−1)+1, which is not earlier, so the packages from there to o_i are part of that run and also fit; greedy keeps loading until something does not fit, so g_i ≥ o_i. If the other loading finishes in d days, greedy has shipped everything by day d as well.

**The 25-second version to say to the interviewer:**

> "Feasibility is monotonic: if a capacity ships everything in time, any bigger one does too. So I binary search between the heaviest package, below which nothing works, and the total, which always works. For each guess I count days greedily, filling each day until the next package doesn't fit, and that count is the true minimum, because greedy is never behind any other loading after any day. If it's within `days`, I keep mid as a candidate; otherwise I go above it."

#### Dry run

`weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`, `days = 5`: `lo = 10`, `hi = 55`.

| lo | hi | mid | Greedy days at mid | Days | Action |
|---|---|---|---|---|---|
| 10 | 55 | 32 | `[1..7] [8,9,10]` | 2 | ≤ 5, `hi = 32` |
| 10 | 32 | 21 | `[1..6] [7,8] [9,10]` | 3 | ≤ 5, `hi = 21` |
| 10 | 21 | 15 | `[1..5] [6,7] [8] [9] [10]` | 5 | ≤ 5, `hi = 15` |
| 10 | 15 | 12 | `[1..4] [5,6] [7] [8] [9] [10]` | 6 | > 5, `lo = 13` |
| 13 | 15 | 14 | `[1..4] [5,6] [7] [8] [9] [10]` | 6 | > 5, `lo = 15` |
| 15 | 15 | | | | return 15 |

Five checks here as well, but the count grows with log₂(W − M), not with M: at the limits it is at most 25.

#### Java code

```java title="Approach 2: binary search on the capacity (recommended)"
class Solution {
    public int shipWithinDays(int[] weights, int days) {
        int lo = 0;
        int hi = 0; // total weight, at most 2.5 * 10^7
        for (int w : weights) {
            lo = Math.max(lo, w);
            hi += w;
        }
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (daysNeeded(weights, mid) <= days) {
                hi = mid;       // mid works: the answer is mid or smaller
            } else {
                lo = mid + 1;   // mid fails, and so does everything below it
            }
        }
        return lo;
    }

    private int daysNeeded(int[] weights, int cap) {
        int daysUsed = 1;
        int load = 0;
        for (int w : weights) {
            if (load + w > cap) {
                daysUsed++;
                load = 0;
            }
            load += w;
        }
        return daysUsed;
    }
}
```

#### Time complexity

**O(n log(W − M)) in the worst case**, where n is the number of packages, W the total weight and M the heaviest package. The search range starts with W − M + 1 values and halves each round, so there are at most ⌈log₂(W − M + 1)⌉ rounds. Since W ≤ 2.5 × 10^7 < 2^25, that is at most 25 rounds, each an O(n) greedy pass, plus one O(n) pass for the bounds: about 25 × 5 × 10^4 = 1.25 × 10^6 steps at the limits. It is often written O(n log W).

#### Space complexity

**O(1) auxiliary space**: `lo`, `hi`, `mid` and the counters of the check. No recursion; the input is not modified.

## 5. Comparison table

n = number of packages, W = total weight (≤ 2.5 × 10^7), M = heaviest package (≤ 500). No hashing or randomness, so expected and worst case agree.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Plain scan from M (prose only) | O(n · W) | O(n · W), about 10^12 at the limits | O(1) |
| 1. Scan from max(M, ⌈W / D⌉) | O(n · M) | O(n · M), about 2.5 × 10^7 | O(1) |
| 2. Binary search on capacity | O(n log W) | O(n log W), about 1.25 × 10^6 | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Plain scan from M | Obvious, uses the same check | Far too slow when `days` is small | Only as the spoken baseline |
| 1. Tight scan | No search boundaries to get wrong | Its speed rests on a non-obvious bound, and it is linear in M | When weights are tiny and you want the simplest loop, or as a stepping stone |
| 2. Binary search | Fast whatever the weights are; standard template | Off-by-one risk in the search loop | The default answer |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** binary search on the capacity with the greedy day count (Approach 2).

**Is it optimal?** In the worst case any correct algorithm must look at essentially every weight: a package it never reads could be heavy enough to raise the answer. So there is an Ω(n) worst-case lower bound, and O(n log W) is within a log factor of it. With W < 2^25, that log factor is at most 25, so I would not chase an O(n) algorithm in an interview.

**When the other one is preferable:** if every weight is tiny (say at most 10), the tight scan is at most M checks and is as fast as the binary search with simpler code. That is a curiosity here; mention it only if asked.

**When to stop:** once the binary search is coded and traced. Refinements such as starting `lo` at `max(M, ⌈W / D⌉)` or stopping the day count early once it exceeds `days` change constants, not the bound. Mention them in one sentence if there is time.

## 7. Interview script: code it and test it

### What I say while coding

> "First one pass for the bounds: `lo` is the heaviest package, `hi` is the total. The total is at most 2.5 times 10^7, so `int` is fine."

> "The loop is `while (lo < hi)`. `mid` rounds down, so it's always below `hi`, and both branches shrink the range. On success `hi = mid`, because mid itself might be the answer. On failure `lo = mid + 1`."

> "The helper starts at one day with an empty load. If the next package doesn't fit, I open a new day, and then the package goes on whatever day is current. That 'then' matters: the package that overflowed is the first one on the new day, not lost."

### Testing out loud

**Normal case, Example 1:** `[3, 2, 2, 4, 1, 4]`, `days = 3`. `lo = 4`, `hi = 16`. `mid = 10`: `[3,2,2] [4,1,4]`, 2 days, `hi = 10`. `mid = 7`: `[3,2,2] [4,1] [4]`, 3 days, `hi = 7`. `mid = 5`: `[3,2] [2] [4,1] [4]`, 4 days, `lo = 6`. `mid = 6`: `[3,2] [2,4] [1,4]`, 3 days, `hi = 6`. Return 6. Correct.

**Example 2:** `[1, 2, 3, 1, 1]`, `days = 4`. `lo = 3`, `hi = 8`. `mid = 5`: 2 days, `hi = 5`. `mid = 4`: `[1,2] [3,1] [1]`, 3 days, `hi = 4`. `mid = 3`: `[1,2] [3] [1,1]`, 3 days, `hi = 3`. Return 3, which is also the heaviest package.

**`days = 1`:** `[5, 1, 4]`. `lo = 5`, `hi = 10`. `mid = 7`: `[5,1] [4]`, 2 days, `lo = 8`. `mid = 9`: still 2 days, `lo = 10`. Return 10, the total. Correct.

**`days = n`:** `[4, 9, 2]`, `days = 3`. `lo = 9`, `hi = 15`. `mid = 12`: `[4] [9,2]`, 2 days, `hi = 12`. `mid = 10`: `[4] [9] [2]`, 3 days, `hi = 10`. `mid = 9`: 3 days, `hi = 9`. Return 9, the heaviest package. Correct.

**Single package:** `[7]`, `days = 1`. `lo = hi = 7`, the loop never runs, return 7.

**All equal:** `[2, 2, 2, 2, 2]`, `days = 2`. The answer must hold three packages on some day: 6. The search runs over `[2, 10]` and lands on 6, because capacity 5 holds only two packages a day and needs 3 days.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 2–3 min | Order is fixed, "within" means at most, total fits in `int` |
| The check for one capacity | 2–3 min | Greedy day count, and why greedy is optimal |
| Naive scan and its cost | 1–2 min | Up to 2.5 × 10^7 capacities × n: too slow |
| Monotonicity and the search range | 2 min | Heaviest package to total, and why each end |
| Code | 5–7 min | Bounds, search loop, helper |
| Trace and edge cases | 3–4 min | Example 1, `days = 1`, `days = n` |
| Complexity and follow-ups | the rest | O(n log W), lower bound, variants |

**Where the time should go:** on the check and its correctness. Interviewers who ask this problem want to hear why greedy loading is optimal and why feasibility is monotonic; the binary search itself is a template.

**If stuck:** say the check for one capacity out loud and code it first; it is needed by every approach. Then ask: "if capacity c works, what do I know about c + 1?" That question leads to the binary search. Approach 1's tight bound is a nice extra, not a step you need.

## 9. Interviewer challenges

### About correctness

#### Why is loading each day as full as possible optimal?

**What they are testing:** whether you can justify a greedy choice instead of asserting it.

**How to reason:** compare greedy with any other valid loading after each day. Show greedy is never behind.

**What I say:** "After every day, greedy has shipped at least as many packages as any other loading. Suppose that's true after day i − 1. The other loading's day i ships a run that fits. Greedy starts at or after where that run starts, so everything up to where the other day ends is a piece of that run and fits too, and greedy only stops at a package that doesn't fit. So it's still level or ahead. That means greedy never needs more days."

**Nuance:** this "stays ahead" argument depends on the packages being in a fixed order, so that each day is a contiguous run. If you could reorder, the problem becomes bin packing, which is NP-hard, and greedy is no longer optimal.

#### Why is the lower end of the search the heaviest package and not 1?

**What they are testing:** whether your bounds are derived or copied, and whether you see what your check does below them.

**How to reason:** look at what the helper does when a package is heavier than `cap`: it opens a new day and puts the package on it anyway, overflowing. It never reports failure.

**What I say:** "Below the heaviest package no capacity can work, since that package never fits. And my helper doesn't detect that: it would give the heavy package its own day and count normally. So with `lo = 1`, weights `[1, 10]` and 2 days, the check says capacity 1 needs 2 days, and I'd return 1. Starting at the heaviest package makes the helper's input always valid."

**Nuance:** the other fix is to make the helper return "impossible" when a single weight exceeds `cap`. Either works; the bound is cleaner and also shortens the search.

#### Why does the search return a capacity that is actually needed, not just a bound?

**What they are testing:** whether you understand what "first true" means.

**How to reason:** the loop ends at the smallest c with `works(c)`, and `works(c − 1)` is false (or c is the heaviest package).

**What I say:** "The search ends at the smallest capacity that works. Anything one less fails, either because the check said so, or because it's below the heaviest package. So it's exactly the minimum."

**Nuance:** the answer is also the load of the heaviest day in some schedule, not merely an upper limit on it. The greedy schedule at the answer C has every day at most C; its heaviest day H is itself a working capacity, so H ≥ C, hence H = C. That is why the same search solves "minimize the heaviest day", the form [[nc-split-array-largest-sum|Split Array Largest Sum]] takes.

### About complexity

#### What is the complexity, and could you do better?

**What they are testing:** precise bounds with defined variables, and a sense of when to stop.

**How to reason:** count rounds and the cost per round, then compare with what any algorithm must do.

**What I say:** "At most log₂ of the range, under 25 rounds, each a linear pass, so O(n log W) with W the total weight, about a million steps at the limits. Any algorithm has to read essentially every weight in the worst case, so Ω(n). The gap is a factor of at most 25, which I'd leave."

**Nuance:** you can narrow the range to `[max(M, ⌈W/D⌉), ⌈W/D⌉ + M − 1]` (Approach 1's bound), which makes it O(n log M), at most 9 rounds with M ≤ 500. Worth a sentence, not the code.

#### Why `lo + (hi - lo) / 2`? Does `(lo + hi) / 2` overflow here?

**What they are testing:** whether you check overflow from the constraints or by habit.

**How to reason:** compute the largest `lo + hi`.

**What I say:** "Here it can't overflow: both are at most 2.5 × 10^7, so the sum is at most 5 × 10^7. I write `lo + (hi − lo) / 2` out of habit because it's never wrong, but in this problem both forms are safe."

**Nuance:** in a variant with weights up to 10^9 and 10^5 packages, the total would need a `long` anyway.

## 10. Follow-up questions the interviewer might ask

**"What if packages could be loaded in any order?"**
Then it is bin packing with a fixed number of bins, which is NP-hard. Monotonicity still holds, so binary search on capacity still works, but the check becomes an exponential search (or a heuristic like first-fit decreasing, which is no longer exact).

**"What if each day had a different capacity limit, or the ship had to be used exactly `days` days?"**
"Exactly `days` non-empty days" changes nothing as long as `days ≤ n`: a schedule with fewer days can split one of its multi-package days, and each piece weighs less. That is the same argument as [[nc-split-array-largest-sum|Split Array Largest Sum]], which is this problem with "exactly k parts".

**"What if you must also return the schedule?"**
Run the greedy loading once more at the final capacity and record where each day ends: O(n) extra.

**"What if you are given the capacity and asked for the fewest days?"**
That is the check alone: O(n). The original problem is its inverse, which is why binary search over the check works.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Searching the array instead of the answer space.** Nothing in `weights` is sorted; the sorted thing is the sequence of yes/no answers over capacities.
- **Trying to compute the answer directly as ⌈W / D⌉.** That is only a lower bound. Example 1 has ⌈16 / 3⌉ = 6, which happens to be the answer, but `[1, 2, …, 10]` with 5 days has ⌈55 / 5⌉ = 11 and an answer of 15, because packages are indivisible and ordered.
- **Asserting that greedy loading is optimal without a reason.** The stays-ahead argument is short; say it.
- **Testing "exactly `days` days".** The predicate "greedy uses exactly `days` days" is not monotonic. With that test, `[2, 4, 2, 4]` and 4 days returns 12 instead of 4.

### Implementation mistakes

> [!MISTAKE] Starting the new day empty
> Writing `if (load + w > cap) { daysUsed++; load = 0; } else { load += w; }` drops the package that opened the new day. Example 1 then returns 5 instead of 6.

> [!MISTAKE] Starting the search at 1
> The greedy helper silently overloads a day when one package is heavier than the capacity. With `lo = 1`, `[1, 10]` and 2 days returns 1. Start at the heaviest package.

- **`hi = mid - 1` on success.** It discards mid, which may be the answer. With `lo < hi` the success branch must be `hi = mid`.
- **`while (lo <= hi)` with `hi = mid`.** When `lo == hi` and mid works, `hi = mid` changes nothing and the loop never ends.
- **Counting days from 0.** The first day exists before any package is placed; start `daysUsed` at 1, or the count is one short.

## 12. Pattern recognition

**The pattern:** binary search on the answer with a greedy feasibility check. When asked for the minimum value that makes something possible, and "possible" stays true as the value grows, search the value and test each guess with a simple check.

**Signals in the problem statement:**

- "Find the least / minimum capacity, speed, time…" such that a task completes.
- A natural yes/no check exists for a fixed value, and it is much easier than the optimization.
- Raising the value can only help.
- The answer lies in a numeric range you can bound from the input (largest element, total).

**Related problems in this list:**

- [[nc-koko-eating-bananas|Koko Eating Bananas]]: the same shape; the check sums ⌈pile / speed⌉ instead of packing days.
- [[nc-split-array-largest-sum|Split Array Largest Sum]]: this problem with "exactly k non-empty parts" and zeros allowed, plus a DP alternative.
- [[nc-binary-search|Binary Search]]: the boundary-finding loop used here.
- [[cses-factory-machines|Factory Machines]] (CSES): binary search on time with a counting check.
- [[cses-array-division|Array Division]] (CSES): the same split into contiguous parts.

**Takeaway:** if a question asks for the smallest value that makes a task feasible, ask "if this value works, does a bigger one?" If yes, binary search the value and write the check.

## 13. 60-second revision card

**Key insight:** checking one capacity is easy (greedy day count), and feasibility only improves as capacity grows, so binary search the capacity between `max(weights)` and `sum(weights)`.

**Invariant:** the answer is always in `[lo, hi]`; `hi = mid` when mid works, `lo = mid + 1` when it does not.

**Complexity:** O(n log W) time, at most 25 rounds for W ≤ 2.5 × 10^7; O(1) auxiliary space.

**Code skeleton:**

```java title="Capacity to ship, binary search" fragment="public int shipWithinDays(int[] weights, int days)"
int lo = 0, hi = 0;
for (int w : weights) { lo = Math.max(lo, w); hi += w; }
while (lo < hi) {
    int mid = lo + (hi - lo) / 2, used = 1, load = 0;
    for (int w : weights) {
        if (load + w > mid) { used++; load = 0; }
        load += w;
    }
    if (used <= days) hi = mid; else lo = mid + 1;
}
return lo;
```

**Main traps:**

- `lo` is the heaviest package, not 1: the check does not detect an oversized package.
- The package that overflows starts the next day; add it after resetting.
- Test "at most `days`", not "exactly".
- `hi = mid` on success, never `mid − 1`.

**What to say in one breath:** "For a fixed capacity, greedy loading gives the fewest days, because it is never behind any other loading. Bigger capacities never need more days, so I binary search between the heaviest package and the total weight: O(n log W) time and O(1) space."
