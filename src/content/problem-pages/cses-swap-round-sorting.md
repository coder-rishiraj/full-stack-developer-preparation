---
problemId: cses-swap-round-sorting
title: Swap Round Sorting
source: cses
sourceUrl: https://cses.fi/problemset/task/1698
difficulty: hard
patterns: [additional, permutation-cycles, construction, lower-bound-and-construction]
relatedLessons: [a9-permutations, a6-construction, a8-bfs, a1-java-syntax-competitive, a14-brute-force-first, a14-deriving-optimization, a14-edge-cases]
companies: []
timeToSolve: 45
---

## 1. Problem restatement

You get a permutation of 1, 2, …, n in an array. You sort it in **rounds**. In one round you choose any number of pairs of positions, where no position appears in two pairs, and swap every chosen pair at the same time. Find the minimum number of rounds that sorts the array, and print a way to do it: first the number of rounds k, then for each round the number of swaps on one line followed by one line per swap with its two positions (1-based). Any valid answer with the minimum k is accepted. This is a whole program reading standard input and writing standard output.

**Example**

- Input: `5`, then `5 2 1 3 4`
- One correct output: `2`; then `2`, `1 3`, `4 5` (round 1); then `1`, `3 5` (round 2).
- Why: round 1 swaps positions 1 and 3 and positions 4 and 5, giving `1 2 5 4 3`; round 2 swaps positions 3 and 5, giving `1 2 3 4 5`. One round is not enough here, so 2 is the minimum.

**What the problem statement guarantees**

- 1 ≤ n ≤ 2 · 10^5.
- The array is a permutation of 1..n.
- The pairs in one round are distinct (no position is used twice in a round). Any valid solution is accepted.
- Time limit 1 second, memory limit 512 MB.

## 2. Practice first: try it before reading on

If you have not solved this yourself yet, stop here. Two questions hide in it: what is the smallest number of rounds, and how do you construct them for a permutation of 2 · 10^5 elements? Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 45 minutes.
2. By hand, find the fewest rounds for `2 1`, `2 3 1`, `2 3 4 1` and `2 3 4 5 6 1`.
3. Decide exactly which arrays can be sorted in one round, and prove it.
4. Guess the largest answer over all arrays, then try to prove the guess by construction.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> Follow "the value at position i belongs at position x, the value at x belongs at …" until you come back to i. What does the array look like in terms of these loops, and what does one round of disjoint swaps look like in the same terms?

> [!HINT] Hint 2: the kind of tool you need
> One round of disjoint swaps, done twice, undoes itself. So one round can only fix arrays whose loops have length at most 2. For a longer loop, picture its positions around a circle: every value must move one step around it. Which two "mirror" operations, done one after the other, turn a circle by one step?

> [!HINT] Hint 3: almost the whole plan
> The answer is 0 if sorted, 1 if every loop has length 1 or 2, else 2. For a loop a0 → a1 → … → a(k−1) (the value at a(j) belongs at a(j+1)), round 1 swaps a(j) with a(k−j) for 1 ≤ j < k − j. After applying round 1, every loop has length at most 2, so round 2 swaps i with the value at i wherever that value is greater than i. Build the output in one buffer.

**Check yourself before revealing the walkthrough**

- [ ] I can prove that a loop of length 3 cannot be fixed in one round
- [ ] I can show two rounds always suffice, even for one loop of length 200,000
- [ ] My program prints 1 round, not 2, when every loop has length at most 2, and 0 for a sorted array
- [ ] No position appears twice within one of my rounds, and no swap pairs a position with itself

## 3. Interview script: understand the problem (≈3 min)

Treat it as if an interviewer had posed it. The first thing to pin down is what a round is allowed to do.

**Me:** A round is a set of swaps with no position shared, done simultaneously. Since the pairs are disjoint, the order inside a round doesn't matter. I want the fewest rounds, and I must print them.

**Interviewer:** Yes.

**Me:** Can a round contain zero swaps? And can a swap pair a position with itself?

**Interviewer:** Pairs are of two different positions. An empty round would never be part of a minimum answer anyway.

**Me:** Right: removing an empty round keeps the array sorted and lowers k. Output format: k on the first line; then for each round its number of swaps on a line and each swap as "i j" on its own line. Any valid answer is accepted?

**Interviewer:** Any valid answer with the minimum number of rounds.

**Me:** Then I'll prove the minimum and construct it. A quick check of the example: positions 1 to 5 hold 5, 2, 1, 3, 4. Position 1 holds 5, which belongs at position 5; position 5 holds 4, which belongs at 4; position 4 holds 3; position 3 holds 1, which belongs at 1. So positions 1, 5, 4, 3 form one loop of length 4, and position 2 is fine. The expected answer is 2 rounds.

**Me:** Sizes: n up to 2 · 10^5, so I need about O(n), and the output can be about n lines, so I'll build it in one `StringBuilder`.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 2 · 10^5 | Search over arrangements is out; the answer must come from the structure of the permutation, in O(n). |
| The array is a permutation of 1..n | The value at position i has a single home, position value; the "belongs at" arrows form loops. |
| Any valid answer is accepted | I can pick the construction that is easiest to prove. |
| Time limit 1 s | Fast input and one buffered output of up to about 2 · 10^5 swap lines. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| A swap uses two different positions | My construction must never emit "i i". |
| No position appears twice in one round | Each round is a set of disjoint pairs; my checker tests this. |
| Output: k, then per round a count line and one line per swap | I collect each round's swaps and their count before printing. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The two positions of a swap may be printed in either order | A swap of i and j is the same as a swap of j and i; the statement's example prints the smaller first, which I do not rely on. |

### Edge cases I will keep in mind

- n = 1, or any sorted array: print `0` and nothing else.
- Only loops of length 2, such as `2 1` or the reversed array: exactly one round.
- One loop of length 3 (`2 3 1`): the smallest case needing two rounds.
- One loop through all 2 · 10^5 positions: still two rounds.
- Even loop length: the middle position of the first round's mirror is paired with itself unless the loop bound is strict.

## 4. Think out loud: from first idea to best solution

Like other "minimum number of operations" problems, this one needs two halves: a **lower bound** (fewer rounds cannot work) and a **construction** that meets it. I start from the definition, use it to discover the answer on small cases, and then prove and build that answer directly.

### Alternative: breadth-first search where one step is a whole round (exponential, n up to about 8)

#### What I say out loud

> "The definition first: a round is any non-empty set of disjoint swaps, so the arrangements are nodes, each possible round is an edge, and I want the shortest path to sorted. BFS gives the minimum and the rounds themselves, if I store how I reached each arrangement. It explodes quickly, but it will tell me the true answers for small n, which is what I need to guess the pattern."

#### Intuition

All rounds cost the same, so the fewest rounds is a shortest path in an unweighted graph, which is exactly what breadth-first search finds. Storing, for each arrangement, its predecessor and the round that led to it lets me rebuild the rounds once the sorted arrangement is reached.

#### Algorithm

1. Generate every non-empty set of disjoint pairs of positions (all matchings), by recursion: the first free position either stays out or pairs with a later free position.
2. BFS from the input arrangement. For each arrangement taken from the queue: if it is sorted, walk the predecessor links back to the start and print the rounds; otherwise apply every matching, and record each new arrangement with its predecessor and the matching used.

#### Why it is correct

BFS takes arrangements from the queue in order of their distance from the start, and each arrangement is recorded the first time it is reached, from a predecessor at the smallest possible distance. So when the sorted arrangement is taken from the queue, its recorded path has the fewest rounds, and every round on it is a set of disjoint pairs by construction. A path always exists, since any permutation can be sorted by single swaps.

#### Dry run

The example `5 2 1 3 4`. From the start, no single round reaches `1 2 3 4 5` (none of its 25 one-round neighbours is sorted). Among the second level, the program's run reaches the sorted array through round 1 = {3 5}, giving `5 2 4 3 1`, then round 2 = {1 5, 3 4}. It prints `2`, `1`, `3 5`, `2`, `1 5`, `3 4`.

Running the BFS on every permutation of up to 7 elements shows a striking pattern: the answer is never more than 2. It is 0 for the sorted array, 1 exactly when every loop has length 1 or 2, and 2 otherwise, even for a single loop through all 7 positions.

#### Java code

```java title="Alternative: BFS where one step is a round (exponential)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] x = readNumbers(in, n);
        List<int[][]> rounds = roundsByBfs(x);
        StringBuilder out = new StringBuilder();
        out.append(rounds.size()).append('\n');
        for (int[][] round : rounds) {
            out.append(round.length).append('\n');
            for (int[] swap : round) {
                out.append(swap[0] + 1).append(' ').append(swap[1] + 1).append('\n');
            }
        }
        System.out.print(out);
    }

    /** Breadth-first search where one step is one round: any non-empty set of disjoint swaps. */
    static List<int[][]> roundsByBfs(int[] x) {
        List<int[][]> rounds = new ArrayList<>();
        matchings(x.length, 0, new boolean[x.length], new ArrayList<>(), rounds);
        int[] sorted = x.clone();
        Arrays.sort(sorted);
        String goal = Arrays.toString(sorted);
        Map<String, String> parent = new HashMap<>();      // arrangement -> arrangement before it
        Map<String, int[][]> via = new HashMap<>();        // arrangement -> round that reached it
        ArrayDeque<int[]> queue = new ArrayDeque<>();
        parent.put(Arrays.toString(x), null);
        queue.add(x);
        while (!queue.isEmpty()) {
            int[] a = queue.poll();
            String key = Arrays.toString(a);
            if (key.equals(goal)) {                        // first time seen = fewest rounds
                List<int[][]> path = new ArrayList<>();
                for (String at = key; parent.get(at) != null; at = parent.get(at)) path.add(0, via.get(at));
                return path;
            }
            for (int[][] round : rounds) {
                int[] b = a.clone();
                for (int[] s : round) {
                    b[s[0]] = a[s[1]];
                    b[s[1]] = a[s[0]];
                }
                String next = Arrays.toString(b);
                if (!parent.containsKey(next)) {
                    parent.put(next, key);
                    via.put(next, round);
                    queue.add(b);
                }
            }
        }
        throw new IllegalStateException("sorted order not reachable");
    }

    /** Adds every non-empty set of disjoint pairs of indices 0..n-1 to out. */
    static void matchings(int n, int from, boolean[] used, List<int[]> pairs, List<int[][]> out) {
        int i = from;
        while (i < n && used[i]) i++;
        if (i == n) {
            if (!pairs.isEmpty()) out.add(pairs.toArray(new int[0][]));
            return;
        }
        used[i] = true;
        matchings(n, i + 1, used, pairs, out);             // i takes part in no swap
        for (int j = i + 1; j < n; j++) {
            if (used[j]) continue;
            used[j] = true;
            pairs.add(new int[] {i, j});
            matchings(n, i + 1, used, pairs, out);         // i swaps with j
            pairs.remove(pairs.size() - 1);
            used[j] = false;
        }
        used[i] = false;
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

**O(n! · M(n) · n)**, where M(n) is the number of non-empty matchings of n positions (25 for n = 5, 231 for n = 7, 763 for n = 8; it grows faster than any exponential cⁿ). Each of up to n! arrangements tries every matching, and applying one and building its key costs O(n). Measured on my machine (JDK 26), a 7-cycle takes 0.25 s and an 8-cycle 4.6 s. It passes the nine official CSES tests stored with the site (all n ≤ 3), but n = 2 · 10^5 is out of the question.

#### Space complexity

**O(n! · n)** for the visited map and predecessor links, plus O(M(n) · n) for the list of matchings.

#### The bridge to the next approach

> "The BFS says the answer is always 0, 1 or 2, decided by loop lengths. Before trusting that, here is the tempting greedy I'd have tried instead: each round, in every loop, swap the first two positions, the next two, and so on, putting one value home per pair. That's valid but it only halves each loop per round, so a loop of length k takes about log₂ k rounds: 3 rounds for a 5-cycle (the BFS says 2) and 18 for a 200,000-cycle. Placing values home quickly is the wrong goal. I need to prove why 2 is always enough, and the proof should give me the construction."

### Approach 1: Mirror each loop in round 1, then read round 2 off the array (recommended)

#### What I say out loud

> "Lower bound first. A round of disjoint swaps, applied twice, undoes itself. If one round sorts the array, then that round is exactly the rearrangement the array needs, so the array's loops all have length 1 or 2. So any loop of length 3 or more forces at least 2 rounds. For the upper bound, put a loop's positions on a circle: every value must move one step around it, a rotation. A rotation is two mirror images in a row. So round 1 mirrors each long loop; after it, every remaining loop has length at most 2, and round 2 just swaps each remaining pair."

#### Intuition

Write a loop as positions a0, a1, …, a(k−1), where the value at a(j) belongs at a(j+1) (indices taken mod k). Sorting this loop means moving every value one step forward around the circle. Think of a regular k-sided polygon: turning it by one step is the same as flipping it across one axis and then across a neighbouring axis. Each flip is a set of disjoint swaps (positions opposite each other across the axis), so each flip is one round. Every loop is mirrored at the same time in round 1, and all loops get their second mirror in round 2.

#### Algorithm

1. Read p[1..n], where p[i] is the value at position i.
2. Round 1: for each position not yet seen, walk its loop a0 = start, a(t+1) = p[a(t)], collecting the positions. For j = 1, 2, … while j < k − j, record the swap (a(j), a(k−j)) and apply it to p right away (the loop has been fully collected, and these positions belong to no other loop).
3. Round 2: for each i with p[i] > i, record the swap (i, p[i]).
4. If round 1 is non-empty, print 2 rounds. Else, if round 2 is non-empty, print round 2 as the single round. Else print `0`.

#### Why it is correct

- **Lower bound: one round sorts only arrays whose loops have length ≤ 2.** Let r be the rearrangement a round performs. Because its swaps are disjoint, doing r twice puts everything back. If r sorts the array, then r is exactly the inverse of the array's rearrangement, so the array's rearrangement also undoes itself when done twice. Then every position i with value v has the value i at position v: each loop has length 1 or 2. So if some loop has length ≥ 3, at least 2 rounds are needed. And 0 rounds works only for a sorted array.
- **Round 1 is valid.** Within one loop, the pairs (a(j), a(k−j)) for 1 ≤ j < k − j use distinct indices: j runs over 1..⌈k/2⌉ − 1 and k − j over the other side, never meeting (the strict `j < k − j` excludes the middle index of an even loop, which would pair a position with itself). Different loops use different positions.
- **After round 1, every loop has length ≤ 2.** Before round 1, position a(j) holds the value a(j+1). Round 1 moves the content of a(j) to a(−j) (for j = 0, and for the middle of an even loop, it stays, which is the same formula). So afterwards position a(−j) holds a(j+1); writing i = −j, position a(i) holds a(1−i). Then position a(1−i) holds a(1−(1−i)) = a(i). So positions a(i) and a(1−i) hold each other's homes: a 2-cycle, or a fixed point when they coincide.
- **Round 2 is valid and finishes.** For every i with p[i] ≠ i, p[p[i]] = i, so the pairs {i, p[i]} are disjoint, and taking only p[i] > i lists each pair once. Swapping every pair puts both values home.
- **Minimum.** If some loop has length ≥ 3, round 1 is non-empty (k ≥ 3 gives j = 1 < k − 1) and the answer 2 meets the lower bound. If not, round 1 is empty and the array was untouched: round 2 is exactly the 2-cycles, one round, which is minimal for an unsorted array. If both are empty, the array is sorted: 0.

**The 30-second version:** "One round is a self-undoing rearrangement, so it can only sort arrays whose loops have length at most two; otherwise at least two rounds. Two always suffice: a loop needs every value moved one step around a circle, and a rotation is two reflections. Round 1 reflects each long loop; after that every loop has length at most two, so round 2 swaps each remaining pair."

#### Dry run

The example `5 2 1 3 4`:

| Step | State | Recorded |
|---|---|---|
| Loop from position 1 | 1 → 5 → 4 → 3 → back to 1 (position 1 holds 5, position 5 holds 4, …): a = 1, 5, 4, 3, k = 4 | |
| Round 1, j = 1 (1 < 3) | swap positions a(1) = 5 and a(3) = 3: p = `5 2 4 3 1` | `5 3` |
| j = 2 | 2 < 2 is false: stop (a(2) would pair with itself) | |
| Loop from position 2 | k = 1, nothing to do | |
| Round 2 | p[1] = 5 > 1: `1 5`; p[3] = 4 > 3: `3 4`; p[4] = 3, p[5] = 1 are smaller than their positions | `1 5`, `3 4` |

Output: `2`, `1`, `5 3`, `2`, `1 5`, `3 4`. Check: `5 2 1 3 4` → swap 5, 3 → `5 2 4 3 1` → swap 1, 5 and 3, 4 → `1 2 3 4 5`.

A single loop through all positions, `2 3 4 5 6 7 1` (k = 7, a = 1, 2, …, 7):

| Round 1 swap | Array after |
|---|---|
| start | `2 3 4 5 6 7 1` |
| 2 7 | `2 1 4 5 6 7 3` |
| 3 6 | `2 1 7 5 6 4 3` |
| 4 5 | `2 1 7 6 5 4 3` |

Now positions (1, 2), (3, 7), (4, 6) hold each other's values and 5 is home, so round 2 is `1 2`, `3 7`, `4 6`. The BFS finds exactly the same answer for this input.

#### Java code

```java title="Approach 1: mirror each loop, then read round 2 off the array (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] p = new int[n + 1];                          // p[i] = value at position i, 1-based
        StringTokenizer st = new StringTokenizer("");
        for (int i = 1; i <= n; i++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(in.readLine());
            p[i] = Integer.parseInt(st.nextToken());
        }

        // Round 1: reverse every cycle of length >= 3 (swap its j-th and (k-j)-th positions).
        StringBuilder first = new StringBuilder();
        int firstCount = 0;
        boolean[] seen = new boolean[n + 1];
        int[] cycle = new int[n];
        for (int start = 1; start <= n; start++) {
            if (seen[start]) continue;
            int k = 0;
            for (int at = start; !seen[at]; at = p[at]) {   // the value at 'at' belongs at p[at]
                seen[at] = true;
                cycle[k++] = at;
            }
            for (int j = 1; j < k - j; j++) {
                int a = cycle[j], b = cycle[k - j];
                first.append(a).append(' ').append(b).append('\n');
                firstCount++;
                int t = p[a];                               // apply the swap now; this cycle is done
                p[a] = p[b];
                p[b] = t;
            }
        }

        // What is left is all 2-cycles: one more round swaps each pair into place.
        StringBuilder second = new StringBuilder();
        int secondCount = 0;
        for (int i = 1; i <= n; i++) {
            if (p[i] > i) {                                 // p[p[i]] == i, so (i, p[i]) is a 2-cycle
                second.append(i).append(' ').append(p[i]).append('\n');
                secondCount++;
            }
        }

        StringBuilder out = new StringBuilder();
        if (firstCount > 0) {
            out.append(2).append('\n');
            out.append(firstCount).append('\n').append(first);
            out.append(secondCount).append('\n').append(second);
        } else if (secondCount > 0) {
            out.append(1).append('\n');
            out.append(secondCount).append('\n').append(second);
        } else {
            out.append(0).append('\n');
        }
        System.out.print(out);
    }
}
```

#### Time complexity

**O(n):** each position is visited once in the loop walk, round 1 applies at most n/2 swaps, and round 2 is one pass. The output has at most n swap lines. Measured on my machine (JDK 26), including JVM start, 0.16 s on a random permutation of 2 · 10^5 and 0.12 s on a single 2 · 10^5-cycle.

#### Space complexity

**O(n):** `p`, `seen`, the loop buffer and the two output buffers (which hold the output itself).

#### The bridge to the next approach

> "This mutates the array and relies on 'after round 1 everything is a 2-cycle' to read round 2. That is proved, but if the interviewer wants the second round written down directly, the same reflection picture gives it: round 2 is the mirror that sends a(i) to a(1−i), so it pairs a(0) with a(1), a(2) with a(k−1), a(3) with a(k−2), and so on. Then I can emit both rounds in the same pass over the loops without touching the array."

### Approach 2: Both mirrors from index formulas, one pass over the loops

#### What I say out loud

> "For each loop a0..a(k−1) with k ≥ 2: the first mirror pairs a(j) with a(k−j) for 1 ≤ j < k − j; the second pairs a(0) with a(1), then a(1+t) with a(k−t) for t = 1, 2, … while 1 + t < k − t. Content at a(j) goes to a(−j), then to a(1+j), exactly one step forward. A 2-cycle has an empty first mirror and its second mirror is just the swap."

#### Intuition

The same two reflections as Approach 1, but the second one is written as a formula instead of being read off the array. Reflection 1 is j ↦ −j and reflection 2 is i ↦ 1 − i (indices mod k). Their composition is j ↦ 1 − (−j) = j + 1, the rotation that every loop needs.

#### Algorithm

1. Read p[1..n].
2. For each unseen position, collect its loop a(0..k−1). Skip k = 1.
3. Round 1: for j = 1 while j < k − j, record (a(j), a(k−j)).
4. Round 2: record (a(0), a(1)); for t = 1 while 1 + t < k − t, record (a(1+t), a(k−t)).
5. Print as in Approach 1: 2 rounds if round 1 is non-empty, else 1 round if round 2 is non-empty, else 0.

#### Why it is correct

- **Round 2 is a valid set of pairs.** Its pairs are {i, 1 − i mod k} for the indices i in 0..k−1 with i ≠ 1 − i: the loop lists (0, 1), then (2, k − 1), (3, k − 2), … and stops when the two ends meet or cross, so no index is used twice and none is paired with itself (for odd k, index (k + 1)/2 is its own mirror and is left out). Different loops use different positions.
- **The two rounds sort every loop.** The value at a(j) belongs at a(j+1). Round 1 moves it to a(−j) (staying put when −j ≡ j). Round 2 moves the content of a(i) to a(1 − i), so it goes from a(−j) to a(1 + j). Every value reaches its home.
- **Minimum.** The lower bound is the same as in Approach 1: if a loop has length ≥ 3, round 1 contains (a(1), a(k−1)), so it is non-empty and 2 rounds are printed. If all loops have length ≤ 2, round 1 is empty and round 2 swaps exactly the 2-cycles: 1 round. If there is no loop of length ≥ 2: sorted, 0.

#### Dry run

The example `5 2 1 3 4`, loop a = 1, 5, 4, 3 (k = 4):

| Rule | Pairs (as indices) | Positions printed |
|---|---|---|
| Round 1, j = 1 (1 < 3) | (1, 3) | `5 3` |
| Round 1, j = 2 | 2 < 2 false, stop | |
| Round 2, first pair | (0, 1) | `1 5` |
| Round 2, t = 1 (2 < 3) | (2, 3) | `4 3` |
| Round 2, t = 2 | 3 < 2 false, stop | |

Output: `2`, `1`, `5 3`, `2`, `1 5`, `4 3`. Following one value: position a(1) = 5 holds the value 4 = a(2). Round 1 moves it to a(−1) = a(3), position 3; round 2 moves the content of a(3) to a(1 − 3) = a(2), position 4, its home.

#### Java code

```java title="Approach 2: both reflections from index formulas"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] p = new int[n + 1];                          // p[i] = value at position i, 1-based
        StringTokenizer st = new StringTokenizer("");
        for (int i = 1; i <= n; i++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(in.readLine());
            p[i] = Integer.parseInt(st.nextToken());
        }

        // A cycle a0 -> a1 -> ... -> a(k-1) (the value at a(j) belongs at a(j+1)) needs every
        // value moved one step on. Reflection 1 sends a(j) to a(-j), reflection 2 sends a(j) to
        // a(1-j); together a(j) -> a(-j) -> a(1+j).
        StringBuilder first = new StringBuilder();
        StringBuilder second = new StringBuilder();
        int firstCount = 0, secondCount = 0;
        boolean[] seen = new boolean[n + 1];
        int[] a = new int[n];
        for (int start = 1; start <= n; start++) {
            if (seen[start]) continue;
            int k = 0;
            for (int at = start; !seen[at]; at = p[at]) {
                seen[at] = true;
                a[k++] = at;
            }
            if (k == 1) continue;                           // already in place
            for (int j = 1; j < k - j; j++) {               // reflection 1: a(j) <-> a(k-j)
                first.append(a[j]).append(' ').append(a[k - j]).append('\n');
                firstCount++;
            }
            second.append(a[0]).append(' ').append(a[1]).append('\n');
            secondCount++;                                  // reflection 2: a(0) <-> a(1), and
            for (int t = 1; 1 + t < k - t; t++) {           // a(1+t) <-> a(k-t)
                second.append(a[1 + t]).append(' ').append(a[k - t]).append('\n');
                secondCount++;
            }
        }

        StringBuilder out = new StringBuilder();
        if (firstCount > 0) {                               // some cycle has length >= 3
            out.append(2).append('\n');
            out.append(firstCount).append('\n').append(first);
            out.append(secondCount).append('\n').append(second);
        } else if (secondCount > 0) {                       // only 2-cycles: one round
            out.append(1).append('\n');
            out.append(secondCount).append('\n').append(second);
        } else {
            out.append(0).append('\n');
        }
        System.out.print(out);
    }
}
```

#### Time complexity

**O(n):** one walk over all loops, with at most k/2 pairs per loop per round. Measured on my machine (JDK 26), including JVM start, 0.11 s on a random permutation of 2 · 10^5 and 0.10 s on a single 2 · 10^5-cycle. Both O(n) programs pass the nine official CSES tests stored with the site (checked for validity and minimum k, since any valid answer is accepted).

#### Space complexity

**O(n):** `p`, `seen`, the loop buffer and the two output buffers.

## 5. Comparison table

n is the length of the permutation; M(n) is the number of non-empty sets of disjoint pairs of n positions. Nothing is randomized, so expected and worst case agree.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| BFS, one step = one round | O(n! · M(n) · n) | O(n! · M(n) · n) | O(n! · n) |
| Halve every loop each round (prose only; not minimal) | O(n log n) | O(n log n) | O(n) |
| 1. Mirror, then read round 2 off the array | O(n) | O(n) | O(n) |
| 2. Both mirrors by formula | O(n) | O(n) | O(n) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| BFS | Exact by definition; found the 0/1/2 pattern | Only n ≤ 8 or so | Discovering and checking the rule |
| Halve every loop | Easy to invent | Wrong: ⌈log₂ k⌉ rounds for a k-loop, not 2 | Never; it is the trap |
| 1. Mirror, then read | Only one index formula; round 2 needs no derivation of its own | Mutates the array; needs the "all 2-cycles after round 1" proof | The answer to give |
| 2. Both mirrors by formula | No mutation; both rounds explicit | A second index formula with its own stopping condition | When asked to describe both rounds without simulation |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 1, after the lower bound. It is O(n), which is optimal up to constants: in the worst case the output alone has about n swap lines, so Ω(n) time is needed just to print it.

**Approach 2** is equally fast and fine to present if you prefer explicit formulas; the risk is the second loop bound. Approach 1 avoids it, and its round 2 is self-evidently valid once you know p[p[i]] = i.

Stop once the two-sided argument (one round only fixes loops of length ≤ 2; two reflections rotate any loop) is clear and the edge cases (0 and 1 rounds) are handled. There is nothing further to optimise.

## 7. Interview script: code it and test it

### What I say while coding

> "1-based arrays, so positions and values match: p[i] is the value at i, and it belongs at position p[i]."

> "I collect a whole loop before swapping anything, so that the walk is not disturbed by the swaps. The swaps only touch this loop's positions, which are already marked seen."

> "Strict `j < k − j`: for an even loop, j = k/2 would pair a position with itself."

> "Round 2 lists a pair only from its smaller end, `p[i] > i`, so each pair appears once."

> "The answer has three cases: 2 rounds if round 1 did anything, 1 round if only 2-cycles existed, 0 if sorted. Never print an empty round."

### Testing out loud

**The example `5 2 1 3 4`:** one loop of 4; round 1 `5 3`; round 2 `1 5`, `3 4`. Valid and minimal (traced above).

**n = 1, `1`:** nothing to do, prints `0`.

**`2 1`:** one 2-cycle. Round 1 has no pairs (1 < 1 is false), so it prints `1`, `1`, `1 2`.

**`2 3 1`:** loop 1, 2, 3; round 1 `2 3` gives `2 1 3`; round 2 `1 2`. Prints 2 rounds; one round is impossible since the loop has length 3.

**Reversed, n = 2 · 10^5:** all 2-cycles (i with n + 1 − i), one round of 100,000 swaps.

**Single loop of 2 · 10^5:** round 1 has 99,999 swaps, round 2 has 100,000; two rounds.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify, small cases | 5 min | Rounds, format, `2 1`, `2 3 1`, the example |
| Lower bound | 5 min | One round undoes itself, so it only fixes loops of length ≤ 2 |
| Construction | 12 min | Rotation = two reflections; the index formula for round 1 |
| Code | 10 min | Loop walk, round 1 with mutation, round 2 by reading, three output cases |
| Trace | 5 min | The example, `2 1`, `2 3 1`, an even loop |

If the construction does not come, draw a loop of 5 positions on a circle and try to move every value one step in two rounds of disjoint swaps; the mirror pattern appears quickly on paper.

## 9. Interviewer challenges

### About correctness

#### Why can't one round sort `2 3 1`?

**What they are testing:** the lower bound, argued rather than tried.

**How to reason:** what does doing a round twice do?

**What I say:** "A round is disjoint swaps, so doing it twice is the identity. If one round sorted `2 3 1`, the round would be exactly the inverse of the needed rearrangement, and then that rearrangement would also undo itself when done twice. But the 3-loop needs three steps to come back, not two. So one round cannot do it."

**Nuance:** the same argument covers any loop of length ≥ 3, however long. One round sorts exactly the arrays whose loops have length 1 or 2.

#### Why are two rounds enough even for a loop of 200,000 positions?

**What they are testing:** whether the construction is understood, not memorised.

**How to reason:** the needed movement around a loop is a rotation by one.

**What I say:** "Put the loop's positions around a circle. Every value must move one step forward. Mirroring the circle across one axis and then across the next axis turns it by one step, and each mirror is a set of disjoint swaps, so it is one round. Round 1 sends a(j) to a(−j), round 2 sends a(i) to a(1−i), and together a(j) goes to a(j+1)."

**Nuance:** all loops are handled in parallel because they use disjoint positions, so the whole array still takes two rounds.

#### Why does the "halve each loop" greedy fail?

**What they are testing:** whether you can reject a plausible greedy.

**How to reason:** count how many values it places per round.

**What I say:** "Swapping consecutive pairs along a loop puts one value home per pair, so a loop of k shrinks to about k/2 per round, and needs about log₂ k rounds: 3 for a 5-loop, where two reflections do it in 2. Putting values home fast is the wrong objective; the reflections place almost nothing in round 1 and everything in round 2."

**Nuance:** I simulated it: 18 rounds for a single loop of 200,000.

### About implementation

#### Why must round 2 be read only after round 1 is fully applied, and why only `p[i] > i`?

**What they are testing:** care with the simulation.

**How to reason:** round 2 is defined on the array after round 1.

**What I say:** "Round 2's pairs are the 2-cycles of the array after round 1, so I apply round 1's swaps first, which I do as I emit them, loop by loop. Then each 2-cycle {i, p[i]} appears twice in a scan, once from each end; taking `p[i] > i` prints it once."

**Nuance:** printing both ends would use each position twice in round 2, which the checker rejects.

#### What happens with `j <= k − j`?

**What they are testing:** off-by-one awareness.

**How to reason:** look at an even loop.

**What I say:** "For k = 4, j = 2 gives k − j = 2: a swap of a position with itself. On the example that prints `4 4` in round 1 with a round size of 2; I ran it. The strict `<` excludes the middle."

**Nuance:** for odd k there is no middle in round 1, but round 2 has one, index (k + 1)/2, which Approach 2's `1 + t < k − t` excludes for the same reason.

## 10. Follow-up questions the interviewer might ask

**"Minimise the total number of swaps instead of rounds."**
Each swap changes the number of loops by exactly one, so it is n minus the number of loops, as in method 2 of [[cses-sorting-methods|Sorting Methods]]. O(n).

**"Each round may only swap adjacent positions (still disjoint)."**
Then a value can move only one step per round, so the rounds are at least the largest distance any value must travel, and odd–even transposition sort (alternately swapping out-of-order pairs at even and odd boundaries) is known to sort any array in at most n rounds. Finding the exact minimum is a different problem from this one.

**"Apply the same permutation every round. When is the array sorted again?"**
After the least common multiple of the loop lengths, since each loop returns to its start after a multiple of its length. That is [[cses-permutation-rounds|Permutation Rounds]].

**"Also minimise the number of swaps used within the minimum number of rounds."**
Any sequence of swaps that sorts the array uses at least n − c swaps in total, c being the number of loops, because each swap changes the number of loops by exactly one. The two reflections of a loop of length k use ⌊(k − 1)/2⌋ + ⌊k/2⌋ = k − 1 swaps, so the construction above uses n − c swaps in all: it is already optimal in both measures (I checked the total on random permutations).

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Expecting the answer to grow with n.** It is never more than 2; the BFS on small n, or the reflection argument, shows why.
- **Halving loops greedily.** Valid rounds, but ⌈log₂ k⌉ of them for a loop of length k.
- **Answering 2 whenever the array is unsorted.** If every loop has length at most 2, one round is enough and 2 is not the minimum.

### Implementation mistakes

> [!MISTAKE] Printing two rounds when one is enough
> If the program always prints 2 rounds for an unsorted array, `2 1` gives `2`, `0`, `1`, `1 2` (verified): an empty first round and a non-minimal count. Print round 2 alone when round 1 is empty.

> [!MISTAKE] A non-strict mirror bound
> With `j <= k - j`, the example prints round 1 as `2`, `5 3`, `4 4` (verified): position 4 is swapped with itself and counted as a swap. Use `j < k - j`.

- **Swapping while still walking the loop.** The walk follows p; changing p mid-walk sends it into the wrong positions. Collect the whole loop first.
- **Listing a 2-cycle from both ends in round 2.** Use `p[i] > i`.
- **Printing swap by swap.** Up to 2 · 10^5 lines: build one `StringBuilder` and print once.

## 12. Pattern recognition

**The pattern:** decompose a permutation into **cycles** and reason per cycle. A minimum is a **lower bound plus a construction**: here the bound is "one round undoes itself", and the construction is "a rotation is two reflections", applied to every cycle in parallel.

**Signals in the problem statement:**

- A permutation and swaps: think of the cycles of "the value here belongs over there".
- "Rounds" of simultaneous, disjoint operations: count parallel steps, and ask what one step can do at most.
- "Print any valid solution" with a minimum: prove the bound, then build an answer that meets it.

**Related problems in this list:**

- [[cses-sorting-methods|Sorting Methods]]: the minimum number of single swaps, n minus the number of cycles, and three other sorting operations.
- [[cses-permutation-rounds|Permutation Rounds]]: cycles again, applied repeatedly, with the LCM of their lengths.
- [[nc-first-missing-positive|First Missing Positive]]: placing each value at its home index by swaps, walking cycles in place.
- [[nc-sort-colors|Sort Colors]]: sorting by swaps, minimising passes rather than rounds.
- [[nc-sort-an-array|Sort an Array]]: general sorting, for contrast with the structure a permutation gives you.

**Takeaway:** when operations on a permutation compose, think in cycles: what one operation can do to a cycle gives the lower bound, and a cycle's rotation can often be split into a fixed small number of simple pieces.

## 13. 60-second revision card

**Key insight:** 0 rounds if sorted, 1 if every cycle has length ≤ 2, else 2: a round undoes itself when repeated, and a cycle's rotation is two reflections.

**Invariant:** after round 1 (swap a(j) with a(k−j) for 1 ≤ j < k − j in every cycle), every cycle has length at most 2.

**Complexity:** O(n) time, O(n) space including the output.

**Code skeleton:**

```java title="Swap Round Sorting, mirror then read"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] p = new int[n + 1], cyc = new int[n];
        StringTokenizer st = new StringTokenizer("");
        for (int i = 1; i <= n; i++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(in.readLine());
            p[i] = Integer.parseInt(st.nextToken());
        }
        StringBuilder r1 = new StringBuilder(), r2 = new StringBuilder();
        int c1 = 0, c2 = 0;
        boolean[] seen = new boolean[n + 1];
        for (int s = 1; s <= n; s++) {
            int k = 0;
            for (int at = s; !seen[at]; at = p[at]) { seen[at] = true; cyc[k++] = at; }
            for (int j = 1; j < k - j; j++) {
                int a = cyc[j], b = cyc[k - j];
                r1.append(a).append(' ').append(b).append('\n');
                c1++;
                int t = p[a]; p[a] = p[b]; p[b] = t;
            }
        }
        for (int i = 1; i <= n; i++) if (p[i] > i) { r2.append(i).append(' ').append(p[i]).append('\n'); c2++; }
        StringBuilder out = new StringBuilder();
        if (c1 > 0) out.append("2\n").append(c1).append('\n').append(r1).append(c2).append('\n').append(r2);
        else if (c2 > 0) out.append("1\n").append(c2).append('\n').append(r2);
        else out.append("0\n");
        System.out.print(out);
    }
}
```

**Main traps:**

- One round when all cycles have length ≤ 2; never print an empty round.
- Strict `j < k − j`; collect the cycle before swapping.
- Round 2 from `p[i] > i` only, after round 1 is applied.

**What to say in one breath:** "A round of disjoint swaps undoes itself, so one round only sorts arrays whose cycles have length at most two. Otherwise two rounds suffice, because rotating a cycle by one is two reflections: round 1 swaps a(j) with a(k−j) in every cycle, which leaves only 2-cycles, and round 2 swaps those. O(n)."
