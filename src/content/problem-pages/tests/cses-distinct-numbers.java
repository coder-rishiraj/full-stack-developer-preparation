import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.util.Random;
import java.util.TreeSet;

/**
 * Tests for every "public class Main" on the Distinct Numbers page (run by `npm run problems:verify`).
 *
 * The page's O(n^2) alternative (compare each value with every earlier one) runs these tests too. It
 * is recognised by its method `countByScanningEarlier`; for it, the all-distinct inputs at
 * n = 2 * 10^5 (about 2 * 10^10 comparisons, 3.5 s measured) are replaced by all-distinct inputs at
 * n = 20,000. Inputs at n = 2 * 10^5 with few distinct values run for every program, because there
 * each scan stops early.
 */
class Tests {
    static int cases = 0;
    static final boolean QUADRATIC = declares("countByScanningEarlier");

    public static void main(String[] args) throws Exception {
        // The example, which is also the dry-run input of every approach on the page.
        check("5\n2 3 2 2 3\n", 2);

        // The official CSES tests stored with the site (public/tests/cses/cses-distinct-numbers.json).
        check("10\n1 1 1 1 1 1 1 1 1 1\n", 1);
        check("10\n7 4 10 9 6 1 8 2 5 3\n", 10);
        check("10\n5 9 5 5 10 9 3 1 8 8\n", 6);
        check("4\n1 2 8 9\n", 4);

        // Edge cases from section 3: one number, the value limits, all equal, all distinct.
        check("1\n1\n", 1);
        check("1\n1000000000\n", 1);
        check("2\n1000000000 1000000000\n", 1);
        check("2\n1 1000000000\n", 2);
        check("3\n7 7 7\n", 1);
        check("4\n4 3 2 1\n", 4);
        check("6\n1 2 1 2 1 2\n", 2);

        // Whitespace the judge never sends, but a robust reader accepts.
        check("5\n2 3 2 2 3", 2);                        // no final newline
        check("5\n2  3 2\n2 3  \n", 2);                  // extra spaces, numbers over two lines

        // Random inputs against an independent TreeSet count.
        Random random = new Random(20261116L);
        for (int t = 0; t < 2000; t++) {
            int n = 1 + random.nextInt(60);
            int range = 1 + random.nextInt(t % 3 == 0 ? 5 : 1_000_000_000);
            int[] x = new int[n];
            for (int i = 0; i < n; i++) x[i] = 1 + random.nextInt(range);
            check(input(x), byTreeSet(x));
        }

        // Largest n = 2 * 10^5 with few distinct values: every program, the quadratic one included.
        int max = 200_000;
        int[] equal = new int[max];
        java.util.Arrays.fill(equal, 1_000_000_000);
        check(input(equal), 1);
        int[] fewValues = new int[max];
        for (int i = 0; i < max; i++) fewValues[i] = 1 + random.nextInt(100);
        check(input(fewValues), byTreeSet(fewValues));

        if (!QUADRATIC) {
            // Largest n, all distinct: ascending, descending, random, and keys built to collide in a
            // HashMap with 2^19 buckets (section 9): 105 buckets hold all 200,000 keys.
            check(input(ascending(max)), max);
            check(input(reversed(ascending(max))), max);
            int[] randomValues = new int[max];
            for (int i = 0; i < max; i++) randomValues[i] = 1 + random.nextInt(1_000_000_000);
            check(input(randomValues), byTreeSet(randomValues));
            check(input(colliding(max, random)), max);
        } else {
            check(input(ascending(20_000)), 20_000);
            check(input(reversed(ascending(20_000))), 20_000);
        }

        // The test inputs themselves must be valid.
        expectInvalid(new int[] {});                     // n below 1
        expectInvalid(new int[] {0, 1});                 // a value below 1
        expectInvalid(new int[] {1, 1_000_000_001});     // a value above 10^9
        expectInvalid(new int[max + 1]);                 // n above 2 * 10^5

        System.out.println("PASS " + cases + " cases");
    }

    static boolean declares(String name) {
        for (Method m : Main.class.getDeclaredMethods()) {
            if (m.getName().equals(name)) return true;
        }
        return false;
    }

    static int byTreeSet(int[] x) {
        TreeSet<Integer> set = new TreeSet<>();
        for (int v : x) set.add(v);
        return set.size();
    }

    static int[] ascending(int n) {
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = i + 1;
        return a;
    }

    static int[] reversed(int[] a) {
        int[] r = new int[a.length];
        for (int i = 0; i < a.length; i++) r[i] = a[a.length - 1 - i];
        return r;
    }

    /**
     * Distinct values in 1..10^9 whose HashMap bucket index, (h ^ (h >>> 16)) & (2^19 - 1), is one
     * of the first few buckets: with h = (y << 16) | low, the index is low ^ y in its low 16 bits and
     * bits 16..18 of h above them, so y with (y & 7) == 0 and low = b ^ y gives bucket b.
     */
    static int[] colliding(int count, Random random) {
        int[] a = new int[count];
        int k = 0;
        for (int b = 0; k < count; b++) {
            for (int y = 0; y <= (1_000_000_000 >> 16) && k < count; y += 8) {
                int v = (y << 16) | ((b ^ y) & 0xffff);
                if (v < 1 || v > 1_000_000_000) continue;
                if (((v ^ (v >>> 16)) & ((1 << 19) - 1)) != b) throw new AssertionError("bad collision key");
                a[k++] = v;
            }
        }
        for (int i = a.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            int t = a[i];
            a[i] = a[j];
            a[j] = t;
        }
        if (byTreeSet(a) != count) throw new AssertionError("collision keys are not distinct");
        return a;
    }

    /** Null when x is a valid input, otherwise the reason it is not. */
    static String invalid(int[] x) {
        if (x.length < 1 || x.length > 200_000) return "n must be in 1..2*10^5";
        for (int v : x) {
            if (v < 1 || v > 1_000_000_000) return "value " + v + " outside 1..10^9";
        }
        return null;
    }

    static void expectInvalid(int[] x) {
        if (invalid(x) == null) throw new AssertionError("the input guard accepted an invalid input");
    }

    static String input(int[] x) {
        String problem = invalid(x);
        if (problem != null) throw new IllegalArgumentException("invalid test: " + problem);
        StringBuilder sb = new StringBuilder();
        sb.append(x.length).append('\n');
        for (int i = 0; i < x.length; i++) {
            if (i > 0) sb.append(' ');
            sb.append(x[i]);
        }
        return sb.append('\n').toString();
    }

    static void check(String input, int expected) throws Exception {
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
