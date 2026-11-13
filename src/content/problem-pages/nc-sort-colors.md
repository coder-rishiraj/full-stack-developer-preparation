---
problemId: nc-sort-colors
title: Sort Colors
source: neetcode
sourceUrl: https://leetcode.com/problems/sort-colors/
difficulty: medium
patterns: [arrays-hashing, hashing, two-pointers, counting]
relatedLessons: [a2-two-pointers, a3-counting-sort, a3-quick-sort, a2-frequency-counting]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

You get an array in which every value is 0, 1 or 2 (think red, white and blue). Rearrange it **in place** so that all the 0s come first, then all the 1s, then all the 2s. You may not use the library's sort function. The method returns nothing: the array you were given is the answer.

**Example 1**

- Input: `nums = [2, 0, 1, 2, 1, 0]`
- After the call: `nums = [0, 0, 1, 1, 2, 2]`
- Why: two of each colour, grouped in the order 0, 1, 2.

**Example 2**

- Input: `nums = [1, 2, 0]`
- After the call: `nums = [0, 1, 2]`
- Why: each colour appears once. Small, but it is the input that exposes the most common bug in the fast solution.

**What the problem statement guarantees and requires**

- 1 ≤ n ≤ 300, where n is the length of `nums`.
- Every `nums[i]` is 0, 1 or 2.
- Sort in place, without the library sort.
- The follow-up asks for a one-pass algorithm using only constant extra space.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. A correct answer takes two minutes; the one-pass answer has a subtle detail that most people get wrong the first time, and finding it yourself is the point. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 15 minutes and talk out loud.
2. Find any linear-time solution first. Three possible values is a very strong restriction: use it.
3. Then try for a single pass. Picture the array as regions that grow while you scan, and write down exactly what each region contains.
4. Write the code and trace it on `[1, 2, 0]` by hand, step by step.
5. Check `[1, 0]` and `[2]` as well.

Open a hint only after two minutes without progress. After each hint, close it and try again before opening the next one.

> [!HINT] Hint 1: a small nudge
> If you knew how many 0s, 1s and 2s there are, could you write the answer without looking at the order at all?

> [!HINT] Hint 2: the kind of tool you need
> For one pass: the 0s belong at the front and the 2s at the back. Keep one index for where the next 0 should go, one for where the next 2 should go, and one that scans. Values you move are swapped, never copied.

> [!HINT] Hint 3: almost the whole plan
> Keep four regions: 0s at the front, then 1s, then a not-yet-examined middle, then 2s at the back. Look at the first unexamined element: a 0 is swapped to the end of the 0s region, a 1 just joins the 1s, a 2 is swapped to the front of the 2s region. After each kind of swap, ask: is the element that has just arrived at the scanning position something I have already examined?

**Check yourself before revealing the walkthrough**

- [ ] I have a two-pass solution and can say why it is O(n) time and O(1) space
- [ ] I can name the four regions of the one-pass solution and what each contains
- [ ] My one-pass code turns `[1, 2, 0]` into `[0, 1, 2]` and `[1, 0]` into `[0, 1]`
- [ ] I can explain why the scanning index moves after one kind of swap but not after the other

## 3. Interview script: understand the problem (≈2 min)

**Me:** Let me say it back. The array only contains 0, 1 and 2. I rearrange it in place so it reads all 0s, then 1s, then 2s, and I return nothing. No library sort.

**Interviewer:** Right.

**Me:** Can any colour be missing? For example an array with only 2s, or no 1s?

**Interviewer:** The statement only says each value is 0, 1 or 2, so yes, any of them can be absent.

**Me:** And the length is at least 1? Up to how many?

**Interviewer:** Between 1 and 300.

**Me:** Is it fine to just overwrite the values, or are these really objects with a colour field that must be moved?

**Interviewer:** They're plain integers.

**Me:** Then rewriting values is allowed, which makes counting an option. A general comparison sort would also work, at O(n log n), but with only three possible values I'd expect to do better. Let me check an example by hand: `[2, 0, 1, 2, 1, 0]`. Two 0s, two 1s, two 2s, so `[0, 0, 1, 1, 2, 2]`.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| Every value is 0, 1 or 2 | Only three keys. Counting needs three counters, and a single scan can route every element to one of three regions. |
| In place, no library sort | No copy of the array as the output. O(1) extra space is the target. |
| 1 ≤ n ≤ 300 | Never empty. Size is tiny, so the follow-up is about technique, not speed. |
| Follow-up: one pass, O(1) space | The counting solution reads the array twice; the target is a single scan with constant extra memory. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Any colour may be absent | No code may assume each region is non-empty. `[2]`, `[2, 0]` and `[0, 2, 0, 2]` are all valid inputs. |
| The values are plain integers, not objects | Overwriting values (counting) is as good as moving them. With objects, only swapping would preserve the data. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| "One pass" means every element is examined once, by one scan | The fast solution sometimes swaps an element from the back to the scanning position and examines it later. I count that as one pass, because each element is still classified exactly once and the scan does at most n steps. |
| Stability is irrelevant | Equal integers are indistinguishable. For objects it would matter, and the one-pass solution is not stable. |

### Edge cases I will keep in mind

- n = 1: `[0]`, `[1]`, `[2]`.
- Only one colour, for example `[2, 2, 2]`.
- A colour missing: `[2, 0]`, `[0, 2, 0, 2]`.
- Already sorted and reverse sorted.
- Two elements in the wrong order, `[1, 0]`: the case that catches a wrong loop condition.

## 4. Think out loud: from first idea to best solution

> "I could write any O(n log n) sort, but that ignores the strongest fact here: there are only three values. Let me use it."

### Approach 1: Count, then overwrite (two passes)

#### What I say out loud

> "Since the values are just 0, 1 and 2, the sorted array is completely determined by how many of each there are. So: one pass to count the three values, a second pass to write that many 0s, then 1s, then 2s. Three counters, O(n) time."

#### Intuition

The output depends only on the three counts, not on where the values were. This is counting sort with a value range of three. The [[a3-counting-sort|Counting Sort]] lesson covers the general version.

#### Algorithm

1. `count[0..2] = 0`. For each `x` in `nums`, `count[x]++`.
2. Set `i = 0`. For `color` from 0 to 2, write `color` into `nums[i++]`, `count[color]` times.

#### Why it is correct

After step 1, `count[c]` is the number of times `c` occurs. Step 2 writes exactly `count[0] + count[1] + count[2] = n` values, so it fills the whole array and nothing more. It writes all 0s before any 1 and all 1s before any 2, and it writes each colour as many times as it occurred, so the result is the sorted arrangement of the same values.

#### Dry run

`nums = [2, 0, 1, 2, 1, 0]`

| Pass | What happens | State |
|---|---|---|
| 1 | Count the values | `count = [2, 2, 2]` |
| 2, colour 0 | Write two 0s at indices 0–1 | `[0, 0, 1, 2, 1, 0]` |
| 2, colour 1 | Write two 1s at indices 2–3 | `[0, 0, 1, 1, 1, 0]` |
| 2, colour 2 | Write two 2s at indices 4–5 | `[0, 0, 1, 1, 2, 2]` |

The middle rows show that the second pass overwrites the input blindly. That is safe only because everything needed was saved in the counts first.

#### Java code

```java title="Approach 1: count, then overwrite"
class Solution {
    public void sortColors(int[] nums) {
        int[] count = new int[3];
        for (int x : nums) {
            count[x]++;
        }
        int i = 0;
        for (int color = 0; color <= 2; color++) {
            for (int c = 0; c < count[color]; c++) {
                nums[i++] = color;
            }
        }
    }
}
```

#### Time complexity

**O(n) in the worst case.** n is the length of `nums`. The first pass reads n elements. The second pass writes n elements in total: the outer loop runs three times, and the inner loops together run `count[0] + count[1] + count[2] = n` times.

#### Space complexity

**O(1) auxiliary**: an array of three counters and two indices, regardless of n.

#### The bridge to the next approach

> "That's linear time and constant space already, so asymptotically there's nothing left to win. The follow-up asks for one pass, though. The second pass exists because I forgot where things were and had to rewrite everything. What if I put each element in its region the moment I look at it?"

> "0s belong at the front, 2s at the back. If I keep a boundary at the front for 0s and one at the back for 2s, a 0 can be swapped to the front boundary and a 2 to the back boundary. 1s end up in the middle by themselves. The part I need to be careful about is the scanning index: after a swap, what's now under it?"

### Approach 2: Dutch national flag, one pass (recommended)

#### What I say out loud

> "Three indices: `low` is where the next 0 goes, `high` is where the next 2 goes, and `mid` scans. Everything before `low` is 0, everything from `low` up to `mid` is 1, everything after `high` is 2, and `mid` through `high` is what I haven't looked at yet."

> "At `nums[mid]`: a 0 gets swapped with `nums[low]`, and both advance. A 1 is already in the 1s region, so only `mid` advances. A 2 gets swapped with `nums[high]` and `high` moves left, but `mid` does **not** advance: the value that came from `high` is one I've never looked at. I stop when `mid` passes `high`, because then nothing is unexamined."

#### Intuition

The scan keeps the array as four regions and shrinks the unknown one by one element per step. Each step looks at one unknown element and puts it where it belongs, using a swap so nothing is lost. Edsger Dijkstra named it after the three bands of the Dutch flag. It is the same three-way partition that quicksort uses around a pivot ([[a3-quick-sort|Quick Sort]]), with 1 as the pivot, and it is a three-pointer relative of [[a2-two-pointers|Two Pointers]].

#### Algorithm

1. `low = 0`, `mid = 0`, `high = n − 1`.
2. While `mid <= high`:
   - `nums[mid] == 0`: swap `nums[low]` and `nums[mid]`; `low++`; `mid++`.
   - `nums[mid] == 1`: `mid++`.
   - `nums[mid] == 2`: swap `nums[mid]` and `nums[high]`; `high--`.

#### Why it is correct

**The invariant**, true before every iteration:

| Region | Indices | Contents |
|---|---|---|
| Zeros | `[0, low)` | only 0s |
| Ones | `[low, mid)` | only 1s |
| Unknown | `[mid, high]` | not examined yet |
| Twos | `(high, n − 1]` | only 2s |

At the start `low = mid = 0` and `high = n − 1`, so the first two regions and the last are empty and everything is unknown. Each branch keeps the invariant:

- **`nums[mid]` is 1:** advancing `mid` moves a 1 from the unknown region to the end of the ones region.
- **`nums[mid]` is 2:** the swap puts the 2 at index `high`, and `high--` makes that index part of the twos region. The value that arrives at `mid` came from index `high`, which was in the unknown region, so it is still unknown; `mid` stays, and the unknown region shrank from the right.
- **`nums[mid]` is 0:** the swap puts the 0 at index `low`, and `low++` makes it part of the zeros region. What arrives at `mid` came from index `low`. If `low < mid`, index `low` was the first element of the ones region, so it is a 1, and after `mid++` it is the last element of the ones region. If `low == mid`, the swap exchanges the element with itself, and advancing both is again correct. Either way the value now at `mid − 1` is known, so `mid` may advance.

**Termination and result:** every iteration either increases `mid` or decreases `high`, so the unknown region shrinks by one each time and the loop runs at most n times. When it stops, `mid = high + 1`, the unknown region is empty, and the invariant says the array is zeros, then ones, then twos. Every change was a swap, so the values are the original ones, rearranged.

**The 25-second version to say to the interviewer:**

> "I keep four regions: 0s before `low`, 1s from `low` to `mid`, unexamined from `mid` to `high`, and 2s after `high`. Each step classifies the element at `mid`. A 0 is swapped with the first 1, which comes back to `mid` as a known 1, so `mid` moves. A 2 is swapped with the last unexamined element, which is still unknown, so `mid` stays. Every step shrinks the unknown region by one, so after at most n steps it's empty and the array is sorted."

#### Dry run

`nums = [2, 0, 1, 2, 1, 0]`

| low | mid | high | `nums[mid]` | Action | `nums` after |
|---|---|---|---|---|---|
| 0 | 0 | 5 | 2 | swap `mid`, `high`; `high--` | `[0, 0, 1, 2, 1, 2]` |
| 0 | 0 | 4 | 0 | swap `low`, `mid` (same index); both advance | `[0, 0, 1, 2, 1, 2]` |
| 1 | 1 | 4 | 0 | swap `low`, `mid` (same index); both advance | `[0, 0, 1, 2, 1, 2]` |
| 2 | 2 | 4 | 1 | `mid++` | `[0, 0, 1, 2, 1, 2]` |
| 2 | 3 | 4 | 2 | swap `mid`, `high`; `high--` | `[0, 0, 1, 1, 2, 2]` |
| 2 | 3 | 3 | 1 | `mid++` | `[0, 0, 1, 1, 2, 2]` |

Now `mid = 4 > high = 3`, so the loop stops. Row 2 shows why `mid` must not advance after a swap with `high`: the 0 brought from the back in row 1 is examined only in row 2.

`nums = [1, 2, 0]`, the input that exposes the classic bug:

| low | mid | high | `nums[mid]` | Action | `nums` after |
|---|---|---|---|---|---|
| 0 | 0 | 2 | 1 | `mid++` | `[1, 2, 0]` |
| 0 | 1 | 2 | 2 | swap `mid`, `high`; `high--` | `[1, 0, 2]` |
| 0 | 1 | 1 | 0 | swap `low`, `mid`; both advance | `[0, 1, 2]` |

The third row is a 0 swapping with a real 1 (`low < mid`), and the 1 that comes back to index 1 is the one examined in the first row.

#### Java code

```java title="Approach 2: Dutch national flag (recommended)"
class Solution {
    public void sortColors(int[] nums) {
        // [0, low) = 0s, [low, mid) = 1s, [mid, high] = unexamined, (high, n-1] = 2s
        int low = 0;
        int mid = 0;
        int high = nums.length - 1;
        while (mid <= high) {
            if (nums[mid] == 0) {
                swap(nums, low++, mid++);  // what comes back from low is a known 1 (or the same 0)
            } else if (nums[mid] == 1) {
                mid++;
            } else {
                swap(nums, mid, high--);   // what comes back from high is unexamined: mid stays
            }
        }
    }

    private void swap(int[] a, int i, int j) {
        int tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
}
```

#### Time complexity

**O(n) in the worst case, one pass.** Each iteration either increases `mid` or decreases `high`, and they start n − 1 apart and stop when `mid` passes `high`, so there are exactly n iterations, each doing at most one swap. That is also the number of times an element is examined: once each.

#### Space complexity

**O(1) auxiliary**: three indices and a temporary for the swap.

### Alternative: two partition passes

First move every 0 to the front with one partition pass (a write index that advances on each 0), then, starting from where the 0s end, move every 1 in front of the 2s with a second pass. O(n) time, O(1) space, two passes. It moves elements instead of rewriting them, which matters for objects, but it is still two passes, and the single Dutch-flag scan does the same job in one. I mention it only if the interviewer asks for a version that is easier to get right than the one-pass loop.

## 5. Comparison table

n = length of `nums`. Neither approach hashes or uses randomness, so expected and worst case coincide.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Count, then overwrite | O(n), two passes | O(n) | O(1) |
| 2. Dutch national flag | O(n), one pass | O(n) | O(1) |
| Alt. Two partition passes | O(n), two passes | O(n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Count, then overwrite | Hard to get wrong; generalises to k colours with k counters | Two passes; rewrites values instead of moving them, so useless for objects with a colour field | As the first answer, or when there are more than three colours |
| 2. Dutch national flag | One pass, moves the real elements, constant space | The `mid`-after-swap rule is easy to get wrong; not stable | The follow-up answer, and the standard three-way partition |
| Alt. Two partition passes | Moves real elements; each pass is a simple partition | Two passes | When you want element moves without the one-pass subtlety |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** the Dutch national flag scan (Approach 2). It satisfies the follow-up exactly: one pass, constant space.

**Is it optimal?** In the worst case a correct algorithm must examine every element at least once, since an unexamined element could be any of the three colours and belong anywhere. So Ω(n) time is a worst-case lower bound, and both approaches meet it. Space cannot go below O(1). The only remaining difference is the number of passes.

**Why it is the preferred interview answer:** it is what the follow-up asks for, it moves elements rather than rewriting them (which still works if the values are objects keyed by colour), and its invariant is a reusable tool: the same scan is quicksort's three-way partition.

**When the counting version is preferable:** if there are more than three colours, or the interviewer only wants a correct linear answer. Start with counting if you are unsure of the one-pass details; it takes a minute and is a complete answer to the main question.

**When to stop:** once the one-pass version is coded and traced on `[1, 2, 0]`. Both are already optimal asymptotically; there is nothing more to optimise.

## 7. Interview script: code it and test it

### What I say while coding

> "`void sortColors(int[] nums)`. Three indices. I'll write the four regions as a comment first, because every line of the loop exists to keep that comment true."

> "`while (mid <= high)`: less-or-equal, because when `mid == high` there's still one unexamined element."

> "Case 0: swap with `low`, advance both. Case 1: advance `mid`. Case 2: swap with `high`, decrease `high`, and I deliberately leave `mid` where it is."

### Testing out loud

**Normal case:** `[2, 0, 1, 2, 1, 0]` gives `[0, 0, 1, 1, 2, 2]` in six iterations (section 4 has the full trace).

**The trap:** `[1, 2, 0]`. `mid` passes the 1; the 2 swaps with the 0 at the back, giving `[1, 0, 2]` with `high = 1`; `mid` stays at 1 and sees the 0, swaps it with the 1 at `low`: `[0, 1, 2]`. Correct. Had `mid` advanced after the swap, it would have stopped with `[1, 0, 2]`.

**n = 1:** `[2]`: `low = mid = high = 0`, the 2 swaps with itself, `high = −1`, loop ends. `[0]`: swaps with itself, `low = mid = 1`, loop ends. `[1]`: `mid = 1`, loop ends. All unchanged, all correct.

**Two elements reversed:** `[1, 0]`. `mid = 0` sees 1, `mid = 1`; `mid <= high` (1 ≤ 1), so it sees the 0, swaps with `low = 0`: `[0, 1]`. With `mid < high` the loop would have stopped before examining the 0, leaving `[1, 0]`.

**One colour only:** `[2, 2, 2]`. Each step swaps the element at `mid = 0` with `high` and decrements `high`: three iterations, `mid` never moves, the array is unchanged. Correct.

**Missing colour:** `[0, 2, 0, 2]`. The 0 at index 0 swaps with itself (`low = mid = 1`); the 2 swaps with the 2 at index 3 (`high = 2`); the 2 now at index 1 swaps with the 0 at index 2 (`high = 1`), giving `[0, 0, 2, 2]`; `mid = 1` now sees the 0, swaps with itself, `low = mid = 2 > high`. Result `[0, 0, 2, 2]`.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 1–2 min | Plain integers? Can a colour be missing? |
| Counting solution | 1–2 min | Say it with its complexity; code it only if asked |
| Derive the one-pass scan | 2–3 min | The four regions, then what each value does to them |
| Say why it works | about 1 min | Especially why `mid` stays after a swap with `high` |
| Write the code | 2–3 min | Comment with the regions, one loop, three branches |
| Trace | 2–3 min | `[1, 2, 0]` and `[1, 0]` |

### Where the time should go

- **Most attention:** the invariant and the asymmetry between the two swaps. That is the entire difficulty of the problem.
- **Do not skimp on:** tracing `[1, 2, 0]`. It catches the most common bug in one minute.
- **Least attention:** the counting code. It is trivially correct; saying it is enough unless the interviewer wants it written.

### If the one-pass idea does not come

1. Code the counting version. It is O(n) time and O(1) space, a full answer to the main question.
2. Ask "where does each value belong?" 0s at the front, 2s at the back. Two write positions, one at each end.
3. Draw the array as labelled regions and move one element at a time by hand. Write down what is under `mid` after each swap.

## 9. Interviewer challenges

### About the invariant

#### Why doesn't `mid` move after swapping with `high`, when it does after swapping with `low`?

**What they are testing:** whether you understand the invariant or memorised the code.

**How to reason:** ask where the incoming value came from. From `high`: the unknown region. From `low`: the ones region (or the same position).

**What I say:** "After a swap with `high`, the value now at `mid` came from the unexamined part, so I have to look at it before moving on. After a swap with `low`, the value that comes back is from the ones region, so it's a 1 that I've already examined, or, when `low` equals `mid`, it's the 0 itself. Either way it's settled and `mid` can advance. If I advanced `mid` after the swap with `high`, `[1, 2, 0]` would come out as `[1, 0, 2]`."

**Nuance:** the asymmetry comes from the scan direction. `mid` moves left to right behind `low`, so everything between `low` and `mid` has been seen; nothing beyond `mid` has.

#### Why is the loop condition `mid <= high` and not `mid < high`?

**What they are testing:** precise boundaries from the invariant, rather than from habit.

**How to reason:** the unknown region is `[mid, high]`, inclusive. When `mid == high` it holds one element.

**What I say:** "The unexamined region is `mid` through `high` inclusive, so when they're equal there's still one element to classify. With `<`, `[1, 0]` would stop after the 1 and leave `[1, 0]`."

**Nuance:** the loop ends with `mid = high + 1`, which is exactly the empty unknown region.

### About the design

#### Counting is also O(n) and O(1). Why bother with the one-pass version?

**What they are testing:** whether you can name a real advantage, not just "the follow-up said so".

**How to reason:** compare what each does to the data. Counting discards the elements and writes new values; the flag scan moves the elements themselves.

**What I say:** "Asymptotically they're the same. The real difference is that counting recreates values, which only works because equal integers are interchangeable. If each element were an object, say a task with a priority of 0, 1 or 2, counting would lose the objects, and the flag scan would still work because it only swaps. It also reads the array once instead of twice, which is what the follow-up asks for."

**Nuance:** counting can be extended to objects with prefix sums and an output buffer (a stable counting sort), but that costs O(n) extra space.

#### Is the result stable?

**What they are testing:** whether you know the cost of the swaps.

**How to reason:** find two equal elements whose order flips. A 2 swapped from `mid` to `high` jumps over any unexamined 2s between them.

**What I say:** "No. In `[2, 2]` the first 2 is swapped to the end, past the second, so their order flips. For integers it's invisible. If stability mattered for objects, I'd use a stable counting sort with an O(n) buffer."

**Nuance:** stable partitioning in linear time with O(1) extra space is possible in theory, but the known algorithms are far too intricate for an interview. The practical stable options are a counting sort with an O(n) buffer, or an in-place divide-and-conquer partition in O(n log n).

## 10. Follow-up questions the interviewer might ask

**"What if there are k colours instead of three?"**
Counting generalises directly: k counters, O(n + k) time, O(k) space. The flag scan does not: one pass with three pointers handles three classes. For k classes you can partition repeatedly, or sort by comparison in O(n log n).

**"What if the elements are objects with a colour field?"**
Use the flag scan unchanged, comparing `obj.color` instead of the value. It moves the objects, so nothing is lost. Not stable.

**"Partition around an arbitrary pivot value instead of 1."**
The same scan with "less than, equal to, greater than the pivot" as the three classes. It is quicksort's three-way partition, which keeps quicksort fast on inputs with many duplicates ([[nc-sort-an-array|Sort an Array]]). O(n) time, O(1) space.

**"What if only two colours exist, 0 and 1?"**
Two pointers: one write index for 0s, swapping each 0 forward as the scan passes it. O(n), O(1), one pass.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Writing a general sort.** O(n log n) works but ignores the three-value restriction, which is the whole point of the problem.
- **Thinking counting is not acceptable.** It meets the main requirements exactly; only the follow-up asks for one pass. Say it first.
- **Not stating the regions.** Without a written invariant, the asymmetry between the two swaps looks arbitrary, and the code is guessed rather than derived.

### Implementation mistakes

> [!MISTAKE] Advancing `mid` after swapping with `high`
> Writing `swap(nums, mid++, high--)` skips the element brought in from the back. `[1, 2, 0]` becomes `[1, 0, 2]`: the 0 that arrived at index 1 is never examined.

> [!MISTAKE] Looping while `mid < high`
> The last unexamined element, at `mid == high`, is never classified. `[1, 0]` stays `[1, 0]`.

- **Starting `high` at `n` instead of `n − 1`.** The first swap with `high` reads past the end and throws.
- **Copying instead of swapping.** Writing `nums[low] = 0` and moving on loses the 1 that was at `low`. A swap keeps every value in the array.

## 12. Pattern recognition

**The pattern:** three-way partition, also called the Dutch national flag. A scanning index with two boundaries maintains four regions and shrinks the unknown region by one element per step.

**Signals in the problem statement:**

- Only a few distinct keys (two or three), or a split into "less / equal / greater".
- "In place", "one pass", "constant extra space".
- Grouping rather than full ordering: all of one kind before all of another.

**Related problems in this list:**

- [[nc-sort-an-array|Sort an Array]]: quicksort uses this exact scan to partition around a pivot, which keeps it fast with duplicates.
- [[nc-remove-element|Remove Element]]: the two-region version, a write index that collects the elements to keep.
- [[nc-kth-largest-element-in-array|Kth Largest Element in an Array]]: quickselect, which repeatedly applies the same partition to one side.
- [[nc-top-k-frequent-elements|Top K Frequent Elements]]: counting first, and a three-way partition if you solve it with quickselect.

**Takeaway:** when the values fall into a few classes and the array must be grouped in place, keep one region per class plus an unknown region, and decide each pointer move by asking whether the element that lands under the scanning index has been examined yet.

## 13. 60-second revision card

**Key insight:** 0s go to the front boundary, 2s to the back boundary, 1s stay in the middle. One scan with three indices.

**Invariant:** `[0, low)` 0s, `[low, mid)` 1s, `[mid, high]` unexamined, `(high, n − 1]` 2s. Loop while `mid <= high`. After a swap with `high`, `mid` stays.

**Complexity:** O(n) time, one pass, exactly n iterations; O(1) auxiliary space. Ω(n) worst-case lower bound, since every element must be examined. Counting in two passes is also O(n) and O(1).

**Code skeleton:**

```java title="Dutch national flag in one loop"
class Solution {
    public void sortColors(int[] nums) {
        int low = 0, mid = 0, high = nums.length - 1;
        while (mid <= high) {
            if (nums[mid] == 0) { int t = nums[low]; nums[low++] = nums[mid]; nums[mid++] = t; }
            else if (nums[mid] == 1) mid++;
            else { int t = nums[high]; nums[high--] = nums[mid]; nums[mid] = t; } // mid stays
        }
    }
}
```

**Main traps:**

- `mid` advances after a 0-swap, not after a 2-swap.
- `mid <= high`, not `<`.
- `high` starts at `n − 1`.
- Not stable; fine for integers.

**What to say in one breath:** "Counting the three values and rewriting is O(n) and O(1) but two passes. For one pass I keep four regions: 0s, 1s, unexamined, 2s. A 0 swaps to `low` and both pointers advance, because what comes back is a known 1; a 1 just advances `mid`; a 2 swaps to `high` and `mid` stays, because what comes back hasn't been examined. Each step shrinks the unexamined region by one, so it's n steps and O(1) space."
