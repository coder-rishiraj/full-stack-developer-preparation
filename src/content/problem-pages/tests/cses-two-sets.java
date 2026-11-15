import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Tests for every "public class Main" on the Two Sets page (run by `npm run problems:verify`).
 * Many splits are correct, so a checker validates each answer instead of comparing it with one
 * expected string.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) throws Exception {
        // The checker itself must reject wrong answers before it is trusted.
        expectRejected(6, "YES 3 1 2 3 3 4 5 6");      // sums 6 and 15
        expectRejected(7, "NO");                       // a split exists
        expectRejected(1, "YES 1 1 0");                // n = 1 cannot be split
        expectRejected(4, "YES 2 1 4 2 2 2");          // 3 missing, 2 repeated
        expectRejected(4, "YES 2 1 4 1 2");            // sizes do not cover 1..4
        expectRejected(4, "YES 2 1 4 2 2 3 5");        // extra token
        expectRejected(4, "YES 3 1 4 2 3 2 3");        // size says 3 but the sets overlap
        expectRejected(4, "YES 2 1 5 2 2 3");          // value out of range
        expectRejected(3, "YES 0 3 1 2 3");            // empty first set, unequal sums
        expectRejected(2, "No");                       // wrong wording
        expectRejected(3, "");

        // An independent subset-sum check agrees with the parity rule (n mod 4 is 0 or 3).
        for (int n = 1; n <= 60; n++) {
            if (existsBySubsetSum(n) != (n % 4 == 0 || n % 4 == 3)) {
                throw new AssertionError("subset-sum check disagrees with the parity rule at n=" + n);
            }
        }

        // Examples (7 -> YES, 6 -> NO), every dry run, edge cases n = 1, 2, 3, 4, and every n up
        // to 2000, which includes all four residues mod 4 many times.
        for (int n = 1; n <= 2000; n++) {
            check(n);
        }

        // Overflow boundary: n(n+1) first exceeds Integer.MAX_VALUE at n = 46341.
        // 46343 is the first n past it with an answer.
        check(46_340);
        check(46_343);
        check(46_344);

        // Largest inputs, one of each residue mod 4.
        check(1_000_000);   // 0 mod 4: YES, total about 5 * 10^11
        check(999_999);     // 3 mod 4: YES
        check(999_998);     // 2 mod 4: NO
        check(999_997);     // 1 mod 4: NO

        System.out.println("PASS " + cases + " cases");
    }

    static void check(int n) throws Exception {
        if (n < 1 || n > 1_000_000) {
            throw new IllegalArgumentException("invalid test: n must be in 1..10^6, got " + n);
        }
        String output = run(n + "\n");
        String problem = validate(n, output);
        if (problem != null) {
            String shown = output.length() > 80 ? output.substring(0, 80) + "..." : output;
            throw new AssertionError("n=" + n + ": " + problem + "\noutput: " + shown);
        }
        cases++;
    }

    static void expectRejected(int n, String output) {
        if (validate(n, output) == null) {
            throw new AssertionError("checker accepted a wrong answer for n=" + n + ": " + output);
        }
    }

    /** Whether a split exists: subset-sum for small n, the parity proof on the page beyond. */
    static boolean exists(int n) {
        return n <= 60 ? existsBySubsetSum(n) : (n % 4 == 0 || n % 4 == 3);
    }

    /** Classic 0/1 subset-sum over 1..n: can some subset reach exactly half the total? */
    static boolean existsBySubsetSum(int n) {
        int total = n * (n + 1) / 2;            // n <= 60, so this fits easily
        if (total % 2 != 0) return false;
        boolean[] reachable = new boolean[total / 2 + 1];
        reachable[0] = true;
        for (int x = 1; x <= n; x++) {
            for (int s = total / 2; s >= x; s--) {
                if (reachable[s - x]) reachable[s] = true;
            }
        }
        return reachable[total / 2];
    }

    /** Returns null when the output is a correct answer for n, otherwise the reason it is wrong. */
    static String validate(int n, String output) {
        List<String> t = tokens(output);
        if (t.isEmpty()) return "no output";
        if (t.get(0).equals("NO")) {
            if (t.size() != 1) return "extra tokens after NO";
            return exists(n) ? "printed NO but a split exists" : null;
        }
        if (!t.get(0).equals("YES")) return "first token must be YES or NO, got " + t.get(0);
        if (!exists(n)) return "printed YES but no split exists";
        int[] pos = {1};
        boolean[] seen = new boolean[n + 1];
        long[] sums = new long[2];
        int[] sizes = new int[2];
        for (int set = 0; set < 2; set++) {
            Integer size = nextInt(t, pos);
            if (size == null) return "missing or bad size of set " + (set + 1);
            if (size < 0 || size > n) return "size " + size + " out of range";
            sizes[set] = size;
            for (int i = 0; i < size; i++) {
                Integer v = nextInt(t, pos);
                if (v == null) return "set " + (set + 1) + " has fewer numbers than its size";
                if (v < 1 || v > n) return "value " + v + " is outside 1.." + n;
                if (seen[v]) return "value " + v + " appears twice";
                seen[v] = true;
                sums[set] += v;
            }
        }
        if (pos[0] != t.size()) return "extra tokens after the second set";
        if (sizes[0] + sizes[1] != n) return "the sets do not cover 1.." + n;
        if (sums[0] != sums[1]) return "sums differ: " + sums[0] + " vs " + sums[1];
        return null;
    }

    static Integer nextInt(List<String> t, int[] pos) {
        if (pos[0] >= t.size()) return null;
        try {
            return Integer.parseInt(t.get(pos[0]++));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    static List<String> tokens(String s) {
        List<String> out = new ArrayList<>();
        int i = 0;
        while (i < s.length()) {
            while (i < s.length() && Character.isWhitespace(s.charAt(i))) i++;
            int start = i;
            while (i < s.length() && !Character.isWhitespace(s.charAt(i))) i++;
            if (i > start) out.add(s.substring(start, i));
        }
        return out;
    }

    /** Runs Main on the given input and returns what it printed. */
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
