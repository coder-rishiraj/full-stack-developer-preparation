import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Random;
import java.util.TreeMap;

/**
 * Tests for every "public class Main" on the Apartments page (run by `npm run problems:verify`).
 *
 * Expected answers come from an independent maximum bipartite matching (Kuhn's augmenting paths) on
 * small inputs, and from closed-form answers or a TreeMap greedy on large ones.
 *
 * Two programs on the page are too slow for the largest inputs and are recognised by a method name:
 * - `bestByTryingAll` (tries every assignment, exponential): only inputs with n, m <= 6 and the
 *   official tests (n = m = 10, which it handles quickly because few apartments are acceptable or
 *   the answer is reached early).
 * - `smallestFreeAcceptable` (each applicant scans every apartment, O(n * m)): the n = m = 2 * 10^5
 *   inputs are replaced by n = m = 2,000, and lopsided inputs (n = 2 * 10^5, m = 1) still run.
 */
class Tests {
    static int cases = 0;
    static final boolean EXPONENTIAL = declares("bestByTryingAll");
    static final boolean QUADRATIC = declares("smallestFreeAcceptable");

    public static void main(String[] args) throws Exception {
        // The CSES example, which is also the dry-run input of the polynomial approaches.
        check("4 3 5\n60 45 80 60\n30 60 75\n", 2);

        // The official CSES tests stored with the site (public/tests/cses/cses-apartments.json).
        check("10 10 0\n37 62 56 69 34 46 10 86 16 49\n50 95 47 43 9 62 83 71 71 7\n", 1);
        check("10 10 10\n90 41 20 39 49 21 35 31 74 86\n14 24 24 7 82 85 82 4 60 95\n", 6);
        check("10 10 1000\n59 5 65 15 42 81 58 96 50 1\n18 59 71 65 97 83 80 68 92 67\n", 10);
        check("10 10 1000000000\n25 80 59 43 67 21 77 5 8 99\n66 41 62 24 88 55 1 53 50 60\n", 10);
        check("10 10 0\n727245017 647121519 549745115 279071796 109377347 283475609 54026390 324898229 966634963 529328287\n246059947 346116332 662241993 49247416 745463653 94275794 609760371 698956900 741303902 300297145\n", 0);
        check("10 10 10\n30734435 218114477 257355293 471671405 765446067 528536136 165649189 492583409 530341061 697577942\n706094419 639164009 499934863 237033418 349945227 523742486 885215303 325525848 72497551 588908637\n", 0);
        check("10 10 1000\n7899629 162004163 327616450 51615710 139485402 660641436 568848569 847117900 241465676 655071124\n391941030 806408887 487302928 587640742 578031629 242439182 275774089 659487149 573341201 552627408\n", 0);
        check("10 10 1000000000\n725746771 537157640 742868604 354216467 200451683 780161996 862064718 693936572 551637122 58571378\n253977447 320550250 803419591 475001044 85524827 742823061 289405756 887322329 764152191 438818868\n", 10);
        check("5 2 2\n2 2 2 40 50\n40 50\n", 2);

        // Inputs from the page: the brute-force dry run and the counterexamples to wrong greedies.
        check("2 2 5\n10 5\n5 15\n", 2);         // input order, first acceptable apartment: 1
        check("2 2 1\n2 4\n1 3\n", 2);           // sorted, largest acceptable apartment: 1
        check("2 2 0\n1 10\n10 1\n", 2);         // sorting only the applicants: 1

        // Edge cases from section 3.
        check("1 1 0\n7\n7\n", 1);               // k = 0, exact match
        check("1 1 0\n7\n8\n", 0);               // k = 0, off by one
        check("1 1 1\n7\n8\n", 1);               // the range is inclusive
        check("1 1 999999999\n1\n1000000000\n", 1);
        check("1 1 999999998\n1\n1000000000\n", 0);
        check("1 1 1000000000\n1000000000\n1000000000\n", 1);   // a + k = 2 * 10^9 still fits an int
        check("1 1 1000000000\n1\n1\n", 1);                     // a - k is negative
        check("3 1 0\n5 5 5\n5\n", 1);           // more applicants than apartments
        check("1 3 0\n5\n5 5 5\n", 1);           // more apartments than applicants
        check("3 3 0\n5 5 6\n6 5 5\n", 3);       // duplicates on both sides
        check("3 2 2\n1 3 5\n3 3\n", 2);         // a middle apartment two applicants want

        // Random small inputs against Kuhn's matching: every program.
        Random random = new Random(20261116L);
        for (int t = 0; t < 1500; t++) {
            int n = 1 + random.nextInt(6), m = 1 + random.nextInt(6);
            int range = 1 + random.nextInt(t % 2 == 0 ? 20 : 1_000_000_000);
            int k = random.nextInt(4) == 0 ? 0 : random.nextInt(Math.max(1, range / 3));
            int[] a = values(n, range, random), b = values(m, range, random);
            check(input(a, b, k), byMatching(a, b, k));
        }

        if (!EXPONENTIAL) {
            // Random medium inputs against Kuhn's matching.
            for (int t = 0; t < 500; t++) {
                int n = 1 + random.nextInt(40), m = 1 + random.nextInt(40);
                int range = 1 + random.nextInt(t % 2 == 0 ? 200 : 1_000_000_000);
                int k = random.nextInt(4) == 0 ? 0 : random.nextInt(Math.max(1, range / 5));
                int[] a = values(n, range, random), b = values(m, range, random);
                check(input(a, b, k), byMatching(a, b, k));
            }

            // Lopsided extremes: O(n + m) work even for the scanning program.
            int max = 200_000;
            check(input(filled(max, 1_000_000_000), new int[] {1}, 999_999_999), 1);
            check(input(new int[] {500_000_000}, values(max, 1_000_000_000, random), 1_000_000_000), 1);

            int size = QUADRATIC ? 2_000 : max;
            // Everyone accepts everything: min(n, m).
            check(input(values(size, 1_000_000_000, random), values(size, 1_000_000_000, random), 1_000_000_000), size);
            // All equal sizes with k = 0: everyone housed.
            check(input(filled(size, 1_000_000_000), filled(size, 1_000_000_000), 0), size);
            // Applicants all want 1, apartments are all 2, k = 0: nobody.
            check(input(filled(size, 1), filled(size, 2), 0), 0);
            // Random, against a TreeMap greedy (different data structure from the page's two pointers).
            int[] a = values(size, 1_000_000_000, random), b = values(size, 1_000_000_000, random);
            check(input(a, b, 5_000), byTreeMap(a, b, 5_000));
            int[] c = values(size, 100_000, random), d = values(size, 100_000, random);
            check(input(c, d, 3), byTreeMap(c, d, 3));
            // Kuhn's matching agrees with the TreeMap greedy on a few hundred random inputs, so the
            // greedy can be trusted as the reference at the large size.
            for (int t = 0; t < 300; t++) {
                int[] x = values(1 + random.nextInt(30), 50, random), y = values(1 + random.nextInt(30), 50, random);
                if (byMatching(x, y, t % 4) != byTreeMap(x, y, t % 4)) throw new AssertionError("references disagree");
            }
        }

        // The test inputs themselves must be valid.
        expectInvalid(new int[] {}, new int[] {1}, 0);
        expectInvalid(new int[] {1}, new int[] {0}, 0);
        expectInvalid(new int[] {1}, new int[] {1}, -1);
        expectInvalid(new int[] {1_000_000_001}, new int[] {1}, 0);
        expectInvalid(new int[200_001], new int[] {1}, 0);

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

    static int[] filled(int count, int value) {
        int[] v = new int[count];
        Arrays.fill(v, value);
        return v;
    }

    /** Maximum bipartite matching by augmenting paths (Kuhn), independent of any greedy. */
    static int byMatching(int[] a, int[] b, int k) {
        int[] owner = new int[b.length];
        Arrays.fill(owner, -1);
        int matched = 0;
        for (int i = 0; i < a.length; i++) {
            if (augment(i, a, b, k, owner, new boolean[b.length])) matched++;
        }
        return matched;
    }

    static boolean augment(int i, int[] a, int[] b, int k, int[] owner, boolean[] visited) {
        for (int j = 0; j < b.length; j++) {
            if (visited[j] || Math.abs((long) a[i] - b[j]) > k) continue;
            visited[j] = true;
            if (owner[j] < 0 || augment(owner[j], a, b, k, owner, visited)) {
                owner[j] = i;
                return true;
            }
        }
        return false;
    }

    /** Sorted applicants, each taking the smallest free acceptable size from a TreeMap. */
    static int byTreeMap(int[] a0, int[] b, int k) {
        int[] a = a0.clone();
        Arrays.sort(a);
        TreeMap<Long, Integer> free = new TreeMap<>();
        for (int v : b) free.merge((long) v, 1, Integer::sum);
        int housed = 0;
        for (int v : a) {
            Long s = free.ceilingKey((long) v - k);
            if (s != null && s <= (long) v + k) {
                housed++;
                if (free.merge(s, -1, Integer::sum) == 0) free.remove(s);
            }
        }
        return housed;
    }

    /** Null when the input is valid, otherwise the reason it is not. */
    static String invalid(int[] a, int[] b, int k) {
        if (a.length < 1 || a.length > 200_000 || b.length < 1 || b.length > 200_000) return "n, m must be in 1..2*10^5";
        if (k < 0 || k > 1_000_000_000) return "k must be in 0..10^9";
        for (int v : a) if (v < 1 || v > 1_000_000_000) return "size " + v + " outside 1..10^9";
        for (int v : b) if (v < 1 || v > 1_000_000_000) return "size " + v + " outside 1..10^9";
        return null;
    }

    static void expectInvalid(int[] a, int[] b, int k) {
        if (invalid(a, b, k) == null) throw new AssertionError("the input guard accepted an invalid input");
    }

    static String input(int[] a, int[] b, int k) {
        String problem = invalid(a, b, k);
        if (problem != null) throw new IllegalArgumentException("invalid test: " + problem);
        StringBuilder sb = new StringBuilder();
        sb.append(a.length).append(' ').append(b.length).append(' ').append(k).append('\n');
        for (int i = 0; i < a.length; i++) sb.append(i > 0 ? " " : "").append(a[i]);
        sb.append('\n');
        for (int j = 0; j < b.length; j++) sb.append(j > 0 ? " " : "").append(b[j]);
        return sb.append('\n').toString();
    }

    static void check(String input, int expected) throws Exception {
        String output = run(input);
        String got = output.trim();
        if (!got.equals(String.valueOf(expected))) {
            String shown = input.length() > 80 ? input.substring(0, 80) + "..." : input;
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
