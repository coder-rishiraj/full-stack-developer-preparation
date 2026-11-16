import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.Random;

/**
 * Tests for every "public class Main" on the Bit Strings page (run by `npm run problems:verify`).
 * Each program reads n and must print 2^n mod 10^9+7; BigInteger is the independent reference.
 */
class Tests {
    static int cases = 0;
    static final BigInteger MOD = BigInteger.valueOf(1_000_000_007L);

    public static void main(String[] args) throws Exception {
        // Example from the statement and the dry runs (n = 3, 5, 10, 13)
        expect(3, "8");
        expect(5, "32");
        expect(10, "1024");
        expect(13, "8192");

        // The 12 official CSES tests (public/tests/cses/cses-bit-strings.json)
        long[][] official = {
            {7, 128}, {15, 32768}, {27, 134217728}, {255, 396422633}, {447, 941778035},
            {138367, 86267609}, {159487, 291864888}, {270271, 26708571}, {665215, 976383320},
            {704511, 852098711}, {1, 2}, {1000000, 235042059},
        };
        for (long[] t : official) expect((int) t[0], Long.toString(t[1]));

        // Edge cases and overflow boundaries from sections 3, 7 and 11
        expect(1, "2");
        expect(29, "536870912");      // the last power of two below the modulus
        expect(30, "73741817");       // the first one that is reduced: 2^30 - (10^9 + 7)
        expect(31, "147483634");      // 2^31 would overflow an int if it were not reduced
        expect(62, "145586002");
        expect(63, "291172004");      // 2^63 wraps a long to Long.MIN_VALUE
        expect(64, "582344008");      // 2^64 wraps a long to 0
        expect(1000000, "235042059"); // largest n

        // Every n from 1 to 2000, and random n up to 10^6
        for (int n = 1; n <= 2000; n++) check(n);
        Random random = new Random(20261116L);
        for (int i = 0; i < 300; i++) check(1 + random.nextInt(1_000_000));

        // Timing at the largest n (limit 1 s)
        long start = System.nanoTime();
        for (int i = 0; i < 5; i++) run("1000000\n");
        long ms = (System.nanoTime() - start) / 1_000_000;
        if (ms > 1000) throw new AssertionError("too slow: " + ms + " ms for 5 runs at n = 10^6");

        System.out.println("PASS " + cases + " cases");
    }

    static void check(int n) throws Exception {
        expect(n, BigInteger.TWO.modPow(BigInteger.valueOf(n), MOD).toString());
    }

    static void expect(int n, String want) throws Exception {
        if (n < 1 || n > 1_000_000) throw new IllegalStateException("bad test case, n = " + n);
        if (!want.equals(BigInteger.TWO.pow(Math.min(n, 64)).mod(MOD).toString()) && n <= 64) {
            throw new IllegalStateException("bad expected value for n = " + n);
        }
        String got = run(n + "\n").trim();
        if (!got.equals(want)) throw new AssertionError("n=" + n + ": expected " + want + " but got " + got);
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
