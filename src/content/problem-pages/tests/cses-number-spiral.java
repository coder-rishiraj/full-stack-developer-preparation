import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Tests for every "public class Main" on the Number Spiral page (run by `npm run problems:verify`).
 * The imported official CSES data has no tests for this problem (all of them are large), so the
 * programs are checked against a grid built by walking the spiral cell by cell, and against an
 * independent BigInteger formula for coordinates up to 10^9.
 */
class Tests {
    static int cases = 0;
    static final long LIMIT = 1_000_000_000L;

    public static void main(String[] args) throws Exception {
        // Example from the statement
        expect("3\n2 3\n1 1\n4 2\n", "8 1 15");

        // The first five layers exactly as the statement draws them
        long[][] picture = {
            {1, 2, 9, 10, 25},
            {4, 3, 8, 11, 24},
            {5, 6, 7, 12, 23},
            {16, 15, 14, 13, 22},
            {17, 18, 19, 20, 21},
        };
        StringBuilder in = new StringBuilder("25\n");
        StringBuilder want = new StringBuilder();
        for (int y = 1; y <= 5; y++) {
            for (int x = 1; x <= 5; x++) {
                in.append(y).append(' ').append(x).append('\n');
                want.append(picture[y - 1][x - 1]).append(' ');
            }
        }
        expect(in.toString(), want.toString());

        // Dry-run inputs from section 4 and the traces in section 7
        expect("4\n2 3\n4 2\n5 3\n1 4\n", "8 15 19 10");
        expect("3\n3 2\n2 4\n1 1\n", "6 11 1");
        expect("1\n1 1\n", "1");
        expect("3\n1 5\n5 1\n4 1\n", "25 17 16");   // ends of shells 5 and 4

        // Every cell of a 120 x 120 corner, against the walked grid
        int n = 120;
        long[][] grid = walkedGrid(n);
        for (int y = 1; y <= 5; y++) {
            for (int x = 1; x <= 5; x++) {
                if (grid[y][x] != picture[y - 1][x - 1]) throw new AssertionError("walked grid disagrees with the picture");
            }
        }
        in = new StringBuilder().append(n * n).append('\n');
        want = new StringBuilder();
        for (int y = 1; y <= n; y++) {
            for (int x = 1; x <= n; x++) {
                in.append(y).append(' ').append(x).append('\n');
                want.append(grid[y][x]).append(' ');
                if (!BigInteger.valueOf(grid[y][x]).equals(reference(y, x))) throw new AssertionError("reference disagrees with grid at " + y + "," + x);
            }
        }
        expect(in.toString(), want.toString());

        // Constraint extremes (values near 10^18), both layer parities
        check(LIMIT, 1);              // the largest answer: exactly 10^18
        check(1, LIMIT);
        check(LIMIT, LIMIT);
        check(LIMIT - 1, 1);          // odd layer 999,999,999
        check(1, LIMIT - 1);
        check(LIMIT - 1, LIMIT - 1);
        check(LIMIT, LIMIT - 1);
        check(LIMIT - 1, LIMIT);
        check(46341, 1);              // first layer whose k * k overflows an int
        check(1, 46341);
        check(46340, 46340);
        assertEquals(1_000_000_000_000_000_000L, Long.parseLong(run("1\n1000000000 1\n").trim()), "largest value");

        // Random queries, small and large, against the BigInteger reference
        Random random = new Random(20261116L);
        for (int round = 0; round < 40; round++) {
            int t = 1 + random.nextInt(200);
            long[][] qs = new long[t][];
            for (int i = 0; i < t; i++) {
                long bound = round % 2 == 0 ? 1000 : LIMIT;
                qs[i] = new long[] {1 + (long) (random.nextDouble() * bound), 1 + (long) (random.nextDouble() * bound)};
                qs[i][0] = Math.min(qs[i][0], bound);
                qs[i][1] = Math.min(qs[i][1], bound);
            }
            checkAll(qs);
        }

        // Largest input: t = 10^5 queries with coordinates near 10^9 (limit 1 s)
        long[][] big = new long[100_000][];
        for (int i = 0; i < big.length; i++) {
            big[i] = new long[] {LIMIT - random.nextInt(1000), LIMIT - random.nextInt(1000)};
        }
        long start = System.nanoTime();
        checkAll(big);
        long ms = (System.nanoTime() - start) / 1_000_000;
        if (ms > 1500) throw new AssertionError("too slow: " + ms + " ms including the reference");

        System.out.println("PASS " + cases + " cases");
    }

    /** Fills numbers 1, 2, 3, ... along the spiral path, layer by layer, as the statement's picture shows. */
    static long[][] walkedGrid(int n) {
        long[][] g = new long[n + 1][n + 1];
        long next = 1;
        for (int k = 1; k <= n; k++) {
            if (k % 2 == 1) {
                for (int x = 1; x <= k; x++) g[k][x] = next++;          // right along row k
                for (int y = k - 1; y >= 1; y--) g[y][k] = next++;      // up column k
            } else {
                for (int y = 1; y <= k; y++) g[y][k] = next++;          // down column k
                for (int x = k - 1; x >= 1; x--) g[k][x] = next++;      // left along row k
            }
        }
        return g;
    }

    /** Position along the layer's path, added to the count of earlier cells, in BigInteger. */
    static BigInteger reference(long y, long x) {
        long k = Math.max(y, x);
        long offset;
        if (k % 2 == 1) offset = (y == k) ? x : k + (k - y);
        else offset = (x == k) ? y : k + (k - x);
        BigInteger km1 = BigInteger.valueOf(k - 1);
        return km1.multiply(km1).add(BigInteger.valueOf(offset));
    }

    static void check(long y, long x) throws Exception {
        checkAll(new long[][] {{y, x}});
    }

    static void checkAll(long[][] qs) throws Exception {
        StringBuilder in = new StringBuilder().append(qs.length).append('\n');
        StringBuilder want = new StringBuilder();
        for (long[] q : qs) {
            if (q[0] < 1 || q[0] > LIMIT || q[1] < 1 || q[1] > LIMIT) throw new IllegalStateException("bad test case " + q[0] + " " + q[1]);
            in.append(q[0]).append(' ').append(q[1]).append('\n');
            want.append(reference(q[0], q[1])).append(' ');
        }
        if (qs.length > 100_000) throw new IllegalStateException("bad test case: t = " + qs.length);
        expect(in.toString(), want.toString());
    }

    static void expect(String input, String want) throws Exception {
        List<String> w = tokens(want);
        List<String> got = tokens(run(input));
        if (!w.equals(got)) {
            String head = input.length() > 60 ? input.substring(0, 60) + "..." : input;
            throw new AssertionError("input " + head.replace('\n', '|') + " expected " + abbreviate(w) + " but got " + abbreviate(got));
        }
        cases++;
    }

    static String abbreviate(List<String> list) {
        return list.size() <= 8 ? list.toString() : list.subList(0, 8) + "... (" + list.size() + " values)";
    }

    static void assertEquals(long want, long got, String what) {
        if (want != got) throw new AssertionError(what + ": expected " + want + " but got " + got);
    }

    static List<String> tokens(String s) {
        List<String> out = new ArrayList<>();
        for (String t : s.trim().split("\\s+")) if (!t.isEmpty()) out.add(t);
        return out;
    }

    static String run(String input) throws Exception {
        InputStream oldIn = System.in;
        PrintStream oldOut = System.out;
        ByteArrayOutputStream buf = new ByteArrayOutputStream();
        try {
            System.setIn(new ByteArrayInputStream(input.getBytes(StandardCharsets.US_ASCII)));
            System.setOut(new PrintStream(buf, true, "US-ASCII"));
            Main.main(new String[0]);
        } finally {
            System.setIn(oldIn);
            System.setOut(oldOut);
        }
        return buf.toString("US-ASCII");
    }
}
