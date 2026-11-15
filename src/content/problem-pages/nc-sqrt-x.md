---
problemId: nc-sqrt-x
title: Sqrt(x)
source: neetcode
sourceUrl: https://leetcode.com/problems/sqrtx/
difficulty: easy
patterns: [binary-search, mathematics]
relatedLessons: [a3-binary-search, a3-binary-search-on-answer, a1-java-syntax-competitive, a14-edge-cases, a14-manual-testing]
companies: []
timeToSolve: 12
---

## 1. Problem restatement

You get a non-negative integer `x`. Return the largest integer whose square is at most `x`, which is the square root of `x` rounded down. You may not use a built-in exponent function or operator to do it.

**Example 1**

- Input: `x = 8`
- Output: `2`
- Why: 2² = 4 ≤ 8, but 3² = 9 > 8. The real square root is about 2.83, and rounding down gives 2.

**Example 2**

- Input: `x = 16`
- Output: `4`
- Why: 4² = 16 exactly, so 4 itself qualifies, and 5² = 25 is too big.

**What the problem statement guarantees**

- 0 ≤ `x` ≤ 2^31 − 1, so `x` is any non-negative `int`, including `Integer.MAX_VALUE` = 2,147,483,647.
- The answer is rounded down and returned as an integer.
- No built-in exponent function or operator (the statement's examples are `pow(x, 0.5)` in C++ and `x ** 0.5` in Python).

## 2. Practice first: try it before reading on

The idea is short; the traps are in the arithmetic. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 12 minutes and talk out loud.
2. Write down the answer for x = 0, 1, 2, 3, 4, 8, 15, 16 before writing any code.
3. Say the simplest correct method and count how many steps it takes for the largest allowed `x`.
4. Before you run your code in your head, ask of every multiplication: what is the largest value it can produce, and does that fit in an `int`?
5. Trace your code on x = 0, x = 1 and x = 2,147,483,647.

> [!HINT] Hint 1: a small nudge
> Try candidates 0, 1, 2, 3, … and check each one's square against `x`. When do you stop, and which candidate do you return? Now: is there a faster way to find the point where "square ≤ x" stops being true?

> [!HINT] Hint 2: the kind of tool you need
> The question "is m² ≤ x?" is yes for every m up to the answer and no for every m after it. A yes/no question that flips once along a range of integers can be answered with far fewer than one check per integer.

> [!HINT] Hint 3: almost the whole plan
> Search m in `[0, x]`: if m² ≤ x, the answer is m or larger; otherwise it is smaller than m. Keep the range shrinking until it is empty and work out which end holds the answer then. Before you write `mid * mid`, compute it for mid = 46,341.

**Check yourself before revealing the walkthrough**

- [ ] My code returns 0, 1, 1, 1, 2, 2, 3, 4 for x = 0, 1, 2, 3, 4, 8, 15, 16
- [ ] It returns 46,340 for x = 2,147,483,647, and it terminates on that input
- [ ] I can say what is true about my search range before every iteration
- [ ] I know the largest product my code computes and why it cannot overflow

## 3. Interview script: understand the problem (≈1 min)

**Me:** So for a non-negative `x` I return ⌊√x⌋, the largest integer whose square doesn't exceed `x`. 8 gives 2, 16 gives 4. Right?

**Interviewer:** Right.

**Me:** And no library square root. Is `Math.sqrt` off the table too, or only `pow`?

**Interviewer:** Off the table. I want to see you compute it.

**Me:** Fine. The range of `x` is all non-negative `int`s, up to 2^31 − 1. So the answer is at most 46,340, since 46,340² = 2,147,395,600 fits and 46,341² = 2,147,488,281 does not. That second number is just above `Integer.MAX_VALUE`, which tells me any `int` product of a candidate with itself can overflow. I'll keep that in mind for every multiplication.

**Me:** By hand on 8: 2² = 4 fits, 3² = 9 doesn't, so 2.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 0 ≤ x ≤ 2^31 − 1 | x = 0 and x = 1 must work (they are their own roots). The answer is at most 46,340. A candidate above 46,340 squared in `int` arithmetic overflows. |
| Return ⌊√x⌋ | The answer is the last integer m with m² ≤ x: a "last yes" search, not an exact match. |
| No built-in exponent function or operator | I compute the root with integer arithmetic only. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| `Math.sqrt` is excluded too | The statement names exponent functions; `Math.sqrt` is not one, but it does the whole job, so I asked. Section 9 covers why even a permitted floating-point root needs care. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| `long` arithmetic is allowed | It is plain integer arithmetic, not an exponent function, and it makes the square check exact. |

### Edge cases I will keep in mind

- x = 0 and x = 1.
- Perfect squares (16) and their neighbours (15, 17): the answer changes exactly at a square.
- x = 2^31 − 1, the largest input, where overflow and termination bugs show up.
- x = 46,340² = 2,147,395,600 and the values around it, the largest perfect square in range.

## 4. Think out loud: from first idea to best solution

Throughout, x is the input and r = ⌊√x⌋ is the answer, so r² ≤ x < (r + 1)².

### Approach 1: Count upwards

#### What I say out loud

> "The certainly-correct version: start at 0 and keep stepping up while the next number's square still fits. When it doesn't, the current number is the answer. The answer is at most 46,340, so this takes at most 46,341 checks. That's fast in absolute terms, but it is O(√x), and I think I can do it in about 31 steps."

#### Intuition

The squares 0, 1, 4, 9, … increase, so the answer is the last one before they pass `x`. Walking up finds it.

#### Algorithm

1. `i = 0`.
2. While `(i + 1)²` ≤ x, increment `i`. Compute the square in `long`.
3. Return `i`.

#### Why it is correct

Before every check, i² ≤ x (true for i = 0, and `i` only grows after confirming `(i + 1)² ≤ x`). The loop stops at the first `i` with `(i + 1)² > x`, so i² ≤ x < (i + 1)², which is the definition of r. It terminates because `i` grows by 1 per step and can never exceed r.

#### Dry run

x = 8: 1² = 1 ≤ 8, i = 1; 2² = 4 ≤ 8, i = 2; 3² = 9 > 8, stop. Returns 2 after three checks.

#### Java code

```java title="Approach 1: count upwards"
class Solution {
    public int mySqrt(int x) {
        long i = 0;
        while ((i + 1) * (i + 1) <= x) {   // long: (46,341)^2 does not fit in an int
            i++;
        }
        return (int) i;
    }
}
```

`i` is a `long` because the last check computes 46,341² = 2,147,488,281 when x = 2^31 − 1, one step past the `int` range.

#### Time complexity

**O(√x)**: r + 1 checks, each O(1). For x = 2^31 − 1 that is 46,341 checks (I counted them).

#### Space complexity

**O(1)** auxiliary space.

#### The bridge to the next approach

> "Each check answers one yes/no question: is m² ≤ x? And the answers are yes, yes, …, yes, no, no, …: once a square is too big, every larger one is too. A yes/no question that flips once over a range of integers is what binary search finds, in about log₂ of the range size steps. The range is 0 to x, so about 31 steps instead of 46,341."

### Approach 2: Binary search on the answer (recommended)

#### What I say out loud

> "I'll keep a closed range `[lo, hi]` of candidates I haven't decided yet. Everything below `lo` is known to have a square at most x, and everything above `hi` is known to have a square bigger than x. I start with `lo = 0`, `hi = x`. At the middle: if mid² ≤ x, mid and everything below it are 'yes', so `lo = mid + 1`; otherwise mid and everything above are 'no', so `hi = mid − 1`. When the range is empty, `hi` is the last yes, which is the answer."

> "The one line to be careful with is `mid * mid`. With `hi = x`, the first mid is about 10^9, and its square doesn't fit in an `int`. I'll compute it as a `long`; the largest product is under 2^62, nowhere near the `long` limit."

#### Intuition

This is [[a3-binary-search-on-answer|binary search on the answer]]: the candidates 0 to x are ordered, the test "m² ≤ x" is monotone, and the answer is the boundary between yes and no. The loop is the closed-range loop from [[nc-binary-search|Binary Search]], with "found" replaced by "move past mid".

#### Algorithm

1. `lo = 0`, `hi = x`.
2. While `lo <= hi`:
3. `mid = lo + (hi − lo) / 2`.
4. If `(long) mid * mid <= x`, set `lo = mid + 1`; otherwise set `hi = mid − 1`.
5. Return `hi`.

#### Why it is correct

**The invariant:** before every iteration, every integer m with 0 ≤ m < `lo` has m² ≤ x, and every integer m with `hi` < m ≤ x has m² > x.

- **Start.** `lo = 0`: there is nothing below it. `hi = x`: there is nothing between x and x. The invariant holds.
- **Loop condition `lo <= hi`.** The undecided candidates are exactly `[lo, hi]`, which is non-empty when `lo <= hi`. The loop runs until every candidate is decided.
- **Update on yes.** If mid² ≤ x, then every m ≤ mid also has m² ≤ mid² ≤ x (squares grow for non-negative m), so `lo = mid + 1` keeps the first half of the invariant.
- **Update on no.** If mid² > x, every m ≥ mid also has m² > x, so `hi = mid − 1` keeps the second half.
- **Termination.** `lo ≤ mid ≤ hi`, and each update moves `lo` above `mid` or `hi` below it, so the range loses at least one candidate (in fact about half) per iteration.
- **The result.** At the end `lo = hi + 1`. By the invariant, `hi` = `lo − 1` has a square at most x (if `hi` ≥ 0), and `hi + 1` = `lo` has a square above x (if `lo` ≤ x). That is r² ≤ x < (r + 1)² with r = `hi`. The edge cases fit too: `hi` cannot end at −1, because m = 0 always passes the test (0 ≤ x) and so `lo` moves past it; and if `lo` ends at x + 1, then `hi` = x, which happens exactly for x = 0 and x = 1, where the answer is x.

**The 25-second version to say to the interviewer:**

> "Below `lo`, every square fits; above `hi`, none do. I start at 0 and x, loop while the undecided range `[lo, hi]` is non-empty, and move past `mid` on whichever side the test decides, because squares are monotone. Each step shrinks the range, and when it's empty, `hi` is the last number whose square fits. I compute the square in `long` since `mid` can be about 10^9."

#### Dry run

x = 8:

| lo | hi | mid | mid² | ≤ 8? | Action |
|---|---|---|---|---|---|
| 0 | 8 | 4 | 16 | no | `hi = 3` |
| 0 | 3 | 1 | 1 | yes | `lo = 2` |
| 2 | 3 | 2 | 4 | yes | `lo = 3` |
| 3 | 3 | 3 | 9 | no | `hi = 2` |
| 3 | 2 | | | empty | return 2 |

x = 16 (a perfect square, where `mid² == x` must count as yes):

| lo | hi | mid | mid² | ≤ 16? | Action |
|---|---|---|---|---|---|
| 0 | 16 | 8 | 64 | no | `hi = 7` |
| 0 | 7 | 3 | 9 | yes | `lo = 4` |
| 4 | 7 | 5 | 25 | no | `hi = 4` |
| 4 | 4 | 4 | 16 | yes | `lo = 5` |
| 5 | 4 | | | empty | return 4 |

#### Java code

```java title="Approach 2: binary search on the answer (recommended)"
class Solution {
    public int mySqrt(int x) {
        int lo = 0;
        int hi = x;        // invariant: squares of [0, lo) are <= x; squares of (hi, x] are > x
        while (lo <= hi) {                       // [lo, hi] still undecided
            int mid = lo + (hi - lo) / 2;
            if ((long) mid * mid <= x) {         // long: mid can be about 10^9
                lo = mid + 1;                    // mid and everything below it fit
            } else {
                hi = mid - 1;                    // mid and everything above it are too big
            }
        }
        return hi;                               // the last value whose square fits
    }
}
```

**Why `long` and not `mid <= x / mid`.** Both avoid overflow. The division form keeps everything in `int`, and for positive integers `mid <= x / mid` is equivalent to mid² ≤ x (because `mid` is an integer, mid ≤ x / mid in real numbers exactly when mid ≤ ⌊x / mid⌋). But it divides by `mid`, and with `lo = 0` the first `mid` is 0 when x is 0 or 1, which throws `ArithmeticException`. So the division form needs `lo = 1` plus a special case for x = 0, and an equivalence argument. The `long` form is exact by inspection: `mid` ≤ 2^31 − 1, so the product is below 2^62, and a `long` holds up to about 9.2 × 10^18. I pick `long` because it has fewer things to explain and get wrong.

**About `lo + (hi − lo) / 2`.** Here it matters more than in [[nc-binary-search|Binary Search]]: `hi` starts at up to 2^31 − 1, so `lo + hi` could exceed the `int` range if `lo` were large at the same time. (In this particular search `lo` only grows once `mid` is at most 46,340, by which time `hi` is small, but the offset form makes that argument unnecessary.)

#### Time complexity

**O(log x)**: the range starts with x + 1 candidates and at least halves each iteration, so there are at most ⌊log₂(x + 1)⌋ + 1 iterations. For x = 2^31 − 1 that is 31 (I counted them). Each iteration is O(1).

#### Space complexity

**O(1)** auxiliary space.

### Alternative: Newton's method in integers

Newton's method for f(r) = r² − x gives the update r ← (r + x / r) / 2. In integers, with `/` rounding down, it has a clean stopping rule:

```java title="Alternative: integer Newton's method"
class Solution {
    public int mySqrt(int x) {
        if (x < 2) {
            return x;                  // 0 and 1 are their own roots; also avoids x / 0
        }
        long r = x;                    // any start >= the answer works
        while (r > x / r) {            // r > x / r  <=>  r^2 > x, for integers r >= 1
            r = (r + x / r) / 2;       // long: r + x / r is 2^31 when x = 2^31 - 1
        }
        return (int) r;
    }
}
```

**Why it stops at exactly ⌊√x⌋.** Two facts about one step from an integer r ≥ 1:

- **It never goes below the answer.** ⌊(r + ⌊x / r⌋) / 2⌋ equals ⌊(r + x / r) / 2⌋ (adding an integer before halving does not change where the floor lands), and (r + x / r) / 2 ≥ √x by the inequality between the arithmetic and geometric means. So the new r is at least ⌊√x⌋.
- **It strictly decreases while r is too big.** If r² > x, then x / r < r, so (r + x / r) / 2 < r.

Starting from r = x ≥ ⌊√x⌋, the sequence stays at or above r and decreases strictly while r² > x, so it must reach a value with r² ≤ x, and the only such value at or above ⌊√x⌋ is ⌊√x⌋ itself. The condition `r > x / r` is the overflow-free way to say r² > x. A stopping rule such as "stop when r stops changing" is wrong here: for x = 8 the sequence goes 8, 4, 3, 2, 3, 2, … and never settles, because from 2 the update gives (2 + 4) / 2 = 3 and from 3 it gives (3 + 2) / 2 = 2. Integer Newton alternates like this whenever x + 1 is a perfect square, so the stopping test must be r² ≤ x, not "no change".

**Cost.** From r = x the first steps roughly halve r, then convergence becomes quadratic: for x = 2^31 − 1 the sequence is 1073741824, 536870912, …, 52162, 46665, 46342, 46340, which is 19 steps. That is fewer iterations than binary search's 31, at the cost of a division per step and a subtler correctness argument.

**The overflow in it.** With `int r`, the very first step computes `x + x / x` = x + 1, which overflows for x = 2^31 − 1 alone: the method then returns −1,073,741,824 (I ran it). Using `long r` fixes it.

## 5. Comparison table

x = the input; r = ⌊√x⌋ ≤ 46,340. Nothing is randomized, so expected and worst case coincide.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Count upwards | O(√x) | O(√x), 46,341 checks | O(1) |
| 2. Binary search | O(log x) | O(log x), 31 iterations | O(1) |
| Alt. Integer Newton | O(log x) | O(log x), 19 iterations at x = 2^31 − 1 | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Count upwards | Correct by inspection | O(√x) | As the baseline sentence |
| 2. Binary search | Standard loop, simple invariant, easy to adapt to "last m with f(m) ≤ x" for other monotone f | One overflow trap to handle | The answer |
| Alt. Integer Newton | Fewer iterations | Needs the AM-GM argument and the right stopping rule; same overflow trap | If the interviewer asks for something faster than binary search, or knows numerical methods |

## 6. Which solution to give, and when to stop optimizing

Give Approach 2. It reuses the closed-range loop everyone expects you to know, and its correctness argument is three lines. Mention Newton's method as an option with fewer iterations, but do not lead with it: its stopping rule and lower-bound argument are where people go wrong, and 31 iterations versus 19 is not a difference anyone will feel. Stop once the overflow is handled and the edge cases x = 0, 1 and 2^31 − 1 are traced; tightening `hi` to `min(x, 46340)` saves about 15 iterations and adds a magic number.

## 7. Interview script: code it and test it

### What I say while coding

> "`lo = 0`, `hi = x`, closed range. The invariant: squares below `lo` fit, squares above `hi` don't."

> "`mid` with the offset form, because `hi` can be 2^31 − 1."

> "The test is `(long) mid * mid <= x`. The cast has to be on an operand, not on the result: `(long) (mid * mid)` would overflow first and widen the wrong value."

> "Yes moves `lo` past `mid`, no moves `hi` below it. I return `hi`, the last yes."

### Testing out loud

**Normal case:** x = 8 returns 2 (first table).

**Perfect square:** x = 16 returns 4 (second table); the `<=` makes 4² = 16 a yes.

**x = 0:** `lo = hi = 0`, mid 0, 0 ≤ 0 yes, `lo = 1`; returns `hi = 0`.

**x = 1:** mid 0 yes, `lo = 1`; mid 1, 1 ≤ 1 yes, `lo = 2`; returns `hi = 1`.

**Largest input:** x = 2^31 − 1. The first mid is 1,073,741,823; its square in `long` is about 1.15 × 10^18, more than x, so `hi` drops. 31 iterations later it returns 46,340, and 46,341² = 2,147,488,281 > x confirms it.

**Largest perfect square:** x = 2,147,395,600 = 46,340² returns 46,340; x − 1 returns 46,339.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1 min | Range of x, rounding down, `Math.sqrt` excluded, the 46,340 bound |
| Baseline | 30 s | Count upwards, O(√x) |
| Invariant and code | 3–4 min | Approach 2 with the `long` square |
| Trace | 2–3 min | 8, 16, 0, 1, 2^31 − 1 |
| Follow-ups | rest | Newton, overflow, other roots |

Most of the value is in the overflow reasoning and the boundary traces. If you freeze, compute 46,341² out loud: it shows you know where the trap is.

## 9. Interviewer challenges

### About overflow

#### What goes wrong with `if (mid * mid <= x)` in `int`?

**What they are testing:** whether you can show the bug concretely rather than just say "overflow".

**How to reason:** find the first input where `mid` exceeds 46,340, and follow the wrapped value.

**What I say:** "Once `mid` is above 46,340, `mid * mid` wraps around. For x = 92,682, the first `mid` is 46,341, and 46,341² = 2,147,488,281 wraps to −2,147,479,015, which is less than x, so the search thinks 46,341 fits and moves right, away from the answer. It returns 65,536 instead of 304. For x = 2^31 − 1 it never finishes: `lo` eventually wraps around to a negative number and the loop keeps going. Small tests pass, which is what makes this bug dangerous."

**Nuance:** I ran both, and checked every smaller x: 92,682 is the smallest input where the `int` version gives a wrong answer. For 2^31 − 1 it was still looping after 10^8 iterations with `lo` negative. `(long) (mid * mid)` has the same bug, because the multiplication happens in `int` before the cast.

#### Why not use `Math.sqrt`, and if it were allowed, is `(int) Math.sqrt(x)` safe?

**What they are testing:** whether you understand the rule and floating-point rounding, not just the integer trick.

**How to reason:** separate the rule (the problem wants you to compute the root) from the numerics (what a `double` result can do).

**What I say:** "The statement bans exponent functions like `pow(x, 0.5)`. `Math.sqrt` isn't literally one, but it does the entire job, so it defeats the exercise, and the interviewer excluded it. If it were allowed, I'd still be careful: a floating-point root can land just above or below an integer, and truncating then gives an off-by-one. For `int` input it happens to be safe: the Java documentation says `Math.sqrt` returns the `double` closest to the true root, every `int` is exactly representable as a `double`, and near the answer the root is at least about 10^−5 away from the next integer, far more than the rounding error of about 10^−11. For `long` input it breaks: x = 9,007,199,136,250,224 is 94,906,265² − 1, so the answer is 94,906,264, but `(long) Math.sqrt(x)` gives 94,906,265, because x is above 2^53 and is rounded when converted to `double`."

**Nuance:** `Math.pow(x, 0.5)` is weaker still: its documentation only promises a result within 1 ulp of the exact value, so on a perfect square it is not guaranteed to land on the integer (on the JDK I ran, no perfect square up to 46,340² failed, but that is not a promise). The robust pattern, if floating point is ever used, is to take the estimate and correct it with integer checks: decrease while r² > x, increase while (r + 1)² ≤ x.

### About the search

#### Why return `hi` and not `lo` or `mid`?

**What they are testing:** whether you know what each variable means when the loop ends.

**How to reason:** read the invariant with `lo = hi + 1`.

**What I say:** "When the loop ends, `lo` is one past `hi`. Everything below `lo` fits, so `hi` fits; everything above `hi` doesn't, so `lo` doesn't. `hi` is the last value that fits, which is the answer. `lo` is the first that doesn't, one too big. `mid` is whatever was tested last, which might have been either."

**Nuance:** a common alternative keeps an `ans` variable updated on every yes. It is equivalent; returning `hi` just uses what the invariant already gives you.

#### Is O(log x) the best possible?

**What they are testing:** whether you know where the bound comes from.

**How to reason:** binary search finds one of up to 46,341 possible answers with yes/no questions.

**What I say:** "For methods that only ask 'is m² ≤ x?', yes. Each answer at best halves the set of possible results, and there are 46,341 possible results, so in the worst case about ⌈log₂ 46,341⌉ = 16 questions are needed. Binary search over `[0, 46340]` would meet that exactly; with `hi = x` I use up to 31, the same order. Newton's method asks a different kind of question, it computes `x / r`, so that bound doesn't apply to it, and it converges quadratically once it is close."

**Nuance:** with 32-bit input every method here runs a bounded number of steps, so O(log x) is the right language only when you think of x as unbounded.

## 10. Follow-up questions the interviewer might ask

**"Return the square root to 5 decimal places."**
Binary search on `double` values in `[0, max(1, x)]`, stopping when the range is narrower than the tolerance (or after a fixed 100 halvings, which is more than `double` precision can use), or Newton's method on `double`s until the change is below the tolerance. Either way, say how you round the last digit.

**"What about the cube root, or the k-th root?"**
The same binary search: find the last m with m^k ≤ x. Compute m^k by repeated multiplication with an early exit as soon as the product exceeds x, so it never overflows. O(k log x).

**"x can be any `long`."**
`(long) mid * mid` can now overflow. Use `mid <= x / mid` (with `lo = 1` and x = 0 handled), or cap `hi` at 3,037,000,499 = ⌊√(2^63 − 1)⌋ so the product fits. As shown in section 9, `Math.sqrt` is no longer safe there either.

**"Is a given number a perfect square?"**
Compute r with this method and check r · r == x in `long`. That is LeetCode's Valid Perfect Square (not in this list); it works for every `int` input.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Searching for an exact match.** Most `x` are not perfect squares, so "find m with m² == x" finds nothing. The target is the last yes of a monotone test.
- **Assuming the answer is in `[0, x / 2]` without checking small cases.** It holds for x ≥ 2, but x = 1 gives `hi = 0` and returns 0 instead of 1.
- **Saying "overflow" without a number.** Say where it starts: any square of a value above 46,340.

### Implementation mistakes

> [!MISTAKE] `mid * mid` in `int`
> For x = 92,682 it returns 65,536 instead of 304, and for x = 2^31 − 1 it never terminates. Write `(long) mid * mid`, with the cast on the operand.

> [!MISTAKE] Integer Newton with an `int` running value
> `r + x / r` is x + 1 on the first step, which overflows for x = 2^31 − 1 and returns −1,073,741,824. Keep `r` in a `long`.

- **Dividing by zero in the division form.** `mid <= x / mid` with `lo = 0` throws for x = 0 and x = 1.
- **`lo = mid` on a yes in the closed-range loop.** With `mid == lo` the range stops shrinking: x = 1 loops forever at `lo = 0, hi = 1, mid = 0`.
- **Returning `lo`.** It is one past the answer.

## 12. Pattern recognition

**The pattern:** binary search over candidate answers for the last value where a monotone test is true.

**Signals in the problem statement:**

- "Largest integer such that …" or "rounded down".
- A test on a candidate that is easy to compute and changes once as the candidate grows (here m² ≤ x).
- A value range too large to scan comfortably, and no array to search.

**Related problems in this list:**

- [[nc-binary-search|Binary Search]]: the same closed-range loop over array indices.
- [[nc-search-insert-position|Search Insert Position]]: another boundary search, for the first index whose value is at least the target.
- [[nc-guess-number-higher-or-lower|Guess Number Higher or Lower]]: binary search over `[1, 2^31 − 1]`, where the midpoint overflow is the trap.
- [[nc-koko-eating-bananas|Koko Eating Bananas]]: binary search on the answer with a more expensive monotone test.
- [[nc-capacity-to-ship-packages-within-d-days|Capacity to Ship Packages Within D Days]]: the same shape, "smallest value that works".

**Takeaway:** when the answer is a number and you can test a candidate, binary search the candidates, state what is known below `lo` and above `hi`, and compute every product with its largest possible value in mind.

## 13. 60-second revision card

**Key insight:** "m² ≤ x" is yes up to ⌊√x⌋ and no after it; binary search finds that boundary.

**Invariant:** squares of everything below `lo` are ≤ x; squares of everything above `hi` are > x. When `lo > hi`, `hi` is the answer.

**Complexity:** O(log x) time, 31 iterations at most; O(1) space. Counting up is O(√x), 46,341 checks; integer Newton takes 19 steps at x = 2^31 − 1.

**Code skeleton:**

```java title="Sqrt(x), binary search" fragment="public int mySqrt(int x)"
int lo = 0, hi = x;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if ((long) mid * mid <= x) lo = mid + 1; else hi = mid - 1;
}
return hi;
```

**Main traps:**

- `mid * mid` in `int` overflows above 46,340: x = 92,682 returns 65,536.
- Cast the operand, `(long) mid * mid`, not the product.
- Return `hi`, not `lo`.
- x = 0 and x = 1.

**What to say in one breath:** "Squares are monotone, so I binary search the last m with m² ≤ x over `[0, x]`. Below `lo` everything fits, above `hi` nothing does, so when the range empties `hi` is the answer. I square in `long`, because 46,341² is already past `Integer.MAX_VALUE`. That's 31 iterations and constant space."
