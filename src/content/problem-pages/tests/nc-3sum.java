import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

/**
 * Tests for every "class Solution" on the 3Sum page (run by `npm run problems:verify`).
 * Triplets may come back in any order, so results are compared as sets of sorted triplets,
 * after checking that no triplet is returned twice. Two independent references:
 * an O(n^3) brute force for small inputs and an O(d^2) count-based one (d distinct values) for large ones.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry-run inputs used on the page
        check(new int[] {0, -1, 2, -3, 1, -1}, "[[-3, 1, 2], [-1, -1, 2], [-1, 0, 1]]");
        check(new int[] {0, 0, 0, 0}, "[[0, 0, 0]]");
        check(new int[] {3, -1, 5}, "[]");

        // Inputs that break the mistakes shown on the page
        check(new int[] {-1, -1, 2}, "[[-1, -1, 2]]");             // skipping anchors by looking ahead loses this
        check(new int[] {-2, 0, 0, 2, 2}, "[[-2, 0, 2]]");          // no skip after a hit returns it twice
        check(new int[] {0, 0, 0}, "[[0, 0, 0]]");                  // skip loops without left < right run off the end

        // Edge cases listed in section 3 and traced in section 7
        check(new int[] {1, 2, 3}, "[]");                           // all positive: break at once
        check(new int[] {-3, -2, -1}, "[]");                        // all negative
        check(new int[] {-4, 2, 2}, "[[-4, 2, 2]]");                // smallest input with an answer
        check(new int[] {-4, 2, 2, 2, 2}, "[[-4, 2, 2]]");          // a run of duplicates on the right
        check(new int[] {-2, -2, -2, 1, 1, 4}, "[[-2, -2, 4], [-2, 1, 1]]");
        check(new int[] {-1, 0, 1, 0}, "[[-1, 0, 1]]");

        // Value extremes: |sum| <= 3 * 10^5, far inside int
        check(new int[] {-100_000, 50_000, 50_000}, "[[-100000, 50000, 50000]]");
        check(new int[] {-100_000, 0, 100_000, 100_000, -100_000}, "[[-100000, 0, 100000]]");
        check(new int[] {100_000, 100_000, 100_000}, "[]");

        // Largest inputs, n = 3000, against the count-based reference
        int n = 3000;
        int[] zeros = new int[n];
        check(zeros, "[[0, 0, 0]]");
        int[] consecutive = new int[n];                             // -1499 .. 1500: 1,124,250 distinct triplets
        for (int i = 0; i < n; i++) {
            consecutive[i] = i - 1499;
        }
        check(consecutive, null);
        int[] noAnswer = new int[n];                                // all equal and positive
        Arrays.fill(noAnswer, 100_000);
        check(noAnswer, "[]");
        Random random = new Random(20261113L);
        for (int t = 0; t < 6; t++) {
            int range = t < 3 ? 100_000 : 50;                       // sparse answers, then dense duplicates
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) {
                nums[i] = random.nextInt(2 * range + 1) - range;
            }
            check(nums, null);
        }

        // Random small inputs against the brute force (the count reference is cross-checked too)
        for (int t = 0; t < 4000; t++) {
            int length = 3 + random.nextInt(14);
            int range = 1 + random.nextInt(8);
            int[] nums = new int[length];
            for (int i = 0; i < length; i++) {
                nums[i] = random.nextInt(2 * range + 1) - range;
            }
            check(nums, null);
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** O(n^3): every triple of indices, kept as a set of sorted triplets. */
    static Set<List<Integer>> bruteForce(int[] nums) {
        Set<List<Integer>> found = new HashSet<>();
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                for (int k = j + 1; k < nums.length; k++) {
                    if (nums[i] + nums[j] + nums[k] == 0) {
                        int[] t = {nums[i], nums[j], nums[k]};
                        Arrays.sort(t);
                        found.add(Arrays.asList(t[0], t[1], t[2]));
                    }
                }
            }
        }
        return found;
    }

    /** O(d^2) expected: choose values a <= b, the third is -a-b >= b, and check there are enough copies. */
    static Set<List<Integer>> byCounts(int[] nums) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : nums) {
            count.merge(x, 1, Integer::sum);
        }
        int[] values = count.keySet().stream().mapToInt(Integer::intValue).sorted().toArray();
        Set<List<Integer>> found = new HashSet<>();
        for (int p = 0; p < values.length; p++) {
            for (int q = p; q < values.length; q++) {
                int a = values[p];
                int b = values[q];
                int c = -a - b;
                if (c < b || !count.containsKey(c)) {
                    continue;
                }
                Map<Integer, Integer> need = new HashMap<>();
                need.merge(a, 1, Integer::sum);
                need.merge(b, 1, Integer::sum);
                need.merge(c, 1, Integer::sum);
                boolean enough = true;
                for (Map.Entry<Integer, Integer> e : need.entrySet()) {
                    enough &= count.get(e.getKey()) >= e.getValue();
                }
                if (enough) {
                    found.add(Arrays.asList(a, b, c));
                }
            }
        }
        return found;
    }

    /** expected == null: compute it from the references. Otherwise also compare with the given text. */
    static void check(int[] nums, String expectedText) {
        String label = nums.length <= 12 ? Arrays.toString(nums) : "n=" + nums.length;
        // Guard against a wrong test: 3 <= n <= 3000, |nums[i]| <= 10^5.
        if (nums.length < 3 || nums.length > 3000) {
            throw new IllegalStateException(label + ": bad test case, length outside [3, 3000]");
        }
        for (int x : nums) {
            if (x < -100_000 || x > 100_000) {
                throw new IllegalStateException(label + ": bad test case, value outside [-10^5, 10^5]");
            }
        }
        Set<List<Integer>> expected = byCounts(nums);
        if (nums.length <= 60 && !bruteForce(nums).equals(expected)) {
            throw new IllegalStateException(label + ": the two references disagree");
        }
        if (expectedText != null) {
            List<List<Integer>> sortedExpected = new ArrayList<>(expected);
            sortedExpected.sort((x, y) -> x.get(0).equals(y.get(0)) ? Integer.compare(x.get(1), y.get(1)) : Integer.compare(x.get(0), y.get(0)));
            if (!sortedExpected.toString().equals(expectedText)) {
                throw new IllegalStateException(label + ": the page's expected answer " + expectedText + " is wrong, reference says " + sortedExpected);
            }
        }

        List<List<Integer>> result = new Solution().threeSum(nums.clone());
        Set<List<Integer>> got = new HashSet<>();
        for (List<Integer> triplet : result) {
            if (triplet.size() != 3) {
                throw new AssertionError(label + ": a result entry is not a triplet: " + triplet);
            }
            Integer[] t = triplet.toArray(new Integer[0]);
            Arrays.sort(t);
            if (!got.add(Arrays.asList(t))) {
                throw new AssertionError(label + ": duplicate triplet " + Arrays.toString(t));
            }
        }
        if (!got.equals(expected)) {
            throw new AssertionError(label + ": expected " + expected.size() + " triplets " + (expected.size() < 20 ? expected : "")
                + " but got " + got.size() + " " + (got.size() < 20 ? got : ""));
        }
        cases++;
    }
}
