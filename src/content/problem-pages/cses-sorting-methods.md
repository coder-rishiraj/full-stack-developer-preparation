---
problemId: cses-sorting-methods
title: Sorting Methods
source: cses
sourceUrl: https://cses.fi/problemset/task/1162
difficulty: hard
patterns: [additional, inversions, permutation-cycles, longest-increasing-subsequence, fenwick-tree, lower-bound-and-construction]
relatedLessons: [a12-fenwick, a3-merge-sort, a11-lis, a9-permutations, a8-bfs, a1-java-syntax-competitive, a14-brute-force-first, a14-deriving-optimization]
companies: []
timeToSolve: 45
---

## 1. Problem restatement

You get a permutation of 1, 2, …, n. There are four ways to sort it, each a kind of step you may repeat:

1. swap two **adjacent** elements;
2. swap **any** two elements;
3. take any element out and **insert it anywhere** else;
4. take any element out and **put it at the front**.

For each of the four methods separately, print the minimum number of steps that sorts the array into 1, 2, …, n. The answer is four numbers on one line. This is a whole program reading standard input and writing standard output.

**Example**

- Input: `8`, then `7 8 2 6 5 1 3 4`
- Output: `20 6 5 6`
- Why, for two of them: with moves to the front, the values 7 and 8 already stand in the right order relative to each other, so they can stay where they are, and the other six values each need exactly one move to the front (move 6, then 5, 4, 3, 2, 1). With arbitrary swaps, 5 is already in place and the other seven elements can be placed in six swaps, because the last swap of a group puts two elements home at once.

**What the problem statement guarantees**

- 1 ≤ n ≤ 2 · 10^5.
- The second line is a permutation: each of 1..n exactly once.
- Time limit 1 second, memory limit 512 MB.

## 2. Practice first: try it before reading on

If you have not solved this yourself yet, stop here. This is four small problems in one, and each has the same shape: a reason why fewer steps are impossible, and a way to achieve exactly that many. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 45 minutes.
2. For each method, sort `3 1 2` and `1 3 2` by hand with the fewest steps you can find. Then try to prove you could not do better.
3. For each method, look for a quantity that one step can change by at most one (or that a step cannot repair), and that is zero (or maximal) exactly when the array is sorted.
4. Work out how big the first answer can get at n = 2 · 10^5, and how fast each of your counts runs at that size.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> For each method ask: what does one step change, and what does it leave alone? An adjacent swap changes the relative order of exactly one pair. A move leaves every untouched element in the same order relative to every other untouched element.

> [!HINT] Hint 2: the kind of tool you need
> Method 1 counts out-of-order pairs. Method 2 follows "the value here belongs over there" arrows, which form loops. Method 3 asks which elements may stay, and the ones that stay must already be in increasing order. Method 4 is like method 3, but the elements that stay all end up at the back, so they must be the largest values. The pair count needs something faster than checking every pair at n = 2 · 10^5.

> [!HINT] Hint 3: almost the whole plan
> Answers: (1) the number of pairs i < j with p[i] > p[j], counted in O(n log n) with a merge sort or a tree of counts indexed by value, stored in a 64-bit variable; (2) n minus the number of loops in "position i goes to position p[i]"; (3) n minus the length of the longest increasing subsequence, found with the sorted "smallest tail" list and binary search; (4) n minus the largest m such that the values n − m + 1, …, n appear left to right in increasing order. For each, prove "never fewer" and "this many is enough".

**Check yourself before revealing the walkthrough**

- [ ] For each method I can say why one step cannot do more than my formula allows
- [ ] For each method I can describe a sequence of exactly that many steps
- [ ] I know why methods 3 and 4 have different answers for `1 3 2`
- [ ] My first answer does not overflow at n = 2 · 10^5, and every count runs in O(n log n) or better

## 3. Interview script: understand the problem (≈4 min)

Treat it as if an interviewer had posed it. The first job is to separate the four questions and make sure I understand each kind of step exactly.

**Me:** So it's one permutation and four independent questions: with only adjacent swaps, the minimum number of swaps; with arbitrary swaps, the minimum; with "remove and insert anywhere", the minimum; and with "move to the front", the minimum. The four are not combined, and each one can always sort the array, so every answer is a finite number.

**Interviewer:** Right. Each method on its own.

**Me:** For method 3, "move to another position" means I take the element out and the others close the gap, then I insert it between two elements or at either end? It is not a swap.

**Interviewer:** Yes, an insertion. Everything between shifts by one.

**Me:** Output is the four numbers on one line, separated by spaces. Input: n on the first line, the permutation on the second.

**Interviewer:** Correct.

**Me:** Let me do the example's first number by hand to check I read method 1 right. `7 8 2 6 5 1 3 4`: 7 is ahead of six smaller values (2, 6, 5, 1, 3, 4), 8 is ahead of the same six, 2 is ahead of 1, 6 is ahead of 5, 1, 3, 4, which is four, and 5 is ahead of 1, 3, 4, which is three. 6 + 6 + 1 + 4 + 3 = 20, the expected first number. So method 1 smells like "count the out-of-order pairs". I still need to prove it.

**Me:** Sizes: n up to 2 · 10^5. The number of out-of-order pairs can reach n(n − 1)/2 = 19,999,900,000 when the array is reversed, which is about 9 times `Integer.MAX_VALUE` (2,147,483,647). So that answer is a `long`. And with n that large, anything that looks at every pair is about 2 · 10^10 operations, far too slow for 1 second; I am aiming for O(n log n).

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 2 · 10^5 | O(n²) is about 2 · 10^10 steps: too slow. Each of the four counts must be O(n log n) or O(n). |
| The input is a permutation of 1..n | Values double as indices: "where does value v belong" is position v, and a tree indexed by value needs no compression. |
| Time limit 1 s | Fast input (`BufferedReader` and `StringTokenizer`); `Scanner` is several times slower on 2 · 10^5 tokens. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| The four methods are separate questions | Four independent computations; no step mixing. |
| Method 3 is remove-and-insert, not a swap | Only the moved element changes position relative to the others. |
| Output: four numbers on one line | One `println` at the end. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The first answer needs 64 bits | Derived, not given: n(n − 1)/2 reaches 19,999,900,000 at n = 2 · 10^5. |
| The other three answers fit in `int` | Each is at most n − 1. |

### Edge cases I will keep in mind

- n = 1: `0 0 0 0`.
- Already sorted: `0 0 0 0` for every n.
- Reversed: the most inversions, n(n − 1)/2, and the overflow case at n = 2 · 10^5.
- `1 3 2`: methods 3 and 4 disagree (1 versus 2), the test that separates "keep an increasing subsequence" from "keep the largest values".
- One long rotation `2 3 … n 1`: n − 1 swaps for method 2 but only 1 move for methods 3 and 4.

## 4. Think out loud: from first idea to best solution

All four answers have the same structure, and saying so up front organises the whole solution:

> "For each method I need a **lower bound**, a reason why fewer steps cannot work, and a **construction** that sorts in exactly that many steps. When the two meet, I have the minimum, and the minimum is a formula I can compute."

The ladder below starts from the definition itself (search over arrangements), then finds the four formulas and computes them the plain way, and then speeds up the two slow counts (out-of-order pairs and the longest increasing subsequence).

### Alternative: breadth-first search over arrangements (exponential, n up to about 9)

#### What I say out loud

> "Before any cleverness: the minimum number of steps is a shortest path. The arrangements are nodes, one step is an edge, and I want the distance from my permutation to the sorted one. Breadth-first search gives that for each method. There are n! arrangements, so this only works for tiny n, but it is the definition, which makes it the perfect checker for whatever formulas I come up with."

#### Intuition

"Minimum number of steps" with unit-cost steps is exactly the setting of breadth-first search: BFS visits arrangements in order of how many steps they are from the start, so the first time it reaches the sorted array, that is the minimum.

#### Algorithm

For each method separately:

1. Put the start arrangement in a queue with distance 0, and in a map from arrangement to distance.
2. Pop an arrangement. If it is sorted, return its distance.
3. Otherwise generate every arrangement one step away (method 1: n − 1 adjacent swaps; method 2: all n(n − 1)/2 swaps; method 3: every element to every other index; method 4: every element except the first to the front). Each one not yet in the map gets distance + 1 and joins the queue.

#### Why it is correct

BFS removes arrangements from the queue in non-decreasing order of distance, and every arrangement gets its distance when it is first discovered, from a neighbour that was itself at the smallest possible distance. So the distance recorded for the sorted arrangement is the length of a shortest step sequence. Every method can sort any permutation (method 4 by moving n − 1, …, 1 to the front in turn, for example), so the search always ends.

#### Dry run

Method 4 on `3 1 2`:

| Distance | Arrangements found | Note |
|---|---|---|
| 0 | `3 1 2` | start |
| 1 | `1 3 2` (move 1), `2 3 1` (move 2) | neither is sorted |
| 2 | from `1 3 2`: `2 1 3`; from `2 3 1`: `3 2 1`, `1 2 3` | `3 1 2` again is skipped; `1 2 3` is sorted |

The answer is 2. The program prints `2 2 1 2` for this input, all four found the same way.

#### Java code

```java title="Alternative: breadth-first search over arrangements (exponential)"
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
        int[] p = readNumbers(in, n);
        StringBuilder out = new StringBuilder();
        for (int method = 1; method <= 4; method++) {
            if (method > 1) out.append(' ');
            out.append(minStepsByBfs(p, method));
        }
        System.out.println(out);
    }

    /** Breadth-first search over arrangements: the fewest steps of one method from p to sorted. */
    static int minStepsByBfs(int[] p, int method) {
        int[] sorted = p.clone();
        Arrays.sort(sorted);
        String goal = Arrays.toString(sorted);
        Map<String, Integer> dist = new HashMap<>();
        ArrayDeque<int[]> queue = new ArrayDeque<>();
        dist.put(Arrays.toString(p), 0);
        queue.add(p.clone());
        while (!queue.isEmpty()) {
            int[] a = queue.poll();
            String key = Arrays.toString(a);
            int d = dist.get(key);
            if (key.equals(goal)) return d;          // BFS: the first time we see it is the fewest steps
            for (int[] b : neighbours(a, method)) {
                String next = Arrays.toString(b);
                if (!dist.containsKey(next)) {
                    dist.put(next, d + 1);
                    queue.add(b);
                }
            }
        }
        throw new IllegalStateException("sorted order not reachable");
    }

    /** Every arrangement one step of the given method away from a. */
    static List<int[]> neighbours(int[] a, int method) {
        List<int[]> result = new ArrayList<>();
        for (int i = 0; i < a.length; i++) {
            for (int j = 0; j < a.length; j++) {
                if (i == j) continue;
                if (method == 1 && j != i + 1) continue;   // swap two adjacent elements
                if (method == 2 && j < i) continue;        // swap any two elements (each pair once)
                if (method == 4 && j != 0) continue;       // move a[i] to the front
                result.add(method <= 2 ? swapped(a, i, j) : moved(a, i, j));
            }
        }
        return result;
    }

    static int[] swapped(int[] a, int i, int j) {
        int[] b = a.clone();
        b[i] = a[j];
        b[j] = a[i];
        return b;
    }

    /** a with the element at index i taken out and reinserted so that it ends at index j. */
    static int[] moved(int[] a, int i, int j) {
        int[] rest = new int[a.length - 1];
        for (int k = 0, r = 0; k < a.length; k++) {
            if (k != i) rest[r++] = a[k];
        }
        int[] b = new int[a.length];
        for (int k = 0, r = 0; k < a.length; k++) {
            b[k] = k == j ? a[i] : rest[r++];
        }
        return b;
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

**O(n! · n³) in the worst case.** There are n! arrangements; from each, method 3 generates n(n − 1) neighbours, and building and keying each costs O(n). Measured on my machine (JDK 26), the example (n = 8) takes 0.5 s, the reversed n = 9 array 7.5 s, and the five official CSES tests (all n = 10) between 32 s and 136 s each, with correct answers on all five. Hopeless at n = 2 · 10^5.

#### Space complexity

**O(n! · n):** the distance map holds up to n! arrangements of n numbers each.

#### The bridge to the next approach

> "BFS is the truth, but it explores everything. What I want instead is, for each method, a number computed straight from the permutation. Running the BFS on small cases suggests the numbers: method 1 matches the count of out-of-order pairs; method 2 matches n minus the number of loops in the 'value here belongs over there' arrows. For each I'll prove a lower bound and a matching construction."

### Alternative: the four formulas, counted the plain way (O(n²))

#### What I say out loud

> "Method by method, I look for a quantity that one step can change only a little. Adjacent swap: it flips the order of exactly one pair, so the out-of-order pair count drops by at most one per swap. Any swap: it changes the number of cycles by exactly one. Insert anywhere: the elements I never touch keep their order, so they must already be increasing. Move to front: the untouched ones end up at the back, so they must be the largest values, already in order. Each bound is reachable. Then I'll count each quantity in the simplest way and see what is too slow."

#### Intuition

Each method has an invariant-style quantity:

- **Inversions** (pairs i < j with p[i] > p[j]) for adjacent swaps.
- **Cycles** for arbitrary swaps. Draw an arrow from each position i to position p[i], the home of the value standing at i. Every position has one arrow out and one arrow in, so the arrows form disjoint loops. In the sorted array every loop is a single position, so there are n loops.
- **A longest increasing subsequence (LIS)** for insert-anywhere: whatever is never moved must already be in sorted order.
- **The longest top chain** for move-to-front: the largest m such that the values n − m + 1, …, n stand left to right in increasing order.

#### Algorithm

1. Read the permutation p[0..n−1].
2. Method 1: count pairs i < j with p[i] > p[j] with two nested loops, in a `long`.
3. Method 2: walk the arrows from every unvisited position, counting loops c. Answer n − c.
4. Method 3: `lis[i]` = longest increasing subsequence ending at i = 1 + max `lis[j]` over j < i with p[j] < p[i]. Answer n − max `lis[i]`.
5. Method 4: `pos[v]` = index of value v. Start with m = 1 (the value n on its own) and grow m while `pos[n − m] < pos[n − m + 1]`. Answer n − m.

#### Why it is correct

Each formula needs two halves: never fewer steps, and this many is enough.

**Method 1: exactly inv(p) adjacent swaps.**

- *Never fewer.* Swapping the neighbours at i and i + 1 changes the relative order of that pair only. Every other pair either does not involve them, or involves one of them and an element outside the two positions, whose side (left or right) does not change. So one swap changes the inversion count by exactly +1 or −1, the sorted array has 0, and at least inv(p) swaps are needed.
- *Enough.* If the array is not sorted, some neighbouring pair is out of order (if every neighbour pair were in order, the whole array would be increasing). Swapping that pair removes exactly one inversion. Repeating this sorts the array in exactly inv(p) swaps; it is bubble sort.

**Method 2: exactly n − c swaps, c being the number of cycles.**

- *Swaps change c by exactly one.* Swapping the contents of positions i and j changes two arrows: i now points where j used to point, and j where i used to point. If i and j are on the same loop, i → p[i] → … → j → p[j] → … → i, the loop splits into i → p[j] → … → i and j → p[i] → … → j: one more loop. If they are on different loops, the same rewiring joins the two loops into one: one fewer.
- *Never fewer.* The sorted array has n loops. Each swap adds at most one, so at least n − c swaps are needed.
- *Enough.* While some position i holds a value v ≠ i, swap positions i and v. Now v is home, a loop of its own: that swap split a loop, so each such swap adds one loop, and n − c swaps reach n loops, which is the sorted array.

**Method 3: exactly n − LIS moves.**

- *Never fewer.* Moving element x changes x's position relative to others, but two elements that are never moved keep their relative order, because a move takes out and reinserts a different element. In the sorted result, the never-moved elements are in increasing order, so they were already in increasing order at the start: they form an increasing subsequence. At most LIS elements stay, so at least n − LIS elements move, each at least once.
- *Enough.* Keep one longest increasing subsequence in place. Take the other elements one at a time and insert each just after the largest smaller value among the elements already "settled" (the kept ones plus those already inserted), or at the very front if there is none. The settled elements stay in increasing order after every insertion, and after n − LIS insertions every element is settled, so the array is sorted.

**Method 4: exactly n − m moves, m being the longest top chain.**

- *Where untouched elements end up.* Each moved element, at its last move, goes to the very front, ahead of every untouched element. Later moves bring other elements to the front and do not change the order of the remaining ones. So at the end every moved element stands before every untouched element, and the untouched ones are in their original relative order. The final array is "moved elements, then untouched elements".
- *Never fewer.* If the final array is sorted, the untouched elements are its last |U| values, n − |U| + 1, …, n, and they are in increasing order, which was their original order. So they form a top chain: |U| ≤ m, and at least n − m elements move.
- *Enough.* Move the values n − m, n − m − 1, …, 1 to the front, in that order. Each lands in front of the one moved before it, so the front reads 1, 2, …, n − m, followed by the untouched values n − m + 1, …, n, which were already in order. Exactly n − m moves.
- *Computing m.* The chain must be the *largest* values and *consecutive* ones: starting from n, keep adding n − m while it stands to the left of n − m + 1.

**Why methods 3 and 4 differ.** For `1 3 2`, the LIS is 2 (`1 3` or `1 2`), so one insertion is enough: move 2 between 1 and 3. But the top chain is just `3` (2 stands to the right of 3), so moving to the front costs 2: move 2, then 1. The untouched elements for method 4 must be the *largest* values, not any increasing set.

#### Dry run

The example `7 8 2 6 5 1 3 4`, n = 8.

Method 1, pairs counted per left element:

| Left element | Smaller values to its right | Count | Running total |
|---|---|---|---|
| 7 | 2, 6, 5, 1, 3, 4 | 6 | 6 |
| 8 | 2, 6, 5, 1, 3, 4 | 6 | 12 |
| 2 | 1 | 1 | 13 |
| 6 | 5, 1, 3, 4 | 4 | 17 |
| 5 | 1, 3, 4 | 3 | 20 |
| 1, 3, 4 | none | 0 | 20 |

Method 2: from position 1 the arrows go 1 → 7 → 3 → 2 → 8 → 4 → 6 → 1 (position 1 holds 7, position 7 holds 3, and so on), a loop of seven positions; position 5 holds 5, a loop on its own. c = 2, answer 8 − 2 = 6.

Method 3, `lis[i]`:

| i | p[i] | lis[i] | Best earlier smaller element |
|---|---|---|---|
| 0 | 7 | 1 | none |
| 1 | 8 | 2 | 7 |
| 2 | 2 | 1 | none |
| 3 | 6 | 2 | 2 |
| 4 | 5 | 2 | 2 |
| 5 | 1 | 1 | none |
| 6 | 3 | 2 | 2 or 1 |
| 7 | 4 | 3 | 3 |

LIS = 3 (for example `2 3 4`), answer 8 − 3 = 5.

Method 4: pos(8) = 1, pos(7) = 0 < 1, so the chain is 7, 8; pos(6) = 3 > 0, stop. m = 2, answer 6.

Output `20 6 5 6`, the expected answer.

#### Java code

```java title="Alternative: the four formulas with O(n²) counting (too slow at n = 2 · 10^5)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] p = readNumbers(in, n);
        long adjacentSwaps = countInversionsByPairs(p);
        int anySwaps = n - countCycles(p);
        int anyMoves = n - lisByQuadraticDp(p);
        int frontMoves = n - longestTopChain(p);
        System.out.println(adjacentSwaps + " " + anySwaps + " " + anyMoves + " " + frontMoves);
    }

    /** Method 1: the number of pairs i < j with p[i] > p[j], checking every pair. */
    static long countInversionsByPairs(int[] p) {
        long inversions = 0;                       // up to n(n-1)/2, about 2 * 10^10: long
        for (int i = 0; i < p.length; i++) {
            for (int j = i + 1; j < p.length; j++) {
                if (p[i] > p[j]) inversions++;
            }
        }
        return inversions;
    }

    /** Method 2: cycles of "position i holds value p[i], which belongs at position p[i]". */
    static int countCycles(int[] p) {
        int n = p.length;
        boolean[] seen = new boolean[n + 1];
        int cycles = 0;
        for (int start = 1; start <= n; start++) {
            if (seen[start]) continue;
            cycles++;
            for (int at = start; !seen[at]; at = p[at - 1]) {
                seen[at] = true;                   // positions are 1-based, the array 0-based
            }
        }
        return cycles;
    }

    /** Method 3: longest increasing subsequence, lis[i] = longest one ending at index i. */
    static int lisByQuadraticDp(int[] p) {
        int[] lis = new int[p.length];
        int best = 0;
        for (int i = 0; i < p.length; i++) {
            lis[i] = 1;
            for (int j = 0; j < i; j++) {
                if (p[j] < p[i] && lis[j] + 1 > lis[i]) lis[i] = lis[j] + 1;
            }
            best = Math.max(best, lis[i]);
        }
        return best;
    }

    /** Method 4: the largest m such that the values n-m+1, ..., n appear left to right in order. */
    static int longestTopChain(int[] p) {
        int n = p.length;
        int[] pos = new int[n + 1];
        for (int i = 0; i < n; i++) pos[p[i]] = i;
        int m = 1;                                 // the value n on its own
        while (m < n && pos[n - m] < pos[n - m + 1]) m++;
        return m;
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

**O(n²).** The pair count and the LIS table each do n(n − 1)/2 inner steps, about 2 · 10^10 at n = 2 · 10^5; the cycle walk and the top chain are O(n). Measured on my machine (JDK 26), a random permutation of 2 · 10^5 takes about 70 s, against a 1 s limit.

#### Space complexity

**O(n):** the permutation, the `seen` and `pos` arrays and the `lis` table.

#### The bridge to the next approach

> "Two of the four counts are already linear: the cycle walk and the top chain. The bottlenecks are the pair count and the LIS table, both quadratic because each element looks back at everything before it. For the pairs, merge sort is the classic fix: when I merge two sorted halves, one comparison tells me how many left-half elements a right-half element jumps over, all at once. For the LIS, instead of remembering the best length ending at each index, I'll keep, for each length, the smallest value a subsequence of that length can end with; that list is sorted, so I can binary-search it."

### Approach 1: Merge sort for the inversions, smallest tails for the LIS

#### What I say out loud

> "Inversions split three ways: both in the left half, both in the right half, or one on each side. Recursion counts the first two; the cross pairs I count while merging: whenever I take an element from the right half, every element still waiting in the left half is larger and was before it, so I add their number. For the LIS I keep `tails[k]`, the smallest value that ends an increasing subsequence of length k + 1. It is increasing, so each new value either extends the longest one or replaces the first tail that is not smaller than it, found by binary search."

#### Intuition

- **Merge count.** In a sorted left half L and a sorted right half R, when the merge takes r from R while L still has elements L[i..], all of L[i..] are greater than r (the merge would otherwise have taken L[i] first) and all stood before r. So the cross inversions involving r are exactly the number of elements left in L, found in O(1).
- **Smallest tails.** Among increasing subsequences of the same length, the one ending with the smallest value is the most useful, because anything that extends another one also extends it. Keeping only the smallest tail for each length loses nothing, and these tails are strictly increasing (a subsequence of length k + 2 contains one of length k + 1 ending lower).

#### Algorithm

1. Inversions: `count(a, lo, hi)` sorts a[lo..hi) and returns its inversions: if fewer than 2 elements, 0; otherwise count the two halves recursively, then merge, adding `mid − i` each time an element is taken from the right half while i is the next index in the left half. Run it on a copy, so the original p remains for the other three counts.
2. Cycles and the top chain: as before.
3. LIS: for each value v in order, find the first index k with `tails[k] ≥ v` by binary search over `tails[0..length)`; set `tails[k] = v`; if k == length, length grows by one. The answer is `length`.
4. Print `inversions`, n − cycles, n − length, n − m.

#### Why it is correct

- **Merge count.** Every inversion (i, j) is counted exactly once: at the unique recursion level where i and j fall into different halves (i in the left, j in the right; the left half holds smaller indices). At that level both halves are sorted, and the merge takes p[j] from the right half while p[i] is still waiting in the left half exactly when p[i] > p[j] (values are distinct). The `mid − i` addition counts exactly those waiting left elements. Sorting the halves does not change which pairs cross, only the order in which they are counted.
- **Smallest tails.** Invariant: after processing a prefix, `tails[k]` is the smallest possible last value of an increasing subsequence of length k + 1 in that prefix, and `length` is the LIS of the prefix. A new value v extends every subsequence whose tail is below v. The longest such has length k, where k is the first index with `tails[k] ≥ v` (all earlier tails are below v). So v ends a subsequence of length k + 1, and it is a smaller ending than `tails[k]` was, so it replaces it; if k == length, it is a new longest. No other entry can improve: a tail at index > k would need a length-(k+1) subsequence ending below v, which does not exist.
- The other two counts and all four formulas are proved in the previous rung.

#### Dry run

The example `7 8 2 6 5 1 3 4`.

Inversions by merge sort:

| Merge | Left (sorted) | Right (sorted) | Cross inversions |
|---|---|---|---|
| `7` + `8` | 7 | 8 | 0 |
| `2` + `6` | 2 | 6 | 0 |
| `7 8` + `2 6` | 7 8 | 2 6 | 2 is taken with 2 waiting (+2), 6 with 2 waiting (+2): 4 |
| `5` + `1` | 5 | 1 | 1 |
| `3` + `4` | 3 | 4 | 0 |
| `1 5` + `3 4` | 1 5 | 3 4 | 3 with 5 waiting (+1), 4 with 5 waiting (+1): 2 |
| top | 2 6 7 8 | 1 3 4 5 | 1 (+4), 3 (+3), 4 (+3), 5 (+3): 13 |

Total 4 + 1 + 2 + 13 = 20.

LIS with smallest tails:

| v | First tail ≥ v | tails after | length |
|---|---|---|---|
| 7 | none | 7 | 1 |
| 8 | none | 7 8 | 2 |
| 2 | 7 at k = 0 | 2 8 | 2 |
| 6 | 8 at k = 1 | 2 6 | 2 |
| 5 | 6 at k = 1 | 2 5 | 2 |
| 1 | 2 at k = 0 | 1 5 | 2 |
| 3 | 5 at k = 1 | 1 3 | 2 |
| 4 | none | 1 3 4 | 3 |

LIS = 3. With 2 cycles and m = 2 as before, the output is `20 6 5 6`. Here the final `tails`, `1 3 4`, happens to be an increasing subsequence of the array, but in general it need not be one (for `2 3 1` it ends as `1 3`, and 1 comes after 3); only its length is guaranteed.

#### Java code

```java title="Approach 1: merge sort inversions + smallest-tails LIS"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] p = readNumbers(in, n);
        long adjacentSwaps = countInversionsByMergeSort(p.clone(), new int[n], 0, n);
        int anySwaps = n - countCycles(p);
        int anyMoves = n - lisLength(p);
        int frontMoves = n - longestTopChain(p);
        System.out.println(adjacentSwaps + " " + anySwaps + " " + anyMoves + " " + frontMoves);
    }

    /** Sorts a[lo, hi) and returns its inversions: left half + right half + pairs across. */
    static long countInversionsByMergeSort(int[] a, int[] buf, int lo, int hi) {
        if (hi - lo < 2) return 0;
        int mid = (lo + hi) >>> 1;
        long inversions = countInversionsByMergeSort(a, buf, lo, mid)
                + countInversionsByMergeSort(a, buf, mid, hi);
        int i = lo, j = mid, k = lo;
        while (i < mid && j < hi) {
            if (a[i] < a[j]) {
                buf[k++] = a[i++];
            } else {
                inversions += mid - i;             // a[j] is smaller than all of a[i..mid)
                buf[k++] = a[j++];
            }
        }
        while (i < mid) buf[k++] = a[i++];
        while (j < hi) buf[k++] = a[j++];
        System.arraycopy(buf, lo, a, lo, hi - lo);
        return inversions;
    }

    static int countCycles(int[] p) {
        int n = p.length;
        boolean[] seen = new boolean[n + 1];
        int cycles = 0;
        for (int start = 1; start <= n; start++) {
            if (seen[start]) continue;
            cycles++;
            for (int at = start; !seen[at]; at = p[at - 1]) {
                seen[at] = true;
            }
        }
        return cycles;
    }

    /** tails[k] = smallest possible last value of an increasing subsequence of length k + 1. */
    static int lisLength(int[] p) {
        int[] tails = new int[p.length];
        int length = 0;
        for (int v : p) {
            int lo = 0, hi = length;               // first k with tails[k] >= v
            while (lo < hi) {
                int mid = (lo + hi) >>> 1;
                if (tails[mid] < v) lo = mid + 1;
                else hi = mid;
            }
            tails[lo] = v;
            if (lo == length) length++;
        }
        return length;
    }

    static int longestTopChain(int[] p) {
        int n = p.length;
        int[] pos = new int[n + 1];
        for (int i = 0; i < n; i++) pos[p[i]] = i;
        int m = 1;
        while (m < n && pos[n - m] < pos[n - m + 1]) m++;
        return m;
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

**O(n log n).** The merge sort has about log₂ n ≈ 18 levels with O(n) merging work each; the LIS does n binary searches over at most n tails; the cycle walk and the top chain are O(n). Measured on my machine (JDK 26), including JVM start, 0.16 s on a random permutation of 2 · 10^5 and 0.12 s on the reversed one.

#### Space complexity

**O(n):** the copy being sorted, the merge buffer, `tails`, `seen`, `pos`. The recursion is O(log n) deep.

#### The bridge to the next approach

> "This is fast enough. But the merge sort has a recursion, a buffer, and an off-by-one-prone `mid − i`, and it destroys its input, so I need a copy. Because the values are exactly 1..n, I can count 'earlier elements larger than me' directly: scan left to right and keep a count of the values seen so far in a Fenwick tree indexed by value. The number of earlier values at most p[i] is one prefix sum; the rest of the i earlier values are larger."

### Approach 2: Fenwick tree for the inversions, smallest tails for the LIS (recommended)

#### What I say out loud

> "I scan left to right. Before I add p[i], i values are already in the tree. A prefix sum up to p[i] tells me how many of them are smaller; the other i minus that are larger and before me, which is exactly the inversions that p[i] closes. Then I add p[i]. Both operations are O(log n). The other three numbers are the cycle count, the LIS by smallest tails, and the top chain, as before."

#### Intuition

An inversion is a pair (earlier larger, later smaller). Counting it from the later element's side turns the problem into "how many of the values seen so far exceed v", a prefix-count query over a set of values that only grows. A Fenwick tree answers prefix sums and point additions in O(log n), and since the values are 1..n they index the tree directly.

#### Algorithm

1. `tree = new int[n + 1]`, `inversions = 0` (a `long`).
2. For i from 0 to n − 1, with v = p[i]:
   - `smallerSeen` = prefix sum of `tree` over 1..v (walk `v -= v & -v`);
   - `inversions += i − smallerSeen`;
   - add 1 at v (walk `v += v & -v` while v ≤ n).
3. Cycles, LIS with smallest tails, and the top chain as in Approach 1.
4. Print the four answers.

#### Why it is correct

- **Fenwick count.** Invariant: before step i, the tree holds exactly the values p[0..i−1], each with count 1. The prefix sum up to p[i] is the number of those values that are ≤ p[i], which are all < p[i] because values are distinct. So `i − smallerSeen` is the number of earlier values greater than p[i], the inversions whose later element is p[i]. Every inversion has exactly one later element, so the sum over i counts each inversion once.
- **Fenwick operations.** Node v of the tree stores the count of values in (v − lowbit(v), v]. Stripping the lowest set bit of v walks a chain of disjoint blocks that exactly cover 1..v; adding the lowest set bit walks every node whose block contains v. Each chain has at most about log₂ n + 1 nodes.
- The LIS, the cycle count and the top chain are as proved above.

**The 30-second version:** "Each method has a quantity a step can move by at most one, and a construction that moves it by exactly one each time. Adjacent swaps fix one inversion each: answer = inversions, counted with a Fenwick tree in a `long`. A swap changes the number of cycles by one: n − cycles. Elements never moved must already be increasing: n − LIS. Elements never moved to the front end up at the back, so they must be the largest values in order: n − the longest chain n, n − 1, … appearing in increasing positions."

#### Dry run

The example `7 8 2 6 5 1 3 4`:

| i | v = p[i] | Earlier values ≤ v | Earlier and larger: i − that | Running inversions |
|---|---|---|---|---|
| 0 | 7 | 0 | 0 | 0 |
| 1 | 8 | 1 (7) | 0 | 0 |
| 2 | 2 | 0 | 2 | 2 |
| 3 | 6 | 1 (2) | 2 | 4 |
| 4 | 5 | 1 (2) | 3 | 7 |
| 5 | 1 | 0 | 5 | 12 |
| 6 | 3 | 2 (2, 1) | 4 | 16 |
| 7 | 4 | 3 (2, 1, 3) | 4 | 20 |

For instance, at i = 3, query(6) walks nodes 6 (block 5..6, count 0) and 4 (block 1..4, holding 2): 1. Then add(6) updates nodes 6 and 8. With cycles 2, LIS 3 and top chain 2 as before, the program prints `20 6 5 6`.

#### Java code

```java title="Approach 2: Fenwick tree inversions + smallest-tails LIS (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] p = readNumbers(in, n);
        long adjacentSwaps = countInversionsByFenwick(p);
        int anySwaps = n - countCycles(p);
        int anyMoves = n - lisLength(p);
        int frontMoves = n - longestTopChain(p);
        System.out.println(adjacentSwaps + " " + anySwaps + " " + anyMoves + " " + frontMoves);
    }

    /** For each element, counts the earlier elements larger than it, with a Fenwick tree over values. */
    static long countInversionsByFenwick(int[] p) {
        int n = p.length;
        int[] tree = new int[n + 1];               // tree counts the values seen so far
        long inversions = 0;                       // up to n(n-1)/2, about 2 * 10^10: long
        for (int i = 0; i < n; i++) {
            int smallerSeen = 0;                   // earlier values in 1..p[i]
            for (int v = p[i]; v > 0; v -= v & -v) smallerSeen += tree[v];
            inversions += i - smallerSeen;         // the other i earlier values are larger
            for (int v = p[i]; v <= n; v += v & -v) tree[v]++;
        }
        return inversions;
    }

    /** Cycles of "position i holds value p[i], which belongs at position p[i]" (1-based). */
    static int countCycles(int[] p) {
        int n = p.length;
        boolean[] seen = new boolean[n + 1];
        int cycles = 0;
        for (int start = 1; start <= n; start++) {
            if (seen[start]) continue;
            cycles++;
            for (int at = start; !seen[at]; at = p[at - 1]) {
                seen[at] = true;
            }
        }
        return cycles;
    }

    /** tails[k] = smallest possible last value of an increasing subsequence of length k + 1. */
    static int lisLength(int[] p) {
        int[] tails = new int[p.length];
        int length = 0;
        for (int v : p) {
            int lo = 0, hi = length;               // first k with tails[k] >= v
            while (lo < hi) {
                int mid = (lo + hi) >>> 1;
                if (tails[mid] < v) lo = mid + 1;
                else hi = mid;
            }
            tails[lo] = v;
            if (lo == length) length++;
        }
        return length;
    }

    /** The largest m such that the values n-m+1, ..., n appear left to right in increasing order. */
    static int longestTopChain(int[] p) {
        int n = p.length;
        int[] pos = new int[n + 1];
        for (int i = 0; i < n; i++) pos[p[i]] = i;
        int m = 1;                                 // the value n on its own
        while (m < n && pos[n - m] < pos[n - m + 1]) m++;
        return m;
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

**O(n log n):** n Fenwick queries and n updates of O(log n) each, n binary searches for the LIS, and two O(n) passes. Measured on my machine (JDK 26), including JVM start, 0.16 s on a random permutation of 2 · 10^5 and 0.10 s on the reversed one. Both O(n log n) programs pass the five official CSES tests stored with the site.

#### Space complexity

**O(n):** the Fenwick array, `tails`, `seen` and `pos`. The input is not counted.

## 5. Comparison table

n is the length of the permutation. Nothing is randomized, so expected and worst case agree.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| BFS over arrangements | O(n! · n³) | O(n! · n³) | O(n! · n) |
| Formulas, O(n²) counting | O(n²) | O(n²) | O(n) |
| 1. Merge sort + smallest tails | O(n log n) | O(n log n) | O(n) |
| 2. Fenwick tree + smallest tails | O(n log n) | O(n log n) | O(n) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| BFS over arrangements | The definition itself; no proof needed | Only n ≤ 9 or so | Checking the formulas on small cases |
| Formulas, O(n²) counting | Simplest correct code for each formula | About 70 s at n = 2 · 10^5 | A first version, or n up to a few thousand |
| 1. Merge sort + smallest tails | No extra data structure beyond merge sort | Recursion, a buffer, a copy of the input, `mid − i` off-by-ones | When values are not 1..n and you do not want to compress them |
| 2. Fenwick tree + smallest tails | Short loops, values index the tree directly | Needs Fenwick tree fluency | The answer to give here |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2, but lead with the four proofs, which are what the problem is really testing. The counts are routine once the formulas are proved.

**Is it optimal?** Methods 2 and 4 are O(n), and reading the input is Ω(n) in the worst case. For inversions and the LIS, O(n log n) is the standard bound. Word-RAM algorithms that beat n log n for counting inversions of a permutation exist in the research literature, but nobody expects them in an interview, and at n = 2 · 10^5 the program already runs in well under the limit.

**Merge sort or Fenwick?** Either is a full-credit answer. The Fenwick version is shorter here because the values are already 1..n. If the interviewer gives arbitrary values, merge sort avoids coordinate compression.

Stop when the four proofs are clear and the inversion count is a `long`.

## 7. Interview script: code it and test it

### What I say while coding

> "Four helper methods, one per method of sorting, so each formula stays readable and testable on its own."

> "The inversion total is a `long`. The Fenwick counts themselves are at most n, so `int` is fine inside the tree."

> "For the cycles I walk from each unseen position, following position → value at that position, marking as I go. 1-based positions over a 0-based array, so `p[at − 1]`."

> "The LIS is strictly increasing; with distinct values, lower bound (`tails[mid] < v`) is the right search."

> "For the top chain I need positions by value, so one `pos` array, then a single loop down from n."

### Testing out loud

**The example `7 8 2 6 5 1 3 4`:** 20 inversions (traced above), 2 cycles → 6, LIS 3 → 5, chain 7, 8 → 6. Prints `20 6 5 6`.

**n = 1, `1`:** no inversions, one cycle → 0, LIS 1 → 0, chain 1 → 0. `0 0 0 0`.

**Sorted `1 2 … n`:** 0 inversions, n cycles, LIS n, chain n. `0 0 0 0`.

**`1 3 2`:** 1 inversion; cycles {1}, {2, 3} → 3 − 2 = 1; LIS 2 → 1; chain: pos(3) = 1, pos(2) = 2 > 1, so m = 1 → 2. `1 1 1 2`, where methods 3 and 4 differ.

**Rotation `2 3 4 5 6 7 1`:** inversions 6 (1 is behind all six); one 7-cycle → 6 swaps; LIS 6 → 1; chain 7, 6, …, 2 in increasing positions → m = 6 → 1. `6 6 1 1`.

**Reversed, n = 2 · 10^5:** inversions n(n − 1)/2 = 19,999,900,000, which needs the `long`; the swaps pair i with n + 1 − i, n/2 two-cycles → 100,000; LIS 1 → 199,999; chain only n → 199,999. The test file checks exactly these numbers.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify, hand examples | 5 min | Each method on `3 1 2` and `1 3 2` |
| Four lower bounds and constructions | 15 min | Inversions, cycles, LIS, top chain, each proved both ways |
| Fast counts | 5 min | Fenwick (or merge sort) and smallest tails |
| Code | 12 min | Four helpers, `long`, fast input |
| Trace | 5 min | The example, `1 3 2`, the reversed overflow case |

Most of the time goes to the proofs; the code is short. If one method resists, write its BFS answers for all permutations of 3 and 4 and look for the pattern in the elements that stay put.

## 9. Interviewer challenges

### About correctness

#### Why does an adjacent swap change the inversion count by exactly one?

**What they are testing:** whether the lower bound for method 1 is argued, not assumed.

**How to reason:** list the pairs whose relative order a swap of positions i, i + 1 can change.

**What I say:** "Only the pair being swapped changes its relative order. Any other element is either left of both or right of both, before and after, so its pairs with them keep their order. So the count moves by exactly one, up or down, and I need at least inv(p) swaps; swapping an out-of-order neighbour pair, which always exists in an unsorted array, achieves it."

**Nuance:** a swap of two non-adjacent elements can change the inversion count by much more than one, which is why method 2 needs a different measure (cycles).

#### Why can't one swap fix more than one cycle's worth?

**What they are testing:** the cycle argument for method 2.

**How to reason:** look at the two arrows a swap rewires.

**What I say:** "A swap of positions i and j changes only the arrows out of i and j: they exchange targets. On one loop, that cuts it in two; across two loops, it joins them. Either way the number of loops changes by exactly one. Sorted means n loops, so I need n − c swaps, and putting one misplaced value home per swap gets there."

**Nuance:** the last swap of a loop puts two elements home at once (a 2-cycle becomes two fixed points), which is why a k-cycle costs k − 1 swaps and not k.

#### Why isn't method 4 also n − LIS?

**What they are testing:** whether you see where untouched elements end up.

**How to reason:** run move-to-front on a small case where LIS and the top chain differ.

**What I say:** "Every moved element ends in front of every untouched one, so the untouched elements must be the largest values. In `1 3 2`, keeping `1 3` would be fine for insertion, but for move-to-front 1 and 2 must both move, since 2 has to come out from behind 3. So method 4 keeps the longest chain n, n − 1, … in increasing positions, which can be much shorter than the LIS."

**Nuance:** the chain is computed in O(n) from `pos`, no LIS machinery needed. Method 4's answer is always at least method 3's, since a top chain is an increasing subsequence.

### About implementation

#### What goes wrong with an `int` inversion count?

**What they are testing:** overflow awareness from the constraints.

**How to reason:** compute the maximum, n(n − 1)/2.

**What I say:** "At n = 2 · 10^5 reversed it is 19,999,900,000, over nine times `Integer.MAX_VALUE`. With an `int` the reversed case prints −1474936480 as the first number; I ran it."

**Nuance:** only the running total needs 64 bits; the Fenwick node counts stay at most n.

#### Merge sort or Fenwick tree: which would you write?

**What they are testing:** judgement, and whether you know both.

**How to reason:** compare what each needs from the input.

**What I say:** "With values exactly 1..n, the Fenwick tree is about six lines and has no recursion. With arbitrary values I'd either compress them first (sort plus binary search, O(n log n)) or use the merge sort count, which needs only comparisons."

**Nuance:** the merge sort version sorts its input, so pass it a copy when the original is still needed, as here for the other three counts.

## 10. Follow-up questions the interviewer might ask

**"Print the swaps for method 2, not just their number."**
Walk each cycle and, while position i holds v ≠ i, swap positions i and v and record the pair. Each swap puts one value home, so exactly n − c pairs are printed. O(n) time.

**"Method 4, but moving to the back instead of the front."**
Symmetric: the untouched elements end at the front, so they must be the values 1, 2, …, m′ in increasing positions. Answer n − m′, where m′ is the largest with pos(1) < pos(2) < … < pos(m′). O(n).

**"Each step reverses any subarray. Minimum number of steps?"**
That is sorting by reversals, which for unsigned permutations was shown NP-hard (Caprara, 1997), so no formula like the four here is expected. CSES asks only for some solution with at most n reversals in [[cses-reversal-sorting|Reversal Sorting]].

**"How many rounds does bubble sort take, if each round sweeps left to right once?"**
Each round moves every element that has a larger element before it exactly one step left, so the answer is the largest number of larger elements standing before any single element (I checked this against a simulation on random arrays), computable with the same Fenwick scan in O(n log n). That problem is [[cses-bubble-sort-rounds-i|Bubble Sort Rounds I]].

**"With swaps, sort in as few rounds as possible, where a round is any set of disjoint swaps."**
The cycle structure again: 0 rounds if sorted, 1 if every cycle has length at most 2, otherwise 2, because any cycle can be rotated by two reflections. That is [[cses-swap-round-sorting|Swap Round Sorting]].

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Counting misplaced elements for method 2.** `2 3 1` has three misplaced elements but needs only two swaps; the answer is n − cycles.
- **Using the LIS for method 4.** For `1 3 2` that gives 1, but the answer is 2. Untouched elements must be the largest values.
- **Proving only one direction.** "Each swap fixes at most one inversion" gives a lower bound; the existence of an out-of-order neighbour pair is what makes it reachable. The interviewer will ask for both halves.

### Implementation mistakes

> [!MISTAKE] An `int` inversion total
> The count reaches 19,999,900,000. With `int inversions`, the reversed array of 2 · 10^5 prints `-1474936480 100000 199999 199999` (verified). Use `long`.

> [!MISTAKE] Method 4 as "the increasing suffix of the array"
> Counting how long the array ends in an increasing run (instead of the chain n, n − 1, … by position) prints `2 2 1 1` for `3 1 2` (verified), but moving to the front needs 2 steps there: move 2, then 1. The chain is over values, read through `pos`.

- **Mixing 0-based and 1-based positions in the cycle walk.** The values are 1..n; following `p[at]` instead of `p[at − 1]` on a 0-based array reads past the end.
- **Using `Scanner` or printing in a loop.** 2 · 10^5 tokens through `Scanner` costs a large share of the second; read with `BufferedReader`.
- **Forgetting to copy before the merge sort count.** It sorts the array, and the cycle count and top chain then see a sorted array and print 0.

## 12. Pattern recognition

**The pattern:** a minimum number of operations proved by a **lower bound plus a matching construction**. Find a quantity that one operation changes by at most one (inversions, cycles) or a set of elements that an operation cannot fix (never-moved elements must already be in order), show the sorted state has a fixed value of it, then show a greedy step always changes it by exactly one.

**Signals in the problem statement:**

- "Minimum number of operations to sort a permutation": think inversions (adjacent swaps), cycles (any swaps), LIS (insertions).
- A permutation of 1..n: values index arrays and Fenwick trees directly, and "where does v belong" is position v.
- n up to 2 · 10^5 and a pair count in the answer: O(n log n) counting, and a `long`.

**Related problems in this list:**

- [[cses-swap-round-sorting|Swap Round Sorting]]: the cycle structure of method 2, with swaps grouped into rounds.
- [[cses-increasing-subsequence|Increasing Subsequence]]: the smallest-tails LIS on its own, with arbitrary values.
- [[nc-longest-increasing-subsequence|Longest Increasing Subsequence]]: the same LIS, with the O(n²) DP as the usual first step.
- [[cses-collecting-numbers|Collecting Numbers]]: another count read straight from `pos`, comparing positions of consecutive values.
- [[cses-bubble-sort-rounds-i|Bubble Sort Rounds I]]: adjacent swaps again, counted in rounds.
- [[nc-sort-an-array|Sort an Array]]: merge sort itself, the base of Approach 1.
- [[nc-sort-colors|Sort Colors]]: sorting with swaps, where the values come from three classes instead of a permutation.
- [[nc-first-missing-positive|First Missing Positive]]: placing each value at its home index by swaps, the construction behind method 2.

**Takeaway:** for "minimum operations to sort", name what one operation can change, prove that it changes by at most one (or what it cannot touch), and show a step that always achieves exactly that. The formula then follows, and computing it is a standard count.

## 13. 60-second revision card

**Key insight:** adjacent swaps = inversions; any swaps = n − cycles; insert anywhere = n − LIS; move to front = n − (longest chain n, n − 1, … standing in increasing positions).

**Invariant:** an adjacent swap changes inversions by exactly 1; any swap changes the cycle count by exactly 1; untouched elements keep their relative order (and, for move-to-front, end up at the back).

**Complexity:** O(n log n) time (Fenwick tree and smallest-tails LIS), O(n) space.

**Code skeleton:**

```java title="Sorting Methods, Fenwick + smallest tails"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] p = new int[n], pos = new int[n + 1], tree = new int[n + 1], tails = new int[n];
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < n; i++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(in.readLine());
            p[i] = Integer.parseInt(st.nextToken());
            pos[p[i]] = i;
        }
        long inv = 0;
        for (int i = 0; i < n; i++) {
            int le = 0;
            for (int v = p[i]; v > 0; v -= v & -v) le += tree[v];
            inv += i - le;
            for (int v = p[i]; v <= n; v += v & -v) tree[v]++;
        }
        boolean[] seen = new boolean[n + 1];
        int cycles = 0;
        for (int s = 1; s <= n; s++) {
            if (seen[s]) continue;
            cycles++;
            for (int at = s; !seen[at]; at = p[at - 1]) seen[at] = true;
        }
        int len = 0;
        for (int v : p) {
            int lo = 0, hi = len;
            while (lo < hi) { int mid = (lo + hi) >>> 1; if (tails[mid] < v) lo = mid + 1; else hi = mid; }
            tails[lo] = v;
            if (lo == len) len++;
        }
        int m = 1;
        while (m < n && pos[n - m] < pos[n - m + 1]) m++;
        System.out.println(inv + " " + (n - cycles) + " " + (n - len) + " " + (n - m));
    }
}
```

**Main traps:**

- The inversion total is a `long` (up to 19,999,900,000).
- Method 4 is not the LIS: the kept elements must be the largest values.
- Copy the array before a merge sort count; 1-based positions in the cycle walk.

**What to say in one breath:** "Each method has a measure one step changes by at most one: inversions for adjacent swaps, cycles for any swaps, an increasing set of untouched elements for insertions, and a top chain of untouched elements for moves to the front. Each bound is reachable, so the answers are inv, n − cycles, n − LIS, n − chain, in O(n log n) with a Fenwick tree and the smallest-tails LIS."
