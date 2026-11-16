import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Tests for every "public class Main" on the Two Knights page (run by `npm run problems:verify`).
 * Small boards are counted pair by pair; the closed form, checked against those counts first,
 * is then evaluated in BigInteger for every k up to 10^4.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) throws Exception {
        // The reference itself: brute force over all pairs (k <= 24) and over squares (k <= 300).
        for (int k = 1; k <= 24; k++) {
            if (bruteByPairs(k) != bruteBySquares(k)) throw new AssertionError("brute forces disagree at k=" + k);
        }
        for (int k = 1; k <= 300; k++) {
            if (BigInteger.valueOf(bruteBySquares(k)).compareTo(formula(k)) != 0) {
                throw new AssertionError("closed form disagrees with the square-by-square count at k=" + k);
            }
        }
        // Facts the page states.
        assertEquals("4999999950000000", choose2(10_000).toString(), "C(10^8, 2)");
        assertEquals("4999999550119992", formula(10_000).toString(), "answer at k = 10^4");
        if (formula(215).compareTo(BigInteger.valueOf(Integer.MAX_VALUE)) > 0) throw new AssertionError("k=215 should fit in int");
        if (BigInteger.valueOf(216L * 216 * (216 * 216 - 1)).compareTo(BigInteger.valueOf(Integer.MAX_VALUE)) <= 0) {
            throw new AssertionError("k^2 (k^2 - 1) should pass 2^31 - 1 at k = 216");
        }

        // The example, the official tests, the dry runs and the small edge cases.
        expect("8\n", "0 6 28 96 252 550 1056 1848");
        expect("1\n", "0");
        expect("2\n", "0 6");
        for (int n = 1; n <= 40; n++) check(n);

        // Around the int overflow boundary (k = 216), and the largest input.
        check(215);
        check(216);
        check(1000);
        check(9999);
        check(10_000);

        System.out.println("PASS " + cases + " cases");
    }

    static void check(int n) throws Exception {
        if (n < 1 || n > 10_000) throw new IllegalArgumentException("invalid test: n must be in 1..10^4, got " + n);
        List<String> got = tokens(run(n + "\n"));
        if (got.size() != n) throw new AssertionError("n=" + n + ": expected " + n + " lines, got " + got.size());
        for (int k = 1; k <= n; k++) {
            String want = formula(k).toString();
            if (!got.get(k - 1).equals(want)) throw new AssertionError("n=" + n + ", k=" + k + ": expected " + want + ", got " + got.get(k - 1));
        }
        cases++;
    }

    static void expect(String input, String want) throws Exception {
        String got = String.join(" ", tokens(run(input)));
        if (!got.equals(want)) throw new AssertionError("input " + input.trim() + ": expected " + want + ", got " + got);
        cases++;
    }

    static BigInteger choose2(long k) {
        BigInteger cells = BigInteger.valueOf(k).multiply(BigInteger.valueOf(k));
        return cells.multiply(cells.subtract(BigInteger.ONE)).shiftRight(1);
    }

    /** C(k^2, 2) - 4 (k - 1)(k - 2), exactly. */
    static BigInteger formula(long k) {
        return choose2(k).subtract(BigInteger.valueOf(4).multiply(BigInteger.valueOf(k - 1)).multiply(BigInteger.valueOf(k - 2)));
    }

    static boolean attacks(int r1, int c1, int r2, int c2) {
        int dr = Math.abs(r1 - r2), dc = Math.abs(c1 - c2);
        return (dr == 1 && dc == 2) || (dr == 2 && dc == 1);
    }

    /** Every unordered pair of distinct squares, tested directly. */
    static long bruteByPairs(int k) {
        int cells = k * k;
        long count = 0;
        for (int p = 0; p < cells; p++) {
            for (int q = p + 1; q < cells; q++) {
                if (!attacks(p / k, p % k, q / k, q % k)) count++;
            }
        }
        return count;
    }

    /** Pairs minus attacking pairs, where attacking pairs = (sum of knight degrees) / 2. */
    static long bruteBySquares(int k) {
        int[] dr = {1, 2, 2, 1, -1, -2, -2, -1}, dc = {2, 1, -1, -2, -2, -1, 1, 2};
        long degreeSum = 0;
        for (int r = 0; r < k; r++) {
            for (int c = 0; c < k; c++) {
                for (int m = 0; m < 8; m++) {
                    int nr = r + dr[m], nc = c + dc[m];
                    if (nr >= 0 && nr < k && nc >= 0 && nc < k) degreeSum++;
                }
            }
        }
        long cells = (long) k * k;
        return cells * (cells - 1) / 2 - degreeSum / 2;
    }

    static void assertEquals(String want, String got, String what) {
        if (!want.equals(got)) throw new AssertionError(what + ": expected " + want + ", got " + got);
    }

    static List<String> tokens(String s) {
        List<String> out = new ArrayList<>();
        for (String t : s.trim().split("\\s+")) if (!t.isEmpty()) out.add(t);
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
