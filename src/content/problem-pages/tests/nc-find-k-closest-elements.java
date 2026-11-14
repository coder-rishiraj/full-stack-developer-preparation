import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Find K Closest Elements page (run by `npm run problems:verify`).
 * Expected answers come from an independent reference: sort all values by (|a - x|, a), take k, sort ascending.
 * Equal keys only occur for equal values, so the expected list of values is unique.
 */
class Tests {
    static final int MAX_N = 10_000;
    static final int MAX_V = 10_000;
    static int cases = 0;

    static List<Integer> reference(int[] arr, int k, int x) {
        Integer[] all = new Integer[arr.length];
        for (int i = 0; i < arr.length; i++) all[i] = arr[i];
        Arrays.sort(all, (a, b) -> {
            int da = Math.abs(a - x), db = Math.abs(b - x);
            return da != db ? Integer.compare(da, db) : Integer.compare(a, b);
        });
        List<Integer> out = new ArrayList<>(Arrays.asList(all).subList(0, k));
        out.sort(null);
        return out;
    }

    static void check(int[] arr, int k, int x, int[] expected) {
        int n = arr.length;
        if (n < 1 || n > MAX_N) throw new IllegalStateException("bad test case: n = " + n);
        if (k < 1 || k > n) throw new IllegalStateException("bad test case: k = " + k);
        if (x < -MAX_V || x > MAX_V) throw new IllegalStateException("bad test case: x = " + x);
        for (int i = 0; i < n; i++) {
            if (arr[i] < -MAX_V || arr[i] > MAX_V) throw new IllegalStateException("bad test case: value " + arr[i]);
            if (i > 0 && arr[i - 1] > arr[i]) throw new IllegalStateException("bad test case: arr not sorted");
        }
        List<Integer> want = reference(arr, k, x);
        if (expected != null) {
            List<Integer> given = new ArrayList<>();
            for (int v : expected) given.add(v);
            if (!given.equals(want)) throw new IllegalStateException("bad test case: expected " + given + " should be " + want);
        }
        int[] input = arr.clone();
        List<Integer> got = new Solution().findClosestElements(input, k, x);
        if (!Arrays.equals(input, arr)) throw new AssertionError("arr was modified");
        if (!want.equals(got)) {
            String shown = n <= 20 ? Arrays.toString(arr) : "n = " + n;
            String gotShown = got == null ? "null" : (got.size() <= 20 ? got.toString() : "size " + got.size());
            throw new AssertionError(shown + ", k = " + k + ", x = " + x + ": expected "
                    + (want.size() <= 20 ? want.toString() : "size " + want.size()) + " but got " + gotShown);
        }
        cases++;
    }

    static void check(int[] arr, int k, int x) {
        check(arr, k, x, null);
    }

    static int[] sortedRandom(Random random, int n, int lo, int hi) {
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = lo + random.nextInt(hi - lo + 1);
        Arrays.sort(a);
        return a;
    }

    public static void main(String[] args) {
        // Examples and dry runs (sections 1, 4 and 7)
        check(new int[] {1, 2, 3, 4, 5}, 4, 3, new int[] {1, 2, 3, 4});           // tie between the ends (`>=` gives 2..5)
        check(new int[] {1, 1, 2, 3, 4, 5}, 4, -1, new int[] {1, 1, 2, 3});       // x below everything
        check(new int[] {1, 3, 5, 7, 9, 11}, 3, 6, new int[] {3, 5, 7});
        check(new int[] {1, 1, 2, 2, 2, 2, 2, 3, 3}, 3, 3, new int[] {2, 3, 3});  // duplicates (abs version gives 2, 2, 2)

        // Edge cases from section 3, traced in section 7, and the inputs behind the claimed bugs
        check(new int[] {1, 2, 3, 4, 5}, 2, 100, new int[] {4, 5});               // x above everything
        check(new int[] {1, 2, 3}, 2, 2, new int[] {1, 2});                       // x exactly between
        check(new int[] {1, 2, 3}, 2, 5, new int[] {2, 3});                       // hi = n - 1 would read arr[3]
        check(new int[] {1, 2, 4, 5}, 1, 3, new int[] {2});                       // k = 1 with a tie
        check(new int[] {1, 2, 3, 4, 5}, 5, 3, new int[] {1, 2, 3, 4, 5});        // k = n
        check(new int[] {7}, 1, -10_000, new int[] {7});                          // n = 1
        check(new int[] {1, 1, 1, 10, 10, 10}, 3, 5, new int[] {1, 1, 1});        // x nearer the smaller run
        check(new int[] {1, 1, 1, 10, 10, 10}, 4, 6, new int[] {1, 10, 10, 10});
        check(new int[] {0, 0, 1, 1, 1, 2, 2}, 3, 1, new int[] {1, 1, 1});
        check(new int[] {3, 3, 3, 3}, 2, 3, new int[] {3, 3});
        check(new int[] {1, 1, 1, 1, 2, 2}, 2, 5, new int[] {2, 2});              // duplicates below x
        check(new int[] {5, 5, 6, 6, 6}, 2, 0, new int[] {5, 5});                 // duplicates above x
        check(new int[] {-10_000, 10_000}, 1, 0, new int[] {-10_000});            // value extremes, tie
        check(new int[] {-10_000, 10_000}, 1, 10_000, new int[] {10_000});

        // Constraint extremes: n = 10^4
        int[] all = new int[MAX_N];
        for (int i = 0; i < MAX_N; i++) all[i] = -5000 + i;
        check(all, 1, 10_000);
        check(all, 1, -10_000);
        check(all, MAX_N, 0);
        check(all, 5000, 0);
        check(all, 7, 1234);
        int[] same = new int[MAX_N];
        Arrays.fill(same, -10_000);
        check(same, 3333, 10_000);
        int[] twoValues = new int[MAX_N];
        for (int i = 0; i < MAX_N; i++) twoValues[i] = i < MAX_N / 2 ? -1 : 1;
        check(twoValues, 6000, 0);                                                // all ties: the -1s first
        Random random = new Random(20261114L);
        for (int t = 0; t < 6; t++) {
            int[] arr = t < 3 ? sortedRandom(random, MAX_N, -MAX_V, MAX_V) : sortedRandom(random, MAX_N, -20, 20);
            check(arr, 1 + random.nextInt(MAX_N), random.nextInt(2 * MAX_V + 1) - MAX_V);
            check(arr, 1 + random.nextInt(50), random.nextInt(61) - 30);
        }

        // Random small inputs with many duplicates, against the reference
        for (int t = 0; t < 6000; t++) {
            int n = 1 + random.nextInt(t < 5000 ? 12 : 200);
            int spread = random.nextInt(3) == 0 ? MAX_V : 1 + random.nextInt(6);
            int[] arr = sortedRandom(random, n, -spread, spread);
            int x = Math.max(-MAX_V, Math.min(MAX_V, random.nextInt(2 * spread + 5) - spread - 2));
            check(arr, 1 + random.nextInt(n), x);
        }

        System.out.println("PASS " + cases + " cases");
    }
}
