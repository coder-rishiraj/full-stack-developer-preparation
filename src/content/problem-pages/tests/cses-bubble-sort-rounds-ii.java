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
 * Tests for every "public class Main" on the Bubble Sort Rounds II page (run by `npm run problems:verify`).
 *
 * The reference is a direct simulation of min(k, n) rounds, kept to inputs where it is fast: small
 * arrays with every k, large arrays with small k, and large k on inputs whose answer is known (sorted
 * output). The page's simulation alternative (method `simulateRounds`, about 50 s measured on a reversed
 * array at n = 2 * 10^5 with k = 10^9) runs these tests too; for it the inputs that need many rounds at
 * n = 2 * 10^5 are replaced by the same shapes at n = 20,000.
 */
class Tests {
    static int cases = 0;
    static final boolean SIMULATION = declares("simulateRounds");

    public static void main(String[] args) throws Exception {
        // The example (the dry-run input of every approach) and the official CSES tests stored with the
        // site (public/tests/cses/cses-bubble-sort-rounds-ii.json).
        check("5 2\n3 2 4 1 4\n", "2 1 3 4 4");
        check("100 20\n3 9 4 4 1 5 7 8 2 9 6 3 5 5 10 3 10 2 6 9 2 8 5 4 5 4 3 6 8 1 6 4 9 7 1 9 9 5 5 7 8 4 1 7 10 1 2 6 8 1 4 2 5 8 3 8 5 2 7 4 10 2 9 10 8 3 1 7 1 10 8 6 2 2 10 7 8 10 4 6 7 9 1 4 5 9 10 6 8 10 6 10 2 9 9 6 5 2 2 1\n",
                "1 2 2 2 3 3 3 3 4 1 4 4 4 4 1 5 5 5 5 5 5 4 1 5 6 1 2 6 6 1 4 2 5 6 3 6 5 2 7 4 7 2 7 7 7 3 1 7 1 8 8 6 2 2 8 7 8 8 4 6 7 8 1 4 5 8 8 6 8 8 6 8 2 9 9 6 5 2 2 1 9 9 9 9 9 9 9 9 9 10 10 10 10 10 10 10 10 10 10 10");

        // The same array after every number of rounds (the statement's explanation lists rounds 1-3).
        check("5 0\n3 2 4 1 4\n", "3 2 4 1 4");
        check("5 1\n3 2 4 1 4\n", "2 3 1 4 4");
        check("5 3\n3 2 4 1 4\n", "1 2 3 4 4");
        check("5 4\n3 2 4 1 4\n", "1 2 3 4 4");
        check("5 1000000000\n3 2 4 1 4\n", "1 2 3 4 4");

        // Edge cases from sections 3 and 7.
        check("1 0\n5\n", "5");
        check("1 1000000000\n1000000000\n", "1000000000");
        check("2 1\n2 1\n", "1 2");
        check("2 1\n7 7\n", "7 7");
        check("4 1\n2 2 1 1\n", "2 1 1 2");
        check("4 2\n2 2 1 1\n", "1 1 2 2");
        check("5 2\n5 4 3 2 1\n", "3 2 1 4 5");
        check("5 2\n2 3 4 5 1\n", "2 3 1 4 5");
        check("5 1\n5 1 2 3 4\n", "1 2 3 4 5");
        check("3 1\n1000000000 1 1000000000\n", "1 1000000000 1000000000");
        check("5 2\n3 2 4 1 4", "2 1 3 4 4");               // no final newline
        check("5 2\n3 2\n4 1  4\n", "2 1 3 4 4");           // numbers spread over two lines

        // Random small inputs, every k from 0 to n + 1 and a huge one, against the simulation.
        Random random = new Random(20261116L);
        for (int t = 0; t < 1500; t++) {
            int n = 1 + random.nextInt(t < 1200 ? 8 : 120);
            int range = 1 + random.nextInt(t % 3 == 0 ? 4 : 1_000_000_000);
            int[] x = new int[n];
            for (int i = 0; i < n; i++) x[i] = 1 + random.nextInt(range);
            int step = Math.max(1, n / 10);
            for (int k = 0; k <= n + 1; k += step) check(input(x, k), bySimulation(x, k));
            check(input(x, 1_000_000_000), bySimulation(x, n));
        }

        // Largest n = 2 * 10^5 with few rounds: every program.
        int max = 200_000;
        for (int t = 0; t < 3; t++) {
            int[] x = new int[max];
            int range = t == 0 ? 1_000_000_000 : (t == 1 ? 1000 : 2);
            for (int i = 0; i < max; i++) x[i] = 1 + random.nextInt(range);
            int k = 1 + random.nextInt(20);
            check(input(x, k), bySimulation(x, k));
        }
        int[] sortedInput = ascending(max);                    // one pass, no swap: stop early
        check(input(sortedInput, 1_000_000_000), join(sortedInput));
        int[] largeFirst = new int[max];                       // n, 1, ..., n - 1: sorted after one round
        largeFirst[0] = max;
        for (int i = 1; i < max; i++) largeFirst[i] = i;
        check(input(largeFirst, 1_000_000_000), join(ascending(max)));

        // Many rounds: n = 2 * 10^5 (n = 20,000 for the simulation).
        int big = SIMULATION ? 20_000 : max;
        int[] reversed = new int[big];                         // n, n - 1, ..., 1
        for (int i = 0; i < big; i++) reversed[i] = big - i;
        check(input(reversed, 1_000_000_000), join(ascending(big)));
        check(input(reversed, big - 1), join(ascending(big)));
        int half = big / 2;                                    // after k rounds: n - k, ..., 1, then n - k + 1, ..., n
        int[] wantHalf = new int[big];
        for (int p = 0; p < big - half; p++) wantHalf[p] = big - half - p;
        for (int p = big - half; p < big; p++) wantHalf[p] = p + 1;
        check(input(reversed, half), join(wantHalf));
        int[] randomBig = new int[big];
        for (int i = 0; i < big; i++) randomBig[i] = 1 + random.nextInt(1_000_000_000);
        int[] sortedBig = randomBig.clone();
        Arrays.sort(sortedBig);
        check(input(randomBig, 1_000_000_000), join(sortedBig));

        // Timing at the largest size for the efficient approaches (the limit is 1 s per test).
        if (!SIMULATION) {
            String a = input(randomBig, 100_000);
            String b = input(reversed, 1_000_000_000);
            long start = System.nanoTime();
            run(a);
            run(b);
            long ms = (System.nanoTime() - start) / 1_000_000;
            if (ms > 1000) throw new AssertionError("too slow: " + ms + " ms");
        }

        // The test inputs themselves must be valid.
        expectInvalid(new int[] {}, 0);                       // n below 1
        expectInvalid(new int[] {0, 1}, 1);                   // a value below 1
        expectInvalid(new int[] {1, 1_000_000_001}, 1);       // a value above 10^9
        expectInvalid(new int[] {1, 2}, -1);                  // k below 0
        expectInvalid(new int[200_001], 1);                   // n above 2 * 10^5

        System.out.println("PASS " + cases + " cases");
    }

    static boolean declares(String name) {
        for (Method m : Main.class.getDeclaredMethods()) {
            if (m.getName().equals(name)) return true;
        }
        return false;
    }

    /** Reference: perform min(k, n) rounds literally (after n - 1 rounds the array is sorted). */
    static String bySimulation(int[] x, int k) {
        int[] a = x.clone();
        for (int round = 0; round < Math.min(k, a.length); round++) {
            for (int j = 1; j < a.length; j++) {
                if (a[j - 1] > a[j]) {
                    int t = a[j - 1];
                    a[j - 1] = a[j];
                    a[j] = t;
                }
            }
        }
        return join(a);
    }

    static int[] ascending(int n) {
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = i + 1;
        return a;
    }

    static String join(int[] a) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < a.length; i++) sb.append(i == 0 ? "" : " ").append(a[i]);
        return sb.toString();
    }

    static String input(int[] x, long k) {
        return x.length + " " + k + "\n" + join(x) + "\n";
    }

    static void validate(String in) {
        String[] tok = in.trim().split("\\s+");
        int n = Integer.parseInt(tok[0]);
        long k = Long.parseLong(tok[1]);
        if (n < 1 || n > 200_000 || tok.length != n + 2) throw new IllegalStateException("bad test case: n = " + n);
        if (k < 0 || k > 1_000_000_000) throw new IllegalStateException("bad test case: k = " + k);
        for (int i = 2; i < tok.length; i++) {
            long v = Long.parseLong(tok[i]);
            if (v < 1 || v > 1_000_000_000) throw new IllegalStateException("bad test case: value " + v);
        }
    }

    static void expectInvalid(int[] x, long k) {
        try {
            validate(input(x, k));
        } catch (IllegalStateException expected) {
            return;
        }
        throw new AssertionError("an invalid test case was accepted (n = " + x.length + ", k = " + k + ")");
    }

    static void check(String in, String want) throws Exception {
        validate(in);
        List<String> got = tokens(run(in));
        if (!got.equals(tokens(want))) {
            String shown = in.length() > 80 ? in.substring(0, 80) + "..." : in;
            String gotShown = got.size() > 12 ? got.subList(0, 12) + "..." : got.toString();
            throw new AssertionError("input " + shown.replace('\n', '|') + ": got " + gotShown);
        }
        cases++;
    }

    static List<String> tokens(String s) {
        List<String> out = new ArrayList<>();
        for (String t : s.trim().split("\\s+")) if (!t.isEmpty()) out.add(t);
        return out;
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
