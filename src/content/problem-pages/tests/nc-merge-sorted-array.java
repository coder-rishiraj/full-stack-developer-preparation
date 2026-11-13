import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Merge Sorted Array page (run by `npm run problems:verify`).
 * Each solution is compiled together with this file and must pass all cases.
 * Like the judge, the check reads nums1 after the void call and compares it with the sorted
 * multiset of the m real values of nums1 and the n values of nums2. It also checks that nums2
 * was not changed (every solution on the page leaves it intact).
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry runs on the page
        check(new int[] {1, 4, 7, 0, 0, 0}, 3, new int[] {2, 4, 5});
        check(new int[] {0}, 0, new int[] {3});
        check(new int[] {4, 5, 0, 0}, 2, new int[] {1, 2});      // all of nums2 smaller; the "stop early" bug fails here
        check(new int[] {3, 4, 0, 0}, 2, new int[] {1, 2});      // forward-in-place bug fails here
        // LeetCode's examples
        check(new int[] {1, 2, 3, 0, 0, 0}, 3, new int[] {2, 5, 6});
        check(new int[] {1}, 1, new int[] {});

        // Edge cases from sections 3 and 7
        check(new int[] {5}, 1, new int[] {});                   // n = 0
        check(new int[] {0, 0, 0}, 0, new int[] {-3, 0, 7});     // m = 0, several values
        check(new int[] {0}, 0, new int[] {1});                  // m = 0: reading nums1[-1] would throw
        check(new int[] {1, 2, 0, 0}, 2, new int[] {3, 4});      // all of nums2 larger
        check(new int[] {-1, 0, 0, 0}, 2, new int[] {0, 0});     // ties and real zeros
        check(new int[] {2, 2, 0, 0}, 2, new int[] {2, 2});      // all equal
        check(new int[] {-1000000000, 1000000000, 0}, 2, new int[] {0});
        check(new int[] {1000000000, 0}, 1, new int[] {-1000000000});

        // Constraint extremes: m + n = 200
        int[] a = new int[200];
        for (int i = 0; i < 100; i++) a[i] = 1_000_000_000 - 100 + i;
        int[] b = new int[100];
        for (int i = 0; i < 100; i++) b[i] = -1_000_000_000 + i;
        check(a, 100, b);                                          // all of nums2 smaller, at the value limits
        check(new int[200], 0, sortedRandom(new Random(7), 200));  // m = 0, n = 200
        int[] full = sortedRandom(new Random(8), 200);
        check(full, 200, new int[] {});                            // m = 200, n = 0

        // Random inputs against an independent reference
        Random random = new Random(20261113L);
        for (int t = 0; t < 3000; t++) {
            int total = 1 + random.nextInt(t < 2000 ? 10 : 200);
            int m = random.nextInt(total + 1);
            int n = total - m;
            int range = random.nextInt(3) == 0 ? 5 : 2_000_000_001;
            int[] real = sortedRandom(random, m, range);
            int[] nums1 = new int[m + n];
            System.arraycopy(real, 0, nums1, 0, m);
            check(nums1, m, sortedRandom(random, n, range));
        }

        System.out.println("PASS " + cases + " cases");
    }

    static int[] sortedRandom(Random random, int n) {
        return sortedRandom(random, n, 2_000_000_001);
    }

    static int[] sortedRandom(Random random, int n, int range) {
        int[] values = new int[n];
        for (int i = 0; i < n; i++) {
            long v = (range == 2_000_000_001)
                    ? -1_000_000_000L + (long) (random.nextDouble() * 2_000_000_001L)
                    : random.nextInt(range) - range / 2;
            values[i] = (int) Math.max(-1_000_000_000L, Math.min(1_000_000_000L, v));
        }
        Arrays.sort(values);
        return values;
    }

    static void check(int[] nums1, int m, int[] nums2) {
        int n = nums2.length;
        String label = Arrays.toString(nums1) + ", m=" + m + ", " + Arrays.toString(nums2) + ", n=" + n;
        // Guard against a wrong test case: the statement's guarantees.
        if (nums1.length != m + n || m < 0 || n > 200 || m > 200 || m + n < 1 || m + n > 200) {
            throw new IllegalStateException(label + ": bad test case, sizes outside the constraints");
        }
        for (int i = 0; i < m; i++) {
            if (i > 0 && nums1[i - 1] > nums1[i]) throw new IllegalStateException(label + ": bad test case, nums1 not sorted");
        }
        for (int j = 0; j < n; j++) {
            if (j > 0 && nums2[j - 1] > nums2[j]) throw new IllegalStateException(label + ": bad test case, nums2 not sorted");
        }
        for (int i = 0; i < m; i++) {
            if (nums1[i] < -1_000_000_000 || nums1[i] > 1_000_000_000) throw new IllegalStateException(label + ": bad test case, value out of range");
        }
        for (int x : nums2) {
            if (x < -1_000_000_000 || x > 1_000_000_000) throw new IllegalStateException(label + ": bad test case, value out of range");
        }
        // Independent reference: concatenate the real values and sort.
        int[] expected = new int[m + n];
        System.arraycopy(nums1, 0, expected, 0, m);
        System.arraycopy(nums2, 0, expected, m, n);
        Arrays.sort(expected);
        int[] nums2Before = nums2.clone();

        new Solution().merge(nums1, m, nums2, n);

        if (!Arrays.equals(expected, nums1)) {
            throw new AssertionError(label + ": expected " + Arrays.toString(expected) + " but nums1 is " + Arrays.toString(nums1));
        }
        if (!Arrays.equals(nums2Before, nums2)) {
            throw new AssertionError(label + ": nums2 was modified");
        }
        cases++;
    }
}
