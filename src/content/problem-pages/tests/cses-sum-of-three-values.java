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

/**
 * Tests for every "public class Main" on the Sum of Three Values page (run by `npm run problems:verify`).
 *
 * Any three valid positions are accepted, so a checker validates each answer (three distinct positions
 * in 1..n whose values sum to x, or IMPOSSIBLE exactly when no such positions exist) instead of comparing
 * it with one expected string.
 *
 * The page's O(n^3) alternative runs these tests too. It is recognised by its method `searchAllTriples`;
 * for it, the inputs at n = 5000 that make it scan everything (about 2 * 10^10 sums, 4 s measured) are
 * replaced by the same shapes at n = 600.
 */
class Tests {
    static final int K = 3;
    static final int MAX_N = 5000;
    static final int MAX_V = 1_000_000_000;
    static final boolean CUBIC = declares("searchAllTriples");
    static int cases = 0;

    public static void main(String[] args) throws Exception {
        // The checker must reject wrong answers before it is trusted.
        int[] ex = {2, 7, 5, 1};
        expectRejected(ex, 8, "IMPOSSIBLE");           // 2 + 5 + 1 = 8 exists
        expectRejected(ex, 8, "1 2 3");                // 2 + 7 + 5 = 14
        expectRejected(ex, 8, "1 3 3");                // position 3 used twice
        expectRejected(ex, 8, "1 3");                  // too few positions
        expectRejected(ex, 8, "1 3 4 2");              // too many positions
        expectRejected(ex, 8, "0 3 4");                // position outside 1..n
        expectRejected(ex, 8, "1 3 5");                // position outside 1..n
        expectRejected(ex, 8, "");                     // nothing printed
        expectRejected(ex, 8, "impossible");           // wrong wording
        expectRejected(new int[] {1, 1, 2}, 5, "1 3 3"); // the "put before get" bug from section 11
        expectRejected(new int[] {1, 1, 1}, 4, "1 2 3"); // sum 3, not 4

        // The example (the dry-run input of every approach) and the second dry run.
        check(ex, 8, true);
        check(new int[] {1, 3, 2}, 5, false);

        // The official CSES tests stored with the site (public/tests/cses/cses-sum-of-three-values.json).
        check(new int[] {1}, 3, false);
        check(new int[] {1, 3, 2}, 5, false);
        check(new int[] {1, 3, 2}, 6, true);
        check(new int[] {3, 2, 1}, 7, false);
        check(new int[] {2, 1, 1, 2, 2, 1, 1}, 3, true);
        check(new int[] {1, 1, 2, 2, 1, 2, 1}, 4, true);
        check(new int[] {1, 2, 1, 2, 2, 1, 1}, 5, true);
        check(new int[] {2, 1, 1, 1, 1, 2, 2}, 6, true);
        int[] ones = filled(MAX_N, 1);
        check(ones, 3, true);
        if (!CUBIC) check(ones, 4, false);
        int[] threeTwos = filled(MAX_N, 1);
        threeTwos[713] = threeTwos[3517] = threeTwos[4239] = 2;   // only these three sum to 6
        if (!CUBIC) check(threeTwos, 6, true);
        check(new int[] {2, 2}, 6, false);

        // Edge cases from section 3: fewer than three numbers, exactly three, duplicates that must be
        // used at different positions, the value limits.
        check(new int[] {1}, 1, false);
        check(new int[] {1, 1}, 2, false);
        check(new int[] {1, 1, 1}, 3, true);
        check(new int[] {1, 1, 1}, 4, false);
        check(new int[] {5, 5, 5, 5}, 15, true);
        check(new int[] {5, 5}, 15, false);             // 5 + 5 + 5 needs three positions
        check(new int[] {1, 1, 2}, 5, false);           // 1 + 2 + 2 would reuse position 3
        check(new int[] {MAX_V, MAX_V, MAX_V}, MAX_V, false);         // the sum is 3 * 10^9
        check(new int[] {MAX_V - 2, 1, 1}, MAX_V, true);
        check(new int[] {333_333_333, 333_333_333, 333_333_334}, MAX_V, true);
        check(new int[] {1, 1, 1}, MAX_V, false);

        // Random small inputs against a brute force over every triple.
        Random random = new Random(20261116L);
        for (int t = 0; t < 3000; t++) {
            int n = 1 + random.nextInt(40);
            int range = t % 3 == 0 ? 4 : t % 3 == 1 ? 50 : MAX_V;
            int[] a = new int[n];
            for (int i = 0; i < n; i++) a[i] = 1 + random.nextInt(range);
            int x;
            if (n >= K && random.nextBoolean()) {
                long s = sumOfRandomPositions(a, random);
                x = s <= MAX_V ? (int) s : 1 + random.nextInt(MAX_V);
            } else {
                x = 1 + random.nextInt(t % 3 == 2 ? MAX_V : 3 * range);
            }
            check(a, x, null);
        }

        // Largest n = 5000. The answer's existence is known by construction.
        int big = CUBIC ? 600 : MAX_N;
        check(filled(big, MAX_V), MAX_V, false);                      // every sum is 3 * 10^9
        check(filled(big, 333_333_333), 999_999_999, true);
        int[] descending = new int[big];
        for (int i = 0; i < big; i++) descending[i] = MAX_V - i;
        check(descending, 2, false);                                  // every sum is at least 3
        int[] even = new int[big];
        for (int i = 0; i < big; i++) even[i] = 2 * (1 + random.nextInt(MAX_V / 2));
        check(even, 999_999_999, false);                              // even sums only, odd x
        int[] planted = even.clone();
        planted[big - 3] = 1;
        planted[big - 2] = 3;
        planted[big - 1] = 999_999_995;                               // 1 + 3 + 999,999,995
        check(planted, 999_999_999, true);
        int[] plantedFirst = even.clone();
        plantedFirst[0] = 333_333_333;
        plantedFirst[1] = 333_333_333;
        plantedFirst[2] = 333_333_333;
        check(plantedFirst, 999_999_999, true);
        int[] small = new int[big];
        for (int i = 0; i < big; i++) small[i] = 1 + random.nextInt(1000);
        small[big / 2] = small[big / 2 + 1] = small[big / 2 + 2] = 500;
        check(small, 1500, true);                                     // many answers
        check(small, 3001, false);                                    // above 3 * the largest value

        // The test inputs themselves must be valid.
        expectInvalid(new int[] {}, 3);                    // n below 1
        expectInvalid(new int[MAX_N + 1], 3);              // n above 5000
        expectInvalid(new int[] {0, 1, 1}, 3);             // a value below 1
        expectInvalid(new int[] {1, 1, MAX_V + 1}, 3);     // a value above 10^9
        expectInvalid(new int[] {1, 1, 1}, 0);             // x below 1
        expectInvalid(new int[] {1, 1, 1}, MAX_V + 1);     // x above 10^9

        System.out.println("PASS " + cases + " cases");
    }

    static boolean declares(String name) {
        for (Method m : Main.class.getDeclaredMethods()) {
            if (m.getName().equals(name)) return true;
        }
        return false;
    }

    static int[] filled(int n, int value) {
        int[] a = new int[n];
        Arrays.fill(a, value);
        return a;
    }

    static long sumOfRandomPositions(int[] a, Random random) {
        List<Integer> positions = new ArrayList<>();
        for (int i = 0; i < a.length; i++) positions.add(i);
        java.util.Collections.shuffle(positions, random);
        long s = 0;
        for (int i = 0; i < K; i++) s += a[positions.get(i)];
        return s;
    }

    /** Whether some K distinct positions sum to x, by trying every triple (small n only). */
    static boolean bruteExists(int[] a, long x) {
        int n = a.length;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                for (int k = j + 1; k < n; k++)
                    if ((long) a[i] + a[j] + a[k] == x) return true;
        return false;
    }

    /** Null when the input is within the statement's limits, otherwise the reason it is not. */
    static String invalid(int[] a, long x) {
        if (a.length < 1 || a.length > MAX_N) return "n must be in 1..5000";
        if (x < 1 || x > MAX_V) return "x must be in 1..10^9";
        for (int v : a) {
            if (v < 1 || v > MAX_V) return "value " + v + " outside 1..10^9";
        }
        return null;
    }

    static void expectInvalid(int[] a, long x) {
        if (invalid(a, x) == null) throw new AssertionError("the input guard accepted an invalid input");
    }

    static void expectRejected(int[] a, long x, String output) {
        if (validate(a, x, output, bruteExists(a, x)) == null) {
            throw new AssertionError("checker accepted a wrong answer: " + Arrays.toString(a) + " x=" + x + " -> " + output);
        }
    }

    /** Returns null when output is a correct answer, otherwise the reason it is wrong. */
    static String validate(int[] a, long x, String output, boolean exists) {
        String[] t = output.trim().isEmpty() ? new String[0] : output.trim().split("\\s+");
        if (t.length == 1 && t[0].equals("IMPOSSIBLE")) {
            return exists ? "printed IMPOSSIBLE but an answer exists" : null;
        }
        if (t.length != K) return "expected " + K + " positions or IMPOSSIBLE, got " + t.length + " tokens";
        boolean[] used = new boolean[a.length + 1];
        long sum = 0;
        for (String token : t) {
            int p;
            try {
                p = Integer.parseInt(token);
            } catch (NumberFormatException e) {
                return "not a position: " + token;
            }
            if (p < 1 || p > a.length) return "position " + p + " outside 1.." + a.length;
            if (used[p]) return "position " + p + " used twice";
            used[p] = true;
            sum += a[p - 1];
        }
        if (sum != x) return "the values at these positions sum to " + sum + ", not " + x;
        return null;
    }

    /** Runs Main on (a, x); `exists` is the known answer, or null to compute it by brute force. */
    static void check(int[] a, long x, Boolean exists) throws Exception {
        String problem = invalid(a, x);
        if (problem != null) throw new IllegalArgumentException("invalid test: " + problem);
        boolean expected = exists != null ? exists : bruteExists(a, x);
        if (a.length <= 60 && bruteExists(a, x) != expected) {
            throw new AssertionError("test says exists=" + expected + " but brute force disagrees");
        }
        StringBuilder in = new StringBuilder();
        in.append(a.length).append(' ').append(x).append('\n');
        for (int i = 0; i < a.length; i++) {
            if (i > 0) in.append(' ');
            in.append(a[i]);
        }
        in.append('\n');
        String output = run(in.toString());
        String wrong = validate(a, x, output, expected);
        if (wrong != null) {
            String shown = in.length() > 80 ? in.substring(0, 80) + "..." : in.toString();
            throw new AssertionError(wrong + "\ninput: " + shown + "\noutput: " + output);
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
