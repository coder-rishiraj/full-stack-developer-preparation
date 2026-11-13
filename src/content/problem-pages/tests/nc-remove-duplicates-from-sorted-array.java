import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Remove Duplicates from Sorted Array page (run by
 * `npm run problems:verify`). Each solution is compiled together with this file and must pass.
 * The check mimics LeetCode's custom judge: the returned k must equal the number of distinct
 * values, and nums[0 .. k-1] must equal those values in sorted order, slot by slot. Slots from
 * k on are ignored.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry runs on the page
        check(new int[] {1, 1, 2, 3, 3});
        check(new int[] {-2, -2, 0, 3, 3, 3});
        // LeetCode's examples
        check(new int[] {1, 1, 2});
        check(new int[] {0, 0, 1, 1, 1, 2, 2, 3, 3, 4});

        // Edge cases from sections 3 and 7, and the bug inputs from sections 9 and 11
        check(new int[] {7});                          // single element
        check(new int[] {-100});
        check(new int[] {100});
        check(new int[] {4, 4, 4, 4});                 // all equal
        check(new int[] {-100, 0, 100});               // already distinct
        check(new int[] {1, 2, 2});                    // duplicates only at the end; comparing with nums[write] fails here
        check(new int[] {1, 1, 2, 3});                 // duplicates only at the start
        check(new int[] {-100, -100, 100, 100});       // value bounds

        // Constraint extremes: n = 3 * 10^4
        int[] same = new int[30000];
        Arrays.fill(same, -100);
        check(same);
        int[] allValues = new int[30000];
        for (int i = 0; i < allValues.length; i++) allValues[i] = -100 + (int) ((long) i * 201 / 30000);
        check(allValues);                              // every value from -100 to 100, long runs
        int[] distinct = new int[201];
        for (int i = 0; i < 201; i++) distinct[i] = i - 100;
        check(distinct);                               // k = 201, nothing moves

        // Random sorted inputs against an independent reference
        Random random = new Random(20261113L);
        for (int t = 0; t < 3000; t++) {
            int n = 1 + random.nextInt(t < 2000 ? 12 : 30000);
            int lo = -100 + random.nextInt(201);
            int hi = lo + random.nextInt(101 - lo);     // value range [lo, hi] inside [-100, 100]
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) nums[i] = lo + random.nextInt(hi - lo + 1);
            Arrays.sort(nums);
            check(nums);
        }

        System.out.println("PASS " + cases + " cases");
    }

    static void check(int[] nums) {
        String label = nums.length <= 20 ? Arrays.toString(nums) : ("array of length " + nums.length);
        // Guard against a wrong test case: 1 <= n <= 3*10^4, -100 <= nums[i] <= 100, sorted.
        if (nums.length < 1 || nums.length > 30000) {
            throw new IllegalStateException(label + ": bad test case, length outside the constraints");
        }
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] < -100 || nums[i] > 100) throw new IllegalStateException(label + ": bad test case, value out of range");
            if (i > 0 && nums[i - 1] > nums[i]) throw new IllegalStateException(label + ": bad test case, not sorted");
        }
        // Independent reference: presence table over the value range, read in increasing order.
        boolean[] present = new boolean[201];
        for (int x : nums) present[x + 100] = true;
        int[] expected = new int[201];
        int count = 0;
        for (int v = 0; v < 201; v++) if (present[v]) expected[count++] = v - 100;
        expected = Arrays.copyOf(expected, count);

        int k = new Solution().removeDuplicates(nums);

        if (k != expected.length) {
            throw new AssertionError(label + ": expected k=" + expected.length + " but got " + k);
        }
        int[] firstK = Arrays.copyOf(nums, k);
        if (!Arrays.equals(expected, firstK)) {
            throw new AssertionError(label + ": first k slots are " + Arrays.toString(firstK) + " but should be " + Arrays.toString(expected));
        }
        cases++;
    }
}
