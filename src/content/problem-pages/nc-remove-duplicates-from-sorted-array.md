---
problemId: nc-remove-duplicates-from-sorted-array
title: Remove Duplicates from Sorted Array
source: neetcode
sourceUrl: https://leetcode.com/problems/remove-duplicates-from-sorted-array/
difficulty: easy
patterns: [two-pointers]
relatedLessons: [a2-two-pointers, a2-array-string-traversal, a3-binary-search, a14-edge-cases]
companies: []
timeToSolve: 10
---

## 1. Problem restatement

You get an integer array `nums` sorted in non-decreasing order. Rearrange it **in place** so that each distinct value appears exactly once at the front, in the same (sorted) order, and return k, the number of distinct values. The first k slots of `nums` must hold those values; whatever is in the slots from k onward is ignored.

The judge checks two things: the returned k, and that `nums[0 .. k − 1]` equals the distinct values in sorted order, slot by slot. Unlike some "remove" problems, the order is checked, not just the multiset.

**Example 1**

- Input: `nums = [1, 1, 2, 3, 3]`
- Output: `k = 3`, with `nums` starting `[1, 2, 3, …]`
- Why: the distinct values are 1, 2, 3. They must sit in slots 0 to 2 in that order; slots 3 and 4 may hold anything.

**Example 2**

- Input: `nums = [-2, -2, 0, 3, 3, 3]`
- Output: `k = 3`, with `nums` starting `[-2, 0, 3, …]`
- Why: three distinct values, one of them negative. Runs of different lengths each collapse to one copy.

**What the problem statement guarantees**

- 1 ≤ `nums.length` ≤ 3 × 10⁴, so the array is never empty.
- −100 ≤ `nums[i]` ≤ 100.
- `nums` is sorted in non-decreasing order.
- The work is done in place; the order of the kept values is the sorted order; the slots from k onward are ignored.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The idea is quick to find; the practice is in stating exactly what each index means, so that the returned count is not off by one. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 10 minutes and talk out loud.
2. Ask yourself what sortedness tells you about where duplicates of a value can be.
3. Write the code, then trace it on `[1, 1, 2, 3, 3]` and on a single-element array.
4. Say in one sentence what your write index means after each step.

> [!HINT] Hint 1: a small nudge
> In a sorted array, where are all the copies of one value? How can you tell, looking at one element, that it is the first copy of its value?

> [!HINT] Hint 2: the kind of tool you need
> Build the answer at the front of the array while you scan. You need one position that reads every element and another that says where the next distinct value goes. Which already-placed value should a newly read element be compared with?

> [!HINT] Hint 3: almost the whole plan
> The first element is always kept, so start the write position at 1. For each later element, compare it with the last value you kept, `nums[write − 1]`; if it differs, copy it to `nums[write]` and advance `write`. At the end, `write` is the count. Check whether the write can ever overwrite an element you have not read yet.

**Check yourself before revealing the walkthrough**

- [ ] My method returns 1 for a single-element array and for an array where every value is the same
- [ ] It returns n when all values are already distinct
- [ ] I can say what `write` means at every step, and why the returned value is the count, not the count minus one
- [ ] I never read an index past the end of the array

## 3. Interview script: understand the problem (≈2 min)

**Me:** Let me say it back. The array is sorted. I have to compact it so the front holds each distinct value once, in order, and return how many there are. What's after that doesn't matter.

**Interviewer:** Right.

**Me:** In place, so O(1) extra memory?

**Interviewer:** Yes.

**Me:** The array has at least one element, up to 30,000, and values from −100 to 100. So the answer is at least 1, and at most 201, because there are only 201 possible values.

**Interviewer:** Correct.

**Me:** And because it's sorted, every copy of a value is in one contiguous run. So "first copy of its value" just means "different from the element before it". Let me check on `[1, 1, 2, 3, 3]`: the first copies are at indices 0, 2 and 3. Those three values go to slots 0, 1, 2, and k is 3.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 3 × 10⁴ | The array is never empty, so slot 0 always holds a kept value and the write index can start at 1. An O(n²) method that shifts elements would do up to about n²/2 ≈ 4.5 × 10⁸ moves on an array of one repeated value: too slow to offer as an answer. |
| −100 ≤ values ≤ 100 | Values are only compared, never added, so no overflow. There are at most 201 distinct values, so k ≤ 201; this matters for one follow-up in section 9. |
| Sorted non-decreasing | Equal values are adjacent. "Is this a new value?" needs only a comparison with one neighbour, not a set. |
| In place, order kept, tail ignored | The answer is built in the front of `nums`. Nothing after slot k − 1 needs clearing. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| O(1) extra memory | A second array or a `HashSet` is a baseline to mention, not the answer. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| No other code reads `nums` while the method runs | The array passes through intermediate states. |

### Edge cases I will keep in mind

- A single element: k = 1.
- Every element equal: k = 1.
- All values already distinct: k = n, and nothing needs to move.
- A run at the very end, such as `[1, 2, 2]`, where the last kept value is followed only by duplicates.
- Negative values and the bounds −100 and 100.

## 4. Think out loud: from first idea to best solution

### Approach 1: Collect distinct values into a buffer, then copy back

#### What I say out loud

> "The simplest thing I'm sure of: walk the array, and whenever an element differs from the one before it, it's a new value, so I add it to a separate buffer. Then I copy the buffer into the front of `nums` and return its size."

> "That uses O(n) extra memory, which breaks the in-place requirement, but it gets the logic right. Then I'll ask whether the buffer is needed."

#### Intuition

In a sorted array, an element starts a new value exactly when it differs from its left neighbour (or it is the first element). Collecting those elements in order gives the answer.

#### Algorithm

1. `buffer[0] = nums[0]`, `count = 1`.
2. For `i` from 1 to n − 1: if `nums[i] != nums[i − 1]`, append `nums[i]` to the buffer.
3. Copy `buffer[0 .. count − 1]` into `nums[0 .. count − 1]`. Return `count`.

#### Why it is correct

Because the array is sorted, all copies of a value form one contiguous run. The first element of each run is the only element that differs from its left neighbour (or has none), so step 2 adds each distinct value exactly once, in the order the runs appear, which is sorted order. Nothing is written to `nums` until the scan is over, so the comparisons always see original values.

#### Dry run

`nums = [-2, -2, 0, 3, 3, 3]`

| i | `nums[i]` | `nums[i − 1]` | Action | buffer |
|---|---|---|---|---|
| 0 | −2 | — | always kept | `[-2]` |
| 1 | −2 | −2 | same, skip | `[-2]` |
| 2 | 0 | −2 | new, add | `[-2, 0]` |
| 3 | 3 | 0 | new, add | `[-2, 0, 3]` |
| 4 | 3 | 3 | same, skip | `[-2, 0, 3]` |
| 5 | 3 | 3 | same, skip | `[-2, 0, 3]` |

Copy back: `nums = [-2, 0, 3, 3, 3, 3]`. Returns 3.

#### Java code

```java title="Approach 1: buffer, then copy back"
class Solution {
    public int removeDuplicates(int[] nums) {
        int[] buffer = new int[nums.length];
        int count = 0;
        buffer[count++] = nums[0];                 // n >= 1, so the first value always exists
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] != nums[i - 1]) {          // first element of a new run
                buffer[count++] = nums[i];
            }
        }
        System.arraycopy(buffer, 0, nums, 0, count);
        return count;
    }
}
```

#### Time complexity

**O(n) in every case**, where n = `nums.length`: one scan and one copy of k ≤ n values.

#### Space complexity

**O(n) auxiliary space** for the buffer. (Sized to n for simplicity; given this problem's value range, k ≤ 201, so a buffer of 201 would do, but sizing by the value range is fragile and still not "in place".)

#### The bridge to the next approach

> "Do I really need the buffer? The buffer grows by one only when the scan index moves past a new value, so its size is always at most the number of elements I've read. That means I could write the buffer into the front of `nums` itself: the slot I'd write to has always been read already. The only thing to check is that my comparison still sees the right value after writes start happening."

### Alternative: delete each duplicate by shifting

The literal reading of "remove" deletes each duplicate and shifts the rest of the array left by one, like `ArrayList.remove`. It is correct and O(1) in space, but every deletion can shift almost the whole array. On an array of 30,000 copies of one value that is about n²/2 ≈ 4.5 × 10⁸ element moves, so it is a baseline to name and reject, not code to offer.

### Approach 2: Read and write pointers in place (recommended)

#### What I say out loud

> "Two indices. `write` is the length of the deduplicated prefix: it starts at 1, because `nums[0]` is always kept. `read` goes from 1 to the end. If `nums[read]` differs from the last kept value, `nums[write − 1]`, it's a new value: I copy it to `nums[write]` and advance `write`. At the end, `write` is k."

> "Safety: `write` only advances when `read` does, and starts no higher, so `write ≤ read` throughout. I only ever write to a slot I've already read."

#### Intuition

This is Approach 1 with the buffer laid over the front of `nums`. The front of the array is the answer, growing left to right; the read index scans the rest. It is the same read/write compaction as [[nc-remove-element|Remove Element]], with a different keep condition: "differs from the last kept value" instead of "not equal to `val`".

#### Algorithm

1. `write = 1`.
2. For `read` from 1 to n − 1: if `nums[read] != nums[write − 1]`, set `nums[write] = nums[read]` and increment `write`.
3. Return `write`.

#### Why it is correct

**The invariant:** before processing index `read`, the prefix `nums[0 .. write − 1]` holds the distinct values of the original `nums[0 .. read − 1]`, each once, in sorted order; and 1 ≤ `write` ≤ `read`.

- **Start:** `read = write = 1`, and the prefix `[nums[0]]` is the single distinct value of the first element.
- **Comparing with `nums[write − 1]` is right.** That slot holds the last kept value, which is the largest value seen so far, because the input is sorted. A new element is either equal to it (another copy of the same run) or larger (a new value); it cannot be a value kept earlier, since smaller values' runs have ended.
- **The write never destroys unread data.** `write ≤ read`, so slot `write` has been read already (or is `read` itself, a self-copy).
- **Maintenance:** if `nums[read]` is new, appending it keeps the prefix distinct and sorted and increments both sides of the invariant; if not, the prefix already contains it.
- **End:** `read = n`, so the prefix holds every distinct value of the whole array, in order, and `write` is its length, k.

Comparing with `nums[read − 1]` instead also works here: the only write that can land in slot `read − 1` happens when `write == read − 1` during the previous step, and that write copies `nums[read − 1]` onto itself, so the slot still holds the original value. The `write − 1` form is the one that generalizes (see section 10).

**The 20-second version to say to the interviewer:**

> "`write` is the length of the deduplicated prefix, starting at 1. For each later element, I compare it with the last kept value, `nums[write − 1]`. Since the array is sorted, it's either another copy of that value or a new larger one; if new, I append it at `write`. `write` never passes `read`, so I only overwrite slots I've read. At the end, `write` is the count."

#### Dry run

`nums = [1, 1, 2, 3, 3]`

| read | `nums[read]` | `nums[write − 1]` | Action | write after | `nums` afterwards |
|---|---|---|---|---|---|
| — | — | — | start | 1 | `[1, 1, 2, 3, 3]` |
| 1 | 1 | 1 | same, skip | 1 | `[1, 1, 2, 3, 3]` |
| 2 | 2 | 1 | new, copy to slot 1 | 2 | `[1, 2, 2, 3, 3]` |
| 3 | 3 | 2 | new, copy to slot 2 | 3 | `[1, 2, 3, 3, 3]` |
| 4 | 3 | 3 | same, skip | 3 | `[1, 2, 3, 3, 3]` |

Returns 3, with `[1, 2, 3]` in front.

#### Java code

```java title="Approach 2: read and write pointers (recommended)"
class Solution {
    public int removeDuplicates(int[] nums) {
        int write = 1;                                  // nums[0] is always kept (n >= 1)
        for (int read = 1; read < nums.length; read++) {
            if (nums[read] != nums[write - 1]) {        // differs from the last kept value
                nums[write] = nums[read];
                write++;
            }
        }
        return write;                                   // length of the deduplicated prefix
    }
}
```

#### Time complexity

**O(n) in every case.** One pass, one comparison and at most one write per element.

#### Space complexity

**O(1) auxiliary space**: two indices.

## 5. Comparison table

n = `nums.length`, k = number of distinct values. Nothing is hashed or randomized, so expected and worst case coincide.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Shift on delete (not coded) | O(n²) | O(n²) | O(1) |
| 1. Buffer, copy back | O(n) | O(n) | O(n) |
| 2. Read and write pointers | O(n) | O(n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Shift on delete | Literal reading of "remove" | Quadratic; about 4.5 × 10⁸ moves at the limit | Only as the baseline you reject |
| 1. Buffer, copy back | Comparisons never see modified data | Not in place | When the input must not be modified (return the buffer instead) |
| 2. Read and write pointers | Linear, in place, short | Needs the `write ≤ read` argument | The default answer |

## 6. Which solution to give, and when to stop optimizing

Give Approach 2. It is linear, constant space, and the same template as Remove Element, which interviewers like to see recognized. It is optimal for general sorted input: in the worst case, when most values are distinct and spread out, every element must be inspected (an uninspected element whose neighbours are, say, 10 and 20 could be a copy of one of them or a new value such as 15, and those two cases give different k), so there is an Ω(n) worst-case lower bound for an algorithm that learns values only by reading them. Stop once you have the code, the invariant and a trace; mention the binary-search idea in section 9 only if the interviewer asks whether you can beat O(n).

## 7. Interview script: code it and test it

### What I say while coding

> "`write` starts at 1, because the array is non-empty and its first element is always kept. If empty input were allowed, I'd return 0 first."

> "The loop compares with `nums[write − 1]`, the last value I kept, not with `nums[write]`, which is just the next free slot and holds stale data."

> "I return `write`: it is the count, because it's the length of the prefix."

### Testing out loud

**Normal case:** `[1, 1, 2, 3, 3]`: as in the dry run, returns 3 with `[1, 2, 3]` in front.

**Single element:** `[7]`. The loop body never runs; returns 1.

**All equal:** `[4, 4, 4, 4]`. Every comparison is 4 vs 4; returns 1, prefix `[4]`.

**Already distinct:** `[-100, 0, 100]`. Every element differs from the last kept one, and each is copied onto itself (`write == read`). Returns 3, array unchanged.

**Duplicates only at the end:** `[1, 2, 2]`. Read 1: 2 vs 1, copy to slot 1, `write = 2`. Read 2: 2 vs 2, skip. Returns 2 with `[1, 2]` in front.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1–2 min | In place, order kept, n ≥ 1, sorted means duplicates are adjacent |
| Baseline | about 1 min | Buffer and copy back, or shift-on-delete as the quadratic option |
| Derive | 1–2 min | Lay the buffer over the front; the `write ≤ read` argument |
| Code | 2 min | Approach 2 |
| Trace | 2 min | Normal, single element, all equal, already distinct |

Spend the time on the trace and on saying what `write` means; that is what prevents the off-by-one that most wrong answers to this problem have.

## 9. Interviewer challenges

### About correctness

#### Why compare with `nums[write − 1]` and not with `nums[read − 1]`?

**What they are testing:** whether you know which values are still trustworthy after in-place writes.

**How to reason:** `nums[write − 1]` is by construction the last kept value. For `nums[read − 1]`, check whether a write could have changed that slot.

**What I say:** "Both work here. `nums[write − 1]` is the last value I kept, which is what 'is this new?' really means. `nums[read − 1]` is also safe, because the only time slot `read − 1` gets written is when `write` equals it, and then it's a self-copy. I prefer `write − 1` because it's the version that generalizes, for example to 'keep at most two copies', where I compare with `nums[write − 2]`."

**Nuance:** comparing with `nums[write]` is a real bug: that slot is the next free position and holds stale data. On `[1, 2, 2]` it returns 1 instead of 2.

#### How do you know the returned value is k and not k − 1?

**What they are testing:** precise index semantics.

**How to reason:** decide what `write` means before writing the loop.

**What I say:** "`write` is the length of the deduplicated prefix, so the slots in use are 0 to `write − 1`, and its value is the count. If I'd defined it as the index of the last kept element, I'd have to return `write + 1`."

**Nuance:** both conventions are fine; mixing them is the bug.

### About optimality

#### Can you do better than O(n)?

**What they are testing:** whether you can use the constraints, and qualify a lower bound instead of reciting it.

**How to reason:** for general input with many distinct values, every element must be inspected. But here values are in −100..100, so k ≤ 201, and each run of equal values is contiguous.

**What I say:** "In general, no: if most values are distinct, every element has to be looked at, so Ω(n) in the worst case. But with only 201 possible values, n can be 30,000 while k is at most 201. Then I can jump over each run: from the start of a run, binary search for the first element larger than its value, write that value at `write`, and continue from there. That's O(k log n) comparisons and k writes, which beats n when runs are long."

**Nuance:** at n = 3 × 10⁴ both are instant, and the binary-search version has more ways to go wrong. It is worth mentioning, not worth coding unless asked.

## 10. Follow-up questions the interviewer might ask

**"What if each value may appear at most twice?"**
Same template: start `write` at 2 (or at n if n < 2) and keep `nums[read]` when it differs from `nums[write − 2]`. Because the array is sorted, if it equals the value two kept slots back, it would be a third copy. O(n), O(1). Generally, for at most c copies, compare with `nums[write − c]`.

**"What if the array is not sorted?"**
Adjacency no longer identifies duplicates. Track seen values: here a `boolean[201]` indexed by `value + 100` gives O(n) time and O(1) extra space for this fixed range, while preserving first-occurrence order. For unbounded values, a `HashSet` gives O(n) expected time and O(k) space; or sort first in O(n log n), which changes the order.

**"What if empty input were allowed?"**
Return 0 when `nums.length == 0` before the loop; otherwise `nums[0]` and `write = 1` would be wrong. The loop itself needs no change.

**"What if it were a sorted linked list?"**
Walk with one pointer and unlink `next` while it has the same value. O(n), O(1), no copying.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Reaching for a `HashSet`.** It works, but ignores sortedness and costs O(n) space; in a sorted array, duplicates are always adjacent.
- **Thinking the order can change,** as in Remove Element. Here the judge checks the first k slots in sorted order, so a "fill from the end" trick would fail.

### Implementation mistakes

> [!MISTAKE] Comparing with the next free slot instead of the last kept value
> `if (nums[read] != nums[write])` compares with stale data. On `[1, 2, 2]` with `write` starting at 1, `nums[1]` is already 2, so the new value 2 looks like a duplicate and the method returns 1. Compare with `nums[write − 1]`.

- **Returning the index of the last kept element.** With `write` as that index (starting at 0 and incremented before writing), `return write` gives k − 1: `[1, 1, 2]` returns 1. Return `write + 1`, or define `write` as a length.
- **Comparing with `nums[read + 1]`.** Looking ahead reads past the end on the last element: `ArrayIndexOutOfBoundsException` for `[1, 1, 2]`.
- **Clearing the tail.** Writing sentinels into slots k and beyond is unnecessary; the judge ignores them.

## 12. Pattern recognition

**The pattern:** in-place compaction with a read pointer and a write pointer moving in the same direction; the keep condition compares with the last kept value, which sortedness makes sufficient.

**Signals in the problem statement:**

- "Sorted", "in place", "return k", "the first k elements".
- A keep-or-drop decision that depends only on the element and its predecessor.

**Related problems in this list:**

- [[nc-remove-element|Remove Element]]: the same read/write compaction with the keep condition "not equal to `val`".
- [[nc-merge-sorted-array|Merge Sorted Array]]: in-place writes with an argument that the write pointer never overtakes unread data.
- [[nc-sort-colors|Sort Colors]]: in-place partitioning with an invariant per region.
- [[nc-contains-duplicate|Contains Duplicate]]: detecting duplicates without sortedness, where a hash set or a sort is needed.

**Takeaway:** in sorted data, "is this a duplicate?" is a comparison with one neighbour; combine it with a write pointer whose meaning (a length) you fix before writing the loop.

## 13. 60-second revision card

**Key insight:** sorted means each value's copies are one run; keep an element exactly when it differs from the last kept value.

**Invariant:** `nums[0 .. write − 1]` holds the distinct values of `nums[0 .. read − 1]` in order, and `write ≤ read`.

**Complexity:** O(n) time, O(1) auxiliary space. Ω(n) worst-case for general sorted input; with k ≤ 201 values, jumping runs by binary search is O(k log n).

**Code skeleton:**

```java title="Remove Duplicates in six lines"
class Solution {
    public int removeDuplicates(int[] nums) {
        int write = 1;
        for (int read = 1; read < nums.length; read++)
            if (nums[read] != nums[write - 1]) nums[write++] = nums[read];
        return write;
    }
}
```

**Main traps:**

- Compare with `nums[write − 1]`, not `nums[write]`.
- `write` is a length: return it as it is.
- Start at 1 because n ≥ 1; guard if empty input is possible.

**What to say in one breath:** "The array is sorted, so duplicates are adjacent. `write` is the length of the deduplicated prefix, starting at 1. For each later element, if it differs from the last kept value, `nums[write − 1]`, I copy it to `write` and advance. `write` never passes `read`, so nothing unread is overwritten. O(n) time, O(1) space, and `write` is the answer."
