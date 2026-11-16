import java.util.Random;

/**
 * Tests for every "class Solution" on the Excel Sheet Column Title page (run by `npm run problems:verify`).
 * Each approach is compiled together with this file and must pass all cases.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples from the statement and section 1, and the dry-run inputs
        check(1, "A");
        check(28, "AB");
        check(701, "ZY");
        check(52, "AZ");

        // Edge cases from sections 3, 4 and 7 (multiples of 26, first label of each length)
        check(25, "Y");
        check(26, "Z");
        check(27, "AA");
        check(53, "BA");
        check(702, "ZZ");
        check(703, "AAA");
        check(18278, "ZZZ");
        check(18279, "AAAA");
        check(475254, "ZZZZ");
        check(475255, "AAAAA");
        check(12356630, "ZZZZZ");
        check(12356631, "AAAAAA");
        check(321272406, "ZZZZZZ");
        check(321272407, "AAAAAAA");    // where an int block size in Approach 1 breaks
        check(Integer.MAX_VALUE, "FXSHRXW");
        check(Integer.MAX_VALUE - 1, "FXSHRXV");

        // Exhaustive for 1..50000 against an odometer that counts labels one by one
        char[] label = {'A'};
        for (int n = 1; n <= 50000; n++) {
            check(n, new String(label));
            label = next(label);
        }

        // Random large inputs: round trip through the inverse map
        Random random = new Random(20261116L);
        for (int t = 0; t < 20000; t++) {
            int n = 1 + random.nextInt(Integer.MAX_VALUE);
            checkRoundTrip(n);
        }
        // Around every multiple of 26 near the top of the range
        for (int n = Integer.MAX_VALUE; n > Integer.MAX_VALUE - 2000; n--) {
            checkRoundTrip(n);
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** The label after this one, like an odometer with digits A..Z and no zero. */
    static char[] next(char[] label) {
        char[] c = label.clone();
        for (int i = c.length - 1; i >= 0; i--) {
            if (c[i] < 'Z') {
                c[i]++;
                return c;
            }
            c[i] = 'A';
        }
        char[] longer = new char[c.length + 1];
        longer[0] = 'A';
        System.arraycopy(c, 0, longer, 1, c.length);
        return longer;
    }

    /** Inverse map: label to number (Horner, digits 1..26). */
    static long toNumber(String s) {
        long n = 0;
        for (char c : s.toCharArray()) {
            if (c < 'A' || c > 'Z') return -1;
            n = n * 26 + (c - 'A' + 1);
        }
        return n;
    }

    static String run(int n) {
        if (n < 1) {
            throw new IllegalStateException(n + ": bad test case, columnNumber must be at least 1");
        }
        return new Solution().convertToTitle(n);
    }

    static void check(int n, String want) {
        // Guard against a wrong expected value: it must map back to n.
        if (toNumber(want) != n) {
            throw new IllegalStateException(n + ": bad test case, " + want + " is not its label");
        }
        String got = run(n);
        if (!want.equals(got)) {
            throw new AssertionError(n + ": expected " + want + " but got " + got);
        }
        cases++;
    }

    static void checkRoundTrip(int n) {
        String got = run(n);
        // Labels are unique (bijective base 26), so mapping back to n with letters A..Z only proves correctness.
        if (got.isEmpty() || toNumber(got) != n) {
            throw new AssertionError(n + ": got " + got + ", which is not its label");
        }
        cases++;
    }
}
