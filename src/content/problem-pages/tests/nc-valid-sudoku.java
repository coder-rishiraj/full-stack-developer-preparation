import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Valid Sudoku page (run by `npm run problems:verify`).
 * Each approach is compiled together with this file and must pass all cases.
 * Boards are written as nine strings of nine characters, '1'-'9' or '.'.
 */
class Tests {
    static int cases = 0;

    // Example 1 in section 1: a valid, sparsely filled board
    static final String[] EXAMPLE_1 = {
        "8....3...",
        "..4....9.",
        ".6.2....1",
        "....7.5..",
        "3.......8",
        "..9.1....",
        "1....8.4.",
        ".5....6..",
        "...9....2",
    };

    // Example 2 in section 1 and the dry runs: Example 1 plus a 4 at row 2, column 0.
    // Only the top-left box repeats a digit; no row or column does.
    static final String[] EXAMPLE_2 = {
        "8....3...",
        "..4....9.",
        "46.2....1",
        "....7.5..",
        "3.......8",
        "..9.1....",
        "1....8.4.",
        ".5....6..",
        "...9....2",
    };

    public static void main(String[] args) {
        check(EXAMPLE_1, true);
        check(EXAMPLE_2, false);

        // Edge cases listed in section 3 and traced in section 7
        check(empty(), true);                                   // nothing filled: valid
        check(solved(), true);                                  // a complete, correct grid
        check(set(empty(), 4, 0, '7', 4, 8, '7'), false);       // a row repeat only (boxes 3 and 5 differ)
        check(set(empty(), 0, 6, '3', 8, 6, '3'), false);       // a column repeat only (boxes 2 and 8 differ)
        check(set(empty(), 6, 6, '9', 8, 8, '9'), false);       // a box repeat only, in the last box
        check(set(empty(), 0, 3, '5', 3, 0, '5'), true);        // boxes 1 and 3: r/3 + c/3 would call them one box
        check(set(empty(), 0, 0, '5', 3, 3, '5'), true);        // boxes 0 and 4: (r%3)*3 + c%3 would call them one box
        check(set(empty(), 8, 0, '9', 8, 8, '9'), false);       // repeat in the last row, digit 9
        check(set(empty(), 0, 8, '1', 8, 8, '1'), false);       // repeat in the last column, digit 1
        check(unsolvable(), true);                              // valid, although no solution exists
        String[] lastCell = solved();
        lastCell[8] = lastCell[8].substring(0, 8) + lastCell[8].charAt(0);
        check(lastCell, false);                                 // the only repeat involves the very last cell

        // Random boards checked against an independent pairwise reference
        Random random = new Random(20261113L);
        int[] counts = new int[2];
        for (int r = 0; r < 4000; r++) {
            String[] board;
            if (r % 2 == 0) {
                // A blanked, relabelled solution: valid, then sometimes one random digit written over a cell
                board = relabel(solved(), random);
                double keep = random.nextDouble();
                for (int i = 0; i < 9; i++) {
                    for (int j = 0; j < 9; j++) {
                        if (random.nextDouble() > keep) {
                            board = set(board, i, j, '.');
                        }
                    }
                }
                if (random.nextBoolean()) {
                    board = set(board, random.nextInt(9), random.nextInt(9), (char) ('1' + random.nextInt(9)));
                }
            } else {
                // Independent random cells at a low density
                board = empty();
                int filled = random.nextInt(25);
                for (int k = 0; k < filled; k++) {
                    board = set(board, random.nextInt(9), random.nextInt(9), (char) ('1' + random.nextInt(9)));
                }
            }
            boolean want = reference(board);
            counts[want ? 1 : 0]++;
            check(board, want);
        }
        if (counts[0] < 500 || counts[1] < 500) {
            throw new IllegalStateException("bad test set: random boards are not a mix of valid and invalid " + Arrays.toString(counts));
        }

        System.out.println("PASS " + cases + " cases");
    }

    static String[] empty() {
        String[] b = new String[9];
        Arrays.fill(b, ".........");
        return b;
    }

    /** A complete valid grid: (3r + r/3 + c) mod 9, plus 1. */
    static String[] solved() {
        String[] b = new String[9];
        for (int r = 0; r < 9; r++) {
            StringBuilder sb = new StringBuilder();
            for (int c = 0; c < 9; c++) {
                sb.append((char) ('1' + (r * 3 + r / 3 + c) % 9));
            }
            b[r] = sb.toString();
        }
        return b;
    }

    /** Row 0 holds 1-8 in columns 1-8, so (0,0) must be 9; but column 0 already has a 9 at row 3. */
    static String[] unsolvable() {
        String[] b = empty();
        b[0] = ".12345678";
        b[3] = "9........";
        return b;
    }

    static String[] relabel(String[] b, Random random) {
        char[] map = "123456789".toCharArray();
        for (int i = 8; i > 0; i--) {
            int j = random.nextInt(i + 1);
            char t = map[i];
            map[i] = map[j];
            map[j] = t;
        }
        String[] out = new String[9];
        for (int r = 0; r < 9; r++) {
            StringBuilder sb = new StringBuilder();
            for (char ch : b[r].toCharArray()) {
                sb.append(ch == '.' ? '.' : map[ch - '1']);
            }
            out[r] = sb.toString();
        }
        return out;
    }

    static String[] set(String[] b, int r, int c, char ch) {
        String[] out = b.clone();
        char[] row = out[r].toCharArray();
        row[c] = ch;
        out[r] = new String(row);
        return out;
    }

    static String[] set(String[] b, int r1, int c1, char ch1, int r2, int c2, char ch2) {
        return set(set(b, r1, c1, ch1), r2, c2, ch2);
    }

    /** Independent reference: two filled cells conflict if they hold the same digit and share a row, a column or a 3x3 block. */
    static boolean reference(String[] b) {
        for (int p = 0; p < 81; p++) {
            for (int q = p + 1; q < 81; q++) {
                int r1 = p / 9, c1 = p % 9, r2 = q / 9, c2 = q % 9;
                char x = b[r1].charAt(c1);
                if (x == '.' || x != b[r2].charAt(c2)) {
                    continue;
                }
                boolean sameBlock = r1 / 3 == r2 / 3 && c1 / 3 == c2 / 3;
                if (r1 == r2 || c1 == c2 || sameBlock) {
                    return false;
                }
            }
        }
        return true;
    }

    static void validate(String[] b) {
        if (b.length != 9) {
            throw new IllegalStateException("bad test case: board must have 9 rows");
        }
        for (String row : b) {
            if (row.length() != 9) {
                throw new IllegalStateException("bad test case: every row must have 9 cells");
            }
            for (char ch : row.toCharArray()) {
                if (ch != '.' && (ch < '1' || ch > '9')) {
                    throw new IllegalStateException("bad test case: a cell must be '1'-'9' or '.'");
                }
            }
        }
    }

    static void check(String[] rows, boolean expected) {
        validate(rows);
        if (reference(rows) != expected) {
            throw new IllegalStateException("bad test case, expected answer is wrong: " + String.join("/", rows));
        }
        char[][] board = new char[9][];
        for (int r = 0; r < 9; r++) {
            board[r] = rows[r].toCharArray();
        }
        boolean got = new Solution().isValidSudoku(board);
        if (got != expected) {
            throw new AssertionError(String.join("/", rows) + ": expected " + expected + " but got " + got);
        }
        for (int r = 0; r < 9; r++) {
            if (!rows[r].equals(new String(board[r]))) {
                throw new AssertionError(String.join("/", rows) + ": the board was modified");
            }
        }
        cases++;
    }
}
