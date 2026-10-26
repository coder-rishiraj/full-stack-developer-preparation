---
summary: A monotonic stack is an ordinary stack that you keep sorted by popping anything the new element makes useless. You will learn why that single rule answers "nearest larger or smaller element" questions for every index in O(n), how to choose the stack's direction, and how to apply it to histograms, digit removal and subarray-minimum sums.
difficulty: intermediate
minutes: 50
objectives:
  - Explain the monotonic stack invariant and why popping dominated elements loses no answers
  - Choose the stack direction and comparison (strict or non-strict) for a given question
  - Prove that a monotonic stack scan runs in O(n) despite its nested loop
  - Implement Largest Rectangle in Histogram and trace it on a meaningful input
  - Apply the pattern to Remove K Digits and Sum of Subarray Minimums, handling duplicate values correctly
---

## Introduction

Here is a question that looks harmless: for each day in a list of temperatures, how many days until a warmer one? Or: for each bar in a bar chart, how far can it stretch left and right before hitting a shorter bar? Or: for each element of an array, what is the first larger element to its right?

All three ask, for *every* position, about the **nearest element on one side that is larger (or smaller)**. The direct way is to walk outward from each position until you find it — and on unlucky inputs that walk is long for every position, giving O(n²) time. With 100,000 elements, that is about five billion comparisons.

A **monotonic stack** answers all of these questions for every position in a single O(n) pass. It is an ordinary [[a5-stack]] with one discipline: its contents are always sorted (increasing or decreasing from bottom to top), and before pushing a new element you pop everything the new element makes irrelevant. The elements popped are exactly the ones whose answer has just been found.

The pattern is one of the highest-value ideas in interview problem solving because it hides behind many different problem statements — stock spans, histograms, rainwater, removing digits, sums over all subarrays. This lesson teaches the invariant, the direction rules and the complexity argument, then applies them to four problems of increasing difficulty. The narrower family of "next greater / previous smaller" lookups, including circular arrays, is covered in depth in [[a5-next-greater-smaller]].

## Before you start

- **Stacks** — push, pop, peek, and why `ArrayDeque` is the Java choice. See [[a5-stack]].
- **Amortised analysis** — counting total work across a whole run instead of per iteration. See [[a1-time-complexity]].
- **Arrays and indices** — the lesson stores indices on the stack and reads values through them. See [[a2-array-string-traversal]].

## The intuition

Imagine people standing in a line, facing right, each wanting to know who is the first taller person ahead of them. You walk along the line from left to right holding a notepad of people who are *still waiting* for an answer.

When you reach a new person, look at the most recent waiting person on your notepad. If the new person is taller, the waiting person has their answer — it is the new person, because nobody between them was taller (otherwise they would already have been answered). Cross them off and look at the next most recent waiting person. Keep crossing off while the new person is taller. Then add the new person to the notepad, since they are now waiting too.

Two facts make this work:

1. **The notepad is always sorted.** Every waiting person is no taller than the one written before them — if someone taller had come later, they would have answered the earlier one and removed them. So the heights on the notepad decrease from oldest to newest.
2. **A crossed-off person is never needed again.** Their own question is answered, and they cannot be the answer for anyone else: everyone still on the notepad is at least as tall as them (fact 1), so they are not "taller" for any of those people, and everyone you have not reached yet is looking further right, past them.

The notepad is a stack (newest on top), and fact 1 is the **monotonic invariant**. That is the whole pattern.

## The template

Here is the scan for "next greater element to the right", printing the stack after each step so you can watch the invariant hold:

```java title="MonoTrace.java"
import java.util.*;

public class MonoTrace {
    public static void main(String[] args) {
        int[] a = {2, 1, 2, 4, 3};
        int[] next = new int[a.length];
        Arrays.fill(next, -1);                      // -1 = no greater element to the right
        Deque<Integer> st = new ArrayDeque<>();     // indices; values decrease from bottom to top
        for (int i = 0; i < a.length; i++) {
            while (!st.isEmpty() && a[i] > a[st.peek()]) {
                next[st.pop()] = a[i];              // a[i] is the first greater value to the right
            }
            st.push(i);
            System.out.println("i=" + i + " stack(top first)=" + st);
        }
        System.out.println(Arrays.toString(next));
    }
}
```

```output
i=0 stack(top first)=[0]
i=1 stack(top first)=[1, 0]
i=2 stack(top first)=[2, 0]
i=3 stack(top first)=[3]
i=4 stack(top first)=[4, 3]
[4, 2, 4, -1, -1]
```

Read the steps. At `i = 2` (value 2), index 1 (value 1) is popped — its next greater is 2 — but index 0 (value 2) is not, because 2 is not *greater* than 2. At `i = 3` (value 4), both remaining indices are popped and answered with 4. At the end, indices 3 and 4 are still on the stack: nothing greater ever came, so their answers stay `-1`. Printing goes top first, so `[4, 3]` means values 3 on top of 4 — decreasing from bottom to top, as promised.

Every monotonic stack algorithm has these parts:

1. **Store indices**, not values, so you can compute distances and widths. The value is always `a[index]`.
2. **A `while` loop that pops** while the current element "beats" the top. What "beats" means sets the direction.
3. **Record answers at the right moment.** There are two moments, and many problems use both:
   - When index `j` is **popped** by `i`, then `i` is `j`'s *next* element that beats it.
   - After the popping stops, the index now on top (if any) is `i`'s *previous* element that `i` does not beat.
4. **Push the current index.**
5. **Handle leftovers.** Indices still on the stack at the end have no answer on the right; either assign a default or push a **sentinel** value that pops everything.

## Choosing the direction

The phrase "increasing stack" is used inconsistently across books and websites, so describe your stack by what it holds: in this lesson, **"decreasing" means values decrease from bottom to top**. Then the rule is easy to derive from the intuition: to find the next *greater* element, the elements still waiting must be the ones no greater element has reached yet, so they form a decreasing stack. To find the next *smaller*, they form an increasing stack.

| Question (for each `i`) | Pop while | Stack, bottom → top | Answer read |
|---|---|---|---|
| Next greater to the right | `a[top] < a[i]` | Decreasing (non-strict) | For the popped index |
| Next smaller to the right | `a[top] > a[i]` | Increasing (non-strict) | For the popped index |
| Previous greater to the left | `a[top] <= a[i]` | Strictly decreasing | Top after popping, for `i` |
| Previous smaller to the left | `a[top] >= a[i]` | Strictly increasing | Top after popping, for `i` |

**Strict versus non-strict comparison** decides what happens with equal values, and it is the most common source of subtle bugs. Popping on `<` keeps equal values on the stack, so an equal element does not count as "greater". Popping on `<=` removes equal values, so the element left on top is strictly greater. Before writing the comparison, ask: *should an equal value count as an answer?* For "next warmer day", a day of equal temperature is not warmer, so pop only on strictly greater. You will see a problem below where the two sides must deliberately use *different* strictness.

You can also scan **right to left**. Then the "previous" answers are on the right: the top after popping is the nearest element to the right that survives. Both directions give O(n); choose whichever makes the answer read off naturally.

## Why it is O(n)

The `while` loop inside the `for` loop looks like O(n²). It is not, and you should be able to explain why in one sentence: **each index is pushed exactly once and popped at most once, so the total number of pops over the whole run is at most `n`.** The inner loop's body runs once per pop, so across all iterations of the outer loop it runs at most `n` times in total. Adding the `n` pushes and the `n` failed loop checks (one per outer iteration), the total work is at most about `3n`, which is O(n).

A single iteration can still be expensive — at `i = 3` above, two pops happened — but expensive iterations "use up" pops that cheaper iterations earned by pushing. This is the same amortised argument as for a dynamic array.

**Space** is O(n) in the worst case: a strictly decreasing input like `[5, 4, 3, 2, 1]` never pops in a next-greater scan, so every index ends up on the stack.

> [!IMPORTANT] The invariant is what makes popping safe
> Popping is only correct because a popped element can never be an answer for anyone still on the stack or anyone to the right. Before you trust a monotonic stack solution, say *why* the popped element is useless from now on. If you cannot, the stack may be discarding answers.

## Worked example: Largest Rectangle in Histogram

**Problem.** Given bar heights, such as `[2, 1, 5, 6, 2, 3]`, find the area of the largest rectangle that fits inside the histogram. Every bar has width 1.

**Naive approach.** Try every pair `(left, right)` and use the shortest bar between them as the height: O(n²) pairs, O(n³) if the minimum is recomputed each time, O(n²) with a running minimum. Too slow for 10⁵ bars.

**Deriving the better idea.** The best rectangle must have *some* bar as its shortest bar — otherwise you could raise it. So for each bar `k`, ask: what is the widest rectangle in which bar `k` is the shortest? It stretches left until the first bar shorter than `h[k]` and right until the first bar shorter than `h[k]`. If those are at indices `L` and `R`, the width is `R - L - 1` and the area is `h[k] × (R - L - 1)`. So the problem reduces to finding, for every bar, its **previous smaller** and **next smaller** — exactly what an increasing stack provides.

Better still, one scan gives both. When bar `i` pops bar `top` (because `h[i] < h[top]`), `i` is `top`'s next smaller. And the element beneath `top` in an increasing stack is `top`'s previous smaller. So the area for `top` can be computed at the moment it is popped.

```java title="Histogram.java"
import java.util.ArrayDeque;
import java.util.Deque;

public class Histogram {
    static int largestRectangle(int[] h) {
        int n = h.length, best = 0;
        Deque<Integer> st = new ArrayDeque<>();     // indices; heights increase bottom to top
        for (int i = 0; i <= n; i++) {
            int cur = (i == n) ? 0 : h[i];          // height-0 sentinel flushes the stack at the end
            while (!st.isEmpty() && cur < h[st.peek()]) {
                int top = st.pop();                 // h[top] can extend no further right than i - 1
                int left = st.isEmpty() ? -1 : st.peek();   // first shorter bar on the left
                int width = i - left - 1;
                best = Math.max(best, h[top] * width);
            }
            st.push(i);
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(largestRectangle(new int[] {2, 1, 5, 6, 2, 3}));
        System.out.println(largestRectangle(new int[] {2, 4}));
        System.out.println(largestRectangle(new int[] {3, 3, 3}));
        System.out.println(largestRectangle(new int[] {}));
    }
}
```

```output
10
4
9
0
```

**Dry run** on `[2, 1, 5, 6, 2, 3]` (stack shown bottom → top as indices):

| `i` | `cur` | Pops (index, height → width, area) | Stack after | Best |
|---|---|---|---|---|
| 0 | 2 | — | `[0]` | 0 |
| 1 | 1 | 0 (h 2) → width 1, area 2 | `[1]` | 2 |
| 2 | 5 | — | `[1, 2]` | 2 |
| 3 | 6 | — | `[1, 2, 3]` | 2 |
| 4 | 2 | 3 (h 6) → width 1, area 6; 2 (h 5) → width 2, area 10 | `[1, 4]` | 10 |
| 5 | 3 | — | `[1, 4, 5]` | 10 |
| 6 | 0 (sentinel) | 5 (h 3) → 1, 3; 4 (h 2) → 4, 8; 1 (h 1) → 6, 6 | `[6]` | 10 |

The answer, 10, is the rectangle of height 5 spanning bars 2 and 3. Look at the pop of index 4 at the end: its left boundary is index 1 (the bar of height 1 beneath it) and its right boundary is the sentinel at 6, so it spans indices 2 to 5, width 4.

Three details deserve attention:

- **The sentinel.** Looping to `i == n` with height 0 forces every remaining bar to be popped and measured. Without it, bars that never meet a shorter bar to their right — like index 1 here — would never be considered, and inputs such as `[1, 2, 3]` would return 0.
- **Empty stack means no shorter bar on the left.** Then the rectangle reaches index 0, which the formula expresses by using `left = -1`.
- **Equal heights.** The loop pops only on strictly shorter, so equal bars stay on the stack together. For `[3, 3, 3]` the first two pops compute widths that are too small (1 and 2), but the last equal bar popped computes the full width 3. One bar of each equal run always gets the correct width, which is all the maximum needs.

Time is O(n) by the push-once, pop-once argument; space is O(n). The follow-up *Maximal Rectangle* in a binary matrix builds a histogram of consecutive 1s for each row and runs this function once per row, giving O(rows × cols).

## Worked example: Remove K Digits

**Problem.** Given a number as a string and an integer `k`, remove `k` digits so the remaining number is as small as possible. `"1432219"` with `k = 3` gives `"1219"`.

**Deriving the greedy rule.** Numbers are compared from the most significant digit. So the leftmost digit matters most: if a digit is followed by a smaller digit, deleting the larger one makes the number smaller, because the smaller digit moves into a more significant position. Scanning left to right, whenever the new digit is smaller than the last digit kept, the last kept digit should go — as long as removals remain. That is a monotonic stack keeping digits **increasing** (non-strictly) from bottom to top.

```java title="RemoveKDigits.java"
public class RemoveKDigits {
    static String removeKdigits(String num, int k) {
        StringBuilder st = new StringBuilder();     // used as a stack of digits; top = last char
        for (char c : num.toCharArray()) {
            // a larger digit before a smaller one makes the number bigger: drop it while we may
            while (k > 0 && st.length() > 0 && st.charAt(st.length() - 1) > c) {
                st.deleteCharAt(st.length() - 1);
                k--;
            }
            st.append(c);
        }
        st.setLength(st.length() - k);              // still owe removals: drop from the end
        int start = 0;
        while (start < st.length() - 1 && st.charAt(start) == '0') start++;  // strip leading zeros
        String result = st.substring(start);
        return result.isEmpty() ? "0" : result;
    }

    public static void main(String[] args) {
        System.out.println(removeKdigits("1432219", 3));
        System.out.println(removeKdigits("10200", 1));
        System.out.println(removeKdigits("10", 2));
        System.out.println(removeKdigits("12345", 2));
    }
}
```

```output
1219
200
0
123
```

Trace `"1432219"`, `k = 3`: keep `1`; keep `4`; `3` pops `4` (k = 2); `2` pops `3` (k = 1); next `2` is not smaller than `2`, keep; `1` pops `2` (k = 0); `9` is kept. The stack holds `1219`.

A `StringBuilder` works well as a character stack: `append` pushes, `deleteCharAt(length - 1)` pops, and the final string is already in order. The edge cases are the interview traps. If the digits are already increasing (`"12345"`), nothing is popped during the scan, so the remaining `k` removals come off the end, where the largest digits are. Leading zeros must be stripped (`"10200"` becomes `"0200"`, which is `"200"`), and an empty result means `"0"`. Each digit is pushed and popped at most once: O(n) time and space.

## Worked example: Sum of Subarray Minimums

**Problem.** Return the sum of `min(sub)` over every contiguous subarray. For `[3, 1, 2, 4]` the subarrays' minimums sum to 17. (The original problem asks for the result modulo 10⁹ + 7; it is omitted here so the arithmetic is visible.)

**Naive approach.** Enumerate all O(n²) subarrays with a running minimum: O(n²). Fine for 1,000 elements, too slow for 30,000.

**Change the question: contribution.** Instead of asking "what is each subarray's minimum?", ask "for how many subarrays is `a[i]` the minimum?" If `a[i]` is the minimum of exactly `c[i]` subarrays, the answer is the sum of `a[i] × c[i]`. A subarray has `a[i]` as its minimum when it contains `i` and does not stretch past the nearest smaller element on either side. If `L` is the previous smaller index and `R` the next smaller index, there are `i - L` choices of start and `R - i` choices of end, so `c[i] = (i - L) × (R - i)`.

**The duplicate trap.** With equal values, which one is "the minimum"? In `[2, 2]`, the subarray `[2, 2]` has minimum 2, and it must be counted *once*. If both sides use strictly-smaller boundaries, each `2` claims that subarray and the sum becomes 8 instead of 6. The fix is to break ties asymmetrically: use **previous strictly smaller** on the left and **next smaller-or-equal** on the right. Then among equal minimums, a subarray is credited to the rightmost one only.

```java title="SubarrayMins.java"
import java.util.ArrayDeque;
import java.util.Deque;

public class SubarrayMins {
    /** Sum of min(sub) over all contiguous subarrays (no modulus, for clarity). */
    static long sumOfMins(int[] a) {
        int n = a.length;
        int[] left = new int[n];   // index of previous element  < a[i], or -1
        int[] right = new int[n];  // index of next element     <= a[i], or n
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!st.isEmpty() && a[st.peek()] >= a[i]) st.pop();
            left[i] = st.isEmpty() ? -1 : st.peek();
            st.push(i);
        }
        st.clear();
        for (int i = n - 1; i >= 0; i--) {
            while (!st.isEmpty() && a[st.peek()] > a[i]) st.pop();
            right[i] = st.isEmpty() ? n : st.peek();
            st.push(i);
        }
        long total = 0;
        for (int i = 0; i < n; i++) {
            // a[i] is the minimum of every subarray that starts in (left, i] and ends in [i, right)
            total += (long) a[i] * (i - left[i]) * (right[i] - i);
        }
        return total;
    }

    static long brute(int[] a) {
        long t = 0;
        for (int i = 0; i < a.length; i++) {
            int m = Integer.MAX_VALUE;
            for (int j = i; j < a.length; j++) { m = Math.min(m, a[j]); t += m; }
        }
        return t;
    }

    public static void main(String[] args) {
        int[][] tests = {{3, 1, 2, 4}, {2, 2}, {11, 81, 94, 43, 3}};
        for (int[] t : tests) System.out.println(sumOfMins(t) + " " + brute(t));
    }
}
```

```output
17 17
6 6
444 444
```

The first scan pops on `>=`, so what remains on top is strictly smaller: the previous-strictly-smaller boundary. The second scan goes right to left and pops on `>`, so what remains is smaller-or-equal: the next-smaller-or-equal boundary. For `[3, 1, 2, 4]`, the `1` at index 1 has `L = -1` and `R = 4`, so it is the minimum of `2 × 3 = 6` subarrays and contributes 6. The brute-force column confirms each result. The `(long)` cast matters: the product of a value and two counts overflows `int` quickly.

This **contribution technique** — "count how many ranges each element is the answer for, using nearest smaller or greater boundaries" — also solves *Sum of Subarray Ranges* (do it for maximums too and subtract) and appears in harder counting problems.

```quiz
Q: You need, for each index, the next element to the right that is strictly greater. Which loop is correct?
- [ ] Pop while a[i] < a[top]; stack values increase bottom to top
- [x] Pop while a[i] > a[top]; stack values decrease bottom to top
- [ ] Pop while a[i] >= a[top]; stack values increase bottom to top
- [ ] Never pop; read the answer from the bottom of the stack
> The indices still waiting for a greater element are those no greater element has reached, so they decrease from bottom to top. When a[i] is strictly greater than the top, the top's answer is a[i]. Popping on >= would also answer equal values, which a "strictly greater" question excludes.

Q: A monotonic stack scan has a while loop inside a for loop. Why is it O(n)?
- [ ] The while loop runs at most once per iteration
- [ ] The stack never holds more than log n elements
- [x] Each index is pushed once and popped at most once, so the while loop body runs at most n times in total
- [ ] Java's ArrayDeque makes popping free
> One iteration can pop many elements, but each pop removes an index that was pushed earlier, and no index is pushed twice. Summing over the whole run, pops are at most n, so total work is linear.

Q: In Sum of Subarray Minimums, what goes wrong if both boundaries use "strictly smaller"?
- [ ] Nothing; the result is the same
- [ ] Single-element subarrays are skipped
- [x] Subarrays with several equal minimums are counted once for each of them, so the sum is too large
- [ ] The algorithm becomes O(n^2)
> In [2, 2], both 2s would claim the subarray [2, 2], giving 8 instead of 6. Using strictly smaller on one side and smaller-or-equal on the other assigns each subarray to exactly one of its equal minimums.
```

## In real systems

Monotonic stacks are an algorithmic technique rather than a library feature, but the problems they solve appear in practice:

- **Financial "span" indicators.** The stock span — how many consecutive days the price has been at or below today's — is computed online with a monotonic stack as each price arrives. See [[a5-next-greater-smaller]].
- **Layout and image processing.** Finding the largest empty rectangle in a grid, such as free space on a canvas or in a binary image, uses the histogram-per-row method above.
- **Building skylines and visibility.** "Which buildings can see the ocean?" or "how many people can each person see in a queue?" are previous-greater questions.
- **Compilers and parsers.** Operator-precedence parsing keeps a stack of operators whose precedence increases toward the top, popping operators of higher or equal precedence when a new one arrives — the same pop-while-dominated discipline. See [[a5-expression]].

## Trade-offs and alternatives

| Approach | Time | When it fits |
|---|---|---|
| Brute force scan outward | O(n²) | Tiny inputs, or a one-off check |
| Monotonic stack | O(n), O(n) space | Static array, nearest greater/smaller for every index |
| Monotonic deque | O(n) | The window moves and old elements expire — see [[a5-monotonic-queue]] |
| Sparse table or segment tree | O(n log n) build | Arbitrary range-minimum queries, or values that change — see [[a12-sparse-tables]] and [[a12-segment-trees]] |
| Two pointers | O(n), O(1) space | Some problems such as Trapping Rain Water have a two-pointer solution that saves the stack's memory |

The monotonic stack shines when the answers for all positions are needed and the array does not change. It is a poor fit when queries are arbitrary ranges chosen later, or when elements are updated.

## Common mistakes

> [!MISTAKE] Getting the direction backwards
> "Next greater" needs a stack that *decreases* from bottom to top, which surprises people who expect the word "greater" to mean an increasing stack. Derive it instead of memorising: the stack holds elements still waiting for something greater, so none of them can be greater than the ones below.

**Storing values instead of indices.** Widths and distances need positions. With values alone you cannot compute `i - j`, and with duplicates you cannot tell elements apart.

**Forgetting the leftovers.** After the scan, indices on the stack have no answer to the right. Either initialise answers to a default (`-1`, `0`, or `n`) or append a sentinel that pops them, as the histogram does.

**Wrong strictness with duplicates.** Decide whether equal values count as an answer. For counting problems, use strict on one side and non-strict on the other.

**Calling `peek` on an empty stack inside the comparison.** Always test `!st.isEmpty()` first in the `while` condition; `ArrayDeque.peek()` returns `null` on empty, and unboxing it into an `int` index throws `NullPointerException`.

**Integer overflow in products.** Areas and contribution counts multiply several numbers; use `long`.

## Interview perspective

Interviewers love this pattern because the brute force is obvious and the jump to O(n) requires real insight. The signals they look for are a clear invariant and the amortised argument.

> [!INTERVIEW] A strong explanation
> "For each bar I need the first shorter bar on each side. I'll keep indices in a stack with increasing heights. When a shorter bar arrives it pops taller ones; the bar that pops one is its right boundary and the bar beneath it is its left boundary, so I compute the area right there. Each index is pushed and popped once, so it's O(n)."

Questions to be ready for:

- **Daily Temperatures** and **Next Greater Element I/II** — the basic next-greater scan; see [[a5-next-greater-smaller]].
- **Largest Rectangle in Histogram** and **Maximal Rectangle** — previous and next smaller in one pass.
- **Trapping Rain Water** — a decreasing stack; when a taller bar arrives, pop the bottom of the "basin" and add water bounded by the new top and the current bar. Also solvable with two pointers in O(1) space.
- **Remove K Digits** and **Remove Duplicate Letters** — greedy increasing stacks with extra conditions.
- **Sum of Subarray Minimums** — contribution counting with asymmetric ties.
- **Follow-up: how do you choose strict or non-strict?** Ask whether an equal element should count as the answer; for counting, break ties on one side only.

## Practice

1. **Daily Temperatures.** Return the number of days until a warmer temperature for each day.
2. **Trapping Rain Water** with a monotonic stack, then with two pointers.
3. **Maximal Rectangle.** Build row histograms of a binary matrix and reuse `largestRectangle`.
4. **Remove Duplicate Letters.** Smallest subsequence containing each letter once; a digit-removal stack plus "is this letter still available later?".
5. **Sum of Subarray Ranges.** Contribution technique for both maximums and minimums.
6. **132 Pattern.** Scan from the right with a decreasing stack, tracking the best "2" seen so far.

The DSA explorer lists the matching problems under this topic; start with *Daily Temperatures*, *Largest Rectangle in Histogram* and *Remove K Digits*.

## Quick revision {#quick-revision}

- Monotonic stack = stack kept sorted by popping elements the new one makes useless; store indices.
- Answers appear at two moments: the index that pops `j` is `j`'s *next* element that beats it; the top left after popping is `i`'s *previous* surviving element.
- Next greater → stack decreasing bottom to top, pop while `a[top] < a[i]`. Next smaller → increasing, pop while `a[top] > a[i]`.
- Previous greater/smaller → pop with `<=`/`>=`, then read the top.
- Strict versus non-strict decides ties; for counting problems use strict on one side only.
- O(n) time: each index pushed once, popped at most once. O(n) space worst case.
- Histogram: increasing stack plus height-0 sentinel; area = `h[top] × (i - newTop - 1)`.
- Remove K digits: increasing stack, pop while larger and `k > 0`, trim end, strip leading zeros.
- Subarray minimum sums: contribution `a[i] × (i - L) × (R - i)`.

## Key takeaways {#key-takeaways}

- A monotonic stack turns "nearest larger or smaller element for every index" from O(n²) into O(n) by discarding elements that can never be an answer again.
- Derive the direction from what the stack holds — elements still waiting for an answer — rather than memorising "increasing" or "decreasing".
- The O(n) bound comes from counting pushes and pops over the whole run, not per iteration.
- Many problems need both the previous and next boundary, and a single scan can deliver both at the moment of popping.
- Equal values are where solutions break; decide deliberately whether ties count, and break them on one side only when counting.
