import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Search a 2D Matrix page.
 * Reference: a linear scan over every cell, which knows nothing about the ordering.
 * Matrices cover 1 x 1, 1 x n, m x 1, duplicates inside a row, the value limits and 100 x 100.
 */
class Tests {
    static int cases = 0;

    static void validate(int[][] m, int target) {
        if (m.length < 1 || m.length > 100) throw new IllegalStateException("bad test case: m = " + m.length);
        int n = m[0].length;
        if (n < 1 || n > 100) throw new IllegalStateException("bad test case: n = " + n);
        if (target < -10_000 || target > 10_000) throw new IllegalStateException("bad test case: target " + target);
        for (int r = 0; r < m.length; r++) {
            if (m[r].length != n) throw new IllegalStateException("bad test case: ragged row " + r);
            for (int c = 0; c < n; c++) {
                int v = m[r][c];
                if (v < -10_000 || v > 10_000) throw new IllegalStateException("bad test case: value " + v);
                if (c > 0 && m[r][c - 1] > v) throw new IllegalStateException("bad test case: row " + r + " decreases");
            }
            if (r > 0 && m[r][0] <= m[r - 1][n - 1]) throw new IllegalStateException("bad test case: row " + r + " does not start above the previous row");
        }
    }

    static boolean linear(int[][] m, int target) {
        for (int[] row : m) for (int v : row) if (v == target) return true;
        return false;
    }

    static int[][] deepCopy(int[][] m) {
        int[][] c = new int[m.length][];
        for (int i = 0; i < m.length; i++) c[i] = m[i].clone();
        return c;
    }

    static void check(int[][] m, int target, Boolean expected) {
        validate(m, target);
        boolean want = linear(m, target);
        if (expected != null && expected != want) throw new IllegalStateException("bad test case: expected " + expected + " should be " + want);
        int[][] input = deepCopy(m);
        boolean got = new Solution().searchMatrix(input, target);
        if (!Arrays.deepEquals(input, m)) throw new AssertionError("matrix was modified");
        if (got != want) {
            String shown = m.length * m[0].length <= 30 ? Arrays.deepToString(m) : m.length + " x " + m[0].length;
            throw new AssertionError(shown + ", target = " + target + ": expected " + want + " but got " + got);
        }
        cases++;
    }

    /** Every value in the matrix, one below and one above each, and the value limits. */
    static void checkAllTargets(int[][] m) {
        for (int[] row : m) {
            for (int v : row) {
                for (int t = v - 1; t <= v + 1; t++) {
                    if (t >= -10_000 && t <= 10_000) check(m, t, null);
                }
            }
        }
        check(m, -10_000, null);
        check(m, 10_000, null);
    }

    /** A valid random m x n matrix: non-decreasing rows, each row starting above the previous row's end. */
    static int[][] random(Random random, int m, int n, int maxStep) {
        int[][] a = new int[m][n];
        int total = m * n;
        // Leave enough room so that the last value stays within 10^4.
        int span = 20_000 - total;
        int start = -10_000 + random.nextInt(Math.max(1, Math.min(span, 2_000) + 1));
        int v = start;
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (r == 0 && c == 0) {
                    a[r][c] = v;
                    continue;
                }
                int step = c == 0 ? 1 + random.nextInt(maxStep) : random.nextInt(maxStep + 1);
                if (v + step > 10_000 - (total - r * n - c)) step = c == 0 ? 1 : 0;
                v += step;
                a[r][c] = v;
            }
        }
        return a;
    }

    public static void main(String[] args) {
        int[][] example = {{2, 5, 8, 11}, {14, 17, 19, 23}, {30, 34, 40, 45}};
        // Examples, dry runs and traces (sections 1, 4 and 7)
        check(example, 19, true);
        check(example, 13, false);
        check(example, 1, false);
        check(example, 50, false);
        check(example, 45, true);
        check(example, 2, true);
        check(example, 11, true);   // the claimed bug with mid / m misses it (section 11)
        check(example, 24, false);  // between rows
        check(new int[][] {{5}}, 5, true);
        check(new int[][] {{5}}, 4, false);
        check(new int[][] {{5}}, 6, false);
        check(new int[][] {{1}, {3}, {5}}, 3, true);
        check(new int[][] {{1}, {3}, {5}}, 4, false);
        check(new int[][] {{1, 3, 5, 7, 9}}, 7, true);
        check(new int[][] {{1, 3, 5, 7, 9}}, 8, false);
        check(new int[][] {{1, 1, 2, 2}, {3, 3, 3, 4}}, 3, true); // duplicates inside a row
        check(new int[][] {{1, 1, 2, 2}, {3, 3, 3, 4}}, 0, false);
        checkAllTargets(example);

        // Value limits
        check(new int[][] {{-10_000, 10_000}}, -10_000, true);
        check(new int[][] {{-10_000, 10_000}}, 10_000, true);
        check(new int[][] {{-10_000}, {10_000}}, 0, false);

        // 100 x 100 with consecutive values: every target and its neighbours
        int[][] big = new int[100][100];
        for (int r = 0; r < 100; r++) for (int c = 0; c < 100; c++) big[r][c] = -5_000 + r * 100 + c;
        checkAllTargets(big);
        int[][] wide = new int[100][100];
        for (int r = 0; r < 100; r++) for (int c = 0; c < 100; c++) wide[r][c] = -9_999 + 2 * (r * 100 + c);
        checkAllTargets(wide); // gaps of 1 between consecutive values

        // Random matrices of every shape, including 1 x n and m x 1
        Random random = new Random(20261115L);
        for (int t = 0; t < 1500; t++) {
            int m, n;
            switch (t % 5) {
                case 0: m = 1; n = 1 + random.nextInt(100); break;
                case 1: m = 1 + random.nextInt(100); n = 1; break;
                case 2: m = 1 + random.nextInt(6); n = 1 + random.nextInt(6); break;
                case 3: m = 100; n = 100; break;
                default: m = 1 + random.nextInt(100); n = 1 + random.nextInt(100);
            }
            int maxStep = 1 + random.nextInt(m * n <= 2_000 ? 8 : 1);
            int[][] a = random(random, m, n, maxStep);
            for (int q = 0; q < 6; q++) {
                int r = random.nextInt(m), c = random.nextInt(n);
                int target = a[r][c] + random.nextInt(3) - 1;
                if (target >= -10_000 && target <= 10_000) check(a, target, null);
            }
            check(a, Math.max(-10_000, a[0][0] - 1 - random.nextInt(5)), null);
            check(a, Math.min(10_000, a[m - 1][n - 1] + 1 + random.nextInt(5)), null);
        }

        System.out.println("PASS " + cases + " cases");
    }
}
