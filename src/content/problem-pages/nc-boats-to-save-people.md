---
problemId: nc-boats-to-save-people
title: Boats to Save People
source: neetcode
sourceUrl: https://leetcode.com/problems/boats-to-save-people/
difficulty: medium
patterns: [two-pointers, greedy, sorting]
relatedLessons: [a2-two-pointers, a10-sorting-greedy, a2-sorting-based, a3-counting-sort, a10-local-vs-global]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

You get an array `people`, where `people[i]` is the weight of person i, and an integer `limit`. There are as many boats as you want. Each boat carries **at most two people**, and the total weight in a boat may be at most `limit`. Return the smallest number of boats that carries everyone.

**Example 1**

- Input: `people = [1, 2, 2, 3]`, `limit = 3`
- Output: `3`
- Why: the person of weight 3 cannot share with anyone (even the lightest makes 4). The two people of weight 2 cannot share with each other (4). So: `{3}`, `{1, 2}`, `{2}`. Two boats are impossible, since that would need two pairs, and the 3 is in no pair.

**Example 2**

- Input: `people = [4, 1, 3, 2]`, `limit = 5`
- Output: `2`
- Why: `{4, 1}` and `{3, 2}` both weigh exactly 5. Four people need at least two boats, so 2 is the minimum.

**What the problem statement guarantees**

- 1 ≤ n ≤ 5 · 10^4, where n is the length of `people`.
- 1 ≤ `people[i]` ≤ `limit` ≤ 3 · 10^4. So **every person fits in a boat alone**, and an answer always exists.
- At most two people per boat; total weight at most `limit` (equal is allowed).
- Method: `int numRescueBoats(int[] people, int limit)`.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The code is short; the real work is convincing yourself that a simple pairing rule is optimal, and an interviewer will ask exactly that. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 20 minutes and talk out loud.
2. Solve a few small cases by hand, such as `[1, 2, 3, 4]` with limit 5 and `[1, 2, 2, 3]` with limit 3. Notice which people end up alone.
3. Find a rule that decides who shares a boat with whom, and try to break it with a small counterexample before you trust it.
4. Write the code, then trace it on `[1, 2, 2, 3]`, limit 3, and on a single person.
5. Be ready to argue in two or three sentences why your rule never uses more boats than necessary.

Open a hint only after two minutes without progress. After each hint, close it and try again before opening the next one.

> [!HINT] Hint 1: a small nudge
> Think about the heaviest person. Who is the best partner for them, if anyone can be? And if nobody can be, what does that force?

> [!HINT] Hint 2: the kind of tool you need
> Put the people in order of weight. Then the heaviest and the lightest remaining person are at the two ends, and you can decide about the heaviest person in O(1).

> [!HINT] Hint 3: almost the whole plan
> Sort. Keep one index at the lightest and one at the heaviest remaining person. Each step uses one boat: the heaviest always boards it; the lightest joins if their two weights fit. Then move the indices past whoever boarded. Prove it by showing that swapping partners in any optimal solution can make the heaviest share with the lightest without adding a boat.

**Check yourself before revealing the walkthrough**

- [ ] My answer for `[1, 2, 2, 3]`, limit 3 is 3, and for `[4, 1, 3, 2]`, limit 5 is 2
- [ ] My code returns 1 for a single person
- [ ] I can explain why the heaviest person should share with the lightest, if with anyone
- [ ] I can explain why pairing the two lightest people first is wrong, with a counterexample

## 3. Interview script: understand the problem (≈2 min)

**Me:** Let me say it back. Each boat holds one or two people, the weights in a boat sum to at most `limit`, and I want the fewest boats. Unlimited boats are available.

**Interviewer:** Right.

**Me:** Is a boat with total weight exactly `limit` allowed?

**Interviewer:** Yes, at most `limit`.

**Me:** And can someone be heavier than `limit` on their own?

**Interviewer:** No: every weight is between 1 and `limit`.

**Me:** Good, then everyone fits alone, so n boats always work, and the question is how many pairs I can form. Since every boat holds at most two, the answer is n minus the number of pairs, and it's at least n / 2 rounded up. Sizes?

**Interviewer:** Up to 5 · 10^4 people, and `limit` up to 3 · 10^4.

**Me:** So trying all pairings is out; I need something like O(n log n). Am I allowed to reorder the input array, for example sort it?

**Interviewer:** Yes, you can modify it.

**Me:** Let me do example 1 by hand: `[1, 2, 2, 3]`, limit 3. The 3 can't pair with anyone, so it goes alone. Of the rest, 1 and 2 fit together, and the other 2 goes alone. Three boats.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| At most two people per boat | The answer is n − (number of pairs), so the problem is to maximise the number of valid pairs. It is not a general bin-packing problem. |
| 1 ≤ `people[i]` ≤ `limit` | Everyone fits alone, so an answer always exists and nobody needs special handling. |
| `limit` ≤ 3 · 10^4 | A pair weighs at most 6 · 10^4, far below 2^31 − 1, so `int` sums cannot overflow. Also, weights come from a small range, so counting sort is possible in O(n + limit). |
| 1 ≤ n ≤ 5 · 10^4 | Exhaustive search over pairings is hopeless and O(n²) is about 1.25 · 10^9 pair checks; O(n log n) or O(n + limit) is the target. The answer is at most n, which fits in an `int`. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| A boat at exactly `limit` is allowed | The pairing test is `<=`, not `<`. |
| The input array may be modified | I can sort `people` in place instead of copying it. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| Who sits with whom need not be reported, only the count | I only count boats; I don't build the pairs. |

### Edge cases I will keep in mind

- n = 1: one boat.
- Everyone weighs `limit`: nobody can pair, n boats.
- Everyone very light, for example all 1 with `limit` = 3 · 10^4: ⌈n / 2⌉ boats.
- `limit` = 1: everyone weighs 1 and 1 + 1 > 1, so n boats.
- A pair weighing exactly `limit`.
- The last person left alone when the two indices meet.

## 4. Think out loud: from first idea to best solution

> "The safe starting point is to try every way of pairing people up and take the best. With n up to 5 · 10^4 the number of pairings is astronomically large, so that's only useful as a checker on tiny inputs. I need a rule that picks pairs directly."

> "Small cases first. `[1, 2, 3, 4]`, limit 5. If I greedily pair the two lightest, 1 and 2, then 3 and 4 don't fit together: three boats. But `{1, 4}` and `{2, 3}` is two. So the lightest people shouldn't be spent on each other; they're most valuable as partners for heavy people, who are the hard ones to place. That suggests deciding about the heaviest person first."

### Approach 1: Sort, then pair the heaviest with the lightest (recommended)

#### What I say out loud

> "Sort the weights. Look at the heaviest remaining person. If even the lightest remaining person doesn't fit with them, nobody does, so the heaviest goes alone. If the lightest does fit, put them together. Either way one boat leaves with the heaviest person. Two pointers, one at each end."

#### Intuition

The heaviest person is the hardest to place: anyone who can share with them can share with anyone else. The lightest person is the easiest partner: if they don't fit next to the heaviest, nobody does. Pairing the hardest with the most flexible wastes nothing. This is a sorting-based greedy rule ([[a10-sorting-greedy|Sorting + greedy]]) run with [[a2-two-pointers|two pointers]].

#### Algorithm

1. Sort `people` ascending.
2. `i = 0` (lightest remaining), `j = n − 1` (heaviest remaining), `boats = 0`.
3. While `i <= j`:
   - If `people[i] + people[j] <= limit`, the lightest boards too: `i++`.
   - The heaviest always boards: `j--`. One more boat: `boats++`.
4. Return `boats`.

When `i == j` only one person is left. The test `people[i] + people[j]` then adds that person to themselves; whichever branch runs, both `i` and `j` end past each other or `j` drops below `i`, and exactly one boat is counted. So the single remaining person gets one boat, as they should.

#### Why it is correct

Let h be the heaviest person still waiting and l the lightest (any one of them, if there are ties). The algorithm makes one decision about h; it is enough to show that the decision is part of some optimal arrangement of the people still waiting. Then, by repeating the argument on the people left, every boat the algorithm sends is consistent with an optimal plan, and the count is minimal.

**Case 1: l + h > limit.** Every other waiting person weighs at least l, so nobody fits with h. In every valid arrangement h is alone. Sending h alone is forced, so it cannot cost anything.

**Case 2: l + h ≤ limit.** Take any optimal arrangement of the waiting people. If h and l already share a boat, there is nothing to do. Otherwise, rearrange it without adding a boat so that they do:

- **h alone, l alone:** put them in one boat. That saves a boat, which is impossible for an optimal arrangement, so this case does not occur.
- **h alone, l with y:** move l into h's boat and leave y alone. Same number of boats. `l + h ≤ limit` is the case assumption, and y alone always fits.
- **h with z, l alone:** swap z and l. h and l fit together by assumption, z alone fits. Same number of boats.
- **h with z, l with y:** swap z and l, so the boats are `{h, l}` and `{z, y}`. `{h, l}` fits by assumption. For `{z, y}`: y weighs at most h, because h is the heaviest, so `z + y ≤ z + h ≤ limit`, the last step because z and h shared a boat. Same number of boats.

So some optimal arrangement puts h with l, and the algorithm does exactly that. The case `h with z, l with y` is the heart of it: it uses both "l is the lightest" (to know `{h, l}` fits) and "h is the heaviest" (to know `{z, y}` still fits).

**Why it terminates:** every iteration decreases `j`, so there are at most n iterations.

**The 25-second version to say to the interviewer:**

> "Sort, and look at the heaviest person. If the lightest doesn't fit with them, nobody does, so they must go alone. If the lightest fits, take any optimal plan: swapping the heaviest person's partner with the lightest person never breaks a boat, because the lightest fits with the heaviest by assumption, and the heaviest's old partner fits with the lightest's old partner, since that partner weighs no more than the heaviest. So pairing them costs nothing, and repeating this gives the minimum."

#### Dry run

`people = [1, 2, 2, 3]`, `limit = 3` (already sorted)

| i | j | `people[i] + people[j]` | Fits? | Who boards | boats |
|---|---|---|---|---|---|
| 0 | 3 | 1 + 3 = 4 | no | 3 alone | 1 |
| 0 | 2 | 1 + 2 = 3 | yes | 1 and 2 | 2 |
| 1 | 1 | 2 + 2 = 4 | no | 2 alone (`i == j`) | 3 |

Now `i = 1 > j = 0`: answer 3.

`people = [4, 1, 3, 2]`, `limit = 5`, sorted to `[1, 2, 3, 4]`

| i | j | `people[i] + people[j]` | Fits? | Who boards | boats |
|---|---|---|---|---|---|
| 0 | 3 | 1 + 4 = 5 | yes | 1 and 4 | 1 |
| 1 | 2 | 2 + 3 = 5 | yes | 2 and 3 | 2 |

Now `i = 2 > j = 1`: answer 2.

#### Java code

```java title="Approach 1: sort, then heaviest with lightest (recommended)"
import java.util.Arrays;

class Solution {
    public int numRescueBoats(int[] people, int limit) {
        Arrays.sort(people);                 // the interviewer allowed modifying the input
        int i = 0;                           // lightest person still waiting
        int j = people.length - 1;           // heaviest person still waiting
        int boats = 0;
        while (i <= j) {                     // i == j: one person left, still needs a boat
            if (people[i] + people[j] <= limit) {
                i++;                         // the lightest shares the heaviest's boat
            }
            j--;                             // the heaviest always leaves in this boat
            boats++;
        }
        return boats;
    }
}
```

#### Time complexity

**O(n log n)**, where n is `people.length`. The sort dominates; the two-pointer loop runs at most n times, O(1) each. Java sorts an `int[]` with a dual-pivot quicksort, and recent JDK documentation describes it as O(n log n) on all data sets; that is a property of the implementation, not of the method's contract. A sort with a guaranteed n log n worst case, such as heap sort, gives the same bound.

#### Space complexity

**O(1) auxiliary** apart from the sort. `Arrays.sort` on primitives works in place but may use O(log n) stack for recursion, and implementations can use extra buffers internally; treat that as implementation behaviour.

#### The bridge to the next approach

> "The loop is linear; the sort is the bottleneck. But the weights aren't arbitrary: they're integers between 1 and `limit`, and `limit` is at most 3 · 10^4. That's exactly the setting for counting sort, which is O(n + limit) and avoids comparisons entirely. The pairing logic stays the same."

### Approach 2: Counting sort, then the same two pointers

#### What I say out loud

> "Count how many people have each weight from 1 to `limit`, write the weights back into `people` in increasing order, and run the same two-pointer loop. Sorting becomes O(n + limit) instead of O(n log n)."

#### Intuition

The greedy rule only needs the weights in sorted order. When the keys are small integers, a count per key gives that order in linear time ([[a3-counting-sort|Counting Sort]]).

#### Algorithm

1. `count[w]` = number of people of weight w, for w from 1 to `limit`.
2. Overwrite `people` with each weight w repeated `count[w]` times, for w = 1 … `limit`.
3. Run the loop of Approach 1 on the now-sorted `people`.

#### Why it is correct

Step 2 writes exactly n values (the counts sum to n), in non-decreasing order, and each weight as many times as it occurred, so `people` becomes the sorted multiset of the original weights. Step 3 is Approach 1's loop, whose correctness argument only needed sorted input.

#### Dry run

`people = [4, 1, 3, 2]`, `limit = 5`

| Step | State |
|---|---|
| Count | `count[1..5] = [1, 1, 1, 1, 0]` |
| Write back | `people = [1, 2, 3, 4]` |
| Two pointers | as in Approach 1: `{1, 4}`, `{2, 3}`, answer 2 |

#### Java code

```java title="Approach 2: counting sort, then two pointers"
class Solution {
    public int numRescueBoats(int[] people, int limit) {
        int[] count = new int[limit + 1];    // weights are 1..limit
        for (int w : people) {
            count[w]++;
        }
        int idx = 0;
        for (int w = 1; w <= limit; w++) {
            for (int c = 0; c < count[w]; c++) {
                people[idx++] = w;           // people is now sorted ascending
            }
        }
        int i = 0;
        int j = people.length - 1;
        int boats = 0;
        while (i <= j) {
            if (people[i] + people[j] <= limit) {
                i++;
            }
            j--;
            boats++;
        }
        return boats;
    }
}
```

#### Time complexity

**O(n + limit) in the worst case.** Counting is O(n); the write-back visits every weight from 1 to `limit` and writes n values; the loop is O(n). With the given bounds that is at most about 5 · 10^4 + 3 · 10^4 steps.

#### Space complexity

**O(limit) auxiliary** for the counts, up to 3 · 10^4 + 1 integers.

### Alternative: best fit instead of lightest

For the heaviest person h, pick the **heaviest** waiting person who still fits (with a `TreeMap` from weight to count, using `floorKey(limit − h)`). That is also optimal, by the same swap argument: if h shares with z in an optimal plan and x is the heaviest who fits, then z ≤ x, so swapping z and x keeps every boat within the limit. It costs O(n log n) with a heavier data structure and gains nothing over the two pointers for this problem, since the count of boats is the same. It is the natural rule when boats can carry more than two people, but then the greedy is no longer optimal (see section 10). The test file uses it as an independent check.

## 5. Comparison table

n = `people.length`, W = `limit`. Nothing here hashes or uses randomness, so expected and worst case coincide.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Exhaustive search over pairings | Exponential in n | Exponential in n | O(n) |
| 1. Sort + two pointers | O(n log n) | O(n log n) | O(1) besides the sort |
| 2. Counting sort + two pointers | O(n + W) | O(n + W) | O(W) |
| Alt. Best fit with a `TreeMap` | O(n log n) | O(n log n) | O(n) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Exhaustive search | Correct by construction, since it tries every pairing | Unusable beyond about 10 people | Only as a test oracle |
| 1. Sort + two pointers | Short, standard, works for any weight range | The O(n log n) sort | The answer to give |
| 2. Counting sort + two pointers | Linear when W is small | Needs integer weights with a known small bound; O(W) memory | When the interviewer asks to beat n log n, or W ≪ n log n |
| Alt. Best fit | Same optimal count | Heavier structure, no advantage here | Rarely; mention only if asked whether "heaviest that fits" also works |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** sort plus two pointers (Approach 1). It is about ten lines, the greedy argument is clean, and it does not depend on the weight bound.

**Is it optimal?** In the worst case a correct algorithm must read every weight: for all-1 weights with `limit` = 2 and n = 4, the answer is 2, but changing any single weight to 2 makes it 3. So Ω(n) is a worst-case lower bound. Approach 2 meets it up to the O(W) term, using the stated weight bound. I would not claim an Ω(n log n) lower bound for Approach 1's setting; I have no reduction that proves one.

**When the counting version is better:** if the interviewer asks for linear time, or weights are small integers and n is large. With these bounds both run in well under a second.

**When to stop:** once the two-pointer version is coded, traced on a case with someone left alone at `i == j`, and the swap argument has been said. Mention counting sort in one sentence.

## 7. Interview script: code it and test it

### What I say while coding

> "`int numRescueBoats(int[] people, int limit)`. Sort first; I confirmed I can modify the input."

> "`i` at the lightest, `j` at the heaviest. `while (i <= j)`, with `<=` because when they meet there's still one person who needs a boat."

> "Inside: if the lightest fits with the heaviest, `i++`. Then unconditionally `j--` and `boats++`: the heaviest leaves in every iteration, with or without a partner."

### Testing out loud

**Normal case:** `[1, 2, 2, 3]`, limit 3 gives 3: the 3 alone, then `{1, 2}`, then the last 2 alone at `i == j` (section 4 has the table).

**Perfect pairs:** `[4, 1, 3, 2]`, limit 5 gives 2, each pair exactly at the limit, which `<=` accepts.

**n = 1:** `[5]`, limit 5: `i = j = 0`, 5 + 5 > 5, `j = −1`, `boats = 1`. With `[2]`, limit 5: 2 + 2 ≤ 5, so `i = 1` and `j = −1`, still `boats = 1`. One boat either way.

**Nobody can pair:** `[3, 3, 3]`, limit 3: every check fails, `j` walks down, 3 boats.

**Everyone pairs:** `[1, 1, 1, 1, 1]`, limit 30000: `{1, 1}`, `{1, 1}`, then the middle 1 alone: 3 boats = ⌈5 / 2⌉.

**`limit` = 1:** `[1, 1]`: 1 + 1 > 1, two boats.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 2 min | Two per boat, `<=` limit, everyone fits alone, may sort |
| Small cases by hand | 2–3 min | Find that pairing the two lightest fails on `[1, 2, 3, 4]`, limit 5 |
| State the rule | 1 min | Heaviest always boards; lightest joins if it fits |
| Argue correctness | 2–3 min | The two cases and the swap |
| Write the code | 3 min | Sort, two pointers, one boat per iteration |
| Trace | 2 min | `[1, 2, 2, 3]` with the `i == j` step, and n = 1 |
| Mention counting sort | 1 min | O(n + limit) because weights are bounded |

### Where the time should go

- **Most attention:** the correctness argument. The code is almost trivial; the interviewer is checking whether you know why the greedy rule is safe.
- **Do not skimp on:** the `i == j` case, and `<=` against `limit`.
- **Least attention:** counting sort's code. Saying it is usually enough.

### If the rule does not come

1. Solve tiny cases by hand and look at who ends up alone. It is always the heavy people.
2. Ask: who is the hardest person to place? Then: who is the best partner for them?
3. Try a rule and look for a counterexample of size four. The two-lightest rule breaks on `[1, 2, 3, 4]`, limit 5.

## 9. Interviewer challenges

### About the greedy argument

#### Why should the heaviest person share with the lightest, and not with someone heavier who also fits?

**What they are testing:** whether you can justify the greedy choice with an exchange argument.

**How to reason:** take an optimal plan where the heaviest h shares with z and the lightest l with y, and swap z and l.

**What I say:** "If the lightest fits with the heaviest, I take any optimal plan and swap the heaviest person's partner with the lightest person. The new boat `{h, l}` fits by assumption. The other new boat `{z, y}` fits because y is no heavier than h and z already fitted next to h. So the swap never adds a boat, and some optimal plan pairs h with l. Pairing with someone heavier who fits is also optimal, by a similar swap, but it doesn't improve the count, and the lightest is the one I can find in O(1)."

**Nuance:** the argument needs both extremes. If h were not the heaviest, `{z, y}` might not fit.

#### If the lightest person doesn't fit with the heaviest, why must the heaviest go alone?

**What they are testing:** whether you see that the failure is a proof, not a guess.

**How to reason:** everyone else weighs at least as much as the lightest.

**What I say:** "Every remaining person weighs at least as much as the lightest, so if the lightest plus the heaviest exceeds the limit, so does anyone plus the heaviest. The heaviest person can't share with anyone, in any plan. So it costs nothing to send them alone now. That's also why I move `j` in that case, not `i`: the lightest might still pair with someone lighter than the heaviest."

**Nuance:** moving `i` instead (sending the lightest alone when the check fails) is wrong. On `[1, 2, 2, 3]`, limit 3, it gives 4 boats instead of 3.

### About the design

#### Why not pair the two lightest people, to fit as many pairs as possible?

**What they are testing:** whether you tested your intuition against a counterexample.

**How to reason:** light people are valuable as partners for heavy ones.

**What I say:** "That uses up the flexible people on each other. On `[1, 2, 3, 4]`, limit 5, it pairs 1 and 2, then 3 and 4 don't fit, so three boats; heaviest-with-lightest gives `{1, 4}`, `{2, 3}`: two."

**Nuance:** a correct greedy rule needs an argument; a rule that only feels right is how this mistake happens.

#### Can you beat O(n log n)?

**What they are testing:** whether you use the constraints.

**How to reason:** the weights are integers in `[1, limit]` with `limit` ≤ 3 · 10^4.

**What I say:** "Yes, with counting sort: count each weight, write them back in order, then the same two pointers. O(n + limit) time, O(limit) space. The two-pointer part is already linear."

**Nuance:** this relies on the stated bound on weights. For arbitrary real weights, sorting by comparison is the practical choice.

## 10. Follow-up questions the interviewer might ask

**"Return the actual boats, not just the count."**
Record `{people[i], people[j]}` or `{people[j]}` in each iteration of the same loop. O(n log n) time; O(n) for the output.

**"What if a boat can carry up to three people (or any number), still with a weight limit?"**
Then it is bin packing, which is NP-hard in general. Heaviest-first, best-fit-style greedy rules give good approximations but not always the minimum. Exact answers need search or dynamic programming over subsets, feasible only for small n.

**"What if the input must not be modified?"**
Sort a copy (`people.clone()`) for O(n) extra space, or use counting sort into the `count` array and run the two pointers over weight buckets instead of over the array. O(n log n) or O(n + limit) time.

**"What if there are only b boats; can everyone be rescued?"**
Compute the minimum with this algorithm and compare it with b. O(n log n).

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Pairing the two lightest people.** On `[1, 2, 3, 4]`, limit 5 it gives 3 boats instead of 2.
- **Treating it as general bin packing.** Two people per boat is what makes a simple greedy rule optimal; with more people per boat it isn't.
- **Asserting the greedy rule without an argument.** The interviewer will ask; prepare the swap argument.

### Implementation mistakes

> [!MISTAKE] Looping while `i < j`
> The last person, left alone when `i == j`, never gets a boat. `[1, 2, 2, 3]`, limit 3 returns 2 instead of 3.

> [!MISTAKE] Sending the lightest alone when the pair does not fit
> Writing `else i++` instead of always moving `j` keeps a heavy person who can never pair, and wastes the light one. `[1, 2, 2, 3]`, limit 3 returns 4 instead of 3.

- **Using `<` instead of `<=`.** A pair weighing exactly `limit` is allowed; `[4, 1, 3, 2]`, limit 5 would return 3 (`{4}`, `{1, 3}`, `{2}`) instead of 2.
- **Forgetting to sort.** The two ends are then not the lightest and heaviest, and the argument no longer applies.

## 12. Pattern recognition

**The pattern:** sort, then greedy pairing from both ends with two pointers. The decision about the most constrained element (the heaviest) is made first, justified by an exchange argument.

**Signals in the problem statement:**

- Pair elements up, at most two per group, under a sum limit.
- Minimise the number of groups, or maximise the number of valid pairs.
- Order of the input does not matter, so sorting is free.

**Related problems in this list:**

- [[nc-two-sum-ii-input-array-is-sorted|Two Sum II]]: the same two pointers from both ends of a sorted array, moving the side that cannot be part of an answer.
- [[nc-3sum|3Sum]]: sort, then a two-pointer scan with the same "which end can I safely discard" reasoning.
- [[nc-container-with-most-water|Container With Most Water]]: a two-pointer scan whose correctness is an argument about which end can be discarded.
- [[nc-hand-of-straights|Hand of Straights]]: a greedy decision about the most constrained element (the smallest card) after sorting.

**Takeaway:** when you pair elements under a sum limit, decide about the hardest element first and give it the most flexible partner; prove it by swapping partners in an optimal solution.

## 13. 60-second revision card

**Key insight:** the heaviest person boards every boat; the lightest joins if they fit. If the lightest doesn't fit, nobody does.

**Invariant:** everyone outside `[i, j]` is already in a boat; `people[i]` is the lightest and `people[j]` the heaviest still waiting; `boats` counts the boats sent.

**Complexity:** O(n log n) time for the sort, O(n) for the loop; O(1) auxiliary besides the sort. Counting sort: O(n + limit) time, O(limit) space. Ω(n) worst-case lower bound.

**Code skeleton:**

```java title="Heaviest with lightest"
import java.util.Arrays;

class Solution {
    public int numRescueBoats(int[] people, int limit) {
        Arrays.sort(people);
        int i = 0, j = people.length - 1, boats = 0;
        while (i <= j) {
            if (people[i] + people[j] <= limit) i++;
            j--;
            boats++;
        }
        return boats;
    }
}
```

**Main traps:**

- `i <= j`, so the last single person gets a boat.
- `<=` against `limit`.
- Always move `j`; move `i` only when the pair fits.
- Pairing the two lightest is wrong.

**What to say in one breath:** "Sort. The heaviest remaining person always takes the next boat. If the lightest fits with them, the lightest goes too, because swapping partners in any optimal plan shows that pairing costs nothing; if the lightest doesn't fit, nobody does. Two pointers, O(n log n) for the sort, or O(n + limit) with counting sort."
