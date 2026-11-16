---
problemId: nc-happy-number
title: Happy Number
source: neetcode
sourceUrl: https://leetcode.com/problems/happy-number/
difficulty: easy
patterns: [math-geometry, hashing, fast-slow-pointers]
relatedLessons: [a4-cycle-detection, a4-fast-slow-pointers, a2-hashing, a14-edge-cases]
companies: []
timeToSolve: 12
---

## 1. Problem restatement

Start from a positive integer `n` and repeatedly replace it with the sum of the squares of its decimal digits. If this process eventually reaches 1, `n` is happy: return `true`. If it never reaches 1, return `false`. The statement says that a sequence which does not reach 1 "loops endlessly in a cycle".

**Example 1**

- Input: `n = 19`
- Output: `true`
- Why: 1² + 9² = 82, 8² + 2² = 68, 6² + 8² = 100, 1² + 0² + 0² = 1.

**Example 2**

- Input: `n = 2`
- Output: `false`
- Why: 2 → 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4, and 4 has been seen before, so from here the same eight numbers repeat forever without ever reaching 1.

**What the problem statement guarantees**

- 1 ≤ `n` ≤ 2^31 − 1, so `n` is any positive Java `int`.
- Once the process reaches 1 it stays there (1² = 1).
- The process either reaches 1 or loops in a cycle that does not include 1.

## 2. Practice first: try it before reading on

The computation is two lines. The question is how a program can know that "never" has happened. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 12 minutes and talk out loud.
2. By hand, run the process from 7 and from 4. Write down every number you see.
3. Before you code, answer: how do you decide to stop when the answer is `false`?
4. Then answer a harder question: why must the process ever repeat at all? Could a sequence wander through larger and larger numbers forever?
5. Write a solution, then try for one that keeps only a constant number of variables.

> [!HINT] Hint 1: a small nudge
> If the process does not reach 1, it goes on forever, yet every number it produces depends only on the one before. What happens the first time it produces a number it has already produced?

> [!HINT] Hint 2: the kind of tool you need
> You need to notice that a sequence has come back to a value it visited before. Either remember the values you have seen, or use the trick for detecting a loop in a chain where each element points to the next, without remembering anything.

> [!HINT] Hint 3: almost the whole plan
> Keep a set of values seen; stop at 1 (happy) or at a value already in the set (not happy). For constant space, run two copies of the sequence, one taking one step at a time and one taking two: if there is a loop that avoids 1, the fast one catches the slow one inside it. To trust either, show that a number with four or more digits always maps to a smaller number.

**Check yourself before revealing the walkthrough**

- [ ] My code returns `true` for 1, 7, 10, 19 and 100, and `false` for 2, 3, 4 and 2,147,483,647
- [ ] I can explain why the loop always ends, not just that it did on my examples
- [ ] I can give a number that bounds every value after the first step
- [ ] I know how much memory my solution uses, and why

## 3. Interview script: understand the problem (≈1 min)

**Me:** I keep replacing n by the sum of its digits squared. If I hit 1, return true. Otherwise the statement says it cycles, and I return false. 19 goes 82, 68, 100, 1, so true.

**Interviewer:** Right.

**Me:** By hand on 2: 4, 16, 37, 58, 89, 145, 42, 20, 4. 4 again. The next value depends only on the current one, so from here it repeats those eight numbers forever. So "not happy" means "came back to a value I've already seen without passing 1".

**Me:** The statement promises the cycle, but I'd like to know why, because my loop's termination depends on it. A ten-digit number maps to at most 10 · 81 = 810. So the values collapse fast: after one step everything is three digits at most. I'll make that precise when I argue correctness.

**Interviewer:** Fine. Any memory constraints?

**Me:** None stated. I'll start with a set of seen values, then show a constant-space version.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 2^31 − 1 | n is positive, so the digit loop `while (n > 0)` is safe and no value is ever 0. The first step can see up to ten digits; afterwards every value is small (at most 730, then at most 243). |
| 1 is a fixed point | Reaching 1 means the sequence is 1 forever. Floyd's method can detect happiness as "the cycle it found is {1}". |
| Not happy means it cycles | The stopping condition for `false` is a repeated value. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| No memory limit given | The `HashSet` version is acceptable; constant space is a follow-up. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| Digits are decimal | The statement says "its digits"; another base changes the numbers and the cycles. |

### Edge cases I will keep in mind

- n = 1: already happy, zero steps.
- n = 4: starts inside the unhappy cycle.
- Powers of ten (10, 100, 1,000,000,000): one step to 1.
- n = 2,147,483,647: the largest input, ten digits on the first step only.

## 4. Think out loud: from first idea to best solution

Throughout, next(m) is the sum of the squares of m's decimal digits, and the sequence is n, next(n), next(next(n)), …

**First, why the sequence must repeat.** A number m with d digits has next(m) ≤ 81d, because each digit contributes at most 9² = 81. If d ≥ 4, then 81d < 10^(d−1) ≤ m (for d = 4: 324 < 1,000; the left side grows by 81 per digit, the right side tenfold). So **every number with four or more digits maps to a strictly smaller number**, and every number below 1,000 maps to at most 3 · 81 = 243. For this problem's inputs it is sharper: the largest next(m) over all positive `int` m is 730, at 1,999,999,999 (I checked all of them). So the second value is at most 730, and from the third value on, every value lies in 1..243. A sequence confined to 243 values must repeat a value within 244 steps of entering that range, and since each value determines the next, after the first repeat it cycles forever. In practice the sequences are much shorter: over all 2^31 − 1 inputs, the most distinct values any sequence visits before reaching 1 or repeating is 20 (n = 15,999).

### Approach 1: Remember every value seen

#### What I say out loud

> "Simulate, and keep a `HashSet` of the values I've produced. If I reach 1, it's happy. If I'm about to produce a value that's already in the set, the sequence is in a loop that missed 1, so it's not happy. The argument above says this ends within a few hundred steps at worst, and in practice within 20."

#### Intuition

The sequence is deterministic: if a value comes back, everything after it comes back too. So the first repeated value proves a cycle, and 1 being absent so far proves the cycle doesn't contain 1 (if it did, we'd have stopped at 1).

#### Algorithm

1. `seen` = empty set.
2. While n ≠ 1 and `seen.add(n)` succeeds (n was new): n = next(n).
3. Return n == 1.

`next(m)`: sum = 0; while m > 0, take d = m % 10, add d · d, m /= 10.

#### Why it is correct

- **It only says `true` when the sequence reaches 1**, because it returns `n == 1` and n is a value of the sequence.
- **It only says `false` after a repeat.** If the loop stops with n ≠ 1, then `seen.add(n)` failed, so n appeared earlier. From that earlier point the sequence repeats the same values forever, and none of them was 1 (the loop would have stopped there). So it never reaches 1.
- **It terminates**, by the bound above: at most 245 distinct values can appear (n, the second value, and the 243 possible values after that), so a repeat or a 1 must come.

#### Dry run

n = 2:

| n | 1? | In `seen`? | `seen` after |
|---|---|---|---|
| 2 | no | no | {2} |
| 4 | no | no | {2, 4} |
| 16, 37, 58, 89, 145, 42, 20 | no | no | {2, 4, 16, 37, 58, 89, 145, 42, 20} |
| 4 | no | yes | stop, return `false` |

n = 19: 19, 82, 68, 100 are added; then n = 1, the loop stops, returns `true`.

#### Java code

```java title="Approach 1: HashSet of seen values"
import java.util.HashSet;
import java.util.Set;

class Solution {
    public boolean isHappy(int n) {
        Set<Integer> seen = new HashSet<>();
        while (n != 1 && seen.add(n)) {      // add() is false if n was already there
            n = next(n);
        }
        return n == 1;
    }

    private int next(int n) {
        int sum = 0;
        while (n > 0) {
            int d = n % 10;
            sum += d * d;                    // at most 10 * 81 = 810: no overflow
            n /= 10;
        }
        return sum;
    }
}
```

#### Time complexity

Let D be the number of digits of n (D ≤ 10). The first `next` costs O(D); every later call works on a number of at most three digits, O(1). There are at most 245 calls, and at most 20 for any `int` input. **O(D) = O(log n) expected time**, expected because of the `HashSet` operations (O(1) on average, assuming hash codes spread well, which they do for small `Integer` keys).

#### Space complexity

**O(1)** for this problem's inputs, strictly: the set holds at most 245 values by the argument, and at most 20 in fact. It is still a hash set with boxed `Integer`s, which is what an interviewer means by "can you do it without the set".

#### The bridge to the next approach

> "The set is only there to recognise a loop. But this sequence is a chain where each value points to exactly one next value, which is exactly a linked list that might have a cycle. For linked lists there's a constant-space trick: run a slow pointer one step at a time and a fast one two steps at a time. If there's a cycle, the fast one laps the slow one and they meet. Here 1 is itself a cycle of length one, so I just look at where they meet."

### Approach 2: Floyd's tortoise and hare (recommended final answer)

#### What I say out loud

> "Two runners on the same sequence. `slow` moves one step per round, `fast` two. If the sequence reaches 1, `fast` gets there first and stays. If it falls into a cycle without 1, both runners end up in the cycle, and since `fast` gains one position per round, it lands on `slow` within one lap. I stop when `fast` is 1 or the two meet, and the answer is whether `fast` is 1."

#### Intuition

Once both runners are inside a cycle of length L, the gap from `slow` to `fast` along the cycle shrinks by exactly one each round, so it hits 0 within L rounds. No memory of past values is needed: meeting is the proof of a cycle.

#### Algorithm

1. `slow = n`, `fast = next(n)`.
2. While `fast != 1` and `slow != fast`: `slow = next(slow)`, `fast = next(next(fast))`.
3. Return `fast == 1`.

Starting `fast` one step ahead lets the loop condition `slow != fast` be tested from the first round. Starting both at n would end the loop before it began.

#### Why it is correct

- **Returns `true` only when 1 is reached:** `fast` is always a value of the sequence.
- **Returns `false` only for unhappy n:** if the loop stops with `fast != 1`, then `slow == fast` with `fast` two steps per round ahead, so the sequence returned to a value: it is in a cycle. If that cycle contained 1, it would be the cycle {1} (1 maps to itself), and then `fast` would equal 1. So the cycle avoids 1, and n is not happy.
- **Terminates:** by the bound, the sequence enters a cycle (either {1} or one avoiding 1) after a finite tail. If it is {1}, `fast` reaches 1 no later than when it enters the cycle. Otherwise, once `slow` enters the cycle, `fast` is already in it, and the gap closes by one per round, so they meet within one more lap.

**The cycles that exist.** A cycle cannot contain a number of four or more digits: its largest member M would need a predecessor p with next(p) = M, but p ≤ M ≥ 1,000 gives next(p) < p ≤ M if p has four or more digits, and next(p) ≤ 243 < M otherwise. So every cycle lies in 1..999, and checking all of them shows exactly two: {1} and 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4.

**The 25-second version to say to the interviewer:**

> "Every number with four or more digits maps to a smaller one, and every smaller number maps to at most 243, so the sequence is eventually trapped in a finite range and must cycle. 1 is a cycle of length one. I run a slow and a fast pointer; they're guaranteed to meet inside whatever cycle it is, or fast hits 1 first. The answer is whether that cycle is 1. Constant space."

#### Dry run

n = 2 (the pairs are `slow`, `fast` before each round's test):

| Round | slow | fast | Stop? |
|---|---|---|---|
| start | 2 | 4 | no |
| 1 | 4 | 37 | no |
| 2 | 16 | 89 | no |
| 3 | 37 | 42 | no |
| 4 | 58 | 4 | no |
| 5 | 89 | 37 | no |
| 6 | 145 | 89 | no |
| 7 | 42 | 42 | meet: return `false` |

n = 19: start (19, 82); round 1 (82, 100); round 2 (68, 1): `fast` is 1, return `true`.

#### Java code

```java title="Approach 2: Floyd's tortoise and hare (recommended final answer)"
class Solution {
    public boolean isHappy(int n) {
        int slow = n;
        int fast = next(n);                      // one step ahead, so the loop can start
        while (fast != 1 && slow != fast) {
            slow = next(slow);                   // one step
            fast = next(next(fast));             // two steps
        }
        return fast == 1;                        // met at 1, or met in a cycle without 1
    }

    private int next(int n) {
        int sum = 0;
        while (n > 0) {
            int d = n % 10;
            sum += d * d;
            n /= 10;
        }
        return sum;
    }
}
```

#### Time complexity

**O(log n)**: the first `next` calls cost O(D) and the rest O(1) each, and the number of rounds is bounded by a constant (tail plus one lap, both bounded by the 245-value argument). Measured over all positive `int` inputs, the most rounds any n needs is 15 (n = 6), with three `next` calls per round.

#### Space complexity

**O(1)**: two `int`s.

### Alternative: stop at the known cycle

Because the only unhappy cycle contains 4, `while (n != 1 && n != 4) n = next(n); return n == 1;` is correct for every positive integer: every unhappy sequence enters the cycle 4 → 16 → … → 20 → 4 and so passes through 4.

```java title="Alternative: stop at 1 or 4"
class Solution {
    public boolean isHappy(int n) {
        while (n != 1 && n != 4) {               // every unhappy sequence reaches the cycle through 4
            n = next(n);
        }
        return n == 1;
    }

    private int next(int n) {
        int sum = 0;
        while (n > 0) {
            int d = n % 10;
            sum += d * d;
            n /= 10;
        }
        return sum;
    }
}
```

It is the shortest code and constant space, but its correctness rests on a fact you found by computation (the list of cycles), not one you can derive at the whiteboard. Mention it as "if we can precompute the cycles"; do not lead with it.

## 5. Comparison table

D = the number of decimal digits of n (D ≤ 10). After the first step, every value has at most three digits.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. `HashSet` of seen values | O(D) | O(D) next-steps; each set operation O(1) only on average | O(1) for `int` input: at most 20 entries measured, 245 by the bound |
| 2. Floyd | O(D) | O(D), at most 15 rounds measured | O(1), two `int`s |
| Alt. Stop at 4 | O(D) | O(D) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. `HashSet` | Direct, easy to argue | Allocates boxed `Integer`s; "can you do it without the set?" is the expected follow-up | The first version to code |
| 2. Floyd | Constant space; reuses a standard technique | The start positions and the stop condition are easy to get wrong | The final answer |
| Alt. Stop at 4 | Shortest | Relies on a computed fact | When the interviewer allows precomputed knowledge |

## 6. Which solution to give, and when to stop optimizing

Code Approach 1 first (two minutes), state the bound that makes it terminate, then move to Floyd when asked about space, or offer it yourself. Both are fast: a handful of steps on numbers of at most three digits. The bound argument (four or more digits always shrink) is worth more than any optimization; it is what makes either loop correct, and it is the part most candidates skip. Stop there.

## 7. Interview script: code it and test it

### What I say while coding

> "`next` peels digits with `% 10` and `/ 10`. The sum is at most 810, nowhere near overflow."

> "`seen.add(n)` returns false if n was already there, so it doubles as the membership test."

> "For Floyd I start `fast` one step ahead. If both start at n, `slow != fast` is false immediately and the loop never runs."

### Testing out loud

**Happy:** 19 → 82 → 68 → 100 → 1, `true` in both approaches (Floyd in two rounds).

**Unhappy:** 2: the set version stops when 4 comes back; Floyd meets at 42 after 7 rounds.

**n = 1:** set version: the loop condition `n != 1` fails at once, `true`. Floyd: `fast = next(1) = 1`, the loop doesn't run, `true`.

**n = 4:** set version adds the eight cycle values and stops when 4 returns; Floyd meets inside the cycle; `false`.

**Largest input:** 2,147,483,647 → 260 → 40 → 16 → 37 → …, which enters the 4-cycle at 16; `false`.

**Power of ten:** 100 → 1, `true`.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify and examples | 2 min | 19 and 2 by hand; "not happy" means a repeat |
| The bound | 2 min | Four or more digits shrink; everything ends up in 1..243 |
| Code the set version | 2–3 min | Approach 1 |
| Floyd | 3 min | Approach 2 and why they meet |
| Trace | 2 min | 19, 2, 1 |

If you're stuck on termination, compute next(999,999,999) = 729 out loud: it shows the numbers collapse.

## 9. Interviewer challenges

### About termination

#### How do you know the loop terminates? The statement just asserts that unhappy numbers cycle.

**What they are testing:** whether you can bound the state space instead of trusting the statement.

**How to reason:** compare the largest possible digit-square sum of a d-digit number with the smallest d-digit number.

**What I say:** "A d-digit number maps to at most 81d. For d ≥ 4, 81d is less than 10^(d−1), the smallest d-digit number, so the value shrinks. Below 1,000 it maps to at most 243. So after a few steps every value lies in 1..243, and a deterministic sequence in a finite set must repeat. For `int` input it's even quicker: the first step lands at 730 or below."

**Nuance:** the bound gives at most 245 distinct values; the real maximum over all `int` inputs is 20. Both are constants, which is why the set version is O(1) space for this problem.

#### Why do slow and fast have to meet?

**What they are testing:** whether you understand Floyd's argument rather than reciting it.

**How to reason:** look at the gap between them once both are in the cycle.

**What I say:** "Once `slow` enters the cycle, `fast` is already in it. Each round `fast` moves two and `slow` one, so the distance from `slow` forward to `fast` shrinks by one. It can't skip over zero, because it changes by exactly one, so they meet within one lap. If the cycle is {1}, they meet at 1, and that's the happy case."

**Nuance:** a speed difference of one is what guarantees no skipping. With speeds 1 and 3 the gap shrinks by two per round, so in a cycle of even length with an odd starting gap the pointers would never meet.

### About the implementation

#### What happens if you start both pointers at n?

**What they are testing:** whether you have actually run your Floyd loop.

**How to reason:** evaluate the loop condition on the first round.

**What I say:** "With `slow = fast = n` and `while (slow != fast)`, the condition is false at once, the loop never runs, and the method returns `n == 1`. So 19 returns `false`. Either start `fast` one step ahead, as I did, or use a do-while that moves both before the first comparison."

**Nuance:** I ran it: that version returns `false` for 19 and `true` only for 1.

## 10. Follow-up questions the interviewer might ask

**"Return the length of the cycle, or where it starts."**
With Floyd: after the meeting, move one pointer around until it returns to count the length L; to find the start, put one pointer back at n and advance both one step at a time until they meet. Constant extra space, a constant number of steps for `int` input.

**"Same question in base b, or with cubes instead of squares."**
The method does not change; only the bound does. With cubes, a d-digit number maps to at most 729d, so numbers shrink once 729d < 10^(d−1), from five digits on. Recompute the bound, and the termination argument still holds.

**"Count the happy numbers up to N."**
For any `int`, next(m) ≤ 730, so precompute happiness for 1..730 once (each by either approach); then each query costs one `next` call plus a table lookup. O(N log N) total for the N digit sums.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Not asking why it terminates.** "The statement says it cycles" is accepted, but the bound is what an interviewer is looking for in a strong answer.
- **Thinking the set version needs O(n) or O(log n) memory.** The values are bounded by a constant after one step; the set holds at most 20 values for any `int` input.

### Implementation mistakes

> [!MISTAKE] Both Floyd pointers start at n
> `while (slow != fast)` never runs, and 19 returns `false`. Start `fast` at next(n).

> [!MISTAKE] Precedence in the digit square
> `sum += n % 10 * n % 10` means `((n % 10) * n) % 10`, not d². It returns `false` for 19 and `true` for 3; on 1..1,000 it is wrong for 473 inputs. Put the digit in a variable first.

- **Checking only for 1 and never for a repeat.** The loop runs forever on 2.

## 12. Pattern recognition

**The pattern:** iterate a deterministic function over a finite set of states and detect the first repeated state, with a set or with Floyd's two pointers.

**Signals in the problem statement:**

- "Repeat the process until …, or it loops endlessly."
- Each state determines the next one.
- A reason the states are bounded (here, digit sums collapse large numbers).

**Related problems in this list:**

- [[nc-linked-list-cycle|Linked List Cycle]]: the same two-speed pointers on actual list nodes.
- [[nc-find-the-duplicate-number|Find the Duplicate Number]]: an array read as a function i → nums[i], where Floyd finds the cycle's entrance.
- [[nc-contains-duplicate|Contains Duplicate]]: "have I seen this value?" with a `HashSet`, the building block of Approach 1.
- [[nc-plus-one|Plus One]]: digit-by-digit work on a number, the other half of this problem.

**Takeaway:** when a process "either finishes or loops forever", bound the states, then detect the first repeat; a set is simplest, two pointers at speeds 1 and 2 use constant space.

## 13. 60-second revision card

**Key insight:** numbers with four or more digits shrink under the digit-square sum, so the sequence is trapped in 1..243 and must cycle. Happy means the cycle is {1}.

**Invariant:** `slow` and `fast` are both values of the sequence, `fast` twice as many steps along; inside a cycle the gap shrinks by one per round.

**Complexity:** O(log n) time (only the first step sees up to ten digits); O(1) space for Floyd, and a set of at most 20 values for the set version.

**Code skeleton:**

```java title="Happy Number, Floyd" fragment="public boolean isHappy(int n)"
java.util.function.IntUnaryOperator next = m -> {
    int s = 0;
    for (; m > 0; m /= 10) s += (m % 10) * (m % 10);
    return s;
};
int slow = n, fast = next.applyAsInt(n);
while (fast != 1 && slow != fast) {
    slow = next.applyAsInt(slow);
    fast = next.applyAsInt(next.applyAsInt(fast));
}
return fast == 1;
```

**Main traps:**

- Start `fast` one step ahead of `slow`.
- Stop on `fast == 1` as well as on a meeting.
- `n % 10 * n % 10` is not the digit squared.

**What to say in one breath:** "A number with four or more digits maps to something smaller, so the sequence ends up cycling in 1..243. I detect the cycle with a slow and a fast pointer, which must meet within one lap, and the number is happy exactly when they meet at 1. That's a constant number of steps after the first, and two variables."
