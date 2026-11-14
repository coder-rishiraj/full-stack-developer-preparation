import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Minimum Size Subarray Sum page (run by `npm run problems:verify`).
 * Expected lengths come from an independent brute force: for each start, extend until the sum (in long)
 * reaches the target. It returns early when the total is below the target, so it stays fast on the
 * large "no answer" inputs; large inputs whose answer is long use hand-computed answers instead.
 */
class Tests {
    static final int MAX_N = 100_000;
    static int cases = 0;

    static int reference(int target, int[] nums) {
        long total = 0;
        for (int v : nums) total += v;
        if (total < target) return 0;
        int best = 0;
        for (int i = 0; i < nums.length; i++) {
            long sum = 0;
            for (int j = i; j < nums.length && (best == 0 || j - i + 1 <= best); j++) {
                sum += nums[j];
                if (sum >= target) {
                    if (best == 0 || j - i + 1 < best) best = j - i + 1;
                    break;
                }
            }
        }
        return best;
    }

    static void validate(int target, int[] nums) {
        if (target < 1 || target > 1_000_000_000) throw new IllegalStateException("bad test case: target = " + target);
        if (nums.length < 1 || nums.length > MAX_N) throw new IllegalStateException("bad test case: n = " + nums.length);
        for (int v : nums) {
            if (v < 1 || v > 10_000) throw new IllegalStateException("bad test case: value " + v);
        }
    }

    static void run(int target, int[] nums, int want) {
        int[] input = nums.clone();
        int got = new Solution().minSubArrayLen(target, input);
        if (!Arrays.equals(input, nums)) throw new AssertionError("nums was modified");
        if (got != want) {
            String shown = nums.length <= 20 ? Arrays.toString(nums) : "n = " + nums.length;
            throw new AssertionError("target = " + target + ", " + shown + ": expected " + want + " but got " + got);
        }
        cases++;
    }

    /** Checks against the brute-force reference (and against `expected` when it is given, to catch bad tests). */
    static void check(int target, int[] nums, int expected) {
        validate(target, nums);
        int want = reference(target, nums);
        if (expected >= 0 && expected != want) {
            throw new IllegalStateException("bad test case: expected " + expected + " should be " + want);
        }
        run(target, nums, want);
    }

    static void check(int target, int[] nums) {
        check(target, nums, -1);
    }

    /** For large inputs whose brute force would be quadratic: the expected answer is computed by hand. */
    static void checkKnown(int target, int[] nums, int want) {
        validate(target, nums);
        run(target, nums, want);
    }

    static int[] filled(int n, int v) {
        int[] a = new int[n];
        Arrays.fill(a, v);
        return a;
    }

    public static void main(String[] args) {
        // Examples and dry runs (sections 1 and 4)
        check(7, new int[] {2, 3, 1, 2, 4, 3}, 2);
        check(4, new int[] {1, 4, 4}, 1);
        check(11, new int[] {1, 1, 1, 1, 1, 1, 1, 1}, 0);

        // Edge cases from section 3, traced in section 7, and the inputs behind the claimed bugs
        check(7, new int[] {1, 1, 1, 1, 7}, 1);    // several shrinks at once (an `if` gives 5)
        check(6, new int[] {1, 2, 3}, 3);          // whole array needed
        check(5, new int[] {5}, 1);                // n = 1, reaches
        check(6, new int[] {5}, 0);                // n = 1, does not reach
        check(1, new int[] {1}, 1);                // smallest everything
        check(15, new int[] {1, 2, 3, 4, 5}, 5);
        check(11, new int[] {1, 2, 3, 4, 5}, 3);
        check(3, new int[] {1, 1, 1, 1}, 3);
        check(100, new int[] {10_000, 1, 1}, 1);   // first element alone suffices
        check(9, new int[] {1, 1, 1, 9}, 1);       // last element alone suffices
        check(1_000_000_000, new int[] {10_000, 10_000}, 0);

        // Constraint extremes: n = 10^5, values 10^4, sums up to 10^9
        checkKnown(1_000_000_000, filled(MAX_N, 10_000), MAX_N);           // total exactly 10^9: whole array
        checkKnown(999_990_001, filled(MAX_N, 10_000), MAX_N);             // needs all 10^5 elements
        checkKnown(999_990_000, filled(MAX_N, 10_000), MAX_N - 1);
        checkKnown(1_000_000_000, filled(MAX_N, 1), 0);                    // total 10^5: none
        checkKnown(MAX_N, filled(MAX_N, 1), MAX_N);
        checkKnown(50_000, filled(MAX_N, 1), 50_000);
        int[] lastBig = filled(MAX_N, 1);
        lastBig[MAX_N - 1] = 10_000;
        checkKnown(10_000, lastBig, 1);                                    // one big element at the end
        checkKnown(10_001, lastBig, 2);
        int[] firstBig = filled(MAX_N, 1);
        firstBig[0] = 10_000;
        checkKnown(10_000, firstBig, 1);
        check(1_000_000_000, filled(MAX_N, 9_999));                        // total 999,900,000: none

        // Large random inputs with short answers (the reference stays fast)
        Random random = new Random(20261114L);
        for (int t = 0; t < 4; t++) {
            int[] nums = new int[MAX_N];
            for (int i = 0; i < MAX_N; i++) nums[i] = 1 + random.nextInt(10_000);
            check(1 + random.nextInt(t == 0 ? 10_000 : 200_000), nums);
        }

        // Random small inputs against the reference, targets around the reachable sums
        for (int t = 0; t < 5000; t++) {
            int n = 1 + random.nextInt(t < 4000 ? 12 : 300);
            int bound = random.nextInt(3) == 0 ? 10_000 : 5;
            int[] nums = new int[n];
            long total = 0;
            for (int i = 0; i < n; i++) {
                nums[i] = 1 + random.nextInt(bound);
                total += nums[i];
            }
            int target = (int) Math.max(1, Math.min(1_000_000_000L, 1 + (long) (random.nextDouble() * (total + 2))));
            check(target, nums);
        }

        System.out.println("PASS " + cases + " cases");
    }
}
