import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

/**
 * Tests for every "class Solution" on the 4Sum page (run by `npm run problems:verify`).
 * Quadruplets may come back in any order, so results are compared as sets of sorted quadruplets,
 * after checking that none is returned twice. Two independent references, both in long arithmetic:
 * an O(n^4) brute force for small inputs and an O(d^3) count-based one (d distinct values) for every input.
 */
class Tests {
    static int cases = 0;
    static final int BIG = 1_000_000_000;

    public static void main(String[] args) {
        // Examples and dry-run inputs used on the page
        check(new int[] {2, -1, 0, 1, -2, 2}, 1, "[[-2, -1, 2, 2], [-2, 0, 1, 2]]");
        check(new int[] {3, 3, 3, 3, 3}, 12, "[[3, 3, 3, 3]]");
        check(new int[] {BIG, BIG, BIG, BIG}, -294_967_296, "[]");     // int arithmetic wraps to exactly this target

        // Inputs that break the mistakes shown on the page
        check(new int[] {-5, -4, -3, -2}, -14, "[[-5, -4, -3, -2]]");  // "break if nums[a] > target" loses it
        check(new int[] {-2, -2, -2, 2, 2, 2}, 0, "[[-2, -2, 2, 2]]");  // second-level skip measured from 0 instead of a + 1
        check(new int[] {-BIG, -BIG, -BIG, -BIG}, 294_967_296, "[]");   // wraps the other way
        check(new int[] {-BIG, -BIG, -BIG, 500_000_000, 500_000_000}, -BIG,
            "[[-1000000000, -1000000000, 500000000, 500000000]]");   // an int sum moves the wrong pointer and misses it

        // Edge cases listed in section 3 and traced in section 7
        check(new int[] {1}, 1, "[]");                                  // fewer than four elements
        check(new int[] {1, 2, 3}, 6, "[]");
        check(new int[] {1, 2, 3, 4}, 10, "[[1, 2, 3, 4]]");           // exactly four elements
        check(new int[] {1, 2, 3, 4}, 11, "[]");
        check(new int[] {0, 0, 0, 0, 0, 0}, 0, "[[0, 0, 0, 0]]");
        check(new int[] {2, 2, 2, 2, 2}, 8, "[[2, 2, 2, 2]]");
        check(new int[] {-3, -1, 0, 2, 4, 5}, -100, "[]");

        // Overflow boundaries: true sums from -4 * 10^9 to 4 * 10^9
        check(new int[] {BIG, BIG, BIG, BIG}, BIG, "[]");
        check(new int[] {BIG, BIG, -BIG, -BIG}, 0, "[[-1000000000, -1000000000, 1000000000, 1000000000]]");
        check(new int[] {BIG, BIG, -BIG, 0, 0}, BIG, "[[-1000000000, 0, 1000000000, 1000000000]]");
        check(new int[] {BIG, BIG, BIG, -BIG}, BIG, "[]");                // the only sum is 2 * 10^9
        check(new int[] {-BIG, -BIG, -BIG, BIG, 0, 0}, -BIG, "[[-1000000000, -1000000000, 0, 1000000000]]");
        check(new int[] {BIG, BIG, BIG, BIG, -BIG, -BIG, 0, 0, 1, -1}, BIG, null);
        check(new int[] {0, 0, 0, BIG, BIG, BIG}, -BIG, "[]");

        // Largest inputs, n = 200
        int n = 200;
        int[] equal = new int[n];
        Arrays.fill(equal, 7);
        check(equal, 28, "[[7, 7, 7, 7]]");
        int[] consecutive = new int[n];
        for (int i = 0; i < n; i++) {
            consecutive[i] = i - 100;
        }
        check(consecutive, 0, null);
        check(consecutive, 3, null);
        int[] huge = new int[n];
        Random random = new Random(20261113L);
        for (int i = 0; i < n; i++) {
            huge[i] = random.nextBoolean() ? BIG - random.nextInt(3) : -BIG + random.nextInt(3);
        }
        check(huge, 0, null);
        check(huge, BIG, null);
        check(huge, -BIG, null);
        for (int t = 0; t < 6; t++) {
            int range = t < 3 ? BIG : 30;
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) {
                nums[i] = (int) (random.nextLong(2L * range + 1) - range);
            }
            check(nums, (int) (random.nextLong(2L * Math.min(range * 4L, BIG) + 1) - Math.min(range * 4L, BIG)), null);
        }

        // Random small inputs against the brute force, including values near +-10^9
        for (int t = 0; t < 4000; t++) {
            int length = 1 + random.nextInt(12);
            boolean nearLimit = random.nextInt(4) == 0;
            int range = 1 + random.nextInt(6);
            int[] nums = new int[length];
            for (int i = 0; i < length; i++) {
                int v = random.nextInt(2 * range + 1) - range;
                nums[i] = nearLimit ? (v >= 0 ? BIG - v : -BIG - v + 0) : v;
                if (nums[i] < -BIG) {
                    nums[i] = -BIG;
                }
            }
            int target;
            if (nearLimit) {
                int[] choices = {0, BIG, -BIG, -294_967_296, 294_967_296, 2, -2};
                target = choices[random.nextInt(choices.length)];
            } else {
                target = random.nextInt(4 * range + 1) - 2 * range;
            }
            check(nums, target, null);
        }

        System.out.println("PASS " + cases + " cases");
    }

    static Set<List<Integer>> bruteForce(int[] nums, int target) {
        Set<List<Integer>> found = new HashSet<>();
        int n = nums.length;
        for (int a = 0; a < n; a++) {
            for (int b = a + 1; b < n; b++) {
                for (int c = b + 1; c < n; c++) {
                    for (int d = c + 1; d < n; d++) {
                        if ((long) nums[a] + nums[b] + nums[c] + nums[d] == target) {
                            int[] q = {nums[a], nums[b], nums[c], nums[d]};
                            Arrays.sort(q);
                            found.add(Arrays.asList(q[0], q[1], q[2], q[3]));
                        }
                    }
                }
            }
        }
        return found;
    }

    /** Choose values v1 <= v2 <= v3 among the distinct values; v4 = target - v1 - v2 - v3 must be >= v3 and present often enough. */
    static Set<List<Integer>> byCounts(int[] nums, int target) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : nums) {
            count.merge(x, 1, Integer::sum);
        }
        int[] v = count.keySet().stream().mapToInt(Integer::intValue).sorted().toArray();
        Set<List<Integer>> found = new HashSet<>();
        for (int p = 0; p < v.length; p++) {
            for (int q = p; q < v.length; q++) {
                for (int r = q; r < v.length; r++) {
                    long last = (long) target - v[p] - v[q] - v[r];
                    if (last < v[r] || last > Integer.MAX_VALUE || !count.containsKey((int) last)) {
                        continue;
                    }
                    Map<Integer, Integer> need = new HashMap<>();
                    for (int x : new int[] {v[p], v[q], v[r], (int) last}) {
                        need.merge(x, 1, Integer::sum);
                    }
                    boolean enough = true;
                    for (Map.Entry<Integer, Integer> e : need.entrySet()) {
                        enough &= count.get(e.getKey()) >= e.getValue();
                    }
                    if (enough) {
                        found.add(Arrays.asList(v[p], v[q], v[r], (int) last));
                    }
                }
            }
        }
        return found;
    }

    static void check(int[] nums, int target, String expectedText) {
        String label = (nums.length <= 12 ? Arrays.toString(nums) : "n=" + nums.length) + ", target=" + target;
        // Guard against a wrong test: 1 <= n <= 200, |nums[i]| <= 10^9, |target| <= 10^9.
        if (nums.length < 1 || nums.length > 200 || target < -BIG || target > BIG) {
            throw new IllegalStateException(label + ": bad test case, outside the constraints");
        }
        for (int x : nums) {
            if (x < -BIG || x > BIG) {
                throw new IllegalStateException(label + ": bad test case, value outside [-10^9, 10^9]");
            }
        }
        Set<List<Integer>> expected = byCounts(nums, target);
        if (nums.length <= 40 && !bruteForce(nums, target).equals(expected)) {
            throw new IllegalStateException(label + ": the two references disagree");
        }
        if (expectedText != null) {
            List<List<Integer>> sortedExpected = new ArrayList<>(expected);
            sortedExpected.sort((x, y) -> {
                for (int i = 0; i < 4; i++) {
                    int c = Integer.compare(x.get(i), y.get(i));
                    if (c != 0) {
                        return c;
                    }
                }
                return 0;
            });
            if (!sortedExpected.toString().equals(expectedText)) {
                throw new IllegalStateException(label + ": the page's expected answer " + expectedText + " is wrong, reference says " + sortedExpected);
            }
        }

        List<List<Integer>> result = new Solution().fourSum(nums.clone(), target);
        Set<List<Integer>> got = new HashSet<>();
        for (List<Integer> quad : result) {
            if (quad.size() != 4) {
                throw new AssertionError(label + ": a result entry is not a quadruplet: " + quad);
            }
            Integer[] q = quad.toArray(new Integer[0]);
            Arrays.sort(q);
            if (!got.add(Arrays.asList(q))) {
                throw new AssertionError(label + ": duplicate quadruplet " + Arrays.toString(q));
            }
        }
        if (!got.equals(expected)) {
            throw new AssertionError(label + ": expected " + expected.size() + " quadruplets " + (expected.size() < 20 ? expected : "")
                + " but got " + got.size() + " " + (got.size() < 20 ? got : ""));
        }
        cases++;
    }
}
