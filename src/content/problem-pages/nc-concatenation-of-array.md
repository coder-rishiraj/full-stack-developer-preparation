---
problemId: nc-concatenation-of-array
title: Concatenation of Array
source: neetcode
sourceUrl: https://leetcode.com/problems/concatenation-of-array/
difficulty: easy
patterns: [arrays-hashing, hashing]
relatedLessons: [a2-array-string-traversal, a1-arraylist, a1-big-o, a14-clarifying-requirements]
companies: []
timeToSolve: 5
---

## 1. Problem restatement

You get an integer array `nums` of length n. Build and return a new array of length 2n that holds `nums` followed by a second copy of `nums`. In other words, position `i` and position `i + n` of the answer both hold `nums[i]`.

**Example 1**

- Input: `nums = [7, 2, 9]`
- Output: `[7, 2, 9, 7, 2, 9]`
- Why: the first three slots are `nums` as it is, and the last three repeat it. For example, slot 4 is `4 - 3 = 1` places into the second copy, so it holds `nums[1] = 2`.

**Example 2**

- Input: `nums = [4, 4]`
- Output: `[4, 4, 4, 4]`
- Why: repeated values are copied like any other value. Nothing is merged or removed.

**What the problem statement guarantees**

- `n == nums.length` and 1 ≤ n ≤ 1000, so the array is never empty.
- Every value lies between 1 and 1000.
- The answer has length exactly 2n.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. It is short, which is exactly why it is worth doing properly: the interviewer is watching how cleanly you work, not whether you find a trick. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 5 minutes and talk out loud.
2. Write down, for a small example, which input position each output position copies from.
3. Write the code, then trace it on Example 1 and on an array of one element.
4. State the time and the extra space, and say whether either can be improved.

Open a hint only after a minute without progress.

> [!HINT] Hint 1: a small nudge
> Before writing a loop, decide the length of the array you return. Then ask: for one input position, how many output positions does it fill, and which ones?

> [!HINT] Hint 2: the kind of tool you need
> Each input value goes to exactly two places whose positions differ by a fixed amount. One pass over the input is enough. Java also has standard methods that copy a whole block of an array at once.

> [!HINT] Hint 3: almost the whole plan
> Allocate an array of length 2n. For each `i` from 0 to n − 1, write `nums[i]` into slot `i` and into slot `i + n`. Return the new array. Then ask yourself whether any algorithm could do fewer than 2n writes.

**Check yourself before revealing the walkthrough**

- [ ] My answer array has length 2n, not n
- [ ] My code returns `[5, 5]` for `[5]`, and does not run past the end of either array
- [ ] I did not modify or return the input array itself
- [ ] I can say why there is nothing left to optimize

## 3. Interview script: understand the problem (≈1 min)

A problem this small still deserves thirty seconds of questions, because the questions are about the contract (new array or in place? may I touch the input?), not about the algorithm.

**Me:** Let me say it back. I get an array of length n, and I return an array of length 2n that is the input followed by the input again. So index `i` and index `i + n` both hold `nums[i]`?

**Interviewer:** Yes.

**Me:** Should I return a new array, or extend the input? In Java an array's length is fixed, so extending it in place isn't possible anyway, but I want to be sure you're not expecting a list.

**Interviewer:** Return a new `int[]`.

**Me:** Can the input be empty, and what values can it hold?

**Interviewer:** At least one element and at most 1000. Values are between 1 and 1000.

**Me:** Then nothing can overflow and there's no empty case to special-case. I'll leave the input untouched; I only read from it.

**Interviewer:** Fine.

**Me:** Quick example: `[7, 2, 9]`, n = 3. Slots 0 to 2 get 7, 2, 9. Slots 3 to 5 get the same, so slot 3 copies slot 0, slot 4 copies slot 1, slot 5 copies slot 2. That's the `i + n` relationship.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| `n == nums.length`, 1 ≤ n ≤ 1000 | The array is never empty, so no special case. The answer has at most 2000 elements; every reasonable approach is instant. |
| 1 ≤ `nums[i]` ≤ 1000 | Values are only copied, never combined, so their range does not matter for correctness. |
| The answer has length 2n | The output alone is 2n writes, which sets the floor for any algorithm (section 6). |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Return a new `int[]`, not a list | I allocate `new int[2 * n]` once. No resizing, no boxing. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The input array is read-only | Nothing says I may change it, and I don't need to. Returning `nums` itself, or writing into it, would be a bug. |

### Edge cases I will keep in mind

- n = 1: `[5]` must give `[5, 5]`.
- Repeated values: `[4, 4]` gives four 4s; the code must not treat equal values specially.
- The last index: slot `2n − 1` must be filled, so the loop bound has to be right.

## 4. Think out loud: from first idea to best solution

There is only one idea here (copy each element twice), so the two approaches below differ in how the copying is written, not in complexity.

### Approach 1: One loop, two writes per element

#### What I say out loud

> "The output has length 2n. Every input position `i` lands in two output positions, `i` and `i + n`. So I allocate the result once, loop over the input, and write each value twice. That's n iterations and 2n writes."

#### Intuition

The output is two copies placed side by side. The second copy starts at offset n, so the partner slot of `i` is always `i + n`. Looping over the input (n steps) instead of the output (2n steps) avoids any modulo arithmetic. This is a plain indexed traversal, as in [[a2-array-string-traversal|Array and String Traversal]].

#### Algorithm

1. Let `n = nums.length` and allocate `ans = new int[2 * n]`.
2. For each `i` from 0 to n − 1: set `ans[i] = nums[i]` and `ans[i + n] = nums[i]`.
3. Return `ans`.

#### Why it is correct

- **Every output slot is filled.** The slots 0 to n − 1 are filled by the first write as `i` goes from 0 to n − 1, and the slots n to 2n − 1 by the second write. Together that is every slot from 0 to 2n − 1, each exactly once.
- **Every slot holds the right value.** Slot `i` for `i < n` holds `nums[i]`, and slot `i + n` holds `nums[i]`, which is the definition of the answer.
- **No index goes out of range.** The largest index written is `(n − 1) + n = 2n − 1`, the last slot.

#### Dry run

`nums = [7, 2, 9]`, n = 3

| i | nums[i] | Writes | `ans` after the step |
|---|---|---|---|
| — | — | allocate | `[0, 0, 0, 0, 0, 0]` |
| 0 | 7 | `ans[0]`, `ans[3]` | `[7, 0, 0, 7, 0, 0]` |
| 1 | 2 | `ans[1]`, `ans[4]` | `[7, 2, 0, 7, 2, 0]` |
| 2 | 9 | `ans[2]`, `ans[5]` | `[7, 2, 9, 7, 2, 9]` |

Returns `[7, 2, 9, 7, 2, 9]`.

#### Java code

```java title="Approach 1: one loop, two writes (recommended)"
class Solution {
    public int[] getConcatenation(int[] nums) {
        int n = nums.length;
        int[] ans = new int[2 * n];
        for (int i = 0; i < n; i++) {
            ans[i] = nums[i];       // first copy
            ans[i + n] = nums[i];   // second copy, shifted by n
        }
        return ans;
    }
}
```

#### Time complexity

**O(n) in every case**, where n is the length of `nums`. Allocating the result zero-fills 2n slots, the loop runs n times, and each iteration does two reads and two writes. There is no best or worst case: the work is the same for every input of length n.

#### Space complexity

**O(1) auxiliary space.** The result array of 2n integers is the required output, so it is not counted as extra; besides it there is only the loop counter. If an interviewer counts the output, say "O(n) including the output", which no correct solution can avoid.

#### The bridge to the next approach

> "That's already linear, and the output has 2n slots that each have to be written, so I can't do better in complexity. What I can do is let the standard library do the copying: Java has methods that copy a whole block of an array in one call. It's the same complexity, but less code to get wrong."

### Approach 2: Library block copies

#### What I say out loud

> "`Arrays.copyOf(nums, 2 * n)` gives me a new array of length 2n with `nums` in the first half and zeros in the second. Then `System.arraycopy` copies `nums` again into positions n onward. Two lines, no index arithmetic of my own."

#### Intuition

The answer is two block copies: the input to offset 0, and the input to offset n. The library's block copy expresses that directly.

#### Algorithm

1. `ans = Arrays.copyOf(nums, 2 * n)`: a new array of length 2n, first n slots copied from `nums`, the rest zero.
2. `System.arraycopy(nums, 0, ans, n, n)`: copy n elements from `nums` starting at 0 into `ans` starting at n.
3. Return `ans`.

#### Why it is correct

`Arrays.copyOf` with a longer length is documented to copy the original and pad the rest with zeros, so after step 1 slots 0 to n − 1 are right. `System.arraycopy(src, srcPos, dest, destPos, length)` copies `src[srcPos .. srcPos + length − 1]` into `dest[destPos .. destPos + length − 1]`; here that is `nums[0 .. n − 1]` into `ans[n .. 2n − 1]`, which fills the second half. The two arrays are different objects, so there is no overlap to worry about.

#### Dry run

`nums = [4, 4]`, n = 2

| Step | `ans` afterwards |
|---|---|
| `Arrays.copyOf(nums, 4)` | `[4, 4, 0, 0]` |
| `System.arraycopy(nums, 0, ans, 2, 2)` | `[4, 4, 4, 4]` |

Returns `[4, 4, 4, 4]`.

#### Java code

```java title="Approach 2: Arrays.copyOf + System.arraycopy"
import java.util.Arrays;

class Solution {
    public int[] getConcatenation(int[] nums) {
        int n = nums.length;
        int[] ans = Arrays.copyOf(nums, 2 * n);   // nums, then n zeros
        System.arraycopy(nums, 0, ans, n, n);     // overwrite the zeros with nums
        return ans;
    }
}
```

#### Time complexity

**O(n).** `Arrays.copyOf` allocates 2n slots and copies n; `System.arraycopy` copies n more. Both do work proportional to the number of elements. On current JVMs these copies are usually compiled to fast bulk memory moves, so they tend to beat a hand-written loop by a constant factor; that is implementation behaviour, not something the API promises, and it does not change the O(n).

#### Space complexity

**O(1) auxiliary space** beyond the 2n-element output, as in Approach 1.

### Alternative: loop over the output with `i % n`

`for (int i = 0; i < 2 * n; i++) ans[i] = nums[i % n];` is also correct and O(n). It reads naturally as "output slot `i` copies input slot `i mod n`", and it generalizes directly to k copies (loop to `k * n`). For exactly two copies it does one modulo per slot for no benefit, so I mention it rather than lead with it.

## 5. Comparison table

n = length of `nums`. Nothing here hashes or sorts, so expected and worst case are the same.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. One loop, two writes | O(n) | O(n) | O(1) beyond the 2n output |
| 2. `Arrays.copyOf` + `System.arraycopy` | O(n) | O(n) | O(1) beyond the 2n output |
| Alt. Loop over output with `i % n` | O(n) | O(n) | O(1) beyond the 2n output |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. One loop, two writes | Shows the index relationship; no library knowledge needed | Two index expressions to get right | The default in an interview: it shows your reasoning |
| 2. Library block copies | Shortest; usually fastest in practice | Hides the logic; you must remember the argument order of `arraycopy` | Production code, or as a one-line mention after Approach 1 |
| Alt. `i % n` over the output | One write per iteration; extends to k copies | A modulo per element | When asked for k copies |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 1, then mention Approach 2 in one sentence as what you would write in production.

**Is it optimal?** Yes, and here the bound holds on every input, not just in the worst case: the answer has 2n slots and each must be written with a value read from the input, so any algorithm does Ω(n) work. Approach 1 does exactly that. Auxiliary space is O(1); the 2n output is required.

**When to stop:** immediately. There is no faster algorithm to look for, so spend the remaining time on a clean trace and on the follow-ups. Do not invent an optimization to look busy.

## 7. Interview script: code it and test it

### What I say while coding

> "Signature: `int[] getConcatenation(int[] nums)`. I store `n` once so the two index expressions read clearly."

> "I allocate `2 * n`, not `n`. That's the one line that's easy to get wrong."

> "Inside the loop, two writes: `ans[i]` and `ans[i + n]`. The loop runs to `n`, not `2 * n`, otherwise `i + n` would go out of bounds."

> "I return `ans`, the new array. I never write into `nums`."

### Testing out loud

**Normal case:** `[7, 2, 9]`. `ans` has length 6. `i = 0` writes 7 at 0 and 3, `i = 1` writes 2 at 1 and 4, `i = 2` writes 9 at 2 and 5. Returns `[7, 2, 9, 7, 2, 9]`. Correct.

**Smallest input:** `[5]`, n = 1. `ans` has length 2. `i = 0` writes 5 at 0 and at `0 + 1 = 1`. The loop ends. Returns `[5, 5]`. Correct, and index 1 is the last slot, so no overrun.

**Repeated values:** `[4, 4]`. `i = 0` writes 4 at 0 and 2, `i = 1` writes 4 at 1 and 3. Returns four 4s. Nothing in the code looks at values, so duplicates cannot matter.

## 8. Time plan for the interview

This is a warm-up, usually expected in under five minutes.

| Phase | Time | What to get done |
|---|---|---|
| Clarify | about 30 s | New array, input untouched, n ≥ 1 |
| Explain the index relationship | about 30 s | Slot `i` and slot `i + n` both hold `nums[i]` |
| Code | 1–2 min | Approach 1 |
| Trace and complexity | 1 min | `[7, 2, 9]` and `[5]`; O(n), optimal because the output has 2n slots |

The time should go into code that is right the first time and a crisp optimality argument. If you get stuck, write out the output positions for `[7, 2, 9]` by hand and read the relationship off them.

## 9. Interviewer challenges

### About complexity and implementation

#### Can this be done faster than O(n)?

**What they are testing:** whether you can argue a lower bound instead of guessing.

**How to reason:** look at the output, not the algorithm. Its size alone forces the work.

**What I say:** "No. The result has 2n slots, and each one has to be written with a value from the input, so any algorithm does at least 2n writes. That's Ω(n) on every input, and my loop does exactly 2n writes."

**Nuance:** this is stronger than the usual worst-case lower bound: no input of length n lets an algorithm finish early, because the output size does not depend on the values.

#### What is the space complexity?

**What they are testing:** whether you distinguish the output from extra memory.

**How to reason:** the 2n-element array is the answer itself. The question is what you use in addition to it.

**What I say:** "O(1) auxiliary: one loop counter. Counting the returned array it's O(n), but every correct solution has to return 2n elements, so that part can't be reduced."

**Nuance:** some interviewers count the output and some do not. Saying both numbers avoids the argument.

#### Is `System.arraycopy` faster than your loop? Does it change the complexity?

**What they are testing:** whether you separate constant factors from asymptotic cost, and implementation from contract.

**How to reason:** both copy n elements, so both are O(n). The difference is how each element is copied.

**What I say:** "Same complexity: it still copies every element. On current JVMs it's usually faster in practice, because the copy is handled as a bulk memory move rather than one bounds-checked element at a time. That's how the implementation behaves, not something the API guarantees, and for at most 2000 elements the difference isn't measurable."

**Nuance:** for arrays this small, the JIT may not even have compiled the hand-written loop yet; micro-benchmarks at this size say very little.

## 10. Follow-up questions the interviewer might ask

**"What if you need k copies instead of two?"**
Allocate `k * n` and fill slot `p` with `nums[p % n]`, or call `System.arraycopy` once per copy at offset `j * n`. O(kn) time, which matches the output size, and O(1) auxiliary space. Check that `k * n` fits in an `int` before allocating.

**"What if memory is tight and the caller only reads the result?"**
Do not build the array at all. Return a read-only view whose `get(p)` returns `nums[p % n]` and whose size is 2n. O(1) time and space to create, O(1) per read. The catch is that the view changes if `nums` changes, so this only works if the caller agrees to that contract.

**"What if the input were an `ArrayList<Integer>` and you had to append to it?"**
Record `n = list.size()` before the loop, then `add(list.get(i))` for `i < n`. Looping until `list.size()` instead never terminates normally (it runs until memory runs out), because the list grows as you append. O(n) amortized, because `ArrayList` occasionally grows its backing array; `ensureCapacity(2 * n)` up front avoids those copies.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Looking for an optimization that cannot exist.** The output size is the lower bound. Say so and move on.
- **Not asking about the contract.** "New array or in place?" takes five seconds and is the only real question here.

### Implementation mistakes

> [!MISTAKE] Allocating the wrong length
> `new int[n]` makes `ans[i + n]` throw `ArrayIndexOutOfBoundsException` at `i = 0`. The answer has length `2 * n`.

- **Looping to `2 * n` while writing `ans[i + n]`.** At `i = n` the index is `2n`, one past the end, and `nums[i]` also overruns. Loop to `n` when you write two slots per iteration.
- **Swapping `System.arraycopy` arguments.** The order is source, source position, destination, destination position, length. Writing `System.arraycopy(ans, n, nums, 0, n)` copies the wrong way.
- **Returning `nums`, or assigning `ans = nums`.** That is the same array object, not a copy, and has the wrong length.

## 12. Pattern recognition

**The pattern:** direct index mapping. Each output position is a fixed function of an input position (here `i` and `i + n`), so one indexed pass builds the answer.

**Signals in the problem statement:**

- The output is a rearrangement or repetition of the input, with its length given up front.
- The statement defines the answer position by position ("`ans[i] == nums[i]` and `ans[i + n] == nums[i]`").

**Related problems in this list:**

- [[nc-merge-strings-alternately|Merge Strings Alternately]]: build an output by writing from two sources with explicit indices.
- [[nc-rotate-array|Rotate Array]]: the same "output slot comes from input slot `(i + k) mod n`" mapping, made harder by doing it in place.
- [[nc-merge-sorted-array|Merge Sorted Array]]: filling an array position by position with careful index bounds.
- [[nc-remove-element|Remove Element]]: the next step up, where the write position is no longer a fixed function of the read position.

**Takeaway:** when each output slot is determined by its index, write the index formula first, then the loop. Check the formula on the first and last slot.

## 13. 60-second revision card

**Key insight:** input slot `i` goes to output slots `i` and `i + n`.

**Invariant:** after iteration `i`, slots 0 to `i` and n to `n + i` of `ans` are filled.

**Complexity:** O(n) time, O(1) auxiliary space beyond the 2n output. Optimal on every input: the 2n output slots must all be written.

**Code skeleton:**

```java title="Concatenation in five lines"
class Solution {
    public int[] getConcatenation(int[] nums) {
        int n = nums.length;
        int[] ans = new int[2 * n];
        for (int i = 0; i < n; i++) ans[i] = ans[i + n] = nums[i];
        return ans;
    }
}
```

**Main traps:**

- Allocate `2 * n`, loop to `n`.
- Return a new array; never `nums` itself.
- `System.arraycopy(src, srcPos, dest, destPos, length)`: source first.

**What to say in one breath:** "Each input element lands at `i` and `i + n`, so one loop writes it twice into a new array of length 2n. That's O(n) time and O(1) extra space, and it's optimal because the output itself has 2n slots to fill."
