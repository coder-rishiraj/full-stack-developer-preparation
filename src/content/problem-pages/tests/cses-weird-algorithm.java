import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Tests for every "public class Main" on the Weird Algorithm page (run by `npm run problems:verify`).
 * Each program reads n from standard input and must print the whole sequence on one line.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) throws Exception {
        // Example from the statement and the dry runs on the page
        check(3);
        check(6);

        // Edge cases from section 3 and section 7
        check(1);          // already 1: print just "1"
        check(2);          // one halving
        check(113383);     // smallest n whose sequence passes 2^31 - 1 (an int version loops forever)
        check(704511);     // largest value reached for n <= 10^6: 56991483520
        check(837799);     // longest sequence for n <= 10^6: 525 values
        check(1000000);    // largest n
        check(999999);

        // Facts the page states, checked against the independent reference
        assertEquals(56991483520L, maxValue(704511), "max value for 704511");
        assertEquals(525, reference(837799).size(), "length for 837799");
        if (maxValue(113382) > Integer.MAX_VALUE) throw new AssertionError("113382 should stay within int");
        if (maxValue(113383) <= Integer.MAX_VALUE) throw new AssertionError("113383 should exceed int");

        // Every n from 1 to 3000, then random n up to 10^6
        for (int n = 4; n <= 3000; n++) check(n);
        Random random = new Random(20261115L);
        for (int t = 0; t < 2000; t++) check(1 + random.nextInt(1_000_000));

        // Timing at the extreme inputs (the limit is 1 s per test)
        long start = System.nanoTime();
        run("837799\n");
        run("704511\n");
        long ms = (System.nanoTime() - start) / 1_000_000;
        if (ms > 1000) throw new AssertionError("too slow: " + ms + " ms");

        System.out.println("PASS " + cases + " cases");
    }

    /** Independent reference using BigInteger, so it cannot overflow. */
    static List<String> reference(int n) {
        List<String> seq = new ArrayList<>();
        BigInteger x = BigInteger.valueOf(n);
        BigInteger two = BigInteger.valueOf(2);
        BigInteger three = BigInteger.valueOf(3);
        seq.add(x.toString());
        while (!x.equals(BigInteger.ONE)) {
            x = x.testBit(0) ? x.multiply(three).add(BigInteger.ONE) : x.divide(two);
            seq.add(x.toString());
        }
        return seq;
    }

    static long maxValue(int n) {
        long best = 0;
        for (String s : reference(n)) best = Math.max(best, Long.parseLong(s));
        return best;
    }

    static void check(int n) throws Exception {
        if (n < 1 || n > 1_000_000) throw new IllegalStateException("bad test case, n = " + n);
        List<String> want = reference(n);
        List<String> got = tokens(run(n + "\n"));
        if (!want.equals(got)) {
            throw new AssertionError("n=" + n + ": expected " + want.size() + " values " + abbreviate(want)
                    + " but got " + got.size() + " values " + abbreviate(got));
        }
        cases++;
    }

    static String abbreviate(List<String> list) {
        return list.size() <= 12 ? list.toString() : list.subList(0, 12) + "...";
    }

    static void assertEquals(long want, long got, String what) {
        if (want != got) throw new AssertionError(what + ": expected " + want + " but got " + got);
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
