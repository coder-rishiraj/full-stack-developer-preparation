---
problemId: cses-collecting-numbers
title: Collecting Numbers
source: cses
sourceUrl: https://cses.fi/problemset/task/2216
difficulty: easy
patterns: [sorting-searching, sorting, simulation, invariants]
relatedLessons: [a2-sorting-based, a3-counting-sort, a14-brute-force-first, a14-deriving-optimization, a1-java-syntax-competitive]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

You get an array that holds each number from 1 to n exactly once, in some order. You collect the numbers 1, 2, …, n in increasing order, in rounds. In one round you walk the array once from left to right and pick up every number you can: whenever the number in front of you is the next one you need, you take it. Print how many rounds it takes to collect all n numbers. This is a whole program: it reads standard input and writes standard output.

**Example 1** (the CSES example)

- Input: `5` on the first line, `4 2 1 5 3` on the second
- Output: `3`
- Why: round 1 walks past 4 and 2 and picks up 1; the 2 is already behind, so the round ends with only 1. Round 2 picks up 2 and then, further right, 3. Round 3 picks up 4 and then 5.

**Example 2** (one of the official CSES tests)

- Input: `5` / `5 4 2 3 1`
- Output: `4`
- Why: round 1 gets 1 (at the far right). Round 2 gets 2 and then 3, which sits to its right. Rounds 3 and 4 get 4 and 5, each of which sits to the left of the number before it.

**What the problem statement guarantees**

- 1 ≤ n ≤ 2 · 10^5.
- The array contains each number 1, …, n exactly once (it is a permutation).
- The first line has n, the second line the n numbers.
- Time limit: 1 second (memory limit 512 MB).

## 2. Practice first: try it before reading on

If you have not solved this yourself yet, stop here. The statement describes a process; the exercise is to stop running the process and see what it actually counts. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 15 minutes.
2. Write a program that plays the rounds exactly as described, and estimate how long it takes on the worst input with n = 2 · 10^5.
3. Play Example 1 on paper and write down, for each number, the round in which it is collected. Look for a rule that predicts the round of k + 1 from the round of k.
4. Turn the rule into a single pass, and argue why it is right.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> Suppose you have just collected the number k. When will you collect k + 1: still in this round, or in the next one? What decides it?

> [!HINT] Hint 2: the kind of tool you need
> The only thing that matters about k and k + 1 is which of them stands further left. So you need to answer "where is the number k?" quickly, for every k. Since the numbers are exactly 1..n, an array indexed by the number can store that.

> [!HINT] Hint 3: almost the whole plan
> Build `pos[v]` = index of v in the input. Start with 1 round, and add 1 for every k from 1 to n − 1 with `pos[k + 1] < pos[k]`. Check it on `4 2 1 5 3`, then prove that a new round starts exactly at those k.

**Check yourself before revealing the walkthrough**

- [ ] My program prints 1 for a sorted array and n for a reversed one
- [ ] I can say how long the literal simulation takes on a reversed array of 2 · 10^5 numbers
- [ ] I can explain in two sentences why each "k + 1 to the left of k" costs exactly one extra round
- [ ] My program reads 2 · 10^5 numbers without `Scanner`

## 3. Interview script: understand the problem (≈2 min)

Treat it as if an interviewer had posed it. The questions are about the input (is it really a permutation?), what a round is, and the output.

**Me:** I get n and an array holding each of 1..n once. I collect 1, then 2, and so on; a round is one left-to-right pass where I take the next needed number whenever I meet it. I print the number of passes. Is that right?

**Interviewer:** Yes.

**Me:** Within one round, after I take a number, can I take the following one if it sits further right in the same pass?

**Interviewer:** Yes, as many as possible per pass, as long as they come in increasing order.

**Me:** Let me play the example `4 2 1 5 3`. Pass 1: I need 1; I walk past 4 and 2, take 1, then need 2, but 2 is behind me, so pass 1 ends having taken {1}. Pass 2: I take 2 at index 1, then need 3, which is at index 4, ahead of me, so I take it too. Then I need 4, at index 0, behind me. Pass 3: take 4, then 5 at index 3. Three passes.

**Interviewer:** Good.

**Me:** And the input is guaranteed to be a permutation of 1..n: no repeats, no missing numbers? That matters, because I'll want to index an array by value.

**Interviewer:** Guaranteed.

**Me:** Output is one integer. With n up to 2 · 10^5 I'll read with a `BufferedReader` and `StringTokenizer`.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 2 · 10^5 | n² is 4 · 10^10: a quadratic simulation is far too slow. n log n (about 3.5 · 10^6) and n are fine. |
| The array is a permutation of 1..n | Every value is a valid index into an array of size n + 1, and each value occurs once, so "the position of v" is well defined. |
| Time limit 1 s | Fast input: `BufferedReader` and `StringTokenizer`, not `Scanner`. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| A round takes as many numbers as possible, in increasing order | A round continues past each taken number; it is not "one number per round". |
| The output is one integer | One `println` at the end. The answer is at most n, so it fits in an `int`. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The n numbers may be split over lines differently from the statement | My reader takes tokens until it has n of them. It costs nothing and removes a failure mode. |

### Edge cases I will keep in mind

- n = 1: one round.
- Sorted array `1 2 … n`: one round.
- Reversed array `n … 2 1`: every number is to the left of the one before it, so n rounds, the most possible.
- A rotation such as `3 4 5 1 2`: two rounds.

## 4. Think out loud: from first idea to best solution

The statement hands me an algorithm: play the rounds. The ladder below starts there, finds that the only fact a round depends on is "which of k and k + 1 is further left", and then answers that question first by sorting, then by a direct lookup table.

### Alternative: simulate the rounds literally

This rung is too slow for the largest tests (26 s measured on a reversed array of 2 · 10^5 numbers, 12.5 s on a random one), so it is not a numbered approach. It is the baseline to state first, and it is what the tests compare the faster programs against on small inputs.

#### What I say out loud

> "The statement is a process, so the first correct program just runs it. I keep `next`, the smallest number not collected yet. Each round is one pass over the array; whenever the element equals `next`, I take it and increment `next`. I count passes until `next` passes n. It's correct by construction, but a pass costs n, and there can be n passes."

#### Intuition

The only state the process has is `next`. A pass over the array advances `next` past every number it meets in the right order.

#### Algorithm

1. Read n and the array `x`.
2. `next = 1`, `rounds = 0`.
3. While `next ≤ n`: `rounds++`; for i from 0 to n − 1, if `x[i] == next`, then `next++`.
4. Print `rounds`.

#### Why it is correct

- **It does exactly what a round is.** In one pass, an element is taken exactly when it equals the smallest number not yet taken, which is the statement's rule. Numbers are taken in increasing order, because `next` only grows by 1.
- **It terminates.** At the start of each round, the number `next` is somewhere in the array, and nothing larger than it can be taken before it, so the pass takes at least `next` itself. Each round takes at least one number, so there are at most n rounds.

#### Dry run

Input `5` / `4 2 1 5 3`

| Round | Index 0 (4) | Index 1 (2) | Index 2 (1) | Index 3 (5) | Index 4 (3) | Taken this round | `next` after |
|---|---|---|---|---|---|---|---|
| 1 | need 1, skip | skip | take 1 | need 2, skip | skip | 1 | 2 |
| 2 | need 2, skip | take 2 | need 3, skip | skip | take 3 | 2, 3 | 4 |
| 3 | take 4 | need 5, skip | skip | take 5 | need 6, skip | 4, 5 | 6 |

`next` = 6 > 5, so the loop stops after 3 rounds. Prints `3`.

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

    /** Plays the rounds literally: each round scans the whole array once, collecting `next` whenever it appears. */
    static int simulateRounds(int[] x) {
        int n = x.length;
        int next = 1;                              // the smallest number not collected yet
        int rounds = 0;
        while (next <= n) {
            rounds++;
            for (int i = 0; i < n; i++) {          // one left-to-right pass
                if (x[i] == next) {
                    next++;                        // collect it; now look for the following number
                }
            }
        }
        return rounds;
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

**O(n · r)**, where n is the array length and r the number of rounds (the answer): every round is a full pass of n steps. r ranges from 1 (sorted) to n (reversed), so the worst case is **O(n²)**: 4 · 10^10 steps at n = 2 · 10^5. Measured on my machine (JDK 26, whole program): 26 s on the reversed array, 12.5 s on a random permutation (which needs about n/2 rounds, see section 9). On a sorted array it is instant.

#### Space complexity

**O(n)** for the array; O(1) beyond it.

#### The bridge to the next approach

> "Look at what a round actually does after taking k: it continues to the right and takes k + 1 if and only if k + 1 is further right than k. If k + 1 is to the left, it has already been passed, and it waits for the next round, where it is taken for sure, since the round starts from the left with k + 1 as the needed number. So I don't need to replay passes. The round of k + 1 is the round of k, plus 1 exactly when k + 1 stands to the left of k. The answer is 1 plus the number of such k. To check that, I need the numbers in value order together with their positions. Sorting (value, index) pairs gives me exactly that list."

### Approach 1: Sort (value, index) pairs and count where the index goes back

#### What I say out loud

> "I pair each number with its index and sort the pairs by value. Walking the sorted list, I see the positions of 1, 2, 3, … in order. Every time the position drops, the next number is behind the previous one, so a new round starts. The answer is 1 plus the number of drops. This is O(n log n) for the sort."

#### Intuition

A round collects a run of consecutive numbers whose positions increase from left to right. Listing positions in value order, the rounds are the increasing stretches of that list, and a new stretch begins wherever the list goes down.

#### Algorithm

1. Read n and the array `x`.
2. For each index i, pack the pair into one `long`: `(x[i] << 32) | i`. Sorting these longs sorts by value (the high half), and the index is in the low half.
3. Sort the longs.
4. `rounds = 1`. For k from 1 to n − 1: if the index in entry k is smaller than the index in entry k − 1, `rounds++`.
5. Print `rounds`.

#### Why it is correct

The key fact, proved here once and used by every later approach on this page and on [[cses-collecting-numbers-ii|Collecting Numbers II]]:

> **Claim.** Let round(v) be the round in which the number v is collected. Then round(1) = 1, and for 1 ≤ k < n: round(k + 1) = round(k) if k + 1 stands to the right of k, and round(k) + 1 if it stands to the left.

- **Round 1 collects 1.** The first pass needs 1 from the start, and 1 is somewhere in the array.
- **If k + 1 is to the right of k:** in round(k), the pass takes k at its index, and from then on the needed number is k + 1. The pass continues right and reaches k + 1's index, where it takes it. Nothing can stop it: the needed number only changes when k + 1 is taken. So round(k + 1) = round(k).
- **If k + 1 is to the left of k:** k + 1 cannot be taken before k (numbers are taken in increasing order), and in round(k) the pass is already past k + 1's index when it takes k. So k + 1 is not taken in round(k). The next round starts at the left with k + 1 as the needed number, reaches its index, and takes it. So round(k + 1) = round(k) + 1.

The total number of rounds is round(n), and by the claim that is 1 plus the number of k where k + 1 stands left of k.

The program computes that number. After sorting, entry k − 1 holds the value k (the values are exactly 1..n, all distinct, so sorting by value places value k at entry k − 1) along with its index, and the loop counts the k where the index of k + 1 is smaller than the index of k. The packing is safe: values and indices are below 2^31, so `x[i] << 32` and `i` occupy separate halves of a 64-bit `long`, and comparing the longs compares the values first.

#### Dry run

Input `5` / `4 2 1 5 3`. Pairs (value, index): (4, 0), (2, 1), (1, 2), (5, 3), (3, 4). Sorted by value:

| Entry | Value | Index | Index smaller than previous? | rounds |
|---|---|---|---|---|
| 0 | 1 | 2 | (first) | 1 |
| 1 | 2 | 1 | yes, 1 < 2 | 2 |
| 2 | 3 | 4 | no | 2 |
| 3 | 4 | 0 | yes, 0 < 4 | 3 |
| 4 | 5 | 3 | no | 3 |

Prints `3`, and the rounds match the simulation: {1}, {2, 3}, {4, 5}.

#### Java code

```java title="Approach 1: sort (value, index) pairs"
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

        // Pack (value, index) into one long so that sorting the longs sorts by value.
        long[] byValue = new long[n];
        for (int i = 0; i < n; i++) {
            byValue[i] = ((long) x[i] << 32) | i;  // value in the high half, index in the low half
        }
        Arrays.sort(byValue);

        int rounds = 1;
        for (int k = 1; k < n; k++) {
            int previousIndex = (int) byValue[k - 1];   // low 32 bits: where the smaller value sits
            int currentIndex = (int) byValue[k];
            if (currentIndex < previousIndex) {         // the next value lies behind: a new round
                rounds++;
            }
        }
        System.out.println(rounds);
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

**O(n log n)** for sorting n longs, then O(n) for the pass. For `Arrays.sort(long[])` the JDK documentation's implementation note (Java 17) describes a dual-pivot quicksort that "offers O(n log(n)) performance on all data sets"; that describes the current implementation rather than a contract of the method. Measured: about 0.1 s for the whole program at n = 2 · 10^5, JVM start included.

#### Space complexity

**O(n)**: the input array and the n packed longs. The sort's own extra memory is an implementation detail of the JDK.

#### The bridge to the next approach

> "The sort works for any distinct values, but here I know more: the values are exactly 1..n. So I don't need to sort to find where each value sits. I can write `pos[x[i]] = i` while reading, and `pos` is the sorted list's index column, built in O(n) with no comparisons. It's a counting sort with one item per bucket."

### Approach 2: Positions array, count the k with pos[k + 1] < pos[k] (recommended)

#### What I say out loud

> "Since the array is a permutation of 1..n, I store `pos[v]`, the index of v, while reading. Then the answer is 1 plus the number of k from 1 to n − 1 with `pos[k + 1] < pos[k]`: each of those is a place where the next number sits behind the current one and must wait for a new round. One pass to read, one pass to count: O(n)."

#### Intuition

The rounds are the maximal runs 1..a, a + 1..b, … of consecutive numbers whose positions increase. Count where a run breaks.

#### Algorithm

1. Read n. For i from 0 to n − 1, read v and set `pos[v] = i` (`pos` has size n + 1; `pos[0]` is unused).
2. `rounds = 1`. For k from 1 to n − 1: if `pos[k + 1] < pos[k]`, `rounds++`.
3. Print `rounds`.

#### Why it is correct

- `pos` is well defined: the input is a permutation, so every v in 1..n is written exactly once, and no index is out of bounds.
- By the claim proved in Approach 1, the number of rounds is 1 plus the number of k with k + 1 to the left of k, that is, with `pos[k + 1] < pos[k]`. The loop counts exactly those k.

**The 20-second version:** "A round that has just taken k goes on to take k + 1 if and only if k + 1 is to its right; otherwise k + 1 waits exactly one round. So the round number goes up by one at each k where `pos[k + 1] < pos[k]`, and the answer is 1 plus the count of those."

#### Dry run

Input `5` / `4 2 1 5 3`: `pos[1] = 2`, `pos[2] = 1`, `pos[3] = 4`, `pos[4] = 0`, `pos[5] = 3`.

| k | pos[k] | pos[k + 1] | pos[k + 1] < pos[k]? | rounds |
|---|---|---|---|---|
| start | | | | 1 |
| 1 | 2 | 1 | yes | 2 |
| 2 | 1 | 4 | no | 2 |
| 3 | 4 | 0 | yes | 3 |
| 4 | 0 | 3 | no | 3 |

Prints `3`.

Second input, the official test `5` / `5 4 2 3 1`: `pos` = [_, 4, 2, 3, 1, 0]. k = 1: 2 < 4, yes; k = 2: 3 < 2, no; k = 3: 1 < 3, yes; k = 4: 0 < 1, yes. Rounds 1 + 3 = 4, as expected.

#### Java code

```java title="Approach 2: positions array (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] pos = new int[n + 1];                // pos[v] = index of the number v in the array
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < n; i++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            pos[Integer.parseInt(st.nextToken())] = i;
        }

        int rounds = 1;                            // n >= 1: the number 1 needs a first round
        for (int v = 1; v < n; v++) {
            if (pos[v + 1] < pos[v]) {             // v + 1 sits before v: it waits for the next round
                rounds++;
            }
        }
        System.out.println(rounds);
    }
}
```

#### Time complexity

**O(n)**: one pass to read and fill `pos`, one pass of n − 1 comparisons. Measured: about 0.06 s for the whole program at n = 2 · 10^5 (reversed and random), JVM start included; reading the input dominates.

#### Space complexity

**O(n)** for `pos`. The input array itself is never stored, so this is no more memory than holding the input.

## 5. Comparison table

n is the array length and r the number of rounds (the answer, 1 ≤ r ≤ n).

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Alt. Simulate the rounds | O(n · r), about n²/2 on a random permutation | O(n²) on a reversed array: 26 s measured at n = 2 · 10^5 | O(n) array |
| 1. Sort (value, index) pairs | O(n log n) | O(n log n) per the JDK implementation note | O(n) array + n longs |
| 2. Positions array | O(n) | O(n) | O(n) `pos` only |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Alt. Simulate | No insight needed; correct by construction; a brute force for testing | Quadratic; misses the structure | To state the baseline, and as the test oracle |
| 1. Sort pairs | Works for any distinct values, not only 1..n | n log n; the packing trick needs explaining | If the values were arbitrary distinct integers |
| 2. Positions array | Linear, shortest, no sort | Needs values that are valid indices (here 1..n) | The CSES submission and the interview answer |

## 6. Which solution to give, and when to stop optimizing

**The solution I recommend:** Approach 2. It is linear, about ten lines, and its correctness rests on one claim that takes twenty seconds to say. Approach 1 is worth mentioning as what you would do if the values were not exactly 1..n.

**Is it optimal?** In the worst case a correct algorithm must inspect essentially every element. Take the sorted array: it needs 1 round, and swapping any two of its entries gives another valid input that needs at least 2 (only a sorted array takes 1 round). An algorithm that left two entries unread could not tell those inputs apart, so on sorted input it must read at least n − 1 entries. That is an Ω(n) worst-case lower bound, and Approach 2 meets it. Stop here; the only remaining cost is reading the input.

**In an interview,** start by playing the example, say the simulation and its O(n²) cost in one breath, then state the claim about k and k + 1 and prove it before writing code. The proof is what the interviewer is looking for; the code is short.

## 7. Interview script: code it and test it

### What I say while coding

> "I don't store the array at all: while reading, `pos[value] = index`. `pos` has size n + 1 so that I can index it by value directly."

> "`rounds` starts at 1, because the number 1 always needs a first round, and n ≥ 1. Then each k from 1 to n − 1 with `pos[k + 1] < pos[k]` adds one."

> "The loop runs to n − 1, not n, because `pos[n + 1]` doesn't exist."

### Testing out loud

**Example `4 2 1 5 3`:** breaks at k = 1 and k = 3, so 3. Matches the hand simulation.

**n = 1:** the loop does not run, 1 round.

**Sorted `1 2 3 4 5 6`:** no breaks, 1 round.

**Reversed `6 5 4 3 2 1`:** every k breaks, 1 + 5 = 6 rounds, one number per round.

**Rotation `3 4 5 1 2`:** only k = 2 breaks (3 is to the left of 2), so 2 rounds: {1, 2}, then {3, 4, 5}.

**Evens then odds `2 4 6 1 3 5`:** the breaks are at k = 1, 3, 5, where k + 1 is even and stands to the left of k, so 1 + 3 = 4 rounds: {1}, {2, 3}, {4, 5}, {6}. (It is tempting to guess {1, 2}, {3, 4}, …; playing the first round shows 2 is already behind when 1 is taken.)

**n = 2 · 10^5:** two passes and 2 · 10^5 tokens; the tests run reversed (2 · 10^5 rounds), random and evens-then-odds inputs at this size.

**Official tests:** CSES has 4 official tests for this problem; the site stores the one small enough to keep (`5 4 2 3 1`, expected 4), and all three programs on this page print 4 on it, run on a real JVM. The larger official tests are not stored with the site, so I could not run them; the page's tests cover their sizes with n = 2 · 10^5 inputs checked against the simulation's rule and against every permutation of n ≤ 7.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify and play the example | 2 min | Permutation guaranteed; a round takes as many as possible |
| Baseline | 1 min | Simulation, O(n · r), O(n²) when reversed |
| Insight and proof | 3 min | k + 1 left of k costs one round; the claim and its two cases |
| Code | 3 min | `pos` while reading, one counting pass |
| Test | 2 min | Example, n = 1, sorted, reversed |

If stuck, write the example's positions under the values (1 at 2, 2 at 1, 3 at 4, 4 at 0, 5 at 3) and mark each place where the position goes down.

## 9. Interviewer challenges

### About the reasoning

#### Why does a "k + 1 to the left" cost exactly one round, not more?

**What they are testing:** whether the claim is proved in both directions, not just observed.

**How to reason:** k + 1 is missed in round(k); what happens at the start of the next round?

**What I say:** "In round(k) the pass is already beyond k + 1 when it takes k, so k + 1 is missed. But the next round starts from the left with k + 1 as the needed number, and nothing smaller is left to take, so it reaches k + 1 and takes it. So it is exactly one extra round, never two. And if k + 1 is to the right, the same pass reaches it after taking k, so zero extra rounds."

**Nuance:** the "never two" half is the one candidates skip. Without it you only have an upper bound on the rounds.

#### On a random permutation, about how many rounds are there?

**What they are testing:** turning the formula into a quick estimate, and linearity of expectation.

**How to reason:** each of the n − 1 pairs (k, k + 1) is in either order with equal probability.

**What I say:** "Each k breaks with probability 1/2, so by linearity of expectation the expected answer is 1 + (n − 1)/2 = (n + 1)/2. That's why the simulation is still about n²/2 steps on random input, not just on the reversed one; my random test at n = 2 · 10^5 gave 99,925 rounds."

**Nuance:** this is a good reason not to defend the simulation with "the worst case is rare". The typical case is quadratic too.

### About the implementation

#### Can you do it without the extra array?

**What they are testing:** whether you know what the `pos` array costs and replaces.

**How to reason:** what does the program store?

**What I say:** "The program never stores the input, only `pos`, which is the input inverted: n + 1 ints. So the auxiliary memory equals what storing the input would cost. To do better I'd have to answer 'where is k + 1?' without remembering positions, which means rescanning, and that is the simulation again."

**Nuance:** with a writable input array you could invert the permutation in place by following cycles, but that is more code for no gain here.

#### What if the values were arbitrary distinct integers, not 1..n?

**What they are testing:** knowing which assumption each approach uses.

**How to reason:** the claim only needs "the next larger value" and positions.

**What I say:** "Then 'k + 1' becomes 'the next larger value', and I can't index an array by value. Approach 1 handles it unchanged: sort (value, index) pairs and count where the index goes down. O(n log n)."

**Nuance:** with values up to about 10^6 a `pos` array over the value range still works, O(n + V) for a value range of size V, skipping values that are absent.

## 10. Follow-up questions the interviewer might ask

**"Now the array changes: m swaps, and you report the rounds after each one."**
Recomputing is O(n) per swap. A swap moves only two numbers, so only the pairs (k, k + 1) containing one of them can change; update just those, carefully when the two numbers are consecutive. O(1) per swap. That is [[cses-collecting-numbers-ii|Collecting Numbers II]].

**"Print the numbers collected in each round."**
Walk k from 1 to n with `pos`; start a new line before k + 1 whenever `pos[k + 1] < pos[k]`. O(n).

**"Each round may walk the array in either direction, alternating left-to-right and right-to-left."**
The rule changes: in a left-to-right round k + 1 must be to the right, in a right-to-left round to the left. Walk k with `pos` and the current direction; when the next number is in the wrong direction, start a new round in the other direction and check again. Still O(n).

**"The array holds distinct values, not 1..n."**
Approach 1: sort (value, index) pairs. O(n log n).

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Counting inversions instead of breaks.** The number of pairs out of order is not the answer; only consecutive numbers k and k + 1 matter. `4 2 1 5 3` has 5 inversions ((4, 2), (4, 1), (4, 3), (2, 1), (5, 3)) but needs 3 rounds.
- **Comparing neighbours in the array instead of neighbours in value.** Counting i with `x[i + 1] < x[i]` (descents of the array) is a different quantity: for `4 2 1 5 3` it gives 3 descents, so 4 "rounds", against the correct 3 (I ran it).
- **Assuming the simulation is fine because the worst case is rare.** A random permutation needs about n/2 rounds, so the simulation is quadratic on typical input too.

### Implementation mistakes

> [!MISTAKE] Starting the count at 0
> With `int rounds = 0`, the example prints `2` instead of `3` (verified). The breaks count the rounds *after* the first; the first round always exists.

- **Looping k up to n.** `pos[k + 1]` with k = n reads index n + 1, out of bounds for an array of size n + 1.
- **Sizing `pos` as n.** Values run from 1 to n, so `pos[n]` needs an array of size n + 1.
- **Packing without a cast.** In Approach 1, `x[i] << 32` on an `int` shifts by 32 mod 32 = 0 bits; it must be `(long) x[i] << 32`.

## 12. Pattern recognition

**The pattern:** "sorting by position": look at the elements in value order and ask about their positions, using an inverse permutation (`pos[value] = index`) when the values are 1..n. A process described step by step often reduces to a count over adjacent values.

**Signals in the problem statement:**

- "each number between 1 and n exactly once": the values are indices, so a positions array replaces sorting.
- A repeated process ("on each round, go through the array…"): simulate on paper, then find what decides each step.
- "collect in increasing order": what matters is the relative position of consecutive values.

**Related problems in this list:**

- [[cses-collecting-numbers-ii|Collecting Numbers II]]: the same count, maintained while two numbers are swapped m times.
- [[cses-sorting-methods|Sorting Methods]]: more questions about a permutation answered through its structure instead of by simulating sorts.
- [[cses-bubble-sort-rounds-i|Bubble Sort Rounds I]]: count the passes of a sorting process without running it.
- [[cses-missing-number|Missing Number]]: values 1..n used as indices.
- [[nc-first-missing-positive|First Missing Positive]]: placing each value at the index it names.

**Takeaway:** when a process collects 1..n in order, the only thing that matters is whether k + 1 stands before or after k. Build `pos`, count the breaks, add one.

## 13. 60-second revision card

**Key insight:** k + 1 is taken in the same round as k if it is to the right of k, and in the next round if it is to the left.

**Invariant:** after checking k, `rounds` = the round in which k + 1 is collected.

**Complexity:** O(n) time, O(n) space.

**Code skeleton:**

```java title="Collecting Numbers, positions array"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] pos = new int[n + 1];
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < n; i++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(in.readLine());
            pos[Integer.parseInt(st.nextToken())] = i;
        }
        int rounds = 1;
        for (int v = 1; v < n; v++) if (pos[v + 1] < pos[v]) rounds++;
        System.out.println(rounds);
    }
}
```

**Main traps:**

- Start at 1 round, not 0.
- Compare positions of consecutive *values*, not consecutive array entries.
- `pos` has size n + 1; loop k only to n − 1.

**What to say in one breath:** "A round that just took k takes k + 1 too if k + 1 is to its right, and otherwise k + 1 waits exactly one round. So I store each value's position and answer 1 plus the number of k with `pos[k + 1] < pos[k]`: O(n), and in the worst case essentially every entry has to be read anyway."
