import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Trapping Rain Water page (run by `npm run problems:verify`).
 * The reference fills water by simulation, level by level, in long arithmetic: for every height
 * level k = 1..max, a cell at level k holds water when it is empty and has a bar of height >= k
 * somewhere to its left and to its right. It does not use the min(maxLeft, maxRight) formula.
 */
class Tests {
    static int cases = 0;
    static final int H = 100_000;

    public static void main(String[] args) {
        // Examples and dry-run inputs used on the page
        check(new int[] {0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1}, 6);  // larger-max side returns 17; add-before-update returns 1
        check(new int[] {4, 2, 0, 3, 2, 5}, 9);                    // larger-max side 14; add-before-update 0; stack width bug 7
        check(new int[] {3, 0, 2, 0, 4}, 7);                       // stack dry run

        // Edge cases listed in section 3 and traced in section 7
        check(new int[] {5}, 0);                                   // n = 1
        check(new int[] {0}, 0);
        check(new int[] {H}, 0);
        check(new int[] {2, 7}, 0);                                // n = 2
        check(new int[] {7, 2}, 0);
        check(new int[] {H, H}, 0);
        check(new int[] {1, 2, 3, 4}, 0);                          // increasing
        check(new int[] {4, 3, 2, 1}, 0);                          // decreasing
        check(new int[] {3, 3, 3}, 0);                             // flat
        check(new int[] {0, 0, 0, 0}, 0);                          // all zeros
        check(new int[] {3, 1, 0, 1, 3}, 7);                       // V-shaped
        check(new int[] {2, 0, 2, 2, 0, 2}, 4);                    // plateau between two pools
        check(new int[] {1, 2, 1}, 0);                             // a peak: excluding the bar without clamping gives -3
        check(new int[] {5, 0, 5}, 5);
        check(new int[] {0, 5, 0}, 0);
        check(new int[] {2, 1, 0, 1, 2, 1, 0, 1, 2}, 8);           // a W

        // Every array of length 1..7 over heights {0, 1, 2, 3}
        for (int len = 1; len <= 7; len++) {
            int total = 1 << (2 * len);
            for (int code = 0; code < total; code++) {
                int[] h = new int[len];
                int c = code;
                for (int i = 0; i < len; i++) {
                    h[i] = c & 3;
                    c >>= 2;
                }
                check(h, reference(h));
            }
        }

        // Random inputs against the reference (small heights so the level simulation stays cheap)
        Random random = new Random(20261113L);
        for (int t = 0; t < 3000; t++) {
            int len = 1 + random.nextInt(80);
            int maxH = 1 + random.nextInt(40);
            int[] h = new int[len];
            for (int i = 0; i < len; i++) {
                h[i] = random.nextInt(maxH + 1);
            }
            check(h, reference(h));
        }

        // Largest n = 2 * 10^4
        int n = 20_000;
        int[] basin = new int[n];
        basin[0] = H;
        basin[n - 1] = H;
        check(basin, 1_999_800_000);                               // (n - 2) * 10^5: the overflow extreme
        int[] tallEverywhere = new int[n];
        Arrays.fill(tallEverywhere, H);
        check(tallEverywhere, 0);                                  // flat at the maximum height
        int[] valley = new int[n];
        for (int i = 0; i < n; i++) {
            valley[i] = Math.abs(n / 2 - i) * 10;                  // V-shape, walls 100,000 and 99,990
        }
        check(valley, closedFormV(valley));
        int[] comb = new int[n];
        for (int i = 0; i < n; i += 2) {
            comb[i] = H;                                           // H, 0, H, 0, ..., ends with 0
        }
        check(comb, (n / 2 - 1) * H);                              // 9,999 gaps of depth 10^5
        int[] staircase = new int[n];
        for (int i = 0; i < n; i++) {
            staircase[i] = i * 5;                                  // strictly increasing, max 99,995
        }
        check(staircase, 0);
        int[] randomLarge = new int[n];
        for (int i = 0; i < n; i++) {
            randomLarge[i] = random.nextInt(H + 1);
        }
        check(randomLarge, formulaReference(randomLarge));

        System.out.println("PASS " + cases + " cases");
    }

    /** Level-by-level simulation, independent of the per-column formula. Cost O(n * max height). */
    static int reference(int[] h) {
        int max = 0;
        for (int x : h) {
            max = Math.max(max, x);
        }
        long water = 0;
        for (int k = 1; k <= max; k++) {
            int first = -1;
            int last = -1;
            for (int i = 0; i < h.length; i++) {
                if (h[i] >= k) {
                    if (first == -1) {
                        first = i;
                    }
                    last = i;
                }
            }
            // At level k, every empty cell strictly between the first and last bar reaching k is enclosed.
            for (int i = first + 1; i < last; i++) {
                if (h[i] < k) {
                    water++;
                }
            }
        }
        return (int) water;
    }

    /** O(n) prefix/suffix reference in long arithmetic, for the large random case only. */
    static int formulaReference(int[] h) {
        int n = h.length;
        long[] suffix = new long[n + 1];
        for (int i = n - 1; i >= 0; i--) {
            suffix[i] = Math.max(suffix[i + 1], h[i]);
        }
        long prefix = 0;
        long water = 0;
        for (int i = 0; i < n; i++) {
            prefix = Math.max(prefix, h[i]);
            water += Math.min(prefix, suffix[i]) - h[i];
        }
        return (int) water;
    }

    /** For a V whose lowest point is in the middle, every column fills to the lower of the two ends. */
    static int closedFormV(int[] h) {
        long level = Math.min(h[0], h[h.length - 1]);
        long water = 0;
        for (int x : h) {
            water += Math.max(0, level - x);
        }
        return (int) water;
    }

    static void check(int[] h, int expected) {
        String label = Arrays.toString(h.length <= 12 ? h : Arrays.copyOf(h, 12)) + (h.length > 12 ? "..." : "");
        // Guard against a wrong test: 1 <= n <= 2 * 10^4 and 0 <= height[i] <= 10^5.
        if (h.length < 1 || h.length > 20_000) {
            throw new IllegalStateException(label + ": bad test case, n out of range");
        }
        for (int x : h) {
            if (x < 0 || x > H) {
                throw new IllegalStateException(label + ": bad test case, height " + x + " out of range");
            }
        }
        int[] given = h.clone();
        int got = new Solution().trap(given);
        if (got != expected) {
            throw new AssertionError(label + ": expected " + expected + ", got " + got);
        }
        if (!Arrays.equals(given, h)) {
            throw new AssertionError(label + ": the input array was modified");
        }
        cases++;
    }
}
