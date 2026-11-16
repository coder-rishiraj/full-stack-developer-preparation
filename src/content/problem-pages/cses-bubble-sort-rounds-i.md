---
problemId: cses-bubble-sort-rounds-i
title: Bubble Sort Rounds I
source: cses
sourceUrl: https://cses.fi/problemset/task/3151
difficulty: hard
patterns: [additional, sorting, inversions, fenwick-tree]
relatedLessons: [a3-merge-sort, a12-fenwick, a2-sorting-based, a1-java-syntax-competitive, a14-brute-force-first, a14-deriving-optimization]
companies: []
timeToSolve: 35
---

## 1. Problem restatement

Bubble sort works in rounds. In one round it scans the array from left to right and swaps every pair of neighbours that are in the wrong order, that is, whose left value is strictly larger than the right one. You get an array of n integers. Print how many rounds bubble sort needs before the array is sorted. This is a whole program: it reads standard input and writes standard output.

**Example 1** (from the statement)

- Input: `5` on the first line, `3 2 4 1 4` on the second
- Output: `3`
- Why: after round 1 the array is `2 3 1 4 4`, after round 2 it is `2 1 3 4 4`, after round 3 it is `1 2 3 4 4`, which is sorted. Two rounds are not enough.

**Example 2** (an extra example: the statement has only one)

- Input: `3` on the first line, `3 1 2` on the second
- Output: `1`
- Why: one round carries 3 to the end and gives `1 2 3`. The array moved two elements' worth of distance, but only one round was needed.

**What the problem statement guarantees**

- 1 ≤ n ≤ 2 · 10^5.
- 1 ≤ x_i ≤ 10^9. Values may repeat.
- The first line has n, the second line the n integers.
- Time limit: 1 second (memory limit 512 MB).

## 2. Practice first: try it before reading on

If you have not solved this yourself yet, stop here. Writing bubble sort is easy; the problem is that running it can take about n rounds of n steps each, far too many at n = 2 · 10^5. You have to predict the number of rounds without running them. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 35 minutes.
2. Run the rounds by hand on the example and on `5 4 3 2 1`, `2 3 4 5 1` and `5 1 2 3 4`. Write down, for each element, where it starts and where it is after each round.
3. Notice which elements move far in one round and which move only a little. Find a number, computable from the input alone, that tells you how many rounds an element needs.
4. Write the full program, then check it on an input with repeated values.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> Compare `5 1 2 3 4` (one round) with `2 3 4 5 1` (four rounds). A large value can travel any distance to the right in a single round. How far can a small value travel to the left in one round?

> [!HINT] Hint 2: the kind of tool you need
> In one round, an element moves left by exactly one place if some earlier element is strictly larger than it, and never more. So the answer depends on, for each element, how many earlier elements are strictly larger. Counting that for every element is a classic counting job: a structure that counts "how many seen values are at most v", or a sort.

> [!HINT] Hint 3: almost the whole plan
> Let c_i be the number of j < i with x_j > x_i. Each round lowers every positive c_i by exactly one, and the array is sorted exactly when all c_i are 0, so the answer is max c_i. Compute every c_i in O(n log n): process the array left to right, keep a Fenwick tree over compressed values, and c_i = i − (number of seen values ≤ x_i). An even shorter route: the answer also equals the largest leftward distance i − p_i, where p_i is the element's position after a stable sort.

**Check yourself before revealing the walkthrough**

- [ ] I can explain why a round moves an element left by at most one place
- [ ] My program prints 0 for an array that is already sorted, including n = 1
- [ ] My program prints 2 for `2 2 1 1` (equal values never swap)
- [ ] It runs in well under a second at n = 2 · 10^5 on a reversed array

## 3. Interview script: understand the problem (≈3 min)

Treat it as if an interviewer had posed it. The questions that matter are what exactly counts as a round, and what "wrong order" means for equal values.

**Me:** A round is one left-to-right scan that swaps each neighbouring pair whose left value is larger. I print how many rounds it takes until the array is sorted. Does a final scan that finds nothing to swap count as a round?

**Interviewer:** No. You print the number of rounds *needed*: the first number r such that after r rounds the array is sorted. Look at the example: three rounds, and the array is sorted after the third.

**Me:** So a sorted input prints 0. Next: equal neighbours. Are they "in the wrong order"?

**Interviewer:** No. Only a strictly larger left value is wrong.

**Me:** Then bubble sort never swaps equal values, so it is stable: equal values keep their relative order. And n is up to 2 · 10^5 with values up to 10^9, one line of input, one number of output, 1 second.

**Interviewer:** Right.

**Me:** Let me run the example by hand and watch individual elements. `3 2 4 1 4`. Round 1: 3 > 2, swap: `2 3 4 1 4`. 3 < 4, no swap. 4 > 1, swap: `2 3 1 4 4`. 4 and 4 are equal, no swap. So in one round the 4 travelled right by one, the 1 moved left by exactly one, and the 3 went right by one. Round 2 gives `2 1 3 4 4`, and round 3 gives `1 2 3 4 4`. The 1 started at index 3 and needed three rounds to reach index 0: it only ever moves left by one place per round. That suggests the answer is about how far the slow elements have to travel left.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 2 · 10^5 | Simulating up to n rounds of n steps is about 4 · 10^10 steps: too slow. I need O(n log n). |
| 1 ≤ x_i ≤ 10^9 | Values do not fit an array index, so a counting structure over values needs coordinate compression (or a sort). Every value fits an `int`. |
| Time limit 1 s | Read the input with `BufferedReader` and `StringTokenizer`; `Scanner` is slow at 2 · 10^5 tokens. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| The answer is the smallest r with the array sorted after r rounds | An already sorted array prints 0; a last round with no swaps is not counted. |
| Equal values are not in the wrong order | I count earlier elements that are *strictly* larger. Counting "larger or equal" gives wrong answers on repeated values. |
| Output is one integer | Nothing to format; the answer is at most n − 1, so an `int` holds it. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The numbers may be spread over lines differently from the statement | My reader takes tokens until it has n of them, wherever the line breaks are. It costs nothing. |

### Edge cases I will keep in mind

- n = 1, or any sorted array: 0.
- All values equal: 0, because nothing ever swaps.
- Reversed array of distinct values: n − 1, the maximum possible.
- `5 1 2 3 4`: one round, although the 5 travels four places.
- `2 3 4 5 1`: four rounds, because the 1 travels one place per round.
- Repeated values such as `2 2 1 1`: 2, not 3.

## 4. Think out loud: from first idea to best solution

The ladder: simulate the rounds; then understand what one round does to a single element, which turns the question into "for each element, how many earlier elements are strictly larger?"; answer that by scanning, then with a Fenwick tree, then with one sort.

### Alternative: simulate the rounds

This rung is too slow for the largest tests (about 48 s measured on a reversed array at n = 2 · 10^5), so it is not a numbered approach. It is the honest first answer and the reference for checking everything else.

#### What I say out loud

> "The definition is an algorithm: run bubble sort, one round at a time, and stop when a round makes no swap. The rounds that did swap something are the answer. Each round is n − 1 comparisons, and there can be up to n − 1 rounds, so this is O(n²) in the worst case: about 4 · 10^10 steps for a reversed array at the limit."

#### Intuition

A round on an unsorted array always swaps something (an unsorted array has a neighbouring pair in the wrong order, and the scan reaches it). A round on a sorted array swaps nothing. So the first round with no swap comes right after the last needed round.

#### Algorithm

1. Read n and the array.
2. `rounds = 0`. Repeat: scan j from 0 to n − 2 and swap `x[j]`, `x[j + 1]` when `x[j] > x[j + 1]`.
3. If the scan swapped nothing, print `rounds` and stop; otherwise `rounds++` and repeat.

#### Why it is correct

- **It performs exactly the process in the statement**, with the same strict comparison.
- **It stops at the right moment.** A scan of a sorted array swaps nothing. A scan of an unsorted array swaps at least once: let (j, j + 1) be the first neighbouring pair in the wrong order. Everything before it is non-decreasing, so the scan makes no swap before reaching it, and then x[j] > x[j + 1] forces a swap. So the first scan without a swap comes exactly after the last round that was needed.
- **It terminates**, because bubble sort sorts in at most n − 1 rounds (each round puts the largest unsettled value in its final place).

#### Dry run

Input `5` / `3 2 4 1 4`

| Round | Swaps made | Array after the round | rounds |
|---|---|---|---|
| 1 | (3, 2), (4, 1) | 2 3 1 4 4 | 1 |
| 2 | (3, 1) | 2 1 3 4 4 | 2 |
| 3 | (2, 1) | 1 2 3 4 4 | 3 |
| 4 | none | 1 2 3 4 4 | stop |

Prints `3`.

#### Java code

```java title="Alternative: simulate the rounds (too slow at n = 2 · 10^5)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] x = readNumbers(in, n);
        System.out.println(simulateRounds(x));
    }

    /** Runs bubble-sort rounds until one makes no swap; counts the rounds that changed something. */
    static int simulateRounds(int[] x) {
        int rounds = 0;
        while (true) {
            boolean swapped = false;
            for (int j = 0; j + 1 < x.length; j++) {
                if (x[j] > x[j + 1]) {             // wrong order: strictly greater on the left
                    int t = x[j];
                    x[j] = x[j + 1];
                    x[j + 1] = t;
                    swapped = true;
                }
            }
            if (!swapped) return rounds;           // already sorted: this round is not needed
            rounds++;
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

**O(n · (R + 1)), which is O(n²) in the worst case**, where R is the answer (at most n − 1): each round is n − 1 comparisons, and R + 1 rounds run. Fast when R is small (one round on `n 1 2 … n−1` at n = 2 · 10^5 is instant), hopeless on a reversed array: about 48 s measured at n = 2 · 10^5 (JDK 26, whole program).

#### Space complexity

**O(1) auxiliary** beyond the input array, which the simulation sorts in place.

#### The bridge to the next approach

> "The waste is that I move every element, round after round, just to learn one number. Let me watch a single element instead. In the hand run, the 1 moved left exactly one place per round, while the 4 jumped right. If I can say exactly when an element moves left and by how much, I can predict the rounds without running them."

### Alternative: count larger elements before each element, by scanning

This rung is still too slow (about 3.6 s measured at n = 2 · 10^5), so it is not numbered either. Its value is the characterisation, which every faster approach reuses.

#### What I say out loud

> "Here is what one round does. The scan carries a value to the right: after it compares positions j and j + 1, position j + 1 holds the larger of the two. So when the scan reaches an element v, its left neighbour is the maximum of everything that was before v at the start of the round. If that maximum is strictly larger than v, they swap: v moves left by one, and exactly one larger element jumps over it. If there is no larger element before v, v itself becomes the carried value and moves right. So I define c_v = the number of earlier elements strictly larger than v. Each round lowers every positive c_v by exactly one, and the array is sorted when all c_v are zero. The answer is the largest c_v."

#### Intuition

Large values are fast (one round can carry the maximum across the whole array), small values are slow (they move left one place per round). An element is done when nothing larger is in front of it, and each round removes exactly one larger element from in front of it.

#### Algorithm

1. Read the array.
2. For each i, count j < i with `x[j] > x[i]` by scanning; keep the maximum count.
3. Print the maximum.

#### Why it is correct

This is the key argument of the problem. Fix one round, and for an element v let c_v be the number of elements before it that are strictly larger, measured at the start of the round.

- **The carried value.** When the scan compares positions j and j + 1, position j holds the maximum of the values at positions 0..j at the start of the round. This holds for j = 0, and the comparison leaves the larger of the two at position j + 1. (With equal values nothing swaps, but the value carried is the same.)
- **If c_v > 0, v moves left by exactly one, and c_v drops by exactly one.** When the scan reaches v at index i, its left neighbour holds M, the maximum of the values before v, and M > v because some earlier value is larger. So they swap: v moves to i − 1 and M passes over it. The next comparison is between positions i and i + 1, which does not involve v, so v moves no further this round. Elements jump over v only by swapping with v, and only M did, so exactly one larger element left the front of v.
- **If c_v = 0, it stays 0.** No element jumps from behind v to in front of it unless it swaps with v while being smaller than v, so no larger element can arrive in front of v. In particular c values never grow.
- **Sorted means all zero.** The array is sorted (non-decreasing) exactly when no element has a strictly larger element before it.

Together: after r rounds, element v has max(0, c_v − r) larger elements in front, so the array is sorted after r rounds exactly when r ≥ max c_v. The answer is max over v of c_v (0 for a sorted array).

The scan itself is correct by inspection: it compares x[i] with every earlier element, strictly.

#### Dry run

Input `5` / `3 2 4 1 4`

| i | x[i] | Earlier values strictly larger | c_i | best |
|---|---|---|---|---|
| 0 | 3 | none | 0 | 0 |
| 1 | 2 | 3 | 1 | 1 |
| 2 | 4 | none | 0 | 1 |
| 3 | 1 | 3, 2, 4 | 3 | 3 |
| 4 | 4 | none (the 4 at index 2 is equal) | 0 | 3 |

Prints `3`. Compare with the simulation, following each element's c. In round 1 the 2 (c = 1) is passed by the carried 3 and its c becomes 0; the 1 (c = 3) is passed by the carried 4 and its c becomes 2. Recomputed on the arrays themselves: after round 1 (`2 3 1 4 4`) the c values are 0, 0, 2, 0, 0; after round 2 (`2 1 3 4 4`) they are 0, 1, 0, 0, 0; after round 3 all are 0. The maximum drops by exactly one per round, 3, 2, 1, 0, and the 1 is the element that needs all three rounds.

On `2 2 1 1`: c = 0, 0, 2, 2, so the answer is 2 (rounds give `2 1 1 2`, then `1 1 2 2`). Counting "larger or equal" would give c = 0, 1, 2, 3 and the wrong answer 3.

#### Java code

```java title="Alternative: count larger earlier values by scanning (too slow at n = 2 · 10^5)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] x = readNumbers(in, n);
        System.out.println(maxLargerBeforeByScanning(x));
    }

    /** max over i of the number of j < i with x[j] > x[i], each count found by a scan. */
    static int maxLargerBeforeByScanning(int[] x) {
        int best = 0;
        for (int i = 0; i < x.length; i++) {
            int larger = 0;
            for (int j = 0; j < i; j++) {
                if (x[j] > x[i]) larger++;         // strictly larger: equal values never swap
            }
            best = Math.max(best, larger);
        }
        return best;
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

**O(n²) always:** n(n − 1)/2 comparisons, about 2 · 10^10 at n = 2 · 10^5, whatever the input. Measured at about 3.6 s for that size: much better than the simulation's 48 s (simple loop, no writes), still over the limit.

#### Space complexity

**O(1) auxiliary** beyond the input array.

#### The bridge to the next approach

> "Now the question is purely 'for each element, how many earlier values are strictly larger', which is a running count over values. If I sweep left to right and keep a structure that answers 'how many values seen so far are at most v' and accepts insertions, each element costs a query and an insert. A Fenwick tree does both in O(log n) once I compress the values to ranks."

### Approach 1: Fenwick tree over compressed values

#### What I say out loud

> "I sweep left to right. Before inserting x_i, I ask the tree how many of the i values already seen are at most x_i; the rest, i minus that, are strictly larger, which is c_i. Then I insert x_i. Values go up to 10^9, so I first replace each value by its rank among the distinct values. O(n log n) overall."

#### Intuition

A Fenwick tree indexed by rank stores how many seen values have each rank, and gives prefix sums in O(log m). "At most x_i" is the prefix up to x_i's rank, which counts equal values on the "not larger" side, exactly what the strict comparison needs.

#### Algorithm

1. Read the array. Copy and sort it, remove duplicates: `sorted[0..m)` holds the m distinct values.
2. `tree = new int[m + 1]`, `best = 0`.
3. For i from 0 to n − 1:
   - `rank` = position of x[i] in `sorted` (binary search) + 1.
   - `atMost` = prefix sum of the tree up to `rank`.
   - `best = max(best, i − atMost)`.
   - Add 1 at `rank`.
4. Print `best`.

#### Why it is correct

- **The count is c_i.** When x[i] is processed, the tree holds exactly x[0..i − 1]: i values. The prefix sum up to x[i]'s rank counts those that are ≤ x[i], so i − atMost counts those strictly larger, which is c_i.
- **The answer is max c_i** by the round argument of the previous rung.
- **Compression keeps order and equality:** equal values get equal ranks and smaller values smaller ranks, so "rank ≤ rank(x[i])" means "value ≤ x[i]".

#### Dry run

Input `5` / `3 2 4 1 4`. Distinct sorted values `1 2 3 4`, so the ranks are 3, 2, 4, 1, 4.

| i | x[i] | rank | Seen values | atMost (seen ≤ x[i]) | c_i = i − atMost | best |
|---|---|---|---|---|---|---|
| 0 | 3 | 3 | none | 0 | 0 | 0 |
| 1 | 2 | 2 | 3 | 0 | 1 | 1 |
| 2 | 4 | 4 | 3, 2 | 2 | 0 | 1 |
| 3 | 1 | 1 | 3, 2, 4 | 0 | 3 | 3 |
| 4 | 4 | 4 | 3, 2, 4, 1 | 4 | 0 | 3 |

Prints `3`.

#### Java code

```java title="Approach 1: Fenwick tree over compressed values"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] x = readNumbers(in, n);

        // Compress values to ranks 1..m so a Fenwick tree of size m can count them.
        int[] sorted = x.clone();
        Arrays.sort(sorted);
        int m = 0;
        for (int i = 0; i < n; i++) {
            if (i == 0 || sorted[i] != sorted[i - 1]) sorted[m++] = sorted[i];
        }

        int[] tree = new int[m + 1];               // Fenwick tree: how many seen values have each rank
        int best = 0;
        for (int i = 0; i < n; i++) {
            int rank = Arrays.binarySearch(sorted, 0, m, x[i]) + 1;
            int atMost = 0;                        // seen values with rank <= rank (that is, <= x[i])
            for (int r = rank; r > 0; r -= r & -r) atMost += tree[r];
            int larger = i - atMost;               // the other i seen values are strictly larger
            best = Math.max(best, larger);
            for (int r = rank; r <= m; r += r & -r) tree[r]++;
        }
        System.out.println(best);
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

**O(n log n):** the sort (the JDK's `Arrays.sort(int[])` implementation note promises O(n log n) on all data sets), then for each element a binary search and two Fenwick walks of O(log m) steps each, with m ≤ n distinct values. Measured at about 0.11 s for the whole program on a reversed array at n = 2 · 10^5.

#### Space complexity

**O(n):** the sorted copy and the tree of m + 1 counters.

#### The bridge to the next approach

> "This works, but I don't need every c_i, only the largest. Is there a quantity a single sort gives me that has the same maximum? Bubble sort is stable, so I know where every element ends up: its position p_i in the stable sorted order. Each element moves left at most one place per round, so it needs at least i − p_i rounds. Maybe the maximum of i − p_i is exactly the answer."

### Approach 2: Largest leftward distance after a stable sort (recommended)

#### What I say out loud

> "Bubble sort is stable, so its final array is the stable sort: by value, ties by original index. Element i ends at p_i. An element moves left at most one place per round, so the answer is at least max(i − p_i). And it is exactly that: the element with the largest c has no smaller element after it, so its displacement i − p_i equals its c. I pack value and index into one `long`, sort the longs, and take the maximum of i − p. One sort, one pass."

#### Intuition

i − p_i is c_i minus the number of later elements that are strictly smaller than x_i (those end in front of it, which pushes its final position right). For the element with the largest c, there can be no later smaller element, because such an element would have an even larger c. So for that element the distance is exactly c, and no element's distance exceeds its c.

#### Algorithm

1. Read the array. Build `key[i] = x[i] · 2^18 + i` as a `long` (2^18 = 262,144 > 2 · 10^5 > every index).
2. Sort `key`. Sorted keys are ordered by value, ties by index: the stable order.
3. For p from 0 to n − 1: i = `key[p] & (2^18 − 1)`; `best = max(best, i − p)`.
4. Print `best` (it starts at 0).

#### Why it is correct

Let p_i be the position of element i in the stable sorted order. Counting the elements that end before it:

p_i = (number of j < i with x_j ≤ x_i) + (number of j > i with x_j < x_i),

because earlier equal values stay before it (stability) and later equal values stay after it. Since i = (number of j < i with x_j ≤ x_i) + c_i,

i − p_i = c_i − s_i, where s_i = the number of j > i with x_j < x_i.

- **No distance exceeds the answer:** s_i ≥ 0, so i − p_i ≤ c_i ≤ max c.
- **Some distance reaches it:** take i with the largest c_i. If some later j had x_j < x_i, every element before i that is larger than x_i is also before j and larger than x_j, and so is x_i itself, giving c_j ≥ c_i + 1, a contradiction. So s_i = 0 and i − p_i = c_i = max c.
- **So max(i − p_i) = max c**, the number of rounds. Since max c ≥ 0, starting `best` at 0 changes nothing, and it is the answer for a sorted array.
- **The key encodes the stable order:** x[i] · 2^18 + i compares first by value (the index part is below 2^18), then by index. The largest key is about 10^9 · 2^18 ≈ 2.6 · 10^14, far below 2^63.

**The 30-second version:** "In one round the scan carries the running maximum; an element with something larger in front gets swapped left by exactly one place, and exactly one larger element passes it. So with c = the number of strictly larger elements in front, every round lowers each positive c by one, and the answer is max c. The element with the largest c has nothing smaller behind it, so its c equals how far it travels left in the stable sorted order. One sort of (value, index) pairs and the maximum of i − p: O(n log n)."

#### Dry run

Input `5` / `3 2 4 1 4`. Pairs (value, index) in sorted order:

| p | value | original i | i − p | best |
|---|---|---|---|---|
| 0 | 1 | 3 | 3 | 3 |
| 1 | 2 | 1 | 0 | 3 |
| 2 | 3 | 0 | −2 | 3 |
| 3 | 4 | 2 | −1 | 3 |
| 4 | 4 | 4 | 0 | 3 |

Prints `3`. On `2 2 1 1` the order is (1, 2), (1, 3), (2, 0), (2, 1), distances 2, 2, −2, −2: prints `2`. Breaking the tie between the two 1s the other way, (1, 3) first, would give 3 − 0 = 3, wrong; that is why the index is part of the key.

#### Java code

```java title="Approach 2: largest leftward distance after a stable sort (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] x = readNumbers(in, n);

        // key = value * 2^18 + index: sorting the keys sorts by value, ties by original index,
        // which is exactly the stable order bubble sort ends in (2^18 > 2 * 10^5 > every index).
        long[] key = new long[n];
        for (int i = 0; i < n; i++) key[i] = ((long) x[i] << 18) | i;
        Arrays.sort(key);

        int best = 0;
        for (int p = 0; p < n; p++) {
            int i = (int) (key[p] & ((1 << 18) - 1));  // original index of the element that ends at p
            best = Math.max(best, i - p);              // how far it travels to the left
        }
        System.out.println(best);
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

**O(n log n):** one sort of n `long`s (the JDK's implementation note for `Arrays.sort(long[])` promises O(n log n) on all data sets) and one linear pass. Measured at about 0.08 s for the whole program on a reversed array at n = 2 · 10^5.

#### Space complexity

**O(n):** the array of n keys.

## 5. Comparison table

n is the array length, R the answer (at most n − 1), m the number of distinct values. Nothing is randomized, so expected and worst case agree.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Alternative: simulate the rounds | O(n · (R + 1)) | O(n²) | O(1) |
| Alternative: count larger earlier values by scanning | O(n²) | O(n²) | O(1) |
| 1. Fenwick tree over compressed values | O(n log n) | O(n log n) | O(n) |
| 2. Largest leftward distance after a stable sort | O(n log n) | O(n log n) | O(n) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Simulate | Needs no insight; a perfect reference for testing | 48 s on a reversed array at the limit | First thing to say; small n; a brute force for random tests |
| Scan for larger earlier values | States the key characterisation in the simplest code | Still quadratic | To check the characterisation by hand |
| 1. Fenwick tree | Gives every c_i, which follow-ups need (Bubble Sort Rounds II) | Compression plus a data structure: more code, more room for off-by-one errors | When you need the individual counts, not only the maximum |
| 2. Stable sort, max distance | Shortest code; one library sort | Needs one more argument (why the maximum distance equals max c) | The answer to give |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2, after explaining the round argument (an element with something larger in front moves left exactly one place per round). Say the characterisation first, because both fast approaches rest on it. If the interviewer doubts the "max distance equals max c" step, fall back to Approach 1, which computes c directly; both are O(n log n).

**Is it optimal?** In the worst case a correct algorithm must look at essentially every value (changing one value can change the answer), so there is an Ω(n) lower bound; I do not claim a matching linear algorithm, and O(n log n) is the standard target. In practice reading the input dominates: 0.08 s at the limit leaves nothing worth optimizing.

Every program on this page, the two slow alternatives included, prints the expected answer on all 3 official CSES tests stored with the site (run on a real JVM, compared token by token).

Stop once the program is O(n log n) with fast input. The risks left are the strict comparison and stability, not speed.

## 7. Interview script: code it and test it

### What I say while coding

> "I read with `BufferedReader` and `StringTokenizer`: 2 · 10^5 numbers through `Scanner` is noticeably slow."

> "I pack value and index into one `long`, so a single `Arrays.sort` on primitives gives the stable order. Sorting `Integer` indices with a comparator would also work, but boxes 2 · 10^5 objects."

> "The shift is 18 bits because 2^18 = 262,144 exceeds the largest index, 199,999. Values are below 2^30, so the key is below 2^48."

> "`best` starts at 0, so a sorted array prints 0 even though every distance i − p is then 0 anyway."

### Testing out loud

**Example `3 2 4 1 4`:** distances 3, 0, −2, −1, 0, prints 3.

**`3 1 2`:** sorted order (1, 1), (2, 2), (3, 0): distances 1, 1, −2, prints 1. The 3 moves two places right in a single round, which costs nothing.

**n = 1:** one key, distance 0, prints 0.

**All equal, say `7 7`:** sorted by index, distances 0 and 0, prints 0. With an unstable tie-break it could print 1.

**`2 2 1 1`:** prints 2 (traced in section 4).

**Reversed `5 4 3 2 1`:** the 1 travels from index 4 to 0: prints 4 = n − 1.

**`2 3 4 5 1`:** the 1 travels 4 places: prints 4, matching four rounds of simulation.

**n = 2 · 10^5, reversed:** prints 199,999; measured 0.08 s.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 3 min | What a round is; strict comparison; 0 for a sorted array |
| Hand simulation | 5 min | The example round by round, tracking the 1 |
| Characterisation and proof | 10 min | Carried maximum; one place left per round; answer = max c |
| Fast method | 5 min | Fenwick tree, or the stable-sort distance and why it matches |
| Code | 8 min | Fast input, keys, one pass |
| Test | 4 min | Sorted, all equal, `2 2 1 1`, reversed |

Most of the time belongs to the characterisation; the code is short once it is clear. If stuck, simulate `2 3 4 5 1` and `5 1 2 3 4` and ask why one takes four rounds and the other one.

## 9. Interviewer challenges

### About correctness

#### Why can an element move left at most one place per round, when it can move right many places?

**What they are testing:** whether you understand the mechanics of one scan rather than a memorised result.

**How to reason:** follow the scan. Movement left happens only by being swapped with the left neighbour at the moment the scan compares that pair.

**What I say:** "The scan visits each pair once, left to right. An element is compared with its left neighbour once; if it swaps, it lands one place to the left, and the scan has already moved past that pair, so it is never compared with the new left neighbour in this round. Moving right is different: the element that wins a comparison is carried forward and compared again at its new position, so the maximum can cross the whole array in one round."

**Nuance:** this asymmetry is the whole problem. Run the scan right to left (cocktail shaker's backward pass) and the roles of small and large values swap.

#### Why exactly one, not at most one? Couldn't an element with a larger value in front sometimes stay put?

**What they are testing:** the other half of the proof.

**How to reason:** identify what sits to the left of the element when the scan reaches it.

**What I say:** "When the scan reaches v, its left neighbour holds the maximum of everything that was in front of v at the start of the round, because the scan carries the running maximum. If anything in front is strictly larger than v, that maximum is, so they swap. So every element with c > 0 moves left exactly one place, and its c drops by exactly one: only the carried maximum passed it."

**Nuance:** with repeated values the carried element may change identity between equal values (a carried 4 stops at an equal 4 and the second 4 continues), but the carried *value* is still the running maximum, which is all the argument uses.

#### How do you know max(i − p_i) cannot be smaller than max c?

**What they are testing:** whether you can justify the shortcut in Approach 2 instead of trusting it.

**How to reason:** write i − p_i = c_i − s_i and look at the element maximising c.

**What I say:** "If the element with the largest c had a smaller element after it, that later element would have every one of those larger elements in front of it, plus our element: its c would be bigger. So the maximiser has s = 0 and its distance equals its c."

**Nuance:** the equality holds only for the maximum. Individual elements can have c_i much larger than i − p_i (in `3 1 2`, the 1 has c = 1 and distance 1, but in `3 2 1`, the 2 has c = 1 and distance 0, because the 1 behind it ends in front of it).

### About implementation

#### Why not sort `Integer` indices with a comparator?

**What they are testing:** awareness of boxing costs and sort stability in Java.

**How to reason:** the documentation of `Arrays.sort(T[], Comparator)` guarantees a stable sort, so a comparator by value keeps ties in index order. It works; the question is cost.

**What I say:** "It is correct, because the object sort is stable. But it allocates 2 · 10^5 `Integer`s and calls a comparator O(n log n) times. Packing into a `long` gives the same order with a primitive sort and no allocation per element."

**Nuance:** for `int[]` and `long[]` the implementation note describes a dual-pivot quicksort, which is not stable, but stability is irrelevant for primitives because equal keys are indistinguishable. Here the index inside the key makes every key distinct anyway.

## 10. Follow-up questions the interviewer might ask

**"Print the array after k rounds."**
That is [[cses-bubble-sort-rounds-ii|Bubble Sort Rounds II]]. The same c values decide it: an element with c ≥ k has moved left exactly k places; everything else is settled and fills the remaining positions in sorted order. A size-k min-heap gives the answer even more directly. O(n log n).

**"Count the total number of swaps bubble sort makes."**
Every swap fixes exactly one inversion (a pair i < j with x_i > x_j), so the total is the inversion count, the sum of all c_i: same Fenwick sweep, summed in a `long` (up to about 2 · 10^10). O(n log n). See [[cses-sorting-methods|Sorting Methods]].

**"How many rounds does the reverse scan (right to left, swapping wrong pairs) need?"**
For a right-to-left scan the roles flip: the minimum is carried left in one round and large values move right one place per round, so the answer is the maximum over elements of the number of later elements strictly smaller. O(n log n) by the same methods.

**"Print the number of rounds for every prefix of the array."**
c_i depends only on the elements before i, so the prefix of length t needs max(c_0, …, c_{t−1}) rounds. Approach 1 already computes c_i left to right: print the running maximum after each element. O(n log n); the stable-sort shortcut does not adapt as easily, because adding elements shifts the sorted positions.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Answering with the largest distance any element travels**, in either direction. Rightward travel is free (the 5 in `5 1 2 3 4` travels 4 places in one round); only leftward travel limits the rounds.
- **Answering with the inversion count.** That is the number of swaps, not rounds: `3 2 1` has 3 inversions and needs 2 rounds.
- **Counting the final, swap-free scan as a round.** The example prints 3, not 4.
- **Assuming distinct values.** The statement allows repeats, and they never swap.

### Implementation mistakes

> [!MISTAKE] Counting "larger or equal" instead of "strictly larger"
> With `>=`, the counts for `2 2 1 1` become 0, 1, 2, 3 and the program prints 3 instead of 2 (verified by making the change in the scanning version). Equal neighbours are not in the wrong order, so they never pass each other.

- **An unstable tie-break in Approach 2.** Sorting the pairs with equal values in reverse index order gives `2 2 1 1` a distance of 3. Put the index in the key, or use a stable sort.
- **A key that does not fit.** `x[i] << 18` in `int` overflows; cast to `long` first: `((long) x[i] << 18) | i`.
- **Building a Fenwick tree indexed by value.** Values reach 10^9; compress to ranks first.
- **Reading with `Scanner`** is slow at 2 · 10^5 tokens; use `BufferedReader` and `StringTokenizer`.

## 12. Pattern recognition

**The pattern:** analysing a process instead of running it. Track one element through one step of the process, find a quantity that changes by a fixed amount each step (here, the number of strictly larger elements in front drops by exactly one per round), and the number of steps falls out as a maximum over elements. The quantity itself is an inversion-style count, computed with a Fenwick tree or a sort.

**Signals in the problem statement:**

- "How many rounds / steps does this process take" with n up to 2 · 10^5: simulating is quadratic, so look for a per-element invariant.
- A sorting process with adjacent swaps: think inversions and "larger elements in front".
- Repeated values and a "wrong order" definition: decide strict versus non-strict, which is stability.

**Related problems in this list:**

- [[cses-bubble-sort-rounds-ii|Bubble Sort Rounds II]]: the same process, asking for the array after k rounds.
- [[cses-sorting-methods|Sorting Methods]]: the cost of several sorting processes, bubble sort's being the inversion count.
- [[cses-swap-round-sorting|Swap Round Sorting]]: another "how many rounds to sort" question, with arbitrary disjoint swaps per round.
- [[cses-collecting-numbers|Collecting Numbers]]: count left-to-right passes of a different process from positions alone.
- [[cses-list-removals|List Removals]]: a Fenwick tree answering order questions in O(log n).

**Takeaway:** when a process moves elements a bounded amount per step, find the per-element quantity that each step decreases by exactly one; the number of steps is its maximum.

## 13. 60-second revision card

**Key insight:** a round carries the running maximum to the right. An element with a strictly larger element in front moves left exactly one place, and exactly one larger element passes it. So with c_i = the number of earlier, strictly larger values, the answer is max c_i, which equals the largest leftward distance i − p_i in the stable sorted order.

**Invariant:** after r rounds, element i has max(0, c_i − r) strictly larger elements in front of it.

**Complexity:** O(n log n) time (one sort), O(n) space.

**Code skeleton:**

```java title="Bubble Sort Rounds I, stable-sort distance"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        long[] key = new long[n];
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < n; i++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(in.readLine());
            key[i] = (Long.parseLong(st.nextToken()) << 18) | i;   // value, then index: stable order
        }
        Arrays.sort(key);
        int best = 0;
        for (int p = 0; p < n; p++) best = Math.max(best, (int) (key[p] & ((1 << 18) - 1)) - p);
        System.out.println(best);
    }
}
```

**Main traps:**

- Strictly larger: equal values never swap (`2 2 1 1` → 2).
- Ties in index order; `long` keys.
- A sorted array prints 0; the empty last scan is not a round.

**What to say in one breath:** "Each round moves every element that has something strictly larger in front of it exactly one place left, and nothing moves left faster, so the answer is the largest number of strictly larger elements in front of any element. That equals the largest leftward distance in the stable sorted order: sort (value, index) pairs, take max of i − p. O(n log n)."
