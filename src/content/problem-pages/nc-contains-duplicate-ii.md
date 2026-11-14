---
problemId: nc-contains-duplicate-ii
title: Contains Duplicate II
source: neetcode
sourceUrl: https://leetcode.com/problems/contains-duplicate-ii/
difficulty: easy
patterns: [sliding-window, hashing]
relatedLessons: [a2-sliding-window, a2-hashing, a14-clarifying-requirements, a14-edge-cases]
companies: []
timeToSolve: 10
---

## 1. Problem restatement

You get an integer array `nums` and a non-negative integer `k`. Return `true` if some value appears at two different positions `i` and `j` that are at most `k` apart, that is `nums[i] == nums[j]` and `|i − j| ≤ k`. Otherwise return `false`. Equal values that are far apart do not count.

**Example 1**

- Input: `nums = [5, 8, 5, 2]`, `k = 2`
- Output: `true`
- Why: the value 5 sits at indices 0 and 2, and 2 − 0 = 2 ≤ k.

**Example 2**

- Input: `nums = [5, 8, 2, 5]`, `k = 2`
- Output: `false`
- Why: the only repeated value, 5, sits at indices 0 and 3, which are 3 apart. That is more than k, and no other value repeats.

**What the problem statement guarantees**

- 1 ≤ `nums.length` ≤ 10^5.
- −10^9 ≤ `nums[i]` ≤ 10^9.
- 0 ≤ `k` ≤ 10^5.
- The two indices must be distinct, and only a boolean is returned.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The difference from the plain "any duplicate?" question is a single number, `k`, and the interview is about how that number changes what you have to remember. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 10 minutes and talk out loud.
2. Write the slowest correct method first and state its cost in terms of both n and k.
3. Ask: for the element I am standing on, which earlier elements could possibly be its partner?
4. Write the code and trace it on both examples, and on `k = 0`.

Open a hint only after two minutes without progress.

> [!HINT] Hint 1: a small nudge
> For the element at index `i`, only the elements at indices `i − k` to `i − 1` can be its partner. Everything earlier is too far away, now and forever, because indices only grow as you walk forward.

> [!HINT] Hint 2: the kind of tool you need
> You need a fast answer to "is this value among the last k values I passed?" Either remember, for every value, where you saw it most recently, or keep only the last k values in a structure with constant-time membership and evict the oldest as you move.

> [!HINT] Hint 3: almost the whole plan
> Keep a set holding exactly the values at the previous k positions. At each index, first drop the value that just became too far away, then try to insert the current value. If it was already present, two equal values are at most k apart. If you reach the end, return false.

**Check yourself before revealing the walkthrough**

- [ ] I said the brute-force cost in terms of n and k, not just n
- [ ] My code returns `false` for every input when `k = 0`
- [ ] My code returns `true` for `[1, 0, 1, 1]` with `k = 1`
- [ ] I can say how much memory my solution uses when k is small

## 3. Interview script: understand the problem (≈1–2 min)

The trap in this problem is the off-by-one in the distance, so the questions worth asking are about what "at most k apart" means exactly and about the extreme values of `k`.

**Me:** So I need two different indices holding the same value, with the distance between the indices at most `k`. Exactly `k` apart counts?

**Interviewer:** Yes, `abs(i − j) <= k`.

**Me:** And `k` can be 0? Then I need two different indices with distance 0, which is impossible, so the answer is always `false`.

**Interviewer:** Right, `k` is between 0 and 10^5.

**Me:** And `k` can be larger than the array. Then the distance limit never bites and this becomes the plain "is there any duplicate" question. The array has 1 to 10^5 elements, values between −10^9 and 10^9?

**Interviewer:** Yes.

**Me:** Let me try Example 2 by hand: `[5, 8, 2, 5]`, `k = 2`. When I reach the second 5 at index 3, the values within 2 positions behind it are 8 and 2. The earlier 5 is at index 0, 3 back, so it doesn't count. Nothing else repeats, so `false`.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^5 | Checking each element against all others is up to about 5 × 10^9 comparisons, too slow as a final answer. |
| 0 ≤ k ≤ 10^5 | k can be 0 (answer always `false`) or at least n (the limit never applies). The brute force costs about n·min(n, k), so k decides how slow it is. |
| −10^9 ≤ nums[i] ≤ 10^9 | The value range is far wider than n, so an array indexed by value is out; I need hashing. Values are only compared for equality, so nothing can overflow. Index differences are at most 10^5 − 1, which fits in an `int`. |
| Distinct indices, distance ≤ k | An element never pairs with itself. "At most" includes distance exactly k. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Distance exactly k counts | The window of candidate partners for index i is i − k to i − 1 inclusive; this is where the off-by-one lives. |
| Only the boolean is needed | I can stop at the first qualifying pair. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The array is not modified | My solutions only read it, so this costs nothing. |
| O(min(n, k)) or O(n) extra memory is acceptable | Both hashing solutions spend it; without it I am back to the brute force. |

### Edge cases I will keep in mind

- `k = 0`: always `false`, even for `[7, 7]`.
- One element: always `false`.
- `k ≥ n`: the same as the plain duplicate question, `[1, 2, 3, 1]` with `k = 10` is `true`.
- Distance exactly k (`[5, 8, 5, 2]`, `k = 2`) versus k + 1 (`[5, 8, 2, 5]`, `k = 2`).
- A value that repeats far apart and then close, `[1, 0, 1, 1]` with `k = 1`: the nearest earlier copy is the one that matters.

## 4. Think out loud: from first idea to best solution

### Approach 1: Brute force (check the k positions before or after each index)

#### What I say out loud

> "The direct check: for every index i, compare it with the next k positions. That's at most k comparisons per element, so O(n·min(n, k)). With n and k both 10^5 that's about 5 × 10^9 comparisons, too slow, but it's the baseline."

#### Intuition

A qualifying pair is `i < j` with `j − i ≤ k`. For each `i`, its possible partners further to the right are exactly `i + 1` to `i + k`. Checking all of them cannot miss a pair.

#### Algorithm

1. For each `i` from 0 to n − 1, for each `j` from `i + 1` to `min(n − 1, i + k)`:
2. If `nums[i] == nums[j]`, return `true`.
3. Return `false`.

#### Why it is correct

- **It only returns `true` for a valid pair:** `j > i`, so the indices differ, and `j ≤ i + k`, so they are at most k apart.
- **It cannot miss a pair:** any valid pair `i < j` has `j` in the range `i + 1` to `i + k`, and that range is fully scanned for `i`.

#### Dry run

`nums = [5, 8, 2, 5]`, `k = 2`

| i | j range | Comparisons | Equal? |
|---|---|---|---|
| 0 | 1–2 | 5 vs 8, 5 vs 2 | no |
| 1 | 2–3 | 8 vs 2, 8 vs 5 | no |
| 2 | 3–3 | 2 vs 5 | no |
| 3 | empty | none | — |

The pair (0, 3) is never compared because it is 3 apart. Result `false`.

#### Java code

```java title="Approach 1: brute force within distance k"
class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            int last = Math.min(n - 1, i + k); // i + k <= 2 * 10^5, no overflow
            for (int j = i + 1; j <= last; j++) {
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

**O(n·min(n, k)) in the worst case**, where n is `nums.length`. Each `i` does at most min(k, n − 1 − i) comparisons. With no qualifying pair, n = 10^5 and k ≥ n, that is n(n − 1)/2 ≈ 5 × 10^9 comparisons. With small k it is fast: k = 3 gives at most 3n.

#### Space complexity

**O(1) auxiliary space.**

#### The bridge to the next approach

> "When I'm at index j, I'm really asking: did this value appear recently? Scanning the previous k positions to answer that is the waste. If I remember, for each value, the index where I last saw it, I can answer with one lookup."

> "And I only need the last index, not all of them: if the most recent earlier copy is more than k back, every older copy is even further back."

### Approach 2: Hash map from value to last index

#### What I say out loud

> "I walk left to right with a map from each value to the most recent index where I saw it. At index i, if the map has the value and i minus that index is at most k, return true. Either way, I store i as the new last index. One pass, O(n) expected time, O(n) memory for the map."

#### Intuition

For index `j`, the best partner on the left is the nearest earlier equal value, because it gives the smallest distance. The map always holds that nearest earlier index. This is the "seen before, and where?" lookup from [[a2-hashing|Hashing]], the same shape as Two Sum.

#### Algorithm

1. `last = empty map`.
2. For each index `i`: `prev = last.put(nums[i], i)` (which returns the old index, or null).
3. If `prev != null` and `i − prev ≤ k`, return `true`.
4. Return `false`.

#### Why it is correct

**Invariant:** before processing index `i`, `last` maps every value among `nums[0..i−1]` to its largest index below `i`.

- **Only valid pairs:** `prev < i` and `nums[prev] == nums[i]`, and we check the distance.
- **No pair is missed:** if some `p < i` has `nums[p] == nums[i]` and `i − p ≤ k`, then `prev ≥ p`, so `i − prev ≤ i − p ≤ k` and the method returns `true` at `i` (or earlier).
- `put` overwrites the old index, so the invariant holds for `i + 1`.

#### Dry run

`nums = [1, 0, 1, 1]`, `k = 1`

| i | nums[i] | `last` before | prev | i − prev | Action |
|---|---|---|---|---|---|
| 0 | 1 | `{}` | null | — | store 1→0 |
| 1 | 0 | `{1:0}` | null | — | store 0→1 |
| 2 | 1 | `{1:0, 0:1}` | 0 | 2 > 1 | store 1→2 |
| 3 | 1 | `{1:2, 0:1}` | 2 | 1 ≤ 1 | return `true` |

At index 2 the first copy is too far, but overwriting it with index 2 is what lets index 3 succeed.

#### Java code

```java title="Approach 2: value to last index"
import java.util.HashMap;
import java.util.Map;

class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        Map<Integer, Integer> last = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            Integer prev = last.put(nums[i], i); // returns the previous index, or null
            if (prev != null && i - prev <= k) {
                return true;
            }
        }
        return false;
    }
}
```

#### Time complexity

**O(n) expected.** One `put` per element, constant on average assuming hash codes spread well. With heavy collisions a hash table degrades; current Java `HashMap` turns crowded buckets into balanced trees, which for `Integer` keys keeps a lookup to about O(log n), but that is implementation behaviour, not an API guarantee.

#### Space complexity

**O(n) auxiliary space**: the map holds one entry per distinct value seen, up to n, even when k is tiny.

#### The bridge to the next approach

> "The map remembers values from the whole prefix, but anything more than k positions back can never matter again. If I only keep the last k values, memory drops to O(min(n, k)), and I don't need the indices any more: being in the set already means 'within k'."

### Approach 3: Hash set as a sliding window of the last k values (recommended)

#### What I say out loud

> "I keep a set holding exactly the values at the previous k positions. At index i, I first evict `nums[i − k − 1]`, which is now k + 1 back and too far. Then I try to add `nums[i]`; if it's already there, an equal value is within k, so I return true. O(n) expected time, and the set never holds more than k values before an insert."

#### Intuition

The candidates for index `i` form a window of fixed length k that slides one step right each time: one value enters, one leaves. A set models that window, and membership answers the question directly. This is the fixed-size [[a2-sliding-window|sliding window]].

Why the set can hold values rather than counts: if a value were already in the window twice, those two copies would be at most k − 1 apart and the method would have returned earlier. So the values in the window are distinct, and removing `nums[i − k − 1]` removes exactly that one copy.

#### Algorithm

1. `window = empty set`.
2. For each index `i`:
   1. If `i > k`, remove `nums[i − k − 1]`.
   2. If `window.add(nums[i])` returns `false`, return `true`.
3. Return `false`.

#### Why it is correct

**Invariant:** just before the `add` at index `i`, `window` holds exactly the values at indices `max(0, i − k)` to `i − 1`, and they are all distinct.

- At `i = 0` the window is empty. At each step, the removal drops index `i − k − 1` (only once it exists), and the successful `add` brings in index `i`, so the next step starts with indices `i − k + 1` to `i`.
- The values are distinct because a repeat inside the window would have made an earlier `add` fail and returned.
- **Only valid pairs:** `add` fails only if `nums[i]` equals a value at some index in `i − k` to `i − 1`: different index, distance ≤ k.
- **No pair is missed:** for a valid pair `p < j`, `j − p ≤ k`, so `p` is in the window at step `j` and the `add` at `j` fails.

**The 20-second version:**

> "Before each insert, the set is exactly the last k values, all distinct. If inserting the current value fails, its twin is at most k back. Any valid pair has its earlier element inside that window when I reach the later one, so I can't miss it."

#### Dry run

`nums = [5, 8, 2, 5]`, `k = 2`

| i | Evict (i > k?) | `window` before add | add nums[i] | Result |
|---|---|---|---|---|
| 0 | no | `{}` | 5 → true | `{5}` |
| 1 | no | `{5}` | 8 → true | `{5, 8}` |
| 2 | no (2 > 2 is false) | `{5, 8}` | 2 → true | `{5, 8, 2}` |
| 3 | yes, `nums[0] = 5` | `{8, 2}` | 5 → true | `{8, 2, 5}` |

Loop ends, return `false`. On `[5, 8, 5, 2]` with `k = 2`, the add at index 2 finds 5 in `{5, 8}` and returns `true`.

#### Java code

```java title="Approach 3: sliding-window set (recommended)"
import java.util.HashSet;
import java.util.Set;

class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        Set<Integer> window = new HashSet<>(); // values at indices i-k .. i-1
        for (int i = 0; i < nums.length; i++) {
            if (i > k) {
                window.remove(nums[i - k - 1]); // now k + 1 positions back: too far
            }
            if (!window.add(nums[i])) {
                return true;
            }
        }
        return false;
    }
}
```

With `k = 0` the window is emptied before every insert after the first, so every `add` succeeds and the method returns `false`. With `k ≥ n − 1` the removal never runs and this is the plain duplicate check.

#### Time complexity

**O(n) expected.** At most one `remove` and one `add` per element, each constant on average under good hashing, with the same caveats on collisions as Approach 2.

#### Space complexity

**O(min(n, k)) auxiliary space**: the set holds at most k values before an insert and at most min(n, k + 1) after it.

## 5. Comparison table

n = `nums.length`; k as given.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Brute force within k | O(n·min(n, k)) | O(n·min(n, k)) | O(1) |
| 2. Map value → last index | O(n) | O(n²) for hash tables in general; about O(n log n) with Java's tree buckets for `Integer` keys (not guaranteed) | O(n) |
| 3. Sliding-window set | O(n) | same caveat as Approach 2 | O(min(n, k)) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Brute force within k | No memory, correct by inspection | Quadratic when k is large | k is a small constant, or as the baseline |
| 2. Map value → last index | Simple, one lookup, no eviction logic | Memory grows with distinct values even when k is small | When it comes to mind first; it is a fully acceptable answer |
| 3. Sliding-window set | Memory bounded by k; directly models "the last k values" | One more line, with an off-by-one in the eviction index | The default, especially if memory or the window framing is asked about |

## 6. Which solution to give, and when to stop optimizing

**Give Approach 3, the sliding-window set,** or Approach 2 if that is what you think of first. Both are O(n) expected and short. The set wins on memory, O(min(n, k)) instead of O(n), and it is the form that generalizes to "within distance k *and* value difference t" follow-ups. The map wins slightly on implementation risk, since there is no eviction index to get wrong. Mention the other in one sentence.

**Is it optimal?** In time, yes in expectation: when no pair exists, a correct algorithm must in the worst case look at essentially every element (an unread element could equal a neighbour), so there is an Ω(n) worst-case lower bound. **Where to stop:** once you have the window set, its invariant and the expected-time caveat.

## 7. Interview script: code it and test it

### What I say while coding

> "A `HashSet<Integer>` called `window`; the comment says what it holds, values at indices i − k to i − 1."

> "Evict first, then insert. The value leaving is at index i − k − 1, and only once i > k."

> "`add` returning false is the hit, same trick as the plain duplicate problem."

### Testing out loud

**Example 1:** `[5, 8, 5, 2]`, `k = 2`. Adds 5, 8; at i = 2 no eviction, add 5 fails: `true`.

**Example 2:** `[5, 8, 2, 5]`, `k = 2`. At i = 3 evict 5, then add 5 succeeds: `false`. The distance-3 pair is correctly rejected.

**k = 0:** `[7, 7]`. Add 7; at i = 1 evict `nums[0]`, add 7 succeeds: `false`.

**One element:** `[4]`, any k: one add, `false`.

**k ≥ n:** `[1, 2, 3, 1]`, `k = 10`. No evictions, the last add fails: `true`.

**Nearest copy matters:** `[1, 0, 1, 1]`, `k = 1`. i = 2: evict 1, add 1 succeeds, window `{0, 1}`. i = 3: evict 0, add 1 fails: `true`.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | about 1 min | "At most k" inclusive, k = 0, k ≥ n |
| Brute force and the idea | 1–2 min | O(n·min(n, k)); last index map; window set |
| Code | 2 min | The window set |
| Test | 2 min | Both examples, k = 0, `[1, 0, 1, 1]` |
| Complexity | 1 min | Expected time, O(min(n, k)) memory |

Most of the value is in getting the eviction index right and saying why. If the window version keeps going off by one, switch to the map: it has no eviction and is just as fast.

## 9. Interviewer challenges

### About correctness

#### Why remove `nums[i − k − 1]` and not `nums[i − k]`?

**What they are testing:** whether you can derive the window bounds rather than guess them.

**How to reason:** at index i the allowed partners are i − k to i − 1. Index i − k is exactly k away and must stay. The first index that is too far is i − k − 1.

**What I say:** "Distance exactly k is allowed, so index i − k stays in the window. Index i − k − 1 is k + 1 back, which is the one to drop. If I removed `nums[i − k]` before the insert, `[1, 0, 1]` with `k = 2` would return false, but the two 1s are exactly 2 apart."

**Nuance:** some write the eviction after the insert with the condition `window.size() > k`. That is also correct; what matters is stating which indices the set holds at the moment of the check.

#### Why is a set enough? Don't you need counts in the window?

**What they are testing:** whether you understand why removal by value is safe.

**How to reason:** removal by value would be wrong if the window could hold two copies of the value being evicted.

**What I say:** "The window never holds two copies: if it did, those two would be at most k − 1 apart and an earlier `add` would have failed and returned. So removing the value removes exactly the copy that left."

**Nuance:** in a problem that does not stop at the first repeat (for example, counting windows with a duplicate), the window would need counts.

### About alternatives

#### Why do you only keep the last index in the map version?

**What they are testing:** whether you can justify discarding information.

**How to reason:** compare an older and a newer copy as partners for the current index.

**What I say:** "The newer copy is always at least as close to the current index as any older one. If the newest is too far, all older ones are too. Keeping only the first index would be a bug: `[1, 0, 1, 1]` with `k = 1` would compare index 3 with index 0 and return false."

**Nuance:** this "dominated information" argument is the same reason the window approach can forget everything more than k back.

## 10. Follow-up questions the interviewer might ask

**"What if k is larger than the array?"**
Nothing changes in the code; evictions never happen and it becomes [[nc-contains-duplicate|Contains Duplicate]]. O(n) expected time, O(n) space.

**"Also require `|nums[i] − nums[j]| ≤ t`."**
That is Contains Duplicate III. Keep the window in a `TreeSet<Long>` and ask for the smallest value ≥ `nums[i] − t`: O(n log min(n, k)) time. A bucket-based variant with bucket width t + 1 gets O(n) expected. Use `long` because `nums[i] − t` can leave the `int` range.

**"Count how many pairs satisfy the condition."**
Now you cannot stop early, and the window may hold repeated values, so keep a map from value to count inside the window. Each new index adds the current count of its value, then increments it; evict by decrementing. O(n) expected time, O(min(n, k)) space. For an all-equal array with k ≥ n the total is n(n − 1)/2 ≈ 5 × 10^9 at n = 10^5, above `Integer.MAX_VALUE`, so it needs a `long`.

**"The values arrive as a stream."**
The window set already works online: it needs only the last k values, so memory is O(min(n, k)) no matter how long the stream is.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Treating "at most k" as "less than k".** Distance exactly k counts; Example 1 depends on it.
- **Forgetting k = 0.** Two distinct indices cannot be 0 apart, so the answer is always `false`, even for `[7, 7]`. A solution that never removes anything when k = 0 gets this wrong.
- **Calling the hashing solutions O(n) without "expected".**

### Implementation mistakes

> [!MISTAKE] Evicting the wrong index
> Writing `if (i >= k) window.remove(nums[i - k]);` before the insert keeps only k − 1 earlier values, so pairs exactly k apart are missed: `[1, 0, 1]` with `k = 2` returns `false` instead of `true`.

- **Storing the first index instead of the latest** (`putIfAbsent`, or `put` only when absent). `[1, 0, 1, 1]` with `k = 1` then returns `false`.
- **Putting the eviction in the wrong order for its index.** Evicting `nums[i − k]` is correct *after* the insert (the set then holds indices i − k + 1 to i for the next step) but wrong *before* it. Pick one order and state which indices the set holds at the moment of the check.

## 12. Pattern recognition

**The pattern:** a fixed-size sliding window maintained in a hash set, or "remember the last position of each value".

**Signals in the problem statement:**

- A condition on two indices that must be within a fixed distance k.
- A membership question ("is this value among the recent ones?") that a set answers.
- Wide value range, so hashing rather than direct indexing.

**Related problems in this list:**

- [[nc-contains-duplicate|Contains Duplicate]]: the same question with no distance limit.
- [[nc-two-sum|Two Sum]]: the value → index map, looking up a complement instead of the same value.
- [[nc-longest-substring-without-repeating-characters|Longest Substring Without Repeating Characters]]: a window that must contain no repeats, with a variable instead of fixed size.
- [[nc-sliding-window-maximum|Sliding Window Maximum]]: another fixed window of size k, maintaining a maximum instead of membership.

**Takeaway:** when only the last k positions can matter, keep exactly those in a structure that answers the question, adding one element and evicting one per step.

## 13. 60-second revision card

**Key insight:** only the previous k values can pair with the current one, so keep exactly those in a set.

**Invariant:** before inserting `nums[i]`, the set holds the distinct values at indices `i − k` to `i − 1`.

**Complexity:** O(n) expected time, O(min(n, k)) auxiliary space. The value → last-index map is also O(n) expected, with O(n) space.

**Code skeleton:**

```java title="Window set"
import java.util.*;

class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        Set<Integer> window = new HashSet<>();
        for (int i = 0; i < nums.length; i++) {
            if (i > k) window.remove(nums[i - k - 1]);   // drop the one k + 1 back
            if (!window.add(nums[i])) return true;        // twin within k
        }
        return false;
    }
}
```

**Main traps:**

- Evicting `nums[i − k]` instead of `nums[i − k − 1]`.
- Keeping the first index instead of the latest in the map version.
- Forgetting that k = 0 always gives `false`.

**What to say in one breath:** "Only the last k values matter, so I keep them in a hash set, evicting the one that falls k + 1 behind. If inserting the current value fails, its twin is within k. O(n) expected time, O(min(n, k)) memory."
