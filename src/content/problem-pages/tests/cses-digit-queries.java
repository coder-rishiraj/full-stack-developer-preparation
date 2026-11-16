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
 * Tests for every "public class Main" on the Digit Queries page (run by `npm run problems:verify`).
 * Small positions are checked against the string 123456789101112... built explicitly; large ones
 * against an independent BigInteger reference that uses the closed form for whole blocks.
 */
class Tests {
    static final long MAX_K = 1_000_000_000_000_000_000L;
    static int cases = 0;
    static String prefix;

    public static void main(String[] args) throws Exception {
        StringBuilder sb = new StringBuilder();
        for (int x = 1; sb.length() < 1_200_000; x++) sb.append(x);
        prefix = sb.toString();

        // The reference must agree with the built string before it is trusted on large k.
        for (int k = 1; k <= prefix.length(); k += (k < 50_000 ? 1 : 97)) {
            if (reference(k) != prefix.charAt(k - 1)) throw new AssertionError("reference wrong at k=" + k);
        }
        // Facts the page states.
        assertEquals("158888888888888889", digitsThrough(16).toString(), "digits through 16-digit numbers");
        assertEquals("1688888888888888889", digitsThrough(17).toString(), "digits through 17-digit numbers");
        if (BigInteger.valueOf(18).multiply(BigInteger.valueOf(9)).multiply(BigInteger.TEN.pow(17))
                .compareTo(BigInteger.valueOf(Long.MAX_VALUE)) <= 0) {
            throw new AssertionError("the 18-digit block should overflow a long");
        }
        if (reference(MAX_K) != '3') throw new AssertionError("digit 10^18 should be 3");

        // The example, the dry runs and the block edges named on the page.
        expect(new long[] {7, 19, 12}, "7 4 1");
        expect(new long[] {1, 9, 10, 11, 189, 190, 191, 192}, "1 9 1 0 9 1 0 0");
        check(new long[] {MAX_K, 158_888_888_888_888_889L, 158_888_888_888_888_890L});

        // Every position 1..3000, in runs of q = 1000.
        for (int start = 1; start <= 3000; start += 1000) {
            long[] ks = new long[1000];
            for (int i = 0; i < 1000; i++) ks[i] = start + i;
            check(ks);
        }

        // Around every block boundary that k <= 10^18 can reach (d = 1..16).
        List<long[]> edges = new ArrayList<>();
        for (int d = 1; d <= 16; d++) {
            long end = digitsThrough(d).longValueExact();
            long[] ks = new long[2 * d + 6];
            for (int i = 0; i < ks.length; i++) ks[i] = end - (d + 2) + i;   // the last numbers of one block, the first of the next
            edges.add(ks);
        }
        for (long[] ks : edges) check(ks);

        // Random positions inside the built string, and up to 10^18; also the largest q.
        Random random = new Random(20261116L);
        for (int round = 0; round < 10; round++) {
            long[] ks = new long[1000];
            for (int i = 0; i < 1000; i++) ks[i] = 1 + random.nextInt(prefix.length());
            check(ks);
        }
        for (int round = 0; round < 10; round++) {
            long[] ks = new long[1000];
            for (int i = 0; i < 1000; i++) {
                // spread over all magnitudes: pick a digit length, then a value of that length
                long scale = 1;
                for (int e = random.nextInt(18); e > 0; e--) scale *= 10;
                ks[i] = Math.min(MAX_K, scale + (long) (random.nextDouble() * 9 * scale));
            }
            check(ks);
        }
        long[] top = new long[1000];
        for (int i = 0; i < 1000; i++) top[i] = MAX_K - i;
        check(top);

        System.out.println("PASS " + cases + " cases");
    }

    static void check(long[] ks) throws Exception {
        StringBuilder want = new StringBuilder();
        for (long k : ks) want.append(reference(k)).append(' ');
        expect(ks, want.toString().trim());
    }

    static void expect(long[] ks, String want) throws Exception {
        if (ks.length < 1 || ks.length > 1000) throw new IllegalArgumentException("invalid test: q = " + ks.length);
        StringBuilder input = new StringBuilder().append(ks.length).append('\n');
        for (long k : ks) {
            if (k < 1 || k > MAX_K) throw new IllegalArgumentException("invalid test: k must be in 1..10^18, got " + k);
            input.append(k).append('\n');
        }
        List<String> got = tokens(run(input.toString()));
        String[] w = want.split(" ");
        if (got.size() != w.length) throw new AssertionError("expected " + w.length + " answers, got " + got.size());
        for (int i = 0; i < w.length; i++) {
            if (!got.get(i).equals(w[i])) throw new AssertionError("k=" + ks[i] + ": expected " + w[i] + ", got " + got.get(i));
            cases++;
        }
    }

    /** Digits used by all numbers of at most d digits: d * 10^d - (10^d - 1) / 9. */
    static BigInteger digitsThrough(int d) {
        BigInteger p = BigInteger.TEN.pow(d);
        return BigInteger.valueOf(d).multiply(p).subtract(p.subtract(BigInteger.ONE).divide(BigInteger.valueOf(9)));
    }

    /** Independent reference in BigInteger: closed-form block ends, then the number and the digit. */
    static char reference(long kLong) {
        BigInteger k = BigInteger.valueOf(kLong);
        int d = 1;
        while (digitsThrough(d).compareTo(k) < 0) d++;
        BigInteger inBlock = k.subtract(digitsThrough(d - 1)).subtract(BigInteger.ONE);   // 0-based
        BigInteger[] qr = inBlock.divideAndRemainder(BigInteger.valueOf(d));
        BigInteger number = BigInteger.TEN.pow(d - 1).add(qr[0]);
        return number.toString().charAt(qr[1].intValueExact());
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
