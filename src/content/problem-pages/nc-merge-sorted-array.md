---
problemId: nc-merge-sorted-array
title: Merge Sorted Array
source: neetcode
sourceUrl: https://leetcode.com/problems/merge-sorted-array/
difficulty: easy
patterns: [two-pointers]
relatedLessons: [a2-two-pointers, a2-array-string-traversal, a2-sorting-based, a14-edge-cases]
companies: []
timeToSolve: 12
---

## 1. Problem restatement

You get two integer arrays, each sorted in non-decreasing order. `nums1` has length m + n: its first m slots hold real values and its last n slots hold 0s that are only there to make room. `nums2` has length n. Merge `nums2` into `nums1` so that all m + n slots of `nums1` hold the combined values in non-decreasing order. The method returns nothing; the judge reads `nums1` afterwards.

**Example 1**

- Input: `nums1 = [1, 4, 7, 0, 0, 0]`, `m = 3`, `nums2 = [2, 4, 5]`, `n = 3`
- Output: `nums1 = [1, 2, 4, 4, 5, 7]`
- Why: the real values are 1, 4, 7 and 2, 4, 5. Together, sorted, they are 1, 2, 4, 4, 5, 7. Both 4s stay: duplicates are kept.

**Example 2**

- Input: `nums1 = [0]`, `m = 0`, `nums2 = [3]`, `n = 1`
- Output: `nums1 = [3]`
- Why: `nums1` has no real values; its single 0 is a placeholder, not data, so the answer is just `nums2`.

**What the problem statement guarantees**

- `nums1.length == m + n` and `nums2.length == n`.
- 0 ≤ m, n ≤ 200 and 1 ≤ m + n ≤ 200, so either array may contribute nothing, but not both.
- −10⁹ ≤ `nums1[i]`, `nums2[j]` ≤ 10⁹.
- Both arrays are sorted in non-decreasing order (the placeholder zeros in `nums1` are not part of that order).
- The result must end up in `nums1`; the method returns `void`.
- Follow-up from the statement: can you do it in O(m + n) time?

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. There is a one-line answer that works and a linear answer that interviewers expect, and the linear one has a trap that only shows up when you trace it on paper. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 12 minutes and talk out loud.
2. Say the one-line answer and its complexity, then aim for O(m + n).
3. Before coding, draw `nums1 = [4, 5, 0, 0]`, `m = 2`, `nums2 = [1, 2]` and decide where each value must end up.
4. Trace your code on that input, on `m = 0`, and on `n = 0`.

> [!HINT] Hint 1: a small nudge
> Both inputs are already sorted, so you should not need to sort anything. What goes wrong if you build the merged result from the front of `nums1`?

> [!HINT] Hint 2: the kind of tool you need
> Which part of `nums1` is free to write into without destroying anything? Where does the largest value of the whole result belong, and which two values could it be?

> [!HINT] Hint 3: almost the whole plan
> Put one pointer on the last real value of `nums1`, one on the last value of `nums2`, and a write pointer on the last slot of `nums1`. Repeatedly copy the larger of the two pointed-at values to the write slot and move that pointer and the write pointer left. Think about when you can stop, and what is left to do if `nums1`'s pointer runs out first, and if `nums2`'s does.

**Check yourself before revealing the walkthrough**

- [ ] My code never overwrites a real `nums1` value before reading it
- [ ] It handles `m = 0` without reading `nums1[-1]`
- [ ] It handles `n = 0` by doing nothing
- [ ] It handles every value of `nums2` being smaller than every value of `nums1`
- [ ] I can say why the loop may stop as soon as `nums2` is used up

## 3. Interview script: understand the problem (≈2 min)

**Me:** Let me restate. `nums1` has room for both arrays: m real values, then n placeholder slots. I merge `nums2` in, so that `nums1` ends up fully sorted, and I return nothing.

**Interviewer:** Yes.

**Me:** The trailing zeros are just space, not values? So if `m` is 0, the whole of `nums1` is free?

**Interviewer:** Right. Ignore them.

**Me:** And duplicates, both within one array and across the two, are all kept?

**Interviewer:** Yes, it's a merge of multisets.

**Me:** Values go up to 10⁹ in absolute value, and sizes up to 200 in total. I'll only compare values, never add them, so `int` is fine. The statement asks for O(m + n) as a follow-up, so I'll start with the simple version and work toward that.

**Me:** Quick example: `[1, 4, 7, _, _, _]` and `[2, 4, 5]`. Merged: 1, 2, 4, 4, 5, 7. Notice the 7 has to move from index 2 to index 5, and 2 has to land at index 1, where 4 is right now.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| `nums1.length == m + n` | The output has exactly enough room. The free space is at the back of `nums1`, which is what makes a backward merge possible. |
| 0 ≤ m, n ≤ 200, m + n ≥ 1 | Either array can contribute nothing. With `m = 0` there is no real `nums1` value to compare against; with `n = 0` there is nothing to do. With at most 200 elements every approach is instant; the interviewer is listening for the linear method and its argument. |
| −10⁹ ≤ values ≤ 10⁹ | Fits in `int` (its range is about ±2.1 × 10⁹). Values are only compared, so no overflow. Negative values and zeros are real data; never treat 0 as "empty". |
| Both sorted non-decreasing | No sorting needed: the next smallest (or largest) value is always at one of two known positions. |
| Result in `nums1`, return `void` | Any work buffer has to be copied back; the judge reads `nums1`. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Trailing zeros are placeholders | They can be overwritten freely, and must not be compared as data. |
| Duplicates are kept | Ties need no special handling: either equal value may go first. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| `nums2` may be read but need not be preserved, though my solution leaves it unchanged anyway | Some callers reuse their inputs; I say it so nobody expects me to clear `nums2`. |

### Edge cases I will keep in mind

- `m = 0`: the answer is `nums2` copied in.
- `n = 0`: `nums1` is already the answer.
- Every value of `nums2` is smaller than every real value of `nums1`: all of `nums1` must shift right by n.
- Every value of `nums2` is larger: `nums2` goes into the free slots as it is.
- Ties between the arrays, and negative values and real zeros.

## 4. Think out loud: from first idea to best solution

### Approach 1: Copy in and sort

#### What I say out loud

> "The free slots are exactly n long. So the simplest thing is to copy `nums2` into them and sort the whole of `nums1`. That's correct because the result is just the sorted multiset of all values."

> "It ignores the fact that both halves are already sorted, so it pays O((m + n) log(m + n)) for the sort. That's the thing to improve."

#### Intuition

The answer is the sorted order of the union. Putting all values in one array and sorting it produces that directly.

#### Algorithm

1. Copy `nums2[0 .. n − 1]` into `nums1[m .. m + n − 1]`.
2. Sort `nums1`.

#### Why it is correct

After step 1, `nums1` holds exactly the m real values and the n values of `nums2`, each once, and no placeholder remains. Sorting puts that multiset in non-decreasing order, which is the definition of the answer.

#### Dry run

`nums1 = [1, 4, 7, 0, 0, 0]`, `m = 3`, `nums2 = [2, 4, 5]`, `n = 3`

| Step | `nums1` |
|---|---|
| Copy `nums2` into slots 3..5 | `[1, 4, 7, 2, 4, 5]` |
| Sort | `[1, 2, 4, 4, 5, 7]` |

#### Java code

```java title="Approach 1: copy in and sort"
import java.util.Arrays;

class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        System.arraycopy(nums2, 0, nums1, m, n);   // fill the placeholder slots
        Arrays.sort(nums1);
    }
}
```

#### Time complexity

**O((m + n) log(m + n))** for the sort, plus O(n) for the copy. `Arrays.sort(int[])` is a dual-pivot quicksort. In recent JDKs (Java 17, for example) the implementation note in its documentation says it offers O(n log n) performance on all data sets (the implementation falls back to heapsort when partitioning degrades); the Java 8 note said only "many data sets". Either way it is an implementation note, not part of the method's contract, so on an old JDK the worst case is not documented to be O(n log n).

#### Space complexity

**O(log(m + n)) auxiliary space** in practice, for the quicksort's recursion; again an implementation detail. No extra array.

#### The bridge to the next approach

> "Sorting throws away information I already have. Both inputs are sorted, so the next smallest value overall is always the front of one of them: that's a standard merge, one comparison per output value. The problem is where to put the output. If I write into `nums1` from the front, I overwrite `nums1`'s own unread values. The safe fix is to copy `nums1`'s real values out first and merge from the copy."

### Approach 2: Copy out, then merge forward

#### What I say out loud

> "I copy the m real values of `nums1` into a temporary array. Now `nums1` is pure output space. I merge the temporary array and `nums2` from the front, writing into `nums1` left to right, and then drain whichever input still has values."

#### Intuition

A merge reads two sorted inputs and writes one sorted output. It is only dangerous when the output overlaps an input that has not been read yet; copying `nums1`'s values out removes the overlap.

#### Algorithm

1. `first = copy of nums1[0 .. m − 1]`.
2. `i = 0` in `first`, `j = 0` in `nums2`, `k = 0` in `nums1`.
3. While both have values: write the smaller of `first[i]` and `nums2[j]` (take `first[i]` on a tie) to `nums1[k]`, advance that pointer and `k`.
4. Copy what remains of `first`, then what remains of `nums2`.

#### Why it is correct

**The invariant:** `nums1[0 .. k − 1]` holds the k smallest values of `first[0 .. i − 1]` and `nums2[0 .. j − 1]` combined, in sorted order, and `k = i + j`. Each step writes the smaller of the two fronts, and because both inputs are sorted, that is the smallest value not yet written, so the prefix stays sorted and grows by one. When one input runs out, the rest of the other is sorted and every value in it is at least as large as everything written, so copying it in order keeps the result sorted. Reading from `first`, never from `nums1`, means no write can destroy an unread value.

#### Dry run

`first = [1, 4, 7]`, `nums2 = [2, 4, 5]`

| i | j | Compare | Write `nums1[k]` | `nums1` after |
|---|---|---|---|---|
| 0 | 0 | 1 vs 2 | 1 → slot 0 | `[1, 4, 7, 0, 0, 0]` |
| 1 | 0 | 4 vs 2 | 2 → slot 1 | `[1, 2, 7, 0, 0, 0]` |
| 1 | 1 | 4 vs 4 (tie, take `first`) | 4 → slot 2 | `[1, 2, 4, 0, 0, 0]` |
| 2 | 1 | 7 vs 4 | 4 → slot 3 | `[1, 2, 4, 4, 0, 0]` |
| 2 | 2 | 7 vs 5 | 5 → slot 4 | `[1, 2, 4, 4, 5, 0]` |
| 2 | 3 | `nums2` done | drain 7 → slot 5 | `[1, 2, 4, 4, 5, 7]` |

Row 2 shows why the copy matters: slot 1 held the real value 4, and it is overwritten with 2. Without `first`, that 4 would be lost.

#### Java code

```java title="Approach 2: copy out, then merge forward"
import java.util.Arrays;

class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int[] first = Arrays.copyOf(nums1, m);   // nums1's real values, safe from overwriting
        int i = 0, j = 0, k = 0;
        while (i < m && j < n) {
            if (first[i] <= nums2[j]) nums1[k++] = first[i++];
            else nums1[k++] = nums2[j++];
        }
        while (i < m) nums1[k++] = first[i++];
        while (j < n) nums1[k++] = nums2[j++];
    }
}
```

#### Time complexity

**O(m + n) in every case.** The copy is O(m), and each loop iteration writes one slot of `nums1`, m + n in total.

#### Space complexity

**O(m) auxiliary space** for `first`. (Merging into a fresh `int[m + n]` and copying it back also works and costs O(m + n).)

#### The bridge to the next approach

> "The only reason for `first` is that the front of `nums1` is occupied. But the back of `nums1` is empty: n free slots. If I merge from the largest value down, writing from the last slot leftward, I'm writing into free space first. The question is whether the write pointer can ever catch up with the `nums1` values I haven't read. Let me count."

### Approach 3: Merge backwards from the end (recommended)

#### What I say out loud

> "Three pointers: `i` on the last real value of `nums1`, `j` on the last value of `nums2`, `k` on the last slot. The largest remaining value overall is `nums1[i]` or `nums2[j]`. I put it at `k` and move that pointer and `k` left."

> "Is it safe to write at `k`? The number of values still unplaced is (i + 1) + (j + 1), and they must fill slots 0 to k, so `k = i + j + 1`. While `nums2` has a value left, j ≥ 0, so `k > i`: the slot I write is always to the right of every unread `nums1` value."

> "And I can stop as soon as `nums2` is used up: then `k = i`, so the remaining `nums1` values are already sitting in slots 0 to i, in sorted order, and they're the smallest ones."

#### Intuition

Fill the result from its largest end, where the free space is. The write pointer starts exactly n slots to the right of `nums1`'s read pointer, and that gap shrinks by one only when a value is taken from `nums2`. So the gap is always the number of `nums2` values still unplaced: it reaches zero exactly when `nums2` is finished, and never before.

#### Algorithm

1. `i = m − 1`, `j = n − 1`, `k = m + n − 1`.
2. While `j ≥ 0`:
   - if `i ≥ 0` and `nums1[i] > nums2[j]`: `nums1[k] = nums1[i]`, decrement `i`;
   - otherwise `nums1[k] = nums2[j]`, decrement `j`;
   - decrement `k`.
3. Done. Whatever is left in `nums1[0 .. i]` is already in place.

#### Why it is correct

**The invariant**, true before every iteration:

1. `k = i + j + 1`.
2. `nums1[k + 1 .. m + n − 1]` holds the largest m + n − 1 − k values of the combined input, in sorted order.
3. `nums1[0 .. i]` still holds the original first i + 1 real values of `nums1`, and `nums2[0 .. j]` is untouched.

- At the start, `k = m + n − 1 = (m − 1) + (n − 1) + 1`, the placed region is empty, and nothing has been written.
- **Each step places the right value.** The unplaced values are `nums1[0 .. i]` and `nums2[0 .. j]`. Both are sorted, so their largest is `nums1[i]` or `nums2[j]`. The step writes the larger (with `nums1[i]` missing when `i < 0`) to slot `k`, directly left of the placed region, so that region stays sorted and holds the largest values. Exactly one of `i`, `j` decreases, and `k` decreases, so part 1 still holds.
- **No unread value is overwritten.** The write goes to slot `k`. While the loop runs, `j ≥ 0`, so `k = i + j + 1 ≥ i + 1`: the slot is strictly to the right of every unread `nums1` value. Part 3 holds.
- **Stopping when `nums2` is exhausted is enough.** When `j = −1`, part 1 gives `k = i`. The unplaced values are exactly `nums1[0 .. i]`, which sit in slots 0 to i already, in sorted order (part 3), and are all no larger than the placed values (part 2). So the whole array is sorted, with no copying needed.
- **The loop ends.** Every iteration decreases `j` or `i`, and `i` can only decrease while `i ≥ 0`. Once `i < 0`, every iteration decreases `j`, so at most m + n iterations run.

**On ties:** when `nums1[i] == nums2[j]`, the code takes `nums2[j]`. Either choice gives the same array of values; taking from `nums2` on a tie keeps equal values from `nums1` ahead of equal values from `nums2`, which is the stable choice if the values were records.

**The 30-second version to say to the interviewer:**

> "I merge from the back, where the free space is. `i` and `j` point at the largest unplaced values, `k` at the next slot to fill, and `k` always equals `i + j + 1`. So while `nums2` has values left, `k` is to the right of `i`, and I never overwrite a `nums1` value I haven't read. Each step places the larger of `nums1[i]` and `nums2[j]`. When `nums2` runs out, `k` equals `i`, so the rest of `nums1` is already in place and I can stop."

#### Dry run

`nums1 = [1, 4, 7, 0, 0, 0]`, `m = 3`, `nums2 = [2, 4, 5]`, `n = 3`

| i | j | k | Compare | Write | `nums1` after |
|---|---|---|---|---|---|
| 2 | 2 | 5 | 7 > 5 | 7 from `nums1` → slot 5 | `[1, 4, 7, 0, 0, 7]` |
| 1 | 2 | 4 | 4 > 5? no | 5 from `nums2` → slot 4 | `[1, 4, 7, 0, 5, 7]` |
| 1 | 1 | 3 | 4 > 4? no (tie) | 4 from `nums2` → slot 3 | `[1, 4, 7, 4, 5, 7]` |
| 1 | 0 | 2 | 4 > 2 | 4 from `nums1` → slot 2 | `[1, 4, 4, 4, 5, 7]` |
| 0 | 0 | 1 | 1 > 2? no | 2 from `nums2` → slot 1 | `[1, 2, 4, 4, 5, 7]` |
| 0 | −1 | 0 | `j < 0`: stop | — | `[1, 2, 4, 4, 5, 7]` |

At every row `k = i + j + 1`. In the last row `k = i = 0`, and the 1 in slot 0 is already where it belongs.

A second trace, where every value of `nums2` is smaller: `nums1 = [4, 5, 0, 0]`, `m = 2`, `nums2 = [1, 2]`.

| i | j | k | Compare | Write | `nums1` after |
|---|---|---|---|---|---|
| 1 | 1 | 3 | 5 > 2 | 5 → slot 3 | `[4, 5, 0, 5]` |
| 0 | 1 | 2 | 4 > 2 | 4 → slot 2 | `[4, 5, 4, 5]` |
| −1 | 1 | 1 | `i < 0` | 2 → slot 1 | `[4, 2, 4, 5]` |
| −1 | 0 | 0 | `i < 0` | 1 → slot 0 | `[1, 2, 4, 5]` |

This is the case where `nums1` runs out first, and the loop must keep going to copy `nums2`.

#### Java code

```java title="Approach 3: merge backwards from the end (recommended)"
class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1;            // last unplaced real value of nums1
        int j = n - 1;            // last unplaced value of nums2
        int k = m + n - 1;        // next slot to fill; always k == i + j + 1
        while (j >= 0) {          // once nums2 is placed, nums1[0..i] is already in position
            if (i >= 0 && nums1[i] > nums2[j]) {
                nums1[k--] = nums1[i--];
            } else {
                nums1[k--] = nums2[j--];
            }
        }
    }
}
```

#### Time complexity

**O(m + n) in the worst case**, and O(n + (number of `nums1` values larger than `min(nums2)`)) in general: each iteration places one value, and the loop stops after the last `nums2` value is placed. With `n = 0` it does no work at all.

#### Space complexity

**O(1) auxiliary space**: three indices.

## 5. Comparison table

m and n as in the statement. Nothing is hashed or randomized. For Approach 1, the worst-case bound depends on the JDK's sort implementation, as noted in section 4.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Copy in and sort | O((m + n) log(m + n)) | O((m + n) log(m + n)), as documented since Java 14 | O(log(m + n)) recursion |
| 2. Copy out, merge forward | O(m + n) | O(m + n) | O(m) |
| 3. Merge backwards | O(m + n) | O(m + n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Copy in and sort | Two lines; hard to get wrong | Ignores the sortedness; slower | A quick baseline, or when correctness under time pressure matters more than the follow-up |
| 2. Copy out, merge forward | The textbook merge, easy to verify | O(m) extra memory | When the output must be built front to back (for example, streaming) |
| 3. Merge backwards | Linear time, constant space, stops early | Needs the `k = i + j + 1` argument to be convincing | The default answer |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 3. It meets the statement's O(m + n) follow-up with O(1) extra space, and the code is shorter than Approach 2.

**Is it optimal?** In the worst case, yes. Every value of `nums2` has to be written into `nums1`, and where it goes depends on the values of `nums1`; an algorithm that never inspected some element could be fooled by changing that element's value so that it belongs somewhere else. So, in the model where the algorithm learns about values only by reading them, there is an Ω(m + n) worst-case lower bound, and Approach 3 meets it. Space cannot go below O(1).

**When something else is better in practice:** with at most 200 elements, all three are instant. If the interviewer only wants a working answer, Approach 1 is fine to mention first. Approach 2 is the right shape when the output must be produced in increasing order.

**When to stop:** once you have the backward merge, the `k = i + j + 1` argument for why it never overwrites unread data, and traces for `m = 0` and for "all of `nums2` smaller".

## 7. Interview script: code it and test it

### What I say while coding

> "`i` is `m − 1`, `j` is `n − 1`, `k` is `m + n − 1`. The loop condition is `j >= 0`, not both pointers, because leftover `nums1` values are already in place."

> "Inside, I check `i >= 0` first, so I never read `nums1[-1]` when `nums1` has run out or `m` is 0."

> "Strict `>` means a tie takes from `nums2`. Either way is correct for integers."

### Testing out loud

**Normal case:** `[1, 4, 7, 0, 0, 0]`, `[2, 4, 5]`: as in the dry run, `[1, 2, 4, 4, 5, 7]`.

**`m = 0`:** `nums1 = [0]`, `nums2 = [3]`. `i = −1`, `j = 0`, `k = 0`. The `i >= 0` check fails, so 3 goes to slot 0. `[3]`. Correct, and no read of `nums1[-1]`.

**`n = 0`:** `nums1 = [5]`, `m = 1`, `nums2 = []`. `j = −1`, so the loop never runs. `[5]`, unchanged.

**All of `nums2` smaller:** `[4, 5, 0, 0]`, `[1, 2]`: the second dry run, `[1, 2, 4, 5]`.

**All of `nums2` larger:** `[1, 2, 0, 0]`, `[3, 4]`. 2 > 4? No: 4 → slot 3. 2 > 3? No: 3 → slot 2. `j = −1`, stop with `k = i = 1`. `[1, 2, 3, 4]`; `nums1`'s values were never moved.

**Ties and real zeros:** `[-1, 0, 0, 0]` with `m = 2` and `nums2 = [0, 0]`. Every comparison is `0 > 0` or `-1 > 0`, false, so `nums2`'s zeros go to slots 3 and 2, the loop stops, and `[-1, 0, 0, 0]` is correct. The zero at slot 1 is real data and stays.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1–2 min | Placeholders, duplicates, `m = 0` and `n = 0` allowed |
| Baseline | about 30 s | Copy and sort, O((m + n) log(m + n)) |
| Derive | 2–3 min | Forward merge needs a copy; backward merge doesn't; the `k = i + j + 1` argument |
| Code | 2 min | Approach 3 |
| Trace | 3 min | Normal, `m = 0`, `n = 0`, all of `nums2` smaller |

The time should go into the safety argument and the traces. If you are stuck on the in-place version, write Approach 2 first: it is linear, and the step from it to the backward merge is a good thing to reason through out loud.

## 9. Interviewer challenges

### About correctness

#### Why can't the write at `k` overwrite a `nums1` value you still need?

**What they are testing:** whether you can prove the in-place step safe, rather than hoping.

**How to reason:** count the unplaced values. They are i + 1 from `nums1` and j + 1 from `nums2`, and they must fill slots 0 to k.

**What I say:** "There are (i + 1) + (j + 1) values left to place, in slots 0 to k, so k = i + j + 1. The loop runs only while j ≥ 0, so k ≥ i + 1: the write slot is always strictly to the right of the last unread `nums1` value."

**Nuance:** the argument also explains the stopping rule: when j becomes −1, k equals i, and the write pointer has caught up with values that are already in place.

#### Why does the loop stop when `nums2` runs out, but not when `nums1` runs out?

**What they are testing:** whether the asymmetry is understood or memorized.

**How to reason:** the leftover values of the two arrays are in different places. `nums1`'s are already inside `nums1`; `nums2`'s are not.

**What I say:** "If `nums2` runs out first, the remaining `nums1` values are the smallest ones and they're already in slots 0 to i, in order, so there's nothing to do. If `nums1` runs out first, the remaining `nums2` values still have to be copied in, so the loop keeps going, and the `i >= 0` check sends every step to `nums2`."

**Nuance:** writing `while (i >= 0 && j >= 0)` without a drain loop for `nums2` is the most common bug on this problem; see section 11.

### About trade-offs

#### Why not merge from the front, like merge sort does?

**What they are testing:** whether you see where the free space is.

**How to reason:** a front-to-back merge writes into slot 0 first, which holds a real `nums1` value that may not have been placed yet.

**What I say:** "The free space is at the back. Merging forward would overwrite `nums1[0]` the first time `nums2[0]` is smaller, so I'd need to copy `nums1`'s values out first: O(m) space. Going backwards writes into the free slots first, so no copy is needed."

**Nuance:** merge sort's merge step is not in place for the same reason; it uses an auxiliary array. This problem is special because the free space is exactly where the largest values go.

## 10. Follow-up questions the interviewer might ask

**"What if the free space were at the front of `nums1`, with the real values at the back?"**
Merge forward instead: the smallest value goes to slot 0, which is free. The same counting argument holds in mirror image. O(m + n) time, O(1) space.

**"What if there were no extra space in `nums1`, and both arrays had to end up sorted across `nums1` then `nums2`?"**
That is merging without extra space. A simple method: for each slot of `nums1` from the left, if it is larger than `nums2[0]`, swap them, then move the new `nums2[0]` into its sorted place by insertion. O(m · n) time, O(1) space. Faster in-place methods exist (gap-based shell-sort-style merging), but they are much harder to get right in an interview.

**"What if you had k sorted arrays to merge?"**
Use a min-heap holding the front of each array: O(T log k) time for T values in total, O(k) space. Or merge pairs in rounds, which is also O(T log k). See [[nc-merge-k-sorted-lists|Merge K Sorted Lists]].

**"What if the inputs were linked lists?"**
Then no shifting or free space is involved: relink nodes in order with a dummy head. O(m + n) time, O(1) space. That is [[nc-merge-two-sorted-lists|Merge Two Sorted Lists]].

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Treating the trailing zeros as values.** With `m = 0` and `nums1 = [0]`, a solution that compares against `nums1[0]` is comparing against a placeholder. Use `m`, not the array contents, to know what is real.
- **Merging forward in place, without a copy.** It overwrites `nums1` values before reading them. With `nums1 = [3, 4, 0, 0]`, `m = 2`, `nums2 = [1, 2]`, the first step writes 1 over the 3, and the result is `[1, 1, 1, 2]`.

### Implementation mistakes

> [!MISTAKE] Stopping when either array runs out
> `while (i >= 0 && j >= 0)` with no loop afterwards to copy the rest of `nums2`. When `nums2`'s values are the smallest, they are never written: `nums1 = [4, 5, 0, 0]`, `m = 2`, `nums2 = [1, 2]` ends as `[4, 5, 4, 5]`. Loop on `j >= 0` alone, or add a drain loop for `nums2`.

- **Reading `nums1[i]` without checking `i >= 0`.** With `m = 0`, `nums1 = [0]`, `nums2 = [1]`, the comparison reads `nums1[-1]` and throws `ArrayIndexOutOfBoundsException`.
- **Starting `k` at `m + n`.** That is one past the end; the last slot is `m + n − 1`.
- **Returning a new array.** The method is `void`; the judge reads `nums1`. Assigning `nums1 = result` inside the method changes only the local reference.

## 12. Pattern recognition

**The pattern:** a two-pointer merge of sorted sequences, run from the end so that the output region (free space at the back) never overlaps unread input. The general lesson: when writing in place, choose the direction in which the write pointer stays behind the read pointer.

**Signals in the problem statement:**

- Two sorted inputs combined into one sorted output.
- "In place", with the spare room at one specific end of the array.
- A follow-up asking for linear time when sorting is the obvious answer.

**Related problems in this list:**

- [[nc-merge-two-sorted-lists|Merge Two Sorted Lists]]: the same merge on linked lists, where no in-place hazard exists.
- [[nc-merge-strings-alternately|Merge Strings Alternately]]: walking two inputs and draining the leftover, without comparisons.
- [[nc-remove-element|Remove Element]]: a write pointer that must never overtake unread data, run forwards.
- [[nc-sort-colors|Sort Colors]]: in-place rearrangement where each pointer's region has an invariant.
- [[nc-merge-k-sorted-lists|Merge K Sorted Lists]]: the merge generalized with a heap.

**Takeaway:** when the free space is at the back, fill from the back. Count the unplaced values to prove the write pointer never overtakes the read pointer.

## 13. 60-second revision card

**Key insight:** the largest values belong in the free slots at the back, so merge from largest to smallest.

**Invariant:** `k = i + j + 1`; slots after `k` hold the largest values in order. While `j ≥ 0`, `k > i`, so no unread `nums1` value is overwritten. When `j < 0`, `k = i` and the rest is already in place.

**Complexity:** O(m + n) time, O(1) auxiliary space. Copy-and-sort is O((m + n) log(m + n)); forward merge needs O(m) extra.

**Code skeleton:**

```java title="Merge Sorted Array from the back"
class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1, j = n - 1, k = m + n - 1;
        while (j >= 0)
            nums1[k--] = (i >= 0 && nums1[i] > nums2[j]) ? nums1[i--] : nums2[j--];
    }
}
```

**Main traps:**

- Loop while `j >= 0`; do not stop when `i` runs out.
- Check `i >= 0` before reading `nums1[i]`.
- The trailing zeros are placeholders, not values.

**What to say in one breath:** "I merge from the back: `i` and `j` on the last real values, `k` on the last slot, and I place the larger of the two each step. Since `k = i + j + 1`, the write is always right of every unread `nums1` value while `nums2` has values left, and once `nums2` is done the rest of `nums1` is already in place. O(m + n) time, O(1) space."
