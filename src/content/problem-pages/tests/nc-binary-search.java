import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Binary Search page (run by `npm run problems:verify`).
 * The expected answer comes from an independent linear scan over a copy of the input,
 * and the test also checks that the method did not modify the array.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples from section 1 and the dry runs in section 4
        int[] example = {-4, 1, 6, 9, 15, 22};
        check(example, 15);          // found: index 4
        check(example, 7);           // missing, between 6 and 9: -1
        check(example, -4);          // first element
        check(example, 22);          // last element

        // Edge cases from section 3, traced in section 7
        check(new int[] {5}, 5);     // one element, found
        check(new int[] {5}, 3);     // one element, target smaller
        check(new int[] {5}, 8);     // one element, target larger
        check(new int[] {1, 3}, 1);
        check(new int[] {1, 3}, 3);
        check(new int[] {1, 3}, 2);  // two elements, target between them
        check(example, -9999);       // smaller than everything
        check(example, 9999);        // larger than everything
        check(new int[] {-9999, 9999}, -9999);   // value extremes (bounds are strict: |v| < 10^4)
        check(new int[] {-9999, 9999}, 9999);
        check(new int[] {-9999, 9999}, 0);

        // Largest input: n = 10^4, every element and every gap searched
        int[] big = new int[10_000];
        for (int i = 0; i < big.length; i++) {
            big[i] = -9999 + 2 * i;  // -9999, -9997, ..., 9999
        }
        for (int t = -9999; t <= 9999; t++) {
            check(big, t);
        }
        int[] dense = new int[10_000];
        for (int i = 0; i < dense.length; i++) {
            dense[i] = -5000 + i;
        }
        check(dense, -5000);
        check(dense, 4999);
        check(dense, 5000);
        check(dense, -5001);

        // Random sorted arrays of distinct values against the linear scan
        Random random = new Random(20261114L);
        for (int t = 0; t < 4000; t++) {
            int n = 1 + random.nextInt(t < 3000 ? 12 : 3000);
            int[] nums = randomSorted(random, n);
            int target = random.nextBoolean() ? nums[random.nextInt(n)] : -9999 + random.nextInt(19999);
            check(nums, target);
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** n distinct values from (-10^4, 10^4), sorted ascending. */
    static int[] randomSorted(Random random, int n) {
        boolean[] used = new boolean[19999];
        int[] out = new int[n];
        int k = 0;
        while (k < n) {
            int v = random.nextInt(19999);
            if (!used[v]) {
                used[v] = true;
                out[k++] = v - 9999;
            }
        }
        Arrays.sort(out);
        return out;
    }

    static void check(int[] nums, int target) {
        String label = nums.length > 20 ? "length " + nums.length + ", target " + target : Arrays.toString(nums) + ", target " + target;
        // Guard against a wrong test: 1 <= n <= 10^4, strictly ascending, -10^4 < values, target < 10^4.
        if (nums.length < 1 || nums.length > 10_000) {
            throw new IllegalStateException(label + ": bad test case, length outside the constraints");
        }
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] <= -10_000 || nums[i] >= 10_000 || (i > 0 && nums[i - 1] >= nums[i])) {
                throw new IllegalStateException(label + ": bad test case, values must be distinct, ascending and in (-10^4, 10^4)");
            }
        }
        if (target <= -10_000 || target >= 10_000) {
            throw new IllegalStateException(label + ": bad test case, target outside (-10^4, 10^4)");
        }
        int expected = -1;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == target) {
                expected = i;
            }
        }
        int[] copy = nums.clone();
        int actual = new Solution().search(nums, target);
        if (actual != expected) {
            throw new AssertionError(label + ": got " + actual + ", expected " + expected);
        }
        if (!Arrays.equals(copy, nums)) {
            throw new AssertionError(label + ": the input array was modified");
        }
        cases++;
    }
}
