import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Median of Two Sorted Arrays page (run by
 * `npm run problems:verify`). The reference concatenates both arrays, sorts the copy with
 * Arrays.sort and reads the middle, so it shares no logic with merging, k-th selection or
 * partitioning.
 *
 * Doubles are compared with ==. That is exact here: every median is either one array value
 * (|v| <= 10^6) or (a + b) / 2.0 with |a + b| <= 2 * 10^6 < 2^53, so a + b converts to a double
 * without rounding and halving only lowers the exponent.
 */
class Tests {
    static final int MAX_LEN = 1000;
    static final int MAX_V = 1_000_000;
    static int cases = 0;

    public static void main(String[] args) {
        // Examples in section 1
        check(new int[] {1, 3}, new int[] {2}, 2.0);
        check(new int[] {1, 2}, new int[] {3, 4}, 2.5);

        // Dry-run inputs in section 4 and traces in section 7
        check(new int[] {1, 7, 12, 13}, new int[] {2, 3, 4, 6, 8, 11}, 6.5); // merge, k-th and partition dry runs (probe goes left, then right)
        check(new int[] {1, 4, 7, 9}, new int[] {2, 3, 5, 8, 10, 12}, 6.0); // first partition probe already valid
        check(new int[] {3, 8, 9}, new int[] {1, 2, 4, 5, 6, 7}, 5.0);    // odd total
        check(new int[] {}, new int[] {1}, 1.0);                           // m = 0, smallest input
        check(new int[] {5}, new int[] {}, 5.0);                           // n = 0
        check(new int[] {}, new int[] {2, 3}, 2.5);                        // one array empty, even total
        check(new int[] {1, 2}, new int[] {3, 4, 5, 6}, 3.5);              // every nums1 value goes left
        check(new int[] {7, 8}, new int[] {1, 2, 3, 4}, 3.5);              // every nums1 value goes right
        check(new int[] {2, 2, 2}, new int[] {2, 2}, 2.0);                 // all equal
        check(new int[] {1, 1, 3}, new int[] {1, 3, 3}, 2.0);              // duplicates across arrays
        check(new int[] {-5, -3}, new int[] {-4, -1}, -3.5);               // negatives, negative half
        check(new int[] {-1}, new int[] {0}, -0.5);
        check(new int[] {1}, new int[] {2}, 1.5);                          // integer division would give 1.0
        check(new int[] {1, 2, 3, 4, 5}, new int[] {6}, 3.5);              // longer array first: needs the swap
        check(new int[] {4}, new int[] {1, 2, 3, 5, 6}, 3.5);

        // Value extremes: the sum of the two middle values is at most 2 * 10^6 in absolute value
        check(new int[] {MAX_V}, new int[] {MAX_V}, 1_000_000.0);
        check(new int[] {-MAX_V}, new int[] {-MAX_V}, -1_000_000.0);
        check(new int[] {-MAX_V}, new int[] {MAX_V}, 0.0);
        check(new int[] {-MAX_V, MAX_V - 1}, new int[] {}, -0.5);
        check(new int[] {}, new int[] {MAX_V - 1, MAX_V}, MAX_V - 0.5);

        // Size extremes: m, n <= 1000, 1 <= m + n
        int[] big = new int[MAX_LEN];
        for (int i = 0; i < MAX_LEN; i++) big[i] = -MAX_V + 2 * i;
        int[] big2 = new int[MAX_LEN];
        for (int i = 0; i < MAX_LEN; i++) big2[i] = MAX_V - 2 * (MAX_LEN - 1 - i);
        check(big, new int[] {}, reference(big, new int[] {}));
        check(new int[] {}, big, reference(new int[] {}, big));
        check(big, big2, reference(big, big2));
        check(big2, big, reference(big2, big));
        check(big, big, reference(big, big));
        check(new int[] {0}, big2, reference(new int[] {0}, big2));
        check(big, new int[] {MAX_V}, reference(big, new int[] {MAX_V}));
        int[] maxes = new int[MAX_LEN];
        Arrays.fill(maxes, MAX_V);
        int[] mins = new int[MAX_LEN];
        Arrays.fill(mins, -MAX_V);
        check(maxes, maxes, 1_000_000.0);
        check(mins, maxes, 0.0);
        check(maxes, mins, 0.0);

        // Every pair of arrays with m + n <= 6 over values {0, 1, 2} (sorted, so each array is a multiset)
        int[][] small = allSorted(6, 3);
        for (int[] a : small) {
            for (int[] b : small) {
                if (a.length + b.length >= 1 && a.length + b.length <= 6) check(a, b, reference(a, b));
            }
        }

        // Random inputs against the sorting reference: empty arrays, heavy duplicates, full range
        Random random = new Random(20261114L);
        for (int t = 0; t < 20000; t++) {
            int m = random.nextInt(4) == 0 ? 0 : random.nextInt(t < 15000 ? 12 : MAX_LEN + 1);
            int n = random.nextInt(t < 15000 ? 12 : MAX_LEN + 1);
            if (m + n == 0) n = 1;
            int range = random.nextBoolean() ? 5 : MAX_V;
            check(randomSorted(random, m, range), randomSorted(random, n, range), null);
        }
        System.out.println("PASS " + cases + " cases");
    }

    static int[] randomSorted(Random random, int len, int range) {
        int[] a = new int[len];
        for (int i = 0; i < len; i++) a[i] = random.nextInt(2 * range + 1) - range;
        Arrays.sort(a);
        return a;
    }

    /** Every sorted array of length 0..maxLen over values 0..values-1. */
    static int[][] allSorted(int maxLen, int values) {
        java.util.List<int[]> out = new java.util.ArrayList<>();
        build(new int[maxLen], 0, 0, values, out);
        return out.toArray(new int[0][]);
    }

    static void build(int[] buf, int len, int from, int values, java.util.List<int[]> out) {
        out.add(Arrays.copyOf(buf, len));
        if (len == buf.length) return;
        for (int v = from; v < values; v++) {
            buf[len] = v;
            build(buf, len + 1, v, values, out);
        }
    }

    static double reference(int[] a, int[] b) {
        int[] all = new int[a.length + b.length];
        System.arraycopy(a, 0, all, 0, a.length);
        System.arraycopy(b, 0, all, a.length, b.length);
        Arrays.sort(all);
        int t = all.length;
        return t % 2 == 1 ? all[t / 2] : (all[t / 2 - 1] + all[t / 2]) / 2.0;
    }

    static void check(int[] nums1, int[] nums2, Double expected) {
        // Guard: reject inputs that break the problem's guarantees.
        if (nums1.length > MAX_LEN || nums2.length > MAX_LEN || nums1.length + nums2.length < 1) {
            throw new IllegalStateException("bad test case: sizes " + nums1.length + ", " + nums2.length);
        }
        for (int[] arr : new int[][] {nums1, nums2}) {
            for (int i = 0; i < arr.length; i++) {
                if (arr[i] < -MAX_V || arr[i] > MAX_V || (i > 0 && arr[i - 1] > arr[i])) {
                    throw new IllegalStateException("bad test case: not sorted or out of range " + Arrays.toString(arr));
                }
            }
        }
        double want = reference(nums1, nums2);
        if (expected != null && expected != want) {
            throw new IllegalStateException("bad test case: expected " + expected + " but the reference says " + want);
        }
        int[] copy1 = nums1.clone();
        int[] copy2 = nums2.clone();
        double got = new Solution().findMedianSortedArrays(nums1, nums2);
        if (got != want) {
            throw new AssertionError("nums1=" + Arrays.toString(copy1) + " nums2=" + Arrays.toString(copy2)
                    + ": expected " + want + " but got " + got);
        }
        if (!Arrays.equals(copy1, nums1) || !Arrays.equals(copy2, nums2)) {
            throw new AssertionError("the input arrays were modified");
        }
        cases++;
    }
}
