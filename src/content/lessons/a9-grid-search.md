---
summary: Grid search backtracking explores paths through a 2D board one cell at a time, marking each cell while it is on the current path and releasing it when the search backs out. You will learn the mark–explore–unmark template through Word Search, see exactly why the unmark matters, count and list paths, scale to many words with a trie, and know when BFS, flood fill or DP is the better tool.
difficulty: intermediate
minutes: 55
objectives:
  - Implement grid DFS backtracking with bounds checks, in-place marking and restoring
  - Explain why a path search must unmark cells on the way back while flood fill must not
  - Trace Word Search on a board and derive its O(m · n · 3^L) time bound
  - Adapt the template to listing paths (Rat in a Maze) and counting paths that cover every cell (Unique Paths III)
  - Use a trie to search many words at once and choose between backtracking, BFS and DP for a grid problem
---

## Introduction

Look at this board of letters and ask whether the word `ABCCED` can be spelled by starting on some cell and stepping up, down, left or right, without stepping on the same cell twice:

```text
A B C E
S F C S
A D E E
```

It can: start at the top-left `A`, go right to `B` and `C`, down to the second `C`, down to `E`, and left to `D`. A person finds this by trying a start, following letters that match, and when they get stuck, *going back* and trying a different direction. That is **grid search backtracking**: depth-first exploration of paths on a 2D grid, where each cell may be used at most once **on the current path**, and cells are released again when the search retreats.

This pattern covers a family of problems — Word Search, Word Search II, Rat in a Maze, Unique Paths III, Path with Maximum Gold, Sudoku — that share one structure. The grid is a graph whose nodes are cells and whose edges join neighbouring cells, as described in [[a8-grid-as-graph]]. What makes these problems different from ordinary graph traversal is that the answer is a **path**, and whether a cell is available depends on the path you took to get there.

That single difference decides the template. In flood fill or counting islands ([[a8-flood-fill]], [[a8-number-of-islands]]), a cell visited once is done forever. In a path search, a cell that a failed path used must become available again for the next path. Getting this right is the core of the lesson.

## Before you start

- **Backtracking basics** — choose, recurse, undo, from [[a1-recursion]] and [[a9-subsets]].
- **2D arrays** — indexing `grid[r][c]`, rows and columns, and bounds. See [[a2-matrix]].
- **DFS on graphs** — [[a8-dfs]], and treating cells as graph nodes in [[a8-grid-as-graph]].
- **Tries** (for the Word Search II section) — [[a12-trie]]; the section explains what it needs.

## The intuition: a trail of chalk

Imagine walking through a cave system with a piece of chalk. You mark every junction you pass so you do not walk in circles. When you hit a dead end you walk back, and — this is the important part — you **rub out the chalk** at each junction as you retreat past it. The marks only describe the route you are currently on. If you left them, a later attempt through a different tunnel would see the old marks and wrongly believe those junctions were off-limits.

Grid backtracking works exactly like that:

1. **Check** that the cell is inside the grid, allowed by the problem's rule (the right letter, not a wall), and not already on the current path.
2. **Mark** it as on the path.
3. **Explore** each neighbour recursively.
4. **Unmark** it before returning, so other paths can use it.

The **neighbours** of `(r, c)` are usually the four cells `(r + 1, c)`, `(r − 1, c)`, `(r, c + 1)`, `(r, c − 1)`. Some problems allow the four diagonal moves as well; read the statement, because using the wrong set is a silent bug. A direction table such as `int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}}` keeps the loop short.

## Word Search: the template

The problem: given a board of letters and a word, return whether the word can be traced through adjacent cells, using each cell at most once.

A naive approach would enumerate every path in the grid and compare it with the word — hopeless, because the number of paths is exponential in their length. The useful observation is that the word itself prunes the search: a path is only worth extending while its letters match a **prefix** of the word. At each step only neighbours holding the next letter qualify, which usually leaves very few options.

So the recursive question is: *can the rest of the word, from index `idx`, be spelled starting at cell `(r, c)`?*

```java title="WordSearch.java"
public class WordSearch {

    static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    static boolean exist(char[][] board, String word) {
        for (int r = 0; r < board.length; r++) {
            for (int c = 0; c < board[0].length; c++) {
                if (dfs(board, r, c, word, 0)) return true;
            }
        }
        return false;
    }

    // Can word[idx..] be spelled starting at (r, c) without reusing a cell on this path?
    static boolean dfs(char[][] board, int r, int c, String word, int idx) {
        if (r < 0 || c < 0 || r >= board.length || c >= board[0].length) return false;
        if (board[r][c] != word.charAt(idx)) return false;  // also rejects '#' cells
        if (idx == word.length() - 1) return true;          // last letter matched

        char saved = board[r][c];
        board[r][c] = '#';                       // on the current path: not reusable
        boolean found = false;
        for (int[] d : DIRS) {
            if (dfs(board, r + d[0], c + d[1], word, idx + 1)) {
                found = true;
                break;
            }
        }
        board[r][c] = saved;                     // leave the path: usable again
        return found;
    }

    public static void main(String[] args) {
        char[][] board = {
            {'A', 'B', 'C', 'E'},
            {'S', 'F', 'C', 'S'},
            {'A', 'D', 'E', 'E'}
        };
        System.out.println(exist(board, "ABCCED"));
        System.out.println(exist(board, "SEE"));
        System.out.println(exist(board, "ABCB"));
        System.out.println(new String(board[0]));  // board is unchanged afterwards
    }
}
```

```output
true
true
false
ABCE
```

Walk through `dfs` in order. The **bounds check comes first**, because every later line reads `board[r][c]`, and reading outside the array throws `ArrayIndexOutOfBoundsException`. Checking bounds on entry also means the caller can recurse into all four neighbours without checking each one. Next, the **letter check** rejects a cell that does not match the next letter. It also rejects cells already on the path for free: they hold `'#'`, which never equals a letter of the word, so no separate `visited` array is needed.

If the letter matches and it is the last letter, the word is complete. Otherwise the cell is **marked** by overwriting it with `'#'`, the four neighbours are tried with `idx + 1`, and the cell is **restored** from `saved`. The loop stops at the first success, but the restore line still runs before returning, so the board is left exactly as it was found — the last line of output confirms it. Many published solutions `return true` straight from inside the loop, which skips the restore and leaves `'#'` characters on the board. An online judge does not notice, but code that reuses the board afterwards would.

`ABCB` is false because the only path that spells `ABC` would need to step back onto the `B` it already used, and that cell holds `'#'` while it is on the path.

### Dry run

Tracing `ABCCED`, with directions tried in the order down, up, right, left:

| Step | Cell | `idx` | Letter needed | Result |
|---|---|---|---|---|
| 1 | (0, 0) | 0 | A | match, mark |
| 2 | (1, 0) | 1 | B | `S`, reject |
| 3 | (−1, 0) | 1 | B | out of bounds |
| 4 | (0, 1) | 1 | B | match, mark |
| 5 | (1, 1) | 2 | C | `F`, reject |
| 6 | (0, 2) | 2 | C | match, mark |
| 7 | (1, 2) | 3 | C | match, mark |
| 8 | (2, 2) | 4 | E | match, mark |
| 9 | (3, 2) | 5 | D | out of bounds |
| 10 | (1, 2) | 5 | D | `'#'`, reject |
| 11 | (2, 3) | 5 | D | `E`, reject |
| 12 | (2, 1) | 5 | D | match, last letter: true |

The `true` then travels back up the stack, and each call restores its cell on the way out. Step 10 shows the mark doing its job: the path came from `(1, 2)`, and without the mark the search could step straight back onto it.

## Why the unmark matters

It is tempting to treat the marks like a `visited` set in BFS — set once, never cleared. For path problems that gives wrong answers, and it helps to see a concrete case. Here is the template with the restore line removed, run on a small board where the right path is not the first one tried:

```java title="NoUnmark.java"
public class NoUnmark {

    static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    // Buggy: a cell marked '#' is never restored.
    static boolean dfs(char[][] b, int r, int c, String w, int i) {
        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length) return false;
        if (b[r][c] != w.charAt(i)) return false;
        if (i == w.length() - 1) return true;
        b[r][c] = '#';
        for (int[] d : DIRS) {
            if (dfs(b, r + d[0], c + d[1], w, i + 1)) return true;
        }
        return false;                            // missing: b[r][c] = original letter
    }

    public static void main(String[] args) {
        char[][] buggyBoard = {{'A', 'C', 'A'}, {'B', 'A', 'A'}};
        System.out.println("without unmark: " + dfs(buggyBoard, 0, 1, "CABAA", 0));

        char[][] board = {{'A', 'C', 'A'}, {'B', 'A', 'A'}};
        System.out.println("with unmark:    " + WordSearch.exist(board, "CABAA"));
    }
}
```

```output
without unmark: false
with unmark:    true
```

The board is:

```text
A C A
B A A
```

The word `CABAA` is spelled by `C(0,1) → A(0,0) → B(1,0) → A(1,1) → A(1,2)`. But the search tries "down" first, so from `C` it goes to `A(1,1)`, then `B(1,0)`, then `A(0,0)`, and gets stuck there needing a fifth letter. It backs out — but without the restore, `(1,1)`, `(1,0)` and `(0,0)` all still hold `'#'`. When the search later tries `C → A(0,0)`, that cell looks used, and the correct path is never found.

The rule to remember: **if the answer is a path, a cell's availability belongs to the path, so it is released when the path retreats. If the answer is a region, a cell's availability belongs to the whole search, so it is never released.** Flood fill, island counting and BFS shortest path ([[a8-bfs-shortest-unweighted]]) are region problems; mark permanently there, or the search revisits cells and becomes exponential.

> [!WARNING] Reading the cell before checking bounds
> `if (board[r][c] != word.charAt(idx) || r < 0 ...)` evaluates the array access first and throws for `r = -1`. Put the bounds test first, or check bounds before each recursive call.

## Complexity

Let the grid have `m` rows and `n` columns, and the word have length `L`.

**Time.** The search may start at each of the `m · n` cells. From a start, the first step has at most 4 neighbours to try. After that, one neighbour is the cell you came from, which is marked, so at most 3 new directions remain at each of the next `L − 1` levels. A single start therefore explores at most 4 · 3^(L−1) paths, and the total is **O(m · n · 3^L)**. You will often see O(m · n · 4^L) quoted; it is a correct but looser bound.

The bound is worst case. On realistic boards, the letter check kills most branches at their first step, so the search is far faster than 3^L. The worst inputs are boards full of the same letter with a word like `AAAA…AB` that almost matches everywhere.

**Space.** The recursion depth is at most `L`, so the stack uses **O(L)**. Marking in place uses no extra memory; a separate `boolean[m][n] visited` array would add O(m · n).

> [!NOTE] Why not memoize?
> It looks as if `(r, c, idx)` could be cached. It cannot: whether the rest of the word can be spelled from `(r, c)` also depends on *which cells are already on the path*, and that set is part of the state. Caching on `(r, c, idx)` alone gives wrong answers. This path dependence is exactly what makes these problems backtracking rather than DP.

Two cheap pre-checks cut the work further on large inputs. First, count the letters: if the board has fewer `E`s than the word needs, return `false` without searching. Second, if the word's last letter is rarer on the board than its first letter, search for the reversed word instead — the same paths exist, but fewer starting cells match.

## Listing every path: Rat in a Maze

Word Search stops at the first success. Other problems want **every** path. In the classic *Rat in a Maze* problem, an `n × n` grid has `1` for open cells and `0` for walls; the rat starts at the top-left, must reach the bottom-right, and may move Down, Left, Right or Up without revisiting a cell. The task is to list every route as a string of moves, in lexicographic order.

The template is the same with two changes: the path (the move letters) is kept in a `StringBuilder` that is appended to and trimmed like any backtracking path, and the search does not stop at the first success.

```java title="RatInMaze.java"
import java.util.ArrayList;
import java.util.List;

public class RatInMaze {

    // Directions in alphabetical order of their letters, so paths come out sorted.
    static final int[] DR = {1, 0, 0, -1};
    static final int[] DC = {0, -1, 1, 0};
    static final char[] MOVE = {'D', 'L', 'R', 'U'};

    static void dfs(int[][] maze, int r, int c, boolean[][] onPath,
                    StringBuilder path, List<String> out) {
        int n = maze.length;
        if (r == n - 1 && c == n - 1) {          // reached the exit
            out.add(path.toString());
            return;
        }
        onPath[r][c] = true;
        for (int d = 0; d < 4; d++) {
            int nr = r + DR[d], nc = c + DC[d];
            if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
            if (maze[nr][nc] == 0 || onPath[nr][nc]) continue;
            path.append(MOVE[d]);
            dfs(maze, nr, nc, onPath, path, out);
            path.deleteCharAt(path.length() - 1);
        }
        onPath[r][c] = false;
    }

    static List<String> findPaths(int[][] maze) {
        List<String> out = new ArrayList<>();
        int n = maze.length;
        if (maze[0][0] == 0 || maze[n - 1][n - 1] == 0) return out;
        dfs(maze, 0, 0, new boolean[n][n], new StringBuilder(), out);
        return out;
    }

    public static void main(String[] args) {
        int[][] maze = {
            {1, 0, 0, 0},
            {1, 1, 0, 1},
            {1, 1, 0, 0},
            {0, 1, 1, 1}
        };
        System.out.println(findPaths(maze));
    }
}
```

```output
[DDRDRR, DRDDRR]
```

This version uses a separate `boolean[][] onPath` instead of overwriting cells, which keeps the maze intact and makes the mark easy to read. It checks bounds and walls *before* recursing rather than on entry — both styles are correct; pick one and use it consistently. Ordering the direction arrays alphabetically (`D`, `L`, `R`, `U`) makes the paths come out already sorted, which avoids a sort at the end. The exit test happens before marking, so the exit cell is never left marked; every other cell is unmarked after its loop.

## Counting paths that cover every cell: Unique Paths III

*Unique Paths III* gives a grid with one start (`1`), one end (`2`), empty cells (`0`) and obstacles (`−1`), and asks how many walks go from start to end stepping on **every empty cell exactly once**. Counting is a natural fit: each call returns the number of valid completions from where it stands, and the parent adds the four results.

```java title="UniquePathsIII.java"
public class UniquePathsIII {

    static int rows, cols;

    // Counts walks from (r, c) to the end cell that step on every free cell once.
    static int dfs(int[][] g, int r, int c, int left) {
        if (r < 0 || c < 0 || r >= rows || c >= cols || g[r][c] == -1) return 0;
        if (g[r][c] == 2) return left == 0 ? 1 : 0;  // at the end: did we cover all?
        int saved = g[r][c];
        g[r][c] = -1;                            // treat as an obstacle while on the path
        int ways = dfs(g, r + 1, c, left - 1) + dfs(g, r - 1, c, left - 1)
                 + dfs(g, r, c + 1, left - 1) + dfs(g, r, c - 1, left - 1);
        g[r][c] = saved;
        return ways;
    }

    static int uniquePathsIII(int[][] g) {
        rows = g.length;
        cols = g[0].length;
        int free = 0, sr = 0, sc = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (g[r][c] == 0) free++;
                if (g[r][c] == 1) { sr = r; sc = c; }
            }
        }
        // Steps still to take from the start: every free cell, then the end cell.
        return dfs(g, sr, sc, free + 1);
    }

    public static void main(String[] args) {
        System.out.println(uniquePathsIII(new int[][]{
            {1, 0, 0, 0}, {0, 0, 0, 0}, {0, 0, 2, -1}}));
        System.out.println(uniquePathsIII(new int[][]{
            {1, 0, 0, 0}, {0, 0, 0, 0}, {0, 0, 0, 2}}));
        System.out.println(uniquePathsIII(new int[][]{{0, 1}, {2, 0}}));
    }
}
```

```output
2
4
0
```

The parameter `left` counts the steps still to take. From the start, the walk must take `free + 1` steps — one onto each empty cell and one onto the end — and each recursive call subtracts one. Arriving at the end with `left == 0` means every empty cell was covered. Marking a cell by temporarily turning it into an obstacle reuses the existing `−1` check, so no extra array is needed. In the third grid the start `(0, 1)` and the end `(1, 0)` are diagonal, and each empty cell is adjacent to both of them, so any walk reaches the end after covering only one empty cell; the answer is 0.

This problem is the grid version of a **Hamiltonian path** — a path visiting every node once — which has no known polynomial-time algorithm in general. That is why the constraints keep the grid tiny (at most 20 cells) and why backtracking is the expected solution. Compare it with *Unique Paths* (move only right or down, count paths): there, no cell can be revisited by construction, the count from a cell does not depend on the path taken, and DP solves it in O(m · n) — see [[a11-grid-dp]].

```quiz
Q: In Word Search, why is a cell restored to its letter after its neighbours have been explored?
- [ ] To save memory
- [x] Because a later path, starting elsewhere or branching differently, may legitimately need to use that cell
- [ ] Because Java requires arrays to be restored before a method returns
- [ ] To prevent infinite recursion
> The mark means "on the current path". Once the search retreats from a cell, it is no longer on the path, so another path may use it. Leaving the mark makes valid paths look blocked, which causes false negatives such as CABAA on the A C A / B A A board.

Q: Which of these grid problems should mark cells permanently instead of unmarking them?
- [ ] Word Search
- [ ] Unique Paths III
- [x] Number of Islands
- [ ] Rat in a Maze, listing all paths
> Number of Islands asks about regions: once a cell is known to belong to an island, it never needs to be visited again, and unmarking would make the search revisit cells exponentially. The other three ask about paths, where availability depends on the current path.
```

## Many words at once: Word Search II

*Word Search II* gives a board and a list of words and asks which words appear. Running Word Search once per word costs O(w · m · n · 3^L) for `w` words, and repeats the same exploration for words that share prefixes, such as `oath` and `oat`.

The fix is to search for all the words **simultaneously** by walking a **trie** — a tree in which each edge is a letter and each path from the root spells a prefix of some word ([[a12-trie]]). During the DFS, instead of comparing with one word's next letter, you move from the current trie node to its child for the cell's letter. If there is no such child, *no* word continues with this prefix, and the branch is pruned. If the node marks the end of a word, that word is found.

```java title="WordSearchII.java"
import java.util.ArrayList;
import java.util.List;

public class WordSearchII {

    static class Node {
        Node[] next = new Node[26];
        String word;                             // set on the node where a word ends
    }

    static Node buildTrie(String[] words) {
        Node root = new Node();
        for (String w : words) {
            Node cur = root;
            for (char ch : w.toCharArray()) {
                int i = ch - 'a';
                if (cur.next[i] == null) cur.next[i] = new Node();
                cur = cur.next[i];
            }
            cur.word = w;
        }
        return root;
    }

    static void dfs(char[][] b, int r, int c, Node parent, List<String> out) {
        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length) return;
        char ch = b[r][c];
        if (ch == '#') return;                   // already on the current path
        Node node = parent.next[ch - 'a'];
        if (node == null) return;                // no word continues with this prefix
        if (node.word != null) {
            out.add(node.word);
            node.word = null;                    // report each word once
        }
        b[r][c] = '#';
        dfs(b, r + 1, c, node, out);
        dfs(b, r - 1, c, node, out);
        dfs(b, r, c + 1, node, out);
        dfs(b, r, c - 1, node, out);
        b[r][c] = ch;
    }

    static List<String> findWords(char[][] board, String[] words) {
        Node root = buildTrie(words);
        List<String> out = new ArrayList<>();
        for (int r = 0; r < board.length; r++) {
            for (int c = 0; c < board[0].length; c++) {
                dfs(board, r, c, root, out);
            }
        }
        return out;
    }

    public static void main(String[] args) {
        char[][] board = {
            {'o', 'a', 'a', 'n'},
            {'e', 't', 'a', 'e'},
            {'i', 'h', 'k', 'r'},
            {'i', 'f', 'l', 'v'}
        };
        System.out.println(findWords(board, new String[]{"oath", "pea", "eat", "rain"}));
    }
}
```

```output
[oath, eat]
```

Storing the whole word on its final node means the DFS never needs to rebuild the string from the path. Setting `node.word = null` after reporting a word prevents duplicates when the same word can be traced along two different paths. The search does **not** stop after finding a word, because a longer word may continue from the same node (`oat` and then `oath`). A common further optimisation removes trie leaves once their words have been found, so later searches stop even earlier; it matters on the largest test cases.

The `'#'` check must come before the trie lookup, because `'#' - 'a'` is a negative index. This program reports words in the order they are discovered; sort the result if a specific order is required. The GFG problem [[a8-boggle]] is the same idea with eight-directional moves.

## In real systems

**Puzzle solvers and games.** Boggle and word-grid games validate a player's word with Word Search and generate hints with Word Search II over a dictionary trie. Sudoku solvers are grid backtracking with row, column and box constraints, covered in [[a9-constraint-backtracking]].

**Robotics and route enumeration.** When a robot must visit every cell of a small area exactly once — floor coverage, inspection of a few shelves — the problem is Unique Paths III in disguise. For realistic areas, coverage planners use structured sweep patterns rather than exhaustive search, precisely because the backtracking cost grows exponentially.

**Circuit and level design tools.** Checking that a puzzle level or a routed board has a valid path under "no cell reused" rules is a path search; checking connectivity of regions is a flood fill. Knowing which one a requirement asks for avoids both wrong answers and exponential slowdowns.

## Trade-offs and alternatives

| Problem shape | Right tool | Why |
|---|---|---|
| Does a path spelling a word exist / list paths | DFS backtracking with mark and unmark | Availability depends on the current path |
| Count cells of a region, count islands | DFS or BFS with permanent marks — [[a8-flood-fill]] | Each cell needs to be visited once in total |
| Shortest number of steps between cells | BFS — [[a8-bfs-shortest-unweighted]] | BFS reaches cells in order of distance; DFS does not |
| Count monotone paths (right/down only) | DP — [[a11-grid-dp]] | No revisits possible, so subproblems overlap and are path-independent |
| Many words on one board | Backtracking over a trie | Shared prefixes are explored once |

Backtracking is the most general and the most expensive of these. Use it only when the problem genuinely depends on the path, and look for the alternatives first.

## Common mistakes

> [!MISTAKE] Returning before restoring the cell
> `if (dfs(...)) return true;` inside the loop skips `board[r][c] = saved`. The answer is still correct, but the board is left damaged. Record the result, break, restore, then return.

**Global visited for a path problem.** Marking cells permanently causes false negatives whenever the correct path is not the first one explored.

**Checking bounds after reading the cell.** Always validate `r` and `c` before touching `grid[r][c]`.

**Wrong neighbour set.** Four directions and eight directions give different answers. Use a direction table so the choice is visible in one place.

**Marking the start cell twice or not at all.** In counting problems like Unique Paths III, an off-by-one in the step count (`free` vs `free + 1`) produces 0 for every grid. Work out the count on a 1 × 2 grid by hand.

**Running Word Search once per word.** For many words this repeats work; build a trie.

## Interview perspective

Word Search is a frequent interview question because it tests backtracking and grid handling together, and Word Search II is a common follow-up that tests whether you can bring in a data structure to share work.

> [!INTERVIEW] How to present Word Search
> "I'll try every cell as a start. The DFS checks bounds and the letter, marks the cell so it can't be reused on this path, tries four neighbours for the next letter, and restores the cell on the way back, because another path might need it. Time is O(m · n · 3^L) since after the first step there are at most three new directions; space is O(L) for the recursion."

Questions to prepare:

- **Why not BFS for Word Search?** BFS keeps one global visited set and explores by distance; the problem needs a per-path visited set and a specific sequence of letters.
- **Why can't you memoize `(r, c, idx)`?** The answer depends on which cells the current path has already used.
- **Word Search II?** Build a trie of the words, DFS from each cell following trie edges, collect words at end nodes, and remove found words.
- **Mark in place or use a visited array?** In place saves O(m · n) memory but modifies the input; a separate array is cleaner when the input must not be touched.
- **Follow-up: path with maximum gold.** Same template, returning the best sum from each cell instead of a boolean.

## Practice

1. **Word Search.** Implement it with in-place marking, then with a `boolean[][]`, and confirm both leave the board unchanged.
2. **Word Search II.** Implement the trie version and add leaf removal after a word is found.
3. **Rat in a Maze.** List all paths for a 5 × 5 maze; make sure the output is in lexicographic order without sorting.
4. **Unique Paths III.** Implement it and test the three grids above.
5. **Path with Maximum Gold.** From any non-zero cell, walk through non-zero cells without revisiting, and return the largest total collected.
6. **Classify.** For "number of islands", "shortest path in a binary matrix" and "word search", say whether you would use permanent marks, BFS or backtracking, and why.

The DSA explorer lists matching problems under this topic; start with *Word Search*, *Word Search II* and *Unique Paths III*.

## Quick revision {#quick-revision}

- Template: bounds check → rule check (letter, wall, already on path) → mark → explore neighbours → unmark.
- Directions: `{{1,0},{-1,0},{0,1},{0,-1}}`; add diagonals only if the problem says so.
- Mark in place (`'#'`, `-1`) or with `boolean[][] onPath`; restore before returning, even on success.
- Path problems unmark; region problems (flood fill, islands, BFS) mark permanently.
- Word Search: O(m · n · 3^L) time (4 directions first step, then 3), O(L) stack.
- `(r, c, idx)` cannot be memoized: the state includes the set of cells on the path.
- Listing paths: keep a `StringBuilder` of moves; order directions to get sorted output.
- Counting cover-all paths: pass the number of steps left; succeed at the end only when it is 0.
- Many words: DFS over a trie; prune when the trie has no child for the cell's letter.

## Key takeaways {#key-takeaways}

- Grid backtracking is DFS where a cell's "visited" state belongs to the current path, so it is set on the way in and cleared on the way out.
- Forgetting to clear it gives false negatives whenever the correct path is not the first one tried; clearing it in a region problem gives exponential time.
- Check bounds before reading the grid, and restore the cell even when the search succeeds.
- The cost is exponential in path length, which is why the letter check, letter-count pre-checks and tries matter so much in practice.
- Choose the tool by the question: paths need backtracking, regions need flood fill, distances need BFS and monotone counts need DP.
