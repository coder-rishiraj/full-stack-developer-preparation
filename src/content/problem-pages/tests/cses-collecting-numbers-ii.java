import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;

/**
 * Tests for every "public class Main" on the Collecting Numbers II page (run by `npm run problems:verify`).
 *
 * The page's recount-after-every-swap alternative is recognised by its method `recountFromScratch`.
 * It costs n steps per swap, so for it the n = m = 2 * 10^5 inputs (4 * 10^10 steps) are replaced by
 * inputs with n * m = 2 * 10^8.
 */
class Tests {
    static int cases = 0;
    static final boolean RECOUNT = declares("recountFromScratch");

    public static void main(String[] args) throws Exception {
        // The CSES example, which is also the dry-run input of both approaches on the page.
        check("5 3\n4 2 1 5 3\n2 3\n1 5\n2 3\n", "2 3 4");

        // Edge cases from section 3.
        check("1 1\n1\n1 1\n", "1");                          // n = 1: a swap with itself
        check("1 3\n1\n1 1\n1 1\n1 1\n", "1 1 1");
        check("2 2\n1 2\n1 2\n2 1\n", "2 1");                 // n = 2, a = b order both ways
        check("4 2\n1 2 3 4\n2 2\n3 3\n", "1 1");             // a = b changes nothing
        check("4 1\n1 2 3 4\n2 3\n", "2");                    // neighbouring values 2 and 3
        check("4 1\n1 2 3 4\n1 4\n", "3");                    // the values 1 and n at the ends
        check("5 2\n1 2 3 4 5\n1 5\n5 1\n", "3 1");           // swap and swap back
        check("6 1\n1 2 3 4 5 6\n2 5\n", "3");                // section 4's second dry run: values 2 and 5
        check("5 1\n5 4 3 2 1\n1 5\n", "3");                  // reversed, swap the ends

        // Whitespace the judge never sends, but a robust reader accepts.
        check("5 3\n4 2 1 5 3\n2 3\n1 5\n2 3", "2 3 4");      // no final newline
        check("5 3\n4 2\n1 5 3\n2 3 1 5\n2  3\n", "2 3 4");   // tokens over different lines

        // Random small inputs against a brute force that simulates the rounds after every swap.
        Random random = new Random(20261116L);
        for (int t = 0; t < 3000; t++) {
            int n = 1 + random.nextInt(t % 2 == 0 ? 6 : 40);
            int m = 1 + random.nextInt(30);
            int[] x = shuffled(n, random);
            int[][] ops = randomOps(n, m, random, t % 5 == 0);
            String expected = bruteForce(x, ops);
            if (!expected.equals(bySet(x, ops))) throw new AssertionError("the set-based reference disagrees");
            check(input(x, ops), expected);
        }

        // Large inputs: answers from the test's own set-based incremental count (checked against the
        // brute force above on every random case).
        for (int t = 0; t < 200; t++) {
            int n = 1 + random.nextInt(2000);
            int[] x = shuffled(n, random);
            int[][] ops = randomOps(n, 1 + random.nextInt(2000), random, t % 4 == 0);
            check(input(x, ops), bySet(x, ops));
        }

        int max = 200_000;
        if (!RECOUNT) {
            int[] x = shuffled(max, random);
            check(input(x, randomOps(max, max, random, false)), null);
            x = shuffled(max, random);
            check(input(x, randomOps(max, max, random, true)), null);       // neighbouring values only
            int[][] ends = new int[max][];
            for (int i = 0; i < max; i++) ends[i] = new int[] {1, max};
            check(input(ascending(max), ends), alternating(max, "3", "1"));  // swap the ends, then back
            check(input(reversed(ascending(max)), randomOps(max, max, random, false)), null);
        } else {
            check(input(shuffled(max, random), randomOps(max, 1000, random, false)), null);
            check(input(shuffled(1000, random), randomOps(1000, max, random, true)), null);
            int[][] ends = new int[1000][];
            for (int i = 0; i < 1000; i++) ends[i] = new int[] {1, max};
            check(input(ascending(max), ends), alternating(1000, "3", "1"));
        }

        // The test inputs themselves must be valid.
        expectInvalid(new int[] {}, new int[][] {{1, 1}});              // n below 1
        expectInvalid(new int[] {1}, new int[][] {});                   // m below 1
        expectInvalid(new int[] {2, 2}, new int[][] {{1, 2}});          // not a permutation
        expectInvalid(new int[] {1, 2}, new int[][] {{0, 2}});          // position below 1
        expectInvalid(new int[] {1, 2}, new int[][] {{1, 3}});          // position above n
        expectInvalid(ascending(max + 1), new int[][] {{1, 1}});        // n above 2 * 10^5
        expectInvalid(new int[] {1}, new int[max + 1][]);               // m above 2 * 10^5

        System.out.println("PASS " + cases + " cases");
    }

    static boolean declares(String name) {
        for (Method m : Main.class.getDeclaredMethods()) {
            if (m.getName().equals(name)) return true;
        }
        return false;
    }

    /** Applies each swap, then collects the numbers exactly as the statement describes. */
    static String bruteForce(int[] start, int[][] ops) {
        int[] x = start.clone();
        int n = x.length;
        StringBuilder sb = new StringBuilder();
        for (int[] op : ops) {
            int t = x[op[0] - 1]; x[op[0] - 1] = x[op[1] - 1]; x[op[1] - 1] = t;
            int next = 1;
            int rounds = 0;
            while (next <= n) {
                rounds++;
                for (int i = 0; i < n; i++) if (x[i] == next) next++;
            }
            sb.append(rounds).append(' ');
        }
        return sb.toString().trim();
    }

    /** An incremental reference written differently from the page: a HashSet of the touched pairs. */
    static String bySet(int[] start, int[][] ops) {
        int n = start.length;
        int[] x = start.clone();
        int[] pos = new int[n + 1];
        for (int i = 0; i < n; i++) pos[x[i]] = i;
        int rounds = 1;
        for (int v = 1; v < n; v++) if (pos[v + 1] < pos[v]) rounds++;
        StringBuilder sb = new StringBuilder();
        for (int[] op : ops) {
            int a = op[0] - 1, b = op[1] - 1;
            Set<Integer> touched = new HashSet<>();
            for (int value : new int[] {x[a], x[b]}) {
                if (value > 1) touched.add(value - 1);
                if (value < n) touched.add(value);
            }
            for (int k : touched) if (pos[k + 1] < pos[k]) rounds--;
            int t = x[a]; x[a] = x[b]; x[b] = t;
            pos[x[a]] = a;
            pos[x[b]] = b;
            for (int k : touched) if (pos[k + 1] < pos[k]) rounds++;
            sb.append(rounds).append(' ');
        }
        return sb.toString().trim();
    }

    /** m random swaps; with `neighbours`, most swap two values that differ by 1 (or a position with itself). */
    static int[][] randomOps(int n, int m, Random random, boolean neighbours) {
        int[] x = ascending(n);                            // track values only to pick neighbours
        int[] pos = new int[n + 2];
        int[][] ops = new int[m][];
        for (int i = 0; i < m; i++) {
            int a, b;
            if (neighbours && n >= 2 && random.nextInt(10) != 0) {
                int v = 1 + random.nextInt(n - 1);
                a = pos[v] + 1;
                b = pos[v + 1] + 1;
                if (random.nextBoolean()) { int t = a; a = b; b = t; }
            } else if (random.nextInt(20) == 0) {
                a = b = 1 + random.nextInt(n);
            } else {
                a = 1 + random.nextInt(n);
                b = 1 + random.nextInt(n);
            }
            ops[i] = new int[] {a, b};
            if (neighbours) {
                if (i == 0) {
                    for (int p = 0; p < n; p++) pos[x[p]] = p;
                }
                int t = x[a - 1]; x[a - 1] = x[b - 1]; x[b - 1] = t;
                pos[x[a - 1]] = a - 1;
                pos[x[b - 1]] = b - 1;
            }
        }
        return ops;
    }

    static String alternating(int m, String odd, String even) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < m; i++) sb.append(i % 2 == 0 ? odd : even).append(' ');
        return sb.toString().trim();
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

    static int[] shuffled(int n, Random random) {
        int[] a = ascending(n);
        for (int i = n - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            int t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    /** Null when (x, ops) is a valid input, otherwise the reason it is not. */
    static String invalid(int[] x, int[][] ops) {
        int n = x.length;
        if (n < 1 || n > 200_000) return "n must be in 1..2*10^5";
        if (ops.length < 1 || ops.length > 200_000) return "m must be in 1..2*10^5";
        boolean[] seen = new boolean[n + 1];
        for (int v : x) {
            if (v < 1 || v > n) return "value " + v + " outside 1..n";
            if (seen[v]) return "value " + v + " appears twice";
            seen[v] = true;
        }
        for (int[] op : ops) {
            if (op == null || op[0] < 1 || op[0] > n || op[1] < 1 || op[1] > n) return "position outside 1..n";
        }
        return null;
    }

    static void expectInvalid(int[] x, int[][] ops) {
        if (invalid(x, ops) == null) throw new AssertionError("the input guard accepted an invalid input");
    }

    static String input(int[] x, int[][] ops) {
        String problem = invalid(x, ops);
        if (problem != null) throw new IllegalArgumentException("invalid test: " + problem);
        StringBuilder sb = new StringBuilder();
        sb.append(x.length).append(' ').append(ops.length).append('\n');
        for (int i = 0; i < x.length; i++) {
            if (i > 0) sb.append(' ');
            sb.append(x[i]);
        }
        sb.append('\n');
        for (int[] op : ops) sb.append(op[0]).append(' ').append(op[1]).append('\n');
        return sb.toString();
    }

    /** Runs the program; `expected` null means "compute it with bySet" (large inputs). */
    static void check(String input, String expected) throws Exception {
        if (expected == null) expected = bySet(parseArray(input), parseOps(input));
        String got = String.join(" ", run(input).trim().split("\\s+"));
        if (!got.equals(expected)) {
            String shown = input.length() > 60 ? input.substring(0, 60) + "..." : input;
            String g = got.length() > 80 ? got.substring(0, 80) + "..." : got;
            String e = expected.length() > 80 ? expected.substring(0, 80) + "..." : expected;
            throw new AssertionError("input " + shown + "\nexpected " + e + "\ngot " + g);
        }
        cases++;
    }

    static int[] parseArray(String input) {
        String[] lines = input.split("\n");
        String[] t = lines[1].trim().split("\\s+");
        int[] x = new int[t.length];
        for (int i = 0; i < t.length; i++) x[i] = Integer.parseInt(t[i]);
        return x;
    }

    static int[][] parseOps(String input) {
        String[] lines = input.split("\n");
        int[][] ops = new int[lines.length - 2][];
        for (int i = 2; i < lines.length; i++) {
            String[] t = lines[i].trim().split("\\s+");
            ops[i - 2] = new int[] {Integer.parseInt(t[0]), Integer.parseInt(t[1])};
        }
        return ops;
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
