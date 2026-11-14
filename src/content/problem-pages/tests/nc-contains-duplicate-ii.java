import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Contains Duplicate II page (run by `npm run problems:verify`).
 * Each approach is compiled together with this file and must pass all cases.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry runs
        check(new int[] {5, 8, 5, 2}, 2, true);
        check(new int[] {5, 8, 2, 5}, 2, false);
        check(new int[] {1, 0, 1, 1}, 1, true);

        // Edge cases from sections 3, 7, 9 and 11
        check(new int[] {7, 7}, 0, false);              // k = 0 is always false
        check(new int[] {1, 1, 1, 1}, 0, false);
        check(new int[] {4}, 0, false);                 // one element
        check(new int[] {4}, 100_000, false);
        check(new int[] {1, 2, 3, 1}, 10, true);        // k >= n
        check(new int[] {1, 2, 3, 1}, 3, true);         // distance exactly k
        check(new int[] {1, 2, 3, 1}, 2, false);        // distance k + 1
        check(new int[] {1, 0, 1}, 2, true);            // the wrong-eviction bug returns false here
        check(new int[] {7, 7}, 1, true);
        check(new int[] {-1_000_000_000, 1_000_000_000, -1_000_000_000}, 2, true);
        check(new int[] {-1_000_000_000, 1_000_000_000, -1_000_000_000}, 1, false);

        // Largest inputs, n = 10^5
        int n = 100_000;
        int[] distinct = new int[n];
        for (int i = 0; i < n; i++) {
            distinct[i] = -1_000_000_000 + i * 20_000;
        }
        shuffle(distinct, new Random(11L));
        check(distinct, 100_000, false);                // worst case for the brute force
        int[] ends = distinct.clone();
        ends[n - 1] = ends[0];
        check(ends, 100_000, true);                     // only pair is first and last, distance n - 1
        check(ends, n - 2, false);
        int[] periodic = new int[n];
        for (int i = 0; i < n; i++) {
            periodic[i] = i % 1000;                     // equal values exactly 1000 apart
        }
        check(periodic, 999, false);
        check(periodic, 1000, true);
        int[] allSame = new int[n];
        Arrays.fill(allSame, 1_000_000_000);
        check(allSame, 0, false);
        check(allSame, 1, true);

        // Random inputs against an independent reference
        Random random = new Random(20261114L);
        for (int r = 0; r < 4000; r++) {
            int length = 1 + random.nextInt(16);
            int range = 1 + random.nextInt(12);
            int[] nums = new int[length];
            for (int i = 0; i < length; i++) {
                nums[i] = random.nextInt(2 * range + 1) - range;
            }
            int k = random.nextInt(length + 3);
            check(nums, k, reference(nums, k));
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** Smallest distance between two equal values, compared with k (all pairs). */
    static boolean reference(int[] nums, int k) {
        int best = Integer.MAX_VALUE;
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] == nums[j]) {
                    best = Math.min(best, j - i);
                }
            }
        }
        return best <= k;
    }

    static boolean referenceFast(int[] nums, int k) {
        // Sort indices by value, then compare neighbouring indices of equal values.
        Integer[] idx = new Integer[nums.length];
        for (int i = 0; i < idx.length; i++) {
            idx[i] = i;
        }
        Arrays.sort(idx, (a, b) -> nums[a] != nums[b] ? Integer.compare(nums[a], nums[b]) : Integer.compare(a, b));
        for (int t = 1; t < idx.length; t++) {
            if (nums[idx[t]] == nums[idx[t - 1]] && idx[t] - idx[t - 1] <= k) {
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

    static void check(int[] nums, int k, boolean expected) {
        String label = "n=" + nums.length + " k=" + k + (nums.length <= 20 ? " " + Arrays.toString(nums) : "");
        if (nums.length < 1 || nums.length > 100_000 || k < 0 || k > 100_000) {
            throw new IllegalStateException(label + ": bad test case, size out of range");
        }
        for (int x : nums) {
            if (x < -1_000_000_000 || x > 1_000_000_000) {
                throw new IllegalStateException(label + ": bad test case, value out of range");
            }
        }
        if (referenceFast(nums, k) != expected) {
            throw new IllegalStateException(label + ": bad test case, expected value is wrong");
        }
        int[] before = nums.clone();
        boolean result = new Solution().containsNearbyDuplicate(nums, k);
        if (result != expected) {
            throw new AssertionError(label + ": expected " + expected + " but got " + result);
        }
        if (!Arrays.equals(before, nums)) {
            throw new AssertionError(label + ": the input array was modified");
        }
        cases++;
    }
}
