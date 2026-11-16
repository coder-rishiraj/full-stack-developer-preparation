import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.Random;

/**
 * Tests for every "public class Main" on the Forest Queries page (run by `npm run problems:verify`).
 *
 * The page's O(q * n^2) alternative (count every square of each rectangle) runs these tests too, so
 * at n = 1000, q = 2 * 10^5 the rectangles are small, plus a handful of whole-grid queries; the slow
 * worst case (q whole-grid queries) is measured on the page, not run here.
 * Expected answers come from an independent count over each rectangle.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) throws Exception {
        // The CSES example: also the dry-run input of every approach on the page.
        check("4 3\n.*..\n*.**\n**..\n****\n2 2 3 4\n3 1 3 1\n1 1 2 2\n", "3 1 2");
        // A query that needs the "+ p[y1 - 1][x1 - 1]" term (section 11): the example's queries all
        // have p[y1 - 1][x1 - 1] = 0, so they do not catch it.
        check("4 1\n.*..\n*.**\n**..\n****\n3 3 4 4\n", "2");

        // Edge cases from section 3.
        check("1 1\n*\n1 1 1 1\n", "1");                                   // n = 1 with a tree
        check("1 1\n.\n1 1 1 1\n", "0");                                   // n = 1 without
        check("3 2\n...\n...\n...\n1 1 3 3\n2 2 2 2\n", "0 0");            // no trees at all
        check("3 2\n***\n***\n***\n1 1 3 3\n2 1 3 2\n", "9 4");            // all trees
        check("3 3\n*..\n.*.\n..*\n1 1 1 3\n1 3 3 3\n3 3 3 3\n", "1 1 1"); // one row, one column, one cell
        check("2 2\n*.\n.*\n1 1 2 2\n1 1 2 2\n", "2 2");                   // repeated query

        // Whitespace the judge never sends, but a robust reader accepts.
        check("4 3\n.*..\n*.**\n**..\n****\n2 2 3 4\n3 1 3 1\n1 1 2 2", "3 1 2");      // no final newline
        check("4 3\r\n.*..\r\n*.**\r\n**..\r\n****\r\n2 2 3 4\r\n3 1 3 1\r\n1 1 2 2\r\n", "3 1 2"); // CRLF
        check("4 3\n.*..\n*.**\n**..\n****\n2 2 3 4 3 1\n3 1 1 1\n2 2\n", "3 1 2");   // query tokens split differently

        // Every rectangle of random grids of size 1..7.
        Random random = new Random(20261116L);
        for (int n = 1; n <= 7; n++) {
            for (int rep = 0; rep < 3; rep++) {
                char[][] g = randomGrid(n, random, 0.2 + 0.3 * rep);
                java.util.List<int[]> all = new java.util.ArrayList<>();
                for (int y1 = 1; y1 <= n; y1++)
                    for (int x1 = 1; x1 <= n; x1++)
                        for (int y2 = y1; y2 <= n; y2++)
                            for (int x2 = x1; x2 <= n; x2++) all.add(new int[] {y1, x1, y2, x2});
                check(g, all.toArray(new int[0][]));
            }
        }

        // Random inputs against the reference count.
        for (int t = 0; t < 300; t++) {
            int n = 1 + random.nextInt(60);
            int q = 1 + random.nextInt(200);
            check(randomGrid(n, random, random.nextDouble()), randomQueries(n, q, n, random));
        }

        // Largest n = 1000 and q = 2 * 10^5, all trees: the whole grid holds 10^6 trees.
        int max = 1000;
        int[][] qs = randomQueries(max, 200_000, 5, random);
        for (int i = 0; i < 10; i++) qs[i] = new int[] {1, 1, max, max};
        qs[10] = new int[] {max, max, max, max};
        qs[11] = new int[] {1, max, max, max};                             // last column
        qs[12] = new int[] {max, 1, max, max};                             // last row
        check(randomGrid(max, random, 1.0), qs);
        // Largest n and q, random forest, mostly small rectangles plus some whole-grid ones.
        qs = randomQueries(max, 200_000, 5, random);
        for (int i = 0; i < 10; i++) qs[i * 1000] = new int[] {1, 1, max, max};
        check(randomGrid(max, random, 0.5), qs);

        // The test inputs themselves must be valid.
        expectInvalid(new char[][] {{'*', '.'}, {'.', '#'}}, new int[][] {{1, 1, 2, 2}}); // bad character
        expectInvalid(new char[][] {{'*', '.'}, {'.'}}, new int[][] {{1, 1, 2, 2}});      // short row
        expectInvalid(new char[][] {{'*', '.'}, {'.', '*'}}, new int[][] {{2, 1, 1, 2}}); // y1 > y2
        expectInvalid(new char[][] {{'*', '.'}, {'.', '*'}}, new int[][] {{1, 1, 2, 3}}); // x2 > n
        expectInvalid(new char[][] {{'*'}}, new int[][] {});                               // q = 0

        System.out.println("PASS " + cases + " cases");
    }

    static char[][] randomGrid(int n, Random random, double treeShare) {
        char[][] g = new char[n][n];
        for (int y = 0; y < n; y++)
            for (int x = 0; x < n; x++) g[y][x] = random.nextDouble() < treeShare ? '*' : '.';
        return g;
    }

    /** q random rectangles inside an n x n grid, each side shorter than maxSide. */
    static int[][] randomQueries(int n, int q, int maxSide, Random random) {
        int[][] qs = new int[q][];
        for (int i = 0; i < q; i++) {
            int y1 = 1 + random.nextInt(n);
            int x1 = 1 + random.nextInt(n);
            int y2 = Math.min(n, y1 + random.nextInt(maxSide));
            int x2 = Math.min(n, x1 + random.nextInt(maxSide));
            qs[i] = new int[] {y1, x1, y2, x2};
        }
        return qs;
    }

    /** Null when the input is valid for the CSES statement, otherwise the reason. */
    static String invalid(char[][] g, int[][] qs) {
        int n = g.length;
        if (n < 1 || n > 1000) return "n must be in 1..1000";
        if (qs.length < 1 || qs.length > 200_000) return "q must be in 1..2*10^5";
        for (char[] row : g) {
            if (row.length != n) return "a row does not have n characters";
            for (char c : row) if (c != '.' && c != '*') return "character '" + c + "'";
        }
        for (int[] r : qs) {
            if (!(1 <= r[0] && r[0] <= r[2] && r[2] <= n)) return "bad rows " + r[0] + " " + r[2];
            if (!(1 <= r[1] && r[1] <= r[3] && r[3] <= n)) return "bad columns " + r[1] + " " + r[3];
        }
        return null;
    }

    static void expectInvalid(char[][] g, int[][] qs) {
        if (invalid(g, qs) == null) throw new AssertionError("the input guard accepted an invalid input");
    }

    /** Builds the input, counts every rectangle directly, and checks the program. */
    static void check(char[][] g, int[][] qs) throws Exception {
        String problem = invalid(g, qs);
        if (problem != null) throw new IllegalArgumentException("invalid test: " + problem);
        StringBuilder in = new StringBuilder();
        in.append(g.length).append(' ').append(qs.length).append('\n');
        for (char[] row : g) in.append(row).append('\n');
        StringBuilder expected = new StringBuilder();
        for (int[] r : qs) {
            in.append(r[0]).append(' ').append(r[1]).append(' ').append(r[2]).append(' ').append(r[3]).append('\n');
            int trees = 0;
            for (int y = r[0]; y <= r[2]; y++)
                for (int x = r[1]; x <= r[3]; x++) if (g[y - 1][x - 1] == '*') trees++;
            expected.append(trees).append(' ');
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
