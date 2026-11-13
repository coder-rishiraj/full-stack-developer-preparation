import java.util.Arrays;
import java.util.Random;
import java.util.TreeSet;

/**
 * Tests for every "class Solution" on the Longest Consecutive Sequence page (run by `npm run problems:verify`).
 * Each approach is compiled together with this file and must pass all cases.
 */
class Tests {
    static int cases = 0;
    static final int LIMIT = 1_000_000_000;

    public static void main(String[] args) {
        // Examples in section 1 and dry-run inputs in section 4
        check(new int[] {7, -1, 9, 0, 8, 1, 6}, 4);
        check(new int[] {3, 1, 2, 2, 3}, 3);

        // Edge cases listed in section 3 and traced in section 7
        check(new int[] {}, 0);                                        // empty array
        check(new int[] {5}, 1);                                       // one element
        check(new int[] {7, 7, 7}, 1);                                 // all duplicates
        check(new int[] {1, 3, 5, 7}, 1);                              // no two consecutive
        check(new int[] {0, -2, 1, -1}, 4);                            // a run crossing zero
        check(new int[] {5, 4, 3, 2, 1}, 5);                           // a run given in reverse order
        check(new int[] {1, 2, 10, 11}, 2);                            // two runs of equal length
        check(new int[] {1, 2, 2, 3}, 3);                              // a duplicate inside a run
        check(new int[] {LIMIT, LIMIT - 1, -LIMIT, -LIMIT + 1, -LIMIT + 2}, 3); // runs at both extremes
        check(new int[] {-LIMIT, LIMIT}, 1);                           // the two extremes are far apart
        check(new int[] {LIMIT, LIMIT, LIMIT - 1}, 2);

        Random random = new Random(20261113L);
        int n = 100_000;

        // Largest inputs: n = 10^5
        check(shuffled(range(0, n), random), n);                                   // one run of 10^5
        check(shuffled(range(LIMIT - n + 1, n), random), n);                       // a run ending at 10^9
        check(shuffled(range(-LIMIT, n), random), n);                              // a run starting at -10^9
        int[] same = new int[n];
        Arrays.fill(same, 7);
        check(same, 1);                                                            // 10^5 copies of one value
        int[] extremes = new int[n];
        for (int i = 0; i < n; i++) {
            extremes[i] = i % 2 == 0 ? LIMIT : -LIMIT;
        }
        check(extremes, 1);
        // Half a run, half copies of the run's first value: slow if the outer loop walks the array, not the set
        int[] startCopies = new int[n];
        for (int i = 0; i < n; i++) {
            startCopies[i] = i < n / 2 ? i + 1 : 1;
        }
        check(shuffled(startCopies, random), n / 2);
        int[] pairs = new int[n];                                                  // 50,000 runs of length 2
        for (int i = 0; i < n; i++) {
            pairs[i] = (i / 2) * 3 + (i % 2);
        }
        check(shuffled(pairs, random), 2);
        for (int r = 0; r < 4; r++) {
            int[] wide = new int[n];
            int spread = r == 0 ? LIMIT : 200_000;                                 // sparse, then dense with duplicates
            for (int i = 0; i < n; i++) {
                wide[i] = random.nextInt(2 * spread + 1) - spread;
            }
            check(wide, reference(wide));
        }

        // Random small inputs checked against a brute force
        for (int r = 0; r < 3000; r++) {
            int length = random.nextInt(15);
            int spread = 1 + random.nextInt(12);
            int[] nums = new int[length];
            for (int i = 0; i < length; i++) {
                nums[i] = random.nextInt(2 * spread + 1) - spread;
                if (random.nextInt(20) == 0) {
                    nums[i] = random.nextBoolean() ? LIMIT - random.nextInt(3) : -LIMIT + random.nextInt(3);
                }
            }
            check(nums, bruteForce(nums));
        }

        System.out.println("PASS " + cases + " cases");
    }

    static int[] range(int from, int count) {
        int[] a = new int[count];
        for (int i = 0; i < count; i++) {
            a[i] = from + i;
        }
        return a;
    }

    static int[] shuffled(int[] a, Random random) {
        int[] b = a.clone();
        for (int i = b.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            int t = b[i];
            b[i] = b[j];
            b[j] = t;
        }
        return b;
    }

    /** For each value, count how far the run upward from it goes, searching the array each time. */
    static int bruteForce(int[] nums) {
        int best = 0;
        for (int x : nums) {
            long next = x;
            int length = 0;
            while (containsValue(nums, next)) {
                length++;
                next++;
            }
            best = Math.max(best, length);
        }
        return best;
    }

    static boolean containsValue(int[] nums, long v) {
        for (int x : nums) {
            if (x == v) {
                return true;
            }
        }
        return false;
    }

    /** Reference for large inputs: walk the distinct values in increasing order. */
    static int reference(int[] nums) {
        TreeSet<Integer> set = new TreeSet<>();
        for (int x : nums) {
            set.add(x);
        }
        int best = 0;
        int run = 0;
        Integer previous = null;
        for (int x : set) {
            run = previous != null && (long) x == (long) previous + 1 ? run + 1 : 1;
            best = Math.max(best, run);
            previous = x;
        }
        return best;
    }

    static void validate(int[] nums) {
        if (nums.length > 100_000) {
            throw new IllegalStateException("bad test case: more than 10^5 values");
        }
        for (int x : nums) {
            if (x < -LIMIT || x > LIMIT) {
                throw new IllegalStateException("bad test case: value outside [-10^9, 10^9]");
            }
        }
    }

    static void check(int[] nums, int expected) {
        validate(nums);
        String label = nums.length <= 12 ? Arrays.toString(nums) : "n=" + nums.length;
        if (nums.length <= 2000 && bruteForce(nums) != expected) {
            throw new IllegalStateException(label + ": bad test case, expected answer is wrong");
        }
        if (reference(nums) != expected) {
            throw new IllegalStateException(label + ": bad test case, expected answer disagrees with the reference");
        }
        int[] before = nums.clone();
        int got = new Solution().longestConsecutive(nums);
        if (got != expected) {
            throw new AssertionError(label + ": expected " + expected + " but got " + got);
        }
        if (!Arrays.equals(before, nums)) {
            throw new AssertionError(label + ": the input array was modified");
        }
        cases++;
    }
}
