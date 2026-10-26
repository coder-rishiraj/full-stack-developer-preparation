---
summary: Next and previous greater or smaller element problems ask, for every position, where the nearest larger or smaller value is. You will learn the four variants, how a monotonic stack answers each in O(n), how to handle ties, circular arrays and online input, and how to recognise these problems behind stories about temperatures and stock prices.
difficulty: intermediate
minutes: 45
objectives:
  - Define the four nearest-element queries (next/previous, greater/smaller) and compute them by hand
  - Implement each variant with a monotonic stack and choose the comparison that handles equal values correctly
  - Adapt the scan to return values, indices or distances, and to answer queries for a subset of elements
  - Solve circular arrays by scanning twice and online streams by merging popped entries
  - Recognise disguised nearest-element problems such as Daily Temperatures and Stock Span
---

## Introduction

A weather app shows, for each day of the forecast, how many days you must wait for a warmer one. A trading screen shows, for each day, how many consecutive days the stock has closed at or below today's price. A layout engine asks, for each bar in a chart, where the first shorter bar is on each side.

Strip away the stories and the same question remains: **for each position in an array, where is the nearest element on one side that is larger (or smaller)?** These are the **nearest greater and smaller element** problems, usually called **Next Greater Element (NGE)**, **Next Smaller Element (NSE)**, **Previous Greater Element (PGE)** and **Previous Smaller Element (PSE)**.

The obvious solution walks outward from each position, which is O(n²) in the worst case. The [[a5-monotonic-stack]] lesson introduced the tool that brings this down to O(n): a stack of indices kept in sorted order, from which each new element pops the entries it "answers". This lesson takes that tool and works through every variant you are likely to meet — the four directions, ties, values versus indices versus distances, a subset of queries, circular arrays and streaming input — so that you can produce the right loop for any phrasing without guessing.

## Before you start

- **Monotonic stack** — the invariant, the two moments when answers appear (on pop, and the top after popping), and why the scan is O(n). See [[a5-monotonic-stack]].
- **Stacks in Java** — `ArrayDeque` with `push`, `pop`, `peek`. See [[a5-stack]].
- **Hash maps** — needed when queries arrive as values rather than positions. See [[a1-hashmap]].

## The four questions

Take `a = [3, 7, 1, 7, 8, 4]`. For each index `i`:

- **Next greater:** the first index `j > i` with `a[j] > a[i]`.
- **Next smaller:** the first `j > i` with `a[j] < a[i]`.
- **Previous greater:** the last `j < i` with `a[j] > a[i]`.
- **Previous smaller:** the last `j < i` with `a[j] < a[i]`.

Work a few by hand before reading the code. For index 1 (value 7), the next greater is index 4 (value 8) — index 3 holds another 7, which is *not* greater. Its previous smaller is index 0 (value 3). For index 5 (value 4), the previous greater is index 4 (value 8), and there is no next anything, because it is the last element.

The phrase "strictly greater" versus "greater or equal" changes answers when values repeat, as the two 7s show. Always settle which one the problem means before coding.

### The naive approach and its cost

For each `i`, walk right (or left) until the condition holds:

```java
for (int i = 0; i < n; i++) {
    res[i] = -1;
    for (int j = i + 1; j < n; j++) {
        if (a[j] > a[i]) { res[i] = j; break; }
    }
}
```

On a strictly decreasing array such as `[5, 4, 3, 2, 1]`, no element ever finds an answer, so every inner loop runs to the end: about n²/2 comparisons. With 10⁵ elements that is five billion — far too slow.

### The O(n) idea in one paragraph

Scan once, keeping a stack of indices that are still relevant. For the **next** queries, the stack holds indices still *waiting* for their answer; when the current element satisfies the condition for the top, the top's answer is the current index, so pop it and record that. For the **previous** queries, the stack holds indices that could still *be* an answer for something later; pop the ones the current element hides, and whatever remains on top is the current element's answer. In both cases each index is pushed once and popped at most once, so the scan is O(n). The full derivation is in [[a5-monotonic-stack]].

## All four variants in one program

```java title="Nearest.java"
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

public class Nearest {
    // Each method returns, for every i, the INDEX of the answer, or -1 / n when none exists.

    static int[] nextGreater(int[] a) {                // first j > i with a[j] > a[i]
        int n = a.length;
        int[] res = new int[n];
        Arrays.fill(res, n);                           // n = "none to the right"
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!st.isEmpty() && a[st.peek()] < a[i]) res[st.pop()] = i;
            st.push(i);
        }
        return res;
    }

    static int[] nextSmaller(int[] a) {                // first j > i with a[j] < a[i]
        int n = a.length;
        int[] res = new int[n];
        Arrays.fill(res, n);
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!st.isEmpty() && a[st.peek()] > a[i]) res[st.pop()] = i;
            st.push(i);
        }
        return res;
    }

    static int[] previousGreater(int[] a) {            // last j < i with a[j] > a[i]
        int n = a.length;
        int[] res = new int[n];
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!st.isEmpty() && a[st.peek()] <= a[i]) st.pop();   // not strictly greater: useless
            res[i] = st.isEmpty() ? -1 : st.peek();
            st.push(i);
        }
        return res;
    }

    static int[] previousSmaller(int[] a) {            // last j < i with a[j] < a[i]
        int n = a.length;
        int[] res = new int[n];
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!st.isEmpty() && a[st.peek()] >= a[i]) st.pop();
            res[i] = st.isEmpty() ? -1 : st.peek();
            st.push(i);
        }
        return res;
    }

    public static void main(String[] args) {
        int[] a = {3, 7, 1, 7, 8, 4};
        System.out.println("a                 " + Arrays.toString(a));
        System.out.println("next greater      " + Arrays.toString(nextGreater(a)));
        System.out.println("next smaller      " + Arrays.toString(nextSmaller(a)));
        System.out.println("previous greater  " + Arrays.toString(previousGreater(a)));
        System.out.println("previous smaller  " + Arrays.toString(previousSmaller(a)));
    }
}
```

```output
a                 [3, 7, 1, 7, 8, 4]
next greater      [1, 4, 3, 4, 6, 6]
next smaller      [2, 2, 6, 5, 5, 6]
previous greater  [-1, -1, 1, -1, -1, 4]
previous smaller  [-1, 0, -1, 2, 3, 2]
```

Check the output against your hand calculations: next greater of index 1 is 4, previous greater of index 5 is 4, and missing answers show as `6` (that is, `n`) on the right and `-1` on the left. Using `n` and `-1` as "none" values is a deliberate choice: they are the positions just outside the array, so widths such as `next - prev - 1` work without special cases, as in the histogram problem.

Compare the four loops and you will see a pattern worth remembering rather than four separate templates:

| Variant | Pop while | Answer recorded | Stack, bottom → top |
|---|---|---|---|
| Next greater | `a[top] < a[i]` | For the popped index: `i` | Non-increasing |
| Next smaller | `a[top] > a[i]` | For the popped index: `i` | Non-decreasing |
| Previous greater | `a[top] <= a[i]` | For `i`: the top after popping | Strictly decreasing |
| Previous smaller | `a[top] >= a[i]` | For `i`: the top after popping | Strictly increasing |

For **next** queries the pop condition is the question itself ("is `a[i]` greater than the top?"). For **previous** queries the pop condition is the *negation* of the question: pop everything that does not qualify as an answer, and what remains does.

### Dry run: previous greater

Previous-greater is the variant people find least intuitive, so trace it on `[3, 7, 1, 7, 8, 4]`. The stack is shown bottom → top as `index(value)`.

| `i` | `a[i]` | Popped (not > `a[i]`) | Answer = top | Stack after |
|---|---|---|---|---|
| 0 | 3 | — | -1 | `0(3)` |
| 1 | 7 | 0(3) | -1 | `1(7)` |
| 2 | 1 | — | 1 | `1(7), 2(1)` |
| 3 | 7 | 2(1), 1(7) | -1 | `3(7)` |
| 4 | 8 | 3(7) | -1 | `4(8)` |
| 5 | 4 | — | 4 | `4(8), 5(4)` |

At `i = 3`, the earlier 7 is popped because it is not *strictly* greater than 7. Is it safe to forget it? Yes: for any later element, the 7 at index 3 is nearer and equally large, so it would always be chosen first. That is the "hidden behind" argument that justifies every pop in a previous-query scan.

## Ties: strict or not?

Equal values are where nearest-element code quietly goes wrong. The comparison in the `while` loop decides what an equal value means:

- **Next greater, strictly:** pop while `a[top] < a[i]`. An equal value does not pop, so it is not treated as an answer.
- **Next greater or equal:** pop while `a[top] <= a[i]`. An equal value now pops and becomes the answer.
- **Previous greater, strictly:** pop while `a[top] <= a[i]`. Equal values are discarded, so they are not answers.
- **Previous greater or equal:** pop while `a[top] < a[i]`. Equal values stay and can be the answer.

The rule behind all four: **in a next-query, the pop condition is "the current element qualifies as the answer"; in a previous-query, it is "the top does not qualify".** Write the qualification in words first — "strictly warmer", "at or below" — and the comparison follows.

Counting problems sometimes need *different* strictness on the two sides so that each range is counted once; [[a5-monotonic-stack]] shows this in Sum of Subarray Minimums.

## Values, indices or distances

The scan always works on indices, but the *answer* a problem wants varies. Only the line that records the answer changes:

- **Value of the next greater:** `res[j] = a[i]`.
- **Index:** `res[j] = i`.
- **Distance:** `res[j] = i - j` — this is Daily Temperatures.

The snippets in the rest of this lesson are static methods of one class, `NgeVariants`, which imports `java.util.*`; each was run with the inputs quoted after it.

```java title="NgeVariants.java (Daily Temperatures)"
static int[] dailyTemperatures(int[] t) {
    int[] res = new int[t.length];                    // default 0 = no warmer day
    Deque<Integer> st = new ArrayDeque<>();
    for (int i = 0; i < t.length; i++) {
        while (!st.isEmpty() && t[st.peek()] < t[i]) {
            int j = st.pop();
            res[j] = i - j;                           // distance, not value
        }
        st.push(i);
    }
    return res;
}
```

For temperatures `[73, 74, 75, 71, 69, 72, 76, 73]`, this returns `[1, 1, 4, 2, 1, 1, 0, 0]`. Day 2 (75) waits four days for 76; day 3 (71) waits two days for 72. The last two days never see a warmer day, and the default `0` from array initialisation is exactly the required answer, so no clean-up is needed. "Warmer" means strictly warmer, hence `<`.

## Scanning right to left

There is a second, equally valid way to compute next-greater: scan from the right, and treat it as a *previous*-query in the reversed direction. The stack then holds values to the right that could still be the answer for something further left.

```java title="NgeVariants.java (right-to-left)"
static int[] nextGreaterRightToLeft(int[] a) {
    int n = a.length;
    int[] res = new int[n];
    Deque<Integer> st = new ArrayDeque<>();           // values to the right that might still be answers
    for (int i = n - 1; i >= 0; i--) {
        while (!st.isEmpty() && st.peek() <= a[i]) st.pop();   // hidden behind a[i] for everyone further left
        res[i] = st.isEmpty() ? -1 : st.peek();
        st.push(a[i]);
    }
    return res;
}
```

For `[2, 1, 2, 4, 3]` it returns `[4, 2, 4, -1, -1]`, the same as the left-to-right version. The advantage is that each answer is final the moment it is computed, which some people find easier to reason about; the left-to-right version is more natural when input arrives as a stream. Both are O(n).

## Queries on a subset: Next Greater Element I

**Problem.** `nums1` is a subset of `nums2`, and all values are distinct. For each value in `nums1`, find the next greater value to its right *in `nums2`*.

The positions you need answers for are in `nums2`, but the queries arrive as values. Since values are distinct, run the ordinary scan over `nums2`, record each value's answer in a `HashMap`, and look the queries up afterwards.

```java title="NgeVariants.java (Next Greater Element I)"
static int[] nextGreaterSubset(int[] nums1, int[] nums2) {
    Map<Integer, Integer> nextOf = new HashMap<>();   // value -> its next greater value in nums2
    Deque<Integer> st = new ArrayDeque<>();           // values (distinct), decreasing bottom to top
    for (int x : nums2) {
        while (!st.isEmpty() && st.peek() < x) nextOf.put(st.pop(), x);
        st.push(x);
    }
    int[] res = new int[nums1.length];
    for (int i = 0; i < nums1.length; i++) res[i] = nextOf.getOrDefault(nums1[i], -1);
    return res;
}
```

With `nums1 = [4, 1, 2]` and `nums2 = [1, 3, 4, 2]` the result is `[-1, 3, -1]`. Storing values on the stack is fine here *only because* the values are distinct and the answer is a value; if duplicates were allowed, a value would not identify a position, and you would need indices. Time is O(n + m) for the two arrays.

## Circular arrays: Next Greater Element II

**Problem.** The array is circular: after the last element comes the first. Find the next greater value for each element, searching forward and wrapping around.

**The idea.** Walking the array twice simulates the wrap-around: any element's next greater, if it exists, appears within the next `n - 1` positions of the doubled sequence. Rather than building a doubled array, loop `i` from `0` to `2n - 1` and use `i % n`.

```java title="NgeVariants.java (circular)"
static int[] nextGreaterCircular(int[] nums) {
    int n = nums.length;
    int[] res = new int[n];
    Arrays.fill(res, -1);
    Deque<Integer> st = new ArrayDeque<>();
    for (int i = 0; i < 2 * n; i++) {                 // walk the array twice
        int idx = i % n;
        while (!st.isEmpty() && nums[st.peek()] < nums[idx]) res[st.pop()] = nums[idx];
        if (i < n) st.push(idx);                      // each index waits only once
    }
    return res;
}
```

For `[1, 2, 1]` the result is `[2, -1, 2]`: the last `1` wraps around to find `2`. For `[5, 4, 3, 2, 1]` it is `[-1, 5, 5, 5, 5]` — every smaller element wraps around to the 5 at the start.

The line `if (i < n) st.push(idx)` matters. The second pass exists only to *answer* indices still waiting; pushing indices again would make them wait for a second answer and could overwrite a correct one. The maximum element is never popped, so its answer stays `-1`. The loop runs `2n` times and still pushes each index once, so the time is O(n).

## Online input: Stock Span

**Problem.** Prices arrive one per day. For each new price, return its **span**: the number of consecutive days, ending today, on which the price was less than or equal to today's. For prices `100, 80, 60, 70, 60, 75, 85` the spans are `1, 1, 1, 2, 1, 4, 6`.

The span is today's index minus the index of the **previous strictly greater** price. The twist is that the input is a stream — there is no array to index into, and storing every price just to compute indices would be wasteful. The trick is to let each stack entry carry the span it has absorbed: when today pops an earlier day, it inherits that day's span, because every day that day covered is also at or below today's price.

```java title="StockSpanner.java"
import java.util.ArrayDeque;
import java.util.Deque;

public class StockSpanner {
    // each entry is {price, span}: the span absorbs every popped day
    private final Deque<int[]> st = new ArrayDeque<>();

    /** Number of consecutive days, ending today, with price <= today's price. */
    public int next(int price) {
        int span = 1;                                     // today counts
        while (!st.isEmpty() && st.peek()[0] <= price) {
            span += st.pop()[1];                          // those days are all <= price too
        }
        st.push(new int[] {price, span});
        return span;
    }

    public static void main(String[] args) {
        StockSpanner s = new StockSpanner();
        StringBuilder out = new StringBuilder();
        for (int p : new int[] {100, 80, 60, 70, 60, 75, 85}) out.append(s.next(p)).append(' ');
        System.out.println(out.toString().trim());
    }
}
```

```output
1 1 1 2 1 4 6
```

Trace the stack of `{price, span}` entries (bottom → top):

| Price | Popped | Span | Stack after |
|---|---|---|---|
| 100 | — | 1 | `{100,1}` |
| 80 | — | 1 | `{100,1} {80,1}` |
| 60 | — | 1 | `{100,1} {80,1} {60,1}` |
| 70 | `{60,1}` | 1 + 1 = 2 | `{100,1} {80,1} {70,2}` |
| 60 | — | 1 | `… {70,2} {60,1}` |
| 75 | `{60,1}`, `{70,2}` | 1 + 1 + 2 = 4 | `{100,1} {80,1} {75,4}` |
| 85 | `{75,4}`, `{80,1}` | 1 + 4 + 1 = 6 | `{100,1} {85,6}` |

When 85 pops `{75, 4}`, it adds 4 days in one step without seeing them individually — those days were already absorbed into 75's entry. Each price is pushed once and popped at most once, so `next` is amortised O(1). "At or below" includes equal prices, so the pop uses `<=`.

```quiz
Q: For a = [4, 4, 2], what is the next strictly greater element of index 0, and which pop condition gives it?
- [ ] Index 1, using pop while a[top] <= a[i]
- [x] None, using pop while a[top] < a[i]
- [ ] Index 2, using pop while a[top] > a[i]
- [ ] Index 1, using pop while a[top] < a[i]
> Index 1 holds an equal 4, which is not strictly greater, and index 2 is smaller, so there is no answer. Popping only on a[top] < a[i] leaves equal values waiting. Popping on <= would wrongly report index 1.

Q: In the circular Next Greater Element II, why are indices pushed only when i < n?
- [ ] To save memory; pushing twice gives the same answers
- [x] The second pass exists only to answer indices still waiting; pushing again would make them wait for a second answer that could overwrite the correct one
- [ ] Because i % n is undefined for i >= n
- [ ] So the maximum element is popped
> Every index needs to be on the stack once, waiting for its first greater element in the circular order. The second pass supplies the wrapped-around candidates. Re-pushing would put the same index on the stack again and could record a later, wrong answer.

Q: In Stock Span, why does today's span add the span stored in each popped entry instead of 1?
- [ ] Because spans are always even
- [x] Each popped entry already represents a run of consecutive days at or below its price, all of which are also at or below today's price
- [ ] To make the stack sorted
- [ ] Because the stack stores indices
> A popped day had price <= today, and the days it absorbed had price <= that day's price, so all of them are <= today. Adding the stored span counts them in one step, which is why each next call is amortised O(1).
```

## Recognising nearest-element problems

The words "next greater" rarely appear. Look for these signals:

- **"How long until …"** something larger or smaller happens: Daily Temperatures, car fleet arrival, days until a price drop.
- **"How many consecutive … before"**: stock span, number of visible people in a queue, buildings with an ocean view.
- **"Extend as far as possible while the current element is the minimum (or maximum)"**: Largest Rectangle in Histogram, Sum of Subarray Minimums, Maximum Subarray Min-Product — all need previous and next smaller.
- **A brute force that walks outward from every index until a comparison succeeds.** That inner walk is exactly what the stack eliminates.

Once recognised, answer three questions before writing code: next or previous? greater or smaller? strict or not? Then pick the row from the table above.

## In real systems

**Finance.** Stock span and "days since last higher close" are standard technical indicators computed online as prices arrive, exactly as in `StockSpanner`.

**Monitoring and alerting.** "Time until the metric next exceeds this reading" and "how long has the metric been at or below this level" are nearest-greater questions over time series.

**Geometry and graphics.** Skyline visibility (which buildings can be seen from a point), and the largest free rectangle in an occupancy grid, reduce to nearest greater or smaller computations per row.

## Trade-offs and alternatives

| Approach | Time | Space | When |
|---|---|---|---|
| Walk outward per index | O(n²) worst | O(1) | Tiny inputs, or when you need only one index's answer |
| Monotonic stack | O(n) | O(n) | All indices of a static array or an append-only stream |
| Sparse table plus binary search | O(n log n) | O(n log n) | Queries such as "first element greater than x after position p" with arbitrary x |
| Segment tree with descent | O(log n) per query | O(n) | The array changes between queries — see [[a12-segment-trees]] |

For a single index, a plain scan is simpler and just as fast. The stack pays off when you need every answer, which is what these problems almost always ask for.

## Common mistakes

> [!MISTAKE] Recording the answer at the wrong moment
> In next-queries the answer belongs to the **popped** index; in previous-queries it belongs to the **current** index and is read from the top after popping. Mixing them — for example writing `res[i] = st.peek()` in a next-greater scan — produces previous-greater answers instead.

**Inverting the comparison.** For next greater, pop when the top is *smaller* than the current element. Derive it from "the current element answers the top".

**Mishandling ties.** Decide whether equal values count before choosing `<` or `<=`.

**Pushing twice in the circular version.** Push only during the first pass.

**Storing values when duplicates exist.** If two positions share a value, values on the stack cannot tell them apart; store indices.

**Forgetting defaults.** Indices left on the stack have no answer. Initialise the result to `-1`, `0` or `n` as the problem requires.

## Interview perspective

These problems test whether you can turn a story into the right variant quickly and explain the O(n) bound.

> [!INTERVIEW] Framing the answer
> "Each day needs the first strictly warmer day to its right — a next-greater query. I'll keep a stack of days still waiting. When a warmer day arrives, it answers every cooler day on top, and the answer is the index difference. Each day is pushed and popped once, so this is O(n)."

Common questions and follow-ups:

- **Next Greater Element I** — scan `nums2`, map value → answer. Follow-up: what if values repeat? Use indices and a different lookup.
- **Next Greater Element II** — circular; loop `2n`, push only in the first pass.
- **Next Greater Element III** — despite the name, this is the "next permutation" problem on the digits of a number, not a stack problem. Recognising that is part of the test.
- **Daily Temperatures** — distances instead of values.
- **Online Stock Span** — online previous-greater, merging spans.
- **Follow-up: can you do it right to left?** Yes — treat it as a previous-query from the other side.

## Practice

1. **Next Greater Element I and II.** Implement both, then rewrite II by explicitly doubling the array and compare.
2. **Daily Temperatures** right to left, using the "hidden behind" pop rule.
3. **Online Stock Span**, then a variant returning the span of days with *strictly* lower prices.
4. **Buildings With an Ocean View.** Ocean on the right: which buildings have no taller-or-equal building to their right?
5. **Number of Visible People in a Queue.** Each person sees to the right until someone taller blocks the view; count how many they see.
6. **Car Fleet.** Sort by position and use a stack of arrival times to merge fleets.

The DSA explorer lists the matching problems under this topic; start with *Next Greater Element I*, *Daily Temperatures* and *Online Stock Span*.

## Quick revision {#quick-revision}

- Four queries: next/previous × greater/smaller. Brute force O(n²); monotonic stack O(n).
- Next-queries: pop while the current element answers the top; the popped index's answer is `i`.
- Previous-queries: pop while the top does not qualify; the top after popping is `i`'s answer.
- Next greater: pop `a[top] < a[i]`. Next smaller: pop `a[top] > a[i]`. Previous greater: pop `a[top] <= a[i]`. Previous smaller: pop `a[top] >= a[i]`.
- Ties: flip `<`/`<=` to decide whether equal values count.
- Defaults: `-1` on the left, `n` on the right (or `-1`/`0` as the problem asks).
- Value, index or distance: only the recording line changes (`a[i]`, `i`, `i - j`).
- Subset queries with distinct values: map value → answer.
- Circular: loop `2n` with `i % n`, push only when `i < n`.
- Stream (stock span): stack of `{price, span}`, add popped spans; amortised O(1).

## Key takeaways {#key-takeaways}

- Nearest greater and smaller element problems all share one O(n) solution: a monotonic stack where each index is pushed and popped once.
- Next-queries record answers for popped indices; previous-queries read the answer from the top after popping.
- Write the qualification in words — strictly greater, at or below — and the comparison, including tie handling, follows from it.
- Circular arrays need a second pass that answers but does not push; streams need entries that carry merged information.
- The skill interviews test is recognition: a brute force that walks outward from every index is the signal to reach for this pattern.
