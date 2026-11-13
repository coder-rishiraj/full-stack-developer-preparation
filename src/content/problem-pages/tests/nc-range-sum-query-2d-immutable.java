import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class NumMatrix" on the Range Sum Query 2D - Immutable page (run by
 * `npm run problems:verify`). Each approach is compiled together with this file and must pass all cases.
 * Every query is checked against an independent cell-by-cell sum computed in long.
 */
class Tests {
    static final int MAX_DIM = 200;
    static final int MAX_VALUE = 10_000;
    static final int MAX_QUERIES = 10_000;
    static int cases = 0;

    /** Validates the grid against the problem's guarantees and returns a deep copy. */
    static int[][] validated(int[][] matrix) {
        int m = matrix.length;
        if (m < 1 || m > MAX_DIM) throw new IllegalStateException("bad test case: m = " + m);
        int n = matrix[0].length;
        if (n < 1 || n > MAX_DIM) throw new IllegalStateException("bad test case: n = " + n);
        int[][] copy = new int[m][];
        for (int r = 0; r < m; r++) {
            if (matrix[r].length != n) throw new IllegalStateException("bad test case: ragged row " + r);
            for (int v : matrix[r]) {
                if (v < -MAX_VALUE || v > MAX_VALUE) throw new IllegalStateException("bad test case: value " + v);
            }
            copy[r] = matrix[r].clone();
        }
        return copy;
    }

    static long reference(int[][] matrix, int r1, int c1, int r2, int c2) {
        long sum = 0;
        for (int r = r1; r <= r2; r++) {
            for (int c = c1; c <= c2; c++) {
                sum += matrix[r][c];
            }
        }
        return sum;
    }

    /** Builds a NumMatrix and runs the queries; each query is {row1, col1, row2, col2[, expected]}. */
    static void check(String label, int[][] matrix, int[][] queries) {
        int[][] original = validated(matrix);
        if (queries.length > MAX_QUERIES) throw new IllegalStateException(label + ": bad test case, too many queries");
        int m = original.length;
        int n = original[0].length;
        NumMatrix numMatrix = new NumMatrix(matrix);
        for (int[] q : queries) {
            int r1 = q[0], c1 = q[1], r2 = q[2], c2 = q[3];
            if (r1 < 0 || r1 > r2 || r2 >= m || c1 < 0 || c1 > c2 || c2 >= n) {
                throw new IllegalStateException(label + ": bad test case, query " + Arrays.toString(q));
            }
            long want = reference(original, r1, c1, r2, c2);
            if (q.length == 5 && q[4] != want) {
                throw new IllegalStateException(label + ": bad test case, expected value for " + Arrays.toString(q) + " should be " + want);
            }
            int got = numMatrix.sumRegion(r1, c1, r2, c2);
            if (got != want) {
                throw new AssertionError(label + ": sumRegion" + Arrays.toString(Arrays.copyOf(q, 4)) + " expected " + want + " but got " + got);
            }
        }
        for (int r = 0; r < m; r++) {
            if (!Arrays.equals(original[r], matrix[r])) throw new AssertionError(label + ": the input matrix was modified");
        }
        cases++;
    }

    public static void main(String[] args) {
        // The example in section 1, used by every dry run and the traces in section 7
        int[][] example = {{3, -1, 2}, {0, 4, -2}, {5, 1, 1}};
        check("example", example, new int[][] {
            {1, 1, 2, 2, 4}, {0, 0, 2, 0, 8}, {0, 0, 2, 2, 13}, {1, 2, 1, 2, -2},
            {0, 0, 0, 0, 3}, {0, 0, 1, 2, 6}, {0, 0, 2, 1, 12}, {2, 2, 2, 2, 1},
        });
        // The LeetCode sample grid
        int[][] sample = {{3, 0, 1, 4, 2}, {5, 6, 3, 2, 1}, {1, 2, 0, 1, 5}, {4, 1, 0, 1, 7}, {1, 0, 3, 0, 5}};
        check("sample", sample, new int[][] {{2, 1, 4, 3, 8}, {1, 1, 2, 2, 11}, {1, 2, 2, 4, 12}});

        // Edge cases from section 3 and section 7
        check("1x1", new int[][] {{7}}, new int[][] {{0, 0, 0, 0, 7}});
        check("1x1 negative", new int[][] {{-10_000}}, new int[][] {{0, 0, 0, 0, -10_000}});
        check("single row", new int[][] {{1, 2, 3, 4}}, new int[][] {{0, 1, 0, 2, 5}, {0, 0, 0, 3, 10}, {0, 3, 0, 3, 4}});
        check("single column", new int[][] {{1}, {2}, {3}, {4}}, new int[][] {{1, 0, 2, 0, 5}, {0, 0, 3, 0, 10}, {0, 0, 0, 0, 1}});
        check("zeros", new int[][] {{0, 0}, {0, 0}}, new int[][] {{0, 0, 1, 1, 0}, {1, 1, 1, 1, 0}});

        // Overflow boundary: 200 x 200 of +10^4 and of -10^4, whole grid and other large rectangles
        for (int sign : new int[] {1, -1}) {
            int[][] full = new int[MAX_DIM][MAX_DIM];
            for (int[] row : full) Arrays.fill(row, sign * MAX_VALUE);
            check("extreme " + sign, full, new int[][] {
                {0, 0, 199, 199, sign * 400_000_000}, {1, 1, 199, 199}, {0, 0, 198, 198}, {199, 199, 199, 199},
            });
        }
        // Checkerboard of +-10^4 with a large positive corner block: big mixed-sign prefix values
        int[][] mixed = new int[MAX_DIM][MAX_DIM];
        for (int r = 0; r < MAX_DIM; r++) {
            for (int c = 0; c < MAX_DIM; c++) {
                mixed[r][c] = (r < 100 && c < 100) ? MAX_VALUE : ((r + c) % 2 == 0 ? MAX_VALUE : -MAX_VALUE);
            }
        }
        check("mixed extreme", mixed, new int[][] {{0, 0, 199, 199}, {100, 100, 199, 199}, {0, 100, 99, 199}, {50, 50, 150, 150}});

        // Largest input: 200 x 200 random grid and 10^4 random queries (about half of them whole-grid)
        Random random = new Random(20261113L);
        int[][] big = new int[MAX_DIM][MAX_DIM];
        for (int[] row : big) {
            for (int c = 0; c < MAX_DIM; c++) row[c] = random.nextInt(2 * MAX_VALUE + 1) - MAX_VALUE;
        }
        int[][] bigQueries = new int[MAX_QUERIES][];
        for (int i = 0; i < MAX_QUERIES; i++) {
            bigQueries[i] = i % 2 == 0 ? new int[] {0, 0, MAX_DIM - 1, MAX_DIM - 1} : randomQuery(random, MAX_DIM, MAX_DIM);
        }
        check("max size", big, bigQueries);

        // Random grids of random shapes and values, checked against the reference sum
        for (int t = 0; t < 1500; t++) {
            int m = 1 + random.nextInt(t < 1200 ? 6 : 40);
            int n = 1 + random.nextInt(t < 1200 ? 6 : 40);
            int bound = random.nextBoolean() ? 5 : MAX_VALUE;
            int[][] grid = new int[m][n];
            for (int[] row : grid) {
                for (int c = 0; c < n; c++) row[c] = random.nextInt(2 * bound + 1) - bound;
            }
            int[][] queries = new int[1 + random.nextInt(40)][];
            for (int i = 0; i < queries.length; i++) queries[i] = randomQuery(random, m, n);
            check("random " + t, grid, queries);
        }

        System.out.println("PASS " + cases + " cases");
    }

    static int[] randomQuery(Random random, int m, int n) {
        int a = random.nextInt(m), b = random.nextInt(m), c = random.nextInt(n), d = random.nextInt(n);
        return new int[] {Math.min(a, b), Math.min(c, d), Math.max(a, b), Math.max(c, d)};
    }
}
