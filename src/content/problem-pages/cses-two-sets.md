---
problemId: cses-two-sets
title: Two Sets
source: cses
sourceUrl: https://cses.fi/problemset/task/1092
difficulty: easy
patterns: [introductory, construction, mathematics, greedy]
relatedLessons: [a1-java-syntax-competitive, a10-sorting-greedy, a14-brute-force-first, a14-edge-cases]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

You get one integer n. Split the numbers 1, 2, …, n into two sets so that both sets have the same sum; every number goes into exactly one set. If it cannot be done, print `NO`. Otherwise print `YES`, then the size of the first set, then its elements on one line, then the size of the second set, then its elements on one line. This is a whole program reading standard input and writing standard output.

**Example 1**

- Input: `7`
- Output, five lines: `YES`, `4`, `1 2 4 7`, `3`, `3 5 6`
- Why: 1 + 2 + 4 + 7 = 14 and 3 + 5 + 6 = 14, and together the two sets hold each of 1 to 7 once.

**Example 2**

- Input: `6`
- Output: `NO`
- Why: no way of splitting 1 to 6 gives two equal sums.

**What the problem statement guarantees**

- 1 ≤ n ≤ 10^6.
- When a split exists, any valid split is accepted.
- Time limit: 1 second.

## 2. Practice first: try it before reading on

If you have not solved this yourself yet, stop here. Two questions hide in it: *when* is a split possible, and *how* do you build one fast? Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 20 minutes.
2. By hand, decide n = 1 to 8: split, or explain why not.
3. Find a rule for which n work, and prove it in both directions.
4. Write the full program and work out the largest number it has to hold.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> If the two sets have equal sums, what can you say about the total 1 + 2 + … + n? Compute that total for n = 1 to 8 and look at which ones pass.

> [!HINT] Hint 2: the kind of tool you need
> The total must be even, and that depends only on n modulo 4. To build a split, either pair numbers that add up to the same value, or fill the first set with large numbers first while they still fit under half the total.

> [!HINT] Hint 3: almost the whole plan
> Let `target` be half of n(n+1)/2, computed in `long`. Go from n down to 1 and put x into the first set whenever x ≤ the amount still missing. Prove that the missing amount always ends at exactly 0. Mark membership in a boolean array, then build all the output in one buffer and print it once.

**Check yourself before revealing the walkthrough**

- [ ] I can say exactly which n print `NO`, and why every other n has a split
- [ ] I know the largest total my program computes, and my variable type holds it
- [ ] My program handles n = 3 (sets {1, 2} and {3})
- [ ] Each set's size is printed on its own line before its elements

## 3. Interview script: understand the problem (≈2 min)

Treat it as if an interviewer had posed it; the questions are about the output format and how big the numbers get.

**Me:** I split 1 to n into two disjoint sets that cover everything and have equal sums. If I can, I print YES and both sets with their sizes; otherwise NO. Any valid split is accepted?

**Interviewer:** Yes, it is checked by a judge.

**Me:** Exact format: `YES` on a line, the first set's size on a line, its elements space-separated on the next line, then the same for the second set?

**Interviewer:** Exactly. Extra whitespace at the end of a line is fine.

**Me:** n up to 10^6. The total is n(n+1)/2, about 5 · 10^11 at the top. That is over 2^31 − 1 ≈ 2.1 · 10^9, so the total needs a `long`. And the output can be a million numbers, so I build it in one buffer.

**Interviewer:** Fine.

**Me:** Small cases. The two sums are equal, so the total is twice one of them, which makes it even. n = 1: total 1, odd, NO. n = 2: total 3, NO. n = 3: total 6; {1, 2} and {3}. n = 4: total 10; {1, 4} and {2, 3}. n = 5: 15, NO. n = 6: 21, NO, which matches the example. n = 7: 28, and the example shows a split. So far every even total has worked.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^6 | Searching subsets is out; I need an O(n) construction. The total reaches 500,000,500,000, so it is a `long`. |
| Time limit 1 s | Output of about 6.9 million characters: one `StringBuilder`, printed once. |
| Any valid split is accepted | I am free to choose whichever construction is easiest to prove. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Format: YES, size, elements, size, elements, each on its own line | I collect the two sets separately so that I know each size before printing it. |
| `NO` alone when impossible | Nothing else is printed in that case. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The elements of a set can be printed in any order | The statement asks for the elements, not a sorted list. My code prints them in increasing order anyway. |

### Edge cases I will keep in mind

- n = 1 and n = 2: NO.
- n = 3: the smallest YES, and the reason the n ≡ 3 (mod 4) case needs its own start.
- n = 4: the smallest n ≡ 0 (mod 4).
- n ≥ 46,341: n(n+1) no longer fits in an `int`.
- n = 10^6: output speed.

## 4. Think out loud: from first idea to best solution

**When is a split possible?** If both sets sum to s, the total n(n+1)/2 equals 2s, so it is even. Conversely, both constructions below build a split whenever the total is even, so "total is even" is the exact condition.

**Which n give an even total?** n(n+1)/2 is even exactly when 4 divides n(n+1). Of n and n + 1, one is odd, so the factor 4 must come entirely from the even one: either 4 divides n (n ≡ 0 mod 4) or 4 divides n + 1 (n ≡ 3 mod 4). For n ≡ 1 or 2 mod 4 the even factor is 2 times an odd number, so the total is odd and the answer is NO.

A brute force that tries all 2^n subsets would also decide this, and is a good way to check the rule for n ≤ 20 on paper or in a scratch file, but it is far too slow for n = 10^6, so it is not a numbered approach. (The test file checks the rule against a subset-sum table for n ≤ 60.)

### Approach 1: Pair up numbers by n mod 4

#### What I say out loud

> "Numbers from opposite ends pair up to the same sum: 1 + n, 2 + (n − 1), and so on. If n is a multiple of 4, there are n/2 such pairs, an even number of them, so I give half the pairs to each set. If n ≡ 3, I first balance {1, 2} against {3}, and the rest, 4 to n, is a block whose length is a multiple of 4, which I pair the same way."

#### Intuition

Every pair (lo + k, n − k) of a block lo..n has the same sum lo + n. Equal pairs are interchangeable, so the only requirement is that each set gets the same number of pairs, which needs the block length to be a multiple of 4. For n ≡ 0 mod 4 the block is all of 1..n. For n ≡ 3 mod 4, taking out 1, 2, 3 leaves 4..n of length n − 3, a multiple of 4, and {1, 2} vs {3} is balanced on its own.

#### Algorithm

1. Read n. If n mod 4 is 1 or 2, print `NO`.
2. `inFirst = new boolean[n + 1]`; `lo = 1`.
3. If n mod 4 is 3: mark 1 and 2 as in the first set; `lo = 4` (3 stays in the second).
4. The block lo..n has n − lo + 1 numbers, a multiple of 4. For k from 0 to (n − lo + 1)/4 − 1, mark `lo + k` and `n − k`.
5. Print `YES`, then both sets from the marks.

#### Why it is correct

- **Disjoint and covering.** Each number is either marked or not, so it lands in exactly one set.
- **Equal sums, n ≡ 0 mod 4.** The block 1..n splits into n/2 pairs (k, n + 1 − k), each summing n + 1. The first set takes the n/4 outermost pairs (k from 1 to n/4); the second gets the other n/4 pairs. Both sums are (n/4)(n + 1).
- **Equal sums, n ≡ 3 mod 4.** {1, 2} and {3} both sum to 3. The block 4..n has n − 3 numbers, which is a multiple of 4, so it splits into (n − 3)/2 pairs of sum n + 4, half to each set.
- **NO is correct** for n ≡ 1 or 2 mod 4, because the total is odd (shown above).

#### Dry run

n = 7 (n mod 4 = 3)

| Step | First set so far | Second set |
|---|---|---|
| balance 1, 2 against 3 | 1, 2 | 3 |
| block 4..7, one pair each: k = 0 marks 4 and 7 | 1, 2, 4, 7 | 3, 5, 6 |

Sums 14 and 14, exactly the example's output. For n = 8 (block 1..8, two pairs each), k = 0 and 1 mark 1, 8, 2, 7: first set {1, 2, 7, 8} = 18, second {3, 4, 5, 6} = 18.

#### Java code

```java title="Approach 1: pairing by n mod 4"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());

        if (n % 4 == 1 || n % 4 == 2) {       // 1 + ... + n is odd
            System.out.println("NO");
            return;
        }
        boolean[] inFirst = new boolean[n + 1];
        int lo = 1;                           // first number of the block that is paired up
        if (n % 4 == 3) {                     // {1, 2} balances {3}; pair up 4..n
            inFirst[1] = true;
            inFirst[2] = true;
            lo = 4;
        }
        int pairsEach = (n - lo + 1) / 4;     // the block has a multiple of 4 numbers
        for (int k = 0; k < pairsEach; k++) { // pair (lo + k, n - k) sums to lo + n
            inFirst[lo + k] = true;
            inFirst[n - k] = true;
        }
        print(n, inFirst);
    }

    static void print(int n, boolean[] inFirst) {
        StringBuilder first = new StringBuilder();
        StringBuilder second = new StringBuilder();
        int firstSize = 0;
        for (int x = 1; x <= n; x++) {
            if (inFirst[x]) {
                first.append(x).append(' ');
                firstSize++;
            } else {
                second.append(x).append(' ');
            }
        }
        StringBuilder out = new StringBuilder();
        out.append("YES\n");
        out.append(firstSize).append('\n').append(first).append('\n');
        out.append(n - firstSize).append('\n').append(second).append('\n');
        System.out.print(out);
    }
}
```

#### Time complexity

**O(n).** The pairing loop runs about n/4 times, and printing visits each number once. The `StringBuilder` growth copies add up to O(n).

#### Space complexity

**O(n):** the boolean array of n + 1 entries, plus the output buffers (about 6.9 million characters at n = 10^6), which hold the output itself.

#### The bridge to the next approach

> "This works and never computes the total, so it cannot overflow. But it has two cases and an index formula for each, and the n ≡ 3 case is easy to get subtly wrong. Is there a single rule that doesn't care about n mod 4? I know the target exactly: half the total. If I take big numbers while they fit, the leftover shrinks fast, and the small numbers at the end can fill whatever gap is left."

### Approach 2: Greedy from n downwards (recommended)

#### What I say out loud

> "If the total is odd, NO. Otherwise the first set must reach target = total / 2, in a `long`. I walk x from n down to 1 and take x whenever it is at most what's still missing. I claim the missing amount always ends at exactly zero: before I look at x, what's missing is never more than 1 + 2 + … + x, the sum of everything I still have."

#### Intuition

Large numbers make big progress and small numbers fix the remainder. When some x is too big to take, the missing amount is smaller than x, and the numbers 1..x − 1 that are still available add up to far more than that, so nothing is ever lost by skipping.

#### Algorithm

1. Read n. `total = (long) n * (n + 1) / 2`. If `total` is odd, print `NO`.
2. `remaining = total / 2`; `inFirst = new boolean[n + 1]`.
3. For x from n down to 1: if `x <= remaining`, mark x and subtract it from `remaining`.
4. Print `YES`, then both sets from the marks.

#### Why it is correct

- **The first set never overshoots.** x is taken only when x ≤ `remaining`, so `remaining` never goes below 0.
- **It always reaches the target exactly.** Invariant: just before x is considered, `remaining` ≤ 1 + 2 + … + x = x(x + 1)/2.
  - At the start (x = n), `remaining` is total/2 ≤ total = n(n + 1)/2.
  - If x is taken, the new `remaining` is at most x(x + 1)/2 − x = (x − 1)x/2, the invariant for x − 1.
  - If x is skipped, `remaining` < x, so `remaining` ≤ x − 1 ≤ (x − 1)x/2 when x ≥ 2 (because x/2 ≥ 1). When x = 1 is skipped, `remaining` < 1 means it is already 0.
  - After x = 1 the invariant says `remaining` ≤ 0, and it is never negative, so it is exactly 0.
- **So the first set sums to total/2 and the second set gets the other half.** NO is printed only when the total is odd, which is impossible to split.

Notice the argument never used n mod 4: the greedy reaches *any* integer target between 0 and the total. Parity only decides whether total/2 is an integer.

**The 20-second version:** "Equal halves need an even total, which happens exactly when n mod 4 is 0 or 3. Then I go from n down and take each number that fits in what's still missing. Before looking at x, the missing part is at most 1 + … + x, and that stays true whether I take x or skip it, so after x = 1 nothing is missing."

#### Dry run

n = 7: total 28, target 14.

| x | remaining before | x ≤ remaining? | remaining after | First set |
|---|---|---|---|---|
| 7 | 14 | yes | 7 | 7 |
| 6 | 7 | yes | 1 | 6, 7 |
| 5 | 1 | no | 1 | 6, 7 |
| 4 | 1 | no | 1 | 6, 7 |
| 3 | 1 | no | 1 | 6, 7 |
| 2 | 1 | no | 1 | 6, 7 |
| 1 | 1 | yes | 0 | 1, 6, 7 |

The program prints `YES`, `3`, `1 6 7`, `4`, `2 3 4 5`: a different split from the example, equally valid (14 and 14). For n = 8 (target 18) it takes 8, 7, then 3, giving {3, 7, 8} and {1, 2, 4, 5, 6}.

#### Java code

```java title="Approach 2: greedy from n downwards (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());

        long total = (long) n * (n + 1) / 2;  // up to about 5 * 10^11: needs long
        if (total % 2 != 0) {
            System.out.println("NO");
            return;
        }
        long remaining = total / 2;           // what the first set still needs
        boolean[] inFirst = new boolean[n + 1];
        for (int x = n; x >= 1; x--) {        // largest first
            if (x <= remaining) {
                inFirst[x] = true;
                remaining -= x;
            }
        }
        print(n, inFirst);
    }

    static void print(int n, boolean[] inFirst) {
        StringBuilder first = new StringBuilder();
        StringBuilder second = new StringBuilder();
        int firstSize = 0;
        for (int x = 1; x <= n; x++) {
            if (inFirst[x]) {
                first.append(x).append(' ');
                firstSize++;
            } else {
                second.append(x).append(' ');
            }
        }
        StringBuilder out = new StringBuilder();
        out.append("YES\n");
        out.append(firstSize).append('\n').append(first).append('\n');
        out.append(n - firstSize).append('\n').append(second).append('\n');
        System.out.print(out);
    }
}
```

#### Time complexity

**O(n):** one downward pass and one printing pass. Measured on my machine (JDK 26, output to `/dev/null`), the whole program at n = 10^6, JVM start included, takes about 0.08 s; Approach 1 takes the same.

#### Space complexity

**O(n):** the boolean array plus the output buffers.

## 5. Comparison table

n is the input number. Nothing is randomized, so expected and worst case agree.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Try all subsets (prose only) | O(2^n · n) | O(2^n · n) | O(n) |
| 1. Pairing by n mod 4 | O(n) | O(n) | O(n) marks and output |
| 2. Greedy from n downwards | O(n) | O(n) | O(n) marks and output |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Try all subsets | Decides small cases with no insight | Hopeless beyond n ≈ 25 | Checking the parity rule on paper |
| 1. Pairing by n mod 4 | Never computes the total, so no overflow risk; very visual | Two cases with their own index formulas | When you see the pairs first, or must avoid 64-bit arithmetic |
| 2. Greedy downwards | One rule for every n; works for any target, not only half | Needs `long`, and a proof that it never gets stuck | The answer to give |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2, with the parity argument first. It is O(n), and the output alone has n numbers, so no algorithm can do asymptotically better. Mention Approach 1 as the alternative if the interviewer asks for one or if you found the pairs first; both are fully acceptable.

Stop once the proof is clear. The remaining risk is not speed but the `long` and the exact output format.

## 7. Interview script: code it and test it

### What I say while coding

> "`total` is a `long`, and I cast before multiplying: `(long) n * (n + 1)`. Writing `long total = n * (n + 1) / 2` still multiplies in `int` and overflows first."

> "I mark membership in a boolean array rather than building lists, because I need each set's size before its elements, and one pass over 1..n gives both."

> "All output goes to one `StringBuilder`, printed once; a million separate prints would be too slow in Java."

### Testing out loud

**n = 7:** total 28, target 14; takes 7, 6, 1. First set `1 6 7`, size 3; second `2 3 4 5`, size 4. Sums 14 and 14.

**n = 6:** total 21, odd, `NO`.

**n = 1 and n = 2:** totals 1 and 3, `NO`.

**n = 3:** total 6, target 3: x = 3 fits, `remaining` = 0, 2 and 1 skipped. First set `3`, second `1 2`. Correct, and the reverse of Approach 1's {1, 2} / {3}.

**n = 4:** target 5: takes 4, skips 3 and 2, takes 1. {1, 4} and {2, 3}.

**n = 10^6:** total 500,000,500,000, target 250,000,250,000, both far beyond `int`; the `long` holds them.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify, small cases | 3 min | Format; n = 1 to 7 by hand |
| Existence rule | 3 min | Even total ⇔ n mod 4 ∈ {0, 3}, with the proof |
| Construction and proof | 5 min | Greedy and its invariant (or the pairing) |
| Code | 4 min | `long`, marks, one buffer |
| Trace | 3 min | n = 3, 4, 6, 7 |

If the construction does not come, write the splits you found for n = 3, 4, 7, 8 and look for pairs with equal sums.

## 9. Interviewer challenges

### About correctness

#### Why can't the greedy get stuck short of the target?

**What they are testing:** whether you can prove a greedy rather than trust it.

**How to reason:** find a quantity that bounds what is missing and survives both the take and the skip step.

**What I say:** "Before I consider x, what's missing is at most 1 + … + x. Taking x subtracts x from both sides. Skipping x only happens when the missing amount is below x, so it is at most x − 1, which is at most 1 + … + (x − 1). After x = 1 the bound is 0."

**Nuance:** the same proof works for any target between 0 and n(n+1)/2, so every such sum is reachable with distinct numbers from 1..n.

#### How do you know n ≡ 1 or 2 (mod 4) is really impossible, not just hard?

**What they are testing:** the difference between failing to find a split and proving none exists.

**How to reason:** an invariant of every split: the total is twice one set's sum.

**What I say:** "Any split has total = 2 × (one set's sum), so the total must be even. n(n+1)/2 is even only when 4 divides n or n + 1, because exactly one of them is even and must carry the whole factor 4. For n ≡ 1 or 2 the total is odd."

**Nuance:** for n = 6 the total is 21; any split would need two sums of 10.5.

### About implementation

#### What goes wrong with `int`?

**What they are testing:** overflow awareness from the constraints.

**How to reason:** compute the bound: n(n+1) first exceeds 2^31 − 1 at n = 46,341.

**What I say:** "With `int total = n * (n + 1) / 2`, the product wraps. The parity test happens to survive, because wrapping keeps the low bits, but the target is garbage. At n = 46,343, the first n past the boundary that should print YES, the target comes out negative, nothing is taken, and the program prints YES with an empty first set; at n = 10^6 the same happens. I ran both."

**Nuance:** `long total = n * (n + 1) / 2` fails the same way, because the multiplication is still done in `int` before the widening. Cast one operand first.

## 10. Follow-up questions the interviewer might ask

**"Count the number of ways to split 1..n into two equal-sum sets."**
That is [[cses-two-sets-ii|Two Sets II]]: a 0/1 subset-sum count DP over target n(n+1)/4, O(n · n^2) = O(n^3) time and O(n^2) space, modulo a prime. The construction here does not help with counting.

**"Split into two sets whose sums are as close as possible."**
If the total is odd, the best difference is 1: run the same greedy with target ⌊total/2⌋, which the invariant shows it always reaches. O(n).

**"The numbers are arbitrary, not 1..n."**
Then it is partition / subset-sum: a DP over sums, O(n · S) for total S, as in [[nc-partition-equal-subset-sum|Partition Equal Subset Sum]], or meet-in-the-middle for small n and large values as in [[cses-apple-division|Apple Division]]. The greedy no longer works, because its proof needed every value from 1 to x to be available. For {3, 3, 2, 2, 2, 2} (target 7) it takes 3 and 3, leaving 1 that no 2 can fill, although {3, 2, 2} / {3, 2, 2} is a split.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Stopping at "the total must be even".** That is only necessary; the construction is what shows it is sufficient.
- **Mixing up the residues.** The YES cases are n ≡ 0 and n ≡ 3 (mod 4), not 0 and 1. Check with n = 3 (YES) and n = 5 (NO).
- **Trusting the greedy without the invariant.** It works here because every value 1..x is still available; say why.

### Implementation mistakes

> [!MISTAKE] Computing the total in `int`
> `int total = n * (n + 1) / 2` (or `long total = n * (n + 1) / 2`) overflows from n = 46,341. At n = 46,343 and at n = 10^6 the program prints YES with an empty first set (verified). Write `(long) n * (n + 1) / 2`.

- **Printing the elements before knowing the set's size.** The size line comes first, so collect the set (or count it) before printing.
- **Printing number by number.** A million separate `print` calls is too slow in Java; build one `StringBuilder`.
- **Forgetting 3 in the n ≡ 3 pairing.** {1, 2} goes to one set and 3 to the other; starting the pairs at 3 instead of 4 leaves an odd-length block.

## 12. Pattern recognition

**The pattern:** existence by an invariant, then construction. A necessary condition (here, an even total) rules out the impossible inputs, and an explicit construction proves that every other input has an answer. Greedy "largest first while it fits" is the construction, and its proof is a bound on what is still missing.

**Signals in the problem statement:**

- "Print NO if impossible, otherwise print any …": decide existence, then build.
- The input is just n, and the objects are 1..n: look for a formula or pairing, not a search.
- Sums of 1..n with n up to 10^6: the totals pass 2^31, so think about `long` immediately.

**Related problems in this list:**

- [[cses-permutations|Permutations]]: another introductory construction, with its own short list of impossible n proved by exhaustion.
- [[cses-two-sets-ii|Two Sets II]]: the same split, counted instead of constructed, with DP.
- [[cses-apple-division|Apple Division]]: split arbitrary weights as evenly as possible; no construction exists, so it is a search.
- [[nc-partition-equal-subset-sum|Partition Equal Subset Sum]]: the general equal-sum split as subset-sum DP.

**Takeaway:** when the objects are 1..n, first find the condition that every answer must satisfy, then show that a simple rule (pairs, or largest first) meets it whenever it holds.

## 13. 60-second revision card

**Key insight:** a split exists exactly when n(n+1)/2 is even, which is when n mod 4 is 0 or 3. Then taking numbers from n downwards whenever they fit reaches half the total exactly.

**Invariant:** before x is considered, the missing amount is at most 1 + 2 + … + x.

**Complexity:** O(n) time, O(n) space for the marks and the output.

**Code skeleton:**

```java title="Two Sets, greedy"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws IOException {
        int n = Integer.parseInt(new BufferedReader(new InputStreamReader(System.in)).readLine().trim());
        long total = (long) n * (n + 1) / 2;
        if (total % 2 != 0) { System.out.println("NO"); return; }
        long remaining = total / 2;
        boolean[] inFirst = new boolean[n + 1];
        for (int x = n; x >= 1; x--) if (x <= remaining) { inFirst[x] = true; remaining -= x; }
        StringBuilder a = new StringBuilder(), b = new StringBuilder();
        int sizeA = 0;
        for (int x = 1; x <= n; x++) {
            if (inFirst[x]) { a.append(x).append(' '); sizeA++; } else b.append(x).append(' ');
        }
        System.out.print("YES\n" + sizeA + "\n" + a + "\n" + (n - sizeA) + "\n" + b + "\n");
    }
}
```

**Main traps:**

- `(long) n * (n + 1)`, cast before multiplying.
- YES for n ≡ 0 or 3 (mod 4); n = 3 is {1, 2} vs {3}.
- Size line before each set's elements; one buffered print.

**What to say in one breath:** "Equal halves need an even total, so n mod 4 must be 0 or 3. Then I take numbers from n down whenever they fit in what's missing; what's missing never exceeds the sum of the numbers left, so it ends at exactly zero. O(n), with a `long` for the total and one buffered print."
