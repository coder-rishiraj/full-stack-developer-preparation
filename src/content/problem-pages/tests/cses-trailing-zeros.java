import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.Random;

/**
 * Tests for every "public class Main" on the Trailing Zeros page (run by `npm run problems:verify`).
 * Each program reads n and prints the number of trailing zeros of n!. Three independent references:
 * the real factorial (BigInteger) for small n, a running count of factors of 5 for every n up to
 * 20,000, and the base-5 digit-sum form (n - s5(n)) / 4 for large n.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) throws Exception {
        // Example from the statement and the dry runs (20, 100, 130)
        expect(20, 4);
        expect(100, 24);
        expect(130, 32);

        // The 12 official CSES tests (public/tests/cses/cses-trailing-zeros.json)
        long[][] official = {
            {395, 97}, {871, 215}, {239, 57}, {535, 132}, {977, 242}, {374960399, 93740092},
            {519491358, 129872833}, {19273478, 4818363}, {669763357, 167440831},
            {850915850, 212728957}, {1, 0}, {5, 1},
        };
        for (long[] t : official) expect((int) t[0], t[1]);

        // Edge cases from sections 3 and 7
        expect(1, 0);
        expect(4, 0);
        expect(5, 1);
        expect(24, 4);
        expect(25, 6);                 // 25 contributes two 5s: n / 5 alone would say 5
        expect(124, 28);
        expect(125, 31);
        expect(244140624, 61035144);   // 5^12 - 1: twelve fewer than 5^12
        expect(244140625, 61035156);   // 5^12, the largest power of 5 that is at most 10^9
        expect(1_000_000_000, 249999998);

        // n! itself for n <= 300: count its trailing zeros directly
        BigInteger f = BigInteger.ONE;
        for (int n = 1; n <= 300; n++) {
            f = f.multiply(BigInteger.valueOf(n));
            String s = f.toString();
            int zeros = 0;
            for (int i = s.length() - 1; s.charAt(i) == '0'; i--) zeros++;
            if (zeros != digitSumForm(n)) throw new IllegalStateException("references disagree at n = " + n);
            expect(n, zeros);
        }

        // Every n up to 20,000 against a running count of factors of 5 (and of 2, which never runs out first)
        long fives = 0, twos = 0;
        for (int n = 1; n <= 20_000; n++) {
            for (int m = n; m % 5 == 0; m /= 5) fives++;
            for (int m = n; m % 2 == 0; m /= 2) twos++;
            if (twos < fives) throw new AssertionError("more 5s than 2s at n = " + n);
            if (n > 300) expect(n, fives);
        }

        // Random n up to 10^9
        Random random = new Random(20261116L);
        for (int i = 0; i < 2000; i++) {
            int n = 1 + random.nextInt(1_000_000_000);
            expect(n, digitSumForm(n));
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** Legendre's formula in its digit form: v5(n!) = (n - sum of base-5 digits of n) / 4. */
    static long digitSumForm(long n) {
        long s = 0;
        for (long m = n; m > 0; m /= 5) s += m % 5;
        return (n - s) / 4;
    }

    static void expect(int n, long want) throws Exception {
        if (n < 1 || n > 1_000_000_000) throw new IllegalStateException("bad test case, n = " + n);
        if (want != digitSumForm(n)) throw new IllegalStateException("bad expected value for n = " + n);
        String got = run(n + "\n").trim();
        if (!got.equals(Long.toString(want))) throw new AssertionError("n=" + n + ": expected " + want + " but got " + got);
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
