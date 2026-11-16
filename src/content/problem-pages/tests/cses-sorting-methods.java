import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * Tests for every "public class Main" on the Sorting Methods page (run by `npm run problems:verify`).
 *
 * Two reference answers, both written independently of the page:
 *   - for n <= 7, a breadth-first search over all arrangements for each method (the definition of
 *     "minimum number of steps", no formula involved);
 *   - for larger n, the four formulas computed in the plainest way (pair count, cycle walk,
 *     quadratic LIS, the top chain), and for n = 2 * 10^5 a separate O(n log n) reference.
 *
 * The page's two slow alternatives run these tests too:
 *   - the BFS program (method `minStepsByBfs`) only gets inputs with n <= 7, since it explores n!
 *     arrangements; the official CSES tests (all n = 10) are skipped for it;
 *   - the O(n^2) program (method `countInversionsByPairs`) gets n up to 20,000 instead of 2 * 10^5.
 */
class Tests {
    static int cases = 0;
    static final boolean BFS = declares("minStepsByBfs");
    static final boolean QUADRATIC = declares("countInversionsByPairs");

    public static void main(String[] args) throws Exception {
        // The checker's own references must agree with each other before they are trusted.
        Random random = new Random(1162L);
        for (int n = 1; n <= 7; n++) {
            for (int t = 0; t < 40; t++) {
                int[] p = randomPermutation(n, random);
                long[] byBfs = referenceByBfs(p);
                long[] byFormula = referenceByFormula(p);
                if (!Arrays.equals(byBfs, byFormula)) {
                    throw new AssertionError("BFS " + Arrays.toString(byBfs) + " vs formulas "
                            + Arrays.toString(byFormula) + " on " + Arrays.toString(p));
                }
            }
        }

        // Small cases, all n <= 7, so every program runs them: edge cases and dry runs.
        check(new int[] {1}, 0, 0, 0, 0);                            // n = 1
        check(new int[] {1, 2}, 0, 0, 0, 0);
        check(new int[] {2, 1}, 1, 1, 1, 1);
        check(new int[] {3, 1, 2}, 2, 2, 1, 2);                      // front chain is just 3
        check(new int[] {2, 3, 1}, 2, 2, 1, 1);                      // 2, 3 in order: move 1
        check(new int[] {3, 2, 1}, 3, 1, 2, 2);                      // one swap, two moves
        check(new int[] {1, 3, 2}, 1, 1, 1, 2);                      // methods 3 and 4 differ
        check(new int[] {1, 2, 3, 4, 5, 6, 7}, 0, 0, 0, 0);
        check(new int[] {7, 6, 5, 4, 3, 2, 1}, 21, 3, 6, 6);
        check(new int[] {2, 3, 4, 5, 6, 7, 1}, 6, 6, 1, 1);          // one long cycle, one move
        check(new int[] {4, 1, 2, 3}, 3, 3, 1, 3);                   // move 4 back vs to-front
        check(new int[] {5, 1, 2, 6, 3, 4, 7}, 6, 4, 2, 4);          // cycles of length 4, 2, 1

        // Every permutation of n <= 6 against the BFS reference.
        for (int n = 1; n <= 6; n++) {
            for (int[] p : allPermutations(n)) check(p, referenceByBfs(p));
        }
        // Random permutations of 7.
        for (int t = 0; t < 30; t++) {
            int[] p = randomPermutation(7, random);
            check(p, referenceByBfs(p));
        }

        if (!BFS) {
            // The example, which is also the main dry-run input of every approach.
            check(new int[] {7, 8, 2, 6, 5, 1, 3, 4}, 20, 6, 5, 6);

            // The official CSES tests stored with the site (public/tests/cses/cses-sorting-methods.json).
            checkRaw("10\n1 2 3 4 5 6 7 8 9 10\n", "0 0 0 0");
            checkRaw("10\n10 9 8 7 6 5 4 3 2 1\n", "45 5 9 9");
            checkRaw("10\n8 5 6 2 3 7 9 4 10 1\n", "23 9 5 7");
            checkRaw("10\n6 4 1 5 3 9 2 10 8 7\n", "17 9 6 8");
            checkRaw("10\n2 7 8 5 4 3 6 1 9 10\n", "18 6 5 6");

            // Whitespace the judge never sends, but a robust reader accepts.
            checkRaw("3\n3 1\n2", "2 2 1 2");

            // Random permutations of medium size against the plain formulas.
            for (int t = 0; t < 300; t++) {
                int[] p = randomPermutation(1 + random.nextInt(300), random);
                check(p, referenceByFormula(p));
            }

            // Largest n: sorted, reversed (the most inversions), one long rotation, random.
            int max = QUADRATIC ? 20_000 : 200_000;
            int[] sorted = new int[max];
            for (int i = 0; i < max; i++) sorted[i] = i + 1;
            check(sorted, 0, 0, 0, 0);
            int[] reversed = new int[max];
            for (int i = 0; i < max; i++) reversed[i] = max - i;
            // n(n-1)/2 inversions: 19,999,900,000 at n = 2 * 10^5, beyond Integer.MAX_VALUE.
            check(reversed, (long) max * (max - 1) / 2, max / 2, max - 1, max - 1);
            int[] rotated = new int[max];
            for (int i = 0; i < max; i++) rotated[i] = i == max - 1 ? 1 : i + 2;
            check(rotated, max - 1, max - 1, 1, 1);
            int[] mixed = randomPermutation(max, random);
            check(mixed, referenceFast(mixed));
        }

        // The test inputs themselves must be valid permutations.
        expectInvalid(new int[] {});
        expectInvalid(new int[] {1, 1});
        expectInvalid(new int[] {0, 1});
        expectInvalid(new int[] {2, 3});
        expectInvalid(new int[200_001]);

        System.out.println("PASS " + cases + " cases");
    }

    static void check(int[] p, long a, long b, long c, long d) throws Exception {
        check(p, new long[] {a, b, c, d});
    }

    static void check(int[] p, long[] expected) throws Exception {
        String problem = invalid(p);
        if (problem != null) throw new IllegalArgumentException("invalid test: " + problem);
        if (BFS && p.length > 7) throw new IllegalStateException("n too large for the BFS program");
        StringBuilder in = new StringBuilder().append(p.length).append('\n');
        for (int v : p) in.append(v).append(' ');
        in.append('\n');
        StringBuilder want = new StringBuilder();
        for (long e : expected) want.append(e).append(' ');
        checkRaw(in.toString(), want.toString());
    }

    static void checkRaw(String input, String expected) throws Exception {
        String output = run(input);
        String[] got = output.trim().split("\\s+");
        String[] want = expected.trim().split("\\s+");
        if (!Arrays.equals(got, want)) {
            String shown = input.length() > 80 ? input.substring(0, 80) + "..." : input;
            throw new AssertionError("input " + shown + "\nexpected " + expected.trim() + "\ngot " + output.trim());
        }
        cases++;
    }

    static void expectInvalid(int[] p) {
        if (invalid(p) == null) throw new AssertionError("an invalid test input was accepted");
    }

    /** Null when p is a permutation of 1..n with 1 <= n <= 2 * 10^5, otherwise the reason. */
    static String invalid(int[] p) {
        if (p.length < 1 || p.length > 200_000) return "n must be in 1..2*10^5";
        boolean[] seen = new boolean[p.length + 1];
        for (int v : p) {
            if (v < 1 || v > p.length || seen[v]) return "not a permutation of 1..n";
            seen[v] = true;
        }
        return null;
    }

    // ---- reference 1: BFS over arrangements, straight from the definition ----

    static long[] referenceByBfs(int[] p) {
        long[] r = new long[4];
        for (int method = 1; method <= 4; method++) r[method - 1] = bfs(p, method);
        return r;
    }

    static int bfs(int[] p, int method) {
        int n = p.length;
        Map<List<Integer>, Integer> dist = new HashMap<>();
        ArrayDeque<List<Integer>> queue = new ArrayDeque<>();
        List<Integer> start = new ArrayList<>();
        for (int v : p) start.add(v);
        dist.put(start, 0);
        queue.add(start);
        while (!queue.isEmpty()) {
            List<Integer> a = queue.poll();
            int d = dist.get(a);
            boolean done = true;
            for (int i = 0; i < n; i++) if (a.get(i) != i + 1) done = false;
            if (done) return d;
            List<List<Integer>> next = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                if (method == 1 && i + 1 < n) next.add(swap(a, i, i + 1));
                if (method == 2) for (int j = i + 1; j < n; j++) next.add(swap(a, i, j));
                if (method == 3) for (int j = 0; j < n; j++) if (j != i) next.add(move(a, i, j));
                if (method == 4 && i > 0) next.add(move(a, i, 0));
            }
            for (List<Integer> b : next) {
                if (!dist.containsKey(b)) {
                    dist.put(b, d + 1);
                    queue.add(b);
                }
            }
        }
        throw new AssertionError("unreachable");
    }

    static List<Integer> swap(List<Integer> a, int i, int j) {
        List<Integer> b = new ArrayList<>(a);
        b.set(i, a.get(j));
        b.set(j, a.get(i));
        return b;
    }

    static List<Integer> move(List<Integer> a, int i, int j) {
        List<Integer> b = new ArrayList<>(a);
        int v = b.remove(i);
        b.add(j, v);
        return b;
    }

    // ---- reference 2: the four formulas, computed the plainest way ----

    static long[] referenceByFormula(int[] p) {
        int n = p.length;
        long inv = 0;
        for (int i = 0; i < n; i++) for (int j = i + 1; j < n; j++) if (p[i] > p[j]) inv++;
        int cycles = 0;
        boolean[] seen = new boolean[n + 1];
        for (int i = 1; i <= n; i++) {
            if (seen[i]) continue;
            cycles++;
            for (int at = i; !seen[at]; at = p[at - 1]) seen[at] = true;
        }
        int[] best = new int[n];
        int lis = 0;
        for (int i = 0; i < n; i++) {
            best[i] = 1;
            for (int j = 0; j < i; j++) if (p[j] < p[i]) best[i] = Math.max(best[i], best[j] + 1);
            lis = Math.max(lis, best[i]);
        }
        // Scan the array from the right, looking for n, then n - 1, and so on, in that order:
        // the values found form the longest top chain appearing left to right in increasing order.
        int want = n;
        for (int i = n - 1; i >= 0; i--) if (p[i] == want) want--;
        int chain = n - want;
        return new long[] {inv, n - cycles, n - lis, n - chain};
    }

    // ---- reference 3: O(n log n), for n = 2 * 10^5 ----

    static long[] referenceFast(int[] p) {
        int n = p.length;
        long inv = mergeCount(p.clone(), 0, n);
        int cycles = 0;
        boolean[] seen = new boolean[n + 1];
        for (int i = 1; i <= n; i++) {
            if (seen[i]) continue;
            cycles++;
            for (int at = i; !seen[at]; at = p[at - 1]) seen[at] = true;
        }
        List<Integer> tails = new ArrayList<>();
        for (int v : p) {
            int k = lowerBound(tails, v);
            if (k == tails.size()) tails.add(v);
            else tails.set(k, v);
        }
        int want = n;
        for (int i = n - 1; i >= 0; i--) if (p[i] == want) want--;
        return new long[] {inv, n - cycles, n - tails.size(), want};
    }

    static int lowerBound(List<Integer> list, int v) {
        int lo = 0, hi = list.size();
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (list.get(mid) < v) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }

    static long mergeCount(int[] a, int lo, int hi) {
        if (hi - lo < 2) return 0;
        int mid = (lo + hi) / 2;
        long c = mergeCount(a, lo, mid) + mergeCount(a, mid, hi);
        int[] merged = new int[hi - lo];
        int i = lo, j = mid, k = 0;
        while (i < mid || j < hi) {
            if (j == hi || (i < mid && a[i] < a[j])) merged[k++] = a[i++];
            else {
                c += mid - i;
                merged[k++] = a[j++];
            }
        }
        System.arraycopy(merged, 0, a, lo, merged.length);
        return c;
    }

    // ---- helpers ----

    static int[] randomPermutation(int n, Random random) {
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = i + 1;
        for (int i = n - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            int t = p[i];
            p[i] = p[j];
            p[j] = t;
        }
        return p;
    }

    static List<int[]> allPermutations(int n) {
        List<int[]> out = new ArrayList<>();
        permute(new int[n], new boolean[n + 1], 0, out);
        return out;
    }

    static void permute(int[] p, boolean[] used, int at, List<int[]> out) {
        if (at == p.length) {
            out.add(p.clone());
            return;
        }
        for (int v = 1; v <= p.length; v++) {
            if (used[v]) continue;
            used[v] = true;
            p[at] = v;
            permute(p, used, at + 1, out);
            used[v] = false;
        }
    }

    static boolean declares(String name) {
        for (Method m : Main.class.getDeclaredMethods()) {
            if (m.getName().equals(name)) return true;
        }
        return false;
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
