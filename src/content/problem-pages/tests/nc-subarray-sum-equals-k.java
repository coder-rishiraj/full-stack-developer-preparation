import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Subarray Sum Equals K page (run by `npm run problems:verify`).
 * Each approach is compiled together with this file and must pass all cases. Expected counts come from
 * an independent O(n^2) brute force over prefix sums, computed in long.
 */
class Tests {
    static final int MAX_N = 20_000;
    static int cases = 0;

    static long reference(int[] nums, int k) {
        int n = nums.length;
        long[] prefix = new long[n + 1];
        for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
        long count = 0;
        for (int j = 1; j <= n; j++) {
            for (int i = 0; i < j; i++) {
                if (prefix[j] - prefix[i] == k) count++;
            }
        }
        return count;
    }

    static void check(int[] nums, int k, long expected) {
        if (nums.length < 1 || nums.length > MAX_N) throw new IllegalStateException("bad test case: n = " + nums.length);
        for (int v : nums) {
            if (v < -1000 || v > 1000) throw new IllegalStateException("bad test case: value " + v);
        }
        if (k < -10_000_000 || k > 10_000_000) throw new IllegalStateException("bad test case: k = " + k);
        long want = reference(nums, k);
        if (expected >= 0 && expected != want) {
            throw new IllegalStateException("bad test case: expected " + expected + " should be " + want);
        }
        int[] input = nums.clone();
        int got = new Solution().subarraySum(input, k);
        if (!Arrays.equals(input, nums)) throw new AssertionError("nums was modified");
        if (got != want) {
            String shown = nums.length <= 20 ? Arrays.toString(nums) : "n = " + nums.length;
            throw new AssertionError(shown + ", k = " + k + ": expected " + want + " but got " + got);
        }
        cases++;
    }

    static void check(int[] nums, int k) {
        check(nums, k, -1);
    }

    public static void main(String[] args) {
        // Examples and dry runs (sections 1, 4 and 7)
        check(new int[] {1, 2, 3}, 3, 2);
        check(new int[] {1, -1, 1, -1}, 0, 4);
        check(new int[] {1, 1, 1}, 2, 2);
        check(new int[] {1, 2, 1, -1, 2, 1}, 3, 5);

        // Edge cases from section 3, traced in section 7, and the inputs behind the claimed bugs
        check(new int[] {1, 2, 3}, 0, 0);          // k = 0: no empty subarray (insert-first bug gives 3)
        check(new int[] {5, -3, 1}, 3, 1);         // negatives: a sliding window gives 0
        check(new int[] {0, 0, 0}, 0, 6);          // all zeros: every subarray (set bug and window give 3)
        check(new int[] {1, -1, 1}, 1, 3);
        check(new int[] {-7}, -7, 1);              // single element equal to k
        check(new int[] {-7}, 7, 0);               // single element, no match
        check(new int[] {0}, 0, 1);
        check(new int[] {3, 4, 7, 2, -3, 1, 4, 2}, 7, 4);
        check(new int[] {-1, -1, 1}, 0, 1);
        check(new int[] {2, -2, 2, -2}, 0, 4);
        check(new int[] {1000, -1000, 1000}, 1000, 3);
        check(new int[] {5, 5}, 10_000_000, 0);    // k at its bound, unreachable
        check(new int[] {5, 5}, -10_000_000, 0);

        // Largest answer: n = 2 * 10^4 zeros with k = 0 gives n(n+1)/2 = 200,010,000
        check(new int[MAX_N], 0, 200_010_000L);

        // Prefix sums at the bounds: 10^4 copies of +-1000 reach k = +-10^7 exactly once
        int[] plus = new int[10_000];
        Arrays.fill(plus, 1000);
        check(plus, 10_000_000, 1);
        int[] minus = new int[10_000];
        Arrays.fill(minus, -1000);
        check(minus, -10_000_000, 1);
        // n = 2 * 10^4 of 1000: prefix sums reach 2 * 10^7; k = 10^7 matches every window of 10^4 elements
        int[] full = new int[MAX_N];
        Arrays.fill(full, 1000);
        check(full, 10_000_000, 10_001);
        check(full, 1000, MAX_N);

        // Large random inputs: small values (many matches) and full-range values
        Random random = new Random(20261113L);
        for (int t = 0; t < 3; t++) {
            int[] nums = new int[MAX_N];
            int bound = t == 0 ? 1 : (t == 1 ? 3 : 1000);
            for (int i = 0; i < MAX_N; i++) nums[i] = random.nextInt(2 * bound + 1) - bound;
            check(nums, t == 2 ? random.nextInt(2001) - 1000 : random.nextInt(5) - 2);
        }

        // Random small inputs against the reference, including k = 0 and negative k
        for (int t = 0; t < 5000; t++) {
            int n = 1 + random.nextInt(t < 4000 ? 12 : 200);
            int bound = random.nextInt(3) == 0 ? 1000 : 3;
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) nums[i] = random.nextInt(2 * bound + 1) - bound;
            int k;
            switch (random.nextInt(3)) {
                case 0:
                    k = 0;
                    break;
                case 1:
                    k = random.nextInt(2 * bound + 1) - bound;
                    break;
                default: {
                    int i = random.nextInt(n), j = i + random.nextInt(n - i); // a k that some subarray reaches
                    int s = 0;
                    for (int x = i; x <= j; x++) s += nums[x];
                    k = s;
                }
            }
            check(nums, k);
        }

        System.out.println("PASS " + cases + " cases");
    }
}
