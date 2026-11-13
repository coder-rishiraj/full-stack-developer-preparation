---
problemId: nc-contains-duplicate
title: Contains Duplicate
source: neetcode
sourceUrl: https://leetcode.com/problems/contains-duplicate/
difficulty: easy
patterns: [arrays-hashing, hashing]
relatedLessons: [a2-hashing, a1-hashset, a2-sorting-based, a14-clarifying-requirements, a14-edge-cases]
companies: []
timeToSolve: 8
---

## 1. Problem restatement

You get an array of integers. Answer one yes-or-no question: does any value occur at least twice? Return `true` if some value repeats anywhere in the array, and `false` if every value is different from every other.

**Example 1**

- Input: `nums = [4, 9, 2, 9]`
- Output: `true`
- Why: the value 9 appears at index 1 and again at index 3. It does not matter that the two copies are not next to each other.

**Example 2**

- Input: `nums = [5, -1, 0, 3]`
- Output: `false`
- Why: the four values are all different, so no value appears twice.

**What the problem statement guarantees**

- The array has between 1 and 10^5 elements.
- Every value lies between −10^9 and 10^9.
- The answer is a boolean: `true` if any value appears at least twice, `false` otherwise.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. It looks too easy to practise, which is exactly why candidates rush it and then cannot explain the trade-offs when asked. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 8 minutes and talk out loud.
2. Write down the slowest correct method first and say its complexity.
3. Ask yourself what you would do with a pile of numbered cards to spot a repeat quickly. You probably know two different physical strategies.
4. For each strategy, say what it costs in time, what it costs in memory, and whether it changes the input.
5. Write the code and trace it on Example 1 and on an array of one element.

Open a hint only after two minutes without progress.

> [!HINT] Hint 1: a small nudge
> The slow method compares every element with every other one. Most of those comparisons are between values that are nowhere near each other. Is there a way to arrange things so that equal values can only be in one place relative to each other?

> [!HINT] Hint 2: the kind of tool you need
> There are two ways out. One rearranges the values so that equal ones end up side by side. The other keeps a record of every value you have already passed, in a structure that answers "have I met this value before?" without searching through it.

> [!HINT] Hint 3: almost the whole plan
> Walk through the array once. For each value, ask your record whether it is already there. If it is, you are done and the answer is yes. If not, add it and move on. If you reach the end, the answer is no. Then decide what that record costs in memory, and whether the "already there" check and the "add" can be a single step.

**Check yourself before revealing the walkthrough**

- [ ] I said the brute force and its complexity first
- [ ] I can name two faster methods and the price of each
- [ ] My code returns `false` for a one-element array and `true` for `[7, 7]`
- [ ] I can say whether my time bound is guaranteed or only expected

## 3. Interview script: understand the problem (≈1–2 min)

This problem is short enough that the interviewer may read it out in one sentence: "Given an integer array, return true if any value appears at least twice." The questions worth asking are about the input size, whether the array may be changed, and memory, because those decide between the two good solutions.

**Me:** So I return `true` if some value appears two or more times anywhere, and `false` if all values are distinct. I don't need to say which value or where it is?

**Interviewer:** Right, just the boolean.

**Me:** How big can the array be, and can it be empty?

**Interviewer:** Between 1 and 10^5 elements.

**Me:** Then n² is about 5 × 10^9 comparisons in the worst case. That's too slow to be the final answer, so I'll aim for n log n or better. What about the values?

**Interviewer:** Between −10^9 and 10^9.

**Me:** Negative values, and a range of about 2 × 10^9, so I can't use a boolean array indexed by value. Am I allowed to modify the input array, for example sort it in place?

**Interviewer:** What would you prefer?

**Me:** I'll treat it as read-only, since the caller might still need it in its original order. If I sort, I'll sort a copy, and I'll mention what that costs. If you tell me in-place is fine, I can save that copy.

**Interviewer:** Read-only is fine.

**Me:** Let me check Example 1 by hand. `[4, 9, 2, 9]`: 4 is new, 9 is new, 2 is new, 9 I've already seen. So `true`, and I could stop right there without looking further.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^5 | The array is never empty, but it can have a single element, which has no duplicate. Quadratic time is about 5 × 10^9 steps in the worst case, so I aim for n log n or better. |
| −10^9 ≤ nums[i] ≤ 10^9 | Negatives occur and the range is far wider than n, so indexing an array by value is out. Values are only compared for equality, so there is no arithmetic to overflow. |
| Return `true` if any value appears at least twice | Finding one repeated pair settles the answer, so I can stop early. Only `false` requires reading the whole array. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Only the boolean is needed, not the value or its positions | No bookkeeping of indices; a set of values is enough. |
| The input should stay in its original order | Sorting `nums` in place is ruled out; a sort-based solution must sort a copy, which costs O(n) memory. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The whole array is in memory and arrives at once | It lets me use an in-memory set. A stream or data larger than memory is a follow-up. |
| Memory for up to n extra values is acceptable | The fastest solution spends it. If memory were tight, I would sort instead. |

### Edge cases I will keep in mind

- One element: always `false`.
- Two equal elements, `[7, 7]`: the smallest `true`.
- The duplicate at the two ends of the array, `[6, 1, 8, 3, 6]`, so no loop may stop early.
- Every value equal, `[2, 2, 2, 2]`.
- Values with the same absolute value, `[-3, 3, 0]`: not duplicates.
- All values distinct: the whole array must be read before answering.

The question list follows [[a14-clarifying-requirements|Clarifying Requirements]]; the edge cases follow [[a14-edge-cases|Edge-Case Identification]].

## 4. Think out loud: from first idea to best solution

### Approach 1: Brute force (compare every pair)

#### What I say out loud

> "The definition says 'some value appears twice', which means 'some pair of positions holds equal values'. The direct check is to compare every pair. That's O(n²), around five billion comparisons for 10^5 elements when there's no duplicate, so it's my baseline, not my answer."

#### Intuition

A duplicate is a pair of positions `i < j` with `nums[i] == nums[j]`. There are n(n − 1) / 2 such pairs; checking all of them cannot miss one.

#### Algorithm

1. For each `i` from 0 to n − 2, and each `j` from `i + 1` to n − 1:
2. If `nums[i] == nums[j]`, return `true`.
3. After the loops, return `false`.

#### Why it is correct

- **It returns `true` only when there is a duplicate:** it returns `true` only after seeing two equal values at positions `i < j`, which are different positions.
- **It cannot miss a duplicate:** every pair `i < j` is compared, so if a duplicate exists, its pair is compared and the method returns `true`.

#### Dry run

`nums = [4, 9, 2, 9]`

| i | j | Compare | Equal? |
|---|---|---|---|
| 0 | 1 | 4, 9 | no |
| 0 | 2 | 4, 2 | no |
| 0 | 3 | 4, 9 | no |
| 1 | 2 | 9, 2 | no |
| 1 | 3 | 9, 9 | yes, return `true` |

#### Java code

```java title="Approach 1: brute force"
class Solution {
    public boolean containsDuplicate(int[] nums) {
        for (int i = 0; i < nums.length - 1; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] == nums[j]) {
                    return true;
                }
            }
        }
        return false;
    }
}
```

#### Time complexity

**O(n²) in the worst case**, where n is the length of `nums`. With no duplicate the method compares all n(n − 1) / 2 pairs; for n = 10^5 that is 4,999,950,000 comparisons. If a duplicate appears early, it returns sooner.

#### Space complexity

**O(1) auxiliary space**: two loop counters. The input is not counted and not modified.

#### The bridge to the next approach

> "Almost all of those comparisons are pointless. If I compare 4 with 9 and then 4 with 2, nothing I learned helps with the next comparison. What would help is if equal values couldn't hide far apart from each other."

> "If the values were sorted, equal values would have to be next to each other: anything strictly between them in sorted order would have to be both at least and at most that value. Then I only need to compare neighbours, n − 1 comparisons. The catch is that I agreed not to reorder the input, so I'd sort a copy."

### Approach 2: Sort a copy, then compare neighbours

#### What I say out loud

> "I'll copy the array, sort the copy, and walk it once comparing each element with the one before. If any two neighbours are equal, there's a duplicate. Sorting is n log n, the scan is linear, so n log n overall, and the copy costs O(n) memory. If you let me sort the input itself, I'd skip the copy."

#### Intuition

Sorting groups equal values into one contiguous block. A value appears twice exactly when its block has length at least 2, and every block of length 2 or more contains two equal neighbours. This is a typical [[a2-sorting-based|sorting-based]] reduction: sort so that the relationship you are looking for becomes local.

#### Algorithm

1. `sorted = copy of nums`, then sort `sorted` in ascending order.
2. For each `i` from 1 to n − 1: if `sorted[i] == sorted[i - 1]`, return `true`.
3. Return `false`.

#### Why it is correct

- **Sorting does not change the answer.** It rearranges the same multiset of values, so a value repeats in `sorted` exactly when it repeats in `nums`.
- **If there is a duplicate, two neighbours are equal.** Suppose value v occurs at sorted positions `p < q`. Every position between them holds a value that is at least v (it comes after `p`) and at most v (it comes before `q`), so it equals v. In particular `sorted[p + 1] == v == sorted[p]`.
- **If two neighbours are equal, there is a duplicate.** They are two different positions holding the same value.

#### Dry run

`nums = [4, 9, 2, 9]`, so `sorted = [2, 4, 9, 9]`.

| i | sorted[i − 1] | sorted[i] | Equal? |
|---|---|---|---|
| 1 | 2 | 4 | no |
| 2 | 4 | 9 | no |
| 3 | 9 | 9 | yes, return `true` |

#### Java code

```java title="Approach 2: sort a copy, compare neighbours"
import java.util.Arrays;

class Solution {
    public boolean containsDuplicate(int[] nums) {
        int[] sorted = nums.clone(); // the caller's array keeps its order
        Arrays.sort(sorted);
        for (int i = 1; i < sorted.length; i++) {
            if (sorted[i] == sorted[i - 1]) {
                return true;
            }
        }
        return false;
    }
}
```

The loop starts at `i = 1` and compares with `i - 1`, so a one-element array simply skips the loop and returns `false`.

#### Time complexity

**O(n log n).** Copying is n steps, sorting is O(n log n), and the scan is at most n − 1 comparisons. The sort dominates.

A precise note on Java: `Arrays.sort(int[])` is a dual-pivot quicksort. The implementation note in recent JDK documentation says it offers O(n log n) performance on all data sets; older versions only claimed that for "many" data sets. That is a statement about the implementation, not part of the method's contract. If you need a guaranteed bound, you can name a sort with an n log n worst case, such as heap sort or merge sort, and the analysis is the same.

#### Space complexity

**O(n) auxiliary space** for the copy. The sort itself needs some extra memory too (at least a recursion stack, and some implementations allocate a buffer for certain inputs), but the copy already dominates. If the interviewer allows sorting `nums` in place, the copy disappears and what remains is whatever the sort uses internally, typically O(log n) of stack for a quicksort.

#### The bridge to the next approach

> "Sorting does more than I need. It puts every value in order, but I only care whether a value has been seen before. And because it sorts everything first, it can't stop early even when the duplicate is in the first two positions."

> "The question 'have I seen this value before?' is exactly what a hash set answers, in constant time on average. If I walk the array once and keep a set of what I've passed, I can stop at the first repeat. Memory is still O(n), the same as the sorted copy, but time drops to linear in expectation."

### Approach 3: Hash set, one pass (recommended)

#### What I say out loud

> "I walk through the array once and keep a [[a1-hashset|HashSet]] of the values I've already passed. For each value: if it's already in the set, I've found a duplicate and return `true` immediately. Otherwise I add it. If I reach the end, every value was new, so I return `false`."

> "In Java I can do the check and the insert in one call: `add` returns `false` when the value was already there. That's one hash lookup per element instead of two."

#### Intuition

You do not need to compare a value with every earlier value, only to know whether an equal one has appeared. A hash set stores what you have seen and answers membership without scanning. This is the "seen before?" pattern from [[a2-hashing|Hashing]].

#### Algorithm

1. Create an empty set `seen`.
2. For each value `x` in `nums`: if `seen.add(x)` returns `false`, return `true`.
3. Return `false`.

#### Why it is correct

**The invariant:** before processing index `i`, `seen` contains exactly the values at indices 0 to i − 1, and those values are all distinct (otherwise the method would already have returned).

- It holds at the start: the set is empty and there are no earlier indices.
- At index `i`, `seen.add(nums[i])` returns `false` exactly when `nums[i]` equals some earlier value, and then the method correctly returns `true`. Otherwise `nums[i]` is new and is now in the set, so the invariant holds for `i + 1`.
- **It returns `true` only for a real duplicate:** the earlier copy was at a smaller index, so the two copies are at different positions.
- **It cannot miss a duplicate:** take the first index `q` whose value also occurs at some earlier index `p`. When the loop reaches `q`, the invariant says `nums[p]` is in the set, so `add` returns `false`.
- If the loop finishes, the invariant for i = n says all n values are distinct, so `false` is correct.

**The 20-second version to say to the interviewer:**

> "The set always holds exactly the values I've passed so far, all distinct. When I reach a value, `add` fails exactly if an earlier position had the same value. So the first repeat is caught the moment I reach its second copy, and if I get to the end, all values were different."

#### Dry run

`nums = [4, 9, 2, 9]`

| i | nums[i] | `seen` before | `add` returns | Action |
|---|---|---|---|---|
| 0 | 4 | `{}` | true | continue |
| 1 | 9 | `{4}` | true | continue |
| 2 | 2 | `{4, 9}` | true | continue |
| 3 | 9 | `{4, 9, 2}` | false | return `true` |

`nums = [5, -1, 0, 3]`: every `add` returns `true`, the set ends as `{5, -1, 0, 3}`, and the method returns `false`.

#### Java code

```java title="Approach 3: hash set, one pass (recommended)"
import java.util.HashSet;
import java.util.Set;

class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int x : nums) {
            if (!seen.add(x)) { // add returns false when x was already in the set
                return true;
            }
        }
        return false;
    }
}
```

#### Time complexity

**O(n) expected time; not O(n) in the worst case.**

- The loop runs at most n times, and each iteration does one `add`.
- `add` hashes the value and inspects one bucket. With hash codes spread evenly, a bucket holds a constant number of entries on average, so `add` is constant on average. Occasional resizes double the table, which adds constant amortized work per insertion.
- If many values land in the same bucket, each `add` has to search that bucket: up to O(n) per operation with list buckets, O(n²) in total. Current Java `HashMap` implementations (which back `HashSet`) convert a heavily collided bucket into a balanced tree, which for comparable keys like `Integer` keeps such a lookup to about O(log n). That is implementation behaviour, not something the API promises.

The method also returns early: with a duplicate in the first two positions it does two `add` calls. The worst case for the loop is an array with no duplicate.

#### Space complexity

**O(n) auxiliary space**: with no duplicate the set ends up holding all n values. Each entry is a boxed `Integer` inside a hash table node, so the constant factor is several times that of an `int[]` copy. The input is not modified.

## 5. Comparison table

n = length of `nums`.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Brute force | O(n²) | O(n²) | O(1) |
| 2. Sort a copy + neighbours | O(n log n) | O(n log n) with an n log n worst-case sort | O(n) for the copy; about O(log n) if sorting in place is allowed |
| 3. Hash set | O(n) | O(n²) for hash tables in general; about O(n log n) with current Java tree buckets and `Integer` keys (not an API guarantee) | O(n) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Brute force | No extra memory; correct by inspection, since it compares every pair | Quadratic | Only as the stated baseline, or for a handful of elements |
| 2. Sort a copy + neighbours | Predictable bound, no hashing, small memory if in place | Cannot stop early; reorders data unless copied | Memory is tight and the array may be sorted in place, or a guaranteed bound is required |
| 3. Hash set | Linear expected time, early exit, shortest code | O(n) memory with large constants; expected rather than guaranteed time | The default answer |

## 6. Which solution to give, and when to stop optimizing

**Give the hash set (Approach 3).** It is the fastest in expectation, it stops at the first repeat, and it is four lines.

**Is it optimal?** In time, yes in expectation. When there is no duplicate, any correct algorithm must, in the worst case, inspect essentially every element, since an unread element could repeat one already seen, so there is an Ω(n) worst-case lower bound. A related known result: for algorithms that only compare values (the algebraic decision tree model), deciding whether all elements are distinct needs Ω(n log n) in the worst case. Hashing is not a comparison-only method, which is how it gets below that bound in expectation, and why its guarantee is only expected.

**When the sort is better in practice:** when you may sort in place and memory matters, Approach 2 uses no set at all; and when inputs could be chosen to cause hash collisions and you need a firm bound.

**Where to stop:** once you have the set solution and have said its expected-versus-worst-case bound. Do not micro-optimize unprompted. Offer the in-place sort trade-off in one sentence if memory comes up.

## 7. Interview script: code it and test it

### What I say while coding

> "One set of `Integer`, called `seen`, holding the values I've passed."

> "I loop over the values directly; I don't need indices."

> "I use the return value of `add` instead of calling `contains` and then `add`. Same logic, one hash lookup per element."

> "If the loop finishes, nothing repeated, so `false`."

### Testing out loud

**Normal case:** `[4, 9, 2, 9]`. Adds 4, 9, 2; the second 9 fails to add, so `true`. Correct.

**No duplicate:** `[5, -1, 0, 3]`. All four adds succeed; the loop ends; `false`. Correct, and it read every element.

**One element:** `[7]`. One successful add, `false`. No special case needed.

**Smallest duplicate:** `[7, 7]`. The first add succeeds, the second fails, `true`.

**Duplicate at the two ends:** `[6, 1, 8, 3, 6]`. Adds 6, 1, 8, 3; the last 6 fails, `true`. The loop did reach the final element.

**All equal:** `[2, 2, 2, 2]`. The second element already fails, `true` after two adds.

**Same absolute value:** `[-3, 3, 0]`. −3 and 3 are different `Integer` values, so all three adds succeed: `false`.

## 8. Time plan for the interview

This is a warm-up; aim to finish in under ten minutes.

| Phase | Time | What to get done |
|---|---|---|
| Clarify | about 1 min | Boolean only, size, value range, may the input be modified |
| Brute force and the two better ideas | 1–2 min | Pairs O(n²); sort O(n log n); set O(n) expected |
| Code | 1–2 min | The set version |
| Test | 1–2 min | Example, one element, no duplicate |
| Complexity and trade-offs | 1–2 min | Expected vs worst case; set vs in-place sort for memory |

Spend the time on the trade-off between the sort and the set, which is what distinguishes candidates on this problem. If the set idea does not come, code the sort: it is a correct, respectable answer, and the set usually follows from asking "what does sorting do that I don't need?"

## 9. Interviewer challenges

### About the code

#### Why not check `contains` first and then `add`?

**What they are testing:** whether you know the API you are using and avoid redundant work.

**How to reason:** both versions are correct and have the same complexity. Count hash lookups per element.

**What I say:** "That's correct too, but it hashes and searches the bucket twice per new element. `add` already tells me whether the value was present by returning `false`, so one call does both jobs."

**Nuance:** this is a constant-factor point, not a complexity one. Say it briefly; do not oversell it.

### About complexity

#### What if you're not allowed O(n) extra memory?

**What they are testing:** whether you understand the time-memory trade-off between your two solutions.

**How to reason:** the set is the memory. Without it, the options are brute force (O(1) space, O(n²) time) or sorting in place, which needs permission to reorder the input.

**What I say:** "If I may reorder the array, I sort it in place and compare neighbours: O(n log n) time and only the sort's own overhead, typically O(log n) of stack. If I may not reorder it and can't copy it, I'm back to the O(n²) pair check."

**Nuance:** "in place" is not quite O(1) for Java's sort, which uses recursion and may allocate a buffer for some inputs. Heap sort is the textbook O(1)-auxiliary sort.

#### Is the hash set solution really O(n)?

**What they are testing:** whether you know O(1) hash operations are an average, not a guarantee.

**How to reason:** an `add` is constant only when buckets stay small, which depends on how the values hash.

**What I say:** "O(n) expected. Each `add` is constant on average if the hash codes spread well. With adversarial values that collide, a plain hash table degrades to O(n²) overall. Current Java turns crowded buckets into balanced trees, so for `Integer` keys it would be closer to O(n log n), but that's the implementation, not a contract. If you need a hard bound, the sort gives O(n log n) guaranteed with a suitable sort."

**Nuance:** `Integer.hashCode()` is the value itself, so the spread depends on the values and on how the table mixes the hash bits. That is why constructed inputs can collide.

### About alternatives

#### Could you just compare the size of a set with the array length?

**What they are testing:** whether you see what the one-liner gives up.

**How to reason:** `new HashSet<>(list).size() < n`, or a stream with `distinct().count()`, is correct. It always processes the whole array.

**What I say:** "Yes, it's correct and still O(n) expected, but it never stops early. With a duplicate in the first two positions, my loop returns after two inserts, while the size comparison inserts all n values. In an interview I'd write the loop."

**Nuance:** for an array with no duplicate the two do the same work. The difference is only the early exit, which matters most when duplicates are common.

## 10. Follow-up questions the interviewer might ask

**"Return `true` only if two equal values are at most k positions apart."**
That is [[nc-contains-duplicate-ii|Contains Duplicate II]]. Keep a set of only the last k values, a sliding window: add the current value, and remove the value that falls out of the window. O(n) expected time, O(min(n, k)) space.

**"What if the values are in a small known range, say 0 to 10^5?"**
Replace the set with a `boolean[]` of that size, indexed by value. O(n + R) time guaranteed, where R is the size of the range, and O(R) space. No hashing, so no expected-versus-worst-case caveat.

**"What if the data is a stream too large to keep in memory?"**
Exact answers need the distinct values stored somewhere. One option is an external sort followed by a sequential scan of neighbours: O(n log n) with bounded memory. Another is partitioning values into files by a hash, so that equal values land in the same file, then checking each file with a set; that is expected linear, with the usual caveat that partitions can be uneven. If a small false-positive rate is acceptable, a Bloom filter can say "definitely new" or "probably seen" with far less memory.

**"Return the duplicated values, or how often each appears."**
Use a map from value to count (see [[a2-frequency-counting|Frequency Counting]]) and do not return early. O(n) expected time, O(d) space for d distinct values.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Sorting `nums` in place without asking.** It changes the caller's data. Ask, or sort a copy and count the copy's memory.
- **Calling the hash set "O(n)" without qualification.** It is O(n) expected; the worst case depends on collisions.
- **Thinking duplicates have to be adjacent in the input.** They only become adjacent after sorting. `[4, 9, 2, 9]` has no equal neighbours.

### Implementation mistakes

> [!MISTAKE] Comparing neighbours without sorting
> Checking `nums[i] == nums[i - 1]` on the original array returns `false` for `[4, 9, 2, 9]`, because the two 9s are not next to each other. The neighbour test is correct only after the sort.

- **The brute-force inner loop starting at `j = i`.** Then every element is compared with itself and the method returns `true` for `[5, -1, 0, 3]`.
- **Using `int[]` indexed by value.** Values go down to −10^9 and span about 2 × 10^9, so this throws or needs gigabytes.

## 12. Pattern recognition

**The pattern:** "have I seen this before?" with a hash set, or sorting so that equal values become neighbours.

**Signals in the problem statement:**

- A question about whether values repeat, are unique, or occur more than once.
- Only equality matters, not order or arithmetic.
- An input too large for O(n²) and too wide in value range for a direct-address array.

**Related problems in this list:**

- [[nc-contains-duplicate-ii|Contains Duplicate II]]: the same check limited to a window of k positions.
- [[nc-two-sum|Two Sum]]: the same "seen before?" lookup, but for a complement, and with a map because it needs positions.
- [[nc-valid-anagram|Valid Anagram]]: equality of value counts instead of detecting a repeat; both can be solved by sorting or by hashing.
- [[cses-distinct-numbers|Distinct Numbers]] (CSES): count the distinct values instead of detecting a repeat; sorting or a set again.

**Takeaway:** to detect a repeat, either sort so repeats sit side by side (O(n log n), little memory) or remember what you have seen in a hash set (O(n) expected, O(n) memory).

## 13. 60-second revision card

**Key insight:** you only need to know whether each value was seen before. A hash set answers that without scanning.

**Invariant:** before index `i`, the set holds exactly the distinct values at indices 0 to i − 1.

**Complexity:** O(n) expected time, O(n) auxiliary space. Worst case O(n²) for hash tables in general (about O(n log n) with current Java tree buckets, not guaranteed). Sorting gives O(n log n) with less memory if in-place is allowed.

**Code skeleton:**

```java title="Contains Duplicate in four lines"
import java.util.*;

class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int x : nums) {
            if (!seen.add(x)) return true;   // add is false when x was already there
        }
        return false;
    }
}
```

**Main traps:**

- Sorting the caller's array in place without asking.
- Comparing neighbours in the unsorted input.
- Calling hash set operations O(1) without saying "on average".

**What to say in one breath:** "Pairs are O(n²). Sorting makes repeats adjacent for O(n log n), and a hash set of seen values gives O(n) expected with an early exit, for O(n) memory. If memory is tight and I may reorder the input, I'd sort in place."
