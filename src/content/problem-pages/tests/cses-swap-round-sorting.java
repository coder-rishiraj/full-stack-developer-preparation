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
 * Tests for every "public class Main" on the Swap Round Sorting page (run by `npm run problems:verify`).
 *
 * Any valid sequence of rounds is accepted, so a checker validates each output: the round count
 * must be the minimum, every round must use each index at most once, and applying the rounds
 * must sort the array. The minimum comes from the cycle rule (0 if sorted, 1 if every cycle has
 * length at most 2, else 2), which is first checked against a breadth-first search over every
 * permutation of n <= 7 where one step is any set of disjoint swaps.
 *
 * The page's BFS alternative (method `roundsByBfs`) runs these tests too, but only on n <= 6 and
 * a few n = 7 inputs, since it explores n! arrangements times every set of disjoint swaps.
 */
class Tests {
    static int cases = 0;
    static final boolean BFS = declares("roundsByBfs");

    public static void main(String[] args) throws Exception {
        // The checker must reject wrong answers before it is trusted.
        int[] example = {5, 2, 1, 3, 4};
        expectRejected(example, "2\n2\n1 3\n4 5\n1\n3 4\n");          // does not sort
        expectRejected(example, "1\n2\n1 5\n3 4\n");                   // claims 1 round
        expectRejected(example, "3\n2\n1 3\n4 5\n1\n3 5\n1\n1 2\n");   // not the minimum (and unsorts)
        expectRejected(example, "2\n2\n1 3\n3 5\n1\n4 5\n");           // index 3 twice in a round
        expectRejected(example, "2\n2\n1 3\n4 5\n1\n3 3\n");           // swaps an index with itself
        expectRejected(example, "2\n2\n1 3\n4 6\n1\n3 5\n");           // index outside 1..n
        expectRejected(example, "2\n2\n1 3\n4 5\n1\n3\n");             // missing a token
        expectRejected(example, "2\n2\n1 3\n4 5\n1\n3 5\n7\n");        // extra token
        expectRejected(new int[] {1, 2}, "1\n1\n1 2\n");               // sorted: 0 rounds
        expectRejected(new int[] {2, 1}, "0\n");
        expectRejected(new int[] {2, 1}, "");
        expectAccepted(example, "2\n2\n1 3\n4 5\n1\n3 5\n");           // the statement's answer

        // The cycle rule against BFS over every permutation of n <= 7.
        for (int n = 1; n <= 7; n++) {
            Map<String, Integer> dist = bfsFromSorted(n);
            for (int[] p : allPermutations(n)) {
                Integer d = dist.get(Arrays.toString(p));
                if (d == null || d != minimumRounds(p)) {
                    throw new AssertionError("cycle rule disagrees with BFS on " + Arrays.toString(p));
                }
            }
        }

        // The example, the dry runs and the official CSES tests stored with the site
        // (public/tests/cses/cses-swap-round-sorting.json, n <= 3).
        check(example);
        check(new int[] {1});
        check(new int[] {1, 2});
        check(new int[] {2, 1});
        check(new int[] {1, 2, 3});
        check(new int[] {1, 3, 2});
        check(new int[] {2, 1, 3});
        check(new int[] {2, 3, 1});
        check(new int[] {3, 1, 2});
        check(new int[] {3, 2, 1});
        check(new int[] {2, 3, 4, 5, 6, 7, 1});                     // one 7-cycle (dry run)
        check(new int[] {2, 1, 4, 3, 6, 5});                        // only 2-cycles: 1 round
        checkRaw("5\n5 2 1\n3 4");                                  // numbers split over lines

        // Every permutation of n <= 6 (n <= 5 for the BFS program), then random n = 7.
        Random random = new Random(1698L);
        for (int n = 1; n <= (BFS ? 5 : 6); n++) {
            for (int[] p : allPermutations(n)) check(p);
        }
        for (int t = 0; t < (BFS ? 5 : 300); t++) check(randomPermutation(7, random));

        if (!BFS) {
            // Every permutation of 7, and random medium inputs with all kinds of cycle structure.
            for (int[] p : allPermutations(7)) check(p);
            for (int t = 0; t < 500; t++) check(randomPermutation(1 + random.nextInt(200), random));
            for (int t = 0; t < 200; t++) check(involution(1 + random.nextInt(200), random));

            // Largest n = 2 * 10^5: sorted, reversed (all 2-cycles), one long cycle, 3-cycles, random.
            int max = 200_000;
            int[] sorted = new int[max];
            for (int i = 0; i < max; i++) sorted[i] = i + 1;
            check(sorted);
            int[] reversed = new int[max];
            for (int i = 0; i < max; i++) reversed[i] = max - i;
            check(reversed);
            int[] rotated = new int[max];
            for (int i = 0; i < max; i++) rotated[i] = i == max - 1 ? 1 : i + 2;
            check(rotated);
            int[] threes = new int[max - 2];                         // 199,998 = 3 * 66,666
            for (int i = 0; i < threes.length; i += 3) {
                threes[i] = i + 2;
                threes[i + 1] = i + 3;
                threes[i + 2] = i + 1;
            }
            check(threes);
            check(randomPermutation(max, random));
            check(involution(max, random));
        }

        // The test inputs themselves must be valid permutations.
        expectInvalid(new int[] {});
        expectInvalid(new int[] {1, 1});
        expectInvalid(new int[] {0, 1});
        expectInvalid(new int[] {2, 3});
        expectInvalid(new int[200_001]);

        System.out.println("PASS " + cases + " cases");
    }

    static void check(int[] p) throws Exception {
        String problem = invalid(p);
        if (problem != null) throw new IllegalArgumentException("invalid test: " + problem);
        if (BFS && p.length > 7) throw new IllegalStateException("n too large for the BFS program");
        String output = run(input(p));
        String verdict = validate(p, output);
        if (verdict != null) {
            String shownIn = p.length > 20 ? "n=" + p.length : Arrays.toString(p);
            String shownOut = output.length() > 80 ? output.substring(0, 80) + "..." : output;
            throw new AssertionError(shownIn + ": " + verdict + "\noutput: " + shownOut);
        }
        cases++;
    }

    static void checkRaw(String in) throws Exception {
        String[] t = in.trim().split("\\s+");
        int[] p = new int[Integer.parseInt(t[0])];
        for (int i = 0; i < p.length; i++) p[i] = Integer.parseInt(t[i + 1]);
        String verdict = validate(p, run(in));
        if (verdict != null) throw new AssertionError("raw input " + in + ": " + verdict);
        cases++;
    }

    static void expectRejected(int[] p, String output) {
        if (validate(p, output) == null) throw new AssertionError("checker accepted a wrong answer: " + output);
    }

    static void expectAccepted(int[] p, String output) {
        String verdict = validate(p, output);
        if (verdict != null) throw new AssertionError("checker rejected a right answer: " + verdict);
    }

    static void expectInvalid(int[] p) {
        if (invalid(p) == null) throw new AssertionError("an invalid test input was accepted");
    }

    static String input(int[] p) {
        StringBuilder in = new StringBuilder().append(p.length).append('\n');
        for (int v : p) in.append(v).append(' ');
        return in.append('\n').toString();
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

    /** 0 if sorted, 1 if every cycle has length <= 2, otherwise 2. */
    static int minimumRounds(int[] p) {
        boolean sorted = true, involution = true;
        for (int i = 0; i < p.length; i++) {
            if (p[i] != i + 1) sorted = false;
            if (p[p[i] - 1] != i + 1) involution = false;   // p(p(i)) != i: a cycle of length >= 3
        }
        return sorted ? 0 : involution ? 1 : 2;
    }

    /** Null when output is a correct answer for p, otherwise the reason it is wrong. */
    static String validate(int[] p, String output) {
        String[] t = output.trim().isEmpty() ? new String[0] : output.trim().split("\\s+");
        int[] pos = {0};
        int n = p.length;
        Integer k = next(t, pos);
        if (k == null) return "missing or bad round count";
        if (k != minimumRounds(p)) return "round count " + k + " is not the minimum " + minimumRounds(p);
        int[] a = p.clone();
        int[] usedInRound = new int[n + 1];                    // round number that last used an index
        for (int round = 1; round <= k; round++) {
            Integer swaps = next(t, pos);
            if (swaps == null) return "missing swap count in round " + round;
            if (swaps < 1 || swaps > n / 2) return "round " + round + " has " + swaps + " swaps";
            for (int s = 0; s < swaps; s++) {
                Integer i = next(t, pos), j = next(t, pos);
                if (i == null || j == null) return "round " + round + " is missing an index";
                if (i < 1 || i > n || j < 1 || j > n) return "index outside 1.." + n;
                if (i.equals(j)) return "swap of index " + i + " with itself";
                if (usedInRound[i] == round || usedInRound[j] == round) {
                    return "round " + round + " uses an index twice";
                }
                usedInRound[i] = round;
                usedInRound[j] = round;
                int tmp = a[i - 1];                            // disjoint swaps commute
                a[i - 1] = a[j - 1];
                a[j - 1] = tmp;
            }
        }
        if (pos[0] != t.length) return "extra tokens after the last round";
        for (int i = 0; i < n; i++) if (a[i] != i + 1) return "the rounds do not sort the array";
        return null;
    }

    static Integer next(String[] t, int[] pos) {
        if (pos[0] >= t.length) return null;
        try {
            return Integer.parseInt(t[pos[0]++]);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    /** Fewest rounds from the sorted array to every permutation of n (rounds can be undone). */
    static Map<String, Integer> bfsFromSorted(int n) {
        List<int[][]> rounds = new ArrayList<>();
        matchings(n, 0, new boolean[n], new ArrayList<>(), rounds);
        int[] start = new int[n];
        for (int i = 0; i < n; i++) start[i] = i + 1;
        Map<String, Integer> dist = new HashMap<>();
        ArrayDeque<int[]> queue = new ArrayDeque<>();
        dist.put(Arrays.toString(start), 0);
        queue.add(start);
        while (!queue.isEmpty()) {
            int[] a = queue.poll();
            int d = dist.get(Arrays.toString(a));
            for (int[][] round : rounds) {
                int[] b = a.clone();
                for (int[] s : round) {
                    b[s[0]] = a[s[1]];
                    b[s[1]] = a[s[0]];
                }
                String key = Arrays.toString(b);
                if (!dist.containsKey(key)) {
                    dist.put(key, d + 1);
                    queue.add(b);
                }
            }
        }
        return dist;
    }

    static void matchings(int n, int from, boolean[] used, List<int[]> pairs, List<int[][]> out) {
        int i = from;
        while (i < n && used[i]) i++;
        if (i == n) {
            if (!pairs.isEmpty()) out.add(pairs.toArray(new int[0][]));
            return;
        }
        used[i] = true;
        matchings(n, i + 1, used, pairs, out);
        for (int j = i + 1; j < n; j++) {
            if (used[j]) continue;
            used[j] = true;
            pairs.add(new int[] {i, j});
            matchings(n, i + 1, used, pairs, out);
            pairs.remove(pairs.size() - 1);
            used[j] = false;
        }
        used[i] = false;
    }

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

    /** A random permutation whose cycles all have length 1 or 2. */
    static int[] involution(int n, Random random) {
        int[] order = randomPermutation(n, random);
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = i + 1;
        for (int i = 0; i + 1 < n; i += 2) {
            if (random.nextBoolean()) {
                int a = order[i], b = order[i + 1];
                p[a - 1] = b;
                p[b - 1] = a;
            }
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
