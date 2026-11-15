import java.util.Random;

/**
 * Tests for every "class Solution" on the Sqrt(x) page (run by `npm run problems:verify`).
 * The expected value comes from a long-based reference that never multiplies outside the
 * long range: a binary search with the bound 46,341 and an exact r^2 <= x < (r + 1)^2 check.
 * Covers every x in [0, 10^6], every perfect square near 2^31 - 1 and its neighbours, and
 * random large x.
 */
class Tests {
    static int cases = 0;

    static long reference(long x) {
        long lo = 0, hi = 46_341;                        // 46,341^2 > 2^31 - 1
        while (lo < hi) {                                // last m with m^2 <= x
            long mid = (lo + hi + 1) / 2;
            if (mid * mid <= x) lo = mid; else hi = mid - 1;
        }
        if (lo * lo > x || (lo + 1) * (lo + 1) <= x) throw new IllegalStateException("reference is wrong for " + x);
        return lo;
    }

    static void check(long x, Integer expected) {
        if (x < 0 || x > Integer.MAX_VALUE) throw new IllegalStateException("bad test case: x = " + x);
        long want = reference(x);
        if (expected != null && expected != want) throw new IllegalStateException("bad test case: expected " + expected + " should be " + want);
        int got = new Solution().mySqrt((int) x);
        if (got != want) throw new AssertionError("x = " + x + ": expected " + want + " but got " + got);
        cases++;
    }

    static void check(long x) {
        check(x, null);
    }

    public static void main(String[] args) {
        // Examples, dry runs and edge cases (sections 1, 3, 4, 7, 9 and 11)
        check(8, 2);
        check(16, 4);
        check(0, 0);
        check(1, 1);
        check(2, 1);
        check(3, 1);
        check(4, 2);
        check(15, 3);
        check(10, 3);
        check(92_682, 304);                              // int mid * mid returns 65,536
        check(Integer.MAX_VALUE, 46_340);                // int mid * mid never terminates
        check(2_147_395_600L, 46_340);                   // largest perfect square in range
        check(2_147_395_599L, 46_339);
        check(2_147_395_601L, 46_340);

        // Every x in [0, 10^6]
        for (long x = 0; x <= 1_000_000; x++) check(x);

        // Every perfect square from 45,000^2 to 46,340^2, with its neighbours
        for (long r = 45_000; r <= 46_341; r++) {
            for (long d = -2; d <= 2; d++) {
                long x = r * r + d;
                if (x >= 0 && x <= Integer.MAX_VALUE) check(x);
            }
        }
        // The top of the range
        for (long x = Integer.MAX_VALUE - 2000L; x <= Integer.MAX_VALUE; x++) check(x);
        // Squares and neighbours across the whole range, and powers of two
        for (long r = 1_000; r <= 46_341; r += 37) {
            check(Math.min(r * r - 1, Integer.MAX_VALUE));
            if (r * r <= Integer.MAX_VALUE) check(r * r);
        }
        for (int b = 0; b <= 30; b++) {
            check(1L << b);
            check((1L << b) - 1);
            check((1L << b) + 1);
        }

        // Random large x
        Random random = new Random(20261115L);
        for (int t = 0; t < 20_000; t++) {
            long x = 1_000_001L + (long) (random.nextDouble() * (Integer.MAX_VALUE - 1_000_001L));
            check(Math.min(x, Integer.MAX_VALUE));
        }

        System.out.println("PASS " + cases + " cases");
    }
}
