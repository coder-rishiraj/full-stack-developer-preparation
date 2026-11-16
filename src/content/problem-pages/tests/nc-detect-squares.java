import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Tests for every "class DetectSquares" on the Detect Squares page (run by `npm run problems:verify`).
 *
 * Each Run drives one DetectSquares through the public API (add / count) and checks every count against
 * independent references: a brute force over all triples of stored points (small runs only) and a
 * count grid enumerated by side length and direction. Every run respects the constraints
 * (0 <= x, y <= 1000, at most 3000 calls per object).
 *
 * The page's two "Alternative" rungs are cubic and quadratic per count by design. They are compiled
 * and run against all the small and medium cases below, but the 3000-call cases would take them
 * minutes, so two timed probes classify the implementation first: the heavy section runs only when
 * count is measured to be faster than quadratic. (A misclassification can only skip the heavy section,
 * never fail a correct solution.) Every numbered approach and the count-grid alternative run it.
 */
class Tests {
    static final int MAX = 1000;
    static final int MAX_CALLS = 3000;
    static int cases = 0;

    static final class Run {
        final String label;
        final DetectSquares ds = new DetectSquares();
        final int[][] grid = new int[MAX + 1][MAX + 1];
        final List<int[]> points = new ArrayList<>();
        final boolean brute;
        int calls = 0;
        long nanos = 0;

        Run(String label, boolean brute) {
            this.label = label;
            this.brute = brute;
        }

        void call(int x, int y) {
            // Guard: the test case itself must be valid.
            if (x < 0 || x > MAX || y < 0 || y > MAX) throw new IllegalStateException(label + ": bad test case, point out of range");
            if (++calls > MAX_CALLS) throw new IllegalStateException(label + ": bad test case, more than 3000 calls");
        }

        Run add(int x, int y) {
            call(x, y);
            long t = System.nanoTime();
            ds.add(new int[] {x, y});
            nanos += System.nanoTime() - t;
            grid[x][y]++;
            if (brute) points.add(new int[] {x, y});
            return this;
        }

        Run add(int x, int y, int times) {
            for (int i = 0; i < times; i++) add(x, y);
            return this;
        }

        Run count(int x, int y) {
            return count(x, y, -1);
        }

        Run count(int x, int y, long expected) {
            call(x, y);
            long want = gridReference(x, y);
            if (brute) {
                long b = bruteReference(x, y);
                if (b != want) throw new IllegalStateException(label + ": references disagree, brute " + b + " vs grid " + want);
            }
            if (expected >= 0 && expected != want) {
                throw new IllegalStateException(label + ": bad test case, stated answer " + expected + " but references say " + want);
            }
            int[] q = {x, y};
            long t = System.nanoTime();
            int got = ds.count(q);
            nanos += System.nanoTime() - t;
            if (q[0] != x || q[1] != y) throw new AssertionError(label + ": count modified its argument");
            if (got != want) {
                throw new AssertionError(label + ": count([" + x + ", " + y + "]) = " + got + ", expected " + want);
            }
            cases++;
            return this;
        }

        int cell(int x, int y) {
            return x < 0 || x > MAX || y < 0 || y > MAX ? 0 : grid[x][y];
        }

        /** Every square with q as a corner, by side length s and direction (sx, sy). */
        long gridReference(int qx, int qy) {
            long total = 0;
            for (int s = 1; s <= MAX; s++) {
                for (int sx = -1; sx <= 1; sx += 2) {
                    for (int sy = -1; sy <= 1; sy += 2) {
                        total += (long) cell(qx + sx * s, qy + sy * s) * cell(qx, qy + sy * s) * cell(qx + sx * s, qy);
                    }
                }
            }
            if (total > Integer.MAX_VALUE) throw new IllegalStateException(label + ": answer exceeds int");
            return total;
        }

        /** Number of triples of stored points that complete an axis-aligned square of positive area with q. */
        long bruteReference(int qx, int qy) {
            int n = points.size();
            long total = 0;
            int[] q = {qx, qy};
            for (int i = 0; i < n; i++)
                for (int j = i + 1; j < n; j++)
                    for (int l = j + 1; l < n; l++)
                        if (square(q, points.get(i), points.get(j), points.get(l))) total++;
            return total;
        }
    }

    static boolean square(int[]... p) {
        int minX = Integer.MAX_VALUE, maxX = Integer.MIN_VALUE, minY = Integer.MAX_VALUE, maxY = Integer.MIN_VALUE;
        for (int[] a : p) {
            minX = Math.min(minX, a[0]);
            maxX = Math.max(maxX, a[0]);
            minY = Math.min(minY, a[1]);
            maxY = Math.max(maxY, a[1]);
        }
        if (maxX == minX || maxX - minX != maxY - minY) return false;
        boolean[] used = new boolean[4];
        for (int[] a : p) {
            if ((a[0] != minX && a[0] != maxX) || (a[1] != minY && a[1] != maxY)) return false;
            int c = (a[0] == maxX ? 2 : 0) + (a[1] == maxY ? 1 : 0);
            if (used[c]) return false;
            used[c] = true;
        }
        return true;
    }

    public static void main(String[] args) {
        // Example 1 (official) and Example 2: also the dry runs of every rung
        new Run("example 1", true).add(3, 10).add(11, 2).add(3, 2).count(11, 10, 1).count(14, 8, 0).add(11, 2).count(11, 10, 2);
        new Run("example 2", true).add(1, 1).add(1, 3).add(3, 1).add(3, 3).count(1, 1, 1).count(2, 2, 0);

        // Edge cases from section 3, traced in section 7
        new Run("empty", true).count(0, 0, 0).count(MAX, MAX, 0);
        new Run("zero area", true).add(1, 1).count(1, 1, 0).add(1, 1).count(1, 1, 0);
        new Run("below-left", true).add(0, 0).add(0, 5).add(5, 0).count(5, 5, 1);
        new Run("rectangle", true).add(0, 1).add(2, 0).add(2, 1).count(0, 0, 0);
        new Run("four squares", true).add(0, 0).add(0, 1).add(0, 2).add(1, 0).add(1, 2).add(2, 0).add(2, 1).add(2, 2).count(1, 1, 4);
        new Run("key 1000 collision", true).add(1, 1).add(0, 1).add(0, 1000).count(0, 0, 0);
        new Run("largest square", true).add(0, MAX).add(MAX, 0).add(MAX, MAX).count(0, 0, 1).add(0, 0).count(MAX, MAX, 1).count(0, MAX, 1);
        new Run("diagonal only", true).add(4, 4).add(4, 4).count(0, 0, 0).add(0, 4).count(0, 0, 0).add(4, 0, 3).count(0, 0, 6);
        new Run("query stored and used elsewhere", true).add(2, 2).add(2, 4).add(4, 2).add(4, 4).count(2, 2, 1).count(4, 4, 1).count(3, 3, 0);
        new Run("duplicates multiply", true).add(1, 5, 2).add(5, 1, 3).add(5, 5, 4).count(1, 1, 24);

        // Medium: 120 points in a 6 x 6 block with many duplicates, 30 counts (fine even for the cubic rung)
        Random random = new Random(20261116L);
        Run medium = new Run("medium", true);
        for (int i = 0; i < 120; i++) medium.add(10 + random.nextInt(6), 20 + random.nextInt(6));
        for (int i = 0; i < 30; i++) medium.count(9 + random.nextInt(8), 19 + random.nextInt(8));

        // Random small sequences, both references
        for (int r = 0; r < 1500; r++) {
            Run run = new Run("random " + r, true);
            int base = random.nextInt(4) == 0 ? MAX - 4 : random.nextInt(MAX - 4);
            int ops = 1 + random.nextInt(30);
            for (int i = 0; i < ops; i++) {
                int x = base + random.nextInt(5);
                int y = (random.nextBoolean() ? base : random.nextInt(4) == 0 ? 0 : base) + random.nextInt(5);
                if (random.nextInt(3) == 0) run.count(x, y);
                else run.add(x, y);
            }
            run.count(base + random.nextInt(5), base + random.nextInt(5));
        }

        // Probe 1: 300 distinct points, 3 counts (cubic per count is about 1.3 * 10^7 checks)
        Run probe1 = new Run("probe 1", false);
        for (int i = 0; i < 300; i++) probe1.add(i, (i * 7) % 300);
        for (int i = 0; i < 3; i++) probe1.count(i * 50, 150);
        boolean fast = probe1.nanos < 40_000_000L;
        // Probe 2: 1200 points on the diagonal of (0, 0), 40 counts at (0, 0)
        // (quadratic per count is about 3 * 10^6 steps per count)
        if (fast) {
            Run probe2 = new Run("probe 2", false);
            for (int i = 1; i <= 1200; i++) probe2.add(Math.min(i, MAX), Math.min(i, MAX));
            probe2.add(0, 7).add(7, 0);
            for (int i = 0; i < 40; i++) probe2.count(0, 0);
            fast = probe2.nanos < 20_000_000L;
        }

        if (fast) {
            // Largest answer: 999,000,000 (3000 calls)
            new Run("max answer", false).add(0, MAX, 1000).add(MAX, 0, 1000).add(MAX, MAX, 999).count(0, 0, 999_000_000L);

            // A full column of 1001 heights around x = 500, then 1999 counts on and near it
            Run column = new Run("full column", false);
            for (int y = 0; y <= MAX; y++) column.add(500, y);
            for (int i = 0; i < 1999; i++) {
                int x = i % 2 == 0 ? 500 : 500 + random.nextInt(21) - 10;
                if (i % 7 == 0) column.add(500 + random.nextInt(21) - 10, random.nextInt(MAX + 1));
                else column.count(x, random.nextInt(MAX + 1));
            }

            // 1500 distinct random points over the whole grid, then 1500 counts
            Run spread = new Run("spread", false);
            for (int i = 0; i < 1500; i++) spread.add(random.nextInt(MAX + 1), random.nextInt(MAX + 1));
            for (int i = 0; i < 1500; i++) spread.count(random.nextInt(MAX + 1), random.nextInt(MAX + 1));

            // 1500 adds into a 10 x 10 block (heavy duplicates), then 1500 counts in and around it
            Run block = new Run("dense block", false);
            for (int i = 0; i < 1500; i++) block.add(MAX - random.nextInt(10), MAX - random.nextInt(10));
            for (int i = 0; i < 1500; i++) block.count(MAX - random.nextInt(12), MAX - random.nextInt(12));

            // Interleaved adds and counts on a lattice of step 100, 3000 calls
            Run lattice = new Run("lattice", false);
            for (int i = 0; i < MAX_CALLS; i++) {
                int x = 100 * random.nextInt(11);
                int y = 100 * random.nextInt(11);
                if (i % 2 == 0) lattice.add(x, y);
                else lattice.count(x, y);
            }
        } else {
            System.out.println("3000-call cases skipped: count measured at least quadratic per count (expected only for the page's Alternatives)");
        }

        // Guard: an invalid test case is rejected
        try {
            new Run("guard", false).add(MAX + 1, 0);
            throw new AssertionError("the guard should reject x = 1001");
        } catch (IllegalStateException expected) {
            cases++;
        }

        System.out.println("PASS " + cases + " cases");
    }
}
