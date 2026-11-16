---
problemId: cses-apartments
title: Apartments
source: cses
sourceUrl: https://cses.fi/problemset/task/1084
difficulty: easy
patterns: [sorting-searching, two-pointers, greedy, sorting]
relatedLessons: [a2-two-pointers, a10-sorting-greedy, a2-sorting-based, a10-local-vs-global, a1-java-syntax-competitive, a14-brute-force-first]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

There are n applicants and m free apartments. Applicant i wants an apartment of size a_i and accepts any apartment whose size is between a_i − k and a_i + k, both ends included. Each apartment goes to at most one applicant and each applicant gets at most one apartment. Print the largest number of applicants who can get an apartment. This is a whole program: it reads standard input and writes standard output.

**Example 1** (the CSES example)

- Input: `4 3 5` on the first line, `60 45 80 60` on the second, `30 60 75` on the third
- Output: `2`
- Why: with k = 5, the applicant who wants 45 accepts sizes 40 to 50 and no apartment is in that range. The two applicants who want 60 both accept only the apartment of size 60, so only one of them can have it. The applicant who wants 80 accepts 75 to 85 and gets the apartment of size 75. The apartment of size 30 suits nobody. So two applicants are housed.

**Example 2** (an extra example: the CSES statement has only one)

- Input: `2 2 5` / `10 5` / `5 15`
- Output: `2`
- Why: the applicant who wants 10 accepts 5 to 15, so both apartments suit them; the applicant who wants 5 accepts 0 to 10, so only the apartment of size 5 suits them. Giving 15 to the first and 5 to the second houses both.

**What the problem statement guarantees**

- 1 ≤ n, m ≤ 2 · 10^5.
- 0 ≤ k ≤ 10^9.
- 1 ≤ a_i, b_j ≤ 10^9.
- Input: n, m and k on the first line, the n desired sizes on the second, the m apartment sizes on the third. Output: one integer.
- Time limit: 1 second (memory limit 512 MB).

## 2. Practice first: try it before reading on

If you have not solved this yourself yet, stop here. The interesting part is not the code, which is short, but convincing yourself that a simple rule of thumb really gives the maximum. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 20 minutes.
2. Solve Example 2 by hand, then write down a rule that assigns apartments one applicant at a time. Look for an input where your rule houses fewer applicants than possible.
3. Once your rule survives your own attempts to break it, say in two or three sentences why it can never lose an applicant.
4. Estimate the cost of your program at n = m = 2 · 10^5 before you write it.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> Example 2 shows that the order in which applicants choose matters, and so does which acceptable apartment they take. Which applicant is the most constrained, and which apartment would they waste the least by taking?

> [!HINT] Hint 2: the kind of tool you need
> Put both lists in increasing order. Then the applicant with the smallest desired size and the smallest apartment size can be compared directly, and one of them can always be settled for good.

> [!HINT] Hint 3: almost the whole plan
> Sort the desired sizes and the apartment sizes. Keep one index into each list. If the current apartment is smaller than a_i − k, nobody left can use it: skip it. If it is larger than a_i + k, this applicant cannot use it or any later apartment: skip the applicant. Otherwise match them and move both indices. Count the matches.

**Check yourself before revealing the walkthrough**

- [ ] I can give an input where "each applicant, in input order, takes the first apartment that suits them" is not optimal
- [ ] I can explain why matching the smallest applicant with the smallest acceptable apartment never costs a match
- [ ] My program prints 0 when no apartment is in any applicant's range, and min(n, m) when k = 10^9
- [ ] I know whether a_i + k can overflow an `int`

## 3. Interview script: understand the problem (≈2 min)

Treat it as if an interviewer had posed it. The questions are about the format, the inclusive range, duplicates, and how large the numbers get.

**Me:** So I read n, m and k, then n desired sizes, then m apartment sizes, and print one number: how many applicants can be housed at most. Each apartment goes to one applicant at most?

**Interviewer:** Yes. And each applicant takes at most one apartment.

**Me:** "Between a − k and a + k": are both ends allowed? With k = 0, does an applicant accept only exactly their size?

**Interviewer:** Both ends are allowed, and yes, k = 0 means exactly the desired size.

**Me:** Can sizes repeat, among applicants or among apartments?

**Interviewer:** Yes, both.

**Me:** Let me try Example 2 by hand: applicants 10 and 5, apartments 5 and 15, k = 5. If the 10 goes first and grabs the 5, the applicant who wants 5 has nothing left, since 15 is out of their range. If the 10 takes 15 instead, both are housed: 2. So the choices interact, and I have to be careful about who picks first and what they pick.

**Interviewer:** Right. How large can the input be?

**Me:** n and m up to 2 · 10^5, sizes and k up to 10^9, one second. a + k is at most 2 · 10^9, which is below 2^31 − 1 ≈ 2.147 · 10^9, so `int` arithmetic is safe; a − k can be negative, which is harmless. With 4 · 10^5 numbers to read I'll use a `BufferedReader` and a `StringTokenizer`, not `Scanner`.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n, m ≤ 2 · 10^5 | n · m is 4 · 10^10: comparing every applicant with every apartment is too slow. Sorting, about 3.5 · 10^6 comparisons per list, is fine. |
| 0 ≤ k ≤ 10^9, 1 ≤ a_i, b_j ≤ 10^9 | a + k ≤ 2 · 10^9 < 2^31 − 1, so `int` holds every bound; a − k ≥ 1 − 10^9 is negative at worst, still an `int`. |
| Time limit 1 s | Fast input: one `BufferedReader`, tokens with `StringTokenizer`; one `println` at the end. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| The acceptable range is inclusive at both ends | The tests are `b < a − k` and `b > a + k` for "unacceptable", so `b == a ± k` is accepted. |
| Each apartment and each applicant is used at most once | It is a matching problem, not a counting one: two applicants who want the same apartment compete for it. |
| Sizes can repeat | Equal sizes are separate apartments; the solution must not merge them. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The tokens may be split over lines differently from the statement | My reader takes the next token wherever it is, so the line breaks do not matter. It costs nothing. |

### Edge cases I will keep in mind

- k = 0: only exact matches count.
- No apartment suits anyone: the answer is 0.
- k = 10^9: every apartment suits everyone, so the answer is min(n, m).
- n much larger than m, or the other way round.
- Several applicants competing for one apartment, and duplicate sizes on both sides.
- Boundaries: b exactly a − k or a + k is accepted.

## 4. Think out loud: from first idea to best solution

The problem is a maximum matching between applicants and apartments, where an edge means "this apartment is acceptable". General matching needs heavy machinery, but here the edges have a special shape: each applicant accepts an interval of sizes, and all the intervals have the same width 2k. The ladder goes from trying every assignment, through two greedy rules that fail, to a greedy rule that is provably optimal, and then makes that rule fast.

### Alternative: try every assignment

This rung is exponential: it is only a baseline and a checker for tiny inputs (1.4 s measured at n = m = 10 when every apartment suits everyone, 21.6 s at n = m = 11), so it is not a numbered approach.

#### What I say out loud

> "The safe starting point: for each applicant in turn, either they get nothing, or they get one of the acceptable apartments not yet taken, and I recurse on the rest. The best over all choices is the answer by definition. It's correct, but the number of assignments explodes, so it only serves to check a faster rule on small inputs."

#### Intuition

A maximum over every possible matching is the answer, with nothing to prove. The work is in finding a rule that avoids looking at all of them.

#### Algorithm

1. `best(i)` = the most applicants among i, i + 1, …, n − 1 that can be housed with the apartments not yet used.
2. `best(n) = 0`.
3. Otherwise, start with `best(i + 1)` (applicant i gets nothing). For each unused apartment j with |a_i − b_j| ≤ k: mark it used, take `1 + best(i + 1)`, unmark it. Return the maximum.
4. Print `best(0)`.

#### Why it is correct

- **Only valid answers:** every branch gives each applicant at most one acceptable apartment and never reuses one (the `used` flags), so every count it reaches belongs to a real assignment.
- **Cannot miss one:** any assignment makes, for applicant 0, the choice "nothing" or "apartment j", and the recursion tries both; by induction on i, it explores every assignment of the remaining applicants too.

#### Dry run

Example 2: `2 2 5` / `10 5` / `5 15`. Applicant 0 wants 10 (accepts 5..15), applicant 1 wants 5 (accepts 0..10).

| Applicant 0 | Applicant 1 | Housed |
|---|---|---|
| nothing | nothing | 0 |
| nothing | apartment of size 5 | 1 |
| size 5 | nothing (15 is out of range, 5 is taken) | 1 |
| size 15 | size 5 | 2 |

The maximum is 2.

#### Java code

```java title="Alternative: try every assignment (exponential)"
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
        int n = nextInt(), m = nextInt(), k = nextInt();
        int[] a = new int[n];
        int[] b = new int[m];
        for (int i = 0; i < n; i++) a[i] = nextInt();
        for (int j = 0; j < m; j++) b[j] = nextInt();
        System.out.println(bestByTryingAll(0, a, b, k, new boolean[m]));
    }

    /** The most applicants from i onwards that can be housed, given the apartments already used. */
    static int bestByTryingAll(int i, int[] a, int[] b, int k, boolean[] used) {
        if (i == a.length) {
            return 0;
        }
        int best = bestByTryingAll(i + 1, a, b, k, used);       // applicant i gets nothing
        for (int j = 0; j < b.length; j++) {
            if (!used[j] && Math.abs(a[i] - b[j]) <= k) {      // |a - b| < 10^9: no overflow
                used[j] = true;                                  // applicant i takes apartment j
                best = Math.max(best, 1 + bestByTryingAll(i + 1, a, b, k, used));
                used[j] = false;                                 // undo, try the next choice
            }
        }
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

**Exponential in the worst case.** When every apartment suits everyone, the recursion visits every partial assignment of n applicants to m apartments: more than m!/(m − n)! leaves when n ≤ m. Measured: 1.4 s at n = m = 10 (an official test with k = 10^9) and 21.6 s at n = m = 11, about 15 times more per extra applicant.

#### Space complexity

**O(n + m)**: the arrays, the `used` flags and a recursion depth of n.

#### The bridge to the next approach

> "I need a rule that commits to one choice per applicant. The first thing anyone tries: go through the applicants in input order and give each the first apartment that suits them. Let me test it on Example 2 before trusting it."

### Two greedy rules that fail

These rules are wrong; they are on the page because a candidate reaches them first, and the counterexamples are what lead to the correct rule. Both counterexamples were run.

- **Input order, first acceptable apartment.** On Example 2 (`10 5` / `5 15`, k = 5), the applicant who wants 10 comes first and takes the apartment of size 5; the applicant who wants 5 then has nothing: **1** instead of 2. Taking the *smallest* acceptable apartment in input order fails on the same input, for the same reason: the flexible applicant moved first and took the only apartment the other one could use.
- **Smallest applicant first, largest acceptable apartment.** `2 2 1` / `2 4` / `1 3`: the applicant who wants 2 (accepts 1..3) takes 3; the applicant who wants 4 (accepts 3..5) has nothing: **1** instead of 2.

> "Two lessons. Order matters: an applicant with small desired size should choose before one with a large size. And the choice matters: an applicant should take the apartment that is least useful to everyone after them, which, if the later applicants want larger sizes, is the smallest acceptable one."

### Alternative: sorted applicants, each scanning for the smallest free acceptable apartment

This rung is correct but O(n · m): 106 s measured at n = m = 2 · 10^5, far over the 1 s limit, so it is not a numbered approach.

#### What I say out loud

> "Process applicants from the smallest desired size to the largest. Each one takes the smallest free apartment they accept. To find it I scan all m apartments. That's the right rule; the scan is the slow part."

#### Intuition

Applicants in increasing order of desired size have acceptable ranges [a − k, a + k] that move to the right (both ends grow with a, because every range has the same width). An apartment too small for the current applicant is too small for everyone after. Among the acceptable apartments, the smallest is the one the later applicants are least likely to want, so it is the safest to give away.

#### Algorithm

1. Read the input; sort `a` ascending.
2. `taken[j] = false` for every apartment; `housed = 0`.
3. For each desired size `d` in sorted order: scan all apartments for the smallest b_j with `!taken[j]` and `d − k ≤ b_j ≤ d + k`. If one exists, mark it taken and `housed++`.
4. Print `housed`.

#### Why it is correct

This is the same greedy choice as the recommended approach, made with a slower search, so the exchange argument in Approach 2 applies unchanged: at each step, giving the smallest remaining applicant the smallest acceptable free apartment is part of some optimal matching of the applicants and apartments still in play. Apartments the scan skips because they are too small can never be used by later applicants, whose ranges start further right.

#### Dry run

Example 1: sorted desired sizes `45 60 60 80`, apartments `30 60 75` (indices 0, 1, 2), k = 5.

| Applicant | Range | Free acceptable apartments | Takes | housed |
|---|---|---|---|---|
| 45 | 40..50 | none | nothing | 0 |
| 60 | 55..65 | 60 (index 1) | index 1 | 1 |
| 60 | 55..65 | none (60 is taken) | nothing | 1 |
| 80 | 75..85 | 75 (index 2) | index 2 | 2 |

Prints `2`.

#### Java code

```java title="Alternative: sorted applicants, scan all apartments (O(n·m), too slow at the limits)"
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
        int n = nextInt(), m = nextInt(), k = nextInt();
        int[] a = new int[n];
        int[] b = new int[m];
        for (int i = 0; i < n; i++) a[i] = nextInt();
        for (int j = 0; j < m; j++) b[j] = nextInt();

        Arrays.sort(a);                                          // smallest desired size first
        boolean[] taken = new boolean[m];
        int housed = 0;
        for (int desired : a) {
            int j = smallestFreeAcceptable(desired, b, k, taken);
            if (j >= 0) {
                taken[j] = true;
                housed++;
            }
        }
        System.out.println(housed);
    }

    /** Index of the smallest apartment not yet taken with size in [desired - k, desired + k], or -1. */
    static int smallestFreeAcceptable(int desired, int[] b, int k, boolean[] taken) {
        int best = -1;
        for (int j = 0; j < b.length; j++) {                     // scan every apartment
            if (!taken[j] && b[j] >= desired - k && b[j] <= desired + k
                    && (best < 0 || b[j] < b[best])) {
                best = j;
            }
        }
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

**O(n log n + n · m)**, n being the number of applicants and m the number of apartments: the sort, then a full scan of m apartments for each of n applicants. At n = m = 2 · 10^5 that is 4 · 10^10 checks; measured 106 s on my machine (JDK 26).

#### Space complexity

**O(n + m)**: the two arrays and the `taken` flags.

#### The bridge to the next approach

> "The scan asks one question: what is the smallest free size that is at least d − k? That is a ceiling query on a set of numbers with deletions, which a balanced search tree answers in O(log m). Duplicates matter, so I'll keep a count per size."

### Approach 1: Sorted applicants, a TreeMap of free apartment sizes

#### What I say out loud

> "Same rule, faster search. I keep the free apartment sizes in a `TreeMap` from size to how many apartments of that size are free. For each applicant in sorted order, `ceilingKey(d − k)` gives the smallest free size that is not too small; if it is at most d + k, I take one apartment of that size."

#### Intuition

The greedy rule only ever needs "the smallest free size ≥ some bound", which is exactly what an ordered map is built for.

#### Algorithm

1. Read the input. Put each apartment size into `free`, counting duplicates.
2. Sort `a` ascending; `housed = 0`.
3. For each desired size `d`: `size = free.ceilingKey(d − k)`. If `size != null` and `size <= d + k`, `housed++` and remove one apartment of that size (delete the key when its count reaches 0).
4. Print `housed`.

#### Why it is correct

`ceilingKey(d − k)` returns the smallest free size ≥ d − k. If it is ≤ d + k, it is the smallest free acceptable apartment; if it is larger or missing, no free apartment is acceptable. So each step makes exactly the choice of the previous alternative, whose correctness is proved in Approach 2. The counts make duplicates behave as separate apartments.

#### Dry run

Example 1: sorted applicants `45 60 60 80`, k = 5, `free = {30: 1, 60: 1, 75: 1}`.

| d | d − k | `ceilingKey` | ≤ d + k? | free after | housed |
|---|---|---|---|---|---|
| 45 | 40 | 60 | no (60 > 50) | {30, 60, 75} | 0 |
| 60 | 55 | 60 | yes | {30, 75} | 1 |
| 60 | 55 | 75 | no (75 > 65) | {30, 75} | 1 |
| 80 | 75 | 75 | yes | {30} | 2 |

Prints `2`.

#### Java code

```java title="Approach 1: TreeMap of free sizes"
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
        int n = nextInt(), m = nextInt(), k = nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = nextInt();
        TreeMap<Integer, Integer> free = new TreeMap<>();        // apartment size -> how many are free
        for (int j = 0; j < m; j++) free.merge(nextInt(), 1, Integer::sum);

        Arrays.sort(a);                                          // smallest desired size first
        int housed = 0;
        for (int desired : a) {
            Integer size = free.ceilingKey(desired - k);         // smallest free size >= desired - k
            if (size != null && size <= desired + k) {
                housed++;
                if (free.get(size) == 1) {
                    free.remove(size);
                } else {
                    free.put(size, free.get(size) - 1);
                }
            }
        }
        System.out.println(housed);
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

**O(n log n + m log m) in the worst case**: building the map is m insertions at O(log m) each (`TreeMap` is a red-black tree, so this bound is documented, not just expected), sorting is O(n log n), and each of the n applicants makes O(1) map operations at O(log m). Measured 0.24–0.29 s for the whole program at n = m = 2 · 10^5, JVM start included.

#### Space complexity

**O(n + m)**: the array and a tree node per distinct apartment size, tens of bytes each because keys and counts are boxed.

#### The bridge to the next approach

> "The applicants are sorted, and every bound d − k they ask about only grows. So the 'too small' apartments are discarded from the left and never come back. If I sort the apartments too, a single index moving left to right replaces the tree."

### Approach 2: Sort both lists, then two pointers (recommended)

#### What I say out loud

> "Sort the desired sizes and the apartment sizes. Look at the smallest waiting applicant and the smallest free apartment. If the apartment is too small for this applicant, it's too small for everyone after, so drop it. If it's too big, every later apartment is too big for this applicant as well, so this applicant gets nothing. Otherwise match them. Each step moves at least one index, so it's linear after sorting."

#### Intuition

After sorting, both "too small" and "too big" are one-way verdicts. An apartment that is too small for the current applicant stays too small for every later (larger) applicant. An applicant for whom the current apartment is too big finds every later (larger) apartment too big. And when they fit, the exchange argument below shows that pairing them never costs a match. This is a sorting-based greedy ([[a10-sorting-greedy|Sorting + greedy]]) run with [[a2-two-pointers|two pointers]].

#### Algorithm

1. Read the input; sort `a` and `b` ascending.
2. `i = 0`, `j = 0`, `housed = 0`.
3. While `i < n` and `j < m`:
   - If `b[j] < a[i] − k`: `j++` (drop the apartment).
   - Else if `b[j] > a[i] + k`: `i++` (drop the applicant).
   - Else: `housed++`, `i++`, `j++`.
4. Print `housed`.

#### Why it is correct

Write A for the smallest waiting applicant (size a_i) and B for the smallest free apartment (size b_j). Each step settles A or B for good; it is enough to show that each decision is consistent with some optimal matching of what is still waiting.

**Case 1: b_j < a_i − k.** Every waiting applicant wants at least a_i, so their range starts at a_i − k or later. Nobody can use B, and dropping it loses nothing.

**Case 2: b_j > a_i + k.** Every free apartment is at least b_j, so none is in A's range. A can never be housed, and dropping A loses nothing.

**Case 3: B is in A's range.** Take any optimal matching M of the waiting applicants and free apartments. Rearrange it, without losing a match, so that A gets B:

- **A has B already:** done.
- **A has nothing, B has nothing:** add the pair (A, B). That would beat an optimal matching, so this case cannot happen.
- **A has nothing, B goes to A′:** give B to A instead of A′. Same size.
- **A has B′, B has nothing:** give A the apartment B instead of B′. Same size.
- **A has B′, B goes to A′:** swap, so A gets B and A′ gets B′. A gets B: fine by the case assumption. For A′ and B′: b′ ≥ b_j (B is the smallest free apartment) and b_j ≥ a′ − k (A′ accepted B), so b′ ≥ a′ − k. And b′ ≤ a_i + k (A accepted B′) and a_i ≤ a′ (A is the smallest applicant), so b′ ≤ a′ + k. So A′ accepts B′, and the matching keeps its size.

So some optimal matching pairs A with B, which is what the algorithm does. Removing both leaves the same problem on fewer people and apartments, and the argument repeats. The last case is the heart of it, and it uses both "smallest" facts. It also needs every range to have the same width 2k: that is what makes both ends of the range grow with a.

**Termination:** each iteration increases i or j, so there are at most n + m iterations.

**The 25-second version to say to the interviewer:**

> "After sorting, an apartment too small for the smallest applicant is too small for everyone, and an apartment too big for them means every remaining one is too big. When the smallest applicant accepts the smallest apartment, take any optimal assignment and swap partners: the smallest applicant gets the smallest apartment, and their old partners fit each other because the old apartment is at least the smallest one and at most the first applicant's upper bound. So matching them never loses anyone."

#### Dry run

Example 1: sorted `a = 45 60 60 80`, sorted `b = 30 60 75`, k = 5.

| i | a[i] | range | j | b[j] | Decision | housed |
|---|---|---|---|---|---|---|
| 0 | 45 | 40..50 | 0 | 30 | 30 < 40: drop apartment, j++ | 0 |
| 0 | 45 | 40..50 | 1 | 60 | 60 > 50: drop applicant, i++ | 0 |
| 1 | 60 | 55..65 | 1 | 60 | match, i++, j++ | 1 |
| 2 | 60 | 55..65 | 2 | 75 | 75 > 65: drop applicant, i++ | 1 |
| 3 | 80 | 75..85 | 2 | 75 | match, i++, j++ | 2 |

Now i = 4 = n: prints `2`.

#### Java code

```java title="Approach 2: sort both, two pointers (recommended)"
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
        int n = nextInt(), m = nextInt(), k = nextInt();
        int[] a = new int[n];
        int[] b = new int[m];
        for (int i = 0; i < n; i++) a[i] = nextInt();
        for (int j = 0; j < m; j++) b[j] = nextInt();

        Arrays.sort(a);
        Arrays.sort(b);
        int i = 0;                                               // smallest applicant still waiting
        int j = 0;                                               // smallest apartment still free
        int housed = 0;
        while (i < n && j < m) {
            if (b[j] < a[i] - k) {
                j++;                 // too small for applicant i, so for every later applicant too
            } else if (b[j] > a[i] + k) {
                i++;                 // too big for applicant i, and so is every later apartment
            } else {
                housed++;            // acceptable: the smallest applicant takes the smallest apartment
                i++;
                j++;
            }
        }
        System.out.println(housed);
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

**O(n log n + m log m)**: the two sorts, then at most n + m loop iterations of O(1) each. For `Arrays.sort(int[])` the JDK documentation's implementation note (Java 17) describes a dual-pivot quicksort that "offers O(n log(n)) performance on all data sets"; that describes the current implementation rather than a contract of the method. Measured 0.14–0.30 s for the whole program at n = m = 2 · 10^5, JVM start included (the times vary from run to run by about that much).

#### Space complexity

**O(n + m)** for the two arrays; O(1) beyond them, apart from the sort's internal memory, which is a JDK implementation detail.

## 5. Comparison table

n is the number of applicants, m the number of apartments. Nothing here hashes or uses randomness, so expected and worst case coincide.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Alt. Try every assignment | exponential | exponential; 21.6 s at n = m = 11 | O(n + m) |
| Greedy in input order | O(n · m) | O(n · m) | O(m) |
| Alt. Sorted applicants, scan apartments | O(n log n + n · m) | same; 106 s at n = m = 2 · 10^5 | O(n + m) |
| 1. TreeMap of free sizes | O(n log n + m log m) | O(n log n + m log m) | O(n + m), boxed nodes |
| 2. Sort both, two pointers | O(n log n + m log m) | O(n log n + m log m) | O(n + m) primitive arrays |

The "greedy in input order" row is listed because candidates reach it; it is **wrong** (Example 2 gives 1 instead of 2), so its speed is irrelevant.

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Alt. Try every assignment | Correct by definition | Exponential | A checker for tiny inputs |
| Greedy in input order | Simple | Wrong | Never; use it to show why order matters |
| Alt. Scan apartments | The right rule, no data structure | Quadratic | To state the rule before optimizing it |
| 1. TreeMap | Works when apartments arrive or leave over time | Boxing, a heavier structure, larger constant | Online versions where sorting everything up front is impossible |
| 2. Two pointers | Simplest code, primitive arrays, deterministic bound | Needs both lists up front | The submission and the interview answer |

## 6. Which solution to give, and when to stop optimizing

**The solution I recommend:** Approach 2, sort both and use two pointers. It is the shortest code, uses only primitive arrays, and its bound does not depend on the input. The TreeMap version is the same rule with a slower search and is worth mentioning only as the step that leads to it.

**Is it optimal?** The sorting dominates. Without the sort, the loop is O(n + m), which is necessary in the worst case: a correct algorithm must look at essentially every size, so Ω(n + m). Whether the sort can be avoided in the comparison model is not something I would claim in an interview; with sizes up to 10^9 there is no cheap counting sort. Stop here.

**In an interview,** most of the time should go into the correctness argument, because the code is twelve lines. Show a wrong greedy first (Example 2), state the rule, and give the exchange argument.

## 7. Interview script: code it and test it

### What I say while coding

> "Two sorts on `int[]`, not `Integer[]`: primitive sort, no boxing."

> "Three branches. The first drops the apartment: `b[j] < a[i] − k`, strict, because the boundary is accepted. The second drops the applicant: `b[j] > a[i] + k`. Otherwise both move."

> "a + k is at most 2 · 10^9, below `Integer.MAX_VALUE`, so no `long` is needed. I'll say that out loud because it's the kind of thing that breaks silently."

### Testing out loud

**Example 1:** traced above, prints 2.

**Example 2, `2 2 5` / `10 5` / `5 15`:** sorted `5 10` and `5 15`. 5 accepts 5: match. 10 accepts 15 (range 5..15): match. Prints 2, where the input-order greedy printed 1.

**k = 0, `1 1 0` / `7` / `8`:** 8 > 7 + 0, the applicant is dropped, prints 0. With `7` / `7`, prints 1.

**k = 10^9:** every comparison lands in the "match" branch, so the loop matches min(n, m) pairs.

**Boundary, `1 1 999999999` / `1` / `1000000000`:** a + k = 10^9 = b, accepted, prints 1. With k one smaller, prints 0.

**n = 2 · 10^5, m = 1:** the loop ends as soon as the single apartment is used or the applicants run out.

**Official tests:** all four programs on this page print the expected answer on the 10 official CSES tests stored with this site (n, m ≤ 10), run on a real JVM. Those tests are tiny, so the tests for this page add n = m = 2 · 10^5 inputs (k = 10^9, all sizes equal with k = 0, nobody housed, and random inputs checked against an independent greedy) and random small inputs checked against a general maximum-matching algorithm.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2 min | Inclusive range, each used once, duplicates, overflow of a + k |
| Brute force and a wrong greedy | 3 min | State the exponential baseline; break the input-order greedy with Example 2 |
| The rule and its proof | 6 min | Sorted order, smallest with smallest, the exchange argument |
| Code | 4 min | Fast input, two sorts, the three-branch loop |
| Test | 3 min | Example, k = 0, k = 10^9, a boundary |

If the proof will not come, argue the two "drop" cases first: they are easy and make the third case the only one left.

## 9. Interviewer challenges

### About the greedy argument

#### Why give the smallest applicant the smallest acceptable apartment, and not the closest one to their desired size?

**What they are testing:** whether you know which choice the proof needs, rather than a plausible-sounding one.

**How to reason:** the later applicants want larger sizes. Which acceptable apartment are they least likely to need?

**What I say:** "Closeness to the desired size doesn't matter to the count; only availability for later applicants does. Every later applicant's range starts at or to the right of mine, so the smaller an apartment, the fewer later applicants can use it. The exchange argument relies on that: when I swap, the apartment I gave up is at least as large as the one I took, so the later applicant who had mine can take it. With 'closest', applicants 2 and 4, k = 1, apartments 1 and 3: the applicant who wants 2 finds 1 and 3 equally close; if they take 3, the applicant who wants 4 gets nothing."

**Nuance:** the "largest acceptable" rule fails on the same input (prints 1, verified); "closest" fails whenever its tie-break or distance prefers a larger apartment.

#### What if each applicant had their own tolerance k_i?

**What they are testing:** whether you know which property of the input the proof used.

**How to reason:** the case-3 swap needed a_i ≤ a′ to imply a_i + k ≤ a′ + k. Does that survive different widths?

**What I say:** "No longer directly. The swap used that both ends of the range grow with the desired size, which holds only because every range has the same width. With different widths, ranges can nest. The fix is to process applicants by the right end of their range, a_i + k_i, and give each the smallest free apartment that is at least a_i − k_i and at most a_i + k_i, using a `TreeMap` for the search: the classic greedy for matching points to intervals. That's O((n + m) log m)."

**Nuance:** this is exactly why Approach 1 is worth knowing: the two-pointer version depends on equal widths, the ordered-map version does not.

### About the implementation

#### Would `long` be safer for a + k?

**What they are testing:** whether you compute bounds instead of guessing.

**How to reason:** largest a plus largest k against `Integer.MAX_VALUE`.

**What I say:** "a + k ≤ 10^9 + 10^9 = 2 · 10^9, and `Integer.MAX_VALUE` is 2,147,483,647, so it fits with about 1.5 · 10^8 to spare. a − k ≥ 1 − 10^9 is a small negative number, also fine. I'd switch to `long` if the limits grew past about 1.07 · 10^9 each."

**Nuance:** in the brute force, `Math.abs(a − b)` is also safe, because both are between 1 and 10^9.

## 10. Follow-up questions the interviewer might ask

**"Print which apartment each applicant gets."**
Sort indices along with values (pack the size and the original index into one `long`, or sort an index array), and record the pair at each match. Same O(n log n + m log m).

**"Applicants arrive one at a time and must be answered immediately."**
The greedy order is gone. Keep the free apartments in a `TreeMap` and give each arriving applicant, for example, the smallest acceptable apartment: O(log m) per applicant, but no longer guaranteed optimal, since an early applicant may take what a later one needed. This is the shape of [[cses-concert-tickets|Concert Tickets]], where each customer is served on arrival with the largest ticket at most their budget.

**"Each applicant has their own tolerance."**
Sort by a_i + k_i and use a `TreeMap` ceiling query (section 9). O((n + m) log m).

**"Maximize the number of housed applicants, but an apartment can house two applicants whose desired sizes are both acceptable."**
Then it is a different matching problem; the simple exchange argument no longer applies as written, and I would start from a brute force and look for a new rule.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Assigning in input order.** Example 2 prints 1 instead of 2 (verified). The order has to be sorted by desired size.
- **Taking the largest or the closest acceptable apartment.** `2 4` / `1 3` with k = 1 prints 1 instead of 2 (verified).
- **Counting instead of matching.** "How many applicants have at least one acceptable apartment" counts the two 60s in Example 1 twice for one apartment.

### Implementation mistakes

> [!MISTAKE] Sorting only one of the two lists
> The two-pointer loop assumes both lists are sorted. Sorting only the applicants still happens to give 2 on Example 1, but `2 2 0` / `1 10` / `10 1` prints 1 instead of 2 (verified): the pointer drops the apartment of size 1 too early because it was out of order.

- **Getting the boundary wrong.** `b[j] <= a[i] − k` drops an apartment exactly at the lower bound, which the statement accepts.
- **Moving only one pointer on a match.** Moving just `i` lets the next applicant take the same apartment; moving just `j` lets one applicant take several.
- **Reading with `Scanner`.** At 4 · 10^5 numbers it is much slower per token than `BufferedReader` with `StringTokenizer`; it may still pass here, but it is a bad habit on CSES.

## 12. Pattern recognition

**The pattern:** sort both sides, then greedily pair the smallest with the smallest it can take, moving two pointers. The proof is an exchange argument: take any optimal answer and swap partners until it agrees with the greedy choice.

**Signals in the problem statement:**

- Two groups to pair up, each item used once, and "as many as possible".
- Compatibility defined by a size or weight comparison, so that sorted order makes "too small" or "too big" a one-way verdict.
- Limits around 2 · 10^5, which rule out general matching and invite sorting.

**Related problems in this list:**

- [[cses-ferris-wheel|Ferris Wheel]]: pairs within one sorted list, heaviest with lightest, with the same kind of exchange argument.
- [[nc-boats-to-save-people|Boats to Save People]]: the LeetCode version of Ferris Wheel.
- [[cses-sum-of-two-values|Sum of Two Values]]: two pointers from both ends of one sorted array, looking for an exact sum.
- [[nc-two-sum-ii-input-array-is-sorted|Two Sum II]]: the same two-ended scan on an already sorted array.
- [[cses-concert-tickets|Concert Tickets]]: the online cousin, where an ordered multiset replaces the second pointer.

**Takeaway:** when two sorted lists must be paired and a mismatch is one-way, a two-pointer greedy settles one item per step; prove it by swapping partners in an optimal answer.

## 13. 60-second revision card

**Key insight:** sorted, an apartment too small for the smallest applicant is useless to everyone, and an applicant for whom the smallest apartment is too big can never be housed; otherwise matching the two smallest is safe (exchange argument).

**Invariant:** everything before i and j has been settled, and some optimal matching of the remaining applicants and apartments, plus `housed`, gives the maximum.

**Complexity:** O(n log n + m log m) time, O(n + m) space.

**Code skeleton:**

```java title="Apartments, sort both and two pointers"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(st.nextToken()), m = Integer.parseInt(st.nextToken());
        int k = Integer.parseInt(st.nextToken());
        int[] a = new int[n], b = new int[m];
        st = new StringTokenizer(in.readLine());
        for (int i = 0; i < n; i++) a[i] = Integer.parseInt(st.nextToken());
        st = new StringTokenizer(in.readLine());
        for (int j = 0; j < m; j++) b[j] = Integer.parseInt(st.nextToken());
        Arrays.sort(a);
        Arrays.sort(b);
        int i = 0, j = 0, housed = 0;
        while (i < n && j < m) {
            if (b[j] < a[i] - k) j++;
            else if (b[j] > a[i] + k) i++;
            else { housed++; i++; j++; }
        }
        System.out.println(housed);
    }
}
```

**Main traps:**

- Sort both lists.
- The range is inclusive: strict `<` and `>` for "unacceptable".
- Input order or "largest acceptable" greedies are wrong.

**What to say in one breath:** "Sort applicants and apartments. If the smallest apartment is below the smallest applicant's range, nobody can use it; if it's above, that applicant can't be housed; otherwise match them, which is safe because swapping partners in any optimal assignment keeps everyone's apartment acceptable. Two pointers after two sorts: O(n log n + m log m)."
