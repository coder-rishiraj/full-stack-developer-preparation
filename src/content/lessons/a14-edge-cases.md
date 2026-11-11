---
summary: Most interview solutions that fail do so on an input the candidate never thought about — an empty array, a single node, a zero, a value at the edge of the integer range. You will learn a systematic way to generate those inputs, how to find the ones that threaten your specific code by reading its branches, and when in the interview to raise them.
difficulty: beginner
minutes: 40
objectives:
  - Generate edge cases for a new problem from four sources — size, values, structure and code boundaries
  - Explain the Java integer traps (overflow, Math.abs of Integer.MIN_VALUE, negative modulo) and write code that avoids them
  - Find the edge cases that threaten a specific implementation by reading its indexing, division and dereferences
  - Choose whether to handle an edge case with a guard clause or with a design that covers it naturally
  - Decide when to mention edge cases in an interview and how many to raise
---

## Introduction

Here is a pattern interviewers see constantly. A candidate understands the problem, finds a good algorithm, writes clean code and traces the example: it works. Then the interviewer asks, "What happens if the array is empty?" and the first line of the method reads `nums[0]`. Or, "What if the list has one node?" and the pointer loop dereferences `null`. The algorithm was right. The code was not, because it was only ever checked against typical input.

An **edge case** is an input that sits at a boundary of what the problem allows, or that drives the code down a path the typical input never takes. Empty input is at the boundary of size. A zero is at the boundary between positive and negative values, and it is where division breaks. Removing the *first* node of a linked list is at the boundary of position, and it is the one case where the node being removed has no predecessor. These inputs are not exotic. Real systems receive empty requests, single-item carts and zero balances every day, which is exactly why interviewers ask about them.

**Edge-case identification** is the skill of producing these inputs systematically rather than hoping to stumble on them. It has two halves. *Before* coding, you generate edge cases from the problem — its input space and its rules — so that your design accounts for them. *After* coding, you generate edge cases from the code itself — every index, division and pointer dereference is a place where some input can break it. This lesson teaches both, with worked interview walkthroughs, and shows how to talk about edges without letting them eat the interview.

## Before you start

- **Clarified requirements** — edge cases come from the spec: what sizes, values and orders are allowed. See [[a14-clarifying-requirements]].
- **Manual testing** — once you have an edge case, you trace the code on it by hand. That procedure is taught in [[a14-manual-testing]]; this lesson is about choosing *which* inputs to trace.
- **Java integer arithmetic** — `int` range and how overflow behaves. See [[a1-java-syntax-competitive]].
- **Linked lists and arrays** — the walkthroughs use [[a4-singly-linked-lists]] and [[a2-prefix-suffix]]; you can follow without having read them.

## The intuition

Think of a function's input space as a landscape. Typical inputs — the problem's example, a random medium-sized array — sit in the middle. Bugs live at the edges: where the size drops to zero or one, where values cross zero or approach the limits of `int`, where the order becomes perfectly sorted or perfectly reversed, where a structure degenerates (a tree that is a straight line, a graph with no edges).

Code is shaped by the typical inputs its author imagined. A loop that compares `a[i]` with `a[i + 1]` was written while picturing an array of several elements; nobody wrote it thinking about an array of length one. So the useful question is not "what inputs exist?" — there are infinitely many — but **"where does this input space have boundaries, and what does my code do at each one?"** A small number of boundary inputs exercise almost every branch the code has.

## Four sources of edge cases

You can generate the edge cases for nearly any problem by walking through four sources in turn. Each source is a different kind of boundary.

### 1. Size

The size of the input is the first and most productive source.

- **Empty**: `[]`, `""`, `null` root, a graph with no edges. Does the code read `a[0]` or `s.charAt(0)` before checking? Does it return a sensible value (0, an empty list, `-1`) rather than crash?
- **One element**: a single node, a one-character string. Many algorithms compare neighbours or keep two pointers; with one element there is no neighbour.
- **Two elements**: the smallest size where pairs exist. Swap logic, "previous and current" pointers and middle-finding are often wrong only here.
- **Maximum size**: at the upper constraint, does the algorithm finish in time ([[a1-time-complexity]]), and does recursion depth stay within the stack? A recursive Depth-First Search (DFS) on a tree shaped like a straight line of 10⁵ nodes can throw `StackOverflowError` in Java; the exact limit depends on the thread's stack size and frame size.

### 2. Values

The values inside the input are the second source.

- **Zero**: breaks division, makes products collapse, and is neither positive nor negative — sliding windows that rely on "adding always increases the sum" fail with zeros as well as negatives ([[a2-sliding-window]]).
- **Negative numbers**: break algorithms that assume sums grow, and break initialisations like `best = 0` (shown below).
- **Duplicates**: change which index is "the" answer, break strict comparisons (`<` versus `<=`), and collapse keys in a `HashMap` — two equal keys become one entry.
- **All values equal**: an extreme of duplicates. Partitioning, "strictly increasing" checks and binary search for first/last occurrence ([[a3-lower-upper-bounds]]) all behave differently.
- **Extremes of the range**: values near `Integer.MAX_VALUE` or `Integer.MIN_VALUE`, which lead to the overflow traps in the next section.

### 3. Structure and order

The arrangement of the input is the third source.

- **Already sorted / reverse sorted**: a naive quicksort pivot goes quadratic on sorted input ([[a3-quick-sort]]); monotonic-stack problems push everything or pop everything.
- **Degenerate shapes**: a tree where every node has only a left child is really a linked list, so its height is n rather than log n ([[a6-height-depth]]); a graph can be disconnected, so a single BFS from node 0 misses components ([[a8-connected-components]]); a linked list can contain a cycle ([[a4-cycle-detection]]).
- **Target position**: the answer is at the first index, the last index, or does not exist. Binary search and pointer problems break disproportionately at the two ends ([[a3-binary-search]]).
- **Touching boundaries**: intervals `[1,3]` and `[3,5]` — do they overlap? This is a specification question as much as an edge case ([[a2-intervals]]).

### 4. Code boundaries

The fourth source is your own code, and it only exists after you have written it. Every **index expression** (`i + 1`, `mid - 1`, `n - k`), every **division or modulo**, every **dereference** (`node.next.val`), every **pop or poll** from a stack or queue, and every **loop that might run zero times** is a boundary. For each one, ask: which input makes this index `-1` or `n`, this divisor zero, this reference `null`, this collection empty, this loop skip? That input is an edge case for *your* code, even if it would not be one for a different implementation.

Source 4 is where the strongest candidates separate themselves. Listing "empty, single, duplicates" from memory is useful but generic. Pointing at a line and saying "this `fast.next` is null when n equals the list length" shows you are reading your code like a reviewer.

## A checklist by data structure

The four sources are general. In practice, each data structure has a short list of edges that matter most. Use this as a starting point, not a script — pick the ones that touch your algorithm.

| Input type | Edge cases worth checking |
|---|---|
| Array | Empty; one element; two elements; all equal; sorted / reverse sorted; negatives and zeros; answer at index 0 or `n - 1`; no answer |
| String | Empty; one character; all the same character; whole string is the answer; case and non-letter characters if allowed |
| Linked list | Empty (`head == null`); one node; two nodes; operation on the head; operation on the tail; cycle (if possible) |
| Binary tree | `null` root; single node; skewed to one side (height n); negative node values; duplicate values in a BST |
| Graph | No edges; disconnected components; self-loop; parallel edges; cycle; start equals target |
| Intervals | Empty; one interval; touching endpoints; one interval containing another; unsorted input |
| Matrix | 0 rows; 0 columns; one row; one column; non-square ([[a2-matrix]]) |
| Numbers | 0; 1; negative; `Integer.MAX_VALUE` / `MIN_VALUE`; results that overflow `int` |

## Integer traps in Java

Integer edge cases deserve their own section, because Java does not warn you about them. `int` arithmetic **wraps around silently** on overflow: no exception, only a wrong number. The following program shows the traps interviewers ask about most.

```java title="EdgeTraps.java"
public class EdgeTraps {
    public static void main(String[] args) {
        System.out.println(Math.abs(Integer.MIN_VALUE));      // still negative
        System.out.println(-Integer.MIN_VALUE);               // negation overflows too
        System.out.println(Integer.MAX_VALUE + 1);            // wraps silently
        int a = 2_000_000_000, b = 2_000_000_000;
        System.out.println(a + b);                            // int overflow
        System.out.println((long) a + b);                     // widen before adding
        System.out.println(-7 % 3);                           // sign follows the dividend
        System.out.println(Math.floorMod(-7, 3));             // always in [0, 3)
        System.out.println(7 / 2 + " " + (-7 / 2));           // truncates toward zero
    }
}
```

```output
-2147483648
-2147483648
-2147483648
-294967296
4000000000
-1
2
3 -3
```

Each line is a bug waiting to happen:

- **`Math.abs(Integer.MIN_VALUE)` is negative.** The `int` range is −2,147,483,648 to 2,147,483,647 — there is one more negative value than positive, so the absolute value of the smallest `int` does not exist as an `int`, and the result wraps back to itself. Code that does `Math.abs(x)` and then uses the result as a non-negative index or hash bucket breaks on exactly this input.
- **Sums overflow.** Two values of 2 × 10⁹ are each valid `int`s, but their sum is not. The fix is to widen *before* the operation: `(long) a + b` converts `a` to `long`, so the addition happens in 64 bits. `(long) (a + b)` is wrong — the overflow has already happened inside the parentheses.
- **`%` can be negative.** In Java the remainder takes the sign of the dividend, so `-7 % 3` is `-1`, not `2`. Code that indexes a circular buffer with `i % n` breaks when `i` is negative. `Math.floorMod` always returns a value in `[0, n)` for positive `n`.
- **Division truncates toward zero.** `-7 / 2` is `-3`, not `-4`. This matters for midpoint calculations on negative ranges and for "ceiling division" tricks.

When values can be large, ask about the range during clarification ([[a14-clarifying-requirements]]), and use `long` for sums, products and accumulated counts. The midpoint overflow in binary search, `(low + high) / 2`, is the same trap in a different place — see [[a3-binary-search]].

## Worked walkthrough 1: Remove Nth Node From End of List

The prompt: *"Given the head of a linked list, remove the n-th node from the end and return the head."* Clarification established that the list has at least one node and that `1 ≤ n ≤ length`.

**Edges from the problem (before coding).** Size: one node. Position: `n = 1` removes the tail; `n = length` removes the head. The candidate says these out loud:

> "Edge cases I'll check: a single node, removing the tail with n = 1, and removing the head when n equals the length. The head case worries me most, because the head has no node before it."

The approach is the classic gap technique ([[a4-fast-slow-pointers]]): move `fast` n steps ahead, then move both pointers until `fast` reaches the end, so `slow` stops just before the node to remove. Here is the first draft and the fixed version in one program, run on the example and on the edges.

```java title="RemoveNthFromEnd.java"
public class RemoveNthFromEnd {

    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
    }

    // First draft: correct on the example, but assumes the removed node has a predecessor.
    static ListNode removeNthDraft(ListNode head, int n) {
        ListNode fast = head, slow = head;
        for (int i = 0; i < n; i++) fast = fast.next;
        while (fast.next != null) {          // crashes when fast is already null
            fast = fast.next;
            slow = slow.next;
        }
        slow.next = slow.next.next;
        return head;
    }

    // Fixed: a dummy node gives the head a predecessor, so "remove the head" is not special.
    static ListNode removeNth(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head);
        ListNode fast = dummy, slow = dummy;
        for (int i = 0; i <= n; i++) fast = fast.next;   // gap of n + 1 nodes
        while (fast != null) {
            fast = fast.next;
            slow = slow.next;
        }
        slow.next = slow.next.next;          // slow is the node before the one to remove
        return dummy.next;
    }

    static ListNode build(int... values) {
        ListNode head = null;
        for (int i = values.length - 1; i >= 0; i--) head = new ListNode(values[i], head);
        return head;
    }

    static String show(ListNode head) {
        StringBuilder sb = new StringBuilder("[");
        for (ListNode p = head; p != null; p = p.next) {
            sb.append(p.val);
            if (p.next != null) sb.append(", ");
        }
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        int[][] lists = {{1, 2, 3, 4, 5}, {1, 2, 3, 4, 5}, {1, 2, 3, 4, 5}, {1}, {1, 2}};
        int[] ns = {2, 1, 5, 1, 2};
        String[] labels = {"example", "remove tail", "remove head", "single node", "two, head"};
        for (int t = 0; t < lists.length; t++) {
            String draft;
            try {
                draft = show(removeNthDraft(build(lists[t]), ns[t]));
            } catch (NullPointerException e) {
                draft = "NullPointerException";
            }
            String fixed = show(removeNth(build(lists[t]), ns[t]));
            System.out.printf("%-12s n=%d  draft=%-22s fixed=%s%n", labels[t], ns[t], draft, fixed);
        }
    }
}
```

```output
example      n=2  draft=[1, 2, 3, 5]           fixed=[1, 2, 3, 5]
remove tail  n=1  draft=[1, 2, 3, 4]           fixed=[1, 2, 3, 4]
remove head  n=5  draft=NullPointerException   fixed=[2, 3, 4, 5]
single node  n=1  draft=NullPointerException   fixed=[]
two, head    n=2  draft=NullPointerException   fixed=[2]
```

**Edges from the code (after the draft).** The draft passes the example and the tail case, which is exactly why it is dangerous: a candidate who only traces the example declares it done. Now apply source 4 and read the draft line by line for dereferences. `fast.next` in the `while` condition requires `fast` to be non-null. After the first loop, `fast` has moved n steps from the head; when n equals the length, it has walked off the end and is `null`. So every "remove the head" input crashes — including the single-node list, where `n = 1` *is* the length. The edge you named before coding and the dereference you found after coding point at the same bug.

The fix is not a special case (`if (n == length) return head.next;`, which would require counting the length first). It is a **sentinel**: a `dummy` node placed before the head. Now every real node, including the head, has a predecessor, so the code that removes "the node after `slow`" works uniformly. Starting both pointers at `dummy` and opening a gap of `n + 1` makes `slow` stop at the predecessor when `fast` becomes `null`. The three edge cases that crashed the draft all pass, with no extra branches.

This illustrates a general principle: **prefer designs that make the edge case ordinary over guard clauses that patch it.** Guard clauses are fine for genuinely separate behaviour (an empty input that must return an empty result), but when the same operation fails only at a boundary, a sentinel, a padded array or a different loop bound usually removes the boundary instead.

## Worked walkthrough 2: Product of Array Except Self

The prompt: *"Return an array where `answer[i]` is the product of every element except `nums[i]`."* Clarification: values can be negative or zero, `n ≥ 2`, and the products fit in an `int`.

The first idea that comes to most people is to multiply everything once and divide by each element. The candidate states it, then runs the value checklist *before* coding:

> "Total product divided by `nums[i]` is O(n). But the values can be zero. If there's one zero, the total is zero and I'd divide zero by zero at that position. And with two zeros every answer is zero. Division needs special cases for zero, so I'd rather avoid division entirely."

Here the edge case changed the algorithm, which is the most valuable thing an edge case can do. Both versions are shown so you can see the failure for real:

```java title="ProductExceptSelf.java"
import java.util.Arrays;

public class ProductExceptSelf {

    // First idea: multiply everything, then divide out each element.
    static int[] byDivision(int[] nums) {
        int total = 1;
        for (int x : nums) total *= x;
        int[] out = new int[nums.length];
        for (int i = 0; i < nums.length; i++) out[i] = total / nums[i];
        return out;
    }

    // Prefix and suffix products: no division, so zeros need no special case.
    static int[] byPrefixSuffix(int[] nums) {
        int n = nums.length;
        int[] out = new int[n];
        int prefix = 1;                       // product of nums[0..i-1]
        for (int i = 0; i < n; i++) {
            out[i] = prefix;
            prefix *= nums[i];
        }
        int suffix = 1;                       // product of nums[i+1..n-1]
        for (int i = n - 1; i >= 0; i--) {
            out[i] *= suffix;
            suffix *= nums[i];
        }
        return out;
    }

    public static void main(String[] args) {
        int[][] tests = {{1, 2, 3, 4}, {1, 2, 0, 4}, {0, 2, 0, 4}, {-1, 1}, {5, 7}};
        for (int[] t : tests) {
            String division;
            try {
                division = Arrays.toString(byDivision(t));
            } catch (ArithmeticException e) {
                division = "ArithmeticException: " + e.getMessage();
            }
            System.out.printf("%-14s division=%-34s prefix/suffix=%s%n",
                    Arrays.toString(t), division, Arrays.toString(byPrefixSuffix(t)));
        }
    }
}
```

```output
[1, 2, 3, 4]   division=[24, 12, 8, 6]                     prefix/suffix=[24, 12, 8, 6]
[1, 2, 0, 4]   division=ArithmeticException: / by zero     prefix/suffix=[0, 0, 8, 0]
[0, 2, 0, 4]   division=ArithmeticException: / by zero     prefix/suffix=[0, 0, 0, 0]
[-1, 1]        division=[1, -1]                            prefix/suffix=[1, -1]
[5, 7]         division=[7, 5]                             prefix/suffix=[7, 5]
```

The test list was chosen from the checklist, not at random: the example; exactly one zero; two zeros; a negative value; and the minimum size `n = 2`. Integer division by zero in Java throws `ArithmeticException` (floating-point division would instead produce `NaN` or infinity), so the division version crashes on both zero cases. The prefix/suffix version ([[a2-prefix-suffix]]) computes, for each index, the product of everything to its left and everything to its right, and multiplies them. A zero becomes part of some prefixes and suffixes; no branch treats it specially. It is still O(n) time and, because the output array doubles as the prefix storage, O(1) extra space beyond the output.

## Worked walkthrough 3: when the initial value is the edge

Some edge cases hide in a single initialisation. Maximum Subarray Sum ([[a2-kadane]]) asks for the largest sum of a non-empty contiguous subarray. A common draft starts `best` at `0`:

```java title="KadaneInit.java"
public class KadaneInit {

    static int maxSubarrayDraft(int[] nums) {
        int best = 0, current = 0;                 // 0 assumes some subarray is non-negative
        for (int x : nums) {
            current = Math.max(x, current + x);
            best = Math.max(best, current);
        }
        return best;
    }

    static int maxSubarray(int[] nums) {
        int best = nums[0], current = nums[0];     // start from a real subarray
        for (int i = 1; i < nums.length; i++) {
            current = Math.max(nums[i], current + nums[i]);
            best = Math.max(best, current);
        }
        return best;
    }

    public static void main(String[] args) {
        int[] mixed = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
        int[] allNegative = {-3, -1, -2};
        System.out.println(maxSubarrayDraft(mixed) + " " + maxSubarray(mixed));
        System.out.println(maxSubarrayDraft(allNegative) + " " + maxSubarray(allNegative));
    }
}
```

```output
6 6
0 -1
```

On the usual example both agree. On an all-negative array, the draft returns `0` — the sum of the *empty* subarray, which the problem does not allow. The correct answer is `-1`, the single largest element. The general lesson: **an initial value of 0, `Integer.MAX_VALUE` or an empty result is a claim about the input.** Ask whether every input satisfies that claim. Starting from the first real candidate (`nums[0]`), or from `Integer.MIN_VALUE` when combined carefully, removes the assumption. The same bug appears in tree path sums where all node values are negative ([[a6-path-problems]]).

## When and how to raise edge cases in the interview

Edge cases come up at three moments, and each has a different purpose.

1. **While clarifying.** Raise the edges that change the *specification*: "Can the array be empty, and what should I return then?" "Do touching intervals merge?" You are not testing yet; you are making sure you and the interviewer agree on the output for boundary inputs. This belongs to [[a14-clarifying-requirements]].
2. **Before coding.** Raise the edges that change the *design*: "Values can be zero, so I'll avoid division." "The tree can be a straight line of 10⁵ nodes, so I'll use an iterative traversal to avoid stack overflow." One sentence each.
3. **After coding.** Trace one or two edges through the code — the ones most likely to break *this* implementation, found by reading its branches. Fix what you find, out loud. The tracing technique is in [[a14-manual-testing]].

**How many?** Name three to five relevant edges, not fifteen. Reciting every item on the checklist sounds rehearsed and uses minutes you need for code. Prioritise by likelihood of breaking your code: an index expression near the array's end makes "answer at the last index" high priority; a problem without division makes "zero" low priority unless something else depends on sign.

**Handled by design versus by guard.** When you write code, say how each named edge is handled. "Empty input returns `-1` because `high` starts at `-1` and the loop doesn't run" is a stronger statement than adding `if (n == 0) return -1;` reflexively — but a short guard at the top is perfectly acceptable when it makes the behaviour clearer to a reader. Clean placement of guards is covered in [[a14-clean-coding]].

> [!TIP] Write them down
> Put your edge cases as a one-line comment at the top of the editor while clarifying: `// edges: empty, one node, n == length (remove head)`. After coding, walk the list. It costs ten seconds and stops you from forgetting the case you were worried about twenty minutes earlier.

## Common mistakes

> [!MISTAKE] Testing only the given example
> The example is chosen to illustrate the problem, not to break your code. It almost never contains an empty input, a zero, a duplicate at a boundary or an answer at index 0. A solution that passes the example has passed one test. Always add at least one edge from the size source and one from the values source.

**Listing edges and then never using them.** Saying "empty and single element" at minute three and then writing `nums[0]` on line one is worse than not mentioning them, because it shows you knew and did not check. Return to your list after coding.

**Patching instead of redesigning.** Adding `if (n == 1)`, `if (head.next == null)`, `if (k == n)` one by one as each case fails produces fragile code. If three special cases cluster around one boundary, look for a sentinel, a different loop bound or a different decomposition that removes the boundary.

**Ignoring overflow because the example is small.** The example uses values like 3 and 7; the constraints say up to 10⁹. Check the constraint, not the example, when deciding between `int` and `long`.

**Over-listing.** Spending five minutes enumerating floating-point edge cases for an integer problem, or Unicode cases when the input is lowercase letters, signals poor prioritisation. Edges should be relevant to the input space you clarified.

**Assuming `HashMap` keys stay distinct.** Inserting `map.put(value, index)` for an array with duplicates keeps only the last index for each value. If the problem needs the first index, or all indices, duplicates are an edge case for the data structure, not only for the algorithm.

## Interview perspective

Interviewers rate testing and edge-case handling as a separate dimension from problem solving. A candidate who finds and fixes their own boundary bug often scores *better* on that dimension than one whose code happened to be correct but who never checked it, because the interviewer has seen evidence of the habit.

> [!INTERVIEW] What a strong answer sounds like
> "Before I call this done, the edges I care about are the single-node list and n equal to the length, because that removes the head. Tracing n = 5 on the five-node list: after the first loop `fast` is null, so `fast.next` throws. I'll add a dummy node so the head has a predecessor — now `slow` starts at the dummy and ends just before the head."

Questions you should be prepared for:

- **"What edge cases would you test for this?"** Answer by source — size, values, structure — and then name the one that threatens your code specifically.
- **"What does your code do on an empty input?"** Trace it, do not guess. If it crashes, fix it; if it returns something, say whether that matches the spec you agreed on.
- **"What if the values were up to 10¹⁸?"** That exceeds `int` and nearly fills `long` (maximum about 9.2 × 10¹⁸), so sums of two such values can overflow even `long`; mention `Math.addExact` (which throws on overflow) or `BigInteger`.
- **"Why is `Math.abs(Integer.MIN_VALUE)` negative?"** Two's complement has one more negative value than positive, so the result does not fit and wraps.
- **"How would you test this more thoroughly with more time?"** Random small inputs compared against a brute-force oracle — see [[a14-brute-force-first]].

```quiz
Q: A candidate's first draft of "remove the n-th node from the end" passes the example and the remove-the-tail case, but throws NullPointerException when n equals the list length. What is the most robust fix?
- [ ] Wrap the method body in try/catch and return head.next on exception
- [ ] Count the list length first and special-case n == length
- [x] Start both pointers at a dummy node placed before the head, so the head has a predecessor
- [ ] Require callers never to pass n equal to the length
> The bug exists because the head is the only node with no predecessor. A dummy node makes every real node, including the head, have one, so the same removal line works for all positions with no extra branch. Counting the length works but adds a pass and a special case; catching the exception hides the bug instead of fixing it.

Q: Which Java expression correctly computes the sum of two int values a and b that may each be up to 2 × 10^9?
- [ ] (long) (a + b)
- [x] (long) a + b
- [ ] Math.abs(a + b)
- [ ] (a + b) % Integer.MAX_VALUE
> Casting a to long before the addition makes Java perform the addition in 64 bits. In (long) (a + b) the addition happens first in 32-bit int arithmetic, overflows, and only the already-wrong result is widened. Math.abs and modulo do not undo an overflow that has already occurred.

Q: Maximum Subarray Sum initialised with best = 0 returns 0 for the input [-3, -1, -2]. Which edge-case source would have caught this before coding?
- [ ] Size: the array is too small
- [x] Values: all values are negative, so no non-empty subarray has a non-negative sum
- [ ] Structure: the array is not sorted
- [ ] Code boundaries: an index goes out of range
> Initialising to 0 assumes some subarray sums to at least 0. When every value is negative, that assumption is false and the code reports the empty subarray's sum, which the problem forbids. Checking "all negative" from the values list exposes it; nothing here involves size, order or indexing.
```

## Practice

For each problem, list edge cases from each of the four sources (code boundaries after you write a draft), then pick the three most likely to break your solution and trace them.

1. **Valid Palindrome** (ignore non-alphanumeric characters): what about an empty string, a string with only punctuation, and mixed case? ([[a2-two-pointers]])
2. **Search Insert Position**: target smaller than every element, larger than every element, equal to a duplicate. ([[a3-lower-upper-bounds]])
3. **Merge Two Sorted Lists**: one list empty, both empty, all of one list smaller than all of the other. ([[a4-merge-lists]])
4. **Number of Islands**: an empty grid, a grid of all water, a grid of all land, a single row. ([[a8-connected-components]])
5. **Reverse Integer** with the rule "return 0 if the result overflows `int`": which inputs overflow? Is `Integer.MIN_VALUE` an input you must handle?
6. Take any solution you wrote recently and find every index expression, division and dereference. For each, write the input that makes it fail or explain why none can.

## Quick revision {#quick-revision}

- Edge case = input at a boundary of the input space, or one that takes a code path typical inputs do not.
- Four sources: **size** (empty, one, two, max), **values** (zero, negative, duplicates, all equal, extremes), **structure** (sorted, reversed, skewed, disconnected, cycle, answer at either end), **code boundaries** (indices, division, dereferences, empty pops, zero-iteration loops).
- Read your own code for boundaries after drafting; those edges are the ones most likely to break it.
- Java `int` overflow is silent. Widen before the operation: `(long) a + b`. `Math.abs(Integer.MIN_VALUE)` is negative. `-7 % 3 == -1`; use `Math.floorMod` for non-negative results.
- Initial values (`0`, `MAX_VALUE`, empty) are claims about the input; check them against all-negative or empty inputs.
- Prefer designs that remove a boundary (dummy node, prefix/suffix instead of division) over stacking guard clauses.
- Raise spec-changing edges while clarifying, design-changing edges before coding, and trace one or two code-threatening edges after coding.
- Name three to five relevant edges; do not recite a checklist.

## Key takeaways {#key-takeaways}

- Bugs cluster at boundaries — empty, single, zero, extremes, first and last positions — because code is written while picturing typical inputs.
- Generate edge cases systematically from size, values, structure and your own code's boundaries, rather than from memory alone.
- The strongest edge cases are the ones tied to a specific line of your code: an index that can go out of range, a divisor that can be zero, a reference that can be null.
- An edge case that changes the algorithm (zeros ruling out division) is worth more than one that only adds a guard.
- In Java, integer overflow and negative remainders are silent; ask about value ranges and use `long` and `Math.floorMod` where needed.
- Mention a few relevant edges early, and always trace at least one after coding before you say you are done.
