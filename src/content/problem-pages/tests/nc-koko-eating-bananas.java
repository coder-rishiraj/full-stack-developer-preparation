import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Koko Eating Bananas page.
 * References: a scan of every speed from 1 upward with a long total (small answers), and for large
 * inputs a direct check of the definition: k works, and k - 1 does not (or k = 1).
 */
class Tests {
    static final int MAX_N = 10_000;
    static final int MAX_P = 1_000_000_000;
    static final int MAX_H = 1_000_000_000;
    static int cases = 0;

    static void validate(int[] piles, int h) {
        if (piles.length < 1 || piles.length > MAX_N) throw new IllegalStateException("bad test case: n = " + piles.length);
        if (h < piles.length || h > MAX_H) throw new IllegalStateException("bad test case: h = " + h);
        for (int p : piles) if (p < 1 || p > MAX_P) throw new IllegalStateException("bad test case: pile " + p);
    }

    static long hours(int[] piles, long k) {
        long total = 0;
        for (int p : piles) total += (p + k - 1) / k;
        return total;
    }

    /** Smallest k with hours(k) <= h, found by trying every k from 1. */
    static int scan(int[] piles, int h) {
        for (int k = 1; ; k++) if (hours(piles, k) <= h) return k;
    }

    /** k is the answer exactly when k works and k - 1 does not. */
    static boolean isAnswer(int[] piles, int h, int k) {
        if (k < 1) return false;
        if (hours(piles, k) > h) return false;
        return k == 1 || hours(piles, k - 1) > h;
    }

    static void run(int[] piles, int h, int want) {
        validate(piles, h);
        if (!isAnswer(piles, h, want)) throw new IllegalStateException("bad test case: " + want + " is not the answer");
        int[] input = piles.clone();
        int got = new Solution().minEatingSpeed(input, h);
        if (!Arrays.equals(input, piles)) throw new AssertionError("piles were modified");
        if (got != want) {
            String shown = piles.length <= 20 ? Arrays.toString(piles) : "n = " + piles.length;
            throw new AssertionError(shown + ", h = " + h + ": expected " + want + " but got " + got);
        }
        cases++;
    }

    /** Small answers: compare with the scan. */
    static void check(int[] piles, int h, int expected) {
        validate(piles, h);
        int want = scan(piles, h);
        if (expected >= 0 && expected != want) throw new IllegalStateException("bad test case: expected " + expected + " should be " + want);
        run(piles, h, want);
    }

    /** Large answers: check the result against the definition only. */
    static void checkByDefinition(int[] piles, int h) {
        validate(piles, h);
        int[] input = piles.clone();
        int got = new Solution().minEatingSpeed(input, h);
        if (!Arrays.equals(input, piles)) throw new AssertionError("piles were modified");
        if (!isAnswer(piles, h, got)) {
            String shown = piles.length <= 20 ? Arrays.toString(piles) : "n = " + piles.length;
            throw new AssertionError(shown + ", h = " + h + ": got " + got + ", which is not the smallest working speed");
        }
        cases++;
    }

    static int[] filled(int n, int v) {
        int[] a = new int[n];
        Arrays.fill(a, v);
        return a;
    }

    public static void main(String[] args) {
        // Examples, dry runs and traces (sections 1, 4 and 7)
        check(new int[] {4, 9, 5}, 6, 4);
        check(new int[] {10}, 4, 3);
        check(new int[] {3, 6, 7, 11}, 8, 4);
        check(new int[] {30, 11, 23, 4, 20}, 5, 30);
        check(new int[] {30, 11, 23, 4, 20}, 6, 23);
        check(new int[] {8, 8}, 2, 8);
        check(new int[] {1, 1, 1}, 5, 1);
        check(new int[] {5}, 10, 1);
        check(new int[] {7}, 1, 7);
        // Inputs behind the claimed bugs in section 11
        check(new int[] {4, 9, 5}, 5, 5);        // testing hours == h returns 9
        check(new int[] {8, 8}, 3, 8);
        run(new int[] {MAX_P, MAX_P, 500_000_000}, MAX_H, 3);   // int total in a closed-range search returns 1
        run(new int[] {MAX_P, MAX_P, MAX_P}, MAX_H, 4);         // int total in a scan from k = 1 returns 1

        // Constraint extremes
        run(new int[] {MAX_P}, 1, MAX_P);                       // h = n: the largest pile
        run(new int[] {MAX_P}, MAX_H, 1);
        run(new int[] {MAX_P}, MAX_H - 1, 2);
        run(new int[] {1}, 1, 1);
        run(filled(MAX_N, MAX_P), MAX_N, MAX_P);                // h = n with every pile at 10^9
        run(filled(MAX_N, MAX_P), MAX_H, 10_000);               // 10^4 * ceil(10^9 / k) <= 10^9 needs k >= 10^4
        run(filled(MAX_N, 1), MAX_N, 1);
        run(filled(MAX_N, 1), MAX_H, 1);
        int[] oneBig = filled(MAX_N, 1);
        oneBig[MAX_N / 3] = MAX_P;
        run(oneBig, MAX_N, MAX_P);                              // h = n: every pile gets exactly one hour
        checkByDefinition(oneBig, MAX_N + 1);
        checkByDefinition(oneBig, MAX_H);
        checkByDefinition(filled(MAX_N, MAX_P), MAX_N + 1);
        checkByDefinition(filled(MAX_N, MAX_P), 2 * MAX_N - 1);
        checkByDefinition(filled(MAX_N, MAX_P), MAX_H - 1);
        checkByDefinition(new int[] {MAX_P, MAX_P}, 3);
        checkByDefinition(new int[] {MAX_P, MAX_P, MAX_P, MAX_P, MAX_P}, MAX_H);

        Random random = new Random(20261115L);
        // Large random inputs with large values, checked against the definition
        for (int t = 0; t < 40; t++) {
            int n = t % 4 == 0 ? MAX_N : 1 + random.nextInt(t % 2 == 0 ? 50 : MAX_N);
            int[] piles = new int[n];
            for (int i = 0; i < n; i++) piles[i] = random.nextBoolean() ? MAX_P - random.nextInt(1000) : 1 + random.nextInt(MAX_P);
            int h;
            switch (t % 3) {
                case 0: h = n; break;
                case 1: h = MAX_H - random.nextInt(1000); break;
                default: h = n + random.nextInt(MAX_H - n + 1);
            }
            checkByDefinition(piles, h);
        }
        // Random small inputs against the scan
        for (int t = 0; t < 5000; t++) {
            int n = 1 + random.nextInt(8);
            int bound = random.nextInt(4) == 0 ? 1000 : 30;
            int[] piles = new int[n];
            int max = 0;
            for (int i = 0; i < n; i++) {
                piles[i] = 1 + random.nextInt(bound);
                max = Math.max(max, piles[i]);
            }
            long total = 0;
            for (int p : piles) total += p;
            int h = n + random.nextInt((int) Math.min(total + 5, 3000) - n + 1);
            check(piles, h, -1);
        }
        // Random medium inputs against the scan
        for (int t = 0; t < 300; t++) {
            int n = 1 + random.nextInt(300);
            int[] piles = new int[n];
            for (int i = 0; i < n; i++) piles[i] = 1 + random.nextInt(2000);
            check(piles, n + random.nextInt(5 * n), -1);
        }

        System.out.println("PASS " + cases + " cases");
    }
}
