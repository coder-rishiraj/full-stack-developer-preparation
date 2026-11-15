import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Search Insert Position page (run by `npm run problems:verify`).
 * The expected answer comes from an independent linear scan (first index whose value is
 * >= target, or n), and the test also checks that the method did not modify the array.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples from section 1 and the dry runs in section 4
        int[] example = {2, 5, 8, 11, 14};
        check(example, 9);           // between 8 and 11: 3
        check(example, 11);          // present: 3
        check(example, 16);          // larger than everything: 5 (= n)
        check(example, 1);           // smaller than everything: 0
        check(example, 2);           // equal to the first: 0
        check(example, 14);          // equal to the last: 4

        // Edge cases from section 3, traced in section 7
        check(new int[] {7}, 7);     // one element: found
        check(new int[] {7}, 3);     // one element: insert before
        check(new int[] {7}, 9);     // one element: insert after, answer n = 1
        check(new int[] {4, 6}, 5);
        check(new int[] {4, 6}, 4);
        check(new int[] {4, 6}, 6);
        check(new int[] {4, 6}, 7);
        check(new int[] {-10_000, 10_000}, -10_000);   // value extremes are inclusive here
        check(new int[] {-10_000, 10_000}, 10_000);
        check(new int[] {-10_000, 10_000}, 0);
        check(new int[] {-9_999}, -10_000);
        check(new int[] {9_999}, 10_000);

        // Largest input: n = 10^4, every target from -10^4 to 10^4
        int[] big = new int[10_000];
        for (int i = 0; i < big.length; i++) {
            big[i] = -9_999 + 2 * i;  // -9999, -9997, ..., 9999: every gap and both ends
        }
        for (int t = -10_000; t <= 10_000; t++) {
            check(big, t);
        }

        // Random sorted arrays of distinct values against the linear scan
        Random random = new Random(20261114L);
        for (int t = 0; t < 4000; t++) {
            int n = 1 + random.nextInt(t < 3000 ? 12 : 3000);
            int[] nums = randomSorted(random, n);
            int target = random.nextBoolean() ? nums[random.nextInt(n)] : -10_000 + random.nextInt(20_001);
            check(nums, target);
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** n distinct values from [-10^4, 10^4], sorted ascending. */
    static int[] randomSorted(Random random, int n) {
        boolean[] used = new boolean[20_001];
        int[] out = new int[n];
        int k = 0;
        while (k < n) {
            int v = random.nextInt(20_001);
            if (!used[v]) {
                used[v] = true;
                out[k++] = v - 10_000;
            }
        }
        Arrays.sort(out);
        return out;
    }

    static void check(int[] nums, int target) {
        String label = nums.length > 20 ? "length " + nums.length + ", target " + target : Arrays.toString(nums) + ", target " + target;
        // Guard against a wrong test: 1 <= n <= 10^4, distinct ascending values, all in [-10^4, 10^4].
        if (nums.length < 1 || nums.length > 10_000) {
            throw new IllegalStateException(label + ": bad test case, length outside the constraints");
        }
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] < -10_000 || nums[i] > 10_000 || (i > 0 && nums[i - 1] >= nums[i])) {
                throw new IllegalStateException(label + ": bad test case, values must be distinct, ascending and in [-10^4, 10^4]");
            }
        }
        if (target < -10_000 || target > 10_000) {
            throw new IllegalStateException(label + ": bad test case, target outside [-10^4, 10^4]");
        }
        int expected = nums.length;
        for (int i = nums.length - 1; i >= 0; i--) {
            if (nums[i] >= target) {
                expected = i;
            }
        }
        int[] copy = nums.clone();
        int actual = new Solution().searchInsert(nums, target);
        if (actual != expected) {
            throw new AssertionError(label + ": got " + actual + ", expected " + expected);
        }
        if (!Arrays.equals(copy, nums)) {
            throw new AssertionError(label + ": the input array was modified");
        }
        cases++;
    }
}
