import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.Random;

/**
 * Tests for every "public class Main" on the Static Range Sum Queries page (run by `npm run problems:verify`).
 *
 * The page's O(n * q) alternative (add up each range again for every query) runs these tests too, so
 * the tests at the largest n and q keep the total length of all queried ranges near 10^7; the slow
 * worst case (q queries of the whole array) is measured on the page, not run here.
 * Expected answers come from an independent loop over each range, in long.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) throws Exception {
        // The CSES example: also the dry-run input of every approach on the page.
        check("8 4\n3 2 4 5 1 1 5 3\n2 4\n5 6\n1 8\n3 3\n", "11 2 24 4");

        // Edge cases from section 3.
        check("1 1\n7\n1 1\n", "7");                                       // n = 1
        check("1 3\n1000000000\n1 1\n1 1\n1 1\n", "1000000000 1000000000 1000000000");
        check("5 5\n1 2 3 4 5\n1 1\n2 2\n3 3\n4 4\n5 5\n", "1 2 3 4 5");  // a = b everywhere
        check("5 2\n1 2 3 4 5\n1 5\n5 5\n", "15 5");                       // whole array, last element
        check("4 3\n9 9 9 9\n1 4\n1 4\n2 3\n", "36 36 18");                 // repeated queries

        // Overflow boundaries: a range sum above 2^31 - 1 needs long.
        check("3 3\n1000000000 1000000000 1000000000\n1 3\n2 3\n3 3\n", "3000000000 2000000000 1000000000");
        check("3 1\n1000000000 1000000000 147483647\n1 3\n", "2147483647");  // exactly 2^31 - 1
        check("3 1\n1000000000 1000000000 147483648\n1 3\n", "2147483648");  // exactly 2^31

        // Whitespace the judge never sends, but a robust reader accepts.
        check("8 4\n3 2 4 5 1 1 5 3\n2 4\n5 6\n1 8\n3 3", "11 2 24 4");     // no final newline
        check("8 4\n3 2 4 5\n1 1 5 3\n2 4 5 6\n1 8\n3   3\n", "11 2 24 4");  // tokens split differently

        // Every range of every array of length 1..40 (covers every block boundary of the block approach).
        Random random = new Random(20261116L);
        for (int n = 1; n <= 40; n++) {
            int[] x = randomValues(n, random, 1_000_000_000);
            int[][] qs = new int[n * (n + 1) / 2][];
            int k = 0;
            for (int a = 1; a <= n; a++) {
                for (int b = a; b <= n; b++) qs[k++] = new int[] {a, b};
            }
            check(x, qs);
        }

        // Random inputs against the reference loop.
        for (int t = 0; t < 400; t++) {
            int n = 1 + random.nextInt(500);
            int q = 1 + random.nextInt(300);
            int maxValue = random.nextBoolean() ? 10 : 1_000_000_000;
            check(randomValues(n, random, maxValue), randomQueries(n, q, n, random));
        }

        // Largest n and q = 2 * 10^5, every value 10^9: the whole-array sum is 2 * 10^14.
        int max = 200_000;
        int[] big = new int[max];
        java.util.Arrays.fill(big, 1_000_000_000);
        int[][] wide = new int[max][];
        for (int i = 0; i < max; i++) {
            if (i < 20) wide[i] = new int[] {1, max};                       // 20 whole-array queries
            else {
                int a = 1 + random.nextInt(max - 30);
                wide[i] = new int[] {a, a + random.nextInt(30)};            // short ranges elsewhere
            }
        }
        check(big, wide);
        // Largest n and q with random values and short random ranges.
        check(randomValues(max, random, 1_000_000_000), randomQueries(max, max, 50, random));

        // The test inputs themselves must be valid.
        expectInvalid(new int[] {1, 2}, new int[][] {{2, 1}});              // a > b
        expectInvalid(new int[] {1, 2}, new int[][] {{1, 3}});              // b > n
        expectInvalid(new int[] {0, 2}, new int[][] {{1, 2}});              // value below 1
        expectInvalid(new int[] {}, new int[][] {{1, 1}});                  // n = 0
        expectInvalid(new int[] {5}, new int[][] {});                       // q = 0

        System.out.println("PASS " + cases + " cases");
    }

    static int[] randomValues(int n, Random random, int maxValue) {
        int[] x = new int[n];
        for (int i = 0; i < n; i++) x[i] = 1 + random.nextInt(maxValue);
        return x;
    }

    /** q random ranges [a, b] in 1..n with b - a < maxLength. */
    static int[][] randomQueries(int n, int q, int maxLength, Random random) {
        int[][] qs = new int[q][];
        for (int i = 0; i < q; i++) {
            int a = 1 + random.nextInt(n);
            int b = Math.min(n, a + random.nextInt(maxLength));
            qs[i] = new int[] {a, b};
        }
        return qs;
    }

    /** Null when the input is valid for the CSES statement, otherwise the reason. */
    static String invalid(int[] x, int[][] qs) {
        int n = x.length;
        if (n < 1 || n > 200_000) return "n must be in 1..2*10^5";
        if (qs.length < 1 || qs.length > 200_000) return "q must be in 1..2*10^5";
        for (int v : x) if (v < 1 || v > 1_000_000_000) return "value " + v + " outside 1..10^9";
        for (int[] r : qs) if (!(1 <= r[0] && r[0] <= r[1] && r[1] <= n)) return "bad range " + r[0] + " " + r[1];
        return null;
    }

    static void expectInvalid(int[] x, int[][] qs) {
        if (invalid(x, qs) == null) throw new AssertionError("the input guard accepted an invalid input");
    }

    /** Builds the input, computes every answer with a plain loop, and checks the program. */
    static void check(int[] x, int[][] qs) throws Exception {
        String problem = invalid(x, qs);
        if (problem != null) throw new IllegalArgumentException("invalid test: " + problem);
        StringBuilder in = new StringBuilder();
        in.append(x.length).append(' ').append(qs.length).append('\n');
        for (int i = 0; i < x.length; i++) in.append(i > 0 ? " " : "").append(x[i]);
        in.append('\n');
        StringBuilder expected = new StringBuilder();
        for (int[] r : qs) {
            in.append(r[0]).append(' ').append(r[1]).append('\n');
            long sum = 0;
            for (int i = r[0]; i <= r[1]; i++) sum += x[i - 1];
            expected.append(sum).append(' ');
        }
        check(in.toString(), expected.toString());
    }

    /** Token-by-token comparison, so spaces and newlines do not matter. */
    static void check(String input, String expected) throws Exception {
        String[] got = run(input).trim().split("\\s+");
        String[] want = expected.trim().split("\\s+");
        boolean same = got.length == want.length;
        for (int i = 0; same && i < want.length; i++) same = got[i].equals(want[i]);
        if (!same) {
            String shown = input.length() > 80 ? input.substring(0, 80) + "..." : input;
            String gotShown = String.join(" ", got);
            if (gotShown.length() > 80) gotShown = gotShown.substring(0, 80) + "...";
            throw new AssertionError("input " + shown.replace('\n', '|') + ": got " + gotShown);
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
