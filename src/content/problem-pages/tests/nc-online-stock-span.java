import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class StockSpanner" on the Online Stock Span page (run by `npm run problems:verify`).
 * Each sequence of prices is fed to a fresh StockSpanner, one next() call per price, and every returned
 * span is compared with the definition: count backwards over the whole price history (the reference
 * below), or with spans known from the shape of a large input.
 */
class Tests {
    static int cases = 0;
    static final int MAX_PRICE = 100_000;
    static final int MAX_CALLS = 10_000;

    public static void main(String[] args) {
        // The example in section 1 and the dry runs in section 4
        check(new int[] {100, 80, 60, 70, 60, 75, 85}, new int[] {1, 1, 1, 2, 1, 4, 6});

        // Edge cases from sections 3, 7 and 11
        check(new int[] {7}, new int[] {1});                                     // first call
        check(new int[] {5, 5}, new int[] {1, 2});                               // `<` returns 1, 1
        check(new int[] {5, 5, 5}, new int[] {1, 2, 3});
        check(new int[] {1, 2, 3}, new int[] {1, 2, 3});                         // increasing
        check(new int[] {5, 4, 3, 10}, new int[] {1, 1, 1, 4});                  // decreasing, then high
        check(new int[] {3, 2, 1}, new int[] {1, 1, 1});
        check(new int[] {1, MAX_PRICE, 1, MAX_PRICE}, new int[] {1, 2, 1, 4});
        check(new int[] {31, 41, 48, 59, 79}, new int[] {1, 2, 3, 4, 5});
        check(new int[] {28, 14, 28, 35, 46, 53, 66, 80, 87, 88}, new int[] {1, 1, 3, 4, 5, 6, 7, 8, 9, 10});

        // Every sequence of length 1..8 over {1, 2, 3, 100000}
        int[] alphabet = {1, 2, 3, MAX_PRICE};
        for (int len = 1; len <= 8; len++) {
            int total = 1 << (2 * len);
            for (int code = 0; code < total; code++) {
                int[] prices = new int[len];
                int c = code;
                for (int i = 0; i < len; i++) {
                    prices[i] = alphabet[c & 3];
                    c >>= 2;
                }
                check(prices, reference(prices));
            }
        }

        // Random sequences against the reference
        Random random = new Random(20261114L);
        for (int trial = 0; trial < 3_000; trial++) {
            int n = 1 + random.nextInt(trial < 2_990 ? 300 : MAX_CALLS);
            int range = trial % 3 == 0 ? 4 : MAX_PRICE;
            int[] prices = new int[n];
            for (int i = 0; i < n; i++) {
                prices[i] = 1 + random.nextInt(range);
            }
            check(prices, reference(prices));
        }

        // Largest inputs: 10^4 calls
        int[] decreasingThenMax = new int[MAX_CALLS];                            // 9,999 decreasing, then 10^5
        int[] expected = new int[MAX_CALLS];
        for (int i = 0; i < MAX_CALLS - 1; i++) {
            decreasingThenMax[i] = MAX_PRICE - 1 - i;
            expected[i] = 1;
        }
        decreasingThenMax[MAX_CALLS - 1] = MAX_PRICE;
        expected[MAX_CALLS - 1] = MAX_CALLS;
        check(decreasingThenMax, expected);
        int[] increasing = new int[MAX_CALLS];
        int[] equal = new int[MAX_CALLS];
        int[] counting = new int[MAX_CALLS];
        for (int i = 0; i < MAX_CALLS; i++) {
            increasing[i] = 1 + i * 10;
            equal[i] = MAX_PRICE;
            counting[i] = i + 1;
        }
        check(increasing, counting);
        check(equal, counting);
        int[] sawtooth = new int[MAX_CALLS];                                     // 10, 9, ..., 1, 10, 9, ...
        for (int i = 0; i < MAX_CALLS; i++) {
            sawtooth[i] = 10 - i % 10;
        }
        check(sawtooth, reference(sawtooth));

        System.out.println("PASS " + cases + " cases");
    }

    /** Direct definition: for each day, count backwards over the whole history while the price is <= today's. */
    static int[] reference(int[] prices) {
        int[] spans = new int[prices.length];
        for (int day = 0; day < prices.length; day++) {
            int count = 0;
            for (int j = day; j >= 0 && prices[j] <= prices[day]; j--) {
                count++;
            }
            spans[day] = count;
        }
        return spans;
    }

    static void check(int[] prices, int[] expected) {
        String label = Arrays.toString(prices.length <= 12 ? prices : Arrays.copyOf(prices, 12))
                + (prices.length > 12 ? "...(calls=" + prices.length + ")" : "");
        // Guard against a wrong test: 1 <= price <= 10^5 and at most 10^4 calls.
        if (prices.length < 1 || prices.length > MAX_CALLS) {
            throw new IllegalStateException(label + ": bad test case, call count out of range");
        }
        for (int p : prices) {
            if (p < 1 || p > MAX_PRICE) {
                throw new IllegalStateException(label + ": bad test case, price " + p + " out of range");
            }
        }
        if (expected.length != prices.length) {
            throw new IllegalStateException(label + ": bad test case, expected has the wrong length");
        }
        StockSpanner spanner = new StockSpanner();
        for (int day = 0; day < prices.length; day++) {
            int got = spanner.next(prices[day]);
            if (got != expected[day]) {
                throw new AssertionError(label + ": call " + (day + 1) + " next(" + prices[day] + ") expected "
                        + expected[day] + ", got " + got);
            }
        }
        cases++;
    }
}
