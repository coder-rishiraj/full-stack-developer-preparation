---
problemId: cses-number-spiral
title: Number Spiral
source: cses
sourceUrl: https://cses.fi/problemset/task/1071
difficulty: easy
patterns: [introductory, mathematics]
relatedLessons: [a2-matrix, a1-java-syntax-competitive, a14-edge-cases]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

An infinite grid is filled with the numbers 1, 2, 3, … in a fixed snake-like spiral that starts in the upper-left corner. Rows are numbered from the top and columns from the left, both starting at 1. The first five rows and columns look like this:

| | x = 1 | x = 2 | x = 3 | x = 4 | x = 5 |
|---|---|---|---|---|---|
| **y = 1** | 1 | 2 | 9 | 10 | 25 |
| **y = 2** | 4 | 3 | 8 | 11 | 24 |
| **y = 3** | 5 | 6 | 7 | 12 | 23 |
| **y = 4** | 16 | 15 | 14 | 13 | 22 |
| **y = 5** | 17 | 18 | 19 | 20 | 21 |

You are given t queries. Each query is a row y and a column x, and you must print the number in that cell.

**Example**

- Input: `3`, then the queries `2 3`, `1 1`, `4 2`.
- Output: `8`, `1`, `15`, one per line.
- Why: row 2, column 3 holds 8; the corner holds 1; row 4, column 2 holds 15. All three can be read off the picture.

**What the problem statement guarantees**

- 1 ≤ t ≤ 10^5.
- 1 ≤ y, x ≤ 10^9.
- The first line is t; each of the next t lines holds y and then x (row first).
- Time limit: 1 second.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The coordinates go up to a billion, so the grid cannot be built; the exercise is to find the number from the coordinates alone, and to be sure your answer is right for every cell, not only the ones in the picture. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 15 minutes.
2. Copy the 5 × 5 picture onto paper and extend it by hand to 6 × 6. Watch the order in which the new cells are filled.
3. Write a complete program that reads standard input and writes standard output.
4. Before submitting, ask: how large can the answer be, and which of your variables must be 64-bit? How many lines will you read and print?

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> Group the cells into "shells": shell k is the set of cells whose larger coordinate is k. Shell 1 is the corner, shell 2 is the three cells around it, and so on. How many cells does each shell have, and which numbers does it hold?

> [!HINT] Hint 2: the kind of tool you need
> Shells 1 to k − 1 together form a (k − 1) × (k − 1) square, so they use exactly the numbers 1 to (k − 1)². Shell k holds the next 2k − 1 numbers, up to k². Inside a shell the numbers run along an L shape, and the direction of the L flips between odd and even k.

> [!HINT] Hint 3: almost the whole plan
> Let k = max(y, x). Find where shell k starts and in which direction it runs (look at shells 2, 3 and 4 in the picture). Then the answer is (k − 1)² plus the cell's position along that L, or equivalently k² minus its distance from the end. Do every multiplication in `long`, read with `BufferedReader`, and print once from a `StringBuilder`.

**Check yourself before revealing the walkthrough**

- [ ] My program prints 8, 1, 15 for the example
- [ ] It prints every value of the 5 × 5 picture correctly, not only the three in the example
- [ ] I can name the largest possible answer and say why my types hold it
- [ ] I can explain why my formula is right for every cell, including the corner of each shell

## 3. Interview script: understand the problem (≈2 min)

The statement is short, but the picture carries most of the information, so I spend my clarifying time on the coordinate convention and on the size of the numbers.

**Me:** Let me make sure I read the picture right. Row y counts down from the top, column x counts right from the left, and each query gives y first, then x. So "2 3" is row 2, column 3, which holds 8.

**Interviewer:** Yes, row first.

**Me:** The limits are t up to 10^5, and y and x each up to 10^9, one second in total?

**Interviewer:** That's right.

**Me:** Then I can't build the grid, and I can't even walk to the cell: the cell (10^9, 10^9) has close to 10^18 cells before it. I need the value straight from y and x. Output is one number per line?

**Interviewer:** One per line, in query order.

**Me:** Let me look at the picture for structure. The cells with max(y, x) = 2 are (1, 2), (2, 2), (2, 1), holding 2, 3, 4. The cells with max = 3 hold 5 to 9. So each "shell" with max(y, x) = k holds a block of consecutive numbers. That's the handle I'll use.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ y, x ≤ 10^9 | No grid, no walking: each query must be answered from a formula in O(1). Values reach k² with k up to 10^9, so the arithmetic must be 64-bit. |
| 1 ≤ t ≤ 10^5 | Up to 10^5 input lines and output lines: read with `BufferedReader` and print once from a `StringBuilder`. |
| Time limit 1 s | O(1) per query is far inside it; the risk is slow I/O, not the arithmetic. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Each query is "y x", row first | I parse the first number as the row. Swapping them gives the mirror cell, a wrong answer that still looks plausible. |
| One answer per line, in order | I append each answer and a newline to one builder. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The two numbers on a query line may be separated by any spaces | I split with `StringTokenizer`, which tolerates extra spaces. |

### Facts I computed once (the tests check them)

| Fact | Value | Consequence |
|---|---|---|
| Largest answer | exactly 10^18, at y = 10^9, x = 1 | `Long.MAX_VALUE` is 9,223,372,036,854,775,807 (about 9.2 × 10^18), so `long` holds every answer with roughly 9× headroom. `int` (about 2.1 × 10^9) does not come close. |
| Largest intermediate value | k · k = 10^18 for k = 10^9 | No product in the formulas exceeds the final answer's range, so `long` is enough for the intermediates too. |
| First shell where `int` k · k overflows | k = 46,341 (46,341² = 2,147,488,281 > 2^31 − 1) | Even mid-size queries break an `int` computation. |

### Edge cases I will keep in mind

- (1, 1): shell 1, the answer 1.
- Cells on the diagonal (k, k): the corner of the L, which belongs to both arms.
- The two ends of each shell, (1, k) and (k, 1): one holds (k − 1)² + 1, the other k².
- Both parities of k, near the limit: (10^9, 1) gives 10^18, (10^9 − 1, 1) is in an odd shell.

## 4. Think out loud: from first idea to best solution

The straightforward ideas, building the grid or walking along the spiral, cannot work at 10^9, so I mention them only to say why. Both numbered approaches are O(1) per query; they differ in how the formula is anchored. Approach 1 counts from the start of the shell and is the easier one to derive in an interview; Approach 2 anchors at the diagonal and folds the four cases into one line.

### Alternative: build the grid, or walk the spiral

Filling an n × n array by walking the spiral is a fine way to check a formula for small n (the tests do exactly that for n = 120). For this problem it is hopeless: the grid would need max(y, x)² cells, up to 10^18. Walking along the spiral without storing it still visits up to 10^18 cells per query. The only useful thing from this idea is the brute force for testing.

### Approach 1: Count the earlier shells, then the position inside the shell

#### What I say out loud

> "Let k be max(y, x). All cells with a smaller maximum form a (k − 1) by (k − 1) square in the corner, so they hold 1 to (k − 1)². Shell k holds the next 2k − 1 numbers, up to k². The only work is finding where the cell sits along shell k, and that depends on which way the shell runs."

#### Intuition

Read the picture by shells. Shell 2 is 2, 3, 4: it goes down column 2 and then left along row 2. Shell 3 is 5, 6, 7, 8, 9: it goes right along row 3 and then up column 3. Shell 4 is 10 to 16: down column 4, then left along row 4. So even shells start at the top of column k and run down then left; odd shells start at the left end of row k and run right then up. The cell's position along that path, added to (k − 1)², is the answer.

#### Algorithm

For each query (y, x):

1. k = max(y, x); before = (k − 1)².
2. If k is even (path: down column k, then left along row k):
   - if x = k, the cell is on the column part, at position y: answer before + y;
   - otherwise it is on row k, counted back from the end: answer k² − x + 1.
3. If k is odd (path: right along row k, then up column k):
   - if y = k, the cell is on the row part, at position x: answer before + x;
   - otherwise it is on column k, counted back from the end: answer k² − y + 1.
4. Append the answer and a newline; print everything once at the end.

#### Why it is correct

- **Earlier shells use exactly 1 to (k − 1)².** Every cell with max(y, x) < k lies in the (k − 1) × (k − 1) corner square, and every cell of that square has max(y, x) < k. The spiral fills shell after shell (each shell is completed before the next starts, as the picture shows for shells 1 to 5 and the walked grid in the tests confirms up to 120), so those (k − 1)² cells take the first (k − 1)² numbers.
- **Shell k holds (k − 1)² + 1 to k².** It has k² − (k − 1)² = 2k − 1 cells: k on the arm of length k, k − 1 on the other.
- **The positions are right.** For even k the path visits (1, k), (2, k), …, (k, k): the cell (y, k) is the y-th, so before + y. Then it continues (k, k − 1), …, (k, 1), ending at k²; the cell (k, x) is k − x steps before the end, so k² − (k − x) = k² − x + 1. The corner (k, k) is caught by the x = k test and gets before + k, and the other formula would give k² − k + 1, the same number, so the choice of arm for the corner does not matter. Odd k is the mirror image, with y and x exchanged.

#### Dry run

Input: 4 queries, `2 3`, `4 2`, `5 3`, `1 4`.

| Query (y, x) | k | Parity | before = (k − 1)² | Which arm | Formula | Answer |
|---|---|---|---|---|---|---|
| (2, 3) | 3 | odd | 4 | y ≠ k: column 3 | k² − y + 1 = 9 − 2 + 1 | 8 |
| (4, 2) | 4 | even | 9 | x ≠ k: row 4 | k² − x + 1 = 16 − 2 + 1 | 15 |
| (5, 3) | 5 | odd | 16 | y = k: row 5 | before + x = 16 + 3 | 19 |
| (1, 4) | 4 | even | 9 | x = k: column 4 | before + y = 9 + 1 | 10 |

All four match the picture. Output: `8`, `15`, `19`, `10`.

#### Java code

```java title="Approach 1: shell start plus position along the shell"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int t = Integer.parseInt(in.readLine().trim());
        StringBuilder out = new StringBuilder();
        for (int q = 0; q < t; q++) {
            StringTokenizer st = new StringTokenizer(in.readLine());
            long y = Long.parseLong(st.nextToken());
            long x = Long.parseLong(st.nextToken());
            long k = Math.max(y, x);              // the shell: cells with max(y, x) = k
            long before = (k - 1) * (k - 1);      // numbers used by shells 1..k-1
            long value;
            if (k % 2 == 0) {
                // even shell: down column k, then left along row k
                value = (x == k) ? before + y : k * k - x + 1;
            } else {
                // odd shell: right along row k, then up column k
                value = (y == k) ? before + x : k * k - y + 1;
            }
            out.append(value).append('\n');
        }
        System.out.print(out);
    }
}
```

#### Time complexity

**O(t)** in total: O(1) arithmetic per query, plus reading and writing O(t) numbers.

#### Space complexity

**O(t) auxiliary space** for the output builder (at most 10^5 numbers of up to 19 digits, about 2 MB). Apart from the output, O(1).

#### The bridge to the next approach

> "This works and I can defend every case. But it has four branches, and an interviewer will ask me to double-check each one. Look at the diagonal: (k, k) is always (k − 1)² + k = k² − k + 1, the middle of the shell. Moving away from the diagonal along either arm changes the value by exactly one per step, and which direction is up depends only on the parity. That should collapse the four cases into one expression."

### Approach 2: Anchor at the diagonal

#### What I say out loud

> "Every shell turns at its diagonal cell (k, k), whose value is k² − k + 1. On an even shell, values grow as I go from the top of column k down to the corner and then left along row k; on an odd shell they grow the other way. In both arms the distance from the corner is |y − x|, and the sign of y − x tells me which arm I'm on. So the answer is the diagonal value plus or minus (y − x), with the sign set by the parity."

#### Intuition

On shell k, exactly one of y, x equals k. If x = k (column arm), y − x = y − k ≤ 0 and the cell is k − y steps above the corner. If y = k (row arm), y − x = k − x ≥ 0 and the cell is k − x steps left of the corner. So y − x is a signed distance from the corner: negative on the column arm, positive on the row arm. On an even shell the column arm comes first (smaller numbers) and the row arm second, so the value is diagonal + (y − x). On an odd shell the order is reversed, so it is diagonal − (y − x).

#### Algorithm

For each query (y, x):

1. k = max(y, x); diagonal = k² − k + 1.
2. If k is even, answer diagonal + (y − x); otherwise answer diagonal − (y − x).
3. Append the answer; print once at the end.

#### Why it is correct

It is the same as Approach 1, rewritten. For even k: on the column arm (x = k), diagonal + (y − k) = k² − k + 1 + y − k = (k − 1)² + y, which is Approach 1's before + y. On the row arm (y = k), diagonal + (k − x) = k² − x + 1, Approach 1's other case. For odd k the same two lines with the sign flipped give (k − 1)² + x on the row arm and k² − y + 1 on the column arm. The corner has y − x = 0 and gets the diagonal value under either parity. Since Approach 1 is correct for every cell, so is this.

**The 25-second version:** "Shell k = max(y, x) holds (k − 1)² + 1 to k² and turns at (k, k), whose value is k² − k + 1. Moving one step away from the corner along either arm changes the value by one; y − x is the signed distance, and the parity of k says which arm is the low one. So the answer is k² − k + 1 ± (y − x). All in `long`: the largest answer is 10^18."

#### Dry run

Same input as Approach 1.

| Query (y, x) | k | diagonal = k² − k + 1 | y − x | Parity → sign | Answer |
|---|---|---|---|---|---|
| (2, 3) | 3 | 7 | −1 | odd → 7 − (−1) | 8 |
| (4, 2) | 4 | 13 | 2 | even → 13 + 2 | 15 |
| (5, 3) | 5 | 21 | 2 | odd → 21 − 2 | 19 |
| (1, 4) | 4 | 13 | −3 | even → 13 + (−3) | 10 |

The same four answers as Approach 1, and as the picture.

#### Java code

```java title="Approach 2: diagonal value plus or minus (y - x) (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int t = Integer.parseInt(in.readLine().trim());
        StringBuilder out = new StringBuilder();
        for (int q = 0; q < t; q++) {
            StringTokenizer st = new StringTokenizer(in.readLine());
            long y = Long.parseLong(st.nextToken());
            long x = Long.parseLong(st.nextToken());
            long k = Math.max(y, x);
            long diagonal = k * k - k + 1;        // the value at (k, k)
            long value = (k % 2 == 0) ? diagonal + (y - x) : diagonal - (y - x);
            out.append(value).append('\n');
        }
        System.out.print(out);
    }
}
```

#### Time complexity

**O(t)**: O(1) per query plus the I/O.

#### Space complexity

**O(t) auxiliary space** for the output builder; O(1) otherwise.

## 5. Comparison table

t = number of queries (at most 10^5).

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Alternative: build or walk the grid | O(max(y, x)²) per query | O(10^18) per query | O(max(y, x)²) to build it |
| 1. Shell start + position | O(t) | O(t) | O(t) output buffer |
| 2. Diagonal ± (y − x) | O(t) | O(t) | O(t) output buffer |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Build or walk the grid | Needs no insight; perfect brute force for tests | Impossible at 10^9 | Only to check a formula on small grids |
| 1. Shell start + position | Each case read straight off the picture; easy to derive under pressure | Four cases to get right | When you are deriving it live and want each step visible |
| 2. Diagonal ± (y − x) | One line, one branch on parity | The sign convention needs a careful argument | When you have derived Approach 1 and can show they agree |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** derive Approach 1 out loud, because each case comes from the picture, and then present Approach 2 as the simplification, showing on the corner and one cell of each arm that the two agree. If time is short, Approach 1 alone is a complete answer.

**Is it optimal?** Yes. Each query needs O(1) work, and reading the input is Ω(t), so O(t) overall cannot be beaten.

**When to stop:** once the formula is checked on the whole 5 × 5 picture and the type is `long`. There is nothing to precompute; the remaining risk is I/O, which the buffered reader and single write handle. On my machine (JDK 26), 10^5 large queries took about 0.08 s with this I/O and about 0.47 s with `Scanner` and one `System.out.println` per answer, both including JVM start-up. The second still passes here, but it is a fifth of the time budget spent on I/O.

## 7. Interview script: code it and test it

### What I say while coding

> "I read y and x as `long`. Even if I read them as `int`, the moment I write k * k with an `int` k the multiplication happens in 32 bits before it is widened, so I keep everything 64-bit from the start."

> "k is max(y, x). The diagonal value is k² − k + 1. Even shells: plus (y − x). Odd shells: minus."

> "One `StringBuilder`, one print at the end, because there can be 10^5 answers."

### Testing out loud

**Normal case, the example:** (2, 3): k = 3, diagonal 7, odd, 7 − (−1) = 8. (1, 1): k = 1, diagonal 1, odd, 1 − 0 = 1. (4, 2): k = 4, diagonal 13, even, 13 + 2 = 15. Output 8, 1, 15. Matches.

**A row cell and a column cell of the same shell:** (3, 2): k = 3, diagonal 7, odd, 7 − 1 = 6, and the picture shows 6. (2, 4): k = 4, diagonal 13, even, 13 + (−2) = 11, and the picture shows 11.

**Ends of a shell:** (1, 5): k = 5, diagonal 21, odd, 21 − (−4) = 25 = 5², the last cell. (5, 1): 21 − 4 = 17 = 4² + 1, the first. For an even shell the ends swap: (4, 1) gives 13 + 3 = 16 = 4².

**Largest values:** (10^9, 1): k = 10^9 (even), diagonal = 10^18 − 10^9 + 1, plus 10^9 − 1, giving exactly 10^18. (1, 10^9): the same diagonal minus 10^9 − 1, giving 999,999,998,000,000,002. (10^9, 10^9): the diagonal itself, 999,999,999,000,000,001. All below `Long.MAX_VALUE`.

**Largest input:** 10^5 queries with coordinates near 10^9. The tests run it against a BigInteger reference.

**What the tests cover:** every cell of a 120 × 120 grid filled by walking the spiral, the statement's picture, the extremes above for both parities, the int-overflow boundary k = 46,341, and random queries. The official CSES test data imported for this site has no tests for this problem (all of its tests are large), so the brute-force grid and an independent BigInteger formula stand in for them.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify and read the picture | 2–3 min | Row-first convention, limits, the shell observation |
| Derive the formula | 5 min | Shell sizes, direction by parity, Approach 1's four cases |
| Simplify and code | 4 min | Approach 2, `long` everywhere, buffered I/O |
| Test | 3 min | The example, one cell of each arm, the shell ends, the 10^18 maximum |

The time should go into the derivation and into checking it on the picture, because a sign or parity slip produces numbers that look plausible. If you are stuck on the direction of a shell, write out shells 2, 3 and 4 explicitly; the pattern shows within three shells.

## 9. Interviewer challenges

### About the formula

#### How do you know the parity pattern continues forever? You only looked at five shells.

**What they are testing:** whether you can justify a pattern instead of extrapolating it.

**How to reason:** the path is continuous. Each shell ends at a border cell, and the next shell must start next to it.

**What I say:** "An odd shell ends at (1, k), the top of column k. The next number must go to the neighbour (1, k + 1), which is the top of column k + 1, so shell k + 1 starts there and runs down: that is the even pattern. An even shell ends at (k, 1), so the next shell starts at (k + 1, 1) and runs right along row k + 1: the odd pattern. Shell 1 is odd, so by induction odd and even alternate exactly as I described."

**Nuance:** this argument relies on the spiral filling one shell completely before the next, which the statement's picture shows; the tests also check it on a 120 × 120 grid.

#### Why `long`? And is `long` enough?

**What they are testing:** overflow reasoning from the constraints, including intermediates.

**How to reason:** the largest answer is k² for k = 10^9, and the largest intermediate is the same k · k.

**What I say:** "The biggest answer is exactly 10^18, at (10^9, 1). `Long.MAX_VALUE` is about 9.2 × 10^18, so it fits with room to spare, and no intermediate is larger: k · k is 10^18 and every other term is smaller. An `int` overflows as soon as k reaches 46,341."

**Nuance:** if the limit were 4 × 10^9, k² would be 1.6 × 10^19 and overflow a `long`; then `Math.multiplyHigh`, unsigned arithmetic or `BigInteger` would be needed.

### About performance

#### Your arithmetic is O(1). Why bother with `BufferedReader`?

**What they are testing:** awareness that I/O dominates when the computation is trivial.

**How to reason:** 2 × 10^5 numbers in, 10^5 out, against a handful of multiplications per query.

**What I say:** "With 10^5 queries, the arithmetic is microseconds. `Scanner` parses with regular expressions and each `System.out.println` goes through a synchronized stream, so they dominate. I measured about 0.47 s with them against 0.08 s buffered on 10^5 large queries, including JVM start-up. Both pass, but the buffered version leaves the budget for the actual work in harder problems."

**Nuance:** for 10^6 or more tokens even `StringTokenizer` can become the bottleneck, and a hand-written byte reader on `DataInputStream` is the next step.

## 10. Follow-up questions the interviewer might ask

**"Now give the inverse: for a number v, which cell holds it?"**
k = ⌈√v⌉ (compute with `Math.sqrt` and correct by ±1 with integer checks, since a double square root can be off for v near 10^18). Then d = v − (k² − k + 1) is the signed distance from the corner, and the parity tells you the arm: for even k, d ≤ 0 means (k + d, k) and d > 0 means (k, k − d); odd k mirrors it. O(1) per query.

**"What if the spiral started going right from 1 instead of down?"**
That is the transpose: the value at (y, x) in the new spiral is the value at (x, y) in this one. Swap the coordinates and reuse the same formula.

**"What if y and x could be up to 10^10?"**
Then k² reaches 10^20, beyond a `long`. Use `BigInteger` for the products, or `Math.multiplyHigh` to get the high 64 bits and print a 128-bit result. Still O(1) per query.

**"Sum of all numbers in the top-left n × n square?"**
That square is exactly shells 1 to n, which hold 1 to n², so the sum is n²(n² + 1)/2. For n up to 10^9 that is about 5 × 10^35, so it needs `BigInteger` or a modulus.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Mixing up the parity.** Even shells run down then left; odd shells right then up. With the parities swapped, the example's (2, 3) gives 6 and (4, 2) gives 11, instead of 8 and 15 (run once).
- **Extrapolating from the example only.** The three example cells do not exercise both arms of both parities; check against the whole 5 × 5 picture.
- **Trying to simulate.** At 10^9 a walk is up to 10^18 steps per query.

### Implementation mistakes

> [!MISTAKE] Multiplying two `int`s and storing into a `long`
> `int k = Math.max(y, x); long value = k * k - x + 1;` looks safe because the result is a `long`, but `k * k` is computed in 32-bit arithmetic first and only then widened. For the query (10^9, 1) this prints −1,486,618,624 instead of 1,000,000,000,000,000,000 (run once). The fix is to make k a `long` (or write `(long) k * k`). It already fails at k = 46,341.

- **Reading x before y.** The input is row first. Reading "2 3" as column 2, row 3 gives 6 instead of 8 for the example's first query (run once).
- **Printing with `System.out.println` per query, or reading with `Scanner`.** Correct, but about six times slower on 10^5 queries in my measurement.
- **Off by one at the end of the shell.** The last cell of shell k is k², so counting back from it is k² − x + 1, not k² − x.

## 12. Pattern recognition

**The pattern:** closed-form position counting. When a structure is filled in a regular order and the coordinates are too large to simulate, count the cells that come before the target (here, whole shells form a square of (k − 1)² cells) and add the position inside the current block.

**Signals in the problem statement:**

- A picture of a filling order and a query for an arbitrary cell.
- Coordinates up to 10^9 with many queries, so O(1) per query is required.
- Values that grow like the square of the input: a sign to check 64-bit limits.

**Related problems in this list:**

- [[nc-spiral-matrix|Spiral Matrix]]: the simulation counterpart. There the matrix is small and you walk it; here the grid is huge and you count.
- [[cses-digit-queries|Digit Queries]]: the same "count what comes before, then index inside the block" idea, on the string 123456789101112…, with blocks of numbers that have the same number of digits.
- [[cses-two-knights|Two Knights]]: another closed-form count over k × k boards for every k up to n, with the same overflow care.
- [[cses-coin-piles|Coin Piles]]: a constant-time answer from a short algebraic argument, many test cases, fast I/O.

**Takeaway:** when the input is too large to simulate, find a block structure whose sizes you can sum in closed form, then locate the answer inside one block.

## 13. 60-second revision card

**Key insight:** shell k = max(y, x) holds (k − 1)² + 1 to k² and turns at (k, k) = k² − k + 1. Even shells run down column k then left; odd shells run right along row k then up.

**Invariant:** y − x is the signed distance from the corner: negative on the column arm, positive on the row arm.

**Complexity:** O(1) per query, O(t) total; O(t) output buffer.

**Code skeleton:**

```java title="Number Spiral in a few lines"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int t = Integer.parseInt(in.readLine().trim());
        StringBuilder out = new StringBuilder();
        while (t-- > 0) {
            StringTokenizer st = new StringTokenizer(in.readLine());
            long y = Long.parseLong(st.nextToken()), x = Long.parseLong(st.nextToken());
            long k = Math.max(y, x), d = k * k - k + 1;
            out.append(k % 2 == 0 ? d + (y - x) : d - (y - x)).append('\n');
        }
        System.out.print(out);
    }
}
```

**Main traps:**

- `int` products overflow at k = 46,341; the largest answer is exactly 10^18 (fits a `long`).
- Row first: the input is "y x".
- Parity decides the sign; check the whole 5 × 5 picture, not just the example.

**What to say in one breath:** "Cells with max(y, x) = k form a shell holding (k − 1)² + 1 to k², turning at the diagonal value k² − k + 1. The answer is that value plus (y − x) on even shells and minus it on odd ones. O(1) per query in `long`, because answers reach 10^18, with buffered I/O for 10^5 queries."
