import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Largest Rectangle in Histogram page (run by
 * `npm run problems:verify`). Small inputs are checked against an O(n^3) reference that tries every
 * pair (i, j) and recomputes the minimum from scratch; large structured inputs against closed forms;
 * large random inputs against an extent-jumping reference that uses no stack. All references use long.
 */
class Tests {
    static int cases = 0;
    static final int N = 100_000;
    static final int H = 10_000;

    public static void main(String[] args) {
        // Examples and dry-run inputs used on the page
        check(new int[] {2, 1, 5, 6, 2, 3}, 10);
        check(new int[] {2, 4}, 4);

        // Edge cases listed in section 3 and traced in section 7
        check(new int[] {7}, 7);                       // n = 1
        check(new int[] {0}, 0);
        check(new int[] {H}, H);
        check(new int[] {1, 2, 3, 4, 5}, 9);           // increasing: no pops until the sentinel
        check(new int[] {5, 4, 3, 2, 1}, 9);           // decreasing: every bar pops the previous one
        check(new int[] {3, 3, 3, 3}, 12);             // all equal
        check(new int[] {2, 2}, 4);                    // both-sides-non-strict boundaries return 2
        check(new int[] {0, 0, 0}, 0);                 // all zeros
        check(new int[] {2, 0, 2}, 2);                 // a zero splits the histogram
        check(new int[] {2, 1, 2}, 3);                 // the lowest bar spans everything
        check(new int[] {4, 2, 0, 3, 2, 5}, 6);        // trapping-rain-water example 2
        check(new int[] {6, 2, 5, 4, 5, 1, 6}, 12);
        check(new int[] {1, 3, 2, 3, 1}, 6);           // equal heights separated by a lower bar

        // Every array of length 1..7 over heights {0, 1, 2, 3}
        for (int len = 1; len <= 7; len++) {
            int total = 1 << (2 * len);
            for (int code = 0; code < total; code++) {
                int[] h = new int[len];
                int c = code;
                for (int i = 0; i < len; i++) {
                    h[i] = c & 3;
                    c >>= 2;
                }
                check(h, cubic(h));
            }
        }

        // Random small inputs against the cubic reference, few distinct heights (many ties) and many
        Random random = new Random(20261114L);
        for (int t = 0; t < 3000; t++) {
            int len = 1 + random.nextInt(60);
            int maxH = t % 2 == 0 ? 1 + random.nextInt(4) : H;
            int[] h = new int[len];
            for (int i = 0; i < len; i++) {
                h[i] = random.nextInt(maxH + 1);
            }
            check(h, cubic(h));
        }

        // Largest n = 10^5
        int[] allMax = new int[N];
        Arrays.fill(allMax, H);
        check(allMax, 1_000_000_000);                  // 10^5 * 10^4 = 10^9: the largest possible answer
        check(new int[N], 0);                          // all zeros
        int[] increasing = new int[N];
        for (int i = 0; i < N; i++) {
            increasing[i] = i / 10;                    // 0, 0, ..., 9999 (non-decreasing, runs of 10)
        }
        check(increasing, nonDecreasing(increasing));
        int[] decreasing = new int[N];
        for (int i = 0; i < N; i++) {
            decreasing[i] = H - i / 10;                // 10000 down to 1
        }
        check(decreasing, nonIncreasing(decreasing));
        int[] randomLarge = new int[N];
        for (int i = 0; i < N; i++) {
            randomLarge[i] = random.nextInt(H + 1);
        }
        check(randomLarge, jumping(randomLarge));

        System.out.println("PASS " + cases + " cases");
    }

    /** Every pair (i, j), minimum recomputed from scratch: O(n^3). */
    static int cubic(int[] h) {
        long best = 0;
        for (int i = 0; i < h.length; i++) {
            for (int j = i; j < h.length; j++) {
                long min = Long.MAX_VALUE;
                for (int k = i; k <= j; k++) {
                    min = Math.min(min, h[k]);
                }
                best = Math.max(best, min * (j - i + 1));
            }
        }
        return (int) best;
    }

    /** Non-decreasing heights: the best rectangle starting at i runs to the end at height h[i]. */
    static int nonDecreasing(int[] h) {
        long best = 0;
        for (int i = 0; i < h.length; i++) {
            best = Math.max(best, (long) h[i] * (h.length - i));
        }
        return (int) best;
    }

    /** Non-increasing heights: the best rectangle ending at i starts at 0 at height h[i]. */
    static int nonIncreasing(int[] h) {
        long best = 0;
        for (int i = 0; i < h.length; i++) {
            best = Math.max(best, (long) h[i] * (i + 1));
        }
        return (int) best;
    }

    /** Extents by jumping over already-known extents (no stack): left[i] is the last index < i lower than h[i]. */
    static int jumping(int[] h) {
        int n = h.length;
        int[] left = new int[n];
        int[] right = new int[n];
        for (int i = 0; i < n; i++) {
            int p = i - 1;
            while (p >= 0 && h[p] >= h[i]) {
                p = left[p];
            }
            left[i] = p;
        }
        for (int i = n - 1; i >= 0; i--) {
            int p = i + 1;
            while (p < n && h[p] >= h[i]) {
                p = right[p];
            }
            right[i] = p;
        }
        long best = 0;
        for (int i = 0; i < n; i++) {
            best = Math.max(best, (long) h[i] * (right[i] - left[i] - 1));
        }
        return (int) best;
    }

    static void check(int[] h, int expected) {
        String label = Arrays.toString(h.length <= 12 ? h : Arrays.copyOf(h, 12)) + (h.length > 12 ? "..." : "");
        // Guard against a wrong test: 1 <= n <= 10^5 and 0 <= heights[i] <= 10^4.
        if (h.length < 1 || h.length > N) {
            throw new IllegalStateException(label + ": bad test case, n out of range");
        }
        for (int x : h) {
            if (x < 0 || x > H) {
                throw new IllegalStateException(label + ": bad test case, height " + x + " out of range");
            }
        }
        int[] given = h.clone();
        int got = new Solution().largestRectangleArea(given);
        if (got != expected) {
            throw new AssertionError(label + ": expected " + expected + ", got " + got);
        }
        if (!Arrays.equals(given, h)) {
            throw new AssertionError(label + ": the input array was modified");
        }
        cases++;
    }
}
