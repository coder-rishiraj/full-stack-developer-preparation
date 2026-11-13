import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Sort an Array page (run by `npm run problems:verify`).
 * Each approach is compiled together with this file and must pass all cases.
 * The reference answer comes from java.util.Arrays.sort on a copy, which is independent of the
 * code under test (the solutions themselves never call a library sort).
 */
class Tests {
    static final int MIN = -50_000;
    static final int MAX = 50_000;
    static final int MAX_N = 50_000;
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry-run inputs used on the page
        check(new int[] {2, 5, 1, 4, 3});
        check(new int[] {0, -3, 0, 7, -3});
        check(new int[] {1, 1, 1, 2});                             // breaks the "build the heap top-down" bug

        // Edge cases listed in section 3 and traced in section 7
        check(new int[] {7});                                      // n = 1
        check(new int[] {2, 1});                                   // n = 2, reversed
        check(new int[] {1, 2});                                   // n = 2, already sorted
        check(new int[] {4, 4, 4, 4});                             // all equal
        check(new int[] {-1, -50_000, -7});                        // all negative
        check(new int[] {MAX, MIN, 0, MIN, MAX});                  // value extremes
        check(new int[] {3, 3, 1, 1, 2, 2, 3, 1});                 // few distinct values, many duplicates

        // Largest input, n = 5 * 10^4, in the shapes that break naive quicksort
        int n = MAX_N;
        int[] sorted = new int[n];
        int[] reversed = new int[n];
        int[] allEqual = new int[n];
        int[] twoValues = new int[n];
        int[] organPipe = new int[n];
        int[] fullRange = new int[n];
        for (int i = 0; i < n; i++) {
            sorted[i] = MIN + 2 * i;
            reversed[i] = MAX - 2 * i;
            allEqual[i] = -12_345;
            twoValues[i] = i % 2 == 0 ? MIN : MAX;
            organPipe[i] = i < n / 2 ? i : n - i;
            fullRange[i] = (int) ((long) i * 100_001 / n) + MIN;   // spans MIN..MAX
        }
        check(sorted);
        check(reversed);
        check(allEqual);
        check(twoValues);
        check(organPipe);
        check(fullRange);

        // Random inputs checked against the library sort
        Random random = new Random(20261113L);
        for (int t = 0; t < 4000; t++) {
            int len = 1 + random.nextInt(t < 3500 ? 20 : 3000);
            int spread = random.nextBoolean() ? 1 + random.nextInt(5) : MAX - MIN + 1;
            int[] nums = new int[len];
            for (int i = 0; i < len; i++) {
                nums[i] = spread > 100 ? MIN + random.nextInt(spread) : random.nextInt(spread) - 2;
            }
            check(nums);
        }
        for (int t = 0; t < 10; t++) {
            int[] nums = new int[MAX_N];
            int spread = t % 2 == 0 ? MAX - MIN + 1 : 10;
            for (int i = 0; i < nums.length; i++) {
                nums[i] = spread > 100 ? MIN + random.nextInt(spread) : random.nextInt(spread);
            }
            check(nums);
        }

        System.out.println("PASS " + cases + " cases");
    }

    static void check(int[] nums) {
        String label = "nums.length=" + nums.length;
        // Guard against a wrong test: 1 <= n <= 5 * 10^4 and every value in [-5 * 10^4, 5 * 10^4].
        if (nums.length < 1 || nums.length > MAX_N) {
            throw new IllegalStateException(label + ": bad test case, n out of range");
        }
        for (int x : nums) {
            if (x < MIN || x > MAX) {
                throw new IllegalStateException(label + ": bad test case, value " + x + " out of range");
            }
        }
        int[] expected = nums.clone();
        Arrays.sort(expected);
        int[] input = nums.clone();
        int[] result = new Solution().sortArray(input);
        if (result == null || !Arrays.equals(expected, result)) {
            String shown = nums.length <= 20 ? " for " + Arrays.toString(nums) + " got " + Arrays.toString(result) : "";
            throw new AssertionError(label + ": result is not the sorted input" + shown);
        }
        cases++;
    }
}
