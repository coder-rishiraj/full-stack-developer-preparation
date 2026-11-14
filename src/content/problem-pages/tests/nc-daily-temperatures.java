import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Daily Temperatures page (run by `npm run problems:verify`).
 * Small and random inputs are checked against the direct forward scan; large structured inputs against
 * answers computed from their shape, and large random inputs against a sparse table of range maxima with
 * a binary search, which shares no idea with the stack, the table or the backward jumps.
 */
class Tests {
    static int cases = 0;
    static final int N = 100_000;
    static final int LO = 30;
    static final int HI = 100;

    public static void main(String[] args) {
        // Examples in section 1 and the dry-run input in section 4
        check(new int[] {73, 74, 75, 71, 69, 72, 76, 73}, new int[] {1, 1, 4, 2, 1, 1, 0, 0});
        check(new int[] {30, 40, 50, 60}, new int[] {1, 1, 1, 0});
        check(new int[] {30, 60, 90}, new int[] {1, 1, 0});

        // Edge cases from sections 3, 7 and 11
        check(new int[] {50}, new int[] {0});                                   // n = 1
        check(new int[] {70, 70, 71}, new int[] {2, 1, 0});                     // `<=` returns [1, 1, 0]
        check(new int[] {100, 90, 90, 30}, new int[] {0, 0, 0, 0});             // non-increasing
        check(new int[] {30, 100}, new int[] {1, 0});
        check(new int[] {100, 30}, new int[] {0, 0});
        check(new int[] {30, 30, 30}, new int[] {0, 0, 0});
        check(new int[] {50, 40, 30, 60}, new int[] {3, 2, 1, 0});              // one day settles three
        check(new int[] {50, 40, 50, 60}, new int[] {3, 1, 1, 0});

        // Every array of length 1..8 over {30, 31, 32, 100}
        int[] alphabet = {LO, LO + 1, LO + 2, HI};
        for (int len = 1; len <= 8; len++) {
            int total = 1 << (2 * len);
            for (int code = 0; code < total; code++) {
                int[] t = new int[len];
                int c = code;
                for (int i = 0; i < len; i++) {
                    t[i] = alphabet[c & 3];
                    c >>= 2;
                }
                check(t, bruteForce(t));
            }
        }

        // Random inputs against the forward scan
        Random random = new Random(20261114L);
        for (int trial = 0; trial < 5_000; trial++) {
            int n = 1 + random.nextInt(300);
            int range = trial % 3 == 0 ? 3 : HI - LO + 1;
            int[] t = new int[n];
            for (int i = 0; i < n; i++) {
                t[i] = LO + random.nextInt(range);
            }
            check(t, bruteForce(t));
        }

        // Large structured inputs, n = 10^5, with answers known from their shape
        int[] equal = new int[N];
        Arrays.fill(equal, HI);
        check(equal, new int[N]);                                               // stack grows to n
        int[] nonIncreasing = new int[N];
        for (int i = 0; i < N; i++) {
            nonIncreasing[i] = HI - (int) ((long) i * (HI - LO) / N);
        }
        check(nonIncreasing, new int[N]);
        int[] coldThenHot = new int[N];                                         // n - 1 days of 30, then 100
        Arrays.fill(coldThenHot, LO);
        coldThenHot[N - 1] = HI;
        int[] expected = new int[N];
        for (int i = 0; i < N - 1; i++) {
            expected[i] = N - 1 - i;
        }
        check(coldThenHot, expected);
        int[] hotFirst = coldThenHot.clone();                                   // a 100 first never settles
        hotFirst[0] = HI;
        int[] expectedHot = expected.clone();
        expectedHot[0] = 0;
        check(hotFirst, expectedHot);
        int[] zigzag = new int[N];
        int[] zigzagExpected = new int[N];
        for (int i = 0; i < N; i++) {
            zigzag[i] = i % 2 == 0 ? LO : HI;
            zigzagExpected[i] = i % 2 == 0 ? 1 : 0;
        }
        zigzagExpected[N - 1] = 0;
        check(zigzag, zigzagExpected);

        // Large random inputs against the sparse-table reference
        for (int trial = 0; trial < 4; trial++) {
            int[] t = new int[N];
            for (int i = 0; i < N; i++) {
                t[i] = trial == 3 ? HI - random.nextInt(3) : LO + random.nextInt(HI - LO + 1);
            }
            check(t, sparseTableReference(t));
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** Direct definition: walk forward from each day. O(n^2), for small inputs only. */
    static int[] bruteForce(int[] t) {
        int[] answer = new int[t.length];
        for (int i = 0; i < t.length; i++) {
            for (int j = i + 1; j < t.length; j++) {
                if (t[j] > t[i]) {
                    answer[i] = j - i;
                    break;
                }
            }
        }
        return answer;
    }

    /** First j > i with t[j] > t[i], by binary search on prefix maxima of t[i+1..], queried with a sparse table. */
    static int[] sparseTableReference(int[] t) {
        int n = t.length;
        int levels = 1;
        while ((1 << levels) <= n) {
            levels++;
        }
        int[][] table = new int[levels][];
        table[0] = t.clone();
        for (int j = 1; j < levels; j++) {
            int span = 1 << j;
            table[j] = new int[Math.max(0, n - span + 1)];
            for (int i = 0; i + span <= n; i++) {
                table[j][i] = Math.max(table[j - 1][i], table[j - 1][i + span / 2]);
            }
        }
        int[] answer = new int[n];
        for (int i = 0; i + 1 < n; i++) {
            if (rangeMax(table, i + 1, n - 1) <= t[i]) {
                continue;
            }
            int lo = i + 1;
            int hi = n - 1;                                   // smallest hi with max(t[i+1..hi]) > t[i]
            while (lo < hi) {
                int mid = (lo + hi) >>> 1;
                if (rangeMax(table, i + 1, mid) > t[i]) {
                    hi = mid;
                } else {
                    lo = mid + 1;
                }
            }
            answer[i] = lo - i;
        }
        return answer;
    }

    static int rangeMax(int[][] table, int from, int to) {
        int j = 31 - Integer.numberOfLeadingZeros(to - from + 1);
        return Math.max(table[j][from], table[j][to - (1 << j) + 1]);
    }

    static void check(int[] t, int[] expected) {
        String label = Arrays.toString(t.length <= 12 ? t : Arrays.copyOf(t, 12)) + (t.length > 12 ? "...(n=" + t.length + ")" : "");
        // Guard against a wrong test: 1 <= n <= 10^5 and 30 <= temperatures[i] <= 100.
        if (t.length < 1 || t.length > N) {
            throw new IllegalStateException(label + ": bad test case, n out of range");
        }
        for (int x : t) {
            if (x < LO || x > HI) {
                throw new IllegalStateException(label + ": bad test case, temperature " + x + " out of range");
            }
        }
        if (expected.length != t.length) {
            throw new IllegalStateException(label + ": bad test case, expected has the wrong length");
        }
        int[] given = t.clone();
        int[] got = new Solution().dailyTemperatures(given);
        if (!Arrays.equals(got, expected)) {
            throw new AssertionError(label + ": expected " + abbreviate(expected) + ", got " + abbreviate(got));
        }
        if (!Arrays.equals(given, t)) {
            throw new AssertionError(label + ": the input array was modified");
        }
        cases++;
    }

    static String abbreviate(int[] a) {
        return a.length <= 12 ? Arrays.toString(a) : Arrays.toString(Arrays.copyOf(a, 12)) + "...(" + a.length + ")";
    }
}
