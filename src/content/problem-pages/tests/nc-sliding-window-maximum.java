import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Sliding Window Maximum page (run by `npm run problems:verify`).
 * Small inputs are checked against the direct O(n * k) scan of every window; large inputs against a
 * sparse table (range-maximum queries in O(1) after O(n log n) preprocessing), which shares no code
 * or idea with the deque, heap or block solutions.
 */
class Tests {
    static int cases = 0;
    static final int N = 100_000;
    static final int V = 10_000;

    public static void main(String[] args) {
        // Examples in section 1 and dry-run inputs in section 4
        check(new int[] {1, 3, -1, -3, 5, 3, 6, 7}, 3, new int[] {3, 3, 5, 5, 6, 7});
        check(new int[] {1}, 1, new int[] {1});
        check(new int[] {9, 8, 1, 2, 3}, 2, new int[] {9, 8, 2, 3});       // heap dry run: stale tops discarded

        // Edge cases from sections 3, 7 and 11
        check(new int[] {3, 3, 1}, 2, new int[] {3, 3});                    // values-in-deque with `<=` returns [3, 1]
        check(new int[] {5, 1, 1}, 2, new int[] {5, 1});                    // expiry test `< i - k` returns [5, 5]
        check(new int[] {4, 2}, 2, new int[] {4});                          // k = n
        check(new int[] {2, 4}, 1, new int[] {2, 4});                       // k = 1
        check(new int[] {1, 2, 3, 4, 5}, 3, new int[] {3, 4, 5});           // increasing
        check(new int[] {5, 4, 3, 2, 1}, 3, new int[] {5, 4, 3});           // decreasing
        check(new int[] {7, 7, 7, 7}, 2, new int[] {7, 7, 7});              // all equal
        check(new int[] {-V, -V, -V}, 2, new int[] {-V, -V});               // all at the lower value limit
        check(new int[] {-V, V, -V, V}, 3, new int[] {V, V});
        check(new int[] {1, -1}, 1, new int[] {1, -1});
        check(new int[] {-7, -8, 7, 5, 7, 1, 6, 0}, 4, new int[] {7, 7, 7, 7, 7});
        check(new int[] {1, 3, 1, 2, 0, 5}, 3, new int[] {3, 3, 2, 5});

        // Every array of length 1..7 over {-1, 0, 1, 2}, every k
        for (int len = 1; len <= 7; len++) {
            int total = 1 << (2 * len);
            for (int code = 0; code < total; code++) {
                int[] nums = new int[len];
                int c = code;
                for (int i = 0; i < len; i++) {
                    nums[i] = (c & 3) - 1;
                    c >>= 2;
                }
                for (int k = 1; k <= len; k++) {
                    check(nums, k, bruteForce(nums, k));
                }
            }
        }

        // Random inputs against the brute force
        Random random = new Random(20261114L);
        for (int trial = 0; trial < 5_000; trial++) {
            int n = 1 + random.nextInt(200);
            int k = 1 + random.nextInt(n);
            int range = 1 + random.nextInt(trial % 3 == 0 ? 5 : 2 * V + 1);
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) {
                nums[i] = Math.max(-V, Math.min(V, random.nextInt(range) - range / 2));
            }
            check(nums, k, bruteForce(nums, k));
        }

        // Structured large inputs: n = 10^5
        int[] increasing = new int[N];
        int[] decreasing = new int[N];
        int[] equal = new int[N];
        int[] zigzag = new int[N];
        int[] randomLarge = new int[N];
        for (int i = 0; i < N; i++) {
            increasing[i] = -V + i / 5;                                     // non-decreasing from -10^4 to 9,999
            decreasing[i] = V - i / 5;
            equal[i] = V;
            zigzag[i] = (i % 2 == 0) ? V : -V;
            randomLarge[i] = random.nextInt(2 * V + 1) - V;
        }
        int[] strictlyDecreasing = new int[N];
        for (int i = 0; i < N; i++) {
            strictlyDecreasing[i] = V - (i % (2 * V + 1));                  // strictly decreasing runs of 20,001
        }
        int[][] arrays = {increasing, decreasing, equal, zigzag, randomLarge, strictlyDecreasing};
        int[] ks = {1, 2, 3, 1_000, N / 2, N - 1, N};
        for (int[] nums : arrays) {
            for (int k : ks) {
                check(nums, k, sparseTableReference(nums, k));
            }
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** Direct definition: scan every window. O(n * k), for small inputs only. */
    static int[] bruteForce(int[] nums, int k) {
        int[] result = new int[nums.length - k + 1];
        for (int start = 0; start + k <= nums.length; start++) {
            int max = Integer.MIN_VALUE;
            for (int j = start; j < start + k; j++) {
                max = Math.max(max, nums[j]);
            }
            result[start] = max;
        }
        return result;
    }

    /** Sparse table: table[j][i] = max of nums[i .. i + 2^j - 1]; each window is two overlapping powers of two. */
    static int[] sparseTableReference(int[] nums, int k) {
        int n = nums.length;
        int levels = 1;
        while ((1 << levels) <= n) {
            levels++;
        }
        int[][] table = new int[levels][];
        table[0] = nums.clone();
        for (int j = 1; j < levels; j++) {
            int span = 1 << j;
            table[j] = new int[n - span + 1];
            for (int i = 0; i + span <= n; i++) {
                table[j][i] = Math.max(table[j - 1][i], table[j - 1][i + span / 2]);
            }
        }
        int j = 31 - Integer.numberOfLeadingZeros(k);
        int[] result = new int[n - k + 1];
        for (int i = 0; i + k <= n; i++) {
            result[i] = Math.max(table[j][i], table[j][i + k - (1 << j)]);
        }
        return result;
    }

    static void check(int[] nums, int k, int[] expected) {
        String label = Arrays.toString(nums.length <= 12 ? nums : Arrays.copyOf(nums, 12))
                + (nums.length > 12 ? "...(n=" + nums.length + ")" : "") + ", k=" + k;
        // Guard against a wrong test: 1 <= n <= 10^5, -10^4 <= nums[i] <= 10^4, 1 <= k <= n.
        if (nums.length < 1 || nums.length > N || k < 1 || k > nums.length) {
            throw new IllegalStateException(label + ": bad test case, n or k out of range");
        }
        for (int x : nums) {
            if (x < -V || x > V) {
                throw new IllegalStateException(label + ": bad test case, value " + x + " out of range");
            }
        }
        if (expected.length != nums.length - k + 1) {
            throw new IllegalStateException(label + ": bad test case, expected has the wrong length");
        }
        int[] given = nums.clone();
        int[] got = new Solution().maxSlidingWindow(given, k);
        if (!Arrays.equals(got, expected)) {
            throw new AssertionError(label + ": expected " + abbreviate(expected) + ", got " + abbreviate(got));
        }
        if (!Arrays.equals(given, nums)) {
            throw new AssertionError(label + ": the input array was modified");
        }
        cases++;
    }

    static String abbreviate(int[] a) {
        return a.length <= 12 ? Arrays.toString(a) : Arrays.toString(Arrays.copyOf(a, 12)) + "...(" + a.length + ")";
    }
}
