import java.util.Random;

/**
 * Tests for every "class Solution" on the Reverse Integer page (run by `npm run problems:verify`).
 * The expected value comes from a reference that reverses in a long (|result| <= 8,463,847,412,
 * far inside the long range) and range-checks at the end. Covers the examples, every dry-run and
 * edge-case input, every x in [-10^6, 10^6], the ten-digit inputs around the reversal limits, and
 * random inputs across the whole int range. It also re-checks the claims the page makes about the
 * unchecked loop and the string version.
 */
class Tests {
    static int cases = 0;

    static int reference(int x) {
        long rev = 0;
        while (x != 0) {
            rev = rev * 10 + x % 10;
            x /= 10;
        }
        return rev > Integer.MAX_VALUE || rev < Integer.MIN_VALUE ? 0 : (int) rev;
    }

    /** The unchecked loop from section 9 (the bug). */
    static int unchecked(int x) {
        int rev = 0;
        while (x != 0) {
            rev = rev * 10 + x % 10;
            x /= 10;
        }
        return rev;
    }

    /** The string version described in section 4. */
    static int viaString(int x) {
        String s = Integer.toString(x);
        boolean negative = s.charAt(0) == '-';
        String reversed = new StringBuilder(negative ? s.substring(1) : s).reverse().toString();
        try {
            return Integer.parseInt(negative ? "-" + reversed : reversed);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    static void check(int x, Integer expected) {
        int want = reference(x);
        if (expected != null && expected != want) throw new IllegalStateException("bad test case: x = " + x + " expected " + expected + " should be " + want);
        int got = new Solution().reverse(x);
        if (got != want) throw new AssertionError("x = " + x + ": expected " + want + " but got " + got);
        if (viaString(x) != want) throw new AssertionError("string version wrong for " + x);
        cases++;
    }

    static void check(int x) {
        check(x, null);
    }

    static void claim(boolean ok, String what) {
        if (!ok) throw new AssertionError("page claim is wrong: " + what);
    }

    public static void main(String[] args) {
        // Examples (section 1)
        check(123, 321);
        check(-123, -321);
        check(120, 21);

        // Dry runs, edge cases and traces (sections 3, 4, 7, 9)
        check(0, 0);
        check(900_000, 9);
        check(1_534_236_469, 0);
        check(Integer.MAX_VALUE, 0);
        check(Integer.MIN_VALUE, 0);
        check(1_463_847_412, 2_147_483_641);
        check(-1_463_847_412, -2_147_483_641);
        check(1_000_000_003, 0);
        check(1_000_000_009, 0);
        check(-2_147_483_412, -2_143_847_412);
        check(2_147_483_641, 1_463_847_412);
        check(1_463_847_413, 0);
        check(1_563_847_412, 0);
        check(-1_563_847_412, 0);
        check(1, 1);
        check(-1, -1);
        check(10, 1);
        check(-10, -1);

        // The page's claims about the unchecked loop
        claim(unchecked(1_534_236_469) == 1_056_389_759, "1534236469 -> 1056389759");
        claim(unchecked(Integer.MAX_VALUE) == -1_126_087_180, "MAX -> -1126087180");
        claim(unchecked(Integer.MIN_VALUE) == 126_087_180, "MIN -> 126087180");
        claim(unchecked(1_000_000_003) == -1_294_967_295, "1000000003 -> -1294967295");
        claim(Math.abs(Integer.MIN_VALUE) == Integer.MIN_VALUE, "abs(MIN) is MIN");

        // Every x in [-10^6, 10^6]
        for (int x = -1_000_000; x <= 1_000_000; x++) check(x);

        // Ten-digit inputs around the reversal limits: x whose reversal is near MAX or MIN
        for (int d = -5000; d <= 5000; d++) {
            check(1_463_847_412 + d);
            check(-1_463_847_412 + d);
        }
        for (int x = Integer.MAX_VALUE - 5000; x < Integer.MAX_VALUE; x++) check(x);
        for (int x = Integer.MIN_VALUE + 1; x <= Integer.MIN_VALUE + 5000; x++) check(x);
        for (int x = 1_000_000_000; x <= 1_000_005_000; x++) check(x);
        for (int x = -1_000_005_000; x <= -1_000_000_000; x++) check(x);

        // Random inputs across the whole int range
        Random random = new Random(20261116L);
        for (int t = 0; t < 300_000; t++) check(random.nextInt());

        System.out.println("PASS " + cases + " cases");
    }
}
