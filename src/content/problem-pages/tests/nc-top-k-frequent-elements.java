import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Top K Frequent Elements page (run by `npm run problems:verify`).
 * The answer may be in any order, so results are compared as sets. Every input is checked to have a
 * unique top-k set, as the problem guarantees; inputs with a tie at the k-th place are rejected.
 */
class Tests {
    static final int LIMIT = 10_000;
    static final int MAX_N = 100_000;
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry-run inputs used on the page
        check(new int[] {4, 4, 7, 4, 7, 2}, 2, new int[] {4, 7});
        check(new int[] {3, -3, -3, 0, 3, -3}, 1, new int[] {-3});
        check(new int[] {4, 4, 7, 4, 7, 2}, 1, new int[] {4});
        check(new int[] {4, 4, 7, 4, 7, 2}, 3, new int[] {4, 7, 2});

        // Edge cases listed in section 3 and traced in section 7
        check(new int[] {9}, 1, new int[] {9});                               // n = 1: frequency n needs bucket n
        check(new int[] {5, 5, 5, 5}, 1, new int[] {5});                      // one distinct value
        check(new int[] {1, 2, 3}, 3, new int[] {1, 2, 3});                   // k = number of distinct values
        check(new int[] {-10_000, 10_000, 10_000}, 1, new int[] {10_000});    // value extremes
        check(new int[] {-10_000, 10_000, -10_000}, 2, new int[] {-10_000, 10_000});
        check(new int[] {1, 1, 2, 2, 3}, 2, new int[] {1, 2});                // tie inside the answer is fine
        check(new int[] {0, 0, 0, -1, -1, 2}, 2, new int[] {0, -1});

        // Largest inputs, n = 10^5
        int[] same = new int[MAX_N];
        Arrays.fill(same, -7);
        check(same, 1, new int[] {-7});
        // Every allowed value (20,001 of them) appears; k = all of them
        int[] everyValue = new int[MAX_N];
        for (int i = 0; i < MAX_N; i++) {
            everyValue[i] = (i % (2 * LIMIT + 1)) - LIMIT;
        }
        check(everyValue, 2 * LIMIT + 1, reference(everyValue, 2 * LIMIT + 1));
        // Value v (for v = 1..446) appears v times: all frequencies differ, so every k is valid
        int[] staircase = new int[MAX_N];
        int pos = 0;
        for (int v = 1; v <= 446; v++) {
            for (int c = 0; c < v; c++) {
                staircase[pos++] = v * 20 - LIMIT;
            }
        }
        while (pos < MAX_N) {
            staircase[pos++] = LIMIT;                                    // 319 copies: ties with v = 319, far from any tested boundary
        }
        shuffle(staircase, new Random(7));
        for (int k : new int[] {1, 2, 50, 300, 447}) {
            check(staircase, k, reference(staircase, k));
        }

        // Random inputs, keeping only (nums, k) pairs whose top-k set is unique
        Random random = new Random(20261113L);
        int made = 0;
        while (made < 3000) {
            int len = 1 + random.nextInt(made < 2700 ? 30 : 5000);
            int spread = 1 + random.nextInt(made < 2700 ? 8 : 400);
            int[] nums = new int[len];
            for (int i = 0; i < len; i++) {
                nums[i] = random.nextInt(spread) - spread / 2;
            }
            List<Integer> validK = validKs(nums);
            int k = validK.get(random.nextInt(validK.size()));
            check(nums, k, reference(nums, k));
            made++;
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** Sorted frequencies, largest first, computed without hashing (counting over the value range). */
    static int[] frequenciesDescending(int[] nums) {
        int[] count = new int[2 * LIMIT + 1];
        for (int x : nums) {
            count[x + LIMIT]++;
        }
        int[] freqs = Arrays.stream(count).filter(c -> c > 0).sorted().toArray();
        for (int i = 0, j = freqs.length - 1; i < j; i++, j--) {
            int t = freqs[i];
            freqs[i] = freqs[j];
            freqs[j] = t;
        }
        return freqs;
    }

    /** Every k for which the top-k set is unique: k = d, or the k-th frequency beats the (k+1)-th. */
    static List<Integer> validKs(int[] nums) {
        int[] f = frequenciesDescending(nums);
        List<Integer> ks = new ArrayList<>();
        for (int k = 1; k <= f.length; k++) {
            if (k == f.length || f[k - 1] > f[k]) {
                ks.add(k);
            }
        }
        return ks;
    }

    /** Independent reference: all values whose frequency is at least the k-th largest frequency. */
    static int[] reference(int[] nums, int k) {
        int[] count = new int[2 * LIMIT + 1];
        for (int x : nums) {
            count[x + LIMIT]++;
        }
        int threshold = frequenciesDescending(nums)[k - 1];
        List<Integer> out = new ArrayList<>();
        for (int v = 0; v < count.length; v++) {
            if (count[v] > 0 && count[v] >= threshold) {
                out.add(v - LIMIT);
            }
        }
        return out.stream().mapToInt(Integer::intValue).toArray();
    }

    static void shuffle(int[] a, Random random) {
        for (int i = a.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            int t = a[i];
            a[i] = a[j];
            a[j] = t;
        }
    }

    static void check(int[] nums, int k, int[] expected) {
        String label = "n=" + nums.length + ", k=" + k
            + (nums.length <= 12 ? ", nums=" + Arrays.toString(nums) : "");
        // Guard against a wrong test: 1 <= n <= 10^5, values in [-10^4, 10^4],
        // 1 <= k <= number of distinct values, and the top-k set is unique.
        if (nums.length < 1 || nums.length > MAX_N) {
            throw new IllegalStateException(label + ": bad test case, n out of range");
        }
        for (int x : nums) {
            if (x < -LIMIT || x > LIMIT) {
                throw new IllegalStateException(label + ": bad test case, value " + x + " out of range");
            }
        }
        int distinct = frequenciesDescending(nums).length;
        if (k < 1 || k > distinct) {
            throw new IllegalStateException(label + ": bad test case, k out of range");
        }
        if (!validKs(nums).contains(k)) {
            throw new IllegalStateException(label + ": bad test case, the top-k set is not unique");
        }
        int[] want = expected.clone();
        Arrays.sort(want);
        if (!Arrays.equals(want, sortedCopy(reference(nums, k)))) {
            throw new IllegalStateException(label + ": bad test case, expected answer is wrong");
        }

        int[] result = new Solution().topKFrequent(nums.clone(), k);
        if (result == null || result.length != k) {
            throw new AssertionError(label + ": expected " + k + " elements, got " + Arrays.toString(result));
        }
        int[] got = sortedCopy(result);
        if (!Arrays.equals(want, got)) {
            throw new AssertionError(label + ": expected " + Arrays.toString(want) + " in any order, got " + Arrays.toString(result));
        }
        cases++;
    }

    static int[] sortedCopy(int[] a) {
        int[] c = a.clone();
        Arrays.sort(c);
        return c;
    }
}
