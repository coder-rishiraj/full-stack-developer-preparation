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
 * Tests for every "public class Main" on the Coin Piles page (run by `npm run problems:verify`).
 * Small piles are checked against a reachability table built move by move; large piles against
 * an exact BigInteger solve of the move counts; and every program run is a whole batch of tests.
 */
class Tests {
    static final long MAX = 1_000_000_000L;
    static int cases = 0;

    public static void main(String[] args) throws Exception {
        // The example from the statement and the dry runs on the page.
        check(new long[][] {{2, 1}, {2, 2}, {3, 3}});
        expect("3\n2 1\n2 2\n3 3\n", "YES NO YES");
        expect("1\n11 4\n", "NO");                         // the official CSES test in public/tests
        check(new long[][] {{7, 5}, {4, 8}, {11, 4}, {6, 6}, {5, 1}});

        // Edge cases from sections 3, 7 and 11.
        check(new long[][] {{0, 0}, {0, 3}, {3, 0}, {1, 1}, {1, 2}, {2, 1}, {0, 1}, {1, 0}, {0, 2}});
        expect("4\n0 0\n0 3\n1 1\n1 2\n", "YES NO NO YES");

        // The reachability table must agree with the closed form on its own first.
        int limit = 90;
        boolean[][] can = reachable(limit);
        for (int a = 0; a <= limit; a++) {
            for (int b = 0; b <= limit; b++) {
                if (can[a][b] != reference(a, b)) {
                    throw new AssertionError("table and BigInteger reference disagree at " + a + " " + b);
                }
            }
        }
        // Every pair with a, b <= 90 in batches (t = 8281 in total), judged by the table.
        List<long[]> batch = new ArrayList<>();
        for (int a = 0; a <= limit; a++) {
            for (int b = 0; b <= limit; b++) batch.add(new long[] {a, b});
        }
        check(batch.toArray(new long[0][]));

        // Value extremes: the sum reaches 2 * 10^9, just under 2^31 - 1 = 2147483647.
        check(new long[][] {
            {MAX, MAX},                 // sum 2 * 10^9, 2 mod 3: NO
            {999_999_999, 999_999_999}, // YES
            {MAX, MAX / 2},             // 2 * 5 * 10^8 = 10^9: YES, the ratio test is tight
            {MAX / 2, MAX},
            {MAX, MAX / 2 - 1},         // ratio fails
            {0, MAX}, {MAX, 0},
            {999_999_998, 999_999_997}, // sum 1999999995, divisible by 3: YES
            {1, MAX}
        });

        // Random: constructed YES cases (choose the move counts), their neighbours, and pure noise.
        Random random = new Random(20261116L);
        for (int round = 0; round < 3; round++) {
            List<long[]> tests = new ArrayList<>();
            for (int i = 0; i < 30_000; i++) {
                long x = random.nextInt(333_333_334), y = random.nextInt(333_333_334);
                long a = x + 2 * y, b = 2 * x + y;
                tests.add(new long[] {a, b});
                tests.add(new long[] {Math.min(MAX, a + random.nextInt(3)), b});
                tests.add(new long[] {(long) (random.nextDouble() * (MAX + 1)), (long) (random.nextDouble() * (MAX + 1))});
            }
            check(tests.toArray(new long[0][]));
        }

        // The largest input: t = 10^5, all at the value limits.
        long[][] big = new long[100_000][];
        for (int i = 0; i < big.length; i++) {
            big[i] = new long[] {MAX - random.nextInt(1000), MAX - random.nextInt(600_000_000)};
        }
        check(big);

        System.out.println("PASS " + cases + " cases");
    }

    /** Runs Main on one batch and compares every answer with the reference. */
    static void check(long[][] tests) throws Exception {
        if (tests.length < 1 || tests.length > 100_000) throw new IllegalArgumentException("invalid test: t = " + tests.length);
        StringBuilder input = new StringBuilder().append(tests.length).append('\n');
        for (long[] p : tests) {
            if (p[0] < 0 || p[0] > MAX || p[1] < 0 || p[1] > MAX) {
                throw new IllegalArgumentException("invalid test: piles must be in 0..10^9, got " + p[0] + " " + p[1]);
            }
            input.append(p[0]).append(' ').append(p[1]).append('\n');
        }
        List<String> got = tokens(run(input.toString()));
        if (got.size() != tests.length) throw new AssertionError("expected " + tests.length + " answers, got " + got.size());
        for (int i = 0; i < tests.length; i++) {
            String want = reference(tests[i][0], tests[i][1]) ? "YES" : "NO";
            if (!got.get(i).equals(want)) {
                throw new AssertionError("a=" + tests[i][0] + " b=" + tests[i][1] + ": expected " + want + ", got " + got.get(i));
            }
            cases++;
        }
    }

    static void expect(String input, String want) throws Exception {
        String got = String.join(" ", tokens(run(input)));
        if (!got.equals(want)) throw new AssertionError("input " + input.replace('\n', '|') + ": expected " + want + ", got " + got);
        cases++;
    }

    /** Exact solve in BigInteger: x moves of (1, 2) and y moves of (2, 1), x and y whole and >= 0. */
    static boolean reference(long a, long b) {
        BigInteger three = BigInteger.valueOf(3);
        BigInteger x3 = BigInteger.valueOf(b).shiftLeft(1).subtract(BigInteger.valueOf(a));
        BigInteger y3 = BigInteger.valueOf(a).shiftLeft(1).subtract(BigInteger.valueOf(b));
        if (x3.signum() < 0 || y3.signum() < 0) return false;
        if (x3.mod(three).signum() != 0 || y3.mod(three).signum() != 0) return false;
        BigInteger x = x3.divide(three), y = y3.divide(three);
        return x.add(y.shiftLeft(1)).equals(BigInteger.valueOf(a)) && x.shiftLeft(1).add(y).equals(BigInteger.valueOf(b));
    }

    /** can[a][b]: both piles can be emptied, found by trying the two moves (no formula). */
    static boolean[][] reachable(int limit) {
        boolean[][] can = new boolean[limit + 1][limit + 1];
        for (int a = 0; a <= limit; a++) {
            for (int b = 0; b <= limit; b++) {
                if (a == 0 && b == 0) can[a][b] = true;
                else can[a][b] = (a >= 1 && b >= 2 && can[a - 1][b - 2]) || (a >= 2 && b >= 1 && can[a - 2][b - 1]);
            }
        }
        return can;
    }

    static List<String> tokens(String s) {
        List<String> out = new ArrayList<>();
        for (String t : s.trim().split("\\s+")) if (!t.isEmpty()) out.add(t);
        return out;
    }

    /** Runs Main on the given input and returns what it printed. */
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
