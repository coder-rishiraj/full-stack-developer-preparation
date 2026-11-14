---
problemId: nc-implement-queue-using-stacks
title: Implement Queue using Stacks
source: neetcode
sourceUrl: https://leetcode.com/problems/implement-queue-using-stacks/
difficulty: easy
patterns: [stack, queue]
relatedLessons: [a5-queue, a5-stack, a5-deque, a1-time-complexity, a14-complexity-in-interview]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

Build a first-in, first-out queue as a class `MyQueue` with four operations: `push(x)` adds `x` at the back, `pop()` removes and returns the front element, `peek()` returns the front element without removing it, and `empty()` reports whether the queue holds nothing. The only storage you may use is two stacks, through the operations a plain stack offers: push to the top, look at or remove the top, ask the size, and ask whether it is empty.

**Example**

| Call | Returns | Queue afterwards (front → back) | Why |
|---|---|---|---|
| `push(1)` | | [1] | |
| `push(2)` | | [1, 2] | |
| `peek()` | `1` | [1, 2] | 1 arrived first |
| `pop()` | `1` | [2] | The first in is the first out |
| `empty()` | `false` | [2] | 2 is still there |

A stack would have answered 2 to `peek()`: the element a queue wants is at the bottom.

**What the problem statement guarantees**

- 1 ≤ x ≤ 9.
- At most 100 calls in total to `push`, `pop`, `peek` and `empty`.
- Every call to `pop` and `peek` is valid: the queue is not empty.
- Only two stacks, and only the standard stack operations. A deque used only through those operations is allowed.
- Follow-up: implement it so that each operation is amortized O(1): n operations take O(n) time in total, even if one of them takes longer.

## 2. Practice first: try it before reading on

If you have not solved this yourself, stop here. The code is ten lines; the interview is about the follow-up, and whether you can explain *why* a cost is amortized rather than just claim it.

**How to practise**

1. Set a timer for 15 minutes and talk out loud.
2. Push 1, 2, 3 onto a stack on paper. Pop everything onto a second stack. Look at the order.
3. Write a version that is certainly correct, then ask how often the expensive step really needs to happen.
4. Explain, in plain words, how many times one element can be moved over its whole life.

> [!HINT] Hint 1: a small nudge
> Pouring one stack into another reverses its order. What does reversed "last in, first out" look like?

> [!HINT] Hint 2: the kind of tool you need
> Keep one stack where new elements arrive and one stack that hands elements out. Once an element is in the second stack, it is in the right order. Does the second stack need refilling while it still holds elements?

> [!HINT] Hint 3: almost the whole plan
> `push` goes onto an input stack. `pop` and `peek` use an output stack; only when the output stack is empty, pour the whole input stack into it, which puts the oldest element on top. `empty` is true when both stacks are empty. Each element is moved from input to output at most once.

**Check yourself before revealing the walkthrough**

- [ ] `push(1)`, `push(2)`, `pop()`, `push(3)`, `pop()`, `pop()` returns 1, 2, 3
- [ ] My `empty()` looks at both stacks
- [ ] I use only push, pop, peek, size and is-empty on each stack
- [ ] I can say why the cost is O(1) amortized and what the worst single call costs

## 3. Interview script: understand the problem (≈2 min)

**Me:** A FIFO queue, push, pop, peek, empty, using two stacks with only stack operations. In Java I'd use `Deque<Integer>` with `ArrayDeque` and call only `push`, `pop`, `peek`, `isEmpty` and `size`, which act on one end. Is that fine?

**Interviewer:** Yes, as long as you only touch the top.

**Me:** `pop` and `peek` are never called on an empty queue?

**Interviewer:** Correct.

**Me:** At most 100 calls and values 1 to 9, so speed won't matter at this size; I'll focus on the per-operation cost. Let me do it by hand. Stack A after pushing 1, 2, 3 has 3 on top. The queue wants 1, which is at the bottom. If I pop everything from A and push onto B, B has 1 on top, then 2, then 3. That's queue order. So one pour reverses the stack into a queue.

**Me:** The question is when to pour, and whether I have to pour back.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| Two stacks, only stack operations | I can only reach the top. Reordering means popping from one stack and pushing onto the other, which reverses. |
| `pop` and `peek` are always valid | No empty checks inside them; but `empty()` must consider both stacks. |
| At most 100 calls, 1 ≤ x ≤ 9 | Anything runs instantly; the cost model is what's being asked about. |
| Follow-up: amortized O(1) per operation | n operations must cost O(n) in total. A single operation may still be slower. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| `Deque` used only as a stack is fine | I'll call `push`, `pop`, `peek`, `isEmpty`, all at the head. |
| Amortized, not worst-case, O(1) is what the follow-up asks | I can let an occasional pop be O(n) if I can show the total stays linear. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| Each stack operation counts as O(1) | That's the model the problem sets. `ArrayDeque.push` is itself amortized O(1), because its array occasionally doubles; I'll treat it as one step. |
| Single-threaded | No locking. |

### Edge cases I will keep in mind

- Pushes after some pops, while the output stack still holds older elements: new elements must not jump ahead of them.
- Emptying the queue completely and reusing it.
- `empty()` when elements are only in the input stack.
- `peek()` twice in a row returns the same value.

## 4. Think out loud: from first idea to best solution

Throughout, **n** is the number of elements in the queue when an operation runs, **m** is the total number of operations in a sequence, and each stack operation counts as one O(1) step.

### Approach 1: Pour over and back on every pop and peek

#### What I say out loud

> "The simplest correct version: keep everything in one stack, newest on top. When I need the front, pour the stack into the other one, which puts the oldest on top. Take it, then pour everything back so the next push lands in the right place. Push O(1), pop and peek O(n)."

#### Intuition

Pouring reverses the order, so the bottom element, the oldest, comes to the top. Pouring back restores the original arrangement, so the single "main" stack stays the only source of truth.

#### Algorithm

1. `push(x)`: `main.push(x)`.
2. `pop()`: pour `main` into `temp`; `x = temp.pop()`; pour `temp` back into `main`; return `x`.
3. `peek()`: the same, with `temp.peek()` instead of `temp.pop()`.
4. `empty()`: `main.isEmpty()`.

#### Why it is correct

**Invariant:** between operations, `temp` is empty and `main` holds the elements oldest at the bottom, newest on top. Pouring reverses, so after the first pour the oldest element is on top of `temp`; that is exactly the queue's front. Pouring back reverses again, restoring the invariant minus the popped element.

#### Dry run

| Call | `main` before (bottom → top) | `temp` after pouring (bottom → top) | Returned | `main` after |
|---|---|---|---|---|
| `push(1)` | [] | | | [1] |
| `push(2)` | [1] | | | [1, 2] |
| `peek()` | [1, 2] | [2, 1] | 1 | [1, 2] |
| `pop()` | [1, 2] | [2, 1] | 1 | [2] |
| `empty()` | [2] | | `false` | [2] |

#### Java code

```java title="Approach 1: pour over and back"
import java.util.ArrayDeque;
import java.util.Deque;

class MyQueue {
    // Only push, pop, peek and isEmpty are used: each acts on the top.
    private final Deque<Integer> main = new ArrayDeque<>(); // oldest at the bottom
    private final Deque<Integer> temp = new ArrayDeque<>(); // empty between calls

    public MyQueue() {
    }

    public void push(int x) {
        main.push(x);
    }

    public int pop() {
        pour(main, temp);
        int x = temp.pop();
        pour(temp, main);
        return x;
    }

    public int peek() {
        pour(main, temp);
        int x = temp.peek();
        pour(temp, main);
        return x;
    }

    public boolean empty() {
        return main.isEmpty();
    }

    private static void pour(Deque<Integer> from, Deque<Integer> to) {
        while (!from.isEmpty()) {
            to.push(from.pop());
        }
    }
}
```

#### Time complexity

`push` and `empty` are **O(1)**. `pop` and `peek` are **O(n)**: two full pours, about 2n pops and 2n pushes. A sequence of n pushes followed by n peeks costs O(n²).

#### Space complexity

**O(n)**: n elements, in one stack or the other.

#### The bridge to the next approach

> "Pouring back is the wasted part. After the first pour, `temp` is already in queue order: the next pop wants exactly what's now on top of it. Why put everything back? Because new pushes would land on top of `temp` in the wrong place. But they don't have to go there: new pushes can go onto the *other* stack and wait. I only need to pour again when `temp` runs out."

### Approach 2: Lazy transfer with an input and an output stack (recommended)

#### What I say out loud

> "Two stacks: `in` takes every push, `out` hands out the front. Pop and peek look at `out`. If `out` is empty, I pour all of `in` into it first, which puts the oldest element on top. If `out` isn't empty, I don't touch `in`: everything in `out` is older than anything in `in`, so the front is on top of `out`."

> "One pop can be O(n), when it triggers a pour. But each element is poured at most once in its life, so over m operations the total is O(m): amortized O(1) per operation."

#### Intuition

Split the queue at some point in time: the older part sits in `out`, already reversed into queue order, and the newer part sits in `in`, in arrival order. The front of the queue is the top of `out` whenever `out` is non-empty. Only when the old part is used up do you reverse the newer part, all at once, and it becomes the new old part.

#### Algorithm

1. `push(x)`: `in.push(x)`.
2. `pop()`: `shift()`; return `out.pop()`.
3. `peek()`: `shift()`; return `out.peek()`.
4. `empty()`: `in.isEmpty() && out.isEmpty()`.
5. `shift()`: if `out` is empty, pour all of `in` into `out`. Otherwise do nothing.

#### Why it is correct

**Invariant:** reading `out` from top to bottom, then `in` from bottom to top, gives the queue from front to back.

- **Start:** both empty, the queue is empty.
- **`push(x)`:** `x` goes on top of `in`, which is the end of the reading order: x is now at the back of the queue.
- **`shift()` with `out` empty:** the queue is `in` read bottom to top. Pouring reverses `in`, so `out` read top to bottom is that same sequence and `in` is empty. The queue is unchanged.
- **`shift()` with `out` non-empty:** nothing moves.
- **`pop`/`peek`:** after `shift()`, `out` is non-empty (the call is valid, so the queue has an element, and if it was all in `in` it has just been poured). Its top is the first element in reading order, the front of the queue.

The important case is pushing while `out` is non-empty: the new element goes into `in` and cannot overtake anything in `out`, because `out` is always read first.

**The 25-second version to say to the interviewer:**

> "`out` holds the older elements, already reversed into queue order, and `in` holds the newer ones in arrival order. The front is always the top of `out`. I only pour when `out` is empty, so I never mix the two halves. Each element gets pushed onto `in`, moved to `out` once, and popped once, so m operations do O(m) work."

#### Dry run

| Call | `in` after (bottom → top) | `out` after (bottom → top) | Poured? | Returned |
|---|---|---|---|---|
| `push(1)` | [1] | [] | | |
| `push(2)` | [1, 2] | [] | | |
| `peek()` | [] | [2, 1] | yes, 2 elements | 1 |
| `pop()` | [] | [2] | no | 1 |
| `push(3)` | [3] | [2] | | |
| `pop()` | [3] | [] | no: `out` held 2 | 2 |
| `pop()` | [] | [] | yes, 1 element | 3 |
| `empty()` | [] | [] | | `true` |

The second `pop` is the case that catches mistakes: 3 is in `in`, 2 is in `out`, and the answer is 2.

#### Java code

```java title="Approach 2: lazy transfer (recommended)"
import java.util.ArrayDeque;
import java.util.Deque;

class MyQueue {
    // Only push, pop, peek and isEmpty are used on each Deque: stack operations at the top.
    private final Deque<Integer> in = new ArrayDeque<>();  // newer elements, newest on top
    private final Deque<Integer> out = new ArrayDeque<>(); // older elements, oldest on top

    public MyQueue() {
    }

    public void push(int x) {
        in.push(x);
    }

    public int pop() {
        shift();
        return out.pop();
    }

    public int peek() {
        shift();
        return out.peek();
    }

    public boolean empty() {
        return in.isEmpty() && out.isEmpty();
    }

    // Refill out only when it is empty, so older elements are never buried under newer ones.
    private void shift() {
        if (out.isEmpty()) {
            while (!in.isEmpty()) {
                out.push(in.pop());
            }
        }
    }
}
```

#### Time complexity

**Amortized O(1) per operation; a single `pop` or `peek` is O(n) in the worst case.**

- **Why one call can be O(n):** push 1, 2, …, n, then call `pop()`. `out` is empty, so that one call pours all n elements: n pops and n pushes.
- **Why the total is linear (counting moves):** follow one element through its life. It is pushed onto `in` once, popped from `in` once and pushed onto `out` once (both during a single pour, because once in `out` it never goes back), and popped from `out` at most once. That is at most four stack operations per element, ever. Peeks and `empty` checks add O(1) each on top of the pour work. So m operations, which push at most m elements, cost at most 4m stack operations plus O(m) for the rest: O(m) in total, O(1) per operation on average over the sequence.
- **The same argument as a prepaid budget:** let every push pay 3 units instead of 1, putting 2 units on the element it pushes. Every element in `in` then carries 2 units. A pour of k elements costs 2k (k pops, k pushes) and is paid entirely by the 2k units those elements carry. Every other operation pays its own constant cost. No operation ever needs more than it was given, so the total cost of m operations is at most 3m plus the constant costs: O(m).

Amortized is not "average over random inputs": it is a guarantee for *every* sequence of operations, about the total. What it does not guarantee is the cost of any single call.

#### Space complexity

**O(n)**: each element is in exactly one of the two stacks.

### Alternative: pour on push instead

Keep one stack in queue order (oldest on top) at all times: on `push(x)`, pour it into the other stack, push `x`, and pour back. Then `pop` and `peek` are O(1) worst case and `push` is O(n) every time. It is the mirror of Approach 1, never better than the lazy version in total, and is only worth mentioning if a workload has almost no pushes and needs a worst-case O(1) `pop`.

## 5. Comparison table

n = elements in the queue at the time of the call; m = operations in the sequence.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Pour over and back | push O(1); pop, peek O(n) | same | O(n) |
| Alt. Pour on push | push O(n); pop, peek O(1) | same | O(n) |
| 2. Lazy transfer | O(1) amortized per operation; O(m) for m operations | O(n) for one pop or peek | O(n) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Pour over and back | Single source of truth; easy to see it is right | O(n) per read, O(n²) for n reads | Baseline only |
| Alt. Pour on push | O(1) worst-case reads | O(n) per push | Reads need a hard per-call bound and pushes are rare |
| 2. Lazy transfer | O(m) total for any sequence; ten lines | One call can be O(n) | Default answer; required by the follow-up |

## 6. Which solution to give, and when to stop optimizing

Say Approach 1 briefly, point at the pour-back as the waste, and code Approach 2. The interview is then won or lost on the complexity explanation: say "amortized O(1)", give the "each element moves at most once from `in` to `out`" argument, and volunteer that a single call can be O(n). Do not try to make every operation worst-case O(1) unless asked; it needs a much more involved construction (see the follow-ups), and the follow-up asks only for amortized.

## 7. Interview script: code it and test it

### What I say while coding

> "`in` and `out`, both `Deque<Integer>`, and I'll only call push, pop, peek and isEmpty on them."

> "`shift` is the only place elements move, and its `if (out.isEmpty())` guard is the whole correctness argument: I never pour on top of older elements."

> "`empty` checks both stacks, because elements can be sitting only in `in`."

### Testing out loud

**The example:** `push(1)`, `push(2)`: `in` = [1, 2]. `peek()`: `out` is empty, pour: `out` = [2, 1], top 1. `pop()` returns 1. `empty()`: `out` still holds 2, so `false`.

**New push while `out` is non-empty:** the dry run's `push(3)` with `out` = [2]. The next `pop()` sees `out` non-empty, does not pour, and returns 2. Then `out` is empty, so the following `pop()` pours 3 and returns it.

**Elements only in `in`:** `push(5)`, then `empty()`: `out` is empty but `in` is not, so `false`.

**Empty and reuse:** after `pop()` returns 5, `empty()` is `true`; `push(6)`, `peek()` pours one element and returns 6.

**Peek twice:** both calls return the top of `out` without removing it; the second does not pour.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1–2 min | Allowed operations; whether `pop` on empty can happen; what the follow-up means |
| Baseline and the waste | 2 min | Pour over and back; why the pour back is unnecessary |
| Code | 4 min | `in`, `out`, `shift` with its guard |
| Test | 2–3 min | The push-while-`out`-non-empty case; `empty` with only `in` filled |
| Amortized argument | 3 min | Each element moves once; one call can be O(n) |

The time should go to the amortized explanation. If you are stuck on the idea, pour [1, 2, 3] into a second stack on paper and look at which element is on top.

## 9. Interviewer challenges

### About complexity

#### Your `pop` can take O(n). How is it O(1)?

**What they are testing:** whether you know what amortized means and can justify it.

**How to reason:** bound the total over any sequence, not each call.

**What I say:** "A single pop that triggers a pour is O(n), and I won't hide that. But each element is moved from `in` to `out` at most once: it's pushed once, moved once, popped once. So the moves across any m operations add up to at most m, and the total work is O(m). That's amortized O(1) per operation, and it holds for every sequence, not just typical ones."

**Nuance:** amortized differs from expected: no randomness or input assumption is involved. It is a worst-case bound on the total.

#### When does the amortized bound not help you?

**What they are testing:** awareness of latency versus throughput.

**How to reason:** amortized bounds the total, not the spikes.

**What I say:** "If each call has a deadline, say a real-time system or a request that must answer within a latency budget, the occasional O(n) pour is a spike, even though throughput is fine. Then I'd want worst-case O(1) per operation, which needs a different design."

**Nuance:** a worst-case O(1) queue from stacks exists, built by spreading the pour over subsequent operations (a few steps of the transfer per call), but it is intricate and not something to code in 15 minutes.

### About the design

#### Why not pour back from `out` to `in` before each push?

**What they are testing:** whether you understand why the lazy version is correct, not just that it is.

**How to reason:** ask what goes wrong if new elements land in `in` while `out` holds older ones.

**What I say:** "Nothing goes wrong, because `out` is always read before `in`. Everything in `out` arrived before everything in `in`, since `out` was filled from `in` at some moment and only later pushes went into `in`. So a push never needs to touch `out`, and pouring back would only make it O(n)."

**Nuance:** the guard in `shift` is what keeps that ordering; pouring into a non-empty `out` would break it.

## 10. Follow-up questions the interviewer might ask

**"Can every operation be worst-case O(1)?"**
Yes, with more stacks and incremental transfer: start reversing the input stack into a new output stack before the old one runs out, doing a constant number of moves per operation. It is a known construction but intricate; in an interview, describe the idea and its cost rather than code it.

**"Add a `size()` method."**
Return `in.size() + out.size()`, O(1).

**"What about the reverse, a stack from queues?"**
There, rotating the queue gives O(n) per push or per pop, and the rotation work is not saved for later, because the next push rotates past the same elements again; see [[nc-implement-stack-using-queues|Implement Stack Using Queues]].

**"Where does this idea show up for real?"**
Purely functional languages build queues from two immutable lists in exactly this way, since a list is a stack: cons onto the front, take from the front.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Saying "pop is O(1)" without "amortized".** One pop can be O(n). Say both.
- **Arguing the amortized bound by "most pops are cheap".** That is not a proof. Count the moves per element over its lifetime: at most one pour each.

### Implementation mistakes

> [!MISTAKE] Pouring `in` into `out` even when `out` is not empty
> Then newer elements land on top of older ones. `push(1)`, `push(2)`, `pop()` returns 1 and leaves 2 in `out`; `push(3)`, `pop()` pours 3 on top of 2 and returns 3 instead of 2.

- **`empty()` that checks only `out`.** After `push(5)`, `out` is empty but the queue is not, so it would return `true`.
- **Using `ArrayDeque` methods that reach the bottom,** such as `pollLast` or `peekLast`. They make the problem trivial and break its rule.

## 12. Pattern recognition

**The pattern:** two stacks back to back form a queue; reversing an ordered container lazily, and paying for each element's move once, gives amortized constant cost.

**Signals in the problem statement:**

- "Implement X using only Y" with restricted operations.
- A follow-up that asks for amortized O(1): a hint that a costly step should happen rarely and be paid for by earlier cheap ones.

**Related problems in this list:**

- [[nc-implement-stack-using-queues|Implement Stack Using Queues]]: the mirror, where rotation costs O(n) per push.
- [[nc-min-stack|Min Stack]]: another stack with an extra constant-time query.
- [[nc-design-circular-queue|Design Circular Queue]]: a queue built by hand on a fixed array.
- [[nc-sliding-window-maximum|Sliding Window Maximum]]: a deque-based structure whose amortized argument also counts at most one push and one pop per element.

**Takeaway:** pour `in` into `out` only when `out` is empty; each element moves at most once, so the total is linear and each operation is amortized O(1), while one call can still be O(n).

## 13. 60-second revision card

**Key insight:** pouring one stack into another reverses it, which turns LIFO into FIFO. Do it lazily, only when `out` is empty.

**Invariant:** `out` top-to-bottom, then `in` bottom-to-top, is the queue front-to-back.

**Complexity:** O(1) amortized per operation (each element: one push, one move, one pop); a single pop or peek is O(n) worst case; O(n) space.

**Code skeleton:**

```java title="Two-stack queue, core"
import java.util.ArrayDeque;
import java.util.Deque;

class MyQueue {
    private final Deque<Integer> in = new ArrayDeque<>(), out = new ArrayDeque<>();

    public void push(int x) { in.push(x); }
    public int pop() { shift(); return out.pop(); }
    public int peek() { shift(); return out.peek(); }
    public boolean empty() { return in.isEmpty() && out.isEmpty(); }

    private void shift() {
        if (out.isEmpty()) while (!in.isEmpty()) out.push(in.pop()); // only when out is empty
    }
}
```

**Main traps:**

- Pour only when `out` is empty.
- `empty()` checks both stacks.
- Say "amortized", and that one call can be O(n).

**What to say in one breath:** "Pushes go onto `in`. Pops come from `out`, and only when `out` is empty do I pour `in` into it, which reverses it into queue order. Each element is moved once in its life, so any m operations cost O(m): amortized O(1), with an occasional O(n) pop."
