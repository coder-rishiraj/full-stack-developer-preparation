---
problemId: nc-car-fleet
title: Car Fleet
source: neetcode
sourceUrl: https://leetcode.com/problems/car-fleet/
difficulty: medium
patterns: [stack, sorting]
relatedLessons: [a5-stack, a5-monotonic-stack, a2-sorting-based, a3-comparator-sorting, a3-counting-sort, a14-edge-cases]
companies: []
timeToSolve: 25
---

## 1. Problem restatement

n cars drive along a one-lane road towards mile `target`. Car i starts at mile `position[i]` and drives at `speed[i]` miles per hour. A car can never pass the car in front of it: if it catches up, it slows down and drives bumper to bumper at the slower car's speed from then on. A **fleet** is a single car or a group of cars driving together like this. If a car catches up with a fleet exactly at `target`, it still counts as part of that fleet. Return how many fleets arrive at `target`.

**Example 1**

- Input: `target = 12`, `position = [10, 8, 0, 5, 3]`, `speed = [2, 4, 1, 1, 3]`
- Output: `3`
- Why: on their own, the cars at 10 and 8 would both arrive after 1 hour, so the car from 8 catches the car from 10 exactly at mile 12: one fleet. The car at 5 would take 7 hours alone; the car at 3, alone, would take 3 hours, so it catches the car from 5 and arrives with it at hour 7: a second fleet. The car at 0 takes 12 hours and never catches anyone: a third fleet.

**Example 2**

- Input: `target = 100`, `position = [0, 2, 4]`, `speed = [4, 2, 1]`
- Output: `1`
- Why: the car at 4 needs 96 hours. The car at 2 would need 49, so it catches up and slows to speed 1; the car at 0 would need 25, so it catches up as well. All three arrive together.

**What the problem statement guarantees**

- n = `position.length` = `speed.length`, and 1 ≤ n ≤ 10^5.
- 0 < `target` ≤ 10^6.
- 0 ≤ `position[i]` < `target`, and all positions are different.
- 0 < `speed[i]` ≤ 10^6.
- The method is `public int carFleet(int target, int[] position, int[] speed)`.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. Simulating the cars hour by hour is tempting and hard to get right; there is a much shorter way to decide who ends up with whom.

**How to practise**

1. Set a timer for 25 minutes and talk out loud.
2. For each car in Example 1, compute when it would arrive if the road were empty.
3. Decide, for two cars only, exactly when the one behind ends up in the same fleet as the one in front. Write the condition down, including the case where they meet exactly at the target.
4. Now handle many cars. In which order should you look at them so that each decision depends only on cars you have already looked at?
5. Decide how you will compare arrival times, and whether rounding could ever change an answer.

Open a hint only after two minutes without progress. After each hint, close it and try again before opening the next one.

> [!HINT] Hint 1: a small nudge
> A car's own arrival time, `(target − position) / speed`, is easy to compute. A car behind can only be slowed by the cars ahead of it, never by cars behind it. Which car's situation can you settle first?

> [!HINT] Hint 2: the kind of tool you need
> Order the cars by position, from the one closest to the target backwards. A car joins the fleet in front of it exactly when it would arrive no later than that fleet; otherwise it becomes the new last fleet, which the cars behind it will now run into.

> [!HINT] Hint 3: almost the whole plan
> Sort the cars by position in decreasing order. Keep the arrival time of the last fleet formed. For each car, compute its own arrival time; if it is strictly greater than the last fleet's time, it starts a new fleet: count it and make its time the last fleet's time. Otherwise it merges and nothing changes. Compare times exactly, for example by cross-multiplying in `long`.

**Check yourself before revealing the walkthrough**

- [ ] My solution returns 3 on Example 1 and 1 on Example 2
- [ ] A car that catches the fleet ahead exactly at the target is counted in that fleet
- [ ] I compare with the fleet ahead's time, not with the previous car's own time
- [ ] I can say whether my time comparison can be fooled by rounding, and why

## 3. Interview script: understand the problem (≈3 min)

**Me:** Let me make sure I understand the physics. Cars can't pass. A faster car that catches up just sticks to the slower one and inherits its speed. So a fleet moves at the speed of its slowest... actually at the speed of its front car, since the front car is never slowed. And I return how many separate groups reach the target.

**Interviewer:** Yes.

**Me:** If a car reaches the car in front exactly at the target, is that one fleet or two?

**Interviewer:** One fleet.

**Me:** Sizes: up to 10^5 cars, target up to 10^6, positions distinct and below target, speeds positive up to 10^6. So every car has a positive distance left, between 1 and 10^6, and a positive speed: arrival times are well defined and positive.

**Me:** By hand on Example 1. Alone, the arrival times are: car at 10: 2/2 = 1; car at 8: 4/4 = 1; car at 5: 7/1 = 7; car at 3: 9/3 = 3; car at 0: 12/1 = 12. Looking from the front: 10 arrives at 1. Then 8 would also arrive at 1, so it reaches 10 right at the target: same fleet. Then 5 arrives at 7, later than 1: it can't catch up, so it's a new fleet. 3 would arrive at 3, earlier than 7, so it's stuck behind 5 and arrives at 7. 0 arrives at 12, later than 7: new fleet. Three fleets. So once I go from front to back, I only need to compare with the fleet right ahead.

**Me:** One thing to watch: those times are fractions. Comparing them in floating point might be risky; I'll come back to that.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^5 | Comparing every pair of cars is about 5 × 10^9 steps. Sorting is fine: O(n log n). |
| 0 ≤ position[i] < target ≤ 10^6, positions distinct | Every car has 1 to 10^6 miles to go. The order along the road is strict, so "the car directly ahead" is well defined. Positions fit in an array index range, which allows a counting alternative. |
| 0 < speed[i] ≤ 10^6 | No division by zero. Cross-multiplied comparisons are products of a distance and a speed, at most 10^6 × 10^6 = 10^12, which overflows `int` (max ≈ 2.1 × 10^9) but fits easily in `long` (max ≈ 9.2 × 10^18). |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Catching up exactly at the target counts as the same fleet | A car merges when its time is **≤** the fleet's time, and starts a new fleet only when it is strictly greater. |
| The answer counts fleets arriving at the target | Every car eventually arrives, so every car belongs to exactly one fleet. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| I may not reorder the input arrays in place | Nothing says I may; I sort a copy of (position, speed) pairs. |
| Cars change speed instantly when they catch up | That is what "drives at the slower car's speed" means; no braking distance. |

### Edge cases I will keep in mind

- n = 1: one fleet.
- A car catching the fleet exactly at the target (Example 1, the cars at 8 and 10).
- All cars with the same speed: nobody catches anybody, so n fleets.
- Every car would arrive at the same time: one fleet.
- A car that is faster than the car directly ahead but stuck behind a slower fleet further ahead (Example 1, the car at 3 behind the car at 5).
- Arrival times that differ only far beyond the decimal point, for example 999,998/999,999 and 999,997/999,998.

## 4. Think out loud: from first idea to best solution

> "First idea: simulate. That's messy: catch-up moments are fractions of an hour, and fleets merge in chains. Let me instead find a rule for who ends up with whom."

> "Two cars, B behind A. If A is never slowed, A arrives at its own time tA. If B on its own would arrive at tB ≤ tA, then at time tB B is at the target and A isn't past it, so B must have reached A somewhere at or before the target, and from then on they move together: same fleet. If tB > tA, B can't have caught A before the target, because once it caught A it would arrive with A at time tA, and being held up can only make it later than tB. So: same fleet exactly when tB ≤ tA."

> "With many cars, A itself might be slowed by something ahead. Then what matters is A's *actual* arrival time, which is the time of the fleet A ends up in. A pairwise check would be: car i starts its own fleet exactly when no car ahead of it has an own time ≥ its own. That's O(n²), too slow at 10^5, but it gives the idea: go from the front backwards, and remember the time of the fleet directly ahead."

### Approach 1: Sort by position, stack of fleet arrival times

#### What I say out loud

> "I sort the cars by position, closest to the target first. I keep a stack of fleet arrival times; the top is the fleet directly ahead of the car I'm looking at. For each car I compute its own time as a double. If the stack is empty, or the car's time is strictly greater than the top, it can't catch that fleet, so it forms a new fleet and I push its time. Otherwise it merges into the fleet ahead and I push nothing. The answer is the stack size."

#### Intuition

After sorting, the cars arrive at your decision in the order in which they could block each other: a car can only be held up by cars already processed. The fleets formed so far are behind each other on the road, and a new car can only run into the last one, the one on top of the stack.

#### Algorithm

1. Build pairs `(position[i], speed[i])` and sort them by position, decreasing.
2. Create an empty stack of `double` times.
3. For each car in that order:
   1. `time = (target − position) / speed`, computed in `double`.
   2. If the stack is empty or `time > top`: push `time`.
4. Return the stack size.

#### Why it is correct

**The rule.** Process the cars from front to back. Claim: a car's actual arrival time is the maximum of its own time and the actual arrival time of the car directly ahead (for the front car, just its own time). The two-car argument above proves it, with "A" being the car ahead and its actual arrival time in place of its own time: A's trajectory, slowed or not, reaches the target at that time, and B either reaches A at or before the target (if its own time is ≤ A's arrival) or never does. Cars catching up are in the same fleet as the car they catch, and a car that arrives strictly later than the car ahead is in a different fleet. So consecutive cars along the road are in the same fleet exactly when they arrive at the same time, and the number of fleets is the number of cars that arrive strictly later than the car directly ahead, plus one for the front car.

**The stack.** The top of the stack is always the actual arrival time of the car directly ahead: when a car merges, its arrival time equals the top, so the top stays correct; when it starts a fleet, its own time is its arrival time and becomes the top. A car is pushed exactly when it arrives strictly later than the car ahead, so the stack size counts fleets. The stack's times strictly increase from bottom to top: fleets further back arrive later.

**Is `double` safe here?** The times are fractions d/s with 1 ≤ d ≤ 10^6 and 1 ≤ s ≤ 10^6, and d and s are exactly representable as `double`.

- Equal fractions give equal doubles: Java's `double` division is correctly rounded (IEEE 754), so it returns the double nearest to the exact quotient; two equal quotients round to the same double. So a catch exactly at the target, such as 2/2 against 4/4, compares as equal.
- Unequal fractions keep their order. If x = a/b < y = c/d, then y − x ≥ 1/(b·d), so (y − x)/y ≥ 1/(b·c) ≥ 10^−12. Rounding moves each value by a relative error of at most 2^−53 ≈ 1.1 × 10^−16, far less than half that gap, so the rounded values are still strictly ordered.

So the comparisons are exact for these constraints. I also checked it empirically: millions of random pairs of near-equal fractions within these bounds, compared in `double` and by exact cross-multiplication, with no disagreement. It is not safe in general: `float` (relative error about 6 × 10^−8) already fails on target = 10^6, position = [3, 2], speed = [999998, 999999], returning 1 instead of 2, and larger bounds would break `double` the same way.

#### Dry run

Example 1, sorted by position decreasing.

| Car (position, speed) | Own time | Top of stack before | Decision | Stack after (bottom first) |
|---|---|---|---|---|
| (10, 2) | 2/2 = 1 | empty | new fleet | [1] |
| (8, 4) | 4/4 = 1 | 1 | 1 > 1? no: merges, catching up exactly at the target | [1] |
| (5, 1) | 7/1 = 7 | 1 | 7 > 1: new fleet | [1, 7] |
| (3, 3) | 9/3 = 3 | 7 | 3 > 7? no: merges, arrives at 7 | [1, 7] |
| (0, 1) | 12/1 = 12 | 7 | 12 > 7: new fleet | [1, 7, 12] |

Returns 3. The car at 3 is the trap from section 3: it is faster than the car at 5, and its own time 3 is later than the front fleet's time 1, but what decides its fate is the fleet directly ahead, which arrives at 7.

#### Java code

```java title="Approach 1: sort by position, stack of fleet times"
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

class Solution {
    public int carFleet(int target, int[] position, int[] speed) {
        int n = position.length;
        int[][] cars = new int[n][];
        for (int i = 0; i < n; i++) {
            cars[i] = new int[] {position[i], speed[i]};
        }
        Arrays.sort(cars, (a, b) -> Integer.compare(b[0], a[0]));   // closest to the target first
        Deque<Double> fleets = new ArrayDeque<>();                   // arrival times; top = fleet directly ahead
        for (int[] car : cars) {
            double time = (double) (target - car[0]) / car[1];
            if (fleets.isEmpty() || time > fleets.peek()) {
                fleets.push(time);                                   // cannot catch the fleet ahead
            }
            // otherwise it catches the fleet ahead at or before the target and merges
        }
        return fleets.size();
    }
}
```

The cast `(double)` applies to `target - car[0]` before the division. Without it, `(target - car[0]) / car[1]` is integer division: times 1.5 and 1 both become 1.

#### Time complexity

**O(n log n) in every case**, where n is the number of cars: building the pairs is O(n), sorting is O(n log n) comparisons (the current JDK sorts object arrays with TimSort, a merge-sort variant that is O(n log n) in the worst case), and the loop is O(n) with O(1) stack operations.

#### Space complexity

**O(n) auxiliary space**: the n pairs, plus up to n entries on the stack (when every car is its own fleet).

#### The bridge to the next approach

> "Only the top of the stack is ever read. Nothing below it is used again, since cars further back can only run into the last fleet. So the stack is just a counter plus one 'time of the fleet ahead'."

> "And while I'm here, I'd rather not have to give the floating-point argument at all. Comparing d1/s1 > d2/s2 with positive s1 and s2 is the same as comparing d1·s2 > d2·s1, and those products are at most 10^12, which fits in a `long`. That's exact without any argument."

### Approach 2: One "fleet ahead" time, compared exactly (recommended)

#### What I say out loud

> "Same sort. Instead of the stack, I keep the time of the fleet directly ahead as a fraction, its distance and speed, starting with a dummy fleet that arrives at time 0. For each car, it starts a new fleet if its distance times the ahead speed is greater than the ahead distance times its speed. Then I count it and it becomes the fleet ahead. Everything in `long`, so the comparison is exact."

#### Intuition

The same rule as Approach 1, with the stack reduced to the only entry that is ever read, and the time stored as an exact fraction instead of a rounded number.

#### Algorithm

1. Sort the (position, speed) pairs by position, decreasing.
2. `fleets = 0`; the fleet ahead has `aheadDist = 0`, `aheadSpeed = 1` (a dummy that arrives at time 0, so the first car always starts a fleet).
3. For each car: `dist = target − position`. If `dist · aheadSpeed > aheadDist · speed` (in `long`): `fleets++`, `aheadDist = dist`, `aheadSpeed = speed`.
4. Return `fleets`.

#### Why it is correct

`(aheadDist, aheadSpeed)` always describes the arrival time of the car directly ahead, by the same argument as Approach 1: a merging car arrives at that time, so nothing changes; a car that starts a fleet arrives at its own time. The test `dist · aheadSpeed > aheadDist · speed` is the same as `dist / speed > aheadDist / aheadSpeed`, because both speeds are positive, so multiplying both sides by `speed · aheadSpeed` keeps the direction of the inequality. Each product is at most 10^6 · 10^6 = 10^12, so `long` holds it exactly. The dummy fleet has time 0, and every car has dist ≥ 1, so the first car always starts a fleet.

**The 25-second version to say to the interviewer:**

> "A car can only be held up by cars ahead of it, so I go from the front backwards. A car joins the fleet directly ahead if it would arrive no later than that fleet, including exactly at the target; otherwise it's a new fleet and becomes the one the next cars run into. I sort by position, keep that fleet's time as a fraction, and compare by cross-multiplying in `long`, which is exact since the products are at most 10^12. O(n log n) for the sort."

#### Dry run

Example 1 again; the comparison is `dist · aheadSpeed` against `aheadDist · speed`.

| Car (position, speed) | dist | Ahead (dist, speed) | Compare | Decision | fleets |
|---|---|---|---|---|---|
| (10, 2) | 2 | (0, 1) dummy | 2·1 = 2 > 0·2 = 0 | new, ahead := (2, 2) | 1 |
| (8, 4) | 4 | (2, 2) | 4·2 = 8 > 2·4 = 8? no | merges at the target | 1 |
| (5, 1) | 7 | (2, 2) | 7·2 = 14 > 2·1 = 2 | new, ahead := (7, 1) | 2 |
| (3, 3) | 9 | (7, 1) | 9·1 = 9 > 7·3 = 21? no | merges | 2 |
| (0, 1) | 12 | (7, 1) | 12·1 = 12 > 7·1 = 7 | new, ahead := (12, 1) | 3 |

Returns 3. The catch exactly at the target shows up as an exact tie, 8 against 8.

#### Java code

```java title="Approach 2: one fleet-ahead time, exact comparison (recommended)"
import java.util.Arrays;

class Solution {
    public int carFleet(int target, int[] position, int[] speed) {
        int n = position.length;
        int[][] cars = new int[n][];
        for (int i = 0; i < n; i++) {
            cars[i] = new int[] {position[i], speed[i]};
        }
        Arrays.sort(cars, (a, b) -> Integer.compare(b[0], a[0]));   // closest to the target first
        int fleets = 0;
        long aheadDist = 0;      // the fleet directly ahead arrives at aheadDist / aheadSpeed;
        long aheadSpeed = 1;     // the dummy 0 / 1 makes the first car start a fleet
        for (int[] car : cars) {
            long dist = target - car[0];
            long carSpeed = car[1];
            // dist / carSpeed > aheadDist / aheadSpeed, cross-multiplied; products <= 10^12 fit in long
            if (dist * aheadSpeed > aheadDist * carSpeed) {
                fleets++;
                aheadDist = dist;
                aheadSpeed = carSpeed;
            }
        }
        return fleets;
    }
}
```

`dist` and `carSpeed` are `long` before the multiplication. Writing `long p = (target - car[0]) * aheadSpeedAsInt;` with two `int`s would overflow before the widening, since 10^12 > 2^31 − 1.

#### Time complexity

**O(n log n) in every case**: the sort dominates; the loop is O(n).

#### Space complexity

**O(n) auxiliary space** for the sorted pairs; the loop itself uses O(1).

### Alternative: bucket the cars by position instead of sorting

Positions are distinct integers in `0..target − 1`, so an array indexed by position replaces the sort: store each car's speed at `speedAt[position]` (0 means "no car", which is safe because speeds are positive), then scan positions from `target − 1` down to 0 with the same loop as Approach 2.

```java title="Alternative: bucket by position"
class Solution {
    public int carFleet(int target, int[] position, int[] speed) {
        int[] speedAt = new int[target];                 // 0 = no car at this mile
        for (int i = 0; i < position.length; i++) {
            speedAt[position[i]] = speed[i];
        }
        int fleets = 0;
        long aheadDist = 0;
        long aheadSpeed = 1;
        for (int p = target - 1; p >= 0; p--) {
            if (speedAt[p] == 0) {
                continue;
            }
            long dist = target - p;
            if (dist * aheadSpeed > aheadDist * speedAt[p]) {
                fleets++;
                aheadDist = dist;
                aheadSpeed = speedAt[p];
            }
        }
        return fleets;
    }
}
```

**Cost:** O(n + target) time and O(target) space, where target ≤ 10^6, so up to about 4 MB for the array. **When it wins:** when target is small compared with n log n, or when you want to avoid sorting objects. **When it loses:** with a few cars and target = 10^6 it scans a million empty miles; and it depends on positions being bounded integers, which the comparison sort does not.

## 5. Comparison table

n = number of cars, target = the destination mile. Nothing is hashed or randomized.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Pairwise check (not coded) | O(n²) | O(n²) | O(1) |
| 1. Sort + stack of times (`double`) | O(n log n) | O(n log n) | O(n) |
| 2. Sort + one fleet-ahead time (exact) | O(n log n) | O(n log n) | O(n) |
| Alt. Bucket by position | O(n + target) | O(n + target) | O(target) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Pairwise check | States the rule directly | About 5 × 10^9 steps at n = 10^5 | Test reference only |
| 1. Stack | Shows the fleets explicitly; matches how many people first see it | Relies on an argument that `double` is exact here; the stack is unnecessary | When you think in terms of the list of fleets |
| 2. One variable, exact | Exact with no numerical argument; O(1) beyond the sort | The cross-multiplication must be explained | The answer to give |
| Alt. Buckets | No comparison sort | Memory and time scale with target | Small target, or when asked to beat O(n log n) |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2. Derive the two-car rule, process cars from the front, and say up front that times are fractions and you will compare them exactly. If you write `double` instead, be ready to give the argument from Approach 1 for why it is exact under these bounds; "it's probably fine" is not an answer.

**Is it optimal?** The loop is O(n), and there is a worst-case Ω(n) lower bound for reading the input: with all speeds 1 there are n fleets, and raising the speed of any single unread car other than the front one (to its own distance, at most 10^6) makes it catch the car ahead and changes the count. The sort is the expensive part. With bounded integer positions, the bucket alternative gets O(n + target). Whether O(n log n) is necessary for comparison-based algorithms when positions are unbounded I have not proved, so I would not claim it.

**When to stop:** once the rule, the exact comparison and the catch-at-target tie are explained. Sorting an `int[]` of indices or packed keys instead of `int[][]` pairs is a constant-factor tweak.

## 7. Interview script: code it and test it

### What I say while coding

> "I pair each position with its speed so sorting keeps them together, and sort by position descending with `Integer.compare`."

> "The fleet ahead starts as a dummy that arrives at time 0; every real car is slower than that, so the first car always makes a fleet."

> "For each car: distance as a `long`, then the strict test `dist * aheadSpeed > aheadDist * speed`. Strict, because equal means it reaches the fleet exactly at the target, which counts as the same fleet."

### Testing out loud

**Normal case:** Example 1, traced in section 4, returns 3.

**n = 1:** `target = 10`, `position = [3]`, `speed = [3]`: 7·1 > 0, one fleet.

**Catch exactly at the target:** `target = 10`, `position = [0, 5]`, `speed = [2, 1]`: the car at 5 needs 5/1 = 5 hours, the car at 0 needs 10/2 = 5. Comparison 10·1 > 5·2 is 10 > 10, false, so it merges: 1 fleet.

**Same speeds:** `target = 10`, `position = [1, 4, 7]`, `speed = [2, 2, 2]`: times 1.5, 3, 4.5 from the front, each strictly greater: 3 fleets.

**Stuck behind a slower fleet further ahead:** `target = 10`, `position = [3, 1, 0]`, `speed = [1, 3, 2]`: from the front, times 7, 3, 5. The car at 1 merges (3 ≤ 7); the car at 0 has 5 ≤ 7, so it merges too, even though 5 > 3. Answer 1.

**Precision:** `target = 10^6`, `position = [3, 2]`, `speed = [999998, 999999]`: exact comparison 999,998 · 999,998 = 999,996,000,004 > 999,997 · 999,999 = 999,996,000,003, so the back car is slower: 2 fleets.

**Largest input:** n = 10^5, `target = 10^6`, `position[i] = i`, `speed[i] = 10^6 − i`: every car needs exactly 1 hour, so all of them catch up exactly at the target: 1 fleet, decided by 10^5 exact ties.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 3 min | No passing, tie at the target, ranges |
| Two-car rule | 4 min | Same fleet exactly when the back car's time ≤ the fleet ahead's |
| Order and many cars | 3 min | Front to back, compare with the fleet directly ahead |
| Precision | 2 min | Cross-multiply in `long`; mention why `double` happens to work |
| Code | 5 min | Approach 2 |
| Trace and edge cases | 5 min | Example 1, the tie, the "stuck behind" case |
| Questions | rest | Section 9 |

**Where the time should go:** the two-car rule. Once it is clear, the code is a dozen lines.

**If you get stuck:** compute every car's own arrival time for Example 1 and write them in road order, front first: 1, 1, 7, 3, 12. Ask which numbers start a new group.

## 9. Interviewer challenges

### About correctness

#### Why do you compare with the fleet ahead and not with the car directly ahead's own time?

**What they are testing:** whether you see that a car can be slowed by a car it never touches directly.

**How to reason:** find a car whose neighbour is itself slowed.

**What I say:** "The car directly ahead might be stuck behind someone slower, so its real arrival is later than its own time. In `position = [3, 1, 0]`, `speed = [1, 3, 2]`, target 10, the car at 0 has time 5 and the car at 1 has time 3, but the car at 1 is stuck behind the car at 3 and arrives at 7. So the car at 0 merges. Comparing with the neighbour's own time gives 2 fleets; the answer is 1."

**Nuance:** that is why the stack's top, or the single variable, only changes when a new fleet starts.

#### Why does sorting by position, not by time or speed, give the right order?

**What they are testing:** the structure of the problem.

**How to reason:** which cars can affect which?

**What I say:** "A car's arrival depends only on the cars in front of it, because nobody passes. Going front to back, every car I look at has all its blockers already decided."

**Nuance:** sorting by time instead would lose the road order, and the road order is what decides who can block whom.

### About precision

#### Is it safe to compare the times as `double`?

**What they are testing:** numerical care, not a reflex answer.

**How to reason:** what do the values look like, and how far apart can two different ones be?

**What I say:** "Here, yes, and I can say why: the times are fractions with numerator and denominator up to 10^6. Equal fractions round to the same double because division is correctly rounded, and two different ones differ by at least a relative 10^−12, far more than the 10^−16 rounding error. But it depends on the bounds; `float` already fails, on target 10^6 with positions [3, 2] and speeds [999998, 999999]. Cross-multiplying in `long` is exact and no longer, so that's what I'd write."

**Nuance:** an epsilon comparison (`time > top + 1e-9`) is not a fix: it needs its own argument that no two different times are closer than the epsilon, which is the same argument as above.

### About complexity

#### Can you do better than O(n log n)?

**What they are testing:** whether you notice the bounded positions.

**How to reason:** what does the sort buy, and is there a cheaper way to get it?

**What I say:** "The sort only gives the road order. Positions are distinct integers below target ≤ 10^6, so I can bucket them in an array indexed by position: O(n + target) time and O(target) memory. Whether that's better depends on target compared with n log n."

**Nuance:** for unbounded positions I would not claim a lower bound I have not proved.

## 10. Follow-up questions the interviewer might ask

**"Return the size of each fleet."**
Keep a counter for the current fleet and increment it when a car merges; push the count when a new fleet starts. O(n log n).

**"Return the time at which each fleet arrives."**
That is the fleet ahead's time each time a new fleet starts: the stack of Approach 1, or the list of `(aheadDist, aheadSpeed)` fractions. O(n log n).

**"Return, for each car, the time at which it joins a fleet ahead, or −1."**
Now the moment of catching up matters, not just the arrival, and the car ahead may itself merge before it is reached. This is Car Fleet II: going from the front with a stack of candidate cars, a car pops every candidate it could only reach after that candidate has already merged further ahead, and its catch-up time is computed against the first remaining one. Each car is pushed and popped once, so O(n) when the cars are given in road order.

**"Two cars may start at the same mile."**
Ask first; the natural reading is that they already form one fleet moving at the slower speed. Sort ties by own time, slower first: the slower car is decided as usual, and the faster one then has a time no later than it and merges. Still O(n log n).

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Sorting by speed or by time.** Only the road order decides who can block whom.
- **Counting a catch exactly at the target as a separate fleet.** The statement says it is one fleet.
- **Trusting floating point without a reason.** It happens to be exact here; know why, or compare exactly.

### Implementation mistakes

> [!MISTAKE] Merging only on strictly smaller times
> Testing `time >= top` to start a new fleet counts a tie as a new fleet. Example 1 returns 4 instead of 3, because the car at 8 reaches the car at 10 exactly at mile 12.

> [!MISTAKE] Integer division for the time
> `(target - p) / s` in `int` truncates. `target = 10`, `position = [8, 7]`, `speed = [2, 2]` has times 1 and 1.5, so 2 fleets, but truncation makes both 1 and returns 1.

- **Overflowing the cross-multiplication.** `(target - p) * aheadSpeed` with both as `int` overflows at 10^12; make at least one operand `long` before multiplying.
- **Comparing with the previous car instead of the fleet ahead** (updating the stored time on every car, not only on new fleets): `target = 10`, `position = [3, 1, 0]`, `speed = [1, 3, 2]` returns 2 instead of 1.
- **Sorting ascending and then scanning from index 0.** That processes the car furthest from the target first, before the cars that can block it.

## 12. Pattern recognition

**The pattern:** sort to get the blocking order, then sweep with a stack (or a single "current group" value) where each element either merges into the group ahead or starts a new one.

**Signals in the problem statement:**

- Objects that cannot pass each other, or that block the ones behind.
- "How many groups end up…", where merging is decided by comparing with the group ahead.
- Ratios or times that are fractions of bounded integers: compare by cross-multiplication.

**Related problems in this list:**

- [[nc-daily-temperatures|Daily Temperatures]]: a stack where each newcomer is compared with the entries ahead of it.
- [[nc-asteroid-collision|Asteroid Collision]]: objects moving along a line, resolved with a stack of survivors.
- [[nc-merge-intervals|Merge Intervals]]: sort, then each element either joins the current group or starts a new one.
- [[nc-online-stock-span|Online Stock Span]]: entries merge into a newcomer that dominates them.
- [[nc-largest-rectangle-in-histogram|Largest Rectangle in Histogram]]: a monotonic stack of blocks, each covering a range.

**Takeaway:** when things on a line can only be held up by what is ahead of them, sort by position, sweep from the front, and compare each one with the group directly ahead; compare fractions exactly by cross-multiplying.

## 13. 60-second revision card

**Key insight:** a car ends up in the fleet directly ahead exactly when its own arrival time is ≤ that fleet's arrival time (a tie means meeting at the target, which counts).

**Invariant:** going from the front, the stored time is the actual arrival time of the car directly ahead; it changes only when a new fleet starts.

**Complexity:** O(n log n) time for the sort, O(n) space for the pairs. Bucketing by position gives O(n + target).

**Code skeleton:**

```java title="Car Fleet, sort and compare exactly" fragment="public int carFleet(int target, int[] position, int[] speed)"
int n = position.length;
int[][] cars = new int[n][];
for (int i = 0; i < n; i++) cars[i] = new int[] {position[i], speed[i]};
Arrays.sort(cars, (a, b) -> Integer.compare(b[0], a[0]));        // front first
int fleets = 0;
long aheadDist = 0, aheadSpeed = 1;                               // dummy fleet arriving at time 0
for (int[] car : cars) {
    long dist = target - car[0];
    if (dist * aheadSpeed > aheadDist * car[1]) {                 // strictly later: new fleet
        fleets++;
        aheadDist = dist;
        aheadSpeed = car[1];
    }
}
return fleets;
```

**Main traps:**

- Strict `>` for a new fleet: a tie at the target merges.
- Compare with the fleet ahead, not the neighbour's own time.
- Times are fractions: cross-multiply in `long` (products ≤ 10^12).

**What to say in one breath:** "Nobody passes, so I go from the car closest to the target backwards. A car joins the fleet ahead if it would arrive no later than it, including exactly at the target, otherwise it starts a new fleet that the next cars run into. Sort by position, cross-multiply to compare times exactly: O(n log n)."
