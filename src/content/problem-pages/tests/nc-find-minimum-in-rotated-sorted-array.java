import java.util.Arrays;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;

/**
 * Tests for every "class Solution" on the Find Minimum in Rotated Sorted Array page
 * (run by `npm run problems:verify`). Inputs are built as rotations of a strictly increasing
 * array, so the expected minimum is simply the first element of that sorted array.
 */
class Tests {
    static final int MAX_N = 5000;
    static final int MAX_V = 5000;
    static int cases = 0;

    /** Rotates `sorted` left by k: the result starts with sorted[k]. */
    static int[] rotate(int[] sorted, int k) {
        int n = sorted.length;
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sorted[(i + k) % n];
        return a;
    }

    static void check(int[] nums, Integer expected) {
        int n = nums.length;
        if (n < 1 || n > MAX_N) throw new IllegalStateException("bad test case: n = " + n);
        Set<Integer> seen = new HashSet<>();
        int drops = 0;
        for (int i = 0; i < n; i++) {
            if (nums[i] < -MAX_V || nums[i] > MAX_V) throw new IllegalStateException("bad test case: value " + nums[i]);
            if (!seen.add(nums[i])) throw new IllegalStateException("bad test case: duplicate " + nums[i]);
            if (i > 0 && nums[i - 1] > nums[i]) drops++;
        }
        // A rotation of a strictly increasing array has at most one drop, and if it has one, the last
        // element is smaller than the first.
        if (drops > 1 || (drops == 1 && nums[n - 1] > nums[0])) {
            throw new IllegalStateException("bad test case: not a rotated sorted array " + Arrays.toString(nums));
        }
        int want = Integer.MAX_VALUE;
        for (int v : nums) want = Math.min(want, v);
        if (expected != null && expected != want) throw new IllegalStateException("bad test case: expected " + expected + " should be " + want);
        int[] input = nums.clone();
        int got = new Solution().findMin(input);
        if (!Arrays.equals(input, nums)) throw new AssertionError("nums was modified");
        if (got != want) {
            String shown = n <= 20 ? Arrays.toString(nums) : "n = " + n;
            throw new AssertionError(shown + ": expected " + want + " but got " + got);
        }
        cases++;
    }

    static void check(int[] nums) {
        check(nums, null);
    }

    /** n distinct sorted values drawn from [-MAX_V, MAX_V]. */
    static int[] distinctSorted(Random random, int n) {
        Set<Integer> s = new HashSet<>();
        while (s.size() < n) s.add(random.nextInt(2 * MAX_V + 1) - MAX_V);
        int[] a = new int[n];
        int i = 0;
        for (int v : s) a[i++] = v;
        Arrays.sort(a);
        return a;
    }

    public static void main(String[] args) {
        // Examples and dry runs (sections 1, 4 and 7)
        check(new int[] {5, 6, 7, 1, 2, 3, 4}, 1);
        check(new int[] {8, 10, 12, 14}, 8);                      // rotated n times: already sorted
        check(new int[] {4, 5, 6, 7, 0, 1, 2}, 0);
        check(new int[] {3, 4, 5, 1, 2}, 1);                      // the naive nums[lo] version returns 2
        check(new int[] {1, 2, 3, 4, 5}, 1);                      // the naive nums[lo] version returns 5

        // Edge cases from section 3, traced in section 7
        check(new int[] {7}, 7);                                  // n = 1
        check(new int[] {2, 1}, 1);                               // n = 2, rotated
        check(new int[] {1, 2}, 1);                               // n = 2, not rotated
        check(new int[] {2, 3, 4, 5, 1}, 1);                      // minimum at the last index
        check(new int[] {5, 1, 2, 3, 4}, 1);                      // minimum right after the first index
        check(new int[] {-5000, 5000}, -5000);                    // value extremes
        check(new int[] {5000, -5000}, -5000);
        check(new int[] {-1, 0, -3, -2}, -3);                     // negatives
        check(new int[] {3, 1, 2}, 1);                            // `hi = mid - 1` returns 3

        // Every rotation of every small array
        Random random = new Random(20261114L);
        for (int n = 1; n <= 12; n++) {
            for (int t = 0; t < 40; t++) {
                int[] sorted = t == 0 ? identity(n, -n / 2) : distinctSorted(random, n);
                for (int k = 0; k < n; k++) check(rotate(sorted, k), sorted[0]);
            }
        }

        // Random sizes, every rotation
        for (int t = 0; t < 60; t++) {
            int[] sorted = distinctSorted(random, 13 + random.nextInt(200));
            for (int k = 0; k < sorted.length; k++) check(rotate(sorted, k), sorted[0]);
        }

        // Constraint extremes: n = 5000, every rotation of one array and some of others
        int[] big = identity(MAX_N, -MAX_V);                      // -5000 .. -1
        for (int k = 0; k < MAX_N; k++) check(rotate(big, k), -MAX_V);
        int[] top = identity(MAX_N, MAX_V - MAX_N + 1);           // 1 .. 5000
        check(rotate(top, 0), 1);
        check(rotate(top, 1), 1);
        check(rotate(top, MAX_N - 1), 1);
        check(rotate(top, MAX_N / 2), 1);
        for (int t = 0; t < 20; t++) {
            int[] sorted = distinctSorted(random, MAX_N);
            check(rotate(sorted, random.nextInt(MAX_N)), sorted[0]);
        }

        System.out.println("PASS " + cases + " cases");
    }

    static int[] identity(int n, int start) {
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = start + i;
        return a;
    }
}
