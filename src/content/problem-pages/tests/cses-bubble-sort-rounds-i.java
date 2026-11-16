import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Tests for every "public class Main" on the Bubble Sort Rounds I page (run by `npm run problems:verify`).
 *
 * References: a direct simulation of the rounds (small inputs) and an independent merge-sort count of
 * "strictly larger values earlier" (large inputs). The page's two slow alternatives run these tests
 * too. They are recognised by their methods: `simulateRounds` (O(n * rounds), about 48 s measured on a
 * reversed array at n = 2 * 10^5) and `maxLargerBeforeByScanning` (O(n^2), about 3.6 s measured at
 * n = 2 * 10^5). For them the expensive inputs at n = 2 * 10^5 are replaced by the same shapes at
 * n = 20,000; inputs at n = 2 * 10^5 that need only one round still run for the simulation.
 */
class Tests {
    static int cases = 0;
    static final boolean SIMULATION = declares("simulateRounds");
    static final boolean SCANNING = declares("maxLargerBeforeByScanning");
    static final boolean SLOW = SIMULATION || SCANNING;

    public static void main(String[] args) throws Exception {
        // The example (also the dry-run input of every approach) and the official CSES tests stored
        // with the site (public/tests/cses/cses-bubble-sort-rounds-i.json).
        check("5\n3 2 4 1 4\n", 3);
        check("100\n3 9 4 4 1 5 7 8 2 9 6 3 5 5 10 3 10 2 6 9 2 8 5 4 5 4 3 6 8 1 6 4 9 7 1 9 9 5 5 7 8 4 1 7 10 1 2 6 8 1 4 2 5 8 3 8 5 2 7 4 10 2 9 10 8 3 1 7 1 10 8 6 2 2 10 7 8 10 4 6 7 9 1 4 5 9 10 6 8 10 6 10 2 9 9 6 5 2 2 1\n", 90);
        check("3\n3 1 2\n", 1);

        // The duplicates example of sections 4 and 11 (counting ">=" instead of ">" would print 3).
        check("4\n2 2 1 1\n", 2);

        // Edge cases from sections 3 and 7.
        check("1\n1\n", 0);                              // one element: already sorted
        check("1\n1000000000\n", 0);
        check("2\n2 1\n", 1);
        check("2\n1 2\n", 0);
        check("2\n7 7\n", 0);                            // equal values never swap
        check("3\n1000000000 1 1000000000\n", 1);        // value limits
        check("5\n5 4 3 2 1\n", 4);                      // reversed: n - 1 rounds
        check("5\n2 3 4 5 1\n", 4);                      // the small value travels one step per round
        check("5\n5 1 2 3 4\n", 1);                      // the large value goes all the way in one round
        check("6\n3 3 3 1 1 1\n", 3);
        check("5\n3 2 4 1 4", 3);                        // no final newline
        check("5\n3 2\n4 1  4\n", 3);                    // numbers spread over two lines

        // Random small inputs against the simulation, many with repeated values.
        Random random = new Random(20261116L);
        for (int t = 0; t < 4000; t++) {
            int n = 1 + random.nextInt(t < 3000 ? 9 : 300);
            int range = 1 + random.nextInt(t % 3 == 0 ? 4 : 1_000_000_000);
            int[] x = new int[n];
            for (int i = 0; i < n; i++) x[i] = 1 + random.nextInt(range);
            check(input(x), bySimulation(x.clone()));
        }

        // Largest n = 2 * 10^5 (n = 20,000 for the slow alternatives).
        int big = SLOW ? 20_000 : 200_000;
        check(input(descending(big, 1_000_000_000)), big - 1);
        check(input(ascending(big)), 0);
        int[] equal = new int[big];
        java.util.Arrays.fill(equal, 1_000_000_000);
        check(input(equal), 0);
        int[] smallLast = ascending(big);                // 2, 3, ..., n, 1
        for (int i = 0; i < big; i++) smallLast[i] = i + 2;
        smallLast[big - 1] = 1;
        check(input(smallLast), big - 1);
        int[] pairs = new int[big];                      // k, k, k-1, k-1, ...: the last 1 has n - 2 larger before it
        for (int i = 0; i < big; i++) pairs[i] = big / 2 - i / 2;
        check(input(pairs), big - 2);
        for (int t = 0; t < 3; t++) {
            int[] x = new int[big];
            int range = t == 0 ? 1_000_000_000 : (t == 1 ? 1000 : 2);
            for (int i = 0; i < big; i++) x[i] = 1 + random.nextInt(range);
            check(input(x), byMergeCount(x));
        }

        // One round at n = 2 * 10^5: every program but the O(n^2) scan.
        if (!SCANNING) {
            int[] largeFirst = new int[200_000];         // n, 1, 2, ..., n - 1
            largeFirst[0] = 200_000;
            for (int i = 1; i < 200_000; i++) largeFirst[i] = i;
            check(input(largeFirst), 1);
        }

        // Timing at the largest size for the efficient approaches (the limit is 1 s per test).
        if (!SLOW) {
            int[] x = new int[200_000];
            for (int i = 0; i < x.length; i++) x[i] = 1 + random.nextInt(1_000_000_000);
            String in = input(x);
            long start = System.nanoTime();
            run(in);
            run(input(descending(200_000, 1_000_000_000)));
            long ms = (System.nanoTime() - start) / 1_000_000;
            if (ms > 1000) throw new AssertionError("too slow: " + ms + " ms");
        }

        // The references agree with each other, and the test inputs themselves must be valid.
        for (int t = 0; t < 500; t++) {
            int n = 1 + random.nextInt(40);
            int[] x = new int[n];
            for (int i = 0; i < n; i++) x[i] = 1 + random.nextInt(5);
            if (bySimulation(x.clone()) != byMergeCount(x)) throw new AssertionError("references disagree");
        }
        expectInvalid(new int[] {});                     // n below 1
        expectInvalid(new int[] {0, 1});                 // a value below 1
        expectInvalid(new int[] {1, 1_000_000_001});     // a value above 10^9
        expectInvalid(new int[200_001]);                 // n above 2 * 10^5

        System.out.println("PASS " + cases + " cases");
    }

    static boolean declares(String name) {
        for (Method m : Main.class.getDeclaredMethods()) {
            if (m.getName().equals(name)) return true;
        }
        return false;
    }

    /** Reference 1: perform rounds until one makes no swap. */
    static int bySimulation(int[] a) {
        int rounds = 0;
        for (boolean changed = true; ; rounds++) {
            changed = false;
            for (int j = 1; j < a.length; j++) {
                if (a[j - 1] > a[j]) {
                    int t = a[j - 1];
                    a[j - 1] = a[j];
                    a[j] = t;
                    changed = true;
                }
            }
            if (!changed) return rounds;
        }
    }

    /** Reference 2: for each element, how many earlier elements are strictly larger (merge sort). */
    static int byMergeCount(int[] x) {
        int n = x.length;
        int[] idx = new int[n];
        int[] larger = new int[n];
        for (int i = 0; i < n; i++) idx[i] = i;
        mergeCount(x, idx, new int[n], larger, 0, n);
        int best = 0;
        for (int c : larger) best = Math.max(best, c);
        return best;
    }

    static void mergeCount(int[] x, int[] idx, int[] tmp, int[] larger, int lo, int hi) {
        if (hi - lo < 2) return;
        int mid = (lo + hi) >>> 1;
        mergeCount(x, idx, tmp, larger, lo, mid);
        mergeCount(x, idx, tmp, larger, mid, hi);
        int i = lo, j = mid, k = lo;
        while (i < mid || j < hi) {
            // Take from the left while its value is <= the right's (stable); when a right element is
            // taken, every left element still waiting is strictly larger and comes earlier.
            if (j == hi || (i < mid && x[idx[i]] <= x[idx[j]])) {
                tmp[k++] = idx[i++];
            } else {
                larger[idx[j]] += mid - i;
                tmp[k++] = idx[j++];
            }
        }
        System.arraycopy(tmp, lo, idx, lo, hi - lo);
    }

    static int[] ascending(int n) {
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = i + 1;
        return a;
    }

    static int[] descending(int n, int top) {
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = top - i;
        return a;
    }

    static String input(int[] x) {
        StringBuilder sb = new StringBuilder();
        sb.append(x.length).append('\n');
        for (int i = 0; i < x.length; i++) sb.append(i == 0 ? "" : " ").append(x[i]);
        return sb.append('\n').toString();
    }

    static void validate(String in) {
        String[] tok = in.trim().split("\\s+");
        int n = Integer.parseInt(tok[0]);
        if (n < 1 || n > 200_000 || tok.length != n + 1) throw new IllegalStateException("bad test case: n = " + n);
        for (int i = 1; i <= n; i++) {
            long v = Long.parseLong(tok[i]);
            if (v < 1 || v > 1_000_000_000) throw new IllegalStateException("bad test case: value " + v);
        }
    }

    static void expectInvalid(int[] x) {
        try {
            validate(input(x));
        } catch (IllegalStateException expected) {
            return;
        }
        throw new AssertionError("an invalid test case was accepted (n = " + x.length + ")");
    }

    static void check(String in, int want) throws Exception {
        validate(in);
        List<String> got = tokens(run(in));
        if (!got.equals(List.of(String.valueOf(want)))) {
            String shown = in.length() > 80 ? in.substring(0, 80) + "..." : in;
            throw new AssertionError("input " + shown.replace('\n', '|') + ": expected " + want + " but got " + got);
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
