import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.Random;

/**
 * Tests for every "public class Main" on the Increasing Array page (run by `npm run problems:verify`).
 * Each program reads n and n integers and prints the minimum number of +1 moves.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) throws Exception {
        // Example from the statement and the dry runs on the page
        check(new int[] {3, 2, 5, 1, 7}, 5);
        check(new int[] {4, 9, 2, 9, 6}, 10);
        check(new int[] {1, 2, 2}, 0);
        check(new int[] {5, 1, 1, 1}, 12);              // the follow-up example: raising costs 12

        // Edge cases from section 3 and section 7
        check(new int[] {7}, 0);                         // n = 1
        check(new int[] {1, 2, 2, 3}, 0);                // already non-decreasing, with an equal pair
        check(new int[] {5, 5, 5}, 0);                   // all equal: nothing to do
        check(new int[] {5, 4, 3, 2, 1}, 10);            // strictly decreasing
        check(new int[] {1_000_000_000, 1, 1, 1}, 2_999_999_997L);   // first input where an int total overflows

        // Largest inputs: n = 2 * 10^5, values up to 10^9
        int n = 200_000;
        int[] worst = new int[n];
        worst[0] = 1_000_000_000;
        for (int i = 1; i < n; i++) worst[i] = 1;
        check(worst, 199_998_999_800_001L);              // (2*10^5 - 1) * (10^9 - 1)
        int[] sorted = new int[n];
        for (int i = 0; i < n; i++) sorted[i] = 1 + i * 5000;
        check(sorted, 0);
        int[] allMax = new int[n];
        java.util.Arrays.fill(allMax, 1_000_000_000);
        check(allMax, 0);
        int[] zigzag = new int[n];
        for (int i = 0; i < n; i++) zigzag[i] = i % 2 == 0 ? 1_000_000_000 : 1;
        check(zigzag, (long) (n / 2) * 999_999_999L);

        // Random arrays checked against an independent move-by-move simulation
        Random random = new Random(20261115L);
        for (int t = 0; t < 3000; t++) {
            int len = 1 + random.nextInt(10);
            int[] x = new int[len];
            for (int i = 0; i < len; i++) x[i] = 1 + random.nextInt(t < 2000 ? 6 : 40);
            check(x, simulate(x));
        }
        // Larger random arrays against a quadratic "max of the prefix" reference
        for (int t = 0; t < 200; t++) {
            int len = 1 + random.nextInt(2000);
            int[] x = new int[len];
            for (int i = 0; i < len; i++) x[i] = 1 + random.nextInt(1_000_000_000);
            check(x, prefixMaxReference(x));
        }

        // Timing at the largest size (the limit is 1 s per test)
        String big = format(worst);
        long start = System.nanoTime();
        run(big);
        run(format(zigzag));
        long ms = (System.nanoTime() - start) / 1_000_000;
        if (ms > 1000) throw new AssertionError("too slow: " + ms + " ms");

        System.out.println("PASS " + cases + " cases");
    }

    /** Reference 1: literally perform one +1 move at a time on the first element that breaks the order. */
    static long simulate(int[] input) {
        int[] x = input.clone();
        long moves = 0;
        while (true) {
            int bad = -1;
            for (int i = 1; i < x.length; i++) {
                if (x[i] < x[i - 1]) {
                    bad = i;
                    break;
                }
            }
            if (bad == -1) return moves;
            x[bad]++;
            moves++;
        }
    }

    /** Reference 2: element i must reach the maximum of x[0..i]; sum the gaps (O(n^2) on purpose). */
    static long prefixMaxReference(int[] x) {
        long total = 0;
        for (int i = 0; i < x.length; i++) {
            int max = x[i];
            for (int j = 0; j < i; j++) max = Math.max(max, x[j]);
            total += max - x[i];
        }
        return total;
    }

    static String format(int[] x) {
        StringBuilder sb = new StringBuilder();
        sb.append(x.length).append('\n');
        for (int i = 0; i < x.length; i++) sb.append(i == 0 ? "" : " ").append(x[i]);
        return sb.append('\n').toString();
    }

    static void check(int[] x, long want) throws Exception {
        if (x.length < 1 || x.length > 200_000) throw new IllegalStateException("bad test case, n = " + x.length);
        for (int v : x) if (v < 1 || v > 1_000_000_000) throw new IllegalStateException("bad test case, value " + v);
        String got = run(format(x)).trim();
        if (!got.equals(String.valueOf(want))) {
            throw new AssertionError("n=" + x.length + ": expected " + want + " but got \"" + got + "\"");
        }
        cases++;
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
