import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Split Array Largest Sum page (run by
 * `npm run problems:verify`). Small inputs are checked against an exhaustive search over every
 * set of cut positions; larger ones against an independent long-based DP. Zeros, k = 1, k = n
 * and n = 1000 with values 10^6 are covered.
 */
class Tests {
    static final int MAX_N = 1000;
    static final int MAX_V = 1_000_000;
    static int cases = 0;

    /** Exhaustive: every way to place k - 1 cuts in the n - 1 gaps (small n only). */
    static long brute(int[] nums, int k) {
        return brute(nums, 0, k);
    }

    static long brute(int[] nums, int start, int pieces) {
        int n = nums.length;
        if (pieces == 1) {
            long s = 0;
            for (int i = start; i < n; i++) s += nums[i];
            return s;
        }
        long best = Long.MAX_VALUE;
        long first = 0;
        // first piece is nums[start..end]; leave at least pieces - 1 elements for the rest
        for (int end = start; end <= n - pieces; end++) {
            first += nums[end];
            best = Math.min(best, Math.max(first, brute(nums, end + 1, pieces - 1)));
        }
        return best;
    }

    /** Independent DP over suffixes, in long: cur[i] = best largest sum for nums[i..n-1] in j pieces. */
    static long dp(int[] nums, int k) {
        int n = nums.length;
        long[] suffix = new long[n + 1];
        for (int i = n - 1; i >= 0; i--) suffix[i] = suffix[i + 1] + nums[i];
        long[] prev = new long[n + 1];                  // one piece: nums[i..n-1]
        for (int i = 0; i <= n; i++) prev[i] = suffix[i];
        for (int j = 2; j <= k; j++) {
            long[] cur = new long[n + 1];
            Arrays.fill(cur, Long.MAX_VALUE);
            for (int i = 0; i + j <= n; i++) {          // split nums[i..n-1] into j pieces
                for (int e = i; e + j - 1 <= n - 1; e++) {
                    long head = suffix[i] - suffix[e + 1];
                    if (head >= cur[i]) break;           // heads only grow from here
                    cur[i] = Math.min(cur[i], Math.max(head, prev[e + 1]));
                }
            }
            prev = cur;
        }
        return prev[0];
    }

    static void check(int[] nums, int k, Integer expected) {
        int n = nums.length;
        if (n < 1 || n > MAX_N) throw new IllegalStateException("bad test case: n = " + n);
        if (k < 1 || k > Math.min(50, n)) throw new IllegalStateException("bad test case: k = " + k + ", n = " + n);
        for (int v : nums) {
            if (v < 0 || v > MAX_V) throw new IllegalStateException("bad test case: value " + v);
        }
        long want = n <= 12 ? brute(nums, k) : dp(nums, k);
        if (n <= 40 && dp(nums, k) != want) throw new IllegalStateException("reference DP disagrees with brute force");
        if (expected != null && expected != want) throw new IllegalStateException("bad test case: expected " + expected + " should be " + want);
        int[] input = nums.clone();
        int got = new Solution().splitArray(input, k);
        if (!Arrays.equals(input, nums)) throw new AssertionError("nums was modified");
        if (got != want) {
            String shown = n <= 20 ? Arrays.toString(nums) : "n = " + n;
            throw new AssertionError(shown + ", k = " + k + ": expected " + want + " but got " + got);
        }
        cases++;
    }

    static void check(int[] nums, int k) {
        check(nums, k, null);
    }

    public static void main(String[] args) {
        // Examples and dry runs (sections 1, 4 and 7)
        check(new int[] {7, 2, 5, 10, 8}, 2, 18);
        check(new int[] {0, 4, 0, 0}, 3, 4);
        check(new int[] {1, 2, 3, 4, 5}, 2, 9);
        check(new int[] {1, 4, 4}, 3, 4);                 // LeetCode's example 3

        // Edge cases from section 3, traced in section 7, and inputs behind the claimed bugs
        check(new int[] {0, 0, 0}, 3, 0);
        check(new int[] {2, 4, 2, 4}, 4, 4);              // k = n; `== k` returns 12
        check(new int[] {3, 1, 4}, 1, 8);                 // k = 1
        check(new int[] {5}, 1, 5);                       // n = 1
        check(new int[] {0}, 1, 0);
        check(new int[] {1, 10}, 2, 10);                  // lo = 0 returns 1
        check(new int[] {1, 1, 1, 1000000}, 2, 1000000);  // one huge element
        check(new int[] {1000000, 0, 0, 0}, 4, 1000000);

        // Every small array over {0, 1, 2, 3} up to length 7, every k
        for (int n = 1; n <= 7; n++) {
            int total = 1;
            for (int i = 0; i < n; i++) total *= 4;
            for (int mask = 0; mask < total; mask++) {
                int[] a = new int[n];
                int m = mask;
                for (int i = 0; i < n; i++) {
                    a[i] = m % 4;
                    m /= 4;
                }
                for (int k = 1; k <= n; k++) check(a, k);
            }
        }

        // Random small arrays against the exhaustive search, many zeros and wide values
        Random random = new Random(20261115L);
        for (int t = 0; t < 3000; t++) {
            int n = 1 + random.nextInt(12);
            int[] a = new int[n];
            int bound = t % 3 == 0 ? 3 : t % 3 == 1 ? 100 : MAX_V + 1;
            for (int i = 0; i < n; i++) a[i] = random.nextInt(4) == 0 ? 0 : random.nextInt(bound);
            check(a, 1 + random.nextInt(n));
        }
        // Medium arrays against the DP
        for (int t = 0; t < 300; t++) {
            int n = 13 + random.nextInt(150);
            int[] a = new int[n];
            for (int i = 0; i < n; i++) a[i] = random.nextInt(3) == 0 ? 0 : random.nextInt(t % 2 == 0 ? 50 : MAX_V + 1);
            int k = 1 + random.nextInt(Math.min(50, n));
            check(a, k);
            check(a, 1);
            check(a, Math.min(50, n));
        }

        // Constraint extremes: n = 1000, values 10^6 (total 10^9)
        int[] full = new int[MAX_N];
        Arrays.fill(full, MAX_V);
        check(full, 1, 1_000_000_000);
        check(full, 50, 20_000_000);
        check(full, 2, 500_000_000);
        check(full, 3, 334_000_000);
        check(full, 7, 143_000_000);
        int[] zeros = new int[MAX_N];
        check(zeros, 50, 0);
        check(zeros, 1, 0);
        int[] spike = new int[MAX_N];
        spike[MAX_N / 2] = MAX_V;
        check(spike, 50, MAX_V);
        check(spike, 1, MAX_V);
        for (int t = 0; t < 6; t++) {
            int[] a = new int[MAX_N];
            for (int i = 0; i < MAX_N; i++) a[i] = t < 3 ? MAX_V - random.nextInt(10) : random.nextInt(MAX_V + 1);
            check(a, 1 + random.nextInt(50));
        }
        int[] n50 = new int[50];                          // k = n at the largest k
        for (int i = 0; i < 50; i++) n50[i] = random.nextInt(MAX_V + 1);
        check(n50, 50);

        System.out.println("PASS " + cases + " cases");
    }
}
