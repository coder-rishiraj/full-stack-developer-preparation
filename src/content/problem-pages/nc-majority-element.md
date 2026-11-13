---
problemId: nc-majority-element
title: Majority Element
source: neetcode
sourceUrl: https://leetcode.com/problems/majority-element/
difficulty: easy
patterns: [arrays-hashing, hashing]
relatedLessons: [a2-frequency-counting, a2-hashing, a1-hashmap, a2-sorting-based, a14-deriving-optimization]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

You get an integer array `nums` of length n. One value occurs **more than ⌊n/2⌋ times**, that is, in more than half of the positions. Return that value.

**Example 1**

- Input: `nums = [6, 1, 6, 6, 2]`
- Output: `6`
- Why: n = 5, so the majority must occur more than ⌊5/2⌋ = 2 times. 6 occurs 3 times; 1 and 2 occur once each.

**Example 2**

- Input: `nums = [4, 9, 9]`
- Output: `9`
- Why: n = 3, and 9 occurs 2 times, which is more than ⌊3/2⌋ = 1. Being the most frequent is not enough in general; here 9 is also more than half.

**What the problem statement guarantees**

- 1 ≤ n ≤ 5 × 10^4.
- −10^9 ≤ `nums[i]` ≤ 10^9.
- A majority element always exists.
- The statement's follow-up asks for linear time and O(1) extra space.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The first solution is easy; the one the follow-up asks for is not, and you learn far more by trying to find it than by reading it. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 15 minutes and talk out loud.
2. Give any correct solution with its time and space, then ask what the "more than half" guarantee lets you skip.
3. Look for a solution with O(1) extra memory. Try writing the array as a row of values and imagine crossing some of them out.
4. Write the code, and trace it on `[1, 7, 7, 2, 7, 3, 7]`.
5. Say what your code returns if the guarantee were broken, for example on `[1, 2, 3]`.

> [!HINT] Hint 1: a small nudge
> If you arranged the values in order, where would the majority value have to be, no matter what the other values are?

> [!HINT] Hint 2: the kind of tool you need
> For O(1) memory: take two elements with **different** values and throw both away. Is the value that was the majority before still the majority of what is left? What does that suggest you keep track of while scanning?

> [!HINT] Hint 3: almost the whole plan
> Scan once, keeping one candidate value and a counter. When the counter is zero, the current element becomes the candidate. An element equal to the candidate adds one; a different element subtracts one (it "cancels" one copy of the candidate). Return the candidate at the end, and work out why the guarantee is what makes that answer right.

**Check yourself before revealing the walkthrough**

- [ ] I said at least one simple correct solution and its complexity before looking for the O(1)-space one
- [ ] My code returns 7 for `[1, 7, 7, 2, 7, 3, 7]` and 5 for `[5]`
- [ ] I can explain in plain words why my O(1)-space solution is correct
- [ ] I know what it would return without the guarantee, and how to fix that

## 3. Interview script: understand the problem (≈2 min)

**Me:** Let me say it back. There's a value that occupies more than half the positions in the array, and I return that value, not its index or its count.

**Interviewer:** Yes.

**Me:** "More than half" strictly? So in an array of 4 it has to appear at least 3 times, not 2?

**Interviewer:** Strictly more than ⌊n/2⌋.

**Me:** And it always exists? I don't need to handle "no majority"?

**Interviewer:** It always exists.

**Me:** That matters a lot: some of the fast methods only produce a correct answer because of that promise. What sizes and values?

**Interviewer:** Up to 5 × 10^4 elements, at least one. Values between −10^9 and 10^9.

**Me:** So negatives, and too wide a range for an array indexed by value. I only compare and count, so overflow isn't a concern: a count is at most 5 × 10^4. May I modify the input, for example sort it?

**Interviewer:** I'd prefer you didn't.

**Me:** Then if I sort, I sort a copy. Example: `[6, 1, 6, 6, 2]`. Counting by hand, 6 appears 3 times out of 5, more than 2, so 6.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| A majority element always exists | No "not found" case. The cancellation method in Approach 3 is correct only because of this; without it, a second verification pass is needed. |
| Majority means more than ⌊n/2⌋ occurrences | It is a strict majority, which is what forces it onto the middle of a sorted array and what lets it survive pairwise cancellation. |
| 1 ≤ n ≤ 5 × 10^4 | Never empty. n² is about 2.5 × 10^9 comparisons, too slow; O(n log n) and O(n) are both fine. |
| −10^9 ≤ `nums[i]` ≤ 10^9 | Negatives occur, and the range is too wide for a counting array, which points to hashing if I count. |
| Follow-up: linear time, O(1) space | Rules out the hash map (O(n) space) and sorting (O(n log n) time) for the final answer. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Return the value, not an index | No index bookkeeping. |
| The input should not be modified | Sorting has to work on a copy, which costs O(n) memory. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The whole array is in memory and can be read more than once | It allows a second verification pass if the interviewer later drops the guarantee. |

### Edge cases I will keep in mind

- n = 1: the only element is the answer.
- n = 2: both elements must be equal.
- A majority by exactly one: `[1, 1, 2, 2, 2]`.
- The majority clustered at the end, so any running "leader" changes late: `[1, 2, 3, 9, 9, 9, 9]`.
- Alternating values, where a running count keeps dropping to zero: `[2, 1, 2, 1, 2, 1, 2]`.
- Negative values and the range limits.

## 4. Think out loud: from first idea to best solution

The most literal solution counts each element's occurrences with an inner loop: O(n²) time, O(1) space. At n = 5 × 10^4 that is about 2.5 × 10^9 comparisons in the worst case, so I state it as the baseline and do not code it.

### Approach 1: Sort a copy, take the middle

#### What I say out loud

> "If I sort the values, all copies of the majority sit together in one block. That block has more than n/2 elements, and I think a block that long can't avoid the middle position. Let me check with n = 5: the block has at least 3 elements. If it started at index 3, it would need indices 3, 4, 5, and 5 doesn't exist. If it ended at index 1, it would need −1. So it must cover index 2. Then the answer is just the middle element after sorting."

> "You'd prefer I don't modify the input, so I sort a copy. That's O(n log n) time and O(n) space. Not what the follow-up wants, but it's a correct start in two lines."

#### Intuition

In sorted order, the majority is a single run longer than half the array. Any run that long must cover the middle index ⌊n/2⌋, whatever the other values are. This is a standard use of [[a2-sorting-based|sorting to expose structure]].

#### Algorithm

1. Copy `nums` and sort the copy.
2. Return `sorted[n / 2]`.

#### Why it is correct

Let the majority's run in the sorted copy start at index s and have length L ≥ ⌊n/2⌋ + 1.

- If the run started after the middle, at s ≥ ⌊n/2⌋ + 1, its last index would be at least s + L − 1 ≥ 2⌊n/2⌋ + 1 ≥ n, past the end of the array.
- If it ended before the middle, its last index s + L − 1 ≤ ⌊n/2⌋ − 1 would force s ≤ −1.

Both are impossible, so the run covers index ⌊n/2⌋, and `sorted[n / 2]` is the majority. The argument uses the strict majority: with exactly n/2 copies in an even-length array, the run could sit entirely in the first half.

#### Dry run

`nums = [6, 1, 6, 6, 2]`, n = 5

| Step | Value |
|---|---|
| Sorted copy | `[1, 2, 6, 6, 6]` |
| Middle index `5 / 2` | 2 |
| `sorted[2]` | 6 |

Returns 6.

#### Java code

```java title="Approach 1: sort a copy, take the middle"
import java.util.Arrays;

class Solution {
    public int majorityElement(int[] nums) {
        int[] sorted = nums.clone();      // the input stays untouched
        Arrays.sort(sorted);
        return sorted[sorted.length / 2]; // the majority's run always covers the middle
    }
}
```

#### Time complexity

**O(n log n)**, where n is `nums.length`. Cloning is O(n); sorting dominates. Java sorts an `int[]` with a dual-pivot quicksort, and the documentation of recent JDKs states O(n log n) performance on all data sets (older JDKs said "many data sets"); treat the exact worst-case behaviour as a property of the JDK version.

#### Space complexity

**O(n) auxiliary space** for the copy, plus the sort's own stack (O(log n) in typical implementations). If modifying the input were allowed, sorting in place would drop the copy.

#### The bridge to the next approach

> "The sort does far more than I need. I don't care about the order of anything; I only need to know which value has the biggest count. Counting is something a hash map does in one pass, which takes the log factor away. And I can stop early: as soon as some count passes n/2, that's the answer."

### Approach 2: Count with a hash map

#### What I say out loud

> "One pass with a map from value to count. After incrementing a value's count, if it's more than n/2, I return it immediately. The range is up to ±10^9, so a counting array indexed by value isn't an option; a HashMap is."

#### Intuition

Frequencies answer the question directly. A map from value to count is the standard tool from [[a2-frequency-counting|Frequency Counting]]; checking the threshold during the scan means the method returns as soon as the majority reaches more than half.

#### Algorithm

1. Create an empty map `count`.
2. For each `x` in `nums`: increment `count[x]`; if it is now greater than n / 2 (integer division), return `x`.
3. If the loop ends, the guarantee was broken: throw.

#### Why it is correct

After processing a prefix, `count[x]` is exactly the number of times `x` occurs in that prefix. The method returns `x` only when that number exceeds ⌊n/2⌋, and since occurrences in a prefix are at most occurrences in the whole array, `x` really is the majority. It cannot miss: by the end of the array the majority's count exceeds ⌊n/2⌋, so the check fires no later than at its last occurrence. Only one value can exceed half, so no other value can trigger it first.

#### Dry run

`nums = [6, 1, 6, 6, 2]`, n = 5, threshold: more than 2

| x | `count` after the increment | count[x] > 2? |
|---|---|---|
| 6 | `{6: 1}` | no |
| 1 | `{6: 1, 1: 1}` | no |
| 6 | `{6: 2, 1: 1}` | no |
| 6 | `{6: 3, 1: 1}` | yes, return 6 |

The last element is never read.

#### Java code

```java title="Approach 2: hash map counting"
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int majorityElement(int[] nums) {
        Map<Integer, Integer> count = new HashMap<>();
        int half = nums.length / 2;
        for (int x : nums) {
            int c = count.merge(x, 1, Integer::sum); // new count of x
            if (c > half) {
                return x;
            }
        }
        throw new IllegalArgumentException("No majority element");
    }
}
```

#### Time complexity

**O(n) expected time.** At most n iterations, each one `merge`, which hashes the key and touches one bucket: constant time on average if hash codes spread well, with occasional resizing amortized over the inserts. In the worst case, with many colliding keys, a hash table with list buckets degrades to O(n) per operation and O(n²) overall; current Java implementations convert heavily collided buckets into balanced trees, which for `Integer` keys limits that to about O(log n) per operation. That is implementation behaviour, not an API guarantee.

#### Space complexity

**O(n) auxiliary space**: one entry per distinct value seen. Because the majority fills more than half the positions, there are at most n − ⌊n/2⌋ distinct values in total, which is still O(n). Each entry also carries boxed keys and values and a map node, so the constant is large compared with an `int`.

#### The bridge to the next approach

> "That's linear, but the follow-up wants O(1) space, and the map is O(n). The map tracks every value's count, and I only care about one value. What does 'more than half' let me do that a general frequency question doesn't?"

> "Here's a thought. Suppose I take two elements with different values and throw both away. At most one of them was the majority. So the majority loses at most one copy while the array loses two, and it's still more than half of what's left. If I keep throwing away pairs of different values until I can't, whatever is left must be all one value, and it has to be the majority. I don't need to store the pairs. I only need to remember the value of the unpaired leftovers and how many there are."

### Approach 3: Boyer–Moore voting (recommended)

#### What I say out loud

> "I keep a candidate and a count. For each element: if the count is zero, this element becomes the candidate. Then if the element equals the candidate, count up; otherwise count down. The count going down is the cancellation: this element and one copy of the candidate are two different values thrown away together."

> "At the end the candidate is the majority. That relies on the guarantee: if there might be no majority, I'd count the candidate's occurrences in a second pass and check it's more than n/2."

#### Intuition

Pairing up different values is a contest the majority cannot lose: every other value combined has fewer copies than it does, so even if each of them cancels one copy of the majority, some copies are left over. The algorithm keeps only the leftovers, and the leftovers are always copies of one value.

#### Algorithm

1. Set `candidate` to anything and `count = 0`.
2. For each `x` in `nums`:
   - If `count == 0`, set `candidate = x`.
   - If `x == candidate`, increment `count`; otherwise decrement it.
3. Return `candidate`.

#### Why it is correct

**The invariant:** after processing any prefix, its elements can be split into
- `count` unpaired elements, all equal to `candidate`, and
- pairs of elements with **different** values.

It holds at the start (empty prefix, `count = 0`). For a new element `x`:
- If `count == 0`, `x` becomes the candidate and the only unpaired element.
- If `x == candidate`, it joins the unpaired copies.
- If `x != candidate`, it is paired with one unpaired copy of `candidate`. The two values differ, so this is a valid pair, and `count` drops by one.

**Why the final candidate is the majority.** Say the whole array splits into P pairs plus `count` unpaired copies of `candidate`, so n = 2P + `count`. Let m be the majority value and c its number of occurrences, with c > n/2. Each pair holds two different values, so at most one element of each pair is m: at most P copies of m are paired. Then the number of unpaired copies of m is at least c − P > n/2 − P = `count`/2 ≥ 0. So at least one copy of m is unpaired. All unpaired elements equal `candidate`, so `candidate` is m.

**Where the guarantee is used.** The step c > n/2 is the guarantee. Without it, the leftovers are still all one value, but nothing forces that value to be frequent: `[1, 2, 3]` pairs 1 with 2 and leaves 3, so the method returns 3, which is not a majority. Then a second pass that counts the candidate is required.

**What `count` is not.** It is not the majority's frequency, and the candidate partway through is not the majority of the prefix. In `[1, 7, 7, 2, 7, 3, 7]` the final count is 1, while 7 occurs 4 times.

**The 25-second version to say to the interviewer:**

> "Think of it as pairing off elements with different values and discarding each pair. Each pair contains at most one copy of the majority, and the majority has more copies than everything else combined, so it can't all be paired away. The algorithm keeps the unpaired leftovers, which are always copies of a single value, the candidate. So at the end the candidate is the majority, given that one exists."

#### Dry run

`nums = [1, 7, 7, 2, 7, 3, 7]`; 7 occurs 4 times out of 7.

| x | count before | Candidate after | Effect | count after |
|---|---|---|---|---|
| 1 | 0 | 1 | count was 0, 1 becomes candidate; equal, +1 | 1 |
| 7 | 1 | 1 | differs, pairs with a 1 | 0 |
| 7 | 0 | 7 | count was 0, 7 becomes candidate; equal, +1 | 1 |
| 2 | 1 | 7 | differs, pairs with a 7 | 0 |
| 7 | 0 | 7 | count was 0, 7 becomes candidate again; +1 | 1 |
| 3 | 1 | 7 | differs, pairs with a 7 | 0 |
| 7 | 0 | 7 | count was 0, 7 becomes candidate; +1 | 1 |

Returns 7. The pairs were (1, 7), (7, 2), (7, 3), all of different values, and one 7 is left over.

#### Java code

```java title="Approach 3: Boyer-Moore voting (recommended)"
class Solution {
    public int majorityElement(int[] nums) {
        int candidate = 0;
        int count = 0;                        // unpaired copies of candidate
        for (int x : nums) {
            if (count == 0) {
                candidate = x;                // no leftovers: start a new candidate
            }
            count += (x == candidate) ? 1 : -1; // equal: one more leftover; different: cancel a pair
        }
        return candidate;                     // correct because a majority is guaranteed
    }
}
```

#### Time complexity

**O(n) in every case.** One pass, constant work per element, no hashing, so the bound is a worst-case bound, not an expectation.

#### Space complexity

**O(1) auxiliary space**: two integers. This meets the follow-up exactly.

### Alternative: bit-by-bit majority

For each of the 32 bit positions, count how many elements have that bit set. If more than ⌊n/2⌋ do, the majority has that bit set; if not, it has it clear, because the majority alone accounts for more than half of the elements and all of them share its bits. Assembling the bits gives the answer, and Java's two's complement makes negative values work unchanged.

```java title="Alternative: bit-by-bit majority"
class Solution {
    public int majorityElement(int[] nums) {
        int result = 0;
        for (int bit = 0; bit < 32; bit++) {
            int ones = 0;
            for (int x : nums) {
                ones += (x >>> bit) & 1;
            }
            if (ones > nums.length / 2) {
                result |= 1 << bit;
            }
        }
        return result;
    }
}
```

This is O(32n) = O(n) time and O(1) space, deterministic, and its correctness argument is simpler than Boyer–Moore's. It loses in practice by making 32 passes instead of one, and like Boyer–Moore it returns garbage when there is no majority. It is a good fallback if you cannot recall the voting algorithm in the interview.

### Alternative: random sampling, and divide and conquer

**Random sampling:** pick a random element and count its occurrences; if it occurs more than ⌊n/2⌋ times, return it, otherwise try again. Each try succeeds with probability above 1/2, so the expected number of tries is below 2 and the expected time is O(n), with O(1) space. There is no worst-case bound: with bad luck the number of tries is unbounded. It wins nothing over Boyer–Moore here.

**Divide and conquer:** the majority of the whole array is the majority of at least one half, so find each half's majority recursively and count both candidates over the whole range. O(n log n) time and O(log n) recursion stack. It is slower than sorting in practice and longer to write; mention it only if asked.

## 5. Comparison table

n = `nums.length`. "Expected" refers to the hash function's behaviour (or, for random sampling, the random choices).

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Baseline: count each element with an inner loop | O(n²) | O(n²) | O(1) |
| 1. Sort a copy, take the middle | O(n log n) | O(n log n) per recent JDK documentation | O(n) for the copy; O(log n) stack if sorting in place is allowed |
| 2. Hash map counting | O(n) | O(n²) in general; about O(n log n) with current Java tree buckets and `Integer` keys (not an API guarantee) | O(n) |
| 3. Boyer–Moore voting | O(n) | O(n) | O(1) |
| Alt. Bit-by-bit | O(n) (32 passes) | O(n) | O(1) |
| Alt. Random sampling | O(n) | Unbounded | O(1) |
| Alt. Divide and conquer | O(n log n) | O(n log n) | O(log n) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Sort, take middle | Two lines; easy to justify | Log factor; copy or mutation | A first correct answer in an interview, said quickly |
| 2. Hash map | Linear expected; generalizes to any frequency question | O(n) memory; expected, not guaranteed | When there is no majority guarantee and you need counts, or the mode |
| 3. Boyer–Moore | Linear worst case, O(1) space, one pass, works on a stream | Correct only with the guarantee; the proof is the hard part | The answer to the follow-up, and the default here |
| Alt. Bit-by-bit | O(1) space with an easy proof | 32 passes | If you cannot recall Boyer–Moore |
| Alt. Random sampling | Simple | No worst-case bound | Rarely |
| Alt. Divide and conquer | Shows recursion skills | Slower and longer than the others | Only if asked |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** mention sorting and the hash map in a sentence each as you derive, then give Boyer–Moore and its pairing argument. The follow-up asks for linear time and O(1) space, and Boyer–Moore meets both with five lines of code.

**Is it optimal?** Yes. In the worst case a correct algorithm must inspect essentially every element: in `[a, b, ?]` with a ≠ b, the unread third element decides the answer. That gives an Ω(n) worst-case lower bound; Boyer–Moore matches it in the worst case, not just in expectation, with O(1) space.

**When something else is better in practice:** if the guarantee might not hold and you also need counts, the hash map gives both in one pass. If you are allowed only one pass and no guarantee, Boyer–Moore alone cannot confirm its answer.

**When to stop:** after Boyer–Moore and its spoken proof. Do not code the alternatives unless asked.

## 7. Interview script: code it and test it

### What I say while coding

> "Two variables: `candidate` and `count`. `count` is the number of unpaired copies of the candidate."

> "The zero check comes first: if nothing is unpaired, the current element starts a new candidate. Then the same comparison handles both cases: equal adds one, different cancels one."

> "I return the candidate. I'll add a comment that this is only right because a majority is guaranteed, and if you want I'll add the verification pass."

### Testing out loud

**Normal case:** `[1, 7, 7, 2, 7, 3, 7]`. As in the dry run, the count goes 1, 0, 1, 0, 1, 0, 1 and the candidate ends as 7. Correct.

**Single element:** `[5]`. Count is 0, so 5 becomes the candidate, count 1. Returns 5.

**Two elements:** `[8, 8]`. 8 becomes the candidate, count 1, then 2. Returns 8.

**Majority clustered at the end:** `[1, 2, 3, 9, 9, 9, 9]`. 1 becomes candidate, 2 cancels it, 3 becomes candidate, the first 9 cancels it, the second 9 becomes candidate with count 1, and the last two 9s raise it to 3. Returns 9.

**Alternating:** `[2, 1, 2, 1, 2, 1, 2]`. Count goes 1, 0, 1, 0, 1, 0, 1, and every restart picks a 2. Returns 2.

**Majority by one:** `[1, 1, 2, 2, 2]`. Candidate 1 reaches count 2, the first two 2s bring it to 0, the last 2 becomes candidate. Returns 2.

**Negatives:** `[-4, -4, 0]`. Candidate −4 reaches 2, then 0 brings it to 1. Returns −4. Nothing in the code depends on sign.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1–2 min | Strict majority, always exists, may I modify the input |
| Quick answers | 1–2 min | Sort-and-middle with its proof sketch; hash map; their costs |
| Derive Boyer–Moore | 3–4 min | "Discard two different values: the majority survives" |
| Explain correctness | 1–2 min | Pairs and leftovers, where the guarantee is used |
| Code | 2 min | Five lines |
| Trace and edge cases | 2–3 min | `[1, 7, 7, 2, 7, 3, 7]`, n = 1, majority at the end |

The time should go into the derivation and the correctness argument; the code is trivial once the idea is clear. If the cancellation idea does not come, code the hash map, say clearly that it is O(n) space, and ask whether the interviewer wants to push for O(1). The bit-by-bit method is a respectable O(1)-space answer if you remember it but not Boyer–Moore.

## 9. Interviewer challenges

### About correctness

#### Why is Boyer–Moore correct? The candidate changes so often.

**What they are testing:** whether you understand the algorithm or memorized it.

**How to reason:** do not reason about the candidate at each step; reason about what has been discarded. Every decrement discards two elements with different values.

**What I say:** "Each decrement throws away a pair of different values, so each pair contains at most one copy of the majority. The majority has more copies than all other values combined, so not all of its copies can be paired off. Whatever is left unpaired is all one value, the candidate, so the candidate must be the majority."

**Nuance:** the intermediate candidate means nothing on its own, and the final `count` is not the majority's frequency. Only the final candidate has a meaning, and only under the guarantee.

#### What if a majority is not guaranteed?

**What they are testing:** whether you know which assumption your algorithm uses.

**How to reason:** the algorithm always returns some value. Find an input without a majority and see what it returns.

**What I say:** "Then the candidate is just whatever survived. `[1, 2, 3]` returns 3, and `[1, 1, 2, 2, 3]` also returns 3. So I'd add a second pass that counts the candidate and returns it only if the count is more than n/2, otherwise a 'none' value. Still O(n) time and O(1) space."

**Nuance:** the second pass needs to read the input again. On a one-pass stream, you get the candidate but cannot confirm it with O(1) memory alone.

#### Why does the middle of the sorted array always hold the majority, even for even n?

**What they are testing:** whether your sorting answer was a guess.

**How to reason:** the majority's run has length at least ⌊n/2⌋ + 1. Check whether it can fit entirely on one side of index ⌊n/2⌋.

**What I say:** "To avoid index n/2 the run would have to fit entirely before it or entirely after it. Each side has at most ⌊n/2⌋ slots, and the run has at least ⌊n/2⌋ + 1 elements. So it covers the middle. For n = 4, the run has length 3 and must cover index 2."

**Nuance:** `sorted[n / 2 − 1]` happens to work for even n but fails for odd n: for `[6, 1, 6, 6, 2]` it returns 2.

### About complexity

#### Can you do better than O(n) time?

**What they are testing:** whether you can argue a lower bound and stop.

**How to reason:** construct an input where an unread element decides the answer.

**What I say:** "No. In the worst case every element matters: in `[a, b, ?]` with a and b different, the third element decides the answer, and the same idea scales up. So there's an Ω(n) worst-case lower bound, and Boyer–Moore meets it with O(1) space."

**Nuance:** some inputs allow an early stop (the hash map version returns as soon as a count passes n/2), but no algorithm avoids linear time in the worst case.

## 10. Follow-up questions the interviewer might ask

**"Find all elements that appear more than ⌊n/3⌋ times."**
At most two values can, so keep two candidates and two counts. A new element that matches neither candidate, when both counts are positive, cancels one copy of each: a triple of distinct values. Then verify both candidates in a second pass, because this version has no existence guarantee. O(n) time, O(1) space. This is [[nc-majority-element-ii|Majority Element II]].

**"What if you need the most frequent element, with no majority guarantee?"**
Boyer–Moore no longer applies: the most frequent value can lose to cancellation. In `[1, 1, 2, 3, 4]` the most frequent value is 1, but the voting pass returns 4. Use the hash map, O(n) expected time and O(d) space for d distinct values. For the k most frequent, see [[nc-top-k-frequent-elements|Top K Frequent Elements]].

**"The array is split across many machines. How do you find the majority?"**
Run Boyer–Moore on each part to get a (candidate, count) summary. Two summaries merge like the algorithm itself: equal candidates add their counts; different candidates cancel the smaller count against the larger. That preserves the "pairs plus leftovers" invariant, so the merged candidate is the global majority if one exists. A second distributed pass counts it to confirm. O(n / p) time per machine for p machines, O(1) space each.

**"What if the input arrives as a stream?"**
Boyer–Moore needs one pass and O(1) memory, so it runs on a stream directly, giving the right answer whenever a majority exists. Confirming that one does requires a second pass or more memory.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Equating "majority" with "most frequent".** They coincide only when a strict majority exists. Boyer–Moore finds the first, not the second.
- **Forgetting where the guarantee is used.** Boyer–Moore and the bit method return a value on any input; without the guarantee it can be wrong.
- **Reading meaning into intermediate states.** The running candidate is not the prefix's majority, and the final count is not the frequency.
- **Sorting the input in place without asking.** It changes the caller's array.

### Implementation mistakes

> [!MISTAKE] Using `>=` instead of `>` in the counting threshold
> `if (c >= nums.length / 2) return x;` returns too early: for `[1, 2, 2]`, ⌊3/2⌋ = 1, so the first 1 already satisfies `1 >= 1` and the method returns 1 instead of 2. The definition is strictly more than ⌊n/2⌋.

- **Taking `sorted[n / 2 − 1]`.** Fails for odd n: `[6, 1, 6, 6, 2]` sorts to `[1, 2, 6, 6, 6]` and index 1 holds 2.
- **Starting with `candidate = nums[0]`, `count = 1`, and then looping from index 0.** The first element is counted twice. For `[1, 2, 2]` the count goes 2, 1, 0 and the method returns 1 instead of 2. Either start the loop at index 1, or start with `count = 0` as above.
- **Comparing boxed counts with `==`** (for example two `Integer` values from the map). Above 127 that compares references. Work with `int`, as `merge` returning into an `int` does.

## 12. Pattern recognition

**The pattern:** frequency counting, with a special case: when one value is guaranteed more than half (or more than n/k) of the input, pairwise cancellation finds it in O(1) space.

**Signals in the problem statement:**

- "Appears more than ⌊n/2⌋ times" (or ⌊n/3⌋), with a guarantee that it exists.
- A follow-up asking for O(1) extra space on a counting question.

**Related problems in this list:**

- [[nc-majority-element-ii|Majority Element II]]: the ⌊n/3⌋ version, two candidates and a mandatory verification pass.
- [[nc-top-k-frequent-elements|Top K Frequent Elements]]: frequency counting without a majority guarantee, where hashing is required.
- [[nc-contains-duplicate|Contains Duplicate]]: the simplest "count occurrences with a hash structure" problem.
- [[nc-kth-largest-element-in-array|Kth Largest Element in an Array]]: the majority is the median, so selection algorithms also find it.
- [[nc-two-sum|Two Sum]]: another one-pass hash map scan with an early return.

**Takeaway:** a guaranteed strict majority survives the removal of any pair of different values. Track one candidate and its unpaired count, and verify in a second pass if the guarantee is missing.

## 13. 60-second revision card

**Key insight:** discarding two different values never removes the majority's status. Keep only the unpaired leftovers: one candidate and a count.

**Invariant:** the processed prefix splits into `count` copies of `candidate` plus pairs of different values.

**Complexity:** O(n) worst-case time, O(1) auxiliary space, one pass. Ω(n) worst-case lower bound. Correct only because a majority is guaranteed; otherwise add a counting pass.

**Code skeleton:**

```java title="Boyer-Moore in five lines"
class Solution {
    public int majorityElement(int[] nums) {
        int candidate = 0, count = 0;
        for (int x : nums) {
            if (count == 0) candidate = x;
            count += (x == candidate) ? 1 : -1;
        }
        return candidate;
    }
}
```

**Main traps:**

- Reset the candidate when `count == 0`, before comparing.
- Strictly more than ⌊n/2⌋: `>` not `>=`.
- Sorted answer is `sorted[n / 2]`, not `n / 2 − 1`.
- No guarantee means a verification pass.

**What to say in one breath:** "Sorting puts the majority on the middle index, and a hash map counts in O(n) expected time, but both use extra memory. Boyer–Moore keeps a candidate and a count: equal elements add, different ones cancel a pair. Each cancelled pair holds at most one copy of the majority, which has more copies than everything else, so it survives as the candidate. O(n) time, O(1) space, and if a majority weren't guaranteed I'd verify with a second pass."
