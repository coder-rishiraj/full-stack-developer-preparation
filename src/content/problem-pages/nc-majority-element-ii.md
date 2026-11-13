---
problemId: nc-majority-element-ii
title: Majority Element II
source: neetcode
sourceUrl: https://leetcode.com/problems/majority-element-ii/
difficulty: medium
patterns: [arrays-hashing, hashing]
relatedLessons: [a2-frequency-counting, a2-hashing, a2-sorting-based, a14-deriving-optimization, a14-edge-cases]
companies: []
timeToSolve: 25
---

## 1. Problem restatement

You get an integer array `nums` of length n. Return every value that occurs **more than ⌊n/3⌋ times**, in any order. There may be no such value, one, or two.

**Example 1**

- Input: `nums = [4, 1, 4, 2, 1, 4, 1]`
- Output: `[4, 1]` (or `[1, 4]`)
- Why: n = 7, so a value needs more than ⌊7/3⌋ = 2 occurrences. 4 and 1 occur 3 times each; 2 occurs once.

**Example 2**

- Input: `nums = [5, 6, 7, 5]`
- Output: `[5]`
- Why: n = 4 and ⌊4/3⌋ = 1, so a value needs at least 2 occurrences. Only 5 has them. For `[5, 6, 7]` the answer would be empty: each value occurs once, which is not more than ⌊3/3⌋ = 1.

**What the problem statement guarantees**

- 1 ≤ n ≤ 5 × 10^4.
- −10^9 ≤ `nums[i]` ≤ 10^9.
- The answer may be returned in any order.
- The statement's follow-up asks for linear time and O(1) extra space.

Unlike the "more than half" version of this problem, nothing guarantees that any value qualifies.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. A counting solution takes two minutes; the O(1)-space one has two traps that only show up when you trace it carefully. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 25 minutes and talk out loud.
2. Before designing anything, work out the largest number of values that could possibly be in the answer, and why.
3. Give any correct solution with its cost, then look for one with O(1) extra space.
4. Trace your code on `[6, 4, 4, 2, 4, 2, 3, 2]` (answer: 2 and 4) and on `[5, 7, 5]` (answer: only 5).
5. Say which part of your O(1)-space solution can return a wrong value, and how you guard against it.

> [!HINT] Hint 1: a small nudge
> If three different values each occurred more than n/3 times, how many elements would the array need? What does that bound mean for how much you need to keep track of?

> [!HINT] Hint 2: the kind of tool you need
> Removing three elements with three **different** values removes at most one copy of any particular value. Does a value that was above n/3 stay above a third of what is left? That suggests keeping a few candidates with counters, as in the voting method for the "more than half" problem.

> [!HINT] Hint 3: almost the whole plan
> Keep two candidates and two counts. For each element: if it equals a candidate, increment that count; otherwise, if a count is zero, make the element that candidate; otherwise decrement both counts. Then make a second pass that counts the two candidates exactly and keeps those above ⌊n/3⌋. Check the order of the tests: what goes wrong if you test "count 1 is zero" before "equals candidate 2"?

**Check yourself before revealing the walkthrough**

- [ ] I can prove there are at most two answers
- [ ] My code returns 2 and 4 for `[6, 4, 4, 2, 4, 2, 3, 2]` and only 5 for `[5, 7, 5]`
- [ ] My O(1)-space solution has a verification pass, and I can give an input where skipping it is wrong
- [ ] I can say why the order of the branches matters

## 3. Interview script: understand the problem (≈2 min)

**Me:** I return all values that occur more than ⌊n/3⌋ times. Strictly more? So with n = 6, a value needs 3 occurrences, not 2?

**Interviewer:** Strictly more than ⌊n/3⌋, yes.

**Me:** And, unlike the majority problem, there might be none at all?

**Interviewer:** Correct. There may be zero, one or two.

**Me:** Two at most, I think: three values each above n/3 would need more than n elements. Can I return them in any order?

**Interviewer:** Any order.

**Me:** Sizes and values?

**Interviewer:** Up to 5 × 10^4 elements, at least one, values between −10^9 and 10^9.

**Me:** So a counting array indexed by value is out. Counts are at most 5 × 10^4, so no overflow. May I modify the input, for instance sort it in place?

**Interviewer:** I'd rather you didn't.

**Me:** Then any sorting is on a copy. Example: `[4, 1, 4, 2, 1, 4, 1]`, n = 7, threshold is more than 2. 4 appears 3 times, 1 appears 3 times, 2 once. So `[4, 1]`.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| Strictly more than ⌊n/3⌋ occurrences | At most two values qualify, so a constant number of candidates is enough. The threshold must be `> n / 3` in integer arithmetic. |
| No value is guaranteed to qualify | Any method that only produces candidates must confirm them with exact counts. |
| Any order | No sorting of the result. |
| 1 ≤ n ≤ 5 × 10^4 | Never empty. O(n²) is about 2.5 × 10^9 comparisons, too slow; O(n log n) and O(n) are fine. |
| −10^9 ≤ `nums[i]` ≤ 10^9 | Negatives occur, and the range is too wide for a counting array. |
| Follow-up: linear time, O(1) space | Rules out the hash map (O(n) space) and sorting (O(n log n) time) as the final answer. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| The input should not be modified | Sorting has to use a copy, which costs O(n) memory. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The array can be read twice | The O(1)-space method needs a second, verifying pass. On a one-pass stream it could only report candidates. |
| Each qualifying value appears once in the result | The answer is a set of values; a duplicate would be wrong output. |

### Edge cases I will keep in mind

- n = 1: the single value qualifies (1 > ⌊1/3⌋ = 0).
- n = 2: every distinct value qualifies, since ⌊2/3⌋ = 0; `[1, 2]` returns both.
- n = 3 with distinct values: none qualifies.
- Zero, one and two answers.
- A value that ends the first pass as a candidate without qualifying, such as 7 in `[5, 7, 5]`.
- The range limits ±10^9, and values that happen to equal my initial candidate placeholders.

## 4. Think out loud: from first idea to best solution

**At most two answers.** Suppose three different values each occur more than ⌊n/3⌋ times. Each then occurs at least ⌊n/3⌋ + 1 times, which is more than n/3, so together they fill more than n positions. That is impossible, so the answer has at most two values. This fact drives the O(1)-space solution.

The literal solution counts each element's occurrences with an inner loop: O(n²) time, about 2.5 × 10^9 comparisons at n = 5 × 10^4. I state it as the baseline and do not code it.

### Approach 1: Sort a copy, measure the runs

#### What I say out loud

> "After sorting, equal values sit in one run. I walk the runs, measure each run's length, and keep the values whose run is longer than n/3. The input shouldn't change, so I sort a copy: O(n log n) time and O(n) memory."

#### Intuition

Sorting turns "how many times does x occur anywhere" into "how long is x's block", which a single scan measures (see [[a2-sorting-based|sorting-based techniques]]).

#### Algorithm

1. Copy and sort `nums`.
2. Scan with index `i`; let `j` advance while `sorted[j] == sorted[i]`. The run length is `j - i`.
3. If the run length is greater than n / 3, add `sorted[i]`. Set `i = j` and continue.

#### Why it is correct

Every occurrence of a value lands in the same run after sorting, so a run's length is exactly that value's count. Each run is visited once, so each qualifying value is added exactly once, and only values whose count exceeds ⌊n/3⌋ are added.

#### Dry run

`nums = [4, 1, 4, 2, 1, 4, 1]`, n = 7, threshold: run longer than 2. Sorted copy: `[1, 1, 1, 2, 4, 4, 4]`.

| Run | Value | Length | Added? |
|---|---|---|---|
| indices 0–2 | 1 | 3 | yes |
| index 3 | 2 | 1 | no |
| indices 4–6 | 4 | 3 | yes |

Returns `[1, 4]`.

#### Java code

```java title="Approach 1: sort a copy, measure the runs"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Solution {
    public List<Integer> majorityElement(int[] nums) {
        int n = nums.length;
        int[] sorted = nums.clone();          // the input stays untouched
        Arrays.sort(sorted);
        List<Integer> result = new ArrayList<>();
        int i = 0;
        while (i < n) {
            int j = i;
            while (j < n && sorted[j] == sorted[i]) {
                j++;
            }
            if (j - i > n / 3) {              // run length is the exact count
                result.add(sorted[i]);
            }
            i = j;
        }
        return result;
    }
}
```

#### Time complexity

**O(n log n)**, where n is `nums.length`. Cloning and the run scan are O(n) (`i` and `j` only move forward); sorting dominates. The JDK documentation for recent versions states O(n log n) for sorting an `int[]`; the exact worst-case behaviour is a property of the JDK version.

#### Space complexity

**O(n) auxiliary space** for the copy, plus the sort's stack (O(log n) in typical implementations). The result holds at most two values.

#### The bridge to the next approach

> "I don't need the order, only the counts. A hash map gets the counts in one pass and removes the log factor."

### Approach 2: Count with a hash map

#### What I say out loud

> "Count every value in a HashMap, then keep the keys whose count is more than n/3. Linear expected time, but one map entry per distinct value."

#### Intuition

This is plain [[a2-frequency-counting|frequency counting]]: the question is about counts, and a map from value to count answers it directly.

#### Algorithm

1. For each `x`, increment `count[x]`.
2. For each entry with count greater than n / 3, add its key to the result.

#### Why it is correct

After the first loop, `count[x]` is exactly the number of occurrences of `x`. The second loop visits each distinct value once, so it adds exactly the qualifying values, each once.

#### Dry run

`nums = [4, 1, 4, 2, 1, 4, 1]`, threshold: more than 2. After counting, the map holds `{4: 3, 1: 3, 2: 1}`. The keys 4 and 1 pass; 2 does not. Returns 4 and 1 in the map's iteration order, which is fine because any order is accepted.

#### Java code

```java title="Approach 2: hash map counting"
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class Solution {
    public List<Integer> majorityElement(int[] nums) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : nums) {
            count.merge(x, 1, Integer::sum);
        }
        List<Integer> result = new ArrayList<>();
        int threshold = nums.length / 3;
        for (Map.Entry<Integer, Integer> e : count.entrySet()) {
            if (e.getValue() > threshold) {
                result.add(e.getKey());
            }
        }
        return result;
    }
}
```

#### Time complexity

**O(n) expected time.** n `merge` calls and one pass over at most n entries. Each map operation is constant on average if hash codes spread well, with resizing amortized over the inserts. In the worst case, colliding keys make a hash table with list buckets O(n) per operation; current Java implementations turn heavily collided buckets into balanced trees, which for `Integer` keys limits that to about O(log n) per operation. That is implementation behaviour, not an API guarantee.

#### Space complexity

**O(d) auxiliary space** for d distinct values, which is O(n) in the worst case (all values distinct), with boxed keys and values.

#### The bridge to the next approach

> "The follow-up wants O(1) space. I know at most two values can qualify, so tracking every count is wasteful. In the majority problem I threw away pairs of different values; the majority couldn't be wiped out because it had more than half. Here the threshold is a third, so what if I throw away triples of three different values? Each triple removes at most one copy of any value. A value with more than n/3 copies can't lose all of them that way, because there are fewer than n/3 triples."

> "To find triples I need to keep up to two 'leftover' values with counts. When a third different value arrives and both leftovers are present, those three form a triple and all three go. Then at the end the two survivors are only candidates, because nothing guarantees an answer exists; I'll count them exactly in a second pass."

### Approach 3: Two-candidate Boyer–Moore voting plus verification (recommended)

#### What I say out loud

> "Two candidate slots, each with a count. For each element: if it equals candidate 1, bump count 1; else if it equals candidate 2, bump count 2; else if slot 1 is empty, put it there; else if slot 2 is empty, put it there; else it's a third distinct value, so decrement both counts: that's one triple thrown away."

> "The order matters: I compare with both candidates before I fill an empty slot. Otherwise a value that's already candidate 2 could be put into slot 1 as well. Then a second pass counts both candidates exactly and keeps those above n/3."

#### Intuition

This extends the voting method from [[nc-majority-element|Majority Element]] from pairs to triples. Throwing away three pairwise different values removes at most one copy of each value, while the array shrinks by three. A value above a third of the array stays above a third of what remains, so it is never thrown away completely. Whatever survives is held in at most two slots.

#### Algorithm

1. `cand1 = 0`, `cand2 = 1` (any two different values), `count1 = count2 = 0`. A slot with count 0 is empty.
2. For each `x`, take the first branch that applies:
   - `x == cand1`: `count1++`.
   - `x == cand2`: `count2++`.
   - `count1 == 0`: `cand1 = x`, `count1 = 1`.
   - `count2 == 0`: `cand2 = x`, `count2 = 1`.
   - otherwise: `count1--`, `count2--`.
3. Count the exact occurrences of `cand1` and `cand2` in a second pass. Return those with more than n / 3.

#### Why it is correct

**Invariant 1: the two candidates always differ.** They start as 0 and 1. `cand1` is replaced only in the third branch, reached only when `x != cand2`, so the new `cand1` differs from `cand2`. `cand2` is replaced only in the fourth branch, reached only when `x != cand1`. So `cand1 != cand2` at every step.

**Invariant 2: the processed prefix splits into `count1` copies of `cand1`, `count2` copies of `cand2`, and triples of three pairwise different values.** It holds for the empty prefix. The first four branches add `x` to a slot whose value equals `x`. (In the first two branches the slot may be empty with a stale value equal to `x`: going from count 0 to 1 is the same as filling it.) The fifth branch runs only when `x` differs from both candidates and both counts are positive, so `x`, one copy of `cand1` and one copy of `cand2` are three pairwise different values (using invariant 1), and they become a triple.

**Why no answer is lost.** At the end, n = 3T + `count1` + `count2`, where T is the number of triples. Let m occur c times with c > ⌊n/3⌋, hence c ≥ ⌊n/3⌋ + 1 > n/3. Each triple holds at most one copy of m, so at most T copies are in triples, and at least c − T > n/3 − T = (`count1` + `count2`)/3 ≥ 0 copies are left over. A leftover copy sits in a slot with a positive count, so m is `cand1` or `cand2`.

**Why verification is required.** The first pass only guarantees that every answer is among the candidates, not that every candidate is an answer. On `[5, 7, 5]` the slots end as 5 (count 2) and 7 (count 1). 7 occurs once, not more than ⌊3/3⌋ = 1. Returning the candidates with positive counts would give `[5, 7]`; the exact counts in the second pass give `[5]`.

**No duplicates in the result.** Invariant 1 means the two candidates are different values, so a qualifying value is added once.

**The 30-second version to say to the interviewer:**

> "Each time an element differs from both candidates and both slots are full, I discard a triple of three different values. A triple contains at most one copy of any value, and there are fewer than n/3 triples, so a value with more than n/3 copies always has a copy left in a slot. So every answer is a candidate. Candidates can be false positives because nothing guarantees an answer, so I count both exactly in a second pass. I compare with both candidates before filling an empty slot, which keeps the two candidates different; otherwise a 'triple' could contain the same value twice."

#### Dry run

`nums = [6, 4, 4, 2, 4, 2, 3, 2]`, n = 8, threshold: more than 2. A dash marks an empty slot (count 0, value not shown).

| x | Branch taken | Slot 1 after | Slot 2 after |
|---|---|---|---|
| 6 | slot 1 empty | 6 ×1 | — |
| 4 | slot 2 empty | 6 ×1 | 4 ×1 |
| 4 | equals `cand2` | 6 ×1 | 4 ×2 |
| 2 | third value: discard triple (2, 6, 4) | — (6 ×0) | 4 ×1 |
| 4 | equals `cand2` | — (6 ×0) | 4 ×2 |
| 2 | slot 1 empty | 2 ×1 | 4 ×2 |
| 3 | third value: discard triple (3, 2, 4) | — (2 ×0) | 4 ×1 |
| 2 | equals `cand1` (stale value, refills the slot) | 2 ×1 | 4 ×1 |

Candidates 2 and 4. Second pass: 2 occurs 3 times, 4 occurs 3 times, both more than 2. Returns `[2, 4]`.

#### Java code

```java title="Approach 3: two-candidate voting + verification (recommended)"
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> majorityElement(int[] nums) {
        int cand1 = 0, cand2 = 1;    // any two different values; count 0 means the slot is empty
        int count1 = 0, count2 = 0;
        for (int x : nums) {
            if (x == cand1) {
                count1++;
            } else if (x == cand2) {
                count2++;
            } else if (count1 == 0) {  // only after both comparisons: keeps cand1 != cand2
                cand1 = x;
                count1 = 1;
            } else if (count2 == 0) {
                cand2 = x;
                count2 = 1;
            } else {
                count1--;              // x, cand1, cand2 are three different values:
                count2--;              // discard one copy of each
            }
        }

        // Candidates are only possible answers: count them exactly.
        count1 = 0;
        count2 = 0;
        for (int x : nums) {
            if (x == cand1) {
                count1++;
            } else if (x == cand2) {
                count2++;
            }
        }
        List<Integer> result = new ArrayList<>();
        if (count1 > nums.length / 3) {
            result.add(cand1);
        }
        if (count2 > nums.length / 3) {
            result.add(cand2);
        }
        return result;
    }
}
```

#### Time complexity

**O(n) in every case.** Two passes with constant work per element, no hashing, so this is a worst-case bound.

#### Space complexity

**O(1) auxiliary space**: four integers, plus a result list of at most two values (the output is not counted).

## 5. Comparison table

n = `nums.length`; d = number of distinct values.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Baseline: count each element with an inner loop | O(n²) | O(n²) | O(1) |
| 1. Sort a copy, measure runs | O(n log n) | O(n log n) per recent JDK documentation | O(n) for the copy |
| 2. Hash map counting | O(n) | O(n²) in general; about O(n log n) with current Java tree buckets and `Integer` keys (not an API guarantee) | O(d), up to O(n) |
| 3. Two-candidate voting + verification | O(n) | O(n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Sort, measure runs | Simple, no hashing | Log factor; a copy | A quick first answer |
| 2. Hash map | Linear expected; generalizes to any threshold | O(n) memory; expected, not guaranteed | When memory is not a concern, or the threshold changes often |
| 3. Two-candidate voting | Linear worst case, O(1) space | Two traps (branch order, verification); harder to explain | The answer to the follow-up, and the default here |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** state the at-most-two bound, mention the hash map in a sentence with its cost, then derive the two-candidate voting method from "discard triples of different values" and code it with the verification pass.

**Is it optimal?** Yes. In the worst case a correct algorithm must inspect essentially every element: in an array of distinct values one unread position could hold a copy that pushes a value over the threshold. That gives an Ω(n) worst-case lower bound, which the voting method meets with O(1) space.

**When something else is better in practice:** the hash map is easier to get right and generalizes to "more than n/k" for any k without new reasoning. If memory is not tight, it is a perfectly good engineering choice; in the interview, the follow-up asks for O(1).

**When to stop:** after the voting method, its proof, and a trace that shows the verification pass mattering. Do not code the sorting version.

## 7. Interview script: code it and test it

### What I say while coding

> "Two slots. I'm initializing the candidates to 0 and 1, just two different placeholder values: a slot with count 0 is empty regardless of its value, and if a real 0 or 1 matches a placeholder, raising its count from 0 to 1 is the same as filling the slot."

> "Branch order: match candidate 1, match candidate 2, fill an empty slot, cancel. Matching both first keeps the two candidates different."

> "Second pass: reset both counts and count exactly. Strictly greater than `n / 3`."

### Testing out loud

**Two answers:** `[6, 4, 4, 2, 4, 2, 3, 2]`. As in the dry run, candidates 2 and 4, each counted 3 > 2. Returns both.

**False candidate:** `[5, 7, 5]`. Slots end 5 ×2 and 7 ×1. Verification: 5 occurs 2 > 1, 7 occurs 1, not > 1. Returns `[5]`.

**No answer:** `[5, 6, 7]`. 5 fills slot 1, 6 fills slot 2, 7 cancels a triple. Candidates 5 and 6, each counted once, not > 1. Returns `[]`.

**n = 1:** `[9]`. Slot 1 gets 9; verification: 1 > 0. Returns `[9]`.

**n = 2:** `[1, 2]`. 1 equals the placeholder `cand2`, so slot 2 becomes 1 ×1; 2 fills slot 1. Verification: both occur once, more than 0. Returns both, which is right because ⌊2/3⌋ = 0.

**Placeholders in the data:** `[0, 0, 1]`. 0 matches `cand1` twice, 1 matches `cand2`. Counts 2 and 1; threshold more than 1. Returns `[0]`.

**Extremes:** `[-1000000000, 1000000000, -1000000000]`. Returns `[-1000000000]`. Only comparisons are done on values, so their size does not matter.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2 min | Strictly more than ⌊n/3⌋, no guarantee, any order, modify input? |
| At-most-two bound | 1 min | Three values above n/3 would exceed n |
| Hash map | 1–2 min | Say it with its O(n) space |
| Derive the voting method | 5 min | "Discard triples of different values"; why answers survive |
| Code | 4 min | Branch order; second pass |
| Trace | 4 min | Two answers, a false candidate, no answer |

The derivation and the two traps deserve the time. If the triple-cancellation idea does not come, code the hash map, state its cost honestly, and ask whether to keep pushing for O(1) space.

## 9. Interviewer challenges

### About correctness

#### Why must you verify the candidates?

**What they are testing:** whether you know what the first pass guarantees and what it does not.

**How to reason:** the first pass guarantees that every answer is a candidate, not the converse. Find an input with a candidate that is not an answer.

**What I say:** "The first pass shows that anything above n/3 survives as a candidate. But it always ends with up to two candidates, answer or not. In `[5, 7, 5]`, 7 sits in a slot with count 1 and occurs once, which isn't more than one. So I count both exactly in a second pass."

**Nuance:** in the "more than half" version, verification is optional only because the problem guarantees a majority exists. Here nothing is guaranteed.

#### Why does the branch order matter?

**What they are testing:** whether you understand the invariant or memorized the code.

**How to reason:** see what happens if `count1 == 0` is tested before `x == cand2`.

**What I say:** "If slot 1 is empty and x already equals candidate 2, the wrong order puts x into slot 1 too, so both slots hold the same value. The next unmatched element then cancels a 'triple' that contains two copies of that value, which the proof doesn't allow. On `[6, 4, 4, 2, 4, 2, 3, 2]` the wrong order returns only `[2]`: after the fifth element both slots hold 4, the sixth element wipes out both, and 4 is lost, though it occurs 3 times out of 8."

**Nuance:** the correct order keeps `cand1 != cand2` always. That is the only thing the cancellation step needs, and it is cheap to state while coding.

#### Why can there be at most two answers?

**What they are testing:** the fact that justifies two slots.

**How to reason:** add the minimum occurrences of three qualifying values.

**What I say:** "Each qualifying value occurs at least ⌊n/3⌋ + 1 times, which is more than n/3. Three of them would need more than n positions. So at most two."

**Nuance:** the same argument gives at most k − 1 values above n/k, which is why the general method keeps k − 1 slots.

### About complexity

#### Is two passes really O(1) space and linear time?

**What they are testing:** whether you can separate passes from asymptotic cost.

**How to reason:** count work per element per pass.

**What I say:** "Each pass does constant work per element, so 2n steps, O(n) in the worst case. Space is four integers and a result of size at most two. Reading the array twice is the price: on a one-pass stream I'd only be able to return candidates."

**Nuance:** Ω(n) is a worst-case lower bound here too, so linear time is optimal.

## 10. Follow-up questions the interviewer might ask

**"Elements appearing more than ⌊n/k⌋ times."**
At most k − 1 values qualify. Keep k − 1 slots (the Misra–Gries summary): match a slot, fill an empty one, or decrement all. Then verify. With slots scanned linearly that is O(nk) time and O(k) space. With a hash map from candidate to count (removing entries that reach zero), matching and filling are O(1) expected; a decrement-all step costs O(k), but every decrement undoes an earlier increment and there are at most n increments, so the whole pass is O(n) expected.

**"The data is a stream you can read once."**
The first pass still yields at most two candidates that include every answer, so you can report a superset. Confirming them needs either a second pass or more memory.

**"Exactly one value occurs more than ⌊n/2⌋ times."**
One slot and no verification needed, because the value is guaranteed: [[nc-majority-element|Majority Element]].

**"The k most frequent values."**
No threshold, so cancellation does not apply; count with a hash map and select: [[nc-top-k-frequent-elements|Top K Frequent Elements]]. O(n) expected with bucket sort by frequency.

**"The array is split across machines."**
Run the first pass on each part and merge the (candidate, count) summaries by the same rules: add counts of equal candidates, then cancel triples among the leftovers. Then a distributed counting pass verifies. O(n / p) time per machine for p machines.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Assuming an answer exists,** as in the "more than half" version, and skipping verification.
- **Using "more than or equal to n/3".** The threshold is strictly more than ⌊n/3⌋; with n = 6, two copies are not enough.
- **Thinking the final counts are frequencies.** In the dry run 2 ends with count 1 while it occurs 3 times.
- **Not stating the at-most-two bound,** which is the reason two slots are enough.

### Implementation mistakes

> [!MISTAKE] Testing `count1 == 0` before `x == cand2`
> Both slots can end up holding the same value, and one cancellation then removes two copies of it. On `[6, 4, 4, 2, 4, 2, 3, 2]` this returns `[2]` instead of `[2, 4]`. Compare with both candidates first, then fill an empty slot.

> [!MISTAKE] Returning the candidates without the second pass
> Returning every candidate with a positive count gives `[5, 7]` for `[5, 7, 5]`, where 7 occurs only once.

- **Initializing both candidates to the same value** (for example both 0) and then counting them with two independent `if`s: if slot 2 is never filled, it still holds 0, and when 0 is the answer it is counted and added twice. `[0, 0, 0]` returns `[0, 0]`. Start with two different placeholders, or skip `cand2` when it equals `cand1`.
- **Forgetting to reset the counts** before the verification pass: the leftover counts are added to the real ones.
- **Using `>=` in the threshold:** in the hash map version, `[1, 2, 3]` would return all three values, since each occurs once and ⌊3/3⌋ = 1.

## 12. Pattern recognition

**The pattern:** frequency counting with a threshold of n/k: at most k − 1 values qualify, so cancellation with k − 1 candidate slots finds them in O(1) space, followed by an exact count.

**Signals in the problem statement:**

- "Appears more than ⌊n/k⌋ times" for a small constant k.
- A follow-up asking for O(1) extra space on a counting question.
- No guarantee that a qualifying value exists, which means a verification pass.

**Related problems in this list:**

- [[nc-majority-element|Majority Element]]: the k = 2 case with a guarantee, one slot, no verification.
- [[nc-top-k-frequent-elements|Top K Frequent Elements]]: frequency without a threshold, where hashing is needed.
- [[nc-contains-duplicate|Contains Duplicate]]: the simplest frequency question.
- [[nc-kth-largest-element-in-array|Kth Largest Element in an Array]]: selection. A value above n/3 forms a sorted run longer than n/3, which must cover sorted index ⌊n/3⌋ or ⌊2n/3⌋, so two selections plus a verification pass are another linear (expected) method.

**Takeaway:** a value above n/k survives the removal of any k pairwise different values. Keep k − 1 candidates, compare with all of them before filling a slot, and always verify when no answer is promised.

## 13. 60-second revision card

**Key insight:** at most two values exceed n/3. Discarding three pairwise different values never removes such a value entirely, so two candidate slots catch every answer; a second pass confirms them.

**Invariant:** the prefix splits into `count1` copies of `cand1`, `count2` copies of `cand2`, and triples of different values; `cand1 != cand2` always.

**Complexity:** O(n) worst-case time (two passes), O(1) auxiliary space; Ω(n) worst-case lower bound.

**Code skeleton:**

```java title="Two-candidate voting + verification" fragment="public List<Integer> majorityElement(int[] nums)"
int cand1 = 0, cand2 = 1, count1 = 0, count2 = 0;     // two different placeholders
for (int x : nums) {
    if (x == cand1) count1++;
    else if (x == cand2) count2++;                    // match both before filling a slot
    else if (count1 == 0) { cand1 = x; count1 = 1; }
    else if (count2 == 0) { cand2 = x; count2 = 1; }
    else { count1--; count2--; }                      // discard a triple
}
count1 = 0; count2 = 0;                               // verify: exact counts
for (int x : nums) {
    if (x == cand1) count1++;
    else if (x == cand2) count2++;
}
List<Integer> result = new ArrayList<>();
if (count1 > nums.length / 3) result.add(cand1);
if (count2 > nums.length / 3) result.add(cand2);
return result;
```

**Main traps:**

- Match both candidates before filling an empty slot.
- Always run the verification pass; reset the counts first.
- Strictly more than ⌊n/3⌋.
- Different placeholder values, so a value is never reported twice.

**What to say in one breath:** "At most two values can exceed n/3. I keep two candidates with counts; an element that matches neither, when both slots are full, cancels a triple of three different values, and a value above n/3 can't be cancelled away completely. So every answer ends up a candidate, and a second pass counts the candidates exactly, because nothing guarantees an answer. O(n) time, O(1) space."
