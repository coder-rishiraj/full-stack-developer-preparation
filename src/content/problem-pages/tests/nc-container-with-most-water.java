import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Container With Most Water page (run by `npm run problems:verify`).
 * The reference is an independent all-pairs scan written here, computed in long arithmetic.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry-run inputs used on the page
        check(new int[] {1, 8, 6, 2, 5, 4, 8, 3, 7}, 49);     // moving the taller line returns 8; max instead of min returns 56
        check(new int[] {4, 3, 2, 1, 4}, 16);
        check(new int[] {1, 3, 2, 4}, 6);

        // Edge cases listed in section 3 and traced in section 7
        check(new int[] {1, 1}, 1);                            // n = 2
        check(new int[] {0, 0}, 0);
        check(new int[] {0, 10_000}, 0);
        check(new int[] {10_000, 10_000}, 10_000);
        check(new int[] {0, 0, 0}, 0);                         // all zeros
        check(new int[] {0, 0, 7, 0}, 0);                      // all but one zero
        check(new int[] {1, 100, 100, 1}, 100);                // tall lines close together
        check(new int[] {1, 2, 3, 4, 5}, 6);                   // increasing
        check(new int[] {5, 4, 3, 2, 1}, 6);                   // decreasing
        check(new int[] {3, 3, 3, 3}, 9);                      // ties everywhere
        check(new int[] {2, 9, 1, 1, 1, 9, 2}, 36);            // the best pair sits inside, behind short ends

        // Every array of length 2..7 over heights {0, 1, 2, 3}
        for (int len = 2; len <= 7; len++) {
            int total = 1 << (2 * len);
            for (int code = 0; code < total; code++) {
                int[] h = new int[len];
                int c = code;
                for (int i = 0; i < len; i++) {
                    h[i] = c & 3;
                    c >>= 2;
                }
                check(h, reference(h));
            }
        }

        // Random small inputs against the reference
        Random random = new Random(20261113L);
        for (int t = 0; t < 3000; t++) {
            int len = 2 + random.nextInt(60);
            int maxH = random.nextBoolean() ? 10 : 10_000;
            int[] h = new int[len];
            for (int i = 0; i < len; i++) {
                h[i] = random.nextInt(maxH + 1);
            }
            check(h, reference(h));
        }

        // Largest n = 10^5 (answers known in closed form; the all-pairs reference would be too slow)
        int n = 100_000;
        int[] tall = new int[n];
        Arrays.fill(tall, 10_000);
        check(tall, 999_990_000);                              // 99,999 * 10^4: the overflow bound
        int[] increasing = new int[n];
        for (int i = 0; i < n; i++) {
            increasing[i] = i / 10;                            // 0, ..., 9,999: height[i] = floor(i / 10)
        }
        check(increasing, largestForFloorTenth(n));

        System.out.println("PASS " + cases + " cases");
    }

    /** Independent reference: every pair, in long arithmetic. */
    static int reference(int[] h) {
        long best = 0;
        for (int i = 0; i < h.length; i++) {
            for (int j = i + 1; j < h.length; j++) {
                best = Math.max(best, (long) Math.min(h[i], h[j]) * (j - i));
            }
        }
        return (int) best;
    }

    /**
     * For height[i] = floor(i / 10), the best container pairs line i with the last line (the taller one),
     * area floor(i / 10) * (n - 1 - i), maximised over i in O(n).
     */
    static int largestForFloorTenth(int n) {
        long best = 0;
        for (int i = 0; i < n - 1; i++) {
            best = Math.max(best, (long) (i / 10) * (n - 1 - i));
        }
        return (int) best;
    }

    static void check(int[] h, int expected) {
        String label = Arrays.toString(h.length <= 12 ? h : Arrays.copyOf(h, 12)) + (h.length > 12 ? "..." : "");
        // Guard against a wrong test: 2 <= n <= 10^5 and 0 <= height[i] <= 10^4.
        if (h.length < 2 || h.length > 100_000) {
            throw new IllegalStateException(label + ": bad test case, n out of range");
        }
        for (int x : h) {
            if (x < 0 || x > 10_000) {
                throw new IllegalStateException(label + ": bad test case, height " + x + " out of range");
            }
        }
        int[] given = h.clone();
        int got = new Solution().maxArea(given);
        if (got != expected) {
            throw new AssertionError(label + ": expected " + expected + ", got " + got);
        }
        if (!Arrays.equals(given, h)) {
            throw new AssertionError(label + ": the input array was modified");
        }
        cases++;
    }
}
