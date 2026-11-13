import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Rotate Array page (run by `npm run problems:verify`).
 * rotate returns nothing, so each check inspects the array the method was given.
 * Two independent references: for short arrays, literally rotating by one step k times
 * (no modulo); for every array, the "pull" formula expected[i] = nums[(i - k mod n + n) mod n].
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry-run inputs used on the page
        check(new int[] {10, 20, 30, 40, 50}, 2, new int[] {40, 50, 10, 20, 30});
        check(new int[] {7, 8}, 5, new int[] {8, 7});
        check(new int[] {1, 2, 3, 4, 5, 6}, 2, new int[] {5, 6, 1, 2, 3, 4});
        check(new int[] {10, 20, 30, 40, 50}, 7, new int[] {40, 50, 10, 20, 30});  // 7 mod 5 = 2

        // Edge cases listed in section 3 and traced in section 7
        check(new int[] {10, 20, 30, 40, 50}, 0, new int[] {10, 20, 30, 40, 50});  // k = 0
        check(new int[] {10, 20, 30}, 3, new int[] {10, 20, 30});                  // k = n
        check(new int[] {10, 20, 30}, 6, new int[] {10, 20, 30});                  // k = 2n
        check(new int[] {5}, 0, new int[] {5});                                    // n = 1
        check(new int[] {5}, 100000, new int[] {5});
        check(new int[] {Integer.MIN_VALUE, Integer.MAX_VALUE}, 1,
              new int[] {Integer.MAX_VALUE, Integer.MIN_VALUE});                   // value extremes
        check(new int[] {1, 2, 3, 4, 5, 6}, 3, new int[] {4, 5, 6, 1, 2, 3});      // gcd(6, 3) = 3 cycles
        check(new int[] {1, 2, 3, 4, 5, 6}, 4, new int[] {3, 4, 5, 6, 1, 2});      // gcd(6, 4) = 2 cycles

        // Every length 1..12 with every k in 0..30, distinct values (so any misplacement shows)
        for (int n = 1; n <= 12; n++) {
            for (int k = 0; k <= 30; k++) {
                int[] nums = new int[n];
                for (int i = 0; i < n; i++) {
                    nums[i] = 100 + i;
                }
                check(nums, k, null);
            }
        }

        // Constraint extremes: n = 10^5 with k = 0, 1, n - 1, n, 10^5 and composite gcds
        int big = 100000;
        int[] large = new int[big];
        for (int i = 0; i < big; i++) {
            large[i] = (i % 2 == 0) ? Integer.MIN_VALUE + i : Integer.MAX_VALUE - i;
        }
        for (int k : new int[] {0, 1, big - 1, big, 100000, 50000, 2, 99998, 12345}) {
            check(large, k, null);
        }
        // n = 99,999 with k = 10^5 (k > n), and n = 7 with k = 10^5
        check(Arrays.copyOf(large, 99999), 100000, null);
        check(new int[] {1, 2, 3, 4, 5, 6, 7}, 100000, null);

        // Random inputs against the references
        Random random = new Random(20261113L);
        for (int t = 0; t < 2000; t++) {
            int n = 1 + random.nextInt(t < 1500 ? 40 : 3000);
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) {
                nums[i] = random.nextInt();
            }
            int k = random.nextInt(4) == 0 ? random.nextInt(100001) : random.nextInt(3 * n);
            check(nums, k, null);
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** Pull formulation: index i receives the element from i - k (mod n). Independent of the push form on the page. */
    static int[] pullReference(int[] nums, int k) {
        int n = nums.length;
        int shift = k % n;
        int[] out = new int[n];
        for (int i = 0; i < n; i++) {
            out[i] = nums[(i - shift + n) % n];
        }
        return out;
    }

    /** Literal definition: k single steps to the right, no modulo. Only used for short arrays. */
    static int[] stepReference(int[] nums, int k) {
        int[] a = nums.clone();
        for (int s = 0; s < k; s++) {
            int last = a[a.length - 1];
            for (int i = a.length - 1; i > 0; i--) {
                a[i] = a[i - 1];
            }
            a[0] = last;
        }
        return a;
    }

    static void check(int[] nums, int k, int[] stated) {
        String label = "n=" + nums.length + " k=" + k + " "
                + Arrays.toString(nums.length <= 8 ? nums : Arrays.copyOf(nums, 8)) + (nums.length > 8 ? "..." : "");
        // Guard against a wrong test: 1 <= n <= 10^5 and 0 <= k <= 10^5.
        if (nums.length < 1 || nums.length > 100000) {
            throw new IllegalStateException(label + ": bad test case, n out of range");
        }
        if (k < 0 || k > 100000) {
            throw new IllegalStateException(label + ": bad test case, k out of range");
        }
        int[] expected = pullReference(nums, k);
        if (nums.length * (long) k <= 2_000_000L && !Arrays.equals(expected, stepReference(nums, k))) {
            throw new IllegalStateException(label + ": the two references disagree");
        }
        if (stated != null && !Arrays.equals(expected, stated)) {
            throw new IllegalStateException(label + ": the answer written on the page is wrong");
        }
        int[] given = nums.clone();
        new Solution().rotate(given, k);                     // must rotate this very array in place
        if (!Arrays.equals(expected, given)) {
            String got = Arrays.toString(given.length <= 8 ? given : Arrays.copyOf(given, 8));
            throw new AssertionError(label + ": got " + got);
        }
        cases++;
    }
}
