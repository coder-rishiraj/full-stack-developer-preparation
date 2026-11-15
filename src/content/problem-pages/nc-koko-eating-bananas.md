---
problemId: nc-koko-eating-bananas
title: Koko Eating Bananas
source: neetcode
sourceUrl: https://leetcode.com/problems/koko-eating-bananas/
difficulty: medium
patterns: [binary-search]
relatedLessons: [a3-binary-search-on-answer, a3-binary-search, a3-lower-upper-bounds, a14-brute-force-first, a14-deriving-optimization, a14-edge-cases]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

There are `n` piles of bananas, `piles[i]` bananas in pile i, and `h` hours. Koko picks one eating speed `k`, a whole number of bananas per hour. Each hour she chooses one pile and eats `k` bananas from it; if the pile has fewer than `k` left, she finishes it and does nothing else for the rest of that hour. Find the smallest `k` that lets her finish every pile within `h` hours.

**Example 1**

- Input: `piles = [4, 9, 5]`, `h = 6`
- Output: `4`
- Why: at speed 4 the piles take 1, 3 and 2 hours, 6 in total. At speed 3 they take 2, 3 and 2 hours, 7 in total, one too many.

**Example 2**

- Input: `piles = [10]`, `h = 4`
- Output: `3`
- Why: at speed 3 she eats 3, 3, 3 and then the last 1, which is 4 hours; the leftover part of the last hour is wasted. At speed 2 it takes 5 hours.

**What the problem statement guarantees**

- Each hour Koko eats from one pile only; a pile with fewer than `k` bananas takes a whole hour.
- 1 ≤ `piles.length` ≤ 10^4.
- `piles.length` ≤ `h` ≤ 10^9.
- 1 ≤ `piles[i]` ≤ 10^9.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 20 minutes and talk out loud.
2. First answer a smaller question: given a speed, how many hours does Koko need? Write that formula with integers only.
3. Find a speed that certainly works and one below which nothing can work.
4. Estimate how slow it is to try speeds one by one, using the constraints.
5. Write the code and trace Example 1. Then compute the largest number of hours your formula can return, and check its type.

Open a hint only after two minutes without progress.

> [!HINT] Hint 1: a small nudge
> If speed k is fast enough, is speed k + 1 fast enough? Think about what that says about the list of answers "enough / not enough" over all speeds.

> [!HINT] Hint 2: the kind of tool you need
> The speeds read "not enough" for a while and "enough" from some point on. You are looking for the first "enough" in a sorted sequence of yes/no answers, and you can compute any single answer in one pass over the piles.

> [!HINT] Hint 3: almost the whole plan
> Search speeds from 1 to the largest pile (at that speed every pile takes one hour, and n ≤ h). For a middle speed, add up ⌈pile / speed⌉ over the piles, computed as `(pile + speed − 1) / speed`, in a `long`. If the total is at most h, the answer is at most this speed; otherwise it is larger. Halve the range until one speed is left.

**Check yourself before revealing the walkthrough**

- [ ] I can explain why a faster speed never needs more hours
- [ ] I can explain both ends of my search range
- [ ] My code returns 4 for Example 1 and 3 for Example 2
- [ ] I know the largest total of hours my check can compute, and my code's types hold it

## 3. Interview script: understand the problem (≈3 min)

**Me:** Let me restate it. Koko picks one fixed integer speed k. In each hour she works on a single pile: k bananas, or the rest of the pile if fewer are left. I want the smallest k that finishes everything in at most h hours.

**Interviewer:** Yes.

**Me:** So if she finishes a pile mid-hour, she can't start the next pile in that same hour? The rest of the hour is wasted?

**Interviewer:** Correct. One pile per hour.

**Me:** Then a pile of p bananas takes exactly ⌈p / k⌉ hours, and the piles don't interact. The total is the sum of those ceilings. Is it "within h" as in at most h, finishing early is fine?

**Interviewer:** At most h.

**Me:** Sizes: up to 10^4 piles, each up to 10^9, and h between n and 10^9. Since h ≥ n, giving each pile one hour always fits, so speed = the largest pile always works, and an answer exists. The total of hours is the thing to watch: at speed 1 it's the total number of bananas, up to 10^4 × 10^9 = 10^13, which is far beyond an `int`.

**Interviewer:** Good, keep that in mind.

**Me:** Example 1 by hand: `[4, 9, 5]`, 6 hours. Speed 9: 1 + 1 + 1 = 3 hours. Speed 5: 1 + 2 + 1 = 4. Speed 4: 1 + 3 + 2 = 6, fits. Speed 3: 2 + 3 + 2 = 7, doesn't. So 4. I'm guessing a speed and checking it, and the hours only go down as the speed goes up. That's the structure I'll use.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| One pile per hour | A pile of p takes ⌈p / k⌉ hours; the total for a speed is a sum over piles, computed in one O(n) pass. |
| n ≤ h ≤ 10^9 | Speed = largest pile gives n ≤ h hours, so it always works: the answer is at most the largest pile. The answer can be 1 (when h ≥ total bananas). |
| 1 ≤ n ≤ 10^4 | One O(n) check is cheap; a few dozen are fine, a billion are not. |
| 1 ≤ `piles[i]` ≤ 10^9 | The speed range has up to 10^9 values, so trying them one by one is out. The total of hours can reach 10^13 at k = 1, so it is a `long`. `p + k − 1` is at most 10^9 + 10^9 − 1 = 1,999,999,999, which is below `Integer.MAX_VALUE` = 2,147,483,647, so the ceiling itself fits in an `int`. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| One pile per hour, leftover time is wasted | Hours per pile is a ceiling, not p / k as a fraction; the piles cannot share an hour. |
| Finishing early is fine | The test for a speed is "hours ≤ h", not "= h". |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The input array is read-only | I only read it; nothing needs it modified or sorted. |
| The speed is a positive integer | Stated by "k bananas per hour" with an integer answer; it also means 1 is the smallest candidate. |

### Edge cases I will keep in mind

- `h = n`: every pile must be eaten in one hour, so the answer is the largest pile.
- `h` huge (up to 10^9): the answer can be 1.
- A single pile: the answer is ⌈p / h⌉.
- All piles equal to 10^9: the totals reach their largest values.
- Leftover bananas at the end of a pile (Example 2): the ceiling, not the floor.

## 4. Think out loud: from first idea to best solution

**The baseline I say out loud and do not code.** Try k = 1, 2, 3, … and return the first speed whose total of hours is at most h. It is correct by inspection: it returns the first speed that works, having rejected every smaller one. But the answer can be as large as 10^9 (one pile of 10^9 with `h = 1`), and each check is an O(n) pass, so in the worst case that is about 10^9 checks of up to 10^4 piles: on the order of 10^13 steps. It also shows why the total needs a `long`: its very first check, at k = 1, sums up to 10^13 hours. With an `int` total, `piles = [10^9, 10^9, 10^9]`, `h = 10^9` wraps the 3 × 10^9 hours of k = 1 to −1,294,967,296, which passes "≤ h", and the scan returns 1 instead of 4 (I ran it).

> "The scan is far too slow, but it tells me what I'm doing: walking along the speeds looking for the first one that works. And 'works' is monotonic. If speed k finishes in time, speed k + 1 eats at least as much from every pile each hour, so no pile takes longer. So the answers are 'no, no, …, no, yes, yes, …', and I want the first yes. That's a binary search over the speeds."

### Approach 1: Binary search on the speed over [1, max(piles)] (recommended)

#### What I say out loud

> "I'll binary search k. The low end is 1, the smallest legal speed. The high end is the largest pile: at that speed every pile takes one hour, so the total is n, and h is at least n. For a middle speed I sum the hours per pile, ⌈p / k⌉, written as `(p + k − 1) / k`, in a `long`. If the total fits in h, the answer is this speed or smaller, so `hi = mid`. Otherwise it's strictly bigger, `lo = mid + 1`. The loop is `lo < hi` and ends at the first speed that works."

> "This is the same shape as [[nc-capacity-to-ship-packages-within-d-days|Capacity to Ship Packages Within D Days]]: search the answer, not the array, and test each guess with a simple check."

#### Intuition

Define `hours(k) = Σ ⌈p / k⌉` over all piles. Raising k never raises any ⌈p / k⌉, so `hours` is non-increasing, and the predicate `works(k) = hours(k) ≤ h` reads false, …, false, true, …, true over k = 1, …, max(piles), ending in true. The answer is the first true: [[a3-binary-search-on-answer|binary search on the answer]], with the same `lo < hi`, `hi = mid` boundary search used in [[nc-search-insert-position|Search Insert Position]].

#### Algorithm

1. `lo = 1`, `hi = max(piles)`.
2. While `lo < hi`:
   1. `mid = lo + (hi − lo) / 2`.
   2. If `hours(mid) ≤ h`, set `hi = mid`; otherwise set `lo = mid + 1`.
3. Return `lo`.
4. `hours(k)`: a `long` total, adding `(p + k − 1) / k` for each pile.

#### Why it is correct

**The invariant:** the answer is always in `[lo, hi]`.

- **At the start.** No speed is below 1, and `max(piles)` works (n hours, and n ≤ h). So the answer is in `[1, max(piles)]`.
- **Monotonic predicate.** For k < k′ and any pile p, ⌈p / k′⌉ ≤ ⌈p / k⌉, because k′ bananas an hour empties the pile no later than k bananas an hour. Summing, `hours(k′) ≤ hours(k)`, so if k works, every faster speed works.
- **Each step keeps the invariant.** If `mid` works, the answer is at most `mid`, so `[lo, mid]` holds it. If `mid` fails, every speed at or below `mid` fails too (monotonicity), so the answer is in `[mid + 1, hi]`.
- **It ends.** With `lo < hi`, `mid` rounds down and is strictly below `hi`, so `hi = mid` shrinks the range; `lo = mid + 1` shrinks it too. At `lo == hi` the range holds exactly the answer.
- **The check is exact.** `(p + k − 1) / k` equals ⌈p / k⌉ for positive integers: write p = qk + r with 0 ≤ r < k; if r = 0 it gives q, otherwise q + 1.

**The 25-second version to say to the interviewer:**

> "A faster speed never takes longer on any pile, so 'finishes in h hours' is false and then true as k grows. I binary search k between 1 and the largest pile, which always works because it's one hour per pile and h is at least n. For each guess I sum ceiling of pile over k in a long. If it fits I keep mid as a candidate, else I go above it. The loop ends on the first speed that works."

#### Dry run

`piles = [3, 6, 7, 11]`, `h = 8`: `lo = 1`, `hi = 11`.

| lo | hi | mid | Hours per pile at mid | Total | Action |
|---|---|---|---|---|---|
| 1 | 11 | 6 | 1, 1, 2, 2 | 6 | ≤ 8, `hi = 6` |
| 1 | 6 | 3 | 1, 2, 3, 4 | 10 | > 8, `lo = 4` |
| 4 | 6 | 5 | 1, 2, 2, 3 | 8 | ≤ 8, `hi = 5` |
| 4 | 5 | 4 | 1, 2, 2, 3 | 8 | ≤ 8, `hi = 4` |
| 4 | 4 | | | | return 4 |

Speeds 4 and 5 give the same total; the search still returns 4 because it keeps `mid` on success and only stops when one speed is left.

#### Java code

```java title="Approach 1: binary search on the speed (recommended)"
class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int lo = 1;
        int hi = 0;
        for (int p : piles) {
            hi = Math.max(hi, p);              // at this speed every pile takes one hour, and n <= h
        }
        while (lo < hi) {                      // invariant: the answer is in [lo, hi]
            int mid = lo + (hi - lo) / 2;
            if (hoursNeeded(piles, mid) <= h) {
                hi = mid;                      // mid works: the answer is mid or slower
            } else {
                lo = mid + 1;                  // mid fails, and so does every slower speed
            }
        }
        return lo;
    }

    private long hoursNeeded(int[] piles, int k) {
        long hours = 0;                        // up to 10^4 * 10^9 = 10^13 in general: long
        for (int p : piles) {
            hours += (p + k - 1) / k;          // ceil(p / k); p + k - 1 <= 2 * 10^9 - 1 fits in int
        }
        return hours;
    }
}
```

#### Time complexity

**O(n log M) in the worst case**, where n is the number of piles and M the largest pile. The range starts with M values and halves each round, so there are at most ⌈log₂ M⌉ rounds; with M ≤ 10^9 < 2^30 that is at most 30 (the input `[10^9]`, `h = 1` takes 29). Each round is one O(n) pass, plus one pass for M: about 30 × 10^4 = 3 × 10^5 divisions at the limits.

#### Space complexity

**O(1) auxiliary space**: the bounds, `mid` and the running total. No recursion; the input is not modified.

#### The bridge to the next approach

> "That's already fast. If you asked me to squeeze it, the place to look is the starting range. The total number of bananas S tells me more than the largest pile does. Every speed that works needs S / k ≤ h, so k ≥ S / h. And ceilings add at most a little under one hour per pile, which gives an upper bound from S as well. When h is much larger than n, those two bounds can be very close."

### Approach 2: Binary search on a range narrowed by the total

#### What I say out loud

> "Same search, tighter start. Lower bound: hours(k) is at least S / k, because each pile takes at least p / k hours, so a working k needs k ≥ ⌈S / h⌉. Upper bound: each ceiling is at most (p + k − 1) / k, so hours(k) ≤ n + (S − n) / k, and that's at most h as soon as k ≥ (S − n) / (h − n), when h > n. I clamp that by the largest pile. S itself needs a `long`: up to 10^13."

#### Intuition

`hours(k)` is squeezed between S / k and S / k + n. The first speed whose lower estimate fits is ⌈S / h⌉; the first whose upper estimate fits is ⌈(S − n) / (h − n)⌉. The answer lies between them, so the binary search can start there. The window is narrow when h is large compared with n, and as wide as before when h is close to n.

#### Algorithm

1. S = sum of piles (a `long`), M = largest pile.
2. `lo = ⌈S / h⌉`, computed as `(S + h − 1) / h`.
3. `hi = M`; if `h > n`, set `hi = min(M, max(lo, ⌈(S − n) / (h − n)⌉))`.
4. The same loop as Approach 1 on `[lo, hi]`.

#### Why it is correct

The loop is Approach 1's, so it is enough to show the answer is in the starting range.

- **`lo` is a lower bound.** For any k, ⌈p / k⌉ ≥ p / k, so `hours(k) ≥ S / k`. If k works, S / k ≤ h, so k ≥ S / h, and since k is an integer, k ≥ ⌈S / h⌉. Also `lo ≥ 1` because S ≥ n ≥ 1, and `lo ≤ M` because S ≤ n · M ≤ h · M.
- **`hi` works.** M works (n hours). For h > n, let U = ⌈(S − n) / (h − n)⌉ and k ≥ U, k ≥ 1. Then `hours(k) ≤ Σ (p + k − 1) / k = n + (S − n) / k ≤ n + (h − n) = h`. So the smallest of M and U that is at least 1 works. The `max(lo, …)` only matters when S = n (all piles are 1), where U = 0 and every speed works.
- **So the answer is in `[lo, hi]`**: at least `lo` because nothing below works, at most `hi` because `hi` works.

#### Dry run

`piles = [3, 6, 7, 11]`, `h = 8`: S = 27, n = 4, M = 11. `lo = ⌈27 / 8⌉ = 4`. `hi = min(11, ⌈23 / 4⌉) = 6`.

| lo | hi | mid | Total at mid | Action |
|---|---|---|---|---|
| 4 | 6 | 5 | 8 | ≤ 8, `hi = 5` |
| 4 | 5 | 4 | 8 | ≤ 8, `hi = 4` |
| 4 | 4 | | | return 4 |

Two checks instead of Approach 1's four. With `piles = [30, 11, 23, 4, 20]`, `h = 6` it saves only one (4 instead of 5): S = 88 gives `lo = 15`, and since h − n = 1 the upper bound is 83, clamped to M = 30.

#### Java code

```java title="Approach 2: binary search on a range narrowed by the total"
class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int n = piles.length;
        long total = 0;                        // up to 10^4 * 10^9 = 10^13: needs long
        int largest = 0;
        for (int p : piles) {
            total += p;
            largest = Math.max(largest, p);
        }
        int lo = (int) ((total + h - 1) / h);  // ceil(S / h): between 1 and largest, since n <= h
        int hi = largest;
        if (h > n) {
            long upper = (total - n + (h - n) - 1) / (h - n);   // ceil((S - n) / (h - n))
            hi = (int) Math.min(largest, Math.max(lo, upper));
        }
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (hoursNeeded(piles, mid) <= h) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }
        return lo;
    }

    private long hoursNeeded(int[] piles, int k) {
        long hours = 0;
        for (int p : piles) {
            hours += (p + k - 1) / k;
        }
        return hours;
    }
}
```

#### Time complexity

**O(n log W) in the worst case**, where W = `hi − lo + 1` is the width of the narrowed range, and W ≤ M, so this is never worse than Approach 1's O(n log M). When h is close to n the bounds are loose and W can be a large fraction of M (one pile of 10^9 with `h = 2` gives the range [5 × 10^8, 10^9]); when h is many times n the window shrinks toward a handful of speeds.

#### Space complexity

**O(1) auxiliary space**, as in Approach 1.

## 5. Comparison table

n = number of piles (≤ 10^4), M = largest pile (≤ 10^9), W = width of Approach 2's narrowed range (W ≤ M). No hashing or randomness, so expected and worst case agree.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Scan speeds from 1 (prose only) | O(n · M) | O(n · M), about 10^13 at the limits | O(1) |
| 1. Binary search on [1, M] | O(n log M) | O(n log M), at most 30 passes | O(1) |
| 2. Binary search on a narrowed range | O(n log W) | O(n log M) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Scan from 1 | Correct by inspection; same check | Hopeless when the answer is large | Only as the spoken baseline |
| 1. Binary search on [1, M] | Short, standard template, bounds that need one sentence each | Up to 30 passes even when h is huge | The default answer |
| 2. Narrowed range | Fewer passes when h ≫ n | Two extra bounds to derive and get right; same worst case | When asked to tighten the search, or when each check is expensive |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** binary search on the speed over `[1, max(piles)]` (Approach 1). Its bounds are easy to defend, and 30 passes over 10^4 piles is nothing.

**Is it optimal?** In the worst case any correct algorithm must read essentially every pile: one pile it skipped could be large enough to raise the answer. That gives an Ω(n) worst-case lower bound, and O(n log M) is within a factor of at most 30 of it.

**When the other one is preferable:** Approach 2 saves passes when h is much larger than n, which matters only if the check were expensive. Mention it when asked "can you tighten the range?"; do not lead with it.

**When to stop:** once Approach 1 is coded, traced and its overflow reasoning stated. An early exit in the check (stop summing once the total passes h) changes constants, not the bound.

## 7. Interview script: code it and test it

### What I say while coding

> "`lo` is 1, `hi` is the largest pile. One pass for the max."

> "Loop `while (lo < hi)`, mid rounds down so it's below `hi`. Success keeps mid with `hi = mid`, failure jumps past it."

> "The check: `(p + k − 1) / k` is the ceiling with integers only. `p + k − 1` is at most 2 × 10^9 − 1, still an `int`. The total goes in a `long`, because in general it can reach 10^13."

### Testing out loud

**Example 1:** `[4, 9, 5]`, `h = 6`. `lo = 1`, `hi = 9`. mid 5: 1 + 2 + 1 = 4, `hi = 5`. mid 3: 2 + 3 + 2 = 7, `lo = 4`. mid 4: 1 + 3 + 2 = 6, `hi = 4`. Return 4. Correct.

**Example 2, the leftover hour:** `[10]`, `h = 4`. mid 5: 2 hours, `hi = 5`. mid 3: ⌈10 / 3⌉ = 4, `hi = 3`. mid 2: 5 hours, `lo = 3`. Return 3. With floor division, speed 2 would count 5 hours correctly but speed 3 would count 3 instead of 4; the ceiling matters.

**`h = n`:** `[8, 8]`, `h = 2`. mid 4: 4 hours, `lo = 5`. mid 6: 2 + 2 = 4, `lo = 7`. mid 7: 4, `lo = 8`. Return 8, the largest pile. Correct: each pile must go in one hour.

**Lots of time:** `[5]`, `h = 10`. mid 3: 2, `hi = 3`. mid 2: 3, `hi = 2`. mid 1: 5, `hi = 1`. Return 1.

**All piles 1:** `[1, 1, 1]`, `h = 5`. `lo = hi = 1`, the loop does not run; return 1.

**Extreme:** `[10^9]`, `h = 1`. Every probe below 10^9 needs 2 hours; after 29 rounds `lo` reaches 10^9. Return 10^9.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 2–3 min | One pile per hour, ceiling hours, "at most h" |
| Check for one speed | 1–2 min | `(p + k − 1) / k`, summed in a `long` |
| Baseline and its cost | 1 min | Up to 10^9 speeds × n: too slow |
| Monotonicity and bounds | 2 min | Why 1 and max(piles) |
| Code | 4–5 min | Search loop and helper |
| Trace and edge cases | 3–4 min | Example 1, the leftover hour, `h = n` |
| Complexity and follow-ups | the rest | O(n log M), overflow, the narrowed range |

**Where the time should go:** on the check (the ceiling and its type) and on the monotonicity argument. The search is the same template as [[nc-capacity-to-ship-packages-within-d-days|Capacity to Ship Packages Within D Days]].

**If stuck:** write the hours formula for one speed first. Then ask: "if speed k works, what about k + 1?" That question leads straight to the search.

## 9. Interviewer challenges

### About correctness

#### Do you really need a `long` for the total?

**What they are testing:** whether overflow reasoning comes from the constraints and the code, not from habit.

**How to reason:** find the largest total the code can actually compute, in this exact loop.

**What I say:** "The total as a function can reach 10^13 at k = 1, so a `long` is the safe default. Strictly, in this exact loop an `int` happens to survive: `hi` always works, and `mid` is at least `hi / 2`, so each ceiling at `mid` is at most twice the ceiling at `hi`. That caps any probed total at 2h ≤ 2 × 10^9, just under 2,147,483,647. But that's a 7% margin resting on a subtle argument. Switch to the closed-range template with `hi = mid − 1`, and `hi` no longer always works: with `piles = [10^9, 10^9, 5 × 10^8]` and `h = 10^9`, an `int` total eventually probes k = 1, where 2.5 × 10^9 hours wraps to −1,794,967,296, which passes '≤ h', and it returns 1 instead of 3. A `long` costs nothing, so I use it."

**Nuance:** I checked the "at most 2h" bound by running the `lo < hi` version on random large inputs; the largest probed total was 1,999,999,209. The other fix is an early exit: stop summing as soon as the total exceeds h, which keeps it below h + 10^9 < 2^31 in any template.

#### Why is the upper end `max(piles)` and not something larger like 10^9?

**What they are testing:** whether the bounds are derived, and whether you see that any working upper bound is correct.

**How to reason:** at speed M every pile takes one hour; faster speeds cannot do better than one hour per pile.

**What I say:** "At the largest pile every pile takes exactly one hour, so the total is n, and h ≥ n. Going faster still takes one hour per pile, so nothing above M is ever the smallest working speed. 10^9 would also be correct, but it always costs about 30 rounds, where `max(piles)` costs ⌈log₂ M⌉; for small piles that is a real difference."

**Nuance:** the lower end must be at least 1: with `lo = 0`, the input `[5]`, `h = 10` eventually probes k = 0 and throws `ArithmeticException` (I ran it).

### About complexity

#### What is the complexity, and is the log factor worth removing?

**What they are testing:** a precise bound with defined variables, and judgement about when to stop.

**How to reason:** count rounds, cost per round, compare with the lower bound.

**What I say:** "At most ⌈log₂ M⌉ rounds, 30 for M up to 10^9, each a pass over n piles: O(n log M), about 3 × 10^5 operations. Any algorithm must read essentially every pile in the worst case, so Ω(n). A factor of 30 is not worth a cleverer algorithm. If you want fewer rounds, I can start the search at ⌈S / h⌉, which helps a lot when h is much bigger than n."

**Nuance:** that narrowing (Approach 2) never makes the worst case worse, but it does not change the O(n log M) bound either, since the window can still be close to M when h is close to n.

## 10. Follow-up questions the interviewer might ask

**"What if Koko could move to the next pile within the same hour?"**
Then the hours are ⌈S / k⌉ with S the total, and the answer is directly ⌈S / h⌉: O(n) for the sum, no search.

**"What if she must eat the piles in the given order, and pile i must be finished by hour d_i?"**
The check changes, the search does not: walk the piles in order, add ⌈p_i / k⌉ to a running total of hours, and fail as soon as the total passes d_i (or h at the end). A faster speed never makes any running total larger, so the predicate is still monotone. O(n log M).

**"What if you must also report how many hours she actually uses?"**
Compute `hours(answer)` once more after the search: O(n).

**"What if you get many queries, each with a different h, for the same piles?"**
Each query is its own binary search: O(n log M) per query. `hours(k)` does not depend on h, so values computed for one query can be cached and reused by the next, but the bound per query stays the same.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Searching the piles instead of the speeds.** Nothing about `piles` is sorted; the sorted thing is the yes/no answer over speeds.
- **Taking ⌈S / h⌉ as the answer.** That is only a lower bound, because a pile cannot share an hour with another. Example 1 has ⌈18 / 6⌉ = 3, but the answer is 4.
- **Testing "exactly h hours".** The predicate "total = h" is not monotone. With `piles = [4, 9, 5]` and `h = 5`, it returns 9 instead of 5 (I ran it).

### Implementation mistakes

> [!MISTAKE] Floor division instead of the ceiling
> `hours += p / k` (or `Math.ceil(p / k)`, where the integer division happens before `Math.ceil` sees it) undercounts every pile with leftovers. `[3, 6, 7, 11]`, `h = 8` returns 3 instead of 4.

> [!MISTAKE] An `int` total
> Safe only by luck in the `lo < hi` template (section 9). In a scan from k = 1, `[10^9, 10^9, 10^9]` with `h = 10^9` returns 1 instead of 4; in the closed-range template, `[10^9, 10^9, 5 × 10^8]` with `h = 10^9` returns 1 instead of 3. Use a `long`.

- **Starting `lo` at 0.** A probe at k = 0 divides by zero: `[5]`, `h = 10` throws `ArithmeticException`.
- **`hi = mid − 1` on success with `while (lo < hi)`.** It discards a speed that works, which may be the answer.
- **`(p + k − 1) / k` in a type that cannot hold `p + k − 1`.** Here it fits in an `int` (at most 1,999,999,999), but only because both are at most 10^9; with larger limits it would need a `long`, or the form `(p − 1) / k + 1`, which never exceeds p.

## 12. Pattern recognition

**The pattern:** binary search on the answer. When asked for the minimum rate, capacity or time that makes a task feasible, and feasibility only improves as the value grows, search the value and test each guess with a cheap check.

**Signals in the problem statement:**

- "Return the minimum integer k such that …" over a huge numeric range (here up to 10^9).
- Checking a given k is easy (one pass), while computing the best k directly is not.
- A larger k can only help.

**Related problems in this list:**

- [[nc-capacity-to-ship-packages-within-d-days|Capacity to Ship Packages Within D Days]]: the same search, with a greedy day count as the check.
- [[nc-split-array-largest-sum|Split Array Largest Sum]]: binary search on the largest part sum, with the same greedy check.
- [[nc-sqrt-x|Sqrt(x)]]: the largest k with k² ≤ x, the same boundary search on a numeric range.
- [[nc-binary-search|Binary Search]]: the invariant-driven loop underneath.
- [[cses-factory-machines|Factory Machines]] (CSES): binary search on time, where the check sums ⌊t / machine time⌋.

**Takeaway:** "minimum speed such that it finishes in time" means: write `works(k)`, argue it is monotone, bound the range from the input, and binary search with a `long` for anything that sums.

## 13. 60-second revision card

**Key insight:** hours never increase as the speed rises, so the first speed with `Σ ⌈p / k⌉ ≤ h` can be binary searched over `[1, max(piles)]`.

**Invariant:** the answer is in `[lo, hi]`; `hi = mid` when mid works, `lo = mid + 1` when it does not.

**Complexity:** O(n log M) time, at most 30 passes for M ≤ 10^9; O(1) auxiliary space.

**Code skeleton:**

```java title="Koko eating bananas, binary search" fragment="public int minEatingSpeed(int[] piles, int h)"
int lo = 1, hi = 0;
for (int p : piles) hi = Math.max(hi, p);
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    long hours = 0;
    for (int p : piles) hours += (p + mid - 1) / mid;
    if (hours <= h) hi = mid; else lo = mid + 1;
}
return lo;
```

**Main traps:**

- The ceiling: `(p + k − 1) / k`, not `p / k`.
- The total in a `long`: up to 10^13 at k = 1.
- `lo = 1`, never 0; `hi = max(piles)` works because h ≥ n.
- Test "≤ h", not "= h".

**What to say in one breath:** "A faster speed never takes longer, so I binary search k between 1 and the largest pile, summing ceiling of pile over k in a long for each guess: O(n log M) time, at most 30 passes, O(1) space."
