---
problemId: cses-two-knights
title: Two Knights
source: cses
sourceUrl: https://cses.fi/problemset/task/1072
difficulty: easy
patterns: [introductory, mathematics, combinatorics, complementary-counting]
relatedLessons: [a1-java-syntax-competitive, a9-combinations, a14-brute-force-first, a14-deriving-optimization]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

You get one integer n. For every board size k = 1, 2, …, n, count the ways to place two knights on a k × k chessboard so that they do not attack each other. The two knights are identical, so a placement is a pair of distinct squares, and swapping the knights does not give a new placement. Print the n counts, one per line. This is a whole program reading standard input and writing standard output.

**Example**

- Input: `8`
- Output, eight lines: `0`, `6`, `28`, `96`, `252`, `550`, `1056`, `1848`
- Why: a 1 × 1 board has no room for two knights. A 2 × 2 board has 6 pairs of squares, and no knight move fits inside it, so all 6 are safe. A 3 × 3 board has 36 pairs, and 8 of them attack each other, leaving 28.

**What the problem statement guarantees**

- 1 ≤ n ≤ 10000.
- Time limit: 1 second.

## 2. Practice first: try it before reading on

If you have not solved this yourself yet, stop here. Simulating every placement is far too slow for k = 10^4; the job is to count with a formula. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 20 minutes.
2. Draw a 3 × 3 board and list every attacking pair. Do the same for 4 × 4 if you have time.
3. Find a formula for the count on a k × k board, and argue why it is right for every k, including 1 and 2.
4. Work out the largest number your program prints, and choose the type that holds it.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> Counting the safe pairs directly is awkward. Is there something easier to count that tells you the answer?

> [!HINT] Hint 2: the kind of tool you need
> Count all pairs of squares, then subtract the pairs that attack. Two knights that attack each other sit at opposite corners of a small rectangle. How big is it, and how many attacking pairs does each one hold?

> [!HINT] Hint 3: almost the whole plan
> All pairs: k²(k² − 1)/2. An attacking pair always spans a 2 × 3 or a 3 × 2 rectangle, each such rectangle holds exactly two attacking pairs, and a k × k board has (k − 1)(k − 2) rectangles of each orientation. Subtract, use 64-bit integers, and build all n lines in one buffer.

**Check yourself before revealing the walkthrough**

- [ ] My formula gives 0, 6, 28, 96 for k = 1 to 4
- [ ] I can explain why each attacking pair is counted exactly once
- [ ] I know the largest value printed (k = 10^4) and the first k where `int` breaks
- [ ] I print 10^4 lines with one buffered write

## 3. Interview script: understand the problem (≈2 min)

Treat it as if an interviewer had posed it. The questions are about what counts as a placement and how big the numbers get.

**Me:** Knights are identical, so a placement is an unordered pair of different squares?

**Interviewer:** Yes. Both on the same square is not allowed, and swapping them is the same placement.

**Me:** And "attack" is the usual knight move: two squares in one direction and one in the other. A knight's attack is symmetric, so "they do not attack each other" just means the pair is not a knight move apart.

**Interviewer:** Right.

**Me:** Output is n lines, the k-th line for the k × k board, starting from k = 1?

**Interviewer:** Exactly.

**Me:** n up to 10^4, so k² is up to 10^8 squares and the pair count is about k⁴/2 = 5 · 10^15. That needs a `long`, and I need O(1) work per k, or close to it. Let me do k = 3 by hand. 9 squares, 9 · 8 / 2 = 36 pairs. The centre has no knight moves on 3 × 3. Each corner attacks two edge squares, so 4 corners × 2 = 8 attacking pairs, and every attacking pair has exactly one corner in it. 36 − 8 = 28, matching the example.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^4 | Enumerating pairs is O(k⁴) per board; even counting square by square is about n³/3 ≈ 3.3 · 10^11 steps in total. I need O(1) per k. |
| Values up to about 5 · 10^15 at k = 10^4 | `long` everywhere (its limit is about 9.2 · 10^18). k²(k² − 1) passes 2^31 − 1 already at k = 216. |
| Time limit 1 s, n lines of output | One `StringBuilder`, printed once. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Unordered pairs of distinct squares | All pairs is C(k², 2) = k²(k² − 1)/2, not k⁴. |
| One line per k, from 1 to n | I loop k upwards and append each answer. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| None beyond the clarifications | The statement fixes the input and output; the answer per k is a pure function of k. |

### Edge cases I will keep in mind

- k = 1: one square, no pairs, answer 0.
- k = 2: 6 pairs, no knight move fits (it needs 3 squares in one direction), answer 6.
- k = 3: the first board with attacking pairs.
- k = 216: the first k where an `int` computation of k²(k² − 1) overflows.
- k = 10^4: the largest value, 4,999,999,550,119,992.

## 4. Think out loud: from first idea to best solution

**Complementary counting.** Every pair of squares is either attacking or safe, so safe = all pairs − attacking pairs. All pairs is C(k², 2) = k²(k² − 1)/2. Everything below is about counting attacking pairs without enumerating them.

**The first idea, and why it is not a numbered approach.** For each square, count the knight moves that stay on the board; the sum over squares counts every attacking pair twice (once from each end). That is O(k²) per board and O(n³) over all boards, about 3.3 · 10^11 steps at n = 10^4: far over a second. Enumerating all pairs is worse, O(k⁴). Both are excellent checks for small boards, and the test file uses them (pairs up to k = 24, squares up to k = 300) to confirm the formulas below.

### Approach 1: Count each knight displacement

#### What I say out loud

> "Instead of asking 'how many moves does this square have', I ask 'how many squares can make this particular move'. A move of (+1, +2) fits from any start in the first k − 1 rows and the first k − 2 columns: (k − 1)(k − 2) starts. There are 8 displacements, and each attacking pair is counted once from each knight, so I halve the sum."

#### Intuition

Swap the order of the double sum. Summing over squares and then over the 8 moves is the same as summing over the 8 moves and then over squares. For a fixed displacement (dr, dc), the start squares that keep the move on the board form a (k − |dr|) × (k − |dc|) rectangle, so its count is a product, not a loop.

#### Algorithm

1. Read n. For each k from 1 to n:
2. `allPairs = k²(k² − 1)/2` in `long`.
3. `ordered = Σ over the 8 displacements of (k − |dr|)(k − |dc|)`, skipping a displacement when a factor is ≤ 0.
4. Append `allPairs − ordered / 2`.
5. Print the buffer.

#### Why it is correct

- **Every attacking ordered pair counted once.** An ordered pair (knight A, knight B) that attacks has exactly one displacement B − A among the 8. For that displacement, A is one of the counted start squares, because B is on the board.
- **Nothing extra counted.** A start square counted for displacement (dr, dc) has its target on the board, so it is an attacking ordered pair.
- **Halving.** Each unordered attacking pair {A, B} appears as (A, B) with some displacement and as (B, A) with the opposite one, so the ordered count is exactly twice the unordered count.
- **Small boards.** When k ≤ |dr| or k ≤ |dc| the rectangle is empty and the code skips it, so k = 1 and k = 2 give 0 attacking pairs.

#### Dry run

| k | allPairs = k²(k² − 1)/2 | Starts per displacement | Ordered attacks (8 displacements) | Attacking = ordered / 2 | Output |
|---|---|---|---|---|---|
| 1 | 0 | 0 (every rectangle empty) | 0 | 0 | 0 |
| 2 | 6 | 1 × 0 = 0 | 0 | 0 | 6 |
| 3 | 36 | 2 × 1 = 2 | 16 | 8 | 28 |
| 4 | 120 | 3 × 2 = 6 | 48 | 24 | 96 |

#### Java code

```java title="Approach 1: count each knight displacement"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    // the 8 knight displacements (dr, dc)
    static final int[][] MOVES = {{1, 2}, {2, 1}, {-1, 2}, {-2, 1}, {1, -2}, {2, -1}, {-1, -2}, {-2, -1}};

    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        StringBuilder out = new StringBuilder();
        for (long k = 1; k <= n; k++) {
            long cells = k * k;
            long allPairs = cells * (cells - 1) / 2;      // up to about 5 * 10^15: long
            long orderedAttacks = 0;
            for (int[] m : MOVES) {
                long rows = k - Math.abs(m[0]);           // start rows where the move stays on the board
                long cols = k - Math.abs(m[1]);
                if (rows > 0 && cols > 0) orderedAttacks += rows * cols;
            }
            out.append(allPairs - orderedAttacks / 2).append('\n'); // each pair counted from both ends
        }
        System.out.print(out);
    }
}
```

#### Time complexity

**O(n):** 8 constant-time terms per board, n boards, plus O(n) output characters (each line has at most 16 digits).

#### Space complexity

**O(n)** for the output buffer, which is the output itself; O(1) besides.

#### The bridge to the next approach

> "This is fast and it generalises to any piece that jumps by a fixed vector. But the eight terms are really two different shapes, four times each: (k − 1)(k − 2) and (k − 2)(k − 1). That suggests a closed form. Let me find a picture that gives it directly, so I can say the formula in one line and check it by hand."

### Approach 2: Closed form from 2 × 3 rectangles (recommended)

#### What I say out loud

> "Two knights that attack are one row and two columns apart, or two rows and one column apart. So the smallest rectangle containing both is 2 × 3 or 3 × 2, and they sit at opposite corners of it. Each such rectangle has exactly two pairs of opposite corners, so it holds exactly two attacking pairs. A k × k board has (k − 1)(k − 2) rectangles of 2 rows by 3 columns and as many of 3 rows by 2 columns. So there are 4(k − 1)(k − 2) attacking pairs, and the answer is k²(k² − 1)/2 − 4(k − 1)(k − 2)."

#### Intuition

Assign every attacking pair to the one rectangle it determines: its bounding box. Counting rectangles is easy (choose the top-left corner), and every rectangle of the right shape contains the same number of attacking pairs. Counting pairs becomes counting boxes, times 2.

#### Algorithm

1. Read n. For each k from 1 to n, append `k²(k² − 1)/2 − 4(k − 1)(k − 2)`, computed in `long`.
2. Print the buffer.

#### Why it is correct

- **Each attacking pair lies in exactly one box.** If the knights are at (r, c) and (r + 1, c ± 2), their bounding box spans rows r..r + 1 and the two columns 2 apart, so it is 2 × 3, and it is unique because a bounding box is determined by the two squares. The (±2, ±1) case gives a 3 × 2 box. A pair is never in both lists, because its row difference is either 1 or 2.
- **Each box holds exactly two attacking pairs.** In a 2 × 3 box with corners top-left, top-right, bottom-left, bottom-right, the pairs {top-left, bottom-right} and {top-right, bottom-left} are knight moves (1 row, 2 columns). No other pair of squares inside the box differs by (1, 2): any other pair has a column difference of 0 or 1, or the same row. The same holds for 3 × 2 boxes.
- **Counting boxes.** A 2-row, 3-column box is fixed by its top-left square, which can be in rows 1..k − 1 and columns 1..k − 2: (k − 1)(k − 2) boxes. The 3 × 2 boxes give the same count. So attacking pairs = 2 · 2 · (k − 1)(k − 2) = 4(k − 1)(k − 2).
- **Small boards need no special case.** For k = 1 and k = 2 the factor (k − 1) or (k − 2) is 0, so the subtraction is 0, which is right: no box fits.

It agrees with Approach 1, whose eight terms are four copies of (k − 1)(k − 2) and four of (k − 2)(k − 1): 8(k − 1)(k − 2) ordered pairs, halved.

**The 20-second version:** "Safe pairs are all pairs minus attacking pairs. All pairs is k²(k² − 1)/2. An attacking pair sits on opposite corners of a 2 × 3 or 3 × 2 box, each box has exactly two such corner pairs, and there are (k − 1)(k − 2) boxes of each orientation, so 4(k − 1)(k − 2) attacking pairs. Everything in `long`, since the values reach 5 · 10^15."

#### Dry run

| k | k² | k²(k² − 1)/2 | Boxes per orientation (k − 1)(k − 2) | Attacking 4(k − 1)(k − 2) | Output |
|---|---|---|---|---|---|
| 1 | 1 | 0 | 0 | 0 | 0 |
| 2 | 4 | 6 | 0 | 0 | 6 |
| 3 | 9 | 36 | 2 | 8 | 28 |
| 4 | 16 | 120 | 6 | 24 | 96 |
| 8 | 64 | 2016 | 42 | 168 | 1848 |
| 10^4 | 10^8 | 4,999,999,950,000,000 | 99,970,002 | 399,880,008 | 4,999,999,550,119,992 |

On 3 × 3 the two 2 × 3 boxes (rows 1–2 and rows 2–3) give 4 pairs, and the two 3 × 2 boxes give 4 more: the 8 pairs found by hand in section 3.

#### Java code

```java title="Approach 2: closed form from 2 x 3 rectangles (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        StringBuilder out = new StringBuilder();
        for (long k = 1; k <= n; k++) {
            long cells = k * k;
            long allPairs = cells * (cells - 1) / 2;      // C(k^2, 2), about 5 * 10^15 at k = 10^4
            long attacking = 4 * (k - 1) * (k - 2);       // 2 attacking pairs per 2x3 or 3x2 box
            out.append(allPairs - attacking).append('\n');
        }
        System.out.print(out);
    }
}
```

#### Time complexity

**O(n):** a constant number of multiplications per board. Measured on my machine (JDK 26), n = 10^4 runs in well under 0.1 s including JVM start, and so does Approach 1.

#### Space complexity

**O(n)** for the output buffer; O(1) besides.

Both programs print the expected output for the official CSES tests stored for this problem (`public/tests/cses/cses-two-knights.json`: n = 1 and n = 2), run on a real JVM, and the test file checks every k up to 10^4 against an exact `BigInteger` evaluation of the formula, after checking that formula against brute-force counts for k ≤ 300.

## 5. Comparison table

n is the input; the k-th board has k² squares. Nothing is randomized, so expected and worst case agree.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| All pairs, tested one by one (prose only) | O(n⁵) | O(n⁵) | O(1) beyond output |
| Moves per square (prose only) | O(n³) | O(n³) | O(1) beyond output |
| 1. Count each displacement | O(n) | O(n) | O(1) beyond the O(n) output |
| 2. Closed form | O(n) | O(n) | O(1) beyond the O(n) output |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Brute force (either) | Follows the statement word for word | About 3.3 · 10^11 steps at n = 10^4 even for the faster one | Checking the formula on small boards |
| 1. Displacements | Works for any leaping piece; no picture needed | Eight terms and a halving step to explain | When the piece or the moves may change |
| 2. Closed form | One line; checkable by hand | Needs the box argument, which must be stated carefully | The answer to give |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2, introduced through complementary counting. The output alone is n numbers, so O(n) is optimal. Mention Approach 1 as the version that generalises to other pieces. Stop once the box argument is clear; what remains is `long` arithmetic and buffered output.

## 7. Interview script: code it and test it

### What I say while coding

> "I make the loop variable `k` a `long`, so `k * k` and `cells * (cells - 1)` are computed in 64 bits. With `int`, `k * k * (k * k - 1)` overflows from k = 216."

> "All n lines go into one `StringBuilder`, printed once."

### Testing out loud

**k = 1:** cells 1, all pairs 0, attacking 4 · 0 · (−1) = 0. Output 0.

**k = 2:** all pairs 6, attacking 4 · 1 · 0 = 0. Output 6.

**k = 3:** 36 − 4 · 2 · 1 = 28. **k = 8:** 64 · 63 / 2 = 2016, minus 4 · 7 · 6 = 168, gives 1848, the example's last line.

**k = 10^4:** 10^8 · (10^8 − 1)/2 = 4,999,999,950,000,000, minus 399,880,008, gives 4,999,999,550,119,992, well under the `long` limit of about 9.2 · 10^18.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2 min | Unordered pairs, one line per k, sizes |
| Small boards | 3 min | k = 3 by hand: 36 − 8 |
| Derive | 5 min | Complement, then the 2 × 3 box argument |
| Code | 3 min | `long`, one buffer |
| Trace | 2 min | k = 1, 2, 3, 8 |

If the box picture does not come, count the moves of each displacement (Approach 1); it reaches the same formula with no insight beyond "swap the order of the sums".

## 9. Interviewer challenges

### About correctness

#### How do you know no attacking pair is counted twice?

**What they are testing:** whether a counting argument has a bijection behind it.

**How to reason:** name the unique object each pair is assigned to.

**What I say:** "Each attacking pair is assigned to its bounding box, which is unique, and has shape 2 × 3 if the knights are one row apart, 3 × 2 if two rows apart. Each box contains exactly two attacking pairs. So pairs = 2 × boxes, with no overlaps."

**Nuance:** a bigger box such as 3 × 3 also *contains* attacking pairs, which is exactly why I count bounding boxes and not "boxes that contain the pair".

#### Why is the formula right for k = 1 and k = 2?

**What they are testing:** whether you trust a formula outside the range you derived it on.

**How to reason:** check what the box count means when no box fits.

**What I say:** "(k − 1)(k − 2) is 0 for k = 1 and k = 2, which is the correct number of boxes, and C(1, 2) = 0, C(4, 2) = 6. So the output is 0 and 6 without a special case."

**Nuance:** for k = 0 the formula would give 4 · (−1)(−2) = 8 attacking pairs, nonsense, but k ≥ 1 here. A formula is only proved for the range its argument covers.

### About implementation

#### What goes wrong with `int`?

**What they are testing:** overflow awareness from the constraints.

**How to reason:** find the largest intermediate value: k²(k² − 1) ≈ 10^16.

**What I say:** "k²(k² − 1) first passes 2^31 − 1 at k = 216 (216² · (216² − 1) ≈ 2.18 · 10^9). An all-`int` version prints −1,059,299,848 there instead of 1,088,183,800, and at k = 10^4 it prints 487,579,704. I ran that. Writing `long allPairs = cells * (cells - 1) / 2` with `int cells` fails at the same k, because the product is computed in `int` before it is widened."

**Nuance:** the largest true value, about 5 · 10^15, fits a `long` with three orders of magnitude to spare; `k²·k²` itself (10^16) does too.

## 10. Follow-up questions the interviewer might ask

**"Two kings instead of knights."**
Kings attack when they are neighbours, including diagonally. Unordered attacking pairs: k(k − 1) horizontal, k(k − 1) vertical, and 2(k − 1)² diagonal (each 2 × 2 box holds two diagonals). Answer k²(k² − 1)/2 − 2k(k − 1) − 2(k − 1)²: 0 for k = 2, where every pair touches, and 16 for k = 3. O(1) per k.

**"Two rooks, or two queens."**
Rooks attack along rows and columns: 2 · k · C(k, 2) attacking pairs. Queens add diagonals: a diagonal of length L contributes C(L, 2), summed over all diagonals in both directions, which has a closed form or an O(k) loop per board. The complementary-counting frame stays the same.

**"Count three knights, none attacking another."**
Inclusion–exclusion over the three pairs, or a DP over rows; it is no longer one subtraction, because a triple can contain one, two or three attacking pairs. Much harder; I would brute-force small boards first to check any formula.

**"A different board, m × k."**
The same boxes: (m − 1)(k − 2) boxes of 2 rows by 3 columns and (m − 2)(k − 1) of 3 rows by 2 columns, two attacking pairs each. Answer C(mk, 2) − 2[(m − 1)(k − 2) + (m − 2)(k − 1)], valid when both sides are at least 2. A 1-row board needs care: no box fits, but the formula's subtracted term would be −2(k − 1), not 0, because a negative factor is no longer a count. Clamp each factor at 0, as Approach 1 does.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Counting ordered pairs.** k²(k² − 1) without the /2 counts each placement twice; k = 2 would print 12.
- **One rectangle orientation only.** Counting only 2 × 3 boxes gives 2(k − 1)(k − 2) attacking pairs; k = 3 would print 32 instead of 28.
- **One attacking pair per box.** Each box has two opposite-corner pairs; forgetting one gives 2(k − 1)(k − 2) as well.
- **Counting moves per square and forgetting to halve.** Summing the 8 moves over all squares counts every attacking pair from both knights.

### Implementation mistakes

> [!MISTAKE] Computing in `int`
> `int` arithmetic for k²(k² − 1) overflows from k = 216: the program prints −1,059,299,848 instead of 1,088,183,800 there, and 487,579,704 at k = 10^4 (verified). Make `k` a `long`, so every product is 64-bit.

- **Widening too late.** `long allPairs = cells * (cells - 1) / 2` with `int cells` is still an `int` multiplication.
- **Printing line by line.** 10^4 `println` calls are acceptable here but a bad habit; one `StringBuilder` is free.

## 12. Pattern recognition

**The pattern:** complementary counting, then counting the bad configurations through a canonical object. Total pairs is easy; bad pairs are counted by assigning each one to a unique, easily counted shape (a bounding box) and multiplying by how many bad pairs each shape holds.

**Signals in the problem statement:**

- "Count the ways … so that they do not …": count all and subtract the ones that do.
- A board or grid with a local rule: the bad pairs fit in a small fixed shape that can be slid around.
- Answers for every size up to 10^4: a closed form per size, and 64-bit arithmetic.

**Related problems in this list:**

- [[cses-coin-piles|Coin Piles]]: another closed form, derived by turning the process into counts and equations.
- [[cses-bit-strings|Bit Strings]]: counting with a direct formula (2^n), where the work is the modular arithmetic.
- [[cses-number-spiral|Number Spiral]]: a grid pattern answered by a formula per cell, with `long` values.
- [[cses-chessboard-and-queens|Chessboard and Queens]]: the same board, but now the attacks must be avoided by a search, because the board has blocked squares and 8 pieces.

**Takeaway:** when the good configurations are hard to count, count all of them and subtract the bad ones, and count the bad ones by the small shape they always form.

## 13. 60-second revision card

**Key insight:** safe = C(k², 2) − attacking, and attacking = 4(k − 1)(k − 2), because each attacking pair is opposite corners of a unique 2 × 3 or 3 × 2 box, each box has two such pairs, and there are (k − 1)(k − 2) boxes of each orientation.

**Invariant:** each attacking pair is counted once, through its bounding box.

**Complexity:** O(1) per k, O(n) total; O(n) output buffer.

**Code skeleton:**

```java title="Two Knights"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws IOException {
        int n = Integer.parseInt(new BufferedReader(new InputStreamReader(System.in)).readLine().trim());
        StringBuilder out = new StringBuilder();
        for (long k = 1; k <= n; k++) {
            out.append(k * k * (k * k - 1) / 2 - 4 * (k - 1) * (k - 2)).append('\n');
        }
        System.out.print(out);
    }
}
```

**Main traps:**

- `long` from the start: k²(k² − 1) overflows `int` at k = 216.
- Unordered pairs: divide by 2.
- Both box orientations, two pairs per box.

**What to say in one breath:** "All pairs minus attacking pairs. All pairs is k²(k² − 1)/2. Attacking knights are opposite corners of a 2 × 3 or 3 × 2 box, two pairs per box, (k − 1)(k − 2) boxes each way, so 4(k − 1)(k − 2). O(1) per board, in `long`, printed in one buffer."
