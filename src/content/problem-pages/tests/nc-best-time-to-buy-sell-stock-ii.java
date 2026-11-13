import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Best Time to Buy/Sell Stock II page
 * (run by `npm run problems:verify`). Each approach is compiled with this file and must pass.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry runs on the page, plus the official examples
        check(new int[] {3, 1, 4, 2, 6}, 7);
        check(new int[] {9, 7, 4, 2}, 0);
        check(new int[] {7, 1, 5, 3, 6, 4}, 7);
        check(new int[] {1, 2, 3, 4, 5}, 4);
        check(new int[] {7, 6, 4, 3, 1}, 0);

        // Edge cases from sections 3, 7, 10 and 11
        check(new int[] {5}, 0);                       // one day
        check(new int[] {4, 4, 4}, 0);                 // flat
        check(new int[] {2, 2}, 0);                    // plateau that hangs strict valley-to-peak
        check(new int[] {1, 2, 3, 4}, 3);              // strictly increasing
        check(new int[] {1, 5, 3, 6}, 7);              // Stock I would return 5
        check(new int[] {1, 4, 5}, 4);                 // the fee follow-up's input, without a fee
        check(new int[] {0, 10_000, 0, 10_000}, 20_000);
        check(new int[] {0}, 0);
        check(new int[] {10_000}, 0);
        check(new int[] {3, 3, 5, 5, 1, 1, 4, 4}, 5);  // plateaus at valleys and peaks
        check(new int[] {5, 3}, 0);
        check(new int[] {3, 5}, 2);

        // Largest n with value extremes
        int n = 30_000;
        int[] zigzag = new int[n];
        for (int i = 0; i < n; i++) {
            zigzag[i] = (i % 2 == 0) ? 0 : 10_000;
        }
        check(zigzag, 15_000 * 10_000);                // 1.5 * 10^8
        int[] up = new int[n];
        for (int i = 0; i < n; i++) {
            up[i] = i / 3;                             // 0..9999, non-decreasing
        }
        check(up, 9_999);
        int[] down = new int[n];
        for (int i = 0; i < n; i++) {
            down[i] = 10_000 - i / 3;
        }
        check(down, 0);
        int[] flat = new int[n];
        Arrays.fill(flat, 10_000);
        check(flat, 0);
        int[] bigRandom = new int[n];
        Random random = new Random(20261113L);
        for (int i = 0; i < n; i++) {
            bigRandom[i] = random.nextInt(10_001);
        }
        check(bigRandom, dpReference(bigRandom));

        // Small random inputs against an exhaustive search over every plan
        for (int t = 0; t < 3000; t++) {
            int len = 1 + random.nextInt(12);
            int max = random.nextBoolean() ? 5 : 10_000;
            int[] prices = new int[len];
            for (int i = 0; i < len; i++) {
                prices[i] = random.nextInt(max + 1);
            }
            int expected = exhaustive(prices, 0, false, 0);
            if (expected != dpReference(prices)) {
                throw new IllegalStateException("references disagree on " + Arrays.toString(prices));
            }
            check(prices, expected);
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** Independent reference: on each day either act (buy if empty, sell if holding) or rest. */
    static int exhaustive(int[] prices, int day, boolean holding, int cash) {
        if (day == prices.length) {
            return holding ? Integer.MIN_VALUE : cash;
        }
        int rest = exhaustive(prices, day + 1, holding, cash);
        int act = holding
                ? exhaustive(prices, day + 1, false, cash + prices[day])
                : exhaustive(prices, day + 1, true, cash - prices[day]);
        // Same-day sell-and-buy nets zero, so "sell then buy" equals "rest while holding".
        return Math.max(rest, act);
    }

    /** Second reference for large inputs: the full-table two-state DP in long arithmetic. */
    static int dpReference(int[] prices) {
        int n = prices.length;
        long[] free = new long[n];
        long[] hold = new long[n];
        free[0] = 0;
        hold[0] = -prices[0];
        for (int i = 1; i < n; i++) {
            free[i] = Math.max(free[i - 1], hold[i - 1] + prices[i]);
            hold[i] = Math.max(hold[i - 1], free[i - 1] - prices[i]);
        }
        return Math.toIntExact(free[n - 1]);
    }

    static void check(int[] prices, int expected) {
        String label = "n=" + prices.length + (prices.length <= 20 ? " " + Arrays.toString(prices) : "");
        // Guard: 1 <= n <= 3 * 10^4 and 0 <= prices[i] <= 10^4.
        if (prices.length < 1 || prices.length > 30_000) {
            throw new IllegalStateException(label + ": bad test case, n out of range");
        }
        for (int p : prices) {
            if (p < 0 || p > 10_000) {
                throw new IllegalStateException(label + ": bad test case, price " + p + " out of range");
            }
        }
        int[] before = prices.clone();
        int result = new Solution().maxProfit(prices);
        if (result != expected) {
            throw new AssertionError(label + ": expected " + expected + ", got " + result);
        }
        if (!Arrays.equals(before, prices)) {
            throw new AssertionError(label + ": the input array was modified");
        }
        cases++;
    }
}
