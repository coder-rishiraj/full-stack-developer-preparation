import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.lang.reflect.Method;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Random;
import java.util.TreeMap;

/**
 * Tests for every "public class Main" on the Distinct Values Subsequences page (run by
 * `npm run problems:verify`).
 *
 * The page's exponential alternative (try every set of positions) runs these tests too. It is
 * recognised by its method `countByEnumeratingSubsets` and only gets the inputs with n <= 20.
 * Answers are checked against two independent references: a direct enumeration in this file for
 * small n, and the product formula evaluated with BigInteger (no modular shortcuts) for large n.
 */
class Tests {
    static int cases = 0;
    static final long MOD = 1_000_000_007L;
    static final boolean EXPONENTIAL = declares("countByEnumeratingSubsets");

    public static void main(String[] args) throws Exception {
        // The example, which is also the dry-run input of every approach on the page.
        check(new int[] {1, 2, 1, 3}, 11);

        // The official CSES test stored with the site (public/tests/cses/cses-distinct-values-subsequences.json).
        check(new int[] {1, 2, 3, 2, 3, 2, 2, 3, 1, 2, 1, 1, 1, 2, 3, 2, 3, 3, 2, 2}, 419);

        // Edge cases from section 3.
        check(new int[] {1}, 1);
        check(new int[] {1_000_000_000}, 1);
        check(new int[] {5, 5}, 2);                      // all equal: n
        check(new int[] {5, 5, 5, 5, 5, 5, 5}, 7);
        check(new int[] {1, 2}, 3);                      // all distinct: 2^n - 1
        check(new int[] {4, 3, 2, 1, 1_000_000_000}, 31);
        check(new int[] {1, 1, 2, 2}, 8);                // traced in section 7: 3 * 3 - 1

        // Whitespace the judge never sends, but a robust reader accepts.
        checkRaw("4\n1 2 1 3", 11);
        checkRaw("4\n1  2\n1 3  \n", 11);

        // Random small inputs: the program against a direct enumeration of position sets.
        Random random = new Random(20261116L);
        for (int t = 0; t < 400; t++) {
            int n = 1 + random.nextInt(14);
            int range = 1 + random.nextInt(t % 2 == 0 ? 4 : 1_000_000_000);
            int[] x = new int[n];
            for (int i = 0; i < n; i++) x[i] = 1 + random.nextInt(range);
            long direct = byEnumeration(x);
            if (direct != byFormula(x)) throw new AssertionError("the two references disagree on " + Arrays.toString(x));
            check(x, direct);
        }
        // n = 20 with every value distinct: 2^20 - 1 subsequences, the most the enumeration meets.
        int[] twenty = new int[20];
        for (int i = 0; i < 20; i++) twenty[i] = 1_000_000_000 - i;
        check(twenty, (1 << 20) - 1);

        if (!EXPONENTIAL) {
            // The answer first wraps modulo 10^9 + 7 at n = 30 distinct values (2^30 - 1 > MOD).
            check(distinctThenPair(29), byFormula(distinctThenPair(29)));
            check(ascending(30), (1L << 30) - 1 - MOD);
            // Section 11: an int product goes wrong first here (36 distinct values, then a pair).
            check(distinctThenPair(36), 158_428_765);

            // Largest n = 2 * 10^5.
            int max = 200_000;
            check(ascending(max), 175_895_281);          // 2^200000 - 1 mod 10^9 + 7
            int[] equal = new int[max];
            Arrays.fill(equal, 1_000_000_000);
            check(equal, max);                           // one value, n copies
            int[] pairs = new int[max];
            for (int i = 0; i < max; i++) pairs[i] = i / 2 + 1;
            check(pairs, byFormula(pairs));              // 3^100000 - 1
            for (int range : new int[] {2, 1000, 100_000, 1_000_000_000}) {
                int[] x = new int[max];
                for (int i = 0; i < max; i++) x[i] = 1 + random.nextInt(range);
                check(x, byFormula(x));
            }
        }

        // The test inputs themselves must be valid.
        expectInvalid(new int[] {});
        expectInvalid(new int[] {0});
        expectInvalid(new int[] {1_000_000_001});
        expectInvalid(new int[200_001]);

        System.out.println("PASS " + cases + " cases");
    }

    static boolean declares(String name) {
        for (Method m : Main.class.getDeclaredMethods()) {
            if (m.getName().equals(name)) return true;
        }
        return false;
    }

    /** Counts position sets with pairwise different values by building them one position at a time. */
    static long byEnumeration(int[] x) {
        return extend(x, 0, new int[x.length], 0) - 1;  // minus the empty set
    }

    static long extend(int[] x, int from, int[] chosen, int size) {
        long total = 1;                                  // the set as it stands
        for (int i = from; i < x.length; i++) {
            boolean clash = false;
            for (int k = 0; k < size; k++) if (chosen[k] == x[i]) clash = true;
            if (clash) continue;
            chosen[size] = x[i];
            total += extend(x, i + 1, chosen, size + 1);
        }
        return total;
    }

    /** (product of (count + 1)) - 1, in exact BigInteger arithmetic, reduced once at the end. */
    static long byFormula(int[] x) {
        TreeMap<Integer, Integer> count = new TreeMap<>();
        for (int v : x) count.merge(v, 1, Integer::sum);
        BigInteger product = BigInteger.ONE;
        for (int c : count.values()) product = product.multiply(BigInteger.valueOf(c + 1L));
        return product.subtract(BigInteger.ONE).mod(BigInteger.valueOf(MOD)).longValue();
    }

    static int[] ascending(int n) {
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = i + 1;
        return a;
    }

    /** 1..k once each, then k + 1 twice: (2^k * 3) - 1 subsequences. */
    static int[] distinctThenPair(int k) {
        int[] a = new int[k + 2];
        for (int i = 0; i < k; i++) a[i] = i + 1;
        a[k] = k + 1;
        a[k + 1] = k + 1;
        return a;
    }

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

    static void check(int[] x, long expected) throws Exception {
        String problem = invalid(x);
        if (problem != null) throw new IllegalArgumentException("invalid test: " + problem);
        if (EXPONENTIAL && x.length > 20) throw new IllegalStateException("n too large for the enumeration");
        StringBuilder sb = new StringBuilder();
        sb.append(x.length).append('\n');
        for (int i = 0; i < x.length; i++) {
            if (i > 0) sb.append(' ');
            sb.append(x[i]);
        }
        checkRaw(sb.append('\n').toString(), expected);
    }

    static void checkRaw(String input, long expected) throws Exception {
        String output = run(input).trim();
        if (!output.equals(String.valueOf(expected))) {
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
