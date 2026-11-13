---
problemId: nc-range-sum-query-2d-immutable
title: Range Sum Query 2D - Immutable
source: neetcode
sourceUrl: https://leetcode.com/problems/range-sum-query-2d-immutable/
difficulty: medium
patterns: [arrays-hashing, hashing, prefix-sum]
relatedLessons: [a2-prefix-suffix, a2-matrix, a12-fenwick, a14-edge-cases]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

Write a class `NumMatrix`. Its constructor receives a grid of integers once. After that, `sumRegion(row1, col1, row2, col2)` is called many times, and each call must return the sum of every cell inside the rectangle whose top-left corner is `(row1, col1)` and whose bottom-right corner is `(row2, col2)`. Both corners are inside the rectangle. The grid never changes after construction.

**Example**

```text
matrix = [ 3, -1,  2 ]
         [ 0,  4, -2 ]
         [ 5,  1,  1 ]
```

| Call | Returns | Why |
|---|---|---|
| `sumRegion(1, 1, 2, 2)` | `4` | The bottom-right 2 × 2 block: 4 + (−2) + 1 + 1 |
| `sumRegion(0, 0, 2, 0)` | `8` | The first column: 3 + 0 + 5 |
| `sumRegion(0, 0, 2, 2)` | `13` | The whole grid |
| `sumRegion(1, 2, 1, 2)` | `-2` | A single cell: the corners can coincide |

**What the problem statement guarantees**

- The grid has m rows and n columns, with 1 ≤ m, n ≤ 200, and every row has the same length n.
- Every cell is between −10^4 and 10^4.
- Every query has 0 ≤ row1 ≤ row2 < m and 0 ≤ col1 ≤ col2 < n: the rectangle is non-empty and inside the grid.
- `sumRegion` is called at most 10^4 times.
- The statement asks for `sumRegion` to run in O(1) time.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The interesting part of this problem is not any single query; it is the split between work done once and work done per query.

**How to practise**

1. Set a timer for 20 minutes and talk out loud.
2. Write down the total cost of the simplest solution over all the queries, using the stated limits, and decide whether it is acceptable.
3. Ask yourself what the constructor could compute that every later query would reuse.
4. Code it, then trace the example above on paper, including a query that touches row 0 and column 0.

Open a hint only after two minutes without progress.

> [!HINT] Hint 1: a small nudge
> Solve the one-dimensional version first: one row, many queries "sum from column a to column b". What single table, built once, lets you answer each of those with one subtraction?

> [!HINT] Hint 2: the kind of tool you need
> Extend that table to two dimensions: store, for every cell, the sum of the whole rectangle from the top-left corner of the grid down to that cell. Any query rectangle can then be built from four such corner rectangles, added and subtracted.

> [!HINT] Hint 3: almost the whole plan
> Make the table one row and one column larger than the grid, with a row and column of zeros at the top and left, so that "the rectangle above row 0" exists and is 0. Fill it with the cell plus the rectangle above plus the rectangle to the left minus their overlap. Answer a query with the big rectangle minus the strip above minus the strip to the left plus the corner you subtracted twice. Draw it before trusting the signs.

**Check yourself before revealing the walkthrough**

- [ ] My `sumRegion` does a constant amount of work, independent of the rectangle's size
- [ ] It returns `13` for the whole example grid and `-2` for the single cell `(1, 2)`
- [ ] Queries with `row1 = 0` or `col1 = 0` need no special case in my code, or I handled them
- [ ] I can say whether any sum can overflow an `int`, with the numbers

## 3. Interview script: understand the problem (≈2 min)

**Me:** So the grid is given once, then I get a stream of rectangle-sum queries. The corners are inclusive, and the grid never changes between queries?

**Interviewer:** Right. The matrix is immutable.

**Me:** How big can it get, and how many queries?

**Interviewer:** Up to 200 by 200, and up to 10^4 calls to `sumRegion`.

**Me:** That's 4 × 10^4 cells. Summing a whole rectangle per query could be 4 × 10^4 additions, times 10^4 queries, 4 × 10^8. That's the number I want to beat. Are the query coordinates always valid, with row1 ≤ row2 and col1 ≤ col2?

**Interviewer:** Yes, always inside the grid and ordered.

**Me:** So no validation, and no empty rectangles. Values?

**Interviewer:** Between −10^4 and 10^4.

**Me:** Negatives, so nothing monotone to exploit. The largest possible sum in absolute value is the whole grid at the extreme: 200 × 200 × 10^4 = 4 × 10^8, which is below `int`'s limit of about 2.147 × 10^9. I'll check the intermediate steps of my formula against that later. Is the grid ever empty?

**Interviewer:** No, at least 1 by 1.

**Me:** Let me do one query by hand. `sumRegion(1, 1, 2, 2)` on the example: rows 1 and 2, columns 1 and 2, so 4, −2, 1, 1. That's 4.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ m, n ≤ 200 | At most 4 × 10^4 cells: any O(mn) preprocessing is cheap. The grid is never empty, so the constructor needs no empty-grid branch. |
| At most 10^4 calls to `sumRegion` | The query is the hot path. Brute force costs up to 4 × 10^8 cell reads in total; precomputation pays off. |
| 0 ≤ row1 ≤ row2 < m, 0 ≤ col1 ≤ col2 < n | Every query is a valid, non-empty rectangle. But row1 = 0 and col1 = 0 do occur, so any "one row above" index must exist. |
| −10^4 ≤ value ≤ 10^4 | Any rectangle sum is at most 4 × 10^8 in absolute value, so `int` suffices (worked out in section 4). |
| `sumRegion` should be O(1) | Rules out anything that walks the rectangle, or even one dimension of it. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| The matrix does not change after construction | Precomputed sums never go stale. With updates I would need a different structure (follow-ups). |
| Corners are inclusive | The query covers rows row1 to row2 *including* row2; the off-by-one in the formula has to match. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The caller does not modify the array it passed in after construction | The brute-force versions keep a reference to it. The prefix-sum version copies what it needs, so it is safe either way. |
| Single-threaded use | No synchronization; the precomputed table is never written after the constructor, so concurrent reads would be safe anyway. |

### Edge cases I will keep in mind

- A 1 × 1 grid, and a query equal to one cell.
- A query touching row 0 or column 0 (the "strip above" or "strip to the left" is empty).
- The whole grid as one query.
- A single-row grid and a single-column grid.
- All cells at 10^4, or all at −10^4, at 200 × 200: the overflow boundary.

## 4. Think out loud: from first idea to best solution

Throughout: **m** is the number of rows, **n** the number of columns, **q** the number of queries (at most 10^4).

### Approach 1: Brute force (sum the rectangle on every query)

#### What I say out loud

> "The direct solution keeps the grid and, on each query, adds up every cell in the rectangle with two nested loops. It's certainly correct. The cost is the rectangle's area per query: up to mn = 4 × 10^4, so 4 × 10^8 over 10^4 queries. That might squeeze through, but it ignores the O(1) requirement, and every query recomputes sums that the previous query already added."

#### Intuition

The answer is defined as a sum over cells; computing that definition is correct by construction.

#### Algorithm

1. Constructor: keep a reference to the grid.
2. `sumRegion`: for each row from `row1` to `row2`, for each column from `col1` to `col2`, add the cell. Return the total.

#### Why it is correct

The loops visit each cell with `row1 ≤ r ≤ row2` and `col1 ≤ c ≤ col2` exactly once and no other cell, so the total is the rectangle's sum.

#### Dry run

`sumRegion(1, 1, 2, 2)` on the example:

| r | c | cell | total |
|---|---|---|---|
| 1 | 1 | 4 | 4 |
| 1 | 2 | −2 | 2 |
| 2 | 1 | 1 | 3 |
| 2 | 2 | 1 | 4 |

Returns 4.

#### Java code

```java title="Approach 1: brute force"
class NumMatrix {
    private final int[][] matrix;

    public NumMatrix(int[][] matrix) {
        this.matrix = matrix;
    }

    public int sumRegion(int row1, int col1, int row2, int col2) {
        int sum = 0;
        for (int r = row1; r <= row2; r++) {
            for (int c = col1; c <= col2; c++) {
                sum += matrix[r][c];
            }
        }
        return sum;
    }
}
```

#### Time complexity

**Constructor O(1); `sumRegion` O((row2 − row1 + 1) × (col2 − col1 + 1)), which is O(mn) in the worst case.** Over q queries the worst case is O(q·mn): 10^4 × 4 × 10^4 = 4 × 10^8 cell reads at the limits.

#### Space complexity

**O(1) auxiliary space.** Only a reference to the input is stored.

#### The bridge to the next approach

> "Where is the repeated work? A query adds cells one at a time even though the grid never changes. Let me look at one row first. Summing columns `col1..col2` of one row is the classic range-sum question, and a prefix-sum array answers it with one subtraction: `prefix[col2 + 1] - prefix[col1]`. If I build that for every row, a query only has to loop over its rows."

### Approach 2: Prefix sums per row

#### What I say out loud

> "For each row I store `rowPrefix[r][c]` = the sum of the first c cells of row r, with `rowPrefix[r][0] = 0`. Then the part of row r between `col1` and `col2` is `rowPrefix[r][col2 + 1] - rowPrefix[r][col1]`. A query loops over its rows and adds those differences: O(m) per query instead of O(mn)."

> "The extra leading zero in each row means I never have to special-case `col1 = 0`."

#### Intuition

A row segment's sum is "everything up to the right end" minus "everything before the left end". Precompute "everything up to" once, per row. This is the one-dimensional prefix sum from [[a2-prefix-suffix|Prefix and Suffix Arrays]].

#### Algorithm

1. Constructor: `rowPrefix = new int[m][n + 1]`; for each row r and column c, `rowPrefix[r][c + 1] = rowPrefix[r][c] + matrix[r][c]`.
2. `sumRegion`: for r from `row1` to `row2`, add `rowPrefix[r][col2 + 1] - rowPrefix[r][col1]`.

#### Why it is correct

By induction along the row, `rowPrefix[r][c]` is the sum of `matrix[r][0..c-1]` (it starts at 0, the empty sum, and each step adds the next cell). So `rowPrefix[r][col2 + 1] - rowPrefix[r][col1]` is the sum of cells `col1..col2` of row r: the cells before `col1` appear in both terms and cancel. Adding this for every row in `row1..row2` sums exactly the rectangle.

#### Dry run

`rowPrefix` for the example:

| row | rowPrefix |
|---|---|
| 0 | [0, 3, 2, 4] |
| 1 | [0, 0, 4, 2] |
| 2 | [0, 5, 6, 7] |

`sumRegion(1, 1, 2, 2)`: row 1 gives `rowPrefix[1][3] - rowPrefix[1][1]` = 2 − 0 = 2; row 2 gives 7 − 5 = 2. Total 4.

#### Java code

```java title="Approach 2: prefix sums per row"
class NumMatrix {
    private final int[][] rowPrefix; // rowPrefix[r][c] = sum of matrix[r][0..c-1]

    public NumMatrix(int[][] matrix) {
        int m = matrix.length;
        int n = matrix[0].length;
        rowPrefix = new int[m][n + 1];
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                rowPrefix[r][c + 1] = rowPrefix[r][c] + matrix[r][c];
            }
        }
    }

    public int sumRegion(int row1, int col1, int row2, int col2) {
        int sum = 0;
        for (int r = row1; r <= row2; r++) {
            sum += rowPrefix[r][col2 + 1] - rowPrefix[r][col1];
        }
        return sum;
    }
}
```

#### Time complexity

**Constructor O(mn); `sumRegion` O(row2 − row1 + 1), which is O(m) in the worst case.** Over q queries: O(mn + qm), at the limits 4 × 10^4 + 10^4 × 200 = about 2 × 10^6 steps.

#### Space complexity

**O(mn) auxiliary space**: the m × (n + 1) table.

#### The bridge to the next approach

> "That's already fast enough for these limits, but the statement asks for O(1) per query, and there's still a loop in the query. The loop adds up one row segment per row, which is the same 'sum one at a time' pattern I just removed from the columns. So I apply the same trick in the other direction: instead of 'sum of row r up to column c', store 'sum of the whole rectangle from the top-left corner down to (r, c)'. Then I need to figure out how to cut an arbitrary rectangle out of those corner rectangles."

### Approach 3: 2D prefix sums with a padded table (recommended)

#### What I say out loud

> "Define `P[i][j]` as the sum of all cells in rows `0..i-1` and columns `0..j-1`: the rectangle anchored at the top-left corner, i rows tall and j columns wide. The table is (m + 1) × (n + 1), and row 0 and column 0 are all zeros because they describe empty rectangles."

> "To build it: `P[i+1][j+1]` is the cell `matrix[i][j]`, plus the rectangle directly above it, `P[i][j+1]`, plus the rectangle to its left, `P[i+1][j]`. Those two overlap in `P[i][j]`, which I've counted twice, so I subtract it once."

> "To query: take the big rectangle from the origin to the bottom-right corner, `P[row2+1][col2+1]`. Remove the strip above the query, `P[row1][col2+1]`, and the strip to its left, `P[row2+1][col1]`. The top-left block `P[row1][col1]` was in both strips, so I've removed it twice; add it back once. Four lookups, O(1)."

#### Intuition

Picture the grid with the query rectangle Q in its lower-right part. Call the region above Q (same columns, rows above `row1`) **A**, the region to the left of Q (same rows, columns before `col1`) **L**, and the top-left block above and to the left of Q **C**. Then:

- `P[row2+1][col2+1]` = C + A + L + Q (everything from the origin to Q's bottom-right corner)
- `P[row1][col2+1]` = C + A (all rows above Q, up to Q's right edge)
- `P[row2+1][col1]` = C + L (all columns left of Q, down to Q's bottom edge)
- `P[row1][col1]` = C

So `P[row2+1][col2+1] − P[row1][col2+1] − P[row2+1][col1] + P[row1][col1]` = (C + A + L + Q) − (C + A) − (C + L) + C = Q. This is inclusion–exclusion: subtracting the two strips removes C twice, so it is added back once. The build step is the same picture with Q shrunk to the single cell `(i, j)`.

**Why the padding.** Without the extra row and column, "the strip above `row1 = 0`" would be `P[-1][…]`, which does not exist, and every query and every build step on the top row or left column would need its own branch. With the padding, an index of 0 means "zero rows" or "zero columns", whose sum is 0 and is already stored. The off-by-one moves to one place, the `+1` on the bottom-right indices, and every case runs through the same formula.

#### Algorithm

1. `P = new int[m + 1][n + 1]` (Java initializes it to zeros, which is the padding).
2. For i from 0 to m − 1, for j from 0 to n − 1: `P[i+1][j+1] = matrix[i][j] + P[i][j+1] + P[i+1][j] - P[i][j]`.
3. `sumRegion`: return `P[row2+1][col2+1] - P[row1][col2+1] - P[row2+1][col1] + P[row1][col1]`.

#### Why it is correct

**The invariant: `P[i][j]` equals the sum of `matrix[r][c]` over 0 ≤ r < i and 0 ≤ c < j.**

- For i = 0 or j = 0 the rectangle is empty and the entry is 0, which is how Java initialized it.
- The loops fill row by row, left to right, so when `P[i+1][j+1]` is computed, the three entries it reads (`P[i][j+1]`, `P[i+1][j]`, `P[i][j]`) are already final. By the picture above, cell + (rectangle above) + (rectangle to the left) − (their overlap) counts every cell of the (i + 1) × (j + 1) corner rectangle exactly once.
- Given the invariant, the query formula counts each cell of the query rectangle once and every other cell zero times, by the C / A / L / Q argument.

**The 25-second version to say to the interviewer:**

> "P[i][j] is the sum of the top-left i-by-j block, with a zero row and column for empty blocks. A query is the big block to its bottom-right corner, minus the block above it, minus the block to its left. The top-left corner block was subtracted twice, so I add it back. Four lookups, O(1) per query after O(mn) preprocessing, and the padding means row 0 and column 0 need no special case."

#### Dry run

Building `P` (4 × 4) for the example. Each entry uses the formula; the check column recomputes it directly.

| Entry | matrix[i][j] + above + left − overlap | Value | Direct check |
|---|---|---|---|
| P[1][1] | 3 + 0 + 0 − 0 | 3 | 3 |
| P[1][2] | −1 + 0 + 3 − 0 | 2 | 3 − 1 |
| P[1][3] | 2 + 0 + 2 − 0 | 4 | 3 − 1 + 2 |
| P[2][1] | 0 + 3 + 0 − 0 | 3 | 3 + 0 |
| P[2][2] | 4 + 2 + 3 − 3 | 6 | 3 − 1 + 0 + 4 |
| P[2][3] | −2 + 4 + 6 − 2 | 6 | first two rows: 4 + 2 |
| P[3][1] | 5 + 3 + 0 − 0 | 8 | first column: 3 + 0 + 5 |
| P[3][2] | 1 + 6 + 8 − 3 | 12 | 3 − 1 + 0 + 4 + 5 + 1 |
| P[3][3] | 1 + 6 + 12 − 6 | 13 | whole grid |

```text
P = [ 0,  0,  0,  0 ]
    [ 0,  3,  2,  4 ]
    [ 0,  3,  6,  6 ]
    [ 0,  8, 12, 13 ]
```

Queries:

| Query | P[r2+1][c2+1] − P[r1][c2+1] − P[r2+1][c1] + P[r1][c1] | Result |
|---|---|---|
| (1, 1, 2, 2) | P[3][3] − P[1][3] − P[3][1] + P[1][1] = 13 − 4 − 8 + 3 | 4 |
| (0, 0, 2, 0) | P[3][1] − P[0][1] − P[3][0] + P[0][0] = 8 − 0 − 0 + 0 | 8 |
| (0, 0, 2, 2) | P[3][3] − P[0][3] − P[3][0] + P[0][0] = 13 − 0 − 0 + 0 | 13 |
| (1, 2, 1, 2) | P[2][3] − P[1][3] − P[2][2] + P[1][2] = 6 − 4 − 6 + 2 | −2 |

The second and third queries touch row 0 and column 0; the padding row and column supply the zeros.

#### Java code

```java title="Approach 3: 2D prefix sums (recommended)"
class NumMatrix {
    // prefix[i][j] = sum of matrix[r][c] for 0 <= r < i and 0 <= c < j.
    // Row 0 and column 0 stay 0: they describe empty rectangles.
    private final int[][] prefix;

    public NumMatrix(int[][] matrix) {
        int m = matrix.length;
        int n = matrix[0].length;
        prefix = new int[m + 1][n + 1];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                prefix[i + 1][j + 1] = matrix[i][j] + prefix[i][j + 1] + prefix[i + 1][j] - prefix[i][j];
            }
        }
    }

    public int sumRegion(int row1, int col1, int row2, int col2) {
        return prefix[row2 + 1][col2 + 1]
                - prefix[row1][col2 + 1]
                - prefix[row2 + 1][col1]
                + prefix[row1][col1];
    }
}
```

**Overflow check.** Every `prefix` entry is the sum of at most 200 × 200 = 4 × 10^4 cells of absolute value at most 10^4, so |entry| ≤ 4 × 10^8. The worst intermediate value in the build is `matrix + above + left`: at most 10^4 + 8 × 10^8 in absolute value. In the query, evaluated left to right, the partial results are bounded by 8 × 10^8, then 1.2 × 10^9, then 1.6 × 10^9. All are below 2^31 − 1 ≈ 2.147 × 10^9, so `int` never overflows. (Java `int` arithmetic wraps around modulo 2^32 rather than failing, so even an intermediate overflow would cancel out when the true final result fits; the bound means we do not need that argument.)

#### Time complexity

**Constructor O(mn); `sumRegion` O(1) in the worst case.** The constructor does a constant amount of work for each of the mn cells. A query does four array reads and three additions. Over q queries: O(mn + q). Not hashing, so expected and worst case are the same.

#### Space complexity

**O(mn) auxiliary space**: the (m + 1) × (n + 1) table, about 40,401 `int`s (160 KB) at the limits. The input grid is not kept or modified.

### Alternative: build the prefix table without padding

Use an m × n table where `P[i][j]` includes row i and column j, and guard every out-of-range read: `(i > 0 ? P[i-1][j] : 0)` and so on, in both the build and the query. It saves one row and one column, which is nothing at this size, and it adds six conditionals that are each a chance for an off-by-one. Mention it only if the interviewer asks why the table is larger than the grid.

## 5. Comparison table

m = rows, n = columns, q = number of queries. No approach hashes, so expected and worst case coincide.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Brute force | O(1) build, O(mn) per query | O(q·mn) total | O(1) |
| 2. Prefix sums per row | O(mn) build, O(m) per query | O(mn + q·m) total | O(mn) |
| 3. 2D prefix sums, padded | O(mn) build, O(1) per query | O(mn + q) total | O(mn) |
| Alt. 2D prefix sums, unpadded | O(mn) build, O(1) per query | O(mn + q) total | O(mn) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Brute force | No preprocessing, correct by inspection | Up to 4 × 10^8 reads at the limits; misses the O(1) requirement | Very few queries, or as the stated baseline |
| 2. Prefix sums per row | Simple 1D idea; easy to extend to point updates (rebuild one row in O(n)) | O(m) per query | When updates also happen and a Fenwick tree is overkill |
| 3. 2D prefix sums, padded | O(1) queries, no edge-case branches | One formula with four signs to get right | The answer to give |
| Alt. unpadded | One row and column less memory | Six bounds checks, easy to get wrong | Rarely |

## 6. Which solution to give, and when to stop optimizing

Give the padded 2D prefix sums. Queries are O(1), which is optimal, and the O(mn) construction is optimal in the worst case too: a correct structure must look at essentially every cell, because an unread cell could be inside some later query, so there is an Ω(mn) worst-case lower bound on preprocessing. Mention brute force and the per-row version in a sentence each on the way there; the per-row version is a good stepping stone to say out loud because it makes the 2D formula feel inevitable. Stop once the formula is derived with the picture, traced on a query that touches row 0, and the overflow bound is stated.

## 7. Interview script: code it and test it

### What I say while coding

> "The table is `(m + 1) × (n + 1)`. Java zero-fills it, and that zero row and column are the padding, so there's no initialization loop."

> "In the build, `prefix[i + 1][j + 1]` is the cell plus above plus left minus overlap. All indices on the right are already filled, because I go row by row, left to right."

> "The query: bottom-right corner gets `+1` on both indices because `prefix` is exclusive on its upper bounds; the top-left corner uses `row1` and `col1` unchanged because 'everything before row1' is exactly `prefix[row1][…]`."

### Testing out loud

**Normal case:** `sumRegion(1, 1, 2, 2)` = 13 − 4 − 8 + 3 = 4, matching the hand sum.

**Touches row 0 and column 0:** `sumRegion(0, 0, 2, 0)` = `prefix[3][1]` − `prefix[0][1]` − `prefix[3][0]` + `prefix[0][0]` = 8 − 0 − 0 + 0 = 8. The padding supplied three zeros.

**Single cell:** `sumRegion(1, 2, 1, 2)` = 6 − 4 − 6 + 2 = −2, the cell itself.

**1 × 1 grid** `[[7]]`: `prefix = [[0, 0], [0, 7]]`; `sumRegion(0, 0, 0, 0)` = 7 − 0 − 0 + 0 = 7.

**Single row** `[[1, 2, 3, 4]]`, `sumRegion(0, 1, 0, 2)`: `prefix[1] = [0, 1, 3, 6, 10]`, so 6 − 0 − 1 + 0 = 5 = 2 + 3. A single column behaves the same way with the roles swapped.

**Overflow boundary:** a 200 × 200 grid of 10^4, whole-grid query: `prefix[200][200]` = 4 × 10^8, returned as is.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1–2 min | Sizes, number of queries, inclusive corners, immutability, value range |
| Brute force and the 1D idea | 2 min | Say brute force and its total cost; per-row prefix sums |
| Derive the 2D formula | 3–4 min | Define P precisely, draw C / A / L / Q, derive build and query |
| Code | 3–4 min | Padded table, build loop, one-line query |
| Test | 3 min | Interior query, a query on row 0, a single cell, overflow bound |
| Follow-ups | rest | Updates (Fenwick tree), 3D, sparse grids |

Most of the time should go into the derivation. The code is ten lines; the signs and the `+1`s are where people lose the problem. If the formula will not come, draw a 3 × 3 grid, shade the four corner rectangles, and count how many times each region is included.

## 9. Interviewer challenges

### About the design

#### Why is the table (m + 1) × (n + 1) instead of m × n?

**What they are testing:** whether the padding is a deliberate choice or a memorized trick.

**How to reason:** look at the query formula with `row1 = 0`. It needs "the sum of the rows above row 0", which is empty.

**What I say:** "Index i in the table means 'the first i rows', so index 0 means zero rows, sum 0. That makes the strips above row 0 and left of column 0 real entries that hold 0, and the formula works for every query without branches. With an m × n table I'd need a bounds check on three of the four terms in the query and on three terms in the build."

**Nuance:** the cost is one extra row and column, 401 extra `int`s at the limits. The same convention (`prefix[0] = 0`) is what makes 1D prefix sums clean.

#### Why do you add `prefix[row1][col1]` back?

**What they are testing:** whether you can justify the inclusion–exclusion sign instead of reciting it.

**How to reason:** count how many times the top-left block C appears in each term.

**What I say:** "C is in the big rectangle once. It's also in the strip above and in the strip to the left, so subtracting both strips removes it twice. Net: minus once. Adding `prefix[row1][col1]`, which is exactly C, brings it back to zero, which is what it should be because C is outside the query."

**Nuance:** if C is empty (`row1 = 0` or `col1 = 0`), the term is a padding zero, and the argument still holds.

### About complexity

#### Can the preprocessing or the query be faster?

**What they are testing:** knowing when to stop.

**How to reason:** a query can't be cheaper than O(1). For preprocessing, ask what happens if a cell is never read.

**What I say:** "Queries are O(1), which is the floor. Preprocessing is O(mn), and in the worst case that's necessary: if I skipped a cell, a query covering it could not know its value. So there's an Ω(mn) worst-case lower bound, and this solution matches it."

**Nuance:** if only a handful of queries ever arrive, brute force does less total work; preprocessing pays off once q times the average area exceeds about mn.

#### Can any of these sums overflow?

**What they are testing:** whether you check numeric ranges from the constraints.

**How to reason:** the largest stored value is the whole-grid sum at the extreme values; then check each intermediate result of the formulas.

**What I say:** "The largest table entry in absolute value is 200 × 200 × 10^4 = 4 × 10^8. The query's running partial results reach at most 1.6 × 10^9 in absolute value, still under 2.147 × 10^9. So `int` is safe. With a bigger grid or bigger values I'd switch the table to `long`."

**Nuance:** in Java an `int` overflow wraps silently instead of throwing, so an overflowing build would return wrong answers without any error. Here it cannot happen, which is why the bound is worth saying out loud.

## 10. Follow-up questions the interviewer might ask

**"What if cells can be updated between queries?"**
A prefix table would need O(mn) work per update. A 2D [[a12-fenwick|Fenwick tree]] supports both a point update and a corner-rectangle sum in O(log m · log n), and a query is the same four-term inclusion–exclusion over its prefix sums. A 2D [[a12-segment-trees|segment tree]] also works but is more code. If updates are rare, the per-row prefix sums of Approach 2 are a simple middle ground: an update rebuilds one row in O(n), a query is O(m).

**"What if many rectangles are each increased by a value, and you only read the grid at the end?"**
That is the reverse problem: use a 2D difference array. Each rectangle update touches four corner cells in O(1), and one 2D prefix-sum pass at the end recovers the grid in O(mn). See [[a2-difference-arrays|Difference Arrays]].

**"What about a 3D grid?"**
The same idea with inclusion–exclusion over eight corners: a box query adds and subtracts the eight corner prefix values with alternating signs, and the build combines seven neighbours. O(1) per query, O(xyz) preprocessing and space.

**"What if the grid is 10^5 × 10^5 but has only a few thousand non-zero cells?"**
A dense table no longer fits in memory. Store the non-zero points sorted by row and answer queries offline with a sweep over rows plus a Fenwick tree over (compressed) columns: O((p + q) log p) for p points and q queries.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Stopping at per-row prefix sums.** They are fast enough for these limits, but they do not meet the stated O(1) per query. Say so and take the last step.
- **Reciting the formula without the picture.** If the interviewer changes the question (a 3D box, a strip only), a memorized four-term formula does not adapt. Derive it from the C / A / L / Q regions.
- **Not checking overflow.** The answer here is that `int` is safe, but the interviewer wants to hear the 4 × 10^8 calculation, not an assumption.

### Implementation mistakes

> [!MISTAKE] Forgetting to add the corner back
> Returning `prefix[row2+1][col2+1] - prefix[row1][col2+1] - prefix[row2+1][col1]` makes `sumRegion(1, 1, 2, 2)` on the example return 13 − 4 − 8 = 1 instead of 4: the block `prefix[1][1] = 3` was subtracted twice.

> [!MISTAKE] Mixing inclusive and exclusive indices
> Using `prefix[row2][col2]` for the bottom-right term (no `+1`) drops the query's last row and last column. On the example, `sumRegion(1, 1, 2, 2)` then returns `prefix[2][2] - prefix[1][2] - prefix[2][1] + prefix[1][1]` = 6 − 2 − 3 + 3 = 4 by coincidence, but `sumRegion(0, 0, 2, 2)` returns `prefix[2][2]` = 6 instead of 13. One coincidental match is why the whole-grid query belongs in the tests.

- **An unpadded table without bounds checks.** `prefix[row1 - 1][…]` throws `ArrayIndexOutOfBoundsException` for `row1 = 0`, the first time a query touches the top row.
- **Building in the wrong order.** The build reads the entry above and the entry to the left; filling the table in any order where those are not yet computed gives wrong sums. Row by row, left to right, is the natural order.
- **Writing the prefix sums into the caller's array.** It works, but it modifies an input the caller may still use, and the brute-force approaches on the same object would then read prefix sums instead of cells.

## 12. Pattern recognition

**The pattern:** precomputed prefix sums answer static range-sum queries in O(1); in two dimensions, combine four corner prefix rectangles by inclusion–exclusion.

**Signals in the problem statement:**

- Many sum queries over ranges or rectangles of data that does not change.
- A requirement of O(1) per query, or a query count large enough that per-query scanning is too slow.
- "Immutable" in the title: no updates, so a table built once never goes stale.

**Related problems in this list:**

- [[cses-static-range-sum-queries|Static Range Sum Queries]] (CSES): the one-dimensional version, with sums that need `long`.
- [[cses-forest-queries|Forest Queries]] (CSES): the same 2D prefix-sum query, counting trees in a grid.
- [[cses-forest-queries-ii|Forest Queries II]] (CSES): the same with cell updates, which needs a 2D Fenwick tree.
- [[nc-product-of-array-except-self|Product of Array Except Self]]: precomputed prefix and suffix products instead of sums.
- [[nc-subarray-sum-equals-k|Subarray Sum Equals K]]: a range sum is a difference of two prefix sums, combined with a hash map to count ranges.

**Takeaway:** if the same kind of range query is asked many times on unchanging data, precompute "everything up to here" once, and answer each range as a difference of prefixes; in 2D, the four corners and the add-back term.

## 13. 60-second revision card

**Key insight:** `P[i][j]` = sum of the top-left i × j block. Any rectangle = big block − block above − block to the left + the corner subtracted twice.

**Invariant:** `P[i][j]` = Σ `matrix[r][c]` for r < i, c < j; row 0 and column 0 are zeros (empty blocks).

**Complexity:** O(mn) construction, O(1) per query, O(mn) space. Both optimal (Ω(mn) worst case to read the grid).

**Code skeleton:**

```java title="2D prefix sums, padded"
class NumMatrix {
    private final int[][] p;

    public NumMatrix(int[][] a) {
        p = new int[a.length + 1][a[0].length + 1];
        for (int i = 0; i < a.length; i++)
            for (int j = 0; j < a[0].length; j++)
                p[i + 1][j + 1] = a[i][j] + p[i][j + 1] + p[i + 1][j] - p[i][j];
    }

    public int sumRegion(int r1, int c1, int r2, int c2) {
        return p[r2 + 1][c2 + 1] - p[r1][c2 + 1] - p[r2 + 1][c1] + p[r1][c1];
    }
}
```

**Main traps:**

- Add the corner `p[r1][c1]` back; it was subtracted twice.
- `+1` on the bottom-right indices only.
- Pad the table so row 0 and column 0 need no branch.
- Max |sum| = 4 × 10^8: `int` is safe here, `long` for bigger inputs.

**What to say in one breath:** "Brute force is O(mn) per query. I precompute P[i][j], the sum of the top-left i-by-j block, with a zero row and column for padding, in O(mn). A query is the big block minus the block above minus the block to the left plus the top-left corner I subtracted twice: O(1). Sums stay under 4 × 10^8, so int is fine."
