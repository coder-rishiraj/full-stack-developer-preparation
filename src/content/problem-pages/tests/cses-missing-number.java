import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Tests for every "public class Main" on the Missing Number page (run by `npm run problems:verify`).
 *
 * The page's O(n^2) alternative (scan the input once per candidate) is compiled and run against these
 * tests too. Its cost is about (sum of the positions of the values below the answer) + n, so at the
 * largest n the tests use small missing values, where it finishes quickly; the "missing value is n"
 * case is tested at n = 20,000 instead. Every other approach does the same amount of work whatever
 * value is missing.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) throws Exception {
        // The example, which is also the dry-run input of every approach on the page.
        check("5\n2 3 1 5\n", 4);

        // Edge cases from section 3: the smallest n, the missing value at either end.
        check("2\n1\n", 2);
        check("2\n2\n", 1);
        check("3\n3 2\n", 1);
        check("3\n1 2\n", 3);
        check("4\n3 1 2\n", 4);                          // traced in section 7: missing is n
        check("6\n6 5 4 3 1\n", 2);

        // Whitespace the judge never sends, but a robust reader accepts.
        check("5\n2 3 1 5", 4);                          // no final newline
        check("5\n2  3 1 5  \n", 4);                     // extra spaces
        check("5\n2 3\n1 5\n", 4);                       // numbers split over lines

        // Every n up to 8, every missing value, ascending, descending and one shuffled order.
        Random random = new Random(20261116L);
        for (int n = 2; n <= 8; n++) {
            for (int m = 1; m <= n; m++) {
                int[] values = without(n, m);
                check(input(n, values), m);
                check(input(n, reversed(values)), m);
                check(input(n, shuffled(values, random)), m);
            }
        }

        // Random inputs, answer checked against an independent set difference.
        for (int t = 0; t < 1500; t++) {
            int n = 2 + random.nextInt(300);
            int m = 1 + random.nextInt(n);
            int[] values = shuffled(without(n, m), random);
            check(input(n, values), bySetDifference(n, values));
        }

        // Overflow boundaries for the sum (section 4, Approach 4):
        //   n(n+1) first exceeds 2^31 - 1 at n = 46,341; n(n+1)/2 first exceeds it at n = 65,536;
        //   an int version of n * (n + 1) / 2 is wrong for every n from 46,341 to 80,264.
        int[] boundaries = {46_340, 46_341, 65_535, 65_536, 80_264, 80_265};
        for (int n : boundaries) {
            check(input(n, reversed(without(n, 7))), 7);
            check(input(n, shuffled(without(n, 1), random)), 1);
        }

        // Missing value n, at a size where the O(n^2) alternative still takes well under a second.
        check(input(20_000, shuffled(without(20_000, 20_000), random)), 20_000);
        check(input(20_000, without(20_000, 19_999)), 19_999);

        // Largest n = 2 * 10^5: the total is 20,000,100,000, far beyond int.
        int max = 200_000;
        check(input(max, shuffled(without(max, 1), random)), 1);
        check(input(max, reversed(without(max, 2))), 2);
        check(input(max, without(max, 3)), 3);
        check(input(max, shuffled(without(max, 5), random)), 5);

        // The test inputs themselves must be valid.
        expectInvalid(5, new int[] {2, 3, 1});           // n - 2 numbers
        expectInvalid(5, new int[] {2, 3, 3, 5});        // a repeated value
        expectInvalid(5, new int[] {2, 3, 1, 6});        // a value above n
        expectInvalid(1, new int[] {});                  // n below 2

        System.out.println("PASS " + cases + " cases");
    }

    /** 1..n without m, ascending. */
    static int[] without(int n, int m) {
        int[] values = new int[n - 1];
        int k = 0;
        for (int v = 1; v <= n; v++) {
            if (v != m) values[k++] = v;
        }
        return values;
    }

    static int[] reversed(int[] a) {
        int[] r = new int[a.length];
        for (int i = 0; i < a.length; i++) r[i] = a[a.length - 1 - i];
        return r;
    }

    static int[] shuffled(int[] a, Random random) {
        int[] r = a.clone();
        for (int i = r.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            int tmp = r[i];
            r[i] = r[j];
            r[j] = tmp;
        }
        return r;
    }

    static int bySetDifference(int n, int[] values) {
        List<Integer> all = new ArrayList<>();
        for (int v = 1; v <= n; v++) all.add(v);
        for (int v : values) all.remove(Integer.valueOf(v));
        if (all.size() != 1) throw new AssertionError("set difference left " + all.size() + " values");
        return all.get(0);
    }

    /** Null when (n, values) is a valid input, otherwise the reason it is not. */
    static String invalid(int n, int[] values) {
        if (n < 2 || n > 200_000) return "n must be in 2..2*10^5";
        if (values.length != n - 1) return "there must be n - 1 numbers";
        boolean[] seen = new boolean[n + 1];
        for (int v : values) {
            if (v < 1 || v > n) return "value " + v + " outside 1..n";
            if (seen[v]) return "value " + v + " repeated";
            seen[v] = true;
        }
        return null;
    }

    static void expectInvalid(int n, int[] values) {
        if (invalid(n, values) == null) throw new AssertionError("the input guard accepted an invalid input");
    }

    static String input(int n, int[] values) {
        String problem = invalid(n, values);
        if (problem != null) throw new IllegalArgumentException("invalid test: " + problem);
        StringBuilder sb = new StringBuilder();
        sb.append(n).append('\n');
        for (int i = 0; i < values.length; i++) {
            if (i > 0) sb.append(' ');
            sb.append(values[i]);
        }
        return sb.append('\n').toString();
    }

    static void check(String input, int expected) throws Exception {
        String output = run(input).trim();
        if (!output.equals(String.valueOf(expected))) {
            String shown = input.length() > 60 ? input.substring(0, 60) + "..." : input;
            throw new AssertionError("input " + shown.replace('\n', '|') + ": expected " + expected + ", got " + output);
        }
        cases++;
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
