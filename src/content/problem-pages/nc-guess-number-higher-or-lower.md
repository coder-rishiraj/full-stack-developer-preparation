---
problemId: nc-guess-number-higher-or-lower
title: Guess Number Higher Or Lower
source: neetcode
sourceUrl: https://leetcode.com/problems/guess-number-higher-or-lower/
difficulty: easy
patterns: [binary-search]
relatedLessons: [a3-binary-search, a3-lower-upper-bounds, a14-edge-cases, a14-manual-testing]
companies: []
timeToSolve: 8
---

## 1. Problem restatement

Someone has picked a whole number `pick` between 1 and `n`. You do not see it. You may call a provided method `guess(num)`, which compares your number with the pick and answers:

- `-1` if your number is **higher** than the pick,
- `1` if your number is **lower** than the pick,
- `0` if you guessed it.

Write `guessNumber(n)`, which returns the pick. On LeetCode your class is declared as `public class Solution extends GuessGame`, and `guess` is inherited from `GuessGame`.

**Example 1**

- Input: `n = 10`, `pick = 6`
- Output: `6`
- Why: `guess(5)` returns `1` (5 is too low), `guess(8)` returns `-1` (too high), `guess(6)` returns `0`.

**Example 2**

- Input: `n = 1`, `pick = 1`
- Output: `1`
- Why: there is only one possible number, and `guess(1)` confirms it.

**What the problem statement guarantees**

- 1 ≤ `n` ≤ 2^31 − 1, so `n` can be `Integer.MAX_VALUE` = 2,147,483,647.
- 1 ≤ `pick` ≤ `n`: the pick always exists and is in range.
- The answer of `guess` always refers to the same fixed pick.

## 2. Practice first: try it before reading on

The algorithm here is short; the trap is in one line of arithmetic, and it only shows up near the top of the allowed range for `n`. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 8 minutes and talk out loud.
2. Write down, before coding, what is true about your candidate range before every call to `guess`.
3. Write the code, then look at every arithmetic expression and ask: with `n = 2,147,483,647`, can this exceed what an `int` holds?
4. Count how many calls your method makes in the worst case for the largest `n`.

> [!HINT] Hint 1: a small nudge
> Each answer of `guess` tells you which side of your number the pick is on. Which number should you ask about first so that, whatever the answer, as few candidates as possible are left?

> [!HINT] Hint 2: the kind of tool you need
> Keep the lowest and highest numbers that can still be the pick. Guess the one in the middle; the answer lets you discard the middle and everything on one side of it.

> [!HINT] Hint 3: almost the whole plan
> `lo = 1`, `hi = n`; while `lo <= hi`, guess the middle: `0` returns it, `-1` means the pick is below so `hi = mid - 1`, `1` means `lo = mid + 1`. Compute the middle so that it never adds two numbers near 2^31: `lo + (hi - lo) / 2`.

**Check yourself before revealing the walkthrough**

- [ ] I can state the invariant on `lo` and `hi`
- [ ] I read the sign of `guess` the right way round: `-1` means my number is too high
- [ ] My code returns 2,147,483,647 when `n` and the pick are both 2,147,483,647
- [ ] I know how many calls my method makes in the worst case for that `n`

## 3. Interview script: understand the problem (≈1 min)

**Me:** So there's a hidden number from 1 to n, and `guess` compares my number with it. Let me get the signs right: `-1` means my guess is bigger than the pick, so I should go lower; `1` means my guess is smaller, so I go higher?

**Interviewer:** Yes. It reads from the point of view of the pick.

**Me:** Then I'll name it in my head as "the pick is lower" for −1 and "the pick is higher" for 1. How big is n?

**Interviewer:** Up to 2^31 − 1.

**Me:** That's the whole positive `int` range. Two things follow. Trying numbers one by one could take two billion calls, so I need something logarithmic. And if I ever add two numbers from that range, the sum can pass `Integer.MAX_VALUE`, so I have to watch the midpoint.

**Interviewer:** Fair.

**Me:** By hand with n = 10 and pick 6: I guess 5, too low, so 6 to 10 remain; the middle is 8, too high, so 6 to 7; I guess 6, correct. Three calls.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 2^31 − 1 | A linear search can need about 2.1 × 10^9 calls, so it is out. `lo + hi` can reach 2^32 − 2, far above `Integer.MAX_VALUE`, so the midpoint must be computed without that sum. |
| 1 ≤ pick ≤ n | The search always finds something; the loop's "not found" exit is unreachable. |
| `guess` returns −1, 1 or 0 | Three outcomes per call; −1 points down, 1 points up. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| `-1` means my number is higher than the pick | `-1` leads to `hi = mid - 1`. Reading it the other way round sends the search away from the pick. |
| The pick does not change between calls | Each answer stays true, so a discarded number never needs to be checked again. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The number of `guess` calls is what matters, more than the arithmetic around them | On the real judge `guess` is a cheap comparison, but the problem is about how much each answer tells me. |

### Edge cases I will keep in mind

- `n = 1`: one call.
- The pick is 1 or `n`: the range collapses onto an end.
- `n = 2,147,483,647` with pick `n`: the first midpoint already overflows if it is computed as `(lo + hi) / 2`.
- `n = 2^30` with pick `n`: the smallest `n` where `(lo + hi) / 2` overflows at all.

## 4. Think out loud: from first idea to best solution

Throughout, **n** is the upper end of the range, at most 2^31 − 1.

The simplest correct method guesses 1, 2, 3, … until `guess` returns 0. It is correct by inspection, but it ignores the direction in each answer and makes up to n calls: about 2.1 × 10^9 for the largest n. I say it in one sentence and move on.

### Approach 1: Binary search on the number range (recommended)

#### What I say out loud

> "The answer from `guess` tells me which side the pick is on, so I keep the range of numbers that can still be the pick, `[lo, hi]`, starting at `[1, n]`. I guess the middle. Zero: done. Minus one: the pick is lower, so `hi = mid - 1`. One: `lo = mid + 1`. That halves the candidates each call, so about 31 calls for the largest n."

> "The one thing to be careful about is the middle. `lo + hi` can be close to 2^32, which doesn't fit in an `int`, so I'll write `lo + (hi - lo) / 2`."

#### Intuition

This is the closed-range loop from [[nc-binary-search|Binary Search]], except that the "array" is the numbers 1 to n themselves and `guess(mid)` replaces the comparison with `nums[mid]`. No index is ever read, so the range can be as large as the `int` type allows, and that is exactly what makes the midpoint dangerous.

#### Algorithm

1. `lo = 1`, `hi = n`.
2. While `lo <= hi`:
3. `mid = lo + (hi − lo) / 2`, `answer = guess(mid)`.
4. If `answer == 0`, return `mid`. If `answer == -1`, set `hi = mid − 1`; otherwise set `lo = mid + 1`.
5. After the loop (unreachable, since the pick is in `[1, n]`), return −1.

#### Why it is correct

**The invariant:** before every call to `guess`, the pick is in the closed range `[lo, hi]`.

- **Start.** `[1, n]` contains the pick, by the statement's guarantee.
- **The midpoint is in the range and computed without overflow.** With `1 ≤ lo ≤ hi ≤ 2^31 − 1`, `hi − lo` is between 0 and 2^31 − 2, so it fits in an `int`, and `lo + (hi − lo) / 2` lies between `lo` and `hi`, so it fits too.
- **`guess(mid) == -1`.** `mid` is higher than the pick, so the pick is in `[lo, mid − 1]`: `hi = mid − 1` keeps the invariant.
- **`guess(mid) == 1`.** The pick is in `[mid + 1, hi]`: `lo = mid + 1` keeps it.
- **Termination.** Each non-returning call excludes `mid` and everything on one side, so the range loses at least one number. Since the range always contains the pick, it can never become empty, so the loop ends by returning the pick.

**The 25-second version to say to the interviewer:**

> "The pick is always in `[lo, hi]`. I guess the middle, computed as `lo + (hi − lo) / 2` so nothing overflows. Minus one means the pick is below the middle, so `hi = mid − 1`; one means above, so `lo = mid + 1`. The range always contains the pick and shrinks every call, so I hit it within ⌊log2 n⌋ + 1 calls: 31 for the largest n."

#### Dry run

`n = 10`, `pick = 6`

| lo | hi | mid | guess(mid) | Meaning | Action |
|---|---|---|---|---|---|
| 1 | 10 | 5 | 1 | 5 is lower than the pick | `lo = 6` |
| 6 | 10 | 8 | −1 | 8 is higher than the pick | `hi = 7` |
| 6 | 7 | 6 | 0 | found | return 6 |

#### Java code

```java title="Approach 1: binary search, overflow-safe midpoint (recommended)"
public class Solution extends GuessGame {
    public int guessNumber(int n) {
        int lo = 1;
        int hi = n;                            // invariant: the pick is in [lo, hi]
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;      // hi - lo fits in an int; (lo + hi) may not
            int answer = guess(mid);
            if (answer == 0) {
                return mid;
            }
            if (answer == -1) {
                hi = mid - 1;                  // mid is higher than the pick
            } else {
                lo = mid + 1;                  // mid is lower than the pick
            }
        }
        return -1;                             // unreachable: 1 <= pick <= n
    }
}
```

**The bug this midpoint avoids.** With `int mid = (lo + hi) / 2`, the input `n = 2,147,483,647`, `pick = 2,147,483,647` fails on the very first call. `lo + hi` = 1 + 2,147,483,647 = 2^31, which wraps around to −2,147,483,648, so `mid` = −1,073,741,824. `guess` answers 1 ("the pick is higher"), so `lo` becomes −1,073,741,823: the range has grown instead of shrinking. I ran this version against a `GuessGame` that stops after 100 calls. The midpoints alternate between positive and negative values, and from the 31st call on the search repeats `lo = 715,827,883` and `lo = −715,827,882` forever, never guessing anything near the pick. The first `n` where the bug can happen at all is 2^30 = 1,073,741,824, and only with the pick equal to `n`: below that, `lo + hi ≤ 2n ≤ 2^31 − 2` always fits. With `n = 2^30` and that pick, the search behaves normally for 30 calls until `lo = hi = 2^30`, then the sum 2^31 wraps, `mid` becomes −2^30, the next midpoint is 0, `lo` resets to 1, and the whole search starts over in an endless cycle.

#### Time complexity

**At most ⌊log2 n⌋ + 1 calls to `guess`, so O(log n); 31 calls for n = 2^31 − 1.** If the range holds k numbers, the part kept after a call holds at most ⌊k / 2⌋ (with `mid` rounded down, the left part has ⌊(k − 1) / 2⌋ numbers and the right part ⌊k / 2⌋). After i calls at most ⌊n / 2^i⌋ remain, and the range never empties while it holds the pick, so the pick is found by call ⌊log2 n⌋ + 1. I confirmed the 31 by running it with n = pick = 2^31 − 1. Everything around each call is O(1).

#### Space complexity

**O(1) auxiliary space**: three `int`s.

#### The bridge to the next approach

> "Each call to `guess` has three possible answers, and I'm only using it to split the range in two. Would splitting into three pieces, with two guesses per round, finish in fewer calls? Let me count rather than guess."

### Approach 2: Ternary search (two guesses per round)

#### What I say out loud

> "Cut the range into thirds with two guesses, `m1` and `m2`. If `m1` is too high, the pick is in the first third. Otherwise I ask about `m2`: too low means the last third, too high means the middle third. Each round keeps about a third of the range instead of a half. But a round can cost two calls instead of one, so I need to compare calls, not rounds."

#### Intuition

Dividing by 3 per round sounds faster than dividing by 2 per call, but the fair comparison is per call. Two calls of binary search shrink the range by a factor of 4; a ternary round spends up to two calls to shrink it by a factor of 3.

#### Algorithm

1. `lo = 1`, `hi = n`.
2. While `lo <= hi`: `third = (hi − lo) / 3`, `m1 = lo + third`, `m2 = hi − third`.
3. Guess `m1`: 0 returns it; −1 sets `hi = m1 − 1` and starts the next round.
4. Otherwise guess `m2`: 0 returns it; 1 sets `lo = m2 + 1`; −1 sets `lo = m1 + 1`, `hi = m2 − 1`.

#### Why it is correct

The same invariant as Approach 1: the pick is in `[lo, hi]` before each round. `m1 = lo + third` and `m2 = hi − third` lie inside `[lo, hi]` with `m1 ≤ m2`, and neither expression adds two large numbers. Each branch keeps exactly the numbers that the answers have not ruled out: below `m1`, above `m2`, or strictly between them. Each round excludes at least `m1`, so the range shrinks and the loop ends at the pick.

#### Dry run

`n = 10`, `pick = 6`

| lo | hi | third | m1 | guess(m1) | m2 | guess(m2) | Action |
|---|---|---|---|---|---|---|---|
| 1 | 10 | 3 | 4 | 1 | 7 | −1 | middle third: `lo = 5`, `hi = 6` |
| 5 | 6 | 0 | 5 | 1 | 6 | 0 | return 6 |

Four calls, where Approach 1 needed three.

#### Java code

```java title="Approach 2: ternary search"
public class Solution extends GuessGame {
    public int guessNumber(int n) {
        int lo = 1;
        int hi = n;                            // invariant: the pick is in [lo, hi]
        while (lo <= hi) {
            int third = (hi - lo) / 3;
            int m1 = lo + third;               // neither line adds two large numbers
            int m2 = hi - third;
            int first = guess(m1);
            if (first == 0) {
                return m1;
            }
            if (first == -1) {                 // pick < m1
                hi = m1 - 1;
                continue;
            }
            int second = guess(m2);
            if (second == 0) {
                return m2;
            }
            if (second == 1) {                 // pick > m2
                lo = m2 + 1;
            } else {                           // m1 < pick < m2
                lo = m1 + 1;
                hi = m2 - 1;
            }
        }
        return -1;                             // unreachable: 1 <= pick <= n
    }
}
```

#### Time complexity

**O(log n) calls, but more of them than Approach 1: 39 in the worst case for n = 2^31 − 1, against 31.** Each round keeps at most about a third of the range and costs one or two calls, so the worst case is about 2 log3 n ≈ 1.26 log2 n calls. I computed the exact worst case with a recursion over range sizes (a round on k numbers costs 1 call plus the worst case on the first third, or 2 calls plus the worst case on the middle or last third), checked it against running every pick for small n, and ran n = pick = 2^31 − 1, which takes 39 calls. Smaller sizes show the same gap: for n = 10 it is 5 calls against 4, for n = 1000, 13 against 10.

#### Space complexity

**O(1) auxiliary space.**

## 5. Comparison table

n is the size of the range, at most 2^31 − 1. Nothing is randomized or hashed, so expected and worst case coincide; the time column counts calls to `guess`, each followed by O(1) work.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Linear guessing (not coded) | O(n) | O(n), about 2.1 × 10^9 calls | O(1) |
| 1. Binary search | O(log n) | ⌊log2 n⌋ + 1 calls, 31 for the largest n | O(1) |
| 2. Ternary search | O(log n) | about 2 log3 n calls, 39 for the largest n | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Linear guessing | Correct by inspection | Ignores the direction of each answer | Never; one sentence as the baseline |
| 1. Binary search | Fewest calls possible in the worst case; short | The midpoint must avoid `lo + hi` | The answer |
| 2. Ternary search | Same invariant, also logarithmic | About 26% more calls; more branches to get right | Only to show why it loses |

## 6. Which solution to give, and when to stop optimizing

Give Approach 1 and point at the midpoint before the interviewer does. It is optimal in the worst case: a strategy that makes at most k calls can identify at most 2^k − 1 different picks, because the first call either ends the search (one pick) or sends it into one of two branches that each have k − 1 calls left. Identifying any of n picks therefore needs 2^k − 1 ≥ n, that is k ≥ ⌈log2(n + 1)⌉ = ⌊log2 n⌋ + 1 calls, which is 31 for the largest n. Binary search uses exactly that many, so there is nothing left to optimize; mention ternary search only if asked whether more pieces would help.

## 7. Interview script: code it and test it

### What I say while coding

> "`lo = 1`, `hi = n`, and the invariant goes in a comment: the pick is in `[lo, hi]`."

> "Midpoint: `lo + (hi - lo) / 2`. With n up to 2^31 − 1, `lo + hi` would overflow; `hi - lo` can't, because both are positive."

> "I store `guess(mid)` in a variable so I call it once per iteration, not once per `if`."

> "Minus one means my number is too high, so `hi = mid - 1`. I'll say the sign meaning out loud each time, since that's the other easy slip."

### Testing out loud

**Normal case:** n = 10, pick 6: guesses 5, 8, 6, the dry-run table.

**n = 1:** `lo = hi = 1`, `mid = 1`, `guess(1)` is 0, return 1.

**Pick at an end:** pick 1 with n = 10: guesses 5, 2, 1; `hi` walks down. Pick 10: guesses 5, 8, 9, 10; `lo` walks up.

**The overflow input:** n = pick = 2,147,483,647. First `mid` = 1 + (2,147,483,646 / 2) = 1,073,741,824, a valid number; the answer is 1, `lo` moves up, and `lo` climbs until it reaches the pick on call 31. With `(lo + hi) / 2` the very first midpoint would be −1,073,741,824.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1 min | The meaning of −1 and 1, the range of n |
| Baseline | 15 s | Linear guessing, too many calls |
| Code | 2 min | Approach 1 with the safe midpoint |
| Trace | 2 min | n = 10, n = 1, n = 2^31 − 1 |
| Discussion | 1–2 min | Call count, optimality, why not ternary |

This problem is mostly a test of whether your binary search is reliable on a range where overflow is real. If you are stuck, it is almost always the sign of `guess` or the midpoint; check those two lines first.

## 9. Interviewer challenges

### About the arithmetic

#### Why not `(lo + hi) / 2`?

**What they are testing:** whether you know the classic overflow and can show it concretely.

**How to reason:** take the largest values `lo` and `hi` can have together and add them.

**What I say:** "With n = 2^31 − 1 and the pick at n, the very first sum is 1 + 2^31 − 1 = 2^31, which wraps to −2^31 in an `int`, so `mid` is −1,073,741,824. `guess` says go higher, `lo` becomes negative and the range grows; it ends up cycling forever. `lo + (hi − lo) / 2` never forms the large sum: `hi − lo` is at most 2^31 − 2."

**Nuance:** `(lo + hi) >>> 1` is another correct fix: for non-negative `lo` and `hi` the true sum is below 2^32, so reading the wrapped bits as unsigned and shifting gives the right midpoint. Computing in `long` (`(int) (((long) lo + hi) / 2)`) also works. The bug needs n ≥ 2^30 and only appears when the search climbs that high, which is why small tests never catch it.

### About the number of calls

#### Would ternary search use fewer calls?

**What they are testing:** whether you compare costs per call rather than per round.

**How to reason:** binary search shrinks the range by 2 per call; a ternary round shrinks it by 3 for up to 2 calls, which is only √3 ≈ 1.73 per call.

**What I say:** "No. Thirds look faster per round, but a round can cost two calls. In the worst case it's about 2 log3 n calls, roughly 1.26 log2 n. For n = 2^31 − 1, I counted 39 calls against binary search's 31."

**Nuance:** ternary search earns its place elsewhere: finding the maximum of a function that rises then falls, where a single comparison cannot tell you which side the peak is on. Here a single `guess` already tells you the side, so halving is better.

#### Can any method beat ⌊log2 n⌋ + 1 calls?

**What they are testing:** whether "O(log n)" has a reason behind it.

**How to reason:** count how many picks a strategy with k calls can tell apart.

**What I say:** "No. With k calls I can identify at most 2^k − 1 picks: the first answer either finishes (one pick) or sends me left or right with k − 1 calls left, so P(k) = 1 + 2 P(k − 1), which is 2^k − 1. To cover n picks I need k ≥ log2(n + 1), which is 31 for the largest n, and binary search achieves exactly that."

**Nuance:** this is the worst case. The average number of calls is a little lower, because some picks are found early.

## 10. Follow-up questions the interviewer might ask

**"What if there is no upper bound n?"**
Probe 1, 2, 4, 8, … until `guess` says the pick is lower, then binary search between the last two probes. That is about 2 log2(pick) calls, O(log pick). Doubling must stop before passing 2^31 − 1 (or use `long`), or the probe itself overflows.

**"What if `guess` only says 'too high' or 'not too high'?"**
Then equality is not reported, and the loop becomes a lower-bound search: find the smallest number x with "x ≥ pick", using `hi = mid` on "not too low" and `lo = mid + 1` otherwise, as in [[nc-search-insert-position|Search Insert Position]]. It needs ⌈log2 n⌉ calls and never needs to confirm the final number.

**"What if a wrong guess costs you its value, and you want to minimise the worst-case total cost?"**
That is a different problem (LeetCode's "Guess Number Higher or Lower II"): the middle is no longer the best split, and the answer comes from dynamic programming over ranges, O(n^3) time for the straightforward version.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Reading the sign of `guess` from your own point of view.** −1 means your number is higher than the pick, so the search goes down.
- **Thinking ternary search is faster because it cuts into more pieces.** Count calls: 39 against 31 for the largest n.
- **Saying the overflow cannot happen because `n` is an `int`.** Each of `lo` and `hi` fits; their sum does not.

### Implementation mistakes

> [!MISTAKE] `int mid = (lo + hi) / 2`
> With n = pick = 2,147,483,647, the first midpoint is −1,073,741,824, the range grows instead of shrinking, and the search cycles forever. A run with a 100-call limit stops with the last guess at −715,827,883.

> [!MISTAKE] Swapping the meaning of −1 and 1
> With n = 10 and pick 6, `guess(5)` returns 1 but the code moves `hi` down to 4; the range then holds only numbers below the pick, empties after two more calls, and the method falls through to `return -1`.

- **Calling `guess(mid)` once per `if`.** It is correct but doubles the calls, which matters when the cost being judged is the number of calls.
- **Forgetting the unreachable `return` after the loop.** Java rejects a non-void method whose loop might end without returning.

## 12. Pattern recognition

**The pattern:** binary search over a range of values instead of array indices, driven by a comparison oracle.

**Signals in the problem statement:**

- A hidden value and an oracle that answers "higher / lower / equal".
- A range that is too large to scan, here up to 2^31 − 1.
- Values near the top of the `int` range, which is where midpoint overflow lives.

**Related problems in this list:**

- [[nc-binary-search|Binary Search]]: the same closed-range loop on an array, where `(lo + hi) / 2` happens to be safe.
- [[nc-search-insert-position|Search Insert Position]]: the half-open lower-bound loop, used when equality is not the stopping rule.
- [[nc-sqrt-x|Sqrt(x)]]: a search over values up to 2^31 − 1 where both the midpoint and `mid * mid` can overflow.
- [[nc-find-in-mountain-array|Find in Mountain Array]]: another interactive problem with a limit on the number of calls, where counting calls decides the design.
- [[nc-koko-eating-bananas|Koko Eating Bananas]]: binary search over candidate answers, with an overflow trap in the cost function.

**Takeaway:** when the search range is values rather than indices, compute the midpoint as `lo + (hi − lo) / 2`, and count calls, not rounds.

## 13. 60-second revision card

**Key insight:** each `guess` tells you which side the pick is on, so guessing the middle halves the candidates.

**Invariant:** the pick is in the closed range `[lo, hi]`.

**Complexity:** at most ⌊log2 n⌋ + 1 calls (31 for n = 2^31 − 1), which is optimal; O(1) space. Ternary search: about 2 log3 n calls, 39 for the largest n.

**Code skeleton:**

```java title="Guess the number, closed range"
public class Solution extends GuessGame {
    public int guessNumber(int n) {
        int lo = 1, hi = n;                        // the pick is in [lo, hi]
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;          // never (lo + hi) / 2: n can be 2^31 - 1
            int answer = guess(mid);
            if (answer == 0) return mid;
            if (answer == -1) hi = mid - 1; else lo = mid + 1;
        }
        return -1;
    }
}
```

**Main traps:**

- `(lo + hi) / 2` overflows once n ≥ 2^30; n = pick = 2^31 − 1 breaks it on the first call.
- −1 means your guess is too high.
- Ternary search makes more calls, not fewer.

**What to say in one breath:** "The pick is always in `[lo, hi]`; I guess the middle, computed as `lo + (hi − lo) / 2` because `lo + hi` can overflow for n near 2^31. Minus one moves `hi` below the middle, one moves `lo` above it, so the range halves each call: at most 31 calls, which is the minimum possible."
