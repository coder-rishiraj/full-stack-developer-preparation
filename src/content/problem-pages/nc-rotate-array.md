---
problemId: nc-rotate-array
title: Rotate Array
source: neetcode
sourceUrl: https://leetcode.com/problems/rotate-array/
difficulty: medium
patterns: [two-pointers]
relatedLessons: [a2-two-pointers, a2-array-string-traversal, a14-edge-cases, a14-deriving-optimization]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

You get an integer array `nums` and a non-negative integer `k`. Rotate the array to the right by `k` steps, **in place**: one step moves every element one position to the right, and the last element wraps around to the front. The method returns nothing; the array you were given is the answer.

**Example 1**

- Input: `nums = [10, 20, 30, 40, 50]`, `k = 2`
- After the call: `nums = [40, 50, 10, 20, 30]`
- Why: one step gives `[50, 10, 20, 30, 40]`, a second step gives `[40, 50, 10, 20, 30]`. The last two elements have moved to the front, in their original order.

**Example 2**

- Input: `nums = [7, 8]`, `k = 5`
- After the call: `nums = [8, 7]`
- Why: rotating a length-2 array twice brings it back to where it started, so five steps are the same as one step.

**What the problem statement guarantees and requires**

- 1 ≤ n ≤ 10^5, where n is the length of `nums`.
- −2^31 ≤ `nums[i]` ≤ 2^31 − 1: any `int`.
- 0 ≤ k ≤ 10^5. In particular `k` can be 0, equal to n, or larger than n.
- The rotation must happen in the given array; the method signature is `void rotate(int[] nums, int k)`.
- The follow-up asks for as many solutions as you can find (at least three), and for one that works in place with O(1) extra space.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. A version that uses a second array takes two minutes. The constant-space version rests on one observation that is worth finding on your own, and its correctness argument is what an interviewer will ask about. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 20 minutes and talk out loud.
2. First decide what `k = 7` means for an array of length 5. Write the rule down.
3. Write a correct solution with any amount of extra memory. Say exactly where `nums[i]` ends up.
4. Then try for O(1) extra space. Write the array before and after as two blocks of elements and look at how the blocks moved.
5. Trace your code on `[10, 20, 30, 40, 50]` with `k = 2`, and on `[7, 8]` with `k = 5`.

Open a hint only after two minutes without progress. After each hint, close it and try again before opening the next one.

> [!HINT] Hint 1: a small nudge
> Rotating n elements by n steps changes nothing. And in the answer, the last k elements form one block at the front and the first n − k form one block at the back, each block in its original order.

> [!HINT] Hint 2: the kind of tool you need
> With a second array, element `i` goes to index `(i + k) mod n`. For constant space, think about an in-place operation you already know that turns an array "front to back", and what it does to two blocks A B.

> [!HINT] Hint 3: almost the whole plan
> Reduce `k` modulo n. Reversing the whole array turns A B into B-reversed followed by A-reversed. The blocks are now in the right place, but each one reads backwards. Fix each block with one more reversal.

**Check yourself before revealing the walkthrough**

- [ ] My code handles `k = 0`, `k = n` and `k > n` without an exception
- [ ] I have an O(n) time solution and can say how much extra space it uses
- [ ] I have an O(n) time, O(1) extra space solution and can explain why it produces the rotation
- [ ] My code turns `[10, 20, 30, 40, 50]`, `k = 2` into `[40, 50, 10, 20, 30]`

## 3. Interview script: understand the problem (≈2 min)

**Me:** Let me say it back. I shift every element k places to the right, wrapping around the end, and I do it inside `nums`. Nothing is returned.

**Interviewer:** Yes.

**Me:** What's the range of k compared with the length?

**Interviewer:** k is between 0 and 10^5, and the length is between 1 and 10^5. They're independent.

**Me:** So k can be bigger than n. Rotating by n is a full circle and leaves the array as it was, so only `k mod n` matters. And since n is at least 1, the modulo is always defined. Let me check one by hand: `[10, 20, 30, 40, 50]` with k = 2. The last two, `40, 50`, move to the front: `[40, 50, 10, 20, 30]`. With k = 7 it would be the same, because 7 mod 5 = 2.

**Me:** Do the values matter at all? Any limits on them?

**Interviewer:** Any `int`.

**Me:** Then I never do arithmetic on the values, only move them, so there is nothing to overflow there. The follow-up mentions O(1) extra space; is a solution with a second array acceptable to start with?

**Interviewer:** Start wherever you like, but I'd like to see the constant-space one.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^5 | `k % n` is always safe (no division by zero). An O(n · k) step-by-step rotation can reach about 10^10 moves, too slow; I want O(n). |
| 0 ≤ k ≤ 10^5, independent of n | k can be 0, equal to n, or several times n. I reduce it with `k %= n` before using it as an index or a block length. |
| Values are any `int` | Values are only moved, never added, so their range never causes an overflow. Indices: `i + k` is at most (10^5 − 1) + 10^5 < 2^31, so `(i + k) % n` cannot overflow even before reducing k. |
| In place, `void` return | The answer must end up in the array object the caller passed. Building a new array is allowed as scratch space, but its contents must be copied back. |
| Follow-up: O(1) extra space | The target is a constant number of variables, no second array. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| A second array is acceptable as a first answer | I can start with the direct "each element to its new index" solution and then remove the extra memory. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| Rotating right by k means element `i` ends at index `(i + k) mod n` | This is what example 1 shows; I state it as a formula because every approach and every test relies on it. |

### Edge cases I will keep in mind

- `k = 0`: nothing changes.
- `k = n` (and any multiple of n): nothing changes, but code that uses k directly as a block length breaks.
- `k > n`, as in `[7, 8]`, `k = 5`.
- n = 1: any k leaves the single element in place.
- `k mod n` and n sharing a factor, such as n = 6, k = 2: matters for the cycle-following alternative below.

## 4. Think out loud: from first idea to best solution

> "The literal reading is: do one step, k times. One step moves every element, so that's O(n) per step and O(n · k) in total. With n and k both up to 10^5, even after reducing k modulo n that can be around 10^10 moves. Too slow, but it tells me something: k steps of one is the same as one jump of k, so I should move every element straight to its final place."

### Approach 1: Copy into a new array, then copy back

#### What I say out loud

> "Element `i` belongs at `(i + k) mod n`. If I write each element into a second array at that index, I never overwrite something I still need. Then I copy the second array back into `nums`, because the caller only sees the original array object."

#### Intuition

The difficulty of rotating in place is that writing an element to its new position destroys the element that was there. A separate output array removes the problem completely: reads come from `nums`, writes go to the copy.

#### Algorithm

1. `k = k % n`.
2. Create `rotated` of length n. For each `i`, set `rotated[(i + k) % n] = nums[i]`.
3. Copy `rotated` back into `nums`, index by index.

#### Why it is correct

The map `i → (i + k) mod n` is a bijection on `0 … n − 1`: two different `i` in that range cannot give the same remainder after adding the same k. So every slot of `rotated` is written exactly once, with the element that a right rotation by k puts there. Nothing is lost, because `nums` is not modified until step 3, and step 3 makes `nums` equal to `rotated`.

#### Dry run

`nums = [10, 20, 30, 40, 50]`, `k = 2`, n = 5

| i | `nums[i]` | `(i + 2) % 5` | `rotated` after |
|---|---|---|---|
| 0 | 10 | 2 | `[_, _, 10, _, _]` |
| 1 | 20 | 3 | `[_, _, 10, 20, _]` |
| 2 | 30 | 4 | `[_, _, 10, 20, 30]` |
| 3 | 40 | 0 | `[40, _, 10, 20, 30]` |
| 4 | 50 | 1 | `[40, 50, 10, 20, 30]` |

Copying back gives `nums = [40, 50, 10, 20, 30]`.

#### Java code

```java title="Approach 1: copy into a new array, then copy back"
class Solution {
    public void rotate(int[] nums, int k) {
        int n = nums.length;
        k %= n;
        int[] rotated = new int[n];
        for (int i = 0; i < n; i++) {
            rotated[(i + k) % n] = nums[i];
        }
        System.arraycopy(rotated, 0, nums, 0, n);  // the caller sees nums, not rotated
    }
}
```

#### Time complexity

**O(n) in the worst case**, where n is `nums.length`. One loop of n iterations and one copy of n elements.

#### Space complexity

**O(n) auxiliary**: the array `rotated`.

#### The bridge to the next approach

> "Time is already optimal, so what's left is the extra array. Let me look at the shape of the answer instead of individual indices. The input is two blocks: A, the first n − k elements, and B, the last k. The output is B then A, each block unchanged inside. So I need to swap two blocks of different lengths in place."

> "What in-place operation moves things from the back to the front? Reversal. Reversing A B gives B-reversed then A-reversed: both blocks land in the right place, just backwards. Reversing each block again puts its contents back in order. Three reversals, each done with two pointers and swaps, so no extra array."

### Approach 2: Three reversals (recommended)

#### What I say out loud

> "Reduce k modulo n. Reverse the whole array, then reverse the first k elements, then reverse the remaining n − k. Each reversal is two pointers walking towards each other and swapping. O(n) time, O(1) extra space."

#### Intuition

Write the array as `A B`, where B is the last k elements. Reversing a sequence reverses the order of its blocks and the order inside each block: `(A B)` reversed is `(B reversed)(A reversed)`. The blocks are now in rotated order, and reversing each block on its own undoes the inner reversal. The [[a2-two-pointers|Two Pointers]] lesson covers the in-place reversal itself.

#### Algorithm

1. `k = k % n`.
2. Reverse `nums[0 … n − 1]`.
3. Reverse `nums[0 … k − 1]`.
4. Reverse `nums[k … n − 1]`.

`reverse(l, r)` swaps `nums[l]` and `nums[r]` and moves `l` right and `r` left while `l < r`. An empty range (`l > r`, which happens in step 3 when k = 0) does nothing.

#### Why it is correct

Track one element. Reversing a range `[l, r]` sends index `j` to `l + r − j`.

- **An element of A, at index `i` with `0 ≤ i < n − k`.** Step 2 sends it to `n − 1 − i`, which lies in `[k, n − 1]` because `i < n − k`. Step 3 does not touch that range. Step 4 reverses `[k, n − 1]` and sends `n − 1 − i` to `k + (n − 1) − (n − 1 − i) = i + k`. That is its rotated position, since `i + k < n`.
- **An element of B, at index `i` with `n − k ≤ i < n`.** Step 2 sends it to `n − 1 − i`, which lies in `[0, k − 1]`. Step 3 reverses `[0, k − 1]` and sends it to `(k − 1) − (n − 1 − i) = i + k − n`, which is `(i + k) mod n` because `n ≤ i + k < 2n`. Step 4 does not touch it.

Every element ends at `(i + k) mod n`, which is the definition of a right rotation by k. Every change was a swap, so the values are exactly the original ones. The `k %= n` step is what makes `k ≤ n − 1`, so both block boundaries are inside the array.

**The 25-second version to say to the interviewer:**

> "The answer is the last k elements followed by the first n − k, each in their original order. Reversing everything puts the two blocks in the right order but each reads backwards; reversing each block separately fixes that. Concretely, an element at i in the front block goes to n − 1 − i and then to i + k; one in the back block goes to n − 1 − i and then to i + k − n. Each reversal is a two-pointer swap loop, so it's O(n) time and O(1) space. I reduce k modulo n first, so the blocks fit."

#### Dry run

`nums = [10, 20, 30, 40, 50]`, `k = 2`

| Step | Range reversed | `nums` after |
|---|---|---|
| 2 | `[0, 4]` | `[50, 40, 30, 20, 10]` |
| 3 | `[0, 1]` | `[40, 50, 30, 20, 10]` |
| 4 | `[2, 4]` | `[40, 50, 10, 20, 30]` |

`nums = [7, 8]`, `k = 5`: `k % 2 = 1`.

| Step | Range reversed | `nums` after |
|---|---|---|
| 2 | `[0, 1]` | `[8, 7]` |
| 3 | `[0, 0]` | `[8, 7]` (one element, no swap) |
| 4 | `[1, 1]` | `[8, 7]` (one element, no swap) |

Without the `k %= n` line, step 3 would reverse `[0, 4]` on a length-2 array and throw `ArrayIndexOutOfBoundsException`.

#### Java code

```java title="Approach 2: three reversals (recommended)"
class Solution {
    public void rotate(int[] nums, int k) {
        int n = nums.length;
        k %= n;                       // k = n or k > n: only k mod n matters
        reverse(nums, 0, n - 1);      // A B  ->  B^R A^R
        reverse(nums, 0, k - 1);      // B^R  ->  B
        reverse(nums, k, n - 1);      // A^R  ->  A
    }

    private void reverse(int[] a, int left, int right) {
        while (left < right) {
            int tmp = a[left];
            a[left++] = a[right];
            a[right--] = tmp;
        }
    }
}
```

#### Time complexity

**O(n) in the worst case.** The three reversals perform about n/2, k/2 and (n − k)/2 swaps, about n swaps in total, each O(1).

#### Space complexity

**O(1) auxiliary**: a few indices and one temporary.

### Alternative: cyclic replacements

This is a second O(1)-space answer, useful when the interviewer asks for "at least three solutions" or for the fewest writes. Instead of reversing, follow each element to its destination: pick up `nums[start]`, put it at `start + k`, pick up the element that was there, put that at `start + 2k`, and so on (all indices mod n), until the chain comes back to `start`.

**How many cycles there are.** Starting from `start`, the chain visits `start + m·k mod n` for m = 0, 1, 2, … It returns to `start` the first time `m·k` is a multiple of n, which is at `m = n / g`, where `g = gcd(n, k)`. So each cycle has length `n / g`, and there are exactly g cycles. The cycle through `start` visits exactly the indices congruent to `start` modulo g, because the multiples of k modulo n are exactly the multiples of g. So the cycles starting at 0, 1, …, g − 1 are disjoint and together cover every index.

The code below does not compute g. It starts new cycles at 0, 1, 2, … and stops when it has moved n elements in total. That is the same thing: the cycles from starts 0 … s − 1 cover only indices congruent to 0 … s − 1 modulo g, so each start below g begins an untouched cycle, and after g cycles all n elements have moved.

```java title="Alternative: cyclic replacements"
class Solution {
    public void rotate(int[] nums, int k) {
        int n = nums.length;
        k %= n;
        int moved = 0;
        for (int start = 0; moved < n; start++) {
            int current = start;
            int carried = nums[start];
            do {
                int next = (current + k) % n;
                int displaced = nums[next];
                nums[next] = carried;
                carried = displaced;
                current = next;
                moved++;
            } while (current != start);
        }
    }
}
```

Trace with `nums = [1, 2, 3, 4, 5, 6]`, `k = 2`, so g = gcd(6, 2) = 2 cycles of length 3:

| Cycle | Write | `nums` after | moved |
|---|---|---|---|
| start 0 | 1 into index 2 | `[1, 2, 1, 4, 5, 6]` | 1 |
| start 0 | 3 into index 4 | `[1, 2, 1, 4, 3, 6]` | 2 |
| start 0 | 5 into index 0 | `[5, 2, 1, 4, 3, 6]` | 3 |
| start 1 | 2 into index 3 | `[5, 2, 1, 2, 3, 6]` | 4 |
| start 1 | 4 into index 5 | `[5, 2, 1, 2, 3, 4]` | 5 |
| start 1 | 6 into index 1 | `[5, 6, 1, 2, 3, 4]` | 6 |

O(n) time (exactly n writes), O(1) space. Against the reversals: fewer writes (n instead of about 2n for n swaps), but the cycle-count argument is harder to explain and the "one cycle is enough" bug (below) is easy to make. With `k % n == 0` each cycle has length 1 and every element is written onto itself, which is correct.

### Alternative: rotate by one step, k times

Save the last element, shift everything one place right, put the saved element at index 0, and repeat `k mod n` times. It is O(1) space and needs no insight, but it is O(n · (k mod n)) time: about 10^10 element moves for n = 10^5 and k = 10^5 − 1. Mention it only as the starting point; it is too slow for the stated limits, so it is not coded here.

## 5. Comparison table

n = `nums.length`; k is reduced modulo n where it matters. Nothing here hashes or uses randomness, so expected and worst case coincide.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Alt. Rotate by one, k times | O(n · (k mod n)) | O(n²) when k mod n is close to n | O(1) |
| 1. Copy into a new array | O(n) | O(n) | O(n) |
| 2. Three reversals | O(n) | O(n) | O(1) |
| Alt. Cyclic replacements | O(n) | O(n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Alt. Rotate by one | Trivial | Far too slow at the limits | Never as a final answer |
| 1. Copy into a new array | Direct from the index formula; very hard to get wrong | O(n) extra memory; must remember to copy back | First answer, or when memory does not matter |
| 2. Three reversals | O(1) space, short, easy to prove | Needs the block insight | The answer to give |
| Alt. Cyclic replacements | O(1) space, exactly n writes | The gcd/cycle argument is subtle; easy to stop after one cycle | When asked for a third solution or for minimum writes |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** three reversals (Approach 2). It meets the follow-up (in place, O(1) extra space), it is six lines plus a helper, and its correctness argument fits in half a minute.

**Is it optimal?** In the worst case a correct algorithm must write essentially every position: when `k mod n ≠ 0` and the values are distinct, every index receives a different value than it had. So Ω(n) time is a worst-case lower bound in the model where the array is changed by writing elements, and O(1) extra space cannot be beaten. Approach 2 meets both.

**When another approach is better in practice:** if memory is irrelevant, Approach 1 is the fastest to write correctly. If writes are expensive (each element is large or a write is costly), cyclic replacements write each element exactly once, versus about twice for the reversals.

**When to stop:** once the reversals are coded, traced on one normal case and on `k > n`, and you have said why `k %= n` is needed. Mention cyclic replacements as the third solution if the interviewer asks for more.

## 7. Interview script: code it and test it

### What I say while coding

> "`void rotate(int[] nums, int k)`. First line: `k %= n`. n is at least 1, so that's safe, and after it k is at most n − 1, which keeps both block boundaries inside the array."

> "A private `reverse(a, left, right)` with the usual two-pointer swap while `left < right`. An empty range, where `right` is `left − 1`, just doesn't enter the loop."

> "Then whole array, first k, last n − k. I'll write the block picture as comments next to each call so I can check the order."

### Testing out loud

**Normal case:** `[10, 20, 30, 40, 50]`, `k = 2`: whole reversal `[50, 40, 30, 20, 10]`, first two `[40, 50, 30, 20, 10]`, last three `[40, 50, 10, 20, 30]`. Correct.

**k > n:** `[7, 8]`, `k = 5` becomes `k = 1`: `[8, 7]`, then two single-element reversals. `[8, 7]`, correct.

**k = 0:** `k % n = 0`. Reverse everything, reverse the empty range `[0, −1]` (nothing), reverse everything again: the array is back to the original. Correct.

**k = n:** `[10, 20, 30]`, `k = 3`: `k % 3 = 0`, the same as k = 0. Unchanged, correct.

**n = 1:** `[5]`, any k: `k % 1 = 0`, every reversal is a single element or empty. Unchanged, correct.

**Values at the extremes:** `[-2147483648, 2147483647]`, `k = 1` gives `[2147483647, -2147483648]`. Values are only swapped, so their size does not matter.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 2 min | k versus n, `k mod n`, in place, void |
| Extra-array solution | 2 min | The formula `(i + k) mod n`, the copy back, O(n) space |
| Derive the reversals | 3–4 min | A B → B A, what one reversal does to two blocks |
| Say why it works | 1–2 min | The index argument or the block argument |
| Write the code | 3 min | `k %= n`, helper, three calls |
| Trace | 2–3 min | Normal case, `k > n`, `k = 0` |
| Mention a third solution | 1–2 min | Cyclic replacements and the gcd cycle count |

### Where the time should go

- **Most attention:** the reversal insight and its correctness. That is what separates this from an easy problem.
- **Do not skimp on:** `k %= n` and the `k > n` trace. It is the bug interviewers look for first.
- **Least attention:** coding the extra-array version. Saying the formula is usually enough.

### If the constant-space idea does not come

1. Code the extra-array version: it is correct and O(n) time.
2. Draw the input as two labelled blocks, A (first n − k) and B (last k), and the output as B A. Ask what single in-place operation moves the back of an array to the front.
3. If reversal still does not come, think about following one element to its destination and the element it displaces: that leads to cyclic replacements.

## 9. Interviewer challenges

### About correctness

#### Why does reversing three times rotate the array?

**What they are testing:** whether you can justify the trick or only remember it.

**How to reason:** use blocks, then confirm with indices.

**What I say:** "Write the array as A then B, with B the last k elements. Reversing all of it gives B reversed then A reversed: the blocks swap places, and each is internally backwards. Reversing each block on its own restores its order, giving B A, which is the rotation. With indices: an element at i in A goes to n − 1 − i, then to i + k; one in B goes to n − 1 − i, then to i + k − n."

**Nuance:** the same three reversals in the other order (first n − k, last k, then everything) also give B A. Reversing the first k, then the last n − k, then everything gives a **left** rotation by k: `[10, 20, 30, 40, 50]` with k = 2 becomes `[30, 40, 50, 10, 20]`. The block sizes have to match the direction.

#### What happens if you leave out `k %= n`?

**What they are testing:** whether you traced the boundaries.

**How to reason:** k is used as a block length; it must be at most n.

**What I say:** "If k is bigger than n, the second reversal runs from 0 to k − 1, past the end of the array. `[7, 8]` with k = 5 throws `ArrayIndexOutOfBoundsException`. If k equals n it happens to work, because reversing the whole array twice restores it, but that's luck. The modulo also expresses the real fact: a full turn changes nothing."

**Nuance:** in Approach 1 the modulo is applied to `i + k` anyway, so forgetting `k %= n` there is harmless; the reversal version is where it is essential.

### About the alternatives

#### In cyclic replacements, why isn't one cycle enough?

**What they are testing:** whether you understand the cycle structure, not just the code.

**How to reason:** the chain from 0 visits `m·k mod n`, which are exactly the multiples of `g = gcd(n, k)`.

**What I say:** "The cycle from index 0 only visits multiples of gcd(n, k). If n and k are coprime that is every index, but for n = 6 and k = 2 the cycle is 0, 2, 4, and indices 1, 3, 5 never move: stopping after one cycle turns `[1, 2, 3, 4, 5, 6]` into `[5, 2, 1, 4, 3, 6]`. There are g cycles, starting at 0 through g − 1. I either compute the gcd or count moved elements until I reach n."

**Nuance:** counting moves avoids computing the gcd and is harder to get wrong.

#### Your extra-array version writes `nums = rotated` at the end. Is that fine?

**What they are testing:** Java's pass-by-value semantics for references.

**How to reason:** the method receives a copy of the reference.

**What I say:** "No. Assigning to `nums` only changes my local reference; the caller still holds the original array, which is unchanged. I have to copy the contents back, with a loop or `System.arraycopy`."

**Nuance:** this is why "in place" problems have a `void` signature: the only channel back to the caller is the array object itself.

## 10. Follow-up questions the interviewer might ask

**"Rotate to the left by k instead."**
A left rotation by k is a right rotation by `n − (k mod n)`. Or with reversals: reverse the first k, reverse the rest, then reverse everything. O(n) time, O(1) space.

**"Rotate a string, or check whether one string is a rotation of another."**
Rotating is the same algorithm on a `char[]`. To check whether `t` is a rotation of `s`: equal lengths and `t` occurs in `s + s`. With a linear-time substring search (KMP or Z-function) that is O(n); `String.contains` is simpler, but its running time is a property of the JDK's implementation, not a documented linear bound.

**"Rotate a linked list by k."**
Find the length n and the tail, reduce `k mod n`, link the tail to the head to make a ring, and break it after node `n − k`. O(n) time, O(1) space, and no element is moved.

**"What if k is huge, say up to 10^18?"**
Only `k mod n` matters, so compute it with a `long` first; the rest is unchanged. Here k fits in an `int`, so this does not arise.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Simulating k single steps.** O(n · k) is about 10^10 moves at the limits.
- **Forgetting that k can exceed n.** The statement allows k up to 10^5 for any n ≥ 1, so `k = 5` on a length-2 array is a valid input.
- **Thinking the reversals are a memorised trick.** Without the block argument you cannot tell whether a given order of reversals rotates left or right.

### Implementation mistakes

> [!MISTAKE] Not reducing k modulo n
> `reverse(nums, 0, k - 1)` with k = 5 on `[7, 8]` reads index 4 and throws `ArrayIndexOutOfBoundsException`.

> [!MISTAKE] Reversing the blocks first with the wrong sizes
> Reversing `[0, k − 1]`, then `[k, n − 1]`, then everything rotates left. `[10, 20, 30, 40, 50]` with k = 2 becomes `[30, 40, 50, 10, 20]` instead of `[40, 50, 10, 20, 30]`.

> [!MISTAKE] Following only one cycle in cyclic replacements
> With n = 6 and k = 2, the chain from 0 visits only 0, 2, 4. `[1, 2, 3, 4, 5, 6]` becomes `[5, 2, 1, 4, 3, 6]`.

- **Assigning `nums = rotated`** in the extra-array version: the caller's array is not changed.
- **Writing `rotated[i] = nums[(i + k) % n]`.** That pulls from the wrong side and rotates left. The correct pull form is `rotated[i] = nums[(i − k + n) % n]` (with k already reduced).

## 12. Pattern recognition

**The pattern:** in-place rearrangement by reversal, built from the two-pointer swap loop. Swapping two adjacent blocks of different lengths is three reversals.

**Signals in the problem statement:**

- "In place" and "O(1) extra space" for an operation that moves blocks of elements.
- The answer is the input cut into a few blocks and reassembled in a different order.
- A shift amount that can exceed the length: reduce it modulo n.

**Related problems in this list:**

- [[nc-reverse-string|Reverse String]]: the two-pointer reversal this solution uses three times.
- [[nc-rotate-image|Rotate Image]]: an in-place rotation of a matrix, also done with reversals (transpose, then reverse each row) or with cycles of four.
- [[nc-merge-sorted-array|Merge Sorted Array]]: another in-place array problem where the order of writes decides whether you overwrite data you still need.
- [[nc-reverse-linked-list|Reverse Linked List]]: the same reversal on a linked structure, and a building block for rotating a list.

**Takeaway:** when the answer is the input's blocks in a different order, look at what reversal does to blocks: it swaps their order and flips each one, and a second reversal per block flips them back.

## 13. 60-second revision card

**Key insight:** the answer is B A where the input is A B and B is the last `k mod n` elements. Reverse all, then reverse each block.

**Invariant / correctness:** element i of A goes to n − 1 − i, then i + k. Element i of B goes to n − 1 − i, then i + k − n.

**Complexity:** O(n) time, about n swaps; O(1) auxiliary space. Ω(n) worst-case lower bound, since every position may need a new value. Extra array: O(n) time and space. Cyclic replacements: O(n), O(1), exactly n writes, gcd(n, k) cycles.

**Code skeleton:**

```java title="Three reversals"
class Solution {
    public void rotate(int[] nums, int k) {
        int n = nums.length;
        k %= n;
        reverse(nums, 0, n - 1);
        reverse(nums, 0, k - 1);
        reverse(nums, k, n - 1);
    }

    private void reverse(int[] a, int l, int r) {
        while (l < r) { int t = a[l]; a[l++] = a[r]; a[r--] = t; }
    }
}
```

**Main traps:**

- `k %= n` first; k can be 0, n, or larger than n.
- Whole, then first k, then last n − k. Other orders can rotate left.
- Copy back into `nums`; never reassign the parameter.
- Cyclic replacements need gcd(n, k) cycles, not one.

**What to say in one breath:** "Only k mod n matters. The rotated array is the last k elements followed by the first n − k. Reversing the whole array puts the two blocks in the right order but backwards, and reversing each block fixes them. Three two-pointer reversals: O(n) time, O(1) space."
