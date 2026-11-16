import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.TreeMap;

/**
 * Tests for every "public class Main" on the Subarray Sums II page (run by `npm run problems:verify`).
 *
 * The page's two slow alternatives run these tests too. They are recognised by their method names:
 * `countByTripleLoop` (O(n^3)) gets inputs up to n = 300, `countByRunningSum` (O(n^2), 16 s measured
 * at n = 2 * 10^5) inputs up to n = 3,000. Every other program also gets the inputs at n = 2 * 10^5.
 */
class Tests {
    static int cases = 0;
    static final boolean CUBIC = declares("countByTripleLoop");
    static final boolean QUADRATIC = declares("countByRunningSum");
    /** The 100 values of the official test with expected answer 53. */
    static final String OFFICIAL_VALUES = "2 1 -3 2 -7 7 -2 6 9 -4 10 -6 3 9 -8 7 -2 -9 4 -3 -2 6 6 3 7 2 -1 "
            + "10 6 -4 4 9 -1 -5 -6 -9 1 2 2 -10 -2 3 3 4 3 -6 -5 -1 9 6 -4 6 2 -1 6 1 6 1 3 7 -6 10 1 1 6 -9 0 "
            + "5 -1 8 6 0 5 5 -3 1 1 -5 -9 -8 -9 -7 7 -6 10 7 8 1 -2 2 8 9 -1 5 -7 3 -3 -9 -3 4";

    public static void main(String[] args) throws Exception {
        // The CSES example, which is also every dry-run input on the page.
        check("5 7\n2 -1 3 5 -2\n", 2);

        // The official CSES tests stored with the site (public/tests/cses/cses-subarray-sums-ii.json).
        check(input(50, repeat(1, 100)), 51);
        check(input(1_000_000_000, repeat(1_000_000_000, 100)), 100);
        check(input(0, repeat(0, 100)), 5050);
        check("100 4\n" + OFFICIAL_VALUES + "\n", 53);
        check("5 0\n0 0 0 0 0\n", 15);
        check(input(536_870_912, repeat(268_435_456, 20)), 19); // an int prefix sum overflows here
        check("5 2\n1 -1 1 -1 2\n", 3);

        // Edge cases from section 3.
        check("1 5\n5\n", 1);                          // n = 1, a match
        check("1 5\n4\n", 0);                          // n = 1, no match
        check("1 -1000000000\n-1000000000\n", 1);      // value limits, negative target
        check("1 1000000000\n-1000000000\n", 0);
        check("3 0\n1 -1 0\n", 3);                     // [1,-1], [0], [1,-1,0]
        check("4 0\n0 0 0 0\n", 10);                   // x = 0, all zeros: n(n+1)/2
        check("3 3\n5 -3 1\n", 1);                     // only the whole array, a window misses it
        check("4 -2\n-1 -1 -1 -1\n", 3);               // negative target, all negative
        check("5 7\n2 -1 3 5 -2", 2);                  // no final newline
        check("5 7\n2 -1\n3 5 -2\n", 2);               // numbers over two lines

        // Random inputs against an independent triple loop.
        Random random = new Random(20261116L);
        int maxN = CUBIC ? 40 : 80;
        for (int t = 0; t < 1500; t++) {
            int n = 1 + random.nextInt(maxN);
            int bound = t % 3 == 0 ? 2 : t % 3 == 1 ? 10 : 1_000_000_000;
            int[] a = new int[n];
            for (int i = 0; i < n; i++) a[i] = random.nextInt(2 * bound + 1) - bound;
            long x;
            if (t % 4 == 0) x = 0;
            else if (t % 4 == 1) x = random.nextInt(2 * bound + 1) - bound;
            else {
                int l = random.nextInt(n);
                int r = l + random.nextInt(n - l);
                long s = 0;
                for (int k = l; k <= r; k++) s += a[k];
                x = Math.max(-1_000_000_000L, Math.min(1_000_000_000L, s)); // often an existing sum
            }
            check(input(x, a), byTripleLoop(a, x));
        }

        // Medium sizes: every program, the slow ones included.
        int medium = CUBIC ? 300 : 3_000;
        int[] mediumValues = new int[medium];
        for (int i = 0; i < medium; i++) mediumValues[i] = random.nextInt(21) - 10;
        check(input(5, mediumValues), byTreeMap(mediumValues, 5));
        check(input(0, repeat(0, medium)), (long) medium * (medium + 1) / 2);

        if (!CUBIC && !QUADRATIC) {
            int max = 200_000;
            // The largest answer: all zeros with x = 0 counts every subarray, n(n+1)/2 = 20,000,100,000.
            check(input(0, repeat(0, max)), 20_000_100_000L);
            // The largest prefix sums: 2 * 10^5 * 10^9 = 2 * 10^14.
            check(input(1_000_000_000, repeat(1_000_000_000, max)), max);
            check(input(-1_000_000_000, repeat(-1_000_000_000, max)), max);
            int[] alternating = new int[max];
            for (int i = 0; i < max; i++) alternating[i] = i % 2 == 0 ? 1_000_000_000 : -1_000_000_000;
            long half = max / 2;
            check(input(0, alternating), (half + 1) * half / 2 + half * (half - 1) / 2);
            // Random values, small and wide.
            int[] small = new int[max];
            for (int i = 0; i < max; i++) small[i] = random.nextInt(21) - 10;
            check(input(7, small), byTreeMap(small, 7));
            int[] wide = new int[max];
            for (int i = 0; i < max; i++) wide[i] = random.nextInt(2_000_000_001) - 1_000_000_000;
            check(input(123, wide), byTreeMap(wide, 123));
            // Prefix sums built to share 105 of the 2^19 HashMap buckets (section 9).
            int[] colliding = collidingPrefixes(max);
            long x = 0;
            for (int i = 1; i <= 5; i++) x += colliding[i];
            check(input(x, colliding), byTreeMap(colliding, x));
        }

        // The test inputs themselves must be valid.
        expectInvalid(0, new int[] {});                         // n below 1
        expectInvalid(1_000_000_001L, new int[] {1});           // x above 10^9
        expectInvalid(0, new int[] {-1_000_000_001});           // a value below -10^9
        expectInvalid(0, new int[200_001]);                     // n above 2 * 10^5

        System.out.println("PASS " + cases + " cases");
    }

    static boolean declares(String name) {
        for (Method m : Main.class.getDeclaredMethods()) {
            if (m.getName().equals(name)) return true;
        }
        return false;
    }

    /** Independent reference for small inputs: every subarray, summed from scratch. */
    static long byTripleLoop(int[] a, long x) {
        long count = 0;
        for (int l = 0; l < a.length; l++) {
            for (int r = l; r < a.length; r++) {
                long s = 0;
                for (int k = l; k <= r; k++) s += a[k];
                if (s == x) count++;
            }
        }
        return count;
    }

    /** Independent reference for large inputs: prefix counts in a TreeMap (no hashing, no sorting). */
    static long byTreeMap(int[] a, long x) {
        TreeMap<Long, Integer> seen = new TreeMap<>();
        seen.put(0L, 1);
        long prefix = 0;
        long count = 0;
        for (int v : a) {
            prefix += v;
            count += seen.getOrDefault(prefix - x, 0);
            seen.merge(prefix, 1, Integer::sum);
        }
        return count;
    }

    static int[] repeat(int value, int n) {
        int[] a = new int[n];
        Arrays.fill(a, value);
        return a;
    }

    /**
     * Values whose prefix sums are distinct keys in 1..10^9 that all fall into 105 HashMap buckets of
     * a 2^19-bucket table: for 0 <= k < 2^31, Long.hashCode(k) = k, and with k = (y << 16) | (b ^ y),
     * y a multiple of 8, the bucket (h ^ (h >>> 16)) & (2^19 - 1) is b. Sorted keys, as consecutive
     * differences, give positive values of at most 10^9.
     */
    static int[] collidingPrefixes(int count) {
        List<Integer> keys = new ArrayList<>();
        for (int b = 0; keys.size() < count; b++) {
            for (int y = 0; y <= (1_000_000_000 >> 16) && keys.size() < count; y += 8) {
                int k = (y << 16) | ((b ^ y) & 0xffff);
                if (k < 1 || k > 1_000_000_000) continue;
                long h = Long.hashCode(k);
                if (((h ^ (h >>> 16)) & ((1 << 19) - 1)) != b) throw new AssertionError("bad collision key");
                keys.add(k);
            }
        }
        int[] sorted = new int[count];
        for (int i = 0; i < count; i++) sorted[i] = keys.get(i);
        Arrays.sort(sorted);
        int[] a = new int[count];
        for (int i = 0; i < count; i++) {
            a[i] = i == 0 ? sorted[0] : sorted[i] - sorted[i - 1];
            if (a[i] < 1) throw new AssertionError("collision keys are not distinct");
        }
        return a;
    }

    /** Null when (x, a) is a valid input, otherwise the reason it is not. */
    static String invalid(long x, int[] a) {
        if (a.length < 1 || a.length > 200_000) return "n must be in 1..2*10^5";
        if (x < -1_000_000_000L || x > 1_000_000_000L) return "x outside -10^9..10^9";
        for (int v : a) {
            if (v < -1_000_000_000 || v > 1_000_000_000) return "value " + v + " outside -10^9..10^9";
        }
        return null;
    }

    static void expectInvalid(long x, int[] a) {
        if (invalid(x, a) == null) throw new AssertionError("the input guard accepted an invalid input");
    }

    static String input(long x, int[] a) {
        String problem = invalid(x, a);
        if (problem != null) throw new IllegalArgumentException("invalid test: " + problem);
        StringBuilder sb = new StringBuilder();
        sb.append(a.length).append(' ').append(x).append('\n');
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
