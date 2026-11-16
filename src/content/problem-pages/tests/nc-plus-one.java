import java.math.BigInteger;
import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Plus One page (run by `npm run problems:verify`).
 * Each approach is compiled together with this file and must pass all cases.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples from the statement and section 1, and the dry-run inputs
        check(1, 2, 3);
        check(4, 3, 2, 1);
        check(9);
        check(1, 2, 9);
        check(9, 9);
        check(1, 9, 9);

        // Edge cases from sections 3 and 7
        check(0);                       // zero
        check(8);
        check(9, 9, 9);
        check(1, 0, 9);
        check(9, 0, 9);
        check(9, 8, 7, 6, 5, 4, 3, 2, 1, 0);                              // overflows int
        check(9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0); // overflows long

        // All nines for every length 1..100 (the answer grows), and 1 followed by nines
        for (int n = 1; n <= 100; n++) {
            int[] nines = new int[n];
            Arrays.fill(nines, 9);
            check(nines);
            int[] oneThenNines = nines.clone();
            oneThenNines[0] = 1;
            check(oneThenNines);
        }

        // Largest length with no carry, and with a carry stopping in the middle
        int[] big = new int[100];
        for (int i = 0; i < 100; i++) big[i] = 1 + i % 9;
        check(big);
        int[] mid = new int[100];
        Arrays.fill(mid, 9);
        mid[0] = 5;
        mid[50] = 3;
        check(mid);

        // Random inputs against BigInteger
        Random random = new Random(20261116L);
        for (int t = 0; t < 3000; t++) {
            int n = 1 + random.nextInt(t < 2000 ? 8 : 100);
            int[] d = new int[n];
            for (int i = 0; i < n; i++) {
                // bias towards 9 so carries of every length appear
                d[i] = random.nextInt(3) == 0 ? 9 : random.nextInt(10);
            }
            if (n > 1 && d[0] == 0) d[0] = 1 + random.nextInt(9);
            check(d);
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** Independent reference: BigInteger arithmetic. */
    static int[] expected(int[] digits) {
        StringBuilder sb = new StringBuilder();
        for (int d : digits) sb.append(d);
        String s = new BigInteger(sb.toString()).add(BigInteger.ONE).toString();
        int[] out = new int[s.length()];
        for (int i = 0; i < s.length(); i++) out[i] = s.charAt(i) - '0';
        return out;
    }

    static void check(int... digits) {
        String label = Arrays.toString(digits);
        // Guard against a wrong test: 1 <= length <= 100, digits 0..9, no leading zero.
        if (digits.length < 1 || digits.length > 100) {
            throw new IllegalStateException(label + ": bad test case, length out of range");
        }
        for (int d : digits) {
            if (d < 0 || d > 9) throw new IllegalStateException(label + ": bad test case, not a digit");
        }
        if (digits.length > 1 && digits[0] == 0) {
            throw new IllegalStateException(label + ": bad test case, leading zero");
        }
        int[] want = expected(digits);
        int[] got = new Solution().plusOne(digits.clone());
        if (!Arrays.equals(want, got)) {
            throw new AssertionError(label + ": expected " + Arrays.toString(want) + " but got " + Arrays.toString(got));
        }
        cases++;
    }
}
