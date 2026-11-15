import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Capacity to Ship Packages Within D Days page.
 * References: an exhaustive search over all day boundaries (small n), an O(days * n^2) DP that knows
 * nothing about greedy loading or binary search (medium n), closed forms at the constraint extremes,
 * and a plain scan of capacities from the heaviest package (large n with small answers).
 */
class Tests {
    static final int MAX_N = 50_000;
    static int cases = 0;

    static void validate(int[] w, int days) {
        if (w.length < 1 || w.length > MAX_N) throw new IllegalStateException("bad test case: n = " + w.length);
        if (days < 1 || days > w.length) throw new IllegalStateException("bad test case: days = " + days);
        for (int x : w) if (x < 1 || x > 500) throw new IllegalStateException("bad test case: weight " + x);
    }

    /** Every set of cut positions with at most days - 1 cuts. */
    static int exhaustive(int[] w, int days) {
        int n = w.length, best = Integer.MAX_VALUE;
        for (int mask = 0; mask < (1 << (n - 1)); mask++) {
            if (Integer.bitCount(mask) + 1 > days) continue;
            int cur = 0, worst = 0;
            for (int i = 0; i < n; i++) {
                cur += w[i];
                if (i == n - 1 || ((mask >> i) & 1) == 1) {
                    worst = Math.max(worst, cur);
                    cur = 0;
                }
            }
            best = Math.min(best, worst);
        }
        return best;
    }

    /** dp[j][i] = least possible heaviest day when the first i packages use at most j days. */
    static int dp(int[] w, int days) {
        int n = w.length;
        long[] prefix = new long[n + 1];
        for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + w[i];
        long[] prev = new long[n + 1];
        Arrays.fill(prev, Long.MAX_VALUE);
        prev[0] = 0;
        for (int j = 1; j <= days; j++) {
            long[] cur = new long[n + 1];
            cur[0] = 0;
            for (int i = 1; i <= n; i++) {
                long best = prev[i]; // fewer days are allowed
                for (int p = 0; p < i; p++) {
                    if (prev[p] == Long.MAX_VALUE) continue;
                    best = Math.min(best, Math.max(prev[p], prefix[i] - prefix[p]));
                }
                cur[i] = best;
            }
            prev = cur;
        }
        return (int) prev[n];
    }

    static int plainScan(int[] w, int days) {
        int cap = 0;
        for (int x : w) cap = Math.max(cap, x);
        while (true) {
            int used = 1, load = 0;
            for (int x : w) {
                if (load + x > cap) { used++; load = 0; }
                load += x;
            }
            if (used <= days) return cap;
            cap++;
        }
    }

    static void run(int[] w, int days, int want) {
        validate(w, days);
        int[] input = w.clone();
        int got = new Solution().shipWithinDays(input, days);
        if (!Arrays.equals(input, w)) throw new AssertionError("weights were modified");
        if (got != want) {
            String shown = w.length <= 20 ? Arrays.toString(w) : "n = " + w.length;
            throw new AssertionError(shown + ", days = " + days + ": expected " + want + " but got " + got);
        }
        cases++;
    }

    static void check(int[] w, int days, int expected) {
        validate(w, days);
        int want = w.length <= 14 ? exhaustive(w, days) : dp(w, days);
        if (w.length <= 14 && dp(w, days) != want) throw new IllegalStateException("references disagree");
        if (expected >= 0 && expected != want) throw new IllegalStateException("bad test case: expected " + expected + " should be " + want);
        run(w, days, want);
    }

    static int[] filled(int n, int v) {
        int[] a = new int[n];
        Arrays.fill(a, v);
        return a;
    }

    public static void main(String[] args) {
        // Examples, dry runs and traces (sections 1, 4 and 7)
        check(new int[] {3, 2, 2, 4, 1, 4}, 3, 6);
        check(new int[] {1, 2, 3, 1, 1}, 4, 3);
        check(new int[] {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}, 5, 15);
        check(new int[] {5, 1, 4}, 1, 10);
        check(new int[] {4, 9, 2}, 3, 9);
        check(new int[] {7}, 1, 7);
        check(new int[] {2, 2, 2, 2, 2}, 2, 6);
        // Inputs behind the claimed bugs in section 11
        check(new int[] {1, 10}, 2, 10);
        check(new int[] {2, 4, 2, 4}, 4, 4);
        // Heavy package among light ones
        check(new int[] {1, 1, 1, 500, 1, 1}, 2, 502);
        check(new int[] {500, 1, 1, 1, 1}, 5, 500);

        // Constraint extremes (n = 5 * 10^4, weights 500): closed forms
        run(filled(MAX_N, 500), 1, 25_000_000);         // total 2.5 * 10^7
        run(filled(MAX_N, 500), MAX_N, 500);
        run(filled(MAX_N, 1), 1, MAX_N);
        run(filled(MAX_N, 500), 7, 500 * 7143);           // ceil(50000 / 7) = 7143 packages on some day
        run(filled(MAX_N, 3), 2, 3 * 25_000);
        int[] oneHeavy = filled(MAX_N, 1);
        oneHeavy[MAX_N / 2] = 500;
        run(oneHeavy, MAX_N, 500);
        run(oneHeavy, 1, MAX_N - 1 + 500);

        Random random = new Random(20261114L);
        // Large random inputs with small answers, against the plain scan
        for (int t = 0; t < 3; t++) {
            int[] w = new int[MAX_N];
            for (int i = 0; i < MAX_N; i++) w[i] = 1 + random.nextInt(500);
            int days = MAX_N / (2 + t);
            run(w, days, plainScan(w, days));
        }

        // Random small inputs against the exhaustive search (and the DP)
        for (int t = 0; t < 4000; t++) {
            int n = 1 + random.nextInt(12);
            int bound = random.nextInt(3) == 0 ? 500 : 6;
            int[] w = new int[n];
            for (int i = 0; i < n; i++) w[i] = 1 + random.nextInt(bound);
            check(w, 1 + random.nextInt(n), -1);
        }
        // Random medium inputs against the DP
        for (int t = 0; t < 150; t++) {
            int n = 15 + random.nextInt(120);
            int[] w = new int[n];
            for (int i = 0; i < n; i++) w[i] = 1 + random.nextInt(random.nextBoolean() ? 500 : 10);
            check(w, 1 + random.nextInt(Math.min(n, 20)), -1);
        }

        System.out.println("PASS " + cases + " cases");
    }
}
