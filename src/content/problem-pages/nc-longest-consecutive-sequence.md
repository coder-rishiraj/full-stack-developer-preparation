---
problemId: nc-longest-consecutive-sequence
title: Longest Consecutive Sequence
source: neetcode
sourceUrl: https://leetcode.com/problems/longest-consecutive-sequence/
difficulty: medium
patterns: [arrays-hashing, hashing]
relatedLessons: [a2-hashing, a1-hashset, a2-sorting-based, a8-union-find, a14-deriving-optimization]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

You get an unsorted array of integers. Find the longest run of consecutive integers, such as 4, 5, 6, 7, that can be formed from values present in the array, and return its length. The values of a run can sit anywhere in the array, in any order. A value that appears several times still counts once. The solution must run in O(n) time.

**Example 1**

- Input: `nums = [7, -1, 9, 0, 8, 1, 6]`
- Output: `4`
- Why: the values form two runs, −1, 0, 1 (length 3) and 6, 7, 8, 9 (length 4). Their positions in the array do not matter.

**Example 2**

- Input: `nums = [3, 1, 2, 2, 3]`
- Output: `3`
- Why: the run is 1, 2, 3. The extra 2 and 3 do not make it longer; a run is made of distinct values.

**What the problem statement guarantees**

- `0 <= nums.length <= 10^5`, so the array may be empty.
- `-10^9 <= nums[i] <= 10^9`.
- The algorithm must run in O(n) time.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The O(n) requirement is the whole problem: an n log n solution comes quickly, and the linear one needs a careful argument about how much work is really done.

**How to practise**

1. Set a timer for 20 minutes and talk out loud.
2. Say the first correct solution that comes to mind and its complexity, even if it breaks the O(n) requirement.
3. Write down which inputs make a naive linear-looking loop slow: one long run, and many duplicates.
4. Write the code, trace it on Example 1, and count how many lookups it makes in total.

Open a hint only after two minutes without progress. After each hint, close it and try again before opening the next one.

> [!HINT] Hint 1: a small nudge
> If you could ask "is the value x + 1 present?" in constant time, how would you measure the run that begins at x?

> [!HINT] Hint 2: the kind of tool you need
> Put every value into a structure that answers membership in expected constant time. Then think about which values are worth measuring a run from. Measuring from every value repeats a lot of work on one long run.

> [!HINT] Hint 3: almost the whole plan
> Only start counting at a value x when x − 1 is absent: that x is the first value of its run. From there, step x + 1, x + 2, … while present. Each value is then stepped over by exactly one count. Loop over the distinct values, not over the array, or a value that appears many times starts many counts.

**Check yourself before revealing the walkthrough**

- [ ] My code returns 0 for an empty array and 1 for `[7, 7, 7]`
- [ ] I can argue why the total work is O(n) even though there is a loop inside a loop
- [ ] I know which input makes the "start anywhere" version quadratic
- [ ] I can say whether my O(n) is guaranteed or expected

## 3. Interview script: understand the problem (≈2 min)

**Me:** So I get an unsorted integer array and return the length of the longest set of values that form consecutive integers, like 4, 5, 6, 7. The values don't have to be adjacent in the array?

**Interviewer:** Right. Order in the array doesn't matter.

**Me:** And duplicates count once? `[1, 2, 2, 3]` is 3, not 4?

**Interviewer:** Yes, 3.

**Me:** Can the array be empty? Then I return 0.

**Interviewer:** It can be empty. Up to 10^5 elements.

**Me:** What's the value range? Negatives?

**Interviewer:** Between −10^9 and 10^9.

**Me:** So a run can cross zero, and `x + 1` is at most 10^9 + 1, which fits in an `int`, whose maximum is about 2.147 × 10^9. I won't need `long` for the arithmetic. The range is far too wide for an array indexed by value, though. And the statement says O(n) time. Is that a hard requirement?

**Interviewer:** Yes, that's the point of the problem.

**Me:** Then sorting won't be my final answer, though I'll mention it. Can I modify the input array?

**Interviewer:** I'd rather you didn't.

**Me:** Let me do Example 1 by hand: `[7, -1, 9, 0, 8, 1, 6]`. What I do in my head is look at −1, notice that 0 and 1 are there and 2 isn't: that's 3. Then 6: 7, 8, 9 are there, 10 isn't: that's 4. I didn't bother measuring from 0, because I already knew it was inside the −1 run. Answer 4.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| Must run in O(n) time | Sorting, at O(n log n), does not meet it. I need constant expected work per value. |
| 0 ≤ n ≤ 10^5 | The empty array is legal: return 0. 10^5 also tells me a quadratic fallback, 10^10 steps, is far too slow. |
| −10^9 ≤ values ≤ 10^9 | `x + 1` and `x − 1` stay within `int` (at most 10^9 + 1 in absolute value). A value-indexed array would need 2 × 10^9 + 1 slots, so no counting array: hashing it is. Negatives mean runs can cross zero. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Duplicates count once | A run is a set of distinct values. I deduplicate, and I must make sure duplicates do not cause repeated work. |
| Order in the array does not matter | The answer depends only on the set of values. |
| The input should not be modified | If I sort, I sort a copy. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| "O(n)" may be expected time, through hashing | The value range rules out a counting array, and sorting is n log n, so hashing is the tool I expect to need. I will say explicitly that my bound is expected, not worst-case. |
| The whole array fits in memory | I store a set of up to n values. A stream or distributed input is a follow-up. |

### Edge cases I will keep in mind

- An empty array (0) and a single element (1).
- All values equal: `[7, 7, 7]` gives 1.
- No two values consecutive: every run has length 1.
- A run crossing zero, and a run given in reverse order.
- A duplicate inside a run: `[1, 2, 2, 3]` gives 3.
- Values at the extremes, 10^9 and −10^9.
- Performance inputs: one run of 10^5 values, and a run plus many copies of its first value.

## 4. Think out loud: from first idea to best solution

### Approach 1: Sort, then scan for runs

#### What I say out loud

> "The brute force would be: for each value, count upward while the next value is in the array, searching the array each time. That's a linear search inside a walk that can be n long, for each of n values, so up to n cubed. Too slow, and I won't code it."

> "The thing that makes this hard is that consecutive values are scattered. If the values were sorted, a run would be a contiguous stretch, and I could find all runs in one scan. Sorting costs n log n, which breaks the stated O(n) requirement, so it's not my final answer. But it's a correct baseline, and the scan will teach me how to handle duplicates."

#### Intuition

After sorting, the values of a run sit next to each other, possibly with duplicates in between. Walking left to right, each value either repeats the previous one (ignore it), continues the run (previous + 1), or starts a new run.

#### Algorithm

1. If the array is empty, return 0.
2. Sort a copy of the array.
3. Set `run = 1`, `best = 1`.
4. For each `i` from 1: if `sorted[i]` equals `sorted[i − 1]`, skip it; if it equals `sorted[i − 1] + 1`, increase `run`; otherwise reset `run` to 1. Update `best`.

#### Why it is correct

- **Runs are contiguous after sorting.** If the values a, a + 1, …, b are present, then in sorted order every element between the first a and the last b has a value between a and b, so it is one of those values. The scan sees them in order, each step either a duplicate or +1, so `run` counts b − a + 1 distinct values.
- **A run is never overcounted.** `run` grows only on a step of exactly +1 between distinct values, so it counts only consecutive distinct values, and it resets at any larger gap.
- **The best is not missed.** `best` is updated after every step, so it sees the length of every run when it ends.

#### Dry run

`nums = [3, 1, 2, 2, 3]`, sorted copy `[1, 2, 2, 3, 3]`.

| i | sorted[i − 1] → sorted[i] | Case | run | best |
|---|---|---|---|---|
| (start) | | | 1 | 1 |
| 1 | 1 → 2 | +1, extend | 2 | 2 |
| 2 | 2 → 2 | duplicate, skip | 2 | 2 |
| 3 | 2 → 3 | +1, extend | 3 | 3 |
| 4 | 3 → 3 | duplicate, skip | 3 | 3 |

Returns 3.

#### Java code

```java title="Approach 1: sort and scan"
import java.util.Arrays;

class Solution {
    public int longestConsecutive(int[] nums) {
        if (nums.length == 0) {
            return 0;
        }
        int[] sorted = nums.clone(); // leave the input untouched
        Arrays.sort(sorted);
        int best = 1;
        int run = 1;
        for (int i = 1; i < sorted.length; i++) {
            if (sorted[i] == sorted[i - 1]) {
                continue; // a duplicate neither extends nor breaks the run
            }
            if (sorted[i] == sorted[i - 1] + 1) {
                run++;
            } else {
                run = 1;
            }
            best = Math.max(best, run);
        }
        return best;
    }
}
```

#### Time complexity

**O(n log n) in the worst case**, where n is the length of `nums`. The copy and the scan are O(n); the sort dominates. Java sorts primitive arrays with a dual-pivot quicksort, which is O(n log n) in current implementations, including the worst case, but that is implementation behaviour rather than something the API documents. Either way, this **does not meet the problem's O(n) requirement**.

#### Space complexity

**O(n) auxiliary space** for the sorted copy, plus the sort's own stack, O(log n). If modifying the input were allowed, sorting in place would bring it to O(log n).

#### The bridge to the next approach

> "Sorting does more than I need. I don't need all values in order; I only ever ask one question: 'is x + 1 present?' A hash set answers that in expected constant time without any order. So: put everything in a set, and for each value count up while the next one is present."

> "But wait, let me count the work. If the input is one long run, 1 to n, then starting from 1 I walk n steps, from 2 I walk n − 1, and so on: about n² / 2 lookups. For n = 10^5 that's 5 × 10^9. The repeated work is that I re-measure the same run from every value inside it. In my hand example I skipped 0 because it was inside the −1 run. How did I know? Because −1 was there. So: only start counting at x if x − 1 is absent, meaning x is the first value of its run."

### Approach 2: Hash set, count only from the start of each run (recommended)

#### What I say out loud

> "I put all values in a hash set. Then I go over the distinct values. If `x − 1` is in the set, x is in the middle of a run that some smaller value will measure, so I skip it. Otherwise x starts a run, and I step `x + 1`, `x + 2`, … while they're in the set. The run's length is the last value minus x plus one."

> "It looks like a nested loop, but the inner loop only runs from run starts, and each run is walked exactly once, from its own start. So across the whole algorithm the inner loop steps over each distinct value at most once. That makes it linear in total, expected, because of hashing."

> "One detail: I loop over the set, not over the array. If I looped over the array, a run start that appears ten thousand times would walk its run ten thousand times."

#### Intuition

Every run has exactly one start: the value x whose x − 1 is absent. Measuring each run only from its start means no run is measured twice, and the inner `while` loop does work proportional to the run's length. The runs partition the distinct values, so the total inner work is the number of distinct values. This is hashing used for membership, as in [[a2-hashing|Hashing]].

#### Algorithm

1. Put every value into a `HashSet`.
2. For each value `x` in the set:
3. If `x − 1` is in the set, skip `x`.
4. Otherwise set `end = x`, and while `end + 1` is in the set, increase `end`.
5. Update `best` with `end − x + 1`.
6. Return `best` (0 if the set is empty).

#### Why it is correct

- **Every run is measured.** Each maximal run a, a + 1, …, b has a start a, with a − 1 absent (otherwise the run would extend further down). The outer loop reaches a, does not skip it, and the inner loop walks up to b, stopping because b + 1 is absent (otherwise the run would extend further up). So it records exactly b − a + 1.
- **Nothing is overcounted.** The inner loop advances only while the next integer is present, so it measures consecutive distinct values only. Duplicates are gone, because the set holds each value once.
- **The answer is the best of all runs.** `best` is the maximum over every run's length.

**The amortized cost argument.** Let d be the number of distinct values (d ≤ n). The outer loop visits each of them once and does one `contains(x − 1)` each: d lookups. The inner loop runs only from a run start, and while measuring the run a..b it advances b − a times, once per value of the run after its start. Since every distinct value belongs to exactly one run, and each run is measured exactly once, the total number of inner advances over the whole algorithm is d minus the number of runs, which is less than d. Adding the one failed check that ends each walk, the outer and inner loops make at most 2d set lookups in total, plus n insertions to build the set.

**The 25-second version to say to the interviewer:**

> "Every run has exactly one start, the value whose predecessor is missing. I only count from starts, so each run is walked exactly once, and since runs don't overlap, the inner loop steps over each distinct value at most once in total. That's a linear number of set operations overall, so O(n) expected time. And I loop over the set, not the array, so duplicates of a start don't repeat the walk."

#### Dry run

`nums = [7, -1, 9, 0, 8, 1, 6]`. The set holds all seven values. A `HashSet` does not promise any iteration order; with current Java implementations it visits these values as −1, 0, 1, 6, 7, 8, 9, and the result would be the same in any order.

| x | `x − 1` in set? | Action | Inner steps | Run length | best |
|---|---|---|---|---|---|
| −1 | −2: no | start; 0 yes, 1 yes, 2 no | 2 | 3 | 3 |
| 0 | −1: yes | skip | 0 | | 3 |
| 1 | 0: yes | skip | 0 | | 3 |
| 6 | 5: no | start; 7 yes, 8 yes, 9 yes, 10 no | 3 | 4 | 4 |
| 7 | 6: yes | skip | 0 | | 4 |
| 8 | 7: yes | skip | 0 | | 4 |
| 9 | 8: yes | skip | 0 | | 4 |

Returns 4. The inner loop advanced 2 + 3 = 5 times in total for 7 distinct values in 2 runs: d minus the number of runs, as the argument predicts.

#### Java code

```java title="Approach 2: hash set, count from run starts (recommended)"
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> values = new HashSet<>();
        for (int x : nums) {
            values.add(x);
        }
        int best = 0;
        for (int x : values) {              // the set, not the array: each distinct value once
            if (values.contains(x - 1)) {
                continue;                   // x is inside a run that its start will measure
            }
            int end = x;
            while (values.contains(end + 1)) {
                end++;
            }
            best = Math.max(best, end - x + 1);
        }
        return best;
    }
}
```

`x − 1` and `end + 1` stay within −10^9 − 1 to 10^9 + 1, inside the `int` range, and `end − x + 1` is at most n. With the full `int` range this would not be safe (see the follow-ups).

#### Time complexity

**O(n) expected time; not O(n) in the worst case.** n is the length of `nums` and d ≤ n the number of distinct values.

- Building the set: n `add` calls.
- Outer loop: d iterations with one `contains` each. Iterating a `HashSet` also visits its empty buckets, but the table has O(n) buckets, so the iteration itself is O(n).
- Inner loop: fewer than d advances in total, by the amortized argument above, plus one failed check per run.
- Each `add` and `contains` is constant **on average, assuming hash codes spread well**, so the total is O(n) expected. If many keys collided, each operation could cost much more: O(n) per operation with list buckets, which gives O(n²) overall. Current Java implementations convert a heavily collided bucket into a balanced tree, which for `Integer` keys limits an operation to about O(log n), so about O(n log n) overall; that is implementation behaviour, not an API guarantee.

#### Space complexity

**O(n) auxiliary space**: the set holds up to n boxed `Integer`s, each with a map node, so the constant is several times that of an `int` array. The input is not modified.

### Alternative: union-find over adjacent values

Treat each distinct value as a node and join x with x + 1 whenever both are present. The connected components are exactly the runs, and the answer is the largest component's size. With union by size and path compression, the union-find work is O(n α(n)), where α is the inverse Ackermann function, below 5 for any practical n. A hash map from value to node index adds O(n) expected, so the total is O(n α(n)) expected. See [[a8-union-find|Union-Find]].

```java title="Alternative: union-find"
import java.util.HashMap;
import java.util.Map;

class Solution {
    private int[] parent;
    private int[] size;

    public int longestConsecutive(int[] nums) {
        Map<Integer, Integer> index = new HashMap<>(); // distinct value -> node
        for (int x : nums) {
            index.putIfAbsent(x, index.size());
        }
        int d = index.size();
        parent = new int[d];
        size = new int[d];
        for (int i = 0; i < d; i++) {
            parent[i] = i;
            size[i] = 1;
        }
        for (Map.Entry<Integer, Integer> e : index.entrySet()) {
            Integer next = index.get(e.getKey() + 1);
            if (next != null) {
                union(e.getValue(), next);
            }
        }
        int best = 0;
        for (int i = 0; i < d; i++) {
            if (parent[i] == i) {
                best = Math.max(best, size[i]);
            }
        }
        return best;
    }

    private int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]]; // path halving
            x = parent[x];
        }
        return x;
    }

    private void union(int a, int b) {
        int ra = find(a);
        int rb = find(b);
        if (ra == rb) {
            return;
        }
        if (size[ra] < size[rb]) {
            int t = ra;
            ra = rb;
            rb = t;
        }
        parent[rb] = ra;
        size[ra] += size[rb];
    }
}
```

It is longer and slightly slower than Approach 2 and wins nothing on a static array. Its advantage is that it is incremental: values can keep arriving and each one costs one or two unions, which is the setting of the streaming follow-up. For that case there is also a lighter structure, a map from each run's endpoints to the run's length (section 10).

## 5. Comparison table

n = length of `nums`. "Expected" is over the behaviour of the hash function; sorting does not hash.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Brute force (described, not coded) | O(n³) | O(n³) | O(1) |
| 1. Sort and scan | O(n log n) | O(n log n) (current Java implementation) | O(n) for the copy; O(log n) if sorting in place is allowed |
| 2. Hash set, count from run starts | O(n) | O(n²) for hash tables in general; about O(n log n) with current Java tree buckets and `Integer` keys (not an API guarantee) | O(n) |
| Alt. Union-find | O(n α(n)) | Same hashing caveat as approach 2 | O(n) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Sort and scan | No hashing; guaranteed bound; simple | Breaks the O(n) requirement | When the requirement is relaxed, memory is tight (sort in place), or the input is already sorted |
| 2. Hash set from run starts | Linear expected time; short | Expected, not guaranteed; the "only from starts" and "loop over the set" details are easy to miss | The default answer |
| Alt. Union-find | Incremental: handles values arriving one by one | More code, larger constant | Streaming inputs, or when the interviewer asks for it |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** the hash set with the run-start check (Approach 2).

**Is it optimal?** Yes, in expectation. In the worst case a correct algorithm must look at essentially every value, since an unexamined value could join two runs into a longer one, so there is an Ω(n) worst-case lower bound, and O(n) expected matches it. Without hashing, the standard tool is sorting, at O(n log n); the value range is too wide for counting tricks. That is why the O(n) requirement points to hashing, and why the bound is expected rather than guaranteed.

**When a different solution is preferable in practice:** if the input is already sorted, the scan alone is O(n) with O(1) extra space. If a worst-case guarantee matters more than the stated requirement, sorting is the safe choice. For values arriving one at a time, union-find or the endpoint map.

**When to stop:** once you have Approach 2, the amortized argument, and the set-not-array detail. Do not micro-optimize boxing or pre-size the set unless asked.

## 7. Interview script: code it and test it

### What I say while coding

> "First the set, built from all values. It also removes duplicates."

> "Then I loop over the set. Not the array: if the array had the same run start many times, each copy would walk the run."

> "If `x - 1` is in the set, x is not a start, skip. That one line is what makes it linear."

> "From a start, walk `end` upward while `end + 1` is present. Values are at most 10^9, so `end + 1` can't overflow."

> "`best` starts at 0, so the empty array returns 0 with no special case."

### Testing out loud

**Normal case:** Example 1, the table in section 4: runs −1..1 and 6..9 are measured from −1 and 6; everything else is skipped. Returns 4.

**Duplicates:** `[3, 1, 2, 2, 3]`: the set is {1, 2, 3}. 1 is a start (0 absent), walks to 3: length 3. 2 and 3 are skipped. Returns 3.

**Empty array:** the set is empty, the loop doesn't run, returns 0.

**All duplicates:** `[7, 7, 7]`: the set is {7}. 7 is a start, 8 is absent, length 1. Returns 1.

**Extremes:** `[1000000000, 999999999, -1000000000, -999999999, -999999998]`: the run 999,999,999..10^9 is measured from 999,999,999, checking 10^9 + 1, which fits in an `int`. The run −10^9..−999,999,998 is measured from −10^9, whose predecessor check is −10^9 − 1, also fine. Returns 3.

**Performance case:** one run of 10^5 values in random order: only the smallest value is a start, and the walk takes 10^5 − 1 steps once. A run of 50,000 values plus 50,000 more copies of its first value: the set has 50,000 elements and the walk happens once. Looping over the array instead would walk it 50,001 times, about 2.5 × 10^9 lookups, several seconds.

## 8. Time plan for the interview

### Suggested split

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 2 min | Duplicates count once, empty array, value range, O(n) is required |
| Brute force and sorting | 2 min | Say both with complexity; note sorting breaks the requirement |
| Derive the run-start idea | 3 min | The set; why counting from every value is quadratic; the `x − 1` check |
| Argue linear time | 1–2 min | Each value is walked over once, by its run's start |
| Write the code | 3–4 min | Set, loop over the set, start check, walk |
| Trace and test | 3 min | Example 1; duplicates; empty |
| Complexity and follow-ups | 2 min | Expected versus worst case; union-find or streaming |

### Where the time should go

- **Most attention:** the amortized argument. Interviewers ask "isn't that O(n²)? There's a loop inside a loop", and the answer needs to be crisp.
- **Do not skimp on:** the loop-over-the-set detail and the duplicate case.
- **Least attention:** the sorting code. Say it, don't write it unless asked.

### If the better idea does not come

1. Write the sort-and-scan solution and say it is O(n log n). It is correct, which is real progress.
2. Ask: "What does sorting give me that I actually use?" Only the answer to "is x + 1 present?". A set answers that.
3. Write "count up from every value with a set" and count its work on a single long run. The waste is re-measuring runs from their middle.
4. Ask: "From which value should a run be measured?" From its smallest, the one whose predecessor is missing.

## 9. Interviewer challenges

### About the solution

#### There is a `while` inside a `for`. Isn't this O(n²)?

**What they are testing:** whether you can do an amortized argument, rather than multiplying loop bounds.

**How to reason:** don't bound the inner loop per outer iteration; bound its total over the whole run. Ask which values the inner loop can ever step onto, and how many times.

**What I say:** "Not here. The inner loop only runs from a run's start, and it walks only that run. Each value belongs to exactly one run, and each run is walked exactly once, from its start. So over the whole algorithm, the inner loop steps over each distinct value at most once: fewer than n steps in total. Plus one `contains(x − 1)` per value. It's linear overall, expected because of hashing."

**Nuance:** without the start check, the same code is quadratic: on the run 1..n, starting from every value costs about n² / 2 lookups, 5 × 10^9 for n = 10^5.

#### Why iterate over the set instead of the array?

**What they are testing:** whether you see that the amortized argument depends on distinct values.

**How to reason:** the argument says each run is walked once from its start. That holds when each start is visited once. With duplicates in the array, a start value can be visited many times.

**What I say:** "The argument needs each run start visited once. If I loop over the array, a start value that appears k times walks its run k times. With 50,000 values in a run plus 50,000 copies of its first value, that's about 2.5 × 10^9 lookups. Looping over the set visits each distinct value once."

**Nuance:** alternatively keep looping over the array but remove each start from the set after walking it (or remove every visited value). That also guarantees one walk per run.

#### Is it really O(n)?

**What they are testing:** whether you distinguish expected from guaranteed.

**How to reason:** count set operations: a constant number per value. Then ask what each one costs.

**What I say:** "It makes O(n) set operations. Each is constant on average if hash codes spread well, so O(n) expected. In the worst case, with heavy collisions, hash tables can degrade to linear per operation; current Java tree buckets keep `Integer` keys to about log n per operation, but that's implementation behaviour, not a promise of the API."

**Nuance:** the statement's "O(n) time" is, in practice, met with hashing, so it is expected time. If the interviewer wants a worst-case guarantee, the honest answer is sorting at O(n log n).

#### Why not a counting array indexed by value? That is truly O(1) per operation.

**What they are testing:** whether you check the value range before choosing a direct-address table.

**How to reason:** a value-indexed array needs one slot per possible value. Count the slots.

**What I say:** "The values range over 2 × 10^9 + 1 integers, so the array would need about 2 billion slots: gigabytes of memory, and zeroing it alone costs far more than n. That works only when the range is small, like the values being between 0 and 10^5."

**Nuance:** radix sort also sorts integers in O(n · w) for a fixed word size w, which is linear in n but not "O(n)" in the spirit of the problem, and it is rarely what an interviewer means.

### About changed inputs

#### What if the values could be any `int`?

**What they are testing:** awareness of the overflow boundary in `end + 1` and `x − 1`.

**How to reason:** find each arithmetic step and ask what happens at `Integer.MAX_VALUE` and `Integer.MIN_VALUE`.

**What I say:** "Then `end + 1` at `Integer.MAX_VALUE` wraps to `Integer.MIN_VALUE`. For `[2147483647, -2147483648]` the walk from the maximum would 'continue' to the minimum and report 2 instead of 1. I'd stop the walk explicitly at `Integer.MAX_VALUE`, or do the arithmetic in `long`. Under the given constraints it can't happen: values are at most 10^9."

**Nuance:** in that buggy run, `end − x + 1` is computed as `Integer.MIN_VALUE − Integer.MAX_VALUE + 1`, which also wraps, to 2. Once the walk stops at `Integer.MAX_VALUE`, a run holds at most n values and its length fits in an `int`.

## 10. Follow-up questions the interviewer might ask

**"Return the run itself, not just its length."**
Keep the start of the best run along with its length, and output `start, start + 1, …`. Same O(n) expected time; the output is O(length).

**"Values arrive one at a time; after each, report the longest run so far."**
Keep a map from each run's endpoints to its length. When x arrives (and is new), look up the run ending at x − 1 (length L) and the run starting at x + 1 (length R). The merged run has length L + R + 1; write it at the new left endpoint x − L and right endpoint x + R. O(1) expected per insertion, and the answer is a running maximum. Union-find does the same with a little more code and also supports asking which run a value belongs to.

**"What if the array is already sorted?"**
Then the scan from Approach 1 alone is O(n) worst-case time and O(1) extra space, with no hashing.

**"What if the data is too large for one machine?"**
Partition values by range across machines; each finds its local runs and reports the runs touching its range boundaries, and a final step merges runs that cross boundaries. Hashing values to machines instead would split runs arbitrarily, so range partitioning is the right choice here.

**"What about the longest consecutive *subsequence in array order*, or the longest increasing run of adjacent elements?"**
Those are different problems. Adjacent elements in the array: a single scan. Increasing subsequence in array order (not necessarily consecutive values): [[nc-longest-increasing-subsequence|Longest Increasing Subsequence]], O(n log n). Ask which one is meant.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Offering the sort as the final answer.** It is correct but O(n log n), and the statement asks for O(n). Say it as the baseline, then improve.
- **Claiming the set version is O(n) without the start check.** Without it, a single long run costs about n² / 2 lookups.
- **Arguing "nested loops, so O(n²)" about the correct version.** Bound the inner loop's total work across the algorithm, not per iteration.
- **Treating the problem as being about array order.** Values can be anywhere; only the set of values matters.
- **Calling O(n) guaranteed.** It is expected, through hashing.

### Implementation mistakes

> [!MISTAKE] Treating a duplicate as a break in the sorted scan
> Writing `if (sorted[i] == sorted[i - 1] + 1) run++; else run = 1;` without the duplicate case resets the run on equal values: `[3, 1, 2, 2, 3]` sorts to `[1, 2, 2, 3, 3]` and returns 2 instead of 3.

> [!MISTAKE] Looping over the array instead of the set
> The result is still right, but a run start that appears many times walks its run each time. 50,000 consecutive values plus 50,000 copies of the first one take about 2.5 × 10^9 lookups: several seconds instead of milliseconds.

- **Returning 1 for an empty array.** Initializing `best = 1` (natural in the sorted scan) without an empty check gives 1 for `[]`.
- **Counting duplicates in the run length** by working on the array, not the set: `[1, 2, 2, 3]` must give 3.
- **Overflow with the full `int` range.** `end + 1` at `Integer.MAX_VALUE` wraps around; `[2147483647, -2147483648]` returns 2. Not reachable under these constraints, but worth a sentence.
- **Sorting the input in place** when it should not be modified. Sort a copy.

## 12. Pattern recognition

**The pattern:** hash-set membership with "start only at the beginning of a structure". Put all elements in a set, identify the unique starting point of each group (here, a value whose predecessor is missing), and walk each group once from its start, which makes the total work linear by amortization.

**Signals in the problem statement:**

- Unsorted input, with an O(n) time requirement that rules out sorting.
- The answer depends on relationships between *values* (x and x + 1), not positions.
- Groups that can be grown one step at a time with a membership test.
- Duplicates that should count once.

**Related problems in this list:**

- [[nc-contains-duplicate|Contains Duplicate]]: the same "put values in a set, ask membership" foundation.
- [[nc-two-sum|Two Sum]]: replaces a search for a known value (there the complement, here x + 1) with a hash lookup.
- [[nc-first-missing-positive|First Missing Positive]]: also asks about consecutive integers in an unsorted array, but with a small range, so the array itself can serve as the hash table for O(1) extra space.
- [[nc-number-of-connected-components|Number of Connected Components in an Undirected Graph]]: the union-find view, where runs are components of the graph joining x and x + 1.
- [[cses-distinct-numbers|Distinct Numbers]] (CSES): counting distinct values, the deduplication step on its own.

**Takeaway:** when a nested loop walks "groups" of a set, make sure each group is walked once, from a unique start, and loop over distinct elements. Then the total work is linear even though the code has two loops.

## 13. 60-second revision card

**Key insight:** a run's start is the value whose predecessor is absent. Count only from starts, so each run is walked once.

**Invariant / argument:** runs partition the distinct values, and each run is walked exactly once from its start, so the inner loop advances fewer than d times in total (d = number of distinct values).

**Complexity:** O(n) expected time, O(n) space. Sorting is O(n log n) and breaks the requirement. Hashing worst case: O(n²) in general; about O(n log n) with current Java tree buckets for `Integer` keys, not an API guarantee.

**Code skeleton:**

```java title="Longest Consecutive Sequence, run starts" fragment="public int longestConsecutive(int[] nums)"
Set<Integer> values = new HashSet<>();
for (int x : nums) values.add(x);
int best = 0;
for (int x : values) {                         // the set, not the array
    if (values.contains(x - 1)) continue;      // not a run start
    int end = x;
    while (values.contains(end + 1)) end++;
    best = Math.max(best, end - x + 1);
}
return best;
```

**Main traps:**

- Without the `x − 1` check it is O(n²) on one long run.
- Loop over the set: copies of a start in the array would re-walk the run.
- Empty array returns 0; duplicates count once.
- `x + 1` is safe for values up to 10^9; not for `Integer.MAX_VALUE`.
- "O(n)" is expected, not guaranteed.

**What to say in one breath:** "I put all values in a hash set. A value whose predecessor is missing starts a run, so I only walk upward from those, and each run is walked exactly once. That's a linear number of set operations, O(n) expected time and O(n) space. Sorting would be n log n, which the problem rules out."
