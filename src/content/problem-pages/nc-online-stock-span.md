---
problemId: nc-online-stock-span
title: Online Stock Span
source: neetcode
sourceUrl: https://leetcode.com/problems/online-stock-span/
difficulty: medium
patterns: [stack, monotonic-stack]
relatedLessons: [a5-stack, a5-monotonic-stack, a5-next-greater-smaller, a14-deriving-optimization]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

Build a class `StockSpanner` that receives a stock's price one day at a time. Each call `next(price)` adds today's price and returns today's **span**: the number of consecutive days, counting today and going backwards, on which the price was less than or equal to today's price. You see each price only when it arrives; there is no array of all prices up front.

**Example**

| Call | Returns | Why |
|---|---|---|
| `next(100)` | 1 | Only today |
| `next(80)` | 1 | Yesterday's 100 is higher |
| `next(60)` | 1 | Yesterday's 80 is higher |
| `next(70)` | 2 | 70 and the 60 before it; then 80 is higher |
| `next(60)` | 1 | Yesterday's 70 is higher |
| `next(75)` | 4 | 75, 60, 70, 60; then 80 is higher |
| `next(85)` | 6 | 85, 75, 60, 70, 60, 80; then 100 is higher |

Equal prices count: after `next(5)`, a second `next(5)` returns 2.

**What the problem statement guarantees**

- 1 ≤ `price` ≤ 10^5.
- At most 10^4 calls are made to `next`.
- The class has a constructor `StockSpanner()` and a method `int next(int price)`.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. Storing every price and counting backwards works; the interesting part is what you can afford to forget.

**How to practise**

1. Set a timer for 20 minutes and talk out loud.
2. Write the direct version and give its cost per call and over 10^4 calls.
3. In the example, after `next(75)` returns 4, ask whether the days 60, 70, 60 inside that span will ever need to be looked at individually again.
4. Design what each remembered entry should carry so that you can skip over a whole block of days in one step.
5. Trace the example and a run of equal prices.

Open a hint only after two minutes without progress. After each hint, close it and try again before opening the next one.

> [!HINT] Hint 1: a small nudge
> Once a day with price p has arrived, any earlier day with a price ≤ p is hidden behind it: a later span that reaches that earlier day must first pass through the day with price p. What can you do with the hidden days?

> [!HINT] Hint 2: the kind of tool you need
> Keep only the days that are not hidden, newest last. Each one stands for itself and the block of hidden days right before it, so store the size of that block with it. A new price absorbs blocks from the newest end only.

> [!HINT] Hint 3: almost the whole plan
> Keep a stack of `(price, span)` pairs. In `next(price)`: start with `span = 1`; while the stack is not empty and its top price is ≤ `price`, add the top's span to `span` and pop it. Push `(price, span)` and return `span`. Each pair is pushed once and popped at most once.

**Check yourself before revealing the walkthrough**

- [ ] My class returns 1, 1, 1, 2, 1, 4, 6 on the example
- [ ] `next(5)`, `next(5)` returns 1, then 2
- [ ] I can explain why adding the popped spans gives the right count without looking at the hidden days
- [ ] I can state the cost per call, and say why it is amortized rather than worst case

## 3. Interview script: understand the problem (≈2 min)

**Me:** So `next` gets today's price, and I count today plus the unbroken run of previous days whose price is ≤ today's, stopping at the first day that's strictly higher. Equal prices are included in the span?

**Interviewer:** Yes, less than or equal.

**Me:** And the prices come one at a time; I can't look ahead. How many calls and what range of prices?

**Interviewer:** At most 10^4 calls, prices from 1 to 10^5.

**Me:** So at most 10^4 days in total. A span is at most the number of days, 10^4, so `int` is fine. And since the class lives across calls, I decide what state to keep between them.

**Me:** By hand on the example: for 75 I walk back over 60, 70, 60 and stop at 80: span 4. Then for 85 I walk back over 75, then 60, 70, 60 again, then 80, and stop at 100: span 6. The second walk repeats the first. If I'd remembered "75 covers 4 days", I could jump over them.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| At most 10^4 calls | Walking back over all earlier days costs at most 1 + 2 + … + 10^4 ≈ 5 × 10^7 comparisons in total. That would actually run in time here, so the brute force is a legitimate first answer; the interviewer still expects better per-call cost. |
| 1 ≤ price ≤ 10^5 | Prices are positive and small; nothing in the solution depends on the range. Only comparisons happen, so no overflow. |
| One price per call | The solution must be online: it can keep state, but not see the future. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Span uses ≤, so equal prices count | The stopping condition is "strictly higher"; popping uses `<=`. |
| Today is always included | Every span is at least 1. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| One `StockSpanner` object per price stream | The constructor takes no arguments; each object keeps its own history. |

### Edge cases I will keep in mind

- The first call: span 1.
- Equal prices: `next(5)`, `next(5)` gives 1, 2.
- Strictly increasing prices: spans 1, 2, 3, …: each call absorbs everything.
- Strictly decreasing prices: every span is 1, and nothing can be forgotten.
- A high price after a long decrease: one call absorbs many days at once.

## 4. Think out loud: from first idea to best solution

> "First version: keep every price in a list. For `next(price)`, append it, then walk backwards while the earlier price is ≤ today's and count. It's correct by definition. It costs O(d) for the d-th call, so 10^4 increasing prices cost about 5 × 10^7 comparisons in total. That's fine for these limits, but each call is linear, and the interviewer will want to know what can be reused."

### Approach 1: Keep every price and walk back

#### What I say out loud

> "I store all prices in an `ArrayList`. Each call appends the price and walks back from yesterday, counting days while the price is ≤ today's, and stops at the first strictly higher one or at the start."

#### Intuition

The span is defined as a backwards walk, so do exactly that walk.

#### Algorithm

1. Field: a list `prices`.
2. `next(price)`: append `price`; set `span = 1`, `j = size − 2`; while `j ≥ 0` and `prices[j] ≤ price`: `span++`, `j−−`. Return `span`.

#### Why it is correct

The loop visits the earlier days in order from yesterday backwards and stops at the first day with a strictly higher price, or at the first day ever. It counts every day it passes, plus today, which is the definition of the span.

#### Dry run

The example, call by call. `j` stops at the index shown.

| Call | prices after append | Walk back over | Stops at | Returns |
|---|---|---|---|---|
| next(100) | [100] | | start | 1 |
| next(80) | [100, 80] | | 100 | 1 |
| next(60) | [100, 80, 60] | | 80 | 1 |
| next(70) | [.., 60, 70] | 60 | 80 | 2 |
| next(60) | [.., 70, 60] | | 70 | 1 |
| next(75) | [.., 60, 75] | 60, 70, 60 | 80 | 4 |
| next(85) | [.., 75, 85] | 75, 60, 70, 60, 80 | 100 | 6 |

#### Java code

```java title="Approach 1: keep every price and walk back"
import java.util.ArrayList;
import java.util.List;

class StockSpanner {
    private final List<Integer> prices = new ArrayList<>();

    public StockSpanner() {
    }

    public int next(int price) {
        prices.add(price);
        int span = 1;
        for (int j = prices.size() - 2; j >= 0 && prices.get(j) <= price; j--) {
            span++;
        }
        return span;
    }
}
```

#### Time complexity

**O(d) for the d-th call in the worst case**, so **O(q²) over q calls**: an increasing sequence makes the d-th call walk back over all d − 1 earlier days. With q ≤ 10^4 that is under 5 × 10^7 comparisons in total. The append is O(1) amortized (`ArrayList` occasionally grows its array).

#### Space complexity

**O(q)**: every price is kept, where q is the number of calls so far.

#### The bridge to the next approach

> "The waste is in the second walk. When 75 arrived, it covered 60, 70, 60. For any later day, those three can only be reached by walking through 75 first, and if the walk passes 75, it passes them too, since they're all ≤ 75. So I never need them individually again: I can replace them by '75 covers 4 days'."

> "If I drop every day that a later, at-least-as-high price covers, the remaining days have strictly decreasing prices from oldest to newest, and a new price absorbs them from the newest end. Remove and add at one end: a stack, where each entry carries how many days it covers."

### Approach 2: Stack of (price, span) pairs (recommended)

#### What I say out loud

> "I keep a stack of pairs: a price and the span that was returned for it. When a price comes in, I start at span 1, and while the top's price is ≤ today's, I add the top's span and pop it. Then I push today's price with the total, and return it. The prices on the stack strictly decrease from bottom to top, and each pair is pushed once and popped at most once, so a call is O(1) amortized."

#### Intuition

Today's span ends just after the most recent day with a strictly higher price. Each pair on the stack stands for a **block** of consecutive days: its own day and the days its span covered. All prices in a block are ≤ the block's price. So instead of walking day by day, today's walk absorbs whole blocks as long as the block's price is ≤ today's, and it stops at the first block whose price is higher, which is exactly the day that ends the span. Merging the absorbed blocks into today's block keeps the description of the past compact. This is a [[a5-monotonic-stack|monotonic stack]], used here as an online [[a5-next-greater-smaller|previous greater element]] finder.

#### Algorithm

1. Field: a stack of `int[] {price, span}`.
2. `next(price)`:
   1. `span = 1`.
   2. While the stack is not empty and the top's price ≤ `price`: `span += top.span`; pop.
   3. Push `{price, span}`; return `span`.

#### Why it is correct

**The invariant**, after each call (say d days have arrived, numbered 1..d): the stack, from bottom to top, holds pairs for days b₁ < b₂ < … < b_m = d such that

- the blocks partition the days: block i is the days `b_{i−1} + 1..b_i` (with b₀ = 0), and its stored span is `b_i − b_{i−1}`;
- every day in block i has price ≤ the price of day b_i;
- the prices strictly decrease from bottom to top: day b_{i−1} has a strictly higher price than day b_i.

So the stored span of b_i is exactly its correct span: the walk back from b_i passes its block and stops at b_{i−1}, which is strictly higher (or at the start, for the bottom block).

**Why merging is correct.** A new day d + 1 with price p arrives. The popped pairs are the top ones with price ≤ p; since the stack prices strictly decrease towards the top, these are exactly the blocks from some b_k + 1 up to d, and every day in them is ≤ its block's price ≤ p. The first pair not popped, b_k, has a price strictly higher than p (or there is none). So the span of day d + 1 is 1 + (d − b_k), which is 1 plus the sum of the popped spans, because the popped blocks are consecutive and partition `b_k + 1..d`.

**Why the invariant survives.** The new block is `b_k + 1..d + 1`, all its days are ≤ p, its span is `d + 1 − b_k`, and the pair below it, b_k, is strictly higher than p. The blocks below are untouched.

**Why forgetting is safe.** The popped days lie inside the new block, and for any future day, a walk that reaches them must first pass day d + 1, whose price is ≥ all of them. So such a walk passes them all, and only their count, now stored in the new block, matters.

**The 25-second version to say to the interviewer:**

> "Each stack entry is a price with the number of days it covers, all of them at most that price. A new price swallows entries from the top while their price is ≤ it, adding up their counts, and stops at the first strictly higher price, which is exactly where its span ends. The swallowed days are covered by the new, higher price, so no future span can stop inside them. Each entry is pushed and popped once: O(1) amortized per call."

#### Dry run

The example. Stack entries are `(price, span)`, bottom first.

| Call | Popped (price ≤ today) | span | Stack after | Returns |
|---|---|---|---|---|
| next(100) | | 1 | [(100,1)] | 1 |
| next(80) | | 1 | [(100,1), (80,1)] | 1 |
| next(60) | | 1 | [(100,1), (80,1), (60,1)] | 1 |
| next(70) | (60,1) | 1 + 1 = 2 | [(100,1), (80,1), (70,2)] | 2 |
| next(60) | | 1 | [(100,1), (80,1), (70,2), (60,1)] | 1 |
| next(75) | (60,1), (70,2) | 1 + 1 + 2 = 4 | [(100,1), (80,1), (75,4)] | 4 |
| next(85) | (75,4), (80,1) | 1 + 4 + 1 = 6 | [(100,1), (85,6)] | 6 |

At `next(85)`, the entry (75, 4) stands for the four days 60, 70, 60, 75 without visiting them, which is exactly the repeated walk from section 3. The spans on the stack always add up to the number of days so far (here 1 + 6 = 7).

#### Java code

```java title="Approach 2: stack of (price, span) pairs (recommended)"
import java.util.ArrayDeque;
import java.util.Deque;

class StockSpanner {
    // Each entry is {price, span}: a day and the block of days it covers, all priced <= it.
    // Prices strictly decrease from bottom to top.
    private final Deque<int[]> stack = new ArrayDeque<>();

    public StockSpanner() {
    }

    public int next(int price) {
        int span = 1;
        while (!stack.isEmpty() && stack.peek()[0] <= price) {
            span += stack.pop()[1];              // absorb the whole block
        }
        stack.push(new int[] {price, span});
        return span;
    }
}
```

#### Time complexity

**O(1) amortized per call; O(q) in total over q calls.** Each call pushes exactly one pair, and every iteration of the `while` pops one, so over q calls the loop body runs at most q times. A single call can still pop up to all earlier pairs: after a strictly decreasing run of q − 1 prices, a price of 10^5 pops q − 1 pairs, so one call is O(q) in the worst case. The `ArrayDeque` operations are O(1) amortized.

#### Space complexity

**O(q) in the worst case:** a strictly decreasing sequence pops nothing, so the stack holds one pair per day. On an increasing sequence it holds a single pair.

### Alternative: keep all prices and jump back by stored spans

Store every price and the span returned for it in two lists. For a new day, start at yesterday; while that day's price is ≤ today's, jump back by that day's span (its whole block is ≤ it) instead of by one day. This visits exactly the days that Approach 2 would pop, so it is also O(q) in total. It keeps O(q) memory even on increasing inputs, where the stack would hold one pair, and it has no advantage over the stack here; it is the same idea as the backward-jump alternative in [[nc-daily-temperatures|Daily Temperatures]], and worth knowing only because it shows that the stack is really a list of jump pointers.

## 5. Comparison table

q = number of calls to `next` so far (at most 10^4). Nothing is hashed or randomized.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Walk back over all prices | O(d) for the d-th call, O(q²) in total | O(d) for the d-th call, O(q²) in total | O(q) |
| 2. Stack of (price, span) | O(1) amortized per call, O(q) in total | O(q) for one call, O(q) in total | O(q) |
| Alt. Jump back by spans | O(1) amortized per call, O(q) in total | O(q) for one call, O(q) in total | O(q) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Walk back | Direct from the definition | Quadratic in total | As the first answer, or if q were tiny |
| 2. Stack | O(q) total, forgets covered days | The merge argument must be explained | The answer to give |
| Alt. Jumps | Same total cost, shows the link to Daily Temperatures | Keeps every day | As a remark, not as code |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2. Start from the walk back, point out the repeated walk over 60, 70, 60, then introduce "each entry covers a block".

**Is it optimal?** The total cost over q calls is O(q), and each call must at least read its price, so no method can do better than Ω(q) in total. Per call, it is O(1) amortized, but a single call can take O(q) time; say so rather than calling every call O(1).

**When another solution is better in practice:** with at most 10^4 calls, Approach 1 also runs in time. The stack is still the expected answer, because it scales and its argument is the point of the question.

**When to stop:** once the merge argument and the amortized bound are explained. Storing two parallel `int[]` arrays instead of `int[]` pairs is a constant-factor tweak.

## 7. Interview script: code it and test it

### What I say while coding

> "The state is a `Deque<int[]>` used as a stack; each entry is `{price, span}`."

> "Today starts at span 1. While the top's price is `<=` today's, today absorbs its span. `<=` because equal prices count in the span."

> "Push today's pair, return the span. No index bookkeeping needed, since the spans themselves count the days."

### Testing out loud

**Normal case:** the example, traced in section 4: 1, 1, 1, 2, 1, 4, 6.

**First call:** empty stack, span 1, push (p, 1).

**Equal prices:** `next(5)`: push (5, 1), return 1. `next(5)`: top 5 ≤ 5, absorb 1, span 2, push (5, 2), return 2. A third `next(5)` returns 3.

**Strictly increasing:** 1, 2, 3: each call absorbs the single entry below: spans 1, 2, 3, and the stack always holds one pair.

**Strictly decreasing then high:** 5, 4, 3, then 10: spans 1, 1, 1, then 10 absorbs all three: 4.

**Largest input:** 9,999 calls with strictly decreasing prices leave 9,999 pairs on the stack; a 10,000th call `next(100000)` pops them all and returns 10,000.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 2 min | ≤ counts, today included, online |
| Walk back | 3 min | Code or describe; O(d) per call |
| Derive the blocks | 4 min | Covered days are never needed individually |
| Argue correctness and cost | 3 min | Merge argument, pushed once and popped once |
| Code | 3 min | Approach 2 |
| Trace and edge cases | 4 min | The example, equal prices |
| Questions | rest | Section 9 |

**If you get stuck:** trace Approach 1 on the example and circle the days the walk for 85 repeats. Ask what single number would let you skip them.

## 9. Interviewer challenges

### About correctness

#### Why is it correct to add the popped spans instead of counting days?

**What they are testing:** the merge argument.

**How to reason:** what does a popped entry's span describe?

**What I say:** "Each entry's span is the number of consecutive days ending at that entry, all priced at most its price. The popped entries are consecutive blocks right before today, all ≤ today's price, and the first entry left is strictly higher. So the days between that entry and today are exactly the popped blocks, and their spans add up to that count."

**Nuance:** this relies on the blocks partitioning the past with no gaps, which is why the stack's spans always add up to the number of days so far.

#### Why `<=` and not `<` when popping?

**What they are testing:** attention to the definition.

**How to reason:** does an equal price end a span?

**What I say:** "The span counts days with price ≤ today's, so an equal price is part of the span and must be absorbed. With `<`, `next(5)`, `next(5)` would return 1, 1 instead of 1, 2."

**Nuance:** with `<=`, equal prices merge, so the stack's prices strictly decrease, which keeps it shorter.

### About complexity

#### A single call can pop the whole stack. Isn't that O(q) per call?

**What they are testing:** the difference between worst-case and amortized cost.

**How to reason:** count pushes and pops over the whole sequence.

**What I say:** "One call can be O(q), yes. But each call pushes one pair and a pair can be popped only once, so all calls together pop at most q pairs. The total is O(q), so O(1) amortized per call."

**Nuance:** amortized is not average over random inputs: the bound holds for every sequence of calls.

#### Could you avoid storing the span, and store only prices?

**What they are testing:** whether you see what the span is replacing.

**How to reason:** what else could tell you how many days a popped entry covered?

**What I say:** "I'd need the day index instead: keep a day counter, store `{price, dayIndex}`, and today's span is today's index minus the index of the entry left on top after popping, or today's index + 1 if the stack is empty. That's the same information in another form."

**Nuance:** the index version is the general "previous greater element" stack; the span version avoids the counter and the empty-stack special case.

## 10. Follow-up questions the interviewer might ask

**"Return the span of strictly lower prices instead."**
Pop on `<` instead of `<=`: an equal price now ends the span. O(1) amortized per call.

**"Also answer: how many days until the price is higher again?"**
That is a next-greater question and needs the future. Offline, use the [[nc-daily-temperatures|Daily Temperatures]] stack; online, report each day's answer when a higher price pops it.

**"Support a query `span(k)` for an arbitrary past day k."**
Store each day's span when it is computed, in a list. The span of a past day never changes, because it looks only backwards. O(1) per query, O(q) memory.

**"Prices arrive for many stocks interleaved, as `next(stockId, price)`."**
Keep one stack per stock in a `HashMap<Integer, Deque<int[]>>`. O(1) amortized per call, expected, because of the hash lookup.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Thinking popped days might still matter.** They are all ≤ a newer price, so any later span reaching them passes through that price first and includes them all.
- **Calling one call O(1) worst case.** It is O(1) amortized; a single call can pop everything.

### Implementation mistakes

> [!MISTAKE] Popping on `<` instead of `<=`
> Equal prices then end the span. `next(5)`, `next(5)` returns 1 and 1 instead of 1 and 2.

> [!MISTAKE] Counting popped entries instead of adding their spans
> With `span += 1` per pop instead of `span += popped span`, the example returns 1, 1, 1, 2, 1, 3, 3 instead of 1, 1, 1, 2, 1, 4, 6: at 75 the entry (70, 2) counts as one day.

- **Starting `span` at 0.** Today always counts; every span is at least 1.
- **Using the legacy `Stack` class.** It works, but it is synchronized; `ArrayDeque` is the standard choice.

## 12. Pattern recognition

**The pattern:** monotonic stack for "previous greater element", with merged blocks. Entries that a newcomer dominates are folded into it, carrying how much they covered.

**Signals in the problem statement:**

- "How many consecutive previous elements are ≤ this one?"
- Values arrive one at a time and each needs an answer about the past.
- A backward walk that would repeat itself.

**Related problems in this list:**

- [[nc-daily-temperatures|Daily Temperatures]]: the next-greater version of the same stack.
- [[nc-largest-rectangle-in-histogram|Largest Rectangle in Histogram]]: for each bar, how far it extends to the left and the right, found with this stack.
- [[cses-nearest-smaller-values|Nearest Smaller Values]]: the previous-smaller element for every position.
- [[nc-min-stack|Min Stack]]: another stack whose entries carry a summary of what lies below them.

**Takeaway:** when a newcomer makes older elements irrelevant to every future query, fold them into the newcomer on a stack, keeping just the summary you need (here the count), and each element is pushed and popped once.

## 13. 60-second revision card

**Key insight:** a new price covers every earlier day that is ≤ it, back to the first strictly higher day; store the covered count with it, and later walks can jump over the whole block.

**Invariant:** the stack holds `(price, span)` blocks that partition the days so far, prices strictly decreasing from bottom to top, every day in a block ≤ its block's price.

**Complexity:** O(1) amortized per call, O(q) in total; one call can be O(q). O(q) space in the worst case.

**Code skeleton:**

```java title="Online Stock Span, stack of blocks"
import java.util.ArrayDeque;
import java.util.Deque;

class StockSpanner {
    private final Deque<int[]> stack = new ArrayDeque<>();   // {price, span}

    public int next(int price) {
        int span = 1;
        while (!stack.isEmpty() && stack.peek()[0] <= price) span += stack.pop()[1];
        stack.push(new int[] {price, span});
        return span;
    }
}
```

**Main traps:**

- Pop on `<=`: equal prices belong to the span.
- Add the popped spans, not 1 per pop.
- O(1) is amortized, not per call.

**What to say in one breath:** "Each stack entry is a price and the number of days it covers. A new price pops entries priced at most it, adds their counts, pushes itself with the total and returns it. Each entry goes in and out once: O(1) amortized per call."
