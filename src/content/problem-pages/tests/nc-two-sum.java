import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Two Sum page (run by `npm run problems:verify`).
 * Each approach is compiled together with this file and must pass all cases.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry runs used on the page
        check(new int[] {5, 1, 8, 3}, 11, 2, 3);
        check(new int[] {4, 6, 2}, 8, 1, 2);

        // Edge cases listed in section 3 and traced in section 7
        check(new int[] {4, 4}, 8, 0, 1);                 // smallest input, equal values
        check(new int[] {-3, 7, 1}, 4, 0, 1);             // negatives
        check(new int[] {0, 5, 0}, 0, 0, 2);              // zeros, answer uses the last element
        check(new int[] {1, 2}, 3, 0, 1);                 // two elements
        check(new int[] {9, 1, 4, 4}, 8, 2, 3);           // equal pair is not at the front
        check(new int[] {3, 3, 5, 2}, 6, 0, 1);           // duplicate value overwritten after use
        check(new int[] {2, 2, 7, 1}, 8, 2, 3);           // duplicate value that is not in the answer

        // Extremes of the value range: sums reach 2 * 10^9 and must not overflow int
        check(new int[] {1_000_000_000, 5, -1_000_000_000}, 0, 0, 2);
        check(new int[] {1_000_000_000, 3, 0}, 1_000_000_000, 0, 2);
        check(new int[] {-1_000_000_000, 7, 0}, -1_000_000_000, 0, 2);
        check(new int[] {-1_000_000_000, 1_000_000_000, 999_999_999, 1}, 1_000_000_000, 2, 3);

        // Largest input (n = 10^4), answer is the last pair: worst case for every approach
        int n = 10_000;
        int[] big = new int[n];
        for (int i = 0; i < n - 2; i++) {
            big[i] = 2 * i;
        }
        big[n - 2] = 1_000_001;
        big[n - 1] = 1_000_002;
        check(big, 2_000_003, n - 2, n - 1);

        // The promise "exactly one answer" broken: the page says the method throws
        try {
            new Solution().twoSum(new int[] {1, 2}, 10);
            throw new AssertionError("expected IllegalArgumentException when no pair exists");
        } catch (IllegalArgumentException expected) {
            cases++;
        }

        // Random inputs with exactly one valid pair, checked against an independent brute force
        Random random = new Random(20261113L);
        int randomCases = 0;
        while (randomCases < 2000) {
            int length = 2 + random.nextInt(12);
            int[] nums = new int[length];
            for (int i = 0; i < length; i++) {
                nums[i] = random.nextInt(41) - 20;
            }
            int target = random.nextInt(81) - 40;
            List<int[]> pairs = allPairs(nums, target);
            if (pairs.size() != 1) {
                continue;
            }
            check(nums, target, pairs.get(0)[0], pairs.get(0)[1]);
            randomCases++;
        }

        System.out.println("PASS " + cases + " cases");
    }

    static List<int[]> allPairs(int[] nums, int target) {
        List<int[]> pairs = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if ((long) nums[i] + nums[j] == target) {
                    pairs.add(new int[] {i, j});
                }
            }
        }
        return pairs;
    }

    /** The result must be the two expected indices, in either order, and the input must be untouched. */
    static void check(int[] nums, int target, int first, int second) {
        String label = "nums.length=" + nums.length + ", target=" + target;
        // Guard against a wrong test: the problem promises exactly one valid pair.
        if (allPairs(nums, target).size() != 1) {
            throw new IllegalStateException(label + ": bad test case, it does not have exactly one valid pair");
        }
        int[] before = nums.clone();
        int[] result = new Solution().twoSum(nums, target);
        if (result == null || result.length != 2) {
            throw new AssertionError(label + ": expected two indices");
        }
        boolean same = (result[0] == first && result[1] == second) || (result[0] == second && result[1] == first);
        if (!same) {
            throw new AssertionError(label + ": expected [" + first + ", " + second + "] but got [" + result[0] + ", " + result[1] + "]");
        }
        if (!java.util.Arrays.equals(before, nums)) {
            throw new AssertionError(label + ": the input array was modified");
        }
        cases++;
    }
}
