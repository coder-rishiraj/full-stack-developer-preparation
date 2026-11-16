import java.math.BigInteger;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Multiply Strings page (run by `npm run problems:verify`).
 * The expected product comes from java.math.BigInteger (allowed in the tests, not in the
 * solutions). Covers the examples, every dry-run and edge-case input, every pair of numbers in
 * [0, 120], products of powers of ten, all-nines inputs up to the 200-digit limit, and random
 * inputs of every length combination. It also re-checks the numbers the page states about the
 * buggy variants and about long overflow.
 */
class Tests {
    static int cases = 0;

    static void validInput(String s) {
        if (s.length() < 1 || s.length() > 200) throw new IllegalStateException("bad test case: length " + s.length());
        for (char c : s.toCharArray()) if (c < '0' || c > '9') throw new IllegalStateException("bad test case: " + s);
        if (s.length() > 1 && s.charAt(0) == '0') throw new IllegalStateException("bad test case: leading zero in " + s);
    }

    static void check(String a, String b, String expected) {
        validInput(a);
        validInput(b);
        String want = new BigInteger(a).multiply(new BigInteger(b)).toString();
        if (expected != null && !expected.equals(want)) throw new IllegalStateException("bad test case: " + a + " * " + b + " is " + want);
        String got = new Solution().multiply(a, b);
        if (!want.equals(got)) throw new AssertionError(a + " * " + b + ": expected " + want + " but got " + got);
        cases++;
    }

    static void check(String a, String b) {
        check(a, b, null);
    }

    static String randomNumber(Random random, int length) {
        StringBuilder sb = new StringBuilder();
        sb.append((char) ('1' + random.nextInt(9)));
        for (int i = 1; i < length; i++) sb.append((char) ('0' + random.nextInt(10)));
        return sb.toString();
    }

    static void claim(boolean ok, String what) {
        if (!ok) throw new AssertionError("page claim is wrong: " + what);
    }

    // Buggy variants described on the page
    static String digits(int[] pos, boolean strip, boolean zeroFallback) {
        StringBuilder sb = new StringBuilder();
        for (int d : pos) {
            if (strip && sb.length() == 0 && d == 0) continue;
            sb.append(d);
        }
        return zeroFallback && sb.length() == 0 ? "0" : sb.toString();
    }

    static int[] slots(String a, String b, boolean leftToRight) {
        int m = a.length(), n = b.length();
        int[] pos = new int[m + n];
        for (int ii = 0; ii < m; ii++) {
            int i = leftToRight ? ii : m - 1 - ii;
            for (int jj = 0; jj < n; jj++) {
                int j = leftToRight ? jj : n - 1 - jj;
                int sum = (a.charAt(i) - '0') * (b.charAt(j) - '0') + pos[i + j + 1];
                pos[i + j] += sum / 10;
                pos[i + j + 1] = sum % 10;
            }
        }
        return pos;
    }

    static String onesAtIPlusJ(String a, String b) {
        int m = a.length(), n = b.length();
        int[] pos = new int[m + n];
        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                int sum = (a.charAt(i) - '0') * (b.charAt(j) - '0') + pos[i + j];
                pos[i + j] = sum % 10;
                if (i + j > 0) pos[i + j - 1] += sum / 10;
            }
        }
        return digits(pos, true, true);
    }

    static int maxSum = 0, maxCell = 0, maxAccumulated = 0;

    static void instrument(String a, String b) {
        int m = a.length(), n = b.length();
        int[] pos = new int[m + n];
        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                int sum = (a.charAt(i) - '0') * (b.charAt(j) - '0') + pos[i + j + 1];
                maxSum = Math.max(maxSum, sum);
                pos[i + j] += sum / 10;
                pos[i + j + 1] = sum % 10;
                maxCell = Math.max(maxCell, pos[i + j]);
            }
        }
        int[] acc = new int[m + n];
        for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) acc[i + j + 1] += (a.charAt(i) - '0') * (b.charAt(j) - '0');
        for (int v : acc) maxAccumulated = Math.max(maxAccumulated, v);
    }

    public static void main(String[] args) {
        // Examples (section 1)
        check("2", "3", "6");
        check("123", "456", "56088");

        // Dry runs and edge cases (sections 3, 4, 7, 9)
        check("0", "52", "0");
        check("52", "0", "0");
        check("0", "0", "0");
        check("9", "9", "81");
        check("99", "99", "9801");
        check("999", "999", "998001");
        check("10", "10", "100");
        check("1", "1", "1");
        check("12", "34", "408");
        check("9999999999", "9999999999", "99999999980000000001");
        String nines = "9".repeat(200);
        String expectedMax = "9".repeat(199) + "8" + "0".repeat(199) + "1";
        check(nines, nines, expectedMax);
        check("1" + "0".repeat(199), "1" + "0".repeat(199), "1" + "0".repeat(398));
        check("1", nines);
        check("0", nines, "0");

        // Claims stated on the page
        claim(digits(slots("123", "456", false), false, false).equals("056088"), "no strip gives 056088");
        claim(digits(slots("0", "52", false), true, false).isEmpty(), "no zero fallback gives empty string");
        claim(onesAtIPlusJ("123", "456").equals("560880") && onesAtIPlusJ("2", "3").equals("60"), "ones at i + j");
        claim(digits(slots("123", "456", true), true, true).equals("551088"), "left to right gives 551088");
        claim(digits(slots("99", "99", true), true, true).equals("817101"), "left to right gives 817101 for 99 * 99");
        claim(9_999_999_999L * 9_999_999_999L == 7_766_279_611_452_241_921L, "long square of 9,999,999,999 wraps");
        boolean threw = false;
        try {
            Long.parseLong("99999999999999999999");
        } catch (NumberFormatException e) {
            threw = true;
        }
        claim(threw, "Long.parseLong throws at 20 digits");
        threw = false;
        try {
            Integer.parseInt("12345678901");
        } catch (NumberFormatException e) {
            threw = true;
        }
        claim(threw, "Integer.parseInt throws at 11 digits");

        // Every pair in [0, 120]
        for (int a = 0; a <= 120; a++) for (int b = 0; b <= 120; b++) check(Integer.toString(a), Integer.toString(b));

        // Powers of ten and all-nines of many lengths, including the 200-digit limit
        for (int la = 1; la <= 200; la += 7) {
            for (int lb = 1; lb <= 200; lb += 11) {
                check("9".repeat(la), "9".repeat(lb));
                check("1" + "0".repeat(la - 1), "1" + "0".repeat(lb - 1));
            }
        }

        // Random inputs of every length combination
        Random random = new Random(20261116L);
        for (int t = 0; t < 4000; t++) {
            String a = randomNumber(random, 1 + random.nextInt(200));
            String b = randomNumber(random, 1 + random.nextInt(200));
            check(a, b);
            instrument(a, b);
        }
        instrument(nines, nines);
        claim(maxSum == 99 && maxCell == 18, "largest sum 99 and cell 18 (got " + maxSum + ", " + maxCell + ")");
        claim(maxAccumulated == 16_200, "accumulated cells at most 16,200 (got " + maxAccumulated + ")");

        System.out.println("PASS " + cases + " cases");
    }
}
