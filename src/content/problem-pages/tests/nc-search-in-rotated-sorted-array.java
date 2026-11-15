import java.util.Arrays;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;

/**
 * Tests for every "class Solution" on the Search in Rotated Sorted Array page (run by
 * `npm run problems:verify`). Inputs are rotations of strictly increasing arrays (rotation 0
 * included, since the array is only "possibly" rotated); the expected index comes from a
 * linear scan, which is unique because the values are distinct.
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

    static int reference(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) if (nums[i] == target) return i;
        return -1;
    }

    static void check(int[] nums, int target, Integer expected) {
        int n = nums.length;
        if (n < 1 || n > MAX_N) throw new IllegalStateException("bad test case: n = " + n);
        if (target < -MAX_V || target > MAX_V) throw new IllegalStateException("bad test case: target " + target);
        Set<Integer> seen = new HashSet<>();
        int drops = 0;
        for (int i = 0; i < n; i++) {
            if (nums[i] < -MAX_V || nums[i] > MAX_V) throw new IllegalStateException("bad test case: value " + nums[i]);
            if (!seen.add(nums[i])) throw new IllegalStateException("bad test case: duplicate " + nums[i]);
            if (i > 0 && nums[i - 1] > nums[i]) drops++;
        }
        if (drops > 1 || (drops == 1 && nums[n - 1] > nums[0])) {
            throw new IllegalStateException("bad test case: not a rotated sorted array " + Arrays.toString(nums));
        }
        int want = reference(nums, target);
        if (expected != null && expected != want) throw new IllegalStateException("bad test case: expected " + expected + " should be " + want);
        int[] input = nums.clone();
        int got = new Solution().search(input, target);
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

    /** Every present value, plus absent values below, above and between them. */
    static void checkAllTargets(int[] nums) {
        int[] sorted = nums.clone();
        Arrays.sort(sorted);
        for (int v : sorted) check(nums, v);
        if (sorted[0] > -MAX_V) check(nums, sorted[0] - 1);
        if (sorted[sorted.length - 1] < MAX_V) check(nums, sorted[sorted.length - 1] + 1);
        check(nums, -MAX_V);
        check(nums, MAX_V);
        for (int i = 0; i + 1 < sorted.length; i++) {
            if (sorted[i + 1] - sorted[i] > 1) check(nums, sorted[i] + 1);
        }
    }

    static int[] distinctSorted(Random random, int n, int range) {
        Set<Integer> s = new HashSet<>();
        while (s.size() < n) s.add(random.nextInt(2 * range + 1) - range);
        int[] a = new int[n];
        int i = 0;
        for (int v : s) a[i++] = v;
        Arrays.sort(a);
        return a;
    }

    public static void main(String[] args) {
        // Examples and dry runs (sections 1, 4 and 7)
        check(new int[] {6, 7, 9, 1, 3, 4}, 3, 4);
        check(new int[] {6, 7, 9, 1, 3, 4}, 5, -1);
        check(new int[] {4, 5, 6, 7, 0, 1, 2}, 0, 4);
        check(new int[] {4, 5, 6, 7, 0, 1, 2}, 3, -1);

        // Edge cases from section 3, traced in section 7, and inputs behind the claimed bugs
        check(new int[] {3, 1}, 1, 1);                   // lo == mid: `<` returns -1
        check(new int[] {3, 1}, 3, 0);
        check(new int[] {1, 3}, 3, 1);
        check(new int[] {5}, 5, 0);                      // n = 1; `lo < hi` returns -1
        check(new int[] {5}, 2, -1);
        check(new int[] {1, 3, 5, 7, 9}, 7, 3);          // unrotated
        check(new int[] {3, 5, 7, 9, 1}, 1, 4);          // target is the minimum
        check(new int[] {9, 1, 3, 5, 7}, 9, 0);          // index 0, right half sorted
        check(new int[] {2, 3, 1}, 2, 0);                // wrong-end range check returns -1
        check(new int[] {-10_000, 10_000}, 10_000, 1);   // value extremes
        check(new int[] {10_000, -10_000}, -10_000, 1);
        check(new int[] {10_000, -10_000}, 0, -1);

        // Every rotation and every interesting target of many small arrays
        Random random = new Random(20261114L);
        for (int n = 1; n <= 12; n++) {
            for (int t = 0; t < 40; t++) {
                int[] sorted = distinctSorted(random, n, t < 20 ? 2 * n : MAX_V);
                for (int k = 0; k < n; k++) checkAllTargets(rotate(sorted, k));
            }
        }
        for (int t = 0; t < 40; t++) {
            int[] sorted = distinctSorted(random, 13 + random.nextInt(150), MAX_V);
            for (int k = 0; k < sorted.length; k++) checkAllTargets(rotate(sorted, k));
        }

        // Constraint extremes: n = 5000
        for (int t = 0; t < 12; t++) {
            int[] sorted = distinctSorted(random, MAX_N, MAX_V);
            int k = t == 0 ? 0 : t == 1 ? 1 : t == 2 ? MAX_N - 1 : random.nextInt(MAX_N);
            int[] nums = rotate(sorted, k);
            check(nums, nums[0]);
            check(nums, nums[MAX_N - 1]);
            check(nums, sorted[0]);
            check(nums, sorted[MAX_N - 1]);
            for (int q = 0; q < 300; q++) check(nums, random.nextInt(2 * MAX_V + 1) - MAX_V);
        }

        System.out.println("PASS " + cases + " cases");
    }
}
