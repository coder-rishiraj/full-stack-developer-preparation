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
 * Tests for every "public class Main" on the Sum of Four Values page (run by `npm run problems:verify`).
 *
 * Any four valid positions are accepted, so a checker validates each answer (four distinct positions
 * in 1..n whose values sum to x, or IMPOSSIBLE exactly when no such positions exist) instead of comparing
 * it with one expected string.
 *
 * The page's O(n^4) alternative runs these tests too. It is recognised by its method
 * `searchAllQuadruples`; for it, the inputs at n = 1000 that make it scan everything (about 4 * 10^10
 * sums) are replaced by the same shapes at n = 80.
 */
class Tests {
    static final int K = 4;
    static final int MAX_N = 1000;
    static final int MAX_V = 1_000_000_000;
    static final boolean QUARTIC = declares("searchAllQuadruples");
    static int cases = 0;

    public static void main(String[] args) throws Exception {
        // The checker must reject wrong answers before it is trusted.
        int[] ex = {3, 2, 5, 8, 1, 3, 2, 3};
        expectRejected(ex, 15, "IMPOSSIBLE");          // 3 + 2 + 8 + 2 = 15 exists
        expectRejected(ex, 15, "1 2 3 4");             // 3 + 2 + 5 + 8 = 18
        expectRejected(ex, 15, "1 2 4 4");             // position 4 used twice
        expectRejected(ex, 15, "1 2 4");               // too few positions
        expectRejected(ex, 15, "1 2 4 7 8");           // too many positions
        expectRejected(ex, 15, "0 2 4 7");             // position outside 1..n
        expectRejected(ex, 15, "1 2 4 9");             // position outside 1..n
        expectRejected(ex, 15, "");                    // nothing printed
        expectRejected(ex, 15, "impossible");          // wrong wording
        expectRejected(new int[] {3, 1, 2, 1}, 7, "1 2 2 3");   // the "insert too early" bug from section 11
        expectRejected(new int[] {2, 2, 2, 2}, 9, "1 2 3 4");   // sum 8, not 9

        // The example (the dry-run input of every approach) and the second dry run.
        check(ex, 15, true);
        check(new int[] {4, 1, 2, 3}, 9, false);

        // The official CSES tests stored with the site (public/tests/cses/cses-sum-of-four-values.json).
        check(new int[] {1}, 4, false);
        check(new int[] {4, 1, 2, 3}, 9, false);
        check(new int[] {4, 2, 1, 3}, 10, true);
        check(new int[] {1, 4, 3, 2}, 11, false);
        check(new int[] {1, 2, 10}, 6, false);
        check(new int[] {1, 2, 3, 4, 5}, 14, true);
        check(new int[] {7, 2, 2, 1, 7, 3, 2}, 7, true);
        check(new int[] {4, 4, 7, 2}, 16, false);
        check(new int[] {1, 2, 2, 1, 4, 3, 8}, 7, true);
        check(new int[] {1, 2, 3, 5, 3, 4}, 15, true);
        check(new int[] {2, 2, 2, 2}, 8, true);
        check(new int[] {1, 2, 2}, 6, false);

        // Edge cases from section 3: fewer than four numbers, exactly four, duplicates that must be
        // used at different positions, the value limits.
        check(new int[] {1, 1, 1}, 3, false);
        check(new int[] {1, 1, 1, 1}, 4, true);
        check(new int[] {1, 1, 1, 1}, 5, false);
        check(new int[] {5, 5, 5}, 20, false);          // 5 + 5 + 5 + 5 needs four positions
        check(new int[] {3, 1, 2, 1}, 7, true);         // only 1 2 3 4; 3 + 1 + 1 + 2 reusing 2 is not allowed
        check(new int[] {1, 1, 2, 3}, 9, false);        // 1 + 2 + 3 + 3 would reuse position 4
        check(new int[] {MAX_V, MAX_V, MAX_V, MAX_V}, MAX_V, false);  // the sum is 4 * 10^9
        check(new int[] {MAX_V - 3, 1, 1, 1}, MAX_V, true);
        check(new int[] {250_000_000, 250_000_000, 250_000_000, 250_000_000}, MAX_V, true);
        check(new int[] {1, 1, 1, 1}, MAX_V, false);

        // Random small inputs against a brute force over every quadruple.
        Random random = new Random(20261116L);
        for (int t = 0; t < 3000; t++) {
            int n = 1 + random.nextInt(30);
            int range = t % 3 == 0 ? 4 : t % 3 == 1 ? 50 : MAX_V;
            int[] a = new int[n];
            for (int i = 0; i < n; i++) a[i] = 1 + random.nextInt(range);
            int x;
            if (n >= K && random.nextBoolean()) {
                long s = sumOfRandomPositions(a, random);
                x = s <= MAX_V ? (int) s : 1 + random.nextInt(MAX_V);
            } else {
                x = 1 + random.nextInt(t % 3 == 2 ? MAX_V : 4 * range);
            }
            check(a, x, null);
        }

        // Largest n = 1000. The answer's existence is known by construction.
        int big = QUARTIC ? 80 : MAX_N;
        check(filled(big, MAX_V), MAX_V, false);                      // every sum is 4 * 10^9
        check(filled(big, 250_000_000), MAX_V, true);
        check(filled(big, 1), 5, false);
        int[] descending = new int[big];
        for (int i = 0; i < big; i++) descending[i] = MAX_V - i;
        check(descending, 3, false);                                  // every sum is at least 4
        int[] even = new int[big];
        for (int i = 0; i < big; i++) even[i] = 2 * (1 + random.nextInt(MAX_V / 2));
        check(even, 999_999_999, false);                              // even sums only, odd x
        int[] planted = even.clone();
        planted[big - 4] = 1;
        planted[big - 3] = 3;
        planted[big - 2] = 5;
        planted[big - 1] = 999_999_990;                               // 1 + 3 + 5 + 999,999,990
        check(planted, 999_999_999, true);
        int[] plantedSpread = even.clone();
        plantedSpread[0] = 1;
        plantedSpread[big / 3] = 1;
        plantedSpread[2 * big / 3] = 1;
        plantedSpread[big - 1] = 999_999_996;
        check(plantedSpread, 999_999_999, true);
        int[] small = new int[big];
        for (int i = 0; i < big; i++) small[i] = 1 + random.nextInt(1000);
        small[big / 2] = small[big / 2 + 1] = small[big / 2 + 2] = small[big / 2 + 3] = 500;
        check(small, 2000, true);                                     // many answers
        check(small, 4001, false);                                    // above 4 * the largest value

        // The test inputs themselves must be valid.
        expectInvalid(new int[] {}, 4);                    // n below 1
        expectInvalid(new int[MAX_N + 1], 4);              // n above 1000
        expectInvalid(new int[] {0, 1, 1, 1}, 4);          // a value below 1
        expectInvalid(new int[] {1, 1, 1, MAX_V + 1}, 4);  // a value above 10^9
        expectInvalid(new int[] {1, 1, 1, 1}, 0);          // x below 1
        expectInvalid(new int[] {1, 1, 1, 1}, MAX_V + 1);  // x above 10^9

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

    /** Whether some K distinct positions sum to x, by trying every quadruple (small n only). */
    static boolean bruteExists(int[] a, long x) {
        int n = a.length;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                for (int k = j + 1; k < n; k++)
                    for (int l = k + 1; l < n; l++)
                        if ((long) a[i] + a[j] + a[k] + a[l] == x) return true;
        return false;
    }

    /** Null when the input is within the statement's limits, otherwise the reason it is not. */
    static String invalid(int[] a, long x) {
        if (a.length < 1 || a.length > MAX_N) return "n must be in 1..1000";
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
        if (a.length <= 40 && bruteExists(a, x) != expected) {
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
