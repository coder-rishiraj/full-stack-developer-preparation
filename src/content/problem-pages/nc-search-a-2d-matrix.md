---
problemId: nc-search-a-2d-matrix
title: Search a 2D Matrix
source: neetcode
sourceUrl: https://leetcode.com/problems/search-a-2d-matrix/
difficulty: medium
patterns: [binary-search]
relatedLessons: [a3-binary-search, a2-matrix, a3-lower-upper-bounds, a14-edge-cases, a14-manual-testing]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

You get a grid of integers with `m` rows and `n` columns, and a `target`. The grid has two ordering rules: each row is sorted in non-decreasing order from left to right, and each row's first value is greater than the last value of the row above it. Return `true` if `target` appears anywhere in the grid, and `false` otherwise. The statement also sets a requirement on the method: it must run in O(log(m · n)) time.

**Example 1**

- Input: `matrix = [[2, 5, 8, 11], [14, 17, 19, 23], [30, 34, 40, 45]]`, `target = 19`
- Output: `true`
- Why: 19 sits in row 1, column 2 (counting from 0).

**Example 2**

- Input: the same matrix, `target = 13`
- Output: `false`
- Why: 13 is larger than 11, the end of row 0, and smaller than 14, the start of row 1. Because of the second rule, no row can contain it.

**What the problem statement guarantees**

- Each row is sorted in non-decreasing order.
- Each row's first value is greater than the previous row's last value.
- 1 ≤ `m`, `n` ≤ 100, and every row has `n` values.
- −10^4 ≤ every value, `target` ≤ 10^4.
- The solution must run in O(log(m · n)) time.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 15 minutes and talk out loud.
2. Read the grid of Example 1 row by row, left to right, and write the twelve numbers on one line. Say what you notice about that line.
3. State the time requirement as a number of steps for a 100 × 100 grid, and check every idea you have against it.
4. Write the code and trace Example 1 and Example 2.

Open a hint only after two minutes without progress.

> [!HINT] Hint 1: a small nudge
> The two ordering rules together say more than "each row is sorted". If you read the grid row after row, what kind of sequence do you get?

> [!HINT] Hint 2: the kind of tool you need
> The grid read row after row is one sorted list of m · n numbers. The required running time is the one you get from halving a sorted range at every step.

> [!HINT] Hint 3: almost the whole plan
> Search positions 0 to m · n − 1 of that imaginary list, without building it. To read position p, convert it to a cell: row `p / n`, column `p % n`. Compare the value there with the target and keep the half that can still contain it.

**Check yourself before revealing the walkthrough**

- [ ] I can say why the whole grid behaves like one sorted list
- [ ] I divide and take the remainder by the number of columns, not rows, and can say why
- [ ] My code returns `true` for Example 1 and `false` for Example 2
- [ ] I tried a 1 × 1 grid, a single row and a single column

## 3. Interview script: understand the problem (≈2 min)

**Me:** So every row is sorted left to right, and every row starts above where the previous one ended. I return whether the target is somewhere in the grid. Just a boolean, not the position?

**Interviewer:** Just the boolean.

**Me:** "Sorted" here is non-decreasing, so a row could contain equal values, like `[3, 3, 4]`. But between rows it is strictly greater, so a value can repeat only inside one row.

**Interviewer:** Right.

**Me:** And the requirement is O(log(m · n)). With m and n up to 100 there are at most 10^4 cells, so about 14 comparisons. Anything that walks a row or a column fails the requirement, even though it would be fast in practice.

**Interviewer:** Yes, we want the logarithmic one.

**Me:** Let me do Example 1 by hand. Reading row 0, then row 1, then row 2 gives `2, 5, 8, 11, 14, 17, 19, 23, 30, 34, 40, 45`. That is a single sorted sequence: inside a row by the first rule, and across a row break by the second. So 19 is position 6 of a sorted list of 12. That suggests treating the whole grid as one sorted array.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| Rows non-decreasing, each row starts above the previous row's end | Read row by row, the grid is one sorted sequence of m · n values. That is the property every fast approach uses. |
| O(log(m · n)) time required | Rules out scanning cells, and also rules out walks of length m + n. |
| 1 ≤ m, n ≤ 100 | m · n ≤ 10^4, so a flat index fits easily in an `int`; at most ⌊log₂ 10^4⌋ + 1 = 14 probes. Neither dimension can be 0, so `matrix[0]` always exists. |
| −10^4 ≤ values, target ≤ 10^4 | Comparisons cannot overflow. A target outside the grid's range must still return `false`. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Return only whether the target exists | I can stop at the first match; with duplicates inside a row any matching cell will do. |
| The logarithmic bound is required | The O(m + n) staircase walk is not an acceptable final answer here. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The matrix is read-only | I only read it; no approach needs to modify it. |
| All rows have the same length n | The statement says the matrix is m × n; the flat-index conversion `p / n`, `p % n` depends on it. |

### Edge cases I will keep in mind

- A 1 × 1 grid, with the target present and absent.
- A single row (1 × n) and a single column (m × 1).
- A target smaller than the first value, or larger than the last.
- A target that falls between the end of one row and the start of the next.
- The first and last cells of the grid.

## 4. Think out loud: from first idea to best solution

The certainly-correct baseline is to check every cell: O(m · n), up to 10^4 comparisons. It ignores both ordering rules, so I only mention it.

### Approach 1: Staircase walk from the top-right corner

#### What I say out loud

> "A first idea that uses the sorting: start at the top-right corner. If that value is bigger than the target, the whole column below it is bigger too, so I can drop the column and move left. If it's smaller, the whole row to its left is smaller, so I drop the row and move down. Each step removes a row or a column, so it's at most m + n steps."

> "That's 200 steps instead of 10^4, but it's O(m + n), not O(log(m · n)). It only uses 'rows are sorted and columns are sorted'. It never uses the stronger rule that each row starts above the previous row's end. That unused rule is a sign there is something better."

#### Intuition

The top-right cell is the largest of its row and the smallest of its column (within the rows still in play). Comparing the target with it discards a whole row or a whole column. This is the standard answer to "Search a 2D Matrix II", where only rows and columns are sorted.

#### Algorithm

1. Start at `r = 0`, `c = n − 1`.
2. While `r < m` and `c ≥ 0`: if `matrix[r][c] == target`, return `true`; if it is larger, `c−−`; otherwise `r++`.
3. Return `false`.

#### Why it is correct

**The invariant:** if the target is in the grid, it is in the sub-grid of rows `r..m−1` and columns `0..c`.

- **Moving left.** If `matrix[r][c] > target`, every cell below it in column c is at least as large (columns are sorted here, because each row starts above the previous row's end), so column c holds no copy of the target in rows `r..m−1`.
- **Moving down.** If `matrix[r][c] < target`, every cell to its left in row r is at most as large, so row r holds no copy in columns `0..c`.
- **The result.** It returns `true` only on an equal value. Each step removes a row or a column, so after at most m + n − 1 steps the sub-grid is empty, and the invariant then says the target is absent.

#### Dry run

Example 2's matrix, `target = 13`:

| r | c | matrix[r][c] | Comparison | Action |
|---|---|---|---|---|
| 0 | 3 | 11 | 11 < 13 | `r = 1` |
| 1 | 3 | 23 | 23 > 13 | `c = 2` |
| 1 | 2 | 19 | 19 > 13 | `c = 1` |
| 1 | 1 | 17 | 17 > 13 | `c = 0` |
| 1 | 0 | 14 | 14 > 13 | `c = −1`, return `false` |

Five steps on a 3 × 4 grid. For 19 it takes three: 11, 23, 19.

#### Java code

```java title="Approach 1: staircase walk (O(m + n), fails the stated requirement)"
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int r = 0;
        int c = matrix[0].length - 1;
        while (r < matrix.length && c >= 0) {
            int v = matrix[r][c];
            if (v == target) {
                return true;
            }
            if (v > target) {
                c--;          // everything below in this column is too large
            } else {
                r++;          // everything to the left in this row is too small
            }
        }
        return false;
    }
}
```

#### Time complexity

**O(m + n) in the worst case**: each iteration removes a row or a column, so there are at most m + n − 1 iterations, each O(1). At the limits that is 199 steps, fast in practice, but it does not meet the required O(log(m · n)).

#### Space complexity

**O(1) auxiliary space**: two indices.

#### The bridge to the next approach

> "The walk ignores the strongest fact I have. Because each row starts above the previous row's end, the first column alone tells me which row the target must be in: the last row whose first value is at most the target, or more simply the row whose first and last values bracket it. The first column is sorted, so I can binary search for that row, and then binary search inside it."

### Approach 2: Binary search for the row, then within the row

#### What I say out loud

> "Two binary searches. First over the rows: for a middle row, if the target is below its first value, the target is in an earlier row; if it's above its last value, a later row; otherwise this is the only row that can hold it. Then a normal binary search inside that row. If the row search runs out, the target falls before the first row, after the last one, or in a gap between two rows, and I return false."

#### Intuition

The rows form sorted, non-overlapping intervals `[first, last]`, in increasing order. Finding the interval that contains the target is a binary search over m intervals, and the search inside the interval is a binary search over n values. Both use the closed-range template from [[nc-binary-search|Binary Search]].

#### Algorithm

1. `lo = 0`, `hi = m − 1`. While `lo ≤ hi`: `mid = lo + (hi − lo) / 2`.
   - If `target < matrix[mid][0]`, set `hi = mid − 1`.
   - Else if `target > matrix[mid][n − 1]`, set `lo = mid + 1`.
   - Else binary search `matrix[mid]` for the target and return the result.
2. Return `false`.

#### Why it is correct

- **Row search invariant:** if the target is in the grid, its row is in `[lo, hi]`. If `target < matrix[mid][0]`, then row mid and every later row start at or above `matrix[mid][0]`, which is greater than the target, so `hi = mid − 1` keeps the invariant. The case `target > matrix[mid][n − 1]` is the mirror image: row mid and every earlier row end below the target.
- **The chosen row is the only candidate.** If `matrix[mid][0] ≤ target ≤ matrix[mid][n − 1]`, every earlier row ends below `matrix[mid][0]` and every later row starts above `matrix[mid][n − 1]`, so no other row can contain the target. Searching row mid alone is enough.
- **An empty row range means absent.** The invariant then says "the target's row is in an empty range", so the target is not in the grid.
- **The row search inside** is the standard closed-range binary search, correct by the invariant from [[nc-binary-search|Binary Search]].

#### Dry run

Example 1's matrix, `target = 19`:

| Phase | lo | hi | mid | Values seen | Action |
|---|---|---|---|---|---|
| Rows | 0 | 2 | 1 | first 14, last 23 | 14 ≤ 19 ≤ 23: search row 1 |
| Row 1 | 0 | 3 | 1 | 17 | 17 < 19, `lo = 2` |
| Row 1 | 2 | 3 | 2 | 19 | equal, return `true` |

`target = 13`: rows `[0, 2]`, mid 1 has first value 14 > 13, so `hi = 0`; mid 0 has last value 11 < 13, so `lo = 1`; the range is empty, return `false` without searching any row.

#### Java code

```java title="Approach 2: binary search the rows, then the row"
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int n = matrix[0].length;
        int lo = 0;
        int hi = matrix.length - 1;          // the target's row, if any, is in [lo, hi]
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (target < matrix[mid][0]) {
                hi = mid - 1;                // this row and all later rows start too high
            } else if (target > matrix[mid][n - 1]) {
                lo = mid + 1;                // this row and all earlier rows end too low
            } else {
                return inRow(matrix[mid], target);
            }
        }
        return false;                        // before the first row, after the last, or in a gap
    }

    private boolean inRow(int[] row, int target) {
        int lo = 0;
        int hi = row.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (row[mid] == target) {
                return true;
            }
            if (row[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return false;
    }
}
```

#### Time complexity

**O(log m + log n) = O(log(m · n)) in the worst case.** The row search takes at most ⌊log₂ m⌋ + 1 iterations and the search inside a row at most ⌊log₂ n⌋ + 1, each O(1). For 100 × 100 that is at most 7 + 7 = 14 probes. It meets the requirement, since log m + log n = log(m · n).

#### Space complexity

**O(1) auxiliary space**: a few indices.

#### The bridge to the next approach

> "This works, but it's two loops with two different decisions, which is two chances for an off-by-one. Since the grid read row by row is one sorted list of m · n values, I could run a single binary search over positions 0 to m · n − 1. I don't need to build the list: position p is row p / n, column p % n."

### Approach 3: One binary search over the flattened index (recommended)

#### What I say out loud

> "I'll pretend the grid is a single sorted array of length m · n, where position p lives at row p / n and column p % n. Then it's exactly the closed-range binary search: `lo = 0`, `hi = m · n − 1`, look at the middle position, compare, and keep the half that can still hold the target. n here is the number of columns, because each row holds n consecutive positions."

#### Intuition

Reading row by row, position p = r · n + c. Integer division by n recovers r, and the remainder recovers c. The two ordering rules make the sequence of positions sorted, so the matrix is a sorted array stored in rows, and [[a3-binary-search|binary search]] applies to it directly.

#### Algorithm

1. `lo = 0`, `hi = m · n − 1`.
2. While `lo ≤ hi`:
   1. `mid = lo + (hi − lo) / 2`, and `v = matrix[mid / n][mid % n]`.
   2. If `v == target`, return `true`.
   3. If `v < target`, set `lo = mid + 1`; otherwise set `hi = mid − 1`.
3. Return `false`.

#### Why it is correct

**The mapping is a bijection.** Position p in `[0, m · n − 1]` maps to row `p / n` in `[0, m − 1]` and column `p % n` in `[0, n − 1]`, and different positions map to different cells (p = r · n + c undoes it). So searching positions is searching cells.

**The flattened sequence is sorted.** Consecutive positions are either neighbours in a row (non-decreasing by the first rule) or the end of one row and the start of the next (strictly increasing by the second rule).

**The invariant:** if the target is in the grid, its position is in `[lo, hi]`. It holds at the start (all positions); `v < target` means every position at or before mid holds a value at most v, so `lo = mid + 1` keeps it; `v > target` is the mirror image. Each iteration shrinks the range, it returns `true` only on an equal value, and an empty range means absent.

**The 20-second version to say to the interviewer:**

> "The two rules make the grid, read row by row, one sorted list of m times n values. Position p is the cell at row p over n, column p mod n, so I binary search positions 0 to m·n − 1 without building anything. Invariant: if the target exists, its position is in [lo, hi]. Each comparison drops half; an empty range means it's absent. That's at most 14 probes for a 100 by 100 grid."

#### Dry run

Example 1's matrix (n = 4), `target = 19`:

| lo | hi | mid | Cell (mid / 4, mid % 4) | Value | Action |
|---|---|---|---|---|---|
| 0 | 11 | 5 | (1, 1) | 17 | 17 < 19, `lo = 6` |
| 6 | 11 | 8 | (2, 0) | 30 | 30 > 19, `hi = 7` |
| 6 | 7 | 6 | (1, 2) | 19 | equal, return `true` |

`target = 13`:

| lo | hi | mid | Cell | Value | Action |
|---|---|---|---|---|---|
| 0 | 11 | 5 | (1, 1) | 17 | 17 > 13, `hi = 4` |
| 0 | 4 | 2 | (0, 2) | 8 | 8 < 13, `lo = 3` |
| 3 | 4 | 3 | (0, 3) | 11 | 11 < 13, `lo = 4` |
| 4 | 4 | 4 | (1, 0) | 14 | 14 > 13, `hi = 3` |
| 4 | 3 | | | | empty, return `false` |

The search ends with `lo = 4`, the position just after row 0, which is where 13 would be inserted: the gap between the rows is handled with no special case.

#### Java code

```java title="Approach 3: one binary search over the flattened index (recommended)"
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int n = matrix[0].length;              // columns: each row holds n consecutive positions
        int lo = 0;
        int hi = matrix.length * n - 1;        // m * n <= 10^4, no overflow
        while (lo <= hi) {                     // invariant: target, if present, is at a position in [lo, hi]
            int mid = lo + (hi - lo) / 2;
            int v = matrix[mid / n][mid % n];
            if (v == target) {
                return true;
            }
            if (v < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return false;
    }
}
```

#### Time complexity

**O(log(m · n)) in the worst case**: at most ⌊log₂(m · n)⌋ + 1 iterations, each with one division, one remainder and two comparisons. For 100 × 100 that is at most 14.

#### Space complexity

**O(1) auxiliary space**: a few indices. Nothing is copied.

## 5. Comparison table

m = rows, n = columns. No hashing or randomness, so expected and worst case agree.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Scan every cell (prose only) | O(m · n) | O(m · n) | O(1) |
| 1. Staircase walk | O(m + n) | O(m + n) | O(1) |
| 2. Row search, then row | O(log m + log n) | O(log m + log n) | O(1) |
| 3. Flattened index | O(log(m · n)) | O(log(m · n)) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Scan every cell | Needs no ordering | Ignores both rules; fails the requirement | Never here |
| 1. Staircase | Short; needs only sorted rows and sorted columns | O(m + n) fails the stated requirement | "Search a 2D Matrix II", where rows do not continue each other |
| 2. Two searches | No multiplication, so no risk of m · n overflowing; adapts to rows of different lengths by reading each row's own last cell | Two loops and two sets of boundaries | Very large grids or ragged rows |
| 3. Flattened index | One standard loop; the shortest correct code | Needs equal row lengths, and m · n must fit in the index type | The default answer |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** the single binary search over the flattened index (Approach 3). It meets the requirement with the least code and reuses a template the interviewer already trusts.

**Is it optimal?** For algorithms that only compare the target with cells, yes up to a constant factor: the standard decision-tree argument for searching a sorted list of N values gives an Ω(log N) worst-case lower bound, and here N = m · n. Approach 2 and Approach 3 do the same number of probes up to a constant, so the choice between them is about simplicity, not speed.

**When another is better:** Approach 2 if the grid could be huge (m · n beyond `Integer.MAX_VALUE` would need a `long` index in Approach 3) or if rows had different lengths. The staircase only if the interviewer drops the second ordering rule.

**When to stop:** once the flat search is coded and traced on a hit, a miss in a row gap and a target outside the range. There is nothing further to optimize.

## 7. Interview script: code it and test it

### What I say while coding

> "n is the number of columns, `matrix[0].length`. Every row has n cells, so position p is row p / n and column p % n. Dividing by the number of rows instead is the classic slip; it only shows up on non-square grids."

> "`hi` starts at m · n − 1, the last valid position. With m and n up to 100, m · n is at most 10^4, no overflow."

> "The loop is the closed-range template: `lo <= hi`, and both branches move past mid."

### Testing out loud

**Normal case, Example 1:** probes 17, 30, 19, returns `true` (table above).

**Miss in a row gap, Example 2:** probes 17, 8, 11, 14, the range empties at `lo = 4`, returns `false`.

**Target below everything:** `target = 1`. Probes 17 (position 5), 8 (position 2), 2 (position 0); then `hi = −1`, return `false`.

**Target above everything:** `target = 50`. Probes 17, 30, 40, 45 (positions 5, 8, 10, 11); then `lo = 12`, return `false`. The last probe is position 11, the last cell, so `hi = m · n − 1` was exactly right; starting at m · n would read row 3 and throw.

**First and last cells:** `target = 2` is found at position 0 on the third probe; `target = 45` at position 11 on the fourth.

**1 × 1:** `[[5]]`, `lo = hi = 0`, one probe. Target 5 returns `true`; target 4 sets `hi = −1` and returns `false`.

**Single column:** `[[1], [3], [5]]`, n = 1, so position p is row p, column 0. Target 3: probe position 1, value 3, `true`. Target 4: probes 3 then 5, returns `false`.

**Single row:** `[[1, 3, 5, 7, 9]]`, m = 1: the search is a plain binary search over the row, and every `mid / n` is 0.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 2 min | Both ordering rules, the required bound, boolean answer |
| Notice the flattened order | 1–2 min | Read Example 1 row by row; mention the staircase and why it is not enough |
| Code | 3–4 min | The flat-index binary search |
| Trace and edge cases | 3 min | Hit, row-gap miss, below and above the range, 1 × 1, single column |
| Complexity and follow-ups | the rest | O(log(m · n)), Approach 2, Matrix II |

**Where the time should go:** on the observation that the two rules make one sorted list, and on the index conversion. The search itself is the template from [[nc-binary-search|Binary Search]].

**If stuck:** write the first example's values on one line. Once it is visibly sorted, the question is only how to read position p without building the list.

## 9. Interviewer challenges

### About correctness

#### Why divide by the number of columns and not the number of rows?

**What they are testing:** whether the index conversion is understood or memorised.

**How to reason:** a row holds n consecutive positions, so the row number counts how many full rows of n fit before p.

**What I say:** "Position p is r times n plus c, with c less than n, because each row contributes n positions. So p / n is r and p % n is c. Dividing by m only works on square grids. On Example 1's 3 × 4 grid it maps position 3 to (1, 0) instead of (0, 3), so the code reports 11 as missing, and for target 45 it reads row 3 and throws an index exception."

**Nuance:** testing only square grids hides this bug, which is why a single row, a single column and a non-square grid belong in the test list.

#### Does the staircase walk meet the requirement?

**What they are testing:** whether you check an approach against the stated bound rather than against "fast enough".

**How to reason:** count its steps as a function of m and n, and compare with log(m · n).

**What I say:** "No. It takes up to m + n − 1 steps, about 200 at the limits, against about 14 for the binary search. It's correct, and it's the right answer to Search a 2D Matrix II, where rows don't continue each other. But it doesn't use the rule that each row starts above the previous one, which is what makes a logarithmic search possible here."

**Nuance:** with only sorted rows and sorted columns, a logarithmic bound is not achievable in general. In an n × n grid the n cells of the anti-diagonal are not ordered relative to each other by those two rules, so an adversary can keep the target "possibly in" any anti-diagonal cell not yet probed, which gives an Ω(n) worst-case lower bound. That is why Matrix II settles for O(m + n).

### About complexity

#### Is two binary searches slower than one?

**What they are testing:** whether you can compare bounds precisely instead of by appearance.

**How to reason:** add the iteration counts.

**What I say:** "No. log m + log n equals log(m · n), so both are O(log(m · n)). At 100 × 100 the row-then-column search takes at most 7 + 7 probes, and the flat search at most 14. I prefer the flat one only because it's one loop."

**Nuance:** Approach 2 has a real advantage when m · n would overflow an `int` index, or when rows have different lengths, where the flat mapping no longer exists.

## 10. Follow-up questions the interviewer might ask

**"What if rows are sorted and columns are sorted, but a row does not have to start above the previous row's end?"**
That is Search a 2D Matrix II. The grid is no longer one sorted list, so use the staircase walk (Approach 1): O(m + n) time, O(1) space.

**"What if you need the position, or the first occurrence when rows contain duplicates?"**
Return `(mid / n, mid % n)` on a match. For the first occurrence, use the lower-bound form of the search: start with `hi = m · n`, loop while `lo < hi`, on `v >= target` set `hi = mid`, else `lo = mid + 1`; then the answer is `lo` if `lo < m · n` and that cell equals the target. Still O(log(m · n)).

**"What if the grid were 10^5 × 10^5?"**
m · n = 10^10 overflows an `int`. Use a `long` for `lo`, `hi` and `mid`, casting the row and column back to `int`, or use Approach 2, which never multiplies. O(log(m · n)) either way.

**"What if you must count how many values are at most the target?"**
Find the first position whose value exceeds the target with the same flat search (upper bound); that position is the count. O(log(m · n)).

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Treating the rows as independent.** Binary searching every row is O(m log n) and misses that the first column already identifies the only candidate row.
- **Offering the staircase as the final answer.** It is correct, but O(m + n) breaks the stated O(log(m · n)) requirement.
- **Forgetting the gaps between rows.** In Approach 2, a target can lie after one row's end and before the next row's start. If the row search does not handle that, it searches a wrong row or reads outside the grid.

### Implementation mistakes

> [!MISTAKE] Dividing by the number of rows
> `matrix[mid / m][mid % m]` is correct only when m = n. On Example 1's 3 × 4 grid, the search for 11 returns `false`, and the search for 45 throws `ArrayIndexOutOfBoundsException`.

> [!MISTAKE] Starting `hi` at m · n
> With `lo <= hi`, `hi = m * n` makes position m · n reachable. For a target above every value, such as 50 in Example 1, it reads row m and throws `ArrayIndexOutOfBoundsException`.

- **Using `n = matrix.length`.** That is the number of rows; the column count is `matrix[0].length`.
- **Mixing templates.** `hi = mid` with `while (lo <= hi)` loops forever once `lo == hi` and the value is larger than the target. Pick the closed-range form and move past mid on both sides.

## 12. Pattern recognition

**The pattern:** binary search over a virtual sorted array. When data is stored in some shape (a grid, rows of a table, blocks) but its elements, read in a fixed order, form a sorted sequence, search positions in that order and convert each position to a location only when you read it.

**Signals in the problem statement:**

- "Each row is sorted, and each row starts after the previous one ends."
- A required logarithmic bound on a two-dimensional structure.
- An index conversion between a flat position and coordinates is available in O(1).

**Related problems in this list:**

- [[nc-binary-search|Binary Search]]: the closed-range template this page reuses, with its invariant.
- [[nc-search-insert-position|Search Insert Position]]: what `lo` means when the search ends without a match.
- [[nc-find-minimum-in-rotated-sorted-array|Find Minimum in Rotated Sorted Array]]: another array that is sorted in pieces, searched without being rebuilt.
- [[nc-median-of-two-sorted-arrays|Median of Two Sorted Arrays]]: a search over a virtual merged order of two arrays.

**Takeaway:** before searching a structure, ask what order its elements are in when read the right way. If that order is sorted and positions convert to locations in O(1), it is a plain binary search.

## 13. 60-second revision card

**Key insight:** the two ordering rules make the grid, read row by row, one sorted list of m · n values; position p is the cell `(p / n, p % n)`, with n the number of columns.

**Invariant:** if the target is in the grid, its flat position is in `[lo, hi]`.

**Complexity:** O(log(m · n)) time, at most 14 probes for 100 × 100; O(1) auxiliary space.

**Code skeleton:**

```java title="Search a 2D Matrix, flattened binary search" fragment="public boolean searchMatrix(int[][] matrix, int target)"
int n = matrix[0].length, lo = 0, hi = matrix.length * n - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2, v = matrix[mid / n][mid % n];
    if (v == target) return true;
    if (v < target) lo = mid + 1; else hi = mid - 1;
}
return false;
```

**Main traps:**

- Divide and take the remainder by the number of columns, `matrix[0].length`.
- `hi = m · n − 1`, not m · n.
- The staircase walk is O(m + n): correct, but it fails this problem's requirement.

**What to say in one breath:** "Read row by row, the grid is one sorted list, so I binary search positions 0 to m·n − 1 and read position p at row p / n, column p % n: O(log(m · n)) time, O(1) space."
