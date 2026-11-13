import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Contains Duplicate page (run by `npm run problems:verify`).
 * Each approach is compiled together with this file and must pass all cases.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry runs used on the page
        check(new int[] {4, 9, 2, 9}, true);
        check(new int[] {5, -1, 0, 3}, false);

        // Edge cases listed in section 3 and traced in section 7
        check(new int[] {7}, false);                       // a single element
        check(new int[] {7, 7}, true);                     // smallest input with a duplicate
        check(new int[] {6, 1, 8, 3, 6}, true);            // duplicate at the two ends
        check(new int[] {2, 2, 2, 2}, true);               // every value equal
        check(new int[] {-3, 3, 0}, false);                // same absolute value is not a duplicate
        check(new int[] {0, -1, 0}, true);                 // zero repeated
        check(new int[] {1, 2, 3, 4, 5, 6}, false);        // all distinct: the whole array must be read

        // Value extremes
        check(new int[] {-1_000_000_000, 1_000_000_000}, false);
        check(new int[] {1_000_000_000, -1_000_000_000, 1_000_000_000}, true);
        check(new int[] {-1_000_000_000, 0, -1_000_000_000}, true);

        // Largest input, n = 10^5
        int n = 100_000;
        int[] distinct = new int[n];
        for (int i = 0; i < n; i++) {
            distinct[i] = -1_000_000_000 + i * 20_000;     // stays inside [-10^9, 10^9]
        }
        shuffle(distinct, new Random(7L));
        check(distinct, false);                            // worst case: no duplicate at all
        int[] endsEqual = distinct.clone();
        endsEqual[n - 1] = endsEqual[0];
        check(endsEqual, true);                            // the only duplicate is first and last
        int[] allSame = new int[n];
        Arrays.fill(allSame, 1_000_000_000);
        check(allSame, true);

        // Random inputs checked against an independent brute force
        Random random = new Random(20261113L);
        for (int r = 0; r < 3000; r++) {
            int length = 1 + random.nextInt(15);
            int range = 1 + random.nextInt(30);            // small ranges make duplicates likely
            int[] nums = new int[length];
            for (int i = 0; i < length; i++) {
                nums[i] = random.nextInt(2 * range + 1) - range;
            }
            check(nums, bruteForce(nums));
        }

        System.out.println("PASS " + cases + " cases");
    }

    static boolean bruteForce(int[] nums) {
        int[] sorted = nums.clone();
        Arrays.sort(sorted);
        for (int i = 1; i < sorted.length; i++) {
            if (sorted[i] == sorted[i - 1]) {
                return true;
            }
        }
        return false;
    }

    static void shuffle(int[] a, Random random) {
        for (int i = a.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            int t = a[i];
            a[i] = a[j];
            a[j] = t;
        }
    }

    static void check(int[] nums, boolean expected) {
        String label = "nums.length=" + nums.length + (nums.length <= 20 ? " " + Arrays.toString(nums) : "");
        // Guard against a wrong test: the input must respect the stated constraints.
        if (nums.length < 1 || nums.length > 100_000) {
            throw new IllegalStateException(label + ": bad test case, length out of range");
        }
        for (int x : nums) {
            if (x < -1_000_000_000 || x > 1_000_000_000) {
                throw new IllegalStateException(label + ": bad test case, value out of range");
            }
        }
        if (bruteForce(nums) != expected) {
            throw new IllegalStateException(label + ": bad test case, expected value is wrong");
        }
        int[] before = nums.clone();
        boolean result = new Solution().containsDuplicate(nums);
        if (result != expected) {
            throw new AssertionError(label + ": expected " + expected + " but got " + result);
        }
        if (!Arrays.equals(before, nums)) {
            throw new AssertionError(label + ": the input array was modified");
        }
        cases++;
    }
}
