import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "public class Main" on the Subarray Divisibility page (run by
 * `npm run problems:verify`).
 *
 * The page's O(n^2) alternative runs these tests too. It is recognised by its method
 * `countByRunningSum` (18 s measured at n = 2 * 10^5) and gets inputs up to n = 3,000; every other
 * program also gets the inputs at n = 2 * 10^5.
 */
class Tests {
    static int cases = 0;
    static final boolean QUADRATIC = declares("countByRunningSum");
    /** The 100 values of the official test with expected answer 47. */
    static final String OFFICIAL_VALUES = "2 1 -3 2 -7 7 -2 6 9 -4 10 -6 3 9 -8 7 -2 -9 4 -3 -2 6 6 3 7 2 -1 "
            + "10 6 -4 4 9 -1 -5 -6 -9 1 2 2 -10 -2 3 3 4 3 -6 -5 -1 9 6 -4 6 2 -1 6 1 6 1 3 7 -6 10 1 1 6 -9 0 "
            + "5 -1 8 6 0 5 5 -3 1 1 -5 -9 -8 -9 -7 7 -6 10 7 8 1 -2 2 8 9 -1 5 -7 3 -3 -9 -3 4";

    public static void main(String[] args) throws Exception {
        // The CSES example, the dry-run input of every approach.
        check("5\n3 1 2 7 4\n", 1);
        // The negative dry run of section 4 (remainders must be normalised).
        check("4\n5 -65 -67 -67\n", 2);

        // The official CSES tests stored with the site (public/tests/cses/cses-subarray-divisibility.json).
        check(input(repeat(1, 100)), 1);
        check(input(repeat(0, 100)), 5050);
        check("100\n" + OFFICIAL_VALUES + "\n", 47);
        check("3\n1 1 1\n", 1);
        check("5\n3 1 2 7 4\n", 1);
        check("4\n5 -65 -67 -67\n", 2);
        check("7\n0 0 -100 -20 -21 -32 -456\n", 4);

        // Edge cases from section 3.
        check("1\n0\n", 1);                            // n = 1: every sum is divisible by 1
        check("1\n-1000000000\n", 1);
        check("1\n7\n", 1);
        check("2\n1 1\n", 1);                          // only [1, 1]
        check("2\n1 2\n", 1);                          // only [2]
        check("2\n-1 -1\n", 1);                        // the sum -2 is a multiple of 2
        check("3\n-1 -1 -1\n", 1);                     // -3 is a multiple of 3; -1 and -2 are not
        check("4\n1000000000 1000000000 1000000000 1000000000\n", 10); // 10^9 is a multiple of 4
        check("3\n1000000000 1000000000 1000000000\n", 1); // 10^9 = 1 mod 3: only the whole array
        check("5\n3 1 2 7 4", 1);                      // no final newline
        check("5\n3 1\n2 7 4\n", 1);                   // numbers over two lines

        // Random inputs against an independent brute force over all subarrays.
        Random random = new Random(20261116L);
        for (int t = 0; t < 1500; t++) {
            int n = 1 + random.nextInt(80);
            int bound = t % 3 == 0 ? 3 : t % 3 == 1 ? 100 : 1_000_000_000;
            int[] a = new int[n];
            for (int i = 0; i < n; i++) a[i] = random.nextInt(2 * bound + 1) - bound;
            check(input(a), byBruteForce(a));
        }

        // Medium size: every program, the quadratic one included.
        int medium = 3_000;
        int[] mediumValues = new int[medium];
        for (int i = 0; i < medium; i++) mediumValues[i] = random.nextInt(2_000_000_001) - 1_000_000_000;
        check(input(mediumValues), bySortedRemainders(mediumValues));
        check(input(repeat(0, medium)), (long) medium * (medium + 1) / 2);

        if (!QUADRATIC) {
            int max = 200_000;
            // The largest answer: every subarray, n(n+1)/2 = 20,000,100,000 (10^9 is a multiple of 2 * 10^5).
            check(input(repeat(0, max)), 20_000_100_000L);
            check(input(repeat(1_000_000_000, max)), 20_000_100_000L);
            check(input(repeat(-1_000_000_000, max)), 20_000_100_000L);
            // Random values at the limits, and all -1 (only the whole array: -n is a multiple of n).
            int[] wide = new int[max];
            for (int i = 0; i < max; i++) wide[i] = random.nextInt(2_000_000_001) - 1_000_000_000;
            check(input(wide), bySortedRemainders(wide));
            check(input(repeat(-1, max)), 1);
            int[] small = new int[max];
            for (int i = 0; i < max; i++) small[i] = random.nextInt(7) - 3;
            check(input(small), bySortedRemainders(small));
        }

        // The test inputs themselves must be valid.
        expectInvalid(new int[] {});                     // n below 1
        expectInvalid(new int[] {1_000_000_001});        // a value above 10^9
        expectInvalid(new int[] {-1_000_000_001});       // a value below -10^9
        expectInvalid(new int[200_001]);                 // n above 2 * 10^5

        System.out.println("PASS " + cases + " cases");
    }

    static boolean declares(String name) {
        for (Method m : Main.class.getDeclaredMethods()) {
            if (m.getName().equals(name)) return true;
        }
        return false;
    }

    /** Independent reference for small inputs: every subarray, summed from scratch. */
    static long byBruteForce(int[] a) {
        int n = a.length;
        long count = 0;
        for (int l = 0; l < n; l++) {
            for (int r = l; r < n; r++) {
                long s = 0;
                for (int k = l; k <= r; k++) s += a[k];
                if (Math.floorMod(s, (long) n) == 0) count++;
            }
        }
        return count;
    }

    /** Independent reference for large inputs: sort the n + 1 remainders and count equal runs. */
    static long bySortedRemainders(int[] a) {
        int n = a.length;
        long[] rem = new long[n + 1];
        long prefix = 0;
        for (int i = 0; i < n; i++) {
            prefix += a[i];
            rem[i + 1] = Math.floorMod(prefix, (long) n);
        }
        Arrays.sort(rem);
        long count = 0;
        long run = 0;
        for (int i = 0; i <= n; i++) {
            run = i > 0 && rem[i] == rem[i - 1] ? run + 1 : 0;
            count += run;                               // pairs with every equal earlier remainder
        }
        return count;
    }

    static int[] repeat(int value, int n) {
        int[] a = new int[n];
        Arrays.fill(a, value);
        return a;
    }

    /** Null when a is a valid input, otherwise the reason it is not. */
    static String invalid(int[] a) {
        if (a.length < 1 || a.length > 200_000) return "n must be in 1..2*10^5";
        for (int v : a) {
            if (v < -1_000_000_000 || v > 1_000_000_000) return "value " + v + " outside -10^9..10^9";
        }
        return null;
    }

    static void expectInvalid(int[] a) {
        if (invalid(a) == null) throw new AssertionError("the input guard accepted an invalid input");
    }

    static String input(int[] a) {
        String problem = invalid(a);
        if (problem != null) throw new IllegalArgumentException("invalid test: " + problem);
        StringBuilder sb = new StringBuilder();
        sb.append(a.length).append('\n');
        for (int i = 0; i < a.length; i++) {
            if (i > 0) sb.append(' ');
            sb.append(a[i]);
        }
        return sb.append('\n').toString();
    }

    static void check(String input, long expected) throws Exception {
        String output = run(input);
        String got = output.trim();
        if (!got.equals(String.valueOf(expected)) || got.split("\\s+").length != 1) {
            String shown = input.length() > 60 ? input.substring(0, 60) + "..." : input;
            throw new AssertionError("input " + shown + "\nexpected " + expected + ", got " + output);
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
