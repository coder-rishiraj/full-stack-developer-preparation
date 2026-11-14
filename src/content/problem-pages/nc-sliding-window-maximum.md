---
problemId: nc-sliding-window-maximum
title: Sliding Window Maximum
source: neetcode
sourceUrl: https://leetcode.com/problems/sliding-window-maximum/
difficulty: hard
patterns: [sliding-window, monotonic-queue, heap, prefix-sum]
relatedLessons: [a2-sliding-window, a5-monotonic-queue, a5-deque, a7-priority-queues, a2-prefix-suffix, a14-deriving-optimization]
companies: []
timeToSolve: 30
---

## 1. Problem restatement

You get an integer array `nums` of length n and a window size k. Picture a frame exactly k elements wide placed over the first k elements, then moved one position to the right at a time until it covers the last k elements. That is n − k + 1 positions. For each position, report the largest value inside the frame. Return those maximums in order, as an array.

**Example 1**

- Input: `nums = [1, 3, -1, -3, 5, 3, 6, 7]`, `k = 3`
- Output: `[3, 3, 5, 5, 6, 7]`
- Why: the six windows are `[1, 3, -1]`, `[3, -1, -3]`, `[-1, -3, 5]`, `[-3, 5, 3]`, `[5, 3, 6]` and `[3, 6, 7]`, and their largest values are 3, 3, 5, 5, 6 and 7.

**Example 2**

- Input: `nums = [1]`, `k = 1`
- Output: `[1]`
- Why: one window containing the single element.

**What the problem statement guarantees**

- 1 ≤ n ≤ 10^5, where n = `nums.length`.
- −10^4 ≤ `nums[i]` ≤ 10^4.
- 1 ≤ k ≤ n, so there is always at least one window.
- The method is `public int[] maxSlidingWindow(int[] nums, int k)`.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The direct method is easy and too slow for large windows; the fast one needs you to decide precisely which elements are worth remembering. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 30 minutes and talk out loud.
2. Write the direct method and work out its cost for n = 10^5 and k = 5 × 10^4.
3. On Example 1, as the window moves, write down at each step which elements of the window could still become the maximum of some *later* window. Cross out the ones that never can, and say why.
4. Look at the elements you did not cross out. What order are their values in?
5. Build a solution that does a constant amount of work per element on average, and trace it on Example 1.

Open a hint only after two minutes without progress. After each hint, close it and try again before opening the next one.

> [!HINT] Hint 1: a small nudge
> Suppose an element arrives that is larger than some element already in the window, which arrived earlier. Can the earlier, smaller element ever be the maximum of any future window? Think about which of the two leaves the window first.

> [!HINT] Hint 2: the kind of tool you need
> Keep only the elements that are not ruled out, in arrival order. Remove from one end the ones that a new arrival rules out, and from the other end the ones that have slid out of the window. A structure that allows removal at both ends is what you need, and it should store positions, not values.

> [!HINT] Hint 3: almost the whole plan
> Keep a double-ended queue of indices whose values decrease from front to back. For each new index i: remove the front if it is i − k (it just left the window); remove from the back every index whose value is ≤ `nums[i]`; append i. Once i ≥ k − 1, the front index holds the window's maximum. Each index enters once and leaves at most once.

**Check yourself before revealing the walkthrough**

- [ ] I can say why a removed element can never be the maximum of a later window
- [ ] I store indices, and I can explain why values alone are not enough
- [ ] My solution is O(n) time, and I can explain why the inner loop does not make it O(n·k)
- [ ] My code returns `[3, 3, 5, 5, 6, 7]` for Example 1 and works for k = 1, k = n, and an all-equal array
- [ ] I know what my code does with equal values, and why it is still correct

## 3. Interview script: understand the problem (≈3 min)

**Me:** Let me restate it. The window covers indices `i − k + 1` to `i`, for each i from k − 1 to n − 1, so there are n − k + 1 windows, and I return the maximum of each, in order.

**Interviewer:** Yes.

**Me:** Sizes and values?

**Interviewer:** n up to 10^5, values between −10^4 and 10^4, and k is between 1 and n.

**Me:** So there's always at least one window, and values can be negative, so I can't initialise a maximum to 0. Duplicates are allowed, I assume, since nothing rules them out?

**Interviewer:** Yes, values can repeat.

**Me:** Two special cases to keep in mind: k = 1, where the answer is the array itself, and k = n, where it's a single number, the maximum of everything. And I only compare values, never add them, so there's no overflow to worry about.

**Me:** Let me do Example 1 by hand: `[1, 3, -1, -3, 5, 3, 6, 7]`, k = 3. First window `[1, 3, -1]`: max 3. Slide: drop 1, add −3: `[3, -1, -3]`, max still 3. Slide: drop 3, add 5. Now the maximum left, so I'd have to look again, and I get 5. Then 5 again, 6, 7. The interesting moment is when the maximum itself leaves the window: I need to know the *next* best quickly. That's the crux.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^5 | Rescanning each window is (n − k + 1)·k steps, about 2.5 × 10^9 when k = 5 × 10^4. Too slow; I want O(n) or O(n log n). |
| 1 ≤ k ≤ n | There are n − k + 1 ≥ 1 windows: the output array is never empty. k = 1 and k = n are both valid. |
| −10^4 ≤ nums[i] ≤ 10^4 | Values can be negative, so a running maximum must start from an element (or `Integer.MIN_VALUE`), not 0. Only comparisons happen, so no overflow. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Values can repeat | Equal values must be handled deliberately: whether I keep or discard an older equal value has to be justified (section 4). |
| Output in window order | Window starting at index j goes to `result[j]`. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| I must not modify `nums` | Nothing says I may, and none of the approaches needs to. |
| The whole array is available up front | The signature passes it in. The recommended approach would also work on a stream (section 10), but the block approach would not. |

### Edge cases I will keep in mind

- k = 1: every element is its own window's maximum.
- k = n: one window, the overall maximum.
- Strictly increasing input: every new element is the new maximum.
- Strictly decreasing input: the maximum is always the oldest element, and it is always the one that leaves.
- All equal: every maximum is that value; equal values must not break the logic.
- The maximum leaving the window: Example 1 at the window `[-1, -3, 5]`.

## 4. Think out loud: from first idea to best solution

> "Simplest thing: for each window, scan its k elements. That's correct by definition, but it costs (n − k + 1)·k. At n = 10^5 that peaks around k = 5 × 10^4, at 50,001 × 50,000 ≈ 2.5 × 10^9 comparisons. That won't run in time, so it's my baseline and test reference, not an answer."

> "What's wasted? Consecutive windows share k − 1 elements. The trouble is that maximum is not reversible like a sum: when an element leaves, I can't 'subtract' it. If the element leaving is the maximum, I need the maximum of what remains. So I need a structure that gives me the maximum of a changing set, with insertions on one side and deletions of the oldest element."

> "First structure that comes to mind for 'repeatedly give me the maximum' is a max-heap. The problem is deletion: a heap can't cheaply delete an arbitrary element. But I don't actually need to delete the old element right away. I only care whether the *top* is still in the window. So I can store indices with the values and throw away stale tops lazily."

### Approach 1: Max-heap with lazy deletion

#### What I say out loud

> "I push `(value, index)` for every element into a max-heap ordered by value. When the window ending at i is complete, the top is the largest value pushed so far, but it might have slid out. If its index is ≤ i − k, it's out of the window; I pop it and look again. The first top whose index is inside the window is the answer. Stale entries that aren't on top don't matter: they're buried below a larger, valid one, and if they surface later, I'll discard them then."

#### Intuition

A heap gives the maximum of everything it holds. The heap holds every element pushed so far, some of them stale. The maximum of the window is the largest **non-stale** entry, so peel stale entries off the top until the top is fresh. An entry is only ever popped once, so the peeling costs O(log n) per entry over the whole run.

#### Algorithm

1. Create a max-heap of `{value, index}` pairs, ordered by value.
2. For i from 0 to n − 1:
   1. Push `{nums[i], i}`.
   2. If i ≥ k − 1:
      1. While the top's index ≤ i − k, pop it.
      2. `result[i − k + 1]` = the top's value.
3. Return `result`.

#### Why it is correct

The window ending at i is the index range `i − k + 1..i`. At the moment of the query, the heap contains every index 0..i except those already popped, and every popped index was ≤ i' − k for some earlier i' ≤ i, so it is outside the current window too. Therefore **every index of the window is still in the heap**. The loop removes tops until the top's index is ≥ i − k + 1, that is, inside the window. That top is at least as large as every entry in the heap, in particular every element of the window, and it is itself in the window, so it is the window's maximum. The loop always stops with a non-empty heap, because index i was just pushed and is in the window.

#### Dry run

`nums = [9, 8, 1, 2, 3]`, k = 2, chosen so that stale tops appear. Entries are written (value, index).

| i | Pushed | Window | Stale tops popped | Top after | Output | Heap size |
|---|---|---|---|---|---|---|
| 0 | (9, 0) | incomplete | | | | 1 |
| 1 | (8, 1) | 0..1 | none | (9, 0) | 9 | 2 |
| 2 | (1, 2) | 1..2 | (9, 0): index 0 ≤ 0 | (8, 1) | 8 | 2 |
| 3 | (2, 3) | 2..3 | (8, 1): index 1 ≤ 1 | (2, 3) | 2 | 2 |
| 4 | (3, 4) | 3..4 | none | (3, 4) | 3 | 3 |

Returns `[9, 8, 2, 3]`. At i = 4 the heap still holds (1, 2), which left the window at that step. It is buried under (3, 4), so it costs nothing now; it would be popped only if it ever reached the top. On Example 1 the top is never stale when queried, and the method returns `[3, 3, 5, 5, 6, 7]` with all 8 entries still in the heap at the end.

#### Java code

```java title="Approach 1: max-heap with lazy deletion"
import java.util.PriorityQueue;

class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] result = new int[n - k + 1];
        // Entries are {value, index}; the largest value is at the top.
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(b[0], a[0]));
        for (int i = 0; i < n; i++) {
            heap.offer(new int[] {nums[i], i});
            if (i >= k - 1) {                         // the window [i - k + 1, i] is complete
                while (heap.peek()[1] <= i - k) {     // lazy deletion: discard tops that left the window
                    heap.poll();
                }
                result[i - k + 1] = heap.peek()[0];
            }
        }
        return result;
    }
}
```

`Integer.compare` avoids the subtraction `b[0] - a[0]`, which is safe for these values but overflows for general `int`s.

#### Time complexity

**O(n log n) in the worst case**, where n = `nums.length`. Each index is pushed once and popped at most once, and each push or pop costs O(log h) for a heap of size h ≤ n. Peeks are O(1). The heap really can reach size n: on a strictly increasing array the newest element is always the top, so nothing is ever popped. On a decreasing array, the oldest element is always on top and gets popped as it expires, so the heap stays near size k and the cost is O(n log k).

#### Space complexity

**O(n) auxiliary space in the worst case** for the heap (a strictly increasing array keeps every entry), plus the output array of n − k + 1 values.

#### The bridge to the next approach

> "The heap keeps far too much. Look at Example 1: once 5 arrives, the −1 and −3 before it can never be a maximum again. They're smaller than 5, and they'll leave the window *before* 5 does, because they arrived earlier. Any window containing them also contains 5. So they're dead weight."

> "Generalise that: an element is useless as soon as a later element at least as large arrives. If I throw useless elements away immediately, what's left? Reading from oldest to newest, each survivor must be larger than everything after it, otherwise it would have been thrown away. So the survivors are in **decreasing** order of value. Then the maximum is simply the oldest survivor, and a new element removes the useless ones from the newest end. Removal at both ends: a deque."

### Approach 2: Monotonic deque of indices (recommended)

#### What I say out loud

> "I keep a deque of indices. The values at those indices strictly decrease from front to back, and every index is inside the current window. The front is the window's maximum."

> "For each new index i: first, if the front index is i − k, it just slid out, so I remove it. Then, while the back's value is ≤ `nums[i]`, I pop the back, because i is newer and at least as large, so the back can never be a maximum again. Then I push i on the back. Once i ≥ k − 1, I write `nums[front]` to the output."

> "Each index is added once and removed at most once, so the total work is O(n), even though there's a `while` inside the loop."

#### Intuition

Call an element of the window **dominated** if some later element of the window is at least as large. A dominated element can never be the maximum of this or any future window: every future window that still contains it also contains the later, at-least-as-large element (the later one leaves later). So you can forget dominated elements the moment they become dominated. The ones that remain have no larger-or-equal element after them, which forces their values to strictly decrease from oldest to newest, and the oldest is the largest. This is a [[a5-monotonic-queue|monotonic queue]].

Store **indices**, not values: an index tells you whether the element has left the window (`index ≤ i − k`) and distinguishes equal values at different positions.

#### Algorithm

1. Create an empty deque of indices and `result` of length n − k + 1.
2. For i from 0 to n − 1:
   1. If the deque is not empty and its front is ≤ i − k, remove the front.
   2. While the deque is not empty and `nums[back] ≤ nums[i]`, remove the back.
   3. Add i at the back.
   4. If i ≥ k − 1, set `result[i − k + 1] = nums[front]`.
3. Return `result`.

#### Why it is correct

**The invariant**, after step 2.3 for index i: the deque holds exactly the indices j in the window `max(0, i − k + 1)..i` that are **not dominated**, meaning `nums[j] > nums[j']` for every j' with j < j' ≤ i, in increasing order of index.

- **Values strictly decrease along the deque.** Each index in it is larger than every later element of the window, so in particular larger than every later index in the deque.
- **The front is the window's maximum.** Take the position of the maximum value in the window; if it occurs more than once, take its last occurrence. Nothing after it is at least as large, so it is not dominated and is in the deque. Values decrease along the deque, so it is the front.

**The invariant is maintained when i arrives.**

- *Expiry (step 2.1).* Going from window `i − k..i − 1` to `i − k + 1..i`, the only index that leaves is i − k. All deque indices are distinct and increasing, so if i − k is in the deque it is at the front, and one `if` removes it. (Earlier indices were removed at earlier steps by the same rule.) So one check per step is enough, not a loop.
- *Domination (step 2.2).* The new element i dominates exactly the window elements j < i with `nums[j] ≤ nums[i]`. Every element that was not dominated before and is not dominated by i stays undominated. Because the deque's values decrease from front to back, the ones with `nums[j] ≤ nums[i]` form a run at the back, so popping from the back while `nums[back] ≤ nums[i]` removes exactly them and stops at the first larger value.
- *Insertion (step 2.3).* i itself has nothing after it, so it is not dominated; it goes at the back, keeping the index order.

**Nothing removed was needed.** A popped back index j is dominated by i, and i stays in every window that contains j (it is newer), so j is never a window maximum again. An expired front index is out of every future window.

**Equal values: `<=` or `<`?** With `<=` (as written), an older element equal to the new one is popped, so the deque holds strictly decreasing values. With `<`, equal older elements stay, the deque is non-increasing, and the front is the *oldest* copy of the maximum instead of the newest. Both are correct: in the `<` version the front expires first, but an equal copy is right behind it, so the maximum reported is the same. `<=` keeps the deque shorter (an all-equal array keeps one index instead of up to k), so I prefer it. The choice matters only if you store **values** instead of indices (see section 11).

**The 25-second version to say to the interviewer:**

> "An element is useless once a newer element at least as large arrives, since the newer one stays in the window longer. If I drop useless elements immediately, the survivors are in decreasing order, so the oldest survivor is the maximum. I keep their indices in a deque: pop the front when it leaves the window, pop the back while it's ≤ the new value, push the new index, and read the front. Each index is pushed once and popped at most once, so it's O(n) time and O(k) extra space."

#### Dry run

Example 1: `nums = [1, 3, -1, -3, 5, 3, 6, 7]`, k = 3. Deque entries are written `index:value`, front first.

| i | nums[i] | Expire front (≤ i − k)? | Popped from back (≤ nums[i]) | Deque after | Output |
|---|---|---|---|---|---|
| 0 | 1 | no | | [0:1] | |
| 1 | 3 | no | 0:1 | [1:3] | |
| 2 | −1 | no (1 > −1) | | [1:3, 2:−1] | result[0] = 3 |
| 3 | −3 | no (1 > 0) | | [1:3, 2:−1, 3:−3] | result[1] = 3 |
| 4 | 5 | yes, 1 ≤ 1: remove 1:3 | 3:−3, 2:−1 | [4:5] | result[2] = 5 |
| 5 | 3 | no | | [4:5, 5:3] | result[3] = 5 |
| 6 | 6 | no (4 > 3) | 5:3, 4:5 | [6:6] | result[4] = 6 |
| 7 | 7 | no | 6:6 | [7:7] | result[5] = 7 |

Returns `[3, 3, 5, 5, 6, 7]`. Step 4 is the crux from section 3: the maximum, 3 at index 1, leaves the window, and the next candidates −1 and −3 are already lined up behind it; then 5 arrives and dominates all of them. Over the run there were 8 pushes and 7 removals (1 from the front, 6 from the back).

#### Java code

```java title="Approach 2: monotonic deque of indices (recommended)"
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] result = new int[n - k + 1];
        Deque<Integer> deque = new ArrayDeque<>();   // indices; their values strictly decrease front to back
        for (int i = 0; i < n; i++) {
            if (!deque.isEmpty() && deque.peekFirst() <= i - k) {
                deque.pollFirst();                       // the front index has left the window
            }
            while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]) {
                deque.pollLast();                        // dominated by i: older and not larger
            }
            deque.offerLast(i);
            if (i >= k - 1) {
                result[i - k + 1] = nums[deque.peekFirst()];
            }
        }
        return result;
    }
}
```

`ArrayDeque` is the right class: it supports O(1) amortized insertion and removal at both ends. A `Stack` cannot remove from the bottom, and a `LinkedList` works but allocates a node per element. It holds boxed `Integer`s; the comparison `deque.peekFirst() <= i - k` unboxes, so it compares numbers, not references. An `int[]` of size n used as a circular buffer with head and tail indices avoids the boxing if you need the speed.

#### Time complexity

**O(n) in every case (amortized O(1) per element).** Each index is added to the deque exactly once and removed at most once, either from the front by expiry or from the back by domination. Every iteration of the inner `while` removes one index, so across the whole run the `while` body executes at most n times in total, even though a single step can pop many (step 6 of the dry run pops two). Everything else in the loop is O(1) per index. The `ArrayDeque` operations are themselves O(1) amortized (it occasionally resizes its backing array).

#### Space complexity

**O(k) auxiliary space**: after step 2.1 every index in the deque lies in the current window, so the deque holds at most k indices (a strictly decreasing window keeps all k). The output array of n − k + 1 values is required by the problem and not counted.

### Alternative: block prefix and suffix maxima

Split the array into blocks of k elements: indices 0..k − 1, k..2k − 1, and so on (the last block may be shorter). Compute two arrays:

- `prefixMax[i]` = the maximum from the start of i's block up to i;
- `suffixMax[i]` = the maximum from i to the end of i's block.

A window `[i, i + k − 1]` has length k, so it is either exactly one block or the **end of one block followed by the start of the next**. In both cases its maximum is `max(suffixMax[i], prefixMax[i + k − 1])`: the first covers the part in i's block, the second the part in the next block (if i starts a block, both equal that block's maximum). This is the [[a2-prefix-suffix|prefix and suffix]] idea from [[nc-trapping-rain-water|Trapping Rain Water]], applied per block.

On Example 1 (blocks `[1, 3, -1]`, `[-3, 5, 3]`, `[6, 7]`):

| i | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|---|
| nums | 1 | 3 | −1 | −3 | 5 | 3 | 6 | 7 |
| prefixMax | 1 | 3 | 3 | −3 | 5 | 5 | 6 | 7 |
| suffixMax | 3 | 3 | −1 | 5 | 5 | 3 | 7 | 7 |

Window 0: max(suffixMax[0], prefixMax[2]) = max(3, 3) = 3. Window 1: max(3, −3) = 3. Window 2: max(−1, 5) = 5. Window 3: max(5, 5) = 5. Window 4: max(5, 6) = 6. Window 5: max(3, 7) = 7.

```java title="Alternative: block prefix and suffix maxima"
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] prefixMax = new int[n];   // max from the start of i's block up to i
        int[] suffixMax = new int[n];   // max from i to the end of i's block
        for (int i = 0; i < n; i++) {
            prefixMax[i] = (i % k == 0) ? nums[i] : Math.max(prefixMax[i - 1], nums[i]);
        }
        for (int i = n - 1; i >= 0; i--) {
            boolean blockEnd = (i == n - 1) || ((i + 1) % k == 0);
            suffixMax[i] = blockEnd ? nums[i] : Math.max(suffixMax[i + 1], nums[i]);
        }
        int[] result = new int[n - k + 1];
        for (int i = 0; i + k <= n; i++) {
            // The window [i, i + k - 1] is a suffix of one block followed by a prefix of the next.
            result[i] = Math.max(suffixMax[i], prefixMax[i + k - 1]);
        }
        return result;
    }
}
```

**Cost.** O(n) time in every case: three plain passes, no amortization argument. O(n) auxiliary space for the two arrays.

**When it wins.** It has no data structure at all, its loops are branch-light and cache-friendly, and the correctness argument ("a length-k window spans at most two blocks") is short. It is a good answer if the deque invariant is not coming together. It needs the whole array up front, so unlike the deque it does not work on a stream, and it uses O(n) memory instead of O(k).

## 5. Comparison table

n = `nums.length`, k = window size. No approach uses hashing or randomness, so expected and worst case are the same.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Rescan each window (not coded) | O(n·k) | O(n·k) | O(1) |
| 1. Max-heap with lazy deletion | O(n log n) | O(n log n) | O(n) |
| 2. Monotonic deque | O(n) | O(n) | O(k) |
| Alt. Block prefix/suffix maxima | O(n) | O(n) | O(n) |

The output array of n − k + 1 values is not counted.

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Rescan | Trivially correct | About 2.5 × 10^9 steps at k = n/2 | Test reference only |
| 1. Heap | Uses a standard structure; easy to argue | O(n log n); heap can hold all n entries; allocation per element | When the deque does not come to mind; also generalises to windows that are not contiguous ranges |
| 2. Deque | Optimal time, O(k) space, works on a stream | The invariant must be explained, and `<=`/expiry details are easy to slip on | The answer to give |
| Alt. Blocks | O(n) with plain arrays and a short proof | O(n) extra space; needs all input up front | As a fallback or a second O(n) answer when asked for one without a deque |

A balanced search tree of the window (a `TreeMap<Integer, Integer>` from value to count) also works, with exact deletion: O(n log k) time, O(k) space. It sits between the heap and the deque and is worth mentioning only if the interviewer asks for a variant that also needs the minimum or the median.

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2, the monotonic deque. Present the rescan cost, mention the heap as the first improvement (or code it if you are not yet sure of the deque), then derive the deque from "an element is useless once a newer, at-least-as-large element arrives". That sentence is the whole insight; the rest follows from it.

**Is it optimal?** Yes. It is O(n) time, and there is a worst-case Ω(n) lower bound for any algorithm that learns values by reading them: on an array of all −10^4, raising any single unread element to 10^4 changes the output of every window containing it, so every element must be read. The output itself has n − k + 1 entries. The deque's O(k) extra space keeps nothing it might not need: on a strictly decreasing window, every one of the k elements may still become the maximum of a later window.

**When another solution is better in practice:**

- If the deque invariant is not coming together, the heap is a correct O(n log n) answer that runs comfortably at n = 10^5, and the block method is a correct O(n) one.
- If the input is a stream, only the deque (or the heap) works; the block method needs the whole array.

**When to stop:** with the deque, its domination argument, the amortized bound and the equal-value discussion, you are done. Replacing `ArrayDeque<Integer>` with a primitive circular buffer is a constant-factor tweak to mention, not to code, unless asked.

## 7. Interview script: code it and test it

### What I say while coding

> "Signature `int[] maxSlidingWindow(int[] nums, int k)`. The output has n − k + 1 entries."

> "`ArrayDeque<Integer>` of indices. For each i, first expire: if the front index is `i − k`, it's out of the window. I compare with `<= i - k`, which here can only be equal, since one index leaves per step."

> "Then the domination loop: while the back's value is `<=` the new value, pop the back. Then push i."

> "Then, if `i >= k - 1`, the first window is complete, and the answer for the window starting at `i - k + 1` is `nums` at the front index."

> "I expire before reading the front, so the front is always inside the window when I read it."

### Testing out loud

**Normal case:** Example 1, as in the dry-run table, returns `[3, 3, 5, 5, 6, 7]`.

**k = 1:** `[2, 4]`. At i = 0, push 0, output 2. At i = 1, expire 0 (0 ≤ 0), pop nothing, push 1, output 4. Returns `[2, 4]`: the array itself. Each element expires one step after it arrives.

**k = n:** `[4, 2]`, k = 2. i = 0: push 0. i = 1: nothing expires (0 > −1), 4 > 2 so nothing popped, deque [0, 1], output `nums[0]` = 4. Returns `[4]`.

**Increasing:** `[1, 2, 3, 4, 5]`, k = 3. Every new element pops the whole deque, which always has one index; outputs 3, 4, 5. **Decreasing:** `[5, 4, 3, 2, 1]`, k = 3. Nothing is ever popped from the back; the deque fills to 3 indices and then the front expires each step: outputs 5, 4, 3.

**All equal:** `[7, 7, 7, 7]`, k = 2. With `<=`, each new 7 pops the old one, so the deque always holds the newest index only: outputs 7, 7, 7. (With `<` it would hold two indices and expire the older one each step: the same output.)

**Maximum leaving the window with an equal value behind it:** `[3, 3, 1]`, k = 2. i = 1 pops index 0 (3 ≤ 3), deque [1], output 3. i = 2: index 1 is not expired (1 > 0), push 2, output 3. Returns `[3, 3]`.

**Expiry boundary:** `[5, 1, 1]`, k = 2. i = 1: deque [0, 1], output 5. i = 2: index 0 ≤ 0, expired; then 1 ≤ 1 pops index 1; deque [2], output 1. Returns `[5, 1]`.

**Largest input:** n = 10^5, k = 5 × 10^4 on a decreasing array: the deque holds up to 5 × 10^4 indices, and each index is pushed once and expired once: about 2 × 10^5 deque operations in total.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 2 min | Window count n − k + 1, negatives, duplicates, k = 1 and k = n |
| Rescan and its cost | 2 min | O(n·k), 2.5 × 10^9 at the worst k |
| Heap | 3 min | Lazy deletion with indices; O(n log n). Code it only if the deque is not coming |
| Derive the deque | 5 min | "Useless once a newer, at-least-as-large element arrives", hence decreasing order |
| Argue correctness and cost | 3 min | Invariant, one expiry per step, each index pushed and popped once |
| Code | 5 min | Approach 2 |
| Trace and edge cases | 5 min | Example 1, k = 1, `[3, 3, 1]`, `[5, 1, 1]` |
| Questions | rest | Section 9 |

**Where the time should go:** the domination argument and the amortized bound. Interviewers often stop a candidate who writes the deque from memory and ask "why is this element safe to throw away?" or "isn't this O(n·k)?"; have both answers ready.

**If you get stuck:**

1. If only the rescan comes to mind, ask what a structure would need to support: maximum, insert newest, delete oldest. That points to a heap.
2. If the heap is coded, look at the dry run and ask which heap entries could ever be the answer again. Two elements, one older and smaller: which one matters?
3. If the deque details keep slipping, write the invariant first as a comment and derive each line from it, or switch to the block method.
4. Take hints calmly ([[a14-responding-to-hints|Responding to Interviewer Hints]]).

## 9. Interviewer challenges

### About correctness

#### Why is it safe to pop an element from the back?

**What they are testing:** the core argument, as opposed to a memorised template.

**How to reason:** compare the popped element with the new one on value and on time of departure.

**What I say:** "I pop index j only when `nums[j] ≤ nums[i]` and j < i. Any future window that contains j also contains i, because i is newer and leaves later. In that window, i is at least as large as j, so j's value is never needed as the maximum: either i or something larger gives the same or a bigger answer."

**Nuance:** this is also why the newest element is always pushed, even when it is small: it may become the maximum once everything older has expired. In Example 1, if index 6 held a small value instead of 6, the 3 at index 5 would be the maximum of the window `5..7`, after the 5 at index 4 expired.

#### Why do you store indices instead of values?

**What they are testing:** whether you understand how expiry works.

**How to reason:** ask how you would know that the front has left the window.

**What I say:** "With an index, expiry is one comparison: `front <= i - k`. With values, I'd have to check whether the outgoing value `nums[i - k]` equals the front value, which only works if I keep equal values in the deque. It's easy to get wrong, and indices make it trivial."

**Nuance:** the value-based version is correct only with strict popping (`<`). With `<=` it fails: on `[3, 3, 1]`, k = 2, it returns `[3, 1]` instead of `[3, 3]`, because the second 3 replaced the first, and then the outgoing first 3 matches the front and removes the wrong copy.

#### Why `if` and not `while` for removing expired indices from the front?

**What they are testing:** whether the loop structure follows from the invariant.

**How to reason:** how many indices leave the window per step?

**What I say:** "Exactly one index leaves per step, i − k. All earlier indices were already removed when they expired, so at most one front removal is ever needed. A `while` would also be correct, just with an argument that it runs at most once."

**Nuance:** the comparison must be `<= i - k`, not `< i - k`: the window ending at i starts at `i − k + 1`, so index `i − k` is already outside it. With `<`, `[5, 1, 1]` and k = 2 returns `[5, 5]` instead of `[5, 1]`.

### About complexity

#### There's a `while` inside a `for`. Why isn't this O(n·k)?

**What they are testing:** amortized analysis.

**How to reason:** count per index, not per iteration.

**What I say:** "Every pass of the inner `while` removes an index from the deque. Each index is added exactly once, so it can be removed at most once. So over the whole run, the inner loop body runs at most n times. Total O(n)."

**Nuance:** a single step can still do a lot of work (the arrival of a new maximum after a long decreasing run pops up to k − 1 indices); only the total is bounded. That is what amortized O(1) per element means.

#### Why is the heap O(n log n) and not O(n log k)?

**What they are testing:** precise reasoning about lazy deletion.

**How to reason:** find an input where stale entries never reach the top.

**What I say:** "Stale entries are only removed when they reach the top. On an increasing array, the newest element is always the largest, so nothing is ever popped and the heap grows to n entries. Each push costs O(log n), so the bound is O(n log n). Exact deletion, for example with a `TreeMap` of counts, keeps the structure at k entries and gives O(n log k)."

**Nuance:** `PriorityQueue.remove(Object)` does delete arbitrary elements, but it finds them by a linear scan, O(k) per removal; that would make it O(n·k) in the worst case.

## 10. Follow-up questions the interviewer might ask

**"Return the minimums instead."**
Flip the comparison: pop from the back while `nums[back] >= nums[i]`, so the deque increases from front to back. O(n).

**"The numbers arrive as a stream; output each window's maximum as soon as it is complete."**
The deque already reads the input once, left to right, and needs only the last k values (it can store values with their positions instead of indexing into the array). O(1) amortized per element, O(k) memory.

**"Longest subarray in which max − min ≤ limit."**
Use a variable-size window with two deques, one for the maximum and one for the minimum. Grow on the right; while `max − min > limit`, move the left end and expire deque fronts by index. O(n) in total, by the same push-once, pop-once argument.

**"Each element must be chosen from within k steps of the previous one, maximizing a sum (dynamic programming)."**
When `dp[i] = nums[i] + max(dp[i − k..i − 1])`, the maximum over a sliding range of earlier dp values is exactly this problem, and the deque turns an O(n·k) DP into O(n).

**"Many queries with different, arbitrary ranges on the same array."**
A sliding window no longer helps. Precompute a sparse table in O(n log n) and answer each range-maximum query in O(1), or use a segment tree if the array changes.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Thinking you need the second, third, … largest in a sorted structure.** You only need the elements that are not dominated, and they are already in decreasing order by arrival.
- **Calling the deque O(n·k) because of the nested loop.** Count pushes and pops per index instead.
- **Starting a running maximum at 0.** Values can be negative; `[-7, -8, ...]` windows would report 0.
- **Assuming the heap's stale entries must be deleted immediately.** Only the top matters; buried stale entries are harmless.

### Implementation mistakes

> [!MISTAKE] An off-by-one in the expiry test
> Expiring with `deque.peekFirst() < i - k` keeps index `i − k`, which is already outside the window `i − k + 1..i`. On `[5, 1, 1]` with k = 2 it returns `[5, 5]` instead of `[5, 1]`.

> [!MISTAKE] Storing values and popping equal ones
> With values in the deque, expiry has to test "is the outgoing value equal to the front?". If the back is popped with `<=`, a newer equal value replaces the older one, and the outgoing older copy then removes the newer one from the front. `[3, 3, 1]` with k = 2 returns `[3, 1]` instead of `[3, 3]`. Store indices, or pop with `<` if you insist on values.

- **Writing the output before the first window is complete.** Guard with `i >= k - 1`, and write to `result[i - k + 1]`, not `result[i]`.
- **Reading the front before expiring.** The front may be an index that has just left the window.
- **Heap comparator `b[0] - a[0]`.** Correct for these constraints, but it overflows for general `int` values; use `Integer.compare`.

## 12. Pattern recognition

**The pattern:** monotonic deque for sliding-window extremes. Keep only the candidates that can still be the answer, in an order that makes the best one sit at the front; discard from the back when a newcomer dominates, and from the front when a candidate expires.

**Signals in the problem statement:**

- "Maximum (or minimum) of every window of size k", or of a window whose left end only moves right.
- A DP whose transition takes a max or min over a sliding range of earlier states.
- Recomputing an extreme after removing an element, which a running maximum cannot do.

**Related problems in this list:**

- [[nc-trapping-rain-water|Trapping Rain Water]]: prefix and suffix maximums, the same tool as the block method here.
- [[nc-daily-temperatures|Daily Temperatures]]: a monotonic stack, the one-ended version of the same "pop while dominated" loop.
- [[nc-largest-rectangle-in-histogram|Largest Rectangle in Histogram]]: another monotonic structure where each index is pushed and popped once.
- [[nc-kth-largest-element-in-stream|Kth Largest Element in a Stream]]: a heap maintaining an order statistic as elements arrive.
- [[nc-minimum-window-substring|Minimum Window Substring]]: the other hard sliding-window problem in this category, with a variable-size window.

**Takeaway:** when a window needs its maximum or minimum, drop every element that a newer one dominates; the survivors form a monotonic deque whose front is the answer, and each element is pushed and popped at most once.

## 13. 60-second revision card

**Key insight:** an element is useless once a newer element at least as large arrives (the newer one stays longer). Without the useless ones, the window's candidates are in decreasing order, and the oldest is the maximum.

**Invariant:** the deque holds the indices of the window's undominated elements, oldest at the front, values strictly decreasing; its front is the window's maximum.

**Complexity:** O(n) time (each index pushed once and popped at most once), O(k) extra space. Worst-case Ω(n) lower bound.

**Code skeleton:**

```java title="Sliding Window Maximum, monotonic deque" fragment="public int[] maxSlidingWindow(int[] nums, int k)"
int[] result = new int[nums.length - k + 1];
java.util.ArrayDeque<Integer> dq = new java.util.ArrayDeque<>();     // indices, values decreasing
for (int i = 0; i < nums.length; i++) {
    if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();     // expired
    while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();   // dominated
    dq.offerLast(i);
    if (i >= k - 1) result[i - k + 1] = nums[dq.peekFirst()];
}
return result;
```

**Main traps:**

- Expire with `<= i - k`.
- Store indices, not values.
- Output only once `i >= k - 1`, into `result[i - k + 1]`.
- The nested `while` is O(n) in total, not per step.

**What to say in one breath:** "A newer element at least as large makes an older one useless, so I keep a deque of indices with decreasing values: pop the front when it leaves the window, pop the back while it's not larger than the new value, push, and read the front. Each index goes in and out once: O(n) time, O(k) space."
