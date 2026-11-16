---
problemId: cses-ferris-wheel
title: Ferris Wheel
source: cses
sourceUrl: https://cses.fi/problemset/task/1090
difficulty: easy
patterns: [sorting-searching, two-pointers, greedy, sorting]
relatedLessons: [a2-two-pointers, a10-sorting-greedy, a2-sorting-based, a10-local-vs-global, a1-java-syntax-competitive, a14-brute-force-first]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

n children want to ride a Ferris wheel. Each gondola holds one or two children, and the total weight in a gondola may not exceed x. Given every child's weight, print the smallest number of gondolas that seats everyone. This is a whole program: it reads standard input and writes standard output.

**Example 1** (the CSES example)

- Input: `4 10` on the first line, `7 2 3 9` on the second
- Output: `3`
- Why: the child weighing 9 can share only with someone weighing at most 1, and nobody does, so they ride alone. The other three, 7, 2 and 3, cannot all share one gondola (at most two per gondola), so they need two more: for example `{7, 2}` and `{3}`, or `{7, 3}` and `{2}`.

**Example 2** (an extra example: the CSES statement has only one)

- Input: `4 10` / `1 2 8 9`
- Output: `2`
- Why: `{1, 9}` and `{2, 8}` both weigh exactly 10. Pairing the two lightest, `{1, 2}`, would leave 8 and 9, who cannot share (17 > 10): three gondolas.

**What the problem statement guarantees**

- 1 ≤ n ≤ 2 · 10^5.
- 1 ≤ x ≤ 10^9.
- 1 ≤ p_i ≤ x: every child fits in a gondola alone.
- Input: n and x on the first line, the n weights on the second. Output: one integer.
- Time limit: 1 second (memory limit 512 MB).

## 2. Practice first: try it before reading on

If you have not solved this yourself yet, stop here. Like most pairing problems, the code is short and the reasoning is the work: a natural-looking rule fails on Example 2. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 15 minutes.
2. Solve Example 2 by hand. Then write a rule that forms gondolas one at a time and test it on Example 2 and on a few inputs of your own.
3. Explain, in a few sentences, why your rule can never use more gondolas than the best arrangement.
4. Estimate its cost at n = 2 · 10^5.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> Which child is the hardest to place? Decide about that child first.

> [!HINT] Hint 2: the kind of tool you need
> In increasing order of weight, the heaviest child is at one end and the child most likely to fit beside them is at the other end.

> [!HINT] Hint 3: almost the whole plan
> Sort the weights. Keep one index at the lightest waiting child and one at the heaviest. If the two fit together, seat them both; otherwise the heaviest rides alone. Count one gondola per step and stop when the indices cross. Then argue why pairing the heaviest with the lightest never costs a gondola.

**Check yourself before revealing the walkthrough**

- [ ] I can say why pairing the two lightest children is wrong
- [ ] I can prove that the heaviest child loses nothing by sharing with the lightest
- [ ] My program prints 1 for a single child, and counts the last child when the indices meet
- [ ] I know whether p_i + p_j can overflow an `int`

## 3. Interview script: understand the problem (≈1 min)

Treat it as if an interviewer had posed it. The questions are about capacity, the weight limit, and the input size.

**Me:** I read n and x, then n weights, and print the fewest gondolas. Each gondola takes one or two children, never three, and the total in a gondola is at most x, so exactly x is allowed?

**Interviewer:** Yes, at most two children, and a total of exactly x is fine.

**Me:** Can a child be heavier than x on their own?

**Interviewer:** No, every weight is at most x.

**Me:** Good, so the answer always exists and is at most n. And it's at least ⌈n / 2⌉, since a gondola holds two. Let me do Example 1 by hand: `7 2 3 9`, x = 10. 9 fits with nobody, so it's alone. 7, 2, 3 need at least two gondolas because three children can't share one, and two suffice. So 3.

**Interviewer:** Right.

**Me:** Weights and x up to 10^9: two weights add up to at most 2 · 10^9, which is below 2^31 − 1, so `int` addition is safe. n up to 2 · 10^5, so I'll read with a `BufferedReader` and aim for O(n log n).

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 2 · 10^5 | n² is 4 · 10^10: comparing every pair is too slow. Sorting is fine. |
| 1 ≤ p_i ≤ x ≤ 10^9 | Every child fits alone, so the answer is at most n. p_i + p_j ≤ 2 · 10^9 < 2^31 − 1, so `int` is enough. |
| Time limit 1 s | Fast input; one `println`. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| At most two children per gondola | The answer is n minus the number of pairs; the task is to form as many fitting pairs as possible. |
| A total of exactly x is allowed | The test is `p[i] + p[j] <= x`. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The weights may be split over lines differently from the statement | My reader takes tokens wherever they are. It costs nothing. |

### Edge cases I will keep in mind

- n = 1: one gondola.
- Nobody fits with anybody (every weight above x / 2): n gondolas.
- Everybody fits with everybody: ⌈n / 2⌉, so an odd n leaves one child alone.
- Pairs that weigh exactly x, and pairs that weigh x + 1.
- Weights at 10^9.

## 4. Think out loud: from first idea to best solution

Each gondola holds one or two children, so the number of gondolas is n minus the number of shared gondolas. Minimizing gondolas means finding as many disjoint pairs that fit as possible. The ladder goes from trying every pairing, through a rule that fails, to the heaviest-child rule with a slow partner search, a faster search, and finally two pointers.

### Alternative: try every pairing

This rung is exponential: a baseline and a checker for tiny inputs (0.9 s measured at n = 16 when everybody fits with everybody, 17.3 s at n = 18), so it is not a numbered approach.

#### What I say out loud

> "Safe first version: take the first child not yet seated. Either they ride alone, or they ride with some other waiting child who fits. Recurse on the rest and take the minimum. It's correct by construction but the number of pairings grows faster than exponentially."

#### Intuition

Every seating plan seats the first waiting child somehow: alone or with one specific partner. Trying all of those choices, recursively, covers every plan.

#### Algorithm

1. `fewest()`: find the first unseated child i. If none, return 0.
2. Seat i. `best = 1 + fewest()` (i alone).
3. For every unseated j > i with `p[i] + p[j] <= x`: seat j, `best = min(best, 1 + fewest())`, unseat j.
4. Unseat i and return `best`.

#### Why it is correct

- **Only valid plans:** each gondola it forms has one child, or two whose total is at most x; the `seated` flags keep every child in exactly one gondola.
- **Cannot miss one:** in any plan, the first waiting child is alone or with exactly one partner, and the recursion tries every option; by induction it covers the rest of the plan.

#### Dry run

Example 2: `4 10` / `1 2 8 9`. The first child (weight 1) has four options; the best for the rest is found the same way.

| Child 1 rides | Remaining | Best for the remaining | Total |
|---|---|---|---|
| alone | 2, 8, 9 | 2 (`{2, 8}`, `{9}`) | 3 |
| with 2 | 8, 9 | 2 (17 > 10) | 3 |
| with 8 | 2, 9 | 2 (11 > 10) | 3 |
| with 9 | 2, 8 | 1 (`{2, 8}`) | 2 |

The minimum is 2.

#### Java code

```java title="Alternative: try every pairing (exponential)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    static BufferedReader in;
    static StringTokenizer st;

    public static void main(String[] args) throws IOException {
        in = new BufferedReader(new InputStreamReader(System.in));
        st = new StringTokenizer("");
        int n = nextInt(), x = nextInt();
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = nextInt();
        System.out.println(fewestByTryingAll(p, x, new boolean[n]));
    }

    /** The fewest gondolas for the children not yet seated. */
    static int fewestByTryingAll(int[] p, int x, boolean[] seated) {
        int i = 0;
        while (i < p.length && seated[i]) {
            i++;                                                 // first child still waiting
        }
        if (i == p.length) {
            return 0;
        }
        seated[i] = true;
        int best = 1 + fewestByTryingAll(p, x, seated);         // child i rides alone
        for (int j = i + 1; j < p.length; j++) {
            if (!seated[j] && p[i] + p[j] <= x) {               // at most 2 * 10^9: fits in an int
                seated[j] = true;                                // child i rides with child j
                best = Math.min(best, 1 + fewestByTryingAll(p, x, seated));
                seated[j] = false;
            }
        }
        seated[i] = false;
        return best;
    }

    static int nextInt() throws IOException {
        while (!st.hasMoreTokens()) {
            st = new StringTokenizer(in.readLine());
        }
        return Integer.parseInt(st.nextToken());
    }
}
```

#### Time complexity

**Exponential in the worst case**, n being the number of children. When everybody fits with everybody, the calls follow every way to split the children into singles and pairs, a number that grows faster than any c^n. Measured: 0.07 s at n = 14, 0.9 s at n = 16, 17.3 s at n = 18, all weights 1 and x = 10^9.

#### Space complexity

**O(n)**: the weights, the flags and a recursion depth of at most n.

#### The bridge to the next approach

> "I want a rule. The first one that comes to mind: sort and pair the lightest children together, since light children fit together most easily. Let me test it on Example 2."

### A greedy rule that fails: pair the lightest children together

Sorted `1 2 8 9` with x = 10: pairing neighbours from the light end gives `{1, 2}`, then 8 and 9 do not fit (17 > 10), so `{8}` and `{9}`: **3** gondolas instead of 2 (verified). Pairing neighbours in input order fails on the same input the same way.

> "The light children are the valuable ones: they are the only possible partners for the heavy children. Spending two light children on each other wastes that. The child with the fewest options is the heaviest, so decide about the heaviest first."

### Alternative: heaviest first, scan for the heaviest partner who fits

This rung is correct but O(n²) when few children fit together: 10.6 s measured at n = 2 · 10^5 with every weight above x / 2, so it is not a numbered approach.

#### What I say out loud

> "Sort. Take the heaviest waiting child. Among the others still waiting, find the heaviest one who still fits with them, so that no capacity is wasted, and seat them together; if nobody fits, the heaviest rides alone. Finding the partner is a scan downwards through the sorted weights."

#### Intuition

The heaviest child has the fewest possible partners, so settle them first. Giving them the heaviest partner who fits ("best fit") leaves the lighter, more flexible children for later.

#### Algorithm

1. Sort `p` ascending; `seated[]` all false; `gondolas = 0`.
2. For h from n − 1 down to 0, skipping seated children: seat h; scan j from h − 1 down to 0 for the first unseated child with `p[j] + p[h] <= x`; if found, seat j. `gondolas++`.
3. Print `gondolas`.

#### Why it is correct

Let h be the heaviest waiting child and w the heaviest waiting child who fits with h. If nobody fits, h rides alone in every plan. Otherwise take any optimal plan for the waiting children and rearrange it so that h rides with w, without adding a gondola:

- **h with w already:** done.
- **h alone, w alone:** merge them; that would beat an optimal plan, so it cannot happen.
- **h alone, w with y:** move w to h; y rides alone. Same count.
- **h with z, w alone:** swap z and w; z rides alone. Same count.
- **h with z, w with y:** swap z and w, giving `{h, w}` and `{z, y}`. `{h, w}` fits by choice of w. z fits with h, so z is no heavier than w (w is the heaviest who fits), so z + y ≤ w + y ≤ x. Same count.

Repeating the argument on the children left proves the whole plan optimal.

#### Dry run

Example 1: sorted `2 3 7 9`, x = 10.

| Heaviest waiting | Scan for a partner (heaviest first) | Gondola | gondolas |
|---|---|---|---|
| 9 | 7 (16), 3 (12), 2 (11): none fits | `{9}` | 1 |
| 7 | 3 (10) fits | `{7, 3}` | 2 |
| 2 | nobody left | `{2}` | 3 |

Prints `3`.

#### Java code

```java title="Alternative: heaviest first, scan for a partner (O(n²) in the worst case)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Main {
    static BufferedReader in;
    static StringTokenizer st;

    public static void main(String[] args) throws IOException {
        in = new BufferedReader(new InputStreamReader(System.in));
        st = new StringTokenizer("");
        int n = nextInt(), x = nextInt();
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = nextInt();

        Arrays.sort(p);
        boolean[] seated = new boolean[n];
        int gondolas = 0;
        for (int h = n - 1; h >= 0; h--) {                       // heaviest waiting child first
            if (seated[h]) {
                continue;
            }
            seated[h] = true;
            int partner = heaviestPartner(p, x, seated, h);
            if (partner >= 0) {
                seated[partner] = true;
            }
            gondolas++;
        }
        System.out.println(gondolas);
    }

    /** The heaviest waiting child below index h who fits with child h, or -1. */
    static int heaviestPartner(int[] p, int x, boolean[] seated, int h) {
        for (int j = h - 1; j >= 0; j--) {                       // scan down from the heaviest
            if (!seated[j] && p[j] + p[h] <= x) {
                return j;
            }
        }
        return -1;
    }

    static int nextInt() throws IOException {
        while (!st.hasMoreTokens()) {
            st = new StringTokenizer(in.readLine());
        }
        return Integer.parseInt(st.nextToken());
    }
}
```

#### Time complexity

**O(n²) in the worst case**: when nobody fits with anybody, each of the n children scans all lighter children, n(n − 1)/2 checks in total. Measured 10.6 s at n = 2 · 10^5 with all weights above x / 2. When partners are found near the top of the scan it is much faster, but a correct bound must cover the bad case.

#### Space complexity

**O(n)** for the weights and the flags.

#### The bridge to the next approach

> "The scan answers 'the heaviest waiting weight that is at most x − h'. That is a floor query on a multiset with deletions: a `TreeMap` from weight to count does it in O(log n)."

### Approach 1: Best fit with a TreeMap

#### What I say out loud

> "I keep the waiting children in a `TreeMap` from weight to count. Each step removes the heaviest, then asks `floorKey(x − heaviest)` for the heaviest partner who fits, and removes them too if there is one. One gondola per step."

#### Intuition

Same rule as the scan, with the search done by an ordered map.

#### Algorithm

1. Put every weight into `waiting` (weight → count).
2. While `waiting` is not empty: remove one child of weight `h = lastKey()`; `partner = floorKey(x − h)`; if not null, remove one child of that weight; `gondolas++`.
3. Print `gondolas`.

#### Why it is correct

`floorKey(x − h)` is the largest waiting weight w with w ≤ x − h, that is with w + h ≤ x: exactly the heaviest waiting child who fits. So every step is the best-fit choice, proved optimal in the previous alternative. Removing h before the query keeps h from being paired with itself; the counts keep children of equal weight separate.

#### Dry run

Example 1: `waiting = {2, 3, 7, 9}`, x = 10.

| Heaviest | x − h | `floorKey` | Gondola | gondolas |
|---|---|---|---|---|
| 9 | 1 | none | `{9}` | 1 |
| 7 | 3 | 3 | `{7, 3}` | 2 |
| 2 | 8 | none (map empty) | `{2}` | 3 |

Prints `3`.

#### Java code

```java title="Approach 1: best fit with a TreeMap"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;
import java.util.TreeMap;

public class Main {
    static BufferedReader in;
    static StringTokenizer st;

    public static void main(String[] args) throws IOException {
        in = new BufferedReader(new InputStreamReader(System.in));
        st = new StringTokenizer("");
        int n = nextInt(), x = nextInt();
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = nextInt();

        Arrays.sort(p);
        TreeMap<Integer, Integer> waiting = new TreeMap<>();     // weight -> children of that weight
        for (int w : p) waiting.merge(w, 1, Integer::sum);
        int gondolas = 0;
        while (!waiting.isEmpty()) {
            int heaviest = waiting.lastKey();
            take(waiting, heaviest);
            Integer partner = waiting.floorKey(x - heaviest);   // heaviest child who still fits
            if (partner != null) {
                take(waiting, partner);
            }
            gondolas++;
        }
        System.out.println(gondolas);
    }

    static void take(TreeMap<Integer, Integer> waiting, int weight) {
        int count = waiting.get(weight);
        if (count == 1) {
            waiting.remove(weight);
        } else {
            waiting.put(weight, count - 1);
        }
    }

    static int nextInt() throws IOException {
        while (!st.hasMoreTokens()) {
            st = new StringTokenizer(in.readLine());
        }
        return Integer.parseInt(st.nextToken());
    }
}
```

(The sort is not needed for correctness here; it only makes the insertions arrive in order.)

#### Time complexity

**O(n log n) in the worst case**: n insertions and at most n removals and floor queries, each O(log n) in a red-black tree. Measured 0.24–0.31 s for the whole program at n = 2 · 10^5.

#### Space complexity

**O(n)**: a boxed tree node per distinct weight, tens of bytes each.

#### The bridge to the next approach

> "Do I really need the *heaviest* partner who fits? In the exchange argument, the only delicate step was showing that the two old partners still fit together. If I pair h with the lightest waiting child instead, that step still works, now because h is the heaviest. And the lightest waiting child is just the left end of the sorted array, so a second index replaces the tree."

### Approach 2: Sort, then heaviest with lightest, two pointers (recommended)

#### What I say out loud

> "Sort the weights. Look at the heaviest waiting child. If even the lightest waiting child doesn't fit with them, nobody does, so they ride alone. If the lightest fits, seat them together. Either way one gondola leaves with the heaviest child. Two indices, one at each end, moving inwards."

#### Intuition

The heaviest child is the hardest to place: anyone who fits with them fits with anyone else. The lightest child is the most flexible partner: if they don't fit beside the heaviest, nobody does. Pairing the hardest with the most flexible wastes nothing ([[a10-sorting-greedy|Sorting + greedy]] run with [[a2-two-pointers|two pointers]]).

#### Algorithm

1. Sort `p` ascending.
2. `i = 0` (lightest waiting), `j = n − 1` (heaviest waiting), `gondolas = 0`.
3. While `i <= j`:
   - If `i < j` and `p[i] + p[j] <= x`: the lightest boards too, `i++`.
   - The heaviest always boards: `j--`. `gondolas++`.
4. Print `gondolas`.

When `i == j`, one child is left; the `i < j` test keeps them from being paired with themselves, and they get one gondola.

#### Why it is correct

Let h be the heaviest waiting child and l the lightest.

**Case 1: l + h > x.** Everybody else weighs at least l, so nobody fits with h. h rides alone in every plan.

**Case 2: l + h ≤ x.** Take any optimal plan for the waiting children and rearrange it so that h rides with l, without adding a gondola:

- **h with l already:** done.
- **h alone, l alone:** merging them would beat an optimal plan, so this cannot happen.
- **h alone, l with y:** move l to h; y rides alone. Same count.
- **h with z, l alone:** swap z and l. Same count.
- **h with z, l with y:** swap z and l, giving `{h, l}` and `{z, y}`. `{h, l}` fits by the case assumption. y is no heavier than h (h is the heaviest), so z + y ≤ z + h ≤ x, the last step because z and h shared. Same count.

So some optimal plan seats h with l, which is what the algorithm does; repeating the argument on the children left gives the minimum. The last case uses both facts: "l is the lightest" to know `{h, l}` fits, "h is the heaviest" to know `{z, y}` still fits.

**Termination:** every iteration decreases j, so there are at most n iterations.

**The 25-second version to say to the interviewer:**

> "Sort, and look at the heaviest child. If the lightest doesn't fit with them, nobody does, so they ride alone. If the lightest fits, take any optimal plan and swap the heaviest child's partner with the lightest child: the new pair fits by assumption, and the two old partners fit together because the lightest's old partner weighs no more than the heaviest child. So pairing them never costs a gondola."

#### Dry run

Example 1: sorted `2 3 7 9`, x = 10.

| i | j | p[i] + p[j] | Fits? | Gondola | gondolas |
|---|---|---|---|---|---|
| 0 | 3 | 2 + 9 = 11 | no | `{9}` | 1 |
| 0 | 2 | 2 + 7 = 9 | yes | `{2, 7}` | 2 |
| 1 | 1 | (i == j) | one child left | `{3}` | 3 |

Now i = 1 > j = 0: prints `3`. Best fit paired 7 with 3; this pairs 7 with 2. Different plans, same count.

#### Java code

```java title="Approach 2: sort, heaviest with lightest (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Main {
    static BufferedReader in;
    static StringTokenizer st;

    public static void main(String[] args) throws IOException {
        in = new BufferedReader(new InputStreamReader(System.in));
        st = new StringTokenizer("");
        int n = nextInt(), x = nextInt();
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = nextInt();

        Arrays.sort(p);
        int i = 0;                                               // lightest child still waiting
        int j = n - 1;                                           // heaviest child still waiting
        int gondolas = 0;
        while (i <= j) {                                         // i == j: one child left
            if (i < j && p[i] + p[j] <= x) {
                i++;                                             // the lightest rides with the heaviest
            }
            j--;                                                 // the heaviest leaves in this gondola
            gondolas++;
        }
        System.out.println(gondolas);
    }

    static int nextInt() throws IOException {
        while (!st.hasMoreTokens()) {
            st = new StringTokenizer(in.readLine());
        }
        return Integer.parseInt(st.nextToken());
    }
}
```

#### Time complexity

**O(n log n)**: the sort, then at most n loop iterations of O(1). For `Arrays.sort(int[])` the JDK documentation's implementation note (Java 17) describes a dual-pivot quicksort that "offers O(n log(n)) performance on all data sets", a description of the implementation rather than a contract. Measured 0.14–0.15 s for the whole program at n = 2 · 10^5.

#### Space complexity

**O(n)** for the weights; O(1) beyond them, apart from the sort's internal memory (an implementation detail).

## 5. Comparison table

n is the number of children. Nothing here hashes or uses randomness, so expected and worst case coincide.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Alt. Try every pairing | exponential | exponential; 17.3 s at n = 18 | O(n) |
| Pair the lightest together (wrong) | O(n log n) | O(n log n) | O(n) |
| Alt. Heaviest first, scan for a partner | O(n²) | O(n²); 10.6 s at n = 2 · 10^5 | O(n) |
| 1. Best fit with a TreeMap | O(n log n) | O(n log n) | O(n), boxed nodes |
| 2. Heaviest with lightest, two pointers | O(n log n) | O(n log n) | O(n) primitive array |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Alt. Try every pairing | Correct by definition | Exponential | A checker for tiny inputs |
| Pair the lightest together | Simple | Wrong (Example 2) | Never; it motivates deciding about the heaviest first |
| Alt. Scan for a partner | The right idea, no data structure | Quadratic | To state the rule before optimizing it |
| 1. TreeMap best fit | Same answer; generalizes to "heaviest partner who fits" queries | Boxing, larger constant | When children arrive over time or the structure is needed anyway |
| 2. Two pointers | Simplest, fastest, deterministic | Needs all weights up front | The submission and the interview answer |

## 6. Which solution to give, and when to stop optimizing

**The solution I recommend:** Approach 2. It is a dozen lines, uses only a primitive array, and the exchange argument for it is short. Mention the TreeMap best fit only as a correct alternative or if the interviewer asks about other partner choices.

**Is it optimal?** The sort dominates; the loop is linear. Weights go up to 10^9, so no counting sort. (When the weights are small, as in [[nc-boats-to-save-people|Boats to Save People]], a counting sort makes the whole thing O(n + x).) Stop here.

## 7. Interview script: code it and test it

### What I say while coding

> "`while (i <= j)`, not `<`: when the indices meet, one child is left and still needs a gondola."

> "`i < j` inside the test, so the last child isn't paired with themselves. Without it the count happens to come out the same, but it reads like a bug."

> "p[i] + p[j] ≤ 2 · 10^9, which fits in an `int`."

### Testing out loud

**Example 1:** traced above, 3.

**Example 2, `1 2 8 9`, x = 10:** 1 + 9 fits, 2 + 8 fits: 2.

**n = 1:** i = j = 0, one iteration, 1.

**Nobody fits, every weight above x / 2:** every step seats only the heaviest: n.

**Everybody fits:** every step seats two until one or zero are left: ⌈n / 2⌉.

**`2 1000000000` / `1000000000 1000000000`:** 2 · 10^9 ≤ `Integer.MAX_VALUE`, no overflow; they don't fit, 2 gondolas.

**Official tests:** all four programs on this page print the expected answer on the 7 official CSES tests stored with this site (n ≤ 10), run on a real JVM. Those tests are tiny, so the tests for this page add n = 2 · 10^5 inputs (nobody fits, everybody fits, exact-fit halves, random weights) and random small inputs checked against an independent dynamic programme over subsets.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1 min | Two per gondola, exactly x allowed, every child fits alone |
| Baseline and a wrong rule | 2 min | Try every pairing; break "pair the lightest" with Example 2 |
| The rule and its proof | 5 min | Heaviest first, partner = lightest, the exchange argument |
| Code | 3 min | Sort, two indices, `i <= j` |
| Test | 2 min | Examples, n = 1, nobody fits |

If stuck, write the sorted weights in a row and ask who the heaviest child could possibly ride with.

## 9. Interviewer challenges

### About the greedy argument

#### Why the lightest partner, and not the heaviest one who fits?

**What they are testing:** whether you understand what the exchange argument needs.

**How to reason:** run the swap with each choice and see which facts it uses.

**What I say:** "Both are optimal, and both have the same swap argument. With the lightest, `{z, y}` fits because y is no heavier than h. With best fit, it fits because z is no heavier than the best-fit partner. Lightest is just cheaper to find: it's the left end of the sorted array, so I need two indices instead of a search tree. On Example 1 they pair 7 with different children, 2 versus 3, and both use 3 gondolas."

**Nuance:** the test file uses a separate argument (count the most disjoint pairs among the lightest children) as the reference for large inputs, so the two greedy choices are checked against something independent of both.

#### If the lightest child doesn't fit with the heaviest, why must the heaviest ride alone?

**What they are testing:** the easy half of the proof, said precisely.

**How to reason:** every other partner is at least as heavy as the lightest.

**What I say:** "Every waiting child weighs at least l, so h plus anyone is at least h + l > x. No plan can pair h, so sending them alone costs nothing."

**Nuance:** this is also why the loop can always move j: every step settles the heaviest child for good.

### About the problem's limits

#### What if a gondola could hold three children?

**What they are testing:** knowing where the greedy stops working.

**How to reason:** the exchange argument swapped one partner; with three seats the interactions are richer.

**What I say:** "Then it becomes a bin-packing-like problem with a cardinality limit. The simple greedy is no longer guaranteed optimal, and I wouldn't claim a polynomial algorithm without thinking hard; for small n I'd fall back to a search or a DP over subsets."

**Nuance:** the two-per-gondola rule is exactly what makes the swap argument work: each gondola has at most one partner to trade.

## 10. Follow-up questions the interviewer might ask

**"Print the actual gondolas."**
Record the pair (or single) at each step of the two-pointer loop; to print original child numbers, sort indices with their weights (for example, pack weight and index into one `long`). Same O(n log n).

**"Weights are small integers, at most 3 · 10^4."**
Counting sort replaces `Arrays.sort`: O(n + x). That is [[nc-boats-to-save-people|Boats to Save People]] on LeetCode, the same problem with a function signature.

**"Children arrive one at a time and must be seated immediately, but a gondola can wait for a second child."**
An online problem; the greedy above no longer applies directly, because future arrivals are unknown. It needs a different analysis.

**"Each gondola has its own capacity."**
Then it becomes an assignment problem between gondolas and children, closer to [[cses-apartments|Apartments]]; sort both sides and reason about which child takes which gondola.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Pairing the lightest children together.** `1 2 8 9`, x = 10 gives 3 instead of 2 (verified).
- **Pairing neighbours in input order.** Fails on the same input (3, verified), and the input is in arbitrary order anyway.
- **Assuming the heaviest needs the best-fitting partner.** It works, but it is not needed, and it makes the code heavier.

### Implementation mistakes

> [!MISTAKE] `while (i < j)` drops the last child
> With `<`, the loop stops when one child is left without counting their gondola. Example 1 prints `2` instead of `3`, and a single child prints `0` (both verified). Use `i <= j`.

- **Forgetting to sort.** The two-pointer loop on unsorted weights compares arbitrary children. On `9 8 2 1` with x = 10 it happens to print 2, but on `1 9 2 8` it prints 3 instead of 2 (verified).
- **Moving i but not j.** The heaviest child must leave in every iteration; otherwise the loop counts a gondola without seating its main passenger.
- **Reading with `Scanner`.** Much slower per token than `BufferedReader` with `StringTokenizer`.

## 12. Pattern recognition

**The pattern:** pair items within one sorted list from both ends: the hardest item (heaviest) with the most flexible partner (lightest), proven by an exchange argument.

**Signals in the problem statement:**

- "At most two per group" and a capacity on the group.
- "Minimum number of groups", which is n minus the most pairs.
- Large n with values that are only compared, never indexed.

**Related problems in this list:**

- [[nc-boats-to-save-people|Boats to Save People]]: the same problem on LeetCode, with small weights that allow a counting sort.
- [[cses-apartments|Apartments]]: pairing across two sorted lists, smallest with smallest, with a similar exchange argument.
- [[cses-sum-of-two-values|Sum of Two Values]]: the same two-ended scan, looking for an exact sum instead of a bound.
- [[nc-two-sum-ii-input-array-is-sorted|Two Sum II]]: the two-ended scan on an already sorted array.

**Takeaway:** in a pairing problem, settle the most constrained item first and give it the partner whose loss hurts the others least; an exchange argument turns that intuition into a proof.

## 13. 60-second revision card

**Key insight:** the heaviest waiting child either fits with the lightest or with nobody; pairing them never costs a gondola.

**Invariant:** the children before i and after j are seated, `gondolas` counts their gondolas, and some optimal plan for the children i..j plus `gondolas` is optimal overall.

**Complexity:** O(n log n) time, O(n) space.

**Code skeleton:**

```java title="Ferris Wheel, heaviest with lightest"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(st.nextToken()), x = Integer.parseInt(st.nextToken());
        int[] p = new int[n];
        st = new StringTokenizer(in.readLine());
        for (int i = 0; i < n; i++) p[i] = Integer.parseInt(st.nextToken());
        Arrays.sort(p);
        int i = 0, j = n - 1, gondolas = 0;
        while (i <= j) {
            if (i < j && p[i] + p[j] <= x) i++;
            j--;
            gondolas++;
        }
        System.out.println(gondolas);
    }
}
```

**Main traps:**

- `i <= j`, so the last child gets a gondola.
- Pair the heaviest with the lightest, not the two lightest.
- p_i + p_j ≤ 2 · 10^9 fits in an `int`.

**What to say in one breath:** "Sort the weights. The heaviest child either fits with the lightest or with nobody. If the lightest fits, any optimal plan can be rearranged to pair them by swapping partners, so I pair them; otherwise the heaviest rides alone. Two indices from both ends: O(n log n) for the sort, linear after."
