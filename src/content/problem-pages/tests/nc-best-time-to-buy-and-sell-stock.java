import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Best Time to Buy and Sell Stock page (run by `npm run problems:verify`).
 * Each approach is compiled together with this file and must pass all cases.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry runs
        check(new int[] {4, 9, 1, 7, 2}, 6);
        check(new int[] {9, 6, 6, 2}, 0);

        // Edge cases from sections 3, 7 and 11
        check(new int[] {5}, 0);                        // one day
        check(new int[] {3, 5, 1, 4}, 3);               // late minimum before a rise
        check(new int[] {2, 2, 2}, 0);                  // all equal
        check(new int[] {9, 6, 2}, 0);                  // strictly falling
        check(new int[] {0, 10_000}, 10_000);           // largest possible profit
        check(new int[] {10_000, 0}, 0);
        check(new int[] {1, 2}, 1);

        // Largest inputs, n = 10^5
        int n = 100_000;
        int[] falling = new int[n];
        for (int i = 0; i < n; i++) {
            falling[i] = 10_000 - (int) ((long) i * 10_000 / n);
        }
        check(falling, 0);
        int[] zigzag = new int[n];
        for (int i = 0; i < n; i++) {
            zigzag[i] = (i % 2 == 0) ? 10_000 - i / 10 : i / 10;  // max rise found late
        }
        check(zigzag, reference(zigzag));

        // Random inputs against an independent reference
        Random random = new Random(20261114L);
        for (int r = 0; r < 4000; r++) {
            int length = 1 + random.nextInt(20);
            int range = 1 + random.nextInt(r % 2 == 0 ? 10 : 10_000);
            int[] prices = new int[length];
            for (int i = 0; i < length; i++) {
                prices[i] = random.nextInt(Math.min(range, 10_000) + 1);
            }
            check(prices, bruteForce(prices));
        }

        System.out.println("PASS " + cases + " cases");
    }

    static int bruteForce(int[] prices) {
        int best = 0;
        for (int i = 0; i < prices.length; i++) {
            for (int j = i + 1; j < prices.length; j++) {
                best = Math.max(best, prices[j] - prices[i]);
            }
        }
        return best;
    }

    /** Suffix maximum: best sell price after each buy day (independent of the page's prefix minimum). */
    static int reference(int[] prices) {
        int best = 0;
        int suffixMax = prices[prices.length - 1];
        for (int i = prices.length - 2; i >= 0; i--) {
            best = Math.max(best, suffixMax - prices[i]);
            suffixMax = Math.max(suffixMax, prices[i]);
        }
        return best;
    }

    static void check(int[] prices, int expected) {
        String label = "n=" + prices.length + (prices.length <= 20 ? " " + Arrays.toString(prices) : "");
        if (prices.length < 1 || prices.length > 100_000) {
            throw new IllegalStateException(label + ": bad test case, length out of range");
        }
        for (int p : prices) {
            if (p < 0 || p > 10_000) {
                throw new IllegalStateException(label + ": bad test case, price out of range");
            }
        }
        if (reference(prices) != expected) {
            throw new IllegalStateException(label + ": bad test case, expected value is wrong");
        }
        int[] before = prices.clone();
        int result = new Solution().maxProfit(prices);
        if (result != expected) {
            throw new AssertionError(label + ": expected " + expected + " but got " + result);
        }
        if (!Arrays.equals(before, prices)) {
            throw new AssertionError(label + ": the input array was modified");
        }
        cases++;
    }
}
