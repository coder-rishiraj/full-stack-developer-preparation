import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Concatenation of Array page (run by `npm run problems:verify`).
 * Each approach is compiled together with this file and must pass all cases.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry runs used on the page
        check(new int[] {7, 2, 9});
        check(new int[] {4, 4});
        check(new int[] {1, 2, 1});
        check(new int[] {1, 3, 2, 1});

        // Edge cases listed in section 3 and traced in section 7
        check(new int[] {5});                       // n = 1, the smallest input
        check(new int[] {1});                       // smallest value
        check(new int[] {1000});                    // largest value
        check(new int[] {1000, 1, 1000, 1});        // repeated values, both extremes

        // Largest input: n = 1000, values cycling through the whole range
        int[] big = new int[1000];
        for (int i = 0; i < big.length; i++) {
            big[i] = 1 + (i * 7) % 1000;
        }
        check(big);
        int[] allMax = new int[1000];
        Arrays.fill(allMax, 1000);
        check(allMax);

        // Random inputs checked against an independent construction
        Random random = new Random(20261113L);
        for (int t = 0; t < 2000; t++) {
            int n = 1 + random.nextInt(t < 1500 ? 12 : 1000);
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) {
                nums[i] = 1 + random.nextInt(1000);
            }
            check(nums);
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** Independent reference: position p of the answer holds nums[p mod n]. */
    static int[] expected(int[] nums) {
        int n = nums.length;
        int[] ans = new int[2 * n];
        for (int p = 0; p < 2 * n; p++) {
            ans[p] = nums[p % n];
        }
        return ans;
    }

    static void check(int[] nums) {
        String label = "nums.length=" + nums.length;
        // Guard against a wrong test: 1 <= n <= 1000 and 1 <= nums[i] <= 1000.
        if (nums.length < 1 || nums.length > 1000) {
            throw new IllegalStateException(label + ": bad test case, n out of range");
        }
        for (int x : nums) {
            if (x < 1 || x > 1000) {
                throw new IllegalStateException(label + ": bad test case, value " + x + " out of range");
            }
        }
        int[] before = nums.clone();
        int[] result = new Solution().getConcatenation(nums);
        int[] want = expected(before);
        if (!Arrays.equals(want, result)) {
            throw new AssertionError(label + ": expected " + Arrays.toString(want) + " but got " + Arrays.toString(result));
        }
        if (result == nums) {
            throw new AssertionError(label + ": returned the input array itself");
        }
        if (!Arrays.equals(before, nums)) {
            throw new AssertionError(label + ": the input array was modified");
        }
        cases++;
    }
}
