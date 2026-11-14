---
problemId: nc-implement-stack-using-queues
title: Implement Stack Using Queues
source: neetcode
sourceUrl: https://leetcode.com/problems/implement-stack-using-queues/
difficulty: easy
patterns: [stack, queue]
relatedLessons: [a5-stack, a5-queue, a5-deque, a14-clarifying-requirements]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

Build a last-in, first-out stack as a class `MyStack` with four operations: `push(x)` puts `x` on top, `pop()` removes and returns the top element, `top()` returns the top element without removing it, and `empty()` reports whether the stack holds nothing. The catch: the only storage you may use is queues, and you may only use what a plain queue offers: add to the back, look at or remove from the front, ask the size, and ask whether it is empty.

**Example**

| Call | Returns | Stack afterwards (bottom → top) | Why |
|---|---|---|---|
| `push(1)` | | [1] | |
| `push(2)` | | [1, 2] | |
| `top()` | `2` | [1, 2] | 2 was pushed last |
| `pop()` | `2` | [1] | The last in is the first out |
| `empty()` | `false` | [1] | 1 is still there |

A queue would have answered 1 to both `top()` and `pop()`: that difference is the whole problem.

**What the problem statement guarantees**

- 1 ≤ x ≤ 9.
- At most 100 calls in total to `push`, `pop`, `top` and `empty`.
- Every call to `pop` and `top` is valid: the stack is not empty.
- You may use two queues and only the standard queue operations listed above. A deque used only through those operations is allowed.
- Follow-up: can you do it with only one queue?

## 2. Practice first: try it before reading on

If you have not solved this yourself, stop here. Nobody ships this class; the interviewer wants to see you reason about what each structure can reach cheaply, and to state the cost of each operation honestly.

**How to practise**

1. Set a timer for 15 minutes and talk out loud.
2. Draw a queue holding 1, 2, 3 (1 at the front). Ask which element a stack would return next, and where it sits.
3. Decide which operation should pay the cost, and say the cost of every operation.
4. Then try the follow-up with a single queue.

> [!HINT] Hint 1: a small nudge
> In the queue, the element a stack wants next is at the back, and you can only remove from the front. What could you do with the elements in front of it so that you do not lose them?

> [!HINT] Hint 2: the kind of tool you need
> Removing an element from the front and adding it to the back keeps every element and changes which one is at the front. Do that the right number of times and any element you like is at the front. You can do this work when an element arrives, or when one is asked for.

> [!HINT] Hint 3: almost the whole plan
> Use one queue. On `push(x)`, add `x` to the back, then move the `size − 1` elements in front of it to the back, one at a time. Now the newest element is at the front, and the queue reads newest to oldest. `pop` removes the front, `top` peeks at it, `empty` asks the queue.

**Check yourself before revealing the walkthrough**

- [ ] After `push(1)`, `push(2)`, `push(3)`, `pop()` returns 3 and then `top()` returns 2
- [ ] `pop()` down to empty, then `push` again, still works
- [ ] I use only add-to-back, peek/remove-front, size and is-empty
- [ ] I can say the cost of each operation and which one pays

## 3. Interview script: understand the problem (≈2 min)

**Me:** So I'm building a stack, push, pop, top, empty, but my storage has to be queues, and I can only use the queue's own operations: offer to the back, peek and poll from the front, size, is-empty. In Java I'd declare a `Queue<Integer>` backed by an `ArrayDeque` and call only those methods. Is that fine?

**Interviewer:** Yes, as long as you don't use the deque's other end.

**Me:** Can `pop` or `top` be called on an empty stack?

**Interviewer:** No, those calls are always valid.

**Me:** Good, so I don't need an error path. How many calls?

**Interviewer:** At most 100. Values are 1 to 9.

**Me:** So performance isn't a practical issue at this size; you're interested in the cost per operation in general. Let me do one by hand. Queue after pushing 1, 2, 3 is front [1, 2, 3] back. The stack wants 3, which is at the back. To reach it I'd have to take 1 and 2 off the front, and I can't throw them away. If I put them back at the end, the queue becomes [3, 1, 2], and now 3 is at the front. So rotation is my tool; the question is when to do it.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| Only queues, only standard queue operations | No indexing, no access to the back except adding. Reordering has to be done by moving elements from the front to the back, one at a time. |
| Two queues allowed; follow-up asks for one | I'll design with two, then show that one is enough. |
| `pop` and `top` are always valid | No empty check inside them. |
| At most 100 calls, 1 ≤ x ≤ 9 | Any approach runs instantly. Small values rule out nothing; I won't rely on them. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| A `Queue` interface over `ArrayDeque` is fine if I use only queue operations | I'll call only `offer`, `poll`, `peek`, `size`, `isEmpty`, and declare the field as `Queue<Integer>` so the compiler stops me from calling `pollLast`. |
| They want the cost of each operation | I'll give a per-operation bound and say which operation pays. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| Each queue operation counts as O(1) | That's the model the problem sets. `ArrayDeque` meets it amortized, since its array occasionally doubles; `LinkedList` meets it in the worst case. |
| Single-threaded | No locking. |

### Edge cases I will keep in mind

- One element: `push(5)`, `pop()`, then `empty()` is `true`.
- Emptying the stack fully and pushing again.
- `top()` must not change the stack: calling it twice returns the same value.
- Interleaved pushes and pops, so the queue's order is right after every operation, not only at the end.

## 4. Think out loud: from first idea to best solution

Throughout, **n** is the number of elements in the stack when the operation runs, and each queue operation counts as one O(1) step.

### Approach 1: Two queues, cheap push (rotate on pop)

#### What I say out loud

> "Simplest first: push just offers to the queue, so the queue holds elements oldest at the front, newest at the back. When I need the top, it's at the back. So for pop, I move everything except the last element into a second queue, poll the last one and return it, then swap the two queues. Top is the same, except I also move that last element across instead of dropping it."

> "Push is O(1), pop and top are O(n). If the workload is mostly pushes, that's the right trade."

#### Intuition

A queue keeps arrival order, which is the order a stack wants reversed. Instead of reversing, drain everything that arrived earlier into a second queue; the element left alone is the newest. The second queue receives the others in their original order, so it is a valid "oldest first" queue for next time.

#### Algorithm

1. `push(x)`: `main.offer(x)`.
2. `pop()`: while `main.size() > 1`, `helper.offer(main.poll())`. Then `x = main.poll()`. Swap `main` and `helper`. Return `x`.
3. `top()`: as `pop`, but after polling `x`, also `helper.offer(x)` before swapping.
4. `empty()`: `main.isEmpty()`.

#### Why it is correct

**Invariant:** between operations, `helper` is empty and `main` holds the stack's elements oldest at the front, newest at the back.

- `push` adds the newest element at the back: the invariant holds.
- `pop` moves the n − 1 older elements to `helper` in their original order, so the one left in `main` is the newest, which is what a stack returns. After the swap, `main` holds the rest, oldest first, and `helper` is the emptied queue.
- `top` does the same and puts the newest back at the end of `helper`, so after the swap nothing has changed but the queue object.

#### Dry run

| Call | `main` before (front → back) | Moved to `helper` | Returned | `main` after the swap |
|---|---|---|---|---|
| `push(1)` | [] | | | [1] |
| `push(2)` | [1] | | | [1, 2] |
| `push(3)` | [1, 2] | | | [1, 2, 3] |
| `top()` | [1, 2, 3] | 1, 2, then 3 is put back | 3 | [1, 2, 3] |
| `pop()` | [1, 2, 3] | 1, 2 | 3 | [1, 2] |
| `pop()` | [1, 2] | 1 | 2 | [1] |
| `empty()` | [1] | | `false` | [1] |

#### Java code

```java title="Approach 1: two queues, rotate on pop"
import java.util.ArrayDeque;
import java.util.Queue;

class MyStack {
    // Declared as Queue so only queue operations are available.
    private Queue<Integer> main = new ArrayDeque<>();
    private Queue<Integer> helper = new ArrayDeque<>();

    public MyStack() {
    }

    public void push(int x) {
        main.offer(x);
    }

    public int pop() {
        while (main.size() > 1) {
            helper.offer(main.poll());
        }
        int x = main.poll(); // the newest element
        swap();
        return x;
    }

    public int top() {
        while (main.size() > 1) {
            helper.offer(main.poll());
        }
        int x = main.poll();
        helper.offer(x); // top does not remove it
        swap();
        return x;
    }

    public boolean empty() {
        return main.isEmpty();
    }

    private void swap() {
        Queue<Integer> t = main;
        main = helper;
        helper = t;
    }
}
```

#### Time complexity

`push` and `empty` are **O(1)**. `pop` and `top` are **O(n)**, since each moves n − 1 elements, every move one poll and one offer. This is per operation, and repeated `top()` calls pay it every time.

#### Space complexity

**O(n)**: n elements split across the two queues, never more than n in total.

#### The bridge to the next approach

> "The trouble is that `top` and `pop` redo the same rotation each time they're called. If I paid once, when the element arrives, the newest element could sit at the front permanently. So: make push expensive, and pop and top cheap."

### Approach 2: Two queues, cheap pop (rotate on push)

#### What I say out loud

> "On push, I offer the new element to the empty helper queue, so it's at helper's front. Then I move all of main behind it. Helper now reads newest to oldest. Swap. Main is always in stack order, front = top, so pop is a poll and top is a peek."

#### Intuition

Keep the queue in stack order at all times. A new element must go in front of everything already there, and the only way to put something "in front" in a queue is to have it arrive first. The empty helper queue gives it a place to arrive first.

#### Algorithm

1. `push(x)`: `helper.offer(x)`; while `main` is not empty, `helper.offer(main.poll())`; swap.
2. `pop()`: `main.poll()`. `top()`: `main.peek()`. `empty()`: `main.isEmpty()`.

#### Why it is correct

**Invariant:** between operations, `helper` is empty and `main` holds the elements newest at the front, oldest at the back. On push, `x` enters the empty helper first, then the old elements follow in their existing newest-to-oldest order, so the new queue reads x, then the rest from newest to oldest. Pop and top read the front, the newest element.

#### Dry run

| Call | `helper` after offering x and draining `main` | `main` after the swap (front → back) | Returned |
|---|---|---|---|
| `push(1)` | [1] | [1] | |
| `push(2)` | [2, 1] | [2, 1] | |
| `push(3)` | [3, 2, 1] | [3, 2, 1] | |
| `pop()` | | [2, 1] | 3 |
| `top()` | | [2, 1] | 2 |

#### Java code

```java title="Approach 2: two queues, rotate on push"
import java.util.ArrayDeque;
import java.util.Queue;

class MyStack {
    private Queue<Integer> main = new ArrayDeque<>();   // newest at the front
    private Queue<Integer> helper = new ArrayDeque<>(); // empty between calls

    public MyStack() {
    }

    public void push(int x) {
        helper.offer(x);
        while (!main.isEmpty()) {
            helper.offer(main.poll());
        }
        Queue<Integer> t = main;
        main = helper;
        helper = t;
    }

    public int pop() {
        return main.poll();
    }

    public int top() {
        return main.peek();
    }

    public boolean empty() {
        return main.isEmpty();
    }
}
```

#### Time complexity

`push` is **O(n)**: it moves all n existing elements. `pop`, `top` and `empty` are **O(1)**.

#### Space complexity

**O(n)** across the two queues.

#### The bridge to the next approach

> "The helper queue only exists to let x arrive before the others. But I could also let x arrive *after* the others, in the same queue, and then cycle the old elements past it: poll from the front, offer to the back, n − 1 times. Then x is at the front and the rest follow in their old order. One queue is enough, which is the follow-up."

### Approach 3: One queue, rotate after push (recommended)

#### What I say out loud

> "One queue. Push offers x to the back, then rotates the queue size − 1 times: poll the front, offer it to the back. After that, x is at the front and everything else is behind it in the same order as before. The queue is always in stack order, so pop is poll, top is peek, empty is isEmpty. Push is O(n), the others O(1)."

#### Intuition

A queue is a ring you can turn one step at a time: poll then offer moves the front element to the back and keeps everything else in order. Turning it `size − 1` times after adding x brings x, the element at the back, to the front.

#### Algorithm

1. `push(x)`: `q.offer(x)`; repeat `q.size() − 1` times: `q.offer(q.poll())`.
2. `pop()`: `q.poll()`. `top()`: `q.peek()`. `empty()`: `q.isEmpty()`.

#### Why it is correct

**Invariant:** between operations, the queue holds the stack's elements newest at the front, oldest at the back.

- Before `push(x)`, the queue reads e₁ (newest) … eₙ (oldest). After the offer: e₁ … eₙ, x. Rotating n times moves e₁ … eₙ, in that order, behind x: x, e₁ … eₙ. So x is the newest, at the front, and the old order is unchanged.
- `pop` removes the front, the newest; the rest stays newest-to-oldest. `top` reads it without changing anything.

**The 20-second version to say to the interviewer:**

> "I keep the queue in stack order, newest at the front. On push I add x at the back and rotate the n older elements past it, which puts x at the front without disturbing their order. Then pop and top just read the front. Push pays O(n); everything else is O(1)."

#### Dry run

| Call | Queue after `offer` | Rotations | Queue after (front → back) | Returned |
|---|---|---|---|---|
| `push(1)` | [1] | 0 | [1] | |
| `push(2)` | [1, 2] | 1: move 1 | [2, 1] | |
| `push(3)` | [2, 1, 3] | 2: move 2, then 1 | [3, 2, 1] | |
| `top()` | | | [3, 2, 1] | 3 |
| `pop()` | | | [2, 1] | 3 |
| `push(4)` | [2, 1, 4] | 2: move 2, then 1 | [4, 2, 1] | |
| `pop()` | | | [2, 1] | 4 |
| `empty()` | | | [2, 1] | `false` |

#### Java code

```java title="Approach 3: one queue (recommended)"
import java.util.ArrayDeque;
import java.util.Queue;

class MyStack {
    // Newest element at the front. Only offer, poll, peek, size and isEmpty are used.
    private final Queue<Integer> q = new ArrayDeque<>();

    public MyStack() {
    }

    public void push(int x) {
        q.offer(x);
        for (int i = q.size() - 1; i > 0; i--) {
            q.offer(q.poll()); // move the front to the back
        }
    }

    public int pop() {
        return q.poll();
    }

    public int top() {
        return q.peek();
    }

    public boolean empty() {
        return q.isEmpty();
    }
}
```

#### Time complexity

`push` is **O(n)**: n rotations, each one poll and one offer. `pop`, `top` and `empty` are **O(1)**. Over a sequence of m pushes into an initially empty stack, the rotations total 0 + 1 + … + (m − 1) = m(m − 1)/2, so O(m²); there is no amortized saving, because every push pays for the whole stack again.

#### Space complexity

**O(n)**: one queue of n elements, no second queue.

## 5. Comparison table

n = elements in the stack at the time of the call; each queue operation counted as O(1).

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Two queues, rotate on pop | push O(1); pop, top O(n) | same | O(n), two queues |
| 2. Two queues, rotate on push | push O(n); pop, top O(1) | same | O(n), two queues |
| 3. One queue, rotate after push | push O(n); pop, top O(1) | same | O(n), one queue |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Rotate on pop | Cheap pushes | Every `top` repeats a full rotation | Push-heavy workloads where pops are rare |
| 2. Rotate on push | Cheap reads | Needs a second queue for no real reason | As the stepping stone to Approach 3 |
| 3. One queue | Fewest lines; answers the follow-up; O(1) reads | O(n) push | Default answer |

None of these is better for every workload: a sequence of only pushes favours Approach 1, a sequence with many `top` calls favours 2 and 3. Unlike the queue-from-stacks problem, none of these versions gets amortized O(1): the work a rotation does is not saved, because the next push has to bring a different element to the front and rotates past the same elements again.

## 6. Which solution to give, and when to stop optimizing

Say Approach 1 in two sentences to show you see the trade-off, then code Approach 3: it is shorter than both two-queue versions, keeps reads O(1), and answers the follow-up before it is asked. Stop there. With at most 100 calls, no further optimization matters; what matters is that you state which operation is O(n) and why.

## 7. Interview script: code it and test it

### What I say while coding

> "I declare the field as `Queue<Integer>`, not `ArrayDeque`, so I can't accidentally use the back of the deque."

> "In push, I offer first, then rotate `size − 1` times. I compute the count from the size *after* the offer, minus one, which is the number of old elements."

> "pop, top and empty are one line each, because the queue is already in stack order."

### Testing out loud

**The example:** `push(1)`: [1]. `push(2)`: offer gives [1, 2]; one rotation gives [2, 1]. `top()` is 2, `pop()` is 2 leaving [1], `empty()` is `false`.

**One element:** `push(5)`: zero rotations, [5]. `pop()` returns 5; `empty()` is `true`.

**Empty, then reuse:** after that, `push(7)`, `top()` returns 7. Nothing is left over from earlier operations.

**`top()` twice:** on [3, 2, 1], both calls return 3 and the queue is unchanged, because `peek` does not remove.

**Interleaving:** the dry run's `push(4)` after a `pop` lands on [2, 1] and gives [4, 2, 1]: the order stays right after every call.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1–2 min | Which operations are allowed; whether `pop` on empty can happen |
| Trade-off | 2–3 min | Where the top lives in a queue; rotate on pop versus on push |
| Code | 4–5 min | One-queue version |
| Test | 2–3 min | Example, single element, reuse after empty |
| Complexity and follow-ups | 2 min | Which operation pays; why there's no amortized trick |

If you are stuck, draw [1, 2, 3] as a queue and ask out loud how to get the 3 to the front without losing 1 and 2.

## 9. Interviewer challenges

### About the design

#### Why not just call `pollLast()` on the `ArrayDeque`?

**What they are testing:** whether you respect the constraint, and know why it is there.

**How to reason:** a deque already is a stack; using its back end solves nothing that was asked.

**What I say:** "That would make it a deque-backed stack, which is what `ArrayDeque` already is. The exercise is to build stack order out of FIFO operations, so I only use offer, poll, peek, size and isEmpty, and I declare the field as `Queue` so the compiler holds me to it."

**Nuance:** in production code you would use `ArrayDeque` as a stack directly. This problem is about reasoning with a restricted interface.

#### Which of your versions would you choose for a real workload?

**What they are testing:** whether you tie the trade-off to the operation mix.

**How to reason:** count what each version costs on the expected sequence.

**What I say:** "If pushes vastly outnumber reads, rotate on pop. If `top` is called often, as in most stack algorithms that peek before deciding, rotate on push, because Approach 1 would redo its rotation on every peek. The one-queue version is the second kind with less memory."

**Nuance:** Approach 1 can cache the most recent push in a field so `top` is O(1); `pop` still has to rotate, and it must update the cached value to the new top, which it can do because the last element it moves to the helper is that new top.

### About complexity

#### Is your push amortized O(1)?

**What they are testing:** whether you confuse this with the queue-from-stacks trick.

**How to reason:** look at what a push leaves behind for the next one.

**What I say:** "No. Each push rotates the entire existing stack, and that work isn't saved for the future: the next push has to rotate everything again. m pushes cost m(m − 1)/2 rotations in total, so it's O(n) per push, worst case and on average over a push-only sequence."

**Nuance:** queue-from-stacks gets amortized O(1) because each element moves from one stack to the other at most once in its lifetime. Here an element is moved again on every later push.

## 10. Follow-up questions the interviewer might ask

**"Can you do it with one queue?"**
Yes, Approach 3: offer, then rotate `size − 1` times. Push O(n), the rest O(1), one queue of n elements.

**"Can you make `top` O(1) in the cheap-push version?"**
Keep a field `last` holding the most recently pushed element; `push` sets it. In `pop`, while moving elements to the helper, the last one moved before the newest is the new top, so set `last` to it. `top` becomes O(1); `pop` stays O(n).

**"What about the reverse, a queue from stacks?"**
Two stacks, and a lazy transfer from the input stack to the output stack only when the output is empty, gives amortized O(1) per operation; see [[nc-implement-queue-using-stacks|Implement Queue using Stacks]].

**"What if values were not 1 to 9?"**
Nothing changes; the values are only stored and returned, never inspected.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Calling the push O(1) amortized.** Each push rotates every element already there; the cost is O(n) every time.
- **Saying "O(1)" without saying which operations.** The point of the problem is that one operation pays O(n); name it.

### Implementation mistakes

> [!MISTAKE] Rotating `size()` times instead of `size() − 1`
> If push rotates `q.size()` times after the offer, the new element goes all the way round and ends up at the back again. After `push(1)`, `push(2)`, the queue is [1, 2], and `top()` returns 1.

- **Using `pollLast`, `peekLast` or `push` on the `ArrayDeque`.** `ArrayDeque.push` adds at the *front*; it is a stack operation and breaks the rule. Declaring the field as `Queue<Integer>` makes the compiler reject these calls.
- **In the two-queue rotate-on-pop version, forgetting the swap,** so the next call finds `main` empty and polls `null`.

## 12. Pattern recognition

**The pattern:** simulating one access discipline with another by moving elements between, or around, containers, and choosing which operation pays for the reordering.

**Signals in the problem statement:**

- "Implement X using only Y" with a restricted list of allowed operations.
- A follow-up that asks for fewer containers or a better per-operation cost.

**Related problems in this list:**

- [[nc-implement-queue-using-stacks|Implement Queue using Stacks]]: the mirror problem, where a lazy transfer does give amortized O(1).
- [[nc-min-stack|Min Stack]]: another stack class with an extra guarantee, built from simple parts.
- [[nc-design-circular-queue|Design Circular Queue]]: a queue built by hand on a fixed array.
- [[nc-valid-parentheses|Valid Parentheses]]: the canonical use of the stack you just built.

**Takeaway:** a queue can bring any element to its front by rotation (poll, then offer); rotating once per push keeps it in stack order, so the push pays O(n) and every read is O(1).

## 13. 60-second revision card

**Key insight:** poll-then-offer rotates a queue without losing anything. After offering x, rotate `size − 1` times and x is at the front.

**Invariant:** the queue holds the stack newest at the front.

**Complexity:** push O(n), pop/top/empty O(1), O(n) space. Two-queue rotate-on-pop is the mirror: push O(1), pop/top O(n).

**Code skeleton:**

```java title="One-queue stack, core"
import java.util.ArrayDeque;
import java.util.Queue;

class MyStack {
    private final Queue<Integer> q = new ArrayDeque<>();

    public void push(int x) {
        q.offer(x);
        for (int i = q.size() - 1; i > 0; i--) q.offer(q.poll()); // bring x to the front
    }

    public int pop() { return q.poll(); }
    public int top() { return q.peek(); }
    public boolean empty() { return q.isEmpty(); }
}
```

**Main traps:**

- Rotate `size − 1` times, not `size`.
- Only queue operations: declare the field as `Queue`.
- Push is O(n) every time, not amortized O(1).

**What to say in one breath:** "A queue can rotate: poll the front and offer it to the back. On push I offer x and rotate the older elements past it, so the queue always reads newest first. Pop and top read the front in O(1); push pays O(n)."
