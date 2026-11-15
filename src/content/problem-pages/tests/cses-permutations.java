import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Tests for every "public class Main" on the Permutations page (run by `npm run problems:verify`).
 * Many outputs are correct, so a checker validates each answer instead of comparing it with one
 * expected string.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) throws Exception {
        // The checker itself must reject wrong answers before it is trusted.
        expectRejected(4, "1 3 2 4");          // odds then evens: 3 and 2 are adjacent
        expectRejected(4, "4 2 3 1");          // the example's pattern applied to n = 4
        expectRejected(3, "1 3 2");            // a "permutation" where none exists
        expectRejected(1, "NO SOLUTION");      // n = 1 has the answer "1"
        expectRejected(5, "NO SOLUTION");
        expectRejected(5, "2 4 1 3");          // 5 is missing
        expectRejected(5, "2 4 1 3 3");        // repeated value
        expectRejected(5, "2 4 1 3 6");        // value out of range
        expectRejected(4, "2 4 1 3 5");        // one value too many
        expectRejected(2, "NO");               // wrong wording
        expectRejected(1, "");

        // Brute force agrees with the proof on the page: only n = 2 and n = 3 have no answer.
        for (int n = 1; n <= 9; n++) {
            boolean expected = n != 2 && n != 3;
            if (existsByBruteForce(n) != expected) {
                throw new AssertionError("brute force disagrees with the proof at n=" + n);
            }
        }

        // Examples from the statement, then every n from 1 to 2000 (covers the edge cases
        // n = 1, 2, 3, 4 and every dry run on the page).
        for (int n = 1; n <= 2000; n++) {
            check(n);
        }

        // Largest input.
        check(1_000_000);

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

    /** Whether an answer exists: by brute force for small n, by the page's proof for n >= 4. */
    static boolean exists(int n) {
        return n <= 9 ? existsByBruteForce(n) : true;
    }

    /** Returns null when the output is a correct answer for n, otherwise the reason it is wrong. */
    static String validate(int n, String output) {
        List<String> tokens = tokens(output);
        if (tokens.size() == 2 && tokens.get(0).equals("NO") && tokens.get(1).equals("SOLUTION")) {
            return exists(n) ? "printed NO SOLUTION but a beautiful permutation exists" : null;
        }
        if (tokens.size() != n) {
            return "expected " + n + " numbers, got " + tokens.size() + " tokens";
        }
        boolean[] seen = new boolean[n + 1];
        int previous = 0;
        for (int i = 0; i < n; i++) {
            int value;
            try {
                value = Integer.parseInt(tokens.get(i));
            } catch (NumberFormatException e) {
                return "token " + i + " is not a number: " + tokens.get(i);
            }
            if (value < 1 || value > n) return "value " + value + " is outside 1.." + n;
            if (seen[value]) return "value " + value + " appears twice";
            seen[value] = true;
            if (i > 0 && Math.abs(value - previous) == 1) {
                return "adjacent values " + previous + " and " + value + " differ by 1";
            }
            previous = value;
        }
        return null;
    }

    /** Backtracking over all orders of 1..n (independent of the page's construction). */
    static boolean existsByBruteForce(int n) {
        return extend(n, new boolean[n + 1], 0, 0);
    }

    static boolean extend(int n, boolean[] used, int placed, int last) {
        if (placed == n) return true;
        for (int v = 1; v <= n; v++) {
            if (used[v] || (placed > 0 && Math.abs(v - last) == 1)) continue;
            used[v] = true;
            if (extend(n, used, placed + 1, v)) return true;
            used[v] = false;
        }
        return false;
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
