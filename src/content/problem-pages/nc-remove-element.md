---
problemId: nc-remove-element
title: Remove Element
source: neetcode
sourceUrl: https://leetcode.com/problems/remove-element/
difficulty: easy
patterns: [arrays-hashing, hashing]
relatedLessons: [a2-two-pointers, a2-array-string-traversal, a1-big-o, a14-edge-cases]
companies: []
timeToSolve: 10
---

## 1. Problem restatement

You get an integer array `nums` and a value `val`. Remove every occurrence of `val` from the array **in place**, and return k, the number of elements that are not equal to `val`. After the call, the first k slots of `nums` must hold exactly those elements, in any order. Whatever is left in the slots from k onward does not matter.

The judge checks two things: the returned k, and that `nums[0 .. k − 1]`, sorted, equals the expected remaining elements, sorted.

**Example 1**

- Input: `nums = [4, 1, 4, 2]`, `val = 4`
- Output: `k = 2`, with `nums` starting `[1, 2, …]` (or `[2, 1, …]`)
- Why: two elements are not 4, namely 1 and 2. They must occupy slots 0 and 1, in either order. Slots 2 and 3 can hold anything.

**Example 2**

- Input: `nums = [5, 3, 5, 5, 0, 3]`, `val = 5`
- Output: `k = 3`, with the first three slots holding 3, 0 and 3 in some order
- Why: three of the six elements are not 5. The duplicate 3 must appear twice: this is a multiset, not a set.

**What the problem statement guarantees**

- 0 ≤ `nums.length` ≤ 100, so the array can be empty.
- 0 ≤ `nums[i]` ≤ 50 and 0 ≤ `val` ≤ 100, so `val` may not occur in the array at all.
- The work must be done in place, in the array you are given.
- The order of the kept elements may change, and the slots from k onward are ignored.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. It looks trivial, and that is the danger: most failed attempts are off-by-one errors and skipped elements, not a missing idea. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 10 minutes and talk out loud.
2. Decide what "remove" can even mean for a Java array, whose length is fixed.
3. Say the simplest correct method first, with its complexity.
4. Write the code, then trace it on `[5, 3, 5, 5, 0, 3]` with `val = 5`, and on `[]`.
5. Ask yourself what your code writes when nothing needs removing.

> [!HINT] Hint 1: a small nudge
> You cannot shrink the array. What does the judge actually look at after your method returns? Which part of the array is yours to rearrange freely?

> [!HINT] Hint 2: the kind of tool you need
> Think of the front of the array as a growing "result" region. You read elements one by one, and you need a second position that says where the next kept element should go. Can that second position ever get ahead of the one you are reading?

> [!HINT] Hint 3: almost the whole plan
> Keep two indices: one reads every element in order, the other marks the next free slot of the result region and starts at 0. When the element read is not `val`, copy it to the free slot and advance the free slot. At the end, the free-slot index is k. Then ask: if `val` is very rare, how many of those copies were needed?

**Check yourself before revealing the walkthrough**

- [ ] My method returns 0 for an empty array and for an array made entirely of `val`
- [ ] It returns `nums.length` when `val` does not occur
- [ ] It never skips an element after moving something into the current slot
- [ ] I can say how many writes it does, and whether it keeps the original order

## 3. Interview script: understand the problem (≈2 min)

**Me:** Let me say it back. I get an array and a value. I have to move every element that isn't `val` to the front of the array, return how many there are, and the rest of the array is garbage I don't care about. Right?

**Interviewer:** Right.

**Me:** It has to be in place, so no second array that I copy back at the end?

**Interviewer:** Correct. Constant extra memory.

**Me:** Does the order of the kept elements matter?

**Interviewer:** No, any order.

**Me:** That's useful: it means I'm allowed to move elements from the back to the front. Can `val` be absent? And can the array be empty?

**Interviewer:** Both. The array has at most 100 elements, values 0 to 50, and `val` is between 0 and 100.

**Me:** So `val` can be bigger than any element, and then the answer is just `nums.length`. Is there anything you care about beyond correctness, for example the number of writes to the array?

**Interviewer:** Correct and clear first. We can talk about writes afterwards.

**Me:** Let me do an example. `[5, 3, 5, 5, 0, 3]`, val 5. The keepers are 3, 0, 3, so k = 3. If I keep their order, the front becomes `3, 0, 3`, and slots 3 to 5 can be anything.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 0 ≤ n ≤ 100 | The empty array is valid input, and the code must return 0 for it without touching any index. With n this small even O(n²) is instant; the choice between approaches is about clarity and correctness, not speed. |
| 0 ≤ `nums[i]` ≤ 50, 0 ≤ `val` ≤ 100 | `val` may be absent, so "nothing to remove" is a normal case. Values are only compared, never added, so no overflow. |
| In place | No second array. The answer has to be built inside `nums`. |
| Order may change; slots from k on are ignored | I may overwrite anything, and I may bring elements from the end forward. Nothing has to be "cleared" after k. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Correctness and clarity matter more than the number of writes | I lead with the simplest linear method and keep the write-minimizing variant as a follow-up. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| No other code reads `nums` while my method runs | In-place algorithms leave the array in intermediate states. Single-threaded use is the normal assumption. |

### Edge cases I will keep in mind

- Empty array: return 0.
- Every element equals `val`: return 0.
- No element equals `val` (including `val` larger than every possible element): return n.
- A single element, kept or removed.
- `val` only at the end, or only at the start.
- Consecutive copies of `val`, which is where "skip the next element" bugs appear.

## 4. Think out loud: from first idea to best solution

### Approach 1: Delete by shifting left

#### What I say out loud

> "The most literal reading of 'remove' is what `ArrayList.remove(index)` does: when I find `val`, I shift everything after it one place left and shrink my logical length by one. Then I look at the same index again, because a new element has just moved into it."

> "That's correct, but each removal can shift almost the whole array. If every element is `val`, that's about n²/2 moves. With n ≤ 100 it would pass, but it isn't what you want to see."

#### Intuition

Keep a logical length `k`, initially n. Everything in `nums[0 .. k − 1]` is still "in the array". Deleting an element means closing the gap it leaves.

#### Algorithm

1. Set `k = n`, `i = 0`.
2. While `i < k`: if `nums[i] == val`, shift `nums[i + 1 .. k − 1]` one place left and decrement `k`; do **not** advance `i`. Otherwise advance `i`.
3. Return `k`.

#### Why it is correct

The invariant: `nums[0 .. i − 1]` contains no `val`, and `nums[0 .. k − 1]` holds exactly the elements not yet removed, in original order. A shift removes exactly one `val` and keeps everything else; advancing `i` happens only past a non-`val`. The loop ends with `i == k`, so all of `nums[0 .. k − 1]` is free of `val`, and nothing that was not `val` was lost.

#### Dry run

`nums = [4, 1, 4, 2]`, `val = 4`

| i | k | nums[i] | Action | `nums` afterwards |
|---|---|---|---|---|
| 0 | 4 | 4 | shift left, k = 3 | `[1, 4, 2, 2]` |
| 0 | 3 | 1 | keep, i = 1 | `[1, 4, 2, 2]` |
| 1 | 3 | 4 | shift left, k = 2 | `[1, 2, 2, 2]` |
| 1 | 2 | 2 | keep, i = 2 | `[1, 2, 2, 2]` |

`i == k`, so the loop stops. Returns 2 with `[1, 2]` in front.

#### Java code

```java title="Approach 1: delete by shifting left"
class Solution {
    public int removeElement(int[] nums, int val) {
        int k = nums.length;
        int i = 0;
        while (i < k) {
            if (nums[i] == val) {
                for (int j = i + 1; j < k; j++) {
                    nums[j - 1] = nums[j];   // close the gap
                }
                k--;                          // re-check index i: a new element is there now
            } else {
                i++;
            }
        }
        return k;
    }
}
```

#### Time complexity

**O(n²) in the worst case**, where n is `nums.length`. Each removal shifts up to k − 1 elements. If every element is `val`, the shifts move (n − 1) + (n − 2) + … + 0 = n(n − 1)/2 elements. If c elements are removed, the cost is O(n · c); with no `val` present it is a single O(n) scan.

#### Space complexity

**O(1) auxiliary space**: two indices.

#### The bridge to the next approach

> "Where does the time go? Every shift moves elements that I will look at again anyway, and it keeps their order and keeps the tail tidy, which nobody asked for. All I really need is for each kept element to end up somewhere in the front. So instead of closing each gap as it appears, I can let the gaps pile up and fill them as I go: keep a second index for 'where the next kept element goes', and copy each keeper there once."

### Approach 2: Read and write pointers (recommended)

#### What I say out loud

> "Two indices. `read` walks every element once. `write` is the next free slot of the result, starting at 0. When I read something that isn't `val`, I copy it to `write` and advance `write`. When I read `val`, I just move on. At the end `write` is k."

> "Is the copy safe? `write` only advances when `read` does, so `write` is never ahead of `read`. That means I only ever overwrite a slot I've already read, never one I still need."

#### Intuition

The front of the array becomes the answer, built left to right. Each kept element moves at most once, to its final slot. This is the same-direction (fast and slow) form of [[a2-two-pointers|Two Pointers]].

#### Algorithm

1. Set `write = 0`.
2. For each `read` from 0 to n − 1: if `nums[read] != val`, set `nums[write] = nums[read]` and increment `write`.
3. Return `write`.

#### Why it is correct

**The invariant:** before processing index `read`, the slots `nums[0 .. write − 1]` hold exactly the elements of the original `nums[0 .. read − 1]` that are not `val`, in their original order, and `write ≤ read`.

- It holds at the start: both indices are 0 and both ranges are empty.
- If `nums[read]` is not `val`, it is copied to slot `write`, which extends the result by exactly that element. Because `write ≤ read`, the slot being written has already been read (or is `read` itself), so no unread element is destroyed.
- If `nums[read]` is `val`, nothing changes except `read`, which keeps the invariant: the new element did not belong in the result.
- When `read == n`, the invariant says `nums[0 .. write − 1]` holds every non-`val` element, so `write` is k and the first k slots are right.

**The 20-second version to say to the interviewer:**

> "`write` marks the end of the cleaned prefix. Every non-`val` element I read gets copied there once, and `val` is skipped. `write` never passes `read`, so I only overwrite slots I've already read. At the end the prefix holds exactly the kept elements, and its length is the answer."

#### Dry run

`nums = [5, 3, 5, 5, 0, 3]`, `val = 5`

| read | nums[read] | Action | write after | `nums` afterwards |
|---|---|---|---|---|
| 0 | 5 | skip | 0 | `[5, 3, 5, 5, 0, 3]` |
| 1 | 3 | copy to slot 0 | 1 | `[3, 3, 5, 5, 0, 3]` |
| 2 | 5 | skip | 1 | `[3, 3, 5, 5, 0, 3]` |
| 3 | 5 | skip | 1 | `[3, 3, 5, 5, 0, 3]` |
| 4 | 0 | copy to slot 1 | 2 | `[3, 0, 5, 5, 0, 3]` |
| 5 | 3 | copy to slot 2 | 3 | `[3, 0, 3, 5, 0, 3]` |

Returns 3, with `[3, 0, 3]` in front, in original order. Slots 3 to 5 are leftovers.

#### Java code

```java title="Approach 2: read and write pointers (recommended)"
class Solution {
    public int removeElement(int[] nums, int val) {
        int write = 0;                        // next free slot of the kept prefix
        for (int read = 0; read < nums.length; read++) {
            if (nums[read] != val) {
                nums[write] = nums[read];
                write++;
            }
        }
        return write;
    }
}
```

#### Time complexity

**O(n) in every case.** One pass; each iteration does one comparison and at most one write. It writes exactly n − c times, where c is the number of copies of `val`.

#### Space complexity

**O(1) auxiliary space**: two indices.

#### The bridge to the next approach

> "That's linear and simple. One thing it wastes: if `val` is rare, almost every element is copied onto itself or shifted by one place. With `[1, 2, 3, 4, 5]` and val 1 it does four writes, to remove one element. Since order doesn't matter, I could instead fill each hole with the last element and shrink the end. Then the number of writes equals the number of removals."

### Approach 3: Replace with the last element

#### What I say out loud

> "When I find `val` at index `i`, I copy the last element of the live region into slot `i` and shrink the region by one. I don't advance `i`, because the element I just brought in hasn't been checked; it might be `val` too. When `nums[i]` isn't `val`, I advance."

#### Intuition

Order does not matter, so a hole can be filled by any live element. The last one is cheapest to take, because taking it shrinks the region without leaving a new hole.

#### Algorithm

1. Set `i = 0`, `n = nums.length` (the live region is `nums[0 .. n − 1]`).
2. While `i < n`: if `nums[i] == val`, set `nums[i] = nums[n − 1]` and decrement `n`. Otherwise increment `i`.
3. Return `n`.

#### Why it is correct

The invariant: `nums[0 .. i − 1]` contains no `val`, and `nums[0 .. n − 1]` holds, as a multiset, exactly the non-`val` elements of the original plus the not-yet-checked elements. Replacing `nums[i]` (a `val`) with `nums[n − 1]` and shrinking drops exactly one `val` and keeps every other element. Because `i` is not advanced after a replacement, the newly placed element is checked on the next iteration. The loop ends when `i == n`, so `nums[0 .. n − 1]` holds exactly the kept elements.

#### Dry run

`nums = [6, 7, 6, 8]`, `val = 6`

| i | n | nums[i] | Action | `nums` afterwards |
|---|---|---|---|---|
| 0 | 4 | 6 | copy `nums[3] = 8` into slot 0, n = 3 | `[8, 7, 6, 8]` |
| 0 | 3 | 8 | keep, i = 1 | `[8, 7, 6, 8]` |
| 1 | 3 | 7 | keep, i = 2 | `[8, 7, 6, 8]` |
| 2 | 3 | 6 | copy `nums[2]` onto itself, n = 2 | `[8, 7, 6, 8]` |

`i == n`, so the loop stops. Returns 2, with `[8, 7]` in front: the right multiset, in a different order from the input. Two writes for two removals. The last row shows that when the `val` is itself the last live element, the "copy" is a harmless self-assignment.

#### Java code

```java title="Approach 3: replace with the last element"
class Solution {
    public int removeElement(int[] nums, int val) {
        int i = 0;
        int n = nums.length;                  // live region is nums[0 .. n-1]
        while (i < n) {
            if (nums[i] == val) {
                nums[i] = nums[n - 1];        // fill the hole from the end
                n--;                          // do not advance i: the new element is unchecked
            } else {
                i++;
            }
        }
        return n;
    }
}
```

#### Time complexity

**O(n) in every case.** Each iteration either advances `i` or decrements `n`, and the loop stops when they meet, so there are exactly n iterations. It writes exactly c times, one per removed element.

#### Space complexity

**O(1) auxiliary space.**

## 5. Comparison table

n = `nums.length`, c = number of elements equal to `val`. Nothing hashes or sorts, so expected and worst case coincide.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Shift left | O(n · c) | O(n²) | O(1) |
| 2. Read and write pointers | O(n) | O(n) | O(1) |
| 3. Replace with last | O(n) | O(n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Shift left | Mirrors `ArrayList.remove`; keeps order | Quadratic; easy to skip an element | Only as the stated baseline |
| 2. Read and write pointers | Linear, stable (keeps order), shortest correct code | Writes n − c times even when `val` is rare | The default answer, and required when order matters |
| 3. Replace with last | Writes only c times | Changes the order; the "don't advance `i`" rule is easy to break | `val` is rare and writes are expensive, and order does not matter |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2. It is linear, stable, and has the fewest ways to go wrong.

**Is it optimal?** In time, yes. In the worst case a correct algorithm must inspect essentially every element, because an element it has not looked at could be `val` and would then be counted wrongly. That is an Ω(n) worst-case lower bound, which both linear approaches meet. Space is already O(1).

**When Approach 3 is better:** when `val` is rare and writes are costly (for example, writes go to slow or wear-limited storage), and order does not matter. Mention it after Approach 2 as a refinement in one or two sentences, and code it only if asked.

**When to stop:** once you have the linear solution, its invariant, and one sentence about the write-count trade-off.

## 7. Interview script: code it and test it

### What I say while coding

> "Signature: `int removeElement(int[] nums, int val)`. I name the indices `read` and `write` rather than `i` and `j`, because the names carry the invariant."

> "`write` starts at 0. The loop goes over every `read`. Only a non-`val` element is copied, and only then does `write` move."

> "I return `write`. It's both the count and the end of the cleaned prefix."

### Testing out loud

**Normal case:** `[5, 3, 5, 5, 0, 3]`, val 5. As in the dry run: skip, copy 3 to 0, skip, skip, copy 0 to 1, copy 3 to 2. Returns 3, prefix `[3, 0, 3]`. Correct.

**Empty array:** `[]`, any `val`. The loop body never runs; returns 0. No index is touched.

**Everything removed:** `[7, 7, 7]`, val 7. Every element is skipped; `write` stays 0. Returns 0.

**Nothing removed:** `[1, 2, 3]`, val 9. Every element is copied onto itself (`write == read` each time). Returns 3, array unchanged. Correct, and it shows the wasted writes that Approach 3 avoids.

**`val` only at the end:** `[1, 2, 3, 4]`, val 4. Three self-copies, then a skip. Returns 3.

**Single element:** `[9]` with val 9 returns 0; `[9]` with val 1 returns 1.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1–2 min | In place, order free, empty allowed, `val` may be absent |
| Baseline | about 30 s | Shift-left, O(n²), not coded |
| Derive and justify | 1–2 min | Read and write pointers, the `write ≤ read` argument |
| Code | 2 min | Approach 2 |
| Trace and edge cases | 2 min | Normal case, empty, all removed, none removed |
| Refinement | about 1 min | Replace-with-last when writes matter |

The time should go into the trace and the edge cases: on this problem, a clean, tested solution is what distinguishes candidates. If you get stuck, draw the array, shade the slots that are "done", and ask where the next kept element should go.

## 9. Interviewer challenges

### About correctness

#### How do you know `nums[write] = nums[read]` never overwrites something you still need?

**What they are testing:** whether you can state the invariant that makes in-place copying safe.

**How to reason:** compare the two indices. `write` increases only in iterations where `read` also increases, and both start at 0.

**What I say:** "`write` never gets ahead of `read`. So the slot I write to is either the one I'm reading right now or one I've already read and either copied forward or decided to drop. Nothing unread is ever overwritten."

**Nuance:** when no `val` has been seen yet, `write == read` and every copy is a self-assignment. You can guard it with `if (write != read)`, which saves writes but not comparisons.

#### In Approach 3, why don't you advance `i` after a replacement?

**What they are testing:** whether you understand the loop, or copied it.

**How to reason:** the element just moved into slot `i` came from the unchecked end. It may itself be `val`.

**What I say:** "Because the element I just brought in hasn't been checked. If I advance, I skip it. With `[2, 3, 3]` and val 3, a `for` loop that always increments `i` copies the last 3 over the middle 3, moves past it, and returns 2, while the right answer is 1."

**Nuance:** this is the same bug as advancing after a shift in Approach 1: whenever a new element moves into the current slot, that slot has to be checked again.

### About trade-offs

#### When would you prefer Approach 3 over Approach 2?

**What they are testing:** whether you can count something other than time.

**How to reason:** both make n comparisons. Count writes: Approach 2 writes once per kept element, Approach 3 once per removed element.

**What I say:** "When `val` is rare and writes are expensive, and the caller doesn't care about order. Then replace-with-last does c writes instead of n − c. If order matters, Approach 2, because replace-with-last moves elements from the end to the front."

**Nuance:** if `val` is very common, Approach 2 does fewer writes. Neither wins in general; the ratio of c to n decides.

#### Is O(n) optimal?

**What they are testing:** knowing when to stop.

**How to reason:** an algorithm that skips looking at some element cannot know whether it is `val`.

**What I say:** "Yes. In the worst case every element has to be inspected, since any one I skip could be `val` and change k. So there's an Ω(n) worst-case lower bound, and one pass meets it with O(1) extra space."

**Nuance:** the bound is about inspections. The number of writes can be lower than n, which is exactly what Approach 3 exploits.

## 10. Follow-up questions the interviewer might ask

**"What if the order of the kept elements must be preserved?"**
Use Approach 2: it is stable, because kept elements are copied in the order they are read. Approach 3 is not. O(n) time, O(1) space.

**"What if you have to remove every value in a set `S` rather than one value?"**
Replace `nums[read] != val` with a membership test. With values in 0..50 a `boolean[51]` gives an O(1) test and O(n + |S|) total time; for arbitrary values, a `HashSet` gives O(n + |S|) expected time and O(|S|) space.

**"What if the array is sorted and you must remove duplicates instead?"**
The same read and write pointers, but the keep condition becomes "differs from the last kept element", `nums[read] != nums[write − 1]`. O(n), O(1). That is [[nc-remove-duplicates-from-sorted-array|Remove Duplicates from Sorted Array]].

**"What if it were a linked list?"**
Then removal is cheap: relink around each matching node, with a dummy head so that removing the first node needs no special case. O(n) time, O(1) space, and no shifting at all.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Trying to shrink the array.** A Java array's length cannot change. The contract is "the first k slots", and the rest is ignored.
- **Assuming the order must be kept,** and dismissing the replace-with-last idea. The statement says any order.
- **Allocating a second array and copying back.** It works on the judge, but violates the in-place requirement and the O(1) space the interviewer asked for.

### Implementation mistakes

> [!MISTAKE] Advancing after moving an element into the current slot
> In the shift version, a `for` loop that always increments `i` skips the element that just shifted in: `[4, 4, 1]` with val 4 returns 2 with `[4, 1]` in front, a 4 left behind. In the replace-with-last version, `[2, 3, 3]` with val 3 returns 2 instead of 1. Re-check the slot whenever something new lands in it.

- **Returning `write + 1` or `write − 1`.** `write` is already the count: it is the index of the next free slot.
- **Starting `n` at `nums.length - 1` in Approach 3,** then reading `nums[n - 1]`: that skips the true last element. Keep `n` as a length, not an index.
- **Using `ArrayList.remove` on a boxed copy.** That is O(n²), and the judge reads `nums`, not the list.

## 12. Pattern recognition

**The pattern:** in-place filtering with a read pointer and a write pointer moving in the same direction. The write pointer marks the end of the finished prefix and never overtakes the read pointer.

**Signals in the problem statement:**

- "In place", "return the new length", "the first k elements", "elements beyond k do not matter".
- A keep-or-drop decision that depends on one element at a time.

**Related problems in this list:**

- [[nc-remove-duplicates-from-sorted-array|Remove Duplicates from Sorted Array]]: the same two pointers with a different keep condition.
- [[nc-sort-colors|Sort Colors]]: in-place partitioning into three regions, a generalization of "kept prefix, ignored tail".
- [[nc-merge-sorted-array|Merge Sorted Array]]: a write pointer that must never overtake unread data, here run from the back.
- [[nc-concatenation-of-array|Concatenation of Array]]: index-driven writes, without the in-place difficulty.

**Takeaway:** "remove in place and return the count" means: a write pointer for the finished prefix, a read pointer for everything, and the invariant `write ≤ read`.

## 13. 60-second revision card

**Key insight:** you don't delete, you compact. Copy each kept element to the next free front slot.

**Invariant:** `nums[0 .. write − 1]` holds exactly the kept elements read so far, and `write ≤ read`.

**Complexity:** O(n) time, O(1) auxiliary space; n − c writes. Replace-with-last does only c writes but changes the order. Ω(n) worst-case lower bound: an uninspected element could be `val`.

**Code skeleton:**

```java title="Remove Element in six lines"
class Solution {
    public int removeElement(int[] nums, int val) {
        int write = 0;
        for (int read = 0; read < nums.length; read++)
            if (nums[read] != val) nums[write++] = nums[read];
        return write;
    }
}
```

**Main traps:**

- Return `write`, not `write ± 1`.
- Whenever an element moves into the current slot (shift or replace), check that slot again before advancing.
- Empty input and "`val` absent" are normal cases.

**What to say in one breath:** "I compact in place with two pointers: `read` scans everything, `write` marks where the next kept element goes. Non-`val` elements are copied to `write`, which never passes `read`, so nothing unread is overwritten. One pass, O(n) time, O(1) space, order kept. If `val` were rare and writes expensive, I'd fill holes from the end instead."
