import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Search in Rotated Sorted Array II page (run by
 * `npm run problems:verify`). Inputs are rotations (rotation 0 included) of non-decreasing
 * arrays with many duplicates; the expected answer comes from a linear scan. The adversarial
 * family "all equal but one" is checked for every position of the odd element at n = 5000.
 */
class Tests {
    static final int MAX_N = 5000;
    static final int MAX_V = 10_000;
    static int cases = 0;

    static int[] rotate(int[] sorted, int k) {
        int n = sorted.length;
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sorted[(i + k) % n];
        return a;
    }

    static boolean reference(int[] nums, int target) {
        for (int v : nums) if (v == target) return true;
        return false;
    }

    /** True if nums is some rotation of a non-decreasing array. */
    static boolean isRotatedSorted(int[] nums) {
        int n = nums.length;
        int drops = 0;
        for (int i = 1; i < n; i++) if (nums[i - 1] > nums[i]) drops++;
        return drops == 0 || (drops == 1 && nums[n - 1] <= nums[0]);
    }

    static void check(int[] nums, int target, Boolean expected) {
        int n = nums.length;
        if (n < 1 || n > MAX_N) throw new IllegalStateException("bad test case: n = " + n);
        if (target < -MAX_V || target > MAX_V) throw new IllegalStateException("bad test case: target " + target);
        for (int v : nums) {
            if (v < -MAX_V || v > MAX_V) throw new IllegalStateException("bad test case: value " + v);
        }
        if (!isRotatedSorted(nums)) {
            throw new IllegalStateException("bad test case: not a rotated sorted array " + Arrays.toString(nums));
        }
        boolean want = reference(nums, target);
        if (expected != null && expected != want) throw new IllegalStateException("bad test case: expected " + expected + " should be " + want);
        int[] input = nums.clone();
        boolean got = new Solution().search(input, target);
        if (!Arrays.equals(input, nums)) throw new AssertionError("nums was modified");
        if (got != want) {
            String shown = n <= 20 ? Arrays.toString(nums) : "n = " + n;
            throw new AssertionError(shown + ", target = " + target + ": expected " + want + " but got " + got);
        }
        cases++;
    }

    static void check(int[] nums, int target) {
        check(nums, target, null);
    }

    /** Every present value, the absent values next to each one, and both value extremes. */
    static void checkAllTargets(int[] nums) {
        int[] sorted = nums.clone();
        Arrays.sort(sorted);
        for (int i = 0; i < sorted.length; i++) {
            if (i > 0 && sorted[i] == sorted[i - 1]) continue;
            check(nums, sorted[i]);
            if (sorted[i] > -MAX_V) check(nums, sorted[i] - 1);
            if (sorted[i] < MAX_V) check(nums, sorted[i] + 1);
        }
        check(nums, -MAX_V);
        check(nums, MAX_V);
    }

    /** n sorted values drawn from `distinct` different values, so duplicates are frequent. */
    static int[] sortedWithDuplicates(Random random, int n, int distinct, int spread) {
        int[] pool = new int[distinct];
        for (int i = 0; i < distinct; i++) pool[i] = random.nextInt(2 * spread + 1) - spread;
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = pool[random.nextInt(distinct)];
        Arrays.sort(a);
        return a;
    }

    public static void main(String[] args) {
        // Examples and dry runs (sections 1, 4 and 7)
        check(new int[] {3, 4, 4, 0, 1, 1, 2}, 1, true);
        check(new int[] {3, 4, 4, 0, 1, 1, 2}, 5, false);
        check(new int[] {1, 1, 1, 1, 2, 1, 1}, 2, true);
        check(new int[] {2, 5, 6, 0, 0, 1, 2}, 0, true);   // LeetCode's examples
        check(new int[] {2, 5, 6, 0, 0, 1, 2}, 3, false);

        // Edge cases from section 3, traced in section 7, and inputs behind the claimed bugs
        check(new int[] {1}, 1, true);
        check(new int[] {1}, 2, false);
        check(new int[] {1, 0, 1, 1, 1}, 0, true);          // distinct-values code returns false
        check(new int[] {1, 1, 1, 0, 1}, 0, true);
        check(new int[] {1, 1, 1, 1, 1}, 2, false);
        check(new int[] {1, 1, 1, 1, 1}, 1, true);
        check(new int[] {0, 0, 1, 2, 2, 5}, 5, true);       // unrotated with duplicates
        check(new int[] {3, 1, 1}, 3, true);
        check(new int[] {0, 0, 0, 1, 0, 0}, 1, true);       // naive rotation point reports 0
        check(new int[] {1, 3, 1, 1, 1}, 3, true);
        check(new int[] {1, 1, 3, 1}, 3, true);
        check(new int[] {-10_000, 10_000}, 10_000, true);   // value extremes
        check(new int[] {10_000, -10_000, -10_000}, -10_000, true);
        check(new int[] {10_000, 10_000, -10_000}, 0, false);

        // Every rotation and every interesting target of many small arrays with duplicates,
        // including every rotation of every array of 0s and 1s up to length 10
        for (int n = 1; n <= 10; n++) {
            for (int ones = 0; ones <= n; ones++) {
                int[] sorted = new int[n];
                for (int i = n - ones; i < n; i++) sorted[i] = 1;
                for (int k = 0; k < n; k++) checkAllTargets(rotate(sorted, k));
            }
        }
        Random random = new Random(20261115L);
        for (int n = 1; n <= 14; n++) {
            for (int t = 0; t < 60; t++) {
                int distinct = 1 + random.nextInt(Math.min(n, 4));
                int[] sorted = sortedWithDuplicates(random, n, distinct, t < 30 ? 5 : MAX_V);
                for (int k = 0; k < n; k++) checkAllTargets(rotate(sorted, k));
            }
        }
        for (int t = 0; t < 30; t++) {
            int n = 15 + random.nextInt(120);
            int[] sorted = sortedWithDuplicates(random, n, 1 + random.nextInt(6), MAX_V);
            for (int k = 0; k < n; k++) checkAllTargets(rotate(sorted, k));
        }

        // Adversarial: all 1s with a single 2 at every position (and all 1s alone), n = 5000
        int[] ones = new int[MAX_N];
        Arrays.fill(ones, 1);
        check(ones, 2, false);
        check(ones, 1, true);
        check(ones, 0, false);
        for (int p = 0; p < MAX_N; p++) {
            int[] a = ones.clone();
            a[p] = 2;
            check(a, 2, true);
            if (p % 97 == 0) {
                check(a, 1, true);
                check(a, 3, false);
            }
            int[] b = ones.clone();            // and a single 0 among the 1s
            b[p] = 0;
            check(b, 0, true);
        }

        // Constraint extremes: n = 5000 with many duplicates, random rotations
        for (int t = 0; t < 12; t++) {
            int[] sorted = sortedWithDuplicates(random, MAX_N, 1 + random.nextInt(t < 6 ? 5 : 500), MAX_V);
            int k = t == 0 ? 0 : t == 1 ? 1 : t == 2 ? MAX_N - 1 : random.nextInt(MAX_N);
            int[] nums = rotate(sorted, k);
            check(nums, nums[0]);
            check(nums, nums[MAX_N - 1]);
            for (int q = 0; q < 300; q++) {
                check(nums, random.nextBoolean() ? nums[random.nextInt(MAX_N)] : random.nextInt(2 * MAX_V + 1) - MAX_V);
            }
        }

        System.out.println("PASS " + cases + " cases");
    }
}
