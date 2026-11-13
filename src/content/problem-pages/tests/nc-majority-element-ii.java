import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Majority Element II page (run by `npm run problems:verify`).
 * Each approach is compiled with this file and must pass. The answer may be in any order, so
 * results are compared as sorted lists; duplicates in the result are a failure.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry runs on the page, plus the official examples
        check(new int[] {4, 1, 4, 2, 1, 4, 1}, 1, 4);
        check(new int[] {5, 6, 7, 5}, 5);
        check(new int[] {5, 6, 7});
        check(new int[] {6, 4, 4, 2, 4, 2, 3, 2}, 2, 4);     // the wrong branch order returns only [2]
        check(new int[] {5, 7, 5}, 5);                        // skipping verification returns [5, 7]
        check(new int[] {3, 2, 3}, 3);
        check(new int[] {1}, 1);
        check(new int[] {1, 2}, 1, 2);

        // Edge cases from sections 3, 7 and 11
        check(new int[] {9}, 9);                              // n = 1
        check(new int[] {4, 4}, 4);                           // n = 2, one value
        check(new int[] {7, 8}, 7, 8);                        // n = 2, both qualify
        check(new int[] {1, 2, 3});                           // n = 3, none (the >= bug returns all)
        check(new int[] {2, 2, 3}, 2);                        // n = 3, one
        check(new int[] {0, 0, 1}, 0);                        // values equal to the placeholders
        check(new int[] {1, 1, 1}, 1);
        check(new int[] {0, 0, 0}, 0);                        // same placeholders would report 0 twice
        check(new int[] {1, 1, 0, 0, 2}, 0, 1);
        check(new int[] {1, 2, 3, 4, 5, 6});                  // n = 6, all distinct
        check(new int[] {1, 1, 2, 2, 3, 3});                  // n = 6, two copies is not more than 2
        check(new int[] {1, 1, 1, 2, 2, 3}, 1);
        check(new int[] {-1_000_000_000, 1_000_000_000, -1_000_000_000}, -1_000_000_000);
        check(new int[] {1_000_000_000, -1_000_000_000}, -1_000_000_000, 1_000_000_000);

        // Largest n = 5 * 10^4: threshold is more than 16,666
        int n = 50_000;
        int[] two = new int[n];
        for (int i = 0; i < n; i++) {
            two[i] = i < 16_667 ? -1_000_000_000 : i < 33_334 ? 1_000_000_000 : i;  // 16,667 each
        }
        check(two, -1_000_000_000, 1_000_000_000);
        int[] justBelow = new int[n];
        for (int i = 0; i < n; i++) {
            justBelow[i] = i < 16_666 ? 7 : i;                // 7 occurs exactly 16,666 times
        }
        check(justBelow);
        int[] distinct = new int[n];
        for (int i = 0; i < n; i++) {
            distinct[i] = i - 25_000;
        }
        check(distinct);
        int[] same = new int[n];
        Arrays.fill(same, 1_000_000_000);
        check(same, 1_000_000_000);

        // Random inputs against an independent brute force
        Random random = new Random(20261113L);
        for (int t = 0; t < 4000; t++) {
            int len = 1 + random.nextInt(t < 3500 ? 12 : 600);
            int range = 1 + random.nextInt(5);
            boolean wide = random.nextInt(4) == 0;
            int[] nums = new int[len];
            for (int i = 0; i < len; i++) {
                int v = random.nextInt(range);
                nums[i] = wide ? (v - 2) * 400_000_000 : v;   // within [-8 * 10^8, 8 * 10^8]
            }
            int[] expected = bruteForce(nums);
            check(nums, expected);
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** Independent reference: count each value by pairwise comparison. */
    static int[] bruteForce(int[] nums) {
        List<Integer> result = new ArrayList<>();
        for (int x : nums) {
            int count = 0;
            for (int y : nums) {
                if (y == x) {
                    count++;
                }
            }
            if (count > nums.length / 3 && !result.contains(x)) {
                result.add(x);
            }
        }
        return result.stream().mapToInt(Integer::intValue).toArray();
    }

    /** Reference for large inputs (only used to validate test cases): count runs in a sorted copy. */
    static int[] sortedCounts(int[] nums) {
        int[] s = nums.clone();
        Arrays.sort(s);
        List<Integer> result = new ArrayList<>();
        for (int i = 0, j; i < s.length; i = j) {
            for (j = i; j < s.length && s[j] == s[i]; j++) {
                // advance to the end of the run
            }
            if (j - i > s.length / 3) {
                result.add(s[i]);
            }
        }
        return result.stream().mapToInt(Integer::intValue).toArray();
    }

    static void check(int[] nums, int... expected) {
        String label = "n=" + nums.length + (nums.length <= 20 ? " " + Arrays.toString(nums) : "");
        // Guard: 1 <= n <= 5 * 10^4, values in [-10^9, 10^9], and the expected answer is right.
        if (nums.length < 1 || nums.length > 50_000) {
            throw new IllegalStateException(label + ": bad test case, n out of range");
        }
        for (int x : nums) {
            if (x < -1_000_000_000 || x > 1_000_000_000) {
                throw new IllegalStateException(label + ": bad test case, value " + x + " out of range");
            }
        }
        List<Integer> want = new ArrayList<>();
        for (int e : expected) {
            want.add(e);
        }
        Collections.sort(want);
        {
            List<Integer> brute = new ArrayList<>();
            for (int e : nums.length <= 2_000 ? bruteForce(nums) : sortedCounts(nums)) {
                brute.add(e);
            }
            Collections.sort(brute);
            if (!brute.equals(want)) {
                throw new IllegalStateException(label + ": bad test case, expected " + want + " but brute force says " + brute);
            }
        }
        int[] before = nums.clone();
        List<Integer> result = new ArrayList<>(new Solution().majorityElement(nums));
        Collections.sort(result);
        if (!result.equals(want)) {
            throw new AssertionError(label + ": expected " + want + " in any order, got " + result);
        }
        if (!Arrays.equals(before, nums)) {
            throw new AssertionError(label + ": the input array was modified");
        }
        cases++;
    }
}
