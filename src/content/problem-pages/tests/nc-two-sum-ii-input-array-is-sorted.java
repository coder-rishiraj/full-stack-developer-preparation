import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Two Sum II page (run by `npm run problems:verify`).
 * The answer is unique, so the expected 1-based pair [index1, index2] is exact.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry-run inputs used on the page
        check(new int[] {1, 3, 4, 7, 11}, 11, 3, 4);
        check(new int[] {-3, -3, 2, 5}, -6, 1, 2);

        // Edge cases listed in section 3 and traced in section 7
        check(new int[] {2, 7}, 9, 1, 2);                         // smallest input: the whole array
        check(new int[] {-1, 0}, -1, 1, 2);                       // negative target
        check(new int[] {5, 5}, 10, 1, 2);                        // equal values form the answer
        check(new int[] {1, 2, 3, 3, 9}, 6, 3, 4);                // equal pair in the middle
        check(new int[] {0, 0, 3, 4}, 0, 1, 2);                   // zeros
        check(new int[] {-5, 1, 2, 9}, 4, 1, 4);                  // answer is the two ends
        check(new int[] {1, 2, 4, 8, 16}, 24, 4, 5);              // answer at the right end
        check(new int[] {1, 2, 4, 8, 16}, 3, 1, 2);               // answer at the left end
        check(new int[] {-4, 2, 2, 3}, -1, 1, 4);                 // a pair of equal values that is not the answer

        // Value and target extremes: sums lie in [-2000, 2000], far inside int
        check(new int[] {-1000, 1000}, 0, 1, 2);
        check(new int[] {-1000, 0}, -1000, 1, 2);
        check(new int[] {500, 500}, 1000, 1, 2);
        check(new int[] {-1000, -999, 0, 1000}, -999, 2, 3);

        // Largest input, n = 3 * 10^4
        int n = 30_000;
        int[] leftWalks = new int[n];                             // left pointer walks n - 2 steps; brute force tries every pair
        Arrays.fill(leftWalks, 0, n - 2, -1000);
        leftWalks[n - 2] = 499;
        leftWalks[n - 1] = 500;
        check(leftWalks, 999, n - 1, n);
        int[] rightWalks = new int[n];                            // right pointer walks n - 2 steps
        Arrays.fill(rightWalks, 2, n, 1000);
        rightWalks[0] = -500;
        rightWalks[1] = -499;
        check(rightWalks, -999, 1, 2);
        int[] middle = new int[n];                                // answer in the middle of long runs of duplicates
        int half = n / 2;
        Arrays.fill(middle, 0, half, -1000);
        middle[half] = 1;
        middle[half + 1] = 2;
        Arrays.fill(middle, half + 2, n, 1000);
        check(middle, 3, half + 1, half + 2);

        // The promise "exactly one solution" broken: the page says the method throws
        try {
            new Solution().twoSum(new int[] {1, 2, 3}, 100);
            throw new AssertionError("expected IllegalArgumentException when no pair exists");
        } catch (IllegalArgumentException expected) {
            cases++;
        }

        // Random sorted inputs with exactly one valid pair, checked against an independent brute force
        Random random = new Random(20261113L);
        int randomCases = 0;
        while (randomCases < 3000) {
            int length = 2 + random.nextInt(14);
            int range = 1 + random.nextInt(40);
            int[] numbers = new int[length];
            for (int i = 0; i < length; i++) {
                numbers[i] = random.nextInt(2 * range + 1) - range;
            }
            Arrays.sort(numbers);
            int target = random.nextInt(4 * range + 1) - 2 * range;
            int[] only = onlyPair(numbers, target);
            if (only == null) {
                continue;
            }
            check(numbers, target, only[0], only[1]);
            randomCases++;
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** The unique 1-based pair, or null if there is no pair or more than one. Independent brute force. */
    static int[] onlyPair(int[] numbers, int target) {
        int[] found = null;
        for (int i = 0; i < numbers.length; i++) {
            for (int j = i + 1; j < numbers.length; j++) {
                if (numbers[i] + numbers[j] == target) {
                    if (found != null) {
                        return null;
                    }
                    found = new int[] {i + 1, j + 1};
                }
            }
        }
        return found;
    }

    /** Counts pairs in O(n) using value counts (values lie in [-1000, 1000]); used to guard the large cases. */
    static long pairCount(int[] numbers, int target) {
        long[] count = new long[2001];
        long pairs = 0;
        for (int x : numbers) {
            int need = target - x;
            if (need >= -1000 && need <= 1000) {
                pairs += count[need + 1000];
            }
            count[x + 1000]++;
        }
        return pairs;
    }

    static void check(int[] numbers, int target, int first, int second) {
        String label = "n=" + numbers.length + ", target=" + target;
        // Guard against a wrong test: the statement's constraints and the "exactly one solution" promise.
        if (numbers.length < 2 || numbers.length > 30_000 || target < -1000 || target > 1000) {
            throw new IllegalStateException(label + ": bad test case, outside the constraints");
        }
        for (int i = 0; i < numbers.length; i++) {
            if (numbers[i] < -1000 || numbers[i] > 1000 || (i > 0 && numbers[i - 1] > numbers[i])) {
                throw new IllegalStateException(label + ": bad test case, values out of range or not sorted");
            }
        }
        if (pairCount(numbers, target) != 1) {
            throw new IllegalStateException(label + ": bad test case, it does not have exactly one valid pair");
        }
        int[] before = numbers.clone();
        int[] result = new Solution().twoSum(numbers, target);
        if (result == null || result.length != 2 || result[0] != first || result[1] != second) {
            throw new AssertionError(label + ": expected [" + first + ", " + second + "] but got " + Arrays.toString(result));
        }
        if (!Arrays.equals(before, numbers)) {
            throw new AssertionError(label + ": the input array was modified");
        }
        cases++;
    }
}
