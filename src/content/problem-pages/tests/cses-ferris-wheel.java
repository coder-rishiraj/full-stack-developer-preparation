import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "public class Main" on the Ferris Wheel page (run by `npm run problems:verify`).
 *
 * Expected answers come from an independent dynamic programme over subsets of children (n <= 14)
 * on small inputs, and from closed-form answers or a counting argument on large ones.
 *
 * Two programs on the page are too slow for the largest inputs and are recognised by a method name:
 * - `fewestByTryingAll` (tries every pairing, exponential): only inputs with n <= 10.
 * - `heaviestPartner` (scans for a partner, O(n^2) when few children fit together): the
 *   n = 2 * 10^5 inputs are replaced by n = 5,000.
 */
class Tests {
    static int cases = 0;
    static final boolean EXPONENTIAL = declares("fewestByTryingAll");
    static final boolean QUADRATIC = declares("heaviestPartner");

    public static void main(String[] args) throws Exception {
        // The CSES example, which is also the dry-run input of the polynomial approaches.
        check("4 10\n7 2 3 9\n", 3);

        // The official CSES tests stored with the site (public/tests/cses/cses-ferris-wheel.json).
        check("10 2\n1 1 1 1 1 1 1 1 1 1\n", 5);
        check("10 2\n1 2 2 1 1 2 2 2 2 2\n", 9);
        check("10 10\n10 9 7 10 9 8 5 6 6 5\n", 9);
        check("10 15\n9 8 8 9 10 8 5 8 7 10\n", 8);
        check("10 20\n5 9 6 5 8 9 10 6 5 6\n", 5);
        check("8 22\n6 10 7 6 9 10 7 7\n", 4);
        check("3 10\n1 2 3\n", 2);

        // Inputs from the page: the counterexample to pairing the lightest, and the brute-force dry run.
        check("4 10\n1 2 8 9\n", 2);
        check("4 10\n9 8 2 1\n", 2);
        check("4 10\n1 9 2 8\n", 2);                       // unsorted two pointers print 3

        // Edge cases from section 3.
        check("1 1\n1\n", 1);                                  // one child
        check("1 1000000000\n1000000000\n", 1);
        check("2 2\n1 1\n", 1);                                // a pair that fills the gondola exactly
        check("2 3\n2 2\n", 2);                                // a pair one unit too heavy
        check("3 10\n5 5 5\n", 2);                             // odd count, all pairable
        check("2 1000000000\n1000000000 1000000000\n", 2);     // 2 * 10^9 still fits an int
        check("2 1000000000\n500000000 500000000\n", 1);       // sum exactly x
        check("2 1000000000\n500000000 500000001\n", 2);       // sum x + 1

        // Random small inputs against the subset DP: every program.
        Random random = new Random(20261116L);
        for (int t = 0; t < 2000; t++) {
            int n = 1 + random.nextInt(10);
            int x = 1 + random.nextInt(t % 2 == 0 ? 20 : 1_000_000_000);
            int[] p = values(n, x, random);
            check(input(p, x), bySubsets(p, x));
        }

        if (!EXPONENTIAL) {
            for (int t = 0; t < 300; t++) {
                int n = 11 + random.nextInt(4);
                int x = 1 + random.nextInt(t % 2 == 0 ? 30 : 1_000_000_000);
                int[] p = values(n, x, random);
                check(input(p, x), bySubsets(p, x));
            }

            int size = QUADRATIC ? 5_000 : 200_000;
            // Nobody fits with anybody: every weight above x / 2.
            int[] heavy = new int[size];
            for (int i = 0; i < size; i++) heavy[i] = 500_000_001 + random.nextInt(499_999_999);
            check(input(heavy, 1_000_000_000), size);
            check(input(filled(size, 1_000_000_000), 1_000_000_000), size);
            // Everybody fits with everybody: ceil(n / 2).
            check(input(filled(size, 1), 2), size / 2);
            check(input(filled(size - 1, 1), 2), size / 2);
            check(input(values(size, 500_000_000, random), 1_000_000_000), size / 2);
            // Light and heavy halves that fit exactly across: n / 2 gondolas.
            int[] halves = new int[size];
            for (int i = 0; i < size; i++) halves[i] = i % 2 == 0 ? 1 + i / 2 : 1_000_000_000 - 1 - i / 2;
            check(input(halves, 1_000_000_000), size / 2);
            // Random weights: compare with the counting argument below.
            int[] p = values(size, 1_000_000_000, random);
            check(input(p, 1_000_000_000), byMaxPairs(p, 1_000_000_000));
        }

        // The large-input reference agrees with the subset DP on small inputs.
        for (int t = 0; t < 500; t++) {
            int x = 1 + random.nextInt(30);
            int[] p = values(1 + random.nextInt(12), x, random);
            if (byMaxPairs(p, x) != bySubsets(p, x)) throw new AssertionError("references disagree");
        }

        // The test inputs themselves must be valid.
        expectInvalid(new int[] {}, 5);
        expectInvalid(new int[] {6}, 5);                       // a child heavier than x
        expectInvalid(new int[] {0}, 5);
        expectInvalid(new int[] {1}, 1_000_000_001);
        expectInvalid(new int[200_001], 5);

        System.out.println("PASS " + cases + " cases");
    }

    static boolean declares(String name) {
        for (Method m : Main.class.getDeclaredMethods()) {
            if (m.getName().equals(name)) return true;
        }
        return false;
    }

    static int[] values(int count, int max, Random random) {
        int[] v = new int[count];
        for (int i = 0; i < count; i++) v[i] = 1 + random.nextInt(max);
        return v;
    }

    static int[] filled(int count, int value) {
        int[] v = new int[count];
        Arrays.fill(v, value);
        return v;
    }

    /** Fewest gondolas by a DP over the set of seated children (independent of any greedy). */
    static int bySubsets(int[] p, int x) {
        int n = p.length;
        int[] best = new int[1 << n];
        Arrays.fill(best, Integer.MAX_VALUE);
        best[0] = 0;
        for (int mask = 0; mask < (1 << n); mask++) {
            if (best[mask] == Integer.MAX_VALUE) continue;
            int i = Integer.numberOfTrailingZeros(~mask);      // lowest unseated child
            if (i >= n) continue;
            int alone = mask | (1 << i);
            best[alone] = Math.min(best[alone], best[mask] + 1);
            for (int j = i + 1; j < n; j++) {
                if ((mask >> j & 1) == 0 && (long) p[i] + p[j] <= x) {
                    int both = alone | (1 << j);
                    best[both] = Math.min(best[both], best[mask] + 1);
                }
            }
        }
        return best[(1 << n) - 1];
    }

    /**
     * n minus the largest number q of disjoint fitting pairs. If q pairs exist, the 2q lightest
     * children also form q pairs (swap in lighter children), and 2q sorted children form q pairs
     * exactly when the crosswise pairing (lightest with heaviest of them, ...) fits. That test is
     * monotone in q, so q is found by binary search.
     */
    static int byMaxPairs(int[] p0, int x) {
        int[] p = p0.clone();
        Arrays.sort(p);
        int n = p.length, lo = 0, hi = n / 2;
        while (lo < hi) {
            int q = (lo + hi + 1) / 2;
            boolean ok = true;
            for (int t = 0; t < q && ok; t++) ok = (long) p[t] + p[2 * q - 1 - t] <= x;
            if (ok) lo = q; else hi = q - 1;
        }
        return n - lo;
    }

    /** Null when the input is valid, otherwise the reason it is not. */
    static String invalid(int[] p, int x) {
        if (p.length < 1 || p.length > 200_000) return "n must be in 1..2*10^5";
        if (x < 1 || x > 1_000_000_000) return "x must be in 1..10^9";
        for (int v : p) if (v < 1 || v > x) return "weight " + v + " outside 1..x";
        return null;
    }

    static void expectInvalid(int[] p, int x) {
        if (invalid(p, x) == null) throw new AssertionError("the input guard accepted an invalid input");
    }

    static String input(int[] p, int x) {
        String problem = invalid(p, x);
        if (problem != null) throw new IllegalArgumentException("invalid test: " + problem);
        StringBuilder sb = new StringBuilder();
        sb.append(p.length).append(' ').append(x).append('\n');
        for (int i = 0; i < p.length; i++) sb.append(i > 0 ? " " : "").append(p[i]);
        return sb.append('\n').toString();
    }

    static void check(String input, int expected) throws Exception {
        String output = run(input);
        String got = output.trim();
        if (!got.equals(String.valueOf(expected))) {
            String shown = input.length() > 80 ? input.substring(0, 80) + "..." : input;
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
