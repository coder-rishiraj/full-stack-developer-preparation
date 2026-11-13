---
problemId: nc-valid-sudoku
title: Valid Sudoku
source: neetcode
sourceUrl: https://leetcode.com/problems/valid-sudoku/
difficulty: medium
patterns: [arrays-hashing, hashing]
relatedLessons: [a2-hashing, a2-matrix, a1-hashset, a13-bitmasking, a14-clarifying-requirements]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

You get a 9 × 9 Sudoku board, partly filled. Each cell holds a digit from `'1'` to `'9'` or a `'.'` for an empty cell. Decide whether the filled cells break any Sudoku rule: no digit may appear twice in the same row, in the same column, or in the same one of the nine 3 × 3 boxes. Empty cells are ignored. You do not have to solve the puzzle, and a board can be valid even if it has no solution.

**Example 1**

```text
8 . . | . . 3 | . . .
. . 4 | . . . | . 9 .
. 6 . | 2 . . | . . 1
------+-------+------
. . . | . 7 . | 5 . .
3 . . | . . . | . . 8
. . 9 | . 1 . | . . .
------+-------+------
1 . . | . . 8 | . 4 .
. 5 . | . . . | 6 . .
. . . | 9 . . | . . 2
```

- Output: `true`
- Why: no row, column or box contains the same digit twice. For instance, column 0 holds 8, 3 and 1, and the top-left box holds 8, 4 and 6.

**Example 2**

The same board with a `4` added at row 2, column 0 (rows and columns numbered from 0):

```text
8 . . | . . 3 | . . .
. . 4 | . . . | . 9 .
4 6 . | 2 . . | . . 1
------+-------+------
...   (rows 3 to 8 as in Example 1)
```

- Output: `false`
- Why: the top-left box now holds two 4s, at row 1, column 2 and at row 2, column 0. Row 2 has only one 4 and so does column 0; the box rule alone makes the board invalid.

**What the problem statement guarantees**

- `board.length == 9` and `board[i].length == 9`.
- Every cell is a digit `'1'` to `'9'` or `'.'`.
- Only filled cells are checked, and a valid board does not have to be solvable.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The problem is short, but it is easy to write three long, nearly identical loops, or to get the box arithmetic wrong.

**How to practise**

1. Set a timer for 15 minutes and talk out loud.
2. Write down the simplest correct check and what it costs.
3. Work out, on paper, how to tell from a cell's row and column which of the nine boxes it belongs to. Check your formula on the four corner cells of two different boxes.
4. Write the code, then trace it on Example 2 until it returns.

Open a hint only after two minutes without progress. After each hint, close it and try again before opening the next one.

> [!HINT] Hint 1: a small nudge
> Forget the board for a moment. How would you check whether a list of nine characters contains a digit twice? Now, how many such lists does a board have?

> [!HINT] Hint 2: the kind of tool you need
> For every row, every column and every box, you want to remember which digits you have already met there. A small structure per unit, 27 of them in total, answers "have I already seen this digit in this unit?" without rescanning.

> [!HINT] Hint 3: almost the whole plan
> Walk the board once, cell by cell. For a filled cell at row r and column c, look up three records: the one for row r, the one for column c, and the one for its box. Find a box number from 0 to 8 using integer division of r and c by 3. If the digit is already in any of the three records, the board is invalid; otherwise add it to all three.

**Check yourself before revealing the walkthrough**

- [ ] My code returns `true` for an empty board and `false` for Example 2
- [ ] My box formula puts row 0, column 3 and row 3, column 0 in different boxes
- [ ] My code ignores `'.'` cells and does not crash on a `'9'`
- [ ] I can state the complexity honestly for a fixed 9 × 9 board, and for an N × N board

## 3. Interview script: understand the problem (≈2 min)

**Me:** So the board is 9 by 9, cells are digits or dots, and I return whether the filled cells follow the three Sudoku rules: no repeated digit in any row, any column or any of the nine 3 × 3 boxes. I'm not solving it?

**Interviewer:** Right, just validate what's there.

**Me:** So if the board has no repeats but can't be completed, it's still valid?

**Interviewer:** Yes. Only the rules on the filled cells matter.

**Me:** Good, that keeps this a checking problem, not a search problem. Is the size always 9 by 9, and is every cell guaranteed to be a digit 1 to 9 or a dot?

**Interviewer:** Always 9 by 9, and yes.

**Me:** Then I can map a digit to an index with `ch - '1'` without validating it, and I don't need to handle zeros or other symbols. Can I assume the board is read-only?

**Interviewer:** Sure, don't modify it.

**Me:** Let me check one rule by hand on Example 2. The top-left box is rows 0 to 2 and columns 0 to 2. Reading it, I see 8, then 4 at row 1 column 2, then 4 at row 2 column 0, then 6. Two 4s, so it's invalid, even though row 2 and column 0 each have only one 4.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| The board is exactly 9 × 9 | The input size is fixed, so every approach runs in constant time on it. Complexity only becomes interesting for an N × N generalization, which I will state separately. |
| Cells are `'1'`–`'9'` or `'.'` | A digit maps to an index 0–8 with `ch - '1'`, so a boolean array of 9 replaces a hash set. Dots are skipped. |
| Only filled cells are checked; the board need not be solvable | I check for repeats only. No backtracking, no reasoning about empty cells. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| The board must not be modified | I keep my own records of seen digits instead of marking cells on the board. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| Boxes are the nine fixed 3 × 3 blocks starting at rows and columns 0, 3 and 6 | That is the standard rule, and it is what "3 × 3 sub-boxes" means; it is not "any 3 × 3 window". |
| The board is not `null` and has no `null` rows | The constraints fix the shape, so I do not check it. |

### Edge cases I will keep in mind

- An empty board: valid.
- A complete, correct board: valid, and every cell gets checked.
- A repeat that breaks only one rule: only the row, only the column, or only the box.
- Two equal digits in different boxes that a wrong box formula would merge, such as row 0, column 3 and row 3, column 0.
- A repeat involving the last cell, row 8, column 8, so no loop may stop early.
- A board with no repeats that cannot be solved.

## 4. Think out loud: from first idea to best solution

### Approach 1: Brute force (scan the units of every filled cell)

#### What I say out loud

> "The most direct check: for every filled cell, look at every other cell in its row, its column and its box, and see whether any of them holds the same digit. If I find one, the board is invalid."

> "That's 81 cells times about 24 other cells, a couple of thousand comparisons, which is nothing on a 9 by 9 board. But I want to see where the waste is before I write anything smarter."

#### Intuition

A board is invalid exactly when two filled cells with the same digit share a row, a column or a box. Checking each filled cell against its three units finds every such pair.

#### Algorithm

1. For each filled cell `(r, c)` with digit `d`:
2. Scan row `r` for another cell holding `d`; scan column `c` the same way.
3. Find the box's top-left corner `(3·(r/3), 3·(c/3))` and scan its nine cells, skipping `(r, c)` itself.
4. If any scan finds `d`, return `false`. If no cell finds a repeat, return `true`.

#### Why it is correct

- **It returns `false` only for a real repeat.** It returns `false` after finding a different cell with the same digit in the same row, column or box, which is a broken rule.
- **It cannot miss a repeat.** Any repeat is a pair of cells. When the outer loop reaches the first of the two, the scans of its row, column and box include the second.

#### Dry run

Example 2, cells in row order. The first three filled cells:

| Cell | Digit | Row scan | Column scan | Box scan | Result |
|---|---|---|---|---|---|
| (0, 0) | 8 | 3: no | 4, 3, 1: no | 4, 4, 6: no | continue |
| (0, 5) | 3 | 8: no | 8: no | 2: no | continue |
| (1, 2) | 4 | 9: no | 9: no | 8, 4, 6: the 4 at (2, 0) | return `false` |

#### Java code

```java title="Approach 1: brute force"
class Solution {
    public boolean isValidSudoku(char[][] board) {
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                char d = board[r][c];
                if (d == '.') {
                    continue;
                }
                for (int k = 0; k < 9; k++) {
                    if (k != c && board[r][k] == d) {
                        return false; // same row
                    }
                    if (k != r && board[k][c] == d) {
                        return false; // same column
                    }
                }
                int top = (r / 3) * 3;
                int left = (c / 3) * 3;
                for (int i = top; i < top + 3; i++) {
                    for (int j = left; j < left + 3; j++) {
                        if ((i != r || j != c) && board[i][j] == d) {
                            return false; // same box
                        }
                    }
                }
            }
        }
        return true;
    }
}
```

#### Time complexity

On the fixed 9 × 9 board this is **O(1)**: at most 81 cells × 27 comparisons, a constant. Saying "O(1)" is honest but tells the interviewer nothing about the algorithm, so I also give the bound for an N × N board with √N × √N boxes: each of the N² cells scans its row, column and box, about 3N cells, so **O(N³)** in the worst case (a full valid board, where no scan returns early).

#### Space complexity

**O(1) auxiliary space**: a few loop variables. The board is not modified.

#### The bridge to the next approach

> "Where's the waste? Each row gets scanned once for every filled cell in it, so up to nine times, and the same for columns and boxes. But the question 'does this row have a repeat?' only needs one pass over the row if I remember the digits I've already seen in it. That's the Contains Duplicate check, and the board has 27 units to run it on: 9 rows, 9 columns, 9 boxes."

### Approach 2: Three passes, a fresh set per unit

#### What I say out loud

> "So, three passes. First, for each row, a set of digits seen so far; if I try to add a digit that's already there, invalid. Then the same for each column. Then for each box, where I need to walk the nine cells of box b: its top-left corner is at row `3·(b/3)`, column `3·(b%3)`."

> "Each cell is visited three times in total, once per pass. That's linear in the number of cells, instead of the brute force's 3N per cell."

#### Intuition

Validity is three independent conditions, one per kind of unit. Each unit is a list of up to nine digits, and "no repeats in a list" is a single pass with a set of seen values.

#### Algorithm

1. For each row: clear a set, then for each filled cell in it, if `add` reports the digit was already there, return `false`.
2. The same for each column.
3. For each box `b` from 0 to 8: its rows are `3·(b/3)` to `3·(b/3) + 2`, its columns `3·(b%3)` to `3·(b%3) + 2`; same check.
4. Return `true`.

#### Why it is correct

- **It returns `false` only for a real repeat.** `add` returns `false` only when the digit is already in the set, and the set holds only digits from the current unit.
- **It cannot miss a repeat.** Every row, column and box is checked in full, and a repeat in a unit is found when its second occurrence is added.
- **The box loops cover the right cells.** `b / 3` is the box's band (0, 1 or 2 from the top) and `b % 3` its stack (from the left), so `b` = 0 to 8 numbers the boxes left to right, top to bottom, and each box's cells are the 3 × 3 block from its corner.

#### Dry run

Example 2:

| Pass | Unit | Digits added in order | Result |
|---|---|---|---|
| Rows | 0 to 8 | row 2: 4, 6, 2, 1; every row has distinct digits | continue |
| Columns | 0 to 8 | column 0: 8, 4, 3, 1; every column has distinct digits | continue |
| Boxes | box 0 | 8, then 4 (row 1, column 2), then 4 (row 2, column 0): `add` fails | return `false` |

The repeat is found only in the third pass, after all 81 + 81 cell visits of the first two passes and seven cells of box 0. The brute force stopped sooner on this board, at the third filled cell; on a valid board, though, it does far more work.

#### Java code

```java title="Approach 2: three passes with a set per unit"
import java.util.HashSet;
import java.util.Set;

class Solution {
    public boolean isValidSudoku(char[][] board) {
        Set<Character> seen = new HashSet<>();
        for (int r = 0; r < 9; r++) {                      // rows
            seen.clear();
            for (int c = 0; c < 9; c++) {
                if (board[r][c] != '.' && !seen.add(board[r][c])) {
                    return false;
                }
            }
        }
        for (int c = 0; c < 9; c++) {                      // columns
            seen.clear();
            for (int r = 0; r < 9; r++) {
                if (board[r][c] != '.' && !seen.add(board[r][c])) {
                    return false;
                }
            }
        }
        for (int b = 0; b < 9; b++) {                      // boxes, numbered left to right, top to bottom
            seen.clear();
            int top = (b / 3) * 3;
            int left = (b % 3) * 3;
            for (int r = top; r < top + 3; r++) {
                for (int c = left; c < left + 3; c++) {
                    if (board[r][c] != '.' && !seen.add(board[r][c])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
```

#### Time complexity

**O(1) on the 9 × 9 board** (243 cell visits at most). For an N × N board, each pass visits all N² cells once with one set operation each, and `HashSet` operations are constant on average, assuming hash codes spread well, so **O(N²) expected**. A set never holds more than N keys, so even if every key collided an operation would cost O(N), giving O(N³) as a general worst case. For the nine `Character` keys here the hash codes are all different, so this is a formality; a boolean array of size N (Approach 3) removes hashing altogether.

#### Space complexity

**O(N) auxiliary space**, one set reused for each unit and holding at most N digits; O(1) on the 9 × 9 board.

#### The bridge to the next approach

> "This is already linear in the cells, so the next step isn't about complexity. It's about the code: I wrote the same check three times, and the box pass is where the index arithmetic can go wrong. What if I visited each cell once and checked all three of its units at the same moment? Then I need all 27 records alive at once instead of one reused set, and I need to know, for a cell, which box it's in. That's the reverse of what the box pass did: there I went from box to cells, now I go from cell to box."

> "And since digits are 1 to 9, the records don't need to be hash sets. A boolean array of 9 per unit does the same job with no hashing and no boxing of `char`s."

### Approach 3: One pass, 27 boolean records (recommended)

#### What I say out loud

> "I keep three tables: `rows[r][d]` is true if digit d has appeared in row r, and the same for `cols[c][d]` and `boxes[b][d]`. I walk the board once. For a filled cell I compute d from the character, and the box number b from r and c. If any of the three entries is already true, that digit repeats in that unit, so I return false. Otherwise I set all three."

> "The box number: the boxes form a 3 × 3 grid of boxes. The box's row in that grid is `r / 3` and its column is `c / 3`, using integer division. Numbering the boxes row by row, like reading a page, box row `br` and box column `bc` give `br * 3 + bc`. So `b = (r / 3) * 3 + c / 3`."

#### Intuition

Each filled cell belongs to exactly three units. A repeat exists exactly when some cell finds its digit already recorded in one of its three units, so one pass with a record per unit, 27 records, catches every repeat the moment its second occurrence is reached.

The box formula, derived instead of remembered. Integer division by 3 sends rows 0–2 to 0, rows 3–5 to 1 and rows 6–8 to 2, so `r / 3` is the box's row in the grid of boxes and `c / 3` its column. Numbering a 3 × 3 grid row by row, the cell in grid row `br` and grid column `bc` gets number `3·br + bc`, just as cell `(r, c)` of a 9-wide board gets `9r + c`. Check on the corners: `(0, 0)` → 0, `(0, 8)` → 2, `(4, 4)` → 4, `(8, 0)` → 6, `(8, 8)` → 8.

#### Algorithm

1. Create `rows`, `cols` and `boxes`, each 9 × 9 booleans, all false.
2. For each cell `(r, c)` in row order, skip it if it is `'.'`.
3. Compute `d = board[r][c] - '1'` (0–8) and `b = (r / 3) * 3 + c / 3`.
4. If `rows[r][d]`, `cols[c][d]` or `boxes[b][d]` is true, return `false`.
5. Set all three to true.
6. After the loop, return `true`.

#### Why it is correct

**The invariant:** before a cell is processed, `rows[r][d]` is true exactly when digit d+1 occurs in row r among the cells already processed, and the same holds for every column and box.

- It holds at the start: no cells processed, all false.
- Processing a filled cell sets exactly the three entries for its row, column and box, so it still holds afterwards. Empty cells change nothing.

From the invariant:

- **It returns `false` only for a real repeat.** An entry that is already true means an earlier cell with the same digit lies in the same unit.
- **It cannot miss a repeat.** Take any two cells with the same digit in a common unit. When the later one is processed, the earlier one has set that unit's entry, so the check fails there.
- **Each cell lands in the right box.** By the derivation above, `b` ranges over 0–8 and two cells get the same `b` exactly when they have the same `r / 3` and the same `c / 3`, which is the definition of sharing a box.

**The 25-second version to say to the interviewer:**

> "I keep a seen-table for each of the 27 units. Before a cell, each table holds exactly the digits of the cells already processed in that unit. So a filled cell whose digit is already in its row, column or box table is a real repeat, and any repeat gets caught when its second cell arrives. The box number is `(r/3)*3 + c/3`: the box's position in the 3 × 3 grid of boxes, numbered row by row."

#### Dry run

Example 2, filled cells in row order:

| Cell | `d + 1` | Box `(r/3)*3 + c/3` | Already seen in row / column / box? | Action |
|---|---|---|---|---|
| (0, 0) | 8 | 0·3 + 0 = 0 | no / no / no | mark 8 in row 0, column 0, box 0 |
| (0, 5) | 3 | 0·3 + 1 = 1 | no / no / no | mark 3 in row 0, column 5, box 1 |
| (1, 2) | 4 | 0·3 + 0 = 0 | no / no / no | mark 4 in row 1, column 2, box 0 |
| (1, 7) | 9 | 0·3 + 2 = 2 | no / no / no | mark 9 in row 1, column 7, box 2 |
| (2, 0) | 4 | 0·3 + 0 = 0 | no / no / **yes** | return `false` |

Five filled cells, and the answer comes from the box table alone, as in the restatement.

#### Java code

```java title="Approach 3: one pass with boolean tables (recommended)"
class Solution {
    public boolean isValidSudoku(char[][] board) {
        boolean[][] rows = new boolean[9][9];   // rows[r][d]: digit d+1 already in row r
        boolean[][] cols = new boolean[9][9];
        boolean[][] boxes = new boolean[9][9];
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                if (board[r][c] == '.') {
                    continue;
                }
                int d = board[r][c] - '1';      // '1'..'9' -> 0..8
                int b = (r / 3) * 3 + c / 3;    // box row * 3 + box column
                if (rows[r][d] || cols[c][d] || boxes[b][d]) {
                    return false;
                }
                rows[r][d] = true;
                cols[c][d] = true;
                boxes[b][d] = true;
            }
        }
        return true;
    }
}
```

#### Time complexity

**O(1) on the 9 × 9 board**: 81 cells, constant work each. For an N × N board (N a perfect square, boxes √N × √N): N² cells, each with three array lookups and three writes, so **O(N²) in the worst case**, with no hashing involved. In the worst case a correct algorithm must read essentially every cell, since an unread cell could hold the repeated digit, so Ω(N²) is a worst-case lower bound and this is optimal.

#### Space complexity

**O(N²) auxiliary space** for an N × N board: 3N records of N booleans. On the 9 × 9 board that is 243 booleans, a constant. Note the trade against Approach 2, which needs only O(N): keeping all records alive at once is what buys the single pass.

### Alternative: bitmasks instead of boolean arrays

Each record is a set of at most nine digits, so it fits in the low nine bits of an `int`. Three `int[9]` arrays replace the boolean tables:

```java title="Alternative: bitmask records"
class Solution {
    public boolean isValidSudoku(char[][] board) {
        int[] rows = new int[9];
        int[] cols = new int[9];
        int[] boxes = new int[9];
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                if (board[r][c] == '.') {
                    continue;
                }
                int bit = 1 << (board[r][c] - '1');
                int b = (r / 3) * 3 + c / 3;
                if (((rows[r] | cols[c] | boxes[b]) & bit) != 0) {
                    return false;
                }
                rows[r] |= bit;
                cols[c] |= bit;
                boxes[b] |= bit;
            }
        }
        return true;
    }
}
```

Same complexity, a smaller constant (27 ints instead of 243 booleans), and one test instead of three. It wins when memory per record matters, for example when a solver copies these records at every step of a backtracking search. For N up to 32 an `int` holds a record and up to 64 a `long`; beyond that it needs a `BitSet`. In an interview I'd mention it after the boolean version, since the bit operations add risk without changing the bound. See [[a13-bitmasking|Bitmasking]].

A last option some candidates like: one `HashSet<String>` holding entries such as `"4 in row 2"`, `"4 in col 0"` and `"4 in box 0"`. It is short, but builds three strings per cell and hashes them; same O(N²) expected bound, a much larger constant.

## 5. Comparison table

N = side of the board (9 here, so every bound is a constant on the actual input). Only Approach 2 hashes; for the others expected and worst case are the same.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Brute force | O(N³) | O(N³) | O(1) |
| 2. Three passes, set per unit | O(N²) | O(N³) in general if every key collided (at most N keys per set); not a concern for nine `Character` keys | O(N) |
| 3. One pass, boolean tables | O(N²) | O(N²) | O(N²) |
| Alt. Bitmasks | O(N²) | O(N²) | O(N) ints for N ≤ 32 |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Brute force | No extra memory; correct by inspection, since it compares each cell with its whole row, column and box | Redundant rescans; three scans to get right | As the stated baseline |
| 2. Three passes | Each pass is a plain duplicate check; O(N) memory | Three near-identical loops; box loops are easy to get wrong | If you think unit by unit, or memory per unit matters |
| 3. One pass, boolean tables | One loop, all rules side by side, no hashing | O(N²) memory; the box formula must be right | The default interview answer |
| Alt. Bitmasks | Smallest constant; one test per cell | Bit operations; size-limited per `int` | When the records are copied often, as in a solver |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** the single pass with boolean tables (Approach 3).

**Is it optimal?** On a fixed 9 × 9 board every approach is O(1), so "optimal" is about the general N × N board: there, any correct algorithm must, in the worst case, read essentially every cell, an Ω(N²) worst-case lower bound, and Approach 3 is O(N²). Approach 2 has the same time with less memory; that is a genuine trade, not a mistake.

**Why it is the preferred interview answer.** It is the shortest correct code, it states all three rules in one `if`, and it has no hashing to qualify. Its single risk, the box formula, is one line that you derive out loud.

**When a different solution is preferable in practice:** a Sudoku solver that copies its state at every step benefits from bitmasks. Approach 2 is just as good an answer if you derived it; say that one pass is a refinement of the code, not of the complexity.

**When to stop:** once the box index is derived and checked on a few corners and the complexity is stated honestly (O(1) for 9 × 9, O(N²) in general). Do not optimize further.

## 7. Interview script: code it and test it

### What I say while coding

> "Three 9 by 9 boolean tables, for rows, columns and boxes. Indexed by unit, then digit."

> "Skip dots first, so `ch - '1'` is only computed on digits; on a dot it would be −3."

> "Digit index is `ch - '1'`, so '1' is 0 and '9' is 8. If I used `- '0'` I'd need arrays of size 10."

> "Box index `(r / 3) * 3 + c / 3`: box row times three plus box column."

> "Check all three before marking any, then mark all three."

### Testing out loud

**Example 2:** the table in section 4: four cells get marked, then `(2, 0)` with 4 finds box 0 already holding 4. Returns `false`. Correct.

**Empty board:** every cell is skipped, the loop ends, returns `true`. Correct: an empty board breaks no rule.

**Row repeat only:** 7 at `(4, 0)` and `(4, 8)`. The second cell finds `rows[4][6]` true (its column is 8 and its box is 5, both fresh). Returns `false`.

**Column repeat only:** 3 at `(0, 6)` and `(8, 6)`: boxes 2 and 8, rows 0 and 8 differ; `cols[6][2]` catches it.

**Box repeat only, in the last box:** 9 at `(6, 6)` and `(8, 8)`. Box numbers: `(6/3)*3 + 6/3` = 8 and `(8/3)*3 + 8/3` = 8. The second cell finds `boxes[8][8]` true. Returns `false`, and the loop did reach the very last cell.

**Different boxes that a wrong formula would merge:** 5 at `(0, 3)` and `(3, 0)`. Boxes `0*3 + 1` = 1 and `1*3 + 0` = 3, different, and the rows and columns differ too. Returns `true`. (With `r/3 + c/3`, both would be box 1 and it would return `false`.)

**Valid but unsolvable:** row 0 is `. 1 2 3 4 5 6 7 8` and row 3 has a 9 in column 0. No unit repeats, so the code returns `true`, which is the right answer even though cell `(0, 0)` can't be filled: it would need 9, and column 0 has one.

## 8. Time plan for the interview

This is a 10 to 15 minute problem. Most of the risk is in the box index.

### Suggested split

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 1–2 min | Only filled cells, need not be solvable, fixed 9 × 9 |
| Brute force | 1 min | Say it and its cost; don't code it |
| Three passes or one | 1–2 min | Duplicate check per unit; then one pass with 27 records |
| Derive the box index | 1 min | `r / 3` and `c / 3`, then number the box grid row by row; check two corners |
| Write the code | 3–4 min | One loop |
| Trace and test | 2–3 min | Example 2; the `(0,3)` / `(3,0)` pair; an empty board |
| Complexity | 1 min | O(1) here, O(N²) for N × N, and why |

### Where the time should go

- **Most attention:** deriving and checking the box index out loud. It is the line interviewers look at.
- **Do not skimp on:** the complexity statement. "O(1)" alone sounds evasive; "O(1) because the board is fixed, O(N²) for N × N" shows you understand both.
- **Least attention:** bitmasks, unless asked.

### If the better idea does not come

1. Say the brute force; it is correct.
2. Reduce to a smaller problem: "How do I check one row for repeats?" That is a set of seen digits.
3. Apply it to all 27 units: three passes. That is already a full answer.
4. If the box loops are giving trouble, write out the corners of the nine boxes on paper and find the pattern.

## 9. Interviewer challenges

### About the solution

#### How did you get `(r / 3) * 3 + c / 3`?

**What they are testing:** whether you derived the formula or memorized it, and whether you can check it.

**How to reason:** the boxes form a 3 × 3 grid. Find the box's row and column in that grid, then number the grid like any 2-D array flattened row by row.

**What I say:** "Integer division by 3 maps rows 0–2 to 0, 3–5 to 1, 6–8 to 2, so `r / 3` is the box's row in the grid of boxes and `c / 3` its column. Flattening a 3-wide grid row by row gives row times 3 plus column, the same as `9r + c` flattens the board. Checking corners: `(0, 8)` gives 2, `(8, 0)` gives 6, `(8, 8)` gives 8."

**Nuance:** the tempting `r / 3 + c / 3` sends both `(0, 3)` and `(3, 0)` to box 1, so a board with a 5 in each, which is valid, is reported invalid. `(r % 3) * 3 + c % 3` is the position of a cell *inside* its box, not the box: it sends `(0, 0)` and `(3, 3)` to the same index. Both bugs only show on boards where the merged boxes share a digit, which is why tests should include such pairs.

#### What is the time complexity, really?

**What they are testing:** honesty about constant-size input, and whether you can still analyse the algorithm.

**How to reason:** separate the input size from the algorithm's growth. The input is always 81 cells, so any terminating algorithm is O(1) on it. The meaningful statement is about a parameterized board.

**What I say:** "On a 9 by 9 board it's O(1), and so is every other approach, which is why that answer alone isn't very informative. For an N by N board it's O(N²) time, one visit per cell, and O(N²) space for the three tables. The brute force would be O(N³), because each cell rescans about 3N cells."

**Nuance:** big-O describes growth as the input grows; with a fixed input size, constants decide. Brute force does about 2,000 comparisons here, and in practice that is fast too. The interviewer wants the generalized analysis, not a claim that one is "faster" on 81 cells.

#### Why not check whether the board is solvable?

**What they are testing:** reading the requirement precisely.

**How to reason:** look at what "valid" is defined as: no repeats among filled cells. Solvability is a different, much harder question.

**What I say:** "The problem defines valid as no repeated digit in a row, column or box among the filled cells. A board can satisfy that and still have no solution, like a row holding 1 to 8 whose empty cell needs a 9 that its column already has. Checking solvability would need backtracking search, which the problem doesn't ask for."

**Nuance:** the solver is [[nc-n-queens|N-Queens]]-style backtracking, and the tables in this solution are exactly the state a solver keeps to test each placement in constant time.

#### Why boolean arrays instead of hash sets?

**What they are testing:** choosing the data structure from the key range.

**How to reason:** the keys are digits 1 to 9, a tiny dense range. A direct-address array is the simplest set for that.

**What I say:** "The digits are 1 to 9, so `ch - '1'` is a perfect index. A boolean array is a set with no hashing, no boxing of `char` to `Character`, and a guaranteed constant time per operation. A hash set works too, but here it only adds overhead and an 'expected' qualifier."

**Nuance:** with a key range far larger than the number of keys, such as arbitrary integers, the array would waste memory and a hash set would be the right call.

### About changes

#### Could you do it with less memory?

**What they are testing:** awareness of the trade you made for the single pass.

**How to reason:** list what the memory is for: all 27 records are alive at once because each cell updates three of them.

**What I say:** "Three passes need one record at a time, O(N) instead of O(N²). Or keep one pass and pack each record into an int as a bitmask: 27 ints instead of 243 booleans. On 9 by 9 none of this matters; on a big board, the three-pass version uses the least memory."

**Nuance:** you could also mark seen digits on the board itself, but the board should not be modified, and it holds characters, not sets.

## 10. Follow-up questions the interviewer might ask

**"Generalize to an N × N board with √N × √N boxes."**
Replace 9 by N and 3 by `k = √N`: digits map to 0..N−1, and the box index is `(r / k) * k + c / k`. O(N²) time and O(N²) space (or O(N) with three passes). Validate that N is a perfect square.

**"Return where the first conflict is, or all conflicts."**
For the first conflict, store in each table the position where a digit was first seen instead of `true`, and return both positions. For all conflicts, keep going instead of returning, and collect each pair: the number of pairs can reach O(N²) per unit in a pathological board, so the output size dominates.

**"The board changes one cell at a time; answer 'still valid?' after each change."**
Keep counts per unit and digit (`rows[r][d]` as an int), plus a counter of (unit, digit) pairs whose count exceeds 1; the board is valid when that counter is 0. Each change updates three counts and the counter in O(1), so each query is O(1) after an O(N²) setup.

**"Now solve the Sudoku."**
Backtracking: pick an empty cell, try each digit that is absent from its row, column and box tables, recurse, and undo on failure. The tables, or bitmasks, make each test O(1). The worst-case running time is exponential in the number of empty cells; choosing the cell with the fewest options first prunes heavily in practice.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Trying to decide solvability.** The problem only asks about repeats among filled cells. A board with no repeats is valid even if unsolvable.
- **Forgetting one of the three rules**, usually the box rule. Example 2 is invalid only because of its box.
- **Saying only "O(1)" or only "O(81)".** Both are true and uninformative. Give the N × N bound as well.
- **Claiming the one-pass version is asymptotically faster than three passes.** Both are O(N²); one pass trades memory for shorter code.

### Implementation mistakes

> [!MISTAKE] Wrong box index
> `r / 3 + c / 3` merges boxes: `(0, 3)` and `(3, 0)` both get 1, so a valid board with a 5 in each is reported invalid. `(r % 3) * 3 + c % 3` computes the position inside a box, merging `(0, 0)` and `(3, 3)`. Derive `(r / 3) * 3 + c / 3` and check it on a few corners.

> [!MISTAKE] Off-by-one in the digit index
> With tables of size 9, `board[r][c] - '0'` turns `'9'` into 9 and throws `ArrayIndexOutOfBoundsException`. Use `- '1'`, or size the tables 10.

- **Not skipping `'.'`.** `'.' - '1'` is −3, so the first empty cell throws `ArrayIndexOutOfBoundsException`.
- **Marking before checking.** If you set `rows[r][d]` and then test it, every filled cell looks like a repeat. Check all three, then mark all three.
- **Box corners in the three-pass version** computed with the same expression for both coordinates, such as `top = (b / 3) * 3` and `left = (b / 3) * 3`. Then box 1 is scanned as box 0 again and boxes off the diagonal are never checked. One coordinate uses `b / 3`, the other `b % 3`.

## 12. Pattern recognition

**The pattern:** duplicate detection with one seen-set per group, where each element belongs to several groups. Map each element to its groups with arithmetic (here row, column and `(r/3)*3 + c/3`), and check membership in all of them.

**Signals in the problem statement:**

- "No element may repeat within each … " with several overlapping kinds of group.
- Small, dense key ranges (digits 1–9), which allow arrays or bitmasks instead of hash sets.
- A grid where groups are rows, columns, diagonals or blocks, each identified by a formula on the coordinates.

**Related problems in this list:**

- [[nc-contains-duplicate|Contains Duplicate]]: the single-group version, one set of seen values.
- [[nc-n-queens|N-Queens]]: the same "is this row, column or diagonal already used?" tables, used to place pieces during backtracking; diagonals are identified by `r - c` and `r + c`, just as boxes are by `(r/3)*3 + c/3`.
- [[nc-set-matrix-zeroes|Set Matrix Zeroes]]: per-row and per-column records gathered in one pass over a grid.
- [[nc-design-hashset|Design HashSet]]: the direct-address boolean array used here is the simplest set for small integer keys.
- [[nc-group-anagrams|Group Anagrams]]: computing a key that names an element's group, here the box number, there the letter counts.

**Takeaway:** when each element belongs to several groups that must each be duplicate-free, keep one seen-record per group and compute the group ids from the element's coordinates.

## 13. 60-second revision card

**Key insight:** each filled cell is in exactly three units. Keep a seen-record for each of the 27 units; a cell whose digit is already in one of its three records is a repeat.

**Invariant:** before a cell is processed, each record holds exactly the digits of the already-processed cells in that unit. Check all three, then mark all three.

**Box index:** `(r / 3) * 3 + c / 3`, the box's row in the grid of boxes times 3 plus its column.

**Complexity:** O(1) on the fixed 9 × 9 board. For N × N: O(N²) time, O(N²) space (O(N) with three passes), and Ω(N²) is a worst-case lower bound since every cell may need reading.

**Code skeleton:**

```java title="Valid Sudoku in one pass" fragment="public boolean isValidSudoku(char[][] board)"
boolean[][] rows = new boolean[9][9], cols = new boolean[9][9], boxes = new boolean[9][9];
for (int r = 0; r < 9; r++) {
    for (int c = 0; c < 9; c++) {
        if (board[r][c] == '.') continue;
        int d = board[r][c] - '1', b = (r / 3) * 3 + c / 3;
        if (rows[r][d] || cols[c][d] || boxes[b][d]) return false;
        rows[r][d] = cols[c][d] = boxes[b][d] = true;
    }
}
return true;
```

**Main traps:**

- `r / 3 + c / 3` and `(r % 3) * 3 + c % 3` are wrong box indices.
- `- '1'`, not `- '0'`, with tables of size 9; skip `'.'` first.
- Valid does not mean solvable.
- Say O(1) for 9 × 9 and O(N²) for N × N.

**What to say in one breath:** "Each filled cell belongs to a row, a column and a box. I keep a seen-table for each of the 27 units, walk the board once, and return false if a cell's digit is already in any of its three tables; otherwise I mark all three. The box index is `(r/3)*3 + c/3`. It's O(1) on a 9 × 9 board, O(N²) time and space for N × N."
