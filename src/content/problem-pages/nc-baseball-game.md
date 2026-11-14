---
problemId: nc-baseball-game
title: Baseball Game
source: neetcode
sourceUrl: https://leetcode.com/problems/baseball-game/
difficulty: easy
patterns: [stack, simulation]
relatedLessons: [a5-stack, a14-edge-cases, a14-manual-testing]
companies: []
timeToSolve: 10
---

## 1. Problem restatement

You keep a record of scores that starts empty, and you are given a list of operations to apply in order. Each operation is one of:

- an integer `x`: add the score `x` to the record;
- `"+"`: add a new score equal to the sum of the previous two scores;
- `"D"`: add a new score equal to double the previous score;
- `"C"`: remove the previous score from the record.

After all operations, return the sum of the scores left in the record.

**Example 1**

- Input: `operations = ["5","2","C","D","+"]`
- Output: `30`
- Why: the record goes `[5]`, `[5, 2]`, `[5]` (the `2` is cancelled), `[5, 10]` (double of 5), `[5, 10, 15]` (10 + 5). The sum is 30.

**Example 2**

- Input: `operations = ["5","-2","4","C","D","9","+","+"]`
- Output: `27`
- Why: the record ends as `[5, -2, -4, 9, 5, 14]`. "Previous score" always means the last score still in the record, so after `"C"` removes the `4`, `"D"` doubles the `-2`.

**Example 3**

- Input: `operations = ["1","C"]`
- Output: `0`
- Why: the only score is removed, and the sum of an empty record is 0.

**What the problem statement guarantees**

- 1 ≤ `operations.length` ≤ 1000.
- Each operation is `"C"`, `"D"`, `"+"`, or a string representing an integer in [−3 × 10^4, 3 × 10^4].
- For `"+"` there are always at least two previous scores; for `"C"` and `"D"` there is always at least one. Every operation is valid.
- The answer and all intermediate calculations fit in a 32-bit integer.

## 2. Practice first: try it before reading on

This one is mostly about choosing the right container and handling `"C"` cleanly. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Give yourself 10 minutes and talk out loud.
2. Decide what you store, then write the four cases.
3. Trace your code on Example 2 by hand, writing the record after every step.

> [!HINT] Hint 1: a small nudge
> Every operation only ever looks at, adds to, or removes from the same end of the record. What does that tell you about the container you need?

> [!HINT] Hint 2: the kind of tool you need
> A last-in, first-out structure gives you "the previous score" and "remove the previous score" in constant time. `"+"` needs the top two; how do you read the second one without losing the first?

> [!HINT] Hint 3: almost the whole plan
> Keep the scores in an array used as a stack, with a size counter. Integers push, `"D"` pushes twice the top, `"+"` pushes the sum of the top two, `"C"` pops. Either sum the stack at the end or keep a running total, remembering to subtract what `"C"` removes.

**Check yourself before revealing the walkthrough**

- [ ] My code returns 27 on Example 2 and 0 on `["1","C"]`
- [ ] `"+"` leaves both of the scores it added still in the record
- [ ] I compare operation strings with `equals` or a `switch`, not `==`
- [ ] I can explain why `int` is safe for the total

## 3. Interview script: understand the problem (≈2 min)

**Me:** So it's a simulation. I apply the operations in order to a record of scores and return the sum at the end. "Previous score" means the last score still in the record, not the last operation, so after a `"C"`, `"D"` and `"+"` look at what's left.

**Interviewer:** Right.

**Me:** And `"+"` adds a new score; it doesn't replace the two it summed. So `[5, 10]` becomes `[5, 10, 15]`.

**Interviewer:** Yes.

**Me:** The statement says every operation is valid, so I never have to handle `"+"` with fewer than two scores or `"C"` on an empty record. Integer strings can be negative, like `"-2"`, so I'll parse with `Integer.parseInt`, which handles the sign.

**Interviewer:** Fine.

**Me:** Quick run of Example 1: push 5, push 2, `C` pops the 2, `D` pushes 10, `+` pushes 15. Sum 30.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 1000 operations | Anything linear is instant. The record never holds more than n scores, so a plain `int[n]` is big enough. |
| Integers in [−3 × 10^4, 3 × 10^4], possibly negative | `Integer.parseInt` handles the leading `-`. Operators are whole one-character strings, so matching the full string (a `switch` or `equals`) separates them from numbers; a first-character test would not. |
| Every operation is valid | No empty-record checks are needed before `"+"`, `"D"` or `"C"`. |
| The answer and all intermediate calculations fit in 32 bits | `int` is enough for every score and for the answer. See the note on the running total below. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| "Previous score" means the top of the current record | `"D"` and `"+"` read the record, not the operation history. |
| `"+"` and `"D"` add a score; they do not replace any | The two summed scores stay in the record. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| I may allocate an array of size n | It is at most 1000 ints. I state it because it lets me avoid boxing. |

### Edge cases I will keep in mind

- Everything cancelled, `["1","C"]`: the answer is 0.
- Negative scores, `"-2"`, and doubling a negative score.
- `"+"` right after a `"C"`, which must use the scores still in the record.
- The largest score values the 32-bit guarantee allows.

## 4. Think out loud: from first idea to best solution

### Approach 1: Simulate with a stack, sum at the end

#### What I say out loud

> "All four operations touch only the most recent score, so the record is a stack. I'll use an `ArrayDeque<Integer>`: push for a number, push double the top for `D`, pop for `C`. For `+` I pop the top, peek the one below, push the top back, then push the sum. At the end I add everything up."

#### Intuition

The record is only ever changed or read at its newest end. A stack gives exactly those operations in constant time each.

#### Algorithm

1. Create an empty stack.
2. For each operation:
   - `"+"`: pop `last`, peek `second`, push `last` back, push `last + second`.
   - `"D"`: push `2 × peek()`.
   - `"C"`: pop.
   - otherwise: push `Integer.parseInt(op)`.
3. Return the sum of everything on the stack.

#### Why it is correct

At every step the stack holds exactly the record the statement describes, top = most recent score. Each branch performs that operation's definition on the top of the record. The "valid operations" guarantee means `pop` and `peek` never act on an empty stack. The final loop adds every score in the record once.

#### Dry run

`operations = ["5","2","C","D","+"]` (stack shown bottom to top)

| Operation | Action | Record |
|---|---|---|
| `"5"` | push 5 | [5] |
| `"2"` | push 2 | [5, 2] |
| `"C"` | pop | [5] |
| `"D"` | push 2 × 5 | [5, 10] |
| `"+"` | pop 10, peek 5, push 10, push 15 | [5, 10, 15] |
| end | sum | 30 |

#### Java code

```java title="Approach 1: stack of scores, summed at the end"
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int calPoints(String[] operations) {
        Deque<Integer> record = new ArrayDeque<>();
        for (String op : operations) {
            switch (op) {
                case "+": {
                    int last = record.pop();
                    int sum = last + record.peek();
                    record.push(last);
                    record.push(sum);
                    break;
                }
                case "D":
                    record.push(2 * record.peek());
                    break;
                case "C":
                    record.pop();
                    break;
                default:
                    record.push(Integer.parseInt(op));
            }
        }
        int total = 0;
        for (int score : record) {
            total += score;
        }
        return total;
    }
}
```

#### Time complexity

**O(n + L) in every case**, where n is the number of operations and L their total length in characters (parsing reads each digit once). With the stated constraints each integer string has at most 6 characters, so this is O(n). Each `ArrayDeque` push and pop is amortised constant time, and the final sum is over at most n scores.

#### Space complexity

**O(n) auxiliary space**: the stack holds at most n boxed scores.

#### The bridge to the next approach

> "That's already linear, so there's nothing asymptotic left. Two small things I can tidy: the stack can be an `int[]` with a size counter, since I know it never exceeds n, which avoids boxing every score; and I can keep a running total as I go, adding what I push and subtracting what `C` pops, so the answer is ready the moment the loop ends."

### Approach 2: Array stack with a running total (recommended)

#### What I say out loud

> "Same simulation, but the stack is `int[] scores` with `size`, and I keep `total` up to date. Every push adds the pushed value to `total`; `C` subtracts the value it removes. The `+` case also gets simpler with an array: I can read `scores[size - 1]` and `scores[size - 2]` without popping anything."

#### Intuition

The sum of the record changes by exactly the score added or removed in each step, so it can be maintained incrementally. With array indexing the top two scores can both be read in place.

#### Algorithm

1. `scores = new int[n]`, `size = 0`, `total = 0`.
2. For each operation:
   - `"+"`: `scores[size] = scores[size − 1] + scores[size − 2]`.
   - `"D"`: `scores[size] = 2 × scores[size − 1]`.
   - `"C"`: `size−−`, `total −= scores[size]`, and continue to the next operation.
   - otherwise: `scores[size] = parse(op)`.
   - For the three pushing cases: `total += scores[size]`, `size++`.
3. Return `total`.

#### Why it is correct

**The invariant:** after each operation, `scores[0..size−1]` is the record (bottom to top) and `total` is its sum.

- Initially the record is empty, `size = 0` and `total = 0`.
- A push writes the new score at index `size` and increases `size`, so the record gains exactly that score, and adding it to `total` keeps `total` equal to the sum.
- `"C"` decreases `size`, which drops the top score from the record, and subtracting that score keeps the sum right.
- The validity guarantee keeps `size − 1` and `size − 2` in range whenever they are read, and the record never exceeds n entries because each operation adds at most one score.

When the loop ends, `total` is the sum of the record, which is the answer.

**On overflow:** the statement promises that every score and the answer fit in an `int`. The running total in the middle could in principle pass the `int` range even though the final answer does not (for example, push a large score and later cancel it). That is still safe: Java `int` addition and subtraction are defined by the language specification to wrap modulo 2^32, so the running total is always the true sum modulo 2^32, and when the true final sum lies inside the `int` range, the wrapped value equals it exactly. If I didn't want to rely on that argument, a `long` total is enough: at most 1000 scores, each below 2^31 in absolute value, sum to less than about 2.2 × 10^12 in absolute value.

**The 20-second version to say to the interviewer:**

> "The array plus size is the record as a stack, and total is always its sum, because every push adds what it pushed and every C subtracts what it removed. Valid operations mean I never read below the bottom. One pass, O(n) time and space."

#### Dry run

`operations = ["5","-2","4","C","D","9","+","+"]`

| Operation | Action | Record | total |
|---|---|---|---|
| `"5"` | push 5 | [5] | 5 |
| `"-2"` | push −2 | [5, −2] | 3 |
| `"4"` | push 4 | [5, −2, 4] | 7 |
| `"C"` | remove 4 | [5, −2] | 3 |
| `"D"` | push 2 × (−2) = −4 | [5, −2, −4] | −1 |
| `"9"` | push 9 | [5, −2, −4, 9] | 8 |
| `"+"` | push −4 + 9 = 5 | [5, −2, −4, 9, 5] | 13 |
| `"+"` | push 9 + 5 = 14 | [5, −2, −4, 9, 5, 14] | 27 |

#### Java code

```java title="Approach 2: int array as a stack, running total (recommended)"
class Solution {
    public int calPoints(String[] operations) {
        int[] scores = new int[operations.length];
        int size = 0;
        int total = 0;
        for (String op : operations) {
            switch (op) {
                case "+":
                    scores[size] = scores[size - 1] + scores[size - 2];
                    break;
                case "D":
                    scores[size] = 2 * scores[size - 1];
                    break;
                case "C":
                    size--;
                    total -= scores[size];
                    continue;
                default:
                    scores[size] = Integer.parseInt(op);
            }
            total += scores[size];
            size++;
        }
        return total;
    }
}
```

#### Time complexity

**O(n + L) in every case**, which is O(n) under the stated constraints (each integer string is at most 6 characters). Each operation does constant work apart from parsing.

#### Space complexity

**O(n) auxiliary space**: the `int` array of length n.

## 5. Comparison table

n = number of operations. Nothing is hashed or randomised, so expected and worst case coincide.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. `ArrayDeque` stack, sum at the end | O(n) | O(n) | O(n) |
| 2. `int[]` stack, running total | O(n) | O(n) | O(n) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. `ArrayDeque` stack | Reads like the statement; no index arithmetic | Boxes every score; `"+"` needs a pop-peek-push dance | When readability is the only concern |
| 2. `int[]` stack, running total | No boxing; `"+"` reads both scores in place; total is available after every step | `"C"` must remember to subtract; index arithmetic | The answer to give |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2. Approach 1 is equally correct; mention that it is the same idea with a library stack.

**Is it optimal?** Yes. In the worst case a correct algorithm must read every operation: if the input is all numbers and some algorithm never reads one of them, changing that number changes the sum without the algorithm noticing. That gives an Ω(n) worst-case lower bound. The O(n) space is also hard to avoid in general, since a later `"C"` can expose any earlier score.

**When to stop:** once it is coded and traced on Example 2. There is nothing further to optimize.

## 7. Interview script: code it and test it

### What I say while coding

> "`switch` on the string: Java compares string cases with `equals`, so I'm not comparing references."

> "In the `C` case I decrement first, then subtract the score at the new `size`, then `continue` so I skip the shared 'add and push' lines at the bottom."

> "The default branch is the number. `parseInt` handles the minus sign."

### Testing out loud

**Normal case:** Example 2, as in the dry run: total 27.

**Everything cancelled:** `["1","C"]`. Push 1, total 1, size 1. `C`: size 0, total 0. Returns 0.

**`"+"` after a cancel:** `["5","2","C","D","+"]`. After `C`, size is 1, so `D` reads `scores[0] = 5` and pushes 10; `+` reads 10 and 5. Total 5 + 10 + 15 = 30.

**Negative doubling:** `["-3","D"]`. Push −3, then −6. Returns −9.

**Large values:** `"30000"` followed by `"D"` sixteen times pushes 30000 × 2^16 = 1,966,080,000, which still fits in an `int`; the record's sum, 30000 × (2^17 − 1) = 3,932,130,000, does not. Then sixteen `"C"` operations cancel the doubles and the answer is 30000. The running total wrapped past the `int` range in the middle and still ends at exactly 30000, as the overflow argument says.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1 min | "Previous" means current record; `"+"` adds, doesn't replace |
| Code | 3–4 min | Approach 2 |
| Trace | 2 min | Example 2 and `["1","C"]` |

This is a warm-up. Do not spend time on alternatives; spend it on a clean trace. If stuck, write the record out after each operation on paper.

## 9. Interviewer challenges

### About correctness

#### Why is an `int` total safe if the running sum can go past the `int` range in the middle?

**What they are testing:** whether you can reason precisely about overflow instead of hand-waving it.

**How to reason:** separate what the statement guarantees (every score and the final answer fit) from what it does not (the running sum at every moment).

**What I say:** "Java defines `int` addition and subtraction to wrap modulo 2^32, so the running total is always the true sum modulo 2^32. The true final sum is promised to be inside the `int` range, and only one value in that range has the right remainder, so the final `total` is exact. If I'd rather not rely on that, a `long` total has headroom: 1000 scores under 2^31 each sum to under about 2.2 × 10^12."

**Nuance:** this argument works because only `+` and `−` touch the total. It would not hold for an operation like division on an overflowed value.

### About the data structure

#### Why not `java.util.Stack`?

**What they are testing:** familiarity with the Java collections.

**How to reason:** compare the classes' design, not just whether they work.

**What I say:** "`Stack` extends `Vector`, so every call is synchronized and it exposes index-based methods that break the stack abstraction. The JDK's own documentation recommends a `Deque`, such as `ArrayDeque`, for stacks. Here I don't need a class at all: an `int[]` sized to n is a stack with no boxing."

**Nuance:** iterating a `Stack` goes bottom to top, while iterating an `ArrayDeque` used with `push` goes top to bottom. For a sum it doesn't matter, but it matters if you print or rebuild the record.

#### Could you do it without storing the record?

**What they are testing:** whether you see why the record is needed.

**How to reason:** look for an input where a score far back becomes relevant again.

**What I say:** "No, not in general. A run of `"C"` operations can cancel back to any earlier score, and `"D"` or `"+"` then needs that score's value. So I have to keep every score that hasn't been cancelled."

**Nuance:** if `"C"` did not exist, two variables (the last two scores) plus the total would be enough.

## 10. Follow-up questions the interviewer might ask

**"What if you must report the total after every operation?"**
Approach 2 already has it: output `total` at the end of each iteration. O(1) extra per operation.

**"What if there is an undo operation that reverses the last operation of any kind, including a `"C"`?"**
Keep a second stack of what each operation did (pushed a value, or removed a value). Undoing a push pops it; undoing a `"C"` pushes back the removed score. Still O(1) per operation and O(n) space.

**"What if inputs may be invalid, for example `"+"` with fewer than two scores?"**
Check `size` before each read and either reject the input or follow whatever rule the interviewer gives (for example, treat missing scores as 0). The cost stays O(1) per operation.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Treating "previous score" as the previous operation.** After `"C"`, the previous score is the one below the cancelled one, as Example 2 shows.
- **Thinking `"+"` replaces the two scores** with their sum. It adds a third score; the two stay.

### Implementation mistakes

> [!MISTAKE] Forgetting to subtract on `"C"` with a running total
> If the `"C"` branch only decrements `size`, the cancelled score stays in `total`. On Example 1 that returns 32 instead of 30: the cancelled 2 is still counted.

- **Losing a score in `"+"` with a `Deque`.** `record.push(record.pop() + record.peek())` pops the last score and never puts it back. On Example 1 the record ends as `[5, 15]` and the method returns 20 instead of 30.
- **Comparing strings with `==`.** `op == "+"` compares references and only works if the strings happen to be the same object. Use `equals` or a `switch`.
- **Checking for a number with `Character.isDigit(op.charAt(0))`.** That misses negative numbers like `"-2"`. Test for the three operators and treat everything else as a number.

## 12. Pattern recognition

**The pattern:** a stack as an undoable history: every operation acts on the most recent surviving item.

**Signals in the problem statement:**

- "The previous score" and "the previous two scores": only the newest items matter.
- "Remove the previous score": an undo that can expose older items again.

**Related problems in this list:**

- [[nc-valid-parentheses|Valid Parentheses]]: the most recent unmatched opener is the one that must close next.
- [[nc-evaluate-reverse-polish-notation|Evaluate Reverse Polish Notation]]: operators consume the top two values and push the result, much like `"+"` here.
- [[nc-min-stack|Min Stack]]: a stack that also maintains an aggregate (the minimum) through pushes and pops, as the running total does here.
- [[nc-simplify-path|Simplify Path]]: `".."` cancels the most recent directory, the same role as `"C"`.

**Takeaway:** when operations only ever touch "the latest" item and some of them undo, the state is a stack; an aggregate over it can be kept up to date by adjusting it on every push and pop.

## 13. 60-second revision card

**Key insight:** the record is a stack; `"C"` pops, everything else pushes one score computed from the top.

**Invariant:** `scores[0..size−1]` is the record and `total` is its sum.

**Complexity:** O(n) time, O(n) auxiliary space. Ω(n) worst-case lower bound: in an all-numbers input, every number affects the sum.

**Code skeleton:**

```java title="Baseball Game, array stack with running total"
class Solution {
    public int calPoints(String[] operations) {
        int[] s = new int[operations.length];
        int size = 0, total = 0;
        for (String op : operations) {
            if (op.equals("C")) { total -= s[--size]; continue; }
            if (op.equals("+")) s[size] = s[size - 1] + s[size - 2];
            else if (op.equals("D")) s[size] = 2 * s[size - 1];
            else s[size] = Integer.parseInt(op);
            total += s[size++];
        }
        return total;
    }
}
```

**Main traps:**

- `"C"` must subtract from the running total.
- `"+"` keeps both summed scores in the record.
- Numbers can be negative; don't detect them by their first character being a digit.

**What to say in one breath:** "The record is a stack. Numbers, D and + push one score computed from the top, C pops. I keep a running total, adding pushes and subtracting pops; int wraparound makes that exact because the final answer fits. O(n) time and space."
