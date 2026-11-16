---
problemId: cses-collecting-numbers-ii
title: Collecting Numbers II
source: cses
sourceUrl: https://cses.fi/problemset/task/2217
difficulty: medium
patterns: [sorting-searching, simulation, invariants]
relatedLessons: [a14-deriving-optimization, a14-edge-cases, a14-brute-force-first, a2-sorting-based, a1-java-syntax-competitive]
companies: []
timeToSolve: 25
---

## 1. Problem restatement

You get an array holding each number from 1 to n exactly once. As in Collecting Numbers, you collect 1, 2, …, n in increasing order in rounds, where one round is one left-to-right walk over the array that picks up every number it can in order. Then come m operations; each one swaps the numbers at two **positions** a and b of the array, and the swaps accumulate. After each swap, print the number of rounds the current array needs. This is a whole program: it reads standard input and writes standard output.

**Example 1** (the CSES example)

- Input: `5 3`, then `4 2 1 5 3`, then the swaps `2 3`, `1 5`, `2 3`
- Output: `2`, `3`, `4`, one per line
- Why: after swapping positions 2 and 3 the array is `4 1 2 5 3`, collected as {1, 2, 3}, {4, 5}: 2 rounds. Swapping positions 1 and 5 gives `3 1 2 5 4`: {1, 2}, {3, 4}, {5}, 3 rounds. Swapping positions 2 and 3 again gives `3 2 1 5 4`: {1}, {2}, {3, 4}, {5}, 4 rounds.

**Example 2** (an extra example: the CSES statement has only one)

- Input: `6 1`, then `1 2 3 4 5 6`, then `2 5`
- Output: `3`
- Why: the array becomes `1 5 3 4 2 6`. Round 1 takes 1 and then 2 at position 5, but 3 (position 3) is already behind. Round 2 takes 3 and 4, but 5 (position 2) is behind. Round 3 takes 5 and 6. So 3 rounds.

**What the problem statement guarantees**

- 1 ≤ n, m ≤ 2 · 10^5.
- The array contains each number 1, …, n exactly once.
- 1 ≤ a, b ≤ n, and a and b are positions (1-based), not values. Nothing says a ≠ b.
- Input: n and m on the first line, the array on the second, then m lines with a and b.
- Output: m integers, the number of rounds after each swap.
- Time limit: 1 second (memory limit 512 MB).

## 2. Practice first: try it before reading on

If you have not solved this yourself yet, stop here. Solve Collecting Numbers (the problem without swaps) first if you have not: this problem keeps its answer up to date under changes. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 25 minutes.
2. Write the simplest correct program and estimate its cost at n = m = 2 · 10^5.
3. For one swap, list exactly which parts of your answer can change. Then try a swap of two numbers that differ by 1.
4. Write the fast version and test it on swaps of consecutive numbers, and on a swap of a position with itself.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> The number of rounds for a fixed array is a sum of small yes/no terms, one for each k from 1 to n − 1. A swap moves only two numbers. How many of those terms can it change?

> [!HINT] Hint 2: the kind of tool you need
> Keep the current answer and two arrays: the number at each position, and the position of each number. For a swap of the numbers u and v, the terms that mention u or v are the ones for the pairs (u − 1, u), (u, u + 1), (v − 1, v), (v, v + 1).

> [!HINT] Hint 3: almost the whole plan
> Collect the pairs that touch u or v, without duplicates (when v = u + 1, the pair (u, u + 1) appears twice), and skip pairs outside 1..n. Subtract their current contribution, perform the swap in both arrays, add their new contribution, print.

**Check yourself before revealing the walkthrough**

- [ ] I can say how much a full recount per swap costs at the limits
- [ ] I can say exactly which parts of my answer one swap can change, and why nothing else changes
- [ ] My program is right when the swapped numbers are consecutive, and when a = b
- [ ] I print m lines with one buffered output, not m separate prints

## 3. Interview script: understand the problem (≈2 min)

Treat it as if an interviewer had posed it. The two questions that matter: are a and b positions or values, and do the swaps accumulate?

**Me:** Same collecting process as before: a round walks left to right and takes the next needed number whenever it meets it. Now there are m swaps, and after each one I print the rounds for the current array. Do the swaps build on each other, or does each start from the original array?

**Interviewer:** They accumulate.

**Me:** And a and b are positions in the array, not the values being swapped?

**Interviewer:** Positions.

**Me:** Can a equal b?

**Interviewer:** The statement only says 1 ≤ a, b ≤ n.

**Me:** Then I'll treat a = b as a swap that changes nothing, and make sure my update handles it. Let me do the first swap of the example by hand: `4 2 1 5 3`, swap positions 2 and 3, which hold the numbers 2 and 1. The array becomes `4 1 2 5 3`. Round 1 takes 1, then 2 to its right, then 3 at the end; round 2 takes 4 and 5. So 2.

**Interviewer:** Right.

**Me:** Up to 2 · 10^5 numbers and 2 · 10^5 swaps, so about 6 · 10^5 input tokens and 2 · 10^5 output lines. I'll read with `BufferedReader` and `StringTokenizer` and collect the output in one `StringBuilder`.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n, m ≤ 2 · 10^5 | An O(n) recount per swap is n · m = 4 · 10^10 steps: far too slow. Each swap must cost O(1) or O(log n). |
| The array is a permutation of 1..n | A positions array `pos[value]` works, as in Collecting Numbers. |
| 1 ≤ a, b ≤ n, positions | Look up the values at a and b first; a = b is allowed. |
| Time limit 1 s | Buffered input; output in one `StringBuilder`, printed once. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Swaps accumulate | I keep one current array and update it; no copying. |
| a and b are positions | I need both arrays: number at a position (to find u and v) and position of a number (to evaluate the pairs). |
| One answer per line, after every swap | m lines; no answer for the initial array. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| a = b may occur, and means "no change" | The statement allows it; my update must not break when u = v. |
| Tokens may be split over lines differently | My reader takes tokens as they come. |

### Edge cases I will keep in mind

- The two numbers are consecutive (|u − v| = 1): one pair is touched by both.
- a = b: u = v, all four pairs coincide two by two.
- u or v is 1 or n: the pair (0, 1) or (n, n + 1) does not exist.
- n = 1: no pairs at all; the answer is always 1.

## 4. Think out loud: from first idea to best solution

From [[cses-collecting-numbers|Collecting Numbers]]: with `pos[v]` the position of v, the number of rounds is 1 plus the number of k in 1..n − 1 with `pos[k + 1] < pos[k]`. Call such a k a **break**: k + 1 sits before k and must wait for a new round. The ladder below first recomputes that count after every swap, then keeps it up to date by touching only the pairs a swap can change.

### Alternative: recount from scratch after every swap

This rung is too slow for the largest tests (16.9 s measured at n = m = 2 · 10^5), so it is not a numbered approach. It is the baseline to state first.

#### What I say out loud

> "The simplest correct program: perform each swap on the array and on `pos`, then recount the breaks over all n − 1 pairs, exactly as in Collecting Numbers. That's O(n) per swap, O(n · m) total, 4 · 10^10 at the limits. Still, it's the reference I'll test against. Replaying the rounds literally after each swap would be worse, O(n²) per swap."

#### Intuition

Reuse the one-shot answer as a function, call it after each swap.

#### Algorithm

1. Read n, m and the array into `x[1..n]`; set `pos[x[p]] = p`.
2. For each swap (a, b): `u = x[a]`, `v = x[b]`; set `x[a] = v`, `x[b] = u`, `pos[u] = b`, `pos[v] = a`.
3. Count `rounds = 1 + #{k in 1..n − 1 : pos[k + 1] < pos[k]}`, append it to the output.
4. Print the output once.

#### Why it is correct

- **The arrays stay right.** After the swap, position a holds v and position b holds u, and `pos` records exactly that. Every other number keeps its position. When a = b, u = v, and the four assignments write back the same values.
- **The count is right.** By the claim proved on the Collecting Numbers page, a round that has just taken k goes on to take k + 1 exactly when k + 1 is to its right, and otherwise k + 1 is taken in the very next round. So the rounds number 1 plus the breaks.

#### Dry run

Input `5 3` / `4 2 1 5 3` / swaps `2 3`, `1 5`, `2 3`. Positions are 1-based.

| Swap | Array after | pos[1..5] | Breaks k (pos[k + 1] < pos[k]) | Prints |
|---|---|---|---|---|
| (2, 3): numbers 2 and 1 | 4 1 2 5 3 | 2, 3, 5, 1, 4 | 3 | 2 |
| (1, 5): numbers 4 and 3 | 3 1 2 5 4 | 2, 3, 1, 5, 4 | 2, 4 | 3 |
| (2, 3): numbers 1 and 2 | 3 2 1 5 4 | 3, 2, 1, 5, 4 | 1, 2, 4 | 4 |

#### Java code

```java title="Alternative: recount after every swap (too slow at n = m = 2 · 10^5)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(st.nextToken());
        int m = Integer.parseInt(st.nextToken());
        int[] x = new int[n + 1];                  // x[p] = the number at position p (1-based)
        int[] pos = new int[n + 1];                // pos[v] = the position of the number v
        st = new StringTokenizer("");
        for (int p = 1; p <= n; p++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            x[p] = Integer.parseInt(st.nextToken());
            pos[x[p]] = p;
        }

        StringBuilder out = new StringBuilder();
        for (int op = 0; op < m; op++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            int a = Integer.parseInt(st.nextToken());
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            int b = Integer.parseInt(st.nextToken());

            int u = x[a];
            int v = x[b];
            x[a] = v;                              // perform the swap on both arrays
            x[b] = u;
            pos[u] = b;
            pos[v] = a;
            out.append(recountFromScratch(pos, n)).append('\n');
        }
        System.out.print(out);
    }

    /** The whole count again: 1 + the number of v with pos[v + 1] < pos[v]. O(n) per call. */
    static int recountFromScratch(int[] pos, int n) {
        int rounds = 1;
        for (int v = 1; v < n; v++) {
            if (pos[v + 1] < pos[v]) {
                rounds++;
            }
        }
        return rounds;
    }
}
```

#### Time complexity

**O(n + n · m) = O(n · m)**, n being the array length and m the number of swaps: reading is O(n + m), and each swap costs an O(n) recount. At n = m = 2 · 10^5 that is 4 · 10^10 comparisons; measured on my machine (JDK 26), 16.9 s for the whole program on random swaps. It is fine when n · m is small (n · m = 2 · 10^8 runs in well under a second).

#### Space complexity

**O(n)** for `x` and `pos`, plus the output buffer, O(m) characters (at most 7 per line).

#### The bridge to the next approach

> "The recount looks at n − 1 pairs, but a swap moves only two numbers, u and v. Whether k is a break depends only on `pos[k]` and `pos[k + 1]`, so pair k can change only if k or k + 1 is u or v. That's k in {u − 1, u, v − 1, v}: at most four pairs. So I keep the count as a running total: before the swap, subtract the break status of those pairs; do the swap; add their new status. The thing to be careful about is a pair that is in the list twice. If v = u + 1, the pair (u, u + 1) is both 'u's right pair' and 'v's left pair', and counting it twice would change the total by two."

### Approach 1: Subtract, swap, add over the touched pairs

#### What I say out loud

> "I keep the current number of rounds, x (number at each position) and pos (position of each number). For a swap of positions a and b with numbers u and v, the only pairs (k, k + 1) whose status can change are those with k in {u − 1, u, v − 1, v}, restricted to 1..n − 1 and with duplicates removed. I subtract their old status, swap, add their new status. That's O(1) per swap, O(n + m) total."

#### Intuition

The answer is a sum of n − 1 independent terms, each depending on the positions of two consecutive numbers. A swap changes two positions, so it changes at most four terms. Update the terms, not the sum.

#### Algorithm

1. Read n, m and the array into `x[1..n]`, with `pos[x[p]] = p`.
2. `rounds = 1 + #{k : pos[k + 1] < pos[k]}`, computed once. Let `breaks(k)` be 1 if `pos[k + 1] < pos[k]`, else 0.
3. For each swap (a, b):
   1. `u = x[a]`, `v = x[b]`.
   2. Build the list of pairs: each k in u − 1, u, v − 1, v with 1 ≤ k ≤ n − 1, added only if not already in the list.
   3. For each k in the list: `rounds -= breaks(k)`.
   4. Swap: `x[a] = v`, `x[b] = u`, `pos[u] = b`, `pos[v] = a`.
   5. For each k in the list: `rounds += breaks(k)`. Append `rounds` to the output.
4. Print the output once.

#### Why it is correct

**Invariant:** before and after every swap, `rounds` = 1 + the number of breaks of the current array, which by the Collecting Numbers claim is the number of rounds.

- **Only listed pairs can change.** `breaks(k)` reads only `pos[k]` and `pos[k + 1]`. The swap changes `pos` only at u and v (every other number stays where it was). So `breaks(k)` can change only if k or k + 1 is u or v, that is, k ∈ {u − 1, u, v − 1, v}. Values of k outside 1..n − 1 are not pairs at all.
- **Each listed pair is corrected exactly once.** For each pair in the list, step 3 removes its old contribution, and step 5 adds its new one, so the total changes by exactly (new − old) for that pair. Every pair appears in the list once, so the total changes by the sum of (new − old) over the changed pairs, which is the change in the number of breaks. Unlisted pairs contribute the same before and after.
- **Why the duplicates matter.** If v = u + 1, then u (from "u's right pair") and v − 1 (from "v's left pair") are the same k. Without removing it, its correction (new − old) would be applied twice. If a = b, then u = v and the list would contain each pair twice; with duplicates removed, the subtract-then-add leaves `rounds` unchanged, as it must.
- **The order matters.** The old status must be read before `pos` is changed, and the new status after.

**Said in 30 seconds:** "The answer is 1 plus the number of k with k + 1 before k. A swap moves two numbers u and v, so only pairs that contain u or v can change: k in {u − 1, u, v − 1, v}. I collect those, without duplicates, since consecutive u and v share a pair, then subtract their status, swap, and add their status. Every other pair is untouched, so the total stays exact. O(1) per swap."

#### Dry run

Input `5 3` / `4 2 1 5 3` / swaps `2 3`, `1 5`, `2 3`. Initially `pos[1..5]` = 3, 2, 5, 1, 4 (1-based), breaks at k = 1 and k = 3, so `rounds` = 3.

| Swap | u, v | Pairs listed (duplicates and out-of-range removed) | Old status | rounds after subtracting | New status | Prints |
|---|---|---|---|---|---|---|
| (2, 3) | 2, 1 | 1, 2 (u − 1 = 1, u = 2; v − 1 = 0 is out of range; v = 1 is a duplicate) | k1 = 1, k2 = 0 | 2 | k1 = 0, k2 = 0 | 2 |
| (1, 5) | 4, 3 | 3, 4, 2 (v = 3 is a duplicate) | k3 = 1, k4 = 0, k2 = 0 | 1 | k3 = 0, k4 = 1, k2 = 1 | 3 |
| (2, 3) | 1, 2 | 1, 2 (u − 1 = 0 out of range; v − 1 = 1 is a duplicate) | k1 = 0, k2 = 1 | 2 | k1 = 1, k2 = 1 | 4 |

Prints `2`, `3`, `4`, matching the full recount. The first and last swaps exchange consecutive numbers: there the shared pair k = 1 is listed once.

Second input `6 1` / `1 2 3 4 5 6` / swap `2 5`: u = 2, v = 5, not consecutive, so four separate pairs 1, 2, 4, 5, all with status 0; `rounds` stays 1 after subtracting. After the swap, `1 5 3 4 2 6` has `pos[1..6]` = 1, 5, 3, 4, 2, 6, so k2 (3 at 3 is before 2 at 5) and k4 (5 at 2 is before 4 at 4) are breaks: `rounds` = 3. Prints `3`.

#### Java code

```java title="Approach 1: subtract, swap, add over the touched pairs"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    static int n;
    static int[] pos;                              // pos[v] = the position of the number v

    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(in.readLine());
        n = Integer.parseInt(st.nextToken());
        int m = Integer.parseInt(st.nextToken());
        int[] x = new int[n + 1];                  // x[p] = the number at position p (1-based)
        pos = new int[n + 1];
        st = new StringTokenizer("");
        for (int p = 1; p <= n; p++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            x[p] = Integer.parseInt(st.nextToken());
            pos[x[p]] = p;
        }

        int rounds = 1;
        for (int k = 1; k < n; k++) {
            rounds += breaks(k);
        }

        StringBuilder out = new StringBuilder();
        int[] pairs = new int[4];
        for (int op = 0; op < m; op++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            int a = Integer.parseInt(st.nextToken());
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            int b = Integer.parseInt(st.nextToken());
            int u = x[a];
            int v = x[b];

            // The pairs (k, k + 1) that contain u or v, each listed once.
            int count = 0;
            for (int k : new int[] {u - 1, u, v - 1, v}) {
                if (k < 1 || k > n - 1) {
                    continue;                      // no such pair at the ends
                }
                boolean listed = false;
                for (int j = 0; j < count; j++) {
                    if (pairs[j] == k) {
                        listed = true;             // u and v are neighbours: pair shared
                    }
                }
                if (!listed) {
                    pairs[count++] = k;
                }
            }

            for (int j = 0; j < count; j++) {
                rounds -= breaks(pairs[j]);        // remove the old status of each touched pair
            }
            x[a] = v;
            x[b] = u;
            pos[u] = b;
            pos[v] = a;
            for (int j = 0; j < count; j++) {
                rounds += breaks(pairs[j]);        // add the new status
            }
            out.append(rounds).append('\n');
        }
        System.out.print(out);
    }

    /** 1 if the number k + 1 sits before k (so k + 1 starts a new round), else 0. */
    static int breaks(int k) {
        return pos[k + 1] < pos[k] ? 1 : 0;
    }
}
```

#### Time complexity

**O(n + m)**: O(n) to read the array and count the initial breaks, then O(1) per swap (at most four pairs, each compared with at most three already listed, so a constant number of steps). Measured: about 0.18 s for the whole program at n = m = 2 · 10^5 with random swaps, JVM start included; reading 6 · 10^5 tokens dominates.

#### Space complexity

**O(n)** for `x` and `pos`, plus the O(m)-character output buffer.

#### The bridge to the next approach

> "This works, but it has two traps that both come from computing a *difference*: the old status must be read before the swap, and each pair must be corrected only once. If I store each pair's status in a flag array, I don't need the old status at all. I swap, then for each touched pair recompute its status and compare with the stored flag. If it differs, I adjust the count and update the flag. Visiting the same pair twice is then harmless: the second visit finds the flag already up to date. The duplicate check and the ordering rule both disappear, for n extra booleans."

### Approach 2: Keep a flag per pair and refresh the touched flags (recommended)

#### What I say out loud

> "I keep `isBreak[k]` for every pair and `rounds` = 1 + the number of true flags. For a swap, I update x and pos first, then refresh the flags of k = u − 1, u, v − 1, v that are in range: recompute `pos[k + 1] < pos[k]`, and if it differs from the stored flag, add or subtract one and store it. Refreshing is idempotent, so a pair listed twice is fine. O(1) per swap."

#### Intuition

Store the terms of the sum, not just the sum. Then an update is "bring each possibly-stale term up to date", and bringing an up-to-date term up to date does nothing.

#### Algorithm

1. Read n, m and the array into `x[1..n]`, with `pos[x[p]] = p`.
2. For k in 1..n − 1: `isBreak[k] = pos[k + 1] < pos[k]`. `rounds` = 1 + the number of true flags.
3. For each swap (a, b):
   1. `u = x[a]`, `v = x[b]`; swap: `x[a] = v`, `x[b] = u`, `pos[u] = b`, `pos[v] = a`.
   2. For each k in u − 1, u, v − 1, v with 1 ≤ k ≤ n − 1: `now = pos[k + 1] < pos[k]`; if `now != isBreak[k]`, then `rounds += now ? 1 : −1` and `isBreak[k] = now`.
   3. Append `rounds`.
4. Print the output once.

#### Why it is correct

**Invariant:** between swaps, (1) `isBreak[k]` equals `pos[k + 1] < pos[k]` for every k in 1..n − 1, and (2) `rounds` = 1 + the number of true flags. Together they say `rounds` is the number of rounds of the current array.

- **Initially** both hold by construction.
- **After the swap, only touched flags can be stale.** As in Approach 1, the swap changes `pos` only at u and v, so the true status of pair k can change only for k ∈ {u − 1, u, v − 1, v}. Every other flag is still correct.
- **A refresh restores the flag and keeps (2).** If the recomputed status equals the flag, nothing changes. If it differs, the flag flips and `rounds` moves by the same ±1, so `rounds` is still 1 + the number of true flags.
- **Duplicates are harmless.** When u and v are consecutive, or a = b, some k is visited twice. The first visit makes the flag correct; the second recomputes the same status (nothing changes between the two visits) and does nothing. So no pair is counted twice, without any duplicate check.
- After all touched flags are refreshed, every flag is correct, so (1) and (2) hold again.

**The 30-second version:** "Rounds are 1 plus the number of k with k + 1 before k, and I store that fact per k in a flag. A swap moves two numbers, so only the pairs containing them, k in {u − 1, u, v − 1, v}, can change. After the swap I recompute those flags; each one that flips moves the count by one. Recomputing a flag twice does nothing the second time, so consecutive numbers need no special case. O(1) per swap."

#### Dry run

Input `5 3` / `4 2 1 5 3` / swaps `2 3`, `1 5`, `2 3`. Initially `pos[1..5]` = 3, 2, 5, 1, 4, flags k1..k4 = T, F, T, F, `rounds` = 3. The table shows each visit in order, after the swap.

| Swap | u, v | Array after | Visits (k: recomputed, stored → action) | Prints |
|---|---|---|---|---|
| (2, 3) | 2, 1 | 4 1 2 5 3 | k1: F, was T → rounds 2; k2: F, was F; k0 skipped; k1 again: F, already F | 2 |
| (1, 5) | 4, 3 | 3 1 2 5 4 | k3: F, was T → rounds 1; k4: T, was F → 2; k2: T, was F → 3; k3 again: F, already F | 3 |
| (2, 3) | 1, 2 | 3 2 1 5 4 | k0 skipped; k1: T, was F → rounds 4; k1 again: T, already T; k2: T, was T | 4 |

Prints `2`, `3`, `4`. The repeated visits to k1 in the first and last swaps are the consecutive-number cases: they change nothing.

Second input `6 1` / `1 2 3 4 5 6` / swap `2 5`: all flags start false, `rounds` = 1. After the swap, `pos[1..6]` = 1, 5, 3, 4, 2, 6. Visits k1: F (no change), k2: T → 2, k4: T → 3, k5: F. Prints `3`.

#### Java code

```java title="Approach 2: refresh the flags of the touched pairs (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(st.nextToken());
        int m = Integer.parseInt(st.nextToken());
        int[] x = new int[n + 1];                  // x[p] = the number at position p (1-based)
        int[] pos = new int[n + 1];                // pos[v] = the position of the number v
        st = new StringTokenizer("");
        for (int p = 1; p <= n; p++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            x[p] = Integer.parseInt(st.nextToken());
            pos[x[p]] = p;
        }

        boolean[] isBreak = new boolean[n + 1];    // isBreak[k]: k + 1 sits before k (k in 1..n-1)
        int rounds = 1;
        for (int k = 1; k < n; k++) {
            isBreak[k] = pos[k + 1] < pos[k];
            if (isBreak[k]) {
                rounds++;
            }
        }

        StringBuilder out = new StringBuilder();
        for (int op = 0; op < m; op++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            int a = Integer.parseInt(st.nextToken());
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            int b = Integer.parseInt(st.nextToken());
            int u = x[a];
            int v = x[b];
            x[a] = v;                              // swap first: the flags remember the old state
            x[b] = u;
            pos[u] = b;
            pos[v] = a;

            int[] touched = {u - 1, u, v - 1, v};
            for (int k : touched) {
                if (k < 1 || k > n - 1) {
                    continue;                      // no pair (0, 1) or (n, n + 1)
                }
                boolean now = pos[k + 1] < pos[k];
                if (now != isBreak[k]) {           // a second visit of the same k sees no change
                    rounds += now ? 1 : -1;
                    isBreak[k] = now;
                }
            }
            out.append(rounds).append('\n');
        }
        System.out.print(out);
    }
}
```

#### Time complexity

**O(n + m)**: O(n) to read the array and set the flags, then at most four refreshes of O(1) each per swap. Measured: about 0.19 s for the whole program at n = m = 2 · 10^5 with random swaps, JVM start included, the same as Approach 1; both are dominated by reading the input.

#### Space complexity

**O(n)** for `x`, `pos` and the n + 1 flags, plus the O(m)-character output buffer.

## 5. Comparison table

n is the array length and m the number of swaps.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Replay the rounds after each swap (prose only) | O(n² · m) worst case | O(n² · m) | O(n) |
| Alt. Recount after every swap | O(n · m) | O(n · m): 16.9 s measured at n = m = 2 · 10^5 | O(n) + output |
| 1. Subtract, swap, add over the touched pairs | O(n + m) | O(n + m) | O(n) + output |
| 2. Refresh the flags of the touched pairs | O(n + m) | O(n + m) | O(n) + n flags + output |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Replay the rounds | Needs no insight at all | Hopeless at any real size | Never, except to check the formula on tiny inputs |
| Alt. Recount | Reuses Collecting Numbers unchanged; easy to trust | Linear per swap | Small n · m; as the test oracle |
| 1. Subtract, swap, add | Constant work per swap; stores only the total | The duplicate pair and the subtract-before-swap order are easy to get wrong | When the interviewer wants the difference argument spelled out |
| 2. Refresh flags | Constant work per swap; no duplicate check, no ordering rule | n extra booleans | The CSES submission and the interview answer |

## 6. Which solution to give, and when to stop optimizing

**The solution I recommend:** Approach 2. Approaches 1 and 2 are the rungs that fit the limits, with the same O(n + m) bound and the same measured time. Both rest on one argument: the answer is a sum of per-pair terms, and a swap changes at most four of them. Approach 2 stores the terms, so its update is idempotent: a pair visited twice is not counted twice, and there is no "read the old status before the swap" rule to forget. It costs n booleans, which is nothing here. Approach 1 is the version to present if the interviewer asks you to reason about the difference directly, and its duplicate check is the classic place for a bug.

**Is it optimal?** The program must read the whole input and write m answers, so Ω(n + m) is a lower bound for any program that reads its input, and Approaches 1 and 2 are O(n + m). Stop here.

**In an interview,** say the recount first, with its O(n · m) cost; then say "a swap changes at most four terms" and immediately raise the consecutive-numbers case yourself before the interviewer does. Test it on the example's first swap, which is exactly that case.

## 7. Interview script: code it and test it

### What I say while coding

> "Two arrays: `x[position]` to find which numbers a and b hold, and `pos[number]` to evaluate pairs. Both 1-based, size n + 1."

> "I read u and v from `x` before touching anything, then swap both arrays, then refresh the four candidate pairs. The flags hold the old statuses, so the order inside the swap doesn't matter."

> "I skip k = 0 and k = n: those pairs don't exist, and `pos[n + 1]` would be out of bounds."

> "If u and v are consecutive, one pair is refreshed twice; the second refresh finds the flag already correct and does nothing. That's why I compare with the stored flag instead of adding a difference."

> "One `StringBuilder` for the m answers, printed once."

### Testing out loud

**The example:** traced in section 4: 2, 3, 4.

**Consecutive numbers, `4 1` / `1 2 3 4` / `2 3`:** u = 2, v = 3. After the swap `1 3 2 4`, the visits are k = 1 (no change), k = 2 (flips to true, rounds 2), k = 2 again (already true), k = 3 (no change). Prints 2. Approach 1 without its duplicate check would print 3.

**a = b, `4 2` / `1 2 3 4` / `2 2`, `3 3`:** u = v, the swap writes back the same values, and every refreshed flag is unchanged: 1 and 1.

**The ends, `4 1` / `1 2 3 4` / `1 4`:** u = 1 (pair 0 skipped), v = 4 (pair 4 skipped); pairs 1 and 3 are refreshed. Array `4 2 3 1`: k = 1 breaks (2 at position 2 is before 1 at position 4) and k = 3 breaks (4 at position 1 is before 3 at position 3). Prints 3.

**n = 1, `1 3` / `1` / three swaps `1 1`:** no pairs ever; prints 1 three times.

**Largest inputs:** the tests run n = m = 2 · 10^5 with random swaps, with mostly-consecutive swaps, a reversed start, and 2 · 10^5 swaps of the two ends (answers alternate 3, 1).

**Official tests:** CSES has official tests for this problem, but none is small enough to be stored with this site, so I could not run them. Instead the tests compare all three programs on this page with a brute force that replays the rounds after every swap, on 3,000 random small inputs (many with consecutive swaps and a = b), and with a separately written incremental reference (verified against the brute force on all of those inputs) on 200 medium inputs and the maximum sizes.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2 min | Positions, not values; swaps accumulate; a = b allowed |
| Recall the formula | 2 min | 1 + breaks, from Collecting Numbers |
| Baseline | 1 min | Recount per swap, O(n · m) |
| Insight | 3 min | At most four pairs change; the shared pair; store a flag per pair and refresh |
| Code | 5 min | `x`, `pos`, the flags, buffered output |
| Test | 4 min | Example (consecutive swap), a = b, ends, n = 1 |

If stuck, draw the numbers 1..n on a line with the pairs between neighbours, circle u and v, and see which pairs touch a circle.

## 9. Interviewer challenges

### About the reasoning

#### Why can't any other pair change?

**What they are testing:** whether the locality argument is precise.

**How to reason:** what does a pair's status read, and what does a swap write?

**What I say:** "The status of pair k reads `pos[k]` and `pos[k + 1]`, nothing else. The swap writes `pos[u]` and `pos[v]`, nothing else: every other number stays where it was, even though the numbers between positions a and b may be 'jumped over'. So a pair that contains neither u nor v reads the same two values before and after."

**Nuance:** candidates sometimes think the numbers between positions a and b are affected because "the order around them changed". Their positions did not change, and positions are all the formula uses.

#### What exactly goes wrong if you don't remove duplicates?

**What they are testing:** whether you can find the bug yourself, not just avoid it.

**How to reason:** when do two of u − 1, u, v − 1, v coincide?

**What I say:** "u = v − 1 or v = u − 1 when the numbers are consecutive, and all of them pair up when a = b. A duplicated pair gets its correction applied twice. For a = b that is harmless, because nothing changes, so the correction is zero. For consecutive numbers it is wrong whenever the shared pair flips: on the example the first swap exchanges 1 and 2, and the program without the duplicate check prints `1 1 3` instead of `2 3 4` (I ran it)."

**Nuance:** Approach 2 avoids the question entirely: it stores each pair's status and refreshes it, and a refresh applied twice is the same as once. Deduplicating with a `HashSet` also works, with boxing and hashing for no gain.

### About the implementation

#### Why do you need both `x` and `pos`?

**What they are testing:** understanding which lookups the operation needs.

**How to reason:** the input gives positions; the formula uses positions of values.

**What I say:** "The swap names positions, so I need `x` to learn which numbers move. The formula asks where each number is, so I need `pos`. Each swap updates two entries of each array."

**Nuance:** if the swaps named values instead, `pos` alone would suffice to find the positions, but I would still need `x` only if something asked for the number at a position.

## 10. Follow-up questions the interviewer might ask

**"The operations name two values to swap, not two positions."**
Same update: the positions are `pos[u]` and `pos[v]`. O(1) per operation.

**"The values are arbitrary distinct integers, not 1..n."**
The swaps never change which values are present, so replace each value by its rank (sort once, O(n log n)), and the problem becomes this one. O(n log n + m).

**"An operation replaces the number at a position by a new value."**
Now the set of values changes, and "the next larger value" can change too. Keep the present values in a `TreeMap` from value to position, find the predecessor and successor of the old and new value, and update the affected pairs: O(log n) per operation.

**"Also report the rounds before any swap."**
That is the initial count: print it first. No change in complexity.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Treating a and b as values.** In the example, swapping the *values* 2 and 3 instead of the numbers at positions 2 and 3 gives `4 3 1 5 2` and prints 3 for the first swap instead of 2.
- **Thinking the numbers between positions a and b are affected.** Their positions do not change, so their pairs do not either.
- **Resetting the array for each swap.** Swaps accumulate.

### Implementation mistakes

> [!MISTAKE] Counting the shared pair twice (Approach 1)
> When the swapped numbers are consecutive, the pair between them is in the list as u's right pair and as v's left pair. Without removing the duplicate, the example prints `1 1 3` instead of `2 3 4` (verified). Approach 2's flags make this mistake impossible.

> [!MISTAKE] Swapping before subtracting (Approach 1)
> If the swap is done first, the subtraction reads the new statuses, so the total never changes from its initial value: the example prints `3 3 3` (verified). Subtract, then swap, then add.

- **Updating only `x` or only `pos`.** The next swap then reads wrong numbers or wrong positions.
- **Including pair 0 or pair n.** `pos[0]` is unused and `pos[n + 1]` is out of bounds; skip k outside 1..n − 1.
- **Printing each answer with `System.out.println`.** 2 · 10^5 separate prints are slow; build one `StringBuilder`.

## 12. Pattern recognition

**The pattern:** maintain an aggregate under point updates by expressing it as a sum of local terms, and on each update recompute only the terms that read the changed data. The danger is a term read by two changed items: correct it once.

**Signals in the problem statement:**

- "report the answer after each operation" with many operations: incremental maintenance, not recomputation.
- An answer that is a count over adjacent pairs (of values, here) or adjacent positions.
- An operation that changes O(1) items.

**Related problems in this list:**

- [[cses-collecting-numbers|Collecting Numbers]]: the static version, where the formula is derived and proved.
- [[cses-dynamic-range-sum-queries|Dynamic Range Sum Queries]]: point updates where the answer is a range sum, so the update touches a tree instead of four terms.
- [[cses-salary-queries|Salary Queries]]: counting under point updates, with values that need compression.
- [[cses-sorting-methods|Sorting Methods]]: more structure of a permutation, computed without simulating.
- [[cses-bubble-sort-rounds-ii|Bubble Sort Rounds II]]: another quantity of a sorting process derived from positions.

**Takeaway:** when an update changes two items, every term that reads either one may change; store the terms and refresh exactly those, so a term reached twice is still counted once.

## 13. 60-second revision card

**Key insight:** rounds = 1 + #{k : pos[k + 1] < pos[k]}, and a swap of the numbers u and v changes only the pairs k ∈ {u − 1, u, v − 1, v}; refresh those pairs' stored flags.

**Invariant:** between swaps, `isBreak[k]` is the true status of every pair, and `rounds` = 1 + the number of true flags.

**Complexity:** O(n + m) time, O(n) space.

**Code skeleton:**

```java title="Collecting Numbers II, refresh the touched flags"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(st.nextToken()), m = Integer.parseInt(st.nextToken());
        int[] tok = new int[n + 2 * m];                // the array, then the swaps
        for (int i = 0; i < tok.length; i++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(in.readLine());
            tok[i] = Integer.parseInt(st.nextToken());
        }
        int[] x = new int[n + 1], pos = new int[n + 1];
        for (int p = 1; p <= n; p++) { x[p] = tok[p - 1]; pos[x[p]] = p; }
        boolean[] isBreak = new boolean[n + 1];
        int rounds = 1;
        for (int k = 1; k < n; k++) {
            isBreak[k] = pos[k + 1] < pos[k];
            if (isBreak[k]) rounds++;
        }
        StringBuilder out = new StringBuilder();
        for (int op = 0; op < m; op++) {
            int a = tok[n + 2 * op], b = tok[n + 2 * op + 1];
            int u = x[a], v = x[b];
            x[a] = v; x[b] = u; pos[u] = b; pos[v] = a;
            for (int k : new int[] {u - 1, u, v - 1, v}) {
                if (k < 1 || k > n - 1) continue;
                boolean now = pos[k + 1] < pos[k];
                if (now != isBreak[k]) { rounds += now ? 1 : -1; isBreak[k] = now; }
            }
            out.append(rounds).append('\n');
        }
        System.out.print(out);
    }
}
```

**Main traps:**

- a and b are positions; read u = x[a], v = x[b] first.
- Consecutive u, v share a pair: refresh flags (idempotent), or deduplicate if you subtract and add.
- Update both `x` and `pos`; skip pairs 0 and n.

**What to say in one breath:** "Rounds are 1 plus the number of k with k + 1 before k, and I keep that status per k in a flag. A swap moves two numbers, so only the pairs containing them, at most four, can change; after the swap I recompute those flags and adjust the count for each one that flips. A pair reached twice flips at most once, so consecutive numbers need no special case: O(1) per swap."
