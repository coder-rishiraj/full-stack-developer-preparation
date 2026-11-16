---
problemId: cses-bubble-sort-rounds-ii
title: Bubble Sort Rounds II
source: cses
sourceUrl: https://cses.fi/problemset/task/3152
difficulty: hard
patterns: [additional, sorting, heap, fenwick-tree]
relatedLessons: [a7-min-heap, a7-priority-queues, a12-fenwick, a1-java-syntax-competitive, a14-brute-force-first, a14-deriving-optimization]
companies: []
timeToSolve: 40
---

## 1. Problem restatement

Bubble sort works in rounds. In one round it scans the array from left to right and swaps every pair of neighbours whose left value is strictly larger than the right one. You get an array of n integers and a number k. Print the array as it is after k rounds. This is a whole program: it reads standard input and writes standard output.

**Example 1** (from the statement)

- Input: `5 2` on the first line, `3 2 4 1 4` on the second
- Output: `2 1 3 4 4`
- Why: round 1 turns `3 2 4 1 4` into `2 3 1 4 4`, and round 2 turns that into `2 1 3 4 4`.

**Example 2** (an extra example: the statement has only one)

- Input: `5 1000000000` on the first line, `3 2 4 1 4` on the second
- Output: `1 2 3 4 4`
- Why: three rounds already sort this array; more rounds change nothing.

**What the problem statement guarantees**

- 1 ≤ n ≤ 2 · 10^5.
- 0 ≤ k ≤ 10^9.
- 1 ≤ x_i ≤ 10^9. Values may repeat.
- The first line has n and k, the second line the n integers. The output is the n integers.
- Time limit: 1 second (memory limit 512 MB).

## 2. Practice first: try it before reading on

If you have not solved this yourself yet, stop here. Running k rounds is easy to write, but k can be huge and even n rounds of n steps are far too many. You need to describe the array after k rounds without running them. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 40 minutes.
2. Run rounds by hand on `5 4 3 2 1` and on the example, and look at the array after each round. Which part of it is already final, and what does the rest look like?
3. Think of one round as a scan that "holds" one value as it walks along. What does it hold, and what does it leave behind?
4. Write the full program; test k = 0, k = 1, and k larger than n.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> During a round, the scan carries a value to the right: whenever the carried value is larger than the next one, they swap. So the carried value is always the largest value seen so far in this round, and everything it drops behind is the smaller of two values. What does a round write to the left of the scan?

> [!HINT] Hint 2: the kind of tool you need
> A round is a one-slot buffer: read the next value, write out the smaller of (buffer, value), keep the larger. Now feed the output of round 1 into round 2, and so on. k one-slot buffers in a row behave like one buffer that holds k values. Which data structure holds k values and always hands out the smallest?

> [!HINT] Hint 3: almost the whole plan
> Put the values one by one into a min-heap; whenever it holds more than min(k, n) values, remove the smallest and print it. At the end, print what is left in the heap in increasing order. Prove that k rounds equal this heap by induction on k. (Another route: an element with at least k strictly larger values before it ends exactly k places further left; all other values fill the remaining places in sorted order.)

**Check yourself before revealing the walkthrough**

- [ ] k = 0 prints the input unchanged
- [ ] k ≥ n prints the sorted array, without running 10^9 rounds
- [ ] `4 1` / `2 2 1 1` prints `2 1 1 2`
- [ ] My output is built in one buffer and printed once

## 3. Interview script: understand the problem (≈3 min)

Treat it as if an interviewer had posed it. The questions that matter are the size of k, the meaning of "wrong order" for equal values, and the output format.

**Me:** I simulate k rounds of bubble sort conceptually and print the array. k can be 0?

**Interviewer:** Yes, 0 ≤ k ≤ 10^9. With k = 0 you print the input.

**Me:** And k is far larger than n at the top. After n − 1 rounds bubble sort has finished, so any k ≥ n − 1 means "print the sorted array". Equal neighbours do not swap?

**Interviewer:** Right, only a strictly larger left value is wrong.

**Me:** Output: the n values separated by spaces on one line. A trailing space is fine?

**Interviewer:** Yes.

**Me:** Let me run `5 4 3 2 1` by hand. Round 1: the 5 is carried all the way: `4 3 2 1 5`. Round 2: the 4 is carried to just before the 5: `3 2 1 4 5`. After k rounds the k largest values sit at the end in order, and the front is the rest... in this case still in reversed order, just shifted left by k. On the example with k = 2 the front is `2 1 3`, which is not sorted and not the original order either. So I need a real description of the front part.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 2 · 10^5 | Even n rounds of n steps (4 · 10^10) is too slow: I need about O(n log n). |
| 0 ≤ k ≤ 10^9 | k itself cannot be a loop bound. Only min(k, n) matters, because the array is sorted after n − 1 rounds. k fits an `int`. |
| 1 ≤ x_i ≤ 10^9 | Fits an `int`. Values repeat, and only values are printed, so equal values are interchangeable in the output. |
| Time limit 1 s | Fast input (`BufferedReader`, `StringTokenizer`) and one `StringBuilder` for the 2 · 10^5 output numbers. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| k = 0 is allowed | The method must handle an empty "pipeline": print the input. |
| Equal values are not swapped | Bubble sort is stable; comparisons are strict. |
| Space-separated output, trailing space accepted | I append each value and a space. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The numbers may be spread over lines differently from the statement | My reader takes tokens until it has n of them. |

### Edge cases I will keep in mind

- k = 0: unchanged.
- k ≥ n − 1, up to 10^9: fully sorted.
- n = 1: the single value, for any k.
- Already sorted input with k = 10^9: a simulation must stop early.
- Repeated values: `2 2 1 1` with k = 1 gives `2 1 1 2`.

## 4. Think out loud: from first idea to best solution

The ladder: simulate the rounds (with the early stop); then use what [[cses-bubble-sort-rounds-i|Bubble Sort Rounds I]] proved about single elements to place every element directly; then look at a round as a stream transformation, which collapses k rounds into one heap of size k.

### Alternative: simulate min(k, n) rounds

This rung is too slow for the largest tests (about 50 s measured on a reversed array at n = 2 · 10^5 with k = 10^9), so it is not a numbered approach.

#### What I say out loud

> "Run the rounds. k can be 10^9, but once a round makes no swap the array is sorted and nothing changes any more, so I stop there; that caps the work at about n rounds. Each round is n − 1 comparisons, so O(n · min(k, n)): fine for small inputs, 4 · 10^10 steps for a reversed array at the limit."

#### Intuition

The statement is an algorithm. The only trick is not to loop k times when the array is already sorted.

#### Algorithm

1. Read n, k and the array.
2. Repeat at most k times: scan j from 0 to n − 2 and swap `x[j]`, `x[j + 1]` when `x[j] > x[j + 1]`. If nothing was swapped, stop.
3. Print the array.

#### Why it is correct

- **It performs the rounds of the statement**, with the strict comparison.
- **Stopping early changes nothing:** a round without a swap leaves the array as it was, so every later round does too.
- **It needs at most n rounds:** bubble sort is sorted after at most n − 1 rounds, so round n at the latest makes no swap.

#### Dry run

Input `5 2` / `3 2 4 1 4`

| Round | Swaps made | Array after the round |
|---|---|---|
| 1 | (3, 2), (4, 1) | 2 3 1 4 4 |
| 2 | (3, 1) | 2 1 3 4 4 |

k = 2 rounds done: prints `2 1 3 4 4`.

#### Java code

```java title="Alternative: simulate min(k, n) rounds (too slow at n = 2 · 10^5)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer first = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(first.nextToken());
        int k = Integer.parseInt(first.nextToken());
        int[] x = readNumbers(in, n);
        simulateRounds(x, k);
        StringBuilder out = new StringBuilder();
        for (int v : x) out.append(v).append(' ');
        System.out.println(out);
    }

    /** Runs up to k bubble-sort rounds, stopping early once a round makes no swap. */
    static void simulateRounds(int[] x, int k) {
        for (int round = 0; round < k; round++) {
            boolean swapped = false;
            for (int j = 0; j + 1 < x.length; j++) {
                if (x[j] > x[j + 1]) {
                    int t = x[j];
                    x[j] = x[j + 1];
                    x[j + 1] = t;
                    swapped = true;
                }
            }
            if (!swapped) return;                  // sorted: further rounds change nothing
        }
    }

    static int[] readNumbers(BufferedReader in, int count) throws IOException {
        int[] x = new int[count];
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < count; i++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            x[i] = Integer.parseInt(st.nextToken());
        }
        return x;
    }
}
```

#### Time complexity

**O(n · min(k, R + 1)), which is O(n²) in the worst case**, where R ≤ n − 1 is the number of rounds the array needs to become sorted. Measured at about 50 s for the whole program on a reversed array at n = 2 · 10^5 with k = 10^9 (JDK 26). Without the early stop, a sorted array with k = 10^9 would cost about 2 · 10^14 comparisons.

#### Space complexity

**O(1) auxiliary** beyond the array, plus the output buffer.

#### The bridge to the next approach

> "In Bubble Sort Rounds I we proved exactly what a round does to each element. Let c_i be the number of earlier values strictly larger than x_i. Each round, an element with c_i > 0 moves left exactly one place and its c drops by one. So I know where those elements are after k rounds without running anything. The question is what happens to the others."

### Approach 1: Place the slow elements, sort the rest into the gaps

#### What I say out loud

> "Compute c_i for every element with a Fenwick tree. If c_i ≥ k, the element had something larger in front of it in each of the k rounds, so it moved left exactly one place every round and never right: it ends at i − k. Every other element has c = 0 after k rounds, meaning nothing larger is in front of it, so those elements appear in non-decreasing order. Their multiset is known and so are the free positions: I sort them and fill the gaps from left to right."

#### Intuition

Two kinds of elements. The "slow" ones still have larger values in front after k rounds; their motion is completely predictable (one step left per round). The "settled" ones have nothing larger in front any more, and a sequence in which nobody has a larger value in front is sorted.

#### Algorithm

1. Read n, k and the array. Compress the values to ranks.
2. Sweep i from 0 to n − 1 with a Fenwick tree over ranks: c_i = i − (number of seen values ≤ x_i); insert x_i.
   - If c_i ≥ k: `result[i − k] = x[i]`, mark position i − k as taken.
   - Otherwise add x[i] to the list `rest`.
3. Sort `rest`. Walk positions 0..n − 1: a taken position prints its value, a free one prints the next value of `rest`.

#### Why it is correct

The facts from Bubble Sort Rounds I (proved there): in each round, an element whose c is positive moves left by exactly one place and its c drops by exactly one; an element whose c is 0 keeps c = 0; c never grows. An element moves right only when it is the carried value, which needs nothing larger in front, so c = 0.

- **Slow elements (c_i ≥ k) end at i − k.** At the start of round t (t = 1..k) such an element has c = c_i − (t − 1) ≥ 1, so in each of the k rounds it moves left exactly one place and never right. Also i − k ≥ 0, because c_i ≤ i.
- **Settled elements (c_i < k) have c = 0 after k rounds**, since c drops by one per round until it reaches 0 and then stays.
- **Settled elements appear in non-decreasing order.** Take two settled elements u before w after k rounds. w has nothing strictly larger in front, so u ≤ w.
- **So the output is determined:** the slow elements at their positions; the settled ones, a known multiset, in non-decreasing order in the remaining positions. Only values are printed, so the order among equal settled values does not matter.
- **i − k positions are distinct** for distinct i, so no two slow elements collide; together with the settled values they fill all n positions.

#### Dry run

Input `5 2` / `3 2 4 1 4`. The c values (from Rounds I) are 0, 1, 0, 3, 0.

| i | x[i] | c_i | c_i ≥ 2? | Action |
|---|---|---|---|---|
| 0 | 3 | 0 | no | rest = 3 |
| 1 | 2 | 1 | no | rest = 3, 2 |
| 2 | 4 | 0 | no | rest = 3, 2, 4 |
| 3 | 1 | 3 | yes | result[1] = 1 |
| 4 | 4 | 0 | no | rest = 3, 2, 4, 4 |

Sorted rest: 2, 3, 4, 4, into the free positions 0, 2, 3, 4. Prints `2 1 3 4 4`.

#### Java code

```java title="Approach 1: place the slow elements, sort the rest into the gaps"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer first = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(first.nextToken());
        int k = Integer.parseInt(first.nextToken());
        int[] x = readNumbers(in, n);

        // Compress values to ranks 1..m for the Fenwick tree.
        int[] sorted = x.clone();
        Arrays.sort(sorted);
        int m = 0;
        for (int i = 0; i < n; i++) {
            if (i == 0 || sorted[i] != sorted[i - 1]) sorted[m++] = sorted[i];
        }

        int[] result = new int[n];
        boolean[] placed = new boolean[n];
        int[] rest = new int[n];                   // values that are settled after k rounds
        int restCount = 0;
        int[] tree = new int[m + 1];
        for (int i = 0; i < n; i++) {
            int rank = Arrays.binarySearch(sorted, 0, m, x[i]) + 1;
            int atMost = 0;
            for (int r = rank; r > 0; r -= r & -r) atMost += tree[r];
            int larger = i - atMost;               // earlier values strictly larger than x[i]
            if (larger >= k) {                     // moved left once in each of the k rounds
                result[i - k] = x[i];
                placed[i - k] = true;
            } else {
                rest[restCount++] = x[i];
            }
            for (int r = rank; r <= m; r += r & -r) tree[r]++;
        }

        Arrays.sort(rest, 0, restCount);           // the settled values fill the gaps in sorted order
        StringBuilder out = new StringBuilder();
        int next = 0;
        for (int p = 0; p < n; p++) {
            out.append(placed[p] ? result[p] : rest[next++]).append(' ');
        }
        System.out.println(out);
    }

    static int[] readNumbers(BufferedReader in, int count) throws IOException {
        int[] x = new int[count];
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < count; i++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            x[i] = Integer.parseInt(st.nextToken());
        }
        return x;
    }
}
```

#### Time complexity

**O(n log n):** two sorts, and per element a binary search and two Fenwick walks of O(log m) steps (m ≤ n distinct values). k only appears in comparisons, so k = 10^9 costs nothing. Measured at 0.13–0.18 s for the whole program at n = 2 · 10^5 (reversed with k = 10^9, random with k = 10^5).

#### Space complexity

**O(n):** the sorted copy, the tree, `result`, `placed`, `rest`, and the output buffer.

#### The bridge to the next approach

> "That works and reuses Rounds I, but it is a Fenwick tree, a compression and a gap-filling pass. Let me look at a round differently: as a stream. The scan reads values left to right, holds the largest so far, and writes out the smaller one at each step. That is a buffer of size one. Round 2 reads round 1's output as its stream. If I can show that k such buffers in a row act like one buffer of size k, the whole thing becomes a heap."

### Approach 2: A min-heap of size k (recommended)

#### What I say out loud

> "One round is a one-slot buffer: for each incoming value, write out min(held, incoming) and keep the max; at the end write the held value. k rounds are k buffers in a row. I claim that equals one buffer holding the k largest values seen so far: each time a value comes in and more than k are held, the smallest goes out. That's a min-heap of capacity min(k, n). At the end the heap is emptied in increasing order. O(n log k)."

#### Intuition

The k largest values seen so far are "in flight", carried by the k rounds; everything else has been dropped behind. When a new value arrives, the smallest of the in-flight values plus the new one is the value that is dropped next. At the end, the in-flight values land at the end of the array in sorted order, which matches what we saw by hand: after k rounds, the k largest values sit at the end, sorted.

#### Algorithm

1. Read n, k and the array. `capacity = min(k, n)`.
2. For each value v in input order: add v to a min-heap; if the heap holds more than `capacity` values, remove the smallest and append it to the output.
3. Remove the remaining values from the heap one by one (smallest first) and append them.
4. Print the output.

#### Why it is correct

Call B(k) the "box of capacity k": it reads values, holds up to k of them, and when it holds k + 1 it emits the smallest; at the end it emits the held values in increasing order. Claim: k rounds of bubble sort, applied to the array, output exactly what B(k) emits. Induction on k.

- **k = 0:** B(0) emits each value as it arrives: the array unchanged, which is 0 rounds.
- **One round is B(1).** The scan holds one value; at each step it compares the held value with the next one, leaves the smaller behind (writes it out) and keeps the larger; at the end the held value is the last element.
- **B(k − 1) followed by one round is B(k).** Run the k − 1 rounds as B(k − 1) (induction) and feed its output into one more round. After some prefix of the input has been read (with at least k values), B(k − 1) holds the k − 1 largest values of the prefix and has emitted all the others; the extra round holds the largest value emitted so far, which is the k-th largest of the prefix. So together they hold the k largest values of the prefix, like B(k). When the next value v arrives, B(k − 1) emits o, the smallest of its k − 1 values and v; the round then emits min(held, o) and keeps the max. The emitted value is the smallest among the k held values and v, exactly what B(k) emits. Before k values have arrived, nothing is emitted by either. At the end, B(k − 1) emits its values in increasing order, each at least as large as the round's held value, so the round emits its held value first and then passes them on in order: increasing order overall, as B(k) does.
- **Capacity min(k, n):** a box of capacity at least n never emits until the end, so it emits the sorted array; B(n) and B(10^9) behave the same. Capping at n is optional; it records that rounds beyond n change nothing.
- **Equal values:** only values are emitted, and equal values are interchangeable in the printed output, so how the heap breaks ties does not matter.

**The 30-second version:** "A round is a one-slot buffer that keeps the larger value and drops the smaller. Chain k of them and they hold the k largest values seen so far, dropping the smallest whenever a new value comes: that's a min-heap of size k. Push each value, pop the minimum once the heap is over capacity, and flush the heap in order at the end. O(n log k)."

#### Dry run

Input `5 2` / `3 2 4 1 4`, capacity 2.

| Value read | Heap after adding | Over capacity? | Emitted | Heap after |
|---|---|---|---|---|
| 3 | 3 | no | | 3 |
| 2 | 2, 3 | no | | 2, 3 |
| 4 | 2, 3, 4 | yes | 2 | 3, 4 |
| 1 | 1, 3, 4 | yes | 1 | 3, 4 |
| 4 | 3, 4, 4 | yes | 3 | 4, 4 |
| end | | | 4, 4 | empty |

Prints `2 1 3 4 4`. With k = 1 the same table with capacity 1 emits 2, 3, 1, 4 and then 4: `2 3 1 4 4`, round 1 of the statement's explanation.

#### Java code

```java title="Approach 2: a min-heap of size k (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.PriorityQueue;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer first = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(first.nextToken());
        int k = Integer.parseInt(first.nextToken());
        int[] x = readNumbers(in, n);

        int capacity = Math.min(k, n);             // after n rounds the array is sorted anyway
        PriorityQueue<Integer> held = new PriorityQueue<>(); // min-heap: the values still being carried
        StringBuilder out = new StringBuilder();
        for (int v : x) {
            held.add(v);
            if (held.size() > capacity) {          // k carriers are full: the smallest one drops out
                out.append(held.poll()).append(' ');
            }
        }
        while (!held.isEmpty()) {                  // the carried values end up last, in sorted order
            out.append(held.poll()).append(' ');
        }
        System.out.println(out);
    }

    static int[] readNumbers(BufferedReader in, int count) throws IOException {
        int[] x = new int[count];
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < count; i++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            x[i] = Integer.parseInt(st.nextToken());
        }
        return x;
    }
}
```

#### Time complexity

**O(n log c)**, where c = min(k, n) is the heap's capacity: n insertions and n removals on a heap of at most c + 1 values, O(log c) each (the `PriorityQueue` documentation gives O(log n) time for `offer` and `poll`). This is at most O(n log n). Measured at about 0.15 s for the whole program at n = 2 · 10^5.

#### Space complexity

**O(c)** for the heap (boxed `Integer`s), plus the input array and the output buffer.

## 5. Comparison table

n is the array length, k the number of rounds, R ≤ n − 1 the rounds the array needs to be sorted, c = min(k, n). Nothing is randomized, so expected and worst case agree.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Alternative: simulate min(k, n) rounds | O(n · min(k, R + 1)) | O(n²) | O(1) |
| 1. Place slow elements, sort the rest | O(n log n) | O(n log n) | O(n) |
| 2. Min-heap of size k | O(n log c) | O(n log n) | O(c) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Simulate | No insight needed; the testing reference | 50 s at the limit; needs the early stop for large k | First thing to say; small inputs |
| 1. Place slow elements | Explains where every element is; reuses Rounds I | Fenwick tree, compression and a merge pass: most code | When you already have the c values, or need positions of specific elements |
| 2. Min-heap | A dozen lines; library heap; fastest for small k | The equivalence needs the induction argument | The answer to give |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2. State the stream view of a round (keep the larger, drop the smaller), then the claim that k rounds hold the k largest values, then code the heap. If the interviewer has just seen Bubble Sort Rounds I, Approach 1 is a natural answer too; both are O(n log n) and both pass comfortably.

**Is it optimal?** For k ≥ n the output is the sorted array, so the problem includes comparison sorting, which needs Ω(n log n) comparisons in the worst case. Approach 2 meets that bound for comparison-based methods. For small k it is O(n log k), which is better.

Every program on this page, the simulation included, prints the expected output on both official CSES tests stored with the site (run on a real JVM, compared token by token).

Stop there. The remaining risks are the end of the stream (emptying the heap in order) and k = 0.

## 7. Interview script: code it and test it

### What I say while coding

> "`capacity = Math.min(k, n)`: k is up to 10^9 and only used as a size limit, so this is just tidiness, but it documents that rounds beyond n change nothing."

> "At the end I `poll` until the heap is empty. Iterating over a `PriorityQueue` does not visit values in sorted order: its iterator walks the internal array."

> "One `StringBuilder` for 2 · 10^5 numbers, printed once."

### Testing out loud

**Example, k = 2:** traced in section 4: `2 1 3 4 4`.

**k = 0:** capacity 0: each value is added and immediately removed, so the output is the input.

**k = 1:** `2 3 1 4 4`, the statement's first round.

**k = 3, 4 and 10^9 on the example:** `1 2 3 4 4` each time (the array is sorted after three rounds).

**n = 1:** one value, printed whatever k is.

**`4 1` / `2 2 1 1`:** capacity 1: emits 2, 1, 1, then flushes 2: `2 1 1 2`, matching one round by hand.

**`5 2` / `5 4 3 2 1`:** emits 3, 2, 1, flushes 4, 5: `3 2 1 4 5`.

**n = 2 · 10^5, reversed, k = 10^9:** the heap never overflows, then flushes everything sorted. Measured at about 0.14 s.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 3 min | k range, k = 0, strict comparison, output format |
| Hand simulation | 5 min | `5 4 3 2 1` and the example, round by round |
| Simulation and its cost | 2 min | Early stop; O(n²) |
| Insight and proof | 12 min | Stream view of a round, induction to a box of size k (or the slow/settled split) |
| Code | 6 min | Heap, flush in order |
| Test | 5 min | k = 0, k = 1, k ≥ n, repeated values |

If the heap view does not come, use Rounds I: elements with at least k larger values in front move exactly k places left. That alone is enough to finish with Approach 1.

## 9. Interviewer challenges

### About correctness

#### Why is the round's held value the k-th largest of the prefix in your induction?

**What they are testing:** whether the induction step is real or hand-waved.

**How to reason:** the extra round holds the largest value it has received, and it received exactly what B(k − 1) emitted.

**What I say:** "B(k − 1) keeps the k − 1 largest values of the prefix and has emitted every other value. The last round has seen exactly those emitted values and holds the largest of them, which is the largest value outside the top k − 1: the k-th largest of the prefix."

**Nuance:** with repeated values "the k largest" is a multiset, and ties can be resolved either way; since only values are printed, nothing observable depends on it.

#### Your Approach 1 says settled elements end up sorted. Why can't a settled element have a larger slow element in front of it?

**What they are testing:** whether the "c = 0" fact is understood as including all elements, not only settled ones.

**How to reason:** c counts every strictly larger element in front, slow or settled.

**What I say:** "After k rounds a settled element has c = 0: nothing strictly larger anywhere in front of it, slow elements included. So a slow element in front of a settled one is at most as large. The settled elements among themselves are therefore non-decreasing, and the slow elements sit wherever their i − k says."

**Nuance:** the slow elements themselves are not necessarily sorted among each other or relative to later settled elements; in the example output `2 1 3 4 4` the slow 1 sits after the settled 2.

### About implementation

#### What goes wrong with a max-heap, or with printing the heap by iterating over it?

**What they are testing:** whether you know which end of the heap leaves, and Java's `PriorityQueue` iteration order.

**How to reason:** the rounds carry the large values and drop the small ones, so the heap must hand out its minimum. And the final flush must be in increasing order.

**What I say:** "With `Collections.reverseOrder()` the example with k = 2 prints `4 3 4 2 1`, nonsense. With `for (int v : held)` instead of polling, `5 5` / `3 2 4 1 4` prints `1 2 4 3 4`, because the iterator walks the heap's internal array, which is only heap-ordered. I ran both."

**Nuance:** the iteration bug hides on small heaps: with two equal values left, as in the k = 2 example, it prints the right answer.

## 10. Follow-up questions the interviewer might ask

**"How many rounds until the array is sorted?"**
That is [[cses-bubble-sort-rounds-i|Bubble Sort Rounds I]]: the maximum over elements of the number of earlier, strictly larger values, O(n log n).

**"Only print the value at position p after k rounds."**
With Approach 1, position p is either some slow element (the element at index p + k, if its c is at least k) or the j-th smallest settled value, where j counts the free positions before p. That is still O(n log n) to compute the c values, but needs no full output.

**"k rounds of the right-to-left scan instead."**
Mirror everything: the scan carries the minimum to the left, so a max-heap of size k processes the array from the right, emitting the largest whenever it is over capacity and flushing largest first at the end; the emitted sequence, reversed, is the answer. O(n log k) (checked against a simulation on small arrays).

**"How many swaps do the k rounds make in total?"**
Each element with c_i > 0 is swapped leftwards once per round while its c is positive, and every swap moves exactly one element left, so the total is the sum over i of min(c_i, k). Same Fenwick sweep, summed in a `long` (up to about 2 · 10^10). O(n log n).

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Assuming the front part keeps its original order** (or becomes sorted). The example's `2 1 3` is neither. Only the last min(k, n) positions are guaranteed sorted.
- **Looping k times.** k = 10^9 rounds of anything is too slow; at most n rounds matter.
- **Thinking an element moves left at most k places, so "close enough" values can be guessed.** The slow elements move exactly k places; the rest need the sorted fill.

### Implementation mistakes

> [!MISTAKE] Flushing the heap by iterating over it
> `for (int v : held)` visits the heap's internal array, not sorted order. On `5 5` / `3 2 4 1 4` it prints `1 2 4 3 4` instead of `1 2 3 4 4` (verified). Use `poll()` until the heap is empty.

- **A max-heap instead of a min-heap.** The example with k = 2 then prints `4 3 4 2 1` (verified).
- **Simulating without the early stop.** With k = 10^9 on a sorted array of 2 · 10^5 values, that is about 2 · 10^14 comparisons.
- **Printing value by value** with `System.out.print`: slow for 2 · 10^5 values; use one `StringBuilder`.
- **In Approach 1, using `i - k` without the guard.** It is only valid when c_i ≥ k, which also guarantees i − k ≥ 0.

## 12. Pattern recognition

**The pattern:** collapsing repeated passes of a streaming process into one data structure. A single pass that holds one value and drops the smaller is a buffer of size one; k chained passes are a buffer of size k, which is a heap. The same "what does the process do to one element" analysis as in Rounds I gives a second, positional description.

**Signals in the problem statement:**

- "The array after k rounds/steps" with k up to 10^9: the process stabilises, or has a closed form; never loop k times.
- A left-to-right pass that carries a maximum: think buffer, then heap.
- Adjacent swaps with a strict comparison: stability, and "larger elements in front" counts.

**Related problems in this list:**

- [[cses-bubble-sort-rounds-i|Bubble Sort Rounds I]]: the number of rounds the same process needs, and the proof that every round moves each slow element exactly one place.
- [[nc-kth-largest-element-in-stream|Kth Largest Element in a Stream]]: a min-heap of size k holding the k largest values of a stream, the same structure as Approach 2.
- [[cses-sorting-methods|Sorting Methods]]: the costs of several sorting processes, including bubble sort's swap count.
- [[cses-swap-round-sorting|Swap Round Sorting]]: rounds of swaps again, with arbitrary disjoint swaps per round.
- [[nc-kth-largest-element-in-array|Kth Largest Element in an Array]]: a size-k heap as a filter over all values.

**Takeaway:** when a process makes the same pass k times, ask what one pass does as a stream; k passes of a size-one buffer are a size-k heap.

## 13. 60-second revision card

**Key insight:** one bubble-sort round is a one-slot buffer that keeps the larger value and drops the smaller. k rounds hold the k largest values seen so far and drop the smallest: a min-heap of capacity min(k, n), flushed in increasing order at the end.

**Invariant:** after reading a prefix with at least k values, the k rounds together hold exactly its k largest values, and everything else has been written out.

**Complexity:** O(n log min(k, n)) time, O(min(k, n)) heap space plus the output.

**Code skeleton:**

```java title="Bubble Sort Rounds II, min-heap"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.PriorityQueue;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(st.nextToken());
        int capacity = Math.min(Integer.parseInt(st.nextToken()), n);
        PriorityQueue<Integer> held = new PriorityQueue<>();
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < n; i++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(in.readLine());
            held.add(Integer.parseInt(st.nextToken()));
            if (held.size() > capacity) out.append(held.poll()).append(' ');
        }
        while (!held.isEmpty()) out.append(held.poll()).append(' ');
        System.out.println(out);
    }
}
```

**Main traps:**

- Min-heap, not max-heap.
- Flush with `poll()`, never by iterating.
- k = 0 prints the input; k ≥ n prints the sorted array.

**What to say in one breath:** "A round keeps the larger value and drops the smaller, so k rounds keep the k largest values seen so far and drop the smallest: push each value into a min-heap, pop when it holds more than k, flush it in order at the end. O(n log k)."
