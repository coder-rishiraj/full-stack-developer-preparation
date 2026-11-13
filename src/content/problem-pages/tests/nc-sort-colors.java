import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Sort Colors page (run by `npm run problems:verify`).
 * sortColors returns nothing, so each check inspects the array the method was given.
 * The reference is java.util.Arrays.sort on a copy, independent of the code under test.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry-run inputs used on the page
        check(new int[] {2, 0, 1, 2, 1, 0});
        check(new int[] {1, 2, 0});                               // breaks "advance mid after swapping with high"
        check(new int[] {1, 0});                                  // breaks "while (mid < high)"

        // Edge cases listed in section 3 and traced in section 7
        check(new int[] {0});
        check(new int[] {1});
        check(new int[] {2});
        check(new int[] {2, 2, 2});                               // one colour only
        check(new int[] {0, 0, 1, 1, 2, 2});                      // already sorted
        check(new int[] {2, 2, 1, 1, 0, 0});                      // reverse sorted
        check(new int[] {2, 0});                                  // a missing colour
        check(new int[] {0, 2, 0, 2});                            // no 1s at all

        // Every array over {0, 1, 2} of length 1 to 8 (9,840 arrays)
        for (int len = 1; len <= 8; len++) {
            int total = 1;
            for (int i = 0; i < len; i++) {
                total *= 3;
            }
            for (int code = 0; code < total; code++) {
                int[] nums = new int[len];
                int c = code;
                for (int i = 0; i < len; i++) {
                    nums[i] = c % 3;
                    c /= 3;
                }
                check(nums);
            }
        }

        // Largest input, n = 300
        int n = 300;
        int[] reversed = new int[n];
        int[] allTwos = new int[n];
        int[] allZeros = new int[n];
        int[] cycle = new int[n];
        for (int i = 0; i < n; i++) {
            reversed[i] = 2 - i * 3 / n;
            allTwos[i] = 2;
            cycle[i] = (2 - i % 3);
        }
        check(reversed);
        check(allTwos);
        check(allZeros);
        check(cycle);

        // Random inputs up to the maximum length
        Random random = new Random(20261113L);
        for (int t = 0; t < 3000; t++) {
            int len = 1 + random.nextInt(300);
            int[] nums = new int[len];
            int skip = random.nextInt(4);                         // sometimes leave one colour out
            for (int i = 0; i < len; i++) {
                int v = random.nextInt(3);
                nums[i] = (v == skip) ? (v + 1) % 3 : v;
            }
            check(nums);
        }

        System.out.println("PASS " + cases + " cases");
    }

    static void check(int[] nums) {
        String label = Arrays.toString(nums.length <= 12 ? nums : Arrays.copyOf(nums, 12)) + (nums.length > 12 ? "..." : "");
        // Guard against a wrong test: 1 <= n <= 300 and every value is 0, 1 or 2.
        if (nums.length < 1 || nums.length > 300) {
            throw new IllegalStateException(label + ": bad test case, n out of range");
        }
        for (int x : nums) {
            if (x < 0 || x > 2) {
                throw new IllegalStateException(label + ": bad test case, value " + x + " is not a colour");
            }
        }
        int[] expected = nums.clone();
        Arrays.sort(expected);
        int[] given = nums.clone();
        new Solution().sortColors(given);                        // must sort this very array in place
        if (!Arrays.equals(expected, given)) {
            throw new AssertionError(label + ": got " + Arrays.toString(given));
        }
        cases++;
    }
}
