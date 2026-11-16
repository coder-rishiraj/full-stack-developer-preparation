import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "public class Main" on the Sum of Two Values page (run by `npm run problems:verify`).
 *
 * Any valid pair of positions is accepted, so a checker validates each answer: either two different
 * positions in 1..n whose values sum to x, or IMPOSSIBLE when an independent check (sorting a copy
 * of the values) finds no pair.
 *
 * The page's all-pairs alternative (O(n^2)) is recognised by its method `findPairByAllPairs`; for
 * it, the n = 2 * 10^5 inputs whose answer is found late or never are replaced by n = 5,000.
 */
class Tests {
    static int cases = 0;
    static final boolean QUADRATIC = declares("findPairByAllPairs");

    public static void main(String[] args) throws Exception {
        // The checker itself must reject wrong answers before it is trusted.
        expectRejected("4 8\n2 7 5 1\n", "IMPOSSIBLE");     // a pair exists
        expectRejected("4 8\n2 7 5 1\n", "1 2");            // 2 + 7 = 9
        expectRejected("1 8\n4\n", "1 1");                  // the same position twice
        expectRejected("3 10\n5 1 4\n", "1 1");             // 5 + 5 needs two different 5s
        expectRejected("4 8\n2 7 5 1\n", "2 5");            // position out of range
        expectRejected("4 8\n2 7 5 1\n", "0 2");            // positions are 1-based
        expectRejected("4 8\n2 7 5 1\n", "2");              // one position
        expectRejected("4 8\n2 7 5 1\n", "2 4 1");          // extra token
        expectRejected("4 8\n2 7 5 1\n", "Impossible");     // wrong wording
        expectRejected("2 3\n1 1\n", "1 2");                // 1 + 1 = 2
        expectRejected("2 3\n1 1\n", "");

        // The CSES example and the page's other examples and dry runs.
        check("4 8\n2 7 5 1\n");                            // 2 4
        check("3 10\n5 1 4\n");                             // IMPOSSIBLE: 5 + 5 needs two 5s
        check("3 10\n5 1 5\n");                             // 1 3: equal values, different positions
        check("5 10\n6 3 8 1 4\n");                         // 1 5
        check("1 8\n4\n");                                  // the map-first bug prints 1 1
        check("1 4\n2\n");                                  // the lo <= hi bug prints 1 1
        expectAnswer("4 8\n2 7 5 1\n", true);
        expectAnswer("3 10\n5 1 4\n", false);

        // The official CSES tests stored with the site (public/tests/cses/cses-sum-of-two-values.json).
        check("1 2\n1\n");
        check("3 2\n1 2 3\n");
        check("3 3\n2 1 3\n");
        check("3 4\n1 3 2\n");
        check("3 5\n1 2 3\n");
        check("3 6\n1 3 2\n");
        check("3 8\n4 5 3\n");
        check("1 2\n2\n");
        check("4 7\n7 7 7 7\n");
        check("2 6\n1 4\n");
        check("2 2\n1 1\n");
        check("4 4\n3 3 1 2\n");

        // Edge cases from section 3.
        check("1 1\n1\n");                                  // n = 1
        check("2 1\n1 1\n");                                // x = 1: no two values >= 1 sum to 1
        check("2 1000000000\n500000000 500000000\n");       // the two halves, equal
        check("2 1000000000\n1000000000 1000000000\n");     // values equal to x need a 0 partner
        check("3 1000000000\n999999999 1000000000 1\n");    // value + 1 = 10^9
        check("4 6\n3 1 5 3\n");                            // 1 + 5 and 3 + 3 are both valid

        // Random small inputs against the validity checker (which brute-forces existence).
        Random random = new Random(20261116L);
        for (int t = 0; t < 3000; t++) {
            int n = 1 + random.nextInt(12);
            int range = 1 + random.nextInt(t % 3 == 0 ? 10 : t % 3 == 1 ? 100 : 1_000_000_000);
            int[] a = values(n, range, random);
            int x = 1 + random.nextInt(Math.min(1_000_000_000, 2 * range));
            check(input(a, x));
        }

        // Largest n = 2 * 10^5.
        int max = 200_000;
        int size = QUADRATIC ? 5_000 : max;
        // A pair at the very start: fast for every program.
        int[] early = values(max, 400_000_000, random);
        early[0] = 300_000_000;
        early[1] = 700_000_000;
        check(input(early, 1_000_000_000));
        // All values equal to 5 * 10^8, x = 10^9: any two positions.
        int[] same = new int[max];
        Arrays.fill(same, 500_000_000);
        check(input(same, 1_000_000_000));
        // No pair: every value even, x odd.
        int[] even = new int[size];
        for (int i = 0; i < size; i++) even[i] = 2 * (1 + random.nextInt(499_999_999));
        check(input(even, 999_999_999));
        expectAnswer(input(even, 999_999_999), false);
        // Exactly one pair, hidden at the two last positions.
        int[] late = new int[size];
        for (int i = 0; i < size; i++) late[i] = 2 * (1 + random.nextInt(250_000_000));
        late[size - 2] = 333_333_333;
        late[size - 1] = 666_666_666;
        check(input(late, 999_999_999));
        expectAnswer(input(late, 999_999_999), true);
        // Random values with a random target.
        check(input(values(size, 1_000_000_000, random), 1 + random.nextInt(1_000_000_000)));
        // Distinct keys built to share a few HashMap buckets (section 9), no pair (x = 1).
        check(input(colliding(size, random), 1));

        // The test inputs themselves must be valid.
        expectInvalid(new int[] {}, 5);
        expectInvalid(new int[] {0}, 5);
        expectInvalid(new int[] {1}, 0);
        expectInvalid(new int[] {1_000_000_001}, 5);
        expectInvalid(new int[max + 1], 5);

        System.out.println("PASS " + cases + " cases");
    }

    static boolean declares(String name) {
        for (Method m : Main.class.getDeclaredMethods()) {
            if (m.getName().equals(name)) return true;
        }
        return false;
    }

    static int[] values(int count, int range, Random random) {
        int[] v = new int[count];
        for (int i = 0; i < count; i++) v[i] = 1 + random.nextInt(range);
        return v;
    }

    /**
     * Distinct values in 1..10^9 whose HashMap bucket index, (h ^ (h >>> 16)) & (2^19 - 1), is one
     * of the first few buckets (a table of 2^19 buckets is what `new HashMap<>(2 * n)` allocates).
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
        return a;
    }

    static int[] parse(String input) {
        String[] t = input.trim().split("\\s+");
        int[] v = new int[t.length];
        for (int i = 0; i < t.length; i++) v[i] = Integer.parseInt(t[i]);
        return v;
    }

    /** Whether two different positions sum to x: sort a copy, then scan from both ends. */
    static boolean pairExists(int[] a, long x) {
        int[] s = a.clone();
        Arrays.sort(s);
        int lo = 0, hi = s.length - 1;
        while (lo < hi) {
            long sum = (long) s[lo] + s[hi];
            if (sum == x) return true;
            if (sum < x) lo++; else hi--;
        }
        return false;
    }

    /** Null when output is a correct answer for input, otherwise the reason it is not. */
    static String validate(String input, String output) {
        int[] in = parse(input);
        int n = in[0];
        long x = in[1];
        int[] a = Arrays.copyOfRange(in, 2, 2 + n);
        boolean exists = n <= 12 ? existsByAllPairs(a, x) : pairExists(a, x);
        String[] t = output.trim().split("\\s+");
        if (t.length == 1 && t[0].equals("IMPOSSIBLE")) return exists ? "a pair exists, IMPOSSIBLE is wrong" : null;
        if (t.length != 2) return "expected two positions or IMPOSSIBLE";
        int p, q;
        try {
            p = Integer.parseInt(t[0]);
            q = Integer.parseInt(t[1]);
        } catch (NumberFormatException e) {
            return "not two integers";
        }
        if (p < 1 || p > n || q < 1 || q > n) return "position out of range";
        if (p == q) return "the same position twice";
        if ((long) a[p - 1] + a[q - 1] != x) return "the values sum to " + ((long) a[p - 1] + a[q - 1]);
        return null;
    }

    static boolean existsByAllPairs(int[] a, long x) {
        for (int i = 0; i < a.length; i++) {
            for (int j = i + 1; j < a.length; j++) {
                if ((long) a[i] + a[j] == x) return true;
            }
        }
        return false;
    }

    static void expectRejected(String input, String output) {
        if (validate(input, output) == null) throw new AssertionError("checker accepted a wrong answer: " + output);
    }

    static void expectAnswer(String input, boolean pair) throws Exception {
        boolean printedPair = !run(input).trim().equals("IMPOSSIBLE");
        if (printedPair != pair) throw new AssertionError("expected " + (pair ? "a pair" : "IMPOSSIBLE"));
        cases++;
    }

    /** Null when the input is valid, otherwise the reason it is not. */
    static String invalid(int[] a, int x) {
        if (a.length < 1 || a.length > 200_000) return "n must be in 1..2*10^5";
        if (x < 1 || x > 1_000_000_000) return "x must be in 1..10^9";
        for (int v : a) if (v < 1 || v > 1_000_000_000) return "value " + v + " outside 1..10^9";
        return null;
    }

    static void expectInvalid(int[] a, int x) {
        if (invalid(a, x) == null) throw new AssertionError("the input guard accepted an invalid input");
    }

    static String input(int[] a, int x) {
        String problem = invalid(a, x);
        if (problem != null) throw new IllegalArgumentException("invalid test: " + problem);
        StringBuilder sb = new StringBuilder();
        sb.append(a.length).append(' ').append(x).append('\n');
        for (int i = 0; i < a.length; i++) sb.append(i > 0 ? " " : "").append(a[i]);
        return sb.append('\n').toString();
    }

    static void check(String input) throws Exception {
        int[] in = parse(input);
        if (invalid(Arrays.copyOfRange(in, 2, in.length), in[1]) != null || in[0] != in.length - 2) {
            throw new IllegalArgumentException("invalid test: " + input);
        }
        String output = run(input);
        String problem = validate(input, output);
        if (problem != null) {
            String shown = input.length() > 80 ? input.substring(0, 80) + "..." : input;
            throw new AssertionError("input " + shown + "\n" + problem + "; got " + output);
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
