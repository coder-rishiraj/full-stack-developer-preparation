import java.math.BigInteger;
import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Product of Array Except Self page (run by
 * `npm run problems:verify`). Each approach is compiled together with this file and must pass all cases.
 * Expected answers come from an independent BigInteger brute force; inputs that break the statement's
 * 32-bit guarantees are rejected.
 */
class Tests {
    static final BigInteger INT_MIN = BigInteger.valueOf(Integer.MIN_VALUE);
    static final BigInteger INT_MAX = BigInteger.valueOf(Integer.MAX_VALUE);
    static int cases = 0;

    static boolean fitsInt(BigInteger x) {
        return x.compareTo(INT_MIN) >= 0 && x.compareTo(INT_MAX) <= 0;
    }

    /** True when the input meets every guarantee of the statement. */
    static boolean valid(int[] nums) {
        int n = nums.length;
        if (n < 2 || n > 100_000) return false;
        for (int v : nums) {
            if (v < -30 || v > 30) return false;
        }
        BigInteger p = BigInteger.ONE;
        for (int v : nums) {
            p = p.multiply(BigInteger.valueOf(v));
            if (!fitsInt(p)) return false; // some prefix product overflows
        }
        BigInteger s = BigInteger.ONE;
        for (int i = n - 1; i >= 0; i--) {
            s = s.multiply(BigInteger.valueOf(nums[i]));
            if (!fitsInt(s)) return false; // some suffix product overflows
        }
        // Every answer must fit too: with a zero at i, answer[i] is not bounded by any prefix or suffix.
        for (BigInteger a : answers(nums)) {
            if (!fitsInt(a)) return false;
        }
        return true;
    }

    /** answer[i] = (product before i) * (product after i), exactly, in BigInteger. */
    static BigInteger[] answers(int[] nums) {
        int n = nums.length;
        BigInteger[] before = new BigInteger[n + 1];
        before[0] = BigInteger.ONE;
        for (int i = 0; i < n; i++) before[i + 1] = before[i].multiply(BigInteger.valueOf(nums[i]));
        BigInteger[] after = new BigInteger[n + 1];
        after[n] = BigInteger.ONE;
        for (int i = n - 1; i >= 0; i--) after[i] = after[i + 1].multiply(BigInteger.valueOf(nums[i]));
        BigInteger[] result = new BigInteger[n];
        for (int i = 0; i < n; i++) result[i] = before[i].multiply(after[i + 1]);
        return result;
    }

    /** Reference answers: a literal "multiply all others" brute force for small n, exact products otherwise. */
    static int[] reference(int[] nums) {
        int n = nums.length;
        int[] answer = new int[n];
        if (n <= 300) {
            for (int i = 0; i < n; i++) {
                BigInteger a = BigInteger.ONE;
                for (int j = 0; j < n; j++) {
                    if (j != i) a = a.multiply(BigInteger.valueOf(nums[j]));
                }
                answer[i] = a.intValueExact();
            }
        } else {
            BigInteger[] exact = answers(nums);
            for (int i = 0; i < n; i++) answer[i] = exact[i].intValueExact();
        }
        return answer;
    }

    static void check(int[] nums, int[] expected) {
        if (!valid(nums)) throw new IllegalStateException("bad test case: breaks the statement's guarantees, n = " + nums.length);
        int[] want = reference(nums);
        if (expected != null && !Arrays.equals(expected, want)) {
            throw new IllegalStateException("bad test case: expected " + Arrays.toString(expected) + " should be " + Arrays.toString(want));
        }
        int[] input = nums.clone();
        int[] got = new Solution().productExceptSelf(input);
        if (!Arrays.equals(input, nums)) throw new AssertionError("nums was modified");
        if (!Arrays.equals(got, want)) {
            String shown = nums.length <= 20 ? Arrays.toString(nums) : "n = " + nums.length;
            throw new AssertionError(shown + ": expected " + (want.length <= 20 ? Arrays.toString(want) : "...")
                    + " but got " + (got.length <= 20 ? Arrays.toString(got) : "a different array"));
        }
        cases++;
    }

    static void check(int[] nums) {
        check(nums, null);
    }

    public static void main(String[] args) {
        // Examples and dry runs (sections 1, 4 and 7)
        check(new int[] {2, 3, 4, 5}, new int[] {60, 40, 30, 24});
        check(new int[] {3, 0, -2, 4}, new int[] {0, -24, 0, 0});
        check(new int[] {1, 2, 3, 4}, new int[] {24, 12, 8, 6});
        check(new int[] {-1, 1, 0, -3, 3}, new int[] {0, 0, 9, 0, 0});

        // Edge cases from section 3, traced in section 7
        check(new int[] {0, 5, 0}, new int[] {0, 0, 0});          // two zeros
        check(new int[] {-1, 2, -3}, new int[] {-6, 3, -2});      // negatives
        check(new int[] {7, -3}, new int[] {-3, 7});              // n = 2
        check(new int[] {0, 0}, new int[] {0, 0});
        check(new int[] {0, 9}, new int[] {9, 0});                // n = 2, one zero
        check(new int[] {5, 0, 0, 5}, new int[] {0, 0, 0, 0});
        check(new int[] {0, 0, 0, 0, 0}, new int[] {0, 0, 0, 0, 0});
        check(new int[] {-30, 30}, new int[] {30, -30});           // value extremes
        check(new int[] {1, 1, 1}, new int[] {1, 1, 1});
        check(new int[] {-1, -1, -1, -1}, new int[] {-1, -1, -1, -1});
        check(new int[] {30, 30, 30, 30, 30, 30}, new int[] {24_300_000, 24_300_000, 24_300_000, 24_300_000, 24_300_000, 24_300_000});
        check(new int[] {0, 30, 30, 30, 30, 30, 30});              // one zero first: answer[0] = 30^6
        check(new int[] {30, 30, 30, 30, 0, 30, 30, 30, 30, 0}, new int[10]); // brute force overflows mid-product (section 4)

        // Products close to the 32-bit limits: 2^30 and -2^31 as answers
        int[] pow = new int[31];
        Arrays.fill(pow, 2);
        pow[0] = 1;
        check(pow);                                                // answer[0] = 2^30
        int[] negPow = new int[32];
        Arrays.fill(negPow, 2);
        negPow[0] = 1;
        negPow[1] = -2;
        check(negPow);                                             // answer[0] = -2^31 = Integer.MIN_VALUE
        // The guard really rejects an input whose prefix product overflows
        boolean rejected = false;
        try {
            int[] tooBig = new int[33];
            Arrays.fill(tooBig, 2);
            check(tooBig);
        } catch (IllegalStateException expected) {
            rejected = true;
        }
        if (!rejected) throw new AssertionError("the guard did not reject an overflowing input");

        // Largest input: n = 10^5, mostly +-1, a few small factors, no zeros
        Random random = new Random(20261113L);
        int n = 100_000;
        int[] big = new int[n];
        for (int i = 0; i < n; i++) big[i] = random.nextBoolean() ? 1 : -1;
        for (int k = 0; k < 20; k++) big[random.nextInt(n)] = 2;
        big[random.nextInt(n)] = -30;
        big[random.nextInt(n)] = 3;
        check(big);

        // Large input with exactly two zeros (all answers 0) and with exactly one zero
        int[] twoZeros = new int[30_000];
        for (int i = 0; i < twoZeros.length; i++) twoZeros[i] = random.nextBoolean() ? 1 : -1;
        twoZeros[123] = 0;
        twoZeros[29_000] = 0;
        twoZeros[5] = 30;
        check(twoZeros);
        int[] oneZero = twoZeros.clone();
        oneZero[123] = 7;
        check(oneZero);

        // Random inputs meeting the guarantees, checked against the reference
        int made = 0;
        while (made < 4000) {
            int len = 2 + random.nextInt(made < 3000 ? 8 : 40);
            int bound = random.nextInt(4) == 0 ? 30 : 3;
            int[] nums = new int[len];
            for (int i = 0; i < len; i++) {
                nums[i] = random.nextInt(2 * bound + 1) - bound;
                if (random.nextInt(4) != 0 && bound == 3) nums[i] = random.nextBoolean() ? 1 : -1;
            }
            if (!valid(nums)) continue; // regenerate inputs that break the 32-bit guarantee
            check(nums);
            made++;
        }

        System.out.println("PASS " + cases + " cases");
    }
}
