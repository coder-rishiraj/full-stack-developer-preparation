---
problemId: nc-min-stack
title: Min Stack
source: neetcode
sourceUrl: https://leetcode.com/problems/min-stack/
difficulty: medium
patterns: [stack]
relatedLessons: [a5-stack, a5-monotonic-stack, a1-custom-classes, a14-edge-cases, a14-deriving-optimization]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

Build a stack of integers as a class `MinStack` with the usual `push(val)`, `pop()` and `top()`, plus `getMin()`, which returns the smallest value currently in the stack. Every one of these must run in constant time. `pop()` removes the top element and returns nothing; `top()` returns it without removing it.

**Example**

| Call | Returns | Stack afterwards (bottom → top) | Why |
|---|---|---|---|
| `push(-2)` | | [-2] | |
| `push(0)` | | [-2, 0] | |
| `push(-3)` | | [-2, 0, -3] | |
| `getMin()` | `-3` | [-2, 0, -3] | -3 is the smallest of the three |
| `pop()` | | [-2, 0] | Removes -3 |
| `top()` | `0` | [-2, 0] | |
| `getMin()` | `-2` | [-2, 0] | -3 is gone, so the minimum goes back to -2 |

The last call is the point of the problem: after a pop, the minimum has to *go back* to what it was before.

**What the problem statement guarantees**

- −2^31 ≤ val ≤ 2^31 − 1: any Java `int`.
- `pop`, `top` and `getMin` are only called when the stack is non-empty.
- At most 3 × 10^4 calls in total.
- Each function must run in O(1) time.

## 2. Practice first: try it before reading on

If you have not solved this yourself, stop here. Keeping a single "current minimum" is easy; the problem is what happens to it on `pop`.

**How to practise**

1. Set a timer for 20 minutes and talk out loud.
2. Push 5, 3, 7, 3 on paper. Pop them one at a time and write the minimum after each pop. What information did you need at each step?
3. Write a correct version first, even if `getMin` is slow, and say its cost.
4. Try pushes of equal values, and the values −2^31 and 2^31 − 1.

> [!HINT] Hint 1: a small nudge
> A stack only ever loses its top. When the top goes, what is left is exactly the stack as it was before that element was pushed. What was the minimum back then?

> [!HINT] Hint 2: the kind of tool you need
> Remember the minimum as of each moment, alongside the elements, so that popping can restore it. That memory can itself be a stack that moves in step with the main one.

> [!HINT] Hint 3: almost the whole plan
> Keep a second stack of minimums. On `push(val)`, push `val` onto it too if it is empty or `val` is less than *or equal to* its top. On `pop`, if the popped value equals the top of the minimum stack, pop that too. `getMin` is the top of the minimum stack.

**Check yourself before revealing the walkthrough**

- [ ] After `push(0)`, `push(1)`, `push(0)`, `pop()`, `getMin()` returns 0
- [ ] My `getMin` after a pop returns the minimum of what is left, not the old minimum
- [ ] Values −2^31 and 2^31 − 1 work, including pushed one after the other
- [ ] Every method is O(1), and I can say why

## 3. Interview script: understand the problem (≈2 min)

**Me:** A stack with push, pop, top, and getMin, all O(1). Is that worst case, or amortized?

**Interviewer:** Each call O(1).

**Me:** Then I can't afford any scan, ever. Values are any 32-bit `int`?

**Interviewer:** Yes, from −2^31 to 2^31 − 1.

**Me:** So I have to be careful with any arithmetic on values; a difference of two ints can overflow. Are pop, top, getMin ever called on an empty stack?

**Interviewer:** No.

**Me:** And duplicates are allowed: I can push 3 twice?

**Interviewer:** Yes.

**Me:** Let me run a small case. Push 5: min 5. Push 3: min 3. Push 7: min 3. Push 3: min 3. Pop: removes 3, there's still a 3, min 3. Pop: removes 7, min 3. Pop: removes the other 3, min goes back to 5. So the minimum after each pop is the minimum from before the matching push. I need to remember history, not just the current value, and duplicates of the minimum matter.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| Every operation O(1) | No scanning in `getMin` and no searching for a new minimum after a pop. The answer must be stored, ready. |
| −2^31 ≤ val ≤ 2^31 − 1 | Storing values is fine in `int`. Any trick that stores a *difference* of two values needs `long`, because the difference can reach ±(2^32 − 1). |
| `pop`, `top`, `getMin` only on non-empty stacks | No empty checks needed inside them. |
| At most 3 × 10^4 calls | At most 3 × 10^4 elements stored. Even an O(n) `getMin` would run in time here, but it breaks the stated O(1) requirement. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| O(1) per call, not amortized | Rules out any design that occasionally rescans. |
| Duplicate values are allowed | The design must survive popping one copy of the minimum while another copy remains. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| I may use `ArrayDeque` as the underlying stack | Its `push` is O(1) amortized, because the array occasionally doubles; I'll treat stack operations as O(1), as the problem intends. A fixed array of 3 × 10^4 would make them O(1) worst case. |
| Single-threaded | No locking. |

### Edge cases I will keep in mind

- The minimum pushed twice, then popped once: the minimum must stay.
- The minimum popped, so the minimum rises to an older value.
- A single element: push, getMin, pop, then push a larger one.
- `Integer.MIN_VALUE` and `Integer.MAX_VALUE`, pushed one after the other in both orders.
- Strictly decreasing pushes (the minimum changes every time) and strictly increasing pushes (it never changes).

## 4. Think out loud: from first idea to best solution

Throughout, **n** is the number of elements on the stack at the time of the call.

### Approach 1: A plain stack, and scan for the minimum

#### What I say out loud

> "Baseline: an ordinary stack. push, pop and top are O(1). getMin walks every element and returns the smallest, O(n). It's correct, but it misses the O(1) requirement, so it's only my starting point."

> "Why not just keep one `min` field? Because after I pop the minimum, I'd have to rescan to find the next one, which is again O(n)."

#### Intuition

The minimum is a function of the stack's contents, so you can always recompute it. The cost is that you recompute it from scratch every time.

#### Algorithm

1. `push`, `pop`, `top`: delegate to the stack.
2. `getMin()`: iterate over the stack, keep the smallest value seen, return it.

#### Why it is correct

`getMin` looks at every element currently on the stack, so it returns their minimum. The other operations are the stack's own.

#### Dry run

The example: after `push(-2)`, `push(0)`, `push(-3)`, `getMin` scans −3, 0, −2 and returns −3. After `pop()`, it scans 0, −2 and returns −2.

#### Java code

```java title="Approach 1: scan for the minimum"
import java.util.ArrayDeque;
import java.util.Deque;

class MinStack {
    private final Deque<Integer> stack = new ArrayDeque<>();

    public MinStack() {
    }

    public void push(int val) {
        stack.push(val);
    }

    public void pop() {
        stack.pop();
    }

    public int top() {
        return stack.peek();
    }

    public int getMin() {
        int min = Integer.MAX_VALUE;
        for (int v : stack) { // visits every element: O(n)
            min = Math.min(min, v);
        }
        return min;
    }
}
```

#### Time complexity

`push`, `pop`, `top`: **O(1)**. `getMin`: **O(n)**, one pass over the stack. This does not meet the requirement.

#### Space complexity

**O(n)** for the elements; nothing extra.

#### The bridge to the next approach

> "When I pop, the stack is exactly what it was before that element was pushed. So the minimum I need is the minimum *at that earlier moment*, and I knew it then. If I store, next to each element, the minimum of everything at or below it, I never have to recompute anything."

### Approach 2: Store the minimum-so-far with every element

#### What I say out loud

> "Each entry is a pair: the value, and the minimum of the stack up to and including that value. On push, the new minimum is the smaller of `val` and the minimum stored in the current top. top reads the value of the top pair; getMin reads its minimum; pop removes the pair, and the pair below already carries the right minimum."

#### Intuition

A stack is a sequence of snapshots: every prefix from the bottom was, at some moment, the whole stack. Store each snapshot's answer with its top element, and popping rewinds to the previous snapshot, answer included.

#### Algorithm

1. `push(val)`: `min = empty ? val : Math.min(val, top pair's min)`; push `{val, min}`.
2. `pop()`: pop the top pair.
3. `top()`: top pair's value. `getMin()`: top pair's min.

#### Why it is correct

**Invariant:** each pair's second field is the minimum of all values at or below it.

- A pushed pair takes the smaller of its own value and the minimum of everything below it (the old top's field), so it satisfies the invariant.
- Pop removes the top pair and changes no other pair, so every remaining pair still satisfies it.
- The top pair covers the whole stack, so its second field is the stack's minimum.

#### Dry run

| Call | Pairs (bottom → top) | Returns |
|---|---|---|
| `push(-2)` | (−2, −2) | |
| `push(0)` | (−2, −2) (0, −2) | |
| `push(-3)` | (−2, −2) (0, −2) (−3, −3) | |
| `getMin()` | unchanged | −3 |
| `pop()` | (−2, −2) (0, −2) | |
| `top()` | unchanged | 0 |
| `getMin()` | unchanged | −2 |

#### Java code

```java title="Approach 2: value and minimum-so-far in each entry"
import java.util.ArrayDeque;
import java.util.Deque;

class MinStack {
    // Each entry is {value, minimum of this entry and every entry below it}.
    private final Deque<int[]> stack = new ArrayDeque<>();

    public MinStack() {
    }

    public void push(int val) {
        int min = stack.isEmpty() ? val : Math.min(val, stack.peek()[1]);
        stack.push(new int[] {val, min});
    }

    public void pop() {
        stack.pop();
    }

    public int top() {
        return stack.peek()[0];
    }

    public int getMin() {
        return stack.peek()[1];
    }
}
```

#### Time complexity

**O(1)** for every operation: each does a constant number of stack operations and one comparison.

#### Space complexity

**O(n)**: two ints per element, plus a small array object per element in Java. That is about twice the values' own storage.

#### The bridge to the next approach

> "Most of those stored minimums are repeats. If I push 1, then a thousand larger numbers, I store the same minimum a thousand and one times. The minimum only *changes* when a new value is at or below it. What if I keep a separate stack that records only those changes?"

### Approach 3: A second stack of minimums (recommended)

#### What I say out loud

> "Two stacks: `stack` for the values, `mins` for the minimums. On push, I push `val` onto `mins` only if `mins` is empty or `val` is at most its top. Less than *or equal*: if I push the current minimum again, it has to be recorded again, or the first pop of it would lose the minimum while a copy is still on the stack. On pop, if the popped value equals the top of `mins`, I pop `mins` too. getMin is the top of `mins`."

> "Everything is O(1). Worst case the same space as the pair version, when values arrive in decreasing order; usually much less."

#### Intuition

`mins` is the history of record lows, from the bottom up. A value enters it when it ties or beats the current low, and leaves when that exact value is popped from the main stack. Values that never set a record don't affect the minimum, so they needn't be remembered there.

#### Algorithm

1. `push(val)`: `stack.push(val)`; if `mins` is empty or `val <= mins.peek()`, `mins.push(val)`.
2. `pop()`: `int v = stack.pop()`; if `v == mins.peek()`, `mins.pop()`.
3. `top()`: `stack.peek()`. `getMin()`: `mins.peek()`.

#### Why it is correct

**Invariant:** `mins`, from bottom to top, holds exactly the elements of `stack` (by position) that are less than or equal to every element below them, in the same order. In particular, its top is the stack's minimum.

- **Push** of `val`: `val` is at most everything below it exactly when it is at most the current minimum, which is `mins.peek()`. So it joins `mins` exactly when it should.
- **Pop** of `v`: `v` is in `mins` exactly when it was a record when pushed. If it was, it is the latest record, so it is the top of `mins`, and `v == mins.peek()`. If it was not, `v` is strictly greater than the minimum below it, so `v != mins.peek()` and `mins` stays. Either way the invariant holds for what remains.
- The equality test cannot pop a record by mistake: if `v` equals `mins.peek()` without having been recorded, then `v` was pushed when the minimum below it was `mins.peek()` = `v`, so `v <= mins.peek()` held and `v` *was* recorded. That is precisely why the push test must be `<=`.

**The 25-second version to say to the interviewer:**

> "The second stack holds the running record lows. A pushed value goes on it if it's at most the current low, ties included, so every copy of the minimum is counted. When I pop a value equal to the current low, I pop the low too, and the one beneath is the minimum of what's left, because it was the low before that value arrived. Every step is a constant number of stack operations."

#### Dry run

Duplicates of the minimum, and a non-record value on top of them.

| Call | `stack` (bottom → top) | `mins` (bottom → top) | Returns | Note |
|---|---|---|---|---|
| `push(5)` | [5] | [5] | | `mins` empty |
| `push(3)` | [5, 3] | [5, 3] | | 3 ≤ 5 |
| `push(3)` | [5, 3, 3] | [5, 3, 3] | | 3 ≤ 3: the tie is recorded |
| `push(7)` | [5, 3, 3, 7] | [5, 3, 3] | | 7 > 3 |
| `getMin()` | | | 3 | |
| `pop()` | [5, 3, 3] | [5, 3, 3] | | popped 7 ≠ 3 |
| `pop()` | [5, 3] | [5, 3] | | popped 3 = 3 |
| `getMin()` | | | 3 | the other 3 is still there |
| `pop()` | [5] | [5] | | popped 3 = 3 |
| `getMin()` | | | 5 | |

On the section 1 example, `mins` goes [−2], [−2] (0 is not a record), [−2, −3]; popping −3 pops `mins` back to [−2], so `getMin()` returns −2.

#### Java code

```java title="Approach 3: second stack of minimums (recommended)"
import java.util.ArrayDeque;
import java.util.Deque;

class MinStack {
    private final Deque<Integer> stack = new ArrayDeque<>();
    private final Deque<Integer> mins = new ArrayDeque<>(); // record lows, current minimum on top

    public MinStack() {
    }

    public void push(int val) {
        stack.push(val);
        if (mins.isEmpty() || val <= mins.peek()) { // <=: every copy of the minimum is recorded
            mins.push(val);
        }
    }

    public void pop() {
        int v = stack.pop(); // unbox here, so the comparison below is int == int
        if (v == mins.peek()) {
            mins.pop();
        }
    }

    public int top() {
        return stack.peek();
    }

    public int getMin() {
        return mins.peek();
    }
}
```

#### Time complexity

**O(1)** per operation: at most two stack operations and one comparison each.

#### Space complexity

**O(n)** in the worst case: with strictly decreasing (or all-equal) pushes, every value goes on `mins` too. When the minimum rarely changes, `mins` stays small, so it usually uses less than Approach 2.

### Alternative: one stack of differences from the minimum, using `long`

Store one number per element plus a single `min` field. Push stores `val − min` (and 0 for the first element); if `val < min`, the stored difference is negative, and `min` becomes `val`. A negative stored entry therefore marks "this element set a new minimum", and the old minimum can be recovered on pop as `min − d`. `top` is `min` when `d < 0`, otherwise `min + d`.

The differences do not fit in an `int` at these limits: `val − min` ranges from (−2^31) − (2^31 − 1) = −(2^32 − 1) up to (2^31 − 1) − (−2^31) = 2^32 − 1, so they must be stored as `long`, and `min` too. With `int`, `push(-2147483648)`, `push(2147483647)` stores 2^32 − 1, which wraps to −1. The negative entry is read as "2147483647 is a new minimum", so `getMin()` returns 2147483647 instead of −2147483648.

```java title="Alternative: differences stored as long"
import java.util.ArrayDeque;
import java.util.Deque;

class MinStack {
    // Each entry is value - min at the moment of the push; negative means this value became the new min.
    private final Deque<Long> diffs = new ArrayDeque<>();
    private long min;

    public MinStack() {
    }

    public void push(int val) {
        if (diffs.isEmpty()) {
            diffs.push(0L);
            min = val;
        } else {
            long d = (long) val - min; // within ±(2^32 - 1): needs long
            diffs.push(d);
            if (d < 0) {
                min = val;
            }
        }
    }

    public void pop() {
        long d = diffs.pop();
        if (d < 0) {
            min = min - d; // restore the minimum from before this push
        }
    }

    public int top() {
        long d = diffs.peek();
        return (int) (d < 0 ? min : min + d);
    }

    public int getMin() {
        return (int) min;
    }
}
```

It is O(1) per operation and stores one number per element instead of up to two, but each number is a `long`, and with `Deque<Long>` each is also a boxed object, so in Java it saves nothing in practice. It is easy to get wrong (the sign convention, the overflow) and hard to explain quickly. Mention it if the interviewer asks for O(1) *extra* space beyond the values, and say that it trades readability for that.

## 5. Comparison table

n = number of elements on the stack.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Scan for the minimum | push, pop, top O(1); getMin O(n) | same | O(1) |
| 2. Pair per element | O(1) every operation | O(1) every operation | O(n): a minimum per element |
| 3. Second stack of minimums | O(1) every operation | O(1) every operation | O(n) worst case; often far less |
| Alt. Differences as `long` | O(1) every operation | O(1) every operation | O(1) beyond one `long` per element |

All "O(1)" entries count each `ArrayDeque` operation as O(1); its `push` is amortized O(1) because of occasional array growth, which a pre-sized array would avoid.

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Scan | Correct by inspection: it checks every element | Breaks the O(1) requirement | Baseline only |
| 2. Pair per element | Simplest O(1) design; no equality subtleties | Stores a minimum for every element | When you want the least risky O(1) answer |
| 3. Second stack | O(1); stores only record lows | The `<=` and the equality on pop must both be right | Default answer |
| Alt. Differences | One stored number per element | Overflow with `int`; sign tricks; no real saving with boxed `Long` | Only when asked for O(1) extra space |

## 6. Which solution to give, and when to stop optimizing

Mention the scan in one sentence, explain why a single `min` field is not enough, then give Approach 3, stating the `<=` and why. If you are nervous about the duplicate case, Approach 2 is just as fast and has no tie to get wrong; it is a fine answer, and you can describe Approach 3 as the space refinement. Both are optimal in time: every operation is O(1). Stop there. Bring up the difference encoding only if asked about extra space, and say immediately that it needs `long`.

## 7. Interview script: code it and test it

### What I say while coding

> "Two `Deque<Integer>`s: `stack` and `mins`."

> "Push: always onto `stack`; onto `mins` when it's empty or `val <= mins.peek()`. Less than or equal, for duplicates of the minimum."

> "Pop: I pop into an `int` first. If I compared `stack.pop() == mins.peek()` directly, that would compare two `Integer` objects by reference, which fails for values outside the small cached range."

> "top and getMin are peeks."

### Testing out loud

**The example:** `mins` becomes [−2], stays [−2] for 0, becomes [−2, −3]. `getMin` is −3. Pop −3 equals the top of `mins`, so `mins` is [−2]. `top` is 0, `getMin` is −2.

**Duplicate minimum:** `push(0)`, `push(1)`, `push(0)`: `mins` is [0, 0] thanks to `<=`. `pop()` removes one 0 from each. `getMin()` is 0, as the stack is [0, 1].

**Minimum rises:** the dry run's final `pop()` of 3 leaves `mins` = [5] and `getMin()` returns 5.

**Single element:** `push(4)`, `getMin()` is 4, `pop()` empties both stacks, `push(9)`, `getMin()` is 9.

**Extremes:** `push(-2147483648)`, `push(2147483647)`: `mins` is [−2^31]; `top()` is 2^31 − 1, `getMin()` is −2^31. No arithmetic is done on values, so nothing can overflow.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2 min | O(1) worst case; value range; duplicates; empty calls |
| Baseline and the failure of one `min` field | 2–3 min | Scan; why a single field cannot survive a pop |
| Design | 3 min | Pairs, then the second stack; the `<=` |
| Code | 4–5 min | Approach 3 |
| Test | 3 min | Example, duplicate minimum, extremes |
| Follow-ups | 2–3 min | Space, the difference trick, max as well |

The time should go to the duplicate case: say it before you code, and trace it after. If you are stuck, pop the example's −3 out loud and ask what you would need to have stored to know the answer is −2.

## 9. Interviewer challenges

### About the design

#### Why `<=` and not `<` when pushing onto the minimum stack?

**What they are testing:** whether you understand duplicates, or memorised the code.

**How to reason:** push the minimum twice and pop it once.

**What I say:** "With `<`, a second copy of the current minimum isn't recorded. `push(0)`, `push(1)`, `push(0)` leaves `mins` as just [0]. Then `pop()` removes a 0 that equals the top of `mins`, so `mins` is popped and becomes empty, although a 0 is still on the stack. The next `getMin()` peeks an empty `mins`, gets `null`, and unboxing it throws a `NullPointerException`. With `<=`, each copy is recorded and removed separately."

**Nuance:** an alternative is to store (value, count) pairs on `mins` and increment the count on a tie. That saves space when the minimum is pushed many times, at the cost of more code.

#### Why not keep a single `min` field?

**What they are testing:** whether you see why history is needed.

**How to reason:** follow what happens when the minimum is popped.

**What I say:** "A single field is right until the minimum is popped. Then the new minimum is somewhere in the rest of the stack and I'd have to scan for it, O(n). The second stack is exactly the list of values that field would need to fall back to, in order."

**Nuance:** the difference-encoding trick keeps a single field by hiding the fallback values inside the stored entries.

### About complexity

#### Is the extra space really necessary?

**What they are testing:** whether you can reason about what must be stored.

**How to reason:** after a sequence of pops, the structure has to report the minimum of a prefix it can no longer see in full.

**What I say:** "Some information about past minimums has to be kept, because after any number of pops I must report the minimum of what remains without looking at it. The second stack keeps only record lows. The difference trick folds the same information into the stored values, so it uses O(1) space beyond one number per element, though each number needs to be a `long`."

**Nuance:** in the worst case, strictly decreasing pushes, every value is a record, so the second stack holds n entries.

#### Does `ArrayDeque` make your operations O(1)?

**What they are testing:** precision about library behaviour.

**How to reason:** separate the algorithm's operation count from the container's cost.

**What I say:** "My methods do a constant number of stack operations. `ArrayDeque.push` is amortized O(1), because the backing array doubles when full; that's how it's implemented, not a promise in its interface. If I needed a hard O(1) per call, I'd use an `int[]` sized to the 3 × 10^4 call limit with a top index."

**Nuance:** the pre-sized array also avoids boxing every value into an `Integer`.

## 10. Follow-up questions the interviewer might ask

**"Support `getMax()` as well."**
Add a `maxs` stack with the mirrored rule: push when `val >= maxs.peek()`, pop when the popped value equals its top. All operations stay O(1).

**"Support `popMin()`, removing the minimum wherever it is."**
The stack order no longer allows O(1): the minimum may be buried. Use a doubly linked list for the stack order plus a balanced tree (`TreeMap` from value to the nodes holding it) to find the minimum. `push`, `pop`, `popMin` become O(log n). This is the Max Stack design problem.

**"Make the extra space O(1) beyond the stored values."**
The difference encoding above, with `long` entries and a `long` min. Each operation is still O(1).

**"A queue with `getMin` in O(1)?"**
Build the queue from two min stacks, as in [[nc-implement-queue-using-stacks|Implement Queue using Stacks]]: the queue's minimum is the smaller of the two stacks' minimums, and each operation is amortized O(1). A monotonic deque, as in [[nc-sliding-window-maximum|Sliding Window Maximum]], also works.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **A single `min` field.** It cannot recover the previous minimum after a pop without an O(n) scan.
- **Ignoring duplicates of the minimum.** The tie case is the one interviewers check.
- **Using the difference trick with `int`.** Differences reach ±(2^32 − 1) at these limits.

### Implementation mistakes

> [!MISTAKE] `<` instead of `<=` when pushing onto the minimum stack
> `push(0)`, `push(1)`, `push(0)`, `pop()`, `getMin()`: the second 0 was never recorded, so the pop empties the minimum stack and `getMin()` throws a `NullPointerException` while a 0 is still on the stack.

> [!MISTAKE] Comparing two `Integer`s with `==` in `pop`
> `if (stack.pop() == mins.peek())` compares object references. Java caches `Integer` objects only for small values (at least −128 to 127), so for 1000 the two boxes differ. `push(1000)`, `push(1000)`, `pop()`, `pop()`, `push(2000)`, `getMin()` returns 1000 instead of 2000, because `mins` was never popped. Unbox to an `int` first, or use `equals`.

> [!MISTAKE] Storing differences in an `int`
> With the alternative's code but `int` in place of `long`, `push(-2147483648)`, `push(2147483647)`, `getMin()` returns 2147483647 instead of −2147483648: the difference 2^32 − 1 wraps to −1 and is read as "new minimum".

- **Popping `mins` on every pop,** instead of only when the popped value equals its top: `mins` empties long before `stack`.

## 12. Pattern recognition

**The pattern:** augmenting a stack with per-level information: because a stack only changes at its top, any summary of "everything below" can be stored when an element is pushed and is restored automatically when it is popped.

**Signals in the problem statement:**

- A stack that must also answer an aggregate query (minimum, maximum) in O(1).
- Elements are removed only in LIFO order, so old states come back exactly.

**Related problems in this list:**

- [[nc-implement-queue-using-stacks|Implement Queue using Stacks]]: combined with min stacks, it gives a queue with O(1) amortized minimum.
- [[nc-online-stock-span|Online Stock Span]]: a stack that stores extra information with each entry to answer a query in amortized O(1).
- [[nc-maximum-frequency-stack|Maximum Frequency Stack]]: a stack design with an extra query, solved by keeping one stack per level.
- [[nc-daily-temperatures|Daily Temperatures]]: a stack whose contents stay ordered, the monotonic-stack idea behind the record lows.

**Takeaway:** a stack's past states come back in reverse order, so store each state's answer when you push and popping restores it for free; for the minimum, the record lows are enough, provided ties are recorded.

## 13. 60-second revision card

**Key insight:** after a pop the stack is exactly as it was before the matching push, so remember the minimum of each state. A second stack of record lows (ties included) is enough.

**Invariant:** the top of `mins` is the minimum of `stack`; `mins` holds every element that was at most everything below it.

**Complexity:** O(1) per operation; O(n) extra space in the worst case (decreasing pushes).

**Code skeleton:**

```java title="Min stack, core"
import java.util.ArrayDeque;
import java.util.Deque;

class MinStack {
    private final Deque<Integer> stack = new ArrayDeque<>(), mins = new ArrayDeque<>();

    public void push(int val) {
        stack.push(val);
        if (mins.isEmpty() || val <= mins.peek()) mins.push(val); // <= keeps every copy of the min
    }

    public void pop() {
        int v = stack.pop();                                      // unbox: int == int below
        if (v == mins.peek()) mins.pop();
    }

    public int top() { return stack.peek(); }
    public int getMin() { return mins.peek(); }
}
```

**Main traps:**

- `<=`, not `<`, on push.
- Unbox before comparing on pop.
- Differences need `long` at the full `int` range.

**What to say in one breath:** "A second stack records the running minimum: I push a value onto it when it's at most the current minimum, ties included, and pop it when that value is popped. The stack below always holds the minimum from before, so getMin is a peek and every operation is O(1)."
