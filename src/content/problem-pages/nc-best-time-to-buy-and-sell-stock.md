---
problemId: nc-best-time-to-buy-and-sell-stock
title: Best Time to Buy and Sell Stock
source: neetcode
sourceUrl: https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
difficulty: easy
patterns: [sliding-window, greedy]
relatedLessons: [a2-sliding-window, a2-prefix-suffix, a2-kadane, a2-array-string-traversal, a14-brute-force-first]
companies: []
timeToSolve: 10
---

## 1. Problem restatement

You get an array `prices`, where `prices[i]` is the price of a stock on day i. You may make at most one trade: buy on one day and sell on a strictly later day. Return the largest profit (sell price minus buy price) you can make. If no trade makes money, return 0.

**Example 1**

- Input: `prices = [4, 9, 1, 7, 2]`
- Output: `6`
- Why: buying on day 2 at 1 and selling on day 3 at 7 earns 6. Buying at 4 and selling at 9 earns only 5, and you cannot buy at 1 and sell at 9 because day 1 comes before day 2.

**Example 2**

- Input: `prices = [9, 6, 6, 2]`
- Output: `0`
- Why: the price never rises from one day to any later day, so every trade loses money or breaks even. Not trading gives 0.

**What the problem statement guarantees**

- 1 ≤ `prices.length` ≤ 10^5.
- 0 ≤ `prices[i]` ≤ 10^4.
- One buy, then one sell on a different, later day; the answer is never negative.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The code is a handful of lines; what an interviewer listens for is how you get from the obvious double loop to one pass, and whether you can say why one pass is enough. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 10 minutes and talk out loud.
2. Write the slowest correct method and its complexity.
3. Fix the sell day. Ask what you would need to know about the earlier days to pick the best buy day instantly.
4. Write the code and trace it on both examples and on a single-day array.

Open a hint only after two minutes without progress.

> [!HINT] Hint 1: a small nudge
> If you decide to sell on day j, which buy day is best? The answer does not depend on anything after day j.

> [!HINT] Hint 2: the kind of tool you need
> A single running summary of the days already passed is enough to answer "what is the best buy day before today?", and you can update it in constant time as you move one day forward.

> [!HINT] Hint 3: almost the whole plan
> Walk through the days once. Keep the lowest price seen so far and the best profit so far. On each day, compute today's price minus the lowest earlier price and keep the larger profit, then update the lowest price with today's price. Start the best profit at 0.

**Check yourself before revealing the walkthrough**

- [ ] I stated the brute force and why it is O(n²)
- [ ] My code returns 0 for `[9, 6, 6, 2]` and for a single price
- [ ] I can say what my two variables mean before each day is processed
- [ ] I checked whether the answer can overflow an `int`

## 3. Interview script: understand the problem (≈1 min)

The statement is short. The questions that matter are whether the sell must come after the buy, what to return when nothing is profitable, and how many trades are allowed, because the multi-trade version is a different problem.

**Me:** I buy once and sell once, and the sell has to be on a later day than the buy?

**Interviewer:** Yes, a different day in the future.

**Me:** Only one trade in total, not as many as I like?

**Interviewer:** One.

**Me:** And if every trade loses money, I return 0, meaning I just don't trade?

**Interviewer:** Right.

**Me:** Up to 10^5 days, prices from 0 to 10^4. So a profit is at most 10^4, which fits easily in an `int`. Let me do Example 1 by hand: `[4, 9, 1, 7, 2]`. Selling at 9 I'd have bought at 4, profit 5. Selling at 7 the cheapest earlier price is 1, profit 6. Selling at 2, profit at most 1. So 6.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^5 | Trying all buy–sell pairs is about 5 × 10^9 steps at n = 10^5; I want O(n). A single day means no trade is possible, so 0. |
| 0 ≤ prices[i] ≤ 10^4 | Any difference lies between −10^4 and 10^4, so `int` arithmetic cannot overflow. |
| Sell strictly after buy, return 0 if no profit | The buy must come from earlier days only, and the answer starts at 0 rather than at some negative difference. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Exactly one trade at most | No summing of several gains; that is the multi-trade problem. |
| Only the profit is returned, not the days | I don't need to track which days achieve it. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The array is read-only | My solution only reads it. |

### Edge cases I will keep in mind

- One day: `[5]` gives 0.
- Prices only fall or stay flat: `[9, 6, 6, 2]` gives 0.
- The overall minimum comes after the overall maximum: `[4, 9, 1, 7, 2]`, where the answer is neither max − min nor uses the global maximum.
- The best buy is the last new minimum before a rise: `[3, 5, 1, 4]` gives 3.
- All prices equal: 0.

## 4. Think out loud: from first idea to best solution

### Approach 1: Brute force (every buy day, every later sell day)

#### What I say out loud

> "The definition: maximum of `prices[j] − prices[i]` over all `i < j`, or 0. Two nested loops give it in O(n²), about 5 × 10^9 pairs at the limit, so it's the baseline."

#### Intuition

There are n(n − 1)/2 legal trades. Trying all of them and keeping the best, starting from 0 for "no trade", is correct by definition.

#### Algorithm

1. `best = 0`.
2. For each `i`, for each `j > i`: `best = max(best, prices[j] − prices[i])`.
3. Return `best`.

#### Why it is correct

Every legal trade is one pair `i < j` and every pair is evaluated, so `best` is the maximum over all legal trades, or 0 if none is positive.

#### Dry run

`prices = [4, 9, 1, 7, 2]`: the pairs starting at day 0 give 5, −3, 3, −2; from day 1: −8, −2, −7; from day 2: 6, 1; from day 3: −5. The largest is 6.

#### Java code

```java title="Approach 1: brute force"
class Solution {
    public int maxProfit(int[] prices) {
        int best = 0;
        for (int i = 0; i < prices.length; i++) {
            for (int j = i + 1; j < prices.length; j++) {
                best = Math.max(best, prices[j] - prices[i]);
            }
        }
        return best;
    }
}
```

#### Time complexity

**O(n²)**: n(n − 1)/2 pairs, 4,999,950,000 at n = 10^5, with no early exit.

#### Space complexity

**O(1) auxiliary space.**

#### The bridge to the next approach

> "For a fixed sell day j, the inner loop over i is just looking for the smallest price before j. When I move from j to j + 1, that smallest price changes by at most one candidate, `prices[j]`. So I can carry the minimum forward instead of recomputing it."

### Approach 2: One pass with the minimum so far (recommended)

#### What I say out loud

> "I walk left to right keeping two numbers: the lowest price seen so far and the best profit so far. On each day, selling today earns today's price minus the lowest earlier price; I keep the larger profit. Then today's price becomes a candidate buy for later days. One pass, O(n) time, O(1) space."

#### Intuition

For a sell on day j, the best buy is the minimum of `prices[0..j−1]`. That minimum is a prefix summary that updates in O(1) per day. You can also see it as a window `[buy, sell]` whose left end jumps to a new low whenever one appears: a new low is a better buy for every later sell day.

#### Algorithm

1. `minPrice = prices[0]`, `best = 0`.
2. For each day `i` from 1 to n − 1:
   1. `best = max(best, prices[i] − minPrice)`.
   2. `minPrice = min(minPrice, prices[i])`.
3. Return `best`.

#### Why it is correct

**Invariant:** before processing day `i`, `minPrice = min(prices[0..i−1])` and `best` is the best profit over all trades that sell on a day before `i` (or 0).

- It holds at `i = 1`: the only earlier day is 0, and no trade has sold yet.
- At day `i`, the best trade selling on day i buys at the earliest-days minimum, which is `minPrice`, so step 2.1 accounts for every trade selling on day i. Step 2.2 then adds day i to the prefix minimum.
- After the last day, `best` covers trades selling on every day, so it is the answer.
- The order inside the loop matters: comparing before updating the minimum guarantees the buy is strictly earlier than the sell. (Updating first is also harmless here, since buying and selling on the same day gives 0, but the stated order matches the invariant.)

**The 20-second version:**

> "For any sell day, the best buy is the cheapest earlier day. I carry that minimum as I go, so each day I know the best trade that sells today in O(1). The best of those over all days is the answer, and starting at 0 covers 'don't trade'."

#### Dry run

`prices = [4, 9, 1, 7, 2]`

| i | prices[i] | minPrice before | prices[i] − minPrice | best after | minPrice after |
|---|---|---|---|---|---|
| 0 | 4 | — | — | 0 | 4 |
| 1 | 9 | 4 | 5 | 5 | 4 |
| 2 | 1 | 4 | −3 | 5 | 1 |
| 3 | 7 | 1 | 6 | 6 | 1 |
| 4 | 2 | 1 | 1 | 6 | 1 |

Result 6. On `[9, 6, 6, 2]` every difference is ≤ 0 (−3, −3, −4), so `best` stays 0.

#### Java code

```java title="Approach 2: minimum so far (recommended)"
class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = prices[0]; // cheapest buy among the days already passed
        int best = 0;             // not trading earns 0
        for (int i = 1; i < prices.length; i++) {
            best = Math.max(best, prices[i] - minPrice); // sell today
            minPrice = Math.min(minPrice, prices[i]);    // today becomes a buy candidate
        }
        return best;
    }
}
```

With one price the loop does not run and the method returns 0.

#### Time complexity

**O(n)**: one pass with constant work per day. Guaranteed, no hashing involved.

#### Space complexity

**O(1) auxiliary space**: two `int` variables.

### Alternative: maximum subarray sum on daily changes

Write `d[i] = prices[i] − prices[i − 1]` for each day i ≥ 1. The profit of buying on day b and selling on day s is `d[b + 1] + … + d[s]`, a telescoping sum. So the answer is the maximum sum of a non-empty contiguous run of daily changes, or 0, which is [[a2-kadane|Kadane's algorithm]]:

```java title="Alternative: Kadane on daily differences"
class Solution {
    public int maxProfit(int[] prices) {
        int current = 0; // best sum of changes ending today, or 0 if negative
        int best = 0;
        for (int i = 1; i < prices.length; i++) {
            current = Math.max(0, current + prices[i] - prices[i - 1]);
            best = Math.max(best, current);
        }
        return best;
    }
}
```

On `[4, 9, 1, 7, 2]` the changes are 5, −8, 6, −5; `current` goes 5, 0, 6, 1, so the answer is 6. It is the same algorithm in disguise: `current` always equals `prices[i] − min(prices[0..i])`. It is worth knowing because it connects this problem to [[nc-maximum-subarray|Maximum Subarray]]; it is not simpler to explain, so the minimum-so-far form remains the one to give.

## 5. Comparison table

n = `prices.length`.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Brute force | O(n²) | O(n²) | O(1) |
| 2. Minimum so far | O(n) | O(n) | O(1) |
| Alternative: Kadane on changes | O(n) | O(n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Brute force | Matches the definition exactly | Quadratic | Only as the baseline |
| 2. Minimum so far | Shortest, easiest invariant | None worth mentioning | The default answer |
| Alternative: Kadane on changes | Links to maximum subarray | One more step of explanation | When the interviewer asks for another view, or the input is given as daily changes |

## 6. Which solution to give, and when to stop optimizing

**Give Approach 2.** It is O(n) time and O(1) space, and both bounds are guaranteed. **Is it optimal?** Yes: in the worst case a correct algorithm must read essentially every price, since an unread price could be a new high or low that changes the answer, so there is an Ω(n) worst-case lower bound, and O(1) extra space cannot be beaten. **Where to stop:** once you have the one pass and its invariant. Mention the Kadane view only if asked.

## 7. Interview script: code it and test it

### What I say while coding

> "`minPrice` starts at the first price; `best` starts at 0 for 'no trade'."

> "Inside the loop I compute the profit of selling today first, then let today become a buy candidate, so I never buy and sell on the same day."

### Testing out loud

**Example 1:** `[4, 9, 1, 7, 2]`. Profits 5, −3, 6, 1 against minima 4, 4, 1, 1: answer 6.

**Example 2, falling and flat:** `[9, 6, 6, 2]`. Differences −3, −3, −4: answer 0.

**One day:** `[5]`. Loop skipped: 0.

**Late minimum before a rise:** `[3, 5, 1, 4]`. Profits 2, −2, 3: answer 3, using the minimum 1 found at day 2.

**All equal:** `[2, 2, 2]`. Differences 0: answer 0.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | about 1 min | One trade, sell after buy, 0 if no profit |
| Brute force and the idea | 1–2 min | Pairs O(n²); best buy for a sell day is the earlier minimum |
| Code | 1–2 min | The one-pass loop |
| Test and complexity | 2 min | Examples, one day, invariant, O(n)/O(1) |

This is a warm-up. Spend the spare minute on the invariant; if stuck, fix the sell day and ask what the best buy is.

## 9. Interviewer challenges

### About correctness

#### Why isn't the answer just max(prices) − min(prices)?

**What they are testing:** whether you respect the time order.

**How to reason:** the maximum might come before the minimum.

**What I say:** "The buy must come first. In `[4, 9, 1, 7, 2]` the max is 9 at day 1 and the min is 1 at day 2, so max − min = 8 is not a legal trade. The real answer is 6."

**Nuance:** max − min is an upper bound on the answer, which is a handy sanity check in testing.

#### What happens when you find a new minimum after a good trade?

**What they are testing:** whether you see that updating the minimum cannot lose the earlier best.

**How to reason:** `best` already records the earlier trade; the minimum only affects future sell days.

**What I say:** "The earlier trade's profit is already stored in `best`, and a lower price can only help future sales. So moving the minimum never loses anything."

**Nuance:** this is why the two variables are independent summaries: one of the past answers, one of the best possible buy.

### About alternatives

#### Can you see this as a maximum subarray problem?

**What they are testing:** whether you can connect problems.

**How to reason:** a profit is the sum of the daily changes between buy and sell.

**What I say:** "Yes. The profit from b to s telescopes into the sum of daily changes from b + 1 to s, so the answer is the maximum subarray sum of the changes, floored at 0. Kadane on the changes gives the same O(n), O(1) solution."

**Nuance:** in Kadane form the running sum equals today's price minus the minimum so far, so the two solutions compute the same numbers.

## 10. Follow-up questions the interviewer might ask

**"As many trades as you like, holding at most one share."**
That is [[nc-best-time-to-buy-sell-stock-ii|Best Time to Buy/Sell Stock II]]: add every positive daily change. O(n) time, O(1) space.

**"Return the buy and sell days too."**
Remember the index of the current minimum, and record (minIndex, i) whenever `best` improves. O(n) time, O(1) space.

**"At most two trades."**
Run the one-trade computation from the left (best profit ending by day i) and from the right (best profit starting at or after day i), then combine at every split day. O(n) time, O(n) space; it can also be done with four running state variables in O(1) space.

**"With a one-day cooldown after selling."**
That becomes a small state machine DP, [[nc-best-time-to-buy-and-sell-stock-with-cooldown|Best Time to Buy and Sell Stock with Cooldown]]: O(n) time, O(1) space with three states.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Returning max − min.** It ignores the order of days; `[4, 9, 1, 7, 2]` would give 8.
- **Answering for multiple trades.** Summing all rises solves a different problem; for `[4, 9, 1, 7, 2]` it gives 11.

### Implementation mistakes

> [!MISTAKE] Starting `best` at a negative value
> Initialising `best = Integer.MIN_VALUE` returns a negative number when prices strictly fall: −3 for `[9, 6, 2]`, when the answer must be 0. (With a single price it even returns `Integer.MIN_VALUE`.)

- **Initialising `minPrice` to 0.** Every price is ≥ 0, so the minimum never changes and `[4, 9, 1, 7, 2]` returns 9, as if you bought for free.

## 12. Pattern recognition

**The pattern:** a running prefix summary (the minimum so far), equivalently a window whose left end jumps to each new low.

**Signals in the problem statement:**

- Choose an earlier index and a later index to maximize a difference.
- The best partner for a later index depends only on a simple summary of everything before it.
- n up to 10^5, so pairs are too slow.

**Related problems in this list:**

- [[nc-best-time-to-buy-sell-stock-ii|Best Time to Buy/Sell Stock II]]: unlimited trades, greedy on daily rises.
- [[nc-maximum-subarray|Maximum Subarray]]: the same problem on daily changes, solved by Kadane.
- [[nc-best-time-to-buy-and-sell-stock-with-cooldown|Best Time to Buy and Sell Stock with Cooldown]]: trades with constraints, solved with a state-machine DP.
- [[nc-trapping-rain-water|Trapping Rain Water]]: another problem built on running prefix extremes.

**Takeaway:** when the best "earlier partner" for each index is an extreme of the prefix, carry that extreme forward and the double loop becomes one pass.

## 13. 60-second revision card

**Key insight:** for each sell day the best buy is the cheapest earlier day, which you can carry along.

**Invariant:** before day i, `minPrice = min(prices[0..i−1])` and `best` is the best profit selling before day i, or 0.

**Complexity:** O(n) time, O(1) auxiliary space, both guaranteed. Profits fit in an `int` (at most 10^4).

**Code skeleton:**

```java title="One pass"
class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = prices[0], best = 0;
        for (int i = 1; i < prices.length; i++) {
            best = Math.max(best, prices[i] - minPrice);
            minPrice = Math.min(minPrice, prices[i]);
        }
        return best;
    }
}
```

**Main traps:**

- Using max − min, which ignores order.
- Starting `best` below 0.
- Confusing this with the unlimited-trades version.

**What to say in one breath:** "For each day as a sell day, the best buy is the minimum so far, so I keep that minimum and the best profit in one pass: O(n) time, O(1) space, and 0 if prices never rise."
