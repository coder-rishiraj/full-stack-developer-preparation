import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Majority Element page (run by `npm run problems:verify`).
 * Each approach is compiled together with this file and must pass all cases.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry runs used on the page
        check(new int[] {6, 1, 6, 6, 2}, 6);
        check(new int[] {4, 9, 9}, 9);
        check(new int[] {3, 2, 3}, 3);
        check(new int[] {2, 2, 1, 1, 1, 2, 2}, 2);
        check(new int[] {1, 7, 7, 2, 7, 3, 7}, 7);

        // Edge cases listed in section 3 and traced in section 7
        check(new int[] {5}, 5);                                  // n = 1
        check(new int[] {8, 8}, 8);                               // n = 2: both must be equal
        check(new int[] {-4, -4, 0}, -4);                         // negatives and zero
        check(new int[] {1, 2, 3, 9, 9, 9, 9}, 9);                // majority only at the end, candidate changes late
        check(new int[] {9, 9, 9, 9, 1, 2, 3}, 9);                // majority only at the start
        check(new int[] {1, 1, 2, 2, 2}, 2);                      // odd n, majority by exactly one
        check(new int[] {2, 1, 2, 1, 2, 1, 2}, 2);                // alternating, count drops to zero often
        check(new int[] {1, 2, 2}, 2);                            // the >= and double-count bugs in section 11 fail here

        // Value extremes
        check(new int[] {-1_000_000_000, 1_000_000_000, -1_000_000_000}, -1_000_000_000);
        check(new int[] {1_000_000_000, 1_000_000_000, -1_000_000_000}, 1_000_000_000);
        check(new int[] {-1, -1, 7}, -1);                         // all bits set: tests sign handling

        // Largest input: n = 5 * 10^4, majority count exactly n / 2 + 1, majority placed last
        int n = 50_000;
        int[] big = new int[n];
        for (int i = 0; i < n / 2 - 1; i++) {
            big[i] = i - 1_000_000_000;                          // all distinct, never the majority
        }
        for (int i = n / 2 - 1; i < n; i++) {
            big[i] = 1_000_000_000;
        }
        check(big, 1_000_000_000);
        // Same counts, interleaved
        int[] mixed = new int[n];
        for (int i = 0; i < n; i++) {
            mixed[i] = (i % 2 == 0 || i == n - 1) ? -7 : i;
        }
        check(mixed, -7);
        int[] allSame = new int[n];
        Arrays.fill(allSame, -1_000_000_000);
        check(allSame, -1_000_000_000);

        // Random inputs with a majority, checked against an independent brute force
        Random random = new Random(20261113L);
        for (int t = 0; t < 3000; t++) {
            int len = 1 + random.nextInt(t < 2500 ? 15 : 2000);
            int major = random.nextBoolean() ? random.nextInt(7) - 3 : random.nextInt();
            if (major < -1_000_000_000 || major > 1_000_000_000) {
                major %= 1_000_000_000;
            }
            int majorCount = len / 2 + 1 + random.nextInt(len - len / 2);
            int[] nums = new int[len];
            for (int i = 0; i < len; i++) {
                nums[i] = i < majorCount ? major : random.nextInt(7) - 3;
            }
            // Shuffle so the majority is spread out
            for (int i = len - 1; i > 0; i--) {
                int j = random.nextInt(i + 1);
                int tmp = nums[i];
                nums[i] = nums[j];
                nums[j] = tmp;
            }
            check(nums, bruteForce(nums));
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** Independent reference: count every value by pairwise comparison; return the one above n / 2. */
    static int bruteForce(int[] nums) {
        for (int x : nums) {
            int count = 0;
            for (int y : nums) {
                if (y == x) {
                    count++;
                }
            }
            if (count > nums.length / 2) {
                return x;
            }
        }
        throw new IllegalStateException("no majority element");
    }

    static void check(int[] nums, int expected) {
        String label = "nums.length=" + nums.length + ", expected=" + expected;
        // Guard against a wrong test: 1 <= n <= 5 * 10^4, values in [-10^9, 10^9], and expected
        // really occurs more than n / 2 times.
        if (nums.length < 1 || nums.length > 50_000) {
            throw new IllegalStateException(label + ": bad test case, n out of range");
        }
        int count = 0;
        for (int x : nums) {
            if (x < -1_000_000_000 || x > 1_000_000_000) {
                throw new IllegalStateException(label + ": bad test case, value " + x + " out of range");
            }
            if (x == expected) {
                count++;
            }
        }
        if (count <= nums.length / 2) {
            throw new IllegalStateException(label + ": bad test case, no majority element");
        }
        int[] before = nums.clone();
        int result = new Solution().majorityElement(nums);
        if (result != expected) {
            throw new AssertionError(label + ": got " + result);
        }
        if (!Arrays.equals(before, nums)) {
            throw new AssertionError(label + ": the input array was modified");
        }
        cases++;
    }
}
