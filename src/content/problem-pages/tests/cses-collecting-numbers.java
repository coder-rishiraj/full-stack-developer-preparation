import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.util.Random;

/**
 * Tests for every "public class Main" on the Collecting Numbers page (run by `npm run problems:verify`).
 *
 * The page's round-by-round simulation is recognised by its method `simulateRounds`. It costs
 * n * rounds steps, so for it the n = 2 * 10^5 inputs with many rounds (descending, random) are
 * replaced by the same shapes at n = 20,000.
 */
class Tests {
    static int cases = 0;
    static final boolean SIMULATION = declares("simulateRounds");

    public static void main(String[] args) throws Exception {
        // The CSES example, which is also the dry-run input of every approach on the page.
        check("5\n4 2 1 5 3\n", 3);
        // The official CSES test stored with the site (public/tests/cses/cses-collecting-numbers.json).
        check("5\n5 4 2 3 1\n", 4);

        // Edge cases from section 3.
        check("1\n1\n", 1);                               // n = 1
        check("2\n1 2\n", 1);
        check("2\n2 1\n", 2);
        check("6\n1 2 3 4 5 6\n", 1);                     // sorted: one round
        check("6\n6 5 4 3 2 1\n", 6);                     // reversed: one number per round
        check("6\n2 4 6 1 3 5\n", 4);                     // evens, then odds: 1 + n / 2
        check("5\n3 4 5 1 2\n", 2);                       // a rotation

        // Whitespace the judge never sends, but a robust reader accepts.
        check("5\n4 2 1 5 3", 3);                         // no final newline
        check("5\n4 2\n1  5 3 \n", 3);                    // numbers over two lines, extra spaces

        // Every permutation of n = 1..7 against an independent rule-by-rule simulation.
        for (int n = 1; n <= 7; n++) {
            int[] p = new int[n];
            for (int i = 0; i < n; i++) p[i] = i + 1;
            do {
                check(input(p), bruteForce(p));
            } while (nextPermutation(p));
        }

        // Random permutations.
        Random random = new Random(20261116L);
        for (int t = 0; t < 1000; t++) {
            int[] p = shuffled(1 + random.nextInt(300), random);
            check(input(p), bruteForce(p));
        }

        // Largest n = 2 * 10^5.
        int max = 200_000;
        check(input(ascending(max)), 1);                  // one round, for every program
        if (!SIMULATION) {
            check(input(reversed(ascending(max))), max);  // n rounds: the simulation's worst case
            int[] p = shuffled(max, random);
            check(input(p), byPositions(p));
            check(input(interleaved(max)), max / 2 + 1);  // 2 4 6 ... 1 3 5 ...
        } else {
            check(input(reversed(ascending(20_000))), 20_000);
            int[] p = shuffled(20_000, random);
            check(input(p), byPositions(p));
        }

        // The test inputs themselves must be valid.
        expectInvalid(new int[] {});                      // n below 1
        expectInvalid(new int[] {1, 1});                  // not a permutation
        expectInvalid(new int[] {0, 1});
        expectInvalid(new int[] {1, 3});
        expectInvalid(ascending(max + 1));                // n above 2 * 10^5

        System.out.println("PASS " + cases + " cases");
    }

    static boolean declares(String name) {
        for (Method m : Main.class.getDeclaredMethods()) {
            if (m.getName().equals(name)) return true;
        }
        return false;
    }

    /** Collects the numbers exactly as the statement describes, with an explicit "collected" mark. */
    static int bruteForce(int[] x) {
        int n = x.length;
        boolean[] collected = new boolean[n];
        int done = 0;
        int rounds = 0;
        while (done < n) {
            rounds++;
            for (int i = 0; i < n; i++) {
                if (!collected[i] && x[i] == done + 1) {
                    collected[i] = true;
                    done++;
                }
            }
        }
        return rounds;
    }

    static int byPositions(int[] x) {
        int n = x.length;
        int[] pos = new int[n + 1];
        for (int i = 0; i < n; i++) pos[x[i]] = i;
        int r = 1;
        for (int v = 1; v < n; v++) if (pos[v + 1] < pos[v]) r++;
        return r;
    }

    static boolean nextPermutation(int[] a) {
        int i = a.length - 2;
        while (i >= 0 && a[i] >= a[i + 1]) i--;
        if (i < 0) return false;
        int j = a.length - 1;
        while (a[j] <= a[i]) j--;
        int t = a[i]; a[i] = a[j]; a[j] = t;
        for (int l = i + 1, r = a.length - 1; l < r; l++, r--) {
            t = a[l]; a[l] = a[r]; a[r] = t;
        }
        return true;
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

    static int[] interleaved(int n) {
        int[] a = new int[n];
        int k = 0;
        for (int v = 2; v <= n; v += 2) a[k++] = v;
        for (int v = 1; v <= n; v += 2) a[k++] = v;
        return a;
    }

    static int[] shuffled(int n, Random random) {
        int[] a = ascending(n);
        for (int i = n - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            int t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    /** Null when x is a valid input (a permutation of 1..n, 1 <= n <= 2 * 10^5), otherwise why not. */
    static String invalid(int[] x) {
        int n = x.length;
        if (n < 1 || n > 200_000) return "n must be in 1..2*10^5";
        boolean[] seen = new boolean[n + 1];
        for (int v : x) {
            if (v < 1 || v > n) return "value " + v + " outside 1..n";
            if (seen[v]) return "value " + v + " appears twice";
            seen[v] = true;
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
        if (!got.equals(String.valueOf(expected))) {
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
