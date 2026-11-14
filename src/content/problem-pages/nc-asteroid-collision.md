---
problemId: nc-asteroid-collision
title: Asteroid Collision
source: neetcode
sourceUrl: https://leetcode.com/problems/asteroid-collision/
difficulty: medium
patterns: [stack, simulation]
relatedLessons: [a5-stack, a5-monotonic-stack, a14-brute-force-first, a14-edge-cases, a14-manual-testing]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

A row of asteroids is given as an array of non-zero integers. The absolute value of each number is the asteroid's size and the sign is its direction: positive moves right, negative moves left. All asteroids move at the same speed. When two asteroids meet, the smaller one explodes; if they are the same size, both explode. Two asteroids moving in the same direction never meet. Return the asteroids that are left once no more collisions can happen, in their original left-to-right order.

**Example 1**

- Input: `asteroids = [3, 9, -4, 2, -7]`
- Output: `[3, 9]`
- Why: the `-4` runs into the `9` and explodes. The `-7` runs into the `2` and destroys it, then keeps going and runs into the `9`, which is bigger, so the `-7` explodes. The `3` and the `9` both move right and never meet anything again.

**Example 2**

- Input: `asteroids = [-2, -1, 1, 2]`
- Output: `[-2, -1, 1, 2]`
- Why: the two left-movers are on the left and the two right-movers are on the right. The groups fly apart, and within each group everyone moves at the same speed, so nothing ever collides.

A third small one worth keeping in mind: `[8, -8]` returns `[]`, because equal sizes destroy each other.

**What the problem statement guarantees**

- 2 ≤ `asteroids.length` ≤ 10^4.
- −1000 ≤ `asteroids[i]` ≤ 1000, and `asteroids[i]` is never 0.
- Every asteroid moves at the same speed.
- The smaller of two colliding asteroids explodes; equal sizes both explode; same-direction asteroids never meet.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 20 minutes and talk out loud.
2. Before designing anything, decide which pairs of asteroids can ever meet. Draw two arrows for each of the four sign combinations.
3. Solve `[1, 2, 3, -4]` and `[5, -1, -2, -3]` by hand and notice which asteroid you keep looking at.
4. Say the simplest correct simulation and its cost, then look for the repeated work.
5. Write the code and trace it on `[-2, -1, 1, -2]`, where the answer is `[-2, -1, -2]`.

Open a hint only after two minutes without progress.

> [!HINT] Hint 1: a small nudge
> Of the four direction combinations for two neighbours (left one, right one), only one can ever produce a collision. Which one? Once you know that, a new asteroid arriving from the right can only interact with the survivors to its left.

> [!HINT] Hint 2: the kind of tool you need
> When a left-mover arrives, the first survivor it can hit is the nearest one to its left, and if it wins, the next one it can hit is the one before that. You only ever look at the most recent survivor. Which data structure gives you "the most recently added item" and lets you remove it?

> [!HINT] Hint 3: almost the whole plan
> Process asteroids left to right and keep the survivors in a stack. A right-mover is pushed. A left-mover keeps destroying smaller right-movers on top of the stack; it stops when the top is a bigger right-mover (it explodes), an equal right-mover (both explode), a left-mover, or nothing (in the last two cases it is pushed). The stack, bottom to top, is the answer.

**Check yourself before revealing the walkthrough**

- [ ] I can explain why `[-3, 4]` never collides but `[4, -3]` does
- [ ] My code returns `[]` for `[8, -8]` and `[-4]` for `[1, 2, 3, -4]`
- [ ] My code returns `[-2, -1, 1, 2]` unchanged
- [ ] I can say why my solution is linear even though it has a loop inside a loop

## 3. Interview script: understand the problem (≈3 min)

**Me:** Let me restate it. Each number is an asteroid: the magnitude is its size, the sign its direction, positive to the right. They all move at the same speed. When two meet, the smaller explodes, equal sizes both explode. I return what survives, in the original order. Right?

**Interviewer:** Yes.

**Me:** First I want to know which pairs can actually meet. Two asteroids moving the same way at the same speed keep the same distance forever, so they never meet. If the left one moves left and the right one moves right, they fly apart. The only meeting is a right-mover that has a left-mover somewhere to its right: they approach each other. So a collision is always "positive on the left, negative on the right". Does that match your understanding?

**Interviewer:** It does.

**Me:** Then the asteroids at the far left that move left, and the ones at the far right that move right, are safe. Can a size be zero?

**Interviewer:** No, every value is non-zero, between −1000 and 1000.

**Me:** Good, so every asteroid has a direction, and negating a value cannot overflow. The array has at least two elements and at most 10^4?

**Interviewer:** Yes.

**Me:** What should I return if everything explodes? An empty array?

**Interviewer:** Yes, an empty array.

**Me:** And I shouldn't care about the timing of the collisions, only the final state?

**Interviewer:** Only the final state.

**Me:** One more. I'll return a new array and leave the input untouched unless you'd like me to reuse it.

**Interviewer:** A new array is fine.

**Me:** Let me do one by hand: `[3, 9, -4, 2, -7]`. The `-4` meets the `9` first (it is the nearest thing on its left) and loses. The `-7` meets the `2` and wins, then meets the `9` and loses. So `[3, 9]`.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| Collisions only between a right-mover on the left and a left-mover on the right | The whole problem reduces to resolving "positive then negative" pairs. Equal directions and "negative then positive" pairs are never touched. |
| Smaller explodes; equal sizes both explode | Three outcomes per collision, and the equal case removes two asteroids. That third branch is the easiest one to get wrong. |
| 2 ≤ n ≤ 10^4 | Even an O(n²) simulation is about 10^8 simple steps at worst, slow but feasible. A linear solution is the goal. |
| −1000 ≤ value ≤ 1000, value ≠ 0 | Every asteroid has a direction, and `-a` fits in an `int` with room to spare. No overflow reasoning needed. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Everything exploding returns an empty array | The result can be shorter than the input, down to length 0. |
| Only the final state matters, not when collisions happen | I can resolve collisions in whatever order is convenient, as long as I can argue the result is the same. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| I return a new array and do not modify the input | Not specified. Reusing the input as the stack is a possible space trick (see the follow-ups). |
| The survivors keep their original relative order | The examples show it, and asteroids never pass through each other, so order is preserved physically. |

### Edge cases I will keep in mind

- No collisions at all: all one direction, or `[-2, -1, 1, 2]` (left-movers first).
- Equal sizes: `[8, -8]` gives `[]`.
- One left-mover destroying a chain: `[1, 2, 3, -4]` gives `[-4]`.
- A chain stopping at an equal size: `[1, 2, 3, -3]` gives `[1, 2]`.
- One right-mover absorbing a chain: `[5, -1, -2, -3]` gives `[5]`.
- A winning left-mover that ends up next to older left-movers: `[-2, -1, 1, -2]` gives `[-2, -1, -2]`.

## 4. Think out loud: from first idea to best solution

### Approach 1: Repeated passes (simulate until stable)

#### What I say out loud

> "The simplest thing I trust is to imitate the physics. Any adjacent pair 'positive, then negative' is about to collide, so I scan the row, resolve every such adjacent pair I see, and write down the survivors. Then I scan again, because a winner may now be next to a new opponent. When a full pass changes nothing, the row is stable and I'm done."

> "Each pass that changes anything removes at least one asteroid, so there are at most n passes of O(n) each. Quadratic, but correct, and it gives me something to improve."

#### Intuition

A right-mover and the left-mover directly to its right, with nothing between them, are certain to hit each other: nothing else can reach either of them first. So resolving any such adjacent pair is a step the real system will also take, and repeating until no such pair exists reaches the true final state.

#### Algorithm

1. Copy the input into `current`.
2. Repeat until a pass changes nothing:
3. Scan `current` left to right into a new array `next`. If `current[i] > 0` and `current[i + 1] < 0`, resolve the pair: keep the bigger one (or neither if equal), and skip both positions. Otherwise copy `current[i]` and move on.
4. Return `current`.

#### Why it is correct

- **Every step is real.** Take an adjacent pair: a right-mover R with a left-mover L directly to its right. Everything to R's left either moves left (away from R) or moves right at R's speed (never catching up). Everything to L's right either moves right (away) or moves left at L's speed. So R and L are each other's first encounter, and the collision between them happens exactly as the pass resolves it.
- **It stops at the right place.** A pass with no change means no adjacent "positive, then negative" pair exists. Then the row is some left-movers followed by some right-movers, and as argued in section 3 none of those can ever meet.
- **It stops at all.** A pass that changes something removes at least one asteroid, and there are only n.

#### Dry run

`asteroids = [4, 7, -5, 1, -8, -3]`

| Pass | Row before the pass | Collisions resolved | Row after the pass |
|---|---|---|---|
| 1 | `[4, 7, -5, 1, -8, -3]` | 7 vs −5 (7 wins), 1 vs −8 (−8 wins) | `[4, 7, -8, -3]` |
| 2 | `[4, 7, -8, -3]` | 7 vs −8 (−8 wins) | `[4, -8, -3]` |
| 3 | `[4, -8, -3]` | 4 vs −8 (−8 wins) | `[-8, -3]` |
| 4 | `[-8, -3]` | none | stop, return `[-8, -3]` |

The `-8` won three collisions, one per pass, while each pass rescanned everything else.

#### Java code

```java title="Approach 1: repeated passes"
import java.util.Arrays;

class Solution {
    public int[] asteroidCollision(int[] asteroids) {
        int[] current = asteroids.clone();
        int size = current.length;
        boolean changed = true;
        while (changed) {
            changed = false;
            int[] next = new int[size];
            int nextSize = 0;
            int i = 0;
            while (i < size) {
                int a = current[i];
                if (a > 0 && i + 1 < size && current[i + 1] < 0) {
                    int b = current[i + 1];
                    changed = true;
                    if (a > -b) {
                        next[nextSize++] = a;      // the right-mover wins
                    } else if (a < -b) {
                        next[nextSize++] = b;      // the left-mover wins
                    }                              // equal: neither survives
                    i += 2;
                } else {
                    next[nextSize++] = a;
                    i++;
                }
            }
            current = next;
            size = nextSize;
        }
        return Arrays.copyOf(current, size);
    }
}
```

#### Time complexity

**O(n²) in the worst case**, where n is the number of asteroids. Each pass is O(n). A pass that changes anything removes at least one asteroid, so there are at most n changing passes plus one final pass. The bound is reached: on `[1, 1, …, 1, -1000]` each pass resolves only the last pair, so the `-1000` destroys one `1` per pass and the run takes n passes. For n = 10^4 that is on the order of 5 × 10^7 element copies.

#### Space complexity

**O(n) auxiliary space**: the working copy and the `next` array of each pass (the old one becomes garbage). The returned array is output and not counted.

#### The bridge to the next approach

> "Where does the time go? In my dry run the `-8` destroyed three asteroids, but it took three full passes, and each pass copied every other asteroid even though nothing happened to them. The only place where anything changes is right where the winner stands."

> "So let me look at it from the point of view of one new asteroid arriving from the right. If everything to its left is already stable, the only thing it can hit is the nearest survivor on its left. If it destroys that one, the next thing it can hit is the survivor before that. I keep touching the most recent survivor, and I remove it when it loses. Last in, first out: that's a stack."

### Approach 2: Stack of survivors (recommended)

#### What I say out loud

> "I process asteroids left to right and keep the survivors so far on a stack, which is always a stable row: no right-mover sits below a left-mover. A right-mover can't hit anything on its left, so I just push it. A left-mover fights the top of the stack while the top is a right-mover: if the top is smaller, it explodes and I keep going; if they're equal, both go and I stop; if the top is bigger, the newcomer explodes. If the newcomer survives, meaning the stack is empty or its top is a left-mover, I push it."

> "Each asteroid is pushed at most once and popped at most once, so even though there's a while loop inside the for loop, the total work is linear."

#### Intuition

The survivors of a prefix always look like a block of left-movers followed by a block of right-movers, because any other arrangement would still contain a collision. A new right-mover cannot touch that block. A new left-mover eats into the right-movers from the top, nearest first, which is exactly how a stack is consumed. This is the stack-as-history idea from [[a5-stack|Stack]].

#### Algorithm

1. Create an empty stack (an `int` array with a `size` counter).
2. For each asteroid `a`, from left to right:
3. Set `alive = true`. While `alive`, `a < 0`, the stack is not empty and its top is positive:
   - if `top < -a`: pop (the top explodes) and continue;
   - if `top == -a`: pop and set `alive = false` (both explode);
   - otherwise set `alive = false` (`a` explodes).
4. If `alive`, push `a`.
5. Return the stack from bottom to top.

#### Why it is correct

**The invariant:** after processing a prefix of the input, the stack holds exactly the asteroids of that prefix that survive all collisions among themselves, in order, and contains no right-mover below a left-mover (it is stable).

- **It starts true:** the empty stack is the result of the empty prefix.
- **A right-mover keeps it:** everything on the stack is to its left, and nothing to its left can hit a right-mover (same direction at the same speed, or moving away). Pushing it keeps the stack stable, because nothing sits above it.
- **A left-mover keeps it:** the asteroids on the stack cannot hit each other any more, so the only collisions left are between the newcomer and the right-movers at the top. The newcomer meets the nearest one first, then (if it wins) the next, which is exactly the pop order. It stops at a bigger or equal right-mover, or at a left-mover or the bottom, which it can never hit. If it survives, it lands above left-movers only, so the stack is still stable.
- **Why processing one asteroid at a time is allowed:** the newcomer and the top of the stack are neighbours in the current row, with nothing between them. Approach 1 showed that such a neighbouring "right-mover, then left-mover" pair is each other's first encounter, so every collision the stack resolves is one that really happens, with the outcome it really has. The stack is just one particular order of resolving real collisions, and an asteroid further right cannot interfere, because it can only reach the stacked asteroids by passing the newcomer first.

After the last asteroid, the stack is the stable survivor set of the whole input: the answer.

**The 25-second version to say to the interviewer:**

> "Collisions only happen between a right-mover and a left-mover to its right. My stack always holds a stable row: left-movers at the bottom, right-movers on top. A new right-mover can't hit anything, so I push it. A new left-mover meets the right-movers on top in nearest-first order, which is pop order, until it dies or reaches a left-mover or the bottom. Every asteroid is pushed and popped at most once, so it's linear."

#### Dry run

`asteroids = [4, 7, -5, 1, -8, -3]` (the input from Approach 1)

| Asteroid | Stack before (bottom → top) | What happens | Stack after |
|---|---|---|---|
| 4 | `[]` | right-mover, push | `[4]` |
| 7 | `[4]` | right-mover, push | `[4, 7]` |
| −5 | `[4, 7]` | top 7 > 5: −5 explodes | `[4, 7]` |
| 1 | `[4, 7]` | right-mover, push | `[4, 7, 1]` |
| −8 | `[4, 7, 1]` | 1 < 8 pop; 7 < 8 pop; 4 < 8 pop; stack empty, push | `[-8]` |
| −3 | `[-8]` | top is a left-mover, push | `[-8, -3]` |

Result `[-8, -3]`, the same as Approach 1, but the `-8` did its three collisions in one visit.

#### Java code

```java title="Approach 2: stack of survivors (recommended)"
import java.util.Arrays;

class Solution {
    public int[] asteroidCollision(int[] asteroids) {
        int[] stack = new int[asteroids.length];   // survivors so far, bottom at index 0
        int size = 0;
        for (int a : asteroids) {
            boolean alive = true;
            // Only a left-mover can hit something, and only a right-mover on top of the stack.
            while (alive && a < 0 && size > 0 && stack[size - 1] > 0) {
                int top = stack[size - 1];
                if (top < -a) {
                    size--;                // the top explodes; a keeps going
                } else if (top == -a) {
                    size--;                // both explode
                    alive = false;
                } else {
                    alive = false;         // a explodes
                }
            }
            if (alive) {
                stack[size++] = a;
            }
        }
        return Arrays.copyOf(stack, size);
    }
}
```

An `int` array with a counter is the stack here: it avoids boxing, and the result is the first `size` slots, already in bottom-to-top order. An `ArrayDeque<Integer>` works too, but then you have to read it back in the right order (`descendingIterator` when you `push`, or `addLast`/`pollLast` and a normal iteration).

#### Time complexity

**O(n) in the worst case.** The for loop runs n times. Each iteration of the inner while loop either pops an asteroid or ends the loop. Every asteroid is pushed at most once, so at most n pops happen over the whole run, and at most n loop exits. Total work is at most about 3n steps plus the final copy.

#### Space complexity

**O(n) auxiliary space** for the stack array. In the worst case (no collisions) it holds all n asteroids. The returned copy is output. If the output array is allowed to double as the stack, you could say the extra space beyond the output is O(1), but with a fixed-size Java array you cannot know the output length in advance, so the copy is needed.

## 5. Comparison table

n = number of asteroids. Neither approach hashes or randomizes, so expected and worst case coincide.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Repeated passes | O(n²) | O(n²) | O(n) |
| 2. Stack of survivors | O(n) | O(n) | O(n) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Repeated passes | Mirrors the physics, easy to argue | Quadratic; one big winner costs one pass per victim | As the spoken baseline only |
| 2. Stack of survivors | Linear, short, one pass | The three-way collision branch is easy to get wrong | The answer to give |

## 6. Which solution to give, and when to stop optimizing

**Give the stack (Approach 2).** It is linear, and that is optimal: any correct algorithm must, in the worst case, look at essentially every asteroid, since an unread value could be a huge left-mover that wipes out everything before it. That gives an Ω(n) worst-case lower bound. Space cannot drop below the output itself, which can be all n asteroids.

Mention the repeated-pass idea in one or two sentences as the baseline and do not code it unless asked. Once the stack version is written, spend the remaining time on the equal-size case and on tracing `[1, 2, 3, -4]` and `[-2, -1, 1, 2]`, not on micro-optimizations.

## 7. Interview script: code it and test it

### What I say while coding

> "The stack is an int array with a size counter. Its first `size` slots are the survivors, bottom to top, which is already the output order."

> "For each asteroid, a flag `alive`. The while condition says exactly when a collision can happen: the newcomer moves left, and the top exists and moves right."

> "Three branches: the top is smaller, pop and continue; equal, pop and the newcomer dies too; bigger, the newcomer dies. I keep the equal case separate because it is the one that removes two asteroids."

> "After the loop, push if still alive, and at the end copy the first `size` slots."

### Testing out loud

**Normal case:** `[3, 9, -4, 2, -7]`. Push 3, push 9. `-4`: top 9 > 4, `-4` dies. Push 2. `-7`: top 2 < 7, pop; top 9 > 7, `-7` dies. Stack `[3, 9]`. Correct.

**No collisions:** `[-2, -1, 1, 2]`. `-2`: stack empty, push. `-1`: top is negative, the while condition fails, push. 1 and 2 are right-movers, push. Unchanged. Correct, and it shows why the condition checks the top's sign.

**Equal sizes:** `[8, -8]`. Push 8. `-8`: top 8 equals 8, pop, `alive = false`. Empty array. Correct.

**Chain destroyed:** `[1, 2, 3, -4]`. `-4` pops 3, 2, 1, stack empty, push. `[-4]`. Correct; an `if` instead of the `while` would leave `[1, 2, -4]`.

**Chain stops at an equal:** `[1, 2, 3, -3]`. `-3` meets 3, equal, both go, stop. `[1, 2]`. Correct.

**One right-mover absorbs a chain:** `[5, -1, -2, -3]`. Each left-mover meets 5 and dies. `[5]`. Correct.

**Winner lands on old left-movers:** `[-2, -1, 1, -2]`. `-2`, `-1` pushed; 1 pushed; `-2` pops 1, then the top is `-1`, a left-mover, so it stops and is pushed. `[-2, -1, -2]`. Correct.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 2–3 min | Which pairs collide and why; empty result allowed |
| Baseline | 1 min | Repeated passes, O(n²), not coded |
| Derive the stack | 2–3 min | "A newcomer only ever touches the most recent survivor" |
| Say why it works | 1 min | Stable-stack invariant, each element pushed and popped once |
| Code | 5 min | One loop, the three-way branch |
| Trace and edge cases | 3–4 min | Equal sizes, chain destroyed, no collisions |
| Complexity and follow-ups | the rest | Amortized argument for O(n) |

The time that matters most is the first two minutes: if you get the "only positive-then-negative collides" fact straight, the code follows. If the stack idea does not come, solve `[1, 2, 3, -4]` by hand and say which asteroid you look at each time: it is always the last survivor, and naming that out loud usually unlocks it.

## 9. Interviewer challenges

### About correctness

#### Why do you never pop when the top is negative and the newcomer is positive?

**What they are testing:** whether you understand which directions collide, or are just checking "opposite signs".

**How to reason:** draw it. A left-mover on the left and a right-mover on the right move apart forever.

**What I say:** "A negative asteroid on the stack is to the left of the newcomer and moving left; the positive newcomer moves right. They separate, so they never meet. Only a right-mover with a left-mover to its right can collide, which is why the condition is `a < 0` and `top > 0`, not just 'signs differ'."

**Nuance:** checking only "signs differ" is a real bug: on `[-2, -1, 1, 2]` it destroys everything and returns `[]` instead of the input.

#### Why is it correct to resolve collisions in this order, when in reality several happen at once?

**What they are testing:** whether you can justify that the processing order does not change the final state.

**How to reason:** look at what a newcomer can reach first. Nothing can overtake it, and the stack below it is stable, so the nearest right-mover on the stack is the first thing it meets.

**What I say:** "The answer depends only on who meets whom, not on when. A right-mover and a left-mover with nothing between them are each other's first encounter, because everything else moves away or at the same speed. My stack only ever resolves such adjacent pairs, so each collision I process is one that really happens, with the same outcome."

**Nuance:** this is why Approach 1, which resolves pairs in a different order, gets the same answer, and why the reference in the tests can use yet another order.

### About complexity

#### There's a while loop inside a for loop. Why isn't it O(n²)?

**What they are testing:** amortized analysis.

**How to reason:** charge each inner-loop iteration to something that happens at most once per asteroid.

**What I say:** "Each inner iteration either pops an asteroid or ends the loop. An asteroid is pushed at most once, so it can be popped at most once: at most n pops in total across the whole run, and at most n loop exits, one per asteroid. So the total is O(n), even though a single asteroid can trigger many pops."

**Nuance:** a single step can cost O(n) (the `-1000` in `[1, …, 1, -1000]`), so the per-step bound is linear but the total is still linear: that is what amortized means.

#### Can you do it in O(1) extra space?

**What they are testing:** whether you see that the stack can live in the input.

**How to reason:** the stack never has more elements than the number of asteroids read so far, so its slots can overwrite positions already processed.

**What I say:** "If I'm allowed to modify the input, yes: use the input array itself as the stack, with a write index that never passes the read index, and return a copy of the first `size` slots. The extra space beyond the output is then O(1). I'd only do that if you say mutating the input is fine."

**Nuance:** the returned array still costs O(size) because Java arrays have fixed length.

## 10. Follow-up questions the interviewer might ask

**"What if asteroids could have different speeds?"**
Then a faster right-mover can catch a slower one, and the order of collisions depends on time. The stack no longer works. You need an event simulation: compute the meeting time of every adjacent pair, process the earliest with a priority queue, and recompute only the times for the new neighbours, as in event-driven simulations: O(n log n).

**"What if I want the number of collisions, or the indices of the asteroids that exploded?"**
Every iteration of the inner while loop is exactly one collision, so a counter there gives the count. For the indices, push indices instead of values (compare `asteroids[stack[top]]`) and record an index whenever it is popped or the newcomer dies. Still O(n) time and O(n) space.

**"What if the asteroids arrive one at a time and you must report survivors after each?"**
The stack is already an online algorithm: each arrival does its amortized O(1) work, and the stack is the current state. This is the same shape as [[nc-online-stock-span|Online Stock Span]].

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **"Opposite signs collide."** Only a positive followed by a negative does. A negative followed by a positive moves apart.
- **Thinking order of processing could matter.** It does not, but you should be able to say why (adjacent opposite movers are each other's first encounter).
- **Calling the nested loop O(n²).** Count pushes and pops instead of loop nesting.

### Implementation mistakes

> [!MISTAKE] `if` instead of `while`
> A left-mover may destroy several right-movers. With a single `if`, `[1, 2, 3, -4]` returns `[1, 2, -4]` instead of `[-4]`.

> [!MISTAKE] Merging the equal case into "pop and continue"
> Writing `if (top <= -a) pop` lets the newcomer survive an equal collision: `[8, -8]` returns `[-8]` instead of `[]`. Equal sizes remove both.

- **Checking "signs differ" instead of "top positive, newcomer negative".** `[-2, -1, 1, 2]` then returns `[]`.
- **Reading an `ArrayDeque` in the wrong order.** With `push`, iteration goes top to bottom, so the result comes out reversed.
- **Forgetting to push the survivor** after the while loop ends because the top was a left-mover or the stack was empty.

## 12. Pattern recognition

**The pattern:** a stack as a "stable history". Process items left to right; each new item can only interact with the most recent unresolved item, and resolving it may expose the next one.

**Signals in the problem statement:**

- Items interact only with their nearest surviving neighbour on one side.
- One new item can cancel or absorb several earlier ones, nearest first.
- The answer is "what remains after all cancellations".

**Related problems in this list:**

- [[nc-valid-parentheses|Valid Parentheses]]: a closing bracket cancels the most recent unmatched opener.
- [[nc-daily-temperatures|Daily Temperatures]]: a warmer day resolves every cooler day on top of the stack.
- [[nc-car-fleet|Car Fleet]]: cars that catch up merge into the fleet ahead, a collision-style stack.
- [[nc-online-stock-span|Online Stock Span]]: a new price absorbs the smaller prices on top of the stack.
- [[nc-evaluate-reverse-polish-notation|Evaluate Reverse Polish Notation]]: an operator consumes the two most recent values.

**Takeaway:** when a new element can only affect the latest survivors and may wipe out several of them in a row, keep the survivors on a stack and let the newcomer pop until it stops.

## 13. 60-second revision card

**Key insight:** only a right-mover with a left-mover to its right can collide. A new left-mover meets the right-movers to its left nearest first, which is stack order.

**Invariant:** the stack is a stable state: left-movers at the bottom, right-movers on top, no right-mover below a left-mover.

**Complexity:** O(n) time (each asteroid pushed and popped at most once), O(n) auxiliary space.

**Code skeleton:**

```java title="Asteroid Collision core" fragment="public int[] asteroidCollision(int[] asteroids)"
int[] stack = new int[asteroids.length];
int size = 0;
for (int a : asteroids) {
    boolean alive = true;
    while (alive && a < 0 && size > 0 && stack[size - 1] > 0) {
        int top = stack[size - 1];
        if (top <= -a) size--;          // top explodes (also when equal)
        if (top >= -a) alive = false;   // a explodes (also when equal)
    }
    if (alive) stack[size++] = a;
}
return Arrays.copyOf(stack, size);
```

**Main traps:**

- `while`, not `if`: one left-mover can destroy many.
- Equal sizes: both explode.
- Negative below positive is not a collision.
- Read the stack bottom to top for the answer.

**What to say in one breath:** "Only positive-then-negative collides. I keep survivors on a stack; right-movers are pushed, a left-mover pops smaller right-movers until it dies, ties, or reaches a left-mover or the bottom, then is pushed if alive. Each asteroid is pushed and popped once, so O(n) time and O(n) space."
