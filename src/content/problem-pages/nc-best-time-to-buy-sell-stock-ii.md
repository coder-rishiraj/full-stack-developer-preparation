---
problemId: nc-best-time-to-buy-sell-stock-ii
title: Best Time to Buy/Sell Stock II
source: neetcode
sourceUrl: https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/
difficulty: medium
patterns: [arrays-hashing, hashing, greedy]
relatedLessons: [a10-local-vs-global, a11-state-machine-dp, a2-array-string-traversal, a14-deriving-optimization, a14-brute-force-first]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

You get an array `prices`, where `prices[i]` is the price of one stock on day i. On each day you may buy one share, sell the share you hold, or both (sell and then buy again on the same day). You can hold at most one share at any moment, so you must sell before you buy again. Return the largest total profit you can make; making no trades at all gives 0.

**Example 1**

- Input: `prices = [3, 1, 4, 2, 6]`
- Output: `7`
- Why: buy on day 1 at 1 and sell on day 2 at 4 (+3), then buy on day 3 at 2 and sell on day 4 at 6 (+4). Buying once at 1 and selling once at 6 earns only 5, so trading more often wins here.

**Example 2**

- Input: `prices = [9, 7, 4, 2]`
- Output: `0`
- Why: the price only falls. Every buy is followed by a lower or equal price, so the best plan is not to trade.

**What the problem statement guarantees**

- 1 ≤ `prices.length` ≤ 3 × 10^4.
- 0 ≤ `prices[i]` ≤ 10^4.
- At most one share is held at any time; buying and selling on the same day is allowed.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The code is short; the part that wins the interview is explaining *why* your answer is the maximum. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 15 minutes and talk out loud.
2. Draw the prices as a line chart for `[3, 1, 4, 2, 6]` and find the best plan by eye. Then ask yourself what rule you used.
3. Say the simplest correct method, even if it is exponential, and its cost.
4. Write the code, then trace it on `[1, 2, 3, 4]` and on `[9, 7, 4, 2]`.
5. Explain in two sentences why no trading plan can beat your answer.

> [!HINT] Hint 1: a small nudge
> Take one trade: buy on day b, sell on day s. Write its profit `prices[s] - prices[b]` as a sum of the day-to-day changes between b and s. What does that tell you about which days help a trade and which hurt it?

> [!HINT] Hint 2: the kind of tool you need
> There are only two situations at the end of any day: you hold a share or you do not. Tracking the best result for each of those two states, day by day, gives a correct method. Then look for something even simpler: can you collect every day on which the price goes up?

> [!HINT] Hint 3: almost the whole plan
> Add up `prices[i] - prices[i - 1]` over every day i where that difference is positive. Prove two things: every buy-low-sell-high trade is a sum of consecutive daily differences, so no plan earns more than the sum of the positive ones; and that sum is reachable by a legal plan that buys before each rising day and sells on it.

**Check yourself before revealing the walkthrough**

- [ ] I named at least one correct method before the fast one, with its cost
- [ ] My code returns 7 for `[3, 1, 4, 2, 6]`, 3 for `[1, 2, 3, 4]` and 0 for `[9, 7, 4, 2]`
- [ ] I can argue that no plan beats my answer, and that my answer is reachable by a legal plan
- [ ] I checked that the result fits in an `int`

## 3. Interview script: understand the problem (≈2 min)

**Me:** So I see the whole price history up front, and I choose when to buy and sell to maximize total profit. I can do as many trades as I like, but I can hold at most one share at a time.

**Interviewer:** Yes.

**Me:** On one day, can I sell the share I hold and buy again?

**Interviewer:** Yes, both on the same day.

**Me:** Is there a transaction fee or a cooldown after selling?

**Interviewer:** No fees, no cooldown.

**Me:** And I return only the profit, not the list of trades?

**Interviewer:** Just the number.

**Me:** Sizes: up to 3 × 10^4 days, prices from 0 to 10^4. The profit is a sum of gains, each at most 10^4, and there are at most n − 1 day-to-day steps, so it can't exceed (3 × 10^4 − 1) × 10^4, just under 3 × 10^8. An `int` goes past 2.1 × 10^9, so `int` is safe.

**Me:** Quick example by hand: `[3, 1, 4, 2, 6]`. The chart dips to 1, rises to 4, dips to 2, rises to 6. Riding both rises gives 3 + 4 = 7. One long trade from 1 to 6 gives 5, which skips the dip. So 7.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| Hold at most one share | Trades cannot overlap in time. That is what lets the problem decompose day by day. |
| Unlimited number of trades | No "k transactions" bookkeeping. Every profitable rise can be used. |
| Same-day sell and buy allowed | Back-to-back trades that share a day are legal, which makes "trade on every rising day" a valid plan. |
| 1 ≤ n ≤ 3 × 10^4 | Never empty; with one day the answer is 0. Exponential search is out; O(n) or O(n log n) is fine. |
| 0 ≤ `prices[i]` ≤ 10^4 | No negative prices. The total profit is below 3 × 10^8, so it fits in an `int`. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| No fee and no cooldown | Splitting one long trade into many short ones costs nothing. With a fee this would change (section 10). |
| Return only the profit | No need to record the buy and sell days. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The input is not modified | Nothing requires changing it, and none of my methods needs to. |
| The whole price history is known in advance | The problem gives the array; the "future" is visible. In a real market it would not be, which is why this is a puzzle and not a strategy. |

### Edge cases I will keep in mind

- One day: `[5]`, profit 0.
- Strictly decreasing prices: `[9, 7, 4, 2]`, profit 0.
- Flat prices: `[4, 4, 4]`, profit 0 (equal prices give no gain, and the code must not count them).
- Strictly increasing: `[1, 2, 3, 4]`, profit 3, the same as one trade from first to last.
- Prices of 0 and the maximum 10^4, and the largest n.

## 4. Think out loud: from first idea to best solution

The most literal method tries every plan. On each day you either act (buy if you hold nothing, sell if you hold a share) or you do nothing, so there are 2^n plans, each checked in O(n) or built up recursively. That is exponential: 2^30,000 is far beyond any time limit, and a recursive version would also recurse n levels deep. I say it to show I know the search space, and I do not code it. The useful observation is that the only thing a plan needs to know about the past is **whether I hold a share right now**, and that cuts the search down to two states.

### Approach 1: Dynamic programming with two states

#### What I say out loud

> "Brute force branches on every day, but two plans that reach the same day in the same situation, both holding a share or both empty-handed, have the same future. Only the one with more money so far matters. So for each day I keep two numbers: the best profit if I end the day holding nothing, and the best if I end it holding a share."

> "Then each day is a small update. To end today empty-handed, either I was empty yesterday and did nothing, or I held a share and sold it today. To end today holding, either I held yesterday and did nothing, or I was empty and bought today. The answer is the empty-handed value on the last day, because ending with an unsold share can't help."

#### Intuition

This is a [[a11-state-machine-dp|state machine DP]]: two states, "free" (no share) and "hold" (one share), with transitions *rest*, *buy* (free → hold, pay the price) and *sell* (hold → free, receive the price). Profit is measured as cash: buying subtracts the price, selling adds it.

#### Algorithm

1. `free = 0` (day 0, no share, no trade), `hold = -prices[0]` (bought on day 0).
2. For each day i from 1 to n − 1, with `p = prices[i]`:
   - `newFree = max(free, hold + p)` (rest, or sell today);
   - `newHold = max(hold, free - p)` (rest, or buy today);
   - assign both.
3. Return `free`.

#### Why it is correct

**What each value means.** After processing day i, `free` is the largest cash balance over all legal plans on days 0..i that end day i without a share, and `hold` is the largest over those that end it with one. Profit is cash, so the final `free` is the best profit among plans that end empty-handed.

**Why the update is right.** Any plan that ends day i free either was free at the end of day i − 1 and did nothing on day i, or held a share then and sold it on day i. Its cash is at most `free` or `hold + p` respectively, and both of those are reachable, so `newFree` is the maximum. The same case split gives `newHold`. Selling and buying on the same day leaves you holding with unchanged cash (`hold + p - p`), which `newHold = max(hold, …)` already covers, so allowing it adds nothing new.

**Why return `free`.** A plan that ends holding a share paid for it and never sold it. Dropping that last purchase gives a legal plan with at least as much cash, so the best plan ends free.

#### Dry run

`prices = [3, 1, 4, 2, 6]`

| Day | p | `free` after | `hold` after | What the new values mean |
|---|---|---|---|---|
| 0 | 3 | 0 | −3 | empty, or bought at 3 |
| 1 | 1 | max(0, −3 + 1) = 0 | max(−3, 0 − 1) = −1 | buying at 1 is better than holding the 3 |
| 2 | 4 | max(0, −1 + 4) = 3 | max(−1, 0 − 4) = −1 | sell at 4 for +3 |
| 3 | 2 | max(3, −1 + 2) = 3 | max(−1, 3 − 2) = 1 | buy again at 2 with the 3 in hand |
| 4 | 6 | max(3, 1 + 6) = 7 | max(1, 3 − 6) = 1 | sell at 6 |

Returns 7.

#### Java code

```java title="Approach 1: two-state DP"
class Solution {
    public int maxProfit(int[] prices) {
        int free = 0;            // best cash, no share held at the end of the day
        int hold = -prices[0];   // best cash, one share held at the end of the day
        for (int i = 1; i < prices.length; i++) {
            int p = prices[i];
            int newFree = Math.max(free, hold + p); // rest, or sell today
            int newHold = Math.max(hold, free - p); // rest, or buy today
            free = newFree;
            hold = newHold;
        }
        return free;
    }
}
```

#### Time complexity

**O(n) in every case**, where n is `prices.length`: one loop of n − 1 iterations with constant work each. No hashing, so this is a worst-case bound.

#### Space complexity

**O(1) auxiliary space.** The full table would have 2n entries, but each day reads only the previous day, so two variables replace it ("rolling" the table).

#### The bridge to the next approach

> "That's already optimal in complexity. But look at what it does on the example: it sells at 4, buys at 2, sells at 6. It catches every rise and sits out every fall. I wonder whether the answer is just the sum of all the upward steps. Let me check what one trade is worth in terms of daily steps."

> "A trade from day b to day s earns `prices[s] - prices[b]`, and that telescopes into the sum of `prices[d] - prices[d - 1]` for d from b + 1 to s. So every trade is a block of consecutive daily changes. The best I can do with a block is keep its positive changes and drop the negative ones, and I can do that by splitting the trade at every fall. With no fees, splitting costs nothing."

### Approach 2: Sum every positive daily rise (recommended)

#### What I say out loud

> "The answer is the sum of `max(0, prices[i] - prices[i - 1])` over all days. Each trade's profit is a sum of consecutive daily changes, trades don't overlap because I hold at most one share, so any plan's profit is a sum of daily changes over distinct days, and that's at most the sum of all the positive ones. And I can actually earn exactly that: for each rising day, buy the day before and sell that day. Same-day sell-and-buy makes consecutive rising days legal."

#### Intuition

Think of the price chart as a sequence of up-steps and down-steps. Holding a share through a step earns that step's change. You are free to be in or out on every step, so be in on every up-step and out on every down-step. This is a greedy choice that is safe because the choices for different days do not interact: there is no fee, no limit on trades and no cooldown (the general question of when local choices add up is in [[a10-local-vs-global|Local vs Global Optimum]]).

#### Algorithm

1. `profit = 0`.
2. For each i from 1 to n − 1: if `prices[i] > prices[i - 1]`, add the difference.
3. Return `profit`.

#### Why it is correct

Write `g(d) = prices[d] - prices[d - 1]` for the change on day d (1 ≤ d ≤ n − 1), and G for the sum of the positive `g(d)`.

**No plan earns more than G.** A plan is a list of trades; trade k buys on day b_k and sells on day s_k > b_k. Because you hold at most one share, trade k + 1 is bought no earlier than trade k is sold: s_k ≤ b_(k+1). Trade k earns

`prices[s_k] - prices[b_k] = g(b_k + 1) + g(b_k + 2) + … + g(s_k)`,

the sum of the changes on days b_k + 1 through s_k. Those day ranges do not overlap, since s_k ≤ b_(k+1) < b_(k+1) + 1. So the plan's total profit is a sum of `g(d)` over a set of distinct days. Replacing every negative term by 0 can only increase that sum, and adding the positive `g(d)` on days the plan does not use can only increase it further, which gives G. So every plan earns at most G.

**Some plan earns exactly G.** For each day d with `g(d) > 0`, buy on day d − 1 and sell on day d. Each trade earns `g(d)`. Two such trades can only meet when one sells on day d and the next buys on the same day d, which the statement allows; otherwise they are separated. You never hold two shares. So this legal plan earns G, and G is the maximum.

**The 25-second version to say to the interviewer:**

> "Any trade's profit telescopes into the daily price changes between its buy and sell day. Trades can't overlap, so a plan's profit is a sum of daily changes over distinct days, which is at most the sum of the positive ones. And that sum is achievable: buy the day before each rise and sell on the day of the rise; same-day sell-and-buy makes back-to-back rises legal. So summing the positive differences is exactly the maximum."

#### Dry run

`prices = [3, 1, 4, 2, 6]`

| i | `prices[i - 1]` → `prices[i]` | change | Added | `profit` |
|---|---|---|---|---|
| 1 | 3 → 1 | −2 | 0 | 0 |
| 2 | 1 → 4 | +3 | 3 | 3 |
| 3 | 4 → 2 | −2 | 0 | 3 |
| 4 | 2 → 6 | +4 | 4 | 7 |

Returns 7, the same as the DP. The plan behind it: buy day 1, sell day 2; buy day 3, sell day 4.

#### Java code

```java title="Approach 2: sum of positive daily changes (recommended)"
class Solution {
    public int maxProfit(int[] prices) {
        int profit = 0;   // at most (n - 1) * 10^4 < 3 * 10^8, fits in an int
        for (int i = 1; i < prices.length; i++) {
            if (prices[i] > prices[i - 1]) {
                profit += prices[i] - prices[i - 1]; // hold the share through every rise
            }
        }
        return profit;
    }
}
```

#### Time complexity

**O(n) in every case**: n − 1 comparisons and at most n − 1 additions.

#### Space complexity

**O(1) auxiliary space**: one counter and the loop index.

### Alternative: valley-to-peak trades

Walk the array; find the next local minimum (a valley) and buy there, then the next local maximum (a peak) and sell there; repeat. Each valley-to-peak trade earns exactly the sum of the rises in that stretch, so the total equals Approach 2. It is useful if the interviewer asks for the actual trades, because it produces the fewest trades that achieve the maximum. It needs more index care: plateaus need the `<=` and `>=` comparisons below, or the pointers stall.

```java title="Alternative: valley-to-peak trades"
class Solution {
    public int maxProfit(int[] prices) {
        int n = prices.length;
        int profit = 0;
        int i = 0;
        while (i < n - 1) {
            while (i < n - 1 && prices[i + 1] <= prices[i]) {
                i++;                                  // walk down to a valley
            }
            int buy = prices[i];
            while (i < n - 1 && prices[i + 1] >= prices[i]) {
                i++;                                  // walk up to a peak
            }
            profit += prices[i] - buy;                // zero if the walk ended at the valley
        }
        return profit;
    }
}
```

Same O(n) time and O(1) space. Each inner loop only moves `i` forward, so the total work is linear even though the loops are nested.

## 5. Comparison table

n = `prices.length`.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Baseline: try every plan | O(2^n) | O(2^n) | O(n) recursion stack |
| 1. Two-state DP | O(n) | O(n) | O(1) after rolling; O(n) with the full table |
| 2. Sum of positive changes | O(n) | O(n) | O(1) |
| Alt. Valley-to-peak | O(n) | O(n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Two-state DP | Derivable without insight; extends to fees, cooldowns and k-transaction limits | Slightly more to explain than the greedy | When a variant adds a fee, a cooldown or a cap on trades, or if you do not see the greedy |
| 2. Sum of positive changes | Shortest code; easy to prove once the telescoping is seen | Only works because trades are free and unlimited | The default answer to this exact problem |
| Alt. Valley-to-peak | Produces the actual trades, fewest of them | More index handling; plateau bugs | When asked to output the transactions |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** the sum of positive daily changes, with its two-part correctness argument (upper bound, then achievability). Mention the two-state DP as the systematic way you would derive it, or present the DP first if the greedy has not occurred to you yet: it is a complete, optimal answer on its own.

**Is it optimal?** Yes. In the worst case a correct algorithm must inspect essentially every price: changing any single unread price can turn a fall into a rise and change the answer. That gives an Ω(n) worst-case lower bound, and both approaches are O(n) with O(1) space.

**When something else is better in practice:** if the interviewer is likely to add a fee, a cooldown or a cap on transactions, the DP is the version that survives the change, and it is worth presenting it alongside the greedy.

**When to stop:** once you have O(n) time, O(1) space and the proof. There is nothing left to optimize.

## 7. Interview script: code it and test it

### What I say while coding

> "One counter, `profit`. I loop from day 1, compare with the previous day, and add the difference only if it's positive. Strictly greater: equal prices add nothing anyway, but writing `>` makes that explicit."

> "The loop starts at 1 so `i - 1` is always valid, and with a single day it doesn't run and I return 0."

> "Overflow: at most n − 1 rises of at most 10^4 each, under 3 × 10^8, so `int` is fine."

### Testing out loud

**Normal case:** `[3, 1, 4, 2, 6]`. Changes −2, +3, −2, +4; adds 3 and 4. Returns 7.

**One day:** `[5]`. The loop does not run. Returns 0.

**Strictly decreasing:** `[9, 7, 4, 2]`. Changes −2, −3, −2, nothing added. Returns 0.

**Flat:** `[4, 4, 4]`. Changes 0, 0; the `>` test fails both times. Returns 0.

**Strictly increasing:** `[1, 2, 3, 4]`. Adds 1 three times. Returns 3, which equals the single trade from 1 to 4, as the telescoping argument predicts.

**Extremes:** `[0, 10000, 0, 10000]`. Adds 10^4 twice. Returns 20,000. Over 3 × 10^4 days alternating 0 and 10^4 the answer is 15,000 × 10^4 = 1.5 × 10^8, well inside `int`.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1–2 min | Same-day sell-and-buy, no fee, no cooldown, overflow bound |
| Brute force and states | 2 min | "Each day: act or not", then "only hold or not matters" |
| DP or greedy derivation | 3–4 min | Two-state transitions, then the telescoping observation |
| Correctness | 2 min | Upper bound and achievability |
| Code | 2 min | Five lines |
| Trace and edge cases | 2 min | Example, one day, decreasing, flat |

The time belongs in the correctness argument: many candidates write the three-line greedy and then cannot say why it is the maximum. If the greedy idea does not come, the DP is a full-credit answer; code it, and then look at its dry-run table, which shows the greedy plan.

## 9. Interviewer challenges

### About correctness

#### Why is summing every rise allowed? A real plan doesn't trade every day.

**What they are testing:** whether you see that the sum describes a legal plan, not only an upper bound.

**How to reason:** build the plan explicitly and check the two rules: one share at a time, sell before buying again.

**What I say:** "For each rising day d, I buy on d − 1 and sell on d. If the next day also rises, I sell on d and buy again on d, which the problem allows. That plan holds at most one share and earns exactly the sum. If you'd rather not trade every day, merging consecutive rises into one trade from the valley to the peak earns the same amount, because the profits telescope."

**Nuance:** the problem's permission to sell and buy on the same day is not even needed for the value: merging consecutive rises gives a plan without same-day trades and the same profit.

#### Prove that no plan beats it.

**What they are testing:** whether "it looks right" is backed by an argument.

**How to reason:** express any trade in the same currency as the greedy: daily changes.

**What I say:** "A trade from b to s earns `prices[s] − prices[b]`, which is the sum of the daily changes on days b + 1 to s. Since I hold one share at most, different trades cover different days. So any plan's profit is a sum of daily changes over distinct days, and dropping the negative ones and adding the remaining positive ones can only raise it to the greedy total."

**Nuance:** this argument is exactly where the "no fee" rule is used. With a fee, splitting a trade costs money, and the upper bound no longer holds.

### About the code

#### In the DP, does it matter whether you update `free` or `hold` first?

**What they are testing:** whether you understand the transitions or copied a template with temporary variables.

**How to reason:** substitute the already-updated value into the other formula and simplify.

**What I say:** "If I update `free` first and then use the new `free` for `hold`, I get `max(hold, max(free, hold + p) − p)`, which is `max(hold, free − p, hold)`, the same as before. That's the 'sell and rebuy the same day' move, which nets zero. So here the order doesn't matter, but I keep temporaries because in variants like a cooldown it does."

**Nuance:** with a cooldown, buying is only allowed from the state *before* yesterday's sale, so mixing old and new values gives wrong answers. Writing the temporaries is the habit that keeps that safe.

### About complexity

#### Can you do better than O(n)?

**What they are testing:** whether you can argue a lower bound.

**How to reason:** find an input where one unread price decides the answer.

**What I say:** "No. Take a strictly decreasing array: the answer is 0. Change any single price, raising it above the day before or, for the first day, lowering it below the second, and the answer becomes positive. An algorithm that skipped that position couldn't tell the two inputs apart, so in the worst case every price must be read: an Ω(n) worst-case lower bound, and we're at O(n) with O(1) space."

**Nuance:** the lower bound is about the worst case; on some inputs nothing can be skipped anyway, since every position matters to the sum.

## 10. Follow-up questions the interviewer might ask

**"Only one transaction is allowed."**
Then the greedy breaks: `[1, 5, 3, 6]` sums rises to 7, but one trade earns at most 5. Track the minimum price so far and the best `price − minimum`. O(n) time, O(1) space. This is [[nc-best-time-to-buy-and-sell-stock|Best Time to Buy and Sell Stock]].

**"Each sale costs a fee f."**
Splitting trades now costs money, so the greedy is wrong: with f = 2 and `[1, 4, 5]`, summing `max(0, change − f)` gives 1, but one trade from 1 to 5 earns 4 − 2 = 2. Use the two-state DP with `newFree = max(free, hold + p − f)`. O(n) time, O(1) space.

**"After selling you must wait one day before buying."**
Add a third state, "just sold" (cooling down), or let the buy transition read the free value from two days ago. Still O(n) time and O(1) space. This is [[nc-best-time-to-buy-and-sell-stock-with-cooldown|Best Time to Buy and Sell Stock with Cooldown]].

**"At most k transactions."**
Keep a free and a hold value for each number of transactions used: O(nk) time and O(k) space. If k ≥ n / 2, the cap cannot bind (a plan has at most n / 2 trades that each earn something), so fall back to the greedy.

**"Return the actual trades."**
Use the valley-to-peak walk and record each (buy day, sell day). O(n) time; the output has at most n / 2 trades.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Solving Stock I instead.** Tracking a single minimum and the best single trade returns 5 on `[1, 5, 3, 6]`, where the answer is 7.
- **Asserting the greedy is optimal without a reason.** It is optimal because trades telescope into daily changes and trades cannot overlap; say that, or the interviewer will ask.
- **Thinking you must find local minima and maxima.** It works, but the per-day sum gives the same value with no index edge cases.
- **Carrying the greedy into a variant with fees or limits.** The proof uses "splitting a trade is free"; when that is false, return to the DP.

### Implementation mistakes

> [!MISTAKE] Valley-to-peak with strict comparisons
> Writing the two inner loops with `<` and `>` instead of `<=` and `>=` hangs on a plateau: for `[2, 2]` neither inner loop moves `i`, so the outer `while (i < n - 1)` never ends. With the comparisons in the alternative above, the first inner loop steps over equal prices.

- **Starting the loop at 0 and reading `prices[i - 1]`.** That reads index −1 and throws.
- **Adding `Math.abs(change)`** instead of only positive changes: on `[9, 7, 4, 2]` that returns 7 instead of 0.
- **Returning `hold` or `Math.max(free, hold)` from the DP.** The second happens to give the same number, because `hold` never exceeds `free` when prices are non-negative, but it suggests that ending with an unsold share could be optimal. Return `free`, and say why.

## 12. Pattern recognition

**The pattern:** greedy over independent local gains, justified by decomposing the objective (a trade's profit) into per-step contributions; with a two-state DP as the systematic fallback.

**Signals in the problem statement:**

- "As many transactions as you like", no fee, no cooldown.
- A profit that is a difference of two values, which telescopes into consecutive differences.
- A state that is small (hold or not) at each step.

**Related problems in this list:**

- [[nc-best-time-to-buy-and-sell-stock|Best Time to Buy and Sell Stock]]: one transaction; minimum-so-far instead of summing rises.
- [[nc-best-time-to-buy-and-sell-stock-with-cooldown|Best Time to Buy and Sell Stock with Cooldown]]: the greedy fails; the state-machine DP with a third state wins.
- [[nc-maximum-subarray|Maximum Subarray]]: another "sum of consecutive changes" problem, but with one contiguous block, which needs Kadane's algorithm.
- [[nc-gas-station|Gas Station]]: a greedy whose proof also rests on summing per-step gains and losses.
- [[nc-jump-game|Jump Game]]: a greedy with a short exchange-style proof.

**Takeaway:** when the objective telescopes into per-step gains and nothing (fees, limits, cooldowns) ties the steps together, collect every positive step; otherwise model the small state and run a DP.

## 13. 60-second revision card

**Key insight:** a trade from b to s earns the sum of the daily changes between them, and trades cannot overlap. So the best profit is the sum of the positive daily changes, and buying before each rise and selling on it achieves it.

**Invariant:** after day i, `profit` is the sum of positive changes on days 1..i, which is the best profit for the prices up to day i.

**Complexity:** O(n) time, O(1) auxiliary space; Ω(n) worst-case lower bound. The result is below 3 × 10^8, so `int` is safe.

**Code skeleton:**

```java title="Stock II in four lines" fragment="public int maxProfit(int[] prices)"
int profit = 0;
for (int i = 1; i < prices.length; i++)
    if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
return profit;
```

**Main traps:**

- Prove both halves: no plan beats the sum, and some legal plan reaches it.
- Only positive changes; equal prices add nothing.
- The greedy depends on no fee, no cooldown and no cap; otherwise use the hold/free DP.

**What to say in one breath:** "Two states, holding or not, give an O(n) DP. Looking at it, every trade's profit telescopes into daily price changes, and trades can't overlap, so no plan beats the sum of positive changes, while buying before each rise and selling on it achieves that sum. One pass, O(n) time, O(1) space, and the total stays under 3 × 10^8."
