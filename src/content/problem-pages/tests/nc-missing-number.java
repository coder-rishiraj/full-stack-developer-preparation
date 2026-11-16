import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Missing Number page (run by `npm run problems:verify`).
 * Approach 7 rearranges nums in place, so each case computes its expected answer from its own copy
 * before the call.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // The three examples from the statement (Example 1 is every dry-run input on the page).
        check(new int[] {3, 0, 1}, 2);
        check(new int[] {0, 1}, 2);
        check(new int[] {9, 6, 4, 2, 3, 5, 7, 0, 1}, 8);

        // Edge cases from section 3, traced in section 7.
        check(new int[] {0}, 1);                     // n = 1, missing n
        check(new int[] {1}, 0);                     // n = 1, missing 0
        check(new int[] {1, 2}, 0);                  // missing 0
        check(new int[] {2, 0}, 1);                  // 0 sits in slot 1: sign marking returns 2 here
        check(new int[] {3, 2, 1}, 0);
        check(new int[] {4, 3, 2, 1, 0}, 5);         // descending, missing n

        // Every arrangement of every input with n <= 6 (5,912 arrays).
        for (int n = 1; n <= 6; n++) {
            for (int m = 0; m <= n; m++) {
                int[] values = without(n, m);
                permute(values, 0, m);
            }
        }

        // Random inputs, answer checked against an independent set difference.
        Random random = new Random(20261116L);
        for (int t = 0; t < 2000; t++) {
            int n = 1 + random.nextInt(200);
            int m = random.nextInt(n + 1);
            int[] nums = shuffled(without(n, m), random);
            check(nums, bySetDifference(nums));
        }

        // Largest n = 10^4: the total 0 + 1 + ... + n is 50,005,000, which fits in an int.
        int max = 10_000;
        check(reversed(without(max, max)), max);     // missing n: the brute force's worst case
        check(shuffled(without(max, 0), random), 0);
        check(shuffled(without(max, 5_000), random), 5_000);
        check(without(max, max - 1), max - 1);

        // The test inputs themselves must be valid.
        expectInvalid(new int[] {});                 // n = 0
        expectInvalid(new int[] {0, 0});             // repeated value
        expectInvalid(new int[] {0, 3});             // value above n
        expectInvalid(new int[] {-1, 0});            // negative value

        System.out.println("PASS " + cases + " cases");
    }

    static void permute(int[] a, int k, int expected) {
        if (k == a.length) {
            check(a.clone(), expected);
            return;
        }
        for (int i = k; i < a.length; i++) {
            swap(a, k, i);
            permute(a, k + 1, expected);
            swap(a, k, i);
        }
    }

    static void swap(int[] a, int i, int j) {
        int t = a[i];
        a[i] = a[j];
        a[j] = t;
    }

    /** 0..n without m, ascending. */
    static int[] without(int n, int m) {
        int[] values = new int[n];
        int k = 0;
        for (int v = 0; v <= n; v++) {
            if (v != m) values[k++] = v;
        }
        return values;
    }

    static int[] reversed(int[] a) {
        int[] r = new int[a.length];
        for (int i = 0; i < a.length; i++) r[i] = a[a.length - 1 - i];
        return r;
    }

    static int[] shuffled(int[] a, Random random) {
        int[] r = a.clone();
        for (int i = r.length - 1; i > 0; i--) {
            swap(r, i, random.nextInt(i + 1));
        }
        return r;
    }

    static int bySetDifference(int[] nums) {
        List<Integer> all = new ArrayList<>();
        for (int v = 0; v <= nums.length; v++) all.add(v);
        for (int v : nums) all.remove(Integer.valueOf(v));
        if (all.size() != 1) throw new AssertionError("set difference left " + all.size() + " values");
        return all.get(0);
    }

    /** Null when nums is a valid input, otherwise the reason it is not. */
    static String invalid(int[] nums) {
        int n = nums.length;
        if (n < 1 || n > 10_000) return "n must be in 1..10^4";
        boolean[] seen = new boolean[n + 1];
        for (int v : nums) {
            if (v < 0 || v > n) return "value " + v + " outside 0..n";
            if (seen[v]) return "value " + v + " repeated";
            seen[v] = true;
        }
        return null;
    }

    static void expectInvalid(int[] nums) {
        if (invalid(nums) == null) throw new AssertionError("the input guard accepted " + Arrays.toString(nums));
    }

    static void check(int[] nums, int expected) {
        String problem = invalid(nums);
        if (problem != null) throw new IllegalArgumentException("invalid test: " + problem);
        String shown = nums.length > 12 ? "array of length " + nums.length : Arrays.toString(nums);
        int got = new Solution().missingNumber(nums);
        if (got != expected) {
            throw new AssertionError(shown + ": expected " + expected + ", got " + got);
        }
        cases++;
    }
}
