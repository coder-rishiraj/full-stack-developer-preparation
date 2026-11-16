import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.util.Random;

/**
 * Tests for every "public class Main" on the Subarray Sum Constraints page (run by
 * `npm run problems:verify`).
 *
 * Any valid array is accepted, so a checker validates each answer: YES exactly when a solution
 * exists (decided independently), then n integers in [-10^15, 10^15] that satisfy every constraint.
 *
 * The page's sweep alternative runs these tests too. It is recognised by its method `solveBySweeps`;
 * its two worst cases (one new prefix sum per sweep, and many free prefix sums, each costing a full
 * sweep; 1.6 s and 1.9 s measured at n = 5000, m = 2 * 10^5) are replaced for it by the same inputs at
 * m = 20,000.
 */
class Tests {
    static int cases = 0;
    static final boolean SWEEPS = declares("solveBySweeps");
    static final long LIMIT = 1_000_000_000_000_000L;   // |x_i| <= 10^15 in the output

    public static void main(String[] args) throws Exception {
        // The checker itself must reject wrong answers before it is trusted.
        String example = "5 3\n1 3 3\n3 5 3\n4 4 -1\n";
        expectRejected(example, "YES\n0 0 3 -1 2\n");            // breaks 3..5 = 3
        expectRejected(example, "NO\n");                         // a solution exists
        expectRejected(example, "YES\n0 0 3 -1\n");              // too few numbers
        expectRejected(example, "YES\n0 0 3 -1 1 0\n");          // too many numbers
        expectRejected(example, "Yes\n0 0 3 -1 1\n");            // wrong wording
        expectRejected(example, "YES\n0 0 3 -1 1.0\n");          // not an integer
        expectRejected(example, "YES\n1000000000000001 -1000000000000001 3 -1 1\n"); // out of range
        expectRejected(example, "");
        expectRejected("3 3\n1 1 2\n2 3 4\n1 3 5\n", "YES\n2 2 2\n"); // no solution exists
        expectRejected("1 0\n", "YES\n");
        expectAccepted(example, "YES\n0 2 1 -1 3\n");             // the statement's own answer
        expectAccepted(example, "YES\n0 0 3 -1 1\n");             // the official test file's answer

        // The example, and the NO dry run of section 4.
        check(example, true);
        check("3 3\n1 1 2\n2 3 4\n1 3 5\n", false);

        // The official CSES tests stored with the site (public/tests/cses/cses-subarray-sum-constraints.json).
        check("8 8\n6 7 -9\n1 2 -5\n4 7 5\n1 2 -3\n1 2 -7\n6 8 8\n6 7 3\n2 6 3\n", false);
        check("5000 0\n", true);
        check("3 3\n1 1 1000000000\n1 2 -1000000000\n2 3 1000000000\n", true);

        // Edge cases from section 3.
        check("1 0\n", true);                                      // n = 1, no constraints
        check("1 1\n1 1 -1000000000\n", true);                     // one element fixed at a limit
        check("1 2\n1 1 5\n1 1 5\n", true);                        // the same constraint twice
        check("1 2\n1 1 5\n1 1 6\n", false);                       // two values for one element
        check("2 1\n1 2 7\n", true);                               // only the sum is fixed
        check("2 3\n1 2 7\n1 1 3\n2 2 4\n", true);                 // consistent cycle
        check("2 3\n1 2 7\n1 1 3\n2 2 5\n", false);                // inconsistent cycle
        check("4 2\n1 2 0\n3 4 0\n", true);                        // two separate groups
        check("3 3\n1 2 1\n2 3 1\n1 3 3\n", true);                 // overlapping sums: x = 2 -1 2
        check("3 4\n1 2 1\n2 3 1\n1 3 3\n2 2 0\n", false);        // x2 = 0 forces x1 = x3 = 1, sum 2
        check("5 3\n1 3 3\n3 5 3\n4 4 -1", true);                  // no final newline

        // Random small inputs against an independent closure over all pairs of prefix sums.
        Random random = new Random(20261116L);
        for (int t = 0; t < 3000; t++) {
            int n = 1 + random.nextInt(12);
            int m = random.nextInt(3 * n + 2);
            boolean planted = t % 2 == 0;
            int bound = t % 3 == 0 ? 2 : 1_000_000_000;
            long[] x = new long[n + 1];
            for (int i = 1; i <= n; i++) x[i] = random.nextInt(2 * Math.min(bound, 1000) + 1) - Math.min(bound, 1000);
            int[][] c = new int[m][3];
            for (int k = 0; k < m; k++) {
                int l = 1 + random.nextInt(n);
                int r = l + random.nextInt(n - l + 1);
                long s = 0;
                for (int i = l; i <= r; i++) s += x[i];
                if (!planted && random.nextInt(4) == 0) s = random.nextInt(2 * bound + 1) - bound;
                c[k] = new int[] {l, r, (int) s};
            }
            String in = input(n, c);
            check(in, feasibleByClosure(n, c));
        }

        // Largest n with the largest values: x_i = 10^9 forced for i < n, x_n free. Prefix sums
        // reach 4.999 * 10^12, and an answer that starts x_n's group at 0 prints x_n = -4.999 * 10^12.
        int n = 5000;
        int[][] chain = new int[n - 1][];
        for (int i = 1; i < n; i++) chain[i - 1] = new int[] {i, i, 1_000_000_000};
        check(input(n, chain), true);

        // The largest m: random constraints from a planted array, then one contradiction at the end.
        int m = 200_000;
        long[] x = new long[n + 1];
        for (int i = 1; i <= n; i++) x[i] = random.nextInt(7) - 3;
        long[] p = new long[n + 1];
        for (int i = 1; i <= n; i++) p[i] = p[i - 1] + x[i];
        int[][] planted = new int[m][];
        for (int k = 0; k < m; k++) {
            int l = 1 + random.nextInt(n);
            int r = l + random.nextInt(n - l + 1);
            planted[k] = new int[] {l, r, (int) (p[r] - p[l - 1])};
        }
        check(input(n, planted), true);
        int[][] broken = planted.clone();
        broken[m - 1] = new int[] {broken[m - 1][0], broken[m - 1][1], broken[m - 1][2] + 1};
        check(input(n, broken), false);

        // Alternating +-10^9 singles in decreasing index order after filler that repeats the last
        // one: each sweep of the sweep alternative fixes just one more prefix sum.
        check(input(n, adversarialOrder(n, SWEEPS ? 20_000 : m)), true);
        // Every constraint covers the whole array: one group {P0, Pn}, all others free.
        // (Many free prefix sums: the sweep alternative needs a full sweep per free one, so it gets
        // m = 20,000 here.)
        int mWhole = SWEEPS ? 20_000 : m;
        int[][] whole = new int[mWhole][];
        for (int k = 0; k < mWhole; k++) whole[k] = new int[] {1, n, -1_000_000_000};
        check(input(n, whole), true);
        whole[mWhole / 2] = new int[] {1, n, 1_000_000_000};
        check(input(n, whole), false);

        // The test inputs themselves must be valid.
        expectInvalid(0, new int[][] {});                                   // n below 1
        expectInvalid(5001, new int[][] {});                                // n above 5000
        expectInvalid(3, new int[][] {{2, 1, 0}});                          // l > r
        expectInvalid(3, new int[][] {{0, 1, 0}});                          // l below 1
        expectInvalid(3, new int[][] {{1, 4, 0}});                          // r above n
        expectInvalid(3, new int[200_001][]);                               // m above 2 * 10^5

        System.out.println("PASS " + cases + " cases");
    }

    static boolean declares(String name) {
        for (Method method : Main.class.getDeclaredMethods()) {
            if (method.getName().equals(name)) return true;
        }
        return false;
    }

    static int[][] adversarialOrder(int n, int m) {
        int[][] c = new int[m][];
        int filler = m - n;
        for (int k = 0; k < filler; k++) c[k] = new int[] {n, n, n % 2 == 1 ? 1_000_000_000 : -1_000_000_000};
        for (int i = n; i >= 1; i--) c[filler + n - i] = new int[] {i, i, i % 2 == 1 ? 1_000_000_000 : -1_000_000_000};
        return c;
    }

    /**
     * Independent feasibility check for small n: d[i][j] holds P[j] - P[i] when it is implied by the
     * constraints. Each constraint sets one entry; then a Floyd-Warshall-style closure combines
     * known differences through every middle node and reports any two that disagree.
     */
    static boolean feasibleByClosure(int n, int[][] c) {
        Long[][] d = new Long[n + 1][n + 1];
        for (int i = 0; i <= n; i++) d[i][i] = 0L;
        for (int[] k : c) {
            int u = k[0] - 1;
            int v = k[1];
            long s = k[2];
            if (d[u][v] != null && d[u][v] != s) return false;
            d[u][v] = s;
            d[v][u] = -s;
        }
        for (int mid = 0; mid <= n; mid++) {
            for (int i = 0; i <= n; i++) {
                if (d[i][mid] == null) continue;
                for (int j = 0; j <= n; j++) {
                    if (d[mid][j] == null) continue;
                    long through = d[i][mid] + d[mid][j];
                    if (d[i][j] == null) d[i][j] = through;
                    else if (d[i][j] != through) return false;
                }
            }
        }
        return true;
    }

    /** Null when the output is a valid answer for the input, otherwise what is wrong. */
    static String validate(String input, String output, boolean feasible) {
        String[] t = input.trim().split("\\s+");
        int n = Integer.parseInt(t[0]);
        int m = Integer.parseInt(t[1]);
        String trimmed = output.trim();
        String[] o = trimmed.isEmpty() ? new String[0] : trimmed.split("\\s+");
        if (o.length == 0) return "no output";
        if (o[0].equals("NO")) {
            if (o.length != 1) return "extra output after NO";
            return feasible ? "printed NO, but a solution exists" : null;
        }
        if (!o[0].equals("YES")) return "the first line must be YES or NO";
        if (!feasible) return "printed YES, but no solution exists";
        if (o.length != n + 1) return "expected " + n + " numbers after YES, got " + (o.length - 1);
        long[] p = new long[n + 1];
        for (int i = 1; i <= n; i++) {
            long v;
            try {
                v = Long.parseLong(o[i]);
            } catch (NumberFormatException e) {
                return "not an integer: " + o[i];
            }
            if (v < -LIMIT || v > LIMIT) return "x_" + i + " = " + v + " is outside [-10^15, 10^15]";
            p[i] = p[i - 1] + v;
        }
        for (int k = 0; k < m; k++) {
            int l = Integer.parseInt(t[2 + 3 * k]);
            int r = Integer.parseInt(t[3 + 3 * k]);
            long s = Long.parseLong(t[4 + 3 * k]);
            if (p[r] - p[l - 1] != s) return "constraint " + (k + 1) + " (" + l + " " + r + " " + s + ") fails";
        }
        return null;
    }

    static void expectRejected(String input, String output) {
        boolean feasible = !input.startsWith("3 3\n1 1 2\n");
        if (validate(input, output, feasible) == null) {
            throw new AssertionError("checker accepted a wrong answer: " + output);
        }
    }

    static void expectAccepted(String input, String output) {
        String problem = validate(input, output, true);
        if (problem != null) throw new AssertionError("checker rejected a valid answer: " + problem);
    }

    /** Null when the input is valid, otherwise the reason it is not. */
    static String invalid(int n, int[][] c) {
        if (n < 1 || n > 5000) return "n must be in 1..5000";
        if (c.length > 200_000) return "m must be at most 2*10^5";
        for (int[] k : c) {
            if (k == null) return "missing constraint";
            if (k[0] < 1 || k[0] > k[1] || k[1] > n) return "need 1 <= l <= r <= n";
            if (k[2] < -1_000_000_000 || k[2] > 1_000_000_000) return "s outside -10^9..10^9";
        }
        return null;
    }

    static void expectInvalid(int n, int[][] c) {
        if (invalid(n, c) == null) throw new AssertionError("the input guard accepted an invalid input");
    }

    static String input(int n, int[][] c) {
        String problem = invalid(n, c);
        if (problem != null) throw new IllegalArgumentException("invalid test: " + problem);
        StringBuilder sb = new StringBuilder();
        sb.append(n).append(' ').append(c.length).append('\n');
        for (int[] k : c) sb.append(k[0]).append(' ').append(k[1]).append(' ').append(k[2]).append('\n');
        return sb.toString();
    }

    static void check(String input, boolean feasible) throws Exception {
        String output = run(input);
        String problem = validate(input, output, feasible);
        if (problem != null) {
            String shown = input.length() > 60 ? input.substring(0, 60) + "..." : input;
            String got = output.length() > 80 ? output.substring(0, 80) + "..." : output;
            throw new AssertionError("input " + shown + "\n" + problem + "\noutput: " + got);
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
