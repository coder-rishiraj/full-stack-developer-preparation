---
problemId: nc-two-sum
title: Two Sum
source: neetcode
sourceUrl: https://leetcode.com/problems/two-sum/
difficulty: easy
patterns: [arrays-hashing, hashing]
relatedLessons: [a2-hashing, a1-hashmap, a2-two-pointers, a14-clarifying-requirements, a14-deriving-optimization]
companies: []
timeToSolve: 10
---

## 1. Problem restatement

You get an array of integers and a target number. Somewhere in the array there are two different positions whose values add up to the target. Return those two positions as indices, in either order. You may not use the same position twice.

**Example 1**

- Input: `nums = [5, 1, 8, 3]`, `target = 11`
- Output: `[2, 3]`
- Why: `nums[2] + nums[3] = 8 + 3 = 11`. No other pair reaches 11 (the other sums are 6, 13, 8, 9 and 4).

**Example 2**

- Input: `nums = [4, 6, 2]`, `target = 8`
- Output: `[1, 2]`
- Why: `6 + 2 = 8`. The tempting answer `4 + 4` is not allowed, because there is only one `4` and a position cannot be used twice.

**What the problem statement guarantees**

- Exactly one valid pair exists.
- The same element may not be used twice.
- The two indices may be returned in any order.
- The array has between 2 and 10^4 elements.
- Every value and the target lie between −10^9 and 10^9.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. Reading a solution feels like learning, but the interview tests whether you can produce one. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 10 minutes and talk out loud, as if someone were listening.
2. Restate the problem in one sentence and write down three inputs that could break a careless solution.
3. Say the simplest solution that is certainly correct, and its time complexity. Do this even if it feels too slow to mention.
4. Find the work that solution repeats, and ask what you would need to remember to avoid repeating it.
5. Write the code on paper or in a plain editor, then trace it on Example 2 line by line.

Open a hint only after two minutes without progress. After each hint, close it and try again before opening the next one.

> [!HINT] Hint 1: a small nudge
> Pick any one number in the array and suppose it is part of the answer. How many different values could its partner have?

> [!HINT] Hint 2: the kind of tool you need
> You are now looking for one specific value, and you do that once per element. Scanning the array each time is the slow part. Which data structure answers "have I come across this value, and at which position?" without scanning?

> [!HINT] Hint 3: almost the whole plan
> Walk through the array once, remembering each value and its position as you leave it. At every element, before you remember it, ask whether the value it needs has already been remembered. Then work out what goes wrong on Example 2 if you remember first and ask second.

**Check yourself before revealing the walkthrough**

- [ ] I said a brute-force solution and its complexity before trying to be clever
- [ ] I can explain why my faster solution cannot miss the answer
- [ ] My code returns `[1, 2]` for `[4, 6, 2]` with target 8, and `[0, 1]` for `[4, 4]` with target 8
- [ ] I can state the time and the extra space of my solution, and say whether the time bound is guaranteed or only expected

## 3. Interview script: understand the problem (≈2 min)

In an interview you often hear only one sentence: "Given an array of integers and a target, return the indices of the two numbers that add up to the target." So you ask, even for facts that the written statement happens to include. What matters is that afterwards you know which facts are guaranteed, which ones the interviewer confirmed, and which ones are only your own assumptions.

**Me:** Let me say it back. I get an integer array and a target. I return the positions of two different elements whose values add up to the target. Positions, not the values themselves. Right?

**Interviewer:** Right.

**Me:** Is there always an answer, and can there be more than one?

**Interviewer:** Exactly one valid pair exists.

**Me:** That helps: I can return as soon as I find a pair, and I don't need a "not found" result. When you say two elements, they must be at different positions? With target 8, a single 4 is not an answer?

**Interviewer:** Correct, you can't use the same element twice.

**Me:** But two separate 4s would be, so duplicate values can appear?

**Interviewer:** Yes, they can.

**Me:** Are the indices 0-based, and does their order matter?

**Interviewer:** 0-based, any order.

**Me:** What range are the values in? Can they be negative?

**Interviewer:** Values and target are between −10^9 and 10^9.

**Me:** Then the largest possible sum is 2 × 10^9, and a Java `int` holds up to about 2.147 × 10^9, so adding two values or computing `target - nums[i]` cannot overflow. Negatives also mean I can't skip a number just because it is bigger than the target. How long can the array be?

**Interviewer:** Up to 10^4 elements, at least 2.

**Me:** Is it sorted in any way?

**Interviewer:** No.

**Me:** One more. I have to return original positions, so I'd rather not reorder the array. I'll treat the input as read-only unless you tell me I may modify it.

**Interviewer:** That's fine.

**Me:** Let me try an example by hand before I design anything. `[5, 1, 8, 3]`, target 11. Take 5: it would need a 6, and there is none. 1 would need 10, none. 8 would need 3, and there is a 3 at index 3. So `[2, 3]`.

### Given constraints

These are in the original problem statement. I can rely on them without asking.

| Constraint | How it shapes the solution |
|---|---|
| Exactly one valid pair exists | Return at the first match. No tie-breaking, no "not found" value, no need to collect several answers. |
| The same element may not be used twice | The two indices must differ. Any lookup-based solution has to make sure an element cannot find itself. |
| Any order of the two indices | No need to sort the result. |
| 2 ≤ n ≤ 10^4 | The array is never empty. Even n² is only about 5 × 10^7 steps, so brute force would run, but the statement's own follow-up asks for better than O(n²). |
| −10^9 ≤ values, target ≤ 10^9 | Negatives and zero occur, so "skip numbers larger than the target" is wrong. Sums fit in an `int`. The range is far too wide for an array indexed by value, which pushes towards hashing. |

### Clarifications confirmed by the interviewer

The statement does not say these in words. I asked, and the answers changed what I will write.

| Clarification | How it shapes the solution |
|---|---|
| Indices are 0-based (the statement only shows this through its examples) | I return loop indices as they are. The sorted variant of this problem is 1-based, so this is worth ten seconds. |
| The array is not sorted | Two pointers cannot be used directly; they would need a sort first. |
| Duplicate values can occur | A map keyed by value will overwrite entries. I must be able to argue that this is harmless. |

### My assumptions

The problem does not specify these, so I say them out loud. If the interviewer disagrees, I adjust.

| Assumption | Why I state it |
|---|---|
| The input array is read-only | Nothing says I may modify it. This rules out sorting `nums` in place; if I sort, I sort a separate array of indices. |
| If the "exactly one answer" promise is broken, I throw an exception | The statement says this cannot happen, so any behaviour is my choice. Throwing makes a bad input visible. Returning an empty array would be the other reasonable contract. |
| The whole array fits in memory and arrives at once | It lets me use an in-memory hash map. A stream or a file too large for memory is a different problem (see the follow-ups). |

### Edge cases I will keep in mind

- The smallest input: two elements, which must be the answer.
- Two equal values that form the answer: `[4, 4]`, target 8.
- A value that is exactly half the target but appears once: `[4, 6, 2]`, target 8.
- Negative numbers and zero: `[-3, 7, 1]` with target 4, and `[0, 5, 0]` with target 0.
- The answer using the last element, so no loop may stop one step early.

The question list follows [[a14-clarifying-requirements|Clarifying Requirements]]; the edge cases follow [[a14-edge-cases|Edge-Case Identification]].

## 4. Think out loud: from first idea to best solution

### Approach 1: Brute force (try every pair)

#### What I say out loud

> "Before I look for anything clever, I want a solution that is certainly correct. The answer is a pair of positions, and there are only so many pairs, so I can simply try them all: an outer loop picks the first position, an inner loop picks a later one, and I return when the two values add up to the target."

> "That is roughly n squared over two pair checks. For 10^4 elements it's about fifty million additions, so it would actually run. I don't think it's what you're looking for, though, and it won't scale. I'll use it as my baseline and look at where the time goes."

#### Intuition

There are only n(n − 1) / 2 pairs of positions, and the answer is one of them. Checking all of them cannot fail.

#### Algorithm

1. For each index `i` from 0 to n − 2:
2. For each index `j` from `i + 1` to n − 1:
3. If `nums[i] + nums[j] == target`, return `[i, j]`.
4. If the loops finish, the "exactly one answer" promise was broken, so throw.

#### Why it is correct

- **It returns only valid answers.** It returns `[i, j]` only after checking that the two values add up to the target, and `j` starts at `i + 1`, so the two indices always differ.
- **It cannot miss the answer.** Every pair of positions `i < j` is visited once, so the one valid pair is visited too.

#### Dry run

`nums = [5, 1, 8, 3]`, `target = 11`

| i | j | nums[i] + nums[j] | Match? |
|---|---|---|---|
| 0 | 1 | 5 + 1 = 6 | no |
| 0 | 2 | 5 + 8 = 13 | no |
| 0 | 3 | 5 + 3 = 8 | no |
| 1 | 2 | 1 + 8 = 9 | no |
| 1 | 3 | 1 + 3 = 4 | no |
| 2 | 3 | 8 + 3 = 11 | yes, return `[2, 3]` |

This is the worst case for four elements: all 6 pairs were checked.

#### Java code

```java title="Approach 1: brute force"
class Solution {
    public int[] twoSum(int[] nums, int target) {
        for (int i = 0; i < nums.length - 1; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[] {i, j};
                }
            }
        }
        throw new IllegalArgumentException("No two numbers add up to the target");
    }
}
```

#### Time complexity

**O(n²) in the worst case**, where n is the length of `nums`. The cost is the number of pairs examined. For `i = 0` the inner loop runs n − 1 times, for `i = 1` it runs n − 2 times, down to 1. That is (n − 1) + (n − 2) + … + 1 = n(n − 1) / 2 additions, and the n² term dominates. For n = 10^4 that is 49,995,000. The worst case happens when the answer is the last pair tried; if the answer is the first pair, the method returns after one check.

#### Space complexity

**O(1) auxiliary space**: two loop counters. Auxiliary space means memory beyond the input, which is not counted. The two-element result is constant size. No recursion, and the input is not modified.

#### The bridge to the next approach

> "Where does the time go? The outer loop has to stay: in the worst case I have to look at every element. The inner loop is the suspect. What is it doing? For a fixed `nums[i]`, it walks the rest of the array looking for a partner. But I already know exactly which partner I want: it's `target - nums[i]`. So the inner loop isn't exploring anything. It is a search for one known value, done by scanning."

> "So the question becomes: what would let me find a known value faster than a scan? Two things come to mind. If the values were sorted, I could binary search, or walk two pointers in from the ends. Or I could keep the values in a hash table and ask 'is this value here?' directly. I'm not sure yet which is better here, and each has a complication: sorting loses the original positions, which are what I have to return, and a hash set tells me a value exists but not where. Let me follow the sorting idea first, since it needs no new idea, and see what it costs."

### Approach 2: Sort, then two pointers

#### What I say out loud

> "Suppose the values were in sorted order. I put one pointer on the smallest and one on the largest and add them. If the sum is too small, the smallest value is no use to anyone: I just paired it with the largest value available and still fell short. So I drop it and move the left pointer right. If the sum is too big, the same argument drops the largest. Every step removes one element for good, so the scan is linear."

> "Now the complication: positions. If I sort `nums` itself, index 0 no longer means what it meant in the input. So I won't sort the values. I'll sort an array of positions, ordered by the value at each position. That keeps the original indices, but it costs O(n) extra memory, and the sort makes the whole thing n log n."

#### Intuition

In sorted order, the sum of the two ends tells you which end is useless. If `smallest + largest` is below the target, the smallest cannot reach the target with any remaining partner, because every other partner is at most the largest. If the sum is above the target, the largest is useless for the mirror reason. This is the converging pair from [[a2-two-pointers|Two Pointers]].

#### Algorithm

1. Build `order = [0, 1, …, n − 1]`.
2. Sort `order` so that `nums[order[0]] ≤ nums[order[1]] ≤ …` (a comparator sort, see [[a3-comparator-sorting|Comparator-Based Sorting]]).
3. Set `left = 0`, `right = n − 1`.
4. While `left < right`: compute `sum = nums[order[left]] + nums[order[right]]`.
5. If `sum == target`, return `[order[left], order[right]]`.
6. If `sum < target`, do `left++`; otherwise do `right--`.

#### Why it is correct

The invariant: **if a valid pair exists, both of its elements are still between `left` and `right`.**

- It holds at the start, because the window is the whole array.
- Each step keeps it. When the sum is too small, the element at `left` cannot be in any valid pair inside the window (its best possible partner, the one at `right`, was not enough), so removing it loses nothing. The same reasoning removes `right` when the sum is too big.
- So the window can only close in on the valid pair, never step past it, and since one exists the loop must reach it.
- It returns only valid answers: it returns only when the sum equals the target, and `left < right` means two different entries of `order`, which are two different original indices.

#### Dry run

`nums = [5, 1, 8, 3]`, `target = 11`. Sorted by value the numbers are 1, 3, 5, 8, which came from indices 1, 3, 0, 2. So `order = [1, 3, 0, 2]`.

| left | right | Values | Sum | Action |
|---|---|---|---|---|
| 0 | 3 | 1 + 8 | 9 | 9 < 11, so `left++` |
| 1 | 3 | 3 + 8 | 11 | match, return `[order[1], order[3]]` = `[3, 2]` |

`[3, 2]` is the same pair as `[2, 3]`; the order of the two indices does not matter.

#### Java code

```java title="Approach 2: sort indices + two pointers"
import java.util.Arrays;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        int n = nums.length;
        Integer[] order = new Integer[n];
        for (int i = 0; i < n; i++) {
            order[i] = i;
        }
        // Sort positions by the value stored there; nums itself stays untouched.
        Arrays.sort(order, (a, b) -> Integer.compare(nums[a], nums[b]));

        int left = 0;
        int right = n - 1;
        while (left < right) {
            int sum = nums[order[left]] + nums[order[right]];
            if (sum == target) {
                return new int[] {order[left], order[right]};
            }
            if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
        throw new IllegalArgumentException("No two numbers add up to the target");
    }
}
```

`order` is an `Integer[]` rather than an `int[]` because `Arrays.sort` accepts a comparator only for object arrays. `Integer.compare` is used instead of `nums[a] - nums[b]`, because that subtraction can overflow when one value is near 10^9 and the other near −10^9.

#### Time complexity

**O(n log n), in the worst case too.** Three parts: building `order` is n steps; the sort makes on the order of n log n comparisons, each constant time (Java's object sort is a merge sort variant, which stays at n log n in the worst case); the scan is at most n − 1 steps, because every iteration moves exactly one pointer one step inward and the pointers start n − 1 apart. The sort dominates.

#### Space complexity

**O(n) auxiliary space in this version**, and the amount depends on how you sort and what you must return:

- Here: the `order` array holds n boxed integers, and Java's object sort may use up to n / 2 temporary slots. O(n).
- If the problem wanted the two *values* and allowed reordering `nums`, you could sort the primitive array in place and need only the sort's recursion stack, O(log n).
- If the input is already sorted, no sort is needed and the two pointers use O(1).

#### The bridge to the next approach

> "So sorting gets me to n log n, and to keep the indices I'm paying O(n) memory anyway. Let me go back to the other option. I only ever ask one question: 'is this exact value present?' That's not a question about order at all, so sorting does more work than I need. A hash set answers it in constant time on average."

> "The gap I noticed earlier was that a set doesn't tell me where the value is. But that's easy to close: instead of a set, I use a map from value to index. It stores exactly the one extra fact I need. Memory is O(n), the same as the sorting version, and the log factor disappears. I think this is better on every count for this problem. Let me check it against the awkward case, a number that is half the target, before I commit to it."

### Alternative: sort, then binary search for each complement

A variant of Approach 2: sort the positions by value as before, then for each element [[a3-binary-search|binary search]] the part to its right for `target - value`. That is n searches of O(log n) each: O(n log n) time and O(n) auxiliary space, the same as two pointers.

It has no advantage here (same complexity, more code, more chances for an off-by-one in the search bounds). I mention it in one sentence to show I see it, and I do not code it. It is the right tool only when the data is already sorted and you look up a few values rather than all of them.

### Approach 3: Hash map, two passes

#### What I say out loud

> "First version of the hash idea: put every value into a map from value to index. Then go through the array again, and for each element ask the map for its complement, `target - nums[i]`. If the map has it, that's my pair."

> "Let me test that on the case I was worried about before trusting it. Target 8, array `[4, 6, 2]`. At the 4, I ask the map for 4, and it says index 0, which is the element I'm standing on. That would return `[0, 0]`, which is wrong. So I need a guard: the index from the map must be different from `i`."

> "And duplicates: with `[4, 4]` the second 4 overwrites the first in the map, so the map says 4 is at index 1. When I'm at index 0 and ask for 4, I get 1, which is a different index. Good, that still works."

#### Intuition

A [[a1-hashmap|HashMap]] turns "where is value x?" from a scan into a direct lookup. Build the index of all values once, then let each element ask for its partner.

#### Algorithm

1. Create a map `indexOf` from value to index.
2. First pass: for every `i`, put `nums[i] → i`. A repeated value overwrites the earlier index with the later one.
3. Second pass: for every `i`, look up `j = indexOf.get(target - nums[i])`.
4. If `j` exists and `j != i`, return `[i, j]`.

#### Why it is correct

After the first pass, the map holds every value in the array, each with the **last** index where it occurs.

- **It returns only valid answers.** A returned `j` came from the map under the key `target - nums[i]`, so `nums[i] + nums[j]` equals the target, and the guard ensures `j != i`.
- **It cannot miss the answer.** Call the answer's indices p and q, with p before q. When the second pass reaches p, it asks for the value `nums[q]`, which is certainly in the map. Could the map return p itself and trip the guard? Only if `nums[q]` equals `nums[p]`, and in that case the last index holding that value is at least q, not p. So the lookup returns a different index and the method returns.

#### Dry run

`nums = [4, 6, 2]`, `target = 8` (the example with the self-pairing trap).

After pass 1: `indexOf = {4 → 0, 6 → 1, 2 → 2}`

| i | nums[i] | Complement needed | Map says | Action |
|---|---|---|---|---|
| 0 | 4 | 4 | index 0 | same index as `i`, skip |
| 1 | 6 | 2 | index 2 | different index, return `[1, 2]` |

#### Java code

```java title="Approach 3: hash map, two passes"
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> indexOf = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            indexOf.put(nums[i], i);
        }
        for (int i = 0; i < nums.length; i++) {
            Integer j = indexOf.get(target - nums[i]);
            if (j != null && j != i) {
                return new int[] {i, j};
            }
        }
        throw new IllegalArgumentException("No two numbers add up to the target");
    }
}
```

#### Time complexity

**O(n) expected time.** The work is n `put` calls plus at most n `get` calls. Each one hashes the key and goes straight to one bucket, which takes constant time on average when keys spread evenly over the buckets. That average is an expectation, not a guarantee: see Approach 4 for the worst case, which is the same for both hash map versions.

#### Space complexity

**O(n) auxiliary space**: the map holds one entry per distinct value, up to n entries. The input is not counted and not modified. The result is constant size. No recursion.

#### The bridge to the next approach

> "This is linear, so I've already removed the bottleneck. Two things still bother me a little. I walk the array twice, and that `j != i` guard exists only because the map already contains the element I'm standing on."

> "What if it didn't? Suppose I put an element into the map only after I've finished with it. Then at index i the map holds only earlier elements, and an element can never find itself. Do I lose any pairs that way? Let me think. Every pair has an earlier element and a later one. When I reach the later one, the earlier one is already in the map. So each pair still gets its chance, exactly once. That means one pass is enough, and the guard disappears."

### Approach 4: Hash map, one pass (recommended)

#### What I say out loud

> "Here's the plan. I walk the array once and keep a map of the values I've already passed, each with its index. At each element I compute its complement and ask the map whether I've seen it. If yes, I return that earlier index together with the current one. If no, I store the current value and move on."

> "Before I write it, let me say why it works. The map only ever contains elements from earlier positions, because I look up first and insert afterwards. So whatever I find is at a different index: I can never use the same element twice. And I can't miss the answer, because when I arrive at the later element of the answer pair, the earlier one is already in the map waiting."

> "The cost is one pass with a constant amount of expected work per element, and up to n entries in the map. I'm happy with that; let me code it."

#### Intuition

For each element there is exactly one value that completes the pair. Instead of searching ahead for it, remember everything behind you and look back in constant time. Each pair is examined exactly once, at the moment its later element arrives. This is the complement-lookup pattern from [[a2-hashing|Hashing]].

#### Algorithm

1. Create an empty map `seen` from value to index.
2. For each index `i` from 0 to n − 1:
3. Compute `complement = target - nums[i]`.
4. If `seen` contains `complement` at index `j`, return `[j, i]`.
5. Otherwise put `nums[i] → i` into `seen`.

#### Why it is correct

**The invariant:** before processing index `i`, the HashMap contains exactly the values encountered at indices earlier than `i`, along with their corresponding indices. (If a value occurred more than once, the map keeps its most recent earlier index.)

It is true before the first iteration, because the map is empty and there are no earlier indices. Each iteration that does not return ends by inserting `nums[i]`, which makes it true for `i + 1`.

From that one sentence, everything else follows:

- **The same element is never used twice.** The lookup happens before the insert. So at the moment of the lookup, `nums[i]` itself is not in the map; only earlier elements are. Any index `j` the map returns satisfies `j < i`, so `j` and `i` are different positions. This holds even when the complement equals the current number: a lone 4 with target 8 finds nothing, and a second 4 finds the first one, which is a legitimately different element.
- **Every returned pair is valid.** `j` was stored under the key `target - nums[i]`, so `nums[j] + nums[i]` equals the target.
- **The answer cannot be missed.** Call the answer's indices p and q with p before q. The loop does not return before q (any earlier return would be a second valid pair, and there is only one). When it reaches q, the invariant says the value `nums[p]` is in the map, so the lookup succeeds.

**The 25-second version to say to the interviewer:**

> "Before I process index i, the map holds exactly the values from earlier indices, each with its index. I look up the complement before I insert the current element, so anything I find sits at an earlier index, and I can never pair an element with itself. And I can't miss the answer: the pair has an earlier and a later element, and by the time I reach the later one, the earlier one is already in the map."

#### Dry run

`nums = [5, 1, 8, 3]`, `target = 11`

| i | nums[i] | complement | `seen` before this step | Action |
|---|---|---|---|---|
| 0 | 5 | 6 | `{}` | 6 not seen, insert `5 → 0` |
| 1 | 1 | 10 | `{5 → 0}` | 10 not seen, insert `1 → 1` |
| 2 | 8 | 3 | `{5 → 0, 1 → 1}` | 3 not seen, insert `8 → 2` |
| 3 | 3 | 8 | `{5 → 0, 1 → 1, 8 → 2}` | 8 seen at index 2, return `[2, 3]` |

The "`seen` before this step" column is the invariant made visible: at row `i` it lists exactly the values from indices 0 to i − 1.

#### Java code

```java title="Approach 4: hash map, one pass (recommended)"
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>(); // value -> an earlier index holding it
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            Integer j = seen.get(complement);
            if (j != null) {
                return new int[] {j, i};
            }
            seen.put(nums[i], i); // insert only after the lookup, so an element never matches itself
        }
        throw new IllegalArgumentException("No two numbers add up to the target");
    }
}
```

#### Time complexity

**O(n) expected time; not O(n) in the worst case.** Here n is the length of `nums`.

- **Where the n comes from:** the loop runs at most n times, and each iteration does one subtraction, one `get` and at most one `put`.
- **Why each map operation is constant on average:** the map hashes the key, jumps to one bucket and compares against the few entries stored there. With keys spread evenly, a bucket holds a constant number of entries on average. `put` sometimes has to grow the table and rehash everything, but the table doubles each time, so the total rehashing work over n inserts is proportional to n: constant per insert when averaged (amortized).
- **Worst case:** if many keys fall into the same bucket, each operation has to search that bucket. With linked-list buckets that is O(n) per operation and O(n²) overall. Modern Java implementations of `HashMap` can convert a heavily collided bucket into a balanced tree. For comparable keys such as `Integer`, that limits a collision-heavy lookup to about O(log n), which would make this algorithm O(n log n) at worst. That is how current implementations behave, not something the `HashMap` API promises for every key type and every implementation.

So the precise statement is: O(n) expected time, assuming hash codes spread well; O(n²) worst case for hash tables in general; about O(n log n) worst case with current Java tree buckets and `Integer` keys.

#### Space complexity

**O(n) auxiliary space.** If the answer involves the last element, the map holds the n − 1 values before it. Each entry stores a boxed `Integer` key and value plus the map's own node, so the constant is several times larger than a plain array. The input array is not counted and not modified; the result is two integers; there is no recursion.

This is a deliberate trade: O(n) memory buys the drop from O(n²) to O(n) expected time.

## 5. Comparison table

n = length of `nums`. "Expected" means averaged over the behaviour of the hash function; for the approaches that do not hash, expected and worst case are the same.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Brute force | O(n²) | O(n²) | O(1) |
| 2. Sort indices + two pointers | O(n log n) | O(n log n) | O(n) here; O(log n) if sorting in place is allowed; O(1) if already sorted |
| Alt. Sort + binary search | O(n log n) | O(n log n) | Same as approach 2 |
| 3. Hash map, two passes | O(n) | O(n²) in general; about O(n log n) with current Java tree buckets and `Integer` keys (not an API guarantee) | O(n) |
| 4. Hash map, one pass | O(n) | O(n²) in general; about O(n log n) with current Java tree buckets and `Integer` keys (not an API guarantee) | O(n) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Brute force | Correct by inspection, since it checks every pair; no extra memory; two minutes to write | Quadratic | As the stated baseline, or when n is tiny and memory is the hard limit |
| 2. Sort indices + two pointers | Guaranteed bound, no hashing; extends naturally to 3Sum | Slower than hashing; index bookkeeping is easy to get wrong | Input already sorted, values rather than indices wanted, or a worst-case guarantee is required |
| Alt. Sort + binary search | Works on sorted data with random access | Same cost as two pointers, more code | Rarely: a few lookups in data that is already sorted |
| 3. Hash map, two passes | Linear; easy to explain as "index everything, then query" | Two passes; needs the `j != i` guard | If this is the version you derived, it is a fine answer; mention the one-pass refinement |
| 4. Hash map, one pass | Linear, shortest code, no guard needed, works on a stream | O(n) memory; expected rather than guaranteed time | The default answer for unsorted input |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** the one-pass hash map (Approach 4).

**Is it theoretically optimal?** In time, yes, in expectation. In the worst case, a correct algorithm must inspect essentially every element: an element that has not been examined could still be part of the answer. So the problem has an Ω(n) worst-case time lower bound, and the one-pass solution's O(n) expected time matches it. In space it is not minimal: O(1) is achievable, but only by going back to O(n²) time. With unsorted input and original indices required, linear time costs linear memory with the standard tools.

**Why it is the preferred interview answer, even though others exist.** Usually the fastest solution is also the most fragile one. Here it is the opposite: the one-pass version has the best time bound, the least code, and the fewest places for a bug, because its structure makes the self-pairing mistake impossible instead of guarding against it. Speed, simplicity and low implementation risk all point the same way, which is rare.

**When a different solution is preferable in practice:**

- The input is already sorted: two pointers, O(1) space.
- Memory is the binding constraint, or you need a guaranteed worst case (for example, input chosen by an adversary): sort and use two pointers.
- The array has a handful of elements: brute force is the fastest in real time, because it allocates nothing and hashes nothing.

**When to stop:**

- Stop improving the complexity once you have O(n) expected time and can say why Ω(n) is a worst-case lower bound. Say that sentence, then spend your time on testing.
- Do not chase O(1) space unprompted. Offer the trade-off in one sentence and let the interviewer decide whether to go there.
- Do not micro-optimize: pre-sizing the map or avoiding boxing changes constants, not the answer. Mention it only if asked about performance.
- Two passes versus one pass is not a complexity improvement. If you derived the two-pass version and it is correct, that is a complete answer; present the single pass as a refinement, not as a correction.

## 7. Interview script: code it and test it

### What I say while coding

> "I'll write the one-pass hash map version. The signature is `int[] twoSum(int[] nums, int target)`."

> "The map goes from value to index, because the value is what I look up and the index is what I have to return. I'll call it `seen`, because of the invariant: before I process index i, it contains the values from indices before i."

> "Inside the loop I name what I'm looking for: `complement = target - nums[i]`. We established that this fits in an `int`."

> "I call `get` once and test for `null`, instead of `containsKey` followed by `get`. Same result, one lookup instead of two."

> "Lookup first, then insert. That order is what keeps the invariant."

> "After the loop: the problem says I can't get here. I'll throw rather than return a made-up pair, so a broken promise is visible."

No helper method is needed. It is worth saying so: "This is one loop; a helper would only hide the logic."

### Testing out loud

I trace the code as written, not my memory of the idea. This is the routine from [[a14-manual-testing|Manual Testing]].

**Normal case:** `nums = [5, 1, 8, 3]`, `target = 11`. Three misses fill `seen` with `{5 → 0, 1 → 1, 8 → 2}`; at `i = 3` the complement 8 is found at index 2. Returns `[2, 3]`. Correct.

**Smallest input, equal values:** `nums = [4, 4]`, `target = 8`. At `i = 0`: complement 4, `seen` is empty, insert `4 → 0`. At `i = 1`: complement 4, found at index 0, return `[0, 1]`. Correct, with no special handling for duplicates.

**Half the target, appearing once:** `nums = [4, 6, 2]`, `target = 8`. At `i = 0`: complement 4, `seen` is empty, so the 4 does not match itself; insert `4 → 0`. At `i = 1`: complement 2, not seen, insert `6 → 1`. At `i = 2`: complement 6, found at index 1, return `[1, 2]`. Correct.

**Negative numbers:** `nums = [-3, 7, 1]`, `target = 4`. At `i = 0`: complement is 4 − (−3) = 7, not seen, insert `-3 → 0`. At `i = 1`: complement is 4 − 7 = −3, found at index 0, return `[0, 1]`. Correct.

**Zeros, answer at the end:** `nums = [0, 5, 0]`, `target = 0`. At `i = 0`: complement 0, not seen, insert `0 → 0`. At `i = 1`: complement −5, not seen, insert `5 → 1`. At `i = 2`: complement 0, found at index 0, return `[0, 2]`. Correct, and the loop did reach the last element.

## 8. Time plan for the interview

Two Sum is usually a warm-up. The interviewer expects it finished in about ten minutes, which leaves the rest of the session for follow-ups or a second problem.

### Suggested split

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 1–2 min | Restate, ask the questions that change the solution, one example by hand |
| Brute force | about 1 min | Say it and its complexity. Do not code it unless asked |
| Find the bottleneck, derive the better idea | 1–2 min | "The inner loop is a search for a known value", then sorting versus hashing |
| Say why it works | about 30 s | The invariant and the check-then-insert order, before writing code |
| Write the code | 2–3 min | One loop, named variables, no rush |
| Dry run and edge cases | about 2 min | One normal case, then half-the-target and duplicates |
| Complexity and follow-ups | 1–2 min, then as long as the interviewer wants | Expected versus worst case, the space trade-off |

These are guides, not a stopwatch. If the interviewer wants to dig into one phase, follow them.

### Where the time should go

- **Most attention:** the derivation spoken clearly, and code that is right the first time. On an easy problem those are what distinguish candidates; nearly everyone knows the answer.
- **Do not skimp on:** the dry run. Two minutes of tracing catches the insert-before-lookup bug, which is the one that actually costs people this question.
- **Least attention:** brute-force code, and micro-optimizations.
- **Stop optimizing** when you have the one-pass solution and have stated the Ω(n) worst-case lower bound. Section 6 gives the reasons.

### If the better idea does not come

Silence is the only real failure mode. Each of these steps is visible progress:

1. **Say the brute force anyway**, with its complexity. It is a correct fallback you can code if everything else fails.
2. **Name the bottleneck out loud:** "The inner loop does the same kind of search again and again."
3. **Ask the unblocking question:** "At each step, what exactly am I looking for, and do I already know it before I start looking?"
4. **Solve the example by hand and watch yourself.** You do not try pairs. You think "8 needs a 3; is there a 3?" Your own shortcut is the algorithm.
5. **List the tools you know and what each would buy:** sorting gives order, a hash table gives instant membership, two pointers need order.
6. **After about two minutes without the linear idea,** offer to code the n log n version while you keep thinking, and accept a hint without apologizing. [[a14-responding-to-hints|Responding to Interviewer Hints]] and [[a14-deriving-optimization|Deriving Optimized Solution]] cover this in depth.

A sentence that keeps the conversation alive: "I don't see the linear solution yet. What I know is that each element needs one specific partner. Let me think about how to find that partner without scanning."

## 9. Interviewer challenges

These are objections to the solution you just gave. The interviewer is checking whether you understand your own code or are reciting it.

### About the design

#### Why a HashMap instead of a HashSet?

**What they are testing:** whether you chose the data structure from what the problem needs, or from habit.

**How to reason:** separate the question you ask the structure from what you must return. The question is "is the complement present?", and a set can answer that. But the result is an index, so you also need to know where the complement was.

**What I say:** "A set would tell me the complement exists, but I have to return its position, and a set can't tell me that. The map stores exactly that one extra fact. If you only wanted true or false, or the two values, I'd use a HashSet."

**Nuance:** in Java a `HashSet` is built on a `HashMap` internally, so neither is faster. The choice is purely about what information you keep.

#### What happens when the complement equals the current number?

**What they are testing:** the "same element twice" rule, on the one input shape where it bites.

**How to reason:** the complement equals `nums[i]` exactly when the target is twice that number. It is a valid answer only if a second copy exists at another index. So ask: at the moment of the lookup, what is in the map? Only earlier elements.

**What I say:** "That's a number that is exactly half the target, like 4 with target 8. Because I look up before I insert, the map holds only earlier elements. A lone 4 finds nothing and gets stored. If a second 4 comes later, it finds the first one at a different index, which is a correct answer. So there's no special case."

**Nuance:** the two-pass version does need the explicit `j != i` check, because its map already contains every element.

#### Why do you check the map before inserting the current element?

**What they are testing:** whether you understand the invariant, or just remember the order of two lines.

**How to reason:** run the other order on a small case. `[4, 6, 2]`, target 8: insert `4 → 0`, then look up 4, find index 0, return `[0, 0]`. Wrong. The lookup-then-insert order is what keeps the current element out of the map.

**What I say:** "The order maintains the invariant that the map holds only earlier indices. If I inserted first, the current element would be in the map, and a number that is half the target would match itself."

**Nuance:** inserting first and adding an index check does not rescue it. With `[4, 4]` and target 8, the second 4 overwrites the first one's entry before the lookup, then finds only itself, fails the check, and the real answer is lost.

#### What happens when duplicate values exist?

**What they are testing:** that you know map keys are unique and `put` overwrites, and that you can argue the overwrite is safe instead of hoping it is.

**How to reason:** split into cases. If the two equal values are the answer, the second finds the first before overwriting anything. Otherwise, could a duplicated value be part of the answer with some other partner? No: either copy would pair with that partner, giving two valid pairs, and the problem guarantees one.

**What I say:** "Keys are unique, so a repeated value overwrites the stored index, but only after I've checked for a match. If the two equal values are the answer, the second one finds the first before it overwrites. If they aren't, that value can't be in the answer at all, because both copies would pair with the same partner and there would be two solutions. So the overwrite never loses anything I need."

**Nuance:** this argument uses the uniqueness guarantee. If all pairs were wanted, the overwrite would lose information and the map would need a list of indices or a count per value. `putIfAbsent` keeps the earliest index instead of the latest.

### About complexity

#### Can HashMap operations really be considered O(1)?

**What they are testing:** whether you say "O(1)" as a fact or understand it as an average.

**How to reason:** think about what a lookup physically does: hash the key, go to one bucket, compare with the entries there. That is constant only if buckets stay small, which depends on the keys spreading out. Inserts also sometimes resize the table.

**What I say:** "O(1) on average, not guaranteed. A lookup hashes the key, jumps to one bucket and compares against the few entries there, which is constant as long as keys spread evenly. An insert occasionally triggers a resize, but the table doubles each time, so averaged over n inserts that's still constant each. So I'd describe the whole algorithm as O(n) expected time."

**Nuance:** the O(1) average assumes hash codes spread well, and collisions can be constructed deliberately. In current Java implementations, integer keys that are multiples of 65537 all land in the same bucket for tables of up to 65,536 buckets. Those implementations respond by converting a heavily collided bucket into a balanced tree. That is implementation behaviour; the API documentation promises constant time only under a good distribution of hash codes.

#### What is the worst-case time complexity?

**What they are testing:** follow-through on the previous question, and honesty about the limits of your solution.

**How to reason:** the worst case is every key in one bucket. Then ask what a bucket is. A linked list means a linear search per operation. Java's tree buckets mean a logarithmic one.

**What I say:** "If every key collided, a hash table with linked-list buckets would search linearly on each lookup, so O(n²) overall, no better than brute force. Modern Java softens that: a heavily collided bucket can be converted into a balanced tree, and for comparable keys like Integer that keeps a lookup to about O(log n), so roughly O(n log n) in total. I wouldn't call that a guarantee, because it's implementation behaviour and not part of the HashMap contract. With ordinary integer input I expect O(n). If you needed a hard bound, I'd switch to sorting and two pointers."

**Nuance:** the tree buckets only help this much when keys are comparable with each other, which `Integer` keys are; the Java API does not promise a worst-case bound for every key type and implementation. Separately from hashing, the loop itself does the most iterations when the answer uses the last element.

#### Can this problem be solved in O(1) extra space?

**What they are testing:** whether you understand the trade-off you made, and whether you overpromise.

**How to reason:** ask what the memory is for. It remembers what has been seen. Without it, you must re-scan (brute force) or impose order (sorting), and sorting in place destroys the indices you have to return.

**What I say:** "Yes, but not in linear time. Brute force is O(1) space and O(n²) time. If I were allowed to reorder the array and return the two values instead of indices, I could sort in place and use two pointers in O(n log n). For this problem, unsorted input and original indices, I'd keep the O(n) map. That memory is the price of linear time."

**Nuance:** Java's sort for primitive arrays uses a recursion stack of O(log n), so "in place" is not strictly O(1); heap sort would be. The two-element result does not count as extra space.

#### Is O(n) time optimal?

**What they are testing:** whether you can argue a lower bound, and so whether you know when to stop.

**How to reason:** imagine an algorithm that, on some input, leaves elements unexamined. One of those could still be part of the answer, and the algorithm cannot know. So in the worst case essentially every element has to be inspected, which is already order n. (Not literally every element on every input: the loop can return early, and with exactly two elements the answer is known without reading either.)

**What I say:** "Yes. In the worst case a correct algorithm has to inspect essentially every element, because one it hasn't examined could still be part of the answer. That gives an Ω(n) worst-case lower bound, and the one-pass solution matches it in expectation. All that's left is constant factors."

**Nuance:** the bound is matched only thanks to hashing, which uses a value as an address. An algorithm restricted to comparing values is expected to need about n log n for problems of this kind, which is what the sorting approach achieves.

### About changed inputs

#### What changes if the input is sorted?

**What they are testing:** whether you adapt to new structure in the input or reapply a memorized answer.

**How to reason:** sorted order gives direction. Moving the left pointer can only increase the sum; moving the right pointer can only decrease it. That replaces memory with order.

**What I say:** "Then I'd drop the map and use two pointers from both ends. Sum too small, move the left pointer up; too big, move the right one down. That's O(n) time and O(1) extra space, and since the array is already in order the pointers are the indices. The hash map would still work, but it would spend O(n) memory for nothing."

**Nuance:** that version is [[nc-two-sum-ii-input-array-is-sorted|Two Sum II]], which uses 1-based indices and requires constant extra space. Binary searching each complement also works on sorted input but is O(n log n).

#### What if there are multiple valid answers?

**What they are testing:** whether you respond to ambiguity by asking for the contract, and whether you know where your code relied on the guarantee.

**How to reason:** first pin down what should be returned: any pair, all pairs, or a count. Then check what the current code does, and which arguments used uniqueness (the overwrite argument did).

**What I say:** "First I'd ask what you want back: any one pair, all of them, or just how many. As written, my code returns the first pair it completes, the one whose later index is smallest, which is fine for 'any'. For a count I'd store value to frequency and add the complement's frequency at each step, still O(n). For all index pairs I'd map each value to a list of its indices, and I'd warn that the output alone can be quadratic, for example when every element is equal."

**Nuance:** a pair count can reach n(n − 1) / 2, which exceeds the `int` range once n passes about 65,000, so use `long` for larger inputs.

## 10. Follow-up questions the interviewer might ask

These change the problem itself, after your solution is accepted.

**"What if the numbers arrive as a stream and I call `find(target)` many times?"**
Design a class around a map from value to count. `add(x)` is O(1) expected. `find(target)` walks the distinct values and checks for each `x` whether `target - x` is present, requiring a count of at least 2 when `target - x == x`: O(d) expected for d distinct values. If `find` is called far more often than `add`, precompute all pair sums into a set instead: `add` becomes O(n), `find` O(1) expected, space O(n²).

**"What if the data doesn't fit in memory?"**
One option is to split the values into k files by a hash of `min(x, target - x)`, storing each value with its original index. A value and its complement produce the same key, so they always land in the same file, and each file can be solved separately with the hash map approach. Under a hash function that spreads keys well, each file is expected to hold about n / k values, for O(n) expected total time. That is an expectation, not a guarantee: partitions can be uneven. A file that is still too large is partitioned again with a different hash function. If the skew comes from one value repeated very many times, rehashing cannot split it, but that case needs almost no memory: a single key covers only the two values x and `target - x`, so one sequential read that remembers a position of each is enough. The strategy that avoids hashing assumptions altogether is an external merge sort followed by two pointers reading from both ends: O(n log n) time with predictable memory use.

**"What about three numbers, or k numbers?"**
Sort, fix one element, and run two pointers on the rest: O(n²) for [[nc-3sum|3Sum]]. Each extra number adds one more outer loop, so k numbers cost O(n^(k−1)), as in [[nc-4sum|4Sum]]. Sorting also makes it easy to skip duplicate answers.

**"What if there might be no answer?"**
Agree on the contract before changing code: return an empty array, return `null`, or throw. The loop already reaches the final line in that case, so only that line changes. Complexity is unchanged; the no-answer case is simply the full n iterations.

**"What if the values could use the full `int` range?"**
Then `target - nums[i]` can overflow and wrap around to a wrong complement. Compute it as a `long` and use a `Map<Long, Integer>`. Same complexity.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

These happen before any code is written. They are harder to notice than bugs, because the code that follows can look perfectly reasonable.

- **Announcing "hash map" immediately.** The answer is right, but the interviewer learns nothing about how you think, and the first variation (sorted input, three numbers) will expose it. Say the brute force, name the bottleneck, then derive.
- **Reaching for two pointers on unsorted input.** Two pointers work because order tells you which end to discard. Without sorted data there is no such reason. Ask whether the input is sorted; do not assume it.
- **Sorting, then forgetting that the indices are gone.** Sorting is a fine idea, but the problem returns positions in the original array. Notice this before coding, not after the first failed test.
- **Choosing a HashSet.** It answers "is the complement there?" but not "where?". Decide the data structure from what you must return.
- **Pruning with `nums[i] > target`.** Skipping "numbers that are too big" assumes non-negative values. With negatives, `[-3, 7]` reaches 4. This is an invented constraint.
- **Believing duplicates break the map.** "Keys are unique, so `[4, 4]` fails" leads to needless structures such as a map from value to a list of indices. Reason through the cases instead (section 9).
- **Claiming O(1) lookups as a guarantee**, or chasing O(1) space when nobody asked. Both show a missing sense of what the trade-off is.

### Implementation mistakes

> [!MISTAKE] Inserting before looking up
> Writing `seen.put(nums[i], i)` above the lookup makes `[4, 6, 2]` with target 8 return `[0, 0]`. Keep the order "look up, then insert", and say the invariant while you type it.

> [!MISTAKE] Mapping index to value
> `map.put(i, nums[i])` compiles and looks reasonable, but a map can only be searched by key. You search by value and return an index, so it must be value → index.

- **Off-by-one in the brute force.** The inner loop must start at `j = i + 1`. Starting at `i` pairs an element with itself; starting at `0` tests every pair twice and still pairs an element with itself.
- **Forgetting `j != i` in the two-pass version.** Its map contains the current element, so the check is required there.
- **Returning positions from a sorted copy.** Those are positions in sorted order, not original indices. Sort an index array, or do not sort.
- **Comparing boxed integers with `==`.** `j != i` is safe above because `i` is a primitive `int`, so Java unboxes `j`. Comparing two `Integer` objects with `==` compares references and fails for values outside −128 to 127. Use `.equals`, or unbox first.
- **`nums[a] - nums[b]` as a comparator.** It overflows for values of opposite sign near 10^9. Use `Integer.compare`.
- **Returning values instead of indices, or 1-based indices.** Re-read the output format before you write the return statement.

## 12. Pattern recognition

**The pattern:** complement lookup with a hash map. For each element, compute the single partner that would complete the answer, and ask a hash map whether that partner has already been seen.

**Signals in the problem statement:**

- "Two elements" (a pair) that must satisfy an exact equation: a sum, difference or XOR equal to a target.
- The input is **unsorted** and you must return **indices**, so sorting would cost extra bookkeeping.
- The obvious solution is a nested loop whose inner loop searches for one specific value.
- A follow-up asks for better than O(n²).

**Related problems in this list:**

- [[nc-two-sum-ii-input-array-is-sorted|Two Sum II - Input Array Is Sorted]]: the same question on sorted input, where two pointers win with O(1) space.
- [[nc-3sum|3Sum]]: fix one element, then solve Two Sum on the rest.
- [[nc-4sum|4Sum]]: two fixed elements plus Two Sum.
- [[nc-contains-duplicate|Contains Duplicate]]: the same "have I seen this before?" lookup, with a set instead of a map.
- [[nc-subarray-sum-equals-k|Subarray Sum Equals K]]: complement lookup applied to prefix sums instead of raw values.
- [[cses-sum-of-two-values|Sum of Two Values]] (CSES): the same problem, but it prints 1-based positions and may have no answer.

**Takeaway:** if you see "find two items in an unsorted collection that combine to a target", think "for each item, look up the partner it needs in a hash map of what I've already seen".

## 13. 60-second revision card

**Key insight:** each element needs exactly one partner, `target - nums[i]`. Remember what you have passed in a map (value → index) and look the partner up instead of scanning for it.

**Invariant:** before index `i` is processed, the map holds exactly the values from indices before `i`. Look up first, insert second.

**Complexity:** O(n) expected time, O(n) auxiliary space, one pass. The worst case is O(n²) for hash tables in general; current Java tree buckets keep it near O(n log n) for `Integer` keys, but the API does not guarantee that. Linear is the best possible order: in the worst case essentially every element must be inspected, an Ω(n) lower bound.

**Code skeleton:**

```java title="Two Sum in six lines" fragment="public int[] twoSum(int[] nums, int target)"
Map<Integer, Integer> seen = new HashMap<>();   // value -> earlier index
for (int i = 0; i < nums.length; i++) {
    Integer j = seen.get(target - nums[i]);     // 1. look for the partner
    if (j != null) return new int[] {j, i};
    seen.put(nums[i], i);                       // 2. only then remember this element
}
```

**Main traps:**

- Insert before lookup: a number that is half the target pairs with itself.
- The map is value → index, not index → value. A set is not enough, because you return positions.
- Do not sort `nums` in place: sorting loses the indices.
- Negatives exist: never skip a number for being larger than the target.
- "O(1) lookup" means expected, not guaranteed.

**What to say in one breath:** "Brute force is O(n²) because the inner loop searches for a known value. A hash map makes that search constant on average, so one pass gives O(n) expected time for O(n) space. I look up before I insert, so the map holds only earlier elements and nothing pairs with itself. If the input were sorted, I'd use two pointers for O(1) space."
