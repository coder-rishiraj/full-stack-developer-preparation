---
problemId: cses-forest-queries
title: Forest Queries
source: cses
sourceUrl: https://cses.fi/problemset/task/1652
difficulty: easy
patterns: [range-queries, prefix-sum, matrix]
relatedLessons: [a2-prefix-suffix, a2-matrix, a1-java-syntax-competitive, a12-fenwick, a14-brute-force-first, a14-deriving-optimization]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

A forest is drawn as an n × n grid. Each square is `.` (empty) or `*` (a tree). Rows are numbered 1..n from the top, columns 1..n from the left. You then get q questions, each giving two corners of a rectangle as `y1 x1 y2 x2`: rows y1..y2 and columns x1..x2, all four borders included. For each question, print how many trees are inside. The forest never changes. This is a whole program: it reads standard input and writes standard output.

**Example** (the one in the CSES statement)

Input:

```text
4 3
.*..
*.**
**..
****
2 2 3 4
3 1 3 1
1 1 2 2
```

Output:

```text
3
1
2
```

- `2 2 3 4` is rows 2–3, columns 2–4: `.**` in row 2 and `*..` in row 3, so 2 + 1 = 3 trees.
- `3 1 3 1` is the single square in row 3, column 1, which is a tree: 1.
- `1 1 2 2` is the top-left 2 × 2 block, `.*` over `*.`: 2 trees.

Note the order: the first number of each pair is the **row** (y), the second the **column** (x).

**What the problem statement guarantees**

- 1 ≤ n ≤ 1000.
- 1 ≤ q ≤ 2 · 10^5.
- 1 ≤ y1 ≤ y2 ≤ n and 1 ≤ x1 ≤ x2 ≤ n, so every rectangle is non-empty and inside the grid.
- Each of the n grid lines has exactly n characters, each `.` or `*`.
- Time limit 1 second, memory limit 512 MB.

## 2. Practice first: try it before reading on

If you have not solved this yet, stop here. Everything below this section stays hidden until you ask for it. Interviewers like this problem because the fast answer is a short formula that is easy to get subtly wrong; they will ask you to justify every term.

**How to practise**

1. Set a timer for 20 minutes.
2. Write the direct solution and count its worst-case work at n = 1000, q = 2 · 10^5.
3. Find something faster that answers each question by looking at one row at a time, and count its work.
4. Then find a way to answer each question with a constant number of lookups.
5. Draw your formula on paper with the four regions labelled, and check that every square of the rectangle is counted exactly once and every other square zero times.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> Suppose every question asked about a rectangle whose top-left corner is the top-left square of the grid. Could you precompute all n² possible answers? Now, can a general rectangle be written as a combination of a few rectangles of that kind?

> [!HINT] Hint 2: the kind of tool you need
> Precompute, for every square (y, x), the number of trees in the rectangle from (1, 1) to (y, x). A general rectangle is that count at its bottom-right corner, minus two strips, plus a correction for what you subtracted twice.

> [!HINT] Hint 3: almost the whole plan
> Use an (n + 1) × (n + 1) table p with row 0 and column 0 all zero, and p[y][x] = tree(y, x) + p[y − 1][x] + p[y][x − 1] − p[y − 1][x − 1]. The answer is p[y2][x2] − p[y1 − 1][x2] − p[y2][x1 − 1] + p[y1 − 1][x1 − 1]. Read y before x. Use buffered input and one output buffer.

**Check yourself before revealing the walkthrough**

- [ ] I know the worst-case cost of counting each rectangle square by square
- [ ] I have an intermediate solution that is O(n) per question, and know whether it is fast enough
- [ ] I can explain each of the four terms in my O(1) formula with a picture
- [ ] My program prints 2 for `3 3 4 4` on the example grid (a query the CSES example does not cover)

## 3. Interview script: understand the problem (≈2 min)

Treat it as if an interviewer had said: "A fixed grid of trees and empty squares. Answer many 'how many trees in this rectangle' questions quickly."

**Me:** I read n and q, then n lines of n characters, then q lines of four numbers. Which number is the row?

**Interviewer:** y1 x1 y2 x2: y is the row, counted from the top, x the column, counted from the left. Both start at 1.

**Me:** Is (y1, x1) always the top-left corner and (y2, x2) the bottom-right? Could they come swapped?

**Interviewer:** y1 ≤ y2 and x1 ≤ x2, always.

**Me:** Are the borders included?

**Interviewer:** Yes. `3 1 3 1` is a single square.

**Me:** Sizes?

**Interviewer:** n up to 1000, q up to 2 · 10^5, one second.

**Me:** So the grid has up to 10^6 squares, and the largest possible answer is 10^6 trees, which fits an `int`. Counting square by square, a whole-grid question costs 10^6, and 2 · 10^5 of them is 2 · 10^11. That's out. Whatever I precompute can afford O(n²) = 10^6 work, about the cost of reading the grid.

**Me:** Let me do the first question by hand. Rows 2–3, columns 2–4. Row 2 is `*.**`, columns 2..4 are `.**`, two trees. Row 3 is `**..`, columns 2..4 are `*..`, one tree. Total 3. I notice I counted each row separately; if I knew how many trees each row has up to each column, each row would be one subtraction.

### Given constraints

These are in the CSES statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 1000 | The grid has up to 10^6 squares. An O(n²) precomputation is about 10^6 steps; an (n + 1)² `int` table is about 4 MB. |
| 1 ≤ q ≤ 2 · 10^5 | Square-by-square counting is O(n²) per question, up to 2 · 10^11 in total. O(n) per question is 2 · 10^8, borderline; O(1) is comfortable. |
| 1 ≤ y1 ≤ y2 ≤ n, 1 ≤ x1 ≤ x2 ≤ n | Rectangles are never empty and never leave the grid. The boundaries to handle are y1 = 1 and x1 = 1. |
| Squares are `.` or `*` | A tree counts 1, an empty square 0. Every count is at most 10^6, so `int` suffices. |
| Time limit 1 s | About 10^6 grid characters and 8 · 10^5 numbers to read, 2 · 10^5 lines to print: buffered input and one output buffer. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| y is the row, x the column, both 1-based, y first | Read the four numbers as y1, x1, y2, x2, in that order. Index the table as [row][column]. |
| Borders included | A rectangle covers rows y1..y2 and columns x1..x2; the "before" boundaries are y1 − 1 and x1 − 1. |
| The grid never changes | Precomputation is paid once. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| Grid lines contain only `.` and `*`, no spaces inside a line | I read each line as one token. Any character other than `*` counts as empty. |
| O(n²) extra memory is fine | 4 MB against a 512 MB limit. |

### Edge cases I will keep in mind

- n = 1: a single square, tree or not.
- A single-square rectangle (y1 = y2, x1 = x2).
- A rectangle touching the top row or left column (y1 = 1 or x1 = 1): the "before" row or column is row 0 or column 0.
- A full row, a full column, and the whole grid.
- A grid with no trees, and one that is all trees (answer 10^6 for the whole grid at n = 1000).

## 4. Think out loud: from first idea to best solution

The three rungs differ in how many squares a question has to look at: all of the rectangle, one entry per row, or four entries in total. n is the grid side, q the number of questions.

**Measured cost:** each program was run as `java Main < input` on my machine (JDK 26), JVM start-up included (an empty program takes about 0.03 s), on n = 1000 with a random forest and q = 2 · 10^5: every question the whole grid `1 1 1000 1000`, or random rectangles.

### Alternative: count every square of the rectangle

Too slow for the largest tests (about 220 s extrapolated), so it is not a numbered approach.

#### What I say out loud

> "The direct way: for each question, loop over the rows y1..y2 and the columns x1..x2 and count the `*`s. It does exactly what the question says, but a whole-grid question is 10^6 squares, and 2 · 10^5 of them is 2 · 10^11. Way too slow."

#### Intuition

Do exactly what the question says, square by square.

#### Algorithm

1. Read the grid into `forest[1..n][1..n]` (pad each row with one character in front so column x is index x).
2. For each question: `trees = 0`; for y = y1..y2, for x = x1..x2, if `forest[y][x] == '*'` then `trees++`. Print `trees`.

#### Why it is correct

The two loops visit every square of rows y1..y2 and columns x1..x2 exactly once, and no other square, and count each tree once.

#### Dry run

The example grid, with the column numbers on top:

```text
     x: 1 2 3 4
y = 1:  . * . .
y = 2:  * . * *
y = 3:  * * . .
y = 4:  * * * *
```

| Question | Squares visited | Trees | Answer |
|---|---|---|---|
| `2 2 3 4` | (2,2) . (2,3) * (2,4) * (3,2) * (3,3) . (3,4) . | 3 | 3 |
| `3 1 3 1` | (3,1) * | 1 | 1 |
| `1 1 2 2` | (1,1) . (1,2) * (2,1) * (2,2) . | 2 | 2 |

#### Java code

```java title="Alternative: count square by square (too slow at n = 1000, q = 2 · 10^5)"
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
        int n = nextInt();
        int q = nextInt();
        char[][] forest = new char[n + 1][];   // forest[y] is row y; row 0 is unused
        for (int y = 1; y <= n; y++) {
            forest[y] = (" " + next()).toCharArray();  // pad so that column x is at index x
        }

        StringBuilder out = new StringBuilder();
        for (int k = 0; k < q; k++) {
            int y1 = nextInt();
            int x1 = nextInt();
            int y2 = nextInt();
            int x2 = nextInt();
            int trees = 0;
            for (int y = y1; y <= y2; y++) {   // every square of the rectangle, every query
                for (int x = x1; x <= x2; x++) {
                    if (forest[y][x] == '*') {
                        trees++;
                    }
                }
            }
            out.append(trees).append('\n');
        }
        System.out.print(out);
    }

    static String next() throws IOException {
        while (!st.hasMoreTokens()) {
            st = new StringTokenizer(in.readLine());
        }
        return st.nextToken();
    }

    static int nextInt() throws IOException {
        return Integer.parseInt(next());
    }
}
```

#### Time complexity

**O(n² + Σ area) = O(n² · q) in the worst case,** when every question is the whole grid: 10^6 · 2 · 10^5 = 2 · 10^11 square checks. Measured with whole-grid questions: 2.1 s for 2,000 questions and 22.2 s for 20,000 questions, about 1.1 ms per question, so roughly **220 s** for 2 · 10^5 (an extrapolation; I did not wait for the full run).

#### Space complexity

**O(n²)** for the grid.

#### The bridge to the next approach

> "When I did the example by hand I counted each row of the rectangle separately. A row segment is a 1D range, and 1D ranges have a known fix: for each row, store how many trees are in columns 1..x. Then a row segment x1..x2 is one subtraction, and a rectangle is one subtraction per row: O(n) per question instead of O(n²)."

### Approach 1: Prefix counts per row

#### What I say out loud

> "For every row y I build row[y][x], the number of trees in columns 1..x of that row, with row[y][0] = 0. A question is then the sum over y from y1 to y2 of row[y][x2] − row[y][x1 − 1]. That's n² to build and at most n per question: 2 · 10^8 simple steps at the limits. That's on the edge for one second, so let me also look for something better."

#### Intuition

Each row is its own 1D prefix-sum problem. The rectangle is a stack of row segments, each answered in O(1).

#### Algorithm

1. `row = new int[n + 1][n + 1]`. For each row y: `row[y][x] = row[y][x − 1] + (square (y, x) is a tree ? 1 : 0)` for x = 1..n.
2. For each question: `trees = Σ_{y = y1..y2} (row[y][x2] − row[y][x1 − 1])`.

#### Why it is correct

- **Build invariant:** row[y][x] = number of trees in row y, columns 1..x; row[y][0] = 0 is the empty count.
- **One row:** row[y][x2] counts columns 1..x2, row[y][x1 − 1] counts columns 1..x1 − 1, so the difference counts exactly columns x1..x2 of row y (x1 = 1 reads column 0, which is 0).
- **The rectangle:** its squares are exactly the row segments of rows y1..y2, which do not overlap, so adding the segment counts counts each square once.

#### Dry run

Row prefix counts of the example (column 0 first):

| y | row[y][0..4] |
|---|---|
| 1 (`.*..`) | 0, 0, 1, 1, 1 |
| 2 (`*.**`) | 0, 1, 1, 2, 3 |
| 3 (`**..`) | 0, 1, 2, 2, 2 |
| 4 (`****`) | 0, 1, 2, 3, 4 |

| Question | Per row: row[y][x2] − row[y][x1 − 1] | Answer |
|---|---|---|
| `2 2 3 4` | y = 2: 3 − 1 = 2; y = 3: 2 − 1 = 1 | 3 |
| `3 1 3 1` | y = 3: 1 − 0 = 1 | 1 |
| `1 1 2 2` | y = 1: 1 − 0 = 1; y = 2: 1 − 0 = 1 | 2 |

#### Java code

```java title="Approach 1: prefix counts per row, O(n) per question"
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
        int n = nextInt();
        int q = nextInt();
        // row[y][x] = trees in row y, columns 1..x; row[y][0] = 0
        int[][] row = new int[n + 1][n + 1];
        for (int y = 1; y <= n; y++) {
            String line = next();
            for (int x = 1; x <= n; x++) {
                row[y][x] = row[y][x - 1] + (line.charAt(x - 1) == '*' ? 1 : 0);
            }
        }

        StringBuilder out = new StringBuilder();
        for (int k = 0; k < q; k++) {
            int y1 = nextInt();
            int x1 = nextInt();
            int y2 = nextInt();
            int x2 = nextInt();
            int trees = 0;
            for (int y = y1; y <= y2; y++) {   // one O(1) row-segment count per row
                trees += row[y][x2] - row[y][x1 - 1];
            }
            out.append(trees).append('\n');
        }
        System.out.print(out);
    }

    static String next() throws IOException {
        while (!st.hasMoreTokens()) {
            st = new StringTokenizer(in.readLine());
        }
        return st.nextToken();
    }

    static int nextInt() throws IOException {
        return Integer.parseInt(next());
    }
}
```

#### Time complexity

**O(n² + q · n) in the worst case:** n² to build; each question reads two entries in each of up to n rows. At the limits that is 10^6 + 2 · 10^5 · 1000 = 2 · 10^8 reads. Measured: **0.34 s** with every question the whole grid, **0.24 s** with random rectangles. It passes on my machine, but the 2 · 10^8 reads jump between rows of a 4 MB table, and on a slower judge the margin is thin.

#### Space complexity

**O(n²):** an (n + 1) × (n + 1) `int` table, about 4 MB. The grid characters are not kept.

#### The bridge to the next approach

> "I'm still adding up n row answers per question. Can I precompute the sum down the rows too? If I store, for each square, the count of the whole rectangle from (1, 1) to it, then any rectangle anchored at the top-left is one lookup. A general rectangle is the big anchored rectangle at its bottom-right corner, minus the part above it, minus the part to its left, and the top-left corner piece was then removed twice, so add it back once. Four lookups."

### Approach 2: 2D prefix sums with inclusion–exclusion (recommended)

#### What I say out loud

> "p[y][x] is the number of trees in the rectangle from (1, 1) to (y, x), with row 0 and column 0 all zero. I build it with p[y][x] = tree + p[y − 1][x] + p[y][x − 1] − p[y − 1][x − 1], and answer with p[y2][x2] − p[y1 − 1][x2] − p[y2][x1 − 1] + p[y1 − 1][x1 − 1]. O(n²) build, O(1) per question, and the zero padding means y1 = 1 or x1 = 1 needs no special case."

#### Intuition

Picture the rectangle from (1, 1) to (y2, x2), split by the lines just above row y1 and just left of column x1 into four regions:

```text
            columns 1..x1-1   columns x1..x2
rows 1..y1-1        C               A
rows y1..y2         B               R   <- the rectangle we want
```

- p[y2][x2] = R + A + B + C (everything).
- p[y1 − 1][x2] = A + C (everything above row y1).
- p[y2][x1 − 1] = B + C (everything left of column x1).
- p[y1 − 1][x1 − 1] = C (the corner).

So R = p[y2][x2] − (A + C) − (B + C) + C. Subtracting both strips removes C twice; adding it back once leaves exactly R. That is inclusion–exclusion.

#### Algorithm

1. `p = new int[n + 1][n + 1]`; row 0 and column 0 stay 0 (the padding).
2. For y = 1..n, x = 1..n (row by row, left to right): `p[y][x] = tree(y, x) + p[y − 1][x] + p[y][x − 1] − p[y − 1][x − 1]`.
3. For each question: print `p[y2][x2] − p[y1 − 1][x2] − p[y2][x1 − 1] + p[y1 − 1][x1 − 1]`.

#### Why it is correct

**The build.** Claim: p[y][x] equals the number of trees in rows 1..y, columns 1..x. It holds on the padding (an empty rectangle has 0 trees). When computing p[y][x], the three entries used were computed earlier in the row-by-row order, so by induction they are correct. p[y − 1][x] counts rows 1..y − 1, columns 1..x (everything except row y). p[y][x − 1] counts rows 1..y, columns 1..x − 1 (everything except column x). Together they cover every square of (1, 1)..(y, x) except (y, x) itself, and the overlap, rows 1..y − 1 and columns 1..x − 1, is counted twice, which is exactly p[y − 1][x − 1]. So tree(y, x) + p[y − 1][x] + p[y][x − 1] − p[y − 1][x − 1] counts every square of (1, 1)..(y, x) once.

**The query.** Split rows 1..y2 at y1 and columns 1..x2 at x1 into the regions C, A, B, R of the picture. They do not overlap and together make up (1, 1)..(y2, x2). Then

p[y2][x2] − p[y1 − 1][x2] − p[y2][x1 − 1] + p[y1 − 1][x1 − 1]
= (R + A + B + C) − (A + C) − (B + C) + C
= R.

Counting each square: a square of R is counted +1 (only in the first term). A square of A is in the first and second terms: +1 − 1 = 0. A square of B: +1 − 1 = 0. A square of C is in all four: +1 − 1 − 1 + 1 = 0. A square outside (1, 1)..(y2, x2) is in none.

**Why the padding.** When y1 = 1, the region above the rectangle is empty, and the formula reads row y1 − 1 = 0, which is all zeros, so A and C contribute 0. The same for x1 = 1 and column 0. Without the padding, each of those cases needs its own branch.

**No overflow:** every count is at most n² = 10^6, and every intermediate value of the formula stays between −10^6 and 2 · 10^6.

**The 30-second version:** "p[y][x] counts the trees from (1, 1) to (y, x), built with inclusion–exclusion: the cell, plus the rectangle above, plus the one to the left, minus their overlap. For a query, I take the big rectangle to the bottom-right corner, subtract the strip above and the strip to the left, and add back the corner I subtracted twice. A zero row and column make the top and left borders work without special cases. O(n²) once, then O(1) per question."

#### Dry run

The 2D prefix table of the example (row 0 and column 0 are the padding):

| p[y][x] | x = 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| y = 0 | 0 | 0 | 0 | 0 | 0 |
| 1 (`.*..`) | 0 | 0 | 1 | 1 | 1 |
| 2 (`*.**`) | 0 | 1 | 2 | 3 | 4 |
| 3 (`**..`) | 0 | 2 | 4 | 5 | 6 |
| 4 (`****`) | 0 | 3 | 6 | 8 | 10 |

One build step in detail: p[3][2] = tree(3, 2) + p[2][2] + p[3][1] − p[2][1] = 1 + 2 + 2 − 1 = 4.

| Question | p[y2][x2] | − p[y1 − 1][x2] | − p[y2][x1 − 1] | + p[y1 − 1][x1 − 1] | Answer |
|---|---|---|---|---|---|
| `2 2 3 4` | p[3][4] = 6 | p[1][4] = 1 | p[3][1] = 2 | p[1][1] = 0 | 3 |
| `3 1 3 1` | p[3][1] = 2 | p[2][1] = 1 | p[3][0] = 0 | p[2][0] = 0 | 1 |
| `1 1 2 2` | p[2][2] = 2 | p[0][2] = 0 | p[2][0] = 0 | p[0][0] = 0 | 2 |
| `3 3 4 4` | p[4][4] = 10 | p[2][4] = 4 | p[4][2] = 6 | p[2][2] = 2 | 2 |

The last row is not in the CSES example. It is the first one here where the corner term is nonzero, so it is the one that tests the "+ p[y1 − 1][x1 − 1]".

#### Java code

```java title="Approach 2: 2D prefix sums (recommended)"
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
        int n = nextInt();
        int q = nextInt();
        // p[y][x] = trees in the rectangle (1, 1)..(y, x); row 0 and column 0 are all 0
        int[][] p = new int[n + 1][n + 1];
        for (int y = 1; y <= n; y++) {
            String line = next();
            for (int x = 1; x <= n; x++) {
                int tree = line.charAt(x - 1) == '*' ? 1 : 0;
                p[y][x] = tree + p[y - 1][x] + p[y][x - 1] - p[y - 1][x - 1];
            }
        }

        StringBuilder out = new StringBuilder();
        for (int k = 0; k < q; k++) {
            int y1 = nextInt();
            int x1 = nextInt();
            int y2 = nextInt();
            int x2 = nextInt();
            int trees = p[y2][x2] - p[y1 - 1][x2] - p[y2][x1 - 1] + p[y1 - 1][x1 - 1];
            out.append(trees).append('\n');
        }
        System.out.print(out);
    }

    static String next() throws IOException {
        while (!st.hasMoreTokens()) {
            st = new StringTokenizer(in.readLine());
        }
        return st.nextToken();
    }

    static int nextInt() throws IOException {
        return Integer.parseInt(next());
    }
}
```

**Why this I/O:** the input has about 10^6 grid characters and 8 · 10^5 numbers, the output 2 · 10^5 lines. Each grid row is read as one token and each number through a `StringTokenizer` over a `BufferedReader`; all answers go into one `StringBuilder`, printed once. A `println` per answer forces a separate write per line (on the companion problem Static Range Sum Queries I measured 0.72 s for that against 0.18 s for one buffer).

#### Time complexity

**O(n² + q) in the worst case:** a constant amount of work per square to build, four reads per question. At the limits about 10^6 + 2 · 10^5 steps; reading the input is the larger cost. Measured over several runs: **0.13 to 0.18 s**, with whole-grid questions and with random rectangles alike. In the worst case a correct program has to read the whole grid (any unread square could be a tree inside some rectangle), so Ω(n²) is a lower bound and this is optimal.

#### Space complexity

**O(n²):** the (n + 1) × (n + 1) `int` table, about 4 MB. The grid characters are only held one row at a time.

## 5. Comparison table

n is the grid side, q the number of questions. Times are my measurements at n = 1000, q = 2 · 10^5, JVM start-up included.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Alt. Count every square | O(n² · q) | O(n² · q): about 220 s (extrapolated from 1.1 ms per whole-grid question) | O(n²) grid |
| 1. Prefix counts per row | O(n² + q · n) | O(n² + q · n): 0.24 to 0.34 s measured | O(n²) table, about 4 MB |
| 2. 2D prefix sums | O(n² + q) | O(n² + q): 0.13 to 0.18 s measured | O(n²) table, about 4 MB |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Alt. Count every square | No preparation; a direct translation of the question | 2 · 10^11 steps at the limits | Only to state the baseline |
| 1. Row prefix counts | Only the 1D idea; a cell change rebuilds one row in O(n) | O(n) per question; 2 · 10^8 reads at the limits | When cells change occasionally, or as the stepping stone in the interview |
| 2. 2D prefix sums | O(1) per question; short | A four-term formula that is easy to get wrong; a cell change costs O(n²) | The answer for a static grid |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2, the 2D prefix table with a zero row and column, and buffered I/O. It is optimal (the grid has to be read), the code is about twenty lines, and the only risk is the formula, which you should derive aloud from the four-region picture rather than recite.

**How to present the ladder:** state the square-by-square count and its 2 · 10^11, mention the per-row prefix counts as the natural middle step (and that 2 · 10^8 is uncomfortably close to the limit), then go to 2D prefix sums.

**When another tool is better:** if cells change between questions, rebuilding the 2D table costs O(n²) per change. A 2D Fenwick tree gives O(log² n) per change and per question; that is CSES Forest Queries II. For this static problem, stop at 2D prefix sums.

## 7. Interview script: code it and test it

### What I say while coding

> "The table is (n + 1) × (n + 1). Row 0 and column 0 stay zero; real squares are at 1..n, matching the 1-based input. That padding is why I never need an `if (y1 == 1)`."

> "I read y1 then x1, then y2, x2: row first. Indexing is `p[row][column]`, so `p[y][x]`."

> "Build in row-major order, so p[y − 1][x], p[y][x − 1] and p[y − 1][x − 1] are ready when I need them."

> "Each row of the grid is one token, and `line.charAt(x − 1)` is column x, because the string is 0-based and the table is 1-based."

### Testing out loud

**The example:** with the table above, 6 − 1 − 2 + 0 = 3, 2 − 1 − 0 + 0 = 1, 2 − 0 − 0 + 0 = 2. Matches.

**The corner term:** `3 3 4 4` gives 10 − 4 − 6 + 2 = 2. Rows 3–4, columns 3–4 are `..` over `**`: 2 trees. Correct, and this is the case the CSES example does not exercise.

**n = 1:** `*` with `1 1 1 1` is p[1][1] − 0 − 0 + 0 = 1; `.` gives 0.

**Top row or left column:** `1 1 2 2` read row 0 and column 0, all zeros.

**The largest case:** n = 1000, all trees, whole grid: p[1000][1000] = 10^6, within `int`.

**Official tests:** all three programs on this page (the slow alternative included) print the expected output on the official CSES test stored with this site (CSES has three tests for this problem; the site stores the small one, a 10 × 10 grid with 100 questions), run on a real JVM. It is small, so the tests for this page add every rectangle of random grids up to 7 × 7, n = 1000 with q = 2 · 10^5, and all-tree and empty grids.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2 min | y is the row and comes first, borders included, n ≤ 1000, q ≤ 2 · 10^5 |
| Ladder | 4 min | Square by square (2 · 10^11), row prefix counts (2 · 10^8), 2D prefix sums |
| Derive the formula | 3 min | The four-region picture, for the build and for the query |
| Code | 5 min | Padded table, row-major build, four-term query, fast I/O |
| Test | 4 min | The example, a query with a nonzero corner term, n = 1 |

If you get stuck on the formula, draw the picture with C, A, B, R and write what each of the four lookups covers. The signs follow from that.

## 9. Interviewer challenges

### About correctness

#### Prove the query formula. Why plus at the end?

**What they are testing:** whether you derived the formula or memorized it.

**How to reason:** label the four regions and count how often each is included.

**What I say:** "p[y2][x2] is R + A + B + C. Subtracting the strip above, A + C, and the strip to the left, B + C, removes C twice. Adding p[y1 − 1][x1 − 1] = C once leaves R. Per square: R is counted once, A and B once in and once out, C in, out, out, in."

**Nuance:** the same inclusion–exclusion builds the table: p[y][x] = cell + up + left − up-left. If you can explain one, you can rebuild the other.

#### Why pad with a zero row and column instead of using an n × n table?

**What they are testing:** whether you choose a representation that removes special cases.

**How to reason:** list what the formula reads when y1 = 1 or x1 = 1.

**What I say:** "With y1 = 1 the formula reads row 0, which should mean 'no rows'. In an n × n table that's index −1, so I'd need three branches for top, left and top-left. With padding, row 0 and column 0 are real entries equal to 0, and one formula covers every case."

**Nuance:** padding also makes the 1-based input map directly to table indices, which removes the most common off-by-one in this problem.

### About implementation

#### Your example passed. How do you know the formula is right?

**What they are testing:** whether you can pick a test that would catch a bug, not just run the given one.

**How to reason:** the CSES example has p[y1 − 1][x1 − 1] = 0 in all three questions.

**What I say:** "The CSES example can't catch a missing corner term: in all three of its questions the corner, p[y1 − 1][x1 − 1], is 0. I ran a version without '+ p[y1 − 1][x1 − 1]': it prints 3, 1, 2 on the example, all correct, and 0 instead of 2 on `3 3 4 4`. So I test a rectangle away from the top and left edges."

**Nuance:** the same goes for the build: omitting "− p[y − 1][x − 1]" in the build does show on the example (it prints 12, 1, 2), because overcounts accumulate across the table.

#### Is `int` enough?

**What they are testing:** quick bounding.

**How to reason:** the largest count is the whole grid.

**What I say:** "At most n² = 10^6 trees, and intermediate values in the formula stay below 2 · 10^6 in absolute value. `int` is plenty."

**Nuance:** the 2D sum version with arbitrary values (Range Sum Query 2D) needs the same bound check with its own value range.

### About changing requirements

#### What if trees can be planted and cut between questions?

**What they are testing:** knowing the limit of a static structure.

**How to reason:** a change at (y, x) changes every p[y'][x'] with y' ≥ y and x' ≥ x: up to n² entries.

**What I say:** "The 2D table would need O(n²) per change. A 2D Fenwick tree stores partial counts so that both a change and a top-left-anchored count cost O(log² n), and the same four-term formula answers a rectangle. The per-row version in between is O(n) per change and O(n) per question."

**Nuance:** with few changes and many questions, rebuilding the 2D table after each change can still win. Count first.

## 10. Follow-up questions the interviewer might ask

**"Cells change between questions."**
[[cses-forest-queries-ii|Forest Queries II]]: a 2D [[a12-fenwick|Fenwick tree]], O(log² n) per update and per question.

**"The grid holds arbitrary integers and the question is a sum."**
The same 2D prefix sums with values instead of 0/1, written as a class: [[nc-range-sum-query-2d-immutable|Range Sum Query 2D - Immutable]]. Check the bound on the sums for the value range given.

**"The grid is one row."**
That is 1D prefix sums, [[cses-static-range-sum-queries|Static Range Sum Queries]]: the same formula with two terms instead of four.

**"Add 1 to every square of many rectangles, then print the grid."**
The reverse operation: a 2D difference array, four corner updates per rectangle and one 2D prefix pass at the end, O(q + n²). See [[a2-difference-arrays|Difference Arrays]].

**"Three dimensions."**
Inclusion–exclusion over the 8 corners of a box: add the corners where an even number of coordinates are "before", subtract the others. O(n³) build, O(1) per question.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Trusting the example.** All three CSES example questions have a zero corner term, so a formula without "+ p[y1 − 1][x1 − 1]" passes it.
- **Stopping at row prefix counts without counting.** O(n) per question is 2 · 10^8 at the limits; say the number and decide, don't assume.
- **Memorizing the formula instead of the picture.** Under pressure the signs get swapped; the four-region picture rebuilds them in seconds.

### Implementation mistakes

> [!MISTAKE] Forgetting to add the corner back
> `p[y2][x2] - p[y1 - 1][x2] - p[y2][x1 - 1]` without `+ p[y1 - 1][x1 - 1]` prints 3, 1, 2 on the CSES example, all correct, and 0 instead of 2 on `3 3 4 4` (run). Test a rectangle away from the top and left edges.

- **Forgetting to subtract the overlap in the build.** `p[y][x] = tree + p[y − 1][x] + p[y][x − 1]` overcounts; on the example it prints 12, 1, 2 instead of 3, 1, 2 (run).
- **Reading x before y.** Reading the four numbers as x1 y1 x2 y2 prints 4, 0, 2 on the example instead of 3, 1, 2 (run). The statement gives the row first.
- **No padding.** An n × n table makes y1 = 1 or x1 = 1 read index −1.
- **`charAt(x)` instead of `charAt(x − 1)`.** The row string is 0-based while the table is 1-based; the count shifts by one column, and at x = n it reads past the end of the string: on the example it throws `StringIndexOutOfBoundsException: Index 4 out of bounds for length 4` (run).
- **A `println` per answer.** 2 · 10^5 separate writes; collect the answers in one `StringBuilder`.

## 12. Pattern recognition

**The pattern:** 2D prefix sums with inclusion–exclusion. Precompute counts of every rectangle anchored at the top-left; any rectangle is four of them.

**Signals in the problem statement:**

- A fixed grid and many rectangle questions.
- The question is a count or a sum (something with an inverse).
- n² fits in memory and time, but q · n² does not.

**Related problems in this list:**

- [[nc-range-sum-query-2d-immutable|Range Sum Query 2D - Immutable]]: the same structure with integer values, as a class.
- [[cses-static-range-sum-queries|Static Range Sum Queries]]: the 1D version.
- [[cses-range-xor-queries|Range Xor Queries]]: the 1D prefix idea with XOR, and why an inverse is needed.
- [[cses-forest-queries-ii|Forest Queries II]]: the same grid with updates, using a 2D Fenwick tree.

**Takeaway:** a rectangle is a big anchored rectangle minus two strips plus the corner they share. Pad with zeros so the borders need no special case.

## 13. 60-second revision card

**Key insight:** with p[y][x] = trees in (1, 1)..(y, x), a rectangle is p[y2][x2] − p[y1 − 1][x2] − p[y2][x1 − 1] + p[y1 − 1][x1 − 1].

**Invariant:** p[y][x] = tree(y, x) + p[y − 1][x] + p[y][x − 1] − p[y − 1][x − 1], with row 0 and column 0 equal to 0.

**Complexity:** O(n² + q) time, O(n²) memory (about 4 MB at n = 1000).

**Code skeleton:**

```java title="Forest Queries, 2D prefix sums"
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
        int n = Integer.parseInt(next()), q = Integer.parseInt(next());
        int[][] p = new int[n + 1][n + 1];
        for (int y = 1; y <= n; y++) {
            String row = next();
            for (int x = 1; x <= n; x++)
                p[y][x] = (row.charAt(x - 1) == '*' ? 1 : 0) + p[y - 1][x] + p[y][x - 1] - p[y - 1][x - 1];
        }
        StringBuilder out = new StringBuilder();
        while (q-- > 0) {
            int y1 = Integer.parseInt(next()), x1 = Integer.parseInt(next());
            int y2 = Integer.parseInt(next()), x2 = Integer.parseInt(next());
            out.append(p[y2][x2] - p[y1 - 1][x2] - p[y2][x1 - 1] + p[y1 - 1][x1 - 1]).append('\n');
        }
        System.out.print(out);
    }

    static String next() throws IOException {
        while (!st.hasMoreTokens()) st = new StringTokenizer(in.readLine());
        return st.nextToken();
    }
}
```

**Main traps:**

- The `+ p[y1 − 1][x1 − 1]` term; the CSES example does not test it.
- Row (y) first in the input.
- Pad row 0 and column 0; `charAt(x − 1)` for column x.

**What to say in one breath:** "2D prefix counts with a zero border. The rectangle is the big anchored count minus the strip above, minus the strip to the left, plus the corner I removed twice. O(n²) build, O(1) per question, `int` is enough because the most is 10^6 trees."
