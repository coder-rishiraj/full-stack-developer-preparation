import java.util.Random;

/**
 * Tests for every "class Solution" on the Find in Mountain Array page (run by `npm run problems:verify`).
 * The judge provides the MountainArray interface; it is declared here so the solutions compile.
 * CountingMountain plays the judge: it validates the mountain, counts get calls and fails the
 * moment a solution makes a 101st call. The reference is a plain left-to-right scan of the
 * underlying array (allowed in the tests, not in a solution).
 */
interface MountainArray {
    int get(int index);

    int length();
}

class CountingMountain implements MountainArray {
    static final int LIMIT = 100;
    private final int[] values;
    int calls = 0;

    CountingMountain(int[] values) {
        this.values = values.clone();
    }

    @Override
    public int get(int index) {
        if (++calls > LIMIT) {
            throw new AssertionError("more than " + LIMIT + " calls to get");
        }
        if (index < 0 || index >= values.length) {
            throw new AssertionError("get(" + index + ") is out of range for length " + values.length);
        }
        return values[index];
    }

    @Override
    public int length() {
        return values.length;
    }
}

class Tests {
    static final int MAX_LEN = 10_000;
    static final int MAX_V = 1_000_000_000;
    static int cases = 0;
    static int maxCalls = 0;

    public static void main(String[] args) {
        // Examples in section 1
        check(new int[] {1, 2, 3, 4, 5, 3, 1}, 3, 2);
        check(new int[] {0, 1, 2, 4, 2, 1}, 3, -1);

        // Dry-run inputs in section 4 and traces in section 7
        int[] dry = {1, 3, 6, 9, 12, 10, 7, 3};
        check(dry, 3, 1);   // on both sides: the left index wins
        check(dry, 7, 6);   // only on the right
        check(dry, 12, 4);  // the peak
        check(dry, 8, -1);  // absent
        check(dry, 1, 0);   // first index
        check(dry, 0, -1);  // below every value
        check(dry, 13, -1); // above the peak

        // Length 3, every target that matters
        int[] three = {1, 5, 2};
        for (int t = 0; t <= 6; t++) check(three, t, t == 1 ? 0 : t == 5 ? 1 : t == 2 ? 2 : -1);
        check(new int[] {0, 1, 0}, 0, 0);                    // both ends equal: the left end
        check(new int[] {MAX_V - 1, MAX_V, MAX_V - 1}, MAX_V - 1, 0);
        check(new int[] {0, MAX_V, 0}, MAX_V, 1);

        // Every mountain of length 3..7 over values 0..4, every target 0..5
        for (int len = 3; len <= 7; len++) {
            int total = 1;
            for (int i = 0; i < len; i++) total *= 5;
            for (int code = 0; code < total; code++) {
                int[] a = new int[len];
                int c = code;
                for (int i = 0; i < len; i++) {
                    a[i] = c % 5;
                    c /= 5;
                }
                if (!isMountain(a)) continue;
                for (int t = 0; t <= 5; t++) check(a, t, null);
            }
        }

        // Random mountains of all sizes, peak anywhere from 1 to n - 2
        Random random = new Random(20261114L);
        for (int trial = 0; trial < 3000; trial++) {
            int n = 3 + random.nextInt(trial < 2000 ? 60 : MAX_LEN - 2);
            int[] a = randomMountain(random, n, 1 + random.nextInt(n - 2), trial % 2 == 0 ? 3 * n : MAX_V);
            for (int k = 0; k < 6; k++) {
                int target = random.nextInt(4) == 0 ? random.nextInt(MAX_V + 1) : a[random.nextInt(n)];
                check(a, target, null);
            }
            check(a, a[peakOf(a)], null);
        }

        // Largest length: target at the peak, on both sides, only on one side, absent
        for (int peak : new int[] {1, 2, 4999, 5000, 8191, 9997, MAX_LEN - 2}) {
            int[] a = new int[MAX_LEN];
            for (int i = 0; i <= peak; i++) a[i] = 2 * i;                          // even values going up
            for (int i = peak + 1; i < MAX_LEN; i++) a[i] = 2 * peak - 1 - 2 * (i - peak - 1); // odd values going down
            int shift = Math.max(0, -a[MAX_LEN - 1]);                              // keep every value >= 0
            for (int i = 0; i < MAX_LEN; i++) a[i] += shift;
            check(a, a[peak], peak);
            check(a, a[0], 0);
            check(a, a[MAX_LEN - 1], null);
            check(a, a[peak + 1], null);
            check(a, a[peak] + 1, -1);
            for (int k = 0; k < 200; k++) {
                check(a, a[0] - 1 + random.nextInt(a[peak] - a[0] + 3), null); // hits and misses on both sides
            }
        }
        // The worst case for get calls in section 4 (54 for Approach 1): peak at 4102, a target missing from both
        // sides, below index 511 on the way up and just after index 4105 on the way down.
        int[] worst = new int[MAX_LEN];
        int worstTarget = 100_000 * 511 - 50_000;
        for (int i = 0; i <= 4102; i++) worst[i] = 100_000 * i;
        for (int i = 4103; i < MAX_LEN; i++) worst[i] = i < 4106 ? worstTarget + (4106 - i) : worstTarget - (i - 4105);
        check(worst, worstTarget, -1);
        check(worst, worstTarget + 1, 4105);
        check(worst, worstTarget - 1, 4106);
        int[] wide = new int[MAX_LEN];                                    // values reaching 10^9
        for (int i = 0; i <= 5000; i++) wide[i] = MAX_V - 2 * (5000 - i);
        for (int i = 5001; i < MAX_LEN; i++) wide[i] = MAX_V - 2 * (i - 5000) + 1;
        check(wide, MAX_V, 5000);
        check(wide, MAX_V - 2, 4999);
        check(wide, MAX_V - 1, 5001);
        check(wide, 0, -1);
        int[] twins = new int[MAX_LEN];                                   // every value but the peak appears twice
        for (int i = 0; i <= 4999; i++) twins[i] = i;
        for (int i = 5000; i < MAX_LEN; i++) twins[i] = MAX_LEN - 1 - i;
        twins[4999] = 5000;
        twins[5000] = 4999;                                               // keep it strictly decreasing after the peak
        for (int t = 0; t <= 5001; t += 7) check(twins, t, null);

        System.out.println("PASS " + cases + " cases (most get calls in one case: " + maxCalls + ")");
    }

    static boolean isMountain(int[] a) {
        int i = 0;
        while (i + 1 < a.length && a[i] < a[i + 1]) i++;
        if (i == 0 || i == a.length - 1) return false;
        while (i + 1 < a.length && a[i] > a[i + 1]) i++;
        return i == a.length - 1;
    }

    static int peakOf(int[] a) {
        int p = 0;
        while (a[p] < a[p + 1]) p++;
        return p;
    }

    /** A strictly increasing run up to index peak, then strictly decreasing, values in [0, top]. */
    static int[] randomMountain(Random random, int n, int peak, int top) {
        int[] a = new int[n];
        int[] up = distinctSorted(random, peak + 1, top);
        int[] down = distinctSorted(random, n - peak, up[peak]); // reuse the peak value as the top of the descent
        for (int i = 0; i <= peak; i++) a[i] = up[i];
        for (int i = 1; i < n - peak; i++) a[peak + i] = down[n - peak - 1 - i];
        return a;
    }

    /** count distinct values in [0, top] sorted ascending, the last one equal to top when count > 1 and room allows. */
    static int[] distinctSorted(Random random, int count, int top) {
        java.util.TreeSet<Integer> set = new java.util.TreeSet<>();
        set.add(top);
        while (set.size() < count) set.add(random.nextInt(top));
        int[] out = new int[count];
        int i = 0;
        for (int v : set) out[i++] = v;
        return out;
    }

    static int reference(int[] a, int target) {
        for (int i = 0; i < a.length; i++) {
            if (a[i] == target) return i;
        }
        return -1;
    }

    static void check(int[] a, int target, Integer expected) {
        // Guard: reject inputs that break the problem's guarantees.
        if (a.length < 3 || a.length > MAX_LEN || !isMountain(a) || target < 0 || target > MAX_V) {
            throw new IllegalStateException("bad test case: not a valid mountain or target out of range");
        }
        for (int v : a) {
            if (v < 0 || v > MAX_V) throw new IllegalStateException("bad test case: value " + v + " out of range");
        }
        int want = reference(a, target);
        if (expected != null && expected != want) {
            throw new IllegalStateException("bad test case: expected " + expected + " but the reference says " + want);
        }
        CountingMountain mountain = new CountingMountain(a);
        int got = new Solution().findInMountainArray(target, mountain);
        if (got != want) {
            throw new AssertionError("length " + a.length + ", target " + target + ": expected " + want + " but got " + got);
        }
        maxCalls = Math.max(maxCalls, mountain.calls);
        cases++;
    }
}
